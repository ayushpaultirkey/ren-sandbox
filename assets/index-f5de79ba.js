var I=(s,e,t)=>{if(!e.has(s))throw TypeError("Cannot "+t)};var d=(s,e,t)=>(I(s,e,"read from private field"),t?t.call(s):e.get(s)),p=(s,e,t)=>{if(e.has(s))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(s):e.set(s,t)},P=(s,e,t,r)=>(I(s,e,"write to private field"),r?r.call(s,t):e.set(s,t),t);var f=(s,e,t)=>(I(s,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();var v,E,W,g,_,z,O,H,w,N,S,q;const D=class D{constructor(){p(this,E);p(this,_);p(this,O);p(this,w);p(this,S);p(this,v,{});p(this,g,new Map);this.id=D.raid(),this.root=null,this.args={},this.parent=null,this.child={},this.element={},this.key={}}main(e={}){}render(){return this.node("div")}init(){try{return this.root=this.render(),f(this,S,q).call(this,"id",this.element),this.main(this.args),this.root}catch(e){console.error(e)}}node(e="",t=[],r={},i=[],o){const a=o?document.createElementNS(o,e):document.createElement(e);return t.forEach(n=>{const u=typeof n;if(u==="string"){const c=document.createTextNode(n);if(a.append(c),!i||!i.includes(n))return;f(this,E,W).call(this,n,{node:c,type:0,parent:c.parentNode,clone:[]})}else a.append(u==="function"?n.bind(this)():n)}),Object.entries(r).forEach(([n,{keys:u,value:c}])=>{if(u&&u.forEach(l=>f(this,E,W).call(this,l,{node:a,type:2,name:n,map:c})),typeof c=="function"){const l=n.slice(2);n.startsWith("on")?a.addEventListener(l,f(this,O,H).call(this,a,l,c)):a.setAttribute(n,c())}else a.setAttribute(n,c)}),a}destroy(){f(this,_,z).call(this),Object.values(this.child).forEach(e=>e.destroy()),delete this.parent.child[this.id],this.root.remove()}component(e=null,t=[],r={}){if(e instanceof Object){const i=new e;return i.id=r.id||i.id,i.args={...r,child:t[0]},i.parent=this,this.child[i.id]=i,i.init()}}set(e="",t=""){const r=e.indexOf("++");e=e.replace("++","");const i=d(this,v)[e];if(!i)return;const o=typeof t=="function"?t():t;i.element.forEach(n=>{const u=n.node,c=n.parent||u.parentNode;if(n.type==0)t instanceof Element?(c.replaceChild(o,u),n.type=1,n.node=o):f(this,w,N).call(this,t)&&(u.nodeValue=r<0?o:r===0?o+u.nodeValue:u.nodeValue+o);else if(n.type==1){if(t instanceof Element)if(r!==-1){c.insertAdjacentElement(r==0?"afterbegin":"beforeend",o),n.clone.push(o);return}else c.replaceChild(o,u),n.node=o;else if(f(this,w,N).call(this,t)){const l=document.createTextNode(o);c.replaceChild(l,u),n.type=0,n.node=l}n.clone.forEach(l=>{l.remove()}),n.clone=[],u.remove(),f(this,_,z).call(this)}else if(n.type==2&&f(this,w,N).call(this,t)){let l=n.map,b=l.match(/\{[^{}\s]*\}/gm);b&&b.forEach(A=>{if(A===e)l=l.replace(A,o);else{const B=d(this,v)[A];B&&(l=l.replace(A,B.data))}}),u.setAttribute(n.name,l),d(this,v)[e].data=o}})}static raid(){return Math.random().toString(36).slice(6)}};v=new WeakMap,E=new WeakSet,W=function(e,t){if(!this.key[e]){const i=e.replace(/{|}/g,"");this.key[i]=(o,a)=>this.set(a?a.replace(/\w+/gm,e):e,o)}const r=d(this,v);r[e]||(r[e]={element:[],data:""}),r[e].element.push(t)},g=new WeakMap,_=new WeakSet,z=function(e=!1){for(const[t,r]of d(this,g))t.isConnected&&!e||(r.forEach(([i,o])=>t.removeEventListener(i,o)),d(this,g).delete(t))},O=new WeakSet,H=function(e,t,r){let i=r.bind(this),o=d(this,g).get(e)||[];return o.push([t,i]),d(this,g).set(e,o),i},w=new WeakSet,N=function(e){return["string","number","boolean","function"].includes(typeof e)},S=new WeakSet,q=function(e="id",t=this.element){this.root.querySelectorAll(`[${e}]`).forEach(r=>{t[r.getAttribute(e)]=r,r.setAttribute(e,D.raid())})};let m=D;new EventTarget;var h;class G{constructor(){p(this,h,new Map)}on(e,t){d(this,h).has(e)||d(this,h).set(e,[]),d(this,h).get(e).push(t)}off(e,t){d(this,h).has(e)&&d(this,h).set(e,d(this,h).get(e).filter(r=>r!==t))}emit(e,...t){d(this,h).has(e)&&d(this,h).get(e).forEach(r=>r(...t))}once(e,t){const r=(...i)=>{this.off(e,r),t(...i)};this.on(e,r)}clear(e){d(this,h).has(e)&&(d(this,h).delete(e),console.warn(`Event ${e} cleared`))}clearAll(){d(this,h).clear(),console.warn("Event handler cleared")}}h=new WeakMap;const y=new G;console.warn("Event handler initialized");var x,C;class J extends m{constructor(){super();p(this,x)}render(){return this.node("div",[this.node("label",[this.args.title||"Title"],{},["{__CODE__0}"],""),f(this,x,C).call(this,this.args.options||{})],{class:{value:"text-zinc-500 text-xs font-semibold px-2 py-1 rounded-md hover:bg-zinc-600 hover:bg-opacity-40 menu",keys:[]}},["{__CODE__1}"],"")}}x=new WeakSet,C=function(t){const r=[];for(const i in t){let o="",a="";const n=t[i];typeof n=="object"?(o=f(this,x,C).call(this,n),a=this.node("button",[i],{},["{__CODE__0}"],"")):typeof n=="function"&&(a=this.node("button",[i],{onclick:{value:n,keys:[]}},["{__CODE__1}"],""));const u=this.node("div",[a,o],{class:{value:"menu-nested py-1 px-2 min-w-32 hover:bg-zinc-600 hover:bg-opacity-40",keys:[]}},["{__CODE__0}","{__CODE__1}"],"");r.push(u)}return this.node("div",[...r],{class:{value:"py-1 rounded-sm bg-zinc-800 border-2 border-zinc-900 z-20",keys:[]}},["{__CODE__0}"],"")};class K extends m{constructor(){super()}main(e){this.set("{menu}",""),y.on("add-menu",(t,r,i={})=>{this.child[t]||this.set("{menu}++",this.component(J,[],{id:t,title:r,options:i},[],""))}),y.on("remove-menu",t=>{this.child[t].destroy()})}render(){return this.node("div",["{menu}"],{class:{value:"flex flex-row p-1 relative z-20 bg-zinc-800",keys:[]}},["{menu}"],"")}destroy(){y.clear("add-menu"),y.clear("remove-menu"),super.destroy()}}class $ extends m{constructor(){super()}render(){return this.node("div",[this.node("button",[this.args.title],{class:{value:"h-full",keys:[]},onclick:{value:()=>{this.parent.setActive(this.id)},keys:[]}},["{__CODE__1}"],""),this.node("button",["×"],{class:{value:"text-rose-500",keys:[]},onclick:{value:()=>{this.parent.closeTab(this.id)},keys:[]}},[],"")],{class:{value:"primary-btn",keys:[]}},[],"")}}class X extends m{constructor(){super()}main(){this.set("{tabs}","")}render(){return this.node("div",["{tabs}"],{class:{value:"p-1 px-2 flex flex-row",keys:[]}},["{tabs}"],"")}addTab(e,t){this.set("{tabs}++",this.component($,[],{id:e,title:t},[],""))}removeTab(e){this.child[e].destroy()}setActive(e){for(const t in this.child){const r=this.child[t];r instanceof $&&(r.id===e?r.root.classList.add("active"):r.root.classList.remove("active"))}this.parent.switchWorkspace(e)}closeTab(e){this.child[e].destroy(),this.parent.closeWorkspace(e)}}class Y extends m{constructor(){super(),this.listener=null}main(){const{position:e}=this.key;this.listener=t=>{e(`x: ${t.clientX}, y: ${t.clientY}`)},window.addEventListener("mousemove",this.listener)}render(){return this.node("div",[this.node("label",["{position}"],{class:{value:"p-1 px-2 hover:bg-zinc-600",keys:[]}},["{position}"],"")],{class:{value:"text-xs text-zinc-400 font-semibold flex flex-row justify-end select-none",keys:[]}},[],"")}destroy(){window.removeEventListener("mousemove",this.listener),super.destroy()}}var k;class Q extends m{constructor(){super();p(this,k,!1);this.name="Workspace",this.dispatcher=new G}get isActive(){return d(this,k)}set isActive(t){P(this,k,t),t?this.root.classList.remove("hidden"):this.root.classList.add("hidden")}destroy(){this.dispatcher.clearAll(),super.destroy()}}k=new WeakMap;const Z=new Map,ee={WEB:"fs/web.js"},te={WEB:"argv/web.js"},V=ee.WEB,se=te.WEB,re="modulepreload",oe=function(s){return"/ren-sandbox/"+s},F={},M=function(e,t,r){if(!t||t.length===0)return e();const i=document.getElementsByTagName("link");return Promise.all(t.map(o=>{if(o=oe(o),o in F)return;F[o]=!0;const a=o.endsWith(".css"),n=a?'[rel="stylesheet"]':"";if(!!r)for(let l=i.length-1;l>=0;l--){const b=i[l];if(b.href===o&&(!a||b.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${o}"]${n}`))return;const c=document.createElement("link");if(c.rel=a?"stylesheet":re,a||(c.as="script",c.crossOrigin=""),c.href=o,document.head.appendChild(c),a)return new Promise((l,b)=>{c.addEventListener("load",l),c.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${o}`)))})})).then(()=>e()).catch(o=>{const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o})},T=new Map;async function R(s){if(T.has(s))return T.get(s);{const e=await M(()=>import(`../handler/${s}`),[]);return T.set(s,e),console.warn(`Handler ${s} loaded`),e}}async function ie(){try{const{readFile:s}=await R(V);return s(...arguments)}catch(s){console.error(s)}}async function ne(){try{const{writeFile:s}=await R(V);return s(...arguments)}catch(s){console.error(s)}}async function me(){try{const{readDirectory:s}=await R(V);return s(...arguments)}catch(s){console.error(s)}}class ae extends m{constructor(){super(),this.isLoaded=!1}async main(e){y.on("load-project",()=>{this.load()}),y.on("unload-project",()=>{this.unload()}),y.on("open-workspace",(t,r)=>{this.openWorkspace(t,r)}),this.set("{workspaces}","")}render(){return this.node("div",[this.node("div",[this.component(X,[],{id:"tabManager"},[],"")],{class:{value:"border-2 border-zinc-950",keys:[]}},[],""),this.node("div",["{workspaces}"],{class:{value:"w-full h-full",keys:[]}},["{workspaces}"],""),this.node("div",[this.component(Y,[],{},[],"")],{class:{value:"border-2 border-zinc-900",keys:[]}},[],"")],{class:{value:"w-full h-full flex-col hidden",keys:[]}},[],"")}async openWorkspace(e,t){const r=crypto.randomUUID(),i=`.${t.split(".").slice(-1)[0]}`,o=Z.get(i);if(!o){alert("Invalid file type");return}this.set("{workspaces}++",this.component(o,[],{id:r,path:t},[],""));const{tabManager:a}=this.child;return a.addTab(r,e),a.setActive(r),r}closeWorkspace(e){this.child[e].destroy()}switchWorkspace(e){for(const t in this.child){const r=this.child[t];r instanceof Q&&(r.isActive=!1)}this.child[e].isActive=!0}load(e){try{if(this.isLoaded)throw new Error("Project already loaded");const r=Object.keys({"a3a5ff3d-9c96-48ba-b407-c4fb6d08484c":{graphs:{"edfa1a28-0932-43af-ba1b-85042da2c721":{entry:"b32b8df0-2322-4b27-881b-3436a5c71e89",nodes:{"34939d61-67ec-407a-a843-4fc5f8ccd2dd":{class:"INode.Value.MakeFloat",properties:{value0:{name:"value",type:"FLOAT",value:0,custom:{}}},custom:{x:20,y:390},inputs:{},outputs:{}},"b32b8df0-2322-4b27-881b-3436a5c71e89":{class:"INode.Event.Begin",properties:{},custom:{x:90,y:90},inputs:{},outputs:{}},"57b39bcf-aca9-4cf4-a962-667f58049a89":{class:"INode.Event.Log",properties:{},custom:{x:360,y:160},inputs:{},outputs:{}},"225549ba-80e2-4bdf-9269-450361d72ba3":{class:"INode.Value.MakeString",properties:{value0:{name:"value",type:"STRING",value:"1111",custom:{}}},custom:{x:90,y:160},inputs:{},outputs:{}},"ef505dfb-232f-4ba2-b66f-a4d0808a97f9":{class:"INode.Event.Log",properties:{},custom:{x:360,y:250},inputs:{},outputs:{}},"36f8e845-582d-4383-8c96-078022607fe2":{class:"INode.Event.Log",properties:{},custom:{x:360,y:320},inputs:{},outputs:{}},"3aa8de2c-1419-4256-85c1-e95dcc57d3e7":{class:"INode.Event.Log",properties:{},custom:{x:360,y:390},inputs:{},outputs:{}},"bb823943-5dda-4c5a-80c2-25a26d961f74":{class:"INode.Event.Log",properties:{},custom:{x:360,y:90},inputs:{},outputs:{}},"211a3f79-65c5-4748-8ea1-2acc6160318d":{class:"INode.Event.Return",properties:{},custom:{x:510,y:90},inputs:{},outputs:{}}},links:[{sourceNode:"b32b8df0-2322-4b27-881b-3436a5c71e89",sourceSocket:"out0",targetNode:"bb823943-5dda-4c5a-80c2-25a26d961f74",targetSocket:"in0"},{sourceNode:"225549ba-80e2-4bdf-9269-450361d72ba3",sourceSocket:"value0",targetNode:"bb823943-5dda-4c5a-80c2-25a26d961f74",targetSocket:"value1"},{sourceNode:"bb823943-5dda-4c5a-80c2-25a26d961f74",sourceSocket:"out0",targetNode:"211a3f79-65c5-4748-8ea1-2acc6160318d",targetSocket:"in0"}],properties:{},custom:{name:"fgh",x:-36,y:37,z:"0.8500"}},"62f41d24-adf5-4e84-9b44-a87864d4504c":{entry:null,nodes:{},links:[],properties:{},custom:{name:"ry",x:9,y:2,z:"0.7000"}}},properties:{},custom:{name:"Graph Set"}}})[0];this.openWorkspace("Explorer",e),this.root.classList.remove("hidden"),this.root.classList.add("flex"),this.isLoaded=!0}catch(t){alert("Failed to load project"),console.error(t)}}unload(){this.root.classList.add("hidden"),this.root.classList.remove("flex"),this.isLoaded=!1}destroy(){y.clear("load-project"),y.clear("unload-project"),super.destroy()}}const ce=(s,e)=>{const t=s[e];return t?typeof t=="function"?t():Promise.resolve(t):new Promise((r,i)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(i.bind(null,new Error("Unknown variable dynamic import: "+e)))})};async function le(){const s=await ie("plugins");if(s)return JSON.parse(s);const e=["ren-vs","explorer"];return await ne("plugins",JSON.stringify(e)),e}async function de(){const s=await le();for(const e of s){const{register:t}=await ce(Object.assign({"../plugin/explorer/main.js":()=>M(()=>import("./main-05b2a950.js"),[]),"../plugin/ren-vs/main.js":()=>M(()=>import("./main-38b06420.js"),[])}),`../plugin/${e}/main.js`);t()}}async function ue(){try{const{getArguments:s}=await R(se);return s(...arguments)}catch(s){console.error(s)}}var L,j,U;class he extends m{constructor(){super();p(this,j);p(this,L,!1)}get isReady(){return d(this,L)}main(t){this.set("{overlay}",""),f(this,j,U).call(this),this.load()}render(){return this.node("div",[this.node("div",[this.component(K,[],{},[],""),this.component(ae,[],{id:"project"},[],"")],{class:{value:"w-full h-full flex flex-col",keys:[]}},[],""),this.node("div",["{overlay}"],{},["{overlay}"],"")],{class:{value:"w-full h-full overflow-hidden bg-zinc-700 relative",keys:[]}},[],"")}async load(){await de();const t=await ue();!t||!t[0]||(await this.child.project.load(t[0]),P(this,L,!0))}}L=new WeakMap,j=new WeakSet,U=function(){y.on("add-overlay",t=>{this.set("{overlay}++",this.component(t,[],{},[],""))})};class pe extends m{constructor(){super()}main(e){}render(){return this.node("div",[this.component(he,[],{},[],"")],{class:{value:"w-full h-full overflow-hidden",keys:[]}},[],"")}}document.querySelector(".app").appendChild(new pe().init());export{G as D,m as H,Q as W,Z as a,ie as b,y as d,me as r,ne as w};
