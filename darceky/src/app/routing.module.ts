import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiftcardComponent } from './giftcard/giftcard.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import {SignupComponent} from './signup/signup.component'


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HeaderComponent },
  { path: 'signup', component: SignupComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule { }
