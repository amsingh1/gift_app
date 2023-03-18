import { Component } from '@angular/core';
import { FormControl,FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-create-gift',
  templateUrl: './create-gift.component.html',
  styleUrls: ['./create-gift.component.css']
})
export class CreateGiftComponent {

  constructor(private dialogRef: MatDialogRef<CreateGiftComponent>){

  }

  giftList:any=[] //change type any to data type

  formData = new FormGroup({
    giftName: new FormControl(''),
    giftLink: new FormControl(''),
    imageLink:new FormControl('')
  });


  onSubmit(){
    this.giftList.push(this.formData.value)
    this.dialogRef.close(this.giftList)
   console.log(this.formData.value) 
   this.formData.reset()
   
  }
}
