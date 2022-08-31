import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable()
export class LoginService {

	private restGateway= environment.API_URL;

	constructor(private http: HttpClient){
		
	}
	
	validateLogin(customerID,password){
		return this.http.post(this.restGateway+'/login',{
			USER_ID : customerID,
			PASSWORD :password
		})
	}

}