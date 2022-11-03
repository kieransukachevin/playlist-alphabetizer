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
  public togglePlaylistArea: boolean = true;
  public playlists: any = [];
  public next: boolean = false;
  public playlistId: string = "";
  public playlistUrl: SafeUrl = "";

  constructor(private spotifyService: SpotifyService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.spotifyService.getLoginStatus().subscribe(loginStatus => { // Check if logged in
      this.loginStatus = loginStatus;
    });

    if (this.loginStatus) {
      this.playlists = this.spotifyService.getPlaylists().playlists;
      console.log('next is: ', this.spotifyService.getPlaylists().next);
      if (this.spotifyService.getPlaylists().next) {
        this.next = true;
      } else {
        this.next = false;
      }
    }
  }

  async playlistSelected(playlist: string) {
    this.playlistId = await this.spotifyService.getPlaylist(playlist);
    this.togglePlaylistArea = false;
    this.playlistUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      "https://open.spotify.com/embed/playlist/" + this.playlistId + "?utm_source=generator"
      );
  }
}
