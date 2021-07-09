import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreatePageService {

  constructor(private http: HttpClient) { }

  getEUJson(item) : Observable<any> {
    let body = JSON.stringify(item);
    return this.http.post('/api/vaccine/EUJson' , item , {
      withCredentials : true
    });
  }
  postItem(item) : Observable<any> {
    let body = JSON.stringify(item);
    return this.http.post('/api/vaccine/CDCData' , item, {
      withCredentials : true
    });
  }
  
}
