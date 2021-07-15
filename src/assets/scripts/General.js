function getbwver() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;

    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/opr\/([\d.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :

            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if (Sys.ie) return 'MSIE:' + Sys.ie;     //document.write('IE: ' + Sys.ie);
    if (Sys.firefox) return 'Firefox:' + Sys.firefox; //document.write('Firefox: ' + Sys.firefox);
    if (Sys.chrome) return 'Chrome:' + Sys.chrome; //document.write('Chrome: ' + Sys.chrome);
    if (Sys.opera) return 'Opera:' + Sys.opera;  //document.write('Opera: ' + Sys.opera);
    if (Sys.safari) return 'Safari:' + Sys.safari; //document.write('Safari: ' + Sys.safari);
}

function getOS() {
    var os, ua = navigator.userAgent;
    if (ua.match(/Win(dows )?NT 6\.1/)) {
        os = "Windows";               // Windows 7
    }
    else if (ua.match(/Win(dows )?NT 6\.0/)) {
        os = "Windows";               // Windows Vista
    }
    else if (ua.match(/Win(dows )?NT 5\.2/)) {
        os = "Windows";         // Windows Server 2003
    }
    else if (ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
        os = "Windows";              // Windows XP
    }
    else if (ua.match(/Win(dows )? (9x 4\.90|ME)/)) {
        os = "Windows";              // Windows ME
    }
    else if (ua.match(/Win(dows )?(NT 5\.0|2000)/)) {
        os = "Windows";                // Windows 2000
    }
    else if (ua.match(/Win(dows )?98/)) {
        os = "Windows";              // Windows 98
    }
    else if (ua.match(/Win(dows )?NT( 4\.0)?/)) {
        os = "Windows";              // Windows NT 4.0
    }
    else if (ua.match(/Win(dows )?95/)) {
        os = "Windows";              // Windows 95
    }
    else if (ua.match(/Mac|PPC/)) {
        os = "Mac";                  // Macintosh
    }
    else if (ua.match(/Linux/)) {
        if (ua.match(/Ubuntu/)) {
            os = "Linux-Ubuntu";                   // Linux
        } else if (ua.match(/Fedora/)) {
            os = "Linux-Fedora";
        } else {
            os = "Linux";
        }        
    }
    else if (ua.match(/(Free|Net|Open)BSD/)) {
        os = RegExp.$1 + "BSD";             // BSD
    }
    else if (ua.match(/SunOS/)) {
        os = "Solaris";                 // Solaris
    }
    else {
        os = "Unknown";                 // Other OS
    }
    return os;
}

function GetErrorH_SignMessage(ErrCode) {
    var msg = "";
    switch (ErrCode) {
        case "0000":
            break;
        case "4061":
            msg = '[' + ErrCode + '] 無法連接服務網站';
            break;
        case "7001":
            msg = '[' + ErrCode + '] pcsc環境異常';
            break;
        case "7002":
            msg = '[' + ErrCode + '] 無法存取讀卡機';
            break;
        case "7003":
            msg = '[' + ErrCode + '] 無法存取讀卡機';
            break;
        case "7004":
            msg = '[' + ErrCode + '] 未置入健保卡';
            break;
        case "8001":
            msg = '[' + ErrCode + '] 讀卡異常';
            break;
        case "8002":
            msg = '[' + ErrCode + '] 讀卡異常';
            break;
        case "8003":
            msg = '[' + ErrCode + '] 認卡傳輸異常';
            break;
        case "8004":
            msg = '[' + ErrCode + '] 認卡傳輸異常';
            break;
        case "8005":
            msg = '[' + ErrCode + '] 認卡傳輸異常';
            break;
        case "8006":
            msg = '[' + ErrCode + '] 卡片回傳無法認卡';
            break;
        case "8007":
            msg = '[' + ErrCode + '] 認卡傳輸異常';
            break;
        case "8008":
            msg = '[' + ErrCode + '] 認卡傳輸異常';
            break;
        case "8010":
            msg = '[' + ErrCode + '] 讀取基本資料失敗';
            break;
        case "8011":
            msg = '[' + ErrCode + '] 讀取基本資料失敗';
            break;
        case "8013":
            msg = '[' + ErrCode + '] 無法存取健保卡，請查明讀卡機是否已插好或是否已置入健保卡';
            break;
        case "8201":
            msg = '[' + ErrCode + '] 服務異常';
            break;
        case "8202":
            msg = '[' + ErrCode + '] 服務異常';
            break;
        case "8302":
            msg = '[' + ErrCode + '] PKCS#11異常';
            break;
        case "8303":
            msg = '[' + ErrCode + '] PKCS#11異常';
            break;
        case "8304":
            msg = '[' + ErrCode + '] Session 建立異常';
            break;
        case "8305":
            msg = '[' + ErrCode + '] Session 建立異常';
            break;
        case "8306":
            msg = '[' + ErrCode + '] PKCS#11異常';
            break;
        case "9001":
            msg = '[' + ErrCode + '] 驗簽失敗';
            break;
        case "9002":
            msg = '[' + ErrCode + '] 驗簽失敗';
            break;
        default:
            msg = 'A001元件安裝問題，請下載元件安裝檔執行安裝[' + ErrCode + '] ';
            break;
    }
    return msg;
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 檢核程式
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var aMap = new Array('10', '11', '12', '13', '14', '15', '16', '17', '34', '18', '19', '20', '21', '22', '35', '23', '24', '25', '26', '27', '28', '29', '32', '30', '31', '33');
var aMultiply = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1);
//國民身分證號
function IsValidId(source, arguments) {
    //第1碼：區域碼(A~Z)
    //第2碼：性別  (12ABCD) 
    //第3~9碼：流水號
    //第10碼：檢查碼
    var re = /^[A-Z][12ABCD]\d{8}$/;
    if (!re.test(arguments.Value)) { arguments.IsValid = false; return; }

    var strTemp = aMap[arguments.Value.charCodeAt(0) - 65] + arguments.Value.substr(1);
    var iMultiply = 0;
    var strTail;
    for (var iCounter = 0; iCounter < 10; iCounter++) {
        strTail = (parseInt(aMultiply[iCounter], 10) * parseInt(strTemp.substr(iCounter, 1))).toString();
        strTail = strTail.substr(strTail.length - 1);
        iMultiply = iMultiply + parseInt(strTail, 10);
    }
    strTail = iMultiply.toString().substr(iMultiply.toString().length - 1);
    if (strTail == '0' && arguments.Value.substr(9) != '0') { arguments.IsValid = false; return }
    if (strTail != '0' && arguments.Value.substr(9) != (10 - parseInt(strTail, 10))) { arguments.IsValid = false; return }
}

//國民身分證號+居留證號檢核
function IsValidForeignId(source, arguments) {
    //第1碼：區域碼(A~Z)
    //第2碼：性別  (12ABCD) 
    //第3~9碼：流水號
    //第10碼：檢查碼

    var re = /^[A-Z][12ABCD]\d{8}$/;
    if (!re.test(arguments.Value)) { arguments.IsValid = false; return; }

    var strTemp = aMap[arguments.Value.charCodeAt(0) - 65] + arguments.Value.substr(1);
    if (isNaN(arguments.Value.substr(1, 1)) == true) strTemp = strTemp.substr(0, 2) + aMap[arguments.Value.charCodeAt(1) - 65].substr(1) + strTemp.substr(3);
    var iMultiply = 0;
    var strTail;
    for (var iCounter = 0; iCounter < 10; iCounter++) {
        strTail = (parseInt(aMultiply[iCounter], 10) * parseInt(strTemp.substr(iCounter, 1))).toString();
        strTail = strTail.substr(strTail.length - 1);
        iMultiply = iMultiply + parseInt(strTail, 10);
    }
    strTail = iMultiply.toString().substr(iMultiply.toString().length - 1);
    if (strTail == '0' && arguments.Value.substr(9) != '0') { arguments.IsValid = false; return }
    if (strTail != '0' && arguments.Value.substr(9) != (10 - parseInt(strTail, 10))) { arguments.IsValid = false; return }
}

function IsValidDate(source, arguments) {

    var strPrefix = source.id.substr(0, source.id.lastIndexOf("valDay"));
    var aDay = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var objYear = document.all(strPrefix + "ddlYear");
    var objMonth = document.all(strPrefix + "ddlMonth");
    var objDay = document.all(strPrefix + "ddlDay");
    var strIsRequired = document.all(strPrefix + "IsRequired").value;
    var iLastDay = aDay[objMonth.value - 1];

    //檢核年必須為數值
    if (objYear != null) {
        if (objYear.value.length == 0 && strIsRequired == "True") arguments.IsValid = false;
    }
    else {
        objYear = document.all(strPrefix + "txtYear");
        if (objYear.value.length == 0 && strIsRequired == "True") arguments.IsValid = false;
        if (isNaN(parseInt(objYear.value)) == true && strIsRequired == "True") arguments.IsValid = false;
    }
    //檢核月必須為數值
    if (objMonth.value.length == 0 && strIsRequired == "True") arguments.IsValid = false;

    //檢核Day
    if (objDay != null) {
        if (objDay.value.length == 0 && strIsRequired == "True") arguments.IsValid = false;
        if (objMonth.value.length == 0 && objDay.value.length > 0) arguments.IsValid = false;
        if (objYear.value.length == 0 && strIsRequired == "True") arguments.IsValid = false;
        if ((((parseInt(objYear.value) + 1911) % 4) == 0) && (objMonth.value == '2')) iLastDay = 29;
        if (objDay.value > iLastDay && strIsRequired == "True") arguments.IsValid = false;

    }
    //若月日有值, 年不可為空白
    if (objMonth.value.length > 0 && objYear.value.length == 0) arguments.IsValid = false;
}

function IsValidTextDate(source, arguments) {
    var strPrefix = source.id.substr(0, source.id.lastIndexOf("valDay"));
    var aDay = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var objYear = document.all(strPrefix + "txtYear");
    var objMonth = document.all(strPrefix + "txtMonth");
    var objDay = document.all(strPrefix + "txtDay");
    var strIsRequired = document.all(strPrefix + "IsRequired").value;    

    //檢核年必須為數值
    if (objYear.value.length == 0 && strIsRequired == "True") arguments.IsValid = false;
    if (isNaN(parseInt(objYear.value, 10)) == true && strIsRequired == "True") arguments.IsValid = false;

    //檢核月必須為數值 且介於1~12
    if (objMonth.value.length == 0 && strIsRequired == "True") arguments.IsValid = false;
    if (strIsRequired == "True" &&
        (isNaN(parseInt(objMonth.value, 10)) || (parseInt(objMonth.value, 10) <= 0 || parseInt(objMonth.value, 10) > 12))) 
        arguments.IsValid = false;

    //檢核Day
    if (objDay != null) {
        if (objDay.value.length == 0 && strIsRequired == "True") arguments.IsValid = false;
        if (isNaN(parseInt(objDay.value, 10)) == true && strIsRequired == "True") arguments.IsValid = false;
        if (objMonth.value.length == 0 && objDay.value.length > 0) arguments.IsValid = false;
        if (objYear.value.length == 0 && strIsRequired == "True") arguments.IsValid = false;
        var iLastDay = aDay[objMonth.value - 1];
        if ((((parseInt(objYear.value, 10) + 1911) % 4) == 0) && ((objMonth.value == '2') || (objMonth.value == '02'))) iLastDay = 29;
        if (objDay.value > iLastDay && strIsRequired == "True") arguments.IsValid = false;
    }
    //若月日有值, 年不可為空白
    if (objMonth.value.length > 0 && objYear.value.length == 0) arguments.IsValid = false;
}

//(試算功能)預計繳納日期應大於等於系統日期
function IsEstPaidDateGreaterThanEqualToday(source, arguments) {
    var strEstPaidDate = GetDate("EST_PAID_DATE");
    if (strEstPaidDate == "0000000") return;
    if (strEstPaidDate < document.all.SYSDAY.value) arguments.IsValid = false;
}

function SetValidationByList(list, needValidation) {
    if (list.length == 0) return 1;

    var objNameList = list.split(",");
    for (var iIndex = 0; iIndex < objNameList.length; iIndex++) {
        if (document.all(objNameList[iIndex]) != null) {
            ValidatorEnable(document.all(objNameList[iIndex]), needValidation);
        }
    }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Cross Browser Functions
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function GetEventTarget(event) {
    var e = event || window.event;
    var result = e.srcElement || e.target || e;

    if (result && result.nodeType == 3) // defeat Safari bug
        result = result.parentNode;

    return result;
}

//Todo change GetEventTarget()
function CancelEventBubbling() {
    var e = GetEventTarget();

    if (e) {
        if (e.cancelBubble)
            e.cancelBubble = true;
        else if (e.stopPropagation)
            e.stopPropagation();
    }
}

function GetClientWidth() {
    return Math.max(top.document.documentElement.clientWidth || 0, top.document.body.clientWidth || 0, top.window.innerWidth || 0);
}

function GetClientHeight() {
    if (top.window.innerHeight)
        return top.window.innerHeight;
    else if (top.document.documentElement.clientHeight)
        return top.document.documentElement.clientHeight;
    else if (top.document.body.clientHeight)
        return top.document.body.clientHeight;
    else
        return 0;
    // 以下對Chrome行不通，於onresize event時，回傳的值都不會變。
    //return Math.max(top.document.documentElement.clientHeight || 0, top.document.body.clientHeight || 0, top.window.innerHeight || 0);
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// New Window
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function ShowNewWindow(src) {
    ShowNewWindowWithDimension(src, "70px", "250px", "568px", "470px");
}

function ShowNewWindowWithDimension(src, top, left, width, height) {
    var NewWindow = window.top.document.getElementById("MenuWindow").contentWindow.document.getElementById("NewWindow");

    NewWindow.style.top = top;
    NewWindow.style.left = left;
    NewWindow.style.width = width;
    NewWindow.style.height = height;
    NewWindow.src = src;
    NewWindow.style.display = '';
}

function CloseNewWindow() {
    var NewWindow = window.top.document.getElementById("MenuWindow").contentWindow.document.getElementById("NewWindow");

    NewWindow.style.display = "none";
}

// 主畫面的document物件
function MainDocument() {
    return window.top.document.getElementById("MenuWindow").contentWindow.document.getElementById("MainTarget").contentWindow.document; ;
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Day function
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function RenderDay(year, month, day) {
    var aDay = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var objYear = document.all(year);
    var objMonth = document.all(month);
    var objDay = document.all(day), iOldDay = objDay.value;
    var iLastDay = aDay[objMonth.value - 1], strOnChange = objDay.changeEvent;
    var strResult = '';

    if (objMonth.value == '') return;
    if (objYear.tagName == "SELECT") {
        if (objYear.value == '') return;
        if ((((parseInt(objYear.value) + 1911) % 4) == 0) && (objMonth.value == '2')) iLastDay = 29;
    }
    else {
        if (objYear.text == '') return;
        if ((((parseInt(objYear.value) + 1911) % 4) == 0) && (objMonth.value == '2')) iLastDay = 29;
    }
    strResult = "<select name='" + objDay.name + "' id='" + objDay.id + "' class='" + objDay.className + "'>" + "<option value=''></option>";
    for (var i = 1; i <= iLastDay; i++) {
        if (i == 1 || i == iOldDay) {
            strResult = strResult + "<option value='" + i + "' selected=true>" + i + "</option>";
        }
        else {
            strResult = strResult + "<option value='" + i + "'>" + i + "</option>";
        }
    }
    strResult = strResult + "</select>";
    objDay.outerHTML = strResult;
    objDay.id.onchange = strOnChange;
}

//讀取DatePicker日期物件回傳yyymmdd
function GetDate(id) {
    var objYear = document.all(id + "_ddlYear");
    var objMonth = document.all(id + "_ddlMonth");
    var objDay = document.all(id + "_ddlDay");
    if (objYear == null && objMonth == null && objDay == null) return '0000000';
    var strYear, strMonth, strDay = '';
    if (objYear != null) {
        strYear = objYear.value;
    }
    else {
        objYear = document.all(id + "_txtYear");
        strYear = objYear.value;
    }
    strYear = Fill(strYear, '0', 3);
    if (objMonth != null) strMonth = Fill(objMonth.value, '0', 2);
    if (objDay != null) strDay = Fill(objDay.value, '0', 2);
    return strYear + strMonth + strDay;
}

//日期加減運算.  參數：date as Chinese string date
function DateAddAsString(interval, number, datevalue) {
    var objDate = new Date(parseInt(datevalue.substr(0, 3), 10) + 1911, parseInt(datevalue.substr(3, 2), 10), parseInt(datevalue.substr(5, 2), 10));
    switch (interval) {
        case "YEAR":
            objDate.setFullYear(parseInt(objDate.getFullYear()) + parseInt(number), parseInt(objDate.getMonth()) - 1);
            break;
        case "MONTH":
            objDate.setMonth(parseInt(objDate.getMonth()) + parseInt(number) - 1);
            break;
        case "DAY":
            objDate.setFullYear(parseInt(objDate.getFullYear()), parseInt(objDate.getMonth()) - 1, parseInt(objDate.getDate()) + parseInt(number));
            break;
    }
    return Fill((objDate.getFullYear() - 1911).toString(), '0', 3) + Fill((objDate.getMonth() + 1).toString(), '0', 2) + Fill(objDate.getDate().toString(), '0', 2);
}

function Fill(source, fillCharacter, fixedLength) {
    if (source.length >= fixedLength) return source;
    var strResult = source;
    for (var i = 0; i < fixedLength - source.length; i++) {
        strResult = fillCharacter + strResult;
    }
    return strResult;
}

function SetVisibilityByList(list, isVisible) {
    if (list.length == 0) return 1;

    var objNameList = list.split(",");
    for (var iIndex = 0; iIndex < objNameList.length; iIndex++) {
        if (document.all(objNameList[iIndex]) != null) {
            document.all(objNameList[iIndex]).style.display = isVisible;
        }
    }
}

function RemoveRedundentUniCharacterByList(list) {
    var aAttributes = new Array("name", "type", "maxLength", "id", "readOnly", "class", "value");
    var strOuterHTML = "<input ";
    var strValue;
    var obj;
    if (list.length == 0) return;

    var objNameList = list.split(",");
    for (var iIndex = 0; iIndex < objNameList.length; iIndex++) {
        if (document.all(objNameList[iIndex]) != null) {
            obj = document.all(objNameList[iIndex]);
            for (var iAttributeIndex = 0; iAttributeIndex < aAttributes.length; iAttributeIndex++) {
                if (typeof (obj.attributes[aAttributes[iAttributeIndex]]) != 'undefined' && obj.attributes[aAttributes[iAttributeIndex]] != null
                        && !(aAttributes[iAttributeIndex] == 'readOnly' && obj.attributes[aAttributes[iAttributeIndex]].value == 'false')) {
                    strOuterHTML += aAttributes[iAttributeIndex] + "='" + obj.attributes[aAttributes[iAttributeIndex]].value + "' ";
                }
            }
            strOuterHTML += " />";
            obj.outerHTML = strOuterHTML;
        }
    }
}