// BranchFileFormat parser 
// OpenBranch by par0

/*
	SYMBOLS:
		jmp: jump (jump location)
		mov: jump without continuing / move to current function (jump location)
		opt: add option (string, jump location)
		clo: clear options
		var: create variable (name)
		edt: edit variable (name, content)
		txt: add text (content)
		cls: clear text
		def: define function start (name) [handled by the preprocessor]
*/

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
						CurrentDefinition = Definition;
						
						SymbolList[CurrentDefinition] = {Symbols: new Array()};
					} else {
						if (Lines[i].length > 1 && Lines[i] != "\n") {
							SymbolList[CurrentDefinition].Symbols.push(Lines[i]);
						}
					}
				}
			
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
			var Words = this.ReplaceVariables(str).split(" ");
			var Symbol = Words[0];
			var StopRequest = false;
			
			if (Symbol == "jmp") {
				for (var name in symbols) {
					if (name == Words[1]) {
						var array = symbols[name].Symbols;
						for (var i = 0; i < array.length; i++) {
							if (this.ExecuteCode(symbols, array[i])) // if true, stop request
								break;
						}
					}
				}
			} else if (Symbol == "mov") {
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
			
			} else if (Symbol == "var") {
				// Init a variable called [argument 1]
				this.VariableList[Words[1]] = "";
			} else if (Symbol == "edt") {
				// Edit a variable called [argument 1] and change it's value to [argument 2+]
				this.VariableList[Words[1]] = IterateString(Words, 2, " ");
			} else if (Symbol == "log") {
				console.log(IterateString(Words, 1, " "));
			} else if (Symbol == "cls") {
			
			} else if (Symbol == "txt") {
			
			} else if (Symbol == "def") {
				// preprocessor handled
			}
			return StopRequest;
		}
	}
}