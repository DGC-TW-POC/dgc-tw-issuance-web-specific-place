import { IPerson } from '../shared/models/person';
interface IQrcode {
    readonly type:string;
    data: any;
}

export interface IVaccineSearchResult {
    count : number;
    rows : Array<IVaccineCDCData>
} 

export interface IVaccineCDCData {
    id?: number;
    AgencyCode: string;
    IdNo: string;
    InocuDate: string;
    VaccID: string;
    VaccDoses: number;
    dgci_hash: string;
    qrcode: IQrcode;
    person : IPerson;
}

export interface IVaccineCDCDataSearchParameters {
    id?: number;
    AgencyCode: string;
    IdNo: string;
    InocuDate: string;
    VaccID: string;
    VaccDoses: number;
    person : IPerson;
    page?: number;
}