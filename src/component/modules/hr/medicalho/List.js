/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Dwi Adi
 |                - Bagas Dwi Putra
 |          
 |  Description:  Medical - HO
 |
 *===========================================================================*/

import React, { useEffect } from "react"
import { Grid } from "semantic-ui-react"
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import LoadingStatus from "../../../templates/LoadingStatus"

import { clearDetail, deleteData, fetchDatadetail, fetchDataheader } from './FormAction'
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"

import reducer from "./FormReducer"
import { useNavigate, useLocation } from "react-router-dom"
import RenderTable from "../../../templates/TableDynamicNoAction"
import { SubRowAsync } from "../../../templates/SubRowAsyncAction"
import { DELETE, RESET_ERROR_MODAL_STATE, UPDATE } from "../../../../redux/actions/types"
import { ActionHelpers, changeReducer, getColumn, getColumnDetail, getDetailData, getRowData, getTitle, IsInsert, PrepareEditDataFromDetail, QueryData, QueryDataDetail, QueryDatePeriode, QueryPageCount, QueryPageIndexes, QueryPageSizes, QueryReducerID, QuerySearch, QuerySelectedData, searchHandler } from "../../../../utils/FormComponentsHelpler"
import { Appresources } from "../../../templates/ApplicationResources"
import { DialogCrudConfirmation } from "../../../../redux/actions"

const List = ({ data, queryPageSize, queryPageIndex, pageCount, search, reducerid, crudActions, selectedData, dateperiode, datadetail }) => {
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
            case UPDATE:
                // * call function to prepare data

                //                console.log(row)

                await PrepareEditDataFromDetail(row)

                //console.log(row.values)

                navigate(`./edit/${encodeURIComponent(Object.values(row.values)[1])}`)
                break;
            case DELETE:
                // * set custom delete message




                //console.log('delete', getRowData(row), Object.values(row.values)[1])
                let message = `Kode Data : ${row.original.documentno} Akan Dihapus`
                dispatch(DialogCrudConfirmation(DELETE, message, row, row))


                break;
            default:
                break;
        }

    }

    const onDispatchdetail = (params) => {
        //console.log('dispatch detail', params)

        dispatch(fetchDatadetail(params))
    }




    const renderRowSubComponent = React.useCallback(
        ({ row, rowProps, visibleColumns }) => (
            <SubRowAsync
                /**
                 * ! ganti vouchercode sesuai dengan id nya
                 */
                //row={[row.original.vehiclecode, dateperiode]}
                row={getRowData(row)}
                rowProps={rowProps}
                column={getColumnDetail(data)}
                visibleColumns={visibleColumns}
                onDispatchdetail={onDispatchdetail}
                header={'Detail Transaksi ' + getTitle(data)}
                onRowClick={rowClickHandler}
                /**
             * ! ganti vouchercode sesuai dengan id nya
             */
                datasdetail={getDetailData(row)}
            />
        ),
        [datadetail]
    );


    useEffect(() => {

        // console.log('change reducers payment')
        // store.injectReducer(loc.pathname.replaceAll('/', ''), reducer);
        changeReducer(loc.pathname.replaceAll('/', ''), reducer)

        //  actives.activeRoute

        dispatch(fetchDataheader(queryPageIndex, queryPageSize, search))

    }, [dispatch, queryPageIndex, queryPageSize, search])



    if ((_.isEmpty(data[0]) && _.isEmpty(data[1]))
        || loc.pathname.replaceAll('/', '') != reducerid)
        return (<LoadingStatus />)

    // !handling actions state 
    if (crudActions) {

        //  console.log('data selected', crudActions)

        switch (crudActions) {

            case Appresources.BUTTON_LABEL.LABEL_DELETE:
                dispatch(
                    deleteData(selectedData, async (v) => {
                        if (v === Appresources.TRANSACTION_ALERT.DELETE_SUCCESS) {
                            dispatch(clearDetail(selectedData.rowid))
                        }
                    }
                    )
                )
                break;

            default:

        }

    }
    return (
        <ContentHeader
            title={getTitle(data)}
            btn1={button}
            parentFunction={openModal}
            searchaction={searchHandler({ search })}>
            <RenderTable
                as={Grid.Column}
                columns={getColumn(data)}
                data={data[0]}
                Controlled={pageCount}
                dateperiode={dateperiode}
                queryPageIndex={queryPageIndex}
                queryPageSize={queryPageSize}
                search={search}
                /* onRowClick={rowClickHandler} */
                renderRowSubComponent={renderRowSubComponent}
            />

        </ContentHeader>
    )


}


const MapStateToProps = state => {

    return {
        crudActions: ActionHelpers(state),
        selectedData: QuerySelectedData(state),
        queryPageIndex: QueryPageIndexes(state),
        queryPageSize: QueryPageSizes(state),
        search: QuerySearch(state),
        dateperiode: QueryDatePeriode(state),
        pageCount: QueryPageCount(state),
        data: QueryData(state),
        datadetail: QueryDataDetail(state),
        reducerid: QueryReducerID(state)
    }
}

export default
    requireAuth(connect(MapStateToProps, { fetchDataheader })(List))

