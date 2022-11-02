import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../spotify.service';
declare var require: any;
const queryString = require('query-string');

@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.css']
})
export class LoginRedirectComponent implements OnInit {
  private accessCode: string = '';
  redirect_uri = 'http://localhost:4200/main'; // Your redirect uri

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {  // Get code from the URL query parameters
        this.accessCode = params.code
      });

      this.spotifyService.getLoginStatus().subscribe(status => { // Redirect on successful login
        if (status === true) {
          this.router.navigate(['']);
        }
      })

      this.spotifyService.retrieveAccessToken(this.accessCode);
  }
}
