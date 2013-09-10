var word ='Demo: Input words in input area.';
var lcd = new Array(6);
var displayType = 'letters';

for(var i=0; i<lcd.length; i++) {
  var num=i+1;
  lcd[i] = new CanvasLCD('0'+num);
  lcd[i].init('canvasLCD0'+i, word, true);
}

$(document).ready(function(){
  prettyPrint();
  $("div.inputstatus").css('background-color', '#ffd700');
  var ivlId=setInterval(
    function() {
      var count=0;
      for(var i=0; i<6; i++) {
        if(lcd[i].systemReady==true) count++;
      }
      if(count>=6) {
        $('input.changeword').removeAttr('disabled');
        //$('input.inputword').removeAttr('disabled');
        $("div.inputstatus").css('background-color', '#32cd32');
        clearInterval(ivlId);
      }
    },400
  );
  $('select.displayType').bind('change', function() {
    displayType=$('select.displayType option:selected').val();
    event.stopImmediatePropagation();
  });
  
  $('input.changeword').click(function(event){
    var value=$('input.inputword').val();
    if(value==""){
      window.alert('Please, input words in input area.');
    } else {
      for(var i=0; i<lcd.length; i++) {
        var num=i+1;
        lcd[i].write2Display(displayType, value);
      }
    }
  });
  
  
});