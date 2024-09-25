import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from "./list-item/list-item.component";
import { FooterComponent } from "./footer/footer.component";
// export interface IlistItems {
//   isComplete: any;
//   taskTitle: any;
// }
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, ListItemComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  isComplete = false;
  checkToggleAll = false;
  profileForm: FormGroup;
  itemsTodosValues: any[] = [];
  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
    this.profileForm = this.formBuilder.group({
      taskTitle: [''],
      itemsTodos: this.formBuilder.array([]),
      originalItems: this.formBuilder.array([]),
    });
  }
  ngOnInit() {
  }
  get itemsTodos(): FormArray {
    return this.profileForm.get('itemsTodos') as FormArray;
  }
  get originalItems(): FormArray {
    return this.profileForm.get('originalItems') as FormArray;
  }
  onKeydown(event: KeyboardEvent) {

    if (event.key === "Enter" && this.profileForm.value.taskTitle != "") {
      this.addNewTitle();
      this.profileForm.controls['taskTitle'].setValue("");
    }

  }
  
  addNewTitle() {
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
  
  addToOriginal() {
    this.profileForm.setControl('originalItems', this.formBuilder.array(this.itemsTodos.controls.map(control => control)));
  }

  patchValue(listItems: any) {
    listItems.controls.forEach((item: any) => {
      item.patchValue({ isComplete: this.checkToggleAll });
    });
  }

}
