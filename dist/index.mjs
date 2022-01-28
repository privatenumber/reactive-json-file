import te from"fs";import re from"crypto";var S=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},V="Expected a function",H=0/0,ne="[object Symbol]",ae=/^\s+|\s+$/g,ie=/^[-+]0x[0-9a-f]+$/i,oe=/^0b[01]+$/i,se=/^0o[0-7]+$/i,le=parseInt,fe=typeof S=="object"&&S&&S.Object===Object&&S,ue=typeof self=="object"&&self&&self.Object===Object&&self,ce=fe||ue||Function("return this")(),ge=Object.prototype,de=ge.toString,pe=Math.max,ye=Math.min,j=function(){return ce.Date.now()};function ve(e,t,r){var n,a,i,o,s,c,g=0,f=!1,p=!1,m=!0;if(typeof e!="function")throw new TypeError(V);t=_(t)||0,T(r)&&(f=!!r.leading,p="maxWait"in r,i=p?pe(_(r.maxWait)||0,t):i,m="trailing"in r?!!r.trailing:m);function y(l){var v=n,O=a;return n=a=void 0,g=l,o=e.apply(O,v),o}function R(l){return g=l,s=setTimeout(w,t),f?y(l):o}function Q(l){var v=l-c,O=l-g,z=t-v;return p?ye(z,i-O):z}function N(l){var v=l-c,O=l-g;return c===void 0||v>=t||v<0||p&&O>=i}function w(){var l=j();if(N(l))return C(l);s=setTimeout(w,Q(l))}function C(l){return s=void 0,m&&n?y(l):(n=a=void 0,o)}function Z(){s!==void 0&&clearTimeout(s),g=0,n=c=a=s=void 0}function ee(){return s===void 0?o:C(j())}function F(){var l=j(),v=N(l);if(n=arguments,a=this,c=l,v){if(s===void 0)return R(c);if(p)return s=setTimeout(w,t),y(c)}return s===void 0&&(s=setTimeout(w,t)),o}return F.cancel=Z,F.flush=ee,F}function he(e,t,r){var n=!0,a=!0;if(typeof e!="function")throw new TypeError(V);return T(r)&&(n="leading"in r?!!r.leading:n,a="trailing"in r?!!r.trailing:a),ve(e,t,{leading:n,maxWait:t,trailing:a})}function T(e){var t=typeof e;return!!e&&(t=="object"||t=="function")}function be(e){return!!e&&typeof e=="object"}function me(e){return typeof e=="symbol"||be(e)&&de.call(e)==ne}function _(e){if(typeof e=="number")return e;if(me(e))return H;if(T(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=T(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=e.replace(ae,"");var r=oe.test(e);return r||se.test(e)?le(e.slice(2),r?2:8):ie.test(e)?H:+e}var Oe=he,A=new WeakMap,$=Symbol("iteration key");function Re(e){A.set(e,new Map)}function we(e,t){var r=t.target,n=t.key,a=t.type;a==="iterate"&&(n=$);var i=A.get(r),o=i.get(n);o||(o=new Set,i.set(n,o)),o.has(e)||(o.add(e),e.cleaners.push(o))}function Se(e){var t=e.target,r=e.key,n=e.type,a=A.get(t),i=new Set;if(n==="clear"?a.forEach(function(s,c){E(i,a,c)}):E(i,a,r),n==="add"||n==="delete"||n==="clear"){var o=Array.isArray(t)?"length":$;E(i,a,o)}return i}function E(e,t,r){var n=t.get(r);n&&n.forEach(e.add,e)}function L(e){e.cleaners&&e.cleaners.forEach(Te,e),e.cleaners=[]}function Te(e){e.delete(this)}var b=[],M=!1;function Pe(e,t,r,n){if(e.unobserved)return Reflect.apply(t,r,n);if(b.indexOf(e)===-1){L(e);try{return b.push(e),Reflect.apply(t,r,n)}finally{b.pop()}}}function d(e){var t=b[b.length-1];t&&(U(t,e),we(t,e))}function h(e){Se(e).forEach(Ie,e)}function Ie(e){U(e,this),typeof e.scheduler=="function"?e.scheduler(e):typeof e.scheduler=="object"?e.scheduler.add(e):e()}function U(e,t){if(e.debugger&&!M)try{M=!0,e.debugger(t)}finally{M=!1}}function B(){return b.length>0}var D=Symbol("is reaction");function xe(e,t){t===void 0&&(t={});var r=e[D]?e:function n(){return Pe(n,e,this,arguments)};return r.scheduler=t.scheduler,r.debugger=t.debugger,r[D]=!0,t.lazy||r(),r}function Fe(e){e.unobserved||(e.unobserved=!0,L(e)),typeof e.scheduler=="object"&&e.scheduler.delete(e)}var u=new WeakMap,P=new WeakMap,je=Object.prototype.hasOwnProperty;function I(e){var t=P.get(e);return B()&&typeof e=="object"&&e!==null?t||W(e):t||e}function k(e,t){var r=e.next;return e.next=function(){var n=r.call(e),a=n.done,i=n.value;return a||(t?i[1]=I(i[1]):i=I(i)),{done:a,value:i}},e}var K={has:function(t){var r=u.get(this),n=Reflect.getPrototypeOf(this);return d({target:r,key:t,type:"has"}),n.has.apply(r,arguments)},get:function(t){var r=u.get(this),n=Reflect.getPrototypeOf(this);return d({target:r,key:t,type:"get"}),I(n.get.apply(r,arguments))},add:function(t){var r=u.get(this),n=Reflect.getPrototypeOf(this),a=n.has.call(r,t),i=n.add.apply(r,arguments);return a||h({target:r,key:t,value:t,type:"add"}),i},set:function(t,r){var n=u.get(this),a=Reflect.getPrototypeOf(this),i=a.has.call(n,t),o=a.get.call(n,t),s=a.set.apply(n,arguments);return i?r!==o&&h({target:n,key:t,value:r,oldValue:o,type:"set"}):h({target:n,key:t,value:r,type:"add"}),s},delete:function(t){var r=u.get(this),n=Reflect.getPrototypeOf(this),a=n.has.call(r,t),i=n.get?n.get.call(r,t):void 0,o=n.delete.apply(r,arguments);return a&&h({target:r,key:t,oldValue:i,type:"delete"}),o},clear:function(){var t=u.get(this),r=Reflect.getPrototypeOf(this),n=t.size!==0,a=t instanceof Map?new Map(t):new Set(t),i=r.clear.apply(t,arguments);return n&&h({target:t,oldTarget:a,type:"clear"}),i},forEach:function(t){for(var r=[],n=arguments.length-1;n-- >0;)r[n]=arguments[n+1];var a=u.get(this),i=Reflect.getPrototypeOf(this);d({target:a,type:"iterate"});var o=function(c){for(var g=[],f=arguments.length-1;f-- >0;)g[f]=arguments[f+1];return t.apply(void 0,[I(c)].concat(g))};return(s=i.forEach).call.apply(s,[a,o].concat(r));var s},keys:function(){var t=u.get(this),r=Reflect.getPrototypeOf(this);return d({target:t,type:"iterate"}),r.keys.apply(t,arguments)},values:function(){var t=u.get(this),r=Reflect.getPrototypeOf(this);d({target:t,type:"iterate"});var n=r.values.apply(t,arguments);return k(n,!1)},entries:function(){var t=u.get(this),r=Reflect.getPrototypeOf(this);d({target:t,type:"iterate"});var n=r.entries.apply(t,arguments);return k(n,!0)},get size(){var e=u.get(this),t=Reflect.getPrototypeOf(this);return d({target:e,type:"iterate"}),Reflect.get(t,"size",e)}};K[Symbol.iterator]=function(){var e=u.get(this),t=Reflect.getPrototypeOf(this);d({target:e,type:"iterate"});var r=t[Symbol.iterator].apply(e,arguments);return k(r,e instanceof Map)};var x={get:function(t,r,n){return t=je.call(K,r)?K:t,Reflect.get(t,r,n)}},J=typeof window=="object"?window:Function("return this")(),q=new Map([[Map,x],[Set,x],[WeakMap,x],[WeakSet,x],[Object,!1],[Array,!1],[Int8Array,!1],[Uint8Array,!1],[Uint8ClampedArray,!1],[Int16Array,!1],[Uint16Array,!1],[Int32Array,!1],[Uint32Array,!1],[Float32Array,!1],[Float64Array,!1]]);function Ae(e){var t=e.constructor,r=typeof t=="function"&&t.name in J&&J[t.name]===t;return!r||q.has(t)}function Ee(e){return q.get(e.constructor)}var G=Object.prototype.hasOwnProperty,Me=new Set(Object.getOwnPropertyNames(Symbol).map(function(e){return Symbol[e]}).filter(function(e){return typeof e=="symbol"}));function ke(e,t,r){var n=Reflect.get(e,t,r);if(typeof t=="symbol"&&Me.has(t))return n;d({target:e,key:t,receiver:r,type:"get"});var a=P.get(n);if(B()&&typeof n=="object"&&n!==null){if(a)return a;var i=Reflect.getOwnPropertyDescriptor(e,t);if(!i||!(i.writable===!1&&i.configurable===!1))return W(n)}return a||n}function Ke(e,t){var r=Reflect.has(e,t);return d({target:e,key:t,type:"has"}),r}function We(e){return d({target:e,type:"iterate"}),Reflect.ownKeys(e)}function Ne(e,t,r,n){typeof r=="object"&&r!==null&&(r=u.get(r)||r);var a=G.call(e,t),i=e[t],o=Reflect.set(e,t,r,n);return e!==u.get(n)||(a?r!==i&&h({target:e,key:t,value:r,oldValue:i,receiver:n,type:"set"}):h({target:e,key:t,value:r,receiver:n,type:"add"})),o}function Ce(e,t){var r=G.call(e,t),n=e[t],a=Reflect.deleteProperty(e,t);return r&&h({target:e,key:t,oldValue:n,type:"delete"}),a}var ze={get:ke,has:Ke,ownKeys:We,set:Ne,deleteProperty:Ce};function W(e){return e===void 0&&(e={}),u.has(e)||!Ae(e)?e:P.get(e)||Ve(e)}function Ve(e){var t=Ee(e)||ze,r=new Proxy(e,t);return P.set(e,r),u.set(r,e),Re(e),r}const X=e=>re.createHash("sha1").update(e).digest("base64"),He=e=>JSON.stringify(e),_e=e=>JSON.parse(e),$e=(e,t)=>{try{return e.readFileSync(t,"utf-8").toString()}catch{}return null},Y=new WeakMap;function Le(e,t={}){const{fs:r=te,serialize:n=He,deserialize:a=_e,throttle:i,default:o}=t;let s,c=()=>{const y=n(f),R=X(y);s!==R&&(r.writeFileSync(e,y),s=R)};typeof i=="number"&&(c=Oe(c,i));const g=$e(r,e);let f;g===null?o?f=o:(f={},s=X(n(f))):f=a(g),f=W(f);let p;const m=xe(c,{scheduler(y){p=y,process.nextTick(()=>{p&&(p(),p=void 0)})}});return Y.set(f,m),f}function Ue(e){const t=Y.get(e);t&&Fe(t)}export{Ue as closeJson,Le as openJson};
