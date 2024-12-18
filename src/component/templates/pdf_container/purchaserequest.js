import jsPDF from 'jspdf';
import _ from 'lodash'

import 'jspdf-autotable';

import { AuthBox, AuthBoxDynamic, AuthBoxSimple, CompanyLogo, PRdoc, multiText, pvDoc, strToObj } from './util';
import { secondsInDay } from 'date-fns';
import { outputPdfBlob, parseDateCompletetoString } from '../../../utils/FormComponentsHelpler';



const letterHead = (doc, hdata, x, y, data, callback) => {
    //? KOP SURAT 

    CompanyLogo(doc, x, y + 3)

    y += 8
    // const totPage = doc.internal.getNumberOfPages()
    // const curPage = doc.internal.getCurrentPageInfo().pageNumber
    const compname = data?.companyname ? data?.companyname : ''
    const loginid = data?.sub ? data?.sub : ''
    // console.log(data)
    const docWidth = doc.internal.pageSize.width
    const center = docWidth / 2


    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(compname, x, y + 23, { align: 'left' });

    doc.text(`PURCHASE REQUEST`, center, y, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    doc.text('Form. SPP     Rev.01', docWidth - 10, y, { align: 'right' });

    doc.text('Print Date :', docWidth - 40, y + 3, { align: 'right' });
    doc.text('Print By :', docWidth - 40, y + 6, { align: 'right' });
    // doc.text('Page :', docWidth - 40, y + 9, { align: 'right' });

    doc.text(parseDateCompletetoString(new Date()), docWidth - 10, y + 3, { align: 'right' });
    doc.text(loginid, docWidth - 10, y + 6, { align: 'right' });
    // doc.text(`${curPage} of ${totPage}`,  docWidth - 10, y + 9, { align: 'right' });

    doc.text('Original :', docWidth - 40, y + 12, { align: 'right' });
    doc.text('Copy 1 :', docWidth - 40, y + 15, { align: 'right' });

    doc.text('Procurement', docWidth - 10, y + 12, { align: 'right' });
    doc.text('Peminta', docWidth - 10, y + 15, { align: 'right' });



    if (callback)
        callback(y)
}

const headerContent = (doc, hdata, Xleft, Ymove, callback) => {
    Ymove += 2
    const docwidth = doc.internal.pageSize.width
    const halfwidth = docwidth / 2

    let marginright = docwidth - 2

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    let h1 = 4, h2 = 10, h3 = 16, h4 = 22, h5

    // label
    doc.text('No', halfwidth - 50, Ymove + h1, { align: 'left' });
    doc.text(':', halfwidth - 22, Ymove + h1, { align: 'left' });

    doc.text('Priority', halfwidth + 40, Ymove + h1, { align: 'left' });
    doc.text(':', halfwidth + 55, Ymove + h1, { align: 'left' });

    doc.text('Tanggal', halfwidth - 50, Ymove + h2, { align: 'left' });
    doc.text(':', halfwidth - 22, Ymove + h2, { align: 'left' });

    doc.text('Gudang / User', halfwidth - 50, Ymove + h3, { align: 'left' });
    doc.text(':', halfwidth - 22, Ymove + h3, { align: 'left' });

    doc.text('Catatan', halfwidth - 50, Ymove + h4, { align: 'left' });
    doc.text(':', halfwidth - 22, Ymove + h4, { align: 'left' });


    // value
    doc.text(hdata.header_prcode, halfwidth - 18, Ymove + h1, { align: 'left' });
    doc.text(hdata.header_prpriority, halfwidth + 60, Ymove + h1, { align: 'left' });
    doc.text(hdata.header_prdate, halfwidth - 18, Ymove + h2, { align: 'left' });
    doc.text(hdata.header_prrequestfrom, halfwidth - 18, Ymove + h3, { align: 'left' });
    doc.text(hdata.header_prnotes, halfwidth - 18, Ymove + h4, { align: 'left' });

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

    doc.text('Page :', docWidth - 40, Y, { align: 'right' });
    doc.text(`${curPage} of ${totPage}`,  docWidth - 10, Y, { align: 'right' });
    
}

export const purchaserequest = (tkn, datareport, pdfPreviewRef) => {

    //  console.log(datareport, _.find(datareport.data, ['groupid', 'DATA']))
    const types = strToObj(datareport.parameters)?.output
    const rawtable = _.find(datareport.data, ['groupid', 'DATA']).content.rows
    const rawtable2 = _.find(datareport.data, ['groupid', 'DATA2']).content.rows

    const auth = _.find(datareport.data, ['groupid', 'AUTHBOX']).content.rows
    const auth2 = _.find(datareport.data, ['groupid', 'AUTHBOX2']).content.rows

    let tableData = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('header_')));
    let headerData = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('detail_')))[0]


    let tableData2 = _.map(rawtable2, obj => _.omitBy(obj, (value, key) => key.includes('header_')));

    if (_.isEmpty(headerData))
        return;

    //    console.log(headerData, tableData)

    const doc_title = `View Purchase Request - ${headerData.header_prcode}`

    document.title = doc_title

    // Create a new jsPDF instance
    const doc = new jsPDF(PRdoc);


    const AuthBoxY = 70
    let Ytop = 3
    let Ybottom = 3
    let Ymove = Ytop

    let Xleft = 8
    let Xright = 3

    //? KOP SURAT 

    const data = tkn
    
    
    letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
    
    
    headerContent(doc, headerData, Xleft, Ymove, (cy) => { Ymove = cy })
    let startY = 40;

    // startY = Ymove;
    // console.log(startY)

    doc.autoTable({
        startY: startY,
        rowPageBreak: 'avoid',
        head: [
            [
                {
                    content: 'No', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 10 }
                },
                { content: 'Kode\nBarang', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 30 } },
                { content: 'Nama Barang', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 90 } },
                { content: 'Lokasi', colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                { content: 'Aktivitas', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 20 } },
                { content: 'Deskripsi', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 70 } },
                { content: 'Jumlah\nDiminta', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 20 } },
                { content: 'On\nHand', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 20 } },
                { content: 'Out\nStanding', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 20 } },
                { content: 'Min/Max\nDesc.', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 20 } },
                { content: 'Satuan\nUkuran', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 20 } },
                { content: 'Tanggal\nPerlu', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 22 } },
                { content: 'Days\nSIV', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 15 } },
                { content: 'Group', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 40 } },
                { content: 'Keterangan', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 70 } },
            ],
            [
                { content: 'Tipe', styles: { halign: 'center', cellWidth: 12 } },
                { content: 'Kode', styles: { halign: 'center', cellWidth: 18 } }
            ]
        ],
        // ['Product', 'Price', 'Quantity']], 
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
        columnStyles: {
            0: { halign: 'center' },
            1: { halign: 'center' },
            7: { halign: 'right' },
            8: { halign: 'right' },
            9: { halign: 'right' },
        },
        margin: { left: 8, right: 3, top: Ymove },
    });

    startY = doc.previousAutoTable.finalY + 8;
    const remainingY = doc.internal.pageSize.height - startY
    // doc.setFontSize(8);
    // doc.setFont('helvetica', 'bold');
    // doc.text(headerData.header_notifikasi, 6, startY, { align: 'left' });

    if (AuthBoxY > remainingY) {
        // If AutoTable won't fit, add a page break
        doc.addPage();
        startY = Ymove; // Start at the top of the new page
    }

    AuthBoxDynamic(doc, auth, Xleft, startY, Ymove, {
        footStyle: {
            halign: 'center', valign: 'top', lineColor: 'black',
            lineWidth: {
                //bottom: 0.2,
            }
        }
    })

    startY += 60

    // doc.setFontSize(8);
    // doc.setFont('helvetica', 'bold');
    doc.text(headerData.header_notifikasi, Xleft, startY, { align: 'left' });
    // Add footer page
    // const totalPages = doc.internal.getNumberOfPages();

    // startY += 20;

    const remainingY2 = doc.internal.pageSize.height - startY

    // if (remainingY2 < 60) {
    // If AutoTable won't fit, add a page break
    doc.addPage();
    startY = Ymove; // Start at the top of the new page
    // }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    // letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })


    // headerContent(doc, headerData, Xleft, Ymove, (cy) => { Ymove = cy })

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Form Pengecekan Stock', Xleft, startY + 2, { align: 'left' });
    doc.text('Stock di Semua Gudang Per tanggal PR', Xleft, startY + 8, { align: 'left' });

    startY += 16;



    doc.autoTable({
        startY: startY,
        rowPageBreak: 'avoid',
        head: [
            [
                {
                    content: 'No', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 8 }
                },
                { content: 'Itemcode', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 30 } },
                { content: 'Item Description', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 120 } },
                { content: 'Stock GCM', colSpan: 3, styles: { halign: 'center', valign: 'middle', } },
                { content: 'Stock SMG', colSpan: 3, styles: { halign: 'center', valign: 'middle', } },
                { content: 'Stock SBE', colSpan: 3, styles: { halign: 'center', valign: 'middle', } },
                { content: 'Stock SJE', colSpan: 3, styles: { halign: 'center', valign: 'middle', } },
                { content: 'Stock SLM', colSpan: 3, styles: { halign: 'center', valign: 'middle', } },
            ],
            [
                { content: 'On Hand', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'OS', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'Last GRN\nDay', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'On Hand', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'OS', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'Last GRN\nDay', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'On Hand', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'OS', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'Last GRN\nDay', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'On Hand', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'OS', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'Last GRN\nDay', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'On Hand', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'OS', styles: { halign: 'center', cellWidth: 20 } },
                { content: 'Last GRN\nDay', styles: { halign: 'center', cellWidth: 20 } },
            ]
        ],
        // ['Product', 'Price', 'Quantity']], 
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
        body: _.map(tableData2, x => _.values(x)),
        columnStyles: {
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' },
            7: { halign: 'right' },
            8: { halign: 'right' },
            9: { halign: 'right' },
            10: { halign: 'right' },
            11: { halign: 'right' },
            12: { halign: 'right' },
            13: { halign: 'right' },
            14: { halign: 'right' },
            15: { halign: 'right' },
            16: { halign: 'right' },
            17: { halign: 'right' },
        },
        margin: { left: Xleft, right: 3, top: Ymove },
    });

    startY = doc.previousAutoTable.finalY + 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('On Hand', Xleft, startY + 2, { align: 'left' });
    doc.text(': Stock Di semua Gudang pada tanggal PR', 26, startY + 2, { align: 'left' });

    doc.text('OS', Xleft, startY + 8, { align: 'left' });
    doc.text(': PO yang belum di GRN pada tanggal PR', 26, startY + 8, { align: 'left' });

    startY += 12

    const remainingYx = doc.internal.pageSize.height - startY

    if (AuthBoxY > remainingYx) {
        // If AutoTable won't fit, add a page break
        doc.addPage();
        startY = Ymove; // Start at the top of the new page
    }

    AuthBoxSimple(doc, auth2, Xleft, startY, Ymove,
        {
            outsideborder: true,
            footStyle:
            {
                halign: 'center', valign: 'top', lineColor: 'black',
            }
        }
        , y => {
            startY += y
        }
    )

    // doc.setFontSize(8);
    // doc.setFont('helvetica', 'bold');
    doc.text(headerData.header_notifikasi, Xleft, startY, { align: 'left' });

    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {

        // if (i == 0) {
        // letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })


        // headerContent(doc, headerData, Xleft, Ymove, (cy) => { Ymove = cy })
        // }
        // const pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
        // remarksDocument.find((item) => item.label === "Page").value = `${pageCurrent} of ${totalPages}`;
        doc.setPage(i);
        if (i !== 1) {
            letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
            headerContent(doc, headerData, Xleft, Ymove,/*(cy) => { Ymove = cy }*/)
            
        }
        pageNumber(doc,20)
        doc.setDrawColor(0, 0, 0); // draw red lines


    }

        // Convert PDF to data URL
    //    const pdfData = doc.output('datauristring', { filename: `report.pdf` });
   
    //    // Set data URL as source for the PDF preview
    //    if (pdfPreviewRef.current) {
    //        pdfPreviewRef.current.src = pdfData;
    //    } 


    // -- versi 2 set output as blob
    outputPdfBlob(doc, types, pdfPreviewRef)
};
