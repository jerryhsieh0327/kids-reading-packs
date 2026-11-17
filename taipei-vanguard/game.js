/* Taipei Vanguard: Skyline Alert — offline, dependency-free canvas FPS. */
'use strict';
(()=>{
const $=id=>document.getElementById(id), TAU=Math.PI*2;
const maps=[
 {name:'Taipei 101',theme:'tower',sky:'#79cbff',wall:'#b2c9da',trim:'#2778c0',floor:'#b3c3d0',accent:'#ffbd43',pan:0},
 {name:'National Chiang Kai-shek Memorial Hall',theme:'memorial',sky:'#89d6ff',wall:'#e7e8de',trim:'#2e64a8',floor:'#b2b5b5',accent:'#f0c35f',pan:0},
 {name:'Mengjia Longshan Temple',theme:'temple',sky:'#f9c58c',wall:'#b84638',trim:'#edbc53',floor:'#ad9087',accent:'#ffc34a',pan:0},
 {name:'National Palace Museum',theme:'museum',sky:'#add8ff',wall:'#dce1d8',trim:'#46857b',floor:'#a9c8b2',accent:'#ffe39b',pan:0},
 {name:'Liberty Square',theme:'square',sky:'#87c9f9',wall:'#d7e6ea',trim:'#347ac5',floor:'#c9d5d7',accent:'#ffd063',pan:0},
 {name:'Taipei Dome',theme:'dome',sky:'#84d0ff',wall:'#b2cedd',trim:'#277bbd',floor:'#9aaebb',accent:'#54e1ff',pan:0.05},
 {name:'Raohe Street Night Market',theme:'night',sky:'#252f68',wall:'#de936e',trim:'#e04e67',floor:'#66739f',accent:'#ffce57',pan:0},
 {name:'Yangmingshan',theme:'mountain',sky:'#85c6e4',wall:'#7cab83',trim:'#427656',floor:'#92b790',accent:'#ffeb8d',pan:0.06}
];
const missions=[
 {name:'Tower Lobby Sweep',map:0,diff:'Casual',time:480,story:'Taipei 101’s service entrance is blocked by rogue patrol machines. Practice aiming, clear the route and secure the lobby.',steps:[['combat',4,'Stop four hostile patrol units'],['waypoint',0,'Reach the service entrance']],win:'Stop all hostile units and reach the service entrance.',lose:'Armor reaches zero or the mission timer expires.'},
 {name:'Express Lift Rescue',map:0,diff:'Tight',time:720,story:'Leo Wu is trapped in a restricted service section. Stop the hostile guards, rescue Leo, and escort him to safety.',steps:[['combat',6,'Clear hostile guards'],['rescue',0,'Rescue Leo Wu'],['escort',0,'Escort Leo to the safe exit']],win:'Escort Leo safely to the evacuation point.',lose:'Armor or escort safety reaches zero, or time expires.'},
 {name:'Memorial Hall Approach',map:1,diff:'Casual',time:600,story:'Rogue machines are blocking a safe approach to the memorial. Secure the route and restore communications.',steps:[['combat',5,'Stop rogue patrol machines'],['waypoint',0,'Secure the memorial checkpoint'],['disable',1,'Restore the communications terminal']],win:'Clear the route and restore communications.',lose:'Armor reaches zero or time expires.'},
 {name:'Honor Gate Escort',map:4,diff:'Tight',time:720,story:'Emergency response personnel need a safe route across Liberty Square. Clear the designated passage and escort the team without allowing hostile units to interrupt the evacuation.',steps:[['combat',6,'Clear the designated passage'],['rescue',0,'Locate stranded personnel'],['escort',0,'Escort personnel to safety']],win:'Escort the response team to safety.',lose:'Armor or escort safety reaches zero, or time expires.'},
 {name:'Temple Courtyard Watch',map:2,diff:'Casual',time:720,story:'Signal-controlled machines threaten protected temple surroundings. Disable the machines and disconnect the interference source.',steps:[['combat',4,'Stop machines near protected structures'],['disable',1,'Disable the interference controller']],win:'Stop the machines and disable the controller.',lose:'Armor reaches zero or time expires.'},
 {name:'Palace Archive Lockdown',map:3,diff:'Tight',time:780,story:'A fictional digital archive has locked down. Clear security corridors and disable two remote controllers.',steps:[['combat',6,'Clear the archive access route'],['disable',2,'Disable both interference controllers']],win:'Restore archive access and disable both controllers.',lose:'Armor reaches zero or time expires.'},
 {name:'Liberty Route Clear',map:4,diff:'Casual',time:660,story:'Hostile machines are blocking the public route across Liberty Square. Secure its checkpoints and reactivate safety beacons.',steps:[['combat',5,'Secure the public route'],['disable',2,'Reactivate both safety beacons'],['waypoint',0,'Reach the evacuation checkpoint']],win:'Reactivate beacons and reach the final checkpoint.',lose:'Armor reaches zero or time expires.'},
 {name:'Dome Concourse Push',map:5,diff:'Tight',time:900,story:'Taipei Dome’s service concourse is under hostile-machine control. Clear the corridor and defend the reset terminal.',steps:[['combat',8,'Stop hostile maintenance machines'],['disable',1,'Activate the service reset'],['defend',3,'Defend the terminal against three waves']],win:'Keep the control terminal operational through all waves.',lose:'Armor or terminal safety reaches zero, or time expires.'},
 {name:'Night Lantern Rescue',map:6,diff:'Casual',time:720,story:'The evacuated night market still has trapped vendors. Clear its lantern-lit lanes and rescue the stranded people.',steps:[['combat',5,'Secure the market lanes'],['rescue',0,'Rescue the stranded vendors'],['escort',0,'Guide the vendors to safety']],win:'Rescue and escort the stranded vendors.',lose:'Armor or escort safety reaches zero, or time expires.'},
 {name:'Market Exit Escort',map:6,diff:'Tight',time:780,story:'A wave of hostile machines is blocking the market exit. Remove the electronic lock and lead the evacuation team out.',steps:[['combat',7,'Clear the market exit route'],['disable',1,'Disable the security lock'],['rescue',0,'Find the evacuation team'],['escort',0,'Lead the team out']],win:'Disable the lock and guide the group to safety.',lose:'Armor or escort safety reaches zero, or time expires.'},
 {name:'Mountain Signal Break',map:7,diff:'Casual',time:780,story:'The main relay signal has been traced to a fictional Yangmingshan service station. Clear patrols and disconnect the transmitters.',steps:[['combat',4,'Stop patrol machines on the trail'],['disable',2,'Disconnect both signal relays'],['waypoint',0,'Recover transmission data']],win:'Disconnect both relays and recover transmission data.',lose:'Armor reaches zero or time expires.'},
 {name:'Skyline Final Stand',map:0,diff:'Tight',time:1080,story:'The recovered transmission data has revealed the final disruption inside a fictional technical facility connected to Taipei 101. Stop the hostile units, disable the interference system, and restore the Skyline Grid.',steps:[['combat',6,'Secure the relay hub approach'],['disable',2,'Disable the main controllers'],['combat',1,'Stop the Veil Heavy Unit'],['defend',3,'Defend the Skyline restoration terminal']],win:'Disable controllers, stop the heavy unit and complete restoration.',lose:'Armor or restoration-terminal safety reaches zero, or time expires.'}
];
const artSprites={};for(const [kind,file] of [['guard','veil-guard.png'],['shield','veil-guard.png'],['bot','veil-bot.png'],['heavy','veil-bot.png']]){const img=new Image();img.src='assets/'+file;artSprites[kind]=img;}
const sceneArt=[],placeArt=[];
for(let i=1;i<=8;i++){const s=new Image();s.src='assets/scene-'+i+'.png';sceneArt[i-1]=s;const pl=new Image();pl.src='assets/place-'+i+'.png';placeArt[i-1]=pl;}
function sceneImage(mapIdx){const list=[sceneArt[mapIdx],placeArt[mapIdx]];for(const img of list){if(img&&img.complete&&img.naturalWidth>16)return img;}return null;}
const canvas=$('scene'),ctx=canvas.getContext('2d',{alpha:false}); let CW=960,CH=540,DPR=1;
function resize(){const w=innerWidth,h=innerHeight;canvas.width=Math.min(1280,Math.floor(w*Math.min(devicePixelRatio||1,1.3)));canvas.height=Math.min(720,Math.floor(h*Math.min(devicePixelRatio||1,1.3)));CW=canvas.width;CH=canvas.height;ctx.imageSmoothingEnabled=true;}
addEventListener('resize',resize);resize();
let screen='menu', selected=0, running=false, paused=false,game=null, last=performance.now(), screenDepth=[],spriteCache={};
let soundOn=true,audio=null;function beep(type='tap',vol=.12){if(!soundOn)return;try{audio||=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.type=type==='shot'?'sawtooth':type==='damage'?'square':'sine';o.frequency.setValueAtTime(type==='shot'?210:type==='hit'?640:type==='win'?525:type==='damage'?120:410,t);o.frequency.exponentialRampToValueAtTime(type==='shot'?65:type==='win'?880:type==='damage'?65:290,t+.12);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.16);}catch(e){}}
function show(id){for(const el of document.querySelectorAll('.panel-screen'))el.classList.toggle('active',el.id===id);screen=id;$('gameHUD').hidden=id!=='playing';$('pauseOverlay').hidden=true;}
function save(){try{localStorage.setItem('tvsa_progress_v1',JSON.stringify(progress));}catch(e){}}
let progress={unlocked:1,stars:{}};try{Object.assign(progress,JSON.parse(localStorage.getItem('tvsa_progress_v1')||'{}'));}catch(e){}progress.unlocked=Math.max(1,Math.min(12,progress.unlocked||1));
function missionSelect(){running=false;show('missionSelect');const grid=$('missionGrid');grid.replaceChildren();missions.forEach((m,i)=>{let b=document.createElement('button');b.className='mission-tile';b.disabled=i>=progress.unlocked;b.style.opacity=b.disabled?'.48':'1';b.style.backgroundImage=`linear-gradient(100deg,#0b2d63ec,#124879dd),url('assets/landmark-${m.map+1}.png')`;b.style.backgroundSize='cover';b.style.backgroundPosition='center';b.innerHTML=`<div class="top"><span>MISSION ${String(i+1).padStart(2,'0')}</span><span class="tag ${m.diff==='Tight'?'tight':''}">${m.diff.toUpperCase()}</span></div><b>${m.name}</b><small>${maps[m.map].name}</small><small>${b.disabled?'🔒 LOCKED':(progress.stars[i]?'★'.repeat(progress.stars[i])+' CLEARED':'READY TO DEPLOY')}</small>`;b.onclick=()=>brief(i);grid.append(b);});}
function brief(i){selected=i;const m=missions[i];show('briefing');$('briefNumber').textContent=`MISSION ${String(i+1).padStart(2,'0')}`;$('briefTitle').textContent=m.name;$('briefLocation').textContent=maps[m.map].name;$('briefStory').textContent=m.story;$('briefDifficulty').textContent=m.diff.toUpperCase();$('briefDifficulty').className='difficulty '+(m.diff==='Tight'?'tight':'');$('briefObjectives').replaceChildren();m.steps.forEach(s=>{let li=document.createElement('li');li.textContent=s[2];$('briefObjectives').append(li)});$('briefWin').textContent=m.win;$('briefLose').textContent=m.lose;let bg=$('briefLandscape');bg.style.backgroundImage=`linear-gradient(0deg,#071e43dd,transparent 70%),url('assets/landmark-${m.map+1}.png')`;bg.style.backgroundPosition=`${m.map===0?'center':m.map===7?'right':'35%'} center`;}
$('continueBtn').onclick=()=>brief(Math.max(0,progress.unlocked-1));$('openMissions').onclick=missionSelect;document.querySelectorAll('[data-back]').forEach(x=>x.onclick=()=>screen==='briefing'?missionSelect():show('menu'));$('deployBtn').onclick=start;
$('soundToggle').onclick=()=>{soundOn=!soundOn;$('soundToggle').textContent=soundOn?'♫ ON':'♫ OFF';beep();};$('fullscreen').onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.();};
const MAP_W=24,MAP_H=24;
const CT={TALL:1,DESK:2,PLANTER:3,STALL:4,SEAT:5,ROCK:6,TABLE:7,LOW:8,BORDER:9,CORE:10,HALL:11,GALLERY:12,TEMPLE:13,BOWL:14,CIYOU:15,STATION:16,PILLAR:17,COLON:18,GLASS:19};
function isLowCover(k){return k>=2&&k<=8;}
function isTallCell(k){return k===1||(k>=10&&k<=19);}
function newGrid(){return Array.from({length:MAP_H},(_,y)=>Array.from({length:MAP_W},(_,x)=>x===0||y===0||x===23||y===23?9:0));}
function punch(g,side,a,b){for(let i=a;i<=b;i++){if(side==='W')g[i][0]=0;else if(side==='E')g[i][23]=0;else if(side==='N')g[0][i]=0;else if(side==='S')g[23][i]=0;}}
function put(g,x,y,v){if(x<0||y<0||x>23||y>23)return;if((x===0||y===0||x===23||y===23)&&v!==0&&v!==9)return;g[y][x]=v;}
function fill(g,x0,y0,x1,y1,v){const xa=Math.min(x0,x1),xb=Math.max(x0,x1),ya=Math.min(y0,y1),yb=Math.max(y0,y1);for(let y=ya;y<=yb;y++)for(let x=xa;x<=xb;x++)put(g,x,y,v);}
function localSolid(g,x,y){if(x<.7||y<.7||x>=23.3||y>=23.3)return true;const iy=Math.floor(y),ix=Math.floor(x);return !g[iy]||g[iy][ix]>0;}
function localPass(g,x,y,r=.28){return !localSolid(g,x-r,y-r)&&!localSolid(g,x+r,y-r)&&!localSolid(g,x-r,y+r)&&!localSolid(g,x+r,y+r);}
function snapOn(g,x,y,r=.3){if(localPass(g,x,y,r))return [+x,+y];const cx=Math.floor(x)+.5,cy=Math.floor(y)+.5;for(let rad=1;rad<=8;rad++){for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){if(Math.abs(dx)!==rad&&Math.abs(dy)!==rad)continue;const nx=cx+dx,ny=cy+dy;if(nx>1.2&&ny>1.2&&nx<21.8&&ny<21.8&&localPass(g,nx,ny,r))return [nx,ny];}}return [+x,+y];}
function collectWalk(g){const cells=[];for(let y=1;y<23;y++)for(let x=1;x<23;x++)if(localPass(g,x+.5,y+.5,.3))cells.push([x+.5,y+.5]);return cells;}
function collectCover(g){const cells=[];for(let y=1;y<23;y++)for(let x=1;x<23;x++)if(isLowCover(g[y][x]))cells.push([x+.5,y+.5,g[y][x]]);return cells;}
function finishLayout(g,spec){const snap=p=>snapOn(g,p[0],p[1]);const v=spec.view||[spec.start[0],spec.start[1],spec.dir||0];const vs=snapOn(g,v[0],v[1]);return {grid:g,start:snap(spec.start),dir:spec.dir||0,spawns:(spec.spawns||[]).map(snap),rescue:snap(spec.rescue||spec.start),exit:snap(spec.exit||spec.start),devices:(spec.devices||[]).map(snap),waypoints:(spec.waypoints||[]).map(snap),patrols:(spec.patrols||[]).map(snap),terminal:snap(spec.terminal||(spec.devices&&spec.devices[0])||spec.start),view:[vs[0],vs[1],v[2]||0],walk:collectWalk(g),covers:collectCover(g)};}

function layoutTower(){
  const g=newGrid(),C=CT;
  punch(g,'W',11,13);
  fill(g,2,6,16,6,C.TALL);put(g,3,6,0);put(g,4,6,0);put(g,12,6,0);put(g,13,6,0);
  fill(g,2,18,16,18,C.TALL);put(g,3,18,0);put(g,4,18,0);put(g,12,18,0);put(g,13,18,0);
  fill(g,18,7,21,9,C.CORE);fill(g,18,15,21,17,C.CORE);
  fill(g,17,2,17,5,C.TALL);put(g,17,4,0);fill(g,17,6,21,6,C.TALL);
  fill(g,17,18,21,18,C.TALL);fill(g,17,19,17,21,C.TALL);put(g,17,20,0);
  for(let y=7;y<=17;y++)put(g,22,y,C.GLASS);
  for(const [x,y] of [[6,8],[6,16],[11,8],[11,16],[15,8],[15,16]])put(g,x,y,C.PILLAR);
  for(const x of [8,9,10,11]){put(g,x,10,C.DESK);put(g,x,11,C.DESK);}
  put(g,4,9,C.DESK);put(g,4,15,C.DESK);put(g,14,10,C.DESK);put(g,14,14,C.DESK);
  put(g,7,8,C.LOW);put(g,5,16,C.LOW);
  return finishLayout(g,{
    start:[3.5,12.5],dir:0,view:[10.8,12.5,0],rescue:[16.5,12.5],exit:[3.5,12.5],
    devices:[[19.5,4.5],[19.5,20.5]],waypoints:[[16.5,12.5]],terminal:[15.5,12.5],
    spawns:[[6.5,12.5],[8.5,10.5],[8.5,14.5],[12.5,9.5],[12.5,15.5],[15.5,11.5],[15.5,13.5],[5.5,4.5],[5.5,20.5],[14.5,4.5]],
    patrols:[[6.5,12.5],[12.5,9.5],[15.5,12.5],[5.5,4.5],[5.5,20.5]]
  });
}
function layoutMemorial(){
  const g=newGrid(),C=CT;
  punch(g,'E',10,14);punch(g,'W',11,13);
  fill(g,18,5,22,10,C.HALL);fill(g,18,14,22,19,C.HALL);
  for(const x of [5,8,11,14]){put(g,x,6,C.COLON);put(g,x,7,C.COLON);put(g,x,17,C.COLON);put(g,x,18,C.COLON);}
  put(g,16,10,C.LOW);put(g,17,10,C.LOW);put(g,16,14,C.LOW);put(g,17,14,C.LOW);
  put(g,6,9,C.PLANTER);put(g,10,9,C.PLANTER);put(g,6,15,C.PLANTER);put(g,10,15,C.PLANTER);
  return finishLayout(g,{
    start:[3.5,12.5],dir:0,view:[5.5,12.5,0],rescue:[17.5,12.5],exit:[3.5,12.5],
    devices:[[19.5,12.5]],waypoints:[[17.5,12.5]],terminal:[19.5,12.5],
    spawns:[[7.5,12.5],[10.5,10.5],[10.5,14.5],[13.5,12.5],[15.5,11.5],[15.5,13.5],[8.5,9.5],[8.5,15.5],[4.5,10.5],[16.5,12.5]],
    patrols:[[7.5,12.5],[13.5,11.5],[16.5,12.5],[8.5,9.5]]
  });
}
function layoutTemple(){
  const g=newGrid(),C=CT;
  punch(g,'E',10,14);punch(g,'W',11,13);
  fill(g,2,3,4,10,C.TEMPLE);fill(g,2,14,4,21,C.TEMPLE);
  fill(g,5,2,18,5,C.TEMPLE);fill(g,5,19,18,21,C.TEMPLE);
  fill(g,19,3,22,10,C.TEMPLE);fill(g,19,14,22,21,C.TEMPLE);
  for(const [x,y] of [[6,7],[16,7],[6,17],[16,17]])put(g,x,y,C.PILLAR);
  put(g,8,9,C.TABLE);put(g,13,9,C.TABLE);put(g,8,15,C.TABLE);put(g,13,15,C.TABLE);put(g,11,12,C.TABLE);
  return finishLayout(g,{
    start:[3.5,12.5],dir:0,view:[5.8,12.5,0],rescue:[16.5,12.5],exit:[3.5,12.5],
    devices:[[17.5,12.5]],waypoints:[[17.5,12.5]],terminal:[17.5,12.5],
    spawns:[[7.5,12.5],[10.5,10.5],[10.5,14.5],[14.5,12.5],[16.5,11.5],[16.5,13.5],[7.5,8.5],[7.5,16.5],[12.5,8.5],[12.5,16.5]],
    patrols:[[7.5,12.5],[11.5,10.5],[16.5,12.5],[8.5,16.5]]
  });
}
function layoutMuseum(){
  const g=newGrid(),C=CT;
  punch(g,'W',11,13);
  put(g,22,11,C.GLASS);put(g,22,12,C.GLASS);put(g,22,13,C.GLASS);
  fill(g,1,7,6,7,C.GALLERY);fill(g,1,17,6,17,C.GALLERY);
  fill(g,7,10,18,10,C.GALLERY);fill(g,7,14,18,14,C.GALLERY);
  put(g,10,10,0);put(g,11,10,0);put(g,10,14,0);put(g,11,14,0);put(g,16,10,0);put(g,16,14,0);
  fill(g,7,1,18,1,C.GALLERY);fill(g,7,2,7,9,C.GALLERY);fill(g,18,2,18,9,C.GALLERY);
  fill(g,7,15,7,21,C.GALLERY);fill(g,18,15,18,21,C.GALLERY);fill(g,7,22,18,22,C.GALLERY);
  fill(g,6,8,6,16,C.GALLERY);put(g,6,11,0);put(g,6,12,0);put(g,6,13,0);
  put(g,9,3,C.DESK);put(g,12,3,C.DESK);put(g,15,3,C.DESK);put(g,9,6,C.DESK);put(g,14,6,C.DESK);
  put(g,9,17,C.DESK);put(g,12,20,C.DESK);put(g,15,17,C.DESK);put(g,9,20,C.DESK);put(g,14,18,C.DESK);
  put(g,3,9,C.DESK);put(g,3,15,C.DESK);
  return finishLayout(g,{
    start:[3.5,12.5],dir:0,view:[4.5,12.5,0],rescue:[11.5,4.5],exit:[3.5,12.5],
    devices:[[11.5,4.5],[11.5,19.5]],waypoints:[[16.5,12.5]],terminal:[16.5,12.5],
    spawns:[[5.5,12.5],[9.5,12.5],[14.5,12.5],[11.5,8.5],[11.5,16.5],[8.5,4.5],[15.5,4.5],[8.5,19.5],[15.5,19.5],[16.5,12.5]],
    patrols:[[5.5,12.5],[11.5,4.5],[11.5,19.5],[16.5,12.5]]
  });
}
function layoutSquare(){
  const g=newGrid(),C=CT;
  punch(g,'E',8,16);punch(g,'W',11,13);
  fill(g,14,5,16,9,C.PILLAR);fill(g,14,15,16,19,C.PILLAR);
  for(const [x,y] of [[6,7],[10,7],[18,7],[21,8],[6,17],[10,17],[18,17],[21,16],[8,5],[8,19],[20,5],[20,19],[4,9],[4,15]])put(g,x,y,C.PLANTER);
  put(g,13,9,C.LOW);put(g,13,15,C.LOW);put(g,17,9,C.LOW);put(g,17,15,C.LOW);
  return finishLayout(g,{
    start:[3.5,12.5],dir:0,view:[7.5,12.5,0],rescue:[18.5,12.5],exit:[3.5,12.5],
    devices:[[7.5,7.5],[19.5,16.5]],waypoints:[[19.5,12.5]],terminal:[19.5,12.5],
    spawns:[[6.5,12.5],[9.5,10.5],[9.5,14.5],[12.5,12.5],[15.5,12.5],[18.5,11.5],[18.5,14.5],[6.5,9.5],[11.5,16.5],[20.5,12.5]],
    patrols:[[6.5,12.5],[15.5,12.5],[19.5,12.5],[9.5,9.5]]
  });
}
function layoutDome(){
  const g=newGrid(),C=CT;
  punch(g,'E',11,13);punch(g,'W',11,13);
  const cx=12,cy=12;
  for(let y=1;y<23;y++)for(let x=1;x<23;x++){
    const r=Math.hypot(x+.5-cx,y+.5-cy);
    const aisle=Math.abs(x-cx)<=1||Math.abs(y-cy)<=1;
    const tunnel=(y>=11&&y<=13&&(x<=4||x>=20));
    if(r>=10){if(!tunnel)g[y][x]=C.BOWL;}
    else if(r>=7.7){/* concourse */}
    else if(r>=6.55&&r<7.7&&!aisle)g[y][x]=C.SEAT;
    else if(r>=5&&r<6.2&&!aisle)g[y][x]=C.SEAT;
  }
  return finishLayout(g,{
    start:[3.5,12.5],dir:0,view:[12.5,20.5,-1.57],rescue:[12.5,12.5],exit:[3.5,12.5],
    devices:[[20.5,12.5]],waypoints:[[20.5,12.5]],terminal:[20.5,12.5],
    spawns:[[8.5,12.5],[12.5,8.5],[12.5,15.5],[16.5,12.5],[9.5,9.5],[15.5,9.5],[15.5,15.5],[9.5,15.5],[20.5,10.5],[6.5,12.5]],
    patrols:[[8.5,12.5],[12.5,8.5],[16.5,12.5],[20.5,12.5]]
  });
}
function layoutNight(){
  const g=newGrid(),C=CT;
  punch(g,'E',10,14);punch(g,'W',11,13);
  for(let x=2;x<=18;x++){
    const gap=x===5||x===10||x===16;
    if(gap){put(g,x,8,C.STALL);put(g,x,16,C.STALL);}
    else{for(const y of [8,9,10,14,15,16])put(g,x,y,C.STALL);put(g,x,5,C.STALL);}
  }
  fill(g,19,6,22,10,C.CIYOU);fill(g,19,14,22,18,C.CIYOU);
  put(g,18,10,C.STALL);put(g,18,14,C.STALL);
  return finishLayout(g,{
    start:[3.5,12.5],dir:0,view:[11.0,11.62,0.24],rescue:[12.5,12.5],exit:[3.5,12.5],
    devices:[[18.5,12.5]],waypoints:[[18.5,12.5]],terminal:[18.5,12.5],
    spawns:[[6.5,12.5],[9.5,12.5],[12.5,11.5],[15.5,12.5],[17.5,12.5],[5.5,6.5],[10.5,6.5],[16.5,6.5],[7.5,12.5],[13.5,12.5]],
    patrols:[[6.5,12.5],[12.5,12.5],[17.5,12.5],[10.5,6.5]]
  });
}
function layoutMountain(){
  const g=newGrid(),C=CT;
  punch(g,'E',8,16);punch(g,'N',8,14);punch(g,'W',11,14);
  const path=new Set();
  const mark=(x0,y0,x1,y1)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)path.add(x+','+y);};
  mark(2,10,6,15);mark(5,7,7,10);mark(7,5,7,8);mark(7,4,13,8);mark(13,6,16,8);mark(15,8,16,12);mark(15,12,21,17);mark(17,8,18,12);mark(19,10,19,11);
  const rocks=[[2,8],[3,8],[4,7],[5,8],[2,16],[3,17],[5,17],[6,16],[6,6],[8,3],[9,3],[12,3],[13,3],[14,4],[14,7],[8,9],[11,9],[14,10],[16,9],[14,14],[15,15],[17,17],[19,18],[20,18],[21,16],[21,14],[16,19],[18,19],[10,14],[11,16],[9,14],[3,9],[20,13],[7,15],[13,10],[4,18],[8,18],[12,18],[2,13],[13,16],[2,7],[3,7],[8,2],[14,3],[21,18]];
  for(const [x,y] of rocks)if(!path.has(x+','+y))put(g,x,y,C.ROCK);
  fill(g,18,6,21,9,C.STATION);
  for(const key of path){const [x,y]=key.split(',').map(Number);if(g[y][x]===C.STATION)continue;g[y][x]=0;}
  put(g,19,9,0);put(g,18,9,0);
  return finishLayout(g,{
    start:[3.5,12.5],dir:0,view:[4.5,12.5,0.2],rescue:[10.5,6.5],exit:[3.5,12.5],
    devices:[[4.5,11.5],[10.5,6.5]],waypoints:[[19.5,10.5]],terminal:[19.5,10.5],
    spawns:[[5.5,13.5],[6.5,8.5],[9.5,6.5],[12.5,6.5],[16.5,8.5],[16.5,14.5],[18.5,14.5],[20.5,15.5],[8.5,6.5],[15.5,13.5]],
    patrols:[[5.5,13.5],[10.5,6.5],[16.5,14.5],[19.5,12.5]]
  });
}
function makeLayout(theme){
  if(theme==='tower')return layoutTower();
  if(theme==='memorial')return layoutMemorial();
  if(theme==='temple')return layoutTemple();
  if(theme==='museum')return layoutMuseum();
  if(theme==='square')return layoutSquare();
  if(theme==='dome')return layoutDome();
  if(theme==='night')return layoutNight();
  return layoutMountain();
}
function makeGrid(theme){return makeLayout(theme).grid;}
function solid(x,y){if(x<.7||y<.7||x>=23.3||y>=23.3)return true;return !game||!game.grid[Math.floor(y)]||game.grid[Math.floor(y)][Math.floor(x)]>0;}
function passable(x,y,r=.22){return !solid(x-r,y-r)&&!solid(x+r,y-r)&&!solid(x-r,y+r)&&!solid(x+r,y+r);}
function cellKind(x,y){if(x<.7||y<.7||x>=23.3||y>=23.3)return 9;if(!game||!game.grid[Math.floor(y)])return 9;const ix=Math.floor(x),iy=Math.floor(y),v=game.grid[iy][ix]||0;if(ix<=0||iy<=0||ix>=23||iy>=23||v===9)return 9;return v;}
function playerPassable(x,y,r=.21){const z=game&&game.z||0;for(const [dx,dy] of [[-r,-r],[r,-r],[-r,r],[r,r]]){const k=cellKind(x+dx,y+dy);if(k===0)continue;if(k===9||isTallCell(k))return false;if(isLowCover(k)&&z<.62)return false;if(k>0&&!isLowCover(k))return false;}return true;}
function nearLowCover(){if(!game)return false;for(const d of [.7,1,1.35,1.7]){for(const [dx,dy] of [[d,0],[-d,0],[0,d],[0,-d],[d*.72,d*.72],[-d*.72,d*.72],[d*.72,-d*.72],[-d*.72,-d*.72]]){if(isLowCover(cellKind(game.px+dx,game.py+dy)))return true;}}return false;}
function eyeY(h){if(!game)return h*.51;return h*(.51+(Math.min(1.6,game.z||0)*.13)-(game.crouched?.13:0));}
function visibility(x1,y1,x2,y2){let d=Math.hypot(x2-x1,y2-y1),s=Math.max(1,Math.ceil(d/.14));for(let i=1;i<s;i++){let a=i/s;if(solid(x1+(x2-x1)*a,y1+(y2-y1)*a))return false;}return true;}
function snapPassable(x,y,r=.3){if(passable(x,y,r))return [x,y];const cx=Math.floor(x)+.5,cy=Math.floor(y)+.5;for(let rad=1;rad<=8;rad++){for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){if(Math.abs(dx)!==rad&&Math.abs(dy)!==rad)continue;const nx=cx+dx,ny=cy+dy;if(nx>1.2&&ny>1.2&&nx<21.8&&ny<21.8&&passable(nx,ny,r))return [nx,ny];}}return [x,y];}
function pickWalkCell(ex,ey){const cells=(game.layout&&game.layout.walk)||[];if(!cells.length){for(let t=0;t<20;t++){let nx=2.6+Math.random()*18.8,ny=2.6+Math.random()*18.8;if(passable(nx,ny,.35))return [nx,ny];}return [ex,ey];}let best=null,bestD=-1;for(let i=0;i<14;i++){const c=cells[(Math.random()*cells.length)|0];const d=Math.hypot(c[0]-ex,c[1]-ey);if(d>2.5&&passable(c[0],c[1],.35)&&d>bestD){best=c;bestD=d;}}return best||cells[(Math.random()*cells.length)|0];}
function layoutPoint(kind,index=0){const L=game.layout||{};let p=null;if(kind==='rescue')p=L.rescue;else if(kind==='exit')p=L.exit;else if(kind==='device')p=(L.devices&&L.devices[index])||(L.devices&&L.devices[0]);else if(kind==='waypoint')p=(L.waypoints&&L.waypoints[index])||(L.waypoints&&L.waypoints[0]);else if(kind==='terminal')p=L.terminal||(L.devices&&L.devices[0]);if(!p)p=[18.5,12.5];return snapPassable(p[0],p[1]);}

function start(){let m=missions[selected];const layout=makeLayout(maps[m.map].theme);const s=layout.start;game={id:selected,m,theme:maps[m.map],grid:layout.grid,layout,px:s[0],py:s[1],dir:layout.dir,armor:100,escortHealth:100,terminalHealth:100,ammo:24,reserve:144,weapon:0,aim:false,shieldUntil:0,droneUntil:0,invuln:0,enemies:[],objective:null,stage:0,stageDone:0,kills:0,shots:0,hits:0,devices:0,rescues:0,elapsed:0,remaining:m.time,animation:0,muzzle:0,hitFlash:0,wasMoving:false,objectIndex:0,escort:null,lastFire:-10,spawnCycle:0,defendClock:0,z:0,vz:0,crouched:false,inCover:false,running:false};runHeld=false;hideHeld=false;jumpPulse=false;running=true;paused=false;show('playing');prepareStage();beep('win',.09);note(`MISSION ${String(selected+1).padStart(2,'0')}: ${m.name}`,2.5);}
function spawnEnemy(x,y,kind='guard'){const p=snapPassable(x,y,.28);x=p[0];y=p[1];if(solid(x,y))return;game.enemies.push({x,y,kind,hp:kind==='heavy'?10:kind==='shield'?4:kind==='bot'?2:3,phase:Math.random()*6,speed:kind==='heavy'?2.15:kind==='bot'?3.05:2.7,cool:1+Math.random(),state:'active',hitAt:0,alert:0,wx:0,wy:0,stuck:0,stride:0,moving:false,vx:0,vy:0,mvx:0,mvy:0,facing:0,orbit:Math.random()<.5?1:-1,fall:0,deathDir:Math.random()<.5?1:-1,sideT:0});}
function spawnWave(n,heavy=false){const slots=(game.layout&&game.layout.spawns&&game.layout.spawns.length)?game.layout.spawns:[[8.5,12.5],[11.5,11.5],[14.5,13.5],[17.5,11.5],[19.5,14.5],[7.5,14.5],[12.5,14.5],[16.5,10.5],[20.5,12.5],[9.5,10.5]];for(let i=0;i<n;i++){let [x,y]=slots[(game.spawnCycle+i)%slots.length];const p=snapPassable(x,y,.3);spawnEnemy(p[0],p[1],heavy?'heavy':i%4===2?'shield':i%3===0?'bot':'guard');}game.spawnCycle+=3;}
function prepareStage(){const st=game.m.steps[game.stage];if(!st){finish(true);return;}game.stageDone=0;game.objectIndex=0;game.objective=null;game.escort=null;game.enemies=[];if(st[0]==='combat')spawnWave(st[1],game.id===11&&game.stage===2);else if(st[0]==='defend'){game.defendClock=0;game.terminalHealth=100;const p=layoutPoint('terminal');game.objective={type:'device',x:p[0],y:p[1],active:true};spawnWave(3);}else if(st[0]==='rescue'){const p=layoutPoint('rescue');game.objective={type:'rescue',x:p[0],y:p[1],active:true};}else if(st[0]==='escort'){const r=layoutPoint('rescue'),ex=layoutPoint('exit');game.escort={x:r[0],y:r[1],safety:100};game.objective={type:'exit',x:ex[0],y:ex[1],active:true};spawnWave(2);}else if(st[0]==='disable'){const p=layoutPoint('device',0);game.objective={type:'device',x:p[0],y:p[1],active:true};spawnWave(game.m.diff==='Tight'?2:1);}else if(st[0]==='waypoint'){const p=layoutPoint('waypoint');game.objective={type:'point',x:p[0],y:p[1],active:true};}updateHUD();note(st[2],2);}
function nextStage(){game.stage++;prepareStage();}
let noticeUntil=0;function note(msg,seconds=1.6){$('notice').textContent=msg;$('notice').style.opacity=1;noticeUntil=performance.now()/1000+seconds;}
function updateHUD(){if(!game)return;const st=game.m.steps[game.stage];$('hudMission').textContent=`MISSION ${String(game.id+1).padStart(2,'0')} · ${game.theme.name}`;$('hudObjective').textContent=st?st[2]:'Mission Complete';$('hudTimer').textContent=`TIME ${Math.max(0,Math.floor(game.remaining/60)).toString().padStart(2,'0')}:${Math.max(0,Math.floor(game.remaining%60)).toString().padStart(2,'0')}`;$('hudTimer').style.color=game.remaining<60?'#ff907e':'#ffd666';$('armorBar').style.width=`${Math.max(0,game.armor)}%`;$('armorText').textContent=Math.ceil(game.armor);if($('stanceTag'))$('stanceTag').textContent=game.inCover?'IN COVER':game.running?'RUNNING':game.crouched?'HIDING':game.z>.12?'JUMP':'';$('armorBar').style.background=game.armor<35?'linear-gradient(90deg,#ed594d,#ffa459)':'linear-gradient(90deg,#31e2a7,#d1fa61)';$('weaponName').textContent=game.weapon?'PULSE SIDEARM':'SKYLINE RIFLE';$('ammoText').textContent=`${game.ammo} / ${game.reserve}`;}
function move(dx,dy){if(!running||paused)return;const r=.21;if(playerPassable(game.px+dx,game.py,r))game.px+=dx;if(playerPassable(game.px,game.py+dy,r))game.py+=dy;}
function shoot(){if(!running||paused||game.elapsed-game.lastFire<(game.weapon?.3:.16))return;game.lastFire=game.elapsed;if(game.ammo<=0){note('RELOAD REQUIRED',1);beep('tap');return;}game.ammo--;game.shots++;game.muzzle=.12;beep('shot',.07);let target=null,angle=game.dir,best=1e6;for(const e of game.enemies){if(e.state!=='active')continue;let dist=Math.hypot(e.x-game.px,e.y-game.py),ad=Math.atan2(e.y-game.py,e.x-game.px)-angle;ad=Math.atan2(Math.sin(ad),Math.cos(ad));const threshold=(game.aim?.075:.11)+(.13/dist);if(Math.abs(ad)<threshold&&dist<21&&dist<best&&visibility(game.px,game.py,e.x,e.y)){target=e;best=dist;}}if(target){game.hits++;target.hp--;target.hitAt=.25;beep('hit',.07);if(target.hp<=0){target.state='disabled';target.fall=0;target.moving=false;target.mvx=0;target.mvy=0;game.kills++;note('HOSTILE UNIT STOPPED!',.85);}else note('DIRECT HIT!',.5);}updateHUD();}
function reload(){if(!game||paused)return;let max=game.weapon?12:24;let take=Math.min(max-game.ammo,game.reserve);if(take<=0)return;game.ammo+=take;game.reserve-=take;note('RELOADED',.9);beep();updateHUD();}
function switchWeapon(){if(!game)return;game.weapon=1-game.weapon;game.ammo=Math.min(game.ammo,game.weapon?12:24);note(game.weapon?'PULSE SIDEARM':'SKYLINE RIFLE',1);updateHUD();}
function tool(name){if(!game||paused)return;if(name==='shield'){game.shieldUntil=game.elapsed+7;note('HALO SHIELD ACTIVE',1.5);beep('win',.08);}else if(name==='drone'){game.droneUntil=game.elapsed+12;note('SCOUT WING: TARGETS MARKED',1.5);beep('win',.08);}else if(name==='device'){interact();}}
function nearObjective(){let o=game?.objective;if(!o)return false;return Math.hypot(game.px-o.x,game.py-o.y)<1.9;}
function interact(){if(!game||paused||!game.objective)return;const st=game.m.steps[game.stage],type=st[0];if(!nearObjective()){note('MOVE CLOSER TO THE OBJECTIVE',1);return;}if(type==='rescue'){game.rescues++;note('RESCUE SUCCESSFUL!',1.3);beep('win');nextStage();}else if(type==='disable'){game.devices++;game.stageDone++;note('DEVICE DISABLED!',1.3);beep('win');if(game.stageDone>=st[1])nextStage();else {const p=layoutPoint('device',game.stageDone);game.objective={type:'device',x:p[0],y:p[1],active:true};game.enemies=[];spawnWave(1);}}else if(type==='escort'){if(Math.hypot(game.escort.x-game.objective.x,game.escort.y-game.objective.y)<2.5){note('ESCORT COMPLETE!',1.5);game.rescues++;nextStage();}else note('WAIT FOR YOUR ESCORT',1.1);}else if(type==='waypoint'){note('CHECKPOINT REACHED!',1.2);nextStage();}}
function finish(success){if(!running)return;running=false;show('results');$('resultIcon').textContent=success?'★':'↻';$('resultIcon').style.color=success?'#ffcf51':'#ff8e8e';$('resultTitle').textContent=success?'MISSION COMPLETE!':'MISSION FAILED';$('resultSub').textContent=success?`${game.m.name} — Taipei mission secured.`:'The mission objective was not completed. Try again!';let score=Math.max(1,Math.min(3,Math.round(3-(game.armor<40?1:0)-(game.hits/Math.max(1,game.shots)<.25?1:0))));if(success){progress.stars[game.id]=Math.max(progress.stars[game.id]||0,score);progress.unlocked=Math.max(progress.unlocked,Math.min(12,game.id+2));save();beep('win',.14);}else beep('damage',.12);$('resultStats').innerHTML=`<div><b>${Math.floor(game.elapsed/60)}:${Math.floor(game.elapsed%60).toString().padStart(2,'0')}</b><small>TIME</small></div><div><b>${game.kills}</b><small>UNITS STOPPED</small></div><div><b>${game.shots?Math.round(game.hits/game.shots*100):0}%</b><small>ACCURACY</small></div><div><b>${game.rescues}</b><small>RESCUES</small></div><div><b>${game.devices}</b><small>DEVICES</small></div><div><b>${success?'★'.repeat(score):'—'}</b><small>RATING</small></div>`;$('resultPrimary').textContent=success&&game.id<11?'NEXT MISSION':'TRY AGAIN';$('resultPrimary').onclick=()=>success&&game.id<11?brief(game.id+1):start();$('resultSecondary').onclick=missionSelect;}
function pause(){if(!running)return;paused=!paused;$('pauseOverlay').hidden=!paused;}
$('pauseBtn').onclick=pause;$('resumeBtn').onclick=pause;$('restartBtn').onclick=()=>{paused=false;start();};$('quitBtn').onclick=()=>{paused=false;running=false;missionSelect();};$('reloadBtn').onclick=reload;$('switchBtn').onclick=switchWeapon;$('aimBtn').onclick=()=>{if(game){game.aim=!game.aim;$('aimBtn').style.borderColor=game.aim?'#ffe15e':'';}};$('interactBtn').onclick=interact;document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>tool(b.dataset.tool));
let simHold=false,moveInput={x:0,y:0},keys=new Set(),firing=false,padId=null,lookId=null,lastLookX=0,runHeld=false,hideHeld=false,jumpPulse=false;
const pad=$('movePad'),look=$('lookPad'),knob=$('moveKnob');
function updatePad(e){let r=pad.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+62;let x=(e.clientX-cx)/50,y=(e.clientY-cy)/50;let mag=Math.max(1,Math.hypot(x,y));moveInput.x=x/mag;moveInput.y=y/mag;knob.style.transform=`translate(${moveInput.x*35}px,${moveInput.y*35}px)`;}
pad.addEventListener('pointerdown',e=>{padId=e.pointerId;pad.setPointerCapture(e.pointerId);updatePad(e);e.preventDefault();});pad.addEventListener('pointermove',e=>{if(e.pointerId===padId){updatePad(e);e.preventDefault();}});function padUp(e){if(e.pointerId===padId){padId=null;moveInput.x=moveInput.y=0;knob.style.transform='';}}pad.addEventListener('pointerup',padUp);pad.addEventListener('pointercancel',padUp);
look.addEventListener('pointerdown',e=>{lookId=e.pointerId;lastLookX=e.clientX;look.setPointerCapture(e.pointerId);e.preventDefault()});look.addEventListener('pointermove',e=>{if(e.pointerId!==lookId||!running||paused)return;let dx=e.clientX-lastLookX;lastLookX=e.clientX;game.dir+=dx*.005*(game.aim?.58:1);e.preventDefault();});look.addEventListener('pointerup',()=>lookId=null);look.addEventListener('pointercancel',()=>lookId=null);
const fire=$('fireBtn');fire.addEventListener('pointerdown',e=>{firing=true;fire.setPointerCapture(e.pointerId);shoot();e.preventDefault();});fire.addEventListener('pointerup',()=>firing=false);fire.addEventListener('pointercancel',()=>firing=false);
const runBtn=$('runBtn'),jumpBtn=$('jumpBtn'),hideBtn=$('hideBtn');
if(runBtn){const setRun=v=>{runHeld=v;runBtn.classList.toggle('on',v);};runBtn.addEventListener('pointerdown',e=>{setRun(true);runBtn.setPointerCapture(e.pointerId);e.preventDefault();});runBtn.addEventListener('pointerup',()=>setRun(false));runBtn.addEventListener('pointercancel',()=>setRun(false));}
if(jumpBtn){jumpBtn.addEventListener('pointerdown',e=>{jumpPulse=true;jumpBtn.setPointerCapture(e.pointerId);e.preventDefault();});}
if(hideBtn){const setHide=v=>{hideHeld=v;hideBtn.classList.toggle('on',v);};hideBtn.addEventListener('pointerdown',e=>{setHide(true);hideBtn.setPointerCapture(e.pointerId);e.preventDefault();});hideBtn.addEventListener('pointerup',()=>setHide(false));hideBtn.addEventListener('pointercancel',()=>setHide(false));}
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(e.repeat)return;let k=e.key.toLowerCase();if(k==='escape'&&running)pause();else if(k==='r')reload();else if(k==='f')interact();else if(k==='q')tool('shield');else if(k==='e')tool('drone');else if(k==='1'||k==='2'){if(game){game.weapon=k==='2'?1:0;updateHUD();}}else if(k===' '){firing=true;shoot();}else if(k==='v'||k==='j'){jumpPulse=true;}});addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase());if(e.key===' ')firing=false;});
function simulate(dt){if(!game||paused||!running)return;dt=Math.min(dt,.05);game.elapsed+=dt;game.remaining-=dt;game.animation+=dt*(game.wasMoving?8:1.4);game.muzzle=Math.max(0,game.muzzle-dt);game.hitFlash=Math.max(0,game.hitFlash-dt);if(game.remaining<=0){finish(false);return;}
if(keys.has('arrowleft')||keys.has('a'))game.dir-=dt*2.15;if(keys.has('arrowright')||keys.has('d'))game.dir+=dt*2.15;game.dir+=moveInput.x*dt*2.6;
game.crouched=hideHeld||keys.has('c')||keys.has('control');if(game.crouched&&(jumpPulse||keys.has('v')||keys.has('j'))){game.crouched=false;hideHeld=false;}
if((jumpPulse||keys.has('v')||keys.has('j'))&&game.z<=.02&&!game.crouched){game.vz=4.35;jumpPulse=false;beep('tap',.1);}else{jumpPulse=false;}
game.vz-=14.5*dt;game.z+=game.vz*dt;if(game.z<0){game.z=0;game.vz=0;}
game.running=(runHeld||keys.has('shift'))&&!game.crouched&&game.z<=.02;
game.inCover=game.crouched&&nearLowCover();
let forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0)-moveInput.y;if(Math.abs(forward)>1)forward=Math.sign(forward);game.wasMoving=Math.abs(forward)>.08||game.z>.02;let sp=(game.running?5.05:game.crouched?1.85:3.2)*dt;move(Math.cos(game.dir)*forward*sp,Math.sin(game.dir)*forward*sp);if(firing)shoot();
for(const e of game.enemies){
  if(e.state==='disabled'){e.fall=Math.min(1,(e.fall||0)+dt*3.2);e.moving=false;e.mvx=0;e.mvy=0;e.hitAt=Math.max(0,e.hitAt-dt);continue;}
  e.phase+=dt;e.hitAt=Math.max(0,e.hitAt-dt);
  let d=Math.hypot(e.x-game.px,e.y-game.py);const sees=!e.patrolOnly&&d<14&&visibility(game.px,game.py,e.x,e.y);
  let tx=e.x,ty=e.y,wantSp=0;
  if(e.patrolOnly){
    if(!e.wx||Math.hypot(e.x-e.wx,e.y-e.wy)<.45||e.stuck>0.8){e.stuck=0;const p=pickWalkCell(e.x,e.y);if(!e.wx){e.wx=p[0];e.wy=p[1];}}
    tx=e.wx||e.x+1;ty=e.wy||e.y;wantSp=e.speed*.7;
  }else if(sees){
    e.alert=2.8;
    if(d>3.4){tx=game.px;ty=game.py;wantSp=e.speed;}
    else if(d>2.1){tx=game.px;ty=game.py;wantSp=e.speed*.62;}
    else{
      e.sideT=(e.sideT||0)-dt;
      if(e.sideT<=0){e.sideT=1.3+Math.random()*1.5;e.orbit=Math.random()<.5?1:-1;}
      if(e.sideT>0.85){const ang=Math.atan2(e.y-game.py,e.x-game.px)+e.orbit*Math.PI*.5;tx=e.x+Math.cos(ang)*1.1;ty=e.y+Math.sin(ang)*1.1;wantSp=.7;}
      else {tx=e.x;ty=e.y;wantSp=0;}
    }
  }else if(e.alert>0){e.alert-=dt;tx=game.px;ty=game.py;wantSp=e.speed*.85;}
  else{
    if(!e.wx||Math.hypot(e.x-e.wx,e.y-e.wy)<.45||e.stuck>0.8){e.stuck=0;const p=pickWalkCell(e.x,e.y);e.wx=p[0];e.wy=p[1];}
    tx=e.wx||e.x+1;ty=e.wy||e.y;wantSp=e.speed*.58;
  }
  let dx=tx-e.x,dy=ty-e.y,dd=Math.hypot(dx,dy)||1;
  let wdx=wantSp>0.05?dx/dd*wantSp:0,wdy=wantSp>0.05?dy/dd*wantSp:0;
  const smooth=wantSp>0.1?7:10;
  e.mvx=(e.mvx||0)+(wdx-(e.mvx||0))*Math.min(1,dt*smooth);
  e.mvy=(e.mvy||0)+(wdy-(e.mvy||0))*Math.min(1,dt*smooth);
  let vx=e.mvx*dt,vy=e.mvy*dt,moved=false;
  if(passable(e.x+vx,e.y+vy,.28)){e.x+=vx;e.y+=vy;moved=true;}
  else if(passable(e.x+vx,e.y,.28)){e.x+=vx;e.mvx*=.4;moved=true;}
  else if(passable(e.x,e.y+vy,.28)){e.y+=vy;e.mvy*=.4;moved=true;}
  else{let px=-vy,py=vx;if(passable(e.x+px,e.y+py,.28)){e.x+=px;e.y+=py;moved=true;}else if(passable(e.x-px,e.y-py,.28)){e.x-=px;e.y-=py;moved=true;}e.stuck=(e.stuck||0)+dt;e.mvx*=.3;e.mvy*=.3;}
  const spNow=Math.hypot(e.mvx,e.mvy);
  e.moving=moved&&spNow>0.35;
  if(e.moving){e.vx=e.mvx;e.vy=e.mvy;e.facing=Math.atan2(e.mvy,e.mvx);e.stride=(e.stride||0)+dt*(spNow>e.speed*.85?2.2:1.6);}
  e.cool-=dt;
  if(d<9&&e.cool<=0&&visibility(game.px,game.py,e.x,e.y)){
    e.cool=(game.m.diff==='Tight'?2.1:3.6)+Math.random()*1.7;
    let damage=(game.m.diff==='Tight'?5:3.3)*(game.elapsed<game.shieldUntil?.25:1)*(game.inCover?.3:game.crouched?.7:1);
    game.armor-=damage;game.hitFlash=.18;beep('damage',.026);if(game.armor<=0){game.armor=0;finish(false);return;}
  }
}
const st=game.m.steps[game.stage];if(st){if(st[0]==='combat'&&game.enemies.length&&game.enemies.every(e=>e.state!=='active')){nextStage();}else if(st[0]==='waypoint'&&nearObjective()){nextStage();}else if(st[0]==='defend'){game.defendClock+=dt;if(game.defendClock>=10){game.defendClock=0;game.stageDone++;game.enemies=[];if(game.stageDone>=st[1])nextStage();else{spawnWave(3+game.stageDone);note(`WAVE ${game.stageDone+1} INCOMING!`,1.3);}}else if(game.enemies.some(e=>e.state==='active')){game.terminalHealth-=dt*(game.m.diff==='Tight'?.55:.3)*game.enemies.filter(e=>e.state==='active').length;if(game.terminalHealth<=0){finish(false);return;}}}else if(st[0]==='escort'&&game.escort){const o=game.escort,d=Math.hypot(game.px-o.x,game.py-o.y);if(d>1.3&&d<9){let ux=(game.px-o.x)/d,uy=(game.py-o.y)/d,step=2.35*dt;if(passable(o.x+ux*step,o.y+uy*step,.3)){o.x+=ux*step;o.y+=uy*step;}}if(game.enemies.some(e=>e.state==='active')){o.safety-=dt*.4;if(o.safety<=0){finish(false);return;}}if(Math.hypot(o.x-game.objective.x,o.y-game.objective.y)<2.2&&Math.hypot(game.px-game.objective.x,game.py-game.objective.y)<2.8)nextStage();}}
if(game.ammo===0&&game.reserve===0){game.reserve=48;note('EMERGENCY AMMO SUPPLY!',1.3);}updateHUD();let it=game.objective&&nearObjective();$('interactBtn').style.display=it?'block':'none';$('missionPrompt').style.display=it?'block':'none';$('missionPrompt').textContent=it?(game.objective.type==='device'?'TAP INTERACT — DISABLE DEVICE':game.objective.type==='rescue'?'TAP INTERACT — RESCUE':game.objective.type==='exit'?'ESCORT TO THE EXIT':'CHECKPOINT REACHED'):'';if(performance.now()/1000>noticeUntil)$('notice').style.opacity=0;
}
// Painted character sprites, lighting and decorative landmark skyline are original procedural artwork.
function sprite(kind){if(spriteCache[kind])return spriteCache[kind];let c=document.createElement('canvas');c.width=160;c.height=230;let p=c.getContext('2d');p.lineJoin='round';p.lineCap='round';p.strokeStyle='#15365b';p.lineWidth=6;
const box=(x,y,w,h,r,col,stroke=true)=>{p.fillStyle=col;p.beginPath();p.roundRect(x,y,w,h,r);p.fill();if(stroke)p.stroke();};
p.save();p.shadowColor='#15355d77';p.shadowBlur=10;
if(kind==='bot'||kind==='heavy'){box(32,63,96,108,20,kind==='heavy'?'#4d6896':'#cbd5dc');box(42,74,76,70,14,'#e4f2fc');box(48,82,64,43,10,'#213b59');box(55,91,19,13,4,'#ffbf44',false);box(85,91,19,13,4,'#ffbf44',false);box(24,101,24,67,9,'#ffb33f');box(112,101,24,67,9,'#ffb33f');box(39,159,31,55,8,'#596f94');box(90,159,31,55,8,'#596f94');box(61,50,37,18,8,'#ffbe55');}else{box(51,125,28,87,8,'#4e6393');box(83,125,28,87,8,'#4e6393');box(39,89,84,76,19,'#72849e');box(52,100,56,50,11,kind==='shield'?'#d59f5d':'#d55755');box(26,95,23,68,9,'#62738d');box(115,95,23,68,9,'#62738d');p.fillStyle='#e0b98b';p.beginPath();p.arc(80,66,38,0,TAU);p.fill();p.stroke();box(43,38,75,46,16,'#48546f');box(46,53,68,24,9,'#182c47');box(54,61,53,7,3,'#65d6ef',false);box(29,134,45,19,6,'#304357');}
p.restore();spriteCache[kind]=c;return c;}
function drawLandmark(p,theme,w,h){const cx=w*.5,ground=h*.85;const c={tower:['#3d90b9','#59bad2'],memorial:['#e8f2f5','#2b5eac'],temple:['#e7b76b','#c84b3e'],museum:['#ebf4e4','#529782'],square:['#f0f6fb','#3189bd'],dome:['#d4eeff','#458bbf'],night:['#faaf67','#fa4c77'],mountain:['#4d8c7c','#7eb795']}[theme];p.save();p.translate(cx,ground);p.lineJoin='round';p.lineWidth=4;p.strokeStyle='#24506e';p.fillStyle=c[0];
const poly=(points,fill,stroke=true)=>{p.beginPath();p.moveTo(...points[0]);points.slice(1).forEach(z=>p.lineTo(...z));p.closePath();p.fillStyle=fill;p.fill();if(stroke)p.stroke();};
if(theme==='tower'){for(let i=0;i<7;i++){let ww=108-i*11,y=-38-i*39;poly([[-ww/2,y],[ww/2,y],[ww/2-7,y-39],[-ww/2+7,y-39]],i%2?c[0]:c[1]);p.fillStyle='#d0f4ff';for(let j=-ww/2+12;j<ww/2-8;j+=14)p.fillRect(j,y-31,5,20);}p.fillStyle='#f6ce72';p.fillRect(-4,-369,8,49);}
else if(theme==='memorial'||theme==='square'){const size=theme==='square'?245:170;p.fillStyle='#f8f6ea';p.fillRect(-size/2,-120,size,120);for(let j=-size/2+18;j<size/2;j+=28){p.fillStyle='#d6e4ec';p.fillRect(j,-100,13,86)}poly([[-size*.62,-133],[size*.62,-133],[size*.53,-169],[-size*.53,-169]],c[1]);poly([[-size*.56,-169],[size*.56,-169],[size*.43,-206],[-size*.43,-206]],'#2369ac');if(theme==='square'){for(let x of [-120,120]){p.fillStyle='#edf2f2';p.fillRect(x-9,-145,18,145);}}}
else if(theme==='temple'||theme==='museum'){p.fillStyle='#f5e9d5';p.fillRect(-165,-111,330,111);for(let x=-136;x<160;x+=42){p.fillStyle=theme==='temple'?'#ba5142':'#dce9e7';p.fillRect(x,-97,18,94);}poly([[-190,-123],[190,-123],[138,-173],[-138,-173]],c[1]);poly([[-135,-171],[135,-171],[98,-207],[-98,-207]],theme==='temple'?'#cf543d':'#64a48a');for(let x=-176;x<=176;x+=35){p.fillStyle='#f7da85';p.fillRect(x,-130,7,11);}}
else if(theme==='dome'){p.beginPath();p.ellipse(0,-45,210,112,0,Math.PI,0);p.lineTo(210,0);p.lineTo(-210,0);p.fillStyle='#b6d9ed';p.fill();p.stroke();for(let i=-4;i<=4;i++){p.strokeStyle='#4c93c4';p.lineWidth=3;p.beginPath();p.moveTo(i*40,0);p.lineTo(i*31,-100);p.stroke();}}
else if(theme==='night'){for(let i=0;i<7;i++){let x=-260+i*84;p.fillStyle=i%2?'#f1a85c':'#cf6390';p.fillRect(x,-125,73,125);p.fillStyle='#ffdf68';p.fillRect(x+7,-104,59,24);p.fillStyle='#f8d5a7';for(let k=0;k<3;k++)p.fillRect(x+10+k*18,-63,10,18);p.fillStyle='#e4485b';p.beginPath();p.ellipse(x+37,-144,17,21,0,0,TAU);p.fill();}}
else if(theme==='mountain'){for(let layer=0;layer<3;layer++){let shift=layer*34;poly([[-480,0],[-355,-120+shift],[-240,-40],[-80,-200+shift],[70,-60],[210,-160+shift],[440,0]],layer===0?'#72a8aa':layer===1?'#4d8c77':'#38725f',false);}p.fillStyle='#d7e6d8';p.fillRect(-75,-60,150,60);p.fillStyle='#3b5770';p.fillRect(-46,-95,92,35);p.fillRect(-4,-145,8,50);}
p.restore();}
function wallLook(t,hit,isBorder){
  if(hit===19)return {wall:'#9ec4dc',trim:'#e8f2f8',accent:'#d7e6f2',stripe:false,glassWall:true};
  if(isBorder)return {wall:t.wall,trim:t.trim,accent:t.accent,stripe:false};
  const low=isLowCover(hit);
  if(t.theme==='tower'){
    if(hit===2||hit===8)return {wall:'#6b7c8d',trim:'#c9d6e2',accent:'#ffbd43',stripe:false};
    if(hit===10)return {wall:'#4a5d70',trim:'#8eb4d4',accent:'#7ec8ff',stripe:false,glass:true};
    return {wall:'#8aa0b3',trim:'#d7e6f2',accent:'#9ad0f0',stripe:false,glass:hit===17||hit===1};
  }
  if(t.theme==='memorial'){
    if(low)return {wall:'#d8d4c6',trim:'#b8b09a',accent:'#f0c35f',stripe:false};
    return {wall:'#eef0e8',trim:'#2e64a8',accent:'#f0c35f',stripe:false};
  }
  if(t.theme==='temple'){
    if(hit===7)return {wall:'#6b3a28',trim:'#edbc53',accent:'#ffc34a',stripe:false};
    return {wall:'#b84638',trim:'#edbc53',accent:'#6b1e16',stripe:false};
  }
  if(t.theme==='museum'){
    if(low)return {wall:'#cfc6b0',trim:'#8a7a5c',accent:'#ffe39b',stripe:false};
    return {wall:'#e6eadf',trim:'#46857b',accent:'#dce1d8',stripe:false};
  }
  if(t.theme==='square'){
    if(low)return {wall:'#6b8f4e',trim:'#c5d67a',accent:'#ffd063',stripe:false};
    return {wall:'#e8eef0',trim:'#347ac5',accent:'#d7e6ea',stripe:false};
  }
  if(t.theme==='dome'){
    if(hit===5)return {wall:'#2a8a96',trim:'#54e1ff',accent:'#1a5c66',stripe:false,seat:true};
    return {wall:'#8aaebb',trim:'#277bbd',accent:'#54e1ff',stripe:false};
  }
  if(t.theme==='night'){
    if(hit===4)return {wall:'#d9784a',trim:'#ffce57',accent:'#e04e67',stripe:true};
    if(hit===15)return {wall:'#a33b3b',trim:'#ffce57',accent:'#de936e',stripe:false};
    return {wall:'#de936e',trim:'#e04e67',accent:'#ffce57',stripe:false};
  }
  if(low)return {wall:'#6a7a4e',trim:'#2d4a32',accent:'#c4d39a',stripe:false};
  if(hit===16)return {wall:'#8a8a80',trim:'#427656',accent:'#ffeb8d',stripe:false};
  return {wall:'#7cab83',trim:'#427656',accent:'#ffeb8d',stripe:false};
}
function miniColor(v){
  if(!v)return null;
  if(v===9)return '#1a3358';
  if(v===4)return '#e08a3c';
  if(v===5)return '#3cbfc8';
  if(v===6)return '#5a8a4a';
  if(v>=2&&v<=8)return '#c4b07a';
  if(v===10)return '#5a6a7a';
  if(v===15||v===13||v===11)return '#b85a4a';
  if(v===16)return '#8a8a70';
  if(v===14)return '#3a7a88';
  if(v===12)return '#8aa090';
  if(v===19)return '#7ec8e8';
  return '#4a6a88';
}
function scenePlateLayout(){const simg=game?sceneImage(game.m.map):null;if(!simg||!simg.naturalWidth)return null;const t=game.theme,eye=eyeY(CH),lift=t.skyLift==null?.5:t.skyLift;const destW=Math.max(CW*1.14,CH*.72*(simg.naturalWidth/simg.naturalHeight)),destH=destW*(simg.naturalHeight/simg.naturalWidth);const offset=(CW/2-destW/2)-(game.dir*.55)*destW/Math.PI+(t.pan||0)*destW,by=eye-destH*lift;return {simg,destW,destH,offset,by};}
function drawScenePlate(p,plat){if(!plat)return;const {simg,destW,destH,offset,by}=plat;p.drawImage(simg,offset,by,destW,destH);if(offset>0)p.drawImage(simg,offset-destW,by,destW,destH);if(offset+destW<CW)p.drawImage(simg,offset+destW,by,destW,destH);}
function drawSky(p,t){let g=p.createLinearGradient(0,0,0,CH*.65);g.addColorStop(0,t.sky);g.addColorStop(.8,t.theme==='night'?'#7c5e9f':'#dbf7ff');g.addColorStop(1,t.theme==='night'?'#ff996e':'#f6e9ce');p.fillStyle=g;p.fillRect(0,0,CW,CH*.61);
const simg=game?sceneImage(game.m.map):null;
if(simg){const destW=Math.max(CW*1.14,CH*.72*(simg.naturalWidth/simg.naturalHeight)),destH=destW*(simg.naturalHeight/simg.naturalWidth);const eye=eyeY(CH),lift=t.skyLift==null?.5:t.skyLift;let offset=(CW/2-destW/2)-(game.dir*.55)*destW/Math.PI+(t.pan||0)*destW;const by=eye-destH*lift;p.save();p.drawImage(simg,offset,by,destW,destH);if(offset>0)p.drawImage(simg,offset-destW,by,destW,destH);if(offset+destW<CW)p.drawImage(simg,offset+destW,by,destW,destH);let fade=p.createLinearGradient(0,eye-40,0,eye+6);fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(1,t.theme==='night'?'#6d6086cc':'#b7bdc0cc');p.fillStyle=fade;p.fillRect(0,eye-40,CW,50);p.restore();}
else{p.globalAlpha=t.theme==='night'?.7:.6;p.fillStyle='#fff';for(let i=0;i<7;i++){let x=((i*203+40)-(game.dir*80)%1800+1800)%1800-150,y=CH*(.12+(i%3)*.07);p.beginPath();p.ellipse(x,y,60,14,0,0,TAU);p.ellipse(x-30,y+4,48,11,0,0,TAU);p.ellipse(x+30,y+5,52,11,0,0,TAU);p.fill();}p.globalAlpha=1;p.save();p.globalAlpha=.9;let offset=Math.sin(game.dir)*CW*.23;p.translate(offset,-CH*.02);drawLandmark(p,t.theme,CW,CH*.69);p.restore();}
}

function drawCeiling(p,t,eye,w,h){
  if(t.theme!=='tower'&&t.theme!=='museum')return;
  const bot=Math.max(8,eye-5);
  const g=p.createLinearGradient(0,0,0,bot);
  if(t.theme==='tower'){g.addColorStop(0,'#5d6773');g.addColorStop(.5,'#8a96a3');g.addColorStop(1,'#cfd6dd');}
  else{g.addColorStop(0,'#6f7268');g.addColorStop(.55,'#a3a79c');g.addColorStop(1,'#d8dcd0');}
  p.fillStyle=g;p.fillRect(0,0,w,bot);
  p.strokeStyle=t.theme==='tower'?'rgba(255,255,255,.13)':'rgba(255,255,255,.11)';p.lineWidth=1;
  for(let i=-7;i<=7;i++){if(!i)continue;p.beginPath();p.moveTo(w/2,bot);p.lineTo(w/2+i*w*.13,0);p.stroke();}
  for(let y=.1;y<.95;y+=.11){p.beginPath();p.moveTo(0,bot*y);p.lineTo(w,bot*y);p.stroke();}
  for(let row=0;row<4;row++){
    const yy=bot*(.16+row*.2),spread=.42-row*.07;
    for(let i=-3;i<=3;i++){
      const xx=w/2+i*w*spread*.28;
      p.fillStyle='rgba(255,250,230,.16)';p.beginPath();p.ellipse(xx,yy,26-row*3,9,0,0,TAU);p.fill();
      p.fillStyle='rgba(255,244,210,.62)';p.beginPath();p.ellipse(xx,yy,11-row,4.2,0,0,TAU);p.fill();
    }
  }
}
function drawWorld(){if(!game)return;let t=game.theme;let h=CH,w=CW;drawSky(ctx,t);
let eye=eyeY(h);const floorFar={tower:'#b8c0c8',memorial:'#d9d4c8',temple:'#c9a886',museum:'#cfd2c6',square:'#d0cbb8',dome:'#8fae8c',night:'#4a4a58',mountain:'#7b9a68'}[t.theme]||'#b7bdc0';let floor=ctx.createLinearGradient(0,eye,0,h);floor.addColorStop(0,t.theme==='night'?'#4a4560':floorFar);floor.addColorStop(1,t.floor);ctx.fillStyle=floor;ctx.fillRect(0,eye,w,h-eye);
drawCeiling(ctx,t,eye,w,h);
ctx.lineWidth=1;
if(t.theme==='tower'||t.theme==='museum'){ctx.strokeStyle=t.theme==='tower'?'#ffffff14':'#ffffff12';for(let i=-4;i<=4;i++){if(!i)continue;ctx.beginPath();ctx.moveTo(w/2,eye+18);ctx.lineTo(w/2+i*w*.18,h);ctx.stroke();}for(let y=.64;y<1;y+=.14){ctx.beginPath();ctx.moveTo(w*.18,h*y);ctx.lineTo(w*.82,h*y);ctx.stroke();}}
else if(t.theme==='mountain'){ctx.strokeStyle='#4a6a3840';ctx.globalAlpha=.35;for(let i=-8;i<=8;i++){ctx.beginPath();ctx.moveTo(w/2,eye+8);ctx.lineTo(w/2+i*w*.1,h);ctx.stroke();}ctx.globalAlpha=1;}
else if(t.theme==='night'){ctx.strokeStyle='#e8c35a33';ctx.beginPath();ctx.moveTo(w/2,eye+4);ctx.lineTo(w/2,h);ctx.stroke();ctx.strokeStyle='#ffffff22';for(let y=.6;y<1;y+=.09){ctx.beginPath();ctx.moveTo(w*.42,h*y);ctx.lineTo(w*.58,h*y);ctx.stroke();}}
else if(t.theme==='dome'){ctx.strokeStyle='#e8f5ea33';for(let k=0;k<4;k++){let yy=eye+(h-eye)*(.2+k*.2);ctx.beginPath();ctx.ellipse(w/2,yy,w*(.12+k*.12),(h-yy)*.08,0,0,TAU);ctx.stroke();}}
else if(t.theme==='memorial'||t.theme==='square'){ctx.strokeStyle=t.theme==='square'?'#efe8d350':'#ffffff55';ctx.beginPath();ctx.moveTo(w/2,eye);ctx.lineTo(w/2,h);ctx.stroke();for(let i=-6;i<=6;i++){if(!i)continue;let x=w/2+i*w*.1;ctx.beginPath();ctx.moveTo(w/2,eye+10);ctx.lineTo(x,h);ctx.stroke();}for(let y=.58;y<1;y+=.07){ctx.beginPath();ctx.moveTo(0,h*y);ctx.lineTo(w,h*y);ctx.stroke();}}
else{ctx.strokeStyle='#8a5a3040';for(let i=-8;i<=8;i++){let x=w/2+i*w*.1;ctx.beginPath();ctx.moveTo(w/2,eye+8);ctx.lineTo(x,h);ctx.stroke();}for(let y=.58;y<1;y+=.09){ctx.beginPath();ctx.moveTo(0,h*y);ctx.lineTo(w,h*y);ctx.stroke();}}
const FOV=game.aim?.67:1.17,rays=Math.min(640,Math.ceil(w/2.2)),sw=w/rays;screenDepth=new Array(rays);
for(let i=0;i<rays;i++){let a=game.dir+Math.atan((i/rays-.5)*2*Math.tan(FOV/2));let sx=Math.cos(a),sy=Math.sin(a),mx=Math.floor(game.px),my=Math.floor(game.py);let deltaX=Math.abs(1/(sx||.00001)),deltaY=Math.abs(1/(sy||.00001));let stepx=sx<0?-1:1,stepy=sy<0?-1:1,sideX=(sx<0?game.px-mx:mx+1-game.px)*deltaX,sideY=(sy<0?game.py-my:my+1-game.py)*deltaY,hit=0,side=0,dist=24;
for(let k=0;k<45;k++){if(sideX<sideY){sideX+=deltaX;mx+=stepx;side=0;}else{sideY+=deltaY;my+=stepy;side=1;}if(mx<0||my<0||mx>=24||my>=24){hit=0;dist=40;break;}if(game.grid[my][mx]){hit=game.grid[my][mx];dist=side===0?(mx-game.px+(1-stepx)/2)/(sx||.00001):(my-game.py+(1-stepy)/2)/(sy||.00001);break;}}
let d=Math.max(.12,dist*Math.cos(a-game.dir));screenDepth[i]=hit?d:40;if(!hit)continue;const isBorder=(mx<=0||my<=0||mx>=23||my>=23||hit===9);const isLow=isLowCover(hit);const isGlass=hit===19;const jig=((mx*5+my*3)%4)*0.035;const hMul=isGlass?2.08:isBorder?2.55:hit===4?.58:hit===5?.70:hit===6?.78+jig:hit===3?.86+jig*.5:isLow?.92:1.72,topK=isGlass?.53:isBorder?.58:hit===4?.10:hit===5?.12:isLow?.18:.48;let wallH=Math.min(h*3,h*.86/d*hMul),top=eye-wallH*topK,shade=Math.max(.37,1-d/21)*(side===1?.83:1);const look=wallLook(t,hit,isBorder);ctx.fillStyle=shadeColor(look.wall,shade);ctx.fillRect(i*sw,top,sw+1,wallH);let u=(side===0?game.py+dist*sy:game.px+dist*sx)%1;if(u<0)u+=1;
const simgW=sceneImage(game.m.map);
if(isGlass){const plat=scenePlateLayout();ctx.save();ctx.beginPath();ctx.rect(i*sw,top,sw+1.2,wallH);ctx.clip();if(plat){ctx.globalAlpha=.93*Math.max(.75,shade);drawScenePlate(ctx,plat);}ctx.fillStyle=`rgba(155,195,220,${.12*shade})`;ctx.fillRect(i*sw,top,sw+1.2,wallH);ctx.restore();}
else if(simgW&&isBorder&&t.theme!=='tower'&&t.theme!=='museum'){let su=((a/TAU)%1+1)%1*(simgW.naturalWidth-1);ctx.save();ctx.globalAlpha=.95*shade;ctx.drawImage(simgW,su,0,1,simgW.naturalHeight,i*sw,top,sw+1.2,wallH);ctx.restore();ctx.fillStyle=`rgba(8,24,48,${.22*(1-shade)})`;ctx.fillRect(i*sw,top,sw+1.2,wallH);}
else if(simgW&&!isLow&&!isBorder&&!isGlass){let su=((u+(mx+my)*.17)%1+1)%1*(simgW.naturalWidth-1);ctx.save();ctx.globalAlpha=.22*shade;ctx.drawImage(simgW,su,simgW.naturalHeight*.28,1,simgW.naturalHeight*.55,i*sw,top,sw+1.2,wallH);ctx.restore();}

// Facade outlines, material panels, decorative tiled windows.
if(isGlass){if(u<.08||u>.92){ctx.fillStyle=shadeColor(look.trim,shade*.95);ctx.fillRect(i*sw,top,sw+1,wallH);}ctx.fillStyle=shadeColor('#eef6fb',shade*.8);ctx.fillRect(i*sw,top,sw+1,Math.max(2,wallH*.04));ctx.fillStyle=shadeColor(look.trim,shade*.9);ctx.fillRect(i*sw,top+wallH*.48,sw+1,Math.max(1,wallH*.018));}
else{
if(u<.065||u>.94){ctx.fillStyle=shadeColor(look.trim,shade*.9);ctx.fillRect(i*sw,top,sw+1,wallH);}
if(hit===4){const awn=Math.floor((u+mx*.08)*8)%2===0;ctx.fillStyle=shadeColor(awn?look.accent:'#ffce57',shade);ctx.fillRect(i*sw,top,sw+1,wallH*.30);ctx.fillStyle=`rgba(80,20,20,${.28*shade})`;ctx.fillRect(i*sw,top+wallH*.30,sw+1,Math.max(1,wallH*.05));ctx.fillStyle=shadeColor('#e8c899',shade);ctx.fillRect(i*sw,top+wallH*.48,sw+1,Math.max(2,wallH*.07));ctx.fillStyle=shadeColor('#6b3a28',shade);ctx.fillRect(i*sw,top+wallH*.55,sw+1,wallH*.14);}
else if(hit===5){ctx.fillStyle=shadeColor(look.trim,shade);ctx.fillRect(i*sw,top+wallH*.10,sw+1,Math.max(2,wallH*.08));ctx.fillStyle=shadeColor(look.accent,shade*.85);ctx.fillRect(i*sw,top+wallH*.28,sw+1,wallH*.07);ctx.fillStyle=shadeColor('#1a5c66',shade);ctx.fillRect(i*sw,top+wallH*.40,sw+1,wallH*.10);ctx.fillStyle=shadeColor(look.trim,shade);ctx.fillRect(i*sw,top+wallH*.55,sw+1,Math.max(2,wallH*.08));ctx.fillStyle=shadeColor(look.accent,shade*.85);ctx.fillRect(i*sw,top+wallH*.70,sw+1,wallH*.07);ctx.fillStyle=shadeColor('#163f46',shade);ctx.fillRect(i*sw,top+wallH*.82,sw+1,wallH*.18);}
else if(hit===3){ctx.fillStyle=shadeColor('#5a7a40',shade);ctx.fillRect(i*sw,top,sw+1,wallH*.34);ctx.fillStyle=shadeColor('#c5d67a',shade);ctx.fillRect(i*sw,top+wallH*.30,sw+1,Math.max(2,wallH*.08));ctx.fillStyle=shadeColor('#8a7a55',shade);ctx.fillRect(i*sw,top+wallH*.38,sw+1,wallH*.5);}
else if(hit===6){const cap=.22+((mx+my)%3)*.05;ctx.fillStyle=shadeColor('#4d6a38',shade);ctx.fillRect(i*sw,top,sw+1,wallH*cap);ctx.fillStyle=shadeColor('#7a7a68',shade);ctx.fillRect(i*sw,top+wallH*cap,sw+1,wallH*(1-cap));}
else if(isLow&&u>.18&&u<.82){ctx.fillStyle=shadeColor(look.accent,shade);ctx.fillRect(i*sw,top+wallH*.19,sw+1,wallH*.18);}
if(look.glass&&u>.3&&u<.68){ctx.fillStyle=shadeColor('#cfe8ff',shade*.55);ctx.fillRect(i*sw,top+wallH*.22,sw+1,wallH*.4);}
ctx.fillStyle=`rgba(255,255,255,${.15*shade})`;ctx.fillRect(i*sw,top+wallH*.08,sw+1,Math.max(1,wallH*.013));ctx.fillStyle=`rgba(1,24,57,${.13})`;ctx.fillRect(i*sw,top+wallH*.88,sw+1,wallH*.12);
}
}
let items=[];for(const e of game.enemies)if(Math.hypot(e.x-game.px,e.y-game.py)<22)items.push({x:e.x,y:e.y,type:'enemy',e});if(game.objective)items.push({x:game.objective.x,y:game.objective.y,type:game.objective.type});if(game.escort)items.push({x:game.escort.x,y:game.escort.y,type:'escort'});items.sort((a,b)=>Math.hypot(b.x-game.px,b.y-game.py)-Math.hypot(a.x-game.px,a.y-game.py));
for(const o of items){let dx=o.x-game.px,dy=o.y-game.py,dist=Math.hypot(dx,dy);let angle=Math.atan2(dy,dx)-game.dir;angle=Math.atan2(Math.sin(angle),Math.cos(angle));if(Math.abs(angle)>FOV*.69||dist<.25)continue;let xp=(.5+Math.tan(angle)/(2*Math.tan(FOV/2)))*w,base=eye,scale=h*.68/dist,wi=scale*.82,he=scale*1.43;let ray=Math.floor(xp/w*rays);if(ray<0||ray>=rays||screenDepth[ray]<dist-.4)continue;
if(o.type==='enemy'){const e=o.e;let img=(artSprites[e.kind]?.complete&&artSprites[e.kind]?.naturalWidth)?artSprites[e.kind]:sprite(e.kind);
if(e.state==='disabled'){const fall=Math.min(1,e.fall||0);const ddir=e.deathDir||e.orbit||1;const groundY=base+he*.18;ctx.save();ctx.globalAlpha=.4;ctx.fillStyle='#1a1c22';ctx.beginPath();ctx.ellipse(xp,groundY,wi*(.55+.25*fall),he*.09,0,0,TAU);ctx.fill();ctx.restore();ctx.save();ctx.translate(xp,groundY);ctx.scale(1,.34+.66*(1-fall));ctx.rotate(ddir*(Math.PI/2)*fall);ctx.globalAlpha=.8;ctx.drawImage(img,-wi/2,-he,wi,he);ctx.restore();ctx.globalAlpha=1;}
else{let bounce,lean=0,sway=0;if(e.moving){bounce=Math.abs(Math.sin((e.stride||0)*Math.PI))*he*.025;sway=Math.sin((e.stride||0)*Math.PI)*wi*.04;let rel=Math.atan2(e.vy||0,e.vx||0)-game.dir;lean=Math.sin(rel)*wi*.08;}else{bounce=Math.sin(e.phase*2.2)*1.5;}let sy=base-he*.66+bounce;ctx.globalAlpha=1;ctx.drawImage(img,xp-wi/2+lean+sway,sy,wi,he);ctx.globalAlpha=.3;ctx.fillStyle='#cbb98a';ctx.beginPath();ctx.ellipse(xp+lean,base+he*.14,wi*.4,he*.07,0,0,TAU);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle='#0c2758';ctx.fillRect(xp-wi*.29,sy-12,wi*.58,7);ctx.fillStyle=e.hitAt>0?'#fffa8c':'#ff6667';ctx.fillRect(xp-wi*.29,sy-12,wi*.58*Math.min(1,e.hp/(e.kind==='heavy'?10:e.kind==='shield'?4:e.kind==='bot'?2:3)),7);if(e.kind==='shield'){ctx.strokeStyle='#9ceaffaa';ctx.lineWidth=Math.max(2,scale*.025);ctx.strokeRect(xp-wi*.45,sy+he*.24,wi*.9,he*.45);}if(e.hitAt>0){ctx.fillStyle='#ffdf66';for(let z=0;z<6;z++){let th=z*TAU/6+e.phase;ctx.fillRect(xp+Math.cos(th)*20,sy+he*.45+Math.sin(th)*20,Math.max(3,scale*.07),3);}}}}
else{let isRescue=o.type==='rescue'||o.type==='escort';let color=isRescue?'#fbd270':o.type==='device'?'#64f4f9':'#84fb94';let sy=base-he*.55;ctx.fillStyle='#062c56aa';ctx.beginPath();ctx.ellipse(xp,sy+he*.8,wi*.5,he*.12,0,0,TAU);ctx.fill();if(isRescue){ctx.drawImage(sprite('rescue'),xp-wi/2,sy,wi,he);}else{ctx.fillStyle=color;ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(xp-wi*.38,sy+he*.22,wi*.76,he*.48,Math.min(12,wi*.1));ctx.fill();ctx.stroke();ctx.fillStyle='#174f7a';ctx.textAlign='center';ctx.font=`900 ${Math.max(11,wi*.24)}px system-ui`;ctx.fillText(o.type==='device'?'⌁':'➤',xp,sy+he*.52);}ctx.fillStyle='#042c52';ctx.fillRect(xp-wi*.6,sy-30,wi*1.2,23);ctx.fillStyle='#e9fcff';ctx.font=`bold ${Math.max(11,Math.min(16,scale*.2))}px system-ui`;ctx.textAlign='center';ctx.fillText(isRescue?'RESCUE TARGET':o.type==='device'?'DISABLE DEVICE':'CHECKPOINT',xp,sy-14);}}
// Original cartoon-tech foreground weapon, with mechanical highlights and firing flash.
drawWeapon(ctx,w,h);
// Direction indicator and color grading.
ctx.fillStyle=t.theme==='night'?'#4023580c':'#159bd709';ctx.fillRect(0,0,w,h);if(game.hitFlash>0){ctx.fillStyle=`rgba(255,95,77,${game.hitFlash*.9})`;ctx.fillRect(0,0,w,h);}if(game.elapsed<game.shieldUntil){ctx.strokeStyle='#65eaffbb';ctx.lineWidth=9;ctx.strokeRect(8,8,w-16,h-16);}
if(game.crouched){let g=ctx.createLinearGradient(0,h*.52,0,h);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(6,20,36,.62)');ctx.fillStyle=g;ctx.fillRect(0,h*.52,w,h*.48);}
if(game.inCover){ctx.fillStyle='#04182ccc';ctx.fillRect(w/2-90,16,180,28);ctx.fillStyle='#9ff7c2';ctx.font='900 16px system-ui';ctx.textAlign='center';ctx.fillText('IN COVER',w/2,36);}
else if(game.running){ctx.fillStyle='#1a2a16cc';ctx.fillRect(w/2-70,16,140,28);ctx.fillStyle='#ffe28a';ctx.font='900 16px system-ui';ctx.textAlign='center';ctx.fillText('RUNNING',w/2,36);}
else if(game.z>.12){ctx.fillStyle='#10244ccc';ctx.fillRect(w/2-58,16,116,28);ctx.fillStyle='#d4ecff';ctx.font='900 16px system-ui';ctx.textAlign='center';ctx.fillText('JUMP',w/2,36);}
}
function shadeColor(hex,f){let v=parseInt(hex.slice(1),16);return `rgb(${Math.min(255,Math.round(((v>>16)&255)*f))},${Math.min(255,Math.round(((v>>8)&255)*f))},${Math.min(255,Math.round((v&255)*f))})`;}
function drawWeapon(p,w,h){let sc=Math.max(.6,Math.min(w/960,h/540)),bob=Math.sin(game.animation)* (game.wasMoving?7:2),kick=game.muzzle?game.muzzle*90:0,x=w*.54,y=h*.77+bob+kick; p.save();p.translate(x,y);p.scale(sc,sc);p.lineJoin='round';p.lineWidth=5;p.strokeStyle='#163a67';p.shadowColor='#07316b9e';p.shadowBlur=16;
const shape=(pts,fill)=>{p.beginPath();p.moveTo(...pts[0]);pts.slice(1).forEach(q=>p.lineTo(...q));p.closePath();p.fillStyle=fill;p.fill();p.stroke()};
// Glove and shoulder
shape([[-20,140],[3,76],[83,86],[140,210],[44,230],[-38,190]],'#f3f6fb');shape([[36,157],[90,112],[163,148],[190,245],[85,246]],'#4163a6');
// Rifle stock, grip and central receiver
shape([[8,61],[132,26],[276,52],[326,83],[268,124],[95,116]],'#e4edf3');shape([[97,39],[233,34],[281,54],[248,109],[113,103]],'#327ac4');shape([[138,43],[182,37],[183,95],[138,99]],'#ffb43b');shape([[258,55],[362,70],[368,98],[269,112]],'#f3f6f7');shape([[290,65],[404,73],[410,94],[306,104]],'#ff9c29');shape([[130,120],[167,110],[188,184],[139,210]],'#2e4669');shape([[198,115],[248,116],[249,171],[194,170]],'#d9eff7');
// Sight tower
shape([[196,18],[195,-19],[259,-28],[273,12],[257,45],[211,44]],'#ffae34');shape([[207,-12],[248,-17],[251,28],[211,29]],'#1d4068');p.fillStyle='#37edff';p.fillRect(213,-8,33,31);p.strokeStyle='#d8ffff';p.lineWidth=2;p.beginPath();p.arc(230,7,9,0,TAU);p.stroke();
// Rifle markings
p.fillStyle='#fff';p.font='900 19px system-ui';p.textAlign='center';p.fillText(game.weapon?'PULSE SIDEARM':'SKYLINE RIFLE',190,77);p.strokeStyle='#124273';p.lineWidth=4;p.shadowBlur=0;p.restore();
if(game.muzzle){p.save();let fx=x+420*sc,fy=y+82*sc;p.translate(fx,fy);p.rotate(game.elapsed*2);p.fillStyle='#fffce0';p.strokeStyle='#ff9c2c';p.lineWidth=3;p.beginPath();for(let i=0;i<16;i++){let a=i*TAU/16,r=i%2===0?35*sc:12*sc;p.lineTo(Math.cos(a)*r,Math.sin(a)*r);}p.closePath();p.fill();p.stroke();p.restore();}}
function drawMini(){if(!game)return;let c=$('minimap'),p=c.getContext('2d'),s=c.width/24;p.clearRect(0,0,c.width,c.height);p.fillStyle='#0c2a53';p.fillRect(0,0,c.width,c.height);for(let y=0;y<24;y++)for(let x=0;x<24;x++){const col=miniColor(game.grid[y][x]);if(!col)continue;p.fillStyle=col;p.fillRect(x*s,y*s,s-.4,s-.4);}if(game.objective){p.fillStyle='#6effa8';p.beginPath();p.arc(game.objective.x*s,game.objective.y*s,5,0,TAU);p.fill();}for(let e of game.enemies){if(e.state==='active'&&(game.elapsed<game.droneUntil||Math.hypot(e.x-game.px,e.y-game.py)<7)){p.fillStyle='#ff7265';p.beginPath();p.arc(e.x*s,e.y*s,3,0,TAU);p.fill();}}p.save();p.translate(game.px*s,game.py*s);p.rotate(game.dir);p.fillStyle='#ffda56';p.beginPath();p.moveTo(8,0);p.lineTo(-5,-5);p.lineTo(-5,5);p.closePath();p.fill();p.restore();}
function loop(now){let dt=Math.min(.06,(now-last)/1000);last=now;if(running&&!paused){if(!simHold)simulate(dt);drawWorld();drawMini();}else if(!running){drawMenuCanvas(now/1000);}requestAnimationFrame(loop);}function drawMenuCanvas(t){let g=ctx.createLinearGradient(0,0,0,CH);g.addColorStop(0,'#78cdfd');g.addColorStop(.55,'#d4faff');g.addColorStop(1,'#5f92b8');ctx.fillStyle=g;ctx.fillRect(0,0,CW,CH);ctx.globalAlpha=.58;drawLandmark(ctx,'tower',CW,CH);ctx.globalAlpha=1;}
window.__TV={
start(i){selected=i|0;start();},
pose(px,py,dir){if(!game)return;if(px!=null)game.px=px;if(py!=null)game.py=py;if(dir!=null)game.dir=dir;},
invuln(){if(game){game.armor=100;game.remaining=Math.max(game.remaining,90);game.shieldUntil=game.elapsed+999;}},
clearEnemies(){if(game)game.enemies=[];},
placeRunner(x,y,kind,tx,ty){if(!game)return;spawnEnemy(x,y,kind||'guard');const e=game.enemies[game.enemies.length-1];if(!e)return;e.wx=tx;e.wy=ty;e.alert=0;e.speed=3.1;e.patrolOnly=true;return e;},
state(){return !game?null:{px:game.px,py:game.py,dir:game.dir,z:game.z,crouched:!!game.crouched,inCover:!!game.inCover,running:!!game.running,map:game.m.map,name:game.theme.name,theme:game.theme.theme,stage:game.stage,obj:game.objective,enemies:game.enemies.filter(e=>e.state==='active').map(e=>({x:+e.x.toFixed(2),y:+e.y.toFixed(2),moving:!!e.moving,stride:+(e.stride||0).toFixed(2)})),corpses:game.enemies.filter(e=>e.state==='disabled').map(e=>({x:+e.x.toFixed(2),y:+e.y.toFixed(2),fall:+(e.fall||0).toFixed(2),state:e.state}))};},
gotoStage(n){if(!game)return;game.stage=n|0;prepareStage();},
jumpNow(){if(game){game.crouched=false;game.z=1.15;game.vz=2.2;}},
setCrouch(v){hideHeld=!!v;if(game){game.crouched=!!v;if(v)game.z=0;game.inCover=!!v&&nearLowCover();}},
setRun(v){runHeld=!!v;if(game)game.running=!!v&&!game.crouched;},
setZ(z){if(game){game.z=+z||0;game.vz=0;}},
redraw(){if(game){drawWorld();drawMini();}},
frame(){return canvas.toDataURL('image/png');},
killNearest(){if(!game)return null;let best=null,bd=1e9;for(const e of game.enemies){if(e.state!=='active')continue;const d=Math.hypot(e.x-game.px,e.y-game.py);if(d<bd){bd=d;best=e;}}if(!best)return null;best.hp=0;best.state='disabled';best.fall=0;best.moving=false;best.mvx=0;best.mvy=0;return {x:best.x,y:best.y};},
placeCorpse(x,y,kind,fall=1){if(!game)return null;spawnEnemy(x,y,kind||'guard');const e=game.enemies[game.enemies.length-1];if(!e)return null;e.state='disabled';e.hp=0;e.fall=fall==null?1:fall;e.moving=false;e.mvx=0;e.mvy=0;return {x:e.x,y:e.y,fall:e.fall};},
placeWalkerAndCorpse(){if(!game)return null;const c=Math.cos(game.dir),s=Math.sin(game.dir);let cx=game.px+c*3.0-s*1.15,cy=game.py+s*3.0+c*1.15;const cp=snapPassable(cx,cy,.28);this.placeCorpse(cp[0],cp[1],'guard',1);let wx=game.px+c*5.2+s*2.2,wy=game.py+s*5.2-c*2.2,tx=game.px+c*5.2-s*2.2,ty=game.py+s*5.2+c*2.2;const a=snapPassable(wx,wy,.28),b=snapPassable(tx,ty,.28);this.placeRunner(a[0],a[1],'guard',b[0],b[1]);return this.state();},
layoutInfo(){if(!game||!game.layout)return null;const L=game.layout;return {theme:game.theme.theme,start:L.start,dir:L.dir,rescue:L.rescue,exit:L.exit,devices:L.devices,waypoints:L.waypoints,terminal:L.terminal,view:L.view,spawns:L.spawns,covers:L.covers,walkCount:L.walk.length};},
poseView(){if(!game||!game.layout||!game.layout.view)return;const v=game.layout.view;game.px=v[0];game.py=v[1];game.dir=v[2]||0;},
coverPose(i){if(!game||!game.layout||!game.layout.covers||!game.layout.covers.length)return null;const c=game.layout.covers[i%game.layout.covers.length];const sides=[[1.05,0],[-1.05,0],[0,1.05],[0,-1.05],[.8,.8],[-.8,.8]];for(const [dx,dy] of sides){const x=c[0]+dx,y=c[1]+dy;if(playerPassable(x,y,.21)){game.px=x;game.py=y;game.dir=Math.atan2(c[1]-y,c[0]-x);return {x,y,dir:game.dir,cover:c,kind:c[2]};}}return {cover:c};},
freeze(v){simHold=!!v;},
tick(dt,n){if(!game)return;const prev=simHold;simHold=true;for(let i=0;i<(n||1);i++)simulate(dt||1/30);drawWorld();drawMini();simHold=prev;}
};

requestAnimationFrame(loop);
})();
