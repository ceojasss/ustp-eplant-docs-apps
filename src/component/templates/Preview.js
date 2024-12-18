import "x-data-spreadsheet/dist/xspreadsheet.css";

import { Container, Icon, Label, Segment } from 'semantic-ui-react'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react';
import { read, utils, writeFile } from 'xlsx';
import Spreadsheet from "x-data-spreadsheet";
/* import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid'; */
const save = _.debounce(data => {
    console.log('save', data);
}, 500);


const Preview = (props) => {

    /*    console.log(document.documentElement.clientHeight,
           document.documentElement.clientWidth,
           document.documentElement) */

    const sheetData = {
        rows: [
            {
                cells: [
                    { text: 'testingtesttestetst' },
                    { text: 'testing' }
                ]
            },
            {
                cells: [
                    { text: 'testingtesttestetst' },
                    { text: 1000 }
                ]
            }
        ]
    }


    const rows10 = { len: 1000 };
    for (let i = 0; i < 1000; i += 1) {
        rows10[i] = {
            cells: {
                0: { text: 'A-' + i },
                1: { text: 'B-' + i },
                2: { text: 'C-' + i },
                3: { text: 'D-' + i },
                4: { text: 'E-' + i },
                5: { text: 'F-' + i },
            }
        };
    }

    const rows = {
        //  len: 80,
        '1': {
            cells: {
                0: { text: 'testingtesttestetst' },
                2: { text: 'testing' },
            },
        },
        '2': {
            cells: {
                0: { text: 'render', style: 0 },
                1: { text: 'Hello' },
                2: { text: 'haha', merge: [1, 1] },
            }
        },
        '8': {
            cells: {
                8: { text: 'border test', style: 0 },
            }
        }
    };


    const datanya = [
        {
            "name": "Bank Ledger",
            "group": "Bank Ledger",
            "childroute": null,
            "rows": {
                "0": {
                    "cells": {
                        "0": {
                            "text": "Voucher No"
                        },
                        "1": {
                            "text": "Date"
                        },
                        "2": {
                            "text": "Reference No"
                        },
                        "3": {
                            "text": "Location Type"
                        },
                        "4": {
                            "text": "Location Code"
                        },
                        "5": {
                            "text": "Location Name"
                        },
                        "6": {
                            "text": "Jobcode"
                        },
                        "7": {
                            "text": "Job Description"
                        },
                        "8": {
                            "text": "Amount Receive"
                        },
                        "9": {
                            "text": "Amount Payment"
                        },
                        "10": {
                            "text": "Balance"
                        }
                    }
                },
                "1": {
                    "cells": {
                        "0": {
                            "text": "A01-PERMATA GIRO 070-11-95809"
                        },
                        "1": {
                            "text": null
                        },
                        "2": {
                            "text": null
                        },
                        "3": {
                            "text": null
                        },
                        "4": {
                            "text": null
                        },
                        "5": {
                            "text": null
                        },
                        "6": {
                            "text": null
                        },
                        "7": {
                            "text": null
                        },
                        "8": {
                            "text": 0
                        },
                        "9": {
                            "text": 0
                        },
                        "10": {
                            "text": 295687687
                        }
                    }
                },
                "2": {
                    "cells": {
                        "0": {
                            "text": "USTP/PVHO/B/2312/00564"
                        },
                        "1": {
                            "text": "31-12-2023"
                        },
                        "2": {
                            "text": "-"
                        },
                        "3": {
                            "text": "CB"
                        },
                        "4": {
                            "text": "CB"
                        },
                        "5": {
                            "text": "COSTBOOK"
                        },
                        "6": {
                            "text": "75100000"
                        },
                        "7": {
                            "text": "Biaya  Administrasi  Bank    "
                        },
                        "8": {
                            "text": 0
                        },
                        "9": {
                            "text": 40000
                        },
                        "10": {
                            "text": 295567687
                        }
                    }
                },
                "3": {
                    "cells": {
                        "0": {
                            "text": "USTP/PVHO/B/2312/00565"
                        },
                        "1": {
                            "text": "31-12-2023"
                        },
                        "2": {
                            "text": "-"
                        },
                        "3": {
                            "text": "GC"
                        },
                        "4": {
                            "text": "9125"
                        },
                        "5": {
                            "text": "HO - GENERAL AFFAIR"
                        },
                        "6": {
                            "text": "61214000"
                        },
                        "7": {
                            "text": "Biaya Telepon dan Fax  "
                        },
                        "8": {
                            "text": 0
                        },
                        "9": {
                            "text": 406716
                        },
                        "10": {
                            "text": 294347539
                        }
                    }
                },
                "4": {
                    "cells": {
                        "0": {
                            "text": "USTP/PVHO/B/2312/00570"
                        },
                        "1": {
                            "text": "31-12-2023"
                        },
                        "2": {
                            "text": "-"
                        },
                        "3": {
                            "text": "CB"
                        },
                        "4": {
                            "text": "CB"
                        },
                        "5": {
                            "text": "COSTBOOK"
                        },
                        "6": {
                            "text": "71101000"
                        },
                        "7": {
                            "text": "Pendapatan Bunga Jasa Giro   "
                        },
                        "8": {
                            "text": 0
                        },
                        "9": {
                            "text": 12117
                        },
                        "10": {
                            "text": 294311188
                        }
                    }
                },
                "5": {
                    "cells": {
                        "0": {
                            "text": "USTP/RVHO/B/2312/00415"
                        },
                        "1": {
                            "text": "31-12-2023"
                        },
                        "2": {
                            "text": "-"
                        },
                        "3": {
                            "text": "CB"
                        },
                        "4": {
                            "text": "CB"
                        },
                        "5": {
                            "text": "COSTBOOK"
                        },
                        "6": {
                            "text": "71101000"
                        },
                        "7": {
                            "text": "Pendapatan Bunga Jasa Giro   "
                        },
                        "8": {
                            "text": 60586
                        },
                        "9": {
                            "text": 0
                        },
                        "10": {
                            "text": 294492946
                        }
                    }
                },
                "6": {
                    "cells": {
                        "0": {
                            "text": "Total"
                        },
                        "1": {
                            "text": null
                        },
                        "2": {
                            "text": null
                        },
                        "3": {
                            "text": null
                        },
                        "4": {
                            "text": null
                        },
                        "5": {
                            "text": null
                        },
                        "6": {
                            "text": null
                        },
                        "7": {
                            "text": null
                        },
                        "8": {
                            "text": null
                        },
                        "9": {
                            "text": null
                        },
                        "10": {
                            "text": 294492946
                        }
                    }
                }
            },
            "code": "1",
            "groupid": "1"
        },
        {
            "name": "Bank Ledger",
            "group": "Bank Ledger",
            "childroute": null,
            "rows": {
                "0": {
                    "cells": {
                        "0": {
                            "text": "Voucher No"
                        },
                        "1": {
                            "text": "Date"
                        },
                        "2": {
                            "text": "Reference No"
                        },
                        "3": {
                            "text": "Location Type"
                        },
                        "4": {
                            "text": "Location Code"
                        },
                        "5": {
                            "text": "Location Name"
                        },
                        "6": {
                            "text": "Jobcode"
                        },
                        "7": {
                            "text": "Job Description"
                        },
                        "8": {
                            "text": "Amount Receive"
                        },
                        "9": {
                            "text": "Amount Payment"
                        },
                        "10": {
                            "text": "Balance"
                        }
                    }
                },
                "1": {
                    "cells": {
                        "0": {
                            "text": "A01-PERMATA GIRO 070-11-95809"
                        },
                        "1": {
                            "text": null
                        },
                        "2": {
                            "text": null
                        },
                        "3": {
                            "text": null
                        },
                        "4": {
                            "text": null
                        },
                        "5": {
                            "text": null
                        },
                        "6": {
                            "text": null
                        },
                        "7": {
                            "text": null
                        },
                        "8": {
                            "text": 0
                        },
                        "9": {
                            "text": 0
                        },
                        "10": {
                            "text": 295687687
                        }
                    }
                },
                "2": {
                    "cells": {
                        "0": {
                            "text": "USTP/PVHO/B/2312/00564"
                        },
                        "1": {
                            "text": "31-12-2023"
                        },
                        "2": {
                            "text": "-"
                        },
                        "3": {
                            "text": "CB"
                        },
                        "4": {
                            "text": "CB"
                        },
                        "5": {
                            "text": "COSTBOOK"
                        },
                        "6": {
                            "text": "75100000"
                        },
                        "7": {
                            "text": "Biaya  Administrasi  Bank    "
                        },
                        "8": {
                            "text": 0
                        },
                        "9": {
                            "text": 40000
                        },
                        "10": {
                            "text": 295567687
                        }
                    }
                },
                "3": {
                    "cells": {
                        "0": {
                            "text": "USTP/PVHO/B/2312/00565"
                        },
                        "1": {
                            "text": "31-12-2023"
                        },
                        "2": {
                            "text": "-"
                        },
                        "3": {
                            "text": "GC"
                        },
                        "4": {
                            "text": "9125"
                        },
                        "5": {
                            "text": "HO - GENERAL AFFAIR"
                        },
                        "6": {
                            "text": "61214000"
                        },
                        "7": {
                            "text": "Biaya Telepon dan Fax  "
                        },
                        "8": {
                            "text": 0
                        },
                        "9": {
                            "text": 406716
                        },
                        "10": {
                            "text": 294347539
                        }
                    }
                },
                "4": {
                    "cells": {
                        "0": {
                            "text": "USTP/PVHO/B/2312/00570"
                        },
                        "1": {
                            "text": "31-12-2023"
                        },
                        "2": {
                            "text": "-"
                        },
                        "3": {
                            "text": "CB"
                        },
                        "4": {
                            "text": "CB"
                        },
                        "5": {
                            "text": "COSTBOOK"
                        },
                        "6": {
                            "text": "71101000"
                        },
                        "7": {
                            "text": "Pendapatan Bunga Jasa Giro   "
                        },
                        "8": {
                            "text": 0
                        },
                        "9": {
                            "text": 12117
                        },
                        "10": {
                            "text": 294311188
                        }
                    }
                },
                "5": {
                    "cells": {
                        "0": {
                            "text": "USTP/RVHO/B/2312/00415"
                        },
                        "1": {
                            "text": "31-12-2023"
                        },
                        "2": {
                            "text": "-"
                        },
                        "3": {
                            "text": "CB"
                        },
                        "4": {
                            "text": "CB"
                        },
                        "5": {
                            "text": "COSTBOOK"
                        },
                        "6": {
                            "text": "71101000"
                        },
                        "7": {
                            "text": "Pendapatan Bunga Jasa Giro   "
                        },
                        "8": {
                            "text": 60586
                        },
                        "9": {
                            "text": 0
                        },
                        "10": {
                            "text": 294492946
                        }
                    }
                },
                "6": {
                    "cells": {
                        "0": {
                            "text": "Total"
                        },
                        "1": {
                            "text": null
                        },
                        "2": {
                            "text": null
                        },
                        "3": {
                            "text": null
                        },
                        "4": {
                            "text": null
                        },
                        "5": {
                            "text": null
                        },
                        "6": {
                            "text": null
                        },
                        "7": {
                            "text": null
                        },
                        "8": {
                            "text": null
                        },
                        "9": {
                            "text": null
                        },
                        "10": {
                            "text": 294492946
                        }
                    }
                }
            },
            "code": "1",
            "groupid": "1"
        }
    ]

    const el = useRef(null);
    /**    rows: {
                        0: {
                            cells: {
                                0: { text: 'testingtesttestetst' },
                                2: { text: 'testing' }
                            }
                        },
                        1: {
                            cells: {
                                0: { text: 'testingtesttestetst' },
                                2: { text: 'testing' }
                            }
                        }
                    } */
    /*  useEffect(() => {
         const s = new Spreadsheet(el.current, {
             mode: 'read',
             view: {
                 height: () => document.documentElement.clientHeight - 60,
                 width: () => document.documentElement.clientWidth,
             }
         })
             .loadData(sheetData)
             .change(data => {
                 save(data);
                 console.log(s.validate());
             });
     }, []); */

    useEffect(() => {
        const s = new Spreadsheet(el.current, {
            mode: 'read',
            view: {
                height: () => document.documentElement.clientHeight - 60,
                width: () => document.documentElement.clientWidth,
            }
        }).loadData(datanya)
            /* .loadData([{
                name: "sheet name ",
                freeze: 'B3',
                styles: [
                    {
                        bgcolor: '#f4f5f8',
                        textwrap: true,
                        color: '#900b09',
                        border: {
                            top: ['thin', '#0366d6'],
                            bottom: ['thin', '#0366d6'],
                            right: ['thin', '#0366d6'],
                            left: ['thin', '#0366d6'],
                        },
                    },
                ],
                merges: [
                    'C3:D4',
                ],
                cols: {
                    len: 10,
                    2: { width: 200 },
                },
                rows,
            }, { name: 'sheet-test', rows: rows10 }, { name: 'data', rows: rowtest }]) */.change((cdata) => {
            // console.log(cdata);
            console.log('>>>', s.getData());
        })
            .change(data => {
                save(data);
                console.log(s.validate());
            })
    }, []);


    return <Container fluid>
        <Segment clearing attached='top' size="mini" style={{ height: '50px !important', margin: '0' }}>
            <div style={{ float: 'left', fontSize: 'x-large', fontWeight: 'bold' }}>Header</div>
            <div style={{ float: 'right', }}>
                <Label as='a' color="green" basic size="large">
                    <Icon name='download' />
                    Download
                </Label>
            </div>
        </Segment>
        <div ref={el} />
    </Container>


}

export default Preview