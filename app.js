
// Navigation
function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nbtn').forEach(function(b){b.classList.remove('active');});
  document.getElementById(id).classList.add('active');
  document.getElementById('nav-'+id).classList.add('active');
  window.scrollTo(0,0);
}

// Week toggle
function tw(n) {
  var b=document.getElementById('wb'+n), c=document.getElementById('chv'+n);
  var open=b.style.display!=='none';
  b.style.display=open?'none':'block';
  c.textContent=open?'▼':'▲';
  if(!open)loadChks(n);
}

// Checkboxes — called via onchange='sv(this.id,this.checked)'
function sv(id,v) {
  try { localStorage.setItem(id,v?'1':''); } catch(e){}
  updateProgress();
}
function loadChks(n) {
  document.querySelectorAll('#wb'+n+' .dc').forEach(function(c){
    try { if(localStorage.getItem(c.id)==='1') c.checked=true; } catch(e){}
  });
}
function updateProgress() {
  var all=document.querySelectorAll('.dc').length, done=0;
  document.querySelectorAll('.dc').forEach(function(c){
    try { if(localStorage.getItem(c.id)==='1') done++; } catch(e){}
  });
  var pct=all?Math.round(done/all*100):0;
  ['prog-pct','prog-pct2'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.textContent=pct+'%';
  });
  ['prog-bar','prog-bar2'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.style.width=pct+'%';
  });
  for(var w=1;w<=12;w++){
    var wcs=document.querySelectorAll('[id^="c-w'+w+'-"]'), wd=0;
    wcs.forEach(function(c){try{if(localStorage.getItem(c.id)==='1')wd++;}catch(e){}});
    var wp=document.getElementById('wp'+w);
    if(wp&&wcs.length) wp.textContent='('+wd+'/'+wcs.length+')';
  }
}
function loadAllChks(){for(var w=1;w<=12;w++)loadChks(w); updateProgress();}

// Tab switchers
function showTk(id,el){
  document.querySelectorAll('.tkc').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.tktab').forEach(function(t){t.classList.remove('active');});
  document.getElementById(id).classList.add('active'); el.classList.add('active');
}
function showMore(id,el){
  document.querySelectorAll('.mkc').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.mktab').forEach(function(t){t.classList.remove('active');});
  document.getElementById(id).classList.add('active'); el.classList.add('active');
}
function showCloud(id,el){
  document.querySelectorAll('.cc').forEach(function(c){c.classList.remove('active');});
  document.querySelectorAll('.ctab').forEach(function(c){c.classList.remove('active');});
  document.getElementById(id).classList.add('active'); el.classList.add('active');
}

// Search
function fc(){
  var q=document.getElementById('lsrch').value.toLowerCase();
  document.querySelectorAll('.ci').forEach(function(el){
    el.style.display=el.dataset.k.includes(q)?'block':'none';
  });
}

// Dark mode
function toggleDark(){
  document.body.classList.toggle('dark');
  var on=document.body.classList.contains('dark');
  try{localStorage.setItem('dark',on?'1':'');}catch(e){}
  document.getElementById('dark-btn').textContent=on?'☀️ Light':'🌙 Dark';
}

// Pomodoro — bound via addEventListener (no inline onclick)
var pomSec=25*60, pomRunning=false, pomInterval=null, pomWork=true;
function pomFmt(s){var m=Math.floor(s/60),sc=s%60; return (m<10?'0':'')+m+':'+(sc<10?'0':'')+sc;}
function pomTick(){
  pomSec--;
  document.getElementById('pom-disp').textContent=pomFmt(pomSec);
  if(pomSec<=0){
    clearInterval(pomInterval); pomRunning=false;
    pomWork=!pomWork; pomSec=pomWork?25*60:5*60;
    document.getElementById('pom-lbl').textContent=pomWork?'Focus Session':'Break Time';
    document.getElementById('pom-disp').textContent=pomFmt(pomSec);
    try{if('vibrate' in navigator)navigator.vibrate([300,100,300]);}catch(e){}
  }
}
function pomStart(){if(!pomRunning){pomRunning=true; pomInterval=setInterval(pomTick,1000);}}
function pomPause(){if(pomRunning){clearInterval(pomInterval); pomRunning=false;}}
function pomReset(){
  clearInterval(pomInterval); pomRunning=false; pomWork=true; pomSec=25*60;
  document.getElementById('pom-disp').textContent=pomFmt(pomSec);
  document.getElementById('pom-lbl').textContent='Focus Session';
}

// Today widget
function getTodayStudy(){
  var start=new Date('2026-03-11'), today=new Date();
  var diff=Math.floor((today-start)/(86400000));
  if(diff<0||diff>83) return null;
  var topics=[
    ['Mon','Linux File System','Python Variables'],
    ['Tue','Linux Permissions','Python Control Flow'],
    ['Wed','Linux User Mgmt','Python Functions'],
    ['Thu','Linux Packages','Python Lists / Dicts'],
    ['Fri','Linux Processes','Python Modules + Claude track (Fri eve)'],
    ['Sat','PROJECT DAY','Build something with this week skills'],
    ['Sun','REST DAY','No study — recharge for Monday']
  ];
  var wd=today.getDay(), wk=Math.floor(diff/7)+1;
  var day=topics[wd===0?6:wd-1];
  return {wk:wk, day:day[0], morning:day[1], evening:day[2]};
}

// Init
window.addEventListener('load', function(){
  // Dark mode
  try{if(localStorage.getItem('dark')==='1'){document.body.classList.add('dark'); document.getElementById('dark-btn').textContent='☀️ Light';}}catch(e){}

  // Pomodoro buttons — safe addEventListener binding
  var ps=document.getElementById('pom-start');
  var pp=document.getElementById('pom-pause');
  var pr=document.getElementById('pom-reset');
  if(ps) ps.addEventListener('click', pomStart);
  if(pp) pp.addEventListener('click', pomPause);
  if(pr) pr.addEventListener('click', pomReset);

  // Load checkboxes
  loadAllChks();

  // Today widget
  var t=getTodayStudy(), tw=document.getElementById('today-widget');
  if(t && tw){
    tw.innerHTML='<div class="today-box"><h3>Today — Week '+t.wk+', '+t.day+'</h3>'+
      '<div class="today-item">Morning (7-8AM): '+t.morning+'</div>'+
      '<div class="today-item">Evening (8-9:30PM): '+t.evening+'</div></div>';
  }

  // Service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').catch(function(){});
  }
});
