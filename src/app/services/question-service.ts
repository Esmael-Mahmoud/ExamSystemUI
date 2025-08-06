import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
headers:any;
  constructor(private http:HttpClient, private auth: Auth) {
    this.headers=auth.getheaders();
   }
private apiUrl='https://exampro.runasp.net/api/Questions'


addQues(data:any):Observable<any>{
  return this.http.post(`${this.apiUrl}/AddQues`,data,{headers:this.headers});
}

addChoice(data:any):Observable<any>{
  return this.http.post(`${this.apiUrl}/AddChoice`,data,{headers:this.headers});
}

EditQues(data:any,id:number):Observable<any>{
  return this.http.put(`${this.apiUrl}/${id}`,data,{headers:this.headers});
}

DeleteQues(id:number):Observable<any>{
  return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headers});
}
}
