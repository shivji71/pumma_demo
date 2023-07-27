import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonService } from 'src/Services/common.service';
import { Constants } from 'src/app/config/constant';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  @Input() userDetails;
  @Output() deletedUser = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Pagination properties
  totalItems: number;
  pageSize: number;
  pageIndex: number;
  displayedColumns: string[] = ['User ID', 'Username', 'First Name', 'Last Name', 'Email ID', 'Edit', 'Delete'];

  

  constructor(private router: Router, private cs: CommonService, private toastr: ToastrService) { }

  ngOnInit() {
    // Initialize pagination properties
    this.totalItems = this.userDetails.length;
    this.pageSize = 5;
    this.pageIndex = 0;
  }


  // method for search user from table by User ID
  getUserById(event: any) {
    if (event?.target?.value) {
      this.cs.get(`${Constants.getAllUsers}${event.target.value}`).pipe(
        tap({
          next: (res) => {
            this.userDetails = res;
          },
          error: (err) => {
            this.toastr.error('', err.error.Message, { timeOut: 3000 });
          }
        })
      ).subscribe();
    } else {
      this.cs.get(`${Constants.getAllUsers}${0}`).pipe(
        tap({
          next: (res) => {
            this.userDetails = res;
          },
          error: (err) => {
            this.toastr.error('', err.error.Message, { timeOut: 3000 });
          }
        })
      ).subscribe();

    }

  }

  // method for handle edit button event in user details table
  updateUser(user: any) {
    // this.cs.updateUserData.next(user);
    this.cs.userData = user;
    this.cs.userData['queryType'] = 'UPDATE';
    this.router.navigate(['register']);
  }

 
  // method for handle delete event in user details table
  deleteUser(user_id: any) {
    const loginUser_id=JSON.parse(localStorage.getItem("loginDetails")).user_id;
    this.cs.get(`${Constants.deleteUser}${user_id}&deletedby=${loginUser_id}`).pipe(
      tap({
        next: (res: any) => {
          if (res.status) {
            this.deletedUser.emit('DELETE');
            this.toastr.success('', res.message, { timeOut: 3000 });
            if(user_id == JSON.parse(localStorage.getItem('loginDetails')).user_id){
              this.router.navigate(['login']);
            }
          } else {
            this.toastr.error('', 'User Not Found', { timeOut: 3000 });
          }
        },
        error: (err) => {
          this.toastr.error('', err.error.Message, { timeOut: 3000 });
        }
      })
    ).subscribe();
  }

  

  // methods and property to handling pagination on the table
  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }
  get paginatedUserDetails(): any[] {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.userDetails.slice(startIndex, endIndex);
  }

    
}
