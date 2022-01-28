"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var re=require("fs"),ne=require("crypto");function z(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}var ae=z(re),ie=z(ne),S=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},V="Expected a function",H=0/0,oe="[object Symbol]",se=/^\s+|\s+$/g,le=/^[-+]0x[0-9a-f]+$/i,fe=/^0b[01]+$/i,ue=/^0o[0-7]+$/i,ce=parseInt,ge=typeof S=="object"&&S&&S.Object===Object&&S,de=typeof self=="object"&&self&&self.Object===Object&&self,ye=ge||de||Function("return this")(),pe=Object.prototype,ve=pe.toString,he=Math.max,be=Math.min,x=function(){return ye.Date.now()};function me(e,t,r){var n,a,i,o,s,c,g=0,f=!1,y=!1,m=!0;if(typeof e!="function")throw new TypeError(V);t=J(t)||0,P(r)&&(f=!!r.leading,y="maxWait"in r,i=y?he(J(r.maxWait)||0,t):i,m="trailing"in r?!!r.trailing:m);function p(l){var v=n,O=a;return n=a=void 0,g=l,o=e.apply(O,v),o}function R(l){return g=l,s=setTimeout(w,t),f?p(l):o}function Z(l){var v=l-c,O=l-g,C=t-v;return y?be(C,i-O):C}function W(l){var v=l-c,O=l-g;return c===void 0||v>=t||v<0||y&&O>=i}function w(){var l=x();if(W(l))return N(l);s=setTimeout(w,Z(l))}function N(l){return s=void 0,m&&n?p(l):(n=a=void 0,o)}function ee(){s!==void 0&&clearTimeout(s),g=0,n=c=a=s=void 0}function te(){return s===void 0?o:N(x())}function F(){var l=x(),v=W(l);if(n=arguments,a=this,c=l,v){if(s===void 0)return R(c);if(y)return s=setTimeout(w,t),p(c)}return s===void 0&&(s=setTimeout(w,t)),o}return F.cancel=ee,F.flush=te,F}function Oe(e,t,r){var n=!0,a=!0;if(typeof e!="function")throw new TypeError(V);return P(r)&&(n="leading"in r?!!r.leading:n,a="trailing"in r?!!r.trailing:a),me(e,t,{leading:n,maxWait:t,trailing:a})}function P(e){var t=typeof e;return!!e&&(t=="object"||t=="function")}function Re(e){return!!e&&typeof e=="object"}function we(e){return typeof e=="symbol"||Re(e)&&ve.call(e)==oe}function J(e){if(typeof e=="number")return e;if(we(e))return H;if(P(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=P(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=e.replace(se,"");var r=fe.test(e);return r||ue.test(e)?ce(e.slice(2),r?2:8):le.test(e)?H:+e}var Se=Oe,A=new WeakMap,L=Symbol("iteration key");function Pe(e){A.set(e,new Map)}function Te(e,t){var r=t.target,n=t.key,a=t.type;a==="iterate"&&(n=L);var i=A.get(r),o=i.get(n);o||(o=new Set,i.set(n,o)),o.has(e)||(o.add(e),e.cleaners.push(o))}function Ie(e){var t=e.target,r=e.key,n=e.type,a=A.get(t),i=new Set;if(n==="clear"?a.forEach(function(s,c){E(i,a,c)}):E(i,a,r),n==="add"||n==="delete"||n==="clear"){var o=Array.isArray(t)?"length":L;E(i,a,o)}return i}function E(e,t,r){var n=t.get(r);n&&n.forEach(e.add,e)}function $(e){e.cleaners&&e.cleaners.forEach(je,e),e.cleaners=[]}function je(e){e.delete(this)}var b=[],M=!1;function Fe(e,t,r,n){if(e.unobserved)return Reflect.apply(t,r,n);if(b.indexOf(e)===-1){$(e);try{return b.push(e),Reflect.apply(t,r,n)}finally{b.pop()}}}function d(e){var t=b[b.length-1];t&&(D(t,e),Te(t,e))}function h(e){Ie(e).forEach(xe,e)}function xe(e){D(e,this),typeof e.scheduler=="function"?e.scheduler(e):typeof e.scheduler=="object"?e.scheduler.add(e):e()}function D(e,t){if(e.debugger&&!M)try{M=!0,e.debugger(t)}finally{M=!1}}function U(){return b.length>0}var q=Symbol("is reaction");function Ae(e,t){t===void 0&&(t={});var r=e[q]?e:function n(){return Fe(n,e,this,arguments)};return r.scheduler=t.scheduler,r.debugger=t.debugger,r[q]=!0,t.lazy||r(),r}function Ee(e){e.unobserved||(e.unobserved=!0,$(e)),typeof e.scheduler=="object"&&e.scheduler.delete(e)}var u=new WeakMap,T=new WeakMap,Me=Object.prototype.hasOwnProperty;function I(e){var t=T.get(e);return U()&&typeof e=="object"&&e!==null?t||_(e):t||e}function k(e,t){var r=e.next;return e.next=function(){var n=r.call(e),a=n.done,i=n.value;return a||(t?i[1]=I(i[1]):i=I(i)),{done:a,value:i}},e}var K={has:function(t){var r=u.get(this),n=Reflect.getPrototypeOf(this);return d({target:r,key:t,type:"has"}),n.has.apply(r,arguments)},get:function(t){var r=u.get(this),n=Reflect.getPrototypeOf(this);return d({target:r,key:t,type:"get"}),I(n.get.apply(r,arguments))},add:function(t){var r=u.get(this),n=Reflect.getPrototypeOf(this),a=n.has.call(r,t),i=n.add.apply(r,arguments);return a||h({target:r,key:t,value:t,type:"add"}),i},set:function(t,r){var n=u.get(this),a=Reflect.getPrototypeOf(this),i=a.has.call(n,t),o=a.get.call(n,t),s=a.set.apply(n,arguments);return i?r!==o&&h({target:n,key:t,value:r,oldValue:o,type:"set"}):h({target:n,key:t,value:r,type:"add"}),s},delete:function(t){var r=u.get(this),n=Reflect.getPrototypeOf(this),a=n.has.call(r,t),i=n.get?n.get.call(r,t):void 0,o=n.delete.apply(r,arguments);return a&&h({target:r,key:t,oldValue:i,type:"delete"}),o},clear:function(){var t=u.get(this),r=Reflect.getPrototypeOf(this),n=t.size!==0,a=t instanceof Map?new Map(t):new Set(t),i=r.clear.apply(t,arguments);return n&&h({target:t,oldTarget:a,type:"clear"}),i},forEach:function(t){for(var r=[],n=arguments.length-1;n-- >0;)r[n]=arguments[n+1];var a=u.get(this),i=Reflect.getPrototypeOf(this);d({target:a,type:"iterate"});var o=function(c){for(var g=[],f=arguments.length-1;f-- >0;)g[f]=arguments[f+1];return t.apply(void 0,[I(c)].concat(g))};return(s=i.forEach).call.apply(s,[a,o].concat(r));var s},keys:function(){var t=u.get(this),r=Reflect.getPrototypeOf(this);return d({target:t,type:"iterate"}),r.keys.apply(t,arguments)},values:function(){var t=u.get(this),r=Reflect.getPrototypeOf(this);d({target:t,type:"iterate"});var n=r.values.apply(t,arguments);return k(n,!1)},entries:function(){var t=u.get(this),r=Reflect.getPrototypeOf(this);d({target:t,type:"iterate"});var n=r.entries.apply(t,arguments);return k(n,!0)},get size(){var e=u.get(this),t=Reflect.getPrototypeOf(this);return d({target:e,type:"iterate"}),Reflect.get(t,"size",e)}};K[Symbol.iterator]=function(){var e=u.get(this),t=Reflect.getPrototypeOf(this);d({target:e,type:"iterate"});var r=t[Symbol.iterator].apply(e,arguments);return k(r,e instanceof Map)};var j={get:function(t,r,n){return t=Me.call(K,r)?K:t,Reflect.get(t,r,n)}},B=typeof window=="object"?window:Function("return this")(),G=new Map([[Map,j],[Set,j],[WeakMap,j],[WeakSet,j],[Object,!1],[Array,!1],[Int8Array,!1],[Uint8Array,!1],[Uint8ClampedArray,!1],[Int16Array,!1],[Uint16Array,!1],[Int32Array,!1],[Uint32Array,!1],[Float32Array,!1],[Float64Array,!1]]);function ke(e){var t=e.constructor,r=typeof t=="function"&&t.name in B&&B[t.name]===t;return!r||G.has(t)}function Ke(e){return G.get(e.constructor)}var X=Object.prototype.hasOwnProperty,_e=new Set(Object.getOwnPropertyNames(Symbol).map(function(e){return Symbol[e]}).filter(function(e){return typeof e=="symbol"}));function We(e,t,r){var n=Reflect.get(e,t,r);if(typeof t=="symbol"&&_e.has(t))return n;d({target:e,key:t,receiver:r,type:"get"});var a=T.get(n);if(U()&&typeof n=="object"&&n!==null){if(a)return a;var i=Reflect.getOwnPropertyDescriptor(e,t);if(!i||!(i.writable===!1&&i.configurable===!1))return _(n)}return a||n}function Ne(e,t){var r=Reflect.has(e,t);return d({target:e,key:t,type:"has"}),r}function Ce(e){return d({target:e,type:"iterate"}),Reflect.ownKeys(e)}function ze(e,t,r,n){typeof r=="object"&&r!==null&&(r=u.get(r)||r);var a=X.call(e,t),i=e[t],o=Reflect.set(e,t,r,n);return e!==u.get(n)||(a?r!==i&&h({target:e,key:t,value:r,oldValue:i,receiver:n,type:"set"}):h({target:e,key:t,value:r,receiver:n,type:"add"})),o}function Ve(e,t){var r=X.call(e,t),n=e[t],a=Reflect.deleteProperty(e,t);return r&&h({target:e,key:t,oldValue:n,type:"delete"}),a}var He={get:We,has:Ne,ownKeys:Ce,set:ze,deleteProperty:Ve};function _(e){return e===void 0&&(e={}),u.has(e)||!ke(e)?e:T.get(e)||Je(e)}function Je(e){var t=Ke(e)||He,r=new Proxy(e,t);return T.set(e,r),u.set(r,e),Pe(e),r}const Y=e=>ie.default.createHash("sha1").update(e).digest("base64"),Le=e=>JSON.stringify(e),$e=e=>JSON.parse(e),De=(e,t)=>{try{return e.readFileSync(t,"utf-8").toString()}catch{}return null},Q=new WeakMap;function Ue(e,t={}){const{fs:r=ae.default,serialize:n=Le,deserialize:a=$e,throttle:i,default:o}=t;let s,c=()=>{const p=n(f),R=Y(p);s!==R&&(r.writeFileSync(e,p),s=R)};typeof i=="number"&&(c=Se(c,i));const g=De(r,e);let f;g===null?o?f=o:(f={},s=Y(n(f))):f=a(g),f=_(f);let y;const m=Ae(c,{scheduler(p){y=p,process.nextTick(()=>{y&&(y(),y=void 0)})}});return Q.set(f,m),f}function qe(e){const t=Q.get(e);t&&Ee(t)}exports.closeJson=qe,exports.openJson=Ue;