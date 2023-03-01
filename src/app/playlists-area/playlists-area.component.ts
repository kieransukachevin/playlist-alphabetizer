import { Component, OnInit, ViewChildren } from '@angular/core';
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
  public hide = "hide";
  public reveal = "reveal";
  public hideOrReveal = this.reveal;
  @ViewChildren('shadowArea, playlistsWrapper, toggleButton') set viewChildren(elements: any) {
    if (elements) {
      const toggleButton = elements._results[0].nativeElement;
      const shadowArea = elements._results[1].nativeElement;
      const playlistsWrapper = elements._results[2].nativeElement;



      playlistsWrapper.onscroll = (event: any) => {
        shadowArea.classList.toggle("is-scrolled", event.target.scrollTop > 0);
      } 
    }
  }

  constructor(private spotifyService: SpotifyService, private sanitizer: DomSanitizer) {}

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

  toggleReveal() {
    if (this.hideOrReveal == this.hide) {
      this.hideOrReveal = this.reveal;
    }
    else {
      this.hideOrReveal = this.hide;
    }
  }
}
