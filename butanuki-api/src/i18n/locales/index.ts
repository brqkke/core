import * as fr from './fr.json';
import * as en from './en.json';
import { assertType, Equals } from '../../typeUtils';

type _dummy = assertType<Equals<typeof en, typeof fr>>;
const locales = { fr, en };
export { locales };
