import { useEffect, useRef, useState } from "react";
import { useTodoStore, hasActiveFilters } from "../store";
import { DEFAULT_CATEGORIES, PRIORITY_LABELS } from "../types";
import type { Priority, StatusFilter } from "../types";
import { IconSearch, IconX } from "./icons";

/** 搜索 + 分类 + 状态 + 优先级四路筛选，单行，Zustand 直连 */
export function FilterBar({ visibleCount }: { visibleCount: number }) {
  const filters = useTodoStore((s) => s.filters);
  const setFilters = useTodoStore((s) => s.setFilters);
  const resetFilters = useTodoStore((s) => s.resetFilters);
  const customCategories = useTodoStore((s) => s.customCategories);
  const todos = useTodoStore((s) => s.todos);

  // 可选分类 = 预设 + 已有任务出现的 + 用户自建
  const categories = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...todos.map((t) => t.category),
      ...customCategories,
    ]),
  );

  const active = hasActiveFilters(filters);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cmd/Ctrl+K 聚焦搜索：工具的基本礼仪
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-[13rem] flex-1">
        <IconSearch className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
        <input
          ref={searchRef}
          type="search"
          value={filters.keyword}
          onChange={(e) => setFilters({ keyword: e.target.value })}
          placeholder="搜索标题或描述…  ⌘K"
          aria-label="搜索任务"
          className="field h-9 w-full rounded-none pr-3 pl-9"
        />
      </div>

      <select
        value={filters.category}
        onChange={(e) => setFilters({ category: e.target.value })}
        aria-label="按分类筛选"
        className="field h-9 rounded-none px-3"
      >
        <option value="all">全部分类</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value as StatusFilter })}
        aria-label="按状态筛选"
        className="field h-9 rounded-none px-3"
      >
        <option value="all">全部状态</option>
        <option value="active">进行中</option>
        <option value="completed">已完成</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => setFilters({ priority: e.target.value as Priority | "all" })}
        aria-label="按优先级筛选"
        className="field h-9 rounded-none px-3"
      >
        <option value="all">全部优先级</option>
        {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABELS[p]}
          </option>
        ))}
      </select>

      {active && (
        <button
          type="button"
          onClick={resetFilters}
          className="field flex h-9 items-center gap-1.5 rounded-none px-3 text-muted hover:text-ink"
        >
          <IconX width={11} height={11} />
          清除
        </button>
      )}

      <span className="mono-label ml-auto tabular-nums">
        {visibleCount} 项
      </span>
    </div>
  );
}

/** 新增任务内联表单：常驻列表上方，非弹窗。展开描述/日期/优先级细节。 */
export function AddTaskForm() {
  const addTodo = useTodoStore((s) => s.addTodo);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORIES[0]);
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [expanded, setExpanded] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      titleRef.current?.focus();
      return;
    }
    addTodo({ title, description, category, priority, dueDate });
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    titleRef.current?.focus();
  };

  return (
    <form
      onSubmit={submit}
      className="border border-hairline bg-card/40 transition-colors duration-200 hover:border-hairline-strong"
    >
      <div className="flex items-stretch">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="录入新任务…"
          aria-label="任务标题"
          className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-ink placeholder:text-muted/60 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mono-label px-4 transition-colors duration-150 hover:text-ink"
        >
          {expanded ? "收起" : "细节"}
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex items-center gap-1.5 bg-accent px-4 font-sans text-xs font-semibold tracking-[0.08em] text-ink uppercase transition-opacity duration-150 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
        >
          添加
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-px border-t border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述（可选）"
            aria-label="任务描述"
            className="field h-10 rounded-none border-0 bg-card px-4 text-[13px] focus:border-0"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="任务分类"
            className="field h-10 rounded-none border-0 bg-card px-4 text-[13px] focus:border-0"
          >
            {DEFAULT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="未分类">未分类</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            aria-label="任务优先级"
            className="field h-10 rounded-none border-0 bg-card px-4 text-[13px] focus:border-0"
          >
            {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
              <option key={p} value={p}>
                优先级 · {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="截止日期"
            className="field h-10 rounded-none border-0 bg-card px-4 font-mono text-[13px] focus:border-0"
          />
        </div>
      )}
    </form>
  );
}
