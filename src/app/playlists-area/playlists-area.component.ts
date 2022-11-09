import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-playlists-area',
  templateUrl: './playlists-area.component.html',
  styleUrls: ['./playlists-area.component.css']
})
export class PlaylistsAreaComponent implements OnInit {
  private loginStatus: boolean = false;
  public playlists: any = [];
  public next: boolean = false;
  public playlistId: string = "";
  public playlistUrl: SafeUrl = "";

  constructor(private spotifyService: SpotifyService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.spotifyService.getLoginStatus().subscribe(loginStatus => { // Check if logged in
      this.loginStatus = loginStatus;
    });
    this.spotifyService.getPlaylistsData().subscribe(playlistsData => {
      if (playlistsData.nextPlaylists != "") {
        this.next = true;
      } else {
        this.next = false;
      }
      this.playlists = playlistsData.playlists;
    })
  }

  morePlaylistsClick() {
    this.spotifyService.loadMorePlaylists();
  }
}
