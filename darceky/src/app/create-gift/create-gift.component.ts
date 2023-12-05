import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {GiftCardDataService} from '../services/gift-card-data.service'
@Component({
  selector: 'app-create-gift',
  templateUrl: './create-gift.component.html',
  styleUrls: ['./create-gift.component.css']
})
export class CreateGiftComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateGiftComponent>, private giftCardData : GiftCardDataService){

  }

  giftList:any=[] //change type any to data type

  formData = new FormGroup({
    giftName: new FormControl('',Validators.required),
    giftLink: new FormControl('',Validators.required),
    imageLink:new FormControl('')
  });


ngOnInit(){
 
}

  onSubmit(){

    if(this.formData.invalid)
    return
    this.giftCardData.sendGiftData(this.formData.value).subscribe({next :(res: any) => { 
      console.log(res.message,"gift list", res)
      this.dialogRef.close(res.gift)


      },error:(error)=>{
      
      console.log("myerror",error.error)}} )
    this.dialogRef.close(this.formData.value)
    
  //console.log("giftdata",this.formData.value)
   this.formData.reset()
   //location.reload();
  }



  close() {

    
    this.dialogRef.close();
  }
  
}

export function openUserFormDialog(dialog: MatDialog) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width="300px";
 // config.height="650px";
  const dialogRef = dialog.open(CreateGiftComponent, config);
  return dialogRef.afterClosed();
}
