import nativeFs from 'fs';
import crypto from 'crypto';
import lodashThrottle from 'lodash.throttle';
import { observable, observe, unobserve } from '@nx-js/observer-util';
import type { FsLike, Reaction, Options } from './types';

const hash = (data: string) => crypto.createHash('sha1').update(data).digest('base64');
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

const watches = new WeakMap<object, Reaction>();

function openJson<T extends object>(
	filepath: string,
	options: Options<T> = {},
): T {
	const {
		fs = nativeFs,
		serialize = jsonSerialize,
		deserialize = jsonDeserialize,
		throttle,
		default: defaultObject,
	} = options;

	let fileHash: string | undefined;
	let writeFunction = () => {
		const data = serialize(object!);
		const hashed = hash(data);

		if (fileHash === hashed) {
			return;
		}

		fs.writeFileSync(filepath, data);
		fileHash = hashed;
	};

	if (typeof throttle === 'number') {
		writeFunction = lodashThrottle(writeFunction, throttle);
	}

	const fileContent = safeReadFile(fs, filepath);
	let object: T | undefined;
	if (fileContent === null) {
		if (defaultObject) {
			object = defaultObject;
		} else {
			object = {} as T;
			fileHash = hash(serialize(object));
		}
	} else {
		object = deserialize(fileContent);
	}

	object = observable(object);

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
