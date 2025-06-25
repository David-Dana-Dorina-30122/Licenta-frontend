import {Component, Input, OnInit} from '@angular/core';
import {ReviewModel} from '../../models/reviewModel';
import {Services} from '../../services/services';
import {RoomModel} from '../../models/room.model';
import {ReservationModel} from '../../models/reservation.model';

@Component({
  selector: 'app-reviews',
  standalone: false,
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  @Input() reservationId!: number;

  reviews: ReviewModel[] = [];
  newReview: ReviewModel = { reservationId: 0, rating: 5, comment: '' };
  selectedReservationId: number | null = null;
  reservations: ReservationModel[] = [];

  constructor(private service: Services) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
      this.service.getUserReservations().subscribe(
        (reservations: ReservationModel[]) => {
          console.log('Rezervările utilizatorului:', reservations);
          this.reservations = reservations;
        },
        (error) => {
          console.error('Eroare la obținerea rezervărilor:', error);
        }
      );
  }

  submitReview(): void {
    if (!this.newReview.comment.trim() || !this.selectedReservationId) return;

    this.newReview.reservationId = this.selectedReservationId;

    this.service.addReview(this.newReview).subscribe({
      next: () => {
        this.newReview.comment = '';
        this.newReview.rating = 0;
        this.selectedReservationId = null;
      },
      error: (err) => console.error('Eroare la trimiterea review-ului:', err)
    });
  }
}
