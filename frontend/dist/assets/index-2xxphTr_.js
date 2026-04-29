(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();async function m(e,t,a){try{return(await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0})).json()}catch(n){return{success:!1,error:`Netzwerkfehler: ${n.message}`}}}const u={listSaves:()=>m("GET","/api/saves"),createSave:(e,t,a)=>m("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>m("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>m("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>m("GET","/api/teams/available"),getTeams:()=>m("GET","/api/teams"),getTeam:e=>m("GET",`/api/teams/${e}`),getRiders:e=>m("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRaces:()=>m("GET","/api/races"),getGameState:()=>m("GET","/api/state"),advanceDay:()=>m("POST","/api/state/advance"),runTimeTrial:e=>m("POST",`/api/races/${e}/simulate`),getRaceResults:e=>m("GET",`/api/races/${e}/results`)},r={currentSave:null,gameState:null,races:[],riders:[],teams:[],teamTableSort:{key:"name",direction:"asc"},teamDetailsRiderId:null};function o(e){return document.getElementById(e)}function l(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function k(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function Y(e){const t={TimeTrial:["badge-tt","Zeitfahren"],Flat:["badge-flat","Flach"],Hilly:["badge-hilly","Hügelig"],Mountain:["badge-mountain","Berge"],Classics:["badge-classics","Klassiker"]},[a,n]=t[e]??["badge-todo",e];return`<span class="badge ${a}">${n}</span>`}function q(e){const t=Math.min(100,Math.max(0,e));return`
    <div class="attr-bar-wrap">
      <span style="width:2.2em;text-align:right">${e}</span>
      <div class="attr-bar"><div class="attr-bar-fill" style="width:${t}%"></div></div>
    </div>`}const M=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],K={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},D=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"flag",label:"Flg",title:"Flagge",sortKey:"countryCode",className:"team-table-col-flag"},{id:"code",label:"Code",title:"Nationalität - 3er-Code",sortKey:"countryCode",className:"team-table-col-code"},{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},...M.map(e=>({id:e.key,label:e.label,title:`${e.label} - ${K[e.key]}`,sortKey:e.key,className:"team-table-col-skill"})),{id:"info",label:"Info",title:"Info - Profil und Vorlieben anzeigen",sortKey:"riderType",className:"team-table-col-info"}],I=D.length;function Z(e,t,a){return Math.max(t,Math.min(a,e))}function S(e,t,a){return Math.round(e+(t-e)*a)}function C(e,t,a){return`rgb(${S(e[0],t[0],a)} ${S(e[1],t[1],a)} ${S(e[2],t[2],a)})`}function J(e){const t=[{value:40,color:[115,24,36]},{value:52,color:[158,40,44]},{value:64,color:[191,97,24]},{value:74,color:[170,143,24]},{value:85,color:[28,128,72]}],a=Z(e,t[0].value,t[t.length-1].value);for(let n=1;n<t.length;n+=1){const i=t[n-1],s=t[n];if(a<=s.value){const c=(a-i.value)/(s.value-i.value);return C(i.color,s.color,c)}}return C(t[t.length-1].color,t[t.length-1].color,1)}function x(e){return`<span class="skill-value" style="color:${J(e)}">${e}</span>`}const W={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",COL:"co",AUS:"au",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SUI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRE:"ie",CZE:"cz",SVK:"sk",KAZ:"kz",RSA:"za",OTH:"un"};function O(e){const t=W[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function P(e,t){return e?`<span class="country-chip">${O(e.code3)}<span>${l(e.name)}</span></span>`:t?l(t):"–"}function T(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function w(e){return`${e.lastName} ${e.firstName}`}function g(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function X(e){return r.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${r.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function Q(e){const t=r.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
        title="${l(e.title)}"
        aria-label="${l(e.title)}"
      >
        <span class="team-table-sort-label">${l(e.label)}</span>
        ${X(e.sortKey)}
      </button>
    </th>`}function ee(e){const t=[...e],a=r.teamTableSort.direction==="asc"?1:-1;return t.sort((n,i)=>{let s=0;switch(r.teamTableSort.key){case"name":s=g(n.lastName,i.lastName)||g(n.firstName,i.firstName);break;case"countryCode":s=g(T(n),T(i));break;case"birthYear":s=n.birthYear-i.birthYear;break;case"age":s=(n.age??0)-(i.age??0);break;case"overallRating":s=n.overallRating-i.overallRating;break;case"riderType":s=g(n.riderType,i.riderType)||g(w(n),w(i));break;default:s=n.skills[r.teamTableSort.key]-i.skills[r.teamTableSort.key];break}return s===0&&(s=g(n.lastName,i.lastName)||g(n.firstName,i.firstName)),s*a}),t}function F(e){return e.length===0?"–":e.map(t=>{const a=r.races.find(n=>n.id===t);return a?l(a.name):`Rennen ${t}`}).join(", ")}function te(e){return`
    <tr class="team-detail-expansion-row">
      <td colspan="${I}">
        <div class="rider-insight-panel">
          <div class="rider-insight-group">
            <div class="rider-insight-title">Profil</div>
            <div><strong>${l(e.riderType)}</strong></div>
            <div class="text-muted">${l([e.specialization1,e.specialization2,e.specialization3].filter(Boolean).join(" · ")||"Keine Spezialisierung")}</div>
            <div class="text-muted">${e.isStageRacer?"Etappenfahrer":"Kein Etappenfokus"} / ${e.isOneDayRacer?"Eintagesfahrer":"Kein Eintagesfokus"}</div>
          </div>
          <div class="rider-insight-group">
            <div class="rider-insight-title">Vorlieben</div>
            <div><span class="text-muted">Fav:</span> ${F(e.favoriteRaces)}</div>
            <div><span class="text-muted">No:</span> ${F(e.nonFavoriteRaces)}</div>
          </div>
        </div>
      </td>
    </tr>`}function L(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),o(`screen-${e}`).classList.remove("hidden")}function N(e){o(`modal-${e}`).classList.remove("hidden")}function R(e){o(`modal-${e}`).classList.add("hidden")}function p(e="Lade…"){o("loading-msg").textContent=e,o("loading-overlay").classList.remove("hidden")}function b(){o("loading-overlay").classList.add("hidden")}function A(e,t){const a=o(e);a.textContent=t,a.classList.remove("hidden")}function H(e){o(e).classList.add("hidden")}function G(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),o(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active")}async function $(){const e=await u.listSaves(),t=o("saves-list");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden");return}t.classList.remove("hidden"),t.innerHTML=e.data.map(a=>`
    <div class="save-card">
      <h3>${l(a.careerName)}</h3>
      <p class="save-meta">
        ${l(a.teamName)} · Saison ${a.currentSeason}
        ${a.lastSaved?"· "+k(a.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${l(a.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${l(a.filename)}" data-career-name="${l(a.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function ae(e){p("Karriere wird geladen…");const t=await u.loadSave(e);if(b(),!t.success){alert("Fehler beim Laden: "+t.error);return}r.currentSave=t.data??null,await B()}async function ne(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;p("Löschen…");const a=await u.deleteSave(e);if(b(),!a.success){alert("Fehler: "+a.error);return}await $()}o("btn-new-career").addEventListener("click",async()=>{var a;H("new-career-error"),o("input-career-name").value="";const e=o("input-team-id");e.innerHTML='<option value="">Wird geladen…</option>',N("newCareer");const t=await u.getAvailableTeams();if(!t.success||!((a=t.data)!=null&&a.length)){e.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}e.innerHTML=t.data.map(n=>`<option value="${n.id}">${l(n.name)} (${l(n.division??n.divisionName??"")})</option>`).join("")});o("btn-cancel-new").addEventListener("click",()=>R("newCareer"));o("btn-confirm-new").addEventListener("click",async()=>{const e=o("input-career-name").value.trim(),t=o("input-team-id").value;if(!e||!t){A("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const a=Number(t),i=`${e.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;H("new-career-error"),p("Neue Karriere wird erstellt…");const s=await u.createSave(i,e,a);if(!s.success){b(),A("new-career-error",s.error??"Unbekannter Fehler.");return}const c=await u.loadSave(i);if(b(),R("newCareer"),!c.success){alert("Fehler: "+c.error);return}r.currentSave=c.data??null,await B()});o("btn-load-career").addEventListener("click",()=>$());o("saves-list").addEventListener("click",async e=>{const t=e.target.closest("button[data-save-action]");if(!t)return;const{saveAction:a,filename:n,careerName:i}=t.dataset;if(n){if(a==="load"){await ae(n);return}a==="delete"&&await ne(n,i??n)}});async function B(){var e;L("game"),o("meta-career").textContent=((e=r.currentSave)==null?void 0:e.careerName)??"",G("dashboard"),p("Spiel wird geladen…");try{await re(),await E(),await j(),await le(),h()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{b()}}document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.view??"";G(t),t==="teams"&&j()})});o("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;r.teamDetailsRiderId=null,y(t?Number(t):null)});o("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-team-sort]");if(t){const s=t.dataset.teamSort;r.teamTableSort.key===s?r.teamTableSort.direction=r.teamTableSort.direction==="asc"?"desc":"asc":r.teamTableSort={key:s,direction:s==="birthYear"||s==="age"||s==="overallRating"?"desc":"asc"};const c=Number(o("teams-dropdown").value);y(Number.isFinite(c)?c:null);return}const a=e.target.closest("button[data-rider-info]");if(!a)return;const n=Number(a.dataset.riderInfo);r.teamDetailsRiderId=r.teamDetailsRiderId===n?null:n;const i=Number(o("teams-dropdown").value);y(Number.isFinite(i)?i:null)});o("btn-back-menu").addEventListener("click",()=>{L("menu"),$()});o("btn-advance-day").addEventListener("click",async()=>{p("Tag wird fortgeschrieben...");try{const e=await u.advanceDay();if(!e.success){alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler"));return}r.gameState=e.data??null,U(),r.currentSave&&e.data&&(r.currentSave.currentSeason=e.data.season),await E()}catch(e){alert("Unerwarteter Fehler beim Tageswechsel: "+e.message)}finally{b()}});async function re(){const e=await u.getGameState();if(!e.success){console.error(e.error);return}r.gameState=e.data??null,U(),h(),r.currentSave&&e.data&&(r.currentSave.currentSeason=e.data.season)}function U(){if(!r.gameState)return;o("meta-date").textContent=r.gameState.formattedDate,o("meta-season").textContent=`Saison ${r.gameState.season}`;const e=o("meta-race-hint");r.gameState.hasRaceToday?(e.textContent=`${r.gameState.racesTodayCount} Rennen für heute im Kalender`,e.classList.remove("hidden")):(e.textContent="",e.classList.add("hidden"))}function h(){var t,a,n,i;const e=r.teams.find(s=>s.isPlayerTeam)??r.teams.find(s=>{var c;return s.name===((c=r.currentSave)==null?void 0:c.teamName)})??null;o("dashboard-career").textContent=((t=r.currentSave)==null?void 0:t.careerName)??"–",o("dashboard-team").textContent=(e==null?void 0:e.name)??((a=r.currentSave)==null?void 0:a.teamName)??"–",o("dashboard-u23-team").textContent=(e==null?void 0:e.u23TeamName)??"–",o("dashboard-date").textContent=((n=r.gameState)==null?void 0:n.formattedDate)??"–",o("dashboard-season").textContent=r.gameState?`Saison ${r.gameState.season}`:"–",o("dashboard-races-today").textContent=String(((i=r.gameState)==null?void 0:i.racesTodayCount)??0),se()}async function E(){const e=await u.getRaces();if(!e.success){console.error(e.error);return}r.races=e.data??[],h()}function se(){const e=o("dashboard-races-tbody"),t=r.races.filter(a=>!r.gameState||a.isCompleted||a.date>=r.gameState.currentDate).slice(0,8);if(t.length===0){e.innerHTML='<tr><td colspan="7" class="text-muted">Keine kommenden Rennen.</td></tr>';return}e.innerHTML=t.map(a=>{var f;const n=((f=r.gameState)==null?void 0:f.currentDate)===a.date,i=a.type==="TimeTrial"&&n&&!a.isCompleted,s=a.type==="TimeTrial"&&a.isCompleted,c=a.isCompleted?'<span class="badge badge-done">Abgeschlossen</span>':n?'<span class="badge badge-live">Heute</span>':'<span class="badge badge-todo">Ausstehend</span>';let d='<button class="btn btn-secondary btn-xs" disabled>–</button>';return i&&(d=`<button class="btn btn-primary btn-xs" data-race-action="run-tt" data-race-id="${a.id}">▶ Starten</button>`),s&&(d=`<button class="btn btn-ghost btn-xs" data-race-action="show-results" data-race-id="${a.id}">Ergebnisse</button>`),`
      <tr>
        <td>${k(a.date)}</td>
        <td><strong>${l(a.name)}</strong></td>
        <td>${Y(a.type)}</td>
        <td>${a.profile.distanceKm.toFixed(1)} km</td>
        <td>${a.profile.elevationGain.toLocaleString("de-DE")} m</td>
        <td>${c}</td>
        <td>${d}</td>
      </tr>`}).join("")}o("dashboard-races-tbody").addEventListener("click",async e=>{const t=e.target.closest("button[data-race-action]");if(!t)return;const a=Number(t.dataset.raceId);Number.isFinite(a)&&(t.dataset.raceAction==="run-tt"&&await ie(a),t.dataset.raceAction==="show-results"&&await oe(a))});async function ie(e){p("Zeitfahren wird simuliert…");const t=await u.runTimeTrial(e);if(b(),!t.success||!t.data){alert("Fehler: "+t.error);return}_(t.data),N("ttResult"),await E()}async function oe(e){p("Ergebnisse werden geladen…");const t=await u.getRaceResults(e);if(b(),!t.success||!t.data){alert("Keine Ergebnisse verfügbar.");return}_(t.data),N("ttResult")}o("btn-close-tt").addEventListener("click",()=>R("ttResult"));function _(e){o("tt-result-race-name").textContent=e.raceName,o("tt-result-meta").textContent=`${k(e.date)} · ${e.distanceKm.toFixed(1)} km · Saison ${e.season}`,o("tt-result-tbody").innerHTML=e.entries.map((t,a)=>{const n=a+1,i=n<=3?`pos-${n}`:"",s=t.dayFormFactor,c=s>=1.08?`<span style="color:var(--success)">↑${s.toFixed(3)}</span>`:s<=.92?`<span style="color:var(--danger)">↓${s.toFixed(3)}</span>`:s.toFixed(3),d=r.teams.find(f=>f.id===t.rider.activeTeamId);return`
      <tr>
        <td class="${i}">${n}</td>
        <td><strong>${l(t.rider.firstName)} ${l(t.rider.lastName)}</strong></td>
        <td>${P(t.rider.country,t.rider.nationality)}</td>
        <td>${d?l(d.abbreviation):"–"}</td>
          <td>${q(t.rider.skills.timeTrial)}</td>
        <td>${c}</td>
        <td style="font-family:var(--font-mono)">${l(t.finishTimeFormatted)}</td>
        <td style="font-family:var(--font-mono);color:var(--text-500)">${l(t.gapFormatted)}</td>
      </tr>`}).join("")}async function le(){const e=await u.getRiders();if(!e.success){console.error(e.error);return}r.riders=e.data??[],z(),h()}async function j(){const e=await u.getTeams();if(!e.success){console.error("loadTeams Fehler:",e.error),o("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${l(e.error??"Unbekannt")}</p>`;return}r.teams=e.data??[],z(),h()}function z(){const e=o("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+r.teams.map(n=>`<option value="${n.id}"${String(n.id)===t?" selected":""}>${l(n.name)} (${l(n.division??n.divisionName??"")})</option>`).join("");const a=t?Number(t):null;y(a)}function y(e){const t=o("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=r.teams.find(d=>d.id===e);if(!a){t.innerHTML="";return}const n=ee(r.riders.filter(d=>d.activeTeamId===e)),i=r.teams.find(d=>d.u23TeamId===e),s=a.u23TeamName?`U23-Team: ${l(a.u23TeamName)}`:i?`Hauptteam: ${l(i.name)}`:null,c=a.division==="U23"?"badge-u23":"badge-classics";t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${l(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${c}">${l(a.division??a.divisionName??"")}</span>
          <span>${P(a.country,a.countryCode)}</span>
          <span>Kürzel: ${l(a.abbreviation)}</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
          ${s?`<span class="text-muted">${s}</span>`:""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${n.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${l(r.teamTableSort.key==="name"?"Nachname":r.teamTableSort.key==="countryCode"?"Code":r.teamTableSort.key==="birthYear"?"Jahrgang":r.teamTableSort.key==="age"?"Alter":r.teamTableSort.key==="overallRating"?"Gesamt":r.teamTableSort.key==="riderType"?"Profil":K[r.teamTableSort.key])} ${r.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      <table class="data-table data-table-teams" style="margin-top:1rem">
        <thead><tr>
          ${D.map(Q).join("")}
        </tr></thead>
        <tbody>
          ${n.length===0?`<tr><td colspan="${I}" class="text-muted">Keine Fahrer.</td></tr>`:n.map(d=>{const f=T(d),v=r.teamDetailsRiderId===d.id;return`
              <tr class="team-detail-row${v?" team-detail-row-expanded":""}">
                <td class="team-table-name-cell"><strong>${l(w(d))}</strong></td>
                <td class="team-table-flag-cell">${O(f)}</td>
                <td class="team-table-code-cell">${l(f)}</td>
                <td>${d.birthYear}</td>
                <td>${d.age??"–"}</td>
                <td>${x(d.overallRating)}</td>
                ${M.map(V=>`<td>${x(d.skills[V.key])}</td>`).join("")}
                <td class="team-table-info-cell">
                  <button
                    type="button"
                    class="info-toggle${v?" info-toggle-active":""}"
                    data-rider-info="${d.id}"
                    title="Profil und Vorlieben ${v?"ausblenden":"anzeigen"}"
                    aria-expanded="${v?"true":"false"}"
                    aria-label="Profil und Vorlieben ${v?"ausblenden":"anzeigen"}"
                  >i</button>
                </td>
              </tr>
              ${v?te(d):""}`}).join("")}
        </tbody>
      </table>
    </div>`}(async()=>(L("menu"),await $()))();
