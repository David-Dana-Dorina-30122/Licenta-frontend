import { Component } from '@angular/core';
import {Services} from '../../services/services';
import {UserModel} from '../../models/user.model';
import {Router} from '@angular/router';
import {ReservationModel} from "../../models/reservation.model";
import {timestamp} from 'rxjs';

@Component({
  selector: 'app-maintenance',
  standalone: false,
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent {
  users: UserModel[] = [];
  reservations: ReservationModel[] = [];
  userRoles: string[] = ['STAFF','USER'];

  constructor(private service:Services, private router:Router){
  }

  ngOnInit(){
    //this.checkToken()
    this.getUsers()
    this.getAllReservations()
  }

  checkToken(){
    if(!this.service.getToken()){
      // this.service.logout();
      // this.router.navigate(['/login']);
    }
  }

  getUsers(){
    this.service.getUsers().subscribe(
      (users:UserModel[])=> {
        console.log("Users:", users);
        this.users = users;
      },
      (error) => {
      console.error('Eroare la obținerea utilizatorilor:', error);
        this.checkToken();
    }
  )
  }

  updateUserRole(user: UserModel) {
    this.service.updateUserRole(user.id, user.role).subscribe(
      (response) => {
        console.log('Rol actualizat cu succes:', response);
        alert('Rolul a fost actualizat cu succes!');
        this.getUsers();
      },
      (error) => {
        console.error('Eroare la actualizarea rolului:', error);
        alert('A apărut o eroare la actualizarea rolului.');
      }
    );
  }
  // updateUser(user: UserModel):void{
  //   this.service.updateUser(user.id, user).subscribe(
  //     (response) => {
  //       console.log('Actualizat cu succes:', response);
  //     },
  //     (error) => {
  //       console.error('Eroare la actualizare:', error);
  //       alert('A apărut o eroare la actualizare.');
  //     }
  //   );
  // }

  updateReservationCI(reservation: ReservationModel):void{
    const now = new Date();
    reservation.checkedInAt = now.toISOString();
    this.service.updateReservation(reservation.id, reservation).subscribe(
      (response) => {
        console.log('Actualizat cu succes:', response);
      },
      (error) => {
        console.error('Eroare la actualizare:', error);
        alert('A apărut o eroare la actualizare.');
      }
    )
  }

  updateReservationCO(reservation: ReservationModel):void{
    const now = new Date();
    reservation.checkedOutAt = now.toISOString();
    this.service.updateReservation(reservation.id, reservation).subscribe(
      (response) => {
        console.log('Actualizat cu succes:', response);
      },
      (error) => {
        console.error('Eroare la actualizare:', error);
        alert('A apărut o eroare la actualizare.');
      }
    )
  }

  getAllReservations():void{
    this.service.getAllReservations().subscribe( (reservations: ReservationModel[]) => {
          console.log('Rezervările:', reservations);
          this.reservations = reservations
        },
        (error) => {
          console.error('Eroare la obținerea rezervărilor:', error);
        })
  }
}
