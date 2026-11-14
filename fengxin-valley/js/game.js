/* 風信谷值班・栗栗與咚咚 — 3D v1  2026-11-14 */
/* Locked typography: copy exact characters. Radical-correct codepoints:
   咚 U+549A (口+冬), 嗝 U+55DD (口+鬲), 瞌 U+778C (目+臿), 躡 U+8EA1 (足+聶), 纜 U+7E9C */
const VERSION = "fengxin-valley-3d version: 2026-11-14-v2";
const SAVE_KEY = "fengxinValley.v1";
const LILI = "栗栗";
const DONG = "\u549A\u549A";
const HUHU = "呼呼";
const CORE = "\u6253\u55DD\u6838\u5FC3";
const CORE_TASK = "\u8B93\u6253\u55DD\u6838\u5FC3\u5B89\u975C\u4E0B\u4F86";
const SPECIES = "\u5E7E\u7DAD\u9CE5";
const MODE = "\u55AE\u4EBA\u95D6\u95DC";
const BTN_USE = "\u4F7F\u7528\u5668\u5177";
const BTN_CALL = "\u547C\u559A\u549A\u549A";
const DIFF_LOOSE = "\u5BEC\u9B06";
const DIFF_TIGHT = "\u52A0\u7DCA";
const DIFF_NIGHT = "\u591C\u9593\u52A0\u66F4";
const HINTS_LABEL = "\u503C\u73ED\u63D0\u793A";
const CLOCKOUT = "\u4ECA\u65E5\u4E0B\u73ED";
const SLEEP_WORD = "\u6253\u778C\u7761";
const SNEAK_TASK = "\u8EA1\u624B\u8EA1\u8173\u8D70\u904E\u6253\u547C\u7684\u547C\u547C\u4E26\u628A\u5925\u4F34\u5E36\u5230\u51FA\u53E3";
const TITLE = "\u98A8\u4FE1\u8C37\u503C\u73ED\u30FB\u6817\u6817\u8207\u549A\u549A";
const MAP_CREEK = "\u6EAA\u908A\u68E7\u9053";
const MAP_GREEN = "\u73BB\u7483\u6EAB\u5BA4";
const MAP_CABLE = "\u96F2\u7AEF\u7E9C\u8ECA\u7AD9";
const MAP_MILL = "\u820A\u6C34\u8ECA\u78E8\u574A";
const MAP_MARKET = "\u5C71\u8C37\u5E02\u96C6";
const MAP_CAVE = "\u5730\u4E0B\u6CC9\u5ECA";
const MAP_WIND = "\u98A8\u8ECA\u4E18";
const MAP_OBS = "\u661F\u8C61\u89C0\u6E2C\u576A";

const $ = (id) => document.getElementById(id);
const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
const dist = (a,b) => Math.hypot((a.x-b.x),(a.y-b.y));
const lerp = (a,b,t) => a+(b-a)*t;
const now = () => performance.now();

const MAPS = [
  {id:"creek", name:MAP_CREEK, hint:"教學地圖，先從這裡值班", pos:{x:24,y:34}},
  {id:"greenhouse", name:MAP_GREEN, hint:"撲滅火花洩漏、清出泡沫", pos:{x:72,y:40}},
  {id:"cable", name:MAP_CABLE, hint:"救出車廂裡的夥伴", pos:{x:18,y:58}},
  {id:"mill", name:MAP_MILL, hint:"限時讓打嗝核心安靜、關失控水車", pos:{x:84,y:58}},
  {id:"market", name:MAP_MARKET, lockedV1:true, pos:{x:24,y:84}},
  {id:"cave", name:MAP_CAVE, lockedV1:true, pos:{x:68,y:84}},
  {id:"windmill", name:MAP_WIND, lockedV1:true, pos:{x:16,y:16}},
  {id:"observatory", name:MAP_OBS, lockedV1:true, pos:{x:78,y:16}},
  {id:"hut", name:"值班小屋", hut:true, pos:{x:49,y:44}}
];

const PALS = {
  "amber-fox": {name:"小狐狸琥珀", species:"狐狸"},
  "bean-rabbit": {name:"小兔豆豆", species:"兔子"},
  "aka-fox": {name:"小狐狸阿赤", species:"狐狸"},
  "sui-hedgehog": {name:"小刺蝟穗穗", species:"刺蝟"},
  "mo-otter": {name:"小水獺磨磨", species:"水獺"}
};

const MISSIONS = [
  {id:"creek-1", map:"creek", n:1, name:"學會走路與使用器具",
    types:["tutorial","use-tool"], trapped:"沒有夥伴受困", timed:false,
    checks:["走到練習柱前，按「使用器具」","走到棧道盡頭的暖芯燈"],
    brief:"先熟悉方向盤和器具。跟著暖芯燈跡走就不會迷路。"},
  {id:"creek-2", map:"creek", n:2, name:"切換"+DONG+"推開閥門",
    types:["switch","valve"], trapped:"沒有夥伴受困", timed:false,
    checks:["切換為"+DONG,"請"+DONG+"轉動溪邊閥門","走到出口的暖芯燈"],
    brief:DONG+"力氣穩，適合推閥門。點角色圖或「"+BTN_CALL+"」就能切換。"},
  {id:"creek-3", map:"creek", n:3, name:"推開擋住棧道的木箱",
    types:["push-box"], trapped:"沒有夥伴受困", timed:false,
    checks:["把木箱推到旁邊，清出棧道","走到出口"],
    brief:"朝著箱子走，就能慢慢推開。路清出來以後再往前。"},
  {id:"creek-4", map:"creek", n:4, name:"護送小狐狸到出口",
    types:["rescue"], trapped:"小狐狸琥珀", pal:"amber-fox", timed:false,
    checks:["用器具解救小狐狸琥珀","護送牠走到出口的暖芯燈"],
    brief:"琥珀被關在棧道棚屋。靠近後使用器具，再一起走到出口。"},
  {id:"creek-5", map:"creek", n:5, name:"溫和地讓打嗝核心安靜下來",
    types:["core-color"], trapped:"沒有夥伴受困", timed:false,
    checks:[CORE_TASK,"回到出口的暖芯燈"],
    brief:"這座氣象信標只是輕輕打嗝。靠過去，用色塊解碼器對顏色就好。"},

  {id:"greenhouse-1", map:"greenhouse", n:1, name:"撲滅花床上的火花洩漏",
    types:["foam-spark"], trapped:"沒有夥伴受困", timed:false,
    checks:["用泡沫撲滅所有亮藍色火花洩漏","走到溫室出口"],
    brief:"亮藍色的小火花是漏氣，不是寫實火焰。請栗栗用泡沫噴壺輕輕撲滅。"},
  {id:"greenhouse-2", map:"greenhouse", n:2, name:"清出被泡沫擋住的花徑",
    types:["clear-foam"], trapped:"沒有夥伴受困", timed:false,
    checks:["噴開擋住花徑的泡沫","走到出口"],
    brief:"漏氣留下的泡沫堆擋住了路。用噴壺清出一條路來。"},
  {id:"greenhouse-3", map:"greenhouse", n:3, name:"取回溫室值班鑰匙",
    types:["key"], trapped:"沒有夥伴受困", timed:false,
    checks:["清出泡沫、取回值班鑰匙","走到出口"],
    brief:"值班鑰匙掉在花床後面。先清出路，再把鑰匙帶回來。"},
  {id:"greenhouse-4", map:"greenhouse", n:4, name:"護送小兔穿過泡沫到出口",
    types:["rescue","clear-foam"], trapped:"小兔豆豆", pal:"bean-rabbit", timed:false,
    checks:["清出被泡沫擋住的路","解救小兔豆豆並護送到出口"],
    brief:"豆豆在溫室深處。先噴開泡沫，再帶牠走到出口。"},
  {id:"greenhouse-5", map:"greenhouse", n:5, name:"讓溫室打嗝核心安靜下來",
    types:["core-color","foam-spark"], trapped:"沒有夥伴受困", timed:true,
    checks:["撲滅核心旁邊的火花洩漏",CORE_TASK],
    brief:"溫室的氣象信標在打嗝，旁邊還有亮藍火花。先撲滅火花，再對顏色。"},

  {id:"cable-1", map:"cable", n:1, name:"救出車廂裡的夥伴",
    types:["rescue"], trapped:"小狐狸阿赤", pal:"aka-fox", timed:false,
    checks:["打開停下的車廂，解救小狐狸阿赤","護送到月台出口"],
    brief:"阿赤被關在停下的纜車車廂裡。靠近車門使用器具，再一起走到出口。"},
  {id:"cable-2", map:"cable", n:2, name:"關上月台漏氣口",
    types:["close-leak"], trapped:"沒有夥伴受困", timed:false,
    checks:["把月台上的漏氣口一一關上","走到出口"],
    brief:"月台地板與柱子在漏氣。靠近漏氣口，使用器具把它關上。"},
  {id:"cable-3", map:"cable", n:3, name:"清出擋住月台的木箱",
    types:["push-box"], trapped:"沒有夥伴受困", timed:false,
    checks:["推開擋住月台的木箱","走到出口"],
    brief:"搬運箱滑到路中間了。推開它們，把月台清出來。"},
  {id:"cable-4", map:"cable", n:4, name:"取回纜車保險絲結晶",
    types:["crystal","close-leak"], trapped:"沒有夥伴受困", timed:false,
    checks:["關上漏氣口，取回保險絲結晶","走到出口"],
    brief:"保險絲結晶在月台工具櫃旁。先把漏氣口關上，再把結晶帶回。"},
  {id:"cable-5", map:"cable", n:5, name:SNEAK_TASK,
    types:["sneak","rescue"], trapped:"小刺蝟穗穗", pal:"sui-hedgehog", timed:false,
    checks:[SNEAK_TASK+"，或用泡沫請牠換地方睡","解救穗穗並帶到出口"],
    brief:HUHU+"不是反派，只是趴著打呼。輕輕走過去，或請栗栗用泡沫請牠換個地方繼續睡。"},

  {id:"mill-1", map:"mill", n:1, name:"關閉失控的水車",
    types:["wheel"], trapped:"沒有夥伴受困", timed:false,
    checks:["推開木箱，走到水車控制桿","關閉失控的水車並走到出口"],
    brief:"水車轉個不停。先清出路，再請"+DONG+"幫忙把控制桿推回去。"},
  {id:"mill-2", map:"mill", n:2, name:"在沙漏走完前讓打嗝核心安靜下來",
    types:["core-symbol"], trapped:"沒有夥伴受困", timed:true,
    checks:[CORE_TASK],
    brief:"磨坊裡的打嗝核心限時運作。在沙漏走完前，對好顏色與符號。時間到了只會"+SLEEP_WORD+"，再試一次就好。"},
  {id:"mill-3", map:"mill", n:3, name:"轉動冷卻閥止住漏氣",
    types:["valve","close-leak"], trapped:"沒有夥伴受困", timed:false,
    checks:["請"+DONG+"轉動冷卻閥","關上剩下的漏氣口","走到出口"],
    brief:"冷卻閥要"+DONG+"來轉。轉好以後再把旁邊的漏氣口關上。"},
  {id:"mill-4", map:"mill", n:4, name:"取回磨坊保險絲結晶",
    types:["crystal","foam-spark"], trapped:"沒有夥伴受困", timed:false,
    checks:["撲滅火花洩漏，取回保險絲結晶","走到出口"],
    brief:"結晶在磨台後面。先撲滅亮藍火花，再把結晶帶走。"},
  {id:"mill-5", map:"mill", n:5, name:SNEAK_TASK,
    types:["sneak","rescue","wheel"], trapped:"小水獺磨磨", pal:"mo-otter", timed:true,
    checks:["關閉還在轉的水車","躡手躡腳（或用泡沫請呼呼換地方）解救磨磨","把夥伴帶到出口"],
    brief:"磨磨被關在水車旁的棚裡。先把失控水車關上，再輕輕走過打呼的呼呼，一起到出口。"}
];

const MISSION_BY_ID = Object.fromEntries(MISSIONS.map(m=>[m.id,m]));
const MAP_MISSIONS = (mapId) => MISSIONS.filter(m=>m.map===mapId);

function defaultSave(){
  return {
    version:1, game:"fengxin-valley",
    difficulty:"loose", hints:true, nightExtra:false,
    currentPlayer:"A", names:{A:"選手一", B:"選手二"},
    completed:{}, rescued:[], clockedOut:false, lastMap:"creek",
    stats:{missions:0}
  };
}

let save = defaultSave();
let screen = "title";
let toastTimer = 0;
let helpFrom = "title";
let briefMission = null;
let cabinPals = [];

function loadSave(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw){ save = defaultSave(); return false; }
    const o = JSON.parse(raw);
    const d = defaultSave();
    save = Object.assign(d, o, {
      names: Object.assign(d.names, o.names||{}),
      completed: o.completed||{},
      rescued: Array.isArray(o.rescued)?o.rescued:[],
      game:"fengxin-valley"
    });
    if(save.difficulty!=="tight") save.difficulty="loose";
    return true;
  }catch(e){ save = defaultSave(); return false; }
}
function persist(){
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }catch(e){}
}
function playerName(){ return save.currentPlayer==="A" ? (save.names.A||"選手一") : (save.names.B||"選手二"); }
function isLoose(){ return save.difficulty!=="tight"; }
function mapUnlocked(id){
  const m = MAPS.find(x=>x.id===id);
  if(!m || m.lockedV1) return false;
  if(id==="creek") return true;
  const prev = {greenhouse:"creek", cable:"greenhouse", mill:"cable"}[id];
  if(!prev) return false;
  return MAP_MISSIONS(prev).every(ms=>!!save.completed[ms.id]);
}
function mapDone(id){ return MAP_MISSIONS(id).every(ms=>!!save.completed[ms.id]); }
function mapProgress(id){ return MAP_MISSIONS(id).filter(ms=>save.completed[ms.id]).length; }

function showScreen(id){
  document.querySelectorAll(".screen").forEach(el=>el.classList.toggle("on", el.id==="scr-"+id));
  screen = id;
  document.querySelectorAll(".ov").forEach(el=>el.classList.remove("on"));
  placeRenderer(id);
}
function showOv(id, on){ const el=$(id); if(el) el.classList.toggle("on", !!on); }
function toast(msg, ms){
  const el=$("toast"); el.textContent=msg; el.classList.add("on");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("on"), ms||1800);
}
function showCue(msg, ms){
  const el=$("cue"); if(!el) return;
  el.textContent=msg; el.classList.add("on");
  clearTimeout(showCue._t); showCue._t=setTimeout(()=>el.classList.remove("on"), ms||1600);
}

function applyDiffUI(){
  document.querySelectorAll("#diff-seg button").forEach(b=>{
    b.classList.toggle("on", b.dataset.diff===save.difficulty);
  });
  const hb=$("btn-hints");
  hb.classList.toggle("on", !!save.hints);
  hb.textContent = HINTS_LABEL + (save.hints ? " 開" : " 關");
  const nb=$("btn-night");
  const nightOk = save.difficulty==="tight";
  nb.style.opacity = nightOk ? "1" : ".45";
  nb.classList.toggle("on", !!(save.nightExtra && nightOk));
  nb.textContent = DIFF_NIGHT + ((save.nightExtra && nightOk) ? " 開" : " 關");
  document.querySelectorAll("[data-briefdiff]").forEach(b=>{
    const on = b.dataset.briefdiff===save.difficulty;
    b.classList.toggle("teal", on);
    b.classList.toggle("wood", !on);
  });
  $("btn-swap-player").textContent = "換人：" + playerName();
}

function setDifficulty(mode){
  const prev = save.difficulty;
  save.difficulty = mode==="tight" ? "tight" : "loose";
  if(save.difficulty==="loose") save.hints = true;
  else if(prev!=="tight") save.hints = false;
  persist(); applyDiffUI();
}

function renderCabin(){
  showScreen("cabin");
  $("cabin-title").textContent = "風信谷值班小屋・" + playerName();
  applyDiffUI();
  const host=$("hotspots"); host.innerHTML="";
  MAPS.forEach(m=>{
    const b=document.createElement("button");
    b.type="button";
    b.style.left=m.pos.x+"%"; b.style.top=m.pos.y+"%";
    if(m.hut){ b.className="hut"; b.textContent="值班小屋"; }
    else if(m.lockedV1){ b.className="lock"; b.textContent=m.name+"\n尚未開放"; }
    else if(!mapUnlocked(m.id)){ b.className="lock"; b.textContent=m.name+"\n先值完上一張"; }
    else if(mapDone(m.id)){ b.className="done"; b.textContent=m.name+"\n"+mapProgress(m.id)+"/5 值完"; }
    else { b.className="open"; b.textContent=m.name+"\n"+mapProgress(m.id)+"/5"; }
    b.addEventListener("click", ()=>{
      if(m.hut){ openBoard(save.lastMap && mapUnlocked(save.lastMap) ? save.lastMap : "creek"); return; }
      if(m.lockedV1){ toast("這處還留給後續的班，第 1 版先進已開放的四張地圖。"); return; }
      if(!mapUnlocked(m.id)){ toast("先值完上一張地圖的五則主線，再來這裡值班。"); return; }
      openBoard(m.id);
    });
    host.appendChild(b);
  });
  spawnCabinPals();
  rebuildCabinScene();
}

function spawnCabinPals(){
  cabinPals = (save.rescued||[]).map((id,i)=>{
    const p=PALS[id]||{name:id};
    return {id, name:p.name, species:p.species, a:i*1.3};
  });
}

function openBoard(mapId){
  if(!mapUnlocked(mapId)){ toast("這張地圖還沒解鎖。"); return; }
  save.lastMap=mapId; persist();
  const info=MAPS.find(m=>m.id===mapId);
  showScreen("board");
  $("board-title").textContent=info.name+"・任務木板";
  const done=mapProgress(mapId);
  $("board-sub").textContent = done+"/5 則已值完" + (done>=5?"，下一張地圖已可解鎖。":"");
  const list=$("board-list"); list.innerHTML="";
  MAP_MISSIONS(mapId).forEach(ms=>{
    const b=document.createElement("button");
    b.type="button";
    const isDone=!!save.completed[ms.id];
    if(isDone) b.className="done";
    b.innerHTML=`<span class="num">${ms.n}</span><span>${ms.name}${ms.timed?" ・限時":""}${ms.trapped && ms.trapped!=="沒有夥伴受困"?" ・"+ms.trapped:""}</span>${isDone?'<span class="check">✓</span>':""}`;
    b.addEventListener("click", ()=>openBrief(ms.id));
    list.appendChild(b);
  });
}

function openBrief(id){
  const ms=MISSION_BY_ID[id]; if(!ms) return;
  if(!mapUnlocked(ms.map)){ toast("這張地圖還沒解鎖。"); return; }
  briefMission=ms;
  showScreen("brief");
  $("brief-title").textContent="今日值班："+MAPS.find(m=>m.id===ms.map).name;
  $("brief-progress").textContent="燈籠 "+mapProgress(ms.map)+"/5";
  const box=$("brief-checks"); box.innerHTML="";
  ms.checks.forEach(c=>{
    const d=document.createElement("div"); d.className="ck";
    d.innerHTML=`<span class="box"></span><span>${c}</span>`;
    box.appendChild(d);
  });
  const timedTxt = ms.timed ? (isLoose()?"有沙漏，時間較寬。":"有沙漏，時間較緊。") : "這則不限時。";
  $("brief-meta").textContent = `受困：${ms.trapped}。清單 ${ms.checks.length} 項。${timedTxt} ${ms.brief}`;
  applyDiffUI();
  rebuildBriefScene(ms.map);
}

function showTitle(){
  showScreen("title");
  const hasProg = Object.keys(save.completed||{}).length>0;
  $("btn-continue").style.display = hasProg ? "inline-flex" : "none";
  $("btn-continue").textContent = hasProg ? ("繼續值班・已值 "+Object.keys(save.completed).length+" 則") : "還沒有存檔";
}

function typographySelfCheck(){
  const expect = {
    dong: [0x549A,0x549A],
    coreGe: 0x55DD,
    ke: 0x778C,
    nie: 0x8EA1,
    lan: 0x7E9C
  };
  const ok =
    DONG.charCodeAt(0)===expect.dong[0] && DONG.charCodeAt(1)===expect.dong[1] &&
    CORE.charCodeAt(1)===expect.coreGe &&
    SLEEP_WORD.charCodeAt(1)===expect.ke &&
    SNEAK_TASK.charCodeAt(0)===expect.nie &&
    MAP_CABLE.charCodeAt(2)===expect.lan &&
    SPECIES==="幾維鳥" && MODE==="單人闖關";
  return {ok, DONG, CORE, SLEEP_WORD, SNEAK_TASK, MAP_CABLE, SPECIES, TITLE};
}


/* ---------- play world ---------- */
const TILE=48;
let play=null;
let keys={};
let stick={dx:0,dy:0,active:false};
let lastTs=0;
let paused=false;

function rect(x,y,w,h,kind){ return {x,y,w,h,kind:kind||"solid"}; }
function aabb(a,b){ return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y; }
function circleHitRect(cx,cy,r,R){
  const nx=clamp(cx,R.x,R.x+R.w), ny=clamp(cy,R.y,R.y+R.h);
  return Math.hypot(cx-nx,cy-ny)<r;
}

function themeFor(mapId){
  if(mapId==="creek") return {sky:0x9fd0ea, sky2:0xd7ecb0, grass:0x7da04a, grass2:0x5e8636, path:0xc9a06a, water:0x5aa0c8, wall:0x6b8a48, fog:0xb8d8c0};
  if(mapId==="greenhouse") return {sky:0xc8e8c0, sky2:0xeef6d8, grass:0x8fbf5a, grass2:0x6a9a3a, path:0xe8d7a8, water:0x7ec8c0, wall:0xd8eee0, fog:0xd8f0d0};
  if(mapId==="cable") return {sky:0xb8d8ee, sky2:0xe8f2c8, grass:0x88a85a, grass2:0x6a8840, path:0xd4b48a, water:0x6ab0d0, wall:0xc8a078, fog:0xd0e4f0};
  return {sky:0xc8dce8, sky2:0xe6d8b8, grass:0x7a9a4a, grass2:0x5a7a32, path:0xc4a070, water:0x5a9ab8, wall:0x8a6a48, fog:0xd8c8a8};
}
function worldSize(){ return {w:1600,h:1000}; }

function baseTerrain(mapId){
  const {w,h}=worldSize();
  const solids=[], decor=[], water=[];
  solids.push(rect(0,0,w,40,"wall"), rect(0,h-40,w,40,"wall"), rect(0,0,40,h,"wall"), rect(w-40,0,40,h,"wall"));
  if(mapId==="creek"){
    water.push(rect(0,420,w,200,"water"));
    decor.push({kind:"boardwalk", x:80,y:470,w:1440,h:100});
    solids.push(rect(700,200,180,120,"bush"));
    solids.push(rect(980,700,200,130,"bush"));
    solids.push(rect(200,160,160,100,"rock"));
    solids.push(rect(1280,160,140,110,"rock"));
  }else if(mapId==="greenhouse"){
    solids.push(rect(120,120,280,110,"bed"));
    solids.push(rect(460,120,280,110,"bed"));
    solids.push(rect(800,120,280,110,"bed"));
    solids.push(rect(1140,120,280,110,"bed"));
    solids.push(rect(120,760,360,120,"bed"));
    solids.push(rect(560,760,360,120,"bed"));
    solids.push(rect(1000,760,400,120,"bed"));
    solids.push(rect(120,360,80,260,"bed"));
    solids.push(rect(1400,360,80,260,"bed"));
  }else if(mapId==="cable"){
    solids.push(rect(80,80,300,160,"cratewall"));
    solids.push(rect(80,760,500,160,"cratewall"));
    solids.push(rect(1120,260,400,80,"wood"));
    solids.push(rect(1120,620,400,80,"wood"));
    solids.push(rect(1460,260,60,440,"wood"));
  }else{
    solids.push(rect(80,80,240,280,"stone"));
    solids.push(rect(80,640,260,260,"stone"));
    solids.push(rect(1280,80,240,180,"shelf"));
    solids.push(rect(1280,760,240,160,"shelf"));
  }
  return {solids,decor,water,w,h};
}
function addCheckpoint(world,x,y,id){ world.checkpoints.push({x,y,id,r:28}); }
function addExit(world,x,y){ world.exit={x,y,r:36}; }

function coreSeqFor(ms, loose){
  const colors = ["#d94a4a","#e0c03a","#3a8ad9","#3cbf8a"];
  const symbols = ["●","▲","★","◆"];
  if(ms.types.includes("core-symbol") && !loose){
    const n=5, seq=[];
    for(let i=0;i<n;i++) seq.push({color:colors[i%4], symbol:symbols[i%4], id:i%4});
    return seq;
  }
  if(ms.types.includes("core-symbol") && loose){
    return [0,1,2].map(i=>({color:colors[i], symbol:symbols[i], id:i}));
  }
  const n = loose ? 3 : 5, seq=[];
  for(let i=0;i<n;i++){
    const id = loose ? i%3 : i%4;
    seq.push({color:colors[id], symbol:symbols[id], id});
  }
  return seq;
}
function timerFor(ms){
  if(!ms.timed) return 0;
  const night = save.difficulty==="tight" && save.nightExtra;
  if(isLoose()) return 120;
  if(night) return 45;
  return 70;
}

function buildWorld(ms){
  const base=baseTerrain(ms.map);
  const world={
    id:ms.id, map:ms.map, w:base.w, h:base.h,
    solids:base.solids, decor:base.decor, water:base.water,
    boxes:[], foams:[], sparks:[], huhus:[],
    items:[], valves:[], leaks:[], cores:[], wheels:[],
    pals:[], checkpoints:[], exit:null,
    start:{x:160,y:520}, dongStart:{x:120,y:560},
    theme:themeFor(ms.map)
  };
  if(ms.map==="creek"){
    world.start={x:160,y:520}; world.dongStart={x:110,y:570};
    addCheckpoint(world, 400, 520, "c1");
    addExit(world, 1450, 520);
    if(ms.n===1) world.practice={x:620,y:520,r:40,used:false};
    if(ms.n===2){
      world.valves.push({x:800,y:520,r:30,on:false,needDong:true,opens:{x:900,y:430,w:80,h:180}});
      world.solids.push(rect(900,430,80,180,"gate"));
      world.gateSolid = world.solids[world.solids.length-1];
    }
    if(ms.n===3){
      // Keep boxes on the boardwalk but clear of the roadside bushes so they can be pushed up or down off the mid path.
      world.boxes.push({x:760,y:478,w:70,h:70},{x:960,y:478,w:70,h:70});
      world.solids.push(rect(640,300,80,180,"bush"), rect(640,620,80,180,"bush"));
    }
    if(ms.n===4){
      world.solids.push(rect(900,300,200,160,"shed"));
      world.pals.push({id:ms.pal, x:1000,y:520, r:22, freed:false, follow:false});
    }
    if(ms.n===5) world.cores.push({x:900,y:520,r:40,solved:false,seq:coreSeqFor(ms,isLoose()),input:[]});
  }
  if(ms.map==="greenhouse"){
    world.start={x:200,y:520}; world.dongStart={x:150,y:580};
    addCheckpoint(world, 400, 520, "g1");
    addExit(world, 1450, 520);
    if(ms.n===1){
      [[500,280],[800,280],[1100,280],[500,700],[900,700],[1200,520]].forEach(([x,y])=>{
        world.sparks.push({x,y,r:24,alive:true});
      });
    }
    if(ms.n===2){
      world.foams.push({x:560,y:470,w:120,h:100,hp:2},{x:820,y:490,w:130,h:90,hp:2},{x:1080,y:470,w:120,h:110,hp:2});
    }
    if(ms.n===3){
      world.foams.push({x:700,y:470,w:140,h:110,hp:2});
      world.items.push({x:1000,y:280,kind:"key",name:"值班鑰匙",got:false,r:18});
    }
    if(ms.n===4){
      world.foams.push({x:620,y:470,w:130,h:110,hp:2},{x:900,y:480,w:140,h:100,hp:2});
      world.pals.push({id:ms.pal,x:1200,y:280,r:22,freed:false,follow:false});
    }
    if(ms.n===5){
      world.sparks.push({x:820,y:400,r:24,alive:true},{x:980,y:400,r:24,alive:true},{x:900,y:640,r:24,alive:true});
      world.cores.push({x:900,y:520,r:40,solved:false,seq:coreSeqFor(ms,isLoose()),input:[]});
      addCheckpoint(world, 640, 520, "g2");
    }
  }
  if(ms.map==="cable"){
    world.start={x:220,y:500}; world.dongStart={x:180,y:560};
    addCheckpoint(world, 480, 520, "k1");
    addExit(world, 220, 240);
    if(ms.n===1) world.pals.push({id:ms.pal,x:1280,y:500,r:22,freed:false,follow:false,inCar:true});
    if(ms.n===2) [[600,400],[800,620],[1100,480],[700,240]].forEach(([x,y])=>world.leaks.push({x,y,r:22,closed:false}));
    if(ms.n===3){
      // Mid platform over a walkable gap (same rule as the creek boardwalk) so crates can be
      // pushed off the center path, and the only way to the exit is along that platform.
      addExit(world, 1400, 520);
      world.water.push(rect(0,0,world.w,470,"gap"), rect(0,570,world.w,430,"gap"));
      world.decor.push({kind:"boardwalk", x:80, y:470, w:1440, h:100});
      // Packed crate row, same plank height as the creek, so you cannot walk around or between them.
      world.boxes.push({x:680,y:478,w:74,h:74},{x:762,y:478,w:74,h:74},{x:844,y:478,w:74,h:74},{x:926,y:478,w:74,h:74});
    }
    if(ms.n===4){
      world.leaks.push({x:700,y:400,r:22,closed:false},{x:900,y:640,r:22,closed:false});
      world.items.push({x:1280,y:500,kind:"crystal",name:"保險絲結晶",got:false,r:18});
    }
    if(ms.n===5){
      world.huhus.push({x:800,y:520,r:50,hear:isLoose()?70:110, sleeping:true, reloc:false});
      if(save.difficulty==="tight" && save.nightExtra)
        world.huhus.push({x:1040,y:400,r:46,hear:100, sleeping:true, reloc:false});
      world.pals.push({id:ms.pal,x:1280,y:500,r:22,freed:false,follow:false,inCar:true});
      addCheckpoint(world, 600, 520, "k2");
    }
  }
  if(ms.map==="mill"){
    world.start={x:500,y:800}; world.dongStart={x:440,y:840};
    addCheckpoint(world, 560, 640, "m1");
    addExit(world, 1400, 520);
    if(ms.n===1){
      // Passage just right of the lower mill wall, leading up to the waterwheel; the crate fills it.
      // Vertical 70px passage to the waterwheel; the crate fills it. A left wall
      // stops sneaking around, and the mid wall reaches the top so you cannot
      // walk over it to the wheel. Push the crate down into the yard to open the way.
      world.solids.push(
        rect(80,500,265,140,"stone"),
        rect(420,40,840,600,"stone")
      );
      world.boxes.push({x:345,y:500,w:70,h:70});
      world.wheels.push({x:200,y:360,r:40,running:true});
    }
    if(ms.n===2){
      world.cores.push({x:860,y:500,r:44,solved:false,seq:coreSeqFor(ms,isLoose()),input:[]});
      addCheckpoint(world, 700, 500, "m2");
    }
    if(ms.n===3){
      world.valves.push({x:860,y:500,r:30,on:false,needDong:true,cool:true});
      world.leaks.push({x:700,y:360,r:22,closed:false},{x:1040,y:640,r:22,closed:false},{x:1100,y:360,r:22,closed:false});
    }
    if(ms.n===4){
      world.sparks.push({x:700,y:400,r:24,alive:true},{x:1000,y:400,r:24,alive:true},{x:860,y:700,r:24,alive:true});
      world.items.push({x:860,y:280,kind:"crystal",name:"保險絲結晶",got:false,r:18});
    }
    if(ms.n===5){
      world.wheels.push({x:200,y:360,r:40,running:true});
      world.huhus.push({x:900,y:520,r:52,hear:isLoose()?75:115, sleeping:true, reloc:false});
      if(save.difficulty==="tight" && save.nightExtra)
        world.huhus.push({x:1100,y:700,r:46,hear:100, sleeping:true, reloc:false});
      world.pals.push({id:ms.pal,x:240,y:780,r:22,freed:false,follow:false});
      addCheckpoint(world, 560, 800, "m3");
    }
  }
  return world;
}

function actor(x,y,who){ return {x,y,vx:0,vy:0,r:18,dir:1,faceAng:0,who, spray:0, walk:0}; }

function startMission(id){
  const ms=MISSION_BY_ID[id]; if(!ms) return false;
  if(!mapUnlocked(ms.map)) return false;
  const world=buildWorld(ms);
  const t=timerFor(ms);
  play={
    ms, world,
    lili: actor(world.start.x, world.start.y, "lili"),
    dong: actor(world.dongStart.x, world.dongStart.y, "dong"),
    who:"lili",
    lastCp: {x:world.start.x,y:world.start.y},
    timer:t, timerMax:t,
    objs: ms.checks.map((label,i)=>({label, done:false, i})),
    hintTarget:null, hintUntil:0,
    trailOn: isLoose() || save.hints,
    night: save.difficulty==="tight" && !!save.nightExtra,
    foamBurst:null, won:false, failed:false, asleep:false,
    coreOpen:false, t:0, sneakWarned:0, extended:false, speedNow:0
  };
  if(world.checkpoints[0]) play.lastCp={x:world.checkpoints[0].x,y:world.checkpoints[0].y};
  paused=false;
  showScreen("play");
  showOv("ov-pause",false); showOv("ov-asleep",false); showOv("ov-done",false); showOv("ov-core",false);
  updateHUD();
  showCue(ms.name, 1400);
  rebuildPlayScene();
  return true;
}
function active(){ return play.who==="lili"?play.lili:play.dong; }
function other(){ return play.who==="lili"?play.dong:play.lili; }

function updateHUD(){
  if(!play) return;
  $("hud-mission").textContent = play.ms.name;
  $("hud-checks").innerHTML = play.objs.map(o=> (o.done?"✓ ":"○ ") + o.label).join("<br>");
  $("who-name").textContent = play.who==="lili"?LILI:DONG;
  const face=$("who-face");
  if(face) face.classList.toggle("dong", play.who!=="lili");
  const hg=$("hourglass");
  if(play.timerMax>0){
    hg.classList.add("on");
    $("hg-sec").textContent = Math.ceil(Math.max(0,play.timer))+" 秒";
    drawHourglass();
  }else hg.classList.remove("on");
}
function drawHourglass(){
  const cv=$("hg-canvas"); if(!cv||!play) return;
  const ctx=cv.getContext("2d");
  const w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);
  const p = play.timerMax? clamp(play.timer/play.timerMax,0,1) : 1;
  ctx.strokeStyle="#8a5a2b"; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(12,8); ctx.lineTo(w-12,8); ctx.lineTo(w/2,h/2); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12,h-8); ctx.lineTo(w-12,h-8); ctx.lineTo(w/2,h/2); ctx.closePath(); ctx.stroke();
  ctx.fillStyle="#e0c03a";
  ctx.save();
  ctx.beginPath(); ctx.moveTo(12,8); ctx.lineTo(w-12,8); ctx.lineTo(w/2,h/2); ctx.closePath(); ctx.clip();
  ctx.fillRect(0,8+(h/2-8)*(1-p),w,(h/2-8)*p);
  ctx.restore();
  ctx.save();
  ctx.beginPath(); ctx.moveTo(12,h-8); ctx.lineTo(w-12,h-8); ctx.lineTo(w/2,h/2); ctx.closePath(); ctx.clip();
  ctx.fillRect(0,h-8-(h/2-8)*(1-p),w,(h/2-8)*(1-p));
  ctx.restore();
}
function switchWho(force){
  if(!play) return;
  play.who = force || (play.who==="lili"?"dong":"lili");
  updateHUD();
  showCue("改由"+(play.who==="lili"?LILI:DONG)+"來走", 900);
}
function allSolids(){
  const w=play.world;
  const list=w.solids.slice();
  w.boxes.forEach(b=>list.push(b));
  w.foams.filter(f=>f.hp>0).forEach(f=>list.push(f));
  return list;
}
function tryMove(ent, dx, dy, asBox){
  if(!dx && !dy) return false;
  const solids=allSolids().filter(s=>s!==ent);
  const water=play.world.water;
  const step= (x,y)=>{
    const onBoard = play.world.decor.some(d=>d.kind==="boardwalk" && x>d.x && x<d.x+d.w && y>d.y && y<d.y+d.h);
    if(!onBoard){
      for(const wt of water){ if(circleHitRect(x,y,ent.r-2,wt)) return false; }
    }
    for(const s of solids){ if(circleHitRect(x,y,ent.r,s)) return false; }
    return true;
  };
  if(step(ent.x+dx, ent.y+dy)){ ent.x+=dx; ent.y+=dy; return true; }
  // Walk into a crate to push it (before axis-slide, which would otherwise swallow
  // a straight horizontal/vertical bump and never move the crate).
  if(!asBox){
    for(const b of play.world.boxes){
      if(circleHitRect(ent.x+dx, ent.y+dy, ent.r, b) || circleHitRect(ent.x+dx, ent.y, ent.r, b) || circleHitRect(ent.x, ent.y+dy, ent.r, b)){
        const px=dx*0.7, py=dy*0.7;
        const oldx=b.x, oldy=b.y;
        b.x+=px; b.y+=py;
        let blocked=false;
        for(const s of allSolids()){ if(s!==b && aabb(b,s)) {blocked=true; break;} }
        // Water must not pin crates in place. A crate that still overlaps a boardwalk
        // (even if it also overlaps water, or hangs off the plank) can be pushed, so a
        // 70-tall crate can be moved off a 100-tall walkway's mid path. Crates fully
        // off the plank still cannot be shoved into open water.
        if(!blocked){
          const onBoard = play.world.decor.some(d=>d.kind==="boardwalk" && aabb(b,d));
          if(!onBoard){
            for(const wt of play.world.water){ if(aabb(b,wt)) {blocked=true; break;} }
          }
        }
        if(blocked){ b.x=oldx; b.y=oldy; }
        else {
          if(step(ent.x+dx*0.4, ent.y+dy*0.4)){ ent.x+=dx*0.4; ent.y+=dy*0.4; }
          return true;
        }
      }
    }
  }
  if(step(ent.x+dx, ent.y)){ ent.x+=dx; return true; }
  if(step(ent.x, ent.y+dy)){ ent.y+=dy; return true; }
  return false;
}
function facingVec(ent){
  const a = ent.faceAng!=null ? ent.faceAng : (ent.dir>=0?0:Math.PI);
  return {x:Math.cos(a), y:Math.sin(a)};
}
function near(ent, x,y,r){ return Math.hypot(ent.x-x,ent.y-y) <= r+(ent.r||0); }

function sprayFoam(){
  const p=active();
  if(p.who!=="lili"){ showCue("換"+LILI+"來噴泡沫", 1000); return; }
  p.spray=0.4;
  const f=facingVec(p);
  play.foamBurst={x:p.x+f.x*28, y:p.y+f.y*28, r:36, t:0.35};
  const hit=(x,y,r)=> Math.hypot(x-play.foamBurst.x,y-play.foamBurst.y)<r+play.foamBurst.r;
  play.world.sparks.forEach(s=>{ if(s.alive && hit(s.x,s.y,s.r)) s.alive=false; });
  play.world.foams.forEach(fm=>{ if(fm.hp>0 && hit(fm.x+fm.w/2,fm.y+fm.h/2,Math.max(fm.w,fm.h)/2)) fm.hp--; });
  play.world.huhus.forEach(h=>{
    if(!h.reloc && hit(h.x,h.y,h.r)){
      h.reloc=true; h.sleeping=true;
      h.x = clamp(h.x+140, 80, play.world.w-80);
      h.y = clamp(h.y-80, 80, play.world.h-80);
      showCue(HUHU+"換了個地方，繼續睡囉", 1400);
    }
  });
  spawnFoamBurstFX();
}

function useTool(){
  if(!play || paused || play.won) return;
  const p=active();
  if(play.world.practice && near(p, play.world.practice.x, play.world.practice.y, 50)){
    play.world.practice.used=true;
    showCue("很好，器具會用了", 1000);
    refreshObjectives(); return;
  }
  for(const pal of play.world.pals){
    if(!pal.freed && near(p, pal.x, pal.y, 46)){
      pal.freed=true; pal.follow=true;
      showCue("我們一起走吧，"+(PALS[pal.id]?PALS[pal.id].name:"夥伴"), 1400);
      refreshObjectives(); return;
    }
  }
  for(const v of play.world.valves){
    if(!v.on && near(p, v.x, v.y, 50)){
      if(v.needDong && p.who!=="dong"){ showCue("換"+DONG+"來轉閥門", 1100); return; }
      v.on=true;
      if(v.opens && play.world.gateSolid){ play.world.gateSolid.w=0; play.world.gateSolid.h=0; }
      showCue(v.cool?"冷卻閥轉好了":"閥門打開了", 1100);
      refreshObjectives(); return;
    }
  }
  for(const lk of play.world.leaks){
    if(!lk.closed && near(p, lk.x, lk.y, 46)){
      lk.closed=true;
      showCue("漏氣口關上了", 900);
      refreshObjectives(); return;
    }
  }
  for(const wh of play.world.wheels){
    if(wh.running && near(p, wh.x, wh.y, 64)){
      if(p.who!=="dong"){ showCue("換"+DONG+"幫忙推控制桿", 1100); return; }
      wh.running=false;
      showCue("水車安靜下來了", 1100);
      refreshObjectives(); return;
    }
  }
  for(const it of play.world.items){
    if(!it.got && near(p, it.x, it.y, 46)){
      it.got=true;
      showCue("拿到"+it.name+"了", 1100);
      refreshObjectives(); return;
    }
  }
  for(const c of play.world.cores){
    if(!c.solved && near(p, c.x, c.y, 56)){
      if(p.who!=="lili"){ showCue("換"+LILI+"用色塊解碼器", 1100); return; }
      openCorePanel(c); return;
    }
  }
  if(p.who==="lili") sprayFoam();
  else showCue(DONG+"提起暖芯燈，四處看了看", 800);
}

function callDong(){
  if(!play || paused) return;
  if(play.who!=="dong") switchWho("dong");
  const tgt=nextTarget();
  play.hintTarget=tgt;
  play.hintUntil=play.t+4;
  if(tgt) showCue(DONG+"用燈指出下一處", 1200);
  else showCue(DONG+"點了點頭：這裡都安頓好了", 1000);
}
function nextTarget(){
  if(!play) return null;
  const w=play.world;
  if(w.practice && !w.practice.used) return {x:w.practice.x,y:w.practice.y};
  for(const s of w.sparks){ if(s.alive) return s; }
  for(const f of w.foams){ if(f.hp>0) return {x:f.x+f.w/2,y:f.y+f.h/2}; }
  for(const v of w.valves){ if(!v.on) return v; }
  for(const lk of w.leaks){ if(!lk.closed) return lk; }
  for(const wh of w.wheels){ if(wh.running) return wh; }
  for(const it of w.items){ if(!it.got) return it; }
  for(const c of w.cores){ if(!c.solved) return c; }
  for(const pal of w.pals){ if(!pal.freed) return pal; if(pal.follow) return w.exit; }
  if(w.boxes.length && play.objs.some(o=>!o.done && o.label.includes("木箱"))){
    return {x:w.boxes[0].x, y:w.boxes[0].y};
  }
  return w.exit;
}
function pointBlockedForPath(x,y,r){
  const onBoard = play.world.decor.some(d=>d.kind==="boardwalk" && x>d.x && x<d.x+d.w && y>d.y && y<d.y+d.h);
  if(!onBoard){
    for(const wt of play.world.water){ if(circleHitRect(x,y,r,wt)) return true; }
  }
  for(const s of allSolids()){ if(circleHitRect(x,y,r,s)) return true; }
  return false;
}
function canPath(a,b){
  const r=18, step=24;
  if(Math.hypot((a.x||a[0])-(b.x||b[0]), (a.y||a[1])-(b.y||b[1]))<step && !pointBlockedForPath(b.x,b.y,r)) return true;
  const sx=Math.round(a.x/step), sy=Math.round(a.y/step);
  const tx=Math.round(b.x/step), ty=Math.round(b.y/step);
  const key=(x,y)=>x+","+y;
  const seen=new Set([key(sx,sy)]);
  const q=[[sx,sy]];
  const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  let qi=0;
  while(qi<q.length){
    const [cx,cy]=q[qi++];
    if(Math.abs(cx-tx)+Math.abs(cy-ty)<=1) return true;
    for(const [dx,dy] of dirs){
      const nx=cx+dx, ny=cy+dy, k=key(nx,ny);
      if(seen.has(k)) continue;
      const x=nx*step, y=ny*step;
      if(x<20||y<20||x>play.world.w-20||y>play.world.h-20) continue;
      if(pointBlockedForPath(x,y,r)) continue;
      seen.add(k); q.push([nx,ny]);
    }
  }
  return false;
}
function pathClearEnough(){
  const w=play.world;
  if(!w.boxes.length) return true;
  if(!canPath(w.start, w.exit)) return false;
  for(const wh of w.wheels){ if(!canPath(w.start, {x:wh.x, y:wh.y})) return false; }
  return true;
}
function refreshObjectives(){
  if(!play) return;
  const w=play.world, ms=play.ms, objs=play.objs;
  const mark=(pred)=>{ const o=objs.find(x=>!x.done && pred(x.label)); if(o) o.done=true; };
  if(w.practice && w.practice.used) mark(l=>l.includes("使用器具"));
  if(w.valves.some(v=>v.on)) mark(l=>l.includes("閥門")||l.includes("冷卻閥"));
  if(play.who==="dong" || w.valves.some(v=>v.on)) mark(l=>l.includes("切換為"+DONG));
  if(w.boxes.length && pathClearEnough()) mark(l=>l.includes("木箱")||l.includes("清出"));
  if(w.foams.length && w.foams.every(f=>f.hp<=0)) mark(l=>l.includes("泡沫"));
  if(w.sparks.length && w.sparks.every(s=>!s.alive)) mark(l=>l.includes("火花"));
  if(w.leaks.length && w.leaks.every(l=>l.closed)) mark(l=>l.includes("漏氣"));
  if(w.wheels.length && w.wheels.every(wh=>!wh.running)) mark(l=>l.includes("水車"));
  if(w.items.some(it=>it.got && it.kind==="key")) mark(l=>l.includes("鑰匙"));
  if(w.items.some(it=>it.got && it.kind==="crystal")) mark(l=>l.includes("結晶"));
  if(w.cores.some(c=>c.solved)) mark(l=>l.includes(CORE) || l.includes("安靜"));
  if(w.pals.some(p=>p.freed)) mark(l=>l.includes("解救")||l.includes("打開停下"));
  if(w.huhus.length && (w.huhus.every(h=>h.reloc) || w.pals.some(p=>p.freed))){
    mark(l=>l.includes("\u8EA1\u624B\u8EA1\u8173"));
  }
  const atExit = near(active(), w.exit.x, w.exit.y, 48);
  const palsOk = w.pals.length===0 || w.pals.every(p=>p.freed && near(p, w.exit.x, w.exit.y, 80));
  const itemsOk = w.items.every(it=>it.got);
  const coresOk = w.cores.every(c=>c.solved);
  const sparksOk = w.sparks.every(s=>!s.alive);
  const foamsOk = w.foams.every(f=>f.hp<=0);
  const leaksOk = w.leaks.every(l=>l.closed);
  const wheelsOk = w.wheels.every(wh=>!wh.running);
  const valvesOk = w.valves.every(v=>v.on);
  const practiceOk = !w.practice || w.practice.used;
  const boxesOk = !w.boxes.length || pathClearEnough();
  if(atExit && palsOk && itemsOk && coresOk && sparksOk && foamsOk && leaksOk && wheelsOk && valvesOk && practiceOk && boxesOk){
    mark(l=>l.includes("出口")||l.includes("走到")||l.includes("帶到")||l.includes("護送"));
  }
  if(ms.id==="mill-2" && coresOk) objs.forEach(o=>o.done=true);
  updateHUD();
  if(objs.every(o=>o.done) && !play.won){
    if(ms.id==="mill-2" || (atExit && palsOk)) finishMission();
  }
}
function maybeFinishAtExit(){
  if(!play || play.won) return;
  refreshObjectives();
  const w=play.world;
  const atExit = near(active(), w.exit.x, w.exit.y, 48);
  const palsOk = w.pals.length===0 || w.pals.every(p=>p.freed && near(p, w.exit.x, w.exit.y, 80));
  if(atExit && palsOk && play.objs.filter(o=>!o.label.includes("出口")&&!o.label.includes("走到")&&!o.label.includes("帶到")&&!o.label.includes("護送")).every(o=>o.done)){
    play.objs.forEach(o=>{ if(o.label.includes("出口")||o.label.includes("走到")||o.label.includes("帶到")||o.label.includes("護送")) o.done=true; });
    if(play.objs.every(o=>o.done)) finishMission();
  }
}
function finishMission(){
  if(!play || play.won) return;
  play.won=true;
  const ms=play.ms;
  save.completed[ms.id]={at:Date.now(), player:save.currentPlayer};
  save.stats.missions=(save.stats.missions||0)+1;
  if(ms.pal && !save.rescued.includes(ms.pal)) save.rescued.push(ms.pal);
  save.lastMap=ms.map;
  persist();
  const nxt = nextMapJustUnlocked(ms.map);
  $("done-msg").textContent = nxt
    ? ("木板上勾起來了。值完這一張的班，已解開「"+nxt+"」。")
    : "木板上會勾起來。被救的夥伴會在小屋走動。";
  showOv("ov-done", true);
}
function nextMapJustUnlocked(mapId){
  if(!mapDone(mapId)) return null;
  return {creek:MAP_GREEN, greenhouse:MAP_CABLE, cable:MAP_MILL}[mapId]||null;
}
function respawn(reason){
  if(!play) return;
  const p=active();
  p.x=play.lastCp.x; p.y=play.lastCp.y;
  const o=other();
  o.x=play.lastCp.x-30; o.y=play.lastCp.y+20;
  play.world.pals.forEach(pal=>{ if(pal.follow){ pal.x=p.x+24; pal.y=p.y+10; } });
  if(reason) showCue(reason, 1800);
}
function triggerSleep(kind){
  if(!play || play.won) return;
  play.asleep=true; play.failed=true; paused=true;
  $("asleep-title").textContent = kind==="huhu" ? (HUHU+"翻了個身") : (CORE+SLEEP_WORD+"了");
  $("asleep-msg").textContent = kind==="huhu"
    ? ("我們先回到暖芯燈，再"+ "\u8EA1\u624B\u8EA1\u8173" +"走過去。"+HUHU+"不是反派，只是被吵醒了。")
    : "沙漏走完了，裝置進入休眠。沒有爆炸，也沒有傷害，輕輕再試一次就好。";
  if(kind!=="huhu" && isLoose() && !play.extended){
    play.extended=true;
    play.asleep=false; play.failed=false; paused=false;
    play.timer = Math.max(30, Math.floor(play.timerMax*0.45));
    showCue("沙漏多給了一點時間，加油", 1600);
    updateHUD();
    return;
  }
  showOv("ov-asleep", true);
}
function retryMission(){
  if(!play) return;
  showOv("ov-asleep", false);
  startMission(play.ms.id);
}
function openCorePanel(core){
  play.coreOpen=true; play.activeCore=core; paused=true;
  const loose=isLoose();
  $("core-hint").textContent = loose
    ? "依序按下看到的顏色。這座"+CORE+"只是輕輕打嗝，對好就會安靜下來。"
    : "依序按下顏色與符號。順序要記清楚。";
  $("core-status").textContent="依序按：";
  const seqEl=$("core-seq");
  seqEl.innerHTML = core.seq.map(s=>`<span style="color:${s.color};margin:0 6px">${loose?"●":s.symbol}</span>`).join("");
  const mac=$("core-machine"); mac.innerHTML="";
  const pads = [
    {id:0, color:"#d94a4a", symbol:"●"},
    {id:1, color:"#e0c03a", symbol:"▲"},
    {id:2, color:"#3a8ad9", symbol:"★"},
    {id:3, color:"#3cbf8a", symbol:"◆"}
  ];
  const used = loose && play.ms.types.includes("core-color") ? pads.slice(0,3) : pads;
  used.forEach(pd=>{
    const b=document.createElement("button");
    b.className="pad"; b.type="button";
    b.style.background=pd.color; b.textContent=pd.symbol; b.style.color="#fff";
    b.addEventListener("click", ()=>pressCore(pd.id));
    mac.appendChild(b);
  });
  showOv("ov-core", true);
}
function pressCore(id){
  const c=play.activeCore; if(!c||c.solved) return;
  const need=c.seq[c.input.length];
  if(need && need.id===id){
    c.input.push(id);
    $("core-status").textContent="對了，繼續… "+c.input.length+"/"+c.seq.length;
    if(c.input.length>=c.seq.length){
      c.solved=true;
      $("core-status").textContent=CORE+"安靜下來了。";
      setTimeout(()=>{
        showOv("ov-core", false);
        play.coreOpen=false; paused=false;
        showCue(CORE+"安靜下來了", 1200);
        refreshObjectives();
        maybeFinishAtExit();
        if(play.ms.id==="mill-2") refreshObjectives();
      }, 500);
    }
  }else{
    c.input=[];
    $("core-status").textContent="順序不太對，再從頭輕輕試一次。";
  }
}
function closeCore(){
  showOv("ov-core", false);
  play.coreOpen=false; paused=false;
}

function followEnt(ent, tx, ty, speed, minR){
  const dx=tx-ent.x, dy=ty-ent.y, d=Math.hypot(dx,dy);
  if(d<=minR) return;
  const s=Math.min(speed, d-minR);
  tryMove(ent, (dx/d)*s, (dy/d)*s);
}

function updatePlay(dt){
  if(!play || play.won) return;
  play.t += dt;
  if(play.foamBurst){ play.foamBurst.t -= dt; if(play.foamBurst.t<=0) play.foamBurst=null; }
  const p=active(), o=other();
  p.spray = Math.max(0, p.spray-dt);
  if(!paused){
    let mx=stick.dx, my=stick.dy;
    if(keys.ArrowLeft||keys.a||keys.A) mx-=1;
    if(keys.ArrowRight||keys.d||keys.D) mx+=1;
    if(keys.ArrowUp||keys.w||keys.W) my-=1;
    if(keys.ArrowDown||keys.s||keys.S) my+=1;
    const mag=Math.hypot(mx,my);
    if(mag>1){ mx/=mag; my/=mag; }
    const spd = 210 * (play.night?0.95:1);
    if(mag>0.08){
      const dx=mx*spd*dt, dy=my*spd*dt;
      tryMove(p, dx, dy);
      p.faceAng = Math.atan2(my, mx);
      p.dir = mx>=0?1:-1;
      p.walk += mag*dt*8;
      play.speedNow = mag*spd;
    }else{
      play.speedNow = 0;
    }
    // companion follows a little behind
    followEnt(o, p.x - Math.cos(p.faceAng||0)*36, p.y - Math.sin(p.faceAng||0)*36, 190*dt, 28);
    o.faceAng = Math.atan2(p.y-o.y, p.x-o.x);
    play.world.pals.forEach(pal=>{
      if(pal.follow){
        followEnt(pal, p.x, p.y, 200*dt, 34);
      }
    });
    // checkpoints
    play.world.checkpoints.forEach(cp=>{
      if(near(p, cp.x, cp.y, 40)) play.lastCp={x:cp.x,y:cp.y};
    });
    // sneak
    const sneakLimit = isLoose()? 130 : 90;
    play.world.huhus.forEach(h=>{
      if(h.reloc) return;
      const d=Math.hypot(p.x-h.x,p.y-h.y);
      if(d < h.hear + p.r){
        if(play.speedNow > sneakLimit){
          triggerSleep("huhu");
        }else if(play.t>play.sneakWarned+3){
          play.sneakWarned=play.t;
          showCue("輕輕走，或用泡沫請"+HUHU+"換地方睡", 1400);
        }
      }
    });
    if(play.timerMax>0){
      play.timer -= dt;
      if(Math.floor(play.t*2)%2===0) updateHUD();
      if(play.timer<=0){ play.timer=0; triggerSleep("core"); }
    }
    maybeFinishAtExit();
  }
  syncPlayMeshes(dt);
}


/* ---------- 3D helpers & models ---------- */
let renderer=null, clock=null;
let titleScene=null, cabinScene=null, briefScene=null, playScene=null;
let titleCam=null, cabinCam=null, briefCam=null, playCam=null;
let gfxReady=false;
let camZoom=1, camYaw=0.55;
let titleRig=null, cabinRig=null;
let playRoot=null, playMeshes=null;
const GEO = {};
function G(name, maker){ if(!GEO[name]) GEO[name]=maker(); return GEO[name]; }
function mat(color, opts){
  opts=opts||{};
  return new THREE.MeshStandardMaterial({
    color, roughness: opts.r==null?0.58:opts.r, metalness: opts.m==null?0.06:opts.m,
    emissive: opts.em||0x000000, emissiveIntensity: opts.ei||0,
    transparent: !!opts.t, opacity: opts.o==null?1:opts.o, flatShading: false,
    side: opts.side||THREE.FrontSide
  });
}
function addMesh(parent, geo, material, x,y,z, sx,sy,sz){
  const m=new THREE.Mesh(geo, typeof material==="number"?mat(material):material);
  m.position.set(x||0,y||0,z||0);
  if(sx) m.scale.set(sx, sy==null?sx:sy, sz==null?sx:sz);
  m.castShadow=true; m.receiveShadow=true;
  parent.add(m); return m;
}
function to3(x,y){ return new THREE.Vector3((x-800)*0.02, 0, (y-500)*0.02); }

function makeLili(){
  const g=new THREE.Group(); g.name="lili";
  const fur=mat(0xC6864A, {r:0.72});
  const furD=mat(0x8E4E28, {r:0.75});
  const cream=mat(0xE8C9A0, {r:0.65});
  const cap=mat(0xD4B44A, {r:0.7});
  const khaki=mat(0xC4A882, {r:0.7});
  const sph=G("sph", ()=>new THREE.SphereGeometry(1, 16, 12));
  const capGeo=G("cap", ()=>new THREE.SphereGeometry(1, 16, 10, 0, Math.PI*2, 0, Math.PI*0.55));
  // feet / legs
  const legL=addMesh(g, sph, furD, -0.16, 0.18, 0.04, 0.11, 0.18, 0.11);
  const legR=addMesh(g, sph, furD, 0.16, 0.18, 0.04, 0.11, 0.18, 0.11);
  addMesh(g, sph, furD, -0.16, 0.06, 0.08, 0.13, 0.07, 0.16);
  addMesh(g, sph, furD, 0.16, 0.06, 0.08, 0.13, 0.07, 0.16);
  // body
  addMesh(g, sph, fur, 0, 0.52, 0, 0.36, 0.42, 0.3);
  addMesh(g, sph, cream, 0, 0.46, 0.14, 0.24, 0.3, 0.16);
  // tail
  const tail=new THREE.Group(); tail.position.set(-0.22,0.42,-0.22); g.add(tail);
  addMesh(tail, sph, furD, 0, 0.05, -0.08, 0.16, 0.16, 0.16);
  addMesh(tail, sph, fur, -0.04, 0.22, -0.18, 0.22, 0.22, 0.22);
  addMesh(tail, sph, fur, -0.02, 0.42, -0.22, 0.2, 0.2, 0.2);
  addMesh(tail, sph, fur, 0.04, 0.58, -0.14, 0.16, 0.16, 0.16);
  // arms
  const armL=new THREE.Group(); armL.position.set(-0.32,0.55,0.06); g.add(armL);
  const armR=new THREE.Group(); armR.position.set(0.32,0.55,0.06); g.add(armR);
  addMesh(armL, sph, fur, 0, -0.12, 0.08, 0.1, 0.16, 0.1);
  addMesh(armR, sph, fur, 0, -0.12, 0.08, 0.1, 0.16, 0.1);
  // spray bottle (toy)
  const bottle=addMesh(armR, G("cyl", ()=>new THREE.CylinderGeometry(0.07,0.08,0.28,10)), mat(0xf4f0e8, {r:0.35,t:true,o:0.88}), 0.02, -0.28, 0.16);
  addMesh(armR, G("cyl2", ()=>new THREE.CylinderGeometry(0.03,0.03,0.08,8)), mat(0x3d8a86), 0.02, -0.1, 0.16);
  addMesh(armR, sph, mat(0x3d8a86), 0.02, -0.06, 0.2, 0.045,0.045,0.045);
  // head
  const head=new THREE.Group(); head.position.set(0, 0.98, 0.02); g.add(head);
  addMesh(head, sph, fur, 0, 0, 0, 0.34, 0.32, 0.3);
  addMesh(head, sph, cream, 0, -0.04, 0.18, 0.2, 0.16, 0.14);
  // ears
  addMesh(head, sph, fur, -0.22, 0.32, -0.04, 0.11, 0.2, 0.09);
  addMesh(head, sph, fur, 0.22, 0.32, -0.04, 0.11, 0.2, 0.09);
  addMesh(head, sph, mat(0xE8A0B0,{r:0.6}), -0.2, 0.26, 0.03, 0.06, 0.1, 0.04);
  addMesh(head, sph, mat(0xE8A0B0,{r:0.6}), 0.2, 0.26, 0.03, 0.06, 0.1, 0.04);
  // eyes
  const eyeW=mat(0xF8F4EC,{r:0.4});
  addMesh(head, sph, eyeW, -0.11, 0.06, 0.24, 0.09, 0.1, 0.07);
  addMesh(head, sph, eyeW, 0.11, 0.06, 0.24, 0.09, 0.1, 0.07);
  addMesh(head, sph, mat(0x2A1A10,{r:0.4}), -0.11, 0.06, 0.3, 0.045, 0.05, 0.03);
  addMesh(head, sph, mat(0x2A1A10,{r:0.4}), 0.11, 0.06, 0.3, 0.045, 0.05, 0.03);
  addMesh(head, sph, mat(0xFFFFFF,{r:0.3}), -0.09, 0.09, 0.32, 0.02,0.02,0.02).castShadow=false;
  addMesh(head, sph, mat(0xFFFFFF,{r:0.3}), 0.13, 0.09, 0.32, 0.02,0.02,0.02).castShadow=false;
  addMesh(head, sph, mat(0x3A2010), 0, -0.02, 0.3, 0.04,0.03,0.03);
  // cap + goggles
  addMesh(head, capGeo, cap, 0, 0.16, -0.02, 0.36, 0.28, 0.34).rotation.x=-0.15;
  addMesh(head, G("tor", ()=>new THREE.TorusGeometry(0.2, 0.025, 8, 16)), mat(0x6B4A28,{r:0.6}), 0, 0.16, 0.08, 1,1,1).rotation.x=1.05;
  const glass=mat(0xE8C070,{r:0.25,m:0.35,t:true,o:0.55,em:0xC09040,ei:0.15});
  const gL=addMesh(head, G("cyl3", ()=>new THREE.CylinderGeometry(0.09,0.09,0.05,12)), glass, -0.12, 0.18, 0.2);
  gL.rotation.x=Math.PI/2;
  const gR=addMesh(head, G("cyl3b", ()=>new THREE.CylinderGeometry(0.09,0.09,0.05,12)), glass, 0.12, 0.18, 0.2);
  gR.rotation.x=Math.PI/2;
  // bag
  addMesh(g, G("box", ()=>new THREE.BoxGeometry(1,1,1)), khaki, 0.28, 0.48, -0.06, 0.22, 0.2, 0.14);
  g.userData.parts={tail, armL, armR, head, legL, legR};
  g.scale.setScalar(1);
  return g;
}

function makeDong(){
  const g=new THREE.Group(); g.name="dong";
  const br=mat(0x6B4330,{r:0.78});
  const brL=mat(0x8A5A3C,{r:0.78});
  const beak=mat(0xE8C9A0,{r:0.45});
  const scarf=mat(0xE07A3A,{r:0.72});
  const sph=G("sph", ()=>new THREE.SphereGeometry(1, 16, 12));
  // body - chubby kiwi
  addMesh(g, sph, br, 0, 0.55, 0, 0.48, 0.5, 0.46);
  addMesh(g, sph, brL, 0, 0.5, 0.16, 0.3, 0.32, 0.2);
  // hair tuft
  addMesh(g, sph, br, -0.05, 1.08, -0.05, 0.18, 0.16, 0.22);
  addMesh(g, sph, br, 0.08, 1.14, 0.02, 0.12, 0.14, 0.16);
  // head bump
  addMesh(g, sph, br, 0, 0.95, 0.08, 0.32, 0.28, 0.3);
  // beak
  const beakM=addMesh(g, G("cone", ()=>new THREE.ConeGeometry(0.08, 0.55, 8)), beak, 0, 0.82, 0.42);
  beakM.rotation.x=Math.PI/2.15;
  addMesh(g, sph, beak, 0, 0.8, 0.22, 0.1, 0.08, 0.1);
  // eyes
  addMesh(g, sph, mat(0xF8F4EC,{r:0.4}), -0.14, 0.9, 0.28, 0.07, 0.08, 0.05);
  addMesh(g, sph, mat(0xF8F4EC,{r:0.4}), 0.14, 0.9, 0.28, 0.07, 0.08, 0.05);
  addMesh(g, sph, mat(0x2A1A10,{r:0.4}), -0.14, 0.9, 0.32, 0.035, 0.04, 0.025);
  addMesh(g, sph, mat(0x2A1A10,{r:0.4}), 0.14, 0.9, 0.32, 0.035, 0.04, 0.025);
  // scarf
  addMesh(g, G("tor2", ()=>new THREE.TorusGeometry(0.28, 0.07, 8, 16)), scarf, 0, 0.72, 0.04).rotation.x=1.2;
  addMesh(g, G("box2", ()=>new THREE.BoxGeometry(0.12,0.36,0.08)), scarf, 0.16, 0.5, 0.22);
  // lantern
  const lan=new THREE.Group(); lan.position.set(-0.38, 0.42, 0.28); g.add(lan);
  const brass=mat(0xB8864A,{r:0.35,m:0.4});
  addMesh(lan, G("cyl4", ()=>new THREE.CylinderGeometry(0.11,0.12,0.06,10)), brass, 0, 0.2, 0);
  addMesh(lan, G("cyl5", ()=>new THREE.CylinderGeometry(0.11,0.11,0.06,10)), brass, 0, -0.16, 0);
  const glow=addMesh(lan, G("cyl6", ()=>new THREE.CylinderGeometry(0.1,0.1,0.3,10)), mat(0xFFE08A,{r:0.4,em:0xFFD56A,ei:0.85,t:true,o:0.9}), 0, 0.02, 0);
  glow.castShadow=false;
  const light=new THREE.PointLight(0xFFD56A, 0.9, 7, 2);
  light.position.set(0,0.02,0); lan.add(light);
  // feet
  const foot=mat(0x5A3A22,{r:0.6});
  addMesh(g, sph, foot, -0.16, 0.08, 0.12, 0.12, 0.07, 0.18);
  addMesh(g, sph, foot, 0.16, 0.08, 0.12, 0.12, 0.07, 0.18);
  g.userData.parts={lan, glow, light};
  return g;
}

function makeHuhu(){
  const g=new THREE.Group(); g.name="huhu";
  const fluff=mat(0xF6F0E6,{r:0.92});
  const sph=G("sph", ()=>new THREE.SphereGeometry(1, 14, 10));
  addMesh(g, sph, fluff, 0, 0.45, 0, 0.55, 0.42, 0.5);
  addMesh(g, sph, fluff, 0.32, 0.4, 0.1, 0.32, 0.3, 0.3);
  addMesh(g, sph, fluff, -0.3, 0.38, 0.08, 0.3, 0.28, 0.28);
  addMesh(g, sph, fluff, 0.05, 0.7, -0.05, 0.32, 0.26, 0.3);
  addMesh(g, sph, mat(0xE8A0B0,{r:0.7}), -0.22, 0.4, 0.32, 0.08,0.06,0.04).castShadow=false;
  addMesh(g, sph, mat(0xE8A0B0,{r:0.7}), 0.22, 0.4, 0.32, 0.08,0.06,0.04).castShadow=false;
  // sleepy eyes
  const line=mat(0x4A3420,{r:0.5});
  addMesh(g, G("box3", ()=>new THREE.BoxGeometry(0.14,0.03,0.03)), line, -0.16, 0.5, 0.4);
  addMesh(g, G("box3b", ()=>new THREE.BoxGeometry(0.14,0.03,0.03)), line, 0.16, 0.5, 0.4);
  g.userData.baseY=0.0;
  return g;
}

function makePal(species){
  const g=new THREE.Group();
  const sph=G("sph", ()=>new THREE.SphereGeometry(1, 12, 10));
  if(species==="狐狸"){
    const c=mat(0xE07A3A,{r:0.7});
    addMesh(g, sph, c, 0, 0.35, 0, 0.32, 0.26, 0.28);
    addMesh(g, sph, c, 0, 0.62, 0.1, 0.22, 0.2, 0.2);
    addMesh(g, G("cone2", ()=>new THREE.ConeGeometry(0.08,0.22,8)), c, -0.12, 0.8, 0.08);
    addMesh(g, G("cone2b", ()=>new THREE.ConeGeometry(0.08,0.22,8)), c, 0.12, 0.8, 0.08);
    addMesh(g, sph, mat(0xF8F0E4), 0, 0.32, 0.16, 0.16, 0.14, 0.1);
  }else if(species==="兔子"){
    const c=mat(0xF3EFE6,{r:0.7});
    addMesh(g, sph, c, 0, 0.32, 0, 0.28, 0.26, 0.26);
    addMesh(g, sph, c, -0.08, 0.7, 0, 0.07, 0.22, 0.07);
    addMesh(g, sph, c, 0.08, 0.7, 0, 0.07, 0.22, 0.07);
    addMesh(g, sph, mat(0xF5B6C4), -0.08, 0.7, 0.02, 0.04, 0.14, 0.03);
  }else if(species==="刺蝟"){
    const c=mat(0x7A5A3A,{r:0.75});
    addMesh(g, sph, c, 0, 0.32, 0, 0.32, 0.26, 0.3);
    for(let i=0;i<8;i++){
      const a=-2.2+i*0.5;
      const sp=addMesh(g, G("cone3", ()=>new THREE.ConeGeometry(0.06,0.2,6)), c, Math.cos(a)*0.18, 0.5, Math.sin(a)*0.18);
      sp.rotation.x=0.6;
    }
    addMesh(g, sph, mat(0xC9A07A), 0, 0.32, 0.16, 0.18, 0.14, 0.12);
  }else{
    const c=mat(0x6A8AA0,{r:0.7});
    addMesh(g, sph, c, 0, 0.28, 0, 0.36, 0.22, 0.22);
    addMesh(g, sph, c, 0, 0.4, 0.16, 0.18, 0.16, 0.16);
  }
  return g;
}

function makeCore(){
  const g=new THREE.Group();
  const body=mat(0xE8D2A0,{r:0.45,m:0.15});
  const sph=G("sph", ()=>new THREE.SphereGeometry(1, 16, 12));
  addMesh(g, G("cyl7", ()=>new THREE.CylinderGeometry(0.28,0.34,0.7,12)), body, 0, 0.5, 0);
  addMesh(g, sph, mat(0xF3D56A,{r:0.4,em:0xF3D56A,ei:0.35}), 0, 1.0, 0, 0.28, 0.22, 0.28);
  addMesh(g, G("cyl8", ()=>new THREE.CylinderGeometry(0.06,0.06,0.3,8)), mat(0x8A5A2B,{r:0.5,m:0.2}), 0, 1.22, 0);
  const cols=[0xd94a4a,0xe0c03a,0x3a8ad9,0x3cbf8a];
  cols.forEach((c,i)=>{
    const a=i*Math.PI/2;
    addMesh(g, sph, mat(c,{r:0.4,em:c,ei:0.25}), Math.cos(a)*0.32, 0.55, Math.sin(a)*0.32, 0.07,0.07,0.07);
  });
  const light=new THREE.PointLight(0xF3D56A, 0.55, 6, 2);
  light.position.set(0,1.1,0); g.add(light);
  return g;
}
function makeLanternPost(kind){
  const g=new THREE.Group();
  addMesh(g, G("cyl9", ()=>new THREE.CylinderGeometry(0.06,0.08,0.7,8)), mat(0x8A5A2B,{r:0.7}), 0, 0.35, 0);
  const col = kind==="exit"?0xF3D56A:0xFFE08A;
  addMesh(g, G("sph2", ()=>new THREE.SphereGeometry(1,12,10)), mat(col,{r:0.45,em:col,ei:0.7}), 0, 0.85, 0, 0.16,0.18,0.16);
  const light=new THREE.PointLight(col, 0.7, 6, 2);
  light.position.set(0,0.85,0); g.add(light);
  return g;
}
function makeBox(){
  const g=new THREE.Group();
  addMesh(g, G("box4", ()=>new THREE.BoxGeometry(0.7,0.7,0.7)), mat(0xC9894A,{r:0.7}));
  return g;
}
function makeFoam(w,h){
  const g=new THREE.Group();
  const fluff=mat(0xE8F4FF,{r:0.9,t:true,o:0.85});
  const sph=G("sph", ()=>new THREE.SphereGeometry(1, 10, 8));
  const sx=Math.max(0.8,(w||120)/80), sz=Math.max(0.7,(h||100)/80);
  addMesh(g, sph, fluff, 0, 0.35, 0, 0.5*sx, 0.35, 0.45*sz);
  addMesh(g, sph, fluff, 0.3*sx, 0.28, 0.1, 0.3*sx, 0.25, 0.28*sz);
  addMesh(g, sph, fluff, -0.25*sx, 0.3, -0.1, 0.28*sx, 0.22, 0.25*sz);
  return g;
}
function makeSpark(){
  const g=new THREE.Group();
  const m=mat(0x66DDFF,{r:0.3,em:0x44CCFF,ei:1.1,t:true,o:0.9});
  addMesh(g, G("sph", ()=>new THREE.SphereGeometry(1, 10, 8)), m, 0, 0.35, 0, 0.18,0.22,0.18).castShadow=false;
  const light=new THREE.PointLight(0x66DDFF, 0.6, 3.5, 2);
  light.position.set(0,0.35,0); g.add(light);
  return g;
}
function makeValve(){
  const g=new THREE.Group();
  addMesh(g, G("cyl10", ()=>new THREE.CylinderGeometry(0.12,0.14,0.3,10)), mat(0x6A8A8A,{r:0.4,m:0.3}), 0, 0.25, 0);
  addMesh(g, G("tor3", ()=>new THREE.TorusGeometry(0.18, 0.05, 8, 12)), mat(0x3d8a86,{r:0.4,m:0.2}), 0, 0.42, 0);
  return g;
}
function makeWheel(){
  const g=new THREE.Group();
  const wood=mat(0x8A5A2B,{r:0.7});
  const wheel=new THREE.Group(); wheel.position.set(0,1.1,0); g.add(wheel);
  addMesh(wheel, G("tor4", ()=>new THREE.TorusGeometry(0.9, 0.08, 8, 20)), wood, 0,0,0).rotation.y=Math.PI/2;
  for(let i=0;i<8;i++){
    const p=addMesh(wheel, G("box5", ()=>new THREE.BoxGeometry(0.08,1.7,0.28)), wood, 0,0,0);
    p.rotation.z=i*Math.PI/8;
  }
  addMesh(g, G("cyl11", ()=>new THREE.CylinderGeometry(0.1,0.1,1.4,8)), wood, 0,1.1,0).rotation.z=Math.PI/2;
  g.userData.wheel=wheel;
  return g;
}
function makeTree(scale){
  const g=new THREE.Group();
  addMesh(g, G("cyl12", ()=>new THREE.CylinderGeometry(0.12,0.16,0.7,8)), mat(0x7A4A28,{r:0.8}), 0, 0.35, 0);
  addMesh(g, G("sph", ()=>new THREE.SphereGeometry(1, 10, 8)), mat(0x4F8A3A,{r:0.75}), 0, 1.0, 0, 0.7,0.55,0.7);
  addMesh(g, G("sph", ()=>new THREE.SphereGeometry(1, 10, 8)), mat(0x3E7A2E,{r:0.75}), 0.25, 0.95, 0.1, 0.45,0.4,0.45);
  g.scale.setScalar(scale||1);
  return g;
}

function addLights(scene, night, theme){
  const hemi=new THREE.HemisphereLight(night?0x6688aa:0xfff2d8, night?0x223322:0x6a8a4a, night?0.45:0.85);
  scene.add(hemi);
  const sun=new THREE.DirectionalLight(night?0x8899cc:0xfff0d0, night?0.35:0.9);
  sun.position.set(8, 14, 6);
  sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);
  sun.shadow.camera.near=1; sun.shadow.camera.far=40;
  sun.shadow.camera.left=-18; sun.shadow.camera.right=18;
  sun.shadow.camera.top=18; sun.shadow.camera.bottom=-18;
  scene.add(sun);
  scene.fog = new THREE.Fog(night?0x1a2430:(theme&&theme.fog)||0xc8dce8, 18, 42);
  scene.background = new THREE.Color(night?0x1a2430:(theme&&theme.sky)||0x9fd0ea);
  return {hemi,sun};
}

function groundMesh(theme, w, d){
  const g=new THREE.Mesh(
    G("ground", ()=>new THREE.CircleGeometry(22, 32)),
    mat(theme?theme.grass:0x7da04a, {r:0.85})
  );
  g.rotation.x=-Math.PI/2; g.receiveShadow=true; g.castShadow=false;
  return g;
}

function placeAt(obj, x, y, yOff){
  const p=to3(x,y);
  obj.position.set(p.x, yOff||0, p.z);
}

function initRenderer(){
  if(renderer) return;
  const canvas=document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if(!gl){ throw new Error("WebGL unavailable"); }
  renderer=new THREE.WebGLRenderer({antialias:true, alpha:false, powerPreference:"high-performance", canvas});
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio||1));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.position="absolute";
  renderer.domElement.style.inset="0";
  renderer.domElement.style.width="100%";
  renderer.domElement.style.height="100%";
  renderer.domElement.style.pointerEvents="none";
  clock=new THREE.Clock();
  buildTitleScene();
  buildCabinScene();
  gfxReady=true;
  placeRenderer(screen||"title");
  window.addEventListener("resize", onResize, {passive:true});
}

function onResize(){
  if(!renderer) return;
  const host=renderer.domElement.parentElement;
  const w=host?host.clientWidth:window.innerWidth;
  const h=host?host.clientHeight:window.innerHeight;
  renderer.setSize(w, h, false);
  const cam=currentCam();
  if(cam && cam.isPerspectiveCamera){ cam.aspect=Math.max(0.1,w/Math.max(1,h)); cam.updateProjectionMatrix(); }
}

function currentCam(){
  if(screen==="play") return playCam;
  if(screen==="cabin") return cabinCam;
  if(screen==="brief") return briefCam||titleCam;
  return titleCam;
}
function currentScene(){
  if(screen==="play") return playScene;
  if(screen==="cabin") return cabinScene;
  if(screen==="brief") return briefScene||titleScene;
  return titleScene;
}

function placeRenderer(id){
  if(!renderer) return;
  let host=null;
  if(id==="title") host=$("title-stage");
  else if(id==="cabin") host=$("cabin-stage");
  else if(id==="brief") host=$("brief-stage");
  else if(id==="play") host=$("play-stage");
  else host=$("title-stage");
  if(host && renderer.domElement.parentElement!==host) host.appendChild(renderer.domElement);
  onResize();
}

function buildTitleScene(){
  titleScene=new THREE.Scene();
  titleCam=new THREE.PerspectiveCamera(32, 16/9, 0.1, 80);
  titleCam.position.set(-2.4, 2.15, 6.8);
  titleCam.lookAt(-0.15, 0.75, 0);
  addLights(titleScene, false, {sky:0xc5e4f2, fog:0xd8ecf5, grass:0x8fbf5a});
  titleScene.add(groundMesh({grass:0x8fbf5a}));
  const hill=addMesh(titleScene, G("sph", ()=>new THREE.SphereGeometry(1, 16, 10)), mat(0x7da04a,{r:0.85}), 0, -0.4, -2, 6, 1.2, 4);
  hill.receiveShadow=true;
  titleRig=new THREE.Group(); titleScene.add(titleRig);
  const l=makeLili(); l.position.set(-1.15,0,0.35); l.rotation.y=0.35; titleRig.add(l);
  const d=makeDong(); d.position.set(0.45,0,0.35); d.rotation.y=0.55; titleRig.add(d);
  titleRig.userData={lili:l, dong:d};
  titleScene.add(makeTree(1.3).translateX(-2.4).translateZ(-1.2));
  titleScene.add(makeTree(1.0).translateX(2.6).translateZ(-1.6));
  const core=makeCore(); core.position.set(0,0,-1.3); core.scale.setScalar(0.7); titleScene.add(core);
}

function buildCabinScene(){
  cabinScene=new THREE.Scene();
  cabinCam=new THREE.PerspectiveCamera(42, 16/9, 0.1, 80);
  cabinCam.position.set(0, 11, 14);
  cabinCam.lookAt(0, 0, 1);
  addLights(cabinScene, false, {sky:0x8ec8e6, fog:0xb8d8c0, grass:0x7da04a});
  cabinScene.add(groundMesh({grass:0x7da04a}));
  // water ribbon
  const water=new THREE.Mesh(G("plane", ()=>new THREE.PlaneGeometry(18, 3.2)), mat(0x5aa0c8,{r:0.25,m:0.15,t:true,o:0.85}));
  water.rotation.x=-Math.PI/2; water.position.set(0,0.04,1.2); water.receiveShadow=true; cabinScene.add(water);
  // hut
  const hut=new THREE.Group(); hut.position.set(0,0,0.4); cabinScene.add(hut);
  addMesh(hut, G("box6", ()=>new THREE.BoxGeometry(2.2,1.4,1.8)), mat(0xE8C48A,{r:0.7}), 0, 0.7, 0);
  const roof=addMesh(hut, G("cone4", ()=>new THREE.ConeGeometry(1.7, 0.9, 4)), mat(0xC9894A,{r:0.7}), 0, 1.7, 0);
  roof.rotation.y=Math.PI/4;
  addMesh(hut, G("box7", ()=>new THREE.BoxGeometry(0.4,0.7,0.08)), mat(0x8A5A2B,{r:0.7}), 0, 0.4, 0.92);
  // stylized landmarks
  const gh=new THREE.Group(); gh.position.set(4.6,0,0.2); cabinScene.add(gh);
  addMesh(gh, G("box8", ()=>new THREE.BoxGeometry(2.2,1.3,1.6)), mat(0xD8EEE0,{r:0.35,m:0.1,t:true,o:0.55,side:THREE.DoubleSide}), 0,0.7,0);
  const st=new THREE.Group(); st.position.set(-4.2,1.8,2.2); cabinScene.add(st);
  addMesh(st, G("box9", ()=>new THREE.BoxGeometry(1.6,0.8,1.1)), mat(0xC8A078,{r:0.65}), 0,0,0);
  const mill=makeWheel(); mill.position.set(5.2,0,2.6); mill.scale.setScalar(0.55); cabinScene.add(mill);
  cabinScene.add(makeTree(1.4).translateX(-3.5).translateZ(-2.5));
  cabinScene.add(makeTree(1.1).translateX(3.2).translateZ(-2.2));
  cabinScene.add(makeTree(0.9).translateX(-5.5).translateZ(0.5));
  cabinRig=new THREE.Group(); cabinScene.add(cabinRig);
}

function rebuildCabinScene(){
  if(!cabinRig) return;
  while(cabinRig.children.length) cabinRig.remove(cabinRig.children[0]);
  cabinPals.forEach((p,i)=>{
    const m=makePal(p.species);
    const a=p.a||i;
    m.position.set(Math.cos(a)*1.6, 0, 1.2+Math.sin(a)*1.1);
    m.userData.spin=0.4+i*0.1; m.userData.phase=a;
    cabinRig.add(m);
  });
}

function rebuildBriefScene(mapId){
  briefScene=new THREE.Scene();
  briefCam=new THREE.PerspectiveCamera(40, 1.2, 0.1, 60);
  briefCam.position.set(0, 6.5, 8.5);
  briefCam.lookAt(0,0.2,0);
  const th=themeFor(mapId);
  addLights(briefScene, false, th);
  briefScene.add(groundMesh(th));
  if(mapId==="creek"){
    const water=new THREE.Mesh(G("plane", ()=>new THREE.PlaneGeometry(16, 2.6)), mat(0x5aa0c8,{r:0.25,t:true,o:0.85}));
    water.rotation.x=-Math.PI/2; water.position.y=0.05; briefScene.add(water);
    briefScene.add(makeTree(1.2).translateX(-2).translateZ(-1));
    briefScene.add(makeLili()).position.set(-0.6,0,0.4);
    briefScene.add(makeDong()).position.set(0.7,0,0.3);
  }else if(mapId==="greenhouse"){
    addMesh(briefScene, G("box8", ()=>new THREE.BoxGeometry(2.2,1.3,1.6)), mat(0xD8EEE0,{r:0.35,t:true,o:0.5,side:THREE.DoubleSide}), 0,0.7,0);
    const s=makeSpark(); s.position.set(0.8,0,0.6); briefScene.add(s);
    briefScene.add(makeLili()).position.set(-0.7,0,0.8);
  }else if(mapId==="cable"){
    addMesh(briefScene, G("box9", ()=>new THREE.BoxGeometry(2.2,1.0,1.2)), mat(0xC8A078,{r:0.65}), 0,1.5,0);
    briefScene.add(makeDong()).position.set(0.6,0,1.0);
    briefScene.add(makeLili()).position.set(-0.7,0,1.0);
  }else{
    const w=makeWheel(); w.scale.setScalar(0.7); briefScene.add(w);
    const c=makeCore(); c.position.set(1.4,0,0.6); briefScene.add(c);
    briefScene.add(makeLili()).position.set(-1.0,0,1.1);
  }
}

function solidKindColor(kind){
  if(kind==="bed") return 0x6a9a3a;
  if(kind==="bush") return 0x3E7A2E;
  if(kind==="rock"||kind==="stone") return 0x8A8A80;
  if(kind==="wood"||kind==="cratewall"||kind==="shelf"||kind==="shed") return 0xC8A078;
  if(kind==="gate") return 0x8A6A48;
  return 0x6b8a48;
}

function rebuildPlayScene(){
  playScene=new THREE.Scene();
  playCam=new THREE.PerspectiveCamera(46, 16/9, 0.1, 80);
  const night=play && play.night;
  const th=play.world.theme;
  addLights(playScene, night, th);
  playRoot=new THREE.Group(); playScene.add(playRoot);
  playMeshes={solids:[], boxes:[], foams:[], sparks:[], huhus:[], items:[], valves:[], leaks:[], cores:[], wheels:[], pals:[], cps:[], actors:{}, foamFX:[]};

  // ground
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(40, 28), mat(th.grass,{r:0.88}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; playRoot.add(ground);
  // path strip
  const path=new THREE.Mesh(new THREE.PlaneGeometry(28, 3.2), mat(th.path,{r:0.85}));
  path.rotation.x=-Math.PI/2; path.position.y=0.02; path.receiveShadow=true; playRoot.add(path);

  const w=play.world;
  w.water.forEach(wt=>{
    const p=to3(wt.x+wt.w/2, wt.y+wt.h/2);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(wt.w*0.02, wt.h*0.02), mat(th.water,{r:0.22,m:0.2,t:true,o:0.8}));
    mesh.rotation.x=-Math.PI/2; mesh.position.set(p.x, 0.04, p.z); mesh.receiveShadow=true; playRoot.add(mesh);
  });
  w.decor.forEach(d=>{
    if(d.kind==="boardwalk"){
      const p=to3(d.x+d.w/2, d.y+d.h/2);
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(d.w*0.02, 0.08, d.h*0.02), mat(0xC9A06A,{r:0.75}));
      mesh.position.set(p.x, 0.08, p.z); mesh.receiveShadow=true; mesh.castShadow=true; playRoot.add(mesh);
    }
  });
  w.solids.forEach(s=>{
    if(s.kind==="wall"){
      const p=to3(s.x+s.w/2, s.y+s.h/2);
      const isH=s.w>s.h;
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.2,s.w*0.02), 1.1, Math.max(0.2,s.h*0.02)), mat(th.wall,{r:0.75}));
      mesh.position.set(p.x, 0.55, p.z); mesh.castShadow=true; mesh.receiveShadow=true;
      mesh.userData.solid=s; playRoot.add(mesh); playMeshes.solids.push(mesh);
    }else{
      const p=to3(s.x+s.w/2, s.y+s.h/2);
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.3,s.w*0.02), s.kind==="bed"?0.45:0.9, Math.max(0.3,s.h*0.02)), mat(solidKindColor(s.kind),{r:0.75}));
      mesh.position.set(p.x, s.kind==="bed"?0.22:0.45, p.z); mesh.castShadow=true; mesh.receiveShadow=true;
      mesh.userData.solid=s; playRoot.add(mesh); playMeshes.solids.push(mesh);
    }
  });
  // a few trees for volume, away from path
  [[200,200,1.2],[400,160,1],[1200,180,1.3],[1400,780,1],[200,800,1.1]].forEach(([x,y,sc])=>{
    const t=makeTree(sc); placeAt(t,x,y,0); playRoot.add(t);
  });

  w.boxes.forEach(b=>{ const m=makeBox(); placeAt(m, b.x+b.w/2, b.y+b.h/2, 0.35); m.userData.src=b; playRoot.add(m); playMeshes.boxes.push(m); });
  w.foams.forEach(f=>{ const m=makeFoam(f.w,f.h); placeAt(m, f.x+f.w/2, f.y+f.h/2, 0); m.userData.src=f; playRoot.add(m); playMeshes.foams.push(m); });
  w.sparks.forEach(s=>{ const m=makeSpark(); placeAt(m, s.x,s.y,0); m.userData.src=s; playRoot.add(m); playMeshes.sparks.push(m); });
  w.huhus.forEach(h=>{ const m=makeHuhu(); placeAt(m, h.x,h.y,0); m.userData.src=h; playRoot.add(m); playMeshes.huhus.push(m); });
  w.items.forEach(it=>{
    const m=new THREE.Group();
    const col=it.kind==="key"?0xF3D56A:0x88E0FF;
    addMesh(m, G("sph", ()=>new THREE.SphereGeometry(1,12,10)), mat(col,{r:0.4,em:col,ei:0.6}), 0,0.25,0, 0.16,0.16,0.16);
    placeAt(m, it.x,it.y,0); m.userData.src=it; playRoot.add(m); playMeshes.items.push(m);
  });
  w.valves.forEach(v=>{ const m=makeValve(); placeAt(m,v.x,v.y,0); m.userData.src=v; playRoot.add(m); playMeshes.valves.push(m); });
  w.leaks.forEach(lk=>{
    const m=new THREE.Group();
    addMesh(m, G("cyl13", ()=>new THREE.CylinderGeometry(0.1,0.12,0.16,10)), mat(0x668888,{r:0.4,m:0.2}), 0,0.1,0);
    const puff=addMesh(m, G("sph", ()=>new THREE.SphereGeometry(1,8,8)), mat(0xAAEEFF,{r:0.8,t:true,o:0.5,em:0x88DDFF,ei:0.3}), 0,0.35,0, 0.16,0.2,0.16);
    puff.castShadow=false; m.userData.puff=puff;
    placeAt(m,lk.x,lk.y,0); m.userData.src=lk; playRoot.add(m); playMeshes.leaks.push(m);
  });
  w.cores.forEach(c=>{ const m=makeCore(); placeAt(m,c.x,c.y,0); m.userData.src=c; playRoot.add(m); playMeshes.cores.push(m); });
  w.wheels.forEach(wh=>{ const m=makeWheel(); placeAt(m,wh.x,wh.y,0); m.userData.src=wh; playRoot.add(m); playMeshes.wheels.push(m); });
  w.pals.forEach(pal=>{
    const m=makePal((PALS[pal.id]||{}).species);
    placeAt(m, pal.x, pal.y, 0); m.userData.src=pal; playRoot.add(m); playMeshes.pals.push(m);
  });
  w.checkpoints.forEach(cp=>{ const m=makeLanternPost("cp"); placeAt(m,cp.x,cp.y,0); playRoot.add(m); playMeshes.cps.push(m); });
  if(w.exit){ const m=makeLanternPost("exit"); placeAt(m,w.exit.x,w.exit.y,0); playRoot.add(m); playMeshes.exit=m; }
  if(w.practice){
    const m=new THREE.Group();
    addMesh(m, G("cyl14", ()=>new THREE.CylinderGeometry(0.16,0.18,0.9,10)), mat(0x8A5A2B,{r:0.7}), 0,0.45,0);
    addMesh(m, G("tor5", ()=>new THREE.TorusGeometry(0.22,0.04,8,12)), mat(0x3d8a86), 0,0.9,0);
    placeAt(m,w.practice.x,w.practice.y,0); playRoot.add(m); playMeshes.practice=m;
  }

  const lili=makeLili(); playRoot.add(lili); playMeshes.actors.lili=lili;
  const dong=makeDong(); playRoot.add(dong); playMeshes.actors.dong=dong;
  // hint beam
  const hint=new THREE.Mesh(new THREE.SphereGeometry(0.14,10,8), mat(0xF3D56A,{r:0.4,em:0xF3D56A,ei:1,t:true,o:0.85}));
  hint.visible=false; playRoot.add(hint); playMeshes.hint=hint;
  syncPlayMeshes(0);
  onResize();
}

function spawnFoamBurstFX(){
  if(!play||!play.foamBurst||!playRoot) return;
  const m=new THREE.Mesh(G("sph", ()=>new THREE.SphereGeometry(1,10,8)), mat(0xE8F4FF,{r:0.9,t:true,o:0.7}));
  const p=to3(play.foamBurst.x, play.foamBurst.y);
  m.position.set(p.x, 0.4, p.z); m.scale.setScalar(0.4);
  playRoot.add(m);
  playMeshes.foamFX.push({mesh:m, t:0.35});
}

function syncPlayMeshes(dt){
  if(!play||!playMeshes) return;
  const set = (mesh, x,y, hidden, yOff)=>{
    if(!mesh) return;
    const p=to3(x,y);
    mesh.position.set(p.x, yOff==null?0:yOff, p.z);
    if(hidden) mesh.visible=false;
  };
  const lili=playMeshes.actors.lili, dong=playMeshes.actors.dong;
  if(lili){
    set(lili, play.lili.x, play.lili.y, false, 0);
    lili.rotation.y = -play.lili.faceAng + Math.PI/2;
    const pr=lili.userData.parts||{};
    const w=play.lili.walk||0;
    if(pr.armL) pr.armL.rotation.x=Math.sin(w)*0.5;
    if(pr.armR) pr.armR.rotation.x=Math.sin(w+Math.PI)*0.5;
    if(pr.tail) pr.tail.rotation.y=Math.sin(play.t*3)*0.2;
  }
  if(dong){
    set(dong, play.dong.x, play.dong.y, false, 0);
    dong.rotation.y = -play.dong.faceAng + Math.PI/2;
    dong.position.y = Math.sin(play.t*3)*0.03;
  }
  playMeshes.boxes.forEach(m=> set(m, m.userData.src.x+m.userData.src.w/2, m.userData.src.y+m.userData.src.h/2, false, 0.35));
  playMeshes.foams.forEach(m=>{
    const f=m.userData.src; m.visible=f.hp>0;
    set(m, f.x+f.w/2, f.y+f.h/2, f.hp<=0, 0);
    if(f.hp===1) m.scale.setScalar(0.7);
  });
  playMeshes.sparks.forEach(m=>{
    const s=m.userData.src; m.visible=!!s.alive;
    if(s.alive){ set(m,s.x,s.y,false, Math.sin(play.t*6)*0.08); m.rotation.y+=dt; }
  });
  playMeshes.huhus.forEach(m=>{
    const h=m.userData.src; set(m,h.x,h.y,false, Math.sin(play.t*1.6)*0.05);
    m.scale.setScalar(h.reloc?0.85:1);
  });
  playMeshes.items.forEach(m=>{ const it=m.userData.src; m.visible=!it.got; if(!it.got){ set(m,it.x,it.y,false, 0.05+Math.sin(play.t*3)*0.06); m.rotation.y+=dt; }});
  playMeshes.valves.forEach(m=>{ const v=m.userData.src; set(m,v.x,v.y,false,0); if(v.on) m.rotation.y+=dt*2; });
  playMeshes.leaks.forEach(m=>{
    const lk=m.userData.src; set(m,lk.x,lk.y,false,0);
    if(m.userData.puff) m.userData.puff.visible=!lk.closed;
  });
  playMeshes.cores.forEach(m=>{
    const c=m.userData.src; set(m,c.x,c.y,false,0);
    m.rotation.y += c.solved? dt*0.2 : dt;
  });
  playMeshes.wheels.forEach(m=>{
    const wh=m.userData.src; set(m,wh.x,wh.y,false,0);
    if(m.userData.wheel && wh.running) m.userData.wheel.rotation.x += dt*2.4;
  });
  playMeshes.pals.forEach(m=>{ const pal=m.userData.src; set(m,pal.x,pal.y,false,0); });
  playMeshes.solids.forEach(m=>{
    const s=m.userData.solid;
    if(s && s.kind==="gate"){
      m.visible = s.w>1 && s.h>1;
    }
  });
  playMeshes.foamFX.forEach(fx=>{
    fx.t-=dt; fx.mesh.scale.addScalar(dt*1.8); fx.mesh.material.opacity=Math.max(0, fx.t/0.35*0.7);
    if(fx.t<=0){ playRoot.remove(fx.mesh); fx.dead=true; }
  });
  playMeshes.foamFX=playMeshes.foamFX.filter(fx=>!fx.dead);

  if(playMeshes.hint){
    const show = play.trailOn || (play.hintTarget && play.t<play.hintUntil);
    const tgt = play.hintTarget || (play.trailOn? nextTarget():null);
    if(show && tgt){
      playMeshes.hint.visible=true;
      const p=to3(tgt.x, tgt.y);
      playMeshes.hint.position.set(p.x, 1.2+Math.sin(play.t*4)*0.15, p.z);
    }else playMeshes.hint.visible=false;
  }

  // camera follow, 45-degree third person, yaw/zoom adjustable
  const focus=active();
  const fp=to3(focus.x, focus.y);
  const dist=8.2*camZoom;
  const elev=0.62;
  const yaw=camYaw;
  const cx=fp.x + Math.sin(yaw)*dist;
  const cz=fp.z + Math.cos(yaw)*dist;
  const cy=fp.y + dist*0.72 + 1.2;
  if(!playCam.userData.ready){
    playCam.position.set(cx,cy,cz); playCam.userData.ready=true;
  }else{
    playCam.position.lerp(new THREE.Vector3(cx,cy,cz), 1-Math.pow(0.001, dt));
  }
  playCam.lookAt(fp.x, 0.8, fp.z);
}

function animateTitle(t){
  if(!titleRig) return;
  titleRig.rotation.y = Math.sin(t*0.35)*0.25;
  const L=titleRig.userData.lili, D=titleRig.userData.dong;
  if(L){ L.position.y=Math.sin(t*2)*0.03; const pr=L.userData.parts||{}; if(pr.tail) pr.tail.rotation.y=Math.sin(t*3)*0.25; }
  if(D){ D.position.y=Math.sin(t*2+1)*0.04; }
}
function animateCabin(t){
  if(!cabinRig) return;
  cabinRig.children.forEach((m,i)=>{
    const ph=m.userData.phase||0;
    const sp=m.userData.spin||0.4;
    m.position.x=Math.cos(ph+t*sp)*1.6;
    m.position.z=1.2+Math.sin(ph+t*sp)*1.1;
    m.rotation.y=ph+t*sp+Math.PI;
  });
}

function renderFrame(t){
  if(!renderer||!gfxReady) return;
  const sc=currentScene(), cam=currentCam();
  if(!sc||!cam) return;
  if(screen==="title") animateTitle(t);
  if(screen==="cabin") animateCabin(t);
  if(screen==="brief" && briefScene) briefScene.rotation.y=Math.sin(t*0.2)*0.05;
  renderer.render(sc, cam);
}


/* ---------- input, loop, boot ---------- */
function bindStick(){
  const wrap=$("stick-wrap"), knob=$("stick-knob"), base=$("stick-base");
  if(!wrap) return;
  const set = (cx, cy)=>{
    const r=base.getBoundingClientRect();
    const x=cx-(r.left+r.width/2), y=cy-(r.top+r.height/2);
    const mag=Math.hypot(x,y), max=r.width*0.5-10;
    const nx=max?x/max:0, ny=max?y/max:0;
    const m=Math.hypot(nx,ny);
    stick.dx = m>1? nx/m : nx;
    stick.dy = m>1? ny/m : ny;
    stick.active=true;
    const kx=(m>1?nx/m:nx)*40, ky=(m>1?ny/m:ny)*40;
    knob.style.left=(40+kx)+"px"; knob.style.top=(40+ky)+"px";
  };
  const end=()=>{ stick.dx=0; stick.dy=0; stick.active=false; knob.style.left="40px"; knob.style.top="40px"; };
  const pid= {id:null};
  wrap.addEventListener("pointerdown", ev=>{ ev.preventDefault(); wrap.setPointerCapture(ev.pointerId); pid.id=ev.pointerId; set(ev.clientX, ev.clientY); }, {passive:false});
  wrap.addEventListener("pointermove", ev=>{ if(pid.id===ev.pointerId) set(ev.clientX, ev.clientY); }, {passive:false});
  const up=ev=>{ if(pid.id===ev.pointerId || ev.type==="pointercancel"){ pid.id=null; end(); } };
  wrap.addEventListener("pointerup", up); wrap.addEventListener("pointercancel", up);
  wrap.addEventListener("contextmenu", ev=>ev.preventDefault());
}

function bindKeys(){
  window.addEventListener("keydown", ev=>{
    keys[ev.key]=true;
    if(ev.key===" " || ev.code==="Space"){ ev.preventDefault(); if(screen==="play") useTool(); }
    if(ev.key==="e"||ev.key==="E"||ev.key==="c"||ev.key==="C"){ if(screen==="play") callDong(); }
    if(ev.key==="Tab"){ ev.preventDefault(); if(screen==="play") switchWho(); }
    if(ev.key==="Escape"){ if(screen==="play" && !play.won){ paused=!paused; showOv("ov-pause", paused); } }
  });
  window.addEventListener("keyup", ev=>{ keys[ev.key]=false; });
}

function openClockout(){
  persist();
  const n=Object.keys(save.completed||{}).length;
  $("clockout-msg").textContent = n
    ? ("今天已值完 "+n+" 則。進度已存在這臺 iPad 裡。隨時還可以再進來繼續值，不會鎖住當天。")
    : "還沒值完一則也沒關係。進度已存，隨時可以再進來。";
  showScreen("clockout");
}

function openHelp(from){
  helpFrom=from||screen;
  showScreen("help");
}

function bindUI(){
  $("btn-start").addEventListener("click", ()=>{
    if(!Object.keys(save.completed||{}).length){ /* fresh or keep */ }
    renderCabin();
  });
  $("btn-continue").addEventListener("click", ()=> renderCabin());
  $("btn-howto-title").addEventListener("click", ()=> openHelp("title"));
  $("btn-howto-cabin").addEventListener("click", ()=> openHelp("cabin"));
  $("btn-help-close").addEventListener("click", ()=>{
    if(helpFrom==="cabin") renderCabin(); else if(helpFrom==="play") showScreen("play"); else showTitle();
  });
  $("btn-board").addEventListener("click", ()=> openBoard(save.lastMap && mapUnlocked(save.lastMap)? save.lastMap : "creek"));
  $("btn-board-back").addEventListener("click", ()=> renderCabin());
  $("btn-board-map").addEventListener("click", ()=> renderCabin());
  $("btn-brief-back").addEventListener("click", ()=> openBoard(briefMission? briefMission.map : save.lastMap));
  $("btn-depart").addEventListener("click", ()=>{ if(briefMission) startMission(briefMission.id); });
  document.querySelectorAll("#diff-seg button").forEach(b=>{
    b.addEventListener("click", ()=> setDifficulty(b.dataset.diff));
  });
  document.querySelectorAll("[data-briefdiff]").forEach(b=>{
    b.addEventListener("click", ()=> setDifficulty(b.dataset.briefdiff));
  });
  $("btn-hints").addEventListener("click", ()=>{
    save.hints=!save.hints; persist(); applyDiffUI();
  });
  $("btn-night").addEventListener("click", ()=>{
    if(save.difficulty!=="tight"){ toast("夜間加更是加緊檔的加難選項，先切到加緊即可開啟。"); return; }
    save.nightExtra=!save.nightExtra; persist(); applyDiffUI();
  });
  $("btn-swap-player").addEventListener("click", ()=>{
    save.currentPlayer = save.currentPlayer==="A"?"B":"A";
    persist(); applyDiffUI();
    $("cabin-title").textContent = "風信谷值班小屋・" + playerName();
    toast("改由"+playerName()+"值同一班");
  });
  $("btn-clockout").addEventListener("click", openClockout);
  $("btn-clockout-ok").addEventListener("click", showTitle);
  $("btn-clockout-more").addEventListener("click", ()=> renderCabin());
  $("btn-use").addEventListener("click", useTool);
  $("btn-call").addEventListener("click", callDong);
  $("who-btn").addEventListener("click", ()=> switchWho());
  $("btn-pause").addEventListener("click", ()=>{ if(!play||play.won) return; paused=true; showOv("ov-pause", true); });
  $("btn-resume").addEventListener("click", ()=>{ paused=false; showOv("ov-pause", false); });
  $("btn-abandon").addEventListener("click", ()=>{ paused=false; showOv("ov-pause", false); play=null; renderCabin(); });
  $("btn-retry").addEventListener("click", retryMission);
  $("btn-asleep-cabin").addEventListener("click", ()=>{ showOv("ov-asleep", false); play=null; renderCabin(); });
  $("btn-done-cabin").addEventListener("click", ()=>{ showOv("ov-done", false); play=null; renderCabin(); });
  $("btn-core-close").addEventListener("click", closeCore);
  $("cam-in").addEventListener("click", ()=>{ camZoom=clamp(camZoom*0.86, 0.65, 1.6); });
  $("cam-out").addEventListener("click", ()=>{ camZoom=clamp(camZoom*1.16, 0.65, 1.6); });
  $("cam-left").addEventListener("click", ()=>{ camYaw -= 0.25; });
  $("cam-right").addEventListener("click", ()=>{ camYaw += 0.25; });
}

function loop(ts){
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, lastTs? (ts-lastTs)/1000 : 0.016);
  lastTs=ts;
  const t=(clock? clock.getElapsedTime() : ts/1000);
  if(screen==="play" && play) updatePlay(dt);
  renderFrame(t);
}

function runSelfTest(){
  const lines=[];
  const typ=typographySelfCheck();
  lines.push(VERSION);
  lines.push("typography " + (typ.ok?"OK":"FAIL"));
  lines.push("DONG "+JSON.stringify(typ.DONG)+" "+[...typ.DONG].map(c=>"U+"+c.codePointAt(0).toString(16).toUpperCase()).join(" "));
  lines.push("CORE "+typ.CORE+" U+"+typ.CORE.codePointAt(1).toString(16).toUpperCase());
  lines.push("SLEEP "+typ.SLEEP_WORD);
  lines.push("SNEAK "+typ.SNEAK_TASK);
  lines.push("CABLE "+typ.MAP_CABLE);
  lines.push("TITLE "+typ.TITLE);
  lines.push("missions "+MISSIONS.length);
  lines.push("maps open "+MAPS.filter(m=>!m.lockedV1 && !m.hut).map(m=>m.name).join("、"));
  const forbidden=["徒徒","哇哇","打喔","打嗇","纛車","哨哨"];
  const blob=document.documentElement.innerText + JSON.stringify(MISSIONS);
  forbidden.forEach(w=>{ if(blob.includes(w)) lines.push("FORBIDDEN "+w); });
  const types=new Set(); MISSIONS.forEach(m=>m.types.forEach(t=>types.add(t)));
  lines.push("types "+[...types].join(","));
  const out=$("selftest-out");
  if(location.search.includes("selftest")){
    out.style.display="block"; out.textContent=lines.join("\n");
  }
  console.log(lines.join("\n"));
  return typ.ok && MISSIONS.length===20;
}

function boot(){
  try{
    if(typeof THREE==="undefined"){ throw new Error("THREE missing"); }
    loadSave();
    bindUI();
    bindStick();
    bindKeys();
    try{ initRenderer(); }
    catch(err){
      console.error(err);
      toast("這臺裝置暫時沒有立體畫面，請改用 iPad 的 Safari 開啟。", 4000);
    }
    showTitle();
    applyDiffUI();
    const params=new URLSearchParams(location.search);
    const shot=params.get("shot");
    if(shot==="cabin"){ setTimeout(()=>renderCabin(), 200); }
    else if(shot==="board"){ setTimeout(()=>{ renderCabin(); openBoard(params.get("map")||"creek"); }, 200); }
    else if(shot==="brief"){ setTimeout(()=>{ openBrief(params.get("mission")||"creek-1"); }, 200); }
    else if(shot==="play"){ setTimeout(()=>{
      const mid=params.get("mission")||"creek-1";
      const ms=MISSION_BY_ID[mid];
      if(ms && !mapUnlocked(ms.map)){
        const order=["creek","greenhouse","cable","mill"];
        for(const id of order){
          if(id===ms.map) break;
          MAP_MISSIONS(id).forEach(m=>{ save.completed[m.id]={at:1,shot:true}; });
        }
      }
      startMission(mid);
    }, 300); }
    else if(shot==="clockout"){ setTimeout(()=>openClockout(), 200); }
    const ok=runSelfTest();
    if(!ok) console.warn("self-check failed");
    requestAnimationFrame(loop);
    if("serviceWorker" in navigator && location.protocol==="https:"){
      navigator.serviceWorker.register("sw.js?v=2").catch(()=>{});
    }
  }catch(err){
    console.error("boot failed", err);
    const el=$("toast"); if(el){ el.textContent="遊戲啟動時出了一點狀況，請重新整理。"; el.classList.add("on"); }
  }
}

window.addEventListener("load", boot);
