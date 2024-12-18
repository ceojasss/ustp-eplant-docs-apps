import React from 'react'
import _ from 'lodash'
import { Divider, Header, Icon, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';
import { parseDatetoString, parsingContent } from '../../utils/FormComponentsHelpler';


const Rtable = ({ theadData, tbodyData }) => {
    return (
        <>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='trash' />
                    Deleted Transaction List
                </Header>
            </Divider>
            <Table singleLine color='red' inverted size='small'>
                {/*   <TableHeader content={<Header size='simall' content="List Data Deleted" />} /> */}
                <TableHeader>
                    <TableRow>
                        {theadData.map(heading => {
                            return <TableHeaderCell key={`d.${heading[0]}`}>{heading[1]}</TableHeaderCell>
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tbodyData.map((row, index) => {

                        return <TableRow key={`del.${index}`}>
                            {theadData.map((key, index) => {
                                //        // console.log(row[key], _.values(row[key]))
                                return <TableCell
                                    key={`${index}.${key[0]}`}
                                    content={parsingContent(row[key[0]], key[2])} />
                            })}
                        </TableRow>;
                    })}
                </TableBody>
            </Table>
        </>
    );
}

const RenderDeletes = ({ data, columns }) => {


    const getHeadings = () => {
        return _.remove(_.keys(data[0]), (x, y) => {
            return y < 6
        })

        //        return _.keys(data[0]);
    }

    return (
        <div className="container">
            <Rtable theadData={columns} tbodyData={data} />
        </div>
    );
}

export default RenderDeletes
