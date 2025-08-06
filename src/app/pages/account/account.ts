import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [RouterOutlet],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {
token= document.cookie.match(new RegExp('(^| )token=([^;]+)'));
}
