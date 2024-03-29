import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateGiftComponent, openUserFormDialog } from '../create-gift/create-gift.component'
import {GiftCardDataService} from '../services/gift-card-data.service'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor( public dialog:MatDialog, public route:Router, private giftCardData: GiftCardDataService){
    this.fetchGifts()
  }

  myGifts:any=[{id:1, giftName:"first present",giftLink:'https://rukminim1.flixcart.com/image/416/416/kll7bm80/toy-sport/u/g/i/smiley-tennis-badminton-baby-safe-plastic-2-rackets-with-one-original-imagyzffvfeuw8hz.jpeg?q=70',imageLink:"https://rukminim1.flixcart.com/image/416/416/kll7bm80/toy-sport/u/g/i/smiley-tennis-badminton-baby-safe-plastic-2-rackets-with-one-original-imagyzffvfeuw8hz.jpeg?q=70"},
  {id:1, giftName:"first present",imageLink:"https://thumbs.dreamstime.com/b/basketball-isolated-28666494.jpg"},{id:1, giftName:"first present",imageLink:"https://rukminim1.flixcart.com/image/416/416/kll7bm80/toy-sport/u/g/i/smiley-tennis-badminton-baby-safe-plastic-2-rackets-with-one-original-imagyzffvfeuw8hz.jpeg?q=70"},{id:1, giftName:"first present",imageLink:"https://thumbs.dreamstime.com/b/basketball-isolated-28666494.jpg"},{id:1, giftName:"first present",imageLink:"https://rukminim1.flixcart.com/image/416/416/kll7bm80/toy-sport/u/g/i/smiley-tennis-badminton-baby-safe-plastic-2-rackets-with-one-original-imagyzffvfeuw8hz.jpeg?q=70"},{id:1, giftName:"first present",giftLink:'https://rukminim1.flixcart.com/image/416/416/kll7bm80/toy-sport/u/g/i/smiley-tennis-badminton-baby-safe-plastic-2-rackets-with-one-original-imagyzffvfeuw8hz.jpeg?q=70',imageLink:"https://thumbs.dreamstime.com/b/basketball-isolated-28666494.jpg"},{id:1, giftName:"first present",giftLink:'https://rukminim1.flixcart.com/image/416/416/kll7bm80/toy-sport/u/g/i/smiley-tennis-badminton-baby-safe-plastic-2-rackets-with-one-original-imagyzffvfeuw8hz.jpeg?q=70',imageLink:"https://rukminim1.flixcart.com/image/416/416/kll7bm80/toy-sport/u/g/i/smiley-tennis-badminton-baby-safe-plastic-2-rackets-with-one-original-imagyzffvfeuw8hz.jpeg?q=70"}]
  openCreateGift(){

    //this.fetchGifts()
      openUserFormDialog(this.dialog).subscribe(res => {
        console.log("myresP:",res)
        if(res == undefined)
          return
         this.myGifts.unshift(res)
         

        })


// this.dialog.open(CreateGiftComponent , {
//   height: '370px',
//   width: '300px',
// })
  }

  fetchGifts(){

    this.giftCardData.getGiftData().subscribe({next :(res: any) => { 
      console.log(res.message,"getgift", res)
      
this.myGifts = res

      },error:(error)=>{
      
      console.log("myerror",error.error)}} )
  }

  logOut(){
    console.log("logoutworking")
    localStorage.clear()
    this.route.navigate(['login'])
  }

}
