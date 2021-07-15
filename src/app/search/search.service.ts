import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreationData } from '../create-page/create-page-models';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: HttpClient
  ) { }
  getCDCData(params): Observable<any> {
    return this.http.get<Array<ICreationData>>('/api/vaccine/CDCData' , {
      params ,
      withCredentials : true
    });
  }
}
