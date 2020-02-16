# usequery

A simple React hook for making REST API calls.

Provides loading state, response data, and errors.

## usequery(url, options, deserialize)

Requires a `url` parameter.

If `options` not supplied, defaults to an empty object. Put your `fetchOptions` here.

Argument `deserialize` is a callback that takes [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) from the fetch result. Default is `res => res.json()`.


## Usage

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

## Making POST requests

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

See full example of in the "uploadin JSON data" example [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
