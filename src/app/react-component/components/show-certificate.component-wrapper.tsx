import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, AfterViewInit, ViewChild ,ElementRef } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EUDCC1 } from '../generated-files/dgc-combined-schema';
import { ShowCertificate }  from './show-certificate.component'
const containerElementName = 'myReactComponentContainer';
@Component({
    selector: 'app-react-wrapper',
    template: `
        <div [id]="rootId"></div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush   
})
//把react的component wrap給angular用
export class ReactShowPdfComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;
    @Input() eudgc; //把eudgc的資料input給react component用
    constructor() { }
    public rootId = 'react-wrapper-root';
    private hasViewLoaded = false;
    ngOnInit(): void {        
    }

    public ngOnChanges() {
        this.renderComponent();
    }

    public ngAfterViewInit() {
        this.hasViewLoaded = true; //避免重複render
        this.renderComponent();
    }
    private renderComponent() {
        if (!this.hasViewLoaded) {
            return;
        }

        const props  = {
            eudgc : this.eudgc
        };
        ReactDOM.render(React.createElement(ShowCertificate, props)  ,document.getElementById(this.rootId));
        /*ReactDOM.render(<div>
            <ShowCertificate eudgc={this.eudgc}/>
        </div>
             ,this.containerRef.nativeElement
        );*/
    }
}
