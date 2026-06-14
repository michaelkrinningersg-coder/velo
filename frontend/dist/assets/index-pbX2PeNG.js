(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=a(r);fetch(r.href,n)}})();function nn(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Ja(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function Ra(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function Ia(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function we(e,t={}){const a=t.strong===!1?"span":"strong",s=Ja("app-rider-link-label",t.labelClassName),r=`<${a} class="${s}">${nn(e)}</${a}>`;if(t.riderId==null)return r;const n=['type="button"','class="'+Ja("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${r}</button>`}function nt(e,t,a=!0,s=""){const r=a===!1?"span":"strong",n=`<${r} class="app-team-link-label">${nn(e)}</${r}>`;return t==null?n:`<button type="button" class="${Ja("app-team-link",s)}" data-team-id="${t}">${n}</button>`}const d={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,draftHistory:null,injuries:null,draftSelectedSeason:null,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1};let Et=null;function so(e){Et=e}let hs=!1;function Zs(e){hs=e}let on=null;function qs(e){on=e}let Qa=null;function Xs(e){Qa=e}let Ve=!1;function bs(e){Ve=e}function S(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function v(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function se(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function ua(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),s=Math.floor(e%60),r=String(a).padStart(2,"0"),n=String(s).padStart(2,"0");return t>0?`${t}:${r}:${n}`:`${a}:${n}`}function _a(e){return e==null||e===0?"–":`+${ua(e)}`}const oa=2,es=3,ln=4;function cn(e){return`/jersey/Jer_${e}.png`}function kt(e,t){var s;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((s=d.teams.find(r=>r.id===e))==null?void 0:s.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${v(a)}" aria-label="${v(a)}">
      <img
        class="results-team-jersey-img"
        src="${v(cn(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function xt(e,t){return`<span class="results-jersey-cell">${kt(e,t)}</span>`}function je(e){return e&&oe(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function la(e){var a;if(e==null)return null;const t=Se(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function Se(e){return e==null?null:d.riders.find(t=>t.id===e)??null}function Je(e){return e==null?null:d.races.find(t=>t.id===e)??null}function ma(e){var t;if(e==null)return null;for(const a of d.races){const s=(t=a.stages)==null?void 0:t.find(r=>r.id===e);if(s)return{race:a,stage:s}}return null}function Rt(e,t=!0,a=!1,s=null,r=null){const n=we(e,{riderId:s,teamId:r,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function ro(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function ts(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function no(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function io(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}const it={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function oe(e){const t=it[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function oo(e,t){return e?`<span class="country-chip">${oe(e.code3)}<span>${v(e.name)}</span></span>`:t?v(t):"–"}function as(e){return`${e.toFixed(2).replace(".",",")} km`}function ss(e){return`${Math.round(e)} hm`}const lo=new Set;function Ss(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),S(`screen-${e}`).classList.remove("hidden")}function Le(e){S(`modal-${e}`).classList.remove("hidden")}function Ne(e){S(`modal-${e}`).classList.add("hidden")}function ue(e="Lade…"){const t=Ve?" (Leertaste zum Stoppen)":"";S("loading-msg").textContent=e+t,S("loading-progress").classList.add("hidden"),S("loading-overlay").classList.remove("hidden")}function ce(){S("loading-overlay").classList.add("hidden")}function co(e){S("loading-progress").classList.remove("hidden"),S("loading-overlay").classList.remove("hidden"),dn(e)}function dn(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),a=Ve?" (Leertaste zum Stoppen)":"";S("loading-msg").textContent=`Instant-Simulation läuft … ${t}%${a}`,S("loading-progress-bar").style.width=`${t}%`}function ot(e,t){const a=S(e);a.textContent=t,a.classList.remove("hidden")}function Dt(e){S(e).classList.add("hidden")}function pt(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),S(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),S("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of lo)try{a(e)}catch(s){console.error(`Fehler bei View-Aktivierung von "${e}":`,s)}}function $e(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function Ct(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function un(e,t,a){return Math.max(t,Math.min(a,e))}function Ga(e,t,a){return Math.round(e+(t-e)*a)}function Js(e,t,a){return`rgb(${Ga(e[0],t[0],a)} ${Ga(e[1],t[1],a)} ${Ga(e[2],t[2],a)})`}function vs(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=un(e,t[0].value,t[t.length-1].value);for(let s=1;s<t.length;s+=1){const r=t[s-1],n=t[s];if(a<=n.value){const i=(a-r.value)/(n.value-r.value);return Js(r.color,n.color,i)}}return Js(t[t.length-1].color,t[t.length-1].color,1)}function mn(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${vs(e)}"${a}>${e.toFixed(2)}</span>`}function uo(e,t,a){if(t==null)return mn(e,a);const s=Math.round((e-t)*100)/100,r=s>0?"skill-delta-positive":s<0?"skill-delta-negative":"skill-delta-neutral",n=s>0?"+":"",i=`<span class="skill-delta ${r}">${n}${s.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${vs(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function mo(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function Qs(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",s=t>0?"+":"";return`<span class="${a}">${s}${t.toFixed(1).replace(".",",")}</span>`}function er(e,t="none",a){const s=e??0,r=["race-sim-form-negative"];t==="warning"&&r.push("load-warning"),t==="critical"&&r.push("load-warning-critical");const n=a?` title="${v(a)}"`:"";return s===0?`<span class="${r.join(" ")}"${n}>0,0</span>`:`<span class="${r.join(" ")}"${n}>-${s.toFixed(1).replace(".",",")}</span>`}function pn(e){const t=e.seasonFormPhase??"neutral";return gn(t)}function gn(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${v(a.label)}">${a.symbol}</span>`}function po(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${v(e.seasonProgram.name)}</button>`:"–"}function dt(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function ve(e){return`${e.lastName} ${e.firstName}`}function go(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,s=e.unavailableUntil?` bis ${se(e.unavailableUntil)}`:"",r=`${t}: noch ${a} Tag${a===1?"":"e"}${s}`;return`<span class="rider-availability-marker" title="${v(r)}" aria-label="${v(r)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function Xe(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function rs(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(a),r=document.createElement("a");r.href=s,r.download=e,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(s)}async function O(e,t,a){try{const s=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(s.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await s.text();return{success:!1,error:s.ok?"Antwort war kein JSON.":`HTTP ${s.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return s.json()}catch(s){return{success:!1,error:`Netzwerkfehler: ${s.message}`}}}const G={listSaves:()=>O("GET","/api/saves"),createSave:(e,t,a)=>O("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>O("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>O("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>O("GET","/api/teams/available"),getTeams:()=>O("GET","/api/teams"),getTeam:e=>O("GET",`/api/teams/${e}`),getTeamStats:e=>O("GET",`/api/teams/${e}/stats`),getRiders:e=>O("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRiderStats:e=>O("GET",`/api/riders/${e}/stats`),getRiderProgramRaces:e=>O("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>O("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>O("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>O("POST","/api/rider-team-editor/export",e),getRaces:()=>O("GET","/api/races"),getRaceProgramParticipants:e=>O("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>O("GET",`/api/races/${e}/results-roster`),getGameState:()=>O("GET","/api/state"),getGameStatus:()=>O("GET","/api/game/status"),getStageSummary:e=>O("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>O("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>O("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>O("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>O("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>O("POST","/api/state/advance"),getStageResults:e=>O("GET",`/api/results/${e}`),getSeasonStandings:()=>O("GET","/api/season-standings"),listStageEditorStages:()=>O("GET","/api/stage-editor/stages"),getStageEditorOverview:()=>O("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>O("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>O("POST","/api/stage-editor/import",e),exportStageRoute:e=>O("POST","/api/stage-editor/export",e),getInjuries:()=>O("GET","/api/injuries"),getDraftHistory:e=>O("GET",`/api/draft/${e}`)};async function Gt(){const e=await G.listSaves(),t=S("saves-list"),a=S("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(s=>`
    <div class="save-card">
      <h3>${v(s.careerName)}</h3>
      <p class="save-meta">
        ${v(s.teamName)} · Saison ${s.currentSeason}
        ${s.lastSaved?"· "+se(s.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${v(s.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${v(s.filename)}" data-career-name="${v(s.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function fo(e){ue("Karriere wird geladen…");const t=await G.loadSave(e);if(ce(),!t.success){alert("Fehler beim Laden: "+t.error);return}d.currentSave=t.data??null,await ao()}async function ho(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;ue("Löschen…");const a=await G.deleteSave(e);if(ce(),!a.success){alert("Fehler: "+a.error);return}await Gt()}async function bo(){const e=await G.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){S("btn-delete-all-careers").classList.add("hidden"),S("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){ue("Alle Karrieren werden gelöscht…");try{for(const a of t){const s=await G.deleteSave(a.filename);if(!s.success){alert(`Fehler beim Löschen von "${a.careerName}": ${s.error??"Unbekannter Fehler"}`);break}}}finally{ce()}await Gt()}}function So(){S("btn-new-career").addEventListener("click",async()=>{var r;Dt("new-career-error"),S("input-career-name").value="";const a=S("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',Le("newCareer");const s=await G.getAvailableTeams();if(!s.success||!((r=s.data)!=null&&r.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=s.data.map(n=>`<option value="${n.id}">${v(n.name)} (${v(n.division??n.divisionName??"")})</option>`).join("")}),S("btn-cancel-new").addEventListener("click",()=>Ne("newCareer")),S("btn-confirm-new").addEventListener("click",async()=>{const a=S("input-career-name").value.trim(),s=S("input-team-id").value;if(!a||!s){ot("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const r=Number(s),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;Dt("new-career-error"),ue("Neue Karriere wird erstellt…");const o=await G.createSave(i,a,r);if(!o.success){ce(),ot("new-career-error",o.error??"Unbekannter Fehler.");return}const c=await G.loadSave(i);if(ce(),Ne("newCareer"),!c.success){alert("Fehler: "+c.error);return}d.currentSave=c.data??null,await ao()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>Gt());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{bo()}),S("saves-list").addEventListener("click",async a=>{const s=a.target.closest("button[data-save-action]");if(!s)return;const{saveAction:r,filename:n,careerName:i}=s.dataset;if(n){if(r==="load"){await fo(n);return}r==="delete"&&await ho(n,i??n)}})}const vo="modulepreload",yo=function(e){return"/"+e},tr={},fn=function(t,a,s){let r=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));r=Promise.allSettled(a.map(c=>{if(c=yo(c),c in tr)return;tr[c]=!0;const l=c.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":vo,l||(m.as="script"),m.crossOrigin="",m.href=c,o&&m.setAttribute("nonce",o),document.head.appendChild(m),l)return new Promise((u,g)=>{m.addEventListener("load",u),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return r.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},ko={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function $o(e){const t=ko[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const To=200;function ys(e){if(e.length===0)return[];const t=[];for(const a of e){const s=t[t.length-1];if(!s||Math.abs(s.distanceMeter-a.distanceMeter)>=To){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}s.riderIds.push(...a.riderIds),s.riderCount+=a.riderCount,s.distanceSum+=a.distanceMeter*a.riderCount,s.distanceMeter=s.distanceSum/s.riderCount}return t.map(({distanceSum:a,...s})=>s)}function ks(e){if(e.length===0)return[];let t=0;for(let r=1;r<e.length;r+=1)e[r].riderCount>e[t].riderCount&&(t=r);let a=0,s=0;return e.map((r,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(s+=1,o=`A${s}`),{...r,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-r.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,r.distanceMeter-e[n+1].distanceMeter):null}})}function Mo(e,t=null){var a,s,r;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((s=e.find(n=>n.label==="P"))==null?void 0:s.label)??((r=e[0])==null?void 0:r.label)??null}function Qe(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function ar(e,t,a,s){return`${s.type}:${e}:${t}:${a}`}function wo(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:Qe(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function _e(e){const t=[];e.segments.forEach((r,n)=>{const i=n*2;(r.start_markers??[]).forEach((o,c)=>{t.push({key:ar(n,"start",c,o),label:"",marker:o,kmMark:r.start_km,elevation:r.start_elevation,boundary:"start",sequence:i+c/100})}),(r.end_markers??[]).forEach((o,c)=>{t.push({key:ar(n,"end",c,o),label:"",marker:o,kmMark:r.end_km,elevation:r.end_elevation,boundary:"end",sequence:i+1+c/100})})});const a=t.sort((r,n)=>r.kmMark-n.kmMark||r.sequence-n.sequence),s=new Map;return a.map(r=>{const n=(s.get(r.marker.type)??0)+1;return s.set(r.marker.type,n),{...r,label:r.marker.name??wo(r.marker,n)}})}function xo(e){const t=_e(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>Qe(a)).length}}function $t(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Ro(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function xe(e,t,a,s){return t<=0?s:s+e/t*(a-s*2)}function pa(e,t){const a=t/1e3,s=e.points;if(a<=s[0].kmMark)return s[0].elevation;for(let r=0;r<s.length-1;r+=1){const n=s[r],i=s[r+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),c=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*c}return s[s.length-1].elevation}function hn(e){const t=e.points.map(p=>p.elevation),a=Math.min(...t),s=Math.max(...t),r=Math.max(1,s-a),n=Math.max(40,r*.08),i=Math.max(0,a-n),o=s+n;let c=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=c&&(l=c+100),{axisMinElevation:c,axisMaxElevation:l}}function Ae(e,t,a,s,r,n){const i=Math.max(1,a-t);return s-n-(e-t)/i*(s-r-n)}function Nt(e){return`${Math.round(e)} m`}function sr(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function rr(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function bn(e,t,a,s,r,n,i,o,c){var h;const l=[],p=[];let m=null,u="#b91c1c";for(const f of _e(e)){const{marker:b,kmMark:y,elevation:$}=f;if(b.type==="climb_start"){p.push({kmMark:y,elevation:$,name:b.name});continue}if(Qe(b)){let F=-1;for(let w=p.length-1;w>=0;w-=1)if(b.name&&((h=p[w])==null?void 0:h.name)===b.name){F=w;break}const M=F>=0?p.splice(F,1)[0]:p.pop();M&&Math.max(0,y-M.kmMark),M&&Math.max(0,$-M.elevation);const x=rr(b.cat,b.type),T=sr(b.cat);if(b.type==="finish_hill"||b.type==="finish_mountain"){m=b.cat??null,u=x.accentColor;continue}l.push({x:xe(y*1e3,t,a,s),anchorY:Ae($,o,c,r,n,i),primaryLabel:T??"Berg",secondaryLabel:Nt($),distanceLabel:`${y.toFixed(1).replace(".",",")} km`,accentColor:x.accentColor});continue}if(b.type==="sprint_intermediate"){const F=rr(b.cat,b.type);l.push({x:xe(y*1e3,t,a,s),anchorY:Ae($,o,c,r,n,i),primaryLabel:"Sprint",secondaryLabel:Nt($),distanceLabel:`${y.toFixed(1).replace(".",",")} km`,accentColor:F.accentColor})}}const g=e.points[e.points.length-1];return l.push({x:xe(g.kmMark*1e3,t,a,s),anchorY:Ae(g.elevation,o,c,r,n,i),primaryLabel:m?`${sr(m)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:Nt(g.elevation),distanceLabel:`${g.kmMark.toFixed(1).replace(".",",")} km`,accentColor:u}),l.sort((f,b)=>f.x-b.x)}function Sn(e,t,a){const s=t+4,r=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${$t(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-detail">${$t(e.distanceLabel)}</text>
    </g>`}function vn(e,t){const a=new Set,s=t/1e3;for(let r=0;r<=s;r+=25)a.add(Math.round(r*1e3));return a.add(Math.round(t)),[...a].filter(r=>r>=0&&r<=t).sort((r,n)=>r-n)}function yn(e,t,a,s,r,n){const i=new Set(_e(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const c=xe(o,a,s,r),p=i.has(o)?18:12,m=n+p+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${c.toFixed(1)}" y1="${n.toFixed(1)}" x2="${c.toFixed(1)}" y2="${(n+p).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${c.toFixed(1)}" y="${m.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${$t(Ro(o))}</text>
      </g>`}).join("")}function Io(e,t,a,s,r,n,i,o,c,l,p){const m=xe(e.distanceMeter,a,s,n),u=pa(t,e.distanceMeter),g=Ae(u,c,l,r,i,o),h=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),f=e.riderCount>1?`<text x="${m.toFixed(1)}" y="${(g+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${m.toFixed(1)}" cy="${g.toFixed(1)}" r="${h.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${p?" race-sim-cluster-dot-selected":""}"></circle>
      ${f}
    </g>`}function Fo(e,t,a,s,r,n,i,o,c,l,p){const m=new Map(p.riders.map(g=>[g.id,g])),u=new Map((p.teams??[]).map(g=>[g.id,g.abbreviation]));return e.filter(g=>g.riderCount===1).map(g=>{const h=g.riderIds[0];if(h==null)return"";const f=m.get(h);if(!f)return"";const b=xe(g.distanceMeter,a,s,n),y=pa(t,g.distanceMeter),$=Ae(y,c,l,r,i,o),F=f.activeTeamId!=null?u.get(f.activeTeamId)??"":"",M=`${f.lastName} (${F})`,x=$-34,T=$-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${b.toFixed(1)}" y1="${($-5).toFixed(1)}" x2="${b.toFixed(1)}" y2="${x.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${b.toFixed(1)}" y="${T.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${$t(M)}</text>
        </g>`}).join("")}function Eo(e,t,a,s,r,n,i,o,c,l,p){const m=Math.max(0,Math.min(l,e.distanceKm)),u=Math.max(0,Math.min(p,e.distanceKm));if(u<=m)return null;const g=[{kmMark:m,elevation:pa(e,m*1e3)},...e.points.filter($=>$.kmMark>m&&$.kmMark<u),{kmMark:u,elevation:pa(e,u*1e3)}];if(g.length<2)return null;const h=r-i,f=g.map(($,F)=>{const M=xe($.kmMark*1e3,t,a,s),x=Ae($.elevation,o,c,r,n,i);return`${F===0?"M":"L"} ${M.toFixed(1)} ${x.toFixed(1)}`}).join(" "),b=xe(m*1e3,t,a,s),y=xe(u*1e3,t,a,s);return`${f} L ${y.toFixed(1)} ${h.toFixed(1)} L ${b.toFixed(1)} ${h.toFixed(1)} Z`}function Co(e,t,a,s,r={}){const p=e.distanceKm*1e3,{axisMinElevation:m,axisMaxElevation:u}=hn(e),g=533,h=12,b=e.points.map(w=>{const C=xe(w.kmMark*1e3,p,1584,28),E=Ae(w.elevation,m,u,634,168,101);return{x:C,y:E}}).map((w,C)=>`${C===0?"M":"L"} ${w.x.toFixed(1)} ${w.y.toFixed(1)}`).join(" "),y=`${b} L ${1556 .toFixed(1)} ${g.toFixed(1)} L ${28 .toFixed(1)} ${g.toFixed(1)} Z`,$=r.selectedClimbRange!=null?Eo(e,p,1584,28,634,168,101,m,u,r.selectedClimbRange.startKm,r.selectedClimbRange.endKm):null,F=bn(e,p,1584,28,634,168,101,m,u).map(w=>Sn(w,h,g)).join(""),x=Array.from({length:5},(w,C)=>m+(u-m)/4*C).map(w=>{const C=Ae(w,m,u,634,168,101);return`
      <line x1="28" y1="${C.toFixed(1)}" x2="1556" y2="${C.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${C.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${C.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(C+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Nt(w)}</text>`}).join(""),T=yn(vn(e,p),e,p,1584,28,g);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${$t(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
      <defs>
        <linearGradient id="dashboard-large-paper" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#fffdf7"></stop>
          <stop offset="100%" stop-color="#f8f1df"></stop>
        </linearGradient>
        <linearGradient id="dashboard-large-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#fbbf24"></stop>
          <stop offset="100%" stop-color="#f59e0b"></stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1584" height="634" fill="url(#dashboard-large-paper)"></rect>
      ${x}
      <line x1="28" y1="${g}" x2="1556" y2="${g}" class="race-sim-axis"></line>
      ${`<line x1="28" y1="168" x2="28" y2="${g}" class="race-sim-axis"></line>`}
      <path d="${y}" fill="url(#dashboard-large-area)"></path>
      ${$?`<path d="${$}" class="dashboard-stage-profile-climb-highlight"></path>`:""}
      <path d="${b}" class="race-sim-profile-line"></path>
      ${F}
      ${T}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function No(e,t,a,s,r){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${Co(t,a,s,!1,r)}</div>`}function Po(e,t,a,s,r,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,c=634,l=28,p=168,m=101,{axisMinElevation:u,axisMaxElevation:g}=hn(t),h=c-m,f=12,b=Array.from({length:5},(L,P)=>u+(g-u)/4*P),y=ys(a.clusters),$=ks(y),F=vn(t,a.stageDistanceMeters),x=t.points.map(L=>{const P=xe(L.kmMark*1e3,a.stageDistanceMeters,o,l),V=Ae(L.elevation,u,g,c,p,m);return{x:P,y:V}}).map((L,P)=>`${P===0?"M":"L"} ${L.x.toFixed(1)} ${L.y.toFixed(1)}`).join(" "),T=`${x} L ${(o-l).toFixed(1)} ${h.toFixed(1)} L ${l.toFixed(1)} ${h.toFixed(1)} Z`,w=bn(t,a.stageDistanceMeters,o,l,c,p,m,u,g).map(L=>Sn(L,f,h)).join(""),C=b.map(L=>{const P=Ae(L,u,g,c,p,m);return`
      <line x1="${l}" y1="${P.toFixed(1)}" x2="${o-l}" y2="${P.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${P.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${P.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(P+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Nt(L)}</text>`}).join(""),E=yn(F,t,a.stageDistanceMeters,o,l,h),A=new Map(y.map((L,P)=>[L,$[P]??null])),N=y.map(L=>{var P;return Io(L,t,a.stageDistanceMeters,o,c,l,p,m,u,g,((P=A.get(L))==null?void 0:P.label)===i)}).join(""),D=r.stage.profile==="ITT"?Fo(y,t,a.stageDistanceMeters,o,c,l,p,m,u,g,r):"";e.innerHTML=`
    <div class="race-sim-profile-layout${r.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${c}" role="img" aria-label="${$t(s)}">
          <defs>
            <linearGradient id="race-sim-paper" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#fffdf7"></stop>
              <stop offset="100%" stop-color="#f8f1df"></stop>
            </linearGradient>
            <linearGradient id="race-sim-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#fbbf24"></stop>
              <stop offset="100%" stop-color="#f59e0b"></stop>
            </linearGradient>
            <clipPath id="race-sim-profile-plot-clip">
              <rect x="${l}" y="0" width="${o-l*2}" height="${c}"></rect>
            </clipPath>
          </defs>
          <rect x="0" y="0" width="${o}" height="${c}" fill="url(#race-sim-paper)"></rect>
          ${C}
          <line x1="${l}" y1="${h}" x2="${o-l}" y2="${h}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${p}" x2="${l}" y2="${h}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${T}" fill="url(#race-sim-area)"></path>
            <path d="${x}" class="race-sim-profile-line"></path>
            ${w}
            ${N}
          </g>
          ${D}
          ${E}
          <text x="${l.toFixed(1)}" y="${(p-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const Lo={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},nr={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function ns(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function Fa(e,t){return`${e}:${t}`}function Ao(e){return new Map(e.map(t=>[Fa(t.simulationMode,t.terrain),t.weights]))}function Do(e){return new Map(e.map(t=>[Fa(t.simulationMode,t.terrain),t]))}function Bo(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function kn(e,t,a){const s=a.get(Fa(e,t));if(!s)return[{key:ns(t),weight:1}];const r=Object.entries(s).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return r.length>0?r:[{key:ns(t),weight:1}]}function _o(e,t,a,s){const r=kn(t,a,s),n=r.reduce((o,c)=>o+c.weight,0);return n<=0?e[ns(a)]:r.reduce((o,c)=>o+e[c.key]*c.weight,0)/n}function Go(e,t){const a=t.find(s=>s.simulationMode==="ttt"&&s.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??Lo[e]??1.05}function Ho(e,t,a){const s=a==null?void 0:a.get(Fa(e,t));return{lateMultiplier:(s==null?void 0:s.finalSpreadLateMultiplier)??nr[t].lateMultiplier,peakMultiplier:(s==null?void 0:s.finalSpreadPeakMultiplier)??nr[t].peakMultiplier}}const zo=.005,Ko=.005,$n=70,Tn=1e3,Mn=15,wn=360,xn=8,Rn=-.75,In=10;function lt(e,t){return e+Math.random()*(t-e)}function Fn(e,t,a){return Math.max(t,Math.min(a,e))}function Oo(e){return e==="ITT"||e==="TTT"}function En(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(s=>{var r,n,i;return s.id!==e.id&&s.activeTeamId===e.activeTeamId&&(((r=s.role)==null?void 0:r.name)==="Edelhelfer"||((n=s.role)==null?void 0:n.name)==="Starke Helfer"||((i=s.role)==null?void 0:i.name)==="Wassertraeger")}).map(s=>s.id)}function Cn(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function jo(e,t,a,s){const r=s==="crash"?Cn():null,n=Number(lt(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=Fn(n/Math.max(.1,a)*100,0,100),c=o<=$n;return{riderId:e.id,type:s,severity:r,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(s==="crash"?lt(10,60):lt(10,45)),recoverySeconds:c?Tn:wn,recoveryFormBonus:c?Mn:xn,dayFormPenalty:Rn,staminaPenalty:In,recoveryPenaltyStages:s==="crash"?r==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:s==="crash"&&r==="medium"?15:0,supportRiderIds:En(e,t)}}function Wo(e,t,a){if(Oo(t.profile)||a<=0)return[];const s=[];for(const r of e){const n=Math.random(),i=Math.random(),o=zo*Math.max(0,t.crashIncidentMultiplier??1),c=Ko*Math.max(0,t.mechanicalIncidentMultiplier??1),l=n<o,p=i<c;if(!l&&!p)continue;const m=l&&p?n<=i?"crash":"mechanical":l?"crash":"mechanical",u=jo(r,e,a,m);if(m==="crash"&&Math.random()<.01){u.isMassCrashTrigger=!0;const g=Math.floor(lt(2,26)),f=[...e.filter(b=>b.id!==r.id)].sort(()=>.5-Math.random());u.massCrashPotentialRiderIds=f.slice(0,g).map(b=>b.id),Math.random()<.2&&(u.hasAdditionalMechanical=!0,u.waitDurationSeconds+=Math.round(lt(10,45)))}s.push(u)}return s}function Vo(e,t,a,s){const r=Cn(),n=Math.round(a*1e3),i=Fn(a/Math.max(.1,s)*100,0,100),o=i<=$n;let c=Math.round(lt(10,60)),l=!1;return Math.random()<.2&&(l=!0,c+=Math.round(lt(10,45))),{riderId:e.id,type:"crash",severity:r,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:c,recoverySeconds:o?Tn:wn,recoveryFormBonus:o?Mn:xn,dayFormPenalty:Rn,staminaPenalty:In,recoveryPenaltyStages:r==="light"?[10,5,2]:[],raceRecuperationPenalty:r==="medium"?15:0,supportRiderIds:En(e,t),hasAdditionalMechanical:l}}function Nn(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function Pn(e){return Math.round(e*10)/10}function Ln(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function An(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function Dn(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function Uo(e,t){return e.skills.stamina*(t/300)}function Bn(e,t,a){return e.skills.timeTrial+Dn(e,t)+e.skills.mountain*(a/500)}function Yo(e,t,a,s){const r=Uo(e,a),n=Dn(e,s);switch(t.profile){case"Flat":return .8*e.skills.sprint+.2*e.skills.flat+n+r;case"Rolling":return .7*e.skills.sprint+.2*e.skills.flat+.1*e.skills.hill+n+r;case"Hilly":return .4*e.skills.sprint+.2*e.skills.flat+.4*e.skills.hill+n+r;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+r;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+r;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+r;case"High_Mountain":return e.skills.mountain+n+r;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+r;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+r;default:return .8*e.skills.sprint+.2*e.skills.flat+n+r}}function Zo(e,t,a,s,r){return t.profile==="ITT"||t.profile==="TTT"?Bn(e,r,s):Yo(e,t,a,r)}function qo(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:Pn(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function Xo(e,t,a,s){Ln(a,s);const r=An(a,s),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const p=o.get(l.activeTeamId)??[];p.push(l),o.set(l.activeTeamId,p)}return[...o.entries()].map(([l,p])=>{const m=n.get(l),g=p.map(y=>Bn(y,Nn(y.id,s==null?void 0:s.dailyFormByRiderId),r)).sort((y,$)=>$-y).slice(0,5),h=g.length,f=h>0?g.reduce((y,$)=>y+$,0)/h:0,b=Math.max(0,5-h)*2;return{team:m??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:f-b}}).sort((l,p)=>p.score-l.score||l.team.id-p.team.id).slice(0,20).map((l,p)=>({rank:p+1,kind:"team",effectiveSkill:Pn(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(s!=null?is(e,t,a,s):is(e,t,a)).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id).slice(0,20).map((o,c)=>qo(o,c+1))}function is(e,t,a,s){const r=Ln(a,s),n=An(a,s),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var c;return{rider:o,teamName:o.activeTeamId!=null?((c=i.get(o.activeTeamId))==null?void 0:c.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:Zo(o,a,r,n,Nn(o.id,s==null?void 0:s.dailyFormByRiderId))}}).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id)}function Jo(e,t){return e+Math.random()*(t-e)}function ir(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const s=Math.floor(Jo(0,a+1)),r=t[a];t[a]=t[s]??r,t[s]=r}return t}function Qo(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function el(e,t,a={}){if(e.length===0)return[];const s=e.map(g=>({...g,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),r=a.teams??Qo(s),n=is(s,r,t,a),i=new Set(n.slice(0,20).map(g=>g.rider.id)),o=Math.min(Math.ceil(s.length*.02),Math.max(0,s.length-i.size)),c=Math.min(Math.ceil(s.length*.01),s.length),l=ir(s.filter(g=>!i.has(g.id))),p=new Set(l.slice(0,o).map(g=>g.id)),m=ir(s.filter(g=>!p.has(g.id))),u=new Set(m.slice(0,c).map(g=>g.id));return s.map(g=>p.has(g.id)?{...g,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:u.has(g.id)?{...g,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:g)}function Wt(e,t){const a=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(s-a+1))+a}function or(e,t){return e+Math.random()*(t-e)}function tl(e,t,a){const s=[...e],r=[];for(;r.length<t&&s.length>0;){const n=s.reduce((l,p)=>l+Math.max(1e-4,a(p)),0);let i=Math.random()*n,o=0;for(let l=0;l<s.length;l+=1)if(i-=Math.max(1e-4,a(s[l])),i<=0){o=l;break}const[c]=s.splice(o,1);c&&r.push(c)}return r}function al(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function sl(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function rl(e,t,a){return new Set(e.map(s=>s.riderId).filter(s=>s!=null&&!t.has(s)).slice(0,a))}function nl(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function $s(e){var t;return nl((t=e.role)==null?void 0:t.name)}function il(e){return _e(e).some(({marker:t})=>Qe(t))}function ol(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function ll(e,t){const a=ol(e),s=e.hasSuperform===!0?40:1,r=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&$s(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*s*r*n*i;return{attackFactor:a,superformFactor:s,gcLeaderTeamFactor:r,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function cl(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function dl(e,t){var s,r;const a=((s=t[0])==null?void 0:s.riderId)??null;return a==null?null:((r=e.find(n=>n.id===a))==null?void 0:r.activeTeamId)??null}function ul(e,t,a){const s=new Map(t.map(n=>[n.id,n])),r=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=s.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||r.has(i.activeTeamId))&&(r.add(i.activeTeamId),r.size>=a))break}return r}function ml(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),$s(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function pl(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const s=t.stageNumber<=10,r=Math.max(1,Math.floor(a*(s?.01:.05))),n=Math.max(r,Math.floor(a*(s?.08:.2)));return{min:r,max:n}}function gl(e,t){return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?{min:.45,max:.75}:{min:.5,max:.85}}function fl(e,t,a,s,r,n,i){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||s.distanceKm<=0)return null;const o=e.length,{min:c,max:l}=pl(t,a,o),p=Wt(c,l),m=t.isStageRace&&a.stageNumber<=10,u=!t.isStageRace,g=dl(e,n),h=m?ul(r,e,5):new Set,f=m?ml(e):new Map,b=il(s),y=al(r,5),$=sl(n,10),F=new Set([...y,...$]),M=b?rl(i,F,5):new Set,x=cl(a),T=e.filter(R=>{if(R.activeTeamId==null||y.has(R.id)||$.has(R.id)||m&&g!=null&&R.activeTeamId===g||m&&h.has(R.activeTeamId))return!1;const I=$s(R);return!(u&&(I==="kapitaen"||I==="co-kapitaen")||m&&I==="kapitaen"||m&&I==="co-kapitaen"&&f.get(R.activeTeamId)!==!0||I==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(T.length===0)return null;const w=new Map(T.map(R=>[R.id,ll(R,{isEarlyStageRace:m,race:t,gcLeaderTeamId:g,stageHasMountainClassifications:b,topMountainIds:M,isHardStage:x})])),C=T.reduce((R,I)=>{var B;return R+(((B=w.get(I.id))==null?void 0:B.finalWeight)??0)},0),E=tl(T,Math.min(p,T.length),R=>{var I;return((I=w.get(R.id))==null?void 0:I.finalWeight)??1});if(E.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${E.length}/${p} ausgewählt aus ${T.length}`),console.log(`Gesamtgewicht im Pool: ${C.toFixed(2)}`),console.table(E.map(R=>{var B;const I=w.get(R.id);return{Fahrer:`${R.firstName} ${R.lastName}`,Team:R.activeTeamId,Rolle:((B=R.role)==null?void 0:B.name)??null,Atk:R.skills.attack,Hill:R.skills.hill,Chance:`${((C>0&&I!=null?I.finalWeight/C:0)*100).toFixed(2)}%`,Gewicht:((I==null?void 0:I.finalWeight)??1).toFixed(2),Attacke:`x${((I==null?void 0:I.attackFactor)??1).toFixed(2)}`,Superform:`x${(I==null?void 0:I.superformFactor)??1}`,GC_Team:`x${((I==null?void 0:I.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(I==null?void 0:I.mountainFactor)??1}`,Sprinter:`x${(I==null?void 0:I.sprinterFactor)??1}`}})),console.groupEnd();const A=s.distanceKm*1e3,N=Wt(0,Math.min(1e4,Math.max(0,Math.floor(A*.1)))),D=gl(t,a),L=Math.round(A*or(D.min,D.max)),P=Math.round(A*or(.1,.25)),V=Math.max(N+1e3,Math.min(L-1e3,L-P)),J=Wt(3,8);return{riderIds:E.map(R=>R.id),triggerDistanceMeters:N,groupPhaseEndDistanceMeters:V,phaseEndDistanceMeters:L,skillBonus:J,malusValue:Wt(5,8)}}const hl=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),bl=3,Sl=7,lr=120,cr=200,dr=180,vl=10,Vt=8e3;function ct(e,t,a=Math.random()){const s=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(a*(r-s+1))+s}function yl(e){for(let t=e.length-1;t>0;t-=1){const a=ct(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function ga(e,t){return t<=0||e.length===0?[]:yl([...e]).slice(0,Math.min(t,e.length))}function kl(e,t,a){if(t<=0||e.length===0)return[];const s=[...e],r=[];for(;s.length>0&&r.length<t;){const n=s.reduce((c,l)=>c+Math.max(0,a(l)),0);if(n<=0){r.push(...ga(s,t-r.length));break}let i=Math.random()*n,o=s.length-1;for(let c=0;c<s.length;c+=1)if(i-=Math.max(0,a(s[c])),i<=0){o=c;break}r.push(s[o]),s.splice(o,1)}return r}function $l(e){return hl.has(e.profile)}function Tl(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function Ml(e,t){if(!$l(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(s=>{if(!Tl(s))return[];const r=s.start_km*1e3,n=s.end_km*1e3,i=Math.max(r,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:r,sourceSegmentEndMeters:n}]})}function ur(e,t){const a=t==null?e:e.filter(c=>{const l=Math.min(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t)),p=Math.max(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t));return l>=Vt||p>=Vt});if(a.length===0)return null;const s=a[ct(0,a.length-1)];if(!s)return null;const r=Math.ceil(s.startMeters),n=Math.floor(s.endMeters);if(n<=r)return null;let i=0;for(;i<12;){const c=ct(r,n);if(t==null||Math.abs(c-t)>=Vt)return{triggerDistanceMeters:c,sourceSegmentStartMeters:s.sourceSegmentStartMeters,sourceSegmentEndMeters:s.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<s.startMeters?n:r;return t==null||Math.abs(o-t)>=Vt?{triggerDistanceMeters:o,sourceSegmentStartMeters:s.sourceSegmentStartMeters,sourceSegmentEndMeters:s.sourceSegmentEndMeters}:null}function wl(e,t,a,s=()=>1){const r=e.slice(0,15),n=Ml(t,a);if(r.length===0||n.length===0)return[];const i=ct(bl,Math.min(Sl,r.length)),o=kl(r,i,s),c=[];for(const u of o){const g=ur(n);g&&c.push({riderId:u.id,attackNumber:1,triggerDistanceMeters:g.triggerDistanceMeters,durationSeconds:ct(lr,cr),sourceSegmentStartMeters:g.sourceSegmentStartMeters,sourceSegmentEndMeters:g.sourceSegmentEndMeters,isCounterAttack:!1})}if(c.length===0)return[];const l=c.map(u=>u.riderId),p=Math.floor(l.length*.5),m=new Set(ga(l,p));for(const u of[...c]){if(!m.has(u.riderId))continue;const g=ur(n,u.triggerDistanceMeters);g&&c.push({riderId:u.riderId,attackNumber:2,triggerDistanceMeters:g.triggerDistanceMeters,durationSeconds:ct(lr,cr),sourceSegmentStartMeters:g.sourceSegmentStartMeters,sourceSegmentEndMeters:g.sourceSegmentEndMeters,isCounterAttack:!1})}return c.sort((u,g)=>u.triggerDistanceMeters-g.triggerDistanceMeters||u.riderId-g.riderId||u.attackNumber-g.attackNumber)}function xl(e,t,a){var c;if(e.length===0)return[];const s=((c=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:c.teamId)??null,r=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||s!=null&&l.teamId===s));if(r.length===0)return[];const n=new Map;for(const l of r){const p=n.get(l.teamId)??[];p.push(l),n.set(l.teamId,p)}const i=[...n.values()].map(l=>ga(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(ct(0,3),i.length);return ga(i,o).map(l=>l.riderId)}function Rl(e,t){const a=[],s=[];for(const[r,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){s.push(r);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:s}}const Il={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},Fl={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},El={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},Cl={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},Nl={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function Pl(e){const t=new Map;for(const a of e){const s=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",s);else if(a.appliesTo==="climb_top"){const r=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${r}`,s)}else a.appliesTo==="finish"&&t.set(a.markerType,s)}return t}const Ut=20,Ll=120,Al=300,Ha=.025,Dl=.1,Bl=.4,_l=.6,Gl=.8,fa=1,mr=2/3,Hl=.1,Yt=10,pr=50,zl=25,Kl=7,Ol=500,jl=100,Wl=.02,Vl=.04,Ul=.009,Yl=120,Zl=150,ql=100,Xl=300,gr=50,za=85,at=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],fr=5*60,Jl=60,Ql=.5,ec=.3,Zt=5e3,tc=2e3,ac=1,sc=2,rc=.05,_n={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},nc={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},qt=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function re(e,t,a){return Math.max(t,Math.min(a,e))}function ie(e,t){return e+Math.random()*(t-e)}function hr(e){return e[Math.floor(Math.random()*e.length)]}function St(e){return Math.round(e*100)/100}function ic(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function br(e){if(e<2)return 1;const t=re(e,2,20),a=qt[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let s=1;s<qt.length;s+=1){const r=qt[s-1],n=qt[s];if(t>n.gradientPercent)continue;const i=(t-r.gradientPercent)/Math.max(1e-4,n.gradientPercent-r.gradientPercent),o=r.draftPenaltyShare+(n.draftPenaltyShare-r.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function oc(e){return e==="Flat"?Yl:e==="Abfahrt"?Zl:Number.POSITIVE_INFINITY}function lc(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function ha(e){return(e.formBonus??0)+(e.raceFormBonus??0)-(e.fatigueMalus??0)-(e.longTermFatigueMalus??0)-(e.shortTermFatigueMalus??0)}function cc(e,t){if(t.length===0)return"";const a=t.reduce((p,m)=>p+m.weight,0),s=t.map(p=>{const m=e.skills[p.key],u=Math.round(p.weight/a*100);return`${_n[p.key]} ${Math.round(m)} (${u}%)`}),r=e.formBonus??0,n=e.raceFormBonus??0,i=e.fatigueMalus??0,o=e.longTermFatigueMalus??0,c=e.shortTermFatigueMalus??0;s.push(`S-Form ${r>=0?"+":""}${r.toFixed(1).replace(".",",")}`),s.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&s.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&s.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),c>0&&s.push(`Akut -${c.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const p of t)l+=(e.mentorBoosts[p.key]||0)*(p.weight/a);return l>0&&s.push(`Mentor +${l.toFixed(1).replace(".",",")}`),s.join(" • ")}function dc(){const e=Math.random();return e<.9?ie(5,20):e<.98?ie(20,40):ie(40,70)}function Sr(){const e=Math.random();return e<.9?St(ie(-1,1)):e<.995?St(hr([-1,1])*ie(1,2)):St(hr([-1,1])*ie(3,4))}function uc(){return St(ie(-3,3))}function mc(e){const t=[];let a=0,s=dc(),r=ie(-1,1);for(;a<e;){const n=Math.min(e-a,ie(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:s,vector:r}),a+=n,a>=e)break;s=re(s+(Math.random()<.5?-1:1)*ie(2,10),5,70),r=re(r+(Math.random()<.5?-1:1)*ie(0,.5),-1,1)}return t}function Gn(e,t){const a=Z(e),s=Z(t);if(a!==s)return a?1:-1;const r=de(e),n=de(t);return r&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:r?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function Z(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function de(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function wt(e,t,a=!1,s=null){var c;const r="rider"in e?e.rider:null,n=(r==null?void 0:r.specialization1)??null,i=(r==null?void 0:r.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(c=r==null?void 0:r.role)==null?void 0:c.name;s==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function pc(e,t,a=null,s=null,r=!1){var g,h;const n=f=>f.photoFinishScore;if(!t){const f=[...e].sort((y,$)=>y.crossingTimeSeconds-$.crossingTimeSeconds||$.photoFinishScore-y.photoFinishScore||y.riderId-$.riderId),b=((g=f[0])==null?void 0:g.crossingTimeSeconds)??0;return f.map((y,$)=>({riderId:y.riderId,rank:$+1,crossingTimeSeconds:y.crossingTimeSeconds,gapSeconds:Math.max(0,y.crossingTimeSeconds-b),photoFinishScore:y.photoFinishScore}))}const i=[...e].sort((f,b)=>f.crossingTimeSeconds-b.crossingTimeSeconds||b.photoFinishScore-f.photoFinishScore||f.riderId-b.riderId),o=((h=i[0])==null?void 0:h.crossingTimeSeconds)??0,c=[];let l=[],p=0,m=null;const u=()=>{const f=Math.max(0,p-o),b=l.sort((y,$)=>n($)-n(y)||y.riderId-$.riderId);for(const y of b)c.push({riderId:y.riderId,rank:c.length+1,crossingTimeSeconds:y.crossingTimeSeconds,gapSeconds:f,photoFinishScore:y.photoFinishScore})};for(const f of i){if(l.length===0){l=[f],p=f.crossingTimeSeconds,m=f.crossingTimeSeconds;continue}if(m!=null&&f.crossingTimeSeconds-m<=fa){l.push(f),m=f.crossingTimeSeconds;continue}u(),l=[f],p=f.crossingTimeSeconds,m=f.crossingTimeSeconds}return l.length>0&&u(),c}function gc(e,t,a){const s=e.filter(de).sort((m,u)=>(m.finishTimeSeconds??0)-(u.finishTimeSeconds??0)||u.photoFinishScore-m.photoFinishScore||m.rider.id-u.rider.id),r=e.filter(m=>!Z(m)).sort(Gn),n=e.filter(m=>m.finishStatus==="dnf").sort((m,u)=>u.distanceCoveredMeters-m.distanceCoveredMeters||m.rider.id-u.rider.id),i=[];let o=[],c=null;const l=m=>m.photoFinishScore,p=()=>{i.push(...o.sort((m,u)=>l(u)-l(m)||m.rider.id-u.rider.id))};for(const m of s){const u=m.finishTimeSeconds??0;if(o.length===0){o=[m],c=u;continue}if(c!=null&&u-c<=fa){o.push(m),c=u;continue}p(),o=[m],c=u}return o.length>0&&p(),[...i,...r,...n]}function fc(e,t){const a=Z(e),s=Z(t);if(a!==s)return a?1:-1;const r=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(r)>=.1?r:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:de(e)&&de(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:de(e)?-1:de(t)?1:e.rider.id-t.rider.id}function vr(e){const t=re(e,1,pr);return t<=2?.12*t:t<=Yt?.24+(t-2)/Math.max(1,Yt-2)*.58:.82+(t-Yt)/Math.max(1,pr-Yt)*.18}function Ka(e,t){const a=ha(e.rider);return Object.entries(t).reduce((s,[r,n])=>{if(!n)return s;const i=r==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[r]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return s+o*n},0)}function hc(e,t){const a=ha(e.rider);return Object.entries(t).filter(s=>!!s[1]).map(([s,r])=>{const n=s,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:r,effectiveSkill:o,contribution:o*r}})}function bc(e,t,a){let s=t;for(;s>0;){const n=e[s-1].distanceCoveredMeters-e[s].distanceCoveredMeters;if(n<=0||n>=a)break;s-=1}let r=t;for(;r<e.length-1;){const n=e[r].distanceCoveredMeters-e[r+1].distanceCoveredMeters;if(n<=0||n>=a)break;r+=1}return{startIndex:s,endIndex:r,size:r-s+1,positionInGroup:t-s}}function Sc(e,t){if(e<zl)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class Hn{constructor(t,a){var M,x;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.hasLoggedFinishSprintTieBreak=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const s=(M=t.race.country)==null?void 0:M.code3;s&&(t.riders=t.riders.map(T=>{var C;const w=T.nationality||((C=T.country)==null?void 0:C.code3);if(w&&w.trim().toUpperCase()===s.trim().toUpperCase()){const E={...T,skills:{...T.skills}},A=Math.random(),N=t.stage.profile,D=N==="ITT"||N==="TTT",L=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(N==="Cobble"||N==="Cobble_Hill")&&L.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(N)||L.push("mountain","mediumMountain");const R=[...(I=>{const B=[...L],_=[];if(D){_.push("timeTrial");const U=Math.min(I-1,B.length);for(let j=0;j<U;j++){const Q=Math.floor(Math.random()*B.length);_.push(B.splice(Q,1)[0])}}else{const U=Math.min(I,B.length);for(let j=0;j<U;j++){const Q=Math.floor(Math.random()*B.length);_.push(B.splice(Q,1)[0])}}return _})(5)].sort(()=>Math.random()-.5);if(E.homeEffectSkills=R,A<.05){E.homeEffect="home_pressure";for(const I of R)E.skills[I]=Math.max(0,E.skills[I]-.5)}else if(A<.1){E.homeEffect="super_home";const I=R[0];E.skills[I]=Math.min(100,E.skills[I]+3);for(let B=1;B<5;B++){const _=R[B];E.skills[_]=Math.min(100,E.skills[_]+1)}}else{E.homeEffect="normal_home";for(const I of R)E.skills[I]=Math.min(100,E.skills[I]+1)}return E}return T})),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=Bo(t.stage.profile),this.skillWeightRuleMap=Ao(t.skillWeightRules??[]),this.skillWeightConfigMap=Do(t.skillWeightRules??[]),this.stageScoringWeightMap=Pl(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=mc(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const r=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=r!=null?re(r/100,0,1):ie(_l,Gl);const n=t.stage.finalPushStartPercent;this.finalPushStartRatio=n!=null?re(n/100,this.lateStageStartRatio,1):re(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const i=Wo(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(i.map(T=>[T.riderId,T])),i.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",i.map(w=>({riderId:w.riderId,type:w.type,severity:w.severity,kmMark:w.triggerDistanceKm,waitDurationSeconds:w.waitDurationSeconds,supportRiderIds:w.supportRiderIds})));const T=i.filter(w=>w.isMassCrashTrigger);T.length>0&&T.forEach(w=>{var C;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${w.riderId} bei Km ${w.triggerDistanceKm}. Potenziell betroffene Fahrer (${(C=w.massCrashPotentialRiderIds)==null?void 0:C.length}):`,w.massCrashPotentialRiderIds)})}const o=t.riders.map(T=>{const w={rider:T,riderName:`${T.firstName} ${T.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:uc(),microForm:Sr(),nextFormUpdateMeter:ie(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(T.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(w),w}),c=new Map(o.map(T=>[T.rider.id,T.dailyForm]));this.stageFavorites=Xo(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:c});const l=this.stageFavorites.filter(T=>T.kind==="rider"&&T.riderId!=null).slice(0,15).map(T=>t.riders.find(w=>w.id===T.riderId)??null).filter(T=>T!=null),p=((x=t.gcStandings.find(T=>T.rank===1))==null?void 0:x.riderId)??null,m=wl(l,t.stage,t.stageSummary,T=>Math.max(1,Math.pow(10,(T.skills.attack-65)/10))*(T.id===p?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const T of m){const w=this.precalculatedStageAttacksByRiderId.get(T.riderId)??[];w.push(T),this.precalculatedStageAttacksByRiderId.set(T.riderId,w)}this.breakawayPlan=fl(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings);const u=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=u.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=u.fallbackCheckpointsMeters;for(const T of o)T.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const g=el(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:c}),h=new Map(g.map(T=>[T.id,T])),f=o.map(T=>{const w=h.get(T.rider.id)??T.rider;return{...T,rider:w,riderName:`${w.firstName} ${w.lastName}`,dailyForm:T.dailyForm+(w.specialFormDelta??0)}}),b=g.filter(T=>T.hasSuperform),y=g.filter(T=>T.hasSupermalus);(b.length>0||y.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:b.map(T=>`${T.firstName} ${T.lastName}`),supermalus:y.map(T=>`${T.firstName} ${T.lastName}`)});const $=this.resolveStartOrder(f),F=new Map((this.bootstrap.teamStartOrder??[]).map((T,w)=>[T,w]));this.riders=$.map((T,w)=>({...T,startOffsetSeconds:this.resolveStartOffsetSeconds(T,w,F)})),this.riders.forEach(T=>this.syncRiderTelemetry(T));for(const T of this.riders){const w=T.rider.homeEffectSkills,C=E=>nc[E]||E;if(T.rider.homeEffect==="super_home"){const E=w&&w.length===5?`${C(w[0])} (+3), ${C(w[1])} (+1), ${C(w[2])} (+1), ${C(w[3])} (+1), ${C(w[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${E})`})}if(T.rider.homeEffect==="home_pressure"){const E=w?w.map(C).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${E})`})}if(T.rider.homeEffect==="normal_home"){const E=w?w.map(C).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${E})`})}T.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),T.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),T.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const s=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(s),a-=s}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(s=>({riderId:s.rider.id,riderName:s.riderName,startOffsetSeconds:s.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(s),hasStarted:s.hasStarted||Z(s),distanceCoveredMeters:s.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-s.distanceCoveredMeters),segmentStartKm:s.segmentStartKm,segmentEndKm:s.segmentEndKm,segmentStartElevation:s.segmentStartElevation,segmentEndElevation:s.segmentEndElevation,activeTerrain:de(s)?"Finish":s.activeTerrain,skillName:de(s)?"Finish":s.skillName,skillBreakdown:de(s)?"":s.skillBreakdown,baseSkill:s.baseSkill,teamGroupBonus:s.teamGroupBonus,effectiveSkill:s.effectiveSkill,staminaPenalty:s.staminaPenalty,elevationPenalty:s.elevationPenalty,dailyForm:s.dailyForm,microForm:s.microForm,gradientPercent:s.gradientPercent,gradientModifier:s.gradientModifier,windModifier:s.windModifier,draftModifier:s.draftModifier,draftNearbyRiderCount:s.draftNearbyRiderCount,draftPackFactor:s.draftPackFactor,currentSpeedMps:s.currentSpeedMps,photoFinishScore:s.photoFinishScore,leadoutBonus:s.leadoutBonus,leadoutRiderId:s.leadoutRiderId,lastSplitLabel:s.lastSplitLabel,lastSplitTimeSeconds:s.lastSplitTimeSeconds,splitTimes:{...s.splitTimes},finishTimeSeconds:Number.isFinite(s.finishTimeSeconds??Number.NaN)?s.finishTimeSeconds:null,finishStatus:s.finishStatus,statusReason:s.statusReason,isAttacking:s.isAttacking,isBreakaway:s.isBreakaway,isLeadingGroup:s.isLeadingGroup,hasSuperform:s.rider.hasSuperform===!0,hasSupermalus:s.rider.hasSupermalus===!0,isFinished:de(s)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(s=>s.appliedIncident?[s.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus}}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let s=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(s=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(s==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,c)=>Math.max(o,c.distanceCoveredMeters),0);s=Number((i/1e3).toFixed(2))}const r={id:this.nextMessageId,...t,riderTeamId:a,kmMark:s};this.messages.unshift(r),this.allEvents.push(r),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(s=>[s.rider.id,s]));return this.intermediateMarkers.map(s=>{const r=t.map(i=>i.markerCrossings[s.key]??null).filter(i=>i!=null),n=pc(r,!this.isTimeTrialMode,s.markerType,a,this.isClimberMalusStage());return{markerKey:s.key,markerLabel:s.label,markerType:s.markerType,markerCategory:s.markerCategory,kmMark:s.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isTimeTrialMode?[...this.riders].sort(Gn):gc(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(r=>r.finishStatus!=="dnf").reduce((r,n)=>Math.max(r,n.distanceCoveredMeters),0);let s=0;for(const r of t)de(r)&&(s+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:s,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(Z)}advanceSubstep(t){const a=this.elapsedSeconds,s=a+t,r=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();this.updateBreakawayPhaseState();for(const l of this.riders){if(Z(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&s<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,s-p);if(m<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-m),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const u=this.currentSegment(l),g=this.currentWindZone(l);if(!u||!g){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=p,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const f=wt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage()),b=this.calculateSprintLeadoutBonus(l);l.photoFinishScore+=f+b,l.leadoutBonus=b;continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,r);const h=this.calculateBasePhysics(l,u,g);l.activeTerrain=u.terrain,l.skillName=h.skillName,l.skillBreakdown=h.skillBreakdown,l.baseSkill=h.baseSkill,l.teamGroupBonus=h.teamGroupBonus,l.effectiveSkill=h.effectiveSkill,l.staminaPenalty=h.staminaPenalty,l.elevationPenalty=h.elevationPenalty,l.gradientPercent=h.gradientPercent,l.gradientModifier=h.gradientModifier,l.windModifier=h.windModifier,l.tempSpeedMps=h.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=h.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*m}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,s);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const p of this.riders)l.push(p);l.sort(fc);for(let p=0;p<l.length;p+=1){const m=l[p];if(Z(m))continue;const u=this.isActiveBreakawayRider(m),g=m.tempSpeedMps/14,h=Math.max(5,50*g),f=this.currentSegment(m),b=Math.max(15,150*g),y=Math.max(h,Math.min(b,oc(f==null?void 0:f.terrain))),$=bc(l,p,y),F=$.size,M=vr(F),x=Sc(F,$.positionInGroup);let T=0,w=Number.POSITIVE_INFINITY,C=null;for(let Q=p-1;Q>=0;Q-=1){const Me=l[Q],be=Me.distanceCoveredMeters-m.distanceCoveredMeters;if(be>=y+Hl)break;!this.canReceiveDraftFromCandidate(m,Me)||this.isActiveBreakawayRider(Me)||be<=0||be>=y||(T+=1,be<=w&&(w=be,C=Me))}if(T===0||!C){if(u)continue;m.draftModifier=1,m.draftNearbyRiderCount=0,m.draftPackFactor=0,m.currentSpeedMps=m.tempSpeedMps,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,m.isLeadingGroup=!0,this.applyCaptainWaitLogic(m);continue}const E=Z(C)?C.tempSpeedMps:C.currentSpeedMps,A=w,N=A<=h?1:1-(A-h)/Math.max(1e-4,y-h),D=this.currentWindZone(m),L=(D==null?void 0:D.vector)??0,P=(D==null?void 0:D.windSpeedKph)??0,V=-L*(P/70),R=Math.max(.3,.35+.35*V)*Math.min(1,g)*mr,I=re((f==null?void 0:f.gradient_percent)??0,-20,20),B=br(I),U=1+(x?0:R*N*M*B),j=m.tempSpeedMps*U;if(!(u&&U<=m.draftModifier)){if(m.draftModifier=U,m.draftNearbyRiderCount=F,m.draftPackFactor=M,m.isLeadingGroup=x,j>E){if(m.tempSpeedMps>C.tempSpeedMps){m.currentSpeedMps=j,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t;continue}if(A<1){m.currentSpeedMps=E,m.nextDistanceCoveredMeters=C.distanceCoveredMeters+E*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=Math.min(j,E+2),m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=j,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(Z(l)||this.isTimeTrialMode&&s<=l.startOffsetSeconds)continue;const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,s-p);if(m<=0)continue;const u=l.distanceCoveredMeters,g=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*m,h=l.pendingIncident;if(h&&u<h.triggerDistanceMeters&&g>=h.triggerDistanceMeters){const y=Math.max(.1,l.currentSpeedMps),$=Math.max(0,(h.triggerDistanceMeters-u)/y);l.distanceCoveredMeters=h.triggerDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.applyIncident(l,h,p+$),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const f=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,g-l.distanceCoveredMeters)>=f){const y=f/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),l.finishTimeSeconds=p+y,l.currentSpeedMps=0;const $=wt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage()),F=this.calculateSprintLeadoutBonus(l);l.photoFinishScore+=$+F,l.leadoutBonus=F}else l.distanceCoveredMeters=g,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,u,l.distanceCoveredMeters,p),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-m),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!Z(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=Sr(),l.nextFormUpdateMeter+=ie(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),p=this.riders.filter(u=>l.has(u.rider.id)&&!Z(u)),m=this.riders.filter(u=>!l.has(u.rider.id)&&!Z(u));if(p.length>0&&m.length>0){const u=p.reduce((h,f)=>f.distanceCoveredMeters>h.distanceCoveredMeters?f:h,p[0]);m.reduce((h,f)=>f.distanceCoveredMeters>h.distanceCoveredMeters?f:h,m[0]).distanceCoveredMeters>=u.distanceCoveredMeters&&(u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:u.rider.id,riderName:u.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${u.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const c=Rl(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of c.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!Z(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const s=new Map;for(const r of this.riders){if(Z(r)||r.rider.activeTeamId==null||a<=r.startOffsetSeconds)continue;const n=s.get(r.rider.activeTeamId)??[];n.push(r),s.set(r.rider.activeTeamId,n)}for(const r of s.values()){const n=r[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,r.length),c=[...r].sort((u,g)=>g.effectiveSkill-u.effectiveSkill||u.rider.id-g.rider.id).slice(0,o).reduce((u,g)=>u+g.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-r.length),p=Math.max(1,c-l),m=this.resolveTimeTrialSpeedMps(p,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*Go(i.terrain,this.bootstrap.skillWeightRules??[]);for(const u of r){const g=Math.max(t,u.startOffsetSeconds),h=Math.max(0,a-g);u.currentSpeedMps=m,u.tempSpeedMps=m,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+m*h}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const r=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?r.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,c=i.rider.activeTeamId!=null?r.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==c?o-c:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(r=>[r.riderId,r.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((r,n)=>{const i=a.get(r.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(r)-this.resolveProjectedIttStartScore(n)||r.rider.id-n.rider.id}):[...t].sort((r,n)=>r.rider.skills.timeTrial-n.rider.skills.timeTrial||r.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,s=0;for(const r of this.bootstrap.stageSummary.segments){const n=(r.start_km+r.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,r.terrain),c=i>0?this.resolveWeightedSkill(t.rider,r.terrain,i):o,l=Math.max(0,o.value-c.value),{effectiveSkill:p}=this.resolveEffectiveSkill({rider:t,baseSkill:c.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),m=re(r.gradient_percent,-20,20),u=m>0?Math.exp(-.11*m):1-m*.06,g=this.windZones.find(f=>n>=f.startMeter&&n<=f.endMeter)??this.windZones[this.windZones.length-1],h=g?1+g.vector*(g.windSpeedKph/100)*.52:1;a+=p*u*h*r.length_km,s+=r.length_km}return s>0?a/s:0}resolveStartOffsetSeconds(t,a,s){if(this.isIndividualTimeTrial)return a*Ll;if(this.isTeamTimeTrial){const r=t.rider.activeTeamId;return(r!=null?s.get(r)??0:0)*Al}return 0}buildIntermediateMarkers(){return _e(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||Qe(t)).map(({key:t,label:a,marker:s,kmMark:r})=>({key:t,distanceMeters:r*1e3,label:a,markerType:s.type,markerCategory:s.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(c=>c.distanceMeters<t.groupPhaseEndDistanceMeters),s=this.stageDistanceMeters*ec,r=a.some(c=>c.distanceMeters<=s);if(!(a.length<=1||!r))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(Zt,Math.ceil(s/Zt)*Zt);for(let c=o;c<t.groupPhaseEndDistanceMeters;c+=Zt)i.push(c);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,s){const r=lc(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,c=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),p=Math.min(85,o.value)+l,m=this.isTimeTrialMode?0:t.teamGroupBonus,u=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:g,staminaPenalty:h,elevationPenalty:f}=this.resolveEffectiveSkill({rider:t,baseSkill:p,staminaPenalty:c,teamGroupBonus:m,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:u}),b=re(a.gradient_percent,-20,20),y=b>0?Math.exp(-.11*b):1-b*.06,$=1+s.vector*(s.windSpeedKph/100)*.52,F=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:r,skillBreakdown:o.breakdown,baseSkill:p,teamGroupBonus:m,effectiveSkill:g,staminaPenalty:h,elevationPenalty:f,gradientPercent:b,gradientModifier:y,windModifier:$,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(g,t.distanceCoveredMeters,a,y,$):this.resolveRoadStageSpeedMps(g,t.distanceCoveredMeters,a,y,$,F)}}resolveRoadStageSpeedMps(t,a,s,r,n,i){const o=this.resolveSkillSpreadFactor(a,s),c=this.resolveSegmentElevation(s,a),l=this.resolveElevationSkillSpreadFactor(s,c),u=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,u*r*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const s=Math.max(0,a-Ol),r=Math.floor(s/jl);return t.terrain==="Mountain"?1+(r*Vl+r*Math.max(0,r-1)*Ul/2):1+r*Wl}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.14:t==="Abfahrt"||t==="Downhill"?.18:t==="Cobble"?15/35:t==="Cobble_Hill"?20/35:10/35}resolveBreakawayReferenceSkill(t,a){const s=a.filter(n=>n.activeTerrain===t.activeTerrain);return(s.length>0?s:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,s){if(s<=1)return{draftModifier:1,draftPackFactor:0};const r=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,c=-i*(o/70),p=Math.max(.3,.35+.35*c)*Math.min(1,r)*mr,m=re(a.gradient_percent,-20,20),u=br(m),g=vr(s);return{draftModifier:1+p*g*u,draftPackFactor:g}}resolveBreakawayTimeGapPenalty(t){if(t<fr)return 0;const a=Math.floor((t-fr)/Jl);return Ql+a}recordBreakawayFallbackCheckpointCrossings(t,a,s,r,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>s)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const c=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?r+c-t.startOffsetSeconds:r+c);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let r=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((c,l)=>l.distanceCoveredMeters-c.distanceCoveredMeters||l.currentSpeedMps-c.currentSpeedMps||c.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,r;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const c=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!c)break;const l=n.markerCrossings[c.key]??null;if(!l)break;const p=t.map(m=>m.markerCrossings[c.key]??null).filter(m=>m!=null).sort((m,u)=>m.crossingTimeSeconds-u.crossingTimeSeconds||m.riderId-u.riderId)[0]??null;if(p){const m=l.crossingTimeSeconds-p.crossingTimeSeconds;r=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:r,kmMark:c.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const c=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[c]??null;if(l==null)break;const p=t.map(m=>m.breakawayFallbackCheckpointTimes[c]??null).filter(m=>m!=null).sort((m,u)=>m-u)[0]??null;if(p!=null){const m=l-p;r=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:r,kmMark:c<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[c]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return r}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),s=this.riders.filter(o=>!Z(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),r=this.riders.filter(o=>!Z(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(s.length===0||r.length===0){this.breakawayGapStatus=null;return}const n=[...s].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null,i=[...r].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const c=this.intermediateMarkers[o];if(!c)continue;const l=n.markerCrossings[c.key]??null,p=i.markerCrossings[c.key]??null;if(!l||!p)continue;const m=p.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:c.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const c=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(c==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,p=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||p==null)continue;const m=p-l;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:c/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const s=new Set(a.riderIds),r=this.riders.filter(o=>!Z(o)&&s.has(o.rider.id));if(r.length===0)return;const n=this.riders.filter(o=>!Z(o)&&!s.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(r,n);for(const o of r)o.breakawayGapPenalty=i;for(const o of r){const c=this.currentSegment(o);if(!c)continue;const p=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=p,o.tempSpeedMps=this.resolveRoadStageSpeedMps(p,o.distanceCoveredMeters,c,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(c.terrain));const m=this.resolveMaxBreakawayDraftModifier(o,c,r.length);o.draftModifier=m.draftModifier,o.draftNearbyRiderCount=Math.max(0,r.length-1),o.draftPackFactor=m.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*m.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,s,r,n){return this.resolveRoadStageSpeedMps(t,a,s,r,n,.5)}syncRiderTelemetry(t,a=null){var i;const s=this.currentSegment(t),r=this.currentWindZone(t);if(Z(t)||!s||!r){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,s,r);t.segmentStartKm=s.start_km,t.segmentEndKm=s.end_km,t.segmentStartElevation=s.start_elevation,t.segmentEndElevation=s.end_elevation,t.activeTerrain=s.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),s=this.riders.reduce((n,i)=>Z(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(s<=t.phaseEndDistanceMeters)return!1;let r=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(s<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<rc){n.breakawayMalus=0,r=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),c=Math.floor(o/tc),l=Math.min(sc,n.breakawayInitialMalus),p=Math.max(l,n.breakawayInitialMalus-c*ac),m=St(p);m!==n.breakawayMalus&&(n.breakawayMalus=m,r=!0)}return r}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const s=new Set(a.riderIds);for(const r of this.riders)Z(r)||!s.has(r.rider.id)||this.syncRiderTelemetry(r,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(r=>t.riderIds.includes(r.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const r of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:r.rider.id,riderName:r.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(r.rider.id,r.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let s=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const r of a)r.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),s=!0}if(this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const r of a)r.breakawayMalus=t.malusValue,r.breakawayInitialMalus=t.malusValue,r.breakawayRecoveryStartDistanceMeters=null,r.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return s}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const s=this.riders.filter(o=>!Z(o)&&a.riderIds.includes(o.rider.id));if(s.length===0)return;const r=[...s].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0];if(!r)return;const n=Math.max(.1,r.currentSpeedMps),i=r.distanceCoveredMeters+n*t;for(const o of s){if(Math.max(0,r.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?vl:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const s=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(s==null||s.isCounterAttack)return!0;const r=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(r==null?void 0:r.isCounterAttack)===!0&&r.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(s=>s.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const s=this.resolvePreStageGcRank(t);return s!=null?`${a} (${s}.)`:a}triggerStageAttacksForRider(t,a,s,r){if(Z(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||s<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(s/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const c=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/c),p=r+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:p,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const m=new Set(this.activeStageAttacksByRiderId.keys()),u=this.stageFavorites.slice(0,20).filter(f=>{if(f.kind!=="rider"||f.riderId==null)return!1;const b=this.riders.find($=>$.rider.id===f.riderId);if(!b||Z(b))return!1;const y=t.distanceCoveredMeters-b.distanceCoveredMeters;return y>=0&&y<=150}),g=xl(u,t.rider.id,m),h=[];for(const f of g){const b=this.riders.find(y=>y.rider.id===f);!b||Z(b)||this.activeStageAttacksByRiderId.has(f)||(this.activeStageAttacksByRiderId.set(f,{riderId:f,remainingSeconds:dr,startedAtElapsedSeconds:p,triggerDistanceMeters:b.distanceCoveredMeters,durationSeconds:dr,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),b.isAttacking=!0,h.push({riderName:this.formatRiderWithPreStageGc(f,b.riderName),riderTeamId:b.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:p,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const f of h){const b=this.riders.find(y=>y.riderName===f.riderName);this.pushMessage({elapsedSeconds:p,riderId:(b==null?void 0:b.rider.id)??null,riderName:f.riderName,type:"counter_attack",tone:"warning",title:`${f.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}}buildClusters(t){const a=[];for(const s of t){if(s.finishStatus==="dnf")continue;const r=a[a.length-1];if(!r||Math.abs(r.distanceMeter-s.distanceCoveredMeters)>=Ut){a.push({riderIds:[s.rider.id],riderCount:1,distanceMeter:s.distanceCoveredMeters,distanceSum:s.distanceCoveredMeters});continue}r.riderIds.push(s.rider.id),r.riderCount+=1,r.distanceSum+=s.distanceCoveredMeters,r.distanceMeter=r.distanceSum/r.riderCount}return a.map(({distanceSum:s,...r})=>r)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!Z(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),s=new Map;let r=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],c=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-c<Ut;){const m=a[n].rider.activeTeamId;m!=null&&s.set(m,(s.get(m)??0)+1),n+=1}for(;r<a.length&&c-a[r].distanceCoveredMeters>=Ut;){const m=a[r].rider.activeTeamId;if(m!=null){const u=(s.get(m)??0)-1;u<=0?s.delete(m):s.set(m,u)}r+=1}const l=o.rider.activeTeamId,p=l==null?0:Math.max(0,(s.get(l)??0)-1);t.set(o.rider.id,p===0?0:St(p*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?Kl:0,s=this.resolveBreakawaySkillBonus(t.rider),r=t.baseSkill+ha(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+s+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,r),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const s=re(this.stageDistanceMeters/1e3,ql,Xl),r=this.interpolateStaminaDistanceValue(s),n=re(t,gr,za),i=(za-n)/(za-gr),o=r/3+i*r,c=this.stageDistanceMeters<=0?0:re(a/this.stageDistanceMeters,0,1);return o*c**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=at[0].kmMark)return at[0].value;for(let a=0;a<at.length-1;a+=1){const s=at[a],r=at[a+1];if(t<=r.kmMark){const n=Math.max(1e-4,r.kmMark-s.kmMark),i=(t-s.kmMark)/n;return s.value+(r.value-s.value)*i}}return at[at.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/Ha),s=Math.max(1,Math.ceil(t/Ha)),r=ie(Dl,Bl),n=Array.from({length:s},()=>ie(.2,1.2)),i=n.reduce((l,p)=>l+p,0),o=Array.from({length:a+1},()=>1);o[0]=r;let c=0;for(let l=1;l<=s;l+=1)c+=n[l-1]??0,o[l]=r+(1-r)*(c/i);return o}resolveSkillSpreadFactor(t,a){const s=this.stageDistanceMeters<=0?1:re(t/this.stageDistanceMeters,0,1),r=Math.min(this.spreadCurve.length-1,Math.floor(s/Ha)),n=this.spreadCurve[r]??1;if(s<=this.lateStageStartRatio)return n;const i=Ho(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),c=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=re((s-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),p=this.interpolateFinalSpread(o,l);if(o<=1&&c<=1)return n;if(s<this.finalPushStartRatio||c<=o)return Math.max(n,p);const m=re((s-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),u=o+(c-o)*m;return Math.max(n,u)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const s=kn(this.simulationMode,t,this.skillWeightRuleMap).map(r=>({key:r.key,weight:r.weight}));return this.weightedSkillComponentsByTerrain.set(t,s),s}resolveWeightedSkill(t,a,s=0){const r=this.resolveWeightedSkillComponents(a),n=s>0||t.mentorBoosts?{...t.skills}:t.skills;if(s>0&&(n.stamina=Math.max(0,n.stamina-s)),t.mentorBoosts)for(const[l,p]of Object.entries(t.mentorBoosts))typeof p=="number"&&(n[l]+=p);let i=0,o=0;for(const l of r)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:_o(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,r)}}resolveSkillBreakdown(t,a,s){const r=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(r);if(n!==void 0)return n;const i=cc(t,s);return this.skillBreakdownCache.set(r,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const s=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,r=Math.max(0,100-s)/1e3,n=this.resolveElevationBucket(a);return r*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const s=a??this.interpolateElevation(t.distanceCoveredMeters),r=this.resolveElevationBucket(s);return r===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=r,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,s)),t.elevationPenalty}resolveSegmentElevation(t,a){const s=t.start_km*1e3,r=t.end_km*1e3,n=Math.max(1e-4,r-s),i=re((a-s)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const r=re(t,0,this.stageDistanceMeters)/1e3;if(r<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(r<=o.kmMark){const c=Math.max(1e-4,o.kmMark-i.kmMark),l=(r-i.kmMark)/c;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),Ka(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var m;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(de).sort((u,g)=>(u.finishTimeSeconds??0)-(g.finishTimeSeconds??0)||g.photoFinishScore-u.photoFinishScore||u.rider.id-g.rider.id);if(t.length===0)return;const a=[];let s=null;for(const u of t){const g=u.finishTimeSeconds??0;if(a.length===0){a.push(u),s=g;continue}if(s!=null&&g-s<=fa){a.push(u),s=g;continue}break}const r=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=u=>u.photoFinishScore,o=[...a].sort((u,g)=>i(g)-i(u)||u.rider.id-g.rider.id),c=((m=o[0])==null?void 0:m.finishTimeSeconds)??0,l=this.finishWeightProfile,p=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${p} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${fa.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${r}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((u,g)=>{const h=hc(u,l).map(x=>`${_n[x.skillKey]} ${x.contribution.toFixed(2)} = ${x.effectiveSkill.toFixed(2)} x ${(x.weight*100).toFixed(0)}%`).join(" | "),f=u.finishTimeSeconds??0,b=f-c,y=b<=1e-4?`${f.toFixed(2)} s`:`${f.toFixed(2)} s (+${b.toFixed(2)} s)`,$=this.calculatePhotoFinishScore(u),F=u.leadoutBonus??0,M=wt(u,r,n);console.log(`#${g+1} Zielsprint | ${u.riderName} | Zeit ${y} | Score (ohne Boni): ${$.toFixed(2)} -> Score (mit Boni): ${u.photoFinishScore.toFixed(2)} [SpecAdj: ${M>0?"+":""}${M.toFixed(2)}, Leadout: +${F.toFixed(2)}] | ID-Tiebreak ${u.rider.id} | (${h})`)}),console.groupEnd()}recordIntermediateSplits(t,a,s,r,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>s)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,c=Math.max(0,this.isTimeTrialMode?r+o-t.startOffsetSeconds:r+o);let l=this.resolveMarkerCrossingScore(t,i);const p=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;p&&(l+=wt(t,p,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=c,t.splitTimes[i.key]=c,t.splitTimes[i.label]=c,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:c,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return Ka(t,this.resolveSprintWeightProfile());const s=Ka(t,this.resolveClimbWeightProfile(a.markerCategory)),r=ic(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return s+r}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??Il}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??Nl[a]}calculatePreLeadoutFinishScore(t){const s=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,r=ha(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[c,l])=>{if(!l)return o;const p=c==="stamina"?s:0,m=Math.max(0,t.rider.skills[c]+r+t.dailyForm+t.microForm+t.teamGroupBonus-p);return o+m*l},0),i=wt(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}calculateSprintLeadoutBonus(t){const a=this.resolveFinishMarkerType();if(a!=="finish_flat"&&a!=="finish_hill"||t.rider.skills.sprint<74)return 0;const s=t.rider.activeTeamId;if(s==null)return 0;const r=this.riders.filter(u=>u.rider.activeTeamId===s);if(r.length===0)return 0;const n=r.filter(u=>u.finishStatus!=="dnf"&&u.finishStatus!=="otl"&&u.finishStatus!=="dns"&&u.rider.skills.sprint>=74);if(n.length===0)return 0;let i=this.teamBestSprinterRiderId.get(s);if(i===void 0){let u=null,g=Number.NEGATIVE_INFINITY;for(const h of n){const f=this.calculatePreLeadoutFinishScore(h);f>g?(g=f,u=h):f===g&&u!==null&&(h.rider.skills.sprint>u.rider.skills.sprint||h.rider.skills.sprint===u.rider.skills.sprint&&h.rider.id<u.rider.id)&&(u=h)}u?(i=u.rider.id,this.teamBestSprinterRiderId.set(s,i)):i=-1}if(i!==t.rider.id)return 0;let o=this.teamSprintRandomValues.get(s);o===void 0&&(o=ie(.25,.6),this.teamSprintRandomValues.set(s,o));let c=this.teamSprintSpecialRandomValues.get(s);c===void 0&&(c=ie(.1,.3),this.teamSprintSpecialRandomValues.set(s,c)),t.leadoutRiderId=null;let l=0,p=0,m=null;for(const u of r){if(u.rider.id===t.rider.id||u.finishStatus==="dnf"||u.finishStatus==="otl"||u.finishStatus==="dns")continue;let g=0;const h=u.rider.skills.sprint>=72,f=u.rider.skills.flat>=78,b=u.rider.skills.timeTrial>=76,y=u.rider.skills.acceleration>=80;if(h&&g++,f&&g++,b&&g++,y&&g++,g>0){const $=h?o:c;let F=1;g===2?F=1.25:g===3?F=1.5:g===4&&(F=2);const M=$*F;if(l+=M,M>p)p=M,m=u.rider.id;else if(M===p&&m!==null){const x=this.riders.find(T=>T.rider.id===m);x&&u.rider.skills.sprint>x.rider.skills.sprint&&(m=u.rider.id)}}}return l>0&&(t.leadoutRiderId=m),l*1.5}resolveFinishMarkerType(){const t=_e(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const s=t[a].marker.type;if(s==="finish_flat"||s==="finish_hill"||s==="finish_mountain")return s}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return El;case"finish_mountain":return Cl;default:return Fl}}resolveRiderClockSeconds(t){if(de(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,s,r=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(c=>c.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){r=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const c=this.riders.find(p=>p.rider.id===o);if(!c||Z(c))continue;if(Math.abs(c.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const p=Vo(c.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(c,p,s,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:s,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:r?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:s,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:r?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:s,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(s=>s.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+Ut){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const vc=300;async function yc(e,t){const a=new Hn(e,{maxSubstepSeconds:5});let s=!1;for(;!s;){const r=a.step(vc);if(s=r.isFinished,t){const n=r.stageDistanceMeters>0?r.leaderDistanceMeters/r.stageDistanceMeters:0,i=e.riders.length>0?r.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const kc=[1,2,5,10,25,50,100,250,500],yr=new WeakMap;function $c(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function kr(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Tc(e){const t=yr.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${kc.map(s=>`
          <button
            type="button"
            class="race-sim-speed-btn"
            data-race-sim-speed="${s}"
          >${s}x</button>
        `).join("")}
      </div>
      <strong class="race-sim-control-meta" data-race-sim-field="time">00:00:00</strong>
      <strong class="race-sim-control-meta" data-race-sim-field="finished">0 / 0 im Ziel</strong>
      <strong class="race-sim-control-distance" data-race-sim-field="distance">0,0 km / 0,0 km</strong>
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return yr.set(e,a),a}function $r(e,t){const a=Tc(e);a.timeField&&(a.timeField.textContent=$c(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${kr(t.snapshot.leaderDistanceMeters)} / ${kr(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(s=>{const r=Number(s.dataset.raceSimSpeed);s.classList.toggle("active",r===t.timeMultiplier)})}const Mc=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function wc(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),s=t%60;return`${a}:${String(s).padStart(2,"0")}`}function Tt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function xc(e){return`/jersey/Jer_${e}.png`}function zn(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${Tt(xc(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Rc(e){return e.riderId==null||e.riderTeamId==null?"":zn(e.riderTeamId)}function Ic(e){const t=Tt(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function Fc(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${Tt(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${Tt(e)}</button>`}function Ec(e,t){if(t==="all")return!0;const a=Kn(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function Cc(e){const t=e.detail?Tt(e.detail):"",a=(e.secondaryRiders??[]).map(r=>`${r.riderTeamId!=null?zn(r.riderTeamId,"race-sim-message-inline-jersey"):""}${Fc(r.riderName,r.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const s=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${s}</span>`}function Kn(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function Tr(e,t,a="all"){const s=t.filter(n=>Ec(n,a)),r=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${Mc.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${s.length===0?`<div class="race-sim-message-empty">${r}</div>`:s.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${Tt(Kn(n))}">
          <span class="race-sim-message-time">t=${wc(n.elapsedSeconds)}</span>
          ${Rc(n)}
          <span class="race-sim-message-text">
            ${Ic(n)}
            ${Cc(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const Nc=1,Pc={Flat:12,Rolling:14,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:23,High_Mountain:25,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function Lc(e){return Math.max(0,Math.round(e))}function On(e){return e==="ITT"||e==="TTT"}function Ac(e){return Pc[e]??20}function Dc(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+Ac(e)/100))}function Bc(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function Mr(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function Oa(e,t){if(On(t))return[...e].sort(Bc);const a=[...e].sort((o,c)=>o.stageTimeSeconds-c.stageTimeSeconds||Mr(o,c)),s=[];let r=[],n=null;const i=()=>{s.push(...r.sort(Mr))};for(const o of a){if(r.length===0){r=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=Nc){r.push(o),n=o.stageTimeSeconds;continue}i(),r=[o],n=o.stageTimeSeconds}return r.length>0&&i(),s}function z(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function _c(e){return`/jersey/Jer_${e}.png`}function Ht(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${z(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${z(_c(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function zt(e,t,a){return e==null?`<span class="${a}" title="${z(t)}">${z(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${z(t)}">${z(t)}</button>`}function Gc(e){return e.toFixed(1).replace(".",",")}function ba(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Hc(e){return`${e??0} Pkt.`}function zc(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function Kc(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function jn(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function Oc(e){if(e==null||e<=0)return jn(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Ze(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function Xt(e){return`${e.toFixed(1).replace(".",",")} km`}function wr(e){return`${e.toFixed(1).replace(".",",")}%`}function Jt(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function xr(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function jc(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function Wc(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function Vc(e,t,a){return Array.from({length:t},(s,r)=>e.slice(r*a,(r+1)*a))}function Uc(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const s=Vc(e,4,5),r=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${s.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=Wc(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${Ht(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${zt(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${z(i.roleLabel)}">${z(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?r.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${z(ba(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${Gc(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function Bt(e,t){const a=e.riders.find(s=>s.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function Ea(e,t){const a=e.riders.find(n=>n.id===t),s=(a==null?void 0:a.activeTeamId)??null,r=s!=null?e.teams.find(n=>n.id===s)??null:null;return{teamId:s,teamName:(r==null?void 0:r.name)??null}}function Yc(e,t,a,s={}){const r=(t??[]).slice(0,s.limit??8);return r.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${r.map(n=>{var m;const i=n.riderId??0,o=Ea(e,i),c=Bt(e,i),l=((m=s.distanceGapsByRiderId)==null?void 0:m.get(i))??null,p=[s.distanceGapClassName??"",Kc(l)].filter(u=>u.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${Ht(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${zt(n.riderId,c,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${s.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${p}">${z(zc(l))}</span>`:""}
      </article>`}).join("")}</div>`}function Qt(e,t,a,s,r,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${z(e)}</h4>
      ${Yc(a,s,r,n)}
    </section>`}function gt(e,t,a,s,r=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${s}" ${r?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${s}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${z(e)}</span>
      </summary>
      ${t}
    </details>`}function Sa(e,t,a,s){const r=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var c;const i=r.get(n.id)??null,o=((c=a.get(n.id))==null?void 0:c[s])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||Bt(e,n.riderId).localeCompare(Bt(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function Rr(e){const t=Zc(e)?e.stagePoints:0;return`${z(Hc("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${z(t)}</span></span>`:""}`}function Zc(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function Ir(e,t){if(t==null)return new Map;const a=e.riders.find(s=>s.riderId===t)??null;return a?new Map(e.riders.map(s=>[s.riderId,a.distanceCoveredMeters-s.distanceCoveredMeters])):new Map}function qc(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function ca(e,t){var s;const a=(s=e.race.category)==null?void 0:s.bonusSystem;return!a||t==null||t==="Sprint"?[]:Ze(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function Ts(e){var s;const t=(s=e.race.category)==null?void 0:s.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return Ze(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return Ze(a?t.pointsMountainStage:t.pointsSprintFinish)}function Wn(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:Ze((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function Xc(e,t,a){let s=null;for(const r of e.stageSummary.segments){const n=Math.max(t,r.start_km),i=Math.min(a,r.end_km),o=Math.max(0,i-n);if(o<=0)continue;const c={lengthKm:o,gradient:r.gradient_percent};(s==null||c.gradient>s.gradient||c.gradient===s.gradient&&c.lengthKm>s.lengthKm)&&(s=c)}return s}function ja(e,t,a,s=null){return e.entries.filter(r=>s==null||s.has(r.riderId)).map((r,n)=>({riderId:r.riderId,rank:r.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:r.crossingTimeSeconds,gapSeconds:r.gapSeconds})).filter(r=>r.points>0)}function Ms(e){const t=new Map;for(const a of e)for(const s of a.entries){const r=t.get(s.riderId)??{points:0,mountain:0};s.pointsKind==="mountain"?r.mountain+=s.points:r.points+=s.points,t.set(s.riderId,r)}return t}function Jc(e){return _e(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function va(e,t){const a=On(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?Lc(a):null}function Ca(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=va(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const s=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(s)||s<=0)return Oa(a,e.stage.profile).map(n=>n.rider);const r=Dc(e.stage.profile,a.map(n=>n.stageTimeSeconds));return r==null?Oa(a,e.stage.profile).map(n=>n.rider):Oa(a.filter(n=>n.stageTimeSeconds<=r),e.stage.profile).map(n=>n.rider)}function Qc(e,t){const a=Ts(e);return a.length===0?[]:Ca(e,t).map((s,r)=>({riderId:s.riderId,rank:r+1,points:a[r]??0,pointsKind:"points",crossingTimeSeconds:va(e,s),gapSeconds:null})).filter(s=>s.points>0)}function ed(e,t){const a=Ca(e,t).slice(0,20),s=a[0]!=null?va(e,a[0])??0:0;return a.map((r,n)=>{const i=va(e,r)??0;return{riderId:r.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-s),photoFinishScore:r.photoFinishScore}})}function td(e,t){var a;return((a=Ca(e,t)[0])==null?void 0:a.riderId)??null}function ws(e,t,a){var F,M;const s=_e(e.stageSummary),r=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(Ca(e,a).map(x=>x.riderId)):null,i=s.filter(({marker:x})=>x.type==="climb_start"),o=s.filter(({marker:x})=>Qe(x)).sort((x,T)=>x.kmMark-T.kmMark).map((x,T)=>{var I,B;const w=[...i].reverse().find(_=>_.kmMark<=x.kmMark)??null,C=qc(e,x.kmMark),E=(w==null?void 0:w.kmMark)??(C==null?void 0:C.start_km)??x.kmMark,A=(w==null?void 0:w.elevation)??(C==null?void 0:C.start_elevation)??x.elevation,N=Math.max(0,x.kmMark-E),D=N>0?(x.elevation-A)/(N*1e3)*100:(C==null?void 0:C.gradient_percent)??0,L=Xc(e,E,x.kmMark),P=t.find(_=>_.markerKey===x.key)??null,V=ca(e,(P==null?void 0:P.markerCategory)??x.marker.cat??null),J=P?ja(P,V,"mountain",n):[],R=(P==null?void 0:P.markerCategory)??x.marker.cat??null;return{key:x.key,title:`${T+1}. Bergwertung`,label:x.label,categoryLabel:R?`Kat. ${R}`:null,categoryClassName:xr(R),kmMark:x.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-x.kmMark),climbLengthKm:N,averageGradient:D,steepestSegmentLengthKm:(L==null?void 0:L.lengthKm)??null,steepestSegmentGradient:(L==null?void 0:L.gradient)??null,highlightMeta:x.kmMark>=r,leaderRiderId:((I=J[0])==null?void 0:I.riderId)??((B=P==null?void 0:P.entries[0])==null?void 0:B.riderId)??null,displayBadges:Jt(V,"mountain"),entries:J,timingEntries:(P==null?void 0:P.entries)??[],accent:"mountain"}}),c=s.filter(({marker:x})=>x.type==="sprint_intermediate").sort((x,T)=>x.kmMark-T.kmMark).map((x,T)=>{var A,N;const w=t.find(D=>D.markerKey===x.key)??null,C=Wn(e),E=w?ja(w,C,"points",n):[];return{key:x.key,title:`${T+1}. Zwischensprint`,label:x.label,categoryLabel:null,categoryClassName:null,kmMark:x.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-x.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((A=E[0])==null?void 0:A.riderId)??((N=w==null?void 0:w.entries[0])==null?void 0:N.riderId)??null,displayBadges:Jt(C,"points"),entries:E,timingEntries:(w==null?void 0:w.entries)??[],accent:"sprint"}}),l=Jc(e),p=Qc(e,a),m=l?t.find(x=>x.markerKey===l.key)??null:null,u=m?ja(m,ca(e,m.markerCategory),"mountain",n):[],g=Ts(e),h=m?ca(e,m.markerCategory):[],f=e.stage.profile==="ITT"||e.stage.profile==="TTT"?ed(e,a):(m==null?void 0:m.entries)??[],b=((F=p[0])==null?void 0:F.riderId)??((M=u[0])==null?void 0:M.riderId)??td(e,a),y={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:m!=null&&m.markerCategory?`Kat. ${m.markerCategory}`:null,categoryClassName:xr((m==null?void 0:m.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(m!=null&&m.markerCategory),leaderRiderId:b,displayBadges:[...Jt(g,"points"),...Jt(h,"mountain")],entries:[...p,...u],timingEntries:f,accent:"finish"};return[...[...c,...o].sort((x,T)=>x.kmMark-T.kmMark||x.title.localeCompare(T.title,"de")),y].filter(x=>x.entries.length>0||x.timingEntries.length>0||x.accent!=="finish"||l!=null||a.isFinished)}function ad(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),s=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,r=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,s):t.entries.slice(0,s).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return r.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${r.map(n=>{const i=Ea(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${Ht(i.teamId,i.teamName)}
            ${zt(n.riderId,Bt(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?z(jn(n.crossingTimeSeconds)):z(Oc(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function Fr(e,t){var a;return((a=e==null?void 0:e.find(s=>s.riderId===t))==null?void 0:a.points)??0}function Er(e,t){var a;return((a=e.filter(s=>s.riderId!=null&&t.has(s.riderId)).sort((s,r)=>s.rank-r.rank||s.riderId-r.riderId)[0])==null?void 0:a.riderId)??null}function ea(e,t,a){if(!(!t||e.some(s=>s.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function sd(e,t,a,s,r){const n=new Set(e.riderIds),i=new Map(t.riders.map(g=>[g.riderId,g])),c=e.riderIds.map(g=>i.get(g)??null).filter(g=>g!=null).sort((g,h)=>{var f,b;return(((f=a.get(g.riderId))==null?void 0:f.rank)??Number.MAX_SAFE_INTEGER)-(((b=a.get(h.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)||g.riderName.localeCompare(h.riderName,"de")||g.riderId-h.riderId}).slice(0,25),l=i.get(Er(s,n)??-1)??null,p=i.get(Er(r,n)??-1)??null,m=l!=null&&!c.some(g=>g.riderId===l.riderId),u=p!=null&&!c.some(g=>g.riderId===p.riderId);return c.length>=25&&m&&u&&l.riderId!==p.riderId?(ea(c,l,23),ea(c,p,24),c):(ea(c,l,24),ea(c,p,24),c)}function rd(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function nd(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function Cr(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function id(e,t){const a=t.riders.filter(r=>e.riderIds.includes(r.riderId)).reduce((r,n)=>Math.max(r,n.distanceCoveredMeters),0),s=Math.max(0,t.leaderDistanceMeters-a);return s>0?`-${Math.round(s)} m`:"—"}function od(e,t,a,s,r,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=Mo(a,s),c=a.find(u=>u.label===o)??a[0],l=new Map(e.gcStandings.map(u=>[u.riderId,u])),p=Ms(i),m=sd(c,t,l,r,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${z(c.label)} <span class="race-sim-group-count">(${c.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${z(Cr(c.previousGapMeters,"-"))}</span>
        <span>Leader ${z(id(c,t))}</span>
        <span>Hinten ${z(Cr(c.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${m.map((u,g)=>{const h=l.get(u.riderId)??null,f=Ea(e,u.riderId),b=p.get(u.riderId)??{points:0,mountain:0},y=Fr(r,u.riderId),$=Fr(n,u.riderId),F=rd(u.riderId,e.classificationLeaders),M=F.length>0?F.map(x=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[x]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${nd(F)}" title="${z(M)}">${g+1}.</strong>
              ${Ht(f.teamId,f.teamName)}
              <span class="race-sim-classification-main">
                ${zt(u.riderId,u.riderName,`race-sim-group-rider-name${u.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${h?h.rank:"—"} · ${z(h?ba(h.gapSeconds):"—")} · ${z(u.gapToLeaderMeters>0?`+${Math.round(u.gapToLeaderMeters)} m`:"—")}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${y}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${$}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${b.points>0?`▲ +${b.points}`:" "}</span>
                  <span class="race-sim-breakaway-stage-gain">${b.mountain>0?`▲ +${b.mountain}`:" "}</span>
                </span>
              </span>
            </article>`}).join("")}
      </div>
    </section>`}function ld(e,t,a,s){const r=ws(t,a.markerClassifications,a),n=Ms(r),i=Sa(t,t.pointsStandings,n,"points"),o=Sa(t,t.mountainStandings,n,"mountain"),c=ks(ys(a.clusters));e.innerHTML=od(t,a,c,s,i,o,r)}function cd(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function dd(e){const t=_e(e.stageSummary),a=Wn(e)[0]??0,s=Ts(e)[0]??0,r=t.filter(({marker:n})=>Qe(n)).reduce((n,{marker:i})=>n+(ca(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+s,mountain:r}}function Nr(e){const t=dd(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function ud(e){const t=jc(e),a=[`<span class="race-sim-stage-points-meta-pill">${z(Xt(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${z(`${Xt(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${z(`Länge ${Xt(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${z(`Ø ${wr(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${z(`Steilstes ${Xt(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${z(wr(e.steepestSegmentGradient))}</span>`:""].filter(s=>s.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${z(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${z(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${z(e.label)}">${z(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((s,r)=>`${r>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${s}`).join("")}
    </span>`}function md(e,t,a,s=null){const r=s??ws(e,t,a);return r.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${Nr(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${Nr(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${r.map(n=>{const i=n.leaderRiderId!=null?Ea(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?Bt(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${ud(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${cd(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${Ht(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?zt(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${z(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${ad(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function pd(e,t,a,s,r,n=new Set){var g,h;const i=ws(a,s,r),o=Ms(i),c=Sa(a,a.pointsStandings,o,"points"),l=Sa(a,a.mountainStandings,o,"mountain"),p=Ir(r,((g=a.gcStandings[0])==null?void 0:g.riderId)??null),m=Ir(r,((h=a.youthStandings[0])==null?void 0:h.riderId)??null),u=f=>!n.has(f);e.innerHTML=`
    ${gt("Stage Favorites",Uc(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",u("favorites"))}
    <section class="race-sim-classifications-section">
      ${gt("GC",Qt("GC","gc",a,a.gcStandings,f=>z(`GC ${f.rank} · ${ba(f.gapSeconds)}`),{limit:20,distanceGapsByRiderId:p}),"race-sim-overview-classification race-sim-overview-gc","gc",u("gc"))}
      ${gt("Punktewertung",Qt("Punktewertung","points",a,c,Rr),"race-sim-overview-classification race-sim-overview-points","points",u("points"))}
      ${gt("Bergwertung",Qt("Bergwertung","mountain",a,l,Rr),"race-sim-overview-classification race-sim-overview-mountain","mountain",u("mountain"))}
      ${gt("Nachwuchsfahrerwertung",Qt("Nachwuchsfahrerwertung","youth",a,a.youthStandings,f=>z(`${f.rank}. · ${ba(f.gapSeconds)}`),{distanceGapsByRiderId:m,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",u("youth"))}
    </section>
    ${gt("Etappenwertungen",md(a,s,r,i),"race-sim-overview-stage-scoring","stageScoring",u("stageScoring"))}
  `}const Pr=new WeakMap,De=new WeakMap,Lr=new WeakMap,Vn=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Un(e){return e<=0?"—":`+${Math.round(e)} m`}function Pt(e){const t=Vn.format(e);return e>0?`+${t}`:t}function Wa(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function te(e){return Vn.format(e)}function ut(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function Yn(e){return`+${ut(e)}`}function Zn(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function xs(e){return`${(e*3.6).toFixed(1)} km/h`}function gd(e){return`${Pt(e)}%`}function os(e){return`${e.toFixed(1).replace(".",",")} km`}function qn(e){return`${os(e.segmentStartKm)} - ${os(e.segmentEndKm)}`}function fd(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function Xn(e){return e.replace(/_/g," ")}function Jn(e){return Xn(e)}function hd(e){return Xn(e)}function Qn(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function bd(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function Sd(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function ei(e){return _e(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||Qe(t)).map(({key:t,label:a})=>({key:t,label:a}))}function vd(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function yd(e,t,a,s){var r;return a!=="ITT"&&a!=="TTT"?((r=s.get(t))==null?void 0:r.get(e.riderId))??null:e.splitTimes[t]??null}function ti(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(r=>({label:r.key,displayLabel:r.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${r.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function kd(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function $d(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function ai(e){const t=Pr.get(e);if(t)return t;const a=ei(e),s={splitMarkers:a,columns:ti(e,a,!1),riderById:new Map(e.riders.map(r=>[r.id,r])),teamById:new Map((e.teams??[]).map(r=>[r.id,r])),teamAbbreviationById:new Map((e.teams??[]).map(r=>[r.id,r.abbreviation])),teamNameById:new Map((e.teams??[]).map(r=>[r.id,r.name])),gcByRiderId:new Map((e.gcStandings??[]).map(r=>[r.riderId,r]))};return Pr.set(e,s),s}function si(e,t){const a=e.parentElement,s=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!s)return"";const r=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",s.insertAdjacentElement("beforebegin",l),l})(),n=Rs(e),i=kd(t),o=$d(i,n),c=De.get(e);return(c==null?void 0:c.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),r.innerHTML=`
    <button
      type="button"
      class="race-sim-leaderboard-auto-sort-btn${n.showSplitColumns?" active":""}"
      data-race-sim-splits-toggle="toggle"
      aria-pressed="${n.showSplitColumns?"true":"false"}"
    >Zwischenzeiten ${n.showSplitColumns?"AN":"AUS"}</button>
    <button
      type="button"
      class="race-sim-leaderboard-auto-sort-btn${n.autoSort?" active":""}"
      data-race-sim-auto-sort="toggle"
      aria-pressed="${n.autoSort?"true":"false"}"
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,s.innerHTML=t.map(l=>Td(l,n)).join(""),De.set(e,{layoutKey:o,orderedRiderIds:(c==null?void 0:c.orderedRiderIds)??[],rowsByRiderId:(c==null?void 0:c.rowsByRiderId)??new Map,openDetailRiderId:(c==null?void 0:c.openDetailRiderId)??null,openTeamId:(c==null?void 0:c.openTeamId)??null})),o}function Ke(e,t){e.textContent!==t&&(e.textContent=t)}function ta(e,t){e.title!==t&&(e.title=t)}function aa(e,t){e.className!==t&&(e.className=t)}function sa(e,t,a){return e.lastValues[t]!==a}function ra(e,t,a){e.lastValues[t]=a}function Rs(e){const t=Lr.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return Lr.set(e,a),a}function Td(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${H(e.label)}">${H(a)}</span>`;const s=!t.autoSort&&t.manualSortKey===e.sortKey,r=s?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${s?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${H(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${H(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${H(a)}<span class="race-sim-leaderboard-sort-indicator">${H(r)}</span></button>`}function Md(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function wd(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function Ar(e,t,a,s,r,n,i){if(s.autoSort)return(c,l)=>e.stage.profile==="ITT"?ri(c,l,t):Fd(c,l);if(!s.manualSortKey)return null;const o=s.manualSortDirection==="asc"?1:-1;return(c,l)=>{if(he(c)!==he(l))return he(c)?1:-1;const p=r.get(c.riderId)??null,m=r.get(l.riderId)??null,u=Dr(c,p,s.manualSortKey??"",e,a,n,i),g=Dr(l,m,s.manualSortKey??"",e,a,n,i);return wd(u,g)*o||c.riderId-l.riderId}}function xd(e,t,a){if(e.length!==t.size)return!1;let s=null;for(const r of e){const n=t.get(r);if(!n||s&&a(s,n)>0)return!1;s=n}return!0}function Dr(e,t,a,s,r,n,i){const o=s.race.isStageRace&&s.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return s.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?yd(e,a.slice(6),s.stage.profile,r):null}}function Rd(e,t,a,s,r,n,i,o,c){if(!r.manualSortKey){if(r.autoSort){const u=Ar(t,a,s,r,n,i,o);return u?[...e].sort(u):[...e]}const m=new Map(r.frozenOrder.map((u,g)=>[u,g]));return[...e].sort((u,g)=>(he(u)===he(g)?0:he(u)?1:-1)||(m.get(u.riderId)??Number.MAX_SAFE_INTEGER)-(m.get(g.riderId)??Number.MAX_SAFE_INTEGER)||u.riderId-g.riderId)}const l=Ar(t,a,s,r,n,i,o);if(!l)return[...e];const p=new Map(e.map(m=>[m.riderId,m]));return xd(c,p,l)?c.map(m=>p.get(m)).filter(m=>m!=null):[...e].sort(l)}function Id(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const p=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(p))return!1;const m=De.get(e);return m?(m.openTeamId=m.openTeamId===p?null:p,m.openTeamId==null&&(m.openDetailRiderId=null),!0):!1}const s=t.closest("button[data-race-sim-rider-toggle]");if(s){const p=Number(s.dataset.raceSimRiderToggle);if(!Number.isFinite(p))return!1;const m=De.get(e);return m?(m.openDetailRiderId=m.openDetailRiderId===p?null:p,!0):!1}const r=Rs(e);if(t.closest("button[data-race-sim-splits-toggle]"))return r.showSplitColumns=!r.showSplitColumns,!r.showSplitColumns&&((l=r.manualSortKey)!=null&&l.startsWith("split:"))&&(r.manualSortKey=null,r.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return r.autoSort=!r.autoSort,r.autoSort?(r.manualSortKey=null,r.frozenOrder=[]):(r.manualSortKey=null,r.manualSortDirection="asc",r.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(p=>Number(p.dataset.raceSimRiderRow)).filter(p=>Number.isFinite(p))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||r.autoSort)return!1;const c=o.dataset.raceSimSortKey;return c?(r.manualSortKey===c?r.manualSortDirection=r.manualSortDirection==="asc"?"desc":"asc":(r.manualSortKey=c,r.manualSortDirection=Md(c)),r.frozenOrder=[],!0):!1}function Br(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function he(e){return e.finishStatus==="dnf"}function ri(e,t,a){if(he(e)!==he(t))return he(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const c=a[o];if(!c)continue;const l=e.splitTimes[c.key],p=t.splitTimes[c.key];if(l!=null&&p!=null&&l!==p)return l-p;if(l!=null&&p==null)return-1;if(l==null&&p!=null)return 1}const s=Br(e,a),r=Br(t,a);if(s!==r)return s?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function Fd(e,t){return he(e)!==he(t)?he(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function ni(e,t){const a=(t==null?void 0:t.formBonus)??0,s=(t==null?void 0:t.raceFormBonus)??0,r=(t==null?void 0:t.fatigueMalus)??0,n=(t==null?void 0:t.longTermFatigueMalus)??0,i=(t==null?void 0:t.shortTermFatigueMalus)??0,o=e.teamGroupBonus,c=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,p=e.baseSkill+l+a+s+e.dailyForm+e.microForm+o-r-n-i,m=Math.max(0,p-e.staminaPenalty),u=p-m,g=m-e.effectiveSkill;return[`Basis ${te(e.baseSkill)}`,e.isAttacking?`+ Attacke ${te(l)}`:null,`+ S-Form ${te(a)}`,`+ R-Form ${te(s)}`,`+ T-Form ${te(e.dailyForm)}`,`+ Zufällige Form ${te(c)} (skaliert)`,`+ Teambonus ${te(o)}`,`- Fatigue ${te(r)}`,`- Langzeit ${te(n)}`,`- Akut ${te(i)}`,`- Stamina ${te(u)}`,`- HM ${te(g)}`,`= Effektiv ${te(e.effectiveSkill)}`].filter(h=>h!=null)}function Ed(e,t){return ni(e,t).join(`
`)}function Cd(e){return Pt(Math.max(-2.5,Math.min(2.5,e*2.5)))}function Nd(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function ii(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${H(e.riderName)}">${H(e.riderName)}</button>`}function Pd(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const s=t.get(e.activeTeamId)??"—",r=a.get(e.activeTeamId)??s;return`<span class="race-sim-team-code" title="${H(r)}">${H(s)}</span>`}function oi(e){return`/jersey/Jer_${e}.png`}function Ld(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const s=t.get(e.activeTeamId);if(!s)return"—";const r=a.get(e.activeTeamId)??s.name,n=oi(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${H(r)}">
      <img
        class="race-sim-team-jersey-img"
        src="${H(n)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Ad(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function Dd(e,t,a,s){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=s.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const r=e.splitTimes[t];return r!=null?ut(r):"—"}function li(e,t,a){const s=ni(e,t),r=[{label:"Terrain / Skill",value:`${Jn(e.activeTerrain)} / ${hd(e.skillName)}`},{label:"Aktiver Abschnitt",value:qn(e)},{label:"Segmenthöhe",value:fd(e)},{label:"Basis",value:te(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${te(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:Pt((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:Pt((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:Wa((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:Wa((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:Wa((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:te(e.staminaPenalty)},{label:"HM",value:te(e.elevationPenalty)},{label:"T-Form",value:Pt(e.dailyForm)},{label:"Zufall",value:Cd(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:Nd(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?Zn(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${H(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${H(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${r.map(n=>`<div class="race-sim-rider-detail-item"><span>${H(n.label)}</span><strong>${H(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${s.map(n=>H(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${H(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function Bd(e,t,a,s,r,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const c=document.createElement("div");c.className="race-sim-row-grid",o.appendChild(c);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",c.appendChild(l);const p=document.createElement("span");p.className="race-sim-row-flag",p.innerHTML=t?$o(Sd(t)):"—",c.appendChild(p);const m=document.createElement("span");m.className="race-sim-row-name",m.innerHTML=ii(e,a),c.appendChild(m);const u=m.querySelector(".race-sim-row-name-btn");if(!u)throw new Error("race-sim-row-name-btn not found");const g=document.createElement("span");g.className="race-sim-row-team-visual",g.innerHTML=Ld(t,r,i),c.appendChild(g);const h=document.createElement("strong");h.className="race-sim-row-team",h.innerHTML=Pd(t,n,i),c.appendChild(h);const f=(A="")=>{const N=document.createElement("strong");return A&&(N.className=A),c.appendChild(N),N},b=f("race-sim-gap"),y=f("race-sim-cell-effective-skill"),$=f(),F=f(),M=f(),x=s.map(()=>f()),T=f(),w=f(),C=f("race-sim-form-state-cell"),E=document.createElement("div");return E.className="race-sim-row-detail-popover hidden",o.appendChild(E),{row:o,rankField:l,nameButton:u,gapField:b,clockField:M,splitFields:x,effectiveSkillField:y,gcRankField:$,gcGapField:F,gradientPercentField:T,speedField:w,formStateField:C,detailPanel:E,initialized:!1,lastValues:{}}}function _d(e,t,a,s,r,n,i,o,c,l,p){const m=(s==null?void 0:s.formBonus)??0,u=(s==null?void 0:s.raceFormBonus)??0,g=c&&l>1?p.get(a.riderId)??null:null,h=he(a),f=i!=="ITT"&&i!=="TTT"?h?"DNF":"—":a.hasStarted?h?"DNF":a.riderClockSeconds!=null?ut(a.riderClockSeconds):"—":Yn(a.startOffsetSeconds);aa(e.row,`race-sim-row${t===1&&!h?" race-sim-row-leader":""}${r?" race-sim-row-detail-open":""}${h?" race-sim-row-dnf":""}`),Ke(e.rankField,`${t}.`),Ke(e.gapField,h?"DNF":Un(a.gapToLeaderMeters)),Ke(e.clockField,f),e.nameButton.setAttribute("aria-expanded",r?"true":"false"),aa(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),ta(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((F,M)=>{const x=e.splitFields[M];if(!x)return;const T=Dd(a,F.key,i,o);Ke(x,T),ta(x,F.label)}),sa(e,"effectiveSkillValue",a.effectiveSkill)&&(Ke(e.effectiveSkillField,te(a.effectiveSkill)),ra(e,"effectiveSkillValue",a.effectiveSkill));const b=`race-sim-cell-effective-skill ${Qn(a)}`;sa(e,"effectiveSkillClass",b)&&(aa(e.effectiveSkillField,b),ra(e,"effectiveSkillClass",b));const y=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,m,u,a.dailyForm,a.microForm,(s==null?void 0:s.fatigueMalus)??0,(s==null?void 0:s.longTermFatigueMalus)??0,(s==null?void 0:s.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");sa(e,"effectiveSkillTitleKey",y)&&(ta(e.effectiveSkillField,Ed(a,s)),ra(e,"effectiveSkillTitleKey",y)),Ke(e.gcRankField,g?String(g.rank):"—"),Ke(e.gcGapField,g?Zn(g.gapSeconds):"—"),Ke(e.gradientPercentField,gd(a.gradientPercent)),aa(e.gradientPercentField,bd(a.gradientPercent)),ta(e.gradientPercentField,`${Jn(a.activeTerrain)} · ${qn(a)}`),Ke(e.speedField,xs(a.currentSpeedMps)),e.formStateField.innerHTML=Ad(a);const $=[r?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,m,u,(s==null?void 0:s.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(g==null?void 0:g.rank)??"—",(g==null?void 0:g.gapSeconds)??"—",a.skillBreakdown].join("|");sa(e,"detailKey",$)&&(e.detailPanel.innerHTML=r?li(a,s,g):"",e.detailPanel.classList.toggle("hidden",!r),ra(e,"detailKey",$)),e.detailPanel.classList.toggle("hidden",!r),e.initialized=!0}function Gd(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${H(e.name)}">${H(e.name)}</button>`}function Hd(e){const t=oi(e.id);return`
    <span class="race-sim-team-visual" title="${H(e.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${H(t)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function zd(e,t,a){const s=new Map;for(const r of e.riders){const n=a.get(r.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=s.get(i)??[];o.push(r),s.set(i,o)}return t.teams.filter(r=>s.has(r.id)).map(r=>{const n=(s.get(r.id)??[]).slice().sort((p,m)=>m.effectiveSkill-p.effectiveSkill||p.riderId-m.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),c=n.slice(0,o).reduce((p,m)=>p+m.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:r,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,c-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(p=>p.isFinished).length}}).sort((r,n)=>ri(r.representative,n.representative,ei(t))||r.team.id-n.team.id)}function Kd(e,t,a,s,r){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${H(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${H(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${H(te(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${H(xs(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${H(e.teamClockSeconds!=null?ut(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${H(os(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&s>1?t.gcByRiderId.get(n.riderId)??null:null,c=r===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${ii(n,c)}
                <strong>${H(te(n.effectiveSkill))}</strong>
                <span>${H(n.riderClockSeconds!=null?ut(n.riderClockSeconds):"—")}</span>
              </div>
              ${c?li(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function Od(e,t,a){var g,h;const s=performance.now(),r=ai(a),n=r.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(f=>({label:f.key,displayLabel:f.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(g=De.get(e))==null?void 0:g.layoutKey,c=si(e,i),l=De.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==c&&(e.innerHTML="");const p=zd(t,a,r.riderById),m=((h=p[0])==null?void 0:h.teamDistanceMeters)??0;return e.innerHTML=p.map((f,b)=>{const y=l.openTeamId===f.team.id;return`
      <article class="race-sim-row${b===0?" race-sim-row-leader":""}${y?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${b+1}.</strong>
          <span class="race-sim-row-name">${Gd(f.team,y)}</span>
          <span class="race-sim-row-team-visual">${Hd(f.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${H(f.team.name)}">${H(f.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${H(Un(Math.max(0,m-f.teamDistanceMeters)))}</strong>
          <strong>${H(f.teamClockSeconds!=null?ut(f.teamClockSeconds):Yn(f.representative.startOffsetSeconds))}</strong>
          ${n.map($=>`<strong>${H(f.splitTimes[$.key]!=null?ut(f.splitTimes[$.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${Qn(f.representative)}">${H(te(f.teamEffectiveSkill))}</strong>
          <strong>${H(xs(f.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${y?"":" hidden"}">${y?Kd(f,r,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),De.set(e,{layoutKey:c,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-s,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:p.length,rowsCreated:p.length,rowsRemoved:0,rowsUpdated:p.length,rowsSkippedInvisible:0,orderChanged:1}}function _r(e,t,a){if(a.stage.profile==="TTT")return Od(e,t,a);const s=performance.now(),r={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=ai(a),{splitMarkers:o}=i,c=vd(t),l=Rs(e),p=l.showSplitColumns?o:[],m=De.get(e);r.prepMs=performance.now()-n;const u=performance.now(),g=Rd(t.riders,a,o,c,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(m==null?void 0:m.orderedRiderIds)??[]);r.sortMs=performance.now()-u;const h=m==null?void 0:m.layoutKey,f=performance.now(),b=si(e,ti(a,p,l.showSplitColumns));r.layoutMs=performance.now()-f;const y=De.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};h!=null&&h!==b&&(e.innerHTML="",y.rowsByRiderId.clear(),y.orderedRiderIds=[]);const $=g.map(E=>E.riderId),F=new Set($),M=performance.now();for(const[E,A]of y.rowsByRiderId)F.has(E)||(A.row.remove(),y.rowsByRiderId.delete(E),r.rowsRemoved+=1);r.removeRowsMs=performance.now()-M;const x=performance.now();for(let E=0;E<g.length;E+=1){const A=g[E],N=i.riderById.get(A.riderId)??null;let D=y.rowsByRiderId.get(A.riderId);D||(D=Bd(A,N,y.openDetailRiderId===A.riderId,p,i.teamById,i.teamAbbreviationById,i.teamNameById),y.rowsByRiderId.set(A.riderId,D),r.rowsCreated+=1)}r.createRowsMs=performance.now()-x;const T=performance.now(),w=y.orderedRiderIds.length===$.length&&y.orderedRiderIds.every((E,A)=>E===$[A]);r.orderCheckMs=performance.now()-T;const C=performance.now();if(!w){const E=document.createDocumentFragment();for(const A of $){const N=y.rowsByRiderId.get(A);N&&E.appendChild(N.row)}e.replaceChildren(E),r.orderChanged=1}r.reorderMs=performance.now()-C;for(let E=0;E<g.length;E+=1){const A=g[E],N=y.rowsByRiderId.get(A.riderId),D=i.riderById.get(A.riderId)??null;if(!N)continue;const L=performance.now();_d(N,E+1,A,D,y.openDetailRiderId===A.riderId,p,a.stage.profile,c,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),r.updateRowsMs+=performance.now()-L,r.rowsUpdated+=1}return De.set(e,{layoutKey:b,orderedRiderIds:$,rowsByRiderId:y.rowsByRiderId,openDetailRiderId:y.openDetailRiderId,openTeamId:y.openTeamId}),r.finalizeMs=performance.now()-(s+r.prepMs+r.sortMs+r.layoutMs+r.removeRowsMs+r.createRowsMs+r.orderCheckMs+r.reorderMs+r.visibilityMs+r.updateRowsMs),r.totalMs=performance.now()-s,r.finalizeMs=Math.max(0,r.totalMs-r.prepMs-r.sortMs-r.layoutMs-r.removeRowsMs-r.createRowsMs-r.orderCheckMs-r.reorderMs-r.visibilityMs-r.updateRowsMs),r}const jd=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],Wd=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],ci=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],di=["Sprint","4","3","2","1","HC"],ya=.2,Vd=7,Ud=100,Yd=3,Zd=50,qd=-2,Xd=1,Jd=2.5,Qd=-3,eu=15,tu=200,au=600,su=850;function ye(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function ka(e){return e==="finish_hill"||e==="finish_mountain"}function $a(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function ui(e,t){return e==="climb_top"||ka(e)&&$a(t)}function Na(e){return Math.round(e*10)/10}function qe(e){return Number(e.toFixed(2))}function vt(e){return`${e.toFixed(2).replace(".",",")} km`}function mi(e){return`${Math.round(e)} hm`}function ru(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function Is(e){return jd.map(t=>`<option value="${t}"${t===e?" selected":""}>${v(t)}</option>`).join("")}function nu(e){return Wd.map(t=>`<option value="${t}"${t===e?" selected":""}>${v(t)}</option>`).join("")}function iu(e,t="start",a=0,s=1){const r=ci.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start"||i==="sprint_intermediate":i==="start"||i==="climb_start"?!1:ye(i)?a===s-1:i==="climb_top"||i==="sprint_intermediate");return(r.includes(e)?r:[e,...r.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${v(i)}</option>`).join("")}function ou(e){return['<option value="">–</option>',...di.map(t=>`<option value="${t}"${t===e?" selected":""}>${v(t)}</option>`)].join("")}function Gr(e){return ci.indexOf(e)}function Re(e){return[...e].sort((t,a)=>Gr(t.type)-Gr(a.type))}function _t(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:Re(e[0].markers)}];let a=0;return e.forEach(s=>{a=qe(a+s.lengthKm);const r=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),n=t[t.length-1];n.terrain=s.terrain,n.techLevel=s.techLevel,n.windExp=s.windExp,n.markers=Re([...n.markers,...s.markers]),t.push({kmMark:a,elevation:r,terrain:s.terrain,techLevel:s.techLevel,windExp:s.windExp,markers:Re(s.endMarkers)})}),t}function lu(e){return e?" stage-editor-input-invalid":""}function Fs(e,t){const a=e.segments[t];if(!a)return[];const s=[],r=cu(e).get(t)??[];return a.lengthKm<ya&&s.push(`Laenge unter ${ya.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&s.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&s.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&s.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>ye(n.type))&&s.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&s.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>ye(n.type))&&s.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{ye(n.type)&&s.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&s.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&s.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&s.push(`${n.type} gehoert in den Startmarker-Slot.`),ui(n.type,n.cat)&&!$a(n.cat)&&s.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&s.push("Sprintmarker erlaubt nur Kategorie Sprint."),ye(n.type)&&!ka(n.type)&&n.cat!=null&&s.push("finish_flat und finish_TT duerfen keine Kategorie haben."),ka(n.type)&&n.cat!=null&&!$a(n.cat)&&s.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),s.push(...r),[...new Set(s)]}function cu(e){const t=new Map,a=[],s=(r,n)=>{const i=t.get(r)??[];i.push(n),t.set(r,i)};return e.segments.forEach((r,n)=>{r.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),r.endMarkers.forEach(i=>{var l;if(!ui(i.type,i.cat))return;if(!i.name){s(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let p=a.length-1;p>=0;p-=1)if(((l=a[p])==null?void 0:l.name)===i.name){o=p;break}const c=o>=0?o:a.length-1;if(c<0){s(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(c,1)})}),a.forEach(r=>{const n=r.name?` "${r.name}"`:"";s(r.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function du(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:ka(e.type)?{...e,cat:$a(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function pi(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:uu(e.waypoints??[])).map(s=>({...s,startElevation:Math.round(s.startElevation),lengthKm:Number.isFinite(s.lengthKm)?qe(s.lengthKm):ya,gradientPercent:Number.isFinite(s.gradientPercent)?Na(s.gradientPercent):0,techLevel:Number.isFinite(s.techLevel)?s.techLevel:5,windExp:Number.isFinite(s.windExp)?s.windExp:5,markers:Hr(s.markers),endMarkers:Hr(s.endMarkers)})),waypoints:[]};return et(t),t}function uu(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const s=e[a],r=e[a+1],n=qe(r.kmMark-s.kmMark),i=r.elevation-s.elevation,o=Na(n>0?i/(n*10):0);t.push({startElevation:s.elevation,lengthKm:n,gradientPercent:o,techLevel:s.techLevel??5,windExp:s.windExp??5,terrain:s.terrain??"Flat",markers:s.markers??[],endMarkers:r.markers??[]})}return t}function Hr(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function mu(e,t,a){const s=e*a*8+t/12;return s>=95?"HC":s>=68?"1":s>=46?"2":s>=28?"3":"4"}function zr(e){const t=[];let a=null,s=null,r=0;const n=i=>{if(a==null||i==null||i<=a){a=null,s=null,r=0;return}const o=e[a],c=e[i],l=c.kmMark-o.kmMark,p=Math.max(0,c.elevation-o.elevation),m=l>0?p/(l*10):0;p>=Ud&&m>=Yd&&t.push({startKm:qe(o.kmMark),endKm:qe(c.kmMark),distanceKm:qe(l),gainMeters:Math.round(p),avgGradient:Na(m),category:mu(l,p,m),startIndex:a,topIndex:i,topElevation:Math.round(c.elevation)}),a=null,s=null,r=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],c=e[i],l=c.elevation-o.elevation;if(a==null&&l>0){a=i-1,s=i,r=0;continue}if(a!=null){if(l>=0){(s==null||c.elevation>=e[s].elevation)&&(s=i),r=0;continue}r+=Math.abs(l),r>=Zd&&n(s)}}return n(s),t}function pu(e){const t=e.segments.some(r=>r.terrain==="Cobble_Hill"),a=e.segments.some(r=>r.terrain==="Cobble"),s=e.climbs.some(r=>r.category==="HC"||r.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":s&&e.elevationGainMeters>=2800?"High_Mountain":s||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function na(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function gu(e){return e.gainMeters>=au&&e.topElevation>=su?"Mountain":e.gainMeters>tu?"Medium_Mountain":"Hill"}function fu(e){return e.gradientPercent<Qd?"Abfahrt":e.gradientPercent<Jd||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<eu?"Flat":"Hill"}function hu(e){if(e.segments.length===0)return;if(e.waypoints=_t(e.segments),e.sourceFormat==="csv"){const i=zr(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:c,topElevation:l,...p})=>p);return}const t=e.segments.map(i=>i.manualTerrain||na(i.terrain)?i.terrain:fu(i)),a=zr(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:c,...l})=>l),a.forEach(i=>{const o=gu(i);if(o)for(let c=i.startIndex;c<i.topIndex;c+=1)e.segments[c].manualTerrain||na(t[c])||(t[c]=o)});let s=null,r=0;const n=i=>{if(s==null||r<=Xd){s=null,r=0;return}for(let o=s;o<i;o+=1)!(e.segments[o].manualTerrain||na(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");s=null,r=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<qd){s==null&&(s=i),r+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{na(i.terrain)||(i.terrain=t[o])}),e.waypoints=_t(e.segments),e.suggestedProfile=pu(e)}function et(e){bu(e),Kr(e),hu(e),e.waypoints=_t(e.segments),Kr(e)}function bu(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,s)=>{const r={...a,startElevation:Math.round(s===0?a.startElevation:t),lengthKm:qe(a.lengthKm),gradientPercent:Na(a.gradientPercent),markers:Re(a.markers),endMarkers:Re(a.endMarkers)};return t=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),r}),e.waypoints=_t(e.segments)}function Kr(e){e.totalDistanceKm=qe(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,s)=>{if(s===0)return 0;const r=a.elevation-e.waypoints[s-1].elevation;return t+Math.max(0,r)},0)}function Ue(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(s=>s.type==="start")||(t.markers=Re([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(s=>ye(s.type))||(a.endMarkers=Re([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=_t(e.segments))}function Su(e,t,a,s){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((r,n)=>{const i=s==="start"&&t===0&&r.type==="start",o=e.filter(p=>ye(p.type)).length,c=s==="end"&&t===a-1&&ye(r.type)&&o===1,l=!(i||c);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${s}" data-marker-index="${n}">${iu(r.type,s,t,a)}</select>
        <input type="text" value="${v(r.name??"")}" data-field="markerName" data-marker-scope="${s}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${s}" data-marker-index="${n}">${ou(r.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${s}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function Or(e,t,a,s){const r=s==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${Su(e,t,a,s)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${s}" data-segment-index="${t}">${r}</button>
    </div>`}function vu(e,t,a,s,r){if(!d.stageEditorDraft)return;const n=d.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(s==="markerType"){o.type=r;const c=du(o);if(o.name=c.name,o.cat=c.cat,ye(o.type)){const l=i.filter((p,m)=>m===t||!ye(p.type));a==="start"?n.markers=l:n.endMarkers=l}}else s==="markerName"?o.name=r.trim()||null:s==="markerCat"&&(o.cat=r||null);a==="start"?n.markers=Re(n.markers):n.endMarkers=Re(n.endMarkers),et(d.stageEditorDraft),Ue(d.stageEditorDraft),Te()}}function yu(e,t){if(!d.stageEditorDraft)return;const a=d.stageEditorDraft.segments[e];if(!a)return;const s=t==="start"?e===0&&!a.markers.some(r=>r.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===d.stageEditorDraft.segments.length-1&&!a.endMarkers.some(r=>ye(r.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(s),a.markers=Re(a.markers)):(a.endMarkers.push(s),a.endMarkers=Re(a.endMarkers)),et(d.stageEditorDraft),Ue(d.stageEditorDraft),Te()}function ku(e,t,a){if(!d.stageEditorDraft)return;const s=d.stageEditorDraft.segments[e];s&&(a==="start"?s.markers.splice(t,1):s.endMarkers.splice(t,1),et(d.stageEditorDraft),Ue(d.stageEditorDraft),Te())}function $u(){S("stage-editor-profile").innerHTML=Is("Flat"),S("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',S("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>'}function gi(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function fi(e){const t=new Set(e.filter(s=>Number.isInteger(s)&&s>0));let a=1;for(;t.has(a);)a+=1;return a}function Tu(){return fi(d.stageEditorExistingStages.map(e=>e.stageId))}function Mu(){return fi([...d.stageEditorExistingStages.map(e=>e.raceId),...d.races.map(e=>e.id)])}function wu(e){var r;const t=S("stage-editor-profile");t.innerHTML=Is(e.suggestedProfile),t.value=e.suggestedProfile,S("stage-editor-stage-id").value=String(Tu()),S("stage-editor-race-id").value=String(Mu());const a=S("stage-editor-details-file");a.value.trim()||(a.value=`${ru(e.routeName)}.csv`);const s=S("stage-editor-date");!s.value&&((r=d.gameState)!=null&&r.currentDate)&&(s.value=d.gameState.currentDate)}function xu(e){S("stage-editor-stage-id").value=String(e.stageId),S("stage-editor-race-id").value=String(e.raceId),S("stage-editor-stage-number").value=String(e.stageNumber),S("stage-editor-date").value=e.date,S("stage-editor-details-file").value=e.detailsCsvFile;const t=S("stage-editor-profile");t.innerHTML=Is(e.profile),t.value=e.profile,S("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),S("stage-editor-final-push-start").value=String(e.finalPushStartPercent),S("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),S("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),S("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier)}function hi(e){var s;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((s=e.segments[0])!=null&&s.markers.some(r=>r.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(r=>ye(r.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((r,n)=>{Fs(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...r.markers??[],...r.endMarkers??[]].forEach(i=>{i.cat!=null&&!di.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function bi(){const e=[],t=Number(S("stage-editor-stage-id").value),a=Number(S("stage-editor-race-id").value),s=Number(S("stage-editor-stage-number").value),r=S("stage-editor-date").value.trim(),n=S("stage-editor-details-file").value.trim(),i=Number(S("stage-editor-final-spread-start").value),o=Number(S("stage-editor-final-push-start").value),c=Number(S("stage-editor-final-spread-difficulty").value),l=Number(S("stage-editor-crash-multiplier").value),p=Number(S("stage-editor-mechanical-multiplier").value);return(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(s)||s<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(r)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(c)||c<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(p)||p<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),e}function Ru(){var e,t;return{stageId:Number(S("stage-editor-stage-id").value),raceId:Number(S("stage-editor-race-id").value),stageNumber:Number(S("stage-editor-stage-number").value),date:S("stage-editor-date").value.trim(),profile:S("stage-editor-profile").value,detailsCsvFile:S("stage-editor-details-file").value.trim(),startElevation:((t=(e=d.stageEditorDraft)==null?void 0:e.segments[0])==null?void 0:t.startElevation)??0,finalSpreadStartPercent:Number(S("stage-editor-final-spread-start").value),finalPushStartPercent:Number(S("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(S("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(S("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(S("stage-editor-mechanical-multiplier").value)}}function Iu(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function Fu(e){return["gainMeters","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function Pa(e,t,a){const r=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-r*118),i=54,o=.14+r*.12,c=.26+r*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${c};`}">${Math.round(e)}</span>`}function Es(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),s=Math.round(40-t*22),r=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${r};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function Eu(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function Cu(e,t,a,s){const r=s!=null?` data-stage-profile-open-climb-id="${v(s)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${r}>${e}</button>`}function Nu(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",s=e.profileScore??e.score,r=[...d.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=r.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-climbs stage-editor-score-popover-grid-head">
        <span>Nr.</span>
        <span>Name</span>
        <span class="text-right">Score</span>
        <span class="text-right">Länge</span>
        <span class="text-right">Ø %</span>
      </div>
      ${r.map(i=>`
        <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-climbs">
          <span class="text-muted">${i.climbIndex}</span>
          <span>${v(i.name)}</span>
          <span class="text-right">${Es(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${Pa(s,0,100)}
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact stage-editor-score-popover-grid-head stage-editor-score-popover-grid-head-compact">
        <span>Kriterium</span>
        <span class="text-right">Wert</span>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Distanz</span>
        <strong class="text-right">${t(e.distanceKm)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Höhenmeter</span>
        <strong class="text-right">${a(e.elevationGainMeters)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Profil</span>
        <strong class="text-right">${e.profile??"—"}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Sprints</span>
        <strong class="text-right">${e.sprintCount??"—"}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact" style="margin-bottom:0.5rem">
        <span>Anstiege</span>
        <strong class="text-right">${e.climbCount??"—"}</strong>
      </div>
      ${n}
    </div>`}function Pu(e){const t=r=>r!=null?`${r.toFixed(1).replace(".",",")} km`:"—",a=r=>r!=null?`${Math.round(r).toLocaleString("de-DE")} m`:"—",s=r=>r!=null?`${r.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${Es(e.climbScore??0)}
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact stage-editor-score-popover-grid-head stage-editor-score-popover-grid-head-compact">
        <span>Kriterium</span>
        <span class="text-right">Wert</span>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Länge</span>
        <strong class="text-right">${t(e.distanceKm)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Höhenmeter</span>
        <strong class="text-right">${a(e.gainMeters)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Ø Steigung</span>
        <strong class="text-right">${s(e.avgGradient)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Max Steigung</span>
        <strong class="text-right">${s(e.maxGradient)}</strong>
      </div>
    </div>`}function Si(e,t,a,s,r,n,i,o){const c=o??Pa(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${Cu(c,s,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${r}
      </div>
    </div>`}function ae(e,t,a,s,r){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?s==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${r}-sort="${t}">
        <span class="team-table-sort-label">${v(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function It(){const e=S("stage-editor-stages-table"),t=S("stage-editor-stages-empty"),a=S("stage-editor-stages-meta"),s=e.querySelector("thead"),r=e.querySelector("tbody");if(!r)return;const n=d.stageEditorStagesSort.key,i=d.stageEditorStagesSort.direction;s&&(s.innerHTML=`<tr>
      ${ae("ID","stageId",n,i,"stages")}
      ${ae("Land","countryCode",n,i,"stages")}
      ${ae("Rennen","raceName",n,i,"stages")}
      ${ae("Etappe","stageNumber",n,i,"stages")}
      ${ae("Score","profileScore",n,i,"stages")}
      ${ae("Profil","profile",n,i,"stages")}
      ${ae("Distanz","distanceKm",n,i,"stages")}
      ${ae("Höhenmeter","elevationGainMeters",n,i,"stages")}
      ${ae("Sprints","sprintCount",n,i,"stages")}
      ${ae("Climbs","climbCount",n,i,"stages")}
    </tr>`);const o=Du(d.stageEditorStageRows);r.innerHTML=o.map(c=>`
    <tr>
      <td>${c.stageId}</td>
      <td>${oe(c.countryCode||"")}</td>
      <td><strong>${v(c.raceName)}</strong></td>
      <td><strong>${v(Ot({stageNumber:c.stageNumber}))}</strong></td>
      <td>${Si(c.profileScore,0,100,c.stageId,Nu(c),Da({name:c.raceName},{stageNumber:c.stageNumber,profile:c.profile}))}</td>
      <td>${jt(c.profile)}</td>
      <td>${vt(c.distanceKm)}</td>
      <td>${mi(c.elevationGainMeters)}</td>
      <td>${c.sprintCount} Sprints</td>
      <td>${c.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${d.stageEditorStageRows.length} vorhandene Etappen`}function Ft(){const e=S("stage-editor-climbs-table"),t=S("stage-editor-climbs-empty"),a=S("stage-editor-climbs-meta"),s=e.querySelector("thead"),r=e.querySelector("tbody");if(!r)return;const n=d.stageEditorClimbsSort.key,i=d.stageEditorClimbsSort.direction;s&&(s.innerHTML=`<tr>
      ${ae("km","placementKm",n,i,"climbs")}
      ${ae("Name","name",n,i,"climbs")}
      ${ae("Kat.","category",n,i,"climbs")}
      ${ae("Score","climbScore",n,i,"climbs")}
      ${ae("Land","countryCode",n,i,"climbs")}
      ${ae("Rennen","raceName",n,i,"climbs")}
      ${ae("Etappe","stageNumber",n,i,"climbs")}
      ${ae("Höhenmeter","gainMeters",n,i,"climbs")}
      ${ae("Distanz","distanceKm",n,i,"climbs")}
      ${ae("Ø Steigung","avgGradient",n,i,"climbs")}
      ${ae("Max Steigung","maxGradient",n,i,"climbs")}
    </tr>`);const o=Bu(d.stageEditorClimbRows);r.innerHTML=o.map(c=>`
    <tr>
      <td>${c.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${v(c.name)}</strong></td>
      <td>${Eu(c.category)}</td>
      <td>${Si(c.climbScore,0,350,c.stageId,Pu(c),Da({name:c.raceName},{stageNumber:c.stageNumber,profile:"Mountain"}),c.id,Es(c.climbScore))}</td>
      <td>${oe(c.countryCode||"")}</td>
      <td><strong>${v(c.raceName)}</strong></td>
      <td><strong>${v(Ot({stageNumber:c.stageNumber}))}</strong></td>
      <td>${mi(c.gainMeters)}</td>
      <td>${vt(c.distanceKm)}</td>
      <td>${c.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${c.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${d.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function Lu(e=!1){if(d.stageEditorOverviewLoaded&&!e){It(),Ft();return}d.stageEditorOverviewLoading=!0,It(),Ft();const t=await G.getStageEditorOverview();if(d.stageEditorOverviewLoading=!1,d.stageEditorOverviewLoaded=!0,!t.success||!t.data){d.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),It(),Ft();return}d.stageEditorStageRows=t.data.stages,d.stageEditorClimbRows=t.data.climbs,It(),Ft()}function Au(){const e=S("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+d.stageEditorExistingStages.map(a=>{const s=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${v(a.raceName)} · Etappe ${a.stageNumber}${s}</option>`}).join("")}function Du(e){const t=d.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{let r=0;switch(d.stageEditorStagesSort.key){case"stageId":r=a.stageId-s.stageId;break;case"countryCode":r=(a.countryCode||"").localeCompare(s.countryCode||"","de");break;case"raceName":r=a.raceName.localeCompare(s.raceName,"de");break;case"stageNumber":r=a.stageNumber-s.stageNumber;break;case"profile":r=a.profile.localeCompare(s.profile,"de");break;case"distanceKm":r=a.distanceKm-s.distanceKm;break;case"elevationGainMeters":r=a.elevationGainMeters-s.elevationGainMeters;break;case"sprintCount":r=a.sprintCount-s.sprintCount;break;case"climbCount":r=a.climbCount-s.climbCount;break;case"profileScore":r=a.profileScore-s.profileScore;break}return r*t||a.stageId-s.stageId})}function Bu(e){const t=d.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{let r=0;switch(d.stageEditorClimbsSort.key){case"placementKm":r=a.placementKm-s.placementKm;break;case"name":r=a.name.localeCompare(s.name,"de");break;case"category":r=(a.category??"").localeCompare(s.category??"","de");break;case"countryCode":r=(a.countryCode||"").localeCompare(s.countryCode||"","de");break;case"raceName":r=a.raceName.localeCompare(s.raceName,"de");break;case"stageNumber":r=a.stageNumber-s.stageNumber;break;case"gainMeters":r=a.gainMeters-s.gainMeters;break;case"distanceKm":r=a.distanceKm-s.distanceKm;break;case"avgGradient":r=a.avgGradient-s.avgGradient;break;case"maxGradient":r=a.maxGradient-s.maxGradient;break;case"climbScore":r=a.climbScore-s.climbScore;break}return r*t||a.placementKm-s.placementKm})}function _u(e){return e.map(t=>t.type).join(" | ")}function Te(){Au();const e=d.stageEditorDraft,t=S("stage-editor-import-summary"),a=S("stage-editor-warnings"),s=S("stage-editor-climbs"),r=S("stage-editor-empty"),n=S("stage-editor-chart"),i=S("stage-editor-waypoints-body"),o=S("stage-editor-export-hint"),c=S("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",s.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',r.classList.remove("hidden"),n.innerHTML=jr(null),i.innerHTML=`<tr><td colspan="${Vd}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",c.disabled=!0;return}r.classList.add("hidden");const l=hi(e),p=bi();t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${v(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${vt(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${v(e.suggestedProfile)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const m=[...e.warnings,...l,...p];a.innerHTML=m.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':m.map(u=>`<div class="stage-editor-alert">${v(u)}</div>`).join(""),s.innerHTML=e.climbs.length===0?'<p class="text-muted">Keine relevanten Climb-Vorschläge erkannt.</p>':e.climbs.map(u=>`
      <div class="stage-editor-climb">
        <strong>Kat. ${v(u.category)}</strong>
        <span>${vt(u.startKm)} - ${vt(u.endKm)}</span>
        <span>${u.gainMeters} hm · ${u.avgGradient.toFixed(1).replace(".",",")}%</span>
      </div>`).join(""),n.innerHTML=jr(e),i.innerHTML=e.segments.map((u,g)=>`
    <tr data-segment-index="${g}" class="${Fs(e,g).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${g+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${u.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${lu(u.lengthKm<ya)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${u.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${nu(u.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${Or(u.markers,g,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${Or(u.endMarkers,g,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div class="text-muted" style="min-width:3.5rem;">${gi(u)} m</div>
          ${Gu(e,g)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${g}">+</button>
          ${g===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${g}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${g}">✕</button>`:""}
        </div>
      </td>
    </tr>`).join(""),c.disabled=m.length>0,o.textContent=m.length>0?`${m.length} Validierungshinweise vor dem Export.`:`Exportiert ${S("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function Gu(e,t){const a=Fs(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(s=>`<div>${v(s)}</div>`).join("")}</div>`}function jr(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,s=24,r=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(h=>h.elevation)),c=Math.max(...n.map(h=>h.elevation)),l=Math.max(1,c-o),p=n.map(h=>{const f=s+h.kmMark/Math.max(i,.1)*(t-s*2),b=a-r-(h.elevation-o)/l*(a-r*2);return{x:f,y:b,waypoint:h}}),m=p.map((h,f)=>`${f===0?"M":"L"} ${h.x.toFixed(1)} ${h.y.toFixed(1)}`).join(" "),u=`${m} L ${(t-s).toFixed(1)} ${(a-r).toFixed(1)} L ${s.toFixed(1)} ${(a-r).toFixed(1)} Z`,g=p.filter(h=>h.waypoint.markers.length>0).map(h=>`
      <line x1="${h.x.toFixed(1)}" y1="${r}" x2="${h.x.toFixed(1)}" y2="${(a-r).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${h.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${v(_u(h.waypoint.markers))}</text>`).join("");return`
    <svg viewBox="0 0 ${t} ${a}" role="img" aria-label="Stage-Profil ${v(e.routeName)}">
      <defs>
        <linearGradient id="stage-editor-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(96, 165, 250, 0.38)"></stop>
          <stop offset="100%" stop-color="rgba(14, 165, 233, 0.04)"></stop>
        </linearGradient>
      </defs>
      <line x1="${s}" y1="${a-r}" x2="${t-s}" y2="${a-r}" class="stage-editor-chart-axis" />
      <line x1="${s}" y1="${r}" x2="${s}" y2="${a-r}" class="stage-editor-chart-axis" />
      ${g}
      <path d="${u}" fill="url(#stage-editor-area)"></path>
      <path d="${m}" class="stage-editor-chart-line"></path>
      ${p.map(h=>`<circle cx="${h.x.toFixed(1)}" cy="${h.y.toFixed(1)}" r="3.5" class="stage-editor-chart-point"></circle>`).join("")}
      <text x="${s}" y="${r-4}" class="stage-editor-chart-scale">${Math.round(c)} m</text>
      <text x="${s}" y="${a-4}" class="stage-editor-chart-scale">${Math.round(o)} m</text>
      <text x="${t-s}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${vt(i)}</text>
    </svg>`}function Hu(e,t,a){const s=d.stageEditorDraft;if(!s)return;const r=s.segments[e];r&&(t==="startElevation"?r.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?r.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?r.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(r.terrain=a,r.manualTerrain=!0):t==="techLevel"?r.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(r.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),et(s),Ue(s),Te())}function zu(e){const t=d.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const s={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,s),et(t),Ue(t),Te()}function Ku(){const e=d.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],s={startElevation:t?gi(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(s),et(e),Ue(e),Te()}function Ou(e){const t=d.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),et(t),Ue(t),Te()))}async function ju(){var a;const t=(a=S("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}S("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,ue("Route wird importiert……");try{const s=await t.text(),r=await G.importStageRoute({fileName:t.name,fileContent:s});if(!r.success||!r.data){alert(`Import fehlgeschlagen: ${r.error??"Unbekannter Fehler"}`);return}const n=pi(r.data);d.stageEditorDraft=n,Ue(n),wu(n),Te(),pt("stage-editor")}finally{ce()}}async function Wu(){const e=Number(S("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}ue("CSV-Stage wird geladen...");try{const t=await G.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=pi(t.data.draft);d.stageEditorDraft=a,Ue(a),xu(t.data.metadata),Te(),pt("stage-editor")}finally{ce()}}async function Vu(){if(!d.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...hi(d.stageEditorDraft),...bi()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),Te();return}ue("CSV-Dateien werden erstellt……");try{const t=await G.exportStageRoute({metadata:Ru(),draft:d.stageEditorDraft});if(!t.success||!t.data){alert(`Export fehlgeschlagen: ${t.error??"Unbekannter Fehler"}`);return}rs(t.data.stagesFileName,t.data.stagesCsv),rs(t.data.stageDetailsFileName,t.data.stageDetailsCsv)}finally{ce()}}function Uu(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",o=>{const c=o.target.closest("button[data-stage-editor-stages-sort]");if(!c)return;const l=c.dataset.stageEditorStagesSort;d.stageEditorStagesSort.key===l?d.stageEditorStagesSort.direction=d.stageEditorStagesSort.direction==="asc"?"desc":"asc":d.stageEditorStagesSort={key:l,direction:Iu(l)},It()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",o=>{const c=o.target.closest("button[data-stage-editor-climbs-sort]");if(!c)return;const l=c.dataset.stageEditorClimbsSort;d.stageEditorClimbsSort.key===l?d.stageEditorClimbsSort.direction=d.stageEditorClimbsSort.direction==="asc"?"desc":"asc":d.stageEditorClimbsSort={key:l,direction:Fu(l)},Ft()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{ju()});const s=document.getElementById("btn-stage-editor-load-existing");s&&s.addEventListener("click",()=>{Wu()});const r=document.getElementById("btn-stage-editor-export");r&&r.addEventListener("click",()=>{Vu()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",o=>{var l;const c=((l=o.target.files)==null?void 0:l[0])??null;S("stage-editor-file-hint").textContent=c?`${c.name} · ${(c.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",o=>{const c=o.target,l=c.closest("tr[data-segment-index]"),p=c.dataset.field;if(!l||!p)return;const m=Number(l.dataset.segmentIndex);if(Number.isInteger(m)){if(p==="markerType"||p==="markerName"||p==="markerCat"){const u=Number(c.dataset.markerIndex),g=c.dataset.markerScope;if(!Number.isInteger(u)||g!=="start"&&g!=="end")return;vu(m,u,g,p,c.value);return}Hu(m,p,c.value)}}),i.addEventListener("click",o=>{const c=o.target.closest("button[data-segment-action]");if(!c)return;const l=Number(c.dataset.segmentIndex);if(Number.isInteger(l)){if(c.dataset.segmentAction==="insert"){zu(l);return}if(c.dataset.segmentAction==="append"){Ku();return}if(c.dataset.segmentAction==="add-marker"){const p=c.dataset.markerScope;if(p!=="start"&&p!=="end")return;yu(l,p);return}if(c.dataset.segmentAction==="remove-marker"){const p=Number(c.dataset.markerIndex),m=c.dataset.markerScope;if(!Number.isInteger(p)||m!=="start"&&m!=="end")return;ku(l,p,m);return}c.dataset.segmentAction==="delete"&&Ou(l)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(o=>{const c=document.getElementById(o);c&&c.addEventListener("change",()=>Te())})}let We=[],bt=null;const ft=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"],q={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function Ta(e,t,a){const s=Ra(e??null);return`<span class="badge badge-race-category" style="${Ia(s)}; white-space: nowrap; display: inline-block;">${v(e??"Unbekannt")}</span>`}function Cs(e){if(!e)return"-";const t=Ra(e);return`<span class="badge badge-race-category" style="${Ia(t)}; white-space: nowrap; display: inline-block;">${v(e)}</span>`}function Yu(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function Zu(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${Yu(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function vi(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";default:return""}}function Ns(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";default:return"Etappe"}}function qu(e){return`<span class="rider-stats-final-type ${vi(e)}">${v(Ns(e))}</span>`}function ee(e,t,a){let s="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?s+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?s+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?s+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?s+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?s+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?s+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(s+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${s}" title="${v(a)}: ${e} Siege">${e}</span>`}function Xu(e){return`${e.startDate===e.endDate?se(e.startDate):`${se(e.startDate)} - ${se(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function Ma(e){if(e==null||d.riders.length===0)return null;const a=[...d.riders].sort((s,r)=>(r.seasonPoints??0)-(s.seasonPoints??0)||(r.seasonWins??0)-(s.seasonWins??0)||r.overallRating-s.overallRating||`${s.lastName} ${s.firstName}`.localeCompare(`${r.lastName} ${r.firstName}`,"de")||s.id-r.id).findIndex(s=>s.id===e);return a>=0?a+1:null}function Wr(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;default:return 4}}function Ju(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||Wr(t.rowType)-Wr(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function Qu(e){return[...e].map(t=>({...t,rows:Ju(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function yi(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,s=36;const r=Math.max(50,Math.min(85,e));for(let c=1;c<t.length;c++){const l=t[c-1],p=t[c];if(r<=p.score){const m=(r-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*m),s=Math.round(l.lightness+(p.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function Ye(e,t,a,s){const r=s>0?Math.max(0,Math.min(1,a/s)):.5,n=Math.round(6+r*118),i=.26+r*.18,o=.14+r*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${v(t)}">${e} ${a}</span>`}function Va(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function Ua(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return q.mountain;case"Hill":return q.hilly;case"Sprint":return q.sprint;case"Timetrial":return q.timetrial;case"Cobble":return q.cobble;case"Attacker":return q.attacker;default:return""}}function Ie(e,t,a,s,r){var B,_,U;const n=(t==null?void 0:t.countryCode)??s??null,i=n?oe(n):r,o=(t==null?void 0:t.roleName)??((B=e==null?void 0:e.role)==null?void 0:B.name)??"Ohne Rolle",c=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,p=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",m=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",u=((_=t==null?void 0:t.program)==null?void 0:_.name)??((U=e==null?void 0:e.seasonProgram)==null?void 0:U.name)??"-",g=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,h=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,f=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,b=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,y=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,$=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,F=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",M=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,x=(t==null?void 0:t.currentSeasonRank)??Ma((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),T=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,w=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,C=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,E=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},A=Math.max(E.flat,E.hilly,E.mediumMountain,E.mountain,E.timetrial,E.cobble),N=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},D=Math.max(N.stageRace,N.oneDay),L=e!=null&&e.specialization1?Va(e.specialization1):"-",P=e!=null&&e.specialization2?Va(e.specialization2):"-",V=e!=null&&e.specialization3?Va(e.specialization3):"-",J=Ua((e==null?void 0:e.specialization1)??null),R=Ua((e==null?void 0:e.specialization2)??null),I=Ua((e==null?void 0:e.specialization3)??null);return`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${v(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?kt(l,p):""} <span>${v(p)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${v(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${gn(m)} <span>Form</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${yi(c)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${q.seasonForm} ${g>=0?"+":""}${g}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${q.raceForm} ${h>=0?"+":""}${h}</span>
        <span class="rider-stats-icon-pill" title="Programm">${v(u)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${q.raceDays} <span class="rider-stats-icon-pill-value">${f}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${b>14?"text-warning":""}" title="30-Tage Renntage">${q.rollingRaceDays} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${q.longFatigue} <span class="rider-stats-icon-pill-value">${y}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${F!=="none"?"text-error":""}" title="Kurzzeitfatigue">${q.shortFatigue} <span class="rider-stats-icon-pill-value">${$}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${q.seasonPoints} <span class="rider-stats-icon-pill-value">${M}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${q.rank} <span class="rider-stats-icon-pill-value">${Zu(x)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${q.raceDays} <span class="rider-stats-icon-pill-value">${T}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${q.wins} <span class="rider-stats-icon-pill-value">${w}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${J} ${v(L)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${R} ${v(P)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${I} ${v(V)}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${Ye(q.stageRace,"Rundfahrten Punkte",N.stageRace,D)}
        ${Ye(q.oneDay,"Eintagesrennen Punkte",N.oneDay,D)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${q.breakaway} <span class="rider-stats-icon-pill-value">${C}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${Ye(q.flat,"Flach-Punkte",E.flat,A)}
        ${Ye(q.hilly,"Hügel-Punkte",E.hilly,A)}
        ${Ye(q.mediumMountain,"Mittelgebirge-Punkte",E.mediumMountain,A)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${Ye(q.mountain,"Hochgebirge-Punkte",E.mountain,A)}
        ${Ye(q.timetrial,"Zeitfahren-Punkte",E.timetrial,A)}
        ${Ye(q.cobble,"Kopfsteinpflaster-Punkte",E.cobble,A)}
      </div>
    </div>
  `}function Vr(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",s=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${v(a)} <strong>${v(s)}</strong>`}function Fe(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${d.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${d.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${d.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${d.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${d.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${d.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${d.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
    </div>`}function em(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,s=36;const r=Math.max(55,Math.min(80,e));for(let c=1;c<t.length;c++){const l=t[c-1],p=t[c];if(r<=p.score){const m=(r-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*m),s=Math.round(l.lightness+(p.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function tm(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},s=["mountain","hill","sprint","timeTrial","cobble","attack"],r=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,c=i/2,l=160,p=60,m=85,u=m-p,g=N=>{const D=[];for(let L=0;L<6;L++){const P=L*Math.PI/3-Math.PI/2;D.push(`${o+N*Math.cos(P)},${c+N*Math.sin(P)}`)}return D},h=`
    <defs>
      <radialGradient id="radarBgGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(30,32,48,0.95)" />
        <stop offset="100%" stop-color="rgba(15,16,28,0.98)" />
      </radialGradient>
      <linearGradient id="riderFillGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(129,140,248,0.45)" />
        <stop offset="100%" stop-color="rgba(79,70,229,0.20)" />
      </linearGradient>
      <filter id="radarGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>`,f=`<circle cx="${o}" cy="${c}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let b="";for(let N=p;N<=m;N+=2.5){const D=l*((N-p)/u);if(D<1){b+=`<circle cx="${o}" cy="${c}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const L=g(D),P=N%5===0,V=P?1:.6,J=P?"none":"4,4",R=P?.4:.18;b+=`<polygon points="${L.join(" ")}" fill="none" stroke="rgba(255,255,255,${R})" stroke-width="${V}" stroke-dasharray="${J}" />`,P&&N>p&&(b+=`<text x="${o+5}" y="${c-D+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${N}</text>`)}let y="",$="";for(let N=0;N<6;N++){const D=N*Math.PI/3-Math.PI/2,L=o+l*Math.cos(D),P=c+l*Math.sin(D);y+=`<line x1="${o}" y1="${c}" x2="${L}" y2="${P}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const V=l+28,J=o+V*Math.cos(D),R=c+V*Math.sin(D),I=Math.cos(D);let B="middle";I>.15?B="start":I<-.15&&(B="end");const _=a[s[N]]??p;$+=`<text x="${J}" y="${R}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${B}" dominant-baseline="middle">${r[N]}</text>`,$+=`<text x="${J}" y="${R+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${B}" dominant-baseline="middle">${_}</text>`}const F=[],M=[];s.forEach((N,D)=>{const L=a[N]??p,P=l*((Math.max(p,Math.min(m,L))-p)/u),V=D*Math.PI/3-Math.PI/2,J=o+P*Math.cos(V),R=c+P*Math.sin(V);F.push(`${J},${R}`),M.push(`<circle cx="${J}" cy="${R}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${r[D]}: ${L}</title></circle>`)});const x=`<polygon points="${F.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,w=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((N,D)=>{const L=a[N.key]??60;return(a[D.key]??60)-L}),C=[],E=[];w.forEach((N,D)=>{const L=a[N.key]??60,P=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${N.label}</span>
        ${em(L)}
      </div>
    `;D%2===0?C.push(P):E.push(P)});const A=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${C.join("")}</div>
      <div class="skills-col">${E.join("")}</div>
    </div>
  `;return`
    <section class="rider-stats-skills-tab" style="margin-top: 1rem;">
      <div class="rider-stats-skills-container" style="display: grid; grid-template-columns: 540px 1fr; gap: 2rem; align-items: start; background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-primary);">
        <div class="skills-radar-wrapper" style="display: flex; justify-content: center; align-items: center; background: var(--bg-900); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-primary);">
          <svg width="540" height="440" viewBox="0 0 ${n} ${i}" style="overflow: visible;">
            ${h}
            ${f}
            ${b}
            ${y}
            ${x}
            ${M.join("")}
            ${$}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${A}
        </div>
      </div>
    </section>
  `}function am(e,t){const a=t.shortTermFatigueMalus??0,s=t.longTermFatigueDecayable??0,r=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),c=(s/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const p=t.fatigueHistory??[];let m="";return p.length===0?m='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':m=p.map(u=>{const g=se(u.date);let h="";u.type==="race"?h=`${v(u.raceName)}${u.stageNumber!=null?` - Etappe ${u.stageNumber}`:""}`:h=u.raceName?v(u.raceName):"Regeneration";const f=u.type==="race"&&u.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${u.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let b="";u.shortChange>0?b=`<span style="color: #ef4444; font-weight: 600;">+${u.shortChange.toFixed(2).replace(".",",")}</span>`:u.shortChange<0?b=`<span style="color: #2ecc71; font-weight: 600;">${u.shortChange.toFixed(2).replace(".",",")}</span>`:b='<span style="color: #666;">0,00</span>';const y=[];if(u.longDecayableChange!==0){const M=u.longDecayableChange>0?"+":"",x=u.longDecayableChange>0?"#ef4444":"#2ecc71";y.push(`<span style="color: ${x}; font-weight: 500;">${M}${u.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(u.longLockedChange!==0){const M=u.longLockedChange>0?"+":"",x=u.longLockedChange>0?"#a855f7":"#2ecc71";y.push(`<span style="color: ${x}; font-weight: 500;">${M}${u.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const $=y.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${y.join("")}</div>`:'<span style="color: #666;">0,00</span>',F=u.shortAfter+u.longAfter;return`
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${g}</td>
          <td style="color: #fff; font-weight: 600; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${h}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${f}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${b}
              <span style="font-size: 0.85rem; color: #888;">(${u.shortAfter.toFixed(2).replace(".",",")})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; justify-content: flex-end; width: 100%;">
              ${$}
              <span style="font-size: 0.85rem; color: #888;">(${u.longAfter.toFixed(2).replace(".",",")})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <strong style="color: #ef4444; font-size: 0.95rem;">-${F.toFixed(2).replace(".",",")}</strong>
            <span style="font-size: 0.8rem; color: #888; margin-left: 0.3rem;">(K: ${u.shortAfter.toFixed(2).replace(".",",")} | L: ${u.longAfter.toFixed(2).replace(".",",")})</span>
          </td>
        </tr>
      `}).join(""),`
    <section class="rider-stats-fatigue-tab" style="padding: 1.5rem 0.5rem;">
      <!-- Main Penalty Box -->
      <div class="rider-stats-fatigue-total" style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="margin: 0 0 0.25rem 0; font-size: 1.15rem; font-weight: 700; color: #fff;">Gesamt-Abzug auf alle Skills</h3>
          <p style="margin: 0; font-size: 0.85rem; color: #bbb;">
            Die Summe aus akuter und langfristiger Erschöpfung wird direkt von allen Attributwerten abgezogen.
          </p>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 2rem; font-weight: 800; color: #ef4444; text-shadow: 0 0 15px rgba(239, 68, 68, 0.25);">
            -${i.toFixed(2).replace(".",",")}
          </span>
          <div style="font-size: 0.8rem; color: #888; margin-top: 0.1rem;">
            (Kurzzeit -${a.toFixed(2).replace(".",",")} | Langzeit -${n.toFixed(2).replace(".",",")})
          </div>
        </div>
      </div>

      <!-- Fatigue Metric Cards -->
      <div class="rider-stats-fatigue-summary" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        
        <!-- Card 1: Short-term Fatigue -->
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; background: rgba(251, 191, 36, 0.1); color: #fbbf24;">
                ${q.shortFatigue}
              </span>
              <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: #fff;">Akute Erschöpfung (Kurzzeit)</h4>
            </div>
            <p style="margin: 0 0 1rem 0; font-size: 0.8rem; color: #999; line-height: 1.4;">
              Steigt durch Rennbelastungen proportional zum Stage Score (ab 10 Pkt.). Sinkt um 0,2 pro tageswechsel.
            </p>
          </div>
          <div>
            <div style="font-size: 1.6rem; font-weight: 700; color: ${l}; margin-bottom: 0.25rem;">
              -${a.toFixed(2).replace(".",",")} <span style="font-size: 0.85rem; font-weight: 400; color: #888;">Abzug</span>
            </div>
            <div style="font-size: 0.8rem; color: #aaa;">
              Erholungszeit: <strong style="color: #fff;">${o} Tage</strong> (ohne Belastung)
            </div>
          </div>
        </div>

        <!-- Card 2: Long-term Decayable Fatigue -->
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                ${q.longFatigue}
              </span>
              <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: #fff;">Langzeit (Abbaubar)</h4>
            </div>
            <p style="margin: 0 0 1rem 0; font-size: 0.8rem; color: #999; line-height: 1.4;">
              Steigt durch Rennbelastungen proportional zum Stage Score. Regeneriert langsam um 0,01 pro tageswechsel.
            </p>
          </div>
          <div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #ef4444; margin-bottom: 0.25rem;">
              -${s.toFixed(2).replace(".",",")} <span style="font-size: 0.85rem; font-weight: 400; color: #888;">Abzug</span>
            </div>
            <div style="font-size: 0.8rem; color: #aaa;">
              Erholungszeit: <strong style="color: #fff;">${c} Tage</strong> (ohne Belastung)
            </div>
          </div>
        </div>

        <!-- Card 3: Long-term Locked Fatigue -->
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; background: rgba(168, 85, 247, 0.1); color: #a855f7;">
                <svg class="rider-stats-icon" style="stroke: #a855f7;" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: #fff;">Langzeit (Gesperrt)</h4>
            </div>
            <p style="margin: 0 0 1rem 0; font-size: 0.8rem; color: #999; line-height: 1.4;">
              Steigt mit zunehmender Anzahl an Renntagen (ab 30 Renntagen). Kann unter der Saison nicht abgebaut werden.
            </p>
          </div>
          <div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #a855f7; margin-bottom: 0.25rem;">
              -${r.toFixed(2).replace(".",",")} <span style="font-size: 0.85rem; font-weight: 400; color: #888;">Abzug</span>
            </div>
            <div style="font-size: 0.8rem; color: #aaa;">
              Status: <strong style="color: #a855f7;">Gesperrt bis Saisonende</strong>
            </div>
          </div>
        </div>

      </div>

      <!-- Chronological History Table -->
      <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; padding-left: 0.25rem;">Chronologischer Erschöpfungsverlauf</h3>
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap" style="margin-top: 0.5rem;">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 14%;">
            <col style="width: 26%;">
            <col style="width: 10%;">
            <col style="width: 18%;">
            <col style="width: 18%;">
            <col style="width: 14%;">
          </colgroup>
          <thead>
            <tr>
              <th style="padding: 0.75rem 0.5rem;">Datum</th>
              <th style="padding: 0.75rem 0.5rem;">Ereignis</th>
              <th style="text-align: right; padding: 0.75rem 0.5rem;">Stage Score</th>
              <th style="text-align: right; padding: 0.75rem 0.5rem;">Kurzzeit-Änderung</th>
              <th style="text-align: right; padding: 0.75rem 0.5rem;">Langzeit-Änderung</th>
              <th style="text-align: right; padding: 0.75rem 0.5rem;">Neue Erschöpfung</th>
            </tr>
          </thead>
          <tbody>
            ${m}
          </tbody>
        </table>
      </div>
    </section>
  `}function sm(e){var J;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((R,I)=>I%2===0),s=((J=d.gameState)==null?void 0:J.currentDate)??new Date().toISOString(),r=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(s).getUTCFullYear(),n=new Date(Date.UTC(r,0,1)).getTime(),i=864e5,o=1300,c=384,l=30,p=20,m=a.map(R=>{const B=(new Date(R.date).getTime()-n)/i,_=l+B/365*o,U=p+c-Math.min(8,Math.max(0,R.totalForm))/8*c;return{x:_,y:U,form:R.totalForm,date:R.date}});let u="",g="",h="";m.length>0&&(u=`M ${m.map(R=>`${R.x},${R.y}`).join(" L ")}`,g=m.map(R=>`<circle cx="${R.x}" cy="${R.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${R.date}): ${R.form}</title></circle>`).join(""),h=`${u} L ${m[m.length-1].x},${p+c} L ${m[0].x},${p+c} Z`);const f="rgba(251, 191, 36, 0.15)";let b="";for(let R=0;R<=8;R+=2){const I=p+c-R/8*c;b+=`<line x1="${l}" y1="${I}" x2="${l+o}" y2="${I}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,b+=`<text x="${l-5}" y="${I+4}" fill="#ffffff" font-size="10" text-anchor="end">${R}</text>`}let y="";for(let R=0;R<=52;R+=5){const I=l+R/52*o;b+=`<line x1="${I}" y1="${p}" x2="${I}" y2="${p+c}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,y+=`<text x="${I}" y="${p+c+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${R}</text>`}let $="",F="";if(e.peakDates){const R=[...e.peakDates].sort((I,B)=>new Date(I).getTime()-new Date(B).getTime());for(let I=0;I<R.length;I++){const B=R[I],U=(new Date(B).getTime()-n)/i,j=l+U/365*o;$+=`<line x1="${j}" y1="${p}" x2="${j}" y2="${p+c}" stroke="#ffffff" stroke-width="2"><title>Peak: ${B}</title></line>`;const Q=I>0?(new Date(R[I-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,Me=U-56,be=Q+14,k=Math.max(0,Math.max(Me,be)),Y=U-k,W=l+k/365*o,K=Y/365*o;F+=`<rect x="${W}" y="${p}" width="${K}" height="${c}" fill="rgba(16, 185, 129, 0.1)" />`;const me=14/365*o;F+=`<rect x="${j}" y="${p}" width="${me}" height="${c}" fill="rgba(239, 68, 68, 0.1)" />`}}const x=(new Date(s).getTime()-n)/i,T=l+x/365*o;$+=`<line x1="${T}" y1="${p}" x2="${T}" y2="${p+c}" stroke="#ef4444" stroke-width="3"><title>Heute: ${s}</title></line>`,We.forEach((R,I)=>{const B=ft[I%ft.length];R.peakDates&&R.peakDates.forEach(_=>{const j=(new Date(_).getTime()-n)/i,Q=l+j/365*o;$+=`<line x1="${Q}" y1="${p}" x2="${Q}" y2="${p+c}" stroke="${B}" stroke-width="1.5" stroke-dasharray="3,3"><title>${R.riderName} Peak: ${_}</title></line>`})});let w="",C="";We.forEach((R,I)=>{const B=ft[I%ft.length],_=R.formHistory.filter((U,j)=>j%2===0).map(U=>{const Q=(new Date(U.date).getTime()-n)/i,Me=l+Q/365*o,be=p+c-Math.min(8,Math.max(0,U.totalForm))/8*c;return{x:Me,y:be,form:U.totalForm,date:U.date}});if(_.length>0){const U=`M ${_.map(j=>`${j.x},${j.y}`).join(" L ")}`;w+=`<path d="${U}" fill="none" stroke="${B}" stroke-width="2" />`,C+=_.map(j=>`<circle cx="${j.x}" cy="${j.y}" r="3" fill="#fff" stroke="${B}" stroke-width="2"><title>${R.riderName} (${j.date}): ${j.form}</title></circle>`).join("")}});const E=d.teams.filter(R=>R.division==="WorldTour"||R.divisionName==="WorldTour");let A='<option value="">-- Team auswählen --</option>';for(const R of E){const I=bt===R.id?" selected":"";A+=`<option value="${R.id}"${I}>${v(R.name)}</option>`}let N='<option value="">-- Fahrer auswählen --</option>';if(bt!=null){const R=d.riders.filter(I=>I.activeTeamId===bt&&I.id!==e.riderId&&!We.some(B=>B.riderId===I.id));for(const I of R)N+=`<option value="${I.id}">${v(I.firstName)} ${v(I.lastName)}</option>`}const D=`
    <div class="rider-compare-controls" style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-primary);">
      <span style="font-weight: 600; color: var(--text-100); font-size: 0.95rem;">Mit anderem Fahrer vergleichen:</span>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-team-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Team (Tier 1):</label>
        <select id="rider-compare-team-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);">
          ${A}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-rider-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Fahrer:</label>
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${bt==null?"disabled":""}>
          ${N}
        </select>
      </div>
    </div>
  `,L=e.currentSeasonRank??Ma(e.riderId)??"–",P=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${v(e.riderName)} (${e.currentSeasonPoints}/${L})">${v(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${L})</span></span>
    </div>
    `];We.forEach((R,I)=>{const B=ft[I%ft.length],_=R.currentSeasonRank??Ma(R.riderId)??"–";P.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${B}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${v(R.riderName)} (${R.currentSeasonPoints}/${_})">${v(R.riderName)} <span style="color: var(--text-500);">(${R.currentSeasonPoints}/${_})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${R.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const V=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      ${P.join("")}
    </div>
  `;return`
    <section class="rider-stats-form-tab">
      <div class="rider-stats-season-head">
        <h3>Formverlauf (Saison ${r})</h3>
      </div>
      ${D}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${F}
            ${b}
            ${y}
            ${$}
            ${h?`<path d="${h}" fill="${f}" />`:""}
            ${u?`<path d="${u}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${g}
            ${w}
            ${C}
          </svg>
        </div>
        ${V}
      </div>
    </section>
  `}function rm(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
      <section class="rider-stats-placeholder">
        <h3>${v(e.program.name)}</h3>
        <p>Diesem Programm sind aktuell keine Rennen zugeordnet.</p>
      </section>`:`
    <section class="rider-stats-program">
      <div class="rider-stats-season-head">
        <h3>${v(e.program.name)}</h3>
        <span>${t.length} Rennen</span>
      </div>
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table rider-stats-program-table">
          <thead><tr><th>Datum</th><th class="text-center">Status</th><th>Land</th><th>Rennen</th><th>Rennklasse</th></tr></thead>
          <tbody>
            ${t.map(a=>{var r;const s=e.unavailableUntil?a.startDate<=e.unavailableUntil&&a.endDate>=d.gameState.currentDate:!1;return`
              <tr>
                <td>${v(La(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${s?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(r=a.country)!=null&&r.code3?oe(a.country.code3):"–"}</td>
                <td><strong>${v(a.name)}</strong></td>
                <td>${Ks(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function mt(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${v(e)}</span>`}function nm(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function im(e){return e.finishStatus==="otl"?mt("OTL","place"):e.finishStatus==="dnf"?mt("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${v(String(e.resultRank))}</span>`}function om(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":mt(String(e.gcRank),"gc")}function lm(e){return e.finishStatus==="otl"?ts(e.statusReason,!0):e.finishStatus==="dnf"?ts(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${ua(e.stageTimeSeconds)}`:e.resultLabel}function Ee(e,t,a=!1){var o,c;const s=(e==null?void 0:e.activeTeamId)!=null?((o=d.teams.find(l=>l.id===e.activeTeamId))==null?void 0:o.name)??null:null,r=((c=e==null?void 0:e.country)==null?void 0:c.code3)??(e==null?void 0:e.nationality)??null,n=r?oe(r):"",i=t==null?[]:[...t.seasons].map(l=>({...l,raceBlocks:Qu(l.raceBlocks)})).sort((l,p)=>p.season-l.season);return a?`
      ${Ie(e,t,s,r,n)}
      ${Fe(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`:t?d.riderStatsTab==="skills"?`
      ${Ie(e,t,s,r,n)}
      ${Fe(t)}
      ${tm(e)}`:d.riderStatsTab==="fatigue"?`
      ${Ie(e,t,s,r,n)}
      ${Fe(t)}
      ${am(e,t)}`:d.riderStatsTab==="program"?`
      ${Ie(e,t,s,r,n)}
      ${Fe(t)}
      ${rm(t)}`:d.riderStatsTab==="form"?`
      ${Ie(e,t,s,r,n)}
      ${Fe(t)}
      ${sm(t)}`:d.riderStatsTab==="topResults"?`
      ${Ie(e,t,s,r,n)}
      ${Fe(t)}
      ${dm(t)}`:d.riderStatsTab==="career"?`
      ${Ie(e,t,s,r,n)}
      ${Fe(t)}
      ${um(t)}`:t.seasons.length===0?`
      ${Ie(e,t,s,r,n)}
      ${Fe(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`:`
    ${Ie(e,t,s,r,n)}
    ${Fe(t)}
    ${i.map(l=>`
      <section class="rider-stats-season">
        <div class="rider-stats-season-head">
          <h3>Saison ${l.season}</h3>
          <span>${l.raceBlocks.length} Rennen</span>
        </div>
        <div class="rider-stats-race-list">
          ${l.raceBlocks.map(p=>`
            <section class="rider-stats-race-block">
              <div class="rider-stats-race-head">
                <div>
                  <h4>${v(p.raceName)}</h4>
                  <p>${v(Xu(p))}</p>
                </div>
                ${Ta(p.raceCategoryName,p.isStageRace,p.rows.filter(m=>m.rowType==="stage_result").length||null)}
              </div>
              <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
                <table class="data-table rider-stats-table">
                  <colgroup>
                    <col style="width: 10%;">
                    <col style="width: 5%;">
                    <col style="width: 5%;">
                    <col style="width: 4%;">
                    <col style="width: 15%;">
                    <col style="width: 18%;">
                    <col style="width: 8%;">
                    <col style="width: 6%;">
                    <col style="width: 6%;">
                    <col style="width: 18%;">
                    <col style="width: 5%;">
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Platz</th>
                      <th>GC</th>
                      <th class="rider-stats-breakaway-col"></th>
                      <th>Klasse</th>
                      <th>Rennen / Etappe</th>
                      <th>Profil</th>
                      <th>km</th>
                      <th>HM</th>
                      <th>Ergebnis</th>
                      <th>Punkte</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${p.rows.map(m=>{const u=m.rowType!=="stage_result",g=u?`${m.raceName} · ${Ns(m.rowType)}`:m.stageName?`${m.raceName} · ${m.stageName}`:m.raceName;return`
                        <tr class="rider-stats-row${u?" rider-stats-row-final":""}">
                          <td>${v(se(m.date))}</td>
                          <td>${im(m)}</td>
                          <td>${om(m)}</td>
                          <td class="rider-stats-breakaway-col">${nm(m)}</td>
                          <td>${u?qu(m.rowType):Ta(m.raceCategoryName,m.isStageRace)}</td>
                          <td>${v(g)}</td>
                          <td>${u?"–":m.profile?jt(m.profile):"–"}</td>
                          <td>${u?"-":m.distanceKm!=null?v(m.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                          <td>${u?"-":m.elevationGainMeters!=null?v(String(Math.round(m.elevationGainMeters))):"–"}</td>
                          <td>${v(lm(m))}</td>
                          <td>${m.seasonPoints}</td>
                        </tr>`}).join("")}
                  </tbody>
                </table>
              </div>
            </section>`).join("")}
        </div>
      </section>`).join("")}`:`
      ${Ie(e,t,s,r,n)}
      ${Fe(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`}function ls(){const e=document.querySelector(".rider-stats-modal-card");e&&(d.riderStatsTab==="career"?(e.style.minWidth="min(1080px, 95vw)",e.style.maxWidth="1300px"):(e.style.minWidth="",e.style.maxWidth=""))}async function wa(e){var c,l,p,m;const t=Se(e),a=(t==null?void 0:t.activeTeamId)!=null?((c=d.teams.find(u=>u.id===t.activeTeamId))==null?void 0:c.name)??null:null;We=[],bt=null,d.riderStatsSelectedRiderId=e,d.riderStatsTab="results",ls(),d.riderStatsTopResultsFilterCategory=null,d.riderStatsTopResultsFilterSeason=null,d.riderStatsTopResultsPage=1,S("rider-stats-title").innerHTML=Vr(t,null),S("rider-stats-jersey").innerHTML="";const s=t!=null&&t.age?` · Alter ${t.age}`:"";S("rider-stats-meta").textContent=t?`${((l=t.role)==null?void 0:l.name)??"Fahrer"} · ${a??"Team unbekannt"}${s}`:"Historie wird geladen",S("rider-stats-body").innerHTML=Ee(t,null,!0),Le("riderStats");const r=await G.getRiderStats(e);if(d.riderStatsSelectedRiderId!==e)return;if(!r.success||!r.data){const u=t!=null&&t.age?` · Alter ${t.age}`:"";S("rider-stats-meta").textContent=t?`${((p=t.role)==null?void 0:p.name)??"Fahrer"} · ${a??"Team unbekannt"}${u}`:"Fehler beim Laden",S("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${v(r.error??"Unbekannter Fehler")}</p>
      </section>`;return}d.riderStatsPayload=r.data,ls(),S("rider-stats-title").innerHTML=Vr(t,r.data),S("rider-stats-jersey").innerHTML="";const n=r.data.age?` · Alter ${r.data.age}`:t!=null&&t.age?` · Alter ${t.age}`:"",i=r.data.mentorName?` · Mentor: ${r.data.mentorName}`:"",o=r.data.mentoredRiderNames&&r.data.mentoredRiderNames.length>0?` · Mentor von: ${r.data.mentoredRiderNames.join(" - ")}`:"";S("rider-stats-meta").textContent=`${((m=t==null?void 0:t.role)==null?void 0:m.name)??"Fahrer"} · ${r.data.teamName??a??"Ohne aktives Team"}${n} · ${r.data.seasons.length} Saisons${i}${o}`,S("rider-stats-body").innerHTML=Ee(t,r.data,!1)}function cm(){S("rider-stats-body").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-rider-stats-tab]");if(!t){const n=e.target.closest("button[data-remove-compare-id]");if(n){const o=Number(n.dataset.removeCompareId);We=We.filter(l=>l.riderId!==o);const c=Se(d.riderStatsSelectedRiderId);S("rider-stats-body").innerHTML=Ee(c,d.riderStatsPayload,!1);return}const i=e.target.closest("button[data-top-results-page]");if(i){const o=Number(i.dataset.topResultsPage);if(!isNaN(o)&&o>=1){d.riderStatsTopResultsPage=o;const c=Se(d.riderStatsSelectedRiderId);S("rider-stats-body").innerHTML=Ee(c,d.riderStatsPayload,!1)}}return}const a=t.dataset.riderStatsTab;if(a!=="results"&&a!=="program"&&a!=="form"&&a!=="topResults"&&a!=="skills"&&a!=="career"&&a!=="fatigue"||a==="program"&&(((r=d.riderStatsPayload)==null?void 0:r.programRaces.length)??0)===0)return;d.riderStatsTab=a,ls();const s=Se(d.riderStatsSelectedRiderId);S("rider-stats-body").innerHTML=Ee(s,d.riderStatsPayload,!1)}),S("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){d.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,d.riderStatsTopResultsPage=1;const a=Se(d.riderStatsSelectedRiderId);S("rider-stats-body").innerHTML=Ee(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){d.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),d.riderStatsTopResultsPage=1;const a=Se(d.riderStatsSelectedRiderId);S("rider-stats-body").innerHTML=Ee(a,d.riderStatsPayload,!1)}else if(t.classList.contains("rider-stats-filter-checkbox")){const a=t.dataset.filterType;d.riderStatsTopResultsFilters[a]=t.checked,d.riderStatsTopResultsPage=1;const s=Se(d.riderStatsSelectedRiderId);S("rider-stats-body").innerHTML=Ee(s,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;bt=a?Number(a):null;const s=Se(d.riderStatsSelectedRiderId);S("rider-stats-body").innerHTML=Ee(s,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const s=Number(a);if(We.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const r=await G.getRiderStats(s);r.success&&r.data?We.push({riderId:r.data.riderId,riderName:r.data.riderName,teamId:r.data.teamId,teamName:r.data.teamName,formHistory:r.data.formHistory??[],peakDates:r.data.peakDates??[],currentSeasonPoints:r.data.currentSeasonPoints??0,currentSeasonRank:r.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(r.error??""));const n=Se(d.riderStatsSelectedRiderId);S("rider-stats-body").innerHTML=Ee(n,d.riderStatsPayload,!1)}}})}function Ur(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function dm(e){const t=[];for(const g of e.seasons)for(const h of g.raceBlocks)for(const f of h.rows)t.push({...f,season:g.season,isStageRace:h.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,h)=>g.localeCompare(h,"de"));const s=Array.from(new Set(t.map(g=>g.season))).sort((g,h)=>h-g);let r=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?d.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?d.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?d.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?d.riderStatsTopResultsFilters.youth:!0:g.isStageRace?d.riderStatsTopResultsFilters.stage:d.riderStatsTopResultsFilters.oneDay);if(d.riderStatsTopResultsFilterCategory){const g=d.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const h=g.substring(0,g.length-8);r=r.filter(f=>f.raceCategoryName===h&&f.rowType==="stage_result")}else if(g.endsWith("-gc")){const h=g.substring(0,g.length-3);r=r.filter(f=>f.raceCategoryName===h&&f.rowType!=="stage_result")}else r=r.filter(h=>h.raceCategoryName===g)}d.riderStatsTopResultsFilterSeason!=null&&(r=r.filter(g=>g.season===d.riderStatsTopResultsFilterSeason)),r.sort((g,h)=>{if(h.seasonPoints!==g.seasonPoints)return h.seasonPoints-g.seasonPoints;const f=g.rowType!=="stage_result",b=h.rowType!=="stage_result",y=g.resultRank??9999,$=h.resultRank??9999;if(d.riderStatsTopResultsFilterCategory)return y!==$?y-$:f!==b?f?-1:1:0;{const F=Ur(g.raceCategoryName),M=Ur(h.raceCategoryName);return F!==M?F-M:f!==b?f?-1:1:y-$}});const n=20,i=Math.max(1,Math.min(10,Math.ceil(r.length/n)));d.riderStatsTopResultsPage>i&&(d.riderStatsTopResultsPage=i);const o=(d.riderStatsTopResultsPage-1)*n,c=r.slice(o,o+n),p=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${a.map(g=>{if(g.toLowerCase().includes("stage race")||g.toLowerCase().includes("grand tour")||g.toLowerCase().includes("tour de france")){const f=`${g}-etappen`,b=`${g}-gc`;return`
        <option value="${v(f)}" ${d.riderStatsTopResultsFilterCategory===f?"selected":""}>${v(g)} - Etappen</option>
        <option value="${v(b)}" ${d.riderStatsTopResultsFilterCategory===b?"selected":""}>${v(g)} - GC</option>
      `}else return`<option value="${v(g)}" ${d.riderStatsTopResultsFilterCategory===g?"selected":""}>${v(g)}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="rider-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${s.map(g=>`<option value="${g}" ${d.riderStatsTopResultsFilterSeason===g?"selected":""}>Saison ${g}</option>`).join("")}
        </select>
      </div>
      
      <div class="top-results-checkboxes" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; border-left: 1px solid rgba(255, 255, 255, 0.15); padding-left: 1rem;">
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="gc" ${d.riderStatsTopResultsFilters.gc?"checked":""} style="accent-color: #ffd700; width: 14px; height: 14px; cursor: pointer;">
          nur GC
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="mountain" ${d.riderStatsTopResultsFilters.mountain?"checked":""} style="accent-color: #ff4d4d; width: 14px; height: 14px; cursor: pointer;">
          nur Bergwertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="points" ${d.riderStatsTopResultsFilters.points?"checked":""} style="accent-color: #2ecc71; width: 14px; height: 14px; cursor: pointer;">
          nur Punktewertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="youth" ${d.riderStatsTopResultsFilters.youth?"checked":""} style="accent-color: #ffffff; width: 14px; height: 14px; cursor: pointer;">
          nur Nachwuchs
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="oneDay" ${d.riderStatsTopResultsFilters.oneDay?"checked":""} style="accent-color: #9b59b6; width: 14px; height: 14px; cursor: pointer;">
          One Day Races
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="stage" ${d.riderStatsTopResultsFilters.stage?"checked":""} style="accent-color: #3498db; width: 14px; height: 14px; cursor: pointer;">
          Etappenwertungen
        </label>
      </div>
    </div>
  `,m=c.length===0?'<tr><td colspan="8" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':c.map(g=>{const h=g.rowType!=="stage_result",f=h?`${g.raceName} · ${Ns(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let b="–",y="–";g.finishStatus==="otl"?b=mt("OTL","place"):g.finishStatus==="dnf"?b=mt("DNF","place"):g.resultRank==null||(h?y=`<span class="rider-stats-final-type ${vi(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:b=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${v(String(g.resultRank))}</span>`);const $=h?"–":g.profile?jt(g.profile):"–",F=!h&&g.stageScore!=null&&g.stageScore>0?Pa(g.stageScore,0,350):"–",M=Ta(g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${h?" rider-stats-row-final":""}">
            <td>${b}</td>
            <td>${y}</td>
            <td><strong>${v(f)}</strong></td>
            <td>${$}</td>
            <td>${F}</td>
            <td>${M}</td>
            <td>Saison ${g.season}</td>
            <td><strong>${g.seasonPoints}</strong></td>
          </tr>
        `}).join(""),u=i>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${d.riderStatsTopResultsPage-1}" ${d.riderStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        ${Array.from({length:i}).map((g,h)=>{const f=h+1;return`<button type="button" class="btn btn-sm ${d.riderStatsTopResultsPage===f?"btn-primary":"btn-secondary"}" data-top-results-page="${f}">${f}</button>`}).join("")}
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${d.riderStatsTopResultsPage+1}" ${d.riderStatsTopResultsPage===i?"disabled":""}>Weiter &raquo;</button>
      </div>
    `:"";return`
    <section class="rider-stats-top-results" style="margin-top: 1.5rem;">
      ${p}
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 6%;">
            <col style="width: 10%;">
            <col style="width: 38%;">
            <col style="width: 8%;">
            <col style="width: 6%;">
            <col style="width: 20%;">
            <col style="width: 6%;">
            <col style="width: 6%;">
          </colgroup>
          <thead>
            <tr>
              <th>Platz</th>
              <th>GC / Wertung</th>
              <th>Rennen</th>
              <th>Profil</th>
              <th>Score</th>
              <th>Klasse</th>
              <th>Saison</th>
              <th>Punkte</th>
            </tr>
          </thead>
          <tbody>
            ${m}
          </tbody>
        </table>
      </div>
      ${u}
    </section>
  `}function um(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),s=(n,i,o,c)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let p="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?p+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?p+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?p+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?p+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?p+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?p+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?p+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"&&(p+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${p}" title="${v(o)}">${n}</span>`},r=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
    <section class="rider-stats-career" style="margin-top: 1.5rem;">
      <!-- Career Summary cards -->
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Siege</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fbbf24;">${e.careerWins??0}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Renntage</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #a855f7;">${a}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Ausreißversuche</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #3498db;">${t.breakawayAttempts}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Erf. Ausreißer</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #2ecc71;">${t.successfulBreakaways??0}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Attacken</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #ffd700;">${t.attacks}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Konterattacken</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e67e22;">${t.counterAttacks}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Stürze</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e74c3c;">${t.crashes}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Defekte</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #95a5a6;">${t.defects}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">DNS</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fc8181;">${t.dnsCount??0}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">DNF</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #f56565;">${t.dnfCount??0}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">OTL</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e53e3e;">${t.otlCount??0}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Krankheiten</div>
          <div style="font-size: 1.45rem; font-weight: bold; color: #ed64a6; line-height: 1.25;">${t.illnesses??0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">${t.illnessDays??0} Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Verletzungen</div>
          <div style="font-size: 1.45rem; font-weight: bold; color: #f6ad55; line-height: 1.25;">${t.injuries??0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">${t.injuryDays??0} Tage</div>
        </div>
      </div>

      <!-- Categories details -->
      <h3 style="margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; font-weight: 500; font-size: 1.15rem; color: #fff;">Ergebnisse nach Rennklasse</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 1.25rem;">
        ${r.map(n=>{const i=t.categories[n.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,raceDays:0,leaderJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 365px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${v(n.name)}">${v(n.name)}</span>
                ${Cs(n.key)}
              </div>
              
              ${n.isStage?`
                <!-- Stage Race layout: GC & Classifications -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">GC & Wertungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${s(i.gcWins,"gold","Gesamtwertung Siege")}
                    ${s(i.gcSecond,"silver","Gesamtwertung Platz 2")}
                    ${s(i.gcThird,"bronze","Gesamtwertung Platz 3")}
                    ${s(i.gcTopTen||0,"purple","Gesamtwertung Ränge 4-10")}
                    <span style="border-left: 1px solid rgba(255,255,255,0.15); height: 1rem; margin: 0 0.1rem; display: inline-block;"></span>
                    ${s(i.mountainWins,"red","Bergwertung Siege")}
                    ${s(i.pointsWins,"green","Punktewertung Siege")}
                    ${s(i.youthWins,"white","Nachwuchswertung Siege")}
                  </div>
                </div>
                
                <!-- Etappenergebnisse -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Etappenergebnisse</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${s(i.stageWins,"gold","Etappensiege")}
                    ${s(i.stageSecond,"silver","Etappen Platz 2")}
                    ${s(i.stageThird,"bronze","Etappen Platz 3")}
                    ${s(i.stageTopTen||0,"purple","Etappen Ränge 4-10")}
                  </div>
                </div>

                <!-- Führungstrikots -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Führungstrikot Tage</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(i.leaderJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);"}" title="Tage im Führungstrikot (P1 GC)">
                      🎽 ${i.leaderJerseys||0}
                    </span>
                  </div>
                </div>
              `:`
                <!-- One Day Race layout: Platzierungen -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Platzierungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${s(i.oneDayWins,"gold","Siege")}
                    ${s(i.oneDaySecond,"silver","Platz 2")}
                    ${s(i.oneDayThird,"bronze","Platz 3")}
                    ${s(i.oneDayTopTen||0,"purple","Ränge 4-10")}
                  </div>
                </div>
                
                <!-- Spacer for Stage results -->
                <div style="visibility: hidden; font-size: 0.7rem; margin-bottom: 0.2rem; white-space: nowrap;">&nbsp;</div>
                
                <!-- Spacer for Jerseys -->
                <div style="visibility: hidden; font-size: 0.7rem; margin-bottom: 0.2rem; white-space: nowrap;">&nbsp;</div>
              `}
              
              <!-- Checkpoint-Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Checkpoint-Siege</div>
                <div style="display: flex; gap: 0.3rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${s(i.sprintWins||0,"green","Sprint: Gewonnene Zwischensprints")}
                  ${s(i.climbWinsHC||0,"red","HC: Gewonnene HC-Bergwertungen")}
                  ${s(i.climbWins1||0,"red","C1: Gewonnene Bergwertungen Kategorie 1")}
                  ${s(i.climbWins2||0,"red","C2: Gewonnene Bergwertungen Kategorie 2")}
                  ${s(i.climbWins3||0,"red","C3: Gewonnene Bergwertungen Kategorie 3")}
                  ${s(i.climbWins4||0,"red","C4: Gewonnene Bergwertungen Kategorie 4")}
                </div>
              </div>

              <!-- Profil Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Profil Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${ee(i.winFlat||0,"flat","Flach (Flat)")}
                  ${ee(i.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${ee(i.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${ee(i.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${ee(i.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${ee(i.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${ee(i.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${ee(i.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${ee(i.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${ee(i.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${ee(i.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${q.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${i.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}const mm=250,ht=1200,pm=250,gm=1200,Yr=.2;class fm{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",s=>{var i,o,c,l;const r=s.target.closest("button[data-race-sim-action]");if(r){if(r.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const m=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;m&&((l=(c=this.options).onFinishRequested)==null||l.call(c,m,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=s.target.closest("button[data-race-sim-speed]");if(n){const p=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(p))return;this.timeMultiplier=p,this.render()}}),this.elements.messages.addEventListener("click",s=>{const r=s.target.closest("button[data-race-sim-group-rider-id]");if(r){const c=this.resolveRiderIdFromGroupButton(r);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),wa(c));return}const n=s.target.closest("button[data-race-sim-group-rider-name]");if(n){const c=this.resolveRiderIdFromGroupButton(n);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),wa(c));return}const i=s.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),Tr(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",s=>{const r=s.target.closest("[data-race-sim-overview-summary]");if(r){const n=r.dataset.raceSimOverviewSummary,i=r.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(s)}),this.elements.groupBox.addEventListener("click",s=>{this.handleGroupInteraction(s)}),this.elements.profile.addEventListener("click",s=>{const r=s.target.closest("button[data-race-sim-timing-mode]");if(!r)return;const n=r.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+ht,this.render())})}handleGroupInteraction(t){var p,m;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const u=this.resolveRiderIdFromGroupButton(a);u!=null&&this.selectGroupByRiderId(u,this.detailSnapshot);return}const s=t.target.closest("button[data-race-sim-group-nav]");if(!s)return;const r=this.buildRaceGroups(this.detailSnapshot);if(r.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,r.findIndex(u=>u.label===n)),o=s.dataset.raceSimGroupNav==="prev"?-1:1,c=(i+o+r.length)%r.length,l=((p=r[c])==null?void 0:p.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",u=>{const g=u.target.closest(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+ht)}),this.elements.profile.addEventListener("wheel",u=>{const g=u.target.closest(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+ht)},{passive:!0}),this.elements.profile.addEventListener("scroll",u=>{const g=u.target;!(g instanceof HTMLElement)||!g.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=g.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+ht)},!0),(m=this.elements.sidebar.parentElement)==null||m.addEventListener("click",u=>{if(!this.bootstrap||!this.detailSnapshot||!Id(this.elements.sidebar,u.target))return;const h=performance.now(),f=_r(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(f);const b=performance.now()-h;this.recordPerfTelemetry("sidebarWriteMs",b),this.scheduleSidebarPaintTelemetry(h,b),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new Hn(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const s=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(s),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(r=>this.frame(r));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const s=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-s),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(r=>this.frame(r))}render(t=performance.now(),a=!1){var l;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const s=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",r=xo(this.bootstrap.stageSummary),n=[`${r.segmentCount} Segmente`,r.sprintCount>0?`${r.sprintCount} Sprint${r.sprintCount===1?"":"s"}`:null,r.climbCount>0?`${r.climbCount} Bergwertung${r.climbCount===1?"":"en"}`:null].filter(p=>p!=null).join(" · ");this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${s}${n?` · ${n}`:""}`;const i=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=mm,o=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,c=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=pm;if(i||o||c){const p=performance.now();this.detailSnapshot=((l=this.engine)==null?void 0:l.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-p)}if(i&&this.detailSnapshot){const p=this.elements.profile.querySelector(".race-sim-timing-scroll");p&&(this.timingScrollTop=p.scrollTop);const m=performance.now();Po(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-m),this.lastProfileRenderTime=t;const u=this.elements.profile.querySelector(".race-sim-timing-scroll");u&&(u.scrollTop=this.timingScrollTop)}if(o&&this.detailSnapshot){this.lastSidebarRenderTime=t;const p=performance.now(),m=_r(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(m);const u=performance.now()-p;this.recordPerfTelemetry("sidebarWriteMs",u),this.scheduleSidebarPaintTelemetry(p,u)}c&&this.detailSnapshot&&(Tr(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),pd(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),ld(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),$r(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const s=a.find(r=>r.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(s)return s.label}return this.selectedGroupLabel!=null&&a.some(s=>s.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return ks(ys(t.clusters))}resolveInitialGroupLabel(t){var a,s;return((a=t.find(r=>r.label==="P"))==null?void 0:a.label)??((s=t[0])==null?void 0:s.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(s=>[s.riderId,s]));return[...t.riderIds].sort((s,r)=>{var n,i;return(((n=a.get(s))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(r))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||s-r})[0]??null}selectGroupByLabel(t,a,s=!0){const r=this.buildRaceGroups(a),n=r.find(i=>i.label===t)??r.find(i=>i.label==="P")??r[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),s&&(this.profileInteractionHoldUntilMs=performance.now()+ht,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const r=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;r&&(this.selectedGroupLabel=r.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+ht,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+gm,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const s=t.dataset.raceSimGroupRiderName;if(!s)return null;const r=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===s&&(r==null||i.activeTeamId===r))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const s=this.perfTelemetry[t];this.perfTelemetry[t]=s<=0?a:s*(1-Yr)+a*Yr}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const s=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(s!==this.sidebarPaintSequence)return;const r=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",r),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||$r(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const Pe="__stage_overview__",ki="__non_finishers__",$i="__events__",Ti="__roster__";let Ce="all";function Ps(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function Zr(e){return Ps(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function hm(e){return[...e].sort((t,a)=>Zr(t)-Zr(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function bm(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=Ps(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function Sm(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function vm(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${se(t.date)}`}async function cs(e,t){var r;const a=ma(e);if(a&&(d.selectedResultsRaceId=a.race.id,d.selectedResultsStageId=e),d.riders.length===0){const n=await G.getRiders();n.success&&(d.riders=n.data??[])}const s=await G.getStageResults(e);if(!s.success){d.stageResults=null,pe(),!t&&s.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+s.error);return}d.stageResults=s.data??null,d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId,d.selectedResultTypeId=((r=d.stageResults.classifications[0])==null?void 0:r.resultTypeId)??1,d.selectedResultsMarkerKey=Pe,d.selectedResultsSpecialView=null),d.selectedResultsRaceId!=null&&Mi(d.selectedResultsRaceId),pe()}async function Mi(e){if(!d.seasonStandings){const a=await G.getSeasonStandings();a.success&&a.data&&(d.seasonStandings=a.data)}const t=await G.getRaceResultsRoster(e);t.success&&t.data?d.resultsRoster=t.data:d.resultsRoster=null}function ym(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function qr(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function km(){const e=d.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=Je(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,s=[...e.entries].sort((b,y)=>y.overallRating-b.overallRating),r=new Set(s.slice(0,5).map(b=>b.riderId)),n=b=>{var $;const y=d.riders.find(F=>F.id===b);return(($=y==null?void 0:y.skills)==null?void 0:$.sprint)??0},o=[...e.entries.filter(b=>!r.has(b.riderId))].sort((b,y)=>{const $=n(b.riderId),F=n(y.riderId);return F!==$?F-$:y.overallRating-b.overallRating}),c=new Set(o.slice(0,5).map(b=>b.riderId));function l(b){switch(b){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return b}}const p=new Map;for(const b of e.entries){const y=b.teamId;p.has(y)||p.set(y,{teamId:b.teamId,teamName:b.teamName,riders:[],avgRating:0}),p.get(y).riders.push(b)}for(const b of p.values())b.avgRating=b.riders.reduce((y,$)=>y+$.overallRating,0)/b.riders.length;const m=b=>{let y=Number.POSITIVE_INFINITY;for(const $ of b)!$.hasDropped&&$.gcRank!=null&&$.gcRank<y&&(y=$.gcRank);return y},u=b=>{var $;if(!(($=d.seasonStandings)!=null&&$.riderStandings))return 0;let y=0;for(const F of b){const M=d.seasonStandings.riderStandings.find(x=>x.riderId===F.riderId);M&&M.points>y&&(y=M.points)}return y},g=b=>{if(b==null)return 0;const y=d.riders.filter(M=>M.activeTeamId===b);if(y.length===0)return 0;const $=y.map(M=>M.overallRating??0);$.sort((M,x)=>x-M);const F=$.slice(0,10);return F.length===0?0:F.reduce((M,x)=>M+x,0)/F.length},h=[...p.values()].sort((b,y)=>{const $=m(b.riders),F=m(y.riders);if(($!==Number.POSITIVE_INFINITY||F!==Number.POSITIVE_INFINITY)&&$!==F)return $-F;const M=u(b.riders),x=u(y.riders);if((M>0||x>0)&&M!==x)return x-M;const T=g(b.teamId),w=g(y.teamId);return Math.abs(T-w)>1e-4?w-T:(b.teamName??"").localeCompare(y.teamName??"","de")});for(const b of h)b.riders.sort((y,$)=>qr(y.roleId)-qr($.roleId)||$.overallRating-y.overallRating||y.lastName.localeCompare($.lastName,"de"));return`<div class="results-roster-grid">${h.map(b=>{const y=b.teamId!=null?kt(b.teamId,b.teamName):"",$=b.riders.map(M=>{var j;const x=ym(M.roleId),T=M.countryCode?it[M.countryCode]??M.countryCode.slice(0,2).toLowerCase():null,w=T?`<span class="fi fi-${T} results-roster-flag" title="${v(M.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',C=`${M.firstName.charAt(0)}. ${M.lastName}`,E=M.roleName??"–",A=M.specialization1?l(M.specialization1):null,N=M.specialization2?l(M.specialization2):null;let D=E;A&&(D+=` · ${A}`),N&&(D+=` · ${N}`);const L=`<span class="results-roster-overall-badge" style="color:${$m(M.overallRating)}" title="Gesamtstärke: ${M.overallRating.toFixed(2)}">${M.overallRating.toFixed(2)}</span>`,P=M.hasDropped?" dropped":"";let V="";M.hasDropped?M.dropoutStatus==="dns"?V="DNS":M.dropoutStatus==="dnf"?V=((j=M.dropoutReason)==null?void 0:j.startsWith("OTL"))??!1?"OTL":"DNF":V="OUT":M.gcRank!=null&&(V=`${M.gcRank}`);let J="";if(M.hasDropped)J=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${v(M.dropoutReason||"")}">${V}</span>`;else if(M.gcRank!=null){let Q="rider-stats-rank-badge-gc";M.gcRank===1?Q="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":M.gcRank===2?Q="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":M.gcRank===3&&(Q="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),J=`<span class="rider-stats-rank-badge ${Q}" title="GC Stand: Platz ${M.gcRank}">${M.gcRank}</span>`}const I=`style="color: ${M.hasDropped?"var(--text-500)":x.color}; font-weight: bold;"`,B=r.has(M.riderId),_=c.has(M.riderId);return`<div class="results-roster-rider${P}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${w}
            <span class="results-roster-name${B?" strongest-rider":_?" best-sprinter":""}">
              ${we(C,{riderId:M.riderId,teamId:M.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${ds(M.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${I}>${v(D)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${J||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${L}
        </div>
      </div>`}).join(""),F=b.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${y}</div>
        <div class="results-roster-team-name" title="${v(b.teamName??"–")}">${nt(b.teamName??"–",b.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${F})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${$}</div>
    </div>`}).join("")}</div>`}function $m(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function Tm(e){var l,p;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=d.stageResults)==null?void 0:l.classifications.find(m=>m.resultTypeId===1),a=new Set(t?t.rows.map(m=>m.riderId).filter(m=>m!=null):[]),s=d.riders.filter(m=>m.activeTeamId===e.teamId&&a.has(m.id)),r=new Set((((p=d.stageResults)==null?void 0:p.nonFinishers)??[]).map(m=>m.riderId)),n=[];for(const m of s){if(m.id===e.riderId||r.has(m.id))continue;let u=0;const g=m.skills.sprint>=72,h=m.skills.flat>=78,f=m.skills.timeTrial>=76,b=m.skills.acceleration>=80;if(g&&u++,h&&u++,f&&u++,b&&u++,u>0){let y=1;u===2?y=1.25:u===3?y=1.5:u===4&&(y=2),n.push({id:m.id,firstName:m.firstName,lastName:m.lastName,countryCode:m.nationality??null,isSprinter:g,multiplier:y,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const m=n.filter(b=>b.isSprinter).reduce((b,y)=>b+y.multiplier,0),u=n.filter(b=>!b.isSprinter).reduce((b,y)=>b+y.multiplier,0);let g=0,h=0;m>0&&u>0?(g=i/(2.125*m+u),h=2.125*g,g=Math.max(.1,Math.min(.3,g)),h=Math.max(.25,Math.min(.6,h))):m>0?(h=i/m,h=Math.max(.25,Math.min(.6,h)),g=h/2.125):u>0&&(g=i/u,g=Math.max(.1,Math.min(.3,g)),h=2.125*g);for(const b of n)b.contribution=b.isSprinter?h*b.multiplier:g*b.multiplier;const f=n.reduce((b,y)=>b+y.contribution,0);if(f>0){const b=i/f;for(const y of n)y.contribution*=b}n.sort((b,y)=>y.contribution-b.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),c=n.map(m=>{const u=je(la(m.id)??m.countryCode),g=m.firstName?`${m.firstName.charAt(0)}. ${m.lastName}`:m.lastName,h=m.contribution.toFixed(2).replace(".",",");return`
      <div class="leadout-bonus-popover-grid">
        <span class="results-flag-col-cell">${u}</span>
        <span class="leadout-bonus-rider-name">${v(g)}</span>
        <strong>+${h}</strong>
      </div>
    `}).join("");return`
    <div class="leadout-bonus-popover">
      <div class="leadout-bonus-popover-card">
        <div class="leadout-bonus-popover-head">
          <strong>Leadout-Bonus Details (Gesamt: +${o})</strong>
        </div>
        <div class="leadout-bonus-popover-grid leadout-bonus-popover-grid-head">
          <span>Land</span>
          <span>Fahrer</span>
          <span>Beitrag</span>
        </div>
        ${c}
      </div>
    </div>
  `}function Xr(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function ds(e){var p,m,u,g,h,f,b,y;if(e==null||!d.stageResults)return"";const t=Je(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,s=d.stageResults.classifications,r=(m=(p=s.find($=>$.resultTypeId===oa))==null?void 0:p.rows.find($=>$.rank===1))==null?void 0:m.riderId,n=(g=(u=s.find($=>$.resultTypeId===es))==null?void 0:u.rows.find($=>$.rank===1))==null?void 0:g.riderId,i=(f=(h=s.find($=>$.resultTypeId===ln))==null?void 0:h.rows.find($=>$.rank===1))==null?void 0:f.riderId,o=(y=(b=s.find($=>$.resultTypeId===5))==null?void 0:b.rows.find($=>$.rank===1))==null?void 0:y.riderId,c=[],l=d.selectedResultTypeId;return e===r&&(l===oa||l===1&&a||l!==1&&l!==oa)&&c.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&c.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&c.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&c.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),c.length===0?"":`<span class="jersey-dots-wrapper">${c.join("")}</span>`}function Jr(e){if(!e)return"";let t=e;const a=[],s=[...d.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of s){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),c=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");c.test(t)&&(t=t.replace(c,l=>{const p=`__RIDER_LINK_${a.length}__`,m=we(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(m),p}))}let r=v(t);for(let n=0;n<a.length;n++)r=r.replace(`__RIDER_LINK_${n}__`,a[n]);return r}function pe(){var j,Q,Me,be;d.riders.length===0&&G.getRiders().then(k=>{k.success&&k.data&&(d.riders=k.data,pe())});const e=S("results-race-select"),t=S("results-stage-select"),a=S("results-type-tabs"),s=S("results-marker-tabs"),r=S("results-stage-meta"),n=S("results-empty"),i=S("results-table"),o=i.querySelector("thead tr"),c=S("results-tbody"),l=S("results-marker-classifications"),p=S("results-roster"),m=i.querySelector("colgroup");m&&m.remove(),i.style.tableLayout="",d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+d.races.filter(k=>{var Y;return(((Y=k.stages)==null?void 0:Y.length)??0)>0}).map(k=>`<option value="${k.id}"${k.id===d.selectedResultsRaceId?" selected":""}>${v(k.name)}</option>`).join("");const u=Je(d.selectedResultsRaceId),g=u==null?"":(u.stages??[]).map(k=>`<option value="${k.id}"${k.id===d.selectedResultsStageId?" selected":""}>${v(vm(u,k))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+g;const h=((j=d.stageResults)==null?void 0:j.classifications.filter(k=>!(u&&!u.isStageRace&&k.resultTypeId!==1&&k.resultTypeId!==6)))??[],f=h.find(k=>k.resultTypeId===d.selectedResultTypeId)??h[0]??null,b=d.selectedResultsSpecialView==="nonFinishers",y=d.selectedResultsSpecialView==="events",$=d.selectedResultsSpecialView==="roster";if(f&&!b&&!y&&!$&&(d.selectedResultTypeId=f.resultTypeId),y){i.style.tableLayout="fixed";const k=document.createElement("colgroup");k.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(k,i.firstChild)}if(!d.stageResults&&!$||!f&&!b&&!y&&!$){const k=ma(d.selectedResultsStageId);r.textContent=k?`${k.race.name} · ${k.stage.profile} · ${se(k.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",s.innerHTML="",s.classList.add("hidden"),c.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),p.innerHTML="",p.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=d.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}$?d.resultsRoster&&(r.textContent=`${d.resultsRoster.raceName} · Starterfeld`):d.stageResults&&(r.textContent=`${d.stageResults.raceName} · Etappe ${d.stageResults.stageNumber} · ${d.stageResults.profile} · ${se(d.stageResults.date)}`);const F=d.stageResults?ma(d.stageResults.stageId):null,M=(F==null?void 0:F.stage.distanceKm)??null,x=new Map,T=new Map;if(d.stageResults){const k=d.stageResults.classifications.find(Y=>Y.resultTypeId===1);if(k)for(const Y of k.rows)Y.riderId!=null&&Y.points!=null&&Y.points>0&&x.set(Y.riderId,Y.points);if(d.stageResults.markerClassifications){for(const Y of d.stageResults.markerClassifications)if(Ps(Y.markerType,Y.markerCategory)){for(const W of Y.entries)if(W.riderId!=null&&W.pointsAwarded!=null&&W.pointsAwarded>0){const K=T.get(W.riderId)??0;T.set(W.riderId,K+W.pointsAwarded)}}}}const w=(f==null?void 0:f.resultTypeId)===oa,C=(f==null?void 0:f.resultTypeId)===es||(f==null?void 0:f.resultTypeId)===ln,E=(f==null?void 0:f.resultTypeId)===5,A=(f==null?void 0:f.resultTypeId)===6,N=w||C||E||A,D=h.map(k=>`
    <button
      type="button"
      class="results-type-btn${!b&&!y&&!$&&k.resultTypeId===d.selectedResultTypeId?" active":""}"
      data-result-type-id="${k.resultTypeId}"
    >${v(k.resultTypeName)}</button>
  `),L=`
    <button
      type="button"
      class="results-type-btn${b?" active":""}"
      data-results-special-view="${ki}"
    >OTL/DNF</button>
  `,P=`
    <button
      type="button"
      class="results-type-btn${y?" active":""}"
      data-results-special-view="${$i}"
    >Ereignisse</button>
  `,V=`
    <button
      type="button"
      class="results-type-btn${$?" active":""}"
      data-results-special-view="${Ti}"
    >Teilnehmer</button>
  `,J=h.findIndex(k=>k.resultTypeName.toLocaleLowerCase("de").includes("team"));J>=0?D.splice(J+1,0,L,P,V):D.push(L,P,V),a.innerHTML=D.join("");const R=hm(((Q=d.stageResults)==null?void 0:Q.markerClassifications)??[]);if($){p.innerHTML=km(),p.classList.remove("hidden"),i.classList.add("hidden"),s.innerHTML="",s.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else p.innerHTML="",p.classList.add("hidden");const I=!b&&!y&&!$&&(f==null?void 0:f.resultTypeId)===1&&R.length>0,B=I?d.selectedResultsMarkerKey??Pe:null,_=I&&B!==Pe?R.find(k=>k.markerKey===B)??null:null;if(I&&(d.selectedResultsMarkerKey=(_==null?void 0:_.markerKey)??Pe),y){const k=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"}];s.innerHTML=k.map(Y=>`
      <button
        type="button"
        class="results-type-btn${Y.key===Ce?" active":""}"
        data-event-filter="${Y.key}"
      >${v(Y.label)}</button>
    `).join("")}else s.innerHTML=I?[`
        <button
          type="button"
          class="results-type-btn${d.selectedResultsMarkerKey===Pe?" active":""}"
          data-marker-key="${Pe}"
        >Tageswertung</button>`,...R.map(k=>`
        <button
          type="button"
          class="results-type-btn${k.markerKey===d.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${k.markerKey}"
        >${v(bm(k))}</button>
      `)].join(""):"";s.classList.toggle("hidden",!y&&!I);const U=b||y||!I||d.selectedResultsMarkerKey===Pe;if(o&&U&&(o.innerHTML=b?`
        <th>Etappe</th>
        <th>Status</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Grund</th>
      `:y?`
        <th>km Marke</th>
        <th>Fahrer</th>
        <th>Ereignis</th>
      `:w?`
        <th>Platz</th>
        <th>GC</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
        <th class="results-points-cell">Punktewertung</th>
        <th>UCI Punkte</th>
      `:C?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Punkte</th>
          <th>UCI Punkte</th>
        `:A?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Zeit</th>
          <th>Rückstand</th>
          <th>UCI Punkte</th>
        `:`
        <th>Platz</th>
        ${N?"<th>Trend</th>":""}
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
        <th class="results-points-cell">Punktewertung</th>
        <th>UCI Punkte</th>
      `),c.innerHTML=b?(((Me=d.stageResults)==null?void 0:Me.nonFinishers)??[]).map(k=>`
      <tr>
        <td>${k.stageNumber}</td>
        <td>${ro(k.isOtl)}</td>
        <td class="results-jersey-col-cell">${xt(k.teamId,k.teamName)}</td>
        <td>${Rt(k.riderName,!0,!1,k.riderId,k.teamId)}</td>
        <td class="results-flag-col-cell">${je(k.countryCode)}</td>
        <td>${nt(k.teamName||"–",k.teamId)}</td>
        <td>${v(ts(k.statusReason,k.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':y?[...((be=d.stageResults)==null?void 0:be.events)??[]].filter(k=>Ce==="all"?!0:Ce==="form"?!!(k.title&&(k.title.includes("guten Tag")||k.title.includes("schlechten Tag")||k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))):Ce==="attack"?(k.type==="attack"||k.type==="counter_attack")&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Ce==="breakaway"?!!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Ce==="incident"?(k.type==="incident"||!!(k.title&&k.title.includes("Massensturz")))&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Ce==="exit"?k.type==="dnf"||!!(k.title&&k.title.includes("nicht am Start")):Ce==="home"?!!(k.title&&(k.title.includes("Heimvorteil")||k.title.includes("Heimdruck"))):!0).sort((k,Y)=>{const W=k.kmMark??0,K=Y.kmMark??0;if(Math.abs(W-K)>1e-4)return W-K;if(W===0){const He=Xr(k),ze=Xr(Y);if(He!==ze)return He-ze}const me=k.riderName??"",Ge=Y.riderName??"";return me.localeCompare(Ge,"de")}).map(k=>{var tt;const Y=k.kmMark!=null?`${k.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",W=k.riderId,K=W!=null?Se(W):null,me=k.riderTeamId??(K==null?void 0:K.activeTeamId)??null,Ge=me!=null?((tt=d.teams.find(Ba=>Ba.id===me))==null?void 0:tt.name)??null:null,He=xt(me,Ge),ze=je(W!=null?la(W):null),Mt=W!=null?Rt(k.riderName??"",!0,!1,W,me):v(k.riderName||"–");let ne="";return k.title&&k.title.includes("guten Tag")?ne='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':k.title&&k.title.includes("schlechten Tag")?ne='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':k.title&&(k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))?ne='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':k.title&&k.title.includes("nicht am Start")?ne='<span class="event-badge event-badge-dns">DNS</span>':k.title&&k.title.includes("Massensturz")?ne='<span class="event-badge event-badge-masscrash">Massensturz</span>':k.type==="dnf"?ne='<span class="event-badge event-badge-dnf">DNF</span>':k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))?ne='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':k.type==="attack"?ne='<span class="event-badge event-badge-attack">Attacke</span>':k.type==="counter_attack"?ne='<span class="event-badge event-badge-counter">Konterattacke</span>':k.type==="incident"?k.title&&(k.title.toLowerCase().includes("defekt")||k.title.toLowerCase().includes("panne")||k.title.toLowerCase().includes("technisch"))?ne='<span class="event-badge event-badge-defect">Defekt</span>':ne='<span class="event-badge event-badge-crash">Sturz</span>':k.title&&k.title.includes("Super-Heimvorteil")?ne='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Super-Heim</span>':k.title&&k.title.includes("Heimdruck")?ne='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimdruck</span>':k.title&&k.title.includes("Heimvorteil")&&(ne='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>'),`
          <tr>
            <td>${Y}</td>
            <td>
              <div class="event-rider-info">
                ${He}
                ${ze}
                ${Mt}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${Jr(k.title||"")}</span>
                  ${ne}
                </div>
                ${k.detail?`<div class="event-detail">${Jr(k.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':U&&f?f.rows.map(k=>{const Y=k.riderName??k.teamName,W=k.riderName?k.teamName:"–",K=xt(k.teamId,k.teamName),me=Rt(Y,!0,k.isBreakaway===!0,k.riderId,k.teamId),Ge=je(la(k.riderId)),He=f.resultTypeId===1&&k.rank===1&&k.timeSeconds!=null&&M!=null,ze=k.timeSeconds!=null?`${ua(k.timeSeconds)}${He?` (${Sm(M,k.timeSeconds)})`:""}`:"–",Mt=N?`<td class="results-gc-delta-cell">${no(k.previousRank,k.rankDelta)}</td>`:"";if(C){let tt=k.points!=null?String(k.points):"–";if(k.points!=null&&k.riderId!=null&&f){const Ys=f.resultTypeId===es?x.get(k.riderId)??0:T.get(k.riderId)??0;Ys>0&&(tt+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${Ys}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Mt}
            <td class="results-jersey-col-cell">${K}</td>
            <td>${me}${ds(k.riderId)}</td>
            <td class="results-flag-col-cell">${Ge}</td>
            <td>${nt(W,k.teamId)}</td>
            <td class="results-points-cell">${tt}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(A)return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Mt}
            <td class="results-jersey-col-cell">${K}</td>
            <td>${nt(k.teamName,k.teamId)}</td>
            <td class="results-flag-col-cell">${Ge}</td>
            <td>${ze}</td>
            <td>${v(_a(k.gapSeconds))}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`;let ne=k.points!=null?String(k.points):"–";if(k.leadoutBonus!=null&&k.leadoutBonus>0&&k.leadoutRiderId!=null){const tt=Tm(k);ne=`
          <div class="leadout-bonus-anchor">
            ${k.points!=null?k.points:"–"}
            ${tt}
          </div>
        `}return`
        <tr>
          <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
          ${Mt}
          <td class="results-jersey-col-cell">${K}</td>
          <td>${me}${ds(k.riderId)}</td>
          <td class="results-flag-col-cell">${Ge}</td>
          <td>${nt(W,k.teamId)}</td>
          <td>${ze}</td>
          <td>${v(_a(k.gapSeconds))}</td>
          <td class="results-points-cell">${ne}</td>
          <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
        </tr>`}).join(""):"",n.classList.toggle("hidden",!!f||b||y||$),i.classList.toggle("hidden",!U||$),_){const k=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${v(io(_.markerType,_.markerLabel))}</h4>
          <div class="results-marker-card-meta">${v(`${_.kmMark.toFixed(1).replace(".",",")} km${_.markerCategory?` · Kat. ${_.markerCategory}`:""}`)}</div>
        </div>
      </section>`,Y=_.entries.map(W=>{var He;const K=Se(W.riderId),me=K?`${K.firstName} ${K.lastName}`:`Fahrer ${W.riderId}`,Ge=(K==null?void 0:K.activeTeamId)!=null?((He=d.teams.find(ze=>ze.id===K.activeTeamId))==null?void 0:He.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${W.rank}.</div>
          <div class="results-marker-jersey">${xt(K==null?void 0:K.activeTeamId,Ge)}</div>
          <div class="results-marker-name">${Rt(me,!1,!1,(K==null?void 0:K.id)??null,(K==null?void 0:K.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${je(la(K==null?void 0:K.id))}</div>
          <div class="results-marker-time">${v(ua(W.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${v(_a(W.gapSeconds))}</div>
          <div class="results-marker-points">${W.pointsAwarded!=null&&W.pointsAwarded>0?W.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${k}<div class="results-marker-list">${Y}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!_)}function Mm(){S("results-race-select").addEventListener("change",e=>{var s,r;const t=e.target.value;d.selectedResultsRaceId=t?Number(t):null;const a=Je(d.selectedResultsRaceId);d.selectedResultsStageId=((r=(s=a==null?void 0:a.stages)==null?void 0:s[0])==null?void 0:r.id)??null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=Pe,d.selectedResultsSpecialView=null,d.stageResults=null,pe(),d.selectedResultsStageId!=null&&cs(d.selectedResultsStageId,!0)}),S("results-stage-select").addEventListener("change",e=>{const t=e.target.value;d.selectedResultsStageId=t?Number(t):null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=Pe,d.selectedResultsSpecialView=null,d.stageResults=null,pe(),d.selectedResultsStageId!=null&&cs(d.selectedResultsStageId,!0)}),S("results-type-tabs").addEventListener("click",e=>{var s;const t=e.target.closest("button[data-result-type-id]");if(t){d.selectedResultsSpecialView=null,d.selectedResultTypeId=Number(t.dataset.resultTypeId),pe();return}const a=e.target.closest("button[data-results-special-view]");if(a){const r=a.dataset.resultsSpecialView;r===ki?(d.selectedResultsSpecialView="nonFinishers",pe()):r===$i?(d.selectedResultsSpecialView="events",Ce="all",pe()):r===Ti&&(d.selectedResultsSpecialView="roster",d.selectedResultsRaceId!=null&&((s=d.resultsRoster)==null?void 0:s.raceId)!==d.selectedResultsRaceId&&Mi(d.selectedResultsRaceId).then(()=>pe()),pe())}}),S("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const s=t.dataset.markerKey;d.selectedResultsMarkerKey=s??Pe,pe();return}const a=e.target.closest("button[data-event-filter]");a&&(Ce=a.dataset.eventFilter??"all",pe())})}const Ls=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],Kt=["skills","form","profile","preferences"],As=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],Ds={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...Ls.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function Bs(){return[...As,...Ds[d.teamDetailPage]]}function wi(e,t=12){const a=d.riders.filter(r=>r.activeTeamId===e).sort((r,n)=>n.overallRating-r.overallRating).slice(0,t);return a.length===0?null:a.reduce((r,n)=>r+n.overallRating,0)/a.length}function xi(e){const t=d.riders.filter(s=>s.activeTeamId===e);return t.length===0?null:t.reduce((s,r)=>s+r.overallRating,0)/t.length}function Ri(e){const t=wi(e);return t==null?"–":t.toFixed(1).replace(".",",")}function Ii(e){const t=xi(e);return t==null?"–":t.toFixed(1).replace(".",",")}function X(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function ge(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:X(e,t)}function le(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function fe(e){return e==null?void 0:typeof e=="string"?Ct(e):e.name}function _s(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...Ls.map(t=>t.key)].includes(e)?"desc":"asc"}function Fi(e){return d.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function Ei(e){if(!e.sortKey)return`<th class="${v(e.className??"")}" title="${v(e.title)}">${v(e.label)}</th>`;const t=d.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${v(e.className??"")}" title="${v(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${v(e.label)}</span>
        ${Fi(e.sortKey)}
      </button>
    </th>`}function Ci(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${Kt.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const Ni={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function Gs(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":Ni[e]??String(e)}function Pi(e){const t=[...e],a=d.teamTableSort.direction==="asc"?1:-1;return t.sort((s,r)=>{let n=0;switch(d.teamTableSort.key){case"name":n=X(s.lastName,r.lastName)||X(s.firstName,r.firstName);break;case"countryCode":n=X(dt(s),dt(r));break;case"birthYear":n=s.birthYear-r.birthYear;break;case"age":n=(s.age??0)-(r.age??0);break;case"overallRating":n=s.overallRating-r.overallRating;break;case"potOverall":n=(s.potential??0)-(r.potential??0);break;case"formBonus":n=(s.formBonus??0)-(r.formBonus??0);break;case"raceFormBonus":n=(s.raceFormBonus??0)-(r.raceFormBonus??0);break;case"longTermFatigueMalus":n=(s.longTermFatigueMalus??0)-(r.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(s.shortTermFatigueMalus??0)-(r.shortTermFatigueMalus??0);break;case"seasonPoints":n=(s.seasonPoints??0)-(r.seasonPoints??0);break;case"seasonRaceDays":n=(s.seasonRaceDays??0)-(r.seasonRaceDays??0);break;case"seasonWins":n=(s.seasonWins??0)-(r.seasonWins??0);break;case"contractEndSeason":n=(s.contractEndSeason??Number.MAX_SAFE_INTEGER)-(r.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=X(s.seasonFormPhase??"neutral",r.seasonFormPhase??"neutral");break;case"roleName":n=X(Xe(s),Xe(r));break;case"riderType":n=X(s.riderType,r.riderType)||X(ve(s),ve(r));break;case"skillDevelopment":n=(s.skillDevelopment??0)-(r.skillDevelopment??0);break;case"specialization1":n=ge(fe(s.specialization1),fe(r.specialization1));break;case"specialization2":n=ge(fe(s.specialization2),fe(r.specialization2));break;case"specialization3":n=ge(fe(s.specialization3),fe(r.specialization3));break;case"peak1":n=ge(le(s,0),le(r,0));break;case"peak2":n=ge(le(s,1),le(r,1));break;case"peak3":n=ge(le(s,2),le(r,2));break;default:n=s.skills[d.teamTableSort.key]-r.skills[d.teamTableSort.key];break}return n===0&&(n=X(s.lastName,r.lastName)||X(s.firstName,r.firstName)),n*a}),t}function Li(e){const t=[...e],a=d.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((s,r)=>{let n=0;switch(d.riderMenuTableSort.key){case"name":n=X(s.lastName,r.lastName)||X(s.firstName,r.firstName);break;case"countryCode":n=X(dt(s),dt(r));break;case"birthYear":n=s.birthYear-r.birthYear;break;case"age":n=(s.age??0)-(r.age??0);break;case"overallRating":n=s.overallRating-r.overallRating;break;case"potOverall":n=(s.potential??0)-(r.potential??0);break;case"formBonus":n=(s.formBonus??0)-(r.formBonus??0);break;case"raceFormBonus":n=(s.raceFormBonus??0)-(r.raceFormBonus??0);break;case"longTermFatigueMalus":n=(s.longTermFatigueMalus??0)-(r.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(s.shortTermFatigueMalus??0)-(r.shortTermFatigueMalus??0);break;case"seasonPoints":n=(s.seasonPoints??0)-(r.seasonPoints??0);break;case"seasonRaceDays":n=(s.seasonRaceDays??0)-(r.seasonRaceDays??0);break;case"seasonWins":n=(s.seasonWins??0)-(r.seasonWins??0);break;case"contractEndSeason":n=(s.contractEndSeason??Number.MAX_SAFE_INTEGER)-(r.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=X(s.seasonFormPhase??"neutral",r.seasonFormPhase??"neutral");break;case"roleName":n=X(Xe(s),Xe(r));break;case"riderType":n=X(s.riderType,r.riderType)||X(ve(s),ve(r));break;case"skillDevelopment":n=(s.skillDevelopment??0)-(r.skillDevelopment??0);break;case"specialization1":n=ge(fe(s.specialization1),fe(r.specialization1));break;case"specialization2":n=ge(fe(s.specialization2),fe(r.specialization2));break;case"specialization3":n=ge(fe(s.specialization3),fe(r.specialization3));break;case"peak1":n=ge(le(s,0),le(r,0));break;case"peak2":n=ge(le(s,1),le(r,1));break;case"peak3":n=ge(le(s,2),le(r,2));break;default:n=s.skills[d.riderMenuTableSort.key]-r.skills[d.riderMenuTableSort.key];break}return n===0&&(n=X(s.lastName,r.lastName)||X(s.firstName,r.firstName)),n*a}),t}function us(e){return e.length===0?"–":e.map(t=>{const a=d.races.find(s=>s.id===t);return a?v(a.name):`Rennen ${t}`}).join(", ")}function wm(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function Hs(e,t){var a,s;switch(t.id){case"name":return`<td class="team-table-name-cell">${we(ve(e),{riderId:e.id,teamId:e.activeTeamId,strong:d.teamDetailPage==="form"||d.teamDetailPage==="profile"||d.teamDetailPage==="preferences"})}${go(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${oe(dt(e))}<span>${v(dt(e))}</span></span></td>`;case"age":return`<td>${e.age??(d.gameState?d.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${v(Xe(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${Qs(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${mo(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${Qs((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${er(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${er(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${pn(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${v(le(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${v(le(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${v(le(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${v(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?v(Ct(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?v(Ct(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?v(Ct(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${po(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${oe(e.mentorCountryCode??"UNK")} <span>${v(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${us(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${us(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const r=t.sortKey;return r&&r in e.skills?`<td>${uo(e.skills[r],(a=e.yearStartSkills)==null?void 0:a[r],(s=e.potentials)==null?void 0:s[r])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function xa(){ue("Teams/Fahrer werden aktualisiert...");try{const e=await G.getRiders();if(e.success&&(d.riders=e.data??[]),await G.getTeams().then(t=>{t.success&&(d.teams=t.data??[])}),$e("teams")&&zs(),$e("riders")){const{renderRidersMenu:t}=await fn(async()=>{const{renderRidersMenu:a}=await Promise.resolve().then(()=>Jm);return{renderRidersMenu:a}},void 0);t()}}finally{ce()}}async function xm(e={}){const t=await G.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),S("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${v(t.error??"Unbekannt")}</p>`;return}d.teams=t.data??[],e.render!==!1&&$e("teams")&&zs()}function zs(){const e=S("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+d.teams.map(s=>`<option value="${s.id}"${String(s.id)===t?" selected":""}>${v(s.name)} (${v(s.division??s.divisionName??"")}) · ${v(s.abbreviation)}</option>`).join("");const a=t?Number(t):null;Lt(a)}function Lt(e){const t=S("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=d.teams.find(i=>i.id===e);if(!a){t.innerHTML="";return}const s=Pi(d.riders.filter(i=>i.activeTeamId===e)),r=a.division==="U23"?"badge-u23":"badge-classics",n=Bs();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${v(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${r}">${v(a.division??a.divisionName??"")}</span>
          <span>${oo(a.country,a.countryCode)}</span>
          <span>Kürzel: ${v(a.abbreviation)} · Top 12 ${v(Ri(a.id))} (${v(Ii(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${s.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${v(Gs(d.teamTableSort.key))} ${d.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Ci()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${n.map(Ei).join("")}
          </tr></thead>
          <tbody>
            ${s.length===0?`<tr><td colspan="${n.length}" class="text-muted">Keine Fahrer.</td></tr>`:s.map(i=>`
                <tr class="team-detail-row">
                  ${n.map(o=>Hs(i,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function Ai(){S("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;d.teamDetailPage="skills",Lt(t?Number(t):null)}),S("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const r=Number(t.dataset.riderProgramId);Number.isFinite(r)&&Ws(r);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const r=a.dataset.teamDetailPage;if(Kt.includes(r)){d.teamDetailPage=r,new Set(Bs().map(o=>o.sortKey).filter(o=>o!=null)).has(d.teamTableSort.key)||(d.teamTableSort={key:"name",direction:"asc"});const i=Number(S("teams-dropdown").value);Lt(Number.isFinite(i)?i:null)}return}const s=e.target.closest("button[data-team-sort]");if(s){const r=s.dataset.teamSort;d.teamTableSort.key===r?d.teamTableSort.direction=d.teamTableSort.direction==="asc"?"desc":"asc":d.teamTableSort={key:r,direction:_s(r)};const n=Number(S("teams-dropdown").value);Lt(Number.isFinite(n)?n:null);return}})}const Rm=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:Ds,TEAM_DETAIL_PAGE_ORDER:Kt,TEAM_SKILL_COLUMNS:Ls,TEAM_SKILL_TITLES:Ni,TEAM_TABLE_COLUMNS:As,compareOptionalStrings:ge,compareStrings:X,formatTeamAverage:Ii,formatTeamTopAverage:Ri,getActiveTeamTableColumns:Bs,getDefaultTeamSortDirection:_s,getPeakDate:le,getSortIndicator:Fi,getSpecializationSortLabel:fe,getTeamAverage:xi,getTeamSortLabel:Gs,getTeamTopAverage:wi,initTeamsListeners:Ai,loadTeams:xm,refreshTeamsViewData:xa,renderPeakDatesSummary:wm,renderRacePrefs:us,renderTeamDetail:Lt,renderTeamDetailPageTabs:Ci,renderTeamTableCell:Hs,renderTeamTableHeader:Ei,renderTeams:zs,sortRiderMenuRiders:Li,sortTeamRiders:Pi},Symbol.toStringTag,{value:"Module"}));function Im(e,t,a){return`${e} · Etappe ${t} · ${a}`}function Di(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}async function Bi(e,t=!1){if(on!=null||hs)return!1;qs(e),co(0);try{const a=await G.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const s=a.data,r=await yc(s,i=>dn(i)),n=Di(r,s);return await Oi(e,n,r.markerClassifications,r.incidents,r.allEvents,t),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{qs(null),ce()}}function _i(e){var s;const t=(s=d.rosterEditor)==null?void 0:s.teams.find(r=>r.team.id===e);if(!t)return 0;const a=new Set(d.rosterEditorSelectedRiderIds);return t.riders.filter(r=>a.has(r.rider.id)).length}function Gi(){return d.rosterEditor?d.rosterEditor.teams.every(e=>_i(e.team.id)===e.riderLimit):!1}function Ya(){const e=S("roster-editor-title"),t=S("roster-editor-meta"),a=S("roster-editor-body"),s=S("btn-apply-roster-editor"),r=d.rosterEditor;if(!r){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',s.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=r.race.isStageRace?`${r.race.name} · Etappe ${r.stage.stageNumber} · ${r.stage.profile}`:`${r.race.name} · ${r.stage.profile}`;const n=new Set(d.rosterEditorSelectedRiderIds);a.innerHTML=r.teams.map(i=>{const o=_i(i.team.id),c=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${v(i.team.name)}</h3>
            <p class="text-muted">${v(i.team.abbreviation)} · ${v(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${c}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var f;const m=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),u=l.rider.country?oe(l.rider.country.code3):"",g=[((f=l.rider.role)==null?void 0:f.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),h=l.lockReason?`<span class="roster-editor-rider-lock">${v(l.lockReason)}</span>`:"";return`
              <button
                type="button"
                class="${m}"
                data-roster-team-id="${i.team.id}"
                data-roster-rider-id="${l.rider.id}"
                ${l.isLocked?"disabled":""}
              >
                <span class="roster-editor-rider-name">${u}<span>${v(l.rider.firstName)} ${v(l.rider.lastName)}</span></span>
                <span class="roster-editor-rider-meta">${v(g)}</span>
                ${h}
              </button>`}).join("")}
        </div>
      </section>`}).join(""),s.disabled=!Gi()}function ms(){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],Dt("roster-editor-error"),Ne("rosterEditor")}function Hi(e,t){d.selectedRealtimeStageId=e.stage.id,d.realtimeBootstrap=e,d.realtimeError=null,t&&pt("live-race"),zi().load(e,{autoplay:!0,resetSpeed:!0}),yt()}function zi(){let e=Et;if(!e){const t=S("race-sim-layout"),a=S("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new fm({layout:t,emptyState:a,controlsHeader:S("race-sim-controls-header"),profile:S("race-sim-profile"),groupBox:S("race-sim-group-box"),messages:S("race-sim-messages-body"),favorites:S("race-sim-favorites-body"),sidebar:S("race-sim-sidebar-body"),controls:S("race-sim-controls"),meta:S("race-sim-stage-meta")},{onFinishRequested:(s,r)=>{const n=Di(s,r);Oi(r.stage.id,n,s.markerClassifications,s.incidents,s.allEvents)}}),so(e)}return e}async function Fm(e){ue("Starterfeld wird geladen..."),Dt("roster-editor-error");try{const t=await G.getRosterEditor(e);if(!t.success||!t.data){ot("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),Le("rosterEditor"),Ya();return}d.rosterEditor=t.data,d.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(s=>s.isSelected).map(s=>s.rider.id)),Ya(),Le("rosterEditor")}catch(t){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],ot("roster-editor-error",t.message),Le("rosterEditor"),Ya()}finally{ce()}}async function Em(){const e=d.rosterEditor;if(e){if(!Gi()){ot("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}Dt("roster-editor-error"),ue("Starterfeld wird übernommen...");try{const t=await G.applyRosterEditor(e.stage.id,{riderIds:d.rosterEditorSelectedRiderIds});if(!t.success||!t.data){ot("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}ms(),Hi(t.data,!0)}catch(t){ot("roster-editor-error",t.message)}finally{ce()}}}function yt(){var n,i;const e=S("race-sim-stage-select"),t=((n=d.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===d.selectedRealtimeStageId)||(d.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===d.selectedRealtimeStageId?" selected":""}>${v(Im(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const s=t.find(o=>o.stageId===d.selectedRealtimeStageId)??null,r=zi();if(!s){d.realtimeBootstrap=null,d.realtimeError=null,r.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!d.realtimeBootstrap||d.realtimeBootstrap.stage.id!==s.stageId)&&(d.realtimeError?r.clear(d.realtimeError):r.hide())}async function Ki(e,t){if(Qa!==e){Xs(e),d.selectedRealtimeStageId=e,t&&pt("live-race"),yt(),ue("Live-Simulation wird geladen...");try{const a=await G.getRealtimeSimulation(e);if(!a.success||!a.data){d.realtimeBootstrap=null,d.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",yt(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}Hi(a.data,!1)}catch(a){d.realtimeBootstrap=null,d.realtimeError=a.message,yt(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{Qa===e&&Xs(null),ce()}}}async function Oi(e,t,a,s,r,n=!1){if(!hs){Zs(!0),ue("Live-Ergebnis wird gespeichert...");try{const i=await G.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:s,events:r});if(!i.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(i.error??"Unbekannter Fehler"));return}const o=i.data;d.selectedResultsRaceId=(o==null?void 0:o.raceId)??d.selectedResultsRaceId,d.selectedResultsStageId=(o==null?void 0:o.stageId)??e,d.selectedResultTypeId=1,d.realtimeBootstrap=null,d.realtimeError=null,await cs(e,!1),await Os(),await js(),await xa(),yt(),n||pt("results")}catch(i){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+i.message)}finally{Zs(!1),ce()}}}function Cm(){S("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);d.selectedRealtimeStageId=Number.isFinite(t)?t:null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null),d.realtimeError=null,Ki(t,!1)})}function ji(e){var s;const t=Ra((s=e.category)==null?void 0:s.name),a=Ia(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function Ks(e){var r,n;const t=Ra((r=e.category)==null?void 0:r.name),a=Ia(t),s=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${v(s)}</span>`}function Nm(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(s=>s.date).sort((s,r)=>s.localeCompare(r));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function La(e){const{startDate:t,endDate:a}=Nm(e);return t===a?se(t):`${se(t)} - ${se(a)}`}function Pm(e){return e.stageId>0}async function Os(){const[e,t]=await Promise.all([G.getGameState(),G.getGameStatus()]);if(!e.success){console.error(e.error);return}d.gameState=e.data??null,d.gameStatus=t.success?t.data??null:null,Lm(),$e("dashboard")&&Aa()}function Lm(){var r;if(!d.gameState)return;S("meta-date").textContent=d.gameState.formattedDate,S("meta-season").textContent=`Saison ${d.gameState.season}`;const e=S("meta-race-hint"),t=S("btn-advance-day"),a=S("pending-stages-list"),s=((r=d.gameStatus)==null?void 0:r.pendingStages)??[];s.length>0?(e.textContent=`${s.length} offene Etappe${s.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=s.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${se(n.date)}`:`${n.profile} · ${se(n.date)}`,o=Pm(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
        <div class="pending-stage-item">
          <div class="pending-stage-meta">
            <div class="pending-stage-title">${v(n.raceName)}</div>
            <div class="pending-stage-subtitle">${v(i)}</div>
          </div>
          <div class="pending-stage-actions">
            ${o}
            <button class="btn btn-secondary btn-sm" data-live-stage="${n.stageId}">Live-Sim</button>
            <button class="btn btn-secondary btn-sm" data-instant-stage="${n.stageId}">Instant</button>
          </div>
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):d.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function Aa(){var t,a,s,r,n;const e=d.teams.find(i=>i.isPlayerTeam)??d.teams.find(i=>{var o;return i.name===((o=d.currentSave)==null?void 0:o.teamName)})??null;S("dashboard-career").textContent=((t=d.currentSave)==null?void 0:t.careerName)??"–",S("dashboard-team").textContent=(e==null?void 0:e.name)??((a=d.currentSave)==null?void 0:a.teamName)??"–",S("dashboard-date").textContent=((s=d.gameState)==null?void 0:s.formattedDate)??"–",S("dashboard-season").textContent=d.gameState?`Saison ${d.gameState.season}`:"–",S("dashboard-races-today").textContent=String(((r=d.gameStatus)==null?void 0:r.pendingStages.length)??((n=d.gameState)==null?void 0:n.racesTodayCount)??0),Bm()}async function js(){const e=await G.getRaces();if(!e.success){console.error(e.error);return}d.races=e.data??[],$e("dashboard")&&Aa(),Am(),Dm()}async function Am(){var n;const e=(n=d.gameState)==null?void 0:n.season;if(!e||d.races.length===0)return;const t=`participantCountsLogged_${e}`;if(localStorage.getItem(t))return;const a=d.races.slice(0,30),s=await Promise.all(a.map(async i=>{var c;const o=await G.getRaceProgramParticipants(i.id);return{race:i,count:o.success?((c=o.data)==null?void 0:c.length)??0:-1}}));if(s.some(i=>i.count>0)){console.group(`[Velo] Teilnehmeranzahl Saison ${e}`);for(const{race:i,count:o}of s)o>=0&&console.log(`${i.name} (${i.startDate}): ${o} Programmfahrer`);console.groupEnd(),localStorage.setItem(t,"1")}}async function Dm(){var i;const e=(i=d.gameState)==null?void 0:i.season;if(!e)return;const t=`programAssignmentsLogged_${e}`;if(localStorage.getItem(t))return;const a=await G.getRiders();if(!a.success||!a.data)return;const s=a.data,r=new Map;for(const o of s)if(o.seasonProgram){const c=o.seasonProgram;r.has(c.id)||r.set(c.id,{name:c.name,riders:[]}),r.get(c.id).riders.push(o)}if(r.size===0)return;console.group(`[Velo] Programmzuweisungen Saison ${e}`);const n=Array.from(r.keys()).sort((o,c)=>o-c);for(const o of n){const c=r.get(o);console.log(`Program: ${o} - ${c.name} (Count: ${c.riders.length})`)}console.groupEnd(),localStorage.setItem(t,"1")}function Bm(){const e=S("dashboard-races-tbody"),t=d.races.filter(a=>!d.gameState||a.endDate>=d.gameState.currentDate).slice(0,20);if(t.length===0){e.innerHTML='<tr><td colspan="9" class="text-muted">Keine kommenden Rennen.</td></tr>';return}e.innerHTML=t.map(a=>{var u,g,h,f,b;const s=d.gameState!=null&&a.startDate<=d.gameState.currentDate&&a.endDate>=d.gameState.currentDate,n=d.gameState!=null&&a.endDate<d.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':s?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',i=((u=a.country)==null?void 0:u.name)??`Land ${a.countryId}`,o=(g=a.country)!=null&&g.code3?oe(a.country.code3):"";((h=a.category)==null?void 0:h.name)??`${a.categoryId}`;const c=a.isStageRace?(a.stages??[]).reduce((y,$)=>y+($.distanceKm??0),0):((f=a.upcomingStage)==null?void 0:f.distanceKm)??null,l=a.isStageRace?(a.stages??[]).reduce((y,$)=>y+($.elevationGainMeters??0),0):((b=a.upcomingStage)==null?void 0:b.elevationGainMeters)??null,p=c!=null?String(c.toFixed(1)).replace(".",","):"-",m=l!=null?String(Math.round(l)):"-";return`
      <tr>
        <td>${se(a.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${a.id}">
            <strong>${v(a.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${a.id}">
            ${ji(a)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${o}<span>${v(i)}</span></span></td>
        <td>${Ks(a)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${a.id}">Teilnehmer</button></td>
        <td>${p}</td>
        <td>${m}</td>
        <td>${n}</td>
      </tr>`}).join("")}function Ot(e){return`Etappe ${e.stageNumber}`}function _m(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,s)=>s[1]!==a[1]?s[1]-a[1]:a[0].localeCompare(s[0])).map(([a,s])=>`${s}x ${a}`).join(" · ")}function Gm(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function jt(e){return`<span class="stage-profile-badge ${Gm(e)}">${v(e)}</span>`}function Da(e,t){return`${e.name} · ${Ot(t)} · ${t.profile}`}async function Hm(e){var r;const t=d.stageSummariesByStageId[e];if(t)return t;const a=await G.getStageSummary(e);if(a.success&&a.data)return d.stageSummariesByStageId[e]=a.data,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],a.data;const s=await G.getRealtimeSimulation(e);return s.success&&((r=s.data)!=null&&r.stageSummary)?(d.stageSummariesByStageId[e]=s.data.stageSummary,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],s.data.stageSummary):(d.stageSummaryErrorsByStageId&&(d.stageSummaryErrorsByStageId[e]=a.error??s.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:s.error}),d.stageSummariesByStageId&&delete d.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function zm(){var c;const e=S("race-stages-title"),t=S("race-stages-meta"),a=S("race-stages-body"),s=Je(d.selectedDashboardRaceId);if(!s){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const r=s.stages??[],n=r.reduce((l,p)=>l+(p.distanceKm??0),0),i=r.reduce((l,p)=>l+(p.elevationGainMeters??0),0),o=_m(r);if(e.textContent=s.name,t.textContent=`${La(s)} · ${((c=s.country)==null?void 0:c.name)??`Land ${s.countryId}`} · ${s.isStageRace?`${s.numberOfStages} Etappen`:"Eintagesrennen"} · ${as(n)} · ${ss(i)} · ${o}`,r.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Name</th>
            <th>Profil</th>
            <th>Distanz</th>
            <th>Höhenmeter</th>
            <th>Profil</th>
          </tr>
        </thead>
        <tbody>
          ${r.map(l=>`
              <tr class="dashboard-race-stage-row">
                <td>${se(l.date)}</td>
                <td><strong>${v(Ot(l))}</strong></td>
                <td>${jt(l.profile)}</td>
                <td>${l.distanceKm!=null?as(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?ss(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${v(Da(s,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Km(e){Je(e)&&(d.selectedDashboardRaceId=e,zm(),Le("raceStages"))}function Om(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,s;return`
            <tr>
              <td>${La(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?oe(t.country.code3):""}<span>${v(((s=t.country)==null?void 0:s.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${v(t.name)}</strong></td>
              <td>${Ks(t)}</td>
              <td>${ji(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function Ws(e){const t=d.riders.find(s=>s.id===e);S("rider-program-title").textContent=t?ve(t):"Programm",S("rider-program-meta").textContent="Lade Programmrennen ...",S("rider-program-body").innerHTML="",Le("riderProgram");const a=await G.getRiderProgramRaces(e);if(!a.success||!a.data){S("rider-program-meta").textContent="",S("rider-program-body").innerHTML=`<div class="results-empty">${v(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}S("rider-program-title").textContent=a.data.program.name,S("rider-program-meta").textContent=t?ve(t):"",S("rider-program-body").innerHTML=Om(a.data)}function jm(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=Wm(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${st("Team","team","Team")}
          ${st("Fahrer","rider","Fahrer")}
          ${st("Spec1","spec1","Spezialisierung 1")}
          ${st("Rolle","role","Rolle")}
          ${st("Ges","overall","Gesamtstärke")}
          ${st("Phase","phase","Formphase")}
          ${st("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var s,r;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${kt((s=a.team)==null?void 0:s.id,(r=a.team)==null?void 0:r.name)}</td>
              <td><span class="race-participant-rider-cell">${oe(dt(a.rider))}<strong>${v(ve(a.rider))}</strong></span></td>
              <td>${v(ps(a.rider))}</td>
              <td>${v(Xe(a.rider))}</td>
              <td>${mn(a.rider.overallRating)}</td>
              <td>${pn(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${v(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function st(e,t,a){const s=d.raceParticipantsSort.key===t?" race-participants-sort-active":"",r=d.raceParticipantsSort.key===t?d.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${v(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${s}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${v(e)}</span>
        <span class="team-table-sort-indicator${d.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${r}</span>
      </button>
    </th>`}function Wm(e){const t=d.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{var n,i,o,c;let r=0;switch(d.raceParticipantsSort.key){case"team":r=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=s.team)==null?void 0:i.name)??"","de");break;case"rider":r=ve(a.rider).localeCompare(ve(s.rider),"de");break;case"spec1":r=ps(a.rider).localeCompare(ps(s.rider),"de");break;case"role":r=Xe(a.rider).localeCompare(Xe(s.rider),"de");break;case"overall":r=a.rider.overallRating-s.rider.overallRating;break;case"phase":r=(a.rider.seasonFormPhase??"neutral").localeCompare(s.rider.seasonFormPhase??"neutral","de");break;default:r=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((c=s.program)==null?void 0:c.name)??"","de")}return r*t||ve(a.rider).localeCompare(ve(s.rider),"de")})}function ps(e){return e.specialization1!=null?Ct(e.specialization1):"–"}async function Vm(e){const t=Je(e);d.selectedRaceParticipantsRaceId=e,S("race-participants-title").textContent=(t==null?void 0:t.name)??"Teilnehmer",S("race-participants-meta").textContent="Lade Programmfahrer ...",S("race-participants-body").innerHTML="",d.raceParticipants=[],Le("raceParticipants"),await Wi()}async function Wi(e=!1){const t=d.selectedRaceParticipantsRaceId;if(t==null)return;const a=Je(t);e&&(S("race-participants-meta").textContent="Lade Programmfahrer ...");const s=await G.getRaceProgramParticipants(t);if(!s.success||!s.data){S("race-participants-meta").textContent="",S("race-participants-body").innerHTML=`<div class="results-empty">${v(s.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}d.raceParticipants=s.data,S("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",S("race-participants-meta").textContent=`${s.data.length} Programmfahrer · ${a?La(a):""}`,S("race-participants-body").innerHTML=jm(d.raceParticipants)}async function Um(e,t=null){const a=ma(e);if(!a)return;const s=await Hm(e);if(!s){alert(d.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}d.selectedDashboardProfileStageId=e,S("stage-profile-title").textContent=`${a.race.name} · ${Ot(a.stage)}`;const r=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";S("stage-profile-meta").textContent=`${se(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?as(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?ss(a.stage.elevationGainMeters):"–"}${r}`,No(S("stage-profile-view"),s,a.stage.profile,Da(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),Le("stageProfile")}function Ym(){S("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const r=Number(t.dataset.editStageRoster);if(!Number.isFinite(r))return;Fm(r);return}const a=e.target.closest("button[data-live-stage]");if(a){const r=Number(a.dataset.liveStage);if(!Number.isFinite(r))return;Ki(r,!0);return}const s=e.target.closest("button[data-instant-stage]");if(s){const r=Number(s.dataset.instantStage);if(!Number.isFinite(r))return;Bi(r)}}),S("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-participants-id]");if(t){const r=Number(t.dataset.dashboardRaceParticipantsId);Number.isFinite(r)&&Vm(r);return}const a=e.target.closest("button[data-dashboard-race-id]");if(!a)return;const s=Number(a.dataset.dashboardRaceId);Number.isFinite(s)&&Km(s)}),S("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&Um(a)}),S("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const r=Number(t.dataset.riderProgramId);Number.isFinite(r)&&Ws(r);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const s=a.dataset.raceParticipantsSort;d.raceParticipantsSort.key===s?d.raceParticipantsSort.direction=d.raceParticipantsSort.direction==="asc"?"desc":"asc":d.raceParticipantsSort={key:s,direction:"asc"},Wi()}),S("btn-advance-day").addEventListener("click",async()=>{await Vi()}),S("btn-auto-progress").addEventListener("click",()=>{Zm()})}async function Vi(){ue("Tag wird fortgeschrieben...");try{const e=await G.advanceDay();if(!e.success)return alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler")),!1;if(d.currentSave&&e.data&&(d.currentSave.currentSeason=e.data.season),await Os(),await js(),$e("teams")){const{refreshTeamsViewData:t}=await fn(async()=>{const{refreshTeamsViewData:a}=await Promise.resolve().then(()=>Rm);return{refreshTeamsViewData:a}},void 0);await t()}return!0}catch(e){return alert("Unerwarteter Fehler beim Tageswechsel: "+e.message),!1}finally{ce()}}function Vs(){const e=document.getElementById("btn-auto-progress");e&&(Ve?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function Zm(){Ve?Ui():qm()}function qm(){Ve||(bs(!0),Vs(),Xm())}function Ui(){Ve&&(bs(!1),Vs())}async function Xm(){var e;for(;Ve;){const t=((e=d.gameStatus)==null?void 0:e.pendingStages)??[];let a=!1;if(t.length>0){const s=t[0];a=await Bi(s.stageId,!0)}else a=await Vi();if(!a){bs(!1);break}await new Promise(s=>setTimeout(s,100))}Vs()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&Ve){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),Ui()}});const At=50;function Us(){return[...As,...Ds[d.riderMenuDetailPage]]}function Yi(e){return d.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function Zi(e){if(!e.sortKey)return`<th class="${v(e.className??"")}" title="${v(e.title)}">${v(e.label)}</th>`;const t=d.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${v(e.className??"")}" title="${v(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${v(e.label)}</span>
        ${Yi(e.sortKey)}
      </button>
    </th>`}function qi(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${Kt.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function da(){const e=S("riders-detail"),t=Us(),a=Li(d.riders),s=a.length,r=Math.max(1,Math.ceil(s/At));d.riderMenuPage=Math.min(r,Math.max(1,d.riderMenuPage));const n=(d.riderMenuPage-1)*At,i=Math.min(s,n+At),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${s} Fahrer</span>
        <span class="text-muted">Sortierung: ${v(Gs(d.riderMenuTableSort.key))} ${d.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${qi()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(Zi).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(c=>`
                <tr class="team-detail-row">
                  ${t.map(l=>Hs(c,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${d.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${d.riderMenuPage} / ${r} · Fahrer ${s===0?0:n+1}-${i} von ${s}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${d.riderMenuPage>=r?"disabled":""}>Weiter</button>
      </div>
    </div>`}function Xi(){S("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&Ws(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;Kt.includes(n)&&(d.riderMenuDetailPage=n,new Set(Us().map(o=>o.sortKey).filter(o=>o!=null)).has(d.riderMenuTableSort.key)||(d.riderMenuTableSort={key:"name",direction:"asc"}),d.riderMenuPage=1,da());return}const s=e.target.closest("button[data-riders-sort]");if(s){const n=s.dataset.ridersSort;d.riderMenuTableSort.key===n?d.riderMenuTableSort.direction=d.riderMenuTableSort.direction==="asc"?"desc":"asc":d.riderMenuTableSort={key:n,direction:_s(n)},d.riderMenuPage=1,da();return}const r=e.target.closest("button[data-riders-page-action]");if(r){const n=r.dataset.ridersPageAction,i=Math.max(1,Math.ceil(d.riders.length/At));n==="prev"&&(d.riderMenuPage=Math.max(1,d.riderMenuPage-1)),n==="next"&&(d.riderMenuPage=Math.min(i,d.riderMenuPage+1)),da();return}})}const Jm=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:At,getActiveRiderMenuTableColumns:Us,getRiderMenuSortIndicator:Yi,initRidersListeners:Xi,renderRiderMenuDetailPageTabs:qi,renderRiderMenuTableHeader:Zi,renderRidersMenu:da},Symbol.toStringTag,{value:"Module"})),ia=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function Be(e){return e==null?"free-agents":String(e)}function Qr(e){var a;const t=d.riderTeamEditorPayload;return t?((a=t.teams.find(s=>s.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function Qm(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return un(t/11.2,0,100)}function ep(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function tp(e){return d.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function ap(e){const t=d.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${v(e.title)}"
        aria-label="${v(e.title)}"
      >
        <span class="team-table-sort-label">${v(e.label)}</span>
        ${tp(e.key)}
      </button>
    </th>`}function sp(e,t){switch(d.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return X(e.firstName,t.firstName);case"lastName":return X(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return X(Qr(e.teamId),Qr(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return X(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return X(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function rp(e){const t=d.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>(sp(a,s)||X(a.lastName,s.lastName)||X(a.firstName,s.firstName)||a.riderId-s.riderId)*t)}function np(e){const t=d.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(s=>Be(s.teamId)===t);return rp(a)}function ip(e){const t=d.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${Be(a.teamId)}"${a.teamId===e?" selected":""}>${v(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function Ji(e){return d.riderTeamEditorDirtyRiderIds.includes(e)}function op(e,t){const a=Ji(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${vs(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${ip(e.teamId)}</select></td>`;case"number":{const s=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${s}"></td>`}case"text":{const s=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${v(s)}"></td>`}default:return"<td>–</td>"}}function lp(e){const t=[...e.teams].sort((a,s)=>a.rank-s.rank||X(a.name,s.name));return`
    <aside class="rider-team-editor-sidebar">
      <div class="team-detail-card">
        <div class="team-detail-header">
          <h3>Teamübersicht</h3>
        </div>
        <div class="rider-team-editor-sidebar-list">
          <div class="rider-team-editor-sidebar-item rider-team-editor-sidebar-summary">
            <span>Alle Teams</span>
            <strong>${e.riders.length}</strong>
          </div>
          ${t.map(a=>`
            <button type="button" class="rider-team-editor-sidebar-item${d.riderTeamEditorSelectedTeamKey===Be(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${Be(a.teamId)}">
              <span class="rider-team-editor-sidebar-main">
                <span>${v(a.name)}</span>
                <span class="text-muted">${v(a.abbreviation)} · ${v(a.divisionName)}</span>
              </span>
              <span class="rider-team-editor-sidebar-stats">
                <strong>${a.riderCount}</strong>
                <span>Ø ${a.averageOverall!=null?a.averageOverall.toFixed(1).replace(".",","):"–"} · #${a.rank}</span>
              </span>
            </button>
          `).join("")}
        </div>
      </div>
    </aside>`}function ke(){var o;const e=S("rider-team-editor-root"),t=S("rider-team-editor-meta"),a=d.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const s=d.riderTeamEditorSelectedTeamKey?a.teams.find(c=>Be(c.teamId)===d.riderTeamEditorSelectedTeamKey)??null:null,r=np(a),n=d.riderTeamEditorDirtyRiderIds.length,i=s==null?"Kein Team gewählt":`${s.riderCount} Fahrer · Ø ${s.averageOverall!=null?s.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${s.rank}`;t.textContent=s==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${s.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${d.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(c=>`
                  <option value="${Be(c.teamId)}"${d.riderTeamEditorSelectedTeamKey===Be(c.teamId)?" selected":""}>${v(c.name)} (${c.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${v(d.riderTeamEditorSort.key==="teamName"?"Team":((o=ia.find(c=>c.key===d.riderTeamEditorSort.key))==null?void 0:o.title)??d.riderTeamEditorSort.key)} ${d.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
              <span class="text-muted">Ungespeichert: ${n}</span>
            </div>
            <div class="rider-team-editor-actions">
              <button type="button" class="btn btn-secondary" data-rider-team-editor-action="reload">Neu laden</button>
              <button type="button" class="btn btn-secondary" data-rider-team-editor-action="export" ${d.riderTeamEditorExporting?"disabled":""}>${d.riderTeamEditorExporting?"Exportiert…":"riders.csv exportieren"}</button>
              <button type="button" class="btn btn-primary" data-rider-team-editor-action="save" ${n===0||d.riderTeamEditorSaving?"disabled":""}>${d.riderTeamEditorSaving?"Speichert…":"Änderungen speichern"}</button>
            </div>
          </div>
          <div class="team-detail-table-scroll rider-team-editor-table-scroll">
            <table class="data-table data-table-teams rider-team-editor-table">
              <thead>
                <tr>
                  ${ia.map(ap).join("")}
                </tr>
              </thead>
              <tbody>
                ${r.length===0?`<tr><td colspan="${ia.length}" class="text-muted">${d.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:r.map(c=>`
                    <tr class="team-detail-row${Ji(c.riderId)?" rider-team-editor-row-dirty":""}">
                      ${ia.map(l=>op(c,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${lp(a)}
    </div>`}function cp(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),c=o.length===0?null:Math.round(o.reduce((l,p)=>l+p.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:c,rank:0}}),s=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:s.length,averageOverall:s.length===0?null:Math.round(s.reduce((i,o)=>i+o.overallRating,0)/s.length*100)/100,rank:0,isFreeAgents:!0});const r=[...a].sort((i,o)=>{const c=i.averageOverall??-1;return(o.averageOverall??-1)-c||o.riderCount-i.riderCount||X(i.name,o.name)}),n=new Map(r.map((i,o)=>[Be(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(Be(i.teamId))??a.length}))}async function Qi(e=!1){if(d.riderTeamEditorPayload&&!e){ke();return}S("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await G.getRiderTeamEditor();if(!t.success||!t.data){S("rider-team-editor-root").innerHTML=`<div class="results-empty">${v(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}d.riderTeamEditorPayload=t.data,d.riderTeamEditorDirtyRiderIds=[],d.riderTeamEditorSaving=!1,d.riderTeamEditorExporting=!1,d.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(s=>Be(s.teamId)===d.riderTeamEditorSelectedTeamKey)||(d.riderTeamEditorSelectedTeamKey="")),ke()}function dp(e,t,a){const s=d.riderTeamEditorPayload;if(!s)return;const r=s.riders.find(n=>n.riderId===e);r&&(t==="teamId"?r.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof r[t]=="number"?r[t]=Number.parseInt(a||"0",10):r[t]=a,r.overallRating=Qm(r),s.teams=cp(s),d.riderTeamEditorDirtyRiderIds.includes(e)||(d.riderTeamEditorDirtyRiderIds=[...d.riderTeamEditorDirtyRiderIds,e]),ke())}async function up(){if(!d.riderTeamEditorPayload||d.riderTeamEditorSaving)return;d.riderTeamEditorSaving=!0,ke();const e=await G.saveRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),ke();return}d.riderTeamEditorPayload=e.data,d.riderTeamEditorDirtyRiderIds=[],ke()}async function mp(){if(!d.riderTeamEditorPayload||d.riderTeamEditorExporting)return;d.riderTeamEditorExporting=!0,ke();const e=await G.exportRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),ke();return}rs(e.data.fileName,e.data.content),ke()}function pp(){S("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const r=t.dataset.riderTeamEditorSort;d.riderTeamEditorSort.key===r?d.riderTeamEditorSort.direction=d.riderTeamEditorSort.direction==="asc"?"desc":"asc":d.riderTeamEditorSort={key:r,direction:ep(r)},ke();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){d.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",ke();return}const s=e.target.closest("button[data-rider-team-editor-action]");if(s){const r=s.dataset.riderTeamEditorAction;if(r==="reload"){Qi(!0);return}if(r==="export"){mp();return}r==="save"&&up()}}),S("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){d.riderTeamEditorSelectedTeamKey=t.value,ke();return}const a=e.target.closest(".rider-team-editor-input");if(a){const s=Number(a.dataset.riderTeamEditorRiderId),r=a.dataset.riderTeamEditorField;Number.isFinite(s)&&r&&dp(s,r,a.value)}})}let Oe={key:"pickNumber",asc:!0};function en(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),s=.26+t*.18,r=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${s};--rider-stats-pill-bg-alpha:${r};`}async function eo(e,t=!1){const a=await G.getDraftHistory(e);if(!a.success){d.draftHistory=null,$e("draft")&&gs(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}d.draftHistory=a.data??null,$e("draft")&&gs()}function gs(){const e=S("draft-table-container"),t=S("draft-season-select");if(!d.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const i=d.currentSave.startSeason??2026;for(let o=d.currentSave.currentSeason;o>=i;o--){const c=document.createElement("option");c.value=o.toString(),c.textContent=`Saison ${o}`,t.appendChild(c)}d.draftSelectedSeason||(d.draftSelectedSeason=d.currentSave.currentSeason),t.value=d.draftSelectedSeason.toString(),t.onchange=o=>{const c=o.target;d.draftSelectedSeason=parseInt(c.value,10),eo(d.draftSelectedSeason)}}if(!d.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(d.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...d.draftHistory.rows].sort((i,o)=>{let c=0;const l=Oe.key;return l==="riderLastName"?c=i.riderLastName.localeCompare(o.riderLastName):l==="teamName"?c=i.teamName.localeCompare(o.teamName):l==="oldTeamName"?c=(i.oldTeamName||"").localeCompare(o.oldTeamName||""):l==="countryCode"?c=i.countryCode.localeCompare(o.countryCode):c=(i[l]??0)-(o[l]??0),Oe.asc?c:-c}),s=i=>Oe.key!==i?'<span class="sort-icon-placeholder"></span>':Oe.asc?" ▲":" ▼",r=i=>{Oe.key===i?Oe.asc=!Oe.asc:(Oe.key=i,Oe.asc=!0),gs()};window.setDraftSort=r;let n=`
    <table class="data-table">
      <thead>
        <tr>
          <th class="sortable text-center" onclick="setDraftSort('pickNumber')">Pick${s("pickNumber")}</th>
          <th class="sortable text-center" onclick="setDraftSort('draftRound')">Runde${s("draftRound")}</th>
          <th class="sortable" onclick="setDraftSort('teamName')">Neues Team${s("teamName")}</th>
          <th class="sortable" onclick="setDraftSort('oldTeamName')">Altes Team${s("oldTeamName")}</th>
          <th class="sortable text-center" onclick="setDraftSort('countryCode')">Land${s("countryCode")}</th>
          <th class="sortable" onclick="setDraftSort('riderLastName')">Fahrer${s("riderLastName")}</th>
          <th class="sortable text-center" onclick="setDraftSort('riderBirthYear')">Alter${s("riderBirthYear")}</th>
          <th class="sortable text-center" onclick="setDraftSort('contractLength')">Vertrag${s("contractLength")}</th>
          <th class="sortable text-center" onclick="setDraftSort('overallAtDraft')">Stärke${s("overallAtDraft")}</th>
          <th class="sortable text-center" onclick="setDraftSort('potOverallAtDraft')">Potenzial${s("potOverallAtDraft")}</th>
        </tr>
      </thead>
      <tbody>
  `;for(const i of a){const o=d.draftHistory.season-i.riderBirthYear;let c="-";i.oldTeamName&&(c=`<div style="display:flex; align-items:center; gap:0.5rem;">${kt(i.oldTeamId,i.oldTeamName)} ${v(i.oldTeamName)}</div>`);const l=`<div style="display:flex; align-items:center; gap:0.5rem;">${kt(i.teamId,i.teamName)} ${v(i.teamName)}</div>`;n+=`
      <tr>
        <td class="text-center">#${i.pickNumber}</td>
        <td class="text-center">Runde ${i.draftRound}</td>
        <td>${l}</td>
        <td>${c}</td>
        <td class="text-center">${oe(i.countryCode)}</td>
        <td>${v(i.riderFirstName)} ${v(i.riderLastName)}</td>
        <td class="text-center">${o} J.</td>
        <td class="text-center">${i.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${en(i.overallAtDraft)}">${i.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${en(i.potOverallAtDraft)}">${i.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}n+="</tbody></table>",e.innerHTML=n}async function gp(e=!1){const t=await G.getInjuries();if(!t.success){d.injuries=null,$e("injuries")&&tn(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}d.injuries=t.data??[],$e("injuries")&&tn()}function tn(){const e=S("injuries-table-container");if(!d.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(S("injuries-meta").textContent=d.injuries.length+" Ausfälle",d.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=wa;let t="";const a=d.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),s=new Map;for(const n of a){const i=n.teamId;s.has(i)||s.set(i,[]),s.get(i).push(n)}for(const n of s.keys())s.get(n).sort((i,o)=>o.overallRating-i.overallRating);const r=Array.from(s.keys()).sort((n,i)=>{const o=s.get(n)[0].teamAbbreviation||"",c=s.get(i)[0].teamAbbreviation||"";return o.localeCompare(c)});if(r.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of r){const i=s.get(n),o=i[0].teamAbbreviation;t+=`
        <div style="margin-bottom: 2rem;">
          <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 0.5rem;">
            <img src="/jersey/Jer_${n}.png" style="width: 128px; height: 128px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));" onerror="this.style.display='none'">
            <h3 style="margin: 0; font-size: 1.5rem;">${v(o??"Team "+n)}</h3>
          </div>
          <table class="data-table injuries-table">
            <colgroup>
              <col style="width: 8%;">
              <col style="width: 28%;">
              <col style="width: 8%;">
              <col style="width: 14%;">
              <col style="width: 12%;">
              <col style="width: 12%;">
              <col style="width: 18%;">
            </colgroup>
            <thead>
              <tr>
                <th>Land</th>
                <th>Fahrer</th>
                <th>Alter</th>
                <th>Gesamt</th>
                <th>Typ</th>
                <th>Ausfallzeit</th>
                <th>Fit</th>
              </tr>
            </thead>
            <tbody>
      `;for(const c of i){const l=c.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let p="";if(c.fitDate){const m=se(c.fitDate);if(c.missedRaces&&c.missedRaces.length>0){let u="";for(const g of c.missedRaces)u+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${se(g.startDate)}</span>
                  ${oe(g.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${v(g.name)}</strong>
                  ${Cs(g.categoryName)}
                </div>
              `;p=`
              <div class="injury-fit-cell">
                <strong>${m}</strong>
                <div class="injury-fit-tooltip">
                  <div style="margin-bottom: 0.4rem; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.2rem;">Verpasste Rennen (${c.missedRaces.length})</div>
                  ${u}
                </div>
              </div>
            `}else p=`<strong>${m}</strong>`}else p="Unbekannt";t+=`
          <tr>
            <td>${oe(c.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${c.riderId})" style="color: inherit; text-decoration: none;"><strong>${v(c.riderFirstName)} ${v(c.riderLastName)}</strong></a></td>
            <td>${c.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${yi(c.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${c.unavailableDays} Tage</strong></td>
            <td>${p}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function an(e){return e===0?"–":`-${e}`}function fp(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
    <div class="season-standings-country-popover-card">
      <div class="season-standings-country-popover-head">
        <strong>Top 20 Fahrer</strong>
      </div>
      <div class="season-standings-country-popover-grid season-standings-country-popover-grid-head">
        <span>Platz</span>
        <span>Flagge</span>
        <span>Fahrer</span>
        <span>Punkte</span>
      </div>
      ${e.map(t=>`
        <div class="season-standings-country-popover-grid">
          <strong>${t.rank}</strong>
          <span class="results-flag-col-cell">${je(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${we(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function hp(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${v(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${fp(e.topRiders)}
      </div>
    </div>`}function bp(e,t){const a=t.filter(s=>s.teamId!=null&&e.teamId!=null&&s.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
    <div class="season-standings-country-popover-card">
      <div class="season-standings-country-popover-head">
        <strong>Top 30 Fahrer</strong>
      </div>
      <div class="season-standings-country-popover-grid season-standings-country-popover-grid-head">
        <span>Platz</span>
        <span>Flagge</span>
        <span>Fahrer</span>
        <span>Punkte</span>
      </div>
      ${a.map(s=>`
        <div class="season-standings-country-popover-grid">
          <strong>${s.rank}</strong>
          <span class="results-flag-col-cell">${je(s.countryCode)}</span>
          <span class="season-standings-country-rider-name">${we(s.riderName??"–",{riderId:s.riderId,teamId:s.teamId,strong:!1})}</span>
          <strong>${s.points}</strong>
        </div>
      `).join("")}
    </div>`}function Sp(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${nt(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${bp(e,t)}
      </div>
    </div>`}async function vp(e){const t=await G.getSeasonStandings();if(!t.success){d.seasonStandings=null,$e("season-standings")&&fs();return}d.seasonStandings=t.data??null,$e("season-standings")&&fs()}function fs(){var h,f,b,y,$,F;const e=S("season-standings-meta"),t=S("season-standings-scope-tabs"),a=S("season-standings-empty"),s=S("season-standings-table"),r=S("season-standings-tbody"),n=S("season-standings-jersey-header"),i=S("season-standings-primary-header"),o=S("season-standings-flag-header"),c=S("season-standings-secondary-header"),l=((h=d.seasonStandings)==null?void 0:h.season)??((f=d.gameState)==null?void 0:f.season)??((b=d.currentSave)==null?void 0:b.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.",t.innerHTML=`
    <button
      type="button"
      class="results-type-btn${d.selectedSeasonStandingScope==="riders"?" active":""}"
      data-season-scope="riders"
    >Fahrer</button>
    <button
      type="button"
      class="results-type-btn${d.selectedSeasonStandingScope==="teams"?" active":""}"
      data-season-scope="teams"
    >Teams</button>
    <button
      type="button"
      class="results-type-btn${d.selectedSeasonStandingScope==="countries"?" active":""}"
      data-season-scope="countries"
    >Country</button>
  `;const p=d.selectedSeasonStandingScope==="countries",m=p?((y=d.seasonStandings)==null?void 0:y.countryStandings)??[]:d.selectedSeasonStandingScope==="teams"?(($=d.seasonStandings)==null?void 0:$.teamStandings)??[]:((F=d.seasonStandings)==null?void 0:F.riderStandings)??[],u=p?m:[],g=p?[]:m;if(n.textContent="Trikot",i.textContent=p?"Land":d.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",c.textContent=d.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",p),c.classList.toggle("hidden",p),!d.seasonStandings||m.length===0){r.innerHTML="",s.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}r.innerHTML=p?u.map(M=>`
      <tr>
        <td class="pos-${Math.min(M.rank,3)}">${M.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${hp(M)}</td>
        <td class="results-flag-col-cell">${je(M.countryCode)}</td>
        <td class="hidden"></td>
        <td>${M.points}</td>
        <td>${v(an(M.gapPoints))}</td>
      </tr>`).join(""):g.map(M=>{var A;const x=M.riderName??M.teamName,T=xt(M.teamId,M.teamName),w=d.selectedSeasonStandingScope==="teams"?Sp(M,((A=d.seasonStandings)==null?void 0:A.riderStandings)??[]):Rt(x,!0,!1,M.riderId,M.teamId),C=je(M.countryCode),E=d.selectedSeasonStandingScope==="teams"?v(M.countryName??M.countryCode??"–"):nt(M.teamName??"–",M.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(M.rank,3)}">${M.rank}</td>
          <td class="results-jersey-col-cell">${T}</td>
          <td>${w}</td>
          <td class="results-flag-col-cell">${C}</td>
          <td>${E}</td>
          <td>${M.points}</td>
          <td>${v(an(M.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),s.classList.remove("hidden")}function yp(){S("season-standings-scope-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-season-scope]");if(!t)return;const a=t.dataset.seasonScope;a!=="riders"&&a!=="teams"&&a!=="countries"||(d.selectedSeasonStandingScope=a,fs())})}function sn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function kp(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,s=[...e].map(l=>({rider:l,score:t(l)})).sort((l,p)=>p.score-l.score).slice(0,10),r=[...e].map(l=>({rider:l,score:a(l)})).sort((l,p)=>p.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,p)=>p.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,p)=>p.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,p)=>p.score-l.score).slice(0,10),c=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,p)=>p.score-l.score).slice(0,10);return{Gesamtklassement:s,Sprinter:r,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:c}}function $p(e,t){const a=d.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const s=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,r=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>s(o)):t==="Sprinter"?n=a.map(o=>r(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,c)=>c-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,c)=>o+c,0)/i.length}function Tp(e,t){var i;const s=d.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:$p(o.id,t)}));s.sort((o,c)=>c.avgScore-o.avgScore);const r=s.findIndex(o=>o.teamId===e)+1,n=((i=s.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:r,total:s.length,average:n}}function Mp(e){const t=d.riders.filter(r=>r.activeTeamId===e);if(t.length===0)return 0;const a=t.map(r=>r.overallRating??0);a.sort((r,n)=>n-r);const s=a.slice(0,10);return s.length===0?0:s.reduce((r,n)=>r+n,0)/s.length}function wp(e){var n;const a=d.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:Mp(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const s=a.findIndex(i=>i.teamId===e)+1,r=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:s,total:a.length,average:r}}function Za(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function qa(e){e.countryCode&&oe(e.countryCode);const t=kp(e.riders),a=[...e.riders].map(o=>({rider:o,formValue:o.formBonus+o.raceFormBonus})).sort((o,c)=>c.formValue-o.formValue).slice(0,10),s=[...e.riders].map(o=>({rider:o,uciRank:Ma(o.id)})).filter(o=>o.uciRank!==null).sort((o,c)=>o.uciRank-c.uciRank).slice(0,10),r=Object.entries(t).map(([o,c])=>{const l=Tp(e.teamId,o),p=l.average.toFixed(1).replace(".",","),m=c.map(({rider:u,score:g})=>{const h=`${u.firstName.charAt(0)}. ${u.lastName}`,f=we(h,{riderId:u.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),b=u.nationality?it[u.nationality]??u.nationality.slice(0,2).toLowerCase():null,y=b?`<span class="fi fi-${b} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${v(u.nationality)}"></span>`:"",$=d.riders.find(M=>M.id===u.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${Za(($==null?void 0:$.roleId)??null).color};">
            ${y}
            ${f}
          </span>
          <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g.toFixed(0)}</span>
        </li>
      `}).join("");return`
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
          ${o}
          <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-400); display: block; margin-top: 0.1rem;">Platz ${l.rank}/${l.total} · Ø ${p}</span>
        </h4>
        <ul style="margin: 0; padding: 0; list-style: none;">${m}</ul>
      </div>
    `}).join(""),n=a.map(({rider:o,formValue:c})=>{const l=`${o.firstName.charAt(0)}. ${o.lastName}`,p=we(l,{riderId:o.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),m=o.nationality?it[o.nationality]??o.nationality.slice(0,2).toLowerCase():null,u=m?`<span class="fi fi-${m} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${v(o.nationality)}"></span>`:"",g=(c>=0?"+":"")+c.toFixed(1).replace(".",","),h=`S-Form: ${o.formBonus>=0?"+":""}${o.formBonus.toFixed(1)} / R-Form: ${o.raceFormBonus>=0?"+":""}${o.raceFormBonus.toFixed(1)}`,f=d.riders.find(y=>y.id===o.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Za((f==null?void 0:f.roleId)??null).color};">
          ${u}
          ${p}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${h}">${g}</span>
      </li>
    `}).join(""),i=s.map(({rider:o,uciRank:c})=>{const l=`${o.firstName.charAt(0)}. ${o.lastName}`,p=we(l,{riderId:o.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),m=o.nationality?it[o.nationality]??o.nationality.slice(0,2).toLowerCase():null,u=m?`<span class="fi fi-${m} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${v(o.nationality)}"></span>`:"";let g="rider-stats-rank-badge-gc";c===1?g="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":c===2?g="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":c===3&&(g="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const h=`<span class="rider-stats-rank-badge ${g}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${c}">${c}</span>`,f=d.riders.find(y=>y.id===o.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Za((f==null?void 0:f.roleId)??null).color};">
          ${u}
          ${p}
        </span>
        ${h}
      </li>
    `}).join("");return`
    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
        ${r}
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; border-top: 1px solid var(--border-primary); padding-top: 0.75rem;">
        <div style="background: rgba(251, 191, 36, 0.02); border: 1px solid rgba(251, 191, 36, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: #fbbf24;">Die 10 formstärksten Fahrer</h4>
          <ul style="margin: 0; padding: 0; list-style: none;">${n||'<li class="text-muted" style="font-size:0.85rem;">Keine Daten vorhanden</li>'}</ul>
        </div>
        <div style="background: rgba(59, 130, 246, 0.02); border: 1px solid rgba(59, 130, 246, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: #3b82f6;">Die 10 besten Fahrer (UCI Weltrangliste)</h4>
          <ul style="margin: 0; padding: 0; list-style: none;">${i||'<li class="text-muted" style="font-size:0.85rem;">Keine Fahrer platziert</li>'}</ul>
        </div>
      </div>
    </div>
  `}function Xa(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${d.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${d.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${d.teamStatsTab==="contracts"?"true":"false"}">Auslaufende Verträge</button>
    </div>`}function xp(e){const t=Array.from(new Set(e.topResults.map(u=>u.raceCategoryName).filter(Boolean)));t.sort((u,g)=>u.localeCompare(g,"de"));const a=Array.from(new Set(e.topResults.map(u=>u.season))).sort((u,g)=>g-u);let s=e.topResults.filter(u=>u.rowType!=="stage_result"?u.rowType==="gc_final"?d.teamStatsTopResultsFilters.gc:u.rowType==="mountain_final"?d.teamStatsTopResultsFilters.mountain:u.rowType==="points_final"?d.teamStatsTopResultsFilters.points:u.rowType==="youth_final"?d.teamStatsTopResultsFilters.youth:!0:u.profile==="TTT"||u.isStageRace||u.stageNumber!=null?d.teamStatsTopResultsFilters.stage:d.teamStatsTopResultsFilters.oneDay);if(d.teamStatsTopResultsFilterCategory){const u=d.teamStatsTopResultsFilterCategory;if(u.endsWith("-etappen")){const g=u.substring(0,u.length-8);s=s.filter(h=>h.raceCategoryName===g&&h.rowType==="stage_result")}else if(u.endsWith("-gc")){const g=u.substring(0,u.length-3);s=s.filter(h=>h.raceCategoryName===g&&h.rowType!=="stage_result")}else s=s.filter(g=>g.raceCategoryName===u)}d.teamStatsTopResultsFilterSeason!=null&&(s=s.filter(u=>u.season===d.teamStatsTopResultsFilterSeason)),s.sort((u,g)=>{if(g.seasonPoints!==u.seasonPoints)return g.seasonPoints-u.seasonPoints;const h=u.rowType!=="stage_result",f=g.rowType!=="stage_result",b=u.resultRank??9999,y=g.resultRank??9999;if(d.teamStatsTopResultsFilterCategory)return b!==y?b-y:h!==f?h?-1:1:0;{const $=sn(u.raceCategoryName),F=sn(g.raceCategoryName);return $!==F?$-F:h!==f?h?-1:1:b-y}});const r=20,n=Math.max(1,Math.min(10,Math.ceil(s.length/r)));d.teamStatsTopResultsPage>n&&(d.teamStatsTopResultsPage=n);const i=(d.teamStatsTopResultsPage-1)*r,o=s.slice(i,i+r),l=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${t.map(u=>{if(u.toLowerCase().includes("stage race")||u.toLowerCase().includes("grand tour")||u.toLowerCase().includes("tour de france")){const h=`${u}-etappen`,f=`${u}-gc`;return`
        <option value="${v(h)}" ${d.teamStatsTopResultsFilterCategory===h?"selected":""}>${v(u)} - Etappen</option>
        <option value="${v(f)}" ${d.teamStatsTopResultsFilterCategory===f?"selected":""}>${v(u)} - GC</option>
      `}else return`<option value="${v(u)}" ${d.teamStatsTopResultsFilterCategory===u?"selected":""}>${v(u)}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="team-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${a.map(u=>`<option value="${u}" ${d.teamStatsTopResultsFilterSeason===u?"selected":""}>Saison ${u}</option>`).join("")}
        </select>
      </div>
      
      <div class="top-results-checkboxes" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; border-left: 1px solid rgba(255, 255, 255, 0.15); padding-left: 1rem;">
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="gc" ${d.teamStatsTopResultsFilters.gc?"checked":""} style="accent-color: #ffd700; width: 14px; height: 14px; cursor: pointer;">
          nur GC
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="mountain" ${d.teamStatsTopResultsFilters.mountain?"checked":""} style="accent-color: #ff4d4d; width: 14px; height: 14px; cursor: pointer;">
          nur Bergwertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="points" ${d.teamStatsTopResultsFilters.points?"checked":""} style="accent-color: #2ecc71; width: 14px; height: 14px; cursor: pointer;">
          nur Punktewertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="youth" ${d.teamStatsTopResultsFilters.youth?"checked":""} style="accent-color: #ffffff; width: 14px; height: 14px; cursor: pointer;">
          nur Nachwuchs
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="oneDay" ${d.teamStatsTopResultsFilters.oneDay?"checked":""} style="accent-color: #9b59b6; width: 14px; height: 14px; cursor: pointer;">
          One Day Races
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="stage" ${d.teamStatsTopResultsFilters.stage?"checked":""} style="accent-color: #3498db; width: 14px; height: 14px; cursor: pointer;">
          Etappenwertungen
        </label>
      </div>
    </div>
  `,p=o.length===0?'<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(u=>{const g=u.rowType!=="stage_result",h=g?`${u.raceName} · ${u.rowType==="gc_final"?"Gesamtwertung":u.rowType==="points_final"?"Punktewertung":u.rowType==="mountain_final"?"Bergwertung":"Nachwuchs"}`:u.stageNumber?`${u.raceName} · Etappe ${u.stageNumber}`:u.raceName;let f="–",b="–";u.finishStatus==="otl"?f=mt("OTL","place"):u.finishStatus==="dnf"?f=mt("DNF","place"):u.resultRank==null||(g?b=`<span class="rider-stats-final-type ${u.rowType==="gc_final"?"is-gc":u.rowType==="points_final"?"is-points":u.rowType==="mountain_final"?"is-mountain":"is-youth"}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${u.resultRank}</span>`:f=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${u.resultRank<=3?` rider-stats-rank-badge-top-${u.resultRank}`:""}">${v(String(u.resultRank))}</span>`);const y=u.profile?jt(u.profile):"–",$=!g&&u.stageScore!=null&&u.stageScore>0?Pa(u.stageScore,0,350):"–",F=Ta(u.raceCategoryName),M=u.riderCountryCode?it[u.riderCountryCode]??u.riderCountryCode.slice(0,2).toLowerCase():null,x=M?`<span class="fi fi-${M} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${v(u.riderCountryCode??"")}"></span>`:"–",T=we(u.riderName,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${g?" rider-stats-row-final":""}">
            <td>${f}</td>
            <td>${b}</td>
            <td>${x}</td>
            <td style="white-space: nowrap;">${T}</td>
            <td><strong>${v(h)}</strong></td>
            <td>${y}</td>
            <td>${$}</td>
            <td>${F}</td>
            <td>Saison ${u.season}</td>
            <td><strong>${u.seasonPoints}</strong></td>
          </tr>
        `}).join(""),m=n>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${d.teamStatsTopResultsPage-1}" ${d.teamStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        ${Array.from({length:n}).map((u,g)=>{const h=g+1;return`<button type="button" class="btn btn-sm ${d.teamStatsTopResultsPage===h?"btn-primary":"btn-secondary"}" data-team-top-results-page="${h}">${h}</button>`}).join("")}
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${d.teamStatsTopResultsPage+1}" ${d.teamStatsTopResultsPage===n?"disabled":""}>Weiter &raquo;</button>
      </div>
    `:"";return`
    <section class="rider-stats-top-results" style="margin-top: 1.5rem;">
      ${l}
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 5%;">
            <col style="width: 8%;">
            <col style="width: 4%;">
            <col style="width: 15%;">
            <col style="width: 32%;">
            <col style="width: 7%;">
            <col style="width: 5%;">
            <col style="width: 12%;">
            <col style="width: 6%;">
            <col style="width: 6%;">
          </colgroup>
          <thead>
            <tr>
              <th>Platz</th>
              <th>GC / Wertung</th>
              <th>Nat</th>
              <th>Fahrer</th>
              <th>Rennen</th>
              <th>Profil</th>
              <th>Score</th>
              <th>Klasse</th>
              <th>Saison</th>
              <th>Punkte</th>
            </tr>
          </thead>
          <tbody>
            ${p}
          </tbody>
        </table>
      </div>
      ${m}
    </section>
  `}function Rp(e){const t=String(d.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,categories:{}},s=t==="all",r=m=>s?m:"–",n=(m,u)=>s?`${m} / ${u} T`:"–",i=s?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(m,u,g,h)=>{const f=typeof m=="number"?m:parseFloat(String(m))||0;let b="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return f===0?b+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":u==="gold"?b+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":u==="silver"?b+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":u==="bronze"?b+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":u==="purple"?b+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":u==="green"?b+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":u==="red"?b+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":u==="white"&&(b+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${b}" title="${v(g)}: ${f} Siege">${m}</span>`},c=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #fff;">Karrierestatistiken (Team)</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="team-stats-success-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
        <select id="team-stats-success-season-select" class="form-control" style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">
          <option value="all" ${s?"selected":""}>Ewig (All-Time)</option>
          ${Object.keys(e.successStats).filter(m=>m!=="all").sort((m,u)=>u.localeCompare(m)).map(m=>`
            <option value="${m}" ${String(d.teamStatsSelectedSeason)===m?"selected":""}>Saison ${m}</option>
          `).join("")}
        </select>
      </div>
    </div>
  `,p=a.totalGcWins+a.totalStageWins;return`
    <section class="rider-stats-career" style="margin-top: 1.5rem;">
      ${l}
      
      <!-- Career Summary cards -->
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Siege</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fbbf24;">${p}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Renntage</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #a855f7;">${a.raceDays}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Ausreißversuche</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #3498db;">${a.breakawayAttempts}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Erf. Ausreißer</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #2ecc71;">${a.successfulBreakaways}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${s?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Attacken</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #ffd700;">${r(a.attacks)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${s?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Konterattacken</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e67e22;">${r(a.counterAttacks)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${s?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Stürze</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e74c3c;">${r(a.crashes)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${s?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Defekte</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #95a5a6;">${r(a.defects)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">DNS</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fc8181;">${a.dnsCount}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">DNF</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #f56565;">${a.dnfCount}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">OTL</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e53e3e;">${a.otlCount}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;" ${s?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Krankheiten</div>
          <div style="font-size: 1.35rem; font-weight: bold; color: #ed64a6; line-height: 1.25;">${n(a.illnesses,a.illnessDays)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;" ${s?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Verletzungen</div>
          <div style="font-size: 1.35rem; font-weight: bold; color: #f6ad55; line-height: 1.25;">${n(a.injuries,a.injuryDays)}</div>
        </div>
      </div>

      <!-- Categories details -->
      <h3 style="margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; font-weight: 500; font-size: 1.15rem; color: #fff;">Ergebnisse nach Rennklasse</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 1.25rem;">
        ${c.map(m=>{const u=a.categories[m.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,raceDays:0,leaderJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 365px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${v(m.name)}">${v(m.name)}</span>
                ${Cs(m.key)}
              </div>
              
              ${m.isStage?`
                <!-- Stage Race layout: GC & Classifications -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">GC & Wertungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${o(u.gcWins,"gold","Gesamtwertung Siege")}
                    ${o(u.gcSecond,"silver","Gesamtwertung Platz 2")}
                    ${o(u.gcThird,"bronze","Gesamtwertung Platz 3")}
                    ${o(u.gcTopTen||0,"purple","Gesamtwertung Ränge 4-10")}
                    <span style="border-left: 1px solid rgba(255,255,255,0.15); height: 1rem; margin: 0 0.1rem; display: inline-block;"></span>
                    ${o(u.mountainWins,"red","Bergwertung Siege")}
                    ${o(u.pointsWins,"green","Punktewertung Siege")}
                    ${o(u.youthWins,"white","Nachwuchswertung Siege")}
                  </div>
                </div>
                
                <!-- Etappenergebnisse -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Etappenergebnisse</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${o(u.stageWins,"gold","Etappensiege")}
                    ${o(u.stageSecond,"silver","Etappen Platz 2")}
                    ${o(u.stageThird,"bronze","Etappen Platz 3")}
                    ${o(u.stageTopTen||0,"purple","Etappen Ränge 4-10")}
                  </div>
                </div>

                <!-- Führungstrikots -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Führungstrikot Tage</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(u.leaderJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);"}" title="Tage im Führungstrikot (P1 GC)">
                      🎽 ${u.leaderJerseys||0}
                    </span>
                  </div>
                </div>
              `:`
                <!-- One Day Race layout: Platzierungen -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Platzierungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${o(u.oneDayWins,"gold","Siege")}
                    ${o(u.oneDaySecond,"silver","Platz 2")}
                    ${o(u.oneDayThird,"bronze","Platz 3")}
                    ${o(u.oneDayTopTen||0,"purple","Ränge 4-10")}
                  </div>
                </div>
                
                <!-- Spacer for Stage results -->
                <div style="visibility: hidden; font-size: 0.7rem; margin-bottom: 0.2rem; white-space: nowrap;">&nbsp;</div>
                
                <!-- Spacer for Jerseys -->
                <div style="visibility: hidden; font-size: 0.7rem; margin-bottom: 0.2rem; white-space: nowrap;">&nbsp;</div>
              `}
              
              <!-- Checkpoint-Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Checkpoint-Siege</div>
                <div style="display: flex; gap: 0.3rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${o(u.sprintWins||0,"green","Sprint: Gewonnene Zwischensprints")}
                  ${o(u.climbWinsHC||0,"red","HC: Gewonnene HC-Bergwertungen")}
                  ${o(u.climbWins1||0,"red","C1: Gewonnene Bergwertungen Kategorie 1")}
                  ${o(u.climbWins2||0,"red","C2: Gewonnene Bergwertungen Kategorie 2")}
                  ${o(u.climbWins3||0,"red","C3: Gewonnene Bergwertungen Kategorie 3")}
                  ${o(u.climbWins4||0,"red","C4: Gewonnene Bergwertungen Kategorie 4")}
                </div>
              </div>

              <!-- Profil Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Profil Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${ee(u.winFlat||0,"flat","Flach (Flat)")}
                  ${ee(u.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${ee(u.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${ee(u.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${ee(u.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${ee(u.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${ee(u.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${ee(u.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${ee(u.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${ee(u.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${ee(u.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${q.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${u.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}function Ip(e){var r;const t=((r=d.gameState)==null?void 0:r.season)??new Date().getFullYear(),a=[...e.riders].sort((n,i)=>{const o=n.contractEndSeason??9999,c=i.contractEndSeason??9999;return o!==c?o-c:i.overallRating-n.overallRating});return`
    <section class="rider-stats-contracts" style="margin-top: 1.5rem;">
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 8%;">
            <col style="width: 32%;">
            <col style="width: 10%;">
            <col style="width: 15%;">
            <col style="width: 15%;">
            <col style="width: 20%;">
          </colgroup>
          <thead>
            <tr>
              <th>Nat</th>
              <th>Fahrer</th>
              <th>Alter</th>
              <th>Gesamtstärke</th>
              <th>Pot. Gesamtstärke</th>
              <th>Vertragsende</th>
            </tr>
          </thead>
          <tbody>
            ${a.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Vertragsdaten verfügbar.</td></tr>':a.map(n=>{const i=n.nationality?it[n.nationality]??n.nationality.slice(0,2).toLowerCase():null,o=i?`<span class="fi fi-${i} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${v(n.nationality)}"></span>`:"–",c=we(`${n.firstName} ${n.lastName}`,{riderId:n.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),l=d.riders.find(f=>f.id===n.id),p=`<span class="results-roster-overall-badge" style="color:${rn(n.overallRating)}" title="Stärke: ${n.overallRating.toFixed(2)}">${n.overallRating.toFixed(1)}</span>`;let m="–";l&&l.potential!=null&&(m=`<span class="results-roster-overall-badge" style="color:${rn(l.potential)}" title="Potential: ${l.potential.toFixed(2)}">${l.potential.toFixed(1)}</span>`);const u=n.contractEndSeason===t,g=n.contractEndSeason?`Saison ${n.contractEndSeason}`:"Ohne Vertrag",h=u?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${v(g)}</span>`:`<span style="font-weight: 500;">${v(g)}</span>`;return`
          <tr class="rider-stats-row">
            <td>${o}</td>
            <td style="white-space: nowrap;">${c}</td>
            <td>${n.age}</td>
            <td>${p}</td>
            <td>${m}</td>
            <td>${h}</td>
          </tr>
        `}).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `}function rn(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function rt(e){return d.teamStatsTab==="career"?`
      ${qa(e)}
      ${Xa()}
      ${Rp(e)}
    `:d.teamStatsTab==="contracts"?`
      ${qa(e)}
      ${Xa()}
      ${Ip(e)}
    `:`
    ${qa(e)}
    ${Xa()}
    ${xp(e)}
  `}function Fp(e,t){var s;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((s=d.teams.find(r=>r.id===e))==null?void 0:s.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${v(a)}" aria-label="${v(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${v(cn(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function to(e){d.teamStatsSelectedTeamId=e,d.teamStatsTab="topResults",d.teamStatsTopResultsFilterCategory=null,d.teamStatsTopResultsFilterSeason=null,d.teamStatsSelectedSeason="all",d.teamStatsTopResultsPage=1;const t=d.teams.find(n=>n.id===e);S("team-stats-title").innerHTML=t?`Team <strong>${v(t.name)}</strong>`:"Teamstatistik",S("team-stats-jersey").innerHTML=Fp(e,(t==null?void 0:t.name)??"");const a=wp(e),s=a.average.toFixed(2).replace(".",",");S("team-stats-meta").innerHTML=t?`${v(t.abbreviation)} · ${v(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${s})`:"Daten werden geladen",S("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,Le("teamStats");const r=await G.getTeamStats(e);if(d.teamStatsSelectedTeamId===e){if(!r.success||!r.data){S("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${v(r.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}d.teamStatsPayload=r.data,S("team-stats-body").innerHTML=rt(r.data)}}function Ep(){S("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-stats-tab]");if(a){const r=a.dataset.teamStatsTab;(r==="topResults"||r==="career"||r==="contracts")&&(d.teamStatsTab=r,d.teamStatsPayload&&(S("team-stats-body").innerHTML=rt(d.teamStatsPayload)));return}const s=t.closest("button[data-team-top-results-page]");if(s){const r=Number(s.dataset.teamTopResultsPage);!isNaN(r)&&r>=1&&(d.teamStatsTopResultsPage=r,d.teamStatsPayload&&(S("team-stats-body").innerHTML=rt(d.teamStatsPayload)));return}}),S("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;d.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(S("team-stats-body").innerHTML=rt(d.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;d.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(S("team-stats-body").innerHTML=rt(d.teamStatsPayload))}else if(t.classList.contains("team-stats-filter-checkbox")){const a=t,s=a.dataset.filterType;d.teamStatsTopResultsFilters[s]=a.checked,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(S("team-stats-body").innerHTML=rt(d.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;d.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),d.teamStatsPayload&&(S("team-stats-body").innerHTML=rt(d.teamStatsPayload))}})}window.openTeamStats=to;async function ao(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}Ss("game"),S("meta-career").textContent=((e=d.currentSave)==null?void 0:e.careerName)??"",pt("dashboard"),ue("Spiel wird geladen…");try{await Os(),await js(),Aa()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{ce()}}function Cp(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";pt(t),t==="dashboard"&&Aa(),t==="teams"&&xa(),t==="riders"&&xa(),t==="rider-team-editor"&&Qi(),t==="live-race"&&yt(),t==="results"&&pe(),t==="draft"&&eo(d.draftSelectedSeason||((a=d.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&gp(),t==="season-standings"&&vp(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&Lu()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&wa(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&to(a)}),S("btn-cancel-new").addEventListener("click",()=>Ne("newCareer")),S("btn-close-race-stages").addEventListener("click",()=>Ne("raceStages")),S("btn-close-stage-profile").addEventListener("click",()=>Ne("stageProfile")),S("btn-close-rider-program").addEventListener("click",()=>Ne("riderProgram")),S("btn-close-rider-stats").addEventListener("click",()=>Ne("riderStats")),S("btn-close-team-stats").addEventListener("click",()=>Ne("teamStats")),S("btn-close-race-participants").addEventListener("click",()=>Ne("raceParticipants")),S("btn-close-roster-editor").addEventListener("click",()=>ms()),S("btn-cancel-roster-editor").addEventListener("click",()=>ms()),S("btn-apply-roster-editor").addEventListener("click",()=>{Em()}),S("btn-back-menu").addEventListener("click",()=>{Et==null||Et.pause(),Ss("menu"),Gt()}),So(),Ym(),Ai(),Xi(),pp(),Cm(),Mm(),Uu(),cm(),Ep(),yp()}(async()=>($u(),Te(),Cp(),Ss("menu"),await Gt()))();
