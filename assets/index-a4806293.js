var M=(r,e,t)=>{if(!e.has(r))throw TypeError("Cannot "+t)};var l=(r,e,t)=>(M(r,e,"read from private field"),t?t.call(r):e.get(r)),h=(r,e,t)=>{if(e.has(r))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(r):e.set(r,t)},P=(r,e,t,n)=>(M(r,e,"write to private field"),n?n.call(r,t):e.set(r,t),t);var f=(r,e,t)=>(M(r,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();var y,k,$,v,_,I,W,G,b,R,B,Q,D,J;const N=class N{constructor(){h(this,k);h(this,_);h(this,W);h(this,b);h(this,B);h(this,D);h(this,y,{});h(this,v,new Map);this.id=N.raid(),this.root=null,this.args={},this.parent=null,this.child={},this.element={},this.key={},this.relay=null}main(e={}){}render(){return this.node("div")}init(){try{return this.root=this.render(),f(this,D,J).call(this,"id",this.element),this.main(this.args),this.root}catch(e){console.error(e)}}node(e="",t=[],n={},s=[],o){const i=o?document.createElementNS(o,e):document.createElement(e);return t.forEach(c=>{const p=typeof c;if(p==="string"){const a=document.createTextNode(c);if(i.append(a),!s||!s.includes(c))return;f(this,k,$).call(this,c,{node:a,type:0,parent:a.parentNode,clone:[]})}else i.append(p==="function"?c.bind(this)():c)}),Object.entries(n).forEach(([c,{keys:p,value:a}])=>{if(p&&p.forEach(d=>f(this,k,$).call(this,d,{node:i,type:2,name:c,map:a})),typeof a=="function"){const d=c.slice(2);c.startsWith("on")?i.addEventListener(d,f(this,W,G).call(this,i,d,a)):i.setAttribute(c,a())}else i.setAttribute(c,a)}),i}destroy(){f(this,_,I).call(this),Object.values(this.child).forEach(e=>e.destroy()),delete this.parent.child[this.id],this.root.remove()}component(e=null,t=[],n={}){if(e instanceof Object){const s=new e;return s.id=n.id||s.id,s.parent=this,s.args={...n,child:t[0]},s.relay=s.relay?{...this.relay,...s.relay}:this.relay,this.child[s.id]=s,s.init()}}get binding(){return l(this,y)}set(e="",t=""){const n=e.indexOf("++");e=e.replace("++","");const s=l(this,y)[e];if(!s)return;s.element.forEach(i=>{const c=i.node,p=i.parent||c.parentNode,a=typeof t=="function"?t():t;if(i.type==0)a instanceof Element?(p.replaceChild(a,c),i.type=1,i.node=a):f(this,b,R).call(this,a)&&(c.nodeValue=n<0?a:n===0?a+c.nodeValue:c.nodeValue+a);else if(i.type==1){if(a instanceof Element)if(n!==-1){p.insertAdjacentElement(n==0?"afterbegin":"beforeend",a),i.clone.push(a);return}else p.replaceChild(a,c),i.node=a;else if(f(this,b,R).call(this,a)){const d=document.createTextNode(a);p.replaceChild(d,c),i.type=0,i.node=d}i.clone.forEach(d=>{d.remove()}),i.clone=[],c.remove(),f(this,_,I).call(this)}else if(i.type==2&&f(this,b,R).call(this,t)){let d=i.map,g=d.match(/\{[^{}\s]*\}/gm);g&&g.forEach(O=>{if(O===e)d=d.replace(O,a);else{const H=l(this,y)[O];H&&(d=d.replace(O,H.data))}}),c.setAttribute(i.name,d),l(this,y)[e].data=a}})}static raid(){return Math.random().toString(36).slice(6)}};y=new WeakMap,k=new WeakSet,$=function(e,t){if(!this.key[e]){const s=e.replace(/{|}/g,"");this.key[s]=(o,i)=>this.set(i?i.replace(/\w+/gm,e):e,o)}const n=l(this,y);n[e]||(n[e]={element:[],data:""}),n[e].element.push(t)},v=new WeakMap,_=new WeakSet,I=function(e=!1){for(const[t,n]of l(this,v))t.isConnected&&!e||(n.forEach(([s,o])=>t.removeEventListener(s,o)),l(this,v).delete(t))},W=new WeakSet,G=function(e,t,n){let s=n.bind(this),o=l(this,v).get(e)||[];return o.push([t,s]),l(this,v).set(e,o),s},b=new WeakSet,R=function(e){return["string","number","boolean","function"].includes(typeof e)},B=new WeakSet,Q=function(e){return typeof e=="function"?e():e},D=new WeakSet,J=function(e="id",t=this.element){this.root.querySelectorAll(`[${e}]`).forEach(n=>{t[n.getAttribute(e)]=n,n.setAttribute(e,N.raid())})};let m=N;new EventTarget;var u;class K{constructor(){h(this,u,new Map)}on(e,t){l(this,u).has(e)||l(this,u).set(e,[]),l(this,u).get(e).push(t)}off(e,t){l(this,u).has(e)&&l(this,u).set(e,l(this,u).get(e).filter(n=>n!==t))}emit(e,...t){l(this,u).has(e)&&l(this,u).get(e).forEach(n=>n(...t))}once(e,t){const n=(...s)=>{this.off(e,n),t(...s)};this.on(e,n)}clear(e){l(this,u).has(e)&&(l(this,u).delete(e),console.warn(`Event ${e} cleared`))}clearAll(){l(this,u).clear(),console.warn("Event handler cleared")}}u=new WeakMap;const w=new K;console.warn("Event handler initialized");var x,z;class Z extends m{constructor(){super();h(this,x)}render(){return this.node("div",[this.node("label",[this.args.title||"Title"],{},[],""),f(this,x,z).call(this,this.args.options||{})],{class:{value:"text-zinc-400 text-xs font-semibold px-2 py-1 rounded-md hover:bg-zinc-600 hover:bg-opacity-40 menu",keys:[]}},[],"")}}x=new WeakSet,z=function(t){const n=[];for(const s in t){let o="",i="";const c=t[s];typeof c=="object"?(o=f(this,x,z).call(this,c),i=this.node("button",[s],{},[],"")):typeof c=="function"&&(i=this.node("button",[s],{onclick:{value:c,keys:[]}},[],""));const p=this.node("div",[i,o],{class:{value:"menu-nested py-1 px-2 min-w-32 hover:bg-zinc-600 hover:bg-opacity-40",keys:[]}},[],"");n.push(p)}return this.node("div",[...n],{class:{value:"py-1 rounded-sm bg-zinc-800 border-2 border-zinc-900 z-20",keys:[]}},[],"")};class ee extends m{constructor(){super()}main(e){this.set("{menu}",""),w.on("add-menu",(t,n,s={})=>{this.child[t]||this.set("{menu}++",this.component(Z,[],{id:t,title:n,options:s},[],""))}),w.on("remove-menu",t=>{this.child[t].destroy()})}render(){return this.node("div",["{menu}"],{class:{value:"editor-menu",keys:[]}},["{menu}"],"")}destroy(){w.clear("add-menu"),w.clear("remove-menu"),super.destroy()}}class q extends m{constructor(){super()}render(){return this.node("div",[this.node("button",[this.args.title],{class:{value:"h-full",keys:[]}},[],""),this.node("button",["×"],{onclick:{value:e=>{e.stopPropagation(),e.preventDefault(),this.parent.closeTab(this.id)},keys:[]}},[],"")],{class:{value:"tab",keys:[]},onclick:{value:e=>{this.parent.setActive(this.id)},keys:[]}},[],"")}}class te extends m{constructor(){super()}main(){this.set("{tabs}","")}render(){return this.node("div",["{tabs}"],{class:{value:"tab-container",keys:[]}},["{tabs}"],"")}add(e,t){e&&this.set("{tabs}++",this.component(q,[],{id:e,title:t},[],""))}remove(e){this.child[e].destroy()}setActive(e){for(const t in this.child){const n=this.child[t];n instanceof q&&(n.id===e?n.root.classList.add("active"):n.root.classList.remove("active"))}this.parent.switchWorkspace(e)}closeTab(e){this.child[e].destroy(),this.parent.closeWorkspace(e)}}class se extends m{constructor(){super(),this.listener=null}main(){const{position:e}=this.key;this.listener=t=>{e(`x: ${t.clientX}, y: ${t.clientY}`)},window.addEventListener("mousemove",this.listener)}render(){return this.node("div",[this.node("label",["{position}"],{class:{value:"p-1 px-2 hover:bg-zinc-600",keys:[]}},["{position}"],"")],{class:{value:"text-xs text-zinc-400 font-semibold flex flex-row justify-end select-none",keys:[]}},[],"")}destroy(){window.removeEventListener("mousemove",this.listener),super.destroy()}}var A;class re extends m{constructor(){super();h(this,A,!1);this.name="Workspace",this.dispatcher=new K}get active(){return l(this,A)}set active(t){P(this,A,t),t?this.root.classList.remove("hidden"):this.root.classList.add("hidden")}load(){}destroy(){this.dispatcher.clearAll(),super.destroy()}}A=new WeakMap;const ne=new Map;var L,C;class ie extends m{constructor(){super();h(this,L,!1);h(this,C,null)}async main(t){w.on("open-workspace",(n,s)=>{this.openWorkspace(n,s)}),this.set("{workspaces}","")}render(){return this.node("div",[this.node("div",[this.component(te,[],{id:"tabManager"},[],"")],{class:{value:"project-area-tab",keys:[]}},[],""),this.node("div",["{workspaces}"],{class:{value:"project-area-workspace",keys:[]}},["{workspaces}"],""),this.node("div",[this.component(se,[],{},[],"")],{class:{value:"project-area-status",keys:[]}},[],"")],{class:{value:"project",keys:[]}},[],"")}async openWorkspace(t,n){const s=crypto.randomUUID(),o=`.${n.split(".").slice(-1)[0]}`,i=ne.get(o);if(!i){alert("Invalid file type");return}this.set("{workspaces}++",this.component(i,[],{id:s,path:n},[],""));const{tabManager:c}=this.child;return c.add(s,t),c.setActive(s),s}closeWorkspace(t){this.child[t].destroy()}switchWorkspace(t){for(const s in this.child){const o=this.child[s];o instanceof re&&(o.active=!1)}const n=this.child[t];n.active=!0}load(t){try{if(l(this,L))throw new Error("Project already loaded");this.openWorkspace("Explorer",t),this.root.classList.remove("hidden"),P(this,L,!0)}catch(n){alert("Failed to load project"),console.error(n)}}destroy(){super.destroy()}}L=new WeakMap,C=new WeakMap;const oe="modulepreload",ae=function(r){return"/ren-sandbox/"+r},U={},E=function(e,t,n){if(!t||t.length===0)return e();const s=document.getElementsByTagName("link");return Promise.all(t.map(o=>{if(o=ae(o),o in U)return;U[o]=!0;const i=o.endsWith(".css"),c=i?'[rel="stylesheet"]':"";if(!!n)for(let d=s.length-1;d>=0;d--){const g=s[d];if(g.href===o&&(!i||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${o}"]${c}`))return;const a=document.createElement("link");if(a.rel=i?"stylesheet":oe,i||(a.as="script",a.crossOrigin=""),a.href=o,document.head.appendChild(a),i)return new Promise((d,g)=>{a.addEventListener("load",d),a.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${o}`)))})})).then(()=>e()).catch(o=>{const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=o,window.dispatchEvent(i),!i.defaultPrevented)throw o})},X=(r,e)=>{const t=r[e];return t?typeof t=="function"?t():Promise.resolve(t):new Promise((n,s)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(s.bind(null,new Error("Unknown variable dynamic import: "+e)))})},ce={WEB:{path:"fs",file:"web"}},le={WEB:{path:"argv",file:"web"}},F=ce.WEB,de=le.WEB,V=new Map;async function T(r){if(V.has(r))return V.get(r);{const e=await X(Object.assign({"./argv/web.js":()=>E(()=>import("./web-758b1622.js"),[]),"./fs/web.js":()=>E(()=>import("./web-307f4943.js"),[])}),`./${r.path}/${r.file}.js`);return V.set(r,e),console.warn(`Handler ${JSON.stringify(r)} loaded`),e}}async function he(){try{const{readFile:r}=await T(F);return r(...arguments)}catch(r){console.error(r)}}async function ue(){try{const{writeFile:r}=await T(F);return r(...arguments)}catch(r){console.error(r)}}async function we(){try{const{readDirectory:r}=await T(F);return r(...arguments)}catch(r){console.error(r)}}async function pe(){const r=await he("plugins");if(r)return JSON.parse(r);const e=["ren-workspace","explorer","ren-javascript-engine"];return await ue("plugins",JSON.stringify(e)),e}async function fe(){const r=await pe();for(const e of r){const{register:t}=await X(Object.assign({"./plugin/explorer/main.js":()=>E(()=>import("./main-2348b565.js"),["assets/main-2348b565.js","assets/main-9bd8b6f0.css"]),"./plugin/ren-javascript-engine/main.js":()=>E(()=>import("./main-b07aba92.js"),["assets/main-b07aba92.js","assets/node-8825f4de.js"]),"./plugin/ren-workspace/main.js":()=>E(()=>import("./main-de15ff7a.js"),["assets/main-de15ff7a.js","assets/node-8825f4de.js","assets/main-275d5793.css"])}),`./plugin/${e}/main.js`);t()}}async function me(){try{const{getArguments:r}=await T(de);return r(...arguments)}catch(r){console.error(r)}}var j,S,Y;class ye extends m{constructor(){super();h(this,S);h(this,j,!1)}get isReady(){return l(this,j)}main(t){this.set("{overlay}",""),f(this,S,Y).call(this),this.load()}render(){return this.node("div",[this.node("div",[this.component(ee,[],{},[],""),this.component(ie,[],{id:"project"},[],"")],{class:{value:"editor-container",keys:[]}},[],""),this.node("div",["{overlay}"],{class:{value:"editor-overlay",keys:[]}},["{overlay}"],"")],{class:{value:"editor",keys:[]}},[],"")}async load(){await fe();const t=await me();!t||!t[0]||(await this.child.project.load(t[0]),P(this,j,!0))}}j=new WeakMap,S=new WeakSet,Y=function(){w.on("add-overlay",t=>{this.set("{overlay}++",this.component(t,[],{},[],""))})};class ge extends m{constructor(){super()}main(e){}render(){return this.node("div",[this.component(ye,[],{},[],"")],{class:{value:"w-full h-full overflow-hidden",keys:[]}},[],"")}}document.querySelector(".app").appendChild(new ge().init());export{K as D,m as H,re as W,ne as a,he as b,w as d,we as r,ue as w};
