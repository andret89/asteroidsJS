/*
 * caricameto file javascript nella pagina html in modo dinamico
 * @function
 */
function loadScripts() {
    var directory = 'js/';
    var extension = '.js';
    var type = "text/javascript";
    var files = [
        'utils',
        'inputs',
        'entity',
        'bullet',
        'player',
        'asteroid',
        'canvas',
        'menu',
        'game',
        'state',
        'main'
    ];
    // aggiunge elementi script al tag html head
    for (var i in files) {
        var path = directory + files[i] + extension;
        var elem = document.createElement("script");
        elem.src = path;
        elem.type = type;
        document.getElementsByTagName('head')[0].appendChild(elem);
    }
    console.log("file javascript caricati");

}
// invocazione al momento della lettuta
loadScripts()