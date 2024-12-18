import {
  Table
} from "semantic-ui-react";
import styled, {
  css
} from "styled-components";

function createCSS(props) {
  let styles = '';
  // for (let i = 0; i < 1; i += 1) {
  //  styles += `
  //  td:first-child, th:first-child {
  //   position: sticky;
  // left: ${props.index};
  // background: white;
  // }

  // td:last-child, th:last-child {
  //   position:sticky;
  //   right:${props.index};
  //   background-color:white;
  // }
  // th:first-child,  th:nth-child(2), th:last-child {z-index:2;}
  //  `
  let a = 0
  //  for (let i = 0; i < props.index2; i += 1) {
  // overflowY: 'scroll',
  // display: 'block', /*paddingLeft: '0.5cm',*/ paddingRight: '1.5cm', maxHeight: '550px', width: '75vw', paddingBottom: '5px'

  styles += `
     margin-left: 2vw!important;
     margin-right: 2vw!important;
     display:block;
     overFlow-Y:scroll;
     max-height: 550px;
     padding-bottom: 5px; 
      tbody tr .tdsticky:nth-child(1),
      tbody tr .tdsticky:nth-child(${props.index2}),
  thead tr .thsticky:nth-child(1),
  thead tr .thsticky:nth-child(${props.index2}){
    position: sticky;
    left: ${props.index};
    background: white;
    
  }
  thead tr .thsticky:nth-child(${props.index2}),
  tbody  tr td:nth-child(${props.index2}){
    left: ${props.widths};
  }
  .tdsticky:last-child, .thsticky:last-child {
      position:sticky;
      right:${props.index};
      background-color:white;
    }
  @media screen and (min-width: 1240px) {
      width:75vw !important;
    }
    @media screen and (min-width: 1366px) {
      width:72vw !important;
    }
    @media screen and (min-width: 1440px) {
      width:69vw !important;
    }
    @media screen and (min-width: 1920px) {
      width:59% !important;
    }
    /*@media screen and (min-width: 1441px) {
      width:82vw !important;
    }
       @media screen and (min-width: 1240px) {
      width:100vw !important;
    } */`

  return css `${styles}`;
}
export const StylesTable = styled(Table)
`
${props => createCSS(props)}
    `;


//   styles +=`
//   td:first-child, th:first-child {
//    position: sticky;
//  left: ${props.index};
//  background: white;
//  }

//  td:last-child, th:last-child {
//    position:sticky;
//    right:${props.index};
//    background-color:white;
//  }
//  th:first-child,  th:nth-child(${i+1}), th:last-child {z-index:2;}
//   td:nth-child(${i+1}), th:nth-child(${i+1}) {
//    position: sticky;
//    left:${61}px;
//  background: white;
//  } `

// td:first-child, th:first-child {
//   position: sticky;
// left: ${props => props.index};
// background: white;
// }
// ${props=> 
//   props.index2 === 3 
// }
// td:nth-child(${props => props.index2}), th:nth-child(${props => props.index2}) {
//     position: sticky;
//     left:61px;
//   background: white;
//   }
// td:last-child, th:last-child {
//   position:sticky;
//   right:${props => props.index};
//   background-color:white;
// }
// th:first-child,  th:nth-child(2), th:last-child {z-index:2;}
//export default StylesTable;