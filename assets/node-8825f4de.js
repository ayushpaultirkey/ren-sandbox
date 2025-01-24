var V=Object.defineProperty;var F=(o,s,t)=>s in o?V(o,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[s]=t;var y=(o,s,t)=>(F(o,typeof s!="symbol"?s+"":s,t),t),v=(o,s,t)=>{if(!s.has(o))throw TypeError("Cannot "+t)};var r=(o,s,t)=>(v(o,s,"read from private field"),t?t.call(o):s.get(o)),c=(o,s,t)=>{if(s.has(o))throw TypeError("Cannot add the same private member more than once");s instanceof WeakSet?s.add(o):s.set(o,t)},d=(o,s,t,e)=>(v(o,s,"write to private field"),e?e.call(o,t):s.set(o,t),t);var l;class M{constructor(){c(this,l,new Map)}on(s,t){r(this,l).has(s)||r(this,l).set(s,[]),r(this,l).get(s).push(t)}off(s,t){r(this,l).has(s)&&r(this,l).set(s,r(this,l).get(s).filter(e=>e!==t))}emit(s,...t){r(this,l).has(s)&&r(this,l).get(s).forEach(e=>e(...t))}once(s,t){const e=(...n)=>{this.off(s,e),t(...n)};this.on(s,e)}clear(s){r(this,l).has(s)&&(r(this,l).delete(s),console.warn(`Event ${s} cleared`))}clearAll(){r(this,l).clear(),console.warn("Event handler cleared")}}l=new WeakMap;var R,U,O,x;class D{constructor({uuid:s=crypto.randomUUID(),outer:t=null,name:e=null}={}){c(this,R,null);c(this,U,null);c(this,O,null);c(this,x,new M);d(this,R,s),d(this,U,t),d(this,O,e)}main(){}destroy(){r(this,x).clearAll()}get dispatcher(){return r(this,x)}get uuid(){return r(this,R)}get name(){return r(this,O)}get outer(){return r(this,U)}get meta(){return this.constructor.meta}static getMeta(){return this.meta}}R=new WeakMap,U=new WeakMap,O=new WeakMap,x=new WeakMap,y(D,"meta",{className:"IObject.IObject",displayName:"Object",description:"Object"});var h,N,L,P;const g=class g extends D{constructor({uuid:t=crypto.randomUUID(),outer:e=null,name:n=null,type:i=null,isRuntime:a=!1}={}){super({uuid:t,outer:e,name:n});c(this,h,[]);c(this,N,null);c(this,L,!1);c(this,P,null);d(this,N,i),d(this,h,[]),d(this,L,a),this.subType=-1,this.validSubTypes=new Set([]),this.maxLinks=1}get links(){return r(this,h)}get type(){return r(this,N)}get isRuntime(){return r(this,L)}getValue(){if(r(this,N)==g.TYPES.INPUT){const t=r(this,h)[0];if(!t)return null;const e=t.getNode();return e?(e.meta.canCache||e.execute(),t.getValue()):null}else return r(this,P)}getValues(){if(r(this,N)==g.TYPES.INPUT){const t=[];return r(this,h).forEach(e=>{if(e){const n=e.getValue();if(!n)return;t.push(n)}}),t}else return[r(this,P)]}setValue(t){if(r(this,N)==g.TYPES.INPUT){console.error("Cannot set input value");return}d(this,P,t)}getNode(){return this.outer}isAnyLinked(){return r(this,h).length>0}isLinked(t=0){return!!this.getLink(t)}getLink(t){return r(this,h)[t]}getLinkedNode(t){const e=this.getLink(t);return e?e.outer:null}canLinkTo(t){if(!t||!t.type||!t.outer||t.type==r(this,N)){console.error("Invalid socket, type, or same socket type");return}if(t.outer==this.outer){console.error("Source and target sockets are the same");return}if(r(this,N)==g.TYPES.INPUT&&!this.validSubTypes.has(t.subType)){console.error("Invalid sub-socket type");return}if(r(this,h).length>=this.maxLinks){console.error("Link limit failed");return}return!0}link(t){r(this,h).push(t)}unlink(t){d(this,h,r(this,h).filter(e=>e!=t))}clear(){d(this,h,[])}export(){let t=[];return this.type!==g.TYPES.OUTPUT||this.links.forEach(e=>{!e||!e.outer||!this.outer||t.push({sourceNode:this.outer.uuid,sourceSocket:this.uuid,targetNode:e.outer.uuid,targetSocket:e.uuid})}),t}};h=new WeakMap,N=new WeakMap,L=new WeakMap,P=new WeakMap,y(g,"meta",{className:"IObject.Socket",displayName:"Socket",displayColor:"gray"}),y(g,"TYPES",{INPUT:1,OUTPUT:2});let m=g;var S;class C extends D{constructor({uuid:t=crypto.randomUUID(),outer:e=null,type:n=null,value:i=null,custom:a={}}={}){super({uuid:t,outer:e});c(this,S,null);d(this,S,n),this.value=i,this.custom=a||{},this.custom.name=a.name||this.name,this.handler={}}get type(){return r(this,S)}export(){return{type:r(this,S),value:this.value,custom:this.custom}}}S=new WeakMap,y(C,"meta",{className:"IObject.IProperty",displayName:"Data"});const u={STRING:"STRING",BOOLEAN:"BOOLEAN",INTEGER:"INTEGER",FLOAT:"FLOAT",WILDCARD:"WILDCARD"},w={OBJECT:"OBJECT",GRAPH:"GRAPH",GRAPH_SET:"GRAPH_SET",REFERENCE:"REFERENCE"},$={FUNCTION:"FUNCTION",EVENT:"EVENT"};var T;class G extends D{constructor({uuid:t=crypto.randomUUID(),outer:e=null,name:n="Property Manager"}={}){super({uuid:t,outer:e,name:n});c(this,T,new Map)}main(t={}){try{for(const e in t){const n=t[e],i=n.type,a=n.value,E=n.custom;this.addProperty(e,i,a,E)}}catch(e){console.error(e)}}get properties(){return r(this,T)}addProperty(t,e,n=null,i={}){try{if(r(this,T).has(t))throw new Error(`PropertyManager: Property "${t}" already exists`);const a=u[e]||w[e];if(!a)throw new Error(`PropertyManager: Invalid type "${e}"`);const E=new C({uuid:t,outer:this,type:a,value:n,custom:i});r(this,T).set(t,E),this.dispatcher.emit("propertyAdded",E)}catch(a){console.error(a)}}removeProperty(t){return r(this,T).delete(t)?(this.dispatcher.emit("propertyRemoved",t),!0):!1}getProperty(t){try{if(!r(this,T).has(t))throw new Error(`PropertyManager: Property "${t}" does not exist`);return r(this,T).get(t)}catch(e){console.error(e)}}setProperty(t,e){try{if(!r(this,T).has(t))throw new Error(`PropertyManager: Property "${t}" does not exist`);const n=this.getProperty(t);n.value=e}catch(n){console.error(n)}}export(){const t=r(this,T),e={};for(const[n,i]of t){const a=i.export();a&&(e[n]=a)}return e}}T=new WeakMap,y(G,"meta",{className:"IObject.PropertyManager",displayName:"Property Manager"});class Y extends m{constructor({uuid:s=crypto.randomUUID(),outer:t=null,name:e="wildcard",type:n=null,isRuntime:i=!1}){super({uuid:s,outer:t,name:e,type:n,isRuntime:i}),this.subType=u.WILDCARD,this.validSubTypes=new Set([u.WILDCARD,u.BOOLEAN,u.STRING,u.INTEGER,u.FLOAT,w.OBJECT,w.GRAPH_SET]),this.maxLinks=n==m.TYPES.OUTPUT?100:1}}y(Y,"meta",{className:"ISocket.WildcardSocket",displayName:"Float",displayColor:"#607d8b"});class j extends m{constructor({uuid:s=crypto.randomUUID(),outer:t=null,name:e="integer",type:n=null,isRuntime:i=!1}){super({uuid:s,outer:t,name:e,type:n,isRuntime:i}),this.subType=u.INTEGER,this.validSubTypes=new Set([u.INTEGER,u.FLOAT]),this.maxLinks=n==m.TYPES.OUTPUT?100:1}setValue(s){const t=isNaN(s)?null:parseInt(s);super.setValue(t)}}y(j,"meta",{className:"ISocket.IntegerSocket",displayName:"Integer",displayColor:"#00a73e"});class W extends m{constructor({uuid:s=crypto.randomUUID(),outer:t=null,name:e="float",type:n=null,isRuntime:i=!1}){super({uuid:s,outer:t,name:e,type:n,isRuntime:i}),this.subType=u.FLOAT,this.validSubTypes=new Set([u.INTEGER,u.FLOAT]),this.maxLinks=n==m.TYPES.OUTPUT?100:1}setValue(s){const t=isNaN(s)?null:parseFloat(s);super.setValue(t)}}y(W,"meta",{className:"ISocket.FloatSocket",displayName:"Float",displayColor:"#059669"});class A extends m{constructor({uuid:s=crypto.randomUUID(),outer:t=null,name:e="string",type:n=null,isRuntime:i=!1}){super({uuid:s,outer:t,name:e,type:n,isRuntime:i}),this.subType=u.STRING,this.validSubTypes=new Set([u.STRING,u.WILDCARD]),this.maxLinks=n==m.TYPES.OUTPUT?100:1}setValue(s){const t=s?s.toString():null;super.setValue(t)}}y(A,"meta",{className:"ISocket.StringSocket",displayName:"String",displayColor:"#d946ef"});var I,f,p;class B extends D{constructor({uuid:t=crypto.randomUUID(),outer:e=null}={}){super({uuid:t,outer:e});c(this,I,null);c(this,f,{});c(this,p,{});this.custom={},this.isEntry=!1,d(this,I,new G({outer:this}))}get propertyManager(){return r(this,I)}get inputs(){return r(this,f)}get outputs(){return r(this,p)}main({properties:t={},custom:e={},inputs:n={},outputs:i={}}={}){try{e&&(this.custom=e);for(const a in n){const E=n[a],b=A;this.addInput(a,E.name,b,!0)}for(const a in i){const E=i[a],b=A;this.addOutput(a,E.name,b,!0)}for(const a in t){const E=t[a];r(this,I).setProperty(a,E.value)}return!0}catch(a){console.error(a)}}addInput(t,e,n,i=!1){if(!n||r(this,f)[t])return null;const a=new n({uuid:t,outer:this,name:e,type:m.TYPES.INPUT,isRuntime:i});return r(this,f)[t]=a,a}removeInput(t){if(r(this,f)[t].isRuntime)return delete r(this,f)[t],!0;console.error("Cannot remove static socket")}addOutput(t,e,n,i=!1){if(!n){console.error("Invalid socket class");return}if(r(this,p)[t]){console.error("Socket already exists");return}const a=new n({uuid:t,outer:this,name:e,type:m.TYPES.OUTPUT,isRuntime:i});return r(this,p)[t]=a,a}removeOutput(t){if(r(this,p)[t].isRuntime)return delete r(this,p)[t],!0;console.error("Cannot remove static socket")}getInput(t){return r(this,f)[t]}getOutput(t){return r(this,p)[t]}getSocket(t){return this.getInput(t)||this.getOutput(t)}execute(){}executeLinkedNode(t,e=0){const n=this.getSocket(t);if(n&&n.isLinked(e)){const i=n.getLinkedNode(e);i&&i.execute()}}customExport(){return null}export(){const t={class:this.meta.className,properties:r(this,I).export(),custom:this.custom||{},inputs:{},outputs:{}};for(const n in r(this,f)){const i=r(this,f)[n];i.isRuntime&&(t.inputs[n]={name:i.name||"in",type:i.subType})}for(const n in r(this,p)){const i=r(this,p)[n];i.isRuntime&&(t.outputs[n]={name:i.name||"out",type:i.subType})}let e=[];for(const n in r(this,p)){const i=r(this,p)[n];e=e.concat(i.export())}return{data:t,links:e}}}I=new WeakMap,f=new WeakMap,p=new WeakMap,y(B,"meta",{className:"IObject.INode",displayName:"Node",canCache:!0});const k=new Map,J={register:function(o){const s=o.meta.className;k.set(s,o)},registerMany:function(o=[]){for(const s of o)this.register(s)},unregister:function(o){const s=o.meta.className;return k.delete(s)},unregisterMany:function(o=[]){for(const s of o)this.unregister(s)},get:function(o){return k.get(o)},getAll:function(){return k.entries()},isRegistered:function(o){return k.has(o)}};export{$ as D,W as F,m as I,J as N,u as P,A as S,w as U,Y as W,B as a,j as b,D as c,G as d};
