import { DatosReserva } from '@/domain/services/reserva';

export interface Reserva {
  id: string;
  datos: DatosReserva;
  estado: 'en_proceso' | 'confirmada' | 'cancelada';
}

export interface ResumenReserva {
  pacienteNombre: string;
  pacienteEmail: string;
  fecha: string;
  horario: string;
}

function validarNombre(nombre: string) {
  // Nombre sólo letras y espacios
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre);
}

function validarEmail(email: string) {
  // validación simple
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function editarDatosReserva(reserva: Reserva, cambios: Partial<DatosReserva>): Reserva {
  if (!reserva || !reserva.datos) {
    throw new Error('Reserva inválida');
  }

  // No permitir editar si ya está confirmada
  if (reserva.estado === 'confirmada') {
    throw new Error('No se puede editar una reserva ya confirmada');
  }

  const nuevosDatos: DatosReserva = { ...reserva.datos, ...cambios };

  if (nuevosDatos.pacienteNombre && !validarNombre(nuevosDatos.pacienteNombre)) {
    throw new Error('Nombre de paciente inválido');
  }

  if (nuevosDatos.pacienteEmail && !validarEmail(nuevosDatos.pacienteEmail)) {
    throw new Error('Email de paciente inválido');
  }

  // Retornar nueva instancia sin mutar la original
  return {
    ...reserva,
    datos: nuevosDatos
  };
}

export function getResumenReserva(reserva: Reserva): ResumenReserva {
  return {
    pacienteNombre: reserva.datos.pacienteNombre,
    pacienteEmail: reserva.datos.pacienteEmail,
    fecha: reserva.datos.fecha,
    horario: reserva.datos.horario
  };
}

export type { DatosReserva as DatosReserva };
