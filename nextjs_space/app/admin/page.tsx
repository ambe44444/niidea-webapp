'use client'

import { useState, useEffect, useCallback, Fragment } from 'react'
import {
  LogIn, LogOut, BarChart3, ShoppingBag, Sparkles, Send,
  Plus, ToggleLeft, ToggleRight, Users, DollarSign, CalendarDays,
  X, Loader2, RefreshCw, MapPin, Clock, Star, ChevronDown
} from 'lucide-react'

interface OrderType {
  id: string
  email: string
  phone: string
  date: string
  people: number
  level: string
  price: number
  status: string
  whatsappSent: boolean
  reservationConfirmed?: boolean
  createdAt: string
  assignedExperience: ExperienceType | null
}

interface ExperienceType {
  id: string
  name: string
  level: string
  date: string
  time: string
  location: string
  capacity: number
  remainingCapacity: number
  isActive: boolean
  category?: string | null
  description?: string | null
  neighborhood?: string | null
  costPerPerson?: number | null
  marginPerPerson?: number | null
  sourceUrl?: string | null
  sourceName?: string | null
  _count?: { orders: number }
}

type TabKey = 'metrics' | 'orders' | 'experiences' | 'reviews'

type ReviewType = {
  id: string
  name: string
  stars: number
  level: string | null
  text: string
  approved: boolean
  createdAt: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<TabKey>('metrics')

  // Data
  const [metrics, setMetrics] = useState<any>(null)
  const [orders, setOrders] = useState<OrderType[]>([])
  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const [reviews, setReviews] = useState<ReviewType[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // Modals
  const [assignModal, setAssignModal] = useState<string | null>(null)
  const [openOrder, setOpenOrder] = useState<string | null>(null)
  const [newExpModal, setNewExpModal] = useState(false)
  const [newExp, setNewExp] = useState({ name: '', level: 'soft', date: '', time: '', location: '', capacity: 10 })

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/metrics')
      if (res.ok) {
        setAuthed(true)
        setMetrics(await res.json())
      }
    } catch { /* not authed */ }
    setChecking(false)
  }, [])

  useEffect(() => { checkAuth() }, [checkAuth])

  const handleLogin = async () => {
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password }),
      })
      if (res.ok) {
        setAuthed(true)
        loadTab('metrics')
      } else {
        setLoginError('Contraseña incorrecta')
      }
    } catch {
      setLoginError('Error de conexión')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuthed(false)
    setMetrics(null)
    setOrders([])
    setExperiences([])
  }

  const loadTab = useCallback(async (t: TabKey) => {
    setTab(t)
    setLoadingData(true)
    try {
      if (t === 'metrics') {
        const res = await fetch('/api/admin/metrics')
        if (res.ok) setMetrics(await res.json())
      } else if (t === 'orders') {
        const res = await fetch('/api/admin/orders')
        if (res.ok) setOrders(await res.json())
      } else if (t === 'reviews') {
        const res = await fetch('/api/admin/reviews')
        if (res.ok) setReviews(await res.json())
      } else {
        const res = await fetch('/api/admin/experiences')
        if (res.ok) setExperiences(await res.json())
      }
    } catch { /* ignore */ }
    setLoadingData(false)
  }, [])

  const toggleReservation = async (orderId: string, confirmed: boolean) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmed }),
      })
      if (!res.ok) {
        alert('No se pudo guardar el estado de la reserva.')
        return
      }
      loadTab('orders')
    } catch {
      alert('No se pudo guardar el estado de la reserva.')
    }
  }

  const sendReveal = async (orderId: string) => {
    try {
      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.success === false) {
        alert('No se pudo enviar la revelación: ' + (data?.error ?? 'error desconocido'))
      }
      loadTab('orders')
    } catch {
      alert('No se pudo enviar la revelación. Inténtalo de nuevo.')
    }
  }

  const assignExperience = async (orderId: string, experienceId: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceId }),
      })
      setAssignModal(null)
      loadTab('orders')
    } catch { /* ignore */ }
  }

  const toggleExperience = async (id: string) => {
    try {
      await fetch(`/api/admin/experiences/${id}/toggle`, { method: 'POST' })
      loadTab('experiences')
    } catch { /* ignore */ }
  }

  const createExperience = async () => {
    try {
      await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newExp, capacity: Number(newExp.capacity) }),
      })
      setNewExpModal(false)
      setNewExp({ name: '', level: 'soft', date: '', time: '', location: '', capacity: 10 })
      loadTab('experiences')
    } catch { /* ignore */ }
  }

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('es-ES', { timeZone: 'UTC' }) } catch { return d }
  }

  const levelColor = (l: string) => {
    if (l === 'soft') return '#6EE7B7'
    if (l === 'medium') return '#FFD54F'
    return '#F87171'
  }

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { pending: 'Pendiente', paid: 'Pagado', assigned: 'Asignado', cancelled: 'Cancelado' }
    return map[s] ?? s
  }

  const statusColor = (s: string) => {
    const map: Record<string, string> = { pending: '#FCD34D', paid: '#60A5FA', assigned: '#6EE7B7', cancelled: '#F87171' }
    return map[s] ?? '#888'
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FFD54F] animate-spin" />
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-2 text-center">Admin NiIdea</h1>
          <p className="text-white/40 text-sm text-center mb-8">Introduce la contraseña para acceder.</p>
          {loginError && <p className="text-red-400 text-sm text-center mb-4">{loginError}</p>}
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleLogin()}
            placeholder="Contraseña"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFD54F]/50 transition-colors mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-[#FFD54F] text-[#0B0B0B] font-bold py-3.5 rounded-xl hover:bg-[#FFCA28] transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Entrar
          </button>
        </div>
      </div>
    )
  }

  const toggleReview = async (id: string, approved: boolean) => {
    try {
      await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      })
      loadTab('reviews')
    } catch { /* ignore */ }
  }

  const deleteReview = async (id: string) => {
    if (!confirm('¿Borrar esta reseña?')) return
    try {
      await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })
      loadTab('reviews')
    } catch { /* ignore */ }
  }

  const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: 'metrics', label: 'Métricas', icon: BarChart3 },
    { key: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { key: 'experiences', label: 'Experiencias', icon: Sparkles },
    { key: 'reviews', label: 'Reseñas', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-[#FFD54F] font-bold text-lg">NiIdea Admin</h1>
          <button onClick={handleLogout} className="text-white/40 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/[0.06] px-6">
        <div className="max-w-6xl mx-auto flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => loadTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key ? 'border-[#FFD54F] text-[#FFD54F]' : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loadingData && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#FFD54F] animate-spin" />
          </div>
        )}

        {/* METRICS */}
        {tab === 'metrics' && !loadingData && metrics && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#FFD54F]/20 bg-[#FFD54F]/[0.04] p-5">
              <div>
                <p className="font-semibold text-sm">Catálogo de planes con márgenes</p>
                <p className="text-white/40 text-xs mt-1">
                  Documento vivo: se genera con los datos de ahora mismo. Ábrelo en Excel o súbelo a tu SharePoint/OneDrive.
                </p>
              </div>
              <a
                href="/api/admin/catalog"
                className="bg-[#FFD54F] text-[#0B0B0B] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#FFCA28] transition-colors"
              >
                Descargar catalogo (CSV)
              </a>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total pedidos', value: metrics?.totalOrders ?? 0, icon: ShoppingBag, color: '#60A5FA' },
                { label: 'Ingresos totales', value: `${((metrics?.totalRevenue ?? 0) / 100).toFixed(0)}€`, icon: DollarSign, color: '#6EE7B7' },
                { label: 'Pedidos hoy', value: metrics?.todayOrders ?? 0, icon: CalendarDays, color: '#FFD54F' },
                { label: 'Personas totales', value: '-', icon: Users, color: '#F87171' },
              ].map((m, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}15` }}>
                      <m.icon className="w-4 h-4" style={{ color: m.color }} />
                    </div>
                    <span className="text-white/50 text-sm">{m.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{m.value}</p>
                </div>
              ))}
            </div>
            {metrics?.revenueByLevel && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
                <h3 className="font-semibold mb-4">Ingresos por nivel</h3>
                <div className="space-y-3">
                  {Object.entries(metrics.revenueByLevel as Record<string, number>).map(([lvl, rev]: [string, any]) => (
                    <div key={lvl} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: levelColor(lvl) }} />
                        <span className="capitalize text-sm">{lvl}</span>
                      </div>
                      <span className="font-semibold">{((rev ?? 0) / 100).toFixed(0)}€</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && !loadingData && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Pedidos ({orders?.length ?? 0})</h3>
              <button onClick={() => loadTab('orders')} className="text-white/40 hover:text-white text-sm flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Actualizar
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-white/40 text-left">
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Fecha</th>
                    <th className="pb-3 pr-4">Pers.</th>
                    <th className="pb-3 pr-4">Nivel</th>
                    <th className="pb-3 pr-4">Precio</th>
                    <th className="pb-3 pr-4">Estado</th>
                    <th className="pb-3 pr-4">Experiencia</th>
                    <th className="pb-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(orders ?? []).map((o: OrderType) => {
                    const exp = o?.assignedExperience
                    const isOpen = openOrder === o.id
                    return (
                    <Fragment key={o.id}>
                    <tr className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="py-3 pr-4 truncate max-w-[160px]">{o?.email ?? ''}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{formatDate(o?.date ?? '')}</td>
                      <td className="py-3 pr-4">{o?.people ?? 0}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${levelColor(o?.level ?? '')}20`, color: levelColor(o?.level ?? '') }}>
                          {o?.level ?? ''}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{((o?.price ?? 0) / 100).toFixed(0)}€</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs font-medium" style={{ color: statusColor(o?.status ?? '') }}>
                          {statusLabel(o?.status ?? '')}
                        </span>
                      </td>
                      <td className="py-3 pr-4 max-w-[240px]">
                        {exp ? (
                          <button
                            onClick={() => setOpenOrder(isOpen ? null : o.id)}
                            className="text-left group"
                            title="Ver detalle del plan asignado"
                          >
                            <span className="flex items-center gap-1 font-medium text-white group-hover:text-[#FFD54F] transition-colors">
                              <span className="truncate max-w-[180px]">{exp.name}</span>
                              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </span>
                            <span className="block text-[11px] text-white/40 truncate max-w-[220px]">
                              {exp.time} · {exp.location}
                            </span>
                            <span className={`mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium ${o?.reservationConfirmed ? 'text-green-400' : 'text-amber-400/80'}`}>
                              {o?.reservationConfirmed ? '✓ Reserva hecha' : '⚠ Reserva pendiente'}
                            </span>
                          </button>
                        ) : (
                          <span className="text-xs text-amber-400/80">Sin asignar</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1.5">
                          {o?.status === 'assigned' && !o?.whatsappSent && (
                            <button
                              onClick={() => sendReveal(o.id)}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                              title="Enviar revelación del plan al cliente"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {(o?.status === 'paid' || o?.status === 'assigned') && (
                            <button
                              onClick={() => { setAssignModal(o.id); if (experiences.length === 0) loadTab('experiences').then(() => setTab('orders')) }}
                              className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                              title={exp ? 'Cambiar la experiencia asignada' : 'Asignar experiencia'}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isOpen && exp && (
                      <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div>
                                <p className="font-semibold text-white">{exp.name}</p>
                                <p className="text-[11px] text-white/40 mt-0.5">
                                  Cliente: {o?.email ?? ''} · {o?.phone ?? ''} · {o?.people ?? 0} pers.
                                </p>
                              </div>
                              {exp.category && (
                                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/[0.06] text-white/60 whitespace-nowrap">
                                  {exp.category}
                                </span>
                              )}
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                              <div>
                                <p className="text-white/35">Hora</p>
                                <p className="text-white/80">{exp.time || '—'}</p>
                              </div>
                              <div>
                                <p className="text-white/35">Sitio</p>
                                <p className="text-white/80">{exp.location || '—'}</p>
                              </div>
                              <div>
                                <p className="text-white/35">Barrio</p>
                                <p className="text-white/80">{exp.neighborhood || '—'}</p>
                              </div>
                              <div>
                                <p className="text-white/35">Plazas libres</p>
                                <p className="text-white/80">{exp.remainingCapacity} / {exp.capacity}</p>
                              </div>
                              <div>
                                <p className="text-white/35">Coste por persona</p>
                                <p className="text-white/80">{typeof exp.costPerPerson === 'number' ? `${(exp.costPerPerson / 100).toFixed(2)}€` : '—'}</p>
                              </div>
                              <div>
                                <p className="text-white/35">Margen por persona</p>
                                <p className="text-white/80">{typeof exp.marginPerPerson === 'number' ? `${(exp.marginPerPerson / 100).toFixed(2)}€` : '—'}</p>
                              </div>
                              <div>
                                <p className="text-white/35">Origen</p>
                                {exp.sourceUrl ? (
                                  <a href={exp.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#FFD54F] hover:underline break-all">
                                    {exp.sourceName || 'Ver web'}
                                  </a>
                                ) : (
                                  <p className="text-white/80">{exp.sourceName || '—'}</p>
                                )}
                              </div>
                              <div>
                                <p className="text-white/35">Reserva</p>
                                <p className="text-white/80">{o?.whatsappSent ? 'Plan ya revelado al cliente' : 'Sin revelar todavía'}</p>
                              </div>
                            </div>
                            <div className="mt-4 border-t border-white/[0.06] pt-3">
                              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={Boolean(o?.reservationConfirmed)}
                                  onChange={(e) => toggleReservation(o.id, e.target.checked)}
                                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#FFD54F] cursor-pointer"
                                />
                                <span className="text-xs">
                                  <span className={`font-medium ${o?.reservationConfirmed ? 'text-green-400' : 'text-amber-400'}`}>
                                    Ya he reservado en el sitio
                                  </span>
                                  <span className="block text-white/40 mt-0.5">
                                    Marca esta casilla cuando hayas llamado o reservado en {exp.location || 'el local'} a nombre del cliente. Si el plan es mañana y sigue sin marcar, recibirás un email de aviso.
                                  </span>
                                </span>
                              </label>
                            </div>
                            {exp.description && (
                              <p className="mt-4 text-xs leading-relaxed text-white/50 border-t border-white/[0.06] pt-3">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                    )
                  })}
                </tbody>
              </table>
              {(orders?.length ?? 0) === 0 && (
                <p className="text-white/30 text-center py-12 text-sm">No hay pedidos aún</p>
              )}
            </div>
          </div>
        )}

        {/* EXPERIENCES */}
        {tab === 'experiences' && !loadingData && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Experiencias ({experiences?.length ?? 0})</h3>
              <button
                onClick={() => setNewExpModal(true)}
                className="bg-[#FFD54F] text-[#0B0B0B] text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-[#FFCA28] transition-colors"
              >
                <Plus className="w-4 h-4" /> Añadir
              </button>
            </div>
            <div className="grid gap-3">
              {(experiences ?? []).map((exp: ExperienceType) => (
                <div key={exp.id} className={`bg-white/[0.03] border rounded-xl p-5 flex items-center justify-between ${exp?.isActive ? 'border-white/[0.06]' : 'border-white/[0.03] opacity-50'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{exp?.name ?? ''}</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${levelColor(exp?.level ?? '')}20`, color: levelColor(exp?.level ?? '') }}>
                        {exp?.level ?? ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-white/40 text-xs">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {formatDate(exp?.date ?? '')}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exp?.time ?? ''}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp?.location ?? ''}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {exp?.remainingCapacity ?? 0}/{exp?.capacity ?? 0}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExperience(exp.id)}
                    className="ml-4 flex-shrink-0"
                    title={exp?.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {exp?.isActive
                      ? <ToggleRight className="w-7 h-7 text-[#6EE7B7]" />
                      : <ToggleLeft className="w-7 h-7 text-white/20" />
                    }
                  </button>
                </div>
              ))}
              {(experiences?.length ?? 0) === 0 && (
                <p className="text-white/30 text-center py-12 text-sm">No hay experiencias</p>
              )}
            </div>
          </div>
        )}

        {tab === 'reviews' && !loadingData && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                Reseñas ({reviews?.length ?? 0}) ·{' '}
                <span className="text-white/40 text-sm font-normal">
                  {(reviews ?? []).filter((r) => !r.approved).length} pendientes
                </span>
              </h3>
              <button onClick={() => loadTab('reviews')} className="text-white/40 hover:text-white text-sm flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Refrescar
              </button>
            </div>
            <div className="grid gap-3">
              {(reviews ?? []).map((r) => (
                <div key={r.id} className={`bg-white/[0.03] border rounded-xl p-5 ${r.approved ? 'border-[#6EE7B7]/20' : 'border-[#FFD54F]/25'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-[#FFD54F] text-xs">{'★'.repeat(r.stars)}</span>
                        {r.level && <span className="text-white/30 text-xs">{r.level}</span>}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.approved ? 'bg-[#6EE7B7]/15 text-[#6EE7B7]' : 'bg-[#FFD54F]/15 text-[#FFD54F]'}`}>
                          {r.approved ? 'Publicada' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed mt-2">{r.text}</p>
                      <p className="text-white/25 text-xs mt-2">{formatDate(r.createdAt)}</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleReview(r.id, !r.approved)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${r.approved ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.12]' : 'bg-[#FFD54F] text-[#0B0B0B] hover:bg-[#FFCA28]'}`}
                      >
                        {r.approved ? 'Ocultar' : 'Publicar'}
                      </button>
                      <button
                        onClick={() => deleteReview(r.id)}
                        className="text-xs text-white/30 hover:text-red-400 transition-colors"
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {(reviews?.length ?? 0) === 0 && (
                <p className="text-white/30 text-center py-12 text-sm">Aún no hay reseñas enviadas</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ASSIGN MODAL */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6" onClick={() => setAssignModal(null)}>
          <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Asignar experiencia</h3>
              <button onClick={() => setAssignModal(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {(experiences ?? []).filter((e: ExperienceType) => e?.isActive && (e?.remainingCapacity ?? 0) > 0).map((exp: ExperienceType) => (
                <button
                  key={exp.id}
                  onClick={() => assignExperience(assignModal, exp.id)}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                >
                  <p className="font-medium text-sm">{exp?.name ?? ''}</p>
                  <p className="text-white/40 text-xs mt-0.5">{formatDate(exp?.date ?? '')} · {exp?.time ?? ''} · {exp?.location ?? ''} · {exp?.remainingCapacity ?? 0} plazas</p>
                </button>
              ))}
              {(experiences ?? []).filter((e: ExperienceType) => e?.isActive && (e?.remainingCapacity ?? 0) > 0).length === 0 && (
                <p className="text-white/40 text-sm text-center py-4">No hay experiencias disponibles</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW EXPERIENCE MODAL */}
      {newExpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6" onClick={() => setNewExpModal(false)}>
          <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Nueva experiencia</h3>
              <button onClick={() => setNewExpModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={newExp.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewExp({ ...newExp, name: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FFD54F]/50"
              />
              <select
                value={newExp.level}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewExp({ ...newExp, level: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD54F]/50"
              >
                <option value="soft" className="bg-[#141414]">Soft</option>
                <option value="medium" className="bg-[#141414]">Medium</option>
                <option value="full" className="bg-[#141414]">Full</option>
              </select>
              <input
                type="date"
                value={newExp.date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewExp({ ...newExp, date: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD54F]/50 [color-scheme:dark]"
              />
              <input
                type="time"
                value={newExp.time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewExp({ ...newExp, time: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD54F]/50 [color-scheme:dark]"
              />
              <input
                type="text"
                placeholder="Ubicación"
                value={newExp.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewExp({ ...newExp, location: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FFD54F]/50"
              />
              <input
                type="number"
                placeholder="Capacidad"
                value={newExp.capacity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewExp({ ...newExp, capacity: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FFD54F]/50"
              />
              <button
                onClick={createExperience}
                disabled={!newExp.name || !newExp.date || !newExp.time || !newExp.location}
                className="w-full bg-[#FFD54F] text-[#0B0B0B] font-bold py-3 rounded-xl hover:bg-[#FFCA28] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Crear experiencia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}