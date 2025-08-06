import { Component } from '@angular/core';
import { authGuard } from './services/auth-guard';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ExamForm } from './pages/Exam/exam-form/exam-form';
import { Account } from './pages/account/account';
import { NotFound } from './pages/not-found/not-found';
import { Exams } from './pages/Exam/exams';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { TakeExamComponent } from './pages/Exam/take-exam.component';
import { roleGuardGuard } from './services/role-guard-guard';
import { Home } from './pages/home/home';
import { Results } from './pages/results/results';

export const routes: Routes = [
     { path: '', component: Home },
     { path: 'home', component: Home },
    { path: 'AvailableExams', component: StudentDashboardComponent, canActivate: [authGuard] },
    { path: 'exams/:id', component: TakeExamComponent, canActivate: [authGuard] },
    { path: 'exams', component: Exams, canActivate: [authGuard,roleGuardGuard] },
    { path: 'exams/:id/upsert', component: ExamForm, canActivate: [authGuard,roleGuardGuard] },
    { path: 'teacher-dashboard', component: TeacherDashboardComponent, canActivate: [roleGuardGuard] },
    { path: 'account', component: Account,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent }
        ] },
    { path: 'result', component: Results},
    { path: '**', component: NotFound },
];
