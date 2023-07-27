import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonService } from 'src/Services/common.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  @Input() userDetail:any;
  addressDetails:any;
  contactDetails:any;
 

  constructor(private cs : CommonService, private cdr : ChangeDetectorRef){
  }

  ngOnInit(){

    // rendering welcome table data 
    this.addressDetails = [
      { header: 'Address Line', column1: this.userDetail?.lud_user_street_add1},
      { header: 'City', column1: this.userDetail?.lud_user_city},
      { header: 'State', column1: this.userDetail?.lud_user_state},
      { header: 'Zip Code', column1: this.userDetail?.lud_user_zipcode}
      // Add more data rows as needed
    ];
    this.contactDetails = [
      { header: 'Primary Phone No', column1: this.userDetail?.lud_user_primary_phoneno},
      { header: 'Alternate Phone No', column1: this.userDetail?.lud_user_primary_alteno},
      { header: 'Fax', column1: this.userDetail?.lud_user_faxno},
      { header: 'Email ID', column1: this.userDetail?.lud_user_email}
      // Add more data rows as needed
    ];
  }

  ngAfterVIewInit(){
  }
}
