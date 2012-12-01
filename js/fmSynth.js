/** 
 * @license fmSynth.js 0.1 Copyright (c) 2012, Ryoya KAWAI All Rights Reserved.
 * Available via the MIT or new BSD license.
 */

var FmSynth = function(ctx) {
  var actx = ctx;
  
  var poly = new Array(128);
  var noteOnFlag = false;
  var oscType  = new Array(0, 0, 0, 0); // 0:SINE, 1:SQUARE, 2:SAWTOOTH, 3:TRIANGE, 4:CUSTOM
  var numOsc = (oscType.length);
  var freq = 440; //440 880
  var gain = new Array(numOsc);
  var osc  = new Array(numOsc);
  var aratio = new Array(numOsc);
  var rratio = new Array(numOsc);
  var opGraph = new Array(numOsc);
  var opCtx   = new Array(numOsc);
  var opFreq  = new Array(numOsc);
  var opFreqCtx = new Array(numOsc);
  var tune   = new Array(1.00, 1.00, 0.00, 0.00); // (0.50, 0.80, 0.20, 0.90)
  var att    = new Array(0.20, 0.50, 0.00, 0.00); // (0.80, 0.70, 1.20, 5.00)
  var rel    = new Array(0.20, 0.20, 0.00, 0.00); // (0.50, 0.50, 0.60, 0.50)
  var lev    = new Array(0.50, 0.50, 0.00, 0.00); // (0.35, 0.70, 0.50, 0.15)

  var attIntervalSec = 5;
  var relIntervalSec = 2;
  
  var curlev = new Array(0.00, 0.00, 0.00, 0.30); // (0.00, 0.00, 0.00, 0.30)
  var vRate  = new Array(0.80, 0.50, 0.50, 0.50); // canvas
  var flag   = 'A';
  var j=0;

  var attr   = new Array(0.00, 0.00, 0.20, 0.80); // (0.20, 0.20, 0.20, 0.80) // 使ってない
  
  // create frequency
  var r = Math.pow( 2.0, 1.0 / 12.0 );
  var noteDefMIDI = new Array(128);
  noteDefMIDI[69] = 440 ;
  for ( var i = 70; i <= 127; i++ ) noteDefMIDI[i] = noteDefMIDI[i-1] * r;
  for (  i = 68; i >= 0; i-- ) noteDefMIDI[i] = noteDefMIDI[i+1] / r;
  
  return {
    init: function(mode, keyNo){
      switch(mode) {
       case 'all':
        this.poly = poly;
        this.poly[keyNo] = { };
        this.noteOnFlag = false;
        this.freq = freq;
        this.oscType = oscType;
        this.numOsc = numOsc;
        this.osc = new Array(this.numOsc);
        this.gain = new Array(this.numOsc);
        this.analyser = new Array(this.numOsc);
        this.timeDomainData = new Array(this.numOsc);
        this.opGraph = opGraph;
        this.opCtx = opCtx;
        this.opFreq = opFreq;
        this.opFreqCtx = opFreqCtx;
        this.aratio = new Array(this.numOsc);
        this.rratio = new Array(this.numOsc);
        this.att = att;
        this.attr = attr;
        this.tune = tune;
        this.rel = rel;
        this.attIntervalSec = attIntervalSec;
        this.relIntervalSec = relIntervalSec;

        this.mainGain = actx.createGainNode();
        
        this.curlev = curlev; //new Array(0, 0, 0, 0);
        this.lev    = lev; //new Array(0.35, 0.70, 0.50, 0.50);
        this.flag = 'A';
        this.attInterval = null;

        this.vRate = vRate;
        break;
      }
    },

    setPresetParam: function(name) {
      this.tune = presetParam[name].tune;
      this.att  = presetParam[name].att;
      this.rel  = presetParam[name].rel;
      this.lev  = presetParam[name].lev;
    },

    convertKey2Freq: function(key) {
      return noteDefMIDI[key];
    },

    noteOn: function(keyNo, presetParamName, mainGain) {
      var noteFreq = this.convertKey2Freq(keyNo);
      if(typeof this.osc == 'undefined') {
        this.init('all', keyNo);
      }
      this.setPresetParam(presetParamName);
      
      this.noteOnFlag = true;

      for(var i=0; i<this.numOsc; i++) {
        this.gain[i] = actx.createGainNode();
        this.osc[i] = actx.createOscillator();
        this.analyser[i] = actx.createAnalyser();
        this.osc[i].type = this.oscType[i];
        //this.osc[i].detune.value = this.tune[i] * 480;
        this.osc[i].connect(this.gain[i]);
        this.gain[i].gain.value = 0;
        this.gain[i].connect(this.analyser[i]);

        if(i==0) {
          this.opGraph[i] = document.getElementById('opGraph' + i);
          this.opCtx[i] = this.opGraph[i].getContext('2d');
          this.opFreq[i] = document.getElementById('opFreq'+i);
          this.opFreqCtx[i] = this.opFreq[i].getContext('2d');
        }
        //drawCanvas(opCtx[i]);
      }
      
//      this.gain[2].connect( this.osc[1].frequency );
//      this.gain[2].connect( this.osc[3].frequency );
      this.gain[3].connect( this.osc[2].frequency );
      this.gain[2].connect( this.osc[1].frequency );
      this.gain[1].connect( this.osc[0].frequency );
      this.gain[0].connect( mainGain );
      
      this.osc[3].noteOn(0);
      this.osc[2].noteOn(0);
      this.osc[1].noteOn(0);
      this.osc[0].noteOn(0);
      
      for(var i=0; i<this.numOsc; i++) {
        this.osc[i].frequency.value = noteFreq * this.tune[i];
        this.aratio[i] = Math.pow(0.05, 1.0/(Math.pow(1000,this.att[i])*2));
        this.rratio[i] = Math.pow(0.05, 1.0/(Math.pow(1000,this.rel[i])*2));
      }
      
      var that = this;
      this.attInterval = setInterval(function() {

        for(var i=0; i<that.numOsc; i++) {
          that.timeDomainData[i] = new Uint8Array(that.analyser[i].frequencyBinCount);
        }
        
        that.analyser[0].getByteTimeDomainData(that.timeDomainData[0]);
        drawGraph(that.opCtx[0] , that.timeDomainData[0], vRate[0]);

        drawCanvas(that.opFreqCtx[0]);
        drawFreqGraph(that.opFreqCtx[0], that.analyser[0]);

//        that.analyser[1].getByteTimeDomainData(that.timeDomainData[1]);
//        drawGraph(that.opCtx[1] , that.timeDomainData[1], vRate[1]);

        for(var i=0; i<that.numOsc; i++) {
          if(that.noteOnFlag== true) {
            that.curlev[i] = 1.5 + (that.curlev[i]-1.5) * that.aratio[i];
            if(that.curlev[i]>=1) {
              that.flag = 'A';
              that.noteOnFlag=false;
            }
            // D S の処理を入れるならココ
          }
          if(i==0) {
            that.gain[i].gain.value=that.curlev[i]*that.lev[i];
          } else {
            that.gain[i].gain.value=that.curlev[i]*that.lev[i]*that.freq*10; //
          }          
        }
/*
        document.getElementById("att").innerHTML = "att: " + that.att[0] + " : " + that.att[1] + " : " + that.att[2] + " : " + that.att[3];
        document.getElementById("attr").innerHTML = "attr: " + that.attr[0] + " : " + that.attr[1] + " : " + that.attr[2] + " : " + that.attr[3];
        document.getElementById("aratio").innerHTML = "aratio: " + that.aratio[0] + " : " + that.aratio[1] + " : " + that.aratio[2] + " : " + that.aratio[3];
        document.getElementById("rratio").innerHTML = "rratio: " + that.rratio[0] + " : " + that.rratio[1] + " : " + that.rratio[2] + " : " + that.rratio[3];
        document.getElementById("lev").innerHTML = "lev: " + that.lev[0] + " : " + that.lev[1] + " : " + that.lev[2] + " : " + that.lev[3];
        document.getElementById("curlev").innerHTML = "curlev: " + that.curlev[0] + " : " + that.curlev[1] + " : " + that.curlev[2] + " : " + that.curlev[3];
        document.getElementById("gain").innerHTML = "gain: " + that.gain[0].gain.value + " : " + that.gain[1].gain.value + " : " + that.gain[2].gain.value + " : " + that.gain[3].gain.value;
        document.getElementById("itr").innerHTML = "itr: " + j;
        document.getElementById("noteOn").innerHTML = "noteOnFlag: " + that.noteOnFlag;
        document.getElementById("flag").innerHTML = "flag: " + that.flag;
*/
        j++;
      }, this.attIntervalSec);
    },

    noteOff: function(keyNo) {
      var noteFreq = this.convertKey2Freq(keyNo);

      this.flag = 'R';
      clearInterval(this.attInterval);
      var jj=0;
      var that = this;
      var relInterval = setInterval(function() {
        for(var i=0; i<that.numOsc; i++) {
          that.timeDomainData[i] = new Uint8Array(that.analyser[i].frequencyBinCount);
        }
        
        that.analyser[0].getByteTimeDomainData(that.timeDomainData[0]);
        drawGraph(that.opCtx[0] , that.timeDomainData[0], vRate[0]);

        drawCanvas(that.opFreqCtx[0]);
        drawFreqGraph(that.opFreqCtx[0], that.analyser[0]);

        for(var i=0; i<that.numOsc; i++) {
          that.curlev[i] = that.curlev[i] * that.rratio[i];
          if(i==0) {
            that.gain[i].gain.value=that.curlev[i]*that.lev[i];
          } else {
            that.gain[i].gain.value=that.curlev[i]*that.lev[i]*that.freq*10;
          }
        }
/*
        document.getElementById("att").innerHTML = "att: " + that.att[0] + " : " + that.att[1] + " : " + that.att[2] + " : " + that.att[3];
        document.getElementById("attr").innerHTML = "attr: " + that.attr[0] + " : " + that.attr[1] + " : " + that.attr[2] + " : " + that.attr[3];
        document.getElementById("aratio").innerHTML = "aratio: " + that.aratio[0] + " : " + that.aratio[1] + " : " + that.aratio[2] + " : " + that.aratio[3];
        document.getElementById("rratio").innerHTML = "rratio: " + that.rratio[0] + " : " + that.rratio[1] + " : " + that.rratio[2] + " : " + that.rratio[3];
        document.getElementById("lev").innerHTML = "lev: " + that.lev[0] + " : " + that.lev[1] + " : " + that.lev[2] + " : " + that.lev[3];
        document.getElementById("curlev").innerHTML = "curlev: " + that.curlev[0] + " : " + that.curlev[1] + " : " + that.curlev[2] + " : " + that.curlev[3];
        document.getElementById("gain").innerHTML = "gain: " + that.gain[0].gain.value + " : " + that.gain[1].gain.value + " : " + that.gain[2].gain.value + " : " + that.gain[3].gain.value;
        document.getElementById("itr").innerHTML = "itr: " + j;
        document.getElementById("noteOn").innerHTML = "noteOnFlag: " + that.noteOnFlag;
        document.getElementById("flag").innerHTML = "flag: " + that.flag;
        document.getElementById("jj").innerHTML = "jj: " + jj;
*/      
        jj+=1;
        if( that.gain[0].gain.value < Math.pow(10, -8)) {
          clearInterval(relInterval);
          for(var i=0; i<4; i++) {
            if(typeof that.osc[i] != 'undefined') {
              that.osc[i].noteOff(0);
              //that.deleteOsc();
            }
          }
        }
      }, this.relIntervalSec);
    },
    
    createOperator: function() {
    },
    connectOperator: function() {
    }
    
  };
  
};

function drawCanvas(canvasCtx) {
  canvasCtx.beginPath();
  canvasCtx.fillStyle = "black";
  canvasCtx.rect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
  canvasCtx.fill();
}

function drawGraph(canvasCtx, data, vRate){
  // background
  canvasCtx.beginPath();
  canvasCtx.fillStyle = "black";
  canvasCtx.rect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
  canvasCtx.fill();
  // draw line 0
/*
  canvasCtx.beginPath();
  canvasCtx.fillStyle = "gray";
  canvasCtx.lineWidth = 0.3;
  canvasCtx.moveTo(0, canvasCtx.canvas.height/2);
  canvasCtx.lineTo(canvasCtx.canvas.width, canvasCtx.canvas.height/2);
  canvasCtx.closePath();
  canvasCtx.stroke();
*/
  
  // line
  var value;
  canvasCtx.beginPath();
  canvasCtx.fillStyle = "gray";
  canvasCtx.lineWidth = 1.0;
  canvasCtx.rect(canvasCtx.canvas.width, canvasCtx.canvas.height, 1, 1);
  canvasCtx.fill();
  canvasCtx.moveTo(0, -999);
  for (var i=0; i<data.length; ++i){
    value = vRate * (data[i] - 128) + canvasCtx.canvas.height/2;
    //value = vRate[i] + data[i] - 128 + canvasCtx.canvas.height/2;
    //value = data[i] - 128 + canvasCtx.canvas.height/2;
    canvasCtx.lineTo(i,value);
  }
  canvasCtx.moveTo(0,999);
  canvasCtx.closePath();
  canvasCtx.strokeStyle = "gray";
  canvasCtx.stroke();
}

function drawFreqGraph(canvasCtx, analyser) {
  var mode='B';
  var length = 2048;
  var data = new Uint8Array(length);
  var numBars = 200;
  analyser.getByteFrequencyData(data);
  //analyser.getFloatFrequencyData(data);
  var binSize = Math.floor(data.length/numBars);
  switch(mode) {
   case 'A':
    for(var ii=0; ii < numBars; ++ii) {
      var sum = 0;
      for(var iii=0; iii < binSize; ++iii) {
        sum += data[(ii * binSize)+iii];
      }
      var average = sum / binSize;
      
      var barWidth = canvasCtx.canvas.width / numBars;
      var scaledAverage = (average/256) * canvasCtx.canvas.height;
    
      canvasCtx.fillStyle = "gray";
      canvasCtx.fillRect(ii * barWidth, canvasCtx.canvas.height, barWidth - 0.5, - scaledAverage);
    }
    break;
    case 'B':
    canvasCtx.moveTo(0, canvasCtx.canvas.height);
    for(var ii=0; ii < numBars; ++ii) {
      var sum = 0;
      for(var iii=0; iii < binSize; ++iii) {
        sum += data[(ii * binSize)+iii];
      }
      var average = sum / binSize;
      
      var barWidth = canvasCtx.canvas.width / numBars;
      var scaledAverage = (average/256) * canvasCtx.canvas.height;
    
      canvasCtx.lineTo(ii * barWidth + barWidth/2, canvasCtx.canvas.height - scaledAverage);
      //canvasCtx.fillRect(ii * barWidth, canvasCtx.canvas.height, barWidth - 0.5, - scaledAverage);
    }
    canvasCtx.moveTo(0,canvasCtx.canvas.height);
    canvasCtx.closePath();
    canvasCtx.strokeStyle = "gray";
    canvasCtx.stroke();
    break;
  }

}
