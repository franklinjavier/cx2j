
function XML2jsobj(node) {

    var	data = {};

    // append a value
    function Add(name, value) {
        if (data[name]) {
            if (data[name].constructor != Array) {
                data[name] = [data[name]];
            }
            data[name][data[name].length] = value;
        }
        else {
            data[name] = value;
        }
    };

    // element attributes
    var c, cn;
    for (c = 0; cn = node.attributes[c]; c++) {
        Add(cn.name, cn.value);
    }

    // child elements
    for (c = 0; cn = node.childNodes[c]; c++) {
        if (cn.nodeType == 1) {
            if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
                // text value
                Add(cn.nodeName, cn.firstChild.nodeValue);
            }
            else {
                // sub-object
                Add(cn.nodeName, XML2jsobj(cn));
            }
        }
    }

    return data;

}
