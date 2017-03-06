/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const _ = require('lodash');

module.exports = function($q) {

  this.dots = null;

  const fmapDot = (i, f) => {
    const maybeDot = _.get(this.dots, i);

    if (maybeDot !== null) f(maybeDot);
  };

  this.withDotColor = (i, f) => {
    fmapDot(i, (dot) => {
      dot.style.fill = f(dot.style.fill);
    });
  };

  this.setDotColor = (i, color) => {
    return this.withDotColor(i, _.constant(color));
  };

  this.blankDot = (i) => {
    this.setDotColor(i, null);
  };

};