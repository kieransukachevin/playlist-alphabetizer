import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public loginStatus: boolean = false;
  public userData = {
    image: '',
    name: '',
    spotifyUri: ''
  };
  public flexSpace = "space-between";

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.spotifyService.loginStatus.subscribe(loginStatus => { // Check if logged in
      this.loginStatus = loginStatus;
    })
    this.spotifyService.userData.subscribe(userData => {
      this.userData = userData;
    })
  }

  logOut() {
    this.spotifyService.logOut();
  }
}
