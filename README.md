# dgc-tw-vaccine-web
EU疫苗護照概念式驗證開發前端。
使用情境為特約地點幫民眾申請qr code。
- 語言與框架:  Angular, Typescript
>含了一點react在裡面，從[dgca-issuance-web](https://github.com/eu-digital-green-certificates/dgca-issuance-web)抽離發證api及產生pdf的功能

## DEMO
- 輸入頁面
![](https://i.imgur.com/xcWxOuN.png)
- 用身分證取得被接種者的接種劑次資料
![](https://i.imgur.com/sGm42Bc.png)
- 選取劑次
- 產生qrcode
![](https://i.imgur.com/UccuTjn.png)
- [PDF](14abab50-bba6-41df-a502-8d81af425222.pdf)


## 前置作業
- angular 9
- 請記得把[dgc-tw-vaccine-service](#)給架起來
- 請先安裝[angular CLI](https://angular.tw/guide/setup-local)
> `npm install -g @angular/cli`
## 進度
- 依照CDC欄位對應EU-JSON建立輸入表單
- 呼叫Issuance-service並產生qrcode
- 儲存CDC欄位對應EU-JSON的資料到sql database
- 刪除資料(並非真的刪除，用`isLocked`判斷資料是否被凍結)
- 使用`localStorage`儲存使用者輸入的資料
> 按下頁面上的清除就會把`localStorage`清除

## 設定
`proxy.config.json`用來轉發api要call什麼url的設定檔
```JSON
{
    "/api": { //dgc-tw-vaccine-service
        "target": "http://localhost:9191", 
        "secure": false
    } ,
    "/dgca-issuance-service" : { //dgc-issuance-service
        "target" : "https://example.com",
        "secure" : true,
        "changeOrigin": true,
        "auth" : "username:password"
    }
}
```
## 啟動
- Run `npm install`
- Run `npm run start`