const audioLoader = new AudioLoader();
const audio = audioLoader.load("assets/audio/audio_test3.mp3");
window.onkeypress = function(e) {  animate(); audio.play();         } ;
const audioctx = new AudioContext();
const source = audioctx.createMediaElementSource(audio); 
const gainNode = audioctx.createGain();
gainNode.gain.value = 0.2 ;
source.connect(gainNode).connect(audioctx.destination);

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

var analyser = audioctx.createAnalyser();
source.disconnect();
source.connect(analyser);
analyser.fftSize = 256;
analyser.connect(audioctx.destination);

var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
var dataArray2 = new Uint8Array(bufferLength);
var angular_width = Math.PI*2/(bufferLength);
var rect_width = innerWidth/bufferLength ;
function animate(){
    ctx.beginPath();
    analyser.getByteTimeDomainData(dataArray2);  
    analyser.getByteFrequencyData(dataArray);
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth,innerHeight);
    let radius = 100 + dataArray2[10]/8;
    for(let i = 3; i <bufferLength ; i++){
        draw_bars(ctx,i*angular_width*1.6,dataArray[i] ,radius);
  
    }
}


function draw_bars(ctx, angle,height,radius){
ctx.translate(innerWidth/2, innerHeight/2);
//   ctx.lineCap = "round";
  ctx.lineWidth = "4";
  ctx.moveTo(0, 0);
  ctx.rotate(angle);
  ctx.moveTo(0,-radius);
  ctx.lineTo(0,-(radius+height));
  ctx.moveTo(0,0);
  ctx.stroke();
  ctx.beginPath();
  ctx.rotate(-angle);
  ctx.translate(-innerWidth/2, -innerHeight/2);
}


