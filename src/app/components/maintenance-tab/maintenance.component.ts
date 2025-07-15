import { Component } from '@angular/core';
import {Services} from '../../services/services';
import {UserModel} from '../../models/user.model';
import {ReservationModel} from "../../models/reservation.model";

@Component({
  selector: 'app-maintenance',
  standalone: false,
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent{
  users: UserModel[] = [];
  reservations: ReservationModel[] = [];

  constructor(private service:Services){
  }

  ngOnInit(){
    this.getUsers()
    this.getAllReservations()
  }

  getUsers(){
    this.service.getUsers().subscribe({
     next: (users:UserModel[])=> {
        console.log("Users:", users);
        this.users = users;
      },
      error: error => {
      console.error('Eroare la obținerea utilizatorilor:', error);
    }
    })
  }

  updateUserRole(user: UserModel) {
    this.service.updateUserRole(user.id, user.role).subscribe({
      next:(response) => {
        console.log('Rol actualizat cu succes:', response);
        alert('Rolul a fost actualizat cu succes!');
        this.getUsers();
      },
      error: error => {
        console.error('Eroare la actualizarea rolului:', error);
        alert('A apărut o eroare la actualizarea rolului.');
      }}
    );
  }

  updateReservationCI(reservation: ReservationModel):void{
    const now = new Date();
    reservation.checkedInAt = now.toISOString();
    this.service.updateReservation(reservation.id, reservation).subscribe({
      next:(response) => {
        console.log('Actualizat cu succes:', response);
      },
      error: error => {
        console.error('Eroare la actualizare:', error);
        alert('A apărut o eroare la actualizare.');
      }})
  }

  updateReservationCO(reservation: ReservationModel):void {
    const now = new Date();
    reservation.checkedOutAt = now.toISOString();
    this.service.updateReservation(reservation.id, reservation).subscribe({
     next: (response) => {
        console.log('Actualizat cu succes:', response);
      },
      error:error => {
        console.error('Eroare la actualizare:', error);
        alert('A apărut o eroare la actualizare.');
      }}
    )
  }

  getAllReservations():void{
    this.service.getAllReservations().subscribe({
      next:(reservations: ReservationModel[]) => {
          console.log('Rezervările:', reservations);
          this.reservations = reservations
        },
        error:error => {
          console.error('Eroare la obținerea rezervărilor:', error);
        }})
  }
}
