Redux Scaffold Generator
====================

**DISCLAIMER** this package is under development and api or templates may be changed

## Install
 $ npm install -g redux-scfld

#### Generated project required dependencies
 - redux
 - redux-thunk

## Usage

### Convention

Redux Scaffold Entity name format `{namespace}{ActionName}` where
`{namespace}` should be a **lowercased** noun and {ActionName} should be **PascalCased** starts with verb.
For example: `postsFetchPage`, `postsFetchFilter`, `postCreate` etc.

### Configuration
.reduxrc
``` json
{
  "actionsPath": "./app/actions",
  "actionTemplatePath": "./node_modules/redux-scfld/dist/templates/action.jst",
  "actionsIndexTemplatePath": "./node_modules/redux-scfld/dist/templates/action-index.jst",
  "reducersPath": "./app/reducers",
  "reducerTemplatePath": "./node_modules/redux-scfld/dist/templates/reducer.jst",
  "reducersIndexTemplatePath": "./node_modules/redux-scfld/dist/templates/reducer-index.jst",
  "typesPath": "./app/types",
  "typesTemplatePath": "./node_modules/redux-scfld/dist/templates/types.jst",
  "statesPath": "./app/states",
  "stateTemplatePath": "./node_modules/redux-scfld/dist/templates/state.jst",
  "statesIndexTemplatePath": "./node_modules/redux-scfld/dist/templates/state-index.jst"
}
```
### Action, Types and Reducer generation

``` bash
$ redux create postsFetchPage
```
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
    +---state
    |       index.js
    |       posts.js
    |
    \---types
            index.js
```

#### Actions

`app/actions/posts/fetch-page.js` contains
``` javascript
export default function(getState, ...args) {
    /** Action code HERE */
}
```

`app/actions/index.js` contains
``` javascript
import {
    STATUS_PROCESS,
    STATUS_SUCCESS,
    STATUS_FAILURE,
    // Namespaces
    NAMESPACE_POSTS,
    // Types
    POSTS_FETCH_PAGE
} from './../types';

import postsFetchPageAction from './posts/fetch-page.js';

function _createProcess(namespace, type, ...args) {
    return {
        namespace,
        type,
        status: STATUS_PROCESS,
        args
    };
}
function _createSuccess(namespace, type, result) {
    return {
        namespace,
        type,
        status: STATUS_SUCCESS,
        result
    };
}
function _createFailure(namespace, type, error, args) {
    return {
        namespace,
        type,
        status: STATUS_FAILURE,
        args,
        error
    };
}

function _createAction(namespace, type, action) {
    return (...args) => {
        return (dispatch, getState) => {
            dispatch(_createProcess(namespace, type, ...args));
            return Promise.resolve(action(getState, ...args))
                .then(result => dispatch(_createSuccess(namespace, type, result)))
                .catch(error => dispatch(_createFailure(namespace, type, error, args)));
        }
    }
}

export const testFailure = _createAction(NAMESPACE_POSTS, POSTS_FETCH_PAGE, postsFetchPageAction);
```

**IMPORTANT**: Instead of original Redux actions, Redux Scaffold Actions has only one `type`, but one `namespace` and 3 `statuses`: `STATUS_PROCESS`, `STATUS_SUCCESS`, `STATUS_FAILURE`

**IMPORTANT**: You should avoid editing of generated index files. See templates generation

#### Types
``` javascript
// Statuses
export const STATUS_PROCESS = 'STATUS_PROCESS';
export const STATUS_SUCCESS = 'STATUS_SUCCESS';
export const STATUS_FAILURE = 'STATUS_FAILURE';

// Generated Namespaces
export const NAMESPACE_TEST = 'test';

export const NAMESPACES = [
    NAMESPACE_TEST
];
// Generated types
export const POSTS_FETCH_PAGE = 'POSTS_FETCH_PAGE';
```
#### Reducer
`app/reducers/posts/fetch-page.js` contains
``` javascript
import {
    STATUS_PROCESS,
    STATUS_SUCCESS,
    STATUS_FAILURE,
} from './../../types';

import defaultState from './../../states/posts';

export default function(state = defaultState, action) {
    switch(action.status) {
        case STATUS_PROCESS:
            break;
        case STATUS_SUCCESS:
            break;
        case STATUS_FAILURE:
            break;
    }
    return state;
};
```
`app/reducers/index.js` contains
``` javascript
import postsFetchPage from './posts/fetch-page.js';

const namespaceReducersMap = {

    posts: {
        POSTS_FETCH_PAGE: postsFetchPage,
    },

};

export default function(state = {}, action) {
    const {namespace, type} = action;
    if ( state && namespace in namespaceReducersMap ) {
        const prevNamespaceState = state[namespace];
        if ( type in namespaceReducersMap[namespace] ) {
            const nextNamespaceState = namespaceReducersMap[namespace][type](prevNamespaceState, action);
            if (typeof nextNamespaceState === 'undefined') {
                throw new Error(`State from ${namespace}.${type} cannot be undefined`);
            }
            if (prevNamespaceState !== nextNamespaceState) {
                return { ...state, [namespace]: nextNamespaceState };
            }
        } else {
            throw new Error(`Entity ${namespace}.${type} not defined`);
        }
    }
    return state;
};
```
**IMPORTANT**: You should avoid editing of generated index files. See templates generation

#### State

State is represented by separate files for each namespace and will be generated automatically for each namespace.


### Store creation
Create file `/app/store.js`
``` javascript
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

export default function () {
    return createStore(reducers, applyMiddleware(thunkMiddleware));
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

### Templates
.reduxrc
``` json
{
  "actionsPath": "./app/actions",
  "actionTemplatePath": "./app/templates/action.jst",
  "actionsIndexTemplatePath": "./app/templates/action-index.jst",
  "reducersPath": "./app/reducers",
  "reducerTemplatePath": "./app/templates/reducer.jst",
  "reducersIndexTemplatePath": "./app/templates/reducer-index.jst",
  "typesPath": "./app/types",
  "typesTemplatePath": "./app/templates/types.jst",
  "statesPath": "./app/states",
  "stateTemplatePath": "./app/templates/state.jst",
  "statesIndexTemplatePath": "./app/templates/state-index.jst"
}
```

template files is lodash [_.template](https://lodash.com/docs#template) function with arguments entity or entities.

Entity interface
``` javascript
Entity = {
    namespace,
    NAMESPACE,
    fullName,
    FullName,
    name,
    Name,
    TYPE,
    filename,
    path,
    actionFolder,
    actionPath,
    reducerFolder,
    reducerPath,
    statePath
}
```

Entities interface
``` javascript
Entities = {
    [entity.namespace]: {
        [entity.name]: entity
    }
}
```

### Commands
`$ redux config` - generates default config file `.reduxrc`

`$ redux create` - creates Action, Type and Reducer and generates their indexes

`$ redux update` - regenerate indexes of Actions, Types and Reducers (does not affect already generated not indexes files)

`$ redux ls` - displays list of entities

`$ redux ns` - displays list of namespaces

`$ redux types` - displays list of types

`$ redux help` - display help page

### Demo project

(Powered by redux-scfld: React-Redux demo)[https://github.com/3axap4eHko/react-redux-demo]

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2016 Ivan Zakharchenko