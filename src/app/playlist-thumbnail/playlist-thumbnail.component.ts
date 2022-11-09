import { Component, Input, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist-thumbnail',
  templateUrl: './playlist-thumbnail.component.html',
  styleUrls: ['./playlist-thumbnail.component.css']
})
export class PlaylistThumbnailComponent implements OnInit {
  @Input() playlist: {name: string, image: string, url: string, track_total: string}

  constructor(private spotifyService: SpotifyService, private router: Router) {
    this.playlist = {name: '', image: '', url: '', track_total: ''};
  }

  ngOnInit(): void {}

  async thisPlaylistClicked() {
    await this.spotifyService.retrievePlaylistId(this.playlist.name);
  }
}
