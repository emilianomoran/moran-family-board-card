function e(e,t,a,i){var n,r=arguments.length,s=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,i);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(s=(r<3?n(s):r>3?n(t,a,s):n(t,a))||s);return r>3&&s&&Object.defineProperty(t,a,s),s}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,a=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let r=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(a&&void 0===e){const a=void 0!==t&&1===t.length;a&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&n.set(t,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const a=1===e.length?e[0]:t.reduce((t,a,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[i+1],e[0]);return new r(a,e,i)},o=a?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,m=_.trustedTypes,f=m?m.emptyScript:"",g=_.reactiveElementPolyfillSupport,w=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let a=e;switch(t){case Boolean:a=null!==e;break;case Number:a=null===e?null:Number(e);break;case Object:case Array:try{a=JSON.parse(e)}catch(e){a=null}}return a}},v=(e,t)=>!l(e,t),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),i=this.getPropertyDescriptor(e,a,t);void 0!==i&&d(this.prototype,e,i)}}static getPropertyDescriptor(e,t,a){const{get:i,set:n}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const r=i?.call(this);n?.call(this,t),this.requestUpdate(e,r,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const e=this.properties,t=[...c(e),...p(e)];for(const a of t)this.createProperty(a,e[a])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,a]of t)this.elementProperties.set(e,a)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const a=this._$Eu(e,t);void 0!==a&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const e of a)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const a=t.attribute;return!1===a?void 0:"string"==typeof a?a:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(a)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const a of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=a.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){const a=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,a);if(void 0!==i&&!0===a.reflect){const n=(void 0!==a.converter?.toAttribute?a.converter:b).toAttribute(t,a.type);this._$Em=e,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){const a=this.constructor,i=a._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=a.getPropertyOptions(i),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=i;const r=n.fromAttribute(t,e.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(e,t,a,i=!1,n){if(void 0!==e){const r=this.constructor;if(!1===i&&(n=this[e]),a??=r.getPropertyOptions(e),!((a.hasChanged??v)(n,t)||a.useDefault&&a.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,a))))return;this.C(e,t,a)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:i,wrapped:n},r){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==n||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,a]of e){const{wrapped:e}=a,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,a,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[w("elementProperties")]=new Map,x[w("finalized")]=new Map,g?.({ReactiveElement:x}),(_.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,D=$.trustedTypes,T=D?D.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+M,A=`<${z}>`,C=document,P=()=>C.createComment(""),E=e=>null===e||"object"!=typeof e&&"function"!=typeof e,F=Array.isArray,O="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,R=/>/g,L=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,H=/"/g,K=/^(?:script|style|textarea|title)$/i,U=(e=>(t,...a)=>({_$litType$:e,strings:t,values:a}))(1),W=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),V=new WeakMap,q=C.createTreeWalker(C,129);function Y(e,t){if(!F(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==T?T.createHTML(t):t}const G=(e,t)=>{const a=e.length-1,i=[];let n,r=2===t?"<svg>":3===t?"<math>":"",s=N;for(let t=0;t<a;t++){const a=e[t];let o,l,d=-1,h=0;for(;h<a.length&&(s.lastIndex=h,l=s.exec(a),null!==l);)h=s.lastIndex,s===N?"!--"===l[1]?s=I:void 0!==l[1]?s=R:void 0!==l[2]?(K.test(l[2])&&(n=RegExp("</"+l[2],"g")),s=L):void 0!==l[3]&&(s=L):s===L?">"===l[0]?(s=n??N,d=-1):void 0===l[1]?d=-2:(d=s.lastIndex-l[2].length,o=l[1],s=void 0===l[3]?L:'"'===l[3]?H:B):s===H||s===B?s=L:s===I||s===R?s=N:(s=L,n=void 0);const c=s===L&&e[t+1].startsWith("/>")?" ":"";r+=s===N?a+A:d>=0?(i.push(o),a.slice(0,d)+S+a.slice(d)+M+c):a+M+(-2===d?t:c)}return[Y(e,r+(e[a]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class J{constructor({strings:e,_$litType$:t},a){let i;this.parts=[];let n=0,r=0;const s=e.length-1,o=this.parts,[l,d]=G(e,t);if(this.el=J.createElement(l,a),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=q.nextNode())&&o.length<s;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(S)){const t=d[r++],a=i.getAttribute(e).split(M),s=/([.?@])?(.*)/.exec(t);o.push({type:1,index:n,name:s[2],strings:a,ctor:"."===s[1]?te:"?"===s[1]?ae:"@"===s[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(M)&&(o.push({type:6,index:n}),i.removeAttribute(e));if(K.test(i.tagName)){const e=i.textContent.split(M),t=e.length-1;if(t>0){i.textContent=D?D.emptyScript:"";for(let a=0;a<t;a++)i.append(e[a],P()),q.nextNode(),o.push({type:2,index:++n});i.append(e[t],P())}}}else if(8===i.nodeType)if(i.data===z)o.push({type:2,index:n});else{let e=-1;for(;-1!==(e=i.data.indexOf(M,e+1));)o.push({type:7,index:n}),e+=M.length-1}n++}}static createElement(e,t){const a=C.createElement("template");return a.innerHTML=e,a}}function Z(e,t,a=e,i){if(t===W)return t;let n=void 0!==i?a._$Co?.[i]:a._$Cl;const r=E(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(e),n._$AT(e,a,i)),void 0!==i?(a._$Co??=[])[i]=n:a._$Cl=n),void 0!==n&&(t=Z(e,n._$AS(e,t.values),n,i)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:a}=this._$AD,i=(e?.creationScope??C).importNode(t,!0);q.currentNode=i;let n=q.nextNode(),r=0,s=0,o=a[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new Q(n,n.nextSibling,this,e):1===o.type?t=new o.ctor(n,o.name,o.strings,this,e):6===o.type&&(t=new ne(n,this,e)),this._$AV.push(t),o=a[++s]}r!==o?.index&&(n=q.nextNode(),r++)}return q.currentNode=C,i}p(e){let t=0;for(const a of this._$AV)void 0!==a&&(void 0!==a.strings?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,i){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),E(e)?e===j||null==e||""===e?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>F(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&E(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:a}=e,i="number"==typeof a?this._$AC(e):(void 0===a.el&&(a.el=J.createElement(Y(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new X(i,this),a=e.u(this.options);e.p(t),this.T(a),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new J(e)),t}k(e){F(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,i=0;for(const n of e)i===t.length?t.push(a=new Q(this.O(P()),this.O(P()),this,this.options)):a=t[i],a._$AI(n),i++;i<t.length&&(this._$AR(a&&a._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,i,n){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,a.length>2||""!==a[0]||""!==a[1]?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=j}_$AI(e,t=this,a,i){const n=this.strings;let r=!1;if(void 0===n)e=Z(this,e,t,0),r=!E(e)||e!==this._$AH&&e!==W,r&&(this._$AH=e);else{const i=e;let s,o;for(e=n[0],s=0;s<n.length-1;s++)o=Z(this,i[a+s],t,s),o===W&&(o=this._$AH[s]),r||=!E(o)||o!==this._$AH[s],o===j?e=j:e!==j&&(e+=(o??"")+n[s+1]),this._$AH[s]=o}r&&!i&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class ae extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class ie extends ee{constructor(e,t,a,i,n){super(e,t,a,i,n),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??j)===W)return;const a=this._$AH,i=e===j&&a!==j||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,n=e!==j&&(a===j||i);i&&this.element.removeEventListener(this.name,this,a),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(J,Q),($.litHtmlVersions??=[]).push("3.3.3");const se=globalThis;class oe extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,a)=>{const i=a?.renderBefore??t;let n=i._$litPart$;if(void 0===n){const e=a?.renderBefore??null;i._$litPart$=n=new Q(t.insertBefore(P(),e),e,void 0,a??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}oe._$litElement$=!0,oe.finalized=!0,se.litElementHydrateSupport?.({LitElement:oe});const le=se.litElementPolyfillSupport;le?.({LitElement:oe}),(se.litElementVersions??=[]).push("4.2.2");const de={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:v},he=(e=de,t,a)=>{const{kind:i,metadata:n}=a;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),r.set(a.name,e),"accessor"===i){const{name:i}=a;return{set(a){const n=t.get.call(this);t.set.call(this,a),this.requestUpdate(i,n,e,!0,a)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=a;return function(a){const n=this[i];t.call(this,a),this.requestUpdate(i,n,e,!0,a)}}throw Error("Unsupported decorator location: "+i)};function ce(e){return(t,a)=>"object"==typeof a?he(e,t,a):((e,t,a)=>{const i=t.hasOwnProperty(a);return t.constructor.createProperty(a,e),i?Object.getOwnPropertyDescriptor(t,a):void 0})(e,t,a)}function pe(e){return ce({...e,state:!0,attribute:!1})}function ue(e,t){return new Date(e.getFullYear(),e.getMonth(),e.getDate()+t)}function _e(e,t){const a=e=>Date.UTC(e.getFullYear(),e.getMonth(),e.getDate())/864e5;return a(e)-a(t)}const me=e=>Array.isArray(e)?e.map(e=>String(e).trim()).filter(Boolean):[];function fe(e){const t=e.match(/[\p{L}\p{N}]/u);return t?.index??0}function ge(e){return e.slice(fe(e))}function we(e,t){if(!function(e){return me(e.match_title_prefixes).length>0||me(e.match_title_contains).length>0||me(e.match_title_regex).length>0}(t))return!0;const a=e.toLocaleLowerCase(),i=ge(e).toLocaleLowerCase();return!!me(t.match_title_prefixes).some(e=>i.startsWith(e.toLocaleLowerCase()))||(!!me(t.match_title_contains).some(e=>a.includes(e.toLocaleLowerCase()))||me(t.match_title_regex).some(t=>{try{return new RegExp(t,"iu").test(e)}catch{return!1}}))}function be(e,t,a){const i=e=>{return(a=e.calendar,Array.isArray(a)?a.filter(Boolean):a?[a]:[]).includes(t);var a},n=a.flatMap((t,a)=>t.unmatched||!i(t)?[]:we(e,t)?[a]:[]);if(n.length>0)return n;const r=ge(e).match(/^([^:]+):/u)?.[1],s=r?.split(/\s*\+\s*/u).map(e=>e.trim());if(s&&s.length>1&&s.every(Boolean)){const e=s.map(e=>a.flatMap((t,a)=>{if(t.unmatched||!i(t))return[];return me(t.match_title_prefixes).some(t=>t.replace(/:\s*$/u,"").toLocaleLowerCase()===e.toLocaleLowerCase())?[a]:[]}));if(e.every(e=>e.length>0))return[...new Set(e.flat())]}return a.flatMap((e,t)=>e.unmatched&&i(e)?[t]:[])}function ve(e,t){if(!t.strip_title_prefix)return e;const a=fe(e),i=e.slice(0,a).trim(),n=e.slice(a),r=n.toLocaleLowerCase(),s=me(t.match_title_prefixes).find(e=>r.startsWith(e.toLocaleLowerCase()));if(!s)return e;return[i,n.slice(s.length).trimStart()].filter(Boolean).join(" ").trim()||e}function ye(e){return JSON.stringify([e.calendar,e.uid||e.sourceSummary||e.summary,e.recurrence_id||e.start.toISOString(),e.uid?"":e.end.toISOString()])}const xe=e=>null===e||"object"!=typeof e||Array.isArray(e)?void 0:e,$e=e=>"string"==typeof e?e:void 0,ke=e=>"string"==typeof e&&e.trim()?e:void 0;function De(e){if("string"!=typeof e||!/^\d{4}-\d{2}-\d{2}$/.test(e))return!1;const t=new Date(`${e}T00:00:00Z`);return Number.isFinite(t.getTime())&&t.toISOString().slice(0,10)===e}function Te(e){if("string"!=typeof e)return null;const t=e.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/);if(!t||!De(t[1])||Number(t[2])>23||Number(t[3])>59||Number(t[4]??0)>59)return null;const a=new Date(e);return Number.isFinite(a.getTime())?a:null}function Se(e,t,a,i){const n=xe(e),r=xe(n?.start);if(!n||!r)return null;if(null!=n.summary&&"string"!=typeof n.summary)return null;if([n.uid,n.recurrence_id,n.rrule].some(e=>null!=e&&"string"!=typeof e))return null;const s=xe(n.end);if(null!=n.end&&!s)return null;const o=null==r.dateTime;if(null!=r.date&&null!=r.dateTime)return null;let l,d;if(o){if(!De(r.date)||null!=s?.dateTime)return null;if(null!=s?.date&&!De(s.date))return null;l=new Date(`${r.date}T00:00:00`),d=null!=s?.date?new Date(`${s.date}T00:00:00`):ue(l,1)}else{if(null!=s?.date)return null;const e=Te(r.dateTime),t=Te(s?.dateTime??r.dateTime);if(!e||!t)return null;l=e,d=t}if(isNaN(l.getTime())||isNaN(d.getTime()))return null;if(d.getTime()<l.getTime()||o&&d.getTime()===l.getTime())return null;d.getTime()===l.getTime()&&(d=new Date(l.getTime()+6e4));const h=$e(n.summary)||"Termin";return{personIdx:t,calendar:a,uid:ke(n.uid),recurrence_id:ke(n.recurrence_id),rrule:ke(n.rrule),summary:h,sourceSummary:h,description:$e(n.description),location:$e(n.location),allDay:o,start:l,end:d,color:i,tentative:!1}}function Me(e,t,a){const i=[],n=new Date(e.start);n.setHours(0,0,0,0);const r=new Date(e.end.getTime()-1),s=Math.max(1,_e(r,n)+1);for(let r=0;r<a;r++){const a=ue(t,r),o=ue(t,r+1),l=Math.max(e.start.getTime(),a.getTime()),d=Math.min(e.end.getTime(),o.getTime());if(d<=l)continue;const h=new Date(l),c=new Date(d),p=e.allDay?0:60*h.getHours()+h.getMinutes(),u=e.allDay||d===o.getTime()?1440:60*c.getHours()+c.getMinutes(),_=s>1?_e(a,n)+1:void 0;i.push({part:_,parts:s>1?s:void 0,ref:e,personIdx:e.personIdx,day:r,startMin:p,endMin:Math.min(u,1440),title:e.summary,location:e.location,allDay:e.allDay,color:e.color,continuesBefore:e.start.getTime()<a.getTime(),continuesAfter:e.end.getTime()>o.getTime()})}return i}function ze(e){const t=[...e].sort((e,t)=>e.startMin-t.startMin||e.endMin-t.endMin),a=[];let i=[],n=-1,r=0;const s=[],o=()=>{if(i.length){const e=Math.max(...i.map(e=>e.col))+1;i.forEach(t=>{t.cols=e,t.cluster=r;let a=e;for(const e of i)e!==t&&e.col>t.col&&e.startMin<t.endMin&&e.endMin>t.startMin&&(a=Math.min(a,e.col));t.span=Math.max(1,a-t.col)}),r++}i=[]};for(const e of t){i.length&&e.startMin>=n&&(o(),s.length=0);let t=s.findIndex(t=>t<=e.startMin);-1===t?(t=s.length,s.push(e.endMin)):s[t]=e.endMin;const l={...e,col:t,cols:1,span:1,cluster:r};i.push(l),a.push(l),n=1===i.length?e.endMin:Math.max(n,e.endMin)}return o(),a}const Ae=["day","timeline","week","month","agenda"];function Ce(e){return"wall"===e?"wall":"default"}async function Pe(e,t,a,i){return Promise.all([...new Set(t.filter(Boolean))].map(async t=>{if(!a.has(t))return{entityId:t,status:"missing",events:[]};try{const a=await async function(e,t,a){const i=encodeURIComponent(a.start.toISOString()),n=encodeURIComponent(a.end.toISOString());let r;try{const a=await Promise.race([e.callApi("GET",`calendars/${t}?start=${i}&end=${n}`),new Promise((e,t)=>{r=setTimeout(()=>t(new Error("Calendar read timed out")),2e4)})]);if(!Array.isArray(a))throw new TypeError("Calendar response is not an event list.");return a}finally{clearTimeout(r)}}(e,t,i),n=a.filter(e=>null!==Se(e,0,t,"")),r=a.length-n.length;return r>0?{entityId:t,status:"partial",events:n,rejectedCount:r}:{entityId:t,status:"ok",events:n}}catch{return{entityId:t,status:"error",events:[]}}}))}const Ee=s`
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
    flex: 0 0 auto;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 32px;
    min-height: 72px;
    padding: 8px 24px;
    border-bottom: 1px solid var(--moran-wall-divider);
    background: var(--moran-wall-canvas);
  }

  .moran-wall-shell .moran-wall-brand {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    max-width: 100%;
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
    flex: 0 0 auto;
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

  /* Dates page only from this heading; the event grid retains native person panning. */
  .moran-wall-shell .dayhead {
    flex: 0 0 auto;
    touch-action: pan-y pinch-zoom;
    user-select: none;
  }

  .moran-wall-shell .dayhead .dayname {
    min-height: 48px;
    border-radius: 6px;
    cursor: ew-resize;
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
    /* A non-overlay OS scrollbar must not consume the date cells' touch height. */
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .moran-wall-shell > .tabs::-webkit-scrollbar {
    display: none;
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

  /* Each view uses the remaining panel height and owns its own scrolling. */
  .moran-wall-shell > :is(.weekwrap, .monthwrap, .agenda) {
    box-sizing: border-box;
    flex: 1 1 auto;
    min-height: 0;
    max-height: none;
    width: 100%;
    overflow: auto;
    scrollbar-width: thin;
  }

  .moran-wall-shell .weekgrid {
    width: 100%;
  }

  .moran-wall-shell .wphead {
    min-width: 0;
    padding: 12px 8px;
    font-size: 14px;
  }

  .moran-wall-shell .wphead > span {
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell .wday {
    flex-direction: column;
    justify-content: center;
    padding: 8px 4px;
    font-size: 12px;
  }

  .moran-wall-shell .wall-week-date {
    font-size: 22px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .moran-wall-shell .wcell {
    min-width: 0;
    min-height: 88px;
    padding: 6px;
    gap: 6px;
  }

  .moran-wall-shell .wchip {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 8px;
  }

  .moran-wall-shell .wchip > span {
    white-space: normal;
    overflow-wrap: anywhere;
    font-size: 14px;
    line-height: 1.4;
  }

  .moran-wall-shell .wchip small {
    margin: 0;
    font-size: 13px;
  }

  .moran-wall-shell .wall-person-filters {
    display: flex;
    flex: 0 0 auto;
    gap: 8px;
    padding: 8px 12px;
    overflow-x: auto;
    border-bottom: 1px solid var(--moran-wall-divider);
    scrollbar-width: thin;
  }

  .moran-wall-shell .wall-person-filters button {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 8px;
    padding: 6px 12px 6px 8px;
    border: 1px solid var(--moran-wall-divider);
    border-radius: 999px;
    background: var(--moran-wall-surface);
    color: var(--moran-wall-text);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .moran-wall-shell .wall-person-filters .avatar {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
  }

  .moran-wall-shell .wall-person-filters button.off {
    background: transparent;
    color: var(--moran-wall-muted);
    border-style: dashed;
  }

  .moran-wall-shell .wall-person-filters button.off > span {
    text-decoration: line-through;
  }

  .moran-wall-shell .wall-person-filters button.off .avatar {
    opacity: 0.4;
    filter: grayscale(1);
  }

  .moran-wall-shell .agenda {
    padding: 0 12px 12px;
  }

  .moran-wall-shell .agenda-date {
    padding: 12px 4px 8px;
    font-size: 16px;
  }

  .moran-wall-shell .agenda-row {
    display: grid;
    grid-template-columns: 86px 4px minmax(0, 1fr);
    align-items: start;
    gap: 4px 10px;
    padding: 12px 4px;
  }

  .moran-wall-shell .agenda-time {
    grid-column: 1;
    grid-row: 1 / 3;
    font-size: 14px;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell .agenda-bar {
    grid-column: 2;
    grid-row: 1 / 3;
  }

  .moran-wall-shell .agenda-main {
    grid-column: 3;
  }

  .moran-wall-shell .agenda-title,
  .moran-wall-shell .agenda-meta {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell .agenda-title {
    font-size: 16px;
    line-height: 1.4;
  }

  .moran-wall-shell .agenda-meta,
  .moran-wall-shell .agenda-cd {
    font-size: 13px;
    line-height: 1.5;
  }

  .moran-wall-shell .agenda-cd {
    grid-column: 3;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .moran-wall-shell .monthgrid,
  .moran-wall-shell .monthhead {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .moran-wall-shell .mhcell {
    font-size: 13px;
  }

  .moran-wall-shell .mdate {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .moran-wall-shell .mchip {
    padding: 6px;
    font-size: 13px;
  }

  .moran-wall-shell .wall-month-summary {
    display: none;
  }

  @container (max-width: 600px) {
    .moran-wall-shell .monthwrap.compact-month {
      padding: 0 4px 8px;
    }

    .moran-wall-shell .compact-month .monthgrid {
      grid-auto-rows: minmax(88px, auto);
    }

    .moran-wall-shell .compact-month .monthgrid .mcell {
      min-width: 0;
      min-height: 88px;
      padding: 4px 1px;
    }

    .moran-wall-shell .compact-month .mdate {
      margin-inline: auto;
    }

    .moran-wall-shell .compact-month .mchips {
      display: none;
    }

    .moran-wall-shell .compact-month .wall-month-summary {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      margin-top: 3px;
    }

    .moran-wall-shell .wall-month-dots {
      display: flex;
      gap: 3px;
      height: 5px;
    }

    .moran-wall-shell .wall-month-dots i {
      width: 5px;
      height: 5px;
      border-radius: 50%;
    }

    .moran-wall-shell .wall-month-count {
      color: var(--moran-wall-muted);
      font-size: 11px;
      line-height: 1.2;
      text-align: center;
      overflow-wrap: anywhere;
    }
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
`;function Fe(e,t,a){if(!(e.remember_preferences??"wall"===Ce(e.layout))||!a)return;const i=JSON.stringify({path:t,userId:a,card:e.preferences_key??e.title??"",layout:Ce(e.layout),view:e.view??"day",views:Ae.filter(t=>!e.views?.length||e.views.includes(t)),persons:e.persons.map(e=>({name:e.name,person:e.person,calendar:e.calendar,prefixes:e.match_title_prefixes,contains:e.match_title_contains,regex:e.match_title_regex,unmatched:e.unmatched,hidden:!0===e.hidden}))});return`moran-family-board:preferences:v1:${function(e){let t=0xcbf29ce484222325n;for(const a of e)t^=BigInt(a.codePointAt(0)),t=BigInt.asUintN(64,0x100000001b3n*t);return t.toString(16).padStart(16,"0")}(i)}`}function Oe(e,t,a=!0){let i=ue(e,t);for(;!a&&(0===i.getDay()||6===i.getDay());)i=ue(i,t);return i}const Ne={board_title:"Family board",wall_board_title:"Family Board",wall_calendar_identity:"Calendar",day:"Day",week:"Week",month:"Month",agenda:"Agenda",timeline:"Timeline",all_day:"all-day",this_week:"This week",prev_week:"Previous week",next_week:"Next week",prev_day:"Previous day",next_day:"Next day",day_navigation_hint:"Swipe left or right, or use the arrow keys, to change the date.",prev_month:"Previous month",next_month:"Next month",today:"Today",show_today:"Show today",tomorrow:"Tomorrow",yesterday:"Yesterday",open_map:"Map",status_home:"home",status_away:"away",add_event:"Add event",new_event:"New event",event:"Event",edit_event:"Edit event",close:"Close",field_title:"Title",field_all_day:"All-day",field_start:"Start",field_end:"End",field_location:"Location",field_note:"Note",field_calendar:"Calendar",recurring:"Recurring event",recur_this:"This event only",recur_future:"This and following",read_only:"This calendar is read-only.",details_refreshing:"Checking for updates. Showing previously loaded details…",details_updated:"These details have been updated from the calendar.",details_unavailable:"Could not verify this event. These previously loaded details may be out of date.",details_missing:"This event was not found in the refreshed calendar range. It may have changed, moved, or been removed. These are previously loaded details.",delete:"Delete",cancel:"Cancel",save:"Save",err_invalid:"Please enter valid times.",err_end_before:"End is before start.",err_end_equal:"End must be after start.",save_failed:"Saving failed.",delete_failed:"Deleting failed.",default_title:"Event",load_error:"Calendar could not be loaded.",loading_calendars:"Loading calendars…",refreshing_calendars:"Refreshing calendars…",retry:"Retry",partial_load:"Some calendars could not be loaded. Showing available events.",incomplete_events:"Some calendars or events could not be read. The schedule may be incomplete.",no_events:"No events.",more_events:"more events",events:"events",event_count_one:"event",visible_people:"Visible people",focus_next:"next",focus_until:"until",focus_free:"free",focus_unavailable:"schedule unavailable",status_free_now:"Free now",status_busy_now:"Busy now",status_now:"Now",status_next:"Next"},Ie={en:Ne,de:{board_title:"Familienplan",wall_board_title:"Familienplan",wall_calendar_identity:"Kalender",day:"Tag",week:"Woche",month:"Monat",agenda:"Agenda",timeline:"Zeitstrahl",all_day:"ganztägig",this_week:"Diese Woche",prev_week:"Vorherige Woche",next_week:"Nächste Woche",prev_day:"Vorheriger Tag",next_day:"Nächster Tag",day_navigation_hint:"Nach links oder rechts wischen oder die Pfeiltasten verwenden, um das Datum zu ändern.",prev_month:"Vorheriger Monat",next_month:"Nächster Monat",today:"Heute",show_today:"Heute anzeigen",tomorrow:"Morgen",yesterday:"Gestern",open_map:"Karte",status_home:"zuhause",status_away:"unterwegs",add_event:"Termin hinzufügen",new_event:"Neuer Termin",event:"Termin",edit_event:"Termin bearbeiten",close:"Schließen",field_title:"Titel",field_all_day:"Ganztägig",field_start:"Start",field_end:"Ende",field_location:"Ort",field_note:"Notiz",field_calendar:"Kalender",recurring:"Wiederkehrender Termin",recur_this:"Nur dieser Termin",recur_future:"Dieser und folgende",read_only:"Dieser Kalender ist schreibgeschützt.",details_refreshing:"Aktualisierung wird geprüft. Zuletzt geladene Details werden angezeigt…",details_updated:"Diese Details wurden aus dem Kalender aktualisiert.",details_unavailable:"Dieser Termin konnte nicht geprüft werden. Die zuletzt geladenen Details sind möglicherweise veraltet.",details_missing:"Dieser Termin wurde im aktualisierten Kalenderzeitraum nicht gefunden. Er wurde möglicherweise geändert, verschoben oder entfernt. Angezeigt werden die zuletzt geladenen Details.",delete:"Löschen",cancel:"Abbrechen",save:"Speichern",err_invalid:"Bitte gültige Zeiten angeben.",err_end_before:"Ende liegt vor dem Start.",err_end_equal:"Ende muss nach dem Start liegen.",save_failed:"Speichern fehlgeschlagen.",delete_failed:"Löschen fehlgeschlagen.",default_title:"Termin",load_error:"Kalender konnte nicht geladen werden.",loading_calendars:"Kalender werden geladen…",refreshing_calendars:"Kalender werden aktualisiert…",retry:"Erneut versuchen",partial_load:"Einige Kalender konnten nicht geladen werden. Verfügbare Termine werden angezeigt.",incomplete_events:"Einige Kalender oder Termine konnten nicht gelesen werden. Der Plan ist möglicherweise unvollständig.",no_events:"Keine Termine.",more_events:"weitere Termine",events:"Termine",event_count_one:"Termin",visible_people:"Sichtbare Personen",focus_next:"als Nächstes",focus_until:"bis",focus_free:"frei",focus_unavailable:"Plan nicht verfügbar",status_free_now:"Jetzt frei",status_busy_now:"Jetzt beschäftigt",status_now:"Jetzt",status_next:"Als Nächstes"}};function Re(e){return(e?.locale?.language||navigator?.language||"en").toLowerCase().split("-")[0]}function Le(e,t){const a=Re(e);return Ie[a]?.[t]??Ne[t]??t}function Be(e){return e?.locale?.language||navigator?.language||"en"}function He(e){const t=e?.locale?.time_format;if("12"===t)return!0;if("24"===t)return!1;const a=new Intl.DateTimeFormat(Be(e),{hour:"numeric"}).format(new Date(2020,0,1,13));return/\s?[AaPp]\.?[Mm]\.?/.test(a)||/1\s?PM/i.test(a)}function Ke(e,t){return new Intl.DateTimeFormat(Be(e),{hour:He(e)?"numeric":"2-digit",minute:"2-digit",hour12:He(e)}).format(t)}function Ue(e,t){const a=new Date(2020,0,1,0,0,0,0);return a.setMinutes(t),Ke(e,a)}function We(e,t){const a=new Date(2020,0,1,t,0,0,0);return new Intl.DateTimeFormat(Be(e),He(e)?{hour:"numeric",hourCycle:"h12"}:{hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(a)}function je(e,t){return new Intl.DateTimeFormat(Be(e),{month:"short",day:"numeric"}).format(t)}function Ve(e,t,a=new Date){const i=_e(t,a),n=0===i||1===i?Le(e,0===i?"today":"tomorrow"):new Intl.DateTimeFormat(Be(e),{weekday:"short",month:"short",day:"numeric",...t.getFullYear()!==a.getFullYear()?{year:"numeric"}:{}}).format(t),r=He(e);return`${n}, ${new Intl.DateTimeFormat(Be(e),{hour:r?"numeric":"2-digit",...r&&0===t.getMinutes()?{}:{minute:"2-digit"},hourCycle:r?"h12":"h23"}).format(t)}`}function qe(e,t,a=1){const i=new Intl.DateTimeFormat(Be(e),{weekday:t}),n=Array.from({length:7},(e,t)=>{const a=i.format(new Date(2024,0,7+t));return a.charAt(0).toUpperCase()+a.slice(1)});return Array.from({length:7},(e,t)=>n[(a+t)%7])}function Ye(e,t,a=new Date){const i=t.getTime()-a.getTime();if(i<=0)return"";const n=new Intl.RelativeTimeFormat(Be(e),{numeric:"always",style:"short"}),r=Math.round(i/6e4);if(r<60)return n.format(Math.max(1,r),"minute");const s=Math.round(r/60);return s<24?n.format(s,"hour"):n.format(Math.round(s/24),"day")}const Ge=["#8B7CF6","#34D399","#FBBF24","#FB7185","#22D3EE","#C084FC","#A3E635","#FB923C","#F472B6","#60A5FA"],Je={"clear-night":"weather-night",cloudy:"weather-cloudy",fog:"weather-fog",hail:"weather-hail",lightning:"weather-lightning","lightning-rainy":"weather-lightning-rainy",partlycloudy:"weather-partly-cloudy",pouring:"weather-pouring",rainy:"weather-rainy",snowy:"weather-snowy","snowy-rainy":"weather-snowy-rainy",sunny:"weather-sunny",windy:"weather-windy","windy-variant":"weather-windy-variant",exceptional:"weather-cloudy-alert"},Ze=[[/zahnarzt|dentist|kieferortho/i,"🦷"],[/arzt|doctor|doktor|klinik|hospital|therapie|physio|impf/i,"🩺"],[/geburtstag|geb\.|birthday|jubiläum|jubilaeum|anniversary/i,"🎂"],[/schwimm|swim|hallenbad|baden/i,"🏊"],[/fußball|fussball|soccer|football|training/i,"⚽"],[/sport|gym|fitness|turnen|joggen|laufen|workout/i,"🏃"],[/reit|pferd|pony|horse/i,"🐴"],[/tanz|ballett|dance/i,"🩰"],[/klavier|gitarre|musik|music|chor|singen|band|orchester|instrument/i,"🎵"],[/schule|unterricht|klasse|klassenverbund|school|nachhilfe|lernen|prüfung|pruefung|klausur/i,"🎒"],[/kita|kindergarten|krippe|hort/i,"🧸"],[/frühstück|fruehstueck|breakfast/i,"🥐"],[/mittag|lunch|abendessen|dinner|essen|kochen|restaurant|brunch/i,"🍽️"],[/kaffee|coffee|café|cafe/i,"☕"],[/urlaub|ferien|vacation|holiday|reise|trip|strand|beach/i,"🏖️"],[/flug|flight|airport|flughafen/i,"✈️"],[/zug|bahn|train|abfahrt|ankunft/i,"🚆"],[/kino|film|movie|cinema/i,"🎬"],[/party|feier|fest|celebration/i,"🎉"],[/einkauf|shopping|supermarkt|einkaufen|besorgung/i,"🛒"],[/putz|reinig|cleaning|wäsche|waesche|müll|muell|garbage|trash/i,"🧹"],[/schlaf|nap|ruhezeit|mittagsschlaf/i,"😴"],[/spiel|freispiel|play|angebotszeit/i,"🧸"],[/meeting|besprechung|termin|call|konferenz|conference|office|büro|buero|arbeit|work/i,"💼"],[/friseur|haircut|hairdresser|frisör|frisoer/i,"💇"],[/kirche|church|gottesdienst|messe|religion/i,"⛪"],[/pause|hofpause|break/i,"⏸️"]],Xe=/\p{Extended_Pictographic}/u,Qe=e=>String(e).padStart(2,"0"),et=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,16),tt=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,10),at=e=>{const t=new Date(e);return t.setHours(0,0,0,0),t},it=(e,t)=>e.color||Ge[t%Ge.length],nt=e=>{let t=0;for(let a=0;a<e.length;a++)t=31*t+e.charCodeAt(a)>>>0;return Ge[t%Ge.length]};function rt(e){const t=e?.states??{},a=Object.keys(t).filter(e=>e.startsWith("calendar.")),i=e=>e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,""),n=[];for(const e of Object.keys(t)){if(!e.startsWith("person."))continue;const r=e.slice(7),s=t[e].attributes?.friendly_name??r,o=i(r),l=i(s),d=a.filter(e=>{const a=i(e.slice(9)),n=i(t[e].attributes?.friendly_name??"");return a===o||a.includes(o)||l.length>2&&(a.includes(l)||n.includes(l))});if(n.push({name:s,person:e,calendar:1===d.length?d[0]:d.length?d:""}),n.length>=10)break}return n}class st extends oe{constructor(){super(...arguments),this.nowProvider=()=>new Date,this._layout="default",this._events=[],this._view="day",this._day=((new Date).getDay()+6)%7,this._weekOffset=0,this._monthOffset=0,this._loadError=!1,this._partialLoad=!1,this._loading=!1,this._fitPx=0,this._hiddenP=[],this._dragStartY=0,this._dragPx=1,this._dragGrid=30,this._suppressClick=!1,this._raw=[],this._calendarResults=[],this._fetchedKey="",this._dataKey="",this._fetchGeneration=0,this._browserOnline=!1!==navigator.onLine,this._forecast={},this._weatherKey="",this._scrolledKey="",this._scrollToNowRequested=!1,this._lastInteract=Date.now(),this._onInteract=()=>{this._lastInteract=Date.now()},this._onVisible=()=>{if(this.isConnected)return"hidden"===document.visibilityState?(this._fetchGeneration+=1,this._pendingFetch=void 0,void(this._fetchedKey="")):void(this.hass&&this._config&&(this._syncCalendarDate(),this._refetch()))},this._onOnline=()=>{this._browserOnline=!0,this._refetch()},this._onOffline=()=>{this._browserOnline=!1,this._maybeFetch()},this._pollCalendars=()=>"hidden"===document.visibilityState?Promise.resolve():this._refetch(),this._onKeyDown=e=>{if("Escape"===e.key&&this._dialog&&(e.stopPropagation(),this._closeDialog()),"Tab"===e.key&&this._dialog){const t=this.renderRoot.querySelector(".dialog");if(!t)return;const a=[...t.querySelectorAll("button, input, textarea, select, a[href], [tabindex]")].filter(e=>e.tabIndex>=0&&!e.matches(":disabled")&&e.getClientRects().length),i=this.renderRoot.activeElement,n=a[0]??t,r=a[a.length-1]??t;t.contains(i)&&i!==t&&(e.shiftKey?i!==n:i!==r)||(e.preventDefault(),(e.shiftKey?r:n).focus({preventScroll:!0}))}},this._prevWeek=()=>{this._weekOffset-=1},this._nextWeek=()=>{this._weekOffset+=1},this._thisWeek=()=>{this._cancelDayScroll(),this._weekOffset=0,this._day=this._todayIndex(),"wall"===this._layout&&"day"===this._view&&(this._scrollToNowRequested=!0,this.requestUpdate())},this._prevMonth=()=>{this._monthOffset-=1},this._nextMonth=()=>{this._monthOffset+=1},this._thisMonth=()=>{this._monthOffset=0,"wall"===this._layout&&(this._weekOffset=0,this._day=this._todayIndex())},this._cancelDayScroll=()=>{this._dayScrollAnchor=void 0,void 0!==this._dayScrollFrame&&cancelAnimationFrame(this._dayScrollFrame),this._dayScrollFrame=void 0},this._onDaySwipeStart=e=>{e.isPrimary?"wall"===this._layout&&0===e.button&&(e.target.closest("button")||(this._daySwipe={pointerId:e.pointerId,x:e.clientX,y:e.clientY,date:this._dateForDay(this._shownDay()).getTime()},e.currentTarget.setPointerCapture(e.pointerId))):this._daySwipe=void 0},this._onDaySwipeEnd=e=>{const t=this._daySwipe;if(this._daySwipe=void 0,!t||e.pointerId!==t.pointerId)return;if(t.date!==this._dateForDay(this._shownDay()).getTime())return;const a=(i=e.clientX-t.x,n=e.clientY-t.y,Number.isFinite(i)&&Number.isFinite(n)?Math.abs(i)<48||Math.abs(i)<=1.5*Math.abs(n)?0:i<0?1:-1:0);var i,n;a&&this._stepDay(a)},this._onDaySwipeCancel=()=>{this._daySwipe=void 0},this._onDayHeadingKey=e=>{"wall"!==this._layout||e.altKey||e.ctrlKey||e.metaKey||"ArrowLeft"!==e.key&&"ArrowRight"!==e.key||(e.preventDefault(),e.stopPropagation(),this._stepDay("ArrowLeft"===e.key?-1:1))},this._onWallBoardPointerDown=e=>{if(this._cancelDayScroll(),"wall"!==this._layout||"mouse"!==e.pointerType||0!==e.button)return;const t=e.currentTarget;t.scrollWidth<=t.clientWidth+1||(this._wallPan={board:t,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startScrollLeft:t.scrollLeft,moved:!1})},this._onWallBoardPointerMove=e=>{const t=this._wallPan;if(!t||e.pointerId!==t.pointerId)return;const a=e.clientX-t.startX;if(!t.moved){if(Math.abs(a)<8||Math.abs(a)<=Math.abs(e.clientY-t.startY))return;t.moved=!0,t.board.setPointerCapture(e.pointerId),t.board.classList.add("panning")}e.preventDefault(),t.board.scrollLeft=t.startScrollLeft-a},this._onWallBoardPointerUp=e=>{const t=this._wallPan;if(!t||e.pointerId!==t.pointerId)return;if(this._wallPan=void 0,t.board.classList.remove("panning"),!t.moved)return;e.preventDefault();const a=e=>{e.preventDefault(),e.stopImmediatePropagation()};t.board.addEventListener("click",a,{capture:!0,once:!0}),window.setTimeout(()=>t.board.removeEventListener("click",a,!0),0)},this._onWallBoardPointerCancel=e=>{const t=this._wallPan;t&&e.pointerId===t.pointerId&&(this._wallPan=void 0,t.board.classList.remove("panning"))},this._onDragMove=e=>{if(!this._drag)return;e.preventDefault();const t=e.clientY-this._dragStartY,a=this._drag.moved||Math.abs(t)>4;this._drag={...this._drag,deltaMin:t/this._dragPx,moved:a}},this._onDragUp=()=>{window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp);const e=this._drag;e&&(e.moved?(this._suppressClick=!0,this._commitDrag(e)):this._drag=void 0)}}_now(){return new Date(this.nowProvider().getTime())}static async getConfigElement(){return await Promise.resolve().then(function(){return _t}),document.createElement("moran-family-board-card-editor")}static getStubConfig(e){const t=e?rt(e):[];return{type:"custom:moran-family-board-card",view:"day",time_grid:30,start_hour:6,end_hour:22,show_weekends:!0,show_now_line:!0,color_by:"person",persons:t.length?t:[{name:"Person 1",person:"",calendar:""},{name:"Person 2",person:"",calendar:""}]}}setConfig(e){if(!e.persons||!Array.isArray(e.persons))throw new Error("Bitte mindestens eine Person unter 'persons' konfigurieren.");this._config=e,this._daySwipe=void 0,this._cancelDayScroll(),e.read_only&&(this._dialog=void 0,this._drag=void 0,window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp)),this._fetchedKey="",this._fetchGeneration+=1,this._pendingFetch=void 0,this._dataKey="",this._loadedRange=void 0,this._raw=[],this._events=[],this._calendarResults=[],this._loadError=!1,this._partialLoad=!1,this._layout=Ce(e.layout);const t=this._enabledViews,a=e.view??"day";this._view=t.includes(a)?a:t[0],this._day=this._todayIndex(),this._hiddenP=e.persons.map((e,t)=>e.hidden?t:-1).filter(e=>e>=0),this._preferencesKey=void 0,this._scrolledKey="",this._scrollToNowRequested=!1,void 0!==this._scrollToNowFrame&&cancelAnimationFrame(this._scrollToNowFrame),this._scrollToNowFrame=void 0,this._restorePreferences();const i=Number(e.col_min_width);Number.isFinite(i)&&i>=60?this.style.setProperty("--fb-col-min",`${Math.min(i,400)}px`):this.style.removeProperty("--fb-col-min"),this.toggleAttribute("compact",!0===e.compact);const n=Number(e.event_size);Number.isFinite(n)&&n>=8&&n<=20?(this.style.setProperty("--fb-event-size",`${n}px`),this.style.setProperty("--fb-chip-size",`${Math.max(n-1,8)}px`)):(this.style.removeProperty("--fb-event-size"),this.style.removeProperty("--fb-chip-size"));const r=Number(e.radius);Number.isFinite(r)&&r>=0&&r<=20?(this.style.setProperty("--fb-radius",`${r}px`),this.style.setProperty("--fb-radius-sm",`${Math.max(r-2,2)}px`)):(this.style.removeProperty("--fb-radius"),this.style.removeProperty("--fb-radius-sm"));const s=Number(e.past_opacity);Number.isFinite(s)&&s>=10&&s<=100?this.style.setProperty("--fb-past-opacity",""+s/100):this.style.removeProperty("--fb-past-opacity"),this.isConnected&&this._startTimer()}get _enabledViews(){const e=this._config?.views,t=Array.isArray(e)?Ae.filter(t=>e.includes(t)):[];return t.length?t:[...Ae]}_restorePreferences(){if(!this._config)return;const e=Fe(this._config,window.location.pathname,this.hass?.user?.id);if(e===this._preferencesKey)return;this._preferencesKey=e;const t=this._config.view??"day";if(this._view=this._enabledViews.includes(t)?t:this._enabledViews[0],this._hiddenP=this._persons.flatMap((e,t)=>e.hidden?[t]:[]),this._scrolledKey="",e)try{const t=function(e,t,a,i){try{const n=e.getItem(t);if(!n||n.length>2048)return;const r=JSON.parse(n);if(1!==r?.version||!a.includes(r.view)||!Array.isArray(r.hidden)||r.hidden.length>i||!r.hidden.every(e=>Number.isInteger(e)&&Number(e)>=0&&Number(e)<i))return;return{version:1,view:r.view,hidden:[...new Set(r.hidden)]}}catch{return}}(window.localStorage,e,this._enabledViews,this._persons.length);t&&(this._view=t.view,this._hiddenP=t.hidden)}catch{}}_savePreferences(){if(this._preferencesKey)try{!function(e,t,a,i){try{e.setItem(t,JSON.stringify({version:1,view:a,hidden:i}))}catch{}}(window.localStorage,this._preferencesKey,this._view,this._hiddenP)}catch{}}_selectView(e,t=!1){if(this._enabledViews.includes(e)){if(this._view!==e&&(this._cancelDayScroll(),this._daySwipe=void 0,"wall"===this._layout)){const a=this._dateForDay(this._shownDay());if("month"===e){const e=this._now();this._monthOffset=12*(a.getFullYear()-e.getFullYear())+a.getMonth()-e.getMonth()}else if("month"===this._view&&!t){const{year:e,month:t}=this._monthGrid();this._setSelectedDate(function(e,t,a,i=!0){const n=new Date(t,a+1,0).getDate(),r=new Date(t,a,Math.min(e.getDate(),n));if(i||0!==r.getDay()&&6!==r.getDay())return r;const s=Oe(r,-1,!1);return s.getMonth()===r.getMonth()?s:Oe(r,1,!1)}(a,e,t,!1!==this._config.show_weekends))}}this._view!==e&&(this._scrolledKey=""),this._view=e,this._savePreferences()}}get _firstDayJs(){return"sunday"===this._config?.first_day?0:1}_todayIndex(){return(this._now().getDay()-this._firstDayJs+7)%7}getCardSize(){return 12}connectedCallback(){super.connectedCallback(),this._browserOnline=!1!==navigator.onLine,this._syncCalendarDate(),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("visibilitychange",this._onVisible),window.addEventListener("focus",this._onVisible),window.addEventListener("pageshow",this._onVisible),window.addEventListener("online",this._onOnline),window.addEventListener("offline",this._onOffline),this._startTimer(),this.addEventListener("pointerdown",this._onInteract),this._tick=window.setInterval(()=>this._onClockTick(),6e4),this.hass&&this._config&&this._maybeFetch(),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>requestAnimationFrame(()=>this._measureFit())),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this._cancelDayScroll(),this._daySwipe=void 0,void 0!==this._scrollToNowFrame&&cancelAnimationFrame(this._scrollToNowFrame),this._scrollToNowFrame=void 0,this._fetchGeneration+=1,this._fetchedKey="",this._pendingFetch=void 0,document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("visibilitychange",this._onVisible),window.removeEventListener("focus",this._onVisible),window.removeEventListener("pageshow",this._onVisible),window.removeEventListener("online",this._onOnline),window.removeEventListener("offline",this._onOffline),this.removeEventListener("pointerdown",this._onInteract),this._stopTimer(),this._tick&&(clearInterval(this._tick),this._tick=void 0),this._ro?.disconnect(),this._ro=void 0,window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp)}get _progressOn(){return!1!==this._config?.show_progress}_isCurrent(e){const t=this._now().getTime();return e.ref.start.getTime()<=t&&t<e.ref.end.getTime()}_progressPct(e){const t=e.ref.start.getTime(),a=e.ref.end.getTime();return a<=t?0:Math.min(100,Math.max(0,(this._now().getTime()-t)/(a-t)*100))}_syncCalendarDate(){const e=at(this._now()),t=this._lastCalendarDate;if(this._lastCalendarDate=e,!t||t.getTime()===e.getTime())return;const a=(t.getDay()-this._firstDayJs+7)%7,i=0===this._weekOffset&&this._day===a,n=this._todayIndex(),r=_e(ue(e,-n),ue(t,-a))/7;i?this._day=n:this._weekOffset-=r,0!==this._monthOffset&&(this._monthOffset-=12*(e.getFullYear()-t.getFullYear())+e.getMonth()-t.getMonth())}_onClockTick(){this._syncCalendarDate(),this._kioskReturn(),this.hass&&this._config&&this._maybeFetch(),this.requestUpdate()}_kioskReturn(){const e=Number(this._config?.auto_return??0);if(!Number.isFinite(e)||e<=0)return;if(Date.now()-this._lastInteract<6e4*e)return;if(this._dialog)return;const t=this._config.view??"day",a=this._enabledViews.includes(t)?t:this._enabledViews[0];this._view!==a&&(this._view=a),0!==this._weekOffset&&(this._weekOffset=0),0!==this._monthOffset&&(this._monthOffset=0),this._hiddenP.length&&(this._hiddenP=[]),this._day=this._todayIndex()}_startTimer(){this._stopTimer();const e=this._config?.refresh_interval??300;e>0&&(this._timer=window.setInterval(this._pollCalendars,1e3*e))}_stopTimer(){this._timer&&(clearInterval(this._timer),this._timer=void 0)}updated(e){(e.has("hass")||e.has("_config"))&&this._restorePreferences(),(e.has("hass")||e.has("_browserOnline")||e.has("_config")||e.has("_view")||e.has("_weekOffset")||e.has("_monthOffset"))&&this.hass&&this._config&&(this._maybeFetch(),(e.has("hass")||e.has("_config"))&&this._maybeFetchWeather()),e.has("_dialog")&&this._manageDialogFocus(e.get("_dialog")),this._measureFit(),this._restoreDayScroll(),this._maybeScrollToNow(),"wall"!==this._layout||"day"!==this._view&&"timeline"!==this._view||!(e.has("_day")||e.has("_weekOffset")||e.has("_view")||e.has("_config"))||this._keepSelectedDayTabVisible()}_keepSelectedDayTabVisible(){const e=this.renderRoot?.querySelector(".moran-wall-shell > .tabs"),t=e?.querySelector("[role='tab'][aria-selected='true']");if(!e||!t)return;const a=e.getBoundingClientRect(),i=t.getBoundingClientRect();i.left<a.left+8?e.scrollLeft-=a.left+8-i.left:i.right>a.right-8&&(e.scrollLeft+=i.right-(a.right-8))}_measureFit(){if(this._applyFullHeight(),!this._config?.fit_height||"day"!==this._view)return void(0!==this._fitPx&&(this._fitPx=0));const e=this.renderRoot?.querySelector(".board");if(!e)return;const t=e.querySelector(".header-row"),a=e.querySelector(".allday-row"),i=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],n=this._dayWindow(i),r=n.endMin-n.startMin;if(r<=0)return;const s=(t?.offsetHeight??0)+(a?.offsetHeight??0),o=e.clientHeight-s-2;if(o<=0)return;const l=Math.min(96,Math.max(40,this._config.hour_height??64))/60,d=Math.max(40/60,Math.min(l,o/r));Math.abs(d-this._fitPx)>.02&&(this._fitPx=d)}_applyFullHeight(){const e=this.renderRoot?.querySelector(".board");if(!e)return;if(!this._config?.full_height)return void(e.style.height&&(e.style.height="",e.style.maxHeight=""));const t=e.getBoundingClientRect().top+window.scrollY,a=`${Math.max(200,Math.round(window.innerHeight-t-16))}px`;e.style.height!==a&&(e.style.height=a,e.style.maxHeight=a)}_maybeScrollToNow(){if(this._dayScrollAnchor)return;const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0];if("day"!==this._view||!this._isRealToday(e))return void(this._scrollToNowRequested=!1);if(this._loading)return;if(!this._scrollToNowRequested&&!1===this._config?.scroll_to_now)return;const t=`${this._now().toDateString()}|${e}|${this._pxPerMin}`;if(!this._scrollToNowRequested&&t===this._scrolledKey)return;const a=this.renderRoot?.querySelector(".board"),i=a?.querySelector(".body");if(!a||!i||!a.clientHeight)return;this._scrollToNowRequested=!1;const n=this._config;void 0!==this._scrollToNowFrame&&cancelAnimationFrame(this._scrollToNowFrame),this._scrollToNowFrame=requestAnimationFrame(()=>{if(this._scrollToNowFrame=void 0,!this.isConnected||"day"!==this._view||this._config!==n||(this._visibleDays.includes(this._day)?this._day:this._visibleDays[0])!==e||!this._isRealToday(e)||a!==this.renderRoot.querySelector(".board"))return;this._scrolledKey=t;const{startMin:r,endMin:s}=this._dayWindow(e),o=this._now(),l=Math.max(r,Math.min(s,60*o.getHours()+o.getMinutes())),d=[...a.querySelectorAll(".header-row, .allday-row")].reduce((e,t)=>e+t.offsetHeight,0),h=i.getBoundingClientRect().top-a.getBoundingClientRect().top+a.scrollTop+(l-r)*this._pxPerMin-d-(a.clientHeight-d)/3;a.scrollTo({top:Math.max(0,Math.min(a.scrollHeight-a.clientHeight,h)),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})})}_manageDialogFocus(e){const t=this.renderRoot.activeElement,a=this.renderRoot.querySelector(".moran-wall-shell, ha-card");if(a?.toggleAttribute("inert",!!this._dialog),this._dialog&&!e)this._restoreFocus=t??void 0,requestAnimationFrame(()=>{if(!this._dialog||!this.isConnected)return;const e=this.renderRoot.querySelector(".dialog input:not(:disabled)")??this.renderRoot.querySelector(".dialog .icon");e?.focus({preventScroll:!0})});else if(!this._dialog&&e){const e=this._restoreFocus?.isConnected?this._restoreFocus:this.renderRoot.querySelector(".dayname[tabindex]")??this.renderRoot.querySelector('.switch [aria-selected="true"], .nav-now');e?.focus({preventScroll:!0}),this._restoreFocus=void 0}}_weekBounds(){const e=this._now(),t=new Date(e);t.setHours(0,0,0,0),t.setDate(e.getDate()-(e.getDay()-this._firstDayJs+7)%7+7*this._weekOffset);const a=new Date(t);return a.setDate(t.getDate()+7),{monday:t,nextMonday:a}}_monthGrid(){const e=this._now(),t=new Date(e.getFullYear(),e.getMonth()+this._monthOffset,1),a=(t.getDay()-this._firstDayJs+7)%7,i=at(new Date(t.getFullYear(),t.getMonth(),1-a)),n=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();return{gridStart:i,weeks:Math.ceil((a+n)/7),month:t.getMonth(),year:t.getFullYear()}}_fetchRange(){if("month"===this._view){const{gridStart:e,weeks:t}=this._monthGrid();return{start:e,end:ue(e,7*t)}}const{monday:e,nextMonday:t}=this._weekBounds();return{start:e,end:t}}_availableCalendars(e){return this._browserOnline&&!1!==this.hass.connected?new Set(e.filter(e=>{const t=this.hass.states[e];return t&&"unavailable"!==t.state&&"unknown"!==t.state})):new Set}async _maybeFetch(e=!1){if(!this.isConnected||!this.hass||!this._config)return;if("hidden"===document.visibilityState)return;const t=[...new Set(this._config.persons.flatMap(e=>this._calsOf(e)))].sort(),a=t.join(","),i=this._availableCalendars(t),n=t.map(e=>i.has(e)?"1":"0").join(""),r=this._config.persons.map(e=>[this._calsOf(e).sort().join("~"),e.color??"",e.match_title_prefixes?.join("~")??"",e.match_title_contains?.join("~")??"",e.match_title_regex?.join("~")??"",e.unmatched?"u":"",e.strip_title_prefix?"s":""].join(":")).join(","),{start:s,end:o}=this._fetchRange(),l=`${s.toISOString()}|${o.toISOString()}|${a}|${n}|${r}`;if(this._pendingFetch?.key===l)return this._pendingFetch.promise;if(!e&&l===this._fetchedKey)return;this._fetchedKey=l;const d={key:l,promise:this._fetchEvents()};this._pendingFetch=d;try{await d.promise}finally{this._pendingFetch===d&&(this._pendingFetch=void 0)}}async _refetch(){await this._maybeFetch(!0)}async _refreshAfterMutation(){this._pendingFetch=void 0,await this._refetch()}async _maybeFetchWeather(){const e=this._config.weather_entity;if(!e||!1===this._config.show_weather||!this.hass.states[e])return Object.keys(this._forecast).length&&(this._forecast={}),void(this._weatherKey="");const t=`${e}|${(new Date).toISOString().slice(0,10)}`;if(t!==this._weatherKey){this._weatherKey=t;try{const t=await this.hass.callWS({type:"call_service",domain:"weather",service:"get_forecasts",service_data:{type:"daily"},target:{entity_id:e},return_response:!0}),a=t?.response?.[e]?.forecast??[],i={};for(const e of a)e?.datetime&&(i[tt(new Date(e.datetime))]={temp:Math.round(e.temperature),condition:e.condition});this._forecast=i}catch(e){this._forecast={}}}}_weatherChip(e){const t=this._forecast[tt(e)];if(!t)return j;const a=Je[t.condition]||"weather-cloudy",i=this.hass.config?.unit_system?.temperature??"°";return U`<span class="wx" title=${t.condition}>
      <ha-icon icon="mdi:${a}"></ha-icon>${t.temp}${i}
    </span>`}_hidden(e){const t=this._config.hide_patterns;if(!Array.isArray(t)||0===t.length)return!1;const a=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&a.includes(t)})}_allowed(e){const t=this._config.show_patterns;if(!Array.isArray(t)||0===t.length)return!0;const a=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&a.includes(t)})}_cleanTitle(e){const t=this._config.replace_patterns;if(!Array.isArray(t)||0===t.length)return e;let a=e;for(const e of t){const t=String(e),i=t.indexOf("=>"),n=(i>=0?t.slice(0,i):t).trim(),r=i>=0?t.slice(i+2).trim():"";0!==n.length&&(a=a.split(n).join(r))}return a.replace(/\s{2,}/g," ").trim()||e}_matchesTentative(e){const t=this._config.tentative_patterns;if(!Array.isArray(t)||0===t.length)return!1;const a=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&a.includes(t)})}async _fetchEvents(){const{start:e,end:t}=this._fetchRange(),a=this._fetchedKey,i=++this._fetchGeneration,n=[];this._loading=!0,this._dataKey!==a&&(this._raw=[],this._events=[],this._calendarResults=[],this._loadedRange=void 0,this._loadError=!1,this._partialLoad=!1);const r=[...new Set(this._config.persons.flatMap(e=>this._calsOf(e)))],s=await Pe(this.hass,r,this._availableCalendars(r),{start:e,end:t});if(i!==this._fetchGeneration)return;this._calendarResults=s,this._dataKey=a,this._loadedRange={start:e,end:t};for(const e of s){if("ok"!==e.status&&"partial"!==e.status)continue;const t=e.entityId,a=e.events;for(const e of a){if(!e||"object"!=typeof e)continue;let a=e.summary||"Termin";const i=this._calMeta(t).title_field;if(i){const t=e[i];"string"==typeof t&&t.trim()&&(a=t.trim())}if(this._hidden(a)||!this._allowed(a))continue;const r=be(a,t,this._config.persons);for(const i of r){const r=this._config.persons[i],s=Se(e,i,t,it(r,i));s&&(this._matchesTentative(a)&&(s.tentative=!0),s.summary=this._cleanTitle(ve(a,r)),n.push(s))}}}const o=this._config.filter_duplicates?function(e){const t=new Set,a=new Map;return e.filter(e=>{const i=`${e.personIdx}|${ye(e)}`;if(t.has(i))return!1;const n=`${e.personIdx}|${e.summary}|${e.start.getTime()}|${e.end.getTime()}`,r=a.get(n);return!(r&&[...r].some(t=>t!==e.calendar)||(t.add(i),r?r.add(e.calendar):a.set(n,new Set([e.calendar])),0))})}(n):n;this._raw=o;const{monday:l}=this._weekBounds();this._events="month"===this._view?[]:o.flatMap(e=>function(e,t){return Me(e,t,7)}(e,l));const d=s.some(e=>"ok"!==e.status),h=s.some(e=>"ok"===e.status||"partial"===e.status);this._loadError=d&&!h,this._partialLoad=d&&h,this._loading=!1,this._refreshReadOnlyDialog()}_calsOf(e){return Array.isArray(e.calendar)?e.calendar.filter(Boolean):e.calendar?[e.calendar]:[]}_writableCals(e){return this._calsOf(e).filter(e=>this._canCreate(e))}_personCanCreate(e){return this._writableCals(e).length>0}_calFeatures(e){if(!e)return 0;const t=this.hass.states[e];return Number(t?.attributes?.supported_features??0)}_canCreate(e){return!this._config.read_only&&!!(1&this._calFeatures(e))}_canUpdate(e){return!this._config.read_only&&!!(4&this._calFeatures(e))}_canDelete(e){return!this._config.read_only&&!!(2&this._calFeatures(e))}get _persons(){return this._config.persons}get _grid(){return this._config.time_grid??30}get _pxPerMin(){if(this._config.fit_height&&this._fitPx>0)return this._fitPx;return Math.min(96,Math.max(40,this._config.hour_height??64))/60}get _startMin(){return 60*(this._config.start_hour??6)}get _endMin(){return 60*(this._config.end_hour??22)}_dayWindow(e){const t=this._startMin,a=this._endMin;if(!1===this._config.trim_hours)return{startMin:t,endMin:a};const i=this._events.filter(t=>t.day===e&&!t.allDay);if(0===i.length)return{startMin:t,endMin:a};let n=Math.min(...i.map(e=>e.startMin)),r=Math.max(...i.map(e=>e.endMin));if(this._isRealToday(e)){const e=this._now(),i=60*e.getHours()+e.getMinutes();i>=t&&i<=a&&(n=Math.min(n,i),r=Math.max(r,i))}let s=Math.max(t,60*Math.floor(n/60)),o=Math.min(a,60*Math.ceil(r/60));return o-s<360&&(o=Math.min(a,s+360),s=Math.max(t,o-360)),{startMin:s,endMin:o}}_jsDay(e){return(this._firstDayJs+e)%7}get _visibleDays(){const e=[0,1,2,3,4,5,6];return!1===this._config.show_weekends?e.filter(e=>{const t=this._jsDay(e);return 0!==t&&6!==t}):e}_t(e){return Le(this.hass,e)}_calMeta(e){return e&&this._config.calendars?.[e]||{}}_mapUrl(e){const t=this._config.map_url,a=encodeURIComponent(e);return"string"==typeof t&&t.includes("{location}")?t.replace("{location}",a):`https://www.google.com/maps/search/?api=1&query=${a}`}_calIcon(e){return this._calMeta(e).icon}_calIconEl(e){const t=this._calIcon(e.ref.calendar);return t?U`<ha-icon class="cicon" .icon=${t}></ha-icon>`:j}_calLabel(e){return this._calMeta(e).label??(this.hass.states[e]?.attributes?.friendly_name||e)}_eventColor(e){const t=this._config.color_by;return"location"===t&&e.location?nt(e.location):"calendar"===t&&e.ref.calendar?this._calMeta(e.ref.calendar).color??nt(e.ref.calendar):e.color}_isPast(e){return!1!==this._config.dim_past&&e.ref.end.getTime()<=this._now().getTime()}_relativeDay(e){const t=_e(e,this._now());return 0===t?this._t("today"):1===t?this._t("tomorrow"):-1===t?this._t("yesterday"):null}_isOff(e){return this._hiddenP.includes(e)}_togglePerson(e){this._rememberDayScroll(this._dateForDay(this._shownDay())),this._hiddenP=this._isOff(e)?this._hiddenP.filter(t=>t!==e):[...this._hiddenP,e],this._savePreferences()}_timedFor(e,t){if(this._isOff(t))return[];const a=this._events.filter(a=>a.day===e&&a.personIdx===t&&!a.allDay&&!this._isBackground(a));return ze(a)}_bgMinMin(){const e=Number(this._config.background_hours??3);return!Number.isFinite(e)||e<=0?0:60*e}_isBackground(e){const t=this._bgMinMin();return t>0&&!e.allDay&&e.endMin-e.startMin>=t}_bgFor(e,t){return this._isOff(t)?[]:this._events.filter(a=>a.day===e&&a.personIdx===t&&!a.allDay&&this._isBackground(a)).sort((e,t)=>t.endMin-t.startMin-(e.endMin-e.startMin))}_maxCols(){const e=Number(this._config.max_columns);return!Number.isFinite(e)||e<1?3:Math.min(Math.round(e),8)}_dayLayout(e,t){const a=this._timedFor(e,t),i=this._maxCols(),n=new Map;for(const e of a){const t=n.get(e.cluster);t?t.push(e):n.set(e.cluster,[e])}const r=[],s=[];for(const e of n.values()){if(e[0].cols<=i){r.push(...e);continue}let t=0,a=1/0,n=-1/0;for(const s of e)s.col<=i-2?r.push({...s,cols:i,span:Math.max(1,Math.min(s.span,i-s.col))}):(t++,a=Math.min(a,s.startMin),n=Math.max(n,s.endMin));t>0&&s.push({col:i-1,cols:i,startMin:a,endMin:n,count:t})}return{events:r,overflows:s}}_evTitle(e){const t=e.parts&&e.parts>1?`${e.title} (${e.part}/${e.parts})`:e.title,a=this._autoIcon(e.title);return a?`${a} ${t}`:t}_autoIcon(e){if(!0!==this._config.auto_icons)return"";if(!e||Xe.test(e))return"";const t=this._config.icon_patterns;if(Array.isArray(t)){const a=e.toLowerCase();for(const e of t){const t=String(e),i=t.indexOf("=>");if(i<0)continue;const n=t.slice(0,i).trim().toLowerCase(),r=t.slice(i+2).trim();if(n&&r&&a.includes(n))return r}}for(const[t,a]of Ze)if(t.test(e))return a;return""}_isTentative(e){return!0===e.ref.tentative}_showDayAgenda(e){this._day=e,this._selectView("agenda")}_openDayView(e){this._day=e,this._selectView("day")}_allDayFor(e,t){return this._isOff(t)?[]:this._events.filter(a=>a.day===e&&a.personIdx===t&&a.allDay)}_eventsFor(e,t){return this._isOff(t)?[]:this._events.filter(a=>a.day===e&&a.personIdx===t).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin)}_dateForDay(e){const{monday:t}=this._weekBounds();return ue(t,e)}_isRealToday(e){return 0===this._weekOffset&&e===this._todayIndex()}_onItemKey(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),e.stopPropagation(),this._openEvent(t))}_dayHasEvents(e){return this._persons.some((t,a)=>this._eventsFor(e,a).length>0)}_personName(e,t){return e.name||this.hass.states[e.person??""]?.attributes?.friendly_name||`Person ${t+1}`}_avatar(e,t){const a=it(e,t),i=e.person?this.hass.states[e.person]:void 0,n=i?.attributes?.entity_picture,r=this._personName(e,t).slice(0,2).toUpperCase();return n?U`<div
          class="avatar"
          style="background-image:url('${n}');box-shadow:0 0 0 2px ${a}55"
        ></div>`:U`<div class="avatar initials" style="background:${a}">${r}</div>`}_badges(e){const t=Array.isArray(e.badges)?e.badges.filter(Boolean):[];return 0===t.length?j:U`<div class="pbadges">
      ${t.map(e=>{const t=this.hass.states[e];if(!t)return j;const a=t.attributes?.icon,i=t.attributes?.unit_of_measurement??"";return U`<span
          class="pbadge"
          title=${t.attributes?.friendly_name??e}
          role="button"
          tabindex="0"
          @click=${t=>{t.stopPropagation(),this._moreInfo(e)}}
          @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),t.stopPropagation(),this._moreInfo(e))}}
        >
          ${a?U`<ha-icon .icon=${a}></ha-icon>`:j}
          <span>${t.state}${i}</span>
        </span>`})}
    </div>`}_moreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_shownDay(){return this._visibleDays.includes(this._day)?this._day:this._visibleDays[0]}_rememberDayScroll(e){void 0!==this._dayScrollFrame&&cancelAnimationFrame(this._dayScrollFrame),this._dayScrollFrame=void 0;const t=this.renderRoot.querySelector(".board"),a=t?.querySelector(".body");if(t&&a&&"wall"===this._layout&&"day"===this._view){const i=[...t.querySelectorAll(".header-row, .allday-row")].reduce((e,t)=>e+t.offsetHeight,0);t.scrollTo({top:t.scrollTop,behavior:"instant"});const n=this._dayWindow(this._shownDay()).startMin+(t.getBoundingClientRect().top+i-a.getBoundingClientRect().top)/this._pxPerMin;this._dayScrollAnchor={minute:this._dayScrollAnchor?.minute??n,left:this._dayScrollAnchor?.left??t.scrollLeft,date:at(e).getTime()},this._scrollToNowRequested=!1,void 0!==this._scrollToNowFrame&&cancelAnimationFrame(this._scrollToNowFrame),this._scrollToNowFrame=void 0}}_navigateDay(e){e.getTime()!==this._dateForDay(this._day).getTime()&&(this._rememberDayScroll(e),this._goToDate(e))}_stepDay(e){this._navigateDay(Oe(this._dateForDay(this._shownDay()),e,!1!==this._config.show_weekends))}_restoreDayScroll(){const e=this._dayScrollAnchor;e&&("day"===this._view&&this._dateForDay(this._shownDay()).getTime()===e.date?this._loading||void 0!==this._dayScrollFrame||(this._dayScrollFrame=requestAnimationFrame(()=>{if(this._dayScrollFrame=void 0,this._dayScrollAnchor!==e||this._loading||!this.isConnected||"day"!==this._view||this._dateForDay(this._shownDay()).getTime()!==e.date)return;const t=this.renderRoot.querySelector(".board"),a=t?.querySelector(".body");if(!t||!a)return;const i=[...t.querySelectorAll(".header-row, .allday-row")].reduce((e,t)=>e+t.offsetHeight,0),n=a.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop,{startMin:r}=this._dayWindow(this._shownDay());t.scrollTo({top:Math.max(0,n+(e.minute-r)*this._pxPerMin-i),left:e.left,behavior:"instant"}),this._scrolledKey=`${this._now().toDateString()}|${this._shownDay()}|${this._pxPerMin}`,this._dayScrollAnchor=void 0})):this._cancelDayScroll())}_setSelectedDate(e){const t=at(this._now()),a=e=>{const t=at(e);return t.setDate(t.getDate()-(t.getDay()-this._firstDayJs+7)%7),t},i=_e(a(e),a(t))/7;this._weekOffset=i,this._day=(e.getDay()-this._firstDayJs+7)%7}_goToDate(e){this._setSelectedDate(e),this._selectView("day",!0)}render(){if(!this._config||!this.hass)return j;const e=this._renderViewSwitcher(),t=this._config.show_focus?this._renderFocus():j,a=U`${this._renderCalendarStatus()}${this._renderActiveView()}`,i="wall"===this._layout?function({title:e,calendarIdentity:t,viewNavigation:a,focus:i,content:n}){return U`
    <section class="moran-wall-shell" aria-label=${t}>
      <header class="moran-wall-header">
        <div class="moran-wall-brand">
          <div class="moran-wall-title">${e}</div>
          <div class="moran-wall-calendar-identity">${t}</div>
        </div>
        ${a}
      </header>
      ${i} ${n}
    </section>
  `}({title:this._config.title??this._t("wall_board_title"),calendarIdentity:this._t("wall_calendar_identity"),viewNavigation:e,focus:t,content:a}):U`
            <ha-card>
              <div class="top">
                <div class="title">${this._config.title??this._t("board_title")}</div>
                ${e}
              </div>
              ${t} ${a}
            </ha-card>
          `;return U`${i} ${this._dialog?this._renderDialog():j}`}_renderViewSwitcher(){return this._enabledViews.length>1?U`<div class="switch" role="tablist">
          ${this._enabledViews.map(e=>U`<button
                role="tab"
                aria-selected=${this._view===e}
                class=${this._view===e?"on":""}
                @click=${()=>this._selectView(e)}
              >
                ${this._t(e)}
              </button>`)}
        </div>`:j}_renderActiveView(){return"day"===this._view?this._renderDay():"timeline"===this._view?this._renderTimeline():"week"===this._view?this._renderWeek():"month"===this._view?this._renderMonth():this._renderAgenda()}_renderCalendarStatus(){if(this._loading)return U`<div class="calendar-status" role="status">
        <span class="spinner"></span>
        <span>${this._t(this._loadedRange?"refreshing_calendars":"loading_calendars")}</span>
      </div>`;if(!this._loadError&&!this._partialLoad)return j;const e=this._calendarResults.some(e=>"partial"===e.status)?"incomplete_events":this._partialLoad?"partial_load":"load_error";return U`<div class="calendar-status banner" role="status">
      <span class="status-message">${this._t(e)}</span>
      <button class="retry" @click=${this._refetch}>${this._t("retry")}</button>
    </div>`}_loadedRangeCoversNow(){const e=this._now().getTime();return!!this._loadedRange&&this._loadedRange.start.getTime()<=e&&e<this._loadedRange.end.getTime()}_focusFor(e){return this._loading||!this._loadedRangeCoversNow()?{}:function(e,t,a){const i=a.getTime(),n=e.filter(e=>e.personIdx===t&&!e.allDay),r=n.filter(e=>e.start.getTime()<=i&&i<e.end.getTime()).sort((e,t)=>t.start.getTime()-e.start.getTime()||e.end.getTime()-t.end.getTime())[0],s=n.filter(e=>e.start.getTime()>i).sort((e,t)=>e.start.getTime()-t.start.getTime()||e.end.getTime()-t.end.getTime())[0];return{current:r,next:s}}(this._raw,e,this._now())}_focusComplete(e){const t=this._calsOf(this._persons[e]);return!this._loading&&t.length>0&&this._loadedRangeCoversNow()&&t.every(e=>"ok"===this._calendarResults.find(t=>t.entityId===e)?.status)}_renderFocus(){return U`
      <div class="focus">
        ${this._persons.map((e,t)=>{if(this._isOff(t))return j;const{current:a,next:i}=this._focusFor(t),n=this._focusComplete(t),r=it(e,t),s=e=>this._config.auto_icons?this._autoIcon(e.summary):"";return U`
            <div class="fchip" title=${this._personName(e,t)}>
              ${this._avatar(e,t)}
              <div class="fbody">
                ${"wall"===this._layout?U`
                      <div class="fheading">
                        <span class="fname">${this._personName(e,t)}</span>
                        <span class="fseparator" aria-hidden="true">·</span>
                        <span class="ffree"
                          >${this._t(a?"status_busy_now":n?"status_free_now":"focus_unavailable")}</span
                        >
                      </div>
                      ${a?U`<span class="fnow" title=${a.summary}>
                            <span class="fsummary"
                              >${this._t("status_now")}: ${s(a)} ${a.summary}</span
                            >
                            <small
                              >${this._t("focus_until")}
                              ${Ve(this.hass,a.end,this._now())}</small
                            >
                          </span>`:j}
                      ${i?U`<span class="fnext" title=${i.summary}>
                            <span class="fsummary"
                              >${this._t("status_next")}: ${s(i)} ${i.summary}</span
                            >
                            <small
                              >${Ve(this.hass,i.start,this._now())}</small
                            >
                          </span>`:j}
                    `:U` <span class="fname">${this._personName(e,t)}</span>
                      ${a?U`<span class="fnow">
                            <span class="fdot" style="background:${r}"></span>${s(a)}
                            ${a.summary}
                            <small
                              >${this._t("focus_until")}
                              ${Ke(this.hass,a.end)}</small
                            >
                          </span>`:i?U`<span class="fnext">
                              ${this._t("focus_next")}: ${s(i)} ${i.summary}
                              <small>${Ye(this.hass,i.start,this._now())}</small>
                            </span>`:U`<span class="ffree">
                              ${this._t(n?"focus_free":"focus_unavailable")}
                            </span>`}`}
              </div>
            </div>
          `})}
      </div>
    `}_weekNav(e=!1){const{monday:t}=this._weekBounds(),a=e&&"day"===this._view;return U`
      <div class="weeknav">
        <button
          class="nav"
          aria-label=${this._t(a?"prev_day":"prev_week")}
          @click=${a?()=>this._stepDay(-1):this._prevWeek}
        >
          ‹
        </button>
        <button
          class="nav-now"
          aria-label=${e?this._t("show_today"):j}
          @click=${this._thisWeek}
        >
          ${e?this._t("today"):function(e,t){const a=new Date(t.getFullYear(),t.getMonth(),t.getDate()+6),i=new Intl.DateTimeFormat(Be(e),{day:"numeric",month:"short"});return`${i.format(t)} – ${i.format(a)}`}(this.hass,t)}
        </button>
        <button
          class="nav"
          aria-label=${this._t(a?"next_day":"next_week")}
          @click=${a?()=>this._stepDay(1):this._nextWeek}
        >
          ›
        </button>
      </div>
    `}_renderDayTabs(){const e=qe(this.hass,"short",this._firstDayJs),t=qe(this.hass,"long",this._firstDayJs),a="wall"===this._layout;return U`
      <div class="tabs" role="tablist">
        ${this._visibleDays.map(i=>{const n=this._dateForDay(i);return U`
            <button
              role="tab"
              aria-selected=${i===this._day}
              aria-label=${a?`${t[i]}, ${je(this.hass,n)}`:j}
              aria-current=${a&&this._isRealToday(i)?"date":j}
              class="${i===this._day?"on":""} ${this._isRealToday(i)?"today":""}"
              @click=${()=>{a&&"day"===this._view?this._navigateDay(n):this._day=i}}
            >
              ${a?U`<span class="wall-day-weekday">${e[i]}</span>
                    <span class="wall-day-number">${n.getDate()}</span>`:e[i]}
            </button>
          `})}
      </div>
    `}_renderDay(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],t=this._pxPerMin,a=60*t,{startMin:i,endMin:n}=this._dayWindow(e),r=(n-i)*t,s=qe(this.hass,"long",this._firstDayJs),o=this._dateForDay(e),l=this._relativeDay(o)??s[e],d=[];for(let e=i/60;e<=n/60;e++)d.push(e);const h=this._now(),c=Math.max(i,Math.min(n,60*h.getHours()+h.getMinutes())),p=!1!==this._config.show_now_line&&this._isRealToday(e),u=this._persons.some((t,a)=>this._allDayFor(e,a).length>0),_=this._persons.filter((e,t)=>this._isOff(t)).length;return U`
      <div
        class="dayhead"
        @pointerdown=${this._onDaySwipeStart}
        @pointerup=${this._onDaySwipeEnd}
        @pointercancel=${this._onDaySwipeCancel}
        @lostpointercapture=${this._onDaySwipeCancel}
      >
        <span
          class="dayname"
          tabindex=${"wall"===this._layout?"0":j}
          role=${"wall"===this._layout?"group":j}
          aria-live=${"wall"===this._layout?"polite":j}
          aria-atomic=${"wall"===this._layout?"true":j}
          title=${"wall"===this._layout?this._t("day_navigation_hint"):j}
          aria-description=${"wall"===this._layout?this._t("day_navigation_hint"):j}
          @keydown=${this._onDayHeadingKey}
        >
          ${"wall"===this._layout?`${l}: ${je(this.hass,o)}`:l}
          ${this._weatherChip(o)}${this._loading&&0===this._raw.length?U`<span class="spinner"></span>`:j}
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
        @wheel=${this._cancelDayScroll}
        @touchstart=${this._cancelDayScroll}
      >
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((e,t)=>{const a=e.person?this.hass.states[e.person]:void 0,i=this._isOff(t);return U`
              <div
                class="phead ${i?"off":""}"
                role="button"
                tabindex="0"
                title=${this._personName(e,t)}
                @click=${()=>this._togglePerson(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(t))}}
              >
                ${this._avatar(e,t)}
                ${i?j:U`<div class="pname">${this._personName(e,t)}</div>
                      <div class="pstatus">
                        ${a?this._statusLabel(a.state):""}
                      </div>
                      ${this._badges(e)}`}
              </div>
            `})}
        </div>
        ${u?U`
              <div class="allday-row">
                <div class="axis-spacer allday-label">${this._t("all_day")}</div>
                ${this._persons.map((t,a)=>U`
                    <div class="allday-cell ${this._isOff(a)?"off":""}">
                      ${this._allDayFor(e,a).map(e=>{const t=this._eventColor(e),a=this._isTentative(e);return U`
                          <div
                            class="adchip ${a?"tentative":""}"
                            style="border-left:3px ${a?"dashed":"solid"} ${t};background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff))"
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
            ${d.map(e=>U`<div class="hour" style="top:${(60*e-i)*t}px">
                  ${"wall"===this._layout?We(this.hass,e):`${Qe(e)}:00`}
                </div>`)}
          </div>
          ${this._persons.map((r,s)=>{const o=this._personCanCreate(r),l=this._dayLayout(e,s);return U`
              <div
                class="col ${o?"creatable":""} ${this._isOff(s)?"off":""}"
                @click=${a=>this._onColClick(a,s,e,t,i)}
                style="background-image:
                  repeating-linear-gradient(var(--fb-row-shade) 0 ${a}px, transparent ${a}px ${2*a}px),
                  repeating-linear-gradient(var(--fb-halfhour) 0 1px, transparent 1px ${a/2}px),
                  repeating-linear-gradient(var(--fb-hourline) 0 1px, transparent 1px ${a}px)"
              >
                ${this._bgFor(e,s).filter(e=>e.endMin>i&&e.startMin<n).map((e,a)=>{const n=(e.startMin-i)*t,r=Math.max((e.endMin-e.startMin)*t-3,16),s=this._eventColor(e),o=this._isTentative(e);return U`
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
                          style="margin-top:${19*a}px;
                                 background:${s}26;
                                 background:color-mix(in srgb, ${s} 16%, var(--card-background-color, #fff))"
                          >${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
                        >
                      </div>
                    `})}
                ${(()=>{let e=-1/0;return l.events.filter(e=>e.endMin>i&&e.startMin<n).map(a=>{const n=this._drag?.raw===a.ref;let r=a.startMin,s=a.endMin;if(n&&this._drag){const e=this._dragGrid;if("move"===this._drag.mode){const t=Math.round((a.startMin+this._drag.deltaMin)/e)*e;s=a.endMin+(t-a.startMin),r=t}else{let t=Math.round((a.endMin-a.startMin+this._drag.deltaMin)/e)*e;t<e&&(t=e),s=a.startMin+t}}let o=(r-i)*t;const l=Math.max((s-r)*t-3,16),d=this._eventColor(a),h=a.col/a.cols*100,c=(a.span??1)/a.cols*100,p=this._isTentative(a),u=l<24,_="wall"===this._layout&&l<56&&!u,m=this._draggable(a);return u&&1===a.cols&&!n&&(o=Math.max(o,e+1),e=o+l),U`
                        <div
                          class="event ${this._isPast(a)?"past":""} ${p?"tentative":""} ${u?"slim":""} ${_?"wall-short":""} ${m?"draggable":""} ${n?"dragging":""}"
                          tabindex="0"
                          role="button"
                          @pointerdown=${e=>this._onEventPointerDown(e,a,"move")}
                          @click=${e=>{e.stopPropagation(),this._suppressClick?this._suppressClick=!1:this._openEvent(a)}}
                          @keydown=${e=>this._onItemKey(e,a)}
                          style="top:${o+1.5}px;height:${l}px;
                               left:calc(${h}% + 2px);width:calc(${c}% - 4px);
                               border-left:3px ${p?"dashed":"solid"} ${d};
                               background:${d}40;
                               background:color-mix(in srgb, ${d} 32%, var(--card-background-color, #fff))"
                          title="${this._evTitle(a)} · ${Ue(this.hass,a.startMin)}–${Ue(this.hass,a.endMin)}"
                        >
                          <span class="etitle"
                            >${this._calIconEl(a)}${a.continuesBefore?"« ":""}${this._evTitle(a)}</span
                          >
                          ${l>32||n?U`<span class="etime"
                                >${Ue(this.hass,r)}–${Ue(this.hass,s)}</span
                              >`:j}
                          ${this._progressOn&&this._isCurrent(a)&&!n?U`<div class="eprog">
                                <div style="width:${this._progressPct(a)}%"></div>
                              </div>`:j}
                          ${m&&!u?U`<div
                                class="rz"
                                @pointerdown=${e=>this._onEventPointerDown(e,a,"resize")}
                              ></div>`:j}
                        </div>
                      `})})()}
                ${l.overflows.filter(e=>e.endMin>i&&e.startMin<n).map(a=>{const n=(a.startMin-i)*t,r=Math.max((a.endMin-a.startMin)*t-3,16),s=a.col/a.cols*100,o=100/a.cols;return U`
                      <div
                        class="event overflow"
                        tabindex="0"
                        role="button"
                        title="${a.count} ${this._t("more_events")}"
                        @click=${t=>{t.stopPropagation(),this._showDayAgenda(e)}}
                        @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._showDayAgenda(e))}}
                        style="top:${n+1.5}px;height:${r}px;
                               left:calc(${s}% + 2px);width:calc(${o}% - 4px)"
                      >
                        <span class="etitle">+${a.count}</span>
                      </div>
                    `})}
              </div>
            `})}
          ${p?U`<div class="nowline" style="top:${(c-i)*t}px">
                <span>${Ue(this.hass,c)}</span>
              </div>`:j}
          ${this._loading||this._loadError||this._partialLoad||this._dayHasEvents(e)?j:U`<div class="empty">${this._t("no_events")}</div>`}
        </div>
      </div>
    `}_renderTimeline(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],{startMin:t,endMin:a}=this._dayWindow(e),i=Math.min(240,Math.max(48,Number(this._config.hour_width)||96)),n=i/60,r=(a-t)*n,s=qe(this.hass,"long",this._firstDayJs),o=[];for(let e=t/60;e<=a/60;e++)o.push(e);const l=this._now(),d=60*l.getHours()+l.getMinutes(),h=!1!==this._config.show_now_line&&this._isRealToday(e)&&d>=t&&d<=a;return U`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(e))??s[e]}
          ${this._weatherChip(this._dateForDay(e))}${this._loading&&0===this._raw.length?U`<span class="spinner"></span>`:j}
        </span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      <div class="tlwrap">
        <div class="tlgrid" style="min-width:calc(var(--fb-tl-label, 150px) + ${r}px)">
          <div class="tlhead">
            <div class="tlcorner"></div>
            <div class="tlhours" style="width:${r}px">
              ${o.map(e=>U`<span class="tlhour" style="left:${(60*e-t)*n}px"
                    >${"wall"===this._layout?We(this.hass,e):`${Qe(e)}:00`}</span
                  >`)}
            </div>
          </div>
          ${this._persons.map((s,o)=>{const l=this._isOff(o),d=l?[]:this._events.filter(t=>t.day===e&&t.personIdx===o),h=ze(d),c=h.length?Math.max(...h.map(e=>e.cols)):1,p=this._personCanCreate(s),u=s.person?this.hass.states[s.person]:void 0;return U`
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
                  style="width:${r}px;height:${30*c+8}px;
                         background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${i}px),
                         repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${i/2}px)"
                  @click=${a=>this._onTimelineClick(a,o,e,n,t)}
                >
                  ${h.filter(e=>e.endMin>t&&e.startMin<a).map(e=>{const i=Math.max(e.startMin,t),r=Math.min(e.endMin,a),s=Math.max((r-i)*n-3,20),o=this._eventColor(e),l=this._isTentative(e),d=e.continuesBefore||e.startMin<t,h=e.continuesAfter||e.endMin>a;return U`
                        <div
                          class="tlbar ${this._isPast(e)?"past":""} ${l?"tentative":""}"
                          tabindex="0"
                          role="button"
                          @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                          @keydown=${t=>this._onItemKey(t,e)}
                          style="left:${(i-t)*n+1.5}px;width:${s}px;
                                 top:${30*e.col+4}px;height:${24}px;
                                 border-left:3px ${l?"dashed":"solid"} ${o};
                                 background:${o}40;
                                 background:color-mix(in srgb, ${o} 32%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)}${e.allDay?` · ${this._t("all_day")}`:` · ${Ue(this.hass,e.startMin)}–${Ue(this.hass,e.endMin)}`}"
                        >
                          <span class="etitle"
                            >${d?"« ":""}${this._evTitle(e)}${h?" »":""}</span
                          >
                          ${!e.allDay&&s>120?U`<span class="etime"
                                >${Ue(this.hass,e.startMin)}–${Ue(this.hass,e.endMin)}</span
                              >`:j}
                        </div>
                      `})}
                </div>
              </div>
            `})}
          ${h?U`<div
                class="tlnow"
                style="left:calc(var(--fb-tl-label, 150px) + ${(d-t)*n}px)"
              >
                <span>${Ue(this.hass,d)}</span>
              </div>`:j}
        </div>
        ${this._loading||this._loadError||this._partialLoad||this._dayHasEvents(e)?j:U`<div class="empty">${this._t("no_events")}</div>`}
      </div>
    `}_onTimelineClick(e,t,a,i,n){const r=this._persons[t];if(!this._personCanCreate(r))return;const s=e.currentTarget.getBoundingClientRect();let o=n+(e.clientX-s.left)/i;const l=this._grid;o=Math.round(o/l)*l,o=Math.max(0,Math.min(o,1440-l)),this._openCreate(t,a,o)}_renderWeek(){const e=qe(this.hass,"short",this._firstDayJs),t="wall"===this._layout,a=new Intl.DateTimeFormat(this.hass.locale?.language||"en",{weekday:"long",month:"short",day:"numeric",year:"numeric"}),i=this._persons.map((e,t)=>({p:e,i:t})).filter(({i:e})=>!0!==this._config.hide_empty_persons||this._events.some(t=>t.personIdx===e)),n=i.length>0?i:this._persons.map((e,t)=>({p:e,i:t})),r=`70px repeat(${n.length}, minmax(${t?180:110}px, 1fr))`;return U`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="weekwrap">
        <div
          class="weekgrid"
          style="grid-template-columns:${r};${t?`min-width:${70+180*n.length}px`:""}"
        >
          <div class="corner"></div>
          ${n.map(({p:e,i:t})=>U`<div
                class="wphead ${this._isOff(t)?"off":""}"
                role="button"
                tabindex="0"
                @click=${()=>this._togglePerson(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(t))}}
              >
                ${this._avatar(e,t)}<span>${this._personName(e,t)}</span>
              </div>`)}
          ${this._visibleDays.map(i=>U`
              <div
                class="wday ${this._isRealToday(i)?"today":""}"
                role="button"
                tabindex="0"
                title=${this._t("day")}
                aria-label=${t?a.format(this._dateForDay(i)):j}
                @click=${()=>this._openDayView(i)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openDayView(i))}}
              >
                <b>${e[i]}</b>
                ${t?U`<span class="wall-week-date">${this._dateForDay(i).getDate()}</span>`:j}
              </div>
              ${n.map(({p:e,i:t})=>{const a=this._personCanCreate(e);return U`
                  <div
                    class="wcell ${this._isRealToday(i)?"today":""} ${a?"creatable":""}"
                    @click=${()=>a&&this._openCreate(t,i)}
                  >
                    ${this._eventsFor(i,t).map(e=>{const t=this._eventColor(e),a=this._isTentative(e);return U`
                        <div
                          class="wchip ${this._isPast(e)?"past":""} ${a?"tentative":""}"
                          style="border-left:2.5px ${a?"dashed":"solid"} ${t};background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)}"
                          tabindex="0"
                          role="button"
                          @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                          @keydown=${t=>this._onItemKey(t,e)}
                        >
                          <span
                            >${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}</span
                          >
                          ${e.allDay?j:U`<small>${Ue(this.hass,e.startMin)}</small>`}
                        </div>
                      `})}
                  </div>
                `})}
            `)}
        </div>
      </div>
    `}_renderAgenda(){const e=qe(this.hass,"long",this._firstDayJs),t=new Intl.DateTimeFormat(this.hass.locale?.language||"en",{day:"numeric",month:"short"}),a=e=>{if(!this._config.filter_duplicates)return e;const t=new Set;return e.filter(e=>{const a=`${e.personIdx}|${ye(e.ref)}|${e.day}`;return!t.has(a)&&(t.add(a),!0)})},i=this._visibleDays.map(e=>({d:e,items:a(this._events.filter(t=>t.day===e&&!this._isOff(t.personIdx)).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin))})).filter(e=>e.items.length>0);return U`
      <div class="weekhead">${this._weekNav()}</div>
      ${this._renderPersonFilters()}
      <div class="agenda">
        ${0===i.length?U`<div class="agenda-empty">
              ${this._loading?U`<span class="spinner"></span>`:this._loadError||this._partialLoad?j:this._t("no_events")}
            </div>`:i.map(a=>U`
                <div class="agenda-day">
                  <div class="agenda-date ${this._isRealToday(a.d)?"today":""}">
                    ${this._relativeDay(this._dateForDay(a.d))??e[a.d]} ·
                    ${t.format(this._dateForDay(a.d))}
                    ${this._weatherChip(this._dateForDay(a.d))}
                  </div>
                  ${a.items.map(e=>this._agendaRow(e))}
                </div>
              `)}
      </div>
    `}_renderPersonFilters(){return"wall"!==this._layout?j:U`<div
      class="wall-person-filters"
      role="group"
      aria-label=${this._t("visible_people")}
    >
      ${this._persons.map((e,t)=>U`<button
            class=${this._isOff(t)?"off":""}
            aria-pressed=${!this._isOff(t)}
            @click=${()=>this._togglePerson(t)}
          >
            ${this._avatar(e,t)}<span>${this._personName(e,t)}</span>
          </button>`)}
    </div>`}_agendaRow(e){const t=this._eventColor(e),a=this._personName(this._persons[e.personIdx],e.personIdx),i=e.allDay?this._t("all_day"):`${Ue(this.hass,e.startMin)}–${Ue(this.hass,e.endMin)}`,n=this._isCurrent(e),r=this._isTentative(e),s=e.allDay||n||e.continuesBefore?"":Ye(this.hass,e.ref.start,this._now());return U`
      <div
        class="agenda-row ${this._isPast(e)?"past":""} ${n?"current":""} ${r?"tentative":""}"
        tabindex="0"
        role="button"
        @click=${()=>this._openEvent(e)}
        @keydown=${t=>this._onItemKey(t,e)}
      >
        <span class="agenda-time">${i}</span>
        <span class="agenda-bar" style="background:${t}"></span>
        <span class="agenda-main">
          <span class="agenda-title"
            >${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
          >
          <span class="agenda-meta">${a}${e.location?` · ${e.location}`:""}</span>
          ${n&&this._progressOn?U`<span class="agenda-prog"
                ><span style="width:${this._progressPct(e)}%;background:${t}"></span
              ></span>`:j}
        </span>
        ${s?U`<span class="agenda-cd">${s}</span>`:j}
      </div>
    `}_renderMonth(){const{gridStart:e,weeks:t,month:a,year:i}=this._monthGrid(),n=7*t,r=qe(this.hass,"short",this._firstDayJs),s=this.hass.locale?.language||"en",o="wall"===this._layout,l=new Intl.DateTimeFormat(s,{weekday:"long",month:"long",day:"numeric",year:"numeric"}),d=new Intl.DateTimeFormat(s,{month:"long",year:"numeric"}).format(new Date(i,a,1)),h=new Map;for(const t of this._raw)if(!this._isOff(t.personIdx))for(const a of Me(t,e,n)){const e=h.get(a.day);e?e.push(a):h.set(a.day,[a])}const c=at(this._now()).getTime();return U`
      <div class="weekhead">
        <div class="weeknav">
          <button class="nav" aria-label=${this._t("prev_month")} @click=${this._prevMonth}>
            ‹
          </button>
          <button class="nav-now" @click=${this._thisMonth}>${d}</button>
          <button class="nav" aria-label=${this._t("next_month")} @click=${this._nextMonth}>
            ›
          </button>
        </div>
      </div>
      ${this._renderPersonFilters()}
      <div
        class="monthwrap ${o&&this._enabledViews.includes("day")&&!1!==this._config.show_weekends?"compact-month":""}"
      >
        <div class="monthhead">${r.map(e=>U`<div class="mhcell">${e}</div>`)}</div>
        <div class="monthgrid">
          ${Array.from({length:n},(t,i)=>{const n=ue(e,i),r=n.getMonth()===a,s=n.getTime()===c,d=(h.get(i)||[]).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin),p=new Set(d.map(e=>ye(e.ref))).size,u=`${p} ${this._t(1===p?"event_count_one":"events")}`,_=[...new Map(d.map(e=>[e.personIdx,e])).values()];return U`
              <div
                class="mcell ${r?"":"out"} ${s?"today":""} ${0===n.getDay()||6===n.getDay()?"wkend":""}"
                role="button"
                aria-label=${o?`${l.format(n)}${p?`, ${u}`:""}`:j}
                tabindex="0"
                @click=${()=>this._goToDate(n)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._goToDate(n))}}
              >
                <div class="mdate ${s?"today":""}">${n.getDate()}</div>
                ${o?U`<div class="wall-month-summary" aria-hidden="true">
                      <span class="wall-month-dots"
                        >${_.slice(0,4).map(e=>U`<i style="background:${this._eventColor(e)}"></i>`)}</span
                      >
                      ${p?U`<span class="wall-month-count">${u}</span>`:j}
                    </div>`:j}
                <div class="mchips">
                  ${d.slice(0,3).map(e=>{const t=this._eventColor(e),a=this._isTentative(e);return U`<div
                      class="mchip ${this._isPast(e)?"past":""} ${a?"tentative":""}"
                      style="background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff));border-left:2px ${a?"dashed":"solid"} ${t}"
                      title="${this._evTitle(e)}"
                      tabindex="0"
                      role="button"
                      @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                      @keydown=${t=>this._onItemKey(t,e)}
                    >
                      ${e.continuesBefore?"« ":""}${this._evTitle(e)}
                    </div>`})}
                  ${d.length>3?U`<div class="mmore">+${d.length-3}</div>`:j}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_statusLabel(e){return"home"===e?this._t("status_home"):"not_home"===e?this._t("status_away"):"unknown"===e||"unavailable"===e?"–":e}_onColClick(e,t,a,i,n){const r=this._persons[t];if(!this._personCanCreate(r))return;const s=e.currentTarget.getBoundingClientRect();let o=n+(e.clientY-s.top)/i;const l=this._grid;o=Math.round(o/l)*l,o=Math.max(0,Math.min(o,1440-l)),this._openCreate(t,a,o)}_openCreate(e,t,a){const i=this._persons[e],n=this._writableCals(i);if(0===n.length)return;const r=at(this._dateForDay(t)),s=a??Math.max(this._startMin,540),o=new Date(r.getTime()+6e4*s),l=new Date(o.getTime()+36e5);this._dialog={mode:"create",personIdx:e,calendar:n[0],calendarOptions:n.length>1?n:void 0,canUpdate:!0,canDelete:!1,summary:"",location:"",description:"",allDay:!1,start:et(o),end:et(l),recurrenceRange:""}}_openEvent(e){this._dialog=this._eventDialog(e.ref)}_eventDialog(e){const t=e.calendar,a=this._canUpdate(t)&&!!e.uid,i=this._canDelete(t)&&!!e.uid;return{mode:"edit",personIdx:e.personIdx,calendar:t,uid:e.uid,recurrence_id:e.recurrence_id,recurring:!(!e.recurrence_id&&!e.rrule),recurrenceRange:"",canUpdate:a,canDelete:i,summary:a?e.sourceSummary??e.summary:e.summary,location:e.location??"",description:e.description??"",allDay:e.allDay,start:e.allDay?tt(e.start):et(e.start),end:e.allDay?tt(ue(e.end,-1)):et(e.end),source:this._config.read_only?e:void 0}}_refreshReadOnlyDialog(){const e=this._dialog;if(!this._config.read_only||!e?.source||"edit"!==e.mode)return;if("ok"!==this._calendarResults.find(t=>t.entityId===e.calendar)?.status)return void(this._dialog={...e,detailsStatus:"unavailable"});const t=function(e,t){const a=t.filter(t=>!(t.calendar!==e.calendar||(e.uid?t.uid!==e.uid||(e.recurrence_id?t.recurrence_id!==e.recurrence_id:t.recurrence_id||(e.rrule||t.rrule)&&t.start.getTime()!==e.start.getTime()):t.uid||ye(t)!==ye(e))));if(1===new Set(a.map(e=>JSON.stringify([e.sourceSummary??e.summary,e.start.getTime(),e.end.getTime(),e.allDay,e.location,e.description]))).size)return a.find(t=>t.personIdx===e.personIdx)??a[0]}(e.source,this._raw);if(!t)return void(this._dialog={...e,detailsStatus:"missing"});const a=this._eventDialog(t),i=["summary","start","end","allDay","location","description"].some(t=>a[t]!==e[t]);this._dialog={...a,detailsStatus:i?"updated":void 0}}_dlgField(e,t){this._dialog&&(this._dialog={...this._dialog,[e]:t,error:void 0})}_toggleAllDay(e){if(!this._dialog)return;const t=this._dialog;e&&!t.allDay?this._dialog={...t,allDay:e,start:t.start.slice(0,10),end:t.end.slice(0,10),error:void 0}:!e&&t.allDay&&(this._dialog={...t,allDay:e,start:`${t.start}T09:00`,end:`${t.end}T10:00`,error:void 0})}_buildPayload(e){const t={summary:e.summary.trim()||this._t("default_title")};if(e.location.trim()&&(t.location=e.location.trim()),e.description.trim()&&(t.description=e.description.trim()),e.allDay){const a=new Date(`${e.end}T00:00:00`);a.setDate(a.getDate()+1),t.dtstart=e.start,t.dtend=tt(a)}else t.dtstart=new Date(e.start).toISOString(),t.dtend=new Date(e.end).toISOString();return t}_validate(e){const t=e.allDay?new Date(`${e.start}T00:00:00`):new Date(e.start),a=e.allDay?new Date(`${e.end}T00:00:00`):new Date(e.end);return isNaN(t.getTime())||isNaN(a.getTime())?this._t("err_invalid"):a.getTime()<t.getTime()?this._t("err_end_before"):e.allDay||a.getTime()!==t.getTime()?null:this._t("err_end_equal")}_draggable(e){return!1!==this._config.drag_drop&&!e.allDay&&!e.ref.rrule&&!e.ref.recurrence_id&&!!e.ref.uid&&this._canUpdate(e.ref.calendar)&&!e.continuesBefore&&!e.continuesAfter}_onEventPointerDown(e,t,a){0===e.button&&this._draggable(t)&&(e.stopPropagation(),this._dragStartY=e.clientY,this._dragPx=this._pxPerMin,this._dragGrid=this._grid,this._drag={raw:t.ref,mode:a,deltaMin:0,moved:!1,busy:!1},e.target.setPointerCapture?.(e.pointerId),window.addEventListener("pointermove",this._onDragMove),window.addEventListener("pointerup",this._onDragUp))}async _commitDrag(e){const t=e.raw;if(!this._canUpdate(t.calendar)||!1===this._config.drag_drop||!t.uid||t.allDay||t.rrule||t.recurrence_id)return void(this._drag=void 0);const{start:a,end:i}=function(e,t,a,i,n){const r=Math.max(1,n),s=new Date(e);s.setHours(0,0,0,0);const o=s.getTime(),l=(e.getTime()-o)/6e4,d=(t.getTime()-e.getTime())/6e4;if("move"===i){const e=Math.round((l+a)/r)*r,t=new Date(o+6e4*e);return{start:t,end:new Date(t.getTime()+6e4*d)}}let h=Math.round((d+a)/r)*r;return h<r&&(h=r),{start:e,end:new Date(e.getTime()+6e4*h)}}(t.start,t.end,e.deltaMin,e.mode,this._dragGrid);if(a.getTime()!==t.start.getTime()||i.getTime()!==t.end.getTime()){this._drag={...e,busy:!0};try{const e={summary:t.sourceSummary??t.summary,dtstart:a.toISOString(),dtend:i.toISOString()};t.location&&(e.location=t.location),t.description&&(e.description=t.description),await this.hass.callWS({type:"calendar/event/update",entity_id:t.calendar,uid:t.uid,recurrence_id:t.recurrence_id,recurrence_range:"",event:e}),this._drag=void 0,await this._refreshAfterMutation()}catch(e){this._drag=void 0,this._loadError=!1,await this._refreshAfterMutation()}}else this._drag=void 0}async _saveDialog(){if(!this._dialog)return;const e=this._dialog;if(e.busy||("create"===e.mode?!this._canCreate(e.calendar):!e.uid||!this._canUpdate(e.calendar)))return;const t=this._validate(e);if(t)this._dialog={...e,error:t};else{this._dialog={...e,busy:!0,error:void 0};try{const t=this._buildPayload(e);"create"===e.mode?await this.hass.callWS({type:"calendar/event/create",entity_id:e.calendar,event:t}):await this.hass.callWS({type:"calendar/event/update",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:"",event:t}),this._dialog=void 0,await this._refreshAfterMutation()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("save_failed")}}}}async _deleteDialog(){if(!this._dialog||!this._dialog.uid)return;const e=this._dialog;if(!e.busy&&this._canDelete(e.calendar)){this._dialog={...e,busy:!0,error:void 0};try{await this.hass.callWS({type:"calendar/event/delete",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:""}),this._dialog=void 0,await this._refreshAfterMutation()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("delete_failed")}}}}_closeDialog(){this._dialog=void 0}_renderDialog(){const e=this._dialog,t="edit"===e.mode&&!e.canUpdate,a=this._calLabel(e.calendar),i="create"===e.mode?this._t("new_event"):t?this._t("event"):this._t("edit_event");return U`
      <div
        class="overlay"
        @click=${e=>{e.target===e.currentTarget&&this._closeDialog()}}
      >
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${i} tabindex="-1">
          <div class="dlg-head">
            <span>${i}</span>
            <button class="icon" aria-label=${this._t("close")} @click=${this._closeDialog}>
              ✕
            </button>
          </div>
          ${e.source&&(this._loading||e.detailsStatus)?U`<div class="details-status" role="status">
                ${this._t(this._loading?"details_refreshing":`details_${e.detailsStatus}`)}
                ${this._loading||"unavailable"!==e.detailsStatus&&"missing"!==e.detailsStatus?j:U`<button class="retry" @click=${this._refetch}>${this._t("retry")}</button>`}
              </div>`:j}
          ${e.calendarOptions&&e.calendarOptions.length>1?U`<label class="fld">
                <span>${this._t("field_calendar")}</span>
                <select
                  .value=${e.calendar}
                  @change=${e=>this._dlgField("calendar",e.target.value)}
                >
                  ${e.calendarOptions.map(t=>U`<option value=${t} ?selected=${t===e.calendar}>
                        ${this._calLabel(t)}
                      </option>`)}
                </select>
              </label>`:U`<div class="dlg-cal">${a}</div>`}

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
              ${!e.location.trim()||e.source&&(this._loading||"missing"===e.detailsStatus||"unavailable"===e.detailsStatus)?j:U`<a
                    class="maplink"
                    href=${this._mapUrl(e.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    @click=${e=>e.stopPropagation()}
                    >${this._t("open_map")}</a
                  >`}
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

          ${"edit"===e.mode&&e.recurring&&!t?U`<div class="recur">
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
          ${t?U`<div class="ro-note">${this._t("read_only")}</div>`:j}
          ${e.error?U`<div class="dlg-error">${e.error}</div>`:j}

          <div class="dlg-actions">
            ${"edit"===e.mode&&e.canDelete?U`<button class="danger" ?disabled=${e.busy} @click=${this._deleteDialog}>
                  ${this._t("delete")}
                </button>`:j}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${e.busy} @click=${this._closeDialog}>
              ${this._t("cancel")}
            </button>
            ${t?j:U`<button class="primary" ?disabled=${e.busy} @click=${this._saveDialog}>
                  ${e.busy?"…":this._t("save")}
                </button>`}
          </div>
        </div>
      </div>
    `}}st.styles=s`
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
    .dialog button {
      min-width: 48px;
      min-height: 48px;
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
    .details-status {
      margin: 8px 0 12px;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font-size: 13px;
    }
    .details-status .retry {
      margin-top: 8px;
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
      flex-wrap: wrap;
      gap: 10px;
    }
    .row .fld {
      flex: 1 1 200px;
      min-width: 0;
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
  `,e([ce({attribute:!1})],st.prototype,"hass",void 0),e([pe()],st.prototype,"_config",void 0),e([pe()],st.prototype,"_events",void 0),e([pe()],st.prototype,"_view",void 0),e([pe()],st.prototype,"_day",void 0),e([pe()],st.prototype,"_weekOffset",void 0),e([pe()],st.prototype,"_monthOffset",void 0),e([pe()],st.prototype,"_dialog",void 0),e([pe()],st.prototype,"_loadError",void 0),e([pe()],st.prototype,"_partialLoad",void 0),e([pe()],st.prototype,"_loading",void 0),e([pe()],st.prototype,"_fitPx",void 0),e([pe()],st.prototype,"_hiddenP",void 0),e([pe()],st.prototype,"_drag",void 0),e([pe()],st.prototype,"_browserOnline",void 0),e([pe()],st.prototype,"_forecast",void 0),customElements.get("moran-family-board-card")||customElements.define("moran-family-board-card",st),window.customCards=window.customCards||[],window.customCards.push({type:"moran-family-board-card",name:"Moran Family Board Card",description:"Family calendar / who-is-where board for multiple people – day, timeline, week, month and agenda views.",preview:!0,documentationURL:"https://github.com/emilianomoran/moran-family-board-card"}),console.info("%c MORAN-FAMILY-BOARD-CARD %c v0.25.1-moran.10 ","background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px","background:#222;color:#fff;border-radius:0 3px 3px 0");const ot={l_title:"Card title",l_layout:"Layout",l_refresh_interval:"Auto refresh (sec., 0 = off)",l_view:"Default view",l_views:"Available views (switcher)",l_time_grid:"Time grid",l_start_hour:"Start hour",l_end_hour:"End hour",l_hour_height:"Height per hour",l_hour_width:"Timeline: width per hour",l_fit_height:"Auto-fit: squeeze the day so it fits without scrolling",l_full_height:"Full height: stretch to the bottom of the screen",l_trim_hours:"Hide empty hours at the edges",l_col_min_width:"Min. column width per person",l_background_hours:"Show long events as a background band from (hrs.)",l_max_columns:"Max. columns per day",l_first_day:"Week starts on",l_scroll_to_now:"Auto-scroll to now",l_remember_preferences:"Remember view and hidden people on this browser",l_preferences_key:"Preferences ID (optional)",h_remember_preferences:"On by default in wall mode. Browser-local and per HA user; no events are saved. Changing lane definitions resets saved filters.",h_preferences_key:"Give otherwise identical cards on the same dashboard path different IDs to keep their preferences separate.",l_color_by:"Color by",l_show_weekends:"Show weekend",l_show_now_line:"Now line",l_dim_past:"Dim past events",l_show_progress:"Show progress bar",l_hide_patterns:"Hide events",l_show_patterns:"Only show events matching",l_replace_patterns:"Replace titles",l_filter_duplicates:"Merge duplicate events",l_tentative_patterns:"Mark as tentative",l_auto_icons:"Auto icons by keyword",l_icon_patterns:"Custom icon rules",l_show_focus:"“Now / next” bar",l_read_only:"Read-only calendar",l_drag_drop:"Move events by dragging (day view)",l_weather_entity:"Weather entity",l_show_weather:"Show weather",l_hide_empty_persons:"Week: hide persons without events",l_auto_return:"Return to the start view after idle (min., 0 = off)",l_event_size:"Event font size",l_radius:"Corner radius of the blocks",l_past_opacity:"Opacity of past events",l_name:"Display name",l_person:"Person (avatar & status)",l_calendar:"Calendars (multiple possible)",l_match_title_prefixes:"Route title prefixes",l_match_title_contains:"Route title contains",l_match_title_regex:"Route title regular expressions",l_unmatched:"Fallback lane for unmatched events",l_strip_title_prefix:"Hide the matched prefix in event titles",l_color:"Custom color (hex, optional)",l_badges:"Badges (e.g. battery, sensors)",l_hidden:"Hidden on start",l_compact:"Compact layout",l_map_url:"Map link (template)",h_hide_patterns:"Text patterns, e.g. “Recess” – matches are hidden",h_layout:"Wall fills the available panel with a calendar-first day layout. Default keeps the existing card.",h_show_patterns:"Allow list: only events whose title contains one of the patterns",h_replace_patterns:"e.g. “Homeroom => Lesson” (without => the text is removed)",h_tentative_patterns:"Matches are drawn dashed / translucent",h_filter_duplicates:"The same event in several calendars is shown only once",h_auto_return:"Kiosk: jumps back to “today” after X minutes without a touch",h_background_hours:"0 = off. Long all-day-ish events (after-school care …) as a subtle band",h_fit_height:"Compresses the day until everything is visible without scrolling",h_full_height:"For panel view / wall tablet",h_trim_hours:"Shows only the hours that actually contain events",h_col_min_width:"Below this the board scrolls horizontally",h_weather_entity:"Daily forecast in the header (HA location)",h_auto_icons:"e.g. doctor → 🩺, sport → 🏃, birthday → 🎂 (titles with emoji stay untouched)",h_icon_patterns:"Own rules, e.g. “Grandma => 👵”",h_show_focus:"Compact bar above the views: what is running now / coming next",h_read_only:"View event details without creating, editing, deleting, or dragging events",h_drag_drop:"Writable calendars only; drag to move, bottom edge changes the duration",h_views:"Which switchers appear at the top",h_badges:"Small chips below the person header; click opens details",h_match_title_prefixes:"Only route titles beginning with one of these values; leading symbols and emoji are ignored",h_match_title_contains:"Also route titles containing one of these values",h_match_title_regex:"Advanced case-insensitive title patterns; invalid patterns are ignored",h_unmatched:"Receives events from these calendars only when no normal lane claimed them",h_strip_title_prefix:"For example, show ‘Rehearsal’ instead of ‘Avery: Rehearsal’",h_color:"Leave empty for the palette color",h_hidden:"Column starts collapsed; a click on the header brings it back",h_compact:"Smaller fonts and tighter spacing in a single switch",h_map_url:"{location} is substituted, e.g. https://maps.apple.com/?q={location}",o_person:"Person",o_location:"Location",o_calendar:"Calendar",o_monday:"Monday",o_sunday:"Sunday",o_default:"Default",o_wall:"Wall",g_views:"🗓️ Views",g_layout:"📐 Layout & size",g_filters:"🧹 Filters & clean-up",g_looks:"🎨 Appearance (fine-tuning)",g_kiosk:"🖥️ Kiosk & extras",w_title:"👨‍👩‍👧‍👦 Welcome to the family board!",w_text:"Ready in two clicks – the card detects your family automatically from the person and calendar entities of your Home Assistant.",w_detect:"✨ Step 1: detect persons automatically",w_hint:"Optionally afterwards: pick a profile (below) or fine-tune the settings in the groups. Of course you can also add persons by hand:",w_empty:"＋ Start empty",p_tablet:"🖥️ Wall tablet",p_tablet_title:"Full screen, auto-fit, return to today",p_phone:"📱 Phone",p_phone_title:"Agenda as start view, compact columns",p_reset:"🧩 Default",p_reset_title:"Reset the layout settings",s_persons:"People",s_calendars:"Calendars (color & label)",s_settings:"Settings",b_add_person:"＋ Add person",b_detect:"✨ Detect automatically",b_up:"Move up",b_down:"Move down",b_remove:"Remove",b_auto:"Automatic",ph_label:"Custom label",ph_icon:"Icon, e.g. mdi:school",ph_title_field:"Title from field (e.g. description)",person_n:"Person",cal_hint_1:"Colors apply with “Color by: calendar”, labels in the event dialog. Icon = mdi icon in front of the title. “Title from field” uses e.g.",cal_hint_2:"instead of",cal_hint_3:"as the event title."},lt={en:ot,de:{l_title:"Kartentitel",l_layout:"Layout",l_refresh_interval:"Auto-Aktualisierung (Sek., 0 = aus)",l_view:"Standardansicht",l_views:"Verfügbare Ansichten (Umschalter)",l_time_grid:"Zeitraster",l_start_hour:"Startstunde",l_end_hour:"Endstunde",l_hour_height:"Höhe pro Stunde",l_hour_width:"Zeitstrahl: Breite pro Stunde",l_fit_height:"Auto-Fit: Tag ohne Scrollen einpassen",l_full_height:"Volle Höhe: bis zum unteren Bildschirmrand",l_trim_hours:"Leere Randstunden automatisch ausblenden",l_col_min_width:"Min. Spaltenbreite pro Person",l_background_hours:"Lange Termine als Hintergrund-Band ab (Std.)",l_max_columns:"Max. Spalten pro Tag",l_first_day:"Wochenstart",l_scroll_to_now:"Auto-Scroll zu jetzt",l_remember_preferences:"Ansicht und ausgeblendete Personen in diesem Browser merken",l_preferences_key:"Einstellungs-ID (optional)",h_remember_preferences:"Im Wall-Modus standardmäßig aktiv. Lokal im Browser und je HA-Benutzer; keine Termine werden gespeichert. Geänderte Personenspalten setzen Filter zurück.",h_preferences_key:"Unterschiedliche IDs trennen die Einstellungen identischer Karten auf demselben Dashboard-Pfad.",l_color_by:"Einfärben nach",l_show_weekends:"Wochenende anzeigen",l_show_now_line:"Jetzt-Linie",l_dim_past:"Vergangene Termine ausgrauen",l_show_progress:"Fortschrittsbalken anzeigen",l_hide_patterns:"Termine ausblenden",l_show_patterns:"Nur Termine zeigen mit",l_replace_patterns:"Titel ersetzen",l_filter_duplicates:"Doppelte Termine zusammenfassen",l_tentative_patterns:"Als vorläufig markieren",l_auto_icons:"Auto-Symbole nach Stichwort",l_icon_patterns:"Eigene Symbol-Regeln",l_show_focus:"„Jetzt / als Nächstes“-Leiste",l_read_only:"Kalender nur lesen",l_drag_drop:"Termine per Ziehen verschieben (Tagesansicht)",l_weather_entity:"Wetter-Entität",l_show_weather:"Wetter anzeigen",l_hide_empty_persons:"Woche: Personen ohne Termine ausblenden",l_auto_return:"Nach Inaktivität zur Startansicht (Min., 0 = aus)",l_event_size:"Schriftgröße Termine",l_radius:"Ecken-Radius der Blöcke",l_past_opacity:"Deckkraft vergangener Termine",l_name:"Anzeigename",l_person:"Person (Avatar & Status)",l_calendar:"Kalender (mehrere möglich)",l_match_title_prefixes:"Titel-Präfixe zuordnen",l_match_title_contains:"Titel enthält",l_match_title_regex:"Reguläre Ausdrücke für Titel",l_unmatched:"Auffangspalte für nicht zugeordnete Termine",l_strip_title_prefix:"Zugeordnetes Präfix im Titel ausblenden",l_color:"Eigene Farbe (Hex, optional)",l_badges:"Badges (z. B. Akku, Sensoren)",l_hidden:"Beim Start ausgeblendet",l_compact:"Kompakte Darstellung",l_map_url:"Karten-Link (Vorlage)",h_hide_patterns:"Textmuster, z. B. „Hofpause“ – Treffer werden ausgeblendet",h_layout:"Wand füllt das verfügbare Panel mit einer kalenderzentrierten Tagesansicht. Standard behält die bestehende Karte bei.",h_show_patterns:"Allow-Liste: nur Termine, deren Titel eines der Muster enthält",h_replace_patterns:"z. B. „Klassenverbund => Unterricht“ (ohne => wird der Text entfernt)",h_tentative_patterns:"Treffer werden gestrichelt/transparent dargestellt",h_filter_duplicates:"Gleicher Termin in mehreren Kalendern nur einmal",h_auto_return:"Kiosk: springt nach X Minuten ohne Berührung zurück zu „heute“",h_background_hours:"0 = aus. Lange Dauertermine (OGS, Betreuung …) als dezentes Band",h_fit_height:"Staucht den Tag, bis alles ohne Scrollen sichtbar ist",h_full_height:"Für Panel-Ansicht / Wandtablet",h_trim_hours:"Zeigt nur die Stunden, in denen wirklich Termine liegen",h_col_min_width:"Darunter wird horizontal gescrollt",h_weather_entity:"Tages-Vorhersage im Kopf (HA-Standort)",h_auto_icons:"z. B. Arzt → 🩺, Sport → 🏃, Geburtstag → 🎂 (Titel mit Emoji bleiben unberührt)",h_icon_patterns:"eigene Regeln, z. B. „Oma => 👵“",h_show_focus:"Kompakte Leiste über den Ansichten: was läuft jetzt / kommt als Nächstes",h_read_only:"Termindetails ansehen, ohne Termine anzulegen, zu ändern, zu löschen oder zu ziehen",h_drag_drop:"Nur bei schreibbaren Kalendern; Ziehen verschiebt, unterer Rand ändert die Dauer",h_views:"Welche Umschalter oben erscheinen",h_badges:"Kleine Chips unter dem Personenkopf; Klick öffnet Details",h_match_title_prefixes:"Nur Titel mit einem dieser Anfänge zuordnen; führende Symbole und Emoji werden ignoriert",h_match_title_contains:"Zusätzlich Titel zuordnen, die einen dieser Werte enthalten",h_match_title_regex:"Erweiterte Titelmuster ohne Groß-/Kleinschreibung; ungültige Muster werden ignoriert",h_unmatched:"Erhält Termine aus diesen Kalendern nur, wenn keine normale Spalte sie zuordnet",h_strip_title_prefix:"Zeigt zum Beispiel ‘Probe’ statt ‘Avery: Probe’",h_color:"Leer lassen für Palettenfarbe",h_hidden:"Spalte startet eingeklappt; ein Klick auf den Kopf holt sie zurück",h_compact:"Kleinere Schriften und engere Abstände in einem Schalter",h_map_url:"{location} wird ersetzt, z. B. https://maps.apple.com/?q={location}",o_person:"Person",o_location:"Ort",o_calendar:"Kalender",o_monday:"Montag",o_sunday:"Sonntag",o_default:"Standard",o_wall:"Wand",g_views:"🗓️ Ansichten",g_layout:"📐 Layout & Größe",g_filters:"🧹 Filter & Aufräumen",g_looks:"🎨 Aussehen (Feintuning)",g_kiosk:"🖥️ Kiosk & Extras",w_title:"👨‍👩‍👧‍👦 Willkommen beim Familienplan!",w_text:"In zwei Klicks startklar – die Karte erkennt deine Familie automatisch aus den Personen- und Kalender-Entitäten deines Home Assistant.",w_detect:"✨ Schritt 1: Personen automatisch erkennen",w_hint:"Danach optional: Profil wählen (unten) oder Feinheiten in den Gruppen einstellen. Natürlich kannst du Personen auch von Hand anlegen:",w_empty:"＋ Leer starten",p_tablet:"🖥️ Wandtablet",p_tablet_title:"Vollbild, Auto-Fit, Rückkehr zu heute",p_phone:"📱 Handy",p_phone_title:"Agenda als Startansicht, kompakte Spalten",p_reset:"🧩 Standard",p_reset_title:"Layout-Einstellungen zurücksetzen",s_persons:"Personen",s_calendars:"Kalender (Farbe & Label)",s_settings:"Einstellungen",b_add_person:"＋ Person hinzufügen",b_detect:"✨ Automatisch erkennen",b_up:"Nach oben",b_down:"Nach unten",b_remove:"Entfernen",b_auto:"Automatisch",ph_label:"Eigenes Label",ph_icon:"Symbol, z. B. mdi:school",ph_title_field:"Titel aus Feld (z. B. description)",person_n:"Person",cal_hint_1:"Farben wirken bei „Einfärben nach: Kalender“, Labels im Termin-Dialog. Symbol = mdi-Icon vor dem Titel. „Titel aus Feld“ nutzt z. B.",cal_hint_2:"statt",cal_hint_3:"als Termin-Titel."}};function dt(e,t){return lt[e]?.[t]??ot[t]??t}const ht=["#7986cb","#4fc3f7","#4db6ac","#aed581","#ffd54f","#ffb74d","#e57373","#f06292","#f48fb1","#ce93d8","#9575cd","#90a4ae"],ct=[{name:"name",selector:{text:{}}},{name:"person",selector:{entity:{filter:{domain:"person"}}}},{name:"calendar",selector:{entity:{filter:{domain:"calendar"},multiple:!0}}},{name:"match_title_prefixes",selector:{text:{multiple:!0}}},{name:"match_title_contains",selector:{text:{multiple:!0}}},{name:"match_title_regex",selector:{text:{multiple:!0}}},{name:"unmatched",selector:{boolean:{}}},{name:"strip_title_prefix",selector:{boolean:{}}},{name:"badges",selector:{entity:{multiple:!0}}},{name:"color",selector:{text:{}}},{name:"hidden",selector:{boolean:{}}}],pt=(e,t,a)=>({name:"",type:"expandable",title:e,icon:t,schema:a});class ut extends oe{constructor(){super(...arguments),this._t=e=>dt(this._lang,e),this._label=e=>{const t=`l_${e.name}`,a=dt(this._lang,t);return a===t?e.name:a},this._helper=e=>{const t=`h_${e.name}`,a=dt(this._lang,t);return a===t?void 0:a}}setConfig(e){this._config=e}get _persons(){return Array.isArray(this._config.persons)?this._config.persons:[]}get _lang(){return Re(this.hass)}_viewOptions(){return Ae.map(e=>({value:e,label:Le(this.hass,e)}))}get _isFresh(){return!this._persons.some(e=>e.name||e.person||e.calendar)}get _settingsData(){return{...this._config,layout:Ce(this._config.layout),remember_preferences:this._config.remember_preferences??"wall"===Ce(this._config.layout),time_grid:String(this._config.time_grid??30)}}_schema(){const e=this._config,t=Array.isArray(e.views)&&e.views.length?e.views:Ae,a=t.includes("day"),i=t.includes("timeline"),n=t.includes("week"),r=[{name:"layout",selector:{select:{mode:"dropdown",options:[{value:"default",label:this._t("o_default")},{value:"wall",label:this._t("o_wall")}]}}}];(a||i)&&r.push({name:"start_hour",selector:{number:{min:0,max:23,mode:"box"}}},{name:"end_hour",selector:{number:{min:1,max:24,mode:"box"}}},{name:"trim_hours",selector:{boolean:{}}}),a&&r.push({name:"hour_height",selector:{number:{min:40,max:96,step:4,mode:"slider",unit_of_measurement:"px"}}},{name:"fit_height",selector:{boolean:{}}},{name:"col_min_width",selector:{number:{min:60,max:400,step:10,mode:"slider",unit_of_measurement:"px"}}},{name:"max_columns",selector:{number:{min:1,max:8,step:1,mode:"slider"}}},{name:"background_hours",selector:{number:{min:0,max:12,step:1,mode:"slider",unit_of_measurement:"h"}}}),i&&r.push({name:"hour_width",selector:{number:{min:48,max:240,step:8,mode:"slider",unit_of_measurement:"px"}}}),r.push({name:"full_height",selector:{boolean:{}}});const s=[{name:"auto_return",selector:{number:{min:0,max:60,step:1,mode:"box",unit_of_measurement:"min"}}},{name:"scroll_to_now",selector:{boolean:{}}},{name:"remember_preferences",selector:{boolean:{}}},{name:"preferences_key",selector:{text:{}}},{name:"show_now_line",selector:{boolean:{}}},{name:"show_progress",selector:{boolean:{}}},{name:"weather_entity",selector:{entity:{filter:{domain:"weather"}}}},{name:"map_url",selector:{text:{}}}];return e.weather_entity&&s.push({name:"show_weather",selector:{boolean:{}}}),s.push({name:"refresh_interval",selector:{number:{min:0,max:3600,mode:"box",unit_of_measurement:"s"}}}),[{name:"title",selector:{text:{}}},pt(this._t("g_views"),"mdi:calendar-multiselect",[{name:"view",selector:{select:{mode:"dropdown",options:this._viewOptions()}}},{name:"views",selector:{select:{multiple:!0,options:this._viewOptions()}}},{name:"time_grid",selector:{select:{mode:"dropdown",options:[{value:"60",label:"60 min"},{value:"30",label:"30 min"},{value:"15",label:"15 min"}]}}},{name:"first_day",selector:{select:{mode:"dropdown",options:[{value:"monday",label:this._t("o_monday")},{value:"sunday",label:this._t("o_sunday")}]}}},{name:"show_weekends",selector:{boolean:{}}}]),pt(this._t("g_layout"),"mdi:resize",r),pt(this._t("g_filters"),"mdi:broom",[{name:"hide_patterns",selector:{text:{multiple:!0}}},{name:"show_patterns",selector:{text:{multiple:!0}}},{name:"replace_patterns",selector:{text:{multiple:!0}}},{name:"filter_duplicates",selector:{boolean:{}}},{name:"tentative_patterns",selector:{text:{multiple:!0}}},...n?[{name:"hide_empty_persons",selector:{boolean:{}}}]:[]]),pt(this._t("g_looks"),"mdi:palette",[{name:"show_focus",selector:{boolean:{}}},{name:"read_only",selector:{boolean:{}}},{name:"drag_drop",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}},{name:"auto_icons",selector:{boolean:{}}},...e.auto_icons?[{name:"icon_patterns",selector:{text:{multiple:!0}}}]:[],{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"person",label:this._t("o_person")},{value:"location",label:this._t("o_location")},{value:"calendar",label:this._t("o_calendar")}]}}},{name:"dim_past",selector:{boolean:{}}},{name:"event_size",selector:{number:{min:9,max:16,step:.5,mode:"slider",unit_of_measurement:"px"}}},{name:"radius",selector:{number:{min:0,max:18,step:1,mode:"slider",unit_of_measurement:"px"}}},{name:"past_opacity",selector:{number:{min:10,max:100,step:5,mode:"slider",unit_of_measurement:"%"}}}]),pt(this._t("g_kiosk"),"mdi:tablet-dashboard",s)]}_emit(e){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_settingsChanged(e){e.stopPropagation();const t={...e.detail.value},a=Ce(t.layout);delete t.layout,"string"==typeof t.time_grid&&(t.time_grid=Number(t.time_grid));const i={...this._config,...t,persons:this._persons,...this._config.calendars?{calendars:this._config.calendars}:{}};this._emit(function(e,t){const a={...e};return"wall"===t?a.layout="wall":delete a.layout,a}(i,a))}_applyPreset(e){const t={...this._config,persons:this._persons},a=e=>e.forEach(e=>delete t[e]);"tablet"===e?Object.assign(t,{view:"day",full_height:!0,fit_height:!0,trim_hours:!0,scroll_to_now:!0,auto_return:5}):"phone"===e?(Object.assign(t,{view:"agenda",col_min_width:96}),a(["full_height","fit_height","auto_return"])):(a(["full_height","fit_height","trim_hours","auto_return","col_min_width","hour_height","hour_width","max_columns","background_hours","event_size","radius","past_opacity"]),t.view="day"),this._emit(t)}_personChanged(e,t){t.stopPropagation();const a={...t.detail.value};a.color||delete a.color,Array.isArray(a.badges)&&0===a.badges.length&&delete a.badges,Array.isArray(a.match_title_prefixes)&&0===a.match_title_prefixes.length&&delete a.match_title_prefixes,Array.isArray(a.match_title_contains)&&0===a.match_title_contains.length&&delete a.match_title_contains,Array.isArray(a.match_title_regex)&&0===a.match_title_regex.length&&delete a.match_title_regex,a.unmatched||delete a.unmatched,a.strip_title_prefix||delete a.strip_title_prefix,a.hidden||delete a.hidden,Array.isArray(a.calendar)&&(0===a.calendar.length?delete a.calendar:1===a.calendar.length&&(a.calendar=a.calendar[0]));const i=this._persons.map((t,i)=>i===e?a:t);this._emit({...this._config,persons:i})}_personData(e){const t=Array.isArray(e.calendar)?e.calendar:e.calendar?[e.calendar]:[];return{...e,calendar:t}}_setPersonColor(e,t){const a=this._persons.map((a,i)=>{if(i!==e)return a;const n={...a};return t?n.color=t:delete n.color,n});this._emit({...this._config,persons:a})}_addPerson(){const e=[...this._persons,{name:"",person:"",calendar:""}];this._emit({...this._config,persons:e})}_autoDetect(){const e=rt(this.hass);if(0===e.length)return;const t=new Set(this._persons.map(e=>e.person).filter(Boolean)),a=[...this._persons.filter(e=>e.name||e.person||e.calendar)];for(const i of e)t.has(i.person)||a.push(i);this._emit({...this._config,persons:a})}_removePerson(e){const t=this._persons.filter((t,a)=>a!==e);this._emit({...this._config,persons:t})}_movePerson(e,t){const a=[...this._persons],i=e+t;i<0||i>=a.length||([a[e],a[i]]=[a[i],a[e]],this._emit({...this._config,persons:a}))}_calsUsed(){const e=[];for(const t of this._persons){const a=Array.isArray(t.calendar)?t.calendar:t.calendar?[t.calendar]:[];for(const t of a)t&&!e.includes(t)&&e.push(t)}return e}_setCalMeta(e,t){const a={...this._config.calendars??{}},i={...a[e]??{}};for(const e of["color","label","icon","title_field"]){const a=t[e];void 0!==a&&(a?i[e]=a:delete i[e])}0===Object.keys(i).length?delete a[e]:a[e]=i;const n={...this._config,persons:this._persons};0===Object.keys(a).length?delete n.calendars:n.calendars=a,this._emit(n)}_calName(e){return this.hass.states[e]?.attributes?.friendly_name||e}_swatches(e,t){return U`
      <div class="swatches">
        ${ht.map(a=>U`
            <button
              class="swatch ${e?.toLowerCase()===a?"on":""}"
              style="background:${a}"
              title=${a}
              @click=${()=>t(a)}
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
    `}render(){if(!this._config)return j;if(this._isFresh)return U`
        <div class="wizard">
          <div class="wtitle">${this._t("w_title")}</div>
          <div class="wtext">${this._t("w_text")}</div>
          <button class="wbtn primary" @click=${this._autoDetect}>${this._t("w_detect")}</button>
          <div class="wtext small">${this._t("w_hint")}</div>
          <button class="wbtn" @click=${this._addPerson}>${this._t("w_empty")}</button>
        </div>
      `;const e=this._persons,t=this._calsUsed();return U`
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
        ${e.map((t,a)=>U`
            <div class="person">
              <div class="person-head">
                <span
                  class="pdot"
                  style="background:${t.color||ht[a%ht.length]}"
                ></span>
                <span class="pidx">${t.name||`${this._t("person_n")} ${a+1}`}</span>
                <div class="ptools">
                  <button
                    class="icon"
                    title=${this._t("b_up")}
                    ?disabled=${0===a}
                    @click=${()=>this._movePerson(a,-1)}
                  >
                    ↑
                  </button>
                  <button
                    class="icon"
                    title=${this._t("b_down")}
                    ?disabled=${a===e.length-1}
                    @click=${()=>this._movePerson(a,1)}
                  >
                    ↓
                  </button>
                  <button
                    class="icon danger"
                    title=${this._t("b_remove")}
                    @click=${()=>this._removePerson(a)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              ${this._swatches(t.color,e=>this._setPersonColor(a,e))}
              <ha-form
                .hass=${this.hass}
                .data=${this._personData(t)}
                .schema=${ct}
                .computeLabel=${this._label}
                .computeHelper=${this._helper}
                @value-changed=${e=>this._personChanged(a,e)}
              ></ha-form>
            </div>
          `)}
        <div class="addrow">
          <button class="add" @click=${this._addPerson}>${this._t("b_add_person")}</button>
          <button class="add detect" @click=${this._autoDetect}>${this._t("b_detect")}</button>
        </div>
      </div>

      ${t.length>1||this._config.calendars?U`
            <div class="section-title">${this._t("s_calendars")}</div>
            <div class="cals">
              ${t.map(e=>{const t=this._config.calendars?.[e]??{};return U`
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
    `}}ut.styles=s`
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
  `,e([ce({attribute:!1})],ut.prototype,"hass",void 0),e([pe()],ut.prototype,"_config",void 0),customElements.define("moran-family-board-card-editor",ut);var _t=Object.freeze({__proto__:null,FamilyBoardCardEditor:ut});export{st as FamilyBoardCard,rt as autoDetectPersons};
