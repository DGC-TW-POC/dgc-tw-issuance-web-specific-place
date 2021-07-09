import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SearchPageService } from './search-page.service';
import { ICDCData } from './search-page.model';
import { vaccineMap } from '../create-page/create-page-models';
import { setInputFilter, verifyTWIdentifier } from '../shared/common';
import * as joi from '@hapi/joi';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchPageComponent implements OnInit {
  constructor(private searchPageService: SearchPageService,
    private cdr: ChangeDetectorRef) { }
  public vaccineItem = vaccineMap;
  public data: Array<ICDCData>;
  public selectedVaccItem = {
    name: "",
    id: "",
    org: {
      name: "",
      id: ""
    }
  };
  private searchParamsSchema = {
    AgencyCode: joi.string().min(10).max(10).allow(''),
    IdNo: joi.string().allow('').custom((v, helper) => {
      if (verifyTWIdentifier(v)) {
        return true;
      } else {
        return helper.error("身份證字號格式錯誤")
      }
    }),
    Name: joi.string().allow(''),
    Birthday: joi.string().allow(''),
    InocuDate: joi.string().allow(''),
    VaccID: joi.string().allow(''),
    VaccDoses: joi.number().min(1).empty('')
  };
  public searchParams: ICDCData = {
    AgencyCode: "",
    IdNo: "",
    Name: "",
    Birthday: "",
    VaccID: "",
    VaccDoses: 1,
    InocuDate: ""
  };
  private birthDateicker;
  private dateOfVaccinationDatePicker;
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setInputFilter(document.getElementById("inputDoseNumber"), function (value) {
      return /^\d*\.?\d*$/.test(value);
    });
    this.birthDateicker = $('#inputBirthDate').datepicker({
      format: "yyyy-mm-dd", //設定格式為2019-04-01
      autoclose: true,//選擇日期後就會自動關閉
      language: 'zh-TW'//中文化
    }).on('changeDate', (e) => {
      this.searchParams.Birthday = e.format();
    }).on('hide', (e) => {
      this.searchParams.Birthday = e.format();
    });
    this.dateOfVaccinationDatePicker = $('#inputDateOfVaccination').datepicker({
      format: "yyyy-mm-dd", //設定格式為2019-04-01
      autoclose: true,//選擇日期後就會自動關閉
      language: 'zh-TW',//中文化m
      endDate: new Date()
    }).on('changeDate', (e) => {
      this.searchParams.InocuDate = e.format();
      //$("#inputDateOfVaccination").val(e.format());
    }).on('hide', (e) => {
      this.searchParams.InocuDate = e.format();
    });
    this.dateOfVaccinationDatePicker.datepicker('setDate', 'now');
    this.cdr.detectChanges();
  }

  searchCDCData(): void {
    let searchParamsJoi = joi.object(this.searchParamsSchema);
    let validation = searchParamsJoi.validate(this.searchParams);
    if (validation.error) {
      console.error(validation);
    } else {
      this.searchPageService.getCDCData(validation.value).subscribe(
        res => {
          this.data = res;
          this.cdr.detectChanges();
        }
      );
    }

  }

  onVaccItemChange() {
    this.selectedVaccItem = this.vaccineItem.find(v => v.id == this.searchParams.VaccID);
  }

  onDeleteActionClick(item: ICDCData) {
    console.log(item);
    Swal.fire({
      title: '你確定要刪除此資料嗎？',
      showDenyButton : true,
      confirmButtonText: "確定的啦" , 
      confirmButtonColor: "#4752C4",
      denyButtonText: "不要啦"
    }).then((result)=> {
      if (result.isConfirmed) {
        console.log("do deletion");
        this.searchPageService.deleteCDCData(item.id).subscribe(
          res => {
            Swal.fire({
              title: '刪除成功' ,
              icon: 'info'
            }).then((result)=> {
              this.searchCDCData();
            });
          } ,
          err => {
            console.error(err);
          }
        )
      }
    });
  }

}
