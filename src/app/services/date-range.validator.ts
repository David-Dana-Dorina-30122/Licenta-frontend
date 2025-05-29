import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (form: AbstractControl): { [key: string]: any } | null => {
    const checkIn = form.get('checkIn')?.value;
    const checkOut = form.get('checkOut')?.value;

    if (checkIn && checkOut && checkIn > checkOut) {
      return { invalidDateRange: true };
    }
    return null;
  };
}

export function dateNotBeforeTodayValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null; // dacă nu e valoare, nu invalidăm

  const selected = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // resetăm ora pentru comparație

  if (selected < today) {
    return { dateBeforeToday: true };
  }
  return null;
}
