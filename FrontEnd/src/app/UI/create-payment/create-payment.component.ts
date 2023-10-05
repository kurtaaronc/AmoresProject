import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/Service/transaction.service';

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.css']
})
export class CreatePaymentComponent {
  transactionId: any;
  name: string = "";
  transactionForm: FormGroup;
  completedTransaction: boolean = true;
  showSuccessLabel: boolean = false;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private transactionService: TransactionService, private route: ActivatedRoute) {
    this.transactionForm = this.fb.group({
      ActualDateOfPayment: ['', Validators.required],
      ActualPayment: ['', Validators.required]
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
        ActualPayment: this.transactionForm.value['ActualPayment'],
        Name: this.name,
        Id: this.transactionId
      };
      this.transactionService.createPayment(transactionData).subscribe(
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
      debugger
      this.transactionId = params['Id'];
      this.name = params['transactionName'];
    });
}
}
