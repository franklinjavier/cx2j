/*
 * Convert XML to JSON with HTML5 File API (drag n drop)
 * author: @franklinjavier
 * date: march 2012
 *
 * dependencies and credits
 * ObjTree.js / jkl-dumper.js -> http://jsontoxml.utilities-online.info/
 * minify.json.js -> http://bigaqua.org/minify_json.html
 *
 *
 * TODO Alem da opcao inicial de minificar, criar outra opcao (ou melhorar a existente) 
 * para minificar o resultado do textarea
 *
 */

;(function( window, document, undefined ) { 

    var app = (function() {

        var _extensionAllow = /xml/;

        function init() {
        
            if ( window.File && window.FileReader && window.FileList && window.Blob ) {

                // Setup the dnd listeners
                var dropZone = document.getElementById('dropZone');
                dropZone.addEventListener( 'dragover', handleDragOver, false );
                dropZone.addEventListener( 'dragleave', handleDragLeave, false );
                dropZone.addEventListener( 'drop', readBlob, false );

                // Click on textarea select all content
                document.getElementById('result').onclick = function() {
                    this.select();
                }

            } else { 
                document.getElementById('wrapper').className = 'hide';
                alert('The File APIs are not fully supported in this browser :(');
            }
        
        }

        function readBlob( evt ) {

            evt.stopPropagation();
            evt.preventDefault();

            // reset message 
            document.getElementById('messageOk').className = 'hide';

            var files = evt.dataTransfer.files[ 0 ]; // FileList object

            // Drop a file with an extension not allowed
            if ( !_extensionAllow.test( files.type ) ) {

                evt.target.className = 'drag-not-allow';
                document.getElementById('messageError').className = 'show';

                setTimeout(function() {
                    evt.target.className = '';
                    document.getElementById('messageError').className = 'hide';
                }, 2000);

                return false;

            } 

            evt.target.className = '';

            var reader = new FileReader(),
                start =  0,
                stop = files.size - 1,
                result = document.getElementById('result');

            // If we use onloadend, we need to check the readyState.
            reader.onloadend = function( evt ) {

                if ( evt.target.readyState == FileReader.DONE ) { // DONE == 2

                    var xotree = new XML.ObjTree(),
                        dumper = new JKL.Dumper(),
                        tree = xotree.parseXML( evt.target.result ),
                        resultJson = dumper.dump( tree )
                        resultContent = '';

                    document.getElementById('minify').checked === true ? 
                        resultContent = JSON.minify( resultJson ) :
                        resultContent = resultJson; 

                    result.textContent = resultContent;
                    result.select();
                    document.getElementById('byteRange')
                        .innerText = 'Read bytes: ' + files.size + ' byte file';

                    document.getElementById('messageOk').className = 'show';
                    evt.target.className = '';

                }

            };

            //reader.readAsBinaryString( files ); // Encoding problem
            reader.readAsText( files );
        }

        function handleDragOver( evt ) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy
            evt.target.className = 'active';
        }

        function handleDragLeave(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.target.className = '';
        }

        return {
            init: init
        }
    
    })();

    app.init();

})( window, document );
