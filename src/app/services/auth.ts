import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'https://exampro.runasp.net/api/Auth'; 
 headers:any;

  constructor(private http: HttpClient,private router:Router) {}

  getheaders(): HttpHeaders | undefined {
    const token = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token[2]}`);
    }
    return undefined;
  }

  
  

  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

 login(credentials: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials)
  //get token from api and save it in cookie
    .pipe(
      tap((res: any) => {
        const token = res.token;
        const userRole= res.userRole;

        localStorage.setItem('userRole',userRole);
        // Save to cookie for 1 hour
        const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
        document.cookie = `token=${token}; expires=${expires}; path=/`;
      })
    );
}
isLoggedIn():boolean{
  return !! this.getheaders();
}

logout():void {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}


}
