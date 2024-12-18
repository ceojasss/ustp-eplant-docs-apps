import jsPDF from 'jspdf';
import _ from 'lodash'

import 'jspdf-autotable';

import { Rvdoc } from './util';
import { outputPdfBlob } from '../../../utils/FormComponentsHelpler';




export const registrasivendor = (tkn, datareport, pdfPreviewRef) => {

    const rawtable = _.find(datareport.data, ['groupid', 'DATA']).content.rows

    let d = _.map(rawtable, obj => _.omitBy(obj, (value, key) => key.includes('detail_')))[0]




    // Create a new jsPDF instance
    const doc = new jsPDF(Rvdoc);


    // ? Constant Positioning & Font Props 

    // ? ----- Coordinate For Horizontal (X)
    const xLText = 5 // -> Nilai posisi x terhadap Text Bagian Kiri
    const stPosX = 15 // -> Nilai posisi x section pertama
    const mdPosX = 110 //  -> Nilai posisi x section tengah
    const lstPosX = 205 //  -> Nilai posisi x section akhir


    // ? ----- Coordinate For Vertical (Y)
    let mTop = 15
    let baris1 = mTop + 8 // 23

    const stPosY = 10
    // const mdPosY =
    // const lstPosY =




    const Constants = {
        DEFAULT_FONT: 'helvetica',
        TITLE_FONT_SIZE: 16,
        SUBTITLE_FONT_SIZE: 12,
        DOC_INFO_FONT_SIZE: 7,
        HEADER_FONT_SIZE: 10,
        CENTER: "center",
        RIGHT: "right",
        LEFT: "left"
    }

    //? Rectangle Frame
    doc.setLineWidth(0.4)
    doc.rect(2.5, 2.5, lstPosX + 87, lstPosX);
    doc.setLineWidth(0.2)

    //? Title Document
    doc.setFillColor(0, 0, 0);
    doc.rect(xLText, 4, lstPosX + 83.5, 7, 'F');
    doc.setFont(Constants.DEFAULT_FONT, "bold");
    doc.setFontSize(Constants.TITLE_FONT_SIZE - 2);
    doc.setTextColor(255, 255, 255);
    doc.text(`FORMULIR REGISTRASI VENDOR - Badan Usaha PT, CV, UD, PD, Koperasi dll `, xLText + 2, stPosY - 1, null, null, Constants.LEFT, { charSpace: 1.0 });
    doc.setTextColor(0, 0, 0);
    doc.setFont(Constants.DEFAULT_FONT, "normal");
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);

    //? Tanggal Pengajuan
    doc.text(`Tanggal Pengajuan `, xLText, mTop + 1.5, null, null, Constants.LEFT,);
    doc.text(`:`, stPosX + 25, mTop + 1.5, null, null, Constants.LEFT,);
    doc.text(d.header_inputdate || '-', stPosX + 38, mTop + 1.5);
    doc.rect(stPosX + 30, mTop - 2.5, 33, 6);

    // ? Jenis Pendaftaran
    doc.setFont(Constants.DEFAULT_FONT, "normal");
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);
    doc.text("Pendaftaran Vendor Baru", mdPosX, mTop + 0.3);
    doc.rect(mdPosX - 5, mTop - 3, 4, 4);
    doc.rect(mdPosX - 5, mTop + 1.9, 4, 4);
    doc.text("Pembaharuan / Perubahan Data Vendor Lama", mdPosX, mTop + 5.3);

    // ? Vendor Code
    doc.text("Kode Vendor", lstPosX, mTop + 2);
    doc.text(":", lstPosX + 25, mTop + 2);
    doc.text(d.header_suppliercode || '-', lstPosX + 35, mTop + 2);
    doc.rect(lstPosX + 30, mTop - 3.5, 22, 9)
    doc.setFontSize(Constants.DOC_INFO_FONT_SIZE);
    doc.text("(Diisi oleh Ustp)", lstPosX + 55, mTop + 2);

    // -> Label Data Vendor
    doc.rect(xLText, 22, 288, 61.5);
    doc.setFont(Constants.DEFAULT_FONT, "bold");
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5)
    doc.text("Data Vendor", xLText + 1, baris1 + 2);
    doc.setLineWidth(0.3);
    doc.line(xLText + 1, baris1 + 2.5, stPosX + 7.7, baris1 + 2.5)
    doc.text(":", stPosX + 10, baris1 + 2);

    // -> Term Of Payment 
    doc.text("Term Of Payment", mdPosX + 38.5, baris1 + 3);
    doc.text(":", mdPosX + 75.05, baris1 + 3);
    doc.text("Days", mdPosX + 87, baris1 + 3);
    doc.setFont(Constants.DEFAULT_FONT, "normal ");
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1)
    doc.rect(mdPosX + 77, baris1, 3.5, 3.7);
    doc.rect(mdPosX + 82, baris1, 3.5, 3.7);

    const topdata = d.header_topcode
    const topcodeMap = {
        TOP10: { val: '1', data: '0', x: 188, xd: 193, y: baris1 + 2.7 },
        TOP14: { val: '1', data: '4', x: 188, xd: 193, y: baris1 + 2.4 },
        TOP15: { val: '1', data: '5', x: 188, xd: 193, y: baris1 + 2.4 },
        TOP21: { val: '2', data: '1', x: 188, xd: 193, y: baris1 + 2.4 },
        TOP3: { val: '3', data: '', x: 188, xd: 193, y: baris1 + 2.4 },
        TOP30: { val: '3', data: '0', x: 188, xd: 193, y: baris1 + 3 },
        TOP45: { val: '4', data: '5', x: 188, xd: 193, y: baris1 + 2.4 },
        TOP60: { val: '6', data: '0', x: 188, xd: 193, y: baris1 + 2.4 },
        TOP7: { val: '7', data: '', x: 188, xd: 193, y: baris1 + 2.4 },
        TOP90: { val: '9', data: '0', x: 188, xd: 193, y: baris1 + 2.4 },
    }

    if (topdata === 'TOP3' || topdata === 'TOP7') {
        const { val, xd, y } = topcodeMap[topdata];

        // dfigit Ke 2
        doc.text(val, xd, y);
    } else if (topcodeMap.hasOwnProperty(topdata)) {
        const { val, data, x, xd, y } = topcodeMap[topdata];
        //  digit 1
        doc.text(val, x, y);
        // digit 2
        doc.text(data, xd, y);
    } else {
        const x = 202;
        const y = baris1 + 5.2;
        doc.text('', x, y);
        doc.text('', x + 4, y);
    }

    // ? Label Domisili Perusahaan
    doc.setFont(Constants.DEFAULT_FONT, "bold");
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5)
    doc.setLineWidth(0.2);
    doc.text("Domisili Perusahaan", mdPosX + 38.5, baris1 + 7);
    doc.text(":", mdPosX + 36.53416666666667 + 38.5, baris1 + 7);
    doc.line(mdPosX + 38.5, baris1 + 7.5, 178, baris1 + 7.5)

    // ? Label Domisili Perusahaan
    doc.setFont(Constants.DEFAULT_FONT, "bold");
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5)
    doc.setLineWidth(0.2);
    doc.text("Domisili Perusahaan", mdPosX + 38.5, baris1 + 7);
    doc.text(":", mdPosX + 38.5 + 36.53416666666667, baris1 + 7);
    doc.line(mdPosX + 38.5, baris1 + 7.5, 178, baris1 + 7.5)


    //-------------------------- Left Section ---------------------\\
    // ? Left Column Data Vendor
    const labelValueLeftColumn = [
        { label: "Bidang Usaha / Komoditas", value: `${d.header_kategori} / ${d.header_subkategori || ''}` },
        { label: "", value: `` },
        { label: "Nama Perusahaan", value: `${d.header_suppliername || ''}` },
        { label: "Nama Direktur Perusahaan", value: `${d.header_contactname_dir || ''}` },
        { label: "Nama Penanggung Jawab", value: `${d.header_contactname_opr || ''}` },
        { label: "Jabatan", value: `${d.header_contacttitle_opr || ''}` },
        { label: "No. Telepon", value: `${d.header_phone || '-'}` },
        { label: "No. Handphone", value: `${d.header_phone_opr || ''}` },
    ];
    // ? Lebar Max Label Bagian kiri
    let maxWidthLeftColumn = 0;

    // ? menghitung nilai label terpanjang
    labelValueLeftColumn.forEach(({ label }) => {
        const labelwidth = doc.getStringUnitWidth(label) * Constants.HEADER_FONT_SIZE / doc.internal.scaleFactor;
        if (labelwidth > maxWidthLeftColumn) {
            maxWidthLeftColumn = labelwidth;
        }
    })

    // Set Nilai Tengah pencetakan data
    const maxWidthL = doc.internal.pageSize.width - 150

    // ? Fungsi Gambar bagian kiri
    function drawLeftColumn(doc, labelValueLeftColumn) {
        let currentLeftY = baris1 + 6;

        labelValueLeftColumn.forEach(({ label, value }) => {
            doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);
            doc.setFont(Constants.DEFAULT_FONT, "normal");
            doc.text(label, xLText + 1, currentLeftY);
            doc.text(":", maxWidthLeftColumn - 2, currentLeftY);

            if (label === "Bidang Usaha / Komoditas") {
                const maxWidth = doc.internal.pageSize.width - 197;
                const parts = doc.splitTextToSize(value, maxWidth);




                doc.text(parts[0], maxWidthLeftColumn, currentLeftY, { maxWidthL });
                if (parts.length > 1) {
                    labelValueLeftColumn.find((item) => item.label === "").value = parts.slice(1).join(" ");
                }
            } else {
                doc.text(value, maxWidthLeftColumn, currentLeftY, { maxWidthL });
            }
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.25);
            doc.line(maxWidthLeftColumn, currentLeftY + 1.2, doc.internal.pageSize.width - 150, currentLeftY + 1);
            currentLeftY += 5

        });
    }

    //-------------------------- Right Section ---------------------\\

    // ? Right Column Domisili perusahaan
    const labelValueRightColumn = [
        { label: "Alamat Perusahaan", value: `${d.header_address_sppkp || ''}` },
        { label: "", value: `` },
        { label: "Alamat Pabrik / Workshop", value: `${d.header_address_ws || ''}` },
        { label: "", value: `` },
        { label: "Alamat Gudang", value: `${d.header_address_gd || ''}` },
        { label: "", value: `` },
        { label: "Kota", value: `` },
        { label: "Kode Pos", value: `` },
    ];

    // ? Lebar Max Label Bagian kanan
    let maxWidthRightColumn = 0;

    // Set Nilai Akhir pencetakan data
    const maxWidth = doc.internal.pageSize.width - 10

    // ? menghitung nilai label terpanjang
    labelValueRightColumn.forEach(({ label }) => {
        const labelwidth = doc.getStringUnitWidth(label) * Constants.HEADER_FONT_SIZE / doc.internal.scaleFactor;
        if (labelwidth > maxWidthRightColumn) {
            maxWidthRightColumn = labelwidth;
        }
    });

    // ? Fungsi Menggambar bagian Kanan
    function drawRightColumn(doc, labelValueRightColumn) {
        let currentY = 35;

        labelValueRightColumn.forEach(({ label, value }, index) => {
            doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);
            doc.setFont(Constants.DEFAULT_FONT, "normal");
            doc.text(label, mdPosX + 38.5, currentY);
            doc.text(":", mdPosX + 38.5 + maxWidthRightColumn - 4, currentY);

            if ((label === "Alamat Perusahaan" || label === "Alamat Pabrik / Workshop" || label === "Alamat Gudang") && index !== 1) {
                const maxWidth = doc.internal.pageSize.width - 197;
                const parts = doc.splitTextToSize(value, maxWidth);

                // console.log('hahaha', parts);


                doc.text(parts[0], mdPosX + 38.5 + maxWidthRightColumn - 2, currentY, { maxWidth });

                if (parts.length > 1) {
                    labelValueRightColumn[index + 1].value = parts.slice(1).join(" ");
                }
            } else {
                doc.text(value, mdPosX + 38.5 + maxWidthRightColumn - 2, currentY, { maxWidth });
            }

            doc.setLineWidth(0.3);
            doc.line(mdPosX + 38.5 + maxWidthRightColumn - 2, currentY + 1.2, doc.internal.pageSize.width - 5.5, currentY + 1.2);
            currentY += 5;
        });





    }


    // ? Pemanggilan Fungsi
    drawLeftColumn(doc, labelValueLeftColumn)
    drawRightColumn(doc, labelValueRightColumn);

    // ? Label Npwp
    doc.setFont(Constants.DEFAULT_FONT, "bold");
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);
    doc.text("NPWP", xLText + 1, mTop + 54);
    doc.text(":", stPosX, mTop + 54);
    doc.setLineWidth(0.2);
    doc.line(xLText + 1, mTop + 55, stPosX - 1, mTop + 55)
    doc.setFont(Constants.DEFAULT_FONT, "normal");
    doc.text("No NPWP", xLText + 1, mTop + 59);
    doc.text(":", maxWidthLeftColumn - 2, mTop + 59);
    doc.text("Nama Wajib Pajak", xLText + 1, mTop + 65);
    doc.text(":", maxWidthLeftColumn - 2, mTop + 65);


    // ? Npwp Number 
    const initialX = maxWidthLeftColumn;
    const initialY = mTop + 56;
    const rectWidth = 4.5;
    const rectHeight = 4.5;
    const lineWidth = 0.2;

    doc.setLineWidth(lineWidth);

    const dataValues = d.header_npwp;

    for (let i = 0; i < 22; i++) {
        const currentX = initialX + (i * (rectWidth + 0));
        doc.rect(currentX, initialY, rectWidth, rectHeight);

        if (dataValues && typeof dataValues[i] !== 'undefined' && dataValues[i] !== null) {
            doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);
            doc.text(dataValues[i].toString(), currentX + 1.5, initialY + 3.5);
        }
    }

    // ? Wajib Pajak
    doc.text("Status Wajib Pajak ", 148.5, mTop + 63)
    doc.text(":", 148.5 + maxWidthRightColumn - 4, mTop + 63);
    doc.rect(mdPosX + 38.5 + maxWidthRightColumn + 5, mTop + 59.7, 4, 4);
    doc.setFontSize(Constants.DOC_INFO_FONT_SIZE + 1)
    doc.text("Ya", mdPosX + 38.5 + maxWidthRightColumn + 10, mTop + 63)
    doc.rect(mdPosX + 38.5 + maxWidthRightColumn + 15, mTop + 59.7, 4, 4);
    doc.text("Tidak", mdPosX + 38.5 + maxWidthRightColumn + 20, mTop + 63)
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5)

    // ? Tanggal
    doc.text("Tanggal :", lstPosX + 29, mTop + 63)
    doc.rect(lstPosX + 44, mTop + 59.7, 4, 4)
    doc.rect(lstPosX + 48, mTop + 59.7, 4, 4)
    doc.rect(lstPosX + 54, mTop + 59.7, 4, 4)
    doc.rect(lstPosX + 58, mTop + 59.7, 4, 4)
    doc.rect(lstPosX + 64, mTop + 59.7, 4, 4)
    doc.rect(lstPosX + 68, mTop + 59.7, 4, 4)
    doc.rect(lstPosX + 72, mTop + 59.7, 4, 4)
    doc.rect(lstPosX + 76, mTop + 59.7, 4, 4)



    // ? Email Dan Website
    doc.rect(xLText, mTop + 75, doc.internal.pageSize.width / 1.9, 10);
    doc.setFont(Constants.DEFAULT_FONT, "bold");
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);
    doc.text("Email Address", xLText + 1, mTop + 79);
    doc.text(":", maxWidthLeftColumn - 2, mTop + 79);
    doc.setFont(Constants.DEFAULT_FONT, "normal");
    doc.text(`${d.header_email1 || ''}`, maxWidthLeftColumn, mTop + 79)
    doc.setFont(Constants.DEFAULT_FONT, "bold");
    doc.text("Url / Website", xLText + 1, mTop + 83);
    doc.text(":", maxWidthLeftColumn - 2, mTop + 83);
    doc.setFont(Constants.DEFAULT_FONT, "normal");
    doc.text(`${d.header_website || ''}`, maxWidthLeftColumn, mTop + 83)

    // ? Lain Lain
    doc.setFont(Constants.DEFAULT_FONT, "bold");
    doc.rect(xLText, +mTop + 87, doc.internal.pageSize.width / 1.9, 60);
    doc.text("Lain Lain", xLText + 1, mTop + 90);
    doc.text(":", stPosX + 5, mTop + 90);
    doc.text("Darimana Anda Mendapatkan Informasi PT.Union Sampoerna Triputra Persada (USTP) Group ?", xLText + 1, mTop + 95);
    doc.line(xLText + 1, mTop + 96, 140, mTop + 96)

    // ? Info 
    const infodata = d.header_info;
    // const infodata = null;
    // const infodata = 'E5';

    // console.log("Info Data", infodata);

    const checkboxMap = {
        E1: { label: "Internet", x: 1, y: 98 },
        E2: { label: "Teman", x: 1, y: 103 },
        E3: { label: "Principle / Pemegang Merk", x: 1, y: 108 },
        E4: { label: "Management PT. USTP", x: 1, y: 113 },
        E5: { label: `Lainya * ${d.header_info_desc || ''}`, x: 1, y: 118 },
        E6: { label: "*) Jika Lainya Sebutkan", x: 1, y: 123 },
    };

    doc.setFont(Constants.DEFAULT_FONT, "normal");
    doc.text(`.........................`, 20, mTop + 121.5)

    for (const key in checkboxMap) {
        const { label, x, y } = checkboxMap[key]
        if (key !== 'E6') {
            doc.rect(xLText + x, mTop + y, 4, 4);
            if (infodata !== null && infodata.includes(key)) {
                doc.setFont("ZapfDingbats");
                doc.setFontSize(11)
                doc.text("4", xLText + x + 0.5, mTop + y + 3.5);
                doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5)
                doc.setFont(Constants.DEFAULT_FONT, "normal");
            }
        }
        doc.text(label, stPosX - 3, mTop + y + 2.7);
    }

    // ? Referensi
    doc.setFont(Constants.DEFAULT_FONT, "bold")
    doc.text("Apakah Anda Memiliki Kenalan di PT. Union Sampoerna Triputra Persada (USTP) Group ?", xLText + 1, mTop + 130.7);
    doc.line(xLText + 1, mTop + 129 + 2.7, 130, mTop + 131.7)

    const refdata = d.header_referensi
    const checkBoxRef = {
        Y: { label: `Ya * ${d.header_referensi_desc || ''} `, x: 1, y: 133 },
        N: { label: "Tidak", x: 1, y: 138 },
        L: { label: "*) Jika Ya Sebutkan", x: 1, y: 143 },
    };
    doc.setFont(Constants.DEFAULT_FONT, "normal");
    doc.text(`.........................`, stPosX, mTop + 137)
    for (const key in checkBoxRef) {
        const { label, x, y } = checkBoxRef[key];
        if (key === 'L') {
            doc.text(label, stPosX - 5, mTop + y + 2.7);
            continue;
        }
        doc.rect(xLText + x, mTop + y, 4, 4);
        if (refdata !== null && refdata.includes(key)) {
            doc.setFont("ZapfDingbats");
            doc.setFontSize(12)
            doc.text("4", xLText + x + 0.5, mTop + y + 3.5);
            doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5)
            doc.setFont(Constants.DEFAULT_FONT, "normal");
        }
        doc.text(label, stPosX - 5, mTop + y + 2.7);
    };

    // ? Tanda Tangan Vendor
    doc.setFont(Constants.DEFAULT_FONT, "bold")
    doc.text("Vendor yang bertanda tangan dibawah ini : ", xLText + 1, 170);
    doc.rect(xLText, 171.7, doc.internal.pageSize.width / 2.2, 20);
    doc.rect(xLText, 191.7, doc.internal.pageSize.width / 2.2, 6);
    doc.text("Nama Perusahaan", xLText + 1, 195.5);
    doc.text(":", maxWidthLeftColumn - 2, 195.5);
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.text(`${d.header_suppliername || ''}`, maxWidthLeftColumn + 2, 195.5);
    doc.rect(xLText, 197.7, doc.internal.pageSize.width / 2.2, 6);
    doc.setFont(Constants.DEFAULT_FONT, "bold")
    doc.text("Nama Direktur", xLText + 1, 201.5);
    doc.text(":", maxWidthLeftColumn - 2, 201.5);
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.text(`${d.header_contactname_dir || ''}`, maxWidthLeftColumn + 2, 201.5);


    // ? Lampiran Legalitas Perusahaan 
    doc.setFont(Constants.DEFAULT_FONT, "bold")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5)
    doc.text("Lampiran Legalitas Perusahaan :", mdPosX + 70, 91)
    doc.line(mdPosX + 70, 92, mdPosX + 70 + 45, 92)
    doc.text("Ada", mdPosX + 70 + 75, 91)
    doc.text("Tidak", mdPosX + 70 + 91, 91)


    // // ? Dokumen Kelengkapan \\
    const akta_file = d.header_akta_file
    const nib_file = d.header_nib_file
    const npwp_file = d.header_npwp_file
    const sppkp_file = d.header_sppkp_file
    const ktp_file = d.header_ktp_dir_file
    const sijk_file = d.header_sijk_file
    const principle_file = null
    const company_file = null
    const brosur_file = null
    const domisili_file = null


    //? 1
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5)
    doc.text("1)", mdPosX + 70, 97)
    doc.text("Foto Copy Akte Notaris", mdPosX + 70 + 7, 97)
    // ? Cb
    doc.rect(mdPosX + 70 + 76, 94, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 94, 4.5, 4.5)
    // ? Cheklist
    doc.setFont("ZapfDingbats");
    doc.setFontSize(12);
    if (akta_file != null) {
        doc.text("4", mdPosX + 70 + 76.7, 97.5);
    } else {
        doc.text("4", mdPosX + 70 + 93.7, 97.5)
    };
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);


    // ? 2
    doc.text("2)", mdPosX + 70, 103.5)
    doc.text("Foto Copy NIB", mdPosX + 70 + 7, 103.5)
    // ? CB
    doc.rect(mdPosX + 70 + 76, 100, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 100, 4.5, 4.5)
    // ? Cheklist
    doc.setFont("ZapfDingbats");
    doc.setFontSize(12);
    if (nib_file != null) {
        doc.text("4", mdPosX + 70 + 76.5, 104);
    } else {
        doc.text("4", mdPosX + 70 + 93.5, 104);
    }
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);




    // ? 3 Data ?
    doc.text("3)", mdPosX + 70, 110)
    doc.text("Foto Copy Domisili Perusahaan", mdPosX + 70 + 7, 110)
    // ? cb
    doc.rect(mdPosX + 70 + 76, 107, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 107, 4.5, 4.5)
    // ? checklist
    doc.setFontSize(12);
    // doc.setFont("ZapfDingbats");
    // if (domisili_file != null){
    //     doc.text("4",ALignRightText+76.6,110.5);
    // }else {
    //     doc.text("4",ALignRightText+93.6,110.5);
    // }
    // doc.setFont(Constants.DEFAULT_FONT,"normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);

    // // ? 4
    doc.text("4)", mdPosX + 70, 116.7)
    doc.text("Foto Copy NPWP", mdPosX + 70 + 7, 116.7)
    doc.rect(mdPosX + 70 + 76, 113.5, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 113.5, 4.5, 4.5)
    doc.setFontSize(12);
    doc.setFont("ZapfDingbats");
    if (npwp_file != null) {
        doc.text("4", mdPosX + 70 + 76.5, 117.2);
    } else {
        doc.text("4", mdPosX + 70 + 93.5, 117.2);
    }
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);


    // ? 5
    doc.text("5)", mdPosX + 70, 123.2)
    doc.text("Foto Copy PKP", mdPosX + 70 + 7, 123.2)
    doc.rect(mdPosX + 70 + 76, 120, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 120, 4.5, 4.5)
    doc.setFont("ZapfDingbats");
    doc.setFontSize(12);
    if (sppkp_file != null) {
        doc.text("4", mdPosX + 70 + 76.5, 123.7);
    } else {
        doc.text("4", mdPosX + 70 + 93.5, 123.7);
    }
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);

    // ? 6
    doc.text("6)", mdPosX + 70, 129.5)
    doc.text("Foto Copy KTP Direktur Perusahaan", mdPosX + 70 + 7, 129.5)
    doc.rect(mdPosX + 70 + 76, 126.2, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 126.2, 4.5, 4.5)
    doc.setFont("ZapfDingbats");
    doc.setFontSize(12);
    if (ktp_file != null) {
        doc.text("4", mdPosX + 70 + 76.5, 130.2);
    } else {
        doc.text("4", mdPosX + 70 + 93.5, 130.2);
    }
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);



    // ? Data ? 7
    doc.text("7)", mdPosX + 70, 136)
    doc.text("Foto Copy Sertifikat Principle / Pemegang Merk", mdPosX + 70 + 7, 136)
    doc.rect(mdPosX + 70 + 76, 132.5, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 132.5, 4.5, 4.5)
    doc.setFontSize(12);
    doc.setFont("ZapfDingbats");
    // if ( principle_file != null){
    //     doc.text("4",mdPosX+70+76.5,136.5);
    // } else {
    //     doc.text("4",mdPosX+70+93.5,136.5);
    // }
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);


    // ? 8 Data?
    doc.text("8)", mdPosX + 70, 142)
    doc.text("Company Profile", mdPosX + 70 + 7, 142)
    doc.rect(mdPosX + 70 + 76, 138.5, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 138.5, 4.5, 4.5)
    // doc.setFontSize(12);
    // doc.setFont("ZapfDingbats");
    // if ( company_file !=null){
    //     doc.text("4",mdPosX+70+76.5,142.5);
    // } else {
    //     doc.text("4",mdPosX+70+93.5,142.5);
    // }
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);

    // ? 9 Data ?
    doc.text("9)", mdPosX + 70, 148.5)
    doc.text("Brosur", mdPosX + 70 + 7, 148.5)
    doc.rect(mdPosX + 70 + 76, 144.5, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 144.5, 4.5, 4.5)
    doc.setFontSize(12);
    doc.setFont("ZapfDingbats");
    // if (brosur_file != null){
    //     doc.text("4",mdPosX+70+76.5,148.5);
    // } else {
    //     doc.text("4",mdPosX+70+93.5,148.5);
    // }
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);

    //? 10
    doc.text("10)", mdPosX + 70, 154)
    doc.text("Surat Ijin Usaha Jasa Konstruksi (SIUJK) *", mdPosX + 70 + 7, 154)

    doc.setFontSize(Constants.HEADER_FONT_SIZE - 2.5)
    doc.text("* Khusus Kontraktor", mdPosX + 70 + 7, 158.5)
    doc.rect(mdPosX + 70 + 76, 150.5, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 150.5, 4.5, 4.5)
    doc.setFontSize(12);
    doc.setFont("ZapfDingbats");
    if (sijk_file != null) {
        doc.text("4", mdPosX + 70 + 76.5, 154.5);
    } else {
        doc.text("4", mdPosX + 70 + 93.5, 154.5);
    }
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);

    // ? 11
    doc.text("11)", mdPosX + 70, 162.5)
    doc.text(" Terkait Perizinan Lainya:", mdPosX + 70 + 7, 163.5)
    doc.text("-.............................", mdPosX + 70 + 7, 167)
    doc.rect(mdPosX + 70 + 76, 161, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 161, 4.5, 4.5)
    doc.text("-.............................", mdPosX + 70 + 7, 171.5)
    doc.rect(mdPosX + 70 + 76, 166.5, 4.5, 4.5)
    doc.rect(mdPosX + 70 + 93, 166.5, 4.5, 4.5)

    // ? TTD USTP
    doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5)
    doc.setFont(Constants.DEFAULT_FONT, "bold")
    doc.text("Telah Diperiksa oleh PT. Union Sampoerna Triputra Persada:", mdPosX + 70, 176);
    doc.text("Procurement Department", mdPosX + 70 + 7.5, 182.5)
    doc.rect(mdPosX + 70, 178, 50, 7)
    doc.rect(mdPosX + 70, 185, 25, 15)
    doc.rect(mdPosX + 70 + 25, 185, 25, 15)
    doc.rect(mdPosX + 70, 200, 25, 5)
    doc.rect(mdPosX + 70 + 25, 200, 25, 5)
    doc.text("Diajukan oleh", mdPosX + 70 + 2.5, 203.5)
    doc.text("Proc. Dept Head", mdPosX + 70 + 26, 203.5)
    doc.rect(mdPosX + 70 + 55, 178, 25, 7)
    doc.text("Kode Vendor", mdPosX + 70 + 58, 182.5)
    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.text(`${d.header_suppliercode}`, mdPosX + 70 + 61.5, 195)
    doc.rect(mdPosX + 70 + 55, 185, 25, 20)



    // ? Title Document 
    const doc_title = `Formulir Registrasi Vendor - ${d.header_suppliercode} `
    document.title = doc_title


    /*     // Convert PDF to data URL
        const pdfData = doc.output('datauristring', { filename: `report.pdf` });
    
        // Set data URL as source for the PDF preview
        if (pdfPreviewRef.current) {
            pdfPreviewRef.current.src = pdfData;
        } */

    // -- versi 2 set output as blob
    outputPdfBlob(doc)
};
