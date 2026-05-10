/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { AuthGuard } from '@/features/auth/guards/AuthGuard';
import { GuestGuard } from '@/features/auth/guards/GuestGuard';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RoleSelectPage } from '@/features/auth/pages/RoleSelectPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { StudentsStatPage } from '@/features/students/pages/StudentsStatPage';
import { StudentsListPage } from '@/features/students/pages/StudentsListPage';
import { StudentProfilePage } from '@/features/students/pages/StudentProfilePage';
import { StudentFormPage } from '@/features/students/pages/StudentFormPage';

const FinanceDashboardPage = lazy(() => import('@/features/finance/pages/FinanceDashboardPage').then(m => ({ default: m.FinanceDashboardPage })));
const ContractsListPage = lazy(() => import('@/features/finance/pages/ContractsListPage').then(m => ({ default: m.ContractsListPage })));
const ContractDetailPage = lazy(() => import('@/features/finance/pages/ContractDetailPage').then(m => ({ default: m.ContractDetailPage })));
const DebtorsListPage = lazy(() => import('@/features/finance/pages/DebtorsListPage').then(m => ({ default: m.DebtorsListPage })));
const PaymentsListPage = lazy(() => import('@/features/finance/pages/PaymentsListPage').then(m => ({ default: m.PaymentsListPage })));
const ScholarshipsPage = lazy(() => import('@/features/finance/pages/ScholarshipsPage').then(m => ({ default: m.ScholarshipsPage })));
const FinanceReportPage = lazy(() => import('@/features/finance/pages/FinanceReportPage').then(m => ({ default: m.FinanceReportPage })));

const HrDashboardPage = lazy(() => import('@/features/hr/pages/HrDashboardPage').then(m => ({ default: m.HrDashboardPage })));
const EmployeesListPage = lazy(() => import('@/features/hr/pages/EmployeesListPage').then(m => ({ default: m.EmployeesListPage })));
const EmployeeProfilePage = lazy(() => import('@/features/hr/pages/EmployeeProfilePage').then(m => ({ default: m.EmployeeProfilePage })));
const DepartmentsPage = lazy(() => import('@/features/hr/pages/DepartmentsPage').then(m => ({ default: m.DepartmentsPage })));
const OrdersPage = lazy(() => import('@/features/hr/pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const AttendancePage = lazy(() => import('@/features/hr/pages/AttendancePage').then(m => ({ default: m.AttendancePage })));
const LeavesPage = lazy(() => import('@/features/hr/pages/LeavesPage').then(m => ({ default: m.LeavesPage })));

const CrmListPage = lazy(() => import('@/features/crm/pages/CrmListPage').then(m => ({ default: m.CrmListPage })));
const CrmKanbanPage = lazy(() => import('@/features/crm/pages/CrmKanbanPage').then(m => ({ default: m.CrmKanbanPage })));
const CrmReportPage = lazy(() => import('@/features/crm/pages/CrmReportPage').then(m => ({ default: m.CrmReportPage })));

const TeachersListPage = lazy(() => import('@/features/teachers/pages/TeachersListPage').then(m => ({ default: m.TeachersListPage })));
const TeacherProfilePage = lazy(() => import('@/features/teachers/pages/TeacherProfilePage').then(m => ({ default: m.TeacherProfilePage })));
const AcademicAttendancePage = lazy(() => import('@/features/education/pages/AcademicAttendancePage').then(m => ({ default: m.AcademicAttendancePage })));
const GradingPage = lazy(() => import('@/features/education/pages/GradingPage').then(m => ({ default: m.GradingPage })));
const SchedulePage = lazy(() => import('@/features/education/pages/SchedulePage').then(m => ({ default: m.SchedulePage })));

const ExamsPage = lazy(() => import('@/features/education/pages/ExamsPage').then(m => ({ default: m.ExamsPage })));
const LibraryPage = lazy(() => import('@/features/education/pages/LibraryPage').then(m => ({ default: m.LibraryPage })));
const CurriculumPage = lazy(() => import('@/features/education/pages/CurriculumPage').then(m => ({ default: m.CurriculumPage })));
const AcademicDepartmentsPage = lazy(() => import('@/features/education/pages/AcademicDepartmentsPage').then(m => ({ default: m.AcademicDepartmentsPage })));
const SubjectsPage = lazy(() => import('@/features/education/pages/SubjectsPage').then(m => ({ default: m.SubjectsPage })));

const TasksPage = lazy(() => import('@/features/operations/pages/TasksPage').then(m => ({ default: m.TasksPage })));
const NotificationsPage = lazy(() => import('@/features/operations/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const MessagesPage = lazy(() => import('@/features/operations/pages/MessagesPage').then(m => ({ default: m.MessagesPage })));
const AppealsPage = lazy(() => import('@/features/operations/pages/AppealsPage').then(m => ({ default: m.AppealsPage })));
const NewsPage = lazy(() => import('@/features/operations/pages/NewsPage').then(m => ({ default: m.NewsPage })));
const ReportsPage = lazy(() => import('@/features/operations/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));

const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('@/features/profile/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const SystemUsersListPage = lazy(() => import('@/features/system/pages/UsersListPage').then(m => ({ default: m.UsersListPage })));
const SystemRolesPage = lazy(() => import('@/features/system/pages/RolesPage').then(m => ({ default: m.RolesPage })));
const SystemPermissionMatrixPage = lazy(() => import('@/features/system/pages/PermissionMatrixPage').then(m => ({ default: m.PermissionMatrixPage })));
const SystemAuditLogPage = lazy(() => import('@/features/system/pages/AuditLogPage').then(m => ({ default: m.AuditLogPage })));

const PayrollPage = lazy(() => import('@/features/finance/pages/PayrollPage').then(m => ({ default: m.PayrollPage })));
const BudgetPage = lazy(() => import('@/features/finance/pages/BudgetPage').then(m => ({ default: m.BudgetPage })));
const WarehousePage = lazy(() => import('@/features/warehouse/pages/WarehousePage').then(m => ({ default: m.WarehousePage })));

const DormitoryPage = lazy(() => import('@/features/infrastructure/pages/DormitoryPage').then(m => ({ default: m.DormitoryPage })));
const EquipmentPage = lazy(() => import('@/features/infrastructure/pages/EquipmentPage').then(m => ({ default: m.EquipmentPage })));
const TransportPage = lazy(() => import('@/features/infrastructure/pages/TransportPage').then(m => ({ default: m.TransportPage })));

const ResearchPage = lazy(() => import('@/features/science/pages/ResearchPage').then(m => ({ default: m.ResearchPage })));
const ThesesPage = lazy(() => import('@/features/science/pages/ThesesPage').then(m => ({ default: m.ThesesPage })));
const ConferencesPage = lazy(() => import('@/features/science/pages/ConferencesPage').then(m => ({ default: m.ConferencesPage })));
const PatentsPage = lazy(() => import('@/features/science/pages/PatentsPage').then(m => ({ default: m.PatentsPage })));

const StudentCabinetPage = lazy(() => import('@/features/cabinets/pages/StudentCabinetPage').then(m => ({ default: m.StudentCabinetPage })));
const TeacherCabinetPage = lazy(() => import('@/features/cabinets/pages/TeacherCabinetPage').then(m => ({ default: m.TeacherCabinetPage })));
const DmsPage = lazy(() => import('@/features/admin/pages/DmsPage').then(m => ({ default: m.DmsPage })));
const AnalyticsPage = lazy(() => import('@/features/admin/pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const ReferencesPage = lazy(() => import('@/features/admin/pages/ReferencesPage').then(m => ({ default: m.ReferencesPage })));
const AlumniPage = lazy(() => import('@/features/education/pages/AlumniPage').then(m => ({ default: m.AlumniPage })));
const InternshipPage = lazy(() => import('@/features/education/pages/InternshipPage').then(m => ({ default: m.InternshipPage })));
const MyStudentsPage = lazy(() => import('@/features/education/pages/MyStudentsPage').then(m => ({ default: m.MyStudentsPage })));
const LegacyOrdersPage = lazy(() => import('@/features/legacy/pages/LegacyOrdersPage').then(m => ({ default: m.LegacyOrdersPage })));
const StaffingPage = lazy(() => import('@/features/legacy/pages/StaffingPage').then(m => ({ default: m.StaffingPage })));

function LazyFallback() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LazyFallback />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  // Public
  {
    element: <GuestGuard />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/role-select', element: <RoleSelectPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  // Protected
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          // Students
          { path: '/students/statistics', element: <StudentsStatPage /> },
          { path: '/students', element: <StudentsListPage /> },
          { path: '/students/new', element: <StudentFormPage /> },
          { path: '/students/:id', element: <StudentProfilePage /> },
          { path: '/students/:id/edit', element: <StudentFormPage /> },
          { path: '/my-students', element: <Lazy><MyStudentsPage /></Lazy> },
          // Education
          { path: '/teachers', element: <Lazy><TeachersListPage /></Lazy> },
          { path: '/teachers/:id', element: <Lazy><TeacherProfilePage /></Lazy> },
          { path: '/attendance', element: <Lazy><AcademicAttendancePage /></Lazy> },
          { path: '/grading', element: <Lazy><GradingPage /></Lazy> },
          { path: '/schedule', element: <Lazy><SchedulePage /></Lazy> },
          { path: '/exams', element: <Lazy><ExamsPage /></Lazy> },
          { path: '/alumni', element: <Lazy><AlumniPage /></Lazy> },
          { path: '/internship', element: <Lazy><InternshipPage /></Lazy> },
          // Curriculum
          { path: '/curriculum', element: <Lazy><CurriculumPage /></Lazy> },
          { path: '/departments', element: <Lazy><AcademicDepartmentsPage /></Lazy> },
          { path: '/subjects', element: <Lazy><SubjectsPage /></Lazy> },
          { path: '/library', element: <Lazy><LibraryPage /></Lazy> },
          // CRM
          { path: '/crm', element: <Lazy><CrmListPage /></Lazy> },
          { path: '/crm/kanban', element: <Lazy><CrmKanbanPage /></Lazy> },
          { path: '/crm/report', element: <Lazy><CrmReportPage /></Lazy> },
          // Finance
          { path: '/finance', element: <Lazy><FinanceDashboardPage /></Lazy> },
          { path: '/finance/contracts', element: <Lazy><ContractsListPage /></Lazy> },
          { path: '/finance/contracts/:id', element: <Lazy><ContractDetailPage /></Lazy> },
          { path: '/finance/debtors', element: <Lazy><DebtorsListPage /></Lazy> },
          { path: '/finance/payments', element: <Lazy><PaymentsListPage /></Lazy> },
          { path: '/finance/scholarship', element: <Lazy><ScholarshipsPage /></Lazy> },
          { path: '/finance/report', element: <Lazy><FinanceReportPage /></Lazy> },
          { path: '/finance/payroll', element: <Lazy><PayrollPage /></Lazy> },
          { path: '/finance/budget', element: <Lazy><BudgetPage /></Lazy> },
          // HR
          { path: '/hr', element: <Lazy><HrDashboardPage /></Lazy> },
          { path: '/hr/employees', element: <Lazy><EmployeesListPage /></Lazy> },
          { path: '/hr/employees/:id', element: <Lazy><EmployeeProfilePage /></Lazy> },
          { path: '/hr/departments', element: <Lazy><DepartmentsPage /></Lazy> },
          { path: '/hr/orders', element: <Lazy><OrdersPage /></Lazy> },
          { path: '/hr/attendance', element: <Lazy><AttendancePage /></Lazy> },
          { path: '/hr/leaves', element: <Lazy><LeavesPage /></Lazy> },
          // Legacy HR
          { path: '/orders', element: <Lazy><LegacyOrdersPage /></Lazy> },
          { path: '/staffing', element: <Lazy><StaffingPage /></Lazy> },
          // Infrastructure
          { path: '/dormitory', element: <Lazy><DormitoryPage /></Lazy> },
          { path: '/warehouse', element: <Lazy><WarehousePage /></Lazy> },
          { path: '/equipment', element: <Lazy><EquipmentPage /></Lazy> },
          { path: '/transport', element: <Lazy><TransportPage /></Lazy> },
          // Science
          { path: '/research', element: <Lazy><ResearchPage /></Lazy> },
          { path: '/theses', element: <Lazy><ThesesPage /></Lazy> },
          { path: '/conferences', element: <Lazy><ConferencesPage /></Lazy> },
          { path: '/patents', element: <Lazy><PatentsPage /></Lazy> },
          // Cabinets
          { path: '/student-cabinet', element: <Lazy><StudentCabinetPage /></Lazy> },
          { path: '/teacher-cabinet', element: <Lazy><TeacherCabinetPage /></Lazy> },
          // Operations
          { path: '/tasks', element: <Lazy><TasksPage /></Lazy> },
          { path: '/appeals', element: <Lazy><AppealsPage /></Lazy> },
          { path: '/messages', element: <Lazy><MessagesPage /></Lazy> },
          { path: '/notifications', element: <Lazy><NotificationsPage /></Lazy> },
          { path: '/news', element: <Lazy><NewsPage /></Lazy> },
          // Admin
          { path: '/dms', element: <Lazy><DmsPage /></Lazy> },
          { path: '/analytics', element: <Lazy><AnalyticsPage /></Lazy> },
          { path: '/reports', element: <Lazy><ReportsPage /></Lazy> },
          { path: '/reference', element: <Lazy><ReferencesPage /></Lazy> },
          // Profile
          { path: '/profile', element: <Lazy><ProfilePage /></Lazy> },
          { path: '/settings', element: <Lazy><SettingsPage /></Lazy> },
          // System
          { path: '/system/users', element: <Lazy><SystemUsersListPage /></Lazy> },
          { path: '/system/roles', element: <Lazy><SystemRolesPage /></Lazy> },
          { path: '/system/permissions', element: <Lazy><SystemPermissionMatrixPage /></Lazy> },
          { path: '/system/audit', element: <Lazy><SystemAuditLogPage /></Lazy> },
          // Catch-all
          { path: '*', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
]);
