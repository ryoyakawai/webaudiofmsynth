var inputs, outputs;
var i;
navigator.requestMIDIAccess({sysex:false}).then(scb, ecb);
function scb( access ) {
    var midi=access;
    var inputs=midi.inputs();
    
    var midiinSelect=document.getElementById("midiInput");
    for(var i=0; i<inputs.length; i++) {
        midiinSelect.options[i]=new Option(inputs[i]["name"], i);
    }
    document.getElementById("midiInConnect").addEventListener("click", function(){
        var value=document.getElementById("midiInput").value;
        inputs[value].onmidimessage=function(event) {
            var data = event.data;
            var data16 = [ event.data[0].toString(16), event.data[1].toString(16), event.data[2].toString(16)];
            switch(data16[0]) {
              case '90':
                noteOnFunc(data[1]);
                if(data[2]==0) noteOffFunc(data[1]);
                //    console.log(data[1]);
                break;
              case '80':
                noteOffFunc(data[1]);
                break;
            default:
                //    console.log('Not Supported yet!');
                break;
            }
        };
    });
};

function ecb(e){
    console.log(e);
};
