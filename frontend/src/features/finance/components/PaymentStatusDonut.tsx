import { ChartCard, DonutChart } from '@/components/data-display';

interface PaymentStatusDonutProps {
  full: number;
  partial: number;
  none: number;
}

export function PaymentStatusDonut({ full, partial, none }: PaymentStatusDonutProps) {
  const data = [
    { name: "To'liq to'langan", value: full, color: '#2DB976' },
    { name: 'Qisman', value: partial, color: '#F59E0B' },
    { name: "To'lanmagan", value: none, color: '#EF4444' },
  ];

  return (
    <ChartCard title="To'lov holati" subtitle={`${full + partial + none} ta kontrakt`}>
      <DonutChart data={data} size={220} />
    </ChartCard>
  );
}
