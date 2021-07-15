import { Component, OnInit, ChangeDetectionStrategy, KeyValueDiffers, ChangeDetectorRef, AfterViewInit, DoCheck } from '@angular/core';
import { joiTypeMessage, verifyTWIdentifier } from '../shared/common';
import { vaccineMap, agencyMap, ICDCData, dataTranslation, IVaccine } from './create-page-models';
import * as _ from 'lodash';
import * as joi from '@hapi/joi';
import Swal from 'sweetalert2';
import { CreatePageService } from './create-page.service';
import { EUDCC1, VaccinationEntry } from '../shared/dgc-combined-schema.d';
import genEDGCQR from '../shared/misc/edgcQRGenerator';
import { CertResult } from '../shared/misc/edgcQRGenerator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


//import * as $ from 'jquery';
declare var $: any;
@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePageComponent implements OnInit, AfterViewInit, DoCheck {
    @BlockUI() blockUI: NgBlockUI;
    public isInit: boolean;
    public isShowQrcode: boolean;
    public vaccineItem = vaccineMap;
    public cdcData: ICDCData;
    public agencyItem = agencyMap;
    private dataSchema;
    public data;
    private dataJoi;
    private birthDateicker;
    private dateOfVaccinationDatePicker;
    public selectedVaccItem: IVaccine;
    public eudgc;
    public qrCode: string;
    public TAN: string;
    constructor(private differs: KeyValueDiffers,
        private cdr: ChangeDetectorRef,
        private createPageService: CreatePageService) {
        this.blockUI.start("Loading...");
        this.isInit = false;
    }


    ngOnInit(): void {
        this.qrCode = "1";
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
            VaccDoses: joi.number().min(1).required()
        };
        this.dataJoi = joi.object(this.dataSchema);
        this.data = {
            AgencyCode: undefined,
            IdNo: undefined,
            Name: undefined,
            Birthday: undefined,
            InocuDate: undefined,
            VaccID: undefined,
            VaccDoses: 1
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
            VaccDoses: 1
        }
        this.init();
        localStorage.removeItem('dgcCreateData');
    }

    onCreationClick(): void {
        this.blockUI.start("建立中...");
        let dataValidation = this.dataJoi.validate(this.data);
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
                    console.log(this.eudgc);
                    localStorage.setItem("dgcCreateData", JSON.stringify(this.data));
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
                    this.qrCode = certResult.qrCode;
                    this.TAN = certResult.tan;
                    this.cdr.detectChanges();
                    this.blockUI.resetGlobal();
                    return resolve(true);
                })
                .catch(error => {
                    console.error(error);
                    this.blockUI.resetGlobal();
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
    ngDoCheck(): void {
        //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
        //Add 'implements DoCheck' to the class.
        //給react用
        $("qrcode canvas").each(function (index) {
            $(this).attr("id", "qr-code-pdf");
        });
    }

}

