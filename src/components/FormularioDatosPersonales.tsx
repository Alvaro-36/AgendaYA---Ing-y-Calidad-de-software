'use client';

import { useState } from 'react';

export interface DatosPersonales {
	nombre: string;
	email: string;
	telefono?: string;
}

export interface FormularioDatosPersonalesProps {
	onSubmit: (datos: DatosPersonales) => void;
}

export default function FormularioDatosPersonales({ onSubmit }: FormularioDatosPersonalesProps) {
	const [nombre, setNombre] = useState('');
	const [email, setEmail] = useState('');
	const [telefono, setTelefono] = useState('');

	const [errores, setErrores] = useState<{ nombre?: string; email?: string }>({});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const nuevosErrores: { nombre?: string; email?: string } = {};

		if (!nombre.trim()) {
			nuevosErrores.nombre = 'Campo obligatorio';
		} else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(nombre)) {
			nuevosErrores.nombre = 'Usa el formato solicitado: Solo se permiten letras y espacios';
		}

		if (!email.trim()) {
			nuevosErrores.email = 'Campo obligatorio';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			nuevosErrores.email = 'Introduce una dirección de correo electrónico válida';
		}

		if (Object.keys(nuevosErrores).length > 0) {
			setErrores(nuevosErrores);
			return;
		}

		setErrores({});
		onSubmit({ nombre, email, telefono: telefono.trim() });
	};

	return (
		<form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 p-4 border rounded-xl bg-white max-w-sm">
			<div className="flex flex-col gap-1">
				<label htmlFor="nombre" className="text-sm font-medium text-zinc-700">Nombre completo *</label>
				<input
					id="nombre"
					type="text"
					value={nombre}
					onChange={(e) => setNombre(e.target.value)}
					aria-invalid={!!errores.nombre}
					className="border border-zinc-300 rounded-md p-2 text-zinc-900"
				/>
				{errores.nombre && <p role="alert" className="text-xs text-red-600">{errores.nombre}</p>}
			</div>

			<div className="flex flex-col gap-1">
				<label htmlFor="email" className="text-sm font-medium text-zinc-700">Correo electrónico *</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					aria-invalid={!!errores.email}
					className="border border-zinc-300 rounded-md p-2 text-zinc-900"
				/>
				{errores.email && <p role="alert" className="text-xs text-red-600">{errores.email}</p>}
			</div>

			<div className="flex flex-col gap-1">
				<label htmlFor="telefono" className="text-sm font-medium text-zinc-700">Teléfono (opcional)</label>
				<input
					id="telefono"
					type="tel"
					value={telefono}
					onChange={(e) => setTelefono(e.target.value)}
					className="border border-zinc-300 rounded-md p-2 text-zinc-900"
				/>
			</div>

			<button 
				type="submit"
				className="mt-2 rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700"
			>
				Continuar
			</button>
		</form>
	);
}
