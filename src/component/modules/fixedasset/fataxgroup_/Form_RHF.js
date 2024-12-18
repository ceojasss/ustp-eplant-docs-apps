import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, connect } from "react-redux";
import { Form as FormUI, Segment } from "semantic-ui-react";
import { useForm, FormProvider } from "react-hook-form";
import _ from "lodash";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from "../../../templates/ContentHeader";
import { Appresources } from "../../../templates/ApplicationResources";
import {
  ShowLov,
  resetLov,
  DialogConfirmation,
  populateList,
} from "../../../../redux/actions";
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroup from "../../../templates/forms/ComponentAdaptersGroup";
import {
  FormDefaultValidation,
  getFormComponent,
  useYupValidationResolver,
} from "../../../../utils/FormComponentsHelpler";
import { NEWS } from "../../../Constants";
import { updateData, createData } from "./FormAction";
import "../../../Public/CSS/App.css";
import { SAVE, UPDATE } from "../../../../redux/actions/types";

const SetupBankForm = ({
  title,
  actions,
  formComps,
  initialValues,
  postdata,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loc = useLocation();
  const [validationSchema, setValidationSchema] = useState({});

  const formRefs = useRef();
  const postAction = loc.pathname.split("/").pop();

  /**
   * !validationSchema -> function untuk membuat schema validasi object form.
   */
  /* const useYupValidationResolver = validationSchema =>
        useCallback(
            async data => {
                try {
                    const values = await validationSchema.validate(data, {
                        abortEarly: false
                    });
                    return {
                        values,
                        errors: {}
                    };
                } catch (errors) {
                    console.log(errors)
                    return {
                        values: {},
                        errors: errors.inner.reduce(
                            (allErrors, currentError) => ({
                                ...allErrors,
                                [currentError.path]: {
                                    type: currentError.type ?? "validation",
                                    message: currentError.message
                                }
                            }),
                            {}
                        )
                    };
                }
            },
            [validationSchema]
        ); */

  /**
   * !initForm -> trigger untuk mengisi validasischema dengan data formcomponent
   */
  const initForm = (formComps) => {
    let _validationSchema = {};
    formComps = _.mapKeys(formComps, "key");

    for (var key of Object.keys(formComps)) {
      // !Set Validasi Default
      _validationSchema[key] = FormDefaultValidation(formComps[key]);

      // ?Validasi custom di buat dibawah ini.

      if (formComps[key].registername === "bankcode") {
        yup.addMethod(yup.string, "customvalidation", function (errorMessage) {
          return this.test(`checkbankcode`, errorMessage, function (value) {
            const { path, createError } = this;

            let errorMsg;

            if (value === "salah") {
              errorMsg = "value tidak boleh salah";
            } else if (value === "benar") {
              errorMsg = "value tidak boleh benar";
            }

            return !errorMsg || createError({ path, message: errorMsg });
          });
        });

        yup.addMethod(yup.string, "customvalidation2", function (errorMessage) {
          return this.test(`checkbankcode2`, errorMessage, function (value) {
            const { path, createError } = this;
            return (
              value !== "bener" || createError({ path, message: errorMessage })
            );
          });
        });

        _validationSchema[key] = _validationSchema[key]
          .customvalidation()
          .customvalidation2("bankcode tidak boleh bener");
      }

      if (formComps[key].registername === "creditlimit") {
        yup.addMethod(yup.number, "customlimit", function (errorMessage) {
          return this.test(`checklimit`, errorMessage, function (value) {
            const { path, createError } = this;

            let errorMsg;
            // console.log('checklimit ', value)
            if (value < getValues("totalcreditline")) {
              errorMsg = "value tidak boleh salah";
            }
            return !errorMsg || createError({ path, message: errorMsg });
          });
        });
        _validationSchema[key] = _validationSchema[key].customlimit();
      }

      if (formComps[key].registername === "totalcreditline") {
        yup.addMethod(yup.number, "calculate", function calculate() {
          return this.transform((value, originalValue) => {
            setValue(
              "overdraftlimit",
              originalValue * getValues("creditlimit")
            );
            return value;
          });
        });
        _validationSchema[key] = _validationSchema[key].calculate();
      }
    }

    setValidationSchema(yup.object().shape({ ..._validationSchema }));
  };

  useEffect(() => {
    if (_.isEmpty(formComps)) navigate("../");

    initForm(formComps);

    return () => {
      dispatch(resetLov());
    };
  }, [navigate]);

  const resolver = useYupValidationResolver(validationSchema);
  const methods = useForm({
    mode: "onBlur",
    resolver,
    defaultValues: initialValues && initialValues,
  });
  const { setValue, getValues } = methods;
  const onItemClickHandler = (lovroute, value) =>
    dispatch(
      ShowLov(
        lovroute,
        value,
        _.isNil(getValues(value)) ? "" : getValues(value)
      )
    );

  const submitHandler = () =>
    formRefs.current((rowid, object) => {
      /*
       * 1. Set post Data.
       *    Jika action UPDATE maka data ditambahkan rowid,
       * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update
       */
      let postObject =
        postAction === NEWS ? object : { ROWIDS: rowid, ...object };
      dispatch(
        DialogConfirmation(
          postAction === NEWS ? SAVE : UPDATE,
          null,
          postObject
        )
      );
    });

  const button = {
    btnLabel: Appresources.BUTTON_LABEL.LABEL_SAVE,
    btnIcon: "save",
    addClickHandler: submitHandler,
  };

  if (actions) {
    let data = [];
    data.push(postdata);

    const submiting = { formComps, data };

    //console.log(data)

    switch (actions) {
      case Appresources.BUTTON_LABEL.LABEL_SAVE:
        console.log("masuuk");
        dispatch(
          createData(submiting, (v) => {
            if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
              //    setTimeout(navigate(-1), 1000);
            }
          })
        );

        break;
      case Appresources.BUTTON_LABEL.LABEL_UPDATE:
        dispatch(
          updateData(submiting, (v) => {
            console.log(submiting);
            if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
            }
            //navigate(-1)
          })
        );
        break;
      default:
        break;
    }
  }

  const RenderForm = React.memo(() => {
    if (!formComps) return <LoadingStatus />;

    return (
      <Segment
        raised
        style={{ width: "100%", marginLeft: "10px", marginRight: "70px" }}
      >
        <FormUI as={"form"}>
          <FormProvider {...methods}>
            <ComponentAdaptersGroup
              key="0.componentgroup"
              OnClickRef={formRefs}
              {...methods}
              components={_.groupBy(formComps, "grouprowsseq")}
              itemClickHandler={onItemClickHandler}
            />
          </FormProvider>
        </FormUI>
      </Segment>
    );
  });

  return (
    <ContentHeader title={title} btn1={button} children={<RenderForm />} />
  );
};

const mapStateToProps = (state) => {
  // console.log(state)
  return {
    actions: state.auth.modals.actionpick,
    formComps: getFormComponent(state),
    postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
  };
};

export default connect(mapStateToProps, { DialogConfirmation })(SetupBankForm);
