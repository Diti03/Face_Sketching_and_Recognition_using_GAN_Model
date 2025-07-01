import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoginmanagerComponent } from './loginmanager/loginmanager.component';
import { FacesketchComponent } from './facesketch/facesketch.component';
import { MatchResultsComponent } from './match-results/match-results.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './auth.guard'; // Import AuthGuard

const routes: Routes = [
  {
    path: "",
    component: HomepageComponent,
    //canActivate: [AuthGuard] //  Optional, if you want to protect home
  },
  {
    path: "navbar",
    component: NavbarComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "facesketch",
    component: FacesketchComponent,
    //canActivate: [AuthGuard]
  },

  { path: 'match-results',
    component: MatchResultsComponent },
  
  {
    path: "administator",
    component: LoginmanagerComponent
  },

  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },

  { path: 'reset-password',
    component: ResetPasswordComponent },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}  // <-- Make sure this line is present and correctly spelled


