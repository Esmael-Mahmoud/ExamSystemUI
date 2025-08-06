
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from './../../../services/exam-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-details.html',
  styleUrl: './exam-details.css'
})
export class ExamDetails implements OnInit {
  ExamId!: string | null;
  Exam: any;
  // Pagination
  currentPage = 1;
  pageSize = 5;
  constructor(
    private activatedRoute: ActivatedRoute,
    private ExamService: ExamService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ExamId = this.activatedRoute.snapshot.paramMap.get('id');
    this.ExamService.GetExamById(this.ExamId).subscribe({
      next: (response) => {
        this.Exam = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  get pagedQuestions() {
    if (!this.Exam || !this.Exam.Questions) return [];
    const start = (this.currentPage - 1) * this.pageSize;
    return this.Exam.Questions.slice(start, start + this.pageSize);
  }
  get totalPages() {
    if (!this.Exam || !this.Exam.Questions) return 1;
    return Math.ceil(this.Exam.Questions.length / this.pageSize);
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
