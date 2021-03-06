/** Copyright (c) 2018 Eduardo Moura, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import {Plugin} from './passport';

declare var __BROWSER__: Boolean;

export {UserStoreToken, PassportConfigToken} from './passport';

export default (!__BROWSER__ ? Plugin : null);
