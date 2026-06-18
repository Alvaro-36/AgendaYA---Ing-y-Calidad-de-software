export class Evento {
	private readonly id: string;
	private estado: string;
	private fechaHora: Date;
	private descripcion: string;
	private telefono: string;
	private nombre: string;

	constructor(
		id = '',
		estado = 'pendiente',
		fechaHora = new Date(),
		descripcion = '',
		telefono = '',
		nombre = ''
	) {
		this.id = id;
		this.estado = estado;
		this.fechaHora = fechaHora;
		this.descripcion = descripcion;
		this.telefono = telefono;
		this.nombre = nombre;
	}

	obtenerId(): string {
		return this.id;
	}

	obtenerEstado(): string {
		return this.estado;
	}

	obtenerFechaHora(): Date {
		return this.fechaHora;
	}

	obtenerDescripcion(): string {
		return this.descripcion;
	}

	obtenerTelefono(): string {
		return this.telefono;
	}

	obtenerNombre(): string {
		return this.nombre;
	}

	marcarComoCompletado(): void {
		this.estado = 'completado';
	}

	cambiarFecha(fechaHora: Date): void {
		if (this.estado === 'completado') {
			throw new Error('El evento ya esta completado');
		}
		this.fechaHora = fechaHora;
	}

	cancelarEvento(): void {
		if (this.estado === 'completado') {
			throw new Error('El evento ya esta completado');
		}
		this.estado = 'cancelado';
	}

	completarAutomaticamente(fechaActual: Date, duracionMinutos: number): void {
		if (this.estado !== 'confirmado') {
			return;
		}

		const finDelEventoMs = this.fechaHora.getTime() + duracionMinutos * 60000;
		const limite24HsMs = finDelEventoMs + 24 * 60 * 60000;

		if (fechaActual.getTime() >= limite24HsMs) {
			this.marcarComoCompletado();
		}
	}


	obtenerDetalle(): {
		id: string;
		estado: string;
		fechaHora: Date;
		descripcion: string;
		telefono: string;
		nombre: string;
	} {
		return {
			id: this.id,
			estado: this.estado,
			fechaHora: this.fechaHora,
			descripcion: this.descripcion,
			telefono: this.telefono,
			nombre: this.nombre,
		};
	}
}
