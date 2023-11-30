import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.css']
})
export class DeleteConfirmDialogComponent {
constructor(private dialog:MatDialog, private authservice:AuthService, @Inject(MAT_DIALOG_DATA) public data: any){
}
deleteGiftName:String=this.data.giftName

deleteGift(){
  console.log('delete gift working')
  
  this.authservice.deleteGift(this.data.deleteId).subscribe({next :(res: any) => { 
    console.log(res.message)
    location.reload()
    },error:(error)=>{
    
    console.log("myerror",error.error)}})
 }
}
