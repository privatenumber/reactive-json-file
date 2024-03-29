import { Volume } from 'memfs';
import yaml from 'js-yaml';
import { openJson, closeJson } from '../src';

const sleep = (ms: number) => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

const nextTick = () => new Promise((resolve) => {
	process.nextTick(resolve);
});

const filepath = '/obj.json';
let fs = new Volume();

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

		expect(fs.readFileSync(filepath, 'utf-8')).toBe(JSON.stringify(object));
	});

	test('using default', async () => {
		const defaultObject = {
			name: 'default name',
			age: 21,
		};
		const object = openJson(filepath, {
			default: defaultObject,
			fs,
		});

		expect<typeof defaultObject>(object).toStrictEqual({
			name: 'default name',
			age: 21,
		});

		// Using default should write to disk
		expect(fs.readFileSync(filepath, 'utf-8')).toBe(JSON.stringify(object));

		object.name = 'john doe';
		object.age = 99;

		await nextTick();

		// Using default should be reactive
		expect(fs.readFileSync(filepath, 'utf-8')).toBe(JSON.stringify(object));
	});

	test('serialize/deserialize', async () => {
		const object = openJson<{
			name: string;
		}>(filepath, {
			fs,
			serialize: data => yaml.dump(data),
			deserialize: string => yaml.load(string),
		});

		object.name = 'john doe';

		await nextTick();

		expect(fs.readFileSync(filepath, 'utf-8')).toBe(yaml.dump(object));
	});

	test('closeJson', async () => {
		const object = openJson<{
			randomProp: string;
		}>(filepath, { fs });

		closeJson(object);

		object.randomProp = 'goodbye world';

		await nextTick();

		expect(() => fs.readFileSync(filepath, 'utf-8')).toThrow('no such file');
	});

	test('should not re-write same changes', async () => {
		const data = JSON.stringify({
			a: 1,
			b: {
				c: 2,
			},
		});

		fs.writeFileSync(filepath, data);

		const object = openJson(filepath, { fs });

		fs.unlinkSync(filepath);

		Object.assign(object, JSON.parse(data));

		await nextTick();

		expect(fs.existsSync(filepath)).toBe(false);
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
	}

	await nextTick();

	// First call is for serialization to track properties
	// Second call is hashing an empty default object
	expect(serialize).toHaveBeenCalledTimes(3);
});

test('throttle', async () => {
	const data = {
		deepProperty: {
			deeperProperty: 1,
		},
	};
	fs.writeFileSync(filepath, JSON.stringify(data));

	const serialize = jest.fn(JSON.stringify);
	const object = openJson<typeof data>(filepath, {
		fs,
		serialize,
		throttle: 1000,
	});

	async function change(i: number): Promise<void> {
		if (i === 0) {
			return;
		}

		object.deepProperty.deeperProperty = Math.random();
		await sleep(100);
		i -= 1;
		return await change(i);
	}

	await change(5);
	await sleep(500);

	expect(serialize).toHaveBeenCalledTimes(2);
	expect(fs.readFileSync(filepath, 'utf-8')).toBe(JSON.stringify(object));
});
