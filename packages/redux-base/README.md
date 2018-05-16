# Redux Base

## Install

```bash
yarn add redux-base 
```

## Examples

Create action
```javascript
import createAction from 'redux-base/createAction';

import {
  NAMESPACE_APP,
  APP_LOAD,
} from './types';

export default createAction(NAMESPACE_APP, APP_LOAD, (getState, appId) => {
  return fetch(`https://service-url.com/api/v1/apps/${appId}`);
});
```

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2016-2018 Ivan Zakharchanka
