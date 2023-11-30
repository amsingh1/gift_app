import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { openUserFormDialog } from '../create-gift/create-gift.component';
import { AuthService } from '../services/auth.service';
import {DeleteConfirmDialogComponent} from '../delete-confirm-dialog/delete-confirm-dialog.component'
@Component({
  selector: 'app-giftcard',
  templateUrl: './giftcard.component.html',
  styleUrls: ['./giftcard.component.css']
})
export class GiftcardComponent implements OnInit {
@Input() listOfGift:any=[]

  constructor(private dialog: MatDialog,private authservice:AuthService){

  }

  ngOnInit(){
  

  
console.log("gifts:",this.listOfGift)
   
   }

  

 openDeleteConfirm(deleteId:any,giftName:any){
  this.dialog.open(DeleteConfirmDialogComponent,{
    data:{deleteId,giftName },
    height: '80px'
  })
}
   
}
