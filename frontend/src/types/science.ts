import type { ListParams } from './common';

export interface ResearchProject {
  id: number;
  title: string;
  leaderId: number;
  leaderName: string;
  department: string;
  teamSize: number;
  fundAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'suspended';
  progress: number;
  description: string;
}

export interface Article {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  type: 'scopus' | 'wos' | 'vak' | 'local';
  doi?: string;
  citations: number;
}

export interface Grant {
  id: number;
  projectName: string;
  sponsor: string;
  amount: number;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate: string;
}

export interface Conference {
  id: number;
  name: string;
  date: string;
  endDate?: string;
  location: string;
  type: 'international' | 'national' | 'university';
  participantCount: number;
  status: 'upcoming' | 'active' | 'completed';
  description: string;
}

export interface Thesis {
  id: number;
  title: string;
  studentId: number;
  studentName: string;
  supervisorId: number;
  supervisorName: string;
  department: string;
  stage: 'topic_approved' | 'in_progress' | 'review' | 'defense' | 'completed';
  grade?: number;
  defenseDate?: string;
  type: 'bakalavr' | 'magistr';
}

export interface Patent {
  id: number;
  title: string;
  inventors: string;
  applicationDate: string;
  grantDate?: string;
  patentNumber?: string;
  status: 'filed' | 'under_review' | 'granted' | 'rejected';
  category: string;
}

// List params
export interface ProjectListParams extends ListParams {
  status?: string;
  departmentId?: number;
}

export interface ArticleListParams extends ListParams {
  type?: string;
  year?: number;
}

export interface ConferenceListParams extends ListParams {
  status?: string;
  type?: string;
}

export interface ThesisListParams extends ListParams {
  stage?: string;
  type?: string;
  supervisorId?: number;
}

export interface PatentListParams extends ListParams {
  status?: string;
}

// Create DTOs
export interface CreateProjectDto {
  title: string;
  leaderId: number;
  description: string;
  fundAmount: number;
  startDate: string;
  endDate: string;
}

export interface CreateArticleDto {
  title: string;
  authors: string;
  journal: string;
  year: number;
  type: string;
  doi?: string;
}

export interface CreateConferenceDto {
  name: string;
  date: string;
  endDate?: string;
  location: string;
  type: string;
  description: string;
}

export interface CreateThesisDto {
  title: string;
  studentId: number;
  supervisorId: number;
  type: string;
}

export interface CreatePatentDto {
  title: string;
  inventors: string;
  applicationDate: string;
  category: string;
}
