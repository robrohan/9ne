<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>9ne</title>
	<meta name="author" content="Rob Rohan">
	
	<!-- just include all of Sortie -->
	<script type="text/javascript" src="libs/Sortie_0.6.6.js" encoding="utf-8"></script>
	<script type="text/javascript">
		Sortie.Core.$({
			include:new Array(
				<?php
					$user_agent = (isset($_SERVER['HTTP_USER_AGENT'])) ? strtolower($_SERVER['HTTP_USER_AGENT']) : "";
					if(stristr($user_agent, "Mac")) {
						print('"bindings/MacBindings.js",');
					} else {
						print('"bindings/WindowsBindings.js",');
					}
				?>
				"9ne_@VERSION@.js"
			)
		});
		Sortie.Core.Include();
	</script>
	
	<script type="text/javascript">
		INSTALL_LOCATION = "http://localhost";
		MAIN_FILE = "9ne.php";
	</script>
	
	<link rel="stylesheet" type="text/css" href="style/Editor.css" encoding="utf-8">
	<link rel="stylesheet" type="text/css" href="style/themes/Default.css" encoding="utf-8">
</head>
<body onload="initEditor(); editor_focus();" onbeforeunload="return kill_9ne(); false; editor_focus();" onfocus="editor_focus();" onblur="editor_focus();">
	<div id="editor" onmousedown="editor_focus()" onfocus="editor_focus();" onblur="editor_focus();">
		<div onmousedown="editor_focus()" id="editorgutter" onfocus="editor_focus();" onblur="editor_focus();"></div>
		<div onmousedown="editor_focus()" id="editortext" onfocus="editor_focus();" onblur="editor_focus();"></div>
	</div>
	<div id="statusbar">-u:-- *scratch* (1,0) (Text)</div>
	<input type="text" id="minibuffer" onblur="editor_focus();" onfocus="editor_focus();" disabled>
	<span id="editorCaret">W</span>
	<span id="editorSecondCaret">W</span>
	<span id="editorMessages"></span>
	
	<div id="offscreen" style="position: absolute; top: -10000px; left: -10000px;">
	<form>
	<textarea id="fakefocus" onchange="if(this.value.length > 1){ alert(this.value); this.value = ''; editor_focus(); }"></textarea>
	<textarea id="fakefocus2" onfocus="editor_focus();"></textarea>
	</form>
	</div>
	<div id="dialog" 
		style="position: absolute; top: -100000px; left: -100000px; max-height: 300px; max-width: 300px; z-index: 2000; color: red; background: white; overflow: auto;"
		onblur="editor_focus()"
	>TEST!</div>
</body>
</html>
