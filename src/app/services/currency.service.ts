import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private selectedCurrency: string = 'RON';

  private exchangeRates: { [key: string]: number } = {
    EUR: 1,
    USD: 1.08,
    RON: 4.97,
    GBP: 0.85,
  };

  setCurrency(currency: string): void {
    this.selectedCurrency = currency;
  }

  getCurrency(): string {
    return this.selectedCurrency;
  }

  convertFromRON(priceRON: number): number {
    const rate = this.exchangeRates[this.selectedCurrency] || 1;
    return priceRON * rate;
  }

  getExchangeRate(): number {
    return this.exchangeRates[this.selectedCurrency] || 1;
  }
}
