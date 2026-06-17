// Horario disponible expresado como "HH:mm" (ej: "09:00").
export type Horario = string;

// Fecha en formato ISO de solo dia "YYYY-MM-DD" (ej: "2026-06-18").
export type FechaISO = string;

export interface TipoEvento {
	id: string;
	nombre: string;
	descripcion: string;
	duracionMinutos: number;
	disponible: boolean;
	// Disponibilidad del evento: fecha -> horarios disponibles ese dia.
	disponibilidad: Record<FechaISO, Horario[]>;
}

export interface Profesional {
	id: string;
	nombre: string;
	tiposDeEvento: TipoEvento[];
}
