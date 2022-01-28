declare type FsLike = {
    readFileSync: (path: string, options?: 'utf-8') => string | Buffer;
    writeFileSync: (path: string, data: string) => void;
};
declare type Options<T> = {
    fs?: FsLike;
    serialize?: (object: T) => string;
    deserialize?: (string: string) => any;
    throttle?: number;
    default?: T;
};

declare function openJson<T extends object>(filepath: string, options?: Options<T>): T;

declare function closeJson<T extends object>(jsonObject: T): void;

export { closeJson, openJson };
