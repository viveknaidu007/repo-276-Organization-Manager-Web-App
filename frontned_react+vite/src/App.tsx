import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { useAuthStore } from './store/auth'
import { useOrgStore, type Organization } from './store/organizations'

function LoginForm() {
  const { token, setToken } = useAuthStore()
  const [input, setInput] = useState(token ?? '')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) setToken(input.trim())
  }

  const handleLogout = () => setToken(null)

  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 16, borderRadius: 8 }}>
      <h2>Auth</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder="Paste Supabase JWT or demo token"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Save Token</button>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </form>
      <small>Only a non-empty token is required for local demo. For Supabase, paste the session access_token.</small>
    </div>
  )
}

function OrgForm({ onSubmit, initial }: { onSubmit: (p: { name: string; description?: string }) => void; initial?: Partial<Organization> }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ name, description })
        setName('')
        setDescription('')
      }}
      style={{ display: 'flex', gap: 8 }}
    >
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, padding: 8 }} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ flex: 2, padding: 8 }} />
      <button type="submit">Save</button>
    </form>
  )
}

function OrgList() {
  const { items, fetchAll, create, update, remove, loading, error } = useOrgStore()
  const { token } = useAuthStore()

  useEffect(() => {
    if (token) fetchAll()
  }, [token, fetchAll])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const editingOrg = useMemo(() => items.find((i: Organization) => i.id === editingId), [editingId, items])
  const filtered = useMemo(
    () => items.filter((i: Organization) => i.name.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>Organizations</h2>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <span style={{ fontSize: 12, color: '#6b7280' }}>{filtered.length} shown / {items.length} total</span>
      </div>
      <OrgForm onSubmit={(p) => create(p)} />
      {loading && <div>Loading...</div>}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 0 }}>
        {filtered.map((org: Organization) => (
          <li key={org.id} style={{ listStyle: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            {editingId === org.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <OrgForm
                  initial={editingOrg}
                  onSubmit={(p) => {
                    update(org.id, p)
                    setEditingId(null)
                  }}
                />
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{org.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{new Date(org.created_at).toLocaleString()}</div>
                  <div>{org.description}</div>
                </div>
                <button onClick={() => setEditingId(org.id)}>Edit</button>
                <button onClick={() => remove(org.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function App() {
  const { token } = useAuthStore()
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>Organization Manager</h1>
      <LoginForm />
      <div style={{ height: 16 }} />
      {token ? <OrgList /> : <div>Please authenticate to manage organizations.</div>}
    </div>
  )
}
