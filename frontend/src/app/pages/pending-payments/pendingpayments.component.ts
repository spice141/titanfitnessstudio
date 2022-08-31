import { Component, OnInit } from '@angular/core';
import { GymMasterServices } from '../../services/gymmaster.services';
import { Router,ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pending-payments',
  templateUrl: './pendingpayments.component.html',
  styleUrls: ['./pendingpayments.component.scss'],
  providers: [ GymMasterServices, DatePipe ]
})
export class PendingPaymentsComponent implements OnInit {
  public customerProfiles : any [];
  private routerParams:any;
  public searchText:string;
  public CURRENT_POS:number = 0;
  public COUNT:number = 10;
  
  constructor(private gymMasterServices: GymMasterServices,private route: ActivatedRoute, private router: Router, public datepipe: DatePipe) {
    this.route.params.subscribe( params => this.routerParams = params);
  }

  ngOnInit() {
    if(!localStorage.getItem('userToken')){
      alert("Please Login To Continue !");
      this.router.navigate(['/login']);
    }
    else{
      this.initData();
    }
  }

  initData(){
    this.gymMasterServices.getAllPendingPayments({"CURRENT_POS": this.CURRENT_POS, "COUNT": this.COUNT}).subscribe(result =>{
      if(result) {
        this.customerProfiles = result['data'];
        for(let i = 0; i < this.customerProfiles.length; i++){
          this.customerProfiles[i].END_DATE = this.datepipe.transform(this.customerProfiles[i].END_DATE, 'yyyy-MM-dd');
        }
      }
      else {
        alert('No Payments Pending');
      }
    },error => {
      alert('Error Occurred While Fetching Pending Payments');
      console.log(error);
    });
  }

  editCustomerProfile(customerID){
    this.router.navigate(['/user-profile',customerID]);
  }

  public exportData(){
    if(this.customerProfiles.length == 0){
        alert("No data to export");
        return;
    }
    this.gymMasterServices.exportAsExcelFile(this.customerProfiles, 'Pending Payments');
  }

  //Pagination Logic
  next(){
    this.CURRENT_POS = this.CURRENT_POS+this.COUNT;
    this.initData();
  }

  prev(){
    if((this.CURRENT_POS-this.COUNT) >= 0){
      this.CURRENT_POS = this.CURRENT_POS-this.COUNT;
      this.initData();
    }
    else{
      alert("No more previous records available.");
    }
  }

}
