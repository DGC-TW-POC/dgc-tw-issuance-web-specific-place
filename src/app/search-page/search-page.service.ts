import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICDCData } from './search-page.model';



@Injectable({
  providedIn: 'root'
})
export class SearchPageService {

  constructor(private http : HttpClient) { }
  getCDCData (params) : Observable<any> {
    return this.http.get<Array<ICDCData>>("/api/vaccine/CDCData" , {
      params : params ,
      withCredentials : true
    });
  }
  deleteCDCData (id) : Observable<any> {
    return this.http.delete(`/api/vaccine/CDCData/${id}` , {
      withCredentials: true
    });
  }
}
