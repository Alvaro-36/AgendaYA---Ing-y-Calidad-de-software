import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarioAdmin from '@/components/CalendarioAdmin';
import { Evento } from '@/domain/entities/evento';

// Fecha fija para que los tests sean deterministas.
const HOY = new Date(2026, 5, 17); // 17 de junio de 2026

describe('CalendarioAdmin - Criterios del Calendario', () => {
	it('Escenario 1: Carga inicial muestra mes/año actual, día de hoy seleccionado por defecto (círculo verde) y días con reservas en gris', () => {
		const reservas = ['2026-06-15', '2026-06-20'];
		render(<CalendarioAdmin hoy={HOY} reservas={reservas} />);

		// El calendario muestra el mes y año en curso
		const calendario = screen.getByRole('region', { name: 'Calendario de Administrador' });
		expect(within(calendario).getByText(/junio 2026/i)).toBeInTheDocument();

		// El día actual (17) está seleccionado por defecto (círculo verde, aria-pressed true)
		const diaHoy = within(calendario).getByRole('button', { name: '17' });
		expect(diaHoy).toHaveAttribute('aria-pressed', 'true');
		expect(diaHoy).toHaveClass('bg-green-500');

		// Se ven indicadores grises en días con reservas (15 y 20)
		const dia15 = within(calendario).getByRole('button', { name: /15/ });
		const dia20 = within(calendario).getByRole('button', { name: /20/ });
		expect(dia15).toHaveClass('bg-zinc-200');
		expect(dia20).toHaveClass('bg-zinc-200');

		// Un día sin reservas ni selección no debe tener estas clases de resaltado
		const dia16 = within(calendario).getByRole('button', { name: '16' });
		expect(dia16).not.toHaveClass('bg-green-500');
		expect(dia16).not.toHaveClass('bg-zinc-200');
	});

	it('Escenario 2: Navegación cambia de mes al instante y actualiza círculos de ocupación del nuevo mes', async () => {
		const user = userEvent.setup();
		const reservas = ['2026-06-20', '2026-07-05'];
		render(<CalendarioAdmin hoy={HOY} reservas={reservas} />);

		const calendario = screen.getByRole('region', { name: 'Calendario de Administrador' });
		expect(within(calendario).getByText(/junio 2026/i)).toBeInTheDocument();

		// En junio, el día 20 tiene reserva (círculo gris)
		const dia20Junio = within(calendario).getByRole('button', { name: /20/ });
		expect(dia20Junio).toHaveClass('bg-zinc-200');

		// Hacemos clic en el botón de mes siguiente
		const botonSiguiente = within(calendario).getByRole('button', { name: 'Mes siguiente' });
		await user.click(botonSiguiente);

		// El calendario cambia a julio de 2026 al instante
		expect(within(calendario).getByText(/julio 2026/i)).toBeInTheDocument();

		// En julio, el día 5 tiene reserva (círculo gris)
		const dia5Julio = within(calendario).getByRole('button', { name: '5, con reservas' });
		expect(dia5Julio).toHaveClass('bg-zinc-200');
	});

	it('Escenario 3: Selección de día resalta en verde el nuevo día y quita el resalto al anterior', async () => {
		const user = userEvent.setup();
		render(<CalendarioAdmin hoy={HOY} />);

		const calendario = screen.getByRole('region', { name: 'Calendario de Administrador' });
		const diaHoy = within(calendario).getByRole('button', { name: '17' });
		const dia13 = within(calendario).getByRole('button', { name: '13' });

		// Al inicio, 17 seleccionado (verde) y 13 no seleccionado
		expect(diaHoy).toHaveAttribute('aria-pressed', 'true');
		expect(diaHoy).toHaveClass('bg-green-500');
		expect(dia13).toHaveAttribute('aria-pressed', 'false');
		expect(dia13).not.toHaveClass('bg-green-500');

		// Hacemos clic sobre el día 13
		await user.click(dia13);

		// El día 13 se resalta en verde (aria-pressed true)
		expect(dia13).toHaveAttribute('aria-pressed', 'true');
		expect(dia13).toHaveClass('bg-green-500');

		// El día seleccionado previamente (17) pierde el color verde y aria-pressed es false
		expect(diaHoy).toHaveAttribute('aria-pressed', 'false');
		expect(diaHoy).not.toHaveClass('bg-green-500');
	});
});

describe('CalendarioAdmin - Criterios del Panel de Reservas', () => {
	it('Escenario 1 (Panel de citas): Día con reservas muestra las tarjetas de los pacientes ordenadas cronológicamente con nombre, teléfono, hora y etiqueta', () => {
		// Creamos citas para el 17 de junio de 2026, desordenadas
		const t1 = new Evento('101', 'confirmado', new Date(2026, 5, 17, 11, 30), 'Consulta General', '11223344', 'Carlos Gomez');
		const t2 = new Evento('102', 'confirmado', new Date(2026, 5, 17, 10, 0), 'Tratamiento de Conducta', '55667788', 'Ana Lopez');
		const t3 = new Evento('103', 'confirmado', new Date(2026, 5, 17, 13, 0), 'Limpieza Dental', '99001122', 'Beatriz Ruiz');

		render(<CalendarioAdmin hoy={HOY} turnos={[t1, t2, t3]} />);

		const panel = screen.getByRole('region', { name: 'Reservas del día' });

		// Verificamos que la información detallada esté en el panel
		expect(within(panel).getByText('Carlos Gomez')).toBeInTheDocument();
		expect(within(panel).getByText('11:30 hs')).toBeInTheDocument();
		expect(within(panel).getByText(/Consulta General/)).toBeInTheDocument();
		expect(within(panel).getByText(/11223344/)).toBeInTheDocument();

		expect(within(panel).getByText('Ana Lopez')).toBeInTheDocument();
		expect(within(panel).getByText('10:00 hs')).toBeInTheDocument();
		expect(within(panel).getByText(/Tratamiento de Conducta/)).toBeInTheDocument();
		expect(within(panel).getByText(/55667788/)).toBeInTheDocument();

		expect(within(panel).getByText('Beatriz Ruiz')).toBeInTheDocument();
		expect(within(panel).getByText('13:00 hs')).toBeInTheDocument();
		expect(within(panel).getByText(/Limpieza Dental/)).toBeInTheDocument();
		expect(within(panel).getByText(/99001122/)).toBeInTheDocument();

		// Verificamos orden cronológico en el renderizado
		const nombresTarjetas = within(panel).getAllByText(/Carlos Gomez|Ana Lopez|Beatriz Ruiz/);
		expect(nombresTarjetas).toHaveLength(3);
		expect(nombresTarjetas[0]).toHaveTextContent('Ana Lopez');     // 10:00 hs
		expect(nombresTarjetas[1]).toHaveTextContent('Carlos Gomez');  // 11:30 hs
		expect(nombresTarjetas[2]).toHaveTextContent('Beatriz Ruiz');   // 13:00 hs
	});

	it('Escenario 2 (Panel de citas): Día sin reservas muestra la ilustración/texto descriptivo y ninguna tarjeta vacía', async () => {
		// Pasamos turnos para el 17 de junio, pero ningún turno para otros días
		const t1 = new Evento('101', 'confirmado', new Date(2026, 5, 17, 11, 30), 'Consulta General', '11223344', 'Carlos Gomez');

		// Renderizamos, y el día seleccionado por defecto será HOY (17)
		render(<CalendarioAdmin hoy={HOY} turnos={[t1]} />);

		// Inicialmente, en el día 17 vemos la cita de Carlos
		const panel = screen.getByRole('region', { name: 'Reservas del día' });
		expect(within(panel).getByText('Carlos Gomez')).toBeInTheDocument();

		// Ahora cambiamos la fecha seleccionada pasando un hoy que no coincide (o forzando re-render o clickeando)
		// Simulemos la selección del día 18 (que no tiene reservas) haciendo clic en él
		const calendario = screen.getByRole('region', { name: 'Calendario de Administrador' });
		const dia18 = within(calendario).getByRole('button', { name: '18' });

		// Hacemos clic en el día 18
		const user = userEvent.setup();
		await user.click(dia18);

		// Verificamos que se muestre el texto de que no hay reservas
		expect(screen.getByText('No hay reservas programadas para este día')).toBeInTheDocument();

		// Verificamos que no haya datos de paciente en el panel
		expect(within(panel).queryByText('Carlos Gomez')).not.toBeInTheDocument();
		expect(within(panel).queryByText('Teléfono:')).not.toBeInTheDocument();
		expect(within(panel).queryByText('Consulta:')).not.toBeInTheDocument();
	});

	it('Escenario 3 (Panel de citas): Cambio rápido de día actualiza el panel lateral instantáneamente', async () => {
		const user = userEvent.setup();
		const t1 = new Evento('101', 'confirmado', new Date(2026, 5, 17, 11, 30), 'Consulta General', '11223344', 'Carlos Gomez');
		const t2 = new Evento('102', 'confirmado', new Date(2026, 5, 19, 15, 0), 'Tratamiento Quirúrgico', '55667788', 'Lucas Martinez');

		render(<CalendarioAdmin hoy={HOY} turnos={[t1, t2]} />);

		const calendario = screen.getByRole('region', { name: 'Calendario de Administrador' });
		const panel = screen.getByRole('region', { name: 'Reservas del día' });

		// Día 17 (Carga inicial) -> Muestra a Carlos Gomez
		expect(within(panel).getByText('Carlos Gomez')).toBeInTheDocument();
		expect(within(panel).queryByText('Lucas Martinez')).not.toBeInTheDocument();

		// Click rápido a día 18 (Sin reservas) -> Muestra placeholder
		const dia18 = within(calendario).getByRole('button', { name: '18' });
		await user.click(dia18);
		expect(within(panel).getByText('No hay reservas programadas para este día')).toBeInTheDocument();
		expect(within(panel).queryByText('Carlos Gomez')).not.toBeInTheDocument();

		// Click rápido a día 19 (Con reservas) -> Muestra a Lucas Martinez
		const dia19 = within(calendario).getByRole('button', { name: /19/ });
		await user.click(dia19);
		expect(within(panel).getByText('Lucas Martinez')).toBeInTheDocument();
		expect(within(panel).queryByText('Carlos Gomez')).not.toBeInTheDocument();

		// Regresar rápido a día 17 -> Vuelve a mostrar a Carlos Gomez
		const dia17 = within(calendario).getByRole('button', { name: /17/ });
		await user.click(dia17);
		expect(within(panel).getByText('Carlos Gomez')).toBeInTheDocument();
		expect(within(panel).queryByText('Lucas Martinez')).not.toBeInTheDocument();
	});
});
