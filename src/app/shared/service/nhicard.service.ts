import { Injectable } from '@angular/core';
import { INHICardData } from '../models/nhicard';
@Injectable({
    providedIn: 'root'
})
export class NHICardService {
    constructor() { }
    init(): void {
        (window as any).H_Sign('Sign');
    }
    getBasicDataInCard(): Promise<INHICardData> {
        return new Promise((resolve , reject)=> {
            let checkTime = 0;
            let checkInterval = setInterval(() => {
                let NHICardBasicData = (document.getElementById("hidBasic") as HTMLInputElement).value;
                if (NHICardBasicData) {
                    clearInterval(checkInterval);
                    let cleanNHIBasicData = NHICardBasicData.split(",");
                    cleanNHIBasicData = cleanNHIBasicData.map(v=> v.trim());
                    let NHICardBasicDataObj = {
                        cardId: cleanNHIBasicData[0],
                        idNo: cleanNHIBasicData[1],
                        name: cleanNHIBasicData[2],
                        birthDate: this.changeTWDateToISOData(cleanNHIBasicData[3])
                    }
                    console.log(NHICardBasicDataObj);
                    resolve(NHICardBasicDataObj);
                }
                checkTime++;
                if (checkTime >=3) {
                    clearInterval(checkInterval)
                    reject(new Error("NHI Card value not found"));
                }
            } , 500)
        })
    }
    private changeTWDateToISOData (date: string) : string {
        let yearNum:number = Number(date.substr(0,3)) + 1911;
        let month = date.substr(3,2);
        let day = date.substr(5,2);
        console.log(`${String(yearNum)}-${month}-${day}`);
        return `${String(yearNum)}-${month}-${day}`
    }
}

