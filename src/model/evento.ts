export class Evento {
	private readonly id: string;
	private estado: string;

	constructor(id = '', estado = 'pendiente') {
		this.id = id;
		this.estado = estado;
	}

	obtenerId(): string {
		return this.id;
	}

	obtenerEstado(): string {
		return this.estado;
	}

	marcarComoCompletado(): void {
		this.estado = 'completado';
	}
}