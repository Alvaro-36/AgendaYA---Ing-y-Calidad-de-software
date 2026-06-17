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

	obtenerDetalle(): string {
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

	obtenerDetelle(evento: Evento): {
		id: string;
		estado: string;
		fechaHora: Date;
		descripcion: string;
		telefono: string;
		nombre: string;
	} {
		return {
			id: evento.id,
			estado: evento.estado,
			fechaHora: evento.fechaHora,
			descripcion: evento.descripcion,
			telefono: evento.telefono,
			nombre: evento.nombre,
		};
	}
}
