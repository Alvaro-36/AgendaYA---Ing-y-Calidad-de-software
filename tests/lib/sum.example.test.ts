import { sum } from '@/lib/sum';

describe('sum (EJEMPLO)', () => {
  it('deberia sumar dos numeros', () => {
    // Este test es SOLO UN EJEMPLO para mostrar el formato de tests unitarios.
    expect(sum(2, 3)).toBe(5);
  });
});
