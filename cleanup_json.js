var fs = require('fs');

fs.readFile('js/data/elements.json', function (err, data) {
	if (err) throw err;
	
	var elements = JSON.parse(data);
	for (var i in elements) {
		if (elements[i].stroke_color) {
			continue;
		};
		elements[i].color = "#D9FEFF";
		elements[i].stroke_color = "#C9FEFF";
	}

	fs.writeFile('js/data/elements.json', JSON.stringify(elements));
});