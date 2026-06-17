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


describe('MO5 US4 ver detalle evento', () => {
	it('Debe mostrar el detalle del evento', () => {
		const eventoPrueba = new Evento('1', 'pendiente', new Date(), 'Consulta de prueba', '123456789', 'Juan Pérez');
		expect(eventoPrueba.obtenerDetalle()).toEqual({
			id: '1',
			estado: 'pendiente',
			fechaHora: eventoPrueba.obtenerFechaHora(),
			descripcion: 'Consulta de prueba',
			telefono: '123456789',
			nombre: 'Juan Pérez',
		})
	});

});


describe('MO5 US2 Cancelación Reserva', () => {

	it('Debe cambiar el estado de la reserva a cancelada', () => {
		const evento = new Evento('1', 'confirmado', new Date('2025-06-20T10:00:00'), 'Consulta general', '3001234567', 'Ana Torres');

		evento.cancelarEvento();

		expect(evento.obtenerEstado()).toBe('cancelado');

	});

	it('No debe poder cancelarse una reserva que ya fue completada', () => {
		const evento = new Evento('3', 'confirmado', new Date('2025-06-10T10:00:00'), 'Ortodoncia', '3007778899', 'Sofía Vargas');

		evento.marcarComoCompletado();

		expect(() => evento.cancelarEvento()).toThrow('El evento ya esta completado');
	});

});

describe('creacion de evento con valores por defecto y getters', () => {
	it('Debe inicializar con los valores por defecto y permitir obtenerlos', () => {
		const fechaAntes = new Date();
		const evento = new Evento();
		expect(evento.obtenerId()).toBe('');
		expect(evento.obtenerEstado()).toBe('pendiente');
		expect(evento.obtenerFechaHora().getTime()).toBeGreaterThanOrEqual(fechaAntes.getTime());
		expect(evento.obtenerDescripcion()).toBe('');
		expect(evento.obtenerTelefono()).toBe('');
		expect(evento.obtenerNombre()).toBe('');
	});
});