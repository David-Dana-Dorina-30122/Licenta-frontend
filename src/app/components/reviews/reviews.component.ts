import {Component, Input, OnInit} from '@angular/core';
import {ReviewModel} from '../../models/reviewModel';
import {Services} from '../../services/services';

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

  constructor(private service: Services) {}

  ngOnInit(): void {
    this.loadReviews();
    this.newReview.reservationId = this.reservationId;
  }

  loadReviews(): void {
    this.service.getReviewsByReservation(this.reservationId).subscribe(data => {
      this.reviews = data;
    });
  }

  submitReview(): void {
    if (!this.newReview.comment.trim()) return;

    this.service.addReview(this.newReview).subscribe(() => {
      this.newReview.comment = '';
      this.loadReviews();
    });
  }
}
