import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TampiButtonComponent } from '../components/TampiButton/TampiButton.component';
import { EmojiButtonComponent } from '../EmojiButton/EmojiButton.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';
import { LeaderboardService } from './leaderboard/leaderboard.service';

// Firebase imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    TampiButtonComponent,
    EmojiButtonComponent,
    LeaderboardComponent,
    GameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  providers: [LeaderboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
