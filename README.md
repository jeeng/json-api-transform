# Transform JSON API

This module provides the ability to safely transform responses of different API requests using configuration alone.


## install
```
npm i transform-json-api
```
## usage
### `fetch(url, options, mapping, baseMapping = null)`

* `url` - The URL of the API endpoint
* `options` - A fetch options object that is compatible with [`node-fetch`](https://www.npmjs.com/package/node-fetch#fetchurl-options).
* `mapping` - A [mapping object](#mapping-object).
* `baseMapping` - An object that holds the starting point [path](#path) for the mapping. Default is "root".

### mapping object
This object holds the configurations to tranform the API response to the desired object.

1. Keys: String. represents a key name in the tranformed result. Currently dynamic key names are not supported.
2. Values, One of two options: 
  1. String. hold the [path](#path) to the desired value in the API response.
  2. Object. A [mapping operation](#mapping-operation) for array items.

#### mapping operations
This object represent a predefined complex operation of mapping.
It's structure:
```
[operation(args)]
```

* `operation` - The name of the operation
* `args` - Required argument for the operation

See also: [Supported mapping operations](mapping-operations.md)


### path
A path always start from "root" and represents the pointer to the response object.
Supported syntax:
* `.string` - e.g. `"root.key"`
* `[int]` - e.g. `"root[0]"`
* `['string']` - e.g. `"root['key']"`


## Examples
Suppose API `POST https://example.com/echo` responsds with the provided JSON body.
So this code:
```
const TransformJsonAPI = require('transform-json-api');

const url = "https://example.com/echo";
const options = {
  method: "POST",
  body: {
    data: {
      test: true,
      items: [
        {index: 1, name: "item 1"},
        {index: 2, name: "item 2"}
      ]
    }
  }
}
const mapping = {
    "item_names": "root[map(root.name)]",
}

const transorm = TransformJsonAPI.fetch(url, options, mapping, "root.data.items")
// transorm ->  ["item 1", "item 2"]
```

## format()
### `format(input:string|object, [output:string|object])`
   A simple string template function based on named or indexed arguments
   base on this [`string-template`](#https://www.npmjs.com/package/string-template) package
   
   ```
   const greeting = format("Hello {name}, you have {count} unread messages", {
       name: "Robert",
       count: 12
   })
   // greeting -> "Hello Robert, you have 12 unread messages"
   ```
   Excepts Objects as well 
 
## parameters()
### `parameters([input:string|object])`
returns keys from a string template
   
   ```javascript
   const keys = parameters("Hello {name}, you have {count} unread messages");
   // keys -> ["name", "count"]
   ```
   Alternative with multiple arguments and not just with strings
   ```javascript
   const greeting = "Hello {name}, you have {count} unread messages";
   const publishedAt = {"package_{id}": "Published at: {date}"};
   
   const [greetingKeys, publishedAtKeys] = parameters(greeting, publishedAt);
   
   // greetingKeys -> ["name", "count"]
   // publishedAtKeys -> ["id", "date"]
   ```
# License
This package is licensed under the MIT license.
