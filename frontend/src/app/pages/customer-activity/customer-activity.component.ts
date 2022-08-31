import { Component, OnInit } from '@angular/core';
import { GymMasterServices } from '../../services/gymmaster.services';
import { CustomerProfile } from './appObject/customerProfile';
import { Router,ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'customer-activity',
  templateUrl: './customer-activity.component.html',
  styleUrls: ['./customer-activity.component.scss'],
  providers: [ GymMasterServices, DatePipe ]
})
export class CustomerActivityComponent implements OnInit {
  public customerProfile:CustomerProfile;
  private routerParams:any;
  public _Id:string;
  public searchId:string;
  public customerPayments : any [];
  public customerActivities : any [];
  public customerMeasurements : any [];
  public paymentStatus: string = "Paid";
  public highlightPendingPayment: boolean = false;
  public showActionButtons:boolean = false;
  public showCheckout:boolean = false;
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
    this.customerProfile = new CustomerProfile();
  }

  initData(){
    //this.searchId = "1";
    if(!this.searchId){
      this.showMessage("error",false,"Enter Customer ID");
      return;
    }
    this._Id = this.searchId;
    if(this._Id){
      this.getCustomerProfile();
      this.getOtherCustomerDetails();
    }
  }

  eventHandler(event) {
    if(event.keyCode == "13"){
      this.initData();
    }
    else if(event.keyCode == "43" && !this.showCheckout){
      event.preventDefault();
      this.checkin();
      this.reset();
    }
    else if(event.keyCode == "45" && this.showCheckout){
      event.preventDefault();
      this.checkout();
      this.reset();
    }
 }
 
  reset(){
    this.searchId = "";
  }

  getCustomerProfile(){
    this.gymMasterServices.getCustomerProfile(this._Id).subscribe(result =>{
      if(result['ID']) {
        this.customerProfile.ID = result['ID'];
        this.customerProfile.NAME = result['NAME'];
        this.customerProfile.DOB = this.datepipe.transform(result['DOB'], 'yyyy-MM-dd');
        this.customerProfile.ADDRESS = result['ADDRESS'];
        this.customerProfile.PHONE = result['PHONE'];
        this.customerProfile.REFERENCE = result['REFERENCE'];
        this.customerProfile.IMAGE_PATH = result['IMAGE_PATH'];
        this.showActionButtons = true;
      }
      else {
        this.showMessage("error",false,'No Customer Found !');
      }
    },error => {
      this.showMessage("error",false,'Error Occurred While Fetching Customer Details');
      console.log(error);
    });
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
    this.gymMasterServices.getDailyCustomerActivities({"CUSTOMER_PROFILE_ID" : this._Id}).subscribe(result =>{
      if(result) {
        this.customerActivities = result['data'];
        if(this.customerActivities && this.customerActivities.length != 0){
          for(let i = 0; i < this.customerActivities.length; i++){
            this.customerActivities[i].readonly = "true";
            if(this.customerActivities[i].IN_TIME && !this.customerActivities[i].OUT_TIME){
              this.showCheckout = true;
            }
            else{
              this.showCheckout = false;
            }
          }
        }
        else  this.showCheckout = false;
        
      }
      else {
        this.showCheckout = false;
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
          this.paymentStatus = "Paid (Next Due: "+this.datepipe.transform(this.customerPayments[0].END_DATE, 'dd-MM-yyyy')+")";
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

  checkin(){
    this.gymMasterServices.checkin({"CUSTOMER_PROFILE_ID": this._Id}).subscribe(result =>{
      if(result['id']) {
        this.showMessage("success",true,"Check-In Successful !");
        this.getCustomerActivities();
      }
      else {
        this.showMessage("error",false,"'Error Occurred While Checking-In'");
      }
    },error => {
      this.showMessage("error",false,"'Error Occurred While Checking-In'");
      console.log(error);
    });
  }

  checkout(){
    this.gymMasterServices.checkout({"CUSTOMER_PROFILE_ID": this._Id}).subscribe(result =>{
      if(result['id']) {
          this.showMessage("success",true,"Check-Out Successful !");
          this.getCustomerActivities();
      }
      else {
       
      }
    },error => {
      this.showMessage("error",false,"'Error Occurred While Checking-Out'");
      console.log(error);
    });
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
