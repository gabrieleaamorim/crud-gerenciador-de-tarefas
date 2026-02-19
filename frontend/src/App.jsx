import { useEffect, useState } from 'react'
import './App.css'

const API_URL = '/tasks'
const priorityLabels = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}
const priorityOrder = {
  alta: 0,
  media: 1,
  baixa: 2,
}

function sortByPriority(tasks) {
  return [...tasks].sort((firstTask, secondTask) => {
    const firstPriority = priorityOrder[firstTask.priority ?? 'media'] ?? 1
    const secondPriority = priorityOrder[secondTask.priority ?? 'media'] ?? 1
    return firstPriority - secondPriority
  })
}

function App() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('media')

  async function loadTasks(searchTerm = '') {
    setLoading(true)
    setError('')

    try {
      const query = searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : ''
      const response = await fetch(`${API_URL}${query}`)

      if (!response.ok) {
        throw new Error('Não foi possível carregar as tarefas.')
      }

      const data = await response.json()
      setTasks(data)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      setError('Preencha título e descrição.')
      return
    }

    const isEditing = Boolean(editingTaskId)
    const method = isEditing ? 'PUT' : 'POST'
    const endpoint = isEditing ? `${API_URL}/${editingTaskId}` : API_URL

    setError('')

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
        }),
      })

      if (!response.ok) {
        throw new Error('Não foi possível salvar a tarefa.')
      }

      setTitle('')
      setDescription('')
      setPriority('media')
      setEditingTaskId(null)
      setActiveTab('tasks')
      await loadTasks(search)
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  function handleEdit(task) {
    setEditingTaskId(task.id)
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority ?? 'media')
    setError('')
    setActiveTab('create')
  }

  function cancelEdit() {
    setEditingTaskId(null)
    setTitle('')
    setDescription('')
    setPriority('media')
    setActiveTab('tasks')
  }

  async function handleDelete(taskId) {
    setError('')

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Não foi possível excluir a tarefa.')
      }

      await loadTasks(search)
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  async function handleToggleComplete(taskId) {
    setError('')

    try {
      const response = await fetch(`${API_URL}/${taskId}/complete`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error('Não foi possível alterar o status da tarefa.')
      }

      await loadTasks(search)
    } catch (toggleError) {
      setError(toggleError.message)
    }
  }

  async function handleSearch(event) {
    event.preventDefault()
    await loadTasks(search)
  }

  const pendingTasks = sortByPriority(tasks.filter((task) => task.completed_at === null))
  const completedTasks = sortByPriority(tasks.filter((task) => task.completed_at !== null))

  return (
    <main className="container">
      <header>
        <h1>Minhas tarefas</h1>
        <p>Um novo checklist de tarefas para organizar seu dia a dia.</p>
      </header>

      <nav className="tabs" aria-label="Navegação principal">
        <button
          type="button"
          className={activeTab === 'tasks' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('tasks')}
        >
          Tarefas
        </button>
        <button
          type="button"
          className={activeTab === 'create' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('create')}
        >
          Criar tarefa
        </button>
        <button
          type="button"
          className={activeTab === 'completed' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('completed')}
        >
          Concluídas
        </button>
      </nav>

      {activeTab === 'tasks' && (
        <section className="panel">
          <h2>Tarefas</h2>

          <form className="search" onSubmit={handleSearch}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título ou descrição"
            />
            <button type="submit" className="secondary">
              Buscar
            </button>
          </form>

          {error && <p className="error">{error}</p>}
          {loading && <p>Carregando...</p>}

          {!loading && pendingTasks.length === 0 && <p>Nenhuma tarefa pendente encontrada.</p>}

          {!loading && pendingTasks.length > 0 && (
            <ul className="task-list">
              {pendingTasks.map((task) => {
                return (
                  <li key={task.id}>
                    <div className="task-content">
                      <strong>{task.title}</strong>
                      <span className={`priority ${task.priority ?? 'media'}`}>
                        Prioridade: {priorityLabels[task.priority ?? 'media']}
                      </span>
                      <p>{task.description}</p>
                    </div>

                    <div className="task-actions">
                      <button type="button" className="secondary" onClick={() => handleToggleComplete(task.id)}>
                        Concluir
                      </button>
                      <button type="button" className="secondary" onClick={() => handleEdit(task)}>
                        Editar
                      </button>
                      <button type="button" className="danger" onClick={() => handleDelete(task.id)}>
                        Excluir
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}

      {activeTab === 'create' && (
        <section className="panel">
          <h2>{editingTaskId ? 'Editar tarefa' : 'Nova tarefa'}</h2>

          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="title">Título</label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex: Estudar React"
            />

            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Detalhes da tarefa"
              rows={3}
            />

            <label htmlFor="priority">Nível de prioridade</label>
            <select id="priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>

            {error && <p className="error">{error}</p>}

            <div className="form-actions">
              <button type="submit">{editingTaskId ? 'Salvar' : 'Criar'}</button>
              {editingTaskId && (
                <button type="button" className="secondary" onClick={cancelEdit}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      {activeTab === 'completed' && (
        <section className="panel">
          <h2>Tarefas concluídas</h2>

          {error && <p className="error">{error}</p>}
          {loading && <p>Carregando...</p>}

          {!loading && completedTasks.length === 0 && <p>Nenhuma tarefa concluída.</p>}

          {!loading && completedTasks.length > 0 && (
            <ul className="task-list">
              {completedTasks.map((task) => (
                <li key={task.id} className="completed">
                  <div className="task-content">
                    <strong>{task.title}</strong>
                    <span className={`priority ${task.priority ?? 'media'}`}>
                      Prioridade: {priorityLabels[task.priority ?? 'media']}
                    </span>
                    <p>{task.description}</p>
                  </div>

                  <div className="task-actions">
                    <button type="button" className="secondary" onClick={() => handleToggleComplete(task.id)}>
                      Reabrir
                    </button>
                    <button type="button" className="secondary" onClick={() => handleEdit(task)}>
                      Editar
                    </button>
                    <button type="button" className="danger" onClick={() => handleDelete(task.id)}>
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  )
}

export default App
