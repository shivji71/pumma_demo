import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from 'src/Services/common.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(CommonService);
  const router = inject(Router);
  if(localStorage.getItem("isLoggedIn") == "true"){
    return true;
  }else{
    // Redirect to the login page
    return router.parseUrl('');
  }
  
};
