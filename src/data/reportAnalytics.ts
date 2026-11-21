import type { RetentionRecord } from '../types/archive';

/**
 * 档案报表数据驱动：历年保管期限情况。
 * 口径（与档案年度分布表交叉核对，2017–2026 年 10 条全部吻合）：
 * - 当年案卷合计 = 永久保管 + 30年保管 + 10年保管，与年度分布表的当年案卷数一致；
 * - 到期鉴定数 = 合规销毁数 + 延期保管数，到期档案要么销毁、要么延期，两数之和即鉴定总数。
 * 原始记录只写三期限卷数与销毁、延期数，合计与鉴定数由上面两式推导，不再手写。
 */

/** 保管期限原始记录：只写年度、三期限卷数、销毁数与延期数 */
const retentionSources: Array<
  Omit<RetentionRecord, 'totalVolume' | 'appraisedVolume'>
> = [
  { id: 'rt-2026', year: '2026', permanentVolume: 28400, thirtyYearVolume: 14500, tenYearVolume: 5720, disposedVolume: 120, extendedVolume: 1730 },
  { id: 'rt-2025', year: '2025', permanentVolume: 29800, thirtyYearVolume: 15200, tenYearVolume: 6200, disposedVolume: 180, extendedVolume: 1920 },
  { id: 'rt-2024', year: '2024', permanentVolume: 28900, thirtyYearVolume: 14800, tenYearVolume: 6100, disposedVolume: 150, extendedVolume: 1830 },
  { id: 'rt-2023', year: '2023', permanentVolume: 27600, thirtyYearVolume: 14100, tenYearVolume: 5800, disposedVolume: 110, extendedVolume: 1640 },
  { id: 'rt-2022', year: '2022', permanentVolume: 26400, thirtyYearVolume: 13500, tenYearVolume: 5400, disposedVolume: 90, extendedVolume: 1530 },
  { id: 'rt-2021', year: '2021', permanentVolume: 25100, thirtyYearVolume: 12900, tenYearVolume: 5200, disposedVolume: 80, extendedVolume: 1430 },
  { id: 'rt-2020', year: '2020', permanentVolume: 24300, thirtyYearVolume: 12500, tenYearVolume: 5000, disposedVolume: 70, extendedVolume: 1350 },
  { id: 'rt-2019', year: '2019', permanentVolume: 23100, thirtyYearVolume: 11800, tenYearVolume: 4600, disposedVolume: 60, extendedVolume: 1290 },
  { id: 'rt-2018', year: '2018', permanentVolume: 22200, thirtyYearVolume: 11400, tenYearVolume: 4500, disposedVolume: 50, extendedVolume: 1230 },
  { id: 'rt-2017', year: '2017', permanentVolume: 21300, thirtyYearVolume: 10900, tenYearVolume: 4200, disposedVolume: 40, extendedVolume: 1170 },
];

/** 生成历年保管期限情况（按年度倒序）：合计与鉴定数由口径推导 */
export function buildRetentionData(): RetentionRecord[] {
  return retentionSources.map((item) => ({
    ...item,
    totalVolume: item.permanentVolume + item.thirtyYearVolume + item.tenYearVolume,
    appraisedVolume: item.disposedVolume + item.extendedVolume,
  }));
}
