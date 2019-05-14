// Various string utilities
// OpenBranch by par0

function IterateString(str, pos, add = "") {
	var EndString = "";
	for (var i = pos; i < str.length; i++) { 
		EndString += str[i] + add;
    }
	return EndString;
}

function Log(str) {
	if (DEBUG) 
		console.log("[Debug] " + str);
}