//Must be specified in order of CTRL ALT and then SHIFT
var BINDINGS = {
	/* This will force any in-progress chord to abort. Note
	 You have to define the action for the stroke below */
	"_GLOBAL_CANCEL_":	"ESC",
	/* Define any chords beginnings. Note if you want to build long
	 chords you should define them in order*/
	"CTRL+SHIFT+I":					"append_minibuffer_binding('CTRL+SHIFT+I')",
	"CTRL+SHIFT+I CTRL+SHIFT+H":	"append_minibuffer_binding('CTRL+SHIFT+H')",
	"CTRL+SHIFT+H":					"append_minibuffer_binding('CTRL+SHIFT+H')",
	
	/* Key bindings and handlers. */
	"ENTER":			"editor_new_line()",
	"BACKSPACE":		"editor_backspace()",
	"CTRL+SHIFT+J":		"editor_set_mark()",
	"CTRL+SHIFT+X":		"kill_region()",
	"CTRL+SHIFT+C":		"copy_region(); setTimeout(clear_minibuffer,300)",
	"ESC":				"stopRepeatKey(); append_minibuffer_text('ESC')",
	"CTRL+SHIFT+V":		"yank()",
	"CTRL+SHIFT+K":		"clipboard = kill_line();",
	"TAB":				"insert_tab(); isdirty = true; positionCaret();",
	"DEL":				"delete_char(); isdirty = true",
	"END":				"end_of_line(); positionCaret();",
	"SHIFT+END":		"end_of_buffer(); positionCaret();",
	"HOME":				"beginning_of_line(); positionCaret();",
	"SHIFT+HOME":		"beginning_of_buffer(); positionCaret();",
	"UP":				"previous_line()",
	"RIGHT":			"forward_char()",
	"LEFT":				"backward_char()",
	"DOWN":				"next_line()",
	"ALT+SHIFT+L":		"goto_line(active_line)",
	"ESC":				"minibuffer_message('Quit'); leaveMiniBuffer()",
	
	"CTRL+SHIFT+O":		"run_minibuffer_command('find_file'); leaveMiniBuffer()",
	"CTRL+SHIFT+Q":		"run_minibuffer_command('kill_9ne'); leaveMiniBuffer()",
	"CTRL+SHIFT+A":		"find_file('docs/license.txt'); leaveMiniBuffer()",
	"CTRL+SHIFT+U":		"find_file('docs/update.txt');	leaveMiniBuffer()",

	/* current bug: when you have a chord and then a single note you have to have a minibuffer message */
	"CTRL+SHIFT+H T":	"find_file('docs/tutorial.txt'); minibuffer_message('Loading Tutorial...');",
	"CTRL+SHIFT+H B":	"find_file('docs/keys.rel'); minibuffer_message('Loading KeyBinding Notes...');",
	"CTRL+SHIFT+H R":	"find_file('docs/current.rel'); minibuffer_message('Loading Release Notes...');",
	"CTRL+SHIFT+Z":		"minibuffer_message('Undo not implemented yet!');",
	"CTRL+SHIFT+S":		"save();",
	
	"ALT+X":			"append_minibuffer_binding('ALT+X'); minibuffer_focus = true",
	
	/* quick patch - these need to be explicit for some reason */
	"SHIFT+3":			"addStringToCurrentPosition('#'); positionCaret()",
	"SHIFT+4":			"addStringToCurrentPosition('$'); positionCaret()",
	
	"CTRL+ALT+SHIFT+R": "run_minibuffer_command('eval_line'); minibuffer_message('Running Line ' + getLineIdNumber(active_line) + '...');",
	"F8":				"run_minibuffer_command('eval_buffer');",
	
	/* example of long chord */
	"CTRL+SHIFT+I CTRL+SHIFT+H CTRL+SHIFT+S":	"alert('Long Chord!'); leaveMiniBuffer();"
};

//IE needs to have every key spelled out (which is actually cool but time consuming)
if(Sortie.Util.Browser.Explorer) {
	var defaultkeys = "abcdefghijklmnopqrstuvwxyz" //0123456789
	for(var q=0; q<36; q++) {
		var ch = defaultkeys.charAt(q);
		var upperchar = String.fromCharCode(defaultkeys.charCodeAt(q) - 32);
		var strupch = upperchar.toString();
		
		BINDINGS[strupch] = "addCharCodeToPosition('" + ch.toString() + "'); positionCaret()";
		BINDINGS["SHIFT+"+strupch] = "addCharCodeToPosition('" + strupch + "'); positionCaret()";
	}
	
	BINDINGS["SPACE"] = "addStringToCurrentPosition('&nbsp;'); positionCaret()";
	
	//`-=[]\;',./
	BINDINGS["GRAVE"] = "addStringToCurrentPosition('`'); positionCaret()";
	BINDINGS["SHIFT+GRAVE"] = "addStringToCurrentPosition('~'); positionCaret()";
	
	BINDINGS["MINUS"] = "addStringToCurrentPosition('-'); positionCaret()";
	BINDINGS["SHIFT+MINUS"] = "addStringToCurrentPosition('_'); positionCaret()";
	
	BINDINGS["EQUALS"] = "addStringToCurrentPosition('='); positionCaret()";
	BINDINGS["SHIFT+EQUALS"] = "addStringToCurrentPosition('+'); positionCaret()";
	
	BINDINGS["OPENBRACE"] = "addStringToCurrentPosition('['); positionCaret()";
	BINDINGS["SHIFT+OPENBRACE"] = "addStringToCurrentPosition('{'); positionCaret()";
	
	BINDINGS["CLOSEBRACE"] = "addStringToCurrentPosition(']'); positionCaret()";
	BINDINGS["SHIFT+CLOSEBRACE"] = "addStringToCurrentPosition('}'); positionCaret()";
	
	BINDINGS["BACKSLASH"] = "addStringToCurrentPosition(String.fromCharCode(92)); positionCaret()";
	BINDINGS["SHIFT+BACKSLASH"] = "addStringToCurrentPosition('|'); positionCaret()";
	
	BINDINGS["SEMICOLON"] = "addStringToCurrentPosition(';'); positionCaret()";
	BINDINGS["SHIFT+SEMICOLON"] = "addStringToCurrentPosition(':'); positionCaret()";
	
	BINDINGS["QUTOE"] = "addStringToCurrentPosition(\"'\"); positionCaret()";
	BINDINGS["SHIFT+QUTOE"] = "addStringToCurrentPosition('\"'); positionCaret()";
	
	BINDINGS["COMMA"] = "addStringToCurrentPosition(','); positionCaret()";
	BINDINGS["SHIFT+COMMA"] = "addCharCodeToPosition('<'); positionCaret()";
	
	BINDINGS["PERIOD"] = "addStringToCurrentPosition('.'); positionCaret()";
	BINDINGS["SHIFT+PERIOD"] = "addCharCodeToPosition('>'); positionCaret()";
	
	BINDINGS["FORWARDSLASH"] = "addStringToCurrentPosition('/'); positionCaret()";
	BINDINGS["SHIFT+FORWARDSLASH"] = "addStringToCurrentPosition('?'); positionCaret()";
	
	for(var q=0; q<9; q++)
		BINDINGS[""+q] = "addStringToCurrentPosition('" + q + "'); positionCaret()";
	
	BINDINGS["SHIFT+0"] = "addStringToCurrentPosition(')'); positionCaret()";
	BINDINGS["SHIFT+1"] = "addStringToCurrentPosition('!'); positionCaret()";
	BINDINGS["SHIFT+2"] = "addStringToCurrentPosition('@'); positionCaret()";
	//3 and 4 are above for a FF on Mac patch
	BINDINGS["SHIFT+5"] = "addStringToCurrentPosition('%'); positionCaret()";
	BINDINGS["SHIFT+6"] = "addStringToCurrentPosition('^'); positionCaret()";
	BINDINGS["SHIFT+7"] = "addStringToCurrentPosition('&amp;'); positionCaret()";
	BINDINGS["SHIFT+8"] = "addStringToCurrentPosition('*'); positionCaret()";
	BINDINGS["SHIFT+9"] = "addStringToCurrentPosition('('); positionCaret()";
	
}
