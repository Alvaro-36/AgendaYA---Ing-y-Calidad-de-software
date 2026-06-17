# AGENTS.md

Instrucciones para agentes de IA (Claude Code, etc.) que trabajen en este repositorio.

> Documentación detallada de testing y CI: [`docs/testing-y-ci.md`](docs/testing-y-ci.md).

## Regla principal

**Toda feature o cambio de comportamiento debe venir acompañado de tests**, escritos con el
mismo formato y convenciones que los tests existentes, y debe pasar por el pipeline de CI.

## Cómo escribir los tests (igual que los actuales)

Seguí el estilo de los tests ya presentes en `tests/`:

- **Ubicación**: los tests van en `tests/`, espejando la estructura de `src/`.
  Ej: un componente en `src/components/Foo.tsx` se testea en `tests/components/foo.test.tsx`.
- **Nombre de archivo**: `*.test.ts` para lógica/dominio, `*.test.tsx` para componentes React.
- **Herramientas**: Jest + Testing Library (`@testing-library/react`, `@testing-library/user-event`).
  Para componentes, interactuar como el usuario: `userEvent.setup()` y queries por rol/label
  accesibles (`getByRole`, `getByLabelText`, `within`), no por clases CSS ni `data-testid`.
- **Idioma**: los `describe`/`it` se escriben en español y describen el comportamiento esperado
  (ej: `it('Al seleccionar un día disponible se muestran SUS horarios', ...)`).
- **Imports**: usar el alias `@/` (ej: `import SeleccionEvento from '@/components/SeleccionEvento'`).
- **Determinismo**: los tests NO deben depender de la fecha/hora real, red ni entorno.
  Si el código necesita "hoy" u otra dependencia variable, **inyectarla por props/parámetros**
  y pasar un valor fijo en el test (ver cómo `SeleccionEvento` recibe `hoy` y `profesional`).
- **Aserciones precisas**: verificar lo concreto del criterio de aceptación (que aparezca lo
  correcto y que NO aparezca lo incorrecto), no solo "que algo renderice".

Ejemplo de referencia: `tests/components/seleccionEvento.test.tsx`.

## Antes de abrir/actualizar un PR

Ejecutar localmente y dejar todo en verde (es lo mismo que corre el CI):

```bash
npm run lint            # ESLint sin errores
npm run test:coverage   # tests en verde y cobertura por encima de los umbrales
npm run build           # build de producción OK
```

- No bajar la cobertura por debajo de los umbrales de `jest.config.mjs`
  (statements 80% / branches 80% / functions 75% / lines 80%). Si agregás código, agregá tests.
- No deshabilitar reglas de ESLint ni tests para "que pase". Arreglá la causa.

## Que los tests corran en Actions

El pipeline (`.github/workflows/ci.yml`) corre automáticamente al **abrir un PR** y en **cada push**
a la rama del PR. Para que tus tests se ejecuten en Actions:

1. Asegurate de que los tests estén en `tests/` y cumplan el patrón `*.test.ts(x)`
   (así Jest los detecta; el CI corre `npm run test:coverage`).
2. Crear una rama, commitear los cambios **incluyendo los tests** y pushear.
3. Abrir el Pull Request. El workflow **CI** debe quedar en verde antes de mergear.
4. No mergear con el pipeline en rojo. Si falla, revisá los logs en la pestaña **Actions**
   y corregí (no ignores el fallo).

Si agregás un nuevo tipo de chequeo (otra suite, otro script), sumalo también como paso en
`.github/workflows/ci.yml` para que corra en Actions.
