import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reply-message-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title class="!m-0 !p-6 !pb-4 text-xl font-bold text-gray-800 border-b border-gray-200">
      {{ data.title }}
    </h2>
    
    <mat-dialog-content class="!m-0 !p-6">
      <div class="custom-form-field">
        <label class="custom-label" for="replyMessage">Ответное сообщение</label>
        <textarea
          id="replyMessage"
          [(ngModel)]="message"
          placeholder="Введите ваш ответ"
          rows="4"
          class="custom-input resize-none"
          required
          #messageInput="ngModel"
        ></textarea>
        <p class="custom-error" *ngIf="messageInput.invalid && (messageInput.dirty || messageInput.touched)">
          Ответ обязательно
        </p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="!m-0 !p-4 !px-6 border-t border-gray-200 bg-gray-50 gap-3">
      <button mat-button (click)="onCancel()">Отмена</button>
      <button mat-raised-button 
              color="primary" 
              (click)="onSubmit()"
              [disabled]="!message?.trim()">
        Сохранить
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
    }
    ::ng-deep .mat-mdc-dialog-container {
      padding: 0 !important;
    }
    .custom-form-field {
      @apply space-y-1.5;
    }
    .custom-label {
      @apply block text-sm font-medium text-gray-700;
    }
    .custom-input {
      @apply block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400;
    }
    .custom-error {
      @apply text-sm text-red-600;
    }
  `]
})
export class ReplyMessageDialogComponent {
  message: string;

  constructor(
    public dialogRef: MatDialogRef<ReplyMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {
    this.message = data.message || '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.message?.trim()) {
      this.dialogRef.close(this.message);
    }
  }
} 