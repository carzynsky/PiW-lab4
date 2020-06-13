const pics = document.getElementsByTagName('img');
var len = pics.length;

for(var i=0; i<len; i++){
    pics[i].addEventListener('mouseover', (event) => {
        let str = event.target.src;
        event.target.src = str.replace('Out.png', 'Over.png');
    })
    
    pics[i].addEventListener('mouseout', (event) => {
        let str = event.target.src;
        event.target.src = str.replace('Over.png', 'Out.png');
    })
}
