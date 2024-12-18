import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FinancialDataService } from '../dashboard.service'; // Import the service
import { Chart, registerables } from 'chart.js';  // Import Chart.js and registerables
import { CommonModule } from '@angular/common'; // Import CommonModule for CurrencyPipe
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [FormsModule, CommonModule],
})
export class DashboardComponent implements OnInit, AfterViewInit, AfterViewChecked {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  savings: number = 0;
  goals: any[] = [];

  incomeChartData: any;
  expenseChartData: any;

  incomeBySourceChartData: any;
  expenseByCategoryChartData: any;
  goalProgressChartData: any;
  expenseByDateChartData: any;
  incomeByDateChartData: any;  // Add this property
  recurringNonRecurringChartData: any;  // New chart data for recurring vs non-recurring expenses

  userId: string = '';  // Declare userId variable

  constructor(
    private financialDataService: FinancialDataService
  ) {
    // Register necessary Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';  
    if (this.userId) {
      this.loadFinancialData();
      this.loadGoals();
    } else {
      console.error('User ID is not available in localStorage');
    }

    this.totalIncome = parseFloat(localStorage.getItem(totalIncome_${this.userId}) || '0');
    this.totalExpenses = parseFloat(localStorage.getItem(totalExpenses_${this.userId}) || '0');
    const savedAmount = parseFloat(localStorage.getItem(savedAmount_${this.userId}) || '0');

    // Calculate savings
    this.savings = savedAmount;
  }

  ngAfterViewInit(): void {
    console.log('Rendering Income and Expense Charts');
    // Rendering all the charts after the view is initialized
    this.renderIncomeBySourceChart();
    this.renderExpenseByCategoryChart();
    this.renderGoalProgressChart();
    this.renderExpenseByDateChart();
    this.recurringNonRecurringChartData();
  }

  ngAfterViewChecked(): void {
    // Re-render the charts if necessary
    
    if (this.incomeBySourceChartData) {
      this.renderIncomeBySourceChart();
    }
    if (this.expenseByCategoryChartData) {
      this.renderExpenseByCategoryChart();
    }
    if (this.goalProgressChartData) {
      this.renderGoalProgressChart();
    }
    if (this.expenseByDateChartData) {
      this.renderExpenseByDateChart();
    }
    if(this.recurringNonRecurringChartData){
      this.renderRecurringNonRecurringChart();
    }
  }

  loadFinancialData(): void {
    // Retrieve income and expenses data from the FinancialDataService for chart generation only
    this.financialDataService.getIncomes(this.userId).subscribe(
      (incomeData) => {
        this.generateIncomeBySourceChart(incomeData);
        this.renderIncomeBySourceChart(); // Render the Income vs. Source chart
        
      },
      (error) => {
        console.error('Error fetching income data:', error);
      }
    );

    this.financialDataService.getExpenses(this.userId).subscribe(
      (expenseData) => {
        this.generateExpenseByCategoryChart(expenseData);
        this.renderExpenseByCategoryChart(); // Render the Expense vs. Date chart

        this.generateExpenseByDateChart(expenseData); // Generate data for Expense vs. Date chart
        this.renderExpenseByDateChart(); // Render the Expense vs. Date chart
        this.generateRecurringNonRecurringChart(expenseData);
        this.renderRecurringNonRecurringChart();

      },
      (error) => {
        console.error('Error fetching expense data:', error);
      }
    );
  }

  loadGoals(): void {
    if (this.userId) {
      this.financialDataService.getGoals(this.userId).subscribe(
        (data) => {
          this.goals = data;
  
          // Directly use the progress from API response
          this.goals.forEach((goal: any) => {
            goal.progress = goal.progress || 0; // Ensure progress exists
          });
  
          // Generate chart data and render the chart
          this.generateGoalProgressChart(this.goals); 
          this.renderGoalProgressChart();
        },
        (error) => {
          console.error('Error fetching goals', error);
        }
      );
    } else {
      console.error('User ID is missing.');
    }
  }
  
  generateGoalProgressChart(goals: any[]): void {
    // Generate chart data for goals
    this.goalProgressChartData = {
      labels: goals.map(goal => goal.title), // Use goal titles as labels
      datasets: [
        {
          label: 'Goal Progress (%)',
          data: goals.map(goal => goal.progress), // Use progress from API
          backgroundColor: [
            '#C7AE6A', '#000000', '#d5c28f', '#b99a45',
            '#1a1a1a', '#e3d6b4', '#FF6384', '#36A2EB', // Adjusted color palette
          ].slice(0, goals.length), // Match the colors to the number of goals
          hoverOffset: 4,
        },
      ],
    };
  }
  
  generateIncomeBySourceChart(incomeData: any): void {
    // Group income by source
    const incomeBySource = incomeData.reduce((acc: any, income: any) => {
      acc[income.sourceName] = (acc[income.sourceName] || 0) + income.amount;
      return acc;
    }, {});
  
    this.incomeBySourceChartData = {
      labels: Object.keys(incomeBySource),
      datasets: [
        {
          label: 'Income by Source',
          data: Object.values(incomeBySource),
          backgroundColor: ['#b99a45','#C7AE6A','#d5c28f'] // Updated color
        },
      ],
    };    
  }
  

  generateExpenseByCategoryChart(expenseData: any): void {
    // Group expenses by category
    const expenseByCategory = expenseData.reduce((acc: any, expense: any) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    this.expenseByCategoryChartData = {
      labels: Object.keys(expenseByCategory),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(expenseByCategory),
          backgroundColor: ['#C7AE6A', '#000000', '#d5c28f', '#b99a45'],  // Updated colors
        },
      ],
    };    
  }

  

  // Method to render the Income by Source chart
  renderIncomeBySourceChart(): void {
    const ctx = (document.getElementById('incomeBySourceChart') as HTMLCanvasElement).getContext('2d');
    if (ctx && this.incomeBySourceChartData) {
      new Chart(ctx, {
        type: 'bar',  // Set the chart type to 'bar' for income source vs amount
        data: this.incomeBySourceChartData,
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,  // Ensures the X-axis starts from zero
              title: {
                display: true,
                text: 'Income Source',  // Title for the X-axis
              },
            },
            y: {
              beginAtZero: true,  // Ensures the Y-axis starts from zero
              title: {
                display: true,
                text: 'Income Amount',  // Title for the Y-axis
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',  // Legend position
            },
          },
        },
      });
    }
  }
  

  // Method to render the Expense by Category chart
  renderExpenseByCategoryChart(): void {
    const ctx = (document.getElementById('expenseByCategoryChart') as HTMLCanvasElement).getContext('2d');
    if (ctx && this.expenseByCategoryChartData) {
      new Chart(ctx, {
        type: 'doughnut',
        data: this.expenseByCategoryChartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }
  }
  renderGoalProgressChart(): void {
    const ctx = (document.getElementById('goalProgressChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx || !this.goalProgressChartData) {
      console.error('Canvas for Goal Progress Chart not found or chart data is missing.');
      return;
    }
  
    new Chart(ctx, {
      type: 'doughnut',
      data: this.goalProgressChartData,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const percentage = context.raw as number;
                return ${context.label}: ${percentage.toFixed(2)}%;
              },
            },
          },
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
  generateExpenseByDateChart(expenseData: any): void {
    // Group expenses by date
    const expensesByDate = expenseData.reduce((acc: any, expense: any) => {
      const date = new Date(expense.date).toLocaleDateString(); // Format date as "MM/DD/YYYY"
      acc[date] = (acc[date] || 0) + expense.amount;
      return acc;
    }, {});
  
    this.expenseByDateChartData = {
      labels: Object.keys(expensesByDate),
      datasets: [
        {
          label: 'Expenses by Date',
          data: Object.values(expensesByDate),
          backgroundColor: '#C7AE6A',  // Updated color
          borderColor: '#000000', // Updated border color
          borderWidth: 1,
        },
      ],
    };    
  }
  
  renderExpenseByDateChart(): void {
    const ctx = (document.getElementById('expenseByDateChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx || !this.expenseByDateChartData) {
      console.error('Canvas for Expense by Date Chart not found or chart data is missing.');
      return;
    }
  
    new Chart(ctx, {
      type: 'line', // Use a line chart to show trends over time
      data: this.expenseByDateChartData,
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: false, // Dates typically won't start at zero
            title: {
              display: true,
              text: 'Date', // X-axis title
            },
          },
          y: {
            beginAtZero: true, // Expense amounts should start at zero
            title: {
              display: true,
              text: 'Expense Amount', // Y-axis title
            },
          },
        },
        plugins: {
          legend: {
            position: 'top', // Position the legend at the top
          },
        },
      },
    });
  }
  generateRecurringNonRecurringChart(expenseData: any): void {
    // Filter expenses into recurring and non-recurring categories
    const recurringExpenses = expenseData.filter((expense: any) => expense.isRecurring);
    const nonRecurringExpenses = expenseData.filter((expense: any) => !expense.isRecurring);
  
    // Generate chart data for recurring vs non-recurring expenses
    this.recurringNonRecurringChartData = {
      labels: ['Recurring', 'Non-Recurring'],
      datasets: [
        {
          label: 'Expenses',
          data: [
            recurringExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0),
            nonRecurringExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0)
          ],
          backgroundColor: ['#C7AE6A', '#000000'],  // Updated colors
          hoverOffset: 4,
        },
      ],
    };    
  }
  
  

  // Render the recurring vs non-recurring expenses pie chart
  renderRecurringNonRecurringChart(): void {
    const ctx = (document.getElementById('recurringNonRecurringChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx || !this.recurringNonRecurringChartData) {
      console.error('Canvas for Recurring vs Non-Recurring Expenses Chart not found or chart data is missing.');
      return;
    }

    new Chart(ctx, {
      type: 'pie',  // Pie chart for recurring vs non-recurring expenses
      data: this.recurringNonRecurringChartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
}
