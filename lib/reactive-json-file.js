const {reactive, watch} = require('vue');
const _throttle = require('lodash.throttle');

const readFile = (fs, filepath) => {
	try {
		return fs.readFileSync(filepath);
	} catch {}

	return '{}';
};

const jsonSerialize = object => JSON.stringify(object);
const jsonDeserialize = string => JSON.parse(string);

function reactiveJson(filepath, {
	fs = require('fs'),
	serialize = jsonSerialize,
	deserialize = jsonDeserialize,
	throttle = undefined,
} = {}) {
	let writeFn = () => fs.writeFileSync(filepath, serialize(object));
	if (typeof throttle === 'number') {
		writeFn = _throttle(writeFn, throttle);
	}

	const object = reactive(deserialize(readFile(fs, filepath)));
	watch(
		() => object,
		writeFn,
		{deep: true},
	);

	return object;
}

module.exports = reactiveJson;
