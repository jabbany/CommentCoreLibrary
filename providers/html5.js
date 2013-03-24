// html5 media shim

function html5_init(){
	window.media = $_('html5Media');
    
    media.addEventListener('loadedmetadata', function() {
        load("tests/"+cid+".xml");
    }, false)
    
    media.addEventListener('play', function() {
        resume();
    }, false)
    
    media.addEventListener('pause', function() {
        stop();
    }, false)
    
    media.addEventListener('seeked', function() {
        playhead = media.currentTime * 1000;
        resume();
    }, false)
    
    media.addEventListener('ended', function() {
        cm.clear();
    }, false)
}