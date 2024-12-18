import jsPDF from 'jspdf';
import _ from 'lodash'

import 'jspdf-autotable';

import { AuthBox, CompanyLogo, debugBase64, multiText, pvDoc } from './util';
import { outputPdfBlob, parseDateCompletetoString } from '../../../utils/FormComponentsHelpler';



const letterHead = (doc, hdata, x, y, data, callback) => {
    //? KOP SURAT 
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);

    CompanyLogo(doc, x, y)



    const compname = data?.companyname ? data?.companyname : ''
    const loginid = data?.sub ? data?.sub : ''
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Printed Date : ', x + 180, y + 4, { align: 'right' });
    doc.text('Printed By : ', x + 180, y + 8, { align: 'right' });
    // doc.text('Page :', x + 180, y+8, { align: 'right' });
    doc.text(parseDateCompletetoString(new Date()), x + 180, y + 4, { align: 'left' });
    doc.text(loginid, x + 180, y + 8, { align: 'left' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    y += 27
    // console.log(data)
    doc.text(compname, x + 2, y, { align: 'left' });
    doc.text(`BUKTI PENGELUARAN ${hdata.header_bankname}`, x + 2, y + 6, { align: 'left' });

    //? KOP SURAT 
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('No :', x + 167, y + 4, { align: 'right' });
    // console.log(data)
    doc.setFont('helvetica', 'normal');
    doc.text(hdata.header_vouchercode, x + 169, y + 4, { align: 'left' });



    if (callback)
        callback(y)
}

const headerContent = (doc, hdata, Xleft, Ymove, callback) => {
    Ymove += 10

    let marginright = doc.internal.pageSize.width - 6

    doc.line(Xleft, Ymove, marginright, Ymove); // horizontal line

    let h1 = 4, h2 = 10, h3 = 16, h4, h5

    const val_rek = `${hdata.header_bankcode} ${hdata.header_bankname}`
    const accnoname = hdata.header_paymenttoaccname ? hdata.header_paymenttoaccname : ''

    const paymentto = hdata.header_paymentto ? hdata.header_paymentto : ''
    const paymenttobank = hdata.header_paymenttobank ? hdata.header_paymenttobank : ''
    const paymenttoaccno = hdata.header_paymenttoaccno ? hdata.header_paymenttoaccno : ''

    const bankname = hdata.bankname ? hdata.bankname : ''

    const ceknumber = hdata.header_chequenumber ? hdata.header_chequenumber : ''

    // Header Form
    // Label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    doc.text('No Rekening', Xleft + 2, Ymove + h1, { align: 'left' });
    doc.text('Mata Uang', Xleft + 150, Ymove + h1, { align: 'left' });

    doc.text('Cheque/Giro No.', Xleft + 2, Ymove + h2, { align: 'left' });
    doc.text('Kurs', Xleft + 92, Ymove + h2, { align: 'left' });
    doc.text('Tanggal', Xleft + 150, Ymove + h2, { align: 'left' });

    // Value
    doc.setFont('helvetica', 'normal');



    doc.text(val_rek, Xleft + 32, Ymove + h1, { align: 'left' });
    doc.text(hdata.header_currency, Xleft + 170, Ymove + h1, { align: 'left' });

    doc.text(`${ceknumber}`, Xleft + 32, Ymove + h2, { align: 'left' });
    doc.text(`${hdata.header_rate}`, Xleft + 115, Ymove + h2, { align: 'left' });
    doc.text(hdata.header_datecreated, Xleft + 170, Ymove + h2, { align: 'left' });

    Ymove += h2 + 2


    doc.line(Xleft, Ymove, marginright, Ymove); // horizontal line
    // Header Form
    // Label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    doc.text('Uraian', Xleft + 2, Ymove + h1, { align: 'left' });

    // Value
    //doc.setFont('helvetica', 'normal');
    //doc.text(hdata.header_remarks, Xleft + 115, Ymove + h1, { align: 'left' });

    Ymove += h1 + 2
    doc.line(Xleft, Ymove, marginright, Ymove); // horizontal line

    // Header Form
    // Label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    doc.text('Dibayar Kepada', Xleft + 2, Ymove + h1, { align: 'left' });

    doc.line(Xleft, Ymove + h1 + 2, marginright, Ymove + h1 + 2); // horizontal line

    doc.text('Nama Rekening', Xleft + 2, Ymove + h2, { align: 'left' });
    doc.text('Bank Penerima', Xleft + 80, Ymove + h2, { align: 'left' });
    doc.text('No Rekening', Xleft + 150, Ymove + h2, { align: 'left' });

    // Value
    doc.setFont('helvetica', 'normal');
    doc.text(`${paymentto} - ${accnoname}`, Xleft + 32, Ymove + h1, { align: 'left' });

    let yOffseth3 = Ymove + h3

    multiText(doc, Xleft + 2, Ymove + h3, 20, accnoname, (ry) => {
        if (yOffseth3 < ry)
            yOffseth3 = ry
    })

    multiText(doc, Xleft + 80, Ymove + h3, 15, paymenttobank, (ry) => {
        if (yOffseth3 < ry)
            yOffseth3 = ry
    })

    doc.text(paymenttoaccno, Xleft + 150, Ymove + h3, { align: 'left' });

    Ymove = yOffseth3

    if (callback)
        callback(Ymove)
}

export const receivevoucher = (tkn, datareport, pdfPreviewRef) => {

    //    console.log(datareport, _.find(datareport.data, ['groupid', 'DATA']))




    const rawtable = _.find(datareport.data, ['groupid', 'DATA']).content.rows
    const auth = _.find(datareport.data, ['groupid', 'AUTHBOX']).content.rows


    let tableData = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('header_')));
    let headerData = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('detail_')))[0]

    const doc_title = `Payment Voucher Report - ${headerData.header_vouchercode}`

    document.title = doc_title

    // Create a new jsPDF instance
    const doc = new jsPDF(pvDoc);

    const AuthBoxY = 70
    let Ytop = 3
    let Ybottom = 3
    let Ymove = Ytop

    let Xleft = 6
    let Xright = 3

    //? KOP SURAT 

    const data = tkn

    let startY = 40;

    const columnWidths = [80, 40, 40];

    letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
    headerContent(doc, headerData, Xleft, Ymove, (cy) => { Ymove = cy })

    startY = Ymove;

    doc.autoTable({
        startY: startY,
        rowPageBreak: 'avoid',
        head: [
            [{ content: 'Lokasi', colSpan: 2, styles: { halign: 'center', valign: 'top' } },
            { content: 'Account', rowSpan: 2, styles: { halign: 'center', valign: 'center', cellWidth: 20 } },
            { content: 'Account\nDescription', rowSpan: 2, styles: { halign: 'center', cellWidth: 26 } },
            { content: 'Kode\nC/F', rowSpan: 2, styles: { halign: 'center', valign: 'top', cellWidth: 15 } },
            { content: 'Uraian', rowSpan: 2, styles: { halign: 'center', valign: 'center', cellWidth: 83 } },
            { content: 'Jumlah', rowSpan: 2, styles: { halign: 'center', valign: 'center', cellWidth: 30 } }],
            [
                { content: 'Tipe', styles: { halign: 'center', cellWidth: 12 } },
                { content: 'Kode', styles: { halign: 'center', cellWidth: 18 } }
            ]
        ],
        /* ['Product', 'Price', 'Quantity']], */
        theme: 'plain',
        //tableLineColor: [231, 76, 60],
        //tableLineWidth: 1,
        styles: {
            lineColor: [44, 62, 80],
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: 'silver'
        },
        body: _.map(tableData, x => _.values(x)),
        columnStyles: { 0: { halign: 'center' }, 1: { halign: 'center' }, 6: { halign: 'right' } },
        margin: { left: 6, right: 3, top: Ymove },
    });

    startY = doc.previousAutoTable.finalY + 8;


    doc.setFont('helvetica', 'bold');
    doc.text("Total", doc.internal.pageSize.getWidth() - 35, startY, null, null, "right");
    doc.text(headerData.header_totalamount_f, doc.internal.pageSize.getWidth() - 8, startY, null, null, "right");

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic', 'bold');
    doc.text(`Terbilang :`, Xleft + 2, startY)


    let terbilang = headerData.header_amount_terbilang

    multiText(doc, Xleft + 2, startY + 7, 40, terbilang, (ry) => {
        if (startY < ry)
            startY = ry
    })


    const remainingY = doc.internal.pageSize.height - startY

    if (AuthBoxY > remainingY) {
        // If AutoTable won't fit, add a page break
        doc.addPage();
        startY = Ymove; // Start at the top of the new page
    }

    AuthBox(doc, auth, startY, Ymove)


    // Add footer page
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {


        doc.setPage(i);

        if (i !== 1) {
            letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
            headerContent(doc, headerData, Xleft, Ymove)
        }

        doc.setDrawColor(0, 0, 0); // draw red lines
        doc.line(Xleft, 40, Xleft, doc.previousAutoTable.finalY); // vertical line
        doc.line(doc.internal.pageSize.width - 6, 40, doc.internal.pageSize.width - 6, doc.previousAutoTable.finalY); // vertical line

        //    doc.setFontSize(10);
        //      doc.setFont('helvetica', 'italic', 'normal');
        //        doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);

    }

    doc.line(Xleft, doc.previousAutoTable.finalY, doc.internal.pageSize.width - 6, doc.previousAutoTable.finalY); // horizontal line


    /*     // Convert PDF to data URL
        const pdfData = doc.output('datauristring', { filename: `report.pdf` });
    
        //    var base64string = doc.output('datauristrlng');
        //   debugBase64(pdfData);
    
        // Set data URL as source for the PDF preview
        if (pdfPreviewRef.current) {
            pdfPreviewRef.current.src = pdfData;
    
            pdfPreviewRef.current.focus();
        } */

    // -- versi 2 set output as blob
    outputPdfBlob(doc)
};