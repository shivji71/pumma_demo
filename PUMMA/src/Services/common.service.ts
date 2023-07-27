import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable, ComponentRef, ViewContainerRef } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public updateUserData = new Subject();
  public userData: any;
  public welcomeData: any;

  // define container and componentref for creating dynamic component without routing 
  private container: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  constructor(private http: HttpClient) {
  }
  
  // api implemetation
  public get(url: any) {
    return this.http.get(url);
  }
  public post(url: string, data: any, options?: any) {
    return this.http.post(url, data, options);
  }
  public put(url: string, data: any, options?: any) {
    return this.http.put(url, data, options);
  }
  public delete(url: string, options?: any) {
    return this.http.delete(url, options);
  }


  // method for rendering component dynamically without routing 

  setContainer(container: ViewContainerRef) {
    this.container = container;
  }

  renderComponent(component: any) {
    // Clear the container if it already has a component
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  
    // Create the component using the component factory
    this.componentRef = this.container.createComponent(component);
  }

}
