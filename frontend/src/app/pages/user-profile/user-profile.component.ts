import { Component, OnInit } from '@angular/core';
import { GymMasterServices } from '../../services/gymmaster.services';
import { CustomerProfile } from './appObject/customerProfile';
import { Router,ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';
import { FileUploader,FileUploaderOptions} from 'ng2-file-upload';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [ GymMasterServices, DatePipe ]
})
export class UserProfileComponent implements OnInit {
  public customerProfile:CustomerProfile;
  private routerParams:any;
  public _Id:string;
  private fileUploadPath:string = "assets/images/";
  public uploader:FileUploader = new FileUploader({url:environment.API_URL+'/upload', allowedFileType: ['image']});
  public customerPayments : any [];
  public customerActivities : any [];
  public customerMeasurements : any [];
  public paymentStatus: string = "Paid";
  public highlightPendingPayment: boolean = false;
  public showSuccessMessage: boolean = false;
  public successMessage: string;
  public showErrorMessage: boolean = false;
  public errorMessage: string;
  

  constructor(private gymMasterServices: GymMasterServices,private route: ActivatedRoute, private router: Router, public datepipe: DatePipe) {
    this.route.params.subscribe( params => this.routerParams = params);
  }

  ngOnInit() {
    if(!localStorage.getItem('userToken')){
      this.showMessage("error",false,"Please Login To Continue !");
      this.router.navigate(['/login']);
    }
    else{
      this.initData();
    }
  }

  initData(){
    this._Id = this.routerParams._id;
    this.customerProfile = new CustomerProfile();
    if(this._Id){
      //Edit Customer Profile Scenario
      this.getCustomerProfile();
      this.getOtherCustomerDetails();
    }
    this.uploader.onAfterAddingFile = (item => {
      item.withCredentials = false;
   });
  }

  handleSave(){
    this.updateFilePathInObj();
    if (this.uploader.queue.length > 0){
      this.uploader.uploadAll();
    }
    if(!this._Id){
      this.createCustomerProfile();
    }
    else{
      this.updateCustomerProfile();
    }
  }

  createCustomerProfile() {
    if(this.customerProfile.NAME && this.customerProfile.PHONE  && this.customerProfile.ADDRESS && this.customerProfile.DOB ){
       this.customerProfile.STATUS = 1;
       this.gymMasterServices.createCustomerProfile(this.customerProfile).subscribe(result =>{
        if(result['id']) {
            alert("Customer with ID : "+result['id']+" created successfully.");
            //this.showMessage("success",false,"Customer with ID : "+result['id']+" created successfully.");
            this.router.navigate(['/tables']);
        }
        else {
          this.showMessage("error",false,'Error Occurred While Creating New CUstomer');
        }
      },error => {
        this.showMessage("error",false,'Error Occurred While Creating New CUstomer');
        console.log(error);
      });
    } 
    else{
      this.showMessage("error",false,'NAME, DOB, PHONE & ADDRESS Fields are Mandatory !');
    }
  }

  getCustomerProfile(){
    this.gymMasterServices.getCustomerProfile(this._Id).subscribe(result =>{
      if(result['ID']) {
        this.customerProfile.ID = result['ID'];
        this.customerProfile.NAME = result['NAME'];
        this.customerProfile.DOB = this.datepipe.transform(result['DOB'], 'yyyy-MM-dd');
        this.customerProfile.ADDRESS = result['ADDRESS'];
        this.customerProfile.PHONE = result['PHONE'];
        this.customerProfile.EMAIL = result['EMAIL'];
        this.customerProfile.REFERENCE = result['REFERENCE'];
        this.customerProfile.IMAGE_PATH = result['IMAGE_PATH'];
        this.customerProfile.STATUS = result['STATUS'];
      }
      else {
        this.showMessage("error",false,'Error Occurred While Fetching Customer Details');
      }
    },error => {
      this.showMessage("error",false,'Error Occurred While Fetching Customer Details');
      console.log(error);
    });
  }

  updateCustomerProfile(){
    this.customerProfile.ID = this._Id;
    if(this.customerProfile.STATUS){
      this.customerProfile.STATUS = 1;
    }
    else{
      this.customerProfile.STATUS = 0;
    }
    this.gymMasterServices.updateCustomerProfile(this.customerProfile).subscribe(result =>{
      if(result['id']) {
        this.showMessage("success",true,"Customer Details Updated Successfully");
      }
      else {
        this.showMessage("error",false,'Error Occurred While Updating Customer Details');
      }
    },error => {
      this.showMessage("error",false,'Error Occurred While Updating Customer Details');
      console.log(error);
    });
  }

  private updateFilePathInObj(){
    if (this.uploader.queue.length > 0){
      this.customerProfile.IMAGE_PATH =  this.fileUploadPath+this.uploader.queue[0].file.name;
    }
  }

  getOtherCustomerDetails(){
    this.getCustomerPayments();
    this.getCustomerActivities();
    this.getCustomerMeasurements();
    this.getCustomerPendingPayments();
  }

  getCustomerPayments(){
    this.gymMasterServices.getAllCustomerPayments({"CUSTOMER_PROFILE_ID" : this._Id}).subscribe(result =>{
      if(result) {
        this.customerPayments = result['data'];
        for(let i = 0; i < this.customerPayments.length; i++){
          this.customerPayments[i].END_DATE = this.datepipe.transform(this.customerPayments[i].END_DATE, 'yyyy-MM-dd');
          this.customerPayments[i].PAYMENT_DATE = this.datepipe.transform(this.customerPayments[i].PAYMENT_DATE, 'yyyy-MM-dd');
          this.customerPayments[i].EFFECTIVE_DATE = this.datepipe.transform(this.customerPayments[i].EFFECTIVE_DATE, 'yyyy-MM-dd');
          this.customerPayments[i].readonly = "true";
        }
      }
      else {
      
      }
    },error => {
      this.showMessage("error",false,'Error Occurred While Fetching Customer Payments');
      console.log(error);
    });
  }

  getCustomerActivities(){
    this.gymMasterServices.getAllCustomerActivities({"CUSTOMER_PROFILE_ID" : this._Id}).subscribe(result =>{
      if(result) {
        this.customerActivities = result['data'];
        for(let i = 0; i < this.customerActivities.length; i++){
          this.customerActivities[i].readonly = "true";
        }
      }
      else {
      
      }
    },error => {
      this.showMessage("error",false,'Error Occurred While Fetching Customer Activities');
      console.log(error);
    });
  }

  getCustomerMeasurements(){
    this.gymMasterServices.getAllCustomerMeasurements({"CUSTOMER_PROFILE_ID" : this._Id}).subscribe(result =>{
      if(result) {
        this.customerMeasurements = result['data'];
        for(let i = 0; i < this.customerMeasurements.length; i++){
          this.customerMeasurements[i].ENTRY_DATE = this.datepipe.transform(this.customerMeasurements[i].ENTRY_DATE, 'yyyy-MM-dd');
          this.customerMeasurements[i].readonly = "true";
        }
      }
      else {
      
      }
    },error => {
      this.showMessage("error",false,'Error Occurred While Fetching Customer Measurements');
      console.log(error);
    });
  }

  getCustomerPendingPayments(){
    this.gymMasterServices.getAllPendingPayments({"CUSTOMER_PROFILE_ID" : this._Id}).subscribe(result =>{
      if(result && result['data'] && result['data'].length) {
        this.paymentStatus = "Pending Since "+ this.datepipe.transform(result['data'][0].END_DATE, 'dd-MM-yyyy');
        this.highlightPendingPayment = true;
      }
      else {
        if(this.customerPayments.length != 0){
          this.paymentStatus =  "Paid (Next Due: "+this.datepipe.transform(this.customerPayments[0].END_DATE, 'dd-MM-yyyy')+")";
          this.highlightPendingPayment = false;
        }
        else{
          this.paymentStatus = "Pending";
          this.highlightPendingPayment = true;
        }
      }
    },error => {
      this.showMessage("error",false,'Error Occurred While Fetching Pending Payments');
      console.log(error);
    });
  }

  saveCustomerPayment(customerPayment){
    if(customerPayment.ID){
      this.gymMasterServices.saveCustomerPayment(customerPayment).subscribe(result =>{
        if(result['id']) {
          this.getCustomerPendingPayments();
          this.showMessage("success",true,"Changes Saved !");
        }
        else {
          this.showMessage("error",false,'Error Occurred While Updating Details');
        }
      },error => {
        this.showMessage("error",false,'Error Occurred While Updating Details');
        console.log(error);
      });
      customerPayment.readonly = "true";
    }
    else{
      if(customerPayment.PAYMENT_AMOUNT && customerPayment.PAYMENT_DATE && customerPayment.EFFECTIVE_DATE && customerPayment.END_DATE){
        this.gymMasterServices.createCustomerPayment(customerPayment).subscribe(result =>{
         if(result['id']) {
          this.showMessage("success",true,"Payment Recorded Successfully");
         }
         else {
          this.showMessage("error",false,'Error Occurred While Recording New Payment');
        }
       },error => {
        this.showMessage("error",false,'Error Occurred While Recording New Payment');
        console.log(error);
       });
       customerPayment.readonly = "true";
     } 
     else{
      this.showMessage("error",false,'Please fill in all details to proceed.');
    }
    }
  }

  saveCustomerActivity(customerActivity){
    if(customerActivity.ID){
      this.gymMasterServices.saveCustomerActivity(customerActivity).subscribe(result =>{
        if(result['id']) {
          this.showMessage("success",true,"Changes Saved !");
        }
        else {
          this.showMessage("error",false,'Error Occurred While Updating Details');
        }
      },error => {
        this.showMessage("error",false,'Error Occurred While Updating Details');
        console.log(error);
      });
      customerActivity.readonly = "true";
    }
    else{
        this.gymMasterServices.createCustomerActivity(customerActivity).subscribe(result =>{
        if(result['id']) {
          this.showMessage("success",true,"Activity Recorded Successfully");
        }
        else {
          this.showMessage("error",false,'Error Occurred While Recording New Activity');
        }
      },error => {
        this.showMessage("error",false,'Error Occurred While Recording New Activity');
        console.log(error);
      });
      customerActivity.readonly = "true";
    }
  }

  saveCustomerMeasurement(customerMeasurement){
    if(customerMeasurement.ID){
      this.gymMasterServices.saveCustomerMeasurement(customerMeasurement).subscribe(result =>{
        if(result['id']) {
          this.showMessage("success",true,"Changes Saved !");
        }
        else {
          this.showMessage("error",false,'Error Occurred While Updating Details');
        }
      },error => {
        this.showMessage("error",false,'Error Occurred While Updating Details');
        console.log(error);
      });
      customerMeasurement.readonly = "true";
    }
    else{
      if(customerMeasurement.WEIGHT  && customerMeasurement.SHOULDER && customerMeasurement.CHEST && customerMeasurement.ARMS && customerMeasurement.ABS && customerMeasurement.THIGH){
        this.gymMasterServices.createCustomerMeasurement(customerMeasurement).subscribe(result =>{
         if(result['id']) {
          this.showMessage("success",true,"Measurement Recorded Successfully");
        }
         else {
          this.showMessage("error",false,'Error Occurred While Recording New Measurement');
         }
       },error => {
         this.showMessage("error",false,'Error Occurred While Recording New Measurement');
         console.log(error);
       });
       customerMeasurement.readonly = "true";
     } 
     else{
      this.showMessage("error",false,'Please fill in all details to proceed.');
     }
    }
  }

  addNew(type){
    if(type == "Customer Payments"){
      this.customerPayments.push({"CUSTOMER_PROFILE_ID": this._Id,"PAYMENT_TYPE": "OFFLINE","PAYMENT_BALANCE": 0});
    }
    else if(type == "Customer Measurements"){
      this.customerMeasurements.push({"CUSTOMER_PROFILE_ID": this._Id});
    }
    else if(type == "Customer Activities"){
      this.customerActivities.push({"CUSTOMER_PROFILE_ID": this._Id});
    }
  }

  public exportData(dataArray:[], type){
    if(dataArray.length == 0){
      this.showMessage("success",true,"No data to export")
      return;
    }
    this.gymMasterServices.exportAsExcelFile(dataArray, type);
  }

  showMessage(type: string, autoClose: boolean, message: string){
    if(type == "success"){
      this.successMessage = message;
      this.showSuccessMessage = true;
      if(autoClose){
        setInterval(()=>this.showSuccessMessage = false, 1000);
      }
    }
    else if(type == "error"){
      this.errorMessage = message;
      this.showErrorMessage = true;
      if(autoClose){
        setInterval(()=>this.showErrorMessage = false, 1000);
      }
    }
  }

}
