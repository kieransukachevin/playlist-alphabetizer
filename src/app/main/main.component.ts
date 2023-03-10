import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private code: string = '';
  private body = new URLSearchParams();
  private tokenObservable: any;
  public loginStatus: boolean = false;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.loginStatus.subscribe(loginStatus => { // Check if logged in
      this.loginStatus = loginStatus;
    });
  }
}
