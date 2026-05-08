import { useTranslation } from 'react-i18next';

import { PageContent } from '@/components/layout';
import { PageHeader } from '@/components/layout';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { AdminDashboard } from '../components/AdminDashboard';
import { BuxgalterDashboard } from '../components/BuxgalterDashboard';
import { DekanDashboard } from '../components/DekanDashboard';
import { OqituvchiDashboard } from '../components/OqituvchiDashboard';
import { TalabaDashboard } from '../components/TalabaDashboard';

const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  buxgalter: 'Buxgalter',
  dekan: 'Dekan',
  oqituvchi: "O'qituvchi",
  talaba: 'Talaba',
};

function DashboardByRole({ role }: { role: string }) {
  switch (role) {
    case 'buxgalter':
      return <BuxgalterDashboard />;
    case 'dekan':
      return <DekanDashboard />;
    case 'oqituvchi':
      return <OqituvchiDashboard />;
    case 'talaba':
      return <TalabaDashboard />;
    default:
      return <AdminDashboard />;
  }
}

export function DashboardPage() {
  const { t } = useTranslation();
  const { role } = useDashboardStats();

  return (
    <PageContent>
      <PageHeader
        title={t('nav.dashboard', 'Asosiy')}
        subtitle={`Uni ERP · ${roleLabels[role] ?? 'Administrator'}`}
      />
      <DashboardByRole role={role} />
    </PageContent>
  );
}
