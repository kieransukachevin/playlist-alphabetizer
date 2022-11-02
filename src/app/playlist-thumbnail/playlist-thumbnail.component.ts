import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist-thumbnail',
  templateUrl: './playlist-thumbnail.component.html',
  styleUrls: ['./playlist-thumbnail.component.css']
})
export class PlaylistThumbnailComponent implements OnInit {
  @Input() data: {name: string, image: string, url: string, track_total: string}

  constructor() {
    this.data = {name: '', image: '', url: '', track_total: ''};
  }

  ngOnInit(): void {
  }

}
