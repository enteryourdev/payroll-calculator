import { calculatePayroll, PayrollInput } from './payroll';

const baseInput: PayrollInput = {
  grossSalary: 60000,
  filingStatus: 'single',
  state: 'GA',
  k401ContributionPercent: 0.06,
  healthInsuranceFlat: 200,
  payFrequency: 'biweekly',
};

describe('calculatePayroll', () => {

  test('gross pay is correct for biweekly frequency', () => {
    const result = calculatePayroll(baseInput);
    expect(result.grossPay).toBeCloseTo(2307.69, 1);
  });

  test('401k deduction is correct', () => {
    const result = calculatePayroll(baseInput);
    expect(result.k401Deduction).toBeCloseTo(138.46, 1);
  });

  test('health insurance deduction is correct', () => {
    const result = calculatePayroll(baseInput);
    expect(result.healthInsuranceDeduction).toBe(200);
  });

  test('net pay is less than gross pay', () => {
    const result = calculatePayroll(baseInput);
    expect(result.netPay).toBeLessThan(result.grossPay);
  });

  test('total deductions equal gross minus net', () => {
    const result = calculatePayroll(baseInput);
    expect(result.grossPay - result.netPay).toBeCloseTo(result.totalDeductions, 1);
  });

  test('Texas has zero state tax', () => {
    const result = calculatePayroll({ ...baseInput, state: 'TX' });
    expect(result.stateTax).toBe(0);
  });

  test('married status pays less federal tax than single', () => {
    const marriedResult = calculatePayroll({ ...baseInput, filingStatus: 'married' });
    const singleResult = calculatePayroll(baseInput);
    expect(marriedResult.federalTax).toBeLessThan(singleResult.federalTax);
  });

  test('zero 401k contribution results in no 401k deduction', () => {
    const result = calculatePayroll({ ...baseInput, k401ContributionPercent: 0 });
    expect(result.k401Deduction).toBe(0);
  });

  test('monthly frequency returns correct gross pay', () => {
    const result = calculatePayroll({ ...baseInput, payFrequency: 'monthly' });
    expect(result.grossPay).toBeCloseTo(5000, 1);
  });

});