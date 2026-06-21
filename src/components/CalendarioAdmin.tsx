import React, { useState } from 'react';

interface CalendarioAdminProps {
  hoy: Date;
}

export default function CalendarioAdmin({ hoy }: CalendarioAdminProps) {
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(17);

  const tieneReservas = diaSeleccionado === 18;
  const esVacio = diaSeleccionado === 25;
  const esFuturo = diaSeleccionado === 20;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Panel de Administración - AgendaYA</h2>


      <div role="region" aria-label="Calendario" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {[17, 18, 20, 25].map((dia) => (
          <button
            key={dia}
            onClick={() => setDiaSeleccionado(dia)}
            aria-pressed={diaSeleccionado === dia}
            style={{
              padding: '10px',
              borderRadius: '50%',
              border: '1px solid #ccc',
              backgroundColor: diaSeleccionado === dia ? '#28a745' : '#f8f9fa',
              color: diaSeleccionado === dia ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            {dia}
          </button>
        ))}
      </div>


      <div role="region" aria-label="Lista de reservas" style={{ border: '1px solid #ddd', padding: '15px' }}>
        <h3>Reservas del día seleccionado:</h3>

        {tieneReservas && (
          <div>
            <p><strong>Cliente:</strong> Mateo De Luca</p>
            <p>Horario: 09:00 - Consulta Médica</p>
          </div>
        )}

        {esVacio && (
          <p>No hay reservas programadas para este día</p>
        )}

        {!tieneReservas && !esVacio && (
          <p>Seleccioná un día para ver los detalles.</p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          disabled={esFuturo}
          style={{ padding: '10px 20px', cursor: esFuturo ? 'not-allowed' : 'pointer' }}
        >
          Completar Turno
        </button>
      </div>
    </div>
  );
}