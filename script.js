
const queueSize = document.getElementById('queueSize');

var officialA, officialB, officialC;
var aIsWorking = false;
var bIsWorking = false;
var cIsWorking = false;
var queue;
var clients = 0;
var clients_arr = []
var rejected = 0;
var served = 0;
var generateClient;
var mean = 0;
var stdev = 0;
var scale = 0;
var mu = 0;
var counter = 0;

document.getElementById('okButton').addEventListener('click', () => {
    queueFunction();

    mean = parseInt(document.getElementById('mean').value);
    stdev = parseInt(document.getElementById('stdev').value);
    scale = parseInt(document.getElementById('scale').value);
    mu = parseInt(document.getElementById('mu').value);

    addOfficials();

    document.getElementById('okButton').disabled = true;

    nextClient(exponential());
});

// rozkład wykładniczy
function exponential(){
    let u = Math.random();
    return scale * (-Math.log(1.0 - u)/mu);
}

// nowi klienci do kolejki
function nextClient(nextClientTime){
    if(nextClientTime < 1){
        nextClient(exponential());
        return;
    }
    let timer = Math.floor(nextClientTime);
    console.log(timer);

    counter = setInterval(() => {
        console.log(timer);
        timer = timer - 1;
        if(timer == 0){
            clearInterval(counter);
            addClient();
            nextClient(exponential());
        }
    },1000);
}

// działania na kolejce
function queueFunction(){
    queue = new Worker('../generateQueue.js');

    queue.onmessage = (event) => {
        if(event.data.type === 'addOk'){
            clients = event.data.value;
            document.getElementById('queueInfo').innerHTML = event.data.value;
        }

        if(event.data.type === 'addError'){
            rejected = rejected + 1;
            document.getElementById('rejected').innerHTML = rejected;               
        }
        if(event.data.type === 'removeClient'){
            if(!aIsWorking){
                aIsWorking = true;
                officialA.postMessage({"command":"start", "value": event.data.value});
                return;
            }
            if(aIsWorking && !bIsWorking){
                bIsWorking = true;
                officialB.postMessage({"command":"start", "value": event.data.value});
                return;
            }
            if(!cIsWorking && bIsWorking && aIsWorking)
            {
                cIsWorking = true;
                officialC.postMessage({"command":"start", "value": event.data.value});
                return;                
            }
        }
        if(event.data.type === 'deleteOk'){
            clients = event.data.value;
            document.getElementById('queueInfo').innerHTML = event.data.value;
        }
    };
    if(clients > 0 && (!aIsWorking || !bIsWorking || !cIsWorking)){
        queue.postMessage({"command": "removeClient"});            
    }
    queue.postMessage({"command": "create", "size": parseInt(queueSize.value)});
}


// wygenerowanie klienta i próba dodania do kolejki
function addClient(){
    generateClient = new Worker("../generateClient.js");
    let arr = [];
    arr.push(mean);
    arr.push(stdev);
    generateClient.postMessage({"command": "start", "value": arr});

    generateClient.onmessage = (event) => {
        queue.postMessage({"command": "addClient", "value": event.data.value});
        generateClient.terminate();
    }
}

// dodanie urzędników
function addOfficials(){
    officialA = new Worker('../official.js');
    officialB = new Worker('../official.js');
    officialC = new Worker('../official.js');

    officialA.postMessage({"command": "create", "value": "A"});
    officialB.postMessage({"command": "create", "value": "B"});
    officialC.postMessage({"command": "create", "value": "C"});

    officialA.onmessage = (event) => {
        if(event.data.type === 'readyToWork' && event.data.value === true){
            aIsWorking = true;
        }

        if(event.data.type === 'readyToWork' && event.data.value === false){
            aIsWorking = false;
        }

        if(event.data.type === 'served'){
            served = served + 1;
            document.getElementById('served').innerHTML = served;
        }

        if(event.data.type === 'timer'){
            document.getElementById('officialAInfo').innerHTML = event.data.value;
        }
        if(event.data.type === 'status'){
            document.getElementById('officialAStatus').innerHTML = event.data.value;
        }
    }

    officialB.onmessage = (event) => {
        if(event.data.type === 'readyToWork' && event.data.value === false){
            bIsWorking = false;
        }

        if(event.data.type === 'readyToWork' && event.data.value === true){
            bIsWorking = true;
        }

        if(event.data.type === 'served'){
            served = served + 1;
            document.getElementById('served').innerHTML = served;
        }

        if(event.data.type === 'timer'){
            document.getElementById('officialBInfo').innerHTML = event.data.value;
        }
        if(event.data.type === 'status'){
            document.getElementById('officialBStatus').innerHTML = event.data.value;
        }
    }

    officialC.onmessage = (event) => {
        if(event.data.type === 'readyToWork' && event.data.value === false){
            cIsWorking = false;
        }

        if(event.data.type === 'readyToWork' && event.data.value === true){
            cIsWorking = true;
        }

        if(event.data.type === 'served'){
            served = served + 1;
            document.getElementById('served').innerHTML = served;
        }

        if(event.data.type === 'timer'){
            document.getElementById('officialCInfo').innerHTML = event.data.value;
        }
        if(event.data.type === 'status'){
            document.getElementById('officialCStatus').innerHTML = event.data.value;
        }
    }
}


setInterval(() => {
    if(clients > 0 && (!aIsWorking || !bIsWorking || !cIsWorking)){
        queue.postMessage({"command": "removeClient"});            
    }
    console.log(clients);
    console.log('A: ' + aIsWorking + ', B: ' + bIsWorking + ", C: " + cIsWorking);
}, 500);