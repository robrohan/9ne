show_editor_message("applying text mode");
	
	/* addlineInsertListener(
		function(line)
		{
			//alert(line);
			//var alltextwords = new Array();
			plaintext = getLinePlainText(line, 0, getLineLength(line));
			var alltextwords = plaintext.toString().split(" ");
			
			alert("all: " + alltextwords.length);
			
			for(var x=0; x<alltextwords.length; x++)
			{
				var word = alltextwords[x];
				
				//remove anything that is not a letter
				try
				{
					var cleanword = word.match(/[A-Za-z\']+/);
					
					if(cleanword == "")
					{
						//nextWord();
						continue;
					}
					
					//seach
					var area = binarySearch(words, 0, words.length, cleanword);
					
					if(area.match < 0)
					{
						//if this starts with a capital letter, try again
						//lowering the first letter to catch "If", "This",
						//and all caped titles.
						var caps = cleanword.toString().match(/[A-Z]+/);
						
						if(caps != null && caps != "")
						{
							//alert(cleanword.toString().toLowerCase())
							var lwr = cleanword.toString().toLowerCase();
							processWord(lwr);
							return;
						}
						
						//if this word has already been checked once skip it
						//(becuase there is just replace all)
						
						alert(word);
						var reg = new RegExp("(.*)("+word+")(.*)","ig");
						plaintext = plaintext.replace(reg,"$1<span class='attention'>$2</span>$3");
						
					}
					else
					{
						//nextWord();
						continue;
					}
				}
				catch(e)
				{
					//
				}
			}
			alert(plaintext);
			line.innerHTML = plaintext;
		}
	); */