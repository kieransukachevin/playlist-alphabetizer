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

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.spotifyService.getLoginStatus().subscribe(loginStatus => { // Check if logged in
      this.loginStatus = loginStatus;
      // if (this.loginStatus) {
      //   this.userData = this.spotifyService.getUserData();
      // }
    })
    this.spotifyService.getUserData().subscribe(userData => {
      this.userData = userData;
    })
  }

}
