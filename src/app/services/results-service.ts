import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResults } from '../models/iresults';
import { Auth } from './auth';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  private apiUrl = 'https://exampro.runasp.net/api/Result';

  constructor(private http: HttpClient,private auth: Auth) { }

  getMyResults():Observable<IResults[]> {
    return this.http.get<IResults[]>(`${this.apiUrl}/my`, { headers: this.auth.getheaders()  });
  }
  getAllResults():Observable<IResults[]>{
        return this.http.get<IResults[]>(`${this.apiUrl}/All`, { headers: this.auth.getheaders()  });
  }

  getResultsByStudent(studentId: string):Observable<IResults[]> {
    return this.http.get<IResults[]>(`${this.apiUrl}/student/${studentId}`, { headers: this.auth.getheaders()  });
  }

  getResultsByExam(examId: number):Observable<IResults[]> {
    return this.http.get<IResults[]>(`${this.apiUrl}/exam/${examId}`, { headers: this.auth.getheaders()  });
  }
}