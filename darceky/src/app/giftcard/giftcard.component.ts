import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { openUserFormDialog } from '../create-gift/create-gift.component';

@Component({
  selector: 'app-giftcard',
  templateUrl: './giftcard.component.html',
  styleUrls: ['./giftcard.component.css']
})
export class GiftcardComponent implements OnInit {
@Input() listOfGift:any=[]

  constructor(private dialog: MatDialog){

  }

  ngOnInit(){
  

  
console.log("gifts:",this.listOfGift)
   
   }

  
 

   
}
