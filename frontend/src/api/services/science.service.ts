import type {
  ResearchProject,
  Article,
  Grant,
  Conference,
  Thesis,
  Patent,
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
import type { PaginatedResponse, ListParams } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { ScienceMockService } from '../mock/science.mock';

export interface IScienceService {
  // Projects
  getProjects(params: ProjectListParams): Promise<PaginatedResponse<ResearchProject>>;
  getProjectById(id: number): Promise<ResearchProject>;
  createProject(data: CreateProjectDto): Promise<ResearchProject>;
  updateProject(id: number, data: Partial<CreateProjectDto>): Promise<ResearchProject>;
  deleteProject(id: number): Promise<void>;

  // Articles
  getArticles(params: ArticleListParams): Promise<PaginatedResponse<Article>>;
  getArticleById(id: number): Promise<Article>;
  createArticle(data: CreateArticleDto): Promise<Article>;
  deleteArticle(id: number): Promise<void>;

  // Grants
  getGrants(params: ListParams): Promise<PaginatedResponse<Grant>>;

  // Conferences
  getConferences(params: ConferenceListParams): Promise<PaginatedResponse<Conference>>;
  getConferenceById(id: number): Promise<Conference>;
  createConference(data: CreateConferenceDto): Promise<Conference>;
  deleteConference(id: number): Promise<void>;

  // Theses
  getTheses(params: ThesisListParams): Promise<PaginatedResponse<Thesis>>;
  getThesisById(id: number): Promise<Thesis>;
  createThesis(data: CreateThesisDto): Promise<Thesis>;
  deleteThesis(id: number): Promise<void>;

  // Patents
  getPatents(params: PatentListParams): Promise<PaginatedResponse<Patent>>;
  getPatentById(id: number): Promise<Patent>;
  createPatent(data: CreatePatentDto): Promise<Patent>;
  deletePatent(id: number): Promise<void>;
}

class ScienceApiService implements IScienceService {
  // Projects
  async getProjects(params: ProjectListParams): Promise<PaginatedResponse<ResearchProject>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: ResearchProject[] }>(ENDPOINTS.science.projects, {
      params: { page, page_size: pageSize, search: params.search, status: params.status, department_id: params.departmentId },
    });
    return transformPaginated(drf, page, pageSize);
  }
  async getProjectById(id: number): Promise<ResearchProject> {
    return apiClient.get<ResearchProject>(ENDPOINTS.science.projectDetail(id));
  }
  async createProject(data: CreateProjectDto): Promise<ResearchProject> {
    return apiClient.post<ResearchProject>(ENDPOINTS.science.projects, data);
  }
  async updateProject(id: number, data: Partial<CreateProjectDto>): Promise<ResearchProject> {
    return apiClient.patch<ResearchProject>(ENDPOINTS.science.projectDetail(id), data);
  }
  async deleteProject(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.science.projectDetail(id));
  }

  // Articles
  async getArticles(params: ArticleListParams): Promise<PaginatedResponse<Article>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Article[] }>(ENDPOINTS.science.articles, {
      params: { page, page_size: pageSize, search: params.search, type: params.type, year: params.year },
    });
    return transformPaginated(drf, page, pageSize);
  }
  async getArticleById(id: number): Promise<Article> {
    return apiClient.get<Article>(ENDPOINTS.science.articleDetail(id));
  }
  async createArticle(data: CreateArticleDto): Promise<Article> {
    return apiClient.post<Article>(ENDPOINTS.science.articles, data);
  }
  async deleteArticle(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.science.articleDetail(id));
  }

  // Grants
  async getGrants(params: ListParams): Promise<PaginatedResponse<Grant>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Grant[] }>(ENDPOINTS.science.grants, {
      params: { page, page_size: pageSize, search: params.search },
    });
    return transformPaginated(drf, page, pageSize);
  }

  // Conferences
  async getConferences(params: ConferenceListParams): Promise<PaginatedResponse<Conference>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Record<string, unknown>[] }>(ENDPOINTS.science.conferences, {
      params: { page, page_size: pageSize, search: params.search, status: params.status, type: params.type },
    });
    const paginated = transformPaginated(drf, page, pageSize);
    return {
      ...paginated,
      data: paginated.data.map((c) => ({
        ...c,
        participantCount: (c['participantCount'] ?? c['participant_count'] ?? 0) as number,
      })) as Conference[],
    };
  }
  async getConferenceById(id: number): Promise<Conference> {
    return apiClient.get<Conference>(ENDPOINTS.science.conferenceDetail(id));
  }
  async createConference(data: CreateConferenceDto): Promise<Conference> {
    return apiClient.post<Conference>(ENDPOINTS.science.conferences, data);
  }
  async deleteConference(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.science.conferenceDetail(id));
  }

  // Theses
  async getTheses(params: ThesisListParams): Promise<PaginatedResponse<Thesis>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Thesis[] }>(ENDPOINTS.science.theses, {
      params: { page, page_size: pageSize, search: params.search, stage: params.stage, type: params.type, supervisor_id: params.supervisorId },
    });
    return transformPaginated(drf, page, pageSize);
  }
  async getThesisById(id: number): Promise<Thesis> {
    return apiClient.get<Thesis>(ENDPOINTS.science.thesisDetail(id));
  }
  async createThesis(data: CreateThesisDto): Promise<Thesis> {
    return apiClient.post<Thesis>(ENDPOINTS.science.theses, data);
  }
  async deleteThesis(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.science.thesisDetail(id));
  }

  // Patents
  async getPatents(params: PatentListParams): Promise<PaginatedResponse<Patent>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Patent[] }>(ENDPOINTS.science.patents, {
      params: { page, page_size: pageSize, search: params.search, status: params.status },
    });
    return transformPaginated(drf, page, pageSize);
  }
  async getPatentById(id: number): Promise<Patent> {
    return apiClient.get<Patent>(ENDPOINTS.science.patentDetail(id));
  }
  async createPatent(data: CreatePatentDto): Promise<Patent> {
    return apiClient.post<Patent>(ENDPOINTS.science.patents, data);
  }
  async deletePatent(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.science.patentDetail(id));
  }
}

export const scienceService: IScienceService = USE_MOCK
  ? new ScienceMockService()
  : new ScienceApiService();
