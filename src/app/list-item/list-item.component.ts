import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface IlistItems {
  isComplete: any;
  taskTitle: any;
}
@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, ListItemComponent],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css',
})

export class ListItemComponent {
  isComplete = false;
  checkToggleAll = false;
  profileForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
    this.profileForm = this.formBuilder.group({
      taskTitle: [''],
      itemsTodos: this.formBuilder.array([]),
      originalItems: this.formBuilder.array([]),
    });
  }

  get itemsTodos() {
    return this.profileForm.get('itemsTodos') as FormArray;
  }
  get originalItems() {
    return this.profileForm.get('originalItems') as FormArray;
  }
  onKeydown(event: KeyboardEvent) {

    if (event.key === "Enter" && this.profileForm.value.taskTitle != "") {
      this.addTodos();
      this.profileForm.controls['taskTitle'].setValue("");
    }

  }

  addTodos() {
    const fieldForm = this.formBuilder.group({
      taskTitle: [this.profileForm.value.taskTitle],
      isComplete: [false]
    });

    this.itemsTodos.push(fieldForm);
    this.addToOriginal();
  }

  toggleAll() {
    this.checkToggleAll = !this.checkToggleAll;
    this.patchValue(this.itemsTodos);
    this.patchValue(this.originalItems);
  }

  onCheckChange(target: any, index: any, item: any) {

    this.originalItems.value.map((Object: any) => {
      if (Object.taskTitle == item.value.taskTitle) {
        Object.isComplete = target.checked;
      }
    });

    this.cd.detectChanges();
  }
  removeItem(index: any, item: any) {
    this.itemsTodos.removeAt(index);
    const itemIndex = this.originalItems.value.findIndex((Object: any) => Object.taskTitle == item.value.taskTitle);

    if (itemIndex !== -1) {
      this.originalItems.removeAt(itemIndex);
    }

    this.cd.detectChanges();
  }

  completed() {
    const activeItem = this.originalItems.value.filter((item: any) => item.isComplete == true);
    this.itemsTodos.clear();

    activeItem.forEach((item: any) => {
      this.pushObjectToItemsTodos(item);

    });

    this.cd.detectChanges();
  }

  active() {
    const activeItem = this.originalItems.value.filter((item: any) => item.isComplete == false);
    this.itemsTodos.clear();

    activeItem.forEach((item: any) => {
      this.pushObjectToItemsTodos(item);
    });

    this.cd.detectChanges();
  }

  all() {
    this.itemsTodos.clear();

    this.originalItems.value.forEach((item: any) => {
      this.pushObjectToItemsTodos(item);
    });

    this.cd.detectChanges();
  }
  
  clearCompleted() {
    this.cleaItemInList(this.itemsTodos);
    this.cleaItemInList(this.originalItems);
    this.cd.detectChanges();
  }

  pushObjectToItemsTodos(item: any) {
    this.itemsTodos.push(this.formBuilder.group(item));
  }

  addToOriginal() {
    this.profileForm.setControl('originalItems', this.formBuilder.array(this.itemsTodos.controls.map(control => control)));
  }

  patchValue(listItems: any) {
    listItems.controls.forEach((item: any) => {
      item.patchValue({ isComplete: this.checkToggleAll });
    });
  }

  cleaItemInList(listItems: any) {
    for (let i = listItems.length - 1; i >= 0; i--) {
      const item = listItems.at(i);
      if (item.value.isComplete) {
        listItems.removeAt(i);
      }
    }
  }


}

