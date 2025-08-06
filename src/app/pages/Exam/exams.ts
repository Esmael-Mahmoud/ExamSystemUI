import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ExamsList } from "../../components/exams-list/exams-list";

@Component({
  selector: 'app-exams',
  imports: [ ExamsList],
  templateUrl: './exams.html',
  styleUrl: './exams.css'
})
export class Exams implements OnInit{
constructor (private cdr:ChangeDetectorRef){
}
  ngOnInit(): void {
  this.cdr.detectChanges();
  }
}
