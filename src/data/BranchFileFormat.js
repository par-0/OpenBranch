// BranchFileFormat parser 
// OpenBranch by par0

/*
	SYMBOLS:
		jmp: jump (jump location)
		ljmp: jump without continuing / move to current function (jump location)
		opt: add option (jump location, string)
		init: create variable (name)
		var: edit variable (name, content)
		txt: add text (content)
		oclr: clear options
		tclr: clear text
		def: define function start (name) [handled by the preprocessor]
*/

function DebugFindPosition(str1, str2, len) {
	for (var i = 0; i < len; i++) {
		if (str1[i] != str2[i]) {
			console.log(str1[i] + " != " + str2[i]);
			console.log("equals check FAILED");
			return false;
		}
	}
	console.log("equals check COMPLETE");
	return true;
}

var BranchFileFormat = {
	Parser: {
		VariableList: [],
		Preprocessor: {
			FindSymbols: function(data) {
				var SymbolList = [];
				SymbolList["main"] = {Symbols: new Array()};
				
				var CurrentDefinition = "main";
				var Lines = data.split("\n");
				
				for (var i = 0; i < Lines.length; i++) {
					var Words = Lines[i].split(" ");
					
					if (Words[0] == "def") {
						var Definition = IterateString(Words, 1);
						CurrentDefinition = Definition.replace("\r", "");
						
						SymbolList[CurrentDefinition] = {Symbols: new Array()};
					} else {
						if (Lines[i].length > 1 && Lines[i] != "\n") {
							SymbolList[CurrentDefinition].Symbols.push(Lines[i]);
						}
					}
				}
			
				console.log("Preprocessed file. Found " + SymbolList.length + " symbols");
			
				return SymbolList;
			}
		},
		ReplaceVariables: function(str) {
			var NewString = str;
			for (var name in this.VariableList) {
				NewString = NewString.replace("${"+name+"}", this.VariableList[name]);
			}
			return NewString;
		},
		ExecuteCode: function(symbols, str) {
			var Words = this.ReplaceVariables(str).replace("\r", "").split(" ");
			var Symbol = Words[0];
			var StopRequest = false;
			
			if (Symbol == "jmp") {
				for (let name in symbols) {
					name = name.replace("\r","");
					if (name == Words[1]) {
						var array = symbols[name].Symbols;
						for (var i = 0; i < array.length; i++) {
							if (this.ExecuteCode(symbols, array[i])) // if true, stop request
								break;
						}
					}
				}
			} else if (Symbol == "ljmp") {
				StopRequest = true;
				for (var name in symbols) {
					if (name == Words[1]) {
						var array = symbols[name].Symbols;
						for (var i = 0; i < array.length; i++) {
							if (this.ExecuteCode(symbols, array[i])) // if true, stop request
								break;
						}
					}
				}
			} else if (Symbol == "opt") {
				var OnClickEvent = "BranchFileFormat.Parser.ExecuteCode(GlobalSymbols, 'jmp " + Words[1] + "');";
				var OptionName = IterateString(Words, 2, " ");
				document.getElementById("option_id").innerHTML += '<a id="option_id_sl" href="#" onclick="' + OnClickEvent + 'return false;">' + OptionName + '</a>';
			} else if (Symbol == "init") {
				// Init a variable called [argument 1]
				this.VariableList[Words[1]] = "";
			} else if (Symbol == "var") {
				// Edit a variable called [argument 1] and change it's value to [argument 2+]
				this.VariableList[Words[1]] = IterateString(Words, 2, " ");
			} else if (Symbol == "log") {
				console.log(IterateString(Words, 1, " "));
			} else if (Symbol == "oclr") {
				document.getElementById("option_id").innerHTML = "";
			} else if (Symbol == "txt") {
				// change later maybe
				document.getElementById("text_id").innerHTML += IterateString(Words, 1, " ") + "<br>";
			} else if (Symbol == "nl") {
				document.getElementById("text_id").innerHTML += "<br>";
			} else if (Symbol == "tclr") {
				// change later maybe
				document.getElementById("text_id").innerHTML = "";
			} else {
				console.log("Undefined symbol " + Symbol);
			}
			return StopRequest;
		}
	},
	SymbolCreation: {
		// do this eventually
		// add math lib aswell
	}
}
