const fs = require('fs');
const mkdir = function(dir) {
	// making directory without exception if exists
	try {
		fs.mkdirSync(dir);
	} catch(e) {
		if(e.code != 'EEXIST') {
			throw e;
		}
	}
};

module.exports = mkdir;
