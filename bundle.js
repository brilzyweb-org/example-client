var yt=Object.defineProperty;var Ue=e=>{throw TypeError(e)};var wt=(e,t,r)=>t in e?yt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var p=(e,t,r)=>wt(e,typeof t!="symbol"?t+"":t,r),_e=(e,t,r)=>t.has(e)||Ue("Cannot "+r);var c=(e,t,r)=>(_e(e,t,"read from private field"),r?r.call(e):t.get(e)),g=(e,t,r)=>t.has(e)?Ue("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),f=(e,t,r,n)=>(_e(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),y=(e,t,r)=>(_e(e,t,"access private method"),r);var Xe=(e,t,r,n)=>({set _(s){f(e,t,s,r)},get _(){return c(e,t,n)}});function Qe(e,t={},r){var u,d,m;if(!e)return"";const n=(d=(u=r==null?void 0:r.env)==null?void 0:u.ASSETS_URL)==null?void 0:d.includes("localhost");if(e.startsWith("/")&&n)return`${r.env.ASSETS_URL}${e}`;if(e.startsWith("http://localhost")||e.startsWith("http://127.0.0.1"))return e;const{width:s,height:i,quality:l=80,format:a="webp"}=t,o=new URLSearchParams;s&&o.append("w",s),i&&o.append("h",i),o.append("q",l),o.append("output",a);const h=e.startsWith("http")?e:`${((m=r==null?void 0:r.env)==null?void 0:m.R2_PUBLIC_URL)||"https://cdn.example.com"}/${e.replace(/^\//,"")}`;return`https://images.weserv.nl/?${o.toString()}&url=${encodeURIComponent(h)}`}var Ke=(e,t,r)=>(n,s)=>{let i=-1;return l(0);async function l(a){if(a<=i)throw new Error("next() called multiple times");i=a;let o,h=!1,u;if(e[a]?(u=e[a][0][0],n.req.routeIndex=a):u=a===e.length&&s||void 0,u)try{o=await u(n,()=>l(a+1))}catch(d){if(d instanceof Error&&t)n.error=d,o=await t(d,n),h=!0;else throw d}else n.finalized===!1&&r&&(o=await r(n));return o&&(n.finalized===!1||h)&&(n.res=o),n}},vt=Symbol(),Rt=async(e,t=Object.create(null))=>{const{all:r=!1,dot:n=!1}=t,i=(e instanceof st?e.raw.headers:e.headers).get("Content-Type");return i!=null&&i.startsWith("multipart/form-data")||i!=null&&i.startsWith("application/x-www-form-urlencoded")?bt(e,{all:r,dot:n}):{}};async function bt(e,t){const r=await e.formData();return r?Tt(r,t):{}}function Tt(e,t){const r=Object.create(null);return e.forEach((n,s)=>{t.all||s.endsWith("[]")?$t(r,s,n):r[s]=n}),t.dot&&Object.entries(r).forEach(([n,s])=>{n.includes(".")&&(St(r,n,s),delete r[n])}),r}var $t=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},St=(e,t,r)=>{let n=e;const s=t.split(".");s.forEach((i,l)=>{l===s.length-1?n[i]=r:((!n[i]||typeof n[i]!="object"||Array.isArray(n[i])||n[i]instanceof File)&&(n[i]=Object.create(null)),n=n[i])})},Ze=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Ot=e=>{const{groups:t,path:r}=At(e),n=Ze(r);return jt(n,t)},At=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,n)=>{const s=`@${n}`;return t.push([s,r]),s}),{groups:t,path:e}},jt=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[n]=t[r];for(let s=e.length-1;s>=0;s--)if(e[s].includes(n)){e[s]=e[s].replace(n,t[r][1]);break}}return e},Oe={},Nt=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const n=`${e}#${t}`;return Oe[n]||(r[2]?Oe[n]=t&&t[0]!==":"&&t[0]!=="*"?[n,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:Oe[n]=[e,r[1],!0]),Oe[n]}return null},ke=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},xt=e=>ke(e,decodeURI),et=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let n=r;for(;n<t.length;n++){const s=t.charCodeAt(n);if(s===37){const i=t.indexOf("?",n),l=t.slice(r,i===-1?void 0:i);return xt(l.includes("%25")?l.replace(/%25/g,"%2525"):l)}else if(s===63)break}return t.slice(r,n)},It=e=>{const t=et(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},oe=(e,t,...r)=>(r.length&&(t=oe(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),tt=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let n="";return t.forEach(s=>{if(s!==""&&!/\:/.test(s))n+="/"+s;else if(/\:/.test(s))if(/\?/.test(s)){r.length===0&&n===""?r.push("/"):r.push(n);const i=s.replace("?","");n+="/"+i,r.push(n)}else n+="/"+s}),r.filter((s,i,l)=>l.indexOf(s)===i)},De=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?ke(e,nt):e):e,rt=(e,t,r)=>{let n;if(!r&&t&&!/[%+]/.test(t)){let l=e.indexOf("?",8);if(l===-1)return;for(e.startsWith(t,l+1)||(l=e.indexOf(`&${t}`,l+1));l!==-1;){const a=e.charCodeAt(l+t.length+1);if(a===61){const o=l+t.length+2,h=e.indexOf("&",o);return De(e.slice(o,h===-1?void 0:h))}else if(a==38||isNaN(a))return"";l=e.indexOf(`&${t}`,l+1)}if(n=/[%+]/.test(e),!n)return}const s={};n??(n=/[%+]/.test(e));let i=e.indexOf("?",8);for(;i!==-1;){const l=e.indexOf("&",i+1);let a=e.indexOf("=",i);a>l&&l!==-1&&(a=-1);let o=e.slice(i+1,a===-1?l===-1?void 0:l:a);if(n&&(o=De(o)),i=l,o==="")continue;let h;a===-1?h="":(h=e.slice(a+1,l===-1?void 0:l),n&&(h=De(h))),r?(s[o]&&Array.isArray(s[o])||(s[o]=[]),s[o].push(h)):s[o]??(s[o]=h)}return t?s[t]:s},Pt=rt,Ct=(e,t)=>rt(e,t,!0),nt=decodeURIComponent,Ye=e=>ke(e,nt),le,A,U,it,ot,Me,Y,qe,st=(qe=class{constructor(e,t="/",r=[[]]){g(this,U);p(this,"raw");g(this,le);g(this,A);p(this,"routeIndex",0);p(this,"path");p(this,"bodyCache",{});g(this,Y,e=>{const{bodyCache:t,raw:r}=this,n=t[e];if(n)return n;const s=Object.keys(t)[0];return s?t[s].then(i=>(s==="json"&&(i=JSON.stringify(i)),new Response(i)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,f(this,A,r),f(this,le,{})}param(e){return e?y(this,U,it).call(this,e):y(this,U,ot).call(this)}query(e){return Pt(this.url,e)}queries(e){return Ct(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,n)=>{t[n]=r}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await Rt(this,e))}json(){return c(this,Y).call(this,"text").then(e=>JSON.parse(e))}text(){return c(this,Y).call(this,"text")}arrayBuffer(){return c(this,Y).call(this,"arrayBuffer")}blob(){return c(this,Y).call(this,"blob")}formData(){return c(this,Y).call(this,"formData")}addValidatedData(e,t){c(this,le)[e]=t}valid(e){return c(this,le)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[vt](){return c(this,A)}get matchedRoutes(){return c(this,A)[0].map(([[,e]])=>e)}get routePath(){return c(this,A)[0].map(([[,e]])=>e)[this.routeIndex].path}},le=new WeakMap,A=new WeakMap,U=new WeakSet,it=function(e){const t=c(this,A)[0][this.routeIndex][1][e],r=y(this,U,Me).call(this,t);return r&&/\%/.test(r)?Ye(r):r},ot=function(){const e={},t=Object.keys(c(this,A)[0][this.routeIndex][1]);for(const r of t){const n=y(this,U,Me).call(this,c(this,A)[0][this.routeIndex][1][r]);n!==void 0&&(e[r]=/\%/.test(n)?Ye(n):n)}return e},Me=function(e){return c(this,A)[1]?c(this,A)[1][e]:e},Y=new WeakMap,qe),Lt={Stringify:1},at=async(e,t,r,n,s)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const i=e.callbacks;return i!=null&&i.length?(s?s[0]+=e:s=[e],Promise.all(i.map(a=>a({phase:t,buffer:s,context:n}))).then(a=>Promise.all(a.filter(Boolean).map(o=>at(o,t,!1,n,s))).then(()=>s[0]))):Promise.resolve(e)},_t="text/plain; charset=UTF-8",He=(e,t)=>({"Content-Type":e,...t}),ve,Re,H,he,M,O,be,ue,de,Q,Te,$e,B,ae,We,Dt=(We=class{constructor(e,t){g(this,B);g(this,ve);g(this,Re);p(this,"env",{});g(this,H);p(this,"finalized",!1);p(this,"error");g(this,he);g(this,M);g(this,O);g(this,be);g(this,ue);g(this,de);g(this,Q);g(this,Te);g(this,$e);p(this,"render",(...e)=>(c(this,ue)??f(this,ue,t=>this.html(t)),c(this,ue).call(this,...e)));p(this,"setLayout",e=>f(this,be,e));p(this,"getLayout",()=>c(this,be));p(this,"setRenderer",e=>{f(this,ue,e)});p(this,"header",(e,t,r)=>{this.finalized&&f(this,O,new Response(c(this,O).body,c(this,O)));const n=c(this,O)?c(this,O).headers:c(this,Q)??f(this,Q,new Headers);t===void 0?n.delete(e):r!=null&&r.append?n.append(e,t):n.set(e,t)});p(this,"status",e=>{f(this,he,e)});p(this,"set",(e,t)=>{c(this,H)??f(this,H,new Map),c(this,H).set(e,t)});p(this,"get",e=>c(this,H)?c(this,H).get(e):void 0);p(this,"newResponse",(...e)=>y(this,B,ae).call(this,...e));p(this,"body",(e,t,r)=>y(this,B,ae).call(this,e,t,r));p(this,"text",(e,t,r)=>!c(this,Q)&&!c(this,he)&&!t&&!r&&!this.finalized?new Response(e):y(this,B,ae).call(this,e,t,He(_t,r)));p(this,"json",(e,t,r)=>y(this,B,ae).call(this,JSON.stringify(e),t,He("application/json",r)));p(this,"html",(e,t,r)=>{const n=s=>y(this,B,ae).call(this,s,t,He("text/html; charset=UTF-8",r));return typeof e=="object"?at(e,Lt.Stringify,!1,{}).then(n):n(e)});p(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});p(this,"notFound",()=>(c(this,de)??f(this,de,()=>new Response),c(this,de).call(this,this)));f(this,ve,e),t&&(f(this,M,t.executionCtx),this.env=t.env,f(this,de,t.notFoundHandler),f(this,$e,t.path),f(this,Te,t.matchResult))}get req(){return c(this,Re)??f(this,Re,new st(c(this,ve),c(this,$e),c(this,Te))),c(this,Re)}get event(){if(c(this,M)&&"respondWith"in c(this,M))return c(this,M);throw Error("This context has no FetchEvent")}get executionCtx(){if(c(this,M))return c(this,M);throw Error("This context has no ExecutionContext")}get res(){return c(this,O)||f(this,O,new Response(null,{headers:c(this,Q)??f(this,Q,new Headers)}))}set res(e){if(c(this,O)&&e){e=new Response(e.body,e);for(const[t,r]of c(this,O).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const n=c(this,O).headers.getSetCookie();e.headers.delete("set-cookie");for(const s of n)e.headers.append("set-cookie",s)}else e.headers.set(t,r)}f(this,O,e),this.finalized=!0}get var(){return c(this,H)?Object.fromEntries(c(this,H)):{}}},ve=new WeakMap,Re=new WeakMap,H=new WeakMap,he=new WeakMap,M=new WeakMap,O=new WeakMap,be=new WeakMap,ue=new WeakMap,de=new WeakMap,Q=new WeakMap,Te=new WeakMap,$e=new WeakMap,B=new WeakSet,ae=function(e,t,r){const n=c(this,O)?new Headers(c(this,O).headers):c(this,Q)??new Headers;if(typeof t=="object"&&"headers"in t){const i=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[l,a]of i)l.toLowerCase()==="set-cookie"?n.append(l,a):n.set(l,a)}if(r)for(const[i,l]of Object.entries(r))if(typeof l=="string")n.set(i,l);else{n.delete(i);for(const a of l)n.append(i,a)}const s=typeof t=="number"?t:(t==null?void 0:t.status)??c(this,he);return new Response(e,{status:s,headers:n})},We),v="ALL",Ht="all",Mt=["get","post","put","delete","options","patch"],ct="Can not add a route since the matcher is already built.",lt=class extends Error{},kt="__COMPOSED_HANDLER",Ft=e=>e.text("404 Not Found",404),Be=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},N,R,ht,x,G,Ae,je,fe,Ut=(fe=class{constructor(t={}){g(this,R);p(this,"get");p(this,"post");p(this,"put");p(this,"delete");p(this,"options");p(this,"patch");p(this,"all");p(this,"on");p(this,"use");p(this,"router");p(this,"getPath");p(this,"_basePath","/");g(this,N,"/");p(this,"routes",[]);g(this,x,Ft);p(this,"errorHandler",Be);p(this,"onError",t=>(this.errorHandler=t,this));p(this,"notFound",t=>(f(this,x,t),this));p(this,"fetch",(t,...r)=>y(this,R,je).call(this,t,r[1],r[0],t.method));p(this,"request",(t,r,n,s)=>t instanceof Request?this.fetch(r?new Request(t,r):t,n,s):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${oe("/",t)}`,r),n,s)));p(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(y(this,R,je).call(this,t.request,t,void 0,t.request.method))})});[...Mt,Ht].forEach(i=>{this[i]=(l,...a)=>(typeof l=="string"?f(this,N,l):y(this,R,G).call(this,i,c(this,N),l),a.forEach(o=>{y(this,R,G).call(this,i,c(this,N),o)}),this)}),this.on=(i,l,...a)=>{for(const o of[l].flat()){f(this,N,o);for(const h of[i].flat())a.map(u=>{y(this,R,G).call(this,h.toUpperCase(),c(this,N),u)})}return this},this.use=(i,...l)=>(typeof i=="string"?f(this,N,i):(f(this,N,"*"),l.unshift(i)),l.forEach(a=>{y(this,R,G).call(this,v,c(this,N),a)}),this);const{strict:n,...s}=t;Object.assign(this,s),this.getPath=n??!0?t.getPath??et:It}route(t,r){const n=this.basePath(t);return r.routes.map(s=>{var l;let i;r.errorHandler===Be?i=s.handler:(i=async(a,o)=>(await Ke([],r.errorHandler)(a,()=>s.handler(a,o))).res,i[kt]=s.handler),y(l=n,R,G).call(l,s.method,s.path,i)}),this}basePath(t){const r=y(this,R,ht).call(this);return r._basePath=oe(this._basePath,t),r}mount(t,r,n){let s,i;n&&(typeof n=="function"?i=n:(i=n.optionHandler,n.replaceRequest===!1?s=o=>o:s=n.replaceRequest));const l=i?o=>{const h=i(o);return Array.isArray(h)?h:[h]}:o=>{let h;try{h=o.executionCtx}catch{}return[o.env,h]};s||(s=(()=>{const o=oe(this._basePath,t),h=o==="/"?0:o.length;return u=>{const d=new URL(u.url);return d.pathname=d.pathname.slice(h)||"/",new Request(d,u)}})());const a=async(o,h)=>{const u=await r(s(o.req.raw),...l(o));if(u)return u;await h()};return y(this,R,G).call(this,v,oe(t,"*"),a),this}},N=new WeakMap,R=new WeakSet,ht=function(){const t=new fe({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,f(t,x,c(this,x)),t.routes=this.routes,t},x=new WeakMap,G=function(t,r,n){t=t.toUpperCase(),r=oe(this._basePath,r);const s={basePath:this._basePath,path:r,method:t,handler:n};this.router.add(t,r,[n,s]),this.routes.push(s)},Ae=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},je=function(t,r,n,s){if(s==="HEAD")return(async()=>new Response(null,await y(this,R,je).call(this,t,r,n,"GET")))();const i=this.getPath(t,{env:n}),l=this.router.match(s,i),a=new Dt(t,{path:i,matchResult:l,env:n,executionCtx:r,notFoundHandler:c(this,x)});if(l[0].length===1){let h;try{h=l[0][0][0][0](a,async()=>{a.res=await c(this,x).call(this,a)})}catch(u){return y(this,R,Ae).call(this,u,a)}return h instanceof Promise?h.then(u=>u||(a.finalized?a.res:c(this,x).call(this,a))).catch(u=>y(this,R,Ae).call(this,u,a)):h??c(this,x).call(this,a)}const o=Ke(l[0],this.errorHandler,c(this,x));return(async()=>{try{const h=await o(a);if(!h.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return h.res}catch(h){return y(this,R,Ae).call(this,h,a)}})()},fe),ut=[];function Xt(e,t){const r=this.buildAllMatchers(),n=(s,i)=>{const l=r[s]||r[v],a=l[2][i];if(a)return a;const o=i.match(l[0]);if(!o)return[[],ut];const h=o.indexOf("",1);return[l[1][h],o]};return this.match=n,n(e,t)}var xe="[^/]+",ye=".*",we="(?:|/.*)",ce=Symbol(),Kt=new Set(".\\+*[^]$()");function Yt(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===ye||e===we?1:t===ye||t===we?-1:e===xe?1:t===xe?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var Z,ee,I,ne,Bt=(ne=class{constructor(){g(this,Z);g(this,ee);g(this,I,Object.create(null))}insert(t,r,n,s,i){if(t.length===0){if(c(this,Z)!==void 0)throw ce;if(i)return;f(this,Z,r);return}const[l,...a]=t,o=l==="*"?a.length===0?["","",ye]:["","",xe]:l==="/*"?["","",we]:l.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let h;if(o){const u=o[1];let d=o[2]||xe;if(u&&o[2]&&(d===".*"||(d=d.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(d))))throw ce;if(h=c(this,I)[d],!h){if(Object.keys(c(this,I)).some(m=>m!==ye&&m!==we))throw ce;if(i)return;h=c(this,I)[d]=new ne,u!==""&&f(h,ee,s.varIndex++)}!i&&u!==""&&n.push([u,c(h,ee)])}else if(h=c(this,I)[l],!h){if(Object.keys(c(this,I)).some(u=>u.length>1&&u!==ye&&u!==we))throw ce;if(i)return;h=c(this,I)[l]=new ne}h.insert(a,r,n,s,i)}buildRegExpStr(){const r=Object.keys(c(this,I)).sort(Yt).map(n=>{const s=c(this,I)[n];return(typeof c(s,ee)=="number"?`(${n})@${c(s,ee)}`:Kt.has(n)?`\\${n}`:n)+s.buildRegExpStr()});return typeof c(this,Z)=="number"&&r.unshift(`#${c(this,Z)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},Z=new WeakMap,ee=new WeakMap,I=new WeakMap,ne),Pe,Se,Ve,qt=(Ve=class{constructor(){g(this,Pe,{varIndex:0});g(this,Se,new Bt)}insert(e,t,r){const n=[],s=[];for(let l=0;;){let a=!1;if(e=e.replace(/\{[^}]+\}/g,o=>{const h=`@\\${l}`;return s[l]=[h,o],l++,a=!0,h}),!a)break}const i=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let l=s.length-1;l>=0;l--){const[a]=s[l];for(let o=i.length-1;o>=0;o--)if(i[o].indexOf(a)!==-1){i[o]=i[o].replace(a,s[l][1]);break}}return c(this,Se).insert(i,t,n,c(this,Pe),r),n}buildRegExp(){let e=c(this,Se).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],n=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(s,i,l)=>i!==void 0?(r[++t]=Number(i),"$()"):(l!==void 0&&(n[Number(l)]=++t),"")),[new RegExp(`^${e}`),r,n]}},Pe=new WeakMap,Se=new WeakMap,Ve),Wt=[/^$/,[],Object.create(null)],Ne=Object.create(null);function dt(e){return Ne[e]??(Ne[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function Vt(){Ne=Object.create(null)}function zt(e){var h;const t=new qt,r=[];if(e.length===0)return Wt;const n=e.map(u=>[!/\*|\/:/.test(u[0]),...u]).sort(([u,d],[m,E])=>u?1:m?-1:d.length-E.length),s=Object.create(null);for(let u=0,d=-1,m=n.length;u<m;u++){const[E,b,j]=n[u];E?s[b]=[j.map(([T])=>[T,Object.create(null)]),ut]:d++;let w;try{w=t.insert(b,d,E)}catch(T){throw T===ce?new lt(b):T}E||(r[d]=j.map(([T,P])=>{const se=Object.create(null);for(P-=1;P>=0;P--){const[X,C]=w[P];se[X]=C}return[T,se]}))}const[i,l,a]=t.buildRegExp();for(let u=0,d=r.length;u<d;u++)for(let m=0,E=r[u].length;m<E;m++){const b=(h=r[u][m])==null?void 0:h[1];if(!b)continue;const j=Object.keys(b);for(let w=0,T=j.length;w<T;w++)b[j[w]]=a[b[j[w]]]}const o=[];for(const u in l)o[u]=r[l[u]];return[i,o,s]}function ie(e,t){if(e){for(const r of Object.keys(e).sort((n,s)=>s.length-n.length))if(dt(r).test(t))return[...e[r]]}}var q,W,Ce,ft,ze,Gt=(ze=class{constructor(){g(this,Ce);p(this,"name","RegExpRouter");g(this,q);g(this,W);p(this,"match",Xt);f(this,q,{[v]:Object.create(null)}),f(this,W,{[v]:Object.create(null)})}add(e,t,r){var a;const n=c(this,q),s=c(this,W);if(!n||!s)throw new Error(ct);n[e]||[n,s].forEach(o=>{o[e]=Object.create(null),Object.keys(o[v]).forEach(h=>{o[e][h]=[...o[v][h]]})}),t==="/*"&&(t="*");const i=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const o=dt(t);e===v?Object.keys(n).forEach(h=>{var u;(u=n[h])[t]||(u[t]=ie(n[h],t)||ie(n[v],t)||[])}):(a=n[e])[t]||(a[t]=ie(n[e],t)||ie(n[v],t)||[]),Object.keys(n).forEach(h=>{(e===v||e===h)&&Object.keys(n[h]).forEach(u=>{o.test(u)&&n[h][u].push([r,i])})}),Object.keys(s).forEach(h=>{(e===v||e===h)&&Object.keys(s[h]).forEach(u=>o.test(u)&&s[h][u].push([r,i]))});return}const l=tt(t)||[t];for(let o=0,h=l.length;o<h;o++){const u=l[o];Object.keys(s).forEach(d=>{var m;(e===v||e===d)&&((m=s[d])[u]||(m[u]=[...ie(n[d],u)||ie(n[v],u)||[]]),s[d][u].push([r,i-h+o+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(c(this,W)).concat(Object.keys(c(this,q))).forEach(t=>{e[t]||(e[t]=y(this,Ce,ft).call(this,t))}),f(this,q,f(this,W,void 0)),Vt(),e}},q=new WeakMap,W=new WeakMap,Ce=new WeakSet,ft=function(e){const t=[];let r=e===v;return[c(this,q),c(this,W)].forEach(n=>{const s=n[e]?Object.keys(n[e]).map(i=>[i,n[e][i]]):[];s.length!==0?(r||(r=!0),t.push(...s)):e!==v&&t.push(...Object.keys(n[v]).map(i=>[i,n[v][i]]))}),r?zt(t):null},ze),V,k,Ge,Jt=(Ge=class{constructor(e){p(this,"name","SmartRouter");g(this,V,[]);g(this,k,[]);f(this,V,e.routers)}add(e,t,r){if(!c(this,k))throw new Error(ct);c(this,k).push([e,t,r])}match(e,t){if(!c(this,k))throw new Error("Fatal error");const r=c(this,V),n=c(this,k),s=r.length;let i=0,l;for(;i<s;i++){const a=r[i];try{for(let o=0,h=n.length;o<h;o++)a.add(...n[o]);l=a.match(e,t)}catch(o){if(o instanceof lt)continue;throw o}this.match=a.match.bind(a),f(this,V,[a]),f(this,k,void 0);break}if(i===s)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,l}get activeRouter(){if(c(this,k)||c(this,V).length!==1)throw new Error("No active router has been determined yet.");return c(this,V)[0]}},V=new WeakMap,k=new WeakMap,Ge),Ee=Object.create(null),z,S,te,pe,$,F,J,ge,Qt=(ge=class{constructor(t,r,n){g(this,F);g(this,z);g(this,S);g(this,te);g(this,pe,0);g(this,$,Ee);if(f(this,S,n||Object.create(null)),f(this,z,[]),t&&r){const s=Object.create(null);s[t]={handler:r,possibleKeys:[],score:0},f(this,z,[s])}f(this,te,[])}insert(t,r,n){f(this,pe,++Xe(this,pe)._);let s=this;const i=Ot(r),l=[];for(let a=0,o=i.length;a<o;a++){const h=i[a],u=i[a+1],d=Nt(h,u),m=Array.isArray(d)?d[0]:h;if(m in c(s,S)){s=c(s,S)[m],d&&l.push(d[1]);continue}c(s,S)[m]=new ge,d&&(c(s,te).push(d),l.push(d[1])),s=c(s,S)[m]}return c(s,z).push({[t]:{handler:n,possibleKeys:l.filter((a,o,h)=>h.indexOf(a)===o),score:c(this,pe)}}),s}search(t,r){var o;const n=[];f(this,$,Ee);let i=[this];const l=Ze(r),a=[];for(let h=0,u=l.length;h<u;h++){const d=l[h],m=h===u-1,E=[];for(let b=0,j=i.length;b<j;b++){const w=i[b],T=c(w,S)[d];T&&(f(T,$,c(w,$)),m?(c(T,S)["*"]&&n.push(...y(this,F,J).call(this,c(T,S)["*"],t,c(w,$))),n.push(...y(this,F,J).call(this,T,t,c(w,$)))):E.push(T));for(let P=0,se=c(w,te).length;P<se;P++){const X=c(w,te)[P],C=c(w,$)===Ee?{}:{...c(w,$)};if(X==="*"){const K=c(w,S)["*"];K&&(n.push(...y(this,F,J).call(this,K,t,c(w,$))),f(K,$,C),E.push(K));continue}const[mt,Fe,me]=X;if(!d&&!(me instanceof RegExp))continue;const D=c(w,S)[mt],Et=l.slice(h).join("/");if(me instanceof RegExp){const K=me.exec(Et);if(K){if(C[Fe]=K[0],n.push(...y(this,F,J).call(this,D,t,c(w,$),C)),Object.keys(c(D,S)).length){f(D,$,C);const Le=((o=K[0].match(/\//))==null?void 0:o.length)??0;(a[Le]||(a[Le]=[])).push(D)}continue}}(me===!0||me.test(d))&&(C[Fe]=d,m?(n.push(...y(this,F,J).call(this,D,t,C,c(w,$))),c(D,S)["*"]&&n.push(...y(this,F,J).call(this,c(D,S)["*"],t,C,c(w,$)))):(f(D,$,C),E.push(D)))}}i=E.concat(a.shift()??[])}return n.length>1&&n.sort((h,u)=>h.score-u.score),[n.map(({handler:h,params:u})=>[h,u])]}},z=new WeakMap,S=new WeakMap,te=new WeakMap,pe=new WeakMap,$=new WeakMap,F=new WeakSet,J=function(t,r,n,s){const i=[];for(let l=0,a=c(t,z).length;l<a;l++){const o=c(t,z)[l],h=o[r]||o[v],u={};if(h!==void 0&&(h.params=Object.create(null),i.push(h),n!==Ee||s&&s!==Ee))for(let d=0,m=h.possibleKeys.length;d<m;d++){const E=h.possibleKeys[d],b=u[h.score];h.params[E]=s!=null&&s[E]&&!b?s[E]:n[E]??(s==null?void 0:s[E]),u[h.score]=!0}}return i},ge),re,Je,Zt=(Je=class{constructor(){p(this,"name","TrieRouter");g(this,re);f(this,re,new Qt)}add(e,t,r){const n=tt(t);if(n){for(let s=0,i=n.length;s<i;s++)c(this,re).insert(e,n[s],r);return}c(this,re).insert(e,t,r)}match(e,t){return c(this,re).search(e,t)}},re=new WeakMap,Je),er=class extends Ut{constructor(e={}){super(e),this.router=e.router??new Jt({routers:[new Gt,new Zt]})}};const tr=`backend:\r
  name: gitea\r
  repo: sergius/example-client\r
  branch: main\r
  base_url: https://git.brilzy.com\r
  api_root: https://git.brilzy.com/api/v1\r
  auth_endpoint: /login/oauth/authorize\r
  # Client ID из Gitea OAuth2 Application.\r
  # Redirect URI должен быть: https://webpreneurstudio.com/admin/\r
  app_id: 507f93a2-2195-4ae0-8b2c-8aa32a69463d\r
\r
media_folder: "uploads"\r
public_folder: "/uploads"\r
\r
collections:\r
  - name: "site_content"\r
    label: "Контент сайта"\r
    files:\r
      - name: "content"\r
        label: "content.json"\r
        file: "content.json"\r
        format: "json"\r
        fields:\r
          - label: "Site"\r
            name: "site"\r
            widget: "object"\r
            fields:\r
              # ВАЖНО: это системное поле. Клиент не должен его менять.\r
              # Синк привязывает сайт по repoName (sergius/example-client -> example-client),\r
              # так что даже ручная правка не "уведёт" контент в другой сайт.\r
              - label: "ID (system)"\r
                name: "id"\r
                widget: "hidden"\r
                default: "example-client"\r
              - label: "Title"\r
                name: "title"\r
                widget: "string"\r
              - label: "Description"\r
                name: "description"\r
                widget: "text"\r
\r
          - label: "Pages"\r
            name: "pages"\r
            widget: "object"\r
            fields:\r
              - label: "Home"\r
                name: "home"\r
                widget: "object"\r
                fields:\r
                  - label: "Title"\r
                    name: "title"\r
                    widget: "string"\r
                  - label: "Content"\r
                    name: "content"\r
                    widget: "markdown"\r
              - label: "About"\r
                name: "about"\r
                widget: "object"\r
                fields:\r
                  - label: "Title"\r
                    name: "title"\r
                    widget: "string"\r
                  - label: "Content"\r
                    name: "content"\r
                    widget: "markdown"\r
\r
          - label: "Posts"\r
            name: "posts"\r
            widget: "list"\r
            fields:\r
              - label: "Title"\r
                name: "title"\r
                widget: "string"\r
              - label: "Content"\r
                name: "content"\r
                widget: "markdown"\r
\r
          - label: "Technologies"\r
            name: "technologies"\r
            widget: "list"\r
            fields:\r
              - label: "Name"\r
                name: "name"\r
                widget: "string"\r
              - label: "Description"\r
                name: "description"\r
                widget: "text"\r
                required: false\r
              - label: "Category"\r
                name: "category"\r
                widget: "string"\r
                required: false\r
              - label: "Icon"\r
                name: "icon"\r
                widget: "string"\r
                required: false\r
`,rr=`<!doctype html>\r
<html lang="ru">\r
\r
<head>\r
  <meta charset="utf-8" />\r
  <meta name="viewport" content="width=device-width, initial-scale=1" />\r
  <title>Admin</title>\r
</head>\r
\r
<body>\r
  <script src="https://unpkg.com/decap-cms@3/dist/decap-cms.js"><\/script>\r
</body>\r
\r
</html>`;function nr(){return`
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">
          © ${new Date().getFullYear()} Example Client. Все права защищены.
        </p>
        <div class="footer-links">
          <a href="/" class="footer-link">Главная</a>
          <a href="/about" class="footer-link">О нас</a>
        </div>
      </div>
    </footer>
  `}function sr({currentPath:e="/"}){return`
    <header class="header">
      <nav class="header-nav">
        <a href="/" class="header-logo">Example Client</a>
        <div class="header-links">
          <a href="/" class="header-link ${e==="/"?"active":""}">Главная</a>
          <a href="/about" class="header-link ${e==="/about"?"active":""}">О нас</a>
        </div>
      </nav>
    </header>
  `}const ir=["Footer","Header"];function Ie(){return ir}function or(e=null){var n;const t=((n=e==null?void 0:e.env)==null?void 0:n.ENVIRONMENT)==="production",r=[];if(t){r.push("client/js/app.js");const s=Ie();for(const i of s)r.push(`client/js/${i.toLowerCase()}.init.js`)}else{r.push("src/client/js/app.js");const s=Ie();for(const i of s)r.push(`src/components/${i}/${i}.init.js`)}return r}function ar(e=null){var n;const t=((n=e==null?void 0:e.env)==null?void 0:n.ENVIRONMENT)==="production",r=[];if(t){r.push("client/css/style.css");const s=Ie();for(const i of s)r.push(`client/css/${i.toLowerCase()}.css`)}else{r.push("src/client/scss/style.scss");const s=Ie();for(const i of s)r.push(`src/components/${i}/${i}.scss`)}return r}function pt({children:e,title:t="Example Client",siteTitle:r,siteDescription:n,c:s,pageScript:i,pageStyle:l}){var b,j;const a=((b=s==null?void 0:s.env)==null?void 0:b.ASSETS_URL)||"http://localhost:5173",o=a.includes("localhost"),u=new URL(s.req.url).pathname||"/",d=sr({currentPath:u}),m=nr(),E=o?"":`?v=${((j=s==null?void 0:s.env)==null?void 0:j.ASSETS_VERSION)||Date.now()}`;if(o){const w=[`<script type="module" src="${a}/src/client/js/app.js${E}"><\/script>`,`<script type="module" src="${a}/src/components/Header/Header.init.js${E}"><\/script>`,`<script type="module" src="${a}/src/components/Footer/Footer.init.js${E}"><\/script>`];return i&&w.push(`<script type="module" src="${a}/${i}${E}"><\/script>`),`
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t}</title>
        ${n?`<meta name="description" content="${n.replace(/"/g,"&quot;")}">`:""}
        <!-- Vite HMR клиент для hot reload -->
        <script type="module" src="${a}/@vite/client"><\/script>
        <!-- Основные стили -->
        <link rel="stylesheet" href="${a}/src/client/scss/style.scss${E}">
        <!-- Компонентные стили -->
        <link rel="stylesheet" href="${a}/src/components/Header/Header.scss${E}">
        <link rel="stylesheet" href="${a}/src/components/Footer/Footer.scss${E}">
        ${l?`<!-- Страничные стили -->
      <link rel="stylesheet" href="${a}/${l}${E}">`:""}
      </head>
      <body>
        ${d}
        <div class="container">
          ${e}
        </div>
        ${m}
        <!-- JavaScript -->
        ${w.join(`
      `)}
      </body>
      </html>
    `}else{const w=ar(s),T=or(s),P=w.map(X=>`      <link rel="stylesheet" href="${a}/${X}${E}">`).join(`
`),se=T.map(X=>`      <script type="module" src="${a}/${X}${E}"><\/script>`).join(`
`);return`
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t}</title>
        ${n?`<meta name="description" content="${n.replace(/"/g,"&quot;")}">`:""}
        <!-- Общие стили (для всех страниц) -->
${P}
        ${l?`<!-- Страничные стили -->
      <link rel="stylesheet" href="${a}/${l}${E}">`:""}
      </head>
      <body>
        ${d}
        <div class="container">
          ${e}
        </div>
        ${m}
        <!-- Общие скрипты (для всех страниц) -->
${se}
        ${i?`<!-- Страничный скрипт -->
      <script type="module" src="${a}/${i}${E}"><\/script>`:""}
      </body>
      </html>
    `}}function L(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function cr({technologies:e=[],pageTitle:t,pageContent:r}){const n=e.reduce((a,o)=>{const h=o.category||"Other";return a[h]||(a[h]=[]),a[h].push(o),a},{}),s=Object.entries(n).map(([a,o])=>`
    <div class="tech-category">
      <h3>${L(a)}</h3>
      <div class="tech-grid">
        ${o.map(h=>`
          <div class="tech-card">
            <div class="tech-icon">${h.icon||"📦"}</div>
            <h4>${L(h.name)}</h4>
            <p>${L(h.description)}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `).join(""),i=t,l=r||"Это современный веб-проект, построенный на стеке Cloudflare Workers. Мы используем передовые технологии для создания быстрых и масштабируемых приложений.";return`
    <h1>${L(i)}</h1>
    <div class="about-content">
      <div class="page-content">${L(l)}</div>
      
      <h2>Используемые технологии</h2>
      ${e.length>0?s:"<p>Загрузка технологий...</p>"}
    </div>
  `}function lr({posts:e=[],pageTitle:t,pageContent:r,img:n}){const s=e.length>0?e.map(a=>`
          <article class="post">
            ${a.image_url&&n?`<div class="post-image">
              <img src="${n(a.image_url,{width:800,quality:85})}" 
                   alt="${L(a.title)}" 
                   loading="lazy">
            </div>`:""}
            <h2>${L(a.title)}</h2>
            <p class="post-content">${L(a.content)}</p>
            ${a.created_at?`<time class="post-date">${new Date(a.created_at).toLocaleDateString("ru-RU")}</time>`:""}
          </article>
        `).join(""):"<p>Постов пока нет.</p>",i=t,l=r||"Это главная страница проекта на Hono + Vite + Wrangler.";return`
    <h1>${L(i)}</h1>
    <div class="page-content">${L(l)}</div>
    <div class="posts-container">
      <h2>Посты из базы данных:</h2>
      ${s}
    </div>
  `}function gt(e,t=null){var i,l;const r=((i=t==null?void 0:t.env)==null?void 0:i.ENVIRONMENT)==="production";(l=t==null?void 0:t.env)!=null&&l.ASSETS_URL;const n=e.replace(/\.js$/,"").replace(/^\.\//,""),s=n.split("/").pop();if(r){const a=`client/js/${s.toLowerCase()}.bundle.js`,o=`client/css/${s.toLowerCase()}.bundle.css`;return{pageScript:a,pageStyle:o}}else{const a=`src/${n}.init.js`,o=`src/${n}.scss`;return{pageScript:a,pageStyle:o}}}class fr{constructor(t,r){this.storage=t.storage,this.env=r,this.settingsCache=null,this.cacheExpiry=0}async getSettings(){const t=Date.now();if(this.settingsCache&&t<this.cacheExpiry)return this.settingsCache;try{const r=this.storage.sql.exec("SELECT key, value FROM site_settings"),n=Array.from(r),s={};return n.forEach(i=>s[i.key]=i.value),["pages.home","pages.about"].forEach(i=>{if(s[i])try{s[i]=JSON.parse(s[i])}catch{}}),this.settingsCache=s,this.cacheExpiry=t+5*60*1e3,s}catch{return{}}}async fetch(t){const r=new URL(t.url);if(r.pathname==="/settings")return Response.json(await this.getSettings());if(r.pathname==="/invalidate"){const n=t.headers.get("X-API-Key");return!n||n!==this.env.ADMIN_API_KEY?Response.json({error:"Unauthorized"},{status:401}):(this.settingsCache=null,Response.json({success:!0}))}try{const{sql:n,params:s=[]}=await t.json(),i=this.storage.sql.exec(n,...s);return Response.json({results:Array.from(i)})}catch(n){return Response.json({error:n.message},{status:500})}}}function hr(e,t){const r=async(n,s=null,i=!1)=>{const l=e.idFromName("main-database"),a=e.get(l),o={"Content-Type":"application/json"};i&&(o["X-API-Key"]=t);const h=await a.fetch(`http://db.local${n}`,{method:"POST",body:s?JSON.stringify(s):null,headers:o});if(!h.ok)throw new Error(`DB Error: ${await h.text()}`);return await h.json()};return{getSettings:()=>r("/settings"),invalidateCache:()=>r("/invalidate",null,!0),prepare:n=>({bind:(...s)=>({all:()=>r("/",{sql:n,params:s}),first:async()=>{var i;return((i=(await r("/",{sql:n,params:s})).results)==null?void 0:i[0])||null},run:()=>r("/",{sql:n,params:s})}),all:()=>r("/",{sql:n,params:[]}),first:async()=>{var s;return((s=(await r("/",{sql:n,params:[]})).results)==null?void 0:s[0])||null},run:()=>r("/",{sql:n,params:[]})})}}const _=new er;_.use("*",async(e,t)=>{if(!e.env.DB)return e.text("Database Binding Missing",503);e.set("db",hr(e.env.DB,e.env.ADMIN_API_KEY)),await t()});_.get("/admin",e=>e.redirect("/admin/"));_.get("/admin/",e=>e.html(rr));_.get("/admin/config.yml",()=>new Response(tr,{headers:{"content-type":"text/yaml; charset=utf-8","cache-control":"no-store"}}));_.get("/",async e=>{var i,l;const t=e.get("db"),[r,n]=await Promise.all([t.getSettings(),t.prepare("SELECT * FROM posts ORDER BY id DESC LIMIT 10").all()]),s=gt("./pages/Home/Home.js",e);return e.html(pt({children:lr({posts:n.results||[],pageTitle:((i=r["pages.home"])==null?void 0:i.title)||"Home",img:(a,o)=>Qe(a,o,e)}),title:`${((l=r["pages.home"])==null?void 0:l.title)||"Home"} - ${r["site.title"]||"Agency"}`,c:e,pageScript:s.pageScript,pageStyle:s.pageStyle}))});_.get("/about",async e=>{var i,l;const t=e.get("db"),[r,n]=await Promise.all([t.getSettings(),t.prepare("SELECT * FROM technologies ORDER BY category").all()]),s=gt("./pages/About/About.js",e);return e.html(pt({children:cr({technologies:n.results||[],pageTitle:((i=r["pages.about"])==null?void 0:i.title)||"About"}),title:`${((l=r["pages.about"])==null?void 0:l.title)||"About"} - ${r["site.title"]||"Agency"}`,c:e,pageScript:s.pageScript,pageStyle:s.pageStyle}))});_.get("/api/init-db",async e=>{if(e.req.header("X-API-Key")!==e.env.ADMIN_API_KEY)return e.json({error:"403"},403);const t=e.get("db");return await t.prepare("CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)").run(),await t.prepare("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL)").run(),await t.prepare("CREATE TABLE IF NOT EXISTS technologies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, category TEXT, icon TEXT)").run(),e.json({success:!0})});_.post("/api/admin/sync-content",async e=>{var l,a;if(e.req.header("X-API-Key")!==e.env.ADMIN_API_KEY)return e.json({error:"403"},403);const t=e.get("db"),r=await e.req.json();await t.prepare("CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)").run(),await t.prepare("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL)").run(),await t.prepare("CREATE TABLE IF NOT EXISTS technologies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, category TEXT, icon TEXT)").run();const n=new Date().toISOString();if((l=r==null?void 0:r.site)!=null&&l.title&&await t.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)").bind("site.title",String(r.site.title)).run(),(a=r==null?void 0:r.site)!=null&&a.description&&await t.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)").bind("site.description",String(r.site.description)).run(),r!=null&&r.pages&&typeof r.pages=="object")for(const[o,h]of Object.entries(r.pages))await t.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)").bind(`pages.${o}`,JSON.stringify(h)).run();let s=0;if(Array.isArray(r==null?void 0:r.posts)){await t.prepare("DELETE FROM posts").run();for(const o of r.posts){const h=o!=null&&o.title?String(o.title):"",u=o!=null&&o.content?String(o.content):"";!h&&!u||(await t.prepare("INSERT INTO posts (title, content) VALUES (?, ?)").bind(h,u).run(),s+=1)}}let i=0;if(Array.isArray(r==null?void 0:r.technologies)){await t.prepare("DELETE FROM technologies").run();for(const o of r.technologies){const h=o!=null&&o.name?String(o.name):"";if(!h)continue;const u=o!=null&&o.description?String(o.description):null,d=o!=null&&o.category?String(o.category):null,m=o!=null&&o.icon?String(o.icon):null;await t.prepare("INSERT INTO technologies (name, description, category, icon) VALUES (?, ?, ?, ?)").bind(h,u,d,m).run(),i+=1}}try{await t.invalidateCache()}catch{}return e.json({success:!0,at:n,postsWritten:s,technologiesWritten:i})});_.get("/api/settings",async e=>e.json(await e.get("db").getSettings()));_.get("/api/image",e=>{const t=e.req.query("url");return t?e.json({url:Qe(t,{w:e.req.query("w")},e)}):e.json({error:"No URL"},400)});export{fr as Database,_ as default};
