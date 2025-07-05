import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-emoji-button',
  templateUrl: './EmojiButton.html',
  styleUrls: ['./EmojiButton.css']
})
export class EmojiButtonComponent {
  @Input() emoji: string = '😀';
  @Input() link: string = '';
  @Input() color: string = '#ff6b6b';

  constructor() { }

  onButtonClick() {
    if (this.link) {
      window.open(this.link, '_blank');
    }
  }
}
