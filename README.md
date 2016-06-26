Redux Scaffold Generator
====================

## Install
 $ npm install -g redux-scfld

## Usage

### Configuration
.reduxrc
``` json
{
    "paths": {
        "actions": "./app/actions",
        "reducers": "./app/reducers",
        "types": "./app/types"
    },
    "defaultState": "./app/default-state"
}
```
### Action, Types and Reducer generation

``` bash
$ redux create postsFetchPage
```

+---app
    |   default-state.js
    |   store.js
    |   
    +---actions
    |   |   index.js
    |   |   
    |   \---posts
    |           fetch-page.js
    |           
    +---reducers
    |   |   index.js
    |   |   
    |   \---posts
    |           fetch-page.js
    |           
    \---types
            index.js
        

#### Action
`app/actions/posts/fetch-page.js` contains
``` javascript
export default function(getState, ...args) {
    /** Action code HERE */
}
```
#### Types
``` javascript

export const PROGRESS = 'PROGRESS';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

export const POSTS_FETCH_PAGE = 'POSTS_FETCH_PAGE';
```
#### Reducer
`app/reducers/posts/fetch-page.js` contains
``` javascript
import {
    PROGRESS,
    SUCCESS,
    FAILURE,
} from '../../types';

export default function(state = {}, action) {
    switch(action.phase) {
        case PROGRESS:
            break;
        case SUCCESS:
            break;
        case FAILURE:
            break;
    }
    return state;
};
```
### Store creation
``` javascript
import thunkMiddleware from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers';

export default function (initialState) {
    return createStore(reducers,
        initialState,
        applyMiddleware(
            thunkMiddleware
        ));
}
```

### Action dispatching
``` javascript
'use strict';
import {postsFetchPage} from './actions'
import createStore from './store'

const store = createStore();
store.dispatch(postsFetchPage());
```


## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2016 Ivan Zakharchenko