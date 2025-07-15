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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
