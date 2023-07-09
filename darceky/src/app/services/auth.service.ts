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
}
