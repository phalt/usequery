// inspired by https://codesandbox.io/s/92n5zmoq2y?from-embed
import React, { useReducer, useEffect, useCallback, useMemo } from "react";
// So we can test this file, import ourself - https://github.com/facebook/jest/issues/936#issuecomment-214939935
import * as apis from "./index";

const initialState = { loading: false, data: null, error: null };

export const START = "START";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
export const STATUS_CODE_ERROR = "STATUS_CODE_ERROR";
const RESET = "RESET";

const queryReducer = (state, action) => {
  switch (action.type) {
    case START:
      return {
        ...state,
        error: null,
        loading: true
      };
    case SUCCESS:
      return {
        ...state,
        data: action.data,
        url: action.url,
        options: action.options,
        loading: false,
        error: null
      };
    case ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
        data: action.data ? action.data : null
      };
    case RESET:
      return initialState;
    default:
      throw new Error(`Received invalid action type ${action.type}`);
  }
};

const defaultOptions = { validStatusCodes: [200] };
const defaultDeserialize = res => res.json();

const fire = ({ url, dispatch, deserialize, options }) => {
  const abortController = new window.AbortController();
  dispatch({ type: START });
  let data;
  const dataPromise = (async () => {
    try {
      const res = await fetch(url, {
        ...options,
        signal: abortController.signal
      });
      data = await deserialize(res);
      if (options.validStatusCodes.indexOf(res.status) === -1) {
        throw new Error(STATUS_CODE_ERROR);
      }
      dispatch({ type: SUCCESS, data, url, options });
      return data;
    } catch (error) {
      console.log("An error occured making a query!");
      console.log(error.message);
      dispatch({ type: ERROR, error: error.message, data: data ? data : null });
    }
  })();

  return {
    dataPromise,
    abort: () => abortController.abort()
  };
};

export const useQuery = ({
  url,
  options = defaultOptions,
  deserialize = defaultDeserialize
}) => {
  const [queryState, dispatch] = useReducer(queryReducer, initialState);
  useEffect(() => {
    if (!url) {
      dispatch({ type: RESET });
      return;
    }
    const { abort } = fire({ url, dispatch, deserialize, options });
    return abort;
  }, [url, options, deserialize]);

  const refetch = useCallback(() => {
    const { dataPromise } = fire({ url, dispatch, deserialize, options });
    return dataPromise;
  }, [url, options, deserialize]);
  const reset = useCallback(() => dispatch({ type: RESET }), [dispatch]);

  const queryActions = useMemo(() => ({ refetch, reset }), [refetch, reset]);
  return [queryState, queryActions];
};

const options = {
  headers: {
    "Content-Type": "application/json"
  },
  validStatusCodes: [200]
};

export const APIQuery = props => {
  /*
  A React component that makes an API Query.
  Takes an object with the following properties:
  - path: the absolute path for the API query you want to make.
  - successState: the components to render when the query is finished. Receives API response data.
  - loadingState: the component to show when the API query is loading.
  - errorState: the component to show when the API query fails or a wrong HTTP status code is received. Receives error and any response data.
  - All State functions receive {...rest} props
  */
  const { SuccessState, LoadingState, ErrorState, path, ...rest } = props;
  const [{ data, loading, error }] = apis.useQuery({
    url: path,
    options
  });

  if (loading) {
    return <LoadingState {...rest} />;
  }
  if (error) {
    return <ErrorState {...rest} error={error} />;
  }
  if (data) {
    return <SuccessState {...rest} data={data} />;
  }
  return null;
};
