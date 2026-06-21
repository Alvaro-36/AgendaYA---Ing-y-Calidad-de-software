import { editarDatosReserva, getResumenReserva, Reserva, DatosReserva } from '@/domain/services/editarReserva';

describe('Editar Reserva - M04_US5', () => {
  it('Escenario 1 — Edición exitosa antes de confirmar', () => {
    const reserva: Reserva = {
      id: 'r-1',
      datos: {
        profesional: 'Dr. X',
        especialidad: 'Cardio',
        tipoConsulta: 'Consulta inicial',
        duracion: 30,
        fecha: '2026-07-01',
        horario: '09:00',
        descripcion: 'Consulta general',
        modalidad: 'presencial',
        pacienteNombre: 'Juan Perez',
        pacienteEmail: 'juan@example.com'
      },
      estado: 'en_proceso'
    };

    const cambios: Partial<DatosReserva> = {
      pacienteNombre: 'Juan P. Actualizado',
      pacienteEmail: 'juan.actualizado@example.com'
    };

    const actualizado = editarDatosReserva(reserva, cambios);

    expect(actualizado.datos.pacienteNombre).toBe('Juan P. Actualizado');
    expect(actualizado.datos.pacienteEmail).toBe('juan.actualizado@example.com');
    expect(actualizado.estado).toBe('en_proceso');

    const resumen = getResumenReserva(actualizado);
    expect(resumen.pacienteNombre).toBe('Juan P. Actualizado');
    expect(resumen.pacienteEmail).toBe('juan.actualizado@example.com');
  });

  it('Escenario 2 — Validación de datos modificados', () => {
    const reserva: Reserva = {
      id: 'r-2',
      datos: {
        profesional: 'Dr. Y',
        especialidad: 'Dermato',
        tipoConsulta: 'Seguimiento',
        duracion: 20,
        fecha: '2026-07-02',
        horario: '10:00',
        descripcion: 'Control',
        modalidad: 'virtual',
        pacienteNombre: 'Ana Lopez',
        pacienteEmail: 'ana@example.com'
      },
      estado: 'en_proceso'
    };

    // Nombre con numeros e email inválido
    const cambios: Partial<DatosReserva> = {
      pacienteNombre: 'Ana123',
      pacienteEmail: 'not-an-email'
    };

    expect(() => editarDatosReserva(reserva, cambios)).toThrow(/inválid/i);
  });

  it('Escenario 3 — Cancelación de edición: no muta el original', () => {
    const reserva: Reserva = {
      id: 'r-3',
      datos: {
        profesional: 'Dr. Z',
        especialidad: 'Pediatria',
        tipoConsulta: 'Consulta',
        duracion: 15,
        fecha: '2026-07-03',
        horario: '11:00',
        descripcion: '',
        modalidad: 'presencial',
        pacienteNombre: 'Carlos Ruiz',
        pacienteEmail: 'carlos@example.com'
      },
      estado: 'en_proceso'
    };

    const cambios: Partial<DatosReserva> = { pacienteNombre: 'Temporal Cambio' };

    const copia = editarDatosReserva(reserva, cambios);

    // Simulo que el usuario cancela: no aplico la copia al original.
    // Verifico que la función no mutó el objeto original y devolvió una nueva versión.
    expect(reserva.datos.pacienteNombre).toBe('Carlos Ruiz');
    expect(copia.datos.pacienteNombre).toBe('Temporal Cambio');
  });
});
