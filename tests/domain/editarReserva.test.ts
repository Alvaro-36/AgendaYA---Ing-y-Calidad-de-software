import { editarDatosReserva, getResumenReserva, Reserva } from '@/domain/services/editarReserva';

describe('editarDatosReserva (M04_US5)', () => {
  const baseReserva: Reserva = {
    id: 'r1',
    estado: 'en_proceso',
    datos: {
      profesional: 'Dr. X',
      especialidad: 'Cardiología',
      tipoConsulta: 'Consulta inicial',
      duracion: 30,
      fecha: '2026-07-01',
      horario: '09:00',
      descripcion: 'Primera consulta',
      modalidad: 'presencial',
      pacienteNombre: 'Juan Perez',
      pacienteEmail: 'juan@example.com'
    }
  };

  it('Escenario 1 — edición exitosa antes de confirmar: actualiza datos y resumen, estado permanece pendiente', () => {
    const cambios = {
      pacienteNombre: 'Juan Pablo Moreno',
      pacienteEmail: 'juan.moreno@example.com',
      descripcion: 'Cambio de nota'
    };

    const nueva = editarDatosReserva(baseReserva, cambios);

    // Nuevo objeto con datos actualizados
    expect(nueva).not.toBe(baseReserva);
    expect(nueva.datos.pacienteNombre).toBe(cambios.pacienteNombre);
    expect(nueva.datos.pacienteEmail).toBe(cambios.pacienteEmail);
    expect(nueva.datos.descripcion).toBe(cambios.descripcion);

    // Resumen refleja los nuevos datos
    const resumen = getResumenReserva(nueva);
    expect(resumen.pacienteNombre).toBe(cambios.pacienteNombre);
    expect(resumen.pacienteEmail).toBe(cambios.pacienteEmail);
    expect(resumen.fecha).toBe(baseReserva.datos.fecha);
    expect(resumen.horario).toBe(baseReserva.datos.horario);

    // Estado no cambia a confirmada
    expect(nueva.estado).toBe('en_proceso');
  });

  it('Escenario 2 — validación de datos modificados: rechaza nombre o email inválido', () => {
    // Nombre con números
    expect(() => editarDatosReserva(baseReserva, { pacienteNombre: 'Juan123' })).toThrow('Nombre de paciente inválido');

    // Email inválido
    expect(() => editarDatosReserva(baseReserva, { pacienteEmail: 'no-valido' })).toThrow('Email de paciente inválido');
  });

  it('Escenario 3 — cancelación de edición (no muta la reserva original)', () => {
    const cambios = { pacienteNombre: 'Nombre Temporal', pacienteEmail: 'temp@example.com' };

    const copia = editarDatosReserva(baseReserva, cambios);

    // La función devuelve una nueva instancia con cambios
    expect(copia.datos.pacienteNombre).toBe('Nombre Temporal');

    // Pero la reserva original no fue mutada (permite cancelar edición conservando datos originales)
    expect(baseReserva.datos.pacienteNombre).toBe('Juan Perez');
    expect(baseReserva.datos.pacienteEmail).toBe('juan@example.com');

    // Editar no confirma automáticamente
    expect(copia.estado).toBe('en_proceso');
  });
});
