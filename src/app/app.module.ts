import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpotifyService } from './spotify.service';
import { LoginButtonComponent } from './login-button/login-button.component';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { MainComponent } from './main/main.component';
import { PlaylistThumbnailComponent } from './playlists-area/playlist-thumbnail/playlist-thumbnail.component';
import { ProfileComponent } from './profile/profile.component';
import { PlaylistsAreaComponent } from './playlists-area/playlists-area.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HamburgerMenuComponent } from './playlists-area/hamburger-menu/hamburger-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginButtonComponent,
    LoginRedirectComponent,
    MainComponent,
    PlaylistThumbnailComponent,
    HamburgerMenuComponent,
    ProfileComponent,
    PlaylistsAreaComponent,
    PlaylistComponent,
    FooterComponent,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [SpotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
