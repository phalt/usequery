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
import { useQuery } from 'usequery';

export const myComponent = () => {
    const [{ data, loading, error }, { refetch }] = useQuery({
        url: "https://pokeapi.co/api",
        { headers: { accept: "application/json" }}
    });

    return (
        <Fragment>
            <H2>My query</h2>
            { loading && <h2>Loading!</h2> }
            {error && <h2>Something went wrong!</h2>}
            { data && <h3>{data}</h3> }
        </Fragment>
    );
};

```
