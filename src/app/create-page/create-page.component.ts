import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, DoCheck, OnDestroy } from '@angular/core';
import { joiTypeMessage, setInputFilter } from '../shared/common';
import { agencyMap, ICDCData, dataTranslation, ICreationData } from './create-page-models';
import { vaccineMap, IVaccine } from '../shared/models/vaccine';
import { INHICardData } from '../shared/models/nhicard';
import * as _ from 'lodash';
import * as joi from '@hapi/joi';
import Swal from 'sweetalert2';
import { CreatePageService } from './create-page.service';
import { VaccinationEntry } from '../shared/dgc-combined-schema.d';
import genEDGCQR from '../shared/misc/edgcQRGenerator';
import { CertResult } from '../shared/misc/edgcQRGenerator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NHICardService } from '../shared/service/nhicard.service';
import { VaccineService } from '../shared/service/vaccine.service';
import { SearchService } from '../search/search.service';
import { IVaccineCDCData, IVaccineCDCDataSearchParameters, IVaccineSearchResult } from '../search/search.models';
import romanize from 'romanize-names';
import { normalizeName } from 'normalize-text';
//import * as $ from 'jquery';
declare var $: any;
@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePageComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
    @BlockUI() blockUI: NgBlockUI;
    //#region variable
    public isInit: boolean;
    public isShowQrcode: boolean;
    public vaccineItem = vaccineMap;
    public agencyItem = agencyMap;
    public cdcData: ICDCData;
    private searchParams: IVaccineCDCDataSearchParameters;
    public searchResult: IVaccineSearchResult;
    private dataSchema;
    public data: ICreationData;
    private dataJoi;
    private birthDateicker;
    private dateOfVaccinationDatePicker;
    public selectedVaccItem: IVaccine;
    public eudgc;
    public qrcode: string;
    public TAN: string;
    //#endregion 
    constructor(
        private cdr: ChangeDetectorRef,
        private createPageService: CreatePageService,
        private _NHICardService: NHICardService,
        private vaccineService: VaccineService,
        private searchService: SearchService
    ) {
        this.blockUI.start("Loading...");
        this.isInit = false;
    }


    ngOnInit(): void {
        this.searchParams = {
            AgencyCode: '',
            IdNo: '',
            VaccID: '',
            VaccDoses: 0,
            InocuDate: '',
            person: {
                IdNo: "",
                Name: "",
                Birthday: ""
            }
        };
        this.searchResult = {
            count : 0 ,
            rows: []
        };
        this.qrcode = "123";
        this.cdcData = {
            AgencyCode: undefined,
            Data: undefined
        };
        this.dataSchema = {
            AgencyCode: joi.required(),
            IdNo: joi.string().required(),
            Name: joi.string().required(),
            LastName: joi.string().regex(/^[A-Z<]*$/).required(),
            FirstName : joi.string().regex(/^[A-Z<]*$/).required(),
            Birthday: joi.string().required(),
            InocuDate: joi.string().required(),
            VaccID: joi.string().required(),
            VaccDoses: joi.number().min(1).required(),
            qrcode: joi.string().default('0'),
            dgci_hash: joi.string().default('0')
        };
        this.dataJoi = joi.object(this.dataSchema);
        this.data = {
            AgencyCode: undefined,
            IdNo: undefined,
            Name: undefined,
            Birthday: undefined,
            InocuDate: undefined,
            VaccID: undefined,
            VaccDoses: 1,
            qrcode: "123" ,
            LastName : '',
            FirstName: ''
        }
        this.selectedVaccItem = {
            "name": "",
            "id": "",
            "type": {
                "id": "",
                "name": ""
            },
            "org": {
                "id": "",
                "name": ""
            }
        };
    }
    init(): void {
        //#region init selectpicker
        $(".selector-vaccine-id").selectpicker();
        $(".selector-vaccine-id").selectpicker('val', this.selectedVaccItem.id);
        $(".selector-vaccine-dose-number").selectpicker();
        $(".selector-vaccine-dose-number").selectpicker('val', 1);
        $(".selector-agency").selectpicker();
        $(".selector-agency").selectpicker('val', `${this.agencyItem[0].name}-${this.agencyItem[0].code}`);
        this.data.AgencyCode = `${this.agencyItem[0].name}-${this.agencyItem[0].code}`;
        //#endregion

        //#region 初始化生日日期picker
        this.birthDateicker = $('#inputBirthDate').datepicker({
            format: "yyyy-mm-dd", //設定格式為2019-04-01
            autoclose: true,//選擇日期後就會自動關閉
            language: 'zh-TW'//中文化
        }).on('changeDate', (e) => {
            this.data.Birthday = e.format();
        }).on('hide', (e) => {
            this.data.Birthday = e.format();
        });
        //#endregion

        //#region 初始化接種日期picker
        this.dateOfVaccinationDatePicker = $('#inputDateOfVaccination').datepicker({
            format: "yyyy-mm-dd", //設定格式為2019-04-01
            autoclose: true,//選擇日期後就會自動關閉
            language: 'zh-TW',//中文化
            endDate: new Date() //最高只能選到當天
        }).on('changeDate', (e) => {
            this.data.InocuDate = e.format();
            //$("#inputDateOfVaccination").val(e.format());
        }).on('hide', (e) => {
            this.data.InocuDate = e.format();
        });
        //預設今天
        this.dateOfVaccinationDatePicker.datepicker('setDate', 'now');
        //#endregion

        this.cdr.detectChanges();
    }
    ngAfterViewInit(): void {
        this.init();
        setInputFilter(document.getElementById("inputFirstName") , function(v) {
            //v = v.toUpperCase()
            return /^[A-Z< ]+$/gm.test(v)
        });
        //取得localStorage儲存的上一次接種資料
        let savedData = localStorage.getItem("dgcCreateData");
        if (savedData) {
            this.data = JSON.parse(savedData);
            let dataValidation = this.dataJoi.validate(this.data);
            if (dataValidation.error) {
                this.clearData();
            } else {
                this.selectedVaccItem = vaccineMap.find(v => v.id == this.data.VaccID);
                $(".selector-vaccine-id").selectpicker("val", this.selectedVaccItem.id);
                $(".selector-vaccine-dose-number").selectpicker("val", this.data.VaccDoses);
                $(".selector-agency").selectpicker("val", this.data.AgencyCode);
                this.onVaccItemChange();
            }
        }

        setTimeout(() => {
            this.blockUI.stop();
            this.isInit = true;
            this.cdr.detectChanges();
        }, 2500);
    }

    clearData(): void {
        this.ngOnInit();
        this.init();
        localStorage.removeItem('dgcCreateData');
        Swal.fire({
            icon: "info",
            text: "清除成功"
        });
    }

    backendDataToCreationData(data: IVaccineCDCData): void {
        let agency = this.agencyItem.find(v=> v.code == data.AgencyCode);
        this.data.AgencyCode = `${agency.name}-${agency.code}`;
        this.data.Name = data.person.Name;
        this.data.IdNo = data.IdNo;
        this.data.Birthday = data.person.Birthday;
        this.data.InocuDate = data.InocuDate;
        this.data.VaccDoses = data.VaccDoses;
        this.data.VaccID = data.VaccID;
        this.onBtnRomanizeNameClick();
        this.onVaccItemChange();
        this.cdr.detectChanges();
        $(".selector-vaccine-id").selectpicker("val", this.selectedVaccItem.id);
        $(".selector-vaccine-dose-number").selectpicker("val", this.data.VaccDoses);
        $(".selector-agency").selectpicker("val", this.data.AgencyCode);
        $("#modelSearchResultSelection").modal("hide");
    }

    onGetDataFromBackendClick(): void {
        this.blockUI.start("取得資料中...");
        let cloneData = _.cloneDeep(this.data);
        this.searchParams.IdNo = cloneData.IdNo;
        this.searchParams.person.Name = cloneData.Name;
        this.searchParams.person.Birthday = cloneData.Birthday;
        if (this.searchParams.IdNo || this.searchParams.person.Name || this.searchParams.person.Birthday) {
            this.searchService.getCDCData(this.searchParams).subscribe(
                res => {
                    try {
                        this.searchResult = {
                            count: 0,
                            rows: []
                        };
                        if ((res["rows"] as Array<any>).length == 0 ) {
                            this.blockUI.stop();
                            Swal.fire({
                                icon: 'info',
                                text : '查無資料'
                            })
                            return;
                        }
                        let firstItem: IVaccineCDCData = (res as Array<any>)["rows"].pop();
                        this.searchResult.rows.push(firstItem);
                        let secondItem = _.find(res["rows"], { 'IdNo': firstItem.IdNo });
                        if (secondItem) this.searchResult.rows.push(secondItem);
                        res = undefined;
                        this.searchResult.rows = _.sortBy(this.searchResult.rows , 'VaccDoses');
                        this.cdr.detectChanges();
                        $("#modelSearchResultSelection").modal("show");
                        this.blockUI.stop();
                    } catch (e) {
                        console.error(e);
                        this.blockUI.stop();
                    }
                },
                err => {
                    console.error(err);
                    this.searchResult = {
                        count: 0,
                        rows: []
                    };
                    this.blockUI.stop();
                    Swal.fire('Oops...', "伺服器發生錯誤", 'error');
                }
            )
        } else {
            this.blockUI.stop();
            Swal.fire({
                title: '請你不要這樣做',
                text: '請輸入至少一個條件(姓名、身份證字號/護照號碼/居留證號碼、生日)',
                icon: 'warning'
            });
        }
    }
    onCreationClick(): void {
        this.blockUI.start("建立中...");
        let dataValidation = this.dataJoi.validate(this.data, {
            allowUnknown: true
        });
        if (dataValidation.error) {
            this.blockUI.resetGlobal();
            let detail = dataValidation.error.details.pop();
            let type = detail.type;
            let path = detail.path.pop();
            if (joiTypeMessage[type]) {
                let translatedDetail = `"${dataTranslation[path]}" ${joiTypeMessage[type]}`;
                Swal.fire('Oops...', translatedDetail, 'error');
            } else {
                let translatedDetail = detail.message.replace(String(path), dataTranslation[path]);
                Swal.fire('Oops...', translatedDetail, 'error');
            }
            return;
        }
        this.cdcData.AgencyCode = this.data.AgencyCode;
        this.cdcData.Data = [];
        this.cdcData.Data.push(this.data);
        this.doGenEDGCQE().then(() => {
            console.log("do Gen EDGCQE");
            this.createPageService.postItem(this.data).subscribe(
                res => {
                    //防止按旁邊或按esc關閉modal
                    $("#modalQrCode").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    $("#modalQrCode").modal('show');
                    //console.log(this.eudgc);
                    let saveDgcCreateData = _.cloneDeep(this.data);
                    saveDgcCreateData.dgci_hash = "0";
                    saveDgcCreateData.qrcode = "0";
                    localStorage.setItem("dgcCreateData", JSON.stringify(saveDgcCreateData));
                },
                err => {
                    this.blockUI.resetGlobal();
                    Swal.fire('Oops...', "伺服器發生錯誤", 'error');
                    console.error(err);
                }
            );
        })

    }

    private doGenEDGCQE(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const vacc: VaccinationEntry = {
                tg: "840539006",
                vp: this.selectedVaccItem.type.id,
                mp: this.selectedVaccItem.id,
                ma: this.selectedVaccItem.org.id,
                dn: Number(this.data.VaccDoses),
                sd: 2,
                dt: this.data.InocuDate,
                co: "TW",
                is: this.data.AgencyCode,
                ci: ''
            };
            this.eudgc = {
                ver: '1.3.0',
                nam: {
                    fn: normalizeName(this.data.LastName.replace(/</gm , " ")),
                    fnt: `${this.data.LastName}<${this.data.Name!}`,
                    gn: normalizeName(this.data.FirstName.replace(/</gm , " ")),
                    gnt: this.data.FirstName
                },
                dob: this.data.Birthday,
                v: [vacc]
            }
            genEDGCQR(this.eudgc)
                .then((certResult: CertResult) => {
                    //console.log("qrcode: " + certResult.qrCode);
                    this.qrcode = certResult.qrCode;
                    this.data.qrcode = this.qrcode;
                    this.data.dgci_hash = this.vaccineService.computeDgciHash(vacc.ci);
                    this.TAN = certResult.tan;
                    this.cdr.detectChanges();
                    this.blockUI.stop();
                    return resolve(true);
                })
                .catch(error => {
                    console.error(error);
                    this.blockUI.stop();
                    return reject(false);
                });
        });
    }

    onBtnRomanizeNameClick(translateSystem:string="HANYU") : void {
        try {
            let romanizeName:string = romanize(this.data.Name,translateSystem);
            let [firstName, lastName] = romanizeName.split(" ");
            firstName = firstName.replace(/-/gm , "<").toUpperCase();
            lastName = lastName.replace(/-/gm , "<").toUpperCase();
            this.data.FirstName = firstName;
            this.data.LastName = lastName;
            this.cdr.detectChanges();
        } catch(e) {
            console.error(e);
            Swal.fire({
                text: "抱歉，此名字目前自動翻譯不支援。" , 
                icon: "error"
            });
        }
        
    }

    enNameFilter(event) : void {
        event.target.value = event.target.value.replace(/[ ]/, "<").toUpperCase();
        this.data.FirstName = event.target.value;
    }
    joiTest(field: string) {
        let validation: joi.ValidationResult = this.dataSchema[field].validate(this.data[field]);
        if (validation.error) {
            return false;
        }
        return true;
    }

    displayFieldCss(field: string) {
        return {
            'is-invalid': !this.joiTest(field),
        };
    }

    onVaccItemChange(): void {
        this.selectedVaccItem = this.vaccineItem.find(v => v.id == this.data.VaccID);
    }

    onReadNHICardClick(): void {
        this.blockUI.start("讀取健保卡資料中...");
        this._NHICardService.init();
        this._NHICardService.getBasicDataInCard().then((item: INHICardData) => {
            this.data.NHIId = item.cardId;
            this.data.IdNo = item.idNo;
            this.data.Name = item.name;
            this.data.Birthday = item.birthDate;
            this.cdr.detectChanges();
            this.blockUI.stop();
        }).catch(err => {
            this.data.NHIId = "";
            this.data.IdNo = "";
            this.data.Name = "";
            this.data.Birthday = "";
            this.data.LastName = "";
            this.data.FirstName = "";
            this.cdr.detectChanges();
            this.blockUI.stop();
            let errorMessage = (window as any)['nhca'] ? (window as any)['nhca'].errorMessage: "未安裝健保卡元件"
            Swal.fire({
                icon:'error',
                text: errorMessage
            })
        });
    }

    ngDoCheck(): void {
        //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
        //Add 'implements DoCheck' to the class.
        //給react用
        $("qrcode canvas").each(function (index) {
            $(this).attr("id", "qr-code-pdf");
        });
    }
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.blockUI.resetGlobal();
    }
}

