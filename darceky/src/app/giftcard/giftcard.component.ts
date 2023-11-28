import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { openUserFormDialog } from '../create-gift/create-gift.component';
import { AuthService } from '../services/auth.service';
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

  
 deleteGift(id:any){
  console.log(id)
  this.authservice.deleteGift(id).subscribe({next :(res: any) => { 
    console.log(res.message)
    location.reload()
    },error:(error)=>{
    
    console.log("myerror",error.error)}})
 }

   
}
