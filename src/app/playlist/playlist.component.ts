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
  public playlistName: string = '';
  public playlistUrl: string = '';
  public playlistLoaded: boolean = false;
  public playlist = new Array();

  constructor(private sanitizer: DomSanitizer, private spotifyService: SpotifyService, private _location: Location) { }

  async ngOnInit() {
    this.spotifyService.getPlaylistInfo().subscribe((playlist:any) => {
      if (playlist) {
        this.playlistLoaded = true;
        this.playlistName = playlist.name;
        console.log(playlist);
        this.playlistUrl = playlist.external_urls.spotify;
        this.playlist = playlist.tracks.items;
        console.log(this.playlist);
      } else {
        this.playlistLoaded = false;
      }
    });
  }

  async alphabetize() {
    await this.spotifyService.alphabetizePlaylist();
  }

  millisToMinutesAndSeconds(millis: number) {
    var minutes = Math. floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000). toFixed(0);
    return minutes + ':' + seconds;
  }

  fieldClicked(uri: string) {
    window.open(uri);
  }
}
