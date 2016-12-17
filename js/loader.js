/*
 * caricameto file javascript nella pagina html in modo dinamico
 */
function loadScripts() {
    var directory = 'js/';
    var extension = '.js';
    var type = "text/javascript"
    var files = [
        'utils',
        'polygon',
        'asteroid',
        'ship',
        'canvas',
        'points',
        'game',
        'main'
    ];
    // aggiunge elementi script al tag html head
    for (var file of files) {
        var path = directory + file + extension;
        var elem = document.createElement("script");
        elem.src = path;
        elem.type = type;
        document.getElementsByTagName('head')[0].appendChild(elem);
    }

    console.log("file javascript caricati");
}

// invocazione al momento della lettuta
loadScripts()