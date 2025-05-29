import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Services} from './services/services';
import {response} from 'express';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'Frontend';
  showNavBar = true;

  constructor(private router: Router,private services:Services) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavBar = !this.router.url.includes('/login');
      }
    });
  }
}
