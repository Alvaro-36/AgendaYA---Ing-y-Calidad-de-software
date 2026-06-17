import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SeleccionEvento from '@/components/SeleccionEvento';

// Fecha fija para que los tests sean deterministas. El mock genera
// disponibilidad relativa a "hoy": +1 dia (18), +3 dias (20), +8 dias (25).
const HOY = new Date(2026, 5, 17); // 17 de junio de 2026

describe('SeleccionEvento', () => {
	it('Escenario 4: al seleccionar un dia disponible se muestran SUS horarios', async () => {
		const user = userEvent.setup();
		render(<SeleccionEvento hoy={HOY} />);

		// Selecciono un evento disponible y un dia con disponibilidad (18).
		await user.click(screen.getByRole('button', { name: /Consulta inicial/ }));
		const calendario = screen.getByRole('region', { name: 'Calendario' });
		await user.click(within(calendario).getByRole('button', { name: '18' }));

		// Se muestran exactamente los horarios de ese dia.
		const horarios = screen.getByRole('region', { name: 'Horarios disponibles' });
		expect(within(horarios).getByRole('button', { name: '09:00' })).toBeInTheDocument();
		expect(within(horarios).getByRole('button', { name: '10:00' })).toBeInTheDocument();
		expect(within(horarios).getByRole('button', { name: '11:00' })).toBeInTheDocument();
		// No aparece un horario de otro dia (14:00 corresponde al dia 20).
		expect(within(horarios).queryByRole('button', { name: '14:00' })).not.toBeInTheDocument();
	});

	it('Escenario 2: el calendario NO se ve hasta seleccionar un evento disponible', async () => {
		const user = userEvent.setup();
		render(<SeleccionEvento hoy={HOY} />);

		// Antes de seleccionar, no hay calendario.
		expect(screen.queryByRole('region', { name: 'Calendario' })).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /Consulta inicial/ }));

		// Despues aparece el calendario con un dia disponible.
		const calendario = screen.getByRole('region', { name: 'Calendario' });
		expect(calendario).toBeInTheDocument();
		expect(within(calendario).getByRole('button', { name: '18' })).toBeEnabled();
	});

	it('Escenario 4: al seleccionar un horario disponible queda marcado visualmente', async () => {
		const user = userEvent.setup();
		render(<SeleccionEvento hoy={HOY} />);

		await user.click(screen.getByRole('button', { name: /Consulta inicial/ }));
		const calendario = screen.getByRole('region', { name: 'Calendario' });
		await user.click(within(calendario).getByRole('button', { name: '18' }));

		const horarios = screen.getByRole('region', { name: 'Horarios disponibles' });
		const horario = within(horarios).getByRole('button', { name: '09:00' });
		expect(horario).toHaveAttribute('aria-pressed', 'false');

		await user.click(horario);
		expect(horario).toHaveAttribute('aria-pressed', 'true');
	});
});
