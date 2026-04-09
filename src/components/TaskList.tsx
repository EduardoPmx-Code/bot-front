'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export default function TaskList() {
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Configurar base de datos',
      description: 'Configurar la base de datos PostgreSQL y tablas iniciales',
      status: 'completed',
      priority: 'high',
      dueDate: '2026-04-05',
    },
    {
      id: '2',
      title: 'Crear componentes React',
      description: 'Desarrollar componentes reutilizables para el dashboard',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-04-12',
    },
    {
      id: '3',
      title: 'Implementar autenticación',
      description: 'Integrar NextAuth para la autenticación de usuarios',
      status: 'pending',
      priority: 'medium',
      dueDate: '2026-04-15',
    },
    {
      id: '4',
      title: 'Testing y QA',
      description: 'Realizar pruebas unitarias e integración',
      status: 'pending',
      priority: 'medium',
      dueDate: '2026-04-20',
    },
    {
      id: '5',
      title: 'Deploy a producción',
      description: 'Desplegar la aplicación en Vercel',
      status: 'pending',
      priority: 'low',
      dueDate: '2026-04-25',
    },
  ]);

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

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Tareas</h2>
        <div className="text-sm text-gray-600">
          {completedCount} de {tasks.length} completadas
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${(completedCount / tasks.length) * 100}%`,
          }}
        />
      </div>

      {/* Tasks Grid */}
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
    </div>
  );
}
