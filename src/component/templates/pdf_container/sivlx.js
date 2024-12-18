import jsPDF from 'jspdf';
import _ from 'lodash'
import { format } from "date-fns";

import 'jspdf-autotable';

import { AuthBox, CompanyLogo, multiText, pvDoc, AuthBoxSivLx} from './util';

//?PAGE

const letterHead = (doc, hdata, x, y, data, callback) => {

    


    // logic for Pages
    var pageCount = doc.internal.getNumberOfPages();
    var pageCurrent;
    for (let i = 0; i < pageCount; i++) {
        doc.setPage(i);
        pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
    }


    //? KOP SURAT 
    //CompanyLogo(doc, x, y)

    const docWidth = doc.internal.pageSize.width
    const center = docWidth / 2
    const left = docWidth / 10

    // Untuk print Date dan Jam
    const date = new Date();
    const hour = date.getHours();
    const ampm = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 || 12; 

    y += 8
    let h1 = 5

    doc.setFont('helvetica');
    doc.setFontSize(8);
    

    doc.text(`${format(date, "M/d/yy,")} ${hour12}:${format(date, "mm")} ${ampm}`, left, y, { align: 'center' });


    let h2 = 12
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`STORE ISSUE VOUCHER`, center, y + 6, { align: 'center' });
    doc.text(`PT GRAHA CAKRA MULIA`, center, y + h2, { align: 'center' });
    //? KOP SURAT 
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);



    if (callback)
        callback(y)
}


const headerContent = (doc, hdata, Xleft, Ymove, callback) => {

    Ymove += 2
    const docwidth = doc.internal.pageSize.width
    const halfwidth = docwidth / 2.5

    let marginright = docwidth - 2

    doc.setFontSize(8);
    doc.setFont('helvetica');

    let h1 = 19, h2 = 26, h3 = 33, h4 = 35, h5

    // label
    doc.text('No', halfwidth - 30, Ymove + h1, { align: 'left' });
    doc.text(':', halfwidth - 15, Ymove + h1, { align: 'left' });

    doc.text('MR', halfwidth + 30, Ymove + h1, { align: 'left' });
    doc.text(':', halfwidth + 45, Ymove + h1, { align: 'left' });

    doc.text('Tanggal', halfwidth - 30, Ymove + h2, { align: 'left' });
    doc.text(':', halfwidth - 15, Ymove + h2, { align: 'left' });

    doc.text('Gudang', halfwidth - 30, Ymove + h3, { align: 'left' });
    doc.text(':', halfwidth - 15, Ymove + h3, { align: 'left' });

    doc.text('Peminta', halfwidth + 30, Ymove + h2, { align: 'left' });
    doc.text(':', halfwidth + 45, Ymove + h2, { align: 'left' });


    // // value
    doc.text(hdata.header_sivcode, halfwidth - 10, Ymove + h1, { align: 'left' });
    doc.text(hdata.header_mrcode, halfwidth + 50, Ymove + h1, { align: 'left' });
    doc.text(hdata.header_sivdate, halfwidth - 10, Ymove + h2, { align: 'left' });
    doc.text(hdata.header_gudang, halfwidth - 10, Ymove + h3, { align: 'left' });
    doc.text(hdata.header_peminta, halfwidth + 50, Ymove + h2, { align: 'left' });

    Ymove += h4 + 4


    if (callback)
        callback(Ymove)
}


const pageNumber = (doc,Y) => {
    const totPage = doc.internal.getNumberOfPages()
    const curPage = doc.internal.getCurrentPageInfo().pageNumber
    const docWidth = doc.internal.pageSize.width
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    
    // doc.text('Page : ', docWidth - 30, Y, { align: 'right' });
    // doc.text(`${curPage} of ${totPage}`,  docWidth - 30, Y, { align: 'left' });

    console.log(`${curPage} of ${totPage}`);
    
}

export const sivlx = (tkn, datareport, pdfPreviewRef) => {
    
    // console.log('tkn ',tkn);
    // console.log('datareport ',datareport);



    const rawtable = _.find(datareport.data, ['groupid', 'DATA']).content.rows
    const auth = _.find(datareport.data, ['groupid', 'AUTHBOX']).content.rows


    let tableData = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('header_')));
    let headerData = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('detail_')))[0]

    // console.log('tableData cek : ',tableData);

    // const doc_title = `Payment Voucher Report - ${headerData.header_vouchercode}`
    const doc_title = `Store Issues Voucher LX `

    document.title = doc_title

    // Create a new jsPDF instance
    const doc = new jsPDF(pvDoc);

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

    
    letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
    headerContent(doc, headerData, Xleft, Ymove, (cy) => { Ymove = cy })


    startY = Ymove;

    const isSubtotalRow = (tableData) => {

        // console.log('table Data : ',tableData);


        return tableData.detail_jobcode === "Subtotal";

        
    };

        let lastItemCode  = null;
        let lastItemDescription  = null;
        let actualIndex  = 0;


        const formattedTableData = _.map(tableData, (row, index) => {
            const displayItemCode = row.detail_itemcode !== lastItemCode;
            const displayItemDescription = row.detail_itemdescription !== lastItemDescription;
    
            if (!isSubtotalRow(row)) {
                if (displayItemCode || displayItemDescription) {
                    lastItemCode = row.detail_itemcode;
                    lastItemDescription = row.detail_itemdescription;

                    // console.log('lastItemCode : ',lastItemCode);
                    actualIndex++;
                }
            }
    
            return isSubtotalRow(row) ? [
                "",
                null,
                null,
                null,
                null,
                "Subtotal: ",
                parseFloat(row.detail_jumlahdiminta).toFixed(2),
                parseFloat(row.detail_sudahkeluar).toFixed(2),
                parseFloat(row.detail_keluarsekarang).toFixed(2),
                parseFloat(row.detail_sisa).toFixed(2),
                null,
                null
            ] : [
                displayItemCode || displayItemDescription ? actualIndex.toString() : "",
                displayItemCode ? row.detail_itemcode : "",
                displayItemDescription ? row.detail_itemdescription : "",
                row.detail_locationtype,
                row.detail_locationcode,
                row.detail_jobcode,
                parseFloat(row.detail_jumlahdiminta).toFixed(2),
                parseFloat(row.detail_sudahkeluar).toFixed(2),
                parseFloat(row.detail_keluarsekarang).toFixed(2),
                parseFloat(row.detail_sisa).toFixed(2),
                row.detail_uom,
                row.detail_remarks
            ];
        });
    


    doc.autoTable({
        startY: startY,
        rowPageBreak: 'avoid',
        head: [
            [
                { content: 'No', rowSpan: 2, styles: { halign: 'center', valign: 'center', cellWidth: 7 } },
                { content: 'Kode', rowSpan: 2, styles: { halign: 'center', valign: 'center', cellWidth: 17 } },
                { content: 'Nama Barang', rowSpan: 2, styles: { halign: 'center', valign: 'center', cellWidth: 30 } },
                { content: 'Lokasi', colSpan: 2, styles: { halign: 'center', valign: 'top' } },
                { content: 'Kode\nAktivitas', rowSpan: 2, styles: { halign: 'center', valign: 'top', cellWidth: 14 } },
                { content: 'Jumlah\nDiminta', rowSpan: 2, styles: { halign: 'center', valign: 'top', cellWidth: 12 } },
                { content: 'Sudah\nKeluar', rowSpan: 2, styles: { halign: 'center', valign: 'top', cellWidth: 13 } },
                { content: 'Keluar\nSekarang', rowSpan: 2, styles: { halign: 'center', valign: 'top', cellWidth: 12 } },
                { content: 'Sisa', rowSpan: 2, styles: { halign: 'center', valign: 'center', cellWidth: 5 } },
                { content: 'Satuan', rowSpan: 2, styles: { halign: 'center', valign: 'center', cellWidth: 12 } },
                { content: 'Keterangan', rowSpan: 2, styles: { halign: 'center', valign: 'center', cellWidth: 30 } }],
            [
                { content: 'Tipe', styles: { halign: 'center', cellWidth: 12 } },
                { content: 'Kode', styles: { halign: 'center', cellWidth: 14 } }
            ]
        ],
        foot: [
            [
                { content: 'Total', colSpan: 6, styles: { halign: 'right' } },
                { content: datareport.data[0].content.rows[0].detail_sum_jumlahdiminta, rowSpan: 2, styles: { halign: 'center', valign: 'top', cellWidth: 20 } },
                { content: datareport.data[0].content.rows[0].detail_sum_sudahkeluar, rowSpan: 2, styles: { halign: 'center', valign: 'top' } },
                { content: datareport.data[0].content.rows[0].detail_sum_keluarsekarang, rowSpan: 2, styles: { halign: 'center', valign: 'top', cellWidth: 20 } },
                { content: datareport.data[0].content.rows[0].detail_sum_sisa, rowSpan: 2, styles: { halign: 'center', cellWidth: 20 } },
            ],
        ],

        /* ['Product', 'Price', 'Quantity']], */
        theme: 'plain',
        //tableLineColor: [231, 76, 60],
        //tableLineWidth: 1,
        styles: {
            lineColor: [255, 255, 255],
            lineWidth: 0.2,
            fontSize: 7
        },
        headStyles: {
            fillColor: [255, 255, 255],
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

    doc.setFontSize(8);
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

    AuthBoxSivLx(doc, auth, startY, Ymove)
    

    // Add footer page
    // const totalPages = doc.internal.getNumberOfPages();
    

    // for (let i = 1; i <= totalPages; i++) {


    //     doc.setPage(i);

    //     if (i !== 1) {
    //         letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
    //         headerContent(doc, headerData, Xleft, Ymove)
    //         // doc.line(Xleft, doc.previousAutoTable.finalY, doc.internal.pageSize.width - 2, doc.previousAutoTable.finalY);
    //     }

    //     doc.setDrawColor(0, 0, 0); // draw red lines
    //     //doc.line(Xleft, 40, Xleft, doc.previousAutoTable.finalY); // vertical line
    //     // doc.line(doc.internal.pageSize.width - 2, 40, doc.internal.pageSize.width - 2, doc.previousAutoTable.finalY); // vertical line

    //     //    doc.setFontSize(10);
    //     //      doc.setFont('helvetica', 'italic', 'normal');
    //     //        doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);

    // } 

    // doc.setLineWidth(1); 
    // doc.setDrawColor(211,211,211); 
    // doc.line(Xleft, doc.previousAutoTable.finalY, doc.internal.pageSize.width - 2, doc.previousAutoTable.finalY);
    

    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {


        doc.setPage(i);

        if (i !== 1) {
            letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
            headerContent(doc, headerData, Xleft, Ymove)
        }
        pageNumber(doc,15)
        // doc.setDrawColor(0, 0, 0); // draw red lines
        // doc.line(Xleft, 40, Xleft, doc.previousAutoTable.finalY); // vertical line
        // doc.line(doc.internal.pageSize.width - 6, 40, doc.internal.pageSize.width - 6, doc.previousAutoTable.finalY); // vertical line

        //    doc.setFontSize(10);
        //      doc.setFont('helvetica', 'italic', 'normal');
        //        doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);

    }

    // doc.line(Xleft, doc.previousAutoTable.finalY, doc.internal.pageSize.width - 6, doc.previousAutoTable.finalY); 

    

    // Convert PDF to data URL
    const pdfData = doc.output('datauristring', { filename: `report.pdf` });

    // Set data URL as source for the PDF preview
    if (pdfPreviewRef.current) {
        pdfPreviewRef.current.src = pdfData;
    }
};  
