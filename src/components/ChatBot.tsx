'use client';

import { useState } from 'react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface AlertState {
  type: 'success' | 'error' | null;
  message: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hola, ¿cómo puedo ayudarte?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [alert, setAlert] = useState<AlertState>({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      setAlert({
        type: 'error',
        message: 'Por favor escribe un mensaje',
      });
      setTimeout(() => setAlert({ type: null, message: '' }), 3000);
      return;
    }

    try {
      setIsLoading(true);

      // Agregar mensaje del usuario
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: input,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      // Simular envío al servidor
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Agregar respuesta del bot
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Mensaje recibido correctamente. Estoy procesando tu solicitud.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      setAlert({
        type: 'success',
        message: 'Mensaje enviado exitosamente',
      });
      setTimeout(() => setAlert({ type: null, message: '' }), 3000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Error al enviar el mensaje. Intenta de nuevo.',
      });
      setTimeout(() => setAlert({ type: null, message: '' }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Chat Bot</h2>

      {/* Alert */}
      {alert.type && (
        <div
          className={`mb-4 p-4 rounded-lg text-white text-sm font-medium ${
            alert.type === 'success'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:bg-gray-400"
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
