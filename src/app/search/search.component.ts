import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ICreationData } from '../create-page/create-page-models';
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
    public data: Array<ICreationData>;
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
        Name: joi.string().allow(''),
        Birthday: joi.string().allow(''),
        InocuDate: joi.string().allow(''),
        VaccID: joi.string().allow(''),
        VaccDoses: joi.number().empty('')
    };
    public searchParams: ICreationData = {
        AgencyCode: '',
        IdNo: '',
        Name: '',
        Birthday: '',
        VaccID: '',
        VaccDoses: 0,
        InocuDate: ''
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
        $('#selector-vaccine-dose-number').selectpicker();
        this.birthDateicker = $('#inputBirthDate').datepicker({
            format: 'yyyy-mm-dd', // 設定格式為2019-04-01
            autoclose: true, // 選擇日期後就會自動關閉
            language: 'zh-TW'// 中文化
        }).on('changeDate', (e) => {
            this.searchParams.Birthday = e.format();
        }).on('hide', (e) => {
            this.searchParams.Birthday = e.format();
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
                        console.log(Buffer.from(item["qrcode"]["data"], "utf-8").toString("utf8"));
                    }

                    this.cdr.detectChanges();
                }
            );
        }

    }

    onVaccItemChange() {
        this.selectedVaccItem = this.vaccineItem.find(v => v.id === this.searchParams.VaccID);
    }

    onReadNHICardClick() : void {
        this._NHICardService.init();
        this._NHICardService.getBasicDataInCard().then( (item: INHICardData)=> {
            this.searchParams.IdNo = item.idNo;
            this.searchParams.Name = item.name;
            this.searchParams.Birthday = item.birthDate;
            this.cdr.detectChanges();
        });
    }


    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.blockUI.resetGlobal();
    }
}
