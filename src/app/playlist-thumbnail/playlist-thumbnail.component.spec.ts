import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistThumbnailComponent } from './playlist-thumbnail.component';

describe('PlaylistThumbnailComponent', () => {
  let component: PlaylistThumbnailComponent;
  let fixture: ComponentFixture<PlaylistThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistThumbnailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
