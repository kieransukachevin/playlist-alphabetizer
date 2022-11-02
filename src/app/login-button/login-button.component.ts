import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
declare var require: any;
const queryString = require('query-string');

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent implements OnInit {
  scope = 'user-read-private user-read-email';
  redirect_uri = 'http://localhost:4200/login-redirect'; // Your redirect uri

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {}

  redirectToLogin() {
      // Redirect to spotify authorization page
      document.location.href = ('https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: this.spotifyService.getClientId(),
        scope: this.scope,
        redirect_uri: this.redirect_uri,
        state: this.spotifyService.generateRandomString(16)
      })
    );
  }
  
}
