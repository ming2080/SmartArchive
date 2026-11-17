import type {
  DashboardCategoryShare,
  DashboardReturnReminder,
  DashboardReturnReminderWithStatus,
  ReturnReminderStatus,
} from '../types/archive';

/**
 * 工作台数据驱动：归还提醒状态与档案类型占比由数据生成。
 * 演示基准日与顶部横幅、借阅趋势口径一致（截至 11-04）。
 */
export const DASHBOARD_TODAY = '2026-11-04';

const DAY_MS = 24 * 60 * 60 * 1000;

/** 按日期（YYYY-MM-DD）计算天数差：to - from */
function daysBetween(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00`).getTime();
  const b = new Date(`${to}T00:00:00`).getTime();
  return Math.round((b - a) / DAY_MS);
}

/** 由应还日期相对基准日推导提醒状态：今日到期 / 剩余N天 / 已逾期N天 */
export function getReturnReminderStatus(
  returnDate: string,
  today: string = DASHBOARD_TODAY,
): ReturnReminderStatus {
  const diff = daysBetween(today, returnDate);
  if (diff === 0) return { kind: 'today', label: '今日到期', daysLeft: 0 };
  if (diff > 0) return { kind: 'upcoming', label: `剩余${diff}天`, daysLeft: diff };
  return { kind: 'overdue', label: `已逾期${-diff}天`, daysLeft: diff };
}

/** 归还提醒原始记录：状态不写死，由应还日期推导 */
const returnReminderSources: DashboardReturnReminder[] = [
  { id: 'rr-1', title: '《市中心水厂智能化改造工程CAD施工图纸》', borrower: '张建国', dept: '水务质检科', returnDate: '2026-11-03' },
  { id: 'rr-2', title: '《2026年全域水污染防治攻坚战现场督查卷宗》', borrower: '李博文', dept: '生态执法队', returnDate: '2026-11-04' },
  { id: 'rr-3', title: '《新建市民文化艺术中心地下停车楼消防合格证》', borrower: '王志强', dept: '消防救援支队', returnDate: '2026-11-05' },
  { id: 'rr-4', title: '《市招商引资重点汽车产业园投资合作协议》', borrower: '赵光远', dept: '经合局招商组', returnDate: '2026-11-01' },
];

/** 生成带状态的归还提醒，按应还日期升序（最紧急的在前） */
export function buildReturnReminders(
  today: string = DASHBOARD_TODAY,
): DashboardReturnReminderWithStatus[] {
  return returnReminderSources
    .map((item) => ({ ...item, status: getReturnReminderStatus(item.returnDate, today) }))
    .sort((a, b) => a.returnDate.localeCompare(b.returnDate));
}

/** 档案类型原始馆藏量（卷）：占比由馆藏量计算，不再手写百分比 */
const categoryCounts: Array<{ name: string; count: number; color: string; barColor: string }> = [
  { name: '文书档案', count: 3268, color: 'bg-blue-500', barColor: '#3b82f6' },
  { name: '照片档案', count: 2575, color: 'bg-emerald-500', barColor: '#10b981' },
  { name: '产品科技档案', count: 1687, color: 'bg-indigo-500', barColor: '#6366f1' },
  { name: '实物档案', count: 1243, color: 'bg-amber-500', barColor: '#f59e0b' },
  { name: '会计档案', count: 1226, color: 'bg-purple-500', barColor: '#a855f7' },
];

/** 生成档案类型占比：百分比由馆藏量计算得出 */
export function buildCategoryShares(): DashboardCategoryShare[] {
  const total = categoryCounts.reduce((sum, item) => sum + item.count, 0);
  return categoryCounts.map((item) => {
    const value = (item.count / total) * 100;
    return {
      ...item,
      value: Math.round(value * 100) / 100,
      pct: `${value.toFixed(2)}%`,
    };
  });
}
