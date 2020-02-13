// inspired by https://codesandbox.io/s/92n5zmoq2y?from-embed
import {useReducer, useEffect, useCallback, useMemo } from "react";

const initialState = { loading: false, data: null, error: null };

const START = "START";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const RESET = "RESET";

const queryReducer = (state, action) => {
    switch(action.type){
        case START:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case SUCCESS:
            return {
                ...state,
                data: action.data,
                loading: false,
                error: null
            };
        case ERROR:
            return {
                ...state,
                error: action.error,
                loading: false
            };
        case RESET:
            return initialState;
        default:
            throw new Error(`Received invalid action type ${action.type}`);
    }
};

const defaultOptions = {};
const defaultDeserialize = res => res.json();

const fire = ({url, dispatch, deserialize, options}) => {
    const abortController = new window.AbortController();
    dispatch({ type: START });
    const dataPromise = (async() => {
        try {
            const res = await fetch(url, {...options, signal: abortController.signal});
            const data = await deserialize(res);
            return data;
        } catch (error) {
            if (error.name !== "AbortError") { dispatch({ type: ERROR, error })};
        }
    })();

    return {
        dataPromise,
        abort: () => abortController.abort()
    }
};

export const useQuery = ({url, options = defaultOptions, deserialize = defaultDeserialize}) => {
    const [queryState, dispatch] = useReducer(queryReducer, initialState);
    useEffect(
        () => {
            if(!url){
                dispatch({ type: RESET })
            }
            const { abort } = fire({url, dispatch, deserialize, options});
            return abort;
        }, [url, options, deserialize]);

    const refetch = useCallback(() => {
        const { dataPromise } = fire({url, dispatch, deserialize, options});
        return dataPromise;
    }, [url, options, deserialize]);
    const reset = useCallback(() => dispatch({ type: RESET }), [dispatch]);

    const queryActions = useMemo(() => ({refetch, reset}), [refetch, reset]);
    return [queryState, queryActions];
};
