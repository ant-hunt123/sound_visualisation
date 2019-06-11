var high = false ,audio,Radius,radius1,radius2,radius3,angle,angle2,omega1,omega2,omega3,time = 0,bass_radius,frequency = 0.005,radian = Math.PI/180 ,audioctx,source,analyser,bufferLength,time_domain_data,frequency_domain_data,
audioLoader, audio_path, is_it_first_time = true ,controlFolder ,colorFolder, gui ,center = {x:innerWidth/2,y:innerHeight/2} ,txt = "PLAY THEN !!", animationref = null ,
controls = {
    is_audio_playing:false,
    intensity:.04,
    auto_play:true,
    Radius:250,
    separation:2.7,
    frequency:0.005,
    font_size:'8vw',
    is_circle:true,
    vibrate:true,
    color: "rgb(230,148, 1)",
    sides:3
  
  }
audio = new Audio(audio_path);

gui = new dat.GUI({ height:500});
controlFolder = gui.addFolder('CONTROLS_BASIC');
colorFolder  = gui.addFolder('STROKE_COLOR');

controlFolder.add(controls, 'is_audio_playing').name('PLAY/PAUSE').listen().onChange(()=>{ if(controls.is_audio_playing){ start()}});
controlFolder.add(controls,'Radius',10,250).name('RADIUS').onChange(()=>{});
controlFolder.add(controls,'intensity',0.01,0.06).name('INTENSTY').onChange(()=>{});
controlFolder.add(controls,'is_circle').name('CIRCLE').onChange(()=>{});
controlFolder.add(controls,'sides',3,20,1).name('GEOMETRY').onChange(()=>{controls.is_it_first_time = true;});
controlFolder.open();  

colorFolder.addColor( controls, 'color' );
colorFolder.open();