/**
 * Scripting Host for CCL
 * @license MIT
 * @description Entry point of the scripting host (dist/scripting/Host.js).
 *    Bundles the host engine together with the DOM unpackers.
 **/
import { CCLScripting } from './Host';
import './Unpacker';

export default CCLScripting;
