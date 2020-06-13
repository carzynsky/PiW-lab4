// random todo
var problemTime = 0
var working = false;
var name;
var timeOut;

function solveProblem(){
    if(working){
        if(problemTime >= 0){
            postMessage({"type": "timer", "value": problemTime});
            postMessage({"type": "status", "value": "Pracuje"});
            problemTime = problemTime - 1;
            timeOut = setTimeout(solveProblem, 1000);
            postMessage({"type": "readyToWork", "value": working});
        }
        else{
            working = false;
            clearTimeout(timeOut);
            postMessage({"type": "status", "value": "Jestem wolny"});
            postMessage({"type": "readyToWork", "value": working});
            postMessage({"type": "served"});
        }

    }
}

self.onmessage = (event) => {
    if(event.data.command === 'start'){
        problemTime = event.data.value;
        working = true;
        solveProblem();
        return;
    }
    if(event.data.command === 'create'){
        name = event.data.value;
        postMessage({"type": "readyToWork", "value": working});
        postMessage({"type": "status", "value": "Jestem wolny"});
        return;
    }
}
