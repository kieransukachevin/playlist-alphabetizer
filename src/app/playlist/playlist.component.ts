import { Component, OnInit, ViewChild } from '@angular/core';
import { SpotifyService } from '../spotify.service';

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
  @ViewChild('pTableCategories') set pTableCategories(element: any) { // Called since elemnent is actively created and destroyed 
    if (element) {
      this.interSectionObsv.observe(element.nativeElement);  // Observe table head
    }
  }

  /**
  * Adds a class with box shadow when element intersects top of the window
  */
  public interSectionObsv = new IntersectionObserver(
    ([e]) => {
      e.target.classList.toggle("is-pinned", e.intersectionRatio < 1);  // "is-pinned" in global styles
    },
    { threshold: [1] }
  );

  constructor(private spotifyService: SpotifyService) { }

  async ngOnInit() {
    this.spotifyService.getPlaylistInfo().subscribe((playlist:any) => {
      if (playlist) {
        this.playlistLoaded = true;
        this.playlistName = playlist.name;
        this.playlistUrl = playlist.external_urls.spotify;
        this.playlist = playlist.tracks.items;
      } else {
        this.playlistLoaded = false;
      }
    });
  }

  millisToMinutesAndSeconds(millis: number) {
    var minutes = Math. floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000). toFixed(0);
    return minutes + ':' + seconds;
  }
}
