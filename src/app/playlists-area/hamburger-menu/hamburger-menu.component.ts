import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css']
})
export class HamburgerMenuComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('hamburgerArea') hamburgerArea: ElementRef | undefined;
  @Input() hide: string | undefined; // changes from parent component

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.toggleHide();
  }

  ngOnChanges(event: any) {
    this.toggleHide();
  }

  toggleHide() {
    if (this.hide == "reveal") {
      this.hamburgerArea?.nativeElement.classList.remove('reveal');
      this.hamburgerArea?.nativeElement.classList.add('hide');
    }
    else {
      this.hamburgerArea?.nativeElement.classList.remove('hide');
      this.hamburgerArea?.nativeElement.classList.add('reveal');
    }
  }

}
