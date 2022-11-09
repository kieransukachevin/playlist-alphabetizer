import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './../environments/environment';
// declare var require: any;
// const axios = require('axios').default;

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  client_id = '4bf7f8deebef48b2b7de76dfe9f30024'; // Your client id
  client_secret = '66c5167e373c4e399de48fff238d191e'; // Your secret
  private redirect_uri = environment.redirect_uri;  // Your redirect uri
  public accessCode: string = '';
  private refreshToken: string = '';
  body = new URLSearchParams();

  private loginStatus = new BehaviorSubject<any>(false);  // BehaviorSubject which tracks login status
  private userData = new BehaviorSubject<any>(false);  // BehaviorSubject which tracks user data
  private playlistData = new BehaviorSubject<any>(false); // BehaviorSubject which tracks playlist data
  private playlistId = new BehaviorSubject<any>(false); // BehaviorSubject which tracks current playlist

  private playlists = {nextPlaylists: '', playlists: <any>[]};

  constructor(private http: HttpClient) {
    if (localStorage.getItem('accessToken')) {
      this.logIn();
    } else {
      this.logOut();
    }
  }

  getClientId() {
    return this.client_id;
  }

  getLoginStatus() {
    return this.loginStatus;
  }

  getUserData() {
    return this.userData;
  }

  getPlaylistsData() {
    return this.playlistData;
  }

  getPlaylistId() {
    return this.playlistId;
  }

  /**
  * Login
  */
  async logIn() {
    await this.retrieveUserData();
    await this.retrievePlaylistsData('https://api.spotify.com/v1/me/playlists');

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
  * Retrieve spotify access token
  * 
  * @param code - spotify access code
  */
  async retrieveAccessToken(code: string) {
      this.accessCode = code;

      this.body.set('grant_type', 'authorization_code');  // URL parameters for getting access token
      this.body.set('code', this.accessCode);
      this.body.set('redirect_uri', this.redirect_uri);

      var tokenObservable = this.http.post(  // Create http post to spotify token endpoint
        'https://accounts.spotify.com/api/token',
        this.body.toString(), 
        {headers: new HttpHeaders()
          .set(
            'Authorization', 'Basic ' + (Buffer.from(this.client_id + ':' + this.client_secret).toString('base64'))
          )
          .set(
            'Content-Type', 'application/x-www-form-urlencoded'
          )
        }
      );

      try {
        await tokenObservable.toPromise().then((data: any) => {
          localStorage.setItem('accessToken', data.access_token);
          this.refreshToken = data.refresh_token;
          localStorage.setItem('refreshToken', data.refresh_token);
          this.logIn();  // Notify listeners to successful login
        });
      }
      catch(err) {
        console.log(err);
        this.logOut();  // Logout (end sesssion with current access token)
      }
  }

  /**
   * Retrieve user data. Called on successful login
   */
  async retrieveUserData() {
    var userDataObservable = this.http.get(
      'https://api.spotify.com/v1/me',
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
      }
    ).pipe(
      catchError((error: any) => {
        this.logOut();
        return throwError(error.message);
      })
    );

    await userDataObservable.toPromise().then(
      (data: any) => {
        localStorage.setItem('userName', data.display_name);
        localStorage.setItem('userImage', data.images[0].url);
        localStorage.setItem('userSpotifyUri', data.external_urls.spotify);
      }
    )
  }

  /**
   * Retrieve user playlists data. Called on successful login
   */
  async retrievePlaylistsData(url: string) {
      var playlistsDataObservable = this.http.get(
        url,
        {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
        }
      ).pipe(
        catchError((error: any) => {
          this.logOut();
          return throwError(error.message);
        })
      );
  
      await playlistsDataObservable.toPromise().then(
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
                image: data.items[i].images[0].url,
                url: data.items[i].external_urls.spotify,
                track_total: data.items[i].tracks.total
              }
            );
          }
        }
      )
  }

  /**
   * Load the next set of playlists 
   */
  async loadMorePlaylists() {
    await this.retrievePlaylistsData(this.playlists.nextPlaylists);
    this.playlistData.next(this.playlists);
  }

  /**
   * Retrieve playlist data
   * 
   * @param playlist - the playlist name
   */
  async retrievePlaylistId(playlist: string) {
    this.playlistId.next(false);
    var playListId = '';
    this.playlists.playlists.forEach((pl: any) => {
      if (pl['name'] == playlist) {
        playListId = pl['id'];

      }
    });

    var playlistDataObservable = this.http.get(
      'https://api.spotify.com/v1/playlists/' + playListId,
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
      }
    ).pipe(
      catchError((error: any) => {
        this.logOut();
        return throwError(error.message);
      })
    );

    await playlistDataObservable.toPromise().then(
      (data: any) => {
        localStorage.setItem('playlistId', data.id);
        this.playlistId.next(localStorage.getItem('playlistId'));
      }
    )
  }

  /**
   * Alphabetize playlist
   */
  async alphabetizePlaylist() {
    var playlistDataObservable = this.http.get(
      'https://api.spotify.com/v1/playlists/' + localStorage.getItem('playlistId'),
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
      }
    ).pipe(
      catchError((error: any) => {
        this.logOut();
        return throwError(error.message);
      })
    );

    await playlistDataObservable.toPromise().then(
      async (data: any) => {
        console.log(data);
        for (var i = 0; i < data.tracks.items.length - 1; i++){
          for (var k = 0; k < data.tracks.items.length - i - 1; k++) {
            if (data.tracks.items[k].track.name > data.tracks.items[k+1].track.name) {
              await this.swapTracks(k, k+2, data.snapshot_id);
            }
          }
        }
      }
    )
  }

  /**
   * Spotify http request to swap tracks in a playlist
   * 
   * @param rangeStart 
   * @param insertBefore 
   */
  async swapTracks(rangeStart: number, insertBefore: number, snapshotId: string) {
    var newBody = new URLSearchParams();
    newBody.set('grant_type', 'refresh_token');  // URL parameters for getting access token
    newBody.set('refresh_token', this.refreshToken);

    var tokenObservable = this.http.post(  // Create http post to spotify token endpoint
      'https://accounts.spotify.com/api/token',
      newBody.toString(), 
      {headers: new HttpHeaders()
        .set(
          'Authorization', 'Basic ' + (Buffer.from(this.client_id + ':' + this.client_secret).toString('base64'))
        )
        .set(
          'Content-Type', 'application/x-www-form-urlencoded'
        )
      }
    );

    await tokenObservable.toPromise().then((data: any) => {
      localStorage.setItem('accessToken', data.access_token);
    });

    var params = new URLSearchParams();
    params.set('range_start', ''+rangeStart);
    params.set('insert_before', ''+insertBefore);
    params.set('range_length', '1');
    params.set('snapshot_id', snapshotId);

    console.log(params.toString());
    var playlistDataObservable = this.http.put(
      'https://api.spotify.com/v1/playlists/' + localStorage.getItem('playlistId') + '/tracks?' + params.toString(),
      {headers: new HttpHeaders()
        .set(
          'Authorization', 'Bearer ' + localStorage.getItem('accessToken')
        )
      }
    ).pipe(
      catchError((error: any) => {
        this.logOut();
        return throwError(error.message);
      })
    );
    // var playlistDataObservable = await axios.put(
    //   'https://api.spotify.com/v1/playlists/' + localStorage.getItem('playlistId') + '/tracks',
    //   {
    //     range_start: ''+rangeStart,
    //     insert_before: ''+insertBefore,
    //     snapshot_id: snapshotId
    //   },
    //   {
    //     headers: {
    //       Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    //     }
    //   }
    // )

    await playlistDataObservable.toPromise().then(
      (data: any) => {
        console.log(data);
      }
    ).catch(
      (reason: any) => {
        console.log(reason);
      }
    )
  }
}
