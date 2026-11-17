const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ink='#e9e5d8', brass='#d7b782', green='#8ae4d0', muted='#a3b9b1';
const label=(x,y,value,size=14,color=muted,extra='')=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" fill="'+color+'" '+extra+'>'+esc(value)+'</text>';
const point=(radius,angle)=>[radius*Math.cos(angle),radius*Math.sin(angle)].map(n=>n.toFixed(2)).join(' ');
function gear(x,y,r,teeth,rotation=0,color=brass) {
  const points=[];
  for(let i=0;i<teeth;i++) for(const [phase,scale] of [[0,.84],[.18,.84],[.26,1],[.68,1],[.76,.84]]) points.push(point(r*scale,(i+phase)*Math.PI*2/teeth));
  const spokes=Array.from({length:6},(_,i)=>'<path d="M'+point(r*.25,i*Math.PI/3)+'L'+point(r*.68,i*Math.PI/3)+'" stroke="'+color+'" stroke-width="'+r*.09+'"/>').join('');
  return '<g transform="translate('+x+' '+y+') rotate('+rotation+')"><polygon points="'+points.join(' ')+'" fill="#182d2b" stroke="'+color+'" stroke-width="1.4"/><circle r="'+r*.69+'" fill="#0c1d1d" stroke="'+color+'" stroke-width="1"/>'+spokes+'<circle r="'+r*.26+'" fill="#132d2a" stroke="'+color+'" stroke-width="1.5"/><circle r="'+r*.09+'" fill="'+color+'"/></g>';
}
function mechanism(x,y,scale=1){
  let ticks='';
  for(let i=0;i<60;i++){
    const a=i*Math.PI/30;
    ticks+='<path d="M'+point(i%5===0?132:140,a)+'L'+point(146,a)+'" stroke="'+(i%5===0?brass:'#567772')+'" stroke-width="'+(i%5===0?2:1)+'"/>';
  }
  return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+
  '<circle r="157" fill="url(#aura)"/><circle r="152" fill="none" stroke="#47635b"/>'+ticks+
  '<circle r="120" fill="none" stroke="#315953"/><circle r="115" fill="none" stroke="#c2a578" stroke-dasharray="1 7" opacity=".65"/>'+
  '<path d="M-152 0H-174M152 0H174M0-152V-174M0 152V174" stroke="'+brass+'"/>'+
  '<path d="M-113-78A137 137 0 0 1 99-94M-109 83A137 137 0 0 0 101 92" fill="none" stroke="'+green+'" stroke-width="2"/>'+
  gear(-23,12,75,20,4)+gear(62,-52,40,12,15,green)+gear(61,69,31,10,7)+
  '<path d="M-85-75L-57-96H28M-83 93H-28L-7 110H57" fill="none" stroke="#567772"/><circle cx="-85" cy="-75" r="3" fill="'+green+'"/><circle cx="57" cy="110" r="3" fill="'+green+'"/>'+
  '<circle cx="-23" cy="12" r="11" fill="'+green+'" opacity=".1"/>'+
  label(0,187,'IDEAS  /  CODE  /  CRAFT',10,brass,'text-anchor="middle" letter-spacing="2"')+'</g>';
}
export function hero(p,mobile=false){
  const w=mobile?480:960,h=mobile?604:450;
  let a='<defs><radialGradient id="aura"><stop stop-color="#244d44" stop-opacity=".65"/><stop offset="1" stop-color="#0d1e20" stop-opacity="0"/></radialGradient><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#6ea293" stroke-opacity=".065"/></pattern></defs>';
  a+='<rect width="'+w+'" height="'+h+'" rx="6" fill="#0d1e20"/><rect width="'+w+'" height="'+h+'" fill="url(#grid)"/>'+
  '<path d="M22 51V22H51M'+(w-51)+' 22H'+(w-22)+'V51M22 '+(h-51)+'V'+(h-22)+'H51M'+(w-51)+' '+(h-22)+'H'+(w-22)+'V'+(h-51)+'" fill="none" stroke="'+brass+'" stroke-width="1.3"/>';
  a+=label(42,52,'AMZ / CLOCKWORK ATELIER',mobile?12:14,brass,'letter-spacing="2"');
  a+='<path d="M42 69H'+(w-42)+'" stroke="#47635b"/>';
  if(mobile){
    a+=label(32,112,p.nameEn,31,ink,'font-family="Georgia,serif"')+label(33,143,p.name+'  /  @'+p.username,15,muted);
    a+=label(32,186,'コードを紡ぎ、仕組みをつくる。',19,ink)+mechanism(240,362,.87);
    a+=label(240,566,'PERSONAL PROJECTS & RESEARCH',11,muted,'text-anchor="middle" letter-spacing="1.4"');
  }else{
    a+=label(44,124,'ENGINEERING × IMAGINATION',12,green,'letter-spacing="2.4"')+
    label(41,191,p.nameEn,51,ink,'font-family="Georgia,serif"')+
    label(44,231,p.name+'   /   @'+p.username,18,muted)+
    '<path d="M44 261H104" stroke="'+brass+'" stroke-width="2"/>'+
    label(44,301,'コードを紡ぎ、仕組みをつくる。',25,ink)+
    label(44,337,'日常の困りごとから生まれた、開発と研究の記録。',16,muted)+mechanism(739,236,.88);
    a+=label(44,412,'PERSONAL PROJECTS & RESEARCH',12,brass,'letter-spacing="1.8"');
    a+=label(916,412,'GITHUB / AMZ-jpcslr',11,muted,'text-anchor="end"');
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" role="img" aria-labelledby="title"><title id="title">'+esc(p.name+' — Clockwork Atelier / コードを紡ぎ、仕組みをつくる。')+'</title>'+a+'</svg>\n';
}
export function divider(){
  return '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="38" viewBox="0 0 960 38" role="img" aria-label="歯車の区切り"><path d="M0 19H451M509 19H960" stroke="#819a89" stroke-width="1" opacity=".7"/>'+gear(480,19,15,12,0,'#b69a67')+'</svg>\n';
}
