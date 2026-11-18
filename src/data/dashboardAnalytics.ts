import type {
  DashboardAnnouncement,
  DashboardBorrowTrendPoint,
  DashboardCategoryShare,
  DashboardReturnReminder,
  DashboardReturnReminderWithStatus,
  DashboardTodoItem,
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

/** 借阅趋势原始数据：近 7 日每日借阅与归还量（截至基准日 11-04） */
const borrowTrendSources: DashboardBorrowTrendPoint[] = [
  { date: '10-29', borrow: 38, returnItem: 42 },
  { date: '10-30', borrow: 45, returnItem: 38 },
  { date: '10-31', borrow: 18, returnItem: 12 },
  { date: '11-01', borrow: 22, returnItem: 28 },
  { date: '11-02', borrow: 38, returnItem: 32 },
  { date: '11-03', borrow: 52, returnItem: 48 },
  { date: '11-04', borrow: 29, returnItem: 31 }, // 今日截止
];

/** 本周趋势：近 7 日原始数据 */
export function buildWeekBorrowTrend(): DashboardBorrowTrendPoint[] {
  return [...borrowTrendSources];
}

/** 本月趋势：由周数据筛选当月 1 日至今，不再手写重复抄写 */
export function buildMonthBorrowTrend(
  today: string = DASHBOARD_TODAY,
): DashboardBorrowTrendPoint[] {
  const monthStart = today.slice(5, 7) + '-01';
  return borrowTrendSources.filter((item) => item.date >= monthStart);
}

/** 公告原始记录：“新”标记不手写，由发布日期相对基准日推导 */
const announcementSources: Array<Omit<DashboardAnnouncement, 'isNew'>> = [
  { id: 'an-1', tag: '系统维护', title: '关于全国政企数字档案管理系统服务器例行安全维保的通知', date: '2026-11-03' },
  { id: 'an-2', tag: '标准更新', title: '关于全面贯彻执行国家档案局《电子档案四性检测指南》的通知', date: '2026-11-02' },
  { id: 'an-3', tag: '业务通告', title: '关于开展2026年第三季度全市全宗档案归档移交核查的通知', date: '2026-11-05' },
  { id: 'an-4', tag: '培训通知', title: '关于举办全市各单位档案三员保密管理与RFID智慧馆库培训的通知', date: '2026-11-05' },
];

/** 生成公告列表：基准日前 2 天内发布（含当日）标为“新”，未来日期不标新 */
export function buildAnnouncements(
  today: string = DASHBOARD_TODAY,
): DashboardAnnouncement[] {
  return announcementSources.map((item) => {
    const diff = daysBetween(item.date, today);
    return { ...item, isNew: diff >= 0 && diff <= 2 };
  });
}

/** 待办事项原始记录：短日期不手写，由待办时间推导 */
const todoItemSources: Array<Omit<DashboardTodoItem, 'shortDate'>> = [
  {
    id: 'td-1',
    type: 'borrow',
    title: '张建国 申请借阅《市数字化智能交通三期工程竣工验收报告》，请及时处理！',
    time: '2026-11-03 16:45',
    priority: '高优先级',
    user: '张建国 (审计局)',
  },
  {
    id: 'td-2',
    type: 'appraisal',
    title: '《2006年度局机关财政零星报销单据卷宗》待鉴定到期处置，请及时处理！',
    time: '2026-11-03 14:20',
    priority: '中优先级',
    user: '鉴定委员会',
  },
  {
    id: 'td-3',
    type: 'borrow',
    title: '您的借阅申请《2026年第三季度全市国资运营财务决算表》已通过，请及时查询！',
    time: '2026-11-02 11:15',
    priority: '已核准',
    user: '系统自动化',
  },
  {
    id: 'td-4',
    type: 'borrow',
    title: '您的借阅申请《东部新区绿色生态示范区建设规划许可批复正本》已通过，请及时查询！',
    time: '2026-11-01 09:30',
    priority: '已核准',
    user: '系统自动化',
  },
];

/** 生成待办事项：短日期由待办时间截取（MM-DD） */
export function buildTodoItems(): DashboardTodoItem[] {
  return todoItemSources.map((item) => ({
    ...item,
    shortDate: item.time.slice(5, 10),
  }));
}
