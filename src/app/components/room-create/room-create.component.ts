import { Component } from '@angular/core';
import {Services} from '../../services/services';
import {RoomModel} from '../../models/room.model';

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
  newImageUrl: string = '';


  constructor(private service: Services) {
    this.room.imageUrls = [];
  }

  createRoom(): void {
    console.log("Trimitem camera:", this.room);

    this.service.createRoom(this.room).subscribe({
      next: (createdRoom) => {
        console.log("Camera creată", createdRoom);
        window.location.reload();
      },
      error: (err) => {
        console.error('Eroare la creare cameră:', err);
      }
    });
  }

  addImageUrl(): void {
    if (this.newImageUrl.trim()) {
      const urls = this.newImageUrl.split(',').map(u => u.trim()).filter(u => u);
      this.room.imageUrls.push(...urls);
      this.newImageUrl = '';
    }
  }
}
