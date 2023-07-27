import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  const passwordControl = formGroup.get('password');
  const confirmPasswordControl = formGroup.get('rePassword');

  if (passwordControl.value !== confirmPasswordControl.value) {
    return { passwordMismatch: true };
  }

  return null;
};