import type { FechaISO } from '@/domain/entities/tipoEvento';

// Convierte una fecha a "YYYY-MM-DD" usando la fecha local (sin desfase por zona horaria).
export function aISO(fecha: Date): FechaISO {
	const anio = fecha.getFullYear();
	const mes = String(fecha.getMonth() + 1).padStart(2, '0');
	const dia = String(fecha.getDate()).padStart(2, '0');
	return `${anio}-${mes}-${dia}`;
}

// Devuelve una nueva fecha sumando dias.
export function sumarDias(fecha: Date, dias: number): Date {
	const resultado = new Date(fecha);
	resultado.setDate(resultado.getDate() + dias);
	return resultado;
}

// Normaliza una fecha a medianoche para comparar solo por dia.
export function aSoloDia(fecha: Date): Date {
	return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

export const NOMBRES_MES = [
	'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
	'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
