import { Users, GraduationCap, Clock } from 'lucide-react';

import { StatCard, Card } from '@/components/data-display';
import { Badge } from '@/components/ui';

const myGroups = [
  { id: '1', name: 'AT-21', students: 28 },
  { id: '2', name: 'AT-31', students: 25 },
  { id: '3', name: 'KI-22', students: 30 },
];

const todaySchedule = [
  { id: '1', time: '08:30 — 10:00', subject: 'Algoritmlar va ma\'lumotlar tuzilmasi', group: 'AT-21', room: '301-A' },
  { id: '2', time: '10:15 — 11:45', subject: 'Dasturlash asoslari', group: 'KI-22', room: '205-B' },
  { id: '3', time: '13:00 — 14:30', subject: 'Ma\'lumotlar bazasi', group: 'AT-31', room: '301-A' },
  { id: '4', time: '14:45 — 16:15', subject: 'Algoritmlar (amaliy)', group: 'AT-21', room: '410-Lab' },
];

export function OqituvchiDashboard() {
  const totalStudentsInGroups = myGroups.reduce((sum, g) => sum + g.students, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Mening guruhlarim"
          value={myGroups.length}
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Jami talabalar"
          value={totalStudentsInGroups}
          icon={<GraduationCap className="h-5 w-5" />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="O'rtacha davomat"
          value="89.5%"
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
          trend={{ value: 1.8, label: 'hafta' }}
        />
      </div>

      {/* Today's schedule */}
      <Card title="Bugungi dars jadvali">
        <div className="space-y-3">
          {todaySchedule.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4"
            >
              <div className="w-28 shrink-0">
                <p className="text-sm font-semibold text-slate-900">{lesson.time}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{lesson.subject}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {lesson.group} · {lesson.room}
                </p>
              </div>
              <Badge variant="info">{lesson.group}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Groups */}
      <Card title="Guruhlarim">
        <div className="grid gap-3 sm:grid-cols-3">
          {myGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-center"
            >
              <p className="text-lg font-bold text-slate-900">{group.name}</p>
              <p className="mt-1 text-sm text-slate-500">{group.students} talaba</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
