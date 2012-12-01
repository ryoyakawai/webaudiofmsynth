/** 
 * @license presetParam.js 0.1 Copyright (c) 2012, Ryoya KAWAI All Rights Reserved.
 * Available via the MIT or new BSD license.
 */

var presetParam = {
  'Flute' : {
    'tune' : new Array(1.00, 1.00, 0.00, 0.00),
    'att'  : new Array(0.20, 0.50, 0.00, 0.00),
    'rel'  : new Array(0.40, 0.20, 0.00, 0.00),
    'lev'  : new Array(0.40, 0.30, 0.00, 0.00),
    'attIntervalSec' : 5,
    'relIntervalSec' : 2
  },
  'Oboe' : {
    'tune' : new Array(1.00, 0.20, 1.00, 0.00),
    'att'  : new Array(0.20, 0.50, 0.10, 0.00),
    'rel'  : new Array(0.20, 0.20, 0.00, 0.00),
    'lev'  : new Array(0.40, 0.50, 0.20, 0.00),
    'attIntervalSec' : 5,
    'relIntervalSec' : 2
  },
  'Clalinet' : {
    'tune' : new Array(1.00, 0.40, 0.00, 0.00),
    'att'  : new Array(0.20, 0.20, 0.00, 0.00),
    'rel'  : new Array(0.20, 0.20, 0.00, 0.00),
    'lev'  : new Array(0.40, 0.50, 0.00, 0.00),
    'attIntervalSec' : 5,
    'relIntervalSec' : 2    
  },
  'Organ' : {
    'tune' : new Array(1.00, 0.60, 1.00, 0.10),
    'att'  : new Array(0.40, 0.45, 0.30, 0.30),
    'rel'  : new Array(0.20, 0.20, 0.00, 0.00),
    'lev'  : new Array(0.60, 0.70, 0.30, 0.01),
    'attIntervalSec' : 5,
    'relIntervalSec' : 2
  },
  'OverdriveGuitar' : {
    'tune' : new Array(1.00, 0.20, 0.70, 0.80),
    'att'  : new Array(0.20, 0.10, 0.80, 0.20),
    'rel'  : new Array(0.15, 0.20, 0.10, 0.20),
    'lev'  : new Array(0.40, 0.80, 0.60, 0.80),
    'attIntervalSec' : 5,
    'relIntervalSec' : 8
  },
  'FX Beam' : {
    'tune' : new Array(1.00, 1.00, 0.98, 0.00),
    'att'  : new Array(0.20, 0.05, 0.01, 0.00),
    'rel'  : new Array(0.20, 0.20, 0.20, 0.00),
    'lev'  : new Array(0.40, 0.50, 0.30, 0.00),
    'attIntervalSec' : 5,
    'relIntervalSec' : 2
  },
/*
  'test' : {
    'tune' : new Array(1.00, 0.20, 0.00, 0.00),
    'att'  : new Array(0.30, 0.20, 0.00, 0.00),
    'rel'  : new Array(0.20, 0.20, 0.00, 0.00),
    'lev'  : new Array(0.40, 0.80, 0.00, 0.00),
    'attIntervalSec' : 5,
    'relIntervalSec' : 8
  }
*/
};

var presetParams = new Array();
for(name in presetParam) {
  presetParams.push(name);
}
