import nativeFs from 'fs';
import lodashThrottle from 'lodash.throttle';
import { observable, observe, unobserve } from '@nx-js/observer-util';

type FsLike = {
	readFileSync: (
		path: string,
		options?: 'utf-8',
	) => string | Buffer;

	writeFileSync: (
		path: string,
		data: string,
	) => void;
};

const jsonSerialize = (object: any) => JSON.stringify(object);
const jsonDeserialize = (string: string) => JSON.parse(string);

const safeReadFile = (
	fs: FsLike,
	filepath: string,
) => {
	try {
		return fs.readFileSync(filepath, 'utf-8').toString();
	} catch {}

	return null;
};

type Options = {
	fs?: FsLike;
	serialize?: typeof jsonSerialize;
	deserialize?: typeof jsonDeserialize;
	throttle?: number;
};

type Reaction = () => void;

const watches = new WeakMap<object, Reaction>();

function openJson<T extends object>(
	filepath: string,
): T;

function openJson<T extends object>(
	filepath: string,
	options: Options,
): T;

function openJson<T extends object>(
	filepath: string,
	defaultObject: T,
): T;

function openJson<T extends object>(
	filepath: string,
	defaultObject: T,
	options: Options,
): T;

function openJson<T extends object>(
	filepath: string,
	defaultObject?: T,
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

	const fileContent = safeReadFile(fs, filepath);
	const object = observable<T>(
		fileContent !== null
			? deserialize(fileContent)
			: defaultObject,
	);

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

export { openJson };

export function closeJson<T extends object>(
	jsonObject: T,
) {
	const observed = watches.get(jsonObject);
	if (observed) {
		unobserve(observed);
	}
}
