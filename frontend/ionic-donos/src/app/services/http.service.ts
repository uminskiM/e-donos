import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { SpotRequestBody } from "../interfaces/spots";


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getSpots() {
    return this.http.get(`${environment.serverUrl}/spots`);
  }

  getSpot(spotId: number){
    return this.http.get(`${environment.serverUrl}/spots/${spotId}`);
  }

  addSpot(spotBody: SpotRequestBody){
    return this.http.post<any>(`${environment.serverUrl}/spots`, spotBody)
  }


}

