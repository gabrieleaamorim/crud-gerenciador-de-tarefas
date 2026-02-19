import { useEffect, useState } from 'react'
import './App.css'

const API_URL = '/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

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
        }),
      })

      if (!response.ok) {
        throw new Error('Não foi possível salvar a tarefa.')
      }

      setTitle('')
      setDescription('')
      setEditingTaskId(null)
      await loadTasks(search)
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  function handleEdit(task) {
    setEditingTaskId(task.id)
    setTitle(task.title)
    setDescription(task.description)
    setError('')
  }

  function cancelEdit() {
    setEditingTaskId(null)
    setTitle('')
    setDescription('')
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

  return (
    <main className="container">
      <header>
        <h1>Minhas tarefas</h1>
        <p>Um novo checklist de tarefas para organizar seu dia a dia.</p>
      </header>

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

        {!loading && tasks.length === 0 && <p>Nenhuma tarefa encontrada.</p>}

        {!loading && tasks.length > 0 && (
          <ul className="task-list">
            {tasks.map((task) => {
              const completed = task.completed_at !== null

              return (
                <li key={task.id} className={completed ? 'completed' : ''}>
                  <div className="task-content">
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                  </div>

                  <div className="task-actions">
                    <button type="button" className="secondary" onClick={() => handleToggleComplete(task.id)}>
                      {completed ? 'Reabrir' : 'Concluir'}
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
    </main>
  )
}

export default App
