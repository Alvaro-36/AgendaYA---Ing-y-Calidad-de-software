export class Evento {
	private readonly id: string;
	private estado: string;
	private fechaHora: Date;

	constructor(id = '', estado = 'pendiente', fechaHora: Date) {
		this.id = id;
		this.estado = estado;
		this.fechaHora = fechaHora;
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

	marcarComoCompletado(): void {
		this.estado = 'completado';
	}
	cambiarFecha(fechaHora: Date): void{
		if(this.estado === "completado"){
			throw new Error("El evento ya esta completado");
		}
		this.fechaHora = fechaHora;
	}
}
