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
Redux Scaffold works with `actions`, `reducers`, initial `states` and `types` through the concept of
Redux Scaffold Entity (RSE). That's meaning for a every RSE exists single `action` and `type`.
All RSE grouped by RSE Namespace and for every RSE group exists initial `state` and `reducer`. Redux Scaffold generate
RSE from RSE Full Name of following format `{RSENamespace}:{RSEName}`. For example:
`recently-posts:load-page` or `recentlyPosts:loadPage` has `recentlyPost` as RSE Namespace and `loadPage` as `RSE Name`.
Through this approach will be generated `action`, `reducer`, `type` and initial `state`. Redux Scaffold action with parameter `type`
has also parameter `status` which can be `STATUS_PROCESS`, `STATUS_SUCCESS` and `STATUS_FAILURE` in compare of usual behavior
of Redux.

### Configuration
.reduxrc
``` json
{
  "useCamelCasedPaths": true,
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
$ redux create posts:fetchPage
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
    |       index.js
    |       posts.js
    |
    |
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
            return new Promise( resolve => resolve(action(getState, ...args)) )
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
`app/reducers/posts.js` contains
``` javascript
import {
    STATUS_PROCESS,
    STATUS_SUCCESS,
    STATUS_FAILURE,
} from './../types';

export default function(state, action) {
    switch(action.status) {
        case STATUS_PROCESS:
            break;
        case STATUS_SUCCESS:
            return action.result;
        case STATUS_FAILURE:
            break;
    }
    return state;
};
```
`app/reducers/index.js` contains
``` javascript
import posts from './posts.js';
import defaultState from './../states';

const namespaceReducersMap = {

    posts

};

export default function(state = defaultState, action) {
     const { namespace } = action;
    if ( namespace in namespaceReducersMap ) {
        const prevNamespaceState = state[namespace];
        const nextNamespaceState = namespaceReducersMap[namespace](prevNamespaceState, action);
        if (typeof nextNamespaceState === 'undefined') {
            throw new Error(`State from reducer '${namespace}' cannot be undefined`);
        }
        if (prevNamespaceState !== nextNamespaceState) {
            return { ...state, [namespace]: nextNamespaceState };
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

Template files is lodash [_.template](https://lodash.com/docs#template) function with arguments entity or entities
of the following structure:
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
     reducerPath,
     statePath
};

Entities = {
     [entity.namespace]: {
         [entity.name]: entity
     }
};
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