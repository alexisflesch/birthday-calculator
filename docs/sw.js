if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,c)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const o=e=>i(e,n),d={module:{uri:n},exports:t,require:o};s[n]=Promise.all(r.map((e=>d[e]||o(e)))).then((e=>(c(...e),t)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-DcNY-xdj.css",revision:null},{url:"assets/index-DSTN6D7s.js",revision:null},{url:"cake.svg",revision:"82d37802e4c1c74560a6abec597cbb3a"},{url:"index.html",revision:"0c05b92433638c71e3df0d65c0d99c6f"},{url:"registerSW.js",revision:"153c3dffa44b6662abd66727df155a92"},{url:"service-worker.js",revision:"ece99f4ce3dc8a4f9c5e2b47ffbc65c8"},{url:"cake.svg",revision:"82d37802e4c1c74560a6abec597cbb3a"},{url:"manifest.webmanifest",revision:"28d197be0ef309e4af0a53cd4c65af63"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
