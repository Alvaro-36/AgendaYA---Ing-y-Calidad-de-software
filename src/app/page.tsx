'use client';

import SeleccionEvento from '@/components/SeleccionEvento';
import FormularioDatosPersonales from '@/components/FormularioDatosPersonales';

export default function Home() {
  const handleSubmit = () => {
    alert('Datos guardados correctamente. Redireccionando a Confirmar Reserva');
  };

  const handleCancel = () => {
    alert('Redireccionando a calendario');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 p-4 flex flex-col items-center">
      <SeleccionEvento />
      <div className="max-w-sm mx-auto mt-6 w-full">
        <FormularioDatosPersonales onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </main>
  );
}