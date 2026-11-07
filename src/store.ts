import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Filters, Todo } from "./types";
import { PRIORITY_ORDER } from "./types";

const STORAGE_KEY = "todo-studio.v1";
const STORAGE_VERSION = 1;

const PRIORITIES = new Set(["high", "medium", "low"]);

/** 清洗一条持久化恢复的任务：字段缺失/类型错误一律回落安全值 */
function sanitizeTodo(raw: unknown): Todo | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const title = typeof r.title === "string" ? r.title.trim() : "";
  if (!title) return null;
  const dueDate =
    typeof r.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.dueDate)
      ? r.dueDate
      : "";
  const createdAt =
    typeof r.createdAt === "string" && r.createdAt
      ? r.createdAt
      : new Date().toISOString();
  return {
    id: typeof r.id === "string" && r.id ? r.id : createId(),
    title,
    description: typeof r.description === "string" ? r.description : "",
    category: typeof r.category === "string" && r.category ? r.category : "未分类",
    priority: typeof r.priority === "string" && PRIORITIES.has(r.priority)
      ? (r.priority as Todo["priority"])
      : "medium",
    dueDate,
    completed: r.completed === true,
    createdAt,
  };
}

interface TodoState {
  todos: Todo[];
  filters: Filters;
  /** Custom categories created by the user, persisted alongside todos */
  customCategories: string[];
  addTodo: (
    input: Pick<Todo, "title"> &
      Partial<Pick<Todo, "description" | "category" | "priority" | "dueDate">>,
  ) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, patch: Partial<Omit<Todo, "id" | "createdAt">>) => void;
  toggleCompleted: (id: string) => void;
  addCategory: (name: string) => void;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
}

export const emptyFilters: Filters = {
  keyword: "",
  category: "all",
  status: "all",
  priority: "all",
};

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** 对一条任务应用筛选条件：关键词（标题+描述模糊、大小写不敏感）+ 分类 + 状态 + 优先级 */
export function matchesFilters(todo: Todo, filters: Filters): boolean {
  const keyword = filters.keyword.trim().toLowerCase();
  if (keyword) {
    const inTitle = todo.title.toLowerCase().includes(keyword);
    const inDescription = todo.description.toLowerCase().includes(keyword);
    if (!inTitle && !inDescription) return false;
  }
  if (filters.category !== "all" && todo.category !== filters.category) {
    return false;
  }
  if (filters.status === "active" && todo.completed) return false;
  if (filters.status === "completed" && !todo.completed) return false;
  if (filters.priority !== "all" && todo.priority !== filters.priority) {
    return false;
  }
  return true;
}

/** 列表排序：优先级降序 → 截止日期近的在前 → 新建的在前 */
export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    const priorityGap = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priorityGap !== 0) return priorityGap;

    const aDate = a.dueDate || null;
    const bDate = b.dueDate || null;
    if (aDate !== bDate) {
      if (aDate === null) return 1;
      if (bDate === null) return -1;
      if (aDate !== bDate) return aDate < bDate ? -1 : 1;
    }

    return b.createdAt.localeCompare(a.createdAt);
  });
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      filters: { ...emptyFilters },
      customCategories: [],

      addTodo: (input) =>
        set((state) => {
          const title = input.title.trim();
          if (!title) return state;
          const category = input.category?.trim() || "未分类";
          const todo: Todo = {
            id: createId(),
            title,
            description: input.description ?? "",
            category,
            priority: input.priority ?? "medium",
            dueDate: input.dueDate ?? "",
            completed: false,
            createdAt: new Date().toISOString(),
          };
          const customCategories =
            category !== "未分类" && !state.customCategories.includes(category)
              ? [...state.customCategories, category]
              : state.customCategories;
          return { todos: [...state.todos, todo], customCategories };
        }),

      removeTodo: (id) =>
        set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),

      updateTodo: (id, patch) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        })),

      toggleCompleted: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ),
        })),

      addCategory: (name) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed || state.customCategories.includes(trimmed)) {
            return state;
          }
          return { customCategories: [...state.customCategories, trimmed] };
        }),

      setFilters: (patch) =>
        set((state) => ({ filters: { ...state.filters, ...patch } })),

      resetFilters: () => set({ filters: { ...emptyFilters } }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<TodoState>;
        return {
          todos: Array.isArray(state.todos)
            ? state.todos
                .map(sanitizeTodo)
                .filter((t): t is Todo => t !== null)
            : [],
          filters: { ...emptyFilters },
          customCategories: Array.isArray(state.customCategories)
            ? state.customCategories.filter(
                (c): c is string => typeof c === "string" && c.trim() !== "",
              )
            : [],
        } as TodoState;
      },
    },
  ),
);

/** 全部可选分类：预设 + 用户自建（持久化），去重 */
export function selectAllCategories(
  custom: readonly string[],
  present: readonly Todo[],
): string[] {
  const fromTodos = present.map((t) => t.category);
  return Array.from(new Set([...fromTodos, ...custom]));
}

/** 统计面板数据 */
export function selectStats(todos: readonly Todo[]): {
  total: number;
  completed: number;
  rate: number;
} {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  return { total, completed, rate: total === 0 ? 0 : completed / total };
}

export function selectVisibleTodos(state: TodoState): Todo[] {
  return sortTodos(state.todos.filter((t) => matchesFilters(t, state.filters)));
}

/** 是否存在生效的筛选条件（用于“清除筛选”入口的显隐） */
export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.keyword.trim() !== "" ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.priority !== "all"
  );
}
