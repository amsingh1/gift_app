import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

constructor(public route:Router, private authservice:AuthService){}
  loginFormData = new FormGroup({
    UserName: new FormControl(''),
    Password: new FormControl('',[Validators.required,Validators.minLength(8)]),
    
  });

  ngOnInit(){
    

  }

  onSubmit(){
    if (!this.loginFormData.valid)
    return
    this.authservice.signIn(this.loginFormData.value).subscribe({next :(res: any) => { 
      console.log(res.message)
      this.route.navigate(['home'])
      },error:(error)=>{
      
      console.log("myerror",error.error)}})
    console.log(this.loginFormData.value)
let email:any=this.loginFormData.value.UserName
    localStorage.setItem("loginToken",email )
    
  }

  onSignUp(){
    this.route.navigate(['signup'])

    console.log('sign function up working')
  }
}
