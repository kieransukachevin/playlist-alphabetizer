import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'login-redirect', component: LoginRedirectComponent },
  { path: '', component:  MainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
