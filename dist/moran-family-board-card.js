function e(e,t,i,a){var n,r=arguments.length,s=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(s=(r<3?n(s):r>3?n(t,i,s):n(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),n=new WeakMap;let r=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(t,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new r(i,e,a)},o=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,a))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,f=_.trustedTypes,m=f?f.emptyScript:"",g=_.reactiveElementPolyfillSupport,b=(e,t)=>e,w={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},v=(e,t)=>!l(e,t),y={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(e,i,t);void 0!==a&&d(this.prototype,e,a)}}static getPropertyDescriptor(e,t,i){const{get:a,set:n}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const r=a?.call(this);n?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,a)=>{if(i)e.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of a){const a=document.createElement("style"),n=t.litNonce;void 0!==n&&a.setAttribute("nonce",n),a.textContent=i.cssText,e.appendChild(a)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,i);if(void 0!==a&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:w).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(a):this.setAttribute(a,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,a=i._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=i.getPropertyOptions(a),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:w;this._$Em=a;const r=n.fromAttribute(t,e.type);this[a]=r??this._$Ej?.get(a)??r,this._$Em=null}}requestUpdate(e,t,i,a=!1,n){if(void 0!==e){const r=this.constructor;if(!1===a&&(n=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??v)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:a,wrapped:n},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==n||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,i,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,g?.({ReactiveElement:x}),(_.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,M=$.trustedTypes,D=M?M.createPolicy("lit-html",{createHTML:e=>e}):void 0,T="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+z,S=`<${A}>`,C=document,P=()=>C.createComment(""),E=e=>null===e||"object"!=typeof e&&"function"!=typeof e,O=Array.isArray,F="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,R=/>/g,L=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,H=/"/g,U=/^(?:script|style|textarea|title)$/i,K=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),W=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),V=new WeakMap,q=C.createTreeWalker(C,129);function Y(e,t){if(!O(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==D?D.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,a=[];let n,r=2===t?"<svg>":3===t?"<math>":"",s=N;for(let t=0;t<i;t++){const i=e[t];let o,l,d=-1,c=0;for(;c<i.length&&(s.lastIndex=c,l=s.exec(i),null!==l);)c=s.lastIndex,s===N?"!--"===l[1]?s=I:void 0!==l[1]?s=R:void 0!==l[2]?(U.test(l[2])&&(n=RegExp("</"+l[2],"g")),s=L):void 0!==l[3]&&(s=L):s===L?">"===l[0]?(s=n??N,d=-1):void 0===l[1]?d=-2:(d=s.lastIndex-l[2].length,o=l[1],s=void 0===l[3]?L:'"'===l[3]?H:B):s===H||s===B?s=L:s===I||s===R?s=N:(s=L,n=void 0);const h=s===L&&e[t+1].startsWith("/>")?" ":"";r+=s===N?i+S:d>=0?(a.push(o),i.slice(0,d)+T+i.slice(d)+z+h):i+z+(-2===d?t:h)}return[Y(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class J{constructor({strings:e,_$litType$:t},i){let a;this.parts=[];let n=0,r=0;const s=e.length-1,o=this.parts,[l,d]=G(e,t);if(this.el=J.createElement(l,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=q.nextNode())&&o.length<s;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(T)){const t=d[r++],i=a.getAttribute(e).split(z),s=/([.?@])?(.*)/.exec(t);o.push({type:1,index:n,name:s[2],strings:i,ctor:"."===s[1]?te:"?"===s[1]?ie:"@"===s[1]?ae:ee}),a.removeAttribute(e)}else e.startsWith(z)&&(o.push({type:6,index:n}),a.removeAttribute(e));if(U.test(a.tagName)){const e=a.textContent.split(z),t=e.length-1;if(t>0){a.textContent=M?M.emptyScript:"";for(let i=0;i<t;i++)a.append(e[i],P()),q.nextNode(),o.push({type:2,index:++n});a.append(e[t],P())}}}else if(8===a.nodeType)if(a.data===A)o.push({type:2,index:n});else{let e=-1;for(;-1!==(e=a.data.indexOf(z,e+1));)o.push({type:7,index:n}),e+=z.length-1}n++}}static createElement(e,t){const i=C.createElement("template");return i.innerHTML=e,i}}function Z(e,t,i=e,a){if(t===W)return t;let n=void 0!==a?i._$Co?.[a]:i._$Cl;const r=E(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(e),n._$AT(e,i,a)),void 0!==a?(i._$Co??=[])[a]=n:i._$Cl=n),void 0!==n&&(t=Z(e,n._$AS(e,t.values),n,a)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,a=(e?.creationScope??C).importNode(t,!0);q.currentNode=a;let n=q.nextNode(),r=0,s=0,o=i[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new Q(n,n.nextSibling,this,e):1===o.type?t=new o.ctor(n,o.name,o.strings,this,e):6===o.type&&(t=new ne(n,this,e)),this._$AV.push(t),o=i[++s]}r!==o?.index&&(n=q.nextNode(),r++)}return q.currentNode=C,a}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,a){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),E(e)?e===j||null==e||""===e?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>O(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&E(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,a="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new X(a,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new J(e)),t}k(e){O(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,a=0;for(const n of e)a===t.length?t.push(i=new Q(this.O(P()),this.O(P()),this,this.options)):i=t[a],i._$AI(n),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,a,n){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(e,t=this,i,a){const n=this.strings;let r=!1;if(void 0===n)e=Z(this,e,t,0),r=!E(e)||e!==this._$AH&&e!==W,r&&(this._$AH=e);else{const a=e;let s,o;for(e=n[0],s=0;s<n.length-1;s++)o=Z(this,a[i+s],t,s),o===W&&(o=this._$AH[s]),r||=!E(o)||o!==this._$AH[s],o===j?e=j:e!==j&&(e+=(o??"")+n[s+1]),this._$AH[s]=o}r&&!a&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class ae extends ee{constructor(e,t,i,a,n){super(e,t,i,a,n),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??j)===W)return;const i=this._$AH,a=e===j&&i!==j||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==j&&(i===j||a);a&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(J,Q),($.litHtmlVersions??=[]).push("3.3.3");const se=globalThis;class oe extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const a=i?.renderBefore??t;let n=a._$litPart$;if(void 0===n){const e=i?.renderBefore??null;a._$litPart$=n=new Q(t.insertBefore(P(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}oe._$litElement$=!0,oe.finalized=!0,se.litElementHydrateSupport?.({LitElement:oe});const le=se.litElementPolyfillSupport;le?.({LitElement:oe}),(se.litElementVersions??=[]).push("4.2.2");const de={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:v},ce=(e=de,t,i)=>{const{kind:a,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===a){const{name:a}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(a,n,e,!0,i)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=i;return function(i){const n=this[a];t.call(this,i),this.requestUpdate(a,n,e,!0,i)}}throw Error("Unsupported decorator location: "+a)};function he(e){return(t,i)=>"object"==typeof i?ce(e,t,i):((e,t,i)=>{const a=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),a?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function pe(e){return he({...e,state:!0,attribute:!1})}function ue(e,t){return new Date(e.getFullYear(),e.getMonth(),e.getDate()+t)}function _e(e,t){const i=e=>Date.UTC(e.getFullYear(),e.getMonth(),e.getDate())/864e5;return i(e)-i(t)}const fe=e=>Array.isArray(e)?e.map(e=>String(e).trim()).filter(Boolean):[];function me(e){const t=e.match(/[\p{L}\p{N}]/u);return t?.index??0}function ge(e){return e.slice(me(e))}function be(e,t){if(!function(e){return fe(e.match_title_prefixes).length>0||fe(e.match_title_contains).length>0||fe(e.match_title_regex).length>0}(t))return!0;const i=e.toLocaleLowerCase(),a=ge(e).toLocaleLowerCase();return!!fe(t.match_title_prefixes).some(e=>a.startsWith(e.toLocaleLowerCase()))||(!!fe(t.match_title_contains).some(e=>i.includes(e.toLocaleLowerCase()))||fe(t.match_title_regex).some(t=>{try{return new RegExp(t,"iu").test(e)}catch{return!1}}))}function we(e,t,i){const a=e=>{return(i=e.calendar,Array.isArray(i)?i.filter(Boolean):i?[i]:[]).includes(t);var i},n=i.flatMap((t,i)=>t.unmatched||!a(t)?[]:be(e,t)?[i]:[]);if(n.length>0)return n;const r=ge(e).match(/^([^:]+):/u)?.[1],s=r?.split(/\s*\+\s*/u).map(e=>e.trim());if(s&&s.length>1&&s.every(Boolean)){const e=s.map(e=>i.flatMap((t,i)=>{if(t.unmatched||!a(t))return[];return fe(t.match_title_prefixes).some(t=>t.replace(/:\s*$/u,"").toLocaleLowerCase()===e.toLocaleLowerCase())?[i]:[]}));if(e.every(e=>e.length>0))return[...new Set(e.flat())]}return i.flatMap((e,t)=>e.unmatched&&a(e)?[t]:[])}function ve(e,t){if(!t.strip_title_prefix)return e;const i=me(e),a=e.slice(0,i).trim(),n=e.slice(i),r=n.toLocaleLowerCase(),s=fe(t.match_title_prefixes).find(e=>r.startsWith(e.toLocaleLowerCase()));if(!s)return e;return[a,n.slice(s.length).trimStart()].filter(Boolean).join(" ").trim()||e}function ye(e){return JSON.stringify([e.calendar,e.uid||e.sourceSummary||e.summary,e.recurrence_id||e.start.toISOString(),e.uid?"":e.end.toISOString()])}const xe=e=>null===e||"object"!=typeof e||Array.isArray(e)?void 0:e,$e=e=>"string"==typeof e?e:void 0,ke=e=>"string"==typeof e&&e.trim()?e:void 0;function Me(e){if("string"!=typeof e||!/^\d{4}-\d{2}-\d{2}$/.test(e))return!1;const t=new Date(`${e}T00:00:00Z`);return Number.isFinite(t.getTime())&&t.toISOString().slice(0,10)===e}function De(e){if("string"!=typeof e)return null;const t=e.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/);if(!t||!Me(t[1])||Number(t[2])>23||Number(t[3])>59||Number(t[4]??0)>59)return null;const i=new Date(e);return Number.isFinite(i.getTime())?i:null}function Te(e,t,i,a){const n=xe(e),r=xe(n?.start);if(!n||!r)return null;if(null!=n.summary&&"string"!=typeof n.summary)return null;if([n.uid,n.recurrence_id,n.rrule].some(e=>null!=e&&"string"!=typeof e))return null;const s=xe(n.end);if(null!=n.end&&!s)return null;const o=null==r.dateTime;if(null!=r.date&&null!=r.dateTime)return null;let l,d;if(o){if(!Me(r.date)||null!=s?.dateTime)return null;if(null!=s?.date&&!Me(s.date))return null;l=new Date(`${r.date}T00:00:00`),d=null!=s?.date?new Date(`${s.date}T00:00:00`):ue(l,1)}else{if(null!=s?.date)return null;const e=De(r.dateTime),t=De(s?.dateTime??r.dateTime);if(!e||!t)return null;l=e,d=t}if(isNaN(l.getTime())||isNaN(d.getTime()))return null;if(d.getTime()<l.getTime()||o&&d.getTime()===l.getTime())return null;d.getTime()===l.getTime()&&(d=new Date(l.getTime()+6e4));const c=$e(n.summary)||"Termin";return{personIdx:t,calendar:i,uid:ke(n.uid),recurrence_id:ke(n.recurrence_id),rrule:ke(n.rrule),summary:c,sourceSummary:c,description:$e(n.description),location:$e(n.location),allDay:o,start:l,end:d,color:a,tentative:!1}}function ze(e,t,i){const a=[],n=new Date(e.start);n.setHours(0,0,0,0);const r=new Date(e.end.getTime()-1),s=Math.max(1,_e(r,n)+1);for(let r=0;r<i;r++){const i=ue(t,r),o=ue(t,r+1),l=Math.max(e.start.getTime(),i.getTime()),d=Math.min(e.end.getTime(),o.getTime());if(d<=l)continue;const c=new Date(l),h=new Date(d),p=e.allDay?0:60*c.getHours()+c.getMinutes(),u=e.allDay||d===o.getTime()?1440:60*h.getHours()+h.getMinutes(),_=s>1?_e(i,n)+1:void 0;a.push({part:_,parts:s>1?s:void 0,ref:e,personIdx:e.personIdx,day:r,startMin:p,endMin:Math.min(u,1440),title:e.summary,location:e.location,allDay:e.allDay,color:e.color,continuesBefore:e.start.getTime()<i.getTime(),continuesAfter:e.end.getTime()>o.getTime()})}return a}function Ae(e){const t=[...e].sort((e,t)=>e.startMin-t.startMin||e.endMin-t.endMin),i=[];let a=[],n=-1,r=0;const s=[],o=()=>{if(a.length){const e=Math.max(...a.map(e=>e.col))+1;a.forEach(t=>{t.cols=e,t.cluster=r;let i=e;for(const e of a)e!==t&&e.col>t.col&&e.startMin<t.endMin&&e.endMin>t.startMin&&(i=Math.min(i,e.col));t.span=Math.max(1,i-t.col)}),r++}a=[]};for(const e of t){a.length&&e.startMin>=n&&(o(),s.length=0);let t=s.findIndex(t=>t<=e.startMin);-1===t?(t=s.length,s.push(e.endMin)):s[t]=e.endMin;const l={...e,col:t,cols:1,span:1,cluster:r};a.push(l),i.push(l),n=1===a.length?e.endMin:Math.max(n,e.endMin)}return o(),i}const Se=["day","timeline","week","month","agenda"];function Ce(e){return"wall"===e?"wall":"default"}async function Pe(e,t,i,a){return Promise.all([...new Set(t.filter(Boolean))].map(async t=>{if(!i.has(t))return{entityId:t,status:"missing",events:[]};try{const i=await async function(e,t,i){const a=encodeURIComponent(i.start.toISOString()),n=encodeURIComponent(i.end.toISOString());let r;try{const i=await Promise.race([e.callApi("GET",`calendars/${t}?start=${a}&end=${n}`),new Promise((e,t)=>{r=setTimeout(()=>t(new Error("Calendar read timed out")),2e4)})]);if(!Array.isArray(i))throw new TypeError("Calendar response is not an event list.");return i}finally{clearTimeout(r)}}(e,t,a),n=i.filter(e=>null!==Te(e,0,t,"")),r=i.length-n.length;return r>0?{entityId:t,status:"partial",events:n,rejectedCount:r}:{entityId:t,status:"ok",events:n}}catch{return{entityId:t,status:"error",events:[]}}}))}const Ee=s`
  .moran-wall-shell {
    --moran-wall-canvas: var(--card-background-color, #ffffff);
    --moran-wall-surface: var(--secondary-background-color, #f6f8fb);
    --moran-wall-divider: var(--divider-color, #dfe5ec);
    --moran-wall-text: var(--primary-text-color, #111827);
    --moran-wall-muted: var(--secondary-text-color, #526071);
    --moran-wall-accent: var(--primary-color, #1296ed);
    --moran-wall-now: var(--error-color, #e84235);
    --fb-accent: var(--moran-wall-accent);
    --fb-now-color: var(--moran-wall-now);
    --fb-axis-width: 72px;
    --fb-col-min: 240px;
    --fb-avatar-size: 40px;
    --fb-radius: 12px;
    --fb-radius-sm: 12px;
    --fb-title-size: 28px;
    --fb-name-size: 16px;
    --fb-event-size: 16px;
    --fb-time-size: 14px;
    --fb-chip-size: 14px;
    box-sizing: border-box;
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
    color: var(--moran-wall-text);
    background: var(--moran-wall-canvas);
    font-family: var(
      --ha-font-family-body,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif
    );
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }

  .moran-wall-shell .moran-wall-header {
    box-sizing: border-box;
    display: flex;
    flex: 0 0 72px;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    height: 72px;
    padding: 0 24px;
    border-bottom: 1px solid var(--moran-wall-divider);
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .moran-wall-brand {
    display: flex;
    min-width: 0;
    align-items: baseline;
    gap: 16px;
  }

  .moran-wall-shell .moran-wall-title {
    overflow: hidden;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .moran-wall-shell .moran-wall-calendar-identity {
    color: var(--moran-wall-muted);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
  }

  .moran-wall-shell > .tabs {
    box-sizing: border-box;
    gap: 4px;
    border-radius: 10px;
    background: var(--moran-wall-surface);
  }

  .moran-wall-shell .switch button,
  .moran-wall-shell .tabs button,
  .moran-wall-shell .nav,
  .moran-wall-shell .nav-now {
    box-sizing: border-box;
    min-width: 48px;
    min-height: 48px;
    border-radius: 10px;
    color: var(--moran-wall-muted);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
    transition:
      background 160ms ease-out,
      color 160ms ease-out,
      box-shadow 160ms ease-out,
      transform 160ms ease-out;
  }

  .moran-wall-shell .tabs button.on {
    background: var(--moran-wall-accent);
    color: #ffffff;
    font-weight: 700;
  }

  /* View modes share a neutral capsule; the separate date strip keeps its day cells. */
  .moran-wall-shell .switch {
    box-sizing: border-box;
    display: inline-flex;
    flex: 0 1 auto;
    flex-wrap: nowrap;
    gap: 0;
    min-width: 0;
    max-width: 100%;
    padding: 3px;
    border: 1px solid color-mix(in srgb, var(--moran-wall-text) 12%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--moran-wall-canvas) 90%, var(--moran-wall-text));
    box-shadow: inset 0 1px 0 #ffffff14;
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .moran-wall-shell .switch button {
    position: relative;
    flex: 1 0 auto;
    padding: 8px 16px;
    border-radius: 999px;
    background: transparent;
    color: var(--moran-wall-muted);
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
  }

  .moran-wall-shell .switch button.on {
    background: color-mix(in srgb, var(--moran-wall-canvas) 84%, #ffffff);
    color: var(--moran-wall-text);
    font-weight: 600;
    box-shadow:
      0 1px 3px color-mix(in srgb, var(--moran-wall-text) 16%, transparent),
      inset 0 0 0 1px #ffffff14;
  }

  .moran-wall-shell .switch button:hover:not(.on) {
    background: color-mix(in srgb, var(--moran-wall-text) 6%, transparent);
    color: var(--moran-wall-text);
  }

  .moran-wall-shell .switch button:not(.on) + button:not(.on)::before {
    position: absolute;
    inset-block: 25%;
    inset-inline-start: 0;
    border-inline-start: 1px solid color-mix(in srgb, var(--moran-wall-text) 16%, transparent);
    content: "";
    pointer-events: none;
  }

  .moran-wall-shell .dayhead,
  .moran-wall-shell .weekhead {
    box-sizing: border-box;
    flex: 0 0 56px;
    min-height: 56px;
    padding: 4px 24px;
    border-bottom: 1px solid var(--moran-wall-divider);
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .dayname {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
  }

  .moran-wall-shell > .tabs {
    display: flex;
    flex: 0 0 80px;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
    width: 100%;
    min-height: 80px;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid var(--moran-wall-divider);
    border-radius: 0;
    background: var(--moran-wall-canvas);
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }

  .moran-wall-shell > .tabs button {
    display: flex;
    flex: 1 0 64px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-width: 64px;
    height: 100%;
    padding: 6px 4px;
    border-inline-end: 1px solid var(--moran-wall-divider);
    border-radius: 0;
    scroll-snap-align: start;
    font-variant-numeric: tabular-nums;
  }

  .moran-wall-shell > .tabs button:last-child {
    border-inline-end: 0;
  }

  .moran-wall-shell > .tabs button.on {
    background: color-mix(in srgb, var(--moran-wall-accent) 12%, var(--moran-wall-canvas));
    color: var(--moran-wall-text);
    box-shadow: inset 0 -3px 0 var(--moran-wall-accent);
  }

  .moran-wall-shell > .tabs button.today:not(.on) {
    box-shadow: none;
  }

  .moran-wall-shell .wall-day-weekday {
    color: var(--moran-wall-muted);
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    text-transform: uppercase;
  }

  .moran-wall-shell .wall-day-number {
    display: grid;
    width: 40px;
    height: 40px;
    place-items: center;
    border-radius: 50%;
    color: var(--moran-wall-text);
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  .moran-wall-shell > .tabs button.today .wall-day-number {
    background: var(--moran-wall-accent);
    color: #ffffff;
  }

  .moran-wall-shell > .tabs button.on .wall-day-weekday,
  .moran-wall-shell > .tabs button.today .wall-day-weekday {
    color: var(--moran-wall-accent);
  }

  .moran-wall-shell .focus {
    flex: 0 0 auto;
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .fname,
  .moran-wall-shell .fnow,
  .moran-wall-shell .fnext,
  .moran-wall-shell .ffree,
  .moran-wall-shell .fnow small,
  .moran-wall-shell .fnext small {
    font-size: 14px;
    line-height: 1.5;
  }

  .moran-wall-shell .fname,
  .moran-wall-shell .fnow,
  .moran-wall-shell .fnext {
    font-weight: 700;
  }

  .moran-wall-shell .ffree,
  .moran-wall-shell .fnow small,
  .moran-wall-shell .fnext small {
    font-weight: 400;
  }

  .moran-wall-shell .fbody {
    flex: 1;
  }

  .moran-wall-shell .fchip {
    min-width: 220px;
    align-items: flex-start;
  }

  .moran-wall-shell .fheading {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 5px;
  }

  .moran-wall-shell .fname,
  .moran-wall-shell .ffree {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell .fseparator {
    color: var(--secondary-text-color);
  }

  .moran-wall-shell .fnow,
  .moran-wall-shell .fnext {
    display: block;
    overflow: visible;
    white-space: normal;
  }

  .moran-wall-shell .fsummary {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .moran-wall-shell .fdot {
    display: inline-block;
    margin-right: 4px;
  }

  .moran-wall-shell .fnow small,
  .moran-wall-shell .fnext small {
    display: block;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell > .board {
    flex: 1 1 auto;
    width: 100%;
    min-height: 0;
    max-height: none;
    margin-top: 0;
    overflow: auto;
    background: var(--moran-wall-canvas);
    scrollbar-width: thin;
  }

  .moran-wall-shell > .board.wall-pan-board {
    cursor: grab;
    user-select: none;
  }

  .moran-wall-shell > .board.wall-pan-board.panning {
    cursor: grabbing;
  }

  /* Every row must size against the same full grid, not the viewport or a
     fixed four-person fixture. Otherwise sticky headers diverge on resize. */
  .moran-wall-shell .board > :is(.header-row, .allday-row, .body) {
    box-sizing: border-box;
    width: 100%;
    min-width: calc(
      var(--fb-axis-width) + var(--fb-wall-visible-lanes) * var(--fb-col-min) +
        var(--fb-wall-hidden-lanes) * 48px
    );
  }

  .moran-wall-shell .header-row {
    top: 0;
    height: 80px;
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .axis-spacer,
  .moran-wall-shell .axis {
    width: 72px;
    flex-basis: 72px;
  }

  .moran-wall-shell .phead {
    box-sizing: border-box;
    height: 80px;
    padding: 8px 16px;
  }

  .moran-wall-shell .phead:not(.off) {
    display: grid;
    grid-template-columns: var(--fb-avatar-size) minmax(0, 1fr) auto;
    grid-template-rows: repeat(2, minmax(0, auto));
    align-content: center;
    align-items: center;
    column-gap: 8px;
    row-gap: 0;
  }

  .moran-wall-shell .phead > .avatar {
    width: var(--fb-avatar-size);
    height: var(--fb-avatar-size);
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
  }

  .moran-wall-shell .phead:not(.off) > .avatar {
    grid-column: 1;
    grid-row: 1 / -1;
  }

  .moran-wall-shell .phead:not(.off) > .pname,
  .moran-wall-shell .phead:not(.off) > .pstatus {
    grid-column: 2;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .moran-wall-shell .phead:not(.off) > .pname {
    grid-row: 1;
    align-self: end;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
  }

  .moran-wall-shell .phead:not(.off) > .pstatus {
    grid-row: 2;
    align-self: start;
  }

  .moran-wall-shell .phead:not(.off) > .pbadges {
    grid-column: 3;
    grid-row: 1 / -1;
    flex-wrap: nowrap;
    margin-top: 0;
  }

  .moran-wall-shell .phead.off {
    justify-content: center;
    padding-inline: 0;
  }

  .moran-wall-shell .pstatus,
  .moran-wall-shell .pbadge,
  .moran-wall-shell .allday-label,
  .moran-wall-shell .hour,
  .moran-wall-shell .etime,
  .moran-wall-shell .nowline span,
  .moran-wall-shell .empty {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }

  .moran-wall-shell .hour {
    right: 16px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .moran-wall-shell .allday-row {
    position: sticky;
    top: 80px;
    z-index: 4;
    min-height: 48px;
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .allday-cell {
    padding: 8px;
    gap: 4px;
  }

  .moran-wall-shell .adchip {
    min-height: 32px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.5;
  }

  /* More specific than generic touch-target sizing: all three kinds of cells
     share both expanded and collapsed widths, regardless of role attributes. */
  .moran-wall-shell .board :is(.phead, .allday-cell, .col):not(.off) {
    flex: 1 1 0;
    min-width: var(--fb-col-min);
  }

  .moran-wall-shell .board :is(.phead, .allday-cell, .col).off {
    flex: 0 0 48px;
    min-width: 48px;
  }

  .moran-wall-shell .event {
    gap: 8px;
    border-radius: 12px;
    padding: 8px;
    transition:
      box-shadow 160ms ease-out,
      transform 160ms ease-out;
  }

  .moran-wall-shell .etitle {
    flex: 0 0 auto;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
  }

  /* Brief appointments must prioritize the title over the optional time line. */
  .moran-wall-shell .event.wall-short {
    gap: 2px;
    padding: 4px 8px;
  }

  .moran-wall-shell .event.wall-short .etitle {
    flex: 0 0 auto;
    font-size: 14px;
    line-height: 1.25;
  }

  .moran-wall-shell .event.wall-short .etime {
    flex: 0 0 auto;
    font-size: 12px;
    line-height: 1.2;
  }

  .moran-wall-shell .event.slim {
    gap: 4px;
    padding: 0 5px;
  }

  .moran-wall-shell .event.slim .etitle {
    flex: 0 0 auto;
    font-size: 13px;
    line-height: 1;
  }

  .moran-wall-shell .nowline {
    left: 72px;
    border-color: var(--moran-wall-now);
  }

  .moran-wall-shell .nowline span {
    left: -64px;
    color: #ffffff;
    background: var(--moran-wall-now);
    font-weight: 700;
  }

  .moran-wall-shell .banner {
    flex: 0 0 auto;
    margin: 8px 24px;
    font-size: 14px;
    font-weight: 400;
  }

  .moran-wall-shell :is(button, [role="button"], [role="tab"], [tabindex="0"]) {
    box-sizing: border-box;
    min-width: 48px;
    min-height: 48px;
  }

  @container (max-width: 700px) {
    .moran-wall-shell .moran-wall-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      flex: 0 0 auto;
      gap: 8px;
      height: auto;
      min-height: 72px;
      padding: 12px 16px;
    }

    .moran-wall-shell .moran-wall-brand {
      flex-wrap: wrap;
      gap: 4px 12px;
    }

    .moran-wall-shell .moran-wall-title {
      font-size: 20px;
    }

    .moran-wall-shell .moran-wall-calendar-identity {
      font-size: 14px;
    }

    .moran-wall-shell .switch {
      display: flex;
      width: 100%;
    }

    .moran-wall-shell .switch button {
      padding-inline: 6px;
      font-size: 13px;
    }
  }

  @container (max-width: 400px) {
    .moran-wall-shell .dayhead {
      flex: 0 0 auto;
      height: auto;
      min-height: 56px;
      padding-inline: 12px;
    }
  }

  .moran-wall-shell button:focus,
  .moran-wall-shell [role="button"]:focus,
  .moran-wall-shell [role="tab"]:focus,
  .moran-wall-shell [tabindex="0"]:focus,
  .moran-wall-shell button:focus-visible,
  .moran-wall-shell [role="button"]:focus-visible,
  .moran-wall-shell [role="tab"]:focus-visible,
  .moran-wall-shell [tabindex="0"]:focus-visible,
  .moran-wall-shell button:focus-within,
  .moran-wall-shell [role="button"]:focus-within,
  .moran-wall-shell [role="tab"]:focus-within,
  .moran-wall-shell [tabindex="0"]:focus-within {
    outline-color: var(--moran-wall-accent, #1296ed) !important;
    outline-style: solid !important;
    outline-width: 2px !important;
    outline-offset: 2px !important;
  }

  .moran-wall-shell .switch > button:focus,
  .moran-wall-shell .switch > button:focus-visible,
  .moran-wall-shell .switch > button:focus-within,
  .moran-wall-shell > .tabs > button:focus,
  .moran-wall-shell > .tabs > button:focus-visible,
  .moran-wall-shell > .tabs > button:focus-within {
    outline-offset: -3px !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .moran-wall-shell .switch button,
    .moran-wall-shell .tabs button,
    .moran-wall-shell .nav,
    .moran-wall-shell .nav-now,
    .moran-wall-shell .event {
      animation: none !important;
      transition: none !important;
    }
  }
`;function Oe(e,t,i){if(!(e.remember_preferences??"wall"===Ce(e.layout))||!i)return;const a=JSON.stringify({path:t,userId:i,card:e.preferences_key??e.title??"",layout:Ce(e.layout),view:e.view??"day",views:Se.filter(t=>!e.views?.length||e.views.includes(t)),persons:e.persons.map(e=>({name:e.name,person:e.person,calendar:e.calendar,prefixes:e.match_title_prefixes,contains:e.match_title_contains,regex:e.match_title_regex,unmatched:e.unmatched,hidden:!0===e.hidden}))});return`moran-family-board:preferences:v1:${function(e){let t=0xcbf29ce484222325n;for(const i of e)t^=BigInt(i.codePointAt(0)),t=BigInt.asUintN(64,0x100000001b3n*t);return t.toString(16).padStart(16,"0")}(a)}`}const Fe={board_title:"Family board",wall_board_title:"Family Board",wall_calendar_identity:"Calendar",day:"Day",week:"Week",month:"Month",agenda:"Agenda",timeline:"Timeline",all_day:"all-day",this_week:"This week",prev_week:"Previous week",next_week:"Next week",prev_month:"Previous month",next_month:"Next month",today:"Today",show_today:"Show today",tomorrow:"Tomorrow",yesterday:"Yesterday",open_map:"Map",status_home:"home",status_away:"away",add_event:"Add event",new_event:"New event",event:"Event",edit_event:"Edit event",close:"Close",field_title:"Title",field_all_day:"All-day",field_start:"Start",field_end:"End",field_location:"Location",field_note:"Note",field_calendar:"Calendar",recurring:"Recurring event",recur_this:"This event only",recur_future:"This and following",read_only:"This calendar is read-only.",delete:"Delete",cancel:"Cancel",save:"Save",err_invalid:"Please enter valid times.",err_end_before:"End is before start.",err_end_equal:"End must be after start.",save_failed:"Saving failed.",delete_failed:"Deleting failed.",default_title:"Event",load_error:"Calendar could not be loaded.",loading_calendars:"Loading calendars…",refreshing_calendars:"Refreshing calendars…",retry:"Retry",partial_load:"Some calendars could not be loaded. Showing available events.",incomplete_events:"Some calendars or events could not be read. The schedule may be incomplete.",no_events:"No events.",more_events:"more events",focus_next:"next",focus_until:"until",focus_free:"free",focus_unavailable:"schedule unavailable",status_free_now:"Free now",status_busy_now:"Busy now",status_now:"Now",status_next:"Next"},Ne={en:Fe,de:{board_title:"Familienplan",wall_board_title:"Familienplan",wall_calendar_identity:"Kalender",day:"Tag",week:"Woche",month:"Monat",agenda:"Agenda",timeline:"Zeitstrahl",all_day:"ganztägig",this_week:"Diese Woche",prev_week:"Vorherige Woche",next_week:"Nächste Woche",prev_month:"Vorheriger Monat",next_month:"Nächster Monat",today:"Heute",show_today:"Heute anzeigen",tomorrow:"Morgen",yesterday:"Gestern",open_map:"Karte",status_home:"zuhause",status_away:"unterwegs",add_event:"Termin hinzufügen",new_event:"Neuer Termin",event:"Termin",edit_event:"Termin bearbeiten",close:"Schließen",field_title:"Titel",field_all_day:"Ganztägig",field_start:"Start",field_end:"Ende",field_location:"Ort",field_note:"Notiz",field_calendar:"Kalender",recurring:"Wiederkehrender Termin",recur_this:"Nur dieser Termin",recur_future:"Dieser und folgende",read_only:"Dieser Kalender ist schreibgeschützt.",delete:"Löschen",cancel:"Abbrechen",save:"Speichern",err_invalid:"Bitte gültige Zeiten angeben.",err_end_before:"Ende liegt vor dem Start.",err_end_equal:"Ende muss nach dem Start liegen.",save_failed:"Speichern fehlgeschlagen.",delete_failed:"Löschen fehlgeschlagen.",default_title:"Termin",load_error:"Kalender konnte nicht geladen werden.",loading_calendars:"Kalender werden geladen…",refreshing_calendars:"Kalender werden aktualisiert…",retry:"Erneut versuchen",partial_load:"Einige Kalender konnten nicht geladen werden. Verfügbare Termine werden angezeigt.",incomplete_events:"Einige Kalender oder Termine konnten nicht gelesen werden. Der Plan ist möglicherweise unvollständig.",no_events:"Keine Termine.",more_events:"weitere Termine",focus_next:"als Nächstes",focus_until:"bis",focus_free:"frei",focus_unavailable:"Plan nicht verfügbar",status_free_now:"Jetzt frei",status_busy_now:"Jetzt beschäftigt",status_now:"Jetzt",status_next:"Als Nächstes"}};function Ie(e){return(e?.locale?.language||navigator?.language||"en").toLowerCase().split("-")[0]}function Re(e,t){const i=Ie(e);return Ne[i]?.[t]??Fe[t]??t}function Le(e){return e?.locale?.language||navigator?.language||"en"}function Be(e){const t=e?.locale?.time_format;if("12"===t)return!0;if("24"===t)return!1;const i=new Intl.DateTimeFormat(Le(e),{hour:"numeric"}).format(new Date(2020,0,1,13));return/\s?[AaPp]\.?[Mm]\.?/.test(i)||/1\s?PM/i.test(i)}function He(e,t){return new Intl.DateTimeFormat(Le(e),{hour:Be(e)?"numeric":"2-digit",minute:"2-digit",hour12:Be(e)}).format(t)}function Ue(e,t){const i=new Date(2020,0,1,0,0,0,0);return i.setMinutes(t),He(e,i)}function Ke(e,t){const i=new Date(2020,0,1,t,0,0,0);return new Intl.DateTimeFormat(Le(e),Be(e)?{hour:"numeric",hourCycle:"h12"}:{hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(i)}function We(e,t){return new Intl.DateTimeFormat(Le(e),{month:"short",day:"numeric"}).format(t)}function je(e,t,i=new Date){const a=_e(t,i),n=0===a||1===a?Re(e,0===a?"today":"tomorrow"):new Intl.DateTimeFormat(Le(e),{weekday:"short",month:"short",day:"numeric",...t.getFullYear()!==i.getFullYear()?{year:"numeric"}:{}}).format(t),r=Be(e);return`${n}, ${new Intl.DateTimeFormat(Le(e),{hour:r?"numeric":"2-digit",...r&&0===t.getMinutes()?{}:{minute:"2-digit"},hourCycle:r?"h12":"h23"}).format(t)}`}function Ve(e,t,i=1){const a=new Intl.DateTimeFormat(Le(e),{weekday:t}),n=Array.from({length:7},(e,t)=>{const i=a.format(new Date(2024,0,7+t));return i.charAt(0).toUpperCase()+i.slice(1)});return Array.from({length:7},(e,t)=>n[(i+t)%7])}function qe(e,t,i=new Date){const a=t.getTime()-i.getTime();if(a<=0)return"";const n=new Intl.RelativeTimeFormat(Le(e),{numeric:"always",style:"short"}),r=Math.round(a/6e4);if(r<60)return n.format(Math.max(1,r),"minute");const s=Math.round(r/60);return s<24?n.format(s,"hour"):n.format(Math.round(s/24),"day")}const Ye=["#8B7CF6","#34D399","#FBBF24","#FB7185","#22D3EE","#C084FC","#A3E635","#FB923C","#F472B6","#60A5FA"],Ge={"clear-night":"weather-night",cloudy:"weather-cloudy",fog:"weather-fog",hail:"weather-hail",lightning:"weather-lightning","lightning-rainy":"weather-lightning-rainy",partlycloudy:"weather-partly-cloudy",pouring:"weather-pouring",rainy:"weather-rainy",snowy:"weather-snowy","snowy-rainy":"weather-snowy-rainy",sunny:"weather-sunny",windy:"weather-windy","windy-variant":"weather-windy-variant",exceptional:"weather-cloudy-alert"},Je=[[/zahnarzt|dentist|kieferortho/i,"🦷"],[/arzt|doctor|doktor|klinik|hospital|therapie|physio|impf/i,"🩺"],[/geburtstag|geb\.|birthday|jubiläum|jubilaeum|anniversary/i,"🎂"],[/schwimm|swim|hallenbad|baden/i,"🏊"],[/fußball|fussball|soccer|football|training/i,"⚽"],[/sport|gym|fitness|turnen|joggen|laufen|workout/i,"🏃"],[/reit|pferd|pony|horse/i,"🐴"],[/tanz|ballett|dance/i,"🩰"],[/klavier|gitarre|musik|music|chor|singen|band|orchester|instrument/i,"🎵"],[/schule|unterricht|klasse|klassenverbund|school|nachhilfe|lernen|prüfung|pruefung|klausur/i,"🎒"],[/kita|kindergarten|krippe|hort/i,"🧸"],[/frühstück|fruehstueck|breakfast/i,"🥐"],[/mittag|lunch|abendessen|dinner|essen|kochen|restaurant|brunch/i,"🍽️"],[/kaffee|coffee|café|cafe/i,"☕"],[/urlaub|ferien|vacation|holiday|reise|trip|strand|beach/i,"🏖️"],[/flug|flight|airport|flughafen/i,"✈️"],[/zug|bahn|train|abfahrt|ankunft/i,"🚆"],[/kino|film|movie|cinema/i,"🎬"],[/party|feier|fest|celebration/i,"🎉"],[/einkauf|shopping|supermarkt|einkaufen|besorgung/i,"🛒"],[/putz|reinig|cleaning|wäsche|waesche|müll|muell|garbage|trash/i,"🧹"],[/schlaf|nap|ruhezeit|mittagsschlaf/i,"😴"],[/spiel|freispiel|play|angebotszeit/i,"🧸"],[/meeting|besprechung|termin|call|konferenz|conference|office|büro|buero|arbeit|work/i,"💼"],[/friseur|haircut|hairdresser|frisör|frisoer/i,"💇"],[/kirche|church|gottesdienst|messe|religion/i,"⛪"],[/pause|hofpause|break/i,"⏸️"]],Ze=/\p{Extended_Pictographic}/u,Xe=e=>String(e).padStart(2,"0"),Qe=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,16),et=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,10),tt=e=>{const t=new Date(e);return t.setHours(0,0,0,0),t},it=(e,t)=>e.color||Ye[t%Ye.length],at=e=>{let t=0;for(let i=0;i<e.length;i++)t=31*t+e.charCodeAt(i)>>>0;return Ye[t%Ye.length]};function nt(e){const t=e?.states??{},i=Object.keys(t).filter(e=>e.startsWith("calendar.")),a=e=>e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,""),n=[];for(const e of Object.keys(t)){if(!e.startsWith("person."))continue;const r=e.slice(7),s=t[e].attributes?.friendly_name??r,o=a(r),l=a(s),d=i.filter(e=>{const i=a(e.slice(9)),n=a(t[e].attributes?.friendly_name??"");return i===o||i.includes(o)||l.length>2&&(i.includes(l)||n.includes(l))});if(n.push({name:s,person:e,calendar:1===d.length?d[0]:d.length?d:""}),n.length>=10)break}return n}class rt extends oe{constructor(){super(...arguments),this.nowProvider=()=>new Date,this._layout="default",this._events=[],this._view="day",this._day=((new Date).getDay()+6)%7,this._weekOffset=0,this._monthOffset=0,this._loadError=!1,this._partialLoad=!1,this._loading=!1,this._fitPx=0,this._hiddenP=[],this._dragStartY=0,this._dragPx=1,this._dragGrid=30,this._suppressClick=!1,this._raw=[],this._calendarResults=[],this._fetchedKey="",this._dataKey="",this._fetchGeneration=0,this._browserOnline=!1!==navigator.onLine,this._forecast={},this._weatherKey="",this._scrolledKey="",this._scrollToNowRequested=!1,this._lastInteract=Date.now(),this._onInteract=()=>{this._lastInteract=Date.now()},this._onVisible=()=>{if(this.isConnected)return"hidden"===document.visibilityState?(this._fetchGeneration+=1,this._pendingFetch=void 0,void(this._fetchedKey="")):void(this.hass&&this._config&&(this._syncCalendarDate(),this._refetch()))},this._onOnline=()=>{this._browserOnline=!0,this._refetch()},this._onOffline=()=>{this._browserOnline=!1,this._maybeFetch()},this._pollCalendars=()=>"hidden"===document.visibilityState?Promise.resolve():this._refetch(),this._onKeyDown=e=>{"Escape"===e.key&&this._dialog&&(e.stopPropagation(),this._closeDialog())},this._prevWeek=()=>{this._weekOffset-=1},this._nextWeek=()=>{this._weekOffset+=1},this._thisWeek=()=>{this._weekOffset=0,this._day=this._todayIndex(),"wall"===this._layout&&"day"===this._view&&(this._scrollToNowRequested=!0,this.requestUpdate())},this._prevMonth=()=>{this._monthOffset-=1},this._nextMonth=()=>{this._monthOffset+=1},this._thisMonth=()=>{this._monthOffset=0},this._onWallBoardPointerDown=e=>{if("wall"!==this._layout||"mouse"!==e.pointerType||0!==e.button)return;const t=e.currentTarget;t.scrollWidth<=t.clientWidth+1||(this._wallPan={board:t,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startScrollLeft:t.scrollLeft,moved:!1})},this._onWallBoardPointerMove=e=>{const t=this._wallPan;if(!t||e.pointerId!==t.pointerId)return;const i=e.clientX-t.startX;if(!t.moved){if(Math.abs(i)<8||Math.abs(i)<=Math.abs(e.clientY-t.startY))return;t.moved=!0,t.board.setPointerCapture(e.pointerId),t.board.classList.add("panning")}e.preventDefault(),t.board.scrollLeft=t.startScrollLeft-i},this._onWallBoardPointerUp=e=>{const t=this._wallPan;if(!t||e.pointerId!==t.pointerId)return;if(this._wallPan=void 0,t.board.classList.remove("panning"),!t.moved)return;e.preventDefault();const i=e=>{e.preventDefault(),e.stopImmediatePropagation()};t.board.addEventListener("click",i,{capture:!0,once:!0}),window.setTimeout(()=>t.board.removeEventListener("click",i,!0),0)},this._onWallBoardPointerCancel=e=>{const t=this._wallPan;t&&e.pointerId===t.pointerId&&(this._wallPan=void 0,t.board.classList.remove("panning"))},this._onDragMove=e=>{if(!this._drag)return;e.preventDefault();const t=e.clientY-this._dragStartY,i=this._drag.moved||Math.abs(t)>4;this._drag={...this._drag,deltaMin:t/this._dragPx,moved:i}},this._onDragUp=()=>{window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp);const e=this._drag;e&&(e.moved?(this._suppressClick=!0,this._commitDrag(e)):this._drag=void 0)}}_now(){return new Date(this.nowProvider().getTime())}static async getConfigElement(){return await Promise.resolve().then(function(){return ut}),document.createElement("moran-family-board-card-editor")}static getStubConfig(e){const t=e?nt(e):[];return{type:"custom:moran-family-board-card",view:"day",time_grid:30,start_hour:6,end_hour:22,show_weekends:!0,show_now_line:!0,color_by:"person",persons:t.length?t:[{name:"Person 1",person:"",calendar:""},{name:"Person 2",person:"",calendar:""}]}}setConfig(e){if(!e.persons||!Array.isArray(e.persons))throw new Error("Bitte mindestens eine Person unter 'persons' konfigurieren.");this._config=e,e.read_only&&(this._dialog=void 0,this._drag=void 0,window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp)),this._fetchedKey="",this._fetchGeneration+=1,this._pendingFetch=void 0,this._dataKey="",this._loadedRange=void 0,this._raw=[],this._events=[],this._calendarResults=[],this._loadError=!1,this._partialLoad=!1,this._layout=Ce(e.layout);const t=this._enabledViews,i=e.view??"day";this._view=t.includes(i)?i:t[0],this._day=this._todayIndex(),this._hiddenP=e.persons.map((e,t)=>e.hidden?t:-1).filter(e=>e>=0),this._preferencesKey=void 0,this._scrolledKey="",this._scrollToNowRequested=!1,void 0!==this._scrollToNowFrame&&cancelAnimationFrame(this._scrollToNowFrame),this._scrollToNowFrame=void 0,this._restorePreferences();const a=Number(e.col_min_width);Number.isFinite(a)&&a>=60?this.style.setProperty("--fb-col-min",`${Math.min(a,400)}px`):this.style.removeProperty("--fb-col-min"),this.toggleAttribute("compact",!0===e.compact);const n=Number(e.event_size);Number.isFinite(n)&&n>=8&&n<=20?(this.style.setProperty("--fb-event-size",`${n}px`),this.style.setProperty("--fb-chip-size",`${Math.max(n-1,8)}px`)):(this.style.removeProperty("--fb-event-size"),this.style.removeProperty("--fb-chip-size"));const r=Number(e.radius);Number.isFinite(r)&&r>=0&&r<=20?(this.style.setProperty("--fb-radius",`${r}px`),this.style.setProperty("--fb-radius-sm",`${Math.max(r-2,2)}px`)):(this.style.removeProperty("--fb-radius"),this.style.removeProperty("--fb-radius-sm"));const s=Number(e.past_opacity);Number.isFinite(s)&&s>=10&&s<=100?this.style.setProperty("--fb-past-opacity",""+s/100):this.style.removeProperty("--fb-past-opacity"),this.isConnected&&this._startTimer()}get _enabledViews(){const e=this._config?.views,t=Array.isArray(e)?Se.filter(t=>e.includes(t)):[];return t.length?t:[...Se]}_restorePreferences(){if(!this._config)return;const e=Oe(this._config,window.location.pathname,this.hass?.user?.id);if(e===this._preferencesKey)return;this._preferencesKey=e;const t=this._config.view??"day";if(this._view=this._enabledViews.includes(t)?t:this._enabledViews[0],this._hiddenP=this._persons.flatMap((e,t)=>e.hidden?[t]:[]),this._scrolledKey="",e)try{const t=function(e,t,i,a){try{const n=e.getItem(t);if(!n||n.length>2048)return;const r=JSON.parse(n);if(1!==r?.version||!i.includes(r.view)||!Array.isArray(r.hidden)||r.hidden.length>a||!r.hidden.every(e=>Number.isInteger(e)&&Number(e)>=0&&Number(e)<a))return;return{version:1,view:r.view,hidden:[...new Set(r.hidden)]}}catch{return}}(window.localStorage,e,this._enabledViews,this._persons.length);t&&(this._view=t.view,this._hiddenP=t.hidden)}catch{}}_savePreferences(){if(this._preferencesKey)try{!function(e,t,i,a){try{e.setItem(t,JSON.stringify({version:1,view:i,hidden:a}))}catch{}}(window.localStorage,this._preferencesKey,this._view,this._hiddenP)}catch{}}_selectView(e){this._enabledViews.includes(e)&&(this._view!==e&&(this._scrolledKey=""),this._view=e,this._savePreferences())}get _firstDayJs(){return"sunday"===this._config?.first_day?0:1}_todayIndex(){return(this._now().getDay()-this._firstDayJs+7)%7}getCardSize(){return 12}connectedCallback(){super.connectedCallback(),this._browserOnline=!1!==navigator.onLine,this._syncCalendarDate(),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("visibilitychange",this._onVisible),window.addEventListener("focus",this._onVisible),window.addEventListener("pageshow",this._onVisible),window.addEventListener("online",this._onOnline),window.addEventListener("offline",this._onOffline),this._startTimer(),this.addEventListener("pointerdown",this._onInteract),this._tick=window.setInterval(()=>this._onClockTick(),6e4),this.hass&&this._config&&this._maybeFetch(),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>requestAnimationFrame(()=>this._measureFit())),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._scrollToNowFrame&&cancelAnimationFrame(this._scrollToNowFrame),this._scrollToNowFrame=void 0,this._fetchGeneration+=1,this._fetchedKey="",this._pendingFetch=void 0,document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("visibilitychange",this._onVisible),window.removeEventListener("focus",this._onVisible),window.removeEventListener("pageshow",this._onVisible),window.removeEventListener("online",this._onOnline),window.removeEventListener("offline",this._onOffline),this.removeEventListener("pointerdown",this._onInteract),this._stopTimer(),this._tick&&(clearInterval(this._tick),this._tick=void 0),this._ro?.disconnect(),this._ro=void 0,window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp)}get _progressOn(){return!1!==this._config?.show_progress}_isCurrent(e){const t=this._now().getTime();return e.ref.start.getTime()<=t&&t<e.ref.end.getTime()}_progressPct(e){const t=e.ref.start.getTime(),i=e.ref.end.getTime();return i<=t?0:Math.min(100,Math.max(0,(this._now().getTime()-t)/(i-t)*100))}_syncCalendarDate(){const e=tt(this._now()),t=this._lastCalendarDate;if(this._lastCalendarDate=e,!t||t.getTime()===e.getTime())return;const i=(t.getDay()-this._firstDayJs+7)%7,a=0===this._weekOffset&&this._day===i,n=this._todayIndex(),r=_e(ue(e,-n),ue(t,-i))/7;a?this._day=n:this._weekOffset-=r,0!==this._monthOffset&&(this._monthOffset-=12*(e.getFullYear()-t.getFullYear())+e.getMonth()-t.getMonth())}_onClockTick(){this._syncCalendarDate(),this._kioskReturn(),this.hass&&this._config&&this._maybeFetch(),this.requestUpdate()}_kioskReturn(){const e=Number(this._config?.auto_return??0);if(!Number.isFinite(e)||e<=0)return;if(Date.now()-this._lastInteract<6e4*e)return;if(this._dialog)return;const t=this._config.view??"day",i=this._enabledViews.includes(t)?t:this._enabledViews[0];this._view!==i&&(this._view=i),0!==this._weekOffset&&(this._weekOffset=0),0!==this._monthOffset&&(this._monthOffset=0),this._hiddenP.length&&(this._hiddenP=[]),this._day=this._todayIndex()}_startTimer(){this._stopTimer();const e=this._config?.refresh_interval??300;e>0&&(this._timer=window.setInterval(this._pollCalendars,1e3*e))}_stopTimer(){this._timer&&(clearInterval(this._timer),this._timer=void 0)}updated(e){(e.has("hass")||e.has("_config"))&&this._restorePreferences(),(e.has("hass")||e.has("_browserOnline")||e.has("_config")||e.has("_view")||e.has("_weekOffset")||e.has("_monthOffset"))&&this.hass&&this._config&&(this._maybeFetch(),(e.has("hass")||e.has("_config"))&&this._maybeFetchWeather()),e.has("_dialog")&&this._manageDialogFocus(e.get("_dialog")),this._measureFit(),this._maybeScrollToNow(),"wall"!==this._layout||"day"!==this._view&&"timeline"!==this._view||!(e.has("_day")||e.has("_weekOffset")||e.has("_view")||e.has("_config"))||this._keepSelectedDayTabVisible()}_keepSelectedDayTabVisible(){const e=this.renderRoot?.querySelector(".moran-wall-shell > .tabs"),t=e?.querySelector("[role='tab'][aria-selected='true']");if(!e||!t)return;const i=e.getBoundingClientRect(),a=t.getBoundingClientRect();a.left<i.left+8?e.scrollLeft-=i.left+8-a.left:a.right>i.right-8&&(e.scrollLeft+=a.right-(i.right-8))}_measureFit(){if(this._applyFullHeight(),!this._config?.fit_height||"day"!==this._view)return void(0!==this._fitPx&&(this._fitPx=0));const e=this.renderRoot?.querySelector(".board");if(!e)return;const t=e.querySelector(".header-row"),i=e.querySelector(".allday-row"),a=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],n=this._dayWindow(a),r=n.endMin-n.startMin;if(r<=0)return;const s=(t?.offsetHeight??0)+(i?.offsetHeight??0),o=e.clientHeight-s-2;if(o<=0)return;const l=Math.min(96,Math.max(40,this._config.hour_height??64))/60,d=Math.max(40/60,Math.min(l,o/r));Math.abs(d-this._fitPx)>.02&&(this._fitPx=d)}_applyFullHeight(){const e=this.renderRoot?.querySelector(".board");if(!e)return;if(!this._config?.full_height)return void(e.style.height&&(e.style.height="",e.style.maxHeight=""));const t=e.getBoundingClientRect().top+window.scrollY,i=`${Math.max(200,Math.round(window.innerHeight-t-16))}px`;e.style.height!==i&&(e.style.height=i,e.style.maxHeight=i)}_maybeScrollToNow(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0];if("day"!==this._view||!this._isRealToday(e))return void(this._scrollToNowRequested=!1);if(this._loading)return;if(!this._scrollToNowRequested&&!1===this._config?.scroll_to_now)return;const t=`${this._now().toDateString()}|${e}|${this._pxPerMin}`;if(!this._scrollToNowRequested&&t===this._scrolledKey)return;const i=this.renderRoot?.querySelector(".board"),a=i?.querySelector(".body");if(!i||!a||!i.clientHeight)return;this._scrollToNowRequested=!1;const n=this._config;void 0!==this._scrollToNowFrame&&cancelAnimationFrame(this._scrollToNowFrame),this._scrollToNowFrame=requestAnimationFrame(()=>{if(this._scrollToNowFrame=void 0,!this.isConnected||"day"!==this._view||this._config!==n||(this._visibleDays.includes(this._day)?this._day:this._visibleDays[0])!==e||!this._isRealToday(e)||i!==this.renderRoot.querySelector(".board"))return;this._scrolledKey=t;const{startMin:r,endMin:s}=this._dayWindow(e),o=this._now(),l=Math.max(r,Math.min(s,60*o.getHours()+o.getMinutes())),d=[...i.querySelectorAll(".header-row, .allday-row")].reduce((e,t)=>e+t.offsetHeight,0),c=a.getBoundingClientRect().top-i.getBoundingClientRect().top+i.scrollTop+(l-r)*this._pxPerMin-d-(i.clientHeight-d)/3;i.scrollTo({top:Math.max(0,Math.min(i.scrollHeight-i.clientHeight,c)),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})})}_manageDialogFocus(e){this._dialog&&!e?(this._restoreFocus=this.renderRoot?.activeElement,requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector(".dialog input");e?.focus()})):!this._dialog&&e&&(this._restoreFocus?.focus?.(),this._restoreFocus=void 0)}_weekBounds(){const e=this._now(),t=new Date(e);t.setHours(0,0,0,0),t.setDate(e.getDate()-(e.getDay()-this._firstDayJs+7)%7+7*this._weekOffset);const i=new Date(t);return i.setDate(t.getDate()+7),{monday:t,nextMonday:i}}_monthGrid(){const e=this._now(),t=new Date(e.getFullYear(),e.getMonth()+this._monthOffset,1),i=(t.getDay()-this._firstDayJs+7)%7,a=tt(new Date(t.getFullYear(),t.getMonth(),1-i)),n=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();return{gridStart:a,weeks:Math.ceil((i+n)/7),month:t.getMonth(),year:t.getFullYear()}}_fetchRange(){if("month"===this._view){const{gridStart:e,weeks:t}=this._monthGrid();return{start:e,end:ue(e,7*t)}}const{monday:e,nextMonday:t}=this._weekBounds();return{start:e,end:t}}_availableCalendars(e){return this._browserOnline&&!1!==this.hass.connected?new Set(e.filter(e=>{const t=this.hass.states[e];return t&&"unavailable"!==t.state&&"unknown"!==t.state})):new Set}async _maybeFetch(e=!1){if(!this.isConnected||!this.hass||!this._config)return;const t=[...new Set(this._config.persons.flatMap(e=>this._calsOf(e)))].sort(),i=t.join(","),a=this._availableCalendars(t),n=t.map(e=>a.has(e)?"1":"0").join(""),r=this._config.persons.map(e=>[this._calsOf(e).sort().join("~"),e.color??"",e.match_title_prefixes?.join("~")??"",e.match_title_contains?.join("~")??"",e.match_title_regex?.join("~")??"",e.unmatched?"u":"",e.strip_title_prefix?"s":""].join(":")).join(","),{start:s,end:o}=this._fetchRange(),l=`${s.toISOString()}|${o.toISOString()}|${i}|${n}|${r}`;if(this._pendingFetch?.key===l)return this._pendingFetch.promise;if(!e&&l===this._fetchedKey)return;this._fetchedKey=l;const d={key:l,promise:this._fetchEvents()};this._pendingFetch=d;try{await d.promise}finally{this._pendingFetch===d&&(this._pendingFetch=void 0)}}async _refetch(){await this._maybeFetch(!0)}async _refreshAfterMutation(){this._pendingFetch=void 0,await this._refetch()}async _maybeFetchWeather(){const e=this._config.weather_entity;if(!e||!1===this._config.show_weather||!this.hass.states[e])return Object.keys(this._forecast).length&&(this._forecast={}),void(this._weatherKey="");const t=`${e}|${(new Date).toISOString().slice(0,10)}`;if(t!==this._weatherKey){this._weatherKey=t;try{const t=await this.hass.callWS({type:"call_service",domain:"weather",service:"get_forecasts",service_data:{type:"daily"},target:{entity_id:e},return_response:!0}),i=t?.response?.[e]?.forecast??[],a={};for(const e of i)e?.datetime&&(a[et(new Date(e.datetime))]={temp:Math.round(e.temperature),condition:e.condition});this._forecast=a}catch(e){this._forecast={}}}}_weatherChip(e){const t=this._forecast[et(e)];if(!t)return j;const i=Ge[t.condition]||"weather-cloudy",a=this.hass.config?.unit_system?.temperature??"°";return K`<span class="wx" title=${t.condition}>
      <ha-icon icon="mdi:${i}"></ha-icon>${t.temp}${a}
    </span>`}_hidden(e){const t=this._config.hide_patterns;if(!Array.isArray(t)||0===t.length)return!1;const i=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&i.includes(t)})}_allowed(e){const t=this._config.show_patterns;if(!Array.isArray(t)||0===t.length)return!0;const i=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&i.includes(t)})}_cleanTitle(e){const t=this._config.replace_patterns;if(!Array.isArray(t)||0===t.length)return e;let i=e;for(const e of t){const t=String(e),a=t.indexOf("=>"),n=(a>=0?t.slice(0,a):t).trim(),r=a>=0?t.slice(a+2).trim():"";0!==n.length&&(i=i.split(n).join(r))}return i.replace(/\s{2,}/g," ").trim()||e}_matchesTentative(e){const t=this._config.tentative_patterns;if(!Array.isArray(t)||0===t.length)return!1;const i=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&i.includes(t)})}async _fetchEvents(){const{start:e,end:t}=this._fetchRange(),i=this._fetchedKey,a=++this._fetchGeneration,n=[];this._loading=!0,this._dataKey!==i&&(this._raw=[],this._events=[],this._calendarResults=[],this._loadedRange=void 0,this._loadError=!1,this._partialLoad=!1);const r=[...new Set(this._config.persons.flatMap(e=>this._calsOf(e)))],s=await Pe(this.hass,r,this._availableCalendars(r),{start:e,end:t});if(a!==this._fetchGeneration)return;this._calendarResults=s,this._dataKey=i,this._loadedRange={start:e,end:t};for(const e of s){if("ok"!==e.status&&"partial"!==e.status)continue;const t=e.entityId,i=e.events;for(const e of i){if(!e||"object"!=typeof e)continue;let i=e.summary||"Termin";const a=this._calMeta(t).title_field;if(a){const t=e[a];"string"==typeof t&&t.trim()&&(i=t.trim())}if(this._hidden(i)||!this._allowed(i))continue;const r=we(i,t,this._config.persons);for(const a of r){const r=this._config.persons[a],s=Te(e,a,t,it(r,a));s&&(this._matchesTentative(i)&&(s.tentative=!0),s.summary=this._cleanTitle(ve(i,r)),n.push(s))}}}const o=this._config.filter_duplicates?function(e){const t=new Set,i=new Map;return e.filter(e=>{const a=`${e.personIdx}|${ye(e)}`;if(t.has(a))return!1;const n=`${e.personIdx}|${e.summary}|${e.start.getTime()}|${e.end.getTime()}`,r=i.get(n);return!(r&&[...r].some(t=>t!==e.calendar)||(t.add(a),r?r.add(e.calendar):i.set(n,new Set([e.calendar])),0))})}(n):n;this._raw=o;const{monday:l}=this._weekBounds();this._events="month"===this._view?[]:o.flatMap(e=>function(e,t){return ze(e,t,7)}(e,l));const d=s.some(e=>"ok"!==e.status),c=s.some(e=>"ok"===e.status||"partial"===e.status);this._loadError=d&&!c,this._partialLoad=d&&c,this._loading=!1}_calsOf(e){return Array.isArray(e.calendar)?e.calendar.filter(Boolean):e.calendar?[e.calendar]:[]}_writableCals(e){return this._calsOf(e).filter(e=>this._canCreate(e))}_personCanCreate(e){return this._writableCals(e).length>0}_calFeatures(e){if(!e)return 0;const t=this.hass.states[e];return Number(t?.attributes?.supported_features??0)}_canCreate(e){return!this._config.read_only&&!!(1&this._calFeatures(e))}_canUpdate(e){return!this._config.read_only&&!!(4&this._calFeatures(e))}_canDelete(e){return!this._config.read_only&&!!(2&this._calFeatures(e))}get _persons(){return this._config.persons}get _grid(){return this._config.time_grid??30}get _pxPerMin(){if(this._config.fit_height&&this._fitPx>0)return this._fitPx;return Math.min(96,Math.max(40,this._config.hour_height??64))/60}get _startMin(){return 60*(this._config.start_hour??6)}get _endMin(){return 60*(this._config.end_hour??22)}_dayWindow(e){const t=this._startMin,i=this._endMin;if(!1===this._config.trim_hours)return{startMin:t,endMin:i};const a=this._events.filter(t=>t.day===e&&!t.allDay);if(0===a.length)return{startMin:t,endMin:i};let n=Math.min(...a.map(e=>e.startMin)),r=Math.max(...a.map(e=>e.endMin));if(this._isRealToday(e)){const e=this._now(),a=60*e.getHours()+e.getMinutes();a>=t&&a<=i&&(n=Math.min(n,a),r=Math.max(r,a))}let s=Math.max(t,60*Math.floor(n/60)),o=Math.min(i,60*Math.ceil(r/60));return o-s<360&&(o=Math.min(i,s+360),s=Math.max(t,o-360)),{startMin:s,endMin:o}}_jsDay(e){return(this._firstDayJs+e)%7}get _visibleDays(){const e=[0,1,2,3,4,5,6];return!1===this._config.show_weekends?e.filter(e=>{const t=this._jsDay(e);return 0!==t&&6!==t}):e}_t(e){return Re(this.hass,e)}_calMeta(e){return e&&this._config.calendars?.[e]||{}}_mapUrl(e){const t=this._config.map_url,i=encodeURIComponent(e);return"string"==typeof t&&t.includes("{location}")?t.replace("{location}",i):`https://www.google.com/maps/search/?api=1&query=${i}`}_calIcon(e){return this._calMeta(e).icon}_calIconEl(e){const t=this._calIcon(e.ref.calendar);return t?K`<ha-icon class="cicon" .icon=${t}></ha-icon>`:j}_calLabel(e){return this._calMeta(e).label??(this.hass.states[e]?.attributes?.friendly_name||e)}_eventColor(e){const t=this._config.color_by;return"location"===t&&e.location?at(e.location):"calendar"===t&&e.ref.calendar?this._calMeta(e.ref.calendar).color??at(e.ref.calendar):e.color}_isPast(e){return!1!==this._config.dim_past&&e.ref.end.getTime()<=this._now().getTime()}_relativeDay(e){const t=_e(e,this._now());return 0===t?this._t("today"):1===t?this._t("tomorrow"):-1===t?this._t("yesterday"):null}_isOff(e){return this._hiddenP.includes(e)}_togglePerson(e){this._hiddenP=this._isOff(e)?this._hiddenP.filter(t=>t!==e):[...this._hiddenP,e],this._savePreferences()}_timedFor(e,t){if(this._isOff(t))return[];const i=this._events.filter(i=>i.day===e&&i.personIdx===t&&!i.allDay&&!this._isBackground(i));return Ae(i)}_bgMinMin(){const e=Number(this._config.background_hours??3);return!Number.isFinite(e)||e<=0?0:60*e}_isBackground(e){const t=this._bgMinMin();return t>0&&!e.allDay&&e.endMin-e.startMin>=t}_bgFor(e,t){return this._isOff(t)?[]:this._events.filter(i=>i.day===e&&i.personIdx===t&&!i.allDay&&this._isBackground(i)).sort((e,t)=>t.endMin-t.startMin-(e.endMin-e.startMin))}_maxCols(){const e=Number(this._config.max_columns);return!Number.isFinite(e)||e<1?3:Math.min(Math.round(e),8)}_dayLayout(e,t){const i=this._timedFor(e,t),a=this._maxCols(),n=new Map;for(const e of i){const t=n.get(e.cluster);t?t.push(e):n.set(e.cluster,[e])}const r=[],s=[];for(const e of n.values()){if(e[0].cols<=a){r.push(...e);continue}let t=0,i=1/0,n=-1/0;for(const s of e)s.col<=a-2?r.push({...s,cols:a,span:Math.max(1,Math.min(s.span,a-s.col))}):(t++,i=Math.min(i,s.startMin),n=Math.max(n,s.endMin));t>0&&s.push({col:a-1,cols:a,startMin:i,endMin:n,count:t})}return{events:r,overflows:s}}_evTitle(e){const t=e.parts&&e.parts>1?`${e.title} (${e.part}/${e.parts})`:e.title,i=this._autoIcon(e.title);return i?`${i} ${t}`:t}_autoIcon(e){if(!0!==this._config.auto_icons)return"";if(!e||Ze.test(e))return"";const t=this._config.icon_patterns;if(Array.isArray(t)){const i=e.toLowerCase();for(const e of t){const t=String(e),a=t.indexOf("=>");if(a<0)continue;const n=t.slice(0,a).trim().toLowerCase(),r=t.slice(a+2).trim();if(n&&r&&i.includes(n))return r}}for(const[t,i]of Je)if(t.test(e))return i;return""}_isTentative(e){return!0===e.ref.tentative}_showDayAgenda(e){this._day=e,this._selectView("agenda")}_openDayView(e){this._day=e,this._selectView("day")}_allDayFor(e,t){return this._isOff(t)?[]:this._events.filter(i=>i.day===e&&i.personIdx===t&&i.allDay)}_eventsFor(e,t){return this._isOff(t)?[]:this._events.filter(i=>i.day===e&&i.personIdx===t).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin)}_dateForDay(e){const{monday:t}=this._weekBounds();return ue(t,e)}_isRealToday(e){return 0===this._weekOffset&&e===this._todayIndex()}_onItemKey(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),e.stopPropagation(),this._openEvent(t))}_dayHasEvents(e){return this._persons.some((t,i)=>this._eventsFor(e,i).length>0)}_personName(e,t){return e.name||this.hass.states[e.person??""]?.attributes?.friendly_name||`Person ${t+1}`}_avatar(e,t){const i=it(e,t),a=e.person?this.hass.states[e.person]:void 0,n=a?.attributes?.entity_picture,r=this._personName(e,t).slice(0,2).toUpperCase();return n?K`<div
          class="avatar"
          style="background-image:url('${n}');box-shadow:0 0 0 2px ${i}55"
        ></div>`:K`<div class="avatar initials" style="background:${i}">${r}</div>`}_badges(e){const t=Array.isArray(e.badges)?e.badges.filter(Boolean):[];return 0===t.length?j:K`<div class="pbadges">
      ${t.map(e=>{const t=this.hass.states[e];if(!t)return j;const i=t.attributes?.icon,a=t.attributes?.unit_of_measurement??"";return K`<span
          class="pbadge"
          title=${t.attributes?.friendly_name??e}
          role="button"
          tabindex="0"
          @click=${t=>{t.stopPropagation(),this._moreInfo(e)}}
          @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),t.stopPropagation(),this._moreInfo(e))}}
        >
          ${i?K`<ha-icon .icon=${i}></ha-icon>`:j}
          <span>${t.state}${a}</span>
        </span>`})}
    </div>`}_moreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_goToDate(e){const t=tt(this._now()),i=e=>{const t=tt(e);return t.setDate(t.getDate()-(t.getDay()-this._firstDayJs+7)%7),t},a=_e(i(e),i(t))/7;this._weekOffset=a,this._day=(e.getDay()-this._firstDayJs+7)%7,this._selectView("day")}render(){if(!this._config||!this.hass)return j;const e=this._renderViewSwitcher(),t=this._config.show_focus?this._renderFocus():j,i=K`${this._renderCalendarStatus()}${this._renderActiveView()}`,a="wall"===this._layout?function({title:e,calendarIdentity:t,viewNavigation:i,focus:a,content:n}){return K`
    <section class="moran-wall-shell" aria-label=${t}>
      <header class="moran-wall-header">
        <div class="moran-wall-brand">
          <div class="moran-wall-title">${e}</div>
          <div class="moran-wall-calendar-identity">${t}</div>
        </div>
        ${i}
      </header>
      ${a} ${n}
    </section>
  `}({title:this._config.title??this._t("wall_board_title"),calendarIdentity:this._t("wall_calendar_identity"),viewNavigation:e,focus:t,content:i}):K`
            <ha-card>
              <div class="top">
                <div class="title">${this._config.title??this._t("board_title")}</div>
                ${e}
              </div>
              ${t} ${i}
            </ha-card>
          `;return K`${a} ${this._dialog?this._renderDialog():j}`}_renderViewSwitcher(){return this._enabledViews.length>1?K`<div class="switch" role="tablist">
          ${this._enabledViews.map(e=>K`<button
                role="tab"
                aria-selected=${this._view===e}
                class=${this._view===e?"on":""}
                @click=${()=>this._selectView(e)}
              >
                ${this._t(e)}
              </button>`)}
        </div>`:j}_renderActiveView(){return"day"===this._view?this._renderDay():"timeline"===this._view?this._renderTimeline():"week"===this._view?this._renderWeek():"month"===this._view?this._renderMonth():this._renderAgenda()}_renderCalendarStatus(){if(this._loading)return K`<div class="calendar-status" role="status">
        <span class="spinner"></span>
        <span>${this._t(this._loadedRange?"refreshing_calendars":"loading_calendars")}</span>
      </div>`;if(!this._loadError&&!this._partialLoad)return j;const e=this._calendarResults.some(e=>"partial"===e.status)?"incomplete_events":this._partialLoad?"partial_load":"load_error";return K`<div class="calendar-status banner" role="status">
      <span class="status-message">${this._t(e)}</span>
      <button class="retry" @click=${this._refetch}>${this._t("retry")}</button>
    </div>`}_loadedRangeCoversNow(){const e=this._now().getTime();return!!this._loadedRange&&this._loadedRange.start.getTime()<=e&&e<this._loadedRange.end.getTime()}_focusFor(e){return this._loading||!this._loadedRangeCoversNow()?{}:function(e,t,i){const a=i.getTime(),n=e.filter(e=>e.personIdx===t&&!e.allDay),r=n.filter(e=>e.start.getTime()<=a&&a<e.end.getTime()).sort((e,t)=>t.start.getTime()-e.start.getTime()||e.end.getTime()-t.end.getTime())[0],s=n.filter(e=>e.start.getTime()>a).sort((e,t)=>e.start.getTime()-t.start.getTime()||e.end.getTime()-t.end.getTime())[0];return{current:r,next:s}}(this._raw,e,this._now())}_focusComplete(e){const t=this._calsOf(this._persons[e]);return!this._loading&&t.length>0&&this._loadedRangeCoversNow()&&t.every(e=>"ok"===this._calendarResults.find(t=>t.entityId===e)?.status)}_renderFocus(){return K`
      <div class="focus">
        ${this._persons.map((e,t)=>{if(this._isOff(t))return j;const{current:i,next:a}=this._focusFor(t),n=this._focusComplete(t),r=it(e,t),s=e=>this._config.auto_icons?this._autoIcon(e.summary):"";return K`
            <div class="fchip" title=${this._personName(e,t)}>
              ${this._avatar(e,t)}
              <div class="fbody">
                ${"wall"===this._layout?K`
                      <div class="fheading">
                        <span class="fname">${this._personName(e,t)}</span>
                        <span class="fseparator" aria-hidden="true">·</span>
                        <span class="ffree"
                          >${this._t(i?"status_busy_now":n?"status_free_now":"focus_unavailable")}</span
                        >
                      </div>
                      ${i?K`<span class="fnow" title=${i.summary}>
                            <span class="fsummary"
                              >${this._t("status_now")}: ${s(i)} ${i.summary}</span
                            >
                            <small
                              >${this._t("focus_until")}
                              ${je(this.hass,i.end,this._now())}</small
                            >
                          </span>`:j}
                      ${a?K`<span class="fnext" title=${a.summary}>
                            <span class="fsummary"
                              >${this._t("status_next")}: ${s(a)} ${a.summary}</span
                            >
                            <small
                              >${je(this.hass,a.start,this._now())}</small
                            >
                          </span>`:j}
                    `:K` <span class="fname">${this._personName(e,t)}</span>
                      ${i?K`<span class="fnow">
                            <span class="fdot" style="background:${r}"></span>${s(i)}
                            ${i.summary}
                            <small
                              >${this._t("focus_until")}
                              ${He(this.hass,i.end)}</small
                            >
                          </span>`:a?K`<span class="fnext">
                              ${this._t("focus_next")}: ${s(a)} ${a.summary}
                              <small>${qe(this.hass,a.start,this._now())}</small>
                            </span>`:K`<span class="ffree">
                              ${this._t(n?"focus_free":"focus_unavailable")}
                            </span>`}`}
              </div>
            </div>
          `})}
      </div>
    `}_weekNav(e=!1){const{monday:t}=this._weekBounds();return K`
      <div class="weeknav">
        <button class="nav" aria-label=${this._t("prev_week")} @click=${this._prevWeek}>‹</button>
        <button
          class="nav-now"
          aria-label=${e?this._t("show_today"):j}
          @click=${this._thisWeek}
        >
          ${e?this._t("today"):function(e,t){const i=new Date(t.getFullYear(),t.getMonth(),t.getDate()+6),a=new Intl.DateTimeFormat(Le(e),{day:"numeric",month:"short"});return`${a.format(t)} – ${a.format(i)}`}(this.hass,t)}
        </button>
        <button class="nav" aria-label=${this._t("next_week")} @click=${this._nextWeek}>›</button>
      </div>
    `}_renderDayTabs(){const e=Ve(this.hass,"short",this._firstDayJs),t=Ve(this.hass,"long",this._firstDayJs),i="wall"===this._layout;return K`
      <div class="tabs" role="tablist">
        ${this._visibleDays.map(a=>{const n=this._dateForDay(a);return K`
            <button
              role="tab"
              aria-selected=${a===this._day}
              aria-label=${i?`${t[a]}, ${We(this.hass,n)}`:j}
              aria-current=${i&&this._isRealToday(a)?"date":j}
              class="${a===this._day?"on":""} ${this._isRealToday(a)?"today":""}"
              @click=${()=>this._day=a}
            >
              ${i?K`<span class="wall-day-weekday">${e[a]}</span>
                    <span class="wall-day-number">${n.getDate()}</span>`:e[a]}
            </button>
          `})}
      </div>
    `}_renderDay(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],t=this._pxPerMin,i=60*t,{startMin:a,endMin:n}=this._dayWindow(e),r=(n-a)*t,s=Ve(this.hass,"long",this._firstDayJs),o=this._dateForDay(e),l=this._relativeDay(o)??s[e],d=[];for(let e=a/60;e<=n/60;e++)d.push(e);const c=this._now(),h=Math.max(a,Math.min(n,60*c.getHours()+c.getMinutes())),p=!1!==this._config.show_now_line&&this._isRealToday(e),u=this._persons.some((t,i)=>this._allDayFor(e,i).length>0),_=this._persons.filter((e,t)=>this._isOff(t)).length;return K`
      <div class="dayhead">
        <span class="dayname">
          ${"wall"===this._layout?`${l}: ${We(this.hass,o)}`:l}
          ${this._weatherChip(o)}${this._loading&&0===this._raw.length?K`<span class="spinner"></span>`:j}
        </span>
        ${this._weekNav("wall"===this._layout)}
      </div>
      ${this._renderDayTabs()}
      <div
        class="board ${"wall"===this._layout?"wall-pan-board":""}"
        style="--fb-wall-visible-lanes:${this._persons.length-_};--fb-wall-hidden-lanes:${_}"
        @pointerdown=${this._onWallBoardPointerDown}
        @pointermove=${this._onWallBoardPointerMove}
        @pointerup=${this._onWallBoardPointerUp}
        @pointercancel=${this._onWallBoardPointerCancel}
      >
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((e,t)=>{const i=e.person?this.hass.states[e.person]:void 0,a=this._isOff(t);return K`
              <div
                class="phead ${a?"off":""}"
                role="button"
                tabindex="0"
                title=${this._personName(e,t)}
                @click=${()=>this._togglePerson(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(t))}}
              >
                ${this._avatar(e,t)}
                ${a?j:K`<div class="pname">${this._personName(e,t)}</div>
                      <div class="pstatus">
                        ${i?this._statusLabel(i.state):""}
                      </div>
                      ${this._badges(e)}`}
              </div>
            `})}
        </div>
        ${u?K`
              <div class="allday-row">
                <div class="axis-spacer allday-label">${this._t("all_day")}</div>
                ${this._persons.map((t,i)=>K`
                    <div class="allday-cell ${this._isOff(i)?"off":""}">
                      ${this._allDayFor(e,i).map(e=>{const t=this._eventColor(e),i=this._isTentative(e);return K`
                          <div
                            class="adchip ${i?"tentative":""}"
                            style="border-left:3px ${i?"dashed":"solid"} ${t};background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff))"
                            title="${this._evTitle(e)}"
                            tabindex="0"
                            role="button"
                            @click=${()=>this._openEvent(e)}
                            @keydown=${t=>this._onItemKey(t,e)}
                          >
                            ${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}
                          </div>
                        `})}
                    </div>
                  `)}
              </div>
            `:j}
        <div class="body" style="height:${r}px">
          <div class="axis">
            ${d.map(e=>K`<div class="hour" style="top:${(60*e-a)*t}px">
                  ${"wall"===this._layout?Ke(this.hass,e):`${Xe(e)}:00`}
                </div>`)}
          </div>
          ${this._persons.map((r,s)=>{const o=this._personCanCreate(r),l=this._dayLayout(e,s);return K`
              <div
                class="col ${o?"creatable":""} ${this._isOff(s)?"off":""}"
                @click=${i=>this._onColClick(i,s,e,t,a)}
                style="background-image:
                  repeating-linear-gradient(var(--fb-row-shade) 0 ${i}px, transparent ${i}px ${2*i}px),
                  repeating-linear-gradient(var(--fb-halfhour) 0 1px, transparent 1px ${i/2}px),
                  repeating-linear-gradient(var(--fb-hourline) 0 1px, transparent 1px ${i}px)"
              >
                ${this._bgFor(e,s).filter(e=>e.endMin>a&&e.startMin<n).map((e,i)=>{const n=(e.startMin-a)*t,r=Math.max((e.endMin-e.startMin)*t-3,16),s=this._eventColor(e),o=this._isTentative(e);return K`
                      <div
                        class="band ${this._isPast(e)?"past":""} ${o?"tentative":""}"
                        tabindex="0"
                        role="button"
                        @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                        @keydown=${t=>this._onItemKey(t,e)}
                        style="top:${n+1.5}px;height:${r}px;
                               border:1.5px dashed ${s}55;
                               background:${s}0d;
                               background:repeating-linear-gradient(45deg,
                                 color-mix(in srgb, ${s} 8%, transparent) 0 8px,
                                 transparent 8px 16px)"
                        title="${this._evTitle(e)} · ${Ue(this.hass,e.startMin)}–${Ue(this.hass,e.endMin)}"
                      >
                        <span
                          class="etitle"
                          style="margin-top:${19*i}px;
                                 background:${s}26;
                                 background:color-mix(in srgb, ${s} 16%, var(--card-background-color, #fff))"
                          >${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
                        >
                      </div>
                    `})}
                ${(()=>{let e=-1/0;return l.events.filter(e=>e.endMin>a&&e.startMin<n).map(i=>{const n=this._drag?.raw===i.ref;let r=i.startMin,s=i.endMin;if(n&&this._drag){const e=this._dragGrid;if("move"===this._drag.mode){const t=Math.round((i.startMin+this._drag.deltaMin)/e)*e;s=i.endMin+(t-i.startMin),r=t}else{let t=Math.round((i.endMin-i.startMin+this._drag.deltaMin)/e)*e;t<e&&(t=e),s=i.startMin+t}}let o=(r-a)*t;const l=Math.max((s-r)*t-3,16),d=this._eventColor(i),c=i.col/i.cols*100,h=(i.span??1)/i.cols*100,p=this._isTentative(i),u=l<24,_="wall"===this._layout&&l<56&&!u,f=this._draggable(i);return u&&1===i.cols&&!n&&(o=Math.max(o,e+1),e=o+l),K`
                        <div
                          class="event ${this._isPast(i)?"past":""} ${p?"tentative":""} ${u?"slim":""} ${_?"wall-short":""} ${f?"draggable":""} ${n?"dragging":""}"
                          tabindex="0"
                          role="button"
                          @pointerdown=${e=>this._onEventPointerDown(e,i,"move")}
                          @click=${e=>{e.stopPropagation(),this._suppressClick?this._suppressClick=!1:this._openEvent(i)}}
                          @keydown=${e=>this._onItemKey(e,i)}
                          style="top:${o+1.5}px;height:${l}px;
                               left:calc(${c}% + 2px);width:calc(${h}% - 4px);
                               border-left:3px ${p?"dashed":"solid"} ${d};
                               background:${d}40;
                               background:color-mix(in srgb, ${d} 32%, var(--card-background-color, #fff))"
                          title="${this._evTitle(i)} · ${Ue(this.hass,i.startMin)}–${Ue(this.hass,i.endMin)}"
                        >
                          <span class="etitle"
                            >${this._calIconEl(i)}${i.continuesBefore?"« ":""}${this._evTitle(i)}</span
                          >
                          ${l>32||n?K`<span class="etime"
                                >${Ue(this.hass,r)}–${Ue(this.hass,s)}</span
                              >`:j}
                          ${this._progressOn&&this._isCurrent(i)&&!n?K`<div class="eprog">
                                <div style="width:${this._progressPct(i)}%"></div>
                              </div>`:j}
                          ${f&&!u?K`<div
                                class="rz"
                                @pointerdown=${e=>this._onEventPointerDown(e,i,"resize")}
                              ></div>`:j}
                        </div>
                      `})})()}
                ${l.overflows.filter(e=>e.endMin>a&&e.startMin<n).map(i=>{const n=(i.startMin-a)*t,r=Math.max((i.endMin-i.startMin)*t-3,16),s=i.col/i.cols*100,o=100/i.cols;return K`
                      <div
                        class="event overflow"
                        tabindex="0"
                        role="button"
                        title="${i.count} ${this._t("more_events")}"
                        @click=${t=>{t.stopPropagation(),this._showDayAgenda(e)}}
                        @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._showDayAgenda(e))}}
                        style="top:${n+1.5}px;height:${r}px;
                               left:calc(${s}% + 2px);width:calc(${o}% - 4px)"
                      >
                        <span class="etitle">+${i.count}</span>
                      </div>
                    `})}
              </div>
            `})}
          ${p?K`<div class="nowline" style="top:${(h-a)*t}px">
                <span>${Ue(this.hass,h)}</span>
              </div>`:j}
          ${this._loading||this._loadError||this._partialLoad||this._dayHasEvents(e)?j:K`<div class="empty">${this._t("no_events")}</div>`}
        </div>
      </div>
    `}_renderTimeline(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],{startMin:t,endMin:i}=this._dayWindow(e),a=Math.min(240,Math.max(48,Number(this._config.hour_width)||96)),n=a/60,r=(i-t)*n,s=Ve(this.hass,"long",this._firstDayJs),o=[];for(let e=t/60;e<=i/60;e++)o.push(e);const l=this._now(),d=60*l.getHours()+l.getMinutes(),c=!1!==this._config.show_now_line&&this._isRealToday(e)&&d>=t&&d<=i;return K`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(e))??s[e]}
          ${this._weatherChip(this._dateForDay(e))}${this._loading&&0===this._raw.length?K`<span class="spinner"></span>`:j}
        </span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      <div class="tlwrap">
        <div class="tlgrid" style="min-width:calc(var(--fb-tl-label, 150px) + ${r}px)">
          <div class="tlhead">
            <div class="tlcorner"></div>
            <div class="tlhours" style="width:${r}px">
              ${o.map(e=>K`<span class="tlhour" style="left:${(60*e-t)*n}px"
                    >${"wall"===this._layout?Ke(this.hass,e):`${Xe(e)}:00`}</span
                  >`)}
            </div>
          </div>
          ${this._persons.map((s,o)=>{const l=this._isOff(o),d=l?[]:this._events.filter(t=>t.day===e&&t.personIdx===o),c=Ae(d),h=c.length?Math.max(...c.map(e=>e.cols)):1,p=this._personCanCreate(s),u=s.person?this.hass.states[s.person]:void 0;return K`
              <div class="tlrow ${l?"off":""}">
                <div
                  class="tlperson"
                  role="button"
                  tabindex="0"
                  @click=${()=>this._togglePerson(o)}
                  @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(o))}}
                >
                  ${this._avatar(s,o)}
                  <div>
                    <div class="pname">${this._personName(s,o)}</div>
                    <div class="pstatus">${u?this._statusLabel(u.state):""}</div>
                  </div>
                </div>
                <div
                  class="tlcanvas ${p?"creatable":""}"
                  style="width:${r}px;height:${30*h+8}px;
                         background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${a}px),
                         repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${a/2}px)"
                  @click=${i=>this._onTimelineClick(i,o,e,n,t)}
                >
                  ${c.filter(e=>e.endMin>t&&e.startMin<i).map(e=>{const a=Math.max(e.startMin,t),r=Math.min(e.endMin,i),s=Math.max((r-a)*n-3,20),o=this._eventColor(e),l=this._isTentative(e),d=e.continuesBefore||e.startMin<t,c=e.continuesAfter||e.endMin>i;return K`
                        <div
                          class="tlbar ${this._isPast(e)?"past":""} ${l?"tentative":""}"
                          tabindex="0"
                          role="button"
                          @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                          @keydown=${t=>this._onItemKey(t,e)}
                          style="left:${(a-t)*n+1.5}px;width:${s}px;
                                 top:${30*e.col+4}px;height:${24}px;
                                 border-left:3px ${l?"dashed":"solid"} ${o};
                                 background:${o}40;
                                 background:color-mix(in srgb, ${o} 32%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)}${e.allDay?` · ${this._t("all_day")}`:` · ${Ue(this.hass,e.startMin)}–${Ue(this.hass,e.endMin)}`}"
                        >
                          <span class="etitle"
                            >${d?"« ":""}${this._evTitle(e)}${c?" »":""}</span
                          >
                          ${!e.allDay&&s>120?K`<span class="etime"
                                >${Ue(this.hass,e.startMin)}–${Ue(this.hass,e.endMin)}</span
                              >`:j}
                        </div>
                      `})}
                </div>
              </div>
            `})}
          ${c?K`<div
                class="tlnow"
                style="left:calc(var(--fb-tl-label, 150px) + ${(d-t)*n}px)"
              >
                <span>${Ue(this.hass,d)}</span>
              </div>`:j}
        </div>
        ${this._loading||this._loadError||this._partialLoad||this._dayHasEvents(e)?j:K`<div class="empty">${this._t("no_events")}</div>`}
      </div>
    `}_onTimelineClick(e,t,i,a,n){const r=this._persons[t];if(!this._personCanCreate(r))return;const s=e.currentTarget.getBoundingClientRect();let o=n+(e.clientX-s.left)/a;const l=this._grid;o=Math.round(o/l)*l,o=Math.max(0,Math.min(o,1440-l)),this._openCreate(t,i,o)}_renderWeek(){const e=Ve(this.hass,"short",this._firstDayJs),t=this._persons.map((e,t)=>({p:e,i:t})).filter(({i:e})=>!0!==this._config.hide_empty_persons||this._events.some(t=>t.personIdx===e)),i=t.length>0?t:this._persons.map((e,t)=>({p:e,i:t})),a=`70px repeat(${i.length}, minmax(110px, 1fr))`;return K`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="weekwrap">
        <div class="weekgrid" style="grid-template-columns:${a}">
          <div class="corner"></div>
          ${i.map(({p:e,i:t})=>K`<div
                class="wphead ${this._isOff(t)?"off":""}"
                role="button"
                tabindex="0"
                @click=${()=>this._togglePerson(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(t))}}
              >
                ${this._avatar(e,t)}<span>${this._personName(e,t)}</span>
              </div>`)}
          ${this._visibleDays.map(t=>K`
              <div
                class="wday ${this._isRealToday(t)?"today":""}"
                role="button"
                tabindex="0"
                title=${this._t("day")}
                @click=${()=>this._openDayView(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openDayView(t))}}
              >
                <b>${e[t]}</b>
              </div>
              ${i.map(({p:e,i:i})=>{const a=this._personCanCreate(e);return K`
                  <div
                    class="wcell ${this._isRealToday(t)?"today":""} ${a?"creatable":""}"
                    @click=${()=>a&&this._openCreate(i,t)}
                  >
                    ${this._eventsFor(t,i).map(e=>{const t=this._eventColor(e),i=this._isTentative(e);return K`
                        <div
                          class="wchip ${this._isPast(e)?"past":""} ${i?"tentative":""}"
                          style="border-left:2.5px ${i?"dashed":"solid"} ${t};background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)}"
                          tabindex="0"
                          role="button"
                          @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                          @keydown=${t=>this._onItemKey(t,e)}
                        >
                          <span
                            >${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}</span
                          >
                          ${e.allDay?j:K`<small>${Ue(this.hass,e.startMin)}</small>`}
                        </div>
                      `})}
                  </div>
                `})}
            `)}
        </div>
      </div>
    `}_renderAgenda(){const e=Ve(this.hass,"long",this._firstDayJs),t=new Intl.DateTimeFormat(this.hass.locale?.language||"en",{day:"numeric",month:"short"}),i=e=>{if(!this._config.filter_duplicates)return e;const t=new Set;return e.filter(e=>{const i=`${e.personIdx}|${ye(e.ref)}|${e.day}`;return!t.has(i)&&(t.add(i),!0)})},a=this._visibleDays.map(e=>({d:e,items:i(this._events.filter(t=>t.day===e&&!this._isOff(t.personIdx)).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin))})).filter(e=>e.items.length>0);return K`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="agenda">
        ${0===a.length?K`<div class="agenda-empty">
              ${this._loading?K`<span class="spinner"></span>`:this._loadError||this._partialLoad?j:this._t("no_events")}
            </div>`:a.map(i=>K`
                <div class="agenda-day">
                  <div class="agenda-date ${this._isRealToday(i.d)?"today":""}">
                    ${this._relativeDay(this._dateForDay(i.d))??e[i.d]} ·
                    ${t.format(this._dateForDay(i.d))}
                    ${this._weatherChip(this._dateForDay(i.d))}
                  </div>
                  ${i.items.map(e=>this._agendaRow(e))}
                </div>
              `)}
      </div>
    `}_agendaRow(e){const t=this._eventColor(e),i=this._personName(this._persons[e.personIdx],e.personIdx),a=e.allDay?this._t("all_day"):`${Ue(this.hass,e.startMin)}–${Ue(this.hass,e.endMin)}`,n=this._isCurrent(e),r=this._isTentative(e),s=e.allDay||n||e.continuesBefore?"":qe(this.hass,e.ref.start,this._now());return K`
      <div
        class="agenda-row ${this._isPast(e)?"past":""} ${n?"current":""} ${r?"tentative":""}"
        tabindex="0"
        role="button"
        @click=${()=>this._openEvent(e)}
        @keydown=${t=>this._onItemKey(t,e)}
      >
        <span class="agenda-time">${a}</span>
        <span class="agenda-bar" style="background:${t}"></span>
        <span class="agenda-main">
          <span class="agenda-title"
            >${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
          >
          <span class="agenda-meta">${i}${e.location?` · ${e.location}`:""}</span>
          ${n&&this._progressOn?K`<span class="agenda-prog"
                ><span style="width:${this._progressPct(e)}%;background:${t}"></span
              ></span>`:j}
        </span>
        ${s?K`<span class="agenda-cd">${s}</span>`:j}
      </div>
    `}_renderMonth(){const{gridStart:e,weeks:t,month:i,year:a}=this._monthGrid(),n=7*t,r=Ve(this.hass,"short",this._firstDayJs),s=this.hass.locale?.language||"en",o=new Intl.DateTimeFormat(s,{month:"long",year:"numeric"}).format(new Date(a,i,1)),l=new Map;for(const t of this._raw)if(!this._isOff(t.personIdx))for(const i of ze(t,e,n)){const e=l.get(i.day);e?e.push(i):l.set(i.day,[i])}const d=tt(this._now()).getTime();return K`
      <div class="weekhead">
        <div class="weeknav">
          <button class="nav" aria-label=${this._t("prev_month")} @click=${this._prevMonth}>
            ‹
          </button>
          <button class="nav-now" @click=${this._thisMonth}>${o}</button>
          <button class="nav" aria-label=${this._t("next_month")} @click=${this._nextMonth}>
            ›
          </button>
        </div>
      </div>
      <div class="monthwrap">
        <div class="monthhead">${r.map(e=>K`<div class="mhcell">${e}</div>`)}</div>
        <div class="monthgrid">
          ${Array.from({length:n},(t,a)=>{const n=ue(e,a),r=n.getMonth()===i,s=n.getTime()===d,o=(l.get(a)||[]).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin);return K`
              <div
                class="mcell ${r?"":"out"} ${s?"today":""} ${0===n.getDay()||6===n.getDay()?"wkend":""}"
                role="button"
                tabindex="0"
                @click=${()=>this._goToDate(n)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._goToDate(n))}}
              >
                <div class="mdate ${s?"today":""}">${n.getDate()}</div>
                <div class="mchips">
                  ${o.slice(0,3).map(e=>{const t=this._eventColor(e),i=this._isTentative(e);return K`<div
                      class="mchip ${this._isPast(e)?"past":""} ${i?"tentative":""}"
                      style="background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff));border-left:2px ${i?"dashed":"solid"} ${t}"
                      title="${this._evTitle(e)}"
                      tabindex="0"
                      role="button"
                      @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                      @keydown=${t=>this._onItemKey(t,e)}
                    >
                      ${e.continuesBefore?"« ":""}${this._evTitle(e)}
                    </div>`})}
                  ${o.length>3?K`<div class="mmore">+${o.length-3}</div>`:j}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_statusLabel(e){return"home"===e?this._t("status_home"):"not_home"===e?this._t("status_away"):"unknown"===e||"unavailable"===e?"–":e}_onColClick(e,t,i,a,n){const r=this._persons[t];if(!this._personCanCreate(r))return;const s=e.currentTarget.getBoundingClientRect();let o=n+(e.clientY-s.top)/a;const l=this._grid;o=Math.round(o/l)*l,o=Math.max(0,Math.min(o,1440-l)),this._openCreate(t,i,o)}_openCreate(e,t,i){const a=this._persons[e],n=this._writableCals(a);if(0===n.length)return;const r=tt(this._dateForDay(t)),s=i??Math.max(this._startMin,540),o=new Date(r.getTime()+6e4*s),l=new Date(o.getTime()+36e5);this._dialog={mode:"create",personIdx:e,calendar:n[0],calendarOptions:n.length>1?n:void 0,canUpdate:!0,canDelete:!1,summary:"",location:"",description:"",allDay:!1,start:Qe(o),end:Qe(l),recurrenceRange:""}}_openEvent(e){const t=e.ref,i=t.calendar,a=this._canUpdate(i)&&!!t.uid,n=this._canDelete(i)&&!!t.uid;this._dialog={mode:"edit",personIdx:t.personIdx,calendar:i,uid:t.uid,recurrence_id:t.recurrence_id,recurring:!(!t.recurrence_id&&!t.rrule),recurrenceRange:"",canUpdate:a,canDelete:n,summary:a?t.sourceSummary??t.summary:t.summary,location:t.location??"",description:t.description??"",allDay:t.allDay,start:t.allDay?et(t.start):Qe(t.start),end:t.allDay?et(ue(t.end,-1)):Qe(t.end)}}_dlgField(e,t){this._dialog&&(this._dialog={...this._dialog,[e]:t,error:void 0})}_toggleAllDay(e){if(!this._dialog)return;const t=this._dialog;e&&!t.allDay?this._dialog={...t,allDay:e,start:t.start.slice(0,10),end:t.end.slice(0,10),error:void 0}:!e&&t.allDay&&(this._dialog={...t,allDay:e,start:`${t.start}T09:00`,end:`${t.end}T10:00`,error:void 0})}_buildPayload(e){const t={summary:e.summary.trim()||this._t("default_title")};if(e.location.trim()&&(t.location=e.location.trim()),e.description.trim()&&(t.description=e.description.trim()),e.allDay){const i=new Date(`${e.end}T00:00:00`);i.setDate(i.getDate()+1),t.dtstart=e.start,t.dtend=et(i)}else t.dtstart=new Date(e.start).toISOString(),t.dtend=new Date(e.end).toISOString();return t}_validate(e){const t=e.allDay?new Date(`${e.start}T00:00:00`):new Date(e.start),i=e.allDay?new Date(`${e.end}T00:00:00`):new Date(e.end);return isNaN(t.getTime())||isNaN(i.getTime())?this._t("err_invalid"):i.getTime()<t.getTime()?this._t("err_end_before"):e.allDay||i.getTime()!==t.getTime()?null:this._t("err_end_equal")}_draggable(e){return!1!==this._config.drag_drop&&!e.allDay&&!e.ref.rrule&&!e.ref.recurrence_id&&!!e.ref.uid&&this._canUpdate(e.ref.calendar)&&!e.continuesBefore&&!e.continuesAfter}_onEventPointerDown(e,t,i){0===e.button&&this._draggable(t)&&(e.stopPropagation(),this._dragStartY=e.clientY,this._dragPx=this._pxPerMin,this._dragGrid=this._grid,this._drag={raw:t.ref,mode:i,deltaMin:0,moved:!1,busy:!1},e.target.setPointerCapture?.(e.pointerId),window.addEventListener("pointermove",this._onDragMove),window.addEventListener("pointerup",this._onDragUp))}async _commitDrag(e){const t=e.raw;if(!this._canUpdate(t.calendar)||!1===this._config.drag_drop||!t.uid||t.allDay||t.rrule||t.recurrence_id)return void(this._drag=void 0);const{start:i,end:a}=function(e,t,i,a,n){const r=Math.max(1,n),s=new Date(e);s.setHours(0,0,0,0);const o=s.getTime(),l=(e.getTime()-o)/6e4,d=(t.getTime()-e.getTime())/6e4;if("move"===a){const e=Math.round((l+i)/r)*r,t=new Date(o+6e4*e);return{start:t,end:new Date(t.getTime()+6e4*d)}}let c=Math.round((d+i)/r)*r;return c<r&&(c=r),{start:e,end:new Date(e.getTime()+6e4*c)}}(t.start,t.end,e.deltaMin,e.mode,this._dragGrid);if(i.getTime()!==t.start.getTime()||a.getTime()!==t.end.getTime()){this._drag={...e,busy:!0};try{const e={summary:t.sourceSummary??t.summary,dtstart:i.toISOString(),dtend:a.toISOString()};t.location&&(e.location=t.location),t.description&&(e.description=t.description),await this.hass.callWS({type:"calendar/event/update",entity_id:t.calendar,uid:t.uid,recurrence_id:t.recurrence_id,recurrence_range:"",event:e}),this._drag=void 0,await this._refreshAfterMutation()}catch(e){this._drag=void 0,this._loadError=!1,await this._refreshAfterMutation()}}else this._drag=void 0}async _saveDialog(){if(!this._dialog)return;const e=this._dialog;if(e.busy||("create"===e.mode?!this._canCreate(e.calendar):!e.uid||!this._canUpdate(e.calendar)))return;const t=this._validate(e);if(t)this._dialog={...e,error:t};else{this._dialog={...e,busy:!0,error:void 0};try{const t=this._buildPayload(e);"create"===e.mode?await this.hass.callWS({type:"calendar/event/create",entity_id:e.calendar,event:t}):await this.hass.callWS({type:"calendar/event/update",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:"",event:t}),this._dialog=void 0,await this._refreshAfterMutation()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("save_failed")}}}}async _deleteDialog(){if(!this._dialog||!this._dialog.uid)return;const e=this._dialog;if(!e.busy&&this._canDelete(e.calendar)){this._dialog={...e,busy:!0,error:void 0};try{await this.hass.callWS({type:"calendar/event/delete",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:""}),this._dialog=void 0,await this._refreshAfterMutation()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("delete_failed")}}}}_closeDialog(){this._dialog=void 0}_renderDialog(){const e=this._dialog,t="edit"===e.mode&&!e.canUpdate,i=this._calLabel(e.calendar),a="create"===e.mode?this._t("new_event"):t?this._t("event"):this._t("edit_event");return K`
      <div
        class="overlay"
        @click=${e=>{e.target===e.currentTarget&&this._closeDialog()}}
      >
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${a}>
          <div class="dlg-head">
            <span>${a}</span>
            <button class="icon" aria-label=${this._t("close")} @click=${this._closeDialog}>
              ✕
            </button>
          </div>
          ${e.calendarOptions&&e.calendarOptions.length>1?K`<label class="fld">
                <span>${this._t("field_calendar")}</span>
                <select
                  .value=${e.calendar}
                  @change=${e=>this._dlgField("calendar",e.target.value)}
                >
                  ${e.calendarOptions.map(t=>K`<option value=${t} ?selected=${t===e.calendar}>
                        ${this._calLabel(t)}
                      </option>`)}
                </select>
              </label>`:K`<div class="dlg-cal">${i}</div>`}

          <label class="fld">
            <span>${this._t("field_title")}</span>
            <input
              type="text"
              .value=${e.summary}
              ?disabled=${t}
              autofocus
              @input=${e=>this._dlgField("summary",e.target.value)}
            />
          </label>

          <label class="chk">
            <input
              type="checkbox"
              .checked=${e.allDay}
              ?disabled=${t}
              @change=${e=>this._toggleAllDay(e.target.checked)}
            />
            <span>${this._t("field_all_day")}</span>
          </label>

          <div class="row">
            <label class="fld">
              <span>${this._t("field_start")}</span>
              <input
                type=${e.allDay?"date":"datetime-local"}
                .value=${e.start}
                ?disabled=${t}
                @input=${e=>this._dlgField("start",e.target.value)}
              />
            </label>
            <label class="fld">
              <span>${this._t("field_end")}</span>
              <input
                type=${e.allDay?"date":"datetime-local"}
                .value=${e.end}
                ?disabled=${t}
                @input=${e=>this._dlgField("end",e.target.value)}
              />
            </label>
          </div>

          <label class="fld">
            <span>
              ${this._t("field_location")}
              ${e.location.trim()?K`<a
                    class="maplink"
                    href=${this._mapUrl(e.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    @click=${e=>e.stopPropagation()}
                    >${this._t("open_map")}</a
                  >`:j}
            </span>
            <input
              type="text"
              .value=${e.location}
              ?disabled=${t}
              @input=${e=>this._dlgField("location",e.target.value)}
            />
          </label>

          <label class="fld">
            <span>${this._t("field_note")}</span>
            <textarea
              rows="2"
              .value=${e.description}
              ?disabled=${t}
              @input=${e=>this._dlgField("description",e.target.value)}
            ></textarea>
          </label>

          ${"edit"===e.mode&&e.recurring&&!t?K`<div class="recur">
                <span class="recur-label">${this._t("recurring")}</span>
                <label class="recur-opt">
                  <input
                    type="radio"
                    name="recur"
                    ?checked=${""===e.recurrenceRange}
                    @change=${()=>this._dlgField("recurrenceRange","")}
                  />
                  <span>${this._t("recur_this")}</span>
                </label>
                <label class="recur-opt">
                  <input
                    type="radio"
                    name="recur"
                    ?checked=${"THISANDFUTURE"===e.recurrenceRange}
                    @change=${()=>this._dlgField("recurrenceRange","THISANDFUTURE")}
                  />
                  <span>${this._t("recur_future")}</span>
                </label>
              </div>`:j}
          ${t?K`<div class="ro-note">${this._t("read_only")}</div>`:j}
          ${e.error?K`<div class="dlg-error">${e.error}</div>`:j}

          <div class="dlg-actions">
            ${"edit"===e.mode&&e.canDelete?K`<button class="danger" ?disabled=${e.busy} @click=${this._deleteDialog}>
                  ${this._t("delete")}
                </button>`:j}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${e.busy} @click=${this._closeDialog}>
              ${this._t("cancel")}
            </button>
            ${t?j:K`<button class="primary" ?disabled=${e.busy} @click=${this._saveDialog}>
                  ${e.busy?"…":this._t("save")}
                </button>`}
          </div>
        </div>
      </div>
    `}}rt.styles=s`
    :host {
      font-family: var(--ha-font-family-body, var(--mdc-typography-font-family, inherit));
      /* grid tokens — theme-aware, calm by default */
      --fb-hourline: var(--divider-color, #8884);
      --fb-halfhour: color-mix(in srgb, var(--divider-color, #8884) 45%, transparent);
      --fb-row-shade: color-mix(in srgb, var(--secondary-text-color, #888) 5%, transparent);
      /* customization tokens — override via theme or card-mod */
      --fb-accent: var(--primary-color);
      --fb-now-color: var(--error-color, #ff5252);
      --fb-radius: 7px;
      --fb-radius-sm: 5px;
      --fb-avatar-size: 34px;
      --fb-past-opacity: 0.5;
      --fb-title-size: 16px;
      --fb-name-size: 13px;
      --fb-event-size: 11.5px;
      --fb-time-size: 9.5px;
      --fb-chip-size: 10.5px;
    }
    ha-card {
      overflow: hidden;
      color: var(--primary-text-color);
    }
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
    }
    /* one-switch compact density */
    :host([compact]) {
      --fb-title-size: 14px;
      --fb-name-size: 11.5px;
      --fb-event-size: 10.5px;
      --fb-time-size: 9px;
      --fb-chip-size: 9.5px;
      --fb-avatar-size: 26px;
      --fb-event-pad: 2px 5px;
      --fb-head-pad: 5px 4px;
      --fb-axis-width: 44px;
    }
    :host([compact]) .top,
    :host([compact]) .dayhead,
    :host([compact]) .weekhead {
      padding: 6px 10px;
    }
    :host([compact]) .tabs {
      margin: 4px 10px 0;
    }
    :host([compact]) .focus {
      padding: 5px 10px;
    }
    :host([compact]) .fchip {
      padding: 4px 8px;
    }
    /* "now / next" glance bar */
    .focus {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 8px 16px;
      border-bottom: 1px solid var(--divider-color);
      scrollbar-width: thin;
    }
    .fchip {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1 1 0;
      min-width: 160px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      padding: 6px 10px;
    }
    .fchip .avatar {
      flex: 0 0 auto;
    }
    .fbody {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.25;
    }
    .fname {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-weight: 600;
    }
    .fnow,
    .fnext,
    .ffree {
      font-size: 12.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .ffree {
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .fnow small,
    .fnext small {
      color: var(--secondary-text-color);
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .fdot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: 0 0 8px;
      animation: fb-pulse 2s ease-out infinite;
    }
    .title {
      font-weight: 600;
      font-size: var(--fb-title-size);
    }
    .switch,
    .tabs {
      display: inline-flex;
      gap: 2px;
      background: var(--secondary-background-color);
      border-radius: 9px;
      padding: 2px;
    }
    .switch button,
    .tabs button {
      border: none;
      cursor: pointer;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 5px 12px;
      border-radius: 999px;
      font: inherit;
      font-size: 13px;
      transition:
        background 0.12s ease,
        color 0.12s ease;
    }
    .switch button:hover:not(.on),
    .tabs button:hover:not(.on) {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .switch button.on,
    .tabs button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 600;
      box-shadow: 0 1px 4px color-mix(in srgb, var(--primary-color) 45%, transparent);
    }
    .tabs button.today:not(.on) {
      box-shadow: inset 0 -2px 0 var(--fb-accent);
    }
    .tabs {
      margin: 8px 16px 0;
      flex-wrap: wrap;
    }
    .dayhead,
    .weekhead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--divider-color);
      flex-wrap: wrap;
    }
    .dayname {
      font-weight: 700;
      font-size: 15.5px;
      display: inline-flex;
      align-items: center;
    }
    .weeknav {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .nav,
    .nav-now {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 7px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      padding: 5px 10px;
    }
    .nav {
      font-size: 16px;
      line-height: 1;
      padding: 4px 9px;
    }
    .nav-now {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .calendar-status {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      gap: 12px;
      margin: 8px 16px;
      font-size: 14px;
    }
    .calendar-status .status-message {
      flex: 1;
    }
    .calendar-status .retry {
      flex: 0 0 auto;
      min-height: 44px;
      padding: 8px 16px;
      border: 1px solid currentColor;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .banner {
      margin: 8px 16px 0;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12.5px;
      color: var(--text-primary-color, #fff);
      background: var(--error-color, #ff5252);
    }
    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-left: 8px;
      vertical-align: middle;
      border: 2px solid var(--divider-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: fb-spin 0.7s linear infinite;
    }
    @keyframes fb-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 2s;
      }
    }
    .empty {
      position: absolute;
      top: 0;
      left: var(--fb-axis-width, 56px);
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      font-size: 13px;
      pointer-events: none;
    }
    .board {
      max-height: var(--fb-board-max-height, 58vh);
      overflow: auto;
      margin-top: 8px;
    }
    /* keep header, all-day and body columns pixel-aligned: borders must not
       change box width, or the vertical dividers break between the rows. */
    .axis-spacer,
    .phead,
    .axis,
    .col,
    .allday-cell,
    .allday-label {
      box-sizing: border-box;
    }
    .header-row {
      display: flex;
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
    }
    .axis-spacer {
      width: var(--fb-axis-width, 56px);
      flex: 0 0 var(--fb-axis-width, 56px);
      position: sticky;
      left: 0;
      background: inherit;
    }
    .phead {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      padding: var(--fb-head-pad, 10px 6px);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-left: 1px solid var(--divider-color);
      position: relative;
    }
    .allday-row {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--ha-card-background));
    }
    .allday-label {
      font-size: 10px;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
    }
    .allday-cell {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      border-left: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .adchip {
      border-radius: var(--fb-radius-sm);
      padding: 2px 6px;
      font-size: var(--fb-chip-size);
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .avatar {
      width: var(--fb-avatar-size);
      height: var(--fb-avatar-size);
      border-radius: 50%;
      background-size: cover;
      background-position: center;
    }
    .avatar.initials {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #11181f;
      font-weight: 700;
      font-size: 13px;
    }
    .pname {
      font-weight: 600;
      font-size: var(--fb-name-size);
    }
    .pstatus {
      font-size: 10.5px;
      color: var(--secondary-text-color);
    }
    .body {
      display: flex;
      position: relative;
    }
    .axis {
      width: var(--fb-axis-width, 56px);
      flex: 0 0 var(--fb-axis-width, 56px);
      position: sticky;
      left: 0;
      background: var(--card-background-color, var(--ha-card-background));
      z-index: 4;
      border-right: 1px solid var(--divider-color);
    }
    .hour {
      position: absolute;
      right: 8px;
      transform: translateY(-50%);
      font-size: 11px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    /* first hour label would be clipped by the header above */
    .hour:first-child {
      transform: none;
      margin-top: 1px;
    }
    .col {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      position: relative;
      border-left: 1px solid var(--divider-color);
    }
    .col.creatable {
      cursor: copy;
    }
    .event {
      position: absolute;
      border-radius: var(--fb-radius);
      padding: var(--fb-event-pad, 4px 7px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 2;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.12s ease,
        transform 0.12s ease;
    }
    .event:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
      z-index: 4;
    }
    /* long "background" events (OGS, Freispiel …): faint full-width band behind
       the normal event blocks so short lessons keep the full column width. */
    .band {
      position: absolute;
      left: 2px;
      right: 2px;
      border-radius: var(--fb-radius);
      padding: 3px 7px;
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 1;
      display: flex;
      justify-content: flex-end; /* keep label clear of left-aligned event blocks */
      align-items: flex-start;
    }
    .band .etitle {
      max-width: 90%;
      font-weight: 600;
      font-size: 10px;
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 1px 8px;
    }
    .cicon {
      --mdc-icon-size: 13px;
      width: 13px;
      height: 13px;
      vertical-align: -2px;
      margin-right: 3px;
      opacity: 0.85;
    }
    .event.draggable {
      touch-action: none;
      cursor: grab;
    }
    .event.dragging {
      cursor: grabbing;
      z-index: 20;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
      opacity: 0.94;
      transition: none;
    }
    /* resize grabber at the bottom edge */
    .rz {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 9px;
      cursor: ns-resize;
      touch-action: none;
    }
    .rz::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 2px;
      width: 20px;
      height: 3px;
      transform: translateX(-50%);
      border-radius: 2px;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.12s ease;
    }
    .event.draggable:hover .rz::after {
      opacity: 0.4;
    }
    .event.tentative {
      opacity: 0.72;
      border-style: dashed;
      background-image: repeating-linear-gradient(
        135deg,
        transparent 0 6px,
        rgba(255, 255, 255, 0.06) 6px 12px
      );
    }
    .event.overflow {
      background: var(--secondary-background-color);
      border: 1px dashed var(--divider-color);
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      z-index: 6;
    }
    .event.overflow .etitle {
      font-weight: 700;
    }
    /* very short events (breaks etc.): thin single-line strip drawn on top so
       neighbours' min-height can't cover them */
    .event.slim {
      z-index: 3;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      padding: 0 5px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    .event.slim .etitle {
      font-size: calc(var(--fb-event-size) - 1.5px);
      font-weight: 600;
    }
    .event.slim .etime,
    .event.slim .eprog {
      display: none;
    }
    .phead {
      cursor: pointer;
    }
    .phead.off,
    .col.off,
    .allday-cell.off {
      flex: 0 0 48px;
      min-width: 48px;
    }
    .phead.off .avatar,
    .wphead.off .avatar,
    .tlrow.off .avatar {
      opacity: 0.35;
      filter: grayscale(0.8);
    }
    .wphead {
      cursor: pointer;
    }
    .wphead.off span {
      opacity: 0.4;
    }
    .tlperson {
      cursor: pointer;
    }
    .tlrow.off .pname,
    .tlrow.off .pstatus {
      opacity: 0.4;
    }
    .pbadges {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 3px;
      margin-top: 2px;
    }
    .pbadge {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 10px;
      font-weight: 600;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 999px;
      padding: 1px 7px;
      cursor: pointer;
      white-space: nowrap;
    }
    .pbadge ha-icon {
      --mdc-icon-size: 12px;
      width: 12px;
      height: 12px;
      display: inline-flex;
      align-items: center;
    }
    @media (pointer: coarse) {
      .switch button,
      .tabs button {
        padding: 8px 14px;
      }
    }
    /* phones: tighter columns, smaller chrome, everything still scrollable */
    @media (max-width: 600px) {
      :host {
        --fb-col-min: 96px;
        --fb-avatar-size: 28px;
        --fb-axis-width: 42px;
        --fb-title-size: 14px;
        --fb-name-size: 11.5px;
        --fb-event-size: 10.5px;
        --fb-chip-size: 10px;
      }
      .top {
        flex-wrap: wrap;
        gap: 6px;
      }
      .phead {
        padding: 6px 4px;
        gap: 2px;
      }
      .hour {
        font-size: 9.5px;
        right: 4px;
      }
      .weeknav {
        gap: 4px;
      }
      .band .etitle {
        font-size: 9px;
        padding: 1px 6px;
      }
      .pbadge {
        font-size: 9px;
        padding: 1px 5px;
      }
    }
    .wchip,
    .adchip,
    .mchip {
      transition: box-shadow 0.12s ease;
    }
    .wchip:hover,
    .adchip:hover,
    .mchip:hover {
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }
    .agenda-row {
      transition: background 0.12s ease;
    }
    .agenda-row:hover {
      background: var(--secondary-background-color);
    }
    .wchip.tentative,
    .mchip.tentative,
    .adchip.tentative {
      opacity: 0.72;
      border-style: dashed;
    }
    .agenda-row.tentative .agenda-bar {
      opacity: 0.55;
    }
    .agenda-row.tentative .agenda-title {
      font-style: italic;
    }
    .etitle {
      font-size: var(--fb-event-size);
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .etime {
      font-size: var(--fb-time-size);
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .nowline {
      position: absolute;
      left: var(--fb-axis-width, 56px);
      right: 0;
      border-top: 2px solid var(--fb-now-color);
      z-index: 7;
      pointer-events: none;
    }
    .nowline::after {
      content: "";
      position: absolute;
      left: -3px;
      top: -5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--fb-now-color);
      animation: fb-pulse 2s ease-out infinite;
    }
    @keyframes fb-pulse {
      0%,
      100% {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--fb-now-color) 40%, transparent);
      }
      50% {
        box-shadow: 0 0 0 7px transparent;
      }
    }
    @keyframes fb-fade {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    .board,
    .weekwrap,
    .agenda,
    .monthgrid {
      animation: fb-fade 0.18s ease;
    }
    .board::-webkit-scrollbar,
    .weekwrap::-webkit-scrollbar,
    .agenda::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .board::-webkit-scrollbar-thumb,
    .weekwrap::-webkit-scrollbar-thumb,
    .agenda::-webkit-scrollbar-thumb {
      background: var(--divider-color);
      border-radius: 8px;
    }
    @media (prefers-reduced-motion: reduce) {
      .board,
      .weekwrap,
      .agenda,
      .monthgrid,
      .nowline::after,
      .event {
        animation: none !important;
        transition: none !important;
      }
    }
    .nowline span {
      position: absolute;
      left: -50px;
      top: -8px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--fb-now-color);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* timeline (horizontal) */
    .tlwrap {
      overflow: auto;
      max-height: var(--fb-board-max-height, 58vh);
      margin-top: 8px;
      animation: fb-fade 0.18s ease;
    }
    .tlgrid {
      position: relative;
    }
    .tlhead {
      display: flex;
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
      height: 26px;
    }
    .tlcorner {
      width: var(--fb-tl-label, 150px);
      flex: 0 0 var(--fb-tl-label, 150px);
      position: sticky;
      left: 0;
      background: inherit;
      z-index: 2;
    }
    .tlhours {
      position: relative;
    }
    .tlhour {
      position: absolute;
      top: 5px;
      transform: translateX(-50%);
      font-size: 10.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .tlrow {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
    }
    .tlperson {
      width: var(--fb-tl-label, 150px);
      flex: 0 0 var(--fb-tl-label, 150px);
      position: sticky;
      left: 0;
      z-index: 4;
      background: var(--card-background-color, var(--ha-card-background));
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      box-sizing: border-box;
      border-right: 1px solid var(--divider-color);
    }
    .tlperson .pname {
      font-size: 12.5px;
    }
    .tlcanvas {
      position: relative;
      flex: 0 0 auto;
    }
    .tlcanvas.creatable {
      cursor: copy;
    }
    .tlbar {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 7px;
      border-radius: var(--fb-radius);
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.12s ease,
        transform 0.12s ease;
    }
    .tlbar:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
      z-index: 3;
    }
    .tlbar.tentative {
      opacity: 0.72;
      border-style: dashed;
    }
    .tlbar .etime {
      flex: 0 0 auto;
    }
    .tlnow {
      position: absolute;
      top: 0;
      bottom: 0;
      border-left: 2px solid var(--fb-now-color);
      z-index: 6;
      pointer-events: none;
    }
    .tlnow span {
      position: absolute;
      top: 2px;
      left: -1px;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--fb-now-color);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* agenda */
    .agenda {
      max-height: 60vh;
      overflow: auto;
      padding: 4px 0 8px;
    }
    .agenda-empty {
      padding: 28px 16px;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .agenda-day {
      padding: 0 12px;
    }
    .agenda-date {
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--card-background-color, var(--ha-card-background));
      font-weight: 600;
      font-size: 13px;
      padding: 8px 4px 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .agenda-date.today {
      color: var(--primary-color);
    }
    .agenda-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
      cursor: pointer;
      border-bottom: 1px solid var(--divider-color);
    }
    .agenda-row:hover {
      background: var(--secondary-background-color);
    }
    .agenda-time {
      flex: 0 0 92px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .agenda-bar {
      flex: 0 0 4px;
      align-self: stretch;
      border-radius: 2px;
    }
    .agenda-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .agenda-title {
      font-size: 13.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .agenda-meta {
      font-size: 11px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* month */
    .monthwrap {
      overflow: auto;
      max-height: 62vh;
      padding: 0 8px 8px;
    }
    .monthhead {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--card-background-color, var(--ha-card-background));
    }
    .mhcell {
      text-align: center;
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color);
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .monthgrid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: minmax(64px, 1fr);
    }
    .mcell {
      border-right: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 3px;
      cursor: pointer;
      overflow: hidden;
      box-sizing: border-box;
    }
    .mcell:nth-child(7n) {
      border-right: none;
    }
    .mcell.out {
      background: color-mix(in srgb, var(--secondary-text-color, #888) 4%, transparent);
    }
    .mcell.out .mdate {
      opacity: 0.45;
    }
    .mcell:hover {
      background: var(--secondary-background-color);
    }
    .mcell.today {
      background: color-mix(in srgb, var(--fb-accent) 7%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--fb-accent);
    }
    .mcell.wkend:not(.today) {
      background: color-mix(in srgb, var(--secondary-text-color, #888) 3.5%, transparent);
    }
    .mdate {
      font-size: 12px;
      font-weight: 600;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-variant-numeric: tabular-nums;
    }
    .mdate.today {
      background: var(--fb-accent);
      color: var(--text-primary-color, #fff);
      border-radius: 50%;
    }
    .mchips {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 2px;
    }
    .mchip {
      font-size: 10px;
      font-weight: 600;
      padding: 1px 4px;
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mmore {
      font-size: 9.5px;
      color: var(--secondary-text-color);
      padding-left: 4px;
    }
    /* weather chip */
    .wx {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      vertical-align: middle;
      font-variant-numeric: tabular-nums;
      background: var(--secondary-background-color);
      border-radius: 999px;
      padding: 2px 9px 2px 5px;
      margin-left: 6px;
    }
    .wx ha-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-text-color);
    }
    .agenda-date .wx {
      margin-left: 4px;
    }
    /* faded past events + map link */
    .past {
      opacity: var(--fb-past-opacity);
    }
    /* progress bar inside a running day event */
    .eprog {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3px;
      background: var(--divider-color);
    }
    .eprog > div {
      height: 100%;
      background: var(--fb-now-color);
    }
    /* agenda: countdown + running progress */
    .agenda-cd {
      flex: 0 0 auto;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .agenda-row.current {
      background: color-mix(in srgb, var(--fb-accent) 6%, transparent);
    }
    .agenda-prog {
      display: block;
      height: 3px;
      margin-top: 4px;
      border-radius: 2px;
      background: var(--divider-color);
      overflow: hidden;
    }
    .agenda-prog > span {
      display: block;
      height: 100%;
    }
    .maplink {
      margin-left: 8px;
      font-size: 11px;
      color: var(--primary-color);
      text-decoration: none;
    }
    .maplink:hover {
      text-decoration: underline;
    }
    /* week */
    .weekwrap {
      overflow: auto;
      max-height: 60vh;
    }
    .weekgrid {
      display: grid;
    }
    .corner {
      position: sticky;
      left: 0;
      top: 0;
      z-index: 6;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
    }
    .wphead {
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
      border-left: 1px solid var(--divider-color);
      padding: 8px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .wphead .avatar {
      width: 28px;
      height: 28px;
    }
    .wday {
      position: sticky;
      left: 0;
      z-index: 4;
      background: var(--card-background-color, var(--ha-card-background));
      border-right: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 12.5px;
    }
    .wcell {
      min-height: 70px;
      border-left: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .wcell.creatable {
      cursor: copy;
    }
    .wday.today,
    .wcell.today {
      background: color-mix(in srgb, var(--fb-accent) 8%, transparent);
    }
    .wchip {
      border-radius: var(--fb-radius-sm);
      padding: 3px 5px;
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      cursor: pointer;
    }
    .wchip span {
      font-size: var(--fb-chip-size);
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wchip small {
      margin-left: auto;
      font-size: 8.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    /* focus visibility for a11y */
    button:focus-visible,
    .event:focus-visible,
    .wchip:focus-visible,
    .adchip:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    /* dialog */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99;
      padding: 16px;
    }
    .dialog {
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
      border-radius: 14px;
      padding: 16px;
      width: 100%;
      max-width: 420px;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      box-sizing: border-box;
    }
    .dlg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 16px;
    }
    .dlg-cal {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 2px 0 10px;
    }
    .icon {
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 16px;
    }
    .fld {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-bottom: 10px;
    }
    .fld > span {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .row {
      display: flex;
      gap: 10px;
    }
    .row .fld {
      flex: 1;
    }
    input,
    textarea,
    select {
      font: inherit;
      font-size: 14px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 8px 10px;
      box-sizing: border-box;
      width: 100%;
    }
    input:disabled,
    textarea:disabled {
      opacity: 0.7;
    }
    .recur {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 12px;
      margin-bottom: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: var(--secondary-background-color);
    }
    .recur-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      width: 100%;
    }
    .recur-opt {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .recur-opt input {
      width: auto;
    }
    .chk {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 13px;
    }
    .chk input {
      width: auto;
    }
    .ro-note {
      font-size: 12px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 8px 10px;
      margin-bottom: 10px;
    }
    .dlg-error {
      font-size: 12.5px;
      color: var(--error-color, #ff5252);
      margin-bottom: 10px;
    }
    .dlg-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }
    .dlg-actions .spacer {
      flex: 1;
    }
    .dlg-actions button {
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .ghost {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .danger {
      background: var(--error-color, #ff5252);
      color: #fff;
    }
    button:disabled {
      opacity: 0.6;
      cursor: default;
    }
    ${Ee}
  `,e([he({attribute:!1})],rt.prototype,"hass",void 0),e([pe()],rt.prototype,"_config",void 0),e([pe()],rt.prototype,"_events",void 0),e([pe()],rt.prototype,"_view",void 0),e([pe()],rt.prototype,"_day",void 0),e([pe()],rt.prototype,"_weekOffset",void 0),e([pe()],rt.prototype,"_monthOffset",void 0),e([pe()],rt.prototype,"_dialog",void 0),e([pe()],rt.prototype,"_loadError",void 0),e([pe()],rt.prototype,"_partialLoad",void 0),e([pe()],rt.prototype,"_loading",void 0),e([pe()],rt.prototype,"_fitPx",void 0),e([pe()],rt.prototype,"_hiddenP",void 0),e([pe()],rt.prototype,"_drag",void 0),e([pe()],rt.prototype,"_browserOnline",void 0),e([pe()],rt.prototype,"_forecast",void 0),customElements.get("moran-family-board-card")||customElements.define("moran-family-board-card",rt),window.customCards=window.customCards||[],window.customCards.push({type:"moran-family-board-card",name:"Moran Family Board Card",description:"Family calendar / who-is-where board for multiple people – day, timeline, week, month and agenda views.",preview:!0,documentationURL:"https://github.com/emilianomoran/moran-family-board-card"}),console.info("%c MORAN-FAMILY-BOARD-CARD %c v0.25.1-moran.4 ","background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px","background:#222;color:#fff;border-radius:0 3px 3px 0");const st={l_title:"Card title",l_layout:"Layout",l_refresh_interval:"Auto refresh (sec., 0 = off)",l_view:"Default view",l_views:"Available views (switcher)",l_time_grid:"Time grid",l_start_hour:"Start hour",l_end_hour:"End hour",l_hour_height:"Height per hour",l_hour_width:"Timeline: width per hour",l_fit_height:"Auto-fit: squeeze the day so it fits without scrolling",l_full_height:"Full height: stretch to the bottom of the screen",l_trim_hours:"Hide empty hours at the edges",l_col_min_width:"Min. column width per person",l_background_hours:"Show long events as a background band from (hrs.)",l_max_columns:"Max. columns per day",l_first_day:"Week starts on",l_scroll_to_now:"Auto-scroll to now",l_remember_preferences:"Remember view and hidden people on this browser",l_preferences_key:"Preferences ID (optional)",h_remember_preferences:"On by default in wall mode. Browser-local and per HA user; no events are saved. Changing lane definitions resets saved filters.",h_preferences_key:"Give otherwise identical cards on the same dashboard path different IDs to keep their preferences separate.",l_color_by:"Color by",l_show_weekends:"Show weekend",l_show_now_line:"Now line",l_dim_past:"Dim past events",l_show_progress:"Show progress bar",l_hide_patterns:"Hide events",l_show_patterns:"Only show events matching",l_replace_patterns:"Replace titles",l_filter_duplicates:"Merge duplicate events",l_tentative_patterns:"Mark as tentative",l_auto_icons:"Auto icons by keyword",l_icon_patterns:"Custom icon rules",l_show_focus:"“Now / next” bar",l_read_only:"Read-only calendar",l_drag_drop:"Move events by dragging (day view)",l_weather_entity:"Weather entity",l_show_weather:"Show weather",l_hide_empty_persons:"Week: hide persons without events",l_auto_return:"Return to the start view after idle (min., 0 = off)",l_event_size:"Event font size",l_radius:"Corner radius of the blocks",l_past_opacity:"Opacity of past events",l_name:"Display name",l_person:"Person (avatar & status)",l_calendar:"Calendars (multiple possible)",l_match_title_prefixes:"Route title prefixes",l_match_title_contains:"Route title contains",l_match_title_regex:"Route title regular expressions",l_unmatched:"Fallback lane for unmatched events",l_strip_title_prefix:"Hide the matched prefix in event titles",l_color:"Custom color (hex, optional)",l_badges:"Badges (e.g. battery, sensors)",l_hidden:"Hidden on start",l_compact:"Compact layout",l_map_url:"Map link (template)",h_hide_patterns:"Text patterns, e.g. “Recess” – matches are hidden",h_layout:"Wall fills the available panel with a calendar-first day layout. Default keeps the existing card.",h_show_patterns:"Allow list: only events whose title contains one of the patterns",h_replace_patterns:"e.g. “Homeroom => Lesson” (without => the text is removed)",h_tentative_patterns:"Matches are drawn dashed / translucent",h_filter_duplicates:"The same event in several calendars is shown only once",h_auto_return:"Kiosk: jumps back to “today” after X minutes without a touch",h_background_hours:"0 = off. Long all-day-ish events (after-school care …) as a subtle band",h_fit_height:"Compresses the day until everything is visible without scrolling",h_full_height:"For panel view / wall tablet",h_trim_hours:"Shows only the hours that actually contain events",h_col_min_width:"Below this the board scrolls horizontally",h_weather_entity:"Daily forecast in the header (HA location)",h_auto_icons:"e.g. doctor → 🩺, sport → 🏃, birthday → 🎂 (titles with emoji stay untouched)",h_icon_patterns:"Own rules, e.g. “Grandma => 👵”",h_show_focus:"Compact bar above the views: what is running now / coming next",h_read_only:"View event details without creating, editing, deleting, or dragging events",h_drag_drop:"Writable calendars only; drag to move, bottom edge changes the duration",h_views:"Which switchers appear at the top",h_badges:"Small chips below the person header; click opens details",h_match_title_prefixes:"Only route titles beginning with one of these values; leading symbols and emoji are ignored",h_match_title_contains:"Also route titles containing one of these values",h_match_title_regex:"Advanced case-insensitive title patterns; invalid patterns are ignored",h_unmatched:"Receives events from these calendars only when no normal lane claimed them",h_strip_title_prefix:"For example, show ‘Rehearsal’ instead of ‘Avery: Rehearsal’",h_color:"Leave empty for the palette color",h_hidden:"Column starts collapsed; a click on the header brings it back",h_compact:"Smaller fonts and tighter spacing in a single switch",h_map_url:"{location} is substituted, e.g. https://maps.apple.com/?q={location}",o_person:"Person",o_location:"Location",o_calendar:"Calendar",o_monday:"Monday",o_sunday:"Sunday",o_default:"Default",o_wall:"Wall",g_views:"🗓️ Views",g_layout:"📐 Layout & size",g_filters:"🧹 Filters & clean-up",g_looks:"🎨 Appearance (fine-tuning)",g_kiosk:"🖥️ Kiosk & extras",w_title:"👨‍👩‍👧‍👦 Welcome to the family board!",w_text:"Ready in two clicks – the card detects your family automatically from the person and calendar entities of your Home Assistant.",w_detect:"✨ Step 1: detect persons automatically",w_hint:"Optionally afterwards: pick a profile (below) or fine-tune the settings in the groups. Of course you can also add persons by hand:",w_empty:"＋ Start empty",p_tablet:"🖥️ Wall tablet",p_tablet_title:"Full screen, auto-fit, return to today",p_phone:"📱 Phone",p_phone_title:"Agenda as start view, compact columns",p_reset:"🧩 Default",p_reset_title:"Reset the layout settings",s_persons:"People",s_calendars:"Calendars (color & label)",s_settings:"Settings",b_add_person:"＋ Add person",b_detect:"✨ Detect automatically",b_up:"Move up",b_down:"Move down",b_remove:"Remove",b_auto:"Automatic",ph_label:"Custom label",ph_icon:"Icon, e.g. mdi:school",ph_title_field:"Title from field (e.g. description)",person_n:"Person",cal_hint_1:"Colors apply with “Color by: calendar”, labels in the event dialog. Icon = mdi icon in front of the title. “Title from field” uses e.g.",cal_hint_2:"instead of",cal_hint_3:"as the event title."},ot={en:st,de:{l_title:"Kartentitel",l_layout:"Layout",l_refresh_interval:"Auto-Aktualisierung (Sek., 0 = aus)",l_view:"Standardansicht",l_views:"Verfügbare Ansichten (Umschalter)",l_time_grid:"Zeitraster",l_start_hour:"Startstunde",l_end_hour:"Endstunde",l_hour_height:"Höhe pro Stunde",l_hour_width:"Zeitstrahl: Breite pro Stunde",l_fit_height:"Auto-Fit: Tag ohne Scrollen einpassen",l_full_height:"Volle Höhe: bis zum unteren Bildschirmrand",l_trim_hours:"Leere Randstunden automatisch ausblenden",l_col_min_width:"Min. Spaltenbreite pro Person",l_background_hours:"Lange Termine als Hintergrund-Band ab (Std.)",l_max_columns:"Max. Spalten pro Tag",l_first_day:"Wochenstart",l_scroll_to_now:"Auto-Scroll zu jetzt",l_remember_preferences:"Ansicht und ausgeblendete Personen in diesem Browser merken",l_preferences_key:"Einstellungs-ID (optional)",h_remember_preferences:"Im Wall-Modus standardmäßig aktiv. Lokal im Browser und je HA-Benutzer; keine Termine werden gespeichert. Geänderte Personenspalten setzen Filter zurück.",h_preferences_key:"Unterschiedliche IDs trennen die Einstellungen identischer Karten auf demselben Dashboard-Pfad.",l_color_by:"Einfärben nach",l_show_weekends:"Wochenende anzeigen",l_show_now_line:"Jetzt-Linie",l_dim_past:"Vergangene Termine ausgrauen",l_show_progress:"Fortschrittsbalken anzeigen",l_hide_patterns:"Termine ausblenden",l_show_patterns:"Nur Termine zeigen mit",l_replace_patterns:"Titel ersetzen",l_filter_duplicates:"Doppelte Termine zusammenfassen",l_tentative_patterns:"Als vorläufig markieren",l_auto_icons:"Auto-Symbole nach Stichwort",l_icon_patterns:"Eigene Symbol-Regeln",l_show_focus:"„Jetzt / als Nächstes“-Leiste",l_read_only:"Kalender nur lesen",l_drag_drop:"Termine per Ziehen verschieben (Tagesansicht)",l_weather_entity:"Wetter-Entität",l_show_weather:"Wetter anzeigen",l_hide_empty_persons:"Woche: Personen ohne Termine ausblenden",l_auto_return:"Nach Inaktivität zur Startansicht (Min., 0 = aus)",l_event_size:"Schriftgröße Termine",l_radius:"Ecken-Radius der Blöcke",l_past_opacity:"Deckkraft vergangener Termine",l_name:"Anzeigename",l_person:"Person (Avatar & Status)",l_calendar:"Kalender (mehrere möglich)",l_match_title_prefixes:"Titel-Präfixe zuordnen",l_match_title_contains:"Titel enthält",l_match_title_regex:"Reguläre Ausdrücke für Titel",l_unmatched:"Auffangspalte für nicht zugeordnete Termine",l_strip_title_prefix:"Zugeordnetes Präfix im Titel ausblenden",l_color:"Eigene Farbe (Hex, optional)",l_badges:"Badges (z. B. Akku, Sensoren)",l_hidden:"Beim Start ausgeblendet",l_compact:"Kompakte Darstellung",l_map_url:"Karten-Link (Vorlage)",h_hide_patterns:"Textmuster, z. B. „Hofpause“ – Treffer werden ausgeblendet",h_layout:"Wand füllt das verfügbare Panel mit einer kalenderzentrierten Tagesansicht. Standard behält die bestehende Karte bei.",h_show_patterns:"Allow-Liste: nur Termine, deren Titel eines der Muster enthält",h_replace_patterns:"z. B. „Klassenverbund => Unterricht“ (ohne => wird der Text entfernt)",h_tentative_patterns:"Treffer werden gestrichelt/transparent dargestellt",h_filter_duplicates:"Gleicher Termin in mehreren Kalendern nur einmal",h_auto_return:"Kiosk: springt nach X Minuten ohne Berührung zurück zu „heute“",h_background_hours:"0 = aus. Lange Dauertermine (OGS, Betreuung …) als dezentes Band",h_fit_height:"Staucht den Tag, bis alles ohne Scrollen sichtbar ist",h_full_height:"Für Panel-Ansicht / Wandtablet",h_trim_hours:"Zeigt nur die Stunden, in denen wirklich Termine liegen",h_col_min_width:"Darunter wird horizontal gescrollt",h_weather_entity:"Tages-Vorhersage im Kopf (HA-Standort)",h_auto_icons:"z. B. Arzt → 🩺, Sport → 🏃, Geburtstag → 🎂 (Titel mit Emoji bleiben unberührt)",h_icon_patterns:"eigene Regeln, z. B. „Oma => 👵“",h_show_focus:"Kompakte Leiste über den Ansichten: was läuft jetzt / kommt als Nächstes",h_read_only:"Termindetails ansehen, ohne Termine anzulegen, zu ändern, zu löschen oder zu ziehen",h_drag_drop:"Nur bei schreibbaren Kalendern; Ziehen verschiebt, unterer Rand ändert die Dauer",h_views:"Welche Umschalter oben erscheinen",h_badges:"Kleine Chips unter dem Personenkopf; Klick öffnet Details",h_match_title_prefixes:"Nur Titel mit einem dieser Anfänge zuordnen; führende Symbole und Emoji werden ignoriert",h_match_title_contains:"Zusätzlich Titel zuordnen, die einen dieser Werte enthalten",h_match_title_regex:"Erweiterte Titelmuster ohne Groß-/Kleinschreibung; ungültige Muster werden ignoriert",h_unmatched:"Erhält Termine aus diesen Kalendern nur, wenn keine normale Spalte sie zuordnet",h_strip_title_prefix:"Zeigt zum Beispiel ‘Probe’ statt ‘Avery: Probe’",h_color:"Leer lassen für Palettenfarbe",h_hidden:"Spalte startet eingeklappt; ein Klick auf den Kopf holt sie zurück",h_compact:"Kleinere Schriften und engere Abstände in einem Schalter",h_map_url:"{location} wird ersetzt, z. B. https://maps.apple.com/?q={location}",o_person:"Person",o_location:"Ort",o_calendar:"Kalender",o_monday:"Montag",o_sunday:"Sonntag",o_default:"Standard",o_wall:"Wand",g_views:"🗓️ Ansichten",g_layout:"📐 Layout & Größe",g_filters:"🧹 Filter & Aufräumen",g_looks:"🎨 Aussehen (Feintuning)",g_kiosk:"🖥️ Kiosk & Extras",w_title:"👨‍👩‍👧‍👦 Willkommen beim Familienplan!",w_text:"In zwei Klicks startklar – die Karte erkennt deine Familie automatisch aus den Personen- und Kalender-Entitäten deines Home Assistant.",w_detect:"✨ Schritt 1: Personen automatisch erkennen",w_hint:"Danach optional: Profil wählen (unten) oder Feinheiten in den Gruppen einstellen. Natürlich kannst du Personen auch von Hand anlegen:",w_empty:"＋ Leer starten",p_tablet:"🖥️ Wandtablet",p_tablet_title:"Vollbild, Auto-Fit, Rückkehr zu heute",p_phone:"📱 Handy",p_phone_title:"Agenda als Startansicht, kompakte Spalten",p_reset:"🧩 Standard",p_reset_title:"Layout-Einstellungen zurücksetzen",s_persons:"Personen",s_calendars:"Kalender (Farbe & Label)",s_settings:"Einstellungen",b_add_person:"＋ Person hinzufügen",b_detect:"✨ Automatisch erkennen",b_up:"Nach oben",b_down:"Nach unten",b_remove:"Entfernen",b_auto:"Automatisch",ph_label:"Eigenes Label",ph_icon:"Symbol, z. B. mdi:school",ph_title_field:"Titel aus Feld (z. B. description)",person_n:"Person",cal_hint_1:"Farben wirken bei „Einfärben nach: Kalender“, Labels im Termin-Dialog. Symbol = mdi-Icon vor dem Titel. „Titel aus Feld“ nutzt z. B.",cal_hint_2:"statt",cal_hint_3:"als Termin-Titel."}};function lt(e,t){return ot[e]?.[t]??st[t]??t}const dt=["#7986cb","#4fc3f7","#4db6ac","#aed581","#ffd54f","#ffb74d","#e57373","#f06292","#f48fb1","#ce93d8","#9575cd","#90a4ae"],ct=[{name:"name",selector:{text:{}}},{name:"person",selector:{entity:{filter:{domain:"person"}}}},{name:"calendar",selector:{entity:{filter:{domain:"calendar"},multiple:!0}}},{name:"match_title_prefixes",selector:{text:{multiple:!0}}},{name:"match_title_contains",selector:{text:{multiple:!0}}},{name:"match_title_regex",selector:{text:{multiple:!0}}},{name:"unmatched",selector:{boolean:{}}},{name:"strip_title_prefix",selector:{boolean:{}}},{name:"badges",selector:{entity:{multiple:!0}}},{name:"color",selector:{text:{}}},{name:"hidden",selector:{boolean:{}}}],ht=(e,t,i)=>({name:"",type:"expandable",title:e,icon:t,schema:i});class pt extends oe{constructor(){super(...arguments),this._t=e=>lt(this._lang,e),this._label=e=>{const t=`l_${e.name}`,i=lt(this._lang,t);return i===t?e.name:i},this._helper=e=>{const t=`h_${e.name}`,i=lt(this._lang,t);return i===t?void 0:i}}setConfig(e){this._config=e}get _persons(){return Array.isArray(this._config.persons)?this._config.persons:[]}get _lang(){return Ie(this.hass)}_viewOptions(){return Se.map(e=>({value:e,label:Re(this.hass,e)}))}get _isFresh(){return!this._persons.some(e=>e.name||e.person||e.calendar)}get _settingsData(){return{...this._config,layout:Ce(this._config.layout),remember_preferences:this._config.remember_preferences??"wall"===Ce(this._config.layout),time_grid:String(this._config.time_grid??30)}}_schema(){const e=this._config,t=Array.isArray(e.views)&&e.views.length?e.views:Se,i=t.includes("day"),a=t.includes("timeline"),n=t.includes("week"),r=[{name:"layout",selector:{select:{mode:"dropdown",options:[{value:"default",label:this._t("o_default")},{value:"wall",label:this._t("o_wall")}]}}}];(i||a)&&r.push({name:"start_hour",selector:{number:{min:0,max:23,mode:"box"}}},{name:"end_hour",selector:{number:{min:1,max:24,mode:"box"}}},{name:"trim_hours",selector:{boolean:{}}}),i&&r.push({name:"hour_height",selector:{number:{min:40,max:96,step:4,mode:"slider",unit_of_measurement:"px"}}},{name:"fit_height",selector:{boolean:{}}},{name:"col_min_width",selector:{number:{min:60,max:400,step:10,mode:"slider",unit_of_measurement:"px"}}},{name:"max_columns",selector:{number:{min:1,max:8,step:1,mode:"slider"}}},{name:"background_hours",selector:{number:{min:0,max:12,step:1,mode:"slider",unit_of_measurement:"h"}}}),a&&r.push({name:"hour_width",selector:{number:{min:48,max:240,step:8,mode:"slider",unit_of_measurement:"px"}}}),r.push({name:"full_height",selector:{boolean:{}}});const s=[{name:"auto_return",selector:{number:{min:0,max:60,step:1,mode:"box",unit_of_measurement:"min"}}},{name:"scroll_to_now",selector:{boolean:{}}},{name:"remember_preferences",selector:{boolean:{}}},{name:"preferences_key",selector:{text:{}}},{name:"show_now_line",selector:{boolean:{}}},{name:"show_progress",selector:{boolean:{}}},{name:"weather_entity",selector:{entity:{filter:{domain:"weather"}}}},{name:"map_url",selector:{text:{}}}];return e.weather_entity&&s.push({name:"show_weather",selector:{boolean:{}}}),s.push({name:"refresh_interval",selector:{number:{min:0,max:3600,mode:"box",unit_of_measurement:"s"}}}),[{name:"title",selector:{text:{}}},ht(this._t("g_views"),"mdi:calendar-multiselect",[{name:"view",selector:{select:{mode:"dropdown",options:this._viewOptions()}}},{name:"views",selector:{select:{multiple:!0,options:this._viewOptions()}}},{name:"time_grid",selector:{select:{mode:"dropdown",options:[{value:"60",label:"60 min"},{value:"30",label:"30 min"},{value:"15",label:"15 min"}]}}},{name:"first_day",selector:{select:{mode:"dropdown",options:[{value:"monday",label:this._t("o_monday")},{value:"sunday",label:this._t("o_sunday")}]}}},{name:"show_weekends",selector:{boolean:{}}}]),ht(this._t("g_layout"),"mdi:resize",r),ht(this._t("g_filters"),"mdi:broom",[{name:"hide_patterns",selector:{text:{multiple:!0}}},{name:"show_patterns",selector:{text:{multiple:!0}}},{name:"replace_patterns",selector:{text:{multiple:!0}}},{name:"filter_duplicates",selector:{boolean:{}}},{name:"tentative_patterns",selector:{text:{multiple:!0}}},...n?[{name:"hide_empty_persons",selector:{boolean:{}}}]:[]]),ht(this._t("g_looks"),"mdi:palette",[{name:"show_focus",selector:{boolean:{}}},{name:"read_only",selector:{boolean:{}}},{name:"drag_drop",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}},{name:"auto_icons",selector:{boolean:{}}},...e.auto_icons?[{name:"icon_patterns",selector:{text:{multiple:!0}}}]:[],{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"person",label:this._t("o_person")},{value:"location",label:this._t("o_location")},{value:"calendar",label:this._t("o_calendar")}]}}},{name:"dim_past",selector:{boolean:{}}},{name:"event_size",selector:{number:{min:9,max:16,step:.5,mode:"slider",unit_of_measurement:"px"}}},{name:"radius",selector:{number:{min:0,max:18,step:1,mode:"slider",unit_of_measurement:"px"}}},{name:"past_opacity",selector:{number:{min:10,max:100,step:5,mode:"slider",unit_of_measurement:"%"}}}]),ht(this._t("g_kiosk"),"mdi:tablet-dashboard",s)]}_emit(e){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_settingsChanged(e){e.stopPropagation();const t={...e.detail.value},i=Ce(t.layout);delete t.layout,"string"==typeof t.time_grid&&(t.time_grid=Number(t.time_grid));const a={...this._config,...t,persons:this._persons,...this._config.calendars?{calendars:this._config.calendars}:{}};this._emit(function(e,t){const i={...e};return"wall"===t?i.layout="wall":delete i.layout,i}(a,i))}_applyPreset(e){const t={...this._config,persons:this._persons},i=e=>e.forEach(e=>delete t[e]);"tablet"===e?Object.assign(t,{view:"day",full_height:!0,fit_height:!0,trim_hours:!0,scroll_to_now:!0,auto_return:5}):"phone"===e?(Object.assign(t,{view:"agenda",col_min_width:96}),i(["full_height","fit_height","auto_return"])):(i(["full_height","fit_height","trim_hours","auto_return","col_min_width","hour_height","hour_width","max_columns","background_hours","event_size","radius","past_opacity"]),t.view="day"),this._emit(t)}_personChanged(e,t){t.stopPropagation();const i={...t.detail.value};i.color||delete i.color,Array.isArray(i.badges)&&0===i.badges.length&&delete i.badges,Array.isArray(i.match_title_prefixes)&&0===i.match_title_prefixes.length&&delete i.match_title_prefixes,Array.isArray(i.match_title_contains)&&0===i.match_title_contains.length&&delete i.match_title_contains,Array.isArray(i.match_title_regex)&&0===i.match_title_regex.length&&delete i.match_title_regex,i.unmatched||delete i.unmatched,i.strip_title_prefix||delete i.strip_title_prefix,i.hidden||delete i.hidden,Array.isArray(i.calendar)&&(0===i.calendar.length?delete i.calendar:1===i.calendar.length&&(i.calendar=i.calendar[0]));const a=this._persons.map((t,a)=>a===e?i:t);this._emit({...this._config,persons:a})}_personData(e){const t=Array.isArray(e.calendar)?e.calendar:e.calendar?[e.calendar]:[];return{...e,calendar:t}}_setPersonColor(e,t){const i=this._persons.map((i,a)=>{if(a!==e)return i;const n={...i};return t?n.color=t:delete n.color,n});this._emit({...this._config,persons:i})}_addPerson(){const e=[...this._persons,{name:"",person:"",calendar:""}];this._emit({...this._config,persons:e})}_autoDetect(){const e=nt(this.hass);if(0===e.length)return;const t=new Set(this._persons.map(e=>e.person).filter(Boolean)),i=[...this._persons.filter(e=>e.name||e.person||e.calendar)];for(const a of e)t.has(a.person)||i.push(a);this._emit({...this._config,persons:i})}_removePerson(e){const t=this._persons.filter((t,i)=>i!==e);this._emit({...this._config,persons:t})}_movePerson(e,t){const i=[...this._persons],a=e+t;a<0||a>=i.length||([i[e],i[a]]=[i[a],i[e]],this._emit({...this._config,persons:i}))}_calsUsed(){const e=[];for(const t of this._persons){const i=Array.isArray(t.calendar)?t.calendar:t.calendar?[t.calendar]:[];for(const t of i)t&&!e.includes(t)&&e.push(t)}return e}_setCalMeta(e,t){const i={...this._config.calendars??{}},a={...i[e]??{}};for(const e of["color","label","icon","title_field"]){const i=t[e];void 0!==i&&(i?a[e]=i:delete a[e])}0===Object.keys(a).length?delete i[e]:i[e]=a;const n={...this._config,persons:this._persons};0===Object.keys(i).length?delete n.calendars:n.calendars=i,this._emit(n)}_calName(e){return this.hass.states[e]?.attributes?.friendly_name||e}_swatches(e,t){return K`
      <div class="swatches">
        ${dt.map(i=>K`
            <button
              class="swatch ${e?.toLowerCase()===i?"on":""}"
              style="background:${i}"
              title=${i}
              @click=${()=>t(i)}
            ></button>
          `)}
        <button
          class="swatch none ${e?"":"on"}"
          title=${this._t("b_auto")}
          @click=${()=>t()}
        >
          A
        </button>
      </div>
    `}render(){if(!this._config)return j;if(this._isFresh)return K`
        <div class="wizard">
          <div class="wtitle">${this._t("w_title")}</div>
          <div class="wtext">${this._t("w_text")}</div>
          <button class="wbtn primary" @click=${this._autoDetect}>${this._t("w_detect")}</button>
          <div class="wtext small">${this._t("w_hint")}</div>
          <button class="wbtn" @click=${this._addPerson}>${this._t("w_empty")}</button>
        </div>
      `;const e=this._persons,t=this._calsUsed();return K`
      <div class="presets">
        <button title=${this._t("p_tablet_title")} @click=${()=>this._applyPreset("tablet")}>
          ${this._t("p_tablet")}
        </button>
        <button title=${this._t("p_phone_title")} @click=${()=>this._applyPreset("phone")}>
          ${this._t("p_phone")}
        </button>
        <button title=${this._t("p_reset_title")} @click=${()=>this._applyPreset("reset")}>
          ${this._t("p_reset")}
        </button>
      </div>

      <div class="section-title">${this._t("s_persons")}</div>
      <div class="persons">
        ${e.map((t,i)=>K`
            <div class="person">
              <div class="person-head">
                <span
                  class="pdot"
                  style="background:${t.color||dt[i%dt.length]}"
                ></span>
                <span class="pidx">${t.name||`${this._t("person_n")} ${i+1}`}</span>
                <div class="ptools">
                  <button
                    class="icon"
                    title=${this._t("b_up")}
                    ?disabled=${0===i}
                    @click=${()=>this._movePerson(i,-1)}
                  >
                    ↑
                  </button>
                  <button
                    class="icon"
                    title=${this._t("b_down")}
                    ?disabled=${i===e.length-1}
                    @click=${()=>this._movePerson(i,1)}
                  >
                    ↓
                  </button>
                  <button
                    class="icon danger"
                    title=${this._t("b_remove")}
                    @click=${()=>this._removePerson(i)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              ${this._swatches(t.color,e=>this._setPersonColor(i,e))}
              <ha-form
                .hass=${this.hass}
                .data=${this._personData(t)}
                .schema=${ct}
                .computeLabel=${this._label}
                .computeHelper=${this._helper}
                @value-changed=${e=>this._personChanged(i,e)}
              ></ha-form>
            </div>
          `)}
        <div class="addrow">
          <button class="add" @click=${this._addPerson}>${this._t("b_add_person")}</button>
          <button class="add detect" @click=${this._autoDetect}>${this._t("b_detect")}</button>
        </div>
      </div>

      ${t.length>1||this._config.calendars?K`
            <div class="section-title">${this._t("s_calendars")}</div>
            <div class="cals">
              ${t.map(e=>{const t=this._config.calendars?.[e]??{};return K`
                  <div class="cal">
                    <div class="cal-head">
                      <span
                        class="pdot"
                        style="background:${t.color||"var(--divider-color)"}"
                      ></span>
                      <span class="cal-name" title=${e}>${this._calName(e)}</span>
                      <input
                        class="cal-label"
                        type="text"
                        placeholder=${this._t("ph_label")}
                        .value=${t.label??""}
                        @change=${t=>this._setCalMeta(e,{label:t.target.value||null})}
                      />
                    </div>
                    ${this._swatches(t.color,t=>this._setCalMeta(e,{color:t??null}))}
                    <div class="cal-extra">
                      <input
                        type="text"
                        placeholder=${this._t("ph_icon")}
                        .value=${t.icon??""}
                        @change=${t=>this._setCalMeta(e,{icon:t.target.value||null})}
                      />
                      <input
                        type="text"
                        placeholder=${this._t("ph_title_field")}
                        .value=${t.title_field??""}
                        @change=${t=>this._setCalMeta(e,{title_field:t.target.value||null})}
                      />
                    </div>
                  </div>
                `})}
              <div class="hint">
                ${this._t("cal_hint_1")} <code>description</code> ${this._t("cal_hint_2")}
                <code>summary</code> ${this._t("cal_hint_3")}
              </div>
            </div>
          `:j}

      <div class="section-title">${this._t("s_settings")}</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._settingsData}
        .schema=${this._schema()}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._settingsChanged}
      ></ha-form>
    `}}pt.styles=s`
    .wizard {
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }
    .wtitle {
      font-size: 17px;
      font-weight: 700;
    }
    .wtext {
      font-size: 13px;
      color: var(--secondary-text-color);
      line-height: 1.5;
    }
    .wtext.small {
      font-size: 12px;
    }
    .wbtn {
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 10px;
      padding: 12px;
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 600;
    }
    .wbtn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
    }
    .presets {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
    }
    .presets button {
      flex: 1;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 8px 10px;
      cursor: pointer;
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
    }
    .presets button:hover {
      border-color: var(--primary-color);
    }
    .section-title {
      font-weight: 600;
      font-size: 14px;
      margin: 14px 2px 8px;
    }
    .hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      line-height: 1.4;
      padding: 2px 2px 0;
    }
    .persons,
    .cals {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .person,
    .cal {
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 8px 10px 6px;
    }
    .person-head,
    .cal-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .pdot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex: 0 0 12px;
    }
    .pidx {
      font-weight: 600;
      font-size: 13px;
      flex: 1;
    }
    .cal-name {
      font-weight: 600;
      font-size: 12.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cal-extra {
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }
    .cal-extra input {
      flex: 1;
      min-width: 0;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      padding: 4px 8px;
    }
    .cal-label {
      margin-left: auto;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      padding: 4px 8px;
      width: 130px;
    }
    .ptools {
      display: inline-flex;
      gap: 2px;
    }
    .icon {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 6px;
      width: 26px;
      height: 26px;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
    }
    .icon:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .icon.danger:hover {
      background: var(--error-color, #ff5252);
      color: #fff;
    }
    .swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin: 2px 0 6px;
    }
    .swatch {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      padding: 0;
    }
    .swatch.on {
      border-color: var(--primary-text-color);
      box-shadow: 0 0 0 2px var(--card-background-color, #fff) inset;
    }
    .swatch.none {
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
    }
    .addrow {
      display: flex;
      gap: 8px;
    }
    .addrow .add {
      flex: 1;
    }
    .add.detect {
      border-style: solid;
    }
    .add {
      border: 1px dashed var(--divider-color);
      background: transparent;
      color: var(--primary-color);
      border-radius: 10px;
      padding: 10px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
    }
  `,e([he({attribute:!1})],pt.prototype,"hass",void 0),e([pe()],pt.prototype,"_config",void 0),customElements.define("moran-family-board-card-editor",pt);var ut=Object.freeze({__proto__:null,FamilyBoardCardEditor:pt});export{rt as FamilyBoardCard,nt as autoDetectPersons};
