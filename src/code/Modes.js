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
function ModeRule() {
	this.name = "";
	this.regex = null;
	this.replace = null;
}

function loadModeFile(filename) {
	resetMode();
	show_editor_message("Loading Mode: " + filename);
	
	var pipe2 = new Sortie.IO.Pipe().GetInstance();
	//var remote = new JSRemote(httpcon, true);
	var gateway2 = new Sortie.IO.Gateway(pipe2,true);
	
	gateway2.DoRequest({
		method:"GET",
		url:"modes/"+filename+"/Mode.js", 
		handler:function(e) {
			//var props = new Sortie.Util.Properties();
			//props.Parse(e.responseText);
			//alert(e.responseText);
			eval(e.responseText);
			show_editor_message("Running Mode Code");
			
			//modePropertiesToRules(props);
			//repaint_text();
		},
		error_handler:function(e){ show_editor_message("Error Loading Mode. (" + e.status + ")") }
	});
	
	//load a "normal" file (and assume it's on the server)
	//var httpcon = new HTTPConnectFactory().getInstance();
	var pipe = new Sortie.IO.Pipe().GetInstance();
	//var remote = new JSRemote(httpcon, true);
	var gateway = new Sortie.IO.Gateway(pipe,true);
	
	gateway.DoRequest({
		method:"GET",
		url:"modes/"+filename+"/Rules.properties", 
		handler:function(e) {
			var props = new Sortie.Util.Properties();
			props.Parse(e.responseText);
			
			//alert(e.responseText)
			
			modePropertiesToRules(props);
			repaint_text();
		},
		error_handler:function(e){ show_editor_message("Error Loading Mode. (" + e.status + ")") }
	});
}

function modePropertiesToRules(props) {
	var keyarray = new Array();
	keyarray = props.PropertyNames();
	
	window.mode_syntax_rules = new Sortie.Util.Map();
	
	for(var j=0; j<keyarray.length; j+=3)
	{
		var ruleregex = new RegExp(props.GetProperty(keyarray[j]), props.GetProperty(keyarray[j+1]));
		var replace = props.GetProperty(keyarray[j+2]);
		var name = keyarray[j].substring(0,keyarray[j].indexOf("."));
		
		var mr = new ModeRule();
		mr.name = name;
		mr.regex = ruleregex;
		mr.replace = replace;
		
		window.mode_syntax_rules.Put(name, mr);
	}
	
	//alert(window.mode_syntax_rules.Get("literal2"));
}

function resetMode() {
	//clear any old rules
	mode_syntax_rules = new Sortie.Util.Map();
	lineInsertListeners = new Array();
}
