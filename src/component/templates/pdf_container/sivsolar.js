import jsPDF from 'jspdf';
import _ from 'lodash'
import { format } from "date-fns";

import 'jspdf-autotable';

import { AuthBox, CompanyLogo, CompanyLogoSiv, multiText, Sivdoc, AuthBoxSiv } from './util';

//?PAGE
const PageSiv = (doc) => {
    var pageCount = doc.internal.getNumberOfPages();
    for (let i = 0; i < pageCount; i++) {
        doc.setPage(i);
        const pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
        return pageCurrent
    }
}

const letterHead = (tkn, doc, hdata, x, y, data, callback) => {


    // logic for Pages
    var pageCount = doc.internal.getNumberOfPages();
    var pageCurrent;
    for (let i = 0; i < pageCount; i++) {
        doc.setPage(i);
        pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
    }


    //? KOP SURAT 
    CompanyLogo(doc, x, y)

    const docWidth = doc.internal.pageSize.width
    const center = docWidth / 2.3

    y += 8
    let h1 = 7

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);

    doc.text(`${tkn.sitename}`, center, y, { align: 'center' });
    doc.text(`STORE ISSUE VOUCHER SOLAR`, center, y + h1, { align: 'center' });

    //? KOP SURAT 
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    doc.text('Form BMK    Rev.01', docWidth - 40, y - 4, { align: 'center' });


    //? POJOK KANAN - BAGIAN 1
    doc.text('Original :', docWidth - 40, y, { align: 'right' });
    doc.text('Copy 1 :', docWidth - 40, y + 4, { align: 'right' });
    doc.text('Copy 2 :', docWidth - 40, y + 8, { align: 'right' });

    doc.text('Gudang', docWidth - 10, y, { align: 'right' });
    doc.text('Peminta', docWidth - 10, y + 4, { align: 'right' });
    doc.text('Keuangan', docWidth - 10, y + 8, { align: 'right' });

    //? POJOK KANAN - BAGIAN 2
    doc.text('Print By :', docWidth - 40, y + 17, { align: 'right' });
    doc.text('Print Date :', docWidth - 40, y + 21, { align: 'right' });
    doc.text('File Name :', docWidth - 40, y + 25, { align: 'right' });
    doc.text('Page :', docWidth - 40, y + 29, { align: 'right' });

    doc.text(' ', docWidth - 10, y + 17, { align: 'right' });
    doc.text(`${format(new Date(), "dd-MM-yyyy hh:mm")}`, docWidth - 10, y + 21, { align: 'right' });
    doc.text('Stores Issue Voucher', docWidth - 10, y + 25, { align: 'right' });
    doc.text(`${pageCurrent} of ${pageCount}`, docWidth - 10, y + 29, { align: 'right' });



    if (callback)
        callback(y)
}


const headerContent = (doc, hdata, Xleft, Ymove, callback) => {

    Ymove += 2
    const docwidth = doc.internal.pageSize.width
    const halfwidth = docwidth / 2.8

    let marginright = docwidth - 2

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    let h1 = 13, h2 = 21, h3 = 27, h4 = 35, h5 = 27

    // label
    doc.text('No', halfwidth - 50, Ymove + h1, { align: 'left' });
    doc.text(':', halfwidth - 22, Ymove + h1, { align: 'left' });

    doc.text('MR', halfwidth + 40, Ymove + h1, { align: 'left' });
    doc.text(':', halfwidth + 70, Ymove + h1, { align: 'left' });

    doc.text('Tanggal', halfwidth - 50, Ymove + h2, { align: 'left' });
    doc.text(':', halfwidth - 22, Ymove + h2, { align: 'left' });

    doc.text('Gudang', halfwidth - 50, Ymove + h3, { align: 'left' });
    doc.text(':', halfwidth - 22, Ymove + h3, { align: 'left' });

    doc.text('Peminta', halfwidth + 40, Ymove + h2, { align: 'left' });
    doc.text(':', halfwidth + 70, Ymove + h2, { align: 'left' });

    doc.text('Nama Barang', halfwidth + 40, Ymove + h5, { align: 'left' });
    doc.text(':', halfwidth + 70, Ymove + h5, { align: 'left' });


    // // value
    doc.text(hdata.header_sivcode, halfwidth - 18, Ymove + h1, { align: 'left' });
    doc.text(hdata.header_mrcode, halfwidth + 75, Ymove + h1, { align: 'left' });
    doc.text(hdata.header_sivdate, halfwidth - 18, Ymove + h2, { align: 'left' });
    doc.text(hdata.header_gudang, halfwidth - 18, Ymove + h3, { align: 'left' });
    doc.text(hdata.header_peminta, halfwidth + 75, Ymove + h2, { align: 'left' });
    doc.text('DA002001 / Minyak Solar Biodiesel B30', halfwidth + 75, Ymove + h5, { align: 'left' });

    Ymove += h4 + 4


    if (callback)
        callback(Ymove)
}


export const sivsolar = (tkn, datareport, pdfPreviewRef) => {

    // console.log('datareport ', datareport);

    const rawtable = _.find(datareport.data, ['groupid', 'DATA']).content.rows
    const auth = _.find(datareport.data, ['groupid', 'AUTHBOX']).content.rows


    let tableData = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('header_')));
    let headerData = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('detail_')))[0]

    // console.log('tableData cek : ', tableData);

    // const doc_title = `Payment Voucher Report - ${headerData.header_vouchercode}`
    const doc_title = `Store Issues Voucher Solar -`

    document.title = doc_title

    // Create a new jsPDF instance
    const doc = new jsPDF(Sivdoc);

    const AuthBoxY = 70
    let Ytop = 3
    let Ybottom = 3
    let Ymove = Ytop

    let Xleft = 3
    let Xright = 3

    //? KOP SURAT 

    const data = { ...tkn, }

    let startY = 40;

    const columnWidths = [80, 40, 40];

    letterHead(tkn, doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
    headerContent(doc, headerData, Xleft, Ymove, (cy) => { Ymove = cy })


    startY = Ymove;

    const isSubtotalRow = (tableData) => {

        return tableData.detail_kodeunit === "Subtotal";
    };

    let lastItemcode = null;
    let lastItemDescription = null;
    let actualIndex = 0;



    const formattedTableData = _.map(tableData, (row, index) => {


        const displayKodeUnit = row.detail_itemcode !== lastItemcode;
        const displayItemDescription = row.detail_itemdescription !== lastItemDescription;


        if (!isSubtotalRow(row)) {
            if (displayKodeUnit || displayItemDescription ) {
                lastItemcode = row.detail_itemcode;
                lastItemDescription = row.detail_itemdescription;

                // console.log('lastItemcode : ',lastItemcode);
                actualIndex++;
            }
        }


        return isSubtotalRow(row) ? [
            "",
            "Subtotal: ",
            parseFloat(row.detail_jumlahdiminta).toFixed(2),
            parseFloat(row.detail_sudahkeluar).toFixed(2),
            parseFloat(row.detail_keluarsekarang).toFixed(2),
            parseFloat(row.detail_sisa).toFixed(2),
            null,
            null,
            null,
            null,
            null
        ] : [
            displayKodeUnit ? actualIndex.toString() : "",
            displayKodeUnit ? row.detail_kodeunit : "",
            parseFloat(row.detail_jumlahdiminta).toFixed(2),
            parseFloat(row.detail_sudahkeluar).toFixed(2),
            parseFloat(row.detail_keluarsekarang).toFixed(2),
            parseFloat(row.detail_sisa).toFixed(2),
            row.detail_satuanukuran,
            row.detail_hmkmakhir,
            row.detail_hmkmawal,
            row.detail_joborder,
            row.detail_remarks
        ];
    });


    doc.autoTable({
        startY: startY,
        rowPageBreak: 'avoid',
        head: [
            [
                { content: 'No', rowSpan: 1, styles: { halign: 'center', valign: 'center', cellWidth: 15 } },
                { content: 'Kode Unit', rowSpan: 1, styles: { halign: 'center', valign: 'center', cellWidth: 52 } },
                { content: 'Jumlah\nDiminta', rowSpan: 1, styles: { halign: 'center', valign: 'top', cellWidth: 20 } },
                { content: 'Sudah\nKeluar', rowSpan: 1, styles: { halign: 'center', valign: 'top', cellWidth: 20 } },
                { content: 'Keluar\nSekarang', rowSpan: 1, styles: { halign: 'center', valign: 'top', cellWidth: 20 } },
                { content: 'Sisa', rowSpan: 1, styles: { halign: 'center', valign: 'center', cellWidth: 20 } },
                { content: 'Satuan\nUkuran', rowSpan: 1, styles: { halign: 'center', valign: 'top', cellWidth: 20 } },
                { content: 'KM/HM Mr', rowSpan: 1, styles: { halign: 'center', valign: 'top', cellWidth: 30 } },
                { content: 'KM/HM Pengisian', rowSpan: 1, styles: { halign: 'center', valign: 'top', cellWidth: 30 } },
                { content: 'No Job Order', rowSpan: 1, styles: { halign: 'center', valign: 'center', cellWidth: 40 } },
                { content: 'Keterangan', rowSpan: 1, styles: { halign: 'center', valign: 'center', cellWidth: 120 } }],
        ],

        /* ['Product', 'Price', 'Quantity']], */
        theme: 'plain',
        //tableLineColor: [231, 76, 60],
        //tableLineWidth: 1,
        styles: {
            lineColor: [44, 62, 80],
            lineWidth: 0.5,
        },
        headStyles: {
            fillColor: 'silver'
        },
        // body: _.map(tableData, x => _.values(x)),
        body: formattedTableData,
        columnStyles: { 0: { halign: 'center' }, 1: { halign: 'center' }, 6: { halign: 'right' } },
        margin: { left: 3, right: 3, top: Ymove },
    });

    startY = doc.previousAutoTable.finalY + 8;


    doc.setFont('helvetica', 'bold');
    // doc.text("Total", doc.internal.pageSize.getWidth() - 33, startY, null, null, "right");
    // doc.text(headerData.header_totalamount_f, doc.internal.pageSize.getWidth() - 4, startY, null, null, "right");

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic', 'bold');
    // doc.text(`Terbilang :`, Xleft + 2, startY)


    // // let terbilang = headerData.header_amount_terbilang
    // let terbilang = 10


    // multiText(doc, Xleft + 2, startY + 7, 40, terbilang, (ry) => {
    //     if (startY < ry)
    //         startY = ry
    // })


    const remainingY = doc.internal.pageSize.height - startY

    if (AuthBoxY > remainingY) {
        // If AutoTable won't fit, add a page break
        doc.addPage();
        startY = Ymove; // Start at the top of the new page
    }

    AuthBoxSiv(doc, auth, startY, Ymove)


    // Add footer page
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {


        doc.setPage(i);

        if (i !== 1) {
            letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
            headerContent(doc, headerData, Xleft, Ymove)
        }

        doc.setDrawColor(0, 0, 0); // draw red lines
        //doc.line(Xleft, 40, Xleft, doc.previousAutoTable.finalY); // vertical line
        //doc.line(doc.internal.pageSize.width - 2, 40, doc.internal.pageSize.width - 2, doc.previousAutoTable.finalY); // vertical line

        //    doc.setFontSize(10);
        //      doc.setFont('helvetica', 'italic', 'normal');
        //        doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);

    }

    //doc.line(Xleft, doc.previousAutoTable.finalY, doc.internal.pageSize.width - 2, doc.previousAutoTable.finalY); // horizontal line


    // Convert PDF to data URL
    const pdfData = doc.output('datauristring', { filename: `report.pdf` });

    // Set data URL as source for the PDF preview
    if (pdfPreviewRef.current) {
        pdfPreviewRef.current.src = pdfData;
    }
};
