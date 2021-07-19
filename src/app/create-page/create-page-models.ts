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
    VaccDoses: number;
}

export interface ICreationData {
    NHIId?: string;
    AgencyCode: string;
    IdNo: string;
    Name: string;
    Birthday: string;
    InocuDate: string;
    VaccID: string;
    VaccDoses: number;
    qrcode?: string;
    dgci_hash?: string;
}

export const dataTranslation = {
    AgencyCode : "接種機構醫事十碼章",
    IdNo: "身份證字號/護照號碼/居留證號碼",
    Name: "姓名",
    Birthday: "生日",
    InocuDate: "接種日期",
    VaccID: "疫苗代碼",
    VaccDoses: "接種次數"
}

//https://www1.nhi.gov.tw/QueryN/query3.aspx
export const agencyMap = [
    {
        name : "醫療財團法人好心肝基金會好心肝診所" ,
        code : "4001180029"
    },
    {
        name : "臺北榮民總醫院",
        code : "0601160016"
    }
]