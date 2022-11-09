import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SpotifyService } from '../spotify.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  @Input() playlist: string = '';
  public playlistUrl: SafeUrl = '';
  public playlistLoaded: boolean = false;

  constructor(private sanitizer: DomSanitizer, private spotifyService: SpotifyService, private _location: Location) { }

  async ngOnInit() {
    this.spotifyService.getPlaylistId().subscribe(playlistId => {
      if (!playlistId) {
        this.playlistLoaded = false;
      } else {
        this.playlistUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          "https://open.spotify.com/embed/playlist/" + playlistId + "?utm_source=generator"
        );
        this.playlistLoaded = true;
      }
    });
  }

  alphabetize() {
    this.spotifyService.alphabetizePlaylist();
  }
}
