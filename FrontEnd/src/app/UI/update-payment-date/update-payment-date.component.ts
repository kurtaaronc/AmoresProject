import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/Service/transaction.service';

@Component({
  selector: 'app-update-payment-date',
  templateUrl: './update-payment-date.component.html',
  styleUrls: ['./update-payment-date.component.css']
})
export class UpdatePaymentDateComponent {
  transactionId: any;
  name: string = "";
  transactionForm: FormGroup;
  completedTransaction: boolean = true;
  showSuccessLabel: boolean = false;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private transactionService: TransactionService, private route: ActivatedRoute) {
    this.transactionForm = this.fb.group({
      ActualDateOfPayment: ['', Validators.required]
    });
  }

  backToHomePage() {
    // Use the Router.navigate method to navigate to the desired route
    this.router.navigate(['/view/', this.name]);; // Replace 'about' with the route you want to navigate to
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transactionData = {
        ActualDateOfPayment: this.transactionForm.value['ActualDateOfPayment'],
        Name: this.name,
        Id: this.transactionId
      };
      this.transactionService.updateDateOfPayment(transactionData).subscribe(
        response => {
          this.showSuccessLabel = true;
          const timeoutDuration = 1000;
          this.isSubmitting = true;
          setTimeout(() => {
            this.isSubmitting = false;
            this.router.navigate(['/view/', this.name]);
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
      this.transactionId = params['Id'];
      this.name = params['transactionName'];
    });
}
}
