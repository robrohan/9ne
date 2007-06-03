show_editor_message("applying xml mode");
	
//save the fundamental newline function
org_newline = window.editor_new_line;
	
//install xml newline function
window.editor_new_line = function() {
	org_newline();
	
	var prevline = getLine(getLineIdNumber(active_line)-1);
	var plinetxt = getLinePlainText( prevline, 0, getLineLength(prevline) );
	
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
}

window.extensions.add_tag = function(params) {
	this.cue = "Add Tag:"
	
	if(typeof params != "undefined") {
		var tagfragment = "&lt;" + params.toString() + "&gt;" + "&lt;/" + params.toString() + "&gt;";
	
		addStringToCurrentPosition(tagfragment);
		active_column = active_column - (params.toString().length + 3);
		positionCaret();
	}
}
