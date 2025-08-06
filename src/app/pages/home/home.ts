import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {
  features = [
    {
      icon: 'bi-alarm',
      title: 'Time Management',
      description: 'Built-in timers and progress tracking for effective exam time management.'
    },
    {
      icon: 'bi-shield-lock',
      title: 'Secure Testing',
      description: 'Advanced anti-cheating measures and question randomization.'
    },
    {
      icon: 'bi-graph-up',
      title: 'Detailed Analytics',
      description: 'Comprehensive performance reports with actionable insights.'
    }
  ];

  testimonials = [
    {
      avatar: 'f.png',
      quote: "This platform transformed how we conduct assessments. The analytics are incredibly detailed!",
      name: "Dr. Sarah Johnson",
      role: "Professor, Computer Science"
    },
    {
      avatar: 'm.png',
      quote: "As a student, I love the intuitive interface and real-time feedback on my performance.",
      name: "Michael Chen",
      role: "Student"
    }
  ];
}