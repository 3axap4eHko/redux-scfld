# Redux Scaffold Generator

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]


## Install
 $ npm install -g redux-scfld

## Requirements
 - redux
 - redux-thunk

## Usage

### Convention
Redux Scaffold works with `actions`, `reducers`, initial `states` and `types` through the concept of
Redux Scaffold Entity (RSE). That's meaning all RSE grouped by RSE Namespace. 
For a every single RSE exists a single `action` and a single `type` and for every RSE Namespace exists single initial `state` and `reducer`. 
Redux Scaffold generates RSE from RSE Full Name of following format `{RSENamespace}:{RSEName}`. For example:
`recently-posts:load-page` or `recentlyPosts:loadPage` has `recentlyPost` as RSE Namespace and `loadPage` as `RSE Name`.
Through this approach will be generated `action`, `reducer`, `type` and initial `state`. 
Redux Scaffold action with parameter `type` has also parameter `status` which can be 
`STATUS_PROCESS`, `STATUS_SUCCESS` and `STATUS_FAILURE` in compare of usual behavior of Redux.

## Let's scaffold
```bash
npm install -g redux-scfld
cd ~/projects/my-project
redux init --path src/redux
``` 

Inside of `~/projects/my-project` you will find a file `.reduxrc`
``` json
{
  "useCamelCasedPaths": true,
  "actionsPath": "./src/redux/actions",
  "actionTemplatePath": "./src/redux/templates/action.dot",
  "actionsIndexTemplatePath": "./src/redux/templates/action-index.dot",
  "reducersPath": "./src/redux/reducers",
  "reducerTemplatePath": "./src/redux/templates/reducer.dot",
  "reducersIndexTemplatePath": "./src/redux/templates/reducer-index.dot",
  "typesPath": "./src/redux/types",
  "typesTemplatePath": "./src/redux/templates/types.dot",
  "statesPath": "./src/redux/states",
  "stateTemplatePath": "./src/redux/templates/state.dot",
  "statesIndexTemplatePath": "./src/redux/templates/state-index.dot"
}
```
Here `useCamelCasedPaths` affect naming behavior between `camelCase` and `dash-case`.
As template engine used `doT`.
Let's create an action, reducer, type and initial state of RSE. 
``` bash
redux add config:load config:save posts:fetchPage
```
After this command will be generated following files
```
+---src
    |
    \---redux
        |   
        +---actions
        |   |   index.js
        |   |
        |   +---config   
        |   |       load.js
        |   |       save.js
        |   \---posts
        |           fetchPage.js
        |           
        +---reducers
        |       index.js
        |       config.js
        |       posts.js
        |
        |
        +---state
        |       index.js
        |       config.js
        |       posts.js
        |
        |
        +---templates
        |       action.dot
        |       action-index.dot
        |       reducer.dot
        |       reducer-index.dot
        |       state.dot
        |       state-index.dot
        |       types.dot
        |           
        |           
        \---types
                index.js
```

#### Actions

`src/redux/actions/posts/fetchPage.js` contains
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

import configLoadAction from './config/load.js';
import configSaveAction from './config/save.js';
import postsFetchPageAction from './posts/fetchPage.js';

function _createProcess(namespace, type, ...args) { // eslint-disable-line no-underscore-dangle
    return {
        namespace,
        type,
        status: STATUS_PROCESS,
        args
    };
}
function _createSuccess(namespace, type, result) { // eslint-disable-line no-underscore-dangle
    return {
        namespace,
        type,
        status: STATUS_SUCCESS,
        result
    };
}
function _createFailure(namespace, type, error, args) { // eslint-disable-line no-underscore-dangle
    return {
        namespace,
        type,
        status: STATUS_FAILURE,
        args,
        error
    };
}

function _createAction(namespace, type, action) { // eslint-disable-line no-underscore-dangle
  return (...args) => (dispatch, getState) => {
    return dispatch(_createProcess(namespace, type, ...args))
      .then(() => action(getState, ...args))
      .then(result => dispatch(_createSuccess(namespace, type, result)))
      .catch(error => dispatch(_createFailure(namespace, type, error, args)));
  };
}

export const configLoad = _createAction(NAMESPACE_CONFIG, CONFIG_LOAD, configLoadAction);
export const configSave = _createAction(NAMESPACE_CONFIG, CONFIG_SAVE, configSaveAction);
export const postsFetchPage = _createAction(NAMESPACE_POSTS, POSTS_FETCH_PAGE, postsFetchPageAction);
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
`$ redux init --path src/redux` - Generate Redux-Scfld config file `.reduxrc` and dumps templates to `src/redux/templates`

`$ redux add <entities>` - Adds entities separated by whitespace with Action, Type and Reducer and generates their indexes

`$ redux del <entities>` - Deletes entities separated by whitespace with Action, Type and Reducer or all namespaces and generates their indexes

`$ redux config` - Display current config

`$ redux sync` - Sync indexes of Actions, Types and Reducers (does not affect already generated not indexes files)

`$ redux list` - List of entities

`$ redux namespace` - List of namespaces

`$ redux types` - List of types

`$ redux template <dir>` - Generate templates to specified directory

`$ redux --help` - Display help information

### Demo project

(Powered by redux-scfld: React-Redux demo)[https://github.com/3axap4eHko/react-redux-demo]

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2016-2018 Ivan Zakharchenko

[downloads-image]: https://img.shields.io/npm/dm/redux-scfld.svg
[npm-url]: https://www.npmjs.com/package/redux-scfld
[npm-image]: https://img.shields.io/npm/v/redux-scfld.svg

[travis-url]: https://travis-ci.org/3axap4eHko/redux-scfld
[travis-image]: https://img.shields.io/travis/3axap4eHko/redux-scfld/master.svg
