# dgc-tw-vaccine-web
EU疫苗護照概念式驗證開發前端。
- 語言與框架:  Angular, Typescript
>含了一點react在裡面，從[dgca-issuance-web](https://github.com/eu-digital-green-certificates/dgca-issuance-web)抽離發證api及產生pdf的功能

## 前置作業
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
        "target" : "https://dgci.dicom.tw",
        "secure" : true,
        "changeOrigin": true,
        "auth" : "username:password"
    }
}
```
## 啟動
- Run `npm install`
- Run `npm run start`

## TODO
- [x] 身份證字號變選填或可選身份證OR護照號碼OR健保卡
- [x] 中文 (~~接踵~~接種)
- [ ] 接種次數=>下拉式選單
- [ ] 中文pdf
- [ ] qrcode Decoder