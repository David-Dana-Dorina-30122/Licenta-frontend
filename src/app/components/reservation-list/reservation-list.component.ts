import {Component} from '@angular/core';
import {Services} from '../../services/services';
import {ReservationModel} from '../../models/reservation.model';
import {HttpClient} from '@angular/common/http';
import {RoomModel} from '../../models/room.model';
import {Router} from '@angular/router';

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
  timeExpired:boolean = false;
  constructor(private http: HttpClient, private service: Services, private router: Router) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadReservations();
  }
  canCancel(reservation: ReservationModel): boolean {
    const createdAt = new Date(reservation.createdAt).getTime();
    const now = Date.now();
    return now < createdAt + 2* 60 * 1000;
  }

  get activeReservations(): ReservationModel[] {
    return this.reservations.filter(res => res.status === 'ACTIVE');
  }
  get inactiveReservations(): ReservationModel[] {
    return this.reservations.filter(res => res.status !== 'ACTIVE');
  }


  loadReservations() {
    const token = this.service.getToken();

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
        }
      );
    } else {
      console.error('Token-ul nu este disponibil! Nu se pot obține rezervările.');
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
    if (confirm('Sigur vrei să ștergi această rezervare?')) {
      this.service.deleteReservation(id).subscribe(() => {
        this.reservations = this.reservations.filter(reservation => reservation.id !== id);
      });
    }
  }
}

