import { Component } from '@angular/core';
import {Services} from '../../services/services';
import {RoomModel} from '../../models/room.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-room-create',
  standalone: false,
  templateUrl: './room-create.component.html',
  styleUrl: './room-create.component.css'
})
export class RoomCreateComponent {
  room: RoomModel = new RoomModel();
  roomTypes: string[] = ['SINGLE', 'DOUBLE', 'DELUXE', 'PENTHOUSE'];
  roomStatuses: string[] = ['AVAILABLE', 'UNAVAILABLE'];


  constructor(private service: Services) {
  }

  createRoom(): void {
    console.log("Trimitem camera:", this.room);
    this.service.createRoom(this.room).subscribe({
      next: (r) => {
        console.log("Camera creată", r);
        window.location.reload();
      },
      error: (err) => {
        console.error('Eroare la creare cameră:', err);
      }
    });
  }

}
