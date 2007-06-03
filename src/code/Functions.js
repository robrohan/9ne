/**
 * File: src/Functions.js
 * This file contains the lion's share of APIs and functions used
 * to manipulate the 9ne editor.
 * In general, function names with underscores (my_function) are APIs
 * and can be used in extension functions. If a function has Override: true
 * a mode can override that function when the mode is activated. For example,
 *
 * (start code)
 *   var nlptr = window.editor_new_line;
 * 	 window.editor_new_line = function(){
 * 		alert("ha ha I stole your new line");
 *      nlptr();
 *   } 
 * (end)
 *
 * Overrides the editor_new_line function (often tied to "enter"), and extends
 * it to show an alert box.
 * 
 * Copyright:
 * 	2006 Rohan (robrohan@gmail.com)
 */

/**
 * Function: addCharCodeToPosition
 * Adds a character to the current cursor position by code
 * 
 * Parameters:
 * code - the ascii char code to add
 */
function addCharCodeToPosition(code) {
	var clean = text_tools.XmlFormat(code);
	clean = clean.replace(/ /g,"&nbsp;");
	
	addStringToCurrentPosition(clean)
}

/**
 * Function: addStringToCurrentPosition
 * Adds a string of text to the current cursor position
 * 
 * Parameters:
 * 	str - the string of text to add
 */
function addStringToCurrentPosition(str) {
	//addText(active_line, active_column, str);
	//active_column += neuro_unXmlFormat(str).length;
	insert_text(str);
}

function insertLineText(line, text) {
	//parse for keywords here?
	text = colorLine(text);
	
	//put the line back in the document
	line.innerHTML = text;
	//fireLineInsert(line);
}

function addText(line, start, text) {
	//unXml escape the entites so one char = one char
	var lineText = getLinePlainText(line, 0, getLineLength(line));
	
	//now that we have our halfs, reincode any XML chars for the 
	//two halves
	line_first_half = lineText.substring(0,start);
	line_second_half = lineText.substring(start);
	
	line_first_half = text_tools.XmlFormat(line_first_half);
	line_first_half = line_first_half.replace(/ /g,"&nbsp;");
	
	line_second_half = text_tools.XmlFormat(line_second_half);
	line_second_half = line_second_half.replace(/ /g,"&nbsp;");
	
	//add in our addition. The addition should already be XML encoded
	var new_line_text = line_first_half + text + line_second_half;
	
	//insert the text (doing color coding as needed)
	insertLineText(line, new_line_text);
}

function removeText(line, start, end) {
	var lineText = getLinePlainText(line, 0, getLineLength(line));
	
	var removedText = lineText.substring(start, end);
	
	line_first_half = lineText.substring(0,start);
	line_second_half = lineText.substring(end);
	
	line_first_half = text_tools.XmlFormat(line_first_half);
	line_first_half = line_first_half.replace(/ /g,"&nbsp;");
	
	line_second_half = text_tools.XmlFormat(line_second_half);
	line_second_half = line_second_half.replace(/ /g,"&nbsp;");
	
	var new_line_text = line_first_half + line_second_half;
	
	insertLineText(line, new_line_text);
	
	return removedText;
	//line.innerHTML = new_line_text;
}

function getLinePlainText(line, start, end) {
	var removedColor = line.innerHTML.toString();
	var removedColor = removedColor.replace(/<[a-z0-9\=\"\'\ \-\/\:\%\&\._\?]*>/ig,"");
	var lineText = text_tools.UnXmlFormat(removedColor);
	
	if(end != null)
		line_plain_text = lineText.substring(start,end);
	else
		line_plain_text = lineText.substring(start);
	
	return line_plain_text;
}

function getLineText(line, start, end) {
	var line_plain_text = getLinePlainText(line,start,end);
	
	line_plain_text = text_tools.XmlFormat(line_plain_text);
	line_plain_text = line_plain_text.replace(/ /g,"&nbsp;");
	
	return line_plain_text;
}

function getLineLength(line) {
	if(line != null)
		//return neuro_unXmlFormat(line.innerHTML.toString()).length
		return getLinePlainText(line,0).length;
}

function getLineIdNumber(line) {
	if(line != null)
		return parseInt(line.id.toString().substring(1));
	else
		return -1;
}

function getLine(num) {
	if(num > 0)
		return document.getElementById("l" + num);
}

function jump_to_line(num) {
	var nextline = getLine(num);
	
	if(nextline != null) {
		if(active_line != null)
			active_line.className = "editorline";
		
		nextline.className = "currentlinehighlight";
		active_line = nextline;
		var next_line_len = getLineLength(nextline);
		
		if(active_column > next_line_len) {
			active_column = next_line_len;
		}
		positionCaret();
	}
}

function goto_line(num)
{
	this.cue = "Goto Line: ";
	
	jump_to_line(num);
	scroll_to_center();
	positionCaret();
}

function window_height() {
	return Sortie.Util.Browser.Explorer ? document.body.clientHeight : window.innerHeight;
}

function window_width() {
	return Sortie.Util.Browser.Explorer ? document.body.clientWidth : window.innerWidth;
}

function get_visible_lines() {
	var lines_per_window = parseInt(window_height() / LINEHEIGHT);
	return lines_per_window;
}

function find_file(filename) {
	this.cue = "Find file: ";
	
	if(filename != null && filename != "" && filename != "null") {
		if(filename.indexOf("://") > -1) {
			//load a web file
		} else {
			launch9ne(DEFAULT_WIDTH, DEFAULT_HEIGHT, filename);
		}
	}
}

function file_line_count() {
	return number_of_lines;
}

function kill_line_fragment(start, end) {
	var fragment = "";
	if(active_line != null)	{
		var lineText = getLinePlainText(active_line,start,end);
		removeText(active_line, start, end);
		fragment = lineText;
	}
	return fragment;
}

function flash_markers(start, end) {
	setTimeout(function(){
		displayCaretAtPosition(editor_second_caret, start);
		setTimeout(function(){
			displayCaretAtPosition(editor_second_caret, end)
			setTimeout(function(){
				editor_second_caret.style.top = "-10000px";
				editor_second_caret.style.left = "-10000px";
			},50)
		}, 800);
	}, 100);
}

/**
 * Function: isBefore
 * returns true if mark1 is before mark2 in the text
 * 
 * Parameters:
 * 	mark1 - the start mark
 *  mark2 - the end mark
 *
 * Returns:
 *  boolean; true if mark1 is before mark2 in the text
 *
 * SeeAlso:
 *  <Mark>
 */
function isBefore(mark1, mark2) {
	if(getLineIdNumber(mark1.line) < getLineIdNumber(mark2.line)) {
		return true;
	}
	
	if(getLineIdNumber(mark1.line) == getLineIdNumber(mark2.line)) {
		if(mark1.column < mark2.column) {
			return true;
		}
	}
	
	return false;
}

/**
 * Moves the main caret to the mark position and updates the display
 */
function moveCaretToMark(mark)
{
	//active_line = mark.line;
	active_column = mark.column;
	jump_to_line(getLineIdNumber(mark.line));
}

function editor_addLine()
{
	var total_num_line = editor_text_area.childNodes.length;
	var active_line_id = getLineIdNumber(active_line);
	
	var line_remainder = kill_line();
	line_remainder = (line_remainder != null) ? line_remainder : "";
	
	var new_line = document.createElement("DIV");
	new_line.className = "editorline";
	//new_line.setAttribute("onclick","editor_focus()");
	//new_line.appendChild(document.createTextNode(line_remainder));
	
	line_remainder = text_tools.XmlFormat(line_remainder);
	line_remainder = line_remainder.replace(/ /g,"&nbsp;");
	insertLineText(new_line, line_remainder);
	
	//if the lineid = total line then it's a line to the EOF just add it
	if(active_line_id == -1 || active_line_id == total_num_line) {
		new_line.setAttribute("id","l" + (++number_of_lines));
		
		var new_gutter = document.createElement("DIV");
		new_gutter.className = "gutteritem";
		new_gutter.appendChild(document.createTextNode(number_of_lines));
		
		editor_gutter_area.appendChild(new_gutter);
		
		editor_text_area.appendChild(new_line);
		//active_line = new_line;
		jump_to_line(number_of_lines);
		
		recalculateLines();
		
		scroll_down();
	} else {
		//insert the new line before the next line
		var nextline = getLine((active_line_id+1));
		//temp id
		new_line.setAttribute("id","tl" + (active_line_id+1));
		
		editor_text_area.insertBefore(new_line, nextline);
		number_of_lines++;
		
		//now we need to repair the IDs of all the lines so they are
		//in order l1, l2, etc fix the gutter too
		recalculateLines();
		
		if(Sortie.Util.Browser.Safari) {
			active_line.className = "editorline";
			FIX_SAFARI_JumpCaretAfterNewLine();
		}
		
		nextline = getLine((active_line_id+1));
		active_column = 0;
		jump_to_line(active_line_id+1);
		
		if(screen_tools.FindPosY(editor_caret) > ((get_visible_lines() - ELECTRIC_LINE) * LINEHEIGHT)) {
			scroll_up();
		}
	}
	
	editor_gutter_area.style.height = editor.scrollHeight + "px";
}


function editor_backspace()
{
	var rt = delete_backward_char();
	//add_undo_command("insert_text('" + rt + "');");
	isdirty = true;
}

function remove_line(linenum)
{
	var target = document.getElementById("l" + linenum);
	if(target != null)
	{
		editor_text_area.removeChild(target);
		number_of_lines--;
		recalculateLines();
	}
}

function eval_expression(exp) {
	this.cue = "Eval: ";
	DEBUG = true;
	log.init();
	
	//eval("log.debug(" + exp + ")");
	eval(exp + "");
}

/**
 * Function: recalculateLines
 * Loops over the divs in the editor_text_area and rebuilds the
 * IDs of the divs (line IDs).
 */
function recalculateLines() {
	editor_gutter_area.innerHTML = "";
	var chillin = editor_text_area.childNodes;
	var chillen = chillin.length;
	
	for(var u=0; u<chillen; u++) {
		var tline = chillin.item(u);
		tline.setAttribute("id","l" + (u+1));
		
		var new_gutter = document.createElement("DIV");
		new_gutter.className = "gutteritem";
		
		new_gutter.appendChild(document.createTextNode((u+1)));
		editor_gutter_area.appendChild(new_gutter);
	}
}

function FIX_SAFARI_JumpCaretAfterNewLine() {
	//seems safari isn't able to access the new nodes that have
	//been shuffled. Pulling the text out and slapping it back
	//in seems to cause it to reparse and build it properly
	//this will probably hurt performace on large files (it does)
	var tmp = editor_text_area.innerHTML;
	editor_text_area.innerHTML = "";
	editor_text_area.innerHTML = tmp;
	tmp = null;
}

/**
 * Function: append_minibuffer_text
 * Append some text for display in the mini buffer
 *
 * Parameters:
 * 	text - The text to append to the display
 */
function append_minibuffer_text(text) {
	editor_minibuffer.value += text;
}

/**
 * Function: append_minibuffer_binding
 * Used in key chords, append the binding to the
 * minibuffer so 9ne knows it's part of a chord
 * 
 * Parameters:
 * 	text - chord binding "CTRL+X", "ALT+Y", etc
 */
function append_minibuffer_binding(text) {
	append_minibuffer_text(text + " ");
}

/**
 * Function: minibuffer_message
 * display some text in the mini buffer for one second. 
 * non-blocking message. Useful for "mode not found" kind
 * of errors.
 *
 * Parameters:
 * text - the text to display
 */
function minibuffer_message(text) {
	editor_minibuffer.value = text;
	setTimeout("clear_minibuffer()", 1000);
}

/**
 * Function: run_minibuffer_command
 * Runs a command using the minibuffer. If the function passed
 * in has a "cue" property, a dialog box is shown to collect
 * parameters for the command. Note the parameter for this
 * function is a string.
 * 
 * Parameters:
 * 	cmd - the function name to run (optionally taking one parameter and having a cue property)
 */
function run_minibuffer_command(cmd) {
	clear_minibuffer();
	
	//if they are trying to jump into a mode
	if(cmd.indexOf("_mode") > 0){
		var arr = cmd.split("_");
		var mode = arr[0];
		//alert(mode);
		loadModeFile(mode);
	} else {
		//this will get the cue command from the function if it
		//is one that takes parameters, or run it if it is a POF
		
		var ns = "";
		
		if(typeof window[cmd] != "undefined") {
			eval("buffer_command = new " + cmd + "().cue");
			ns = "window.";
		} else if(window.extensions[cmd] != "undefined") {
			eval("buffer_command = new window.extensions." + cmd + "().cue");
			ns = "window.extensions.";
		}
			
		
		if(buffer_command != null) {
			var args = prompt(buffer_command);
			
			//TODO: there needs to be a better way to do this
			if(args.indexOf("[") == 0 || args.indexOf("{") == 0)
				eval(ns + cmd + "(" + args + ")");
			else
				eval(ns + cmd + "('" + args + "')");
		}
	}
}

/**
 * Function: fundamental_mode
 * The basic mode. This mode has all the default text movement
 * (and most everything else) functions associated with it. If
 * a mode overrides any functions, setting the buffer to this
 * mode will reset everything to the default.
 */
function fundamental_mode() {
	resetMode()
	show_editor_message("applying fundamental mode");
	
	//if this is a first run save the original current key bindings 
	//so we can restore them when fundamental mode is called again
	if(window.fun_org_bindings == null)	{
		window.fun_org_bindings = new Object();
		
		for(var i in BINDINGS) {
			window.fun_org_bindings[i] = BINDINGS[i];
		}
	} else {
		//if we are getting re-applied, restor the original key bindings
		//to null out any mode added key bindings
		BINDINGS = new Object();
		for(var i in window.fun_org_bindings) {
			BINDINGS[i] = window.fun_org_bindings[i];
		}
	}

	/**
	 * Function: editor_new_line
	 * main command to add a new line to the editor. Adds one if
	 * at the end of the file or inserts one if in the middle
	 * 
	 * Override: true
	 */
	window.editor_new_line = function()	{
		editor_addLine();
		active_column = 0;
		isdirty = true;
	}
	
	/**
	 * Function: clear_minibuffer
	 * clears the minibuffer text and command buffer
	 * 	
	 * Override: true
	 */
	window.clear_minibuffer = function() {
		editor_minibuffer.value = "";
		buffer_command = "";
	}
	
	/**
	 * Function: eval_line
	 * evaluates the current line as javascript instruction
	 * 
	 * Override: true
	 */
	window.eval_line = function() {
		var linetxt = getLinePlainText(active_line, 0, getLineLength(active_line));
		eval(linetxt);
	}
	
	/**
	 * Function: eval_region
	 * 	evaluates the current region as javascript instructions
	 * 
	 * Override: true
	 */
	window.eval_region = function() {
		copy_region();
		eval(clipboard);
	}
	
	/**
	 * Function: eval_buffer
	 * 	evaluates the current buffer as javascript instructions
	 * 
	 * Override: true	
	 */
	window.eval_buffer = function() {
		try {
			eval(get_editor_text());
		}catch(e){
			minibuffer_message(e);
		}
	}
	
	/**
	 * Function: insert_tab
	 * 	command to insert a tab at the current position
	 * 
	 * Override: true	
	 */
	window.insert_tab = function() {
		addStringToCurrentPosition(TAB);
		document.getElementById('editor').focus();
	}
	
	/**
	 * Function: delete_char
	 * deletes the character infront of the cursor. if at the end
	 * of the line will move the previous line to the current line
	 * 	
	 * Override: true 	
	 */
	window.delete_char = function()	{
		if(active_column == getLineLength(active_line))	{
			if(getLineIdNumber(active_line) == file_line_count())
				return;
			//if we are at the end of a line, we probably expect
			//the text from the next line to come up to this line
			//removing the next line
			var nextline = getLine(getLineIdNumber(active_line)+1);
			var nextlinetext = getLineText(nextline, 0, getLineLength(nextline));
			remove_line(getLineIdNumber(active_line)+1);
			//goto_line(getLineIdNumber(active_line));
			jump_to_line(getLineIdNumber(active_line));
			positionCaret();
			
			var savepos = active_column;
			addStringToCurrentPosition(nextlinetext);
			active_column = savepos;
		} else {
			removeText(active_line, active_column, (active_column+1));
			positionCaret();
		}
	}
	
	/**
	 * Function: beginning_of_buffer
	 * 	jumps to the first line / column of the buffer (current file)
	 * 	
	 * Override: true
	 */
	window.beginning_of_buffer = function() {
		goto_line(1);
		beginning_of_line();
	}
	
	/**
	 * Function: end_of_buffer
	 * jumps to the last line / column of the buffer (current file) 	
	 * 
	 * Override: true
	 */
	window.end_of_buffer = function() {
		goto_line(number_of_lines);
		end_of_line();
	}
	
	/**
	 * Function: backward_char
	 * Moves the caret back one character (does not delete). used for
	 * file navigation	
	 * 	
	 * Override: true
	 */
	window.backward_char = function() {
		if(active_column != 0)
			active_column--;
		else {
			previous_line();
			active_column = getLineLength(active_line);
		}
		
		positionCaret();
	}
	
	/**
	 * Function: end_of_line
	 * 	jumps to the end of the current line
	 * 
	 * 	Override: true
	 */
	window.end_of_line = function()	{
		active_column = getLineLength(active_line);
	}
	
	/**
	 * Function: beginning_of_line
	 * 	jumps to the beginning of the current line (column 0)
	 * 
	 * Override: true
	 */
	window.beginning_of_line = function() {
		active_column = 0;
	}
	
	/**
	 * Function: next_line
	 * Moves the caret down one line (not add a new line). used for file
	 * navigation.
	 * 
	 * Override: true
	 */
	window.next_line = function() {
		var current_line_num = getLineIdNumber(active_line);
		jump_to_line(current_line_num+1);
		
		//number of visible lines
		var visible_lines = get_visible_lines();
		if(screen_tools.FindPosY(editor_caret) > ((visible_lines - ELECTRIC_LINE) * LINEHEIGHT)) {
			scroll_up();
		}
	}
	
	/**
	 * Function: scroll_up
	 * scroll up by one line 	
	 * 
	 * 	Override: true
	 */
	window.scroll_up = function() {
		//scrolls down by one line
		var current_line_num = getLineIdNumber(active_line);
		var visible_lines = get_visible_lines();
		editor.scrollTop = ( ((current_line_num-1) - (visible_lines-ELECTRIC_LINE)) * LINEHEIGHT);
		positionCaret();
	}
	
	/**
	 * Function: previous_line
	 * Move the caret to up one line used for file navigation 	
	 * 
	 * 	Override: true
	 */
	window.previous_line = function() {
		var current_line_num = getLineIdNumber(active_line);
		jump_to_line(current_line_num-1);
		
		//number of visible lines
		var visible_lines = (window_height() / 14) - 5;
		
		if(screen_tools.FindPosY(editor_caret) < 4 * 14)
			scroll_down();
	}
	
	/**
	 * Function: scroll_down
	 * 	scroll down by one line
	 * 
	 * 	Override: true
	 */
	window.scroll_down = function() {
		//scrolls down by one line
		var current_line_num = getLineIdNumber(active_line);
		var visible_lines = get_visible_lines();
		editor.scrollTop = (current_line_num-ELECTRIC_LINE) * LINEHEIGHT;
		positionCaret();
	}
	
	/**
	 * Function: forward_char
	 * Moves the caret forward one character. used for file navigation	
	 * 
	 * 	Override: true
	 */
	window.forward_char = function() {
		if(getLineLength(active_line) > active_column)
			active_column++;
		else {
			if(getLineIdNumber(active_line) < number_of_lines) {
				next_line();
				active_column = 0;
			}
		}
		positionCaret();
	}
	
	/**
	 * Function: delete_backward_char
	 * Deletes the character behind the cursor (backspace). if the
	 * cursor is at the beginning of the line it moves up to the previous
	 * line
	 * 
	 * 	Override: true
	 */
	window.delete_backward_char = function() {
		var rt = "";
		if(active_column != 0) {
			rt = removeText(active_line, (active_column-1), active_column);
			active_column--;
		} else {
			//we need to delete the line
			var linenum = getLineIdNumber(active_line);
			if(linenum != 1) {
				//if there is any text on this line grab it
				var text_on_line = kill_line();
				//remove the line
				remove_line(linenum);
				//go to the line above it
				jump_to_line(linenum-1);
				//backspace, so go to the end of the line
				save_len = getLineLength(getLine(linenum-1));
				active_column = save_len;
				//now add any left over text from the line we just removed
				addStringToCurrentPosition(text_on_line);
				active_column = save_len;
			}
			rt = "\n";
		}
		positionCaret();
		
		return rt;
	}
	
	/**
	 * Function: scroll_to_line
	 * scrolls the view to the active line so the line is within view.
	 * for example, if you jump to an offscreen line this will move 
	 * the view region to show that line 	
	 * 
	 * 	Override: true
	 */
	window.scroll_to_line = function() {
		var current_line_num = getLineIdNumber(active_line);
		var visible_lines = get_visible_lines();
		editor.scrollTop = ( (current_line_num-1) * LINEHEIGHT);
	}
	
	/**
	 * Function: scroll_to_center
	 * repositions the view so the active line is in the middle of
	 * the viewable screen 	
	 * 
	 * 	Override: true
	 */
	window.scroll_to_center = function() {
		var current_line_num = getLineIdNumber(active_line);
		var visible_lines = get_visible_lines();
		editor.scrollTop = ( ((current_line_num) - (visible_lines>>1)) * LINEHEIGHT);
	}
	
	/**
	 * Function: yank
	 * Yank the contents of the clipboard. In other words, paste 	
	 * 	
	 * Override: true
	 */
	window.yank = function() {
		//TODO: save the to the end of the line to append
		//after and insert (for multi line yanks)
	
		var toeol = kill_line();
		
		var pclipboard = text_tools.XmlFormat(clipboard);
		pclipboard = pclipboard.replace(/ /g,"&nbsp;");
		
		var lines = new Array();
		lines = pclipboard.split("\n");
		
		for(var z=0; z<lines.length; z++) {
			//alert(z + " " + lines[z]);
			
			if(z > 0) {
				editor_addLine();
				//addText(active_line, active_column, lines[z]);
				//active_column += neuro_unXmlFormat(lines[z]).length;
				//positionCaret();
				insert_text(lines[z]);
			} else {
				//addText(active_line, active_column, lines[z]);
				//active_column += neuro_unXmlFormat(lines[z]).length;
				//positionCaret();
				insert_text(lines[z]);
			}
		}
		
		//addText(active_line, active_column, toeol);
		insert_text(toeol);
		//positionCaret();
	}
	
	/**
	 * Function: insert_text
	 * Inserts the passed text at the given location and advaces the
	 * column position and cursor
	 * 
	 * Parameters:
	 * 	text - the text to insert
	 * Returns:
	 * 	
	 */
	window.insert_text = function(text) {
		addText(active_line, active_column, text);
		active_column += text_tools.UnXmlFormat(text).length;
		positionCaret();
	}
	
	
	/**
	 * Function: save
	 * Save the contents of the buffer
	 * 
	 * 	Override: true
	 */
	window.save = function() {
		//if we are linked to a text area update the area, if not save the file
		if(linked_textarea != null)	{
			linked_textarea.value = get_editor_text();
			minibuffer_message("Saved: " + buffer_name);
			isdirty = false;
		} else {
			minibuffer_message("Save not implemented yet!");
		}
	}
	
	/**
	 * Function: get_editor_text
	 * Gets the full contents of the buffer in plain text 	
	 * 
	 * 	Override: true
	 */
	window.get_editor_text = function() {
		var tempbuffer = "";
		
		for(var z=1; z<=number_of_lines; z++) {
			var line = getLine(z);
			var templine = getLinePlainText(line,0,getLineLength(line)) + "\n";
			
			tempbuffer += templine
		}
		
		return tempbuffer;
	}
	
	/**
	 * Function: kill_line
	 * removes the active line 	
	 * 
	 * Returns:
	 * 	the line text
	 * 	
	 * Override: true
	 */
	window.kill_line = function() {
		var toEOL = "";
		
		if(active_line != null) {
			var lineText = getLinePlainText(active_line,0,getLineLength(active_line));
			toEOL = lineText.substring(active_column);
			removeText(active_line, active_column, lineText.length);
		}
		
		return toEOL;
	}

	/**
	 * Function: kill_start_line
	 * 	delete from the current position to the start of the line
	 * 
	 * Returns:
	 * the removed text
	 * 	
	 * Override: true
	 */
	window.kill_start_line = function() {
		var toBOL = "";
		
		if(active_line != null) {
			var lineText = getLinePlainText(active_line,0,active_column);
			//toBOL = lineText.substring(active_column);
			removeText(active_line, 0, active_column);
			toBOL = lineText;
		}
		return toBOL;
	}
	
	/**
	 * Function: kill_9ne
	 * kills (closes) the editor. checks to see if the buffer has
	 * been modified and verifies if it has been 	
	 * 
	 * Returns:
	 * 
	 * Override: true	
	 */
	window.kill_9ne = function() {
		stopRepeatKey();
		
		if(isdirty) {
			if(!confirm("Modified buffers exist; exit anyway?")){
				editor_focus();
				return false;
			}
			
			/* confirm_dialog({
				text:"Modified buffers exist; exit anyway?",
				avalue:"No",
				afunction:"editor_focus(); dialog.hide();"
			}); */
		}
		
		//return false;
		
		if(linked_textarea != null) {
			linked_textarea.disabled = false;
			linked_textarea.style.background = "white";
		}
		//let them know we are closing
		runOnEnd();
		//shut'er down
		window.close(); 
		
		return true;
	}
	
	/**
	 * Function: editor_set_mark
	 * sets a mark as an anchor. commands that operate on regions will
	 * work only after a mark (a start position) has been set
	 * 
	 * 	Override: true
	 */
	window.editor_set_mark = function() {
		active_mark = new Mark();
		active_mark.line = active_line;
		active_mark.column = active_column;
		minibuffer_message("Mark Set");
	}
	
	/**
	 * Function: copy_region
	 * from a mark - copies the region to the clipboard 	
	 * 
	 * 	Override: true
	 */
	window.copy_region = function() {
		if(active_mark != null)	{
			//we need to save the primitives because the yank and kill
			//might cause an object refresh which will kill the line pointers
			var startlineid = getLineIdNumber(active_mark.line);
			var startcolumn = active_mark.column;
				
			var endlineid = getLineIdNumber(active_line);
			var endcolumn = active_column;
				
			kill_region();
			yank();
			
			var start_mark = new Mark();
			start_mark.line = getLine(startlineid);
			start_mark.column = startcolumn;
			
			var end_mark = new Mark();
			end_mark.line = getLine(endlineid);
			end_mark.column = endcolumn;
			
			//copy acts different than kill, the end position needs to be
			//moved in case of a "backwards" copy (mark down, copy up)
			if(isBefore(end_mark, start_mark)) {
				moveCaretToMark(end_mark);
			}
			
			flash_markers(start_mark, end_mark);
		}
	}
	
	/**
	 * Function: kill_region
	 * deletes from the mark to the point where the kill region
	 * function is called, and puts the restuls on the clipboard
	 * 
	 * 	Override: true;
	 */
	window.kill_region = function() {
		var current = new Mark();
		current.line = active_line;
		current.column = active_column;
		
		var start_line = parseInt(getLineIdNumber(active_mark.line));
		var end_line = parseInt(getLineIdNumber(current.line));
		
		var numlines = start_line - end_line;
		
		var tclipboard = "";
		
		//started below and ended above
		if(numlines > 0) {
			//the final end point of the region is the start of the
			//kill zone
			var finalmark = new Mark();
			finalmark.line = active_line;
			finalmark.column = active_column;
			
			//grab from the start to the end of the line
			tclipboard += kill_line() + "\n";
			
			//if this started at the start of the line remove the
			//now empty line, else move down one
			if(active_column == 0) {
				remove_line(end_line);
				goto_line(end_line);
			}
			else goto_line(++end_line);
			
			active_column = 0;
			positionCaret();
			numlines--;
					
			//loop over the rest of the lines that are complete line
			//kills
			while(numlines > 0)	{
				tclipboard += kill_line() + "\n";
				remove_line(end_line);
				goto_line(end_line);
				positionCaret();
				numlines--;
			}
			
			//now go to the end position and kill to the
			//start of the line
			active_column = active_mark.column;
			positionCaret();
			
			tclipboard += kill_start_line();
			
			active_line = finalmark.line;
			active_column = finalmark.column;
			positionCaret();
			//delete_char();
			
			//alert(tclipboard);
			
			clipboard = tclipboard;
		} else if(numlines < 0)	{
			//started above and ended below
			
			//go to the start position
			goto_line(start_line);
			active_column = active_mark.column;
			//grab from the start to the end of the line
			tclipboard += kill_line() + "\n";
			
			//if this started at the start of the line remove the
			//now empty line, else move down one
			if(active_column == 0){
				remove_line(start_line);
				goto_line(start_line);
			} 
			else goto_line(++start_line);
			
			active_column = 0;
			positionCaret();
			numlines--;
			
			//loop over the rest of the lines that are complete line
			//kills
			while(numlines < -2) {
				tclipboard += kill_line() + "\n";
				remove_line(start_line);
				goto_line(start_line);
				positionCaret();
				numlines++;
			}
			
			//now go to the end position and kill to the
			//start of the line
			active_column = current.column;
			positionCaret();
			
			tclipboard += kill_start_line();
			
			//and remove the space where the region was
			goto_line(getLineIdNumber(active_mark.line));
			active_column = active_mark.column;
			positionCaret();
			//delete_char();
			
			clipboard = tclipboard;
		} else {
			//kill a group of chars on one line
			//if its a mark, back, cut
			if(active_column < active_mark.column)
				tclipboard = kill_line_fragment(active_column, active_mark.column);
			//if its a mark, forward, cut
			else {
				tclipboard = kill_line_fragment(active_mark.column, active_column);
				active_column = active_mark.column;
				positionCaret();
			}
			
			clipboard = tclipboard;
		}
	}
		
}