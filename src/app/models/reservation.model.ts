import { ReservationStatus } from './reservationStatus.model';
import {Room, RoomModel} from './room.model';

export class ReservationModel {
  id!:number;
  roomId!: number;
  dataCheckIn!: string;
  dataCheckOut!: string;
  numberOfAdults!: number;
  numberOfChildren!: number;
  numberOfPeople!: number;
  totalCost!: number;
  room?: RoomModel;
  meals?: boolean;
  spa?: boolean;
  status!: ReservationStatus
}

