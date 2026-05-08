import type {
  NewsArticle,
  NewsListParams,
  CreateNewsDto,
} from '@/types/operations';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { NewsMockService } from '../mock/news.mock';

export interface INewsService {
  getList(params: NewsListParams): Promise<PaginatedResponse<NewsArticle>>;
  getById(id: number): Promise<NewsArticle>;
  create(data: CreateNewsDto): Promise<NewsArticle>;
  update(id: number, data: Partial<CreateNewsDto>): Promise<NewsArticle>;
  delete(id: number): Promise<void>;
}

class NewsApiService implements INewsService {
  async getList(params: NewsListParams): Promise<PaginatedResponse<NewsArticle>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: NewsArticle[] }>(ENDPOINTS.operations.news, {
      params: {
        page,
        page_size: pageSize,
        search: params.search,
        category: params.category,
        tag: params.tag,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getById(id: number): Promise<NewsArticle> {
    return apiClient.get<NewsArticle>(ENDPOINTS.operations.newsDetail(id));
  }

  async create(data: CreateNewsDto): Promise<NewsArticle> {
    return apiClient.post<NewsArticle>(ENDPOINTS.operations.news, data);
  }

  async update(id: number, data: Partial<CreateNewsDto>): Promise<NewsArticle> {
    return apiClient.patch<NewsArticle>(ENDPOINTS.operations.newsDetail(id), data);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.operations.newsDetail(id));
  }
}

export const newsService: INewsService = USE_MOCK
  ? new NewsMockService()
  : new NewsApiService();
