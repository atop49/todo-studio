import {
  format,
  formatDistanceToNowStrict,
  isToday,
  isTomorrow,
  isValid,
  parseISO,
} from "date-fns";
import { zhCN } from "date-fns/locale";

/** 解析 ISO 字符串，空值或非法日期一律返回 null（防御 localStorage 脏数据） */
function safeParse(iso: string | undefined | null): Date | null {
  if (!iso) return null;
  try {
    const date = parseISO(iso);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

/** yyyy-MM-dd → 显示用日期；今天/明天给短词 */
export function formatDueDate(iso: string): string {
  const date = safeParse(iso);
  if (!date) return "无期限";
  if (isToday(date)) return "今天";
  if (isTomorrow(date)) return "明天";
  return format(date, "M月d日", { locale: zhCN });
}

/** 距截止还有多久 / 过了多久（中文相对时间） */
export function formatDueDistance(iso: string): string {
  const date = safeParse(iso);
  if (!date) return "";
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    unit: "day",
    locale: zhCN,
  });
}

/** 是否已过期（未完成才有意义） */
export function isOverdue(iso: string): boolean {
  const date = safeParse(iso);
  if (!date) return false;
  const today = new Date();
  const due = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const now = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return due.getTime() < now.getTime();
}

/** 创建时间 → 时间码风格 HH:MM:SS */
export function formatTimecode(iso: string): string {
  const date = safeParse(iso);
  if (!date) return "--:--:--";
  return format(date, "HH:mm:ss");
}

/** ISO 时间戳 → 列表索引用的两位序号 */
export function toIndexLabel(n: number): string {
  return String(n + 1).padStart(2, "0");
}
