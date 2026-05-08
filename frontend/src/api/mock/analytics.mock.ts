import { delay } from './delay';
import { FACULTIES, rnum } from './shared-data';
import type { AnalyticsData, AnalyticsParams } from '@/types/admin';
import type { IAnalyticsService } from '../services/analytics.service';

const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

export class AnalyticsMockService implements IAnalyticsService {
  async getAnalytics(_params: AnalyticsParams): Promise<AnalyticsData> {
    await delay(400);
    return {
      studentTrend: MONTHS.map((m, i) => ({ month: m, count: 3200 + rnum(i, -200, 300) })),
      revenueTrend: MONTHS.map((m, i) => ({ month: m, amount: 800000000 + rnum(i + 5, -100000000, 200000000) })),
      attendanceRate: MONTHS.map((m, i) => ({ month: m, rate: 85 + rnum(i + 10, -5, 10) })),
      topGroups: [
        { group: '301-22', avgGrade: 88.5, attendanceRate: 96 },
        { group: '201-21', avgGrade: 86.2, attendanceRate: 94 },
        { group: '102-21', avgGrade: 85.1, attendanceRate: 92 },
        { group: '402-22', avgGrade: 84.3, attendanceRate: 91 },
        { group: '103-23', avgGrade: 83.8, attendanceRate: 89 },
      ],
      byFaculty: FACULTIES.slice(0, 5).map((fac, i) => ({
        faculty: fac, students: 400 + rnum(i, -100, 200),
        revenue: 500000000 + rnum(i + 3, -100000000, 200000000),
        avgGrade: 78 + rnum(i + 5, 0, 12),
      })),
    };
  }
}
