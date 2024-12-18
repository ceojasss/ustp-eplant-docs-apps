import _ from 'lodash'
import { REPORT_ICON, DOCUMENT_SIZE } from '../../Constants';



export const pvDoc = {
    orientation: DOCUMENT_SIZE.p_a4.orientation,
    unit: 'mm',
    format: DOCUMENT_SIZE.p_a4.size,
    putOnlyUsedFonts: true,
    floatPrecision: 16, // or "smart", default is 16
    compress: true

}

export const PRdoc = {
    orientation: DOCUMENT_SIZE.l_b3.orientation,
    unit: 'mm',
    format: DOCUMENT_SIZE.l_b3.size,
    putOnlyUsedFonts: true,
    floatPrecision: 16, // or "smart", default is 16
    compress: true

}
export const Rvdoc = {
    orientation: DOCUMENT_SIZE.l_a4.orientation,
    unit: 'mm',
    format: DOCUMENT_SIZE.l_a4.size,
    putOnlyUsedFonts: true,
    floatPrecision: 16, // or "smart", default is 16
    compress: true
}


export const Sivdoc = {
    orientation: DOCUMENT_SIZE.l_b3.orientation,
    unit: 'mm',
    format: DOCUMENT_SIZE.l_b3.size,
    putOnlyUsedFonts: true,
    floatPrecision: 16, // or "smart", default is 16
    compress: true

}








export const multiText = (doc, x, y, maxWidth, text, callback) => {


    const words = _.split(text, ' ')//text.split(' ');

    let chunks = [];
    let currentChunk = '';
    //    const maxWidth = 15; // Set your maximum width here


    for (let i = 0; i < words.length; i++) {
        const proposedChunk = currentChunk + (currentChunk === '' ? '' : ' ') + words[i];
        const currentWidth = doc.getStringUnitWidth(proposedChunk);

        if (currentWidth > maxWidth) {



            chunks.push(currentChunk.trim());
            currentChunk = words[i];
        } else {

            if (words.length - 1 === i) {
                chunks.push(proposedChunk.trim());

            }

            currentChunk = proposedChunk;
        }
    }



    chunks.forEach(chunk => {
        doc.text(x, y, chunk);

        y += 4; // Adjust this value as needed for line spacing
    });

    if (callback)
        callback(y)

}

export const CompanyLogo = (doc, x, y) => {
    doc.addImage("/LOGO EPLANT v2 opsi2.png", "png", x, y, REPORT_ICON.w, REPORT_ICON.h);
}



const getHeaderTable = (arrHeader) => {
    // Group items by main headers
    const grouped = _.groupBy(arrHeader, item => {
        const parts = item.split('#');
        return parts[0];
    });

    // Calculate rowSpan and colSpan
    // Calculate rowSpan and colSpan
    const headers = _.map(grouped, (values, key) => {
        const rowSpan = values.some(value => value.includes('#')) ? 1 : 2; // Calculate rowSpan
        const headerObj = { content: key };

        if (values.length > 1) {
            headerObj.colSpan = values.length;
        } else {
            headerObj.rowSpan = rowSpan;
            headerObj.styles = { valign: 'center' }
        }

        return headerObj;
    });

    const subheaders = _.flatMap(grouped, (values, key) => {
        const subheaderValues = values.filter(value => value.includes('#'));
        if (subheaderValues.length > 0) {
            return _.map(subheaderValues, subheader => {
                const parts = subheader.split('#');
                return { content: parts[1] };
            });
        }
        return [];
    });

    // Combine headers and subheaders
    const result = [headers, subheaders];

    //console.log('puteput', result)

    return result
}


export const AuthBox = (doc, thead, startY, Ymove) => {

    const headerAuthRaw = _.chain(thead[0])
        .pickBy((value, key) => key !== 'pos_type')
        .values()
        .value();

    const labelAuthRaw = _.chain(thead[1])
        .omit('pos_type') // Filter out pos_type key
        .mapValues(value => value === null ? '' : value) // Convert null values to empty strings
        .values()
        .value();



    const header = getHeaderTable(headerAuthRaw)


    doc.autoTable({
        startY: startY,
        head: header,
        theme: 'plain',
        styles: {
            lineColor: [44, 62, 80],
            lineWidth: 0.1
        },
        headStyles: { halign: 'center'},
        bodyStyles: {
            minCellHeight: 30,
            lineWidth: 0.1,
            halign: 'center',
            valign: 'top',
        },
        body: [_.times(_.size(labelAuthRaw), _.constant(''))],
        margin: { left: 6, right: 6, top: Ymove },
        footStyles: { halign: 'center', valign: 'top' },
        foot: [labelAuthRaw]
    });

}


export const AuthBoxSiv = (doc, thead, startY, Ymove) => {

    const headerAuthRaw = _.chain(thead[0])
        .pickBy((value, key) => key !== 'pos_type')
        .values()
        .value();

    const labelAuthRaw = _.chain(thead[1])
        .omit('pos_type') // Filter out pos_type key
        .mapValues(value => value === null ? '' : value) // Convert null values to empty strings
        .values()
        .value();
    
    const labelAuthRaw2 = _.chain(thead[2])
        .omit('pos_type') // Filter out pos_type key
        .mapValues(value => value === null ? '' : value) // Convert null values to empty strings
        .values()
        .value();



    const header = getHeaderTable(headerAuthRaw)


    doc.autoTable({
        startY: startY,
        head: header,
        theme: 'plain',
        styles: {
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
        },
        headStyles: { halign: 'center' , minCellHeight: 20},
        bodyStyles: {
            minCellHeight: 30,
            halign: 'center',
            valign: 'top',
        },
        body: [_.times(_.size(labelAuthRaw), _.constant(''))],
        margin: { left: 3, right: 3, top: Ymove },
        footStyles: { halign: 'center', valign: 'top' },
        foot: [labelAuthRaw, labelAuthRaw2],
        columnStyles: {
            0: { cellWidth: doc.internal.pageSize.width / 6 }, 
            1: { cellWidth: doc.internal.pageSize.width / 6 }, 
            2: { cellWidth: doc.internal.pageSize.width / 6 } 
          },
    });

}


export const AuthBoxSivLx = (doc, thead, startY, Ymove) => {

    
    const headerAuthRaw = _.chain(thead[0])
        .pickBy((value, key) => key !== 'pos_type')
        .values()
        .value();

    const labelAuthRaw = _.chain(thead[1])
        .omit('pos_type') // Filter out pos_type key
        .mapValues(value => value === null ? '' : value) // Convert null values to empty strings
        .values()
        .value();
    
    const labelAuthRaw2 = _.chain(thead[2])
        .omit('pos_type') // Filter out pos_type key
        .mapValues(value => value === null ? '' : value) // Convert null values to empty strings
        .values()
        .value();



    const header = getHeaderTable(headerAuthRaw)


    doc.autoTable({
        startY: startY,
        head: header,
        theme: 'plain',
        styles: {
            lineColor: [255, 255, 255],
            lineWidth: 0.5,
            fontSize: 7
        },
        headStyles: { halign: 'center' , minCellHeight: 20},
        bodyStyles: {
            minCellHeight: 15,
            halign: 'center',
            valign: 'top',
        },
        body: [_.times(_.size(labelAuthRaw), _.constant(''))],
        margin: { left: 3, right: 3, top: Ymove },
        footStyles: { halign: 'center', valign: 'top' },
        foot: [labelAuthRaw, labelAuthRaw2],
        columnStyles: {
            0: { cellWidth: doc.internal.pageSize.width / 3 }, 
            1: { cellWidth: doc.internal.pageSize.width / 3 }, 
            2: { cellWidth: doc.internal.pageSize.width / 3 } 
          },
    });

}


export const AuthBoxSimple = (doc, thead, startX, startY, Ymove, styl, cb) => {

    const headerAuthRaw = _.chain(thead[0])
        .pickBy((value, key) => key !== 'pos_type')
        .values()
        .value();

    const labelAuthRaw = _.chain(thead[1])
        .omit('pos_type') // Filter out pos_type key
        .mapValues(value => value === null ? '' : value) // Convert null values to empty strings
        .values()
        .value();


    //console.log(headerAuthRaw)
    //const header = getHeaderTable(headerAuthRaw)


    doc.autoTable({
        startY: startY,
        head: [headerAuthRaw],
        theme: 'plain',
        styles: {
            //     lineColor: [44, 62, 80],
            //lineWidth: 0.5
        },
        headStyles: { halign: 'center' },
        bodyStyles: {
            minCellHeight: 30,
            cellWidth: 70,
            halign: 'center',
            valign: 'top',
        },
        body: [_.times(_.size(labelAuthRaw), _.constant(''))],
        margin: { left: startX, right: 3, top: Ymove },
        footStyles: styl.footStyle,
        foot: [labelAuthRaw],

    });
    let tableHeight
    if (styl.outsideborder) {


        // Get table height and width
        const x = doc.lastAutoTable;
        const widthsum = x.columns.reduce((sum, column) => sum + column.width, 0);
        tableHeight = x.finalY - startY;

        doc.setLineWidth(0.1); // Set the width of the border lines
        doc.rect(x.settings.margin.left, startY, widthsum, tableHeight); // Draw a rectangle around the table
    }

    if (cb)
        cb(tableHeight + 6)
}


export const AuthBoxDynamic = (doc, thead, startX, startY, Ymove, styl, cb) => {



    const headerAuthRaw = _.map(thead, x => x.header)
    /*     
        _.chain(thead[0])
            .pickBy((value, key) => key !== 'pos_type')
            .values()
            .value();
     */


    console.log(_.size(thead))


    const labelAuthSign = _.map(thead, x => {
        return {
            content: _.isEmpty(x.signed_info) ? "" : x.signed_info,
            styles: {
                lineColor: 'black',
                minCellHeight: 15,
                valign: 'Bottom',
                fontSize: 14,
            }
        }
    })
    const labelAuthDate = _.map(thead, x => {
        return {
            content: _.isEmpty(x.signed_date) ? "" : x.signed_date,
            styles: {
                lineColor: 'black',
                fontSize: 10,
                minCellHeight: 15,
                valign: 'center',
            }
        }
    })



    const labelAuthRaw = _.map(thead, x => {
        return {
            content: _.isEmpty(x.signed_pos) ? "" : x.signed_pos,
            styles: {
                //halign: 'right',
                lineColor: 'black',
                lineWidth: { bottom: 0.1, right: 0.1, left: 0.1 },
            }
        }
    })

    const labelAuthName = _.map(thead, x => {
        return {
            content: _.isEmpty(x.signed_name) ? "" : x.signed_name,
            styles: {
                //halign: 'right',
                lineColor: 'black',
                lineWidth: { bottom: 0.1, right: 0.1, left: 0.1 },
            }
        }

    })

    /* _.chain(thead[1])
        .omit('pos_type') // Filter out pos_type key
        .mapValues(value => value === null ? '' : value) // Convert null values to empty strings
        .values()
        .value(); */


    //console.log(headerAuthRaw)
    //const header = getHeaderTable(headerAuthRaw)


    doc.autoTable({
        startY: startY,
        head: [headerAuthRaw],
        theme: 'plain',
        headStyles: {
            halign: 'center',
            lineColor: 'black',
            lineWidth: 0.1,
        },
        bodyStyles: {
            cellWidth: _.size(thead) === 7 ? 65 : 80,
            halign: 'center',
            valign: 'top',
            textColor: 'olive',
            fontStyle: 'bold',
            lineColor: 'black',
            lineWidth: { right: 0.1, left: 0.1 },
            // lineWidth: 0.5
        },
        body: [labelAuthSign, labelAuthDate],//[_.times(_.size(labelAuthRaw), _.constant(''))],
        margin: { left: startX, right: 3, top: Ymove },
        footStyles: styl.footStyle,
        foot: [labelAuthName, labelAuthRaw],
    });
    let tableHeight
    if (styl.outsideborder) {


        // Get table height and width
        const x = doc.lastAutoTable;
        const widthsum = x.columns.reduce((sum, column) => sum + column.width, 0);
        tableHeight = x.finalY - startY;

        doc.setLineWidth(0.1); // Set the width of the border lines
        doc.rect(x.settings.margin.left, startY, widthsum, tableHeight); // Draw a rectangle around the table
    }

    if (cb)
        cb(tableHeight + 6)
}

export const debugBase64 = (base64URL) => {
    var win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}


export const strToObj = (parametersString) => {
    return _.reduce(parametersString.substring(1).split('&'), (result, pair) => {
        const [key, value] = pair.split('=');
        result[_.camelCase(key)] = _.toLower(value);
        return result;
    }, {});
}