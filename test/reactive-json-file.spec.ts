import { Volume } from 'memfs';
import yaml from 'js-yaml';
import { openJson, closeJson } from '../src';

const sleep = ms => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

const nextTick = () => new Promise((resolve) => {
	process.nextTick(resolve);
});
const readFile = (fs, filepath) => fs.readFileSync(filepath).toString();

const filepath = '/obj.json';
let fs;

beforeEach(() => {
	fs = new Volume();
});

describe('write', () => {
	test('basic use-case', async () => {
		const object = openJson<{
			randomProp: string;
		}>(filepath, { fs });

		object.randomProp = 'hello world';

		await nextTick();

		expect(readFile(fs, filepath)).toBe(JSON.stringify(object));
	});

	test('default object', async () => {
		const object = Object.assign(openJson(filepath, { fs }), {
			name: 'default name',
			age: 21,
		});

		expect(object.name).toBe('default name');
		expect(object.age).toBe(21);

		object.name = 'john doe';
		object.age = 99;

		await nextTick();

		expect(readFile(fs, filepath)).toBe(JSON.stringify(object));
	});

	test('serialize/deserialize', async () => {
		const object = openJson<{
			name: string;
		}>(filepath, {
			fs,
			serialize: string => yaml.dump(string),
			deserialize: object_ => yaml.load(object_),
		});

		object.name = 'john doe';

		await nextTick();

		expect(readFile(fs, filepath)).toBe(yaml.dump(object));
	});

	test('closeJson', async () => {
		const object = openJson<{
			randomProp: string;
		}>(filepath, { fs });

		closeJson(object);

		object.randomProp = 'goodbye world';

		await nextTick();

		expect(() => readFile(fs, filepath)).toThrow('no such file');
	});
});

describe('read', () => {
	test('basic use-case', () => {
		fs.writeFileSync(filepath, JSON.stringify({
			name: 'john doe',
			gender: 'male',
			deepProperty: {
				deeperProperty: 1,
			},
		}));

		const object = openJson<{
			deepProperty: {
				deeperProperty: number;
			};
		}>(filepath, { fs });

		// Deep write
		object.deepProperty.deeperProperty = 2;

		expect(object).toMatchObject({
			name: 'john doe',
			gender: 'male',
			deepProperty: {
				deeperProperty: 2,
			},
		});
	});

	test('serialize/deserialize', () => {
		fs.writeFileSync(filepath, yaml.dump({
			name: 'john doe',
			gender: 'male',
		}));

		const object = openJson(filepath, {
			fs,
			serialize: string => yaml.dump(string),
			deserialize: object_ => yaml.load(object_),
		});

		expect(object).toMatchObject({
			name: 'john doe',
			gender: 'male',
		});
	});
});

test('only call once', async () => {
	const serialize = jest.fn(JSON.stringify);
	const object = openJson<{
		name: string;
		age: number;
	}>(filepath, {
		fs,
		serialize,
	});

	for (let i = 0; i < 1000; i += 1) {
		object.name = `john doe ${i}`;
		object.age = Math.random();
		object[i] = true;
	}

	await nextTick();

	// First call is for serialization to track properties
	expect(serialize).toHaveBeenCalledTimes(2);
});

test('throttle', async () => {
	const object = {
		deepProperty: {
			deeperProperty: 1,
		},
	} as const;
	fs.writeFileSync(filepath, JSON.stringify(object));

	const serialize = jest.fn(JSON.stringify);
	const object = openJson<typeof object>(filepath, {
		fs,
		serialize,
		throttle: 1000,
	});

	async function change(i) {
		if (i === 0) {
			return;
		}

		const random = Math.random();
		object.deepProperty[random] = Math.random();
		await sleep(100);
		i -= 1;
		return await change(i);
	}

	await change(5);
	await sleep(500);

	expect(serialize).toHaveBeenCalledTimes(2);
	expect(readFile(fs, filepath)).toBe(JSON.stringify(object));
});
