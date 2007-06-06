var key_repeat_timer = null;
var key_delay_timer = null;
var KEY_DELAY = 200;
var KEY_REPEAT = 60;
var repeat_function = null;

var repeat_count = 0;

function __threadKeySpinner() {
	if(repeat_function != null) {
		var tmp = new repeat_function();
		tmp = null;
	}
}

function runKeyRepeat() {
	cursor_solid();
	key_repeat_timer = setInterval("__threadKeySpinner()",KEY_REPEAT);
}

function keyWithRepeat(func) {
	//aways run the function
	var tmp = new func();
	//save a pointer to the function incase we have to repeat
	repeat_function = func;
	
	key_delay_timer = setTimeout("runKeyRepeat(); clearTimeout(key_delay_timer); key_delay_timer = null;",KEY_DELAY);
}

function stopRepeatKey() {
	clearTimeout(key_delay_timer);
	clearInterval(key_repeat_timer);
	
	repeat_function = null;
	key_delay_timer = null;
	key_repeat_timer = null;
	
	cursor_blink();
}
///////////////////////////////////////////////////

function isControlKey(evt)
{
	if(evt.ctrlKey)
		return true;
	
	return false;
}

function isMetaKey(evt)
{
	if(evt.altKey) 
		return true;
	return false;
}

function isInChord()
{
	return editor_minibuffer.value.toString().length > 0;
}

/////////////// EVENT HANDLING ////////////////////
function editor_onKeyPress(event)
{
	if(editor_in_focus)
	{
		var keycode = event_manager.GetKeyCodeFromEvent(event);
		var asciikey = event_manager.GetKeyFromEvent(event);
		//evt.ctrlKey
		
		switch(keycode)
		{
			case 13: //enter
				if(!minibuffer_focus)
				{
					//eval(BINDINGS["ENTER"]);
				}
			break;
			
			case 27: //esc
			case 8: //backspace
				//this doesnt work in key down for some reason
				if(!minibuffer_focus)
				{
					//eval(BINDINGS["BACKSPACE"]);
				}
				event.cancelBubble = true;
				event.returnValue = false;
				return false;
			break;
			
			//to suppress up, down, left, right, from adding funny
			//characters to the editor or causing the editor to jump
			case 63272:		//the DEL key (Safari)
			case 63232:		// /\ uparrow (Safari)
			case 63235:		// -> right arrow (Safari)
			case 63234:		// <- left arrow (Safari)
			case 63233:		// \/ down arrow (Safari)
				event.cancelBubble = true;
				event.returnValue = false;
				return false;
			case 35:			//END
			case 36:			//HOME
				if(Sortie.Util.Browser.Safari) 
				{
					event.cancelBubble = true;
					event.returnValue = false;
					return false;
				}
			case 0:	// All on FF
			break;
			
			//to supress ctrl + fpnb (safari)
			case 16:
			case 14:
			case 6:
			case 2:
			//to supress ctrl + fpnb (ff)
			case 112:
			case 110:
			case 102:
			case 98:
			default:
				if(isMetaKey(event) || isControlKey(event) || isInChord())
					break;
				
				if(!minibuffer_focus)
				{
					addCharCodeToPosition(asciikey);
					isdirty = true;
				}
		}
		
		positionCaret();
	}
}

function leaveMiniBuffer()
{
	//clear_minibuffer();
	editor_focus();
	//if we don't pause here, the keypress will get to the editor and add an extra
	// char
	minibuffer_focus = false
	clear_minibuffer();
	//setTimeout("minibuffer_focus = false",500);
}

function editor_onKeyDown(event)
{
	if(editor_in_focus)
	{
		var keycode = event_manager.GetKeyCodeFromEvent(event);
		var asciikey = event_manager.GetKeyFromEvent(event);
		
		window.status = "d: " + keycode;
		
		/////////// In the mini buffer //////////////
		if(minibuffer_focus)
		{
			switch(keycode)
			{
				case 9:
				case 32:
					buffer_command += "-";
					append_minibuffer_text("-");
					
					event.cancelBubble = true;
					event.returnValue = false;
					return false;
				break;
				
				case 8:
					buffer_command = buffer_command.toString().substring(0, (buffer_command.toString().length-1));
					var mbv = editor_minibuffer.value.toString();
					editor_minibuffer.value = mbv.substring(0,(mbv.length-1));
				break;
				
				case 13:
					buffer_command = buffer_command.toLowerCase();
					buffer_command = buffer_command.replace(/\-/g,"_");
					//alert(buffer_command);
					try {
						run_minibuffer_command(buffer_command);
					} catch(e) {
						minibuffer_message("Command Unknown! " + e);
					}
					
					//pause so the keypress doesn't add a new line to the file
					setTimeout("leaveMiniBuffer();",500);
					
					event.cancelBubble = true;
					event.returnValue = false;
					return false;
				break;
				
				case 27: //ESC on windows made a square
				case 112: //F1
				case 113: //F2
				case 114: //F3
				case 115: //F4
				case 116: //F5
				case 117: //F6
				case 118: //F7
				case 119: //F8
					event.cancelBubble = true;
					event.returnValue = false;
					return false;
				break;
				
				case 48: //0
				case 49: //1
				case 50: //2
				case 51: //3
				case 52: //4
				case 53: //5
				case 54: //6
				case 55: //7
				case 56: //8
				case 57: //9
				
				default:
					var dsp = "";
					dsp += asciikey;
					//hum... not sure about this, we should be recording the
					//meta and ctrl key in the exec buffer yeah?
					buffer_command += asciikey;
					append_minibuffer_text(dsp);
			}
		}
		/////////// Not in the mini buffer //////////////
		else
		{
			var current_stroke = (event.ctrlKey) ? "CTRL+" : "";
			current_stroke += (event.altKey) ? "ALT+" : ""; 
			current_stroke += (event.shiftKey) ? "SHIFT+" : "";
			
			var binding_lookup = (editor_minibuffer.value != "") ? (editor_minibuffer.value) : ""
						
			//alert(keycode)		
			switch(keycode)
			{
				case 27: //ESC
					current_stroke += "ESC";
					//return false;
				break;
				
				case 9: //TAB
					current_stroke += "TAB";
				break;
				
				case 35: //END
					current_stroke += "END";
				break;
				
				case 36: //HOME
					current_stroke += "HOME";
				break;
				
				case 38: // up
					current_stroke += "UP";
				break;
				
				case 39: // right
					current_stroke += "RIGHT";
				break;
				
				case 37: // left
					current_stroke += "LEFT";
				break;
				
				case 40: //down
					current_stroke += "DOWN";
				break;
				
				case 188: //comma
					current_stroke += "COMMA";
				break;
				
				case 190: //period
					current_stroke += "PERIOD";
				break;
				
				case 51: // 3 (FF Mac seems to have a problem wth 3 and 4)
					current_stroke += "3";
				break;
				
				case 52: // 4 (FF Mac seems to have a problem wth 3 and 4)
					current_stroke += "4";
				break;
				
				case 46: //DEL
					current_stroke += "DEL";
				break;
				
				//not all system support catching the function keys
				case 112: //F1
					current_stroke += "F1";
				break;
				
				case 113: //F2
					current_stroke += "F2";
				break;
				
				case 114: //F3
					current_stroke += "F3";
				break;
				
				case 115: //F4
					current_stroke += "F4";
				break;
				
				case 116: //F5
					current_stroke += "F5";
				break;
				
				case 117: //F6
					current_stroke += "F6";
				break;
				
				case 118: //F7
					current_stroke += "F7";
				break;
				
				case 119: //F8
					current_stroke += "F8";
				break;
				
				case 219: //[ or {
					current_stroke += "OPENBRACE";
				break;
				
				case 221: //] or }
					current_stroke += "CLOSEBRACE";
				break;
				
				case 220: // \
					current_stroke += "BACKSLASH";
				break;
				
				case 191: // /
					current_stroke += "FORWARDSLASH";
				break;
				
				case 192: // `
					current_stroke += "GRAVE";
				break;
				
				case 189: // -
					current_stroke += "MINUS";
				break;
				
				case 187: // =
					current_stroke += "EQUALS";
				break;
				
				case 186: // ;
					current_stroke += "SEMICOLON";
				break;
				
				case 222: // ;
					current_stroke += "QUTOE";
				break;
							
				case 13: //enter
					current_stroke += "ENTER";
				break;
			
				case 8:
					current_stroke += "BACKSPACE";
				break;
				
				//F9-F12 are taken by default on the mac so I am not sure of
				//the key code (and I am too lazy to look at the moment)
				
				case 32:
					current_stroke += "SPACE";
					//safari seems to have a weird bug where space will
					//cause the div to scroll, I hope this works...
					if(!Sortie.Util.Browser.Explorer)
					{
						event.cancelBubble = true;
						event.returnValue = false;
						//return false;
					}
				break;
				
				default:
					current_stroke += asciikey;
			}
			
			binding_lookup += current_stroke;
			
			//window.status = binding_lookup + " ::::::: " + current_stroke;
			
			//Check to see if this is the gloabl "quit minibuffer" key stroke
			var global_quit = BINDINGS["_GLOBAL_CANCEL_"];
			if(current_stroke == global_quit) {
				//run the defined quit action
				eval(BINDINGS[BINDINGS["_GLOBAL_CANCEL_"]]);
				return false;
			}
			
			try {
				var macro = BINDINGS[binding_lookup];
				if(typeof macro != "undefined") {
					eval(macro);
				} else {
					if(!Sortie.Util.Browser.Explorer && !(isControlKey(event) || isMetaKey(event)) ){
						//show_editor_message(current_stroke);
						//add_undo_command("delete_backward_char()");
					}
				}
				
				textarea_bucket.value = "";
				
				//we got a macro and it was handled so stop the bubble
				event.cancelBubble = true;
				event.returnValue = false;
				return false;
			} catch(e) {
				minibuffer_message("Error: " + e);
			}
		}
		positionCaret();
	}
}

function editor_onKeyUp(event)
{
	stopRepeatKey();
}

/////////////// REGISTER LISTENERS //////////
//handles most things
//neuro_addKeyPressListener(editor_onKeyPress);
//event_manager.AddKeyPressListener(editor_onKeyPress);

//for firefox for fake tabs
//neuro_addKeyDownListener(editor_onKeyDown);
//event_manager.AddKeyDownListener(editor_onKeyDown);

//neuro_addKeyUpListener(editor_onKeyUp);
