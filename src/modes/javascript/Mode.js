show_editor_message("applying javascript mode");


//save the fundamental newline function
org_newline = window.editor_new_line;

//install xml newline function
window.editor_new_line = function() {
	org_newline();
	
	var prevline = getLine(getLineIdNumber(active_line)-1);
	var plinetxt = getLinePlainText( prevline,0,getLineLength(prevline) );
	
	var scount = 0;
	for(var q=0; q<plinetxt.length; q++) {
		var ccode = plinetxt.toString().charCodeAt(q);
		//FF says a space is 32 and safari says its 160
		if(ccode == 32 || ccode == 160)
			scount++;
		else
			break;
	}
	
	var tcount = scount / tab_size;
	for(var q=0; q<tcount; q++)
		insert_tab();
	
	if(Sortie.Util.Browser.Explorer) {
		BINDINGS["SHIFT+OPENBRACE"] = "addStringToCurrentPosition('{'); run_minibuffer_command('auto_brace')";
		BINDINGS["SHIFT+9"] = "addStringToCurrentPosition('('); run_minibuffer_command('auto_paren')";
		BINDINGS["OPENBRACE"] = "addStringToCurrentPosition('['); run_minibuffer_command('auto_bracket')";
	} else {
		BINDINGS["SHIFT+OPENBRACE"] = "run_minibuffer_command('auto_brace')";
		BINDINGS["SHIFT+9"] = "run_minibuffer_command('auto_paren')";
		BINDINGS["OPENBRACE"] = "run_minibuffer_command('auto_bracket')";
	}
}

window.extensions.auto_brace = function(){
	window.extensions.add_single_char_before_cursor("}");
}

window.extensions.auto_paren = function(){
	window.extensions.add_single_char_before_cursor(")");
}

window.extensions.auto_bracket = function(){
	window.extensions.add_single_char_before_cursor("]");
}

window.extensions.add_single_char_before_cursor = function(chara) {
	addStringToCurrentPosition(chara);
	active_column = active_column - 1;
	positionCaret();
}