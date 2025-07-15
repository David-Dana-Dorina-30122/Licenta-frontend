import { ReservationStatus } from './reservationStatus.model';
import {RoomModel} from './room.model';
import {UserModel} from "./user.model";

export class ReservationModel {
  id!:number;
  roomId!: number;
  dataCheckIn!: string;
  dataCheckOut!: string;
  checkedInAt!: string;
  checkedOutAt!:string;
  numberOfAdults!: number;
  numberOfChildren!: number;
  numberOfPeople!: number;
  totalCost!: number;
  room?: RoomModel;
  user?: UserModel;
  meals?: boolean;
  spa?: boolean;
  status?: ReservationStatus;
  createdAt!: string;
}

