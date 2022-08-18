import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  constructor(public photoService: PhotoService) { }

  ngOnInit(): void {
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }


}
