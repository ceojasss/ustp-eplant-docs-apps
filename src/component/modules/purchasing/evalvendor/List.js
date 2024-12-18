/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Dwi Adi
 |                - Baginda
 |          
 |  Description:  Evaluasi Vendor List
 |
 *===========================================================================*/

import React, { useEffect } from "react"
import { Grid } from "semantic-ui-react"
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import LoadingStatus from "../../../templates/LoadingStatus"

import { SendEmail, deleteData, fetchDataheader } from './FormAction'
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"

import reducer from "./FormReducer"
import { useNavigate, useLocation } from "react-router-dom"
import RenderTable from "../../../templates/TableDynamicNoLazy"
import { ACTIVE_PROPS, DELETE, DELETE_DATA, PROCESS, RESET_ERROR_MODAL_STATE, UPDATE } from "../../../../redux/actions/types"
import { ActionHelpers, changeReducer, getColumn, getRowData, getTitle, PrepareEditData, QueryData, QueryPageCount, QueryPageIndexes, QueryPageSizes, QueryReducerID, QuerySearch, QuerySelectedData, searchHandler } from "../../../../utils/FormComponentsHelpler"
import { ConfirmationApproved, ConfirmationApprovedWithDate, DialogConfirmation } from "../../../../redux/actions"
import { Appresources } from "../../../templates/ApplicationResources"
import { STATUS_UPDATED } from "../../../Constants"
import store from "../../../../redux/reducers"

const List = ({ data, queryPageSize, queryPageIndex, selectedValue,pageCount, search, reducerid,activeProps, crudActions, selectedData,actions }) => {
    // // console.log(data[0])
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
        }
    }

    const openModal = () => {

    }


    const rowClickHandler = async (action, row) => {
        // * reset error status
        dispatch({ type: RESET_ERROR_MODAL_STATE })

        //// console.log(row)

        switch (action) {
            case PROCESS:
                //                dispatch(DialogConfirmationOnly(APPROVE, `Approve Transaksi ${row.original.vouchercode} ?`, row))

                //                // console.log('hehehe')
                dispatch(ConfirmationApproved(`Send Email To ${row.original.vendorcode}`,  Appresources.BUTTON_LABEL.LABEL_KIRIM, row.original))
                break;
            case UPDATE:
                // * call function to prepare data
                await PrepareEditData(row)
                navigate(`./edit/${encodeURIComponent(Object.values(row.values)[0])}`)
                break;
            case DELETE:
                // * set custom delete message
                let message = `Kode Data : ${getRowData(row)} Akan Dihapus`

                dispatch(DialogConfirmation(DELETE, message, null, row))
                break;
            default:
                break;
        }

    }
    const sendEmail = async (v) => {


        await dispatch(SendEmail(v, (resp) => {
            if (resp === STATUS_UPDATED) {
                dispatch(fetchDataheader(queryPageIndex, queryPageSize, search))
            }

        }))
    }

    useEffect(() => {


        const findr = _.split(loc.pathname, '/')
        const st = store.getState()


        const checkMenu = _.find(st.auth.menu.values, ['controlsystem', findr[1]])?.childs

        dispatch({ type: ACTIVE_PROPS, payload: _.find(_.flatMap(checkMenu, x => x.childs), ['route', findr[2]]) })

    }, [activeProps])


    useEffect(() => {

        // // console.log('change reducers payment')
        // store.injectReducer(loc.pathname.replaceAll('/', ''), reducer);
        changeReducer(loc.pathname.replaceAll('/', ''), reducer)

        //  actives.activeRoute

        dispatch(fetchDataheader(queryPageIndex, queryPageSize, search))

    }, [dispatch, queryPageIndex, queryPageSize, search])

    // console.log(actions)
    useEffect(() => {
        if (actions === Appresources.BUTTON_LABEL.LABEL_KIRIM) {

            //            // console.log('data', selectedValue.rowid)
            // console.log(selectedValue)
            sendEmail(selectedValue.suppliercode)
        }
    }, [actions])

    if ((_.isEmpty(data[0]) && _.isEmpty(data[1]))
        || loc.pathname.replaceAll('/', '') != reducerid)
        return (<LoadingStatus />)

    // !handling actions state 
    if (crudActions) {

        //  // console.log('data selected', crudActions)

        switch (crudActions) {

            case Appresources.BUTTON_LABEL.LABEL_DELETE:
                dispatch(
                    deleteData(selectedData, (v) => {
                        //     // console.log(selectedData.rowid, v)
                        if (v === Appresources.TRANSACTION_ALERT.DELETE_SUCCESS)
                            dispatch({ type: DELETE_DATA, payload: { rowid: selectedData.rowid } })
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
            //   btn1={button}
            parentFunction={openModal}
            searchaction={searchHandler({ search })}>
            <RenderTable
                as={Grid.Column}
                columns={getColumn(data)}
                data={data[0]}
                Controlled={pageCount}
                queryPageIndex={queryPageIndex}
                queryPageSize={queryPageSize}
                search={search}
                onRowClick={rowClickHandler}
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
        pageCount: QueryPageCount(state),
        actions: state.auth.modals.actionpick,
        data: QueryData(state),
        selectedValue: state.auth.modals.selectedValue,
        reducerid: QueryReducerID(state),
        activeProps: state.auth.activeProps,
    }
}

export default
    requireAuth(connect(MapStateToProps, { fetchDataheader })(List))

