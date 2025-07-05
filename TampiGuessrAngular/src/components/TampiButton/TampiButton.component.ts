import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tampi-button',
  templateUrl: './TampiButton.html',
  styleUrls: ['./TampiButton.css']
})
export class TampiButtonComponent {
  @Input() text: string = 'Botón';
  @Input() icon: string = '';
  @Input() color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' = 'primary';
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() loading: boolean = false;
  @Input() circular: boolean = false;
  
  @Output() onClick = new EventEmitter<void>();

  onButtonClick() {
    if (!this.disabled && !this.loading) {
      this.onClick.emit();
    }
  }

  getButtonClasses(): string {
    let classes = 'tampi-button';
    
    // Color
    classes += ` tampi-button--${this.color}`;
    
    // States
    if (this.disabled) classes += ' tampi-button--disabled';
    if (this.loading) classes += ' tampi-button--loading';
    if (this.fullWidth) classes += ' tampi-button--full-width';
    if (this.circular) classes += ' circular';
    
    return classes;
  }
}
