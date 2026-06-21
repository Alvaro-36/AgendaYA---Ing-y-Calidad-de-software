import { Evento } from '@/domain/entities/evento';
import { procesarTurnosCalendario } from '@/domain/services/calendarioAdmin';

const HOY = new Date(2026, 5, 17, 10, 0); // 17 de junio de 2026, 10:00 AM

describe('procesarTurnosCalendario', () => {
	it('Escenario 1: turnos pasados con estado distinto a pendiente se procesan correctamente', () => {
		const turnoPasadoCompletado = new Evento(
			'1',
			'completado',
			new Date(2026, 5, 16, 15, 0) // Ayer
		);
		const turnoPasadoCancelado = new Evento(
			'2',
			'cancelado',
			new Date(2026, 5, 15, 10, 0) // Anteayer
		);

		const result = procesarTurnosCalendario([turnoPasadoCompletado, turnoPasadoCancelado], HOY);

		expect(result).toHaveLength(2);
		expect(result).toContain(turnoPasadoCompletado);
		expect(result).toContain(turnoPasadoCancelado);
	});

	it('Escenario 2: turnos futuros en estado pendiente se procesan correctamente', () => {
		const turnoFuturoPendiente = new Evento(
			'3',
			'pendiente',
			new Date(2026, 5, 18, 10, 0) // Mañana
		);

		const result = procesarTurnosCalendario([turnoFuturoPendiente], HOY);

		expect(result).toHaveLength(1);
		expect(result).toContain(turnoFuturoPendiente);
	});

	it('Escenario 3: turno pasado en estado pendiente lanza un error por inconsistencia', () => {
		const turnoPasadoPendiente = new Evento(
			'4',
			'pendiente',
			new Date(2026, 5, 16, 10, 0) // Ayer
		);

		expect(() => {
			procesarTurnosCalendario([turnoPasadoPendiente], HOY);
		}).toThrow('Inconsistencia: Los turnos anteriores a la fecha actual no pueden estar en estado pendiente');
	});
});
