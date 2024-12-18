import jsPDF from 'jspdf';
import _ from 'lodash'

import 'jspdf-autotable';



import { AuthBox, CompanyLogo, multiText, pvDoc } from './util';
import { outputPdfBlob } from '../../../utils/FormComponentsHelpler';

const letterHead = (doc, hdata, x, y, data, callback) => {


  //? KOP SURAT 
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  CompanyLogo(doc, x, y)
  y += 5

  // ? Title
  doc.text('PT Union Sampoerna Triputra Persada', x + 20, y, { align: 'left' });
  doc.setFontSize(12);
  doc.text('Procurement Department', x + 20, y + 5, { align: 'left' });
  doc.setFontSize(14);
  doc.text('Evaluasi Performa Vendor', x + 20, y + 15, { align: 'left' });
  doc.setLineWidth(0.4);
  doc.line(x + 20, y + 16, 85, y + 16)


  if (callback)
    callback(y)
}
const headerContent = (doc, hdata, Xleft, Ymove, callback) => {

  Ymove += 28

  // ? Header Section
  const headerSection = [
    { label: "Nama Supplier / Kontraktor", value: hdata.header_supplierdesc ? hdata.header_supplierdesc : '-' },
    { label: "Kode Supplier / Kontraktor", value: hdata.header_suppliercode ? hdata.header_suppliercode : '-' },
    { label: "Periode Evaluasi", value: hdata.header_tanggal ? hdata.header_tanggal : '-' },
  ]

  let maxWidthHeaderSec = 0;

  headerSection.forEach(({ label }) => {
    const labelwidth = doc.getStringUnitWidth(label) * 10 / doc.internal.scaleFactor;
    if (labelwidth > maxWidthHeaderSec) {
      maxWidthHeaderSec = labelwidth;
    }
  })

  function drawHeaderSection(doc, headerSection) {


    headerSection.forEach(({ label, value }) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', "bold");
      doc.text(label, 5, Ymove);
      doc.text(":", maxWidthHeaderSec + 18, Ymove);
      doc.setFont('helvetica', "normal");
      doc.text(value, maxWidthHeaderSec + 21, Ymove);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(maxWidthHeaderSec + 21, Ymove + 1, 204, Ymove + 1);
      Ymove += 6.5

    });
  }

  drawHeaderSection(doc, headerSection)
  doc.setLineWidth(0.5)
  doc.rect(Xleft - 1, 31, 205, 21.5);




  if (callback)
    callback(Ymove)
}

export const evaluasiperformavendor = (tkn, datareport, pdfPreviewRef) => {


  const catatan = datareport.data[0].content.rows[0].header_catatan
  const rekomendasi = datareport.data[0].content.rows[0].header_rekomendasi

  const rawtable = _.find(datareport.data, ['groupid', 'DATA']).content.rows
  const auth = _.find(datareport.data, ['groupid', 'AUTHBOX']).content.rows
  let tableData = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('header_')));
  let headerData = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('detail_')))[0]


  const doc_title = `Evaluasi Performa Vendor - ${headerData.header_suppliercode}`

  document.title = doc_title

  // Create a new jsPDF instance
  const doc = new jsPDF(pvDoc);


  let Ytop = 3
  let Ymove = Ytop

  let Xleft = 3
  let Xright = 3

  const data = { ...tkn, }

  // ? Calling Function LetterHead & Header Content
  letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
  headerContent(doc, headerData, Xleft, Ymove, (cy) => { Ymove = cy })


  let startY = 40;
  startY = Ymove + 2;

  // ? Footer Tabel Section
  function footerTableTotal() {
    const sumMax = tableData.reduce((d, val) => d + (val.detail_max || 0), 0);
    const sumTvalue = tableData.reduce((d, val) => d + (val.detail_tvalue || 0), 0);

    return [
      [
        { content: 'Total', styles: { halign: 'center' } },
        { content: sumMax.toString(), styles: { halign: 'center' } },
        { content: sumTvalue.toString(), styles: { halign: 'center' } },
        { content: '', styles: { halign: 'center' } }
      ]
    ];
  }
  function footerTableGrade() {
    const sumTvalue = tableData.reduce((d, val) => {
      if (val.hasOwnProperty('detail_tvalue')) {
        return d + val['detail_tvalue'];
      } else {
        return d;
      }
    }, 0);

    const gradeRanges = [
      { min: 15, grademark: 'Sangat Baik', grade: 'A' },
      { min: 11, max: 14, grademark: 'Baik', grade: 'B' },
      { min: 7, max: 10, grademark: 'Cukup', grade: 'C' },
      { min: 0, max: 6, grademark: 'Tidak Direkomendasikan', grade: 'D' }
    ];


    let { grademark, grade } = gradeRanges.find(range =>
      sumTvalue >= (range.min || Number.NEGATIVE_INFINITY) &&
      sumTvalue <= (range.max || Number.POSITIVE_INFINITY)
    ) || { grademark: 'Tidak Direkomendasikan', grade: 'E' };

    return [
      [
        { content: 'Grade', styles: { halign: 'center', fontSize: 14 } },
        { content: grade, colSpan: 2, styles: { halign: 'center', fontSize: 14 } },
        { content: grademark, styles: { halign: 'center', fontSize: 14 } }
      ]
    ];
  }

  // ?  Combined Footer
  const combinedFooters = footerTableTotal().concat(footerTableGrade());


  // ? Tabel Penilaian
  doc.autoTable({
    startY: startY,
    rowPageBreak: 'avoid',
    head: [
      [
        { content: 'Parameter Penilaian', colSpan: 1, styles: { halign: 'center', cellWidth: 130 } },
        { content: 'Max', colSpan: 1, styles: { halign: 'center', cellWidth: 15 } },
        { content: 'Score', colSpan: 1, styles: { halign: 'center', cellWidth: 15 } },
        { content: 'Keterangan', colSpan: 1, styles: { halign: 'center', cellWidth: 45 } },
      ]
    ],
    theme: 'plain',
    didParseCell: function (data) {
      if (data.section === "body") {
        switch (data.column.index) {
          case 0:
            data.cell.styles.halign = "left";
            break;
          case 1:
          case 2:
          case 3:
            data.cell.styles.halign = "center";
            break;

        }
      }
    },
    styles: {
      lineColor: [10, 10, 10],
      lineWidth: 0.5,
    },
    headStyles: {
      fontWeight: 'bold',
      fontSize: '12'
    },
    body: _.map(tableData, x => _.values(x)),
    columnStyles: { 0: { halign: 'center' }, 1: { halign: 'center' }, 6: { halign: 'right' } },
    margin: { left: 2, right: Xright, top: Ymove + 10 },
    foot: combinedFooters
  });

  startY = doc.previousAutoTable.finalY + 8;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Mekanisme Penilaian', Xleft, startY, { align: 'left' });
  doc.setLineWidth(0.4);
  doc.line(Xleft, startY + 1, 53, startY + 1)

  //? Mekanisme Penilaian Table 1
  doc.autoTable({
    columns: [
      { header: "Score", dataKey: "score", styles: { font: "bold" } },
      { header: "Keterangan", dataKey: "keterangan", styles: { font: "bold" } },
    ],
    body: [
      { score: 4, keterangan: "Sangat Baik" },
      { score: 3, keterangan: "Baik" },
      { score: 2, keterangan: "Standar" },
      { score: 1, keterangan: "Dibawah Standar" },
    ],
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.4, halign: "center", fontStyle: "bold" },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.4, halign: 'center' },
    theme: "grid",
    margin: { left: 4 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 40 }
    },

    didParseCell: function (data) {
      data.cell.styles.fontSize = 10;
    },
    startY: startY + 5,
  });

  //? Mekanisme Penilaian Table 2
  doc.autoTable({
    columns: [
      { header: "Grade", dataKey: "grade", styles: { font: "bold" } },
      { header: "Nilai", dataKey: "nilai", styles: { font: "bold" } },
      { header: "Keterangan", dataKey: "keterangan", styles: { font: "bold" } },
    ],
    body: [
      { grade: "A", nilai: "15-16", keterangan: "Sangat Baik" },
      { grade: "B", nilai: "11-14", keterangan: "Baik" },
      { grade: "C", nilai: "7-10", keterangan: "Cukup" },
      { grade: "D", nilai: "<7", keterangan: "Tidak Direkomendasikan" },

    ],
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.4, halign: "center", fontStyle: "bold" },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.4, halign: 'center' },
    theme: "grid",
    margin: { left: 63 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 35 },
      2: { cellWidth: 45 }
    },
    didParseCell: function (data) {
      data.cell.styles.fontSize = 10;
    },
    startY: startY + 5,
  });


  // <------Catatan Section -----> 



  // ? Catatan Split
  const underlineLineEndX = 202;
  const leftAlign = 5

  doc.text('Catatan:', leftAlign - 1, 179, null, null);
  doc.line(leftAlign - 1, 180, 22, 180)
  doc.setFont('helvetica', "normal");

  // Split Response Result
  if (doc.getTextWidth(catatan) > underlineLineEndX - leftAlign - 1) {
    const maxWidth = underlineLineEndX - leftAlign - 1;
    const parts = doc.splitTextToSize(catatan, maxWidth);

    // ? Baris 1
    doc.setFont('helvetica', "normal");
    doc.text(parts[0], leftAlign - 1, 185, { maxWidth });

    // ? Baris Lanjutan
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i++) {
        doc.text(parts[i], leftAlign - 1, 185 + (i * 6), { maxWidth });
        doc.line(leftAlign - 1, 186 + (i * 6), underlineLineEndX, 186 + (i * 6));
      }
    }
  } else {
    // Teks cukup di baris 1
    doc.setFont('helvetica', "normal");
    doc.text(catatan, leftAlign - 1, 185);
    doc.line(leftAlign - 1, 186, underlineLineEndX, 186);
  }

  // underline 
  for (let i = 3; i >= 0; i--) {
    doc.line(leftAlign - 1, 186 + (i * 6), underlineLineEndX, 186 + (i * 6));
  }

  // ?Rekomendasi Section
  // doc.setFont('helvetica', "bold");
  doc.text('Rekomendasi:', leftAlign - 1, 212, null, null);
  doc.line(leftAlign - 1, 213, 37, 213)
  doc.setFontSize(17);
  doc.setFont("ZapfDingbats");
  doc.rect(leftAlign - 1, 215, 25, 11);
  doc.rect(leftAlign - 1, 229, 25, 11);

  if (rekomendasi == 'Y') {
    doc.text("4", leftAlign + 10, 222, null, null, "left");
    //  doc.text("4", leftAlign+10, 222,25, 11);
  } else if (rekomendasi == 'N') {
    // doc.setFontSize(17);
    // doc.setFont("ZapfDingbats");
    doc.text("4", leftAlign + 10, 236, null, null, "left");
  }
  //  doc.setFont(Constants.DEFAULT_FONT,"normal")
  //  doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5);
  doc.setFontSize(10);
  doc.setFont('helvetica');
  doc.text('Hasil Pekerjaan Baik, dapat dipertahankan', 32, 222, null, null);
  doc.text('Hasil Pekerjaan Tidak Baik, Tidak Disarankan', 32, 236, null, null);

  // ? Signature
  doc.autoTable({
    columns: [
      { header: "Di Review Oleh,", dataKey: "disetujui" },
    ],
    body: [
      { disetujui: "" },
    ],
    foot: [
      { disetujui: "Procurement" },
    ],
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: "center", },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2 },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: "center", },
    theme: "grid",
    startY: 245,
    margin: { left: 4 },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineColor: [0],
      lineWidth: 0.2,
      cellPadding: { top: 9, right: 0, bottom: 9, left: 0 } // Sesuaikan nilai sesuai kebutuhan
    },

    columnStyles: {
      0: { cellWidth: 45 }
    },
    didParseCell: function (data) {
      data.cell.styles.fontSize = 10;
    },
  });

  // Add footer page
  const totalPages = doc.internal.getNumberOfPages();


  for (let i = 1; i <= totalPages; i++) {


    doc.setPage(i);

    if (i !== 1) {
      letterHead(doc, headerData, Xleft, Ytop, data, (cy) => { Ymove = cy })
      headerContent(doc, headerData, Xleft, Ymove)
    }

    doc.setDrawColor(0, 0, 0); // draw red lines


  }



  /* 
      // Convert PDF to data URL
      const pdfData = doc.output('datauristring', { filename: `report.pdf` });
  
      // Set data URL as source for the PDF preview
      if (pdfPreviewRef.current) {
          pdfPreviewRef.current.src = pdfData;
      } */

  // -- versi 2 set output as blob
  outputPdfBlob(doc)
};
