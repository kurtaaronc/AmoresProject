import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  listOfCollectibles: any[];
  activeLoans: any[];
  monthlyTransactions: any[];
  activeLoansToDisplay: { Name: string; LoanCount: number }[] = [];
  openModalFor: string = "";

  constructor(public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.listOfCollectibles = data.listOfCollectibles
    this.openModalFor = data.openModalFor
    this.activeLoans = data.activeLoans
    debugger
    this.monthlyTransactions = data.monthlyTransactions
    this.activeLoans.forEach(loan => {
      let name = loan.Name;
      let foundIndex = -1; // Initialize with -1 to indicate not found
      let nameExists = this.activeLoansToDisplay.some(entry => entry.Name === name);
      this.activeLoansToDisplay.forEach((entry, index) => {
        if (entry.Name === name) {
          foundIndex = index;
          return;
        }
      });
      if (nameExists) {
        this.activeLoansToDisplay[foundIndex].LoanCount += 1;
      } else {
          this.activeLoansToDisplay.push({
            Name: name,
            LoanCount: 1
          })
      }
    })
  }

  closeModal() {
    this.dialogRef.close();
  }
}
