import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioDatosPersonales from '@/components/FormularioDatosPersonales';

describe('FormularioDatosPersonales', () => {
	it('Escenario 1 y 4: Ingreso correcto con telefono vacio permite continuar', async () => {
		const user = userEvent.setup();
		const handleSubmit = jest.fn();
		render(<FormularioDatosPersonales onSubmit={handleSubmit} />);

		await user.type(screen.getByLabelText(/Nombre completo/i), 'Juan Perez');
		await user.type(screen.getByLabelText(/Correo electrónico/i), 'juan@example.com');
		
		await user.click(screen.getByRole('button', { name: /Continuar/i }));

		expect(handleSubmit).toHaveBeenCalledWith({
			nombre: 'Juan Perez',
			email: 'juan@example.com',
			telefono: ''
		});
	});

	it('Escenario 2: Validacion del nombre muestra error al contener caracteres invalidos', async () => {
		const user = userEvent.setup();
		const handleSubmit = jest.fn();
		render(<FormularioDatosPersonales onSubmit={handleSubmit} />);

		await user.type(screen.getByLabelText(/Nombre completo/i), 'Juan123');
		await user.click(screen.getByRole('button', { name: /Continuar/i }));

		expect(screen.getByText('Usa el formato solicitado: Solo se permiten letras y espacios')).toBeInTheDocument();
		expect(handleSubmit).not.toHaveBeenCalled();
	});

	it('Escenario 3: Validacion del correo electronico muestra error con formato invalido', async () => {
		const user = userEvent.setup();
		const handleSubmit = jest.fn();
		render(<FormularioDatosPersonales onSubmit={handleSubmit} />);

		// Llenamos el nombre correctamente para aislar el error de email
		await user.type(screen.getByLabelText(/Nombre completo/i), 'Juan Perez');
		await user.type(screen.getByLabelText(/Correo electrónico/i), 'juan.com');
		await user.click(screen.getByRole('button', { name: /Continuar/i }));

		expect(screen.getByText('Introduce una dirección de correo electrónico válida')).toBeInTheDocument();
		expect(handleSubmit).not.toHaveBeenCalled();
	});

	it('Escenario 5: Campos obligatorios incompletos impiden avanzar y muestran error', async () => {
		const user = userEvent.setup();
		const handleSubmit = jest.fn();
		render(<FormularioDatosPersonales onSubmit={handleSubmit} />);

		await user.click(screen.getByRole('button', { name: /Continuar/i }));

		expect(screen.getAllByText('Campo obligatorio').length).toBe(2);
		expect(handleSubmit).not.toHaveBeenCalled();
	});
});