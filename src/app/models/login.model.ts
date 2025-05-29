export interface LoginModel {
  userId?: number;
  email: string;
  password: string;
  role?: string;
  result?: boolean;
  message?: string;
}
