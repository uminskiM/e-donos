import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';



@Component({
  selector: 'report-modal',
  templateUrl: 'report-modal.html',
  styleUrls: ['./report-modal.scss']
})
export class ReportModal implements AfterViewInit {

  map: any;
  pictureUrl: undefined;
  note = ""

  public POINT_LAYER: any;

  constructor(
    private menu: MenuController,
    private modalController: ModalController,
    public platform: Platform,
  ) { }

  ngAfterViewInit() {
    

  }

  ok(){
    this.modalController.dismiss({
      "test": "test"
    })
  }

  dismiss(){
    this.modalController.dismiss()
  }

  onChangeFileInput(){

  }

  onClickFileInputButton(){

  }
}




