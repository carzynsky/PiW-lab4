var clients = [];
var maxSize = 0;

// próba dodania klienta do kolejki
function addClient(client){
    if(clients.length < maxSize){
        clients.push(client);
        postMessage({"type": "addOk", "value": clients.length});
    } 
    else{
        postMessage({"type": "addError", "value": "Kolejka jest pełna!"})     
    }
}

// usunięcie klienta z kolejki
function removeFromQueue(){
    postMessage({"type": "removeClient", "value": clients[0]});
    clients.shift();
    postMessage({"type": "deleteOk", "value": clients.length});
}

self.onmessage = (event) => {
    if(event.data.command === 'create'){
        maxSize = event.data.size;
        postMessage({"type": "message", "value": "Utworzono kolejke o rozmiarze: " + maxSize});
        return;
    }
    if(event.data.command === 'addClient'){
        addClient(event.data.value);
        return;
    }
    if(event.data.command === 'removeClient'){
        removeFromQueue();
    }
}

setInterval(() => {
    console.log(clients);
}, 1000);