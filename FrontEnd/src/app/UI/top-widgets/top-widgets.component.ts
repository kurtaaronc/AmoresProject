import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/Service/transaction.service';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-top-widgets',
  templateUrl: './top-widgets.component.html',
  styleUrls: ['./top-widgets.component.css']
})
export class TopWidgetsComponent {

  loading: boolean = true;
  monthlyTransactions: any[] = [];
  payments: any[] = [];
  dateToday: any;
  totalReleaseAmount: number = 0;
  totalLoanAmount: number = 0;
  totalProfit: number = 0;
  displayDate: any;
  totalCollectiblesForTheMonth: number = 0;
  listOfCollectibles: any[] = [];
  totalTransactions: any[] = [];
  totalActiveLoans: number = 0;
  isModalOpen: boolean = true;
  dialogRef: any;

  constructor (private transactionService: TransactionService, private datePipe: DatePipe, private router: Router, private dialog: MatDialog) {}

  openCollectibles(openModal: string){
    this.dialogRef = this.dialog.open(ModalComponent, {
      width: '600px', // You can customize the width and other options
      data: {
        listOfCollectibles: this.listOfCollectibles,
        activeLoans: this.totalTransactions,
        monthlyTransactions: this.monthlyTransactions,
        openModalFor: openModal
      }
    });
    return this.dialogRef;
  }

  // Close the modal
  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  exportToCSV(): void {
    // Create a new array with only the "name" and "payment" columns
    const exportData = this.listOfCollectibles.map(item => {
      return {
        Name: item.Name,     // Replace "name" with the actual property name in your data
        Payment: item.Payment // Replace "payment" with the actual property name in your data
      };
    });

    // Convert the new array to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Collectibles');

    // Generate CSV data
    const csvData: string = XLSX.utils.sheet_to_csv(ws);

    // Create a Blob containing the CSV data
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'y_MM_dd')?.toString();
    a.href = url;
    a.download = 'listOfCollectibles_' + formattedDate +'.csv';
    a.click();

    // Clean up by revoking the object URL
    window.URL.revokeObjectURL(url);
  }

  ngOnInit(): void {
    this.transactionService.getAllMonthlyDetails().subscribe(data => {
        this.loading = false;
        this.monthlyTransactions = data.loans;
        debugger
        this.totalActiveLoans = data.totalLoans.length;
        this.totalTransactions = data.totalLoans;
        this.payments = data.payments;
        const currentDate = new Date();
        const dayOfMonth = currentDate.getDate();
        const dateOfMonth = currentDate.getMonth();
        this.dateToday = this.datePipe.transform(currentDate, 'MMMM')?.toString();
        if(dayOfMonth <= 15){
          debugger
          this.displayDate = "15"
          for(let payment of this.payments){
             let paymentDate = new Date(payment.PaymentDate)
             if(paymentDate.getDate() <= 15 && paymentDate.getMonth() == dateOfMonth) {
                this.totalCollectiblesForTheMonth += payment.Payment;
                this.listOfCollectibles.push(payment);
             }
          }
        }
        else{
          this.displayDate = "30"
          for(let payment of this.payments){
            let paymentDate = new Date(payment.PaymentDate)
            if(paymentDate.getDate() > 15 && paymentDate.getMonth() == dateOfMonth) {
               this.totalCollectiblesForTheMonth += payment.Payment;
               this.listOfCollectibles.push(payment);
            }
         }
        }
        for(let transaction of this.monthlyTransactions){
            this.totalReleaseAmount += Math.ceil(transaction.ReleaseAmount);
            this.totalLoanAmount += Math.ceil(transaction.LoanAmount);
            this.totalProfit += Math.ceil(transaction.Profit);
        }
      },
      error => {
        this.loading;
    });
}
}
