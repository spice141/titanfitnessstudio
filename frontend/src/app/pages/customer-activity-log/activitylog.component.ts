import { Component, OnInit } from '@angular/core';
import { GymMasterServices } from '../../services/gymmaster.services';
import { Router,ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activitylog.component.html',
  styleUrls: ['./activitylog.scss'],
  providers: [ GymMasterServices, DatePipe ]
})
export class ActivityLogComponent implements OnInit {
  public activities : any [];
  private routerParams:any;
  public searchText:string;
  public selectedDate:Date;
  public morningBatch:string;
  public eveningBatch:string;
  
  constructor(private gymMasterServices: GymMasterServices,private route: ActivatedRoute, private router: Router, public datepipe: DatePipe) {
    this.route.params.subscribe( params => this.routerParams = params);
  }

  ngOnInit() {
    if(!localStorage.getItem('userToken')){
      alert("Please Login To Continue !");
      this.router.navigate(['/login']);
    }
    else{
      //this.initData();
    }
  }

  initData(){
    this.gymMasterServices.getActivityLog({
      "MONTH" : new Date(this.selectedDate).getMonth()+1,
      "YEAR" : new Date(this.selectedDate).getFullYear(),
      "DAY": new Date(this.selectedDate).getDate(),
      "START_TIME": this.morningBatch == "1" ? "05:00:00" : "15:00:00",
      "END_TIME":  this.morningBatch == "1" ? "11:59:00" : "23:59:00"
  }).subscribe(result =>{
      if(result) {
        this.activities = result['data'];
      }
      else {
        alert('No activities');
      }
    },error => {
      alert('Error Occurred While Fetching  activities');
      console.log(error);
    });
  }

  public onMorningSelectionChange(entry): void{
    this.morningBatch = entry;
    this.eveningBatch = "0";
  }

  public onEveningSelectionChange(entry): void{
    this.eveningBatch = entry;
    this.morningBatch = "0";
  }

  public search(){
    this.initData();
  }

  public getPaymentStatus(PAYMENT_END_DATE){
    return new Date(PAYMENT_END_DATE) < new Date() ? 'Pending since : '+ PAYMENT_END_DATE.substring(0, PAYMENT_END_DATE.indexOf("T"))  : 'Paid'
  }

  public exportData(){
    if(this.activities.length == 0){
        alert("No data to export");
        return;
    }
    this.gymMasterServices.exportAsExcelFile(this.activities, 'Activity Log');
  }

}
