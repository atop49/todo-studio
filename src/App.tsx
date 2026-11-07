import { useEffect, useMemo, useRef, useState } from "react";
import { useTodoStore, selectStats } from "./store";
import { sortTodos, matchesFilters } from "./store";
import { LiveTimecode, RateBar, StatReadout } from "./components/readouts";
import { AddTaskForm, FilterBar } from "./components/filter-bar";
import { TodoList } from "./components/todo-list";

function App() {
  const todos = useTodoStore((s) => s.todos);
  const filters = useTodoStore((s) => s.filters);

  // 选择器返回新数组会触发 useSyncExternalStore 的无限循环检测，
  // 因此在 useMemo 里计算可见列表（依赖都是稳定引用）。
  const visible = useMemo(
    () => sortTodos(todos.filter((t) => matchesFilters(t, filters))),
    [todos, filters],
  );

  const stats = selectStats(todos);
  const prevRate = useRef(stats.rate);
  const [flash, setFlash] = useState(false);

  // 完成率变化 → 读数闪格（信号橙 → 纸白）
  useEffect(() => {
    if (prevRate.current !== stats.rate) {
      prevRate.current = stats.rate;
      setFlash(true);
      const t = window.setTimeout(() => setFlash(false), 450);
      return () => window.clearTimeout(t);
    }
  }, [stats.rate]);

  return (
    <div className="mx-auto min-h-svh w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      {/* 品牌行：大标题 + 实时时间码 */}
      <header className="flex items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[2.75rem] leading-none tracking-[0.04em] text-ink select-none sm:text-5xl">
            待办事项
          </h1>
          <p className="mono-label mt-3">
            TODO STUDIO — 任务剪辑台
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 pb-1">
          <LiveTimecode />
          <span className="mono-label opacity-60">REC · 本地存储</span>
        </div>
      </header>

      {/* 统计面板：监视器读数 */}
      <section
        aria-label="任务统计"
        className="mt-9 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-x-8 gap-y-4 border-y border-hairline py-5"
      >
        <StatReadout value={String(stats.total)} label="总任务 / TASKS" flash={false} />
        <StatReadout value={String(stats.completed)} label="已完成 / DONE" flash={false} />
        <StatReadout
          value={`${Math.round(stats.rate * 100)}%`}
          label="完成率 / RATE"
          flash={flash}
        />
        <div className="col-span-3">
          <RateBar rate={stats.rate} />
        </div>
      </section>

      {/* 筛选栏 */}
      <section aria-label="筛选与搜索" className="mt-7">
        <FilterBar visibleCount={visible.length} />
      </section>

      {/* 新增表单 */}
      <section aria-label="新增任务" className="mt-4">
        <AddTaskForm />
      </section>

      {/* 任务列表 */}
      <main aria-label="任务列表" className="mt-6">
        <TodoList visible={visible} />
      </main>

      <footer className="mono-label mt-10 flex items-center justify-between opacity-50">
        <span>{filters.status === "completed" ? "显示已完成" : filters.status === "active" ? "显示进行中" : "全部条目"}</span>
        <span>数据保存于本机 LocalStorage</span>
      </footer>
    </div>
  );
}

export default App;
