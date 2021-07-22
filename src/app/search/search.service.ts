import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreationData } from '../create-page/create-page-models';
import * as Base64 from 'js-base64';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: HttpClient
  ) { }
  getCDCData(params): Observable<any> {
    //https://stackoverflow.com/a/45725439
    let query = Base64.encode(JSON.stringify(params) , true);
    let p = new HttpParams();
    p = p.set("qs",  query);
    return this.http.get<Array<ICreationData>>('/api/vaccine/CDCData' , {
      params : p ,
      withCredentials : true
    });
  }
}
