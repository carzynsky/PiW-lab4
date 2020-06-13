const indexInput = document.getElementById('index');
const buttonOk = document.getElementById('okButton');
const buttonCompute = document.getElementById('okButton2');
const taskNumber = document.getElementById('taskNumber');
const taskLink = document.getElementById('linkToTask');
const process = document.getElementById('process');

const blocks = document.getElementById('blocks');
const maxA = document.getElementById('maxAltitude');
const minA = document.getElementById('minAltitude');
const result = document.getElementById('result');

var links = ['https://app.codility.com/programmers/lessons/90-tasks_from_indeed_prime_2015_challenge/flood_depth/', 
'https://app.codility.com/programmers/lessons/17-dynamic_programming/min_abs_sum/',
'https://app.codility.com/programmers/lessons/91-tasks_from_indeed_prime_2016_challenge/dwarfs_rafting/',
'https://app.codility.com/programmers/lessons/91-tasks_from_indeed_prime_2016_challenge/hilbert_maze/',
'https://app.codility.com/programmers/lessons/91-tasks_from_indeed_prime_2016_challenge/tree_product/']

class Landscape{
    constructor(blocks, maxAltitude, minAltitude){
        this.blocks = blocks;
        this.maxAltitude = maxAltitude;
        this.minAltitude = minAltitude;
        this.A = [];
    }

    getA(){
        return this.A;
    }

    randomAltitudes(){
        for(var i=0; i<this.blocks; i++){
            this.A.push(Math.floor(Math.random() * this.maxAltitude + this.minAltitude));
        }
        // this.A = [1,3,2,1,2,1,5,3,3,4,2];
    }

    solution(){
        var startIndex = 0;
        var maxDifference = 0;
        var tmpAltitude = 0;
        var tmpIndex = 0;
        var altitudeFirst = 0;
        var lowest = 100000000;
        var started = false;
        
        if(this.blocks < 3){
            return 0;
        }
        
        for(var i=0; i<this.blocks; i++){
            if(this.A[i] >= altitudeFirst){
                if(started && i != startIndex+1){
                    maxDifference = altitudeFirst - lowest;
                    started = false;
                    lowest = 100000000;
                    tmpAltitude = 0;
                }
                altitudeFirst = this.A[i];
                startIndex = i;
                started = true;
            }
            else
            {
                if(this.A[i] > tmpAltitude){
                    tmpAltitude = this.A[i];
                    tmpIndex = i;
                }
                if(this.A[i] < lowest){
                    lowest = this.A[i];
                }
            }

        }
        if(started){
            var tmpLowest = 100000000;
            var tmpHighest = 0;
            var isPossible = false;
            lowest = tmpLowest;
            
            for(var i=startIndex+1; i<tmpIndex; i++){
                if(this.A[i] < lowest){
                    lowest = this.A[i];
                }
            }
            for(var i=tmpIndex+1; i<this.blocks; i++){
                if(this.A[i] <= this.A[i-1] && this.A[i] <= tmpLowest){
                    tmpLowest = this.A[i];
                }
                else{
                    isPossible = true;
                    if(this.A[i] > tmpHighest){
                        tmpHighest = this.A[i];
                    }
                }
            }
            if(isPossible){
                if((tmpHighest - tmpLowest) > maxDifference){
                    maxDifference = tmpHighest - tmpLowest;
                }
            }
            if((tmpAltitude - lowest) > maxDifference){
                maxDifference = tmpAltitude - lowest
            }
        }
        return maxDifference;
    }
}

buttonOk.addEventListener('click', () => {
    task = parseInt(indexInput.value) % 5;
    taskNumber.textContent = task;
    taskLink.href = links[task];
})

buttonCompute.addEventListener('click', () => {
    let arr = [parseInt(blocks.value), parseInt(maxA.value), parseInt(minA.value)];
    var ul = document.getElementById('processList');
    ul.innerHTML = "";
    var solution = new Worker('../solution.js');
    solution.postMessage({"command": "start", "value": arr})

    solution.onmessage = (event) => {
        if(event.data.type === 'result'){
            result.textContent = "Max głębokość: " + event.data.value;
        }
        if(event.data.type === 'message'){
            let li = document.createElement('li');
            li.setAttribute('class','item');
            ul.appendChild(li);
            li.innerHTML = event.data.value;
            // process.textContent = process.textContent + "\\\\n" + event.data.value;
        }
    }
})