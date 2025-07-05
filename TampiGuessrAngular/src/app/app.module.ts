import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TampiButtonComponent } from '../components/TampiButton/TampiButton.component';
import { EmojiButtonComponent } from '../EmojiButton/EmojiButton.component';

@NgModule({
  declarations: [
    AppComponent,
    TampiButtonComponent,
    EmojiButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
