import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { openUserFormDialog } from '../create-gift/create-gift.component';
import { AuthService } from '../services/auth.service';
import {DeleteConfirmDialogComponent} from '../delete-confirm-dialog/delete-confirm-dialog.component'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-giftcard',
  templateUrl: './giftcard.component.html',
  styleUrls: ['./giftcard.component.css']
})
export class GiftcardComponent implements OnInit {
@Input() listOfGift:any=[]

cols = 5;
  rowHeight = '150px';

  constructor(private dialog: MatDialog,private authservice:AuthService,private breakpointObserver: BreakpointObserver){

  }

  ngOnInit(){
console.log("gifts:",this.listOfGift)

this.responsiveDesign()

   }

   /* reserveGift(id:any){
    this.reserved = !this.reserved
    this.authservice.updateGiftReservedStatus(id,this.reserved).subscribe({next :(res: any) => { 
      console.log('reserverStatus', this.reserved)
       
      //location.reload()
      },error:(error)=>{
      
      console.log("myerror",error.error)}})
   } */
   reserveGift(id: any) {
    // Find the specific gift in the listOfGift array
    const giftToUpdate = this.listOfGift.find((gift: any) => gift.id === id);
  this
    // Toggle the reserved value for the specific gift
    if (giftToUpdate) {
      giftToUpdate.reserved = !giftToUpdate.reserved;
  
      // Update the reserved status in the backend
      this.authservice.updateGiftReservedStatus(id, giftToUpdate.reserved).subscribe({
        next: (res: any) => {
          console.log('reservedStatus', giftToUpdate.reserved);
          // location.reload(); // You might want to update the UI accordingly instead of reloading the page
        },
        error: (error) => {
          console.log('myerror', error.error);
        },
      });
    }
  }
  

 openDeleteConfirm(deleteId:any,giftName:any){
  this.dialog.open(DeleteConfirmDialogComponent,{
    data:{deleteId,giftName },
    height: '80px'
  })
}
   
responsiveDesign(){
  this.breakpointObserver
.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape,Breakpoints.TabletLandscape,Breakpoints.TabletPortrait])
.subscribe((result) => {
  this.cols = 3;
  this.rowHeight = '150px';
  const breakpoints = result.breakpoints;

  if (breakpoints[Breakpoints.HandsetPortrait]) {
    this.cols = 1;
  } else if (breakpoints[Breakpoints.HandsetLandscape]) {
    this.cols = 3;
  } else if (breakpoints[Breakpoints.TabletLandscape]) {
    this.cols = 4;
  }else if (breakpoints[Breakpoints.TabletPortrait]) {
    this.cols = 3;
  }else {
    this.cols=5
  }
});
}

 


  

}
