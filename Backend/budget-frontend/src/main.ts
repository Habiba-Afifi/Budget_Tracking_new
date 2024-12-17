import { bootstrapApplication } from '@angular/platform-browser'; 
import { AppComponent } from './app/app.component'; 
import { BudgetComponent } from './app/budget/budget.component'; // Adjust the path if necessary 
import { provideHttpClient } from '@angular/common/http'; 
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule 
import { provideRouter } from '@angular/router'; 
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; 


bootstrapApplication(AppComponent, { 
  providers: [ 
    provideHttpClient(), 
    provideRouter(routes), provideAnimationsAsync(), provideCharts(withDefaultRegisterables()) 
  ] 
}); 
 
bootstrapApplication(BudgetComponent, { 
  providers: [ 
    provideHttpClient() 
  ] 
});

