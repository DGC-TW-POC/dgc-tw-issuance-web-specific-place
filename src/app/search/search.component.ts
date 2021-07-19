import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { IVaccineCDCData, IVaccineCDCDataSearchParameters } from './search.models';
import { vaccineMap } from '../shared/models/vaccine';
import { SearchService } from './search.service';
import * as joi from '@hapi/joi';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { INHICardData } from '../shared/models/nhicard';
import { NHICardService } from '../shared/service/nhicard.service';
declare var $:any;
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit,AfterViewInit {
    @BlockUI() blockUI : NgBlockUI;
    public isInit: boolean;
    public vaccineItem = vaccineMap;
    public data: Array<IVaccineCDCData>;
    public selectedVaccItem = {
        name: '',
        id: '',
        org: {
            name: '',
            id: ''
        }
    };
    private searchParamsSchema = {
        AgencyCode: joi.string().min(10).max(10).allow(''),
        IdNo: joi.string().allow(''),
        person: joi.object({
            IdNo: joi.string().allow(''),
            Name: joi.string().allow(''),
            Birthday: joi.string().allow('')
        }),
        InocuDate: joi.string().allow(''),
        VaccID: joi.string().allow(''),
        VaccDoses: joi.number().empty('')
    };
    public searchParams: IVaccineCDCDataSearchParameters = {
        AgencyCode: '',
        IdNo: '',
        VaccID: '',
        VaccDoses: 0,
        InocuDate: '',
        person: {
            IdNo: "" ,
            Name: "" ,
            Birthday: ""
        }
    };
    private birthDateicker;
    private dateOfVaccinationDatePicker;
    constructor(
        private searchService: SearchService,
        private cdr: ChangeDetectorRef,
        private _NHICardService: NHICardService
    ) { 
        this.isInit = false;
        this.blockUI.start("Lodaing...");
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        // Add 'implements AfterViewInit' to the class.
        $('#selector-vaccine-id').selectpicker();
        $('#selector-vaccine-id').selectpicker('val' , '');
        $('#selector-vaccine-dose-number').selectpicker();
        $('#selector-vaccine-dose-number').selectpicker('val' , 0);
        $('.selectpicker').selectpicker();
        this.birthDateicker = $('#inputBirthDate').datepicker({
            format: 'yyyy-mm-dd', // 設定格式為2019-04-01
            autoclose: true, // 選擇日期後就會自動關閉
            language: 'zh-TW'// 中文化
        }).on('changeDate', (e) => {
            this.searchParams.person.Birthday = e.format();
        }).on('hide', (e) => {
            this.searchParams.person.Birthday = e.format();
        });
        this.dateOfVaccinationDatePicker = $('#inputDateOfVaccination').datepicker({
            format: 'yyyy-mm-dd', // 設定格式為2019-04-01
            autoclose: true, // 選擇日期後就會自動關閉
            language: 'zh-TW', // 中文化m
            endDate: new Date()
        }).on('changeDate', (e) => {
            this.searchParams.InocuDate = e.format();
            // $("#inputDateOfVaccination").val(e.format());
        }).on('hide', (e) => {
            this.searchParams.InocuDate = e.format();
        });
        this.dateOfVaccinationDatePicker.datepicker('setDate', 'now');
        setTimeout(()=> {
            this.isInit = true;
            this.cdr.detectChanges();
            this.blockUI.stop();
        } , 2000)
    }

    searchCDCData(): void {
        const searchParamsJoi = joi.object(this.searchParamsSchema);
        const validation = searchParamsJoi.validate(this.searchParams);
        if (validation.error) {
            console.error(validation);
        } else {
            this.searchService.getCDCData(validation.value).subscribe(
                res => {
                    this.data = res;
                    if (this.data.length == 0) {
                        Swal.fire({
                            titleText: "information" ,
                            text: "查無資料" ,
                            icon: 'info'
                        })
                    }
                    for (let item of this.data) {
                        console.log(item["qrcode"]);
                        if (item.qrcode) {
                            console.log(Buffer.from(item.qrcode.data, "utf-8").toString("utf8"));
                        }
                    }

                    this.cdr.detectChanges();
                },
                err => {
                    console.error(err);
                    Swal.fire({
                        titleText: "錯誤" ,
                        text: "伺服器發生錯誤" ,
                        icon: 'error'
                    })
                }
            );
        }

    }

    onVaccItemChange() {
        this.selectedVaccItem = this.vaccineItem.find(v => v.id === this.searchParams.VaccID);
    }

    onReadNHICardClick() : void {
        this.blockUI.start("讀取健保卡資料中...");
        this._NHICardService.init();
        this._NHICardService.getBasicDataInCard().then( (item: INHICardData)=> {
            this.searchParams.IdNo = item.idNo;
            this.searchParams.person.Name = item.name;
            this.searchParams.person.Birthday = item.birthDate;
            this.cdr.detectChanges();
            this.blockUI.stop();
        }).catch(err => {
            this.searchParams.IdNo = "";
            this.searchParams.person.Name = "";
            this.searchParams.person.Birthday = "";
            this.cdr.detectChanges();
            this.blockUI.stop();
        });
    }


    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.blockUI.resetGlobal();
    }
}
