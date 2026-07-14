import type { SearchResultSet } from '@/types';

export interface SearchRepository {
  searchFamily(familyId: string, query: string): Promise<SearchResultSet>;
}
