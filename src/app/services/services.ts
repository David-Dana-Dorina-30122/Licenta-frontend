import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import { ReservationModel } from '../models/reservation.model';
import {RoomModel} from '../models/room.model';
import {jwtDecode} from 'jwt-decode';
import {AddressModel} from '../models/address.model';
import {UserModel} from '../models/user.model';
import {RoleUpdateRequest} from '../models/roleUpdate';
import {ReviewModel} from '../models/reviewModel';
import {RestaurantItemModel} from "../models/restaurant.model";

@Injectable({
  providedIn: 'root',
})
export class Services {
  private apiUrl = 'http://https://licenta-backend-production-d411.up.railway.app';
  private apiUrl2 = 'https://licenta-backend-production-d411.up.railway.app/reservations';

  constructor(private http: HttpClient) {}

  list: ReservationModel[] = [];
  role: string | null = '';
  data: string = '';

  storeToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      console.log('Token retrieved from localStorage:', token);
      return token;
    }
    return null;
  }

  register(email: string, password: string, firstName: string, lastName: string, phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, { email, password, firstName, lastName, phone });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response: any) => {
        this.storeToken(response.token);
      })
    );
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify`, {
      email,
      verificationCode: code
    }, { responseType: 'text' as 'json' });
  }


  resendCode(email: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/resend`,
      { email }, // body conține cheia "email"
      { responseType: 'text' as 'json' }
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email }, { responseType: 'text' as 'json' });
  }

  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, data, { responseType: 'text' as 'json' });
  }

  logout() {
    localStorage.removeItem('authToken');
  }


// RESERVATIONS
  createReservation(reservationDTO: ReservationModel): Observable<any> {
    const token = this.getToken()
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<ReservationModel>(`${this.apiUrl2}/create`, reservationDTO, {headers});
    }
    else throw new Error('Token-ul nu este disponibil!');
  }

  deleteReservation(id: number): Observable<any> {

    const token = this.getToken()
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.apiUrl}/reservations/${id}`)
    }
    else throw new Error('Token-ul nu este disponibil!');
  }

  getUserReservations(): Observable<ReservationModel[]> {
    const token = this.getToken()
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<ReservationModel[]>(`${this.apiUrl2}/my`, {headers});
    }
    else throw new Error('Token-ul nu este disponibil!');
  }

  getAllReservations(): Observable<ReservationModel[]>{
    const token = this.getToken()
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<ReservationModel[]>(`${this.apiUrl2}/findAll`, {headers});
    }
    else throw new Error('Token-ul nu este disponibil!');
  }

  updateReservation(id:number, reservation:ReservationModel):Observable<any>{
    const token = this.getToken()
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/reservations/${id}`,reservation,{headers})
  }

  // ROOM
  createRoom(room: RoomModel): Observable<any>{
    const token = this.getToken()
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<RoomModel>(`${this.apiUrl}/rooms/create`,room, {headers});
    }
    else throw new Error('Token-ul nu este disponibil!');
  }

  addImages(id:number,images: string[]):Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/rooms/${id}/add-images`,images,{headers})
  }

  deleteRoom(id: number):Observable<any>{
    const token = this.getToken()
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.apiUrl}/rooms/${id}`)
    }
    else throw new Error('Token-ul nu este disponibil!');
  }

  getRooms(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/rooms`);
  }

  getRoomById(id : number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/rooms/${id}`);
  }

// USER
  getCurrentUser(): Observable<any>{
    const token = this.getToken()
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/users/me`, {headers})
  }
  updateUser(user: UserModel): Observable<any>{
    const token = this.getToken()
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/users/me`,user,{headers})
  }

  getUsers(): Observable<any>{
    const token = this.getToken()
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/users/`, {headers})
  }
  updateUserRole(userId: number, newRole: string) {
    const token = this.getToken()
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/users/role/${userId}?role=${newRole}`, null, { headers });
  }


  getUserAddress(): Observable<AddressModel | null> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<AddressModel>(`${this.apiUrl}/addresses/me`, { headers });
  }

  addAddress(address: AddressModel): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/addresses/add`, address, { headers });
  }

  updateUserAddress(address: AddressModel): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/addresses/update`, address, { headers });
  }


  //

  decodeToken(token: string): any {
    return jwtDecode(token);
  }

  getRole():any{
    const token = this.getToken();
    if (token) {
      const data = this.decodeToken(token);
      console.log("Token decodat:", data);
      this.role = data.role;
      console.log("Rolul utilizatorului este:", this.role);
    }
    return this.role;
  }

  getUserData():any{
    const token = this.getToken();
    if (token) {
      this.data = this.decodeToken(token);
      console.log("Token decodat:", this.data);
    }
    return this.data
  }

  getReservationQRCode(id: number): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
    return this.http.get(`${this.apiUrl}/reservations/${id}/qr`, {
      headers,
      responseType: 'blob'
    }).pipe(
      map(blob => URL.createObjectURL(blob))
    );
  }

  getReviewsByReservation(reservationId: number): Observable<ReviewModel[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ReviewModel[]>(`http://localhost:8082/reviews/by-reservation/${reservationId}`, {headers});
  }

  addReview(review: ReviewModel): Observable<ReviewModel> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ReviewModel>(`http://localhost:8082/reviews`, review, {headers});
  }

  getMyRooms(): Observable<RoomModel[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<RoomModel[]>('http://localhost:8082/reviews/my-rooms',{headers});
  }

  getAllItems(): Observable<RestaurantItemModel[]> {
    return this.http.get<RestaurantItemModel[]>(`${this.apiUrl}/restaurants/`);
  }

  addItem(item: RestaurantItemModel): Observable<RestaurantItemModel> {
    return this.http.post<RestaurantItemModel>(`${this.apiUrl}/restaurants/addFood`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/restaurants/${id}`);
  }
}
