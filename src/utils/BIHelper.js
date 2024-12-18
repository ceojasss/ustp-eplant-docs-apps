import { PICKED_DATE, PICKED_SITE } from "../redux/actions/types"
import store from "../redux/reducers"
import dateFormat from "dateformat"
import _ from 'lodash'





export const BIDatePickerHandler = ( pickedDate ) => (
    {
        value: pickedDate,
        onchange: (pickedDate) => {
            store.dispatch({type: PICKED_DATE, payload: pickedDate})
        }
    }
)

export const BISitePickerHandler = ({ pickedSite }) => (
    {
        value: pickedSite,
        onchange: (pickedSite) => {
            store.dispatch({type: PICKED_SITE, payload: pickedSite})
        }
    }
)

export const BIDateFormatter = (value) => {
    const formattedDate = dateFormat(value, "isoDate");
    const formattedDate2 = formattedDate.split("-").reverse().join("-");

    return formattedDate2;
}

export const filteringTableMill = (v, group) => {
    return v === null || v === undefined ? '' : _.filter(_.filter(v, o => !_.isNull(o.tablecomponent)), { groupcomponent: group });
  };
  
  //Get Table Column Mill
  export const getColumnMill = (data, groupcomponent) => {
    // console.log(groupcomponent);
    return _.filter(
      _.filter(data[1], (o) => {
        return !_.isNull(o.tablecomponent);
      }),
      { groupcomponent }
    );
  };
  export const getTabMill = (data,groupclasstype) => {
    console.log(groupclasstype);
    return _.filter(
      _.filter(data[1], (o) => {
        return !_.isNull(o.tablecomponent);
      }),
      { groupclasstype }
    );
  };





  export const filteringTable = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
 }

 export const filtering1 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentproduksiharian' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}

export const filtering2 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentproduksibulanan' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}

export const filtering3 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentyieldbyage' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}

export const filtering4 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'componentyieldpotensi' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}
 

export const filtering5 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'actbudget' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}

export const filtering6 = (v) =>  {
    return ( v === null && v === undefined ? '' : _.filter(_.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'actpot' }) ) 
 // console.log('juuju : ', v == null && v == undefined ? '' : _.filter(v, (o) => { return !_.isNull(o.tablecomponent) }), { 'groupcomponent': 'component' })
 
}
