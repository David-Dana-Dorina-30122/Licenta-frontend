import { Component } from '@angular/core';
import {Services} from '../../services/services';
import {RoomModel} from '../../models/room.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-rooms-list',
  standalone: false,
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css'
})
export class RoomsListComponent {
  rooms: RoomModel[] = [];
  role: string | null = '';

  constructor(private service: Services,private router: Router) {}

  ngOnInit(){
    this.loadRooms()
    this.getRole()
  //  this.checkToken()
  }

  checkToken(){
    if(!this.service.getToken()){
      this.service.logout();
      this.router.navigate(['/login']);

    }
  }

  loadRooms(){
      this.service.getRooms().subscribe(
        (rooms: RoomModel[])=>  {
          console.log('Camerele:', rooms);
          this.rooms = rooms;
        },
        (error) => {
          console.error('Eroare la obținerea camerelor:', error);
        }
      );
  }

  deleteRoom(id: number): void {
    if (confirm('Sigur vrei să ștergi această cameră?')) {
      this.service.deleteRoom(id).subscribe(() => {
        this.rooms = this.rooms.filter(room => room.id !== id);
      });
    }
  }

  getRole():void{
    this.role = this.service.getRole();
  }
}
