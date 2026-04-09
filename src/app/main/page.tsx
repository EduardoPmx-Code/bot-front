'use client';

import { useRouter } from 'next/navigation';

export default function MainPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bienvenido</h2>
            <p className="text-gray-600">
              Este es tu dashboard principal. Aquí puedes ver tu información y realizar acciones.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
            <p className="text-gray-600">
              Consulta tus estadísticas y datos de rendimiento en tiempo real.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuración</h2>
            <p className="text-gray-600">
              Personaliza tu perfil y ajusta tus preferencias de cuenta.
            </p>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">¡Hola, Usuario!</h2>
          <p className="text-lg opacity-90">
            Tu aplicación está lista para usar. Continúa configurando tus preferencias y comienza a trabajar.
          </p>
          <button className="mt-6 px-6 py-2 bg-white text-blue-500 font-semibold rounded-lg hover:bg-gray-100 transition">
            Comenzar
          </button>
        </div>
      </main>
    </div>
  );
}
