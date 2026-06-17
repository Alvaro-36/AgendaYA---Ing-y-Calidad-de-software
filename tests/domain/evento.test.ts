import { Evento } from '@/domain/entities/evento';

describe('completar evento', () => {
	it('El evento deberia pasar a estado completado', () => {
		const evento = new Evento('1', 'pendiente', new Date(), 'Consulta de prueba', '123456789', 'Juan Pérez');
		evento.marcarComoCompletado();
		expect(evento.obtenerEstado()).toBe('completado');
	});
});

describe('reagendar evento', () => {
	it('Se debe poder reagendar el evento', () => {
		const evento = new Evento('1', 'pendiente', new Date(), 'Seguimiento odontológico', '987654321', 'María López');
		const fecha = new Date();
		evento.cambiarFecha(fecha);
		expect(evento.obtenerFechaHora()).toBe(fecha);
	});
	it('No se debe poder reagendar el evento si esta completado', () => {
		const evento = new Evento('1', 'pendiente', new Date(), 'Tratamiento conductual', '555-1234', 'Carlos Gómez');
		evento.marcarComoCompletado();
		expect(() => evento.cambiarFecha(new Date())).toThrow('El evento ya esta completado');
	});
});