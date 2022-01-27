import nativeFs from 'fs';
import lodashThrottle from 'lodash.throttle';
import { observable, observe, unobserve } from '@nx-js/observer-util';

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

type Reaction = () => void;

const watches = new WeakMap<object, Reaction>();

export function openJson<T extends object>(
	filepath: string,
	{
		fs = nativeFs,
		serialize = jsonSerialize,
		deserialize = jsonDeserialize,
		throttle,
	}: Options = {},
): T {
	let initialized = false;
	let writeFunction = () => {
		const data = serialize(object);
		if (!initialized) {
			initialized = true;
			return;
		}

		fs.writeFileSync(filepath, data);
	};

	if (typeof throttle === 'number') {
		writeFunction = lodashThrottle(writeFunction, throttle);
	}

	const object = observable<T>(deserialize(readFile(fs, filepath)));

	let latestReaction: Reaction | undefined;
	const observed = observe(writeFunction, {
		scheduler(reaction: Reaction) {
			latestReaction = reaction;

			process.nextTick(() => {
				if (latestReaction) {
					latestReaction();
					latestReaction = undefined;
				}
			});
		},
	});

	watches.set(object, observed);

	return object;
}

export function closeJson<T extends object>(
	jsonObject: T,
) {
	const observed = watches.get(jsonObject);
	if (observed) {
		unobserve(observed);
	}
}
