export interface DatosReserva {
  profesional: string;
  especialidad: string;
  tipoConsulta: string;
  duracion: number;
  fecha: string; // Formato YYYY-MM-DD
  horario: string; // Formato HH:mm
  descripcion: string;
  modalidad: "presencial" | "virtual";
  pacienteNombre: string;
  pacienteEmail: string;
}

export interface ResultadoConfirmacion {
  exito: boolean;
  mensaje: string;
  turnoId?: string;
}

export function confirmarReserva(datos: DatosReserva): ResultadoConfirmacion {
  // Validación de datos requeridos mínimos
  if (!datos.pacienteEmail || !datos.pacienteNombre || !datos.profesional) {
    throw new Error("Faltan datos obligatorios del paciente o profesional");
  }

  // Validación de fecha en el pasado
  const fechaTurno = new Date(`${datos.fecha}T${datos.horario}`);
  const ahora = new Date();
  if (fechaTurno < ahora) {
    throw new Error("No se puede reservar en una fecha u hora pasada");
  }

  // Lógica mínima de éxito (GREEN)
  return {
    exito: true,
    mensaje: "Turno registrado exitosamente",
    turnoId: Math.random().toString(36).substring(7)
  };
}
