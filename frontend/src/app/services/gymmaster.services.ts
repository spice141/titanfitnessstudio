import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { environment } from '../../environments/environment';

@Injectable()

export class GymMasterServices{
	
	private restGateway= environment.API_URL;

	constructor(private http: HttpClient){
		// this.http.get('./assets/restGateway.json').subscribe(
		// 	data => {
		// 		if(data){
		// 			this.restGateway = data['endpoint'];
		// 		}
		// 		else{
		// 			alert("Gateway config error.");
		// 		}
		// 	},
		// 	(err) => {
		// 	  alert("Gateway config error.");
		// 	}
		// );
	}
	

	/* All below rest apis require authentication  token*/
	createCustomerProfile(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customers',dataObj,httpOptions)
	}

    getCustomerProfile(customerID){
        //dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.get(this.restGateway+'/customers/'+customerID,httpOptions)
    }

	updateCustomerProfile(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.put(this.restGateway+'/customers',dataObj,httpOptions)
	}

	
	getAllCustomerProfiles(){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.get(this.restGateway+'/customers',httpOptions)
	}

	searchCustomerProfile(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/searchCustomers',dataObj,httpOptions)
	}

	getAllPendingPayments(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerPayment/pendingPayments',dataObj,httpOptions)
	}

	getPaymentHistory(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerPayment/paymentHistory',dataObj,httpOptions)
	}

	getPaymentHistoryTotal(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerPayment/paymentHistoryTotal',dataObj,httpOptions)
	}

	getActivityLog(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerActivity/getCustomerActivityLog',dataObj,httpOptions)
	}

	getAllCustomerPayments(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/getCustomerPayments',dataObj,httpOptions)
	}

	getAllCustomerActivities(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerActivity/monthly',dataObj,httpOptions)
	}

	getDailyCustomerActivities(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerActivity/daily',dataObj,httpOptions)
	}

	getAllCustomerMeasurements(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/getCustomerMeasurements',dataObj,httpOptions)
	}

	saveCustomerPayment(customerPayment){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.put(this.restGateway+'/customerPayment',customerPayment,httpOptions)
	}

	saveCustomerActivity(customerActivity){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.put(this.restGateway+'/customerActivity',customerActivity,httpOptions)
	}

	saveCustomerMeasurement(customerMeasurement){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.put(this.restGateway+'/customerMeasurement',customerMeasurement,httpOptions)
	}

	createCustomerPayment(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerPayment',dataObj,httpOptions)
	}

	createCustomerActivity(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerActivity',dataObj,httpOptions)
	}

	createCustomerMeasurement(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerMeasurement',dataObj,httpOptions)
	}

	checkin(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerActivity',dataObj,httpOptions)
	}

	checkout(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.put(this.restGateway+'/customerActivity',dataObj,httpOptions)
	}

	autoCheckOut(dataObj){
		//dataObj.userToken = localStorage.getItem('userToken');
		const httpOptions = {
			headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'x-access-token': localStorage.getItem('userToken')
		   })
		};
		return this.http.post(this.restGateway+'/customerActivity/autocheckout',dataObj,httpOptions)
	}

	public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    
    private saveAsExcelFile(buffer: any, fileName: string): void {
		const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const EXCEL_EXTENSION = '.xlsx';
		const data: Blob = new Blob([buffer], {
			type: EXCEL_TYPE
		});
		FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

	

}