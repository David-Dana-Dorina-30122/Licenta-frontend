import {importProvidersFrom, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import { AppComponent } from './app.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import {RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import {CommonModule, NgForOf} from '@angular/common';
import {HomePageComponent} from './components/home-page/home-page.component';
import {AppRoutingModule} from './app-routing.module';
import {UserNavComponent} from './components/user-nav/user-nav.component';
import {MyAccountComponent} from './components/my-account/my-account.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './components/login/login.component';
import {IonicModule} from '@ionic/angular';
import { ReservationCreateComponent } from './components/reservation-create/reservation-create.component';
import { AvailabilityComponent } from './components/availability/availability.component';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { RoomCreateComponent } from './components/room-create/room-create.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import {AuthInterceptor} from './services/jwt.interceptor';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RoomDetailsComponent } from './components/room-details/room-details.component';
import {LightboxModule} from 'ngx-lightbox';
import SwiperCore from 'swiper';
import { ReviewsComponent } from './components/reviews/reviews.component';

@NgModule({
  declarations: [
    AppComponent,
    ReservationListComponent,
    HomePageComponent,
    UserNavComponent,
    MyAccountComponent,
    LoginComponent,
    ReservationCreateComponent,
    AvailabilityComponent,
    RoomsListComponent,
    RoomCreateComponent,
    UsersListComponent,
    ResetPasswordComponent,
    RoomDetailsComponent,
    ReviewsComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi(),withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  imports: [
    BrowserModule,
    RouterLink,
    RouterOutlet,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    RouterLink,
    RouterOutlet,
    NgForOf,
    FormsModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    LightboxModule,
  ],
  bootstrap:[AppComponent]
})
export class AppModule {}
