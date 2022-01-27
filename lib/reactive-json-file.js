const { reactive, watch } = require('vue');
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
	// eslint-disable-next-line node/global-require
	fs = require('fs'),
	serialize = jsonSerialize,
	deserialize = jsonDeserialize,
	throttle,
} = {}) {
	let writeFunction = () => fs.writeFileSync(filepath, serialize(object));
	if (typeof throttle === 'number') {
		writeFunction = _throttle(writeFunction, throttle);
	}

	const object = reactive(deserialize(readFile(fs, filepath)));
	watch(
		() => object,
		writeFunction,
		{ deep: true },
	);

	return object;
}

module.exports = reactiveJson;
