/**
 * File: src/9neMain.js
 * This file has the main functions for 9ne. Things like
 * initialization and helper function for starting 9ne.
 * All of the global variables are defined here as well.
 *
 * Copyright:
 * 	2006 Rohan (robrohan@gmail.com)
 */

var INSTALL_LOCATION = "http://robrohan.com/projects/9ne";
var MAIN_FILE = "9ne.cfm";
var editor = null;
var editor_text_area = null;
var editor_gutter_area = null;
var editor_caret = null;
var editor_second_caret = null;
var editor_status = null;
var editor_messages = null;
var editor_minibuffer = null;

var textarea_bucket = null;

var clipboard = "" //should be an array for yanking...

var buffer_name = "*scratch*";
var buffer_mode = "Scratch";

var editor_in_focus = false;
var minibuffer_focus = false;
var buffer_command = "";

var active_line = null;
var active_column = 0;
var active_mark = null;
var number_of_lines = 0;

var linked_textarea = null;

var tab_size = 4;
var TAB = "";

var LINEHEIGHT = 17;
var ELECTRIC_LINE = 3;

var DEFAULT_WIDTH = 615;
var DEFAULT_HEIGHT = 620;

var SYNTAX_COLORING = true;

var isdirty = false;

var caretblink = null;

var GUTTER_X_OFFSET = 0;
var CHAR_SIZE = 0;

var event_manager = null;

//var window.mode_syntax_rules = {};
var mode_ext_map = null;

var text_tools = null;
var screen_tools = null;

var dialog = null;

/**
 * Class: Mark
 * A position in the buffer. has a "line" and "column" property
 */
function Mark() {
	this.line;
	this.column;
}

/**
 * Function: launchWithTextarea
 * create a popup instance of 9ne linked to a text area. When
 * the buffer is saved the contents are written back to the text
 * area. In addition, while 9ne is open the textare will be disabled
 * 
 * Parameters:
 * 	width- the width 9ne should be
 * 	height - the height 9ne should be
 * 	textarea - the name of the text area to bind to with quotes. 'body' for example
 */
function launchWithTextarea(width, height, textarea) {
	var windowOptions = 'history=no,toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=no,resizable=yes,width='+width+',height='+height;
	var handle = window.open(INSTALL_LOCATION + '/'+MAIN_FILE+'?area='+textarea, "ne" + new Date().getTime(), windowOptions);
	handle.focus();
}

/**
 * Function: lanuch9ne
 * Start a new instance of the editor linked to a file. The
 * file will be loaded via httprequest so it must be web accessable
 * to javascript. This function is useful to display information
 * 
 * Parameters:
 * 	width - the width 9ne should be
 *  height - the height 9ne should be
 *  filename - the file to load
 */
function launch9ne(width, height, filename) {
	var windowOptions = 'history=no,toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=no,resizable=yes,width='+width+',height='+height;
	var handle = window.open(INSTALL_LOCATION + '/'+MAIN_FILE+'?file='+filename, "ne" + new Date().getTime(), windowOptions);
	handle.focus();
}

/**
 * Function: launch9neWithHandle
 * Launch 9ne and get back a window handle. filename is used to
 * set the mode and display for the information you are going to
 * be loading into 9ne. The file does not need to exist.
 *
 * (start code)
 * 	hndl = launch9neWithHandle(615,620,'untitled');
 * 	hndl.on9neStart = function(){ hndl.addStringToCurrentPosition('test'); }
 * (end)
 * 
 * Parameters:
 * 	width - the width 9ne should be
 * 	height - the height 9ne should be
 *  filename - the filename this file will probably use (or something like "untitled")
 * 
 * Returns:
 * 	handle to the window.	
 */
function launch9neWithHandle(width, height, filename) {
	var windowOptions = 'history=no,toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=no,resizable=yes,width='+width+',height='+height;
	var handle = window.open(INSTALL_LOCATION + '/'+MAIN_FILE+'?file='+filename, "ne" + new Date().getTime(), windowOptions);
	handle.focus();
	return handle;
}

//////////////// START UP ////////////////////////

/**
 * Function: initEditor
 * Editor initialization. At the end of this function the
 * on9neStart function is called on the window
 */
function initEditor() {
	editor = document.getElementById("editor");
	editor_text_area = document.getElementById("editortext");
	editor_gutter_area = document.getElementById("editorgutter");
	editor_caret = document.getElementById("editorCaret");
	editor_second_caret = document.getElementById("editorSecondCaret");
	editor_status = document.getElementById("statusbar");
	editor_minibuffer = document.getElementById("minibuffer");
	editor_messages = document.getElementById("editorMessages");
	
	textarea_bucket = document.getElementById("fakefocus");
	
	//see: displayCaretAtPosition for where these are used
	GUTTER_X_OFFSET = document.getElementById("editorgutter").offsetWidth;
	CHAR_SIZE = editor_caret.offsetWidth;
	
	//startup the event manager and add the key listeners
	event_manager = new Sortie.UI.EventManager();
	event_manager.Init(document);
	event_manager.AddKeyPressListener(editor_onKeyPress);
	event_manager.AddKeyDownListener(editor_onKeyDown);
	event_manager.AddKeyUpListener(editor_onKeyUp);
	event_manager.AddMouseDownListener(function(e){
		try{
			var linenum = getLineIdNumber(e.target);
			if(linenum)
				jump_to_line(linenum);
		}catch(e){
			//
		}
		editor_focus();
	});
	event_manager.AddMoveListener(function(e){
		Sortie.UI.Mouse.SetCoords(e);
		window.status = "X: " + Sortie.UI.Mouse.X + " Y:" + Sortie.UI.Mouse.Y;
	});
	
	//the syntax rules and move maps
	window.mode_syntax_rules = new Sortie.Util.Map();
	mode_ext_map = new Sortie.Util.Map();
	
	text_tools = new Sortie.Util.Text();
	screen_tools = new Sortie.UI.Screen();
	
	window.extensions = {};
	
	//TODO: move these somewhere logical
	mode_ext_map.Put("css","CSS");
	mode_ext_map.Put("js","Javascript");
	mode_ext_map.Put("rel","Release");
	mode_ext_map.Put("txt","Text");
	mode_ext_map.Put("text","Text");
	
	mode_ext_map.Put("xml","XML");
	mode_ext_map.Put("rss","XML");
	mode_ext_map.Put("xsl","XML");
	mode_ext_map.Put("html","XML");
	mode_ext_map.Put("xhtml","XML");
	mode_ext_map.Put("htm","XML");
	
	mode_ext_map.Put("cfm","XML");
	mode_ext_map.Put("cfml","XML");
	mode_ext_map.Put("cfc","XML");
	
	mode_ext_map.Put("php","XML");
	
	//ugly hack alert. Sometimes the textarea_bucket will lose focus
	//and cause backspace to try to leave the page. Then, once the
	//"are you sure you want to leave" system dialog pops up the
	//textarea_bucket loses focus forever until you hit tab - which sucks
	//this just keeps setting the focus
	//setInterval("editor_focus()",1000);
	
	
	for(var q=0; q<tab_size; q++)
		TAB += "&nbsp;";
	
	//load all the default editor functions
	fundamental_mode();
	
	var current_url = window.location.toString();
	if(current_url.indexOf("?") > -1)
	{
		//TODO: try catch, this is a bit of hackery
		var urlparts = current_url.split("?")
		//0 = host etc 1 = "file=filename&blarg=yadda etc"
		//right now we'll just assume the filename is present
		var fnameparts = urlparts[1].toString().split("=");
		var f = fnameparts[1].toString().split("&");
		var filename = f[0].toString();
		
		//if we get passed file, try to open the file
		if(fnameparts[0].toString() == "file") {
			//load a "normal" file (and assume it's on the server)
			//var httpcon = new HTTPConnectFactory().getInstance();
			var pipe = new Sortie.IO.Pipe().GetInstance();
			//var remote = new JSRemote(httpcon, true);
			var gateway = new Sortie.IO.Gateway(pipe, true)
			
			gateway.DoRequest({
				method:"POST",
				url:filename, 
				handler:function(conn) {
					if(conn.status == 200)
						loadFile(filename, guessFileType(filename), conn.responseText);
					else
					{
						document.title = buffer_name = filename;
						buffer_mode = guessFileType(filename);
						editor_addLine();
					}
				},
				body:""
			});
		}
		else if(fnameparts[0].toString() == "area")
		{
			//try to link with the openers textarea
			if(window.opener)
				linked_textarea = window.opener.document.getElementById(filename);
			else
				linked_textarea = parent.document.getElementById(filename);
				
			linked_textarea.disabled = true;
			linked_textarea.style.background = "silver";
			
			loadFile("Textarea", guessFileType("temp.html"), linked_textarea.value);
		}
	}
	else
	{
		editor_addLine();
	}
	
	try{
		window.onactivate = editor_focus();
		window.onfocus = editor_focus();
		window.document.onfocus = editor_focus();
		window.document.onactive = editor_focus();
		window.onresize = function() {
			/* if(editor_text_area){
				var x = findPosX(editor_text_area) + GUTTER_X_OFFSET;
				//(far left pos + gutter padding) + (char_size * position)
				var w = (x + GUTTER_EXTRA_OFFSET) + (active_column * CHAR_SIZE);
		
				editor_text_area.style.width = (w) + "px";
				editor_text_area.style.height = (window_height()) + "px";
			} */
		}
	} catch(e) {
		//some of these might not take, IE I am looking at you
	}
	
	document.title = buffer_name;
	editor_focus();
	
	///////////
	//dialog = new YAHOO.widget.Overlay("dialog");
	//dialog.cfg.setProperty("fixedcenter", true);
	//dialog.hide();
	
	/* mySimpleDialog = new YAHOO.widget.SimpleDialog("dlg", { 
		width: "20em", 
		effect:{ effect:YAHOO.widget.ContainerEffect.FADE, duration:0.25 }, 
		fixedcenter:true,
		modal:true,
		draggable:false }
	);
	
	mySimpleDialog.setHeader("Warning!");
	mySimpleDialog.setBody("Are you sure you want to delete this item?");
	mySimpleDialog.cfg.setProperty("icon",YAHOO.widget.SimpleDialog.ICON_WARN);
	mySimpleDialog.render(document.body);
	mySimpleDialog.show(); */
	
	//document.getElementById("editor").style.opacity = ".5";
	//document.getElementById("dialog").style.left = "0px;"
	//document.getElementById("dialog").style.top = "0px;"
	///////////
	
	setTimeout("runOnStart()",500);
}

function runOnStart() {
	if(window.on9neStart)
		window.on9neStart()
}

function runOnEnd() {
	if(window.on9neEnd)
		window.on9neEnd()
}

/**
 * Function: guessFileType
 * Guesses the file based on extension, and if the extension
 * is in the mode_ext_map map it will apply the associated mode
 * 
 * Parameters:
 * 	filename - a string that has the file's name in it
 * 	
 * Returns:
 * 	string; a displayable version of the mode applied
 */
function guessFileType(filename) {
	if(SYNTAX_COLORING) {
		var ext = filename.substring(filename.lastIndexOf(".")+1);
	
		if(mode_ext_map.Contains(ext)) {
			var mode = mode_ext_map.Get(ext);
			//eval(mode.toLowerCase() + "_mode()");
			loadModeFile(mode.toLowerCase());
			return mode;
		}
	}
	
	fundamental_mode();
	return "Fundamental";
}

/**
 * Function: flashCaret
 * Toggles the caret (cursor) on and off
 * 	
 */
function flashCaret() {
	if(editor_caret.style.visibility == "visible")
		caret_hide();
	else
		caret_show();
	
	//bit of a hack to force IE to update the caret position
	if(Sortie.Util.Browser.Explorer)
		positionCaret();
}

/**
 * Function: caret_hide
 * Hides the caret (cursor)
 */
function caret_hide() {
	editor_caret.style.visibility = "hidden";
}

/**
 * Function: caret_show
 * Shows the caret (cursor)
 */
function caret_show() {
	editor_caret.style.visibility = "visible";
}

/**
 * Function: cursor_solid
 * Stops the caret (cursor) from flashing and makes it
 * solid
 */
function cursor_solid() {
	if(caretblink != null) clearInterval(caretblink);
	editor_caret.style.visibility = "visible";
}

/**
 * Function: cursor_blink
 * Makes the caret (cursor) start blinking
 */
function cursor_blink() {
	if(caretblink != null) clearInterval(caretblink);
	caretblink = setInterval("flashCaret()", 500);
}

/**
 * Function: editor_focus
 * Puts the focus on the editor and trys to control
 * tab and backspace by focusing on dummy text areas.
 * starts the caret blinking too
 */
function editor_focus() {
	
	//show_editor_message("editor_focus");
	
	cursor_blink();
	editor_in_focus = true;
	
	if(!textarea_bucket)
		textarea_bucket = document.getElementById("fakefocus");
	else
		textarea_bucket.focus();
}

/**
 * Function: editor_blur
 * removes focus from the editor
 */
function editor_blur() {
	if(caretblink != null) clearInterval(caretblink);
	caretblink == null;
	editor_in_focus = false;
}

function loadFile(name, type, contents) {
	document.title = buffer_name = name;
	buffer_mode = type;
	
	if(contents != null && contents != "") {
		var lines = contents.split("\n");
	
		for(var q=0; q<lines.length; q++) {
			fast_line_add(lines[q]);
			lines[q] = null;
		}
	} else {
		editor_addLine();
	}
	
	jump_to_line(1);
	editor_focus();
}

function fast_line_add(txt) {
	var new_line = document.createElement("DIV");
	new_line.className = "editorline";
	
	var clean = text_tools.XmlFormat(txt);
	clean = clean.replace(/ /g,"&nbsp;");
	clean = clean.replace(/\t/g,TAB);
	
	//new_line.appendChild(document.createTextNode(clean));
	new_line.innerHTML = colorLine(clean);
	new_line.setAttribute("id","l" + (++number_of_lines));
	
	var new_gutter = document.createElement("DIV");
	new_gutter.className = "gutteritem";
	new_gutter.appendChild(document.createTextNode(number_of_lines));
	
	editor_gutter_area.appendChild(new_gutter);
	editor_text_area.appendChild(new_line);
}

function colorLine(txt) {
	if(window.mode_syntax_rules) {
		var syntaxkeys = window.mode_syntax_rules.GetKeysAsArray();
	
		for(var z=0; z<syntaxkeys.length; z++) {
			var rule = window.mode_syntax_rules.Get(syntaxkeys[z]);
			txt = txt.replace(rule.regex, rule.replace);
		}
	}
	
	return txt;
}

function repaint_text() {
	for(var i=1; i<=number_of_lines; i++) {
		var line = getLine(i);
		var linetxt = getLinePlainText(line,0,getLineLength(line));
		
		var clean = text_tools.XmlFormat(linetxt);
		clean = clean.replace(/ /g,"&nbsp;");
		
		if(line != null)
			insertLineText(line, clean);
	}
}

function getFileContents() {
	var chillin = editor_text_area.childNodes;
	alert(chillin.length + " " + chillin.item(0).innerHTML);
}

function confirm_dialog(settings) {
	
	var wrap = document.createElement("DIV");
	
	var inst = document.createElement("P");
	inst.appendChild(document.createTextNode(settings.text));

	var btna = document.createElement("INPUT");
	btna.setAttribute("type","button");
	btna.setAttribute("value",settings.avalue);
	btna.setAttribute("onclick",settings.afunction);
	
	wrap.appendChild(inst);
	wrap.appendChild(btna);
	
	document.getElementById("dialog").appendChild(wrap);
	dialog.show();
}


/////////////// DISPLAY ////////////////////

/**
 * Function: positionCaret
 * Moves the caret (cursor) to the active position. This
 * is a display move only. The cursor must be moved first
 * then the caret can be moved to that position
 */
function positionCaret() {
	var tempmark = new Mark();
	tempmark.line = active_line;
	tempmark.column = active_column;
	
	displayCaretAtPosition(editor_caret, tempmark);
	
	updateEditorStatusText();
}

/**
 * Function: displayCaretAtPosition
 * Shows a caret at the specified mark position.
 */
function displayCaretAtPosition(caret, mark) {
	/*
	     /GUTTER_X_OFFSET    
	 y  /  /GUTTER_EXTRA_OFFSET                  
	x+---------------------+
	 |  5|                 | <- editor.scrollTop
	 |  6|                 |
	 |  7| text 0          | <- mark.line
	 |  8|                 |
	 +---------------------+
	*/
	var GUTTER_EXTRA_OFFSET = CHAR_SIZE;
	
	//get the baseline position using the currently visiable area
	var y = screen_tools.FindPosY(mark.line) - editor.scrollTop;
	//get the X position of the text editor div an add and offset
	//for the gutter
	var x = screen_tools.FindPosX(editor_text_area) + GUTTER_X_OFFSET;
	
	//move the caret down (or up) to the proper y position
	caret.style.top = y + "px";
	
	//(far left pos + gutter padding) + (char_size * position)
	caret.style.left = (x + GUTTER_EXTRA_OFFSET) + (mark.column * CHAR_SIZE);
}

/**
 * Function: updateEditorStatusText
 * updates the area to the left of the minibuffer. The line count
 * mode, etc
 */
function updateEditorStatusText() {
	// u:-- *scratch* All of 0 (1,0) (Text)
	//--:**  TUTORIAL          (Fundamental)--L670--58%----------------
	var lookingAt = (get_visible_lines() >= number_of_lines) ? "All" : parseInt((get_visible_lines() / number_of_lines) * 100) + "%";
	
	var statustext = "-u:" + ((isdirty)?"**":"--") + " ";
	statustext += buffer_name  + " "+lookingAt+" of " + number_of_lines + "L";
	statustext += " (" + active_line.id.toString().substring(1) + "," + active_column + ")";
	statustext += " (" + buffer_mode + ")";
	
	editor_status.innerHTML = statustext;
}

/**
 * Function: show_editor_message
 * Shows a message at the top right of the editor for 2 seconds.
 * This area is mostly used to let the client know about something
 * going on in the background, but shouldn't stop text editing or
 * minibuffer entry
 * 
 * Parameters:
 * msg - the message to display
 */
function show_editor_message(msg) {
	editor_messages.innerHTML = msg;
	editor_messages.style.visibility = "visible";
	setTimeout("editor_messages.style.visibility = 'hidden'", 2000);
}

