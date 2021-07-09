import { Injectable } from '@angular/core';
import { Meta , Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

  constructor(private title : Title , private meta : Meta) { }

  updateTitle (title : string) {
    this.title.setTitle(title);
  }

  updateDescription(description : string) {
    this.meta.updateTag({
      name : "description" , 
      content : description
    });
  }
}
