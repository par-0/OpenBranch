// Support for PNG based file loading for JavaScript
// OpenBranch by par0

var CompiledFileFormat = {
	ConvertToText: function(img) {
		var NewCanvas = document.getElementById("offscreen");
		NewCanvas.width = img.width;
		NewCanvas.height = img.height;
		NewCanvas.getContext("2d").drawImage(img, 0, 0);
		
		var ImageData = NewCanvas.getContext("2d").getImageData(0, 0, img.width, img.height);
		var ArrayData = ImageData.data;
		var Text = "";
		
		for (var i = 0, n = ArrayData.length; i < n; i += 4) {
			var r = ArrayData[i]; 
			console.log(r);
			var g = ArrayData[i+1]; 
			var b = ArrayData[i+2]; 
			if (r > 0)
				Text += String.fromCharCode(r-1);
			if (g > 0)
				Text += String.fromCharCode(g-1);
			if (b > 0)
				Text += String.fromCharCode(b-1);
		}
		
		return Text;
	}
}