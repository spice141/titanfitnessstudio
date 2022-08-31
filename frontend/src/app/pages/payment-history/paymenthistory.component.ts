import { Component, OnInit } from '@angular/core';
import { GymMasterServices } from '../../services/gymmaster.services';
import { Router,ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-history',
  templateUrl: './paymenthistory.component.html',
  styleUrls: ['./paymenthistory.scss'],
  providers: [ GymMasterServices, DatePipe ]
})
export class PaymentHistoryComponent implements OnInit {
  public payments : any [];
  private routerParams:any;
  public searchText:string;
  public total:string;
  public YEAR:string;
  public MONTH:number;
  
  
  constructor(private gymMasterServices: GymMasterServices,private route: ActivatedRoute, private router: Router, public datepipe: DatePipe) {
    this.route.params.subscribe( params => this.routerParams = params);
  }

  ngOnInit() {
    if(!localStorage.getItem('userToken')){
      alert("Please Login To Continue !");
      this.router.navigate(['/login']);
    }
    else{
      this.YEAR = String(new Date().getFullYear());
      this.MONTH = new Date().getMonth()+1;
      this.initData();
    }
  }

  initData(){
    this.gymMasterServices.getPaymentHistory({"MONTH" : this.MONTH,"YEAR" : this.YEAR}).subscribe(result =>{
      if(result) {
        this.payments = result['data'];
        for(let i = 0; i < this.payments.length; i++){
          this.payments[i].PAYMENT_DATE = this.datepipe.transform(this.payments[i].PAYMENT_DATE, 'dd-MM-yyyy');
          this.payments[i].EFFECTIVE_DATE = this.datepipe.transform(this.payments[i].EFFECTIVE_DATE, 'dd-MM-yyyy');
          this.payments[i].END_DATE = this.datepipe.transform(this.payments[i].END_DATE, 'dd-MM-yyyy');
        }
      }
      else {
        alert('No Payments');
      }
    },error => {
      alert('Error Occurred While Fetching  Payments');
      console.log(error);
    });

    this.gymMasterServices.getPaymentHistoryTotal({"MONTH" : this.MONTH,"YEAR" : this.YEAR}).subscribe(result =>{
      if(result && result['data']) {
        this.total = result['data'][0].TOTAL;
      }
      else {
        this.total = "0";
        alert('No Payments');
      }
    },error => {
      alert('Error Occurred While Fetching  Payments');
      console.log(error);
    });
  }
  
  public search(){
    this.initData();
  }

  public reset(){
    this.YEAR = String(new Date().getFullYear());
    this.MONTH = new Date().getMonth()+1;
    this.initData();
  }

  public exportData(){
    if(this.payments.length == 0){
        alert("No data to export");
        return;
    }
    this.gymMasterServices.exportAsExcelFile(this.payments, 'Payment History');
  }

}
