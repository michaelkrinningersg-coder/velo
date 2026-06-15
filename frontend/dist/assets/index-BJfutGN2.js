(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=a(r);fetch(r.href,n)}})();function En(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ms(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function Yt(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function Wa(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function Me(e,t={}){const a=t.strong===!1?"span":"strong",s=ms("app-rider-link-label",t.labelClassName),r=`<${a} class="${s}">${En(e)}</${a}>`;if(t.riderId==null)return r;const n=['type="button"','class="'+ms("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${r}</button>`}function lt(e,t,a=!0,s=""){const r=a===!1?"span":"strong",n=`<${r} class="app-team-link-label">${En(e)}</${r}>`;return t==null?n:`<button type="button" class="${ms("app-team-link",s)}" data-team-id="${t}">${n}</button>`}const c={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,draftHistory:null,injuries:null,draftSelectedSeason:null,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1};let _t=null;function Io(e){_t=e}let Cs=!1;function hr(e){Cs=e}let Cn=null;function br(e){Cn=e}let ps=null;function yr(e){ps=e}let qe=!1;function Ns(e){qe=e}function y(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function v(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Q(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function Ra(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),s=Math.floor(e%60),r=String(a).padStart(2,"0"),n=String(s).padStart(2,"0");return t>0?`${t}:${r}:${n}`:`${a}:${n}`}function Qa(e){return e==null||e===0?"–":`+${Ra(e)}`}const ka=2,gs=3,Nn=4;function Pn(e){return`/jersey/Jer_${e}.png`}function pt(e,t){var s;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((s=c.teams.find(r=>r.id===e))==null?void 0:s.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${v(a)}" aria-label="${v(a)}">
      <img
        class="results-team-jersey-img"
        src="${v(Pn(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Lt(e,t){return`<span class="results-jersey-cell">${pt(e,t)}</span>`}function Ue(e){return e&&se(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function $a(e){var a;if(e==null)return null;const t=Te(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function Te(e){return e==null?null:c.riders.find(t=>t.id===e)??null}function at(e){return e==null?null:c.races.find(t=>t.id===e)??null}function Ia(e){var t;if(e==null)return null;for(const a of c.races){const s=(t=a.stages)==null?void 0:t.find(r=>r.id===e);if(s)return{race:a,stage:s}}return null}function Dt(e,t=!0,a=!1,s=null,r=null){const n=Me(e,{riderId:s,teamId:r,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function Fo(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function fs(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function Eo(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function Co(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}const et={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function se(e){const t=et[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function No(e,t){return e?`<span class="country-chip">${se(e.code3)}<span>${v(e.name)}</span></span>`:t?v(t):"–"}function hs(e){return`${e.toFixed(2).replace(".",",")} km`}function bs(e){return`${Math.round(e)} hm`}const Po=new Set;function Ps(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),y(`screen-${e}`).classList.remove("hidden")}function He(e){y(`modal-${e}`).classList.remove("hidden")}function _e(e){y(`modal-${e}`).classList.add("hidden")}function fe(e="Lade…"){const t=qe?" (Leertaste zum Stoppen)":"";y("loading-msg").textContent=e+t,y("loading-progress").classList.add("hidden"),y("loading-overlay").classList.remove("hidden")}function ue(){y("loading-overlay").classList.add("hidden")}function Lo(e){y("loading-progress").classList.remove("hidden"),y("loading-overlay").classList.remove("hidden"),Ln(e)}function Ln(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),a=qe?" (Leertaste zum Stoppen)":"";y("loading-msg").textContent=`Instant-Simulation läuft … ${t}%${a}`,y("loading-progress-bar").style.width=`${t}%`}function ct(e,t){const a=y(e);a.textContent=t,a.classList.remove("hidden")}function Ot(e){y(e).classList.add("hidden")}function yt(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),y(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),y("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of Po)try{a(e)}catch(s){console.error(`Fehler bei View-Aktivierung von "${e}":`,s)}}function ge(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function Gt(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function Dn(e,t,a){return Math.max(t,Math.min(a,e))}function es(e,t,a){return Math.round(e+(t-e)*a)}function vr(e,t,a){return`rgb(${es(e[0],t[0],a)} ${es(e[1],t[1],a)} ${es(e[2],t[2],a)})`}function Ls(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=Dn(e,t[0].value,t[t.length-1].value);for(let s=1;s<t.length;s+=1){const r=t[s-1],n=t[s];if(a<=n.value){const i=(a-r.value)/(n.value-r.value);return vr(r.color,n.color,i)}}return vr(t[t.length-1].color,t[t.length-1].color,1)}function An(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${Ls(e)}"${a}>${e.toFixed(2)}</span>`}function Do(e,t,a){if(t==null)return An(e,a);const s=Math.round((e-t)*100)/100,r=s>0?"skill-delta-positive":s<0?"skill-delta-negative":"skill-delta-neutral",n=s>0?"+":"",i=`<span class="skill-delta ${r}">${n}${s.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${Ls(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function Ao(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function Sr(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",s=t>0?"+":"";return`<span class="${a}">${s}${t.toFixed(1).replace(".",",")}</span>`}function kr(e,t="none",a){const s=e??0,r=["race-sim-form-negative"];t==="warning"&&r.push("load-warning"),t==="critical"&&r.push("load-warning-critical");const n=a?` title="${v(a)}"`:"";return s===0?`<span class="${r.join(" ")}"${n}>0,0</span>`:`<span class="${r.join(" ")}"${n}>-${s.toFixed(1).replace(".",",")}</span>`}function Bn(e){const t=e.seasonFormPhase??"neutral";return _n(t)}function _n(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${v(a.label)}">${a.symbol}</span>`}function Bo(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${v(e.seasonProgram.name)}</button>`:"–"}function gt(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function xe(e){return`${e.lastName} ${e.firstName}`}function _o(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,s=e.unavailableUntil?` bis ${Q(e.unavailableUntil)}`:"",r=`${t}: noch ${a} Tag${a===1?"":"e"}${s}`;return`<span class="rider-availability-marker" title="${v(r)}" aria-label="${v(r)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function tt(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function ys(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(a),r=document.createElement("a");r.href=s,r.download=e,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(s)}async function U(e,t,a){try{const s=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(s.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await s.text();return{success:!1,error:s.ok?"Antwort war kein JSON.":`HTTP ${s.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return s.json()}catch(s){return{success:!1,error:`Netzwerkfehler: ${s.message}`}}}const G={listSaves:()=>U("GET","/api/saves"),createSave:(e,t,a)=>U("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>U("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>U("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>U("GET","/api/teams/available"),getTeams:()=>U("GET","/api/teams"),getTeam:e=>U("GET",`/api/teams/${e}`),getTeamStats:e=>U("GET",`/api/teams/${e}/stats`),getRiders:e=>U("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRiderStats:e=>U("GET",`/api/riders/${e}/stats`),getRiderProgramRaces:e=>U("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>U("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>U("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>U("POST","/api/rider-team-editor/export",e),getRaces:()=>U("GET","/api/races"),getRaceProgramParticipants:e=>U("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>U("GET",`/api/races/${e}/results-roster`),getGameState:()=>U("GET","/api/state"),getGameStatus:()=>U("GET","/api/game/status"),getStageSummary:e=>U("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>U("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>U("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>U("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>U("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>U("POST","/api/state/advance"),getStageResults:e=>U("GET",`/api/results/${e}`),getSeasonStandings:()=>U("GET","/api/season-standings"),listStageEditorStages:()=>U("GET","/api/stage-editor/stages"),getStageEditorOverview:()=>U("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>U("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>U("POST","/api/stage-editor/import",e),exportStageRoute:e=>U("POST","/api/stage-editor/export",e),getInjuries:()=>U("GET","/api/injuries"),getDraftHistory:e=>U("GET",`/api/draft/${e}`),getLeaderboards:(e,t,a)=>U("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`)};async function Zt(){const e=await G.listSaves(),t=y("saves-list"),a=y("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(s=>`
    <div class="save-card">
      <h3>${v(s.careerName)}</h3>
      <p class="save-meta">
        ${v(s.teamName)} · Saison ${s.currentSeason}
        ${s.lastSaved?"· "+Q(s.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${v(s.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${v(s.filename)}" data-career-name="${v(s.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function Go(e){fe("Karriere wird geladen…");const t=await G.loadSave(e);if(ue(),!t.success){alert("Fehler beim Laden: "+t.error);return}c.currentSave=t.data??null,await Ro()}async function Ho(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;fe("Löschen…");const a=await G.deleteSave(e);if(ue(),!a.success){alert("Fehler: "+a.error);return}await Zt()}async function zo(){const e=await G.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){y("btn-delete-all-careers").classList.add("hidden"),y("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){fe("Alle Karrieren werden gelöscht…");try{for(const a of t){const s=await G.deleteSave(a.filename);if(!s.success){alert(`Fehler beim Löschen von "${a.careerName}": ${s.error??"Unbekannter Fehler"}`);break}}}finally{ue()}await Zt()}}function Ko(){y("btn-new-career").addEventListener("click",async()=>{var r;Ot("new-career-error"),y("input-career-name").value="";const a=y("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',He("newCareer");const s=await G.getAvailableTeams();if(!s.success||!((r=s.data)!=null&&r.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=s.data.map(n=>`<option value="${n.id}">${v(n.name)} (${v(n.division??n.divisionName??"")})</option>`).join("")}),y("btn-cancel-new").addEventListener("click",()=>_e("newCareer")),y("btn-confirm-new").addEventListener("click",async()=>{const a=y("input-career-name").value.trim(),s=y("input-team-id").value;if(!a||!s){ct("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const r=Number(s),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;Ot("new-career-error"),fe("Neue Karriere wird erstellt…");const o=await G.createSave(i,a,r);if(!o.success){ue(),ct("new-career-error",o.error??"Unbekannter Fehler.");return}const d=await G.loadSave(i);if(ue(),_e("newCareer"),!d.success){alert("Fehler: "+d.error);return}c.currentSave=d.data??null,await Ro()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>Zt());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{zo()}),y("saves-list").addEventListener("click",async a=>{const s=a.target.closest("button[data-save-action]");if(!s)return;const{saveAction:r,filename:n,careerName:i}=s.dataset;if(n){if(r==="load"){await Go(n);return}r==="delete"&&await Ho(n,i??n)}})}const Wo="modulepreload",Oo=function(e){return"/"+e},$r={},Gn=function(t,a,s){let r=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));r=Promise.allSettled(a.map(d=>{if(d=Oo(d),d in $r)return;$r[d]=!0;const l=d.endsWith(".css"),g=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${g}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":Wo,l||(m.as="script"),m.crossOrigin="",m.href=d,o&&m.setAttribute("nonce",o),document.head.appendChild(m),l)return new Promise((u,p)=>{m.addEventListener("load",u),m.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return r.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},jo={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function Vo(e){const t=jo[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const Uo=200;function Ds(e){if(e.length===0)return[];const t=[];for(const a of e){const s=t[t.length-1];if(!s||Math.abs(s.distanceMeter-a.distanceMeter)>=Uo){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}s.riderIds.push(...a.riderIds),s.riderCount+=a.riderCount,s.distanceSum+=a.distanceMeter*a.riderCount,s.distanceMeter=s.distanceSum/s.riderCount}return t.map(({distanceSum:a,...s})=>s)}function As(e){if(e.length===0)return[];let t=0;for(let r=1;r<e.length;r+=1)e[r].riderCount>e[t].riderCount&&(t=r);let a=0,s=0;return e.map((r,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(s+=1,o=`A${s}`),{...r,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-r.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,r.distanceMeter-e[n+1].distanceMeter):null}})}function Yo(e,t=null){var a,s,r;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((s=e.find(n=>n.label==="P"))==null?void 0:s.label)??((r=e[0])==null?void 0:r.label)??null}function st(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function Tr(e,t,a,s){return`${s.type}:${e}:${t}:${a}`}function Zo(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:st(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function Oe(e){const t=[];e.segments.forEach((r,n)=>{const i=n*2;(r.start_markers??[]).forEach((o,d)=>{t.push({key:Tr(n,"start",d,o),label:"",marker:o,kmMark:r.start_km,elevation:r.start_elevation,boundary:"start",sequence:i+d/100})}),(r.end_markers??[]).forEach((o,d)=>{t.push({key:Tr(n,"end",d,o),label:"",marker:o,kmMark:r.end_km,elevation:r.end_elevation,boundary:"end",sequence:i+1+d/100})})});const a=t.sort((r,n)=>r.kmMark-n.kmMark||r.sequence-n.sequence),s=new Map;return a.map(r=>{const n=(s.get(r.marker.type)??0)+1;return s.set(r.marker.type,n),{...r,label:r.marker.name??Zo(r.marker,n)}})}function qo(e){const t=Oe(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>st(a)).length}}function Ft(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Jo(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Ce(e,t,a,s){return t<=0?s:s+e/t*(a-s*2)}function Fa(e,t){const a=t/1e3,s=e.points;if(a<=s[0].kmMark)return s[0].elevation;for(let r=0;r<s.length-1;r+=1){const n=s[r],i=s[r+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),d=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*d}return s[s.length-1].elevation}function Hn(e){const t=e.points.map(g=>g.elevation),a=Math.min(...t),s=Math.max(...t),r=Math.max(1,s-a),n=Math.max(40,r*.08),i=Math.max(0,a-n),o=s+n;let d=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=d&&(l=d+100),{axisMinElevation:d,axisMaxElevation:l}}function ze(e,t,a,s,r,n){const i=Math.max(1,a-t);return s-n-(e-t)/i*(s-r-n)}function Ht(e){return`${Math.round(e)} m`}function Mr(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function xr(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function zn(e,t,a,s,r,n,i,o,d){var h;const l=[],g=[];let m=null,u="#b91c1c";for(const f of Oe(e)){const{marker:b,kmMark:S,elevation:$}=f;if(b.type==="climb_start"){g.push({kmMark:S,elevation:$,name:b.name});continue}if(st(b)){let w=-1;for(let C=g.length-1;C>=0;C-=1)if(b.name&&((h=g[C])==null?void 0:h.name)===b.name){w=C;break}const M=w>=0?g.splice(w,1)[0]:g.pop();M&&Math.max(0,S-M.kmMark),M&&Math.max(0,$-M.elevation);const x=xr(b.cat,b.type),D=Mr(b.cat);if(b.type==="finish_hill"||b.type==="finish_mountain"){m=b.cat??null,u=x.accentColor;continue}l.push({x:Ce(S*1e3,t,a,s),anchorY:ze($,o,d,r,n,i),primaryLabel:D??"Berg",secondaryLabel:Ht($),distanceLabel:`${S.toFixed(1).replace(".",",")} km`,accentColor:x.accentColor});continue}if(b.type==="sprint_intermediate"){const w=xr(b.cat,b.type);l.push({x:Ce(S*1e3,t,a,s),anchorY:ze($,o,d,r,n,i),primaryLabel:"Sprint",secondaryLabel:Ht($),distanceLabel:`${S.toFixed(1).replace(".",",")} km`,accentColor:w.accentColor})}}const p=e.points[e.points.length-1];return l.push({x:Ce(p.kmMark*1e3,t,a,s),anchorY:ze(p.elevation,o,d,r,n,i),primaryLabel:m?`${Mr(m)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:Ht(p.elevation),distanceLabel:`${p.kmMark.toFixed(1).replace(".",",")} km`,accentColor:u}),l.sort((f,b)=>f.x-b.x)}function Kn(e,t,a){const s=t+4,r=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${Ft(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-detail">${Ft(e.distanceLabel)}</text>
    </g>`}function Wn(e,t){const a=new Set,s=t/1e3;for(let r=0;r<=s;r+=25)a.add(Math.round(r*1e3));return a.add(Math.round(t)),[...a].filter(r=>r>=0&&r<=t).sort((r,n)=>r-n)}function On(e,t,a,s,r,n){const i=new Set(Oe(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const d=Ce(o,a,s,r),g=i.has(o)?18:12,m=n+g+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${d.toFixed(1)}" y1="${n.toFixed(1)}" x2="${d.toFixed(1)}" y2="${(n+g).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${d.toFixed(1)}" y="${m.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${Ft(Jo(o))}</text>
      </g>`}).join("")}function Xo(e,t,a,s,r,n,i,o,d,l,g){const m=Ce(e.distanceMeter,a,s,n),u=Fa(t,e.distanceMeter),p=ze(u,d,l,r,i,o),h=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),f=e.riderCount>1?`<text x="${m.toFixed(1)}" y="${(p+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${m.toFixed(1)}" cy="${p.toFixed(1)}" r="${h.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${g?" race-sim-cluster-dot-selected":""}"></circle>
      ${f}
    </g>`}function Qo(e,t,a,s,r,n,i,o,d,l,g){const m=new Map(g.riders.map(p=>[p.id,p])),u=new Map((g.teams??[]).map(p=>[p.id,p.abbreviation]));return e.filter(p=>p.riderCount===1).map(p=>{const h=p.riderIds[0];if(h==null)return"";const f=m.get(h);if(!f)return"";const b=Ce(p.distanceMeter,a,s,n),S=Fa(t,p.distanceMeter),$=ze(S,d,l,r,i,o),w=f.activeTeamId!=null?u.get(f.activeTeamId)??"":"",M=`${f.lastName} (${w})`,x=$-34,D=$-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${b.toFixed(1)}" y1="${($-5).toFixed(1)}" x2="${b.toFixed(1)}" y2="${x.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${b.toFixed(1)}" y="${D.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${Ft(M)}</text>
        </g>`}).join("")}function el(e,t,a,s,r,n,i,o,d,l,g){const m=Math.max(0,Math.min(l,e.distanceKm)),u=Math.max(0,Math.min(g,e.distanceKm));if(u<=m)return null;const p=[{kmMark:m,elevation:Fa(e,m*1e3)},...e.points.filter($=>$.kmMark>m&&$.kmMark<u),{kmMark:u,elevation:Fa(e,u*1e3)}];if(p.length<2)return null;const h=r-i,f=p.map(($,w)=>{const M=Ce($.kmMark*1e3,t,a,s),x=ze($.elevation,o,d,r,n,i);return`${w===0?"M":"L"} ${M.toFixed(1)} ${x.toFixed(1)}`}).join(" "),b=Ce(m*1e3,t,a,s),S=Ce(u*1e3,t,a,s);return`${f} L ${S.toFixed(1)} ${h.toFixed(1)} L ${b.toFixed(1)} ${h.toFixed(1)} Z`}function tl(e,t,a,s,r={}){const g=e.distanceKm*1e3,{axisMinElevation:m,axisMaxElevation:u}=Hn(e),p=533,h=12,b=e.points.map(C=>{const A=Ce(C.kmMark*1e3,g,1584,28),N=ze(C.elevation,m,u,634,168,101);return{x:A,y:N}}).map((C,A)=>`${A===0?"M":"L"} ${C.x.toFixed(1)} ${C.y.toFixed(1)}`).join(" "),S=`${b} L ${1556 .toFixed(1)} ${p.toFixed(1)} L ${28 .toFixed(1)} ${p.toFixed(1)} Z`,$=r.selectedClimbRange!=null?el(e,g,1584,28,634,168,101,m,u,r.selectedClimbRange.startKm,r.selectedClimbRange.endKm):null,w=zn(e,g,1584,28,634,168,101,m,u).map(C=>Kn(C,h,p)).join(""),x=Array.from({length:5},(C,A)=>m+(u-m)/4*A).map(C=>{const A=ze(C,m,u,634,168,101);return`
      <line x1="28" y1="${A.toFixed(1)}" x2="1556" y2="${A.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${A.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${A.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(A+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Ht(C)}</text>`}).join(""),D=On(Wn(e,g),e,g,1584,28,p);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${Ft(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      <line x1="28" y1="${p}" x2="1556" y2="${p}" class="race-sim-axis"></line>
      ${`<line x1="28" y1="168" x2="28" y2="${p}" class="race-sim-axis"></line>`}
      <path d="${S}" fill="url(#dashboard-large-area)"></path>
      ${$?`<path d="${$}" class="dashboard-stage-profile-climb-highlight"></path>`:""}
      <path d="${b}" class="race-sim-profile-line"></path>
      ${w}
      ${D}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function al(e,t,a,s,r){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${tl(t,a,s,!1,r)}</div>`}function sl(e,t,a,s,r,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,d=634,l=28,g=168,m=101,{axisMinElevation:u,axisMaxElevation:p}=Hn(t),h=d-m,f=12,b=Array.from({length:5},(B,T)=>u+(p-u)/4*T),S=Ds(a.clusters),$=As(S),w=Wn(t,a.stageDistanceMeters),x=t.points.map(B=>{const T=Ce(B.kmMark*1e3,a.stageDistanceMeters,o,l),F=ze(B.elevation,u,p,d,g,m);return{x:T,y:F}}).map((B,T)=>`${T===0?"M":"L"} ${B.x.toFixed(1)} ${B.y.toFixed(1)}`).join(" "),D=`${x} L ${(o-l).toFixed(1)} ${h.toFixed(1)} L ${l.toFixed(1)} ${h.toFixed(1)} Z`,C=zn(t,a.stageDistanceMeters,o,l,d,g,m,u,p).map(B=>Kn(B,f,h)).join(""),A=b.map(B=>{const T=ze(B,u,p,d,g,m);return`
      <line x1="${l}" y1="${T.toFixed(1)}" x2="${o-l}" y2="${T.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${T.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${T.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(T+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Ht(B)}</text>`}).join(""),N=On(w,t,a.stageDistanceMeters,o,l,h),P=new Map(S.map((B,T)=>[B,$[T]??null])),L=S.map(B=>{var T;return Xo(B,t,a.stageDistanceMeters,o,d,l,g,m,u,p,((T=P.get(B))==null?void 0:T.label)===i)}).join(""),_=r.stage.profile==="ITT"?Qo(S,t,a.stageDistanceMeters,o,d,l,g,m,u,p,r):"";e.innerHTML=`
    <div class="race-sim-profile-layout${r.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${d}" role="img" aria-label="${Ft(s)}">
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
              <rect x="${l}" y="0" width="${o-l*2}" height="${d}"></rect>
            </clipPath>
          </defs>
          <rect x="0" y="0" width="${o}" height="${d}" fill="url(#race-sim-paper)"></rect>
          ${A}
          <line x1="${l}" y1="${h}" x2="${o-l}" y2="${h}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${g}" x2="${l}" y2="${h}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${D}" fill="url(#race-sim-area)"></path>
            <path d="${x}" class="race-sim-profile-line"></path>
            ${C}
            ${L}
          </g>
          ${_}
          ${N}
          <text x="${l.toFixed(1)}" y="${(g-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const rl={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},wr={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function vs(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function Oa(e,t){return`${e}:${t}`}function nl(e){return new Map(e.map(t=>[Oa(t.simulationMode,t.terrain),t.weights]))}function il(e){return new Map(e.map(t=>[Oa(t.simulationMode,t.terrain),t]))}function ol(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function jn(e,t,a){const s=a.get(Oa(e,t));if(!s)return[{key:vs(t),weight:1}];const r=Object.entries(s).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return r.length>0?r:[{key:vs(t),weight:1}]}function ll(e,t,a,s){const r=jn(t,a,s),n=r.reduce((o,d)=>o+d.weight,0);return n<=0?e[vs(a)]:r.reduce((o,d)=>o+e[d.key]*d.weight,0)/n}function dl(e,t){const a=t.find(s=>s.simulationMode==="ttt"&&s.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??rl[e]??1.05}function cl(e,t,a){const s=a==null?void 0:a.get(Oa(e,t));return{lateMultiplier:(s==null?void 0:s.finalSpreadLateMultiplier)??wr[t].lateMultiplier,peakMultiplier:(s==null?void 0:s.finalSpreadPeakMultiplier)??wr[t].peakMultiplier}}const ul=.005,ml=.005,Vn=70,Un=1e3,Yn=15,Zn=360,qn=8,Jn=-.75,Xn=10;function ut(e,t){return e+Math.random()*(t-e)}function Qn(e,t,a){return Math.max(t,Math.min(a,e))}function pl(e){return e==="ITT"||e==="TTT"}function ei(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(s=>{var r,n,i;return s.id!==e.id&&s.activeTeamId===e.activeTeamId&&(((r=s.role)==null?void 0:r.name)==="Edelhelfer"||((n=s.role)==null?void 0:n.name)==="Starke Helfer"||((i=s.role)==null?void 0:i.name)==="Wassertraeger")}).map(s=>s.id)}function ti(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function gl(e,t,a,s){const r=s==="crash"?ti():null,n=Number(ut(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=Qn(n/Math.max(.1,a)*100,0,100),d=o<=Vn;return{riderId:e.id,type:s,severity:r,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(s==="crash"?ut(10,60):ut(10,45)),recoverySeconds:d?Un:Zn,recoveryFormBonus:d?Yn:qn,dayFormPenalty:Jn,staminaPenalty:Xn,recoveryPenaltyStages:s==="crash"?r==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:s==="crash"&&r==="medium"?15:0,supportRiderIds:ei(e,t)}}function fl(e,t,a){if(pl(t.profile)||a<=0)return[];const s=[];for(const r of e){const n=Math.random(),i=Math.random(),o=ul*Math.max(0,t.crashIncidentMultiplier??1),d=ml*Math.max(0,t.mechanicalIncidentMultiplier??1),l=o+(t.rolledEffektSturz??0)/100,g=d+(t.rolledEffektDefekt??0)/100,m=n<l,u=i<g;if(!m&&!u)continue;const p=m&&u?n<=i?"crash":"mechanical":m?"crash":"mechanical",h=gl(r,e,a,p);if(p==="crash"&&Math.random()<.01){h.isMassCrashTrigger=!0;const f=Math.floor(ut(2,26)),S=[...e.filter($=>$.id!==r.id)].sort(()=>.5-Math.random());h.massCrashPotentialRiderIds=S.slice(0,f).map($=>$.id),Math.random()<.2&&(h.hasAdditionalMechanical=!0,h.waitDurationSeconds+=Math.round(ut(10,45)))}s.push(h)}return s}function hl(e,t,a,s){const r=ti(),n=Math.round(a*1e3),i=Qn(a/Math.max(.1,s)*100,0,100),o=i<=Vn;let d=Math.round(ut(10,60)),l=!1;return Math.random()<.2&&(l=!0,d+=Math.round(ut(10,45))),{riderId:e.id,type:"crash",severity:r,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:d,recoverySeconds:o?Un:Zn,recoveryFormBonus:o?Yn:qn,dayFormPenalty:Jn,staminaPenalty:Xn,recoveryPenaltyStages:r==="light"?[10,5,2]:[],raceRecuperationPenalty:r==="medium"?15:0,supportRiderIds:ei(e,t),hasAdditionalMechanical:l}}function ai(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function si(e){return Math.round(e*10)/10}function ri(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function ni(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function ii(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function bl(e,t){return e.skills.stamina*(t/300)}function oi(e,t,a){return e.skills.timeTrial+ii(e,t)+e.skills.mountain*(a/500)}function yl(e,t,a,s){const r=bl(e,a),n=ii(e,s);switch(t.profile){case"Flat":return .8*e.skills.sprint+.2*e.skills.flat+n+r;case"Rolling":return .7*e.skills.sprint+.2*e.skills.flat+.1*e.skills.hill+n+r;case"Hilly":return .4*e.skills.sprint+.2*e.skills.flat+.4*e.skills.hill+n+r;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+r;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+r;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+r;case"High_Mountain":return e.skills.mountain+n+r;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+r;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+r;default:return .8*e.skills.sprint+.2*e.skills.flat+n+r}}function vl(e,t,a,s,r){return t.profile==="ITT"||t.profile==="TTT"?oi(e,r,s):yl(e,t,a,r)}function Sl(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:si(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function kl(e,t,a,s){ri(a,s);const r=ni(a,s),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const g=o.get(l.activeTeamId)??[];g.push(l),o.set(l.activeTeamId,g)}return[...o.entries()].map(([l,g])=>{const m=n.get(l),p=g.map(S=>oi(S,ai(S.id,s==null?void 0:s.dailyFormByRiderId),r)).sort((S,$)=>$-S).slice(0,5),h=p.length,f=h>0?p.reduce((S,$)=>S+$,0)/h:0,b=Math.max(0,5-h)*2;return{team:m??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:f-b}}).sort((l,g)=>g.score-l.score||l.team.id-g.team.id).slice(0,20).map((l,g)=>({rank:g+1,kind:"team",effectiveSkill:si(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(s!=null?Ss(e,t,a,s):Ss(e,t,a)).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id).slice(0,20).map((o,d)=>Sl(o,d+1))}function Ss(e,t,a,s){const r=ri(a,s),n=ni(a,s),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var d;return{rider:o,teamName:o.activeTeamId!=null?((d=i.get(o.activeTeamId))==null?void 0:d.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:vl(o,a,r,n,ai(o.id,s==null?void 0:s.dailyFormByRiderId))}}).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id)}function $l(e,t){return e+Math.random()*(t-e)}function Rr(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const s=Math.floor($l(0,a+1)),r=t[a];t[a]=t[s]??r,t[s]=r}return t}function Tl(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function Ml(e,t,a={}){if(e.length===0)return[];const s=e.map(p=>({...p,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),r=a.teams??Tl(s),n=Ss(s,r,t,a),i=new Set(n.slice(0,20).map(p=>p.rider.id)),o=Math.min(Math.ceil(s.length*.02),Math.max(0,s.length-i.size)),d=Math.min(Math.ceil(s.length*.01),s.length),l=Rr(s.filter(p=>!i.has(p.id))),g=new Set(l.slice(0,o).map(p=>p.id)),m=Rr(s.filter(p=>!g.has(p.id))),u=new Set(m.slice(0,d).map(p=>p.id));return s.map(p=>g.has(p.id)?{...p,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:u.has(p.id)?{...p,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:p)}function ra(e,t){const a=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(s-a+1))+a}function Ir(e,t){return e+Math.random()*(t-e)}function xl(e,t,a){const s=[...e],r=[];for(;r.length<t&&s.length>0;){const n=s.reduce((l,g)=>l+Math.max(1e-4,a(g)),0);let i=Math.random()*n,o=0;for(let l=0;l<s.length;l+=1)if(i-=Math.max(1e-4,a(s[l])),i<=0){o=l;break}const[d]=s.splice(o,1);d&&r.push(d)}return r}function wl(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function Rl(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function Il(e,t,a){return new Set(e.map(s=>s.riderId).filter(s=>s!=null&&!t.has(s)).slice(0,a))}function Fl(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function Bs(e){var t;return Fl((t=e.role)==null?void 0:t.name)}function El(e){return Oe(e).some(({marker:t})=>st(t))}function Cl(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function Nl(e,t){const a=Cl(e),s=e.hasSuperform===!0?40:1,r=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&Bs(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*s*r*n*i;return{attackFactor:a,superformFactor:s,gcLeaderTeamFactor:r,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function Pl(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function Ll(e,t){var s,r;const a=((s=t[0])==null?void 0:s.riderId)??null;return a==null?null:((r=e.find(n=>n.id===a))==null?void 0:r.activeTeamId)??null}function Dl(e,t,a){const s=new Map(t.map(n=>[n.id,n])),r=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=s.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||r.has(i.activeTeamId))&&(r.add(i.activeTeamId),r.size>=a))break}return r}function Al(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),Bs(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function Bl(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const s=t.stageNumber<=10,r=Math.max(1,Math.floor(a*(s?.01:.05))),n=Math.max(r,Math.floor(a*(s?.08:.2)));return{min:r,max:n}}function _l(e,t){return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?{min:.45,max:.75}:{min:.5,max:.85}}function Gl(e,t,a,s,r,n,i){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||s.distanceKm<=0)return null;const o=e.length,{min:d,max:l}=Bl(t,a,o),g=ra(d,l),m=t.isStageRace&&a.stageNumber<=10,u=!t.isStageRace,p=Ll(e,n),h=m?Dl(r,e,5):new Set,f=m?Al(e):new Map,b=El(s),S=wl(r,5),$=Rl(n,10),w=new Set([...S,...$]),M=b?Il(i,w,5):new Set,x=Pl(a),D=e.filter(I=>{if(I.activeTeamId==null||S.has(I.id)||$.has(I.id)||m&&p!=null&&I.activeTeamId===p||m&&h.has(I.activeTeamId))return!1;const E=Bs(I);return!(u&&(E==="kapitaen"||E==="co-kapitaen")||m&&E==="kapitaen"||m&&E==="co-kapitaen"&&f.get(I.activeTeamId)!==!0||E==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(D.length===0)return null;const C=new Map(D.map(I=>[I.id,Nl(I,{isEarlyStageRace:m,race:t,gcLeaderTeamId:p,stageHasMountainClassifications:b,topMountainIds:M,isHardStage:x})])),A=D.reduce((I,E)=>{var H;return I+(((H=C.get(E.id))==null?void 0:H.finalWeight)??0)},0),N=xl(D,Math.min(g,D.length),I=>{var E;return((E=C.get(I.id))==null?void 0:E.finalWeight)??1});if(N.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${N.length}/${g} ausgewählt aus ${D.length}`),console.log(`Gesamtgewicht im Pool: ${A.toFixed(2)}`),console.table(N.map(I=>{var H;const E=C.get(I.id);return{Fahrer:`${I.firstName} ${I.lastName}`,Team:I.activeTeamId,Rolle:((H=I.role)==null?void 0:H.name)??null,Atk:I.skills.attack,Hill:I.skills.hill,Chance:`${((A>0&&E!=null?E.finalWeight/A:0)*100).toFixed(2)}%`,Gewicht:((E==null?void 0:E.finalWeight)??1).toFixed(2),Attacke:`x${((E==null?void 0:E.attackFactor)??1).toFixed(2)}`,Superform:`x${(E==null?void 0:E.superformFactor)??1}`,GC_Team:`x${((E==null?void 0:E.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(E==null?void 0:E.mountainFactor)??1}`,Sprinter:`x${(E==null?void 0:E.sprinterFactor)??1}`}})),console.groupEnd();const P=s.distanceKm*1e3,L=ra(0,Math.min(1e4,Math.max(0,Math.floor(P*.1)))),_=_l(t,a),B=Math.round(P*Ir(_.min,_.max)),T=Math.round(P*Ir(.1,.25)),F=Math.max(L+1e3,Math.min(B-1e3,B-T)),z=a.rolledBreakawayBonus??0,R=ra(3+z,8+z);return{riderIds:N.map(I=>I.id),triggerDistanceMeters:L,groupPhaseEndDistanceMeters:F,phaseEndDistanceMeters:B,skillBonus:R,malusValue:ra(5,8)}}const Hl=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),zl=3,Kl=7,Fr=120,Er=200,Cr=180,Wl=10,na=8e3;function mt(e,t,a=Math.random()){const s=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(a*(r-s+1))+s}function Ol(e){for(let t=e.length-1;t>0;t-=1){const a=mt(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function Ea(e,t){return t<=0||e.length===0?[]:Ol([...e]).slice(0,Math.min(t,e.length))}function jl(e,t,a){if(t<=0||e.length===0)return[];const s=[...e],r=[];for(;s.length>0&&r.length<t;){const n=s.reduce((d,l)=>d+Math.max(0,a(l)),0);if(n<=0){r.push(...Ea(s,t-r.length));break}let i=Math.random()*n,o=s.length-1;for(let d=0;d<s.length;d+=1)if(i-=Math.max(0,a(s[d])),i<=0){o=d;break}r.push(s[o]),s.splice(o,1)}return r}function Vl(e){return Hl.has(e.profile)}function Ul(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function Yl(e,t){if(!Vl(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(s=>{if(!Ul(s))return[];const r=s.start_km*1e3,n=s.end_km*1e3,i=Math.max(r,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:r,sourceSegmentEndMeters:n}]})}function Nr(e,t){const a=t==null?e:e.filter(d=>{const l=Math.min(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t)),g=Math.max(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t));return l>=na||g>=na});if(a.length===0)return null;const s=a[mt(0,a.length-1)];if(!s)return null;const r=Math.ceil(s.startMeters),n=Math.floor(s.endMeters);if(n<=r)return null;let i=0;for(;i<12;){const d=mt(r,n);if(t==null||Math.abs(d-t)>=na)return{triggerDistanceMeters:d,sourceSegmentStartMeters:s.sourceSegmentStartMeters,sourceSegmentEndMeters:s.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<s.startMeters?n:r;return t==null||Math.abs(o-t)>=na?{triggerDistanceMeters:o,sourceSegmentStartMeters:s.sourceSegmentStartMeters,sourceSegmentEndMeters:s.sourceSegmentEndMeters}:null}function Zl(e,t,a,s=()=>1){const r=e.slice(0,15),n=Yl(t,a);if(r.length===0||n.length===0)return[];const i=mt(zl,Math.min(Kl,r.length)),o=jl(r,i,s),d=[];for(const u of o){const p=Nr(n);p&&d.push({riderId:u.id,attackNumber:1,triggerDistanceMeters:p.triggerDistanceMeters,durationSeconds:mt(Fr,Er),sourceSegmentStartMeters:p.sourceSegmentStartMeters,sourceSegmentEndMeters:p.sourceSegmentEndMeters,isCounterAttack:!1})}if(d.length===0)return[];const l=d.map(u=>u.riderId),g=Math.floor(l.length*.5),m=new Set(Ea(l,g));for(const u of[...d]){if(!m.has(u.riderId))continue;const p=Nr(n,u.triggerDistanceMeters);p&&d.push({riderId:u.riderId,attackNumber:2,triggerDistanceMeters:p.triggerDistanceMeters,durationSeconds:mt(Fr,Er),sourceSegmentStartMeters:p.sourceSegmentStartMeters,sourceSegmentEndMeters:p.sourceSegmentEndMeters,isCounterAttack:!1})}return d.sort((u,p)=>u.triggerDistanceMeters-p.triggerDistanceMeters||u.riderId-p.riderId||u.attackNumber-p.attackNumber)}function ql(e,t,a){var d;if(e.length===0)return[];const s=((d=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:d.teamId)??null,r=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||s!=null&&l.teamId===s));if(r.length===0)return[];const n=new Map;for(const l of r){const g=n.get(l.teamId)??[];g.push(l),n.set(l.teamId,g)}const i=[...n.values()].map(l=>Ea(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(mt(0,3),i.length);return Ea(i,o).map(l=>l.riderId)}function Jl(e,t){const a=[],s=[];for(const[r,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){s.push(r);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:s}}const Xl={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},Ql={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},ed={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},td={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},ad={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function sd(e){const t=new Map;for(const a of e){const s=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",s);else if(a.appliesTo==="climb_top"){const r=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${r}`,s)}else a.appliesTo==="finish"&&t.set(a.markerType,s)}return t}const ia=20,rd=120,nd=300,ts=.025,id=.1,od=.4,ld=.6,dd=.8,Ca=1,Pr=2/3,cd=.1,oa=10,Lr=50,ud=25,md=7,pd=500,gd=100,fd=.02,hd=.04,bd=.009,yd=120,vd=150,Sd=100,kd=300,Dr=50,as=85,nt=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],Ar=5*60,$d=60,Td=.5,Md=.3,la=5e3,xd=2e3,wd=1,Rd=2,Id=.05,li={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},Fd={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},da=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function ie(e,t,a){return Math.max(t,Math.min(a,e))}function le(e,t){return e+Math.random()*(t-e)}function Br(e){return e[Math.floor(Math.random()*e.length)]}function wt(e){return Math.round(e*100)/100}function Ed(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function _r(e){if(e<2)return 1;const t=ie(e,2,20),a=da[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let s=1;s<da.length;s+=1){const r=da[s-1],n=da[s];if(t>n.gradientPercent)continue;const i=(t-r.gradientPercent)/Math.max(1e-4,n.gradientPercent-r.gradientPercent),o=r.draftPenaltyShare+(n.draftPenaltyShare-r.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function Cd(e){return e==="Flat"?yd:e==="Abfahrt"?vd:Number.POSITIVE_INFINITY}function Nd(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function Na(e){return(e.formBonus??0)+(e.raceFormBonus??0)-(e.fatigueMalus??0)-(e.longTermFatigueMalus??0)-(e.shortTermFatigueMalus??0)}function Pd(e,t){if(t.length===0)return"";const a=t.reduce((g,m)=>g+m.weight,0),s=t.map(g=>{const m=e.skills[g.key],u=Math.round(g.weight/a*100);return`${li[g.key]} ${Math.round(m)} (${u}%)`}),r=e.formBonus??0,n=e.raceFormBonus??0,i=e.fatigueMalus??0,o=e.longTermFatigueMalus??0,d=e.shortTermFatigueMalus??0;s.push(`S-Form ${r>=0?"+":""}${r.toFixed(1).replace(".",",")}`),s.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&s.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&s.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),d>0&&s.push(`Akut -${d.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const g of t)l+=(e.mentorBoosts[g.key]||0)*(g.weight/a);return l>0&&s.push(`Mentor +${l.toFixed(1).replace(".",",")}`),s.join(" • ")}function Ld(){const e=Math.random();return e<.9?le(5,20):e<.98?le(20,40):le(40,70)}function Gr(){const e=Math.random();return e<.9?wt(le(-1,1)):e<.995?wt(Br([-1,1])*le(1,2)):wt(Br([-1,1])*le(3,4))}function Dd(){return wt(le(-3,3))}function Ad(e){const t=[];let a=0,s=Ld(),r=le(-1,1);for(;a<e;){const n=Math.min(e-a,le(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:s,vector:r}),a+=n,a>=e)break;s=ie(s+(Math.random()<.5?-1:1)*le(2,10),5,70),r=ie(r+(Math.random()<.5?-1:1)*le(0,.5),-1,1)}return t}function di(e,t){const a=Z(e),s=Z(t);if(a!==s)return a?1:-1;const r=me(e),n=me(t);return r&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:r?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function Z(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function me(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function Pt(e,t,a=!1,s=null){var d;const r="rider"in e?e.rider:null,n=(r==null?void 0:r.specialization1)??null,i=(r==null?void 0:r.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(d=r==null?void 0:r.role)==null?void 0:d.name;s==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function Bd(e,t,a=null,s=null,r=!1){var p,h;const n=f=>f.photoFinishScore;if(!t){const f=[...e].sort((S,$)=>S.crossingTimeSeconds-$.crossingTimeSeconds||$.photoFinishScore-S.photoFinishScore||S.riderId-$.riderId),b=((p=f[0])==null?void 0:p.crossingTimeSeconds)??0;return f.map((S,$)=>({riderId:S.riderId,rank:$+1,crossingTimeSeconds:S.crossingTimeSeconds,gapSeconds:Math.max(0,S.crossingTimeSeconds-b),photoFinishScore:S.photoFinishScore}))}const i=[...e].sort((f,b)=>f.crossingTimeSeconds-b.crossingTimeSeconds||b.photoFinishScore-f.photoFinishScore||f.riderId-b.riderId),o=((h=i[0])==null?void 0:h.crossingTimeSeconds)??0,d=[];let l=[],g=0,m=null;const u=()=>{const f=Math.max(0,g-o),b=l.sort((S,$)=>n($)-n(S)||S.riderId-$.riderId);for(const S of b)d.push({riderId:S.riderId,rank:d.length+1,crossingTimeSeconds:S.crossingTimeSeconds,gapSeconds:f,photoFinishScore:S.photoFinishScore})};for(const f of i){if(l.length===0){l=[f],g=f.crossingTimeSeconds,m=f.crossingTimeSeconds;continue}if(m!=null&&f.crossingTimeSeconds-m<=Ca){l.push(f),m=f.crossingTimeSeconds;continue}u(),l=[f],g=f.crossingTimeSeconds,m=f.crossingTimeSeconds}return l.length>0&&u(),d}function _d(e,t,a){const s=e.filter(me).sort((m,u)=>(m.finishTimeSeconds??0)-(u.finishTimeSeconds??0)||u.photoFinishScore-m.photoFinishScore||m.rider.id-u.rider.id),r=e.filter(m=>!Z(m)).sort(di),n=e.filter(m=>m.finishStatus==="dnf").sort((m,u)=>u.distanceCoveredMeters-m.distanceCoveredMeters||m.rider.id-u.rider.id),i=[];let o=[],d=null;const l=m=>m.photoFinishScore,g=()=>{i.push(...o.sort((m,u)=>l(u)-l(m)||m.rider.id-u.rider.id))};for(const m of s){const u=m.finishTimeSeconds??0;if(o.length===0){o=[m],d=u;continue}if(d!=null&&u-d<=Ca){o.push(m),d=u;continue}g(),o=[m],d=u}return o.length>0&&g(),[...i,...r,...n]}function Gd(e,t){const a=Z(e),s=Z(t);if(a!==s)return a?1:-1;const r=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(r)>=.1?r:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:me(e)&&me(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:me(e)?-1:me(t)?1:e.rider.id-t.rider.id}function Hr(e){const t=ie(e,1,Lr);return t<=2?.12*t:t<=oa?.24+(t-2)/Math.max(1,oa-2)*.58:.82+(t-oa)/Math.max(1,Lr-oa)*.18}function ss(e,t){const a=Na(e.rider);return Object.entries(t).reduce((s,[r,n])=>{if(!n)return s;const i=r==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[r]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return s+o*n},0)}function Hd(e,t){const a=Na(e.rider);return Object.entries(t).filter(s=>!!s[1]).map(([s,r])=>{const n=s,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:r,effectiveSkill:o,contribution:o*r}})}function zd(e,t,a){let s=t;for(;s>0;){const n=e[s-1].distanceCoveredMeters-e[s].distanceCoveredMeters;if(n<=0||n>=a)break;s-=1}let r=t;for(;r<e.length-1;){const n=e[r].distanceCoveredMeters-e[r+1].distanceCoveredMeters;if(n<=0||n>=a)break;r+=1}return{startIndex:s,endIndex:r,size:r-s+1,positionInGroup:t-s}}function Kd(e,t){if(e<ud)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class ci{constructor(t,a){var _,B;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.hasLoggedFinishSprintTieBreak=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const s=(_=t.race.country)==null?void 0:_.code3;s&&(t.riders=t.riders.map(T=>{var z;const F=T.nationality||((z=T.country)==null?void 0:z.code3);if(F&&F.trim().toUpperCase()===s.trim().toUpperCase()){const R={...T,skills:{...T.skills}},I=Math.random(),E=t.stage.profile,H=E==="ITT"||E==="TTT",Y=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(E==="Cobble"||E==="Cobble_Hill")&&Y.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(E)||Y.push("mountain","mediumMountain");const oe=[...(k=>{const K=[...Y],W=[];if(H){W.push("timeTrial");const O=Math.min(k-1,K.length);for(let ne=0;ne<O;ne++){const he=Math.floor(Math.random()*K.length);W.push(K.splice(he,1)[0])}}else{const O=Math.min(k,K.length);for(let ne=0;ne<O;ne++){const he=Math.floor(Math.random()*K.length);W.push(K.splice(he,1)[0])}}return W})(5)].sort(()=>Math.random()-.5);if(R.homeEffectSkills=oe,I<.05){R.homeEffect="home_pressure";for(const k of oe)R.skills[k]=Math.max(0,R.skills[k]-.5)}else if(I<.1){R.homeEffect="super_home";const k=oe[0];R.skills[k]=Math.min(100,R.skills[k]+3);for(let K=1;K<5;K++){const W=oe[K];R.skills[W]=Math.min(100,R.skills[W]+1)}}else{R.homeEffect="normal_home";for(const k of oe)R.skills[k]=Math.min(100,R.skills[k]+1)}return R}return T})),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=ol(t.stage.profile),this.skillWeightRuleMap=nl(t.skillWeightRules??[]),this.skillWeightConfigMap=il(t.skillWeightRules??[]),this.stageScoringWeightMap=sd(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=Ad(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const r=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=r!=null?ie(r/100,0,1):le(ld,dd);const n=t.stage.finalPushStartPercent;this.finalPushStartRatio=n!=null?ie(n/100,this.lateStageStartRatio,1):ie(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const i=fl(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(i.map(T=>[T.riderId,T])),i.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",i.map(F=>({riderId:F.riderId,type:F.type,severity:F.severity,kmMark:F.triggerDistanceKm,waitDurationSeconds:F.waitDurationSeconds,supportRiderIds:F.supportRiderIds})));const T=i.filter(F=>F.isMassCrashTrigger);T.length>0&&T.forEach(F=>{var z;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${F.riderId} bei Km ${F.triggerDistanceKm}. Potenziell betroffene Fahrer (${(z=F.massCrashPotentialRiderIds)==null?void 0:z.length}):`,F.massCrashPotentialRiderIds)})}const o=t.riders.map(T=>{const F={rider:T,riderName:`${T.firstName} ${T.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:Dd(),microForm:Gr(),nextFormUpdateMeter:le(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(T.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(F),F}),d=new Map(o.map(T=>[T.rider.id,T.dailyForm]));this.stageFavorites=kl(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d});const l=this.stageFavorites.filter(T=>T.kind==="rider"&&T.riderId!=null).slice(0,15).map(T=>t.riders.find(F=>F.id===T.riderId)??null).filter(T=>T!=null),g=((B=t.gcStandings.find(T=>T.rank===1))==null?void 0:B.riderId)??null,m=Zl(l,t.stage,t.stageSummary,T=>Math.max(1,Math.pow(10,(T.skills.attack-65)/10))*(T.id===g?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const T of m){const F=this.precalculatedStageAttacksByRiderId.get(T.riderId)??[];F.push(T),this.precalculatedStageAttacksByRiderId.set(T.riderId,F)}this.breakawayPlan=Gl(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings);const u=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=u.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=u.fallbackCheckpointsMeters;for(const T of o)T.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const p=Ml(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d}),h=new Map(p.map(T=>[T.id,T])),f=o.map(T=>{const F=h.get(T.rider.id)??T.rider;return{...T,rider:F,riderName:`${F.firstName} ${F.lastName}`,dailyForm:T.dailyForm+(F.specialFormDelta??0)}}),b=p.filter(T=>T.hasSuperform),S=p.filter(T=>T.hasSupermalus);(b.length>0||S.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:b.map(T=>`${T.firstName} ${T.lastName}`),supermalus:S.map(T=>`${T.firstName} ${T.lastName}`)});const $=this.resolveStartOrder(f),w=new Map((this.bootstrap.teamStartOrder??[]).map((T,F)=>[T,F]));this.riders=$.map((T,F)=>({...T,startOffsetSeconds:this.resolveStartOffsetSeconds(T,F,w)})),this.riders.forEach(T=>this.syncRiderTelemetry(T));for(const T of this.riders){const F=T.rider.homeEffectSkills,z=R=>Fd[R]||R;if(T.rider.homeEffect==="super_home"){const R=F&&F.length===5?`${z(F[0])} (+3), ${z(F[1])} (+1), ${z(F[2])} (+1), ${z(F[3])} (+1), ${z(F[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${R})`})}if(T.rider.homeEffect==="home_pressure"){const R=F?F.map(z).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${R})`})}if(T.rider.homeEffect==="normal_home"){const R=F?F.map(z).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${R})`})}T.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),T.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),T.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:T.rider.id,riderName:T.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(T.rider.id,T.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const M=this.bootstrap.stage.rolledWetterName??"Sonnig",x=this.bootstrap.stage.rolledEffektSturz??0,D=this.bootstrap.stage.rolledEffektDefekt??0,C=this.bootstrap.stage.rolledWindkantenGefahr??0,A=this.bootstrap.stage.rolledEffektFatigue??0,N=this.bootstrap.stage.rolledBreakawayBonus??0,P=[];x>0&&P.push(`Sturzwahrscheinlichkeit +${x.toFixed(1)}%`),D>0&&P.push(`Defektwahrscheinlichkeit +${D.toFixed(1)}%`),C>0&&P.push(`Windkanten-Gefahr +${(C*100).toFixed(1)}%`),A>0&&P.push(`Fatigue +${A.toFixed(1)}%`),N>0&&P.push(`Ausreißer-Bonus +${N.toFixed(1)}`);const L=P.length>0?`Wettereinflüsse: ${P.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${M}`,detail:L})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const s=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(s),a-=s}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(s=>({riderId:s.rider.id,riderName:s.riderName,startOffsetSeconds:s.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(s),hasStarted:s.hasStarted||Z(s),distanceCoveredMeters:s.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-s.distanceCoveredMeters),segmentStartKm:s.segmentStartKm,segmentEndKm:s.segmentEndKm,segmentStartElevation:s.segmentStartElevation,segmentEndElevation:s.segmentEndElevation,activeTerrain:me(s)?"Finish":s.activeTerrain,skillName:me(s)?"Finish":s.skillName,skillBreakdown:me(s)?"":s.skillBreakdown,baseSkill:s.baseSkill,teamGroupBonus:s.teamGroupBonus,effectiveSkill:s.effectiveSkill,staminaPenalty:s.staminaPenalty,elevationPenalty:s.elevationPenalty,dailyForm:s.dailyForm,microForm:s.microForm,gradientPercent:s.gradientPercent,gradientModifier:s.gradientModifier,windModifier:s.windModifier,draftModifier:s.draftModifier,draftNearbyRiderCount:s.draftNearbyRiderCount,draftPackFactor:s.draftPackFactor,currentSpeedMps:s.currentSpeedMps,photoFinishScore:s.photoFinishScore,leadoutBonus:s.leadoutBonus,leadoutRiderId:s.leadoutRiderId,leadoutContributions:s.leadoutContributions,lastSplitLabel:s.lastSplitLabel,lastSplitTimeSeconds:s.lastSplitTimeSeconds,splitTimes:{...s.splitTimes},finishTimeSeconds:Number.isFinite(s.finishTimeSeconds??Number.NaN)?s.finishTimeSeconds:null,finishStatus:s.finishStatus,statusReason:s.statusReason,isAttacking:s.isAttacking,isBreakaway:s.isBreakaway,isLeadingGroup:s.isLeadingGroup,hasSuperform:s.rider.hasSuperform===!0,hasSupermalus:s.rider.hasSupermalus===!0,isFinished:me(s)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(s=>s.appliedIncident?[s.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus}}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let s=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(s=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(s==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,d)=>Math.max(o,d.distanceCoveredMeters),0);s=Number((i/1e3).toFixed(2))}const r={id:this.nextMessageId,...t,riderTeamId:a,kmMark:s};this.messages.unshift(r),this.allEvents.push(r),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(s=>[s.rider.id,s]));return this.intermediateMarkers.map(s=>{const r=t.map(i=>i.markerCrossings[s.key]??null).filter(i=>i!=null),n=Bd(r,!this.isTimeTrialMode,s.markerType,a,this.isClimberMalusStage());return{markerKey:s.key,markerLabel:s.label,markerType:s.markerType,markerCategory:s.markerCategory,kmMark:s.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isTimeTrialMode?[...this.riders].sort(di):_d(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(r=>r.finishStatus!=="dnf").reduce((r,n)=>Math.max(r,n.distanceCoveredMeters),0);let s=0;for(const r of t)me(r)&&(s+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:s,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(Z)}advanceSubstep(t){const a=this.elapsedSeconds,s=a+t,r=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();this.updateBreakawayPhaseState();for(const l of this.riders){if(Z(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&s<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const g=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,s-g);if(m<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-m),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const u=this.currentSegment(l),p=this.currentWindZone(l);if(!u||!p){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=g,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const f=Pt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage()),b=this.calculateSprintLeadoutBonus(l);l.photoFinishScore+=f+b,l.leadoutBonus=b;continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,r);const h=this.calculateBasePhysics(l,u,p);l.activeTerrain=u.terrain,l.skillName=h.skillName,l.skillBreakdown=h.skillBreakdown,l.baseSkill=h.baseSkill,l.teamGroupBonus=h.teamGroupBonus,l.effectiveSkill=h.effectiveSkill,l.staminaPenalty=h.staminaPenalty,l.elevationPenalty=h.elevationPenalty,l.gradientPercent=h.gradientPercent,l.gradientModifier=h.gradientModifier,l.windModifier=h.windModifier,l.tempSpeedMps=h.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=h.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*m}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,s);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const g of this.riders)l.push(g);l.sort(Gd);for(let g=0;g<l.length;g+=1){const m=l[g];if(Z(m))continue;const u=this.isActiveBreakawayRider(m),p=m.tempSpeedMps/14,h=Math.max(5,50*p),f=this.currentSegment(m),b=Math.max(15,150*p),S=Math.max(h,Math.min(b,Cd(f==null?void 0:f.terrain))),$=zd(l,g,S),w=$.size,M=Hr(w),x=Kd(w,$.positionInGroup);let D=0,C=Number.POSITIVE_INFINITY,A=null;for(let re=g-1;re>=0;re-=1){const $e=l[re],oe=$e.distanceCoveredMeters-m.distanceCoveredMeters;if(oe>=S+cd)break;!this.canReceiveDraftFromCandidate(m,$e)||this.isActiveBreakawayRider($e)||oe<=0||oe>=S||(D+=1,oe<=C&&(C=oe,A=$e))}if(D===0||!A){if(u)continue;m.draftModifier=1,m.draftNearbyRiderCount=0,m.draftPackFactor=0,m.currentSpeedMps=m.tempSpeedMps,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,m.isLeadingGroup=!0,this.applyCaptainWaitLogic(m);continue}const N=Z(A)?A.tempSpeedMps:A.currentSpeedMps,P=C,L=P<=h?1:1-(P-h)/Math.max(1e-4,S-h),_=this.currentWindZone(m),B=(_==null?void 0:_.vector)??0,T=(_==null?void 0:_.windSpeedKph)??0,F=-B*(T/70),R=Math.max(.3,.35+.35*F)*Math.min(1,p)*Pr,I=ie((f==null?void 0:f.gradient_percent)??0,-20,20),E=_r(I),Y=1+(x?0:R*L*M*E),X=m.tempSpeedMps*Y;if(!(u&&Y<=m.draftModifier)){if(m.draftModifier=Y,m.draftNearbyRiderCount=w,m.draftPackFactor=M,m.isLeadingGroup=x,X>N){if(m.tempSpeedMps>A.tempSpeedMps){m.currentSpeedMps=X,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t;continue}if(P<1){m.currentSpeedMps=N,m.nextDistanceCoveredMeters=A.distanceCoveredMeters+N*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=Math.min(X,N+2),m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=X,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(Z(l)||this.isTimeTrialMode&&s<=l.startOffsetSeconds)continue;const g=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,s-g);if(m<=0)continue;const u=l.distanceCoveredMeters,p=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*m,h=l.pendingIncident;if(h&&u<h.triggerDistanceMeters&&p>=h.triggerDistanceMeters){const S=Math.max(.1,l.currentSpeedMps),$=Math.max(0,(h.triggerDistanceMeters-u)/S);l.distanceCoveredMeters=h.triggerDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps),this.applyIncident(l,h,g+$),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const f=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,p-l.distanceCoveredMeters)>=f){const S=f/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps),l.finishTimeSeconds=g+S,l.currentSpeedMps=0;const $=Pt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage()),w=this.calculateSprintLeadoutBonus(l);l.photoFinishScore+=$+w,l.leadoutBonus=w}else l.distanceCoveredMeters=p,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,g,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,u,l.distanceCoveredMeters,g),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-m),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!Z(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=Gr(),l.nextFormUpdateMeter+=le(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),g=this.riders.filter(u=>l.has(u.rider.id)&&!Z(u)),m=this.riders.filter(u=>!l.has(u.rider.id)&&!Z(u));if(g.length>0&&m.length>0){const u=g.reduce((h,f)=>f.distanceCoveredMeters>h.distanceCoveredMeters?f:h,g[0]);m.reduce((h,f)=>f.distanceCoveredMeters>h.distanceCoveredMeters?f:h,m[0]).distanceCoveredMeters>=u.distanceCoveredMeters&&(u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:u.rider.id,riderName:u.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${u.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const d=Jl(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of d.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!Z(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const s=new Map;for(const r of this.riders){if(Z(r)||r.rider.activeTeamId==null||a<=r.startOffsetSeconds)continue;const n=s.get(r.rider.activeTeamId)??[];n.push(r),s.set(r.rider.activeTeamId,n)}for(const r of s.values()){const n=r[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,r.length),d=[...r].sort((u,p)=>p.effectiveSkill-u.effectiveSkill||u.rider.id-p.rider.id).slice(0,o).reduce((u,p)=>u+p.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-r.length),g=Math.max(1,d-l),m=this.resolveTimeTrialSpeedMps(g,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*dl(i.terrain,this.bootstrap.skillWeightRules??[]);for(const u of r){const p=Math.max(t,u.startOffsetSeconds),h=Math.max(0,a-p);u.currentSpeedMps=m,u.tempSpeedMps=m,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+m*h}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const r=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?r.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,d=i.rider.activeTeamId!=null?r.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==d?o-d:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(r=>[r.riderId,r.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((r,n)=>{const i=a.get(r.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(r)-this.resolveProjectedIttStartScore(n)||r.rider.id-n.rider.id}):[...t].sort((r,n)=>r.rider.skills.timeTrial-n.rider.skills.timeTrial||r.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,s=0;for(const r of this.bootstrap.stageSummary.segments){const n=(r.start_km+r.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,r.terrain),d=i>0?this.resolveWeightedSkill(t.rider,r.terrain,i):o,l=Math.max(0,o.value-d.value),{effectiveSkill:g}=this.resolveEffectiveSkill({rider:t,baseSkill:d.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),m=ie(r.gradient_percent,-20,20),u=m>0?Math.exp(-.11*m):1-m*.06,p=this.windZones.find(f=>n>=f.startMeter&&n<=f.endMeter)??this.windZones[this.windZones.length-1],h=p?1+p.vector*(p.windSpeedKph/100)*.52:1;a+=g*u*h*r.length_km,s+=r.length_km}return s>0?a/s:0}resolveStartOffsetSeconds(t,a,s){if(this.isIndividualTimeTrial)return a*rd;if(this.isTeamTimeTrial){const r=t.rider.activeTeamId;return(r!=null?s.get(r)??0:0)*nd}return 0}buildIntermediateMarkers(){return Oe(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||st(t)).map(({key:t,label:a,marker:s,kmMark:r})=>({key:t,distanceMeters:r*1e3,label:a,markerType:s.type,markerCategory:s.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(d=>d.distanceMeters<t.groupPhaseEndDistanceMeters),s=this.stageDistanceMeters*Md,r=a.some(d=>d.distanceMeters<=s);if(!(a.length<=1||!r))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(la,Math.ceil(s/la)*la);for(let d=o;d<t.groupPhaseEndDistanceMeters;d+=la)i.push(d);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,s){const r=Nd(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,d=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),g=Math.min(85,o.value)+l,m=this.isTimeTrialMode?0:t.teamGroupBonus,u=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:p,staminaPenalty:h,elevationPenalty:f}=this.resolveEffectiveSkill({rider:t,baseSkill:g,staminaPenalty:d,teamGroupBonus:m,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:u}),b=ie(a.gradient_percent,-20,20),S=b>0?Math.exp(-.11*b):1-b*.06,$=1+s.vector*(s.windSpeedKph/100)*.52,w=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:r,skillBreakdown:o.breakdown,baseSkill:g,teamGroupBonus:m,effectiveSkill:p,staminaPenalty:h,elevationPenalty:f,gradientPercent:b,gradientModifier:S,windModifier:$,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(p,t.distanceCoveredMeters,a,S,$):this.resolveRoadStageSpeedMps(p,t.distanceCoveredMeters,a,S,$,w)}}resolveRoadStageSpeedMps(t,a,s,r,n,i){const o=this.resolveSkillSpreadFactor(a,s),d=this.resolveSegmentElevation(s,a),l=this.resolveElevationSkillSpreadFactor(s,d),u=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,u*r*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const s=Math.max(0,a-pd),r=Math.floor(s/gd);return t.terrain==="Mountain"?1+(r*hd+r*Math.max(0,r-1)*bd/2):1+r*fd}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const s=a.filter(n=>n.activeTerrain===t.activeTerrain);return(s.length>0?s:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,s){if(s<=1)return{draftModifier:1,draftPackFactor:0};const r=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,d=-i*(o/70),g=Math.max(.3,.35+.35*d)*Math.min(1,r)*Pr,m=ie(a.gradient_percent,-20,20),u=_r(m),p=Hr(s);return{draftModifier:1+g*p*u,draftPackFactor:p}}resolveBreakawayTimeGapPenalty(t){if(t<Ar)return 0;const a=Math.floor((t-Ar)/$d);return Td+a}recordBreakawayFallbackCheckpointCrossings(t,a,s,r,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>s)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const d=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?r+d-t.startOffsetSeconds:r+d);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let r=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((d,l)=>l.distanceCoveredMeters-d.distanceCoveredMeters||l.currentSpeedMps-d.currentSpeedMps||d.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,r;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const d=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!d)break;const l=n.markerCrossings[d.key]??null;if(!l)break;const g=t.map(m=>m.markerCrossings[d.key]??null).filter(m=>m!=null).sort((m,u)=>m.crossingTimeSeconds-u.crossingTimeSeconds||m.riderId-u.riderId)[0]??null;if(g){const m=l.crossingTimeSeconds-g.crossingTimeSeconds;r=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:r,kmMark:d.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const d=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[d]??null;if(l==null)break;const g=t.map(m=>m.breakawayFallbackCheckpointTimes[d]??null).filter(m=>m!=null).sort((m,u)=>m-u)[0]??null;if(g!=null){const m=l-g;r=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:r,kmMark:d<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[d]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return r}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),s=this.riders.filter(o=>!Z(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),r=this.riders.filter(o=>!Z(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(s.length===0||r.length===0){this.breakawayGapStatus=null;return}const n=[...s].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null,i=[...r].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const d=this.intermediateMarkers[o];if(!d)continue;const l=n.markerCrossings[d.key]??null,g=i.markerCrossings[d.key]??null;if(!l||!g)continue;const m=g.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:d.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const d=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(d==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,g=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||g==null)continue;const m=g-l;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:d/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const s=new Set(a.riderIds),r=this.riders.filter(o=>!Z(o)&&s.has(o.rider.id));if(r.length===0)return;const n=this.riders.filter(o=>!Z(o)&&!s.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(r,n);for(const o of r)o.breakawayGapPenalty=i;for(const o of r){const d=this.currentSegment(o);if(!d)continue;const g=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=g,o.tempSpeedMps=this.resolveRoadStageSpeedMps(g,o.distanceCoveredMeters,d,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(d.terrain));const m=this.resolveMaxBreakawayDraftModifier(o,d,r.length);o.draftModifier=m.draftModifier,o.draftNearbyRiderCount=Math.max(0,r.length-1),o.draftPackFactor=m.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*m.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,s,r,n){return this.resolveRoadStageSpeedMps(t,a,s,r,n,.5)}syncRiderTelemetry(t,a=null){var i;const s=this.currentSegment(t),r=this.currentWindZone(t);if(Z(t)||!s||!r){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,s,r);t.segmentStartKm=s.start_km,t.segmentEndKm=s.end_km,t.segmentStartElevation=s.start_elevation,t.segmentEndElevation=s.end_elevation,t.activeTerrain=s.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),s=this.riders.reduce((n,i)=>Z(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(s<=t.phaseEndDistanceMeters)return!1;let r=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(s<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<Id){n.breakawayMalus=0,r=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),d=Math.floor(o/xd),l=Math.min(Rd,n.breakawayInitialMalus),g=Math.max(l,n.breakawayInitialMalus-d*wd),m=wt(g);m!==n.breakawayMalus&&(n.breakawayMalus=m,r=!0)}return r}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const s=new Set(a.riderIds);for(const r of this.riders)Z(r)||!s.has(r.rider.id)||this.syncRiderTelemetry(r,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(r=>t.riderIds.includes(r.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const r of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:r.rider.id,riderName:r.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(r.rider.id,r.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let s=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const r of a)r.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),s=!0}if(this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const r of a)r.breakawayMalus=t.malusValue,r.breakawayInitialMalus=t.malusValue,r.breakawayRecoveryStartDistanceMeters=null,r.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return s}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const s=this.riders.filter(o=>!Z(o)&&a.riderIds.includes(o.rider.id));if(s.length===0)return;const r=[...s].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0];if(!r)return;const n=Math.max(.1,r.currentSpeedMps),i=r.distanceCoveredMeters+n*t;for(const o of s){if(Math.max(0,r.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?Wl:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const s=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(s==null||s.isCounterAttack)return!0;const r=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(r==null?void 0:r.isCounterAttack)===!0&&r.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(s=>s.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const s=this.resolvePreStageGcRank(t);return s!=null?`${a} (${s}.)`:a}triggerStageAttacksForRider(t,a,s,r){if(Z(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||s<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(s/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const d=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/d),g=r+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:g,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const m=new Set(this.activeStageAttacksByRiderId.keys()),u=this.stageFavorites.slice(0,20).filter(f=>{if(f.kind!=="rider"||f.riderId==null)return!1;const b=this.riders.find($=>$.rider.id===f.riderId);if(!b||Z(b))return!1;const S=t.distanceCoveredMeters-b.distanceCoveredMeters;return S>=0&&S<=150}),p=ql(u,t.rider.id,m),h=[];for(const f of p){const b=this.riders.find(S=>S.rider.id===f);!b||Z(b)||this.activeStageAttacksByRiderId.has(f)||(this.activeStageAttacksByRiderId.set(f,{riderId:f,remainingSeconds:Cr,startedAtElapsedSeconds:g,triggerDistanceMeters:b.distanceCoveredMeters,durationSeconds:Cr,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),b.isAttacking=!0,h.push({riderId:f,riderName:this.formatRiderWithPreStageGc(f,b.riderName),riderTeamId:b.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:g,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const f of h)this.pushMessage({elapsedSeconds:g,riderId:f.riderId,riderName:f.riderName,type:"counter_attack",tone:"warning",title:`${f.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const s of t){if(s.finishStatus==="dnf")continue;const r=a[a.length-1];if(!r||Math.abs(r.distanceMeter-s.distanceCoveredMeters)>=ia){a.push({riderIds:[s.rider.id],riderCount:1,distanceMeter:s.distanceCoveredMeters,distanceSum:s.distanceCoveredMeters});continue}r.riderIds.push(s.rider.id),r.riderCount+=1,r.distanceSum+=s.distanceCoveredMeters,r.distanceMeter=r.distanceSum/r.riderCount}return a.map(({distanceSum:s,...r})=>r)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!Z(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),s=new Map;let r=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],d=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-d<ia;){const m=a[n].rider.activeTeamId;m!=null&&s.set(m,(s.get(m)??0)+1),n+=1}for(;r<a.length&&d-a[r].distanceCoveredMeters>=ia;){const m=a[r].rider.activeTeamId;if(m!=null){const u=(s.get(m)??0)-1;u<=0?s.delete(m):s.set(m,u)}r+=1}const l=o.rider.activeTeamId,g=l==null?0:Math.max(0,(s.get(l)??0)-1);t.set(o.rider.id,g===0?0:wt(g*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?md:0,s=this.resolveBreakawaySkillBonus(t.rider),r=t.baseSkill+Na(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+s+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,r),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const s=ie(this.stageDistanceMeters/1e3,Sd,kd),r=this.interpolateStaminaDistanceValue(s),n=ie(t,Dr,as),i=(as-n)/(as-Dr),o=r/3+i*r,d=this.stageDistanceMeters<=0?0:ie(a/this.stageDistanceMeters,0,1);return o*d**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=nt[0].kmMark)return nt[0].value;for(let a=0;a<nt.length-1;a+=1){const s=nt[a],r=nt[a+1];if(t<=r.kmMark){const n=Math.max(1e-4,r.kmMark-s.kmMark),i=(t-s.kmMark)/n;return s.value+(r.value-s.value)*i}}return nt[nt.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/ts),s=Math.max(1,Math.ceil(t/ts)),r=le(id,od),n=Array.from({length:s},()=>le(.2,1.2)),i=n.reduce((l,g)=>l+g,0),o=Array.from({length:a+1},()=>1);o[0]=r;let d=0;for(let l=1;l<=s;l+=1)d+=n[l-1]??0,o[l]=r+(1-r)*(d/i);return o}resolveSkillSpreadFactor(t,a){const s=this.stageDistanceMeters<=0?1:ie(t/this.stageDistanceMeters,0,1),r=Math.min(this.spreadCurve.length-1,Math.floor(s/ts)),n=this.spreadCurve[r]??1;if(s<=this.lateStageStartRatio)return n;const i=cl(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),d=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=ie((s-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),g=this.interpolateFinalSpread(o,l);if(o<=1&&d<=1)return n;if(s<this.finalPushStartRatio||d<=o)return Math.max(n,g);const m=ie((s-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),u=o+(d-o)*m;return Math.max(n,u)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const s=jn(this.simulationMode,t,this.skillWeightRuleMap).map(r=>({key:r.key,weight:r.weight}));return this.weightedSkillComponentsByTerrain.set(t,s),s}resolveWeightedSkill(t,a,s=0){const r=this.resolveWeightedSkillComponents(a),n=s>0||t.mentorBoosts?{...t.skills}:t.skills;if(s>0&&(n.stamina=Math.max(0,n.stamina-s)),t.mentorBoosts)for(const[l,g]of Object.entries(t.mentorBoosts))typeof g=="number"&&(n[l]+=g);let i=0,o=0;for(const l of r)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:ll(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,r)}}resolveSkillBreakdown(t,a,s){const r=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(r);if(n!==void 0)return n;const i=Pd(t,s);return this.skillBreakdownCache.set(r,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const s=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,r=Math.max(0,100-s)/1e3,n=this.resolveElevationBucket(a);return r*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const s=a??this.interpolateElevation(t.distanceCoveredMeters),r=this.resolveElevationBucket(s);return r===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=r,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,s)),t.elevationPenalty}resolveSegmentElevation(t,a){const s=t.start_km*1e3,r=t.end_km*1e3,n=Math.max(1e-4,r-s),i=ie((a-s)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const r=ie(t,0,this.stageDistanceMeters)/1e3;if(r<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(r<=o.kmMark){const d=Math.max(1e-4,o.kmMark-i.kmMark),l=(r-i.kmMark)/d;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),ss(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var m;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(me).sort((u,p)=>(u.finishTimeSeconds??0)-(p.finishTimeSeconds??0)||p.photoFinishScore-u.photoFinishScore||u.rider.id-p.rider.id);if(t.length===0)return;const a=[];let s=null;for(const u of t){const p=u.finishTimeSeconds??0;if(a.length===0){a.push(u),s=p;continue}if(s!=null&&p-s<=Ca){a.push(u),s=p;continue}break}const r=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=u=>u.photoFinishScore,o=[...a].sort((u,p)=>i(p)-i(u)||u.rider.id-p.rider.id),d=((m=o[0])==null?void 0:m.finishTimeSeconds)??0,l=this.finishWeightProfile,g=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${g} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${Ca.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${r}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((u,p)=>{const h=Hd(u,l).map(x=>`${li[x.skillKey]} ${x.contribution.toFixed(2)} = ${x.effectiveSkill.toFixed(2)} x ${(x.weight*100).toFixed(0)}%`).join(" | "),f=u.finishTimeSeconds??0,b=f-d,S=b<=1e-4?`${f.toFixed(2)} s`:`${f.toFixed(2)} s (+${b.toFixed(2)} s)`,$=this.calculatePhotoFinishScore(u),w=u.leadoutBonus??0,M=Pt(u,r,n);console.log(`#${p+1} Zielsprint | ${u.riderName} | Zeit ${S} | Score (ohne Boni): ${$.toFixed(2)} -> Score (mit Boni): ${u.photoFinishScore.toFixed(2)} [SpecAdj: ${M>0?"+":""}${M.toFixed(2)}, Leadout: +${w.toFixed(2)}] | ID-Tiebreak ${u.rider.id} | (${h})`)}),console.groupEnd()}recordIntermediateSplits(t,a,s,r,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>s)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,d=Math.max(0,this.isTimeTrialMode?r+o-t.startOffsetSeconds:r+o);let l=this.resolveMarkerCrossingScore(t,i);const g=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;g&&(l+=Pt(t,g,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=d,t.splitTimes[i.key]=d,t.splitTimes[i.label]=d,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:d,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return ss(t,this.resolveSprintWeightProfile());const s=ss(t,this.resolveClimbWeightProfile(a.markerCategory)),r=Ed(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return s+r}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??Xl}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??ad[a]}calculatePreLeadoutFinishScore(t){const s=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,r=Na(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[d,l])=>{if(!l)return o;const g=d==="stamina"?s:0,m=Math.max(0,t.rider.skills[d]+r+t.dailyForm+t.microForm+t.teamGroupBonus-g);return o+m*l},0),i=Pt(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}calculateSprintLeadoutBonus(t){const a=this.resolveFinishMarkerType();if(a!=="finish_flat"&&a!=="finish_hill"||t.rider.skills.sprint<74)return 0;const s=t.rider.activeTeamId;if(s==null)return 0;const r=this.riders.filter(p=>p.rider.activeTeamId===s);if(r.length===0)return 0;const n=r.filter(p=>p.finishStatus!=="dnf"&&p.finishStatus!=="otl"&&p.finishStatus!=="dns"&&p.rider.skills.sprint>=74);if(n.length===0)return 0;let i=this.teamBestSprinterRiderId.get(s);if(i===void 0){let p=null,h=Number.NEGATIVE_INFINITY;for(const f of n){const b=this.calculatePreLeadoutFinishScore(f);b>h?(h=b,p=f):b===h&&p!==null&&(f.rider.skills.sprint>p.rider.skills.sprint||f.rider.skills.sprint===p.rider.skills.sprint&&f.rider.id<p.rider.id)&&(p=f)}p?(i=p.rider.id,this.teamBestSprinterRiderId.set(s,i)):i=-1}if(i!==t.rider.id)return 0;let o=this.teamSprintRandomValues.get(s);o===void 0&&(o=le(.25,.6),this.teamSprintRandomValues.set(s,o));let d=this.teamSprintSpecialRandomValues.get(s);d===void 0&&(d=le(.1,.3),this.teamSprintSpecialRandomValues.set(s,d)),t.leadoutRiderId=null;let l=0,g=0,m=null;const u=[];for(const p of r){if(p.rider.id===t.rider.id||p.finishStatus==="dnf"||p.finishStatus==="otl"||p.finishStatus==="dns")continue;let h=0;const f=p.rider.skills.sprint>=72,b=p.rider.skills.flat>=78,S=p.rider.skills.timeTrial>=76,$=p.rider.skills.acceleration>=80;if(f&&h++,b&&h++,S&&h++,$&&h++,h>0){const w=f?o:d;let M=1;h===2?M=1.25:h===3?M=1.5:h===4&&(M=2);const x=w*M*1.5;if(l+=w*M,u.push({riderId:p.rider.id,name:p.riderName,contribution:Number(x.toFixed(2))}),w*M>g)g=w*M,m=p.rider.id;else if(w*M===g&&m!==null){const D=this.riders.find(C=>C.rider.id===m);D&&p.rider.skills.sprint>D.rider.skills.sprint&&(m=p.rider.id)}}}return l>0&&(t.leadoutRiderId=m,t.leadoutContributions=u),l*1.5}resolveFinishMarkerType(){const t=Oe(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const s=t[a].marker.type;if(s==="finish_flat"||s==="finish_hill"||s==="finish_mountain")return s}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return ed;case"finish_mountain":return td;default:return Ql}}resolveRiderClockSeconds(t){if(me(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,s,r=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(d=>d.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){r=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const d=this.riders.find(g=>g.rider.id===o);if(!d||Z(d))continue;if(Math.abs(d.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const g=hl(d.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(d,g,s,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:s,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:r?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:s,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:r?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:s,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(s=>s.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+ia){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const Wd=300;async function Od(e,t){const a=new ci(e,{maxSubstepSeconds:5});let s=!1;for(;!s;){const r=a.step(Wd);if(s=r.isFinished,t){const n=r.stageDistanceMeters>0?r.leaderDistanceMeters/r.stageDistanceMeters:0,i=e.riders.length>0?r.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const jd=[1,2,5,10,25,50,100,250,500],zr=new WeakMap;function Vd(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function Kr(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Ud(e){const t=zr.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${jd.map(s=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return zr.set(e,a),a}function Wr(e,t){const a=Ud(e);a.timeField&&(a.timeField.textContent=Vd(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${Kr(t.snapshot.leaderDistanceMeters)} / ${Kr(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(s=>{const r=Number(s.dataset.raceSimSpeed);s.classList.toggle("active",r===t.timeMultiplier)})}const Yd=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function Zd(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),s=t%60;return`${a}:${String(s).padStart(2,"0")}`}function Et(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function qd(e){return`/jersey/Jer_${e}.png`}function ui(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${Et(qd(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Jd(e){return e.riderId==null||e.riderTeamId==null?"":ui(e.riderTeamId)}function Xd(e){const t=Et(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function Qd(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${Et(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${Et(e)}</button>`}function ec(e,t){if(t==="all")return!0;const a=mi(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function tc(e){const t=e.detail?Et(e.detail):"",a=(e.secondaryRiders??[]).map(r=>`${r.riderTeamId!=null?ui(r.riderTeamId,"race-sim-message-inline-jersey"):""}${Qd(r.riderName,r.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const s=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${s}</span>`}function mi(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function Or(e,t,a="all"){const s=t.filter(n=>ec(n,a)),r=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${Yd.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${s.length===0?`<div class="race-sim-message-empty">${r}</div>`:s.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${Et(mi(n))}">
          <span class="race-sim-message-time">t=${Zd(n.elapsedSeconds)}</span>
          ${Jd(n)}
          <span class="race-sim-message-text">
            ${Xd(n)}
            ${tc(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const ac=1,sc={Flat:12,Rolling:14,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:23,High_Mountain:25,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function rc(e){return Math.max(0,Math.round(e))}function pi(e){return e==="ITT"||e==="TTT"}function nc(e){return sc[e]??20}function ic(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+nc(e)/100))}function oc(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function jr(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function rs(e,t){if(pi(t))return[...e].sort(oc);const a=[...e].sort((o,d)=>o.stageTimeSeconds-d.stageTimeSeconds||jr(o,d)),s=[];let r=[],n=null;const i=()=>{s.push(...r.sort(jr))};for(const o of a){if(r.length===0){r=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=ac){r.push(o),n=o.stageTimeSeconds;continue}i(),r=[o],n=o.stageTimeSeconds}return r.length>0&&i(),s}function V(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function lc(e){return`/jersey/Jer_${e}.png`}function qt(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${V(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${V(lc(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Jt(e,t,a){return e==null?`<span class="${a}" title="${V(t)}">${V(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${V(t)}">${V(t)}</button>`}function dc(e){return e.toFixed(1).replace(".",",")}function Pa(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function cc(e){return`${e??0} Pkt.`}function uc(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function mc(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function gi(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function pc(e){if(e==null||e<=0)return gi(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Qe(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function ca(e){return`${e.toFixed(1).replace(".",",")} km`}function Vr(e){return`${e.toFixed(1).replace(".",",")}%`}function ua(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function Ur(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function gc(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function fc(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function hc(e,t,a){return Array.from({length:t},(s,r)=>e.slice(r*a,(r+1)*a))}function bc(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const s=hc(e,4,5),r=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${s.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=fc(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${qt(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${Jt(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${V(i.roleLabel)}">${V(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?r.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${V(Pa(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${dc(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function jt(e,t){const a=e.riders.find(s=>s.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function ja(e,t){const a=e.riders.find(n=>n.id===t),s=(a==null?void 0:a.activeTeamId)??null,r=s!=null?e.teams.find(n=>n.id===s)??null:null;return{teamId:s,teamName:(r==null?void 0:r.name)??null}}function yc(e,t,a,s={}){const r=(t??[]).slice(0,s.limit??8);return r.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${r.map(n=>{var m;const i=n.riderId??0,o=ja(e,i),d=jt(e,i),l=((m=s.distanceGapsByRiderId)==null?void 0:m.get(i))??null,g=[s.distanceGapClassName??"",mc(l)].filter(u=>u.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${qt(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${Jt(n.riderId,d,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${s.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${g}">${V(uc(l))}</span>`:""}
      </article>`}).join("")}</div>`}function ma(e,t,a,s,r,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${V(e)}</h4>
      ${yc(a,s,r,n)}
    </section>`}function kt(e,t,a,s,r=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${s}" ${r?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${s}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${V(e)}</span>
      </summary>
      ${t}
    </details>`}function La(e,t,a,s){const r=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var d;const i=r.get(n.id)??null,o=((d=a.get(n.id))==null?void 0:d[s])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||jt(e,n.riderId).localeCompare(jt(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function Yr(e){const t=vc(e)?e.stagePoints:0;return`${V(cc("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${V(t)}</span></span>`:""}`}function vc(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function Zr(e,t){if(t==null)return new Map;const a=e.riders.find(s=>s.riderId===t)??null;return a?new Map(e.riders.map(s=>[s.riderId,a.distanceCoveredMeters-s.distanceCoveredMeters])):new Map}function Sc(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function Ta(e,t){var s;const a=(s=e.race.category)==null?void 0:s.bonusSystem;return!a||t==null||t==="Sprint"?[]:Qe(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function _s(e){var s;const t=(s=e.race.category)==null?void 0:s.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return Qe(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return Qe(a?t.pointsMountainStage:t.pointsSprintFinish)}function fi(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:Qe((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function kc(e,t,a){let s=null;for(const r of e.stageSummary.segments){const n=Math.max(t,r.start_km),i=Math.min(a,r.end_km),o=Math.max(0,i-n);if(o<=0)continue;const d={lengthKm:o,gradient:r.gradient_percent};(s==null||d.gradient>s.gradient||d.gradient===s.gradient&&d.lengthKm>s.lengthKm)&&(s=d)}return s}function ns(e,t,a,s=null){return e.entries.filter(r=>s==null||s.has(r.riderId)).map((r,n)=>({riderId:r.riderId,rank:r.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:r.crossingTimeSeconds,gapSeconds:r.gapSeconds})).filter(r=>r.points>0)}function Gs(e){const t=new Map;for(const a of e)for(const s of a.entries){const r=t.get(s.riderId)??{points:0,mountain:0};s.pointsKind==="mountain"?r.mountain+=s.points:r.points+=s.points,t.set(s.riderId,r)}return t}function $c(e){return Oe(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function Da(e,t){const a=pi(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?rc(a):null}function Va(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=Da(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const s=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(s)||s<=0)return rs(a,e.stage.profile).map(n=>n.rider);const r=ic(e.stage.profile,a.map(n=>n.stageTimeSeconds));return r==null?rs(a,e.stage.profile).map(n=>n.rider):rs(a.filter(n=>n.stageTimeSeconds<=r),e.stage.profile).map(n=>n.rider)}function Tc(e,t){const a=_s(e);return a.length===0?[]:Va(e,t).map((s,r)=>({riderId:s.riderId,rank:r+1,points:a[r]??0,pointsKind:"points",crossingTimeSeconds:Da(e,s),gapSeconds:null})).filter(s=>s.points>0)}function Mc(e,t){const a=Va(e,t).slice(0,20),s=a[0]!=null?Da(e,a[0])??0:0;return a.map((r,n)=>{const i=Da(e,r)??0;return{riderId:r.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-s),photoFinishScore:r.photoFinishScore}})}function xc(e,t){var a;return((a=Va(e,t)[0])==null?void 0:a.riderId)??null}function Hs(e,t,a){var w,M;const s=Oe(e.stageSummary),r=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(Va(e,a).map(x=>x.riderId)):null,i=s.filter(({marker:x})=>x.type==="climb_start"),o=s.filter(({marker:x})=>st(x)).sort((x,D)=>x.kmMark-D.kmMark).map((x,D)=>{var I,E;const C=[...i].reverse().find(H=>H.kmMark<=x.kmMark)??null,A=Sc(e,x.kmMark),N=(C==null?void 0:C.kmMark)??(A==null?void 0:A.start_km)??x.kmMark,P=(C==null?void 0:C.elevation)??(A==null?void 0:A.start_elevation)??x.elevation,L=Math.max(0,x.kmMark-N),_=L>0?(x.elevation-P)/(L*1e3)*100:(A==null?void 0:A.gradient_percent)??0,B=kc(e,N,x.kmMark),T=t.find(H=>H.markerKey===x.key)??null,F=Ta(e,(T==null?void 0:T.markerCategory)??x.marker.cat??null),z=T?ns(T,F,"mountain",n):[],R=(T==null?void 0:T.markerCategory)??x.marker.cat??null;return{key:x.key,title:`${D+1}. Bergwertung`,label:x.label,categoryLabel:R?`Kat. ${R}`:null,categoryClassName:Ur(R),kmMark:x.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-x.kmMark),climbLengthKm:L,averageGradient:_,steepestSegmentLengthKm:(B==null?void 0:B.lengthKm)??null,steepestSegmentGradient:(B==null?void 0:B.gradient)??null,highlightMeta:x.kmMark>=r,leaderRiderId:((I=z[0])==null?void 0:I.riderId)??((E=T==null?void 0:T.entries[0])==null?void 0:E.riderId)??null,displayBadges:ua(F,"mountain"),entries:z,timingEntries:(T==null?void 0:T.entries)??[],accent:"mountain"}}),d=s.filter(({marker:x})=>x.type==="sprint_intermediate").sort((x,D)=>x.kmMark-D.kmMark).map((x,D)=>{var P,L;const C=t.find(_=>_.markerKey===x.key)??null,A=fi(e),N=C?ns(C,A,"points",n):[];return{key:x.key,title:`${D+1}. Zwischensprint`,label:x.label,categoryLabel:null,categoryClassName:null,kmMark:x.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-x.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((P=N[0])==null?void 0:P.riderId)??((L=C==null?void 0:C.entries[0])==null?void 0:L.riderId)??null,displayBadges:ua(A,"points"),entries:N,timingEntries:(C==null?void 0:C.entries)??[],accent:"sprint"}}),l=$c(e),g=Tc(e,a),m=l?t.find(x=>x.markerKey===l.key)??null:null,u=m?ns(m,Ta(e,m.markerCategory),"mountain",n):[],p=_s(e),h=m?Ta(e,m.markerCategory):[],f=e.stage.profile==="ITT"||e.stage.profile==="TTT"?Mc(e,a):(m==null?void 0:m.entries)??[],b=((w=g[0])==null?void 0:w.riderId)??((M=u[0])==null?void 0:M.riderId)??xc(e,a),S={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:m!=null&&m.markerCategory?`Kat. ${m.markerCategory}`:null,categoryClassName:Ur((m==null?void 0:m.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(m!=null&&m.markerCategory),leaderRiderId:b,displayBadges:[...ua(p,"points"),...ua(h,"mountain")],entries:[...g,...u],timingEntries:f,accent:"finish"};return[...[...d,...o].sort((x,D)=>x.kmMark-D.kmMark||x.title.localeCompare(D.title,"de")),S].filter(x=>x.entries.length>0||x.timingEntries.length>0||x.accent!=="finish"||l!=null||a.isFinished)}function wc(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),s=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,r=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,s):t.entries.slice(0,s).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return r.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${r.map(n=>{const i=ja(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${qt(i.teamId,i.teamName)}
            ${Jt(n.riderId,jt(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?V(gi(n.crossingTimeSeconds)):V(pc(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function qr(e,t){var a;return((a=e==null?void 0:e.find(s=>s.riderId===t))==null?void 0:a.points)??0}function Jr(e,t){var a;return((a=e.filter(s=>s.riderId!=null&&t.has(s.riderId)).sort((s,r)=>s.rank-r.rank||s.riderId-r.riderId)[0])==null?void 0:a.riderId)??null}function pa(e,t,a){if(!(!t||e.some(s=>s.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function Rc(e,t,a,s,r){const n=new Set(e.riderIds),i=new Map(t.riders.map(p=>[p.riderId,p])),d=e.riderIds.map(p=>i.get(p)??null).filter(p=>p!=null).sort((p,h)=>{var f,b;return(((f=a.get(p.riderId))==null?void 0:f.rank)??Number.MAX_SAFE_INTEGER)-(((b=a.get(h.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)||p.riderName.localeCompare(h.riderName,"de")||p.riderId-h.riderId}).slice(0,25),l=i.get(Jr(s,n)??-1)??null,g=i.get(Jr(r,n)??-1)??null,m=l!=null&&!d.some(p=>p.riderId===l.riderId),u=g!=null&&!d.some(p=>p.riderId===g.riderId);return d.length>=25&&m&&u&&l.riderId!==g.riderId?(pa(d,l,23),pa(d,g,24),d):(pa(d,l,24),pa(d,g,24),d)}function Ic(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function Fc(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function Xr(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function Ec(e,t){const a=t.riders.filter(r=>e.riderIds.includes(r.riderId)).reduce((r,n)=>Math.max(r,n.distanceCoveredMeters),0),s=Math.max(0,t.leaderDistanceMeters-a);return s>0?`-${Math.round(s)} m`:"—"}function Cc(e,t,a,s,r,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=Yo(a,s),d=a.find(u=>u.label===o)??a[0],l=new Map(e.gcStandings.map(u=>[u.riderId,u])),g=Gs(i),m=Rc(d,t,l,r,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${V(d.label)} <span class="race-sim-group-count">(${d.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${V(Xr(d.previousGapMeters,"-"))}</span>
        <span>Leader ${V(Ec(d,t))}</span>
        <span>Hinten ${V(Xr(d.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${m.map((u,p)=>{const h=l.get(u.riderId)??null,f=ja(e,u.riderId),b=g.get(u.riderId)??{points:0,mountain:0},S=qr(r,u.riderId),$=qr(n,u.riderId),w=Ic(u.riderId,e.classificationLeaders),M=w.length>0?w.map(x=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[x]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${Fc(w)}" title="${V(M)}">${p+1}.</strong>
              ${qt(f.teamId,f.teamName)}
              <span class="race-sim-classification-main">
                ${Jt(u.riderId,u.riderName,`race-sim-group-rider-name${u.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${h?h.rank:"—"} · ${V(h?Pa(h.gapSeconds):"—")} · ${V(u.gapToLeaderMeters>0?`+${Math.round(u.gapToLeaderMeters)} m`:"—")}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${S}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${$}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${b.points>0?`▲ +${b.points}`:" "}</span>
                  <span class="race-sim-breakaway-stage-gain">${b.mountain>0?`▲ +${b.mountain}`:" "}</span>
                </span>
              </span>
            </article>`}).join("")}
      </div>
    </section>`}function Nc(e,t,a,s){const r=Hs(t,a.markerClassifications,a),n=Gs(r),i=La(t,t.pointsStandings,n,"points"),o=La(t,t.mountainStandings,n,"mountain"),d=As(Ds(a.clusters));e.innerHTML=Cc(t,a,d,s,i,o,r)}function Pc(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function Lc(e){const t=Oe(e.stageSummary),a=fi(e)[0]??0,s=_s(e)[0]??0,r=t.filter(({marker:n})=>st(n)).reduce((n,{marker:i})=>n+(Ta(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+s,mountain:r}}function Qr(e){const t=Lc(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function Dc(e){const t=gc(e),a=[`<span class="race-sim-stage-points-meta-pill">${V(ca(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${V(`${ca(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${V(`Länge ${ca(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${V(`Ø ${Vr(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${V(`Steilstes ${ca(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${V(Vr(e.steepestSegmentGradient))}</span>`:""].filter(s=>s.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${V(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${V(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${V(e.label)}">${V(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((s,r)=>`${r>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${s}`).join("")}
    </span>`}function Ac(e,t,a,s=null){const r=s??Hs(e,t,a);return r.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${Qr(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${Qr(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${r.map(n=>{const i=n.leaderRiderId!=null?ja(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?jt(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${Dc(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${Pc(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${qt(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?Jt(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${V(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${wc(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function Bc(e,t,a,s,r,n=new Set){var p,h;const i=Hs(a,s,r),o=Gs(i),d=La(a,a.pointsStandings,o,"points"),l=La(a,a.mountainStandings,o,"mountain"),g=Zr(r,((p=a.gcStandings[0])==null?void 0:p.riderId)??null),m=Zr(r,((h=a.youthStandings[0])==null?void 0:h.riderId)??null),u=f=>!n.has(f);e.innerHTML=`
    ${kt("Stage Favorites",bc(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",u("favorites"))}
    <section class="race-sim-classifications-section">
      ${kt("GC",ma("GC","gc",a,a.gcStandings,f=>V(`GC ${f.rank} · ${Pa(f.gapSeconds)}`),{limit:20,distanceGapsByRiderId:g}),"race-sim-overview-classification race-sim-overview-gc","gc",u("gc"))}
      ${kt("Punktewertung",ma("Punktewertung","points",a,d,Yr),"race-sim-overview-classification race-sim-overview-points","points",u("points"))}
      ${kt("Bergwertung",ma("Bergwertung","mountain",a,l,Yr),"race-sim-overview-classification race-sim-overview-mountain","mountain",u("mountain"))}
      ${kt("Nachwuchsfahrerwertung",ma("Nachwuchsfahrerwertung","youth",a,a.youthStandings,f=>V(`${f.rank}. · ${Pa(f.gapSeconds)}`),{distanceGapsByRiderId:m,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",u("youth"))}
    </section>
    ${kt("Etappenwertungen",Ac(a,s,r,i),"race-sim-overview-stage-scoring","stageScoring",u("stageScoring"))}
  `}const en=new WeakMap,Ke=new WeakMap,tn=new WeakMap,hi=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function j(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function bi(e){return e<=0?"—":`+${Math.round(e)} m`}function zt(e){const t=hi.format(e);return e>0?`+${t}`:t}function is(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function te(e){return hi.format(e)}function ft(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function yi(e){return`+${ft(e)}`}function vi(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function zs(e){return`${(e*3.6).toFixed(1)} km/h`}function _c(e){return`${zt(e)}%`}function ks(e){return`${e.toFixed(1).replace(".",",")} km`}function Si(e){return`${ks(e.segmentStartKm)} - ${ks(e.segmentEndKm)}`}function Gc(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function ki(e){return e.replace(/_/g," ")}function $i(e){return ki(e)}function Hc(e){return ki(e)}function Ti(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function zc(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function Kc(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Mi(e){return Oe(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||st(t)).map(({key:t,label:a})=>({key:t,label:a}))}function Wc(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function Oc(e,t,a,s){var r;return a!=="ITT"&&a!=="TTT"?((r=s.get(t))==null?void 0:r.get(e.riderId))??null:e.splitTimes[t]??null}function xi(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(r=>({label:r.key,displayLabel:r.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${r.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function jc(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function Vc(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function wi(e){const t=en.get(e);if(t)return t;const a=Mi(e),s={splitMarkers:a,columns:xi(e,a,!1),riderById:new Map(e.riders.map(r=>[r.id,r])),teamById:new Map((e.teams??[]).map(r=>[r.id,r])),teamAbbreviationById:new Map((e.teams??[]).map(r=>[r.id,r.abbreviation])),teamNameById:new Map((e.teams??[]).map(r=>[r.id,r.name])),gcByRiderId:new Map((e.gcStandings??[]).map(r=>[r.riderId,r]))};return en.set(e,s),s}function Ri(e,t){const a=e.parentElement,s=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!s)return"";const r=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",s.insertAdjacentElement("beforebegin",l),l})(),n=Ks(e),i=jc(t),o=Vc(i,n),d=Ke.get(e);return(d==null?void 0:d.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),r.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,s.innerHTML=t.map(l=>Uc(l,n)).join(""),Ke.set(e,{layoutKey:o,orderedRiderIds:(d==null?void 0:d.orderedRiderIds)??[],rowsByRiderId:(d==null?void 0:d.rowsByRiderId)??new Map,openDetailRiderId:(d==null?void 0:d.openDetailRiderId)??null,openTeamId:(d==null?void 0:d.openTeamId)??null})),o}function je(e,t){e.textContent!==t&&(e.textContent=t)}function ga(e,t){e.title!==t&&(e.title=t)}function fa(e,t){e.className!==t&&(e.className=t)}function ha(e,t,a){return e.lastValues[t]!==a}function ba(e,t,a){e.lastValues[t]=a}function Ks(e){const t=tn.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return tn.set(e,a),a}function Uc(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${j(e.label)}">${j(a)}</span>`;const s=!t.autoSort&&t.manualSortKey===e.sortKey,r=s?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${s?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${j(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${j(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${j(a)}<span class="race-sim-leaderboard-sort-indicator">${j(r)}</span></button>`}function Yc(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function Zc(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function an(e,t,a,s,r,n,i){if(s.autoSort)return(d,l)=>e.stage.profile==="ITT"?Ii(d,l,t):Qc(d,l);if(!s.manualSortKey)return null;const o=s.manualSortDirection==="asc"?1:-1;return(d,l)=>{if(Se(d)!==Se(l))return Se(d)?1:-1;const g=r.get(d.riderId)??null,m=r.get(l.riderId)??null,u=sn(d,g,s.manualSortKey??"",e,a,n,i),p=sn(l,m,s.manualSortKey??"",e,a,n,i);return Zc(u,p)*o||d.riderId-l.riderId}}function qc(e,t,a){if(e.length!==t.size)return!1;let s=null;for(const r of e){const n=t.get(r);if(!n||s&&a(s,n)>0)return!1;s=n}return!0}function sn(e,t,a,s,r,n,i){const o=s.race.isStageRace&&s.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return s.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?Oc(e,a.slice(6),s.stage.profile,r):null}}function Jc(e,t,a,s,r,n,i,o,d){if(!r.manualSortKey){if(r.autoSort){const u=an(t,a,s,r,n,i,o);return u?[...e].sort(u):[...e]}const m=new Map(r.frozenOrder.map((u,p)=>[u,p]));return[...e].sort((u,p)=>(Se(u)===Se(p)?0:Se(u)?1:-1)||(m.get(u.riderId)??Number.MAX_SAFE_INTEGER)-(m.get(p.riderId)??Number.MAX_SAFE_INTEGER)||u.riderId-p.riderId)}const l=an(t,a,s,r,n,i,o);if(!l)return[...e];const g=new Map(e.map(m=>[m.riderId,m]));return qc(d,g,l)?d.map(m=>g.get(m)).filter(m=>m!=null):[...e].sort(l)}function Xc(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const g=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(g))return!1;const m=Ke.get(e);return m?(m.openTeamId=m.openTeamId===g?null:g,m.openTeamId==null&&(m.openDetailRiderId=null),!0):!1}const s=t.closest("button[data-race-sim-rider-toggle]");if(s){const g=Number(s.dataset.raceSimRiderToggle);if(!Number.isFinite(g))return!1;const m=Ke.get(e);return m?(m.openDetailRiderId=m.openDetailRiderId===g?null:g,!0):!1}const r=Ks(e);if(t.closest("button[data-race-sim-splits-toggle]"))return r.showSplitColumns=!r.showSplitColumns,!r.showSplitColumns&&((l=r.manualSortKey)!=null&&l.startsWith("split:"))&&(r.manualSortKey=null,r.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return r.autoSort=!r.autoSort,r.autoSort?(r.manualSortKey=null,r.frozenOrder=[]):(r.manualSortKey=null,r.manualSortDirection="asc",r.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(g=>Number(g.dataset.raceSimRiderRow)).filter(g=>Number.isFinite(g))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||r.autoSort)return!1;const d=o.dataset.raceSimSortKey;return d?(r.manualSortKey===d?r.manualSortDirection=r.manualSortDirection==="asc"?"desc":"asc":(r.manualSortKey=d,r.manualSortDirection=Yc(d)),r.frozenOrder=[],!0):!1}function rn(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function Se(e){return e.finishStatus==="dnf"}function Ii(e,t,a){if(Se(e)!==Se(t))return Se(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const d=a[o];if(!d)continue;const l=e.splitTimes[d.key],g=t.splitTimes[d.key];if(l!=null&&g!=null&&l!==g)return l-g;if(l!=null&&g==null)return-1;if(l==null&&g!=null)return 1}const s=rn(e,a),r=rn(t,a);if(s!==r)return s?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function Qc(e,t){return Se(e)!==Se(t)?Se(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function Fi(e,t){const a=(t==null?void 0:t.formBonus)??0,s=(t==null?void 0:t.raceFormBonus)??0,r=(t==null?void 0:t.fatigueMalus)??0,n=(t==null?void 0:t.longTermFatigueMalus)??0,i=(t==null?void 0:t.shortTermFatigueMalus)??0,o=e.teamGroupBonus,d=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,g=e.baseSkill+l+a+s+e.dailyForm+e.microForm+o-r-n-i,m=Math.max(0,g-e.staminaPenalty),u=g-m,p=m-e.effectiveSkill;return[`Basis ${te(e.baseSkill)}`,e.isAttacking?`+ Attacke ${te(l)}`:null,`+ S-Form ${te(a)}`,`+ R-Form ${te(s)}`,`+ T-Form ${te(e.dailyForm)}`,`+ Zufällige Form ${te(d)} (skaliert)`,`+ Teambonus ${te(o)}`,`- Fatigue ${te(r)}`,`- Langzeit ${te(n)}`,`- Akut ${te(i)}`,`- Stamina ${te(u)}`,`- HM ${te(p)}`,`= Effektiv ${te(e.effectiveSkill)}`].filter(h=>h!=null)}function eu(e,t){return Fi(e,t).join(`
`)}function tu(e){return zt(Math.max(-2.5,Math.min(2.5,e*2.5)))}function au(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function Ei(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${j(e.riderName)}">${j(e.riderName)}</button>`}function su(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const s=t.get(e.activeTeamId)??"—",r=a.get(e.activeTeamId)??s;return`<span class="race-sim-team-code" title="${j(r)}">${j(s)}</span>`}function Ci(e){return`/jersey/Jer_${e}.png`}function ru(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const s=t.get(e.activeTeamId);if(!s)return"—";const r=a.get(e.activeTeamId)??s.name,n=Ci(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${j(r)}">
      <img
        class="race-sim-team-jersey-img"
        src="${j(n)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function nu(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function iu(e,t,a,s){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=s.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const r=e.splitTimes[t];return r!=null?ft(r):"—"}function Ni(e,t,a){const s=Fi(e,t),r=[{label:"Terrain / Skill",value:`${$i(e.activeTerrain)} / ${Hc(e.skillName)}`},{label:"Aktiver Abschnitt",value:Si(e)},{label:"Segmenthöhe",value:Gc(e)},{label:"Basis",value:te(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${te(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:zt((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:zt((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:is((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:is((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:is((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:te(e.staminaPenalty)},{label:"HM",value:te(e.elevationPenalty)},{label:"T-Form",value:zt(e.dailyForm)},{label:"Zufall",value:tu(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:au(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?vi(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${j(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${j(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${r.map(n=>`<div class="race-sim-rider-detail-item"><span>${j(n.label)}</span><strong>${j(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${s.map(n=>j(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${j(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function ou(e,t,a,s,r,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const d=document.createElement("div");d.className="race-sim-row-grid",o.appendChild(d);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",d.appendChild(l);const g=document.createElement("span");g.className="race-sim-row-flag",g.innerHTML=t?Vo(Kc(t)):"—",d.appendChild(g);const m=document.createElement("span");m.className="race-sim-row-name",m.innerHTML=Ei(e,a),d.appendChild(m);const u=m.querySelector(".race-sim-row-name-btn");if(!u)throw new Error("race-sim-row-name-btn not found");const p=document.createElement("span");p.className="race-sim-row-team-visual",p.innerHTML=ru(t,r,i),d.appendChild(p);const h=document.createElement("strong");h.className="race-sim-row-team",h.innerHTML=su(t,n,i),d.appendChild(h);const f=(P="")=>{const L=document.createElement("strong");return P&&(L.className=P),d.appendChild(L),L},b=f("race-sim-gap"),S=f("race-sim-cell-effective-skill"),$=f(),w=f(),M=f(),x=s.map(()=>f()),D=f(),C=f(),A=f("race-sim-form-state-cell"),N=document.createElement("div");return N.className="race-sim-row-detail-popover hidden",o.appendChild(N),{row:o,rankField:l,nameButton:u,gapField:b,clockField:M,splitFields:x,effectiveSkillField:S,gcRankField:$,gcGapField:w,gradientPercentField:D,speedField:C,formStateField:A,detailPanel:N,initialized:!1,lastValues:{}}}function lu(e,t,a,s,r,n,i,o,d,l,g){const m=(s==null?void 0:s.formBonus)??0,u=(s==null?void 0:s.raceFormBonus)??0,p=d&&l>1?g.get(a.riderId)??null:null,h=Se(a),f=i!=="ITT"&&i!=="TTT"?h?"DNF":"—":a.hasStarted?h?"DNF":a.riderClockSeconds!=null?ft(a.riderClockSeconds):"—":yi(a.startOffsetSeconds);fa(e.row,`race-sim-row${t===1&&!h?" race-sim-row-leader":""}${r?" race-sim-row-detail-open":""}${h?" race-sim-row-dnf":""}`),je(e.rankField,`${t}.`),je(e.gapField,h?"DNF":bi(a.gapToLeaderMeters)),je(e.clockField,f),e.nameButton.setAttribute("aria-expanded",r?"true":"false"),fa(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),ga(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((w,M)=>{const x=e.splitFields[M];if(!x)return;const D=iu(a,w.key,i,o);je(x,D),ga(x,w.label)}),ha(e,"effectiveSkillValue",a.effectiveSkill)&&(je(e.effectiveSkillField,te(a.effectiveSkill)),ba(e,"effectiveSkillValue",a.effectiveSkill));const b=`race-sim-cell-effective-skill ${Ti(a)}`;ha(e,"effectiveSkillClass",b)&&(fa(e.effectiveSkillField,b),ba(e,"effectiveSkillClass",b));const S=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,m,u,a.dailyForm,a.microForm,(s==null?void 0:s.fatigueMalus)??0,(s==null?void 0:s.longTermFatigueMalus)??0,(s==null?void 0:s.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");ha(e,"effectiveSkillTitleKey",S)&&(ga(e.effectiveSkillField,eu(a,s)),ba(e,"effectiveSkillTitleKey",S)),je(e.gcRankField,p?String(p.rank):"—"),je(e.gcGapField,p?vi(p.gapSeconds):"—"),je(e.gradientPercentField,_c(a.gradientPercent)),fa(e.gradientPercentField,zc(a.gradientPercent)),ga(e.gradientPercentField,`${$i(a.activeTerrain)} · ${Si(a)}`),je(e.speedField,zs(a.currentSpeedMps)),e.formStateField.innerHTML=nu(a);const $=[r?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,m,u,(s==null?void 0:s.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(p==null?void 0:p.rank)??"—",(p==null?void 0:p.gapSeconds)??"—",a.skillBreakdown].join("|");ha(e,"detailKey",$)&&(e.detailPanel.innerHTML=r?Ni(a,s,p):"",e.detailPanel.classList.toggle("hidden",!r),ba(e,"detailKey",$)),e.detailPanel.classList.toggle("hidden",!r),e.initialized=!0}function du(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${j(e.name)}">${j(e.name)}</button>`}function cu(e){const t=Ci(e.id);return`
    <span class="race-sim-team-visual" title="${j(e.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${j(t)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function uu(e,t,a){const s=new Map;for(const r of e.riders){const n=a.get(r.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=s.get(i)??[];o.push(r),s.set(i,o)}return t.teams.filter(r=>s.has(r.id)).map(r=>{const n=(s.get(r.id)??[]).slice().sort((g,m)=>m.effectiveSkill-g.effectiveSkill||g.riderId-m.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),d=n.slice(0,o).reduce((g,m)=>g+m.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:r,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,d-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(g=>g.isFinished).length}}).sort((r,n)=>Ii(r.representative,n.representative,Mi(t))||r.team.id-n.team.id)}function mu(e,t,a,s,r){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${j(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${j(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${j(te(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${j(zs(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${j(e.teamClockSeconds!=null?ft(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${j(ks(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&s>1?t.gcByRiderId.get(n.riderId)??null:null,d=r===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${Ei(n,d)}
                <strong>${j(te(n.effectiveSkill))}</strong>
                <span>${j(n.riderClockSeconds!=null?ft(n.riderClockSeconds):"—")}</span>
              </div>
              ${d?Ni(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function pu(e,t,a){var p,h;const s=performance.now(),r=wi(a),n=r.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(f=>({label:f.key,displayLabel:f.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(p=Ke.get(e))==null?void 0:p.layoutKey,d=Ri(e,i),l=Ke.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==d&&(e.innerHTML="");const g=uu(t,a,r.riderById),m=((h=g[0])==null?void 0:h.teamDistanceMeters)??0;return e.innerHTML=g.map((f,b)=>{const S=l.openTeamId===f.team.id;return`
      <article class="race-sim-row${b===0?" race-sim-row-leader":""}${S?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${b+1}.</strong>
          <span class="race-sim-row-name">${du(f.team,S)}</span>
          <span class="race-sim-row-team-visual">${cu(f.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${j(f.team.name)}">${j(f.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${j(bi(Math.max(0,m-f.teamDistanceMeters)))}</strong>
          <strong>${j(f.teamClockSeconds!=null?ft(f.teamClockSeconds):yi(f.representative.startOffsetSeconds))}</strong>
          ${n.map($=>`<strong>${j(f.splitTimes[$.key]!=null?ft(f.splitTimes[$.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${Ti(f.representative)}">${j(te(f.teamEffectiveSkill))}</strong>
          <strong>${j(zs(f.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${S?"":" hidden"}">${S?mu(f,r,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),Ke.set(e,{layoutKey:d,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-s,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:g.length,rowsCreated:g.length,rowsRemoved:0,rowsUpdated:g.length,rowsSkippedInvisible:0,orderChanged:1}}function nn(e,t,a){if(a.stage.profile==="TTT")return pu(e,t,a);const s=performance.now(),r={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=wi(a),{splitMarkers:o}=i,d=Wc(t),l=Ks(e),g=l.showSplitColumns?o:[],m=Ke.get(e);r.prepMs=performance.now()-n;const u=performance.now(),p=Jc(t.riders,a,o,d,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(m==null?void 0:m.orderedRiderIds)??[]);r.sortMs=performance.now()-u;const h=m==null?void 0:m.layoutKey,f=performance.now(),b=Ri(e,xi(a,g,l.showSplitColumns));r.layoutMs=performance.now()-f;const S=Ke.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};h!=null&&h!==b&&(e.innerHTML="",S.rowsByRiderId.clear(),S.orderedRiderIds=[]);const $=p.map(N=>N.riderId),w=new Set($),M=performance.now();for(const[N,P]of S.rowsByRiderId)w.has(N)||(P.row.remove(),S.rowsByRiderId.delete(N),r.rowsRemoved+=1);r.removeRowsMs=performance.now()-M;const x=performance.now();for(let N=0;N<p.length;N+=1){const P=p[N],L=i.riderById.get(P.riderId)??null;let _=S.rowsByRiderId.get(P.riderId);_||(_=ou(P,L,S.openDetailRiderId===P.riderId,g,i.teamById,i.teamAbbreviationById,i.teamNameById),S.rowsByRiderId.set(P.riderId,_),r.rowsCreated+=1)}r.createRowsMs=performance.now()-x;const D=performance.now(),C=S.orderedRiderIds.length===$.length&&S.orderedRiderIds.every((N,P)=>N===$[P]);r.orderCheckMs=performance.now()-D;const A=performance.now();if(!C){const N=document.createDocumentFragment();for(const P of $){const L=S.rowsByRiderId.get(P);L&&N.appendChild(L.row)}e.replaceChildren(N),r.orderChanged=1}r.reorderMs=performance.now()-A;for(let N=0;N<p.length;N+=1){const P=p[N],L=S.rowsByRiderId.get(P.riderId),_=i.riderById.get(P.riderId)??null;if(!L)continue;const B=performance.now();lu(L,N+1,P,_,S.openDetailRiderId===P.riderId,g,a.stage.profile,d,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),r.updateRowsMs+=performance.now()-B,r.rowsUpdated+=1}return Ke.set(e,{layoutKey:b,orderedRiderIds:$,rowsByRiderId:S.rowsByRiderId,openDetailRiderId:S.openDetailRiderId,openTeamId:S.openTeamId}),r.finalizeMs=performance.now()-(s+r.prepMs+r.sortMs+r.layoutMs+r.removeRowsMs+r.createRowsMs+r.orderCheckMs+r.reorderMs+r.visibilityMs+r.updateRowsMs),r.totalMs=performance.now()-s,r.finalizeMs=Math.max(0,r.totalMs-r.prepMs-r.sortMs-r.layoutMs-r.removeRowsMs-r.createRowsMs-r.orderCheckMs-r.reorderMs-r.visibilityMs-r.updateRowsMs),r}const gu=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],fu=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],Pi=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],Li=["Sprint","4","3","2","1","HC"],Aa=.2,hu=7,bu=100,yu=3,vu=50,Su=-2,ku=1,$u=2.5,Tu=-3,Mu=15,xu=200,wu=600,Ru=850;function we(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function Ba(e){return e==="finish_hill"||e==="finish_mountain"}function _a(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function Ws(e,t){return e==="climb_top"||Ba(e)&&_a(t)}function Xt(e){return Math.round(e*10)/10}function Ne(e){return Number(e.toFixed(2))}function dt(e){return`${e.toFixed(2).replace(".",",")} km`}function Di(e){return`${Math.round(e)} hm`}function Iu(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function Os(e){return gu.map(t=>`<option value="${t}"${t===e?" selected":""}>${v(t)}</option>`).join("")}function Fu(e){return fu.map(t=>`<option value="${t}"${t===e?" selected":""}>${v(t)}</option>`).join("")}function Eu(e,t="start",a=0,s=1){const r=Pi.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:we(i)?a===s-1:i==="climb_top"||i==="sprint_intermediate");return(r.includes(e)?r:[e,...r.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${v(i)}</option>`).join("")}function Cu(e){return['<option value="">–</option>',...Li.map(t=>`<option value="${t}"${t===e?" selected":""}>${v(t)}</option>`)].join("")}function on(e){return Pi.indexOf(e)}function Pe(e){return[...e].sort((t,a)=>on(t.type)-on(a.type))}function Vt(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:Pe(e[0].markers)}];let a=0;return e.forEach(s=>{a=Ne(a+s.lengthKm);const r=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),n=t[t.length-1];n.terrain=s.terrain,n.techLevel=s.techLevel,n.windExp=s.windExp,n.markers=Pe([...n.markers,...s.markers]),t.push({kmMark:a,elevation:r,terrain:s.terrain,techLevel:s.techLevel,windExp:s.windExp,markers:Pe(s.endMarkers)})}),t}function Nu(e){return e?" stage-editor-input-invalid":""}function js(e,t){const a=e.segments[t];if(!a)return[];const s=[],r=Pu(e).get(t)??[];return a.lengthKm<Aa&&s.push(`Laenge unter ${Aa.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&s.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&s.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&s.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>we(n.type))&&s.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&s.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>we(n.type))&&s.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{we(n.type)&&s.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&s.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&s.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&s.push(`${n.type} gehoert in den Startmarker-Slot.`),Ws(n.type,n.cat)&&!_a(n.cat)&&s.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&s.push("Sprintmarker erlaubt nur Kategorie Sprint."),we(n.type)&&!Ba(n.type)&&n.cat!=null&&s.push("finish_flat und finish_TT duerfen keine Kategorie haben."),Ba(n.type)&&n.cat!=null&&!_a(n.cat)&&s.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),s.push(...r),[...new Set(s)]}function Pu(e){const t=new Map,a=[],s=(r,n)=>{const i=t.get(r)??[];i.push(n),t.set(r,i)};return e.segments.forEach((r,n)=>{r.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),r.endMarkers.forEach(i=>{var l;if(!Ws(i.type,i.cat))return;if(!i.name){s(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let g=a.length-1;g>=0;g-=1)if(((l=a[g])==null?void 0:l.name)===i.name){o=g;break}const d=o>=0?o:a.length-1;if(d<0){s(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(d,1)})}),a.forEach(r=>{const n=r.name?` "${r.name}"`:"";s(r.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function Lu(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:Ba(e.type)?{...e,cat:_a(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function Ai(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:Du(e.waypoints??[])).map(s=>({...s,startElevation:Math.round(s.startElevation),lengthKm:Number.isFinite(s.lengthKm)?Ne(s.lengthKm):Aa,gradientPercent:Number.isFinite(s.gradientPercent)?Xt(s.gradientPercent):0,techLevel:Number.isFinite(s.techLevel)?s.techLevel:5,windExp:Number.isFinite(s.windExp)?s.windExp:5,markers:ln(s.markers),endMarkers:ln(s.endMarkers)})),waypoints:[]};return rt(t),t}function Du(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const s=e[a],r=e[a+1],n=Ne(r.kmMark-s.kmMark),i=r.elevation-s.elevation,o=Xt(n>0?i/(n*10):0);t.push({startElevation:s.elevation,lengthKm:n,gradientPercent:o,techLevel:s.techLevel??5,windExp:s.windExp??5,terrain:s.terrain??"Flat",markers:s.markers??[],endMarkers:r.markers??[]})}return t}function ln(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function Au(e,t,a){const s=e*a*8+t/12;return s>=95?"HC":s>=68?"1":s>=46?"2":s>=28?"3":"4"}function dn(e){const t=[];let a=null,s=null,r=0;const n=i=>{if(a==null||i==null||i<=a){a=null,s=null,r=0;return}const o=e[a],d=e[i],l=d.kmMark-o.kmMark,g=Math.max(0,d.elevation-o.elevation),m=l>0?g/(l*10):0;g>=bu&&m>=yu&&t.push({startKm:Ne(o.kmMark),endKm:Ne(d.kmMark),distanceKm:Ne(l),gainMeters:Math.round(g),avgGradient:Xt(m),category:Au(l,g,m),startIndex:a,topIndex:i,topElevation:Math.round(d.elevation)}),a=null,s=null,r=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],d=e[i],l=d.elevation-o.elevation;if(a==null&&l>0){a=i-1,s=i,r=0;continue}if(a!=null){if(l>=0){(s==null||d.elevation>=e[s].elevation)&&(s=i),r=0;continue}r+=Math.abs(l),r>=vu&&n(s)}}return n(s),t}function Bu(e){const t=e.segments.some(r=>r.terrain==="Cobble_Hill"),a=e.segments.some(r=>r.terrain==="Cobble"),s=e.climbs.some(r=>r.category==="HC"||r.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":s&&e.elevationGainMeters>=2800?"High_Mountain":s||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function ya(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function _u(e){return e.gainMeters>=wu&&e.topElevation>=Ru?"Mountain":e.gainMeters>xu?"Medium_Mountain":"Hill"}function Gu(e){return e.gradientPercent<Tu?"Abfahrt":e.gradientPercent<$u||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<Mu?"Flat":"Hill"}function Hu(e){if(e.segments.length===0)return;if(e.waypoints=Vt(e.segments),e.sourceFormat==="csv"){const i=dn(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:d,topElevation:l,...g})=>g);return}const t=e.segments.map(i=>i.manualTerrain||ya(i.terrain)?i.terrain:Gu(i)),a=dn(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:d,...l})=>l),a.forEach(i=>{const o=_u(i);if(o)for(let d=i.startIndex;d<i.topIndex;d+=1)e.segments[d].manualTerrain||ya(t[d])||(t[d]=o)});let s=null,r=0;const n=i=>{if(s==null||r<=ku){s=null,r=0;return}for(let o=s;o<i;o+=1)!(e.segments[o].manualTerrain||ya(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");s=null,r=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<Su){s==null&&(s=i),r+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{ya(i.terrain)||(i.terrain=t[o])}),e.waypoints=Vt(e.segments),e.suggestedProfile=Bu(e)}function rt(e){zu(e),cn(e),Hu(e),e.waypoints=Vt(e.segments),cn(e)}function zu(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,s)=>{const r={...a,startElevation:Math.round(s===0?a.startElevation:t),lengthKm:Ne(a.lengthKm),gradientPercent:Xt(a.gradientPercent),markers:Pe(a.markers),endMarkers:Pe(a.endMarkers)};return t=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),r}),e.waypoints=Vt(e.segments)}function cn(e){e.totalDistanceKm=Ne(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,s)=>{if(s===0)return 0;const r=a.elevation-e.waypoints[s-1].elevation;return t+Math.max(0,r)},0)}function Je(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(s=>s.type==="start")||(t.markers=Pe([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(s=>we(s.type))||(a.endMarkers=Pe([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=Vt(e.segments))}function Ku(e,t,a,s){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((r,n)=>{const i=s==="start"&&t===0&&r.type==="start",o=e.filter(g=>we(g.type)).length,d=s==="end"&&t===a-1&&we(r.type)&&o===1,l=!(i||d);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${s}" data-marker-index="${n}">${Eu(r.type,s,t,a)}</select>
        <input type="text" value="${v(r.name??"")}" data-field="markerName" data-marker-scope="${s}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${s}" data-marker-index="${n}">${Cu(r.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${s}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function un(e,t,a,s){const r=s==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${Ku(e,t,a,s)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${s}" data-segment-index="${t}">${r}</button>
    </div>`}function Wu(e,t,a,s,r){if(!c.stageEditorDraft)return;const n=c.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(s==="markerType"){o.type=r;const d=Lu(o);if(o.name=d.name,o.cat=d.cat,we(o.type)){const l=i.filter((g,m)=>m===t||!we(g.type));a==="start"?n.markers=l:n.endMarkers=l}}else s==="markerName"?o.name=r.trim()||null:s==="markerCat"&&(o.cat=r||null);a==="start"?n.markers=Pe(n.markers):n.endMarkers=Pe(n.endMarkers),rt(c.stageEditorDraft),Je(c.stageEditorDraft),ke()}}function Ou(e,t){if(!c.stageEditorDraft)return;const a=c.stageEditorDraft.segments[e];if(!a)return;const s=t==="start"?e===0&&!a.markers.some(r=>r.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===c.stageEditorDraft.segments.length-1&&!a.endMarkers.some(r=>we(r.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(s),a.markers=Pe(a.markers)):(a.endMarkers.push(s),a.endMarkers=Pe(a.endMarkers)),rt(c.stageEditorDraft),Je(c.stageEditorDraft),ke()}function ju(e,t,a){if(!c.stageEditorDraft)return;const s=c.stageEditorDraft.segments[e];s&&(a==="start"?s.markers.splice(t,1):s.endMarkers.splice(t,1),rt(c.stageEditorDraft),Je(c.stageEditorDraft),ke())}function Vu(){y("stage-editor-profile").innerHTML=Os("Flat"),y("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',y("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>'}function Vs(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function Uu(){const e=c.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function Yu(){const e=[...c.stageEditorExistingStages.map(t=>t.raceId),...c.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function Zu(e){var n;const t=y("stage-editor-profile");t.innerHTML=Os(e.suggestedProfile),t.value=e.suggestedProfile,y("stage-editor-stage-id").value=String(Uu()),y("stage-editor-race-id").value=String(Yu());const a=y("stage-editor-details-file");a.value.trim()||(a.value=`${Iu(e.routeName)}.csv`);const s=y("stage-editor-date");!s.value&&((n=c.gameState)!=null&&n.currentDate)&&(s.value=c.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(i=>{i.checked=!0})}function qu(e){y("stage-editor-stage-id").value=String(e.stageId),y("stage-editor-race-id").value=String(e.raceId),y("stage-editor-stage-number").value=String(e.stageNumber),y("stage-editor-date").value=e.date,y("stage-editor-details-file").value=e.detailsCsvFile;const t=y("stage-editor-profile");t.innerHTML=Os(e.profile),t.value=e.profile,y("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),y("stage-editor-final-push-start").value=String(e.finalPushStartPercent),y("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),y("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),y("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(r=>r.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(r=>{r.checked=a.includes(r.value)})}function Bi(e){var s;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((s=e.segments[0])!=null&&s.markers.some(r=>r.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(r=>we(r.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((r,n)=>{js(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...r.markers??[],...r.endMarkers??[]].forEach(i=>{i.cat!=null&&!Li.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function _i(){const e=[],t=Number(y("stage-editor-stage-id").value),a=Number(y("stage-editor-race-id").value),s=Number(y("stage-editor-stage-number").value),r=y("stage-editor-date").value.trim(),n=y("stage-editor-details-file").value.trim(),i=Number(y("stage-editor-final-spread-start").value),o=Number(y("stage-editor-final-push-start").value),d=Number(y("stage-editor-final-spread-difficulty").value),l=Number(y("stage-editor-crash-multiplier").value),g=Number(y("stage-editor-mechanical-multiplier").value);return(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(s)||s<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(r)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(d)||d<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(g)||g<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),e}function Ju(){var a,s;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(r=>r.value).join("|");return{stageId:Number(y("stage-editor-stage-id").value),raceId:Number(y("stage-editor-race-id").value),stageNumber:Number(y("stage-editor-stage-number").value),date:y("stage-editor-date").value.trim(),profile:y("stage-editor-profile").value,detailsCsvFile:y("stage-editor-details-file").value.trim(),startElevation:((s=(a=c.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:s.startElevation)??0,finalSpreadStartPercent:Number(y("stage-editor-final-spread-start").value),finalPushStartPercent:Number(y("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(y("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(y("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(y("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function Xu(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function Qu(e){return["gainMeters","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function Ua(e,t,a){const r=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-r*118),i=54,o=.14+r*.12,d=.26+r*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${d};`}">${Math.round(e)}</span>`}function Us(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),s=Math.round(40-t*22),r=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${r};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function em(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function tm(e,t,a,s){const r=s!=null?` data-stage-profile-open-climb-id="${v(s)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${r}>${e}</button>`}function am(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",s=e.profileScore??e.score,r=[...c.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=r.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span class="text-right">${Us(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${Ua(s,0,100)}
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
    </div>`}function sm(e){const t=r=>r!=null?`${r.toFixed(1).replace(".",",")} km`:"—",a=r=>r!=null?`${Math.round(r).toLocaleString("de-DE")} m`:"—",s=r=>r!=null?`${r.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${Us(e.climbScore??0)}
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
    </div>`}function Gi(e,t,a,s,r,n,i,o){const d=o??Ua(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${tm(d,s,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${r}
      </div>
    </div>`}function ae(e,t,a,s,r){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?s==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${r}-sort="${t}">
        <span class="team-table-sort-label">${v(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function At(){const e=y("stage-editor-stages-table"),t=y("stage-editor-stages-empty"),a=y("stage-editor-stages-meta"),s=e.querySelector("thead"),r=e.querySelector("tbody");if(!r)return;const n=c.stageEditorStagesSort.key,i=c.stageEditorStagesSort.direction;s&&(s.innerHTML=`<tr>
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
    </tr>`);const o=im(c.stageEditorStageRows);r.innerHTML=o.map(d=>`
    <tr>
      <td>${d.stageId}</td>
      <td>${se(d.countryCode||"")}</td>
      <td><strong>${v(d.raceName)}</strong></td>
      <td><strong>${v(ea({stageNumber:d.stageNumber}))}</strong></td>
      <td>${Gi(d.profileScore,0,100,d.stageId,am(d),Ja({name:d.raceName},{stageNumber:d.stageNumber,profile:d.profile}))}</td>
      <td>${ta(d.profile)}</td>
      <td>${dt(d.distanceKm)}</td>
      <td>${Di(d.elevationGainMeters)}</td>
      <td>${d.sprintCount} Sprints</td>
      <td>${d.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${c.stageEditorStageRows.length} vorhandene Etappen`}function Bt(){const e=y("stage-editor-climbs-table"),t=y("stage-editor-climbs-empty"),a=y("stage-editor-climbs-meta"),s=e.querySelector("thead"),r=e.querySelector("tbody");if(!r)return;const n=c.stageEditorClimbsSort.key,i=c.stageEditorClimbsSort.direction;s&&(s.innerHTML=`<tr>
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
    </tr>`);const o=om(c.stageEditorClimbRows);r.innerHTML=o.map(d=>`
    <tr>
      <td>${d.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${v(d.name)}</strong></td>
      <td>${em(d.category)}</td>
      <td>${Gi(d.climbScore,0,350,d.stageId,sm(d),Ja({name:d.raceName},{stageNumber:d.stageNumber,profile:"Mountain"}),d.id,Us(d.climbScore))}</td>
      <td>${se(d.countryCode||"")}</td>
      <td><strong>${v(d.raceName)}</strong></td>
      <td><strong>${v(ea({stageNumber:d.stageNumber}))}</strong></td>
      <td>${Di(d.gainMeters)}</td>
      <td>${dt(d.distanceKm)}</td>
      <td>${d.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${d.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${c.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function rm(e=!1){if(c.stageEditorOverviewLoaded&&!e){At(),Bt();return}c.stageEditorOverviewLoading=!0,At(),Bt();const t=await G.getStageEditorOverview();if(c.stageEditorOverviewLoading=!1,c.stageEditorOverviewLoaded=!0,!t.success||!t.data){c.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),At(),Bt();return}c.stageEditorStageRows=t.data.stages,c.stageEditorClimbRows=t.data.climbs,At(),Bt()}function nm(){const e=y("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+c.stageEditorExistingStages.map(a=>{const s=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${v(a.raceName)} · Etappe ${a.stageNumber}${s}</option>`}).join("")}function im(e){const t=c.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{let r=0;switch(c.stageEditorStagesSort.key){case"stageId":r=a.stageId-s.stageId;break;case"countryCode":r=(a.countryCode||"").localeCompare(s.countryCode||"","de");break;case"raceName":r=a.raceName.localeCompare(s.raceName,"de");break;case"stageNumber":r=a.stageNumber-s.stageNumber;break;case"profile":r=a.profile.localeCompare(s.profile,"de");break;case"distanceKm":r=a.distanceKm-s.distanceKm;break;case"elevationGainMeters":r=a.elevationGainMeters-s.elevationGainMeters;break;case"sprintCount":r=a.sprintCount-s.sprintCount;break;case"climbCount":r=a.climbCount-s.climbCount;break;case"profileScore":r=a.profileScore-s.profileScore;break}return r*t||a.stageId-s.stageId})}function om(e){const t=c.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{let r=0;switch(c.stageEditorClimbsSort.key){case"placementKm":r=a.placementKm-s.placementKm;break;case"name":r=a.name.localeCompare(s.name,"de");break;case"category":r=(a.category??"").localeCompare(s.category??"","de");break;case"countryCode":r=(a.countryCode||"").localeCompare(s.countryCode||"","de");break;case"raceName":r=a.raceName.localeCompare(s.raceName,"de");break;case"stageNumber":r=a.stageNumber-s.stageNumber;break;case"gainMeters":r=a.gainMeters-s.gainMeters;break;case"distanceKm":r=a.distanceKm-s.distanceKm;break;case"avgGradient":r=a.avgGradient-s.avgGradient;break;case"maxGradient":r=a.maxGradient-s.maxGradient;break;case"climbScore":r=a.climbScore-s.climbScore;break}return r*t||a.placementKm-s.placementKm})}function lm(e){return e.map(t=>t.type).join(" | ")}function dm(e){const t=[],a=[];let s=0;return e.segments.forEach((r,n)=>{const i=s,o=Ne(i+r.lengthKm),d=Vs(r);r.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:r.startElevation})}),r.endMarkers.forEach(l=>{if(Ws(l.type,l.cat)&&l.name){let g=-1;for(let m=a.length-1;m>=0;m--)if(a[m].name===l.name){g=m;break}if(g>=0){const m=a[g];a.splice(g,1);const u=Ne(o-m.startKm),p=Math.max(0,d-m.startElevation),h=u>0?Xt(p/(u*10)):0;t.push({name:l.name,startKm:m.startKm,endKm:o,distanceKm:u,gainMeters:p,avgGradient:h,category:l.cat||"4"})}}}),s=o}),t}function cm(e){const t=[];let a=0;return e.segments.forEach(s=>{const r=Ne(a+s.lengthKm);s.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:r})}),a=r}),t}function ke(){nm();const e=c.stageEditorDraft,t=y("stage-editor-import-summary"),a=y("stage-editor-warnings"),s=y("stage-editor-climbs"),r=y("stage-editor-empty"),n=y("stage-editor-chart"),i=y("stage-editor-waypoints-body"),o=y("stage-editor-export-hint"),d=y("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",s.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',r.classList.remove("hidden"),n.innerHTML=mn(null),i.innerHTML=`<tr><td colspan="${hu}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",d.disabled=!0;return}r.classList.add("hidden");const l=Bi(e),g=_i();t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${v(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${dt(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${v(e.suggestedProfile)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const m=[...e.warnings,...l,...g];a.innerHTML=m.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':m.map(f=>`<div class="stage-editor-alert">${v(f)}</div>`).join("");const u=dm(e),p=cm(e);let h="";u.length>0?h+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (${u.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${u.map(f=>`
          <div class="stage-editor-climb" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="color: #fff; font-size: 0.85rem;">${v(f.name)}</strong>
              <span class="stage-editor-climb-category-badge ${f.category==="HC"?"is-hc":`is-cat-${f.category}`}" style="font-size: 0.7rem; padding: 0.1rem 0.35rem;">
                Kat. ${v(f.category)}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-300); display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span>${dt(f.startKm)} - ${dt(f.endKm)}</span>
              <span>·</span>
              <span><strong>${f.distanceKm.toFixed(1).replace(".",",")} km</strong></span>
              <span>·</span>
              <span><strong>${f.gainMeters} hm</strong></span>
              <span>·</span>
              <span><strong>${f.avgGradient.toFixed(1).replace(".",",")}%</strong></span>
            </div>
          </div>
        `).join("")}
      </div>
    `:h+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Bergwertungen definiert (climb_start und climb_top Marker mit gleichem Namen paaren).</p>
    `,p.length>0?h+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (${p.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${p.map(f=>`
          <div class="stage-editor-sprint" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--success); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.85rem;">${v(f.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-300); font-weight: bold;">
              ${dt(f.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:h+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `,s.innerHTML=h,n.innerHTML=mn(e),i.innerHTML=e.segments.map((f,b)=>`
    <tr data-segment-index="${b}" class="${js(e,b).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${b+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${f.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${Nu(f.lengthKm<Aa)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${f.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${Fu(f.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${un(f.markers,b,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${un(f.endMarkers,b,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div class="text-muted" style="min-width:3.5rem;">${Vs(f)} m</div>
          ${um(e,b)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${b}">+</button>
          ${b===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${b}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${b}">✕</button>`:""}
        </div>
      </td>
    </tr>`).join(""),d.disabled=m.length>0,o.textContent=m.length>0?`${m.length} Validierungshinweise vor dem Export.`:`Exportiert ${y("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function um(e,t){const a=js(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(s=>`<div>${v(s)}</div>`).join("")}</div>`}function mn(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,s=24,r=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(h=>h.elevation)),d=Math.max(...n.map(h=>h.elevation)),l=Math.max(1,d-o),g=n.map(h=>{const f=s+h.kmMark/Math.max(i,.1)*(t-s*2),b=a-r-(h.elevation-o)/l*(a-r*2);return{x:f,y:b,waypoint:h}}),m=g.map((h,f)=>`${f===0?"M":"L"} ${h.x.toFixed(1)} ${h.y.toFixed(1)}`).join(" "),u=`${m} L ${(t-s).toFixed(1)} ${(a-r).toFixed(1)} L ${s.toFixed(1)} ${(a-r).toFixed(1)} Z`,p=g.filter(h=>h.waypoint.markers.length>0).map(h=>`
      <line x1="${h.x.toFixed(1)}" y1="${r}" x2="${h.x.toFixed(1)}" y2="${(a-r).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${h.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${v(lm(h.waypoint.markers))}</text>`).join("");return`
    <svg viewBox="0 0 ${t} ${a}" role="img" aria-label="Stage-Profil ${v(e.routeName)}">
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
      ${g.map(h=>`<circle cx="${h.x.toFixed(1)}" cy="${h.y.toFixed(1)}" r="3.5" class="stage-editor-chart-point"></circle>`).join("")}
      <text x="${s}" y="${r-4}" class="stage-editor-chart-scale">${Math.round(d)} m</text>
      <text x="${s}" y="${a-4}" class="stage-editor-chart-scale">${Math.round(o)} m</text>
      <text x="${t-s}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${dt(i)}</text>
    </svg>`}function mm(e,t,a){const s=c.stageEditorDraft;if(!s)return;const r=s.segments[e];r&&(t==="startElevation"?r.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?r.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?r.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(r.terrain=a,r.manualTerrain=!0):t==="techLevel"?r.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(r.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),rt(s),Je(s),ke())}function pm(e){const t=c.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const s={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,s),rt(t),Je(t),ke()}function gm(){const e=c.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],s={startElevation:t?Vs(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(s),rt(e),Je(e),ke()}function fm(e){const t=c.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),rt(t),Je(t),ke()))}async function hm(){var a;const t=(a=y("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}y("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,fe("Route wird importiert……");try{const s=await t.text(),r=await G.importStageRoute({fileName:t.name,fileContent:s});if(!r.success||!r.data){alert(`Import fehlgeschlagen: ${r.error??"Unbekannter Fehler"}`);return}const n=Ai(r.data);c.stageEditorDraft=n,Je(n),Zu(n),ke(),yt("stage-editor")}finally{ue()}}async function bm(){const e=Number(y("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}fe("CSV-Stage wird geladen...");try{const t=await G.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=Ai(t.data.draft);c.stageEditorDraft=a,Je(a),qu(t.data.metadata),ke(),yt("stage-editor")}finally{ue()}}async function ym(){if(!c.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...Bi(c.stageEditorDraft),..._i()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),ke();return}fe("CSV-Dateien werden erstellt……");try{const t=await G.exportStageRoute({metadata:Ju(),draft:c.stageEditorDraft});if(!t.success||!t.data){alert(`Export fehlgeschlagen: ${t.error??"Unbekannter Fehler"}`);return}ys(t.data.stagesFileName,t.data.stagesCsv),ys(t.data.stageDetailsFileName,t.data.stageDetailsCsv)}finally{ue()}}function vm(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",o=>{const d=o.target.closest("button[data-stage-editor-stages-sort]");if(!d)return;const l=d.dataset.stageEditorStagesSort;c.stageEditorStagesSort.key===l?c.stageEditorStagesSort.direction=c.stageEditorStagesSort.direction==="asc"?"desc":"asc":c.stageEditorStagesSort={key:l,direction:Xu(l)},At()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",o=>{const d=o.target.closest("button[data-stage-editor-climbs-sort]");if(!d)return;const l=d.dataset.stageEditorClimbsSort;c.stageEditorClimbsSort.key===l?c.stageEditorClimbsSort.direction=c.stageEditorClimbsSort.direction==="asc"?"desc":"asc":c.stageEditorClimbsSort={key:l,direction:Qu(l)},Bt()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{hm()});const s=document.getElementById("btn-stage-editor-load-existing");s&&s.addEventListener("click",()=>{bm()});const r=document.getElementById("btn-stage-editor-export");r&&r.addEventListener("click",()=>{ym()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",o=>{var l;const d=((l=o.target.files)==null?void 0:l[0])??null;y("stage-editor-file-hint").textContent=d?`${d.name} · ${(d.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",o=>{const d=o.target,l=d.closest("tr[data-segment-index]"),g=d.dataset.field;if(!l||!g)return;const m=Number(l.dataset.segmentIndex);if(Number.isInteger(m)){if(g==="markerType"||g==="markerName"||g==="markerCat"){const u=Number(d.dataset.markerIndex),p=d.dataset.markerScope;if(!Number.isInteger(u)||p!=="start"&&p!=="end")return;Wu(m,u,p,g,d.value);return}mm(m,g,d.value)}}),i.addEventListener("click",o=>{const d=o.target.closest("button[data-segment-action]");if(!d)return;const l=Number(d.dataset.segmentIndex);if(Number.isInteger(l)){if(d.dataset.segmentAction==="insert"){pm(l);return}if(d.dataset.segmentAction==="append"){gm();return}if(d.dataset.segmentAction==="add-marker"){const g=d.dataset.markerScope;if(g!=="start"&&g!=="end")return;Ou(l,g);return}if(d.dataset.segmentAction==="remove-marker"){const g=Number(d.dataset.markerIndex),m=d.dataset.markerScope;if(!Number.isInteger(g)||m!=="start"&&m!=="end")return;ju(l,g,m);return}d.dataset.segmentAction==="delete"&&fm(l)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(o=>{const d=document.getElementById(o);d&&d.addEventListener("change",()=>ke())}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(o=>{o.addEventListener("change",()=>ke())})}let Ye=[],xt=null;const $t=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"];function Ys(e,t){if(e==null)return"";const a=t?v(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const q={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function Ga(e,t,a){const s=Yt(e??null);return`<span class="badge badge-race-category" style="${Wa(s)}; white-space: nowrap; display: inline-block;">${v(e??"Unbekannt")}</span>`}function Zs(e){if(!e)return"-";const t=Yt(e);return`<span class="badge badge-race-category" style="${Wa(t)}; white-space: nowrap; display: inline-block;">${v(e)}</span>`}function Sm(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function km(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${Sm(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function Hi(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";default:return""}}function qs(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";default:return"Etappe"}}function $m(e){return`<span class="rider-stats-final-type ${Hi(e)}">${v(qs(e))}</span>`}function ee(e,t,a){let s="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?s+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?s+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?s+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?s+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?s+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?s+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(s+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${s}" title="${v(a)}: ${e} Siege">${e}</span>`}function pe(e,t,a){let s="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?s+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?s+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?s+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?s+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?s+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?s+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?s+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(s+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${s}" title="${v(a)}: ${e} Siege">${e}</span>`}function Tm(e){return`${e.startDate===e.endDate?Q(e.startDate):`${Q(e.startDate)} - ${Q(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function Ha(e){if(e==null||c.riders.length===0)return null;const a=[...c.riders].sort((s,r)=>(r.seasonPoints??0)-(s.seasonPoints??0)||(r.seasonWins??0)-(s.seasonWins??0)||r.overallRating-s.overallRating||`${s.lastName} ${s.firstName}`.localeCompare(`${r.lastName} ${r.firstName}`,"de")||s.id-r.id).findIndex(s=>s.id===e);return a>=0?a+1:null}function pn(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;default:return 4}}function Mm(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||pn(t.rowType)-pn(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function xm(e){return[...e].map(t=>({...t,rows:Mm(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function zi(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,s=36;const r=Math.max(50,Math.min(85,e));for(let d=1;d<t.length;d++){const l=t[d-1],g=t[d];if(r<=g.score){const m=(r-l.score)/(g.score-l.score);a=Math.round(l.hue+(g.hue-l.hue)*m),s=Math.round(l.lightness+(g.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function Xe(e,t,a,s){const r=s>0?Math.max(0,Math.min(1,a/s)):.5,n=Math.round(6+r*118),i=.26+r*.18,o=.14+r*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${v(t)}">${e} ${a}</span>`}function os(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function ls(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return q.mountain;case"Hill":return q.hilly;case"Sprint":return q.sprint;case"Timetrial":return q.timetrial;case"Cobble":return q.cobble;case"Attacker":return q.attacker;default:return""}}function De(e,t,a,s,r){var E,H,Y;const n=(t==null?void 0:t.countryCode)??s??null,i=n?se(n):r,o=(t==null?void 0:t.roleName)??((E=e==null?void 0:e.role)==null?void 0:E.name)??"Ohne Rolle",d=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,g=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",m=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",u=((H=t==null?void 0:t.program)==null?void 0:H.name)??((Y=e==null?void 0:e.seasonProgram)==null?void 0:Y.name)??"-",p=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,h=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,f=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,b=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,S=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,$=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,w=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",M=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,x=(t==null?void 0:t.currentSeasonRank)??Ha((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),D=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,C=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,A=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,N=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},P=Math.max(N.flat,N.hilly,N.mediumMountain,N.mountain,N.timetrial,N.cobble),L=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},_=Math.max(L.stageRace,L.oneDay),B=e!=null&&e.specialization1?os(e.specialization1):"-",T=e!=null&&e.specialization2?os(e.specialization2):"-",F=e!=null&&e.specialization3?os(e.specialization3):"-",z=ls((e==null?void 0:e.specialization1)??null),R=ls((e==null?void 0:e.specialization2)??null),I=ls((e==null?void 0:e.specialization3)??null);return`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${v(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?pt(l,g):""} <span>${v(g)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${v(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${_n(m)} <span>Form</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${zi(d)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${q.seasonForm} ${p>=0?"+":""}${p}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${q.raceForm} ${h>=0?"+":""}${h}</span>
        <span class="rider-stats-icon-pill" title="Programm">${v(u)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${q.raceDays} <span class="rider-stats-icon-pill-value">${f}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${b>14?"text-warning":""}" title="30-Tage Renntage">${q.rollingRaceDays} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${q.longFatigue} <span class="rider-stats-icon-pill-value">${S}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${w!=="none"?"text-error":""}" title="Kurzzeitfatigue">${q.shortFatigue} <span class="rider-stats-icon-pill-value">${$}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${q.seasonPoints} <span class="rider-stats-icon-pill-value">${M}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${q.rank} <span class="rider-stats-icon-pill-value">${km(x)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${q.raceDays} <span class="rider-stats-icon-pill-value">${D}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${q.wins} <span class="rider-stats-icon-pill-value">${C}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${z} ${v(B)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${R} ${v(T)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${I} ${v(F)}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${Xe(q.stageRace,"Rundfahrten Punkte",L.stageRace,_)}
        ${Xe(q.oneDay,"Eintagesrennen Punkte",L.oneDay,_)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${q.breakaway} <span class="rider-stats-icon-pill-value">${A}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${Xe(q.flat,"Flach-Punkte",N.flat,P)}
        ${Xe(q.hilly,"Hügel-Punkte",N.hilly,P)}
        ${Xe(q.mediumMountain,"Mittelgebirge-Punkte",N.mediumMountain,P)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${Xe(q.mountain,"Hochgebirge-Punkte",N.mountain,P)}
        ${Xe(q.timetrial,"Zeitfahren-Punkte",N.timetrial,P)}
        ${Xe(q.cobble,"Kopfsteinpflaster-Punkte",N.cobble,P)}
      </div>
    </div>
  `}function gn(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",s=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${v(a)} <strong>${v(s)}</strong>`}function Ae(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${c.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${c.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${c.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${c.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${c.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${c.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${c.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
    </div>`}function wm(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,s=36;const r=Math.max(55,Math.min(80,e));for(let d=1;d<t.length;d++){const l=t[d-1],g=t[d];if(r<=g.score){const m=(r-l.score)/(g.score-l.score);a=Math.round(l.hue+(g.hue-l.hue)*m),s=Math.round(l.lightness+(g.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function Rm(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},s=["mountain","hill","sprint","timeTrial","cobble","attack"],r=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,d=i/2,l=160,g=60,m=85,u=m-g,p=L=>{const _=[];for(let B=0;B<6;B++){const T=B*Math.PI/3-Math.PI/2;_.push(`${o+L*Math.cos(T)},${d+L*Math.sin(T)}`)}return _},h=`
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
    </defs>`,f=`<circle cx="${o}" cy="${d}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let b="";for(let L=g;L<=m;L+=2.5){const _=l*((L-g)/u);if(_<1){b+=`<circle cx="${o}" cy="${d}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const B=p(_),T=L%5===0,F=T?1:.6,z=T?"none":"4,4",R=T?.4:.18;b+=`<polygon points="${B.join(" ")}" fill="none" stroke="rgba(255,255,255,${R})" stroke-width="${F}" stroke-dasharray="${z}" />`,T&&L>g&&(b+=`<text x="${o+5}" y="${d-_+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${L}</text>`)}let S="",$="";for(let L=0;L<6;L++){const _=L*Math.PI/3-Math.PI/2,B=o+l*Math.cos(_),T=d+l*Math.sin(_);S+=`<line x1="${o}" y1="${d}" x2="${B}" y2="${T}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const F=l+28,z=o+F*Math.cos(_),R=d+F*Math.sin(_),I=Math.cos(_);let E="middle";I>.15?E="start":I<-.15&&(E="end");const H=a[s[L]]??g;$+=`<text x="${z}" y="${R}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${E}" dominant-baseline="middle">${r[L]}</text>`,$+=`<text x="${z}" y="${R+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${E}" dominant-baseline="middle">${H}</text>`}const w=[],M=[];s.forEach((L,_)=>{const B=a[L]??g,T=l*((Math.max(g,Math.min(m,B))-g)/u),F=_*Math.PI/3-Math.PI/2,z=o+T*Math.cos(F),R=d+T*Math.sin(F);w.push(`${z},${R}`),M.push(`<circle cx="${z}" cy="${R}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${r[_]}: ${B}</title></circle>`)});const x=`<polygon points="${w.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,C=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((L,_)=>{const B=a[L.key]??60;return(a[_.key]??60)-B}),A=[],N=[];C.forEach((L,_)=>{const B=a[L.key]??60,T=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${L.label}</span>
        ${wm(B)}
      </div>
    `;_%2===0?A.push(T):N.push(T)});const P=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${A.join("")}</div>
      <div class="skills-col">${N.join("")}</div>
    </div>
  `;return`
    <section class="rider-stats-skills-tab" style="margin-top: 1rem;">
      <div class="rider-stats-skills-container" style="display: grid; grid-template-columns: 540px 1fr; gap: 2rem; align-items: start; background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-primary);">
        <div class="skills-radar-wrapper" style="display: flex; justify-content: center; align-items: center; background: var(--bg-900); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-primary);">
          <svg width="540" height="440" viewBox="0 0 ${n} ${i}" style="overflow: visible;">
            ${h}
            ${f}
            ${b}
            ${S}
            ${x}
            ${M.join("")}
            ${$}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${P}
        </div>
      </div>
    </section>
  `}function Im(e,t){const a=t.shortTermFatigueMalus??0,s=t.longTermFatigueDecayable??0,r=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),d=(s/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const g=t.fatigueHistory??[];let m="";return g.length===0?m='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':m=g.map(u=>{const p=Q(u.date);let h="";u.type==="race"?h=`${v(u.raceName)}${u.stageNumber!=null?` - Etappe ${u.stageNumber}`:""}`:h=u.raceName?v(u.raceName):"Regeneration";const f=u.type==="race"&&u.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${u.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let b="";u.shortChange>0?b=`<span style="color: #ef4444; font-weight: 600;">+${u.shortChange.toFixed(2).replace(".",",")}</span>`:u.shortChange<0?b=`<span style="color: #2ecc71; font-weight: 600;">${u.shortChange.toFixed(2).replace(".",",")}</span>`:b='<span style="color: #666;">0,00</span>';const S=[];if(u.longDecayableChange!==0){const M=u.longDecayableChange>0?"+":"",x=u.longDecayableChange>0?"#ef4444":"#2ecc71";S.push(`<span style="color: ${x}; font-weight: 500;">${M}${u.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(u.longLockedChange!==0){const M=u.longLockedChange>0?"+":"",x=u.longLockedChange>0?"#a855f7":"#2ecc71";S.push(`<span style="color: ${x}; font-weight: 500;">${M}${u.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const $=S.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${S.join("")}</div>`:'<span style="color: #666;">0,00</span>',w=u.shortAfter+u.longAfter;return`
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${p}</td>
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
              Erholungszeit: <strong style="color: #fff;">${d} Tage</strong> (ohne Belastung)
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
  `}function Fm(e){var z;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((R,I)=>I%2===0),s=((z=c.gameState)==null?void 0:z.currentDate)??new Date().toISOString(),r=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(s).getUTCFullYear(),n=new Date(Date.UTC(r,0,1)).getTime(),i=864e5,o=1300,d=384,l=30,g=20,m=a.map(R=>{const E=(new Date(R.date).getTime()-n)/i,H=l+E/365*o,Y=g+d-Math.min(8,Math.max(0,R.totalForm))/8*d;return{x:H,y:Y,form:R.totalForm,date:R.date}});let u="",p="",h="";m.length>0&&(u=`M ${m.map(R=>`${R.x},${R.y}`).join(" L ")}`,p=m.map(R=>`<circle cx="${R.x}" cy="${R.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${R.date}): ${R.form}</title></circle>`).join(""),h=`${u} L ${m[m.length-1].x},${g+d} L ${m[0].x},${g+d} Z`);const f="rgba(251, 191, 36, 0.15)";let b="";for(let R=0;R<=8;R+=2){const I=g+d-R/8*d;b+=`<line x1="${l}" y1="${I}" x2="${l+o}" y2="${I}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,b+=`<text x="${l-5}" y="${I+4}" fill="#ffffff" font-size="10" text-anchor="end">${R}</text>`}let S="";for(let R=0;R<=52;R+=5){const I=l+R/52*o;b+=`<line x1="${I}" y1="${g}" x2="${I}" y2="${g+d}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,S+=`<text x="${I}" y="${g+d+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${R}</text>`}let $="",w="";if(e.peakDates){const R=[...e.peakDates].sort((I,E)=>new Date(I).getTime()-new Date(E).getTime());for(let I=0;I<R.length;I++){const E=R[I],Y=(new Date(E).getTime()-n)/i,X=l+Y/365*o;$+=`<line x1="${X}" y1="${g}" x2="${X}" y2="${g+d}" stroke="#ffffff" stroke-width="2"><title>Peak: ${E}</title></line>`;const re=I>0?(new Date(R[I-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,$e=Y-56,oe=re+14,k=Math.max(0,Math.max($e,oe)),K=Y-k,W=l+k/365*o,O=K/365*o;w+=`<rect x="${W}" y="${g}" width="${O}" height="${d}" fill="rgba(16, 185, 129, 0.1)" />`;const ne=14/365*o;w+=`<rect x="${X}" y="${g}" width="${ne}" height="${d}" fill="rgba(239, 68, 68, 0.1)" />`}}const x=(new Date(s).getTime()-n)/i,D=l+x/365*o;$+=`<line x1="${D}" y1="${g}" x2="${D}" y2="${g+d}" stroke="#ef4444" stroke-width="3"><title>Heute: ${s}</title></line>`,Ye.forEach((R,I)=>{const E=$t[I%$t.length];R.peakDates&&R.peakDates.forEach(H=>{const X=(new Date(H).getTime()-n)/i,re=l+X/365*o;$+=`<line x1="${re}" y1="${g}" x2="${re}" y2="${g+d}" stroke="${E}" stroke-width="1.5" stroke-dasharray="3,3"><title>${R.riderName} Peak: ${H}</title></line>`})});let C="",A="";Ye.forEach((R,I)=>{const E=$t[I%$t.length],H=R.formHistory.filter((Y,X)=>X%2===0).map(Y=>{const re=(new Date(Y.date).getTime()-n)/i,$e=l+re/365*o,oe=g+d-Math.min(8,Math.max(0,Y.totalForm))/8*d;return{x:$e,y:oe,form:Y.totalForm,date:Y.date}});if(H.length>0){const Y=`M ${H.map(X=>`${X.x},${X.y}`).join(" L ")}`;C+=`<path d="${Y}" fill="none" stroke="${E}" stroke-width="2" />`,A+=H.map(X=>`<circle cx="${X.x}" cy="${X.y}" r="3" fill="#fff" stroke="${E}" stroke-width="2"><title>${R.riderName} (${X.date}): ${X.form}</title></circle>`).join("")}});const N=c.teams.filter(R=>R.division==="WorldTour"||R.divisionName==="WorldTour");let P='<option value="">-- Team auswählen --</option>';for(const R of N){const I=xt===R.id?" selected":"";P+=`<option value="${R.id}"${I}>${v(R.name)}</option>`}let L='<option value="">-- Fahrer auswählen --</option>';if(xt!=null){const R=c.riders.filter(I=>I.activeTeamId===xt&&I.id!==e.riderId&&!Ye.some(E=>E.riderId===I.id));for(const I of R)L+=`<option value="${I.id}">${v(I.firstName)} ${v(I.lastName)}</option>`}const _=`
    <div class="rider-compare-controls" style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-primary);">
      <span style="font-weight: 600; color: var(--text-100); font-size: 0.95rem;">Mit anderem Fahrer vergleichen:</span>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-team-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Team (Tier 1):</label>
        <select id="rider-compare-team-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);">
          ${P}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-rider-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Fahrer:</label>
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${xt==null?"disabled":""}>
          ${L}
        </select>
      </div>
    </div>
  `,B=e.currentSeasonRank??Ha(e.riderId)??"–",T=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${v(e.riderName)} (${e.currentSeasonPoints}/${B})">${v(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${B})</span></span>
    </div>
    `];Ye.forEach((R,I)=>{const E=$t[I%$t.length],H=R.currentSeasonRank??Ha(R.riderId)??"–";T.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${E}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${v(R.riderName)} (${R.currentSeasonPoints}/${H})">${v(R.riderName)} <span style="color: var(--text-500);">(${R.currentSeasonPoints}/${H})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${R.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const F=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      ${T.join("")}
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
            ${S}
            ${$}
            ${h?`<path d="${h}" fill="${f}" />`:""}
            ${u?`<path d="${u}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${p}
            ${C}
            ${A}
          </svg>
        </div>
        ${F}
      </div>
    </section>
  `}function Em(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
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
            ${t.map(a=>{var r;const s=e.unavailableUntil?a.startDate<=e.unavailableUntil&&a.endDate>=c.gameState.currentDate:!1;return`
              <tr>
                <td>${v(Za(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${s?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(r=a.country)!=null&&r.code3?se(a.country.code3):"–"}</td>
                <td><strong>${v(a.name)}</strong></td>
                <td>${Ya(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function ht(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${v(e)}</span>`}function Cm(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function Nm(e){return e.finishStatus==="otl"?ht("OTL","place"):e.finishStatus==="dnf"?ht("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${v(String(e.resultRank))}</span>`}function Pm(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":ht(String(e.gcRank),"gc")}function Lm(e){return e.finishStatus==="otl"?fs(e.statusReason,!0):e.finishStatus==="dnf"?fs(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${Ra(e.stageTimeSeconds)}`:e.resultLabel}function Be(e,t,a=!1){var o,d;const s=(e==null?void 0:e.activeTeamId)!=null?((o=c.teams.find(l=>l.id===e.activeTeamId))==null?void 0:o.name)??null:null,r=((d=e==null?void 0:e.country)==null?void 0:d.code3)??(e==null?void 0:e.nationality)??null,n=r?se(r):"",i=t==null?[]:[...t.seasons].map(l=>({...l,raceBlocks:xm(l.raceBlocks)})).sort((l,g)=>g.season-l.season);return a?`
      ${De(e,t,s,r,n)}
      ${Ae(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`:t?c.riderStatsTab==="skills"?`
      ${De(e,t,s,r,n)}
      ${Ae(t)}
      ${Rm(e)}`:c.riderStatsTab==="fatigue"?`
      ${De(e,t,s,r,n)}
      ${Ae(t)}
      ${Im(e,t)}`:c.riderStatsTab==="program"?`
      ${De(e,t,s,r,n)}
      ${Ae(t)}
      ${Em(t)}`:c.riderStatsTab==="form"?`
      ${De(e,t,s,r,n)}
      ${Ae(t)}
      ${Fm(t)}`:c.riderStatsTab==="topResults"?`
      ${De(e,t,s,r,n)}
      ${Ae(t)}
      ${Am(t)}`:c.riderStatsTab==="career"?`
      ${De(e,t,s,r,n)}
      ${Ae(t)}
      ${Bm(t)}`:t.seasons.length===0?`
      ${De(e,t,s,r,n)}
      ${Ae(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`:`
    ${De(e,t,s,r,n)}
    ${Ae(t)}
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
                  <h4>${v(g.raceName)}</h4>
                  <p>${v(Tm(g))}</p>
                </div>
                ${Ga(g.raceCategoryName,g.isStageRace,g.rows.filter(m=>m.rowType==="stage_result").length||null)}
              </div>
              <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
                <table class="data-table rider-stats-table">
                  <colgroup>
                    <col style="width: 9%;">
                    <col style="width: 4%;">
                    <col style="width: 4%;">
                    <col style="width: 3%;">
                    <col style="width: 4%;">
                    <col style="width: 14%;">
                    <col style="width: 20%;">
                    <col style="width: 7%;">
                    <col style="width: 5%;">
                    <col style="width: 5%;">
                    <col style="width: 20%;">
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
                      <th>Profil</th>
                      <th>km</th>
                      <th>HM</th>
                      <th>Ergebnis</th>
                      <th>Punkte</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${g.rows.map(m=>{const u=m.rowType!=="stage_result",p=u?`${m.raceName} · ${qs(m.rowType)}`:m.stageName?`${m.raceName} · ${m.stageName}`:m.raceName;return`
                        <tr class="rider-stats-row${u?" rider-stats-row-final":""}">
                          <td>${v(Q(m.date))}</td>
                          <td>${Nm(m)}</td>
                          <td>${Pm(m)}</td>
                          <td class="rider-stats-breakaway-col">${Cm(m)}</td>
                          <td>${u?"":Ys(m.rolledWeatherId,m.rolledWetterName)}</td>
                          <td>${u?$m(m.rowType):Ga(m.raceCategoryName?m.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):m.raceCategoryName,m.isStageRace)}</td>
                          <td>${v(p)}</td>
                          <td>${u?"–":m.profile?ta(m.profile):"–"}</td>
                          <td>${u?"-":m.distanceKm!=null?v(m.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                          <td>${u?"-":m.elevationGainMeters!=null?v(String(Math.round(m.elevationGainMeters))):"–"}</td>
                          <td>${v(Lm(m))}</td>
                          <td>${m.seasonPoints}</td>
                        </tr>`}).join("")}
                  </tbody>
                </table>
              </div>
            </section>`).join("")}
        </div>
      </section>`).join("")}`:`
      ${De(e,t,s,r,n)}
      ${Ae(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`}function $s(){const e=document.querySelector(".rider-stats-modal-card");e&&(c.riderStatsTab==="career"||c.riderStatsTab==="results"?(e.style.minWidth="min(1180px, 95vw)",e.style.maxWidth="1350px"):(e.style.minWidth="",e.style.maxWidth=""))}async function Ut(e){var d,l,g,m;const t=Te(e),a=(t==null?void 0:t.activeTeamId)!=null?((d=c.teams.find(u=>u.id===t.activeTeamId))==null?void 0:d.name)??null:null;Ye=[],xt=null,c.riderStatsSelectedRiderId=e,c.riderStatsTab="results",$s(),c.riderStatsTopResultsFilterCategory=null,c.riderStatsTopResultsFilterSeason=null,c.riderStatsTopResultsPage=1,y("rider-stats-title").innerHTML=gn(t,null),y("rider-stats-jersey").innerHTML="";const s=t!=null&&t.age?` · Alter ${t.age}`:"";y("rider-stats-meta").textContent=t?`${((l=t.role)==null?void 0:l.name)??"Fahrer"} · ${a??"Team unbekannt"}${s}`:"Historie wird geladen",y("rider-stats-body").innerHTML=Be(t,null,!0),He("riderStats");const r=await G.getRiderStats(e);if(c.riderStatsSelectedRiderId!==e)return;if(!r.success||!r.data){const u=t!=null&&t.age?` · Alter ${t.age}`:"";y("rider-stats-meta").textContent=t?`${((g=t.role)==null?void 0:g.name)??"Fahrer"} · ${a??"Team unbekannt"}${u}`:"Fehler beim Laden",y("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${v(r.error??"Unbekannter Fehler")}</p>
      </section>`;return}c.riderStatsPayload=r.data,$s(),y("rider-stats-title").innerHTML=gn(t,r.data),y("rider-stats-jersey").innerHTML="";const n=r.data.age?` · Alter ${r.data.age}`:t!=null&&t.age?` · Alter ${t.age}`:"",i=r.data.mentorName?` · Mentor: ${r.data.mentorName}`:"",o=r.data.mentoredRiderNames&&r.data.mentoredRiderNames.length>0?` · Mentor von: ${r.data.mentoredRiderNames.join(" - ")}`:"";y("rider-stats-meta").textContent=`${((m=t==null?void 0:t.role)==null?void 0:m.name)??"Fahrer"} · ${r.data.teamName??a??"Ohne aktives Team"}${n} · ${r.data.seasons.length} Saisons${i}${o}`,y("rider-stats-body").innerHTML=Be(t,r.data,!1)}function Dm(){y("rider-stats-body").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-rider-stats-tab]");if(!t){const n=e.target.closest("button[data-remove-compare-id]");if(n){const o=Number(n.dataset.removeCompareId);Ye=Ye.filter(l=>l.riderId!==o);const d=Te(c.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Be(d,c.riderStatsPayload,!1);return}const i=e.target.closest("button[data-top-results-page]");if(i){const o=Number(i.dataset.topResultsPage);if(!isNaN(o)&&o>=1){c.riderStatsTopResultsPage=o;const d=Te(c.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Be(d,c.riderStatsPayload,!1)}}return}const a=t.dataset.riderStatsTab;if(a!=="results"&&a!=="program"&&a!=="form"&&a!=="topResults"&&a!=="skills"&&a!=="career"&&a!=="fatigue"||a==="program"&&(((r=c.riderStatsPayload)==null?void 0:r.programRaces.length)??0)===0)return;c.riderStatsTab=a,$s();const s=Te(c.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Be(s,c.riderStatsPayload,!1)}),y("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){c.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,c.riderStatsTopResultsPage=1;const a=Te(c.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Be(a,c.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){c.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),c.riderStatsTopResultsPage=1;const a=Te(c.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Be(a,c.riderStatsPayload,!1)}else if(t.classList.contains("rider-stats-filter-checkbox")){const a=t.dataset.filterType;c.riderStatsTopResultsFilters[a]=t.checked,c.riderStatsTopResultsPage=1;const s=Te(c.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Be(s,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;xt=a?Number(a):null;const s=Te(c.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Be(s,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const s=Number(a);if(Ye.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const r=await G.getRiderStats(s);r.success&&r.data?Ye.push({riderId:r.data.riderId,riderName:r.data.riderName,teamId:r.data.teamId,teamName:r.data.teamName,formHistory:r.data.formHistory??[],peakDates:r.data.peakDates??[],currentSeasonPoints:r.data.currentSeasonPoints??0,currentSeasonRank:r.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(r.error??""));const n=Te(c.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Be(n,c.riderStatsPayload,!1)}}})}function fn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function Am(e){const t=[];for(const p of e.seasons)for(const h of p.raceBlocks)for(const f of h.rows)t.push({...f,season:p.season,isStageRace:h.isStageRace});const a=Array.from(new Set(t.map(p=>p.raceCategoryName).filter(Boolean)));a.sort((p,h)=>p.localeCompare(h,"de"));const s=Array.from(new Set(t.map(p=>p.season))).sort((p,h)=>h-p);let r=t.filter(p=>p.rowType!=="stage_result"?p.rowType==="gc_final"?c.riderStatsTopResultsFilters.gc:p.rowType==="mountain_final"?c.riderStatsTopResultsFilters.mountain:p.rowType==="points_final"?c.riderStatsTopResultsFilters.points:p.rowType==="youth_final"?c.riderStatsTopResultsFilters.youth:!0:p.isStageRace?c.riderStatsTopResultsFilters.stage:c.riderStatsTopResultsFilters.oneDay);if(c.riderStatsTopResultsFilterCategory){const p=c.riderStatsTopResultsFilterCategory;if(p.endsWith("-etappen")){const h=p.substring(0,p.length-8);r=r.filter(f=>f.raceCategoryName===h&&f.rowType==="stage_result")}else if(p.endsWith("-gc")){const h=p.substring(0,p.length-3);r=r.filter(f=>f.raceCategoryName===h&&f.rowType!=="stage_result")}else r=r.filter(h=>h.raceCategoryName===p)}c.riderStatsTopResultsFilterSeason!=null&&(r=r.filter(p=>p.season===c.riderStatsTopResultsFilterSeason)),r.sort((p,h)=>{if(h.seasonPoints!==p.seasonPoints)return h.seasonPoints-p.seasonPoints;const f=p.rowType!=="stage_result",b=h.rowType!=="stage_result",S=p.resultRank??9999,$=h.resultRank??9999;if(c.riderStatsTopResultsFilterCategory)return S!==$?S-$:f!==b?f?-1:1:0;{const w=fn(p.raceCategoryName),M=fn(h.raceCategoryName);return w!==M?w-M:f!==b?f?-1:1:S-$}});const n=20,i=Math.max(1,Math.min(10,Math.ceil(r.length/n)));c.riderStatsTopResultsPage>i&&(c.riderStatsTopResultsPage=i);const o=(c.riderStatsTopResultsPage-1)*n,d=r.slice(o,o+n),g=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${a.map(p=>{if(p.toLowerCase().includes("stage race")||p.toLowerCase().includes("grand tour")||p.toLowerCase().includes("tour de france")){const f=`${p}-etappen`,b=`${p}-gc`;return`
        <option value="${v(f)}" ${c.riderStatsTopResultsFilterCategory===f?"selected":""}>${v(p)} - Etappen</option>
        <option value="${v(b)}" ${c.riderStatsTopResultsFilterCategory===b?"selected":""}>${v(p)} - GC</option>
      `}else return`<option value="${v(p)}" ${c.riderStatsTopResultsFilterCategory===p?"selected":""}>${v(p)}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="rider-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${s.map(p=>`<option value="${p}" ${c.riderStatsTopResultsFilterSeason===p?"selected":""}>Saison ${p}</option>`).join("")}
        </select>
      </div>
      
      <div class="top-results-checkboxes" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; border-left: 1px solid rgba(255, 255, 255, 0.15); padding-left: 1rem;">
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="gc" ${c.riderStatsTopResultsFilters.gc?"checked":""} style="accent-color: #ffd700; width: 14px; height: 14px; cursor: pointer;">
          nur GC
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="mountain" ${c.riderStatsTopResultsFilters.mountain?"checked":""} style="accent-color: #ff4d4d; width: 14px; height: 14px; cursor: pointer;">
          nur Bergwertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="points" ${c.riderStatsTopResultsFilters.points?"checked":""} style="accent-color: #2ecc71; width: 14px; height: 14px; cursor: pointer;">
          nur Punktewertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="youth" ${c.riderStatsTopResultsFilters.youth?"checked":""} style="accent-color: #ffffff; width: 14px; height: 14px; cursor: pointer;">
          nur Nachwuchs
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="oneDay" ${c.riderStatsTopResultsFilters.oneDay?"checked":""} style="accent-color: #9b59b6; width: 14px; height: 14px; cursor: pointer;">
          One Day Races
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="rider-stats-filter-checkbox" data-filter-type="stage" ${c.riderStatsTopResultsFilters.stage?"checked":""} style="accent-color: #3498db; width: 14px; height: 14px; cursor: pointer;">
          Etappenwertungen
        </label>
      </div>
    </div>
  `,m=d.length===0?'<tr><td colspan="8" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':d.map(p=>{const h=p.rowType!=="stage_result",f=h?`${p.raceName} · ${qs(p.rowType)}`:p.stageNumber&&p.isStageRace?`${p.raceName} · Etappe ${p.stageNumber}`:p.raceName;let b="–",S="–";p.finishStatus==="otl"?b=ht("OTL","place"):p.finishStatus==="dnf"?b=ht("DNF","place"):p.resultRank==null||(h?S=`<span class="rider-stats-final-type ${Hi(p.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${p.resultRank}</span>`:b=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${p.resultRank<=3?` rider-stats-rank-badge-top-${p.resultRank}`:""}">${v(String(p.resultRank))}</span>`);const $=h?"–":p.profile?ta(p.profile):"–",w=!h&&p.stageScore!=null&&p.stageScore>0?Ua(p.stageScore,0,350):"–",M=Ga(p.raceCategoryName?p.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):p.raceCategoryName,p.isStageRace);return`
          <tr class="rider-stats-row${h?" rider-stats-row-final":""}">
            <td>${b}</td>
            <td>${S}</td>
            <td><strong>${v(f)}</strong>${h?"":Ys(p.rolledWeatherId,p.rolledWetterName)}</td>
            <td>${$}</td>
            <td>${w}</td>
            <td>${M}</td>
            <td>Saison ${p.season}</td>
            <td><strong>${p.seasonPoints}</strong></td>
          </tr>
        `}).join(""),u=i>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${c.riderStatsTopResultsPage-1}" ${c.riderStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        ${Array.from({length:i}).map((p,h)=>{const f=h+1;return`<button type="button" class="btn btn-sm ${c.riderStatsTopResultsPage===f?"btn-primary":"btn-secondary"}" data-top-results-page="${f}">${f}</button>`}).join("")}
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${c.riderStatsTopResultsPage+1}" ${c.riderStatsTopResultsPage===i?"disabled":""}>Weiter &raquo;</button>
      </div>
    `:"";return`
    <section class="rider-stats-top-results" style="margin-top: 1.5rem;">
      ${g}
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
  `}function Bm(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),s=(n,i,o,d)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let g="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?g+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?g+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?g+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?g+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?g+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?g+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?g+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"&&(g+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${g}" title="${v(o)}">${n}</span>`},r=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
        ${r.map(n=>{const i=t.categories[n.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${v(n.name)}">${v(n.name)}</span>
                ${Zs(n.key)}
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
                  ${pe(i.winWeather1||0,1,"Sonnig")}
                  ${pe(i.winWeather2||0,2,"Extreme Hitze")}
                  ${pe(i.winWeather3||0,3,"Leichter Regen")}
                  ${pe(i.winWeather4||0,4,"Starkregen")}
                  ${pe(i.winWeather5||0,5,"Starker Wind")}
                  ${pe(i.winWeather6||0,6,"Dichter Nebel")}
                  ${pe(i.winWeather7||0,7,"Schnee/Eis")}
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
  `}const _m=250,Tt=1200,Gm=250,Hm=1200,hn=.2;class zm{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",s=>{var i,o,d,l;const r=s.target.closest("button[data-race-sim-action]");if(r){if(r.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const m=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;m&&((l=(d=this.options).onFinishRequested)==null||l.call(d,m,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=s.target.closest("button[data-race-sim-speed]");if(n){const g=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(g))return;this.timeMultiplier=g,this.render()}}),this.elements.messages.addEventListener("click",s=>{const r=s.target.closest("button[data-race-sim-group-rider-id]");if(r){const d=this.resolveRiderIdFromGroupButton(r);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),Ut(d));return}const n=s.target.closest("button[data-race-sim-group-rider-name]");if(n){const d=this.resolveRiderIdFromGroupButton(n);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),Ut(d));return}const i=s.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),Or(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",s=>{const r=s.target.closest("[data-race-sim-overview-summary]");if(r){const n=r.dataset.raceSimOverviewSummary,i=r.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(s)}),this.elements.groupBox.addEventListener("click",s=>{this.handleGroupInteraction(s)}),this.elements.profile.addEventListener("click",s=>{const r=s.target.closest("button[data-race-sim-timing-mode]");if(!r)return;const n=r.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+Tt,this.render())})}handleGroupInteraction(t){var g,m;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const u=this.resolveRiderIdFromGroupButton(a);u!=null&&this.selectGroupByRiderId(u,this.detailSnapshot);return}const s=t.target.closest("button[data-race-sim-group-nav]");if(!s)return;const r=this.buildRaceGroups(this.detailSnapshot);if(r.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,r.findIndex(u=>u.label===n)),o=s.dataset.raceSimGroupNav==="prev"?-1:1,d=(i+o+r.length)%r.length,l=((g=r[d])==null?void 0:g.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",u=>{const p=u.target.closest(".race-sim-timing-scroll");p&&(this.timingScrollTop=p.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Tt)}),this.elements.profile.addEventListener("wheel",u=>{const p=u.target.closest(".race-sim-timing-scroll");p&&(this.timingScrollTop=p.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Tt)},{passive:!0}),this.elements.profile.addEventListener("scroll",u=>{const p=u.target;!(p instanceof HTMLElement)||!p.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=p.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Tt)},!0),(m=this.elements.sidebar.parentElement)==null||m.addEventListener("click",u=>{if(!this.bootstrap||!this.detailSnapshot||!Xc(this.elements.sidebar,u.target))return;const h=performance.now(),f=nn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(f);const b=performance.now()-h;this.recordPerfTelemetry("sidebarWriteMs",b),this.scheduleSidebarPaintTelemetry(h,b),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new ci(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const s=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(s),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(r=>this.frame(r));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const s=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-s),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(r=>this.frame(r))}render(t=performance.now(),a=!1){var p;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const s=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",r=qo(this.bootstrap.stageSummary),n=[`${r.segmentCount} Segmente`,r.sprintCount>0?`${r.sprintCount} Sprint${r.sprintCount===1?"":"s"}`:null,r.climbCount>0?`${r.climbCount} Bergwertung${r.climbCount===1?"":"en"}`:null].filter(h=>h!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,d=o!=null?i[o]??"":"",l=d?` · ${d}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${s}${n?` · ${n}`:""}${l}`;const g=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=_m,m=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,u=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=Gm;if(g||m||u){const h=performance.now();this.detailSnapshot=((p=this.engine)==null?void 0:p.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-h)}if(g&&this.detailSnapshot){const h=this.elements.profile.querySelector(".race-sim-timing-scroll");h&&(this.timingScrollTop=h.scrollTop);const f=performance.now();sl(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-f),this.lastProfileRenderTime=t;const b=this.elements.profile.querySelector(".race-sim-timing-scroll");b&&(b.scrollTop=this.timingScrollTop)}if(m&&this.detailSnapshot){this.lastSidebarRenderTime=t;const h=performance.now(),f=nn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(f);const b=performance.now()-h;this.recordPerfTelemetry("sidebarWriteMs",b),this.scheduleSidebarPaintTelemetry(h,b)}u&&this.detailSnapshot&&(Or(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),Bc(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),Nc(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),Wr(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const s=a.find(r=>r.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(s)return s.label}return this.selectedGroupLabel!=null&&a.some(s=>s.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return As(Ds(t.clusters))}resolveInitialGroupLabel(t){var a,s;return((a=t.find(r=>r.label==="P"))==null?void 0:a.label)??((s=t[0])==null?void 0:s.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(s=>[s.riderId,s]));return[...t.riderIds].sort((s,r)=>{var n,i;return(((n=a.get(s))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(r))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||s-r})[0]??null}selectGroupByLabel(t,a,s=!0){const r=this.buildRaceGroups(a),n=r.find(i=>i.label===t)??r.find(i=>i.label==="P")??r[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),s&&(this.profileInteractionHoldUntilMs=performance.now()+Tt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const r=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;r&&(this.selectedGroupLabel=r.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+Tt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+Hm,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const s=t.dataset.raceSimGroupRiderName;if(!s)return null;const r=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===s&&(r==null||i.activeTeamId===r))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const s=this.perfTelemetry[t];this.perfTelemetry[t]=s<=0?a:s*(1-hn)+a*hn}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const s=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(s!==this.sidebarPaintSequence)return;const r=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",r),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||Wr(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const Ge="__stage_overview__",Ki="__non_finishers__",Wi="__events__",Oi="__roster__";let Fe="all";function Js(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function bn(e){return Js(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function Km(e){return[...e].sort((t,a)=>bn(t)-bn(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function Wm(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=Js(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function Om(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function jm(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${Q(t.date)}`}async function Ts(e,t){var r;const a=Ia(e);if(a&&(c.selectedResultsRaceId=a.race.id,c.selectedResultsStageId=e),c.riders.length===0){const n=await G.getRiders();n.success&&(c.riders=n.data??[])}const s=await G.getStageResults(e);if(!s.success){c.stageResults=null,be(),!t&&s.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+s.error);return}c.stageResults=s.data??null,c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId,c.selectedResultTypeId=((r=c.stageResults.classifications[0])==null?void 0:r.resultTypeId)??1,c.selectedResultsMarkerKey=Ge,c.selectedResultsSpecialView=null),c.selectedResultsRaceId!=null&&ji(c.selectedResultsRaceId),be()}async function ji(e){if(!c.seasonStandings){const a=await G.getSeasonStandings();a.success&&a.data&&(c.seasonStandings=a.data)}const t=await G.getRaceResultsRoster(e);t.success&&t.data?c.resultsRoster=t.data:c.resultsRoster=null}function Vm(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function yn(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function Um(){const e=c.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=at(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,s=[...e.entries].sort((b,S)=>S.overallRating-b.overallRating),r=new Set(s.slice(0,5).map(b=>b.riderId)),n=b=>{var $;const S=c.riders.find(w=>w.id===b);return(($=S==null?void 0:S.skills)==null?void 0:$.sprint)??0},o=[...e.entries.filter(b=>!r.has(b.riderId))].sort((b,S)=>{const $=n(b.riderId),w=n(S.riderId);return w!==$?w-$:S.overallRating-b.overallRating}),d=new Set(o.slice(0,5).map(b=>b.riderId));function l(b){switch(b){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return b}}const g=new Map;for(const b of e.entries){const S=b.teamId;g.has(S)||g.set(S,{teamId:b.teamId,teamName:b.teamName,riders:[],avgRating:0}),g.get(S).riders.push(b)}for(const b of g.values())b.avgRating=b.riders.reduce((S,$)=>S+$.overallRating,0)/b.riders.length;const m=b=>{let S=Number.POSITIVE_INFINITY;for(const $ of b)!$.hasDropped&&$.gcRank!=null&&$.gcRank<S&&(S=$.gcRank);return S},u=b=>{var $;if(!(($=c.seasonStandings)!=null&&$.riderStandings))return 0;let S=0;for(const w of b){const M=c.seasonStandings.riderStandings.find(x=>x.riderId===w.riderId);M&&M.points>S&&(S=M.points)}return S},p=b=>{if(b==null)return 0;const S=c.riders.filter(M=>M.activeTeamId===b);if(S.length===0)return 0;const $=S.map(M=>M.overallRating??0);$.sort((M,x)=>x-M);const w=$.slice(0,10);return w.length===0?0:w.reduce((M,x)=>M+x,0)/w.length},h=[...g.values()].sort((b,S)=>{const $=m(b.riders),w=m(S.riders);if(($!==Number.POSITIVE_INFINITY||w!==Number.POSITIVE_INFINITY)&&$!==w)return $-w;const M=u(b.riders),x=u(S.riders);if((M>0||x>0)&&M!==x)return x-M;const D=p(b.teamId),C=p(S.teamId);return Math.abs(D-C)>1e-4?C-D:(b.teamName??"").localeCompare(S.teamName??"","de")});for(const b of h)b.riders.sort((S,$)=>yn(S.roleId)-yn($.roleId)||$.overallRating-S.overallRating||S.lastName.localeCompare($.lastName,"de"));return`<div class="results-roster-grid">${h.map(b=>{const S=b.teamId!=null?pt(b.teamId,b.teamName):"",$=b.riders.map(M=>{var X;const x=Vm(M.roleId),D=M.countryCode?et[M.countryCode]??M.countryCode.slice(0,2).toLowerCase():null,C=D?`<span class="fi fi-${D} results-roster-flag" title="${v(M.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',A=`${M.firstName.charAt(0)}. ${M.lastName}`,N=M.roleName??"–",P=M.specialization1?l(M.specialization1):null,L=M.specialization2?l(M.specialization2):null;let _=N;P&&(_+=` · ${P}`),L&&(_+=` · ${L}`);const B=`<span class="results-roster-overall-badge" style="color:${Ym(M.overallRating)}" title="Gesamtstärke: ${M.overallRating.toFixed(2)}">${M.overallRating.toFixed(2)}</span>`,T=M.hasDropped?" dropped":"";let F="";M.hasDropped?M.dropoutStatus==="dns"?F="DNS":M.dropoutStatus==="dnf"?F=((X=M.dropoutReason)==null?void 0:X.startsWith("OTL"))??!1?"OTL":"DNF":F="OUT":M.gcRank!=null&&(F=`${M.gcRank}`);let z="";if(M.hasDropped)z=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${v(M.dropoutReason||"")}">${F}</span>`;else if(M.gcRank!=null){let re="rider-stats-rank-badge-gc";M.gcRank===1?re="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":M.gcRank===2?re="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":M.gcRank===3&&(re="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),z=`<span class="rider-stats-rank-badge ${re}" title="GC Stand: Platz ${M.gcRank}">${M.gcRank}</span>`}const I=`style="color: ${M.hasDropped?"var(--text-500)":x.color}; font-weight: bold;"`,E=r.has(M.riderId),H=d.has(M.riderId);return`<div class="results-roster-rider${T}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${C}
            <span class="results-roster-name${E?" strongest-rider":H?" best-sprinter":""}">
              ${Me(A,{riderId:M.riderId,teamId:M.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${Ms(M.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${I}>${v(_)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${z||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${B}
        </div>
      </div>`}).join(""),w=b.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${S}</div>
        <div class="results-roster-team-name" title="${v(b.teamName??"–")}">${lt(b.teamName??"–",b.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${w})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${$}</div>
    </div>`}).join("")}</div>`}function Ym(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function Zm(e){var l,g;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=c.stageResults)==null?void 0:l.classifications.find(m=>m.resultTypeId===1),a=new Set(t?t.rows.map(m=>m.riderId).filter(m=>m!=null):[]),s=c.riders.filter(m=>m.activeTeamId===e.teamId&&a.has(m.id)),r=new Set((((g=c.stageResults)==null?void 0:g.nonFinishers)??[]).map(m=>m.riderId)),n=[];for(const m of s){if(m.id===e.riderId||r.has(m.id))continue;let u=0;const p=m.skills.sprint>=72,h=m.skills.flat>=78,f=m.skills.timeTrial>=76,b=m.skills.acceleration>=80;if(p&&u++,h&&u++,f&&u++,b&&u++,u>0){let S=1;u===2?S=1.25:u===3?S=1.5:u===4&&(S=2),n.push({id:m.id,firstName:m.firstName,lastName:m.lastName,countryCode:m.nationality??null,isSprinter:p,multiplier:S,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const m=n.filter(b=>b.isSprinter).reduce((b,S)=>b+S.multiplier,0),u=n.filter(b=>!b.isSprinter).reduce((b,S)=>b+S.multiplier,0);let p=0,h=0;m>0&&u>0?(p=i/(2.125*m+u),h=2.125*p,p=Math.max(.1,Math.min(.3,p)),h=Math.max(.25,Math.min(.6,h))):m>0?(h=i/m,h=Math.max(.25,Math.min(.6,h)),p=h/2.125):u>0&&(p=i/u,p=Math.max(.1,Math.min(.3,p)),h=2.125*p);for(const b of n)b.contribution=b.isSprinter?h*b.multiplier:p*b.multiplier;const f=n.reduce((b,S)=>b+S.contribution,0);if(f>0){const b=i/f;for(const S of n)S.contribution*=b}n.sort((b,S)=>S.contribution-b.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),d=n.map(m=>{const u=Ue($a(m.id)??m.countryCode),p=m.firstName?`${m.firstName.charAt(0)}. ${m.lastName}`:m.lastName,h=m.contribution.toFixed(2).replace(".",",");return`
      <div class="leadout-bonus-popover-grid">
        <span class="results-flag-col-cell">${u}</span>
        <span class="leadout-bonus-rider-name">${v(p)}</span>
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
        ${d}
      </div>
    </div>
  `}function vn(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function Ms(e){var g,m,u,p,h,f,b,S;if(e==null||!c.stageResults)return"";const t=at(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,s=c.stageResults.classifications,r=(m=(g=s.find($=>$.resultTypeId===ka))==null?void 0:g.rows.find($=>$.rank===1))==null?void 0:m.riderId,n=(p=(u=s.find($=>$.resultTypeId===gs))==null?void 0:u.rows.find($=>$.rank===1))==null?void 0:p.riderId,i=(f=(h=s.find($=>$.resultTypeId===Nn))==null?void 0:h.rows.find($=>$.rank===1))==null?void 0:f.riderId,o=(S=(b=s.find($=>$.resultTypeId===5))==null?void 0:b.rows.find($=>$.rank===1))==null?void 0:S.riderId,d=[],l=c.selectedResultTypeId;return e===r&&(l===ka||l===1&&a||l!==1&&l!==ka)&&d.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&d.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&d.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&d.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),d.length===0?"":`<span class="jersey-dots-wrapper">${d.join("")}</span>`}function Sn(e){if(!e)return"";let t=e;const a=[],s=[...c.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of s){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),d=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");d.test(t)&&(t=t.replace(d,l=>{const g=`__RIDER_LINK_${a.length}__`,m=Me(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(m),g}))}let r=v(t);for(let n=0;n<a.length;n++)r=r.replace(`__RIDER_LINK_${n}__`,a[n]);return r}function be(){var X,re,$e,oe;c.riders.length===0&&G.getRiders().then(k=>{k.success&&k.data&&(c.riders=k.data,be())});const e=y("results-race-select"),t=y("results-stage-select"),a=y("results-type-tabs"),s=y("results-marker-tabs"),r=y("results-stage-meta"),n=y("results-empty"),i=y("results-table"),o=i.querySelector("thead tr"),d=y("results-tbody"),l=y("results-marker-classifications"),g=y("results-roster"),m=i.querySelector("colgroup");m&&m.remove(),i.style.tableLayout="",c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+c.races.filter(k=>{var K;return(((K=k.stages)==null?void 0:K.length)??0)>0}).map(k=>`<option value="${k.id}"${k.id===c.selectedResultsRaceId?" selected":""}>${v(k.name)}</option>`).join("");const u=at(c.selectedResultsRaceId),p=u==null?"":(u.stages??[]).map(k=>`<option value="${k.id}"${k.id===c.selectedResultsStageId?" selected":""}>${v(jm(u,k))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+p;const h=((X=c.stageResults)==null?void 0:X.classifications.filter(k=>!(u&&!u.isStageRace&&k.resultTypeId!==1&&k.resultTypeId!==6)))??[],f=h.find(k=>k.resultTypeId===c.selectedResultTypeId)??h[0]??null,b=c.selectedResultsSpecialView==="nonFinishers",S=c.selectedResultsSpecialView==="events",$=c.selectedResultsSpecialView==="roster";if(f&&!b&&!S&&!$&&(c.selectedResultTypeId=f.resultTypeId),S){i.style.tableLayout="fixed";const k=document.createElement("colgroup");k.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(k,i.firstChild)}if(!c.stageResults&&!$||!f&&!b&&!S&&!$){const k=Ia(c.selectedResultsStageId);r.textContent=k?`${k.race.name} · ${k.stage.profile} · ${Q(k.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",s.innerHTML="",s.classList.add("hidden"),d.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),g.innerHTML="",g.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=c.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}$?c.resultsRoster&&(r.textContent=`${c.resultsRoster.raceName} · Starterfeld`):c.stageResults&&(r.textContent=`${c.stageResults.raceName} · Etappe ${c.stageResults.stageNumber} · ${c.stageResults.profile} · ${Q(c.stageResults.date)}`);const w=c.stageResults?Ia(c.stageResults.stageId):null,M=(w==null?void 0:w.stage.distanceKm)??null,x=new Map,D=new Map;if(c.stageResults){const k=c.stageResults.classifications.find(K=>K.resultTypeId===1);if(k)for(const K of k.rows)K.riderId!=null&&K.points!=null&&K.points>0&&x.set(K.riderId,K.points);if(c.stageResults.markerClassifications){for(const K of c.stageResults.markerClassifications)if(Js(K.markerType,K.markerCategory)){for(const W of K.entries)if(W.riderId!=null&&W.pointsAwarded!=null&&W.pointsAwarded>0){const O=D.get(W.riderId)??0;D.set(W.riderId,O+W.pointsAwarded)}}}}const C=(f==null?void 0:f.resultTypeId)===ka,A=(f==null?void 0:f.resultTypeId)===gs||(f==null?void 0:f.resultTypeId)===Nn,N=(f==null?void 0:f.resultTypeId)===5,P=(f==null?void 0:f.resultTypeId)===6,L=C||A||N||P,_=h.map(k=>`
    <button
      type="button"
      class="results-type-btn${!b&&!S&&!$&&k.resultTypeId===c.selectedResultTypeId?" active":""}"
      data-result-type-id="${k.resultTypeId}"
    >${v(k.resultTypeName)}</button>
  `),B=`
    <button
      type="button"
      class="results-type-btn${b?" active":""}"
      data-results-special-view="${Ki}"
    >OTL/DNF</button>
  `,T=`
    <button
      type="button"
      class="results-type-btn${S?" active":""}"
      data-results-special-view="${Wi}"
    >Ereignisse</button>
  `,F=`
    <button
      type="button"
      class="results-type-btn${$?" active":""}"
      data-results-special-view="${Oi}"
    >Teilnehmer</button>
  `,z=h.findIndex(k=>k.resultTypeName.toLocaleLowerCase("de").includes("team"));z>=0?_.splice(z+1,0,B,T,F):_.push(B,T,F),a.innerHTML=_.join("");const R=Km(((re=c.stageResults)==null?void 0:re.markerClassifications)??[]);if($){g.innerHTML=Um(),g.classList.remove("hidden"),i.classList.add("hidden"),s.innerHTML="",s.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else g.innerHTML="",g.classList.add("hidden");const I=!b&&!S&&!$&&(f==null?void 0:f.resultTypeId)===1&&R.length>0,E=I?c.selectedResultsMarkerKey??Ge:null,H=I&&E!==Ge?R.find(k=>k.markerKey===E)??null:null;if(I&&(c.selectedResultsMarkerKey=(H==null?void 0:H.markerKey)??Ge),S){const k=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"}];s.innerHTML=k.map(K=>`
      <button
        type="button"
        class="results-type-btn${K.key===Fe?" active":""}"
        data-event-filter="${K.key}"
      >${v(K.label)}</button>
    `).join("")}else s.innerHTML=I?[`
        <button
          type="button"
          class="results-type-btn${c.selectedResultsMarkerKey===Ge?" active":""}"
          data-marker-key="${Ge}"
        >Tageswertung</button>`,...R.map(k=>`
        <button
          type="button"
          class="results-type-btn${k.markerKey===c.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${k.markerKey}"
        >${v(Wm(k))}</button>
      `)].join(""):"";s.classList.toggle("hidden",!S&&!I);const Y=b||S||!I||c.selectedResultsMarkerKey===Ge;if(o&&Y&&(o.innerHTML=b?`
        <th>Etappe</th>
        <th>Status</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Grund</th>
      `:S?`
        <th>km Marke</th>
        <th>Fahrer</th>
        <th>Ereignis</th>
      `:C?`
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
      `:A?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Punkte</th>
          <th>UCI Punkte</th>
        `:P?`
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
        ${L?"<th>Trend</th>":""}
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
        <th class="results-points-cell">Punktewertung</th>
        <th>UCI Punkte</th>
      `),d.innerHTML=b?((($e=c.stageResults)==null?void 0:$e.nonFinishers)??[]).map(k=>`
      <tr>
        <td>${k.stageNumber}</td>
        <td>${Fo(k.isOtl)}</td>
        <td class="results-jersey-col-cell">${Lt(k.teamId,k.teamName)}</td>
        <td>${Dt(k.riderName,!0,!1,k.riderId,k.teamId)}</td>
        <td class="results-flag-col-cell">${Ue(k.countryCode)}</td>
        <td>${lt(k.teamName||"–",k.teamId)}</td>
        <td>${v(fs(k.statusReason,k.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':S?[...((oe=c.stageResults)==null?void 0:oe.events)??[]].filter(k=>Fe==="all"?!0:Fe==="form"?!!(k.title&&(k.title.includes("guten Tag")||k.title.includes("schlechten Tag")||k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))):Fe==="attack"?(k.type==="attack"||k.type==="counter_attack")&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Fe==="breakaway"?!!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Fe==="incident"?(k.type==="incident"||!!(k.title&&k.title.includes("Massensturz")))&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Fe==="exit"?k.type==="dnf"||!!(k.title&&k.title.includes("nicht am Start")):Fe==="home"?!!(k.title&&(k.title.includes("Heimvorteil")||k.title.includes("Heimdruck"))):Fe==="weather"?!!(k.title&&k.title.startsWith("Wetterbericht:")):!0).sort((k,K)=>{const W=k.kmMark??0,O=K.kmMark??0;if(Math.abs(W-O)>1e-4)return W-O;if(W===0){const Le=vn(k),Ie=vn(K);if(Le!==Ie)return Le-Ie}const ne=k.riderName??"",he=K.riderName??"";return ne.localeCompare(he,"de")}).map(k=>{var Nt,gr,fr;const K=k.kmMark!=null?`${k.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",W=k.riderId,O=W!=null?Te(W):null,ne=k.riderTeamId??(O==null?void 0:O.activeTeamId)??null,he=ne!=null?((Nt=c.teams.find(sa=>sa.id===ne))==null?void 0:Nt.name)??null:null;let Le=Lt(ne,he);const Ie=!!(k.title&&k.title.startsWith("Wetterbericht:"));let vt=k.title||"";if(Ie){const sa=(gr=c.stageResults)==null?void 0:gr.rolledWeatherId,Xa=(fr=c.stageResults)==null?void 0:fr.rolledWetterName;Le=`<span class="results-jersey-cell">${Ys(sa,Xa)}</span>`,Xa&&(vt=`Wetterbericht: ${Xa}`)}const aa=Ie?"":Ue(W!=null?$a(W):null),St=Ie?"":W!=null?Dt(k.riderName??"",!0,!1,W,ne):v(k.riderName||"–");let de="";return k.title&&k.title.includes("guten Tag")?de='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':k.title&&k.title.includes("schlechten Tag")?de='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':k.title&&(k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))?de='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':k.title&&k.title.includes("nicht am Start")?de='<span class="event-badge event-badge-dns">DNS</span>':k.title&&k.title.includes("Massensturz")?de='<span class="event-badge event-badge-masscrash">Massensturz</span>':k.type==="dnf"?de='<span class="event-badge event-badge-dnf">DNF</span>':k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))?de='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':k.type==="attack"?de='<span class="event-badge event-badge-attack">Attacke</span>':k.type==="counter_attack"?de='<span class="event-badge event-badge-counter">Konterattacke</span>':k.type==="incident"?k.title&&(k.title.toLowerCase().includes("defekt")||k.title.toLowerCase().includes("panne")||k.title.toLowerCase().includes("technisch"))?de='<span class="event-badge event-badge-defect">Defekt</span>':de='<span class="event-badge event-badge-crash">Sturz</span>':k.title&&k.title.includes("Super-Heimvorteil")?de='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Super-Heim</span>':k.title&&k.title.includes("Heimdruck")?de='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimdruck</span>':k.title&&k.title.includes("Heimvorteil")?de='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':k.title&&k.title.startsWith("Wetterbericht:")&&(de='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>'),`
          <tr>
            <td>${K}</td>
            <td>
              <div class="event-rider-info">
                ${Le}
                ${aa}
                ${St}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${Sn(vt)}</span>
                  ${de}
                </div>
                ${k.detail?`<div class="event-detail">${Sn(k.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':Y&&f?f.rows.map(k=>{const K=k.riderName??k.teamName,W=k.riderName?k.teamName:"–",O=Lt(k.teamId,k.teamName),ne=Dt(K,!0,k.isBreakaway===!0,k.riderId,k.teamId),he=Ue($a(k.riderId)),Le=f.resultTypeId===1&&k.rank===1&&k.timeSeconds!=null&&M!=null,Ie=k.timeSeconds!=null?`${Ra(k.timeSeconds)}${Le?` (${Om(M,k.timeSeconds)})`:""}`:"–",vt=L?`<td class="results-gc-delta-cell">${Eo(k.previousRank,k.rankDelta)}</td>`:"";if(A){let St=k.points!=null?String(k.points):"–";if(k.points!=null&&k.riderId!=null&&f){const Nt=f.resultTypeId===gs?x.get(k.riderId)??0:D.get(k.riderId)??0;Nt>0&&(St+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${Nt}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${vt}
            <td class="results-jersey-col-cell">${O}</td>
            <td>${ne}${Ms(k.riderId)}</td>
            <td class="results-flag-col-cell">${he}</td>
            <td>${lt(W,k.teamId)}</td>
            <td class="results-points-cell">${St}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(P)return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${vt}
            <td class="results-jersey-col-cell">${O}</td>
            <td>${lt(k.teamName,k.teamId)}</td>
            <td class="results-flag-col-cell">${he}</td>
            <td>${Ie}</td>
            <td>${v(Qa(k.gapSeconds))}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`;let aa=k.points!=null?String(k.points):"–";if(k.leadoutBonus!=null&&k.leadoutBonus>0&&k.leadoutRiderId!=null){const St=Zm(k);aa=`
          <div class="leadout-bonus-anchor">
            ${k.points!=null?k.points:"–"}
            ${St}
          </div>
        `}return`
        <tr>
          <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
          ${vt}
          <td class="results-jersey-col-cell">${O}</td>
          <td>${ne}${Ms(k.riderId)}</td>
          <td class="results-flag-col-cell">${he}</td>
          <td>${lt(W,k.teamId)}</td>
          <td>${Ie}</td>
          <td>${v(Qa(k.gapSeconds))}</td>
          <td class="results-points-cell">${aa}</td>
          <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
        </tr>`}).join(""):"",n.classList.toggle("hidden",!!f||b||S||$),i.classList.toggle("hidden",!Y||$),H){const k=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${v(Co(H.markerType,H.markerLabel))}</h4>
          <div class="results-marker-card-meta">${v(`${H.kmMark.toFixed(1).replace(".",",")} km${H.markerCategory?` · Kat. ${H.markerCategory}`:""}`)}</div>
        </div>
      </section>`,K=H.entries.map(W=>{var Le;const O=Te(W.riderId),ne=O?`${O.firstName} ${O.lastName}`:`Fahrer ${W.riderId}`,he=(O==null?void 0:O.activeTeamId)!=null?((Le=c.teams.find(Ie=>Ie.id===O.activeTeamId))==null?void 0:Le.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${W.rank}.</div>
          <div class="results-marker-jersey">${Lt(O==null?void 0:O.activeTeamId,he)}</div>
          <div class="results-marker-name">${Dt(ne,!1,!1,(O==null?void 0:O.id)??null,(O==null?void 0:O.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${Ue($a(O==null?void 0:O.id))}</div>
          <div class="results-marker-time">${v(Ra(W.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${v(Qa(W.gapSeconds))}</div>
          <div class="results-marker-points">${W.pointsAwarded!=null&&W.pointsAwarded>0?W.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${k}<div class="results-marker-list">${K}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!H)}function qm(){y("results-race-select").addEventListener("change",e=>{var s,r;const t=e.target.value;c.selectedResultsRaceId=t?Number(t):null;const a=at(c.selectedResultsRaceId);c.selectedResultsStageId=((r=(s=a==null?void 0:a.stages)==null?void 0:s[0])==null?void 0:r.id)??null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=Ge,c.selectedResultsSpecialView=null,c.stageResults=null,be(),c.selectedResultsStageId!=null&&Ts(c.selectedResultsStageId,!0)}),y("results-stage-select").addEventListener("change",e=>{const t=e.target.value;c.selectedResultsStageId=t?Number(t):null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=Ge,c.selectedResultsSpecialView=null,c.stageResults=null,be(),c.selectedResultsStageId!=null&&Ts(c.selectedResultsStageId,!0)}),y("results-type-tabs").addEventListener("click",e=>{var s;const t=e.target.closest("button[data-result-type-id]");if(t){c.selectedResultsSpecialView=null,c.selectedResultTypeId=Number(t.dataset.resultTypeId),be();return}const a=e.target.closest("button[data-results-special-view]");if(a){const r=a.dataset.resultsSpecialView;r===Ki?(c.selectedResultsSpecialView="nonFinishers",be()):r===Wi?(c.selectedResultsSpecialView="events",Fe="all",be()):r===Oi&&(c.selectedResultsSpecialView="roster",c.selectedResultsRaceId!=null&&((s=c.resultsRoster)==null?void 0:s.raceId)!==c.selectedResultsRaceId&&ji(c.selectedResultsRaceId).then(()=>be()),be())}}),y("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const s=t.dataset.markerKey;c.selectedResultsMarkerKey=s??Ge,be();return}const a=e.target.closest("button[data-event-filter]");a&&(Fe=a.dataset.eventFilter??"all",be())})}const Xs=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],Qt=["skills","form","profile","preferences"],Qs=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],er={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...Xs.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function tr(){return[...Qs,...er[c.teamDetailPage]]}function Vi(e,t=12){const a=c.riders.filter(r=>r.activeTeamId===e).sort((r,n)=>n.overallRating-r.overallRating).slice(0,t);return a.length===0?null:a.reduce((r,n)=>r+n.overallRating,0)/a.length}function Ui(e){const t=c.riders.filter(s=>s.activeTeamId===e);return t.length===0?null:t.reduce((s,r)=>s+r.overallRating,0)/t.length}function Yi(e){const t=Vi(e);return t==null?"–":t.toFixed(1).replace(".",",")}function Zi(e){const t=Ui(e);return t==null?"–":t.toFixed(1).replace(".",",")}function J(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function ye(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:J(e,t)}function ce(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function ve(e){return e==null?void 0:typeof e=="string"?Gt(e):e.name}function ar(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...Xs.map(t=>t.key)].includes(e)?"desc":"asc"}function qi(e){return c.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function Ji(e){if(!e.sortKey)return`<th class="${v(e.className??"")}" title="${v(e.title)}">${v(e.label)}</th>`;const t=c.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${v(e.className??"")}" title="${v(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${v(e.label)}</span>
        ${qi(e.sortKey)}
      </button>
    </th>`}function Xi(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${Qt.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const Qi={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function sr(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":Qi[e]??String(e)}function eo(e){const t=[...e],a=c.teamTableSort.direction==="asc"?1:-1;return t.sort((s,r)=>{let n=0;switch(c.teamTableSort.key){case"name":n=J(s.lastName,r.lastName)||J(s.firstName,r.firstName);break;case"countryCode":n=J(gt(s),gt(r));break;case"birthYear":n=s.birthYear-r.birthYear;break;case"age":n=(s.age??0)-(r.age??0);break;case"overallRating":n=s.overallRating-r.overallRating;break;case"potOverall":n=(s.potential??0)-(r.potential??0);break;case"formBonus":n=(s.formBonus??0)-(r.formBonus??0);break;case"raceFormBonus":n=(s.raceFormBonus??0)-(r.raceFormBonus??0);break;case"longTermFatigueMalus":n=(s.longTermFatigueMalus??0)-(r.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(s.shortTermFatigueMalus??0)-(r.shortTermFatigueMalus??0);break;case"seasonPoints":n=(s.seasonPoints??0)-(r.seasonPoints??0);break;case"seasonRaceDays":n=(s.seasonRaceDays??0)-(r.seasonRaceDays??0);break;case"seasonWins":n=(s.seasonWins??0)-(r.seasonWins??0);break;case"contractEndSeason":n=(s.contractEndSeason??Number.MAX_SAFE_INTEGER)-(r.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=J(s.seasonFormPhase??"neutral",r.seasonFormPhase??"neutral");break;case"roleName":n=J(tt(s),tt(r));break;case"riderType":n=J(s.riderType,r.riderType)||J(xe(s),xe(r));break;case"skillDevelopment":n=(s.skillDevelopment??0)-(r.skillDevelopment??0);break;case"specialization1":n=ye(ve(s.specialization1),ve(r.specialization1));break;case"specialization2":n=ye(ve(s.specialization2),ve(r.specialization2));break;case"specialization3":n=ye(ve(s.specialization3),ve(r.specialization3));break;case"peak1":n=ye(ce(s,0),ce(r,0));break;case"peak2":n=ye(ce(s,1),ce(r,1));break;case"peak3":n=ye(ce(s,2),ce(r,2));break;default:n=s.skills[c.teamTableSort.key]-r.skills[c.teamTableSort.key];break}return n===0&&(n=J(s.lastName,r.lastName)||J(s.firstName,r.firstName)),n*a}),t}function to(e){const t=[...e],a=c.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((s,r)=>{let n=0;switch(c.riderMenuTableSort.key){case"name":n=J(s.lastName,r.lastName)||J(s.firstName,r.firstName);break;case"countryCode":n=J(gt(s),gt(r));break;case"birthYear":n=s.birthYear-r.birthYear;break;case"age":n=(s.age??0)-(r.age??0);break;case"overallRating":n=s.overallRating-r.overallRating;break;case"potOverall":n=(s.potential??0)-(r.potential??0);break;case"formBonus":n=(s.formBonus??0)-(r.formBonus??0);break;case"raceFormBonus":n=(s.raceFormBonus??0)-(r.raceFormBonus??0);break;case"longTermFatigueMalus":n=(s.longTermFatigueMalus??0)-(r.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(s.shortTermFatigueMalus??0)-(r.shortTermFatigueMalus??0);break;case"seasonPoints":n=(s.seasonPoints??0)-(r.seasonPoints??0);break;case"seasonRaceDays":n=(s.seasonRaceDays??0)-(r.seasonRaceDays??0);break;case"seasonWins":n=(s.seasonWins??0)-(r.seasonWins??0);break;case"contractEndSeason":n=(s.contractEndSeason??Number.MAX_SAFE_INTEGER)-(r.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=J(s.seasonFormPhase??"neutral",r.seasonFormPhase??"neutral");break;case"roleName":n=J(tt(s),tt(r));break;case"riderType":n=J(s.riderType,r.riderType)||J(xe(s),xe(r));break;case"skillDevelopment":n=(s.skillDevelopment??0)-(r.skillDevelopment??0);break;case"specialization1":n=ye(ve(s.specialization1),ve(r.specialization1));break;case"specialization2":n=ye(ve(s.specialization2),ve(r.specialization2));break;case"specialization3":n=ye(ve(s.specialization3),ve(r.specialization3));break;case"peak1":n=ye(ce(s,0),ce(r,0));break;case"peak2":n=ye(ce(s,1),ce(r,1));break;case"peak3":n=ye(ce(s,2),ce(r,2));break;default:n=s.skills[c.riderMenuTableSort.key]-r.skills[c.riderMenuTableSort.key];break}return n===0&&(n=J(s.lastName,r.lastName)||J(s.firstName,r.firstName)),n*a}),t}function xs(e){return e.length===0?"–":e.map(t=>{const a=c.races.find(s=>s.id===t);return a?v(a.name):`Rennen ${t}`}).join(", ")}function Jm(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function rr(e,t){var a,s;switch(t.id){case"name":return`<td class="team-table-name-cell">${Me(xe(e),{riderId:e.id,teamId:e.activeTeamId,strong:c.teamDetailPage==="form"||c.teamDetailPage==="profile"||c.teamDetailPage==="preferences"})}${_o(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${se(gt(e))}<span>${v(gt(e))}</span></span></td>`;case"age":return`<td>${e.age??(c.gameState?c.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${v(tt(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${Sr(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${Ao(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${Sr((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${kr(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${kr(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${Bn(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${v(ce(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${v(ce(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${v(ce(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${v(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?v(Gt(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?v(Gt(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?v(Gt(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${Bo(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${se(e.mentorCountryCode??"UNK")} <span>${v(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${xs(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${xs(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const r=t.sortKey;return r&&r in e.skills?`<td>${Do(e.skills[r],(a=e.yearStartSkills)==null?void 0:a[r],(s=e.potentials)==null?void 0:s[r])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function za(){fe("Teams/Fahrer werden aktualisiert...");try{const e=await G.getRiders();if(e.success&&(c.riders=e.data??[]),await G.getTeams().then(t=>{t.success&&(c.teams=t.data??[])}),ge("teams")&&nr(),ge("riders")){const{renderRidersMenu:t}=await Gn(async()=>{const{renderRidersMenu:a}=await Promise.resolve().then(()=>Tp);return{renderRidersMenu:a}},void 0);t()}}finally{ue()}}async function Xm(e={}){const t=await G.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),y("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${v(t.error??"Unbekannt")}</p>`;return}c.teams=t.data??[],e.render!==!1&&ge("teams")&&nr()}function nr(){const e=y("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+c.teams.map(s=>`<option value="${s.id}"${String(s.id)===t?" selected":""}>${v(s.name)} (${v(s.division??s.divisionName??"")}) · ${v(s.abbreviation)}</option>`).join("");const a=t?Number(t):null;Kt(a)}function Kt(e){const t=y("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=c.teams.find(i=>i.id===e);if(!a){t.innerHTML="";return}const s=eo(c.riders.filter(i=>i.activeTeamId===e)),r=a.division==="U23"?"badge-u23":"badge-classics",n=tr();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${v(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${r}">${v(a.division??a.divisionName??"")}</span>
          <span>${No(a.country,a.countryCode)}</span>
          <span>Kürzel: ${v(a.abbreviation)} · Top 12 ${v(Yi(a.id))} (${v(Zi(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${s.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${v(sr(c.teamTableSort.key))} ${c.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Xi()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${n.map(Ji).join("")}
          </tr></thead>
          <tbody>
            ${s.length===0?`<tr><td colspan="${n.length}" class="text-muted">Keine Fahrer.</td></tr>`:s.map(i=>`
                <tr class="team-detail-row">
                  ${n.map(o=>rr(i,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function ao(){y("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;c.teamDetailPage="skills",Kt(t?Number(t):null)}),y("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const r=Number(t.dataset.riderProgramId);Number.isFinite(r)&&dr(r);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const r=a.dataset.teamDetailPage;if(Qt.includes(r)){c.teamDetailPage=r,new Set(tr().map(o=>o.sortKey).filter(o=>o!=null)).has(c.teamTableSort.key)||(c.teamTableSort={key:"name",direction:"asc"});const i=Number(y("teams-dropdown").value);Kt(Number.isFinite(i)?i:null)}return}const s=e.target.closest("button[data-team-sort]");if(s){const r=s.dataset.teamSort;c.teamTableSort.key===r?c.teamTableSort.direction=c.teamTableSort.direction==="asc"?"desc":"asc":c.teamTableSort={key:r,direction:ar(r)};const n=Number(y("teams-dropdown").value);Kt(Number.isFinite(n)?n:null);return}})}const Qm=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:er,TEAM_DETAIL_PAGE_ORDER:Qt,TEAM_SKILL_COLUMNS:Xs,TEAM_SKILL_TITLES:Qi,TEAM_TABLE_COLUMNS:Qs,compareOptionalStrings:ye,compareStrings:J,formatTeamAverage:Zi,formatTeamTopAverage:Yi,getActiveTeamTableColumns:tr,getDefaultTeamSortDirection:ar,getPeakDate:ce,getSortIndicator:qi,getSpecializationSortLabel:ve,getTeamAverage:Ui,getTeamSortLabel:sr,getTeamTopAverage:Vi,initTeamsListeners:ao,loadTeams:Xm,refreshTeamsViewData:za,renderPeakDatesSummary:Jm,renderRacePrefs:xs,renderTeamDetail:Kt,renderTeamDetailPageTabs:Xi,renderTeamTableCell:rr,renderTeamTableHeader:Ji,renderTeams:nr,sortRiderMenuRiders:to,sortTeamRiders:eo},Symbol.toStringTag,{value:"Module"}));function ep(e,t,a){return`${e} · Etappe ${t} · ${a}`}function so(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function ro(e,t){const a=[];for(const s of e.riders)if(s.leadoutBonus!=null&&s.leadoutBonus>0&&s.leadoutContributions&&s.leadoutContributions.length>0){const r=t.riders.find(i=>i.id===s.riderId),n=(r==null?void 0:r.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:s.riderId,leadoutBonus:s.leadoutBonus,contributorsJson:JSON.stringify(s.leadoutContributions)})}return a}async function no(e,t=!1){if(Cn!=null||Cs)return!1;br(e),Lo(0);try{const a=await G.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const s=a.data,r=await Od(s,o=>Ln(o)),n=so(r,s),i=ro(r,s);return await mo(e,n,r.markerClassifications,r.incidents,r.allEvents,t,i),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{br(null),ue()}}function io(e){var s;const t=(s=c.rosterEditor)==null?void 0:s.teams.find(r=>r.team.id===e);if(!t)return 0;const a=new Set(c.rosterEditorSelectedRiderIds);return t.riders.filter(r=>a.has(r.rider.id)).length}function oo(){return c.rosterEditor?c.rosterEditor.teams.every(e=>io(e.team.id)===e.riderLimit):!1}function ds(){const e=y("roster-editor-title"),t=y("roster-editor-meta"),a=y("roster-editor-body"),s=y("btn-apply-roster-editor"),r=c.rosterEditor;if(!r){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',s.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=r.race.isStageRace?`${r.race.name} · Etappe ${r.stage.stageNumber} · ${r.stage.profile}`:`${r.race.name} · ${r.stage.profile}`;const n=new Set(c.rosterEditorSelectedRiderIds);a.innerHTML=r.teams.map(i=>{const o=io(i.team.id),d=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${v(i.team.name)}</h3>
            <p class="text-muted">${v(i.team.abbreviation)} · ${v(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${d}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var f;const m=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),u=l.rider.country?se(l.rider.country.code3):"",p=[((f=l.rider.role)==null?void 0:f.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),h=l.lockReason?`<span class="roster-editor-rider-lock">${v(l.lockReason)}</span>`:"";return`
              <button
                type="button"
                class="${m}"
                data-roster-team-id="${i.team.id}"
                data-roster-rider-id="${l.rider.id}"
                ${l.isLocked?"disabled":""}
              >
                <span class="roster-editor-rider-name">${u}<span>${v(l.rider.firstName)} ${v(l.rider.lastName)}</span></span>
                <span class="roster-editor-rider-meta">${v(p)}</span>
                ${h}
              </button>`}).join("")}
        </div>
      </section>`}).join(""),s.disabled=!oo()}function ws(){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],Ot("roster-editor-error"),_e("rosterEditor")}function lo(e,t){c.selectedRealtimeStageId=e.stage.id,c.realtimeBootstrap=e,c.realtimeError=null,t&&yt("live-race"),co().load(e,{autoplay:!0,resetSpeed:!0}),Rt()}function co(){let e=_t;if(!e){const t=y("race-sim-layout"),a=y("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new zm({layout:t,emptyState:a,controlsHeader:y("race-sim-controls-header"),profile:y("race-sim-profile"),groupBox:y("race-sim-group-box"),messages:y("race-sim-messages-body"),favorites:y("race-sim-favorites-body"),sidebar:y("race-sim-sidebar-body"),controls:y("race-sim-controls"),meta:y("race-sim-stage-meta")},{onFinishRequested:(s,r)=>{const n=so(s,r),i=ro(s,r);mo(r.stage.id,n,s.markerClassifications,s.incidents,s.allEvents,!1,i)}}),Io(e)}return e}async function tp(e){fe("Starterfeld wird geladen..."),Ot("roster-editor-error");try{const t=await G.getRosterEditor(e);if(!t.success||!t.data){ct("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),He("rosterEditor"),ds();return}c.rosterEditor=t.data,c.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(s=>s.isSelected).map(s=>s.rider.id)),ds(),He("rosterEditor")}catch(t){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],ct("roster-editor-error",t.message),He("rosterEditor"),ds()}finally{ue()}}async function ap(){const e=c.rosterEditor;if(e){if(!oo()){ct("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}Ot("roster-editor-error"),fe("Starterfeld wird übernommen...");try{const t=await G.applyRosterEditor(e.stage.id,{riderIds:c.rosterEditorSelectedRiderIds});if(!t.success||!t.data){ct("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}ws(),lo(t.data,!0)}catch(t){ct("roster-editor-error",t.message)}finally{ue()}}}function Rt(){var n,i;const e=y("race-sim-stage-select"),t=((n=c.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===c.selectedRealtimeStageId)||(c.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===c.selectedRealtimeStageId?" selected":""}>${v(ep(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const s=t.find(o=>o.stageId===c.selectedRealtimeStageId)??null,r=co();if(!s){c.realtimeBootstrap=null,c.realtimeError=null,r.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!c.realtimeBootstrap||c.realtimeBootstrap.stage.id!==s.stageId)&&(c.realtimeError?r.clear(c.realtimeError):r.hide())}async function uo(e,t){if(ps!==e){yr(e),c.selectedRealtimeStageId=e,t&&yt("live-race"),Rt(),fe("Live-Simulation wird geladen...");try{const a=await G.getRealtimeSimulation(e);if(!a.success||!a.data){c.realtimeBootstrap=null,c.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",Rt(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}lo(a.data,!1)}catch(a){c.realtimeBootstrap=null,c.realtimeError=a.message,Rt(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{ps===e&&yr(null),ue()}}}async function mo(e,t,a,s,r,n=!1,i){if(!Cs){hr(!0),fe("Live-Ergebnis wird gespeichert...");try{const o=await G.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:s,events:r,leadoutContributions:i});if(!o.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(o.error??"Unbekannter Fehler"));return}const d=o.data;c.selectedResultsRaceId=(d==null?void 0:d.raceId)??c.selectedResultsRaceId,c.selectedResultsStageId=(d==null?void 0:d.stageId)??e,c.selectedResultTypeId=1,c.realtimeBootstrap=null,c.realtimeError=null,await Ts(e,!1),await or(),await lr(),await za(),Rt(),n||yt("results")}catch(o){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+o.message)}finally{hr(!1),ue()}}}function sp(){y("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);c.selectedRealtimeStageId=Number.isFinite(t)?t:null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null),c.realtimeError=null,uo(t,!1)})}function ir(e){var s;const t=Yt((s=e.category)==null?void 0:s.name),a=Wa(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function Ya(e){var r,n;const t=Yt((r=e.category)==null?void 0:r.name),a=Wa(t),s=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${v(s)}</span>`}function rp(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(s=>s.date).sort((s,r)=>s.localeCompare(r));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function Za(e){const{startDate:t,endDate:a}=rp(e);return t===a?Q(t):`${Q(t)} - ${Q(a)}`}function np(e){return e.stageId>0}async function or(){const[e,t]=await Promise.all([G.getGameState(),G.getGameStatus()]);if(!e.success){console.error(e.error);return}c.gameState=e.data??null,c.gameStatus=t.success?t.data??null:null,ip(),ge("dashboard")&&qa()}function ip(){var r;if(!c.gameState)return;y("meta-date").textContent=c.gameState.formattedDate,y("meta-season").textContent=`Saison ${c.gameState.season}`;const e=y("meta-race-hint"),t=y("btn-advance-day"),a=y("pending-stages-list"),s=((r=c.gameStatus)==null?void 0:r.pendingStages)??[];s.length>0?(e.textContent=`${s.length} offene Etappe${s.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=s.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${Q(n.date)}`:`${n.profile} · ${Q(n.date)}`,o=np(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
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
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):c.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function qa(){var t,a,s,r,n;const e=c.teams.find(i=>i.isPlayerTeam)??c.teams.find(i=>{var o;return i.name===((o=c.currentSave)==null?void 0:o.teamName)})??null;y("dashboard-career").textContent=((t=c.currentSave)==null?void 0:t.careerName)??"–",y("dashboard-team").textContent=(e==null?void 0:e.name)??((a=c.currentSave)==null?void 0:a.teamName)??"–",y("dashboard-date").textContent=((s=c.gameState)==null?void 0:s.formattedDate)??"–",y("dashboard-season").textContent=c.gameState?`Saison ${c.gameState.season}`:"–",y("dashboard-races-today").textContent=String(((r=c.gameStatus)==null?void 0:r.pendingStages.length)??((n=c.gameState)==null?void 0:n.racesTodayCount)??0),cp()}async function lr(){const e=await G.getRaces();if(!e.success){console.error(e.error);return}c.races=e.data??[],ge("dashboard")&&qa(),op(),lp()}async function op(){var n;const e=(n=c.gameState)==null?void 0:n.season;if(!e||c.races.length===0)return;const t=`participantCountsLogged_${e}`;if(localStorage.getItem(t))return;const a=c.races.slice(0,30),s=await Promise.all(a.map(async i=>{var d;const o=await G.getRaceProgramParticipants(i.id);return{race:i,count:o.success?((d=o.data)==null?void 0:d.length)??0:-1}}));if(s.some(i=>i.count>0)){console.group(`[Velo] Teilnehmeranzahl Saison ${e}`);for(const{race:i,count:o}of s)o>=0&&console.log(`${i.name} (${i.startDate}): ${o} Programmfahrer`);console.groupEnd(),localStorage.setItem(t,"1")}}async function lp(){var i;const e=(i=c.gameState)==null?void 0:i.season;if(!e)return;const t=`programAssignmentsLogged_${e}`;if(localStorage.getItem(t))return;const a=await G.getRiders();if(!a.success||!a.data)return;const s=a.data,r=new Map;for(const o of s)if(o.seasonProgram){const d=o.seasonProgram;r.has(d.id)||r.set(d.id,{name:d.name,riders:[]}),r.get(d.id).riders.push(o)}if(r.size===0)return;console.group(`[Velo] Programmzuweisungen Saison ${e}`);const n=Array.from(r.keys()).sort((o,d)=>o-d);for(const o of n){const d=r.get(o);console.log(`Program: ${o} - ${d.name} (Count: ${d.riders.length})`)}console.groupEnd(),localStorage.setItem(t,"1")}function dp(e,t){const[a,s,r]=e.split("-").map(Number),n=new Date(a,s-1,r);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),d=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${d}`}function kn(e){var g,m,u,p;const t=c.gameState!=null&&e.startDate<=c.gameState.currentDate&&e.endDate>=c.gameState.currentDate,s=c.gameState!=null&&e.endDate<c.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',r=((g=e.country)==null?void 0:g.name)??`Land ${e.countryId}`,n=(m=e.country)!=null&&m.code3?se(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((h,f)=>h+(f.distanceKm??0),0):((u=e.upcomingStage)==null?void 0:u.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((h,f)=>h+(f.elevationGainMeters??0),0):((p=e.upcomingStage)==null?void 0:p.elevationGainMeters)??null,d=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${Q(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${v(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${ir(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${v(r)}</span></span></td>
      <td>${Ya(e)}</td>
      <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${e.id}">Teilnehmer</button></td>
      <td>${d}</td>
      <td>${l}</td>
      <td>${s}</td>
    </tr>`}function cp(){const e=y("dashboard-races-tbody");if(!c.gameState){e.innerHTML='<tr><td colspan="9" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=c.gameState.currentDate,a=dp(t,7),s=c.races.filter(i=>i.startDate<=t&&i.endDate>=t),r=c.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>In Progress</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=s.map(i=>kn(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=r.map(i=>kn(i)).join(""),e.innerHTML=n}function ea(e){return`Etappe ${e.stageNumber}`}function up(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,s)=>s[1]!==a[1]?s[1]-a[1]:a[0].localeCompare(s[0])).map(([a,s])=>`${s}x ${a}`).join(" · ")}function mp(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function ta(e){return`<span class="stage-profile-badge ${mp(e)}">${v(e)}</span>`}function Ja(e,t){return`${e.name} · ${ea(t)} · ${t.profile}`}async function pp(e){var r;const t=c.stageSummariesByStageId[e];if(t)return t;const a=await G.getStageSummary(e);if(a.success&&a.data)return c.stageSummariesByStageId[e]=a.data,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],a.data;const s=await G.getRealtimeSimulation(e);return s.success&&((r=s.data)!=null&&r.stageSummary)?(c.stageSummariesByStageId[e]=s.data.stageSummary,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],s.data.stageSummary):(c.stageSummaryErrorsByStageId&&(c.stageSummaryErrorsByStageId[e]=a.error??s.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:s.error}),c.stageSummariesByStageId&&delete c.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function gp(){var d;const e=y("race-stages-title"),t=y("race-stages-meta"),a=y("race-stages-body"),s=at(c.selectedDashboardRaceId);if(!s){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const r=s.stages??[],n=r.reduce((l,g)=>l+(g.distanceKm??0),0),i=r.reduce((l,g)=>l+(g.elevationGainMeters??0),0),o=up(r);if(e.textContent=s.name,t.textContent=`${Za(s)} · ${((d=s.country)==null?void 0:d.name)??`Land ${s.countryId}`} · ${s.isStageRace?`${s.numberOfStages} Etappen`:"Eintagesrennen"} · ${hs(n)} · ${bs(i)} · ${o}`,r.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
                <td><strong>${v(ea(l))}</strong></td>
                <td>${ta(l.profile)}</td>
                <td>${l.distanceKm!=null?hs(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?bs(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${v(Ja(s,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Rs(e){at(e)&&(c.selectedDashboardRaceId=e,gp(),He("raceStages"))}function fp(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,s;return`
            <tr>
              <td>${Za(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?se(t.country.code3):""}<span>${v(((s=t.country)==null?void 0:s.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${v(t.name)}</strong></td>
              <td>${Ya(t)}</td>
              <td>${ir(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function dr(e){const t=c.riders.find(s=>s.id===e);y("rider-program-title").textContent=t?xe(t):"Programm",y("rider-program-meta").textContent="Lade Programmrennen ...",y("rider-program-body").innerHTML="",He("riderProgram");const a=await G.getRiderProgramRaces(e);if(!a.success||!a.data){y("rider-program-meta").textContent="",y("rider-program-body").innerHTML=`<div class="results-empty">${v(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}y("rider-program-title").textContent=a.data.program.name,y("rider-program-meta").textContent=t?xe(t):"",y("rider-program-body").innerHTML=fp(a.data)}function hp(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=bp(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${it("Team","team","Team")}
          ${it("Fahrer","rider","Fahrer")}
          ${it("Spec1","spec1","Spezialisierung 1")}
          ${it("Rolle","role","Rolle")}
          ${it("Ges","overall","Gesamtstärke")}
          ${it("Phase","phase","Formphase")}
          ${it("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var s,r;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${pt((s=a.team)==null?void 0:s.id,(r=a.team)==null?void 0:r.name)}</td>
              <td><span class="race-participant-rider-cell">${se(gt(a.rider))}<strong>${v(xe(a.rider))}</strong></span></td>
              <td>${v(Is(a.rider))}</td>
              <td>${v(tt(a.rider))}</td>
              <td>${An(a.rider.overallRating)}</td>
              <td>${Bn(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${v(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function it(e,t,a){const s=c.raceParticipantsSort.key===t?" race-participants-sort-active":"",r=c.raceParticipantsSort.key===t?c.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${v(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${s}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${v(e)}</span>
        <span class="team-table-sort-indicator${c.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${r}</span>
      </button>
    </th>`}function bp(e){const t=c.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{var n,i,o,d;let r=0;switch(c.raceParticipantsSort.key){case"team":r=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=s.team)==null?void 0:i.name)??"","de");break;case"rider":r=xe(a.rider).localeCompare(xe(s.rider),"de");break;case"spec1":r=Is(a.rider).localeCompare(Is(s.rider),"de");break;case"role":r=tt(a.rider).localeCompare(tt(s.rider),"de");break;case"overall":r=a.rider.overallRating-s.rider.overallRating;break;case"phase":r=(a.rider.seasonFormPhase??"neutral").localeCompare(s.rider.seasonFormPhase??"neutral","de");break;default:r=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((d=s.program)==null?void 0:d.name)??"","de")}return r*t||xe(a.rider).localeCompare(xe(s.rider),"de")})}function Is(e){return e.specialization1!=null?Gt(e.specialization1):"–"}async function po(e){const t=at(e);c.selectedRaceParticipantsRaceId=e,y("race-participants-title").textContent=(t==null?void 0:t.name)??"Teilnehmer",y("race-participants-meta").textContent="Lade Programmfahrer ...",y("race-participants-body").innerHTML="",c.raceParticipants=[],He("raceParticipants"),await go()}async function go(e=!1){const t=c.selectedRaceParticipantsRaceId;if(t==null)return;const a=at(t);e&&(y("race-participants-meta").textContent="Lade Programmfahrer ...");const s=await G.getRaceProgramParticipants(t);if(!s.success||!s.data){y("race-participants-meta").textContent="",y("race-participants-body").innerHTML=`<div class="results-empty">${v(s.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}c.raceParticipants=s.data,y("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",y("race-participants-meta").textContent=`${s.data.length} Programmfahrer · ${a?Za(a):""}`,y("race-participants-body").innerHTML=hp(c.raceParticipants)}async function yp(e,t=null){const a=Ia(e);if(!a)return;const s=await pp(e);if(!s){alert(c.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}c.selectedDashboardProfileStageId=e,y("stage-profile-title").textContent=`${a.race.name} · ${ea(a.stage)}`;const r=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";y("stage-profile-meta").textContent=`${Q(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?hs(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?bs(a.stage.elevationGainMeters):"–"}${r}`,al(y("stage-profile-view"),s,a.stage.profile,Ja(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),He("stageProfile")}function vp(){y("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const r=Number(t.dataset.editStageRoster);if(!Number.isFinite(r))return;tp(r);return}const a=e.target.closest("button[data-live-stage]");if(a){const r=Number(a.dataset.liveStage);if(!Number.isFinite(r))return;uo(r,!0);return}const s=e.target.closest("button[data-instant-stage]");if(s){const r=Number(s.dataset.instantStage);if(!Number.isFinite(r))return;no(r)}}),y("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-participants-id]");if(t){const r=Number(t.dataset.dashboardRaceParticipantsId);Number.isFinite(r)&&po(r);return}const a=e.target.closest("button[data-dashboard-race-id]");if(!a)return;const s=Number(a.dataset.dashboardRaceId);Number.isFinite(s)&&Rs(s)}),y("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&yp(a)}),y("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const r=Number(t.dataset.riderProgramId);Number.isFinite(r)&&dr(r);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const s=a.dataset.raceParticipantsSort;c.raceParticipantsSort.key===s?c.raceParticipantsSort.direction=c.raceParticipantsSort.direction==="asc"?"desc":"asc":c.raceParticipantsSort={key:s,direction:"asc"},go()}),y("btn-advance-day").addEventListener("click",async()=>{await fo()}),y("btn-auto-progress").addEventListener("click",()=>{Sp()})}async function fo(){fe("Tag wird fortgeschrieben...");try{const e=await G.advanceDay();if(!e.success)return alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler")),!1;if(c.currentSave&&e.data&&(c.currentSave.currentSeason=e.data.season),await or(),await lr(),ge("teams")){const{refreshTeamsViewData:t}=await Gn(async()=>{const{refreshTeamsViewData:a}=await Promise.resolve().then(()=>Qm);return{refreshTeamsViewData:a}},void 0);await t()}return!0}catch(e){return alert("Unerwarteter Fehler beim Tageswechsel: "+e.message),!1}finally{ue()}}function cr(){const e=document.getElementById("btn-auto-progress");e&&(qe?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function Sp(){qe?ho():kp()}function kp(){qe||(Ns(!0),cr(),$p())}function ho(){qe&&(Ns(!1),cr())}async function $p(){var e;for(;qe;){const t=((e=c.gameStatus)==null?void 0:e.pendingStages)??[];let a=!1;if(t.length>0){const s=t[0];a=await no(s.stageId,!0)}else a=await fo();if(!a){Ns(!1);break}await new Promise(s=>setTimeout(s,100))}cr()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&qe){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),ho()}});const Wt=50;function ur(){return[...Qs,...er[c.riderMenuDetailPage]]}function bo(e){return c.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function yo(e){if(!e.sortKey)return`<th class="${v(e.className??"")}" title="${v(e.title)}">${v(e.label)}</th>`;const t=c.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${v(e.className??"")}" title="${v(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${v(e.label)}</span>
        ${bo(e.sortKey)}
      </button>
    </th>`}function vo(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${Qt.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function Ma(){const e=y("riders-detail"),t=ur(),a=to(c.riders),s=a.length,r=Math.max(1,Math.ceil(s/Wt));c.riderMenuPage=Math.min(r,Math.max(1,c.riderMenuPage));const n=(c.riderMenuPage-1)*Wt,i=Math.min(s,n+Wt),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${s} Fahrer</span>
        <span class="text-muted">Sortierung: ${v(sr(c.riderMenuTableSort.key))} ${c.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${vo()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(yo).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(d=>`
                <tr class="team-detail-row">
                  ${t.map(l=>rr(d,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${c.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${c.riderMenuPage} / ${r} · Fahrer ${s===0?0:n+1}-${i} von ${s}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${c.riderMenuPage>=r?"disabled":""}>Weiter</button>
      </div>
    </div>`}function So(){y("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&dr(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;Qt.includes(n)&&(c.riderMenuDetailPage=n,new Set(ur().map(o=>o.sortKey).filter(o=>o!=null)).has(c.riderMenuTableSort.key)||(c.riderMenuTableSort={key:"name",direction:"asc"}),c.riderMenuPage=1,Ma());return}const s=e.target.closest("button[data-riders-sort]");if(s){const n=s.dataset.ridersSort;c.riderMenuTableSort.key===n?c.riderMenuTableSort.direction=c.riderMenuTableSort.direction==="asc"?"desc":"asc":c.riderMenuTableSort={key:n,direction:ar(n)},c.riderMenuPage=1,Ma();return}const r=e.target.closest("button[data-riders-page-action]");if(r){const n=r.dataset.ridersPageAction,i=Math.max(1,Math.ceil(c.riders.length/Wt));n==="prev"&&(c.riderMenuPage=Math.max(1,c.riderMenuPage-1)),n==="next"&&(c.riderMenuPage=Math.min(i,c.riderMenuPage+1)),Ma();return}})}const Tp=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:Wt,getActiveRiderMenuTableColumns:ur,getRiderMenuSortIndicator:bo,initRidersListeners:So,renderRiderMenuDetailPageTabs:vo,renderRiderMenuTableHeader:yo,renderRidersMenu:Ma},Symbol.toStringTag,{value:"Module"})),va=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function We(e){return e==null?"free-agents":String(e)}function $n(e){var a;const t=c.riderTeamEditorPayload;return t?((a=t.teams.find(s=>s.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function Mp(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return Dn(t/11.2,0,100)}function xp(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function wp(e){return c.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function Rp(e){const t=c.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${v(e.title)}"
        aria-label="${v(e.title)}"
      >
        <span class="team-table-sort-label">${v(e.label)}</span>
        ${wp(e.key)}
      </button>
    </th>`}function Ip(e,t){switch(c.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return J(e.firstName,t.firstName);case"lastName":return J(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return J($n(e.teamId),$n(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return J(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return J(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function Fp(e){const t=c.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>(Ip(a,s)||J(a.lastName,s.lastName)||J(a.firstName,s.firstName)||a.riderId-s.riderId)*t)}function Ep(e){const t=c.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(s=>We(s.teamId)===t);return Fp(a)}function Cp(e){const t=c.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${We(a.teamId)}"${a.teamId===e?" selected":""}>${v(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function ko(e){return c.riderTeamEditorDirtyRiderIds.includes(e)}function Np(e,t){const a=ko(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${Ls(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${Cp(e.teamId)}</select></td>`;case"number":{const s=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${s}"></td>`}case"text":{const s=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${v(s)}"></td>`}default:return"<td>–</td>"}}function Pp(e){const t=[...e.teams].sort((a,s)=>a.rank-s.rank||J(a.name,s.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${c.riderTeamEditorSelectedTeamKey===We(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${We(a.teamId)}">
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
    </aside>`}function Re(){var o;const e=y("rider-team-editor-root"),t=y("rider-team-editor-meta"),a=c.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const s=c.riderTeamEditorSelectedTeamKey?a.teams.find(d=>We(d.teamId)===c.riderTeamEditorSelectedTeamKey)??null:null,r=Ep(a),n=c.riderTeamEditorDirtyRiderIds.length,i=s==null?"Kein Team gewählt":`${s.riderCount} Fahrer · Ø ${s.averageOverall!=null?s.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${s.rank}`;t.textContent=s==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${s.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${c.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(d=>`
                  <option value="${We(d.teamId)}"${c.riderTeamEditorSelectedTeamKey===We(d.teamId)?" selected":""}>${v(d.name)} (${d.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${v(c.riderTeamEditorSort.key==="teamName"?"Team":((o=va.find(d=>d.key===c.riderTeamEditorSort.key))==null?void 0:o.title)??c.riderTeamEditorSort.key)} ${c.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
              <span class="text-muted">Ungespeichert: ${n}</span>
            </div>
            <div class="rider-team-editor-actions">
              <button type="button" class="btn btn-secondary" data-rider-team-editor-action="reload">Neu laden</button>
              <button type="button" class="btn btn-secondary" data-rider-team-editor-action="export" ${c.riderTeamEditorExporting?"disabled":""}>${c.riderTeamEditorExporting?"Exportiert…":"riders.csv exportieren"}</button>
              <button type="button" class="btn btn-primary" data-rider-team-editor-action="save" ${n===0||c.riderTeamEditorSaving?"disabled":""}>${c.riderTeamEditorSaving?"Speichert…":"Änderungen speichern"}</button>
            </div>
          </div>
          <div class="team-detail-table-scroll rider-team-editor-table-scroll">
            <table class="data-table data-table-teams rider-team-editor-table">
              <thead>
                <tr>
                  ${va.map(Rp).join("")}
                </tr>
              </thead>
              <tbody>
                ${r.length===0?`<tr><td colspan="${va.length}" class="text-muted">${c.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:r.map(d=>`
                    <tr class="team-detail-row${ko(d.riderId)?" rider-team-editor-row-dirty":""}">
                      ${va.map(l=>Np(d,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${Pp(a)}
    </div>`}function Lp(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),d=o.length===0?null:Math.round(o.reduce((l,g)=>l+g.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:d,rank:0}}),s=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:s.length,averageOverall:s.length===0?null:Math.round(s.reduce((i,o)=>i+o.overallRating,0)/s.length*100)/100,rank:0,isFreeAgents:!0});const r=[...a].sort((i,o)=>{const d=i.averageOverall??-1;return(o.averageOverall??-1)-d||o.riderCount-i.riderCount||J(i.name,o.name)}),n=new Map(r.map((i,o)=>[We(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(We(i.teamId))??a.length}))}async function $o(e=!1){if(c.riderTeamEditorPayload&&!e){Re();return}y("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await G.getRiderTeamEditor();if(!t.success||!t.data){y("rider-team-editor-root").innerHTML=`<div class="results-empty">${v(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}c.riderTeamEditorPayload=t.data,c.riderTeamEditorDirtyRiderIds=[],c.riderTeamEditorSaving=!1,c.riderTeamEditorExporting=!1,c.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(s=>We(s.teamId)===c.riderTeamEditorSelectedTeamKey)||(c.riderTeamEditorSelectedTeamKey="")),Re()}function Dp(e,t,a){const s=c.riderTeamEditorPayload;if(!s)return;const r=s.riders.find(n=>n.riderId===e);r&&(t==="teamId"?r.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof r[t]=="number"?r[t]=Number.parseInt(a||"0",10):r[t]=a,r.overallRating=Mp(r),s.teams=Lp(s),c.riderTeamEditorDirtyRiderIds.includes(e)||(c.riderTeamEditorDirtyRiderIds=[...c.riderTeamEditorDirtyRiderIds,e]),Re())}async function Ap(){if(!c.riderTeamEditorPayload||c.riderTeamEditorSaving)return;c.riderTeamEditorSaving=!0,Re();const e=await G.saveRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Re();return}c.riderTeamEditorPayload=e.data,c.riderTeamEditorDirtyRiderIds=[],Re()}async function Bp(){if(!c.riderTeamEditorPayload||c.riderTeamEditorExporting)return;c.riderTeamEditorExporting=!0,Re();const e=await G.exportRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Re();return}ys(e.data.fileName,e.data.content),Re()}function _p(){y("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const r=t.dataset.riderTeamEditorSort;c.riderTeamEditorSort.key===r?c.riderTeamEditorSort.direction=c.riderTeamEditorSort.direction==="asc"?"desc":"asc":c.riderTeamEditorSort={key:r,direction:xp(r)},Re();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){c.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Re();return}const s=e.target.closest("button[data-rider-team-editor-action]");if(s){const r=s.dataset.riderTeamEditorAction;if(r==="reload"){$o(!0);return}if(r==="export"){Bp();return}r==="save"&&Ap()}}),y("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){c.riderTeamEditorSelectedTeamKey=t.value,Re();return}const a=e.target.closest(".rider-team-editor-input");if(a){const s=Number(a.dataset.riderTeamEditorRiderId),r=a.dataset.riderTeamEditorField;Number.isFinite(s)&&r&&Dp(s,r,a.value)}})}let Ve={key:"pickNumber",asc:!0};function Tn(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),s=.26+t*.18,r=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${s};--rider-stats-pill-bg-alpha:${r};`}async function To(e,t=!1){const a=await G.getDraftHistory(e);if(!a.success){c.draftHistory=null,ge("draft")&&Fs(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}c.draftHistory=a.data??null,ge("draft")&&Fs()}function Fs(){const e=y("draft-table-container"),t=y("draft-season-select");if(!c.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const i=c.currentSave.startSeason??2026;for(let o=c.currentSave.currentSeason;o>=i;o--){const d=document.createElement("option");d.value=o.toString(),d.textContent=`Saison ${o}`,t.appendChild(d)}c.draftSelectedSeason||(c.draftSelectedSeason=c.currentSave.currentSeason),t.value=c.draftSelectedSeason.toString(),t.onchange=o=>{const d=o.target;c.draftSelectedSeason=parseInt(d.value,10),To(c.draftSelectedSeason)}}if(!c.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(c.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...c.draftHistory.rows].sort((i,o)=>{let d=0;const l=Ve.key;return l==="riderLastName"?d=i.riderLastName.localeCompare(o.riderLastName):l==="teamName"?d=i.teamName.localeCompare(o.teamName):l==="oldTeamName"?d=(i.oldTeamName||"").localeCompare(o.oldTeamName||""):l==="countryCode"?d=i.countryCode.localeCompare(o.countryCode):d=(i[l]??0)-(o[l]??0),Ve.asc?d:-d}),s=i=>Ve.key!==i?'<span class="sort-icon-placeholder"></span>':Ve.asc?" ▲":" ▼",r=i=>{Ve.key===i?Ve.asc=!Ve.asc:(Ve.key=i,Ve.asc=!0),Fs()};window.setDraftSort=r;let n=`
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
  `;for(const i of a){const o=c.draftHistory.season-i.riderBirthYear;let d="-";i.oldTeamName&&(d=`<div style="display:flex; align-items:center; gap:0.5rem;">${pt(i.oldTeamId,i.oldTeamName)} ${v(i.oldTeamName)}</div>`);const l=`<div style="display:flex; align-items:center; gap:0.5rem;">${pt(i.teamId,i.teamName)} ${v(i.teamName)}</div>`;n+=`
      <tr>
        <td class="text-center">#${i.pickNumber}</td>
        <td class="text-center">Runde ${i.draftRound}</td>
        <td>${l}</td>
        <td>${d}</td>
        <td class="text-center">${se(i.countryCode)}</td>
        <td>${v(i.riderFirstName)} ${v(i.riderLastName)}</td>
        <td class="text-center">${o} J.</td>
        <td class="text-center">${i.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Tn(i.overallAtDraft)}">${i.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Tn(i.potOverallAtDraft)}">${i.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}n+="</tbody></table>",e.innerHTML=n}async function Gp(e=!1){const t=await G.getInjuries();if(!t.success){c.injuries=null,ge("injuries")&&Mn(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}c.injuries=t.data??[],ge("injuries")&&Mn()}function Mn(){const e=y("injuries-table-container");if(!c.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(y("injuries-meta").textContent=c.injuries.length+" Ausfälle",c.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=Ut;let t="";const a=c.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),s=new Map;for(const n of a){const i=n.teamId;s.has(i)||s.set(i,[]),s.get(i).push(n)}for(const n of s.keys())s.get(n).sort((i,o)=>o.overallRating-i.overallRating);const r=Array.from(s.keys()).sort((n,i)=>{const o=s.get(n)[0].teamAbbreviation||"",d=s.get(i)[0].teamAbbreviation||"";return o.localeCompare(d)});if(r.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of r){const i=s.get(n),o=i[0].teamAbbreviation;t+=`
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
      `;for(const d of i){const l=d.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let g="";if(d.fitDate){const m=Q(d.fitDate);if(d.missedRaces&&d.missedRaces.length>0){let u="";for(const p of d.missedRaces)u+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${Q(p.startDate)}</span>
                  ${se(p.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${v(p.name)}</strong>
                  ${Zs(p.categoryName)}
                </div>
              `;g=`
              <div class="injury-fit-cell">
                <strong>${m}</strong>
                <div class="injury-fit-tooltip">
                  <div style="margin-bottom: 0.4rem; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.2rem;">Verpasste Rennen (${d.missedRaces.length})</div>
                  ${u}
                </div>
              </div>
            `}else g=`<strong>${m}</strong>`}else g="Unbekannt";t+=`
          <tr>
            <td>${se(d.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${d.riderId})" style="color: inherit; text-decoration: none;"><strong>${v(d.riderFirstName)} ${v(d.riderLastName)}</strong></a></td>
            <td>${d.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${zi(d.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${d.unavailableDays} Tage</strong></td>
            <td>${g}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function xn(e){return e===0?"–":`-${e}`}function Hp(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${Ue(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Me(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function zp(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${v(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${Hp(e.topRiders)}
      </div>
    </div>`}function Kp(e,t){const a=t.filter(s=>s.teamId!=null&&e.teamId!=null&&s.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${Ue(s.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Me(s.riderName??"–",{riderId:s.riderId,teamId:s.teamId,strong:!1})}</span>
          <strong>${s.points}</strong>
        </div>
      `).join("")}
    </div>`}function Wp(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${lt(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${Kp(e,t)}
      </div>
    </div>`}async function Op(e){const t=await G.getSeasonStandings();if(!t.success){c.seasonStandings=null,ge("season-standings")&&Es();return}c.seasonStandings=t.data??null,ge("season-standings")&&Es()}function Es(){var h,f,b,S,$,w;const e=y("season-standings-meta"),t=y("season-standings-scope-tabs"),a=y("season-standings-empty"),s=y("season-standings-table"),r=y("season-standings-tbody"),n=y("season-standings-jersey-header"),i=y("season-standings-primary-header"),o=y("season-standings-flag-header"),d=y("season-standings-secondary-header"),l=((h=c.seasonStandings)==null?void 0:h.season)??((f=c.gameState)==null?void 0:f.season)??((b=c.currentSave)==null?void 0:b.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.",t.innerHTML=`
    <button
      type="button"
      class="results-type-btn${c.selectedSeasonStandingScope==="riders"?" active":""}"
      data-season-scope="riders"
    >Fahrer</button>
    <button
      type="button"
      class="results-type-btn${c.selectedSeasonStandingScope==="teams"?" active":""}"
      data-season-scope="teams"
    >Teams</button>
    <button
      type="button"
      class="results-type-btn${c.selectedSeasonStandingScope==="countries"?" active":""}"
      data-season-scope="countries"
    >Country</button>
  `;const g=c.selectedSeasonStandingScope==="countries",m=g?((S=c.seasonStandings)==null?void 0:S.countryStandings)??[]:c.selectedSeasonStandingScope==="teams"?(($=c.seasonStandings)==null?void 0:$.teamStandings)??[]:((w=c.seasonStandings)==null?void 0:w.riderStandings)??[],u=g?m:[],p=g?[]:m;if(n.textContent="Trikot",i.textContent=g?"Land":c.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",d.textContent=c.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",g),d.classList.toggle("hidden",g),!c.seasonStandings||m.length===0){r.innerHTML="",s.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}r.innerHTML=g?u.map(M=>`
      <tr>
        <td class="pos-${Math.min(M.rank,3)}">${M.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${zp(M)}</td>
        <td class="results-flag-col-cell">${Ue(M.countryCode)}</td>
        <td class="hidden"></td>
        <td>${M.points}</td>
        <td>${v(xn(M.gapPoints))}</td>
      </tr>`).join(""):p.map(M=>{var P;const x=M.riderName??M.teamName,D=Lt(M.teamId,M.teamName),C=c.selectedSeasonStandingScope==="teams"?Wp(M,((P=c.seasonStandings)==null?void 0:P.riderStandings)??[]):Dt(x,!0,!1,M.riderId,M.teamId),A=Ue(M.countryCode),N=c.selectedSeasonStandingScope==="teams"?v(M.countryName??M.countryCode??"–"):lt(M.teamName??"–",M.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(M.rank,3)}">${M.rank}</td>
          <td class="results-jersey-col-cell">${D}</td>
          <td>${C}</td>
          <td class="results-flag-col-cell">${A}</td>
          <td>${N}</td>
          <td>${M.points}</td>
          <td>${v(xn(M.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),s.classList.remove("hidden")}function jp(){y("season-standings-scope-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-season-scope]");if(!t)return;const a=t.dataset.seasonScope;a!=="riders"&&a!=="teams"&&a!=="countries"||(c.selectedSeasonStandingScope=a,Es())})}function wn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function Vp(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,s=[...e].map(l=>({rider:l,score:t(l)})).sort((l,g)=>g.score-l.score).slice(0,10),r=[...e].map(l=>({rider:l,score:a(l)})).sort((l,g)=>g.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,g)=>g.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,g)=>g.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,g)=>g.score-l.score).slice(0,10),d=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,g)=>g.score-l.score).slice(0,10);return{Gesamtklassement:s,Sprinter:r,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:d}}function Up(e,t){const a=c.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const s=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,r=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>s(o)):t==="Sprinter"?n=a.map(o=>r(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,d)=>d-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,d)=>o+d,0)/i.length}function Yp(e,t){var i;const s=c.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:Up(o.id,t)}));s.sort((o,d)=>d.avgScore-o.avgScore);const r=s.findIndex(o=>o.teamId===e)+1,n=((i=s.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:r,total:s.length,average:n}}function Zp(e){const t=c.riders.filter(r=>r.activeTeamId===e);if(t.length===0)return 0;const a=t.map(r=>r.overallRating??0);a.sort((r,n)=>n-r);const s=a.slice(0,10);return s.length===0?0:s.reduce((r,n)=>r+n,0)/s.length}function qp(e){var n;const a=c.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:Zp(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const s=a.findIndex(i=>i.teamId===e)+1,r=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:s,total:a.length,average:r}}function Sa(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function cs(e){e.countryCode&&se(e.countryCode);const t=Vp(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,g)=>g.formValue-l.formValue).slice(0,10),s=[...e.riders].map(l=>({rider:l,uciRank:Ha(l.id)})).filter(l=>l.uciRank!==null).sort((l,g)=>l.uciRank-g.uciRank).slice(0,10),r=Object.entries(t).map(([l,g])=>{const m=Yp(e.teamId,l),u=m.average.toFixed(1).replace(".",","),p=g.map(({rider:h,score:f})=>{const b=`${h.firstName.charAt(0)}. ${h.lastName}`,S=Me(b,{riderId:h.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),$=h.nationality?et[h.nationality]??h.nationality.slice(0,2).toLowerCase():null,w=$?`<span class="fi fi-${$} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${v(h.nationality)}"></span>`:"",M=c.riders.find(D=>D.id===h.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${Sa((M==null?void 0:M.roleId)??null).color};">
            ${w}
            ${S}
          </span>
          <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${f.toFixed(0)}</span>
        </li>
      `}).join("");return`
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
          ${l}
          <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-400); display: block; margin-top: 0.1rem;">Platz ${m.rank}/${m.total} · Ø ${u}</span>
        </h4>
        <ul style="margin: 0; padding: 0; list-style: none;">${p}</ul>
      </div>
    `}).join(""),i=[...e.riders].sort((l,g)=>(g.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const g=`${l.firstName.charAt(0)}. ${l.lastName}`,m=Me(g,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),u=l.nationality?et[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,p=u?`<span class="fi fi-${u} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${v(l.nationality)}"></span>`:"",h=l.overallRating.toFixed(0),f=c.riders.find(S=>S.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Sa((f==null?void 0:f.roleId)??null).color};">
          ${p}
          ${m}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${h}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:g})=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Me(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),p=l.nationality?et[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,h=p?`<span class="fi fi-${p} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${v(l.nationality)}"></span>`:"",f=(g>=0?"+":"")+g.toFixed(1).replace(".",","),b=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,S=c.riders.find(w=>w.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Sa((S==null?void 0:S.roleId)??null).color};">
          ${h}
          ${u}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${b}">${f}</span>
      </li>
    `}).join(""),d=s.map(({rider:l,uciRank:g})=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Me(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),p=l.nationality?et[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,h=p?`<span class="fi fi-${p} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${v(l.nationality)}"></span>`:"";let f="rider-stats-rank-badge-gc";g===1?f="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":g===2?f="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":g===3&&(f="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const b=`<span class="rider-stats-rank-badge ${f}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${g}">${g}</span>`,S=c.riders.find(w=>w.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Sa((S==null?void 0:S.roleId)??null).color};">
          ${h}
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
          <ul style="margin: 0; padding: 0; list-style: none;">${d||'<li class="text-muted" style="font-size:0.85rem;">Keine Fahrer platziert</li>'}</ul>
        </div>
      </div>
    </div>
  `}function us(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${c.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${c.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${c.teamStatsTab==="contracts"?"true":"false"}">Auslaufende Verträge</button>
    </div>`}function Jp(e){const t=Array.from(new Set(e.topResults.map(u=>u.raceCategoryName).filter(Boolean)));t.sort((u,p)=>u.localeCompare(p,"de"));const a=Array.from(new Set(e.topResults.map(u=>u.season))).sort((u,p)=>p-u);let s=e.topResults.filter(u=>u.rowType!=="stage_result"?u.rowType==="gc_final"?c.teamStatsTopResultsFilters.gc:u.rowType==="mountain_final"?c.teamStatsTopResultsFilters.mountain:u.rowType==="points_final"?c.teamStatsTopResultsFilters.points:u.rowType==="youth_final"?c.teamStatsTopResultsFilters.youth:!0:u.profile==="TTT"||u.isStageRace||u.stageNumber!=null?c.teamStatsTopResultsFilters.stage:c.teamStatsTopResultsFilters.oneDay);if(c.teamStatsTopResultsFilterCategory){const u=c.teamStatsTopResultsFilterCategory;if(u.endsWith("-etappen")){const p=u.substring(0,u.length-8);s=s.filter(h=>h.raceCategoryName===p&&h.rowType==="stage_result")}else if(u.endsWith("-gc")){const p=u.substring(0,u.length-3);s=s.filter(h=>h.raceCategoryName===p&&h.rowType!=="stage_result")}else s=s.filter(p=>p.raceCategoryName===u)}c.teamStatsTopResultsFilterSeason!=null&&(s=s.filter(u=>u.season===c.teamStatsTopResultsFilterSeason)),s.sort((u,p)=>{if(p.seasonPoints!==u.seasonPoints)return p.seasonPoints-u.seasonPoints;const h=u.rowType!=="stage_result",f=p.rowType!=="stage_result",b=u.resultRank??9999,S=p.resultRank??9999;if(c.teamStatsTopResultsFilterCategory)return b!==S?b-S:h!==f?h?-1:1:0;{const $=wn(u.raceCategoryName),w=wn(p.raceCategoryName);return $!==w?$-w:h!==f?h?-1:1:b-S}});const r=20,n=Math.max(1,Math.min(10,Math.ceil(s.length/r)));c.teamStatsTopResultsPage>n&&(c.teamStatsTopResultsPage=n);const i=(c.teamStatsTopResultsPage-1)*r,o=s.slice(i,i+r),l=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${t.map(u=>{if(u.toLowerCase().includes("stage race")||u.toLowerCase().includes("grand tour")||u.toLowerCase().includes("tour de france")){const h=`${u}-etappen`,f=`${u}-gc`;return`
        <option value="${v(h)}" ${c.teamStatsTopResultsFilterCategory===h?"selected":""}>${v(u)} - Etappen</option>
        <option value="${v(f)}" ${c.teamStatsTopResultsFilterCategory===f?"selected":""}>${v(u)} - GC</option>
      `}else return`<option value="${v(u)}" ${c.teamStatsTopResultsFilterCategory===u?"selected":""}>${v(u)}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="team-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${a.map(u=>`<option value="${u}" ${c.teamStatsTopResultsFilterSeason===u?"selected":""}>Saison ${u}</option>`).join("")}
        </select>
      </div>
      
      <div class="top-results-checkboxes" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; border-left: 1px solid rgba(255, 255, 255, 0.15); padding-left: 1rem;">
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="gc" ${c.teamStatsTopResultsFilters.gc?"checked":""} style="accent-color: #ffd700; width: 14px; height: 14px; cursor: pointer;">
          nur GC
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="mountain" ${c.teamStatsTopResultsFilters.mountain?"checked":""} style="accent-color: #ff4d4d; width: 14px; height: 14px; cursor: pointer;">
          nur Bergwertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="points" ${c.teamStatsTopResultsFilters.points?"checked":""} style="accent-color: #2ecc71; width: 14px; height: 14px; cursor: pointer;">
          nur Punktewertung
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="youth" ${c.teamStatsTopResultsFilters.youth?"checked":""} style="accent-color: #ffffff; width: 14px; height: 14px; cursor: pointer;">
          nur Nachwuchs
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="oneDay" ${c.teamStatsTopResultsFilters.oneDay?"checked":""} style="accent-color: #9b59b6; width: 14px; height: 14px; cursor: pointer;">
          One Day Races
        </label>
        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #fff; gap: 0.4rem; font-size: 0.9rem; user-select: none; margin-bottom: 0;">
          <input type="checkbox" class="team-stats-filter-checkbox" data-filter-type="stage" ${c.teamStatsTopResultsFilters.stage?"checked":""} style="accent-color: #3498db; width: 14px; height: 14px; cursor: pointer;">
          Etappenwertungen
        </label>
      </div>
    </div>
  `,g=o.length===0?'<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(u=>{const p=u.rowType!=="stage_result",h=p?`${u.raceName} · ${u.rowType==="gc_final"?"Gesamtwertung":u.rowType==="points_final"?"Punktewertung":u.rowType==="mountain_final"?"Bergwertung":"Nachwuchs"}`:u.stageNumber?`${u.raceName} · Etappe ${u.stageNumber}`:u.raceName;let f="–",b="–";u.finishStatus==="otl"?f=ht("OTL","place"):u.finishStatus==="dnf"?f=ht("DNF","place"):u.resultRank==null||(p?b=`<span class="rider-stats-final-type ${u.rowType==="gc_final"?"is-gc":u.rowType==="points_final"?"is-points":u.rowType==="mountain_final"?"is-mountain":"is-youth"}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${u.resultRank}</span>`:f=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${u.resultRank<=3?` rider-stats-rank-badge-top-${u.resultRank}`:""}">${v(String(u.resultRank))}</span>`);const S=u.profile?ta(u.profile):"–",$=!p&&u.stageScore!=null&&u.stageScore>0?Ua(u.stageScore,0,350):"–",w=Ga(u.raceCategoryName),M=u.riderCountryCode?et[u.riderCountryCode]??u.riderCountryCode.slice(0,2).toLowerCase():null,x=M?`<span class="fi fi-${M} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${v(u.riderCountryCode??"")}"></span>`:"–",D=Me(u.riderName,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${p?" rider-stats-row-final":""}">
            <td>${f}</td>
            <td>${b}</td>
            <td>${x}</td>
            <td style="white-space: nowrap;">${D}</td>
            <td><strong>${v(h)}</strong></td>
            <td>${S}</td>
            <td>${$}</td>
            <td>${w}</td>
            <td>Saison ${u.season}</td>
            <td><strong>${u.seasonPoints}</strong></td>
          </tr>
        `}).join(""),m=n>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${c.teamStatsTopResultsPage-1}" ${c.teamStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        ${Array.from({length:n}).map((u,p)=>{const h=p+1;return`<button type="button" class="btn btn-sm ${c.teamStatsTopResultsPage===h?"btn-primary":"btn-secondary"}" data-team-top-results-page="${h}">${h}</button>`}).join("")}
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${c.teamStatsTopResultsPage+1}" ${c.teamStatsTopResultsPage===n?"disabled":""}>Weiter &raquo;</button>
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
            ${g}
          </tbody>
        </table>
      </div>
      ${m}
    </section>
  `}function Xp(e){const t=String(c.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,categories:{}},s=t==="all",r=m=>s?m:"–",n=(m,u)=>s?`${m} / ${u} T`:"–",i=s?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(m,u,p,h)=>{const f=typeof m=="number"?m:parseFloat(String(m))||0;let b="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return f===0?b+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":u==="gold"?b+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":u==="silver"?b+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":u==="bronze"?b+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":u==="purple"?b+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":u==="green"?b+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":u==="red"?b+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":u==="white"&&(b+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${b}" title="${v(p)}: ${f} Siege">${m}</span>`},d=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #fff;">Karrierestatistiken (Team)</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="team-stats-success-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
        <select id="team-stats-success-season-select" class="form-control" style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">
          <option value="all" ${s?"selected":""}>Ewig (All-Time)</option>
          ${Object.keys(e.successStats).filter(m=>m!=="all").sort((m,u)=>u.localeCompare(m)).map(m=>`
            <option value="${m}" ${String(c.teamStatsSelectedSeason)===m?"selected":""}>Saison ${m}</option>
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
        ${d.map(m=>{const u=a.categories[m.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${v(m.name)}">${v(m.name)}</span>
                ${Zs(m.key)}
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
                  ${pe(u.winWeather1||0,1,"Sonnig")}
                  ${pe(u.winWeather2||0,2,"Extreme Hitze")}
                  ${pe(u.winWeather3||0,3,"Leichter Regen")}
                  ${pe(u.winWeather4||0,4,"Starkregen")}
                  ${pe(u.winWeather5||0,5,"Starker Wind")}
                  ${pe(u.winWeather6||0,6,"Dichter Nebel")}
                  ${pe(u.winWeather7||0,7,"Schnee/Eis")}
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
  `}function Qp(e){var r;const t=((r=c.gameState)==null?void 0:r.season)??new Date().getFullYear(),a=[...e.riders].sort((n,i)=>{const o=n.contractEndSeason??9999,d=i.contractEndSeason??9999;return o!==d?o-d:i.overallRating-n.overallRating});return`
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
            ${a.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Vertragsdaten verfügbar.</td></tr>':a.map(n=>{const i=n.nationality?et[n.nationality]??n.nationality.slice(0,2).toLowerCase():null,o=i?`<span class="fi fi-${i} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${v(n.nationality)}"></span>`:"–",d=Me(`${n.firstName} ${n.lastName}`,{riderId:n.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),l=c.riders.find(f=>f.id===n.id),g=`<span class="results-roster-overall-badge" style="color:${Rn(n.overallRating)}" title="Stärke: ${n.overallRating.toFixed(2)}">${n.overallRating.toFixed(1)}</span>`;let m="–";l&&l.potential!=null&&(m=`<span class="results-roster-overall-badge" style="color:${Rn(l.potential)}" title="Potential: ${l.potential.toFixed(2)}">${l.potential.toFixed(1)}</span>`);const u=n.contractEndSeason===t,p=n.contractEndSeason?`Saison ${n.contractEndSeason}`:"Ohne Vertrag",h=u?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${v(p)}</span>`:`<span style="font-weight: 500;">${v(p)}</span>`;return`
          <tr class="rider-stats-row">
            <td>${o}</td>
            <td style="white-space: nowrap;">${d}</td>
            <td>${n.age}</td>
            <td>${g}</td>
            <td>${m}</td>
            <td>${h}</td>
          </tr>
        `}).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `}function Rn(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function ot(e){return c.teamStatsTab==="career"?`
      ${cs(e)}
      ${us()}
      ${Xp(e)}
    `:c.teamStatsTab==="contracts"?`
      ${cs(e)}
      ${us()}
      ${Qp(e)}
    `:`
    ${cs(e)}
    ${us()}
    ${Jp(e)}
  `}function eg(e,t){var s;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((s=c.teams.find(r=>r.id===e))==null?void 0:s.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${v(a)}" aria-label="${v(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${v(Pn(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function Mo(e){c.teamStatsSelectedTeamId=e,c.teamStatsTab="topResults",c.teamStatsTopResultsFilterCategory=null,c.teamStatsTopResultsFilterSeason=null,c.teamStatsSelectedSeason="all",c.teamStatsTopResultsPage=1;const t=c.teams.find(n=>n.id===e);y("team-stats-title").innerHTML=t?`Team <strong>${v(t.name)}</strong>`:"Teamstatistik",y("team-stats-jersey").innerHTML=eg(e,(t==null?void 0:t.name)??"");const a=qp(e),s=a.average.toFixed(2).replace(".",",");y("team-stats-meta").innerHTML=t?`${v(t.abbreviation)} · ${v(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${s})`:"Daten werden geladen",y("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,He("teamStats");const r=await G.getTeamStats(e);if(c.teamStatsSelectedTeamId===e){if(!r.success||!r.data){y("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${v(r.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}c.teamStatsPayload=r.data,y("team-stats-body").innerHTML=ot(r.data)}}function tg(){y("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-stats-tab]");if(a){const r=a.dataset.teamStatsTab;(r==="topResults"||r==="career"||r==="contracts")&&(c.teamStatsTab=r,c.teamStatsPayload&&(y("team-stats-body").innerHTML=ot(c.teamStatsPayload)));return}const s=t.closest("button[data-team-top-results-page]");if(s){const r=Number(s.dataset.teamTopResultsPage);!isNaN(r)&&r>=1&&(c.teamStatsTopResultsPage=r,c.teamStatsPayload&&(y("team-stats-body").innerHTML=ot(c.teamStatsPayload)));return}}),y("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;c.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(y("team-stats-body").innerHTML=ot(c.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;c.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(y("team-stats-body").innerHTML=ot(c.teamStatsPayload))}else if(t.classList.contains("team-stats-filter-checkbox")){const a=t,s=a.dataset.filterType;c.teamStatsTopResultsFilters[s]=a.checked,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(y("team-stats-body").innerHTML=ot(c.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;c.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),c.teamStatsPayload&&(y("team-stats-body").innerHTML=ot(c.teamStatsPayload))}})}let Mt="riders",Ze="season",mr="season",bt="";const Ka=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function ag(){const e=y("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");rg(o)})})}const t=y("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");ng(o)})})}Ka.forEach(n=>{const i=y(n);i&&i.addEventListener("change",()=>{const o=i.value;o?ig(o,n):Ka.some(l=>{const g=y(l);return g&&g.value!==""})||(bt="",Ct())})}),window.openRiderStatsFromLeaderboard=Ut;const a=y("leaderboard-filter-wt"),s=y("leaderboard-filter-pt"),r=y("leaderboard-filter-other");[a,s,r].forEach(n=>{n&&n.addEventListener("change",()=>{Ct()})})}function sg(){Ct()}function rg(e){Mt=e;const t=y("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&(og(bt)&&(lg(),bt=""),Ze==="live"&&(Ze=mr,xa())),Ct()}function ng(e){Ze=e,mr=e,Ct()}function ig(e,t){bt=e,Ka.forEach(a=>{if(a!==t){const s=y(a);s&&(s.value="")}}),xo(e)?(Ze="live",xa()):pr(e)?(Ze="alltime",xa()):(Ze=mr,xa()),Ct()}function xo(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function pr(e){return["max_short_term_fatigue","max_long_term_fatigue","max_combined_fatigue","max_s_form","max_r_form","max_combined_form","mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function og(e){return xo(e)||pr(e)||e==="mentors_ranking"}function lg(){Ka.forEach(e=>{const t=y(e);t&&(t.value="")})}function xa(){const e=y("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');Ze==="live"?e.style.display="none":(e.style.display="flex",pr(bt)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),Ze==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function Ct(){var l,g,m;const e=y("leaderboard-empty"),t=y("leaderboard-table"),a=y("leaderboard-thead"),s=y("leaderboard-tbody");if(!e||!t||!a||!s)return;const r=y("leaderboard-filter-container");if(r&&(r.style.display=Mt==="teams"?"none":"flex"),!bt){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await G.getLeaderboards(Mt,bt,Ze);if(!ge("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(Mt==="riders"){const u=((l=y("leaderboard-filter-wt"))==null?void 0:l.checked)??!0,p=((g=y("leaderboard-filter-pt"))==null?void 0:g.checked)??!0,h=((m=y("leaderboard-filter-other"))==null?void 0:m.checked)??!1;if(i=n.data.filter(f=>{const b=f.teamDivisionId===1&&!f.isRetired,S=f.teamDivisionId===2&&!f.isRetired,$=f.teamDivisionId===null||f.teamDivisionId===void 0||f.isRetired||f.teamDivisionId!==1&&f.teamDivisionId!==2;return!!(b&&u||S&&p||$&&h)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden"),Mt==="riders"?a.innerHTML=`
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 50px; text-align: center;">Trikot</th>
        <th style="width: 60px; text-align: center;">Land</th>
        <th>Fahrer</th>
        <th>Team</th>
        <th style="text-align: right; width: 180px;">Wert</th>
      </tr>
    `:a.innerHTML=`
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 60px; text-align: center;">Trikot</th>
        <th>Team</th>
        <th style="text-align: right; width: 180px;">Wert</th>
      </tr>
    `;let o="",d=1;for(const u of i){const p=d++,f=`<span class="badge ${p===1?"badge-primary":p<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${p}</span>`,b=pt(u.teamId,u.teamName);if(Mt==="riders"){const S=u.nationality?se(u.nationality):"—",$=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${u.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${v(u.firstName)} ${v(u.lastName)}</a>`,w=u.teamAbbr?`<span class="text-muted" title="${v(u.teamName??"")}">${v(u.teamAbbr)}</span>`:"—";o+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${f}</td>
          <td style="text-align: center; vertical-align: middle;">${b}</td>
          <td style="text-align: center; vertical-align: middle;">${S}</td>
          <td style="vertical-align: middle;">${$}</td>
          <td style="vertical-align: middle;">${w}</td>
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${v(String(u.value))}</td>
        </tr>
      `}else{let S="";if(u.leadoutDetails){const $=u.leadoutDetails,w=$.sprinterNationality?se($.sprinterNationality):"";S=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">${v(u.teamName.split(" (Sprinter:")[0])}</div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${w}${v($.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${$.contributors.map(M=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${M.nationality?se(M.nationality):""}${v(M.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${M.contribution.toFixed(2)})</span>
                  </div>
                `).join("")}
            </div>
          </div>
        `}else S=`<strong>${v(u.teamName??"")}</strong>`;o+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${f}</td>
          <td style="text-align: center; vertical-align: middle;">${b}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${S}</td>
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${v(String(u.value))}</td>
        </tr>
      `}}s.innerHTML=o}let It=2026,Ee=5,In=!1;const dg=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function Fn(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${s}`}function cg(e,t){const a=[],s=new Date(e,t,1),r=new Date(e,t+1,0);let i=(s.getDay()+6)%7;const o=new Date(s);o.setDate(o.getDate()-i);const d=new Date(o);for(;d<=r||d.getDay()!==1;){const l=[];for(let g=0;g<7;g++)l.push(new Date(d)),d.setDate(d.getDate()+1);a.push(l)}return a}function ug(){if(In)return;In=!0,y("calendar-prev-month").addEventListener("click",()=>{Ee--,Ee<0&&(Ee=11,It--),wa()}),y("calendar-next-month").addEventListener("click",()=>{Ee++,Ee>11&&(Ee=0,It++),wa()}),y("calendar-today-btn").addEventListener("click",()=>{var t;if((t=c.gameState)!=null&&t.currentDate){const[a,s]=c.gameState.currentDate.split("-").map(Number);It=a,Ee=s-1}wa()}),y("calendar-race-search").addEventListener("input",()=>{wo()}),y("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&Rs(s)}}),y("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&Rs(r);return}const s=t.target.closest("button[data-dashboard-race-participants-id]");if(s){const r=Number(s.dataset.dashboardRaceParticipantsId);Number.isFinite(r)&&po(r)}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const s=a.dataset.raceId;s&&document.querySelectorAll(`[data-race-id="${s}"]`).forEach(r=>{r.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const s=a.dataset.raceId;s&&document.querySelectorAll(`[data-race-id="${s}"]`).forEach(r=>{r.classList.remove("calendar-highlight")})}},!0))}function mg(){var e;if((e=c.gameState)!=null&&e.currentDate){const[t,a]=c.gameState.currentDate.split("-").map(Number);It=t,Ee=a-1}wa()}function wa(){var r;if(!ge("calendar"))return;y("calendar-month-label").textContent=`${dg[Ee]} ${It}`;const e=cg(It,Ee),t=y("calendar-weeks"),a=((r=c.gameState)==null?void 0:r.currentDate)??"";let s="";for(const n of e){const i=n.map(Fn),o=[];for(const m of c.races)if(m.startDate<=i[6]&&m.endDate>=i[0]){const u=m.startDate<i[0]?0:i.indexOf(m.startDate),p=m.endDate>i[6]?6:i.indexOf(m.endDate);o.push({race:m,startIdx:u,endIdx:p})}o.sort((m,u)=>{const p=m.endIdx-m.startIdx+1,h=u.endIdx-u.startIdx+1;return h!==p?h-p:m.startIdx-u.startIdx});const d=Array.from({length:3},()=>Array(7).fill(!1));for(const m of o){let u=2;for(let p=0;p<3;p++){let h=!0;for(let f=m.startIdx;f<=m.endIdx;f++)if(d[p][f]){h=!1;break}if(h){u=p;break}}for(let p=m.startIdx;p<=m.endIdx;p++)d[u][p]=!0;m.slot=u}const l=n.map(m=>{const u=Fn(m);return`
        <div class="${["calendar-day-cell",m.getMonth()!==Ee?"other-month":"",u===a?"today":""].filter(Boolean).join(" ")}">
          <span class="calendar-day-number">${m.getDate()}</span>
        </div>
      `}).join(""),g=o.map(m=>{var w;const u=m.race,p=a>=u.startDate&&a<=u.endDate,h=a>u.endDate,f=Yt((w=u.category)==null?void 0:w.name),b=p?'<span class="calendar-live-dot"></span>':"",S=h?"opacity: 0.55;":"",$=m.endIdx-m.startIdx+1;return`
        <div class="calendar-event-bar ${p?"is-live":""}"
             data-race-id="${u.id}"
             style="grid-column: ${m.startIdx+1} / span ${$};
                    grid-row: ${m.slot+1};
                    background-color: ${f.background};
                    border: 1px solid ${f.border};
                    color: ${f.color};
                    ${S}"
             title="${v(u.name)} (${Q(u.startDate)} - ${Q(u.endDate)})">
          ${b}<span class="calendar-event-name">${v(u.name)}</span>
        </div>
      `}).join("");s+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${g}</div>
      </div>
    `}t.innerHTML=s,wo()}function wo(){var n;const e=y("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=y("calendar-races-tbody"),s=((n=c.gameState)==null?void 0:n.currentDate)??"",r=c.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(r.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=r.map(i=>{var b,S,$,w;const o=s>=i.startDate&&s<=i.endDate,l=s>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',g=((b=i.country)==null?void 0:b.name)??`Land ${i.countryId}`,m=(S=i.country)!=null&&S.code3?se(i.country.code3):"",u=i.isStageRace?(i.stages??[]).reduce((M,x)=>M+(x.distanceKm??0),0):(($=i.upcomingStage)==null?void 0:$.distanceKm)??null,p=i.isStageRace?(i.stages??[]).reduce((M,x)=>M+(x.elevationGainMeters??0),0):((w=i.upcomingStage)==null?void 0:w.elevationGainMeters)??null,h=u!=null?String(u.toFixed(1)).replace(".",","):"-",f=p!=null?String(Math.round(p)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${Q(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${v(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${ir(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${m}<span>${v(g)}</span></span></td>
        <td>${Ya(i)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${i.id}">Teilnehmer</button></td>
        <td>${h}</td>
        <td>${f}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}window.openTeamStats=Mo;async function Ro(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}Ps("game"),y("meta-career").textContent=((e=c.currentSave)==null?void 0:e.careerName)??"",yt("dashboard"),fe("Spiel wird geladen…");try{await or(),await lr(),qa()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{ue()}}function pg(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";yt(t),t==="dashboard"&&qa(),t==="teams"&&za(),t==="riders"&&za(),t==="rider-team-editor"&&$o(),t==="live-race"&&Rt(),t==="results"&&be(),t==="draft"&&To(c.draftSelectedSeason||((a=c.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&Gp(),t==="season-standings"&&Op(),t==="leaderboards"&&sg(),t==="calendar"&&mg(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&rm()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&Ut(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&Mo(a)}),y("btn-cancel-new").addEventListener("click",()=>_e("newCareer")),y("btn-close-race-stages").addEventListener("click",()=>_e("raceStages")),y("btn-close-stage-profile").addEventListener("click",()=>_e("stageProfile")),y("btn-close-rider-program").addEventListener("click",()=>_e("riderProgram")),y("btn-close-rider-stats").addEventListener("click",()=>_e("riderStats")),y("btn-close-team-stats").addEventListener("click",()=>_e("teamStats")),y("btn-close-race-participants").addEventListener("click",()=>_e("raceParticipants")),y("btn-close-roster-editor").addEventListener("click",()=>ws()),y("btn-cancel-roster-editor").addEventListener("click",()=>ws()),y("btn-apply-roster-editor").addEventListener("click",()=>{ap()}),y("btn-back-menu").addEventListener("click",()=>{_t==null||_t.pause(),Ps("menu"),Zt()}),Ko(),vp(),ug(),ao(),So(),_p(),sp(),qm(),vm(),Dm(),tg(),jp(),ag()}(async()=>(Vu(),ke(),pg(),Ps("menu"),await Zt()))();
