import { Routes } from '@angular/router';
import { BudgetComponent } from './budget/budget.component';
import { IncomeTrackerComponent } from './income/income.component';
import { ExpenseTrackerComponent } from './expense-tracker/expense-tracker.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { GoalSettingComponent } from './goal-setting/goal-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
 
export const routes: Routes = [
  { path: 'budget', component: BudgetComponent },
  { path: 'income', component: IncomeTrackerComponent },
  { path: 'expense', component: ExpenseTrackerComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'goals', component: GoalSettingComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'report', component: ReportComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
