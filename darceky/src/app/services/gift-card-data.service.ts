import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GiftCardDataService {

  constructor(private http:HttpClient) { }
  sendGiftData(data:any){

   
    return this.http.post("http://localhost:3000/gifts/sendgift",data
    )
    
    }

    getGiftData(){

   
      return this.http.get("http://localhost:3000/gifts/getgifts"
      )
      
      }

}
