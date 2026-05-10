import { describe, expect, it } from 'vitest';
import { ApiError, transformPaginated, drfListToArray } from './client';

describe('ApiError', () => {
  it('creates error with status and message', () => {
    const error = new ApiError(404, 'Not found');
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.name).toBe('ApiError');
    expect(error.errors).toEqual({});
  });

  it('includes field errors', () => {
    const errors = { phone: ['Required field'] };
    const error = new ApiError(400, 'Validation error', errors);
    expect(error.errors).toEqual(errors);
  });

  it('is an instance of Error', () => {
    const error = new ApiError(500, 'Server error');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('transformPaginated', () => {
  it('transforms DRF paginated response', () => {
    const drf = { count: 50, results: [{ id: 1 }, { id: 2 }] };
    const result = transformPaginated(drf, 1, 20);

    expect(result.data).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.total).toBe(50);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(result.totalPages).toBe(3);
  });

  it('uses default page and pageSize', () => {
    const drf = { count: 5, results: [{ id: 1 }] };
    const result = transformPaginated(drf);

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(result.totalPages).toBe(1);
  });

  it('returns at least 1 total page for empty results', () => {
    const drf = { count: 0, results: [] };
    const result = transformPaginated(drf);
    expect(result.totalPages).toBe(1);
  });
});

describe('drfListToArray', () => {
  it('unwraps paginated response', () => {
    const drf = { count: 2, next: null, previous: null, results: [{ id: 1 }, { id: 2 }] };
    expect(drfListToArray(drf)).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('returns array as-is', () => {
    const arr = [{ id: 1 }, { id: 2 }];
    expect(drfListToArray(arr)).toEqual(arr);
  });
});
