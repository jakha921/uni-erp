import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scienceService } from '../services/science.service';
import type {
  ProjectListParams,
  ArticleListParams,
  ConferenceListParams,
  ThesisListParams,
  PatentListParams,
  CreateProjectDto,
  CreateArticleDto,
  CreateConferenceDto,
  CreateThesisDto,
  CreatePatentDto,
} from '@/types/science';
import type { ListParams } from '@/types/common';

const scienceKeys = {
  all: ['science'] as const,
  // Projects
  projects: (params: ProjectListParams) => [...scienceKeys.all, 'projects', params] as const,
  project: (id: number) => [...scienceKeys.all, 'project', id] as const,
  // Articles
  articles: (params: ArticleListParams) => [...scienceKeys.all, 'articles', params] as const,
  article: (id: number) => [...scienceKeys.all, 'article', id] as const,
  // Grants
  grants: (params: ListParams) => [...scienceKeys.all, 'grants', params] as const,
  // Conferences
  conferences: (params: ConferenceListParams) => [...scienceKeys.all, 'conferences', params] as const,
  conference: (id: number) => [...scienceKeys.all, 'conference', id] as const,
  // Theses
  theses: (params: ThesisListParams) => [...scienceKeys.all, 'theses', params] as const,
  thesis: (id: number) => [...scienceKeys.all, 'thesis', id] as const,
  // Patents
  patents: (params: PatentListParams) => [...scienceKeys.all, 'patents', params] as const,
  patent: (id: number) => [...scienceKeys.all, 'patent', id] as const,
};

// ===== Projects =====

export function useProjects(params: ProjectListParams) {
  return useQuery({
    queryKey: scienceKeys.projects(params),
    queryFn: () => scienceService.getProjects(params),
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: scienceKeys.project(id),
    queryFn: () => scienceService.getProjectById(id),
    enabled: id > 0,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectDto) => scienceService.createProject(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'projects'] });
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateProjectDto> }) =>
      scienceService.updateProject(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'projects'] });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => scienceService.deleteProject(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'projects'] });
    },
  });
}

// ===== Articles =====

export function useArticles(params: ArticleListParams) {
  return useQuery({
    queryKey: scienceKeys.articles(params),
    queryFn: () => scienceService.getArticles(params),
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: scienceKeys.article(id),
    queryFn: () => scienceService.getArticleById(id),
    enabled: id > 0,
  });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateArticleDto) => scienceService.createArticle(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'articles'] });
    },
  });
}

export function useDeleteArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => scienceService.deleteArticle(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'articles'] });
    },
  });
}

// ===== Grants =====

export function useGrants(params: ListParams) {
  return useQuery({
    queryKey: scienceKeys.grants(params),
    queryFn: () => scienceService.getGrants(params),
  });
}

// ===== Conferences =====

export function useConferences(params: ConferenceListParams) {
  return useQuery({
    queryKey: scienceKeys.conferences(params),
    queryFn: () => scienceService.getConferences(params),
  });
}

export function useConference(id: number) {
  return useQuery({
    queryKey: scienceKeys.conference(id),
    queryFn: () => scienceService.getConferenceById(id),
    enabled: id > 0,
  });
}

export function useCreateConference() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateConferenceDto) => scienceService.createConference(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'conferences'] });
    },
  });
}

export function useDeleteConference() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => scienceService.deleteConference(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'conferences'] });
    },
  });
}

// ===== Theses =====

export function useTheses(params: ThesisListParams) {
  return useQuery({
    queryKey: scienceKeys.theses(params),
    queryFn: () => scienceService.getTheses(params),
  });
}

export function useThesis(id: number) {
  return useQuery({
    queryKey: scienceKeys.thesis(id),
    queryFn: () => scienceService.getThesisById(id),
    enabled: id > 0,
  });
}

export function useCreateThesis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateThesisDto) => scienceService.createThesis(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'theses'] });
    },
  });
}

export function useDeleteThesis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => scienceService.deleteThesis(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'theses'] });
    },
  });
}

// ===== Patents =====

export function usePatents(params: PatentListParams) {
  return useQuery({
    queryKey: scienceKeys.patents(params),
    queryFn: () => scienceService.getPatents(params),
  });
}

export function usePatent(id: number) {
  return useQuery({
    queryKey: scienceKeys.patent(id),
    queryFn: () => scienceService.getPatentById(id),
    enabled: id > 0,
  });
}

export function useCreatePatent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatentDto) => scienceService.createPatent(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'patents'] });
    },
  });
}

export function useDeletePatent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => scienceService.deletePatent(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...scienceKeys.all, 'patents'] });
    },
  });
}
