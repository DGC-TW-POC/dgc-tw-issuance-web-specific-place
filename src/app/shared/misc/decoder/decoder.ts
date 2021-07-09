import * as cbor from 'cbor';
import base45 from '../wbase45';
import * as CryptoJS from 'crypto-js';

import zlib from 'browserify-zlib'
import { EUDCC1 } from '../../dgc-combined-schema.d';

const edgcPrefix = 'HC1:'

const decompress = (base45DecodedData : Buffer) : Buffer => {
    return zlib.inflateSync(base45DecodedData);
}

const dataPrefixDecoder = (data : string) : string => {
    return data.substr(edgcPrefix.length);
}

const base45decode = (data : string) : Buffer => {
    return base45.decode(data);
}

let testQrcode = "HC1:6BFOXN%TSMAHN-HZWK2%3B9CUSGHMR769Z4U6R54E9Q4I*CMOW4U+V:AQ4.SMMD/GPWBI$C9UDBQEAJJKKKMEC8.-B97U: KQ*N75JY/66ALD-IE67EHN7Y4 CT4Y76V6WNR/Y49NT2V41C4U2MH5UVE4+V4YC5/HQWQQHCRCLA+DPYKMXEE5IAXMFU*GSHGRKMXGG6DBYCB-1JMJKR.KI91L4D:XIBEIVG395EV3EVCK*6DPQS09T./0LWTKD33238J3HKBLS47%ST 456L7Y48YIZ73423ZQT+EJFG3V.40ATP*G5:44$2M553R4 %29-CRYG:1J:Z2-3TWN57ALB60M979-3$+OAGJTFHYE9*FJUOJQC8$.AIGCY0K ECC+AZ1MU+3Q:G%8WS4P370:90H1O:0IS0IG.CY+CNFCJ0J172U/ONQDJ*55RTZYUVUVJEQ%0T2J5M39%QBFB4HIGSZC$4AT8V927/1PBK7Y/H5ZN90J0/Q5-E A9O-00ASHW67859-LAGS*GI*BBSMMK4KOUF";

export const dataDecoder = () => {
    let plainInput = dataPrefixDecoder(testQrcode);
    console.log(plainInput);
    let compressedCose = base45decode(plainInput);
    let cose = decompress(compressedCose);
    let messageObject  = cbor.decode(cose);
    let content : Buffer = messageObject.value[2];
    let map = cbor.decode(content);
    console.log(map);
}
