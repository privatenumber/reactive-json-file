import nativeFs from 'fs';
import { reactive, watch } from 'vue';
import lodashThrottle from 'lodash.throttle';

type Fs = typeof nativeFs;

const readFile = (
	fs: Fs,
	filepath: string,
) => {
	try {
		return fs.readFileSync(filepath, 'utf-8');
	} catch {}

	return '{}';
};

const jsonSerialize = (object: any) => JSON.stringify(object);
const jsonDeserialize = (string: string) => JSON.parse(string);

type Options = {
	fs?: Fs;
	serialize?: typeof jsonSerialize;
	deserialize?: typeof jsonDeserialize;
	throttle?: number;
};
function reactiveJson<T extends object>(
	filepath: string,
	{
		fs = nativeFs,
		serialize = jsonSerialize,
		deserialize = jsonDeserialize,
		throttle,
	}: Options = {},
): T {
	let writeFunction = () => fs.writeFileSync(filepath, serialize(object));

	if (typeof throttle === 'number') {
		writeFunction = lodashThrottle(writeFunction, throttle);
	}

	const object = reactive(deserialize(readFile(fs, filepath)));
	watch(
		() => object,
		writeFunction,
		{ deep: true },
	);

	return object;
}

export = reactiveJson;
