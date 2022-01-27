# reactive-json-file <a href="https://npm.im/reactive-json-file"><img src="https://badgen.net/npm/v/reactive-json-file"></a>

Sync JSON mutations to disk using reactive magic!

Great for removing saving-to-disk concerns when updating a JSON object.

```js
import { openJson } from 'reactive-json-file'

// Open a JSON file
const object = openJson('./data.json')

// No need to save changes to disk, just update the object
object.name = 'John Doe'
```

## :rocket: Install
```sh
npm i reactive-json-file
```

## ⚙️ API
### openJson(filePath, options)
Open a file (eg. JSON file) and return the object

#### Options
- `throttle` `<Number>` - Milliseconds to throttle saves by. Saves are already batched at the end of every event-loop, but this adds time-based throttling.
- `fs` `<FileSystemInterface>` ([fs](https://nodejs.org/api/fs.html)) - Pass in a custom file-system. Defaults to native Node.js fs
- `serialize`/`deserialize` `<Function>` - Functions to serialize/deserialize the object with. eg. to save output to YAML

    ```js
    import { openJson as openYaml } from 'reactive-json-file'
    import yaml from 'js-yaml'

    const object = openYaml('./file.yaml', {
        serialize: string => yaml.dump(string),
        deserialize: object => yaml.load(object)
    })

    object.message = 'YAML!'
    ```

### closeJson(object)
Close a file to disable syncing

## 🙋‍♀️ FAQ

### How does it work?
Arbitrary new changes are detected by using ES6 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) behind the scenes.
