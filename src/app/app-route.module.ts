import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  /*{
    "path": '' , 
    component : SearchPageComponent , 
    data : {
      title : "接種資料查詢",
      description : "擷取CDC接種疫苗資料API轉換EU疫苗護照Json所需欄位，並在此頁面做RUD的動作"
    } ,
  } ,*/
  {
    "path" : '' ,
    component: CreatePageComponent ,
    data : {
      title : "接種資料創建",
      description: "創建"
    }
  } ,
  {
    path: "search" ,
    component : SearchComponent ,
    data : {
      title: "接種資料查詢",
      description: ""
    }
  },
  {
    "path" : "**",
    redirectTo : ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
