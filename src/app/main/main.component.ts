import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Buffer } from 'buffer';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  public playlists: any = [];

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.spotifyService.getLoginStatus().subscribe(loginStatus => { // Check if logged in
      this.loginStatus = loginStatus;
    })

    if (this.loginStatus) {
      this.playlists = this.spotifyService.getPlaylists();
    }
  }
}
