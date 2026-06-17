import { Evento } from '@/domain/entities/evento';

describe('evento', () => {
	it('El evento deberia pasar a estado completado', () => {
		const evento = new Evento();
		evento.marcarComoCompletado();
		expect(evento.obtenerEstado()).toBe('completado');
	});
});
