import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { CreateGiftComponent } from '../create-gift/create-gift.component'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor( public dialog:MatDialog){}
  openCreateGift(){
this.dialog.open(CreateGiftComponent , {
  height: '370px',
  width: '300px',
})
  }

}
