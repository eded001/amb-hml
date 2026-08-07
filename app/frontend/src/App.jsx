import { useState, useEffect } from 'react'
import {
  FlaskConical,
  Rocket,
  Laptop,
  Database,
  Plus,
  Trash2,
  RefreshCw,
  Server,
  HardDrive,
  ListTodo,
  Clock,
  Activity,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react'

function App() {
  const [items, setItems] = useState([])
  const [systemInfo, setSystemInfo] = useState(null)
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('Ativo')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const envName = import.meta.env.VITE_APP_ENV || 'desenvolvimento'
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  const isHml = envName === 'homologacao'
  const isProd = envName === 'producao'

  const fetchItemsAndInfo = async () => {
    try {
      setLoading(true)
      setErrorMessage(null)
      const [itemsRes, infoRes] = await Promise.all([
        fetch(`${apiUrl}/api/items`),
        fetch(`${apiUrl}/api/info`)
      ])

      if (itemsRes.ok) {
        const data = await itemsRes.json()
        setItems(data)
      } else {
        setErrorMessage('Erro ao carregar registros do banco SQLite')
      }

      if (infoRes.ok) {
        const info = await infoRes.json()
        setSystemInfo(info)
      }
    } catch (err) {
      console.error('Erro ao conectar com a API:', err)
      setErrorMessage(`Não foi possível conectar ao servidor (${apiUrl}). Verifique se o backend Go está em execução.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItemsAndInfo()
  }, [])

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setSubmitting(true)
      setErrorMessage(null)
      const res = await fetch(`${apiUrl}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status })
      })

      if (res.ok) {
        setTitle('')
        await fetchItemsAndInfo()
      } else {
        const errData = await res.json()
        setErrorMessage(`Falha ao gravar no SQLite: ${errData.error || 'Erro desconhecido'}`)
      }
    } catch (err) {
      console.error('Erro ao adicionar item:', err)
      setErrorMessage(`Erro ao enviar dados para a API: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      setErrorMessage(null)
      const res = await fetch(`${apiUrl}/api/items?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        await fetchItemsAndInfo()
      } else {
        const errData = await res.json()
        setErrorMessage(`Falha ao deletar item do SQLite: ${errData.error || 'Erro desconhecido'}`)
      }
    } catch (err) {
      console.error('Erro ao excluir item:', err)
      setErrorMessage(`Erro de conexão ao deletar: ${err.message}`)
    }
  }

  const getEnvBadgeColor = () => {
    if (isHml) return 'bg-amber-600 border-amber-500 text-white'
    if (isProd) return 'bg-emerald-600 border-emerald-500 text-white'
    return 'bg-blue-600 border-blue-500 text-white'
  }

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Concluído':
      case 'Aprovado':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'Em Progresso':
      case 'Em Teste':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Banner de Ambiente */}
      <header className={`py-3 px-6 text-center font-bold text-sm tracking-wide shadow-md border-b flex justify-between items-center ${getEnvBadgeColor()}`}>
        <div className="flex items-center space-x-2.5">
          {isHml ? (
            <FlaskConical className="w-5 h-5 animate-pulse" />
          ) : isProd ? (
            <Rocket className="w-5 h-5 animate-pulse" />
          ) : (
            <Laptop className="w-5 h-5 animate-pulse" />
          )}
          <span>
            {isHml ? 'AMBIENTE DE HOMOLOGAÇÃO (HML)' : isProd ? 'AMBIENTE DE PRODUÇÃO (PROD)' : 'AMBIENTE DE DESENVOLVIMENTO (DEV)'}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono opacity-90 bg-black/20 px-3 py-1 rounded-md">
          <Server className="w-3.5 h-3.5" />
          <span>API: {apiUrl}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-grow space-y-8">
        {/* Banner de Alerta de Erro caso ocorra */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl p-4 flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 px-2.5 py-1 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Painel do Banco SQLite Ativo */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                  <Database className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">Banco de Dados SQLite Ativo</h1>
              </div>
              <p className="text-slate-400 text-sm pl-12">
                Persistência de gravação física em arquivo SQLite isolado por ambiente
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 min-w-[280px]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                  <span>Arquivo SQLite:</span>
                </span>
                <span className="text-blue-400 font-semibold truncate max-w-[180px]" title={systemInfo?.db_path}>
                  {systemInfo?.db_path || 'Carregando...'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-900">
                <span className="flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span>Total Registrado:</span>
                </span>
                <span className="text-emerald-400 font-semibold">{systemInfo?.total_items ?? items.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Formulário para Adicionar Registro */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-blue-400" />
            <span>Gravar Novo Item no Banco SQLite</span>
          </h2>
          
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Digite o título do item..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="Ativo">Ativo</option>
              <option value="Em Teste">Em Teste</option>
              <option value="Concluído">Concluído</option>
              <option value="Pendente">Pendente</option>
            </select>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Gravando...' : 'Gravar no Banco'}</span>
            </button>
          </form>
        </section>

        {/* Lista de Registros */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-semibold text-slate-200 flex items-center space-x-2">
              <ListTodo className="w-4 h-4 text-slate-400" />
              <span>Registros Armazenados ({items.length})</span>
            </h2>
            <button
              onClick={fetchItemsAndInfo}
              className="text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>

          {loading ? (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
              <Activity className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-sm">Consultando banco de dados...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">Nenhum registro encontrado no SQLite. Crie um novo item acima!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-medium text-slate-100 text-sm leading-relaxed">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
                      title="Excluir do SQLite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <span className={`px-2.5 py-1 rounded-full border ${getStatusBadge(item.status)} font-medium flex items-center space-x-1.5`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{item.status}</span>
                    </span>
                    <span className="text-slate-500 font-mono flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{item.environment || envName}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 flex justify-center items-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
        <span>Amb-HML • React + Tailwind CSS + Lucide Icons + SQLite (Go)</span>
      </footer>
    </div>
  )
}

export default App
