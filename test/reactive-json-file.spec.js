const { Volume } = require('memfs');
const yaml = require('js-yaml');
const reactiveJsonFile = require('..');

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
		const object = reactiveJsonFile(filepath, { fs });

		object.randomProp = 'hello world';

		await nextTick();

		expect(readFile(fs, filepath)).toBe(JSON.stringify(object));
	});

	test('default object', async () => {
		const object = Object.assign(reactiveJsonFile(filepath, { fs }), {
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
		const object = reactiveJsonFile(filepath, {
			fs,
			serialize: string => yaml.dump(string),
			deserialize: object_ => yaml.load(object_),
		});

		object.name = 'john doe';

		await nextTick();

		expect(readFile(fs, filepath)).toBe(yaml.dump(object));
	});
});

describe('read', () => {
	test('basic use-case', () => {
		fs.writeFileSync(filepath, JSON.stringify({
			name: 'john doe',
			gender: 'male',
		}));

		const object = reactiveJsonFile(filepath, { fs });

		expect(object).toMatchObject({
			name: 'john doe',
			gender: 'male',
		});
	});

	test('serialize/deserialize', () => {
		fs.writeFileSync(filepath, yaml.dump({
			name: 'john doe',
			gender: 'male',
		}));

		const object = reactiveJsonFile(filepath, {
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
	const object = reactiveJsonFile(filepath, {
		fs,
		serialize,
	});

	for (let i = 0; i < 10_000; i += 1) {
		object.name = `john doe ${i}`;
		object.age = Math.random();
	}

	await nextTick();

	expect(serialize).toHaveBeenCalledTimes(1);
});

test('throttle', async () => {
	const serialize = jest.fn(JSON.stringify);
	const object = reactiveJsonFile(filepath, {
		fs,
		serialize,
		throttle: 1000,
	});

	async function change(i) {
		if (i === 0) {
			return;
		}

		object.a = Math.random();
		await sleep(100);
		i -= 1;
		return change(i);
	}

	await change(5);
	await sleep(500);

	expect(serialize).toHaveBeenCalledTimes(2);
});
