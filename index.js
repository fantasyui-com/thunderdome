
const watch = require('watch');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

module.exports = function(options){

  let busy = false;
  options.dir = path.resolve(options.dir);
  if(options.watch) {
    watch.watchTree(options.dir, function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
     // Finished walking the tree
     reshape(options);
    } else if (prev === null) {
     // f is a new file
     reshape(options);
    } else if (curr.nlink === 0) {
     // f was removed
     reshape(options);
    } else {
     // f was changed
     reshape(options)
    }
  });
  } else {
    reshape(options);
  }

  function reshape(options){

    if (busy) return;

    busy = true;
    var files = fs.readdirSync(options.dir).filter(i=>path.basename(i).match(/^[a-z0-9]/i));

    const fileSorter = function(a, b) {
      return fs.statSync(path.join(options.dir, a)).mtime.getTime() - fs.statSync(path.join(options.dir, b)).mtime.getTime();
    };

    var selected = files.sort(fileSorter).reverse().map(i=>({
      src: path.join(options.dir, i),
      tmp: path.join(options.dir, uuidv4() + '.tmp'),
      nom: path.basename(i),
      ext: path.extname(i),
    }));

    // console.log();
    // console.log(options.dir)
    //console.log(selected);

    sorted = selected.slice(0,26);
    deadly = selected.slice(26, selected.length)

    // console.log("selected >>>>>>>>>>>>>", selected.length);
    // console.log("sorted >>>>>>>>>>>>>", sorted.length);
    // console.log("deadly >>>>>>>>>>>>>", deadly.length);

    deadly.forEach(function(i,x){
      fs.unlinkSync(i.src);
      //console.log( 'fs.unlinkSync', i.src );
    });

    sorted.forEach(function(i,x){
      fs.renameSync(i.src, i.tmp);
      //console.log( 'fs.renameSync', i.src, i.tmp );
    });

    sorted.forEach(function(i,x){
      const letter = String.fromCharCode(x+97);
      fs.renameSync(i.tmp, path.join(options.dir, letter+i.ext));
      //console.log( 'fs.renameSync', i.tmp, path.join(options.dir, letter+i.ext) );
    });


    busy = false;
  }

};
