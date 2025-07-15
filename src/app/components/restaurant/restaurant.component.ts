import {Component, OnInit} from '@angular/core';
import {RestaurantItemModel} from "../../models/restaurant.model";
import {Services} from "../../services/services";
import {CurrencyService} from '../../services/currency.service';

@Component({
  selector: 'app-restaurant',
  standalone: false,
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
})
export class RestaurantComponent implements OnInit {
  items: RestaurantItemModel[] = [];
  newItem: RestaurantItemModel = new   RestaurantItemModel ();
  role: string | null = '';
  selectedTab: 'menu' | 'services' = 'menu';
  constructor(private services: Services, private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.role = this.services.getRole();
    this.loadItems();
  }

  getConvertedPrice(price: number): number {
    return this.currencyService.convertFromRON(price);
  }

  getCurrency(): string {
    return this.currencyService.getCurrency();
  }

  loadItems(): void {
    this.services.getAllItems().subscribe({
    next:(data)  => {
      this.items = data;
      if(this.items.length < 0){
        console.error('Nu exista iteme in meniu:');
      }
    },error: error => {
          console.error('Eroare la obținerea itemelor:', error);
        }}
    );
  }

  addItem(): void {
    console.log('Trimit item:', this.newItem);
    this.services.addItem(this.newItem).subscribe(() => {
      this.newItem = new RestaurantItemModel();
      this.loadItems();
    });
  }

  deleteItem(id: number): void {
    this.services.deleteItem(id).subscribe(() => {
      this.loadItems();
    });
  }
}
