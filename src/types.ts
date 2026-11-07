export type Priority = "high" | "medium" | "low";
export type StatusFilter = "all" | "active" | "completed";

export interface Todo {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  /** ISO date string (yyyy-MM-dd) or empty when unset */
  dueDate: string;
  completed: boolean;
  /** ISO timestamp */
  createdAt: string;
}

export interface Filters {
  keyword: string;
  category: string | "all";
  status: StatusFilter;
  priority: Priority | "all";
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

export const PRIORITY_SHORT: Record<Priority, string> = {
  high: "HI",
  medium: "MD",
  low: "LO",
};

export const DEFAULT_CATEGORIES = ["工作", "学习", "生活", "创作"] as const;

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};
