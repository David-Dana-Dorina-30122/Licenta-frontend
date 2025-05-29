import { Component, OnInit } from '@angular/core';
import {Services} from '../../services/services';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css',
  standalone:false
})
export class UserNavComponent  {
  role: string | null = '';


  constructor(public service: Services) {}


  ngOnInit(): void {

   this.role = this.service.getRole();
  }

}
