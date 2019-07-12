const fs = require('fs');
const path = require('path');

var mkdir = function(dir) {
	// making directory without exception if exists
	try {
		fs.mkdirSync(dir, 0755);
	} catch(e) {
		if(e.code != "EEXIST") {
			throw e;
		}
	}
};

const copy = function(src, dest) {
	var oldFile = fs.createReadStream(src);
	var newFile = fs.createWriteStream(dest);
	oldFile.pipe(newFile);
};

const copyDir = function(src, dest) {
	mkdir(dest);
	var files = fs.readdirSync(src);
	for(var i = 0; i < files.length; i++) {
		var current = fs.lstatSync(path.join(src, files[i]));
		if(current.isDirectory()) {
			copyDir(path.join(src, files[i]), path.join(dest, files[i]));
		} else if(current.isSymbolicLink()) {
			var symlink = fs.readlinkSync(path.join(src, files[i]));
			fs.symlinkSync(symlink, path.join(dest, files[i]));
		} else {
			copy(path.join(src, files[i]), path.join(dest, files[i]));
		}
	}
};

const init = async () => {
    // Check if current directory is a codeceptjs directory
    if (!fs.existsSync(path.join(process.cwd(), 'codecept.conf.js'))) {
        console.log('Not a codeceptjs project (no codecept.conf.js found)');
        process.exit(1);
    }

    // Copy support files to current directory
    console.log('Copying support files to _codepress')
    copyDir(path.join(__dirname, '_codepress'), path.join(process.cwd(), '_codepress'));
}

module.exports = {
    init,
};