const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
var animationref = null ;
const audioLoader = new AudioLoader();
var audios = ['audio_test','audio_test2','audio_test3'];
var controls = {
  current_audio:'audio_test2',
  is_audio_playing:false,
  intensity:1,
  auto_play:true
}

var audio = audioLoader.load('assets/audio/'+  controls.current_audio+'.mp3');

var gui = new dat.GUI({ height:500});

gui.add(controls, 'is_audio_playing').listen().onChange(()=>{ if(controls.is_audio_playing){ start()}});
// gui.add(controls,'auto_play').onChange(()=>{if(controls.auto_play) audio.autoPlay = false});
gui.add(controls, 'current_audio',audios).onChange(()=>{ audio.pause(); 
  cancelAnimationFrame(animationref);  
  audio = audioLoader.load('assets/audio/'+  controls.current_audio+'.mp3');
  controls.is_audio_playing = false;
  
// if(controls.is_audio_playing)
// { start()}
}
);




function start(){
const audioctx = new AudioContext();
const source = audioctx.createMediaElementSource(audio); 
const gainNode = audioctx.createGain();
gainNode.gain.value = 7;
source.connect(gainNode).connect(audioctx.destination);
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
// audio.play();
function animate(){

    if(controls.is_audio_playing){
      audio.play();
    }
    else 
    audio.pause();

    ctx.beginPath();
    analyser.getByteTimeDomainData(dataArray2);  
    analyser.getByteFrequencyData(dataArray);
    animationref = requestAnimationFrame(animate) ;
    ctx.clearRect(0,0,innerWidth,innerHeight);
    var radius = 100 + dataArray2[10]/8;
    for(var i = 3; i <bufferLength ; i++){
        draw_bars(ctx,i*angular_width*1.6,dataArray[i] ,radius);
  
    }
}
animate();
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


