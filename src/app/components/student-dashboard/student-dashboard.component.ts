import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam-service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  tab: 'available' | 'taken' | 'results' | 'review' = 'available';
  availableExams: any[] = [];
  takenExams: any[] = [];
  studentResults: any[] = [];
  loading = true;
  resultsLoading = true;
  reviewExam: any = null;

  constructor(private examService: ExamService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.examService.getAvailableExams().subscribe({
      next: (response) => {
        let exams: any[] = [];
        if (response && typeof response === 'object' && 'exams' in response) {
          exams = Array.isArray((response as any).exams) ? (response as any).exams : [];
        } else if (Array.isArray(response)) {
          exams = response;
        }
        this.examService.getStudentResults().subscribe({
          next: (results) => {
            this.studentResults = results;
            const takenExamIds = new Set(results.map((r: any) => r.examId || r.ExamId));
            this.availableExams = exams.filter(e => !takenExamIds.has(e.id || e.Id));
            this.takenExams = exams.filter(e => takenExamIds.has(e.id || e.Id));
            this.loading = false;
            this.resultsLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.availableExams = exams;
            this.loading = false;
            this.resultsLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startExam(exam: any) {
    this.router.navigate(['/exams', exam.id]);
  }

  viewExamDetails(exam: any) {
    // Fetch the student's result for this exam
    const result = this.studentResults.find(r => (r.examId || r.ExamId) === (exam.id || exam.Id));
    if (result && result.answers) {
    }
    if (!result) {
      this.reviewExam = { title: exam.title, questions: [] };
      this.tab = 'review';
      return;
    }
    // Fetch exam questions and map answers for review
    this.examService.getExamQuestions(exam.id || exam.Id).subscribe({
      next: (questions) => {
        // Map each question with correct/wrong answers
            const reviewQuestions = questions.map((q: any) => {
              let userAnswer = (result.studentAnswers || []).find((a: any) => a.questionId === q.id);
          let answers: any[] = [];
          if (q.choices) {
            answers = q.choices.map((choice: any) => {
              const isUserSelected = userAnswer && userAnswer.choiceId === choice.id;
              return {
                text: choice.choiceText,
                isCorrect: isUserSelected && userAnswer.isCorrect,
                isWrong: isUserSelected && !userAnswer.isCorrect,
                selected: isUserSelected
              };
            });
          } else if (q.questionType === 'TF') {
            answers = [
              {
                text: 'True',
                isCorrect: userAnswer && userAnswer.tfAnswer === true && q.tfCorrectAnswer === true,
                isWrong: userAnswer && userAnswer.tfAnswer === true && q.tfCorrectAnswer !== true,
                selected: userAnswer && userAnswer.tfAnswer === true
              },
              {
                text: 'False',
                isCorrect: userAnswer && userAnswer.tfAnswer === false && q.tfCorrectAnswer === false,
                isWrong: userAnswer && userAnswer.tfAnswer === false && q.tfCorrectAnswer !== false,
                selected: userAnswer && userAnswer.tfAnswer === false
              }
            ];
          } else {
            answers = [{
              text: userAnswer ? userAnswer.textAnswer : '',
              isCorrect: userAnswer && userAnswer.textAnswer === q.correctAnswer,
              isWrong: userAnswer && userAnswer.textAnswer !== q.correctAnswer,
              selected: true
            }];
          }
          return {
            text: q.questionText || q.text,
            answers
          };
        });
        this.reviewExam = { title: exam.title, questions: reviewQuestions };
        this.tab = 'review';
        this.cdr.detectChanges();
      },
      error: () => {
        this.reviewExam = { title: exam.title, questions: [] };
        this.tab = 'review';
        this.cdr.detectChanges();
      }
    });
  }

  closeReview() {
    this.reviewExam = null;
    this.tab = 'taken';
  }
}
