export interface ICDCData {
    AgencyCode: string;
    Data: Array<IDataInCDCData>;
}

export interface IDataInCDCData {
    IdNo: string;
    Name: string;
    Birthday: string;
    InocuDate: string;
    VaccID: string;
    VaccDoses: number
}

interface IVaccineType {
    name : string;
    id: string;
}

interface IVaccineOrg {
    name: string;
    id: string;
}

export interface IVaccine {
    name : string;
    id: string;
    type : IVaccineType
    org : IVaccineOrg
}

export const vaccineMap : Array<IVaccine> = [
    {
        "name" : "Vaxzavria (AZ)" ,
        "id" : "EU/1/21/1529",
        "type" : {
            "name" : "SARS-CoV-2 antigen vaccine",
            "id" : "1119305005"
        } ,
        "org" : {
            "name" : "AstraZeneca AB" ,
            "id" : "ORG-100001699"
        }
    } ,
    {
        "name" : "COVID-19 Vaccine Moderna (莫德納 COVID-19 疫苗)",
        "id": "EU/1/20/1507" ,
        "type" : {
            "name" : "SARS-CoV-2 mRNA vaccine" ,
            "id" : "1119349007"
        },
        "org" : {
            "name" : "Moderna Biotech Spain S.L.",
            "id" : "ORG-100031184"
        }
    } ,
    {
        "name" : "Comirnaty (輝瑞/BNT COVID-19 疫苗)",
        "id" : "EU/1/20/1528",
        "type" : {
            "name" : "SARS-CoV-2 mRNA vaccine" ,
            "id" : "1119349007"
        },
        "org" : {
            "name" : "Biontech Manufacturing GmbH",
            "id" : "ORG-100030215"
        }
    }
]

export const dataTranslation = {
    AgencyCode : "接種機構醫事十碼章",
    IdNo: "身份證字號",
    Name: "姓名",
    Birthday: "生日",
    InocuDate: "接種日期",
    VaccID: "疫苗代碼",
    VaccDoses: "接種次數"
}