import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReservationModel} from '../../models/reservation.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import {Services} from '../../services/services';
import {ActivatedRoute, Router} from '@angular/router';
import {ReservationStatus} from '../../models/reservationStatus.model';

@Component({
  selector: 'app-reservation-create',
  standalone: false,
  templateUrl: './reservation-create.component.html',
  styleUrl: './reservation-create.component.css'
})
export class ReservationCreateComponent {
  reservation: ReservationModel = new ReservationModel();
  showLoginPopup = false;


  constructor(
    private route: ActivatedRoute,
    private service: Services,
    private router: Router
  ) {}

  calculatedTotalCost: number = 0;

  calculateTotalCost(pricePerNight: number, nights: number): void {
    let extraCost = 0;

    if (this.reservation.meals) {
      extraCost += 50 * this.reservation.numberOfPeople;
    }

    if (this.reservation.spa) {
      extraCost += 100;
    }

    this.calculatedTotalCost = (pricePerNight * nights) + extraCost;
    this.reservation.totalCost = this.calculatedTotalCost;
  }



  ngOnInit(): void {
    this.reservation.meals = false;
    this.reservation.spa = false;

    this.route.queryParams.subscribe(params => {
      this.reservation.roomId = +params['roomId'];
      this.reservation.dataCheckIn = params['dataCheckIn'];
      this.reservation.dataCheckOut = params['dataCheckOut'];
      this.reservation.numberOfAdults = +params['numberOfAdults'];
      this.reservation.numberOfChildren = +params['numberOfChildren'];
      this.reservation.numberOfPeople = +params['numberOfPeople'];

      const pricePerNight = +params['pricePerNight'];
      const checkIn = new Date(this.reservation.dataCheckIn);
      const checkOut = new Date(this.reservation.dataCheckOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      this.calculateTotalCost(pricePerNight, nights);
    });
  }

  onExtrasChanged(): void {
    const checkIn = new Date(this.reservation.dataCheckIn);
    const checkOut = new Date(this.reservation.dataCheckOut);
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const pricePerNight = this.route.snapshot.queryParamMap.get('pricePerNight');
    if (pricePerNight) {
      this.calculateTotalCost(+pricePerNight, numberOfNights);
    }
  }


  createReservation(): void {

    const token = this.service.getToken();

    if (!token) {
      this.showLoginPopup = true;
      return;
    }

    const formattedReservation = {
      ...this.reservation,
      dataCheckIn: this.formatDate(this.reservation.dataCheckIn),
      dataCheckOut: this.formatDate(this.reservation.dataCheckOut),
    };

    this.service.createReservation(formattedReservation).subscribe({
      next: (res) => {
        console.log('Rezervare creată cu succes:', res);
        this.router.navigate(['/reservations']);
      },
      error: (err) => {
        console.error('Eroare la creare rezervare:', err);
      }
    });
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  closePopup() {
    this.showLoginPopup = false;
  }
}


