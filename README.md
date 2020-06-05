# useQuery

A simple React hook and component for handling REST API calls.

Provides loading state, success state, and error states.

## useQuery(url, options, deserialize)

Requires a `url` parameter.

If `options` not supplied, defaults to an empty object. Put your `fetchOptions` here.

Argument `deserialize` is a callback that takes [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) from the fetch result. Default is `res => res.json()`.

### Usage

```js
import React, { Fragment } from "react";
import { useQuery } from '@phalt/usequery';

export const myComponent = () => {
    const [{ data, loading, error }, { refetch, reset }] = useQuery({
        url: "https://pokeapi.co/api",
        { headers: { accept: "application/json" }}
    });

    return (
        <Fragment>
            <H2>My query</h2>
            <Button onClick={refetch}>Refresh</Button>
            <Button onClick={reset}>Reset state</Button>
            { loading && <h2>Loading!</h2> }
            { error && <h2>Something went wrong!</h2> }
            { data && <h3>{data}</h3> }
        </Fragment>
    );
};

```

## POST requests

You can use the `useQuery` hook to do this if you want full control.

```js
import { useQuery } from '@phalt/usequery';

const httpOptions = {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(myData)
};

const [{ data, loading, error }, { refetch, reset }] = useQuery({
        url: "https://example.com/resource",
        httOptions
    });

```

## APIQuery component

For convenience we ship an APIQuery component:

```js
import { APIQuery } from "@phalt/usequery';

const myComponent = () => {
return (<APIQuery
    ErrorState={props => <p>{props.error}</p>}
    LoadingState={() => <p>Loading...</p>}
    SuccessState={props => <p>{props.data}</p>}
    path="https://myapi.com/api/v1/foo"
/>)
}
```

See full example of in the "uploadin JSON data" example [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
