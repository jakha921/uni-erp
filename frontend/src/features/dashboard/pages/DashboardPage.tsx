import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageContent, PageHeader } from '@/components/layout';
import { DateRangePicker } from '@/components/form/DateRangePicker';
import { useAuthStore } from '@/stores/auth.store';
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
  const role = useAuthStore((s) => s.currentUser?.role ?? 'admin');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <PageContent>
      <PageHeader
        title={t('nav.dashboard', 'Asosiy')}
        subtitle={`Uni ERP · ${roleLabels[role] ?? 'Administrator'}`}
        actions={
          <DateRangePicker
            from={dateFrom}
            to={dateTo}
            onChange={(f, tt) => { setDateFrom(f); setDateTo(tt); }}
          />
        }
      />
      <DashboardByRole role={role} />
    </PageContent>
  );
}
