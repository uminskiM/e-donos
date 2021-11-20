import { Component, ElementRef, Inject, ViewChild, AfterViewInit, Input } from '@angular/core';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
import { HttpService } from '../../../services/http.service';
import { SpotRequestBody } from '../../../interfaces/spots';



@Component({
  selector: 'report-modal',
  templateUrl: 'report-modal.html',
  styleUrls: ['./report-modal.scss']
})
export class ReportModal implements AfterViewInit {
  @Input("coords") coords;

  map: any;
  pictureUrl: undefined;
  title = "";
  desc = "";
  category: any;

  categoriesDisplay = ["WYSYPISKO",
    "HOLE",
    "GOOD_SHOP",
    "GOOD_RESTAURANT",
    "PALENIE_SMIECI",
    "NICE PLACE",
    "SPORT EVENT",
    "NIEBEZPIECZNE_MIEJSCE",
    "DANGEROUS_PLACE",
    "FIXES",
    "BROKEN_LIGHTS"]

  categories = {
    WYSYPISKO_SMIECI: 'WYSYPISKO',
    DZIURA_W_DRODZE: 'HOLE',
    FAJNY_SKLEP: 'GOOD_SHOP',
    DOBRA_RESTAURACJA: 'GOOD_RESTAURANT',
    PALENIE_SMIECI: 'PALENIE_SMIECI',
    LADNE_MIEJSCE: 'NICE PLACE',
    WYDARZENIE_SPORTOWE: 'SPORT EVENT',
    ROBOTY_DROGOWE: 'ROBOTY_DROGOWE',
    NIEBEZPIECZNE_MIEJSCE: 'DANGEROUS_PLACE',
    DROBNE_NAPRAWY: 'TINY FIXES',
    USZKODZONE_OSWIETLENIE: 'BROKEN_LIGHTS',
    ZAROSNIETE_KRZAKAMI: 'BUSH'
  }



  public POINT_LAYER: any;

  constructor(
    private menu: MenuController,
    private modalController: ModalController,
    private httpService: HttpService,
    public platform: Platform,
  ) { }

  ngAfterViewInit() {
    

  }

  ok() {
    console.log(this.category)
    let spotBody: SpotRequestBody = {
      category: this.category,
      comment: this.desc,
      latitude: this.coords[0],
      longitude: this.coords[1]
    }
   
    console.log(spotBody)
    this.httpService.addSpot(spotBody).subscribe(
      result =>{
        console.log(result)
      },
      error => {

      }
    )

    this.modalController.dismiss(
      {
      },
      "ok"
    )
  }

  dismiss() {
    this.modalController.dismiss(
      {},
      "cancel"
    )
  }

  onChangeFileInput() {

  }

  onClickFileInputButton() {

  }
}




