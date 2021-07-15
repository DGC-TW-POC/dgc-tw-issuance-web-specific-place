interface IVaccineType {
    name: string;
    id: string;
}

interface IVaccineOrg {
    name: string;
    id: string;
}

export interface IVaccine {
    name: string;
    id: string;
    type: IVaccineType;
    org: IVaccineOrg;
}

export const vaccineMap: Array<IVaccine> = [
    {
        name : 'Vaxzavria (AZ)' ,
        id : 'EU/1/21/1529',
        type : {
            name : 'SARS-CoV-2 antigen vaccine',
            id : '1119305005'
        } ,
        org : {
            name : 'AstraZeneca AB' ,
            id : 'ORG-100001699'
        }
    } ,
    {
        name : 'COVID-19 Vaccine Moderna (莫德納 COVID-19 疫苗)',
        id: 'EU/1/20/1507' ,
        type : {
            name : 'SARS-CoV-2 mRNA vaccine' ,
            id : '1119349007'
        },
        org : {
            name : 'Moderna Biotech Spain S.L.',
            id : 'ORG-100031184'
        }
    } ,
    {
        name : 'Comirnaty (輝瑞/BNT COVID-19 疫苗)',
        id : 'EU/1/20/1528',
        type : {
            name : 'SARS-CoV-2 mRNA vaccine' ,
            id : '1119349007'
        },
        org : {
            name : 'Biontech Manufacturing GmbH',
            id : 'ORG-100030215'
        }
    }
];
