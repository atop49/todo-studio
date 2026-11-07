import { useEffect, useRef, useState } from "react";
import { useTodoStore } from "../store";
import type { Priority, Todo } from "../types";
import { PRIORITY_SHORT } from "../types";
import { formatDueDate, formatDueDistance, formatTimecode, isOverdue, toIndexLabel } from "../lib/format";
import { IconCheck, IconEdit, IconTrash, IconX } from "./icons";

const PRIORITY_DOT: Record<Priority, string> = {
  high: "bg-accent",
  medium: "bg-ink/60",
  low: "bg-muted",
};

/** 优先级徽记：mono 缩写 + 颜色点。唯一允许的颜色语言，不再加边条。 */
function PriorityMark({ priority }: { priority: Priority }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.1em] text-muted">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[priority]}`}
        aria-hidden="true"
      />
      {PRIORITY_SHORT[priority]}
    </span>
  );
}

/** 退出动画：勾选完成或删除时先播 todo-exit 再真正改 store */
function useExitAnimation(onExit: () => void) {
  const [exiting, setExiting] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const trigger = () => {
    if (exiting) return;
    setExiting(true);
    timer.current = window.setTimeout(() => {
      onExit();
    }, 200);
  };

  return { exiting, trigger };
}

function TodoRow({ todo, index }: { todo: Todo; index: number }) {
  const toggleCompleted = useTodoStore((s) => s.toggleCompleted);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const updateTodo = useTodoStore((s) => s.updateTodo);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);

  const overdue = !todo.completed && isOverdue(todo.dueDate);

  const completeExit = useExitAnimation(() => toggleCompleted(todo.id));
  const removeExit = useExitAnimation(() => removeTodo(todo.id));

  const exitClass =
    completeExit.exiting || removeExit.exiting
      ? " todo-exit"
      : " todo-enter";

  const startEdit = () => {
    setDraftTitle(todo.title);
    setEditing(true);
  };

  const commitEdit = () => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      updateTodo(todo.id, { title: trimmed });
    } else {
      setDraftTitle(todo.title);
    }
    setEditing(false);
  };

  return (
    <li
      className={`group border-b border-hairline last:border-b-0${exitClass}`}
      data-todo-id={todo.id}
    >
      <div className="flex items-start gap-4 px-1 py-4 transition-colors duration-150 hover:bg-card/60">
        {/* 时间码索引 */}
        <span className="mt-1 w-8 flex-none font-mono text-[10px] leading-5 tracking-[0.08em] text-muted/70 tabular-nums">
          {toIndexLabel(index)}
        </span>

        {/* 完成勾选：细线方框，完成后填充橙底墨勾 */}
        <button
          type="button"
          onClick={() => {
            if (todo.completed) toggleCompleted(todo.id);
            else completeExit.trigger();
          }}
          aria-pressed={todo.completed}
          aria-label={todo.completed ? `标记「${todo.title}」为未完成` : `完成「${todo.title}」`}
          className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center border transition-colors duration-150"
          style={{
            borderColor: todo.completed ? "var(--accent)" : "var(--hairline-strong)",
            backgroundColor: todo.completed ? "var(--accent)" : "transparent",
          }}
        >
          {todo.completed && <IconCheck width={11} height={11} className="text-ink" />}
        </button>

        {/* 主体 */}
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit();
                  if (e.key === "Escape") {
                    setDraftTitle(todo.title);
                    setEditing(false);
                  }
                }}
                autoFocus
                aria-label="编辑任务标题"
                className="field h-8 min-w-0 flex-1 rounded-none px-2 text-sm"
              />
              <button
                type="button"
                onClick={commitEdit}
                className="mono-label px-1 transition-colors duration-150 hover:text-accent"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftTitle(todo.title);
                  setEditing(false);
                }}
                aria-label="取消编辑"
                className="text-muted transition-colors duration-150 hover:text-ink"
              >
                <IconX width={12} height={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onDoubleClick={startEdit}
              className="block max-w-full truncate text-left text-sm text-ink transition-colors duration-150"
              style={{ color: todo.completed ? "var(--muted)" : undefined }}
              title={todo.title}
            >
              <span
                className={todo.completed ? "line-through decoration-hairline-strong" : undefined}
              >
                {todo.title}
              </span>
            </button>
          )}

          {todo.description && !editing && (
            <p className="mt-1 max-w-[65ch] truncate text-[13px] leading-relaxed text-muted">
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-sans text-[10px] font-medium tracking-[0.1em] text-muted uppercase">
              {todo.category}
            </span>
            <PriorityMark priority={todo.priority} />
            <span
              className={`font-mono text-[10px] tracking-[0.08em] tabular-nums ${
                overdue ? "text-accent" : "text-muted"
              }`}
            >
              {formatDueDate(todo.dueDate)}
              {todo.dueDate && (
                <span className="ml-1.5 opacity-70">{formatDueDistance(todo.dueDate)}</span>
              )}
              {overdue && <span className="ml-1.5">· 逾期</span>}
            </span>
          </div>
        </div>

        {/* 右侧：创建时间码 + 行内操作（hover / focus 显现） */}
        <div className="flex flex-none items-center gap-3">
          <span className="hidden font-mono text-[10px] tracking-[0.08em] text-muted/60 tabular-nums sm:inline">
            {formatTimecode(todo.createdAt)}
          </span>
          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 focus-within:opacity-100 group-hover:opacity-100">
            <button
              type="button"
              onClick={startEdit}
              aria-label={`编辑「${todo.title}」`}
              className="p-1.5 text-muted transition-colors duration-150 hover:text-ink"
            >
              <IconEdit />
            </button>
            <button
              type="button"
              onClick={removeExit.trigger}
              aria-label={`删除「${todo.title}」`}
              className="p-1.5 text-muted transition-colors duration-150 hover:text-accent"
            >
              <IconTrash />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

/** 列表层：可见任务 + 空状态（区分「无任务」与「无匹配」） */
export function TodoList({ visible }: { visible: Todo[] }) {
  const todos = useTodoStore((s) => s.todos);

  if (visible.length === 0) {
    const filtered = todos.length > 0;
    return (
      <div className="border border-hairline px-6 py-16 text-center">
        <p className="font-display text-lg tracking-[0.04em] text-ink/80">
          {filtered ? "没有匹配的任务" : "时间线还是空的"}
        </p>
        <p className="mx-auto mt-2 max-w-[38ch] text-[13px] leading-relaxed text-muted">
          {filtered
            ? "调整关键词或筛选条件，或清除全部筛选。"
            : "在上方录入第一条任务，它会被编入这个剪辑台。"}
        </p>
      </div>
    );
  }

  return (
    <ul className="border-t border-hairline">
      {visible.map((todo, i) => (
        <TodoRow key={todo.id} todo={todo} index={i} />
      ))}
    </ul>
  );
}
