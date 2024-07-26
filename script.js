document.addEventListener('DOMContentLoaded', () => {
    const totalBudgetInput = document.getElementById('totalBudget');
    const setBudgetBtn = document.getElementById('setBudgetBtn');
    const expenseNameInput = document.getElementById('expenseName');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const displayBudget = document.getElementById('displayBudget');
    const totalSpent = document.getElementById('totalSpent');
    const remainingAmount = document.getElementById('remainingAmount');
    const expenseList = document.getElementById('expenseList');

    let totalBudget = parseFloat(localStorage.getItem('totalBudget')) || 0;
    let spentAmount = 0;
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    displayBudget.textContent = totalBudget;
    updateSpentAmount();
    updateRemainingAmount();
    renderExpenses();


    setBudgetBtn.addEventListener('click', () => {
        const budgetValue = parseFloat(totalBudgetInput.value);
        if (isNaN(budgetValue) || budgetValue <= 0) {
            alert ("Please enter a valid budget amount.")
            return;
        }
        totalBudget = budgetValue;
        localStorage.setItem('totalBudget', totalBudget);
        displayBudget.textContent = totalBudget;
        updateRemainingAmount();
        totalBudgetInput.value = '';
    });

    addExpenseBtn.addEventListener('click', () => {
        const expenseName = expenseNameInput.value;
        const expenseAmount = parseFloat(expenseAmountInput.value);

        if (expenseName && !isNaN(expenseAmount)) {
            const expense = { id: Date.now(), name: expenseName, amount: expenseAmount };
            expenses.push(expense);
            spentAmount += expenseAmount;
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpenses();

            updateSpentAmount();
            updateRemainingAmount();

            expenseNameInput.value = '';
            expenseAmountInput.value = '';
        } else {
            alert('Please enter valid expense name and amount.');
        }
    });

    function updateSpentAmount() {
        spentAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        totalSpent.textContent = spentAmount;
    }

    function updateRemainingAmount() {
        const remaining = totalBudget - spentAmount;
        remainingAmount.textContent = remaining;
    }

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const tr = document.createElement('tr');
            tr.className = 'expense-item';
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${expense.name}</td>
                <td>#${expense.amount}</td>
                <td class="edit-buttons">
                    <button onclick="editExpense(${expense.id})">Edit</button>
                    <button class="delete-button" onclick="deleteExpense(${expense.id})">Delete</button>
                </td>
            `;
            expenseList.appendChild(tr)
        });
    }

    window.editExpense = (id) => {
        const expense = expenses.find(exp => exp.id === id)
        if (expense) {
            expenseNameInput.value = expense.name
            expenseAmountInput.value = expense.amount
            deleteExpense(id)
        }
    };

    window.deleteExpense = (id) => {
        const expenseIndex = expenses.findIndex(exp => exp.id === id);
        if (expenseIndex > -1) {
            spentAmount -= expenses[expenseIndex].amount;
            expenses.splice(expenseIndex, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpenses();
            updateSpentAmount();
            updateRemainingAmount();
        }
    };
});
