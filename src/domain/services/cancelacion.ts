export interface DatosCancelacion {
  reservaId: string;
  estadoActual: "en_proceso" | "confirmada" | "cancelada";
}

export interface ResultadoCancelacion {
  exito: boolean;
  mensaje: string;
  horarioLiberado: boolean;
}

export function cancelarReservaEnProceso(datos: DatosCancelacion): ResultadoCancelacion {
  if (!datos.reservaId || datos.reservaId.trim() === "") {
    throw new Error("El ID de la reserva es obligatorio para cancelar");
  }

  if (datos.estadoActual === "confirmada") {
    throw new Error("No se puede cancelar una reserva que ya se encuentra confirmada desde esta pantalla");
  }

  return {
    exito: true,
    mensaje: "Reserva cancelada correctamente",
    horarioLiberado: true
  };
}
