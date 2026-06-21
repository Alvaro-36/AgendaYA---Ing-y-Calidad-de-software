import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarioAdmin from '@/components/CalendarioAdmin';
const HOY = new Date(2026, 5, 17);

describe('CalendarioAdmin - Módulo 05', () => {
  it('M05-US1: al seleccionar un día en el calendario se destaca visualmente y la selección anterior pierde el color', async () => {
    const user = userEvent.setup();
    render(<CalendarioAdmin hoy={HOY} />);

    const calendario = screen.getByRole('region', { name: 'Calendario' });

    const dia17 = within(calendario).getByRole('button', { name: '17' });
    const dia18 = within(calendario).getByRole('button', { name: '18' });

    await user.click(dia18);

    expect(dia18).toHaveAttribute('aria-pressed', 'true');
    expect(dia17).toHaveAttribute('aria-pressed', 'false');
  });

  it('M05-US09: muestra las tarjetas de citas si el día tiene reservas, o un mensaje informativo si no hay', async () => {
    const user = userEvent.setup();
    render(<CalendarioAdmin hoy={HOY} />);

    const calendario = screen.getByRole('region', { name: 'Calendario' });

    const diaConReservas = within(calendario).getByRole('button', { name: '18' });
    await user.click(diaConReservas);

    const listaReservas = screen.getByRole('region', { name: 'Lista de reservas' });
    expect(within(listaReservas).getByText(/Mateo De Luca/i)).toBeInTheDocument();

    const diaSinReservas = within(calendario).getByRole('button', { name: '25' });
    await user.click(diaSinReservas);

    expect(screen.getByText('No hay reservas programadas para este día')).toBeInTheDocument();
  });

  it('M05-US7: el botón Completar se encuentra deshabilitado para reservas cuya fecha aún no ocurre', async () => {
    const user = userEvent.setup();
    render(<CalendarioAdmin hoy={HOY} />);

    const calendario = screen.getByRole('region', { name: 'Calendario' });

    const diaFuturo = within(calendario).getByRole('button', { name: '20' });
    await user.click(diaFuturo);

    const botonCompletar = screen.getByRole('button', { name: /Completar/i });

    expect(botonCompletar).toBeDisabled();
  });

});