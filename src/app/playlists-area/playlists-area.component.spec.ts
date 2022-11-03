import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsAreaComponent } from './playlists-area.component';

describe('PlaylistsAreaComponent', () => {
  let component: PlaylistsAreaComponent;
  let fixture: ComponentFixture<PlaylistsAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistsAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
