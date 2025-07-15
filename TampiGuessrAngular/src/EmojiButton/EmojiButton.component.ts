import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-emoji-button',
  templateUrl: './EmojiButton.html',
  styleUrls: ['./EmojiButton.css']
})
export class EmojiButtonComponent {
  @Input() emoji: string = '😀';
  @Input() svgIcon: string = ''; // Nueva propiedad para SVG
  @Input() link: string = '';
  @Input() color: string = '#ff6b6b';
  @Output() click = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) { }

  onButtonClick() {
    if (this.link) {
      window.open(this.link, '_blank');
    } else {
      this.click.emit();
    }
  }

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.svgIcon);
  }

  get hasIcon(): boolean {
    return this.svgIcon.length > 0;
  }
}
