var txt = "PLAY THEN !!" ;
var animationref = null ;
var audios = ['audio_test','audio_test2','audio_test3','audio_test4','audio_test5','audio_test6','audio_test7','audio_test8','audio_test9','audio_test10','audio_test11','audio_test12'];
var controls = {
    current_audio:'audio_test2',
    is_audio_playing:false,
    intensity:.7,
    auto_play:true,
    Radius:250,
    separation:2,
    frequency:0.005,
    font_size:'8vw',
    is_circle:true,
    vibrate:true,
    color: "rgb(230,148, 1)"
  
  }
const audioLoader = new AudioLoader();
var audio = audioLoader.load('assets/audio/'+  controls.current_audio+'.mp3');

var gui = new dat.GUI({ height:500});
var controlFolder = gui.addFolder('CONTROLS_BASIC');
var colorFolder  = gui.addFolder('STROKE_COLOR');

controlFolder.add(controls, 'is_audio_playing').name('PLAY/PAUSE').listen().onChange(()=>{ if(controls.is_audio_playing){ start()}});
controlFolder.add(controls, 'current_audio',audios).name('PLAYLIST').onChange(()=>{ audio.pause(); 
  cancelAnimationFrame(animationref);  
  audio = audioLoader.load('assets/audio/'+  controls.current_audio+'.mp3');
  controls.is_audio_playing = false;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  ctx.font = ''+ controls.font_size+' Cinzel, serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.textAlign = "center";
  ctx.fillText(txt, canvas.width/2, canvas.height/2); 
}
);
controlFolder.add(controls,'Radius',10,250).name('RADIUS').onChange(()=>{});
controlFolder.add(controls,'is_circle').name('CIRCLE').onChange(()=>{});
// controlFolder.add(controls,'vibrate').name('VIBRATE');
// controlFolder.add(controls,'frequency',0.005,0.009).listen();
controlFolder.open();  

colorFolder.addColor( controls, 'color' );
colorFolder.open();