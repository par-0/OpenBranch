console.log("OpenBranch by par0");
 
var img = new Image();
img.onload = function() {
	console.log(CompiledFileFormat.ConvertToText(img));
};
img.src = 'game.png'; 
img.crossorigin = 'Anonymous'
img.setAttribute('crossOrigin', '');
 
 
var GlobalSymbols = 0;
document.getElementById('file').onchange = function(){
  var file = this.files[0];
  var reader = new FileReader
  
  reader.onload = function(progressEvent){
    GlobalSymbols = BranchFileFormat.Parser.Preprocessor.FindSymbols(this.result);
	BranchFileFormat.Parser.ExecuteCode(GlobalSymbols, "jmp main");
	
  };
  reader.readAsText(file);
};