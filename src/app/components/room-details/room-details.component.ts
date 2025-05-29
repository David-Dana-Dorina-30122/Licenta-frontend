import {Component, OnInit} from '@angular/core';
import {Services} from '../../services/services';
import {ActivatedRoute} from '@angular/router';
import {RoomModel} from '../../models/room.model';
import {Lightbox} from 'ngx-lightbox';
import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-room-details',
  standalone: false,
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css'
})
export class RoomDetailsComponent implements OnInit {
  room: RoomModel | null = null;
  currentImageIndex: number = 0;
  showPopUp = false

  constructor(
    private route: ActivatedRoute,
    private service: Services,
    private  lightbox: Lightbox
  ) {}

  ngOnInit(): void {
    const roomId = +this.route.snapshot.paramMap.get('id')!;
    this.service.getRoomById(roomId).subscribe({
      next: (data) => this.room = data,
      error: (err) => console.error('Eroare la încărcarea camerei:', err)
    });
  }
  prevImage(): void {
    if (!this.room) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.room.imageUrls.length) %
      this.room.imageUrls.length;
  }

  nextImage(): void {
    if (!this.room) return;
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.room.imageUrls.length;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  showPopup(){
    this.showPopUp = true
  }
  closePopup() {
    this.showPopUp = false;
  }
}
