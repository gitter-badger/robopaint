/**
 * @file Holds all CNC Server central controller objects and DOM management code
 * This is currently manifested as a shared "library" between the two drawing
 * SVG drawing modes, and might need to be abstracted out to be more supportive
 * for other modes.
 */

// Set the global scope object for any robopaint level details
var robopaint = window.parent.robopaint;

var cncserver = {
  canvas: {
    height: robopaint.canvas.height,
    width: robopaint.canvas.width,
    scale: 1,
    offset: {
      top: 20,
      left: 235
    }
  },
  state: {
    pen: {},
    buffer: [], // Hold commands to be interpreted as free operations come
    media: '', // What we think is currently on the brush
    mediaTarget: '', // What we "want" to paint with
    process: {
      name: 'idle',
      waiting: false,
      busy: false,
      paused: false,
      max: 0
    }
  },
  config: {
    colors: robopaint.statedata.colorsets[robopaint.settings.colorset].colors,
    canvasDebug: false, // Debug mode for helping find canvas offsets
    checkVisibility: true
  }
};


$(function() {
  var $path = {};
  var $svg = $('svg#main');

  serverConnect(); // "Connect", and get the initial pen state
  $('#drawpoint').hide(); // Hide the drawpoint

  // Set the height based on set aspect ratio / global width
  $svg.add('#shadow').height(robopaint.canvas.height);

  // Initial server connection handler
  function serverConnect() {
    // Get initial pen data from server
    cncserver.wcb.status('Connecting to bot...');

    // Setup general pen status update callback, called from cncserver.api.js
    // TODO: This handily works for both manual and auto as they have the same
    // named buttons, but should probably be generalized
    robopaint.$(robopaint.cncserver.api).bind('updatePen', function(e, d) {
      cncserver.state.pen = d;

      // Update button text
      var toState = 'up';

      if (cncserver.state.pen.state == "up" || cncserver.state.pen.state == 0){
        toState = 'down';
      }

      $('#pen').attr('class','normal ' + toState);
    });

    // Bind to API toolChange
    robopaint.$(robopaint.cncserver.api).bind('toolChange', function(toolName){
      cncserver.state.media = toolName;
    });

    robopaint.cncserver.api.pen.stat(function(d){
      cncserver.wcb.status(['Connected Successfully!'], d);
      cncserver.state.pen.state = 1; // Assume down
      robopaint.cncserver.api.pen.up(); // Send to put up
      cncserver.state.pen.state = 0; // Assume it's up (doesn't return til later)

      // Default last tool to given in returned state
      if (cncserver.state.pen.tool) {
        cncserver.state.media = cncserver.state.pen.tool;
      } else {
        cncserver.state.media = "water0";
      }

      // Default target to "current" media on startup
      cncserver.state.mediaTarget = cncserver.state.media;

      // Set the Pen state button
      $('#pen').addClass(!cncserver.state.pen.state ? 'down' : 'up');
      if (window.bindControls) window.bindControls();

      parent.fadeInWindow(); // Actually show the mode window
    });
  }

  // Public function to load in SVG
  cncserver.canvas.loadSVG = function(file) {
    // If we've been given a filename, go load it in then try again
    if (typeof file == 'string') {
      $.ajax({
        url: 'svgs/' + file,
        dataType: 'text',
        success: function(data){
          localStorage["svgedit-default"] = data;
          loadSVG();
        }
      });
      return;
    }

    // Load default content from SVG-edit
    if (localStorage["svgedit-default"]){
      $('svg#main g#cncserversvg').empty();
      $('svg#main g#cncserversvg').append(localStorage["svgedit-default"]);

      // Convert anything not a path into a path for proper tracing
      cncserver.paths.changeToPaths('svg#main g#cncserversvg');
    }

    if (cncserver.canvas.loadSVGCallback) {
      cncserver.canvas.loadSVGCallback();
    }
  }

});

// Triggered on before close or switch mode, call callback to complete operation
function onClose(callback, isGlobal) {
  if (cncserver.state.buffer.length) {
    var r = confirm("Are you sure you want to go?\n\
Exiting print mode while printing will cancel all your jobs. Click OK to leave.");
    if (r == true) {
      unBindEvents(callback); // Cleanup, close, continue
    }
  } else {
    unBindEvents(callback);  // Cleanup, close, continue
  }
}

// When closing, make sure to tidy up bound events
// TODO: Namespace this to ensure only the ones we set are cleaned up
function unBindEvents(callback) {
  robopaint.$(robopaint.cncserver.api).unbind('updatePen');
  robopaint.$(robopaint.cncserver.api).unbind('toolChange');
  robopaint.$(robopaint.cncserver.api).unbind('offCanvas');
  robopaint.$(robopaint.cncserver.api).unbind('movePoint');

  // Clear CNC Server Buffer and set to resume state
  if (cncserver.state.buffer.length) {
    cncserver.state.buffer = [];
    cncserver.state.process.paused = true;
    robopaint.cncserver.api.buffer.clear(function(){
      robopaint.cncserver.api.buffer.resume(function(){
        robopaint.cncserver.api.pen.park();
        if (callback) callback();
      });
    });
  } else {
    if (callback) callback();
  }
}
