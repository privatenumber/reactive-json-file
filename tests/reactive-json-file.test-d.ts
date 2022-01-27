import fs from 'fs';
import { expectType } from 'tsd';
import { openJson } from '../dist/index.js';

expectType<object>(openJson('filepath'));
expectType<object>(openJson('filepath', { fs }));
expectType<{ fs: number }>(openJson('filepath', { fs: 1 }));
expectType<{ a: number }>(openJson('filepath', { a: 1 }, { fs }));
