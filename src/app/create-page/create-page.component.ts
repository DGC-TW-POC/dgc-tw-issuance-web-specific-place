import { Component, OnInit, ChangeDetectionStrategy, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, ChangeDetectorRef } from '@angular/core';
import { joiTypeMessage, setInputFilter, verifyTWIdentifier } from '../shared/common';
import { vaccineMap, agencyMap, ICDCData, dataTranslation , IVaccine } from './create-page-models';
import * as _ from 'lodash';
import * as joi from '@hapi/joi';
import Swal from 'sweetalert2';
import { FormBuilder, Validator, Validators } from '@angular/forms';
import { CreatePageService } from './create-page.service';
import { EUDCC1, VaccinationEntry } from '../shared/dgc-combined-schema.d';
import genEDGCQR from '../shared/misc/edgcQRGenerator';
import { CertResult } from '../shared/misc/edgcQRGenerator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { qrcodeDataDecoder } from '../shared/misc/decoder/decoder';


//import * as $ from 'jquery';
declare var $: any;
@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePageComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    constructor(private differs: KeyValueDiffers,
                private cdr: ChangeDetectorRef,
                private createPageService : CreatePageService) { }

    public vaccineItem = vaccineMap;
    public cdcData: ICDCData = {
        AgencyCode: undefined,
        Data: undefined
    };
    public agencyItem = agencyMap;
    private dataSchema = {
        AgencyCode: joi.required(),
        IdNo: joi.string().required(),
        Name: joi.string().required(),
        Birthday: joi.string().required(),
        InocuDate: joi.string().required(),
        VaccID: joi.string().required(),
        VaccDoses: joi.number().min(1).required()
    };
    public data = {
        AgencyCode: undefined,
        IdNo: undefined,
        Name: undefined,
        Birthday: undefined,
        InocuDate: undefined,
        VaccID: undefined,
        VaccDoses: 1
    }
    private dataJoi = joi.object(this.dataSchema);
    private birthDateicker;
    private dateOfVaccinationDatePicker;
    public selectedVaccItem : IVaccine = {
        "name": "",
        "id": "",
        "type" : {
            "id" : "" ,
            "name" : ""
        },
        "org": {
            "id": "",
            "name": ""
        }
    };
    public eudgc;
    public qrCode = "123";
    public TAN;

    ngOnInit(): void {
    }
    handleShowPdf () :void {

    }
    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        $(".selector-vaccine-id").selectpicker();
        $(".selector-vaccine-id").selectpicker('val', this.selectedVaccItem.id);
        $(".selector-vaccine-dose-number").selectpicker();
        $(".selector-vaccine-dose-number").selectpicker('val', 1);
        $(".selector-agency").selectpicker();
        $(".selector-agency").selectpicker('val' , `${this.agencyItem[0].name}-${this.agencyItem[0].code}`);
        this.birthDateicker = $('#inputBirthDate').datepicker({
            format: "yyyy-mm-dd", //設定格式為2019-04-01
            autoclose: true,//選擇日期後就會自動關閉
            language: 'zh-TW'//中文化
        }).on('changeDate', (e) => {
            this.data.Birthday = e.format();
        }).on('hide', (e) => {
            this.data.Birthday = e.format();
        });
        this.dateOfVaccinationDatePicker = $('#inputDateOfVaccination').datepicker({
            format: "yyyy-mm-dd", //設定格式為2019-04-01
            autoclose: true,//選擇日期後就會自動關閉
            language: 'zh-TW',//中文化m
            endDate: new Date()
        }).on('changeDate', (e) => {
            this.data.InocuDate = e.format();
            //$("#inputDateOfVaccination").val(e.format());
        }).on('hide', (e) => {
            this.data.InocuDate = e.format();
        });
        this.dateOfVaccinationDatePicker.datepicker('setDate', 'now');
        let savedData = localStorage.getItem("dgcCreateData");
        if (savedData) {
            this.data = JSON.parse(savedData);
            let dataValidation = this.dataJoi.validate(this.data);
            if (dataValidation.error) { 
                this.clearData();
            } else {
                this.selectedVaccItem = vaccineMap.find(v=> v.id == this.data.VaccID);
                $(".selector-vaccine-id").selectpicker("val" , this.selectedVaccItem.id);
                $(".selector-vaccine-dose-number").selectpicker("val" , this.data.VaccDoses);
                $(".selector-agency").selectpicker("val" , this.data.AgencyCode);
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
                this.eudgc = Object.assign({} ,{
                    ver: '1.3.0',
                    nam: {
                        fn: undefined,
                        fnt: this.data.Name!,
                        gn: undefined,
                        gnt: undefined
                    },
                    dob: this.data.Birthday,
                    v: [vacc]
                });
                this.onVaccItemChange();
                this.cdr.detectChanges();
            }
        }
        this.cdr.detectChanges();
    }

    clearData() : void {
        this.data = {
            AgencyCode: undefined,
            IdNo: undefined,
            Name: undefined,
            Birthday: undefined,
            InocuDate: undefined,
            VaccID: undefined,
            VaccDoses: 1
        }
        this.ngAfterViewInit();
        localStorage.removeItem('dgcCreateData');
    }
    onCreationClick(): void {
        this.blockUI.start("建立中...");
        localStorage.setItem("dgcCreateData" , JSON.stringify(this.data));
        let dataValidation = this.dataJoi.validate(this.data);
        console.log(this.data);
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
        if (!verifyTWIdentifier(this.data.IdNo)) {
            this.blockUI.resetGlobal();
            Swal.fire('Oops...', "身份證字號格式錯誤", 'error');
            return;
        }
        this.cdcData.AgencyCode = this.data.AgencyCode;
        this.cdcData.Data = [];
        this.cdcData.Data.push(this.data);
        this.createPageService.postItem(this.data).subscribe(
            res=> {
                this.doGenEDGCQE()
                //location.reload();
            },
            err => {
                this.blockUI.resetGlobal();
                Swal.fire('Oops...', "伺服器發生錯誤", 'error');
                console.error(err);
            }
        );
    }

    private doGenEDGCQE () {
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
            $("#modalQrCode").modal('show');
            console.log(vacc)
            console.log(this.eudgc);
            this.blockUI.resetGlobal();
        })
        .catch(error => {
            console.error(error);
            this.blockUI.resetGlobal();
        });
    }

    joiTest(field: string) {
        let validation : joi.ValidationResult = this.dataSchema[field].validate(this.data[field]);
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
        $("qrcode canvas").each(function(index){
            $(this).attr("id" ,"qr-code-pdf");
        });
    }

    onTestBtnClick() : void {
        qrcodeDataDecoder(this.qrCode);
    }
}

