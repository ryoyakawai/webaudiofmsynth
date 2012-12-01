/** 
 * @license faers.js 1.0.0 Copyright (c) 2012, Ryoya KAWAI All Rights Reserved.
 * Available via the MIT or new BSD license.
 */

var horizontalClicked = false;
var horizontalxPrevious = null;

$(document).ready(function(){
  $('div.horizontalKnob')
    .mousedown(function(event){
        if(lcd.systemReady==true) horizontalClicked = true;
      horizontalxPrevious = event.clientX;
			var horizontalxBrowser = parseInt($(this).css('margin-left').replace('px', ''));
      //console.log(event.clientX);
    }).mousemove(function(event){
		    if( horizontalClicked==true ) {
				    var horizontalxBrowser = parseInt($(this).css('margin-left').replace('px', ''));
				    var horizontalDeltaX = event.clientX - horizontalxPrevious;
				    var horizontaltmpyBrowser = horizontalxBrowser + horizontalDeltaX;
				    if(horizontaltmpyBrowser>=-14 && horizontaltmpyBrowser<=194) {
						    horizontalxPrevious = event.clientX;
						    horizontalxBrowser += horizontalDeltaX;
						    $(this).css('margin-left', horizontalxBrowser);
				    }
      }
    })
    .mouseup(function(event){
      horizontalClXoicked = false;
				  var horizontalxBrowser = parseInt($(this).css('margin-left').replace('px', ''));
				  var horizontalDeltaX = event.clientX ;
      var value = (horizontalxBrowser + 14) / 208;
      setVolume(value);
    })
    .mouseout(function(){
      horizontalClicked = false;
    })
  ;

});
