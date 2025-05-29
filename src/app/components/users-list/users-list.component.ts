import { Component } from '@angular/core';
import {Services} from '../../services/services';
import {UserModel} from '../../models/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  users: UserModel[] = [];
  userRoles: string[] = ['ADMIN','USER'];

  constructor(private service:Services, private router:Router){
  }

  ngOnInit(){
    //this.checkToken()
    this.getUsers()
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

}
