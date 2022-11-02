import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Buffer } from 'buffer';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  client_id = '4bf7f8deebef48b2b7de76dfe9f30024'; // Your client id
  client_secret = '66c5167e373c4e399de48fff238d191e'; // Your secret
  private redirect_uri = 'http://localhost:4200/login-redirect'; // Your redirect uri
  public accessCode: string = '';
  private tokenObservable: any;
  body = new URLSearchParams();
  private loginStatus: BehaviorSubject<any>;  // BehaviorSubject which tracks login status
  private userData = {
    name: '', image: '', spotifyUri: ''
  }
  private playlistData: any = [];

  constructor(private http: HttpClient) {
    if (localStorage.getItem('accessToken')) {
      this.loginStatus = new BehaviorSubject<any>(true);
    } else {
      this.loginStatus = new BehaviorSubject<any>(false);
    }

    this.loginStatus.subscribe(status => { // Get playlist data on successful login
      if (status == true) {
        this.retrieveUserData();
        this.retrievePlaylistData();
      }
    });
  }

  getClientId() {
    return this.client_id;
  }

  getLoginStatus() {
    return this.loginStatus;
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getUserData() {
    return this.userData;
  }

  getPlaylists() {
    return this.playlistData;
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

      this.tokenObservable = this.http.post(  // Create http post to token endpoint
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
        var observer = await this.tokenObservable.toPromise().then((data: any) => {
          localStorage.setItem('accessToken', data.access_token);
          this.toggleLoginStatus(true);  // Notify listeners to successful login
        });
      }
      catch(err) {
        console.log(err);
        this.toggleLoginStatus(false);  // Notify listeners to unsuccessful login
      }
  }

  /**
  * Toggle login status
  */
  toggleLoginStatus(status: boolean) {
    this.loginStatus.next(status);
  }

  /**
   * Logout by removing access token
   */
  logOut() {
    localStorage.removeItem('accessToken');
    this.toggleLoginStatus(false);
  }

  /**
   * Retrieve user data. Called on successful login
   */
  retrieveUserData() {
    var userDataObservable = this.http.get(
      'https://api.spotify.com/v1/me',
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
      }
    );

    var observer = userDataObservable.toPromise().then((data: any) => {
        console.log(data);
        this.userData.name = data.display_name;
        this.userData.image = data.images[0].url;
        this.userData.spotifyUri = data.external_urls.spotify;
    })
  }

  /**
   * Retrieve user playlist data. Called on successful login
   */
  retrievePlaylistData() {
    var userDataObservable = this.http.get(
      'https://api.spotify.com/v1/me/playlists',
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
      }
    );

    var observer = userDataObservable.toPromise().then((data: any) => {
        for (var i in data.items) {
          // console.log(data.items[i]);
          this.playlistData.push(
            {
              name: data.items[i].name,
              image: data.items[i].images[0].url,
              url: data.items[i].external_urls.spotify,
              track_total: data.items[i].tracks.total
            }
          ); 
        }
    })
  }
}
