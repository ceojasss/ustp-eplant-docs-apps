import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../templates/LoadingStatus";
import { Grid } from "semantic-ui-react";
import { useLocation } from "react-router-dom";

import reducer from "./reducers";
import {
  QueryData,
  changeReducer,
} from "../../../../../utils/FormComponentsHelpler";
import { getColumnMill } from "../../../../../utils/BIHelper";

import RenderTable from "../../../../templates/TableBI2";

const Lists = ({
  data,
  p_date,
  title = "Laporan Produksi Harian",
  reducerid,
}) => {
  const loc = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    changeReducer(loc.pathname.replaceAll("/", ""), reducer);
    dispatch(fetchData(p_date));
  }, [dispatch, p_date]);

  console.log("2. Data lph", data);

  if (_.isNull(data[0]) || _.isEmpty(data[0]) || _.isUndefined(data[0])) {
    return (
      <Grid>
        <Grid.Column>
          <div
            style={{
              marginTop: "3rem",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div style={{ zIndex: "0" }}>
              <LoadingStatus />
            </div>
            <div
              style={{ marginTop: "7rem", marginBottom: "3rem", zIndex: "1" }}
            >
              <h2>Data Hari Ini Kosong</h2>
            </div>
          </div>
        </Grid.Column>
      </Grid>
    );
  }

  console.log(getColumnMill(data, "componentlph"))

  return (
    <RenderTable
      columns={getColumnMill(data, "componentlph")}
      data={data[0]}
      title={title}
      pagination={true}
    />
  );
};

const mapStateToProps = (state) => {
  // console.log("1. State Lph", state);
  return {
    data: QueryData(state),
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);

/////////////////////////////Tab Pane\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// import { connect, useDispatch } from "react-redux";
// import { fetchData } from "./Action";
// import { useEffect, useState } from "react";
// import _ from "lodash";
// import LoadingStatus from "../../../../templates/LoadingStatus";
// import { Grid, Tab } from "semantic-ui-react";
// import { useLocation } from "react-router-dom";

// import reducer from "./reducers";
// import { QueryData, changeReducer } from "../../../../../utils/FormComponentsHelpler";
// import { getColumnMill } from "../../../../../utils/BIHelper";

// import RenderTable from "../../../../templates/TableBI2";

// const List = ({ data, p_date, title = "Laporan Produksi Harian", reducerid }) => {
//   const loc = useLocation();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     changeReducer(loc.pathname.replaceAll("/", ""), reducer);
//     dispatch(fetchData(p_date));
//   }, [dispatch, p_date]);

//   const groupClassType = 'form.group.tab';

//   const [activeIndex, setActiveIndex] = useState(0);

//   const handleTabChange = (e, { activeIndex }) => {
//     setActiveIndex(activeIndex);
//   };

//   const renderTableComponent = (groupName) => (
//     <RenderTable
//       columns={getColumnMill(data,'componentlph')}
//       data={data[0]}
//       title={title}
//       pagination={true}
//     />
//   );

//   if (_.isNull(data[0]) || _.isEmpty(data[0]) || _.isUndefined(data[0])) {
//     return (
//       <Grid>
//         <Grid.Column>
//           <div style={{ marginTop: '3rem', justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%' }}>
//             <div style={{ zIndex: '0' }}>
//               <LoadingStatus />
//             </div>
//             <div style={{ marginTop: '7rem', marginBottom: '3rem', zIndex: '1' }}>
//               <h2>Data Hari Ini Kosong</h2>
//             </div>
//           </div>
//         </Grid.Column>
//       </Grid>
//     );
//   }

//   // Anda perlu mendefinisikan variabel formComps sesuai dengan data yang diperlukan
//   const formComps = []; // Definisikan variabel formComps dengan data yang diperlukan

//   const filteredComps = _.filter(formComps, { GroupClassType: groupClassType });
//   const groupClassNames = _.map(filteredComps, 'GROUPCLASSNAME');

//   const tabPanes = groupClassNames.map((groupName) => ({
//     menuItem: groupName,
//     render: () => (
//       <Tab.Pane className="container" style={{ backgroundColor: '#A9A9A9' }}>
//         {/* Isi komponen dan kode lainnya */}
//         {renderTableComponent(groupName)}
//       </Tab.Pane>
//     ),
//   }));

//   return (
//     <Tab
//       style={{ marginTop: '-20px', overflowY: 'scroll', overflowX: 'hidden', backgroundColor: '#A9A9A9' }}
//       panes={tabPanes}
//       activeIndex={activeIndex}
//       onTabChange={handleTabChange}
//     />
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     data: QueryData(state),
//   };
// };

// export default connect(mapStateToProps, { fetchData })(List);
