import eplant from "../../../../apis/eplant";
import {
  FETCH_DATAS,
  ERROR_MODAL_STATE,
  MODAL_STATE,
} from "../../../../redux/actions/types";
import { Appresources } from "../../../templates/ApplicationResources";

const ROUTES = "/fixedasset/setup/fataxgroup";
export const fetchDatas = () => async (dispatch) => {
  console.log("run fetch stock");

  const response = await eplant.get(ROUTES);

  console.log("done fetch stock");

  dispatch({ type: FETCH_DATAS, payload: response.data });
};

export const createData = (formValues, callback) => async (dispatch) => {
  let retVal;

  try {
    const response = await eplant.post(ROUTES, formValues);

    console.log(response.data);

    if (response.data.error) {
      dispatch({
        type: ERROR_MODAL_STATE,
        payload: {
          state: false,
          type: "",
          content: response.data,
          contentType: "",
          actionpick: "",
          result: Appresources.TRANSACTION_ALERT.SAVE_FAILED,
        },
      });
    } else {
      retVal = Appresources.TRANSACTION_ALERT.SAVE_SUCCESS;
      dispatch({
        type: MODAL_STATE,
        payload: {
          state: false,
          type: "",
          content: "",
          contentType: "",
          actionpick: "",
          result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS,
        },
      });
    }
  } catch (error) {
    // console.log(error.toJSON())

    dispatch({
      type: MODAL_STATE,
      payload: {
        state: false,
        type: "",
        content: { error },
        contentType: "",
        actionpick: "",
        result: Appresources.TRANSACTION_ALERT.SAVE_FAILED,
      },
    });
  } finally {
    if (callback) callback(retVal);
  }
  // programmatic navigation after create success
};

export const updateData =
  (formValues, callback) => async (dispatch, getState) => {
    let retVal;

    try {
      console.log(formValues);

      const response = await eplant.put(ROUTES, formValues);

      console.log(response.data);

      if (response.data.error) {
        dispatch({
          type: ERROR_MODAL_STATE,
          payload: {
            state: false,
            type: "",
            content: response.data,
            contentType: "",
            actionpick: "",
            result: Appresources.TRANSACTION_ALERT.SAVE_FAILED,
          },
        });
      } else {
        retVal = Appresources.TRANSACTION_ALERT.SAVE_SUCCESS;
        dispatch({
          type: MODAL_STATE,
          payload: {
            state: false,
            type: "",
            content: "",
            contentType: "",
            actionpick: "",
            result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS,
          },
        });
      }
    } catch (error) {
      // console.log(error.toJSON())

      dispatch({
        type: MODAL_STATE,
        payload: {
          state: false,
          type: "",
          content: { error },
          contentType: "",
          actionpick: "",
          result: Appresources.TRANSACTION_ALERT.SAVE_FAILED,
        },
      });
    } finally {
      if (callback) callback(retVal);
    }
    // programmatic navigation after create success
  };

export const deleteData =
  (formValues, callback) => async (dispatch, getState) => {
    let retVal;

    console.log("delete action ", formValues.rowid);

    try {
      console.log("delete process ", formValues);

      const response = await eplant.delete(
        `${ROUTES}?id=${encodeURIComponent(formValues.rowid)}`,
        formValues
      );

      console.log("delete response", response);

      if (response.data.error) {
        dispatch({
          type: ERROR_MODAL_STATE,
          payload: {
            state: false,
            type: "",
            content: response.data,
            contentType: "",
            actionpick: "",
            result: Appresources.TRANSACTION_ALERT.DELETE_FAILED,
          },
        });
      } else {
        retVal = Appresources.TRANSACTION_ALERT.DELETE_SUCCESS;
        dispatch({
          type: MODAL_STATE,
          payload: {
            state: false,
            type: "",
            content: "",
            contentType: "",
            actionpick: "",
            result: Appresources.TRANSACTION_ALERT.DELETE_SUCCESS,
          },
        });
      }
    } catch (error) {
      // console.log(error.toJSON())

      dispatch({
        type: ERROR_MODAL_STATE,
        payload: {
          state: false,
          type: "",
          content: { error },
          contentType: "",
          actionpick: "",
          result: Appresources.TRANSACTION_ALERT.DELETE_FAILED,
        },
      });
    } finally {
      if (callback) callback(retVal);
    }
    // programmatic navigation after create success
  };
