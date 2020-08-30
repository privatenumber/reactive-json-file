# reactive-json-file <a href="https://npm.im/reactive-json-file"><img src="https://badgen.net/npm/v/reactive-json-file"></a> <a href="https://npm.im/reactive-json-file"><img src="https://badgen.net/npm/dm/reactive-json-file"></a> <a href="https://packagephobia.now.sh/result?p=reactive-json-file"><img src="https://packagephobia.now.sh/badge?p=reactive-json-file"></a> <a href="https://bundlephobia.com/result?p=reactive-json-file"><img src="https://badgen.net/bundlephobia/minzip/reactive-json-file"></a>

Save your JS objects to a JSON file as you mutate them

```js
import reactiveJsonFile from 'reactive-json-file'

// Create a new JSON
const object = reactiveJsonFile('./data.json')

// Mutating the object automatically saves to file
object.name = 'John Doe'

```

## :rocket: Install
```sh
npm i reactive-json-file
```


## ⚙️ Options
- `throttle` `<Number>` - Milliseconds to throttle saves by. Saves are already batched at the end of every event-loop, but this adds time-based throttling.
- `fs` `<FileSystemInterface>` ([fs](https://nodejs.org/api/fs.html)) - Pass in a custom file-system. Defaults to native Node.js fs
- `serialize`/`deserialize` `<Function>` - Functions to serialize/deserialize the object with. eg. to save output to YAML

    ```js
    import reactiveJsonFile from 'reactive-json-file'
    import yaml from 'js-yaml'

    const object = reactiveJsonFile('./file.yaml', {
    	serialize: string => yaml.dump(string),
    	deserialize: object_ => yaml.load(object_)
    })

    object.message = 'YAML!'
    ```

## 🙋‍♀️ FAQ

### How does it work?
Arbitrary new changes are detected by using Vue 3's reactive API, which uses [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) behind the scenes.
