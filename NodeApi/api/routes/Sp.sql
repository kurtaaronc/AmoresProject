DELIMITER //

CREATE PROCEDURE InsertLoanTransaction(
  IN p_Date VARCHAR(255),
  IN p_Name VARCHAR(255),
  IN p_LoanAmount DECIMAL(10, 2),
  IN p_Interest DECIMAL(5, 2),
  IN p_Terms INT,
  IN p_ReleaseAmount DECIMAL(10, 2),
  IN p_Profit DECIMAL(10, 2),
  IN p_ExpectedDateOfPayment VARCHAR(255),
  IN p_ExpectedPayment DECIMAL(10, 2)
)
BEGIN

  DECLARE counter INT DEFAULT 1;
  DECLARE transactionId INT;
  DECLARE remainingBalance DECIMAL(10, 2);
  DECLARE newExpectedPaymentDate VARCHAR(255);
  DECLARE daysToAdd INT;

  INSERT INTO LoanTransactions (Date, Name, LoanAmount, Interest, Terms, ReleaseAmount, Profit)
  VALUES (p_Date, p_Name, p_LoanAmount, p_Interest, p_Terms, p_ReleaseAmount, p_Profit);

  -- Get the transactionId for the inserted record
  SELECT Id INTO transactionId FROM LoanTransactions WHERE Name = p_Name;

  -- Corrected WHILE loop syntax
  WHILE counter <= (p_Terms * 2) DO

    SET remainingBalance = (p_LoanAmount - (p_ExpectedPayment * counter));
    SET newExpectedPaymentDate = p_ExpectedDateOfPayment;

    IF counter > 1 THEN
      SET daysToAdd = 15 * (counter - 1);
      SET newExpectedPaymentDate = STR_TO_DATE(p_ExpectedDateOfPayment, '%Y-%m-%d');
      SET newExpectedPaymentDate = DATE_ADD(newExpectedPaymentDate, INTERVAL daysToAdd DAY);
      SET newExpectedPaymentDate = DATE_FORMAT(newExpectedPaymentDate, '%Y-%m-%d');
      SELECT newExpectedPaymentDate; -- Use SELECT to print the date
    END IF;

    -- Corrected INSERT INTO Payments statement
    INSERT INTO Payments (Name, PaymentDate, Payment, TransactionId, RemainingBalance)
    VALUES (p_Name, newExpectedPaymentDate, p_ExpectedPayment, transactionId, remainingBalance);

    SET counter = counter + 1;
  END WHILE; -- Removed ':' from 'END WHILE'
END;
//
DELIMITER ;

--CALL InsertLoanTransaction("2023-09-18","Kurt Aaron Cabrera",35000,.30,3,30000,5000,"2023-09-30",3000)