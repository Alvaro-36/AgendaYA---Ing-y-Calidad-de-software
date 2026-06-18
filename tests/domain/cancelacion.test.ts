import { cancelarReservaEnProceso, DatosCancelacion } from "@/domain/services/cancelacion";

describe("cancelarReservaEnProceso", () => {
  it("Escenario 1: Cancela exitosamente y libera el horario si la reserva está 'en_proceso'", () => {
    const datos: DatosCancelacion = {
      reservaId: "res-123",
      estadoActual: "en_proceso"
    };

    const resultado = cancelarReservaEnProceso(datos);

    expect(resultado.exito).toBe(true);
    expect(resultado.mensaje).toBe("Reserva cancelada correctamente");
    expect(resultado.horarioLiberado).toBe(true);
  });

  it("Escenario 2: Falla si no se proporciona un ID de reserva válido", () => {
    const datosInvalidos: DatosCancelacion = {
      reservaId: "",
      estadoActual: "en_proceso"
    };

    expect(() => cancelarReservaEnProceso(datosInvalidos)).toThrow(
      "El ID de la reserva es obligatorio para cancelar"
    );
  });

  it("Escenario 3: Falla si se intenta cancelar una reserva que ya fue confirmada", () => {
    const datosConfirmados: DatosCancelacion = {
      reservaId: "res-456",
      estadoActual: "confirmada"
    };

    expect(() => cancelarReservaEnProceso(datosConfirmados)).toThrow(
      "No se puede cancelar una reserva que ya se encuentra confirmada desde esta pantalla"
    );
  });
});
