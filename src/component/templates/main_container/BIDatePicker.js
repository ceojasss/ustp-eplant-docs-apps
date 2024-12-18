import React from "react";
import ReactDatePicker from "react-datepicker";
import { connect } from "react-redux";
import { DATEFORMAT } from "../../Constants";
import InputMask from "react-input-mask"
import { Input } from "semantic-ui-react";
import './../../Public/CSS/App.css'

function BIDatePicker({ pickedDateAction, pickedDate }) {

  // const [date, setDate] = useState(dateDefault);

  // const handleDateChange = (date) => {
  //   setDate(date)
  // }
  if (!pickedDateAction) return null;
  //// console.log(pickedDateAction)

  return (
    // <ReactDatePicker
    //   selected={_.isEmpty(pickedDateAction.value) ? dateDefault : pickedDateAction.value}
    //   value={pickedDate}
    //   dateFormat="dd/MM/yyyy"
    //   onChange={async (e) => {
    //     // // console.log(field)
    //     pickedDateAction.onchange(e);
    //     // console.log(e)
    //   }}
    //   onSelect={(e) => {
    //     pickedDateAction.onchange(e);
    //     // console.log(e)
    //   }}
    //   placeholderText="DD/MM/YYYY"
    //   maxDate={dateDefault}
    // />
    <Input size='mini' >

      <ReactDatePicker
        dateFormat={DATEFORMAT}
        // portalId="root-portal"
        //             showMonthDropdown
        // showYearDropdown
        // className={className}
        placeholderText="DD/MM/YYYY"
        //name={name}
        value={pickedDate.value}
        // popperProps={{strategy: 'fixed'}} 
        onChange={async (e) => {
          // // console.log(field)
          pickedDateAction.onchange(e)
        }}
        onSelect={e => {
          pickedDateAction.onchange(e)
        }}
        selected={pickedDateAction.value ? pickedDateAction.value : null}
        customInput={
          <InputMask mask="99/99/9999" style={{ textAlign: 'center', width: '9vw' }} />
        }
      />
    </Input>
  );
}

const mapStateToProps = (state) => {
  // const dateUnformatted = state.businessintelligence.pickedDate
  // const formattedDate = dateFormat(dateUnformatted, "isoDate")
  // const formattedDate2 = formattedDate.split("-").reverse().join("-");
  // // console.log(formattedDate2)
  // // console.log(state)
  return {
    pickedDate: state.businessintelligence.pickedDate,
  };
};

export default connect(mapStateToProps)(BIDatePicker);
