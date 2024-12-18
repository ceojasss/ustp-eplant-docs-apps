import _ from "lodash"
import React from "react";
//import { Select } from "semantic-ui-react";
import { connect } from "react-redux";
import Select from "react-select";
//import { BISitePickerHandler } from "../../../utils/FormComponentsHelpler";

function SitePicker({ pickedSiteAction, pickedSite }) {

  const siteOptions = [
    { value: "USTP", label: "USTP" },
    { value: "SMG", label: "SMG" },
    { value: "GCM", label: "GCM" },
    { value: "SJE", label: "SJE" },
    { value: "SBE", label: "SBE" },
    { value: "SLM", label: "SLM" },
  ];

  // // console.log(siteOptions[0].value)

  if (!pickedSiteAction) return null;
  return (
    <Select
      placeholder="Select Site"
      value={pickedSite.value}
      defaultValue={{ value: pickedSite, label: pickedSite }}
      options={siteOptions}
      onChange={async (e) => {
        pickedSiteAction.onchange(e.value);
        // // console.log(e.value);
      }}
      onSelect={(e) => {
        pickedSiteAction.onchange(e.value);
        // // console.log(e.value);
      }}
      selected={_.isEmpty(pickedSiteAction.value) ? siteOptions[0].value : pickedSiteAction.value}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    pickedSite: state.businessintelligence.pickedSite,
  };
};

export default connect(mapStateToProps)(SitePicker);
