import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Constants } from '../../config/constant';
import { CommonService } from 'src/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { passwordMatchValidator } from './password-mach';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  registerModel: any;
  isConfirmedPass: boolean = false;
  citiesAndStateArr: any;
  editUser: boolean = true;

  selectedCar: any;

  @ViewChild('myFormControl') myFormControl: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private cs: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      streetAddress1: ['', Validators.required],
      streetAddress2: [''],
      zipCode: ['', [Validators.required, Validators.maxLength(5)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      primaryPhoneNo: ['', [Validators.pattern('^[0-9]{10}$')]],
      alternatePhoneNo: ['', [Validators.pattern('^[0-9]{10}$')]],
      fax: [''],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}'
          ),
        ],
      ],
      rePassword: ['', [Validators.required]],
    });

    if (this.cs.userData) {
      this.registerForm.get('userName').disable();
      let userData = this.cs.userData;
      let event = {
        target: {
          value: userData.lud_user_zipcode,
        },
      };
      this.getCitiesAndStateByZip(event);

      this.registerForm.controls['firstName'].patchValue(
        userData.lud_user_firstname
      );
      this.registerForm.controls['lastName'].patchValue(
        userData.lud_user_lastname
      );
      this.registerForm.controls['streetAddress1'].patchValue(
        userData.lud_user_street_add1
      );
      this.registerForm.controls['streetAddress2'].patchValue(
        userData.lud_user_street_add2
      );
      this.registerForm.controls['zipCode'].patchValue(
        userData.lud_user_zipcode
      );
      this.registerForm.controls['city'].patchValue(userData.lud_user_city);
      this.registerForm.controls['state'].patchValue(userData.lud_user_state);
      this.registerForm.controls['primaryPhoneNo'].patchValue(
        userData.lud_user_primary_phoneno
      );
      this.registerForm.controls['alternatePhoneNo'].patchValue(
        userData.lud_user_primary_alteno
      );
      this.registerForm.controls['fax'].patchValue(userData.lud_user_faxno);
      this.registerForm.controls['email'].patchValue(userData.lud_user_email);
      this.registerForm.controls['userName'].patchValue(
        userData.lud_user_username
      );
      this.registerForm.controls['password'].patchValue(
        userData.lud_user_password
      );
      this.registerForm.controls['rePassword'].patchValue(
        userData.lud_user_re_password
      );
    } else {
      this.registerForm.get('userName').enable();
    }
  }

  // method for maching password 
  machPass(group: FormGroup) {
    if (
      group.controls['password'].value == group.controls['rePassword'].value
    ) {
      this.isConfirmedPass = false;
      const nameControl = this.registerForm.get('rePassword');
      nameControl.setErrors(null);
    } else {
      this.isConfirmedPass = true;
      const nameControl = this.registerForm.get('rePassword');
      nameControl.setErrors({ customError: true });
    }
    this.cdr.detectChanges();
  }

  // method for create a new user and update existing user
  onSubmit() {
    this.registerModel = {
      lud_user_firstname: this.registerForm.controls['firstName'].value,
      lud_user_lastname: this.registerForm.controls['lastName'].value,
      lud_user_street_add1: this.registerForm.controls['streetAddress1'].value,
      lud_user_street_add2: this.registerForm.controls['streetAddress2'].value
        ? this.registerForm.controls['streetAddress2'].value
        : '',
      lud_user_zipcode: this.registerForm.controls['zipCode'].value,
      lud_user_city: this.registerForm.controls['city'].value,
      lud_user_state: this.registerForm.controls['state'].value,
      lud_user_primary_phoneno: this.registerForm.controls['primaryPhoneNo']
        .value
        ? this.registerForm.controls['primaryPhoneNo'].value
        : '',
      lud_user_primary_alteno: this.registerForm.controls['alternatePhoneNo']
        .value
        ? this.registerForm.controls['alternatePhoneNo'].value
        : '',
      lud_user_faxno: this.registerForm.controls['fax'].value
        ? this.registerForm.controls['fax'].value
        : '',
      lud_user_email: this.registerForm.controls['email'].value,
      lud_user_username: this.registerForm.controls['userName'].value,
      lud_user_password: this.registerForm.controls['password'].value,
      lud_user_re_password: this.registerForm.controls['rePassword'].value,
    };
    console.log('Register Model :-- ', this.registerModel);

    if (this.cs?.userData?.queryType == 'UPDATE') {
      // get user login details from local storage
      const loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
      this.registerModel['lud_user_id'] = this.cs?.userData?.lud_user_id;
      this.registerModel['login_user_id'] = loginDetails?.user_id
        ? loginDetails.user_id
        : null;
      this.cs
        .post(Constants.editUser, this.registerModel)
        .pipe(
          tap({
            next: (res) => {
              this.toastr.success('', 'User Updated Successfully', {
                timeOut: 3000,
              });
              this.router.navigate(['home']);
            },
            error: (err) => {
              this.toastr.error('', err.error.Message, { timeOut: 3000 });
            },
          })
        )
        .subscribe();
    } else {
      this.cs
        .post(Constants.registerNewUser, this.registerModel)
        .pipe(
          tap({
            next: (res: any) => {
              if (res.status) {
                this.cs.welcomeData = this.registerModel;
                this.toastr.success('', 'User Registered Succesfully', {
                  timeOut: 3000,
                });
                this.router.navigate(['']);
              }
            },
            error: (err) => {
              this.toastr.error('', err.error.Message, { timeOut: 3000 });
            },
          })
        )
        .subscribe();
    }
  }

  // method for redirect to login page
  onCancel() {
    if (this.cs?.userData?.queryType == 'UPDATE') {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['']);
    }
  }

  // method for get all cities and state by zip code
  getCitiesAndStateByZip(event) {
    if (event.target.value && event.target.value.length == 5) {
      this.cs
        .get(`${Constants.getCitiesAndStateByZip}${event.target.value}`)
        .subscribe((res: any) => {
          console.log(res.length);
          if (res.length) {
            this.citiesAndStateArr = res;
            this.registerForm.controls['state'].patchValue(
              this.citiesAndStateArr[0]['mscz_state_city_statename']
            );
            const state = this.registerForm.get('state');
            state.setErrors(null);
            const city = this.registerForm.get('city');
            city.setErrors(null);
          } else {
            this.citiesAndStateArr = [];
            this.registerForm.controls['state'].patchValue('');
          }
        });
    } else {
      this.citiesAndStateArr = [];
      this.registerForm.controls['state'].patchValue('');
      this.registerForm.controls['city'].patchValue('');
      const state = this.registerForm.get('state');
      state.setErrors({ customError: true });
      const city = this.registerForm.get('city');
      city.setErrors({ customError: true });
    }
  }
  
  onSelectCities() {}
}
