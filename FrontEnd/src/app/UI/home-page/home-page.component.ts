import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/Service/transaction.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  transactions: any[string] = [];
  loading: boolean = true;
  collectiblesForTheCutOff: string = "";
  totalCollectibles: number = 0;

  constructor(private router: Router, private transactionService: TransactionService, private datePipe: DatePipe) { }

  viewTransactionDetails(transactionName: string) {
    if(transactionName != null){
      this.router.navigate(['/view', transactionName]);
    }
  }

  getTotalCollectibles(transactions: any){
    for(var i = 0; i < transactions.Length; i++){
      var dateString = transactions.date[i];
      var dateString = transactions.date[i];
      var date = new Date(dateString);
      var formattedDate = this.datePipe.transform(date, 'MMMM d') as string;
      if(formattedDate === this.collectiblesForTheCutOff ){
        this.totalCollectibles += transactions.cost[i];
      }
    }

  }

  getCurrentDate() {
    const currentDate = new Date();
    this.collectiblesForTheCutOff = this.datePipe.transform(currentDate, 'yyyy-MM-dd') as string;
    this.collectiblesForTheCutOff = this.datePipe.transform(this.collectiblesForTheCutOff, 'MMMM d') as string;
  }

  backToDashBoard(){
    this.router.navigate(['/dashboard']);
  }

  createNewTransaction() {
    this.router.navigate(['/create']);
  }

  ngOnInit(): void {
    this.transactionService.getAll().subscribe(data => {
        this.loading = false;
        this.transactions = data;
      },
      error => {
        this.loading;
    });
    this.getCurrentDate();
    this.getTotalCollectibles(this.transactions);
}
}
