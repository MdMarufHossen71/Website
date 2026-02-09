const G=8,C=['#f43f5e','#22c55e','#3b82f6','#eab308','#a855f7','#14b8a6'];let b=[],sel=null,score=0;
const grid=document.getElementById('grid'), scoreEl=document.getElementById('score');
function rand(){return Math.floor(Math.random()*C.length)}
function init(){b=Array.from({length:G},()=>Array.from({length:G},rand));cleanStart();render();}
function cleanStart(){while(find().length) collapse(find());}
function render(){grid.innerHTML='';for(let r=0;r<G;r++)for(let c=0;c<G;c++){const t=document.createElement('button');t.className='tile';t.style.background=C[b[r][c]];if(sel&&sel[0]===r&&sel[1]===c)t.classList.add('sel');t.onclick=()=>pick(r,c);grid.appendChild(t);}scoreEl.textContent=score;}
function adj(a,b){return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])===1;}
function swap(a,bp){[b[a[0]][a[1]],b[bp[0]][bp[1]]]=[b[bp[0]][bp[1]],b[a[0]][a[1]]];}
function pick(r,c){if(!sel){sel=[r,c];return render();}if(!adj(sel,[r,c])){sel=[r,c];return render();}swap(sel,[r,c]);let m=find();if(!m.length){swap(sel,[r,c]);sel=null;return render();}do{score+=m.length*10;collapse(m);m=find();}while(m.length);sel=null;render();}
function find(){const out=[];for(let r=0;r<G;r++){let n=1;for(let c=1;c<=G;c++){if(c<G&&b[r][c]===b[r][c-1])n++;else{if(n>=3)for(let k=0;k<n;k++)out.push([r,c-1-k]);n=1;}}}for(let c=0;c<G;c++){let n=1;for(let r=1;r<=G;r++){if(r<G&&b[r][c]===b[r-1][c])n++;else{if(n>=3)for(let k=0;k<n;k++)out.push([r-1-k,c]);n=1;}}}return [...new Set(out.map(x=>x.join(',')))].map(s=>s.split(',').map(Number));}
function collapse(m){m.forEach(([r,c])=>b[r][c]=-1);for(let c=0;c<G;c++){let col=[];for(let r=G-1;r>=0;r--)if(b[r][c]!==-1)col.push(b[r][c]);for(let r=G-1;r>=0;r--)b[r][c]=col[G-1-r]??rand();}}
init();