import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {

  constructor() { }
  computeDgciHash (dgci: string) {
    const wordArray = CryptoJS.enc.Utf8.parse(dgci);
    return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Base64);
  }

}
