import { confirmarReserva, DatosReserva } from "@/domain/services/reserva";

describe("confirmarReserva", () => {
  const reservaBase: DatosReserva = {
    profesional: "Dr. Juan Pérez",
    especialidad: "Cardiología",
    tipoConsulta: "Primera vez",
    duracion: 30,
    fecha: "2099-12-01",
    horario: "10:00",
    descripcion: "Chequeo general",
    modalidad: "presencial",
    pacienteNombre: "María López",
    pacienteEmail: "maria@example.com"
  };

  it("Escenario 1: Confirma exitosamente y muestra mensaje cuando los datos son correctos", () => {
    const resultado = confirmarReserva(reservaBase);

    expect(resultado.exito).toBe(true);
    expect(resultado.mensaje).toBe("Turno registrado exitosamente");
    expect(resultado.turnoId).toBeDefined();
  });

  it("Escenario 2: Falla si faltan datos obligatorios (ej. email del paciente)", () => {
    const reservaIncompleta = { ...reservaBase, pacienteEmail: "" };

    expect(() => confirmarReserva(reservaIncompleta)).toThrow(
      "Faltan datos obligatorios del paciente o profesional"
    );
  });

  it("Escenario 3: Falla si se intenta confirmar un turno en una fecha/hora pasada", () => {
    const reservaPasada = { ...reservaBase, fecha: "2000-01-01" };

    expect(() => confirmarReserva(reservaPasada)).toThrow(
      "No se puede reservar en una fecha u hora pasada"
    );
  });
});
