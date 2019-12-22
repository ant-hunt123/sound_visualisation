var high = false ,audio,Radius,radius1,radius2,radius3,angle,angle2,omega1,omega2,omega3,time = 0,bass_radius,frequency = 0.005,radian = Math.PI/180 ,audioctx,source,analyser,bufferLength,time_domain_data,frequency_domain_data
, audio_path, is_it_first_time = true ,controlFolder ,colorFolder, gui ,center = {x:innerWidth/2,y:innerHeight/2} ,txt = "CHOOSE FILE & PLAY", animationref = null ,
controls = {
    is_audio_playing:false,
    intensity:.04,
    auto_play:true,
    Radius:250,
    separation:2.7,
    frequency:0.002,
    font_size:'8vw',
    is_circle:true,
    vibrate:true,
    color: "rgb(230,148, 1)",
    sides:4
  
  } , counter = 0 , limit = 8 ;

const canvas = document.getElementById('canvas1'), ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
window.onresize = ()=>{ 
  center = {x:innerWidth/2,y:innerHeight/2};
   canvas.width = innerWidth;
  canvas.height = innerHeight;

};

const canvas2 = document.getElementById('canvas2'), ctx2 = canvas2.getContext('2d');
canvas2.width = innerWidth;
canvas2.height = innerHeight;
window.onresize = ()=>{ 
  center = {x:innerWidth/2,y:innerHeight/2};
   canvas2.width = innerWidth;
  canvas2.height = innerHeight;

};
const canvas3 = document.getElementById('canvas3'), ctx3 = canvas3.getContext('2d');
canvas3.width = innerWidth;
canvas3.height = innerHeight;
window.onresize = ()=>{ 
  center = {x:innerWidth/2,y:innerHeight/2};
   canvas3.width = innerWidth;
  canvas3.height = innerHeight;

};
if(window.innerWidth<300)
controls.font_size = '8vw' ;
else
controls.font_size = '6vw' ;
ctx.font = ''+ controls.font_size+' Cinzel, serif';
ctx.fillStyle = 'rgba(255,255,255,0.5)';
ctx.textAlign = "center";
ctx.fillText(txt, canvas.width/2, canvas.height/2); 



class AudioData{
  constructor(audio){
   this.audio = audio;
   this.audioctx = new AudioContext();
   this.source = this.audioctx.createMediaElementSource(this.audio); 
   this.analyser = this.audioctx.createAnalyser();
   this.source.disconnect();
   this.source.connect(this.analyser);
   this.analyser.connect(this.audioctx.destination);
   this.analyser.fftSize = 256;
   this.bufferLength = this.analyser.frequencyBinCount;
   this.time_domain_data = new Uint8Array(this.bufferLength);
   this.frequency_domain_data = new Uint8Array(this.bufferLength);
  }
  time_domain(size = 1){
    this.analyser.fftSize = size*256;
    this.analyser.getByteTimeDomainData(this.time_domain_data);  
    return this.time_domain_data; 
  }
  frequency_domain(size = 1){
      this.analyser.fftSize = size*256;
      this.analyser.getByteFrequencyData(this.frequency_domain_data);
      return this.frequency_domain_data;
  }
}

draw_bars = (ctx, angle,height,Radius) => {
    ctx.translate(innerWidth/2, innerHeight/2);
    ctx.moveTo(0, 0);
    ctx.lineWidth = 3;
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0,-Radius);
    ctx.lineTo(0,-(Radius+height));
    ctx.moveTo(0,0);
    if(high) ctx.strokeStyle = "red";
    else 
    ctx.strokeStyle =  controls.color;
    ctx.stroke();
    ctx.closePath();
    ctx.rotate(-angle);
    ctx.translate(-innerWidth/2, -innerHeight/2);
  }
  draw_polygon = (ctx, center, sides, radius, omega) => {
    let angular_width = Math.PI*2/sides;
    ctx.beginPath();
    for(let i = 0; i<sides; i++){
        ctx.moveTo(move_point(center,i,radius,angular_width,omega).x,move_point(center,i,radius,angular_width,omega).y);
        ctx.lineTo(move_point(center,i+1,radius,angular_width,omega).x,move_point(center,i+1,radius,angular_width,omega).y);
    }
    ctx.closePath();
    ctx.lineWidth = .5;
    ctx.strokeStyle = 'cyan';
    ctx.shadowBlur = 2 ;
    ctx.shadowColor = "white";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.stroke();
    
  }
  
move_point = (center,index,radius,angular_width,omega)=>{
    let angle = index*angular_width;
    return position = {x:center.x + (radius)*Math.cos(angle+omega),y:center.y + (radius)*Math.sin(angle+omega) };
  }
  
  