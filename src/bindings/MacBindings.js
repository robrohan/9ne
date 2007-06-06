/*
	9ne - an online, emacs like code editor
    Copyright (C) 2006-2007 Rob Rohan

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

//Must be specified in order of CTRL ALT and then SHIFT
var BINDINGS = {
	/* This will force any in-progress chord to abort. Note
	 You have to define the action for the stroke below */
	"_GLOBAL_CANCEL_":	"CTRL+G",
	/* Define any chords beginnings. Note if you want to build long
	 chords you should define them in order*/
	"CTRL+X":			"append_minibuffer_binding('CTRL+X')",
	"CTRL+X ALT+H":		"append_minibuffer_binding('ALT+H')",
	"ALT+H":			"append_minibuffer_binding('ALT+H')",
	"ALT+X":			"append_minibuffer_binding('ALT+X'); minibuffer_focus = true",
	
	"ESC X":			"clear_minibuffer(); append_minibuffer_binding('ALT+X'); minibuffer_focus = true",
	"ESC H":			"clear_minibuffer(); append_minibuffer_binding('ALT+H');",
	
	/* Key bindings and handlers. */
	"ENTER":			"keyWithRepeat(editor_new_line)",
	"BACKSPACE":		"keyWithRepeat(editor_backspace)",
	"CTRL+Q":			"editor_set_mark()",
	"CTRL+W":			"kill_region()",
	"ALT+W":			"copy_region(); setTimeout(clear_minibuffer,300)",
	"ESC W":			"copy_region(); setTimeout(clear_minibuffer,300)",
	"ESC":				"stopRepeatKey(); append_minibuffer_binding('ESC')",
	"CTRL+Y":			"yank()",
	"CTRL+K":			"clipboard = kill_line();",
	"TAB":				"keyWithRepeat(insert_tab); isdirty = true",
	"CTRL+D":			"keyWithRepeat(delete_char); isdirty = true",
	"DEL":				"keyWithRepeat(delete_char); isdirty = true",
	"CTRL+E":			"end_of_line()",
	"END":				"end_of_line()",
	"SHIFT+END":		"end_of_buffer()",
	"CTRL+A":			"beginning_of_line()",
	"HOME":				"beginning_of_line()",
	"SHIFT+HOME":		"beginning_of_buffer()",
	"CTRL+P":			"keyWithRepeat(previous_line);",
	"UP":				"keyWithRepeat(previous_line);",
	"CTRL+F":			"keyWithRepeat(forward_char);",
	"RIGHT":			"keyWithRepeat(forward_char);",
	"CTRL+B":			"keyWithRepeat(backward_char);",
	"LEFT":				"keyWithRepeat(backward_char);",
	"CTRL+N":			"keyWithRepeat(next_line)",
	"DOWN":				"keyWithRepeat(next_line)",
	"CTRL+L":			"goto_line(active_line)",
	"ALT+SHIFT+COMMA":	"beginning_of_buffer();",
	"ALT+SHIFT+PERIOD":	"end_of_buffer();",
	"CTRL+G":			"minibuffer_message('Quit'); leaveMiniBuffer()",
	
	"CTRL+X CTRL+F":	"run_minibuffer_command('find_file'); leaveMiniBuffer()",
	"CTRL+X CTRL+C":	"window.close()", /* "run_minibuffer_command('kill_9ne'); leaveMiniBuffer()", */
	"ALT+H CTRL+C":		"find_file('docs/license.txt'); leaveMiniBuffer()",
	"ALT+H CTRL+D":		"find_file('docs/update.txt');	leaveMiniBuffer()",
	/* current bug: when you have a chord and then a single note you have to have a minibuffer message */
	"ALT+H T":			"find_file('docs/tutorial.txt'); minibuffer_message('Loading Tutorial...');",
	"ALT+H B":			"find_file('docs/keys.rel'); minibuffer_message('Loading KeyBinding Notes...');",
	"ALT+H R":			"find_file('docs/current.rel'); minibuffer_message('Loading Release Notes...');",
	"CTRL+X U":			"undo(); minibuffer_message('Undo');",
	"CTRL+Z":			"keyWithRepeat(undo);",
	"CTRL+X CTRL+S":	"save();",
	
	/* quick patch - on Mac these need to be explicit for some reason */
	"SHIFT+3":			"addCharCodeToPosition('#'); positionCaret()",
	"SHIFT+4":			"addCharCodeToPosition('$'); positionCaret()",
	/* and they don't even work on firefox, odd. workaround: */
	"CTRL+SHIFT+H":		"addCharCodeToPosition('#'); positionCaret()",
	"CTRL+SHIFT+D":		"addCharCodeToPosition('$'); positionCaret()",
	
	
	"CTRL+X L": 		"run_minibuffer_command('eval_line'); minibuffer_message('Running Line ' + getLineIdNumber(active_line) + '...');",
	"F8":				"run_minibuffer_command('eval_buffer');",
	
	/* example of long chord */
	"CTRL+X ALT+H CTRL+S":	"alert('Long Chord!'); leaveMiniBuffer();"
};
