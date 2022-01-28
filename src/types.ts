export type FsLike = {
	readFileSync: (
		path: string,
		options?: 'utf-8',
	) => string | Buffer;

	writeFileSync: (
		path: string,
		data: string,
	) => void;
};

export type Reaction = () => void;

export type Options<T> = {
	fs?: FsLike;
	serialize?: (object: T) => string;
	deserialize?: (string: string) => any;
	throttle?: number;
	default?: T;
};
