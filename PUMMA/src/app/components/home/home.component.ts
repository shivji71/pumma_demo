import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { CommonService } from 'src/Services/common.service';
import { Constants } from 'src/app/config/constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  isWelcome:boolean = false;
  isUserDetails:boolean = false;
  isLogout:boolean = false;
  userDetail: any;
  allUsersList:any;

  constructor(private router:Router, private cs : CommonService,private toastr : ToastrService){
  }

  ngOnInit(){
    // welcome user details 
    if(this.cs.welcomeData){
      this.userDetail = this.cs.welcomeData;
      this.userDetail.lud_user_street_add1 = this.userDetail.lud_user_street_add1 + (!this.userDetail.lud_user_street_add2 ? '':this.userDetail.lud_user_street_add2)
      this.onWelcome();
    }

    if(this.cs?.userData?.queryType){
      this.onUserDetails();
    }
  }

  onDeleteUser(event){
    if(event){
      this.onUserDetails();
    }

  }

  // method for redirect to welcome page
  onWelcome(){
    this.isWelcome = true;
    this.isUserDetails = false;
    this.isLogout = false;
  }

  // method for redirect user details page
  onUserDetails(){
    this.cs.get(`${Constants.getAllUsers}${0}`).pipe(
      tap({
        next: (res) => {
          this.allUsersList = res;
          this.isUserDetails = true;
          this.isWelcome = false;
          this.isLogout = false;
        },
        error: (err) => {
          this.toastr.error('', err.message, { timeOut: 3000 });
        }
      })
    ).subscribe();
  }

  // method for logout the user and redirect to login page
  onLogout(){
    this.isLogout = true;
    this.isWelcome = false;
    this.isUserDetails = false;
    this.cs.userData = '';
    localStorage.removeItem("loginDetails");
    this.router.navigate(['']);
  }

}
