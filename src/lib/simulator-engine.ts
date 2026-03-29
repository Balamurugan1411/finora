export class SimulatorEngine {
  static calculateCompoundInterest(
    principal: number,
    monthlySIP: number,
    annualRate: number,
    years: number,
    inflationRate: number = 0.06
  ): number {
    const months = years * 12;
    const realAnnualRate = (1 + annualRate) / (1 + inflationRate) - 1;
    const r = realAnnualRate / 12;
    const corpusFV = principal * Math.pow(1 + r, months);
    const sipFV = r > 0 ? monthlySIP * ((Math.pow(1 + r, months) - 1) / r) * (1 + r) : monthlySIP * months;
    return corpusFV + sipFV;
  }

  static getOpportunityCost(cost: number, years: number, cagr: number = 0.12): number {
    return cost * Math.pow(1 + cagr, years);
  }

  static processTaxNewRegime(income: number): number {
    let taxable = income - 50000;
    if (taxable <= 700000) return 0;
    let tax = 0;
    if (taxable > 1500000) { tax += (taxable - 1500000) * 0.30; taxable = 1500000; }
    if (taxable > 1200000) { tax += (taxable - 1200000) * 0.20; taxable = 1200000; }
    if (taxable > 900000) { tax += (taxable - 900000) * 0.15; taxable = 900000; }
    if (taxable > 600000) { tax += (taxable - 600000) * 0.10; taxable = 600000; }
    if (taxable > 300000) { tax += (taxable - 300000) * 0.05; }
    return tax * 1.04;
  }

  static processTaxOldRegime(income: number, deductions: number = 150000): number {
    let taxable = income - 50000 - deductions; // 50k standard deduction + 1.5L 80C
    if (taxable <= 250000) return 0;
    let tax = 0;
    if (taxable > 1000000) { tax += (taxable - 1000000) * 0.30; taxable = 1000000; }
    if (taxable > 500000) { tax += (taxable - 500000) * 0.20; taxable = 500000; }
    if (taxable > 250000) { tax += (taxable - 250000) * 0.05; }
    return tax * 1.04;
  }

  static calculateEMI(principal: number, annualRate: number, months: number): number {
    const r = annualRate / 12 / 100;
    if (r === 0) return principal / months;
    const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return Math.round(emi);
  }

  static getRentVsBuy(
    propertyValue: number,
    monthlyRent: number,
    downpayment: number,
    loanYears: number,
    loanRate: number,
    appreciation: number = 0.05,
    rentHike: number = 0.05,
    investmentReturn: number = 0.12
  ): { buyWealth: number; rentWealth: number; winner: 'Buy' | 'Rent' } {
    const months = loanYears * 12;
    const emi = this.calculateEMI(propertyValue - downpayment, loanRate, months);
    
    // Buying path
    const propFV = propertyValue * Math.pow(1 + appreciation, loanYears);
    
    // Renting path (Invest downpayment + monthly difference)
    let rentWealth = downpayment * Math.pow(1 + (investmentReturn / 12), months);
    let currentRent = monthlyRent;
    for (let m = 1; m <= months; m++) {
      if (m % 12 === 0) currentRent *= (rentHike + 1);
      const diff = emi - currentRent;
      if (diff > 0) {
        rentWealth += diff * Math.pow(1 + (investmentReturn / 12), months - m);
      }
    }

    return {
      buyWealth: Math.round(propFV),
      rentWealth: Math.round(rentWealth),
      winner: propFV > rentWealth ? 'Buy' : 'Rent'
    };
  }

  static generateProjection(
    principal: number,
    monthlySIP: number,
    annualRate: number,
    years: number
  ): { year: number; wealth: number; invested: number }[] {
    const data = [];
    for (let y = 0; y <= years; y++) {
      const wealth = this.calculateCompoundInterest(principal, monthlySIP, annualRate, y);
      const invested = principal + (monthlySIP * 12 * y);
      data.push({ year: y, wealth: Math.round(wealth), invested: Math.round(invested) });
    }
    return data;
  }

  static calculate6DHealthScore(data: any): { 
    composite: number;
    dimensions: Record<string, number>;
  } {
    const { 
      monthlyIncome: inc, 
      monthlyExpenses: exp, 
      currentSavings: savings,
      hasInsurance,
      hasEmergencyFund,
      monthlyEMI = 0,
      portfolio = []
    } = data;

    if (inc <= 0) return { composite: 0, dimensions: {} };

    const dims: Record<string, number> = {
      'Emergency': hasEmergencyFund ? 100 : Math.min((savings / (exp * 6)) * 100, 100),
      'Insurance': hasInsurance ? 100 : 0,
      'Debt': Math.max(0, (1 - (monthlyEMI / inc)) * 100),
      'Savings': Math.min(((inc - exp) / inc) * 300, 100),
      'Retirement': data.retirementAge > 50 ? 100 : 50,
      'Diversification': portfolio.length > 2 ? 100 : portfolio.length * 33
    };

    const composite = Math.round(Object.values(dims).reduce((a, b) => a + b, 0) / 6);
    return { composite, dimensions: dims };
  }

  static analyzePortfolio(assets: any[]) {
    const total = assets.reduce((sum, a) => sum + a.value, 0);
    if (total === 0) return null;

    const allocation = assets.reduce((acc: any, a) => {
      acc[a.type] = (acc[a.type] || 0) + (a.value / total) * 100;
      return acc;
    }, {});

    const expenseDrag = assets.reduce((sum, a) => sum + (a.value * (a.expenseRatio || 0)), 0) / total;
    
    // Simulate overlap (Randomized for hackathon demo but with logical constraints)
    const overlap = 15 + Math.random() * 20; 

    return { total, allocation, expenseDrag, overlap };
  }

  static generateRoadmap(
    principal: number,
    monthlySIP: number,
    annualRate: number,
    years: number,
    lifeEvents: any[]
  ) {
    const data = [];
    let currentWealth = principal;
    const r = annualRate / 12;

    for (let m = 0; m <= years * 12; m++) {
      currentWealth = currentWealth * (1 + r) + monthlySIP;
      
      const year = Math.floor(m / 12);
      const event = lifeEvents.find(e => e.year === year && m % 12 === 0);
      if (event) {
        currentWealth -= event.cost;
      }

      if (m % 12 === 0) {
        data.push({ 
          year, 
          wealth: Math.round(currentWealth), 
          event: event?.name || null 
        });
      }
    }
    return data;
  }

  static getRiskLevel(income: number, expenses: number, savings: number): 'Low' | 'Medium' | 'High' {
    const ratio = (income > 0) ? expenses / income : 1;
    const emergencyMonths = (expenses > 0) ? savings / expenses : 0;
    if (ratio > 0.8 || emergencyMonths < 2) return 'High';
    if (ratio > 0.6 || emergencyMonths < 4) return 'Medium';
    return 'Low';
  }
}
