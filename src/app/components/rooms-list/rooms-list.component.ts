import { Component } from '@angular/core';
import {Services} from '../../services/services';
import {RoomModel} from '../../models/room.model';
import {CurrencyService} from '../../services/currency.service';

@Component({
  selector: 'app-rooms-list',
  standalone: false,
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css'
})
export class RoomsListComponent {
  rooms: RoomModel[] = [];
  role: string | null = '';

  constructor(private service: Services, private currencyService: CurrencyService) {}

  ngOnInit():void{
    this.loadRooms()
    this.getRole()
  }

  getConvertedPrice(price: number): number {
    return this.currencyService.convertFromRON(price);
  }

  getCurrency(): string {
    return this.currencyService.getCurrency();
  }

  loadRooms(){
      this.service.getRooms().subscribe({
        next:(rooms: RoomModel[])=>  {
          console.log('Camerele:', rooms);
          this.rooms = rooms;
        },
        error:error => {
          console.error('Eroare la obținerea camerelor:', error);
        }}
      );
  }

  deleteRoom(id: number): void {
    if (confirm('Sigur vrei să ștergi această cameră?')) {
      this.service.deleteRoom(id).subscribe(() => {
        this.rooms = this.rooms.filter(room => room.id !== id);
      });
    }
  }

  getRole():void{
    this.role = this.service.getRole();
  }
}
