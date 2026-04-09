'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatBot from '@/components/ChatBot';
import TaskList from '@/components/TaskList';

type ViewMode = 'chat' | 'tasks';

export default function MainPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Implementar lógica de logout
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setViewMode('chat')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              viewMode === 'chat'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            💬 Chat Bot
          </button>
          <button
            onClick={() => setViewMode('tasks')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              viewMode === 'tasks'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            📋 Lista de Tareas
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-96">
          {viewMode === 'chat' ? (
            <ChatBot />
          ) : (
            <TaskList />
          )}
        </div>
      </main>
    </div>
  );
}
