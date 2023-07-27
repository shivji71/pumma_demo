import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from 'src/Services/common.service';
import { Constants } from 'src/app/config/constant';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!: FormGroup
  loginModel: any;

  constructor(private fb: FormBuilder, private router: Router, private cs : CommonService,private toastr: ToastrService) { }

  ngOnInit() {
    // localStorage user authentication 
    localStorage.setItem("isLoggedIn","false");
    localStorage.removeItem("userDetails");

    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  // define method for login user 
  login() {
    this.loginModel = {
      lud_user_username: this.loginForm.controls['userName'].value,
      lud_user_password: this.loginForm.controls['password'].value
    };
    console.log("Login Model :-- ", this.loginModel);
    
    this.cs.post(Constants.loginUser, this.loginModel).pipe(
      tap({
        next: (res:any) => {
          if(res.status){
            this.cs.welcomeData = res;

            // save user login details to local storage 
            let saveLogin = {
              username: this.loginModel.lud_user_username,
              password: this.loginModel.lud_user_password,
              user_id: res.lud_user_id
            };
            localStorage.setItem("isLoggedIn","true");
            localStorage.setItem("loginDetails",JSON.stringify(saveLogin));

            this.toastr.success(this.loginModel.lud_user_username, 'LogIn Successfully', { timeOut: 3000 });
            this.router.navigate(['home']);
          }else{
            this.toastr.error('', res.message, { timeOut: 3000 });
          }
         
        },
        error: (err) => {
          this.toastr.error('', err.error.Message, { timeOut: 3000 });
        }
      })
    ).subscribe();
  }

  // method for navigate to register page
  register() {
    this.router.navigate(['register']);
  }
}
