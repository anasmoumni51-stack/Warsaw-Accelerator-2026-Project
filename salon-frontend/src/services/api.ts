import type { SalonSummary, SalonDetail, SalonUpdate, SalonFilters, PaginatedResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1';

export async function getSalons(
  page = 0,
  size = 20,
  sort = 'reviewCount',
  orderBy = 'DESC',
  filters: SalonFilters = {}
): Promise<PaginatedResponse<SalonSummary>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
    orderBy
  });

  if (filters.district && filters.district !== 'All districts') {
    params.append('district', filters.district);
  }

  if (filters.service) {
    params.append('service', filters.service);
  }

  const response = await fetch(`${API_BASE}/salons?${params}`);
  if (!response.ok) throw new Error('Failed to fetch salons');
  return response.json();
}

export async function getSalonById(id: number | string): Promise<SalonDetail> {
  const response = await fetch(`${API_BASE}/salons/${id}`);
  if (!response.ok) throw new Error('Salon not found');
  return response.json();
}

export async function updateSalon(id: number | string, data: SalonUpdate): Promise<SalonDetail> {
  const response = await fetch(`${API_BASE}/salons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update salon');
  return response.json();
}
