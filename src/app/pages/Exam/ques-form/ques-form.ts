
// import { CommonModule } from '@angular/common';
// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import {
//   AbstractControl,
//   FormArray,
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   ValidationErrors,
//   Validators,
// } from '@angular/forms';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { QuestionService } from '../../../services/question-service';

// @Component({
//   selector: 'app-ques-form',
//   imports: [ReactiveFormsModule,CommonModule,RouterLink],
//   templateUrl: './ques-form.html',
//   styleUrl: './ques-form.css'
// })

// export class QuesForm implements OnInit {
//   QuesId: any;
//   Ques:any;

//   constructor(
//     private quesService: QuestionService,
//     private activatedRoute: ActivatedRoute,
//     private router: Router,
//     private cdr:ChangeDetectorRef,
   
//   ) {}
//  ngOnInit(): void {
//    this.activatedRoute.paramMap.subscribe({
//       next:(params)=>{
//       this.QuesId = params.get('id');
//       this.QuesForm.patchValue({
//         QuestionText:'',
//         QuestionType:'',
      
        
//       });
//       },
//       error:(error)=>{
//         console.log(error);
//       }
//     });
//     if (this.QuesId!='0') {
//        this.quesService.get(this.ExamId).subscribe({
//         next:(response)=>{
//           this.Exam =response;
          
//             if (this.Exam) {
//               this.ExamForm.patchValue({ // to fill the form fields with the product data to update
//                 title: this.Exam.title,
//                 description: this.Exam.description,
//                 duration: this.Exam.duration,
                
//               });
//             }

//         },
//         error:(error)=>{console.log(error)}
//       });
    
//     }
//   }
//   QuesForm = new FormGroup({
//     QuestionText: new FormControl('', [Validators.required]),
//     QuestionType: new FormControl('', [Validators.required]),
//     choices:new FormArray([]),
    

//   });

//   get getTitle() {
//     return this.ExamForm.controls['title'];
//   }
  

//   get getDescription() {
//     return this.ExamForm.controls['description'];
//   }
   

//   get getDuration() {
//     return this.ExamForm.controls['duration'];
//   }

//   get getQuestions():FormArray{
//     return this.ExamForm.get('questions') as FormArray;
//   }


// addQuesField(){
//  const quesGroup = new FormGroup(
//   {
//   QuestionText :new FormControl('',[Validators.required]),
//   QuestionType :new FormControl('',[Validators.required]),
//   choices:new FormArray([]),
//  },

//  {
//   validators:this.validateChoicesIfNeeded   //custom validation
//  }

// )

//  this.getQuestions.push(quesGroup);
// }

// removeQuesField(index:number){
//   this.getQuestions.removeAt(index);
// }

// getChoices(quesIndex:number):FormArray{
// return this.getQuestions.at(quesIndex).get('choices') as FormArray;
// }

// addChoice(quesIndex:number){
//   const choices= this.getChoices(quesIndex);

//   const choiceGroup= new FormGroup({
//     ChoiceText:new FormControl('',[Validators.required]),
//     IsCorrect:new FormControl(false,[Validators.required]),

//   })
//   choices.push(choiceGroup);
// }

// //if the ques is mcq and the user try to submit without adding choices
// validateChoicesIfNeeded(group:AbstractControl):ValidationErrors|null
// {
//   const quesType= group.get('QuestionType')?.value;
//   const choices = group.get('choices') as FormArray;
//   if((quesType==='MCQ' || quesType==="TF") && choices.length<2)
//   {
//     return{missingChoices:true};
//   }
//   return null;
// }

// removeChoiceField(quesIndex:number,choiceIndex:number){
//   const choices= this.getChoices(quesIndex);
//   choices.removeAt(choiceIndex);
// }


//  ExamHandler() {

//     if (this.ExamForm.valid) {
//       if (this.ExamId!=0) {
//         // Update existing exam
//         this.examService.EditExam( this.ExamForm.value,this.ExamId).subscribe({
//           next:(res)=>{
//             console.log(res)
//             this.examService.notifyExamsChanged(); // Notify list to update
//             this.router.navigate(['/exams'])
//           },
//           error:(error)=>{alert(error.message)}
//         });
//       } else {
//         // Add new exam

//         this.examService.CreateExam( this.ExamForm.value ).subscribe({
//           next:()=>{
//                   this.examService.notifyExamsChanged(); // Notify list to update
//                   this.router.navigate(['/exams']);

//           },
//           error:(error)=>{alert(error.message)}
//         });
//       }

//       // this.router.navigate(['/exams']); // Remove this line, navigation is handled above
//     } else {
//       console.log(this.ExamForm.errors);
//     }
//   }
// }
