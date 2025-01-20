var P=(s,e,t)=>{if(!e.has(s))throw TypeError("Cannot "+t)};var d=(s,e,t)=>(P(s,e,"read from private field"),t?t.call(s):e.get(s)),p=(s,e,t)=>{if(e.has(s))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(s):e.set(s,t)},W=(s,e,t,o)=>(P(s,e,"write to private field"),o?o.call(s,t):e.set(s,t),t);var f=(s,e,t)=>(P(s,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();var g,w,I,v,_,z,O,H,E,N,S,q;const j=class j{constructor(){p(this,w);p(this,_);p(this,O);p(this,E);p(this,S);p(this,g,{});p(this,v,new Map);this.id=j.raid(),this.root=null,this.args={},this.parent=null,this.child={},this.element={},this.key={}}main(e={}){}render(){return this.node("div")}init(){try{return this.root=this.render(),f(this,S,q).call(this,"id",this.element),this.main(this.args),this.root}catch(e){console.error(e)}}node(e="",t=[],o={},n=[],r){const a=r?document.createElementNS(r,e):document.createElement(e);return t.forEach(i=>{const u=typeof i;if(u==="string"){const c=document.createTextNode(i);if(a.append(c),!n||!n.includes(i))return;f(this,w,I).call(this,i,{node:c,type:0,parent:c.parentNode,clone:[]})}else a.append(u==="function"?i.bind(this)():i)}),Object.entries(o).forEach(([i,{keys:u,value:c}])=>{if(u&&u.forEach(l=>f(this,w,I).call(this,l,{node:a,type:2,name:i,map:c})),typeof c=="function"){const l=i.slice(2);i.startsWith("on")?a.addEventListener(l,f(this,O,H).call(this,a,l,c)):a.setAttribute(i,c())}else a.setAttribute(i,c)}),a}destroy(){f(this,_,z).call(this),Object.values(this.child).forEach(e=>e.destroy()),delete this.parent.child[this.id],this.root.remove()}component(e=null,t=[],o={}){if(e instanceof Object){const n=new e;return n.id=o.id||n.id,n.args={...o,child:t[0]},n.parent=this,this.child[n.id]=n,n.init()}}set(e="",t=""){const o=e.indexOf("++");e=e.replace("++","");const n=d(this,g)[e];if(!n)return;const r=typeof t=="function"?t():t;n.element.forEach(i=>{const u=i.node,c=i.parent||u.parentNode;if(i.type==0)t instanceof Element?(c.replaceChild(r,u),i.type=1,i.node=r):f(this,E,N).call(this,t)&&(u.nodeValue=o<0?r:o===0?r+u.nodeValue:u.nodeValue+r);else if(i.type==1){if(t instanceof Element)if(o!==-1){c.insertAdjacentElement(o==0?"afterbegin":"beforeend",r),i.clone.push(r);return}else c.replaceChild(r,u),i.node=r;else if(f(this,E,N).call(this,t)){const l=document.createTextNode(r);c.replaceChild(l,u),i.type=0,i.node=l}i.clone.forEach(l=>{l.remove()}),i.clone=[],u.remove(),f(this,_,z).call(this)}else if(i.type==2&&f(this,E,N).call(this,t)){let l=i.map,b=l.match(/\{[^{}\s]*\}/gm);b&&b.forEach(A=>{if(A===e)l=l.replace(A,r);else{const V=d(this,g)[A];V&&(l=l.replace(A,V.data))}}),u.setAttribute(i.name,l),d(this,g)[e].data=r}})}static raid(){return Math.random().toString(36).slice(6)}};g=new WeakMap,w=new WeakSet,I=function(e,t){if(!this.key[e]){const n=e.replace(/{|}/g,"");this.key[n]=(r,a)=>this.set(a?a.replace(/\w+/gm,e):e,r)}const o=d(this,g);o[e]||(o[e]={element:[],data:""}),o[e].element.push(t)},v=new WeakMap,_=new WeakSet,z=function(e=!1){for(const[t,o]of d(this,v))t.isConnected&&!e||(o.forEach(([n,r])=>t.removeEventListener(n,r)),d(this,v).delete(t))},O=new WeakSet,H=function(e,t,o){let n=o.bind(this),r=d(this,v).get(e)||[];return r.push([t,n]),d(this,v).set(e,r),n},E=new WeakSet,N=function(e){return["string","number","boolean","function"].includes(typeof e)},S=new WeakSet,q=function(e="id",t=this.element){this.root.querySelectorAll(`[${e}]`).forEach(o=>{t[o.getAttribute(e)]=o,o.setAttribute(e,j.raid())})};let m=j;new EventTarget;var h;class G{constructor(){p(this,h,new Map)}on(e,t){d(this,h).has(e)||d(this,h).set(e,[]),d(this,h).get(e).push(t)}off(e,t){d(this,h).has(e)&&d(this,h).set(e,d(this,h).get(e).filter(o=>o!==t))}emit(e,...t){d(this,h).has(e)&&d(this,h).get(e).forEach(o=>o(...t))}once(e,t){const o=(...n)=>{this.off(e,o),t(...n)};this.on(e,o)}clear(e){d(this,h).has(e)&&(d(this,h).delete(e),console.warn(`Event ${e} cleared`))}clearAll(){d(this,h).clear(),console.warn("Event handler cleared")}}h=new WeakMap;const y=new G;console.warn("Event handler initialized");var x,M;class Y extends m{constructor(){super();p(this,x)}render(){return this.node("div",[this.node("label",[this.args.title||"Title"],{},["{__CODE__0}"],""),f(this,x,M).call(this,this.args.options||{})],{class:{value:"text-zinc-500 text-xs font-semibold px-2 py-1 rounded-md hover:bg-zinc-600 hover:bg-opacity-40 menu",keys:[]}},["{__CODE__1}"],"")}}x=new WeakSet,M=function(t){const o=[];for(const n in t){let r="",a="";const i=t[n];typeof i=="object"?(r=f(this,x,M).call(this,i),a=this.node("button",[n],{},["{__CODE__0}"],"")):typeof i=="function"&&(a=this.node("button",[n],{onclick:{value:i,keys:[]}},["{__CODE__1}"],""));const u=this.node("div",[a,r],{class:{value:"menu-nested py-1 px-2 min-w-32 hover:bg-zinc-600 hover:bg-opacity-40",keys:[]}},["{__CODE__0}","{__CODE__1}"],"");o.push(u)}return this.node("div",[...o],{class:{value:"py-1 rounded-sm bg-zinc-800 border-2 border-zinc-900 z-20",keys:[]}},["{__CODE__0}"],"")};class Q extends m{constructor(){super()}main(e){this.set("{menu}",""),y.on("add-menu",(t,o,n={})=>{this.child[t]||this.set("{menu}++",this.component(Y,[],{id:t,title:o,options:n},[],""))}),y.on("remove-menu",t=>{this.child[t].destroy()})}render(){return this.node("div",["{menu}"],{class:{value:"flex flex-row p-1 relative z-20 bg-zinc-800",keys:[]}},["{menu}"],"")}destroy(){y.clear("add-menu"),y.clear("remove-menu"),super.destroy()}}class $ extends m{constructor(){super()}render(){return this.node("div",[this.node("button",[this.args.title],{class:{value:"h-full",keys:[]},onclick:{value:()=>{this.parent.setActive(this.id)},keys:[]}},["{__CODE__1}"],""),this.node("button",["×"],{class:{value:"text-rose-500",keys:[]},onclick:{value:()=>{this.parent.closeTab(this.id)},keys:[]}},[],"")],{class:{value:"primary-btn",keys:[]}},[],"")}}class Z extends m{constructor(){super()}main(){this.set("{tabs}","")}render(){return this.node("div",["{tabs}"],{class:{value:"p-1 px-2 flex flex-row",keys:[]}},["{tabs}"],"")}addTab(e,t){this.set("{tabs}++",this.component($,[],{id:e,title:t},[],""))}removeTab(e){this.child[e].destroy()}setActive(e){for(const t in this.child){const o=this.child[t];o instanceof $&&(o.id===e?o.root.classList.add("active"):o.root.classList.remove("active"))}this.parent.switchWorkspace(e)}closeTab(e){this.child[e].destroy(),this.parent.closeWorkspace(e)}}class ee extends m{constructor(){super(),this.listener=null}main(){const{position:e}=this.key;this.listener=t=>{e(`x: ${t.clientX}, y: ${t.clientY}`)},window.addEventListener("mousemove",this.listener)}render(){return this.node("div",[this.node("label",["{position}"],{class:{value:"p-1 px-2 hover:bg-zinc-600",keys:[]}},["{position}"],"")],{class:{value:"text-xs text-zinc-400 font-semibold flex flex-row justify-end select-none",keys:[]}},[],"")}destroy(){window.removeEventListener("mousemove",this.listener),super.destroy()}}var k;class te extends m{constructor(){super();p(this,k,!1);this.name="Workspace",this.dispatcher=new G}get isActive(){return d(this,k)}set isActive(t){W(this,k,t),t?this.root.classList.remove("hidden"):this.root.classList.add("hidden")}destroy(){this.dispatcher.clearAll(),super.destroy()}}k=new WeakMap;const se=new Map,oe={WEB:"WEB"},U={WEB:"fs/web"},J={WEB:"argv/web"},re=Object.freeze(Object.defineProperty({__proto__:null,ARGV_HANDLERS:J,FS_HANDLERS:U,HANDLERS:oe},Symbol.toStringTag,{value:"Module"})),B=U.WEB,ne=J.WEB,ie="modulepreload",ae=function(s){return"/ren-sandbox/"+s},F={},C=function(e,t,o){if(!t||t.length===0)return e();const n=document.getElementsByTagName("link");return Promise.all(t.map(r=>{if(r=ae(r),r in F)return;F[r]=!0;const a=r.endsWith(".css"),i=a?'[rel="stylesheet"]':"";if(!!o)for(let l=n.length-1;l>=0;l--){const b=n[l];if(b.href===r&&(!a||b.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${r}"]${i}`))return;const c=document.createElement("link");if(c.rel=a?"stylesheet":ie,a||(c.as="script",c.crossOrigin=""),c.href=r,document.head.appendChild(c),a)return new Promise((l,b)=>{c.addEventListener("load",l),c.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${r}`)))})})).then(()=>e()).catch(r=>{const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=r,window.dispatchEvent(a),!a.defaultPrevented)throw r})},K=(s,e)=>{const t=s[e];return t?typeof t=="function"?t():Promise.resolve(t):new Promise((o,n)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(n.bind(null,new Error("Unknown variable dynamic import: "+e)))})},T=new Map;async function R(s){if(T.has(s))return T.get(s);{const e=await K(Object.assign({"./global.js":()=>C(()=>Promise.resolve().then(()=>re),void 0)}),`./${s}.js`);return T.set(s,e),console.warn(`Handler ${s} loaded`),e}}async function ce(){try{const{readFile:s}=await R(B);return s(...arguments)}catch(s){console.error(s)}}async function le(){try{const{writeFile:s}=await R(B);return s(...arguments)}catch(s){console.error(s)}}async function be(){try{const{readDirectory:s}=await R(B);return s(...arguments)}catch(s){console.error(s)}}class de extends m{constructor(){super(),this.isLoaded=!1}async main(e){y.on("load-project",()=>{this.load()}),y.on("unload-project",()=>{this.unload()}),y.on("open-workspace",(t,o)=>{this.openWorkspace(t,o)}),this.set("{workspaces}","")}render(){return this.node("div",[this.node("div",[this.component(Z,[],{id:"tabManager"},[],"")],{class:{value:"border-2 border-zinc-950",keys:[]}},[],""),this.node("div",["{workspaces}"],{class:{value:"w-full h-full",keys:[]}},["{workspaces}"],""),this.node("div",[this.component(ee,[],{},[],"")],{class:{value:"border-2 border-zinc-900",keys:[]}},[],"")],{class:{value:"w-full h-full flex-col hidden",keys:[]}},[],"")}async openWorkspace(e,t){const o=crypto.randomUUID(),n=`.${t.split(".").slice(-1)[0]}`,r=se.get(n);if(!r){alert("Invalid file type");return}this.set("{workspaces}++",this.component(r,[],{id:o,path:t},[],""));const{tabManager:a}=this.child;return a.addTab(o,e),a.setActive(o),o}closeWorkspace(e){this.child[e].destroy()}switchWorkspace(e){for(const t in this.child){const o=this.child[t];o instanceof te&&(o.isActive=!1)}this.child[e].isActive=!0}load(e){try{if(this.isLoaded)throw new Error("Project already loaded");const o=Object.keys({"a3a5ff3d-9c96-48ba-b407-c4fb6d08484c":{graphs:{"edfa1a28-0932-43af-ba1b-85042da2c721":{entry:"b32b8df0-2322-4b27-881b-3436a5c71e89",nodes:{"34939d61-67ec-407a-a843-4fc5f8ccd2dd":{class:"INode.Value.MakeFloat",properties:{value0:{name:"value",type:"FLOAT",value:0,custom:{}}},custom:{x:20,y:390},inputs:{},outputs:{}},"b32b8df0-2322-4b27-881b-3436a5c71e89":{class:"INode.Event.Begin",properties:{},custom:{x:90,y:90},inputs:{},outputs:{}},"57b39bcf-aca9-4cf4-a962-667f58049a89":{class:"INode.Event.Log",properties:{},custom:{x:360,y:160},inputs:{},outputs:{}},"225549ba-80e2-4bdf-9269-450361d72ba3":{class:"INode.Value.MakeString",properties:{value0:{name:"value",type:"STRING",value:"1111",custom:{}}},custom:{x:90,y:160},inputs:{},outputs:{}},"ef505dfb-232f-4ba2-b66f-a4d0808a97f9":{class:"INode.Event.Log",properties:{},custom:{x:360,y:250},inputs:{},outputs:{}},"36f8e845-582d-4383-8c96-078022607fe2":{class:"INode.Event.Log",properties:{},custom:{x:360,y:320},inputs:{},outputs:{}},"3aa8de2c-1419-4256-85c1-e95dcc57d3e7":{class:"INode.Event.Log",properties:{},custom:{x:360,y:390},inputs:{},outputs:{}},"bb823943-5dda-4c5a-80c2-25a26d961f74":{class:"INode.Event.Log",properties:{},custom:{x:360,y:90},inputs:{},outputs:{}},"211a3f79-65c5-4748-8ea1-2acc6160318d":{class:"INode.Event.Return",properties:{},custom:{x:510,y:90},inputs:{},outputs:{}}},links:[{sourceNode:"b32b8df0-2322-4b27-881b-3436a5c71e89",sourceSocket:"out0",targetNode:"bb823943-5dda-4c5a-80c2-25a26d961f74",targetSocket:"in0"},{sourceNode:"225549ba-80e2-4bdf-9269-450361d72ba3",sourceSocket:"value0",targetNode:"bb823943-5dda-4c5a-80c2-25a26d961f74",targetSocket:"value1"},{sourceNode:"bb823943-5dda-4c5a-80c2-25a26d961f74",sourceSocket:"out0",targetNode:"211a3f79-65c5-4748-8ea1-2acc6160318d",targetSocket:"in0"}],properties:{},custom:{name:"fgh",x:-36,y:37,z:"0.8500"}},"62f41d24-adf5-4e84-9b44-a87864d4504c":{entry:null,nodes:{},links:[],properties:{},custom:{name:"ry",x:9,y:2,z:"0.7000"}}},properties:{},custom:{name:"Graph Set"}}})[0];this.openWorkspace("Explorer",e),this.root.classList.remove("hidden"),this.root.classList.add("flex"),this.isLoaded=!0}catch(t){alert("Failed to load project"),console.error(t)}}unload(){this.root.classList.add("hidden"),this.root.classList.remove("flex"),this.isLoaded=!1}destroy(){y.clear("load-project"),y.clear("unload-project"),super.destroy()}}async function ue(){const s=await ce("plugins");if(s)return JSON.parse(s);const e=["ren-vs","explorer"];return await le("plugins",JSON.stringify(e)),e}async function he(){const s=await ue();for(const e of s){const{register:t}=await K(Object.assign({"../plugin/explorer/main.js":()=>C(()=>import("./main-0f29b1f4.js"),[]),"../plugin/ren-vs/main.js":()=>C(()=>import("./main-0ea42514.js"),[])}),`../plugin/${e}/main.js`);t()}}async function pe(){try{const{getArguments:s}=await R(ne);return s(...arguments)}catch(s){console.error(s)}}var L,D,X;class fe extends m{constructor(){super();p(this,D);p(this,L,!1)}get isReady(){return d(this,L)}main(t){this.set("{overlay}",""),f(this,D,X).call(this),this.load()}render(){return this.node("div",[this.node("div",[this.component(Q,[],{},[],""),this.component(de,[],{id:"project"},[],"")],{class:{value:"w-full h-full flex flex-col",keys:[]}},[],""),this.node("div",["{overlay}"],{},["{overlay}"],"")],{class:{value:"w-full h-full overflow-hidden bg-zinc-700 relative",keys:[]}},[],"")}async load(){await he();const t=await pe();!t||!t[0]||(await this.child.project.load(t[0]),W(this,L,!0))}}L=new WeakMap,D=new WeakSet,X=function(){y.on("add-overlay",t=>{this.set("{overlay}++",this.component(t,[],{},[],""))})};class me extends m{constructor(){super()}main(e){}render(){return this.node("div",[this.component(fe,[],{},[],"")],{class:{value:"w-full h-full overflow-hidden",keys:[]}},[],"")}}document.querySelector(".app").appendChild(new me().init());export{G as D,m as H,te as W,se as a,ce as b,y as d,be as r,le as w};
