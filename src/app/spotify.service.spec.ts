import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { SpotifyService } from './spotify.service';

describe('SpotifyService', () => {
  let service: SpotifyService;
  let httpTestingController: HttpTestingController;

  var originalTimeout: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SpotifyService);
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getClientId should return service.clientId', () => {
    expect(service.getClientId()).toBe(service.clientId);
  });

  it('#getLoginStatus should return service.loginStatus', () => {
    expect(service.getLoginStatus()).toBeInstanceOf(BehaviorSubject);
  });

  it('#getPlaylistsData should return service.playlistData', () => {
    expect(service.getUserData()).toBeInstanceOf(BehaviorSubject);
  });

  it('#getPlaylistsData should return service.playlistData', () => {
    expect(service.getPlaylistsData()).toBeInstanceOf(BehaviorSubject);
  });

  it('#getPlaylistId should return service.playlistId', () => {
    expect(service.getPlaylistId()).toBeInstanceOf(BehaviorSubject);
  });

  it('#getPlaylistInfo should return service.playlistInfo', () => {
    expect(service.getPlaylistInfo()).toBeInstanceOf(BehaviorSubject);
  });

  it('#logIn should retrieve Spotify data and alert changes', async () => {
  });

  it('#generateRandomString should return a string of random characters of size length', () => {
    expect(service.generateRandomString(16).length).toBe(16);
  });

  it('#retrieveAccessToken should retrieve a user authentication token and login on success', async () => {
    await service.retrieveAccessToken('accessToken');
    const req = httpTestingController.expectOne('https://accounts.spotify.com/api/token');
    expect(req.request.method).toEqual('POST');
  });
});
