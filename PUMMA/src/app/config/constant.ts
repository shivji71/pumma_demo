import { Injectable } from '@angular/core'; 
@Injectable() 
export class Constants {
public static getCitiesAndStateByZip: string = 'http://localhost:65504/api/Get_Cities?zipcd='; 
public static registerNewUser: string = 'http://localhost:65504/api/save_user'; 
public static loginUser: string = 'http://localhost:65504/api/login_user';
public static getAllUsers: string = 'http://localhost:65504/api/Get_All_Users?user_id=';
public static editUser: string = 'http://localhost:65504/api/edit_user'; 
public static deleteUser: string = 'http://localhost:65504/api/delete_user?user_id=';  
}
