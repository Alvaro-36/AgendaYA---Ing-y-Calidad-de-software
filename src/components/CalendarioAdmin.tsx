'use client';

import { useState, useMemo } from 'react';
import { Evento } from '@/domain/entities/evento';
import { aISO, aSoloDia, NOMBRES_MES } from '@/lib/fecha';

interface Props {
	// Inyectables para pruebas deterministas
	hoy?: Date;
	reservas?: string[]; // Lista de fechas ISO para compatibilidad retroactiva
	turnos?: Evento[];   // Turnos completos para mostrar en el panel de reservas
	onSeleccionarDia?: (fecha: Date) => void;
}

const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

export default function CalendarioAdmin({ hoy, reservas = [], turnos = [], onSeleccionarDia }: Props) {
	const fechaHoy = useMemo(() => aSoloDia(hoy ?? new Date()), [hoy]);
	
	// El mes/año visible se inicializa con el mes de fechaHoy
	const [mesVisible, setMesVisible] = useState(() => new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1));
	
	// El día seleccionado por defecto es hoy (representado como ISO string)
	const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(() => aISO(fechaHoy));

	const cambiarMes = (delta: number) => {
		setMesVisible((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
	};

	const cambiarAnio = (delta: number) => {
		setMesVisible((prev) => new Date(prev.getFullYear() + delta, prev.getMonth(), 1));
	};

	// Cálculo de los días del mes visible
	const anioVisible = mesVisible.getFullYear();
	const mesVisibleIndex = mesVisible.getMonth();
	
	const diasDelMes = new Date(anioVisible, mesVisibleIndex + 1, 0).getDate();
	const dias = Array.from({ length: diasDelMes }, (_, i) => i + 1);
	
	// Offset para alinear el día 1 con su columna (lunes = 0, domingo = 6)
	const primerDiaSemana = (new Date(anioVisible, mesVisibleIndex, 1).getDay() + 6) % 7;

	// Días que tienen reservas (derivados de `turnos` si existe, o usando la prop `reservas`)
	const diasConReservas = useMemo(() => {
		if (turnos && turnos.length > 0) {
			return Array.from(new Set(turnos.map((t) => aISO(t.obtenerFechaHora()))));
		}
		return reservas;
	}, [turnos, reservas]);

	// Turnos correspondientes al día seleccionado, ordenados cronológicamente
	const turnosDelDia = useMemo(() => {
		return turnos
			.filter((t) => aISO(t.obtenerFechaHora()) === fechaSeleccionada)
			.sort((a, b) => a.obtenerFechaHora().getTime() - b.obtenerFechaHora().getTime());
	}, [turnos, fechaSeleccionada]);

	const seleccionarDia = (dia: number) => {
		const fecha = new Date(anioVisible, mesVisibleIndex, dia);
		const iso = aISO(fecha);
		setFechaSeleccionada(iso);
		if (onSeleccionarDia) {
			onSeleccionarDia(fecha);
		}
	};

	return (
		<div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full">
			{/* Panel del Calendario */}
			<section
				aria-label="Calendario de Administrador"
				className="flex-1 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm max-w-sm w-full"
			>
				{/* Controles de Navegación de Mes y Año */}
				<div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3">
					<div className="flex gap-1">
						<button
							type="button"
							onClick={() => cambiarAnio(-1)}
							aria-label="Año anterior"
							className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 transition-colors"
						>
							«
						</button>
						<button
							type="button"
							onClick={() => cambiarMes(-1)}
							aria-label="Mes anterior"
							className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 transition-colors"
						>
							‹
						</button>
					</div>
					
					<span className="font-semibold capitalize text-zinc-800 text-sm md:text-base">
						{NOMBRES_MES[mesVisibleIndex]} {anioVisible}
					</span>
					
					<div className="flex gap-1">
						<button
							type="button"
							onClick={() => cambiarMes(1)}
							aria-label="Mes siguiente"
							className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 transition-colors"
						>
							›
						</button>
						<button
							type="button"
							onClick={() => cambiarAnio(1)}
							aria-label="Año siguiente"
							className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 transition-colors"
						>
							»
						</button>
					</div>
				</div>

				{/* Grid de días de la semana y días del mes */}
				<div className="grid grid-cols-7 gap-1 text-center">
					{DIAS_SEMANA.map((d) => (
						<span key={d} className="flex h-8 items-center justify-center text-xs font-semibold text-zinc-400">
							{d}
						</span>
					))}
					
					{/* Espacios vacíos antes del primer día del mes */}
					{Array.from({ length: primerDiaSemana }, (_, i) => (
						<span key={`vacio-${i}`} aria-hidden="true" />
					))}
					
					{/* Días del mes */}
					{dias.map((dia) => {
						const fecha = new Date(anioVisible, mesVisibleIndex, dia);
						const iso = aISO(fecha);
						
						const esSeleccionado = iso === fechaSeleccionada;
						const tieneReserva = diasConReservas.includes(iso);
						
						// Clases de estilo para el día
						let classes = "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all relative ";
						
						if (esSeleccionado) {
							// Círculo verde para el día seleccionado
							classes += "bg-green-500 text-white shadow-sm hover:bg-green-600";
						} else if (tieneReserva) {
							// Círculo gris para días con reservas
							classes += "bg-zinc-200 text-zinc-800 hover:bg-zinc-300";
						} else {
							// Día sin destacar
							classes += "text-zinc-700 hover:bg-zinc-100";
						}

						return (
							<button
								key={dia}
								type="button"
								onClick={() => seleccionarDia(dia)}
								aria-pressed={esSeleccionado}
								aria-label={tieneReserva ? `${dia}, con reservas` : `${dia}`}
								className={classes}
							>
								{dia}
							</button>
						);
					})}
				</div>

				{/* Referencias visuales */}
				<div className="flex gap-4 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
					<span className="flex items-center gap-1.5">
						<span className="inline-block h-3 w-3 rounded-full bg-zinc-200" aria-hidden="true" /> Con reservas
					</span>
					<span className="flex items-center gap-1.5">
						<span className="inline-block h-3 w-3 rounded-full bg-green-500" aria-hidden="true" /> Seleccionado
					</span>
				</div>
			</section>

			{/* Panel de Reservas del día */}
			<section
				aria-label="Reservas del día"
				className="flex-1 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm min-w-[320px] max-w-sm w-full"
			>
				<h2 className="text-lg font-semibold text-zinc-800 border-b border-zinc-100 pb-2">
					Reservas del día
				</h2>
				
				{turnosDelDia.length > 0 ? (
					<div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-1">
						{turnosDelDia.map((turno) => {
							const hora = String(turno.obtenerFechaHora().getHours()).padStart(2, '0') + ':' + 
							             String(turno.obtenerFechaHora().getMinutes()).padStart(2, '0');
							return (
								<div
									key={turno.obtenerId()}
									className="rounded-lg border border-zinc-150 p-4 shadow-sm hover:shadow transition-all bg-zinc-50 flex flex-col gap-1.5"
								>
									<div className="flex justify-between items-center">
										<span className="font-semibold text-zinc-900 text-sm md:text-base">
											{turno.obtenerNombre()}
										</span>
										<span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
											{hora} hs
										</span>
									</div>
									<div className="text-xs md:text-sm text-zinc-600 flex flex-col gap-0.5">
										<p><span className="font-medium text-zinc-500">Teléfono:</span> {turno.obtenerTelefono() || 'No provisto'}</p>
										<p><span className="font-medium text-zinc-550">Consulta:</span> {turno.obtenerDescripcion() || 'Sin descripción'}</p>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-zinc-200 rounded-lg bg-zinc-50 flex-1">
						<span className="text-2xl mb-2" role="img" aria-label="Sin turnos">📅</span>
						<p className="text-sm font-medium text-zinc-500">
							No hay reservas programadas para este día
						</p>
					</div>
				)}
			</section>
		</div>
	);
}
