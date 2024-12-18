import "x-data-spreadsheet/dist/xspreadsheet.css";

import { Container, Icon, Label, Segment } from 'semantic-ui-react'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react';
import { read, utils, writeFile } from 'xlsx';
import Spreadsheet from "x-data-spreadsheet";
import { connect, useDispatch } from "react-redux";
import { setupSpreadsheet } from "../../redux/actions";
import { stox, xtos } from "../../utils/xlsxspread";



const save = _.debounce(data => {
    console.log('save', data);
}, 500);


const Vessel = ({ spreadsheet }) => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param1 = urlParams.get('doc');
    const dispatch = useDispatch()

    const title = `${spreadsheet?.reportdesc}`

    //console.log(_.split(spreadsheet?.parameters, "&"))
    document.title = title;

    let sheets
    useEffect(() => {

        const jparam = JSON.parse(atob(param1))

        console.log(jparam)
        dispatch(setupSpreadsheet(jparam))



    }, [param1])

    const el = useRef(null);

    const sheetEl = useRef(null);
    const sheetRef = useRef(null);

    useEffect(() => {

        console.log(spreadsheet?.data)

        let row = 100

        _.map(spreadsheet?.data, x => {
            if (_.size(x.rows) > row) {
                row = _.size(x.rows)
            }
        })

        row += 50;

        if (!_.isUndefined(spreadsheet)) {
            sheets = new Spreadsheet("#x-spreadsheet-demo"/* el.current, */, {
                mode: 'read',
                row: {
                    len: row,
                    height: 30,
                },
                view: {
                    height: () => document.documentElement.clientHeight - 60,
                    width: () => document.documentElement.clientWidth,
                }
            }).loadData(spreadsheet.data).change((cdata) => {
                console.log('>>>', sheets.getData());
            })
                .change(data => {
                    save(data);
                    console.log(sheets.validate());
                })

            sheetRef.current = sheets;
        }

    }, [spreadsheet]);


    if (_.isUndefined(spreadsheet))
        return <>data {JSON.stringify(spreadsheet)}</>


    if (_.isUndefined(spreadsheet?.data))
        return <>no data to generate</>

    return <Container fluid>
        <Segment clearing attached='top' size="mini" style={{ height: '50px !important', margin: '0' }}>
            <div style={{ float: 'left', fontSize: 'x-large', fontWeight: 'bold' }}>{title}</div>
            <div style={{ float: 'right', }}>
                <Label as='a' color="green" basic size="large" onClick={() => {

                    //                    console.log(sheets.getData())
                    var new_wb = xtos(sheets.getData());

                    try {
                        writeFile(new_wb, `${title}.xlsx`);
                    } catch (e) {
                        console.log(e);
                    }
                    //                    writeFile(stox(sheets.getData()), "SheetJS.xlsx");
                }}>
                    <Icon name='download' />
                    Download
                </Label>
            </div>
        </Segment>
        {/*         <div ref={el} id="x-spreadsheet-demo" />
 */}
        <div
            id="x-spreadsheet-demo"
            ref={sheetEl}
        ></div>

    </Container>


}

const mapStateToProps = (state) => {

    //    console.log(state.auth)

    return { spreadsheet: state.auth.spreadsheet }
}

export default connect(mapStateToProps)(Vessel)