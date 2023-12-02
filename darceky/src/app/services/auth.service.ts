import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signUp(data:any){

   
  return this.http.post("http://localhost:3000/createappusers",data
  )
  
  }

  signIn(data:any){

   
    return this.http.post("http://localhost:3000/login",data
    )}

    deleteGift(giftId: any) {
      // Append the 'giftId' to the URL as a parameter
      const url = `http://localhost:3000/gifts/deletegift/${giftId}`;
  
      // Send the HTTP DELETE request
      return this.http.delete(url);
    }
    
    updateGiftReservedStatus(giftId: any, newReservedValue: boolean) {
      const url = `http://localhost:3000/gifts/updategift/${giftId}`;
      const requestBody = { reserved: newReservedValue };
  
      return this.http.patch(url, requestBody);
    }
}
