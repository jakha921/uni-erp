import { ChartCard, LineChartSimple } from '@/components/data-display';

interface MonthlyTrendProps {
  data: { month: string; amount: number }[];
}

export function MonthlyTrend({ data }: MonthlyTrendProps) {
  const chartData = data.map((d) => ({ name: d.month, value: d.amount }));

  return (
    <ChartCard title="Oylik to'lovlar dinamikasi">
      <LineChartSimple data={chartData} height={220} color="#3B82F6" showArea />
    </ChartCard>
  );
}
