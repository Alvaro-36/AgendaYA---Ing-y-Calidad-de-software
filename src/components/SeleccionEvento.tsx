'use client';

import { useMemo, useState } from 'react';
import type { Profesional, TipoEvento } from '@/domain/entities/tipoEvento';
import { crearProfesionalMock } from '@/lib/mockProfesional';
import { aISO, aSoloDia, NOMBRES_MES } from '@/lib/fecha';

interface Props {
	// Inyectables para tests deterministas; en producción usan valores reales.
	profesional?: Profesional;
	hoy?: Date;
}

const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

export default function SeleccionEvento({ profesional, hoy }: Props) {
	const fechaHoy = useMemo(() => aSoloDia(hoy ?? new Date()), [hoy]);
	const prof = useMemo(() => profesional ?? crearProfesionalMock(fechaHoy), [profesional, fechaHoy]);

	const eventosDisponibles = prof.tiposDeEvento.filter((e) => e.disponible);

	const [eventoId, setEventoId] = useState<string | null>(null);
	const [mesVisible, setMesVisible] = useState(() => new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1));
	const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
	const [horario, setHorario] = useState<string | null>(null);

	const eventoSeleccionado: TipoEvento | undefined = eventosDisponibles.find((e) => e.id === eventoId);

	function seleccionarEvento(id: string) {
		setEventoId(id);
		setFechaSeleccionada(null);
		setHorario(null);
		setMesVisible(new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1));
	}

	function cambiarMes(delta: number) {
		setMesVisible((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
	}

	// Dias del mes visible.
	const diasDelMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0).getDate();
	const dias = Array.from({ length: diasDelMes }, (_, i) => i + 1);
	// Offset para alinear el dia 1 con su columna (lunes = 0).
	const primerDiaSemana = (new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1).getDay() + 6) % 7;

	const horariosDelDia = eventoSeleccionado && fechaSeleccionada
		? eventoSeleccionado.disponibilidad[fechaSeleccionada] ?? []
		: [];

	return (
		<div className="mx-auto max-w-5xl px-4 py-10">
			<div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200">
				{/* Encabezado */}
				<header className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6 text-white">
					<p className="text-sm font-medium text-indigo-100">Reservá tu turno</p>
					<h1 className="text-2xl font-semibold">{prof.nombre}</h1>
				</header>

				<div className="flex flex-col gap-8 p-8 md:flex-row md:items-start">
					{/* Escenario 1 y 2: lista de tipos de evento disponibles */}
					<section aria-label="Tipos de evento" className="flex flex-col gap-3 md:w-64">
						<h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Tipo de evento</h2>
						{eventosDisponibles.map((evento) => {
							const activo = evento.id === eventoId;
							return (
								<button
									key={evento.id}
									type="button"
									aria-pressed={activo}
									onClick={() => seleccionarEvento(evento.id)}
									className={`rounded-xl border p-4 text-left transition-all ${
										activo
											? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
											: 'border-zinc-200 bg-white hover:border-indigo-300 hover:shadow-sm'
									}`}
								>
									<span className="block font-semibold text-zinc-900">{evento.nombre}</span>
									<span className="mt-1 block text-sm text-zinc-500">{evento.descripcion}</span>
									<span className="mt-2 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
										{evento.duracionMinutos} min
									</span>
								</button>
							);
						})}
					</section>

					{/* Escenario 3: calendario (solo si hay evento seleccionado) */}
					{eventoSeleccionado ? (
						<section aria-label="Calendario" className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5">
							<div className="flex items-center justify-between gap-4">
								<button
									type="button"
									onClick={() => cambiarMes(-1)}
									aria-label="Mes anterior"
									className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100"
								>
									◀
								</button>
								<span className="font-semibold capitalize text-zinc-800">
									{NOMBRES_MES[mesVisible.getMonth()]} {mesVisible.getFullYear()}
								</span>
								<button
									type="button"
									onClick={() => cambiarMes(1)}
									aria-label="Mes siguiente"
									className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100"
								>
									▶
								</button>
							</div>

							<div className="grid grid-cols-7 gap-1">
								{DIAS_SEMANA.map((d) => (
									<span key={d} className="flex h-8 items-center justify-center text-xs font-medium text-zinc-400">
										{d}
									</span>
								))}
								{Array.from({ length: primerDiaSemana }, (_, i) => (
									<span key={`vacio-${i}`} />
								))}
								{dias.map((dia) => {
									const fecha = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), dia);
									const iso = aISO(fecha);
									const esPasado = fecha < fechaHoy;
									const tieneDisponibilidad =
										!esPasado && (eventoSeleccionado.disponibilidad[iso]?.length ?? 0) > 0;
									const activo = iso === fechaSeleccionada;

									return (
										<button
											key={dia}
											type="button"
											disabled={!tieneDisponibilidad}
											aria-pressed={activo}
											onClick={() => {
												setFechaSeleccionada(iso);
												setHorario(null);
											}}
											className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ${
												activo
													? 'bg-green-500 font-semibold text-white shadow' // dia seleccionado: circulo verde
													: tieneDisponibilidad
														? 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300' // dia con disponibilidad: circulo gris
														: 'text-zinc-300' // sin marcar / no disponible
											}`}
										>
											{dia}
										</button>
									);
								})}
							</div>

							<div className="flex gap-4 text-xs text-zinc-500">
								<span className="flex items-center gap-1.5">
									<span className="inline-block h-3 w-3 rounded-full bg-zinc-200" /> Disponible
								</span>
								<span className="flex items-center gap-1.5">
									<span className="inline-block h-3 w-3 rounded-full bg-green-500" /> Seleccionado
								</span>
							</div>
						</section>
					) : (
						<div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-400">
							Seleccioná un tipo de evento para ver la disponibilidad.
						</div>
					)}

					{/* Escenario 4: horarios del dia seleccionado */}
					{eventoSeleccionado && fechaSeleccionada && (
						<section aria-label="Horarios disponibles" className="flex flex-col gap-2 md:w-48">
							<h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Horarios</h2>
							{horariosDelDia.length === 0 && <p className="text-sm text-zinc-400">Sin horarios.</p>}
							{horariosDelDia.map((hora) => {
								const activo = hora === horario;
								return (
									<button
										key={hora}
										type="button"
										aria-pressed={activo}
										onClick={() => setHorario(hora)}
										className={`rounded-lg border p-2.5 text-center font-medium transition-all ${
											activo
												? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
												: 'border-zinc-200 text-zinc-700 hover:border-green-300 hover:bg-green-50'
										}`}
									>
										{hora}
									</button>
								);
							})}
						</section>
					)}
				</div>
			</div>
		</div>
	);
}
