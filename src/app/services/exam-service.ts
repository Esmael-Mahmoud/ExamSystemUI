import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  constructor(private http: HttpClient, private auth: Auth) {}

  private apiUrl = 'https://exampro.runasp.net/api/Exam';

  private examsChangedSource = new BehaviorSubject<void>(undefined);
  examsChanged$ = this.examsChangedSource.asObservable();

  notifyExamsChanged() {
    this.examsChangedSource.next();
  }

  CreateExam(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data, { headers: this.auth.getheaders() });
  }

  GetAllExams(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllExams`, { headers: this.auth.getheaders() });
  }
  GetExamById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.auth.getheaders() });
  }
  EditExam(data: any, id: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.auth.getheaders() });
  }
  DeleteExam(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.auth.getheaders() });
  }
  getAvailableExams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllExams`, { headers: this.auth.getheaders() });
  }
  getExamQuestions(examId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${examId}/questions`, { headers: this.auth.getheaders() });
  }
  submitExam(examId: string, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${examId}/submit`, payload, { headers: this.auth.getheaders() });
  }
  getStudentResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/results`, { headers: this.auth.getheaders() });
  }
  getExamResults(examId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${examId}/results`, { headers: this.auth.getheaders() });
  }
}
