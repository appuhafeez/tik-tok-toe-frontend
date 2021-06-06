import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ToolbarComponentComponent } from './components/toolbar-component/toolbar-component.component';
import { WebsocketServiceService } from './services/websocket-service/websocket-service.service';
import { GameComponentComponent } from './components/game-component/game-component.component';
import { HomeScreenComponent } from './components/home-screen/home-screen.component';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { Routes, RouterModule, Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRegisterComponent } from './components/login-register/login-register.component';

const routes: Routes = [
  {path: 'home', component: HomeScreenComponent},
  {path: 'game/:code',component: GameComponentComponent},
  {path: 'game',component: GameComponentComponent},
  {path: "login", component: LoginRegisterComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponentComponent,
    GameComponentComponent,
    HomeScreenComponent,
    LoginRegisterComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDividerModule,
    FontAwesomeModule,
    FormsModule,
    ClipboardModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  providers: [WebsocketServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
