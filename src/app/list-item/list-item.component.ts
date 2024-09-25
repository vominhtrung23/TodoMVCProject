import { ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter, SimpleChanges, forwardRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormControl, ReactiveFormsModule, AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, ListItemComponent],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListItemComponent),
      multi: true
    }
  ]
})

export class ListItemComponent {
  @Input() parentForm!: FormGroup;
  @Input() itemsTodoschild!: any;
  @Input() originalItems: any;

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {}
  
  onCheckChange(target: any, index: any, item: any) {
    item.patchValue({ isComplete: target.checked });
    this.originalItems.value.map((Object: any) => {
      if (Object.taskTitle == item.value.taskTitle) {
        Object.isComplete = target.checked;
      }
    });
    this.cd.detectChanges();
  }
  removeItem(index: any, item: any) {
    this.itemsTodoschild.removeAt(index);
    const itemIndex = this.originalItems.value.findIndex((Object: any) => Object.taskTitle == item.value.taskTitle);

    if (itemIndex !== -1) {
      this.originalItems.removeAt(itemIndex);
    }

    this.cd.detectChanges();
  }

}



