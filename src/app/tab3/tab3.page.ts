import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor(public photoService: PhotoService) { }

  async ngOnInit(): Promise<void> {
    await this.photoService.loadSaved();
  }
}
