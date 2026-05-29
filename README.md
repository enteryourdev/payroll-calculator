# Payroll Calculator Microservice

A TypeScript microservice that calculates gross-to-net pay for employees.

## Features
- Federal income tax calculation using 2024 progressive tax brackets
- Multi-state tax support (GA, CA, NY, TX, FL, and more)
- Pre-tax deductions: 401(k) and health insurance
- FICA withholding: Social Security and Medicare
- Supports weekly, biweekly, semimonthly, and monthly pay frequencies

## Tech Stack
TypeScript, Node.js, Jest

## Running Tests
npm test

## Example
Input: $60,000 salary, single, Georgia, 6% 401k, $200 health insurance, biweekly

Output: ~$1,847 net pay per paycheck
