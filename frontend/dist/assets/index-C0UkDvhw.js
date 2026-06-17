(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=a(r);fetch(r.href,n)}})();function Bn(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ys(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function ea(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function Za(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function Fe(e,t={}){const a=t.strong===!1?"span":"strong",s=ys("app-rider-link-label",t.labelClassName),r=`<${a} class="${s}">${Bn(e)}</${a}>`;if(t.riderId==null)return r;const n=['type="button"','class="'+ys("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${r}</button>`}function nt(e,t,a=!0,s=""){const r=a===!1?"span":"strong",n=`<${r} class="app-team-link-label">${Bn(e)}</${r}>`;return t==null?n:`<button type="button" class="${ys("app-team-link",s)}" data-team-id="${t}">${n}</button>`}const c={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,draftHistory:null,injuries:null,draftSelectedSeason:null,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1};let jt=null;function _o(e){jt=e}let Bs=!1;function Tr(e){Bs=e}let _n=null;function xr(e){_n=e}let vs=null;function Mr(e){vs=e}let at=!1;function _s(e){at=e}function h(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function se(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function La(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),s=Math.floor(e%60),r=String(a).padStart(2,"0"),n=String(s).padStart(2,"0");return t>0?`${t}:${r}:${n}`:`${a}:${n}`}function ns(e){return e==null||e===0?"–":`+${La(e)}`}const Ra=2,Ss=3,Gn=4;function Hn(e){return`/jersey/Jer_${e}.png`}function vt(e,t){var s;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((s=c.teams.find(r=>r.id===e))==null?void 0:s.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${S(a)}" aria-label="${S(a)}">
      <img
        class="results-team-jersey-img"
        src="${S(Hn(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Ht(e,t){return`<span class="results-jersey-cell">${vt(e,t)}</span>`}function Qe(e){return e&&ne(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function Ia(e){var a;if(e==null)return null;const t=ke(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function ke(e){return e==null?null:c.riders.find(t=>t.id===e)??null}function dt(e){return e==null?null:c.races.find(t=>t.id===e)??null}function Da(e){var t;if(e==null)return null;for(const a of c.races){const s=(t=a.stages)==null?void 0:t.find(r=>r.id===e);if(s)return{race:a,stage:s}}return null}function zt(e,t=!0,a=!1,s=null,r=null){const n=Fe(e,{riderId:s,teamId:r,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function Go(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function ks(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function Ho(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function zo(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}const ot={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function ne(e){const t=ot[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function Ko(e,t){return e?`<span class="country-chip">${ne(e.code3)}<span>${S(e.name)}</span></span>`:t?S(t):"–"}function $s(e){return`${e.toFixed(2).replace(".",",")} km`}function Ts(e){return`${Math.round(e)} hm`}const Wo=new Set;function Gs(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),h(`screen-${e}`).classList.remove("hidden")}function je(e){h(`modal-${e}`).classList.remove("hidden")}function ze(e){h(`modal-${e}`).classList.add("hidden")}function ve(e="Lade…"){const t=at?" (Leertaste zum Stoppen)":"";h("loading-msg").textContent=e+t,h("loading-progress").classList.add("hidden"),h("loading-overlay").classList.remove("hidden")}function ge(){h("loading-overlay").classList.add("hidden")}function jo(e){h("loading-progress").classList.remove("hidden"),h("loading-overlay").classList.remove("hidden"),zn(e)}function zn(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),a=at?" (Leertaste zum Stoppen)":"";h("loading-msg").textContent=`Instant-Simulation läuft … ${t}%${a}`,h("loading-progress-bar").style.width=`${t}%`}function ht(e,t){const a=h(e);a.textContent=t,a.classList.remove("hidden")}function qt(e){h(e).classList.add("hidden")}function Tt(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),h(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),h("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of Wo)try{a(e)}catch(s){console.error(`Fehler bei View-Aktivierung von "${e}":`,s)}}function ye(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function Ot(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function Kn(e,t,a){return Math.max(t,Math.min(a,e))}function is(e,t,a){return Math.round(e+(t-e)*a)}function wr(e,t,a){return`rgb(${is(e[0],t[0],a)} ${is(e[1],t[1],a)} ${is(e[2],t[2],a)})`}function Hs(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=Kn(e,t[0].value,t[t.length-1].value);for(let s=1;s<t.length;s+=1){const r=t[s-1],n=t[s];if(a<=n.value){const i=(a-r.value)/(n.value-r.value);return wr(r.color,n.color,i)}}return wr(t[t.length-1].color,t[t.length-1].color,1)}function Wn(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${Hs(e)}"${a}>${e.toFixed(2)}</span>`}function Oo(e,t,a){if(t==null)return Wn(e,a);const s=Math.round((e-t)*100)/100,r=s>0?"skill-delta-positive":s<0?"skill-delta-negative":"skill-delta-neutral",n=s>0?"+":"",i=`<span class="skill-delta ${r}">${n}${s.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${Hs(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function Vo(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function Rr(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",s=t>0?"+":"";return`<span class="${a}">${s}${t.toFixed(1).replace(".",",")}</span>`}function Ir(e,t="none",a){const s=e??0,r=["race-sim-form-negative"];t==="warning"&&r.push("load-warning"),t==="critical"&&r.push("load-warning-critical");const n=a?` title="${S(a)}"`:"";return s===0?`<span class="${r.join(" ")}"${n}>0,0</span>`:`<span class="${r.join(" ")}"${n}>-${s.toFixed(1).replace(".",",")}</span>`}function jn(e){const t=e.seasonFormPhase??"neutral";return On(t)}function On(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${S(a.label)}">${a.symbol}</span>`}function Uo(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${S(e.seasonProgram.name)}</button>`:"–"}function St(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Ee(e){return`${e.lastName} ${e.firstName}`}function Yo(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,s=e.unavailableUntil?` bis ${se(e.unavailableUntil)}`:"",r=`${t}: noch ${a} Tag${a===1?"":"e"}${s}`;return`<span class="rider-availability-marker" title="${S(r)}" aria-label="${S(r)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function lt(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function xs(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(a),r=document.createElement("a");r.href=s,r.download=e,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(s)}async function U(e,t,a){try{const s=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(s.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await s.text();return{success:!1,error:s.ok?"Antwort war kein JSON.":`HTTP ${s.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return s.json()}catch(s){return{success:!1,error:`Netzwerkfehler: ${s.message}`}}}const H={listSaves:()=>U("GET","/api/saves"),createSave:(e,t,a)=>U("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>U("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>U("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>U("GET","/api/teams/available"),getTeams:()=>U("GET","/api/teams"),getTeam:e=>U("GET",`/api/teams/${e}`),getTeamStats:e=>U("GET",`/api/teams/${e}/stats`),getRiders:e=>U("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRiderStats:(e,t=!1)=>U("GET",`/api/riders/${e}/stats${t?"?excludeFatigue=true":""}`),getRiderProgramRaces:e=>U("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>U("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>U("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>U("POST","/api/rider-team-editor/export",e),getRaces:()=>U("GET","/api/races"),getRaceProgramParticipants:e=>U("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>U("GET",`/api/races/${e}/results-roster`),getGameState:()=>U("GET","/api/state"),getGameStatus:()=>U("GET","/api/game/status"),getStageSummary:e=>U("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>U("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>U("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>U("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>U("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>U("POST","/api/state/advance"),getStageResults:e=>U("GET",`/api/results/${e}`),getSeasonStandings:()=>U("GET","/api/season-standings"),listStageEditorStages:()=>U("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>U("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>U("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>U("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>U("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>U("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>U("POST","/api/stage-editor/import",e),exportStageRoute:e=>U("POST","/api/stage-editor/export",e),getInjuries:()=>U("GET","/api/injuries"),getDraftHistory:e=>U("GET",`/api/draft/${e}`),getLeaderboards:(e,t,a)=>U("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`)};async function ta(){const e=await H.listSaves(),t=h("saves-list"),a=h("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(s=>`
    <div class="save-card">
      <h3>${S(s.careerName)}</h3>
      <p class="save-meta">
        ${S(s.teamName)} · Saison ${s.currentSeason}
        ${s.lastSaved?"· "+se(s.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${S(s.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${S(s.filename)}" data-career-name="${S(s.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function Zo(e){ve("Karriere wird geladen…");const t=await H.loadSave(e);if(ge(),!t.success){alert("Fehler beim Laden: "+t.error);return}c.currentSave=t.data??null,await Bo()}async function Jo(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;ve("Löschen…");const a=await H.deleteSave(e);if(ge(),!a.success){alert("Fehler: "+a.error);return}await ta()}async function qo(){const e=await H.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){h("btn-delete-all-careers").classList.add("hidden"),h("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){ve("Alle Karrieren werden gelöscht…");try{for(const a of t){const s=await H.deleteSave(a.filename);if(!s.success){alert(`Fehler beim Löschen von "${a.careerName}": ${s.error??"Unbekannter Fehler"}`);break}}}finally{ge()}await ta()}}function Xo(){h("btn-new-career").addEventListener("click",async()=>{var r;qt("new-career-error"),h("input-career-name").value="";const a=h("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',je("newCareer");const s=await H.getAvailableTeams();if(!s.success||!((r=s.data)!=null&&r.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=s.data.map(n=>`<option value="${n.id}">${S(n.name)} (${S(n.division??n.divisionName??"")})</option>`).join("")}),h("btn-cancel-new").addEventListener("click",()=>ze("newCareer")),h("btn-confirm-new").addEventListener("click",async()=>{const a=h("input-career-name").value.trim(),s=h("input-team-id").value;if(!a||!s){ht("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const r=Number(s),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;qt("new-career-error"),ve("Neue Karriere wird erstellt…");const o=await H.createSave(i,a,r);if(!o.success){ge(),ht("new-career-error",o.error??"Unbekannter Fehler.");return}const d=await H.loadSave(i);if(ge(),ze("newCareer"),!d.success){alert("Fehler: "+d.error);return}c.currentSave=d.data??null,await Bo()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>ta());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{qo()}),h("saves-list").addEventListener("click",async a=>{const s=a.target.closest("button[data-save-action]");if(!s)return;const{saveAction:r,filename:n,careerName:i}=s.dataset;if(n){if(r==="load"){await Zo(n);return}r==="delete"&&await Jo(n,i??n)}})}const Qo="modulepreload",el=function(e){return"/"+e},Fr={},Vn=function(t,a,s){let r=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));r=Promise.allSettled(a.map(d=>{if(d=el(d),d in Fr)return;Fr[d]=!0;const l=d.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${p}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":Qo,l||(u.as="script"),u.crossOrigin="",u.href=d,o&&u.setAttribute("nonce",o),document.head.appendChild(u),l)return new Promise((m,f)=>{u.addEventListener("load",m),u.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return r.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},tl={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function al(e){const t=tl[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const sl=200;function zs(e){if(e.length===0)return[];const t=[];for(const a of e){const s=t[t.length-1];if(!s||Math.abs(s.distanceMeter-a.distanceMeter)>=sl){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}s.riderIds.push(...a.riderIds),s.riderCount+=a.riderCount,s.distanceSum+=a.distanceMeter*a.riderCount,s.distanceMeter=s.distanceSum/s.riderCount}return t.map(({distanceSum:a,...s})=>s)}function Ks(e){if(e.length===0)return[];let t=0;for(let r=1;r<e.length;r+=1)e[r].riderCount>e[t].riderCount&&(t=r);let a=0,s=0;return e.map((r,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(s+=1,o=`A${s}`),{...r,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-r.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,r.distanceMeter-e[n+1].distanceMeter):null}})}function rl(e,t=null){var a,s,r;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((s=e.find(n=>n.label==="P"))==null?void 0:s.label)??((r=e[0])==null?void 0:r.label)??null}function ct(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function Er(e,t,a,s){return`${s.type}:${e}:${t}:${a}`}function nl(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:ct(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function Ye(e){const t=[];e.segments.forEach((r,n)=>{const i=n*2;(r.start_markers??[]).forEach((o,d)=>{t.push({key:Er(n,"start",d,o),label:"",marker:o,kmMark:r.start_km,elevation:r.start_elevation,boundary:"start",sequence:i+d/100})}),(r.end_markers??[]).forEach((o,d)=>{t.push({key:Er(n,"end",d,o),label:"",marker:o,kmMark:r.end_km,elevation:r.end_elevation,boundary:"end",sequence:i+1+d/100})})});const a=t.sort((r,n)=>r.kmMark-n.kmMark||r.sequence-n.sequence),s=new Map;return a.map(r=>{const n=(s.get(r.marker.type)??0)+1;return s.set(r.marker.type,n),{...r,label:r.marker.name??nl(r.marker,n)}})}function il(e){const t=Ye(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>ct(a)).length}}function Lt(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ol(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Ae(e,t,a,s){return t<=0?s:s+e/t*(a-s*2)}function Aa(e,t){const a=t/1e3,s=e.points;if(a<=s[0].kmMark)return s[0].elevation;for(let r=0;r<s.length-1;r+=1){const n=s[r],i=s[r+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),d=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*d}return s[s.length-1].elevation}function Un(e){const t=e.points.map(p=>p.elevation),a=Math.min(...t),s=Math.max(...t),r=Math.max(1,s-a),n=Math.max(40,r*.08),i=Math.max(0,a-n),o=s+n;let d=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=d&&(l=d+100),{axisMinElevation:d,axisMaxElevation:l}}function Oe(e,t,a,s,r,n){const i=Math.max(1,a-t);return s-n-(e-t)/i*(s-r-n)}function Vt(e){return`${Math.round(e)} m`}function Cr(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function Nr(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function Yn(e,t,a,s,r,n,i,o,d){var g;const l=[],p=[];let u=null,m="#b91c1c";for(const b of Ye(e)){const{marker:y,kmMark:v,elevation:T}=b;if(y.type==="climb_start"){p.push({kmMark:v,elevation:T,name:y.name});continue}if(ct(y)){let w=-1;for(let I=p.length-1;I>=0;I-=1)if(y.name&&((g=p[I])==null?void 0:g.name)===y.name){w=I;break}const x=w>=0?p.splice(w,1)[0]:p.pop();x&&Math.max(0,v-x.kmMark),x&&Math.max(0,T-x.elevation);const $=Nr(y.cat,y.type),R=Cr(y.cat);if(y.type==="finish_hill"||y.type==="finish_mountain"){u=y.cat??null,m=$.accentColor;continue}l.push({x:Ae(v*1e3,t,a,s),anchorY:Oe(T,o,d,r,n,i),primaryLabel:R??"Berg",secondaryLabel:Vt(T),distanceLabel:`${v.toFixed(1).replace(".",",")} km`,accentColor:$.accentColor});continue}if(y.type==="sprint_intermediate"){const w=Nr(y.cat,y.type);l.push({x:Ae(v*1e3,t,a,s),anchorY:Oe(T,o,d,r,n,i),primaryLabel:"Sprint",secondaryLabel:Vt(T),distanceLabel:`${v.toFixed(1).replace(".",",")} km`,accentColor:w.accentColor})}}const f=e.points[e.points.length-1];return l.push({x:Ae(f.kmMark*1e3,t,a,s),anchorY:Oe(f.elevation,o,d,r,n,i),primaryLabel:u?`${Cr(u)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:Vt(f.elevation),distanceLabel:`${f.kmMark.toFixed(1).replace(".",",")} km`,accentColor:m}),l.sort((b,y)=>b.x-y.x)}function Zn(e,t,a){const s=t+4,r=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${Lt(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-detail">${Lt(e.distanceLabel)}</text>
    </g>`}function Jn(e,t){const a=new Set,s=t/1e3;for(let r=0;r<=s;r+=25)a.add(Math.round(r*1e3));return a.add(Math.round(t)),[...a].filter(r=>r>=0&&r<=t).sort((r,n)=>r-n)}function qn(e,t,a,s,r,n){const i=new Set(Ye(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const d=Ae(o,a,s,r),p=i.has(o)?18:12,u=n+p+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${d.toFixed(1)}" y1="${n.toFixed(1)}" x2="${d.toFixed(1)}" y2="${(n+p).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${d.toFixed(1)}" y="${u.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${Lt(ol(o))}</text>
      </g>`}).join("")}function ll(e,t,a,s,r,n,i,o,d,l,p){const u=Ae(e.distanceMeter,a,s,n),m=Aa(t,e.distanceMeter),f=Oe(m,d,l,r,i,o),g=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),b=e.riderCount>1?`<text x="${u.toFixed(1)}" y="${(f+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${u.toFixed(1)}" cy="${f.toFixed(1)}" r="${g.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${p?" race-sim-cluster-dot-selected":""}"></circle>
      ${b}
    </g>`}function dl(e,t,a,s,r,n,i,o,d,l,p){const u=new Map(p.riders.map(f=>[f.id,f])),m=new Map((p.teams??[]).map(f=>[f.id,f.abbreviation]));return e.filter(f=>f.riderCount===1).map(f=>{const g=f.riderIds[0];if(g==null)return"";const b=u.get(g);if(!b)return"";const y=Ae(f.distanceMeter,a,s,n),v=Aa(t,f.distanceMeter),T=Oe(v,d,l,r,i,o),w=b.activeTeamId!=null?m.get(b.activeTeamId)??"":"",x=`${b.lastName} (${w})`,$=T-34,R=T-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${y.toFixed(1)}" y1="${(T-5).toFixed(1)}" x2="${y.toFixed(1)}" y2="${$.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${y.toFixed(1)}" y="${R.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${Lt(x)}</text>
        </g>`}).join("")}function cl(e,t,a,s,r,n,i,o,d,l,p){const u=Math.max(0,Math.min(l,e.distanceKm)),m=Math.max(0,Math.min(p,e.distanceKm));if(m<=u)return null;const f=[{kmMark:u,elevation:Aa(e,u*1e3)},...e.points.filter(T=>T.kmMark>u&&T.kmMark<m),{kmMark:m,elevation:Aa(e,m*1e3)}];if(f.length<2)return null;const g=r-i,b=f.map((T,w)=>{const x=Ae(T.kmMark*1e3,t,a,s),$=Oe(T.elevation,o,d,r,n,i);return`${w===0?"M":"L"} ${x.toFixed(1)} ${$.toFixed(1)}`}).join(" "),y=Ae(u*1e3,t,a,s),v=Ae(m*1e3,t,a,s);return`${b} L ${v.toFixed(1)} ${g.toFixed(1)} L ${y.toFixed(1)} ${g.toFixed(1)} Z`}function ul(e,t,a,s,r={}){const p=e.distanceKm*1e3,{axisMinElevation:u,axisMaxElevation:m}=Un(e),f=533,g=12,y=e.points.map(I=>{const C=Ae(I.kmMark*1e3,p,1584,28),F=Oe(I.elevation,u,m,634,168,101);return{x:C,y:F}}).map((I,C)=>`${C===0?"M":"L"} ${I.x.toFixed(1)} ${I.y.toFixed(1)}`).join(" "),v=`${y} L ${1556 .toFixed(1)} ${f.toFixed(1)} L ${28 .toFixed(1)} ${f.toFixed(1)} Z`,T=r.selectedClimbRange!=null?cl(e,p,1584,28,634,168,101,u,m,r.selectedClimbRange.startKm,r.selectedClimbRange.endKm):null,w=Yn(e,p,1584,28,634,168,101,u,m).map(I=>Zn(I,g,f)).join(""),$=Array.from({length:5},(I,C)=>u+(m-u)/4*C).map(I=>{const C=Oe(I,u,m,634,168,101);return`
      <line x1="28" y1="${C.toFixed(1)}" x2="1556" y2="${C.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${C.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${C.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(C+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Vt(I)}</text>`}).join(""),R=qn(Jn(e,p),e,p,1584,28,f);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${Lt(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      <line x1="28" y1="${f}" x2="1556" y2="${f}" class="race-sim-axis"></line>
      ${`<line x1="28" y1="168" x2="28" y2="${f}" class="race-sim-axis"></line>`}
      <path d="${v}" fill="url(#dashboard-large-area)"></path>
      ${T?`<path d="${T}" class="dashboard-stage-profile-climb-highlight"></path>`:""}
      <path d="${y}" class="race-sim-profile-line"></path>
      ${w}
      ${R}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function ml(e,t,a,s,r){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${ul(t,a,s,!1,r)}</div>`}function pl(e,t,a,s,r,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,d=634,l=28,p=168,u=101,{axisMinElevation:m,axisMaxElevation:f}=Un(t),g=d-u,b=12,y=Array.from({length:5},(B,M)=>m+(f-m)/4*M),v=zs(a.clusters),T=Ks(v),w=Jn(t,a.stageDistanceMeters),$=t.points.map(B=>{const M=Ae(B.kmMark*1e3,a.stageDistanceMeters,o,l),N=Oe(B.elevation,m,f,d,p,u);return{x:M,y:N}}).map((B,M)=>`${M===0?"M":"L"} ${B.x.toFixed(1)} ${B.y.toFixed(1)}`).join(" "),R=`${$} L ${(o-l).toFixed(1)} ${g.toFixed(1)} L ${l.toFixed(1)} ${g.toFixed(1)} Z`,I=Yn(t,a.stageDistanceMeters,o,l,d,p,u,m,f).map(B=>Zn(B,b,g)).join(""),C=y.map(B=>{const M=Oe(B,m,f,d,p,u);return`
      <line x1="${l}" y1="${M.toFixed(1)}" x2="${o-l}" y2="${M.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${M.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${M.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(M+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Vt(B)}</text>`}).join(""),F=qn(w,t,a.stageDistanceMeters,o,l,g),P=new Map(v.map((B,M)=>[B,T[M]??null])),D=v.map(B=>{var M;return ll(B,t,a.stageDistanceMeters,o,d,l,p,u,m,f,((M=P.get(B))==null?void 0:M.label)===i)}).join(""),_=r.stage.profile==="ITT"?dl(v,t,a.stageDistanceMeters,o,d,l,p,u,m,f,r):"";e.innerHTML=`
    <div class="race-sim-profile-layout${r.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${d}" role="img" aria-label="${Lt(s)}">
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
          ${C}
          <line x1="${l}" y1="${g}" x2="${o-l}" y2="${g}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${p}" x2="${l}" y2="${g}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${R}" fill="url(#race-sim-area)"></path>
            <path d="${$}" class="race-sim-profile-line"></path>
            ${I}
            ${D}
          </g>
          ${_}
          ${F}
          <text x="${l.toFixed(1)}" y="${(p-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const gl={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},Pr={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function Ms(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function Ja(e,t){return`${e}:${t}`}function fl(e){return new Map(e.map(t=>[Ja(t.simulationMode,t.terrain),t.weights]))}function hl(e){return new Map(e.map(t=>[Ja(t.simulationMode,t.terrain),t]))}function bl(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function Xn(e,t,a){const s=a.get(Ja(e,t));if(!s)return[{key:Ms(t),weight:1}];const r=Object.entries(s).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return r.length>0?r:[{key:Ms(t),weight:1}]}function yl(e,t,a,s){const r=Xn(t,a,s),n=r.reduce((o,d)=>o+d.weight,0);return n<=0?e[Ms(a)]:r.reduce((o,d)=>o+e[d.key]*d.weight,0)/n}function vl(e,t){const a=t.find(s=>s.simulationMode==="ttt"&&s.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??gl[e]??1.05}function Sl(e,t,a){const s=a==null?void 0:a.get(Ja(e,t));return{lateMultiplier:(s==null?void 0:s.finalSpreadLateMultiplier)??Pr[t].lateMultiplier,peakMultiplier:(s==null?void 0:s.finalSpreadPeakMultiplier)??Pr[t].peakMultiplier}}const kl=.005,$l=.005,Qn=70,ei=1e3,ti=15,ai=360,si=8,ri=-.75,ni=10;function bt(e,t){return e+Math.random()*(t-e)}function ii(e,t,a){return Math.max(t,Math.min(a,e))}function Tl(e){return e==="ITT"||e==="TTT"}function oi(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(s=>{var r,n,i;return s.id!==e.id&&s.activeTeamId===e.activeTeamId&&(((r=s.role)==null?void 0:r.name)==="Edelhelfer"||((n=s.role)==null?void 0:n.name)==="Starke Helfer"||((i=s.role)==null?void 0:i.name)==="Wassertraeger")}).map(s=>s.id)}function li(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function xl(e,t,a,s){const r=s==="crash"?li():null,n=Number(bt(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=ii(n/Math.max(.1,a)*100,0,100),d=o<=Qn;return{riderId:e.id,type:s,severity:r,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(s==="crash"?bt(10,60):bt(10,45)),recoverySeconds:d?ei:ai,recoveryFormBonus:d?ti:si,dayFormPenalty:ri,staminaPenalty:ni,recoveryPenaltyStages:s==="crash"?r==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:s==="crash"&&r==="medium"?15:0,supportRiderIds:oi(e,t)}}function Ml(e,t,a){if(Tl(t.profile)||a<=0)return[];const s=[];for(const r of e){const n=Math.random(),i=Math.random(),o=kl*Math.max(0,t.crashIncidentMultiplier??1),d=$l*Math.max(0,t.mechanicalIncidentMultiplier??1),l=o+(t.rolledEffektSturz??0)/100,p=d+(t.rolledEffektDefekt??0)/100,u=n<l,m=i<p;if(!u&&!m)continue;const f=u&&m?n<=i?"crash":"mechanical":u?"crash":"mechanical",g=xl(r,e,a,f);if(f==="crash"&&Math.random()<.01){g.isMassCrashTrigger=!0;const b=Math.floor(bt(2,26)),v=[...e.filter(T=>T.id!==r.id)].sort(()=>.5-Math.random());g.massCrashPotentialRiderIds=v.slice(0,b).map(T=>T.id),Math.random()<.2&&(g.hasAdditionalMechanical=!0,g.waitDurationSeconds+=Math.round(bt(10,45)))}s.push(g)}return s}function wl(e,t,a,s){const r=li(),n=Math.round(a*1e3),i=ii(a/Math.max(.1,s)*100,0,100),o=i<=Qn;let d=Math.round(bt(10,60)),l=!1;return Math.random()<.2&&(l=!0,d+=Math.round(bt(10,45))),{riderId:e.id,type:"crash",severity:r,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:d,recoverySeconds:o?ei:ai,recoveryFormBonus:o?ti:si,dayFormPenalty:ri,staminaPenalty:ni,recoveryPenaltyStages:r==="light"?[10,5,2]:[],raceRecuperationPenalty:r==="medium"?15:0,supportRiderIds:oi(e,t),hasAdditionalMechanical:l}}function di(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function ci(e){return Math.round(e*10)/10}function ui(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function mi(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function pi(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function Rl(e,t){return e.skills.stamina*(t/300)}function gi(e,t,a){return e.skills.timeTrial+pi(e,t)+e.skills.mountain*(a/500)}function Il(e,t,a,s){const r=Rl(e,a),n=pi(e,s);switch(t.profile){case"Flat":return .8*e.skills.sprint+.2*e.skills.flat+n+r;case"Rolling":return .7*e.skills.sprint+.2*e.skills.flat+.1*e.skills.hill+n+r;case"Hilly":return .4*e.skills.sprint+.2*e.skills.flat+.4*e.skills.hill+n+r;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+r;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+r;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+r;case"High_Mountain":return e.skills.mountain+n+r;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+r;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+r;default:return .8*e.skills.sprint+.2*e.skills.flat+n+r}}function Fl(e,t,a,s,r){return t.profile==="ITT"||t.profile==="TTT"?gi(e,r,s):Il(e,t,a,r)}function El(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:ci(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function Cl(e,t,a,s){ui(a,s);const r=mi(a,s),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const p=o.get(l.activeTeamId)??[];p.push(l),o.set(l.activeTeamId,p)}return[...o.entries()].map(([l,p])=>{const u=n.get(l),f=p.map(v=>gi(v,di(v.id,s==null?void 0:s.dailyFormByRiderId),r)).sort((v,T)=>T-v).slice(0,5),g=f.length,b=g>0?f.reduce((v,T)=>v+T,0)/g:0,y=Math.max(0,5-g)*2;return{team:u??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:b-y}}).sort((l,p)=>p.score-l.score||l.team.id-p.team.id).slice(0,20).map((l,p)=>({rank:p+1,kind:"team",effectiveSkill:ci(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(s!=null?ws(e,t,a,s):ws(e,t,a)).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id).slice(0,20).map((o,d)=>El(o,d+1))}function ws(e,t,a,s){const r=ui(a,s),n=mi(a,s),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var d;return{rider:o,teamName:o.activeTeamId!=null?((d=i.get(o.activeTeamId))==null?void 0:d.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:Fl(o,a,r,n,di(o.id,s==null?void 0:s.dailyFormByRiderId))}}).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id)}function Nl(e,t){return e+Math.random()*(t-e)}function Lr(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const s=Math.floor(Nl(0,a+1)),r=t[a];t[a]=t[s]??r,t[s]=r}return t}function Pl(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function Ll(e,t,a={}){if(e.length===0)return[];const s=e.map(f=>({...f,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),r=a.teams??Pl(s),n=ws(s,r,t,a),i=new Set(n.slice(0,20).map(f=>f.rider.id)),o=Math.min(Math.ceil(s.length*.02),Math.max(0,s.length-i.size)),d=Math.min(Math.ceil(s.length*.01),s.length),l=Lr(s.filter(f=>!i.has(f.id))),p=new Set(l.slice(0,o).map(f=>f.id)),u=Lr(s.filter(f=>!p.has(f.id))),m=new Set(u.slice(0,d).map(f=>f.id));return s.map(f=>p.has(f.id)?{...f,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:m.has(f.id)?{...f,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:f)}function ca(e,t){const a=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(s-a+1))+a}function Dr(e,t){return e+Math.random()*(t-e)}function Dl(e,t,a){const s=[...e],r=[];for(;r.length<t&&s.length>0;){const n=s.reduce((l,p)=>l+Math.max(1e-4,a(p)),0);let i=Math.random()*n,o=0;for(let l=0;l<s.length;l+=1)if(i-=Math.max(1e-4,a(s[l])),i<=0){o=l;break}const[d]=s.splice(o,1);d&&r.push(d)}return r}function Al(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function Bl(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function _l(e,t,a){return new Set(e.map(s=>s.riderId).filter(s=>s!=null&&!t.has(s)).slice(0,a))}function Gl(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function Ws(e){var t;return Gl((t=e.role)==null?void 0:t.name)}function Hl(e){return Ye(e).some(({marker:t})=>ct(t))}function zl(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function Kl(e,t){const a=zl(e),s=e.hasSuperform===!0?40:1,r=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&Ws(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*s*r*n*i;return{attackFactor:a,superformFactor:s,gcLeaderTeamFactor:r,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function Wl(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function jl(e,t){var s,r;const a=((s=t[0])==null?void 0:s.riderId)??null;return a==null?null:((r=e.find(n=>n.id===a))==null?void 0:r.activeTeamId)??null}function Ol(e,t,a){const s=new Map(t.map(n=>[n.id,n])),r=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=s.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||r.has(i.activeTeamId))&&(r.add(i.activeTeamId),r.size>=a))break}return r}function Vl(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),Ws(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function Ul(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const s=t.stageNumber<=10,r=Math.max(1,Math.floor(a*(s?.01:.05))),n=Math.max(r,Math.floor(a*(s?.08:.2)));return{min:r,max:n}}function Yl(e,t){return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?{min:.45,max:.75}:{min:.5,max:.85}}function Zl(e,t,a,s,r,n,i){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||s.distanceKm<=0)return null;const o=e.length,{min:d,max:l}=Ul(t,a,o),p=ca(d,l),u=t.isStageRace&&a.stageNumber<=10,m=!t.isStageRace,f=jl(e,n),g=u?Ol(r,e,5):new Set,b=u?Vl(e):new Map,y=Hl(s),v=Al(r,5),T=Bl(n,10),w=new Set([...v,...T]),x=y?_l(i,w,5):new Set,$=Wl(a),R=e.filter(j=>{if(j.activeTeamId==null||v.has(j.id)||T.has(j.id)||u&&f!=null&&j.activeTeamId===f||u&&g.has(j.activeTeamId))return!1;const A=Ws(j);return!(m&&(A==="kapitaen"||A==="co-kapitaen")||u&&A==="kapitaen"||u&&A==="co-kapitaen"&&b.get(j.activeTeamId)!==!0||A==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(R.length===0)return null;const I=new Map(R.map(j=>[j.id,Kl(j,{isEarlyStageRace:u,race:t,gcLeaderTeamId:f,stageHasMountainClassifications:y,topMountainIds:x,isHardStage:$})])),C=R.reduce((j,A)=>{var X;return j+(((X=I.get(A.id))==null?void 0:X.finalWeight)??0)},0),F=Dl(R,Math.min(p,R.length),j=>{var A;return((A=I.get(j.id))==null?void 0:A.finalWeight)??1});if(F.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${F.length}/${p} ausgewählt aus ${R.length}`),console.log(`Gesamtgewicht im Pool: ${C.toFixed(2)}`),console.table(F.map(j=>{var X;const A=I.get(j.id);return{Fahrer:`${j.firstName} ${j.lastName}`,Team:j.activeTeamId,Rolle:((X=j.role)==null?void 0:X.name)??null,Atk:j.skills.attack,Hill:j.skills.hill,Chance:`${((C>0&&A!=null?A.finalWeight/C:0)*100).toFixed(2)}%`,Gewicht:((A==null?void 0:A.finalWeight)??1).toFixed(2),Attacke:`x${((A==null?void 0:A.attackFactor)??1).toFixed(2)}`,Superform:`x${(A==null?void 0:A.superformFactor)??1}`,GC_Team:`x${((A==null?void 0:A.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(A==null?void 0:A.mountainFactor)??1}`,Sprinter:`x${(A==null?void 0:A.sprinterFactor)??1}`}})),console.groupEnd();const P=s.distanceKm*1e3,D=ca(0,Math.min(1e4,Math.max(0,Math.floor(P*.1)))),_=Yl(t,a),B=Math.round(P*Dr(_.min,_.max)),M=Math.round(P*Dr(.1,.25)),N=Math.max(D+1e3,Math.min(B-1e3,B-M)),O=a.rolledBreakawayBonus??0,K=ca(3+O,8+O);return{riderIds:F.map(j=>j.id),triggerDistanceMeters:D,groupPhaseEndDistanceMeters:N,phaseEndDistanceMeters:B,skillBonus:K,malusValue:ca(5,8)}}const Jl=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),ql=3,Xl=7,Ar=120,Br=200,_r=180,Ql=10,ua=8e3;function yt(e,t,a=Math.random()){const s=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(a*(r-s+1))+s}function ed(e){for(let t=e.length-1;t>0;t-=1){const a=yt(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function Ba(e,t){return t<=0||e.length===0?[]:ed([...e]).slice(0,Math.min(t,e.length))}function td(e,t,a){if(t<=0||e.length===0)return[];const s=[...e],r=[];for(;s.length>0&&r.length<t;){const n=s.reduce((d,l)=>d+Math.max(0,a(l)),0);if(n<=0){r.push(...Ba(s,t-r.length));break}let i=Math.random()*n,o=s.length-1;for(let d=0;d<s.length;d+=1)if(i-=Math.max(0,a(s[d])),i<=0){o=d;break}r.push(s[o]),s.splice(o,1)}return r}function ad(e){return Jl.has(e.profile)}function sd(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function rd(e,t){if(!ad(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(s=>{if(!sd(s))return[];const r=s.start_km*1e3,n=s.end_km*1e3,i=Math.max(r,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:r,sourceSegmentEndMeters:n}]})}function Gr(e,t){const a=t==null?e:e.filter(d=>{const l=Math.min(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t)),p=Math.max(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t));return l>=ua||p>=ua});if(a.length===0)return null;const s=a[yt(0,a.length-1)];if(!s)return null;const r=Math.ceil(s.startMeters),n=Math.floor(s.endMeters);if(n<=r)return null;let i=0;for(;i<12;){const d=yt(r,n);if(t==null||Math.abs(d-t)>=ua)return{triggerDistanceMeters:d,sourceSegmentStartMeters:s.sourceSegmentStartMeters,sourceSegmentEndMeters:s.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<s.startMeters?n:r;return t==null||Math.abs(o-t)>=ua?{triggerDistanceMeters:o,sourceSegmentStartMeters:s.sourceSegmentStartMeters,sourceSegmentEndMeters:s.sourceSegmentEndMeters}:null}function nd(e,t,a,s=()=>1){const r=e.slice(0,15),n=rd(t,a);if(r.length===0||n.length===0)return[];const i=yt(ql,Math.min(Xl,r.length)),o=td(r,i,s),d=[];for(const m of o){const f=Gr(n);f&&d.push({riderId:m.id,attackNumber:1,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:yt(Ar,Br),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}if(d.length===0)return[];const l=d.map(m=>m.riderId),p=Math.floor(l.length*.5),u=new Set(Ba(l,p));for(const m of[...d]){if(!u.has(m.riderId))continue;const f=Gr(n,m.triggerDistanceMeters);f&&d.push({riderId:m.riderId,attackNumber:2,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:yt(Ar,Br),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}return d.sort((m,f)=>m.triggerDistanceMeters-f.triggerDistanceMeters||m.riderId-f.riderId||m.attackNumber-f.attackNumber)}function id(e,t,a){var d;if(e.length===0)return[];const s=((d=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:d.teamId)??null,r=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||s!=null&&l.teamId===s));if(r.length===0)return[];const n=new Map;for(const l of r){const p=n.get(l.teamId)??[];p.push(l),n.set(l.teamId,p)}const i=[...n.values()].map(l=>Ba(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(yt(0,3),i.length);return Ba(i,o).map(l=>l.riderId)}function od(e,t){const a=[],s=[];for(const[r,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){s.push(r);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:s}}const ld={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},dd={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},cd={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},ud={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},md={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function pd(e){const t=new Map;for(const a of e){const s=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",s);else if(a.appliesTo==="climb_top"){const r=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${r}`,s)}else a.appliesTo==="finish"&&t.set(a.markerType,s)}return t}const ma=20,gd=120,fd=300,os=.025,hd=.1,bd=.4,yd=.6,vd=.8,Ut=1,Hr=2/3,Sd=.1,pa=10,zr=50,kd=25,$d=7,Td=500,xd=100,Md=.02,wd=.04,Rd=.009,Id=120,Fd=150,Ed=100,Cd=300,Kr=50,ls=85,mt=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],Wr=5*60,Nd=60,Pd=.5,Ld=.3,ga=5e3,Dd=2e3,Ad=1,Bd=2,_d=.05,fi={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},Gd={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},fa=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function ce(e,t,a){return Math.max(t,Math.min(a,e))}function ue(e,t){return e+Math.random()*(t-e)}function jr(e){return e[Math.floor(Math.random()*e.length)]}function Ft(e){return Math.round(e*100)/100}function Hd(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function Or(e){if(e<2)return 1;const t=ce(e,2,20),a=fa[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let s=1;s<fa.length;s+=1){const r=fa[s-1],n=fa[s];if(t>n.gradientPercent)continue;const i=(t-r.gradientPercent)/Math.max(1e-4,n.gradientPercent-r.gradientPercent),o=r.draftPenaltyShare+(n.draftPenaltyShare-r.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function zd(e){return e==="Flat"?Id:e==="Abfahrt"?Fd:Number.POSITIVE_INFINITY}function Kd(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function _a(e){return(e.formBonus??0)+(e.raceFormBonus??0)-((e.fatigueMalus??0)+(e.longTermFatigueMalus??0)+(e.shortTermFatigueMalus??0))*.5}function Wd(e,t){if(t.length===0)return"";const a=t.reduce((p,u)=>p+u.weight,0),s=t.map(p=>{const u=e.skills[p.key],m=Math.round(p.weight/a*100);return`${fi[p.key]} ${Math.round(u)} (${m}%)`}),r=e.formBonus??0,n=e.raceFormBonus??0,i=(e.fatigueMalus??0)*.5,o=(e.longTermFatigueMalus??0)*.5,d=(e.shortTermFatigueMalus??0)*.5;s.push(`S-Form ${r>=0?"+":""}${r.toFixed(1).replace(".",",")}`),s.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&s.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&s.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),d>0&&s.push(`Akut -${d.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const p of t)l+=(e.mentorBoosts[p.key]||0)*(p.weight/a);return l>0&&s.push(`Mentor +${l.toFixed(1).replace(".",",")}`),s.join(" • ")}function jd(){const e=Math.random();return e<.9?ue(5,20):e<.98?ue(20,40):ue(40,70)}function Vr(){const e=Math.random();return e<.9?Ft(ue(-1,1)):e<.995?Ft(jr([-1,1])*ue(1,2)):Ft(jr([-1,1])*ue(3,4))}function Od(){return Ft(ue(-3,3))}function Vd(e){const t=[];let a=0,s=jd(),r=ue(-1,1);for(;a<e;){const n=Math.min(e-a,ue(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:s,vector:r}),a+=n,a>=e)break;s=ce(s+(Math.random()<.5?-1:1)*ue(2,10),5,70),r=ce(r+(Math.random()<.5?-1:1)*ue(0,.5),-1,1)}return t}function hi(e,t){const a=Q(e),s=Q(t);if(a!==s)return a?1:-1;const r=he(e),n=he(t);return r&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:r?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function Q(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function he(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function Gt(e,t,a=!1,s=null){var d;const r="rider"in e?e.rider:null,n=(r==null?void 0:r.specialization1)??null,i=(r==null?void 0:r.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(d=r==null?void 0:r.role)==null?void 0:d.name;s==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function Ud(e,t,a=null,s=null,r=!1){var f,g;const n=b=>b.photoFinishScore;if(!t){const b=[...e].sort((v,T)=>v.crossingTimeSeconds-T.crossingTimeSeconds||T.photoFinishScore-v.photoFinishScore||v.riderId-T.riderId),y=((f=b[0])==null?void 0:f.crossingTimeSeconds)??0;return b.map((v,T)=>({riderId:v.riderId,rank:T+1,crossingTimeSeconds:v.crossingTimeSeconds,gapSeconds:Math.max(0,v.crossingTimeSeconds-y),photoFinishScore:v.photoFinishScore}))}const i=[...e].sort((b,y)=>b.crossingTimeSeconds-y.crossingTimeSeconds||y.photoFinishScore-b.photoFinishScore||b.riderId-y.riderId),o=((g=i[0])==null?void 0:g.crossingTimeSeconds)??0,d=[];let l=[],p=0,u=null;const m=()=>{const b=Math.max(0,p-o),y=l.sort((v,T)=>n(T)-n(v)||v.riderId-T.riderId);for(const v of y)d.push({riderId:v.riderId,rank:d.length+1,crossingTimeSeconds:v.crossingTimeSeconds,gapSeconds:b,photoFinishScore:v.photoFinishScore})};for(const b of i){if(l.length===0){l=[b],p=b.crossingTimeSeconds,u=b.crossingTimeSeconds;continue}if(u!=null&&b.crossingTimeSeconds-u<=Ut){l.push(b),u=b.crossingTimeSeconds;continue}m(),l=[b],p=b.crossingTimeSeconds,u=b.crossingTimeSeconds}return l.length>0&&m(),d}function Yd(e,t,a){const s=e.filter(he).sort((u,m)=>(u.finishTimeSeconds??0)-(m.finishTimeSeconds??0)||m.photoFinishScore-u.photoFinishScore||u.rider.id-m.rider.id),r=e.filter(u=>!Q(u)).sort(hi),n=e.filter(u=>u.finishStatus==="dnf").sort((u,m)=>m.distanceCoveredMeters-u.distanceCoveredMeters||u.rider.id-m.rider.id),i=[];let o=[],d=null;const l=u=>u.photoFinishScore,p=()=>{i.push(...o.sort((u,m)=>l(m)-l(u)||u.rider.id-m.rider.id))};for(const u of s){const m=u.finishTimeSeconds??0;if(o.length===0){o=[u],d=m;continue}if(d!=null&&m-d<=Ut){o.push(u),d=m;continue}p(),o=[u],d=m}return o.length>0&&p(),[...i,...r,...n]}function Zd(e,t){const a=Q(e),s=Q(t);if(a!==s)return a?1:-1;const r=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(r)>=.1?r:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:he(e)&&he(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:he(e)?-1:he(t)?1:e.rider.id-t.rider.id}function Ur(e){const t=ce(e,1,zr);return t<=2?.12*t:t<=pa?.24+(t-2)/Math.max(1,pa-2)*.58:.82+(t-pa)/Math.max(1,zr-pa)*.18}function ds(e,t){const a=_a(e.rider);return Object.entries(t).reduce((s,[r,n])=>{if(!n)return s;const i=r==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[r]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return s+o*n},0)}function Jd(e,t){const a=_a(e.rider);return Object.entries(t).filter(s=>!!s[1]).map(([s,r])=>{const n=s,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:r,effectiveSkill:o,contribution:o*r}})}function qd(e,t,a){let s=t;for(;s>0;){const n=e[s-1].distanceCoveredMeters-e[s].distanceCoveredMeters;if(n<=0||n>=a)break;s-=1}let r=t;for(;r<e.length-1;){const n=e[r].distanceCoveredMeters-e[r+1].distanceCoveredMeters;if(n<=0||n>=a)break;r+=1}return{startIndex:s,endIndex:r,size:r-s+1,positionInGroup:t-s}}function Xd(e,t){if(e<kd)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class bi{constructor(t,a){var _,B;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.hasLoggedFinishSprintTieBreak=!1,this.hasAppliedSprintLeadoutBonuses=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const s=(_=t.race.country)==null?void 0:_.code3;s&&(t.riders=t.riders.map(M=>{var O;const N=M.nationality||((O=M.country)==null?void 0:O.code3);if(N&&N.trim().toUpperCase()===s.trim().toUpperCase()){const K={...M,skills:{...M.skills}},j=Math.random(),A=t.stage.profile,X=A==="ITT"||A==="TTT",me=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(A==="Cobble"||A==="Cobble_Hill")&&me.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(A)||me.push("mountain","mediumMountain");const L=[...(q=>{const J=[...me],k=[];if(X){k.push("timeTrial");const G=Math.min(q-1,J.length);for(let W=0;W<G;W++){const V=Math.floor(Math.random()*J.length);k.push(J.splice(V,1)[0])}}else{const G=Math.min(q,J.length);for(let W=0;W<G;W++){const V=Math.floor(Math.random()*J.length);k.push(J.splice(V,1)[0])}}return k})(5)].sort(()=>Math.random()-.5);if(K.homeEffectSkills=L,j<.05){K.homeEffect="home_pressure";for(const q of L)K.skills[q]=Math.max(0,K.skills[q]-.5)}else if(j<.1){K.homeEffect="super_home";const q=L[0];K.skills[q]=Math.min(100,K.skills[q]+3);for(let J=1;J<5;J++){const k=L[J];K.skills[k]=Math.min(100,K.skills[k]+1)}}else{K.homeEffect="normal_home";for(const q of L)K.skills[q]=Math.min(100,K.skills[q]+1)}return K}return M})),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=bl(t.stage.profile),this.skillWeightRuleMap=fl(t.skillWeightRules??[]),this.skillWeightConfigMap=hl(t.skillWeightRules??[]),this.stageScoringWeightMap=pd(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=Vd(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const r=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=r!=null?ce(r/100,0,1):ue(yd,vd);const n=t.stage.finalPushStartPercent;this.finalPushStartRatio=n!=null?ce(n/100,this.lateStageStartRatio,1):ce(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const i=Ml(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(i.map(M=>[M.riderId,M])),i.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",i.map(N=>({riderId:N.riderId,type:N.type,severity:N.severity,kmMark:N.triggerDistanceKm,waitDurationSeconds:N.waitDurationSeconds,supportRiderIds:N.supportRiderIds})));const M=i.filter(N=>N.isMassCrashTrigger);M.length>0&&M.forEach(N=>{var O;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${N.riderId} bei Km ${N.triggerDistanceKm}. Potenziell betroffene Fahrer (${(O=N.massCrashPotentialRiderIds)==null?void 0:O.length}):`,N.massCrashPotentialRiderIds)})}const o=t.riders.map(M=>{const N={rider:M,riderName:`${M.firstName} ${M.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:Od(),microForm:Vr(),nextFormUpdateMeter:ue(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(M.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(N),N}),d=new Map(o.map(M=>[M.rider.id,M.dailyForm]));this.stageFavorites=Cl(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d});const l=this.stageFavorites.filter(M=>M.kind==="rider"&&M.riderId!=null).slice(0,15).map(M=>t.riders.find(N=>N.id===M.riderId)??null).filter(M=>M!=null),p=((B=t.gcStandings.find(M=>M.rank===1))==null?void 0:B.riderId)??null,u=nd(l,t.stage,t.stageSummary,M=>Math.max(1,Math.pow(10,(M.skills.attack-65)/10))*(M.id===p?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const M of u){const N=this.precalculatedStageAttacksByRiderId.get(M.riderId)??[];N.push(M),this.precalculatedStageAttacksByRiderId.set(M.riderId,N)}this.breakawayPlan=Zl(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings);const m=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=m.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=m.fallbackCheckpointsMeters;for(const M of o)M.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const f=Ll(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d}),g=new Map(f.map(M=>[M.id,M])),b=o.map(M=>{const N=g.get(M.rider.id)??M.rider;return{...M,rider:N,riderName:`${N.firstName} ${N.lastName}`,dailyForm:M.dailyForm+(N.specialFormDelta??0)}}),y=f.filter(M=>M.hasSuperform),v=f.filter(M=>M.hasSupermalus);(y.length>0||v.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:y.map(M=>`${M.firstName} ${M.lastName}`),supermalus:v.map(M=>`${M.firstName} ${M.lastName}`)});const T=this.resolveStartOrder(b),w=new Map((this.bootstrap.teamStartOrder??[]).map((M,N)=>[M,N]));this.riders=T.map((M,N)=>({...M,startOffsetSeconds:this.resolveStartOffsetSeconds(M,N,w)})),this.riders.forEach(M=>this.syncRiderTelemetry(M));for(const M of this.riders){const N=M.rider.homeEffectSkills,O=K=>Gd[K]||K;if(M.rider.homeEffect==="super_home"){const K=N&&N.length===5?`${O(N[0])} (+3), ${O(N[1])} (+1), ${O(N[2])} (+1), ${O(N[3])} (+1), ${O(N[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${K})`})}if(M.rider.homeEffect==="home_pressure"){const K=N?N.map(O).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${K})`})}if(M.rider.homeEffect==="normal_home"){const K=N?N.map(O).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${K})`})}M.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),M.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),M.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const x=this.bootstrap.stage.rolledWetterName??"Sonnig",$=this.bootstrap.stage.rolledEffektSturz??0,R=this.bootstrap.stage.rolledEffektDefekt??0,I=this.bootstrap.stage.rolledWindkantenGefahr??0,C=this.bootstrap.stage.rolledEffektFatigue??0,F=this.bootstrap.stage.rolledBreakawayBonus??0,P=[];$>0&&P.push(`Sturzwahrscheinlichkeit +${$.toFixed(1)}%`),R>0&&P.push(`Defektwahrscheinlichkeit +${R.toFixed(1)}%`),I>0&&P.push(`Windkanten-Gefahr +${(I*100).toFixed(1)}%`),C>0&&P.push(`Fatigue +${C.toFixed(1)}%`),F>0&&P.push(`Ausreißer-Bonus +${F.toFixed(1)}`);const D=P.length>0?`Wettereinflüsse: ${P.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${x}`,detail:D})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const s=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(s),a-=s}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(s=>({riderId:s.rider.id,riderName:s.riderName,startOffsetSeconds:s.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(s),hasStarted:s.hasStarted||Q(s),distanceCoveredMeters:s.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-s.distanceCoveredMeters),segmentStartKm:s.segmentStartKm,segmentEndKm:s.segmentEndKm,segmentStartElevation:s.segmentStartElevation,segmentEndElevation:s.segmentEndElevation,activeTerrain:he(s)?"Finish":s.activeTerrain,skillName:he(s)?"Finish":s.skillName,skillBreakdown:he(s)?"":s.skillBreakdown,baseSkill:s.baseSkill,teamGroupBonus:s.teamGroupBonus,effectiveSkill:s.effectiveSkill,staminaPenalty:s.staminaPenalty,elevationPenalty:s.elevationPenalty,dailyForm:s.dailyForm,microForm:s.microForm,gradientPercent:s.gradientPercent,gradientModifier:s.gradientModifier,windModifier:s.windModifier,draftModifier:s.draftModifier,draftNearbyRiderCount:s.draftNearbyRiderCount,draftPackFactor:s.draftPackFactor,currentSpeedMps:s.currentSpeedMps,photoFinishScore:s.photoFinishScore,leadoutBonus:s.leadoutBonus,leadoutRiderId:s.leadoutRiderId,leadoutContributions:s.leadoutContributions,lastSplitLabel:s.lastSplitLabel,lastSplitTimeSeconds:s.lastSplitTimeSeconds,splitTimes:{...s.splitTimes},finishTimeSeconds:Number.isFinite(s.finishTimeSeconds??Number.NaN)?s.finishTimeSeconds:null,finishStatus:s.finishStatus,statusReason:s.statusReason,isAttacking:s.isAttacking,isBreakaway:s.isBreakaway,isLeadingGroup:s.isLeadingGroup,hasSuperform:s.rider.hasSuperform===!0,hasSupermalus:s.rider.hasSupermalus===!0,isFinished:he(s)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(s=>s.appliedIncident?[s.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus}}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let s=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(s=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(s==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,d)=>Math.max(o,d.distanceCoveredMeters),0);s=Number((i/1e3).toFixed(2))}const r={id:this.nextMessageId,...t,riderTeamId:a,kmMark:s};this.messages.unshift(r),this.allEvents.push(r),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(s=>[s.rider.id,s]));return this.intermediateMarkers.map(s=>{const r=t.map(i=>i.markerCrossings[s.key]??null).filter(i=>i!=null),n=Ud(r,!this.isTimeTrialMode,s.markerType,a,this.isClimberMalusStage());return{markerKey:s.key,markerLabel:s.label,markerType:s.markerType,markerCategory:s.markerCategory,kmMark:s.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.isTimeTrialMode?[...this.riders].sort(hi):Yd(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(r=>r.finishStatus!=="dnf").reduce((r,n)=>Math.max(r,n.distanceCoveredMeters),0);let s=0;for(const r of t)he(r)&&(s+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:s,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(Q)}advanceSubstep(t){const a=this.elapsedSeconds,s=a+t,r=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();this.updateBreakawayPhaseState();for(const l of this.riders){if(Q(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&s<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,u=Math.max(0,s-p);if(u<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-u),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const m=this.currentSegment(l),f=this.currentWindZone(l);if(!m||!f){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=p,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const b=Gt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=b,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[];continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,r);const g=this.calculateBasePhysics(l,m,f);l.activeTerrain=m.terrain,l.skillName=g.skillName,l.skillBreakdown=g.skillBreakdown,l.baseSkill=g.baseSkill,l.teamGroupBonus=g.teamGroupBonus,l.effectiveSkill=g.effectiveSkill,l.staminaPenalty=g.staminaPenalty,l.elevationPenalty=g.elevationPenalty,l.gradientPercent=g.gradientPercent,l.gradientModifier=g.gradientModifier,l.windModifier=g.windModifier,l.tempSpeedMps=g.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=g.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*u}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,s);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const p of this.riders)l.push(p);l.sort(Zd);for(let p=0;p<l.length;p+=1){const u=l[p];if(Q(u))continue;const m=this.isActiveBreakawayRider(u),f=u.tempSpeedMps/14,g=Math.max(5,50*f),b=this.currentSegment(u),y=Math.max(15,150*f),v=Math.max(g,Math.min(y,zd(b==null?void 0:b.terrain))),T=qd(l,p,v),w=T.size,x=Ur(w),$=Xd(w,T.positionInGroup);let R=0,I=Number.POSITIVE_INFINITY,C=null;for(let E=p-1;E>=0;E-=1){const z=l[E],L=z.distanceCoveredMeters-u.distanceCoveredMeters;if(L>=v+Sd)break;!this.canReceiveDraftFromCandidate(u,z)||this.isActiveBreakawayRider(z)||L<=0||L>=v||(R+=1,L<=I&&(I=L,C=z))}if(R===0||!C){if(m)continue;u.draftModifier=1,u.draftNearbyRiderCount=0,u.draftPackFactor=0,u.currentSpeedMps=u.tempSpeedMps,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,u.isLeadingGroup=!0,this.applyCaptainWaitLogic(u);continue}const F=Q(C)?C.tempSpeedMps:C.currentSpeedMps,P=I,D=P<=g?1:1-(P-g)/Math.max(1e-4,v-g),_=this.currentWindZone(u),B=(_==null?void 0:_.vector)??0,M=(_==null?void 0:_.windSpeedKph)??0,N=-B*(M/70),K=Math.max(.3,.35+.35*N)*Math.min(1,f)*Hr,j=ce((b==null?void 0:b.gradient_percent)??0,-20,20),A=Or(j),me=1+($?0:K*D*x*A),ae=u.tempSpeedMps*me;if(!(m&&me<=u.draftModifier)){if(u.draftModifier=me,u.draftNearbyRiderCount=w,u.draftPackFactor=x,u.isLeadingGroup=$,ae>F){if(u.tempSpeedMps>C.tempSpeedMps){u.currentSpeedMps=ae,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t;continue}if(P<1){u.currentSpeedMps=F,u.nextDistanceCoveredMeters=C.distanceCoveredMeters+F*t,m||this.applyCaptainWaitLogic(u);continue}u.currentSpeedMps=Math.min(ae,F+2),u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,m||this.applyCaptainWaitLogic(u);continue}u.currentSpeedMps=ae,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,m||this.applyCaptainWaitLogic(u)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(Q(l)||this.isTimeTrialMode&&s<=l.startOffsetSeconds)continue;const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,u=Math.max(0,s-p);if(u<=0)continue;const m=l.distanceCoveredMeters,f=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*u,g=l.pendingIncident;if(g&&m<g.triggerDistanceMeters&&f>=g.triggerDistanceMeters){const v=Math.max(.1,l.currentSpeedMps),T=Math.max(0,(g.triggerDistanceMeters-m)/v);l.distanceCoveredMeters=g.triggerDistanceMeters,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.applyIncident(l,g,p+T),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const b=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,f-l.distanceCoveredMeters)>=b){const v=b/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),l.finishTimeSeconds=p+v,l.currentSpeedMps=0;const T=Gt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=T,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[]}else l.distanceCoveredMeters=f,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,m,l.distanceCoveredMeters,p),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-u),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!Q(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=Vr(),l.nextFormUpdateMeter+=ue(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),p=this.riders.filter(m=>l.has(m.rider.id)&&!Q(m)),u=this.riders.filter(m=>!l.has(m.rider.id)&&!Q(m));if(p.length>0&&u.length>0){const m=p.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,p[0]);u.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,u[0]).distanceCoveredMeters>=m.distanceCoveredMeters&&(m.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:m.rider.id,riderName:m.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${m.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const d=od(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of d.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!Q(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const s=new Map;for(const r of this.riders){if(Q(r)||r.rider.activeTeamId==null||a<=r.startOffsetSeconds)continue;const n=s.get(r.rider.activeTeamId)??[];n.push(r),s.set(r.rider.activeTeamId,n)}for(const r of s.values()){const n=r[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,r.length),d=[...r].sort((m,f)=>f.effectiveSkill-m.effectiveSkill||m.rider.id-f.rider.id).slice(0,o).reduce((m,f)=>m+f.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-r.length),p=Math.max(1,d-l),u=this.resolveTimeTrialSpeedMps(p,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*vl(i.terrain,this.bootstrap.skillWeightRules??[]);for(const m of r){const f=Math.max(t,m.startOffsetSeconds),g=Math.max(0,a-f);m.currentSpeedMps=u,m.tempSpeedMps=u,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+u*g}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const r=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?r.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,d=i.rider.activeTeamId!=null?r.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==d?o-d:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(r=>[r.riderId,r.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((r,n)=>{const i=a.get(r.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(r)-this.resolveProjectedIttStartScore(n)||r.rider.id-n.rider.id}):[...t].sort((r,n)=>r.rider.skills.timeTrial-n.rider.skills.timeTrial||r.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,s=0;for(const r of this.bootstrap.stageSummary.segments){const n=(r.start_km+r.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,r.terrain),d=i>0?this.resolveWeightedSkill(t.rider,r.terrain,i):o,l=Math.max(0,o.value-d.value),{effectiveSkill:p}=this.resolveEffectiveSkill({rider:t,baseSkill:d.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),u=ce(r.gradient_percent,-20,20),m=u>0?Math.exp(-.11*u):1-u*.06,f=this.windZones.find(b=>n>=b.startMeter&&n<=b.endMeter)??this.windZones[this.windZones.length-1],g=f?1+f.vector*(f.windSpeedKph/100)*.52:1;a+=p*m*g*r.length_km,s+=r.length_km}return s>0?a/s:0}resolveStartOffsetSeconds(t,a,s){if(this.isIndividualTimeTrial)return a*gd;if(this.isTeamTimeTrial){const r=t.rider.activeTeamId;return(r!=null?s.get(r)??0:0)*fd}return 0}buildIntermediateMarkers(){return Ye(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||ct(t)).map(({key:t,label:a,marker:s,kmMark:r})=>({key:t,distanceMeters:r*1e3,label:a,markerType:s.type,markerCategory:s.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(d=>d.distanceMeters<t.groupPhaseEndDistanceMeters),s=this.stageDistanceMeters*Ld,r=a.some(d=>d.distanceMeters<=s);if(!(a.length<=1||!r))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(ga,Math.ceil(s/ga)*ga);for(let d=o;d<t.groupPhaseEndDistanceMeters;d+=ga)i.push(d);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,s){const r=Kd(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,d=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),p=Math.min(85,o.value)+l,u=this.isTimeTrialMode?0:t.teamGroupBonus,m=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:f,staminaPenalty:g,elevationPenalty:b}=this.resolveEffectiveSkill({rider:t,baseSkill:p,staminaPenalty:d,teamGroupBonus:u,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:m}),y=ce(a.gradient_percent,-20,20),v=y>0?Math.exp(-.11*y):1-y*.06,T=1+s.vector*(s.windSpeedKph/100)*.52,w=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:r,skillBreakdown:o.breakdown,baseSkill:p,teamGroupBonus:u,effectiveSkill:f,staminaPenalty:g,elevationPenalty:b,gradientPercent:y,gradientModifier:v,windModifier:T,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(f,t.distanceCoveredMeters,a,v,T):this.resolveRoadStageSpeedMps(f,t.distanceCoveredMeters,a,v,T,w)}}resolveRoadStageSpeedMps(t,a,s,r,n,i){const o=this.resolveSkillSpreadFactor(a,s),d=this.resolveSegmentElevation(s,a),l=this.resolveElevationSkillSpreadFactor(s,d),m=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,m*r*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const s=Math.max(0,a-Td),r=Math.floor(s/xd);return t.terrain==="Mountain"?1+(r*wd+r*Math.max(0,r-1)*Rd/2):1+r*Md}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const s=a.filter(n=>n.activeTerrain===t.activeTerrain);return(s.length>0?s:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,s){if(s<=1)return{draftModifier:1,draftPackFactor:0};const r=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,d=-i*(o/70),p=Math.max(.3,.35+.35*d)*Math.min(1,r)*Hr,u=ce(a.gradient_percent,-20,20),m=Or(u),f=Ur(s);return{draftModifier:1+p*f*m,draftPackFactor:f}}resolveBreakawayTimeGapPenalty(t){if(t<Wr)return 0;const a=Math.floor((t-Wr)/Nd);return Pd+a}recordBreakawayFallbackCheckpointCrossings(t,a,s,r,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>s)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const d=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?r+d-t.startOffsetSeconds:r+d);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let r=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((d,l)=>l.distanceCoveredMeters-d.distanceCoveredMeters||l.currentSpeedMps-d.currentSpeedMps||d.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,r;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const d=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!d)break;const l=n.markerCrossings[d.key]??null;if(!l)break;const p=t.map(u=>u.markerCrossings[d.key]??null).filter(u=>u!=null).sort((u,m)=>u.crossingTimeSeconds-m.crossingTimeSeconds||u.riderId-m.riderId)[0]??null;if(p){const u=l.crossingTimeSeconds-p.crossingTimeSeconds;r=this.resolveBreakawayTimeGapPenalty(u),this.breakawayGapStatus={gapSeconds:u,penalty:r,kmMark:d.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const d=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[d]??null;if(l==null)break;const p=t.map(u=>u.breakawayFallbackCheckpointTimes[d]??null).filter(u=>u!=null).sort((u,m)=>u-m)[0]??null;if(p!=null){const u=l-p;r=this.resolveBreakawayTimeGapPenalty(u),this.breakawayGapStatus={gapSeconds:u,penalty:r,kmMark:d<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[d]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return r}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),s=this.riders.filter(o=>!Q(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),r=this.riders.filter(o=>!Q(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(s.length===0||r.length===0){this.breakawayGapStatus=null;return}const n=[...s].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null,i=[...r].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const d=this.intermediateMarkers[o];if(!d)continue;const l=n.markerCrossings[d.key]??null,p=i.markerCrossings[d.key]??null;if(!l||!p)continue;const u=p.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:u,penalty:this.resolveBreakawayTimeGapPenalty(u),kmMark:d.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const d=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(d==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,p=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||p==null)continue;const u=p-l;this.breakawayGapStatus={gapSeconds:u,penalty:this.resolveBreakawayTimeGapPenalty(u),kmMark:d/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const s=new Set(a.riderIds),r=this.riders.filter(o=>!Q(o)&&s.has(o.rider.id));if(r.length===0)return;const n=this.riders.filter(o=>!Q(o)&&!s.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(r,n);for(const o of r)o.breakawayGapPenalty=i;for(const o of r){const d=this.currentSegment(o);if(!d)continue;const p=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=p,o.tempSpeedMps=this.resolveRoadStageSpeedMps(p,o.distanceCoveredMeters,d,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(d.terrain));const u=this.resolveMaxBreakawayDraftModifier(o,d,r.length);o.draftModifier=u.draftModifier,o.draftNearbyRiderCount=Math.max(0,r.length-1),o.draftPackFactor=u.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*u.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,s,r,n){return this.resolveRoadStageSpeedMps(t,a,s,r,n,.5)}syncRiderTelemetry(t,a=null){var i;const s=this.currentSegment(t),r=this.currentWindZone(t);if(Q(t)||!s||!r){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,s,r);t.segmentStartKm=s.start_km,t.segmentEndKm=s.end_km,t.segmentStartElevation=s.start_elevation,t.segmentEndElevation=s.end_elevation,t.activeTerrain=s.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),s=this.riders.reduce((n,i)=>Q(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(s<=t.phaseEndDistanceMeters)return!1;let r=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(s<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<_d){n.breakawayMalus=0,r=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),d=Math.floor(o/Dd),l=Math.min(Bd,n.breakawayInitialMalus),p=Math.max(l,n.breakawayInitialMalus-d*Ad),u=Ft(p);u!==n.breakawayMalus&&(n.breakawayMalus=u,r=!0)}return r}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const s=new Set(a.riderIds);for(const r of this.riders)Q(r)||!s.has(r.rider.id)||this.syncRiderTelemetry(r,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(r=>t.riderIds.includes(r.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const r of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:r.rider.id,riderName:r.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(r.rider.id,r.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let s=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const r of a)r.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),s=!0}if(this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const r of a)r.breakawayMalus=t.malusValue,r.breakawayInitialMalus=t.malusValue,r.breakawayRecoveryStartDistanceMeters=null,r.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return s}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const s=this.riders.filter(o=>!Q(o)&&a.riderIds.includes(o.rider.id));if(s.length===0)return;const r=[...s].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0];if(!r)return;const n=Math.max(.1,r.currentSpeedMps),i=r.distanceCoveredMeters+n*t;for(const o of s){if(Math.max(0,r.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?Ql:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const s=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(s==null||s.isCounterAttack)return!0;const r=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(r==null?void 0:r.isCounterAttack)===!0&&r.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(s=>s.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const s=this.resolvePreStageGcRank(t);return s!=null?`${a} (${s}.)`:a}triggerStageAttacksForRider(t,a,s,r){if(Q(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||s<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(s/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const d=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/d),p=r+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:p,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const u=new Set(this.activeStageAttacksByRiderId.keys()),m=this.stageFavorites.slice(0,20).filter(b=>{if(b.kind!=="rider"||b.riderId==null)return!1;const y=this.riders.find(T=>T.rider.id===b.riderId);if(!y||Q(y))return!1;const v=t.distanceCoveredMeters-y.distanceCoveredMeters;return v>=0&&v<=150}),f=id(m,t.rider.id,u),g=[];for(const b of f){const y=this.riders.find(v=>v.rider.id===b);!y||Q(y)||this.activeStageAttacksByRiderId.has(b)||(this.activeStageAttacksByRiderId.set(b,{riderId:b,remainingSeconds:_r,startedAtElapsedSeconds:p,triggerDistanceMeters:y.distanceCoveredMeters,durationSeconds:_r,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),y.isAttacking=!0,g.push({riderId:b,riderName:this.formatRiderWithPreStageGc(b,y.riderName),riderTeamId:y.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:p,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const b of g)this.pushMessage({elapsedSeconds:p,riderId:b.riderId,riderName:b.riderName,type:"counter_attack",tone:"warning",title:`${b.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const s of t){if(s.finishStatus==="dnf")continue;const r=a[a.length-1];if(!r||Math.abs(r.distanceMeter-s.distanceCoveredMeters)>=ma){a.push({riderIds:[s.rider.id],riderCount:1,distanceMeter:s.distanceCoveredMeters,distanceSum:s.distanceCoveredMeters});continue}r.riderIds.push(s.rider.id),r.riderCount+=1,r.distanceSum+=s.distanceCoveredMeters,r.distanceMeter=r.distanceSum/r.riderCount}return a.map(({distanceSum:s,...r})=>r)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!Q(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),s=new Map;let r=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],d=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-d<ma;){const u=a[n].rider.activeTeamId;u!=null&&s.set(u,(s.get(u)??0)+1),n+=1}for(;r<a.length&&d-a[r].distanceCoveredMeters>=ma;){const u=a[r].rider.activeTeamId;if(u!=null){const m=(s.get(u)??0)-1;m<=0?s.delete(u):s.set(u,m)}r+=1}const l=o.rider.activeTeamId,p=l==null?0:Math.max(0,(s.get(l)??0)-1);t.set(o.rider.id,p===0?0:Ft(p*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?$d:0,s=this.resolveBreakawaySkillBonus(t.rider),r=t.baseSkill+_a(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+s+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,r),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const s=ce(this.stageDistanceMeters/1e3,Ed,Cd),r=this.interpolateStaminaDistanceValue(s),n=ce(t,Kr,ls),i=(ls-n)/(ls-Kr),o=r/3+i*r,d=this.stageDistanceMeters<=0?0:ce(a/this.stageDistanceMeters,0,1);return o*d**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=mt[0].kmMark)return mt[0].value;for(let a=0;a<mt.length-1;a+=1){const s=mt[a],r=mt[a+1];if(t<=r.kmMark){const n=Math.max(1e-4,r.kmMark-s.kmMark),i=(t-s.kmMark)/n;return s.value+(r.value-s.value)*i}}return mt[mt.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/os),s=Math.max(1,Math.ceil(t/os)),r=ue(hd,bd),n=Array.from({length:s},()=>ue(.2,1.2)),i=n.reduce((l,p)=>l+p,0),o=Array.from({length:a+1},()=>1);o[0]=r;let d=0;for(let l=1;l<=s;l+=1)d+=n[l-1]??0,o[l]=r+(1-r)*(d/i);return o}resolveSkillSpreadFactor(t,a){const s=this.stageDistanceMeters<=0?1:ce(t/this.stageDistanceMeters,0,1),r=Math.min(this.spreadCurve.length-1,Math.floor(s/os)),n=this.spreadCurve[r]??1;if(s<=this.lateStageStartRatio)return n;const i=Sl(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),d=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=ce((s-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),p=this.interpolateFinalSpread(o,l);if(o<=1&&d<=1)return n;if(s<this.finalPushStartRatio||d<=o)return Math.max(n,p);const u=ce((s-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),m=o+(d-o)*u;return Math.max(n,m)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const s=Xn(this.simulationMode,t,this.skillWeightRuleMap).map(r=>({key:r.key,weight:r.weight}));return this.weightedSkillComponentsByTerrain.set(t,s),s}resolveWeightedSkill(t,a,s=0){const r=this.resolveWeightedSkillComponents(a),n=s>0||t.mentorBoosts?{...t.skills}:t.skills;if(s>0&&(n.stamina=Math.max(0,n.stamina-s)),t.mentorBoosts)for(const[l,p]of Object.entries(t.mentorBoosts))typeof p=="number"&&(n[l]+=p);let i=0,o=0;for(const l of r)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:yl(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,r)}}resolveSkillBreakdown(t,a,s){const r=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(r);if(n!==void 0)return n;const i=Wd(t,s);return this.skillBreakdownCache.set(r,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const s=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,r=Math.max(0,100-s)/1e3,n=this.resolveElevationBucket(a);return r*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const s=a??this.interpolateElevation(t.distanceCoveredMeters),r=this.resolveElevationBucket(s);return r===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=r,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,s)),t.elevationPenalty}resolveSegmentElevation(t,a){const s=t.start_km*1e3,r=t.end_km*1e3,n=Math.max(1e-4,r-s),i=ce((a-s)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const r=ce(t,0,this.stageDistanceMeters)/1e3;if(r<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(r<=o.kmMark){const d=Math.max(1e-4,o.kmMark-i.kmMark),l=(r-i.kmMark)/d;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),ds(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var u;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(he).sort((m,f)=>(m.finishTimeSeconds??0)-(f.finishTimeSeconds??0)||f.photoFinishScore-m.photoFinishScore||m.rider.id-f.rider.id);if(t.length===0)return;const a=[];let s=null;for(const m of t){const f=m.finishTimeSeconds??0;if(a.length===0){a.push(m),s=f;continue}if(s!=null&&f-s<=Ut){a.push(m),s=f;continue}break}const r=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=m=>m.photoFinishScore,o=[...a].sort((m,f)=>i(f)-i(m)||m.rider.id-f.rider.id),d=((u=o[0])==null?void 0:u.finishTimeSeconds)??0,l=this.finishWeightProfile,p=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${p} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${Ut.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${r}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((m,f)=>{const g=Jd(m,l).map($=>`${fi[$.skillKey]} ${$.contribution.toFixed(2)} = ${$.effectiveSkill.toFixed(2)} x ${($.weight*100).toFixed(0)}%`).join(" | "),b=m.finishTimeSeconds??0,y=b-d,v=y<=1e-4?`${b.toFixed(2)} s`:`${b.toFixed(2)} s (+${y.toFixed(2)} s)`,T=this.calculatePhotoFinishScore(m),w=m.leadoutBonus??0,x=Gt(m,r,n);console.log(`#${f+1} Zielsprint | ${m.riderName} | Zeit ${v} | Score (ohne Boni): ${T.toFixed(2)} -> Score (mit Boni): ${m.photoFinishScore.toFixed(2)} [SpecAdj: ${x>0?"+":""}${x.toFixed(2)}, Leadout: +${w.toFixed(2)}] | ID-Tiebreak ${m.rider.id} | (${g})`)}),console.groupEnd()}recordIntermediateSplits(t,a,s,r,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>s)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,d=Math.max(0,this.isTimeTrialMode?r+o-t.startOffsetSeconds:r+o);let l=this.resolveMarkerCrossingScore(t,i);const p=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;p&&(l+=Gt(t,p,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=d,t.splitTimes[i.key]=d,t.splitTimes[i.label]=d,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:d,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return ds(t,this.resolveSprintWeightProfile());const s=ds(t,this.resolveClimbWeightProfile(a.markerCategory)),r=Hd(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return s+r}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??ld}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??md[a]}calculatePreLeadoutFinishScore(t){const s=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,r=_a(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[d,l])=>{if(!l)return o;const p=d==="stamina"?s:0,u=Math.max(0,t.rider.skills[d]+r+t.dailyForm+t.microForm+t.teamGroupBonus-p);return o+u*l},0),i=Gt(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}applySprintLeadoutBonuses(){const t=this.resolveFinishMarkerType();if(t!=="finish_flat"&&t!=="finish_hill"||this.isTimeTrialMode)return;const a=this.riders.filter(he).sort((o,d)=>(o.finishTimeSeconds??0)-(d.finishTimeSeconds??0));if(a.length===0)return;const s=[];let r=null;for(const o of a){const d=o.finishTimeSeconds??0;if(s.length===0){s.push(o),r=d;continue}if(r!=null&&d-r<=Ut){s.push(o),r=d;continue}break}const n=new Set(s.map(o=>o.rider.id)),i=new Map;for(const o of this.riders)if(o.finishStatus!=="dnf"&&o.finishStatus!=="otl"&&o.finishStatus!=="dns"&&o.finishTimeSeconds!=null&&o.rider.skills.sprint>=73&&o.rider.activeTeamId!=null&&n.has(o.rider.id)){const d=o.rider.activeTeamId,l=i.get(d)??[];l.push(o),i.set(d,l)}for(const[o,d]of i.entries()){if(d.length===0)continue;let l=null,p=Number.NEGATIVE_INFINITY;for(const u of d){const m=this.calculatePreLeadoutFinishScore(u);m>p?(p=m,l=u):m===p&&l!==null&&(u.rider.skills.sprint>l.rider.skills.sprint||u.rider.skills.sprint===l.rider.skills.sprint&&u.rider.id<l.rider.id)&&(l=u)}if(l){const u=this.calculateSprintLeadoutBonusForRider(l);u>0&&(l.leadoutBonus=u,l.photoFinishScore+=u)}}}calculateSprintLeadoutBonusForRider(t){const a=t.rider.activeTeamId;if(a==null)return 0;const s=this.riders.filter(p=>p.rider.activeTeamId===a);if(s.length===0)return 0;let r=this.teamSprintRandomValues.get(a);r===void 0&&(r=ue(.25,.6),this.teamSprintRandomValues.set(a,r));let n=this.teamSprintSpecialRandomValues.get(a);n===void 0&&(n=ue(.1,.3),this.teamSprintSpecialRandomValues.set(a,n)),t.leadoutRiderId=null;let i=0,o=0,d=null;const l=[];for(const p of s){if(p.rider.id===t.rider.id||p.finishStatus==="dnf"||p.finishStatus==="otl"||p.finishStatus==="dns")continue;let u=0;const m=p.rider.skills.sprint>=72,f=p.rider.skills.flat>=78,g=p.rider.skills.timeTrial>=76,b=p.rider.skills.acceleration>=80;if(m&&u++,f&&u++,g&&u++,b&&u++,u>0){const y=m?r:n;let v=1;u===2?v=1.25:u===3?v=1.5:u===4&&(v=2);const T=y*v*1.5;if(i+=y*v,l.push({riderId:p.rider.id,name:p.riderName,contribution:Number(T.toFixed(2))}),y*v>o)o=y*v,d=p.rider.id;else if(y*v===o&&d!==null){const w=this.riders.find(x=>x.rider.id===d);w&&p.rider.skills.sprint>w.rider.skills.sprint&&(d=p.rider.id)}}}return i>0&&(t.leadoutRiderId=d,t.leadoutContributions=l),i*1.5}resolveFinishMarkerType(){const t=Ye(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const s=t[a].marker.type;if(s==="finish_flat"||s==="finish_hill"||s==="finish_mountain")return s}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return cd;case"finish_mountain":return ud;default:return dd}}resolveRiderClockSeconds(t){if(he(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,s,r=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(d=>d.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){r=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const d=this.riders.find(p=>p.rider.id===o);if(!d||Q(d))continue;if(Math.abs(d.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const p=wl(d.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(d,p,s,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:s,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:r?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:s,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:r?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:s,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(s=>s.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+ma){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const Qd=300;async function ec(e,t){const a=new bi(e,{maxSubstepSeconds:5});let s=!1;for(;!s;){const r=a.step(Qd);if(s=r.isFinished,t){const n=r.stageDistanceMeters>0?r.leaderDistanceMeters/r.stageDistanceMeters:0,i=e.riders.length>0?r.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const tc=[1,2,5,10,25,50,100,250,500],Yr=new WeakMap;function ac(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function Zr(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function sc(e){const t=Yr.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${tc.map(s=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return Yr.set(e,a),a}function Jr(e,t){const a=sc(e);a.timeField&&(a.timeField.textContent=ac(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${Zr(t.snapshot.leaderDistanceMeters)} / ${Zr(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(s=>{const r=Number(s.dataset.raceSimSpeed);s.classList.toggle("active",r===t.timeMultiplier)})}const rc=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function nc(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),s=t%60;return`${a}:${String(s).padStart(2,"0")}`}function Dt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ic(e){return`/jersey/Jer_${e}.png`}function yi(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${Dt(ic(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function oc(e){return e.riderId==null||e.riderTeamId==null?"":yi(e.riderTeamId)}function lc(e){const t=Dt(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function dc(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${Dt(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${Dt(e)}</button>`}function cc(e,t){if(t==="all")return!0;const a=vi(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function uc(e){const t=e.detail?Dt(e.detail):"",a=(e.secondaryRiders??[]).map(r=>`${r.riderTeamId!=null?yi(r.riderTeamId,"race-sim-message-inline-jersey"):""}${dc(r.riderName,r.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const s=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${s}</span>`}function vi(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function qr(e,t,a="all"){const s=t.filter(n=>cc(n,a)),r=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${rc.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${s.length===0?`<div class="race-sim-message-empty">${r}</div>`:s.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${Dt(vi(n))}">
          <span class="race-sim-message-time">t=${nc(n.elapsedSeconds)}</span>
          ${oc(n)}
          <span class="race-sim-message-text">
            ${lc(n)}
            ${uc(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const mc=1,pc={Flat:12,Rolling:14,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:23,High_Mountain:25,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function gc(e){return Math.max(0,Math.round(e))}function Si(e){return e==="ITT"||e==="TTT"}function fc(e){return pc[e]??20}function hc(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+fc(e)/100))}function bc(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function Xr(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function cs(e,t){if(Si(t))return[...e].sort(bc);const a=[...e].sort((o,d)=>o.stageTimeSeconds-d.stageTimeSeconds||Xr(o,d)),s=[];let r=[],n=null;const i=()=>{s.push(...r.sort(Xr))};for(const o of a){if(r.length===0){r=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=mc){r.push(o),n=o.stageTimeSeconds;continue}i(),r=[o],n=o.stageTimeSeconds}return r.length>0&&i(),s}function Z(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function yc(e){return`/jersey/Jer_${e}.png`}function aa(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${Z(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${Z(yc(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function sa(e,t,a){return e==null?`<span class="${a}" title="${Z(t)}">${Z(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${Z(t)}">${Z(t)}</button>`}function vc(e){return e.toFixed(1).replace(".",",")}function Ga(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Sc(e){return`${e??0} Pkt.`}function kc(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function $c(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function ki(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function Tc(e){if(e==null||e<=0)return ki(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function it(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function ha(e){return`${e.toFixed(1).replace(".",",")} km`}function Qr(e){return`${e.toFixed(1).replace(".",",")}%`}function ba(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function en(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function xc(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function Mc(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function wc(e,t,a){return Array.from({length:t},(s,r)=>e.slice(r*a,(r+1)*a))}function Rc(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const s=wc(e,4,5),r=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${s.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=Mc(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${aa(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${sa(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${Z(i.roleLabel)}">${Z(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?r.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${Z(Ga(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${vc(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function Xt(e,t){const a=e.riders.find(s=>s.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function qa(e,t){const a=e.riders.find(n=>n.id===t),s=(a==null?void 0:a.activeTeamId)??null,r=s!=null?e.teams.find(n=>n.id===s)??null:null;return{teamId:s,teamName:(r==null?void 0:r.name)??null}}function Ic(e,t,a,s={}){const r=(t??[]).slice(0,s.limit??8);return r.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${r.map(n=>{var u;const i=n.riderId??0,o=qa(e,i),d=Xt(e,i),l=((u=s.distanceGapsByRiderId)==null?void 0:u.get(i))??null,p=[s.distanceGapClassName??"",$c(l)].filter(m=>m.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${aa(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${sa(n.riderId,d,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${s.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${p}">${Z(kc(l))}</span>`:""}
      </article>`}).join("")}</div>`}function ya(e,t,a,s,r,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${Z(e)}</h4>
      ${Ic(a,s,r,n)}
    </section>`}function xt(e,t,a,s,r=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${s}" ${r?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${s}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${Z(e)}</span>
      </summary>
      ${t}
    </details>`}function Ha(e,t,a,s){const r=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var d;const i=r.get(n.id)??null,o=((d=a.get(n.id))==null?void 0:d[s])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||Xt(e,n.riderId).localeCompare(Xt(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function tn(e){const t=Fc(e)?e.stagePoints:0;return`${Z(Sc("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${Z(t)}</span></span>`:""}`}function Fc(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function an(e,t){if(t==null)return new Map;const a=e.riders.find(s=>s.riderId===t)??null;return a?new Map(e.riders.map(s=>[s.riderId,a.distanceCoveredMeters-s.distanceCoveredMeters])):new Map}function Ec(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function Fa(e,t){var s;const a=(s=e.race.category)==null?void 0:s.bonusSystem;return!a||t==null||t==="Sprint"?[]:it(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function js(e){var s;const t=(s=e.race.category)==null?void 0:s.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return it(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return it(a?t.pointsMountainStage:t.pointsSprintFinish)}function $i(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:it((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function Cc(e,t,a){let s=null;for(const r of e.stageSummary.segments){const n=Math.max(t,r.start_km),i=Math.min(a,r.end_km),o=Math.max(0,i-n);if(o<=0)continue;const d={lengthKm:o,gradient:r.gradient_percent};(s==null||d.gradient>s.gradient||d.gradient===s.gradient&&d.lengthKm>s.lengthKm)&&(s=d)}return s}function us(e,t,a,s=null){return e.entries.filter(r=>s==null||s.has(r.riderId)).map((r,n)=>({riderId:r.riderId,rank:r.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:r.crossingTimeSeconds,gapSeconds:r.gapSeconds})).filter(r=>r.points>0)}function Os(e){const t=new Map;for(const a of e)for(const s of a.entries){const r=t.get(s.riderId)??{points:0,mountain:0};s.pointsKind==="mountain"?r.mountain+=s.points:r.points+=s.points,t.set(s.riderId,r)}return t}function Nc(e){return Ye(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function za(e,t){const a=Si(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?gc(a):null}function Xa(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=za(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const s=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(s)||s<=0)return cs(a,e.stage.profile).map(n=>n.rider);const r=hc(e.stage.profile,a.map(n=>n.stageTimeSeconds));return r==null?cs(a,e.stage.profile).map(n=>n.rider):cs(a.filter(n=>n.stageTimeSeconds<=r),e.stage.profile).map(n=>n.rider)}function Pc(e,t){const a=js(e);return a.length===0?[]:Xa(e,t).map((s,r)=>({riderId:s.riderId,rank:r+1,points:a[r]??0,pointsKind:"points",crossingTimeSeconds:za(e,s),gapSeconds:null})).filter(s=>s.points>0)}function Lc(e,t){const a=Xa(e,t).slice(0,20),s=a[0]!=null?za(e,a[0])??0:0;return a.map((r,n)=>{const i=za(e,r)??0;return{riderId:r.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-s),photoFinishScore:r.photoFinishScore}})}function Dc(e,t){var a;return((a=Xa(e,t)[0])==null?void 0:a.riderId)??null}function Vs(e,t,a){var w,x;const s=Ye(e.stageSummary),r=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(Xa(e,a).map($=>$.riderId)):null,i=s.filter(({marker:$})=>$.type==="climb_start"),o=s.filter(({marker:$})=>ct($)).sort(($,R)=>$.kmMark-R.kmMark).map(($,R)=>{var j,A;const I=[...i].reverse().find(X=>X.kmMark<=$.kmMark)??null,C=Ec(e,$.kmMark),F=(I==null?void 0:I.kmMark)??(C==null?void 0:C.start_km)??$.kmMark,P=(I==null?void 0:I.elevation)??(C==null?void 0:C.start_elevation)??$.elevation,D=Math.max(0,$.kmMark-F),_=D>0?($.elevation-P)/(D*1e3)*100:(C==null?void 0:C.gradient_percent)??0,B=Cc(e,F,$.kmMark),M=t.find(X=>X.markerKey===$.key)??null,N=Fa(e,(M==null?void 0:M.markerCategory)??$.marker.cat??null),O=M?us(M,N,"mountain",n):[],K=(M==null?void 0:M.markerCategory)??$.marker.cat??null;return{key:$.key,title:`${R+1}. Bergwertung`,label:$.label,categoryLabel:K?`Kat. ${K}`:null,categoryClassName:en(K),kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:D,averageGradient:_,steepestSegmentLengthKm:(B==null?void 0:B.lengthKm)??null,steepestSegmentGradient:(B==null?void 0:B.gradient)??null,highlightMeta:$.kmMark>=r,leaderRiderId:((j=O[0])==null?void 0:j.riderId)??((A=M==null?void 0:M.entries[0])==null?void 0:A.riderId)??null,displayBadges:ba(N,"mountain"),entries:O,timingEntries:(M==null?void 0:M.entries)??[],accent:"mountain"}}),d=s.filter(({marker:$})=>$.type==="sprint_intermediate").sort(($,R)=>$.kmMark-R.kmMark).map(($,R)=>{var P,D;const I=t.find(_=>_.markerKey===$.key)??null,C=$i(e),F=I?us(I,C,"points",n):[];return{key:$.key,title:`${R+1}. Zwischensprint`,label:$.label,categoryLabel:null,categoryClassName:null,kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((P=F[0])==null?void 0:P.riderId)??((D=I==null?void 0:I.entries[0])==null?void 0:D.riderId)??null,displayBadges:ba(C,"points"),entries:F,timingEntries:(I==null?void 0:I.entries)??[],accent:"sprint"}}),l=Nc(e),p=Pc(e,a),u=l?t.find($=>$.markerKey===l.key)??null:null,m=u?us(u,Fa(e,u.markerCategory),"mountain",n):[],f=js(e),g=u?Fa(e,u.markerCategory):[],b=e.stage.profile==="ITT"||e.stage.profile==="TTT"?Lc(e,a):(u==null?void 0:u.entries)??[],y=((w=p[0])==null?void 0:w.riderId)??((x=m[0])==null?void 0:x.riderId)??Dc(e,a),v={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:u!=null&&u.markerCategory?`Kat. ${u.markerCategory}`:null,categoryClassName:en((u==null?void 0:u.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(u!=null&&u.markerCategory),leaderRiderId:y,displayBadges:[...ba(f,"points"),...ba(g,"mountain")],entries:[...p,...m],timingEntries:b,accent:"finish"};return[...[...d,...o].sort(($,R)=>$.kmMark-R.kmMark||$.title.localeCompare(R.title,"de")),v].filter($=>$.entries.length>0||$.timingEntries.length>0||$.accent!=="finish"||l!=null||a.isFinished)}function Ac(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),s=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,r=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,s):t.entries.slice(0,s).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return r.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${r.map(n=>{const i=qa(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${aa(i.teamId,i.teamName)}
            ${sa(n.riderId,Xt(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?Z(ki(n.crossingTimeSeconds)):Z(Tc(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function sn(e,t){var a;return((a=e==null?void 0:e.find(s=>s.riderId===t))==null?void 0:a.points)??0}function rn(e,t){var a;return((a=e.filter(s=>s.riderId!=null&&t.has(s.riderId)).sort((s,r)=>s.rank-r.rank||s.riderId-r.riderId)[0])==null?void 0:a.riderId)??null}function va(e,t,a){if(!(!t||e.some(s=>s.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function Bc(e,t,a,s,r){const n=new Set(e.riderIds),i=new Map(t.riders.map(f=>[f.riderId,f])),d=e.riderIds.map(f=>i.get(f)??null).filter(f=>f!=null).sort((f,g)=>{var b,y;return(((b=a.get(f.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)-(((y=a.get(g.riderId))==null?void 0:y.rank)??Number.MAX_SAFE_INTEGER)||f.riderName.localeCompare(g.riderName,"de")||f.riderId-g.riderId}).slice(0,25),l=i.get(rn(s,n)??-1)??null,p=i.get(rn(r,n)??-1)??null,u=l!=null&&!d.some(f=>f.riderId===l.riderId),m=p!=null&&!d.some(f=>f.riderId===p.riderId);return d.length>=25&&u&&m&&l.riderId!==p.riderId?(va(d,l,23),va(d,p,24),d):(va(d,l,24),va(d,p,24),d)}function _c(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function Gc(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function nn(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function Hc(e,t){const a=t.riders.filter(r=>e.riderIds.includes(r.riderId)).reduce((r,n)=>Math.max(r,n.distanceCoveredMeters),0),s=Math.max(0,t.leaderDistanceMeters-a);return s>0?`-${Math.round(s)} m`:"—"}function zc(e,t,a,s,r,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=rl(a,s),d=a.find(m=>m.label===o)??a[0],l=new Map(e.gcStandings.map(m=>[m.riderId,m])),p=Os(i),u=Bc(d,t,l,r,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${Z(d.label)} <span class="race-sim-group-count">(${d.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${Z(nn(d.previousGapMeters,"-"))}</span>
        <span>Leader ${Z(Hc(d,t))}</span>
        <span>Hinten ${Z(nn(d.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${u.map((m,f)=>{const g=l.get(m.riderId)??null,b=qa(e,m.riderId),y=p.get(m.riderId)??{points:0,mountain:0},v=sn(r,m.riderId),T=sn(n,m.riderId),w=_c(m.riderId,e.classificationLeaders),x=w.length>0?w.map($=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[$]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${Gc(w)}" title="${Z(x)}">${f+1}.</strong>
              ${aa(b.teamId,b.teamName)}
              <span class="race-sim-classification-main">
                ${sa(m.riderId,m.riderName,`race-sim-group-rider-name${m.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${g?g.rank:"—"} · ${Z(g?Ga(g.gapSeconds):"—")} · ${Z(m.gapToLeaderMeters>0?`+${Math.round(m.gapToLeaderMeters)} m`:"—")}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${v}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${T}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${y.points>0?`▲ +${y.points}`:" "}</span>
                  <span class="race-sim-breakaway-stage-gain">${y.mountain>0?`▲ +${y.mountain}`:" "}</span>
                </span>
              </span>
            </article>`}).join("")}
      </div>
    </section>`}function Kc(e,t,a,s){const r=Vs(t,a.markerClassifications,a),n=Os(r),i=Ha(t,t.pointsStandings,n,"points"),o=Ha(t,t.mountainStandings,n,"mountain"),d=Ks(zs(a.clusters));e.innerHTML=zc(t,a,d,s,i,o,r)}function Wc(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function jc(e){const t=Ye(e.stageSummary),a=$i(e)[0]??0,s=js(e)[0]??0,r=t.filter(({marker:n})=>ct(n)).reduce((n,{marker:i})=>n+(Fa(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+s,mountain:r}}function on(e){const t=jc(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function Oc(e){const t=xc(e),a=[`<span class="race-sim-stage-points-meta-pill">${Z(ha(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${Z(`${ha(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${Z(`Länge ${ha(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${Z(`Ø ${Qr(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${Z(`Steilstes ${ha(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${Z(Qr(e.steepestSegmentGradient))}</span>`:""].filter(s=>s.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${Z(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${Z(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${Z(e.label)}">${Z(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((s,r)=>`${r>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${s}`).join("")}
    </span>`}function Vc(e,t,a,s=null){const r=s??Vs(e,t,a);return r.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${on(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${on(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${r.map(n=>{const i=n.leaderRiderId!=null?qa(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?Xt(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${Oc(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${Wc(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${aa(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?sa(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${Z(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${Ac(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function Uc(e,t,a,s,r,n=new Set){var f,g;const i=Vs(a,s,r),o=Os(i),d=Ha(a,a.pointsStandings,o,"points"),l=Ha(a,a.mountainStandings,o,"mountain"),p=an(r,((f=a.gcStandings[0])==null?void 0:f.riderId)??null),u=an(r,((g=a.youthStandings[0])==null?void 0:g.riderId)??null),m=b=>!n.has(b);e.innerHTML=`
    ${xt("Stage Favorites",Rc(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",m("favorites"))}
    <section class="race-sim-classifications-section">
      ${xt("GC",ya("GC","gc",a,a.gcStandings,b=>Z(`GC ${b.rank} · ${Ga(b.gapSeconds)}`),{limit:20,distanceGapsByRiderId:p}),"race-sim-overview-classification race-sim-overview-gc","gc",m("gc"))}
      ${xt("Punktewertung",ya("Punktewertung","points",a,d,tn),"race-sim-overview-classification race-sim-overview-points","points",m("points"))}
      ${xt("Bergwertung",ya("Bergwertung","mountain",a,l,tn),"race-sim-overview-classification race-sim-overview-mountain","mountain",m("mountain"))}
      ${xt("Nachwuchsfahrerwertung",ya("Nachwuchsfahrerwertung","youth",a,a.youthStandings,b=>Z(`${b.rank}. · ${Ga(b.gapSeconds)}`),{distanceGapsByRiderId:u,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",m("youth"))}
    </section>
    ${xt("Etappenwertungen",Vc(a,s,r,i),"race-sim-overview-stage-scoring","stageScoring",m("stageScoring"))}
  `}const ln=new WeakMap,Ve=new WeakMap,dn=new WeakMap,Ti=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function Y(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function xi(e){return e<=0?"—":`+${Math.round(e)} m`}function Yt(e){const t=Ti.format(e);return e>0?`+${t}`:t}function ms(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function ie(e){return Ti.format(e)}function kt(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function Mi(e){return`+${kt(e)}`}function wi(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Us(e){return`${(e*3.6).toFixed(1)} km/h`}function Yc(e){return`${Yt(e)}%`}function Rs(e){return`${e.toFixed(1).replace(".",",")} km`}function Ri(e){return`${Rs(e.segmentStartKm)} - ${Rs(e.segmentEndKm)}`}function Zc(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function Ii(e){return e.replace(/_/g," ")}function Fi(e){return Ii(e)}function Jc(e){return Ii(e)}function Ei(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function qc(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function Xc(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Ci(e){return Ye(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||ct(t)).map(({key:t,label:a})=>({key:t,label:a}))}function Qc(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function eu(e,t,a,s){var r;return a!=="ITT"&&a!=="TTT"?((r=s.get(t))==null?void 0:r.get(e.riderId))??null:e.splitTimes[t]??null}function Ni(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(r=>({label:r.key,displayLabel:r.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${r.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function tu(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function au(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function Pi(e){const t=ln.get(e);if(t)return t;const a=Ci(e),s={splitMarkers:a,columns:Ni(e,a,!1),riderById:new Map(e.riders.map(r=>[r.id,r])),teamById:new Map((e.teams??[]).map(r=>[r.id,r])),teamAbbreviationById:new Map((e.teams??[]).map(r=>[r.id,r.abbreviation])),teamNameById:new Map((e.teams??[]).map(r=>[r.id,r.name])),gcByRiderId:new Map((e.gcStandings??[]).map(r=>[r.riderId,r]))};return ln.set(e,s),s}function Li(e,t){const a=e.parentElement,s=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!s)return"";const r=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",s.insertAdjacentElement("beforebegin",l),l})(),n=Ys(e),i=tu(t),o=au(i,n),d=Ve.get(e);return(d==null?void 0:d.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),r.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,s.innerHTML=t.map(l=>su(l,n)).join(""),Ve.set(e,{layoutKey:o,orderedRiderIds:(d==null?void 0:d.orderedRiderIds)??[],rowsByRiderId:(d==null?void 0:d.rowsByRiderId)??new Map,openDetailRiderId:(d==null?void 0:d.openDetailRiderId)??null,openTeamId:(d==null?void 0:d.openTeamId)??null})),o}function qe(e,t){e.textContent!==t&&(e.textContent=t)}function Sa(e,t){e.title!==t&&(e.title=t)}function ka(e,t){e.className!==t&&(e.className=t)}function $a(e,t,a){return e.lastValues[t]!==a}function Ta(e,t,a){e.lastValues[t]=a}function Ys(e){const t=dn.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return dn.set(e,a),a}function su(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${Y(e.label)}">${Y(a)}</span>`;const s=!t.autoSort&&t.manualSortKey===e.sortKey,r=s?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${s?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${Y(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${Y(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${Y(a)}<span class="race-sim-leaderboard-sort-indicator">${Y(r)}</span></button>`}function ru(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function nu(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function cn(e,t,a,s,r,n,i){if(s.autoSort)return(d,l)=>e.stage.profile==="ITT"?Di(d,l,t):du(d,l);if(!s.manualSortKey)return null;const o=s.manualSortDirection==="asc"?1:-1;return(d,l)=>{if(Me(d)!==Me(l))return Me(d)?1:-1;const p=r.get(d.riderId)??null,u=r.get(l.riderId)??null,m=un(d,p,s.manualSortKey??"",e,a,n,i),f=un(l,u,s.manualSortKey??"",e,a,n,i);return nu(m,f)*o||d.riderId-l.riderId}}function iu(e,t,a){if(e.length!==t.size)return!1;let s=null;for(const r of e){const n=t.get(r);if(!n||s&&a(s,n)>0)return!1;s=n}return!0}function un(e,t,a,s,r,n,i){const o=s.race.isStageRace&&s.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return s.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?eu(e,a.slice(6),s.stage.profile,r):null}}function ou(e,t,a,s,r,n,i,o,d){if(!r.manualSortKey){if(r.autoSort){const m=cn(t,a,s,r,n,i,o);return m?[...e].sort(m):[...e]}const u=new Map(r.frozenOrder.map((m,f)=>[m,f]));return[...e].sort((m,f)=>(Me(m)===Me(f)?0:Me(m)?1:-1)||(u.get(m.riderId)??Number.MAX_SAFE_INTEGER)-(u.get(f.riderId)??Number.MAX_SAFE_INTEGER)||m.riderId-f.riderId)}const l=cn(t,a,s,r,n,i,o);if(!l)return[...e];const p=new Map(e.map(u=>[u.riderId,u]));return iu(d,p,l)?d.map(u=>p.get(u)).filter(u=>u!=null):[...e].sort(l)}function lu(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const p=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(p))return!1;const u=Ve.get(e);return u?(u.openTeamId=u.openTeamId===p?null:p,u.openTeamId==null&&(u.openDetailRiderId=null),!0):!1}const s=t.closest("button[data-race-sim-rider-toggle]");if(s){const p=Number(s.dataset.raceSimRiderToggle);if(!Number.isFinite(p))return!1;const u=Ve.get(e);return u?(u.openDetailRiderId=u.openDetailRiderId===p?null:p,!0):!1}const r=Ys(e);if(t.closest("button[data-race-sim-splits-toggle]"))return r.showSplitColumns=!r.showSplitColumns,!r.showSplitColumns&&((l=r.manualSortKey)!=null&&l.startsWith("split:"))&&(r.manualSortKey=null,r.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return r.autoSort=!r.autoSort,r.autoSort?(r.manualSortKey=null,r.frozenOrder=[]):(r.manualSortKey=null,r.manualSortDirection="asc",r.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(p=>Number(p.dataset.raceSimRiderRow)).filter(p=>Number.isFinite(p))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||r.autoSort)return!1;const d=o.dataset.raceSimSortKey;return d?(r.manualSortKey===d?r.manualSortDirection=r.manualSortDirection==="asc"?"desc":"asc":(r.manualSortKey=d,r.manualSortDirection=ru(d)),r.frozenOrder=[],!0):!1}function mn(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function Me(e){return e.finishStatus==="dnf"}function Di(e,t,a){if(Me(e)!==Me(t))return Me(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const d=a[o];if(!d)continue;const l=e.splitTimes[d.key],p=t.splitTimes[d.key];if(l!=null&&p!=null&&l!==p)return l-p;if(l!=null&&p==null)return-1;if(l==null&&p!=null)return 1}const s=mn(e,a),r=mn(t,a);if(s!==r)return s?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function du(e,t){return Me(e)!==Me(t)?Me(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function Ai(e,t){const a=(t==null?void 0:t.formBonus)??0,s=(t==null?void 0:t.raceFormBonus)??0,r=((t==null?void 0:t.fatigueMalus)??0)*.5,n=((t==null?void 0:t.longTermFatigueMalus)??0)*.5,i=((t==null?void 0:t.shortTermFatigueMalus)??0)*.5,o=e.teamGroupBonus,d=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,p=e.baseSkill+l+a+s+e.dailyForm+e.microForm+o-r-n-i,u=Math.max(0,p-e.staminaPenalty),m=p-u,f=u-e.effectiveSkill;return[`Basis ${ie(e.baseSkill)}`,e.isAttacking?`+ Attacke ${ie(l)}`:null,`+ S-Form ${ie(a)}`,`+ R-Form ${ie(s)}`,`+ T-Form ${ie(e.dailyForm)}`,`+ Zufällige Form ${ie(d)} (skaliert)`,`+ Teambonus ${ie(o)}`,`- Fatigue ${ie(r)}`,`- Langzeit ${ie(n)}`,`- Akut ${ie(i)}`,`- Stamina ${ie(m)}`,`- HM ${ie(f)}`,`= Effektiv ${ie(e.effectiveSkill)}`].filter(g=>g!=null)}function cu(e,t){return Ai(e,t).join(`
`)}function uu(e){return Yt(Math.max(-2.5,Math.min(2.5,e*2.5)))}function mu(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function Bi(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${Y(e.riderName)}">${Y(e.riderName)}</button>`}function pu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const s=t.get(e.activeTeamId)??"—",r=a.get(e.activeTeamId)??s;return`<span class="race-sim-team-code" title="${Y(r)}">${Y(s)}</span>`}function _i(e){return`/jersey/Jer_${e}.png`}function gu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const s=t.get(e.activeTeamId);if(!s)return"—";const r=a.get(e.activeTeamId)??s.name,n=_i(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${Y(r)}">
      <img
        class="race-sim-team-jersey-img"
        src="${Y(n)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function fu(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function hu(e,t,a,s){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=s.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const r=e.splitTimes[t];return r!=null?kt(r):"—"}function Gi(e,t,a){const s=Ai(e,t),r=[{label:"Terrain / Skill",value:`${Fi(e.activeTerrain)} / ${Jc(e.skillName)}`},{label:"Aktiver Abschnitt",value:Ri(e)},{label:"Segmenthöhe",value:Zc(e)},{label:"Basis",value:ie(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${ie(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:Yt((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:Yt((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:ms((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:ms((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:ms((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:ie(e.staminaPenalty)},{label:"HM",value:ie(e.elevationPenalty)},{label:"T-Form",value:Yt(e.dailyForm)},{label:"Zufall",value:uu(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:mu(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?wi(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${Y(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${Y(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${r.map(n=>`<div class="race-sim-rider-detail-item"><span>${Y(n.label)}</span><strong>${Y(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${s.map(n=>Y(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${Y(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function bu(e,t,a,s,r,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const d=document.createElement("div");d.className="race-sim-row-grid",o.appendChild(d);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",d.appendChild(l);const p=document.createElement("span");p.className="race-sim-row-flag",p.innerHTML=t?al(Xc(t)):"—",d.appendChild(p);const u=document.createElement("span");u.className="race-sim-row-name",u.innerHTML=Bi(e,a),d.appendChild(u);const m=u.querySelector(".race-sim-row-name-btn");if(!m)throw new Error("race-sim-row-name-btn not found");const f=document.createElement("span");f.className="race-sim-row-team-visual",f.innerHTML=gu(t,r,i),d.appendChild(f);const g=document.createElement("strong");g.className="race-sim-row-team",g.innerHTML=pu(t,n,i),d.appendChild(g);const b=(P="")=>{const D=document.createElement("strong");return P&&(D.className=P),d.appendChild(D),D},y=b("race-sim-gap"),v=b("race-sim-cell-effective-skill"),T=b(),w=b(),x=b(),$=s.map(()=>b()),R=b(),I=b(),C=b("race-sim-form-state-cell"),F=document.createElement("div");return F.className="race-sim-row-detail-popover hidden",o.appendChild(F),{row:o,rankField:l,nameButton:m,gapField:y,clockField:x,splitFields:$,effectiveSkillField:v,gcRankField:T,gcGapField:w,gradientPercentField:R,speedField:I,formStateField:C,detailPanel:F,initialized:!1,lastValues:{}}}function yu(e,t,a,s,r,n,i,o,d,l,p){const u=(s==null?void 0:s.formBonus)??0,m=(s==null?void 0:s.raceFormBonus)??0,f=d&&l>1?p.get(a.riderId)??null:null,g=Me(a),b=i!=="ITT"&&i!=="TTT"?g?"DNF":"—":a.hasStarted?g?"DNF":a.riderClockSeconds!=null?kt(a.riderClockSeconds):"—":Mi(a.startOffsetSeconds);ka(e.row,`race-sim-row${t===1&&!g?" race-sim-row-leader":""}${r?" race-sim-row-detail-open":""}${g?" race-sim-row-dnf":""}`),qe(e.rankField,`${t}.`),qe(e.gapField,g?"DNF":xi(a.gapToLeaderMeters)),qe(e.clockField,b),e.nameButton.setAttribute("aria-expanded",r?"true":"false"),ka(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),Sa(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((w,x)=>{const $=e.splitFields[x];if(!$)return;const R=hu(a,w.key,i,o);qe($,R),Sa($,w.label)}),$a(e,"effectiveSkillValue",a.effectiveSkill)&&(qe(e.effectiveSkillField,ie(a.effectiveSkill)),Ta(e,"effectiveSkillValue",a.effectiveSkill));const y=`race-sim-cell-effective-skill ${Ei(a)}`;$a(e,"effectiveSkillClass",y)&&(ka(e.effectiveSkillField,y),Ta(e,"effectiveSkillClass",y));const v=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,u,m,a.dailyForm,a.microForm,(s==null?void 0:s.fatigueMalus)??0,(s==null?void 0:s.longTermFatigueMalus)??0,(s==null?void 0:s.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");$a(e,"effectiveSkillTitleKey",v)&&(Sa(e.effectiveSkillField,cu(a,s)),Ta(e,"effectiveSkillTitleKey",v)),qe(e.gcRankField,f?String(f.rank):"—"),qe(e.gcGapField,f?wi(f.gapSeconds):"—"),qe(e.gradientPercentField,Yc(a.gradientPercent)),ka(e.gradientPercentField,qc(a.gradientPercent)),Sa(e.gradientPercentField,`${Fi(a.activeTerrain)} · ${Ri(a)}`),qe(e.speedField,Us(a.currentSpeedMps)),e.formStateField.innerHTML=fu(a);const T=[r?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,u,m,(s==null?void 0:s.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(f==null?void 0:f.rank)??"—",(f==null?void 0:f.gapSeconds)??"—",a.skillBreakdown].join("|");$a(e,"detailKey",T)&&(e.detailPanel.innerHTML=r?Gi(a,s,f):"",e.detailPanel.classList.toggle("hidden",!r),Ta(e,"detailKey",T)),e.detailPanel.classList.toggle("hidden",!r),e.initialized=!0}function vu(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${Y(e.name)}">${Y(e.name)}</button>`}function Su(e){const t=_i(e.id);return`
    <span class="race-sim-team-visual" title="${Y(e.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${Y(t)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function ku(e,t,a){const s=new Map;for(const r of e.riders){const n=a.get(r.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=s.get(i)??[];o.push(r),s.set(i,o)}return t.teams.filter(r=>s.has(r.id)).map(r=>{const n=(s.get(r.id)??[]).slice().sort((p,u)=>u.effectiveSkill-p.effectiveSkill||p.riderId-u.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),d=n.slice(0,o).reduce((p,u)=>p+u.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:r,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,d-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(p=>p.isFinished).length}}).sort((r,n)=>Di(r.representative,n.representative,Ci(t))||r.team.id-n.team.id)}function $u(e,t,a,s,r){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${Y(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${Y(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${Y(ie(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${Y(Us(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${Y(e.teamClockSeconds!=null?kt(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${Y(Rs(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&s>1?t.gcByRiderId.get(n.riderId)??null:null,d=r===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${Bi(n,d)}
                <strong>${Y(ie(n.effectiveSkill))}</strong>
                <span>${Y(n.riderClockSeconds!=null?kt(n.riderClockSeconds):"—")}</span>
              </div>
              ${d?Gi(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function Tu(e,t,a){var f,g;const s=performance.now(),r=Pi(a),n=r.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(b=>({label:b.key,displayLabel:b.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(f=Ve.get(e))==null?void 0:f.layoutKey,d=Li(e,i),l=Ve.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==d&&(e.innerHTML="");const p=ku(t,a,r.riderById),u=((g=p[0])==null?void 0:g.teamDistanceMeters)??0;return e.innerHTML=p.map((b,y)=>{const v=l.openTeamId===b.team.id;return`
      <article class="race-sim-row${y===0?" race-sim-row-leader":""}${v?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${y+1}.</strong>
          <span class="race-sim-row-name">${vu(b.team,v)}</span>
          <span class="race-sim-row-team-visual">${Su(b.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${Y(b.team.name)}">${Y(b.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${Y(xi(Math.max(0,u-b.teamDistanceMeters)))}</strong>
          <strong>${Y(b.teamClockSeconds!=null?kt(b.teamClockSeconds):Mi(b.representative.startOffsetSeconds))}</strong>
          ${n.map(T=>`<strong>${Y(b.splitTimes[T.key]!=null?kt(b.splitTimes[T.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${Ei(b.representative)}">${Y(ie(b.teamEffectiveSkill))}</strong>
          <strong>${Y(Us(b.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${v?"":" hidden"}">${v?$u(b,r,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),Ve.set(e,{layoutKey:d,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-s,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:p.length,rowsCreated:p.length,rowsRemoved:0,rowsUpdated:p.length,rowsSkippedInvisible:0,orderChanged:1}}function pn(e,t,a){if(a.stage.profile==="TTT")return Tu(e,t,a);const s=performance.now(),r={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=Pi(a),{splitMarkers:o}=i,d=Qc(t),l=Ys(e),p=l.showSplitColumns?o:[],u=Ve.get(e);r.prepMs=performance.now()-n;const m=performance.now(),f=ou(t.riders,a,o,d,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(u==null?void 0:u.orderedRiderIds)??[]);r.sortMs=performance.now()-m;const g=u==null?void 0:u.layoutKey,b=performance.now(),y=Li(e,Ni(a,p,l.showSplitColumns));r.layoutMs=performance.now()-b;const v=Ve.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};g!=null&&g!==y&&(e.innerHTML="",v.rowsByRiderId.clear(),v.orderedRiderIds=[]);const T=f.map(F=>F.riderId),w=new Set(T),x=performance.now();for(const[F,P]of v.rowsByRiderId)w.has(F)||(P.row.remove(),v.rowsByRiderId.delete(F),r.rowsRemoved+=1);r.removeRowsMs=performance.now()-x;const $=performance.now();for(let F=0;F<f.length;F+=1){const P=f[F],D=i.riderById.get(P.riderId)??null;let _=v.rowsByRiderId.get(P.riderId);_||(_=bu(P,D,v.openDetailRiderId===P.riderId,p,i.teamById,i.teamAbbreviationById,i.teamNameById),v.rowsByRiderId.set(P.riderId,_),r.rowsCreated+=1)}r.createRowsMs=performance.now()-$;const R=performance.now(),I=v.orderedRiderIds.length===T.length&&v.orderedRiderIds.every((F,P)=>F===T[P]);r.orderCheckMs=performance.now()-R;const C=performance.now();if(!I){const F=document.createDocumentFragment();for(const P of T){const D=v.rowsByRiderId.get(P);D&&F.appendChild(D.row)}e.replaceChildren(F),r.orderChanged=1}r.reorderMs=performance.now()-C;for(let F=0;F<f.length;F+=1){const P=f[F],D=v.rowsByRiderId.get(P.riderId),_=i.riderById.get(P.riderId)??null;if(!D)continue;const B=performance.now();yu(D,F+1,P,_,v.openDetailRiderId===P.riderId,p,a.stage.profile,d,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),r.updateRowsMs+=performance.now()-B,r.rowsUpdated+=1}return Ve.set(e,{layoutKey:y,orderedRiderIds:T,rowsByRiderId:v.rowsByRiderId,openDetailRiderId:v.openDetailRiderId,openTeamId:v.openTeamId}),r.finalizeMs=performance.now()-(s+r.prepMs+r.sortMs+r.layoutMs+r.removeRowsMs+r.createRowsMs+r.orderCheckMs+r.reorderMs+r.visibilityMs+r.updateRowsMs),r.totalMs=performance.now()-s,r.finalizeMs=Math.max(0,r.totalMs-r.prepMs-r.sortMs-r.layoutMs-r.removeRowsMs-r.createRowsMs-r.orderCheckMs-r.reorderMs-r.visibilityMs-r.updateRowsMs),r}const xu=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],Mu=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],Hi=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],zi=["Sprint","4","3","2","1","HC"],Ka=.2,wu=7,Ru=100,Iu=3,Fu=50,Eu=-2,Cu=1,Nu=2.5,Pu=-3,Lu=15,Du=200,Au=600,Bu=850;function Ce(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function Wa(e){return e==="finish_hill"||e==="finish_mountain"}function ja(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function Zs(e,t){return e==="climb_top"||Wa(e)&&ja(t)}function ra(e){return Math.round(e*10)/10}function Be(e){return Number(e.toFixed(2))}function ft(e){return`${e.toFixed(2).replace(".",",")} km`}function Ki(e){return`${Math.round(e)} hm`}function _u(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function Js(e){return xu.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function Gu(e){return Mu.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function Hu(e,t="start",a=0,s=1){const r=Hi.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:Ce(i)?a===s-1:i==="climb_top"||i==="sprint_intermediate");return(r.includes(e)?r:[e,...r.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${S(i)}</option>`).join("")}function zu(e){return['<option value="">–</option>',...zi.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`)].join("")}function gn(e){return Hi.indexOf(e)}function _e(e){return[...e].sort((t,a)=>gn(t.type)-gn(a.type))}function Qt(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:_e(e[0].markers)}];let a=0;return e.forEach(s=>{a=Be(a+s.lengthKm);const r=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),n=t[t.length-1];n.terrain=s.terrain,n.techLevel=s.techLevel,n.windExp=s.windExp,n.markers=_e([...n.markers,...s.markers]),t.push({kmMark:a,elevation:r,terrain:s.terrain,techLevel:s.techLevel,windExp:s.windExp,markers:_e(s.endMarkers)})}),t}function Ku(e){return e?" stage-editor-input-invalid":""}function qs(e,t){const a=e.segments[t];if(!a)return[];const s=[],r=Wu(e).get(t)??[];return a.lengthKm<Ka&&s.push(`Laenge unter ${Ka.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&s.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&s.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&s.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>Ce(n.type))&&s.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&s.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>Ce(n.type))&&s.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{Ce(n.type)&&s.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&s.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&s.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&s.push(`${n.type} gehoert in den Startmarker-Slot.`),Zs(n.type,n.cat)&&!ja(n.cat)&&s.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&s.push("Sprintmarker erlaubt nur Kategorie Sprint."),Ce(n.type)&&!Wa(n.type)&&n.cat!=null&&s.push("finish_flat und finish_TT duerfen keine Kategorie haben."),Wa(n.type)&&n.cat!=null&&!ja(n.cat)&&s.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),s.push(...r),[...new Set(s)]}function Wu(e){const t=new Map,a=[],s=(r,n)=>{const i=t.get(r)??[];i.push(n),t.set(r,i)};return e.segments.forEach((r,n)=>{r.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),r.endMarkers.forEach(i=>{var l;if(!Zs(i.type,i.cat))return;if(!i.name){s(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let p=a.length-1;p>=0;p-=1)if(((l=a[p])==null?void 0:l.name)===i.name){o=p;break}const d=o>=0?o:a.length-1;if(d<0){s(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(d,1)})}),a.forEach(r=>{const n=r.name?` "${r.name}"`:"";s(r.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function ju(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:Wa(e.type)?{...e,cat:ja(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function Wi(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:Ou(e.waypoints??[])).map(s=>({...s,startElevation:Math.round(s.startElevation),lengthKm:Number.isFinite(s.lengthKm)?Be(s.lengthKm):Ka,gradientPercent:Number.isFinite(s.gradientPercent)?ra(s.gradientPercent):0,techLevel:Number.isFinite(s.techLevel)?s.techLevel:5,windExp:Number.isFinite(s.windExp)?s.windExp:5,markers:fn(s.markers),endMarkers:fn(s.endMarkers)})),waypoints:[]};return ut(t),t}function Ou(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const s=e[a],r=e[a+1],n=Be(r.kmMark-s.kmMark),i=r.elevation-s.elevation,o=ra(n>0?i/(n*10):0);t.push({startElevation:s.elevation,lengthKm:n,gradientPercent:o,techLevel:s.techLevel??5,windExp:s.windExp??5,terrain:s.terrain??"Flat",markers:s.markers??[],endMarkers:r.markers??[]})}return t}function fn(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function Vu(e,t,a){const s=e*a*8+t/12;return s>=95?"HC":s>=68?"1":s>=46?"2":s>=28?"3":"4"}function hn(e){const t=[];let a=null,s=null,r=0;const n=i=>{if(a==null||i==null||i<=a){a=null,s=null,r=0;return}const o=e[a],d=e[i],l=d.kmMark-o.kmMark,p=Math.max(0,d.elevation-o.elevation),u=l>0?p/(l*10):0;p>=Ru&&u>=Iu&&t.push({startKm:Be(o.kmMark),endKm:Be(d.kmMark),distanceKm:Be(l),gainMeters:Math.round(p),avgGradient:ra(u),category:Vu(l,p,u),startIndex:a,topIndex:i,topElevation:Math.round(d.elevation)}),a=null,s=null,r=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],d=e[i],l=d.elevation-o.elevation;if(a==null&&l>0){a=i-1,s=i,r=0;continue}if(a!=null){if(l>=0){(s==null||d.elevation>=e[s].elevation)&&(s=i),r=0;continue}r+=Math.abs(l),r>=Fu&&n(s)}}return n(s),t}function Uu(e){const t=e.segments.some(r=>r.terrain==="Cobble_Hill"),a=e.segments.some(r=>r.terrain==="Cobble"),s=e.climbs.some(r=>r.category==="HC"||r.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":s&&e.elevationGainMeters>=2800?"High_Mountain":s||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function xa(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function Yu(e){return e.gainMeters>=Au&&e.topElevation>=Bu?"Mountain":e.gainMeters>Du?"Medium_Mountain":"Hill"}function Zu(e){return e.gradientPercent<Pu?"Abfahrt":e.gradientPercent<Nu||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<Lu?"Flat":"Hill"}function Ju(e){if(e.segments.length===0)return;if(e.waypoints=Qt(e.segments),e.sourceFormat==="csv"){const i=hn(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:d,topElevation:l,...p})=>p);return}const t=e.segments.map(i=>i.manualTerrain||xa(i.terrain)?i.terrain:Zu(i)),a=hn(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:d,...l})=>l),a.forEach(i=>{const o=Yu(i);if(o)for(let d=i.startIndex;d<i.topIndex;d+=1)e.segments[d].manualTerrain||xa(t[d])||(t[d]=o)});let s=null,r=0;const n=i=>{if(s==null||r<=Cu){s=null,r=0;return}for(let o=s;o<i;o+=1)!(e.segments[o].manualTerrain||xa(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");s=null,r=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<Eu){s==null&&(s=i),r+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{xa(i.terrain)||(i.terrain=t[o])}),e.waypoints=Qt(e.segments),e.suggestedProfile=Uu(e)}function ut(e){qu(e),bn(e),Ju(e),e.waypoints=Qt(e.segments),bn(e)}function qu(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,s)=>{const r={...a,startElevation:Math.round(s===0?a.startElevation:t),lengthKm:Be(a.lengthKm),gradientPercent:ra(a.gradientPercent),markers:_e(a.markers),endMarkers:_e(a.endMarkers)};return t=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),r}),e.waypoints=Qt(e.segments)}function bn(e){e.totalDistanceKm=Be(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,s)=>{if(s===0)return 0;const r=a.elevation-e.waypoints[s-1].elevation;return t+Math.max(0,r)},0)}function st(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(s=>s.type==="start")||(t.markers=_e([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(s=>Ce(s.type))||(a.endMarkers=_e([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=Qt(e.segments))}function Xu(e,t,a,s){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((r,n)=>{const i=s==="start"&&t===0&&r.type==="start",o=e.filter(p=>Ce(p.type)).length,d=s==="end"&&t===a-1&&Ce(r.type)&&o===1,l=!(i||d);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${s}" data-marker-index="${n}">${Hu(r.type,s,t,a)}</select>
        <input type="text" value="${S(r.name??"")}" data-field="markerName" data-marker-scope="${s}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${s}" data-marker-index="${n}">${zu(r.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${s}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function yn(e,t,a,s){const r=s==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${Xu(e,t,a,s)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${s}" data-segment-index="${t}">${r}</button>
    </div>`}function Qu(e,t,a,s,r){if(!c.stageEditorDraft)return;const n=c.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(s==="markerType"){o.type=r;const d=ju(o);if(o.name=d.name,o.cat=d.cat,Ce(o.type)){const l=i.filter((p,u)=>u===t||!Ce(p.type));a==="start"?n.markers=l:n.endMarkers=l}}else s==="markerName"?o.name=r.trim()||null:s==="markerCat"&&(o.cat=r||null);a==="start"?n.markers=_e(n.markers):n.endMarkers=_e(n.endMarkers),ut(c.stageEditorDraft),st(c.stageEditorDraft),de()}}function em(e,t){if(!c.stageEditorDraft)return;const a=c.stageEditorDraft.segments[e];if(!a)return;const s=t==="start"?e===0&&!a.markers.some(r=>r.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===c.stageEditorDraft.segments.length-1&&!a.endMarkers.some(r=>Ce(r.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(s),a.markers=_e(a.markers)):(a.endMarkers.push(s),a.endMarkers=_e(a.endMarkers)),ut(c.stageEditorDraft),st(c.stageEditorDraft),de()}function tm(e,t,a){if(!c.stageEditorDraft)return;const s=c.stageEditorDraft.segments[e];s&&(a==="start"?s.markers.splice(t,1):s.endMarkers.splice(t,1),ut(c.stageEditorDraft),st(c.stageEditorDraft),de())}let Et=0,Ct=0;async function am(){h("stage-editor-profile").innerHTML=Js("Flat"),h("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',h("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([H.listStageEditorCountries(),H.listStageEditorRaceCategories(),H.listStageEditorRacePrograms()]);if(e.success&&e.data){const s=h("stage-editor-race-country");s.innerHTML=e.data.map(r=>`<option value="${r.id}">${S(r.name)} (${S(r.code3)})</option>`).join("")}if(t.success&&t.data){const s=h("stage-editor-race-category");s.innerHTML=t.data.map(r=>`<option value="${r.id}">${S(r.name)}</option>`).join("")}a.success&&a.data&&(c.stageEditorPrograms=a.data,sm())}function sm(){const e=h("stage-editor-programs-list");c.stageEditorPrograms&&(e.innerHTML=c.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${S(t.name)}</span>
      </label>
    `).join(""))}function rm(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=h("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(s=>{var n;const r=(n=c.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===s.value);return r?r.name:s.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function Xs(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function ji(){const e=c.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function nm(){const e=[...c.stageEditorExistingStages.map(t=>t.raceId),...c.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function im(e,t){let a=e;const s=new Set(c.stageEditorExistingStages.map(r=>r.stageId));for(;a>0&&s.has(a);)a+=t;if(a<=0)for(a=1;s.has(a);)a+=1;return a}function om(e,t){let a=e;const s=new Set([...c.stageEditorExistingStages.map(r=>r.raceId),...c.races.map(r=>r.id)]);for(;a>0&&s.has(a);)a+=t;if(a<=0)for(a=1;s.has(a);)a+=1;return a}function lm(e){var o;const t=h("stage-editor-profile");t.innerHTML=Js(e.suggestedProfile),t.value=e.suggestedProfile;const a=ji(),s=nm();h("stage-editor-stage-id").value=String(a),h("stage-editor-race-id").value=String(s),Et=a,Ct=s;const r=h("stage-editor-details-file");r.value.trim()||(r.value=`${_u(e.routeName)}.csv`);const n=h("stage-editor-date");!n.value&&((o=c.gameState)!=null&&o.currentDate)&&(n.value=c.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(d=>{d.checked=!0})}function dm(e){h("stage-editor-stage-id").value=String(e.stageId),h("stage-editor-race-id").value=String(e.raceId),Et=e.stageId,Ct=e.raceId,h("stage-editor-stage-number").value=String(e.stageNumber),h("stage-editor-date").value=e.date,h("stage-editor-details-file").value=e.detailsCsvFile;const t=h("stage-editor-profile");t.innerHTML=Js(e.profile),t.value=e.profile,h("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),h("stage-editor-final-push-start").value=String(e.finalPushStartPercent),h("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),h("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),h("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(r=>r.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(r=>{r.checked=a.includes(r.value)})}function Oi(e){var s;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((s=e.segments[0])!=null&&s.markers.some(r=>r.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(r=>Ce(r.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((r,n)=>{qs(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...r.markers??[],...r.endMarkers??[]].forEach(i=>{i.cat!=null&&!zi.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function Vi(){const e=[],t=Number(h("stage-editor-stage-id").value),a=Number(h("stage-editor-race-id").value),s=Number(h("stage-editor-stage-number").value),r=h("stage-editor-date").value.trim(),n=h("stage-editor-details-file").value.trim(),i=Number(h("stage-editor-final-spread-start").value),o=Number(h("stage-editor-final-push-start").value),d=Number(h("stage-editor-final-spread-difficulty").value),l=Number(h("stage-editor-crash-multiplier").value),p=Number(h("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(s)||s<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(r)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(d)||d<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(p)||p<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),c.stageEditorExistingStages.map(y=>y.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const f=h("stage-editor-new-race-checkbox").checked,g=[...c.stageEditorExistingStages.map(y=>y.raceId),...c.races.map(y=>y.id)];if(f){g.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const y=h("stage-editor-race-name").value.trim(),v=Number(h("stage-editor-race-country").value),T=Number(h("stage-editor-race-category").value),w=Number(h("stage-editor-race-num-stages").value),x=h("stage-editor-race-start-date").value.trim(),$=h("stage-editor-race-end-date").value.trim(),R=Number(h("stage-editor-race-prestige").value);y||e.push("Rennname fehlt."),(!Number.isInteger(v)||v<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger(T)||T<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(w)||w<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(x)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test($)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(R)||R<1||R>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else g.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return h("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function cm(){var a,s;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(r=>r.value).join("|");return{stageId:Number(h("stage-editor-stage-id").value),raceId:Number(h("stage-editor-race-id").value),stageNumber:Number(h("stage-editor-stage-number").value),date:h("stage-editor-date").value.trim(),profile:h("stage-editor-profile").value,detailsCsvFile:h("stage-editor-details-file").value.trim(),startElevation:((s=(a=c.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:s.startElevation)??0,finalSpreadStartPercent:Number(h("stage-editor-final-spread-start").value),finalPushStartPercent:Number(h("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(h("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(h("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(h("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function um(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function mm(e){return["gainMeters","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function Qa(e,t,a){const r=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-r*118),i=54,o=.14+r*.12,d=.26+r*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${d};`}">${Math.round(e)}</span>`}function Qs(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),s=Math.round(40-t*22),r=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${r};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function pm(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function gm(e,t,a,s){const r=s!=null?` data-stage-profile-open-climb-id="${S(s)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${r}>${e}</button>`}function fm(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",s=e.profileScore??e.score,r=[...c.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=r.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span class="text-right">${Qs(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${Qa(s,0,100)}
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
    </div>`}function hm(e){const t=r=>r!=null?`${r.toFixed(1).replace(".",",")} km`:"—",a=r=>r!=null?`${Math.round(r).toLocaleString("de-DE")} m`:"—",s=r=>r!=null?`${r.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${Qs(e.climbScore??0)}
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
    </div>`}function Ui(e,t,a,s,r,n,i,o){const d=o??Qa(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${gm(d,s,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${r}
      </div>
    </div>`}function oe(e,t,a,s,r){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?s==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${r}-sort="${t}">
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function Kt(){const e=h("stage-editor-stages-table"),t=h("stage-editor-stages-empty"),a=h("stage-editor-stages-meta"),s=e.querySelector("thead"),r=e.querySelector("tbody");if(!r)return;const n=c.stageEditorStagesSort.key,i=c.stageEditorStagesSort.direction;s&&(s.innerHTML=`<tr>
      ${oe("ID","stageId",n,i,"stages")}
      ${oe("Land","countryCode",n,i,"stages")}
      ${oe("Rennen","raceName",n,i,"stages")}
      ${oe("Etappe","stageNumber",n,i,"stages")}
      ${oe("Score","profileScore",n,i,"stages")}
      ${oe("Profil","profile",n,i,"stages")}
      ${oe("Distanz","distanceKm",n,i,"stages")}
      ${oe("Höhenmeter","elevationGainMeters",n,i,"stages")}
      ${oe("Sprints","sprintCount",n,i,"stages")}
      ${oe("Climbs","climbCount",n,i,"stages")}
    </tr>`);const o=ym(c.stageEditorStageRows);r.innerHTML=o.map(d=>`
    <tr>
      <td>${d.stageId}</td>
      <td>${ne(d.countryCode||"")}</td>
      <td><strong>${S(d.raceName)}</strong></td>
      <td><strong>${S(ia({stageNumber:d.stageNumber}))}</strong></td>
      <td>${Ui(d.profileScore,0,100,d.stageId,fm(d),ss({name:d.raceName},{stageNumber:d.stageNumber,profile:d.profile}))}</td>
      <td>${oa(d.profile)}</td>
      <td>${ft(d.distanceKm)}</td>
      <td>${Ki(d.elevationGainMeters)}</td>
      <td>${d.sprintCount} Sprints</td>
      <td>${d.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${c.stageEditorStageRows.length} vorhandene Etappen`}function Wt(){const e=h("stage-editor-climbs-table"),t=h("stage-editor-climbs-empty"),a=h("stage-editor-climbs-meta"),s=e.querySelector("thead"),r=e.querySelector("tbody");if(!r)return;const n=c.stageEditorClimbsSort.key,i=c.stageEditorClimbsSort.direction;s&&(s.innerHTML=`<tr>
      ${oe("km","placementKm",n,i,"climbs")}
      ${oe("Name","name",n,i,"climbs")}
      ${oe("Kat.","category",n,i,"climbs")}
      ${oe("Score","climbScore",n,i,"climbs")}
      ${oe("Land","countryCode",n,i,"climbs")}
      ${oe("Rennen","raceName",n,i,"climbs")}
      ${oe("Etappe","stageNumber",n,i,"climbs")}
      ${oe("Höhenmeter","gainMeters",n,i,"climbs")}
      ${oe("Distanz","distanceKm",n,i,"climbs")}
      ${oe("Ø Steigung","avgGradient",n,i,"climbs")}
      ${oe("Max Steigung","maxGradient",n,i,"climbs")}
    </tr>`);const o=vm(c.stageEditorClimbRows);r.innerHTML=o.map(d=>`
    <tr>
      <td>${d.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${S(d.name)}</strong></td>
      <td>${pm(d.category)}</td>
      <td>${Ui(d.climbScore,0,350,d.stageId,hm(d),ss({name:d.raceName},{stageNumber:d.stageNumber,profile:"Mountain"}),d.id,Qs(d.climbScore))}</td>
      <td>${ne(d.countryCode||"")}</td>
      <td><strong>${S(d.raceName)}</strong></td>
      <td><strong>${S(ia({stageNumber:d.stageNumber}))}</strong></td>
      <td>${Ki(d.gainMeters)}</td>
      <td>${ft(d.distanceKm)}</td>
      <td>${d.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${d.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${c.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function Yi(e=!1){if(c.stageEditorOverviewLoaded&&!e){Kt(),Wt();return}c.stageEditorOverviewLoading=!0,Kt(),Wt();const t=await H.getStageEditorOverview();if(c.stageEditorOverviewLoading=!1,c.stageEditorOverviewLoaded=!0,!t.success||!t.data){c.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),Kt(),Wt();return}c.stageEditorStageRows=t.data.stages,c.stageEditorClimbRows=t.data.climbs,Kt(),Wt()}async function bm(e=!1){const t=h("stage-editor-existing-stage-wrap");if(c.stageEditorExistingStagesLoaded&&!e){Is();return}t.classList.add("loading");const a=h("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const s=await H.listStageEditorStages();if(t.classList.remove("loading"),c.stageEditorExistingStagesLoaded=!0,!s.success||!s.data){c.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}c.stageEditorExistingStages=s.data.stages,Is()}function Is(){const e=h("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+c.stageEditorExistingStages.map(a=>{const s=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${S(a.raceName)} · Etappe ${a.stageNumber}${s}</option>`}).join("")}function ym(e){const t=c.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{let r=0;switch(c.stageEditorStagesSort.key){case"stageId":r=a.stageId-s.stageId;break;case"countryCode":r=(a.countryCode||"").localeCompare(s.countryCode||"","de");break;case"raceName":r=a.raceName.localeCompare(s.raceName,"de");break;case"stageNumber":r=a.stageNumber-s.stageNumber;break;case"profile":r=a.profile.localeCompare(s.profile,"de");break;case"distanceKm":r=a.distanceKm-s.distanceKm;break;case"elevationGainMeters":r=a.elevationGainMeters-s.elevationGainMeters;break;case"sprintCount":r=a.sprintCount-s.sprintCount;break;case"climbCount":r=a.climbCount-s.climbCount;break;case"profileScore":r=a.profileScore-s.profileScore;break}return r*t||a.stageId-s.stageId})}function vm(e){const t=c.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{let r=0;switch(c.stageEditorClimbsSort.key){case"placementKm":r=a.placementKm-s.placementKm;break;case"name":r=a.name.localeCompare(s.name,"de");break;case"category":r=(a.category??"").localeCompare(s.category??"","de");break;case"countryCode":r=(a.countryCode||"").localeCompare(s.countryCode||"","de");break;case"raceName":r=a.raceName.localeCompare(s.raceName,"de");break;case"stageNumber":r=a.stageNumber-s.stageNumber;break;case"gainMeters":r=a.gainMeters-s.gainMeters;break;case"distanceKm":r=a.distanceKm-s.distanceKm;break;case"avgGradient":r=a.avgGradient-s.avgGradient;break;case"maxGradient":r=a.maxGradient-s.maxGradient;break;case"climbScore":r=a.climbScore-s.climbScore;break}return r*t||a.placementKm-s.placementKm})}function Sm(e){return e.map(t=>t.type).join(" | ")}function km(e){const t=[],a=[];let s=0;return e.segments.forEach((r,n)=>{const i=s,o=Be(i+r.lengthKm),d=Xs(r);r.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:r.startElevation})}),r.endMarkers.forEach(l=>{if(Zs(l.type,l.cat)&&l.name){let p=-1;for(let u=a.length-1;u>=0;u--)if(a[u].name===l.name){p=u;break}if(p>=0){const u=a[p];a.splice(p,1);const m=Be(o-u.startKm),f=Math.max(0,d-u.startElevation),g=m>0?ra(f/(m*10)):0;t.push({name:l.name,startKm:u.startKm,endKm:o,distanceKm:m,gainMeters:f,avgGradient:g,category:l.cat||"4"})}}}),s=o}),t}function $m(e){const t=[];let a=0;return e.segments.forEach(s=>{const r=Be(a+s.lengthKm);s.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:r})}),a=r}),t}function de(){Is();const e=c.stageEditorDraft,t=h("stage-editor-import-summary"),a=h("stage-editor-warnings"),s=h("stage-editor-climbs"),r=h("stage-editor-empty"),n=h("stage-editor-chart"),i=h("stage-editor-waypoints-body"),o=h("stage-editor-export-hint"),d=h("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",s.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',r.classList.remove("hidden"),n.innerHTML=vn(null),i.innerHTML=`<tr><td colspan="${wu}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",d.disabled=!0;return}r.classList.add("hidden");const l=Oi(e),p=Vi(),u=document.getElementById("stage-editor-profile"),m=u&&u.value?u.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${S(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${ft(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${S(m)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const f=[...e.warnings,...l,...p];a.innerHTML=f.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':f.map(v=>`<div class="stage-editor-alert">${S(v)}</div>`).join("");const g=km(e),b=$m(e);let y="";g.length>0?y+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (${g.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${g.map(v=>`
          <div class="stage-editor-climb" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="color: #fff; font-size: 0.85rem;">${S(v.name)}</strong>
              <span class="stage-editor-climb-category-badge ${v.category==="HC"?"is-hc":`is-cat-${v.category}`}" style="font-size: 0.7rem; padding: 0.1rem 0.35rem;">
                Kat. ${S(v.category)}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-300); display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span>${ft(v.startKm)} - ${ft(v.endKm)}</span>
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
    `:y+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Bergwertungen definiert (climb_start und climb_top Marker mit gleichem Namen paaren).</p>
    `,b.length>0?y+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (${b.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${b.map(v=>`
          <div class="stage-editor-sprint" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--success); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.85rem;">${S(v.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-300); font-weight: bold;">
              ${ft(v.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:y+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `,s.innerHTML=y,n.innerHTML=vn(e),i.innerHTML=e.segments.map((v,T)=>`
    <tr data-segment-index="${T}" class="${qs(e,T).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${T+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${v.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${Ku(v.lengthKm<Ka)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${v.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${Gu(v.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${yn(v.markers,T,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${yn(v.endMarkers,T,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div class="text-muted" style="min-width:3.5rem;">${Xs(v)} m</div>
          ${Tm(e,T)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${T}">+</button>
          ${T===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${T}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${T}">✕</button>`:""}
        </div>
      </td>
    </tr>`).join(""),d.disabled=f.length>0,o.textContent=f.length>0?`${f.length} Validierungshinweise vor dem Export.`:`Exportiert ${h("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function Tm(e,t){const a=qs(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(s=>`<div>${S(s)}</div>`).join("")}</div>`}function vn(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,s=24,r=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(g=>g.elevation)),d=Math.max(...n.map(g=>g.elevation)),l=Math.max(1,d-o),p=n.map(g=>{const b=s+g.kmMark/Math.max(i,.1)*(t-s*2),y=a-r-(g.elevation-o)/l*(a-r*2);return{x:b,y,waypoint:g}}),u=p.map((g,b)=>`${b===0?"M":"L"} ${g.x.toFixed(1)} ${g.y.toFixed(1)}`).join(" "),m=`${u} L ${(t-s).toFixed(1)} ${(a-r).toFixed(1)} L ${s.toFixed(1)} ${(a-r).toFixed(1)} Z`,f=p.filter(g=>g.waypoint.markers.length>0).map(g=>`
      <line x1="${g.x.toFixed(1)}" y1="${r}" x2="${g.x.toFixed(1)}" y2="${(a-r).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${g.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${S(Sm(g.waypoint.markers))}</text>`).join("");return`
    <svg viewBox="0 0 ${t} ${a}" role="img" aria-label="Stage-Profil ${S(e.routeName)}">
      <defs>
        <linearGradient id="stage-editor-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(96, 165, 250, 0.38)"></stop>
          <stop offset="100%" stop-color="rgba(14, 165, 233, 0.04)"></stop>
        </linearGradient>
      </defs>
      <line x1="${s}" y1="${a-r}" x2="${t-s}" y2="${a-r}" class="stage-editor-chart-axis" />
      <line x1="${s}" y1="${r}" x2="${s}" y2="${a-r}" class="stage-editor-chart-axis" />
      ${f}
      <path d="${m}" fill="url(#stage-editor-area)"></path>
      <path d="${u}" class="stage-editor-chart-line"></path>
      ${p.map(g=>`<circle cx="${g.x.toFixed(1)}" cy="${g.y.toFixed(1)}" r="3.5" class="stage-editor-chart-point"></circle>`).join("")}
      <text x="${s}" y="${r-4}" class="stage-editor-chart-scale">${Math.round(d)} m</text>
      <text x="${s}" y="${a-4}" class="stage-editor-chart-scale">${Math.round(o)} m</text>
      <text x="${t-s}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${ft(i)}</text>
    </svg>`}function xm(e,t,a){const s=c.stageEditorDraft;if(!s)return;const r=s.segments[e];r&&(t==="startElevation"?r.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?r.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?r.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(r.terrain=a,r.manualTerrain=!0):t==="techLevel"?r.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(r.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),ut(s),st(s),de())}function Mm(e){const t=c.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const s={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,s),ut(t),st(t),de()}function wm(){const e=c.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],s={startElevation:t?Xs(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(s),ut(e),st(e),de()}function Rm(e){const t=c.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),ut(t),st(t),de()))}async function Im(){var a;const t=(a=h("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}h("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,ve("Route wird importiert……");try{const s=await t.text(),r=await H.importStageRoute({fileName:t.name,fileContent:s});if(!r.success||!r.data){alert(`Import fehlgeschlagen: ${r.error??"Unbekannter Fehler"}`);return}const n=Wi(r.data);c.stageEditorDraft=n,st(n),lm(n),de(),Tt("stage-editor")}finally{ge()}}async function Fm(){const e=Number(h("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}ve("CSV-Stage wird geladen...");try{const t=await H.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=Wi(t.data.draft);c.stageEditorDraft=a,st(a),dm(t.data.metadata),de(),Tt("stage-editor")}finally{ge()}}async function Em(){if(!c.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...Oi(c.stageEditorDraft),...Vi()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),de();return}const t=h("stage-editor-new-race-checkbox").checked,a=h("stage-editor-program-checkbox").checked;let s;t&&(s={name:h("stage-editor-race-name").value.trim(),countryId:Number(h("stage-editor-race-country").value),categoryId:Number(h("stage-editor-race-category").value),isStageRace:Number(h("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(h("stage-editor-race-num-stages").value),startDate:h("stage-editor-race-start-date").value.trim(),endDate:h("stage-editor-race-end-date").value.trim(),prestige:Number(h("stage-editor-race-prestige").value)});let r;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');r=Array.from(n).map(i=>Number(i.value))}ve("CSV-Dateien werden erstellt……");try{const n=await H.exportStageRoute({metadata:cm(),draft:c.stageEditorDraft,newRace:t,raceDetails:s,updatePrograms:a,programIds:r});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}xs(n.data.stagesFileName,n.data.stagesCsv),xs(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=h("stage-editor-stage-number"),o=Number(i.value)||1;i.value=String(o+1);const d=h("stage-editor-date"),l=d.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(l)){const y=new Date(l);y.setDate(y.getDate()+1);const v=y.getFullYear(),T=String(y.getMonth()+1).padStart(2,"0"),w=String(y.getDate()).padStart(2,"0");d.value=`${v}-${T}-${w}`}await Promise.all([Yi(!0),bm(!0)]);const p=ji();h("stage-editor-stage-id").value=String(p),Et=p;const u=h("stage-editor-new-race-checkbox");u&&(u.checked=!1);const m=h("stage-editor-new-race-details");m&&(m.classList.add("hidden"),m.style.display="none");const f=h("stage-editor-program-checkbox");f&&(f.checked=!1);const g=h("stage-editor-program-details");g&&(g.classList.add("hidden"),g.style.display="none"),Ct=Number(h("stage-editor-race-id").value),de()}finally{ge()}}function Cm(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",x=>{const $=x.target.closest("button[data-stage-editor-stages-sort]");if(!$)return;const R=$.dataset.stageEditorStagesSort;c.stageEditorStagesSort.key===R?c.stageEditorStagesSort.direction=c.stageEditorStagesSort.direction==="asc"?"desc":"asc":c.stageEditorStagesSort={key:R,direction:um(R)},Kt()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",x=>{const $=x.target.closest("button[data-stage-editor-climbs-sort]");if(!$)return;const R=$.dataset.stageEditorClimbsSort;c.stageEditorClimbsSort.key===R?c.stageEditorClimbsSort.direction=c.stageEditorClimbsSort.direction==="asc"?"desc":"asc":c.stageEditorClimbsSort={key:R,direction:mm(R)},Wt()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{Im()});const s=document.getElementById("btn-stage-editor-load-existing");s&&s.addEventListener("click",()=>{Fm()});const r=document.getElementById("btn-stage-editor-export");r&&r.addEventListener("click",()=>{Em()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",x=>{var R;const $=((R=x.target.files)==null?void 0:R[0])??null;h("stage-editor-file-hint").textContent=$?`${$.name} · ${($.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",x=>{const $=x.target,R=$.closest("tr[data-segment-index]"),I=$.dataset.field;if(!R||!I)return;const C=Number(R.dataset.segmentIndex);if(Number.isInteger(C)){if(I==="markerType"||I==="markerName"||I==="markerCat"){const F=Number($.dataset.markerIndex),P=$.dataset.markerScope;if(!Number.isInteger(F)||P!=="start"&&P!=="end")return;Qu(C,F,P,I,$.value);return}xm(C,I,$.value)}}),i.addEventListener("click",x=>{const $=x.target.closest("button[data-segment-action]");if(!$)return;const R=Number($.dataset.segmentIndex);if(Number.isInteger(R)){if($.dataset.segmentAction==="insert"){Mm(R);return}if($.dataset.segmentAction==="append"){wm();return}if($.dataset.segmentAction==="add-marker"){const I=$.dataset.markerScope;if(I!=="start"&&I!=="end")return;em(R,I);return}if($.dataset.segmentAction==="remove-marker"){const I=Number($.dataset.markerIndex),C=$.dataset.markerScope;if(!Number.isInteger(I)||C!=="start"&&C!=="end")return;tm(R,I,C);return}$.dataset.segmentAction==="delete"&&Rm(R)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(x=>{const $=document.getElementById(x);$&&$.addEventListener("change",()=>de())}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(x=>{x.addEventListener("change",()=>de())});const d=h("stage-editor-new-race-checkbox"),l=h("stage-editor-new-race-details"),p=h("stage-editor-program-checkbox"),u=h("stage-editor-program-details");d&&d.addEventListener("change",()=>{d.checked?(l&&(l.classList.remove("hidden"),l.style.display="grid"),p&&(p.checked=!0,u&&(u.classList.remove("hidden"),u.style.display="block"))):l&&(l.classList.add("hidden"),l.style.display="none"),de()}),p&&p.addEventListener("change",()=>{p.checked?u&&(u.classList.remove("hidden"),u.style.display="block"):u&&(u.classList.add("hidden"),u.style.display="none"),de()});const m=h("stage-editor-programs-dropdown-trigger"),f=h("stage-editor-programs-dropdown-menu"),g=h("btn-stage-editor-programs-ok");m&&f&&(m.addEventListener("click",x=>{x.stopPropagation();const $=f.style.display==="none"||!f.style.display;f.style.display=$?"flex":"none"}),g&&g.addEventListener("click",x=>{x.stopPropagation(),f.style.display="none",de()}),document.addEventListener("click",x=>{const $=x.target;f.style.display==="flex"&&!f.contains($)&&$!==m&&!m.contains($)&&(f.style.display="none",de())}));const b=h("stage-editor-programs-list");b&&b.addEventListener("change",x=>{x.target.name==="stage-editor-program-selection"&&rm()});let y=!1,v=null;const T=h("stage-editor-stage-id"),w=h("stage-editor-race-id");if(T&&w){[T,w].forEach($=>{$.addEventListener("keydown",R=>{R.key!=="ArrowUp"&&R.key!=="ArrowDown"&&(y=!0,v&&clearTimeout(v))}),$.addEventListener("keyup",R=>{R.key!=="ArrowUp"&&R.key!=="ArrowDown"&&(v&&clearTimeout(v),v=setTimeout(()=>{y=!1},150))}),$.addEventListener("blur",()=>{y=!1})});const x=($,R)=>{const I=Number($.value);if(!Number.isInteger(I)||I<=0){R==="stage"?Et=I:Ct=I;return}const F=I-(R==="stage"?Et:Ct);if(!y&&(F===1||F===-1)){let P=I;R==="stage"?P=im(I,F):h("stage-editor-new-race-checkbox").checked&&(P=om(I,F)),$.value=String(P)}R==="stage"?Et=Number($.value):Ct=Number($.value)};T.addEventListener("input",()=>{x(T,"stage"),de()}),w.addEventListener("input",()=>{x(w,"race"),de()})}}let et=[],It=null,Ie={form:!0,combinedFatigue:!0,shortFatigue:!1,longFatigue:!1};const Mt=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"];function er(e,t){if(e==null)return"";const a=t?S(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const ee={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function Oa(e,t,a){const s=ea(e??null);return`<span class="badge badge-race-category" style="${Za(s)}; white-space: nowrap; display: inline-block;">${S(e??"Unbekannt")}</span>`}function tr(e){if(!e)return"-";const t=ea(e);return`<span class="badge badge-race-category" style="${Za(t)}; white-space: nowrap; display: inline-block;">${S(e)}</span>`}function Nm(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function Pm(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${Nm(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function Zi(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";case"breakaway_final":return"is-breakaway";default:return""}}function ar(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";case"breakaway_final":return"Ausreißer";default:return"Etappe"}}function Lm(e){return`<span class="rider-stats-final-type ${Zi(e)}">${S(ar(e))}</span>`}function re(e,t,a){let s="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?s+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?s+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?s+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?s+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?s+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?s+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(s+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${s}" title="${S(a)}: ${e} Siege">${e}</span>`}function be(e,t,a){let s="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?s+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?s+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?s+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?s+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?s+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?s+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?s+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(s+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${s}" title="${S(a)}: ${e} Siege">${e}</span>`}function Dm(e){return`${e.startDate===e.endDate?se(e.startDate):`${se(e.startDate)} - ${se(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function Va(e){if(e==null||c.riders.length===0)return null;const a=[...c.riders].sort((s,r)=>(r.seasonPoints??0)-(s.seasonPoints??0)||(r.seasonWins??0)-(s.seasonWins??0)||r.overallRating-s.overallRating||`${s.lastName} ${s.firstName}`.localeCompare(`${r.lastName} ${r.firstName}`,"de")||s.id-r.id).findIndex(s=>s.id===e);return a>=0?a+1:null}function Sn(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;default:return 4}}function Am(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||Sn(t.rowType)-Sn(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function Bm(e){return[...e].map(t=>({...t,rows:Am(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function Ji(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,s=36;const r=Math.max(50,Math.min(85,e));for(let d=1;d<t.length;d++){const l=t[d-1],p=t[d];if(r<=p.score){const u=(r-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*u),s=Math.round(l.lightness+(p.lightness-l.lightness)*u);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function rt(e,t,a,s){const r=s>0?Math.max(0,Math.min(1,a/s)):.5,n=Math.round(6+r*118),i=.26+r*.18,o=.14+r*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${S(t)}">${e} ${a}</span>`}function ps(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function gs(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return ee.mountain;case"Hill":return ee.hilly;case"Sprint":return ee.sprint;case"Timetrial":return ee.timetrial;case"Cobble":return ee.cobble;case"Attacker":return ee.attacker;default:return""}}function Ge(e,t,a,s,r){var X,me,ae;const n=(t==null?void 0:t.countryCode)??s??null,i=n?ne(n):r,o=(t==null?void 0:t.roleName)??((X=e==null?void 0:e.role)==null?void 0:X.name)??"Ohne Rolle",d=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,p=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",u=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",m=((me=t==null?void 0:t.program)==null?void 0:me.name)??((ae=e==null?void 0:e.seasonProgram)==null?void 0:ae.name)??"-",f=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,g=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,b=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,y=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,v=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,T=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,w=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",x=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,$=(t==null?void 0:t.currentSeasonRank)??Va((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),R=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,I=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,C=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,F=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},P=Math.max(F.flat,F.hilly,F.mediumMountain,F.mountain,F.timetrial,F.cobble),D=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},_=Math.max(D.stageRace,D.oneDay),B=e!=null&&e.specialization1?ps(e.specialization1):"-",M=e!=null&&e.specialization2?ps(e.specialization2):"-",N=e!=null&&e.specialization3?ps(e.specialization3):"-",O=gs((e==null?void 0:e.specialization1)??null),K=gs((e==null?void 0:e.specialization2)??null),j=gs((e==null?void 0:e.specialization3)??null);let A="";return t!=null&&t.lieutenantInfo?A=`
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.lieutenantInfo.name)}</a></span></span>
    `:t!=null&&t.leaderInfo&&(A=`
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.leaderInfo.name)}</a></span></span>
    `),`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${S(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?vt(l,p):""} <span>${S(p)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${S(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${On(u)} <span>Form</span></span>
        ${A}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${Ji(d)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${ee.seasonForm} ${f>=0?"+":""}${f}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${ee.raceForm} ${g>=0?"+":""}${g}</span>
        <span class="rider-stats-icon-pill" title="Programm">${S(m)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${ee.raceDays} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${y>14?"text-warning":""}" title="30-Tage Renntage">${ee.rollingRaceDays} <span class="rider-stats-icon-pill-value">${y}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${ee.longFatigue} <span class="rider-stats-icon-pill-value">${v}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${w!=="none"?"text-error":""}" title="Kurzzeitfatigue">${ee.shortFatigue} <span class="rider-stats-icon-pill-value">${T}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${ee.seasonPoints} <span class="rider-stats-icon-pill-value">${x}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${ee.rank} <span class="rider-stats-icon-pill-value">${Pm($)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${ee.raceDays} <span class="rider-stats-icon-pill-value">${R}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${ee.wins} <span class="rider-stats-icon-pill-value">${I}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${O} ${S(B)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${K} ${S(M)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${j} ${S(N)}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${rt(ee.stageRace,"Rundfahrten Punkte",D.stageRace,_)}
        ${rt(ee.oneDay,"Eintagesrennen Punkte",D.oneDay,_)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${ee.breakaway} <span class="rider-stats-icon-pill-value">${C}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${rt(ee.flat,"Flach-Punkte",F.flat,P)}
        ${rt(ee.hilly,"Hügel-Punkte",F.hilly,P)}
        ${rt(ee.mediumMountain,"Mittelgebirge-Punkte",F.mediumMountain,P)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${rt(ee.mountain,"Hochgebirge-Punkte",F.mountain,P)}
        ${rt(ee.timetrial,"Zeitfahren-Punkte",F.timetrial,P)}
        ${rt(ee.cobble,"Kopfsteinpflaster-Punkte",F.cobble,P)}
      </div>
    </div>
  `}function kn(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",s=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${S(a)} <strong>${S(s)}</strong>`}function He(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${c.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${c.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${c.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${c.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${c.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${c.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${c.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
    </div>`}function _m(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,s=36;const r=Math.max(55,Math.min(80,e));for(let d=1;d<t.length;d++){const l=t[d-1],p=t[d];if(r<=p.score){const u=(r-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*u),s=Math.round(l.lightness+(p.lightness-l.lightness)*u);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function Gm(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},s=["mountain","hill","sprint","timeTrial","cobble","attack"],r=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,d=i/2,l=160,p=60,u=85,m=u-p,f=D=>{const _=[];for(let B=0;B<6;B++){const M=B*Math.PI/3-Math.PI/2;_.push(`${o+D*Math.cos(M)},${d+D*Math.sin(M)}`)}return _},g=`
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
    </defs>`,b=`<circle cx="${o}" cy="${d}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let y="";for(let D=p;D<=u;D+=2.5){const _=l*((D-p)/m);if(_<1){y+=`<circle cx="${o}" cy="${d}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const B=f(_),M=D%5===0,N=M?1:.6,O=M?"none":"4,4",K=M?.4:.18;y+=`<polygon points="${B.join(" ")}" fill="none" stroke="rgba(255,255,255,${K})" stroke-width="${N}" stroke-dasharray="${O}" />`,M&&D>p&&(y+=`<text x="${o+5}" y="${d-_+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${D}</text>`)}let v="",T="";for(let D=0;D<6;D++){const _=D*Math.PI/3-Math.PI/2,B=o+l*Math.cos(_),M=d+l*Math.sin(_);v+=`<line x1="${o}" y1="${d}" x2="${B}" y2="${M}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const N=l+28,O=o+N*Math.cos(_),K=d+N*Math.sin(_),j=Math.cos(_);let A="middle";j>.15?A="start":j<-.15&&(A="end");const X=a[s[D]]??p;T+=`<text x="${O}" y="${K}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${A}" dominant-baseline="middle">${r[D]}</text>`,T+=`<text x="${O}" y="${K+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${A}" dominant-baseline="middle">${X}</text>`}const w=[],x=[];s.forEach((D,_)=>{const B=a[D]??p,M=l*((Math.max(p,Math.min(u,B))-p)/m),N=_*Math.PI/3-Math.PI/2,O=o+M*Math.cos(N),K=d+M*Math.sin(N);w.push(`${O},${K}`),x.push(`<circle cx="${O}" cy="${K}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${r[_]}: ${B}</title></circle>`)});const $=`<polygon points="${w.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,I=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((D,_)=>{const B=a[D.key]??60;return(a[_.key]??60)-B}),C=[],F=[];I.forEach((D,_)=>{const B=a[D.key]??60,M=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${D.label}</span>
        ${_m(B)}
      </div>
    `;_%2===0?C.push(M):F.push(M)});const P=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${C.join("")}</div>
      <div class="skills-col">${F.join("")}</div>
    </div>
  `;return`
    <section class="rider-stats-skills-tab" style="margin-top: 1rem;">
      <div class="rider-stats-skills-container" style="display: grid; grid-template-columns: 540px 1fr; gap: 2rem; align-items: start; background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-primary);">
        <div class="skills-radar-wrapper" style="display: flex; justify-content: center; align-items: center; background: var(--bg-900); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-primary);">
          <svg width="540" height="440" viewBox="0 0 ${n} ${i}" style="overflow: visible;">
            ${g}
            ${b}
            ${y}
            ${v}
            ${$}
            ${x.join("")}
            ${T}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${P}
        </div>
      </div>
    </section>
  `}function Hm(e,t){const a=t.shortTermFatigueMalus??0,s=t.longTermFatigueDecayable??0,r=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),d=(s/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const p=t.fatigueHistory??[];let u="";return p.length===0?u='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':u=p.map(m=>{const f=se(m.date);let g="";m.type==="race"?g=`${S(m.raceName)}${m.stageNumber!=null?` - Etappe ${m.stageNumber}`:""}`:g=m.raceName?S(m.raceName):"Regeneration";const b=m.type==="race"&&m.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${m.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let y="";m.shortChange>0?y=`<span style="color: #ef4444; font-weight: 600;">+${m.shortChange.toFixed(2).replace(".",",")}</span>`:m.shortChange<0?y=`<span style="color: #2ecc71; font-weight: 600;">${m.shortChange.toFixed(2).replace(".",",")}</span>`:y='<span style="color: #666;">0,00</span>';const v=[];if(m.longDecayableChange!==0){const x=m.longDecayableChange>0?"+":"",$=m.longDecayableChange>0?"#ef4444":"#2ecc71";v.push(`<span style="color: ${$}; font-weight: 500;">${x}${m.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(m.longLockedChange!==0){const x=m.longLockedChange>0?"+":"",$=m.longLockedChange>0?"#a855f7":"#2ecc71";v.push(`<span style="color: ${$}; font-weight: 500;">${x}${m.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const T=v.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${v.join("")}</div>`:'<span style="color: #666;">0,00</span>',w=m.shortAfter+m.longAfter;return`
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${f}</td>
          <td style="color: #fff; font-weight: 600; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${g}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${b}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${y}
              <span style="font-size: 0.85rem; color: #888;">(${m.shortAfter.toFixed(2).replace(".",",")})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; justify-content: flex-end; width: 100%;">
              ${T}
              <span style="font-size: 0.85rem; color: #888;">(${m.longAfter.toFixed(2).replace(".",",")})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <strong style="color: #ef4444; font-size: 0.95rem;">-${w.toFixed(2).replace(".",",")}</strong>
            <span style="font-size: 0.8rem; color: #888; margin-left: 0.3rem;">(K: ${m.shortAfter.toFixed(2).replace(".",",")} | L: ${m.longAfter.toFixed(2).replace(".",",")})</span>
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
                ${ee.shortFatigue}
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
                ${ee.longFatigue}
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
            ${u}
          </tbody>
        </table>
      </div>
    </section>
  `}function zm(e){var ae;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((E,z)=>z%2===0),s=((ae=c.gameState)==null?void 0:ae.currentDate)??new Date().toISOString(),r=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(s).getUTCFullYear(),n=new Date(Date.UTC(r,0,1)).getTime(),i=864e5,o=1260,d=384,l=40,p=20,u=a.map(E=>{const L=(new Date(E.date).getTime()-n)/i,q=l+L/365*o,J=p+d-Math.min(8,Math.max(0,E.totalForm))/8*d;return{x:q,y:J,form:E.totalForm,date:E.date}});let m="",f="",g="";Ie.form&&u.length>0&&(m=`M ${u.map(E=>`${E.x},${E.y}`).join(" L ")}`,f=u.map(E=>`<circle cx="${E.x}" cy="${E.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${E.date}): ${E.form}</title></circle>`).join(""),g=`${m} L ${u[u.length-1].x},${p+d} L ${u[0].x},${p+d} Z`);let b="",y="";if(Ie.combinedFatigue&&u.length>0){const E=a.map(L=>{const J=(new Date(L.date).getTime()-n)/i,k=l+J/365*o,G=L.combinedFatigue??0,W=p+d-Math.min(15,Math.max(0,G))/15*d;return{x:k,y:W,val:G,date:L.date}});b=`<path d="${`M ${E.map(L=>`${L.x},${L.y}`).join(" L ")}`}" fill="none" stroke="#ef4444" stroke-width="2" />`,y=E.map(L=>`<circle cx="${L.x}" cy="${L.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${L.date}): ${L.val.toFixed(2)}</title></circle>`).join("")}let v="",T="";if(Ie.shortFatigue&&u.length>0){const E=a.map(L=>{const J=(new Date(L.date).getTime()-n)/i,k=l+J/365*o,G=L.shortFatigue??0,W=p+d-Math.min(15,Math.max(0,G))/15*d;return{x:k,y:W,val:G,date:L.date}});v=`<path d="${`M ${E.map(L=>`${L.x},${L.y}`).join(" L ")}`}" fill="none" stroke="#facc15" stroke-width="2" />`,T=E.map(L=>`<circle cx="${L.x}" cy="${L.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${L.date}): ${L.val.toFixed(2)}</title></circle>`).join("")}let w="",x="";if(Ie.longFatigue&&u.length>0){const E=a.map(L=>{const J=(new Date(L.date).getTime()-n)/i,k=l+J/365*o,G=L.longFatigue??0,W=p+d-Math.min(15,Math.max(0,G))/15*d;return{x:k,y:W,val:G,date:L.date}});w=`<path d="${`M ${E.map(L=>`${L.x},${L.y}`).join(" L ")}`}" fill="none" stroke="#a855f7" stroke-width="2" />`,x=E.map(L=>`<circle cx="${L.x}" cy="${L.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${L.date}): ${L.val.toFixed(2)}</title></circle>`).join("")}const $="rgba(251, 191, 36, 0.15)";let R="";for(let E=0;E<=8;E+=2){const z=p+d-E/8*d;R+=`<line x1="${l}" y1="${z}" x2="${l+o}" y2="${z}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,R+=`<text x="${l-5}" y="${z+4}" fill="#ffffff" font-size="10" text-anchor="end">${E}</text>`}for(let E=0;E<=15;E+=3){const z=p+d-E/15*d;R+=`<text x="${l+o+5}" y="${z+4}" fill="#ef4444" font-size="10" text-anchor="start">${E}</text>`}let I="";for(let E=0;E<=52;E+=5){const z=l+E/52*o;R+=`<line x1="${z}" y1="${p}" x2="${z}" y2="${p+d}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,I+=`<text x="${z}" y="${p+d+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${E}</text>`}let C="",F="";if(e.peakDates){const E=[...e.peakDates].sort((z,L)=>new Date(z).getTime()-new Date(L).getTime());for(let z=0;z<E.length;z++){const L=E[z],J=(new Date(L).getTime()-n)/i,k=l+J/365*o;C+=`<line x1="${k}" y1="${p}" x2="${k}" y2="${p+d}" stroke="#ffffff" stroke-width="2"><title>Peak: ${L}</title></line>`;const G=z>0?(new Date(E[z-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,W=J-56,V=G+14,fe=Math.max(0,Math.max(W,V)),we=J-fe,Re=l+fe/365*o,Se=we/365*o;F+=`<rect x="${Re}" y="${p}" width="${Se}" height="${d}" fill="rgba(16, 185, 129, 0.1)" />`;const Ze=14/365*o;F+=`<rect x="${k}" y="${p}" width="${Ze}" height="${d}" fill="rgba(239, 68, 68, 0.1)" />`}}const D=(new Date(s).getTime()-n)/i,_=l+D/365*o;C+=`<line x1="${_}" y1="${p}" x2="${_}" y2="${p+d}" stroke="#ef4444" stroke-width="3"><title>Heute: ${s}</title></line>`,et.forEach((E,z)=>{const L=Mt[z%Mt.length];E.peakDates&&E.peakDates.forEach(q=>{const k=(new Date(q).getTime()-n)/i,G=l+k/365*o;C+=`<line x1="${G}" y1="${p}" x2="${G}" y2="${p+d}" stroke="${L}" stroke-width="1.5" stroke-dasharray="3,3"><title>${E.riderName} Peak: ${q}</title></line>`})});let B="",M="";et.forEach((E,z)=>{const L=Mt[z%Mt.length],q=E.formHistory.filter((J,k)=>k%2===0).map(J=>{const G=(new Date(J.date).getTime()-n)/i,W=l+G/365*o,V=p+d-Math.min(8,Math.max(0,J.totalForm))/8*d;return{x:W,y:V,form:J.totalForm,date:J.date}});if(q.length>0){const J=`M ${q.map(k=>`${k.x},${k.y}`).join(" L ")}`;B+=`<path d="${J}" fill="none" stroke="${L}" stroke-width="2" />`,M+=q.map(k=>`<circle cx="${k.x}" cy="${k.y}" r="3" fill="#fff" stroke="${L}" stroke-width="2"><title>${E.riderName} (${k.date}): ${k.form}</title></circle>`).join("")}});const N=c.teams.filter(E=>E.division==="WorldTour"||E.divisionName==="WorldTour");let O='<option value="">-- Team auswählen --</option>';for(const E of N){const z=It===E.id?" selected":"";O+=`<option value="${E.id}"${z}>${S(E.name)}</option>`}let K='<option value="">-- Fahrer auswählen --</option>';if(It!=null){const E=c.riders.filter(z=>z.activeTeamId===It&&z.id!==e.riderId&&!et.some(L=>L.riderId===z.id));for(const z of E)K+=`<option value="${z.id}">${S(z.firstName)} ${S(z.lastName)}</option>`}const j=`
    <div class="rider-compare-controls" style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-primary);">
      <span style="font-weight: 600; color: var(--text-100); font-size: 0.95rem;">Mit anderem Fahrer vergleichen:</span>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-team-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Team (Tier 1):</label>
        <select id="rider-compare-team-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);">
          ${O}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-rider-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Fahrer:</label>
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${It==null?"disabled":""}>
          ${K}
        </select>
      </div>
    </div>
  `,A=e.currentSeasonRank??Va(e.riderId)??"–",X=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(e.riderName)} (${e.currentSeasonPoints}/${A})">${S(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${A})</span></span>
    </div>
    `];et.forEach((E,z)=>{const L=Mt[z%Mt.length],q=E.currentSeasonRank??Va(E.riderId)??"–";X.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${L}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(E.riderName)} (${E.currentSeasonPoints}/${q})">${S(E.riderName)} <span style="color: var(--text-500);">(${E.currentSeasonPoints}/${q})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${E.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const me=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      
      <!-- Chart Line Toggle Checkboxes -->
      <div class="chart-line-toggles" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-form" ${Ie.form?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-combined-fatigue" ${Ie.combinedFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #ef4444;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
          Gesamtfatigue (0-15)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-short-fatigue" ${Ie.shortFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #facc15;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #facc15; border-radius: 50%;"></span>
          Kurzzeitfatigue (0-15)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-long-fatigue" ${Ie.longFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #a855f7;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #a855f7; border-radius: 50%;"></span>
          Langzeitfatigue (0-15)
        </label>
      </div>

      <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-500); font-weight: bold; margin-bottom: 0.5rem; letter-spacing: 0.5px;">Fahrer</div>
      ${X.join("")}
    </div>
  `;return`
    <section class="rider-stats-form-tab">
      <div class="rider-stats-season-head">
        <h3>Formverlauf (Saison ${r})</h3>
      </div>
      ${j}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${F}
            ${R}
            ${I}
            ${C}
            ${g?`<path d="${g}" fill="${$}" />`:""}
            ${m?`<path d="${m}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${f}
            ${b}
            ${y}
            ${v}
            ${T}
            ${w}
            ${x}
            ${B}
            ${M}
          </svg>
        </div>
        ${me}
      </div>
    </section>
  `}function Km(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
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
            ${t.map(a=>{var r;const s=e.unavailableUntil?a.startDate<=e.unavailableUntil&&a.endDate>=c.gameState.currentDate:!1;return`
              <tr>
                <td>${S(ts(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${s?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(r=a.country)!=null&&r.code3?ne(a.country.code3):"–"}</td>
                <td><strong>${S(a.name)}</strong></td>
                <td>${es(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function sr(e){const t=new Set;if(e.jerseysWorn){const i=e.jerseysWorn.split(",").map(o=>o.trim()).filter(Boolean);for(const o of i)t.add(o)}const a=new Map;if(e.eventIds){const i=e.eventIds.split("|");for(const o of i){const[d,l]=o.split(":");d&&a.set(d,l?parseInt(l,10):1)}}const s=[{type:"jersey",key:"yellow",label:"Gelbes Trikot (Gesamtwertung)",colorClass:"jersey-dot-yellow"},{type:"jersey",key:"green",label:"Grünes Trikot (Punktewertung)",colorClass:"jersey-dot-green"},{type:"jersey",key:"red",label:"Bergtrikot (Bergwertung)",colorClass:"jersey-dot-red"},{type:"jersey",key:"white",label:"Weißes Trikot (Nachwuchswertung)",colorClass:"jersey-dot-white"},{type:"jersey",key:"purple",label:"Lila Trikot (Aktivste Fahrer)",colorClass:"jersey-dot-purple-worn"},{type:"event",key:"3",label:"Superform",colorClass:"event-dot-3"},{type:"event",key:"4",label:"Supermalus",colorClass:"event-dot-4"},{type:"event",key:"1",label:"Sturz",colorClass:"event-dot-1"},{type:"event",key:"2",label:"Defekt",colorClass:"event-dot-2"},{type:"event",key:"7",label:"Heimvorteil",colorClass:"event-dot-7"},{type:"event",key:"8",label:"Heimbonus",colorClass:"event-dot-8"},{type:"event",key:"9",label:"Heimmalus",colorClass:"event-dot-9"},{type:"event",key:"5",label:"Attacken",colorClass:"event-dot-5"},{type:"event",key:"6",label:"Konterattacken",colorClass:"event-dot-6"}],r=[],n=[];for(const i of s)if(i.type==="jersey")t.has(i.key)&&(r.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${S(i.label)}</span>
          </div>
        `));else{const o=a.get(i.key);if(o!==void 0&&o>0){const d=o>1?` (${o}x)`:"";r.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${S(i.label)}${S(d)}</span>
          </div>
        `)}}return r.length===0?"":`
    <div class="status-dots-container">
      ${r.join("")}
      <div class="status-tooltip">
        <div class="status-tooltip-title">Status Details</div>
        ${n.join("")}
      </div>
    </div>
  `}function $t(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${S(e)}</span>`}function Wm(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function jm(e){return e.finishStatus==="otl"?$t("OTL","place"):e.finishStatus==="dnf"?$t("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${S(String(e.resultRank))}</span>`}function Om(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":$t(String(e.gcRank),"gc")}function Vm(e){return e.finishStatus==="otl"?ks(e.statusReason,!0):e.finishStatus==="dnf"?ks(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${La(e.stageTimeSeconds)}`:e.resultLabel}function Pe(e,t,a=!1){var o,d;const s=(e==null?void 0:e.activeTeamId)!=null?((o=c.teams.find(l=>l.id===e.activeTeamId))==null?void 0:o.name)??null:null,r=((d=e==null?void 0:e.country)==null?void 0:d.code3)??(e==null?void 0:e.nationality)??null,n=r?ne(r):"",i=t==null?[]:[...t.seasons].map(l=>({...l,raceBlocks:Bm(l.raceBlocks)})).sort((l,p)=>p.season-l.season);return a?`
      ${Ge(e,t,s,r,n)}
      ${He(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`:t?c.riderStatsTab==="skills"?`
      ${Ge(e,t,s,r,n)}
      ${He(t)}
      ${Gm(e)}`:c.riderStatsTab==="fatigue"?`
      ${Ge(e,t,s,r,n)}
      ${He(t)}
      ${Hm(e,t)}`:c.riderStatsTab==="program"?`
      ${Ge(e,t,s,r,n)}
      ${He(t)}
      ${Km(t)}`:c.riderStatsTab==="form"?`
      ${Ge(e,t,s,r,n)}
      ${He(t)}
      ${zm(t)}`:c.riderStatsTab==="topResults"?`
      ${Ge(e,t,s,r,n)}
      ${He(t)}
      ${Ym(t)}`:c.riderStatsTab==="career"?`
      ${Ge(e,t,s,r,n)}
      ${He(t)}
      ${Zm(t)}`:t.seasons.length===0?`
      ${Ge(e,t,s,r,n)}
      ${He(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`:`
    ${Ge(e,t,s,r,n)}
    ${He(t)}
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
                  <h4>${S(p.raceName)}</h4>
                  <p>${S(Dm(p))}</p>
                </div>
                ${Oa(p.raceCategoryName,p.isStageRace,p.rows.filter(u=>u.rowType==="stage_result").length||null)}
              </div>
              <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
                <table class="data-table rider-stats-table">
                  <colgroup>
                    <col style="width: 8%;">
                    <col style="width: 4.5%;">
                    <col style="width: 3.5%;">
                    <col style="width: 2.5%;">
                    <col style="width: 3.5%;">
                    <col style="width: 11%;">
                    <col style="width: 20%;">
                    <col style="width: 8%;">
                    <col style="width: 9.5%;">
                    <col style="width: 4.5%;">
                    <col style="width: 4.5%;">
                    <col style="width: 15%;">
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
                    ${p.rows.map(u=>{const m=u.rowType!=="stage_result",f=m?`${u.raceName} · ${ar(u.rowType)}`:u.stageName?`${u.raceName} · ${u.stageName}`:u.raceName;return`
                        <tr class="rider-stats-row${m?" rider-stats-row-final":""}">
                          <td>${S(se(u.date))}</td>
                          <td>${jm(u)}</td>
                          <td>${Om(u)}</td>
                          <td class="rider-stats-breakaway-col">${Wm(u)}</td>
                          <td>${m?"":er(u.rolledWeatherId,u.rolledWetterName)}</td>
                          <td>${m?Lm(u.rowType):Oa(u.raceCategoryName?u.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):u.raceCategoryName,u.isStageRace)}</td>
                          <td>${S(f)}</td>
                          <td class="status-cell">${sr(u)}</td>
                          <td>${m?"–":u.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${u.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${oa(u.profile)}</button>`:"–"}</td>
                          <td>${m?"-":u.distanceKm!=null?S(u.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                          <td>${m?"-":u.elevationGainMeters!=null?S(String(Math.round(u.elevationGainMeters))):"–"}</td>
                          <td>${S(Vm(u))}</td>
                          <td>${u.seasonPoints}</td>
                        </tr>`}).join("")}
                  </tbody>
                </table>
              </div>
            </section>`).join("")}
        </div>
      </section>`).join("")}`:`
      ${Ge(e,t,s,r,n)}
      ${He(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`}function Fs(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(c.riderStatsTab)?(e.style.minWidth="min(1475px, 95vw)",e.style.maxWidth="1687px"):(e.style.minWidth="",e.style.maxWidth="")}async function At(e){var d,l,p,u;const t=ke(e),a=(t==null?void 0:t.activeTeamId)!=null?((d=c.teams.find(m=>m.id===t.activeTeamId))==null?void 0:d.name)??null:null;et=[],It=null,c.riderStatsSelectedRiderId=e,c.riderStatsTab="results",Fs(),c.riderStatsTopResultsFilterCategory=null,c.riderStatsTopResultsFilterSeason=null,c.riderStatsTopResultsPage=1,h("rider-stats-title").innerHTML=kn(t,null),h("rider-stats-jersey").innerHTML="";const s=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((l=t.role)==null?void 0:l.name)??"Fahrer"} · ${a??"Team unbekannt"}${s}`:"Historie wird geladen",h("rider-stats-body").innerHTML=Pe(t,null,!0),je("riderStats");const r=await H.getRiderStats(e);if(c.riderStatsSelectedRiderId!==e)return;if(!r.success||!r.data){const m=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((p=t.role)==null?void 0:p.name)??"Fahrer"} · ${a??"Team unbekannt"}${m}`:"Fehler beim Laden",h("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${S(r.error??"Unbekannter Fehler")}</p>
      </section>`;return}c.riderStatsPayload=r.data,Fs(),h("rider-stats-title").innerHTML=kn(t,r.data),h("rider-stats-jersey").innerHTML="";const n=r.data.age?` · Alter ${r.data.age}`:t!=null&&t.age?` · Alter ${t.age}`:"",i=r.data.mentorName?` · Mentor: ${r.data.mentorName}`:"",o=r.data.mentoredRiderNames&&r.data.mentoredRiderNames.length>0?` · Mentor von: ${r.data.mentoredRiderNames.join(" - ")}`:"";h("rider-stats-meta").textContent=`${((u=t==null?void 0:t.role)==null?void 0:u.name)??"Fahrer"} · ${r.data.teamName??a??"Ohne aktives Team"}${n} · ${r.data.seasons.length} Saisons${i}${o}`,h("rider-stats-body").innerHTML=Pe(t,r.data,!1)}function Um(){h("rider-stats-body").addEventListener("click",e=>{var r;if(e.target&&e.target.id&&e.target.id.startsWith("toggle-chart-")){const n=e.target.id,i=e.target.checked;n==="toggle-chart-form"?Ie.form=i:n==="toggle-chart-combined-fatigue"?Ie.combinedFatigue=i:n==="toggle-chart-short-fatigue"?Ie.shortFatigue=i:n==="toggle-chart-long-fatigue"&&(Ie.longFatigue=i);const o=ke(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Pe(o,c.riderStatsPayload,!1);return}const t=e.target.closest("button[data-rider-stats-tab]");if(!t){const n=e.target.closest("button[data-remove-compare-id]");if(n){const d=Number(n.dataset.removeCompareId);et=et.filter(p=>p.riderId!==d);const l=ke(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Pe(l,c.riderStatsPayload,!1);return}const i=e.target.closest("button[data-top-results-page]");if(i){const d=Number(i.dataset.topResultsPage);if(!isNaN(d)&&d>=1){c.riderStatsTopResultsPage=d;const l=ke(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Pe(l,c.riderStatsPayload,!1)}return}const o=e.target.closest("button[data-stage-profile-id]");if(o){const d=Number(o.dataset.stageProfileId);Number.isFinite(d)&&xo(d);return}return}const a=t.dataset.riderStatsTab;if(a!=="results"&&a!=="program"&&a!=="form"&&a!=="topResults"&&a!=="skills"&&a!=="career"&&a!=="fatigue"||a==="program"&&(((r=c.riderStatsPayload)==null?void 0:r.programRaces.length)??0)===0)return;c.riderStatsTab=a,Fs();const s=ke(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Pe(s,c.riderStatsPayload,!1)}),h("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){c.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,c.riderStatsTopResultsPage=1;const a=ke(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Pe(a,c.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){c.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),c.riderStatsTopResultsPage=1;const a=ke(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Pe(a,c.riderStatsPayload,!1)}else if(t.classList.contains("rider-stats-filter-checkbox")){const a=t.dataset.filterType;c.riderStatsTopResultsFilters[a]=t.checked,c.riderStatsTopResultsPage=1;const s=ke(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Pe(s,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;It=a?Number(a):null;const s=ke(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Pe(s,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const s=Number(a);if(et.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const r=await H.getRiderStats(s,!0);r.success&&r.data?et.push({riderId:r.data.riderId,riderName:r.data.riderName,teamId:r.data.teamId,teamName:r.data.teamName,formHistory:r.data.formHistory??[],peakDates:r.data.peakDates??[],currentSeasonPoints:r.data.currentSeasonPoints??0,currentSeasonRank:r.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(r.error??""));const n=ke(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Pe(n,c.riderStatsPayload,!1)}}})}function $n(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function Ym(e){const t=[];for(const g of e.seasons)for(const b of g.raceBlocks)for(const y of b.rows)t.push({...y,season:g.season,isStageRace:b.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,b)=>g.localeCompare(b,"de"));const s=Array.from(new Set(t.map(g=>g.season))).sort((g,b)=>b-g);let r=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?c.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?c.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?c.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?c.riderStatsTopResultsFilters.youth:!0:g.isStageRace?c.riderStatsTopResultsFilters.stage:c.riderStatsTopResultsFilters.oneDay);if(c.riderStatsTopResultsFilterCategory){const g=c.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const b=g.substring(0,g.length-8);r=r.filter(y=>y.raceCategoryName===b&&y.rowType==="stage_result")}else if(g.endsWith("-gc")){const b=g.substring(0,g.length-3);r=r.filter(y=>y.raceCategoryName===b&&y.rowType!=="stage_result")}else r=r.filter(b=>b.raceCategoryName===g)}c.riderStatsTopResultsFilterSeason!=null&&(r=r.filter(g=>g.season===c.riderStatsTopResultsFilterSeason)),r.sort((g,b)=>{if(b.seasonPoints!==g.seasonPoints)return b.seasonPoints-g.seasonPoints;const y=g.rowType!=="stage_result",v=b.rowType!=="stage_result",T=g.resultRank??9999,w=b.resultRank??9999;if(c.riderStatsTopResultsFilterCategory)return T!==w?T-w:y!==v?y?-1:1:0;{const x=$n(g.raceCategoryName),$=$n(b.raceCategoryName);return x!==$?x-$:y!==v?y?-1:1:T-w}});const n=200,i=r.slice(0,1e3),o=Math.max(1,Math.ceil(i.length/n));c.riderStatsTopResultsPage>o&&(c.riderStatsTopResultsPage=o);const d=(c.riderStatsTopResultsPage-1)*n,l=i.slice(d,d+n),u=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${a.map(g=>{if(g.toLowerCase().includes("stage race")||g.toLowerCase().includes("grand tour")||g.toLowerCase().includes("tour de france")){const y=`${g}-etappen`,v=`${g}-gc`;return`
        <option value="${S(y)}" ${c.riderStatsTopResultsFilterCategory===y?"selected":""}>${S(g)} - Etappen</option>
        <option value="${S(v)}" ${c.riderStatsTopResultsFilterCategory===v?"selected":""}>${S(g)} - GC</option>
      `}else return`<option value="${S(g)}" ${c.riderStatsTopResultsFilterCategory===g?"selected":""}>${S(g)}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="rider-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${s.map(g=>`<option value="${g}" ${c.riderStatsTopResultsFilterSeason===g?"selected":""}>Saison ${g}</option>`).join("")}
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
  `,m=l.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':l.map(g=>{const b=g.rowType!=="stage_result",y=b?`${g.raceName} · ${ar(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let v="–",T="–";g.finishStatus==="otl"?v=$t("OTL","place"):g.finishStatus==="dnf"?v=$t("DNF","place"):g.resultRank==null||(b?T=`<span class="rider-stats-final-type ${Zi(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:v=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${S(String(g.resultRank))}</span>`);const w=b?"–":g.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${g.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${oa(g.profile)}</button>`:"–",x=!b&&g.stageScore!=null&&g.stageScore>0?Qa(g.stageScore,0,350):"–",$=Oa(g.raceCategoryName?g.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${b?" rider-stats-row-final":""}">
            <td>${v}</td>
            <td>${T}</td>
            <td><strong>${S(y)}</strong>${b?"":er(g.rolledWeatherId,g.rolledWetterName)}</td>
            <td class="status-cell">${sr(g)}</td>
            <td>${w}</td>
            <td>${x}</td>
            <td>${$}</td>
            <td>Saison ${g.season}</td>
            <td><strong>${g.seasonPoints}</strong></td>
          </tr>
        `}).join(""),f=o>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${c.riderStatsTopResultsPage-1}" ${c.riderStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        <span style="font-weight: 600; color: #ccc;">Seite ${c.riderStatsTopResultsPage} von ${o}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${c.riderStatsTopResultsPage+1}" ${c.riderStatsTopResultsPage===o?"disabled":""}>Weiter &raquo;</button>
      </div>
    `:"";return`
    <section class="rider-stats-top-results" style="margin-top: 1.5rem;">
      ${u}
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 6%;">
            <col style="width: 9%;">
            <col style="width: 28%;">
            <col style="width: 10%;">
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
      ${f}
    </section>
  `}function Zm(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),s=(n,i,o,d)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let p="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?p+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?p+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?p+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?p+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?p+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?p+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?p+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?p+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(p+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${p}" title="${S(o)}">${n}</span>`},r=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Ausreißer-Kms</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #c084fc; line-height: 1.25;">${Math.round(t.breakawayKms??0)}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">km</div>
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
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Heimvorteil</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #38bdf8; line-height: 1.25;">${t.homeAdvantageDays??0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Heimbonus</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #facc15; line-height: 1.25;">${t.superHomeAdvantageDays??0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Heimmalus</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fb7185; line-height: 1.25;">${t.homePressureDays??0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">Tage</div>
        </div>
      </div>

      <!-- Categories details -->
      <h3 style="margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; font-weight: 500; font-size: 1.15rem; color: #fff;">Ergebnisse nach Rennklasse</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 1.25rem;">
        ${r.map(n=>{const i=t.categories[n.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(n.name)}">${S(n.name)}</span>
                ${tr(n.key)}
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
                    <!-- Ausreißertrikot (Aktivste Fahrer) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(i.breakawayJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #f3e8ff, #d8b4fe); color: #581c87; border: 1px solid #a855f7; box-shadow: 0 0 4px rgba(168, 85, 247, 0.4);"}" title="Tage im Ausreißertrikot (Aktivste Fahrer)">
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
                  ${re(i.winFlat||0,"flat","Flach (Flat)")}
                  ${re(i.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${re(i.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${re(i.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${re(i.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${re(i.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${re(i.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${re(i.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${re(i.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${re(i.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${re(i.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${be(i.winWeather1||0,1,"Sonnig")}
                  ${be(i.winWeather2||0,2,"Extreme Hitze")}
                  ${be(i.winWeather3||0,3,"Leichter Regen")}
                  ${be(i.winWeather4||0,4,"Starkregen")}
                  ${be(i.winWeather5||0,5,"Starker Wind")}
                  ${be(i.winWeather6||0,6,"Dichter Nebel")}
                  ${be(i.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${ee.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${i.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}window.openRiderStatsFromRiderStats=At;const Jm=250,wt=1200,qm=250,Xm=1200,Tn=.2;class Qm{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",s=>{var i,o,d,l;const r=s.target.closest("button[data-race-sim-action]");if(r){if(r.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const u=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;u&&((l=(d=this.options).onFinishRequested)==null||l.call(d,u,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=s.target.closest("button[data-race-sim-speed]");if(n){const p=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(p))return;this.timeMultiplier=p,this.render()}}),this.elements.messages.addEventListener("click",s=>{const r=s.target.closest("button[data-race-sim-group-rider-id]");if(r){const d=this.resolveRiderIdFromGroupButton(r);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),At(d));return}const n=s.target.closest("button[data-race-sim-group-rider-name]");if(n){const d=this.resolveRiderIdFromGroupButton(n);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),At(d));return}const i=s.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),qr(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",s=>{const r=s.target.closest("[data-race-sim-overview-summary]");if(r){const n=r.dataset.raceSimOverviewSummary,i=r.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(s)}),this.elements.groupBox.addEventListener("click",s=>{this.handleGroupInteraction(s)}),this.elements.profile.addEventListener("click",s=>{const r=s.target.closest("button[data-race-sim-timing-mode]");if(!r)return;const n=r.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+wt,this.render())})}handleGroupInteraction(t){var p,u;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const m=this.resolveRiderIdFromGroupButton(a);m!=null&&this.selectGroupByRiderId(m,this.detailSnapshot);return}const s=t.target.closest("button[data-race-sim-group-nav]");if(!s)return;const r=this.buildRaceGroups(this.detailSnapshot);if(r.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,r.findIndex(m=>m.label===n)),o=s.dataset.raceSimGroupNav==="prev"?-1:1,d=(i+o+r.length)%r.length,l=((p=r[d])==null?void 0:p.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",m=>{const f=m.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+wt)}),this.elements.profile.addEventListener("wheel",m=>{const f=m.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+wt)},{passive:!0}),this.elements.profile.addEventListener("scroll",m=>{const f=m.target;!(f instanceof HTMLElement)||!f.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+wt)},!0),(u=this.elements.sidebar.parentElement)==null||u.addEventListener("click",m=>{if(!this.bootstrap||!this.detailSnapshot||!lu(this.elements.sidebar,m.target))return;const g=performance.now(),b=pn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const y=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",y),this.scheduleSidebarPaintTelemetry(g,y),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new bi(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const s=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(s),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(r=>this.frame(r));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const s=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-s),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(r=>this.frame(r))}render(t=performance.now(),a=!1){var f;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const s=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",r=il(this.bootstrap.stageSummary),n=[`${r.segmentCount} Segmente`,r.sprintCount>0?`${r.sprintCount} Sprint${r.sprintCount===1?"":"s"}`:null,r.climbCount>0?`${r.climbCount} Bergwertung${r.climbCount===1?"":"en"}`:null].filter(g=>g!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,d=o!=null?i[o]??"":"",l=d?` · ${d}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${s}${n?` · ${n}`:""}${l}`;const p=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=Jm,u=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,m=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=qm;if(p||u||m){const g=performance.now();this.detailSnapshot=((f=this.engine)==null?void 0:f.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-g)}if(p&&this.detailSnapshot){const g=this.elements.profile.querySelector(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop);const b=performance.now();pl(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-b),this.lastProfileRenderTime=t;const y=this.elements.profile.querySelector(".race-sim-timing-scroll");y&&(y.scrollTop=this.timingScrollTop)}if(u&&this.detailSnapshot){this.lastSidebarRenderTime=t;const g=performance.now(),b=pn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const y=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",y),this.scheduleSidebarPaintTelemetry(g,y)}m&&this.detailSnapshot&&(qr(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),Uc(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),Kc(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),Jr(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const s=a.find(r=>r.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(s)return s.label}return this.selectedGroupLabel!=null&&a.some(s=>s.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return Ks(zs(t.clusters))}resolveInitialGroupLabel(t){var a,s;return((a=t.find(r=>r.label==="P"))==null?void 0:a.label)??((s=t[0])==null?void 0:s.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(s=>[s.riderId,s]));return[...t.riderIds].sort((s,r)=>{var n,i;return(((n=a.get(s))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(r))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||s-r})[0]??null}selectGroupByLabel(t,a,s=!0){const r=this.buildRaceGroups(a),n=r.find(i=>i.label===t)??r.find(i=>i.label==="P")??r[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),s&&(this.profileInteractionHoldUntilMs=performance.now()+wt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const r=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;r&&(this.selectedGroupLabel=r.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+wt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+Xm,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const s=t.dataset.raceSimGroupRiderName;if(!s)return null;const r=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===s&&(r==null||i.activeTeamId===r))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const s=this.perfTelemetry[t];this.perfTelemetry[t]=s<=0?a:s*(1-Tn)+a*Tn}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const s=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(s!==this.sidebarPaintSequence)return;const r=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",r),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||Jr(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const Ke="__stage_overview__",qi="__non_finishers__",Xi="__events__",Qi="__roster__";let Le="all";function rr(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function xn(e){return rr(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function ep(e){return[...e].sort((t,a)=>xn(t)-xn(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function tp(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=rr(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function ap(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function sp(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${se(t.date)}`}async function Es(e,t){var r;const a=Da(e);if(a&&(c.selectedResultsRaceId=a.race.id,c.selectedResultsStageId=e),c.riders.length===0){const n=await H.getRiders();n.success&&(c.riders=n.data??[])}const s=await H.getStageResults(e);if(!s.success){c.stageResults=null,$e(),!t&&s.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+s.error);return}c.stageResults=s.data??null,c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId,c.selectedResultTypeId=((r=c.stageResults.classifications[0])==null?void 0:r.resultTypeId)??1,c.selectedResultsMarkerKey=Ke,c.selectedResultsSpecialView=null),c.selectedResultsRaceId!=null&&eo(c.selectedResultsRaceId),$e()}async function eo(e){if(!c.seasonStandings){const a=await H.getSeasonStandings();a.success&&a.data&&(c.seasonStandings=a.data)}const t=await H.getRaceResultsRoster(e);t.success&&t.data?c.resultsRoster=t.data:c.resultsRoster=null}function rp(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function Mn(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function np(){const e=c.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=dt(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,s=[...e.entries].sort((y,v)=>v.overallRating-y.overallRating),r=new Set(s.slice(0,5).map(y=>y.riderId)),n=y=>{var T;const v=c.riders.find(w=>w.id===y);return((T=v==null?void 0:v.skills)==null?void 0:T.sprint)??0},o=[...e.entries.filter(y=>!r.has(y.riderId))].sort((y,v)=>{const T=n(y.riderId),w=n(v.riderId);return w!==T?w-T:v.overallRating-y.overallRating}),d=new Set(o.slice(0,5).map(y=>y.riderId));function l(y){switch(y){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return y}}const p=new Map;for(const y of e.entries){const v=y.teamId;p.has(v)||p.set(v,{teamId:y.teamId,teamName:y.teamName,riders:[],avgRating:0}),p.get(v).riders.push(y)}for(const y of p.values())y.avgRating=y.riders.reduce((v,T)=>v+T.overallRating,0)/y.riders.length;const u=y=>{let v=Number.POSITIVE_INFINITY;for(const T of y)!T.hasDropped&&T.gcRank!=null&&T.gcRank<v&&(v=T.gcRank);return v},m=y=>{var T;if(!((T=c.seasonStandings)!=null&&T.riderStandings))return 0;let v=0;for(const w of y){const x=c.seasonStandings.riderStandings.find($=>$.riderId===w.riderId);x&&x.points>v&&(v=x.points)}return v},f=y=>{if(y==null)return 0;const v=c.riders.filter(x=>x.activeTeamId===y);if(v.length===0)return 0;const T=v.map(x=>x.overallRating??0);T.sort((x,$)=>$-x);const w=T.slice(0,10);return w.length===0?0:w.reduce((x,$)=>x+$,0)/w.length},g=[...p.values()].sort((y,v)=>{const T=u(y.riders),w=u(v.riders);if((T!==Number.POSITIVE_INFINITY||w!==Number.POSITIVE_INFINITY)&&T!==w)return T-w;const x=m(y.riders),$=m(v.riders);if((x>0||$>0)&&x!==$)return $-x;const R=f(y.teamId),I=f(v.teamId);return Math.abs(R-I)>1e-4?I-R:(y.teamName??"").localeCompare(v.teamName??"","de")});for(const y of g)y.riders.sort((v,T)=>Mn(v.roleId)-Mn(T.roleId)||T.overallRating-v.overallRating||v.lastName.localeCompare(T.lastName,"de"));return`<div class="results-roster-grid">${g.map(y=>{const v=y.teamId!=null?vt(y.teamId,y.teamName):"",T=y.riders.map(x=>{var ae;const $=rp(x.roleId),R=x.countryCode?ot[x.countryCode]??x.countryCode.slice(0,2).toLowerCase():null,I=R?`<span class="fi fi-${R} results-roster-flag" title="${S(x.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',C=`${x.firstName.charAt(0)}. ${x.lastName}`,F=x.roleName??"–",P=x.specialization1?l(x.specialization1):null,D=x.specialization2?l(x.specialization2):null;let _=F;P&&(_+=` · ${P}`),D&&(_+=` · ${D}`);const B=`<span class="results-roster-overall-badge" style="color:${ip(x.overallRating)}" title="Gesamtstärke: ${x.overallRating.toFixed(2)}">${x.overallRating.toFixed(2)}</span>`,M=x.hasDropped?" dropped":"";let N="";x.hasDropped?x.dropoutStatus==="dns"?N="DNS":x.dropoutStatus==="dnf"?N=((ae=x.dropoutReason)==null?void 0:ae.startsWith("OTL"))??!1?"OTL":"DNF":N="OUT":x.gcRank!=null&&(N=`${x.gcRank}`);let O="";if(x.hasDropped)O=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${S(x.dropoutReason||"")}">${N}</span>`;else if(x.gcRank!=null){let E="rider-stats-rank-badge-gc";x.gcRank===1?E="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":x.gcRank===2?E="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":x.gcRank===3&&(E="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),O=`<span class="rider-stats-rank-badge ${E}" title="GC Stand: Platz ${x.gcRank}">${x.gcRank}</span>`}const j=`style="color: ${x.hasDropped?"var(--text-500)":$.color}; font-weight: bold;"`,A=r.has(x.riderId),X=d.has(x.riderId);return`<div class="results-roster-rider${M}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${I}
            <span class="results-roster-name${A?" strongest-rider":X?" best-sprinter":""}">
              ${Fe(C,{riderId:x.riderId,teamId:x.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${Ea(x.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${j}>${S(_)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${O||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${B}
        </div>
      </div>`}).join(""),w=y.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${v}</div>
        <div class="results-roster-team-name" title="${S(y.teamName??"–")}">${nt(y.teamName??"–",y.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${w})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${T}</div>
    </div>`}).join("")}</div>`}function ip(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function op(e){var l,p;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=c.stageResults)==null?void 0:l.classifications.find(u=>u.resultTypeId===1),a=new Set(t?t.rows.map(u=>u.riderId).filter(u=>u!=null):[]),s=c.riders.filter(u=>u.activeTeamId===e.teamId&&a.has(u.id)),r=new Set((((p=c.stageResults)==null?void 0:p.nonFinishers)??[]).map(u=>u.riderId)),n=[];for(const u of s){if(u.id===e.riderId||r.has(u.id))continue;let m=0;const f=u.skills.sprint>=72,g=u.skills.flat>=78,b=u.skills.timeTrial>=76,y=u.skills.acceleration>=80;if(f&&m++,g&&m++,b&&m++,y&&m++,m>0){let v=1;m===2?v=1.25:m===3?v=1.5:m===4&&(v=2),n.push({id:u.id,firstName:u.firstName,lastName:u.lastName,countryCode:u.nationality??null,isSprinter:f,multiplier:v,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const u=n.filter(y=>y.isSprinter).reduce((y,v)=>y+v.multiplier,0),m=n.filter(y=>!y.isSprinter).reduce((y,v)=>y+v.multiplier,0);let f=0,g=0;u>0&&m>0?(f=i/(2.125*u+m),g=2.125*f,f=Math.max(.1,Math.min(.3,f)),g=Math.max(.25,Math.min(.6,g))):u>0?(g=i/u,g=Math.max(.25,Math.min(.6,g)),f=g/2.125):m>0&&(f=i/m,f=Math.max(.1,Math.min(.3,f)),g=2.125*f);for(const y of n)y.contribution=y.isSprinter?g*y.multiplier:f*y.multiplier;const b=n.reduce((y,v)=>y+v.contribution,0);if(b>0){const y=i/b;for(const v of n)v.contribution*=y}n.sort((y,v)=>v.contribution-y.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),d=n.map(u=>{const m=Qe(Ia(u.id)??u.countryCode),f=u.firstName?`${u.firstName.charAt(0)}. ${u.lastName}`:u.lastName,g=u.contribution.toFixed(2).replace(".",",");return`
      <div class="leadout-bonus-popover-grid">
        <span class="results-flag-col-cell">${m}</span>
        <span class="leadout-bonus-rider-name">${S(f)}</span>
        <strong>+${g}</strong>
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
  `}function wn(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function Ea(e){var u,m,f,g,b,y,v,T,w,x;if(e==null||!c.stageResults)return"";const t=dt(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,s=c.stageResults.classifications,r=(m=(u=s.find($=>$.resultTypeId===Ra))==null?void 0:u.rows.find($=>$.rank===1))==null?void 0:m.riderId,n=(g=(f=s.find($=>$.resultTypeId===Ss))==null?void 0:f.rows.find($=>$.rank===1))==null?void 0:g.riderId,i=(y=(b=s.find($=>$.resultTypeId===Gn))==null?void 0:b.rows.find($=>$.rank===1))==null?void 0:y.riderId,o=(T=(v=s.find($=>$.resultTypeId===5))==null?void 0:v.rows.find($=>$.rank===1))==null?void 0:T.riderId,d=(x=(w=s.find($=>$.resultTypeId===7))==null?void 0:w.rows.find($=>$.rank===1))==null?void 0:x.riderId,l=[],p=c.selectedResultTypeId;return e===r&&(p===Ra||p===1&&a||p!==1&&p!==Ra)&&l.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&l.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&l.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&l.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===d&&l.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>'),l.length===0?"":`<span class="jersey-dots-wrapper">${l.join("")}</span>`}function Rn(e){if(!e)return"";let t=e;const a=[],s=[...c.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of s){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),d=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");d.test(t)&&(t=t.replace(d,l=>{const p=`__RIDER_LINK_${a.length}__`,u=Fe(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(u),p}))}let r=S(t);for(let n=0;n<a.length;n++)r=r.replace(`__RIDER_LINK_${n}__`,a[n]);return r}function $e(){var z,L,q,J;c.riders.length===0&&H.getRiders().then(k=>{k.success&&k.data&&(c.riders=k.data,$e())});const e=h("results-race-select"),t=h("results-stage-select"),a=h("results-type-tabs"),s=h("results-marker-tabs"),r=h("results-stage-meta"),n=h("results-empty"),i=h("results-table"),o=i.querySelector("thead tr"),d=h("results-tbody"),l=h("results-marker-classifications"),p=h("results-roster"),u=i.querySelector("colgroup");u&&u.remove(),i.style.tableLayout="",c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+c.races.filter(k=>{var G;return(((G=k.stages)==null?void 0:G.length)??0)>0}).map(k=>`<option value="${k.id}"${k.id===c.selectedResultsRaceId?" selected":""}>${S(k.name)}</option>`).join("");const m=dt(c.selectedResultsRaceId),f=m==null?"":(m.stages??[]).map(k=>`<option value="${k.id}"${k.id===c.selectedResultsStageId?" selected":""}>${S(sp(m,k))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+f;const g=((z=c.stageResults)==null?void 0:z.classifications.filter(k=>!(m&&!m.isStageRace&&k.resultTypeId!==1&&k.resultTypeId!==6)))??[],b=g.find(k=>k.resultTypeId===c.selectedResultTypeId)??g[0]??null,y=c.selectedResultsSpecialView==="nonFinishers",v=c.selectedResultsSpecialView==="events",T=c.selectedResultsSpecialView==="roster";if(b&&!y&&!v&&!T&&(c.selectedResultTypeId=b.resultTypeId),v){i.style.tableLayout="fixed";const k=document.createElement("colgroup");k.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(k,i.firstChild)}if(!c.stageResults&&!T||!b&&!y&&!v&&!T){const k=Da(c.selectedResultsStageId);r.textContent=k?`${k.race.name} · ${k.stage.profile} · ${se(k.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",s.innerHTML="",s.classList.add("hidden"),d.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),p.innerHTML="",p.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=c.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}T?c.resultsRoster&&(r.textContent=`${c.resultsRoster.raceName} · Starterfeld`):c.stageResults&&(r.textContent=`${c.stageResults.raceName} · Etappe ${c.stageResults.stageNumber} · ${c.stageResults.profile} · ${se(c.stageResults.date)}`);const w=c.stageResults?Da(c.stageResults.stageId):null,x=(w==null?void 0:w.stage.distanceKm)??null,$=new Map,R=new Map,I=new Map;if(c.stageResults){const k=c.stageResults.classifications.find(G=>G.resultTypeId===1);if(k)for(const G of k.rows)G.riderId!=null&&G.points!=null&&G.points>0&&$.set(G.riderId,G.points),G.riderId!=null&&G.breakawayKms!=null&&G.breakawayKms>0&&I.set(G.riderId,G.breakawayKms);if(c.stageResults.markerClassifications){for(const G of c.stageResults.markerClassifications)if(rr(G.markerType,G.markerCategory)){for(const W of G.entries)if(W.riderId!=null&&W.pointsAwarded!=null&&W.pointsAwarded>0){const V=R.get(W.riderId)??0;R.set(W.riderId,V+W.pointsAwarded)}}}}const C=(b==null?void 0:b.resultTypeId)===Ra,F=(b==null?void 0:b.resultTypeId)===Ss||(b==null?void 0:b.resultTypeId)===Gn,P=(b==null?void 0:b.resultTypeId)===5,D=(b==null?void 0:b.resultTypeId)===6,_=(b==null?void 0:b.resultTypeId)===7,B=C||F||P||D||_,M=g.map(k=>`
    <button
      type="button"
      class="results-type-btn${!y&&!v&&!T&&k.resultTypeId===c.selectedResultTypeId?" active":""}"
      data-result-type-id="${k.resultTypeId}"
    >${S(k.resultTypeName)}</button>
  `),N=`
    <button
      type="button"
      class="results-type-btn${y?" active":""}"
      data-results-special-view="${qi}"
    >OTL/DNF</button>
  `,O=`
    <button
      type="button"
      class="results-type-btn${v?" active":""}"
      data-results-special-view="${Xi}"
    >Ereignisse</button>
  `,K=`
    <button
      type="button"
      class="results-type-btn${T?" active":""}"
      data-results-special-view="${Qi}"
    >Teilnehmer</button>
  `,j=g.findIndex(k=>k.resultTypeName.toLocaleLowerCase("de").includes("team"));j>=0?M.splice(j+1,0,N,O,K):M.push(N,O,K),a.innerHTML=M.join("");const A=ep(((L=c.stageResults)==null?void 0:L.markerClassifications)??[]);if(T){p.innerHTML=np(),p.classList.remove("hidden"),i.classList.add("hidden"),s.innerHTML="",s.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else p.innerHTML="",p.classList.add("hidden");const X=!y&&!v&&!T&&(b==null?void 0:b.resultTypeId)===1&&A.length>0,me=X?c.selectedResultsMarkerKey??Ke:null,ae=X&&me!==Ke?A.find(k=>k.markerKey===me)??null:null;if(X&&(c.selectedResultsMarkerKey=(ae==null?void 0:ae.markerKey)??Ke),v){const k=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"}];s.innerHTML=k.map(G=>`
      <button
        type="button"
        class="results-type-btn${G.key===Le?" active":""}"
        data-event-filter="${G.key}"
      >${S(G.label)}</button>
    `).join("")}else s.innerHTML=X?[`
        <button
          type="button"
          class="results-type-btn${c.selectedResultsMarkerKey===Ke?" active":""}"
          data-marker-key="${Ke}"
        >Tageswertung</button>`,...A.map(k=>`
        <button
          type="button"
          class="results-type-btn${k.markerKey===c.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${k.markerKey}"
        >${S(tp(k))}</button>
      `)].join(""):"";s.classList.toggle("hidden",!v&&!X);const E=y||v||!X||c.selectedResultsMarkerKey===Ke;if(o&&E&&(o.innerHTML=y?`
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
        `:D?`
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
      `),d.innerHTML=y?(((q=c.stageResults)==null?void 0:q.nonFinishers)??[]).map(k=>`
      <tr>
        <td>${k.stageNumber}</td>
        <td>${Go(k.isOtl)}</td>
        <td class="results-jersey-col-cell">${Ht(k.teamId,k.teamName)}</td>
        <td>${zt(k.riderName,!0,!1,k.riderId,k.teamId)}</td>
        <td class="results-flag-col-cell">${Qe(k.countryCode)}</td>
        <td>${nt(k.teamName||"–",k.teamId)}</td>
        <td>${S(ks(k.statusReason,k.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':v?[...((J=c.stageResults)==null?void 0:J.events)??[]].filter(k=>Le==="all"?!0:Le==="form"?!!(k.title&&(k.title.includes("guten Tag")||k.title.includes("schlechten Tag")||k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))):Le==="attack"?(k.type==="attack"||k.type==="counter_attack")&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Le==="breakaway"?!!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Le==="incident"?(k.type==="incident"||!!(k.title&&k.title.includes("Massensturz")))&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Le==="exit"?k.type==="dnf"||!!(k.title&&k.title.includes("nicht am Start")):Le==="home"?!!(k.title&&(k.title.includes("Heimvorteil")||k.title.includes("Heimdruck"))):Le==="weather"?!!(k.title&&k.title.startsWith("Wetterbericht:")):!0).sort((k,G)=>{const W=k.kmMark??0,V=G.kmMark??0;if(Math.abs(W-V)>1e-4)return W-V;if(W===0){const Re=wn(k),Se=wn(G);if(Re!==Se)return Re-Se}const fe=k.riderName??"",we=G.riderName??"";return fe.localeCompare(we,"de")}).map(k=>{var _t,kr,$r;const G=k.kmMark!=null?`${k.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",W=k.riderId,V=W!=null?ke(W):null,fe=k.riderTeamId??(V==null?void 0:V.activeTeamId)??null,we=fe!=null?((_t=c.teams.find(da=>da.id===fe))==null?void 0:_t.name)??null:null;let Re=Ht(fe,we);const Se=!!(k.title&&k.title.startsWith("Wetterbericht:"));let Ze=k.title||"";if(Se){const da=(kr=c.stageResults)==null?void 0:kr.rolledWeatherId,rs=($r=c.stageResults)==null?void 0:$r.rolledWetterName;Re=`<span class="results-jersey-cell">${er(da,rs)}</span>`,rs&&(Ze=`Wetterbericht: ${rs}`)}const la=Se?"":Qe(W!=null?Ia(W):null),Je=Se?"":W!=null?zt(k.riderName??"",!0,!1,W,fe):S(k.riderName||"–");let le="";return k.title&&k.title.includes("guten Tag")?le='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':k.title&&k.title.includes("schlechten Tag")?le='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':k.title&&(k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))?le='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':k.title&&k.title.includes("nicht am Start")?le='<span class="event-badge event-badge-dns">DNS</span>':k.title&&k.title.includes("Massensturz")?le='<span class="event-badge event-badge-masscrash">Massensturz</span>':k.type==="dnf"?le='<span class="event-badge event-badge-dnf">DNF</span>':k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))?le='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':k.type==="attack"?le='<span class="event-badge event-badge-attack">Attacke</span>':k.type==="counter_attack"?le='<span class="event-badge event-badge-counter">Konterattacke</span>':k.type==="incident"?k.title&&(k.title.toLowerCase().includes("defekt")||k.title.toLowerCase().includes("panne")||k.title.toLowerCase().includes("technisch"))?le='<span class="event-badge event-badge-defect">Defekt</span>':le='<span class="event-badge event-badge-crash">Sturz</span>':k.title&&k.title.includes("Super-Heimvorteil")?le='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>':k.title&&k.title.includes("Heimdruck")?le='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>':k.title&&k.title.includes("Heimvorteil")?le='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':k.title&&k.title.startsWith("Wetterbericht:")&&(le='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>'),`
          <tr>
            <td>${G}</td>
            <td>
              <div class="event-rider-info">
                ${Re}
                ${la}
                ${Je}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${Rn(Ze)}</span>
                  ${le}
                </div>
                ${k.detail?`<div class="event-detail">${Rn(k.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':E&&b?b.rows.map(k=>{const G=k.riderName??k.teamName,W=k.riderName?k.teamName:"–",V=Ht(k.teamId,k.teamName),fe=zt(G,!0,k.isBreakaway===!0,k.riderId,k.teamId),we=Qe(Ia(k.riderId)),Re=b.resultTypeId===1&&k.rank===1&&k.timeSeconds!=null&&x!=null,Se=k.timeSeconds!=null?`${La(k.timeSeconds)}${Re?` (${ap(x,k.timeSeconds)})`:""}`:"–",Ze=B?`<td class="results-gc-delta-cell">${Ho(k.previousRank,k.rankDelta)}</td>`:"";if(F){let Je=k.points!=null?String(k.points):"–";if(k.points!=null&&k.riderId!=null&&b){const _t=b.resultTypeId===Ss?$.get(k.riderId)??0:R.get(k.riderId)??0;_t>0&&(Je+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${_t}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Ze}
            <td class="results-jersey-col-cell">${V}</td>
            <td>${fe}${Ea(k.riderId)}</td>
            <td class="results-flag-col-cell">${we}</td>
            <td>${nt(W,k.teamId)}</td>
            <td class="results-points-cell">${Je}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(_){let Je=k.breakawayKms!=null?`${k.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if(k.breakawayKms!=null&&k.riderId!=null){const le=I.get(k.riderId)??0;le>0&&(Je+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${le.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Ze}
            <td class="results-jersey-col-cell">${V}</td>
            <td>${fe}${Ea(k.riderId)}</td>
            <td class="results-flag-col-cell">${we}</td>
            <td>${nt(W,k.teamId)}</td>
            <td class="results-points-cell">${Je}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(D)return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Ze}
            <td class="results-jersey-col-cell">${V}</td>
            <td>${nt(k.teamName,k.teamId)}</td>
            <td class="results-flag-col-cell">${we}</td>
            <td>${Se}</td>
            <td>${S(ns(k.gapSeconds))}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`;let la=k.points!=null?String(k.points):"–";if(k.leadoutBonus!=null&&k.leadoutBonus>0&&k.leadoutRiderId!=null){const Je=op(k);la=`
          <div class="leadout-bonus-anchor">
            ${k.points!=null?k.points:"–"}
            ${Je}
          </div>
        `}return`
        <tr>
          <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
          ${Ze}
          <td class="results-jersey-col-cell">${V}</td>
          <td>${fe}${Ea(k.riderId)}</td>
          <td class="results-flag-col-cell">${we}</td>
          <td>${nt(W,k.teamId)}</td>
          <td>${Se}</td>
          <td>${S(ns(k.gapSeconds))}</td>
          <td class="results-points-cell">${la}</td>
          <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
        </tr>`}).join(""):"",n.classList.toggle("hidden",!!b||y||v||T),i.classList.toggle("hidden",!E||T),ae){const k=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${S(zo(ae.markerType,ae.markerLabel))}</h4>
          <div class="results-marker-card-meta">${S(`${ae.kmMark.toFixed(1).replace(".",",")} km${ae.markerCategory?` · Kat. ${ae.markerCategory}`:""}`)}</div>
        </div>
      </section>`,G=ae.entries.map(W=>{var Re;const V=ke(W.riderId),fe=V?`${V.firstName} ${V.lastName}`:`Fahrer ${W.riderId}`,we=(V==null?void 0:V.activeTeamId)!=null?((Re=c.teams.find(Se=>Se.id===V.activeTeamId))==null?void 0:Re.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${W.rank}.</div>
          <div class="results-marker-jersey">${Ht(V==null?void 0:V.activeTeamId,we)}</div>
          <div class="results-marker-name">${zt(fe,!1,!1,(V==null?void 0:V.id)??null,(V==null?void 0:V.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${Qe(Ia(V==null?void 0:V.id))}</div>
          <div class="results-marker-time">${S(La(W.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${S(ns(W.gapSeconds))}</div>
          <div class="results-marker-points">${W.pointsAwarded!=null&&W.pointsAwarded>0?W.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${k}<div class="results-marker-list">${G}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!ae)}function lp(){h("results-race-select").addEventListener("change",e=>{var s,r;const t=e.target.value;c.selectedResultsRaceId=t?Number(t):null;const a=dt(c.selectedResultsRaceId);c.selectedResultsStageId=((r=(s=a==null?void 0:a.stages)==null?void 0:s[0])==null?void 0:r.id)??null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=Ke,c.selectedResultsSpecialView=null,c.stageResults=null,$e(),c.selectedResultsStageId!=null&&Es(c.selectedResultsStageId,!0)}),h("results-stage-select").addEventListener("change",e=>{const t=e.target.value;c.selectedResultsStageId=t?Number(t):null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=Ke,c.selectedResultsSpecialView=null,c.stageResults=null,$e(),c.selectedResultsStageId!=null&&Es(c.selectedResultsStageId,!0)}),h("results-type-tabs").addEventListener("click",e=>{var s;const t=e.target.closest("button[data-result-type-id]");if(t){c.selectedResultsSpecialView=null,c.selectedResultTypeId=Number(t.dataset.resultTypeId),$e();return}const a=e.target.closest("button[data-results-special-view]");if(a){const r=a.dataset.resultsSpecialView;r===qi?(c.selectedResultsSpecialView="nonFinishers",$e()):r===Xi?(c.selectedResultsSpecialView="events",Le="all",$e()):r===Qi&&(c.selectedResultsSpecialView="roster",c.selectedResultsRaceId!=null&&((s=c.resultsRoster)==null?void 0:s.raceId)!==c.selectedResultsRaceId&&eo(c.selectedResultsRaceId).then(()=>$e()),$e())}}),h("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const s=t.dataset.markerKey;c.selectedResultsMarkerKey=s??Ke,$e();return}const a=e.target.closest("button[data-event-filter]");a&&(Le=a.dataset.eventFilter??"all",$e())})}const nr=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],na=["skills","form","profile","preferences"],ir=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],or={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...nr.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function lr(){return[...ir,...or[c.teamDetailPage]]}function to(e,t=12){const a=c.riders.filter(r=>r.activeTeamId===e).sort((r,n)=>n.overallRating-r.overallRating).slice(0,t);return a.length===0?null:a.reduce((r,n)=>r+n.overallRating,0)/a.length}function ao(e){const t=c.riders.filter(s=>s.activeTeamId===e);return t.length===0?null:t.reduce((s,r)=>s+r.overallRating,0)/t.length}function so(e){const t=to(e);return t==null?"–":t.toFixed(1).replace(".",",")}function ro(e){const t=ao(e);return t==null?"–":t.toFixed(1).replace(".",",")}function te(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function Te(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:te(e,t)}function pe(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function xe(e){return e==null?void 0:typeof e=="string"?Ot(e):e.name}function dr(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...nr.map(t=>t.key)].includes(e)?"desc":"asc"}function no(e){return c.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function io(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=c.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${no(e.sortKey)}
      </button>
    </th>`}function oo(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${na.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const lo={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function cr(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":lo[e]??String(e)}function co(e){const t=[...e],a=c.teamTableSort.direction==="asc"?1:-1;return t.sort((s,r)=>{let n=0;switch(c.teamTableSort.key){case"name":n=te(s.lastName,r.lastName)||te(s.firstName,r.firstName);break;case"countryCode":n=te(St(s),St(r));break;case"birthYear":n=s.birthYear-r.birthYear;break;case"age":n=(s.age??0)-(r.age??0);break;case"overallRating":n=s.overallRating-r.overallRating;break;case"potOverall":n=(s.potential??0)-(r.potential??0);break;case"formBonus":n=(s.formBonus??0)-(r.formBonus??0);break;case"raceFormBonus":n=(s.raceFormBonus??0)-(r.raceFormBonus??0);break;case"longTermFatigueMalus":n=(s.longTermFatigueMalus??0)-(r.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(s.shortTermFatigueMalus??0)-(r.shortTermFatigueMalus??0);break;case"seasonPoints":n=(s.seasonPoints??0)-(r.seasonPoints??0);break;case"seasonRaceDays":n=(s.seasonRaceDays??0)-(r.seasonRaceDays??0);break;case"seasonWins":n=(s.seasonWins??0)-(r.seasonWins??0);break;case"contractEndSeason":n=(s.contractEndSeason??Number.MAX_SAFE_INTEGER)-(r.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=te(s.seasonFormPhase??"neutral",r.seasonFormPhase??"neutral");break;case"roleName":n=te(lt(s),lt(r));break;case"riderType":n=te(s.riderType,r.riderType)||te(Ee(s),Ee(r));break;case"skillDevelopment":n=(s.skillDevelopment??0)-(r.skillDevelopment??0);break;case"specialization1":n=Te(xe(s.specialization1),xe(r.specialization1));break;case"specialization2":n=Te(xe(s.specialization2),xe(r.specialization2));break;case"specialization3":n=Te(xe(s.specialization3),xe(r.specialization3));break;case"peak1":n=Te(pe(s,0),pe(r,0));break;case"peak2":n=Te(pe(s,1),pe(r,1));break;case"peak3":n=Te(pe(s,2),pe(r,2));break;default:n=s.skills[c.teamTableSort.key]-r.skills[c.teamTableSort.key];break}return n===0&&(n=te(s.lastName,r.lastName)||te(s.firstName,r.firstName)),n*a}),t}function uo(e){const t=[...e],a=c.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((s,r)=>{let n=0;switch(c.riderMenuTableSort.key){case"name":n=te(s.lastName,r.lastName)||te(s.firstName,r.firstName);break;case"countryCode":n=te(St(s),St(r));break;case"birthYear":n=s.birthYear-r.birthYear;break;case"age":n=(s.age??0)-(r.age??0);break;case"overallRating":n=s.overallRating-r.overallRating;break;case"potOverall":n=(s.potential??0)-(r.potential??0);break;case"formBonus":n=(s.formBonus??0)-(r.formBonus??0);break;case"raceFormBonus":n=(s.raceFormBonus??0)-(r.raceFormBonus??0);break;case"longTermFatigueMalus":n=(s.longTermFatigueMalus??0)-(r.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(s.shortTermFatigueMalus??0)-(r.shortTermFatigueMalus??0);break;case"seasonPoints":n=(s.seasonPoints??0)-(r.seasonPoints??0);break;case"seasonRaceDays":n=(s.seasonRaceDays??0)-(r.seasonRaceDays??0);break;case"seasonWins":n=(s.seasonWins??0)-(r.seasonWins??0);break;case"contractEndSeason":n=(s.contractEndSeason??Number.MAX_SAFE_INTEGER)-(r.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=te(s.seasonFormPhase??"neutral",r.seasonFormPhase??"neutral");break;case"roleName":n=te(lt(s),lt(r));break;case"riderType":n=te(s.riderType,r.riderType)||te(Ee(s),Ee(r));break;case"skillDevelopment":n=(s.skillDevelopment??0)-(r.skillDevelopment??0);break;case"specialization1":n=Te(xe(s.specialization1),xe(r.specialization1));break;case"specialization2":n=Te(xe(s.specialization2),xe(r.specialization2));break;case"specialization3":n=Te(xe(s.specialization3),xe(r.specialization3));break;case"peak1":n=Te(pe(s,0),pe(r,0));break;case"peak2":n=Te(pe(s,1),pe(r,1));break;case"peak3":n=Te(pe(s,2),pe(r,2));break;default:n=s.skills[c.riderMenuTableSort.key]-r.skills[c.riderMenuTableSort.key];break}return n===0&&(n=te(s.lastName,r.lastName)||te(s.firstName,r.firstName)),n*a}),t}function Cs(e){return e.length===0?"–":e.map(t=>{const a=c.races.find(s=>s.id===t);return a?S(a.name):`Rennen ${t}`}).join(", ")}function dp(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function ur(e,t){var a,s;switch(t.id){case"name":return`<td class="team-table-name-cell">${Fe(Ee(e),{riderId:e.id,teamId:e.activeTeamId,strong:c.teamDetailPage==="form"||c.teamDetailPage==="profile"||c.teamDetailPage==="preferences"})}${Yo(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${ne(St(e))}<span>${S(St(e))}</span></span></td>`;case"age":return`<td>${e.age??(c.gameState?c.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${S(lt(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${Rr(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${Vo(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${Rr((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${Ir(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${Ir(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${jn(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${S(pe(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${S(pe(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${S(pe(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${S(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?S(Ot(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?S(Ot(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?S(Ot(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${Uo(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${ne(e.mentorCountryCode??"UNK")} <span>${S(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${Cs(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${Cs(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const r=t.sortKey;return r&&r in e.skills?`<td>${Oo(e.skills[r],(a=e.yearStartSkills)==null?void 0:a[r],(s=e.potentials)==null?void 0:s[r])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function Ua(){ve("Teams/Fahrer werden aktualisiert...");try{const e=await H.getRiders();if(e.success&&(c.riders=e.data??[]),await H.getTeams().then(t=>{t.success&&(c.teams=t.data??[])}),ye("teams")&&mr(),ye("riders")){const{renderRidersMenu:t}=await Vn(async()=>{const{renderRidersMenu:a}=await Promise.resolve().then(()=>Lp);return{renderRidersMenu:a}},void 0);t()}}finally{ge()}}async function cp(e={}){const t=await H.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),h("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${S(t.error??"Unbekannt")}</p>`;return}c.teams=t.data??[],e.render!==!1&&ye("teams")&&mr()}function mr(){const e=h("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+c.teams.map(s=>`<option value="${s.id}"${String(s.id)===t?" selected":""}>${S(s.name)} (${S(s.division??s.divisionName??"")}) · ${S(s.abbreviation)}</option>`).join("");const a=t?Number(t):null;Zt(a)}function Zt(e){const t=h("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=c.teams.find(i=>i.id===e);if(!a){t.innerHTML="";return}const s=co(c.riders.filter(i=>i.activeTeamId===e)),r=a.division==="U23"?"badge-u23":"badge-classics",n=lr();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${S(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${r}">${S(a.division??a.divisionName??"")}</span>
          <span>${Ko(a.country,a.countryCode)}</span>
          <span>Kürzel: ${S(a.abbreviation)} · Top 12 ${S(so(a.id))} (${S(ro(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${s.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(cr(c.teamTableSort.key))} ${c.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${oo()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${n.map(io).join("")}
          </tr></thead>
          <tbody>
            ${s.length===0?`<tr><td colspan="${n.length}" class="text-muted">Keine Fahrer.</td></tr>`:s.map(i=>`
                <tr class="team-detail-row">
                  ${n.map(o=>ur(i,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function mo(){h("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;c.teamDetailPage="skills",Zt(t?Number(t):null)}),h("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const r=Number(t.dataset.riderProgramId);Number.isFinite(r)&&hr(r);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const r=a.dataset.teamDetailPage;if(na.includes(r)){c.teamDetailPage=r,new Set(lr().map(o=>o.sortKey).filter(o=>o!=null)).has(c.teamTableSort.key)||(c.teamTableSort={key:"name",direction:"asc"});const i=Number(h("teams-dropdown").value);Zt(Number.isFinite(i)?i:null)}return}const s=e.target.closest("button[data-team-sort]");if(s){const r=s.dataset.teamSort;c.teamTableSort.key===r?c.teamTableSort.direction=c.teamTableSort.direction==="asc"?"desc":"asc":c.teamTableSort={key:r,direction:dr(r)};const n=Number(h("teams-dropdown").value);Zt(Number.isFinite(n)?n:null);return}})}const up=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:or,TEAM_DETAIL_PAGE_ORDER:na,TEAM_SKILL_COLUMNS:nr,TEAM_SKILL_TITLES:lo,TEAM_TABLE_COLUMNS:ir,compareOptionalStrings:Te,compareStrings:te,formatTeamAverage:ro,formatTeamTopAverage:so,getActiveTeamTableColumns:lr,getDefaultTeamSortDirection:dr,getPeakDate:pe,getSortIndicator:no,getSpecializationSortLabel:xe,getTeamAverage:ao,getTeamSortLabel:cr,getTeamTopAverage:to,initTeamsListeners:mo,loadTeams:cp,refreshTeamsViewData:Ua,renderPeakDatesSummary:dp,renderRacePrefs:Cs,renderTeamDetail:Zt,renderTeamDetailPageTabs:oo,renderTeamTableCell:ur,renderTeamTableHeader:io,renderTeams:mr,sortRiderMenuRiders:uo,sortTeamRiders:co},Symbol.toStringTag,{value:"Module"}));function mp(e,t,a){return`${e} · Etappe ${t} · ${a}`}function po(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function go(e,t){const a=[];for(const s of e.riders)if(s.leadoutBonus!=null&&s.leadoutBonus>0&&s.leadoutContributions&&s.leadoutContributions.length>0){const r=t.riders.find(i=>i.id===s.riderId),n=(r==null?void 0:r.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:s.riderId,leadoutBonus:s.leadoutBonus,contributorsJson:JSON.stringify(s.leadoutContributions)})}return a}async function fo(e,t=!1){if(_n!=null||Bs)return!1;xr(e),jo(0);try{const a=await H.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const s=a.data,r=await ec(s,o=>zn(o)),n=po(r,s),i=go(r,s);return await ko(e,n,r.markerClassifications,r.incidents,r.allEvents,t,i),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{xr(null),ge()}}function ho(e){var s;const t=(s=c.rosterEditor)==null?void 0:s.teams.find(r=>r.team.id===e);if(!t)return 0;const a=new Set(c.rosterEditorSelectedRiderIds);return t.riders.filter(r=>a.has(r.rider.id)).length}function bo(){return c.rosterEditor?c.rosterEditor.teams.every(e=>ho(e.team.id)===e.riderLimit):!1}function fs(){const e=h("roster-editor-title"),t=h("roster-editor-meta"),a=h("roster-editor-body"),s=h("btn-apply-roster-editor"),r=c.rosterEditor;if(!r){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',s.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=r.race.isStageRace?`${r.race.name} · Etappe ${r.stage.stageNumber} · ${r.stage.profile}`:`${r.race.name} · ${r.stage.profile}`;const n=new Set(c.rosterEditorSelectedRiderIds);a.innerHTML=r.teams.map(i=>{const o=ho(i.team.id),d=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${S(i.team.name)}</h3>
            <p class="text-muted">${S(i.team.abbreviation)} · ${S(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${d}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var b;const u=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),m=l.rider.country?ne(l.rider.country.code3):"",f=[((b=l.rider.role)==null?void 0:b.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),g=l.lockReason?`<span class="roster-editor-rider-lock">${S(l.lockReason)}</span>`:"";return`
              <button
                type="button"
                class="${u}"
                data-roster-team-id="${i.team.id}"
                data-roster-rider-id="${l.rider.id}"
                ${l.isLocked?"disabled":""}
              >
                <span class="roster-editor-rider-name">${m}<span>${S(l.rider.firstName)} ${S(l.rider.lastName)}</span></span>
                <span class="roster-editor-rider-meta">${S(f)}</span>
                ${g}
              </button>`}).join("")}
        </div>
      </section>`}).join(""),s.disabled=!bo()}function Ns(){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],qt("roster-editor-error"),ze("rosterEditor")}function yo(e,t){c.selectedRealtimeStageId=e.stage.id,c.realtimeBootstrap=e,c.realtimeError=null,t&&Tt("live-race"),vo().load(e,{autoplay:!0,resetSpeed:!0}),Nt()}function vo(){let e=jt;if(!e){const t=h("race-sim-layout"),a=h("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new Qm({layout:t,emptyState:a,controlsHeader:h("race-sim-controls-header"),profile:h("race-sim-profile"),groupBox:h("race-sim-group-box"),messages:h("race-sim-messages-body"),favorites:h("race-sim-favorites-body"),sidebar:h("race-sim-sidebar-body"),controls:h("race-sim-controls"),meta:h("race-sim-stage-meta")},{onFinishRequested:(s,r)=>{const n=po(s,r),i=go(s,r);ko(r.stage.id,n,s.markerClassifications,s.incidents,s.allEvents,!1,i)}}),_o(e)}return e}async function pp(e){ve("Starterfeld wird geladen..."),qt("roster-editor-error");try{const t=await H.getRosterEditor(e);if(!t.success||!t.data){ht("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),je("rosterEditor"),fs();return}c.rosterEditor=t.data,c.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(s=>s.isSelected).map(s=>s.rider.id)),fs(),je("rosterEditor")}catch(t){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],ht("roster-editor-error",t.message),je("rosterEditor"),fs()}finally{ge()}}async function gp(){const e=c.rosterEditor;if(e){if(!bo()){ht("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}qt("roster-editor-error"),ve("Starterfeld wird übernommen...");try{const t=await H.applyRosterEditor(e.stage.id,{riderIds:c.rosterEditorSelectedRiderIds});if(!t.success||!t.data){ht("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}Ns(),yo(t.data,!0)}catch(t){ht("roster-editor-error",t.message)}finally{ge()}}}function Nt(){var n,i;const e=h("race-sim-stage-select"),t=((n=c.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===c.selectedRealtimeStageId)||(c.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===c.selectedRealtimeStageId?" selected":""}>${S(mp(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const s=t.find(o=>o.stageId===c.selectedRealtimeStageId)??null,r=vo();if(!s){c.realtimeBootstrap=null,c.realtimeError=null,r.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!c.realtimeBootstrap||c.realtimeBootstrap.stage.id!==s.stageId)&&(c.realtimeError?r.clear(c.realtimeError):r.hide())}async function So(e,t){if(vs!==e){Mr(e),c.selectedRealtimeStageId=e,t&&Tt("live-race"),Nt(),ve("Live-Simulation wird geladen...");try{const a=await H.getRealtimeSimulation(e);if(!a.success||!a.data){c.realtimeBootstrap=null,c.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",Nt(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}yo(a.data,!1)}catch(a){c.realtimeBootstrap=null,c.realtimeError=a.message,Nt(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{vs===e&&Mr(null),ge()}}}async function ko(e,t,a,s,r,n=!1,i){if(!Bs){Tr(!0),ve("Live-Ergebnis wird gespeichert...");try{const o=await H.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:s,events:r,leadoutContributions:i});if(!o.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(o.error??"Unbekannter Fehler"));return}const d=o.data;c.selectedResultsRaceId=(d==null?void 0:d.raceId)??c.selectedResultsRaceId,c.selectedResultsStageId=(d==null?void 0:d.stageId)??e,c.selectedResultTypeId=1,c.realtimeBootstrap=null,c.realtimeError=null,await Es(e,!1),await gr(),await fr(),await Ua(),Nt(),n||Tt("results")}catch(o){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+o.message)}finally{Tr(!1),ge()}}}function fp(){h("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);c.selectedRealtimeStageId=Number.isFinite(t)?t:null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null),c.realtimeError=null,So(t,!1)})}function pr(e){var s;const t=ea((s=e.category)==null?void 0:s.name),a=Za(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function es(e){var r,n;const t=ea((r=e.category)==null?void 0:r.name),a=Za(t),s=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${S(s)}</span>`}function hp(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(s=>s.date).sort((s,r)=>s.localeCompare(r));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function ts(e){const{startDate:t,endDate:a}=hp(e);return t===a?se(t):`${se(t)} - ${se(a)}`}function bp(e){return e.stageId>0}async function gr(){const[e,t]=await Promise.all([H.getGameState(),H.getGameStatus()]);if(!e.success){console.error(e.error);return}c.gameState=e.data??null,c.gameStatus=t.success?t.data??null:null,yp(),ye("dashboard")&&as()}function yp(){var r;if(!c.gameState)return;h("meta-date").textContent=c.gameState.formattedDate,h("meta-season").textContent=`Saison ${c.gameState.season}`;const e=h("meta-race-hint"),t=h("btn-advance-day"),a=h("pending-stages-list"),s=((r=c.gameStatus)==null?void 0:r.pendingStages)??[];s.length>0?(e.textContent=`${s.length} offene Etappe${s.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=s.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${se(n.date)}`:`${n.profile} · ${se(n.date)}`,o=bp(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
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
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):c.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function as(){var t,a,s,r,n;const e=c.teams.find(i=>i.isPlayerTeam)??c.teams.find(i=>{var o;return i.name===((o=c.currentSave)==null?void 0:o.teamName)})??null;h("dashboard-career").textContent=((t=c.currentSave)==null?void 0:t.careerName)??"–",h("dashboard-team").textContent=(e==null?void 0:e.name)??((a=c.currentSave)==null?void 0:a.teamName)??"–",h("dashboard-date").textContent=((s=c.gameState)==null?void 0:s.formattedDate)??"–",h("dashboard-season").textContent=c.gameState?`Saison ${c.gameState.season}`:"–",h("dashboard-races-today").textContent=String(((r=c.gameStatus)==null?void 0:r.pendingStages.length)??((n=c.gameState)==null?void 0:n.racesTodayCount)??0),$p()}async function fr(){const e=await H.getRaces();if(!e.success){console.error(e.error);return}c.races=e.data??[],ye("dashboard")&&as(),vp(),Sp()}async function vp(){var n;const e=(n=c.gameState)==null?void 0:n.season;if(!e||c.races.length===0)return;const t=`participantCountsLogged_${e}`;if(localStorage.getItem(t))return;const a=c.races.slice(0,30),s=await Promise.all(a.map(async i=>{var d;const o=await H.getRaceProgramParticipants(i.id);return{race:i,count:o.success?((d=o.data)==null?void 0:d.length)??0:-1}}));if(s.some(i=>i.count>0)){console.group(`[Velo] Teilnehmeranzahl Saison ${e}`);for(const{race:i,count:o}of s)o>=0&&console.log(`${i.name} (${i.startDate}): ${o} Programmfahrer`);console.groupEnd(),localStorage.setItem(t,"1")}}async function Sp(){var i;const e=(i=c.gameState)==null?void 0:i.season;if(!e)return;const t=`programAssignmentsLogged_${e}`;if(localStorage.getItem(t))return;const a=await H.getRiders();if(!a.success||!a.data)return;const s=a.data,r=new Map;for(const o of s)if(o.seasonProgram){const d=o.seasonProgram;r.has(d.id)||r.set(d.id,{name:d.name,riders:[]}),r.get(d.id).riders.push(o)}if(r.size===0)return;console.group(`[Velo] Programmzuweisungen Saison ${e}`);const n=Array.from(r.keys()).sort((o,d)=>o-d);for(const o of n){const d=r.get(o);console.log(`Program: ${o} - ${d.name} (Count: ${d.riders.length})`)}console.groupEnd(),localStorage.setItem(t,"1")}function kp(e,t){const[a,s,r]=e.split("-").map(Number),n=new Date(a,s-1,r);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),d=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${d}`}function In(e){var p,u,m,f;const t=c.gameState!=null&&e.startDate<=c.gameState.currentDate&&e.endDate>=c.gameState.currentDate,s=c.gameState!=null&&e.endDate<c.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',r=((p=e.country)==null?void 0:p.name)??`Land ${e.countryId}`,n=(u=e.country)!=null&&u.code3?ne(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.distanceKm??0),0):((m=e.upcomingStage)==null?void 0:m.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.elevationGainMeters??0),0):((f=e.upcomingStage)==null?void 0:f.elevationGainMeters)??null,d=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${se(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${S(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${pr(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${S(r)}</span></span></td>
      <td>${es(e)}</td>
      <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${e.id}">Teilnehmer</button></td>
      <td>${d}</td>
      <td>${l}</td>
      <td>${s}</td>
    </tr>`}function $p(){const e=h("dashboard-races-tbody");if(!c.gameState){e.innerHTML='<tr><td colspan="9" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=c.gameState.currentDate,a=kp(t,7),s=c.races.filter(i=>i.startDate<=t&&i.endDate>=t),r=c.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>In Progress</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=s.map(i=>In(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=r.map(i=>In(i)).join(""),e.innerHTML=n}function ia(e){return`Etappe ${e.stageNumber}`}function Tp(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,s)=>s[1]!==a[1]?s[1]-a[1]:a[0].localeCompare(s[0])).map(([a,s])=>`${s}x ${a}`).join(" · ")}function xp(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function oa(e){return`<span class="stage-profile-badge ${xp(e)}">${S(e)}</span>`}function ss(e,t){return`${e.name} · ${ia(t)} · ${t.profile}`}async function Mp(e){var r;const t=c.stageSummariesByStageId[e];if(t)return t;const a=await H.getStageSummary(e);if(a.success&&a.data)return c.stageSummariesByStageId[e]=a.data,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],a.data;const s=await H.getRealtimeSimulation(e);return s.success&&((r=s.data)!=null&&r.stageSummary)?(c.stageSummariesByStageId[e]=s.data.stageSummary,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],s.data.stageSummary):(c.stageSummaryErrorsByStageId&&(c.stageSummaryErrorsByStageId[e]=a.error??s.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:s.error}),c.stageSummariesByStageId&&delete c.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function wp(){var d;const e=h("race-stages-title"),t=h("race-stages-meta"),a=h("race-stages-body"),s=dt(c.selectedDashboardRaceId);if(!s){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const r=s.stages??[],n=r.reduce((l,p)=>l+(p.distanceKm??0),0),i=r.reduce((l,p)=>l+(p.elevationGainMeters??0),0),o=Tp(r);if(e.textContent=s.name,t.textContent=`${ts(s)} · ${((d=s.country)==null?void 0:d.name)??`Land ${s.countryId}`} · ${s.isStageRace?`${s.numberOfStages} Etappen`:"Eintagesrennen"} · ${$s(n)} · ${Ts(i)} · ${o}`,r.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
                <td><strong>${S(ia(l))}</strong></td>
                <td>${oa(l.profile)}</td>
                <td>${l.distanceKm!=null?$s(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?Ts(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${S(ss(s,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Ps(e){dt(e)&&(c.selectedDashboardRaceId=e,wp(),je("raceStages"))}function Rp(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,s;return`
            <tr>
              <td>${ts(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?ne(t.country.code3):""}<span>${S(((s=t.country)==null?void 0:s.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${S(t.name)}</strong></td>
              <td>${es(t)}</td>
              <td>${pr(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function hr(e){const t=c.riders.find(s=>s.id===e);h("rider-program-title").textContent=t?Ee(t):"Programm",h("rider-program-meta").textContent="Lade Programmrennen ...",h("rider-program-body").innerHTML="",je("riderProgram");const a=await H.getRiderProgramRaces(e);if(!a.success||!a.data){h("rider-program-meta").textContent="",h("rider-program-body").innerHTML=`<div class="results-empty">${S(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}h("rider-program-title").textContent=a.data.program.name,h("rider-program-meta").textContent=t?Ee(t):"",h("rider-program-body").innerHTML=Rp(a.data)}function Ip(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=Fp(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${pt("Team","team","Team")}
          ${pt("Fahrer","rider","Fahrer")}
          ${pt("Spec1","spec1","Spezialisierung 1")}
          ${pt("Rolle","role","Rolle")}
          ${pt("Ges","overall","Gesamtstärke")}
          ${pt("Phase","phase","Formphase")}
          ${pt("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var s,r;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${vt((s=a.team)==null?void 0:s.id,(r=a.team)==null?void 0:r.name)}</td>
              <td><span class="race-participant-rider-cell">${ne(St(a.rider))}<strong>${S(Ee(a.rider))}</strong></span></td>
              <td>${S(Ls(a.rider))}</td>
              <td>${S(lt(a.rider))}</td>
              <td>${Wn(a.rider.overallRating)}</td>
              <td>${jn(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${S(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function pt(e,t,a){const s=c.raceParticipantsSort.key===t?" race-participants-sort-active":"",r=c.raceParticipantsSort.key===t?c.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${S(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${s}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${c.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${r}</span>
      </button>
    </th>`}function Fp(e){const t=c.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{var n,i,o,d;let r=0;switch(c.raceParticipantsSort.key){case"team":r=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=s.team)==null?void 0:i.name)??"","de");break;case"rider":r=Ee(a.rider).localeCompare(Ee(s.rider),"de");break;case"spec1":r=Ls(a.rider).localeCompare(Ls(s.rider),"de");break;case"role":r=lt(a.rider).localeCompare(lt(s.rider),"de");break;case"overall":r=a.rider.overallRating-s.rider.overallRating;break;case"phase":r=(a.rider.seasonFormPhase??"neutral").localeCompare(s.rider.seasonFormPhase??"neutral","de");break;default:r=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((d=s.program)==null?void 0:d.name)??"","de")}return r*t||Ee(a.rider).localeCompare(Ee(s.rider),"de")})}function Ls(e){return e.specialization1!=null?Ot(e.specialization1):"–"}async function $o(e){const t=dt(e);c.selectedRaceParticipantsRaceId=e,h("race-participants-title").textContent=(t==null?void 0:t.name)??"Teilnehmer",h("race-participants-meta").textContent="Lade Programmfahrer ...",h("race-participants-body").innerHTML="",c.raceParticipants=[],je("raceParticipants"),await To()}async function To(e=!1){const t=c.selectedRaceParticipantsRaceId;if(t==null)return;const a=dt(t);e&&(h("race-participants-meta").textContent="Lade Programmfahrer ...");const s=await H.getRaceProgramParticipants(t);if(!s.success||!s.data){h("race-participants-meta").textContent="",h("race-participants-body").innerHTML=`<div class="results-empty">${S(s.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}c.raceParticipants=s.data,h("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",h("race-participants-meta").textContent=`${s.data.length} Programmfahrer · ${a?ts(a):""}`,h("race-participants-body").innerHTML=Ip(c.raceParticipants)}async function xo(e,t=null){const a=Da(e);if(!a)return;const s=await Mp(e);if(!s){alert(c.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}c.selectedDashboardProfileStageId=e,h("stage-profile-title").textContent=`${a.race.name} · ${ia(a.stage)}`;const r=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";h("stage-profile-meta").textContent=`${se(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?$s(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?Ts(a.stage.elevationGainMeters):"–"}${r}`,ml(h("stage-profile-view"),s,a.stage.profile,ss(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),je("stageProfile")}function Ep(){h("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const r=Number(t.dataset.editStageRoster);if(!Number.isFinite(r))return;pp(r);return}const a=e.target.closest("button[data-live-stage]");if(a){const r=Number(a.dataset.liveStage);if(!Number.isFinite(r))return;So(r,!0);return}const s=e.target.closest("button[data-instant-stage]");if(s){const r=Number(s.dataset.instantStage);if(!Number.isFinite(r))return;fo(r)}}),h("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-participants-id]");if(t){const r=Number(t.dataset.dashboardRaceParticipantsId);Number.isFinite(r)&&$o(r);return}const a=e.target.closest("button[data-dashboard-race-id]");if(!a)return;const s=Number(a.dataset.dashboardRaceId);Number.isFinite(s)&&Ps(s)}),h("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&xo(a)}),h("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const r=Number(t.dataset.riderProgramId);Number.isFinite(r)&&hr(r);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const s=a.dataset.raceParticipantsSort;c.raceParticipantsSort.key===s?c.raceParticipantsSort.direction=c.raceParticipantsSort.direction==="asc"?"desc":"asc":c.raceParticipantsSort={key:s,direction:"asc"},To()}),h("btn-advance-day").addEventListener("click",async()=>{await Mo()}),h("btn-auto-progress").addEventListener("click",()=>{Cp()})}async function Mo(){ve("Tag wird fortgeschrieben...");try{const e=await H.advanceDay();if(!e.success)return alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler")),!1;if(c.currentSave&&e.data&&(c.currentSave.currentSeason=e.data.season),await gr(),await fr(),ye("teams")){const{refreshTeamsViewData:t}=await Vn(async()=>{const{refreshTeamsViewData:a}=await Promise.resolve().then(()=>up);return{refreshTeamsViewData:a}},void 0);await t()}return!0}catch(e){return alert("Unerwarteter Fehler beim Tageswechsel: "+e.message),!1}finally{ge()}}function br(){const e=document.getElementById("btn-auto-progress");e&&(at?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function Cp(){at?wo():Np()}function Np(){at||(_s(!0),br(),Pp())}function wo(){at&&(_s(!1),br())}async function Pp(){var e;for(;at;){const t=((e=c.gameStatus)==null?void 0:e.pendingStages)??[];let a=!1;if(t.length>0){const s=t[0];a=await fo(s.stageId,!0)}else a=await Mo();if(!a){_s(!1);break}await new Promise(s=>setTimeout(s,100))}br()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&at){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),wo()}});const Jt=50;function yr(){return[...ir,...or[c.riderMenuDetailPage]]}function Ro(e){return c.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function Io(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=c.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Ro(e.sortKey)}
      </button>
    </th>`}function Fo(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${na.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function Ca(){const e=h("riders-detail"),t=yr(),a=uo(c.riders),s=a.length,r=Math.max(1,Math.ceil(s/Jt));c.riderMenuPage=Math.min(r,Math.max(1,c.riderMenuPage));const n=(c.riderMenuPage-1)*Jt,i=Math.min(s,n+Jt),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${s} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(cr(c.riderMenuTableSort.key))} ${c.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Fo()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(Io).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(d=>`
                <tr class="team-detail-row">
                  ${t.map(l=>ur(d,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${c.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${c.riderMenuPage} / ${r} · Fahrer ${s===0?0:n+1}-${i} von ${s}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${c.riderMenuPage>=r?"disabled":""}>Weiter</button>
      </div>
    </div>`}function Eo(){h("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&hr(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;na.includes(n)&&(c.riderMenuDetailPage=n,new Set(yr().map(o=>o.sortKey).filter(o=>o!=null)).has(c.riderMenuTableSort.key)||(c.riderMenuTableSort={key:"name",direction:"asc"}),c.riderMenuPage=1,Ca());return}const s=e.target.closest("button[data-riders-sort]");if(s){const n=s.dataset.ridersSort;c.riderMenuTableSort.key===n?c.riderMenuTableSort.direction=c.riderMenuTableSort.direction==="asc"?"desc":"asc":c.riderMenuTableSort={key:n,direction:dr(n)},c.riderMenuPage=1,Ca();return}const r=e.target.closest("button[data-riders-page-action]");if(r){const n=r.dataset.ridersPageAction,i=Math.max(1,Math.ceil(c.riders.length/Jt));n==="prev"&&(c.riderMenuPage=Math.max(1,c.riderMenuPage-1)),n==="next"&&(c.riderMenuPage=Math.min(i,c.riderMenuPage+1)),Ca();return}})}const Lp=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:Jt,getActiveRiderMenuTableColumns:yr,getRiderMenuSortIndicator:Ro,initRidersListeners:Eo,renderRiderMenuDetailPageTabs:Fo,renderRiderMenuTableHeader:Io,renderRidersMenu:Ca},Symbol.toStringTag,{value:"Module"})),Ma=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function Ue(e){return e==null?"free-agents":String(e)}function Fn(e){var a;const t=c.riderTeamEditorPayload;return t?((a=t.teams.find(s=>s.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function Dp(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return Kn(t/11.2,0,100)}function Ap(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function Bp(e){return c.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function _p(e){const t=c.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${S(e.title)}"
        aria-label="${S(e.title)}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Bp(e.key)}
      </button>
    </th>`}function Gp(e,t){switch(c.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return te(e.firstName,t.firstName);case"lastName":return te(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return te(Fn(e.teamId),Fn(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return te(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return te(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function Hp(e){const t=c.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>(Gp(a,s)||te(a.lastName,s.lastName)||te(a.firstName,s.firstName)||a.riderId-s.riderId)*t)}function zp(e){const t=c.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(s=>Ue(s.teamId)===t);return Hp(a)}function Kp(e){const t=c.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${Ue(a.teamId)}"${a.teamId===e?" selected":""}>${S(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function Co(e){return c.riderTeamEditorDirtyRiderIds.includes(e)}function Wp(e,t){const a=Co(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${Hs(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${Kp(e.teamId)}</select></td>`;case"number":{const s=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${s}"></td>`}case"text":{const s=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${S(s)}"></td>`}default:return"<td>–</td>"}}function jp(e){const t=[...e.teams].sort((a,s)=>a.rank-s.rank||te(a.name,s.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${c.riderTeamEditorSelectedTeamKey===Ue(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${Ue(a.teamId)}">
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
    </aside>`}function Ne(){var o;const e=h("rider-team-editor-root"),t=h("rider-team-editor-meta"),a=c.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const s=c.riderTeamEditorSelectedTeamKey?a.teams.find(d=>Ue(d.teamId)===c.riderTeamEditorSelectedTeamKey)??null:null,r=zp(a),n=c.riderTeamEditorDirtyRiderIds.length,i=s==null?"Kein Team gewählt":`${s.riderCount} Fahrer · Ø ${s.averageOverall!=null?s.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${s.rank}`;t.textContent=s==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${s.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${c.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(d=>`
                  <option value="${Ue(d.teamId)}"${c.riderTeamEditorSelectedTeamKey===Ue(d.teamId)?" selected":""}>${S(d.name)} (${d.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${S(c.riderTeamEditorSort.key==="teamName"?"Team":((o=Ma.find(d=>d.key===c.riderTeamEditorSort.key))==null?void 0:o.title)??c.riderTeamEditorSort.key)} ${c.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${Ma.map(_p).join("")}
                </tr>
              </thead>
              <tbody>
                ${r.length===0?`<tr><td colspan="${Ma.length}" class="text-muted">${c.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:r.map(d=>`
                    <tr class="team-detail-row${Co(d.riderId)?" rider-team-editor-row-dirty":""}">
                      ${Ma.map(l=>Wp(d,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${jp(a)}
    </div>`}function Op(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),d=o.length===0?null:Math.round(o.reduce((l,p)=>l+p.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:d,rank:0}}),s=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:s.length,averageOverall:s.length===0?null:Math.round(s.reduce((i,o)=>i+o.overallRating,0)/s.length*100)/100,rank:0,isFreeAgents:!0});const r=[...a].sort((i,o)=>{const d=i.averageOverall??-1;return(o.averageOverall??-1)-d||o.riderCount-i.riderCount||te(i.name,o.name)}),n=new Map(r.map((i,o)=>[Ue(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(Ue(i.teamId))??a.length}))}async function No(e=!1){if(c.riderTeamEditorPayload&&!e){Ne();return}h("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await H.getRiderTeamEditor();if(!t.success||!t.data){h("rider-team-editor-root").innerHTML=`<div class="results-empty">${S(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}c.riderTeamEditorPayload=t.data,c.riderTeamEditorDirtyRiderIds=[],c.riderTeamEditorSaving=!1,c.riderTeamEditorExporting=!1,c.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(s=>Ue(s.teamId)===c.riderTeamEditorSelectedTeamKey)||(c.riderTeamEditorSelectedTeamKey="")),Ne()}function Vp(e,t,a){const s=c.riderTeamEditorPayload;if(!s)return;const r=s.riders.find(n=>n.riderId===e);r&&(t==="teamId"?r.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof r[t]=="number"?r[t]=Number.parseInt(a||"0",10):r[t]=a,r.overallRating=Dp(r),s.teams=Op(s),c.riderTeamEditorDirtyRiderIds.includes(e)||(c.riderTeamEditorDirtyRiderIds=[...c.riderTeamEditorDirtyRiderIds,e]),Ne())}async function Up(){if(!c.riderTeamEditorPayload||c.riderTeamEditorSaving)return;c.riderTeamEditorSaving=!0,Ne();const e=await H.saveRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Ne();return}c.riderTeamEditorPayload=e.data,c.riderTeamEditorDirtyRiderIds=[],Ne()}async function Yp(){if(!c.riderTeamEditorPayload||c.riderTeamEditorExporting)return;c.riderTeamEditorExporting=!0,Ne();const e=await H.exportRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Ne();return}xs(e.data.fileName,e.data.content),Ne()}function Zp(){h("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const r=t.dataset.riderTeamEditorSort;c.riderTeamEditorSort.key===r?c.riderTeamEditorSort.direction=c.riderTeamEditorSort.direction==="asc"?"desc":"asc":c.riderTeamEditorSort={key:r,direction:Ap(r)},Ne();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){c.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Ne();return}const s=e.target.closest("button[data-rider-team-editor-action]");if(s){const r=s.dataset.riderTeamEditorAction;if(r==="reload"){No(!0);return}if(r==="export"){Yp();return}r==="save"&&Up()}}),h("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){c.riderTeamEditorSelectedTeamKey=t.value,Ne();return}const a=e.target.closest(".rider-team-editor-input");if(a){const s=Number(a.dataset.riderTeamEditorRiderId),r=a.dataset.riderTeamEditorField;Number.isFinite(s)&&r&&Vp(s,r,a.value)}})}let Xe={key:"pickNumber",asc:!0};function En(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),s=.26+t*.18,r=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${s};--rider-stats-pill-bg-alpha:${r};`}async function Po(e,t=!1){const a=await H.getDraftHistory(e);if(!a.success){c.draftHistory=null,ye("draft")&&Ds(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}c.draftHistory=a.data??null,ye("draft")&&Ds()}function Ds(){const e=h("draft-table-container"),t=h("draft-season-select");if(!c.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const i=c.currentSave.startSeason??2026;for(let o=c.currentSave.currentSeason;o>=i;o--){const d=document.createElement("option");d.value=o.toString(),d.textContent=`Saison ${o}`,t.appendChild(d)}c.draftSelectedSeason||(c.draftSelectedSeason=c.currentSave.currentSeason),t.value=c.draftSelectedSeason.toString(),t.onchange=o=>{const d=o.target;c.draftSelectedSeason=parseInt(d.value,10),Po(c.draftSelectedSeason)}}if(!c.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(c.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...c.draftHistory.rows].sort((i,o)=>{let d=0;const l=Xe.key;return l==="riderLastName"?d=i.riderLastName.localeCompare(o.riderLastName):l==="teamName"?d=i.teamName.localeCompare(o.teamName):l==="oldTeamName"?d=(i.oldTeamName||"").localeCompare(o.oldTeamName||""):l==="countryCode"?d=i.countryCode.localeCompare(o.countryCode):d=(i[l]??0)-(o[l]??0),Xe.asc?d:-d}),s=i=>Xe.key!==i?'<span class="sort-icon-placeholder"></span>':Xe.asc?" ▲":" ▼",r=i=>{Xe.key===i?Xe.asc=!Xe.asc:(Xe.key=i,Xe.asc=!0),Ds()};window.setDraftSort=r;let n=`
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
  `;for(const i of a){const o=c.draftHistory.season-i.riderBirthYear;let d="-";i.oldTeamName&&(d=`<div style="display:flex; align-items:center; gap:0.5rem;">${vt(i.oldTeamId,i.oldTeamName)} ${S(i.oldTeamName)}</div>`);const l=`<div style="display:flex; align-items:center; gap:0.5rem;">${vt(i.teamId,i.teamName)} ${S(i.teamName)}</div>`;n+=`
      <tr>
        <td class="text-center">#${i.pickNumber}</td>
        <td class="text-center">Runde ${i.draftRound}</td>
        <td>${l}</td>
        <td>${d}</td>
        <td class="text-center">${ne(i.countryCode)}</td>
        <td>${S(i.riderFirstName)} ${S(i.riderLastName)}</td>
        <td class="text-center">${o} J.</td>
        <td class="text-center">${i.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${En(i.overallAtDraft)}">${i.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${En(i.potOverallAtDraft)}">${i.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}n+="</tbody></table>",e.innerHTML=n}async function Jp(e=!1){const t=await H.getInjuries();if(!t.success){c.injuries=null,ye("injuries")&&Cn(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}c.injuries=t.data??[],ye("injuries")&&Cn()}function Cn(){const e=h("injuries-table-container");if(!c.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(h("injuries-meta").textContent=c.injuries.length+" Ausfälle",c.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=At;let t="";const a=c.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),s=new Map;for(const n of a){const i=n.teamId;s.has(i)||s.set(i,[]),s.get(i).push(n)}for(const n of s.keys())s.get(n).sort((i,o)=>o.overallRating-i.overallRating);const r=Array.from(s.keys()).sort((n,i)=>{const o=s.get(n)[0].teamAbbreviation||"",d=s.get(i)[0].teamAbbreviation||"";return o.localeCompare(d)});if(r.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of r){const i=s.get(n),o=i[0].teamAbbreviation;t+=`
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
      `;for(const d of i){const l=d.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let p="";if(d.fitDate){const u=se(d.fitDate);if(d.missedRaces&&d.missedRaces.length>0){let m="";for(const f of d.missedRaces)m+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${se(f.startDate)}</span>
                  ${ne(f.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${S(f.name)}</strong>
                  ${tr(f.categoryName)}
                </div>
              `;p=`
              <div class="injury-fit-cell">
                <strong>${u}</strong>
                <div class="injury-fit-tooltip">
                  <div style="margin-bottom: 0.4rem; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.2rem;">Verpasste Rennen (${d.missedRaces.length})</div>
                  ${m}
                </div>
              </div>
            `}else p=`<strong>${u}</strong>`}else p="Unbekannt";t+=`
          <tr>
            <td>${ne(d.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${d.riderId})" style="color: inherit; text-decoration: none;"><strong>${S(d.riderFirstName)} ${S(d.riderLastName)}</strong></a></td>
            <td>${d.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${Ji(d.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${d.unavailableDays} Tage</strong></td>
            <td>${p}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function Nn(e){return e===0?"–":`-${e}`}function qp(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${Qe(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Fe(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function Xp(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${S(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${qp(e.topRiders)}
      </div>
    </div>`}function Qp(e,t){const a=t.filter(s=>s.teamId!=null&&e.teamId!=null&&s.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${Qe(s.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Fe(s.riderName??"–",{riderId:s.riderId,teamId:s.teamId,strong:!1})}</span>
          <strong>${s.points}</strong>
        </div>
      `).join("")}
    </div>`}function eg(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${nt(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${Qp(e,t)}
      </div>
    </div>`}async function tg(e){const t=await H.getSeasonStandings();if(!t.success){c.seasonStandings=null,ye("season-standings")&&As();return}c.seasonStandings=t.data??null,ye("season-standings")&&As()}function As(){var g,b,y,v,T,w;const e=h("season-standings-meta"),t=h("season-standings-scope-tabs"),a=h("season-standings-empty"),s=h("season-standings-table"),r=h("season-standings-tbody"),n=h("season-standings-jersey-header"),i=h("season-standings-primary-header"),o=h("season-standings-flag-header"),d=h("season-standings-secondary-header"),l=((g=c.seasonStandings)==null?void 0:g.season)??((b=c.gameState)==null?void 0:b.season)??((y=c.currentSave)==null?void 0:y.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.",t.innerHTML=`
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
  `;const p=c.selectedSeasonStandingScope==="countries",u=p?((v=c.seasonStandings)==null?void 0:v.countryStandings)??[]:c.selectedSeasonStandingScope==="teams"?((T=c.seasonStandings)==null?void 0:T.teamStandings)??[]:((w=c.seasonStandings)==null?void 0:w.riderStandings)??[],m=p?u:[],f=p?[]:u;if(n.textContent="Trikot",i.textContent=p?"Land":c.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",d.textContent=c.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",p),d.classList.toggle("hidden",p),!c.seasonStandings||u.length===0){r.innerHTML="",s.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}r.innerHTML=p?m.map(x=>`
      <tr>
        <td class="pos-${Math.min(x.rank,3)}">${x.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${Xp(x)}</td>
        <td class="results-flag-col-cell">${Qe(x.countryCode)}</td>
        <td class="hidden"></td>
        <td>${x.points}</td>
        <td>${S(Nn(x.gapPoints))}</td>
      </tr>`).join(""):f.map(x=>{var P;const $=x.riderName??x.teamName,R=Ht(x.teamId,x.teamName),I=c.selectedSeasonStandingScope==="teams"?eg(x,((P=c.seasonStandings)==null?void 0:P.riderStandings)??[]):zt($,!0,!1,x.riderId,x.teamId),C=Qe(x.countryCode),F=c.selectedSeasonStandingScope==="teams"?S(x.countryName??x.countryCode??"–"):nt(x.teamName??"–",x.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(x.rank,3)}">${x.rank}</td>
          <td class="results-jersey-col-cell">${R}</td>
          <td>${I}</td>
          <td class="results-flag-col-cell">${C}</td>
          <td>${F}</td>
          <td>${x.points}</td>
          <td>${S(Nn(x.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),s.classList.remove("hidden")}function ag(){h("season-standings-scope-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-season-scope]");if(!t)return;const a=t.dataset.seasonScope;a!=="riders"&&a!=="teams"&&a!=="countries"||(c.selectedSeasonStandingScope=a,As())})}function Pn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function sg(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,s=[...e].map(l=>({rider:l,score:t(l)})).sort((l,p)=>p.score-l.score).slice(0,10),r=[...e].map(l=>({rider:l,score:a(l)})).sort((l,p)=>p.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,p)=>p.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,p)=>p.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,p)=>p.score-l.score).slice(0,10),d=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,p)=>p.score-l.score).slice(0,10);return{Gesamtklassement:s,Sprinter:r,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:d}}function rg(e,t){const a=c.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const s=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,r=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>s(o)):t==="Sprinter"?n=a.map(o=>r(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,d)=>d-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,d)=>o+d,0)/i.length}function ng(e,t){var i;const s=c.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:rg(o.id,t)}));s.sort((o,d)=>d.avgScore-o.avgScore);const r=s.findIndex(o=>o.teamId===e)+1,n=((i=s.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:r,total:s.length,average:n}}function ig(e){const t=c.riders.filter(r=>r.activeTeamId===e);if(t.length===0)return 0;const a=t.map(r=>r.overallRating??0);a.sort((r,n)=>n-r);const s=a.slice(0,10);return s.length===0?0:s.reduce((r,n)=>r+n,0)/s.length}function og(e){var n;const a=c.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:ig(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const s=a.findIndex(i=>i.teamId===e)+1,r=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:s,total:a.length,average:r}}function wa(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function hs(e){e.countryCode&&ne(e.countryCode);const t=sg(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,p)=>p.formValue-l.formValue).slice(0,10),s=[...e.riders].map(l=>({rider:l,uciRank:Va(l.id)})).filter(l=>l.uciRank!==null).sort((l,p)=>l.uciRank-p.uciRank).slice(0,10),r=Object.entries(t).map(([l,p])=>{const u=ng(e.teamId,l),m=u.average.toFixed(1).replace(".",","),f=p.map(({rider:g,score:b})=>{const y=`${g.firstName.charAt(0)}. ${g.lastName}`,v=Fe(y,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),T=g.nationality?ot[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,w=T?`<span class="fi fi-${T} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",x=c.riders.find(R=>R.id===g.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${wa((x==null?void 0:x.roleId)??null).color};">
            ${w}
            ${v}
          </span>
          <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${b.toFixed(0)}</span>
        </li>
      `}).join("");return`
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
          ${l}
          <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-400); display: block; margin-top: 0.1rem;">Platz ${u.rank}/${u.total} · Ø ${m}</span>
        </h4>
        <ul style="margin: 0; padding: 0; list-style: none;">${f}</ul>
      </div>
    `}).join(""),i=[...e.riders].sort((l,p)=>(p.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const p=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Fe(p,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),m=l.nationality?ot[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=m?`<span class="fi fi-${m} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",g=l.overallRating.toFixed(0),b=c.riders.find(v=>v.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${wa((b==null?void 0:b.roleId)??null).color};">
          ${f}
          ${u}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:p})=>{const u=`${l.firstName.charAt(0)}. ${l.lastName}`,m=Fe(u,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?ot[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",b=(p>=0?"+":"")+p.toFixed(1).replace(".",","),y=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,v=c.riders.find(w=>w.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${wa((v==null?void 0:v.roleId)??null).color};">
          ${g}
          ${m}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${y}">${b}</span>
      </li>
    `}).join(""),d=s.map(({rider:l,uciRank:p})=>{const u=`${l.firstName.charAt(0)}. ${l.lastName}`,m=Fe(u,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?ot[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"";let b="rider-stats-rank-badge-gc";p===1?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":p===2?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":p===3&&(b="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const y=`<span class="rider-stats-rank-badge ${b}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${p}">${p}</span>`,v=c.riders.find(w=>w.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${wa((v==null?void 0:v.roleId)??null).color};">
          ${g}
          ${m}
        </span>
        ${y}
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
  `}function bs(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${c.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${c.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${c.teamStatsTab==="contracts"?"true":"false"}">Auslaufende Verträge</button>
    </div>`}function lg(e){const t=Array.from(new Set(e.topResults.map(m=>m.raceCategoryName).filter(Boolean)));t.sort((m,f)=>m.localeCompare(f,"de"));const a=Array.from(new Set(e.topResults.map(m=>m.season))).sort((m,f)=>f-m);let s=e.topResults.filter(m=>m.rowType!=="stage_result"?m.rowType==="gc_final"?c.teamStatsTopResultsFilters.gc:m.rowType==="mountain_final"?c.teamStatsTopResultsFilters.mountain:m.rowType==="points_final"?c.teamStatsTopResultsFilters.points:m.rowType==="youth_final"?c.teamStatsTopResultsFilters.youth:!0:m.profile==="TTT"||m.isStageRace||m.stageNumber!=null?c.teamStatsTopResultsFilters.stage:c.teamStatsTopResultsFilters.oneDay);if(c.teamStatsTopResultsFilterCategory){const m=c.teamStatsTopResultsFilterCategory;if(m.endsWith("-etappen")){const f=m.substring(0,m.length-8);s=s.filter(g=>g.raceCategoryName===f&&g.rowType==="stage_result")}else if(m.endsWith("-gc")){const f=m.substring(0,m.length-3);s=s.filter(g=>g.raceCategoryName===f&&g.rowType!=="stage_result")}else s=s.filter(f=>f.raceCategoryName===m)}c.teamStatsTopResultsFilterSeason!=null&&(s=s.filter(m=>m.season===c.teamStatsTopResultsFilterSeason)),s.sort((m,f)=>{if(f.seasonPoints!==m.seasonPoints)return f.seasonPoints-m.seasonPoints;const g=m.rowType!=="stage_result",b=f.rowType!=="stage_result",y=m.resultRank??9999,v=f.resultRank??9999;if(c.teamStatsTopResultsFilterCategory)return y!==v?y-v:g!==b?g?-1:1:0;{const T=Pn(m.raceCategoryName),w=Pn(f.raceCategoryName);return T!==w?T-w:g!==b?g?-1:1:y-v}});const r=20,n=Math.max(1,Math.min(10,Math.ceil(s.length/r)));c.teamStatsTopResultsPage>n&&(c.teamStatsTopResultsPage=n);const i=(c.teamStatsTopResultsPage-1)*r,o=s.slice(i,i+r),l=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${t.map(m=>{if(m.toLowerCase().includes("stage race")||m.toLowerCase().includes("grand tour")||m.toLowerCase().includes("tour de france")){const g=`${m}-etappen`,b=`${m}-gc`;return`
        <option value="${S(g)}" ${c.teamStatsTopResultsFilterCategory===g?"selected":""}>${S(m)} - Etappen</option>
        <option value="${S(b)}" ${c.teamStatsTopResultsFilterCategory===b?"selected":""}>${S(m)} - GC</option>
      `}else return`<option value="${S(m)}" ${c.teamStatsTopResultsFilterCategory===m?"selected":""}>${S(m)}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="team-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${a.map(m=>`<option value="${m}" ${c.teamStatsTopResultsFilterSeason===m?"selected":""}>Saison ${m}</option>`).join("")}
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
  `,p=o.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(m=>{const f=m.rowType!=="stage_result",g=f?`${m.raceName} · ${m.rowType==="gc_final"?"Gesamtwertung":m.rowType==="points_final"?"Punktewertung":m.rowType==="mountain_final"?"Bergwertung":"Nachwuchs"}`:m.stageNumber?`${m.raceName} · Etappe ${m.stageNumber}`:m.raceName;let b="–",y="–";m.finishStatus==="otl"?b=$t("OTL","place"):m.finishStatus==="dnf"?b=$t("DNF","place"):m.resultRank==null||(f?y=`<span class="rider-stats-final-type ${m.rowType==="gc_final"?"is-gc":m.rowType==="points_final"?"is-points":m.rowType==="mountain_final"?"is-mountain":"is-youth"}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${m.resultRank}</span>`:b=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${m.resultRank<=3?` rider-stats-rank-badge-top-${m.resultRank}`:""}">${S(String(m.resultRank))}</span>`);const v=m.profile?oa(m.profile):"–",T=!f&&m.stageScore!=null&&m.stageScore>0?Qa(m.stageScore,0,350):"–",w=Oa(m.raceCategoryName),x=m.riderCountryCode?ot[m.riderCountryCode]??m.riderCountryCode.slice(0,2).toLowerCase():null,$=x?`<span class="fi fi-${x} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(m.riderCountryCode??"")}"></span>`:"–",R=Fe(m.riderName,{riderId:m.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${b}</td>
            <td>${y}</td>
            <td>${$}</td>
            <td style="white-space: nowrap;">${R}</td>
            <td><strong>${S(g)}</strong></td>
            <td class="status-cell">${sr(m)}</td>
            <td>${v}</td>
            <td>${T}</td>
            <td>${w}</td>
            <td>Saison ${m.season}</td>
            <td><strong>${m.seasonPoints}</strong></td>
          </tr>
        `}).join(""),u=n>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${c.teamStatsTopResultsPage-1}" ${c.teamStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        ${Array.from({length:n}).map((m,f)=>{const g=f+1;return`<button type="button" class="btn btn-sm ${c.teamStatsTopResultsPage===g?"btn-primary":"btn-secondary"}" data-team-top-results-page="${g}">${g}</button>`}).join("")}
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${c.teamStatsTopResultsPage+1}" ${c.teamStatsTopResultsPage===n?"disabled":""}>Weiter &raquo;</button>
      </div>
    `:"";return`
    <section class="rider-stats-top-results" style="margin-top: 1.5rem;">
      ${l}
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table">
          <colgroup>
            <col style="width: 6%;">
            <col style="width: 8%;">
            <col style="width: 4%;">
            <col style="width: 15%;">
            <col style="width: 21%;">
            <col style="width: 10%;">
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
            ${p}
          </tbody>
        </table>
      </div>
      ${u}
    </section>
  `}function dg(e){const t=String(c.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,categories:{}},s=t==="all",r=u=>s?u:"–",n=(u,m)=>s?`${u} / ${m} T`:"–",i=s?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(u,m,f,g)=>{const b=typeof u=="number"?u:parseFloat(String(u))||0;let y="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return b===0?y+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":m==="gold"?y+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":m==="silver"?y+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":m==="bronze"?y+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":m==="purple"?y+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":m==="green"?y+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":m==="red"?y+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":m==="white"&&(y+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${y}" title="${S(f)}: ${b} Siege">${u}</span>`},d=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #fff;">Karrierestatistiken (Team)</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="team-stats-success-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
        <select id="team-stats-success-season-select" class="form-control" style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">
          <option value="all" ${s?"selected":""}>Ewig (All-Time)</option>
          ${Object.keys(e.successStats).filter(u=>u!=="all").sort((u,m)=>m.localeCompare(u)).map(u=>`
            <option value="${u}" ${String(c.teamStatsSelectedSeason)===u?"selected":""}>Saison ${u}</option>
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
        ${d.map(u=>{const m=a.categories[u.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(u.name)}">${S(u.name)}</span>
                ${tr(u.key)}
              </div>
              
              ${u.isStage?`
                <!-- Stage Race layout: GC & Classifications -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">GC & Wertungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${o(m.gcWins,"gold","Gesamtwertung Siege")}
                    ${o(m.gcSecond,"silver","Gesamtwertung Platz 2")}
                    ${o(m.gcThird,"bronze","Gesamtwertung Platz 3")}
                    ${o(m.gcTopTen||0,"purple","Gesamtwertung Ränge 4-10")}
                    <span style="border-left: 1px solid rgba(255,255,255,0.15); height: 1rem; margin: 0 0.1rem; display: inline-block;"></span>
                    ${o(m.mountainWins,"red","Bergwertung Siege")}
                    ${o(m.pointsWins,"green","Punktewertung Siege")}
                    ${o(m.youthWins,"white","Nachwuchswertung Siege")}
                    ${o(m.breakawayWins||0,"purple","Ausreißerwertung Siege")}
                  </div>
                </div>
                
                <!-- Etappenergebnisse -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Etappenergebnisse</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${o(m.stageWins,"gold","Etappensiege")}
                    ${o(m.stageSecond,"silver","Etappen Platz 2")}
                    ${o(m.stageThird,"bronze","Etappen Platz 3")}
                    ${o(m.stageTopTen||0,"purple","Etappen Ränge 4-10")}
                  </div>
                </div>

                <!-- Führungstrikots -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Führungstrikot Tage</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    <!-- Gelbes Trikot (GC) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(m.leaderJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);"}" title="Tage im Gelben Trikot (GC)">
                      🎽 ${m.leaderJerseys||0}
                    </span>
                    <!-- Grünes Trikot (Punkte) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(m.pointsJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #bbf7d0, #4ade80); color: #14532d; border: 1px solid #22c55e; box-shadow: 0 0 4px rgba(74, 222, 128, 0.4);"}" title="Tage im Grünen Trikot (Punkte)">
                      🎽 ${m.pointsJerseys||0}
                    </span>
                    <!-- Rotes Trikot (Berg) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(m.mountainJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #fecaca, #f87171); color: #7f1d1d; border: 1px solid #ef4444; box-shadow: 0 0 4px rgba(248, 113, 113, 0.4);"}" title="Tage im Berg- / Roten Trikot (Berg)">
                      🎽 ${m.mountainJerseys||0}
                    </span>
                    <!-- Weißes Trikot (Nachwuchs) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(m.youthJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #ffffff, #e2e8f0); color: #1e293b; border: 1px solid #94a3b8; box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);"}" title="Tage im Weißen Trikot (Nachwuchs)">
                      🎽 ${m.youthJerseys||0}
                    </span>
                    <!-- Ausreißertrikot (Aktivste Fahrer) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(m.breakawayJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #f3e8ff, #d8b4fe); color: #581c87; border: 1px solid #a855f7; box-shadow: 0 0 4px rgba(168, 85, 247, 0.4);"}" title="Tage im Ausreißertrikot (Aktivste Fahrer)">
                      🎽 ${m.breakawayJerseys||0}
                    </span>
                  </div>
                </div>
              `:`
                <!-- One Day Race layout: Platzierungen -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Platzierungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${o(m.oneDayWins,"gold","Siege")}
                    ${o(m.oneDaySecond,"silver","Platz 2")}
                    ${o(m.oneDayThird,"bronze","Platz 3")}
                    ${o(m.oneDayTopTen||0,"purple","Ränge 4-10")}
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
                  ${o(m.sprintWins||0,"green","Sprint: Gewonnene Zwischensprints")}
                  ${o(m.climbWinsHC||0,"red","HC: Gewonnene HC-Bergwertungen")}
                  ${o(m.climbWins1||0,"red","C1: Gewonnene Bergwertungen Kategorie 1")}
                  ${o(m.climbWins2||0,"red","C2: Gewonnene Bergwertungen Kategorie 2")}
                  ${o(m.climbWins3||0,"red","C3: Gewonnene Bergwertungen Kategorie 3")}
                  ${o(m.climbWins4||0,"red","C4: Gewonnene Bergwertungen Kategorie 4")}
                </div>
              </div>

              <!-- Profil Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Profil Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${re(m.winFlat||0,"flat","Flach (Flat)")}
                  ${re(m.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${re(m.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${re(m.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${re(m.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${re(m.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${re(m.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${re(m.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${re(m.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${re(m.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${re(m.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${be(m.winWeather1||0,1,"Sonnig")}
                  ${be(m.winWeather2||0,2,"Extreme Hitze")}
                  ${be(m.winWeather3||0,3,"Leichter Regen")}
                  ${be(m.winWeather4||0,4,"Starkregen")}
                  ${be(m.winWeather5||0,5,"Starker Wind")}
                  ${be(m.winWeather6||0,6,"Dichter Nebel")}
                  ${be(m.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${ee.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${m.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}function cg(e){var r;const t=((r=c.gameState)==null?void 0:r.season)??new Date().getFullYear(),a=[...e.riders].sort((n,i)=>{const o=n.contractEndSeason??9999,d=i.contractEndSeason??9999;return o!==d?o-d:i.overallRating-n.overallRating});return`
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
            ${a.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Vertragsdaten verfügbar.</td></tr>':a.map(n=>{const i=n.nationality?ot[n.nationality]??n.nationality.slice(0,2).toLowerCase():null,o=i?`<span class="fi fi-${i} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(n.nationality)}"></span>`:"–",d=Fe(`${n.firstName} ${n.lastName}`,{riderId:n.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),l=c.riders.find(b=>b.id===n.id),p=`<span class="results-roster-overall-badge" style="color:${Ln(n.overallRating)}" title="Stärke: ${n.overallRating.toFixed(2)}">${n.overallRating.toFixed(1)}</span>`;let u="–";l&&l.potential!=null&&(u=`<span class="results-roster-overall-badge" style="color:${Ln(l.potential)}" title="Potential: ${l.potential.toFixed(2)}">${l.potential.toFixed(1)}</span>`);const m=n.contractEndSeason===t,f=n.contractEndSeason?`Saison ${n.contractEndSeason}`:"Ohne Vertrag",g=m?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${S(f)}</span>`:`<span style="font-weight: 500;">${S(f)}</span>`;return`
          <tr class="rider-stats-row">
            <td>${o}</td>
            <td style="white-space: nowrap;">${d}</td>
            <td>${n.age}</td>
            <td>${p}</td>
            <td>${u}</td>
            <td>${g}</td>
          </tr>
        `}).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `}function Ln(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function gt(e){return c.teamStatsTab==="career"?`
      ${hs(e)}
      ${bs()}
      ${dg(e)}
    `:c.teamStatsTab==="contracts"?`
      ${hs(e)}
      ${bs()}
      ${cg(e)}
    `:`
    ${hs(e)}
    ${bs()}
    ${lg(e)}
  `}function ug(e,t){var s;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((s=c.teams.find(r=>r.id===e))==null?void 0:s.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${S(a)}" aria-label="${S(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S(Hn(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function Lo(e){c.teamStatsSelectedTeamId=e,c.teamStatsTab="topResults",c.teamStatsTopResultsFilterCategory=null,c.teamStatsTopResultsFilterSeason=null,c.teamStatsSelectedSeason="all",c.teamStatsTopResultsPage=1;const t=c.teams.find(n=>n.id===e);h("team-stats-title").innerHTML=t?`Team <strong>${S(t.name)}</strong>`:"Teamstatistik",h("team-stats-jersey").innerHTML=ug(e,(t==null?void 0:t.name)??"");const a=og(e),s=a.average.toFixed(2).replace(".",",");h("team-stats-meta").innerHTML=t?`${S(t.abbreviation)} · ${S(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${s})`:"Daten werden geladen",h("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,je("teamStats");const r=await H.getTeamStats(e);if(c.teamStatsSelectedTeamId===e){if(!r.success||!r.data){h("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${S(r.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}c.teamStatsPayload=r.data,h("team-stats-body").innerHTML=gt(r.data)}}function mg(){h("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-stats-tab]");if(a){const r=a.dataset.teamStatsTab;(r==="topResults"||r==="career"||r==="contracts")&&(c.teamStatsTab=r,c.teamStatsPayload&&(h("team-stats-body").innerHTML=gt(c.teamStatsPayload)));return}const s=t.closest("button[data-team-top-results-page]");if(s){const r=Number(s.dataset.teamTopResultsPage);!isNaN(r)&&r>=1&&(c.teamStatsTopResultsPage=r,c.teamStatsPayload&&(h("team-stats-body").innerHTML=gt(c.teamStatsPayload)));return}}),h("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;c.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=gt(c.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;c.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=gt(c.teamStatsPayload))}else if(t.classList.contains("team-stats-filter-checkbox")){const a=t,s=a.dataset.filterType;c.teamStatsTopResultsFilters[s]=a.checked,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=gt(c.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;c.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),c.teamStatsPayload&&(h("team-stats-body").innerHTML=gt(c.teamStatsPayload))}})}let Rt="riders",tt="season",vr="season",We="";const Ya=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function pg(){const e=h("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");fg(o)})})}const t=h("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");hg(o)})})}Ya.forEach(n=>{const i=h(n);i&&i.addEventListener("change",()=>{const o=i.value;o?bg(o,n):Ya.some(l=>{const p=h(l);return p&&p.value!==""})||(We="",Bt())})}),window.openRiderStatsFromLeaderboard=At;const a=h("leaderboard-filter-wt"),s=h("leaderboard-filter-pt"),r=h("leaderboard-filter-other");[a,s,r].forEach(n=>{n&&n.addEventListener("change",()=>{Bt()})})}function gg(){Bt()}function fg(e){Rt=e;const t=h("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&((yg(We)||We==="strongest_lieutenants")&&(vg(),We=""),tt==="live"&&(tt=vr,Na())),Bt()}function hg(e){tt=e,vr=e,Bt()}function bg(e,t){We=e,Ya.forEach(a=>{if(a!==t){const s=h(a);s&&(s.value="")}}),Do(e)?(tt="live",Na()):Sr(e)?(tt="alltime",Na()):(tt=vr,Na()),Bt()}function Do(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function Sr(e){return["max_short_term_fatigue","max_long_term_fatigue","max_combined_fatigue","max_s_form","max_r_form","max_combined_form","mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function yg(e){return Do(e)||Sr(e)||e==="mentors_ranking"}function vg(){Ya.forEach(e=>{const t=h(e);t&&(t.value="")})}function Na(){const e=h("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');tt==="live"?e.style.display="none":(e.style.display="flex",Sr(We)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),tt==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function Bt(){var u,m,f;const e=h("leaderboard-empty"),t=h("leaderboard-table"),a=h("leaderboard-thead"),s=h("leaderboard-tbody");if(!e||!t||!a||!s)return;const r=h("leaderboard-filter-container");if(r&&(r.style.display=Rt==="teams"?"none":"flex"),!We){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await H.getLeaderboards(Rt,We,tt);if(!ye("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(Rt==="riders"){const g=((u=h("leaderboard-filter-wt"))==null?void 0:u.checked)??!0,b=((m=h("leaderboard-filter-pt"))==null?void 0:m.checked)??!0,y=((f=h("leaderboard-filter-other"))==null?void 0:f.checked)??!1;if(i=n.data.filter(v=>{const T=v.teamDivisionId===1&&!v.isRetired,w=v.teamDivisionId===2&&!v.isRetired,x=v.teamDivisionId===null||v.teamDivisionId===void 0||v.isRetired||v.teamDivisionId!==1&&v.teamDivisionId!==2;return!!(T&&g||w&&b||x&&y)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const o=We==="highest_leadout_bonus",d=We==="strongest_lieutenants";Rt==="riders"?a.innerHTML=`
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 50px; text-align: center;">Trikot</th>
        <th style="width: 60px; text-align: center;">Land</th>
        <th>Fahrer</th>
        <th>Team</th>
        ${o?"<th>Rennen / Etappe / Jahr</th>":""}
        ${d?"<th>Fährt für</th>":""}
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
    `;let l="",p=1;for(const g of i){const b=p++,v=`<span class="badge ${b===1?"badge-primary":b<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${b}</span>`,T=vt(g.teamId,g.teamName);let w="";if(o){const $=g.stageNumber!=null?`Etappe ${g.stageNumber}`:"–";w=`<td style="vertical-align: middle;">${S(g.raceName??"–")} · ${S($)} · ${S(String(g.season??"–"))}</td>`}let x="";if(d)if(g.lieutenantDetails){const $=g.lieutenantDetails,R=$.leaderNationality?ne($.leaderNationality):"",I=$.leaderRoleName?` (${$.leaderRoleName})`:"";x=`
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${R}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${$.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${S($.leaderFirstName)} ${S($.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${S(I)}</span>
            </span>
          </td>
        `}else x='<td style="vertical-align: middle;">–</td>';if(Rt==="riders"){const $=g.nationality?ne(g.nationality):"—",R=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${g.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.firstName)} ${S(g.lastName)}</a>`,I=g.teamAbbr?`<span class="text-muted" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</span>`:"—";l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${v}</td>
          <td style="text-align: center; vertical-align: middle;">${T}</td>
          <td style="text-align: center; vertical-align: middle;">${$}</td>
          <td style="vertical-align: middle;">${R}</td>
          <td style="vertical-align: middle;">${I}</td>
          ${w}
          ${x}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}else{let $="";if(g.leadoutDetails){const R=g.leadoutDetails,I=R.sprinterNationality?ne(R.sprinterNationality):"";$=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">${S(g.teamName.split(" (Sprinter:")[0])}</div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${I}${S(R.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${R.contributors.map(C=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${C.nationality?ne(C.nationality):""}${S(C.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${C.contribution.toFixed(2)})</span>
                  </div>
                `).join("")}
            </div>
          </div>
        `}else $=`<strong>${S(g.teamName??"")}</strong>`;l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${v}</td>
          <td style="text-align: center; vertical-align: middle;">${T}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${$}</td>
          ${w}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}}s.innerHTML=l}let Pt=2026,De=5,Dn=!1;const Sg=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function An(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${s}`}function kg(e,t){const a=[],s=new Date(e,t,1),r=new Date(e,t+1,0);let i=(s.getDay()+6)%7;const o=new Date(s);o.setDate(o.getDate()-i);const d=new Date(o);for(;d<=r||d.getDay()!==1;){const l=[];for(let p=0;p<7;p++)l.push(new Date(d)),d.setDate(d.getDate()+1);a.push(l)}return a}function $g(){if(Dn)return;Dn=!0,h("calendar-prev-month").addEventListener("click",()=>{De--,De<0&&(De=11,Pt--),Pa()}),h("calendar-next-month").addEventListener("click",()=>{De++,De>11&&(De=0,Pt++),Pa()}),h("calendar-today-btn").addEventListener("click",()=>{var t;if((t=c.gameState)!=null&&t.currentDate){const[a,s]=c.gameState.currentDate.split("-").map(Number);Pt=a,De=s-1}Pa()}),h("calendar-race-search").addEventListener("input",()=>{Ao()}),h("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&Ps(s)}}),h("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&Ps(r);return}const s=t.target.closest("button[data-dashboard-race-participants-id]");if(s){const r=Number(s.dataset.dashboardRaceParticipantsId);Number.isFinite(r)&&$o(r)}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const s=a.dataset.raceId;s&&document.querySelectorAll(`[data-race-id="${s}"]`).forEach(r=>{r.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const s=a.dataset.raceId;s&&document.querySelectorAll(`[data-race-id="${s}"]`).forEach(r=>{r.classList.remove("calendar-highlight")})}},!0))}function Tg(){var e;if((e=c.gameState)!=null&&e.currentDate){const[t,a]=c.gameState.currentDate.split("-").map(Number);Pt=t,De=a-1}Pa()}function Pa(){var r;if(!ye("calendar"))return;h("calendar-month-label").textContent=`${Sg[De]} ${Pt}`;const e=kg(Pt,De),t=h("calendar-weeks"),a=((r=c.gameState)==null?void 0:r.currentDate)??"";let s="";for(const n of e){const i=n.map(An),o=[];for(const u of c.races)if(u.startDate<=i[6]&&u.endDate>=i[0]){const m=u.startDate<i[0]?0:i.indexOf(u.startDate),f=u.endDate>i[6]?6:i.indexOf(u.endDate);o.push({race:u,startIdx:m,endIdx:f})}o.sort((u,m)=>{const f=u.endIdx-u.startIdx+1,g=m.endIdx-m.startIdx+1;return g!==f?g-f:u.startIdx-m.startIdx});const d=Array.from({length:3},()=>Array(7).fill(!1));for(const u of o){let m=2;for(let f=0;f<3;f++){let g=!0;for(let b=u.startIdx;b<=u.endIdx;b++)if(d[f][b]){g=!1;break}if(g){m=f;break}}for(let f=u.startIdx;f<=u.endIdx;f++)d[m][f]=!0;u.slot=m}const l=n.map(u=>{const m=An(u);return`
        <div class="${["calendar-day-cell",u.getMonth()!==De?"other-month":"",m===a?"today":""].filter(Boolean).join(" ")}">
          <span class="calendar-day-number">${u.getDate()}</span>
        </div>
      `}).join(""),p=o.map(u=>{var w;const m=u.race,f=a>=m.startDate&&a<=m.endDate,g=a>m.endDate,b=ea((w=m.category)==null?void 0:w.name),y=f?'<span class="calendar-live-dot"></span>':"",v=g?"opacity: 0.55;":"",T=u.endIdx-u.startIdx+1;return`
        <div class="calendar-event-bar ${f?"is-live":""}"
             data-race-id="${m.id}"
             style="grid-column: ${u.startIdx+1} / span ${T};
                    grid-row: ${u.slot+1};
                    background-color: ${b.background};
                    border: 1px solid ${b.border};
                    color: ${b.color};
                    ${v}"
             title="${S(m.name)} (${se(m.startDate)} - ${se(m.endDate)})">
          ${y}<span class="calendar-event-name">${S(m.name)}</span>
        </div>
      `}).join("");s+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${p}</div>
      </div>
    `}t.innerHTML=s,Ao()}function Ao(){var n;const e=h("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=h("calendar-races-tbody"),s=((n=c.gameState)==null?void 0:n.currentDate)??"",r=c.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(r.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=r.map(i=>{var y,v,T,w;const o=s>=i.startDate&&s<=i.endDate,l=s>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',p=((y=i.country)==null?void 0:y.name)??`Land ${i.countryId}`,u=(v=i.country)!=null&&v.code3?ne(i.country.code3):"",m=i.isStageRace?(i.stages??[]).reduce((x,$)=>x+($.distanceKm??0),0):((T=i.upcomingStage)==null?void 0:T.distanceKm)??null,f=i.isStageRace?(i.stages??[]).reduce((x,$)=>x+($.elevationGainMeters??0),0):((w=i.upcomingStage)==null?void 0:w.elevationGainMeters)??null,g=m!=null?String(m.toFixed(1)).replace(".",","):"-",b=f!=null?String(Math.round(f)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${se(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${S(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${pr(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${u}<span>${S(p)}</span></span></td>
        <td>${es(i)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${i.id}">Teilnehmer</button></td>
        <td>${g}</td>
        <td>${b}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}window.openTeamStats=Lo;async function Bo(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}Gs("game"),h("meta-career").textContent=((e=c.currentSave)==null?void 0:e.careerName)??"",Tt("dashboard"),ve("Spiel wird geladen…");try{await gr(),await fr(),as()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{ge()}}function xg(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";Tt(t),t==="dashboard"&&as(),t==="teams"&&Ua(),t==="riders"&&Ua(),t==="rider-team-editor"&&No(),t==="live-race"&&Nt(),t==="results"&&$e(),t==="draft"&&Po(c.draftSelectedSeason||((a=c.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&Jp(),t==="season-standings"&&tg(),t==="leaderboards"&&gg(),t==="calendar"&&Tg(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&Yi()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&At(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&Lo(a)}),h("btn-cancel-new").addEventListener("click",()=>ze("newCareer")),h("btn-close-race-stages").addEventListener("click",()=>ze("raceStages")),h("btn-close-stage-profile").addEventListener("click",()=>ze("stageProfile")),h("btn-close-rider-program").addEventListener("click",()=>ze("riderProgram")),h("btn-close-rider-stats").addEventListener("click",()=>ze("riderStats")),h("btn-close-team-stats").addEventListener("click",()=>ze("teamStats")),h("btn-close-race-participants").addEventListener("click",()=>ze("raceParticipants")),h("btn-close-roster-editor").addEventListener("click",()=>Ns()),h("btn-cancel-roster-editor").addEventListener("click",()=>Ns()),h("btn-apply-roster-editor").addEventListener("click",()=>{gp()}),h("btn-back-menu").addEventListener("click",()=>{jt==null||jt.pause(),Gs("menu"),ta()}),Xo(),Ep(),$g(),mo(),Eo(),Zp(),fp(),lp(),Cm(),Um(),mg(),ag(),pg()}(async()=>(am(),de(),xg(),Gs("menu"),await ta()))();
