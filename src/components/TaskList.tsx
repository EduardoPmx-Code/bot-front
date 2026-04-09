'use client';

import { useState, useEffect } from 'react';

interface ApiTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  category: 'personal' | 'work' | 'urgent' | null;
  created_at: string;
  updated_at: string;
  subtasks: Array<{
    id: string;
    title: string;
    order: number;
    completed: boolean;
  }>;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

const API_BASE_URL = 'http://localhost:8000';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener token del localStorage (ajusta la clave según tu implementación)
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/tasks`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('No autenticado. Por favor inicia sesión.');
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const apiTasks: ApiTask[] = await response.json();

        // Convertir tareas de la API al formato del componente
        const convertedTasks: Task[] = apiTasks.map((apiTask) => ({
          id: apiTask.id,
          title: apiTask.title,
          description: apiTask.description,
          status: apiTask.status === 'completed' ? 'completed' : 'pending',
          // Mapear categoría a prioridad
          priority: 
            apiTask.category === 'urgent' ? 'high' :
            apiTask.category === 'work' ? 'medium' :
            'low',
          // Usar created_at como dueDate
          dueDate: new Date(apiTask.created_at).toISOString().split('T')[0],
        }));

        setTasks(convertedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar las tareas. Intenta de nuevo.'
        );
        // Fallback a datos vacíos si falla
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
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
      case 'in-progress':
        return 'En Progreso';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      case 'low':
        return 'border-l-4 border-green-500';
      default:
        return 'border-l-4 border-gray-500';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '🔴 Alta';
      case 'medium':
        return '🟡 Media';
      case 'low':
        return '🟢 Baja';
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Tareas</h2>
        <div className="text-sm text-gray-600">
          {loading ? (
            'Cargando...'
          ) : (
            <>
              {completedCount} de {tasks.length} completadas
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2">
            Asegúrate de que el backend está corriendo en localhost:8000
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tareas...</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {!loading && tasks.length > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(completedCount / tasks.length) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && tasks.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay tareas disponibles</p>
          <p className="text-gray-400 text-sm">Crea una nueva tarea para empezar</p>
        </div>
      )}

      {/* Tasks Grid */}
      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow hover:shadow-lg transition p-4 ${getPriorityColor(
                task.priority
              )}`}
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
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-600">
                  {getPriorityLabel(task.priority)}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(task.dueDate).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
