import { create } from 'zustand'
import api from '../lib/api'

export interface Organization {
  id: string
  name: string
  description?: string | null
  created_at: string
  owner_id: string
}

interface OrgState {
  items: Organization[]
  loading: boolean
  error: string | null
  fetchAll: () => Promise<void>
  create: (data: { name: string; description?: string }) => Promise<void>
  update: (id: string, data: { name?: string; description?: string }) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useOrgStore = create<OrgState>((set: (partial: Partial<OrgState>) => void, get: () => OrgState) => ({
  items: [],
  loading: false,
  error: null,
  async fetchAll() {
    set({ loading: true, error: null })
    try {
      const res = await api.get<Organization[]>('/organizations')
      set({ items: res.data })
    } catch (e: any) {
      set({ error: e?.response?.data?.detail ?? 'Failed to fetch' })
    } finally {
      set({ loading: false })
    }
  },
  async create(data: { name: string; description?: string }) {
    set({ loading: true, error: null })
    try {
      const res = await api.post<Organization>('/organizations', data)
      set({ items: [res.data, ...get().items] })
    } catch (e: any) {
      set({ error: e?.response?.data?.detail ?? 'Failed to create' })
    } finally {
      set({ loading: false })
    }
  },
  async update(id: string, data: { name?: string; description?: string }) {
    set({ loading: true, error: null })
    try {
      const res = await api.put<Organization>(`/organizations/${id}`, data)
  set({ items: get().items.map((it: Organization) => (it.id === id ? res.data : it)) })
    } catch (e: any) {
      set({ error: e?.response?.data?.detail ?? 'Failed to update' })
    } finally {
      set({ loading: false })
    }
  },
  async remove(id: string) {
    set({ loading: true, error: null })
    try {
      await api.delete(`/organizations/${id}`)
  set({ items: get().items.filter((it: Organization) => it.id !== id) })
    } catch (e: any) {
      set({ error: e?.response?.data?.detail ?? 'Failed to delete' })
    } finally {
      set({ loading: false })
    }
  },
}))
