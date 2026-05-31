# Payroll Calculator Microservice
A TypeScript microservice that calculates gross-to-net pay for employees.

## Features
- Federal income tax calculation using 2024 progressive tax brackets
- Multi-state tax support (GA, CA, NY, TX, FL, and more)
- Pre-tax deductions: 401(k) and health insurance
- FICA withholding: Social Security and Medicare
- Supports weekly, biweekly, semimonthly, and monthly pay frequencies

## Tech Stack
TypeScript, Node.js, Express, Jest

## Running the API
npx ts-node src/server.ts

POST /calculate — calculates gross-to-net pay for an employee

Example request:
curl -X POST http://localhost:3000/calculate -H "Content-Type: application/json" -d "{\"grossSalary\": 60000, \"filingStatus\": \"single\", \"state\": \"GA\", \"k401ContributionPercent\": 0.06, \"healthInsuranceFlat\": 200, \"payFrequency\": \"biweekly\"}"

Example response:
{
  "grossPay": 2307.69,
  "federalTax": 266.65,
  "stateTax": 119.42,
  "socialSecurity": 143.08,
  "medicare": 33.46,
  "k401Deduction": 138.46,
  "healthInsuranceDeduction": 200,
  "totalDeductions": 901.08,
  "netPay": 1406.62
}

## Running Tests
npm test

## Example
Input: $60,000 salary, single, Georgia, 6% 401k, $200 health insurance, biweekly
Output: ~$1,407 net pay per paycheck
