import {AddressModel} from './address.model';

export class UserModel {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  password!: string;
  phone!: number;
  addressId!: number;
  role!: string;
  createdDate!: Date;
  enabled!: boolean;
  addresses!: AddressModel[];
}
