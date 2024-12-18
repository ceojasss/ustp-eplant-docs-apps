import _ from 'lodash'

export const miniSelect = {
  control: base => ({
    ...base,
    fontSize: 9,
    height: 27,
    minHeight: 27,
    width: 100
    // zIndex: 1001,
  }), valueContainer: (base) => ({
    ...base,
    fontSize: 9,
    marginTop: -6
  }), indicatorSeparator: (base) => ({
    ...base,
    marginBottom: 2,
    marginTop: 2,
    height: 20
  }), dropdownIndicator: (base) => ({
    ...base,
    marginTop: -6
  }),
  option: (base, { data, label }) => {
    return {
      ...base,
      width: 100,
      fontSize: 9,
      maxWidth: 100
    }
  },

};

export const selectStyles = {
  control: base => ({
    ...base,
    fontSize: 10,
    height: 27,
    minHeight: 27
    // zIndex: 1001,
  }), valueContainer: (base) => ({
    ...base,
    fontSize: 10,
    //paddingBottom: -20,
    marginTop: -3
  }), indicatorSeparator: (base) => ({
    ...base,
    marginBottom: 2,
    marginTop: 2,
    height: 20
  }), clearIndicator: (base) => ({
    ...base,
    marginTop: -5
    /* ,
    paddingBottom: 10 */
    /*     height: 10,
        minHeight: 10 */
  }), dropdownIndicator: (base) => ({
    ...base,
    marginTop: -5
    /* ,
    paddingBottom: 10 */
    /*     height: 10,
        minHeight: 10 */
  }),
  option: (base, { data, label }) => {
    return {
      ...base,
      width: _.get(label.props, 'columns') === 3 ? 355 : _.get(label.props, 'columns') === 4 ? 740 : _.get(label.props, 'columns') === 5 ? 925 : null,
      //paddingBottom: 10,
      fontSize: 9
    }
  }
};

export const navStyles = {
  control: base => ({
    ...base,
    //border: 'none',
    fontSize: 9,
    height: 27,
    minHeight: 27
    // zIndex: 1001,
  }), valueContainer: (base) => ({
    ...base,
    fontSize: 10,
    fontWeight: 'bold',
    width: 50,
    //paddingBottom: -20,
    marginTop: -6
  }), indicatorSeparator: (base) => ({
    ...base,
    marginBottom: 2,
    marginTop: 2,
    height: 20
  }), dropdownIndicator: (base) => ({
    ...base,
    marginTop: -6
  }), option: (base, { data, label }) => {
    return {
      ...base,
      width: _.get(label.props, 'columns') === 3 ? 355 : _.get(label.props, 'columns') === 4 ? 740 : _.get(label.props, 'columns') === 5 ? 925 : null,
      //paddingBottom: 10,
      fontSize: 9
    }
  }
};

export const filterHeaderStyles = {
  control: base => ({
    ...base,
    //border: 'none',
    fontSize: 10,
    height: 30,
    minHeight: 30,
    width: 250,
    // zIndex: 1001,
  }), valueContainer: (base) => ({
    ...base,
    fontSize: 11,
    fontWeight: 'bold',
    width: 70,
    //paddingBottom: -20,
    marginTop: -6
  }), indicatorSeparator: (base) => ({
    ...base,
    marginBottom: 2,
    marginTop: 2,
    height: 20
  }), dropdownIndicator: (base) => ({
    ...base,
    marginTop: -6
  }), option: (base, { data, label }) => {
    return {
      ...base,
      width: _.get(label.props, 'columns') === 3 ? 355 : _.get(label.props, 'columns') === 4 ? 740 : _.get(label.props, 'columns') === 5 ? 925 : null,
      //paddingBottom: 10,
      fontSize: 10
    }
  }
};

export const searchStyles = {

  control: base => ({
    ...base,
    fontSize: 9,
    height: 27,
    minHeight: 27
  }),
  valueContainer: (base) => ({
    ...base,
    fontSize: 9,
    marginTop: -6
  }),
  indicatorSeparator: (base) => ({
    ...base,
    marginBottom: 2,
    marginTop: 2,
    height: 20
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'red',
    marginTop: -6/* ,
    paddingBottom: 10 */
    /*     height: 10,
        minHeight: 10 */
  }),
  dropdownIndicator: (base) => ({
    ...base,
    marginTop: -6/* ,
    paddingBottom: 10 */
    /*     height: 10,
        minHeight: 10 */
  }),
  option: (base, { data, label }) => {
    return {
      ...base,
      width: _.get(label.props, 'columns') === 3 ? 555 : _.get(label.props, 'columns') === 4 ? 740 : _.get(label.props, 'columns') === 5 ? 925 : null,
      fontSize: 9
    }
  }

};

export const searchStyles2 = {

  control: base => ({
    ...base,
    height: 28,
    minHeight: 32
  }), valueContainer: (base) => ({
    ...base,
    paddingBottom: 4
  }), indicatorSeparator: (base) => ({
    ...base,
    height: 15
  }), option: (base, { data, label }) => {
    // // console.log(_.get(label.props,'columns'))
    return {
      ...base,
      // width: _.get(label.props,'columns') == 3 ? 355 : _.get(label.props,'columns') == 4 ? 740 : _.get(label.props,'columns') == 5 ? 925 :null  ,
      width: _.get(label.props, 'columns') === 3 ? 555 : _.get(label.props, 'columns') === 4 ? 740 : _.get(label.props, 'columns') === 5 ? 925 : null,
    }
  }

};


export const monthStyles = {
  control: base => ({
    ...base,
    fontSize: 8,
    height: 30,
    minHeight: 32,
    flex: 1
    // zIndex: 1001,
  }), valueContainer: (base) => ({
    ...base,
    fontSize: 12,
    paddingBottom: 4
  }), indicatorSeparator: (base) => ({
    ...base,
    height: 15
  }), dropdownIndicator: (base) => ({
    ...base,
    height: 28,
    minHeight: 38
  }), option: (base) => ({
    ...base,
    fontSize: 12
  })
};