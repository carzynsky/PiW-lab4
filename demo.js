var i = 0;
var time = 0;
var running = false;

function timedCount(){
    if(running){
        i = i + 1;
        postMessage({"type": "i", "value": i});
        setTimeout(timedCount, time);
    }
}

self.onmessage = (event) => {
    if(event.data.command === 'start'){
        i = event.data.i;
        time = event.data.time;
        running = true;
        postMessage({"type": "i", "value": i});
        postMessage({"type": "time", "value": time});
        timedCount();
        return;
    }

    if(event.data.command === 'stop'){
        running = false;
        return;
    }
    if(event.data.command === 'faster'){
        time -= 100;
        if(time < 0){
            time = 0;
        }
        postMessage({"type": "time", "value": time});
        return;
    }
    if(event.data.command === 'slower'){
        time += 100;
        if(time > 10000){
            time = 10000;
        }
        postMessage({"type": "time", "value": time});
        return;
    }
}