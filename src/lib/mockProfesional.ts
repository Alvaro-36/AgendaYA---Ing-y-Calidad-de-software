import type { Profesional } from '@/domain/entities/tipoEvento';
import { aISO, sumarDias } from '@/lib/fecha';

// Crea un profesional de ejemplo con disponibilidad relativa a "hoy",
// de forma que siempre existan dias futuros con horarios para reservar.
export function crearProfesionalMock(hoy: Date): Profesional {
	const f = (dias: number) => aISO(sumarDias(hoy, dias));

	return {
		id: 'prof-1',
		nombre: 'Dra. Ana Pérez',
		tiposDeEvento: [
			{
				id: 'consulta-inicial',
				nombre: 'Consulta inicial',
				descripcion: 'Primera visita para conocer tu caso.',
				duracionMinutos: 30,
				disponible: true,
				disponibilidad: {
					[f(1)]: ['09:00', '10:00', '11:00'],
					[f(3)]: ['14:00', '15:00'],
					[f(8)]: ['16:00'],
				},
			},
			{
				id: 'seguimiento',
				nombre: 'Seguimiento',
				descripcion: 'Control de evolución del tratamiento.',
				duracionMinutos: 45,
				disponible: true,
				disponibilidad: {
					[f(2)]: ['12:00', '13:00'],
					[f(5)]: ['17:00', '18:00'],
				},
			},
			{
				id: 'evento-no-disponible',
				nombre: 'Taller grupal',
				descripcion: 'No disponible por ahora.',
				duracionMinutos: 60,
				disponible: false,
				disponibilidad: {},
			},
		],
	};
}
