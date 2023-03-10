import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SpotifyService } from '../spotify.service';
declare var require: any;
const queryString = require('query-string');

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent implements OnInit {
  scope = `user-read-private playlist-modify-private playlist-modify-public`;
  private redirect_uri = environment.redirect_uri;  // Your redirect uri

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {}

  redirectToLogin() {
      // Redirect to spotify authorization page
      document.location.href = ('https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: this.spotifyService.clientId,
        scope: this.scope,
        redirect_uri: this.redirect_uri,
        state: this.spotifyService.generateRandomString(16)
      })
    );
  }
  
}
