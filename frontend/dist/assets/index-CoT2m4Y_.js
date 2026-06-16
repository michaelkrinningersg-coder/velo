(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=a(r);fetch(r.href,n)}})();function An(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function bs(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function Xt(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function Ya(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function xe(e,t={}){const a=t.strong===!1?"span":"strong",s=bs("app-rider-link-label",t.labelClassName),r=`<${a} class="${s}">${An(e)}</${a}>`;if(t.riderId==null)return r;const n=['type="button"','class="'+bs("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${r}</button>`}function at(e,t,a=!0,s=""){const r=a===!1?"span":"strong",n=`<${r} class="app-team-link-label">${An(e)}</${r}>`;return t==null?n:`<button type="button" class="${bs("app-team-link",s)}" data-team-id="${t}">${n}</button>`}const d={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,draftHistory:null,injuries:null,draftSelectedSeason:null,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1};let Kt=null;function Ao(e){Kt=e}let As=!1;function $r(e){As=e}let Bn=null;function Tr(e){Bn=e}let ys=null;function Mr(e){ys=e}let Qe=!1;function Bs(e){Qe=e}function h(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Q(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function Na(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),s=Math.floor(e%60),r=String(a).padStart(2,"0"),n=String(s).padStart(2,"0");return t>0?`${t}:${r}:${n}`:`${a}:${n}`}function rs(e){return e==null||e===0?"–":`+${Na(e)}`}const xa=2,vs=3,_n=4;function Gn(e){return`/jersey/Jer_${e}.png`}function yt(e,t){var s;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((s=d.teams.find(r=>r.id===e))==null?void 0:s.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${S(a)}" aria-label="${S(a)}">
      <img
        class="results-team-jersey-img"
        src="${S(Gn(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function _t(e,t){return`<span class="results-jersey-cell">${yt(e,t)}</span>`}function Je(e){return e&&re(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function wa(e){var a;if(e==null)return null;const t=Me(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function Me(e){return e==null?null:d.riders.find(t=>t.id===e)??null}function ot(e){return e==null?null:d.races.find(t=>t.id===e)??null}function Pa(e){var t;if(e==null)return null;for(const a of d.races){const s=(t=a.stages)==null?void 0:t.find(r=>r.id===e);if(s)return{race:a,stage:s}}return null}function Gt(e,t=!0,a=!1,s=null,r=null){const n=xe(e,{riderId:s,teamId:r,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function Bo(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function Ss(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function _o(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function Go(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}const rt={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function re(e){const t=rt[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function Ho(e,t){return e?`<span class="country-chip">${re(e.code3)}<span>${S(e.name)}</span></span>`:t?S(t):"–"}function ks(e){return`${e.toFixed(2).replace(".",",")} km`}function $s(e){return`${Math.round(e)} hm`}const zo=new Set;function _s(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),h(`screen-${e}`).classList.remove("hidden")}function Ke(e){h(`modal-${e}`).classList.remove("hidden")}function He(e){h(`modal-${e}`).classList.add("hidden")}function be(e="Lade…"){const t=Qe?" (Leertaste zum Stoppen)":"";h("loading-msg").textContent=e+t,h("loading-progress").classList.add("hidden"),h("loading-overlay").classList.remove("hidden")}function me(){h("loading-overlay").classList.add("hidden")}function Ko(e){h("loading-progress").classList.remove("hidden"),h("loading-overlay").classList.remove("hidden"),Hn(e)}function Hn(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),a=Qe?" (Leertaste zum Stoppen)":"";h("loading-msg").textContent=`Instant-Simulation läuft … ${t}%${a}`,h("loading-progress-bar").style.width=`${t}%`}function ft(e,t){const a=h(e);a.textContent=t,a.classList.remove("hidden")}function Yt(e){h(e).classList.add("hidden")}function $t(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),h(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),h("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of zo)try{a(e)}catch(s){console.error(`Fehler bei View-Aktivierung von "${e}":`,s)}}function he(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function Wt(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function zn(e,t,a){return Math.max(t,Math.min(a,e))}function ns(e,t,a){return Math.round(e+(t-e)*a)}function xr(e,t,a){return`rgb(${ns(e[0],t[0],a)} ${ns(e[1],t[1],a)} ${ns(e[2],t[2],a)})`}function Gs(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=zn(e,t[0].value,t[t.length-1].value);for(let s=1;s<t.length;s+=1){const r=t[s-1],n=t[s];if(a<=n.value){const i=(a-r.value)/(n.value-r.value);return xr(r.color,n.color,i)}}return xr(t[t.length-1].color,t[t.length-1].color,1)}function Kn(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${Gs(e)}"${a}>${e.toFixed(2)}</span>`}function Wo(e,t,a){if(t==null)return Kn(e,a);const s=Math.round((e-t)*100)/100,r=s>0?"skill-delta-positive":s<0?"skill-delta-negative":"skill-delta-neutral",n=s>0?"+":"",i=`<span class="skill-delta ${r}">${n}${s.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${Gs(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function Oo(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function wr(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",s=t>0?"+":"";return`<span class="${a}">${s}${t.toFixed(1).replace(".",",")}</span>`}function Rr(e,t="none",a){const s=e??0,r=["race-sim-form-negative"];t==="warning"&&r.push("load-warning"),t==="critical"&&r.push("load-warning-critical");const n=a?` title="${S(a)}"`:"";return s===0?`<span class="${r.join(" ")}"${n}>0,0</span>`:`<span class="${r.join(" ")}"${n}>-${s.toFixed(1).replace(".",",")}</span>`}function Wn(e){const t=e.seasonFormPhase??"neutral";return On(t)}function On(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${S(a.label)}">${a.symbol}</span>`}function jo(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${S(e.seasonProgram.name)}</button>`:"–"}function vt(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function we(e){return`${e.lastName} ${e.firstName}`}function Vo(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,s=e.unavailableUntil?` bis ${Q(e.unavailableUntil)}`:"",r=`${t}: noch ${a} Tag${a===1?"":"e"}${s}`;return`<span class="rider-availability-marker" title="${S(r)}" aria-label="${S(r)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function it(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function Ts(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(a),r=document.createElement("a");r.href=s,r.download=e,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(s)}async function O(e,t,a){try{const s=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(s.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await s.text();return{success:!1,error:s.ok?"Antwort war kein JSON.":`HTTP ${s.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return s.json()}catch(s){return{success:!1,error:`Netzwerkfehler: ${s.message}`}}}const G={listSaves:()=>O("GET","/api/saves"),createSave:(e,t,a)=>O("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>O("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>O("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>O("GET","/api/teams/available"),getTeams:()=>O("GET","/api/teams"),getTeam:e=>O("GET",`/api/teams/${e}`),getTeamStats:e=>O("GET",`/api/teams/${e}/stats`),getRiders:e=>O("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRiderStats:e=>O("GET",`/api/riders/${e}/stats`),getRiderProgramRaces:e=>O("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>O("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>O("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>O("POST","/api/rider-team-editor/export",e),getRaces:()=>O("GET","/api/races"),getRaceProgramParticipants:e=>O("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>O("GET",`/api/races/${e}/results-roster`),getGameState:()=>O("GET","/api/state"),getGameStatus:()=>O("GET","/api/game/status"),getStageSummary:e=>O("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>O("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>O("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>O("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>O("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>O("POST","/api/state/advance"),getStageResults:e=>O("GET",`/api/results/${e}`),getSeasonStandings:()=>O("GET","/api/season-standings"),listStageEditorStages:()=>O("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>O("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>O("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>O("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>O("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>O("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>O("POST","/api/stage-editor/import",e),exportStageRoute:e=>O("POST","/api/stage-editor/export",e),getInjuries:()=>O("GET","/api/injuries"),getDraftHistory:e=>O("GET",`/api/draft/${e}`),getLeaderboards:(e,t,a)=>O("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`)};async function Qt(){const e=await G.listSaves(),t=h("saves-list"),a=h("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(s=>`
    <div class="save-card">
      <h3>${S(s.careerName)}</h3>
      <p class="save-meta">
        ${S(s.teamName)} · Saison ${s.currentSeason}
        ${s.lastSaved?"· "+Q(s.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${S(s.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${S(s.filename)}" data-career-name="${S(s.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function Uo(e){be("Karriere wird geladen…");const t=await G.loadSave(e);if(me(),!t.success){alert("Fehler beim Laden: "+t.error);return}d.currentSave=t.data??null,await Do()}async function Yo(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;be("Löschen…");const a=await G.deleteSave(e);if(me(),!a.success){alert("Fehler: "+a.error);return}await Qt()}async function Zo(){const e=await G.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){h("btn-delete-all-careers").classList.add("hidden"),h("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){be("Alle Karrieren werden gelöscht…");try{for(const a of t){const s=await G.deleteSave(a.filename);if(!s.success){alert(`Fehler beim Löschen von "${a.careerName}": ${s.error??"Unbekannter Fehler"}`);break}}}finally{me()}await Qt()}}function Jo(){h("btn-new-career").addEventListener("click",async()=>{var r;Yt("new-career-error"),h("input-career-name").value="";const a=h("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',Ke("newCareer");const s=await G.getAvailableTeams();if(!s.success||!((r=s.data)!=null&&r.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=s.data.map(n=>`<option value="${n.id}">${S(n.name)} (${S(n.division??n.divisionName??"")})</option>`).join("")}),h("btn-cancel-new").addEventListener("click",()=>He("newCareer")),h("btn-confirm-new").addEventListener("click",async()=>{const a=h("input-career-name").value.trim(),s=h("input-team-id").value;if(!a||!s){ft("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const r=Number(s),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;Yt("new-career-error"),be("Neue Karriere wird erstellt…");const o=await G.createSave(i,a,r);if(!o.success){me(),ft("new-career-error",o.error??"Unbekannter Fehler.");return}const c=await G.loadSave(i);if(me(),He("newCareer"),!c.success){alert("Fehler: "+c.error);return}d.currentSave=c.data??null,await Do()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>Qt());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{Zo()}),h("saves-list").addEventListener("click",async a=>{const s=a.target.closest("button[data-save-action]");if(!s)return;const{saveAction:r,filename:n,careerName:i}=s.dataset;if(n){if(r==="load"){await Uo(n);return}r==="delete"&&await Yo(n,i??n)}})}const qo="modulepreload",Xo=function(e){return"/"+e},Ir={},jn=function(t,a,s){let r=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));r=Promise.allSettled(a.map(c=>{if(c=Xo(c),c in Ir)return;Ir[c]=!0;const l=c.endsWith(".css"),g=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${g}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":qo,l||(m.as="script"),m.crossOrigin="",m.href=c,o&&m.setAttribute("nonce",o),document.head.appendChild(m),l)return new Promise((u,p)=>{m.addEventListener("load",u),m.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return r.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},Qo={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function el(e){const t=Qo[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const tl=200;function Hs(e){if(e.length===0)return[];const t=[];for(const a of e){const s=t[t.length-1];if(!s||Math.abs(s.distanceMeter-a.distanceMeter)>=tl){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}s.riderIds.push(...a.riderIds),s.riderCount+=a.riderCount,s.distanceSum+=a.distanceMeter*a.riderCount,s.distanceMeter=s.distanceSum/s.riderCount}return t.map(({distanceSum:a,...s})=>s)}function zs(e){if(e.length===0)return[];let t=0;for(let r=1;r<e.length;r+=1)e[r].riderCount>e[t].riderCount&&(t=r);let a=0,s=0;return e.map((r,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(s+=1,o=`A${s}`),{...r,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-r.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,r.distanceMeter-e[n+1].distanceMeter):null}})}function al(e,t=null){var a,s,r;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((s=e.find(n=>n.label==="P"))==null?void 0:s.label)??((r=e[0])==null?void 0:r.label)??null}function lt(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function Er(e,t,a,s){return`${s.type}:${e}:${t}:${a}`}function sl(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:lt(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function Ve(e){const t=[];e.segments.forEach((r,n)=>{const i=n*2;(r.start_markers??[]).forEach((o,c)=>{t.push({key:Er(n,"start",c,o),label:"",marker:o,kmMark:r.start_km,elevation:r.start_elevation,boundary:"start",sequence:i+c/100})}),(r.end_markers??[]).forEach((o,c)=>{t.push({key:Er(n,"end",c,o),label:"",marker:o,kmMark:r.end_km,elevation:r.end_elevation,boundary:"end",sequence:i+1+c/100})})});const a=t.sort((r,n)=>r.kmMark-n.kmMark||r.sequence-n.sequence),s=new Map;return a.map(r=>{const n=(s.get(r.marker.type)??0)+1;return s.set(r.marker.type,n),{...r,label:r.marker.name??sl(r.marker,n)}})}function rl(e){const t=Ve(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>lt(a)).length}}function Pt(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function nl(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Ne(e,t,a,s){return t<=0?s:s+e/t*(a-s*2)}function La(e,t){const a=t/1e3,s=e.points;if(a<=s[0].kmMark)return s[0].elevation;for(let r=0;r<s.length-1;r+=1){const n=s[r],i=s[r+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),c=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*c}return s[s.length-1].elevation}function Vn(e){const t=e.points.map(g=>g.elevation),a=Math.min(...t),s=Math.max(...t),r=Math.max(1,s-a),n=Math.max(40,r*.08),i=Math.max(0,a-n),o=s+n;let c=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=c&&(l=c+100),{axisMinElevation:c,axisMaxElevation:l}}function We(e,t,a,s,r,n){const i=Math.max(1,a-t);return s-n-(e-t)/i*(s-r-n)}function Ot(e){return`${Math.round(e)} m`}function Fr(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function Cr(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function Un(e,t,a,s,r,n,i,o,c){var f;const l=[],g=[];let m=null,u="#b91c1c";for(const y of Ve(e)){const{marker:b,kmMark:v,elevation:M}=y;if(b.type==="climb_start"){g.push({kmMark:v,elevation:M,name:b.name});continue}if(lt(b)){let w=-1;for(let E=g.length-1;E>=0;E-=1)if(b.name&&((f=g[E])==null?void 0:f.name)===b.name){w=E;break}const T=w>=0?g.splice(w,1)[0]:g.pop();T&&Math.max(0,v-T.kmMark),T&&Math.max(0,M-T.elevation);const $=Cr(b.cat,b.type),R=Fr(b.cat);if(b.type==="finish_hill"||b.type==="finish_mountain"){m=b.cat??null,u=$.accentColor;continue}l.push({x:Ne(v*1e3,t,a,s),anchorY:We(M,o,c,r,n,i),primaryLabel:R??"Berg",secondaryLabel:Ot(M),distanceLabel:`${v.toFixed(1).replace(".",",")} km`,accentColor:$.accentColor});continue}if(b.type==="sprint_intermediate"){const w=Cr(b.cat,b.type);l.push({x:Ne(v*1e3,t,a,s),anchorY:We(M,o,c,r,n,i),primaryLabel:"Sprint",secondaryLabel:Ot(M),distanceLabel:`${v.toFixed(1).replace(".",",")} km`,accentColor:w.accentColor})}}const p=e.points[e.points.length-1];return l.push({x:Ne(p.kmMark*1e3,t,a,s),anchorY:We(p.elevation,o,c,r,n,i),primaryLabel:m?`${Fr(m)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:Ot(p.elevation),distanceLabel:`${p.kmMark.toFixed(1).replace(".",",")} km`,accentColor:u}),l.sort((y,b)=>y.x-b.x)}function Yn(e,t,a){const s=t+4,r=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${Pt(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-detail">${Pt(e.distanceLabel)}</text>
    </g>`}function Zn(e,t){const a=new Set,s=t/1e3;for(let r=0;r<=s;r+=25)a.add(Math.round(r*1e3));return a.add(Math.round(t)),[...a].filter(r=>r>=0&&r<=t).sort((r,n)=>r-n)}function Jn(e,t,a,s,r,n){const i=new Set(Ve(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const c=Ne(o,a,s,r),g=i.has(o)?18:12,m=n+g+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${c.toFixed(1)}" y1="${n.toFixed(1)}" x2="${c.toFixed(1)}" y2="${(n+g).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${c.toFixed(1)}" y="${m.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${Pt(nl(o))}</text>
      </g>`}).join("")}function il(e,t,a,s,r,n,i,o,c,l,g){const m=Ne(e.distanceMeter,a,s,n),u=La(t,e.distanceMeter),p=We(u,c,l,r,i,o),f=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),y=e.riderCount>1?`<text x="${m.toFixed(1)}" y="${(p+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${m.toFixed(1)}" cy="${p.toFixed(1)}" r="${f.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${g?" race-sim-cluster-dot-selected":""}"></circle>
      ${y}
    </g>`}function ol(e,t,a,s,r,n,i,o,c,l,g){const m=new Map(g.riders.map(p=>[p.id,p])),u=new Map((g.teams??[]).map(p=>[p.id,p.abbreviation]));return e.filter(p=>p.riderCount===1).map(p=>{const f=p.riderIds[0];if(f==null)return"";const y=m.get(f);if(!y)return"";const b=Ne(p.distanceMeter,a,s,n),v=La(t,p.distanceMeter),M=We(v,c,l,r,i,o),w=y.activeTeamId!=null?u.get(y.activeTeamId)??"":"",T=`${y.lastName} (${w})`,$=M-34,R=M-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${b.toFixed(1)}" y1="${(M-5).toFixed(1)}" x2="${b.toFixed(1)}" y2="${$.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${b.toFixed(1)}" y="${R.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${Pt(T)}</text>
        </g>`}).join("")}function ll(e,t,a,s,r,n,i,o,c,l,g){const m=Math.max(0,Math.min(l,e.distanceKm)),u=Math.max(0,Math.min(g,e.distanceKm));if(u<=m)return null;const p=[{kmMark:m,elevation:La(e,m*1e3)},...e.points.filter(M=>M.kmMark>m&&M.kmMark<u),{kmMark:u,elevation:La(e,u*1e3)}];if(p.length<2)return null;const f=r-i,y=p.map((M,w)=>{const T=Ne(M.kmMark*1e3,t,a,s),$=We(M.elevation,o,c,r,n,i);return`${w===0?"M":"L"} ${T.toFixed(1)} ${$.toFixed(1)}`}).join(" "),b=Ne(m*1e3,t,a,s),v=Ne(u*1e3,t,a,s);return`${y} L ${v.toFixed(1)} ${f.toFixed(1)} L ${b.toFixed(1)} ${f.toFixed(1)} Z`}function dl(e,t,a,s,r={}){const g=e.distanceKm*1e3,{axisMinElevation:m,axisMaxElevation:u}=Vn(e),p=533,f=12,b=e.points.map(E=>{const D=Ne(E.kmMark*1e3,g,1584,28),F=We(E.elevation,m,u,634,168,101);return{x:D,y:F}}).map((E,D)=>`${D===0?"M":"L"} ${E.x.toFixed(1)} ${E.y.toFixed(1)}`).join(" "),v=`${b} L ${1556 .toFixed(1)} ${p.toFixed(1)} L ${28 .toFixed(1)} ${p.toFixed(1)} Z`,M=r.selectedClimbRange!=null?ll(e,g,1584,28,634,168,101,m,u,r.selectedClimbRange.startKm,r.selectedClimbRange.endKm):null,w=Un(e,g,1584,28,634,168,101,m,u).map(E=>Yn(E,f,p)).join(""),$=Array.from({length:5},(E,D)=>m+(u-m)/4*D).map(E=>{const D=We(E,m,u,634,168,101);return`
      <line x1="28" y1="${D.toFixed(1)}" x2="1556" y2="${D.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${D.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${D.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(D+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Ot(E)}</text>`}).join(""),R=Jn(Zn(e,g),e,g,1584,28,p);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${Pt(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      ${$}
      <line x1="28" y1="${p}" x2="1556" y2="${p}" class="race-sim-axis"></line>
      ${`<line x1="28" y1="168" x2="28" y2="${p}" class="race-sim-axis"></line>`}
      <path d="${v}" fill="url(#dashboard-large-area)"></path>
      ${M?`<path d="${M}" class="dashboard-stage-profile-climb-highlight"></path>`:""}
      <path d="${b}" class="race-sim-profile-line"></path>
      ${w}
      ${R}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function cl(e,t,a,s,r){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${dl(t,a,s,!1,r)}</div>`}function ul(e,t,a,s,r,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,c=634,l=28,g=168,m=101,{axisMinElevation:u,axisMaxElevation:p}=Vn(t),f=c-m,y=12,b=Array.from({length:5},(B,x)=>u+(p-u)/4*x),v=Hs(a.clusters),M=zs(v),w=Zn(t,a.stageDistanceMeters),$=t.points.map(B=>{const x=Ne(B.kmMark*1e3,a.stageDistanceMeters,o,l),N=We(B.elevation,u,p,c,g,m);return{x,y:N}}).map((B,x)=>`${x===0?"M":"L"} ${B.x.toFixed(1)} ${B.y.toFixed(1)}`).join(" "),R=`${$} L ${(o-l).toFixed(1)} ${f.toFixed(1)} L ${l.toFixed(1)} ${f.toFixed(1)} Z`,E=Un(t,a.stageDistanceMeters,o,l,c,g,m,u,p).map(B=>Yn(B,y,f)).join(""),D=b.map(B=>{const x=We(B,u,p,c,g,m);return`
      <line x1="${l}" y1="${x.toFixed(1)}" x2="${o-l}" y2="${x.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${x.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${x.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(x+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Ot(B)}</text>`}).join(""),F=Jn(w,t,a.stageDistanceMeters,o,l,f),L=new Map(v.map((B,x)=>[B,M[x]??null])),A=v.map(B=>{var x;return il(B,t,a.stageDistanceMeters,o,c,l,g,m,u,p,((x=L.get(B))==null?void 0:x.label)===i)}).join(""),_=r.stage.profile==="ITT"?ol(v,t,a.stageDistanceMeters,o,c,l,g,m,u,p,r):"";e.innerHTML=`
    <div class="race-sim-profile-layout${r.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${c}" role="img" aria-label="${Pt(s)}">
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
          ${D}
          <line x1="${l}" y1="${f}" x2="${o-l}" y2="${f}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${g}" x2="${l}" y2="${f}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${R}" fill="url(#race-sim-area)"></path>
            <path d="${$}" class="race-sim-profile-line"></path>
            ${E}
            ${A}
          </g>
          ${_}
          ${F}
          <text x="${l.toFixed(1)}" y="${(g-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const ml={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},Nr={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function Ms(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function Za(e,t){return`${e}:${t}`}function pl(e){return new Map(e.map(t=>[Za(t.simulationMode,t.terrain),t.weights]))}function gl(e){return new Map(e.map(t=>[Za(t.simulationMode,t.terrain),t]))}function fl(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function qn(e,t,a){const s=a.get(Za(e,t));if(!s)return[{key:Ms(t),weight:1}];const r=Object.entries(s).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return r.length>0?r:[{key:Ms(t),weight:1}]}function hl(e,t,a,s){const r=qn(t,a,s),n=r.reduce((o,c)=>o+c.weight,0);return n<=0?e[Ms(a)]:r.reduce((o,c)=>o+e[c.key]*c.weight,0)/n}function bl(e,t){const a=t.find(s=>s.simulationMode==="ttt"&&s.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??ml[e]??1.05}function yl(e,t,a){const s=a==null?void 0:a.get(Za(e,t));return{lateMultiplier:(s==null?void 0:s.finalSpreadLateMultiplier)??Nr[t].lateMultiplier,peakMultiplier:(s==null?void 0:s.finalSpreadPeakMultiplier)??Nr[t].peakMultiplier}}const vl=.005,Sl=.005,Xn=70,Qn=1e3,ei=15,ti=360,ai=8,si=-.75,ri=10;function ht(e,t){return e+Math.random()*(t-e)}function ni(e,t,a){return Math.max(t,Math.min(a,e))}function kl(e){return e==="ITT"||e==="TTT"}function ii(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(s=>{var r,n,i;return s.id!==e.id&&s.activeTeamId===e.activeTeamId&&(((r=s.role)==null?void 0:r.name)==="Edelhelfer"||((n=s.role)==null?void 0:n.name)==="Starke Helfer"||((i=s.role)==null?void 0:i.name)==="Wassertraeger")}).map(s=>s.id)}function oi(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function $l(e,t,a,s){const r=s==="crash"?oi():null,n=Number(ht(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=ni(n/Math.max(.1,a)*100,0,100),c=o<=Xn;return{riderId:e.id,type:s,severity:r,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(s==="crash"?ht(10,60):ht(10,45)),recoverySeconds:c?Qn:ti,recoveryFormBonus:c?ei:ai,dayFormPenalty:si,staminaPenalty:ri,recoveryPenaltyStages:s==="crash"?r==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:s==="crash"&&r==="medium"?15:0,supportRiderIds:ii(e,t)}}function Tl(e,t,a){if(kl(t.profile)||a<=0)return[];const s=[];for(const r of e){const n=Math.random(),i=Math.random(),o=vl*Math.max(0,t.crashIncidentMultiplier??1),c=Sl*Math.max(0,t.mechanicalIncidentMultiplier??1),l=o+(t.rolledEffektSturz??0)/100,g=c+(t.rolledEffektDefekt??0)/100,m=n<l,u=i<g;if(!m&&!u)continue;const p=m&&u?n<=i?"crash":"mechanical":m?"crash":"mechanical",f=$l(r,e,a,p);if(p==="crash"&&Math.random()<.01){f.isMassCrashTrigger=!0;const y=Math.floor(ht(2,26)),v=[...e.filter(M=>M.id!==r.id)].sort(()=>.5-Math.random());f.massCrashPotentialRiderIds=v.slice(0,y).map(M=>M.id),Math.random()<.2&&(f.hasAdditionalMechanical=!0,f.waitDurationSeconds+=Math.round(ht(10,45)))}s.push(f)}return s}function Ml(e,t,a,s){const r=oi(),n=Math.round(a*1e3),i=ni(a/Math.max(.1,s)*100,0,100),o=i<=Xn;let c=Math.round(ht(10,60)),l=!1;return Math.random()<.2&&(l=!0,c+=Math.round(ht(10,45))),{riderId:e.id,type:"crash",severity:r,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:c,recoverySeconds:o?Qn:ti,recoveryFormBonus:o?ei:ai,dayFormPenalty:si,staminaPenalty:ri,recoveryPenaltyStages:r==="light"?[10,5,2]:[],raceRecuperationPenalty:r==="medium"?15:0,supportRiderIds:ii(e,t),hasAdditionalMechanical:l}}function li(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function di(e){return Math.round(e*10)/10}function ci(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function ui(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function mi(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function xl(e,t){return e.skills.stamina*(t/300)}function pi(e,t,a){return e.skills.timeTrial+mi(e,t)+e.skills.mountain*(a/500)}function wl(e,t,a,s){const r=xl(e,a),n=mi(e,s);switch(t.profile){case"Flat":return .8*e.skills.sprint+.2*e.skills.flat+n+r;case"Rolling":return .7*e.skills.sprint+.2*e.skills.flat+.1*e.skills.hill+n+r;case"Hilly":return .4*e.skills.sprint+.2*e.skills.flat+.4*e.skills.hill+n+r;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+r;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+r;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+r;case"High_Mountain":return e.skills.mountain+n+r;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+r;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+r;default:return .8*e.skills.sprint+.2*e.skills.flat+n+r}}function Rl(e,t,a,s,r){return t.profile==="ITT"||t.profile==="TTT"?pi(e,r,s):wl(e,t,a,r)}function Il(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:di(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function El(e,t,a,s){ci(a,s);const r=ui(a,s),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const g=o.get(l.activeTeamId)??[];g.push(l),o.set(l.activeTeamId,g)}return[...o.entries()].map(([l,g])=>{const m=n.get(l),p=g.map(v=>pi(v,li(v.id,s==null?void 0:s.dailyFormByRiderId),r)).sort((v,M)=>M-v).slice(0,5),f=p.length,y=f>0?p.reduce((v,M)=>v+M,0)/f:0,b=Math.max(0,5-f)*2;return{team:m??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:y-b}}).sort((l,g)=>g.score-l.score||l.team.id-g.team.id).slice(0,20).map((l,g)=>({rank:g+1,kind:"team",effectiveSkill:di(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(s!=null?xs(e,t,a,s):xs(e,t,a)).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id).slice(0,20).map((o,c)=>Il(o,c+1))}function xs(e,t,a,s){const r=ci(a,s),n=ui(a,s),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var c;return{rider:o,teamName:o.activeTeamId!=null?((c=i.get(o.activeTeamId))==null?void 0:c.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:Rl(o,a,r,n,li(o.id,s==null?void 0:s.dailyFormByRiderId))}}).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id)}function Fl(e,t){return e+Math.random()*(t-e)}function Pr(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const s=Math.floor(Fl(0,a+1)),r=t[a];t[a]=t[s]??r,t[s]=r}return t}function Cl(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function Nl(e,t,a={}){if(e.length===0)return[];const s=e.map(p=>({...p,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),r=a.teams??Cl(s),n=xs(s,r,t,a),i=new Set(n.slice(0,20).map(p=>p.rider.id)),o=Math.min(Math.ceil(s.length*.02),Math.max(0,s.length-i.size)),c=Math.min(Math.ceil(s.length*.01),s.length),l=Pr(s.filter(p=>!i.has(p.id))),g=new Set(l.slice(0,o).map(p=>p.id)),m=Pr(s.filter(p=>!g.has(p.id))),u=new Set(m.slice(0,c).map(p=>p.id));return s.map(p=>g.has(p.id)?{...p,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:u.has(p.id)?{...p,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:p)}function la(e,t){const a=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(s-a+1))+a}function Lr(e,t){return e+Math.random()*(t-e)}function Pl(e,t,a){const s=[...e],r=[];for(;r.length<t&&s.length>0;){const n=s.reduce((l,g)=>l+Math.max(1e-4,a(g)),0);let i=Math.random()*n,o=0;for(let l=0;l<s.length;l+=1)if(i-=Math.max(1e-4,a(s[l])),i<=0){o=l;break}const[c]=s.splice(o,1);c&&r.push(c)}return r}function Ll(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function Dl(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function Al(e,t,a){return new Set(e.map(s=>s.riderId).filter(s=>s!=null&&!t.has(s)).slice(0,a))}function Bl(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function Ks(e){var t;return Bl((t=e.role)==null?void 0:t.name)}function _l(e){return Ve(e).some(({marker:t})=>lt(t))}function Gl(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function Hl(e,t){const a=Gl(e),s=e.hasSuperform===!0?40:1,r=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&Ks(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*s*r*n*i;return{attackFactor:a,superformFactor:s,gcLeaderTeamFactor:r,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function zl(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function Kl(e,t){var s,r;const a=((s=t[0])==null?void 0:s.riderId)??null;return a==null?null:((r=e.find(n=>n.id===a))==null?void 0:r.activeTeamId)??null}function Wl(e,t,a){const s=new Map(t.map(n=>[n.id,n])),r=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=s.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||r.has(i.activeTeamId))&&(r.add(i.activeTeamId),r.size>=a))break}return r}function Ol(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),Ks(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function jl(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const s=t.stageNumber<=10,r=Math.max(1,Math.floor(a*(s?.01:.05))),n=Math.max(r,Math.floor(a*(s?.08:.2)));return{min:r,max:n}}function Vl(e,t){return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?{min:.45,max:.75}:{min:.5,max:.85}}function Ul(e,t,a,s,r,n,i){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||s.distanceKm<=0)return null;const o=e.length,{min:c,max:l}=jl(t,a,o),g=la(c,l),m=t.isStageRace&&a.stageNumber<=10,u=!t.isStageRace,p=Kl(e,n),f=m?Wl(r,e,5):new Set,y=m?Ol(e):new Map,b=_l(s),v=Ll(r,5),M=Dl(n,10),w=new Set([...v,...M]),T=b?Al(i,w,5):new Set,$=zl(a),R=e.filter(C=>{if(C.activeTeamId==null||v.has(C.id)||M.has(C.id)||m&&p!=null&&C.activeTeamId===p||m&&f.has(C.activeTeamId))return!1;const P=Ks(C);return!(u&&(P==="kapitaen"||P==="co-kapitaen")||m&&P==="kapitaen"||m&&P==="co-kapitaen"&&y.get(C.activeTeamId)!==!0||P==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(R.length===0)return null;const E=new Map(R.map(C=>[C.id,Hl(C,{isEarlyStageRace:m,race:t,gcLeaderTeamId:p,stageHasMountainClassifications:b,topMountainIds:T,isHardStage:$})])),D=R.reduce((C,P)=>{var z;return C+(((z=E.get(P.id))==null?void 0:z.finalWeight)??0)},0),F=Pl(R,Math.min(g,R.length),C=>{var P;return((P=E.get(C.id))==null?void 0:P.finalWeight)??1});if(F.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${F.length}/${g} ausgewählt aus ${R.length}`),console.log(`Gesamtgewicht im Pool: ${D.toFixed(2)}`),console.table(F.map(C=>{var z;const P=E.get(C.id);return{Fahrer:`${C.firstName} ${C.lastName}`,Team:C.activeTeamId,Rolle:((z=C.role)==null?void 0:z.name)??null,Atk:C.skills.attack,Hill:C.skills.hill,Chance:`${((D>0&&P!=null?P.finalWeight/D:0)*100).toFixed(2)}%`,Gewicht:((P==null?void 0:P.finalWeight)??1).toFixed(2),Attacke:`x${((P==null?void 0:P.attackFactor)??1).toFixed(2)}`,Superform:`x${(P==null?void 0:P.superformFactor)??1}`,GC_Team:`x${((P==null?void 0:P.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(P==null?void 0:P.mountainFactor)??1}`,Sprinter:`x${(P==null?void 0:P.sprinterFactor)??1}`}})),console.groupEnd();const L=s.distanceKm*1e3,A=la(0,Math.min(1e4,Math.max(0,Math.floor(L*.1)))),_=Vl(t,a),B=Math.round(L*Lr(_.min,_.max)),x=Math.round(L*Lr(.1,.25)),N=Math.max(A+1e3,Math.min(B-1e3,B-x)),H=a.rolledBreakawayBonus??0,I=la(3+H,8+H);return{riderIds:F.map(C=>C.id),triggerDistanceMeters:A,groupPhaseEndDistanceMeters:N,phaseEndDistanceMeters:B,skillBonus:I,malusValue:la(5,8)}}const Yl=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),Zl=3,Jl=7,Dr=120,Ar=200,Br=180,ql=10,da=8e3;function bt(e,t,a=Math.random()){const s=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(a*(r-s+1))+s}function Xl(e){for(let t=e.length-1;t>0;t-=1){const a=bt(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function Da(e,t){return t<=0||e.length===0?[]:Xl([...e]).slice(0,Math.min(t,e.length))}function Ql(e,t,a){if(t<=0||e.length===0)return[];const s=[...e],r=[];for(;s.length>0&&r.length<t;){const n=s.reduce((c,l)=>c+Math.max(0,a(l)),0);if(n<=0){r.push(...Da(s,t-r.length));break}let i=Math.random()*n,o=s.length-1;for(let c=0;c<s.length;c+=1)if(i-=Math.max(0,a(s[c])),i<=0){o=c;break}r.push(s[o]),s.splice(o,1)}return r}function ed(e){return Yl.has(e.profile)}function td(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function ad(e,t){if(!ed(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(s=>{if(!td(s))return[];const r=s.start_km*1e3,n=s.end_km*1e3,i=Math.max(r,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:r,sourceSegmentEndMeters:n}]})}function _r(e,t){const a=t==null?e:e.filter(c=>{const l=Math.min(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t)),g=Math.max(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t));return l>=da||g>=da});if(a.length===0)return null;const s=a[bt(0,a.length-1)];if(!s)return null;const r=Math.ceil(s.startMeters),n=Math.floor(s.endMeters);if(n<=r)return null;let i=0;for(;i<12;){const c=bt(r,n);if(t==null||Math.abs(c-t)>=da)return{triggerDistanceMeters:c,sourceSegmentStartMeters:s.sourceSegmentStartMeters,sourceSegmentEndMeters:s.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<s.startMeters?n:r;return t==null||Math.abs(o-t)>=da?{triggerDistanceMeters:o,sourceSegmentStartMeters:s.sourceSegmentStartMeters,sourceSegmentEndMeters:s.sourceSegmentEndMeters}:null}function sd(e,t,a,s=()=>1){const r=e.slice(0,15),n=ad(t,a);if(r.length===0||n.length===0)return[];const i=bt(Zl,Math.min(Jl,r.length)),o=Ql(r,i,s),c=[];for(const u of o){const p=_r(n);p&&c.push({riderId:u.id,attackNumber:1,triggerDistanceMeters:p.triggerDistanceMeters,durationSeconds:bt(Dr,Ar),sourceSegmentStartMeters:p.sourceSegmentStartMeters,sourceSegmentEndMeters:p.sourceSegmentEndMeters,isCounterAttack:!1})}if(c.length===0)return[];const l=c.map(u=>u.riderId),g=Math.floor(l.length*.5),m=new Set(Da(l,g));for(const u of[...c]){if(!m.has(u.riderId))continue;const p=_r(n,u.triggerDistanceMeters);p&&c.push({riderId:u.riderId,attackNumber:2,triggerDistanceMeters:p.triggerDistanceMeters,durationSeconds:bt(Dr,Ar),sourceSegmentStartMeters:p.sourceSegmentStartMeters,sourceSegmentEndMeters:p.sourceSegmentEndMeters,isCounterAttack:!1})}return c.sort((u,p)=>u.triggerDistanceMeters-p.triggerDistanceMeters||u.riderId-p.riderId||u.attackNumber-p.attackNumber)}function rd(e,t,a){var c;if(e.length===0)return[];const s=((c=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:c.teamId)??null,r=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||s!=null&&l.teamId===s));if(r.length===0)return[];const n=new Map;for(const l of r){const g=n.get(l.teamId)??[];g.push(l),n.set(l.teamId,g)}const i=[...n.values()].map(l=>Da(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(bt(0,3),i.length);return Da(i,o).map(l=>l.riderId)}function nd(e,t){const a=[],s=[];for(const[r,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){s.push(r);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:s}}const id={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},od={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},ld={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},dd={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},cd={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function ud(e){const t=new Map;for(const a of e){const s=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",s);else if(a.appliesTo==="climb_top"){const r=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${r}`,s)}else a.appliesTo==="finish"&&t.set(a.markerType,s)}return t}const ca=20,md=120,pd=300,is=.025,gd=.1,fd=.4,hd=.6,bd=.8,Aa=1,Gr=2/3,yd=.1,ua=10,Hr=50,vd=25,Sd=7,kd=500,$d=100,Td=.02,Md=.04,xd=.009,wd=120,Rd=150,Id=100,Ed=300,zr=50,os=85,ut=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],Kr=5*60,Fd=60,Cd=.5,Nd=.3,ma=5e3,Pd=2e3,Ld=1,Dd=2,Ad=.05,gi={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},Bd={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},pa=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function oe(e,t,a){return Math.max(t,Math.min(a,e))}function de(e,t){return e+Math.random()*(t-e)}function Wr(e){return e[Math.floor(Math.random()*e.length)]}function It(e){return Math.round(e*100)/100}function _d(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function Or(e){if(e<2)return 1;const t=oe(e,2,20),a=pa[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let s=1;s<pa.length;s+=1){const r=pa[s-1],n=pa[s];if(t>n.gradientPercent)continue;const i=(t-r.gradientPercent)/Math.max(1e-4,n.gradientPercent-r.gradientPercent),o=r.draftPenaltyShare+(n.draftPenaltyShare-r.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function Gd(e){return e==="Flat"?wd:e==="Abfahrt"?Rd:Number.POSITIVE_INFINITY}function Hd(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function Ba(e){return(e.formBonus??0)+(e.raceFormBonus??0)-(e.fatigueMalus??0)-(e.longTermFatigueMalus??0)-(e.shortTermFatigueMalus??0)}function zd(e,t){if(t.length===0)return"";const a=t.reduce((g,m)=>g+m.weight,0),s=t.map(g=>{const m=e.skills[g.key],u=Math.round(g.weight/a*100);return`${gi[g.key]} ${Math.round(m)} (${u}%)`}),r=e.formBonus??0,n=e.raceFormBonus??0,i=e.fatigueMalus??0,o=e.longTermFatigueMalus??0,c=e.shortTermFatigueMalus??0;s.push(`S-Form ${r>=0?"+":""}${r.toFixed(1).replace(".",",")}`),s.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&s.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&s.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),c>0&&s.push(`Akut -${c.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const g of t)l+=(e.mentorBoosts[g.key]||0)*(g.weight/a);return l>0&&s.push(`Mentor +${l.toFixed(1).replace(".",",")}`),s.join(" • ")}function Kd(){const e=Math.random();return e<.9?de(5,20):e<.98?de(20,40):de(40,70)}function jr(){const e=Math.random();return e<.9?It(de(-1,1)):e<.995?It(Wr([-1,1])*de(1,2)):It(Wr([-1,1])*de(3,4))}function Wd(){return It(de(-3,3))}function Od(e){const t=[];let a=0,s=Kd(),r=de(-1,1);for(;a<e;){const n=Math.min(e-a,de(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:s,vector:r}),a+=n,a>=e)break;s=oe(s+(Math.random()<.5?-1:1)*de(2,10),5,70),r=oe(r+(Math.random()<.5?-1:1)*de(0,.5),-1,1)}return t}function fi(e,t){const a=J(e),s=J(t);if(a!==s)return a?1:-1;const r=ge(e),n=ge(t);return r&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:r?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function J(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function ge(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function Bt(e,t,a=!1,s=null){var c;const r="rider"in e?e.rider:null,n=(r==null?void 0:r.specialization1)??null,i=(r==null?void 0:r.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(c=r==null?void 0:r.role)==null?void 0:c.name;s==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function jd(e,t,a=null,s=null,r=!1){var p,f;const n=y=>y.photoFinishScore;if(!t){const y=[...e].sort((v,M)=>v.crossingTimeSeconds-M.crossingTimeSeconds||M.photoFinishScore-v.photoFinishScore||v.riderId-M.riderId),b=((p=y[0])==null?void 0:p.crossingTimeSeconds)??0;return y.map((v,M)=>({riderId:v.riderId,rank:M+1,crossingTimeSeconds:v.crossingTimeSeconds,gapSeconds:Math.max(0,v.crossingTimeSeconds-b),photoFinishScore:v.photoFinishScore}))}const i=[...e].sort((y,b)=>y.crossingTimeSeconds-b.crossingTimeSeconds||b.photoFinishScore-y.photoFinishScore||y.riderId-b.riderId),o=((f=i[0])==null?void 0:f.crossingTimeSeconds)??0,c=[];let l=[],g=0,m=null;const u=()=>{const y=Math.max(0,g-o),b=l.sort((v,M)=>n(M)-n(v)||v.riderId-M.riderId);for(const v of b)c.push({riderId:v.riderId,rank:c.length+1,crossingTimeSeconds:v.crossingTimeSeconds,gapSeconds:y,photoFinishScore:v.photoFinishScore})};for(const y of i){if(l.length===0){l=[y],g=y.crossingTimeSeconds,m=y.crossingTimeSeconds;continue}if(m!=null&&y.crossingTimeSeconds-m<=Aa){l.push(y),m=y.crossingTimeSeconds;continue}u(),l=[y],g=y.crossingTimeSeconds,m=y.crossingTimeSeconds}return l.length>0&&u(),c}function Vd(e,t,a){const s=e.filter(ge).sort((m,u)=>(m.finishTimeSeconds??0)-(u.finishTimeSeconds??0)||u.photoFinishScore-m.photoFinishScore||m.rider.id-u.rider.id),r=e.filter(m=>!J(m)).sort(fi),n=e.filter(m=>m.finishStatus==="dnf").sort((m,u)=>u.distanceCoveredMeters-m.distanceCoveredMeters||m.rider.id-u.rider.id),i=[];let o=[],c=null;const l=m=>m.photoFinishScore,g=()=>{i.push(...o.sort((m,u)=>l(u)-l(m)||m.rider.id-u.rider.id))};for(const m of s){const u=m.finishTimeSeconds??0;if(o.length===0){o=[m],c=u;continue}if(c!=null&&u-c<=Aa){o.push(m),c=u;continue}g(),o=[m],c=u}return o.length>0&&g(),[...i,...r,...n]}function Ud(e,t){const a=J(e),s=J(t);if(a!==s)return a?1:-1;const r=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(r)>=.1?r:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:ge(e)&&ge(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:ge(e)?-1:ge(t)?1:e.rider.id-t.rider.id}function Vr(e){const t=oe(e,1,Hr);return t<=2?.12*t:t<=ua?.24+(t-2)/Math.max(1,ua-2)*.58:.82+(t-ua)/Math.max(1,Hr-ua)*.18}function ls(e,t){const a=Ba(e.rider);return Object.entries(t).reduce((s,[r,n])=>{if(!n)return s;const i=r==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[r]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return s+o*n},0)}function Yd(e,t){const a=Ba(e.rider);return Object.entries(t).filter(s=>!!s[1]).map(([s,r])=>{const n=s,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:r,effectiveSkill:o,contribution:o*r}})}function Zd(e,t,a){let s=t;for(;s>0;){const n=e[s-1].distanceCoveredMeters-e[s].distanceCoveredMeters;if(n<=0||n>=a)break;s-=1}let r=t;for(;r<e.length-1;){const n=e[r].distanceCoveredMeters-e[r+1].distanceCoveredMeters;if(n<=0||n>=a)break;r+=1}return{startIndex:s,endIndex:r,size:r-s+1,positionInGroup:t-s}}function Jd(e,t){if(e<vd)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class hi{constructor(t,a){var _,B;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.hasLoggedFinishSprintTieBreak=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const s=(_=t.race.country)==null?void 0:_.code3;s&&(t.riders=t.riders.map(x=>{var H;const N=x.nationality||((H=x.country)==null?void 0:H.code3);if(N&&N.trim().toUpperCase()===s.trim().toUpperCase()){const I={...x,skills:{...x.skills}},C=Math.random(),P=t.stage.profile,z=P==="ITT"||P==="TTT",Z=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(P==="Cobble"||P==="Cobble_Hill")&&Z.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(P)||Z.push("mountain","mediumMountain");const le=[...(ce=>{const pe=[...Z],k=[];if(z){k.push("timeTrial");const K=Math.min(ce-1,pe.length);for(let W=0;W<K;W++){const V=Math.floor(Math.random()*pe.length);k.push(pe.splice(V,1)[0])}}else{const K=Math.min(ce,pe.length);for(let W=0;W<K;W++){const V=Math.floor(Math.random()*pe.length);k.push(pe.splice(V,1)[0])}}return k})(5)].sort(()=>Math.random()-.5);if(I.homeEffectSkills=le,C<.05){I.homeEffect="home_pressure";for(const ce of le)I.skills[ce]=Math.max(0,I.skills[ce]-.5)}else if(C<.1){I.homeEffect="super_home";const ce=le[0];I.skills[ce]=Math.min(100,I.skills[ce]+3);for(let pe=1;pe<5;pe++){const k=le[pe];I.skills[k]=Math.min(100,I.skills[k]+1)}}else{I.homeEffect="normal_home";for(const ce of le)I.skills[ce]=Math.min(100,I.skills[ce]+1)}return I}return x})),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=fl(t.stage.profile),this.skillWeightRuleMap=pl(t.skillWeightRules??[]),this.skillWeightConfigMap=gl(t.skillWeightRules??[]),this.stageScoringWeightMap=ud(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=Od(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const r=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=r!=null?oe(r/100,0,1):de(hd,bd);const n=t.stage.finalPushStartPercent;this.finalPushStartRatio=n!=null?oe(n/100,this.lateStageStartRatio,1):oe(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const i=Tl(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(i.map(x=>[x.riderId,x])),i.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",i.map(N=>({riderId:N.riderId,type:N.type,severity:N.severity,kmMark:N.triggerDistanceKm,waitDurationSeconds:N.waitDurationSeconds,supportRiderIds:N.supportRiderIds})));const x=i.filter(N=>N.isMassCrashTrigger);x.length>0&&x.forEach(N=>{var H;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${N.riderId} bei Km ${N.triggerDistanceKm}. Potenziell betroffene Fahrer (${(H=N.massCrashPotentialRiderIds)==null?void 0:H.length}):`,N.massCrashPotentialRiderIds)})}const o=t.riders.map(x=>{const N={rider:x,riderName:`${x.firstName} ${x.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:Wd(),microForm:jr(),nextFormUpdateMeter:de(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(x.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(N),N}),c=new Map(o.map(x=>[x.rider.id,x.dailyForm]));this.stageFavorites=El(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:c});const l=this.stageFavorites.filter(x=>x.kind==="rider"&&x.riderId!=null).slice(0,15).map(x=>t.riders.find(N=>N.id===x.riderId)??null).filter(x=>x!=null),g=((B=t.gcStandings.find(x=>x.rank===1))==null?void 0:B.riderId)??null,m=sd(l,t.stage,t.stageSummary,x=>Math.max(1,Math.pow(10,(x.skills.attack-65)/10))*(x.id===g?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const x of m){const N=this.precalculatedStageAttacksByRiderId.get(x.riderId)??[];N.push(x),this.precalculatedStageAttacksByRiderId.set(x.riderId,N)}this.breakawayPlan=Ul(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings);const u=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=u.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=u.fallbackCheckpointsMeters;for(const x of o)x.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const p=Nl(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:c}),f=new Map(p.map(x=>[x.id,x])),y=o.map(x=>{const N=f.get(x.rider.id)??x.rider;return{...x,rider:N,riderName:`${N.firstName} ${N.lastName}`,dailyForm:x.dailyForm+(N.specialFormDelta??0)}}),b=p.filter(x=>x.hasSuperform),v=p.filter(x=>x.hasSupermalus);(b.length>0||v.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:b.map(x=>`${x.firstName} ${x.lastName}`),supermalus:v.map(x=>`${x.firstName} ${x.lastName}`)});const M=this.resolveStartOrder(y),w=new Map((this.bootstrap.teamStartOrder??[]).map((x,N)=>[x,N]));this.riders=M.map((x,N)=>({...x,startOffsetSeconds:this.resolveStartOffsetSeconds(x,N,w)})),this.riders.forEach(x=>this.syncRiderTelemetry(x));for(const x of this.riders){const N=x.rider.homeEffectSkills,H=I=>Bd[I]||I;if(x.rider.homeEffect==="super_home"){const I=N&&N.length===5?`${H(N[0])} (+3), ${H(N[1])} (+1), ${H(N[2])} (+1), ${H(N[3])} (+1), ${H(N[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${I})`})}if(x.rider.homeEffect==="home_pressure"){const I=N?N.map(H).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${I})`})}if(x.rider.homeEffect==="normal_home"){const I=N?N.map(H).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${I})`})}x.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),x.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),x.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const T=this.bootstrap.stage.rolledWetterName??"Sonnig",$=this.bootstrap.stage.rolledEffektSturz??0,R=this.bootstrap.stage.rolledEffektDefekt??0,E=this.bootstrap.stage.rolledWindkantenGefahr??0,D=this.bootstrap.stage.rolledEffektFatigue??0,F=this.bootstrap.stage.rolledBreakawayBonus??0,L=[];$>0&&L.push(`Sturzwahrscheinlichkeit +${$.toFixed(1)}%`),R>0&&L.push(`Defektwahrscheinlichkeit +${R.toFixed(1)}%`),E>0&&L.push(`Windkanten-Gefahr +${(E*100).toFixed(1)}%`),D>0&&L.push(`Fatigue +${D.toFixed(1)}%`),F>0&&L.push(`Ausreißer-Bonus +${F.toFixed(1)}`);const A=L.length>0?`Wettereinflüsse: ${L.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${T}`,detail:A})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const s=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(s),a-=s}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(s=>({riderId:s.rider.id,riderName:s.riderName,startOffsetSeconds:s.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(s),hasStarted:s.hasStarted||J(s),distanceCoveredMeters:s.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-s.distanceCoveredMeters),segmentStartKm:s.segmentStartKm,segmentEndKm:s.segmentEndKm,segmentStartElevation:s.segmentStartElevation,segmentEndElevation:s.segmentEndElevation,activeTerrain:ge(s)?"Finish":s.activeTerrain,skillName:ge(s)?"Finish":s.skillName,skillBreakdown:ge(s)?"":s.skillBreakdown,baseSkill:s.baseSkill,teamGroupBonus:s.teamGroupBonus,effectiveSkill:s.effectiveSkill,staminaPenalty:s.staminaPenalty,elevationPenalty:s.elevationPenalty,dailyForm:s.dailyForm,microForm:s.microForm,gradientPercent:s.gradientPercent,gradientModifier:s.gradientModifier,windModifier:s.windModifier,draftModifier:s.draftModifier,draftNearbyRiderCount:s.draftNearbyRiderCount,draftPackFactor:s.draftPackFactor,currentSpeedMps:s.currentSpeedMps,photoFinishScore:s.photoFinishScore,leadoutBonus:s.leadoutBonus,leadoutRiderId:s.leadoutRiderId,leadoutContributions:s.leadoutContributions,lastSplitLabel:s.lastSplitLabel,lastSplitTimeSeconds:s.lastSplitTimeSeconds,splitTimes:{...s.splitTimes},finishTimeSeconds:Number.isFinite(s.finishTimeSeconds??Number.NaN)?s.finishTimeSeconds:null,finishStatus:s.finishStatus,statusReason:s.statusReason,isAttacking:s.isAttacking,isBreakaway:s.isBreakaway,isLeadingGroup:s.isLeadingGroup,hasSuperform:s.rider.hasSuperform===!0,hasSupermalus:s.rider.hasSupermalus===!0,isFinished:ge(s)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(s=>s.appliedIncident?[s.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus}}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let s=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(s=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(s==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,c)=>Math.max(o,c.distanceCoveredMeters),0);s=Number((i/1e3).toFixed(2))}const r={id:this.nextMessageId,...t,riderTeamId:a,kmMark:s};this.messages.unshift(r),this.allEvents.push(r),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(s=>[s.rider.id,s]));return this.intermediateMarkers.map(s=>{const r=t.map(i=>i.markerCrossings[s.key]??null).filter(i=>i!=null),n=jd(r,!this.isTimeTrialMode,s.markerType,a,this.isClimberMalusStage());return{markerKey:s.key,markerLabel:s.label,markerType:s.markerType,markerCategory:s.markerCategory,kmMark:s.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isTimeTrialMode?[...this.riders].sort(fi):Vd(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(r=>r.finishStatus!=="dnf").reduce((r,n)=>Math.max(r,n.distanceCoveredMeters),0);let s=0;for(const r of t)ge(r)&&(s+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:s,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(J)}advanceSubstep(t){const a=this.elapsedSeconds,s=a+t,r=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();this.updateBreakawayPhaseState();for(const l of this.riders){if(J(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&s<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const g=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,s-g);if(m<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-m),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const u=this.currentSegment(l),p=this.currentWindZone(l);if(!u||!p){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=g,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const y=Bt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage()),b=this.calculateSprintLeadoutBonus(l);l.photoFinishScore+=y+b,l.leadoutBonus=b;continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,r);const f=this.calculateBasePhysics(l,u,p);l.activeTerrain=u.terrain,l.skillName=f.skillName,l.skillBreakdown=f.skillBreakdown,l.baseSkill=f.baseSkill,l.teamGroupBonus=f.teamGroupBonus,l.effectiveSkill=f.effectiveSkill,l.staminaPenalty=f.staminaPenalty,l.elevationPenalty=f.elevationPenalty,l.gradientPercent=f.gradientPercent,l.gradientModifier=f.gradientModifier,l.windModifier=f.windModifier,l.tempSpeedMps=f.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=f.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*m}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,s);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const g of this.riders)l.push(g);l.sort(Ud);for(let g=0;g<l.length;g+=1){const m=l[g];if(J(m))continue;const u=this.isActiveBreakawayRider(m),p=m.tempSpeedMps/14,f=Math.max(5,50*p),y=this.currentSegment(m),b=Math.max(15,150*p),v=Math.max(f,Math.min(b,Gd(y==null?void 0:y.terrain))),M=Zd(l,g,v),w=M.size,T=Vr(w),$=Jd(w,M.positionInGroup);let R=0,E=Number.POSITIVE_INFINITY,D=null;for(let te=g-1;te>=0;te-=1){const $e=l[te],le=$e.distanceCoveredMeters-m.distanceCoveredMeters;if(le>=v+yd)break;!this.canReceiveDraftFromCandidate(m,$e)||this.isActiveBreakawayRider($e)||le<=0||le>=v||(R+=1,le<=E&&(E=le,D=$e))}if(R===0||!D){if(u)continue;m.draftModifier=1,m.draftNearbyRiderCount=0,m.draftPackFactor=0,m.currentSpeedMps=m.tempSpeedMps,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,m.isLeadingGroup=!0,this.applyCaptainWaitLogic(m);continue}const F=J(D)?D.tempSpeedMps:D.currentSpeedMps,L=E,A=L<=f?1:1-(L-f)/Math.max(1e-4,v-f),_=this.currentWindZone(m),B=(_==null?void 0:_.vector)??0,x=(_==null?void 0:_.windSpeedKph)??0,N=-B*(x/70),I=Math.max(.3,.35+.35*N)*Math.min(1,p)*Gr,C=oe((y==null?void 0:y.gradient_percent)??0,-20,20),P=Or(C),Z=1+($?0:I*A*T*P),j=m.tempSpeedMps*Z;if(!(u&&Z<=m.draftModifier)){if(m.draftModifier=Z,m.draftNearbyRiderCount=w,m.draftPackFactor=T,m.isLeadingGroup=$,j>F){if(m.tempSpeedMps>D.tempSpeedMps){m.currentSpeedMps=j,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t;continue}if(L<1){m.currentSpeedMps=F,m.nextDistanceCoveredMeters=D.distanceCoveredMeters+F*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=Math.min(j,F+2),m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=j,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(J(l)||this.isTimeTrialMode&&s<=l.startOffsetSeconds)continue;const g=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,s-g);if(m<=0)continue;const u=l.distanceCoveredMeters,p=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*m,f=l.pendingIncident;if(f&&u<f.triggerDistanceMeters&&p>=f.triggerDistanceMeters){const v=Math.max(.1,l.currentSpeedMps),M=Math.max(0,(f.triggerDistanceMeters-u)/v);l.distanceCoveredMeters=f.triggerDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps),this.applyIncident(l,f,g+M),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const y=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,p-l.distanceCoveredMeters)>=y){const v=y/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps),l.finishTimeSeconds=g+v,l.currentSpeedMps=0;const M=Bt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage()),w=this.calculateSprintLeadoutBonus(l);l.photoFinishScore+=M+w,l.leadoutBonus=w}else l.distanceCoveredMeters=p,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,u,l.distanceCoveredMeters,g),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-m),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!J(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=jr(),l.nextFormUpdateMeter+=de(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),g=this.riders.filter(u=>l.has(u.rider.id)&&!J(u)),m=this.riders.filter(u=>!l.has(u.rider.id)&&!J(u));if(g.length>0&&m.length>0){const u=g.reduce((f,y)=>y.distanceCoveredMeters>f.distanceCoveredMeters?y:f,g[0]);m.reduce((f,y)=>y.distanceCoveredMeters>f.distanceCoveredMeters?y:f,m[0]).distanceCoveredMeters>=u.distanceCoveredMeters&&(u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:u.rider.id,riderName:u.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${u.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const c=nd(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of c.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!J(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const s=new Map;for(const r of this.riders){if(J(r)||r.rider.activeTeamId==null||a<=r.startOffsetSeconds)continue;const n=s.get(r.rider.activeTeamId)??[];n.push(r),s.set(r.rider.activeTeamId,n)}for(const r of s.values()){const n=r[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,r.length),c=[...r].sort((u,p)=>p.effectiveSkill-u.effectiveSkill||u.rider.id-p.rider.id).slice(0,o).reduce((u,p)=>u+p.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-r.length),g=Math.max(1,c-l),m=this.resolveTimeTrialSpeedMps(g,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*bl(i.terrain,this.bootstrap.skillWeightRules??[]);for(const u of r){const p=Math.max(t,u.startOffsetSeconds),f=Math.max(0,a-p);u.currentSpeedMps=m,u.tempSpeedMps=m,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+m*f}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const r=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?r.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,c=i.rider.activeTeamId!=null?r.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==c?o-c:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(r=>[r.riderId,r.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((r,n)=>{const i=a.get(r.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(r)-this.resolveProjectedIttStartScore(n)||r.rider.id-n.rider.id}):[...t].sort((r,n)=>r.rider.skills.timeTrial-n.rider.skills.timeTrial||r.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,s=0;for(const r of this.bootstrap.stageSummary.segments){const n=(r.start_km+r.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,r.terrain),c=i>0?this.resolveWeightedSkill(t.rider,r.terrain,i):o,l=Math.max(0,o.value-c.value),{effectiveSkill:g}=this.resolveEffectiveSkill({rider:t,baseSkill:c.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),m=oe(r.gradient_percent,-20,20),u=m>0?Math.exp(-.11*m):1-m*.06,p=this.windZones.find(y=>n>=y.startMeter&&n<=y.endMeter)??this.windZones[this.windZones.length-1],f=p?1+p.vector*(p.windSpeedKph/100)*.52:1;a+=g*u*f*r.length_km,s+=r.length_km}return s>0?a/s:0}resolveStartOffsetSeconds(t,a,s){if(this.isIndividualTimeTrial)return a*md;if(this.isTeamTimeTrial){const r=t.rider.activeTeamId;return(r!=null?s.get(r)??0:0)*pd}return 0}buildIntermediateMarkers(){return Ve(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||lt(t)).map(({key:t,label:a,marker:s,kmMark:r})=>({key:t,distanceMeters:r*1e3,label:a,markerType:s.type,markerCategory:s.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(c=>c.distanceMeters<t.groupPhaseEndDistanceMeters),s=this.stageDistanceMeters*Nd,r=a.some(c=>c.distanceMeters<=s);if(!(a.length<=1||!r))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(ma,Math.ceil(s/ma)*ma);for(let c=o;c<t.groupPhaseEndDistanceMeters;c+=ma)i.push(c);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,s){const r=Hd(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,c=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),g=Math.min(85,o.value)+l,m=this.isTimeTrialMode?0:t.teamGroupBonus,u=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:p,staminaPenalty:f,elevationPenalty:y}=this.resolveEffectiveSkill({rider:t,baseSkill:g,staminaPenalty:c,teamGroupBonus:m,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:u}),b=oe(a.gradient_percent,-20,20),v=b>0?Math.exp(-.11*b):1-b*.06,M=1+s.vector*(s.windSpeedKph/100)*.52,w=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:r,skillBreakdown:o.breakdown,baseSkill:g,teamGroupBonus:m,effectiveSkill:p,staminaPenalty:f,elevationPenalty:y,gradientPercent:b,gradientModifier:v,windModifier:M,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(p,t.distanceCoveredMeters,a,v,M):this.resolveRoadStageSpeedMps(p,t.distanceCoveredMeters,a,v,M,w)}}resolveRoadStageSpeedMps(t,a,s,r,n,i){const o=this.resolveSkillSpreadFactor(a,s),c=this.resolveSegmentElevation(s,a),l=this.resolveElevationSkillSpreadFactor(s,c),u=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,u*r*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const s=Math.max(0,a-kd),r=Math.floor(s/$d);return t.terrain==="Mountain"?1+(r*Md+r*Math.max(0,r-1)*xd/2):1+r*Td}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const s=a.filter(n=>n.activeTerrain===t.activeTerrain);return(s.length>0?s:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,s){if(s<=1)return{draftModifier:1,draftPackFactor:0};const r=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,c=-i*(o/70),g=Math.max(.3,.35+.35*c)*Math.min(1,r)*Gr,m=oe(a.gradient_percent,-20,20),u=Or(m),p=Vr(s);return{draftModifier:1+g*p*u,draftPackFactor:p}}resolveBreakawayTimeGapPenalty(t){if(t<Kr)return 0;const a=Math.floor((t-Kr)/Fd);return Cd+a}recordBreakawayFallbackCheckpointCrossings(t,a,s,r,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>s)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const c=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?r+c-t.startOffsetSeconds:r+c);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let r=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((c,l)=>l.distanceCoveredMeters-c.distanceCoveredMeters||l.currentSpeedMps-c.currentSpeedMps||c.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,r;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const c=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!c)break;const l=n.markerCrossings[c.key]??null;if(!l)break;const g=t.map(m=>m.markerCrossings[c.key]??null).filter(m=>m!=null).sort((m,u)=>m.crossingTimeSeconds-u.crossingTimeSeconds||m.riderId-u.riderId)[0]??null;if(g){const m=l.crossingTimeSeconds-g.crossingTimeSeconds;r=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:r,kmMark:c.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const c=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[c]??null;if(l==null)break;const g=t.map(m=>m.breakawayFallbackCheckpointTimes[c]??null).filter(m=>m!=null).sort((m,u)=>m-u)[0]??null;if(g!=null){const m=l-g;r=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:r,kmMark:c<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[c]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return r}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),s=this.riders.filter(o=>!J(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),r=this.riders.filter(o=>!J(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(s.length===0||r.length===0){this.breakawayGapStatus=null;return}const n=[...s].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null,i=[...r].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const c=this.intermediateMarkers[o];if(!c)continue;const l=n.markerCrossings[c.key]??null,g=i.markerCrossings[c.key]??null;if(!l||!g)continue;const m=g.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:c.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const c=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(c==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,g=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||g==null)continue;const m=g-l;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:c/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const s=new Set(a.riderIds),r=this.riders.filter(o=>!J(o)&&s.has(o.rider.id));if(r.length===0)return;const n=this.riders.filter(o=>!J(o)&&!s.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(r,n);for(const o of r)o.breakawayGapPenalty=i;for(const o of r){const c=this.currentSegment(o);if(!c)continue;const g=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=g,o.tempSpeedMps=this.resolveRoadStageSpeedMps(g,o.distanceCoveredMeters,c,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(c.terrain));const m=this.resolveMaxBreakawayDraftModifier(o,c,r.length);o.draftModifier=m.draftModifier,o.draftNearbyRiderCount=Math.max(0,r.length-1),o.draftPackFactor=m.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*m.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,s,r,n){return this.resolveRoadStageSpeedMps(t,a,s,r,n,.5)}syncRiderTelemetry(t,a=null){var i;const s=this.currentSegment(t),r=this.currentWindZone(t);if(J(t)||!s||!r){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,s,r);t.segmentStartKm=s.start_km,t.segmentEndKm=s.end_km,t.segmentStartElevation=s.start_elevation,t.segmentEndElevation=s.end_elevation,t.activeTerrain=s.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),s=this.riders.reduce((n,i)=>J(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(s<=t.phaseEndDistanceMeters)return!1;let r=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(s<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<Ad){n.breakawayMalus=0,r=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),c=Math.floor(o/Pd),l=Math.min(Dd,n.breakawayInitialMalus),g=Math.max(l,n.breakawayInitialMalus-c*Ld),m=It(g);m!==n.breakawayMalus&&(n.breakawayMalus=m,r=!0)}return r}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const s=new Set(a.riderIds);for(const r of this.riders)J(r)||!s.has(r.rider.id)||this.syncRiderTelemetry(r,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(r=>t.riderIds.includes(r.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const r of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:r.rider.id,riderName:r.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(r.rider.id,r.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let s=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const r of a)r.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),s=!0}if(this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const r of a)r.breakawayMalus=t.malusValue,r.breakawayInitialMalus=t.malusValue,r.breakawayRecoveryStartDistanceMeters=null,r.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return s}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const s=this.riders.filter(o=>!J(o)&&a.riderIds.includes(o.rider.id));if(s.length===0)return;const r=[...s].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0];if(!r)return;const n=Math.max(.1,r.currentSpeedMps),i=r.distanceCoveredMeters+n*t;for(const o of s){if(Math.max(0,r.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?ql:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const s=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(s==null||s.isCounterAttack)return!0;const r=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(r==null?void 0:r.isCounterAttack)===!0&&r.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(s=>s.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const s=this.resolvePreStageGcRank(t);return s!=null?`${a} (${s}.)`:a}triggerStageAttacksForRider(t,a,s,r){if(J(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||s<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(s/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const c=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/c),g=r+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:g,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const m=new Set(this.activeStageAttacksByRiderId.keys()),u=this.stageFavorites.slice(0,20).filter(y=>{if(y.kind!=="rider"||y.riderId==null)return!1;const b=this.riders.find(M=>M.rider.id===y.riderId);if(!b||J(b))return!1;const v=t.distanceCoveredMeters-b.distanceCoveredMeters;return v>=0&&v<=150}),p=rd(u,t.rider.id,m),f=[];for(const y of p){const b=this.riders.find(v=>v.rider.id===y);!b||J(b)||this.activeStageAttacksByRiderId.has(y)||(this.activeStageAttacksByRiderId.set(y,{riderId:y,remainingSeconds:Br,startedAtElapsedSeconds:g,triggerDistanceMeters:b.distanceCoveredMeters,durationSeconds:Br,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),b.isAttacking=!0,f.push({riderId:y,riderName:this.formatRiderWithPreStageGc(y,b.riderName),riderTeamId:b.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:g,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const y of f)this.pushMessage({elapsedSeconds:g,riderId:y.riderId,riderName:y.riderName,type:"counter_attack",tone:"warning",title:`${y.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const s of t){if(s.finishStatus==="dnf")continue;const r=a[a.length-1];if(!r||Math.abs(r.distanceMeter-s.distanceCoveredMeters)>=ca){a.push({riderIds:[s.rider.id],riderCount:1,distanceMeter:s.distanceCoveredMeters,distanceSum:s.distanceCoveredMeters});continue}r.riderIds.push(s.rider.id),r.riderCount+=1,r.distanceSum+=s.distanceCoveredMeters,r.distanceMeter=r.distanceSum/r.riderCount}return a.map(({distanceSum:s,...r})=>r)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!J(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),s=new Map;let r=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],c=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-c<ca;){const m=a[n].rider.activeTeamId;m!=null&&s.set(m,(s.get(m)??0)+1),n+=1}for(;r<a.length&&c-a[r].distanceCoveredMeters>=ca;){const m=a[r].rider.activeTeamId;if(m!=null){const u=(s.get(m)??0)-1;u<=0?s.delete(m):s.set(m,u)}r+=1}const l=o.rider.activeTeamId,g=l==null?0:Math.max(0,(s.get(l)??0)-1);t.set(o.rider.id,g===0?0:It(g*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?Sd:0,s=this.resolveBreakawaySkillBonus(t.rider),r=t.baseSkill+Ba(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+s+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,r),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const s=oe(this.stageDistanceMeters/1e3,Id,Ed),r=this.interpolateStaminaDistanceValue(s),n=oe(t,zr,os),i=(os-n)/(os-zr),o=r/3+i*r,c=this.stageDistanceMeters<=0?0:oe(a/this.stageDistanceMeters,0,1);return o*c**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=ut[0].kmMark)return ut[0].value;for(let a=0;a<ut.length-1;a+=1){const s=ut[a],r=ut[a+1];if(t<=r.kmMark){const n=Math.max(1e-4,r.kmMark-s.kmMark),i=(t-s.kmMark)/n;return s.value+(r.value-s.value)*i}}return ut[ut.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/is),s=Math.max(1,Math.ceil(t/is)),r=de(gd,fd),n=Array.from({length:s},()=>de(.2,1.2)),i=n.reduce((l,g)=>l+g,0),o=Array.from({length:a+1},()=>1);o[0]=r;let c=0;for(let l=1;l<=s;l+=1)c+=n[l-1]??0,o[l]=r+(1-r)*(c/i);return o}resolveSkillSpreadFactor(t,a){const s=this.stageDistanceMeters<=0?1:oe(t/this.stageDistanceMeters,0,1),r=Math.min(this.spreadCurve.length-1,Math.floor(s/is)),n=this.spreadCurve[r]??1;if(s<=this.lateStageStartRatio)return n;const i=yl(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),c=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=oe((s-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),g=this.interpolateFinalSpread(o,l);if(o<=1&&c<=1)return n;if(s<this.finalPushStartRatio||c<=o)return Math.max(n,g);const m=oe((s-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),u=o+(c-o)*m;return Math.max(n,u)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const s=qn(this.simulationMode,t,this.skillWeightRuleMap).map(r=>({key:r.key,weight:r.weight}));return this.weightedSkillComponentsByTerrain.set(t,s),s}resolveWeightedSkill(t,a,s=0){const r=this.resolveWeightedSkillComponents(a),n=s>0||t.mentorBoosts?{...t.skills}:t.skills;if(s>0&&(n.stamina=Math.max(0,n.stamina-s)),t.mentorBoosts)for(const[l,g]of Object.entries(t.mentorBoosts))typeof g=="number"&&(n[l]+=g);let i=0,o=0;for(const l of r)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:hl(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,r)}}resolveSkillBreakdown(t,a,s){const r=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(r);if(n!==void 0)return n;const i=zd(t,s);return this.skillBreakdownCache.set(r,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const s=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,r=Math.max(0,100-s)/1e3,n=this.resolveElevationBucket(a);return r*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const s=a??this.interpolateElevation(t.distanceCoveredMeters),r=this.resolveElevationBucket(s);return r===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=r,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,s)),t.elevationPenalty}resolveSegmentElevation(t,a){const s=t.start_km*1e3,r=t.end_km*1e3,n=Math.max(1e-4,r-s),i=oe((a-s)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const r=oe(t,0,this.stageDistanceMeters)/1e3;if(r<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(r<=o.kmMark){const c=Math.max(1e-4,o.kmMark-i.kmMark),l=(r-i.kmMark)/c;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),ls(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var m;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(ge).sort((u,p)=>(u.finishTimeSeconds??0)-(p.finishTimeSeconds??0)||p.photoFinishScore-u.photoFinishScore||u.rider.id-p.rider.id);if(t.length===0)return;const a=[];let s=null;for(const u of t){const p=u.finishTimeSeconds??0;if(a.length===0){a.push(u),s=p;continue}if(s!=null&&p-s<=Aa){a.push(u),s=p;continue}break}const r=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=u=>u.photoFinishScore,o=[...a].sort((u,p)=>i(p)-i(u)||u.rider.id-p.rider.id),c=((m=o[0])==null?void 0:m.finishTimeSeconds)??0,l=this.finishWeightProfile,g=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${g} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${Aa.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${r}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((u,p)=>{const f=Yd(u,l).map($=>`${gi[$.skillKey]} ${$.contribution.toFixed(2)} = ${$.effectiveSkill.toFixed(2)} x ${($.weight*100).toFixed(0)}%`).join(" | "),y=u.finishTimeSeconds??0,b=y-c,v=b<=1e-4?`${y.toFixed(2)} s`:`${y.toFixed(2)} s (+${b.toFixed(2)} s)`,M=this.calculatePhotoFinishScore(u),w=u.leadoutBonus??0,T=Bt(u,r,n);console.log(`#${p+1} Zielsprint | ${u.riderName} | Zeit ${v} | Score (ohne Boni): ${M.toFixed(2)} -> Score (mit Boni): ${u.photoFinishScore.toFixed(2)} [SpecAdj: ${T>0?"+":""}${T.toFixed(2)}, Leadout: +${w.toFixed(2)}] | ID-Tiebreak ${u.rider.id} | (${f})`)}),console.groupEnd()}recordIntermediateSplits(t,a,s,r,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>s)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,c=Math.max(0,this.isTimeTrialMode?r+o-t.startOffsetSeconds:r+o);let l=this.resolveMarkerCrossingScore(t,i);const g=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;g&&(l+=Bt(t,g,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=c,t.splitTimes[i.key]=c,t.splitTimes[i.label]=c,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:c,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return ls(t,this.resolveSprintWeightProfile());const s=ls(t,this.resolveClimbWeightProfile(a.markerCategory)),r=_d(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return s+r}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??id}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??cd[a]}calculatePreLeadoutFinishScore(t){const s=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,r=Ba(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[c,l])=>{if(!l)return o;const g=c==="stamina"?s:0,m=Math.max(0,t.rider.skills[c]+r+t.dailyForm+t.microForm+t.teamGroupBonus-g);return o+m*l},0),i=Bt(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}calculateSprintLeadoutBonus(t){const a=this.resolveFinishMarkerType();if(a!=="finish_flat"&&a!=="finish_hill"||t.rider.skills.sprint<74)return 0;const s=t.rider.activeTeamId;if(s==null)return 0;const r=this.riders.filter(p=>p.rider.activeTeamId===s);if(r.length===0)return 0;const n=r.filter(p=>p.finishStatus!=="dnf"&&p.finishStatus!=="otl"&&p.finishStatus!=="dns"&&p.rider.skills.sprint>=74);if(n.length===0)return 0;let i=this.teamBestSprinterRiderId.get(s);if(i===void 0){let p=null,f=Number.NEGATIVE_INFINITY;for(const y of n){const b=this.calculatePreLeadoutFinishScore(y);b>f?(f=b,p=y):b===f&&p!==null&&(y.rider.skills.sprint>p.rider.skills.sprint||y.rider.skills.sprint===p.rider.skills.sprint&&y.rider.id<p.rider.id)&&(p=y)}p?(i=p.rider.id,this.teamBestSprinterRiderId.set(s,i)):i=-1}if(i!==t.rider.id)return 0;let o=this.teamSprintRandomValues.get(s);o===void 0&&(o=de(.25,.6),this.teamSprintRandomValues.set(s,o));let c=this.teamSprintSpecialRandomValues.get(s);c===void 0&&(c=de(.1,.3),this.teamSprintSpecialRandomValues.set(s,c)),t.leadoutRiderId=null;let l=0,g=0,m=null;const u=[];for(const p of r){if(p.rider.id===t.rider.id||p.finishStatus==="dnf"||p.finishStatus==="otl"||p.finishStatus==="dns")continue;let f=0;const y=p.rider.skills.sprint>=72,b=p.rider.skills.flat>=78,v=p.rider.skills.timeTrial>=76,M=p.rider.skills.acceleration>=80;if(y&&f++,b&&f++,v&&f++,M&&f++,f>0){const w=y?o:c;let T=1;f===2?T=1.25:f===3?T=1.5:f===4&&(T=2);const $=w*T*1.5;if(l+=w*T,u.push({riderId:p.rider.id,name:p.riderName,contribution:Number($.toFixed(2))}),w*T>g)g=w*T,m=p.rider.id;else if(w*T===g&&m!==null){const R=this.riders.find(E=>E.rider.id===m);R&&p.rider.skills.sprint>R.rider.skills.sprint&&(m=p.rider.id)}}}return l>0&&(t.leadoutRiderId=m,t.leadoutContributions=u),l*1.5}resolveFinishMarkerType(){const t=Ve(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const s=t[a].marker.type;if(s==="finish_flat"||s==="finish_hill"||s==="finish_mountain")return s}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return ld;case"finish_mountain":return dd;default:return od}}resolveRiderClockSeconds(t){if(ge(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,s,r=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(c=>c.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){r=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const c=this.riders.find(g=>g.rider.id===o);if(!c||J(c))continue;if(Math.abs(c.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const g=Ml(c.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(c,g,s,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:s,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:r?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:s,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:r?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:s,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(s=>s.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+ca){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const qd=300;async function Xd(e,t){const a=new hi(e,{maxSubstepSeconds:5});let s=!1;for(;!s;){const r=a.step(qd);if(s=r.isFinished,t){const n=r.stageDistanceMeters>0?r.leaderDistanceMeters/r.stageDistanceMeters:0,i=e.riders.length>0?r.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const Qd=[1,2,5,10,25,50,100,250,500],Ur=new WeakMap;function ec(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function Yr(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function tc(e){const t=Ur.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${Qd.map(s=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return Ur.set(e,a),a}function Zr(e,t){const a=tc(e);a.timeField&&(a.timeField.textContent=ec(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${Yr(t.snapshot.leaderDistanceMeters)} / ${Yr(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(s=>{const r=Number(s.dataset.raceSimSpeed);s.classList.toggle("active",r===t.timeMultiplier)})}const ac=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function sc(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),s=t%60;return`${a}:${String(s).padStart(2,"0")}`}function Lt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function rc(e){return`/jersey/Jer_${e}.png`}function bi(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${Lt(rc(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function nc(e){return e.riderId==null||e.riderTeamId==null?"":bi(e.riderTeamId)}function ic(e){const t=Lt(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function oc(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${Lt(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${Lt(e)}</button>`}function lc(e,t){if(t==="all")return!0;const a=yi(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function dc(e){const t=e.detail?Lt(e.detail):"",a=(e.secondaryRiders??[]).map(r=>`${r.riderTeamId!=null?bi(r.riderTeamId,"race-sim-message-inline-jersey"):""}${oc(r.riderName,r.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const s=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${s}</span>`}function yi(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function Jr(e,t,a="all"){const s=t.filter(n=>lc(n,a)),r=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${ac.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${s.length===0?`<div class="race-sim-message-empty">${r}</div>`:s.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${Lt(yi(n))}">
          <span class="race-sim-message-time">t=${sc(n.elapsedSeconds)}</span>
          ${nc(n)}
          <span class="race-sim-message-text">
            ${ic(n)}
            ${dc(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const cc=1,uc={Flat:12,Rolling:14,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:23,High_Mountain:25,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function mc(e){return Math.max(0,Math.round(e))}function vi(e){return e==="ITT"||e==="TTT"}function pc(e){return uc[e]??20}function gc(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+pc(e)/100))}function fc(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function qr(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function ds(e,t){if(vi(t))return[...e].sort(fc);const a=[...e].sort((o,c)=>o.stageTimeSeconds-c.stageTimeSeconds||qr(o,c)),s=[];let r=[],n=null;const i=()=>{s.push(...r.sort(qr))};for(const o of a){if(r.length===0){r=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=cc){r.push(o),n=o.stageTimeSeconds;continue}i(),r=[o],n=o.stageTimeSeconds}return r.length>0&&i(),s}function Y(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function hc(e){return`/jersey/Jer_${e}.png`}function ea(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${Y(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${Y(hc(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function ta(e,t,a){return e==null?`<span class="${a}" title="${Y(t)}">${Y(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${Y(t)}">${Y(t)}</button>`}function bc(e){return e.toFixed(1).replace(".",",")}function _a(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function yc(e){return`${e??0} Pkt.`}function vc(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function Sc(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function Si(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function kc(e){if(e==null||e<=0)return Si(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function st(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function ga(e){return`${e.toFixed(1).replace(".",",")} km`}function Xr(e){return`${e.toFixed(1).replace(".",",")}%`}function fa(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function Qr(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function $c(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function Tc(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function Mc(e,t,a){return Array.from({length:t},(s,r)=>e.slice(r*a,(r+1)*a))}function xc(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const s=Mc(e,4,5),r=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${s.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=Tc(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${ea(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${ta(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${Y(i.roleLabel)}">${Y(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?r.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${Y(_a(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${bc(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function Zt(e,t){const a=e.riders.find(s=>s.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function Ja(e,t){const a=e.riders.find(n=>n.id===t),s=(a==null?void 0:a.activeTeamId)??null,r=s!=null?e.teams.find(n=>n.id===s)??null:null;return{teamId:s,teamName:(r==null?void 0:r.name)??null}}function wc(e,t,a,s={}){const r=(t??[]).slice(0,s.limit??8);return r.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${r.map(n=>{var m;const i=n.riderId??0,o=Ja(e,i),c=Zt(e,i),l=((m=s.distanceGapsByRiderId)==null?void 0:m.get(i))??null,g=[s.distanceGapClassName??"",Sc(l)].filter(u=>u.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${ea(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${ta(n.riderId,c,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${s.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${g}">${Y(vc(l))}</span>`:""}
      </article>`}).join("")}</div>`}function ha(e,t,a,s,r,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${Y(e)}</h4>
      ${wc(a,s,r,n)}
    </section>`}function Tt(e,t,a,s,r=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${s}" ${r?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${s}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${Y(e)}</span>
      </summary>
      ${t}
    </details>`}function Ga(e,t,a,s){const r=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var c;const i=r.get(n.id)??null,o=((c=a.get(n.id))==null?void 0:c[s])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||Zt(e,n.riderId).localeCompare(Zt(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function en(e){const t=Rc(e)?e.stagePoints:0;return`${Y(yc("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${Y(t)}</span></span>`:""}`}function Rc(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function tn(e,t){if(t==null)return new Map;const a=e.riders.find(s=>s.riderId===t)??null;return a?new Map(e.riders.map(s=>[s.riderId,a.distanceCoveredMeters-s.distanceCoveredMeters])):new Map}function Ic(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function Ra(e,t){var s;const a=(s=e.race.category)==null?void 0:s.bonusSystem;return!a||t==null||t==="Sprint"?[]:st(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function Ws(e){var s;const t=(s=e.race.category)==null?void 0:s.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return st(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return st(a?t.pointsMountainStage:t.pointsSprintFinish)}function ki(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:st((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function Ec(e,t,a){let s=null;for(const r of e.stageSummary.segments){const n=Math.max(t,r.start_km),i=Math.min(a,r.end_km),o=Math.max(0,i-n);if(o<=0)continue;const c={lengthKm:o,gradient:r.gradient_percent};(s==null||c.gradient>s.gradient||c.gradient===s.gradient&&c.lengthKm>s.lengthKm)&&(s=c)}return s}function cs(e,t,a,s=null){return e.entries.filter(r=>s==null||s.has(r.riderId)).map((r,n)=>({riderId:r.riderId,rank:r.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:r.crossingTimeSeconds,gapSeconds:r.gapSeconds})).filter(r=>r.points>0)}function Os(e){const t=new Map;for(const a of e)for(const s of a.entries){const r=t.get(s.riderId)??{points:0,mountain:0};s.pointsKind==="mountain"?r.mountain+=s.points:r.points+=s.points,t.set(s.riderId,r)}return t}function Fc(e){return Ve(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function Ha(e,t){const a=vi(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?mc(a):null}function qa(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=Ha(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const s=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(s)||s<=0)return ds(a,e.stage.profile).map(n=>n.rider);const r=gc(e.stage.profile,a.map(n=>n.stageTimeSeconds));return r==null?ds(a,e.stage.profile).map(n=>n.rider):ds(a.filter(n=>n.stageTimeSeconds<=r),e.stage.profile).map(n=>n.rider)}function Cc(e,t){const a=Ws(e);return a.length===0?[]:qa(e,t).map((s,r)=>({riderId:s.riderId,rank:r+1,points:a[r]??0,pointsKind:"points",crossingTimeSeconds:Ha(e,s),gapSeconds:null})).filter(s=>s.points>0)}function Nc(e,t){const a=qa(e,t).slice(0,20),s=a[0]!=null?Ha(e,a[0])??0:0;return a.map((r,n)=>{const i=Ha(e,r)??0;return{riderId:r.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-s),photoFinishScore:r.photoFinishScore}})}function Pc(e,t){var a;return((a=qa(e,t)[0])==null?void 0:a.riderId)??null}function js(e,t,a){var w,T;const s=Ve(e.stageSummary),r=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(qa(e,a).map($=>$.riderId)):null,i=s.filter(({marker:$})=>$.type==="climb_start"),o=s.filter(({marker:$})=>lt($)).sort(($,R)=>$.kmMark-R.kmMark).map(($,R)=>{var C,P;const E=[...i].reverse().find(z=>z.kmMark<=$.kmMark)??null,D=Ic(e,$.kmMark),F=(E==null?void 0:E.kmMark)??(D==null?void 0:D.start_km)??$.kmMark,L=(E==null?void 0:E.elevation)??(D==null?void 0:D.start_elevation)??$.elevation,A=Math.max(0,$.kmMark-F),_=A>0?($.elevation-L)/(A*1e3)*100:(D==null?void 0:D.gradient_percent)??0,B=Ec(e,F,$.kmMark),x=t.find(z=>z.markerKey===$.key)??null,N=Ra(e,(x==null?void 0:x.markerCategory)??$.marker.cat??null),H=x?cs(x,N,"mountain",n):[],I=(x==null?void 0:x.markerCategory)??$.marker.cat??null;return{key:$.key,title:`${R+1}. Bergwertung`,label:$.label,categoryLabel:I?`Kat. ${I}`:null,categoryClassName:Qr(I),kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:A,averageGradient:_,steepestSegmentLengthKm:(B==null?void 0:B.lengthKm)??null,steepestSegmentGradient:(B==null?void 0:B.gradient)??null,highlightMeta:$.kmMark>=r,leaderRiderId:((C=H[0])==null?void 0:C.riderId)??((P=x==null?void 0:x.entries[0])==null?void 0:P.riderId)??null,displayBadges:fa(N,"mountain"),entries:H,timingEntries:(x==null?void 0:x.entries)??[],accent:"mountain"}}),c=s.filter(({marker:$})=>$.type==="sprint_intermediate").sort(($,R)=>$.kmMark-R.kmMark).map(($,R)=>{var L,A;const E=t.find(_=>_.markerKey===$.key)??null,D=ki(e),F=E?cs(E,D,"points",n):[];return{key:$.key,title:`${R+1}. Zwischensprint`,label:$.label,categoryLabel:null,categoryClassName:null,kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((L=F[0])==null?void 0:L.riderId)??((A=E==null?void 0:E.entries[0])==null?void 0:A.riderId)??null,displayBadges:fa(D,"points"),entries:F,timingEntries:(E==null?void 0:E.entries)??[],accent:"sprint"}}),l=Fc(e),g=Cc(e,a),m=l?t.find($=>$.markerKey===l.key)??null:null,u=m?cs(m,Ra(e,m.markerCategory),"mountain",n):[],p=Ws(e),f=m?Ra(e,m.markerCategory):[],y=e.stage.profile==="ITT"||e.stage.profile==="TTT"?Nc(e,a):(m==null?void 0:m.entries)??[],b=((w=g[0])==null?void 0:w.riderId)??((T=u[0])==null?void 0:T.riderId)??Pc(e,a),v={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:m!=null&&m.markerCategory?`Kat. ${m.markerCategory}`:null,categoryClassName:Qr((m==null?void 0:m.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(m!=null&&m.markerCategory),leaderRiderId:b,displayBadges:[...fa(p,"points"),...fa(f,"mountain")],entries:[...g,...u],timingEntries:y,accent:"finish"};return[...[...c,...o].sort(($,R)=>$.kmMark-R.kmMark||$.title.localeCompare(R.title,"de")),v].filter($=>$.entries.length>0||$.timingEntries.length>0||$.accent!=="finish"||l!=null||a.isFinished)}function Lc(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),s=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,r=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,s):t.entries.slice(0,s).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return r.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${r.map(n=>{const i=Ja(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${ea(i.teamId,i.teamName)}
            ${ta(n.riderId,Zt(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?Y(Si(n.crossingTimeSeconds)):Y(kc(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function an(e,t){var a;return((a=e==null?void 0:e.find(s=>s.riderId===t))==null?void 0:a.points)??0}function sn(e,t){var a;return((a=e.filter(s=>s.riderId!=null&&t.has(s.riderId)).sort((s,r)=>s.rank-r.rank||s.riderId-r.riderId)[0])==null?void 0:a.riderId)??null}function ba(e,t,a){if(!(!t||e.some(s=>s.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function Dc(e,t,a,s,r){const n=new Set(e.riderIds),i=new Map(t.riders.map(p=>[p.riderId,p])),c=e.riderIds.map(p=>i.get(p)??null).filter(p=>p!=null).sort((p,f)=>{var y,b;return(((y=a.get(p.riderId))==null?void 0:y.rank)??Number.MAX_SAFE_INTEGER)-(((b=a.get(f.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)||p.riderName.localeCompare(f.riderName,"de")||p.riderId-f.riderId}).slice(0,25),l=i.get(sn(s,n)??-1)??null,g=i.get(sn(r,n)??-1)??null,m=l!=null&&!c.some(p=>p.riderId===l.riderId),u=g!=null&&!c.some(p=>p.riderId===g.riderId);return c.length>=25&&m&&u&&l.riderId!==g.riderId?(ba(c,l,23),ba(c,g,24),c):(ba(c,l,24),ba(c,g,24),c)}function Ac(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function Bc(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function rn(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function _c(e,t){const a=t.riders.filter(r=>e.riderIds.includes(r.riderId)).reduce((r,n)=>Math.max(r,n.distanceCoveredMeters),0),s=Math.max(0,t.leaderDistanceMeters-a);return s>0?`-${Math.round(s)} m`:"—"}function Gc(e,t,a,s,r,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=al(a,s),c=a.find(u=>u.label===o)??a[0],l=new Map(e.gcStandings.map(u=>[u.riderId,u])),g=Os(i),m=Dc(c,t,l,r,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${Y(c.label)} <span class="race-sim-group-count">(${c.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${Y(rn(c.previousGapMeters,"-"))}</span>
        <span>Leader ${Y(_c(c,t))}</span>
        <span>Hinten ${Y(rn(c.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${m.map((u,p)=>{const f=l.get(u.riderId)??null,y=Ja(e,u.riderId),b=g.get(u.riderId)??{points:0,mountain:0},v=an(r,u.riderId),M=an(n,u.riderId),w=Ac(u.riderId,e.classificationLeaders),T=w.length>0?w.map($=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[$]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${Bc(w)}" title="${Y(T)}">${p+1}.</strong>
              ${ea(y.teamId,y.teamName)}
              <span class="race-sim-classification-main">
                ${ta(u.riderId,u.riderName,`race-sim-group-rider-name${u.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${f?f.rank:"—"} · ${Y(f?_a(f.gapSeconds):"—")} · ${Y(u.gapToLeaderMeters>0?`+${Math.round(u.gapToLeaderMeters)} m`:"—")}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${v}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${M}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${b.points>0?`▲ +${b.points}`:" "}</span>
                  <span class="race-sim-breakaway-stage-gain">${b.mountain>0?`▲ +${b.mountain}`:" "}</span>
                </span>
              </span>
            </article>`}).join("")}
      </div>
    </section>`}function Hc(e,t,a,s){const r=js(t,a.markerClassifications,a),n=Os(r),i=Ga(t,t.pointsStandings,n,"points"),o=Ga(t,t.mountainStandings,n,"mountain"),c=zs(Hs(a.clusters));e.innerHTML=Gc(t,a,c,s,i,o,r)}function zc(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function Kc(e){const t=Ve(e.stageSummary),a=ki(e)[0]??0,s=Ws(e)[0]??0,r=t.filter(({marker:n})=>lt(n)).reduce((n,{marker:i})=>n+(Ra(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+s,mountain:r}}function nn(e){const t=Kc(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function Wc(e){const t=$c(e),a=[`<span class="race-sim-stage-points-meta-pill">${Y(ga(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${Y(`${ga(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${Y(`Länge ${ga(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${Y(`Ø ${Xr(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${Y(`Steilstes ${ga(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${Y(Xr(e.steepestSegmentGradient))}</span>`:""].filter(s=>s.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${Y(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${Y(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${Y(e.label)}">${Y(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((s,r)=>`${r>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${s}`).join("")}
    </span>`}function Oc(e,t,a,s=null){const r=s??js(e,t,a);return r.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${nn(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${nn(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${r.map(n=>{const i=n.leaderRiderId!=null?Ja(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?Zt(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${Wc(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${zc(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${ea(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?ta(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${Y(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${Lc(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function jc(e,t,a,s,r,n=new Set){var p,f;const i=js(a,s,r),o=Os(i),c=Ga(a,a.pointsStandings,o,"points"),l=Ga(a,a.mountainStandings,o,"mountain"),g=tn(r,((p=a.gcStandings[0])==null?void 0:p.riderId)??null),m=tn(r,((f=a.youthStandings[0])==null?void 0:f.riderId)??null),u=y=>!n.has(y);e.innerHTML=`
    ${Tt("Stage Favorites",xc(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",u("favorites"))}
    <section class="race-sim-classifications-section">
      ${Tt("GC",ha("GC","gc",a,a.gcStandings,y=>Y(`GC ${y.rank} · ${_a(y.gapSeconds)}`),{limit:20,distanceGapsByRiderId:g}),"race-sim-overview-classification race-sim-overview-gc","gc",u("gc"))}
      ${Tt("Punktewertung",ha("Punktewertung","points",a,c,en),"race-sim-overview-classification race-sim-overview-points","points",u("points"))}
      ${Tt("Bergwertung",ha("Bergwertung","mountain",a,l,en),"race-sim-overview-classification race-sim-overview-mountain","mountain",u("mountain"))}
      ${Tt("Nachwuchsfahrerwertung",ha("Nachwuchsfahrerwertung","youth",a,a.youthStandings,y=>Y(`${y.rank}. · ${_a(y.gapSeconds)}`),{distanceGapsByRiderId:m,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",u("youth"))}
    </section>
    ${Tt("Etappenwertungen",Oc(a,s,r,i),"race-sim-overview-stage-scoring","stageScoring",u("stageScoring"))}
  `}const on=new WeakMap,Oe=new WeakMap,ln=new WeakMap,$i=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function U(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Ti(e){return e<=0?"—":`+${Math.round(e)} m`}function jt(e){const t=$i.format(e);return e>0?`+${t}`:t}function us(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function ae(e){return $i.format(e)}function St(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function Mi(e){return`+${St(e)}`}function xi(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Vs(e){return`${(e*3.6).toFixed(1)} km/h`}function Vc(e){return`${jt(e)}%`}function ws(e){return`${e.toFixed(1).replace(".",",")} km`}function wi(e){return`${ws(e.segmentStartKm)} - ${ws(e.segmentEndKm)}`}function Uc(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function Ri(e){return e.replace(/_/g," ")}function Ii(e){return Ri(e)}function Yc(e){return Ri(e)}function Ei(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function Zc(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function Jc(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Fi(e){return Ve(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||lt(t)).map(({key:t,label:a})=>({key:t,label:a}))}function qc(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function Xc(e,t,a,s){var r;return a!=="ITT"&&a!=="TTT"?((r=s.get(t))==null?void 0:r.get(e.riderId))??null:e.splitTimes[t]??null}function Ci(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(r=>({label:r.key,displayLabel:r.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${r.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function Qc(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function eu(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function Ni(e){const t=on.get(e);if(t)return t;const a=Fi(e),s={splitMarkers:a,columns:Ci(e,a,!1),riderById:new Map(e.riders.map(r=>[r.id,r])),teamById:new Map((e.teams??[]).map(r=>[r.id,r])),teamAbbreviationById:new Map((e.teams??[]).map(r=>[r.id,r.abbreviation])),teamNameById:new Map((e.teams??[]).map(r=>[r.id,r.name])),gcByRiderId:new Map((e.gcStandings??[]).map(r=>[r.riderId,r]))};return on.set(e,s),s}function Pi(e,t){const a=e.parentElement,s=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!s)return"";const r=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",s.insertAdjacentElement("beforebegin",l),l})(),n=Us(e),i=Qc(t),o=eu(i,n),c=Oe.get(e);return(c==null?void 0:c.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),r.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,s.innerHTML=t.map(l=>tu(l,n)).join(""),Oe.set(e,{layoutKey:o,orderedRiderIds:(c==null?void 0:c.orderedRiderIds)??[],rowsByRiderId:(c==null?void 0:c.rowsByRiderId)??new Map,openDetailRiderId:(c==null?void 0:c.openDetailRiderId)??null,openTeamId:(c==null?void 0:c.openTeamId)??null})),o}function Ye(e,t){e.textContent!==t&&(e.textContent=t)}function ya(e,t){e.title!==t&&(e.title=t)}function va(e,t){e.className!==t&&(e.className=t)}function Sa(e,t,a){return e.lastValues[t]!==a}function ka(e,t,a){e.lastValues[t]=a}function Us(e){const t=ln.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return ln.set(e,a),a}function tu(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${U(e.label)}">${U(a)}</span>`;const s=!t.autoSort&&t.manualSortKey===e.sortKey,r=s?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${s?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${U(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${U(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${U(a)}<span class="race-sim-leaderboard-sort-indicator">${U(r)}</span></button>`}function au(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function su(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function dn(e,t,a,s,r,n,i){if(s.autoSort)return(c,l)=>e.stage.profile==="ITT"?Li(c,l,t):ou(c,l);if(!s.manualSortKey)return null;const o=s.manualSortDirection==="asc"?1:-1;return(c,l)=>{if(ke(c)!==ke(l))return ke(c)?1:-1;const g=r.get(c.riderId)??null,m=r.get(l.riderId)??null,u=cn(c,g,s.manualSortKey??"",e,a,n,i),p=cn(l,m,s.manualSortKey??"",e,a,n,i);return su(u,p)*o||c.riderId-l.riderId}}function ru(e,t,a){if(e.length!==t.size)return!1;let s=null;for(const r of e){const n=t.get(r);if(!n||s&&a(s,n)>0)return!1;s=n}return!0}function cn(e,t,a,s,r,n,i){const o=s.race.isStageRace&&s.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return s.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?Xc(e,a.slice(6),s.stage.profile,r):null}}function nu(e,t,a,s,r,n,i,o,c){if(!r.manualSortKey){if(r.autoSort){const u=dn(t,a,s,r,n,i,o);return u?[...e].sort(u):[...e]}const m=new Map(r.frozenOrder.map((u,p)=>[u,p]));return[...e].sort((u,p)=>(ke(u)===ke(p)?0:ke(u)?1:-1)||(m.get(u.riderId)??Number.MAX_SAFE_INTEGER)-(m.get(p.riderId)??Number.MAX_SAFE_INTEGER)||u.riderId-p.riderId)}const l=dn(t,a,s,r,n,i,o);if(!l)return[...e];const g=new Map(e.map(m=>[m.riderId,m]));return ru(c,g,l)?c.map(m=>g.get(m)).filter(m=>m!=null):[...e].sort(l)}function iu(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const g=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(g))return!1;const m=Oe.get(e);return m?(m.openTeamId=m.openTeamId===g?null:g,m.openTeamId==null&&(m.openDetailRiderId=null),!0):!1}const s=t.closest("button[data-race-sim-rider-toggle]");if(s){const g=Number(s.dataset.raceSimRiderToggle);if(!Number.isFinite(g))return!1;const m=Oe.get(e);return m?(m.openDetailRiderId=m.openDetailRiderId===g?null:g,!0):!1}const r=Us(e);if(t.closest("button[data-race-sim-splits-toggle]"))return r.showSplitColumns=!r.showSplitColumns,!r.showSplitColumns&&((l=r.manualSortKey)!=null&&l.startsWith("split:"))&&(r.manualSortKey=null,r.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return r.autoSort=!r.autoSort,r.autoSort?(r.manualSortKey=null,r.frozenOrder=[]):(r.manualSortKey=null,r.manualSortDirection="asc",r.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(g=>Number(g.dataset.raceSimRiderRow)).filter(g=>Number.isFinite(g))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||r.autoSort)return!1;const c=o.dataset.raceSimSortKey;return c?(r.manualSortKey===c?r.manualSortDirection=r.manualSortDirection==="asc"?"desc":"asc":(r.manualSortKey=c,r.manualSortDirection=au(c)),r.frozenOrder=[],!0):!1}function un(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function ke(e){return e.finishStatus==="dnf"}function Li(e,t,a){if(ke(e)!==ke(t))return ke(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const c=a[o];if(!c)continue;const l=e.splitTimes[c.key],g=t.splitTimes[c.key];if(l!=null&&g!=null&&l!==g)return l-g;if(l!=null&&g==null)return-1;if(l==null&&g!=null)return 1}const s=un(e,a),r=un(t,a);if(s!==r)return s?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function ou(e,t){return ke(e)!==ke(t)?ke(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function Di(e,t){const a=(t==null?void 0:t.formBonus)??0,s=(t==null?void 0:t.raceFormBonus)??0,r=(t==null?void 0:t.fatigueMalus)??0,n=(t==null?void 0:t.longTermFatigueMalus)??0,i=(t==null?void 0:t.shortTermFatigueMalus)??0,o=e.teamGroupBonus,c=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,g=e.baseSkill+l+a+s+e.dailyForm+e.microForm+o-r-n-i,m=Math.max(0,g-e.staminaPenalty),u=g-m,p=m-e.effectiveSkill;return[`Basis ${ae(e.baseSkill)}`,e.isAttacking?`+ Attacke ${ae(l)}`:null,`+ S-Form ${ae(a)}`,`+ R-Form ${ae(s)}`,`+ T-Form ${ae(e.dailyForm)}`,`+ Zufällige Form ${ae(c)} (skaliert)`,`+ Teambonus ${ae(o)}`,`- Fatigue ${ae(r)}`,`- Langzeit ${ae(n)}`,`- Akut ${ae(i)}`,`- Stamina ${ae(u)}`,`- HM ${ae(p)}`,`= Effektiv ${ae(e.effectiveSkill)}`].filter(f=>f!=null)}function lu(e,t){return Di(e,t).join(`
`)}function du(e){return jt(Math.max(-2.5,Math.min(2.5,e*2.5)))}function cu(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function Ai(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${U(e.riderName)}">${U(e.riderName)}</button>`}function uu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const s=t.get(e.activeTeamId)??"—",r=a.get(e.activeTeamId)??s;return`<span class="race-sim-team-code" title="${U(r)}">${U(s)}</span>`}function Bi(e){return`/jersey/Jer_${e}.png`}function mu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const s=t.get(e.activeTeamId);if(!s)return"—";const r=a.get(e.activeTeamId)??s.name,n=Bi(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${U(r)}">
      <img
        class="race-sim-team-jersey-img"
        src="${U(n)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function pu(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function gu(e,t,a,s){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=s.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const r=e.splitTimes[t];return r!=null?St(r):"—"}function _i(e,t,a){const s=Di(e,t),r=[{label:"Terrain / Skill",value:`${Ii(e.activeTerrain)} / ${Yc(e.skillName)}`},{label:"Aktiver Abschnitt",value:wi(e)},{label:"Segmenthöhe",value:Uc(e)},{label:"Basis",value:ae(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${ae(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:jt((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:jt((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:us((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:us((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:us((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:ae(e.staminaPenalty)},{label:"HM",value:ae(e.elevationPenalty)},{label:"T-Form",value:jt(e.dailyForm)},{label:"Zufall",value:du(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:cu(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?xi(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${U(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${U(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${r.map(n=>`<div class="race-sim-rider-detail-item"><span>${U(n.label)}</span><strong>${U(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${s.map(n=>U(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${U(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function fu(e,t,a,s,r,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const c=document.createElement("div");c.className="race-sim-row-grid",o.appendChild(c);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",c.appendChild(l);const g=document.createElement("span");g.className="race-sim-row-flag",g.innerHTML=t?el(Jc(t)):"—",c.appendChild(g);const m=document.createElement("span");m.className="race-sim-row-name",m.innerHTML=Ai(e,a),c.appendChild(m);const u=m.querySelector(".race-sim-row-name-btn");if(!u)throw new Error("race-sim-row-name-btn not found");const p=document.createElement("span");p.className="race-sim-row-team-visual",p.innerHTML=mu(t,r,i),c.appendChild(p);const f=document.createElement("strong");f.className="race-sim-row-team",f.innerHTML=uu(t,n,i),c.appendChild(f);const y=(L="")=>{const A=document.createElement("strong");return L&&(A.className=L),c.appendChild(A),A},b=y("race-sim-gap"),v=y("race-sim-cell-effective-skill"),M=y(),w=y(),T=y(),$=s.map(()=>y()),R=y(),E=y(),D=y("race-sim-form-state-cell"),F=document.createElement("div");return F.className="race-sim-row-detail-popover hidden",o.appendChild(F),{row:o,rankField:l,nameButton:u,gapField:b,clockField:T,splitFields:$,effectiveSkillField:v,gcRankField:M,gcGapField:w,gradientPercentField:R,speedField:E,formStateField:D,detailPanel:F,initialized:!1,lastValues:{}}}function hu(e,t,a,s,r,n,i,o,c,l,g){const m=(s==null?void 0:s.formBonus)??0,u=(s==null?void 0:s.raceFormBonus)??0,p=c&&l>1?g.get(a.riderId)??null:null,f=ke(a),y=i!=="ITT"&&i!=="TTT"?f?"DNF":"—":a.hasStarted?f?"DNF":a.riderClockSeconds!=null?St(a.riderClockSeconds):"—":Mi(a.startOffsetSeconds);va(e.row,`race-sim-row${t===1&&!f?" race-sim-row-leader":""}${r?" race-sim-row-detail-open":""}${f?" race-sim-row-dnf":""}`),Ye(e.rankField,`${t}.`),Ye(e.gapField,f?"DNF":Ti(a.gapToLeaderMeters)),Ye(e.clockField,y),e.nameButton.setAttribute("aria-expanded",r?"true":"false"),va(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),ya(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((w,T)=>{const $=e.splitFields[T];if(!$)return;const R=gu(a,w.key,i,o);Ye($,R),ya($,w.label)}),Sa(e,"effectiveSkillValue",a.effectiveSkill)&&(Ye(e.effectiveSkillField,ae(a.effectiveSkill)),ka(e,"effectiveSkillValue",a.effectiveSkill));const b=`race-sim-cell-effective-skill ${Ei(a)}`;Sa(e,"effectiveSkillClass",b)&&(va(e.effectiveSkillField,b),ka(e,"effectiveSkillClass",b));const v=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,m,u,a.dailyForm,a.microForm,(s==null?void 0:s.fatigueMalus)??0,(s==null?void 0:s.longTermFatigueMalus)??0,(s==null?void 0:s.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");Sa(e,"effectiveSkillTitleKey",v)&&(ya(e.effectiveSkillField,lu(a,s)),ka(e,"effectiveSkillTitleKey",v)),Ye(e.gcRankField,p?String(p.rank):"—"),Ye(e.gcGapField,p?xi(p.gapSeconds):"—"),Ye(e.gradientPercentField,Vc(a.gradientPercent)),va(e.gradientPercentField,Zc(a.gradientPercent)),ya(e.gradientPercentField,`${Ii(a.activeTerrain)} · ${wi(a)}`),Ye(e.speedField,Vs(a.currentSpeedMps)),e.formStateField.innerHTML=pu(a);const M=[r?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,m,u,(s==null?void 0:s.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(p==null?void 0:p.rank)??"—",(p==null?void 0:p.gapSeconds)??"—",a.skillBreakdown].join("|");Sa(e,"detailKey",M)&&(e.detailPanel.innerHTML=r?_i(a,s,p):"",e.detailPanel.classList.toggle("hidden",!r),ka(e,"detailKey",M)),e.detailPanel.classList.toggle("hidden",!r),e.initialized=!0}function bu(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${U(e.name)}">${U(e.name)}</button>`}function yu(e){const t=Bi(e.id);return`
    <span class="race-sim-team-visual" title="${U(e.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${U(t)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function vu(e,t,a){const s=new Map;for(const r of e.riders){const n=a.get(r.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=s.get(i)??[];o.push(r),s.set(i,o)}return t.teams.filter(r=>s.has(r.id)).map(r=>{const n=(s.get(r.id)??[]).slice().sort((g,m)=>m.effectiveSkill-g.effectiveSkill||g.riderId-m.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),c=n.slice(0,o).reduce((g,m)=>g+m.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:r,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,c-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(g=>g.isFinished).length}}).sort((r,n)=>Li(r.representative,n.representative,Fi(t))||r.team.id-n.team.id)}function Su(e,t,a,s,r){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${U(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${U(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${U(ae(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${U(Vs(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${U(e.teamClockSeconds!=null?St(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${U(ws(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&s>1?t.gcByRiderId.get(n.riderId)??null:null,c=r===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${Ai(n,c)}
                <strong>${U(ae(n.effectiveSkill))}</strong>
                <span>${U(n.riderClockSeconds!=null?St(n.riderClockSeconds):"—")}</span>
              </div>
              ${c?_i(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function ku(e,t,a){var p,f;const s=performance.now(),r=Ni(a),n=r.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(y=>({label:y.key,displayLabel:y.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(p=Oe.get(e))==null?void 0:p.layoutKey,c=Pi(e,i),l=Oe.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==c&&(e.innerHTML="");const g=vu(t,a,r.riderById),m=((f=g[0])==null?void 0:f.teamDistanceMeters)??0;return e.innerHTML=g.map((y,b)=>{const v=l.openTeamId===y.team.id;return`
      <article class="race-sim-row${b===0?" race-sim-row-leader":""}${v?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${b+1}.</strong>
          <span class="race-sim-row-name">${bu(y.team,v)}</span>
          <span class="race-sim-row-team-visual">${yu(y.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${U(y.team.name)}">${U(y.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${U(Ti(Math.max(0,m-y.teamDistanceMeters)))}</strong>
          <strong>${U(y.teamClockSeconds!=null?St(y.teamClockSeconds):Mi(y.representative.startOffsetSeconds))}</strong>
          ${n.map(M=>`<strong>${U(y.splitTimes[M.key]!=null?St(y.splitTimes[M.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${Ei(y.representative)}">${U(ae(y.teamEffectiveSkill))}</strong>
          <strong>${U(Vs(y.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${v?"":" hidden"}">${v?Su(y,r,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),Oe.set(e,{layoutKey:c,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-s,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:g.length,rowsCreated:g.length,rowsRemoved:0,rowsUpdated:g.length,rowsSkippedInvisible:0,orderChanged:1}}function mn(e,t,a){if(a.stage.profile==="TTT")return ku(e,t,a);const s=performance.now(),r={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=Ni(a),{splitMarkers:o}=i,c=qc(t),l=Us(e),g=l.showSplitColumns?o:[],m=Oe.get(e);r.prepMs=performance.now()-n;const u=performance.now(),p=nu(t.riders,a,o,c,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(m==null?void 0:m.orderedRiderIds)??[]);r.sortMs=performance.now()-u;const f=m==null?void 0:m.layoutKey,y=performance.now(),b=Pi(e,Ci(a,g,l.showSplitColumns));r.layoutMs=performance.now()-y;const v=Oe.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};f!=null&&f!==b&&(e.innerHTML="",v.rowsByRiderId.clear(),v.orderedRiderIds=[]);const M=p.map(F=>F.riderId),w=new Set(M),T=performance.now();for(const[F,L]of v.rowsByRiderId)w.has(F)||(L.row.remove(),v.rowsByRiderId.delete(F),r.rowsRemoved+=1);r.removeRowsMs=performance.now()-T;const $=performance.now();for(let F=0;F<p.length;F+=1){const L=p[F],A=i.riderById.get(L.riderId)??null;let _=v.rowsByRiderId.get(L.riderId);_||(_=fu(L,A,v.openDetailRiderId===L.riderId,g,i.teamById,i.teamAbbreviationById,i.teamNameById),v.rowsByRiderId.set(L.riderId,_),r.rowsCreated+=1)}r.createRowsMs=performance.now()-$;const R=performance.now(),E=v.orderedRiderIds.length===M.length&&v.orderedRiderIds.every((F,L)=>F===M[L]);r.orderCheckMs=performance.now()-R;const D=performance.now();if(!E){const F=document.createDocumentFragment();for(const L of M){const A=v.rowsByRiderId.get(L);A&&F.appendChild(A.row)}e.replaceChildren(F),r.orderChanged=1}r.reorderMs=performance.now()-D;for(let F=0;F<p.length;F+=1){const L=p[F],A=v.rowsByRiderId.get(L.riderId),_=i.riderById.get(L.riderId)??null;if(!A)continue;const B=performance.now();hu(A,F+1,L,_,v.openDetailRiderId===L.riderId,g,a.stage.profile,c,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),r.updateRowsMs+=performance.now()-B,r.rowsUpdated+=1}return Oe.set(e,{layoutKey:b,orderedRiderIds:M,rowsByRiderId:v.rowsByRiderId,openDetailRiderId:v.openDetailRiderId,openTeamId:v.openTeamId}),r.finalizeMs=performance.now()-(s+r.prepMs+r.sortMs+r.layoutMs+r.removeRowsMs+r.createRowsMs+r.orderCheckMs+r.reorderMs+r.visibilityMs+r.updateRowsMs),r.totalMs=performance.now()-s,r.finalizeMs=Math.max(0,r.totalMs-r.prepMs-r.sortMs-r.layoutMs-r.removeRowsMs-r.createRowsMs-r.orderCheckMs-r.reorderMs-r.visibilityMs-r.updateRowsMs),r}const $u=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],Tu=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],Gi=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],Hi=["Sprint","4","3","2","1","HC"],za=.2,Mu=7,xu=100,wu=3,Ru=50,Iu=-2,Eu=1,Fu=2.5,Cu=-3,Nu=15,Pu=200,Lu=600,Du=850;function Re(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function Ka(e){return e==="finish_hill"||e==="finish_mountain"}function Wa(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function Ys(e,t){return e==="climb_top"||Ka(e)&&Wa(t)}function aa(e){return Math.round(e*10)/10}function Pe(e){return Number(e.toFixed(2))}function gt(e){return`${e.toFixed(2).replace(".",",")} km`}function zi(e){return`${Math.round(e)} hm`}function Au(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function Zs(e){return $u.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function Bu(e){return Tu.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function _u(e,t="start",a=0,s=1){const r=Gi.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:Re(i)?a===s-1:i==="climb_top"||i==="sprint_intermediate");return(r.includes(e)?r:[e,...r.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${S(i)}</option>`).join("")}function Gu(e){return['<option value="">–</option>',...Hi.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`)].join("")}function pn(e){return Gi.indexOf(e)}function Le(e){return[...e].sort((t,a)=>pn(t.type)-pn(a.type))}function Jt(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:Le(e[0].markers)}];let a=0;return e.forEach(s=>{a=Pe(a+s.lengthKm);const r=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),n=t[t.length-1];n.terrain=s.terrain,n.techLevel=s.techLevel,n.windExp=s.windExp,n.markers=Le([...n.markers,...s.markers]),t.push({kmMark:a,elevation:r,terrain:s.terrain,techLevel:s.techLevel,windExp:s.windExp,markers:Le(s.endMarkers)})}),t}function Hu(e){return e?" stage-editor-input-invalid":""}function Js(e,t){const a=e.segments[t];if(!a)return[];const s=[],r=zu(e).get(t)??[];return a.lengthKm<za&&s.push(`Laenge unter ${za.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&s.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&s.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&s.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>Re(n.type))&&s.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&s.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>Re(n.type))&&s.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{Re(n.type)&&s.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&s.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&s.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&s.push(`${n.type} gehoert in den Startmarker-Slot.`),Ys(n.type,n.cat)&&!Wa(n.cat)&&s.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&s.push("Sprintmarker erlaubt nur Kategorie Sprint."),Re(n.type)&&!Ka(n.type)&&n.cat!=null&&s.push("finish_flat und finish_TT duerfen keine Kategorie haben."),Ka(n.type)&&n.cat!=null&&!Wa(n.cat)&&s.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),s.push(...r),[...new Set(s)]}function zu(e){const t=new Map,a=[],s=(r,n)=>{const i=t.get(r)??[];i.push(n),t.set(r,i)};return e.segments.forEach((r,n)=>{r.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),r.endMarkers.forEach(i=>{var l;if(!Ys(i.type,i.cat))return;if(!i.name){s(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let g=a.length-1;g>=0;g-=1)if(((l=a[g])==null?void 0:l.name)===i.name){o=g;break}const c=o>=0?o:a.length-1;if(c<0){s(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(c,1)})}),a.forEach(r=>{const n=r.name?` "${r.name}"`:"";s(r.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function Ku(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:Ka(e.type)?{...e,cat:Wa(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function Ki(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:Wu(e.waypoints??[])).map(s=>({...s,startElevation:Math.round(s.startElevation),lengthKm:Number.isFinite(s.lengthKm)?Pe(s.lengthKm):za,gradientPercent:Number.isFinite(s.gradientPercent)?aa(s.gradientPercent):0,techLevel:Number.isFinite(s.techLevel)?s.techLevel:5,windExp:Number.isFinite(s.windExp)?s.windExp:5,markers:gn(s.markers),endMarkers:gn(s.endMarkers)})),waypoints:[]};return dt(t),t}function Wu(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const s=e[a],r=e[a+1],n=Pe(r.kmMark-s.kmMark),i=r.elevation-s.elevation,o=aa(n>0?i/(n*10):0);t.push({startElevation:s.elevation,lengthKm:n,gradientPercent:o,techLevel:s.techLevel??5,windExp:s.windExp??5,terrain:s.terrain??"Flat",markers:s.markers??[],endMarkers:r.markers??[]})}return t}function gn(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function Ou(e,t,a){const s=e*a*8+t/12;return s>=95?"HC":s>=68?"1":s>=46?"2":s>=28?"3":"4"}function fn(e){const t=[];let a=null,s=null,r=0;const n=i=>{if(a==null||i==null||i<=a){a=null,s=null,r=0;return}const o=e[a],c=e[i],l=c.kmMark-o.kmMark,g=Math.max(0,c.elevation-o.elevation),m=l>0?g/(l*10):0;g>=xu&&m>=wu&&t.push({startKm:Pe(o.kmMark),endKm:Pe(c.kmMark),distanceKm:Pe(l),gainMeters:Math.round(g),avgGradient:aa(m),category:Ou(l,g,m),startIndex:a,topIndex:i,topElevation:Math.round(c.elevation)}),a=null,s=null,r=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],c=e[i],l=c.elevation-o.elevation;if(a==null&&l>0){a=i-1,s=i,r=0;continue}if(a!=null){if(l>=0){(s==null||c.elevation>=e[s].elevation)&&(s=i),r=0;continue}r+=Math.abs(l),r>=Ru&&n(s)}}return n(s),t}function ju(e){const t=e.segments.some(r=>r.terrain==="Cobble_Hill"),a=e.segments.some(r=>r.terrain==="Cobble"),s=e.climbs.some(r=>r.category==="HC"||r.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":s&&e.elevationGainMeters>=2800?"High_Mountain":s||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function $a(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function Vu(e){return e.gainMeters>=Lu&&e.topElevation>=Du?"Mountain":e.gainMeters>Pu?"Medium_Mountain":"Hill"}function Uu(e){return e.gradientPercent<Cu?"Abfahrt":e.gradientPercent<Fu||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<Nu?"Flat":"Hill"}function Yu(e){if(e.segments.length===0)return;if(e.waypoints=Jt(e.segments),e.sourceFormat==="csv"){const i=fn(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:c,topElevation:l,...g})=>g);return}const t=e.segments.map(i=>i.manualTerrain||$a(i.terrain)?i.terrain:Uu(i)),a=fn(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:c,...l})=>l),a.forEach(i=>{const o=Vu(i);if(o)for(let c=i.startIndex;c<i.topIndex;c+=1)e.segments[c].manualTerrain||$a(t[c])||(t[c]=o)});let s=null,r=0;const n=i=>{if(s==null||r<=Eu){s=null,r=0;return}for(let o=s;o<i;o+=1)!(e.segments[o].manualTerrain||$a(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");s=null,r=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<Iu){s==null&&(s=i),r+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{$a(i.terrain)||(i.terrain=t[o])}),e.waypoints=Jt(e.segments),e.suggestedProfile=ju(e)}function dt(e){Zu(e),hn(e),Yu(e),e.waypoints=Jt(e.segments),hn(e)}function Zu(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,s)=>{const r={...a,startElevation:Math.round(s===0?a.startElevation:t),lengthKm:Pe(a.lengthKm),gradientPercent:aa(a.gradientPercent),markers:Le(a.markers),endMarkers:Le(a.endMarkers)};return t=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),r}),e.waypoints=Jt(e.segments)}function hn(e){e.totalDistanceKm=Pe(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,s)=>{if(s===0)return 0;const r=a.elevation-e.waypoints[s-1].elevation;return t+Math.max(0,r)},0)}function et(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(s=>s.type==="start")||(t.markers=Le([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(s=>Re(s.type))||(a.endMarkers=Le([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=Jt(e.segments))}function Ju(e,t,a,s){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((r,n)=>{const i=s==="start"&&t===0&&r.type==="start",o=e.filter(g=>Re(g.type)).length,c=s==="end"&&t===a-1&&Re(r.type)&&o===1,l=!(i||c);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${s}" data-marker-index="${n}">${_u(r.type,s,t,a)}</select>
        <input type="text" value="${S(r.name??"")}" data-field="markerName" data-marker-scope="${s}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${s}" data-marker-index="${n}">${Gu(r.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${s}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function bn(e,t,a,s){const r=s==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${Ju(e,t,a,s)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${s}" data-segment-index="${t}">${r}</button>
    </div>`}function qu(e,t,a,s,r){if(!d.stageEditorDraft)return;const n=d.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(s==="markerType"){o.type=r;const c=Ku(o);if(o.name=c.name,o.cat=c.cat,Re(o.type)){const l=i.filter((g,m)=>m===t||!Re(g.type));a==="start"?n.markers=l:n.endMarkers=l}}else s==="markerName"?o.name=r.trim()||null:s==="markerCat"&&(o.cat=r||null);a==="start"?n.markers=Le(n.markers):n.endMarkers=Le(n.endMarkers),dt(d.stageEditorDraft),et(d.stageEditorDraft),ie()}}function Xu(e,t){if(!d.stageEditorDraft)return;const a=d.stageEditorDraft.segments[e];if(!a)return;const s=t==="start"?e===0&&!a.markers.some(r=>r.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===d.stageEditorDraft.segments.length-1&&!a.endMarkers.some(r=>Re(r.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(s),a.markers=Le(a.markers)):(a.endMarkers.push(s),a.endMarkers=Le(a.endMarkers)),dt(d.stageEditorDraft),et(d.stageEditorDraft),ie()}function Qu(e,t,a){if(!d.stageEditorDraft)return;const s=d.stageEditorDraft.segments[e];s&&(a==="start"?s.markers.splice(t,1):s.endMarkers.splice(t,1),dt(d.stageEditorDraft),et(d.stageEditorDraft),ie())}let Et=0,Ft=0;async function em(){h("stage-editor-profile").innerHTML=Zs("Flat"),h("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',h("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([G.listStageEditorCountries(),G.listStageEditorRaceCategories(),G.listStageEditorRacePrograms()]);if(e.success&&e.data){const s=h("stage-editor-race-country");s.innerHTML=e.data.map(r=>`<option value="${r.id}">${S(r.name)} (${S(r.code3)})</option>`).join("")}if(t.success&&t.data){const s=h("stage-editor-race-category");s.innerHTML=t.data.map(r=>`<option value="${r.id}">${S(r.name)}</option>`).join("")}a.success&&a.data&&(d.stageEditorPrograms=a.data,tm())}function tm(){const e=h("stage-editor-programs-list");d.stageEditorPrograms&&(e.innerHTML=d.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${S(t.name)}</span>
      </label>
    `).join(""))}function am(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=h("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(s=>{var n;const r=(n=d.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===s.value);return r?r.name:s.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function qs(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function Wi(){const e=d.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function sm(){const e=[...d.stageEditorExistingStages.map(t=>t.raceId),...d.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function rm(e,t){let a=e;const s=new Set(d.stageEditorExistingStages.map(r=>r.stageId));for(;a>0&&s.has(a);)a+=t;if(a<=0)for(a=1;s.has(a);)a+=1;return a}function nm(e,t){let a=e;const s=new Set([...d.stageEditorExistingStages.map(r=>r.raceId),...d.races.map(r=>r.id)]);for(;a>0&&s.has(a);)a+=t;if(a<=0)for(a=1;s.has(a);)a+=1;return a}function im(e){var o;const t=h("stage-editor-profile");t.innerHTML=Zs(e.suggestedProfile),t.value=e.suggestedProfile;const a=Wi(),s=sm();h("stage-editor-stage-id").value=String(a),h("stage-editor-race-id").value=String(s),Et=a,Ft=s;const r=h("stage-editor-details-file");r.value.trim()||(r.value=`${Au(e.routeName)}.csv`);const n=h("stage-editor-date");!n.value&&((o=d.gameState)!=null&&o.currentDate)&&(n.value=d.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(c=>{c.checked=!0})}function om(e){h("stage-editor-stage-id").value=String(e.stageId),h("stage-editor-race-id").value=String(e.raceId),Et=e.stageId,Ft=e.raceId,h("stage-editor-stage-number").value=String(e.stageNumber),h("stage-editor-date").value=e.date,h("stage-editor-details-file").value=e.detailsCsvFile;const t=h("stage-editor-profile");t.innerHTML=Zs(e.profile),t.value=e.profile,h("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),h("stage-editor-final-push-start").value=String(e.finalPushStartPercent),h("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),h("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),h("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(r=>r.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(r=>{r.checked=a.includes(r.value)})}function Oi(e){var s;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((s=e.segments[0])!=null&&s.markers.some(r=>r.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(r=>Re(r.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((r,n)=>{Js(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...r.markers??[],...r.endMarkers??[]].forEach(i=>{i.cat!=null&&!Hi.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function ji(){const e=[],t=Number(h("stage-editor-stage-id").value),a=Number(h("stage-editor-race-id").value),s=Number(h("stage-editor-stage-number").value),r=h("stage-editor-date").value.trim(),n=h("stage-editor-details-file").value.trim(),i=Number(h("stage-editor-final-spread-start").value),o=Number(h("stage-editor-final-push-start").value),c=Number(h("stage-editor-final-spread-difficulty").value),l=Number(h("stage-editor-crash-multiplier").value),g=Number(h("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(s)||s<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(r)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(c)||c<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(g)||g<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),d.stageEditorExistingStages.map(b=>b.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const p=h("stage-editor-new-race-checkbox").checked,f=[...d.stageEditorExistingStages.map(b=>b.raceId),...d.races.map(b=>b.id)];if(p){f.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const b=h("stage-editor-race-name").value.trim(),v=Number(h("stage-editor-race-country").value),M=Number(h("stage-editor-race-category").value),w=Number(h("stage-editor-race-num-stages").value),T=h("stage-editor-race-start-date").value.trim(),$=h("stage-editor-race-end-date").value.trim(),R=Number(h("stage-editor-race-prestige").value);b||e.push("Rennname fehlt."),(!Number.isInteger(v)||v<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger(M)||M<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(w)||w<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(T)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test($)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(R)||R<1||R>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else f.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return h("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function lm(){var a,s;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(r=>r.value).join("|");return{stageId:Number(h("stage-editor-stage-id").value),raceId:Number(h("stage-editor-race-id").value),stageNumber:Number(h("stage-editor-stage-number").value),date:h("stage-editor-date").value.trim(),profile:h("stage-editor-profile").value,detailsCsvFile:h("stage-editor-details-file").value.trim(),startElevation:((s=(a=d.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:s.startElevation)??0,finalSpreadStartPercent:Number(h("stage-editor-final-spread-start").value),finalPushStartPercent:Number(h("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(h("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(h("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(h("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function dm(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function cm(e){return["gainMeters","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function Xa(e,t,a){const r=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-r*118),i=54,o=.14+r*.12,c=.26+r*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${c};`}">${Math.round(e)}</span>`}function Xs(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),s=Math.round(40-t*22),r=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${r};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function um(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function mm(e,t,a,s){const r=s!=null?` data-stage-profile-open-climb-id="${S(s)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${r}>${e}</button>`}function pm(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",s=e.profileScore??e.score,r=[...d.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=r.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span>${S(i.name)}</span>
          <span class="text-right">${Xs(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${Xa(s,0,100)}
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
    </div>`}function gm(e){const t=r=>r!=null?`${r.toFixed(1).replace(".",",")} km`:"—",a=r=>r!=null?`${Math.round(r).toLocaleString("de-DE")} m`:"—",s=r=>r!=null?`${r.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${Xs(e.climbScore??0)}
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
    </div>`}function Vi(e,t,a,s,r,n,i,o){const c=o??Xa(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${mm(c,s,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${r}
      </div>
    </div>`}function se(e,t,a,s,r){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?s==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${r}-sort="${t}">
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function Ht(){const e=h("stage-editor-stages-table"),t=h("stage-editor-stages-empty"),a=h("stage-editor-stages-meta"),s=e.querySelector("thead"),r=e.querySelector("tbody");if(!r)return;const n=d.stageEditorStagesSort.key,i=d.stageEditorStagesSort.direction;s&&(s.innerHTML=`<tr>
      ${se("ID","stageId",n,i,"stages")}
      ${se("Land","countryCode",n,i,"stages")}
      ${se("Rennen","raceName",n,i,"stages")}
      ${se("Etappe","stageNumber",n,i,"stages")}
      ${se("Score","profileScore",n,i,"stages")}
      ${se("Profil","profile",n,i,"stages")}
      ${se("Distanz","distanceKm",n,i,"stages")}
      ${se("Höhenmeter","elevationGainMeters",n,i,"stages")}
      ${se("Sprints","sprintCount",n,i,"stages")}
      ${se("Climbs","climbCount",n,i,"stages")}
    </tr>`);const o=hm(d.stageEditorStageRows);r.innerHTML=o.map(c=>`
    <tr>
      <td>${c.stageId}</td>
      <td>${re(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(ra({stageNumber:c.stageNumber}))}</strong></td>
      <td>${Vi(c.profileScore,0,100,c.stageId,pm(c),as({name:c.raceName},{stageNumber:c.stageNumber,profile:c.profile}))}</td>
      <td>${na(c.profile)}</td>
      <td>${gt(c.distanceKm)}</td>
      <td>${zi(c.elevationGainMeters)}</td>
      <td>${c.sprintCount} Sprints</td>
      <td>${c.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${d.stageEditorStageRows.length} vorhandene Etappen`}function zt(){const e=h("stage-editor-climbs-table"),t=h("stage-editor-climbs-empty"),a=h("stage-editor-climbs-meta"),s=e.querySelector("thead"),r=e.querySelector("tbody");if(!r)return;const n=d.stageEditorClimbsSort.key,i=d.stageEditorClimbsSort.direction;s&&(s.innerHTML=`<tr>
      ${se("km","placementKm",n,i,"climbs")}
      ${se("Name","name",n,i,"climbs")}
      ${se("Kat.","category",n,i,"climbs")}
      ${se("Score","climbScore",n,i,"climbs")}
      ${se("Land","countryCode",n,i,"climbs")}
      ${se("Rennen","raceName",n,i,"climbs")}
      ${se("Etappe","stageNumber",n,i,"climbs")}
      ${se("Höhenmeter","gainMeters",n,i,"climbs")}
      ${se("Distanz","distanceKm",n,i,"climbs")}
      ${se("Ø Steigung","avgGradient",n,i,"climbs")}
      ${se("Max Steigung","maxGradient",n,i,"climbs")}
    </tr>`);const o=bm(d.stageEditorClimbRows);r.innerHTML=o.map(c=>`
    <tr>
      <td>${c.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${S(c.name)}</strong></td>
      <td>${um(c.category)}</td>
      <td>${Vi(c.climbScore,0,350,c.stageId,gm(c),as({name:c.raceName},{stageNumber:c.stageNumber,profile:"Mountain"}),c.id,Xs(c.climbScore))}</td>
      <td>${re(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(ra({stageNumber:c.stageNumber}))}</strong></td>
      <td>${zi(c.gainMeters)}</td>
      <td>${gt(c.distanceKm)}</td>
      <td>${c.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${c.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${d.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function Ui(e=!1){if(d.stageEditorOverviewLoaded&&!e){Ht(),zt();return}d.stageEditorOverviewLoading=!0,Ht(),zt();const t=await G.getStageEditorOverview();if(d.stageEditorOverviewLoading=!1,d.stageEditorOverviewLoaded=!0,!t.success||!t.data){d.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),Ht(),zt();return}d.stageEditorStageRows=t.data.stages,d.stageEditorClimbRows=t.data.climbs,Ht(),zt()}async function fm(e=!1){const t=h("stage-editor-existing-stage-wrap");if(d.stageEditorExistingStagesLoaded&&!e){Rs();return}t.classList.add("loading");const a=h("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const s=await G.listStageEditorStages();if(t.classList.remove("loading"),d.stageEditorExistingStagesLoaded=!0,!s.success||!s.data){d.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}d.stageEditorExistingStages=s.data.stages,Rs()}function Rs(){const e=h("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+d.stageEditorExistingStages.map(a=>{const s=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${S(a.raceName)} · Etappe ${a.stageNumber}${s}</option>`}).join("")}function hm(e){const t=d.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{let r=0;switch(d.stageEditorStagesSort.key){case"stageId":r=a.stageId-s.stageId;break;case"countryCode":r=(a.countryCode||"").localeCompare(s.countryCode||"","de");break;case"raceName":r=a.raceName.localeCompare(s.raceName,"de");break;case"stageNumber":r=a.stageNumber-s.stageNumber;break;case"profile":r=a.profile.localeCompare(s.profile,"de");break;case"distanceKm":r=a.distanceKm-s.distanceKm;break;case"elevationGainMeters":r=a.elevationGainMeters-s.elevationGainMeters;break;case"sprintCount":r=a.sprintCount-s.sprintCount;break;case"climbCount":r=a.climbCount-s.climbCount;break;case"profileScore":r=a.profileScore-s.profileScore;break}return r*t||a.stageId-s.stageId})}function bm(e){const t=d.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{let r=0;switch(d.stageEditorClimbsSort.key){case"placementKm":r=a.placementKm-s.placementKm;break;case"name":r=a.name.localeCompare(s.name,"de");break;case"category":r=(a.category??"").localeCompare(s.category??"","de");break;case"countryCode":r=(a.countryCode||"").localeCompare(s.countryCode||"","de");break;case"raceName":r=a.raceName.localeCompare(s.raceName,"de");break;case"stageNumber":r=a.stageNumber-s.stageNumber;break;case"gainMeters":r=a.gainMeters-s.gainMeters;break;case"distanceKm":r=a.distanceKm-s.distanceKm;break;case"avgGradient":r=a.avgGradient-s.avgGradient;break;case"maxGradient":r=a.maxGradient-s.maxGradient;break;case"climbScore":r=a.climbScore-s.climbScore;break}return r*t||a.placementKm-s.placementKm})}function ym(e){return e.map(t=>t.type).join(" | ")}function vm(e){const t=[],a=[];let s=0;return e.segments.forEach((r,n)=>{const i=s,o=Pe(i+r.lengthKm),c=qs(r);r.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:r.startElevation})}),r.endMarkers.forEach(l=>{if(Ys(l.type,l.cat)&&l.name){let g=-1;for(let m=a.length-1;m>=0;m--)if(a[m].name===l.name){g=m;break}if(g>=0){const m=a[g];a.splice(g,1);const u=Pe(o-m.startKm),p=Math.max(0,c-m.startElevation),f=u>0?aa(p/(u*10)):0;t.push({name:l.name,startKm:m.startKm,endKm:o,distanceKm:u,gainMeters:p,avgGradient:f,category:l.cat||"4"})}}}),s=o}),t}function Sm(e){const t=[];let a=0;return e.segments.forEach(s=>{const r=Pe(a+s.lengthKm);s.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:r})}),a=r}),t}function ie(){Rs();const e=d.stageEditorDraft,t=h("stage-editor-import-summary"),a=h("stage-editor-warnings"),s=h("stage-editor-climbs"),r=h("stage-editor-empty"),n=h("stage-editor-chart"),i=h("stage-editor-waypoints-body"),o=h("stage-editor-export-hint"),c=h("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",s.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',r.classList.remove("hidden"),n.innerHTML=yn(null),i.innerHTML=`<tr><td colspan="${Mu}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",c.disabled=!0;return}r.classList.add("hidden");const l=Oi(e),g=ji(),m=document.getElementById("stage-editor-profile"),u=m&&m.value?m.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${S(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${gt(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${S(u)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const p=[...e.warnings,...l,...g];a.innerHTML=p.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':p.map(v=>`<div class="stage-editor-alert">${S(v)}</div>`).join("");const f=vm(e),y=Sm(e);let b="";f.length>0?b+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (${f.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${f.map(v=>`
          <div class="stage-editor-climb" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="color: #fff; font-size: 0.85rem;">${S(v.name)}</strong>
              <span class="stage-editor-climb-category-badge ${v.category==="HC"?"is-hc":`is-cat-${v.category}`}" style="font-size: 0.7rem; padding: 0.1rem 0.35rem;">
                Kat. ${S(v.category)}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-300); display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span>${gt(v.startKm)} - ${gt(v.endKm)}</span>
              <span>·</span>
              <span><strong>${v.distanceKm.toFixed(1).replace(".",",")} km</strong></span>
              <span>·</span>
              <span><strong>${v.gainMeters} hm</strong></span>
              <span>·</span>
              <span><strong>${v.avgGradient.toFixed(1).replace(".",",")}%</strong></span>
            </div>
          </div>
        `).join("")}
      </div>
    `:b+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Bergwertungen definiert (climb_start und climb_top Marker mit gleichem Namen paaren).</p>
    `,y.length>0?b+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (${y.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${y.map(v=>`
          <div class="stage-editor-sprint" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--success); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.85rem;">${S(v.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-300); font-weight: bold;">
              ${gt(v.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:b+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `,s.innerHTML=b,n.innerHTML=yn(e),i.innerHTML=e.segments.map((v,M)=>`
    <tr data-segment-index="${M}" class="${Js(e,M).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${M+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${v.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${Hu(v.lengthKm<za)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${v.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${Bu(v.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${bn(v.markers,M,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${bn(v.endMarkers,M,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div class="text-muted" style="min-width:3.5rem;">${qs(v)} m</div>
          ${km(e,M)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${M}">+</button>
          ${M===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${M}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${M}">✕</button>`:""}
        </div>
      </td>
    </tr>`).join(""),c.disabled=p.length>0,o.textContent=p.length>0?`${p.length} Validierungshinweise vor dem Export.`:`Exportiert ${h("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function km(e,t){const a=Js(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(s=>`<div>${S(s)}</div>`).join("")}</div>`}function yn(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,s=24,r=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(f=>f.elevation)),c=Math.max(...n.map(f=>f.elevation)),l=Math.max(1,c-o),g=n.map(f=>{const y=s+f.kmMark/Math.max(i,.1)*(t-s*2),b=a-r-(f.elevation-o)/l*(a-r*2);return{x:y,y:b,waypoint:f}}),m=g.map((f,y)=>`${y===0?"M":"L"} ${f.x.toFixed(1)} ${f.y.toFixed(1)}`).join(" "),u=`${m} L ${(t-s).toFixed(1)} ${(a-r).toFixed(1)} L ${s.toFixed(1)} ${(a-r).toFixed(1)} Z`,p=g.filter(f=>f.waypoint.markers.length>0).map(f=>`
      <line x1="${f.x.toFixed(1)}" y1="${r}" x2="${f.x.toFixed(1)}" y2="${(a-r).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${f.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${S(ym(f.waypoint.markers))}</text>`).join("");return`
    <svg viewBox="0 0 ${t} ${a}" role="img" aria-label="Stage-Profil ${S(e.routeName)}">
      <defs>
        <linearGradient id="stage-editor-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(96, 165, 250, 0.38)"></stop>
          <stop offset="100%" stop-color="rgba(14, 165, 233, 0.04)"></stop>
        </linearGradient>
      </defs>
      <line x1="${s}" y1="${a-r}" x2="${t-s}" y2="${a-r}" class="stage-editor-chart-axis" />
      <line x1="${s}" y1="${r}" x2="${s}" y2="${a-r}" class="stage-editor-chart-axis" />
      ${p}
      <path d="${u}" fill="url(#stage-editor-area)"></path>
      <path d="${m}" class="stage-editor-chart-line"></path>
      ${g.map(f=>`<circle cx="${f.x.toFixed(1)}" cy="${f.y.toFixed(1)}" r="3.5" class="stage-editor-chart-point"></circle>`).join("")}
      <text x="${s}" y="${r-4}" class="stage-editor-chart-scale">${Math.round(c)} m</text>
      <text x="${s}" y="${a-4}" class="stage-editor-chart-scale">${Math.round(o)} m</text>
      <text x="${t-s}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${gt(i)}</text>
    </svg>`}function $m(e,t,a){const s=d.stageEditorDraft;if(!s)return;const r=s.segments[e];r&&(t==="startElevation"?r.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?r.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?r.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(r.terrain=a,r.manualTerrain=!0):t==="techLevel"?r.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(r.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),dt(s),et(s),ie())}function Tm(e){const t=d.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const s={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,s),dt(t),et(t),ie()}function Mm(){const e=d.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],s={startElevation:t?qs(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(s),dt(e),et(e),ie()}function xm(e){const t=d.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),dt(t),et(t),ie()))}async function wm(){var a;const t=(a=h("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}h("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,be("Route wird importiert……");try{const s=await t.text(),r=await G.importStageRoute({fileName:t.name,fileContent:s});if(!r.success||!r.data){alert(`Import fehlgeschlagen: ${r.error??"Unbekannter Fehler"}`);return}const n=Ki(r.data);d.stageEditorDraft=n,et(n),im(n),ie(),$t("stage-editor")}finally{me()}}async function Rm(){const e=Number(h("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}be("CSV-Stage wird geladen...");try{const t=await G.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=Ki(t.data.draft);d.stageEditorDraft=a,et(a),om(t.data.metadata),ie(),$t("stage-editor")}finally{me()}}async function Im(){if(!d.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...Oi(d.stageEditorDraft),...ji()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),ie();return}const t=h("stage-editor-new-race-checkbox").checked,a=h("stage-editor-program-checkbox").checked;let s;t&&(s={name:h("stage-editor-race-name").value.trim(),countryId:Number(h("stage-editor-race-country").value),categoryId:Number(h("stage-editor-race-category").value),isStageRace:Number(h("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(h("stage-editor-race-num-stages").value),startDate:h("stage-editor-race-start-date").value.trim(),endDate:h("stage-editor-race-end-date").value.trim(),prestige:Number(h("stage-editor-race-prestige").value)});let r;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');r=Array.from(n).map(i=>Number(i.value))}be("CSV-Dateien werden erstellt……");try{const n=await G.exportStageRoute({metadata:lm(),draft:d.stageEditorDraft,newRace:t,raceDetails:s,updatePrograms:a,programIds:r});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}Ts(n.data.stagesFileName,n.data.stagesCsv),Ts(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=h("stage-editor-stage-number"),o=Number(i.value)||1;i.value=String(o+1);const c=h("stage-editor-date"),l=c.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(l)){const b=new Date(l);b.setDate(b.getDate()+1);const v=b.getFullYear(),M=String(b.getMonth()+1).padStart(2,"0"),w=String(b.getDate()).padStart(2,"0");c.value=`${v}-${M}-${w}`}await Promise.all([Ui(!0),fm(!0)]);const g=Wi();h("stage-editor-stage-id").value=String(g),Et=g;const m=h("stage-editor-new-race-checkbox");m&&(m.checked=!1);const u=h("stage-editor-new-race-details");u&&(u.classList.add("hidden"),u.style.display="none");const p=h("stage-editor-program-checkbox");p&&(p.checked=!1);const f=h("stage-editor-program-details");f&&(f.classList.add("hidden"),f.style.display="none"),Ft=Number(h("stage-editor-race-id").value),ie()}finally{me()}}function Em(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",T=>{const $=T.target.closest("button[data-stage-editor-stages-sort]");if(!$)return;const R=$.dataset.stageEditorStagesSort;d.stageEditorStagesSort.key===R?d.stageEditorStagesSort.direction=d.stageEditorStagesSort.direction==="asc"?"desc":"asc":d.stageEditorStagesSort={key:R,direction:dm(R)},Ht()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",T=>{const $=T.target.closest("button[data-stage-editor-climbs-sort]");if(!$)return;const R=$.dataset.stageEditorClimbsSort;d.stageEditorClimbsSort.key===R?d.stageEditorClimbsSort.direction=d.stageEditorClimbsSort.direction==="asc"?"desc":"asc":d.stageEditorClimbsSort={key:R,direction:cm(R)},zt()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{wm()});const s=document.getElementById("btn-stage-editor-load-existing");s&&s.addEventListener("click",()=>{Rm()});const r=document.getElementById("btn-stage-editor-export");r&&r.addEventListener("click",()=>{Im()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",T=>{var R;const $=((R=T.target.files)==null?void 0:R[0])??null;h("stage-editor-file-hint").textContent=$?`${$.name} · ${($.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",T=>{const $=T.target,R=$.closest("tr[data-segment-index]"),E=$.dataset.field;if(!R||!E)return;const D=Number(R.dataset.segmentIndex);if(Number.isInteger(D)){if(E==="markerType"||E==="markerName"||E==="markerCat"){const F=Number($.dataset.markerIndex),L=$.dataset.markerScope;if(!Number.isInteger(F)||L!=="start"&&L!=="end")return;qu(D,F,L,E,$.value);return}$m(D,E,$.value)}}),i.addEventListener("click",T=>{const $=T.target.closest("button[data-segment-action]");if(!$)return;const R=Number($.dataset.segmentIndex);if(Number.isInteger(R)){if($.dataset.segmentAction==="insert"){Tm(R);return}if($.dataset.segmentAction==="append"){Mm();return}if($.dataset.segmentAction==="add-marker"){const E=$.dataset.markerScope;if(E!=="start"&&E!=="end")return;Xu(R,E);return}if($.dataset.segmentAction==="remove-marker"){const E=Number($.dataset.markerIndex),D=$.dataset.markerScope;if(!Number.isInteger(E)||D!=="start"&&D!=="end")return;Qu(R,E,D);return}$.dataset.segmentAction==="delete"&&xm(R)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(T=>{const $=document.getElementById(T);$&&$.addEventListener("change",()=>ie())}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(T=>{T.addEventListener("change",()=>ie())});const c=h("stage-editor-new-race-checkbox"),l=h("stage-editor-new-race-details"),g=h("stage-editor-program-checkbox"),m=h("stage-editor-program-details");c&&c.addEventListener("change",()=>{c.checked?(l&&(l.classList.remove("hidden"),l.style.display="grid"),g&&(g.checked=!0,m&&(m.classList.remove("hidden"),m.style.display="block"))):l&&(l.classList.add("hidden"),l.style.display="none"),ie()}),g&&g.addEventListener("change",()=>{g.checked?m&&(m.classList.remove("hidden"),m.style.display="block"):m&&(m.classList.add("hidden"),m.style.display="none"),ie()});const u=h("stage-editor-programs-dropdown-trigger"),p=h("stage-editor-programs-dropdown-menu"),f=h("btn-stage-editor-programs-ok");u&&p&&(u.addEventListener("click",T=>{T.stopPropagation();const $=p.style.display==="none"||!p.style.display;p.style.display=$?"flex":"none"}),f&&f.addEventListener("click",T=>{T.stopPropagation(),p.style.display="none",ie()}),document.addEventListener("click",T=>{const $=T.target;p.style.display==="flex"&&!p.contains($)&&$!==u&&!u.contains($)&&(p.style.display="none",ie())}));const y=h("stage-editor-programs-list");y&&y.addEventListener("change",T=>{T.target.name==="stage-editor-program-selection"&&am()});let b=!1,v=null;const M=h("stage-editor-stage-id"),w=h("stage-editor-race-id");if(M&&w){[M,w].forEach($=>{$.addEventListener("keydown",R=>{R.key!=="ArrowUp"&&R.key!=="ArrowDown"&&(b=!0,v&&clearTimeout(v))}),$.addEventListener("keyup",R=>{R.key!=="ArrowUp"&&R.key!=="ArrowDown"&&(v&&clearTimeout(v),v=setTimeout(()=>{b=!1},150))}),$.addEventListener("blur",()=>{b=!1})});const T=($,R)=>{const E=Number($.value);if(!Number.isInteger(E)||E<=0){R==="stage"?Et=E:Ft=E;return}const F=E-(R==="stage"?Et:Ft);if(!b&&(F===1||F===-1)){let L=E;R==="stage"?L=rm(E,F):h("stage-editor-new-race-checkbox").checked&&(L=nm(E,F)),$.value=String(L)}R==="stage"?Et=Number($.value):Ft=Number($.value)};M.addEventListener("input",()=>{T(M,"stage"),ie()}),w.addEventListener("input",()=>{T(w,"race"),ie()})}}let qe=[],Rt=null;const Mt=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"];function Qs(e,t){if(e==null)return"";const a=t?S(t):"Wetter";switch(e){case 1:return`
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${a}">
          <circle cx="12" cy="12" r="4" fill="rgba(234, 179, 8, 0.2)"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
        </svg>
      `;case 2:return`
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${a}">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" fill="rgba(239, 68, 68, 0.2)"></path>
          <line x1="12" y1="9" x2="12" y2="15"></line>
        </svg>
      `;case 3:return`
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${a}">
          <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2" stroke="#eab308"></path>
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" stroke="#94a3b8" fill="rgba(148, 163, 184, 0.2)"></path>
          <line x1="8" y1="20" x2="8" y2="22"></line>
          <line x1="12" y1="20" x2="12" y2="22"></line>
        </svg>
      `;case 4:return`
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${a}">
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" stroke="#64748b" fill="rgba(100, 116, 139, 0.2)"></path>
          <line x1="8" y1="19" x2="6" y2="22"></line>
          <line x1="12" y1="19" x2="10" y2="22"></line>
          <line x1="16" y1="19" x2="14" y2="22"></line>
        </svg>
      `;case 5:return`
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${a}">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59-3.41A2 2 0 1 1 14 7h-2M12.59 15.41A2 2 0 1 0 14 12H2m12.59 3.41A2 2 0 1 0 11 16h2"></path>
        </svg>
      `;case 6:return`
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${a}">
          <line x1="5" y1="8" x2="19" y2="8"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="6" y1="16" x2="18" y2="16"></line>
          <line x1="8" y1="20" x2="16" y2="20"></line>
        </svg>
      `;case 7:return`
        <svg class="rider-stats-icon weather-icon" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;" title="${a}">
          <line x1="12" y1="2" x2="12" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"></path>
        </svg>
      `;default:return""}}const q={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function Oa(e,t,a){const s=Xt(e??null);return`<span class="badge badge-race-category" style="${Ya(s)}; white-space: nowrap; display: inline-block;">${S(e??"Unbekannt")}</span>`}function er(e){if(!e)return"-";const t=Xt(e);return`<span class="badge badge-race-category" style="${Ya(t)}; white-space: nowrap; display: inline-block;">${S(e)}</span>`}function Fm(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function Cm(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${Fm(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function Yi(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";default:return""}}function tr(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";default:return"Etappe"}}function Nm(e){return`<span class="rider-stats-final-type ${Yi(e)}">${S(tr(e))}</span>`}function ee(e,t,a){let s="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?s+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?s+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?s+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?s+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?s+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?s+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(s+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${s}" title="${S(a)}: ${e} Siege">${e}</span>`}function fe(e,t,a){let s="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?s+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?s+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?s+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?s+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?s+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?s+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?s+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(s+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${s}" title="${S(a)}: ${e} Siege">${e}</span>`}function Pm(e){return`${e.startDate===e.endDate?Q(e.startDate):`${Q(e.startDate)} - ${Q(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function ja(e){if(e==null||d.riders.length===0)return null;const a=[...d.riders].sort((s,r)=>(r.seasonPoints??0)-(s.seasonPoints??0)||(r.seasonWins??0)-(s.seasonWins??0)||r.overallRating-s.overallRating||`${s.lastName} ${s.firstName}`.localeCompare(`${r.lastName} ${r.firstName}`,"de")||s.id-r.id).findIndex(s=>s.id===e);return a>=0?a+1:null}function vn(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;default:return 4}}function Lm(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||vn(t.rowType)-vn(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function Dm(e){return[...e].map(t=>({...t,rows:Lm(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function Zi(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,s=36;const r=Math.max(50,Math.min(85,e));for(let c=1;c<t.length;c++){const l=t[c-1],g=t[c];if(r<=g.score){const m=(r-l.score)/(g.score-l.score);a=Math.round(l.hue+(g.hue-l.hue)*m),s=Math.round(l.lightness+(g.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function tt(e,t,a,s){const r=s>0?Math.max(0,Math.min(1,a/s)):.5,n=Math.round(6+r*118),i=.26+r*.18,o=.14+r*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${S(t)}">${e} ${a}</span>`}function ms(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function ps(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return q.mountain;case"Hill":return q.hilly;case"Sprint":return q.sprint;case"Timetrial":return q.timetrial;case"Cobble":return q.cobble;case"Attacker":return q.attacker;default:return""}}function Be(e,t,a,s,r){var P,z,Z;const n=(t==null?void 0:t.countryCode)??s??null,i=n?re(n):r,o=(t==null?void 0:t.roleName)??((P=e==null?void 0:e.role)==null?void 0:P.name)??"Ohne Rolle",c=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,g=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",m=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",u=((z=t==null?void 0:t.program)==null?void 0:z.name)??((Z=e==null?void 0:e.seasonProgram)==null?void 0:Z.name)??"-",p=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,f=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,y=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,b=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,v=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,M=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,w=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",T=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,$=(t==null?void 0:t.currentSeasonRank)??ja((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),R=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,E=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,D=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,F=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},L=Math.max(F.flat,F.hilly,F.mediumMountain,F.mountain,F.timetrial,F.cobble),A=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},_=Math.max(A.stageRace,A.oneDay),B=e!=null&&e.specialization1?ms(e.specialization1):"-",x=e!=null&&e.specialization2?ms(e.specialization2):"-",N=e!=null&&e.specialization3?ms(e.specialization3):"-",H=ps((e==null?void 0:e.specialization1)??null),I=ps((e==null?void 0:e.specialization2)??null),C=ps((e==null?void 0:e.specialization3)??null);return`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${S(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?yt(l,g):""} <span>${S(g)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${S(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${On(m)} <span>Form</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${Zi(c)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${q.seasonForm} ${p>=0?"+":""}${p}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${q.raceForm} ${f>=0?"+":""}${f}</span>
        <span class="rider-stats-icon-pill" title="Programm">${S(u)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${q.raceDays} <span class="rider-stats-icon-pill-value">${y}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${b>14?"text-warning":""}" title="30-Tage Renntage">${q.rollingRaceDays} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${q.longFatigue} <span class="rider-stats-icon-pill-value">${v}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${w!=="none"?"text-error":""}" title="Kurzzeitfatigue">${q.shortFatigue} <span class="rider-stats-icon-pill-value">${M}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${q.seasonPoints} <span class="rider-stats-icon-pill-value">${T}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${q.rank} <span class="rider-stats-icon-pill-value">${Cm($)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${q.raceDays} <span class="rider-stats-icon-pill-value">${R}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${q.wins} <span class="rider-stats-icon-pill-value">${E}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${H} ${S(B)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${I} ${S(x)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${C} ${S(N)}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${tt(q.stageRace,"Rundfahrten Punkte",A.stageRace,_)}
        ${tt(q.oneDay,"Eintagesrennen Punkte",A.oneDay,_)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${q.breakaway} <span class="rider-stats-icon-pill-value">${D}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${tt(q.flat,"Flach-Punkte",F.flat,L)}
        ${tt(q.hilly,"Hügel-Punkte",F.hilly,L)}
        ${tt(q.mediumMountain,"Mittelgebirge-Punkte",F.mediumMountain,L)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${tt(q.mountain,"Hochgebirge-Punkte",F.mountain,L)}
        ${tt(q.timetrial,"Zeitfahren-Punkte",F.timetrial,L)}
        ${tt(q.cobble,"Kopfsteinpflaster-Punkte",F.cobble,L)}
      </div>
    </div>
  `}function Sn(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",s=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${S(a)} <strong>${S(s)}</strong>`}function _e(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${d.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${d.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${d.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${d.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${d.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${d.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${d.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
    </div>`}function Am(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,s=36;const r=Math.max(55,Math.min(80,e));for(let c=1;c<t.length;c++){const l=t[c-1],g=t[c];if(r<=g.score){const m=(r-l.score)/(g.score-l.score);a=Math.round(l.hue+(g.hue-l.hue)*m),s=Math.round(l.lightness+(g.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function Bm(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},s=["mountain","hill","sprint","timeTrial","cobble","attack"],r=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,c=i/2,l=160,g=60,m=85,u=m-g,p=A=>{const _=[];for(let B=0;B<6;B++){const x=B*Math.PI/3-Math.PI/2;_.push(`${o+A*Math.cos(x)},${c+A*Math.sin(x)}`)}return _},f=`
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
    </defs>`,y=`<circle cx="${o}" cy="${c}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let b="";for(let A=g;A<=m;A+=2.5){const _=l*((A-g)/u);if(_<1){b+=`<circle cx="${o}" cy="${c}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const B=p(_),x=A%5===0,N=x?1:.6,H=x?"none":"4,4",I=x?.4:.18;b+=`<polygon points="${B.join(" ")}" fill="none" stroke="rgba(255,255,255,${I})" stroke-width="${N}" stroke-dasharray="${H}" />`,x&&A>g&&(b+=`<text x="${o+5}" y="${c-_+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${A}</text>`)}let v="",M="";for(let A=0;A<6;A++){const _=A*Math.PI/3-Math.PI/2,B=o+l*Math.cos(_),x=c+l*Math.sin(_);v+=`<line x1="${o}" y1="${c}" x2="${B}" y2="${x}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const N=l+28,H=o+N*Math.cos(_),I=c+N*Math.sin(_),C=Math.cos(_);let P="middle";C>.15?P="start":C<-.15&&(P="end");const z=a[s[A]]??g;M+=`<text x="${H}" y="${I}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${P}" dominant-baseline="middle">${r[A]}</text>`,M+=`<text x="${H}" y="${I+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${P}" dominant-baseline="middle">${z}</text>`}const w=[],T=[];s.forEach((A,_)=>{const B=a[A]??g,x=l*((Math.max(g,Math.min(m,B))-g)/u),N=_*Math.PI/3-Math.PI/2,H=o+x*Math.cos(N),I=c+x*Math.sin(N);w.push(`${H},${I}`),T.push(`<circle cx="${H}" cy="${I}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${r[_]}: ${B}</title></circle>`)});const $=`<polygon points="${w.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,E=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((A,_)=>{const B=a[A.key]??60;return(a[_.key]??60)-B}),D=[],F=[];E.forEach((A,_)=>{const B=a[A.key]??60,x=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${A.label}</span>
        ${Am(B)}
      </div>
    `;_%2===0?D.push(x):F.push(x)});const L=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${D.join("")}</div>
      <div class="skills-col">${F.join("")}</div>
    </div>
  `;return`
    <section class="rider-stats-skills-tab" style="margin-top: 1rem;">
      <div class="rider-stats-skills-container" style="display: grid; grid-template-columns: 540px 1fr; gap: 2rem; align-items: start; background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-primary);">
        <div class="skills-radar-wrapper" style="display: flex; justify-content: center; align-items: center; background: var(--bg-900); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-primary);">
          <svg width="540" height="440" viewBox="0 0 ${n} ${i}" style="overflow: visible;">
            ${f}
            ${y}
            ${b}
            ${v}
            ${$}
            ${T.join("")}
            ${M}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${L}
        </div>
      </div>
    </section>
  `}function _m(e,t){const a=t.shortTermFatigueMalus??0,s=t.longTermFatigueDecayable??0,r=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),c=(s/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const g=t.fatigueHistory??[];let m="";return g.length===0?m='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':m=g.map(u=>{const p=Q(u.date);let f="";u.type==="race"?f=`${S(u.raceName)}${u.stageNumber!=null?` - Etappe ${u.stageNumber}`:""}`:f=u.raceName?S(u.raceName):"Regeneration";const y=u.type==="race"&&u.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${u.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let b="";u.shortChange>0?b=`<span style="color: #ef4444; font-weight: 600;">+${u.shortChange.toFixed(2).replace(".",",")}</span>`:u.shortChange<0?b=`<span style="color: #2ecc71; font-weight: 600;">${u.shortChange.toFixed(2).replace(".",",")}</span>`:b='<span style="color: #666;">0,00</span>';const v=[];if(u.longDecayableChange!==0){const T=u.longDecayableChange>0?"+":"",$=u.longDecayableChange>0?"#ef4444":"#2ecc71";v.push(`<span style="color: ${$}; font-weight: 500;">${T}${u.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(u.longLockedChange!==0){const T=u.longLockedChange>0?"+":"",$=u.longLockedChange>0?"#a855f7":"#2ecc71";v.push(`<span style="color: ${$}; font-weight: 500;">${T}${u.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const M=v.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${v.join("")}</div>`:'<span style="color: #666;">0,00</span>',w=u.shortAfter+u.longAfter;return`
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${p}</td>
          <td style="color: #fff; font-weight: 600; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${f}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${y}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${b}
              <span style="font-size: 0.85rem; color: #888;">(${u.shortAfter.toFixed(2).replace(".",",")})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; justify-content: flex-end; width: 100%;">
              ${M}
              <span style="font-size: 0.85rem; color: #888;">(${u.longAfter.toFixed(2).replace(".",",")})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <strong style="color: #ef4444; font-size: 0.95rem;">-${w.toFixed(2).replace(".",",")}</strong>
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
  `}function Gm(e){var H;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((I,C)=>C%2===0),s=((H=d.gameState)==null?void 0:H.currentDate)??new Date().toISOString(),r=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(s).getUTCFullYear(),n=new Date(Date.UTC(r,0,1)).getTime(),i=864e5,o=1300,c=384,l=30,g=20,m=a.map(I=>{const P=(new Date(I.date).getTime()-n)/i,z=l+P/365*o,Z=g+c-Math.min(8,Math.max(0,I.totalForm))/8*c;return{x:z,y:Z,form:I.totalForm,date:I.date}});let u="",p="",f="";m.length>0&&(u=`M ${m.map(I=>`${I.x},${I.y}`).join(" L ")}`,p=m.map(I=>`<circle cx="${I.x}" cy="${I.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${I.date}): ${I.form}</title></circle>`).join(""),f=`${u} L ${m[m.length-1].x},${g+c} L ${m[0].x},${g+c} Z`);const y="rgba(251, 191, 36, 0.15)";let b="";for(let I=0;I<=8;I+=2){const C=g+c-I/8*c;b+=`<line x1="${l}" y1="${C}" x2="${l+o}" y2="${C}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,b+=`<text x="${l-5}" y="${C+4}" fill="#ffffff" font-size="10" text-anchor="end">${I}</text>`}let v="";for(let I=0;I<=52;I+=5){const C=l+I/52*o;b+=`<line x1="${C}" y1="${g}" x2="${C}" y2="${g+c}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,v+=`<text x="${C}" y="${g+c+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${I}</text>`}let M="",w="";if(e.peakDates){const I=[...e.peakDates].sort((C,P)=>new Date(C).getTime()-new Date(P).getTime());for(let C=0;C<I.length;C++){const P=I[C],Z=(new Date(P).getTime()-n)/i,j=l+Z/365*o;M+=`<line x1="${j}" y1="${g}" x2="${j}" y2="${g+c}" stroke="#ffffff" stroke-width="2"><title>Peak: ${P}</title></line>`;const te=C>0?(new Date(I[C-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,$e=Z-56,le=te+14,ce=Math.max(0,Math.max($e,le)),pe=Z-ce,k=l+ce/365*o,K=pe/365*o;w+=`<rect x="${k}" y="${g}" width="${K}" height="${c}" fill="rgba(16, 185, 129, 0.1)" />`;const W=14/365*o;w+=`<rect x="${j}" y="${g}" width="${W}" height="${c}" fill="rgba(239, 68, 68, 0.1)" />`}}const $=(new Date(s).getTime()-n)/i,R=l+$/365*o;M+=`<line x1="${R}" y1="${g}" x2="${R}" y2="${g+c}" stroke="#ef4444" stroke-width="3"><title>Heute: ${s}</title></line>`,qe.forEach((I,C)=>{const P=Mt[C%Mt.length];I.peakDates&&I.peakDates.forEach(z=>{const j=(new Date(z).getTime()-n)/i,te=l+j/365*o;M+=`<line x1="${te}" y1="${g}" x2="${te}" y2="${g+c}" stroke="${P}" stroke-width="1.5" stroke-dasharray="3,3"><title>${I.riderName} Peak: ${z}</title></line>`})});let E="",D="";qe.forEach((I,C)=>{const P=Mt[C%Mt.length],z=I.formHistory.filter((Z,j)=>j%2===0).map(Z=>{const te=(new Date(Z.date).getTime()-n)/i,$e=l+te/365*o,le=g+c-Math.min(8,Math.max(0,Z.totalForm))/8*c;return{x:$e,y:le,form:Z.totalForm,date:Z.date}});if(z.length>0){const Z=`M ${z.map(j=>`${j.x},${j.y}`).join(" L ")}`;E+=`<path d="${Z}" fill="none" stroke="${P}" stroke-width="2" />`,D+=z.map(j=>`<circle cx="${j.x}" cy="${j.y}" r="3" fill="#fff" stroke="${P}" stroke-width="2"><title>${I.riderName} (${j.date}): ${j.form}</title></circle>`).join("")}});const F=d.teams.filter(I=>I.division==="WorldTour"||I.divisionName==="WorldTour");let L='<option value="">-- Team auswählen --</option>';for(const I of F){const C=Rt===I.id?" selected":"";L+=`<option value="${I.id}"${C}>${S(I.name)}</option>`}let A='<option value="">-- Fahrer auswählen --</option>';if(Rt!=null){const I=d.riders.filter(C=>C.activeTeamId===Rt&&C.id!==e.riderId&&!qe.some(P=>P.riderId===C.id));for(const C of I)A+=`<option value="${C.id}">${S(C.firstName)} ${S(C.lastName)}</option>`}const _=`
    <div class="rider-compare-controls" style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-primary);">
      <span style="font-weight: 600; color: var(--text-100); font-size: 0.95rem;">Mit anderem Fahrer vergleichen:</span>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-team-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Team (Tier 1):</label>
        <select id="rider-compare-team-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);">
          ${L}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-rider-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Fahrer:</label>
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${Rt==null?"disabled":""}>
          ${A}
        </select>
      </div>
    </div>
  `,B=e.currentSeasonRank??ja(e.riderId)??"–",x=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(e.riderName)} (${e.currentSeasonPoints}/${B})">${S(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${B})</span></span>
    </div>
    `];qe.forEach((I,C)=>{const P=Mt[C%Mt.length],z=I.currentSeasonRank??ja(I.riderId)??"–";x.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${P}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(I.riderName)} (${I.currentSeasonPoints}/${z})">${S(I.riderName)} <span style="color: var(--text-500);">(${I.currentSeasonPoints}/${z})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${I.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const N=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      ${x.join("")}
    </div>
  `;return`
    <section class="rider-stats-form-tab">
      <div class="rider-stats-season-head">
        <h3>Formverlauf (Saison ${r})</h3>
      </div>
      ${_}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${w}
            ${b}
            ${v}
            ${M}
            ${f?`<path d="${f}" fill="${y}" />`:""}
            ${u?`<path d="${u}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${p}
            ${E}
            ${D}
          </svg>
        </div>
        ${N}
      </div>
    </section>
  `}function Hm(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
      <section class="rider-stats-placeholder">
        <h3>${S(e.program.name)}</h3>
        <p>Diesem Programm sind aktuell keine Rennen zugeordnet.</p>
      </section>`:`
    <section class="rider-stats-program">
      <div class="rider-stats-season-head">
        <h3>${S(e.program.name)}</h3>
        <span>${t.length} Rennen</span>
      </div>
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table rider-stats-program-table">
          <thead><tr><th>Datum</th><th class="text-center">Status</th><th>Land</th><th>Rennen</th><th>Rennklasse</th></tr></thead>
          <tbody>
            ${t.map(a=>{var r;const s=e.unavailableUntil?a.startDate<=e.unavailableUntil&&a.endDate>=d.gameState.currentDate:!1;return`
              <tr>
                <td>${S(es(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${s?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(r=a.country)!=null&&r.code3?re(a.country.code3):"–"}</td>
                <td><strong>${S(a.name)}</strong></td>
                <td>${Qa(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}const zm={1:"Sturz",2:"Defekt",3:"Superform",4:"Supermalus",5:"Attacken",6:"Konterattacken",7:"Heimvorteil",8:"Superheimvorteil",9:"Heimdruck"},Km={yellow:"Gelbes Trikot (Gesamtwertung)",green:"Grünes Trikot (Punktewertung)",red:"Bergtrikot (Bergwertung)",white:"Weißes Trikot (Nachwuchswertung)",purple:"Lila Trikot (Aktivste Fahrer)"};function ar(e){const t=[],a=[];if(e.jerseysWorn){const s=e.jerseysWorn.trim();if(s){const r=Km[s]||`${s} Trikot`,n=s==="purple"?"jersey-dot-purple-worn":`jersey-dot-${s}`;t.push(`<span class="status-dot ${n}"></span>`),a.push(`
        <div class="status-tooltip-row">
          <span class="status-dot ${n}"></span>
          <span>${S(r)}</span>
        </div>
      `)}}if(e.eventIds){const s=e.eventIds.split("|");for(const r of s){const[n,i]=r.split(":");if(n){const o=i?parseInt(i,10):1,c=zm[n]||`Event ${n}`,l=o>1?` (${o}x)`:"";t.push(`<span class="status-dot event-dot-${n}"></span>`),a.push(`
          <div class="status-tooltip-row">
            <span class="status-dot event-dot-${n}"></span>
            <span>${S(c)}${S(l)}</span>
          </div>
        `)}}}return t.length===0?"":`
    <div class="status-dots-container">
      ${t.join("")}
      <div class="status-tooltip">
        <div class="status-tooltip-title">Status Details</div>
        ${a.join("")}
      </div>
    </div>
  `}function kt(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${S(e)}</span>`}function Wm(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function Om(e){return e.finishStatus==="otl"?kt("OTL","place"):e.finishStatus==="dnf"?kt("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${S(String(e.resultRank))}</span>`}function jm(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":kt(String(e.gcRank),"gc")}function Vm(e){return e.finishStatus==="otl"?Ss(e.statusReason,!0):e.finishStatus==="dnf"?Ss(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${Na(e.stageTimeSeconds)}`:e.resultLabel}function Ge(e,t,a=!1){var o,c;const s=(e==null?void 0:e.activeTeamId)!=null?((o=d.teams.find(l=>l.id===e.activeTeamId))==null?void 0:o.name)??null:null,r=((c=e==null?void 0:e.country)==null?void 0:c.code3)??(e==null?void 0:e.nationality)??null,n=r?re(r):"",i=t==null?[]:[...t.seasons].map(l=>({...l,raceBlocks:Dm(l.raceBlocks)})).sort((l,g)=>g.season-l.season);return a?`
      ${Be(e,t,s,r,n)}
      ${_e(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`:t?d.riderStatsTab==="skills"?`
      ${Be(e,t,s,r,n)}
      ${_e(t)}
      ${Bm(e)}`:d.riderStatsTab==="fatigue"?`
      ${Be(e,t,s,r,n)}
      ${_e(t)}
      ${_m(e,t)}`:d.riderStatsTab==="program"?`
      ${Be(e,t,s,r,n)}
      ${_e(t)}
      ${Hm(t)}`:d.riderStatsTab==="form"?`
      ${Be(e,t,s,r,n)}
      ${_e(t)}
      ${Gm(t)}`:d.riderStatsTab==="topResults"?`
      ${Be(e,t,s,r,n)}
      ${_e(t)}
      ${Ym(t)}`:d.riderStatsTab==="career"?`
      ${Be(e,t,s,r,n)}
      ${_e(t)}
      ${Zm(t)}`:t.seasons.length===0?`
      ${Be(e,t,s,r,n)}
      ${_e(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`:`
    ${Be(e,t,s,r,n)}
    ${_e(t)}
    ${i.map(l=>`
      <section class="rider-stats-season">
        <div class="rider-stats-season-head">
          <h3>Saison ${l.season}</h3>
          <span>${l.raceBlocks.length} Rennen</span>
        </div>
        <div class="rider-stats-race-list">
          ${l.raceBlocks.map(g=>`
            <section class="rider-stats-race-block">
              <div class="rider-stats-race-head">
                <div>
                  <h4>${S(g.raceName)}</h4>
                  <p>${S(Pm(g))}</p>
                </div>
                ${Oa(g.raceCategoryName,g.isStageRace,g.rows.filter(m=>m.rowType==="stage_result").length||null)}
              </div>
              <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
                <table class="data-table rider-stats-table">
                  <colgroup>
                    <col style="width: 8%;">
                    <col style="width: 3.5%;">
                    <col style="width: 3.5%;">
                    <col style="width: 2.5%;">
                    <col style="width: 3.5%;">
                    <col style="width: 11%;">
                    <col style="width: 23%;">
                    <col style="width: 4%;">
                    <col style="width: 9.5%;">
                    <col style="width: 4.5%;">
                    <col style="width: 4.5%;">
                    <col style="width: 17%;">
                    <col style="width: 5%;">
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Platz</th>
                      <th>GC</th>
                      <th class="rider-stats-breakaway-col"></th>
                      <th>Wetter</th>
                      <th>Klasse</th>
                      <th>Rennen / Etappe</th>
                      <th>Status</th>
                      <th>Profil</th>
                      <th>km</th>
                      <th>HM</th>
                      <th>Ergebnis</th>
                      <th>Punkte</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${g.rows.map(m=>{const u=m.rowType!=="stage_result",p=u?`${m.raceName} · ${tr(m.rowType)}`:m.stageName?`${m.raceName} · ${m.stageName}`:m.raceName;return`
                        <tr class="rider-stats-row${u?" rider-stats-row-final":""}">
                          <td>${S(Q(m.date))}</td>
                          <td>${Om(m)}</td>
                          <td>${jm(m)}</td>
                          <td class="rider-stats-breakaway-col">${Wm(m)}</td>
                          <td>${u?"":Qs(m.rolledWeatherId,m.rolledWetterName)}</td>
                          <td>${u?Nm(m.rowType):Oa(m.raceCategoryName?m.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):m.raceCategoryName,m.isStageRace)}</td>
                          <td>${S(p)}</td>
                          <td>${ar(m)}</td>
                          <td>${u?"–":m.profile?na(m.profile):"–"}</td>
                          <td>${u?"-":m.distanceKm!=null?S(m.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                          <td>${u?"-":m.elevationGainMeters!=null?S(String(Math.round(m.elevationGainMeters))):"–"}</td>
                          <td>${S(Vm(m))}</td>
                          <td>${m.seasonPoints}</td>
                        </tr>`}).join("")}
                  </tbody>
                </table>
              </div>
            </section>`).join("")}
        </div>
      </section>`).join("")}`:`
      ${Be(e,t,s,r,n)}
      ${_e(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`}function Is(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(d.riderStatsTab)?(e.style.minWidth="min(1180px, 95vw)",e.style.maxWidth="1350px"):(e.style.minWidth="",e.style.maxWidth="")}async function qt(e){var c,l,g,m;const t=Me(e),a=(t==null?void 0:t.activeTeamId)!=null?((c=d.teams.find(u=>u.id===t.activeTeamId))==null?void 0:c.name)??null:null;qe=[],Rt=null,d.riderStatsSelectedRiderId=e,d.riderStatsTab="results",Is(),d.riderStatsTopResultsFilterCategory=null,d.riderStatsTopResultsFilterSeason=null,d.riderStatsTopResultsPage=1,h("rider-stats-title").innerHTML=Sn(t,null),h("rider-stats-jersey").innerHTML="";const s=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((l=t.role)==null?void 0:l.name)??"Fahrer"} · ${a??"Team unbekannt"}${s}`:"Historie wird geladen",h("rider-stats-body").innerHTML=Ge(t,null,!0),Ke("riderStats");const r=await G.getRiderStats(e);if(d.riderStatsSelectedRiderId!==e)return;if(!r.success||!r.data){const u=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((g=t.role)==null?void 0:g.name)??"Fahrer"} · ${a??"Team unbekannt"}${u}`:"Fehler beim Laden",h("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${S(r.error??"Unbekannter Fehler")}</p>
      </section>`;return}d.riderStatsPayload=r.data,Is(),h("rider-stats-title").innerHTML=Sn(t,r.data),h("rider-stats-jersey").innerHTML="";const n=r.data.age?` · Alter ${r.data.age}`:t!=null&&t.age?` · Alter ${t.age}`:"",i=r.data.mentorName?` · Mentor: ${r.data.mentorName}`:"",o=r.data.mentoredRiderNames&&r.data.mentoredRiderNames.length>0?` · Mentor von: ${r.data.mentoredRiderNames.join(" - ")}`:"";h("rider-stats-meta").textContent=`${((m=t==null?void 0:t.role)==null?void 0:m.name)??"Fahrer"} · ${r.data.teamName??a??"Ohne aktives Team"}${n} · ${r.data.seasons.length} Saisons${i}${o}`,h("rider-stats-body").innerHTML=Ge(t,r.data,!1)}function Um(){h("rider-stats-body").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-rider-stats-tab]");if(!t){const n=e.target.closest("button[data-remove-compare-id]");if(n){const o=Number(n.dataset.removeCompareId);qe=qe.filter(l=>l.riderId!==o);const c=Me(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Ge(c,d.riderStatsPayload,!1);return}const i=e.target.closest("button[data-top-results-page]");if(i){const o=Number(i.dataset.topResultsPage);if(!isNaN(o)&&o>=1){d.riderStatsTopResultsPage=o;const c=Me(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Ge(c,d.riderStatsPayload,!1)}}return}const a=t.dataset.riderStatsTab;if(a!=="results"&&a!=="program"&&a!=="form"&&a!=="topResults"&&a!=="skills"&&a!=="career"&&a!=="fatigue"||a==="program"&&(((r=d.riderStatsPayload)==null?void 0:r.programRaces.length)??0)===0)return;d.riderStatsTab=a,Is();const s=Me(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Ge(s,d.riderStatsPayload,!1)}),h("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){d.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,d.riderStatsTopResultsPage=1;const a=Me(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Ge(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){d.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),d.riderStatsTopResultsPage=1;const a=Me(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Ge(a,d.riderStatsPayload,!1)}else if(t.classList.contains("rider-stats-filter-checkbox")){const a=t.dataset.filterType;d.riderStatsTopResultsFilters[a]=t.checked,d.riderStatsTopResultsPage=1;const s=Me(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Ge(s,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;Rt=a?Number(a):null;const s=Me(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Ge(s,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const s=Number(a);if(qe.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const r=await G.getRiderStats(s);r.success&&r.data?qe.push({riderId:r.data.riderId,riderName:r.data.riderName,teamId:r.data.teamId,teamName:r.data.teamName,formHistory:r.data.formHistory??[],peakDates:r.data.peakDates??[],currentSeasonPoints:r.data.currentSeasonPoints??0,currentSeasonRank:r.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(r.error??""));const n=Me(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Ge(n,d.riderStatsPayload,!1)}}})}function kn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function Ym(e){const t=[];for(const p of e.seasons)for(const f of p.raceBlocks)for(const y of f.rows)t.push({...y,season:p.season,isStageRace:f.isStageRace});const a=Array.from(new Set(t.map(p=>p.raceCategoryName).filter(Boolean)));a.sort((p,f)=>p.localeCompare(f,"de"));const s=Array.from(new Set(t.map(p=>p.season))).sort((p,f)=>f-p);let r=t.filter(p=>p.rowType!=="stage_result"?p.rowType==="gc_final"?d.riderStatsTopResultsFilters.gc:p.rowType==="mountain_final"?d.riderStatsTopResultsFilters.mountain:p.rowType==="points_final"?d.riderStatsTopResultsFilters.points:p.rowType==="youth_final"?d.riderStatsTopResultsFilters.youth:!0:p.isStageRace?d.riderStatsTopResultsFilters.stage:d.riderStatsTopResultsFilters.oneDay);if(d.riderStatsTopResultsFilterCategory){const p=d.riderStatsTopResultsFilterCategory;if(p.endsWith("-etappen")){const f=p.substring(0,p.length-8);r=r.filter(y=>y.raceCategoryName===f&&y.rowType==="stage_result")}else if(p.endsWith("-gc")){const f=p.substring(0,p.length-3);r=r.filter(y=>y.raceCategoryName===f&&y.rowType!=="stage_result")}else r=r.filter(f=>f.raceCategoryName===p)}d.riderStatsTopResultsFilterSeason!=null&&(r=r.filter(p=>p.season===d.riderStatsTopResultsFilterSeason)),r.sort((p,f)=>{if(f.seasonPoints!==p.seasonPoints)return f.seasonPoints-p.seasonPoints;const y=p.rowType!=="stage_result",b=f.rowType!=="stage_result",v=p.resultRank??9999,M=f.resultRank??9999;if(d.riderStatsTopResultsFilterCategory)return v!==M?v-M:y!==b?y?-1:1:0;{const w=kn(p.raceCategoryName),T=kn(f.raceCategoryName);return w!==T?w-T:y!==b?y?-1:1:v-M}});const n=20,i=Math.max(1,Math.min(10,Math.ceil(r.length/n)));d.riderStatsTopResultsPage>i&&(d.riderStatsTopResultsPage=i);const o=(d.riderStatsTopResultsPage-1)*n,c=r.slice(o,o+n),g=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${a.map(p=>{if(p.toLowerCase().includes("stage race")||p.toLowerCase().includes("grand tour")||p.toLowerCase().includes("tour de france")){const y=`${p}-etappen`,b=`${p}-gc`;return`
        <option value="${S(y)}" ${d.riderStatsTopResultsFilterCategory===y?"selected":""}>${S(p)} - Etappen</option>
        <option value="${S(b)}" ${d.riderStatsTopResultsFilterCategory===b?"selected":""}>${S(p)} - GC</option>
      `}else return`<option value="${S(p)}" ${d.riderStatsTopResultsFilterCategory===p?"selected":""}>${S(p)}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="rider-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${s.map(p=>`<option value="${p}" ${d.riderStatsTopResultsFilterSeason===p?"selected":""}>Saison ${p}</option>`).join("")}
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
  `,m=c.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':c.map(p=>{const f=p.rowType!=="stage_result",y=f?`${p.raceName} · ${tr(p.rowType)}`:p.stageNumber&&p.isStageRace?`${p.raceName} · Etappe ${p.stageNumber}`:p.raceName;let b="–",v="–";p.finishStatus==="otl"?b=kt("OTL","place"):p.finishStatus==="dnf"?b=kt("DNF","place"):p.resultRank==null||(f?v=`<span class="rider-stats-final-type ${Yi(p.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${p.resultRank}</span>`:b=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${p.resultRank<=3?` rider-stats-rank-badge-top-${p.resultRank}`:""}">${S(String(p.resultRank))}</span>`);const M=f?"–":p.profile?na(p.profile):"–",w=!f&&p.stageScore!=null&&p.stageScore>0?Xa(p.stageScore,0,350):"–",T=Oa(p.raceCategoryName?p.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):p.raceCategoryName,p.isStageRace);return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${b}</td>
            <td>${v}</td>
            <td><strong>${S(y)}</strong>${f?"":Qs(p.rolledWeatherId,p.rolledWetterName)}</td>
            <td>${ar(p)}</td>
            <td>${M}</td>
            <td>${w}</td>
            <td>${T}</td>
            <td>Saison ${p.season}</td>
            <td><strong>${p.seasonPoints}</strong></td>
          </tr>
        `}).join(""),u=i>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${d.riderStatsTopResultsPage-1}" ${d.riderStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        ${Array.from({length:i}).map((p,f)=>{const y=f+1;return`<button type="button" class="btn btn-sm ${d.riderStatsTopResultsPage===y?"btn-primary":"btn-secondary"}" data-top-results-page="${y}">${y}</button>`}).join("")}
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${d.riderStatsTopResultsPage+1}" ${d.riderStatsTopResultsPage===i?"disabled":""}>Weiter &raquo;</button>
      </div>
    `:"";return`
    <section class="rider-stats-top-results" style="margin-top: 1.5rem;">
      ${g}
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 5%;">
            <col style="width: 9%;">
            <col style="width: 34%;">
            <col style="width: 5%;">
            <col style="width: 10%;">
            <col style="width: 5%;">
            <col style="width: 18%;">
            <col style="width: 7%;">
            <col style="width: 7%;">
          </colgroup>
          <thead>
            <tr>
              <th>Platz</th>
              <th>GC / Wertung</th>
              <th>Rennen</th>
              <th>Status</th>
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
  `}function Zm(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),s=(n,i,o,c)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let g="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?g+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?g+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?g+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?g+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?g+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?g+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?g+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?g+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(g+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${g}" title="${S(o)}">${n}</span>`},r=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
        ${r.map(n=>{const i=t.categories[n.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(n.name)}">${S(n.name)}</span>
                ${er(n.key)}
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
                    ${s(i.breakawayWins||0,"breakaway","Ausreißerwertung Siege")}
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
                    <!-- Gelbes Trikot (GC) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(i.leaderJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);"}" title="Tage im Gelben Trikot (GC)">
                      🎽 ${i.leaderJerseys||0}
                    </span>
                    <!-- Grünes Trikot (Punkte) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(i.pointsJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #bbf7d0, #4ade80); color: #14532d; border: 1px solid #22c55e; box-shadow: 0 0 4px rgba(74, 222, 128, 0.4);"}" title="Tage im Grünen Trikot (Punkte)">
                      🎽 ${i.pointsJerseys||0}
                    </span>
                    <!-- Rotes Trikot (Berg) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(i.mountainJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #fecaca, #f87171); color: #7f1d1d; border: 1px solid #ef4444; box-shadow: 0 0 4px rgba(248, 113, 113, 0.4);"}" title="Tage im Berg- / Roten Trikot (Berg)">
                      🎽 ${i.mountainJerseys||0}
                    </span>
                    <!-- Weißes Trikot (Nachwuchs) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(i.youthJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #ffffff, #e2e8f0); color: #1e293b; border: 1px solid #94a3b8; box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);"}" title="Tage im Weißen Trikot (Nachwuchs)">
                      🎽 ${i.youthJerseys||0}
                    </span>
                    <!-- Lila Trikot (Aktivste Fahrer) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(i.breakawayJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #f3e8ff, #d8b4fe); color: #581c87; border: 1px solid #a855f7; box-shadow: 0 0 4px rgba(168, 85, 247, 0.4);"}" title="Tage im Lila Trikot (Aktivste Fahrer)">
                      🎽 ${i.breakawayJerseys||0}
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

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${fe(i.winWeather1||0,1,"Sonnig")}
                  ${fe(i.winWeather2||0,2,"Extreme Hitze")}
                  ${fe(i.winWeather3||0,3,"Leichter Regen")}
                  ${fe(i.winWeather4||0,4,"Starkregen")}
                  ${fe(i.winWeather5||0,5,"Starker Wind")}
                  ${fe(i.winWeather6||0,6,"Dichter Nebel")}
                  ${fe(i.winWeather7||0,7,"Schnee/Eis")}
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
  `}const Jm=250,xt=1200,qm=250,Xm=1200,$n=.2;class Qm{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",s=>{var i,o,c,l;const r=s.target.closest("button[data-race-sim-action]");if(r){if(r.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const m=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;m&&((l=(c=this.options).onFinishRequested)==null||l.call(c,m,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=s.target.closest("button[data-race-sim-speed]");if(n){const g=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(g))return;this.timeMultiplier=g,this.render()}}),this.elements.messages.addEventListener("click",s=>{const r=s.target.closest("button[data-race-sim-group-rider-id]");if(r){const c=this.resolveRiderIdFromGroupButton(r);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),qt(c));return}const n=s.target.closest("button[data-race-sim-group-rider-name]");if(n){const c=this.resolveRiderIdFromGroupButton(n);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),qt(c));return}const i=s.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),Jr(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",s=>{const r=s.target.closest("[data-race-sim-overview-summary]");if(r){const n=r.dataset.raceSimOverviewSummary,i=r.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(s)}),this.elements.groupBox.addEventListener("click",s=>{this.handleGroupInteraction(s)}),this.elements.profile.addEventListener("click",s=>{const r=s.target.closest("button[data-race-sim-timing-mode]");if(!r)return;const n=r.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+xt,this.render())})}handleGroupInteraction(t){var g,m;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const u=this.resolveRiderIdFromGroupButton(a);u!=null&&this.selectGroupByRiderId(u,this.detailSnapshot);return}const s=t.target.closest("button[data-race-sim-group-nav]");if(!s)return;const r=this.buildRaceGroups(this.detailSnapshot);if(r.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,r.findIndex(u=>u.label===n)),o=s.dataset.raceSimGroupNav==="prev"?-1:1,c=(i+o+r.length)%r.length,l=((g=r[c])==null?void 0:g.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",u=>{const p=u.target.closest(".race-sim-timing-scroll");p&&(this.timingScrollTop=p.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+xt)}),this.elements.profile.addEventListener("wheel",u=>{const p=u.target.closest(".race-sim-timing-scroll");p&&(this.timingScrollTop=p.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+xt)},{passive:!0}),this.elements.profile.addEventListener("scroll",u=>{const p=u.target;!(p instanceof HTMLElement)||!p.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=p.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+xt)},!0),(m=this.elements.sidebar.parentElement)==null||m.addEventListener("click",u=>{if(!this.bootstrap||!this.detailSnapshot||!iu(this.elements.sidebar,u.target))return;const f=performance.now(),y=mn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(y);const b=performance.now()-f;this.recordPerfTelemetry("sidebarWriteMs",b),this.scheduleSidebarPaintTelemetry(f,b),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new hi(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const s=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(s),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(r=>this.frame(r));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const s=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-s),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(r=>this.frame(r))}render(t=performance.now(),a=!1){var p;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const s=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",r=rl(this.bootstrap.stageSummary),n=[`${r.segmentCount} Segmente`,r.sprintCount>0?`${r.sprintCount} Sprint${r.sprintCount===1?"":"s"}`:null,r.climbCount>0?`${r.climbCount} Bergwertung${r.climbCount===1?"":"en"}`:null].filter(f=>f!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,c=o!=null?i[o]??"":"",l=c?` · ${c}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${s}${n?` · ${n}`:""}${l}`;const g=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=Jm,m=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,u=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=qm;if(g||m||u){const f=performance.now();this.detailSnapshot=((p=this.engine)==null?void 0:p.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-f)}if(g&&this.detailSnapshot){const f=this.elements.profile.querySelector(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop);const y=performance.now();ul(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-y),this.lastProfileRenderTime=t;const b=this.elements.profile.querySelector(".race-sim-timing-scroll");b&&(b.scrollTop=this.timingScrollTop)}if(m&&this.detailSnapshot){this.lastSidebarRenderTime=t;const f=performance.now(),y=mn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(y);const b=performance.now()-f;this.recordPerfTelemetry("sidebarWriteMs",b),this.scheduleSidebarPaintTelemetry(f,b)}u&&this.detailSnapshot&&(Jr(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),jc(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),Hc(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),Zr(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const s=a.find(r=>r.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(s)return s.label}return this.selectedGroupLabel!=null&&a.some(s=>s.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return zs(Hs(t.clusters))}resolveInitialGroupLabel(t){var a,s;return((a=t.find(r=>r.label==="P"))==null?void 0:a.label)??((s=t[0])==null?void 0:s.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(s=>[s.riderId,s]));return[...t.riderIds].sort((s,r)=>{var n,i;return(((n=a.get(s))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(r))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||s-r})[0]??null}selectGroupByLabel(t,a,s=!0){const r=this.buildRaceGroups(a),n=r.find(i=>i.label===t)??r.find(i=>i.label==="P")??r[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),s&&(this.profileInteractionHoldUntilMs=performance.now()+xt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const r=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;r&&(this.selectedGroupLabel=r.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+xt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+Xm,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const s=t.dataset.raceSimGroupRiderName;if(!s)return null;const r=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===s&&(r==null||i.activeTeamId===r))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const s=this.perfTelemetry[t];this.perfTelemetry[t]=s<=0?a:s*(1-$n)+a*$n}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const s=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(s!==this.sidebarPaintSequence)return;const r=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",r),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||Zr(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const ze="__stage_overview__",Ji="__non_finishers__",qi="__events__",Xi="__roster__";let Fe="all";function sr(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function Tn(e){return sr(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function ep(e){return[...e].sort((t,a)=>Tn(t)-Tn(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function tp(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=sr(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function ap(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function sp(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${Q(t.date)}`}async function Es(e,t){var r;const a=Pa(e);if(a&&(d.selectedResultsRaceId=a.race.id,d.selectedResultsStageId=e),d.riders.length===0){const n=await G.getRiders();n.success&&(d.riders=n.data??[])}const s=await G.getStageResults(e);if(!s.success){d.stageResults=null,ye(),!t&&s.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+s.error);return}d.stageResults=s.data??null,d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId,d.selectedResultTypeId=((r=d.stageResults.classifications[0])==null?void 0:r.resultTypeId)??1,d.selectedResultsMarkerKey=ze,d.selectedResultsSpecialView=null),d.selectedResultsRaceId!=null&&Qi(d.selectedResultsRaceId),ye()}async function Qi(e){if(!d.seasonStandings){const a=await G.getSeasonStandings();a.success&&a.data&&(d.seasonStandings=a.data)}const t=await G.getRaceResultsRoster(e);t.success&&t.data?d.resultsRoster=t.data:d.resultsRoster=null}function rp(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function Mn(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function np(){const e=d.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=ot(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,s=[...e.entries].sort((b,v)=>v.overallRating-b.overallRating),r=new Set(s.slice(0,5).map(b=>b.riderId)),n=b=>{var M;const v=d.riders.find(w=>w.id===b);return((M=v==null?void 0:v.skills)==null?void 0:M.sprint)??0},o=[...e.entries.filter(b=>!r.has(b.riderId))].sort((b,v)=>{const M=n(b.riderId),w=n(v.riderId);return w!==M?w-M:v.overallRating-b.overallRating}),c=new Set(o.slice(0,5).map(b=>b.riderId));function l(b){switch(b){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return b}}const g=new Map;for(const b of e.entries){const v=b.teamId;g.has(v)||g.set(v,{teamId:b.teamId,teamName:b.teamName,riders:[],avgRating:0}),g.get(v).riders.push(b)}for(const b of g.values())b.avgRating=b.riders.reduce((v,M)=>v+M.overallRating,0)/b.riders.length;const m=b=>{let v=Number.POSITIVE_INFINITY;for(const M of b)!M.hasDropped&&M.gcRank!=null&&M.gcRank<v&&(v=M.gcRank);return v},u=b=>{var M;if(!((M=d.seasonStandings)!=null&&M.riderStandings))return 0;let v=0;for(const w of b){const T=d.seasonStandings.riderStandings.find($=>$.riderId===w.riderId);T&&T.points>v&&(v=T.points)}return v},p=b=>{if(b==null)return 0;const v=d.riders.filter(T=>T.activeTeamId===b);if(v.length===0)return 0;const M=v.map(T=>T.overallRating??0);M.sort((T,$)=>$-T);const w=M.slice(0,10);return w.length===0?0:w.reduce((T,$)=>T+$,0)/w.length},f=[...g.values()].sort((b,v)=>{const M=m(b.riders),w=m(v.riders);if((M!==Number.POSITIVE_INFINITY||w!==Number.POSITIVE_INFINITY)&&M!==w)return M-w;const T=u(b.riders),$=u(v.riders);if((T>0||$>0)&&T!==$)return $-T;const R=p(b.teamId),E=p(v.teamId);return Math.abs(R-E)>1e-4?E-R:(b.teamName??"").localeCompare(v.teamName??"","de")});for(const b of f)b.riders.sort((v,M)=>Mn(v.roleId)-Mn(M.roleId)||M.overallRating-v.overallRating||v.lastName.localeCompare(M.lastName,"de"));return`<div class="results-roster-grid">${f.map(b=>{const v=b.teamId!=null?yt(b.teamId,b.teamName):"",M=b.riders.map(T=>{var j;const $=rp(T.roleId),R=T.countryCode?rt[T.countryCode]??T.countryCode.slice(0,2).toLowerCase():null,E=R?`<span class="fi fi-${R} results-roster-flag" title="${S(T.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',D=`${T.firstName.charAt(0)}. ${T.lastName}`,F=T.roleName??"–",L=T.specialization1?l(T.specialization1):null,A=T.specialization2?l(T.specialization2):null;let _=F;L&&(_+=` · ${L}`),A&&(_+=` · ${A}`);const B=`<span class="results-roster-overall-badge" style="color:${ip(T.overallRating)}" title="Gesamtstärke: ${T.overallRating.toFixed(2)}">${T.overallRating.toFixed(2)}</span>`,x=T.hasDropped?" dropped":"";let N="";T.hasDropped?T.dropoutStatus==="dns"?N="DNS":T.dropoutStatus==="dnf"?N=((j=T.dropoutReason)==null?void 0:j.startsWith("OTL"))??!1?"OTL":"DNF":N="OUT":T.gcRank!=null&&(N=`${T.gcRank}`);let H="";if(T.hasDropped)H=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${S(T.dropoutReason||"")}">${N}</span>`;else if(T.gcRank!=null){let te="rider-stats-rank-badge-gc";T.gcRank===1?te="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":T.gcRank===2?te="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":T.gcRank===3&&(te="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),H=`<span class="rider-stats-rank-badge ${te}" title="GC Stand: Platz ${T.gcRank}">${T.gcRank}</span>`}const C=`style="color: ${T.hasDropped?"var(--text-500)":$.color}; font-weight: bold;"`,P=r.has(T.riderId),z=c.has(T.riderId);return`<div class="results-roster-rider${x}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${E}
            <span class="results-roster-name${P?" strongest-rider":z?" best-sprinter":""}">
              ${xe(D,{riderId:T.riderId,teamId:T.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${Ia(T.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${C}>${S(_)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${H||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${B}
        </div>
      </div>`}).join(""),w=b.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${v}</div>
        <div class="results-roster-team-name" title="${S(b.teamName??"–")}">${at(b.teamName??"–",b.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${w})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${M}</div>
    </div>`}).join("")}</div>`}function ip(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function op(e){var l,g;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=d.stageResults)==null?void 0:l.classifications.find(m=>m.resultTypeId===1),a=new Set(t?t.rows.map(m=>m.riderId).filter(m=>m!=null):[]),s=d.riders.filter(m=>m.activeTeamId===e.teamId&&a.has(m.id)),r=new Set((((g=d.stageResults)==null?void 0:g.nonFinishers)??[]).map(m=>m.riderId)),n=[];for(const m of s){if(m.id===e.riderId||r.has(m.id))continue;let u=0;const p=m.skills.sprint>=72,f=m.skills.flat>=78,y=m.skills.timeTrial>=76,b=m.skills.acceleration>=80;if(p&&u++,f&&u++,y&&u++,b&&u++,u>0){let v=1;u===2?v=1.25:u===3?v=1.5:u===4&&(v=2),n.push({id:m.id,firstName:m.firstName,lastName:m.lastName,countryCode:m.nationality??null,isSprinter:p,multiplier:v,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const m=n.filter(b=>b.isSprinter).reduce((b,v)=>b+v.multiplier,0),u=n.filter(b=>!b.isSprinter).reduce((b,v)=>b+v.multiplier,0);let p=0,f=0;m>0&&u>0?(p=i/(2.125*m+u),f=2.125*p,p=Math.max(.1,Math.min(.3,p)),f=Math.max(.25,Math.min(.6,f))):m>0?(f=i/m,f=Math.max(.25,Math.min(.6,f)),p=f/2.125):u>0&&(p=i/u,p=Math.max(.1,Math.min(.3,p)),f=2.125*p);for(const b of n)b.contribution=b.isSprinter?f*b.multiplier:p*b.multiplier;const y=n.reduce((b,v)=>b+v.contribution,0);if(y>0){const b=i/y;for(const v of n)v.contribution*=b}n.sort((b,v)=>v.contribution-b.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),c=n.map(m=>{const u=Je(wa(m.id)??m.countryCode),p=m.firstName?`${m.firstName.charAt(0)}. ${m.lastName}`:m.lastName,f=m.contribution.toFixed(2).replace(".",",");return`
      <div class="leadout-bonus-popover-grid">
        <span class="results-flag-col-cell">${u}</span>
        <span class="leadout-bonus-rider-name">${S(p)}</span>
        <strong>+${f}</strong>
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
  `}function xn(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function Ia(e){var m,u,p,f,y,b,v,M,w,T;if(e==null||!d.stageResults)return"";const t=ot(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,s=d.stageResults.classifications,r=(u=(m=s.find($=>$.resultTypeId===xa))==null?void 0:m.rows.find($=>$.rank===1))==null?void 0:u.riderId,n=(f=(p=s.find($=>$.resultTypeId===vs))==null?void 0:p.rows.find($=>$.rank===1))==null?void 0:f.riderId,i=(b=(y=s.find($=>$.resultTypeId===_n))==null?void 0:y.rows.find($=>$.rank===1))==null?void 0:b.riderId,o=(M=(v=s.find($=>$.resultTypeId===5))==null?void 0:v.rows.find($=>$.rank===1))==null?void 0:M.riderId,c=(T=(w=s.find($=>$.resultTypeId===7))==null?void 0:w.rows.find($=>$.rank===1))==null?void 0:T.riderId,l=[],g=d.selectedResultTypeId;return e===r&&(g===xa||g===1&&a||g!==1&&g!==xa)&&l.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&l.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&l.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&l.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===c&&l.push('<span class="jersey-dot jersey-dot-purple" title="Lila Trikot (Aktivste Fahrer)"></span>'),l.length===0?"":`<span class="jersey-dots-wrapper">${l.join("")}</span>`}function wn(e){if(!e)return"";let t=e;const a=[],s=[...d.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of s){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),c=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");c.test(t)&&(t=t.replace(c,l=>{const g=`__RIDER_LINK_${a.length}__`,m=xe(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(m),g}))}let r=S(t);for(let n=0;n<a.length;n++)r=r.replace(`__RIDER_LINK_${n}__`,a[n]);return r}function ye(){var $e,le,ce,pe;d.riders.length===0&&G.getRiders().then(k=>{k.success&&k.data&&(d.riders=k.data,ye())});const e=h("results-race-select"),t=h("results-stage-select"),a=h("results-type-tabs"),s=h("results-marker-tabs"),r=h("results-stage-meta"),n=h("results-empty"),i=h("results-table"),o=i.querySelector("thead tr"),c=h("results-tbody"),l=h("results-marker-classifications"),g=h("results-roster"),m=i.querySelector("colgroup");m&&m.remove(),i.style.tableLayout="",d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+d.races.filter(k=>{var K;return(((K=k.stages)==null?void 0:K.length)??0)>0}).map(k=>`<option value="${k.id}"${k.id===d.selectedResultsRaceId?" selected":""}>${S(k.name)}</option>`).join("");const u=ot(d.selectedResultsRaceId),p=u==null?"":(u.stages??[]).map(k=>`<option value="${k.id}"${k.id===d.selectedResultsStageId?" selected":""}>${S(sp(u,k))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+p;const f=(($e=d.stageResults)==null?void 0:$e.classifications.filter(k=>!(u&&!u.isStageRace&&k.resultTypeId!==1&&k.resultTypeId!==6)))??[],y=f.find(k=>k.resultTypeId===d.selectedResultTypeId)??f[0]??null,b=d.selectedResultsSpecialView==="nonFinishers",v=d.selectedResultsSpecialView==="events",M=d.selectedResultsSpecialView==="roster";if(y&&!b&&!v&&!M&&(d.selectedResultTypeId=y.resultTypeId),v){i.style.tableLayout="fixed";const k=document.createElement("colgroup");k.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(k,i.firstChild)}if(!d.stageResults&&!M||!y&&!b&&!v&&!M){const k=Pa(d.selectedResultsStageId);r.textContent=k?`${k.race.name} · ${k.stage.profile} · ${Q(k.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",s.innerHTML="",s.classList.add("hidden"),c.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),g.innerHTML="",g.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=d.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}M?d.resultsRoster&&(r.textContent=`${d.resultsRoster.raceName} · Starterfeld`):d.stageResults&&(r.textContent=`${d.stageResults.raceName} · Etappe ${d.stageResults.stageNumber} · ${d.stageResults.profile} · ${Q(d.stageResults.date)}`);const w=d.stageResults?Pa(d.stageResults.stageId):null,T=(w==null?void 0:w.stage.distanceKm)??null,$=new Map,R=new Map,E=new Map;if(d.stageResults){const k=d.stageResults.classifications.find(K=>K.resultTypeId===1);if(k)for(const K of k.rows)K.riderId!=null&&K.points!=null&&K.points>0&&$.set(K.riderId,K.points),K.riderId!=null&&K.breakawayKms!=null&&K.breakawayKms>0&&E.set(K.riderId,K.breakawayKms);if(d.stageResults.markerClassifications){for(const K of d.stageResults.markerClassifications)if(sr(K.markerType,K.markerCategory)){for(const W of K.entries)if(W.riderId!=null&&W.pointsAwarded!=null&&W.pointsAwarded>0){const V=R.get(W.riderId)??0;R.set(W.riderId,V+W.pointsAwarded)}}}}const D=(y==null?void 0:y.resultTypeId)===xa,F=(y==null?void 0:y.resultTypeId)===vs||(y==null?void 0:y.resultTypeId)===_n,L=(y==null?void 0:y.resultTypeId)===5,A=(y==null?void 0:y.resultTypeId)===6,_=(y==null?void 0:y.resultTypeId)===7,B=D||F||L||A||_,x=f.map(k=>`
    <button
      type="button"
      class="results-type-btn${!b&&!v&&!M&&k.resultTypeId===d.selectedResultTypeId?" active":""}"
      data-result-type-id="${k.resultTypeId}"
    >${S(k.resultTypeName)}</button>
  `),N=`
    <button
      type="button"
      class="results-type-btn${b?" active":""}"
      data-results-special-view="${Ji}"
    >OTL/DNF</button>
  `,H=`
    <button
      type="button"
      class="results-type-btn${v?" active":""}"
      data-results-special-view="${qi}"
    >Ereignisse</button>
  `,I=`
    <button
      type="button"
      class="results-type-btn${M?" active":""}"
      data-results-special-view="${Xi}"
    >Teilnehmer</button>
  `,C=f.findIndex(k=>k.resultTypeName.toLocaleLowerCase("de").includes("team"));C>=0?x.splice(C+1,0,N,H,I):x.push(N,H,I),a.innerHTML=x.join("");const P=ep(((le=d.stageResults)==null?void 0:le.markerClassifications)??[]);if(M){g.innerHTML=np(),g.classList.remove("hidden"),i.classList.add("hidden"),s.innerHTML="",s.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else g.innerHTML="",g.classList.add("hidden");const z=!b&&!v&&!M&&(y==null?void 0:y.resultTypeId)===1&&P.length>0,Z=z?d.selectedResultsMarkerKey??ze:null,j=z&&Z!==ze?P.find(k=>k.markerKey===Z)??null:null;if(z&&(d.selectedResultsMarkerKey=(j==null?void 0:j.markerKey)??ze),v){const k=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"}];s.innerHTML=k.map(K=>`
      <button
        type="button"
        class="results-type-btn${K.key===Fe?" active":""}"
        data-event-filter="${K.key}"
      >${S(K.label)}</button>
    `).join("")}else s.innerHTML=z?[`
        <button
          type="button"
          class="results-type-btn${d.selectedResultsMarkerKey===ze?" active":""}"
          data-marker-key="${ze}"
        >Tageswertung</button>`,...P.map(k=>`
        <button
          type="button"
          class="results-type-btn${k.markerKey===d.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${k.markerKey}"
        >${S(tp(k))}</button>
      `)].join(""):"";s.classList.toggle("hidden",!v&&!z);const te=b||v||!z||d.selectedResultsMarkerKey===ze;if(o&&te&&(o.innerHTML=b?`
        <th>Etappe</th>
        <th>Status</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Grund</th>
      `:v?`
        <th>km Marke</th>
        <th>Fahrer</th>
        <th>Ereignis</th>
      `:D?`
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
      `:F?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Punkte</th>
          <th>UCI Punkte</th>
        `:_?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Kilometer</th>
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
        ${B?"<th>Trend</th>":""}
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
        <th class="results-points-cell">Punktewertung</th>
        <th>UCI Punkte</th>
      `),c.innerHTML=b?(((ce=d.stageResults)==null?void 0:ce.nonFinishers)??[]).map(k=>`
      <tr>
        <td>${k.stageNumber}</td>
        <td>${Bo(k.isOtl)}</td>
        <td class="results-jersey-col-cell">${_t(k.teamId,k.teamName)}</td>
        <td>${Gt(k.riderName,!0,!1,k.riderId,k.teamId)}</td>
        <td class="results-flag-col-cell">${Je(k.countryCode)}</td>
        <td>${at(k.teamName||"–",k.teamId)}</td>
        <td>${S(Ss(k.statusReason,k.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':v?[...((pe=d.stageResults)==null?void 0:pe.events)??[]].filter(k=>Fe==="all"?!0:Fe==="form"?!!(k.title&&(k.title.includes("guten Tag")||k.title.includes("schlechten Tag")||k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))):Fe==="attack"?(k.type==="attack"||k.type==="counter_attack")&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Fe==="breakaway"?!!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Fe==="incident"?(k.type==="incident"||!!(k.title&&k.title.includes("Massensturz")))&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Fe==="exit"?k.type==="dnf"||!!(k.title&&k.title.includes("nicht am Start")):Fe==="home"?!!(k.title&&(k.title.includes("Heimvorteil")||k.title.includes("Heimdruck"))):Fe==="weather"?!!(k.title&&k.title.startsWith("Wetterbericht:")):!0).sort((k,K)=>{const W=k.kmMark??0,V=K.kmMark??0;if(Math.abs(W-V)>1e-4)return W-V;if(W===0){const Ae=xn(k),Ee=xn(K);if(Ae!==Ee)return Ae-Ee}const Te=k.riderName??"",De=K.riderName??"";return Te.localeCompare(De,"de")}).map(k=>{var At,Sr,kr;const K=k.kmMark!=null?`${k.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",W=k.riderId,V=W!=null?Me(W):null,Te=k.riderTeamId??(V==null?void 0:V.activeTeamId)??null,De=Te!=null?((At=d.teams.find(oa=>oa.id===Te))==null?void 0:At.name)??null:null;let Ae=_t(Te,De);const Ee=!!(k.title&&k.title.startsWith("Wetterbericht:"));let ct=k.title||"";if(Ee){const oa=(Sr=d.stageResults)==null?void 0:Sr.rolledWeatherId,ss=(kr=d.stageResults)==null?void 0:kr.rolledWetterName;Ae=`<span class="results-jersey-cell">${Qs(oa,ss)}</span>`,ss&&(ct=`Wetterbericht: ${ss}`)}const ia=Ee?"":Je(W!=null?wa(W):null),Ue=Ee?"":W!=null?Gt(k.riderName??"",!0,!1,W,Te):S(k.riderName||"–");let ne="";return k.title&&k.title.includes("guten Tag")?ne='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':k.title&&k.title.includes("schlechten Tag")?ne='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':k.title&&(k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))?ne='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':k.title&&k.title.includes("nicht am Start")?ne='<span class="event-badge event-badge-dns">DNS</span>':k.title&&k.title.includes("Massensturz")?ne='<span class="event-badge event-badge-masscrash">Massensturz</span>':k.type==="dnf"?ne='<span class="event-badge event-badge-dnf">DNF</span>':k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))?ne='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':k.type==="attack"?ne='<span class="event-badge event-badge-attack">Attacke</span>':k.type==="counter_attack"?ne='<span class="event-badge event-badge-counter">Konterattacke</span>':k.type==="incident"?k.title&&(k.title.toLowerCase().includes("defekt")||k.title.toLowerCase().includes("panne")||k.title.toLowerCase().includes("technisch"))?ne='<span class="event-badge event-badge-defect">Defekt</span>':ne='<span class="event-badge event-badge-crash">Sturz</span>':k.title&&k.title.includes("Super-Heimvorteil")?ne='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Super-Heim</span>':k.title&&k.title.includes("Heimdruck")?ne='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimdruck</span>':k.title&&k.title.includes("Heimvorteil")?ne='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':k.title&&k.title.startsWith("Wetterbericht:")&&(ne='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>'),`
          <tr>
            <td>${K}</td>
            <td>
              <div class="event-rider-info">
                ${Ae}
                ${ia}
                ${Ue}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${wn(ct)}</span>
                  ${ne}
                </div>
                ${k.detail?`<div class="event-detail">${wn(k.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':te&&y?y.rows.map(k=>{const K=k.riderName??k.teamName,W=k.riderName?k.teamName:"–",V=_t(k.teamId,k.teamName),Te=Gt(K,!0,k.isBreakaway===!0,k.riderId,k.teamId),De=Je(wa(k.riderId)),Ae=y.resultTypeId===1&&k.rank===1&&k.timeSeconds!=null&&T!=null,Ee=k.timeSeconds!=null?`${Na(k.timeSeconds)}${Ae?` (${ap(T,k.timeSeconds)})`:""}`:"–",ct=B?`<td class="results-gc-delta-cell">${_o(k.previousRank,k.rankDelta)}</td>`:"";if(F){let Ue=k.points!=null?String(k.points):"–";if(k.points!=null&&k.riderId!=null&&y){const At=y.resultTypeId===vs?$.get(k.riderId)??0:R.get(k.riderId)??0;At>0&&(Ue+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${At}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${ct}
            <td class="results-jersey-col-cell">${V}</td>
            <td>${Te}${Ia(k.riderId)}</td>
            <td class="results-flag-col-cell">${De}</td>
            <td>${at(W,k.teamId)}</td>
            <td class="results-points-cell">${Ue}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(_){let Ue=k.breakawayKms!=null?`${k.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if(k.breakawayKms!=null&&k.riderId!=null){const ne=E.get(k.riderId)??0;ne>0&&(Ue+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${ne.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${ct}
            <td class="results-jersey-col-cell">${V}</td>
            <td>${Te}${Ia(k.riderId)}</td>
            <td class="results-flag-col-cell">${De}</td>
            <td>${at(W,k.teamId)}</td>
            <td class="results-points-cell">${Ue}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(A)return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${ct}
            <td class="results-jersey-col-cell">${V}</td>
            <td>${at(k.teamName,k.teamId)}</td>
            <td class="results-flag-col-cell">${De}</td>
            <td>${Ee}</td>
            <td>${S(rs(k.gapSeconds))}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`;let ia=k.points!=null?String(k.points):"–";if(k.leadoutBonus!=null&&k.leadoutBonus>0&&k.leadoutRiderId!=null){const Ue=op(k);ia=`
          <div class="leadout-bonus-anchor">
            ${k.points!=null?k.points:"–"}
            ${Ue}
          </div>
        `}return`
        <tr>
          <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
          ${ct}
          <td class="results-jersey-col-cell">${V}</td>
          <td>${Te}${Ia(k.riderId)}</td>
          <td class="results-flag-col-cell">${De}</td>
          <td>${at(W,k.teamId)}</td>
          <td>${Ee}</td>
          <td>${S(rs(k.gapSeconds))}</td>
          <td class="results-points-cell">${ia}</td>
          <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
        </tr>`}).join(""):"",n.classList.toggle("hidden",!!y||b||v||M),i.classList.toggle("hidden",!te||M),j){const k=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${S(Go(j.markerType,j.markerLabel))}</h4>
          <div class="results-marker-card-meta">${S(`${j.kmMark.toFixed(1).replace(".",",")} km${j.markerCategory?` · Kat. ${j.markerCategory}`:""}`)}</div>
        </div>
      </section>`,K=j.entries.map(W=>{var Ae;const V=Me(W.riderId),Te=V?`${V.firstName} ${V.lastName}`:`Fahrer ${W.riderId}`,De=(V==null?void 0:V.activeTeamId)!=null?((Ae=d.teams.find(Ee=>Ee.id===V.activeTeamId))==null?void 0:Ae.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${W.rank}.</div>
          <div class="results-marker-jersey">${_t(V==null?void 0:V.activeTeamId,De)}</div>
          <div class="results-marker-name">${Gt(Te,!1,!1,(V==null?void 0:V.id)??null,(V==null?void 0:V.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${Je(wa(V==null?void 0:V.id))}</div>
          <div class="results-marker-time">${S(Na(W.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${S(rs(W.gapSeconds))}</div>
          <div class="results-marker-points">${W.pointsAwarded!=null&&W.pointsAwarded>0?W.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${k}<div class="results-marker-list">${K}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!j)}function lp(){h("results-race-select").addEventListener("change",e=>{var s,r;const t=e.target.value;d.selectedResultsRaceId=t?Number(t):null;const a=ot(d.selectedResultsRaceId);d.selectedResultsStageId=((r=(s=a==null?void 0:a.stages)==null?void 0:s[0])==null?void 0:r.id)??null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=ze,d.selectedResultsSpecialView=null,d.stageResults=null,ye(),d.selectedResultsStageId!=null&&Es(d.selectedResultsStageId,!0)}),h("results-stage-select").addEventListener("change",e=>{const t=e.target.value;d.selectedResultsStageId=t?Number(t):null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=ze,d.selectedResultsSpecialView=null,d.stageResults=null,ye(),d.selectedResultsStageId!=null&&Es(d.selectedResultsStageId,!0)}),h("results-type-tabs").addEventListener("click",e=>{var s;const t=e.target.closest("button[data-result-type-id]");if(t){d.selectedResultsSpecialView=null,d.selectedResultTypeId=Number(t.dataset.resultTypeId),ye();return}const a=e.target.closest("button[data-results-special-view]");if(a){const r=a.dataset.resultsSpecialView;r===Ji?(d.selectedResultsSpecialView="nonFinishers",ye()):r===qi?(d.selectedResultsSpecialView="events",Fe="all",ye()):r===Xi&&(d.selectedResultsSpecialView="roster",d.selectedResultsRaceId!=null&&((s=d.resultsRoster)==null?void 0:s.raceId)!==d.selectedResultsRaceId&&Qi(d.selectedResultsRaceId).then(()=>ye()),ye())}}),h("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const s=t.dataset.markerKey;d.selectedResultsMarkerKey=s??ze,ye();return}const a=e.target.closest("button[data-event-filter]");a&&(Fe=a.dataset.eventFilter??"all",ye())})}const rr=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],sa=["skills","form","profile","preferences"],nr=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],ir={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...rr.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function or(){return[...nr,...ir[d.teamDetailPage]]}function eo(e,t=12){const a=d.riders.filter(r=>r.activeTeamId===e).sort((r,n)=>n.overallRating-r.overallRating).slice(0,t);return a.length===0?null:a.reduce((r,n)=>r+n.overallRating,0)/a.length}function to(e){const t=d.riders.filter(s=>s.activeTeamId===e);return t.length===0?null:t.reduce((s,r)=>s+r.overallRating,0)/t.length}function ao(e){const t=eo(e);return t==null?"–":t.toFixed(1).replace(".",",")}function so(e){const t=to(e);return t==null?"–":t.toFixed(1).replace(".",",")}function X(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function ve(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:X(e,t)}function ue(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function Se(e){return e==null?void 0:typeof e=="string"?Wt(e):e.name}function lr(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...rr.map(t=>t.key)].includes(e)?"desc":"asc"}function ro(e){return d.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function no(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${ro(e.sortKey)}
      </button>
    </th>`}function io(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${sa.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const oo={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function dr(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":oo[e]??String(e)}function lo(e){const t=[...e],a=d.teamTableSort.direction==="asc"?1:-1;return t.sort((s,r)=>{let n=0;switch(d.teamTableSort.key){case"name":n=X(s.lastName,r.lastName)||X(s.firstName,r.firstName);break;case"countryCode":n=X(vt(s),vt(r));break;case"birthYear":n=s.birthYear-r.birthYear;break;case"age":n=(s.age??0)-(r.age??0);break;case"overallRating":n=s.overallRating-r.overallRating;break;case"potOverall":n=(s.potential??0)-(r.potential??0);break;case"formBonus":n=(s.formBonus??0)-(r.formBonus??0);break;case"raceFormBonus":n=(s.raceFormBonus??0)-(r.raceFormBonus??0);break;case"longTermFatigueMalus":n=(s.longTermFatigueMalus??0)-(r.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(s.shortTermFatigueMalus??0)-(r.shortTermFatigueMalus??0);break;case"seasonPoints":n=(s.seasonPoints??0)-(r.seasonPoints??0);break;case"seasonRaceDays":n=(s.seasonRaceDays??0)-(r.seasonRaceDays??0);break;case"seasonWins":n=(s.seasonWins??0)-(r.seasonWins??0);break;case"contractEndSeason":n=(s.contractEndSeason??Number.MAX_SAFE_INTEGER)-(r.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=X(s.seasonFormPhase??"neutral",r.seasonFormPhase??"neutral");break;case"roleName":n=X(it(s),it(r));break;case"riderType":n=X(s.riderType,r.riderType)||X(we(s),we(r));break;case"skillDevelopment":n=(s.skillDevelopment??0)-(r.skillDevelopment??0);break;case"specialization1":n=ve(Se(s.specialization1),Se(r.specialization1));break;case"specialization2":n=ve(Se(s.specialization2),Se(r.specialization2));break;case"specialization3":n=ve(Se(s.specialization3),Se(r.specialization3));break;case"peak1":n=ve(ue(s,0),ue(r,0));break;case"peak2":n=ve(ue(s,1),ue(r,1));break;case"peak3":n=ve(ue(s,2),ue(r,2));break;default:n=s.skills[d.teamTableSort.key]-r.skills[d.teamTableSort.key];break}return n===0&&(n=X(s.lastName,r.lastName)||X(s.firstName,r.firstName)),n*a}),t}function co(e){const t=[...e],a=d.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((s,r)=>{let n=0;switch(d.riderMenuTableSort.key){case"name":n=X(s.lastName,r.lastName)||X(s.firstName,r.firstName);break;case"countryCode":n=X(vt(s),vt(r));break;case"birthYear":n=s.birthYear-r.birthYear;break;case"age":n=(s.age??0)-(r.age??0);break;case"overallRating":n=s.overallRating-r.overallRating;break;case"potOverall":n=(s.potential??0)-(r.potential??0);break;case"formBonus":n=(s.formBonus??0)-(r.formBonus??0);break;case"raceFormBonus":n=(s.raceFormBonus??0)-(r.raceFormBonus??0);break;case"longTermFatigueMalus":n=(s.longTermFatigueMalus??0)-(r.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(s.shortTermFatigueMalus??0)-(r.shortTermFatigueMalus??0);break;case"seasonPoints":n=(s.seasonPoints??0)-(r.seasonPoints??0);break;case"seasonRaceDays":n=(s.seasonRaceDays??0)-(r.seasonRaceDays??0);break;case"seasonWins":n=(s.seasonWins??0)-(r.seasonWins??0);break;case"contractEndSeason":n=(s.contractEndSeason??Number.MAX_SAFE_INTEGER)-(r.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=X(s.seasonFormPhase??"neutral",r.seasonFormPhase??"neutral");break;case"roleName":n=X(it(s),it(r));break;case"riderType":n=X(s.riderType,r.riderType)||X(we(s),we(r));break;case"skillDevelopment":n=(s.skillDevelopment??0)-(r.skillDevelopment??0);break;case"specialization1":n=ve(Se(s.specialization1),Se(r.specialization1));break;case"specialization2":n=ve(Se(s.specialization2),Se(r.specialization2));break;case"specialization3":n=ve(Se(s.specialization3),Se(r.specialization3));break;case"peak1":n=ve(ue(s,0),ue(r,0));break;case"peak2":n=ve(ue(s,1),ue(r,1));break;case"peak3":n=ve(ue(s,2),ue(r,2));break;default:n=s.skills[d.riderMenuTableSort.key]-r.skills[d.riderMenuTableSort.key];break}return n===0&&(n=X(s.lastName,r.lastName)||X(s.firstName,r.firstName)),n*a}),t}function Fs(e){return e.length===0?"–":e.map(t=>{const a=d.races.find(s=>s.id===t);return a?S(a.name):`Rennen ${t}`}).join(", ")}function dp(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function cr(e,t){var a,s;switch(t.id){case"name":return`<td class="team-table-name-cell">${xe(we(e),{riderId:e.id,teamId:e.activeTeamId,strong:d.teamDetailPage==="form"||d.teamDetailPage==="profile"||d.teamDetailPage==="preferences"})}${Vo(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${re(vt(e))}<span>${S(vt(e))}</span></span></td>`;case"age":return`<td>${e.age??(d.gameState?d.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${S(it(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${wr(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${Oo(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${wr((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${Rr(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${Rr(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${Wn(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${S(ue(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${S(ue(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${S(ue(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${S(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?S(Wt(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?S(Wt(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?S(Wt(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${jo(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${re(e.mentorCountryCode??"UNK")} <span>${S(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${Fs(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${Fs(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const r=t.sortKey;return r&&r in e.skills?`<td>${Wo(e.skills[r],(a=e.yearStartSkills)==null?void 0:a[r],(s=e.potentials)==null?void 0:s[r])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function Va(){be("Teams/Fahrer werden aktualisiert...");try{const e=await G.getRiders();if(e.success&&(d.riders=e.data??[]),await G.getTeams().then(t=>{t.success&&(d.teams=t.data??[])}),he("teams")&&ur(),he("riders")){const{renderRidersMenu:t}=await jn(async()=>{const{renderRidersMenu:a}=await Promise.resolve().then(()=>Dp);return{renderRidersMenu:a}},void 0);t()}}finally{me()}}async function cp(e={}){const t=await G.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),h("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${S(t.error??"Unbekannt")}</p>`;return}d.teams=t.data??[],e.render!==!1&&he("teams")&&ur()}function ur(){const e=h("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+d.teams.map(s=>`<option value="${s.id}"${String(s.id)===t?" selected":""}>${S(s.name)} (${S(s.division??s.divisionName??"")}) · ${S(s.abbreviation)}</option>`).join("");const a=t?Number(t):null;Vt(a)}function Vt(e){const t=h("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=d.teams.find(i=>i.id===e);if(!a){t.innerHTML="";return}const s=lo(d.riders.filter(i=>i.activeTeamId===e)),r=a.division==="U23"?"badge-u23":"badge-classics",n=or();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${S(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${r}">${S(a.division??a.divisionName??"")}</span>
          <span>${Ho(a.country,a.countryCode)}</span>
          <span>Kürzel: ${S(a.abbreviation)} · Top 12 ${S(ao(a.id))} (${S(so(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${s.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(dr(d.teamTableSort.key))} ${d.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${io()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${n.map(no).join("")}
          </tr></thead>
          <tbody>
            ${s.length===0?`<tr><td colspan="${n.length}" class="text-muted">Keine Fahrer.</td></tr>`:s.map(i=>`
                <tr class="team-detail-row">
                  ${n.map(o=>cr(i,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function uo(){h("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;d.teamDetailPage="skills",Vt(t?Number(t):null)}),h("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const r=Number(t.dataset.riderProgramId);Number.isFinite(r)&&fr(r);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const r=a.dataset.teamDetailPage;if(sa.includes(r)){d.teamDetailPage=r,new Set(or().map(o=>o.sortKey).filter(o=>o!=null)).has(d.teamTableSort.key)||(d.teamTableSort={key:"name",direction:"asc"});const i=Number(h("teams-dropdown").value);Vt(Number.isFinite(i)?i:null)}return}const s=e.target.closest("button[data-team-sort]");if(s){const r=s.dataset.teamSort;d.teamTableSort.key===r?d.teamTableSort.direction=d.teamTableSort.direction==="asc"?"desc":"asc":d.teamTableSort={key:r,direction:lr(r)};const n=Number(h("teams-dropdown").value);Vt(Number.isFinite(n)?n:null);return}})}const up=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:ir,TEAM_DETAIL_PAGE_ORDER:sa,TEAM_SKILL_COLUMNS:rr,TEAM_SKILL_TITLES:oo,TEAM_TABLE_COLUMNS:nr,compareOptionalStrings:ve,compareStrings:X,formatTeamAverage:so,formatTeamTopAverage:ao,getActiveTeamTableColumns:or,getDefaultTeamSortDirection:lr,getPeakDate:ue,getSortIndicator:ro,getSpecializationSortLabel:Se,getTeamAverage:to,getTeamSortLabel:dr,getTeamTopAverage:eo,initTeamsListeners:uo,loadTeams:cp,refreshTeamsViewData:Va,renderPeakDatesSummary:dp,renderRacePrefs:Fs,renderTeamDetail:Vt,renderTeamDetailPageTabs:io,renderTeamTableCell:cr,renderTeamTableHeader:no,renderTeams:ur,sortRiderMenuRiders:co,sortTeamRiders:lo},Symbol.toStringTag,{value:"Module"}));function mp(e,t,a){return`${e} · Etappe ${t} · ${a}`}function mo(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function po(e,t){const a=[];for(const s of e.riders)if(s.leadoutBonus!=null&&s.leadoutBonus>0&&s.leadoutContributions&&s.leadoutContributions.length>0){const r=t.riders.find(i=>i.id===s.riderId),n=(r==null?void 0:r.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:s.riderId,leadoutBonus:s.leadoutBonus,contributorsJson:JSON.stringify(s.leadoutContributions)})}return a}async function go(e,t=!1){if(Bn!=null||As)return!1;Tr(e),Ko(0);try{const a=await G.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const s=a.data,r=await Xd(s,o=>Hn(o)),n=mo(r,s),i=po(r,s);return await So(e,n,r.markerClassifications,r.incidents,r.allEvents,t,i),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{Tr(null),me()}}function fo(e){var s;const t=(s=d.rosterEditor)==null?void 0:s.teams.find(r=>r.team.id===e);if(!t)return 0;const a=new Set(d.rosterEditorSelectedRiderIds);return t.riders.filter(r=>a.has(r.rider.id)).length}function ho(){return d.rosterEditor?d.rosterEditor.teams.every(e=>fo(e.team.id)===e.riderLimit):!1}function gs(){const e=h("roster-editor-title"),t=h("roster-editor-meta"),a=h("roster-editor-body"),s=h("btn-apply-roster-editor"),r=d.rosterEditor;if(!r){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',s.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=r.race.isStageRace?`${r.race.name} · Etappe ${r.stage.stageNumber} · ${r.stage.profile}`:`${r.race.name} · ${r.stage.profile}`;const n=new Set(d.rosterEditorSelectedRiderIds);a.innerHTML=r.teams.map(i=>{const o=fo(i.team.id),c=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${S(i.team.name)}</h3>
            <p class="text-muted">${S(i.team.abbreviation)} · ${S(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${c}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var y;const m=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),u=l.rider.country?re(l.rider.country.code3):"",p=[((y=l.rider.role)==null?void 0:y.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),f=l.lockReason?`<span class="roster-editor-rider-lock">${S(l.lockReason)}</span>`:"";return`
              <button
                type="button"
                class="${m}"
                data-roster-team-id="${i.team.id}"
                data-roster-rider-id="${l.rider.id}"
                ${l.isLocked?"disabled":""}
              >
                <span class="roster-editor-rider-name">${u}<span>${S(l.rider.firstName)} ${S(l.rider.lastName)}</span></span>
                <span class="roster-editor-rider-meta">${S(p)}</span>
                ${f}
              </button>`}).join("")}
        </div>
      </section>`}).join(""),s.disabled=!ho()}function Cs(){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],Yt("roster-editor-error"),He("rosterEditor")}function bo(e,t){d.selectedRealtimeStageId=e.stage.id,d.realtimeBootstrap=e,d.realtimeError=null,t&&$t("live-race"),yo().load(e,{autoplay:!0,resetSpeed:!0}),Ct()}function yo(){let e=Kt;if(!e){const t=h("race-sim-layout"),a=h("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new Qm({layout:t,emptyState:a,controlsHeader:h("race-sim-controls-header"),profile:h("race-sim-profile"),groupBox:h("race-sim-group-box"),messages:h("race-sim-messages-body"),favorites:h("race-sim-favorites-body"),sidebar:h("race-sim-sidebar-body"),controls:h("race-sim-controls"),meta:h("race-sim-stage-meta")},{onFinishRequested:(s,r)=>{const n=mo(s,r),i=po(s,r);So(r.stage.id,n,s.markerClassifications,s.incidents,s.allEvents,!1,i)}}),Ao(e)}return e}async function pp(e){be("Starterfeld wird geladen..."),Yt("roster-editor-error");try{const t=await G.getRosterEditor(e);if(!t.success||!t.data){ft("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),Ke("rosterEditor"),gs();return}d.rosterEditor=t.data,d.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(s=>s.isSelected).map(s=>s.rider.id)),gs(),Ke("rosterEditor")}catch(t){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],ft("roster-editor-error",t.message),Ke("rosterEditor"),gs()}finally{me()}}async function gp(){const e=d.rosterEditor;if(e){if(!ho()){ft("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}Yt("roster-editor-error"),be("Starterfeld wird übernommen...");try{const t=await G.applyRosterEditor(e.stage.id,{riderIds:d.rosterEditorSelectedRiderIds});if(!t.success||!t.data){ft("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}Cs(),bo(t.data,!0)}catch(t){ft("roster-editor-error",t.message)}finally{me()}}}function Ct(){var n,i;const e=h("race-sim-stage-select"),t=((n=d.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===d.selectedRealtimeStageId)||(d.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===d.selectedRealtimeStageId?" selected":""}>${S(mp(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const s=t.find(o=>o.stageId===d.selectedRealtimeStageId)??null,r=yo();if(!s){d.realtimeBootstrap=null,d.realtimeError=null,r.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!d.realtimeBootstrap||d.realtimeBootstrap.stage.id!==s.stageId)&&(d.realtimeError?r.clear(d.realtimeError):r.hide())}async function vo(e,t){if(ys!==e){Mr(e),d.selectedRealtimeStageId=e,t&&$t("live-race"),Ct(),be("Live-Simulation wird geladen...");try{const a=await G.getRealtimeSimulation(e);if(!a.success||!a.data){d.realtimeBootstrap=null,d.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",Ct(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}bo(a.data,!1)}catch(a){d.realtimeBootstrap=null,d.realtimeError=a.message,Ct(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{ys===e&&Mr(null),me()}}}async function So(e,t,a,s,r,n=!1,i){if(!As){$r(!0),be("Live-Ergebnis wird gespeichert...");try{const o=await G.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:s,events:r,leadoutContributions:i});if(!o.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(o.error??"Unbekannter Fehler"));return}const c=o.data;d.selectedResultsRaceId=(c==null?void 0:c.raceId)??d.selectedResultsRaceId,d.selectedResultsStageId=(c==null?void 0:c.stageId)??e,d.selectedResultTypeId=1,d.realtimeBootstrap=null,d.realtimeError=null,await Es(e,!1),await pr(),await gr(),await Va(),Ct(),n||$t("results")}catch(o){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+o.message)}finally{$r(!1),me()}}}function fp(){h("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);d.selectedRealtimeStageId=Number.isFinite(t)?t:null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null),d.realtimeError=null,vo(t,!1)})}function mr(e){var s;const t=Xt((s=e.category)==null?void 0:s.name),a=Ya(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function Qa(e){var r,n;const t=Xt((r=e.category)==null?void 0:r.name),a=Ya(t),s=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${S(s)}</span>`}function hp(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(s=>s.date).sort((s,r)=>s.localeCompare(r));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function es(e){const{startDate:t,endDate:a}=hp(e);return t===a?Q(t):`${Q(t)} - ${Q(a)}`}function bp(e){return e.stageId>0}async function pr(){const[e,t]=await Promise.all([G.getGameState(),G.getGameStatus()]);if(!e.success){console.error(e.error);return}d.gameState=e.data??null,d.gameStatus=t.success?t.data??null:null,yp(),he("dashboard")&&ts()}function yp(){var r;if(!d.gameState)return;h("meta-date").textContent=d.gameState.formattedDate,h("meta-season").textContent=`Saison ${d.gameState.season}`;const e=h("meta-race-hint"),t=h("btn-advance-day"),a=h("pending-stages-list"),s=((r=d.gameStatus)==null?void 0:r.pendingStages)??[];s.length>0?(e.textContent=`${s.length} offene Etappe${s.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=s.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${Q(n.date)}`:`${n.profile} · ${Q(n.date)}`,o=bp(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
        <div class="pending-stage-item">
          <div class="pending-stage-meta">
            <div class="pending-stage-title">${S(n.raceName)}</div>
            <div class="pending-stage-subtitle">${S(i)}</div>
          </div>
          <div class="pending-stage-actions">
            ${o}
            <button class="btn btn-secondary btn-sm" data-live-stage="${n.stageId}">Live-Sim</button>
            <button class="btn btn-secondary btn-sm" data-instant-stage="${n.stageId}">Instant</button>
          </div>
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):d.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function ts(){var t,a,s,r,n;const e=d.teams.find(i=>i.isPlayerTeam)??d.teams.find(i=>{var o;return i.name===((o=d.currentSave)==null?void 0:o.teamName)})??null;h("dashboard-career").textContent=((t=d.currentSave)==null?void 0:t.careerName)??"–",h("dashboard-team").textContent=(e==null?void 0:e.name)??((a=d.currentSave)==null?void 0:a.teamName)??"–",h("dashboard-date").textContent=((s=d.gameState)==null?void 0:s.formattedDate)??"–",h("dashboard-season").textContent=d.gameState?`Saison ${d.gameState.season}`:"–",h("dashboard-races-today").textContent=String(((r=d.gameStatus)==null?void 0:r.pendingStages.length)??((n=d.gameState)==null?void 0:n.racesTodayCount)??0),$p()}async function gr(){const e=await G.getRaces();if(!e.success){console.error(e.error);return}d.races=e.data??[],he("dashboard")&&ts(),vp(),Sp()}async function vp(){var n;const e=(n=d.gameState)==null?void 0:n.season;if(!e||d.races.length===0)return;const t=`participantCountsLogged_${e}`;if(localStorage.getItem(t))return;const a=d.races.slice(0,30),s=await Promise.all(a.map(async i=>{var c;const o=await G.getRaceProgramParticipants(i.id);return{race:i,count:o.success?((c=o.data)==null?void 0:c.length)??0:-1}}));if(s.some(i=>i.count>0)){console.group(`[Velo] Teilnehmeranzahl Saison ${e}`);for(const{race:i,count:o}of s)o>=0&&console.log(`${i.name} (${i.startDate}): ${o} Programmfahrer`);console.groupEnd(),localStorage.setItem(t,"1")}}async function Sp(){var i;const e=(i=d.gameState)==null?void 0:i.season;if(!e)return;const t=`programAssignmentsLogged_${e}`;if(localStorage.getItem(t))return;const a=await G.getRiders();if(!a.success||!a.data)return;const s=a.data,r=new Map;for(const o of s)if(o.seasonProgram){const c=o.seasonProgram;r.has(c.id)||r.set(c.id,{name:c.name,riders:[]}),r.get(c.id).riders.push(o)}if(r.size===0)return;console.group(`[Velo] Programmzuweisungen Saison ${e}`);const n=Array.from(r.keys()).sort((o,c)=>o-c);for(const o of n){const c=r.get(o);console.log(`Program: ${o} - ${c.name} (Count: ${c.riders.length})`)}console.groupEnd(),localStorage.setItem(t,"1")}function kp(e,t){const[a,s,r]=e.split("-").map(Number),n=new Date(a,s-1,r);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),c=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${c}`}function Rn(e){var g,m,u,p;const t=d.gameState!=null&&e.startDate<=d.gameState.currentDate&&e.endDate>=d.gameState.currentDate,s=d.gameState!=null&&e.endDate<d.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',r=((g=e.country)==null?void 0:g.name)??`Land ${e.countryId}`,n=(m=e.country)!=null&&m.code3?re(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((f,y)=>f+(y.distanceKm??0),0):((u=e.upcomingStage)==null?void 0:u.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((f,y)=>f+(y.elevationGainMeters??0),0):((p=e.upcomingStage)==null?void 0:p.elevationGainMeters)??null,c=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${Q(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${S(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${mr(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${S(r)}</span></span></td>
      <td>${Qa(e)}</td>
      <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${e.id}">Teilnehmer</button></td>
      <td>${c}</td>
      <td>${l}</td>
      <td>${s}</td>
    </tr>`}function $p(){const e=h("dashboard-races-tbody");if(!d.gameState){e.innerHTML='<tr><td colspan="9" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=d.gameState.currentDate,a=kp(t,7),s=d.races.filter(i=>i.startDate<=t&&i.endDate>=t),r=d.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>In Progress</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=s.map(i=>Rn(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=r.map(i=>Rn(i)).join(""),e.innerHTML=n}function ra(e){return`Etappe ${e.stageNumber}`}function Tp(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,s)=>s[1]!==a[1]?s[1]-a[1]:a[0].localeCompare(s[0])).map(([a,s])=>`${s}x ${a}`).join(" · ")}function Mp(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function na(e){return`<span class="stage-profile-badge ${Mp(e)}">${S(e)}</span>`}function as(e,t){return`${e.name} · ${ra(t)} · ${t.profile}`}async function xp(e){var r;const t=d.stageSummariesByStageId[e];if(t)return t;const a=await G.getStageSummary(e);if(a.success&&a.data)return d.stageSummariesByStageId[e]=a.data,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],a.data;const s=await G.getRealtimeSimulation(e);return s.success&&((r=s.data)!=null&&r.stageSummary)?(d.stageSummariesByStageId[e]=s.data.stageSummary,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],s.data.stageSummary):(d.stageSummaryErrorsByStageId&&(d.stageSummaryErrorsByStageId[e]=a.error??s.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:s.error}),d.stageSummariesByStageId&&delete d.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function wp(){var c;const e=h("race-stages-title"),t=h("race-stages-meta"),a=h("race-stages-body"),s=ot(d.selectedDashboardRaceId);if(!s){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const r=s.stages??[],n=r.reduce((l,g)=>l+(g.distanceKm??0),0),i=r.reduce((l,g)=>l+(g.elevationGainMeters??0),0),o=Tp(r);if(e.textContent=s.name,t.textContent=`${es(s)} · ${((c=s.country)==null?void 0:c.name)??`Land ${s.countryId}`} · ${s.isStageRace?`${s.numberOfStages} Etappen`:"Eintagesrennen"} · ${ks(n)} · ${$s(i)} · ${o}`,r.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
                <td>${Q(l.date)}</td>
                <td><strong>${S(ra(l))}</strong></td>
                <td>${na(l.profile)}</td>
                <td>${l.distanceKm!=null?ks(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?$s(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${S(as(s,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Ns(e){ot(e)&&(d.selectedDashboardRaceId=e,wp(),Ke("raceStages"))}function Rp(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,s;return`
            <tr>
              <td>${es(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?re(t.country.code3):""}<span>${S(((s=t.country)==null?void 0:s.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${S(t.name)}</strong></td>
              <td>${Qa(t)}</td>
              <td>${mr(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function fr(e){const t=d.riders.find(s=>s.id===e);h("rider-program-title").textContent=t?we(t):"Programm",h("rider-program-meta").textContent="Lade Programmrennen ...",h("rider-program-body").innerHTML="",Ke("riderProgram");const a=await G.getRiderProgramRaces(e);if(!a.success||!a.data){h("rider-program-meta").textContent="",h("rider-program-body").innerHTML=`<div class="results-empty">${S(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}h("rider-program-title").textContent=a.data.program.name,h("rider-program-meta").textContent=t?we(t):"",h("rider-program-body").innerHTML=Rp(a.data)}function Ip(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=Ep(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${mt("Team","team","Team")}
          ${mt("Fahrer","rider","Fahrer")}
          ${mt("Spec1","spec1","Spezialisierung 1")}
          ${mt("Rolle","role","Rolle")}
          ${mt("Ges","overall","Gesamtstärke")}
          ${mt("Phase","phase","Formphase")}
          ${mt("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var s,r;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${yt((s=a.team)==null?void 0:s.id,(r=a.team)==null?void 0:r.name)}</td>
              <td><span class="race-participant-rider-cell">${re(vt(a.rider))}<strong>${S(we(a.rider))}</strong></span></td>
              <td>${S(Ps(a.rider))}</td>
              <td>${S(it(a.rider))}</td>
              <td>${Kn(a.rider.overallRating)}</td>
              <td>${Wn(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${S(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function mt(e,t,a){const s=d.raceParticipantsSort.key===t?" race-participants-sort-active":"",r=d.raceParticipantsSort.key===t?d.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${S(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${s}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${d.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${r}</span>
      </button>
    </th>`}function Ep(e){const t=d.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{var n,i,o,c;let r=0;switch(d.raceParticipantsSort.key){case"team":r=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=s.team)==null?void 0:i.name)??"","de");break;case"rider":r=we(a.rider).localeCompare(we(s.rider),"de");break;case"spec1":r=Ps(a.rider).localeCompare(Ps(s.rider),"de");break;case"role":r=it(a.rider).localeCompare(it(s.rider),"de");break;case"overall":r=a.rider.overallRating-s.rider.overallRating;break;case"phase":r=(a.rider.seasonFormPhase??"neutral").localeCompare(s.rider.seasonFormPhase??"neutral","de");break;default:r=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((c=s.program)==null?void 0:c.name)??"","de")}return r*t||we(a.rider).localeCompare(we(s.rider),"de")})}function Ps(e){return e.specialization1!=null?Wt(e.specialization1):"–"}async function ko(e){const t=ot(e);d.selectedRaceParticipantsRaceId=e,h("race-participants-title").textContent=(t==null?void 0:t.name)??"Teilnehmer",h("race-participants-meta").textContent="Lade Programmfahrer ...",h("race-participants-body").innerHTML="",d.raceParticipants=[],Ke("raceParticipants"),await $o()}async function $o(e=!1){const t=d.selectedRaceParticipantsRaceId;if(t==null)return;const a=ot(t);e&&(h("race-participants-meta").textContent="Lade Programmfahrer ...");const s=await G.getRaceProgramParticipants(t);if(!s.success||!s.data){h("race-participants-meta").textContent="",h("race-participants-body").innerHTML=`<div class="results-empty">${S(s.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}d.raceParticipants=s.data,h("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",h("race-participants-meta").textContent=`${s.data.length} Programmfahrer · ${a?es(a):""}`,h("race-participants-body").innerHTML=Ip(d.raceParticipants)}async function Fp(e,t=null){const a=Pa(e);if(!a)return;const s=await xp(e);if(!s){alert(d.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}d.selectedDashboardProfileStageId=e,h("stage-profile-title").textContent=`${a.race.name} · ${ra(a.stage)}`;const r=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";h("stage-profile-meta").textContent=`${Q(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?ks(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?$s(a.stage.elevationGainMeters):"–"}${r}`,cl(h("stage-profile-view"),s,a.stage.profile,as(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),Ke("stageProfile")}function Cp(){h("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const r=Number(t.dataset.editStageRoster);if(!Number.isFinite(r))return;pp(r);return}const a=e.target.closest("button[data-live-stage]");if(a){const r=Number(a.dataset.liveStage);if(!Number.isFinite(r))return;vo(r,!0);return}const s=e.target.closest("button[data-instant-stage]");if(s){const r=Number(s.dataset.instantStage);if(!Number.isFinite(r))return;go(r)}}),h("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-participants-id]");if(t){const r=Number(t.dataset.dashboardRaceParticipantsId);Number.isFinite(r)&&ko(r);return}const a=e.target.closest("button[data-dashboard-race-id]");if(!a)return;const s=Number(a.dataset.dashboardRaceId);Number.isFinite(s)&&Ns(s)}),h("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&Fp(a)}),h("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const r=Number(t.dataset.riderProgramId);Number.isFinite(r)&&fr(r);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const s=a.dataset.raceParticipantsSort;d.raceParticipantsSort.key===s?d.raceParticipantsSort.direction=d.raceParticipantsSort.direction==="asc"?"desc":"asc":d.raceParticipantsSort={key:s,direction:"asc"},$o()}),h("btn-advance-day").addEventListener("click",async()=>{await To()}),h("btn-auto-progress").addEventListener("click",()=>{Np()})}async function To(){be("Tag wird fortgeschrieben...");try{const e=await G.advanceDay();if(!e.success)return alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler")),!1;if(d.currentSave&&e.data&&(d.currentSave.currentSeason=e.data.season),await pr(),await gr(),he("teams")){const{refreshTeamsViewData:t}=await jn(async()=>{const{refreshTeamsViewData:a}=await Promise.resolve().then(()=>up);return{refreshTeamsViewData:a}},void 0);await t()}return!0}catch(e){return alert("Unerwarteter Fehler beim Tageswechsel: "+e.message),!1}finally{me()}}function hr(){const e=document.getElementById("btn-auto-progress");e&&(Qe?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function Np(){Qe?Mo():Pp()}function Pp(){Qe||(Bs(!0),hr(),Lp())}function Mo(){Qe&&(Bs(!1),hr())}async function Lp(){var e;for(;Qe;){const t=((e=d.gameStatus)==null?void 0:e.pendingStages)??[];let a=!1;if(t.length>0){const s=t[0];a=await go(s.stageId,!0)}else a=await To();if(!a){Bs(!1);break}await new Promise(s=>setTimeout(s,100))}hr()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&Qe){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),Mo()}});const Ut=50;function br(){return[...nr,...ir[d.riderMenuDetailPage]]}function xo(e){return d.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function wo(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${xo(e.sortKey)}
      </button>
    </th>`}function Ro(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${sa.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function Ea(){const e=h("riders-detail"),t=br(),a=co(d.riders),s=a.length,r=Math.max(1,Math.ceil(s/Ut));d.riderMenuPage=Math.min(r,Math.max(1,d.riderMenuPage));const n=(d.riderMenuPage-1)*Ut,i=Math.min(s,n+Ut),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${s} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(dr(d.riderMenuTableSort.key))} ${d.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Ro()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(wo).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(c=>`
                <tr class="team-detail-row">
                  ${t.map(l=>cr(c,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${d.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${d.riderMenuPage} / ${r} · Fahrer ${s===0?0:n+1}-${i} von ${s}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${d.riderMenuPage>=r?"disabled":""}>Weiter</button>
      </div>
    </div>`}function Io(){h("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&fr(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;sa.includes(n)&&(d.riderMenuDetailPage=n,new Set(br().map(o=>o.sortKey).filter(o=>o!=null)).has(d.riderMenuTableSort.key)||(d.riderMenuTableSort={key:"name",direction:"asc"}),d.riderMenuPage=1,Ea());return}const s=e.target.closest("button[data-riders-sort]");if(s){const n=s.dataset.ridersSort;d.riderMenuTableSort.key===n?d.riderMenuTableSort.direction=d.riderMenuTableSort.direction==="asc"?"desc":"asc":d.riderMenuTableSort={key:n,direction:lr(n)},d.riderMenuPage=1,Ea();return}const r=e.target.closest("button[data-riders-page-action]");if(r){const n=r.dataset.ridersPageAction,i=Math.max(1,Math.ceil(d.riders.length/Ut));n==="prev"&&(d.riderMenuPage=Math.max(1,d.riderMenuPage-1)),n==="next"&&(d.riderMenuPage=Math.min(i,d.riderMenuPage+1)),Ea();return}})}const Dp=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:Ut,getActiveRiderMenuTableColumns:br,getRiderMenuSortIndicator:xo,initRidersListeners:Io,renderRiderMenuDetailPageTabs:Ro,renderRiderMenuTableHeader:wo,renderRidersMenu:Ea},Symbol.toStringTag,{value:"Module"})),Ta=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function je(e){return e==null?"free-agents":String(e)}function In(e){var a;const t=d.riderTeamEditorPayload;return t?((a=t.teams.find(s=>s.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function Ap(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return zn(t/11.2,0,100)}function Bp(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function _p(e){return d.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function Gp(e){const t=d.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${S(e.title)}"
        aria-label="${S(e.title)}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${_p(e.key)}
      </button>
    </th>`}function Hp(e,t){switch(d.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return X(e.firstName,t.firstName);case"lastName":return X(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return X(In(e.teamId),In(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return X(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return X(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function zp(e){const t=d.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>(Hp(a,s)||X(a.lastName,s.lastName)||X(a.firstName,s.firstName)||a.riderId-s.riderId)*t)}function Kp(e){const t=d.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(s=>je(s.teamId)===t);return zp(a)}function Wp(e){const t=d.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${je(a.teamId)}"${a.teamId===e?" selected":""}>${S(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function Eo(e){return d.riderTeamEditorDirtyRiderIds.includes(e)}function Op(e,t){const a=Eo(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${Gs(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${Wp(e.teamId)}</select></td>`;case"number":{const s=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${s}"></td>`}case"text":{const s=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${S(s)}"></td>`}default:return"<td>–</td>"}}function jp(e){const t=[...e.teams].sort((a,s)=>a.rank-s.rank||X(a.name,s.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${d.riderTeamEditorSelectedTeamKey===je(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${je(a.teamId)}">
              <span class="rider-team-editor-sidebar-main">
                <span>${S(a.name)}</span>
                <span class="text-muted">${S(a.abbreviation)} · ${S(a.divisionName)}</span>
              </span>
              <span class="rider-team-editor-sidebar-stats">
                <strong>${a.riderCount}</strong>
                <span>Ø ${a.averageOverall!=null?a.averageOverall.toFixed(1).replace(".",","):"–"} · #${a.rank}</span>
              </span>
            </button>
          `).join("")}
        </div>
      </div>
    </aside>`}function Ie(){var o;const e=h("rider-team-editor-root"),t=h("rider-team-editor-meta"),a=d.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const s=d.riderTeamEditorSelectedTeamKey?a.teams.find(c=>je(c.teamId)===d.riderTeamEditorSelectedTeamKey)??null:null,r=Kp(a),n=d.riderTeamEditorDirtyRiderIds.length,i=s==null?"Kein Team gewählt":`${s.riderCount} Fahrer · Ø ${s.averageOverall!=null?s.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${s.rank}`;t.textContent=s==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${s.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${d.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(c=>`
                  <option value="${je(c.teamId)}"${d.riderTeamEditorSelectedTeamKey===je(c.teamId)?" selected":""}>${S(c.name)} (${c.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${S(d.riderTeamEditorSort.key==="teamName"?"Team":((o=Ta.find(c=>c.key===d.riderTeamEditorSort.key))==null?void 0:o.title)??d.riderTeamEditorSort.key)} ${d.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${Ta.map(Gp).join("")}
                </tr>
              </thead>
              <tbody>
                ${r.length===0?`<tr><td colspan="${Ta.length}" class="text-muted">${d.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:r.map(c=>`
                    <tr class="team-detail-row${Eo(c.riderId)?" rider-team-editor-row-dirty":""}">
                      ${Ta.map(l=>Op(c,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${jp(a)}
    </div>`}function Vp(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),c=o.length===0?null:Math.round(o.reduce((l,g)=>l+g.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:c,rank:0}}),s=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:s.length,averageOverall:s.length===0?null:Math.round(s.reduce((i,o)=>i+o.overallRating,0)/s.length*100)/100,rank:0,isFreeAgents:!0});const r=[...a].sort((i,o)=>{const c=i.averageOverall??-1;return(o.averageOverall??-1)-c||o.riderCount-i.riderCount||X(i.name,o.name)}),n=new Map(r.map((i,o)=>[je(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(je(i.teamId))??a.length}))}async function Fo(e=!1){if(d.riderTeamEditorPayload&&!e){Ie();return}h("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await G.getRiderTeamEditor();if(!t.success||!t.data){h("rider-team-editor-root").innerHTML=`<div class="results-empty">${S(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}d.riderTeamEditorPayload=t.data,d.riderTeamEditorDirtyRiderIds=[],d.riderTeamEditorSaving=!1,d.riderTeamEditorExporting=!1,d.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(s=>je(s.teamId)===d.riderTeamEditorSelectedTeamKey)||(d.riderTeamEditorSelectedTeamKey="")),Ie()}function Up(e,t,a){const s=d.riderTeamEditorPayload;if(!s)return;const r=s.riders.find(n=>n.riderId===e);r&&(t==="teamId"?r.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof r[t]=="number"?r[t]=Number.parseInt(a||"0",10):r[t]=a,r.overallRating=Ap(r),s.teams=Vp(s),d.riderTeamEditorDirtyRiderIds.includes(e)||(d.riderTeamEditorDirtyRiderIds=[...d.riderTeamEditorDirtyRiderIds,e]),Ie())}async function Yp(){if(!d.riderTeamEditorPayload||d.riderTeamEditorSaving)return;d.riderTeamEditorSaving=!0,Ie();const e=await G.saveRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Ie();return}d.riderTeamEditorPayload=e.data,d.riderTeamEditorDirtyRiderIds=[],Ie()}async function Zp(){if(!d.riderTeamEditorPayload||d.riderTeamEditorExporting)return;d.riderTeamEditorExporting=!0,Ie();const e=await G.exportRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Ie();return}Ts(e.data.fileName,e.data.content),Ie()}function Jp(){h("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const r=t.dataset.riderTeamEditorSort;d.riderTeamEditorSort.key===r?d.riderTeamEditorSort.direction=d.riderTeamEditorSort.direction==="asc"?"desc":"asc":d.riderTeamEditorSort={key:r,direction:Bp(r)},Ie();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){d.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Ie();return}const s=e.target.closest("button[data-rider-team-editor-action]");if(s){const r=s.dataset.riderTeamEditorAction;if(r==="reload"){Fo(!0);return}if(r==="export"){Zp();return}r==="save"&&Yp()}}),h("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){d.riderTeamEditorSelectedTeamKey=t.value,Ie();return}const a=e.target.closest(".rider-team-editor-input");if(a){const s=Number(a.dataset.riderTeamEditorRiderId),r=a.dataset.riderTeamEditorField;Number.isFinite(s)&&r&&Up(s,r,a.value)}})}let Ze={key:"pickNumber",asc:!0};function En(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),s=.26+t*.18,r=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${s};--rider-stats-pill-bg-alpha:${r};`}async function Co(e,t=!1){const a=await G.getDraftHistory(e);if(!a.success){d.draftHistory=null,he("draft")&&Ls(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}d.draftHistory=a.data??null,he("draft")&&Ls()}function Ls(){const e=h("draft-table-container"),t=h("draft-season-select");if(!d.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const i=d.currentSave.startSeason??2026;for(let o=d.currentSave.currentSeason;o>=i;o--){const c=document.createElement("option");c.value=o.toString(),c.textContent=`Saison ${o}`,t.appendChild(c)}d.draftSelectedSeason||(d.draftSelectedSeason=d.currentSave.currentSeason),t.value=d.draftSelectedSeason.toString(),t.onchange=o=>{const c=o.target;d.draftSelectedSeason=parseInt(c.value,10),Co(d.draftSelectedSeason)}}if(!d.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(d.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...d.draftHistory.rows].sort((i,o)=>{let c=0;const l=Ze.key;return l==="riderLastName"?c=i.riderLastName.localeCompare(o.riderLastName):l==="teamName"?c=i.teamName.localeCompare(o.teamName):l==="oldTeamName"?c=(i.oldTeamName||"").localeCompare(o.oldTeamName||""):l==="countryCode"?c=i.countryCode.localeCompare(o.countryCode):c=(i[l]??0)-(o[l]??0),Ze.asc?c:-c}),s=i=>Ze.key!==i?'<span class="sort-icon-placeholder"></span>':Ze.asc?" ▲":" ▼",r=i=>{Ze.key===i?Ze.asc=!Ze.asc:(Ze.key=i,Ze.asc=!0),Ls()};window.setDraftSort=r;let n=`
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
  `;for(const i of a){const o=d.draftHistory.season-i.riderBirthYear;let c="-";i.oldTeamName&&(c=`<div style="display:flex; align-items:center; gap:0.5rem;">${yt(i.oldTeamId,i.oldTeamName)} ${S(i.oldTeamName)}</div>`);const l=`<div style="display:flex; align-items:center; gap:0.5rem;">${yt(i.teamId,i.teamName)} ${S(i.teamName)}</div>`;n+=`
      <tr>
        <td class="text-center">#${i.pickNumber}</td>
        <td class="text-center">Runde ${i.draftRound}</td>
        <td>${l}</td>
        <td>${c}</td>
        <td class="text-center">${re(i.countryCode)}</td>
        <td>${S(i.riderFirstName)} ${S(i.riderLastName)}</td>
        <td class="text-center">${o} J.</td>
        <td class="text-center">${i.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${En(i.overallAtDraft)}">${i.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${En(i.potOverallAtDraft)}">${i.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}n+="</tbody></table>",e.innerHTML=n}async function qp(e=!1){const t=await G.getInjuries();if(!t.success){d.injuries=null,he("injuries")&&Fn(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}d.injuries=t.data??[],he("injuries")&&Fn()}function Fn(){const e=h("injuries-table-container");if(!d.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(h("injuries-meta").textContent=d.injuries.length+" Ausfälle",d.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=qt;let t="";const a=d.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),s=new Map;for(const n of a){const i=n.teamId;s.has(i)||s.set(i,[]),s.get(i).push(n)}for(const n of s.keys())s.get(n).sort((i,o)=>o.overallRating-i.overallRating);const r=Array.from(s.keys()).sort((n,i)=>{const o=s.get(n)[0].teamAbbreviation||"",c=s.get(i)[0].teamAbbreviation||"";return o.localeCompare(c)});if(r.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of r){const i=s.get(n),o=i[0].teamAbbreviation;t+=`
        <div style="margin-bottom: 2rem;">
          <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 0.5rem;">
            <img src="/jersey/Jer_${n}.png" style="width: 128px; height: 128px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));" onerror="this.style.display='none'">
            <h3 style="margin: 0; font-size: 1.5rem;">${S(o??"Team "+n)}</h3>
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
      `;for(const c of i){const l=c.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let g="";if(c.fitDate){const m=Q(c.fitDate);if(c.missedRaces&&c.missedRaces.length>0){let u="";for(const p of c.missedRaces)u+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${Q(p.startDate)}</span>
                  ${re(p.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${S(p.name)}</strong>
                  ${er(p.categoryName)}
                </div>
              `;g=`
              <div class="injury-fit-cell">
                <strong>${m}</strong>
                <div class="injury-fit-tooltip">
                  <div style="margin-bottom: 0.4rem; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.2rem;">Verpasste Rennen (${c.missedRaces.length})</div>
                  ${u}
                </div>
              </div>
            `}else g=`<strong>${m}</strong>`}else g="Unbekannt";t+=`
          <tr>
            <td>${re(c.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${c.riderId})" style="color: inherit; text-decoration: none;"><strong>${S(c.riderFirstName)} ${S(c.riderLastName)}</strong></a></td>
            <td>${c.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${Zi(c.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${c.unavailableDays} Tage</strong></td>
            <td>${g}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function Cn(e){return e===0?"–":`-${e}`}function Xp(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${Je(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${xe(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function Qp(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${S(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${Xp(e.topRiders)}
      </div>
    </div>`}function eg(e,t){const a=t.filter(s=>s.teamId!=null&&e.teamId!=null&&s.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${Je(s.countryCode)}</span>
          <span class="season-standings-country-rider-name">${xe(s.riderName??"–",{riderId:s.riderId,teamId:s.teamId,strong:!1})}</span>
          <strong>${s.points}</strong>
        </div>
      `).join("")}
    </div>`}function tg(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${at(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${eg(e,t)}
      </div>
    </div>`}async function ag(e){const t=await G.getSeasonStandings();if(!t.success){d.seasonStandings=null,he("season-standings")&&Ds();return}d.seasonStandings=t.data??null,he("season-standings")&&Ds()}function Ds(){var f,y,b,v,M,w;const e=h("season-standings-meta"),t=h("season-standings-scope-tabs"),a=h("season-standings-empty"),s=h("season-standings-table"),r=h("season-standings-tbody"),n=h("season-standings-jersey-header"),i=h("season-standings-primary-header"),o=h("season-standings-flag-header"),c=h("season-standings-secondary-header"),l=((f=d.seasonStandings)==null?void 0:f.season)??((y=d.gameState)==null?void 0:y.season)??((b=d.currentSave)==null?void 0:b.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.",t.innerHTML=`
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
  `;const g=d.selectedSeasonStandingScope==="countries",m=g?((v=d.seasonStandings)==null?void 0:v.countryStandings)??[]:d.selectedSeasonStandingScope==="teams"?((M=d.seasonStandings)==null?void 0:M.teamStandings)??[]:((w=d.seasonStandings)==null?void 0:w.riderStandings)??[],u=g?m:[],p=g?[]:m;if(n.textContent="Trikot",i.textContent=g?"Land":d.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",c.textContent=d.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",g),c.classList.toggle("hidden",g),!d.seasonStandings||m.length===0){r.innerHTML="",s.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}r.innerHTML=g?u.map(T=>`
      <tr>
        <td class="pos-${Math.min(T.rank,3)}">${T.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${Qp(T)}</td>
        <td class="results-flag-col-cell">${Je(T.countryCode)}</td>
        <td class="hidden"></td>
        <td>${T.points}</td>
        <td>${S(Cn(T.gapPoints))}</td>
      </tr>`).join(""):p.map(T=>{var L;const $=T.riderName??T.teamName,R=_t(T.teamId,T.teamName),E=d.selectedSeasonStandingScope==="teams"?tg(T,((L=d.seasonStandings)==null?void 0:L.riderStandings)??[]):Gt($,!0,!1,T.riderId,T.teamId),D=Je(T.countryCode),F=d.selectedSeasonStandingScope==="teams"?S(T.countryName??T.countryCode??"–"):at(T.teamName??"–",T.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(T.rank,3)}">${T.rank}</td>
          <td class="results-jersey-col-cell">${R}</td>
          <td>${E}</td>
          <td class="results-flag-col-cell">${D}</td>
          <td>${F}</td>
          <td>${T.points}</td>
          <td>${S(Cn(T.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),s.classList.remove("hidden")}function sg(){h("season-standings-scope-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-season-scope]");if(!t)return;const a=t.dataset.seasonScope;a!=="riders"&&a!=="teams"&&a!=="countries"||(d.selectedSeasonStandingScope=a,Ds())})}function Nn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function rg(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,s=[...e].map(l=>({rider:l,score:t(l)})).sort((l,g)=>g.score-l.score).slice(0,10),r=[...e].map(l=>({rider:l,score:a(l)})).sort((l,g)=>g.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,g)=>g.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,g)=>g.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,g)=>g.score-l.score).slice(0,10),c=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,g)=>g.score-l.score).slice(0,10);return{Gesamtklassement:s,Sprinter:r,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:c}}function ng(e,t){const a=d.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const s=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,r=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>s(o)):t==="Sprinter"?n=a.map(o=>r(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,c)=>c-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,c)=>o+c,0)/i.length}function ig(e,t){var i;const s=d.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:ng(o.id,t)}));s.sort((o,c)=>c.avgScore-o.avgScore);const r=s.findIndex(o=>o.teamId===e)+1,n=((i=s.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:r,total:s.length,average:n}}function og(e){const t=d.riders.filter(r=>r.activeTeamId===e);if(t.length===0)return 0;const a=t.map(r=>r.overallRating??0);a.sort((r,n)=>n-r);const s=a.slice(0,10);return s.length===0?0:s.reduce((r,n)=>r+n,0)/s.length}function lg(e){var n;const a=d.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:og(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const s=a.findIndex(i=>i.teamId===e)+1,r=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:s,total:a.length,average:r}}function Ma(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function fs(e){e.countryCode&&re(e.countryCode);const t=rg(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,g)=>g.formValue-l.formValue).slice(0,10),s=[...e.riders].map(l=>({rider:l,uciRank:ja(l.id)})).filter(l=>l.uciRank!==null).sort((l,g)=>l.uciRank-g.uciRank).slice(0,10),r=Object.entries(t).map(([l,g])=>{const m=ig(e.teamId,l),u=m.average.toFixed(1).replace(".",","),p=g.map(({rider:f,score:y})=>{const b=`${f.firstName.charAt(0)}. ${f.lastName}`,v=xe(b,{riderId:f.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),M=f.nationality?rt[f.nationality]??f.nationality.slice(0,2).toLowerCase():null,w=M?`<span class="fi fi-${M} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(f.nationality)}"></span>`:"",T=d.riders.find(R=>R.id===f.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${Ma((T==null?void 0:T.roleId)??null).color};">
            ${w}
            ${v}
          </span>
          <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${y.toFixed(0)}</span>
        </li>
      `}).join("");return`
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
          ${l}
          <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-400); display: block; margin-top: 0.1rem;">Platz ${m.rank}/${m.total} · Ø ${u}</span>
        </h4>
        <ul style="margin: 0; padding: 0; list-style: none;">${p}</ul>
      </div>
    `}).join(""),i=[...e.riders].sort((l,g)=>(g.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const g=`${l.firstName.charAt(0)}. ${l.lastName}`,m=xe(g,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),u=l.nationality?rt[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,p=u?`<span class="fi fi-${u} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",f=l.overallRating.toFixed(0),y=d.riders.find(v=>v.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ma((y==null?void 0:y.roleId)??null).color};">
          ${p}
          ${m}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${f}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:g})=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,u=xe(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),p=l.nationality?rt[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=p?`<span class="fi fi-${p} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",y=(g>=0?"+":"")+g.toFixed(1).replace(".",","),b=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,v=d.riders.find(w=>w.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ma((v==null?void 0:v.roleId)??null).color};">
          ${f}
          ${u}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${b}">${y}</span>
      </li>
    `}).join(""),c=s.map(({rider:l,uciRank:g})=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,u=xe(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),p=l.nationality?rt[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=p?`<span class="fi fi-${p} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"";let y="rider-stats-rank-badge-gc";g===1?y="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":g===2?y="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":g===3&&(y="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const b=`<span class="rider-stats-rank-badge ${y}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${g}">${g}</span>`,v=d.riders.find(w=>w.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ma((v==null?void 0:v.roleId)??null).color};">
          ${f}
          ${u}
        </span>
        ${b}
      </li>
    `}).join("");return`
    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
        ${r}
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; border-top: 1px solid var(--border-primary); padding-top: 0.75rem;">
        <div style="background: rgba(99, 102, 241, 0.02); border: 1px solid rgba(99, 102, 241, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-h);">Die 10 stärksten Fahrer</h4>
          <ul style="margin: 0; padding: 0; list-style: none;">${i||'<li class="text-muted" style="font-size:0.85rem;">Keine Daten vorhanden</li>'}</ul>
        </div>
        <div style="background: rgba(251, 191, 36, 0.02); border: 1px solid rgba(251, 191, 36, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: #fbbf24;">Die 10 formstärksten Fahrer</h4>
          <ul style="margin: 0; padding: 0; list-style: none;">${o||'<li class="text-muted" style="font-size:0.85rem;">Keine Daten vorhanden</li>'}</ul>
        </div>
        <div style="background: rgba(59, 130, 246, 0.02); border: 1px solid rgba(59, 130, 246, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: #3b82f6;">Die 10 besten Fahrer (UCI Weltrangliste)</h4>
          <ul style="margin: 0; padding: 0; list-style: none;">${c||'<li class="text-muted" style="font-size:0.85rem;">Keine Fahrer platziert</li>'}</ul>
        </div>
      </div>
    </div>
  `}function hs(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${d.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${d.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${d.teamStatsTab==="contracts"?"true":"false"}">Auslaufende Verträge</button>
    </div>`}function dg(e){const t=Array.from(new Set(e.topResults.map(u=>u.raceCategoryName).filter(Boolean)));t.sort((u,p)=>u.localeCompare(p,"de"));const a=Array.from(new Set(e.topResults.map(u=>u.season))).sort((u,p)=>p-u);let s=e.topResults.filter(u=>u.rowType!=="stage_result"?u.rowType==="gc_final"?d.teamStatsTopResultsFilters.gc:u.rowType==="mountain_final"?d.teamStatsTopResultsFilters.mountain:u.rowType==="points_final"?d.teamStatsTopResultsFilters.points:u.rowType==="youth_final"?d.teamStatsTopResultsFilters.youth:!0:u.profile==="TTT"||u.isStageRace||u.stageNumber!=null?d.teamStatsTopResultsFilters.stage:d.teamStatsTopResultsFilters.oneDay);if(d.teamStatsTopResultsFilterCategory){const u=d.teamStatsTopResultsFilterCategory;if(u.endsWith("-etappen")){const p=u.substring(0,u.length-8);s=s.filter(f=>f.raceCategoryName===p&&f.rowType==="stage_result")}else if(u.endsWith("-gc")){const p=u.substring(0,u.length-3);s=s.filter(f=>f.raceCategoryName===p&&f.rowType!=="stage_result")}else s=s.filter(p=>p.raceCategoryName===u)}d.teamStatsTopResultsFilterSeason!=null&&(s=s.filter(u=>u.season===d.teamStatsTopResultsFilterSeason)),s.sort((u,p)=>{if(p.seasonPoints!==u.seasonPoints)return p.seasonPoints-u.seasonPoints;const f=u.rowType!=="stage_result",y=p.rowType!=="stage_result",b=u.resultRank??9999,v=p.resultRank??9999;if(d.teamStatsTopResultsFilterCategory)return b!==v?b-v:f!==y?f?-1:1:0;{const M=Nn(u.raceCategoryName),w=Nn(p.raceCategoryName);return M!==w?M-w:f!==y?f?-1:1:b-v}});const r=20,n=Math.max(1,Math.min(10,Math.ceil(s.length/r)));d.teamStatsTopResultsPage>n&&(d.teamStatsTopResultsPage=n);const i=(d.teamStatsTopResultsPage-1)*r,o=s.slice(i,i+r),l=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${t.map(u=>{if(u.toLowerCase().includes("stage race")||u.toLowerCase().includes("grand tour")||u.toLowerCase().includes("tour de france")){const f=`${u}-etappen`,y=`${u}-gc`;return`
        <option value="${S(f)}" ${d.teamStatsTopResultsFilterCategory===f?"selected":""}>${S(u)} - Etappen</option>
        <option value="${S(y)}" ${d.teamStatsTopResultsFilterCategory===y?"selected":""}>${S(u)} - GC</option>
      `}else return`<option value="${S(u)}" ${d.teamStatsTopResultsFilterCategory===u?"selected":""}>${S(u)}</option>`}).join("")}
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
  `,g=o.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(u=>{const p=u.rowType!=="stage_result",f=p?`${u.raceName} · ${u.rowType==="gc_final"?"Gesamtwertung":u.rowType==="points_final"?"Punktewertung":u.rowType==="mountain_final"?"Bergwertung":"Nachwuchs"}`:u.stageNumber?`${u.raceName} · Etappe ${u.stageNumber}`:u.raceName;let y="–",b="–";u.finishStatus==="otl"?y=kt("OTL","place"):u.finishStatus==="dnf"?y=kt("DNF","place"):u.resultRank==null||(p?b=`<span class="rider-stats-final-type ${u.rowType==="gc_final"?"is-gc":u.rowType==="points_final"?"is-points":u.rowType==="mountain_final"?"is-mountain":"is-youth"}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${u.resultRank}</span>`:y=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${u.resultRank<=3?` rider-stats-rank-badge-top-${u.resultRank}`:""}">${S(String(u.resultRank))}</span>`);const v=u.profile?na(u.profile):"–",M=!p&&u.stageScore!=null&&u.stageScore>0?Xa(u.stageScore,0,350):"–",w=Oa(u.raceCategoryName),T=u.riderCountryCode?rt[u.riderCountryCode]??u.riderCountryCode.slice(0,2).toLowerCase():null,$=T?`<span class="fi fi-${T} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(u.riderCountryCode??"")}"></span>`:"–",R=xe(u.riderName,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${p?" rider-stats-row-final":""}">
            <td>${y}</td>
            <td>${b}</td>
            <td>${$}</td>
            <td style="white-space: nowrap;">${R}</td>
            <td><strong>${S(f)}</strong></td>
            <td>${ar(u)}</td>
            <td>${v}</td>
            <td>${M}</td>
            <td>${w}</td>
            <td>Saison ${u.season}</td>
            <td><strong>${u.seasonPoints}</strong></td>
          </tr>
        `}).join(""),m=n>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${d.teamStatsTopResultsPage-1}" ${d.teamStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        ${Array.from({length:n}).map((u,p)=>{const f=p+1;return`<button type="button" class="btn btn-sm ${d.teamStatsTopResultsPage===f?"btn-primary":"btn-secondary"}" data-team-top-results-page="${f}">${f}</button>`}).join("")}
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
            <col style="width: 27%;">
            <col style="width: 5%;">
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
              <th>Status</th>
              <th>Profil</th>
              <th>Score</th>
              <th>Klasse</th>
              <th>Saison</th>
              <th>Punkte</th>
            </tr>
          </thead>
          <tbody>
            ${g}
          </tbody>
        </table>
      </div>
      ${m}
    </section>
  `}function cg(e){const t=String(d.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,categories:{}},s=t==="all",r=m=>s?m:"–",n=(m,u)=>s?`${m} / ${u} T`:"–",i=s?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(m,u,p,f)=>{const y=typeof m=="number"?m:parseFloat(String(m))||0;let b="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return y===0?b+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":u==="gold"?b+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":u==="silver"?b+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":u==="bronze"?b+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":u==="purple"?b+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":u==="green"?b+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":u==="red"?b+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":u==="white"&&(b+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${b}" title="${S(p)}: ${y} Siege">${m}</span>`},c=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
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
  `,g=a.totalGcWins+a.totalStageWins;return`
    <section class="rider-stats-career" style="margin-top: 1.5rem;">
      ${l}
      
      <!-- Career Summary cards -->
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Siege</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fbbf24;">${g}</div>
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
        ${c.map(m=>{const u=a.categories[m.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(m.name)}">${S(m.name)}</span>
                ${er(m.key)}
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
                    ${o(u.breakawayWins||0,"purple","Ausreißerwertung Siege")}
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
                    <!-- Gelbes Trikot (GC) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(u.leaderJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);"}" title="Tage im Gelben Trikot (GC)">
                      🎽 ${u.leaderJerseys||0}
                    </span>
                    <!-- Grünes Trikot (Punkte) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(u.pointsJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #bbf7d0, #4ade80); color: #14532d; border: 1px solid #22c55e; box-shadow: 0 0 4px rgba(74, 222, 128, 0.4);"}" title="Tage im Grünen Trikot (Punkte)">
                      🎽 ${u.pointsJerseys||0}
                    </span>
                    <!-- Rotes Trikot (Berg) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(u.mountainJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #fecaca, #f87171); color: #7f1d1d; border: 1px solid #ef4444; box-shadow: 0 0 4px rgba(248, 113, 113, 0.4);"}" title="Tage im Berg- / Roten Trikot (Berg)">
                      🎽 ${u.mountainJerseys||0}
                    </span>
                    <!-- Weißes Trikot (Nachwuchs) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(u.youthJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #ffffff, #e2e8f0); color: #1e293b; border: 1px solid #94a3b8; box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);"}" title="Tage im Weißen Trikot (Nachwuchs)">
                      🎽 ${u.youthJerseys||0}
                    </span>
                    <!-- Lila Trikot (Aktivste Fahrer) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(u.breakawayJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #f3e8ff, #d8b4fe); color: #581c87; border: 1px solid #a855f7; box-shadow: 0 0 4px rgba(168, 85, 247, 0.4);"}" title="Tage im Lila Trikot (Aktivste Fahrer)">
                      🎽 ${u.breakawayJerseys||0}
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

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${fe(u.winWeather1||0,1,"Sonnig")}
                  ${fe(u.winWeather2||0,2,"Extreme Hitze")}
                  ${fe(u.winWeather3||0,3,"Leichter Regen")}
                  ${fe(u.winWeather4||0,4,"Starkregen")}
                  ${fe(u.winWeather5||0,5,"Starker Wind")}
                  ${fe(u.winWeather6||0,6,"Dichter Nebel")}
                  ${fe(u.winWeather7||0,7,"Schnee/Eis")}
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
  `}function ug(e){var r;const t=((r=d.gameState)==null?void 0:r.season)??new Date().getFullYear(),a=[...e.riders].sort((n,i)=>{const o=n.contractEndSeason??9999,c=i.contractEndSeason??9999;return o!==c?o-c:i.overallRating-n.overallRating});return`
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
            ${a.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Vertragsdaten verfügbar.</td></tr>':a.map(n=>{const i=n.nationality?rt[n.nationality]??n.nationality.slice(0,2).toLowerCase():null,o=i?`<span class="fi fi-${i} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(n.nationality)}"></span>`:"–",c=xe(`${n.firstName} ${n.lastName}`,{riderId:n.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),l=d.riders.find(y=>y.id===n.id),g=`<span class="results-roster-overall-badge" style="color:${Pn(n.overallRating)}" title="Stärke: ${n.overallRating.toFixed(2)}">${n.overallRating.toFixed(1)}</span>`;let m="–";l&&l.potential!=null&&(m=`<span class="results-roster-overall-badge" style="color:${Pn(l.potential)}" title="Potential: ${l.potential.toFixed(2)}">${l.potential.toFixed(1)}</span>`);const u=n.contractEndSeason===t,p=n.contractEndSeason?`Saison ${n.contractEndSeason}`:"Ohne Vertrag",f=u?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${S(p)}</span>`:`<span style="font-weight: 500;">${S(p)}</span>`;return`
          <tr class="rider-stats-row">
            <td>${o}</td>
            <td style="white-space: nowrap;">${c}</td>
            <td>${n.age}</td>
            <td>${g}</td>
            <td>${m}</td>
            <td>${f}</td>
          </tr>
        `}).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `}function Pn(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function pt(e){return d.teamStatsTab==="career"?`
      ${fs(e)}
      ${hs()}
      ${cg(e)}
    `:d.teamStatsTab==="contracts"?`
      ${fs(e)}
      ${hs()}
      ${ug(e)}
    `:`
    ${fs(e)}
    ${hs()}
    ${dg(e)}
  `}function mg(e,t){var s;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((s=d.teams.find(r=>r.id===e))==null?void 0:s.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${S(a)}" aria-label="${S(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S(Gn(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function No(e){d.teamStatsSelectedTeamId=e,d.teamStatsTab="topResults",d.teamStatsTopResultsFilterCategory=null,d.teamStatsTopResultsFilterSeason=null,d.teamStatsSelectedSeason="all",d.teamStatsTopResultsPage=1;const t=d.teams.find(n=>n.id===e);h("team-stats-title").innerHTML=t?`Team <strong>${S(t.name)}</strong>`:"Teamstatistik",h("team-stats-jersey").innerHTML=mg(e,(t==null?void 0:t.name)??"");const a=lg(e),s=a.average.toFixed(2).replace(".",",");h("team-stats-meta").innerHTML=t?`${S(t.abbreviation)} · ${S(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${s})`:"Daten werden geladen",h("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,Ke("teamStats");const r=await G.getTeamStats(e);if(d.teamStatsSelectedTeamId===e){if(!r.success||!r.data){h("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${S(r.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}d.teamStatsPayload=r.data,h("team-stats-body").innerHTML=pt(r.data)}}function pg(){h("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-stats-tab]");if(a){const r=a.dataset.teamStatsTab;(r==="topResults"||r==="career"||r==="contracts")&&(d.teamStatsTab=r,d.teamStatsPayload&&(h("team-stats-body").innerHTML=pt(d.teamStatsPayload)));return}const s=t.closest("button[data-team-top-results-page]");if(s){const r=Number(s.dataset.teamTopResultsPage);!isNaN(r)&&r>=1&&(d.teamStatsTopResultsPage=r,d.teamStatsPayload&&(h("team-stats-body").innerHTML=pt(d.teamStatsPayload)));return}}),h("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;d.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(h("team-stats-body").innerHTML=pt(d.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;d.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(h("team-stats-body").innerHTML=pt(d.teamStatsPayload))}else if(t.classList.contains("team-stats-filter-checkbox")){const a=t,s=a.dataset.filterType;d.teamStatsTopResultsFilters[s]=a.checked,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(h("team-stats-body").innerHTML=pt(d.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;d.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),d.teamStatsPayload&&(h("team-stats-body").innerHTML=pt(d.teamStatsPayload))}})}let wt="riders",Xe="season",yr="season",nt="";const Ua=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function gg(){const e=h("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");hg(o)})})}const t=h("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");bg(o)})})}Ua.forEach(n=>{const i=h(n);i&&i.addEventListener("change",()=>{const o=i.value;o?yg(o,n):Ua.some(l=>{const g=h(l);return g&&g.value!==""})||(nt="",Dt())})}),window.openRiderStatsFromLeaderboard=qt;const a=h("leaderboard-filter-wt"),s=h("leaderboard-filter-pt"),r=h("leaderboard-filter-other");[a,s,r].forEach(n=>{n&&n.addEventListener("change",()=>{Dt()})})}function fg(){Dt()}function hg(e){wt=e;const t=h("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&(vg(nt)&&(Sg(),nt=""),Xe==="live"&&(Xe=yr,Fa())),Dt()}function bg(e){Xe=e,yr=e,Dt()}function yg(e,t){nt=e,Ua.forEach(a=>{if(a!==t){const s=h(a);s&&(s.value="")}}),Po(e)?(Xe="live",Fa()):vr(e)?(Xe="alltime",Fa()):(Xe=yr,Fa()),Dt()}function Po(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function vr(e){return["max_short_term_fatigue","max_long_term_fatigue","max_combined_fatigue","max_s_form","max_r_form","max_combined_form","mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function vg(e){return Po(e)||vr(e)||e==="mentors_ranking"}function Sg(){Ua.forEach(e=>{const t=h(e);t&&(t.value="")})}function Fa(){const e=h("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');Xe==="live"?e.style.display="none":(e.style.display="flex",vr(nt)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),Xe==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function Dt(){var g,m,u;const e=h("leaderboard-empty"),t=h("leaderboard-table"),a=h("leaderboard-thead"),s=h("leaderboard-tbody");if(!e||!t||!a||!s)return;const r=h("leaderboard-filter-container");if(r&&(r.style.display=wt==="teams"?"none":"flex"),!nt){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await G.getLeaderboards(wt,nt,Xe);if(!he("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(wt==="riders"){const p=((g=h("leaderboard-filter-wt"))==null?void 0:g.checked)??!0,f=((m=h("leaderboard-filter-pt"))==null?void 0:m.checked)??!0,y=((u=h("leaderboard-filter-other"))==null?void 0:u.checked)??!1;if(i=n.data.filter(b=>{const v=b.teamDivisionId===1&&!b.isRetired,M=b.teamDivisionId===2&&!b.isRetired,w=b.teamDivisionId===null||b.teamDivisionId===void 0||b.isRetired||b.teamDivisionId!==1&&b.teamDivisionId!==2;return!!(v&&p||M&&f||w&&y)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const o=nt==="highest_leadout_bonus";wt==="riders"?a.innerHTML=`
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 50px; text-align: center;">Trikot</th>
        <th style="width: 60px; text-align: center;">Land</th>
        <th>Fahrer</th>
        <th>Team</th>
        ${o?"<th>Rennen / Etappe / Jahr</th>":""}
        <th style="text-align: right; width: 180px;">Wert</th>
      </tr>
    `:a.innerHTML=`
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 60px; text-align: center;">Trikot</th>
        <th>Team</th>
        ${o?"<th>Rennen / Etappe / Jahr</th>":""}
        <th style="text-align: right; width: 180px;">Wert</th>
      </tr>
    `;let c="",l=1;for(const p of i){const f=l++,b=`<span class="badge ${f===1?"badge-primary":f<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${f}</span>`,v=yt(p.teamId,p.teamName);let M="";if(o){const w=p.stageNumber!=null?`Etappe ${p.stageNumber}`:"–";M=`<td style="vertical-align: middle;">${S(p.raceName??"–")} · ${S(w)} · ${S(String(p.season??"–"))}</td>`}if(wt==="riders"){const w=p.nationality?re(p.nationality):"—",T=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${p.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(p.firstName)} ${S(p.lastName)}</a>`,$=p.teamAbbr?`<span class="text-muted" title="${S(p.teamName??"")}">${S(p.teamAbbr)}</span>`:"—";c+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${b}</td>
          <td style="text-align: center; vertical-align: middle;">${v}</td>
          <td style="text-align: center; vertical-align: middle;">${w}</td>
          <td style="vertical-align: middle;">${T}</td>
          <td style="vertical-align: middle;">${$}</td>
          ${M}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(p.value))}</td>
        </tr>
      `}else{let w="";if(p.leadoutDetails){const T=p.leadoutDetails,$=T.sprinterNationality?re(T.sprinterNationality):"";w=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">${S(p.teamName.split(" (Sprinter:")[0])}</div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${$}${S(T.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${T.contributors.map(R=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${R.nationality?re(R.nationality):""}${S(R.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${R.contribution.toFixed(2)})</span>
                  </div>
                `).join("")}
            </div>
          </div>
        `}else w=`<strong>${S(p.teamName??"")}</strong>`;c+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${b}</td>
          <td style="text-align: center; vertical-align: middle;">${v}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${w}</td>
          ${M}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(p.value))}</td>
        </tr>
      `}}s.innerHTML=c}let Nt=2026,Ce=5,Ln=!1;const kg=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function Dn(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${s}`}function $g(e,t){const a=[],s=new Date(e,t,1),r=new Date(e,t+1,0);let i=(s.getDay()+6)%7;const o=new Date(s);o.setDate(o.getDate()-i);const c=new Date(o);for(;c<=r||c.getDay()!==1;){const l=[];for(let g=0;g<7;g++)l.push(new Date(c)),c.setDate(c.getDate()+1);a.push(l)}return a}function Tg(){if(Ln)return;Ln=!0,h("calendar-prev-month").addEventListener("click",()=>{Ce--,Ce<0&&(Ce=11,Nt--),Ca()}),h("calendar-next-month").addEventListener("click",()=>{Ce++,Ce>11&&(Ce=0,Nt++),Ca()}),h("calendar-today-btn").addEventListener("click",()=>{var t;if((t=d.gameState)!=null&&t.currentDate){const[a,s]=d.gameState.currentDate.split("-").map(Number);Nt=a,Ce=s-1}Ca()}),h("calendar-race-search").addEventListener("input",()=>{Lo()}),h("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&Ns(s)}}),h("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&Ns(r);return}const s=t.target.closest("button[data-dashboard-race-participants-id]");if(s){const r=Number(s.dataset.dashboardRaceParticipantsId);Number.isFinite(r)&&ko(r)}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const s=a.dataset.raceId;s&&document.querySelectorAll(`[data-race-id="${s}"]`).forEach(r=>{r.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const s=a.dataset.raceId;s&&document.querySelectorAll(`[data-race-id="${s}"]`).forEach(r=>{r.classList.remove("calendar-highlight")})}},!0))}function Mg(){var e;if((e=d.gameState)!=null&&e.currentDate){const[t,a]=d.gameState.currentDate.split("-").map(Number);Nt=t,Ce=a-1}Ca()}function Ca(){var r;if(!he("calendar"))return;h("calendar-month-label").textContent=`${kg[Ce]} ${Nt}`;const e=$g(Nt,Ce),t=h("calendar-weeks"),a=((r=d.gameState)==null?void 0:r.currentDate)??"";let s="";for(const n of e){const i=n.map(Dn),o=[];for(const m of d.races)if(m.startDate<=i[6]&&m.endDate>=i[0]){const u=m.startDate<i[0]?0:i.indexOf(m.startDate),p=m.endDate>i[6]?6:i.indexOf(m.endDate);o.push({race:m,startIdx:u,endIdx:p})}o.sort((m,u)=>{const p=m.endIdx-m.startIdx+1,f=u.endIdx-u.startIdx+1;return f!==p?f-p:m.startIdx-u.startIdx});const c=Array.from({length:3},()=>Array(7).fill(!1));for(const m of o){let u=2;for(let p=0;p<3;p++){let f=!0;for(let y=m.startIdx;y<=m.endIdx;y++)if(c[p][y]){f=!1;break}if(f){u=p;break}}for(let p=m.startIdx;p<=m.endIdx;p++)c[u][p]=!0;m.slot=u}const l=n.map(m=>{const u=Dn(m);return`
        <div class="${["calendar-day-cell",m.getMonth()!==Ce?"other-month":"",u===a?"today":""].filter(Boolean).join(" ")}">
          <span class="calendar-day-number">${m.getDate()}</span>
        </div>
      `}).join(""),g=o.map(m=>{var w;const u=m.race,p=a>=u.startDate&&a<=u.endDate,f=a>u.endDate,y=Xt((w=u.category)==null?void 0:w.name),b=p?'<span class="calendar-live-dot"></span>':"",v=f?"opacity: 0.55;":"",M=m.endIdx-m.startIdx+1;return`
        <div class="calendar-event-bar ${p?"is-live":""}"
             data-race-id="${u.id}"
             style="grid-column: ${m.startIdx+1} / span ${M};
                    grid-row: ${m.slot+1};
                    background-color: ${y.background};
                    border: 1px solid ${y.border};
                    color: ${y.color};
                    ${v}"
             title="${S(u.name)} (${Q(u.startDate)} - ${Q(u.endDate)})">
          ${b}<span class="calendar-event-name">${S(u.name)}</span>
        </div>
      `}).join("");s+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${g}</div>
      </div>
    `}t.innerHTML=s,Lo()}function Lo(){var n;const e=h("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=h("calendar-races-tbody"),s=((n=d.gameState)==null?void 0:n.currentDate)??"",r=d.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(r.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=r.map(i=>{var b,v,M,w;const o=s>=i.startDate&&s<=i.endDate,l=s>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',g=((b=i.country)==null?void 0:b.name)??`Land ${i.countryId}`,m=(v=i.country)!=null&&v.code3?re(i.country.code3):"",u=i.isStageRace?(i.stages??[]).reduce((T,$)=>T+($.distanceKm??0),0):((M=i.upcomingStage)==null?void 0:M.distanceKm)??null,p=i.isStageRace?(i.stages??[]).reduce((T,$)=>T+($.elevationGainMeters??0),0):((w=i.upcomingStage)==null?void 0:w.elevationGainMeters)??null,f=u!=null?String(u.toFixed(1)).replace(".",","):"-",y=p!=null?String(Math.round(p)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${Q(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${S(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${mr(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${m}<span>${S(g)}</span></span></td>
        <td>${Qa(i)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${i.id}">Teilnehmer</button></td>
        <td>${f}</td>
        <td>${y}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}window.openTeamStats=No;async function Do(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}_s("game"),h("meta-career").textContent=((e=d.currentSave)==null?void 0:e.careerName)??"",$t("dashboard"),be("Spiel wird geladen…");try{await pr(),await gr(),ts()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{me()}}function xg(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";$t(t),t==="dashboard"&&ts(),t==="teams"&&Va(),t==="riders"&&Va(),t==="rider-team-editor"&&Fo(),t==="live-race"&&Ct(),t==="results"&&ye(),t==="draft"&&Co(d.draftSelectedSeason||((a=d.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&qp(),t==="season-standings"&&ag(),t==="leaderboards"&&fg(),t==="calendar"&&Mg(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&Ui()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&qt(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&No(a)}),h("btn-cancel-new").addEventListener("click",()=>He("newCareer")),h("btn-close-race-stages").addEventListener("click",()=>He("raceStages")),h("btn-close-stage-profile").addEventListener("click",()=>He("stageProfile")),h("btn-close-rider-program").addEventListener("click",()=>He("riderProgram")),h("btn-close-rider-stats").addEventListener("click",()=>He("riderStats")),h("btn-close-team-stats").addEventListener("click",()=>He("teamStats")),h("btn-close-race-participants").addEventListener("click",()=>He("raceParticipants")),h("btn-close-roster-editor").addEventListener("click",()=>Cs()),h("btn-cancel-roster-editor").addEventListener("click",()=>Cs()),h("btn-apply-roster-editor").addEventListener("click",()=>{gp()}),h("btn-back-menu").addEventListener("click",()=>{Kt==null||Kt.pause(),_s("menu"),Qt()}),Jo(),Cp(),Tg(),uo(),Io(),Jp(),fp(),lp(),Em(),Um(),pg(),sg(),gg()}(async()=>(em(),ie(),xg(),_s("menu"),await Qt()))();
