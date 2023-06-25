import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-create-gift',
  templateUrl: './create-gift.component.html',
  styleUrls: ['./create-gift.component.css']
})
export class CreateGiftComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateGiftComponent>){

  }

  giftList:any=[] //change type any to data type

  formData = new FormGroup({
    giftName: new FormControl('',Validators.required),
    giftLink: new FormControl('',Validators.required),
    imageLink:new FormControl('',Validators.required)
  });
ngOnInit(){
  const url = 'https://www.alza.cz/hracky/speedy-car-d6776060.htm?o=1';

// Fetch the webpage HTML using the Fetch API
fetch(url)
  .then(response => response.text())
  .then(html => {

    // Create a new DOM element and set its innerHTML to the webpage HTML
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(html, 'text/html');

    // Get all the image elements on the page
    const images = doc.getElementsByTagName('img');

    // Loop through each image element and get the URL of the image
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i].src;
      console.log("myUrl",imageUrl);
    }
  })
  .catch(error => console.log(error));
}

  onSubmit(){

    if(this.formData.invalid)
    return
    
    this.dialogRef.close(this.formData.value)
  
   this.formData.reset()
   
  }

  close() {

    
    this.dialogRef.close(undefined);
  }
  
}

export function openUserFormDialog(dialog: MatDialog) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width="400px";
 // config.height="650px";
  const dialogRef = dialog.open(CreateGiftComponent, config);
  return dialogRef.afterClosed();
}
