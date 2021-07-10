import * as cbor from 'cbor';
import base45 from '../wbase45';
import * as CryptoJS from 'crypto-js';

import zlib from 'browserify-zlib'
import { EUDCC1 } from '../../dgc-combined-schema.d';
import { CwtHeaderKeys } from './cwt/CwtHeaderKeys';
import CborMap from 'cbor/types/lib/map';
import { Certificate } from '../../x509/x509.js';
import * as _ from 'lodash';
const rawHash = require("sha256-uint8array").createHash;

const edgcPrefix = 'HC1:'

const decompress = (base45DecodedData: Buffer): Buffer => {
    return zlib.inflateSync(base45DecodedData);
}


const base45decode = (data: string): Buffer => {
    return base45.decode(data);
}

let testQrcode = "HC1:6BFOXN%TSMAHN-HZWK2%3B9CUSGHMR769Z4U6R54E9Q4I*CMOW4U+V:AQ4.SMMD/GPWBI$C9UDBQEAJJKKKMEC8.-B97U: KQ*N75JY/66ALD-IE67EHN7Y4 CT4Y76V6WNR/Y49NT2V41C4U2MH5UVE4+V4YC5/HQWQQHCRCLA+DPYKMXEE5IAXMFU*GSHGRKMXGG6DBYCB-1JMJKR.KI91L4D:XIBEIVG395EV3EVCK*6DPQS09T./0LWTKD33238J3HKBLS47%ST 456L7Y48YIZ73423ZQT+EJFG3V.40ATP*G5:44$2M553R4 %29-CRYG:1J:Z2-3TWN57ALB60M979-3$+OAGJTFHYE9*FJUOJQC8$.AIGCY0K ECC+AZ1MU+3Q:G%8WS4P370:90H1O:0IS0IG.CY+CNFCJ0J172U/ONQDJ*55RTZYUVUVJEQ%0T2J5M39%QBFB4HIGSZC$4AT8V927/1PBK7Y/H5ZN90J0/Q5-E A9O-00ASHW67859-LAGS*GI*BBSMMK4KOUF";

//testQrcode = "HC1:123456789123456789";

export const qrcodeDataDecoder = (qrcode: string) => {
    try {
        if (qrcode == "123") qrcode = testQrcode;
        let plainInput = removePrefix(qrcode);
        let compressedCose = base45decode(plainInput);
        let cose = decompress(compressedCose);
        let messageObject = cbor.decode(cose);
        let content: Buffer = messageObject.value[2];
        let protectedHeader = messageObject.value[0];
        let unprotectedHeader = messageObject.value[1];

        let kid = getKid(protectedHeader, unprotectedHeader)
        let map: CborMap = cbor.decode(content);
        let issuingCountry = map.get(CwtHeaderKeys.ISSUING_COUNTRY)
        let issuedAt = map.get(CwtHeaderKeys.ISSUED_AT)
        let expirationTime = map.get(CwtHeaderKeys.EXPIRATION);
        let hcert = map.get(CwtHeaderKeys.HCERT);
        let cborObject = hcert.get(1);
        console.log("issuingCountry :", issuingCountry);
        console.log("issuedAt :", issuedAt);
        console.log("expiration :", expirationTime);
        console.log("hcert :", cborObject);
        console.log("kid :", kid);
    } catch (e) {
        console.log(e);
    }
    /*猜測不用解碼cert  (這個cert 為dgc-issuance-service裡面設置的TrustAnchor jks檔案certificate的數值)
    1. 從dgc verifier擷取認可的kid
    2. 取得qrcode解碼資料中的kid
    3. (2)與(1)比對
    4. 比對不成功=>錯誤資料, 比對成功=>正確資料
    */
    const cert = Certificate.fromPEM(Buffer.from(
        '-----BEGIN CERTIFICATE-----\n' +
        'MIIBjzCCATWgAwIBAgIEYOk9uzAKBggqhkjOPQQDAjCBgTELMAkGA1UEBhMCVFcx' +
        'DzANBgNVBAgMBlRhaXdhbjEUMBIGA1UEBwwLVGFpcGVpIENpdHkxFjAUBgNVBAoM' +
        'DU5UVU5IUyBDWS1MYWIxFjAUBgNVBAsMDURHQ09wZXJhdGlvbnMxGzAZBgNVBAMM' +
        'ElRXLVRSVVNULVRlc3QtQ1NDQTAeFw0yMTA3MTAwNjI3MDdaFw0yMjA3MTAwNjI3' +
        'MDdaMB0xGzAZBgNVBAMMEm50dW5oc19lZGdjX2Rldl9lYzBZMBMGByqGSM49AgEG' +
        'CCqGSM49AwEHA0IABNvFJFGTyPl8qy+AtFG1HlxM25CreR5VIr83jLEYqrCKutYf' +
        'OxddO1w49+lWyNo+WLGN7/pIzt+GxnD8kqs+QAUwCgYIKoZIzj0EAwIDSAAwRQIg' +
        'SExchKlC2YYn44vMta5vpFuFDVuw/Zp1h5IF7zH4eAUCIQCB8RHs/cJ0melnFes7' +
        'Jy4uVsjYLTfrhdzU5+9yqp3iZA==\n' +
        '-----END CERTIFICATE-----\n'

    ));
    const fingerprint = rawHash().update(cert.raw).digest();
    const keyID = fingerprint.slice(0, 8)
    console.log(Buffer.from(keyID).toString('base64'));
}

function removePrefix(data) {
    if (data.startsWith(edgcPrefix)) {
        return data.substring(edgcPrefix.length);
    } else {
        return data;
    }
}

function getKid(protectedHeader, unprotectedHeader) {
    if (cbor.decode(protectedHeader)) {
        try {
            let decodedKid = cbor.decode(protectedHeader).get(4).toString("base64");
            return decodedKid;
        } catch (e) {
            if (_.isEmpty(unprotectedHeader)) return "";
            return unprotectedHeader.get(4).toString("base64");
        }
    } else {
        if (_.isEmpty(unprotectedHeader)) return "";
        return unprotectedHeader.get(4).toString("base64");
    }
}

