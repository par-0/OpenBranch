document.getElementById('file').onchange = function(){
  var file = this.files[0];
  var reader = new FileReader
  
  reader.onload = function(progressEvent){
    var symbols = BranchFileFormat.Parser.Preprocessor.FindSymbols(this.result);
	BranchFileFormat.Parser.ExecuteCode(symbols, "jmp main");
	
  };
  reader.readAsText(file);
};