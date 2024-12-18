import React from "react"
import { Table, TableHeaderCell } from "semantic-ui-react"
import _ from 'lodash'
// *library imports placed above ↑
// *local imports placed below ↓

import { HeaderCol, parseDatetoString, parseNumbertoString } from "../../../utils/FormComponentsHelpler"
import { useSelector } from "react-redux"
/**
 *  ======================================
 *  @Gunadi
 * !  READ ME FIRST 
 *  1, header column can be set as link with requirement
 *      1.a Column header value contains LINKTO_
 *      1.b specified param key and value separated using @
 *  2, cell column can be set as link with requirement
 *      2.a Column Header value contains LINKD_
 *      2.b cell value contains LINKTO_
 *      2.c  specified param key and value separated using #
 * 3, header column can be merge colspan using #  
 */

const TableData = ({ content, dates, headerListener, cellListener }) => {

    const Originalval = content.content?.metaData
    const rowData = content.content?.rows
    const tanggal = new Date(dates)
    const tdate = parseDatetoString(tanggal)


    //    const allGroup = useSelector(state => )

    let val

    const Theader = () => {

        if (_.findIndex(Originalval, (x) => _.includes(x.name, 'title_')) !== -1) {

            const header = _.filter(Originalval, x => _.includes(x.name, 'title_'))



            //const rowHeader = _.omit(rowData, ()=>)


            let headerTemplate = _.filter(_.map(rowData, obj => _.omitBy(obj, (value, key) => !key.includes('title_'))),
                obj => {
                    return _.every(obj, val => val !== null);
                })

            //  console.log(titles)

            const valdata = headerTemplate[0]

            val = _.map(header, (x, xkey) => { return { name: valdata[x.name] } })


        } else {
            val = Originalval
        }


        if (_.findIndex(val, (x) => _.includes(x.name, '#')) !== -1) {
            const Headers = _.compact(_.map(val, z => { return { row1: z.name.split('#')[0], row2: z.name.split('#')[1], row3: z.name.split('#')[2], row4: z.name.split('#')[3] } }))

            const r1 = _.uniq(_.map(Headers, x => x.row1))
            const r2 = _.compact(_.uniq(_.map(Headers, x => (!_.isUndefined(x.row2) && x.row1 + '#' + x.row2))))
            const r3 = _.compact(_.uniq(_.map(Headers, x => (!_.isUndefined(x.row3) && x.row1 + '#' + x.row2 + '#' + x.row3))))


            let theader = []


            theader.push(_.map(r1, (x, y) => {


                return {
                    value: x,
                    colspan: _.size(_.filter(Headers, ['row1', x])),
                    rowspan: _.size(_.filter(Headers, ['row1', x])) === 1 ? (!_.isEmpty(r3) ? 3 : 2) : 1
                }
            }))

            theader.push(_.map(r2, x => {
                return {
                    value: x.split('#')[1],
                    colspan: _.size(_.filter(Headers, z => z.row1 + '#' + z.row2 === x)),
                    rowspan: 0
                }
            }))


            if (!_.isEmpty(r3)) {
                theader.push(_.map(r3, x => {
                    return {
                        value: x.split('#')[2],
                        colspan: _.size(_.filter(Headers, z => z.row1 + '#' + z.row2 + '#' + z.row3 === x)),
                        rowspan: 0
                    }
                }))
            }

            return <Table.Header id='header' style={{ position: 'sticky', top: '0', }}>
                {_.map(theader, (row, rkey) => <Table.Row key={`trh${rkey}`} >
                    {_.map(row, (x, xkey) => {
                        return <Table.HeaderCell singleLine key={`c${xkey}`}
                            colSpan={Number(x.colspan) < 1 ? 0 : x.colspan}
                            rowSpan={Number(x.rowspan) < 1 ? null : x.rowspan}
                            textAlign="center">{<HeaderCol source={x.value} val={tdate} _date={tanggal} listener={headerListener} />}
                        </Table.HeaderCell>
                    })
                    }
                </Table.Row>)}
            </Table.Header >
        }
        else {
            return <Table.Header id='header' style={{ position: 'sticky', top: '0', }} >
                <Table.Row >
                    {_.map(val, (x, xkey) => <Table.HeaderCell key={`c${xkey}`} singleLine textAlign="center">
                        <HeaderCol source={x.name} val={tdate} _date={tanggal} listener={headerListener} />
                    </Table.HeaderCell>)}
                </Table.Row>
            </Table.Header>
        }

    }

    const tcell = (cv, cvkey, cx, aligned) => {
        let _val, param
        let _dataval = cx[cv.name]
        let isLInk = false

        //  console.log(aligned)

        if (_.includes(_dataval, 'LINKTO')) {


            let _arrVal = _dataval.split('#')
            let _key = _arrVal[0].replace('LINKTO,', '')



            _val = _arrVal[1]

            param = {
                key: _key,
                val: _val
            }

            isLInk = true
        } else {
            _val = _dataval
        }

        const isWrapped = _.size(_val) > 30
        // console.log(cvkey, _.size(_val), isWrapped)

        const containsUnderscore = _.includes(_val, '_');

        const onlyUnderscores = /^[_]+$/.test(_val);
        let underscoreCount = 0
        if (containsUnderscore) {
            underscoreCount = _val ? _val.match(/_/g).length : 0;

        }

        let stylegroup =
            { padding: `4pt 2pt 4pt ${underscoreCount * 4}pt` }


        // console.log(_val, onlyUnderscores, underscoreCount)

        if (isWrapped) {
            return <Table.Cell
                key={`hrbc${cvkey}`}
                textAlign={cv.dbTypeName === 'NUMBER' ? 'right' : 'left'}>
                {isLInk ? <b><a href='#' onClick={() => cellListener(param, _val, content)}>{_val}</a></b> :
                    (cv.dbTypeName === 'NUMBER' ? parseNumbertoString(_val) : _val)
                }
            </Table.Cell >
        } else {
            return <Table.Cell
                style={containsUnderscore && !onlyUnderscores ? stylegroup : {}}
                singleLine
                key={`hrbc${cvkey}`}
                textAlign={(_.isUndefined(aligned) ? (cv.dbTypeName === 'NUMBER' ? 'right' : 'left') : aligned)}>
                {isLInk ?
                    <b><a href='#' onClick={() => cellListener(param, _val, content)}>{_val}</a></b> :
                    (cv.dbTypeName === 'NUMBER' ? parseNumbertoString(_val) : _.replace(_val, /_/g, "  ")/*_val.replace(/_/g, "  ")*/)
                }
            </Table.Cell >
        }

    }

    const Tbodies = () => {
        const val = content?.content?.rows

        const alignedCol = _.split(content.column_list, ';')

        //  console.log(alignedCol)

        return <Table.Body style={{}}>
            {_.map(val, (x, xkey) => {
                if (_.includes(_.values(x)[0], 'GROUP#')) {
                    return <Table.Row key={`rb${xkey}`} >
                        <TableHeaderCell
                            colSpan={_.size(_.remove(_.values(x), _v => !_.includes(_v, 'GROUP#')))}>
                            {_.split(_.values(x)[0], '#')[1]}
                        </TableHeaderCell>
                    </Table.Row>
                } else {
                    return <Table.Row key={`rb${xkey}`} >
                        {_.map(content.content.metaData, (v, vkey) => !_.includes(v.name, 'title_') && tcell(v, vkey, x, alignedCol[vkey]))}</Table.Row>
                }
            })}
        </Table.Body>
    }

    return < Table
        id={`${content?.groupid}.${content?.code}`}
        striped celled padded
        style={{ fontSize: 'smaller', marginTop: '1em' }}
        compact='very'
        size="small"
        unstackable
    >
        <Theader />
        <Tbodies />
    </Table >

}

export default TableData