
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit  {
  constructor(public route:Router, private authservice:AuthService){}
  loginFormData = new FormGroup({
    UserName:new FormControl('',[Validators.required,Validators.maxLength(10)]),
    Email: new FormControl('',[Validators.required,Validators.email]),
    Password: new FormControl('',[Validators.required,Validators.minLength(8)])
    
  });

  ngOnInit(){
    

  }

  onSubmit(){
    
   if (!this.loginFormData.valid)
    return
     console.log('submit working in sign up')
     this.authservice.signUp(this.loginFormData.value).subscribe({next :(res: any) => { 
    console.log(res)
    this.route.navigate(['login'])
    },error:(error)=>{
    
    console.log("myerror",error.error)}})
    console.log(this.loginFormData.value)
let email:any=this.loginFormData.value.Email
    
  
  }

  onLoginIn(){
    this.route.navigate(['login'])

    console.log('login function up working')
  }
}
