# reactive-json-file <a href="https://npm.im/reactive-json-file"><img src="https://badgen.net/npm/v/reactive-json-file"></a>

Transparently sync JavaScript object mutations to JSON file. Great for removing "save concerns" after updating a JSON object on disk.

```js
import reactiveJsonFile from 'reactive-json-file'

// Open a JSON file
const object = reactiveJsonFile('./data.json')

// Mutating the object automatically saves to file!
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
