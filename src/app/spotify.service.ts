import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  _client_id = '4bf7f8deebef48b2b7de76dfe9f30024'; // Your client id
  _client_secret = '66c5167e373c4e399de48fff238d191e'; // Your secret
  private redirect_uri = environment.redirect_uri;  // Your redirect uri
  public accessCode: string = '';
  private refreshToken: string = '';
  body = new URLSearchParams();

  private _loginStatus = new BehaviorSubject<any>(false);  // BehaviorSubject which tracks login status
  private _userData = new BehaviorSubject<any>(false);  // BehaviorSubject which tracks user data
  private _playlistData = new BehaviorSubject<any>(false); // BehaviorSubject which tracks playlist data
  private _playlistId = new BehaviorSubject<any>(false); // BehaviorSubject which tracks current playlist
  private _playlistInfo = new BehaviorSubject<any>(false); // BehaviorSubject which tracks current playlist info

  private playlists = {nextPlaylists: '', playlists: <any>[]};

  constructor(private http: HttpClient) {
    if (localStorage.getItem('accessToken')) {
      this.logIn();
    } else {
      this.logOut();
    }
  }

  get clientId() {
    return this._client_id;
  }

  get loginStatus() {
    return this._loginStatus;
  }

  get userData() {
    return this._userData;
  }

  get playlistData() {
    return this._playlistData;
  }

  get playlistId() {
    return this._playlistId;
  }

  get playlistInfo() {
    return this._playlistInfo;
  }

  /**
  * Login
  */
  async logIn() {
    await this.retrieveUserData();
    await this.retrievePlaylistsData('https://api.spotify.com/v1/me/playlists');
    await this.retrievePlaylistInfo(this.playlists.playlists[0].name);

    this.loginStatus.next(true);
    this.userData.next({
      image: localStorage.getItem('userImage') || '',
      name: localStorage.getItem('userName') || '',
      spotifyUri: localStorage.getItem('userSpotifyUri') || ''
    });
    this.playlistData.next(this.playlists);
    this.playlistId.next(localStorage.getItem('playlistId'));
  }

  /**
   * Logout
   */
  logOut() { 
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userImage');
    localStorage.removeItem('userName');
    localStorage.removeItem('userSpotifyUri');
    localStorage.removeItem('playlistId');
    this.loginStatus.next(false);
  }

  /**
   * Generate a random string for unique state
   * 
   * @param length - length of unique string
   * @returns - unique string
   */
  generateRandomString(length: number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
  * Retrieve spotify access token.
  * 
  * @param code - spotify access code
  */
  async retrieveAccessToken(code: string) {
      this.accessCode = code;

      this.body.set('grant_type', 'authorization_code');  // URL parameters for getting access token
      this.body.set('code', this.accessCode);
      this.body.set('redirect_uri', this.redirect_uri);

      await this.http.post(  // Create http post to spotify token endpoint
        'https://accounts.spotify.com/api/token',
        this.body.toString(), 
        {headers: new HttpHeaders()
          .set(
            'Authorization', 'Basic ' + (Buffer.from(this._client_id + ':' + this._client_secret).toString('base64'))
          )
          .set(
            'Content-Type', 'application/x-www-form-urlencoded'
          )
        }
      ).pipe(
        catchError(this.handleError)
      ).toPromise().then((data: any) => {
          localStorage.setItem('accessToken', data.access_token);
          this.refreshToken = data.refresh_token;
          localStorage.setItem('refreshToken', data.refresh_token);
          this.logIn();  // Notify listeners to successful login
        });
  }

  /**
   * Retrieve user data. Called on successful login.
   */
  async retrieveUserData() {
    await this.http.get(
      'https://api.spotify.com/v1/me',
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
      }
    ).pipe(
      catchError(this.handleError)
    ).toPromise().then(
      (data: any) => {
        localStorage.setItem('userName', data.display_name);
        localStorage.setItem('userImage', data.images[0].url);
        localStorage.setItem('userSpotifyUri', data.external_urls.spotify);
      }
    )
  }

  /**
   * Retrieve user playlists data. Called on successful login.
   */
  async retrievePlaylistsData(url: string) {
      await this.http.get(
        url,
        {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
        }
      ).pipe(
        catchError(this.handleError)
      ).toPromise().then(
        (data: any) => {
          if (data.next) {
            this.playlists.nextPlaylists = data.next;
          } else {
            this.playlists.nextPlaylists = '';
          }
          for (var i in data.items) {
            this.playlists.playlists.push(
              {
                id: data.items[i].id,
                name: data.items[i].name,
                image: data.items[i].images[1] ? data.items[i].images[1].url : data.items[i].images[0].url,
                url: data.items[i].external_urls.spotify,
                track_total: data.items[i].tracks.total
              }
            );
          }
        }
      )
  }

  /**
   * Load the next set of playlists.
   */
  async loadMorePlaylists() {
    await this.retrievePlaylistsData(this.playlists.nextPlaylists);
    this.playlistData.next(this.playlists);
  }

  /**
   * Retrieve playlist info.
   * 
   * @param playlistName - the playlist name.
   */
  async retrievePlaylistInfo(playlistName: string) {
    this.playlistInfo.next(false);
    var playListId = '';
    this.playlists.playlists.forEach((pl: any) => {
      if (pl['name'] == playlistName) {
        playListId = pl['id'];
      }
    });

    await this.http.get(
      'https://api.spotify.com/v1/playlists/' + playListId,
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
      }
    ).pipe(
      catchError(this.handleError)
    ).toPromise().then(
      (data: any) => {
        localStorage.setItem('playlistId', data.id);
        this.playlistInfo.next(data); // Notify listeners of new data
      }
    )
  }

  /**
   * Retrieve playlist id.
   * 
   * @param playlist - the playlist name.
   */
  async retrievePlaylistId(playlist: string) {
    this.playlistId.next(false);
    var playListId = '';
    this.playlists.playlists.forEach((pl: any) => {
      if (pl['name'] == playlist) {
        playListId = pl['id'];
      }
    });

    await this.http.get(
      'https://api.spotify.com/v1/playlists/' + playListId,
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
      }
    ).pipe(
      catchError(this.handleError)
    ).toPromise().then(
      (data: any) => {
        localStorage.setItem('playlistId', data.id);
        this.playlistId.next(localStorage.getItem('playlistId')); // Notify listeners of new id
      }
    )
  }

  /**
   * Alphabetize playlist
   */
  async alphabetizePlaylist() {
    var name: string = '';
    var original: any;
    var alphabetized: any;

    await this.http.get(
      'https://api.spotify.com/v1/playlists/' + localStorage.getItem('playlistId'),
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
      }
    ).pipe(
      catchError(this.handleError)
    ).toPromise().then(
      (data: any) => {
        name = data.name;
        alphabetized = { ...data.tracks.items };
        original = { ...data.tracks.items };
      },
      (error: any) => {
        this.logOut();
        alert(error);
      }
    )

    // Sort alphabetically
    var size = Object.keys(alphabetized).length;
    for (var i = 0; i < size - 1; i++){
      for (var k = 0; k < size - i - 1; k++) {
        if (alphabetized[k].track.name > alphabetized[k+1].track.name) {
          var temp = alphabetized[k];
          alphabetized[k] = alphabetized[k+1];
          alphabetized[k+1] = temp;
        }
      }
    }

    var uris = new Array<string>();
    for (var i = 0; i < size; i++) {
      uris.push(alphabetized[i].track.uri);
    }

    await this.replaceTracks(localStorage.getItem('playlistId'), uris);

    await this.retrievePlaylistInfo(name);
  }

  /**
   * Removes all tracks in a playlist and replaces them with the new tracks
   *
   * @param playlistId - ID of the playlist to modify. 
   * @param uris - track uris to add to the playlist.
   */
  async replaceTracks(playlistId: any, uris: any[]) {
    const params = {
      uris: uris,
    }
    
    await this.http.put(
      'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks',
      params,
      {headers: new HttpHeaders()
        .set(
          'Authorization', 'Bearer ' + localStorage.getItem('accessToken')
        )
      }
    ).pipe(
      catchError(this.handleError)
    ).toPromise().then(
      (data: any) => {
        console.log('success:',data);
      }, (error: any) => {
        console.log(error);
      }
    );
  }

  /**
   * Handles error returned by http promise
   * 
   * @param error: error returned from http request
   * @returns 
   */
  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => {
      new Error('Something bad happened; please try again later.');
    });
  }
}
