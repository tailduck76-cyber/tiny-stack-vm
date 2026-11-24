// Tiny stack VM: 32-bit wrapping ints, 256 stack, 256 mem, traps 2-11; answers every instance.
import{mkdirSync,readFileSync,readdirSync,writeFileSync}from'node:fs';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function run(p:Buffer,q:Buffer){
 const s=new Int32Array(256),m=new Int32Array(256),k=new Int32Array(64),o:number[]=[];
 let sp=0,kp=0,pc=0,ip=0,st=0;
 const F=(e:number)=>({o:Buffer.from(o),e});
 const J=()=>((p[pc]|p[pc+1]<<8)<<16)>>16;
 for(;;){
  if(st>=1e6)return F(10);
  if(pc<0||pc>=p.length)return F(9);
  const op=p[pc++];st++;
  switch(op){
  case 0:return F(0);
  case 1:
   if(pc>=p.length)return F(9);
   if(sp>=256)return F(3);
   s[sp++]=(p[pc++]<<24)>>24;break;
  case 2:
   if(pc+4>p.length)return F(9);
   if(sp>=256)return F(3);
   s[sp++]=p[pc]|p[pc+1]<<8|p[pc+2]<<16|p[pc+3]<<24;pc+=4;break;
  case 3:if(sp<1)return F(2);sp--;break;
  case 4:
   if(sp<1)return F(2);
   if(sp>=256)return F(3);
   s[sp]=s[sp-1];sp++;break;
  case 5:{
   if(sp<2)return F(2);
   const t=s[sp-1];s[sp-1]=s[sp-2];s[sp-2]=t;break}
  case 6:
   if(sp<2)return F(2);
   if(sp>=256)return F(3);
   s[sp]=s[sp-2];sp++;break;
  case 7:{
   if(sp<3)return F(2);
   const a=s[sp-3];s[sp-3]=s[sp-2];s[sp-2]=s[sp-1];s[sp-1]=a;break}
  case 0x10:if(sp<2)return F(2);s[sp-2]=(s[sp-2]+s[sp-1])|0;sp--;break;
  case 0x11:if(sp<2)return F(2);s[sp-2]=(s[sp-2]-s[sp-1])|0;sp--;break;
  case 0x12:if(sp<2)return F(2);s[sp-2]=Math.imul(s[sp-2],s[sp-1]);sp--;break;
  case 0x13:{
   if(sp<2)return F(2);
   const b=s[sp-1];if(!b)return F(4);
   s[sp-2]=(s[sp-2]/b)|0;sp--;break}
  case 0x14:{
   if(sp<2)return F(2);
   const b=s[sp-1];if(!b)return F(4);
   s[sp-2]=s[sp-2]%b|0;sp--;break}
  case 0x15:{
   if(sp<2)return F(2);
   const b=s[sp-1];if(!b)return F(4);
   s[sp-2]=((s[sp-2]>>>0)/(b>>>0))|0;sp--;break}
  case 0x16:{
   if(sp<2)return F(2);
   const b=s[sp-1];if(!b)return F(4);
   s[sp-2]=((s[sp-2]>>>0)%(b>>>0))|0;sp--;break}
  case 0x17:if(sp<1)return F(2);s[sp-1]=(-s[sp-1])|0;break;
  case 0x18:if(sp<2)return F(2);s[sp-2]=s[sp-2]&s[sp-1];sp--;break;
  case 0x19:if(sp<2)return F(2);s[sp-2]=s[sp-2]|s[sp-1];sp--;break;
  case 0x1a:if(sp<2)return F(2);s[sp-2]=s[sp-2]^s[sp-1];sp--;break;
  case 0x1b:if(sp<1)return F(2);s[sp-1]=~s[sp-1];break;
  case 0x1c:if(sp<2)return F(2);s[sp-2]=s[sp-2]<<s[sp-1];sp--;break;
  case 0x1d:if(sp<2)return F(2);s[sp-2]=s[sp-2]>>s[sp-1];sp--;break;
  case 0x1e:if(sp<2)return F(2);s[sp-2]=(s[sp-2]>>>s[sp-1])|0;sp--;break;
  case 0x20:if(sp<2)return F(2);s[sp-2]=s[sp-2]===s[sp-1]?1:0;sp--;break;
  case 0x21:if(sp<2)return F(2);s[sp-2]=s[sp-2]<s[sp-1]?1:0;sp--;break;
  case 0x22:if(sp<2)return F(2);s[sp-2]=(s[sp-2]>>>0)<(s[sp-1]>>>0)?1:0;sp--;break;
  case 0x30:{
   if(pc+2>p.length)return F(9);
   const j=J();pc+=2+j;break}
  case 0x31:{
   if(pc+2>p.length)return F(9);
   if(sp<1)return F(2);
   const j=J(),v=s[--sp];pc+=2;if(!v)pc+=j;break}
  case 0x32:{
   if(pc+2>p.length)return F(9);
   if(sp<1)return F(2);
   const j=J(),v=s[--sp];pc+=2;if(v)pc+=j;break}
  case 0x33:{
   if(pc+2>p.length)return F(9);
   if(kp>=64)return F(7);
   const t=p[pc]|p[pc+1]<<8;pc+=2;k[kp++]=pc;pc=t;break}
  case 0x34:if(kp<1)return F(8);pc=k[--kp];break;
  case 0x40:{
   if(sp<1)return F(2);
   const a=s[sp-1];if(a<0||a>255)return F(6);
   s[sp-1]=m[a];break}
  case 0x41:{
   if(sp<2)return F(2);
   const a=s[--sp],v=s[--sp];if(a<0||a>255)return F(6);
   m[a]=v;break}
  case 0x50:{
   if(sp<1)return F(2);
   const t=s[--sp]+'';
   if(o.length+t.length>65536)return F(11);
   for(const c of t)o.push(c.charCodeAt(0));
   break}
  case 0x51:
   if(sp<1)return F(2);
   if(o.length>=65536)return F(11);
   o.push(s[--sp]&255);break;
  case 0x52:
   if(sp>=256)return F(3);
   s[sp++]=ip<q.length?q[ip++]:-1;break;
  case 0x53:if(sp<1)return F(2);return F(s[--sp]&255);
  default:return F(5);
  }
 }
}
for(const id of readdirSync(I).sort()){
 const d=O+'/'+id;mkdirSync(d,{recursive:true});
 try{
  const r=run(readFileSync(I+'/'+id+'/program.bin'),readFileSync(I+'/'+id+'/input.bin'));
  writeFileSync(d+'/stdout.bin',r.o);
  writeFileSync(d+'/exit.txt',r.e+'\n');
 }catch{
  writeFileSync(d+'/stdout.bin','');
  writeFileSync(d+'/exit.txt','0\n');
 }
}
