export class RoomModel {
  id!: number;
  number!: number;
  type!: string;
  description!: string;
  pricePerNight!: number;
  status!: string;
  capacity!: number;
  imageUrls!: string[];
  services!: string[];
}


export interface Room{
  id: number;
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
}
