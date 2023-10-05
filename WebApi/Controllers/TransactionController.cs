using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        public class Transaction {
            public int TransactionId { get; set; }
            public string? TransactionName { get; set; }
            public string? Date { get; set; }
            public decimal Cost { get; set; }
        }
        private static List<Transaction> transactions = new List<Transaction>
        {
            new Transaction
            {
                TransactionId = 1,
                TransactionName = "Kurt",
                Date = "2023-09-01",
                Cost = 100
            },
            new Transaction
            {
                TransactionId = 2,
                TransactionName = "Aaron",
                Date = "2023-09-01",
                Cost = 100
            },
            new Transaction
            {
                TransactionId = 3,
                TransactionName = "Cabrera",
                Date = "2023-09-01",
                Cost = 100
            },
            new Transaction
            {
                TransactionId = 4,
                TransactionName = "Jake",
                Date = "2023-09-01",
                Cost = 100
            },
            new Transaction
            {
                TransactionId = 5,
                TransactionName = "Karen",
                Date = "2023-09-01",
                Cost = 100
            },
            new Transaction
            {
                TransactionId = 1,
                TransactionName = "Kurt",
                Date = "2023-09-01",
                Cost = 100
            },
        };


        // [HttpGet("Get")]
        // public IEnumerable<Transaction> GetAllTransaction()
        // {
        //     using (var package = new ExcelPackage(new FileInfo(filePath)))
        //     {
        //         var worksheet = package.Workbook.Worksheets[0]; // Assuming you want to read the first worksheet
        //         var rowCount = worksheet.Dimension.Rows;
        //         var colCount = worksheet.Dimension.Columns;

        //         var excelData = new List<List<string>>();

        //         for (int row = 1; row <= rowCount; row++)
        //         {
        //             var rowValues = new List<string>();
        //             for (int col = 1; col <= colCount; col++)
        //             {
        //                 rowValues.Add(worksheet.Cells[row, col].Value?.ToString() ?? "");
        //             }
        //             excelData.Add(rowValues);
        //         }

        //         return excelData;
        //     }

        // }

        [HttpGet("GetById/{id}")]
        public ActionResult<IEnumerable<Transaction>> GetTransactionById(int id)
        {
            if (id <= 0){
                return NotFound("Invalid Request");
            }
            var filteredTransactions = transactions.Where(t => t.TransactionId == id).ToList();
            if (filteredTransactions.Count == 0)
            {
                return NotFound("Transaction not found");
            }

            return filteredTransactions;
        }
        [HttpPost("Create")]
        public ActionResult<bool> CreateTransaction([FromBody] Transaction transactionRequest)
        {
            if (transactionRequest != null)
            {
                Transaction existingTransaction = transactions.FirstOrDefault(t =>string.Equals(t.TransactionName, transactionRequest.TransactionName, StringComparison.OrdinalIgnoreCase));

                if (existingTransaction != null)
                {
                    transactionRequest.TransactionId = existingTransaction.TransactionId;
                }
                else
                {
                    int lastTransactionId = transactions.OrderByDescending(t => t.TransactionId).FirstOrDefault()?.TransactionId ?? 0;
                    transactionRequest.TransactionId = ++lastTransactionId;
                }
                // Add the transaction to the list
                transactions.Add(transactionRequest);
                return true;
            }
            return false;
        }
        
    }
}