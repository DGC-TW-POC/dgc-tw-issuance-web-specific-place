import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-route.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component'
import { BlockUIModule } from 'ng-block-ui';
import { SearchPageComponent } from './search-page/search-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FooterComponent } from './footer/footer.component';
import { ReactShowPdfComponent } from './react-component/components/show-certificate.component-wrapper';


@NgModule({
  declarations: [
    AppComponent,
    ReactShowPdfComponent,
    LeftSideBarComponent,
    SearchPageComponent,
    CreatePageComponent,
    FooterComponent
  ],
  imports: [
    BlockUIModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    QRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
