import { connect, useDispatch } from "react-redux";
import { fetchDataHeader, fetchDataDetail } from "./Action";
import { useEffect, useState } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";

import { Grid, Button, Breadcrumb } from "semantic-ui-react";
import {filteringTableMill} from "../../../../../../utils/BIHelper";

import RenderTable from "../../../../../templates/TableBI3";

const Lists = ({dataheader,datadetail,p_year,p_site,title = "Biaya Perawatan",}) => {

  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [breadcrumbTrail, setBreadcrumbTrail] = useState([]);


  useEffect(() => {
    dispatch(fetchDataHeader(p_year, p_site));
  }, [dispatch, p_year, p_site]);

  useEffect(() => {
    if (dataheader && dataheader.component) {
      const filteredColumns = filteringTableMill(dataheader.component,"componentbiayarawat");
      setColumns(filteredColumns);
    }
  }, [dataheader]);

  const handleCellClick = (rowIndex, columnIndex) => {
    if (showDetail) {
      // Jika sudah menampilkan detail, tambahkan breadcrumb baru ke breadcrumbTrail
      setBreadcrumbTrail(prevTrail => [
        ...prevTrail,
        { column: "Detail Biaya Perawatan" }
      ]);
    } else {
      // Jika belum menampilkan detail, set breadcrumbTrail menjadi awal (kosong)
      setBreadcrumbTrail([]);
    }
  
    // Panggil dispatch untuk mendapatkan data detail
    dispatch(fetchDataDetail(p_year, p_site));
  
    // Toggle showDetail menjadi true
    setShowDetail(true);
  };
  

  useEffect(() => {
    if (datadetail && datadetail.component) {
      const filteredColumns = filteringTableMill(
        datadetail.component,"componentdetailrawat");
        setShowDetail(filteredColumns);}
  },[datadetail]);

   console.log('detail',datadetail);
  if (_.isNull(dataheader) || _.isEmpty(dataheader) || _.isUndefined(dataheader)) {
    return (
      <Grid>
        <Grid.Column>
          <div
            style={{ padding: "2rem", margin: "10px", display: "flex", height: "100%" }}
          >
            <LoadingStatus />
          </div>
        </Grid.Column>
      </Grid>
    );
  }

  const breadcrumbStyle = {
    // background: 'gainsboro',
    color: "black",
    fontSize: "18px",
    textDecoration: "underline",
  };

  return (
    <Grid>
      <Grid.Column>
      <Breadcrumb>
  <Breadcrumb.Section
    link
    onClick={() => {
      setShowDetail(false);
      setBreadcrumbTrail([]);
    }}
    style={breadcrumbStyle}
  >
    {title}
  </Breadcrumb.Section>
  <Breadcrumb.Divider icon="right angle" />
  {breadcrumbTrail.map((breadcrumb, index) => (
    <Breadcrumb.Section key={index}>{breadcrumb.column}</Breadcrumb.Section>
  ))}
</Breadcrumb>
        <RenderTable
          columns={columns}
          data={showDetail ? datadetail.data : dataheader.data}
          pagination={true}
          onCellClick={(rowIndex, columnIndex) => handleCellClick(rowIndex, columnIndex)}
        />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  console.log("Mps",state);
  return {
    dataheader: state.businessintelligence.fetchbiayarawat,
    datadetail: state.businessintelligence.fetchbiayarawatdetail,
  };
};

export default connect(mapStateToProps, { fetchDataHeader, fetchDataDetail })(Lists);
