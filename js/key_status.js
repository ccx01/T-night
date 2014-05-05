$(function() {
  window.keydown = {};
  
  function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase();
  }
  
  $(document).on("keydown", function(event) {
    keydown[keyName(event)] = true;
  });
  
  $(document).on("keyup", function(event) {
    keydown[keyName(event)] = false;
  });

  // $(document).on('contextmenu',function(event){ 
  //   return false; 
  // }); 

  $(document).on("mousedown", function(event) {
    switch(event.which){
      case 1:
        keydown.leftClick=true;
      break;
      case 3:
        keydown.rightClick=true;
      break;
    }
  });

  $(document).on("mouseup", function(event) {
    switch(event.which){
      case 1:
        keydown.leftClick=false;
      break;
      case 3:
        keydown.rightClick=false;
      break;
    }
  });

});
