import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/Service/transaction.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css']
})
export class CreatePageComponent {


  transactionId: number = 0;
  transactionForm: FormGroup;
  completedTransaction: boolean = true;
  showSuccessLabel: boolean = false;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private transactionService: TransactionService, private route: ActivatedRoute) {
    this.transactionForm = this.fb.group({
      Date: ['', Validators.required],
      Name: ['', Validators.required],
      LoanAmount: ['', Validators.required],
      Terms: ['', Validators.required],
      Interest: ['', Validators.required],
      ReleaseAmount: ['', Validators.required],
      // Profit: ['', Validators.required],
      ExpectedDateOfPayment: ['', Validators.required]
      // ExpectedPayment: ['', Validators.required]
    });
  }

  backToHomePage() {
    // Use the Router.navigate method to navigate to the desired route
    this.router.navigateByUrl('/home'); // Replace 'about' with the route you want to navigate to
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      debugger
      let loanAmount = this.transactionForm.value['LoanAmount'];
      let releaseAmount = this.transactionForm.value['ReleaseAmount']
      let expectedPayment = loanAmount / (this.transactionForm.value['Terms'] * 2);
      const transactionData = {
        Date: this.transactionForm.value['Date'],
        Name: this.transactionForm.value['Name'],
        LoanAmount: loanAmount,
        Terms: this.transactionForm.value['Terms'],
        Interest: this.transactionForm.value['Interest'],
        ReleaseAmount: Math.ceil(releaseAmount),
        Profit: loanAmount - releaseAmount,
        ExpectedDateOfPayment: this.transactionForm.value['ExpectedDateOfPayment'],
        ExpectedPayment: expectedPayment,
        TransactionComplete: null
      };
      debugger
      this.transactionService.addNewTransaction(transactionData).subscribe(
        response => {
          this.showSuccessLabel = true;
          const timeoutDuration = 1000;
          this.isSubmitting = true;
          setTimeout(() => {
            this.isSubmitting = false;
            this.router.navigate(['/home']);;
          }, timeoutDuration);
        },
        error => {
          this.completedTransaction = false;
          console.error('Error creating transaction:', error);
        });
    }
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const dateInput = document.getElementById("ExpectedDateOfPayment") as HTMLInputElement;
      dateInput.placeholder = "Expected Date Of Payment";
      this.transactionId = params['transactionId'];
    });

}
}
