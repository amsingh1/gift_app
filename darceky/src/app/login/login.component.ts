import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

constructor(public route:Router){}
  loginFormData = new FormGroup({
    Email: new FormControl('',[Validators.required,Validators.email]),
    Password: new FormControl('',[Validators.required,Validators.minLength(8)]),
    
  });

  ngOnInit(){
    

  }

  onSubmit(){
    if (!this.loginFormData.valid)
    return
    console.log(this.loginFormData.value)
let email:any=this.loginFormData.value.Email
    localStorage.setItem("loginToken",email )
    this.route.navigate(['home'])
  }

  onSignUp(){
    this.route.navigate(['signup'])

    console.log('sign function up working')
  }
}
