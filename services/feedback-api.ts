const API_URL = process.env.FEEDBACK_API_URL
const API_KEY = process.env.FEEDBACK_API_KEY

class FeedbackApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_URL || !API_KEY) {
    throw new FeedbackApiError('FEEDBACK_API_URL o FEEDBACK_API_KEY no configurados', 500)
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      ...options?.headers,
    },
  })
  const body = await res.json()
  if (!res.ok) {
    throw new FeedbackApiError(body.error || 'Error en Feedback API', res.status)
  }
  return body as T
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Review {
  id: string
  tipo: 'product' | 'seller'
  targetId: string
  userId: string
  rating: number
  comentario: string
  estado: string
  fecha: string
  userName?: string
  targetName?: string
  sellerName?: string
}

export interface Report {
  id: string
  reseñaId: string
  reporterId: string
  razon: string
  resuelto: boolean
  fecha: string
  review?: Review
  reporterName?: string
  resolvedBy?: string
  comentarioAdmin?: string
}

export interface UpdateReviewInput {
  rating?: number
  comentario?: string
  estado?: string
}

export interface GetAllReviewsParams {
  page?: number
  limit?: number
  search?: string
  tipo?: 'product' | 'seller'
  rating?: number
  fechaDesde?: string
  fechaHasta?: string
  estado?: string
}

export function getAllReviews(params?: GetAllReviewsParams) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.search) query.set('search', params.search)
  if (params?.tipo) query.set('tipo', params.tipo)
  if (params?.rating) query.set('rating', String(params.rating))
  if (params?.fechaDesde) query.set('fechaDesde', params.fechaDesde)
  if (params?.fechaHasta) query.set('fechaHasta', params.fechaHasta)
  if (params?.estado) query.set('estado', params.estado)
  return fetchApi<PaginatedResponse<Review>>(`/api/reviews?${query}`)
}

export function updateReview(id: string, input: UpdateReviewInput) {
  return fetchApi<Review>(`/api/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export interface GetAllReportsParams {
  page?: number
  limit?: number
  search?: string
  resolved?: boolean
  rating?: number
  fechaDesde?: string
  fechaHasta?: string
}

export function getAllReports(params?: GetAllReportsParams) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.search) query.set('search', params.search)
  if (params?.resolved !== undefined) query.set('resolved', String(params.resolved))
  if (params?.rating) query.set('rating', String(params.rating))
  if (params?.fechaDesde) query.set('fechaDesde', params.fechaDesde)
  if (params?.fechaHasta) query.set('fechaHasta', params.fechaHasta)
  return fetchApi<PaginatedResponse<Report>>(`/api/reports?${query}`)
}

export function getReportById(id: string) {
  return fetchApi<Report>(`/api/reports/${id}`)
}

export interface ResolveReportInput {
  action: 'dismiss' | 'remove'
  adminId: string
  comentarioAdmin?: string
}

export function resolveReport(reportId: string, input: ResolveReportInput) {
  return fetchApi<Report>(`/api/reports/${reportId}/resolve`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function getAIOpinion(reportId: string): Promise<string> {
  const data = await fetchApi<{ opinion: string }>(`/api/reports/${reportId}/ai-opinion`)
  return data.opinion
}
