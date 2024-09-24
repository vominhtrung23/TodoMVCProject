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
    isDarkTheme = false;
    profileForm: FormGroup;
  constructor(private formBuilder: FormBuilder,private cd: ChangeDetectorRef) {
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
    // TODO: Use EventEmitter with form value
    if (event.key === "Enter" && this.profileForm.value.taskTitle != "") {
      this.addTodos();
      this.profileForm.controls['taskTitle'].setValue("");
    }
  }
  addTodos() {
    const lessonForm = this.formBuilder.group({
      taskTitle: [this.profileForm.value.taskTitle],
      isComplete: [false]
    });
    this.itemsTodos.push(lessonForm);
    this.profileForm.setControl('originalItems', this.formBuilder.array(this.itemsTodos.controls.map(control => control)));
  }

  toggleAll() {
    this.isDarkTheme = !this.isDarkTheme;
    this.itemsTodos.controls.forEach( item => {
        item.patchValue({isComplete : this.isDarkTheme});
    });
    
  }
  onCheckChange(target: any, index: any,item:any) {
    
   this.originalItems.value.map((Object:any) => {
      if (Object.taskTitle == item.value.taskTitle) {
           Object.isComplete = target.checked;
      }
  });
    this.cd.detectChanges();  
  }
  removeItem(index: any,item:any) {
    this.itemsTodos.removeAt(index);
    const itemIndex = this.originalItems.value.findIndex((Object: any) => Object.taskTitle == item.value.taskTitle);
    // Nếu tìm thấy object, xóa object đó
    if (itemIndex !== -1) {
        this.originalItems.removeAt(itemIndex);
    }
    console.log(" this.originalItems", this.originalItems.value);
    this.cd.detectChanges(); 
  }

  completed() {
    const activeItem =  this.originalItems.value.filter((item:any) =>item.isComplete == true);
    this.itemsTodos.clear();
    activeItem.forEach((item:any) => {
      this.itemsTodos.push(this.formBuilder.group(item)); 
    });
    this.cd.detectChanges();
   
  }
  active() {
    const activeItem =  this.originalItems.value.filter((item:any) =>item.isComplete == false);
    this.itemsTodos.clear();
    activeItem.forEach((item:any) => {
      this.itemsTodos.push(this.formBuilder.group(item)); 
    });
    this.cd.detectChanges();
  }
  all() {
    this.itemsTodos.clear();
     this.originalItems.controls.forEach(item => {
      this.itemsTodos.push(this.formBuilder.group(item.value)); 
    });
    this.cd.detectChanges();
  }
  clearCompleted(){
    for (let i = this.itemsTodos.length - 1; i >= 0; i--) {
      const item = this.itemsTodos.at(i);
      if (item.value.isComplete) {
        this.itemsTodos.removeAt(i);
      }
    }
    for (let i = this.originalItems.length - 1; i >= 0; i--) {
      const item = this.originalItems.at(i);
      if (item.value.isComplete) {
        this.originalItems.removeAt(i);
      }
    }
    this.cd.detectChanges(); 
  }
}

