import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PAGE_NOT_FOUND } from 'src/app/constants/constants';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component {

  errorIMG:string = PAGE_NOT_FOUND;
  constructor(private router: Router){

  }

  volver(){
    this.router.navigate(['/Home']);
  }

}
