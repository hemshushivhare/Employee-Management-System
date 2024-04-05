// dialog.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  @Input() title: string = "";
  @Input() content: string = "";
  @Output() dialogClosed = new EventEmitter<boolean>();
  @Output() actionConfirmed = new EventEmitter<boolean>();

  closeDialog(event: MouseEvent) {
    // Check if the click event originated from the backdrop
    if (event.target === event.currentTarget) {
      this.dialogClosed.emit(true);
    }
  }

  confirmAction() {
    // Emitting an event to notify parent component that action is confirmed
    this.actionConfirmed.emit(true);
  }
}
