# reactive-json <a href="https://npm.im/reactive-json"><img src="https://badgen.net/npm/v/reactive-json"></a> <a href="https://npm.im/reactive-json"><img src="https://badgen.net/npm/dm/reactive-json"></a> <a href="https://packagephobia.now.sh/result?p=reactive-json"><img src="https://packagephobia.now.sh/badge?p=reactive-json"></a> <a href="https://bundlephobia.com/result?p=reactive-json"><img src="https://badgen.net/bundlephobia/minzip/reactive-json"></a>

Save your JS objects to a JSON file as you mutate them

```js
const reactiveJson = require('reactive-json');

// Create a new JSON
const obj = reactiveJson('./data.json');

// Mutating it automatically saves to file
obj.name = 'John Doe';

```

## :rocket: Install
```sh
npm i reactive-json
```


## ⚙️ Options
- `throttle` `<Number>` - Milliseconds to throttle saves by. Saves are already batched at the end of every event-loop, but this adds time-based throttling.
- `serialize`/`deserialize` `<Function>` - Functions to serialize/deserialize the object with. eg. to save output to YAML 
- `fs` `<FileSystemInterface>` ([fs](https://nodejs.org/api/fs.html)) - Pass in a custom file-system. Defaults to native Node.js fs


## 🙋‍♀️ FAQ

### How does it work?
Arbitrary new changes are detected by using Vue 3's reactive API, which uses [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) behind the scenes.
