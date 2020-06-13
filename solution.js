class Landscape{
    constructor(blocks, maxAltitude, minAltitude){
        this.blocks = blocks;
        this.maxDepth = 0;
        this.maxAltitude = maxAltitude;
        this.minAltitude = minAltitude;
        this.A = [];
    }
    
    randomAltitudes(){
        for(var i=0; i<this.blocks; i++){
        this.A.push(Math.floor(Math.random() * this.maxAltitude + this.minAltitude));
        }
    }
    
    setMaxDepth(max){
        this.maxDepth = max;
    }
    
    getMaxDepth(){
        return this.maxDepth;
    }
    
    getBlocks(){
        return this.blocks;
    }

    getA(){
        return this.A;
    }
    
}

function solution(len, maxA, minA) {
    var lnd = new Landscape(len, maxA, minA);
    lnd.randomAltitudes();
    let A = lnd.getA();
    let n = len;
    let startIndex = 0;
    let tmpAltitude = 0;
    let tmpIndex = 0;
    let altitudeFirst = 0;
    let lowest = 100000000;
    let started = false;
    
    if(n < 3){
        return 0;
    }
    
    for(var i=0; i<n; i++){
        if(A[i] >= altitudeFirst){
            if(started && i != startIndex+1){
                lnd.setMaxDepth(altitudeFirst - lowest);
                started = false;
                lowest = 100000000;
                tmpAltitude = 0;
            }
            altitudeFirst = A[i];
            startIndex = i;
            started = true;
            postMessage({"type": "message", "value": "Znaleziono nowy najwyższy punkt: " + altitudeFirst})
        }
        else
        {
            if(A[i] > tmpAltitude){
                tmpAltitude = A[i];
                tmpIndex = i;
                postMessage({"type": "message", "value": "Znaleziono drugi najwyższy punkt: " + tmpAltitude})
            }
            if(A[i] < lowest){
                lowest = A[i];
                postMessage({"type": "message", "value": "Znaleziono nowy najniższy punkt: " + lowest})
            }
        }

    }
    if(started){
        postMessage({"type": "message", "value": "Szukanie max głębokości podproblemu..."})
        let tmpLowest = 100000000;
        let tmpHighest = 0;
        lowest = tmpLowest;
        
        for(var i=startIndex+1; i<tmpIndex; i++){
            if(A[i] < lowest){
                lowest = A[i];
            }
        }
        
        if(tmpIndex < n){
            for(var i=tmpIndex+1; i<n; i++){
                if(A[i] <= A[i-1] && A[i] <= tmpLowest){
                tmpLowest = A[i];
                }
                else if(A[i] > tmpHighest){
                    tmpHighest = A[i];
                    let diff = tmpHighest - tmpLowest;
                    if(diff > lnd.getMaxDepth()){
                        lnd.setMaxDepth(diff);
                        postMessage({"type": "message", "value": "Znaleziono wyższy punkt po spadku: " + diff})
                    }
                }
            }
        }
        if((tmpAltitude - lowest) > lnd.getMaxDepth()){
            lnd.setMaxDepth(tmpAltitude - lowest);          
        }
    }
    postMessage({"type": "message", "value": "Znaleziono max głębokość: " + lnd.getMaxDepth()})
    return lnd.getMaxDepth();
}

self.onmessage = (event) => {
    if(event.data.command === 'start'){
        let params = event.data.value;
        let result = solution(params[0], params[1], params[2]);
        postMessage({"type": "result", "value": result});
    }
}