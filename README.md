# Express module for [polyfill-service](https://github.com/Financial-Times/polyfill-service)

Modification of serving API of [polyfill-service](https://polyfill.io) v2 as an express module. It uses your own server and doesn't use metrics or user statistics.

## Usage
The usage is simular to polyfill-service, but you define the route you want to request by using it as an module of express. The request-query should work as for [usage at polyfill.io](https://polyfill.io/v2/docs/usage).

javascript```
  const express = require('express');
  const app = express();
  const polyfills = require('express-polyfill-service')();

  app.get(/^\/polyfill(\.\w+)(\.\w+)?/, polyfills);
```

## License
The module is licensed under the terms of the [MIT license].

[polyfill service license]: https://github.com/Financial-Times/polyfill-service/blob/master/LICENSE.md
[polyfill service MIT license]: https://github.com/Financial-Times/polyfill-service/blob/master/LICENSE.md
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[polyfill-service]: https://polyfill.io
[usage]: https://polyfill.io/v2/docs/usage
