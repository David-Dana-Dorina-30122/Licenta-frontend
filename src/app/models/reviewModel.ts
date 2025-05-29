export interface ReviewModel {
  id?: number;
  reservationId: number;
  rating: number; // 1 - 5
  comment: string;
  createdAt?: Date;
}
