import { BookOpen, Clock, FileText, Calendar } from 'lucide-react';

import { StatCard, Card } from '@/components/data-display';
import { Badge } from '@/components/ui';

const todaySchedule = [
  { id: '1', time: '08:30 — 10:00', subject: 'Algoritmlar va ma\'lumotlar tuzilmasi', teacher: 'Rahimov S.', room: '301-A' },
  { id: '2', time: '10:15 — 11:45', subject: 'Matematika II', teacher: 'Karimova N.', room: '102-A' },
  { id: '3', time: '13:00 — 14:30', subject: 'Fizika (amaliy)', teacher: 'Toshmatov B.', room: '205-Lab' },
];

const recentGrades = [
  { id: '1', subject: 'Algoritmlar', type: 'Oraliq imtihon', grade: 85, max: 100, date: '2025-04-28' },
  { id: '2', subject: 'Matematika II', type: 'Mustaqil ish', grade: 92, max: 100, date: '2025-04-25' },
  { id: '3', subject: 'Fizika', type: 'Laboratoriya', grade: 78, max: 100, date: '2025-04-22' },
  { id: '4', subject: 'Ingliz tili', type: 'Test', grade: 88, max: 100, date: '2025-04-20' },
  { id: '5', subject: 'Tarix', type: 'Referat', grade: 95, max: 100, date: '2025-04-18' },
];

function gradeVariant(grade: number): 'success' | 'warning' | 'error' {
  if (grade >= 86) return 'success';
  if (grade >= 71) return 'warning';
  return 'error';
}

export function TalabaDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="O'rtacha GPA"
          value="3.65"
          icon={<BookOpen className="h-5 w-5" />}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          trend={{ value: 0.12, label: 'semestr' }}
        />
        <StatCard
          label="Davomat"
          value="91.2%"
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
        />
        <StatCard
          label="Kontrakt"
          value="To'langan"
          icon={<FileText className="h-5 w-5" />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Keyingi imtihon"
          value="12-may"
          icon={<Calendar className="h-5 w-5" />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
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
                  {lesson.teacher} · {lesson.room}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent grades */}
      <Card title="So'nggi baholar">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 font-medium text-slate-500">Fan</th>
                <th className="pb-3 font-medium text-slate-500">Turi</th>
                <th className="pb-3 font-medium text-slate-500">Baho</th>
                <th className="pb-3 text-right font-medium text-slate-500">Sana</th>
              </tr>
            </thead>
            <tbody>
              {recentGrades.map((g) => (
                <tr key={g.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 font-medium text-slate-900">{g.subject}</td>
                  <td className="py-3 text-slate-600">{g.type}</td>
                  <td className="py-3">
                    <Badge variant={gradeVariant(g.grade)}>
                      {g.grade}/{g.max}
                    </Badge>
                  </td>
                  <td className="py-3 text-right text-slate-400">{g.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
