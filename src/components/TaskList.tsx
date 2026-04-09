'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Task } from '@/lib/api';
import { analyzeTask, createTask, deleteTask, listTasks, updateSubtask, updateTask } from '@/lib/api';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const userId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userId');
  }, []);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const refresh = async () => {
    if (!userId) {
      setError('Falta iniciar sesión (no hay userId). Ve a /auth.');
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await listTasks(userId, { ordering: '-created_at' });
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!title.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const created = await createTask(userId, {
        title: title.trim(),
        description: description.trim(),
      });
      setTasks((prev) => [created, ...prev]);
      setTitle('');
      setDescription('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error creando tarea');
    } finally {
      setCreating(false);
    }
  };

  const handleComplete = async (taskId: string) => {
    if (!userId) return;
    setBusyId(taskId);
    setError(null);
    try {
      const updated = await updateTask(userId, taskId, { status: 'completed' });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error actualizando tarea');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!userId) return;
    setBusyId(taskId);
    setError(null);
    try {
      await deleteTask(userId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error eliminando tarea');
    } finally {
      setBusyId(null);
    }
  };

  const handleAnalyze = async (taskId: string) => {
    if (!userId) return;
    setBusyId(taskId);
    setError(null);
    try {
      const analyzed = await analyzeTask(userId, taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? analyzed : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error analizando tarea');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string, completed: boolean) => {
    if (!userId) return;
    setBusyId(taskId);
    setError(null);
    try {
      const updated = await updateSubtask(userId, taskId, subtaskId, completed);
      setTasks((prev) =>
        prev.map((t) =>
          t.id !== taskId
            ? t
            : {
                ...t,
                subtasks: t.subtasks.map((s) => (s.id === subtaskId ? updated : s)),
              }
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error actualizando subtask');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Tareas</h2>
        <div className="text-sm text-gray-600">
          {completedCount} de {tasks.length} completadas
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={creating || !title.trim()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:bg-gray-400"
          >
            {creating ? 'Creando...' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition disabled:bg-gray-100"
          >
            Refrescar
          </button>
        </div>
      </form>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%`,
          }}
        />
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="text-gray-600 text-sm">Cargando tareas...</div>
        ) : (
          tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 border-l-4 border-blue-500"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800 flex-1">
                {task.title}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {getStatusLabel(task.status)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {task.description}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 gap-3">
              <div className="text-xs text-gray-500">
                {new Date(task.created_at).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="text-xs text-gray-600">
                {task.category ? `#${task.category}` : '#sin-clasificar'}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === task.id || task.status === 'completed'}
                onClick={() => handleComplete(task.id)}
                className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs disabled:bg-gray-300"
              >
                Completar
              </button>
              <button
                type="button"
                disabled={busyId === task.id}
                onClick={() => handleAnalyze(task.id)}
                className="px-3 py-1 rounded bg-purple-500 hover:bg-purple-600 text-white text-xs disabled:bg-gray-300"
              >
                Analizar
              </button>
              <button
                type="button"
                disabled={busyId === task.id}
                onClick={() => handleDelete(task.id)}
                className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs disabled:bg-gray-300"
              >
                Eliminar
              </button>
            </div>

            {task.subtasks?.length ? (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-semibold text-gray-700">Subtareas</div>
                {task.subtasks.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={s.completed}
                      disabled={busyId === task.id}
                      onChange={(e) => handleToggleSubtask(task.id, s.id, e.target.checked)}
                    />
                    <span className={s.completed ? 'line-through text-gray-400' : ''}>{s.title}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        ))
        )}
      </div>
    </div>
  );
}
