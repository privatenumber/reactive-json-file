const {reactive, watch} = require('vue');

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
} = {}) {
	const object = reactive(deserialize(readFile(fs, filepath)));

	watch(
		() => object,
		() => fs.writeFileSync(filepath, serialize(object)),
		{deep: true},
	);

	return object;
}

module.exports = reactiveJson;
