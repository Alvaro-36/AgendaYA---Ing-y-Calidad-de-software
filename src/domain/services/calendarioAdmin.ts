import { Evento } from '@/domain/entities/evento';

/**
 * Procesa la lista de turnos para la vista del calendario del administrador.
 * Aplica las reglas de negocio de la HU M05-RF02:
 * - Que no aparezcan nuevos turnos anteriores a la fecha actual (turnos pasados en estado inconsistente).
 * - Que todos los turnos anteriores a la fecha actual tengan un estado diferente a “pendiente”.
 * 
 * @param turnos - Lista de eventos/turnos existentes obtenidos de la base de datos.
 * @param fechaActual - Fecha actual inyectada para garantizar el determinismo en los tests.
 * @returns Lista de eventos procesados y validados para mostrarse en el calendario.
 * @throws {Error} Si existe un turno pasado con estado 'pendiente'.
 */
export function procesarTurnosCalendario(turnos: Evento[], fechaActual: Date): Evento[] {
	return turnos.filter(turno => {
		const esPasado = turno.obtenerFechaHora() < fechaActual;
		
		if (esPasado && turno.obtenerEstado() === 'pendiente') {
			throw new Error('Inconsistencia: Los turnos anteriores a la fecha actual no pueden estar en estado pendiente');
		}

		return true;
	});
}
