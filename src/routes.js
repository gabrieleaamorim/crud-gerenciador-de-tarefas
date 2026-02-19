import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();
const validPriorities = ['baixa', 'media', 'alta'];

function normalizePriority(priority) {
  if (typeof priority !== 'string') {
    return 'media';
  }

  const normalized = priority.toLowerCase();
  return validPriorities.includes(normalized) ? normalized : 'media';
}

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const tasks = database.select('tasks', { id });

            if (tasks.length === 0) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }

            return res.writeHead(200).end()
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
        const { title, description, priority } = req.body;
            const task = {
                id: randomUUID(),
                title, 
                description,
          priority: normalizePriority(priority),
                completed_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            database.insert('tasks', task);
            return res.writeHead(201).end();
        }
    },
    {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const tasks = database.select('tasks', { id });

      if (tasks.length === 0) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
      }

      const task = tasks[0];
      const isCompleted = task.completed_at !== null;

      database.update('tasks', id, { 
        completed_at: isCompleted ? null : new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      return res.writeHead(204).end()
    }
  },
    {
        method: 'GET',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const tasks = database.select('tasks', { id });

            if (tasks.length === 0) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }

            return res.writeHead(200).end()
        }
    },
    {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description, priority } = req.body

      const tasks = database.select('tasks', { id });

      if (tasks.length === 0) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
      }

      database.update('tasks', id, { 
        title, 
        description,
        priority: normalizePriority(priority),
        updated_at: new Date().toISOString()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const tasks = database.select('tasks', { id });

      if (tasks.length === 0) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
];