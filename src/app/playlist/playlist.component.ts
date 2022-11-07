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

  constructor(private sanitizer: DomSanitizer, private spotifyService: SpotifyService, private _location: Location) { }

  async ngOnInit() {
    this.playlistUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      "https://open.spotify.com/embed/playlist/" + this.spotifyService.getPlaylistId() + "?utm_source=generator"
      );
  }

  alphabetize() {
    this.spotifyService.alphabetizePlaylist();
  }

  back() {
    this._location.back();
  }

}
