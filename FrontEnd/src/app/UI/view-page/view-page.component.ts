import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/Service/transaction.service';

interface ApiResponse {
  table1: string[];
  table2: string[]; // Adjust the type for table2 as needed
}

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent {

  transactions: any[] = [];
  payments: any[] = [];
  loading: boolean = true;
  pageHeader: string = '';
  uniqueTransactionIds: string[] = [];
  showSuccessLabel: boolean =  false;
  showFailedLabel: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private transactionService: TransactionService) {}

  backToHomePage() {
    // Use the Router.navigate method to navigate to the desired route
    this.router.navigateByUrl('/home'); // Replace 'about' with the route you want to navigate to
  }

  completePayment(id: any) {
    this.transactionService.completeTransaction({ Id: id }).subscribe(
      (data) => {
        const timeoutDuration = 1000;
        this.showSuccessLabel = true;
          setTimeout(() => {
            window.location.reload();
          }, timeoutDuration);

      },
      (error) => {
        this.showFailedLabel = true;
        // Handle the error here
        console.error('Error fetching transaction:', error);
      }
    );
  }

  updateDateOfPayment(transactionName: string, Id : number) {
    if(transactionName != null){
      this.router.navigate(['updatePayment/', transactionName, Id]);
    }
  }


  createPayment(transactionName: string, Id : number) {
    if(transactionName != null){
      this.router.navigate(['createPayment/', transactionName, Id]);
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const transactionName = params['transactionName'];
      this.transactionService.getById(transactionName).subscribe(
        (data) => {
          this.payments = data.payments;
          this.transactions = data.loans;
          this.loading = false;
          this.pageHeader = transactionName;
          this.transactions.forEach(transaction => {
            if (!this.uniqueTransactionIds.includes(transaction.Id)) {
              this.uniqueTransactionIds.push(transaction.Id);
            }
          });
        },
        (error) => {
          // Handle the error here
          console.error('Error fetching transaction:', error);
        }
      );
    });


  }
}
