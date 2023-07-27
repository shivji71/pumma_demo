import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonService } from 'src/Services/common.service';
import { RegisterComponent } from './components/register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pumma';

  constructor(private viewContainerRef: ViewContainerRef, private cs : CommonService){}

  ngOnInit(){}

  // render dynamic component
  // renderDynamicComponent() {
  //   this.cs.setContainer(this.viewContainerRef);

  //   this.cs.renderComponent(RegisterComponent);
  // }

}
