import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';



@Component({
  selector: 'report-details-modal',
  templateUrl: 'report-details-modal.html',
  styleUrls: ['./report-details-modal.scss']
})
export class ReportDetailsModal implements AfterViewInit {

  map: any;
  pictureUrl: string;
  note = ""

  public POINT_LAYER: any;

  constructor(
    private menu: MenuController,
    private modalController: ModalController,
    public platform: Platform,
  ) { }

  ngAfterViewInit() {
    this.pictureUrl = "https://www.w3schools.com/html/pic_trulli.jpg"

  }

  ok(){
    this.modalController.dismiss(
      {},
      "ok"
    )
  }

  dismiss(){
    this.modalController.dismiss(
      {},
      "cancel"
    )
  }

  onChangeFileInput(){

  }

  onClickFileInputButton(){

  }
}




