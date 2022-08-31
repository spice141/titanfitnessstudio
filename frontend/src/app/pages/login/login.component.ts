import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit, OnDestroy {
  public userID : string;
  public password : string;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {
   
  }

  ngOnDestroy() {

  }

  validateLogin() {
  	if(this.userID && this.password) {
      var encodedPassword = btoa(this.password);
  		this.loginService.validateLogin(this.userID,encodedPassword).subscribe(result => {
        //console.log('result is ', result);
        if(result['userToken']) {
          if(!localStorage){
            alert("Device not supported");
            return;
          }
          localStorage.setItem('userToken', result['userToken']);
          this.router.navigate(['/tables']);
        } else {
          alert('Wrong username password');
        }
        
      }, error => {
        alert('Login Failed');
        console.log('error is ', error);
      });
  	} else {
  		alert('Enter Customer ID and Password');
  	}
  }
}
