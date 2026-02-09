const grid=document.getElementById('grid'),msg=document.getElementById('msg');let puzzle=[];
for(let i=0;i<81;i++){const el=document.createElement('input');el.maxLength=1;el.inputMode='numeric';el.addEventListener('input',()=>validateCell(i));grid.appendChild(el);}const cells=[...grid.children];
const idx=(r,c)=>r*9+c;
function valid(b,r,c,n){for(let i=0;i<9;i++)if(b[idx(r,i)]===n||b[idx(i,c)]===n)return false;const br=Math.floor(r/3)*3,bc=Math.floor(c/3)*3;for(let rr=br;rr<br+3;rr++)for(let cc=bc;cc<bc+3;cc++)if(b[idx(rr,cc)]===n)return false;return true;}
function solve(b){for(let i=0;i<81;i++)if(!b[i]){const r=Math.floor(i/9),c=i%9;for(let n=1;n<=9;n++)if(valid(b,r,c,n)){b[i]=n;if(solve(b))return true;b[i]=0;}return false;}return true;}
function gen(){let b=Array(81).fill(0);solve(b); // solved seed
for(let k=0;k<46;k++){const i=Math.floor(Math.random()*81);b[i]=0;}puzzle=b;render();msg.textContent='Generated puzzle';}
function render(){cells.forEach((c,i)=>{c.value=puzzle[i]||'';c.classList.toggle('fixed',!!puzzle[i]);c.readOnly=!!puzzle[i];c.classList.remove('bad');});}
function readBoard(){return cells.map(c=>+c.value||0);} 
function validateCell(i){const b=readBoard();const v=b[i];cells[i].classList.remove('bad');if(!v)return;const r=Math.floor(i/9),c=i%9;b[i]=0;if(!valid(b,r,c,v))cells[i].classList.add('bad');}
document.getElementById('gen').onclick=gen;document.getElementById('solve').onclick=()=>{const b=readBoard();if(solve(b)){cells.forEach((c,i)=>c.value=b[i]);msg.textContent='Solved with backtracking';}else msg.textContent='No solution';};gen();