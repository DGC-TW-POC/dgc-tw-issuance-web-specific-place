import { Component, OnInit, ChangeDetectionStrategy, KeyValueDiffers, ChangeDetectorRef, AfterViewInit, DoCheck, OnDestroy } from '@angular/core';
import { joiTypeMessage } from '../shared/common';
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
import { IVaccineCDCData, IVaccineCDCDataSearchParameters } from '../search/search.models';

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
    public isInit: boolean;
    public isShowQrcode: boolean;
    public vaccineItem = vaccineMap;
    public agencyItem = agencyMap;
    public cdcData: ICDCData;
    private searchParams: IVaccineCDCDataSearchParameters;
    public searchResult: Array<IVaccineCDCData>;
    private dataSchema;
    public data: ICreationData;
    private dataJoi;
    private birthDateicker;
    private dateOfVaccinationDatePicker;
    public selectedVaccItem: IVaccine;
    public eudgc;
    public qrcode: string;
    public TAN: string;
    constructor(
        private differs: KeyValueDiffers,
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
        this.searchResult = [];
        this.qrcode = "123";
        this.cdcData = {
            AgencyCode: undefined,
            Data: undefined
        };
        this.dataSchema = {
            AgencyCode: joi.required(),
            IdNo: joi.string().required(),
            Name: joi.string().required(),
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
            qrcode: "123"
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
        this.data = {
            AgencyCode: undefined,
            IdNo: undefined,
            Name: undefined,
            Birthday: undefined,
            InocuDate: undefined,
            VaccID: undefined,
            VaccDoses: 1,
            qrcode: "0"
        }
        this.init();
        localStorage.removeItem('dgcCreateData');
        Swal.fire({
            icon: "info",
            text: "清除成功"
        });
    }

    backendDataToCreationData(data: IVaccineCDCData): void {
        this.data.AgencyCode = data.AgencyCode;
        this.data.Name = data.person.Name;
        this.data.IdNo = data.IdNo;
        this.data.Birthday = data.person.Birthday;
        this.data.InocuDate = data.InocuDate;
        this.data.VaccDoses = data.VaccDoses;
        this.data.VaccID = data.VaccID;
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
                        this.searchResult = [];
                        if ((res as Array<any>).length == 0 ) return;
                        let firstItem: IVaccineCDCData = (res as Array<any>).pop();
                        this.searchResult.push(firstItem);
                        let secondItem = _.find(res, { 'IdNo': firstItem.IdNo });
                        if (secondItem) this.searchResult.push(secondItem);
                        res = undefined;
                        this.searchResult = _.sortBy(this.searchResult , 'VaccDoses');
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
                    this.searchResult = [];
                    this.blockUI.stop();
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
                    fn: undefined,
                    fnt: this.data.Name!,
                    gn: undefined,
                    gnt: undefined
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
            this.cdr.detectChanges();
            this.blockUI.stop();
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

