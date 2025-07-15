import { Component } from '@angular/core';
import {Services} from '../../services/services';
import {CurrencyService} from '../../services/currency.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css',
  standalone:false
})
export class UserNavComponent  {
  role: string | null = '';
  isClicked = false;

  currentCurrency = 'RON';

  constructor(private currencyService: CurrencyService, public service: Services) {}

  changeCurrency(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const currency = selectElement.value;
    this.currencyService.setCurrency(currency);
  }

  ngOnInit(): void {
   this.role = this.service.getRole();
    this.currentCurrency = this.currencyService.getCurrency();
  }

  onClick(){
    this.isClicked = !this.isClicked;
  }

}
