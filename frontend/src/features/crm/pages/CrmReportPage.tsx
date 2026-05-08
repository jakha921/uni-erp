import { StubPage } from '@/components/layout/StubPage';

export function CrmReportPage() {
  return (
    <StubPage
      title="CRM Hisobot"
      subtitle="Qabul jarayoni statistikasi va konversiya hisoboti"
      breadcrumbs={[
        { label: 'CRM', path: '/crm' },
        { label: 'Hisobot' },
      ]}
    />
  );
}
