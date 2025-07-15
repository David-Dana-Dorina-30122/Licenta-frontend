import {Component, OnInit} from '@angular/core';
import {ReviewModel} from '../../models/reviewModel';
import {Services} from '../../services/services';
import {ReservationModel} from '../../models/reservation.model';

@Component({
  selector: 'app-reviews',
  standalone: false,
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {

  reviews: ReviewModel[] = [];
  newReview: ReviewModel = { reservationId: 0, rating: 5, comment: '' };
  selectedReservationId: number | null = null;
  reservations: ReservationModel[] = [];
  role: string | null = '';
  reservation: ReservationModel | undefined ;
  reviewsWithReservations: ReviewModel[] = [];
  // reservationId: number = 0;
  reservationsMap = new Map<number, ReservationModel>();


  constructor(private service: Services) {}

  ngOnInit(): void {
    this.loadReservations();
    this.getReviews();
    this.role = this.service.getRole();

  }

  loadReservations() {
      this.service.getUserReservations().subscribe({
        next:(reservations: ReservationModel[]) => {
          console.log('Rezervările utilizatorului:', reservations);
          this.reservations = reservations;
        },
        error:error => {
          console.error('Eroare la obținerea rezervărilor:', error);
        }}
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

  getReviews(){
    this.service.getAllReviews().subscribe({
      next:(data) =>{
        this.reviews = data;
        console.log("Reviews primite",data)
        this.reviews.forEach(review => {
          console.log("reservationId:", review.reservationId);
          this.getReservationById(review.reservationId);
        });
      },
      error:error =>{
        console.log("Eroare la obținerea review-uriloe: ", error)
      }
    })
  }

  getReservationById(id: number) {
    this.service.getReservationById(id).subscribe({
      next: (data:ReservationModel) => {

        this.reservationsMap.set(id, data);
        console.log("Rezervarea: ", this.reservationsMap);
      },
      error: error => {
        console.log("Eroare la obținerea rezervarii: ", error);
      }
    });
  }

}
