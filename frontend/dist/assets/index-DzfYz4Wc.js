(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function a(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=a(i);fetch(i.href,o)}})();async function u(e,t,a){try{return(await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0})).json()}catch(s){return{success:!1,error:`Netzwerkfehler: ${s.message}`}}}const m={listSaves:()=>u("GET","/api/saves"),createSave:(e,t,a)=>u("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>u("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>u("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>u("GET","/api/teams/available"),getTeams:()=>u("GET","/api/teams"),getTeam:e=>u("GET",`/api/teams/${e}`),getRiders:e=>u("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRaces:()=>u("GET","/api/races"),getGameState:()=>u("GET","/api/state"),advanceDay:()=>u("POST","/api/state/advance"),runTimeTrial:e=>u("POST",`/api/races/${e}/simulate`),getRaceResults:e=>u("GET",`/api/races/${e}/results`)},r={currentSave:null,gameState:null,races:[],riders:[],teams:[]};function n(e){return document.getElementById(e)}function c(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function $(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function D(e){const t={TimeTrial:["badge-tt","Zeitfahren"],Flat:["badge-flat","Flach"],Hilly:["badge-hilly","Hügelig"],Mountain:["badge-mountain","Berge"],Classics:["badge-classics","Klassiker"]},[a,s]=t[e]??["badge-todo",e];return`<span class="badge ${a}">${s}</span>`}function g(e){const t=Math.min(100,Math.max(0,e));return`
    <div class="attr-bar-wrap">
      <span style="width:2.2em;text-align:right">${e}</span>
      <div class="attr-bar"><div class="attr-bar-fill" style="width:${t}%"></div></div>
    </div>`}function w(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),n(`screen-${e}`).classList.remove("hidden")}function S(e){n(`modal-${e}`).classList.remove("hidden")}function y(e){n(`modal-${e}`).classList.add("hidden")}function h(e="Lade…"){n("loading-msg").textContent=e,n("loading-overlay").classList.remove("hidden")}function f(){n("loading-overlay").classList.add("hidden")}function L(e,t){const a=n(e);a.textContent=t,a.classList.remove("hidden")}function E(e){n(e).classList.add("hidden")}function N(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),n(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active")}async function p(){const e=await m.listSaves(),t=n("saves-list");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden");return}t.classList.remove("hidden"),t.innerHTML=e.data.map(a=>`
    <div class="save-card">
      <h3>${c(a.careerName)}</h3>
      <p class="save-meta">
        ${c(a.teamName)} · Saison ${a.currentSeason}
        ${a.lastSaved?"· "+$(a.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${c(a.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${c(a.filename)}" data-career-name="${c(a.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function H(e){h("Karriere wird geladen…");const t=await m.loadSave(e);if(f(),!t.success){alert("Fehler beim Laden: "+t.error);return}r.currentSave=t.data??null,await x()}async function A(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;h("Löschen…");const a=await m.deleteSave(e);if(f(),!a.success){alert("Fehler: "+a.error);return}await p()}n("btn-new-career").addEventListener("click",async()=>{var a;E("new-career-error"),n("input-career-name").value="";const e=n("input-team-id");e.innerHTML='<option value="">Wird geladen…</option>',S("newCareer");const t=await m.getAvailableTeams();if(!t.success||!((a=t.data)!=null&&a.length)){e.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}e.innerHTML=t.data.map(s=>`<option value="${s.id}">${c(s.name)} (${c(s.division??s.divisionName??"")})</option>`).join("")});n("btn-cancel-new").addEventListener("click",()=>y("newCareer"));n("btn-confirm-new").addEventListener("click",async()=>{const e=n("input-career-name").value.trim(),t=n("input-team-id").value;if(!e||!t){L("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const a=Number(t),i=`${e.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;E("new-career-error"),h("Neue Karriere wird erstellt…");const o=await m.createSave(i,e,a);if(!o.success){f(),L("new-career-error",o.error??"Unbekannter Fehler.");return}const l=await m.loadSave(i);if(f(),y("newCareer"),!l.success){alert("Fehler: "+l.error);return}r.currentSave=l.data??null,await x()});n("btn-load-career").addEventListener("click",()=>p());n("saves-list").addEventListener("click",async e=>{const t=e.target.closest("button[data-save-action]");if(!t)return;const{saveAction:a,filename:s,careerName:i}=t.dataset;if(s){if(a==="load"){await H(s);return}a==="delete"&&await A(s,i??s)}});async function x(){var e;w("game"),n("meta-career").textContent=((e=r.currentSave)==null?void 0:e.careerName)??"",N("dashboard"),h("Spiel wird geladen…");try{await G(),await T(),await F(),await P(),b()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{f()}}document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.view??"";N(t),t==="teams"&&F()})});n("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;k(t?Number(t):null)});n("btn-back-menu").addEventListener("click",()=>{w("menu"),p()});n("btn-advance-day").addEventListener("click",async()=>{h("Tag wird fortgeschrieben...");try{const e=await m.advanceDay();if(!e.success){alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler"));return}r.gameState=e.data??null,C(),r.currentSave&&e.data&&(r.currentSave.currentSeason=e.data.season),await T()}catch(e){alert("Unerwarteter Fehler beim Tageswechsel: "+e.message)}finally{f()}});async function G(){const e=await m.getGameState();if(!e.success){console.error(e.error);return}r.gameState=e.data??null,C(),b(),r.currentSave&&e.data&&(r.currentSave.currentSeason=e.data.season)}function C(){if(!r.gameState)return;n("meta-date").textContent=r.gameState.formattedDate,n("meta-season").textContent=`Saison ${r.gameState.season}`;const e=n("meta-race-hint");r.gameState.hasRaceToday?(e.textContent=`${r.gameState.racesTodayCount} Rennen für heute im Kalender`,e.classList.remove("hidden")):(e.textContent="",e.classList.add("hidden"))}function b(){var t,a,s,i;const e=r.teams.find(o=>o.isPlayerTeam)??r.teams.find(o=>{var l;return o.name===((l=r.currentSave)==null?void 0:l.teamName)})??null;n("dashboard-career").textContent=((t=r.currentSave)==null?void 0:t.careerName)??"–",n("dashboard-team").textContent=(e==null?void 0:e.name)??((a=r.currentSave)==null?void 0:a.teamName)??"–",n("dashboard-u23-team").textContent=(e==null?void 0:e.u23TeamName)??"–",n("dashboard-date").textContent=((s=r.gameState)==null?void 0:s.formattedDate)??"–",n("dashboard-season").textContent=r.gameState?`Saison ${r.gameState.season}`:"–",n("dashboard-races-today").textContent=String(((i=r.gameState)==null?void 0:i.racesTodayCount)??0),K()}async function T(){const e=await m.getRaces();if(!e.success){console.error(e.error);return}r.races=e.data??[],b()}function K(){const e=n("dashboard-races-tbody"),t=r.races.filter(a=>!r.gameState||a.isCompleted||a.date>=r.gameState.currentDate).slice(0,8);if(t.length===0){e.innerHTML='<tr><td colspan="7" class="text-muted">Keine kommenden Rennen.</td></tr>';return}e.innerHTML=t.map(a=>{var v;const s=((v=r.gameState)==null?void 0:v.currentDate)===a.date,i=a.type==="TimeTrial"&&s&&!a.isCompleted,o=a.type==="TimeTrial"&&a.isCompleted,l=a.isCompleted?'<span class="badge badge-done">Abgeschlossen</span>':s?'<span class="badge badge-live">Heute</span>':'<span class="badge badge-todo">Ausstehend</span>';let d='<button class="btn btn-secondary btn-xs" disabled>–</button>';return i&&(d=`<button class="btn btn-primary btn-xs" data-race-action="run-tt" data-race-id="${a.id}">▶ Starten</button>`),o&&(d=`<button class="btn btn-ghost btn-xs" data-race-action="show-results" data-race-id="${a.id}">Ergebnisse</button>`),`
      <tr>
        <td>${$(a.date)}</td>
        <td><strong>${c(a.name)}</strong></td>
        <td>${D(a.type)}</td>
        <td>${a.profile.distanceKm.toFixed(1)} km</td>
        <td>${a.profile.elevationGain.toLocaleString("de-DE")} m</td>
        <td>${l}</td>
        <td>${d}</td>
      </tr>`}).join("")}n("dashboard-races-tbody").addEventListener("click",async e=>{const t=e.target.closest("button[data-race-action]");if(!t)return;const a=Number(t.dataset.raceId);Number.isFinite(a)&&(t.dataset.raceAction==="run-tt"&&await O(a),t.dataset.raceAction==="show-results"&&await I(a))});async function O(e){h("Zeitfahren wird simuliert…");const t=await m.runTimeTrial(e);if(f(),!t.success||!t.data){alert("Fehler: "+t.error);return}R(t.data),S("ttResult"),await T()}async function I(e){h("Ergebnisse werden geladen…");const t=await m.getRaceResults(e);if(f(),!t.success||!t.data){alert("Keine Ergebnisse verfügbar.");return}R(t.data),S("ttResult")}n("btn-close-tt").addEventListener("click",()=>y("ttResult"));function R(e){n("tt-result-race-name").textContent=e.raceName,n("tt-result-meta").textContent=`${$(e.date)} · ${e.distanceKm.toFixed(1)} km · Saison ${e.season}`,n("tt-result-tbody").innerHTML=e.entries.map((t,a)=>{const s=a+1,i=s<=3?`pos-${s}`:"",o=t.dayFormFactor,l=o>=1.08?`<span style="color:var(--success)">↑${o.toFixed(3)}</span>`:o<=.92?`<span style="color:var(--danger)">↓${o.toFixed(3)}</span>`:o.toFixed(3),d=r.teams.find(v=>v.id===t.rider.teamId);return`
      <tr>
        <td class="${i}">${s}</td>
        <td><strong>${c(t.rider.firstName)} ${c(t.rider.lastName)}</strong></td>
        <td>${c(t.rider.nationality)}</td>
        <td>${d?c(d.abbreviation):"–"}</td>
        <td>${g(t.rider.attributes.timeTrial)}</td>
        <td>${l}</td>
        <td style="font-family:var(--font-mono)">${c(t.finishTimeFormatted)}</td>
        <td style="font-family:var(--font-mono);color:var(--text-500)">${c(t.gapFormatted)}</td>
      </tr>`}).join("")}async function P(){const e=await m.getRiders();if(!e.success){console.error(e.error);return}r.riders=e.data??[],M(),b()}async function F(){const e=await m.getTeams();if(!e.success){console.error("loadTeams Fehler:",e.error),n("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${c(e.error??"Unbekannt")}</p>`;return}r.teams=e.data??[],M(),b()}function M(){const e=n("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+r.teams.map(s=>`<option value="${s.id}"${String(s.id)===t?" selected":""}>${c(s.name)} (${c(s.division??s.divisionName??"")})</option>`).join("");const a=t?Number(t):null;k(a)}function k(e){const t=n("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=r.teams.find(d=>d.id===e);if(!a){t.innerHTML="";return}const s=r.riders.filter(d=>d.teamId===e).sort((d,v)=>v.overallRating-d.overallRating),i=r.teams.find(d=>d.u23TeamId===e),o=a.u23TeamName?`U23-Team: ${c(a.u23TeamName)}`:i?`Hauptteam: ${c(i.name)}`:null,l=a.division==="U23"?"badge-u23":"badge-classics";t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${c(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${l}">${c(a.division??a.divisionName??"")}</span>
          <span>${c(a.countryCode)}</span>
          <span>Kürzel: ${c(a.abbreviation)}</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
          ${o?`<span class="text-muted">${o}</span>`:""}
        </div>
      </div>
      <table class="data-table" style="margin-top:1rem">
        <thead><tr>
          <th>Name</th><th>Nat</th><th>Jg.</th><th>Alter</th><th>ÜW</th>
          <th>ZF</th><th>Kle</th><th>Spr</th><th>Aus</th><th>Std</th>
        </tr></thead>
        <tbody>
          ${s.length===0?'<tr><td colspan="10" class="text-muted">Keine Fahrer.</td></tr>':s.map(d=>`
              <tr>
                <td><strong>${c(d.firstName)} ${c(d.lastName)}</strong></td>
                <td>${c(d.nationality)}</td>
                <td>${d.birthYear}</td>
                <td>${d.age??"–"}</td>
                <td>${g(d.overallRating)}</td>
                <td>${g(d.attributes.timeTrial)}</td>
                <td>${g(d.attributes.climbing)}</td>
                <td>${g(d.attributes.sprint)}</td>
                <td>${g(d.attributes.flatEndurance)}</td>
                <td>${g(d.attributes.stamina)}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}(async()=>(w("menu"),await p()))();
