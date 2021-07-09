/*
 * eu-digital-green-certificates/ dgca-issuance-web
 *
 * (C) 2021, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import { EUDCC1 } from '../generated-files/dgc-combined-schema';

import ShowCertificateData from '../misc/ShowCertificateData';
import usePdfGenerator from './pdf-generater.component';

// import { usePostPatient } from '../api';

export const ShowCertificate = (props: any) => {

    const { t } = useTranslation();

    const [isInit, setIsInit] = React.useState(false)
    const [pdfIsInit, setPdfIsInit] = React.useState(false)
    const [pdfIsReady, setPdfIsReady] = React.useState(false)
    const [eudgc, setEudgc] = React.useState<EUDCC1>();

    const [qrCodeForPDF, setQrCodeForPDF] = React.useState<any>();
    const [eudgcForPDF, setEudgcForPDF] = React.useState<EUDCC1>();
    const pdf = usePdfGenerator(qrCodeForPDF, eudgcForPDF, (isInit) => setPdfIsInit(isInit), (isReady) => setPdfIsReady(isReady));

    // set patient data on mount and set hash from uuid

    // set ready state for spinner
    React.useEffect(() => {
        if (isInit) {
            if (props.eudgc) {
                console.log(props.eudgc);
                setEudgc(props.eudgc)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInit])

    React.useEffect(() => {
        if (pdf) {
            handleShowPdf();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pdfIsReady]);



    const handleGeneratePdf = () => {
        console.log(props.eudgc);
        console.log(eudgc);
        setQrCodeForPDF(document.getElementById('qr-code-pdf'));
        setEudgcForPDF(props.eudgc);
    }

    const handleShowPdf = () => {
        if (pdf) {
            const blobPDF = new Blob([pdf.output('blob')], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blobPDF);
            window.open(blobUrl);
        }
    }

    return (
            <>
                <Button
                    className=''
                    block
                    onClick={handleGeneratePdf}
                    disabled={!pdfIsInit}
                    hidden={pdfIsReady}
                >
                    {t('translation:generate-pdf')}
                </Button>
                <Button
                    className='m-0'
                    block
                    onClick={handleShowPdf}
                    hidden={!pdfIsReady}
                >
                    {t('translation:show-pdf')}
                </Button>
            </>

    )
}

//export default ShowCertificate;
//export const ShowCertificate = ShowCertificate;