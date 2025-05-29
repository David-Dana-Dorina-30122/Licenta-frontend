import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Room, RoomModel} from '../../models/room.model';
import {dateNotBeforeTodayValidator, dateRangeValidator} from '../../services/date-range.validator';


@Component({
  selector: 'app-availability',
  standalone: false,
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.css'
})
export class AvailabilityComponent {

  availabilityForm: FormGroup;
  rooms: RoomModel[] = [];
  loading = false;
  errorMessage = '';
  submitted = false;
  today = '';
  roomTypes: string [] = ['SINGLE', 'DOUBLE', 'DELUXE','PENTHOUSE'];
  showPopUp = false;
  numberOfAdults = 1;
  numberOfChildren = 0;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.availabilityForm = this.fb.group({
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      numberOfAdults: [1, [Validators.required, Validators.min(1)]],
      numberOfChildren: [0, [Validators.required, Validators.min(0)]],
      type:['',Validators.required]
     // date: ['', [dateNotBeforeTodayValidator]],
    },{ validators: dateRangeValidator()});
  }

  @ViewChild('personGroupRef') personGroupRef!: ElementRef;


  ngOnInit(){
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
  }



  searchRooms(): void {
    if (this.availabilityForm.invalid) {
      return;
    }

    const {checkIn, checkOut, numberOfAdults,numberOfChildren,type} = this.availabilityForm.value;
    const numberOfPeople = numberOfAdults + numberOfChildren;
    const params = new HttpParams()
      .set('checkIn', checkIn)
      .set('checkOut', checkOut)
      .set('numberOfAdults', numberOfAdults)
      .set('numberOfChildren', numberOfChildren)
      .set('numberOfPeople', numberOfPeople)
      .set('type',type);
    console.log("parametrii: ", params)
    this.loading = true;
    this.errorMessage = '';
    this.submitted = true;
    if (checkIn > checkOut) {
      this.errorMessage = 'Data de check-in nu poate fi după data de check-out.';
      return;
    }

    this.http.get<RoomModel[]>('http://localhost:8082/rooms/available', {params}).subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'A apărut o eroare la căutarea camerelor.';
        console.error(err);
        this.loading = false;
      }
    });

  }

  selectRoom(room: RoomModel): void {
    const {checkIn, checkOut, numberOfAdults,numberOfChildren,type} = this.availabilityForm.value;
    const numberOfPeople = numberOfAdults + numberOfChildren;
    this.router.navigate(['/createReservation'], {
      queryParams: {
        roomId: room.id,
        dataCheckIn: checkIn,
        dataCheckOut: checkOut,
        numberOfAdults:numberOfAdults,
        numberOfChildren:numberOfChildren,
        numberOfPeople:numberOfPeople,
        type: type,
        pricePerNight: room.pricePerNight
      }
    });
  }

  showPopup(){
    this.showPopUp = true
  }
  closePopup() {
    this.showPopUp = false;
  }

  increase(type: 'adults' | 'children') {
    if (type === 'adults' && this.numberOfAdults < 2) {
      this.numberOfAdults++;
      this.availabilityForm.get('numberOfAdults')?.setValue(this.numberOfAdults);
    } else if (type === 'children' && this.numberOfChildren < 2) {
      this.numberOfChildren++;
      this.availabilityForm.get('numberOfChildren')?.setValue(this.numberOfChildren);
    }
  }

  decrease(type: 'adults' | 'children') {
    if (type === 'adults' && this.numberOfAdults > 1) {
      this.numberOfAdults--;
      this.availabilityForm.get('numberOfAdults')?.setValue(this.numberOfAdults);
    }
    if (type === 'children' && this.numberOfChildren > 0) {
      this.numberOfChildren--;
      this.availabilityForm.get('numberOfChildren')?.setValue(this.numberOfChildren);
    }
  }


  getPersonLabel(): string {
    return `${this.numberOfAdults} Adulți, ${this.numberOfChildren} Copii`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.personGroupRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showPopUp = false;
    }
  }

}

