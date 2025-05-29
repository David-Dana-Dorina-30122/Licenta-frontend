import {Component, Input} from '@angular/core';
import {Services} from '../../services/services';
import {ReservationModel} from '../../models/reservation.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Room, RoomModel} from '../../models/room.model';
import {Router} from '@angular/router';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-reservation-list',
  standalone: false,
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent {
  reservations: ReservationModel[] = [];
  rooms: RoomModel[] = [];
  isNotEmpty = false;
  showLoginPopup = false;
  qrCodes: { [id: number]: string } = {};
  isActive = false;

  constructor(private http: HttpClient, private service: Services, private router: Router) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadReservations();
  }

  get activeReservations(): ReservationModel[] {
    return this.reservations.filter(res => res.status === 'ACTIVE');
  }
  get inactiveReservations(): ReservationModel[] {
    return this.reservations.filter(res => res.status !== 'ACTIVE');
  }


  loadReservations() {
    const token = this.service.getToken();

    if (!token) {
      this.showLoginPopup = true;
      // this.service.logout();
      // this.router.navigate(['/home']);
      return;
    }

    if (token) {
      this.service.getUserReservations().subscribe(
        (reservations: ReservationModel[]) => {
          console.log('Rezervările utilizatorului:', reservations);
          this.reservations = reservations;
          if(this.reservations.length > 0){
            this.isNotEmpty = true;
          }
          for (const res of reservations) {
            this.service.getReservationQRCode(res.id).subscribe(qrUrl => {
              this.qrCodes[res.id] = qrUrl;
            });
          }
        },
        (error) => {
          console.error('Eroare la obținerea rezervărilor:', error);
          // this.service.logout();
          // this.router.navigate(['/home']);
        }
      );
    } else {
      console.error('Token-ul nu este disponibil! Nu se pot obține rezervările.');
      // this.service.logout();
      // this.router.navigate(['/home']);
    }
  }

  loadRooms(): void {
    this.service.getRooms().subscribe(
      (rooms: RoomModel[]) => {
        if (rooms && rooms.length > 0) {
          this.rooms = rooms.map(room => ({
            id: room.id,
            number: room.number,
            type: room.type,
            description: room.description,
            pricePerNight: room.pricePerNight,
            status: 'AVAILABLE',
            capacity: room.capacity,
            imageUrls: room.imageUrls,
            services: room.services,
          }));
        } else {
          console.warn('Nu sunt camere disponibile.');
          this.rooms = []
         // this.service.logout();
          //this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.error('Eroare la încărcarea camerelor:', error);
      }
    );
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  closePopup() {
    this.showLoginPopup = false;
  }

  getRoomDetails(roomId?: number): RoomModel | undefined {
    if (roomId === undefined) {
      return undefined;
    }
    return this.rooms.find(room => room.id === roomId);
  }

  deleteReservation(id: number): void {
    if (confirm('Sigur vrei să ștergi această cameră?')) {
      this.service.deleteReservation(id).subscribe(() => {
        this.reservations = this.reservations.filter(reservation => reservation.id !== id);
      });
    }
  }
}

