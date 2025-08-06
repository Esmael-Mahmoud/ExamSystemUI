import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExamService } from '../../services/exam-service';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css']
})
export class TakeExamComponent implements OnInit,OnDestroy {
  examId: string = '';
  examDuration:number=0;
  remainingTime:string ='';
  private Timer:any;
  private endTime:Date|null=null;
  questions: any[] = [];
  form: FormGroup;
  loading = true;
  submitting = false;
  submitted = false;
  showResultButton = false;
  resultDetails: any = null; // Holds the result with correct answers after submission
  userRole: string | null = null;
  // Pagination
  currentPage = 1;
  pageSize = 5;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private examService: ExamService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      answers: this.fb.array([])
    });
  }
  ngOnDestroy(): void {
    if(this.Timer){
      clearInterval(this.Timer);
    }
  }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    this.examService.GetExamById(this.examId).subscribe(details=>{
      this.examDuration=details.duration||60;
      this.startTimer();
    })
    this.examService.getExamQuestions(this.examId).subscribe({
      next: (questions) => {
        // Map backend fields to frontend expected fields
        this.questions = questions.map((q: any) => ({
          id: q.id,
          text: q.questionText,
          type: q.questionType === 'MCQ' || q.questionType === 0 ? 'MCQ' : 
                q.questionType === 'TF' || q.questionType === 1 ? 'TF' : 'Text',
          choices: q.choices?.map((c: any) => ({
            id: c.id,
            text: c.choiceText
          })) || []
        }));
        this.initForm();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  initForm() {
    const answersArray = this.form.get('answers') as FormArray;
    answersArray.clear();
    this.questions.forEach(q => {
      if (q.type === 'MCQ' || q.type === 'TF') {
        answersArray.push(this.fb.group({ questionId: q.id, choiceId: [null, Validators.required] }));
      } else {
        answersArray.push(this.fb.group({ questionId: q.id, textAnswer: ['', Validators.required] }));
      }
    });
  }
submitExam(forceSubmit: boolean = false) {
  if (this.Timer) {
    clearInterval(this.Timer);
  }

  // Skip validation and confirmation for forced submission (when time ends)
  if (!forceSubmit) {
    if (this.form.invalid) return;
    if (!this.submitted && !confirm('Are you sure you want to submit your answers?')) return;
  }

  this.submitting = true;
  
  const payload = { answers: this.form.value.answers };
  console.log('Form payload:', JSON.stringify(payload, null, 2));
  console.log('Questions:', this.questions);
  
  this.examService.submitExam(this.examId, payload).subscribe({
    next: (result) => {
      alert('Exam submitted successfully!');
      this.submitted = true;
      this.showResultButton = true;
      this.resultDetails = result;
      this.submitting = false;
      this.router.navigate(['/AvailableExams']);
      this.cdr.detectChanges();
    },
    error: () => {
      this.submitting = false;
      alert('Submission failed. Try again.');
      this.cdr.detectChanges();
    }
  });
}

  goToDashboard() {
    this.router.navigate(['/']);
  }


  get pagedAnswersArray(): number[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return Array.from({ length: Math.min(this.pageSize, this.questions.length - start) }, (_, i) => start + i);
}


get totalPages(): number {
  return Math.ceil(this.questions.length / this.pageSize);
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


  startTimer(){
    this.endTime=new Date();
    this.endTime.setMinutes(this.endTime.getMinutes()+this.examDuration);
    this.Timer= setInterval(() => {
     this.updateRemainingTime();
    }, 1000);
  }

updateRemainingTime(){
  if(!this.endTime) return;

  const now=new Date();
  const diff= this.endTime.getTime()-now.getTime();

  if(diff<=0){
    clearInterval(this.Timer);
    this.remainingTime='00:00:00';
    if(!this.submitted){
      this.forceFormCompletion();
      this.submitExam(true);
    }
    return;
  }

  const hours= Math.floor(diff/(1000*60*60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.remainingTime = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    this.cdr.detectChanges();
}


forceFormCompletion() {
  const answersArray = this.form.get('answers') as FormArray;
  
  answersArray.controls.forEach((answerGroup, index) => {
    const question = this.questions[index];
    
    // If it's a MCQ/TF question and no answer was selected
    if ((question.type === 'MCQ' || question.type === 'TF') && !answerGroup.value.choiceId) {
      // Select the first option if available
      if (question.choices && question.choices.length > 0) {
        answerGroup.patchValue({ choiceId: question.choices[0].id });
      }
    }
   
  });
  
  // Mark all controls as touched to ensure validation passes
  answersArray.controls.forEach(control => {
    control.markAsTouched();
  });
}

isTimeWarning(): boolean {
  if (!this.endTime || !this.remainingTime) return false;
  const now = new Date();
  const diff = this.endTime.getTime() - now.getTime();
  return diff < (this.examDuration * 60 * 1000 * 0.3); // 30% of time remaining
}

isTimeCritical(): boolean {
  if (!this.endTime || !this.remainingTime) return false;
  const now = new Date();
  const diff = this.endTime.getTime() - now.getTime();
  return diff < (this.examDuration * 60 * 1000 * 0.1); // 10% of time remaining
}




}
