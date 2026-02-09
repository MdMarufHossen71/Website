const boardEl=document.getElementById('board');let turn='w',sel=null,moves=[];const P={r:'♜',n:'♞',b:'♝',q:'♛',k:'♚',p:'♟',R:'♖',N:'♘',B:'♗',Q:'♕',K:'♔',P:'♙'};
let b=[['r','n','b','q','k','b','n','r'],['p','p','p','p','p','p','p','p'],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['P','P','P','P','P','P','P','P'],['R','N','B','Q','K','B','N','R']];
const inb=(r,c)=>r>=0&&c>=0&&r<8&&c<8,isW=p=>p&&p===p.toUpperCase();
function legal(r,c){const p=b[r][c];if(!p)return[];const w=isW(p);if((w?'w':'b')!==turn)return[];const out=[];const add=(rr,cc)=>inb(rr,cc)&&(!b[rr][cc]||isW(b[rr][cc])!==w)&&out.push([rr,cc]);
if(p.toLowerCase()==='p'){const dir=w?-1:1; if(!b[r+dir]?.[c]) add(r+dir,c); for(const dc of [-1,1]) if(inb(r+dir,c+dc)&&b[r+dir][c+dc]&&isW(b[r+dir][c+dc])!==w) out.push([r+dir,c+dc]);}
if(p.toLowerCase()==='n') [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>add(r+dr,c+dc));
const slide=(dirs)=>dirs.forEach(([dr,dc])=>{let rr=r+dr,cc=c+dc;while(inb(rr,cc)){if(!b[rr][cc])out.push([rr,cc]);else{if(isW(b[rr][cc])!==w)out.push([rr,cc]);break;}rr+=dr;cc+=dc;}});
if(p.toLowerCase()==='b')slide([[-1,-1],[-1,1],[1,-1],[1,1]]); if(p.toLowerCase()==='r')slide([[-1,0],[1,0],[0,-1],[0,1]]); if(p.toLowerCase()==='q')slide([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]); if(p.toLowerCase()==='k')[-1,0,1].forEach(dr=>[-1,0,1].forEach(dc=>{if(dr||dc)add(r+dr,c+dc);}));
return out;}
function draw(){boardEl.innerHTML='';turnEl.textContent=`Turn: ${turn==='w'?'White':'Black'}`;for(let r=0;r<8;r++)for(let c=0;c<8;c++){const s=document.createElement('button');s.className='sq '+((r+c)%2?'d':'l');if(moves.some(m=>m[0]===r&&m[1]===c))s.classList.add('hi');s.textContent=P[b[r][c]]||'';s.onclick=()=>click(r,c);boardEl.appendChild(s);}}
const turnEl=document.getElementById('turn');
function click(r,c){if(sel&&moves.some(m=>m[0]===r&&m[1]===c)){b[r][c]=b[sel[0]][sel[1]];b[sel[0]][sel[1]]='';sel=null;moves=[];turn=turn==='w'?'b':'w';draw();return;}sel=[r,c];moves=legal(r,c);draw();}
draw();