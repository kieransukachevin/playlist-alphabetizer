import { Component, Input, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-playlist-thumbnail',
  templateUrl: './playlist-thumbnail.component.html',
  styleUrls: ['./playlist-thumbnail.component.css']
})
export class PlaylistThumbnailComponent implements OnInit {
  @Input() playlist: {name: string, image: string, url: string, track_total: string}
  @Output() playlistSelectedEvent = new EventEmitter<string>();

  constructor(private spotifyService: SpotifyService) {
    this.playlist = {name: '', image: '', url: '', track_total: ''};
  }

  ngOnInit(): void {
  }

  thisPlaylistClicked() {
    this.playlistSelectedEvent.emit(this.playlist.name);
  }
}
