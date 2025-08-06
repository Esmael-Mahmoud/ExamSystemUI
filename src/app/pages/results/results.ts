import { ChangeDetectorRef, Component,OnInit } from '@angular/core';
import { ResultsService } from '../../services/results-service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { IResults } from '../../models/iresults';
import { ExamService } from '../../services/exam-service';
import { IExam } from '../../models/iexam';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-results',
  imports: [MatTableModule, CommonModule,ReactiveFormsModule],
  templateUrl: './results.html',
  styleUrl: './results.css',
  standalone: true,


})
export class Results {
  // Data properties
  allResults: IResults[] = [];
  filteredResults: IResults[] = [];
  pagedResults: IResults[] = [];
  Exams!:IExam[];

  // Search properties
  searchControl = new FormControl('');
  searchTerm: string = '';
  suggestions: string[] = [];
  showSuggestions = false;

  subjectFilter: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  // Unique lists for suggestions
  studentNames: string[] = [];
  examTitles: string[] = [];

  displayedColumns = ['exam', 'score', 'date'];

  userId: string = '';
  userRole:string |null = '';
  constructor(private router:Router,private resultsService: ResultsService, private cdr: ChangeDetectorRef,private ExamService:ExamService,private userService: UserService) { }

  ngOnInit() {

    if(this.userRole=='Teacher'){
      console.log("teacher")
      this.loadAllResults();
          this.refreshUserName();
      // Listen for router events to refresh username after login
      this.router.events.subscribe(() => {
        this.refreshUserName();
        //  console.log(this.userRole)}
      });
      this.loadExams();

    }
    else{
      console.log("student")
      this.LoadMyResult();
               this.refreshUserName();
      // Listen for router events to refresh username after login
      this.router.events.subscribe(() => {
        this.refreshUserName();
        //  console.log(this.userRole)}
      });

    }
    
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term || '';
      this.currentPage = 1;
      this.generateSuggestions();
      this.applyFilters();
    });


        this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term || '';
      this.currentPage = 1;
      this.generateSuggestions();
      this.applyFilters();
    });

  }

  refreshUserName() {

    
      this.userService.getCurrentUser().subscribe({
        next: (user: any) => {
          this.userId = user.id;
          this.userRole= localStorage.getItem('userRole');
          this.cdr.detectChanges();
        },
        error: () => { this.userId = ''; this.userRole = ''; }
      });
     
  }

   onSearchBlur() {
    // Delay hiding to allow click events to process
    setTimeout(() => this.showSuggestions = false, 200);
  }
  loadAllResults() {
    this.resultsService.getAllResults().subscribe({
      next: (response) => {
        this.allResults = response;
        
        // Extract unique values for suggestions
        this.studentNames = [...new Set(response.map(r => r.studentName))];
        this.examTitles = [...new Set(response.map(r => r.examTitle))];
        
        this.applyFilters();
      },
      error: (error) => console.error('Failed to load results', error)
    });
  }
  LoadMyResult(){
      this.resultsService.getMyResults().subscribe({
      next: (response) => {
        this.allResults = response;
        // Extract unique values for suggestions
        this.studentNames = [...new Set(response.map(r => r.studentName))];
        this.examTitles = [...new Set(response.map(r => r.examTitle))];
        
        this.applyFilters();
      },
      error: (error) => console.error('Failed to load results', error)
    });
  }

    generateSuggestions() {
    if (!this.searchTerm) {
      this.suggestions = [];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    
    // Combine student and exam suggestions
    const studentMatches = this.studentNames
      .filter(name => name.toLowerCase().includes(term))
      .map(name => `Student: ${name}`);
    
    const examMatches = this.examTitles
      .filter(title => title.toLowerCase().includes(term))
      .map(title => `Exam: ${title}`);
    
    // Combine and limit to 5 suggestions
    this.suggestions = [...studentMatches, ...examMatches].slice(0, 5);
    this.showSuggestions = this.suggestions.length > 0;
  }


 applyFilters() {
    if (!this.searchTerm) {
      this.filteredResults = [...this.allResults];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredResults = this.allResults.filter(r => 
        r.studentName.toLowerCase().includes(term) || 
        r.examTitle.toLowerCase().includes(term)
      );
    }

    // Update pagination
    this.totalItems = this.filteredResults.length;
    this.updatePagedResults();
  }

  selectSuggestion(suggestion: string) {
    // Extract the actual value without prefix
    const value = suggestion.split(': ')[1];
    this.searchControl.setValue(value);
    this.showSuggestions = false;
  }
  updatePagedResults() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedResults = this.filteredResults.slice(startIndex, startIndex + this.itemsPerPage);
    console.log(this.pagedResults)
  }


    onSearchInput(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1; // Reset to first page
    this.applyFilters();
  }
  loadExams() {
    this.ExamService.GetAllExams().subscribe({
      next:(response)=>{
        this.Exams=response;
        this.cdr.detectChanges();
        console.log(this.Exams)
      },
      error:(error)=>{
        console.log(error);
      }
    });
  }
   setPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.updatePagedResults();
  }

  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  nextPage() {
    this.setPage(this.currentPage + 1);
  }

  prevPage() {
    this.setPage(this.currentPage - 1);
  }

  getPaginationSummary(): string {
    const start = Math.min((this.currentPage - 1) * this.itemsPerPage + 1, this.totalItems);
    const end = Math.min(start + this.itemsPerPage - 1, this.totalItems);
    return `Showing ${start}-${end} of ${this.totalItems} results`;
  }
   getExamIcon(exam: string): string {
    const iconMap: {[key: string]: string} = {
      'Mathematics': 'fa-calculator',
      'Science': 'fa-flask',
      'Literature': 'fa-book',
      'History': 'fa-globe'
    };
    
    // Return matching icon or default icon
    return iconMap[exam] || 'fa-file-alt';
  }

}