import {Component, OnInit} from '@angular/core';
import {RestaurantItemModel} from "../../models/restaurant.model";
import {Services} from "../../services/services";

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
  constructor(private services: Services) {}

  ngOnInit(): void {
    this.role = this.services.getRole();
    this.loadItems();
  }

  loadItems(): void {
    this.services.getAllItems().subscribe(data => {
      this.items = data;
      if(this.items.length < 0){
        console.error('Nu exista iteme in meniu:');
      }
    },(error) => {
          console.error('Eroare la obținerea itemelor:', error);
        }
    );
  }

  addItem(): void {
    console.log('Trimit item:', this.newItem);  // DEBUG
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
