import React, { useEffect } from "react"
import { Grid, } from "semantic-ui-react"
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import LoadingStatus from "../../../templates/LoadingStatus"

import { fetchDataheader, fetchDatadetail, approvePV } from './FormAction'
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"

import reducer from "./FormReducer"
import { useNavigate, useLocation } from "react-router-dom"
import RenderTable from "../../../templates/TableDynamic"
import { SubRowAsync } from "../../../templates/SubRowAsync"
import { STATUS_UPDATED } from "../../../Constants"
import { DELETE, RESET_ERROR_MODAL_STATE, SET_LOADING_STATUS, UPDATE, PROCESS } from "../../../../redux/actions/types"
import {
    changeReducer,
    getColumn,
    getColumnDetail,
    getDetailData,
    getRowData,
    getTitle,
    IsInsert,
    parseDatetoString,
    periodHandler,
    prepareEditDataMasterDetail,
    QueryData,
    QueryDataDetail,
    QueryDatePeriode,
    QueryPageCount,
    QueryPageIndexes,
    QueryPageSizes,
    QueryReducerID,
    QuerySearch,
    searchHandler
} from "../../../../utils/FormComponentsHelpler"

import { isDataExist } from "../../../../utils/DataHelper"
import { ConfirmationApprovedWithDate, DialogConfirmation } from "../../../../redux/actions"
import { Appresources } from "../../../templates/ApplicationResources"

const List = ({ data, datadetail, queryPageSize, queryPageIndex, pageCount, search, dateperiode, reducerid, actions, modalResult, selectedValue }) => {
    // console.log(data[0])
    const loc = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const [search, setSearch] = useState('')
    // const [date, setDate] = useState(new Date())
    // const period = format(date, 'mm/yyyy')
    const button = {
        btnLabel: 'Tambah Data Baru',
        btnIcon: 'pen square',
        addClickHandler: () => {
            navigate("./new")
        },
        disabled: IsInsert(data) != 'Y' ? true : false
    }

    const openModal = () => {

    }


    const rowClickHandler = async (action, row) => {
        // * reset error status
        dispatch({ type: RESET_ERROR_MODAL_STATE })

        switch (action) {
            case PROCESS:
                dispatch(ConfirmationApprovedWithDate(`Payment Voucher Approved ${row.original.vouchercode}`, 'Pilih Tanggal Approve', row.original))
                break;
            case UPDATE:
                // console.log('click edit')
                // * call function to prepare data 

                dispatch({ type: SET_LOADING_STATUS, payload: true })

                if (!isDataExist(row.original.vouchercode))

                    await dispatch(fetchDatadetail(row.original.vouchercode,
                        // async () => {
                        // await prepareEditDataMasterDetail(row)
                        // }
                    )
                    );

                await prepareEditDataMasterDetail(row)

                navigate(`./edit/${encodeURIComponent(row.original.vouchercode)}`)

                break;
            case DELETE:
                // * set custom delete message     
                dispatch(DialogConfirmation(DELETE, `Kode Data : ${row.original.vouchercode} Akan Dihapus`, row))
                break;
            default:
                break;
        }
    }

    const onDispatchdetail = (params) => {

        console.log('dispatch detail', params)
        dispatch(fetchDatadetail(params))
    }

    const approvalPV = async (v) => {


        await dispatch(approvePV(v, (resp) => {
            if (resp === STATUS_UPDATED) {
                dispatch(fetchDataheader(queryPageIndex, queryPageSize, search, dateperiode))
            }

        }))
    }

    useEffect(() => {

        //console.log('change reducers payment')
        //store.injectReducer(loc.pathname.replaceAll('/', ''), reducer);
        changeReducer(loc.pathname.replaceAll('/', ''), reducer);

        //  actives.activeRoute

        dispatch(fetchDataheader(queryPageIndex, queryPageSize, search, dateperiode))

    }, [dispatch, queryPageIndex, queryPageSize, search, dateperiode])


    useEffect(() => {
        if (actions === Appresources.BUTTON_LABEL.LABEL_APPROVE) {

            //            // console.log('data', selectedValue.rowid)

            approvalPV({ approvedate: parseDatetoString(modalResult.approveDate), rowid: selectedValue.rowid })
        }
    }, [actions])

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

    if ((_.isEmpty(data[0]) && _.isEmpty(data[1]) && _.isEmpty(datadetail))
        || loc.pathname.replaceAll('/', '') != reducerid)
        return (<LoadingStatus />)



    return (
        <ContentHeader
            title={getTitle(data)}
            btn1={button}
            parentFunction={openModal}
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

        </ContentHeader>
    )


}


const MapStateToProps = state => {
    //  console.log(state)
    return {
        queryPageIndex: QueryPageIndexes(state),
        queryPageSize: QueryPageSizes(state),
        search: QuerySearch(state),
        dateperiode: QueryDatePeriode(state),
        pageCount: QueryPageCount(state),
        data: QueryData(state),
        datadetail: QueryDataDetail(state),
        reducerid: QueryReducerID(state),
        actions: state.auth.modals.actionpick,
        selectedValue: state.auth.modals.selectedValue,
        modalResult: state.auth.modals.result,
    }
}

export default
    requireAuth(connect(MapStateToProps, { fetchDataheader })(List))
