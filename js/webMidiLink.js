/** 
 * @license webMIDILink.js 1.0.0 Copyright (c) 2012, Ryoya KAWAI All Rights Reserved.
 * Available via the MIT or new BSD license.
 */

window.addEventListener("message", webMidiLinkRecv, false);
function webMidiLinkRecv(event) {
  var msg = event.data.split(",");
  var keyNo = parseInt(msg[2], 16);
  switch (msg[0]) {
   case "midi":
    switch (parseInt(msg[1], 16) & 0xf0) {
     case 0x80:
      poly[keyNo].noteOff(keyNo);
      delete poly[keyNo];
      break;
     case 0x90:
      if (msg[3] > 0) {
        poly[keyNo] = new FmSynth(ctx);
        poly[keyNo].noteOn(keyNo, presetSelected, mainGain);
      } else {
        poly[keyNo].noteOff(keyNo);
        delete poly[keyNo];
      }
      break;
     case 0xb0:
      if (parseInt(msg[2], 16) == 0x78) {
        for(var i=0; i<128; i++) {
          if(typeof poly[i]=='object')poly[i].noteOff(i);
          delete poly[i];
        }
      }
      break;
    }
    break;
  }
}
   