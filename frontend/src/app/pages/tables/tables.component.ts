import { Component, OnInit } from '@angular/core';
import { GymMasterServices } from '../../services/gymmaster.services';
import { Router,ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
  providers: [ GymMasterServices, DatePipe ]
})
export class TablesComponent implements OnInit {
  public customerProfiles : any [];
  private routerParams:any;
  public ID:string;
  public NAME:string;
  public DOB:Date;
  public PHONE:string;
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
      this.gymMasterServices.getAllCustomerProfiles().subscribe(result =>{
        if(result) {
          this.customerProfiles = result['data'];
          for(let i = 0; i < this.customerProfiles.length; i++){
            this.customerProfiles[i].DOB = this.datepipe.transform(this.customerProfiles[i].DOB, 'yyyy-MM-dd');
          }
        }
        else {
          alert('No Customer Profiles Available');
        }
      },error => {
        alert('Error Occurred While Fetching Customer Profiles');
        console.log(error);
      });
    }
  }

  editCustomerProfile(customerID){
    this.router.navigate(['/user-profile',customerID]);
  }
  searchButtonClick(){
    this.CURRENT_POS = 0;
    this.search();
  }
  
  search(){
    this.gymMasterServices.searchCustomerProfile({"ID" : this.ID, "NAME": this.NAME, "DOB": this.DOB, "PHONE": this.PHONE, "CURRENT_POS": this.CURRENT_POS, "COUNT": this.COUNT}).subscribe(result =>{
      if(result) {
        this.customerProfiles = result['data'];
        for(let i = 0; i < this.customerProfiles.length; i++){
          this.customerProfiles[i].DOB = this.datepipe.transform(this.customerProfiles[i].DOB, 'yyyy-MM-dd');
        }
      }
      else {
        alert('No Customer Profiles Available');
      }
    },error => {
      alert('Error Occurred While Fetching Customer Profiles');
      console.log(error);
    });
  }
  
  resetSearch(){
    this.ID = '';
    this.NAME = '';
    this.PHONE = '';
    this.DOB = null;
    this.CURRENT_POS = 0;
    this.search();
  }

  public exportData(){
    if(this.customerProfiles.length == 0){
        alert("No data to export");
        return;
    }
    this.gymMasterServices.exportAsExcelFile(this.customerProfiles, 'Customers');
  }

  public autoCheckout(){
    this.gymMasterServices.autoCheckOut({}).subscribe(result =>{
      alert("Auto Check-Out Completed.");
    },error => {
      alert("Auto Check-Out Failed.");
      console.log(error);
    });
  }

  //Pagination Logic
  next(){
    this.CURRENT_POS = this.CURRENT_POS+this.COUNT;
    this.search();
  }

  prev(){
    if((this.CURRENT_POS-this.COUNT) >= 0){
      this.CURRENT_POS = this.CURRENT_POS-this.COUNT;
      this.search();
    }
    else{
      alert("No more previous records available.");
    }
  }
}
