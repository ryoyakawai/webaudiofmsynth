var ctx = new webkitAudioContext();
var poly = new Array(128);
var mainGain = ctx.createGainNode();
mainGain.connect( ctx.destination );
mainGain.gain.value=0.8;
var presetSelected = presetParams[0];
var lcd = new CanvasLCD('01');
var presetNo = 0;

function noteOnFunc(keyNo) {
  if(lcd.systemReady==true) {
    poly[keyNo] = new FmSynth(ctx);
    poly[keyNo].noteOn(keyNo, presetSelected, mainGain);
  }
  //poly[keyNo].noteOn(keyNo, 'oboe', mainGain);
}
function noteOffFunc(keyNo) {
  if(lcd.systemReady==true && typeof poly[keyNo] == 'object') {
    poly[keyNo].noteOff(keyNo);
    delete poly[keyNo];
  }
}

function setVolume(val) {
  if(lcd.systemReady==true) mainGain.gain.value=val;
}

$(document).ready(function(){
  canvasKenban(noteOnFunc, noteOffFunc);
  presetSelected = presetParams[presetNo];
  lcd.init('canvasLCD', 'Web Audio FM Synth' + ("0" + presetNo).slice(-2) + ':' + presetParams[presetNo], true);

  // set presetParam
  /*
  for(var i=0; i<presetParams.length; i++) {
    $('select.presetParam').append('<option value="' + presetParams[i] + '">' + presetParams[i] + '</option>');
  }
  $('select.presetParam').bind('change', function() {
    $('select.presetParam option:selected').val();
    presetSelected = $('select.presetParam option:selected').val();
  });
  */
  $('div.programDown').mouseover(function(){
    if(lcd.systemReady==true) {
      $(this).css('background-color', '#40E0D0');
      $('div.programLeft').css('border-right-color', '#808080');
    }
    $(this).mousedown(function(){
      $('div.programLeft').css('border-right-color', '#000000');
    });
    $(this).mouseup(function(){
      $('div.programLeft').css('border-right-color', '#808080');
    });
    
    $(this).click(function(event){
      if(presetNo==0) {
        presetNo=presetParams.length-1;
      } else {
        presetNo--;
      }
      if(lcd.systemReady==true) {
        presetSelected = presetParams[presetNo];
        lcd.write2Display('init', 'SPACE', false);
        lcd.write2Display('letters', 'Web Audio FM Synth' + ("0" + presetNo).slice(-2) + ':' + presetParams[presetNo], false );
      }
      event.stopImmediatePropagation();
    });
  }).bind('mouseout', function() {
    $(this).css('background-color', '#20B2AA');
    $('div.programLeft').css('border-right-color', '#555');
  });

  $('div.programUp').mouseover(function(){
    if(lcd.systemReady==true) {
      $(this).css('background-color', '#40E0D0');
      $('div.programRight').css('border-left-color', '#808080');
    }
    $(this).mousedown(function(){
      $('div.programRight').css('border-left-color', '#000000');
    });
    $(this).mouseup(function(){
      $('div.programRight').css('border-left-color', '#808080');
    });
    $(this).click(function(event){
      if(presetNo==presetParams.length-1) {
        presetNo=0;
      } else {
        presetNo++;
      }
      if(lcd.systemReady==true) {
        presetSelected = presetParams[presetNo];
        lcd.write2Display('init', 'SPACE', false);
        lcd.write2Display('letters', 'Web Audio FM Synth' + ("0" + presetNo).slice(-2) + ':' + presetParams[presetNo], false);
      }
      event.stopImmediatePropagation();
    });
  }).bind('mouseout', function() {
    $(this).css('background-color', '#20B2AA');
    $('div.programRight').css('border-left-color', '#555');
  });

});
  
