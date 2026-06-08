# TP4 - Next.js + TDD

Proyecto inicializado con Next.js (App Router + TypeScript) y configurado para trabajar con Test Driven Development (TDD) usando Jest + Testing Library.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
npm run test:coverage
```

## Estructura de testing

- `jest.config.mjs`: configuracion principal de Jest para Next.js.
- `jest.setup.ts`: setup global de tests (`@testing-library/jest-dom`).
- `src/lib/sum.example.test.ts`: **SOLO EJEMPLO** de test unitario para mostrar formato.

## Importante

El archivo `src/lib/sum.example.test.ts` esta incluido unicamente como referencia del formato de un test unitario.
Podes borrarlo o reemplazarlo por tests reales del dominio de tu app.
