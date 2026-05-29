export interface PayrollInput {
    grossSalary: number;
    filingStatus: 'single' | 'married';
    state: string;
    k401ContributionPercent: number;
    healthInsuranceFlat: number;
    payFrequency: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
}

export interface PayrollResult {
    grossPay: number;
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    k401Deduction: number;
    healthInsuranceDeduction: number;
    totalDeductions: number;
    netPay: number;  
}

const PAY_PERIODS: Record<string, number> = {
    weekly: 52,
    biweekly: 26,
    semimonthly: 24,
    monthly: 12
};

function calculateFederalTax(annualTaxableIncome: number, filingStatus: 'single' | 'married'): number {
    const brackets = filingStatus === 'single' ? [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 },
    ] : [
        { min: 0, max: 23200, rate: 0.10 },
        { min: 23200, max: 94300, rate: 0.12 },
        { min: 94300, max: 201050, rate: 0.22 },
        { min: 201050, max: 383900, rate: 0.24 },
        { min: 383900, max: 487450, rate: 0.32 },
        { min: 487450, max: 731200, rate: 0.35 },
        { min: 731200, max: Infinity, rate: 0.37 },
    ];

let tax = 0;
for (const bracket of brackets) { //Loop through each bracket one at a time. First iteration = 10% bracket, second = 12%, etc.
    if (annualTaxableIncome <= bracket.min) break; //If my salary doesnt even reach the start of this bracket stop looping
    const taxableInBracket = Math.min(annualTaxableIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
}
return tax;
}

const STATE_TAX_RATES: Record<string, number> = {
    GA: 0.0575,
    CA: 0.08,
    NY: 0.06,
    TX: 0.00,
    FL: 0.00,
    IL: 0.0495,
    PA: 0.0307,
    OH: 0.048,
    MI: 0.0425,
    NC: 0.0525,
    default: 0.05
};

function round(value: number): number {
    return Math.round(value * 100) / 100;
}

export function calculatePayroll(input: PayrollInput): PayrollResult {
  const { grossSalary, filingStatus, state, k401ContributionPercent, healthInsuranceFlat, payFrequency } = input;

  const periods = PAY_PERIODS[payFrequency];
  const grossPay = grossSalary / periods;

  const annualK401 = grossSalary * k401ContributionPercent;
  const annualHealthInsurance = healthInsuranceFlat * 12;
  const annualTaxableIncome = grossSalary - annualK401 - annualHealthInsurance;

  const annualFederalTax = calculateFederalTax(annualTaxableIncome, filingStatus);
  const federalTax = annualFederalTax / periods;

  const stateRate = STATE_TAX_RATES[state.toUpperCase()] ?? STATE_TAX_RATES['default'];
  const stateTax = (annualTaxableIncome * stateRate) / periods;

  const socialSecurity = Math.min(grossSalary, 160200) / periods * 0.062;
  const medicare = grossPay * 0.0145;

  const k401Deduction = grossPay * k401ContributionPercent;
  const healthInsuranceDeduction = healthInsuranceFlat;

  const totalDeductions = federalTax + stateTax + socialSecurity + medicare + k401Deduction + healthInsuranceDeduction;
  const netPay = grossPay - totalDeductions;

  return {
    grossPay: round(grossPay),
    federalTax: round(federalTax),
    stateTax: round(stateTax),
    socialSecurity: round(socialSecurity),
    medicare: round(medicare),
    k401Deduction: round(k401Deduction),
    healthInsuranceDeduction: round(healthInsuranceDeduction),
    totalDeductions: round(totalDeductions),
    netPay: round(netPay),
  };
}