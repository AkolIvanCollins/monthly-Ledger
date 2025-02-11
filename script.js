// Counter for numbering income entries
let incomeEntryCount = 0;
let expenseEntryCount = 0;

/////////////////////////////////////////////////////////////////////////////////////     [Income]       //////////////////////////////////////////////////////////////////////


// Function to add an income entry
function addIncomeEntry() {
  const incomeEntries = document.getElementById('income-entries');
  incomeEntryCount++; // Increment entry count
  const entry = document.createElement('div');
  entry.className = 'entry d-flex align-items-center'; //Added flex for alignment
  entry.innerHTML = `
    <div class="input-group mb-3" flex-grow-1>
      <span class="input-group-text">${incomeEntryCount}</span> <!-- Numbered label -->
      <input type="text" class="form-control source" placeholder="Source"/>
      <span class="input-group-text">Shs.</span>
      <input type="text" class="form-control amount" placeholder="Amount"/>
      <button class="btn btn-danger ms-2 delete-entry">Delete</button> <!--Delete Button-->
    </div>
  `;
  incomeEntries.appendChild(entry);


////////////////////////////////////////////////// [start 1] ////////////////////////////////
  // Add an event listener to format the "Amount" input Format amount input and update receipt                                                 
  const sourceInput = entry.querySelector(".source");
  sourceInput.addEventListener('input', updateReceipt);
//////////////////////////////////////////////// [end 1] ///////////////////////////////////


  // Add an event listener to format the "Amount" input Format amount input and update receipt                                                 
  const amountInput = entry.querySelector(".amount");
  amountInput.addEventListener('input', formatNumberWithCommas);
  amountInput.addEventListener('input', updateReceipt);

  // Delete button handler
  const deleteButton = entry.querySelector('.delete-entry');
  deleteButton.addEventListener('click', () => {
    entry.remove();
    updateReceipt(); // Update receipt after deletion
  });

  // Add event listener to the Enter key function Incomes
  amountInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents default behaviour
      addIncomeEntry(); // Add a new income Entry
      const newEntry = document.querySelector('#income-entries .entry:last-child .source');
      newEntry.focus()
      }
    }
  );

updateReceipt();
}
  // Function to remove the last income entry
  function removeAllIncomeEntries() {
    const incomeEntries = document.getElementById('income-entries');
    if (confirm("Are you sure you want to remove all income entries?")){
      incomeEntries.innerHTML = ''; //clear all child elements
      incomeEntryCount = 0; // Reset the entry count
      }
  }
/////////////////////////////////////////////////////////////////////////////////////     [Expenses]       //////////////////////////////////////////////////////////////////////



// Function to add an expense entry
function addExpenseEntry() {
  const expenseEntries = document.getElementById('expense-entries');
  const entryCount = expenseEntries.children.length + 1; // Number the entry based on current count
  const entry = document.createElement('div');
  entry.className = 'entry';
  entry.innerHTML = `
    <div class="input-group mb-3">
      <span class="input-group-text">${entryCount}</span> <!-- Add Numbered label -->
      <input type="text" class="form-control expense" placeholder="Expense Name"/>
      <span class="input-group-text">Shs.</span>
      <input type="text" class="form-control amount" placeholder="Amount"/>
      <button class="btn btn-danger ms-2 delete-entry">Delete</button> <!--Delete Button-->
    </div>
  `;
  expenseEntries.appendChild(entry);


  //Real time update the name Expense name and update the receipt
  const expenseInput = entry.querySelector(".expense");
  expenseInput.addEventListener('input', updateReceipt);

  // Add an event listener to format the "Amount" input
  const amountInput = entry.querySelector(".amount");
  amountInput.addEventListener('input', formatNumberWithCommas);
  amountInput.addEventListener('input', updateReceipt);

  //Add event listener to the Deleted button
  const deleteButton = entry.querySelector(".delete-entry");
  deleteButton.addEventListener('click',() => {
    entry.remove(); //Remove the specific entry
   updateReceipt(); //Update receipt after deletion
  });
 
 //Add event listener for Enter key on the "Amount" input 
  amountInput.addEventListener('keydown',(event) => {
    if(event.key === 'Enter') {
      event.preventDefault(); //Prevent default behaviour 
      addExpenseEntry(); //Add a new expense entry
      // Focus on the newly added "Source" input
      const newEntry = document.querySelector('#expense-entries .entry:last-child .expense');
      newEntry.focus();
    }
  });
  
updateReceipt();
}

  // Function to remove the last expense entry
  function removeAllExpenseEntries() {
    const expenseEntries = document.getElementById('expense-entries');
    if (confirm("Are you sure you want to remove all expense entries?")){
      expenseEntries.innerHTML = ''; //clear all child elements
      expenseEntryCount = 0; 
      }
  }





                                                                              ///  Operations ///                                           



// Function to format numbers with commas
function formatNumberWithCommas(event) {
  const input = event.target;
  let value = input.value.replace(/,/g, ''); // Remove existing commas

  // Check if the input is a valid number
  if (!isNaN(value) && value !== '') {
    value = parseFloat(value).toLocaleString('en-US'); // Format the number with commas
  }

  input.value = value; // Update the input value with the formatted number
}

document.addEventListener('DOMContentLoaded', () => {
  addIncomeEntry();
})

document.addEventListener('DOMContentLoaded', () => {
  addExpenseEntry();
})

// Function to calculate the budget
function calculateBudget() {
  let totalIncome = 0;
  let totalExpenses = 0;

  // Calculate total income
  const incomeAmounts = document.querySelectorAll('#income-entries .amount');
  incomeAmounts.forEach(input => {
    totalIncome += parseFloat(input.value.replace(/,/g, '')) || 0; // Remove commas before parsing
  });

  // Calculate total expenses
  const expenseAmounts = document.querySelectorAll('#expense-entries .amount');
  expenseAmounts.forEach(input => {
    totalExpenses += parseFloat(input.value.replace(/,/g, '')) || 0; // Remove commas before parsing
  });

  // Calculate remaining budget
  const remainingBudget = totalIncome - totalExpenses;

  // Display the results
  const results = document.getElementById('results');
  results.innerHTML = `
    Total Income: Shs. ${totalIncome.toLocaleString('en-US')}<br>
    Total Expenses: Shs. ${totalExpenses.toLocaleString('en-US')}<br>
    Remaining Budget: Shs. ${remainingBudget.toLocaleString('en-US')}
  `;
}

function validateAmountInput(input) {
  const value = input.value.replace(/,/g, '');
  if (isNaN(value) || value === '') {
    input.value = '0';
  }
}

amountInput.addEventListener('blur', () => validateAmountInput(amountInput));

//////////////////////////////////////////////////////////////////////////////////////// Receipts Section /////////////////////////////

function updateReceipt() {
  const receiptContent = document.getElementById('receipt-content');
  let receiptHTML = `
  <div class = "receipt-grid">
    <div class = "income-column">
      <h4 class ="text-center">Debits</h4>
      <ul>`;

  // Fetch and display income entries
  const incomeEntries = document.querySelectorAll('#income-entries .entry');
  incomeEntries.forEach(entry => {
    const source = entry.querySelector('.source').value || 'Source';
    const amount = entry.querySelector('.amount').value || '0';
    receiptHTML += `<li>${source}: Shs. ${amount}</li>`;
  });
    receiptHTML += `</ul>
                  </div>
                  <div class="expense-column">
                    <h4 class ="text-center">Credits</h4>
                    <ul>`;

  // Fetch and display expense entries
  const expenseEntries = document.querySelectorAll('#expense-entries .entry');
  expenseEntries.forEach(entry => {
    const expense = entry.querySelector('.expense').value || 'Expense';
    const amount = entry.querySelector('.amount').value || '0';
    receiptHTML += `<li>${expense}: Shs. ${amount}</li>`;
  });
    receiptHTML += `</ul>
                  </div>
                </div>`;

  // Add totals below the grid
  let totalIncome = 0;
  let totalExpenses = 0;

  document.querySelectorAll('#income-entries .amount').forEach(input => {
    totalIncome += parseFloat(input.value.replace(/,/g, '')) || 0;
  });

  document.querySelectorAll('#expense-entries .amount').forEach(input => {
    totalExpenses += parseFloat(input.value.replace(/,/g, '')) || 0;
  });

  const remainingBudget = totalIncome - totalExpenses;

  receiptHTML += `
  <div class = "totals">
    <h4 class ="text-center">Totals</h4>
    <p class ="text-center">Total Income: Shs. ${totalIncome.toLocaleString('en-US')}</p>
    <p class ="text-center">Total Expenses: Shs. ${totalExpenses.toLocaleString('en-US')}</p>
    <p class ="text-center">Remaining Budget: Shs. ${remainingBudget.toLocaleString('en-US')}</p>
  </div>
  `;

  receiptContent.innerHTML = receiptHTML;
}
                                                                                                              /// Download Receipt /// 
function downloadReceipt(){
  const { jsPDF } = window.jspdf; //Access jsPDF from the jspdf namespace
  const receipt = document.getElementById("receipt-section");
  
  if (!receipt){
    console.error("Receipt section not found!");
    return;
  }

  html2canvas(receipt).then((canvas) => {
    const imgData =canvas.toDataURL("image/png");

    const pdf = new jsPDF();              
    const imgWidth = 190; //Width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG',10,10,imgWidth,imgHeight);

    pdf.save("receipt.pdf");
  }).catch((error) => {
    console.error("Error generating canvas:",error);
  });

}
                                                                                                      ///  End of Receipt ///
// Add event listener for the Enter key (restricted to a specific input field context)
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && document.activeElement.tagName !== 'INPUT') {
    event.preventDefault(); // Prevent default behavior (e.g., form submission)
    addIncomeEntry(); // Add a new income entry
  }
});
