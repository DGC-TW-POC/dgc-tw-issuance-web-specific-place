var browserName;
var wsUri = "wss://iccert.nhi.gov.tw:7777/echo";
var websocket;
// Handle difference for IE.
if (window.addEventListener) {          
    window.addEventListener("load", browserDetect, false);
} else if (window.attachEvent) {          
    window.attachEvent("onload", browserDetect);
}

function browserDetect() {                               
    var chk_isIE11 = navigator.userAgent.indexOf("Trident/7.0") > -1; //確認是否為IE 11(含)以上 瀏覽器
    var bwstr = getbwver().split(':');
    

    if (bwstr) {
        browserName = bwstr[0];
    }

    if (browserName == 'MSIE' && !chk_isIE11) {
        alert('請使用Firefox、Google Chrome、Safari7以上、Opera或IE11.0以上版本，本系統不支援IE11.0以下的版本');
        window.event.returnValue = false;
        return false;
    } else {             
        if (window.WebSocket) {
            onLoadweb();                  
        }
        else {
            alert('此瀏覽器不支援新版健保卡元件，建議使用\nFirefox、Google Chrome、Safari7以上、Opera或IE11.0以上版本瀏覽器\n若您瀏覽器已是IE11，請移除相容性檢視');
            window.event.returnValue = false;
            return false;                  
        }
    }
}

function initHidValue () {
    document.getElementById("hidBasic").value = "";
    document.getElementById("hidVersion").value = "";
    document.getElementById("hidRandom").value = "";
    document.getElementById("hidSign").value = "";
}
function onLoadweb() {

    document.getElementById("hidBasic").value = "";
    document.getElementById("hidVersion").value = "";
    document.getElementById("hidRandom").value = "";
    document.getElementById("hidSign").value = "";

    wsUri = "wss://iccert.nhi.gov.tw:7777/echo";
    if (browserName == 'Safari') wsUri = "wss://iccert.nhi.gov.tw:7777/echo";

    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) { onOpen(evt) };
    websocket.onclose = function (evt) { onClose(evt) };
    websocket.onmessage = function (evt) { onMessage(evt) };
    websocket.onerror = function (evt) { onError(evt) };
}

function onOpen(evt) {
    // do nothing
}

function onClose(evt) {
    //             if (document.getElementById("hidSign").value == '') {
    //                 alert('Not connected');   
    //             }                      
}

function onError(evt) {
//          window.event.returnValue = false;
    //          return false;
    var osName2 = getOS();
    var answer = confirm("請檢查元件是否已正確安裝且啟動。\n\n\n若您尚未安裝元件，請下載安裝元件後重啟瀏覽器。\n\n請確認是否要下載安裝程式?");
    run_component = "";          
    if (answer == true) {
        if (osName2 == "Windows") {
            window.open("https://cloudicweb.nhi.gov.tw/cloudic/system/SMC/Setup.zip", "_blank");
        } else if (osName2 == "Mac") {
            window.open("https://cloudicweb.nhi.gov.tw/cloudic/System/SMC/mac.Install1.zip", "_blank");
        } else if (osName2 == "Linux-Ubuntu") {
            window.open("https://cloudicweb.nhi.gov.tw/cloudic/system/SMC/mLNHIICC_Setup.Ubuntu.zip", "_blank");
        } else if (osName2 == "Linux-Fedora") {
            window.open("https://cloudicweb.nhi.gov.tw/cloudic/system/SMC/mLNHIICC_Setup.fedora.zip", "_blank");
        }
    }
}

function H_Sign(gType) {
  if (gType != "Sign") {
      document.getElementById("hidNextStep").value = "END";
  } else {
      document.getElementById("hidNextStep").value = "";
   }
    ws_GetBasic();
}


function StartTimer() {
    if (document.getElementById("hidStep").value == "1") {
        window.setTimeout('ws_GetVersion()', 0);
    } else if (document.getElementById("hidStep").value == "2") {
        window.setTimeout('ws_GetRandom()', 0);
    } else if (document.getElementById("hidStep").value == "3") {
        window.setTimeout('ws_H_Sign()', 0);
    }
}

function ws_GetBasic() {
   websocket.send("GetBasic");
}

function ws_GetRandom() {
    websocket.send("GetRandom");
}

function ws_GetVersion() {
    websocket.send("GetVersion");
}

function ws_H_Sign() {          
    if (document.getElementById("hidVersion").value == "" || document.getElementById("hidRandom").value == "") {
        alert('讀取H_Sign資料失敗');
        window.event.returnValue = false;
    } else {
        websocket.send("H_Sign?Random=" + document.getElementById("hidVersion").value + document.getElementById("hidRandom").value);
    }
}

function onMessage(evt) {
    var message = evt.data;
    if (message.substring(0, 9) == 'GetBasic:') {//GetBasic:               
        document.getElementById("hidBasic").value = message.slice("GetBasic:".length);
        if (document.getElementById("hidNextStep").value == "END") {
          //document.getElementById("btnReadCard").click();
        }else{
          document.getElementById("hidStep").value = "1";
          StartTimer();
        }
     } else if (message.substring(0, 11) == 'GetVersion:') {//GetVersion:                 
        document.getElementById("hidVersion").value = message.slice("GetVersion:".length);
        document.getElementById("hidStep").value = "2";
        StartTimer();
    } else if (message.substring(0, 10) == 'GetRandom:') {//GetRandom:          
        document.getElementById("hidRandom").value = message.slice("GetRandom:".length);
        document.getElementById("hidStep").value = "3";
        StartTimer();
    } else if (message.substring(0, 7) == 'H_Sign:') {//H_Sign:             
        var sSign = "";
        sSign = message.slice("H_Sign:".length);
        if (sSign.length == 256) {
            document.getElementById("hidSign").value = sSign;
            //document.getElementById("btnSubmit").click();
        }
        else {
            alert('error');
            alert(GetErrorH_SignMessage(sSign));
            initHidValue();
            window.event.returnValue = false;
        }
    } else if (message.substring(0, 4) == 'log:') {//log:
        var sLog = "";
        sSign = message.slice("log:".length);
        alert(sLog);
    } else if (message.substring(0, 10) == 'connected:') {//connected:
        var sConnect = "";
        sConnect = message.slice("connected:".length);
        alert(sConnect);
    } else {
        initHidValue();
        alert(GetErrorH_SignMessage(message));
    }
}
