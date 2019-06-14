
gui = new dat.GUI({ height:500});
controlFolder = gui.addFolder('CONTROLS_BASIC');
colorFolder  = gui.addFolder('STROKE_COLOR');

controlFolder.add(controls, 'is_audio_playing').name('PLAY/PAUSE').listen().onChange(()=>{ if(controls.is_audio_playing){ if(is_it_first_time){gui.close();is_it_first_time = false;} start()}});
controlFolder.add(controls,'Radius',10,250).name('RADIUS').onChange(()=>{});
controlFolder.add(controls,'intensity',0.01,0.06).name('INTENSTY').onChange(()=>{});
controlFolder.add(controls,'is_circle').name('CIRCLE').onChange(()=>{});
controlFolder.add(controls,'sides',3,20,1).name('GEOMETRY').onChange(()=>{controls.is_it_first_time = true;});
controlFolder.open();  

colorFolder.addColor( controls, 'color' );
colorFolder.open();