import { describe, expect, it } from 'vitest';
import { cn, formatMoney, formatDate, formatPhone, getInitials, pluralize, generateId } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    // eslint-disable-next-line no-constant-binary-expression
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('merges tailwind conflicts', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('returns empty string for no args', () => {
    expect(cn()).toBe('');
  });
});

describe('formatMoney', () => {
  it('formats numbers and appends so\'m', () => {
    const result = formatMoney(1234567);
    expect(result).toContain("so'm");
  });

  it('handles zero', () => {
    const result = formatMoney(0);
    expect(result).toContain('0');
    expect(result).toContain("so'm");
  });

  it('handles negative numbers', () => {
    const result = formatMoney(-500);
    expect(result).toContain('500');
    expect(result).toContain("so'm");
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2024-01-15');
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('formatPhone', () => {
  it('formats 12-digit phone number', () => {
    const result = formatPhone('+998901234567');
    expect(result).toBe('+998 (90) 123-45-67');
  });

  it('returns original phone if not 12 digits', () => {
    const result = formatPhone('+1234');
    expect(result).toBe('+1234');
  });
});

describe('getInitials', () => {
  it('returns first two initials', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('handles single name', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('handles three names', () => {
    expect(getInitials('John Paul Doe')).toBe('JP');
  });
});

describe('pluralize', () => {
  it('returns one form for 1', () => {
    expect(pluralize(1, 'студент', 'студента', 'студентов')).toBe('студент');
  });

  it('returns few form for 2-4', () => {
    expect(pluralize(3, 'студент', 'студента', 'студентов')).toBe('студента');
  });

  it('returns many form for 5+', () => {
    expect(pluralize(5, 'студент', 'студента', 'студентов')).toBe('студентов');
  });

  it('returns many form for 11', () => {
    expect(pluralize(11, 'студент', 'студента', 'студентов')).toBe('студентов');
  });
});

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateId()));
    expect(ids.size).toBe(10);
  });
});
