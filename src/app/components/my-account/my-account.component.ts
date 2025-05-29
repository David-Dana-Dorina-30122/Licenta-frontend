import {Component, Input} from '@angular/core';
import {Services} from '../../services/services';
import {Router} from '@angular/router';
import {Address} from 'node:cluster';
import {AddressModel} from '../../models/address.model';
import {UserModel} from '../../models/user.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
  standalone: false
})
export class MyAccountComponent {

  address: AddressModel = { id: 0 ,street: '', city: '', country: '' };
  newAddress: AddressModel = { id: 0 ,street: '', city: '', country: '' };

  users: UserModel[] = [];
  hasAddress = false;
  userForm!: FormGroup;
  selectedTab: 'details' | 'reservations' = 'details';
  verificationCode: string = '';
  email: string = '';
  user : any ={}
  enabled: boolean = false;


  constructor(private services: Services, private router: Router,private fb: FormBuilder) {
  }

  ngOnInit() {
    this.getData();

    // this.checkToken();
    this.loadAddress();
    this.getCurrentUser();

    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      password: [''],
      verificationCode:['']
     // enabled:['']
    });

    this.services.getCurrentUser().subscribe(user => {
      this.userForm.patchValue(user);
    });
  }

  getCurrentUser() {
    this.services.getCurrentUser().subscribe((response) => {
      if (Array.isArray(response)) {
        this.users = response;
        this.user = response;
      } else if (response && typeof response === 'object') {
        this.users = [response];
      } else {
        this.users = [];
      }
    });
  }

  updateUser(): void {
    if (this.userForm.valid) {
      this.services.updateUser(this.userForm.value).subscribe(
        response => {
          console.log("User updated:", response);
        },
        error => {
          console.error("Error updating user:", error);
        }
      );
    }
  }

  loadAddress() {
    this.services.getUserAddress().subscribe(
      (data) => {
        console.log('Received address:', data);
        if (data && Array.isArray(data) && data.length > 0) {
          this.address = data[0];
          this.hasAddress = true;
        } else {
          this.hasAddress = false;
        }
      },
      (error) => {
        console.error('Eroare la încărcarea adresei:', error);
        this.hasAddress = false;
      }
    );
  }


  addNewAddress(): void {
    console.log("New address to add:", this.newAddress, typeof this.newAddress);
    this.services.addAddress(this.newAddress).subscribe(
      () => {
        this.loadAddress();
        this.newAddress = { id: 0, street: '', city: '', country: '' };
      },
      error => {
        console.error("Eroare la adăugarea adresei:", error);
      }
    );
  }


  updateAddress(): void {
    console.log("Tip address:", typeof this.address); // trebuie să fie "object"
    console.log("Este array?", Array.isArray(this.address)); // trebuie să fie false
    console.log("Address to update:", this.address);

    if (Array.isArray(this.address)) {
      console.error("Eroare: address este array. Se oprește update.");
      return;
    }

    this.services.updateUserAddress(this.address).subscribe({
      next: () => console.log('Adresă actualizată'),
      error: err => console.error('Eroare la actualizare adresă:', err)
    });
  }

  logout() {
    this.services.logout();
    this.router.navigate(['/home']);
  }

  verifyCode() {
    const email = this.user?.email || this.userForm.get('email')?.value;
    const code = this.userForm.get('verificationCode')?.value;

    if (!email || !code) {
      console.error("Email sau codul de verificare lipsesc.");
      return;
    }

    this.services.verifyCode(email, code).subscribe(
      (response) => {
        console.log('Cont verificat:', response);
        window.location.reload();
      },
      (error) => {
        console.error("Eroare la verificare:", error);
      }
    );
  }

  resendCode() {
    const email = this.user?.email || this.userForm.get('email')?.value;
    if (!email) {
      console.error("Email lipsă pentru retrimitere cod.");
      return;
    }

    this.services.resendCode(email).subscribe(
      (response) => {
        console.log('Cod retrimis', response);
      },
      (error) => {
        console.error("Eroare la retrimitere cod:", error);
      }
    );
  }


  checkToken(){
    if(!this.services.getToken()){
      this.services.logout();
      this.router.navigate(['/home']);
    }
  }


  getData() {
    const userData = this.services.getUserData();
    //console.log("date", userData);
    this.enabled = userData.enabled;
    console.log("enabled", this.enabled)
  }


}
