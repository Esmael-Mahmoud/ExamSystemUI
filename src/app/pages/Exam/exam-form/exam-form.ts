import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '../../../services/exam-service';
import { IQuestion, IChoice } from '../../../models/iquestion';

@Component({
  selector: 'app-exam-form',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './exam-form.html',
  styleUrl: './exam-form.css'
})
export class ExamForm implements OnInit {
  @Input() ExamId: any;
  Exam: any;

  ExamForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required, Validators.min(1)]),
    questions: new FormArray([]),
  });

  constructor(
    private examService: ExamService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // If ExamId is set as input (from parent, not via route), treat as add form
    if (this.ExamId === 0 || this.ExamId === '0') {
      this.ExamForm.patchValue({
        title: '',
        description: '',
        duration: '',
      });
      return;
    }
    // Otherwise, get from route (edit mode)
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.ExamId = params.get('id');
        this.ExamForm.patchValue({
          title: '',
          description: '',
          duration: '',
        });
        if (this.ExamId !== '0') {
          this.examService.GetExamById(this.ExamId).subscribe({
            next: (response) => {
              this.Exam = response;
              if (this.Exam) {
                this.ExamForm.patchValue({
                  title: this.Exam.title,
                  description: this.Exam.description,
                  duration: this.Exam.duration,
                });
                 this.getQuestions.clear();
                  console.log(this.Exam.questions);
                this.Exam.questions.forEach((question: any) => {
                  if(question.questionType==1){
                    question.questionType='TF';
                  }else{
                    question.questionType='MCQ';
                  }
                  const questionGroup = new FormGroup(
                    {
                      QuestionText: new FormControl(question.questionText, Validators.required),
                      QuestionType: new FormControl(question.questionType, Validators.required),
                      choices: new FormArray([]),
                    },
                    { validators: this.validateChoicesIfNeeded }
                  );

                  // Fill choices for each question
                  question.choices.forEach((choice: any) => {
                    const choiceGroup = new FormGroup({
                      ChoiceText: new FormControl(choice.choiceText, Validators.required),
                      IsCorrect: new FormControl(choice.isCorrect, Validators.required),
                    });
                    (questionGroup.get('choices') as FormArray).push(choiceGroup);
                  });

                  this.getQuestions.push(questionGroup);
                });
              }
            },
            error: (error) => { console.log(error); }
          });
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  get getTitle() {
    return this.ExamForm.controls['title'];
  }
  

  get getDescription() {
    return this.ExamForm.controls['description'];
  }
   

  get getDuration() {
    return this.ExamForm.controls['duration'];
  }

  get getQuestions():FormArray{
    return this.ExamForm.get('questions') as FormArray;
  }


addQuesField(){
 const quesGroup = new FormGroup(
  {
  QuestionText :new FormControl('',[Validators.required]),
  QuestionType :new FormControl('',[Validators.required]),
  choices:new FormArray([]),
 },

 {
  validators:this.validateChoicesIfNeeded   //custom validation
 }

)

 this.getQuestions.push(quesGroup);
}

removeQuesField(index:number){
  this.getQuestions.removeAt(index);
}

getChoices(quesIndex:number):FormArray{
return this.getQuestions.at(quesIndex).get('choices') as FormArray;
}

addChoice(quesIndex:number){
  const choices= this.getChoices(quesIndex);

  const choiceGroup= new FormGroup({
    ChoiceText:new FormControl('',[Validators.required]),
    IsCorrect:new FormControl(false,[Validators.required]),

  })
  choices.push(choiceGroup);
}

//if the ques is mcq and the user try to submit without adding choices
validateChoicesIfNeeded(group:AbstractControl):ValidationErrors|null
{
  const quesType= group.get('QuestionType')?.value;
  const choices = group.get('choices') as FormArray;
  if((quesType==='MCQ' || quesType==="TF") && choices.length<2)
  {
    return{missingChoices:true};
  }
  return null;
}

removeChoiceField(quesIndex:number,choiceIndex:number){
  const choices= this.getChoices(quesIndex);
  choices.removeAt(choiceIndex);
}

onQuestionTypeChange(quesIndex: number, event: any) {
  const questionType = event.target.value;
  const choices = this.getChoices(quesIndex);
  
  // Clear existing choices
  while (choices.length > 0) {
    choices.removeAt(0);
  }
  
  // If TF question, automatically add True and False choices
  if (questionType === 'TF') {
    // Add True choice
    const trueChoice = new FormGroup({
      ChoiceText: new FormControl('True', [Validators.required]),
      IsCorrect: new FormControl(false, [Validators.required])
    });
    choices.push(trueChoice);
    
    // Add False choice
    const falseChoice = new FormGroup({
      ChoiceText: new FormControl('False', [Validators.required]),
      IsCorrect: new FormControl(false, [Validators.required])
    });
    choices.push(falseChoice);
  }
}


  ExamHandler() {
    if (this.ExamForm.valid) {
      // Transform form data to match backend DTOs
      const formValue = this.ExamForm.value;
      const questions: IQuestion[] = (formValue.questions ?? []).map((q: any) => {
        const base: IQuestion = {
          questionText: q.QuestionText,
          questionType: q.QuestionType
        };
        if (q.QuestionType === 'MCQ') {
          base.choices = q.choices.map((c: any) => ({
            choiceText: c.ChoiceText,
            isCorrect: c.IsCorrect
          }));
        } else if (q.QuestionType === 'TF') {
          // Find which choice is correct (True/False)
            base.choices = q.choices.map((c: any) => ({
            choiceText: c.ChoiceText,
            isCorrect: c.IsCorrect
          }));
          const correct = q.choices.find((c: any) => c.IsCorrect);
          base.tfCorrectAnswer = correct ? correct.ChoiceText === 'True' : false;
        }
        // For Text, nothing extra needed
        return base;
      });
      const payload = {
        title: formValue.title,
        description: formValue.description,
        duration: formValue.duration,
        questions
      };
      if (this.ExamId && this.ExamId !== '0' && this.ExamId !== null && this.ExamId !== undefined) {
        // Update existing exam
        this.examService.EditExam(payload, this.ExamId).subscribe({
          next: (res) => {
            this.examService.notifyExamsChanged();
            this.router.navigate(['/exams']);
          },
          error: (error) => { alert(error.message); }
        });
      } else {
        // Add new exam
        this.examService.CreateExam(payload).subscribe({
          next: () => {
            this.examService.notifyExamsChanged();
            this.router.navigate(['/exams']);
          },
          error: (error) => { alert(error.message); }
        });
      }
    } else {
      console.log(this.ExamForm.errors);
    }
  }
}
