# Testing y CI

Esta guía explica cómo funcionan los tests, la cobertura (coverage), el linter y el pipeline
de integración continua (CI) del proyecto.

## Stack

- **Jest** + **Testing Library** (`@testing-library/react`, `@testing-library/user-event`,
  `@testing-library/jest-dom`) para los tests unitarios y de componentes.
- **ESLint** (config de Next.js) para el análisis estático de código.
- **GitHub Actions** para el pipeline de CI.

## Scripts disponibles

| Script | Comando | Qué hace |
| --- | --- | --- |
| `npm test` | `jest` | Corre todos los tests una vez. |
| `npm run test:watch` | `jest --watch` | Corre los tests en modo watch (re-ejecuta al guardar). |
| `npm run test:coverage` | `jest --coverage` | Corre los tests y genera el reporte de cobertura. |
| `npm run lint` | `eslint` | Ejecuta ESLint sobre el proyecto. |
| `npm run build` | `next build` | Build de producción de Next.js. |

## Tests

### Convenciones

- Los tests viven en la carpeta `tests/`, espejando la estructura de `src/`.
- Jest los detecta con el patrón `tests/**/*.test.ts` y `tests/**/*.test.tsx`
  (ver `testMatch` en `jest.config.mjs`).
- Se usa el alias `@/` para importar desde `src/` (ej: `import { Evento } from '@/domain/entities/evento'`).
- Los nombres de los `describe`/`it` se escriben en español y describen el comportamiento esperado.
- Los tests deben ser **deterministas**: nada que dependa de la fecha/hora real, de la red
  o del entorno. Cuando un componente necesita "hoy", se le inyecta por props una fecha fija.

### Tests actuales

#### `tests/components/seleccionEvento.test.tsx`

Cubre la user story de ver disponibilidad de un profesional y reservar. El componente
`SeleccionEvento` acepta props `hoy` y `profesional` para poder inyectar datos fijos;
el mock genera la disponibilidad **relativa a `hoy`** (hoy+1, hoy+3, hoy+8), por lo que con
`HOY = 17/06/2026` los días disponibles del evento "Consulta inicial" son el 18, 20 y 25.

1. **Al seleccionar un día disponible se muestran SUS horarios** — Selecciona un evento
   disponible, hace click en el día 18 y verifica que aparezcan exactamente los horarios de
   ese día (09:00, 10:00, 11:00) y que **no** aparezca un horario de otro día (14:00 es del día 20).
2. **El calendario NO se ve hasta seleccionar un evento disponible** — Verifica que antes de
   elegir un evento no exista la región "Calendario", y que después de seleccionarlo aparezca
   con al menos un día disponible habilitado.
3. **Al seleccionar un horario disponible queda marcado visualmente** — Recorre el flujo
   completo (evento → día → horario) y verifica que el horario pase de `aria-pressed="false"`
   a `aria-pressed="true"` al hacer click.

#### `tests/domain/evento.test.ts`

Test unitario de la entidad `Evento`:

1. **El evento debería pasar a estado completado** — Al llamar `marcarComoCompletado()` el estado pasa a `"completado"`.
2. **Se debe poder reagendar el evento** — Al llamar `cambiarFecha(fecha)` el atributo `fechaHora` se actualiza con el nuevo valor.
3. **No se debe poder reagendar el evento si está completado** — Si se intenta llamar `cambiarFecha()` en un evento con estado `"completado"`, se debe lanzar una excepción con el mensaje `"El evento ya esta completado"`.

#### `tests/lib/sum.example.test.ts`

Test de ejemplo (`sum`) que sirve de plantilla del formato de un test unitario.

### Cómo correr los tests

```bash
npm test              # una corrida
npm run test:watch    # modo watch durante el desarrollo
```

## Coverage (cobertura)

La cobertura mide qué porcentaje del código es ejecutado por los tests.

```bash
npm run test:coverage
```

Configuración en `jest.config.mjs`:

- **`collectCoverageFrom`**: mide la cobertura de `src/**/*.{ts,tsx}`, excluyendo los archivos
  de tipos (`*.d.ts`) y los shells de la app (`layout.tsx`, `page.tsx`), que solo componen UI.
- **`coverageThreshold`**: define los mínimos globales. Si la cobertura baja de estos valores,
  `jest --coverage` falla (y por lo tanto falla el CI):

  | Métrica | Mínimo |
  | --- | --- |
  | Statements | 80% |
  | Branches | 80% |
  | Functions | 75% |
  | Lines | 80% |

El reporte se genera en la carpeta `coverage/` (ignorada por git). En el CI, además, se publica
como **artifact** descargable desde la corrida del workflow.

## ESLint

ESLint hace análisis estático del código para detectar errores y problemas de estilo.

```bash
npm run lint
```

Usa la config de `eslint.config.mjs` (basada en `eslint-config-next`). Si encuentra errores,
el comando falla con código distinto de cero, lo que rompe el pipeline.

## Pipeline de CI (GitHub Actions)

Definido en `.github/workflows/ci.yml`.

### Cuándo se dispara

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

- `opened`: al crear un Pull Request.
- `synchronize`: cada vez que se actualiza (push) la rama del PR.
- `reopened`: al reabrir un PR cerrado.

### Qué hace el job `test-and-build` (en `ubuntu-latest`)

1. **Checkout** del código (`actions/checkout`).
2. **Configurar Node.js 20** con caché de npm (`actions/setup-node`).
3. **`npm ci`** — instalación reproducible desde `package-lock.json`.
4. **`npm run lint`** — análisis estático con ESLint.
5. **`npm run test:coverage`** — tests unitarios + verificación de umbrales de cobertura.
6. **Subir artifact** `coverage-report` con la carpeta `coverage/` (`if: always()`).
7. **`npm run build`** — build de producción de Next.js.

Si cualquiera de los pasos falla, el job falla y el PR queda marcado en rojo, bloqueando el merge
(si la rama protegida lo requiere).

### Ver resultados

En GitHub, pestaña **Actions** → la corrida del workflow **CI**. Ahí se ven los logs de cada paso
y, en la sección de artifacts, se puede descargar el reporte de cobertura.
