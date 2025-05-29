import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReservationListComponent} from './components/reservation-list/reservation-list.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {LoginComponent} from './components/login/login.component';
import {MyAccountComponent} from './components/my-account/my-account.component';
import {ReservationCreateComponent} from './components/reservation-create/reservation-create.component';
import {AvailabilityComponent} from './components/availability/availability.component';
import {RoomsListComponent} from './components/rooms-list/rooms-list.component';
import {RoomCreateComponent} from './components/room-create/room-create.component';
import {UsersListComponent} from './components/users-list/users-list.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {RoomDetailsComponent} from './components/room-details/room-details.component';
import {ReviewsComponent} from './components/reviews/reviews.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'reservations', component: ReservationListComponent },
  { path: 'myAccount', component: MyAccountComponent },
  { path: 'createReservation', component: ReservationCreateComponent },
  { path: 'availability', component: AvailabilityComponent },
  { path: 'rooms', component: RoomsListComponent},
  { path: 'createRoom', component: RoomCreateComponent},
  { path: 'users', component: UsersListComponent},
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'room-details/:id',component: RoomDetailsComponent},
  { path: 'reviews', component: ReviewsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
