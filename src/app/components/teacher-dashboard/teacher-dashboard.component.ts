import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ExamForm } from '../../pages/Exam/exam-form/exam-form';
import { ExamsList } from '../exams-list/exams-list';
import { ExamService } from '../../services/exam-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, ExamForm, ExamsList],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {
  tab: 'add' | 'list' | 'taken' = 'add';
  exams: any[] = [];
  selectedExam: any = null;
  examResults: any[] = [];
  loading = true;
  resultsLoading = false;

  constructor(public examService: ExamService, public cdr: ChangeDetectorRef, public router: Router) {}

  ngOnInit() {
    this.examService.getAvailableExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  viewResults(exam: any) {
    this.selectedExam = exam;
    this.resultsLoading = true;
    this.examService.getExamResults(exam.id || exam.Id).subscribe({
      next: (results) => {
        this.examResults = results;
        this.resultsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.resultsLoading = false; this.cdr.detectChanges(); }
    });
  }

  closeResults() {
    this.selectedExam = null;
    this.examResults = [];
  }
}
