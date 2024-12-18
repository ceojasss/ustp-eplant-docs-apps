import React, { useRef, useState, useEffect, useMemo } from "react"
import { useDispatch, connect } from 'react-redux'
import { Button, Card, Dimmer, Divider, Form as FormUI, Grid, Header, Icon, Input, Label, Loader, Modal, Search, Segment, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react'
import { useForm, FormProvider, Controller } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AsyncSelect from 'react-select/async'
// *library imports placed above ↑
// *local imports placed below ↓
import reducer from "./FormReducer"

import { fetchDataheader, fetchDatadetail } from './FormAction'

import '../../../Public/CSS/App.css'
import ContentHeader from '../../../templates/ContentHeader'
import { DialogConfirmation, ScanQRCODE } from "../../../../redux/actions"
import {
    changeReducer, getColumn, getColumnDetail, getDetailData, getLoadingStatus, getRowData,
    getTitle, periodHandler, QueryData, QueryDataDetail, QueryDatePeriode, QueryPageCount,
    QueryPageIndexes, QueryPageSizes, QueryReducerID, QuerySearch, searchHandler
} from "../../../../utils/FormComponentsHelpler";

import '../../../Public/CSS/App.css'
import { DELETE, RESET_ERROR_MODAL_STATE, UPDATE } from "../../../../redux/actions/types";
import LoadingStatus from "../../../templates/LoadingStatus";
import { SubRowAsync } from "../../../templates/SubRowAsync";
import RenderTable from "../../../templates/TableDynamic";
import Html5QrcodePlugin from "../../../../utils/Html5QrcodePlugin";
import DialogScanQR from "../../../templates/popup/DialogScanQR";
import DialogScannerQR from "../../../templates/popup/DialogScannerQR";



const Form = ({ data, isloading, datadetail, queryPageSize, queryPageIndex, pageCount, search, dateperiode, reducerid, modalsState }) => {

    const { route } = useParams();
    const loc = useLocation()
    const dispatch = useDispatch()

    const [choosen, setChoosen] = useState('')
    const [choose, setChoose] = useState(false)
    const [singleModalState, setSingleModalState] = useState(false)

    const inputRef = useRef(null);
    const btnClick = () => {

        setChoose(!choose)
        //        setSingleModalState(true)

        //dispatch(ScanQRCODE())
    }

    const button = {
        btnLabel: 'Scan QR Faktur',
        btnIcon: 'qrcode',
        addClickHandler: btnClick,
    }



    useEffect(() => {
        console.log('modal '.modalsState)
        if (!_.isEmpty(modalsState.contentType) && !modalsState.state) {
            console.log('run')
            dispatch(fetchDataheader(queryPageIndex, queryPageSize, search, dateperiode))
        }

    }, [modalsState])

    const onDispatchdetail = (params) => {

        //        console.log(data[0][0].nomorfaktur)
        dispatch(fetchDatadetail(data[0][0].nomorfaktur))
    }


    useEffect(() => {

        // console.log('change reducers payment')
        // store.injectReducer(loc.pathname.replaceAll('/', ''), reducer);
        changeReducer(loc.pathname.replaceAll('/', ''), reducer)

        //  actives.activeRoute

        dispatch(fetchDataheader(queryPageIndex, queryPageSize, search, dateperiode))

    }, [dispatch, queryPageIndex, queryPageSize, search, dateperiode])


    const rowClickHandler = async (action, row) => {
        // * reset error status
        dispatch({ type: RESET_ERROR_MODAL_STATE })

        switch (action) {
            case UPDATE:
                // console.log('click edit')
                // * call function to prepare data 

                break;
            case DELETE:
                // * set custom delete message     
                //      dispatch(DialogConfirmation(DELETE, `Kode Data : ${row.original.prcode} Akan Dihapus`, row))
                break;
            default:
                break;
        }

    }

    const [decodedResults, setDecodedResults] = useState([]);
    const onNewScanResult = (decodedText, decodedResult) => {
        console.log("App [result]", decodedResult);
        setDecodedResults(prev => [...prev, decodedResult]);
    };

    const renderRowSubComponent = React.useCallback(
        ({ row, rowProps, visibleColumns }) => (
            <SubRowAsync
                /**
                 * ! ganti vouchercode sesuai dengan id nya
                 */
                row={getRowData(row)}
                rowProps={rowProps}
                column={getColumnDetail(data)}
                visibleColumns={visibleColumns}
                onDispatchdetail={onDispatchdetail}
                header={'Detail Transaksi ' + getTitle(data)}
                /**
             * ! ganti vouchercode sesuai dengan id nya
             */
                datasdetail={getDetailData(row)}
            />
        ),
        [datadetail]
    );

    //   console.log(data)

    const scannerChoice = (c) => {
        console.log(c)
        setChoose(!choose)


        if (c !== '') {
            setChoosen(c)

            setSingleModalState(true)
        }
    }



    if (isloading || (_.isEmpty(data[0]) && _.isEmpty(data[1]) /* && _.isEmpty(datadetail) */)
        || loc.pathname.replaceAll('/', '') != reducerid)
        return (<LoadingStatus />)




    return (
        <ContentHeader
            title='Import Dokumen eFaktur'
            btn1={button}
            searchaction={searchHandler({ search })}
            periodaction={periodHandler({ dateperiode })}>
            <RenderTable
                as={Grid.Column}
                columns={getColumn(data)}
                data={data[0]}
                Controlled={pageCount}
                queryPageIndex={queryPageIndex}
                queryPageSize={queryPageSize}
                search={search}
                dateperiode={dateperiode}
                onRowClick={rowClickHandler}
                renderRowSubComponent={renderRowSubComponent}
            />
            <Modal
                onClose={() => setChoose(false)}
                onOpen={() => setChoose(true)}
                open={choose}
            >
                <Modal.Content >
                    {/*    <Icon name='video camera' />
                    <Icon name='qrcode' /> */}
                    <Grid divided='vertically' relaxed>
                        <Grid.Row columns={2}>
                            <Grid.Column textAlign="center" >
                                <Header as='h2' icon style={{ cursor: 'pointer' }} onClick={() => scannerChoice('CAM')} >
                                    <Icon name='video camera' />
                                    Scan Dengan Web Cam
                                    <Header.Subheader style={{ color: 'red', fontStyle: 'italic' }}>
                                        pastikan WEBCAM sudah terhubung
                                    </Header.Subheader>
                                </Header>
                            </Grid.Column>
                            <Grid.Column textAlign="center">
                                <Header as='h2' icon style={{ cursor: 'pointer' }} onClick={() => scannerChoice('SCAN')}>
                                    <Icon name='qrcode' />
                                    Scan Dengan QR Scanner
                                    <Header.Subheader style={{ color: 'red', fontStyle: 'italic' }}>
                                        pastikan QR Scanner sudah terhubung
                                    </Header.Subheader>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>

            <Modal open={singleModalState} >
                <Modal.Header content={<Header as='h2' icon='qrcode' content='Scan QR Faktur' />} />
                <Modal.Content >
                    {(choosen === 'SCAN' ? <DialogScannerQR /> : <DialogScanQR />)}
                    {/* <DialogScanQR /> */}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setSingleModalState(false)} content='Tutup' negative />
                </Modal.Actions>
            </Modal>

        </ContentHeader>
    )

}

const mapStateToProps = (state) => {



    return {
        modalsState: state.auth.modals,
        reducerid: QueryReducerID(state),
        queryPageIndex: QueryPageIndexes(state),
        queryPageSize: QueryPageSizes(state),
        search: QuerySearch(state),
        dateperiode: QueryDatePeriode(state),
        pageCount: QueryPageCount(state),
        data: QueryData(state),
        datadetail: QueryDataDetail(state),
        isloading: getLoadingStatus(state)
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Form)