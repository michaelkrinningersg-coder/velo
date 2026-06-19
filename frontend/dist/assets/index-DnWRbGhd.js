(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();function ai(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Ar(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function ut(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function ur(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function _e(e,t={}){const a=t.strong===!1?"span":"strong",r=Ar("app-rider-link-label",t.labelClassName),s=`<${a} class="${r}">${ai(e)}</${a}>`;if(t.riderId==null)return s;const n=['type="button"','class="'+Ar("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${s}</button>`}function ot(e,t,a=!0,r=""){const s=a===!1?"span":"strong",n=`<${s} class="app-team-link-label">${ai(e)}</${s}>`;return t==null?n:`<button type="button" class="${Ar("app-team-link",r)}" data-team-id="${t}">${n}</button>`}function ri(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function si(e){return Math.round(e*10)/10}function ni(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function ii(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function oi(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function ll(e,t){return e.skills.stamina*(t/300)}function li(e,t,a){return e.skills.timeTrial+oi(e,t)+e.skills.mountain*(a/500)}function dl(e,t,a,r){const s=ll(e,a),n=oi(e,r);switch(t.profile){case"Flat":return .8*e.skills.sprint+.15*e.skills.acceleration+.05*e.skills.flat+n+s;case"Rolling":return .7*e.skills.sprint+.2*e.skills.acceleration+.1*e.skills.hill+n+s;case"Hilly":return .45*e.skills.sprint+.1*e.skills.flat+.45*e.skills.hill+n+s;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+s;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+s;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+s;case"High_Mountain":return e.skills.mountain+n+s;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+s;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+s;default:return .8*e.skills.sprint+.2*e.skills.flat+n+s}}function cl(e,t,a,r,s){return t.profile==="ITT"||t.profile==="TTT"?li(e,s,r):dl(e,t,a,s)}function ul(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:si(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function di(e,t,a,r){ni(a,r);const s=ii(a,r),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const p=o.get(l.activeTeamId)??[];p.push(l),o.set(l.activeTeamId,p)}return[...o.entries()].map(([l,p])=>{const u=n.get(l),f=p.map(v=>li(v,ri(v.id,r==null?void 0:r.dailyFormByRiderId),s)).sort((v,x)=>x-v).slice(0,5),g=f.length,b=g>0?f.reduce((v,x)=>v+x,0)/g:0,y=Math.max(0,5-g)*2;return{team:u??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:b-y}}).sort((l,p)=>p.score-l.score||l.team.id-p.team.id).slice(0,20).map((l,p)=>({rank:p+1,kind:"team",effectiveSkill:si(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(r!=null?Ua(e,t,a,r):Ua(e,t,a)).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id).slice(0,20).map((o,d)=>ul(o,d+1))}function Ua(e,t,a,r){const s=ni(a,r),n=ii(a,r),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var d;return{rider:o,teamName:o.activeTeamId!=null?((d=i.get(o.activeTeamId))==null?void 0:d.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:cl(o,a,s,n,ri(o.id,r==null?void 0:r.dailyFormByRiderId))}}).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id)}const c={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,draftHistory:null,injuries:null,draftSelectedSeason:null,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorHideBoringSegments:!0,stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1,autoProgressTargetDate:null,raceProgramsPayload:null,raceProgramsActiveTab:"calendar-cols",raceProgramsDirty:!1,raceProgramsSaving:!1};let oa=null;function ml(e){oa=e}let rs=!1;function Hs(e){rs=e}let ci=null;function Gs(e){ci=e}let Br=null;function zs(e){Br=e}let mt=!1;function ui(e){mt=e}function h(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ie(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function Ya(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),r=Math.floor(e%60),s=String(a).padStart(2,"0"),n=String(r).padStart(2,"0");return t>0?`${t}:${s}:${n}`:`${a}:${n}`}function xr(e){return e==null||e===0?"–":`+${Ya(e)}`}const za=2,Hr=3,mi=4;function pi(e){return`/jersey/Jer_${e}.png`}function Nt(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((r=c.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${S(a)}" aria-label="${S(a)}">
      <img
        class="results-team-jersey-img"
        src="${S(pi(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function ra(e,t){return`<span class="results-jersey-cell">${Nt(e,t)}</span>`}function lt(e){return e&&de(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function Ct(e){var a;if(e==null)return null;const t=Ie(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function Ie(e){return e==null?null:c.riders.find(t=>t.id===e)??null}function kt(e){return e==null?null:c.races.find(t=>t.id===e)??null}function Za(e){var t;if(e==null)return null;for(const a of c.races){const r=(t=a.stages)==null?void 0:t.find(s=>s.id===e);if(r)return{race:a,stage:r}}return null}function sa(e,t=!0,a=!1,r=null,s=null){const n=_e(e,{riderId:r,teamId:s,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function pl(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function Gr(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function zr(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function gl(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}const je={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function de(e){const t=je[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function fl(e,t){return e?`<span class="country-chip">${de(e.code3)}<span>${S(e.name)}</span></span>`:t?S(t):"–"}function Kr(e){return`${e.toFixed(2).replace(".",",")} km`}function Wr(e){return`${Math.round(e)} hm`}const hl=new Set;function ss(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),h(`screen-${e}`).classList.remove("hidden")}function Qe(e){h(`modal-${e}`).classList.remove("hidden")}function Je(e){h(`modal-${e}`).classList.add("hidden")}function Ks(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function gi(){var b,y;const e=c.realtimeBootstrap;if(!e)return;const t=h("instant-sim-favorites"),a=h("instant-sim-gc"),r=h("instant-sim-points");if(!t||!a||!r)return;const s=h("instant-sim-race"),n=h("instant-sim-stage-desc"),i=h("instant-sim-date");s&&(s.textContent=e.race.name),n&&(n.textContent=`Etappe ${e.stage.stageNumber} · ${e.stage.profile}`),i&&(i.textContent=ie(e.stage.date));const d=di(e.riders,e.teams,e.stage,{distanceKm:(b=e.stageSummary)==null?void 0:b.distanceKm,elevationGainMeters:(y=e.stageSummary)==null?void 0:y.elevationGainMeters}).slice(0,10),l=new Map(e.gcStandings.map(v=>[v.riderId,v]));let p=`
    <h3>
      <span>Etappen-Favoriten</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const v of d){const x=e.riders.find(F=>F.id===v.riderId);if(!x)continue;const M=Ct(x.id)??"un",T=je[M]??"un",$=e.teams.find(F=>F.id===x.activeTeamId),w=($==null?void 0:$.abbreviation)??"—",C=l.get(x.id),E=C?`GC ${C.rank} (${C.rank===1?"Gelb":Ks(C.gapSeconds)})`:"GC –";p+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${x.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${v.rank}</span>
            <span class="fi fi-${T} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${S(x.firstName)} <strong>${S(x.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(w)}</span>
            <span class="instant-sim-gc-info">${E}</span>
          </div>
        </div>
      </div>
    `}p+="</div>",t.innerHTML=p;const u=e.gcStandings.slice(0,10);let m=`
    <h3>
      <span>Gesamtwertung (GC)</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const v of u){const x=e.riders.find(E=>E.id===v.riderId);if(!x)continue;const M=Ct(x.id)??"un",T=je[M]??"un",$=e.teams.find(E=>E.id===x.activeTeamId),w=($==null?void 0:$.abbreviation)??"—",C=v.rank===1?"Gelb":Ks(v.gapSeconds);m+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${x.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${v.rank}</span>
            ${zr(v.previousRank,v.rankDelta)}
            <span class="fi fi-${T} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${S(x.firstName)} <strong>${S(x.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(w)}</span>
            <span class="instant-sim-gc-info">${C}</span>
          </div>
        </div>
      </div>
    `}m+="</div>",a.innerHTML=m;const f=e.pointsStandings.slice(0,10);let g=`
    <h3>
      <span>Punktewertung</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const v of f){if(v.riderId==null)continue;const x=e.riders.find(E=>E.id===v.riderId);if(!x)continue;const M=Ct(x.id)??"un",T=je[M]??"un",$=e.teams.find(E=>E.id===x.activeTeamId),w=($==null?void 0:$.abbreviation)??"—",C=`${v.points??0} Punkte`;g+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${x.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${v.rank}</span>
            ${zr(v.previousRank,v.rankDelta)}
            <span class="fi fi-${T} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${S(x.firstName)} <strong>${S(x.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(w)}</span>
            <span class="instant-sim-gc-info">${C}</span>
          </div>
        </div>
      </div>
    `}g+="</div>",r.innerHTML=g}function Re(e="Lade…"){var r;const t=mt?" (Leertaste zum Stoppen)":"",a=h("default-loader");a&&(h("loading-msg").textContent=e+t,h("loading-progress").classList.add("hidden"),a.classList.remove("hidden"),(r=h("instant-sim-panel"))==null||r.classList.add("hidden")),h("loading-overlay").classList.remove("hidden")}function ke(){h("loading-overlay").classList.add("hidden")}function bl(e){var t,a;if((t=h("default-loader"))==null||t.classList.add("hidden"),(a=h("instant-sim-panel"))==null||a.classList.remove("hidden"),h("loading-overlay").classList.remove("hidden"),c.realtimeBootstrap)gi();else{const r=h("instant-sim-favorites"),s=h("instant-sim-gc");r&&(r.innerHTML=""),s&&(s.innerHTML="")}fi(e)}function fi(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),r=`Instant-Simulation läuft … ${t}%${mt?" (Leertaste zum Stoppen)":""}`,s=h("loading-msg");s&&(s.textContent=r);const n=h("loading-progress-bar");n&&(n.style.width=`${t}%`);const i=h("instant-loading-msg");i&&(i.textContent=r);const o=h("instant-loading-progress-bar");o&&(o.style.width=`${t}%`);const d=h("instant-sim-favorites");d&&d.innerHTML.trim()===""&&c.realtimeBootstrap&&gi()}function Et(e,t){const a=h(e);a.textContent=t,a.classList.remove("hidden")}function fa(e){h(e).classList.add("hidden")}function At(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),h(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),h("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of hl)try{a(e)}catch(r){console.error(`Fehler bei View-Aktivierung von "${e}":`,r)}}function Me(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function la(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function hi(e,t,a){return Math.max(t,Math.min(a,e))}function Tr(e,t,a){return Math.round(e+(t-e)*a)}function Ws(e,t,a){return`rgb(${Tr(e[0],t[0],a)} ${Tr(e[1],t[1],a)} ${Tr(e[2],t[2],a)})`}function ns(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=hi(e,t[0].value,t[t.length-1].value);for(let r=1;r<t.length;r+=1){const s=t[r-1],n=t[r];if(a<=n.value){const i=(a-s.value)/(n.value-s.value);return Ws(s.color,n.color,i)}}return Ws(t[t.length-1].color,t[t.length-1].color,1)}function bi(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${ns(e)}"${a}>${e.toFixed(2)}</span>`}function yl(e,t,a){if(t==null)return bi(e,a);const r=Math.round((e-t)*100)/100,s=r>0?"skill-delta-positive":r<0?"skill-delta-negative":"skill-delta-neutral",n=r>0?"+":"",i=`<span class="skill-delta ${s}">${n}${r.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${ns(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function vl(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function js(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",r=t>0?"+":"";return`<span class="${a}">${r}${t.toFixed(1).replace(".",",")}</span>`}function Os(e,t="none",a){const r=e??0,s=["race-sim-form-negative"];t==="warning"&&s.push("load-warning"),t==="critical"&&s.push("load-warning-critical");const n=a?` title="${S(a)}"`:"";return r===0?`<span class="${s.join(" ")}"${n}>0,0</span>`:`<span class="${s.join(" ")}"${n}>-${r.toFixed(1).replace(".",",")}</span>`}function yi(e){const t=e.seasonFormPhase??"neutral";return vi(t)}function vi(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${S(a.label)}">${a.symbol}</span>`}function Sl(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${S(e.seasonProgram.name)}</button>`:"–"}function Lt(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Ae(e){return`${e.lastName} ${e.firstName}`}function kl(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,r=e.unavailableUntil?` bis ${ie(e.unavailableUntil)}`:"",s=`${t}: noch ${a} Tag${a===1?"":"e"}${r}`;return`<span class="rider-availability-marker" title="${S(s)}" aria-label="${S(s)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function St(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function jr(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=e,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(r)}async function J(e,t,a){try{const r=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(r.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await r.text();return{success:!1,error:r.ok?"Antwort war kein JSON.":`HTTP ${r.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return r.json()}catch(r){return{success:!1,error:`Netzwerkfehler: ${r.message}`}}}const V={listSaves:()=>J("GET","/api/saves"),createSave:(e,t,a)=>J("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>J("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>J("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>J("GET","/api/teams/available"),getTeams:()=>J("GET","/api/teams"),getTeam:e=>J("GET",`/api/teams/${e}`),getTeamStats:e=>J("GET",`/api/teams/${e}/stats`),getRiders:e=>J("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRiderStats:(e,t=!1)=>J("GET",`/api/riders/${e}/stats${t?"?excludeFatigue=true":""}`),getRiderProgramRaces:e=>J("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>J("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>J("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>J("POST","/api/rider-team-editor/export",e),getRaces:()=>J("GET","/api/races"),getRaceProgramParticipants:e=>J("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>J("GET",`/api/races/${e}/results-roster`),getGameState:()=>J("GET","/api/state"),getGameStatus:()=>J("GET","/api/game/status"),getStageSummary:e=>J("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>J("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>J("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>J("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>J("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>J("POST","/api/state/advance"),getStageResults:e=>J("GET",`/api/results/${e}`),getSeasonStandings:()=>J("GET","/api/season-standings"),listStageEditorStages:()=>J("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>J("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>J("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>J("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>J("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>J("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>J("POST","/api/stage-editor/import",e),exportStageRoute:e=>J("POST","/api/stage-editor/export",e),getInjuries:()=>J("GET","/api/injuries"),getDraftHistory:e=>J("GET",`/api/draft/${e}`),getLeaderboards:(e,t,a)=>J("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`),getRaceProgramsEditor:()=>J("GET","/api/race-programs-editor"),saveRaceProgramsEditor:e=>J("POST","/api/race-programs-editor/save",e)};async function ya(){const e=await V.listSaves(),t=h("saves-list"),a=h("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(r=>`
    <div class="save-card">
      <h3>${S(r.careerName)}</h3>
      <p class="save-meta">
        ${S(r.teamName)} · Saison ${r.currentSeason}
        ${r.lastSaved?"· "+ie(r.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${S(r.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${S(r.filename)}" data-career-name="${S(r.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function $l(e){Re("Karriere wird geladen…");const t=await V.loadSave(e);if(ke(),!t.success){alert("Fehler beim Laden: "+t.error);return}c.currentSave=t.data??null,await ol()}async function xl(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;Re("Löschen…");const a=await V.deleteSave(e);if(ke(),!a.success){alert("Fehler: "+a.error);return}await ya()}async function Tl(){const e=await V.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){h("btn-delete-all-careers").classList.add("hidden"),h("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){Re("Alle Karrieren werden gelöscht…");try{for(const a of t){const r=await V.deleteSave(a.filename);if(!r.success){alert(`Fehler beim Löschen von "${a.careerName}": ${r.error??"Unbekannter Fehler"}`);break}}}finally{ke()}await ya()}}function wl(){h("btn-new-career").addEventListener("click",async()=>{var s;fa("new-career-error"),h("input-career-name").value="";const a=h("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',Qe("newCareer");const r=await V.getAvailableTeams();if(!r.success||!((s=r.data)!=null&&s.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=r.data.map(n=>`<option value="${n.id}">${S(n.name)} (${S(n.division??n.divisionName??"")})</option>`).join("")}),h("btn-cancel-new").addEventListener("click",()=>Je("newCareer")),h("btn-confirm-new").addEventListener("click",async()=>{const a=h("input-career-name").value.trim(),r=h("input-team-id").value;if(!a||!r){Et("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const s=Number(r),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;fa("new-career-error"),Re("Neue Karriere wird erstellt…");const o=await V.createSave(i,a,s);if(!o.success){ke(),Et("new-career-error",o.error??"Unbekannter Fehler.");return}const d=await V.loadSave(i);if(ke(),Je("newCareer"),!d.success){alert("Fehler: "+d.error);return}c.currentSave=d.data??null,await ol()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>ya());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{Tl()}),h("saves-list").addEventListener("click",async a=>{const r=a.target.closest("button[data-save-action]");if(!r)return;const{saveAction:s,filename:n,careerName:i}=r.dataset;if(n){if(s==="load"){await $l(n);return}s==="delete"&&await xl(n,i??n)}})}const Ml="modulepreload",Rl=function(e){return"/"+e},Vs={},Si=function(t,a,r){let s=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));s=Promise.allSettled(a.map(d=>{if(d=Rl(d),d in Vs)return;Vs[d]=!0;const l=d.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${p}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":Ml,l||(u.as="script"),u.crossOrigin="",u.href=d,o&&u.setAttribute("nonce",o),document.head.appendChild(u),l)return new Promise((m,f)=>{u.addEventListener("load",m),u.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return s.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},Il={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function Cl(e){const t=Il[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const El=200;function is(e){if(e.length===0)return[];const t=[];for(const a of e){const r=t[t.length-1];if(!r||Math.abs(r.distanceMeter-a.distanceMeter)>=El){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}r.riderIds.push(...a.riderIds),r.riderCount+=a.riderCount,r.distanceSum+=a.distanceMeter*a.riderCount,r.distanceMeter=r.distanceSum/r.riderCount}return t.map(({distanceSum:a,...r})=>r)}function os(e){if(e.length===0)return[];let t=0;for(let s=1;s<e.length;s+=1)e[s].riderCount>e[t].riderCount&&(t=s);let a=0,r=0;return e.map((s,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(r+=1,o=`A${r}`),{...s,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-s.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,s.distanceMeter-e[n+1].distanceMeter):null}})}function Fl(e,t=null){var a,r,s;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((r=e.find(n=>n.label==="P"))==null?void 0:r.label)??((s=e[0])==null?void 0:s.label)??null}function $t(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function Us(e,t,a,r){return`${r.type}:${e}:${t}:${a}`}function Pl(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:$t(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function rt(e){const t=[];e.segments.forEach((s,n)=>{const i=n*2;(s.start_markers??[]).forEach((o,d)=>{t.push({key:Us(n,"start",d,o),label:"",marker:o,kmMark:s.start_km,elevation:s.start_elevation,boundary:"start",sequence:i+d/100})}),(s.end_markers??[]).forEach((o,d)=>{t.push({key:Us(n,"end",d,o),label:"",marker:o,kmMark:s.end_km,elevation:s.end_elevation,boundary:"end",sequence:i+1+d/100})})});const a=t.sort((s,n)=>s.kmMark-n.kmMark||s.sequence-n.sequence),r=new Map;return a.map(s=>{const n=(r.get(s.marker.type)??0)+1;return r.set(s.marker.type,n),{...s,label:s.marker.name??Pl(s.marker,n)}})}function Nl(e){const t=rt(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>$t(a)).length}}function Zt(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Ll(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Oe(e,t,a,r){return t<=0?r:r+e/t*(a-r*2)}function Ja(e,t){const a=t/1e3,r=e.points;if(a<=r[0].kmMark)return r[0].elevation;for(let s=0;s<r.length-1;s+=1){const n=r[s],i=r[s+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),d=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*d}return r[r.length-1].elevation}function ki(e){const t=e.points.map(p=>p.elevation),a=Math.min(...t),r=Math.max(...t),s=Math.max(1,r-a),n=Math.max(40,s*.08),i=Math.max(0,a-n),o=r+n;let d=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=d&&(l=d+100),{axisMinElevation:d,axisMaxElevation:l}}function et(e,t,a,r,s,n){const i=Math.max(1,a-t);return r-n-(e-t)/i*(r-s-n)}function da(e){return`${Math.round(e)} m`}function Ys(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function Zs(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function $i(e,t,a,r,s,n,i,o,d){var g;const l=[],p=[];let u=null,m="#b91c1c";for(const b of rt(e)){const{marker:y,kmMark:v,elevation:x}=b;if(y.type==="climb_start"){p.push({kmMark:v,elevation:x,name:y.name});continue}if($t(y)){let M=-1;for(let C=p.length-1;C>=0;C-=1)if(y.name&&((g=p[C])==null?void 0:g.name)===y.name){M=C;break}const T=M>=0?p.splice(M,1)[0]:p.pop();T&&Math.max(0,v-T.kmMark),T&&Math.max(0,x-T.elevation);const $=Zs(y.cat,y.type),w=Ys(y.cat);if(y.type==="finish_hill"||y.type==="finish_mountain"){u=y.cat??null,m=$.accentColor;continue}l.push({x:Oe(v*1e3,t,a,r),anchorY:et(x,o,d,s,n,i),primaryLabel:w??"Berg",secondaryLabel:da(x),distanceLabel:`${v.toFixed(1).replace(".",",")} km`,accentColor:$.accentColor});continue}if(y.type==="sprint_intermediate"){const M=Zs(y.cat,y.type);l.push({x:Oe(v*1e3,t,a,r),anchorY:et(x,o,d,s,n,i),primaryLabel:"Sprint",secondaryLabel:da(x),distanceLabel:`${v.toFixed(1).replace(".",",")} km`,accentColor:M.accentColor})}}const f=e.points[e.points.length-1];return l.push({x:Oe(f.kmMark*1e3,t,a,r),anchorY:et(f.elevation,o,d,s,n,i),primaryLabel:u?`${Ys(u)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:da(f.elevation),distanceLabel:`${f.kmMark.toFixed(1).replace(".",",")} km`,accentColor:m}),l.sort((b,y)=>b.x-y.x)}function xi(e,t,a){const r=t+4,s=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${Zt(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-detail">${Zt(e.distanceLabel)}</text>
    </g>`}function Ti(e,t){const a=new Set,r=t/1e3;for(let s=0;s<=r;s+=25)a.add(Math.round(s*1e3));return a.add(Math.round(t)),[...a].filter(s=>s>=0&&s<=t).sort((s,n)=>s-n)}function wi(e,t,a,r,s,n){const i=new Set(rt(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const d=Oe(o,a,r,s),p=i.has(o)?18:12,u=n+p+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${d.toFixed(1)}" y1="${n.toFixed(1)}" x2="${d.toFixed(1)}" y2="${(n+p).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${d.toFixed(1)}" y="${u.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${Zt(Ll(o))}</text>
      </g>`}).join("")}function Dl(e,t,a,r,s,n,i,o,d,l,p){const u=Oe(e.distanceMeter,a,r,n),m=Ja(t,e.distanceMeter),f=et(m,d,l,s,i,o),g=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),b=e.riderCount>1?`<text x="${u.toFixed(1)}" y="${(f+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${u.toFixed(1)}" cy="${f.toFixed(1)}" r="${g.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${p?" race-sim-cluster-dot-selected":""}"></circle>
      ${b}
    </g>`}function _l(e,t,a,r,s,n,i,o,d,l,p){const u=new Map(p.riders.map(f=>[f.id,f])),m=new Map((p.teams??[]).map(f=>[f.id,f.abbreviation]));return e.filter(f=>f.riderCount===1).map(f=>{const g=f.riderIds[0];if(g==null)return"";const b=u.get(g);if(!b)return"";const y=Oe(f.distanceMeter,a,r,n),v=Ja(t,f.distanceMeter),x=et(v,d,l,s,i,o),M=b.activeTeamId!=null?m.get(b.activeTeamId)??"":"",T=`${b.lastName} (${M})`,$=x-34,w=x-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${y.toFixed(1)}" y1="${(x-5).toFixed(1)}" x2="${y.toFixed(1)}" y2="${$.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${y.toFixed(1)}" y="${w.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${Zt(T)}</text>
        </g>`}).join("")}function Al(e,t,a,r,s,n,i,o,d,l,p){const u=Math.max(0,Math.min(l,e.distanceKm)),m=Math.max(0,Math.min(p,e.distanceKm));if(m<=u)return null;const f=[{kmMark:u,elevation:Ja(e,u*1e3)},...e.points.filter(x=>x.kmMark>u&&x.kmMark<m),{kmMark:m,elevation:Ja(e,m*1e3)}];if(f.length<2)return null;const g=s-i,b=f.map((x,M)=>{const T=Oe(x.kmMark*1e3,t,a,r),$=et(x.elevation,o,d,s,n,i);return`${M===0?"M":"L"} ${T.toFixed(1)} ${$.toFixed(1)}`}).join(" "),y=Oe(u*1e3,t,a,r),v=Oe(m*1e3,t,a,r);return`${b} L ${v.toFixed(1)} ${g.toFixed(1)} L ${y.toFixed(1)} ${g.toFixed(1)} Z`}function Bl(e,t,a,r,s={}){const p=e.distanceKm*1e3,{axisMinElevation:u,axisMaxElevation:m}=ki(e),f=533,g=12,y=e.points.map(C=>{const E=Oe(C.kmMark*1e3,p,1584,28),F=et(C.elevation,u,m,634,168,101);return{x:E,y:F}}).map((C,E)=>`${E===0?"M":"L"} ${C.x.toFixed(1)} ${C.y.toFixed(1)}`).join(" "),v=`${y} L ${1556 .toFixed(1)} ${f.toFixed(1)} L ${28 .toFixed(1)} ${f.toFixed(1)} Z`,x=s.selectedClimbRange!=null?Al(e,p,1584,28,634,168,101,u,m,s.selectedClimbRange.startKm,s.selectedClimbRange.endKm):null,M=$i(e,p,1584,28,634,168,101,u,m).map(C=>xi(C,g,f)).join(""),$=Array.from({length:5},(C,E)=>u+(m-u)/4*E).map(C=>{const E=et(C,u,m,634,168,101);return`
      <line x1="28" y1="${E.toFixed(1)}" x2="1556" y2="${E.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${E.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${E.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(E+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${da(C)}</text>`}).join(""),w=wi(Ti(e,p),e,p,1584,28,f);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${Zt(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      ${x?`<path d="${x}" class="dashboard-stage-profile-climb-highlight"></path>`:""}
      <path d="${y}" class="race-sim-profile-line"></path>
      ${M}
      ${w}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function Hl(e,t,a,r,s){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${Bl(t,a,r,!1,s)}</div>`}function Gl(e,t,a,r,s,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,d=634,l=28,p=168,u=101,{axisMinElevation:m,axisMaxElevation:f}=ki(t),g=d-u,b=12,y=Array.from({length:5},(K,R)=>m+(f-m)/4*R),v=is(a.clusters),x=os(v),M=Ti(t,a.stageDistanceMeters),$=t.points.map(K=>{const R=Oe(K.kmMark*1e3,a.stageDistanceMeters,o,l),B=et(K.elevation,m,f,d,p,u);return{x:R,y:B}}).map((K,R)=>`${R===0?"M":"L"} ${K.x.toFixed(1)} ${K.y.toFixed(1)}`).join(" "),w=`${$} L ${(o-l).toFixed(1)} ${g.toFixed(1)} L ${l.toFixed(1)} ${g.toFixed(1)} Z`,C=$i(t,a.stageDistanceMeters,o,l,d,p,u,m,f).map(K=>xi(K,b,g)).join(""),E=y.map(K=>{const R=et(K,m,f,d,p,u);return`
      <line x1="${l}" y1="${R.toFixed(1)}" x2="${o-l}" y2="${R.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${R.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${R.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(R+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${da(K)}</text>`}).join(""),F=wi(M,t,a.stageDistanceMeters,o,l,g),L=new Map(v.map((K,R)=>[K,x[R]??null])),_=v.map(K=>{var R;return Dl(K,t,a.stageDistanceMeters,o,d,l,p,u,m,f,((R=L.get(K))==null?void 0:R.label)===i)}).join(""),G=s.stage.profile==="ITT"?_l(v,t,a.stageDistanceMeters,o,d,l,p,u,m,f,s):"";e.innerHTML=`
    <div class="race-sim-profile-layout${s.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${d}" role="img" aria-label="${Zt(r)}">
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
          ${E}
          <line x1="${l}" y1="${g}" x2="${o-l}" y2="${g}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${p}" x2="${l}" y2="${g}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${w}" fill="url(#race-sim-area)"></path>
            <path d="${$}" class="race-sim-profile-line"></path>
            ${C}
            ${_}
          </g>
          ${G}
          ${F}
          <text x="${l.toFixed(1)}" y="${(p-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const zl={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},Js={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function Or(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function mr(e,t){return`${e}:${t}`}function Kl(e){return new Map(e.map(t=>[mr(t.simulationMode,t.terrain),t.weights]))}function Wl(e){return new Map(e.map(t=>[mr(t.simulationMode,t.terrain),t]))}function jl(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function Mi(e,t,a){const r=a.get(mr(e,t));if(!r)return[{key:Or(t),weight:1}];const s=Object.entries(r).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return s.length>0?s:[{key:Or(t),weight:1}]}function Ol(e,t,a,r){const s=Mi(t,a,r),n=s.reduce((o,d)=>o+d.weight,0);return n<=0?e[Or(a)]:s.reduce((o,d)=>o+e[d.key]*d.weight,0)/n}function Vl(e,t){const a=t.find(r=>r.simulationMode==="ttt"&&r.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??zl[e]??1.05}function Ul(e,t,a){const r=a==null?void 0:a.get(mr(e,t));return{lateMultiplier:(r==null?void 0:r.finalSpreadLateMultiplier)??Js[t].lateMultiplier,peakMultiplier:(r==null?void 0:r.finalSpreadPeakMultiplier)??Js[t].peakMultiplier}}const Yl=.005,Zl=.005,Ri=70,Ii=1e3,Ci=15,Ei=360,Fi=8,Pi=-.75,Ni=10;function Ft(e,t){return e+Math.random()*(t-e)}function Li(e,t,a){return Math.max(t,Math.min(a,e))}function Jl(e){return e==="ITT"||e==="TTT"}function Di(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(r=>{var s,n,i;return r.id!==e.id&&r.activeTeamId===e.activeTeamId&&(((s=r.role)==null?void 0:s.name)==="Edelhelfer"||((n=r.role)==null?void 0:n.name)==="Starke Helfer"||((i=r.role)==null?void 0:i.name)==="Wassertraeger")}).map(r=>r.id)}function _i(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function ql(e,t,a,r){const s=r==="crash"?_i():null,n=Number(Ft(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=Li(n/Math.max(.1,a)*100,0,100),d=o<=Ri;return{riderId:e.id,type:r,severity:s,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(r==="crash"?Ft(10,60):Ft(10,45)),recoverySeconds:d?Ii:Ei,recoveryFormBonus:d?Ci:Fi,dayFormPenalty:Pi,staminaPenalty:Ni,recoveryPenaltyStages:r==="crash"?s==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:r==="crash"&&s==="medium"?15:0,supportRiderIds:Di(e,t)}}function Xl(e,t,a){if(Jl(t.profile)||a<=0)return[];const r=[];for(const s of e){const n=Math.random(),i=Math.random(),o=Yl*Math.max(0,t.crashIncidentMultiplier??1),d=Zl*Math.max(0,t.mechanicalIncidentMultiplier??1),l=o+(t.rolledEffektSturz??0)/100,p=d+(t.rolledEffektDefekt??0)/100,u=n<l,m=i<p;if(!u&&!m)continue;const f=u&&m?n<=i?"crash":"mechanical":u?"crash":"mechanical",g=ql(s,e,a,f);if(f==="crash"&&Math.random()<.01){g.isMassCrashTrigger=!0;const b=Math.floor(Ft(2,26)),v=[...e.filter(x=>x.id!==s.id)].sort(()=>.5-Math.random());g.massCrashPotentialRiderIds=v.slice(0,b).map(x=>x.id),Math.random()<.2&&(g.hasAdditionalMechanical=!0,g.waitDurationSeconds+=Math.round(Ft(10,45)))}r.push(g)}return r}function Ql(e,t,a,r){const s=_i(),n=Math.round(a*1e3),i=Li(a/Math.max(.1,r)*100,0,100),o=i<=Ri;let d=Math.round(Ft(10,60)),l=!1;return Math.random()<.2&&(l=!0,d+=Math.round(Ft(10,45))),{riderId:e.id,type:"crash",severity:s,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:d,recoverySeconds:o?Ii:Ei,recoveryFormBonus:o?Ci:Fi,dayFormPenalty:Pi,staminaPenalty:Ni,recoveryPenaltyStages:s==="light"?[10,5,2]:[],raceRecuperationPenalty:s==="medium"?15:0,supportRiderIds:Di(e,t),hasAdditionalMechanical:l}}function ed(e,t){return e+Math.random()*(t-e)}function qs(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const r=Math.floor(ed(0,a+1)),s=t[a];t[a]=t[r]??s,t[r]=s}return t}function td(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function ad(e,t,a={}){if(e.length===0)return[];const r=e.map(f=>({...f,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),s=a.teams??td(r),n=Ua(r,s,t,a),i=new Set(n.slice(0,20).map(f=>f.rider.id)),o=Math.min(Math.ceil(r.length*.02),Math.max(0,r.length-i.size)),d=Math.min(Math.ceil(r.length*.01),r.length),l=qs(r.filter(f=>!i.has(f.id))),p=new Set(l.slice(0,o).map(f=>f.id)),u=qs(r.filter(f=>!p.has(f.id))),m=new Set(u.slice(0,d).map(f=>f.id));return r.map(f=>p.has(f.id)?{...f,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:m.has(f.id)?{...f,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:f)}function ta(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}function Xs(e,t){return e+Math.random()*(t-e)}function rd(e,t,a){const r=[...e],s=[];for(;s.length<t&&r.length>0;){const n=r.reduce((l,p)=>l+Math.max(1e-4,a(p)),0);let i=Math.random()*n,o=0;for(let l=0;l<r.length;l+=1)if(i-=Math.max(1e-4,a(r[l])),i<=0){o=l;break}const[d]=r.splice(o,1);d&&s.push(d)}return s}function sd(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function Qs(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function nd(e,t,a){return new Set(e.map(r=>r.riderId).filter(r=>r!=null&&!t.has(r)).slice(0,a))}function id(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function ht(e){var t;return id((t=e.role)==null?void 0:t.name)}function od(e){return rt(e).some(({marker:t})=>$t(t))}function ld(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function dd(e,t){const a=ld(e),r=e.hasSuperform===!0?40:1,s=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&ht(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*r*s*n*i;return{attackFactor:a,superformFactor:r,gcLeaderTeamFactor:s,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function cd(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function ud(e,t){var r,s;const a=((r=t[0])==null?void 0:r.riderId)??null;return a==null?null:((s=e.find(n=>n.id===a))==null?void 0:s.activeTeamId)??null}function md(e,t,a){const r=new Map(t.map(n=>[n.id,n])),s=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=r.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||s.has(i.activeTeamId))&&(s.add(i.activeTeamId),s.size>=a))break}return s}function pd(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),ht(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function gd(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const r=t.stageNumber<=10,s=Math.max(1,Math.floor(a*(r?.01:.05))),n=Math.max(s,Math.floor(a*(r?.08:.2)));return{min:s,max:n}}function fd(e,t){return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?{min:.45,max:.75}:{min:.5,max:.85}}function hd(e,t,a,r,s,n,i,o){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||r.distanceKm<=0)return null;const d=e.length,{min:l,max:p}=gd(t,a,d),u=ta(l,p),m=t.isStageRace&&a.stageNumber<=10,f=!t.isStageRace,g=ud(e,n),b=m?md(s,e,5):new Set,y=m?pd(e):new Map,v=od(r),x=sd(s,5),M=Qs(n,10),T=new Set([...x,...M]),$=v?nd(i,T,5):new Set,w=cd(a),C=["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain"].includes(a.profile),E=t.isStageRace&&C&&a.stageNumber>=4;let F;const L=new Set;if(E){const A=Qs(n,10),O=Ua(e,o??[],a,{distanceKm:r.distanceKm,elevationGainMeters:r.elevationGainMeters});let z=[];for(const k of O){if(z.length>=5)break;const I=k.rider;if(I.activeTeamId==null||!A.has(I.id))continue;const N=ht(I);(N==="kapitaen"||N==="co-kapitaen")&&(z.includes(I.activeTeamId)||z.push(I.activeTeamId))}if(z.length===0)for(const k of O){if(z.length>=5)break;const I=k.rider;if(I.activeTeamId==null||!A.has(I.id))continue;ht(I)==="edelhelfer"&&(z.includes(I.activeTeamId)||z.push(I.activeTeamId))}if(z.length>0&&Math.random()<.5){const k=ta(0,z.length-1);F=z[k]}}if(F!=null){const A=e.filter(z=>z.activeTeamId===F),P=A.filter(z=>ht(z)==="kapitaen"),O=A.filter(z=>ht(z)==="co-kapitaen");if(P.length>0){if(P.forEach(z=>L.add(z.id)),P.length===1&&O.length>0){const z=[...O].sort((k,I)=>I.overallRating-k.overallRating||I.id-k.id);L.add(z[0].id)}}else if(O.length>0)[...O].sort((k,I)=>I.overallRating-k.overallRating||I.id-k.id).slice(0,2).forEach(k=>L.add(k.id));else{const z=A.filter(k=>ht(k)==="edelhelfer");if(z.length>0){const k=[...z].sort((I,N)=>N.overallRating-I.overallRating||N.id-I.id);L.add(k[0].id)}}}let _;if(F!=null){const P=e.filter(O=>O.activeTeamId===F).filter(O=>!L.has(O.id));P.length>0&&(_=[...P].sort((z,k)=>k.skills.attack-z.skills.attack||k.overallRating-z.overallRating||k.id-z.id)[0])}const G=e.filter(A=>{if(A.activeTeamId==null||x.has(A.id)||M.has(A.id)||F!=null&&A.activeTeamId===F&&(L.has(A.id)||_!=null&&A.id===_.id)||m&&g!=null&&A.activeTeamId===g||m&&b.has(A.activeTeamId))return!1;const P=ht(A);return!(f&&(P==="kapitaen"||P==="co-kapitaen")||m&&P==="kapitaen"||m&&P==="co-kapitaen"&&y.get(A.activeTeamId)!==!0||P==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(G.length===0)return null;const K=new Map(G.map(A=>[A.id,dd(A,{isEarlyStageRace:m,race:t,gcLeaderTeamId:g,stageHasMountainClassifications:v,topMountainIds:$,isHardStage:w})])),R=G.reduce((A,P)=>{var O;return A+(((O=K.get(P.id))==null?void 0:O.finalWeight)??0)},0),B=rd(G,Math.max(0,Math.min(u-(_?1:0),G.length)),A=>{var P;return((P=K.get(A.id))==null?void 0:P.finalWeight)??1});if(_&&B.push(_),B.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${B.length}/${u} ausgewählt aus ${G.length}`),console.log(`Gesamtgewicht im Pool: ${R.toFixed(2)}`),console.table(B.map(A=>{var O;const P=K.get(A.id);return{Fahrer:`${A.firstName} ${A.lastName}`,Team:A.activeTeamId,Rolle:((O=A.role)==null?void 0:O.name)??null,Atk:A.skills.attack,Hill:A.skills.hill,Chance:`${((R>0&&P!=null?P.finalWeight/R:0)*100).toFixed(2)}%`,Gewicht:((P==null?void 0:P.finalWeight)??1).toFixed(2),Attacke:`x${((P==null?void 0:P.attackFactor)??1).toFixed(2)}`,Superform:`x${(P==null?void 0:P.superformFactor)??1}`,GC_Team:`x${((P==null?void 0:P.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(P==null?void 0:P.mountainFactor)??1}`,Sprinter:`x${(P==null?void 0:P.sprinterFactor)??1}`}})),console.groupEnd();const U=r.distanceKm*1e3,W=ta(0,Math.min(1e4,Math.max(0,Math.floor(U*.1)))),se=fd(t,a),q=Math.round(U*Xs(se.min,se.max)),ee=Math.round(U*Xs(.1,.25)),Y=Math.max(W+1e3,Math.min(q-1e3,q-ee)),j=a.rolledBreakawayBonus??0,D=ta(3+j,8+j);return{riderIds:B.map(A=>A.id),triggerDistanceMeters:W,groupPhaseEndDistanceMeters:Y,phaseEndDistanceMeters:q,skillBonus:D,malusValue:ta(5,8),superTeamId:F}}const bd=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),yd=3,vd=7,en=120,tn=200,an=180,Sd=10,wa=8e3;function Pt(e,t,a=Math.random()){const r=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(a*(s-r+1))+r}function kd(e){for(let t=e.length-1;t>0;t-=1){const a=Pt(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function qa(e,t){return t<=0||e.length===0?[]:kd([...e]).slice(0,Math.min(t,e.length))}function $d(e,t,a){if(t<=0||e.length===0)return[];const r=[...e],s=[];for(;r.length>0&&s.length<t;){const n=r.reduce((d,l)=>d+Math.max(0,a(l)),0);if(n<=0){s.push(...qa(r,t-s.length));break}let i=Math.random()*n,o=r.length-1;for(let d=0;d<r.length;d+=1)if(i-=Math.max(0,a(r[d])),i<=0){o=d;break}s.push(r[o]),r.splice(o,1)}return s}function xd(e){return bd.has(e.profile)}function Td(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function wd(e,t){if(!xd(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(r=>{if(!Td(r))return[];const s=r.start_km*1e3,n=r.end_km*1e3,i=Math.max(s,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:s,sourceSegmentEndMeters:n}]})}function rn(e,t){const a=t==null?e:e.filter(d=>{const l=Math.min(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t)),p=Math.max(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t));return l>=wa||p>=wa});if(a.length===0)return null;const r=a[Pt(0,a.length-1)];if(!r)return null;const s=Math.ceil(r.startMeters),n=Math.floor(r.endMeters);if(n<=s)return null;let i=0;for(;i<12;){const d=Pt(s,n);if(t==null||Math.abs(d-t)>=wa)return{triggerDistanceMeters:d,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<r.startMeters?n:s;return t==null||Math.abs(o-t)>=wa?{triggerDistanceMeters:o,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters}:null}function Md(e,t,a,r=()=>1){const s=e.slice(0,15),n=wd(t,a);if(s.length===0||n.length===0)return[];const i=Pt(yd,Math.min(vd,s.length)),o=$d(s,i,r),d=[];for(const m of o){const f=rn(n);f&&d.push({riderId:m.id,attackNumber:1,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:Pt(en,tn),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}if(d.length===0)return[];const l=d.map(m=>m.riderId),p=Math.floor(l.length*.5),u=new Set(qa(l,p));for(const m of[...d]){if(!u.has(m.riderId))continue;const f=rn(n,m.triggerDistanceMeters);f&&d.push({riderId:m.riderId,attackNumber:2,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:Pt(en,tn),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}return d.sort((m,f)=>m.triggerDistanceMeters-f.triggerDistanceMeters||m.riderId-f.riderId||m.attackNumber-f.attackNumber)}function Rd(e,t,a){var d;if(e.length===0)return[];const r=((d=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:d.teamId)??null,s=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||r!=null&&l.teamId===r));if(s.length===0)return[];const n=new Map;for(const l of s){const p=n.get(l.teamId)??[];p.push(l),n.set(l.teamId,p)}const i=[...n.values()].map(l=>qa(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(Pt(0,3),i.length);return qa(i,o).map(l=>l.riderId)}function Id(e,t){const a=[],r=[];for(const[s,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){r.push(s);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:r}}function wr(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}const Cd={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},Ed={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},Fd={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},Pd={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},Nd={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function Ld(e){const t=new Map;for(const a of e){const r=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",r);else if(a.appliesTo==="climb_top"){const s=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${s}`,r)}else a.appliesTo==="finish"&&t.set(a.markerType,r)}return t}const Ma=20,Dd=120,_d=300,Mr=.025,Ad=.1,Bd=.4,Hd=.6,Gd=.8,ca=1,sn=2/3,zd=.1,Ra=10,nn=50,Kd=25,Wd=7,jd=500,Od=100,Vd=.02,Ud=.04,Yd=.009,Zd=120,Jd=150,qd=100,Xd=300,on=50,Rr=85,wt=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],ln=5*60,Qd=60,ec=.5,tc=.3,Ia=5e3,ac=2e3,rc=1,sc=2,nc=.05,Ai={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},ic={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},Ca=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function be(e,t,a){return Math.max(t,Math.min(a,e))}function ge(e,t){return e+Math.random()*(t-e)}function dn(e){return e[Math.floor(Math.random()*e.length)]}function jt(e){return Math.round(e*100)/100}function oc(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function cn(e){if(e<2)return 1;const t=be(e,2,20),a=Ca[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let r=1;r<Ca.length;r+=1){const s=Ca[r-1],n=Ca[r];if(t>n.gradientPercent)continue;const i=(t-s.gradientPercent)/Math.max(1e-4,n.gradientPercent-s.gradientPercent),o=s.draftPenaltyShare+(n.draftPenaltyShare-s.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function lc(e){return e==="Flat"?Zd:e==="Abfahrt"?Jd:Number.POSITIVE_INFINITY}function dc(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function Xa(e){return(e.formBonus??0)+(e.raceFormBonus??0)-((e.fatigueMalus??0)+(e.longTermFatigueMalus??0)+(e.shortTermFatigueMalus??0))*.5}function cc(e,t){if(t.length===0)return"";const a=t.reduce((p,u)=>p+u.weight,0),r=t.map(p=>{const u=e.skills[p.key],m=Math.round(p.weight/a*100);return`${Ai[p.key]} ${Math.round(u)} (${m}%)`}),s=e.formBonus??0,n=e.raceFormBonus??0,i=(e.fatigueMalus??0)*.5,o=(e.longTermFatigueMalus??0)*.5,d=(e.shortTermFatigueMalus??0)*.5;r.push(`S-Form ${s>=0?"+":""}${s.toFixed(1).replace(".",",")}`),r.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&r.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&r.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),d>0&&r.push(`Akut -${d.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const p of t)l+=(e.mentorBoosts[p.key]||0)*(p.weight/a);return l>0&&r.push(`Mentor +${l.toFixed(1).replace(".",",")}`),r.join(" • ")}function uc(){const e=Math.random();return e<.9?ge(5,20):e<.98?ge(20,40):ge(40,70)}function un(){const e=Math.random();return e<.9?jt(ge(-1,1)):e<.995?jt(dn([-1,1])*ge(1,2)):jt(dn([-1,1])*ge(3,4))}function mc(){return jt(ge(-3,3))}function pc(e){const t=[];let a=0,r=uc(),s=ge(-1,1);for(;a<e;){const n=Math.min(e-a,ge(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:r,vector:s}),a+=n,a>=e)break;r=be(r+(Math.random()<.5?-1:1)*ge(2,10),5,70),s=be(s+(Math.random()<.5?-1:1)*ge(0,.5),-1,1)}return t}function Bi(e,t){const a=te(e),r=te(t);if(a!==r)return a?1:-1;const s=Te(e),n=Te(t);return s&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:s?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function te(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function Te(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function aa(e,t,a=!1,r=null){var d;const s="rider"in e?e.rider:null,n=(s==null?void 0:s.specialization1)??null,i=(s==null?void 0:s.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(d=s==null?void 0:s.role)==null?void 0:d.name;r==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function gc(e,t,a=null,r=null,s=!1){var f,g;const n=b=>b.photoFinishScore;if(!t){const b=[...e].sort((v,x)=>v.crossingTimeSeconds-x.crossingTimeSeconds||x.photoFinishScore-v.photoFinishScore||v.riderId-x.riderId),y=((f=b[0])==null?void 0:f.crossingTimeSeconds)??0;return b.map((v,x)=>({riderId:v.riderId,rank:x+1,crossingTimeSeconds:v.crossingTimeSeconds,gapSeconds:Math.max(0,v.crossingTimeSeconds-y),photoFinishScore:v.photoFinishScore}))}const i=[...e].sort((b,y)=>b.crossingTimeSeconds-y.crossingTimeSeconds||y.photoFinishScore-b.photoFinishScore||b.riderId-y.riderId),o=((g=i[0])==null?void 0:g.crossingTimeSeconds)??0,d=[];let l=[],p=0,u=null;const m=()=>{const b=Math.max(0,p-o),y=l.sort((v,x)=>n(x)-n(v)||v.riderId-x.riderId);for(const v of y)d.push({riderId:v.riderId,rank:d.length+1,crossingTimeSeconds:v.crossingTimeSeconds,gapSeconds:b,photoFinishScore:v.photoFinishScore})};for(const b of i){if(l.length===0){l=[b],p=b.crossingTimeSeconds,u=b.crossingTimeSeconds;continue}if(u!=null&&b.crossingTimeSeconds-u<=ca){l.push(b),u=b.crossingTimeSeconds;continue}m(),l=[b],p=b.crossingTimeSeconds,u=b.crossingTimeSeconds}return l.length>0&&m(),d}function fc(e,t,a){const r=e.filter(Te).sort((u,m)=>(u.finishTimeSeconds??0)-(m.finishTimeSeconds??0)||m.photoFinishScore-u.photoFinishScore||u.rider.id-m.rider.id),s=e.filter(u=>!te(u)).sort(Bi),n=e.filter(u=>u.finishStatus==="dnf").sort((u,m)=>m.distanceCoveredMeters-u.distanceCoveredMeters||u.rider.id-m.rider.id),i=[];let o=[],d=null;const l=u=>u.photoFinishScore,p=()=>{i.push(...o.sort((u,m)=>l(m)-l(u)||u.rider.id-m.rider.id))};for(const u of r){const m=u.finishTimeSeconds??0;if(o.length===0){o=[u],d=m;continue}if(d!=null&&m-d<=ca){o.push(u),d=m;continue}p(),o=[u],d=m}return o.length>0&&p(),[...i,...s,...n]}function hc(e,t){const a=te(e),r=te(t);if(a!==r)return a?1:-1;const s=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(s)>=.1?s:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:Te(e)&&Te(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:Te(e)?-1:Te(t)?1:e.rider.id-t.rider.id}function mn(e){const t=be(e,1,nn);return t<=2?.12*t:t<=Ra?.24+(t-2)/Math.max(1,Ra-2)*.58:.82+(t-Ra)/Math.max(1,nn-Ra)*.18}function Ir(e,t){const a=Xa(e.rider);return Object.entries(t).reduce((r,[s,n])=>{if(!n)return r;const i=s==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[s]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return r+o*n},0)}function bc(e,t){const a=Xa(e.rider);return Object.entries(t).filter(r=>!!r[1]).map(([r,s])=>{const n=r,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:s,effectiveSkill:o,contribution:o*s}})}function yc(e,t,a){let r=t;for(;r>0;){const n=e[r-1].distanceCoveredMeters-e[r].distanceCoveredMeters;if(n<=0||n>=a)break;r-=1}let s=t;for(;s<e.length-1;){const n=e[s].distanceCoveredMeters-e[s+1].distanceCoveredMeters;if(n<=0||n>=a)break;s+=1}return{startIndex:r,endIndex:s,size:s-r+1,positionInGroup:t-r}}function vc(e,t){if(e<Kd)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class Hi{constructor(t,a){var G,K;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.superTeamProtectedLeaderIds=new Set,this.superTeamBonusAmount=0,this.superTeamMalusAmount=0,this.superTeamStartPercent=0,this.superTeamEndPercent=0,this.superTeamBreakawayRiderCaught=!1,this.hasLoggedFinishSprintTieBreak=!1,this.hasAppliedSprintLeadoutBonuses=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const r=(G=t.race.country)==null?void 0:G.code3;r&&(t.riders=t.riders.map(R=>{var U;const B=R.nationality||((U=R.country)==null?void 0:U.code3);if(B&&B.trim().toUpperCase()===r.trim().toUpperCase()){const W={...R,skills:{...R.skills}},se=Math.random(),q=t.stage.profile,ee=q==="ITT"||q==="TTT",Y=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(q==="Cobble"||q==="Cobble_Hill")&&Y.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(q)||Y.push("mountain","mediumMountain");const P=[...(O=>{const z=[...Y],k=[];if(ee){k.push("timeTrial");const I=Math.min(O-1,z.length);for(let N=0;N<I;N++){const H=Math.floor(Math.random()*z.length);k.push(z.splice(H,1)[0])}}else{const I=Math.min(O,z.length);for(let N=0;N<I;N++){const H=Math.floor(Math.random()*z.length);k.push(z.splice(H,1)[0])}}return k})(5)].sort(()=>Math.random()-.5);if(W.homeEffectSkills=P,se<.05){W.homeEffect="home_pressure";for(const O of P)W.skills[O]=Math.max(0,W.skills[O]-.5)}else if(se<.1){W.homeEffect="super_home";const O=P[0];W.skills[O]=Math.min(100,W.skills[O]+3);for(let z=1;z<5;z++){const k=P[z];W.skills[k]=Math.min(100,W.skills[k]+1)}}else{W.homeEffect="normal_home";for(const O of P)W.skills[O]=Math.min(100,W.skills[O]+1)}return W}return R})),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=jl(t.stage.profile),this.skillWeightRuleMap=Kl(t.skillWeightRules??[]),this.skillWeightConfigMap=Wl(t.skillWeightRules??[]),this.stageScoringWeightMap=Ld(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=pc(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const s=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=s!=null?be(s/100,0,1):ge(Hd,Gd);const n=t.stage.finalPushStartPercent;this.finalPushStartRatio=n!=null?be(n/100,this.lateStageStartRatio,1):be(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const i=Xl(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(i.map(R=>[R.riderId,R])),i.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",i.map(B=>({riderId:B.riderId,type:B.type,severity:B.severity,kmMark:B.triggerDistanceKm,waitDurationSeconds:B.waitDurationSeconds,supportRiderIds:B.supportRiderIds})));const R=i.filter(B=>B.isMassCrashTrigger);R.length>0&&R.forEach(B=>{var U;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${B.riderId} bei Km ${B.triggerDistanceKm}. Potenziell betroffene Fahrer (${(U=B.massCrashPotentialRiderIds)==null?void 0:U.length}):`,B.massCrashPotentialRiderIds)})}const o=t.riders.map(R=>{const B={rider:R,riderName:`${R.firstName} ${R.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:mc(),microForm:un(),nextFormUpdateMeter:ge(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(R.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(B),B}),d=new Map(o.map(R=>[R.rider.id,R.dailyForm]));this.stageFavorites=di(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d});const l=this.stageFavorites.filter(R=>R.kind==="rider"&&R.riderId!=null).slice(0,15).map(R=>t.riders.find(B=>B.id===R.riderId)??null).filter(R=>R!=null),p=((K=t.gcStandings.find(R=>R.rank===1))==null?void 0:K.riderId)??null,u=Md(l,t.stage,t.stageSummary,R=>Math.max(1,Math.pow(10,(R.skills.attack-65)/10))*(R.id===p?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const R of u){const B=this.precalculatedStageAttacksByRiderId.get(R.riderId)??[];B.push(R),this.precalculatedStageAttacksByRiderId.set(R.riderId,B)}this.breakawayPlan=hd(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings,t.teams);const m=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=m.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=m.fallbackCheckpointsMeters;for(const R of o)R.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const f=ad(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d}),g=new Map(f.map(R=>[R.id,R])),b=o.map(R=>{const B=g.get(R.rider.id)??R.rider;return{...R,rider:B,riderName:`${B.firstName} ${B.lastName}`,dailyForm:R.dailyForm+(B.specialFormDelta??0)}}),y=f.filter(R=>R.hasSuperform),v=f.filter(R=>R.hasSupermalus);(y.length>0||v.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:y.map(R=>`${R.firstName} ${R.lastName}`),supermalus:v.map(R=>`${R.firstName} ${R.lastName}`)});const x=this.resolveStartOrder(b),M=new Map((this.bootstrap.teamStartOrder??[]).map((R,B)=>[R,B]));if(this.riders=x.map((R,B)=>({...R,startOffsetSeconds:this.resolveStartOffsetSeconds(R,B,M)})),this.riders.forEach(R=>this.syncRiderTelemetry(R)),this.breakawayPlan&&this.breakawayPlan.superTeamId!=null){this.superTeamId=this.breakawayPlan.superTeamId,this.superTeamBonusAmount=wr(2,6),this.superTeamMalusAmount=wr(4,8),this.superTeamStartPercent=ge(.4,.6),this.superTeamEndPercent=ge(.86,.96);const R=Y=>(Y??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),B=t.riders.filter(Y=>Y.activeTeamId===this.superTeamId),U=B.filter(Y=>{var j;return R((j=Y.role)==null?void 0:j.name)==="kapitaen"}),W=B.filter(Y=>{var j;return R((j=Y.role)==null?void 0:j.name)==="co-kapitaen"});if(U.length>0){if(U.forEach(Y=>this.superTeamProtectedLeaderIds.add(Y.id)),U.length===1&&W.length>0){const Y=[...W].sort((j,D)=>D.overallRating-j.overallRating||D.id-j.id);this.superTeamProtectedLeaderIds.add(Y[0].id)}}else if(W.length>0)[...W].sort((j,D)=>D.overallRating-j.overallRating||D.id-j.id).slice(0,2).forEach(j=>this.superTeamProtectedLeaderIds.add(j.id));else{const Y=B.filter(j=>{var D;return R((D=j.role)==null?void 0:D.name)==="edelhelfer"});if(Y.length>0){const j=[...Y].sort((D,A)=>A.overallRating-D.overallRating||A.id-D.id);this.superTeamProtectedLeaderIds.add(j[0].id)}}const se=t.teams.find(Y=>Y.id===this.superTeamId),q=se?se.name:`Team ${this.superTeamId}`;this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,riderTeamId:this.superTeamId,type:"superteam",tone:"neutral",title:`Superteam des Tages: ${q}`,detail:`Dieses Team hat sich heute zusammengeschlossen, um seinen Leader zu unterstützen! Die Helfer erhalten zwischen ${(this.superTeamStartPercent*100).toFixed(0)}% und ${(this.superTeamEndPercent*100).toFixed(0)}% der Etappe einen Bonus von +${this.superTeamBonusAmount} auf Berg, Hill, Medium Mountain und Flat. Danach folgt ein individueller Malus von -4 bis -8 wegen Erschöpfung.`});const ee=this.riders.find(Y=>{var j;return Y.rider.activeTeamId===this.superTeamId&&((j=this.breakawayPlan)==null?void 0:j.riderIds.includes(Y.rider.id))});ee&&(this.superTeamBreakawayRiderId=ee.rider.id)}for(const R of this.riders){const B=R.rider.homeEffectSkills,U=W=>ic[W]||W;if(R.rider.homeEffect==="super_home"){const W=B&&B.length===5?`${U(B[0])} (+3), ${U(B[1])} (+1), ${U(B[2])} (+1), ${U(B[3])} (+1), ${U(B[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:R.rider.id,riderName:R.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(R.rider.id,R.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${W})`})}if(R.rider.homeEffect==="home_pressure"){const W=B?B.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:R.rider.id,riderName:R.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(R.rider.id,R.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${W})`})}if(R.rider.homeEffect==="normal_home"){const W=B?B.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:R.rider.id,riderName:R.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(R.rider.id,R.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${W})`})}R.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:R.rider.id,riderName:R.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(R.rider.id,R.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),R.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:R.rider.id,riderName:R.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(R.rider.id,R.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),R.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:R.rider.id,riderName:R.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(R.rider.id,R.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const T=this.bootstrap.stage.rolledWetterName??"Sonnig",$=this.bootstrap.stage.rolledEffektSturz??0,w=this.bootstrap.stage.rolledEffektDefekt??0,C=this.bootstrap.stage.rolledWindkantenGefahr??0,E=this.bootstrap.stage.rolledEffektFatigue??0,F=this.bootstrap.stage.rolledBreakawayBonus??0,L=[];$>0&&L.push(`Sturzwahrscheinlichkeit +${$.toFixed(1)}%`),w>0&&L.push(`Defektwahrscheinlichkeit +${w.toFixed(1)}%`),C>0&&L.push(`Windkanten-Gefahr +${(C*100).toFixed(1)}%`),E>0&&L.push(`Fatigue +${E.toFixed(1)}%`),F>0&&L.push(`Ausreißer-Bonus +${F.toFixed(1)}`);const _=L.length>0?`Wettereinflüsse: ${L.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${T}`,detail:_})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const r=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(r),a-=r}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(r=>({riderId:r.rider.id,riderName:r.riderName,startOffsetSeconds:r.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(r),hasStarted:r.hasStarted||te(r),distanceCoveredMeters:r.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-r.distanceCoveredMeters),segmentStartKm:r.segmentStartKm,segmentEndKm:r.segmentEndKm,segmentStartElevation:r.segmentStartElevation,segmentEndElevation:r.segmentEndElevation,activeTerrain:Te(r)?"Finish":r.activeTerrain,skillName:Te(r)?"Finish":r.skillName,skillBreakdown:Te(r)?"":r.skillBreakdown,baseSkill:r.baseSkill,teamGroupBonus:r.teamGroupBonus,effectiveSkill:r.effectiveSkill,staminaPenalty:r.staminaPenalty,elevationPenalty:r.elevationPenalty,dailyForm:r.dailyForm,microForm:r.microForm,gradientPercent:r.gradientPercent,gradientModifier:r.gradientModifier,windModifier:r.windModifier,draftModifier:r.draftModifier,draftNearbyRiderCount:r.draftNearbyRiderCount,draftPackFactor:r.draftPackFactor,currentSpeedMps:r.currentSpeedMps,photoFinishScore:r.photoFinishScore,leadoutBonus:r.leadoutBonus,leadoutRiderId:r.leadoutRiderId,leadoutContributions:r.leadoutContributions,lastSplitLabel:r.lastSplitLabel,lastSplitTimeSeconds:r.lastSplitTimeSeconds,splitTimes:{...r.splitTimes},finishTimeSeconds:Number.isFinite(r.finishTimeSeconds??Number.NaN)?r.finishTimeSeconds:null,finishStatus:r.finishStatus,statusReason:r.statusReason,isAttacking:r.isAttacking,isBreakaway:r.isBreakaway,isLeadingGroup:r.isLeadingGroup,hasSuperform:r.rider.hasSuperform===!0,hasSupermalus:r.rider.hasSupermalus===!0,isFinished:Te(r)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(r=>r.appliedIncident?[r.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus},superTeamId:this.superTeamId}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let r=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(r=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(r==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,d)=>Math.max(o,d.distanceCoveredMeters),0);r=Number((i/1e3).toFixed(2))}const s={id:this.nextMessageId,...t,riderTeamId:a,kmMark:r};this.messages.unshift(s),this.allEvents.push(s),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(r=>[r.rider.id,r]));return this.intermediateMarkers.map(r=>{const s=t.map(i=>i.markerCrossings[r.key]??null).filter(i=>i!=null),n=gc(s,!this.isTimeTrialMode,r.markerType,a,this.isClimberMalusStage());return{markerKey:r.key,markerLabel:r.label,markerType:r.markerType,markerCategory:r.markerCategory,kmMark:r.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.isTimeTrialMode?[...this.riders].sort(Bi):fc(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(s=>s.finishStatus!=="dnf").reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0);let r=0;for(const s of t)Te(s)&&(r+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:r,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(te)}advanceSubstep(t){const a=this.elapsedSeconds,r=a+t,s=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();if(this.updateBreakawayPhaseState(),this.superTeamId!=null&&this.superTeamBreakawayRiderId!=null&&!this.superTeamBreakawayRiderCaught){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&!te(l)&&this.riders.filter(m=>this.superTeamProtectedLeaderIds.has(m.rider.id)&&!te(m)).some(m=>m.distanceCoveredMeters>=.4*this.stageDistanceMeters&&m.distanceCoveredMeters>=l.distanceCoveredMeters)&&(this.superTeamBreakawayRiderCaught=!0,l.breakawayMalus=0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} von Leader eingeholt!`,detail:"Der Ausreißer wurde von seinem Kapitän eingeholt und unterstützt das Team ab jetzt mit frischen Kräften!"}))}if(this.superTeamBreakawayRiderCaught&&this.superTeamBreakawayRiderId!=null){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&(l.breakawayMalus=0)}for(const l of this.riders){if(te(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,u=Math.max(0,r-p);if(u<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-u),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const m=this.currentSegment(l),f=this.currentWindZone(l);if(!m||!f){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=p,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const b=aa(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=b,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[];continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,s);const g=this.calculateBasePhysics(l,m,f);l.activeTerrain=m.terrain,l.skillName=g.skillName,l.skillBreakdown=g.skillBreakdown,l.baseSkill=g.baseSkill,l.teamGroupBonus=g.teamGroupBonus,l.effectiveSkill=g.effectiveSkill,l.staminaPenalty=g.staminaPenalty,l.elevationPenalty=g.elevationPenalty,l.gradientPercent=g.gradientPercent,l.gradientModifier=g.gradientModifier,l.windModifier=g.windModifier,l.tempSpeedMps=g.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=g.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*u}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,r);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const p of this.riders)l.push(p);l.sort(hc);for(let p=0;p<l.length;p+=1){const u=l[p];if(te(u))continue;const m=this.isActiveBreakawayRider(u),f=u.tempSpeedMps/14,g=Math.max(5,50*f),b=this.currentSegment(u),y=Math.max(15,150*f),v=Math.max(g,Math.min(y,lc(b==null?void 0:b.terrain))),x=yc(l,p,v),M=x.size,T=mn(M),$=vc(M,x.positionInGroup);let w=0,C=Number.POSITIVE_INFINITY,E=null;for(let D=p-1;D>=0;D-=1){const A=l[D],P=A.distanceCoveredMeters-u.distanceCoveredMeters;if(P>=v+zd)break;!this.canReceiveDraftFromCandidate(u,A)||this.isActiveBreakawayRider(A)||P<=0||P>=v||(w+=1,P<=C&&(C=P,E=A))}if(w===0||!E){if(m)continue;u.draftModifier=1,u.draftNearbyRiderCount=0,u.draftPackFactor=0,u.currentSpeedMps=u.tempSpeedMps,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,u.isLeadingGroup=!0,this.applyCaptainWaitLogic(u);continue}const F=te(E)?E.tempSpeedMps:E.currentSpeedMps,L=C,_=L<=g?1:1-(L-g)/Math.max(1e-4,v-g),G=this.currentWindZone(u),K=(G==null?void 0:G.vector)??0,R=(G==null?void 0:G.windSpeedKph)??0,B=-K*(R/70),W=Math.max(.3,.35+.35*B)*Math.min(1,f)*sn,se=be((b==null?void 0:b.gradient_percent)??0,-20,20),q=cn(se),Y=1+($?0:W*_*T*q),j=u.tempSpeedMps*Y;if(!(m&&Y<=u.draftModifier)){if(u.draftModifier=Y,u.draftNearbyRiderCount=M,u.draftPackFactor=T,u.isLeadingGroup=$,j>F){if(u.tempSpeedMps>E.tempSpeedMps){u.currentSpeedMps=j,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t;continue}if(L<1){u.currentSpeedMps=F,u.nextDistanceCoveredMeters=E.distanceCoveredMeters+F*t,m||this.applyCaptainWaitLogic(u);continue}u.currentSpeedMps=Math.min(j,F+2),u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,m||this.applyCaptainWaitLogic(u);continue}u.currentSpeedMps=j,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,m||this.applyCaptainWaitLogic(u)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(te(l))continue;if(this.superTeamId!=null&&l.rider.activeTeamId===this.superTeamId&&!this.superTeamProtectedLeaderIds.has(l.rider.id)){const v=l.rider.id===this.superTeamBreakawayRiderId;if(!v||this.superTeamBreakawayRiderCaught){const x=l.distanceCoveredMeters/this.stageDistanceMeters;let M=0,T=!1,$=!1;v?x<this.superTeamEndPercent?T=!0:l.superTeamActiveLogged&&($=!0):x>=this.superTeamStartPercent&&x<this.superTeamEndPercent?T=!0:x>=this.superTeamEndPercent&&l.superTeamActiveLogged&&($=!0),T?(M=this.superTeamBonusAmount,l.superTeamActiveLogged||(l.superTeamActiveLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} leistet Führungsarbeit!`,detail:v?`Der eingeholte Ausreißer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`:`Der Edelhelfer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`}))):$&&(l.superTeamMalusAmount==null&&(l.superTeamMalusAmount=wr(4,8)),M=-l.superTeamMalusAmount,l.superTeamExhaustedLogged||(l.superTeamExhaustedLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"warning",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} ist erschöpft!`,detail:`Die Führungsarbeit hat ihren Tribut gefordert. Der Fahrer erhält für den Rest der Etappe einen Malus von -${l.superTeamMalusAmount} auf Berg-, Hügel- und Flachpassagen.`}))),l.originalSkills||(l.originalSkills={flat:l.rider.skills.flat,mountain:l.rider.skills.mountain,mediumMountain:l.rider.skills.mediumMountain,hill:l.rider.skills.hill}),l.rider.skills.flat=l.originalSkills.flat+M,l.rider.skills.mountain=l.originalSkills.mountain+M,l.rider.skills.mediumMountain=l.originalSkills.mediumMountain+M,l.rider.skills.hill=l.originalSkills.hill+M}}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds)continue;const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,u=Math.max(0,r-p);if(u<=0)continue;const m=l.distanceCoveredMeters,f=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*u,g=l.pendingIncident;if(g&&m<g.triggerDistanceMeters&&f>=g.triggerDistanceMeters){const v=Math.max(.1,l.currentSpeedMps),x=Math.max(0,(g.triggerDistanceMeters-m)/v);l.distanceCoveredMeters=g.triggerDistanceMeters,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.applyIncident(l,g,p+x),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const b=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,f-l.distanceCoveredMeters)>=b){const v=b/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),l.finishTimeSeconds=p+v,l.currentSpeedMps=0;const x=aa(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=x,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[]}else l.distanceCoveredMeters=f,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,m,l.distanceCoveredMeters,p),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-u),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!te(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=un(),l.nextFormUpdateMeter+=ge(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),p=this.riders.filter(m=>l.has(m.rider.id)&&!te(m)),u=this.riders.filter(m=>!l.has(m.rider.id)&&!te(m));if(p.length>0&&u.length>0){const m=p.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,p[0]);u.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,u[0]).distanceCoveredMeters>=m.distanceCoveredMeters&&(m.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:m.rider.id,riderName:m.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${m.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const d=Id(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of d.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!te(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const r=new Map;for(const s of this.riders){if(te(s)||s.rider.activeTeamId==null||a<=s.startOffsetSeconds)continue;const n=r.get(s.rider.activeTeamId)??[];n.push(s),r.set(s.rider.activeTeamId,n)}for(const s of r.values()){const n=s[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,s.length),d=[...s].sort((m,f)=>f.effectiveSkill-m.effectiveSkill||m.rider.id-f.rider.id).slice(0,o).reduce((m,f)=>m+f.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-s.length),p=Math.max(1,d-l),u=this.resolveTimeTrialSpeedMps(p,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*Vl(i.terrain,this.bootstrap.skillWeightRules??[]);for(const m of s){const f=Math.max(t,m.startOffsetSeconds),g=Math.max(0,a-f);m.currentSpeedMps=u,m.tempSpeedMps=u,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+u*g}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const s=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?s.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,d=i.rider.activeTeamId!=null?s.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==d?o-d:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(s=>[s.riderId,s.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((s,n)=>{const i=a.get(s.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(s)-this.resolveProjectedIttStartScore(n)||s.rider.id-n.rider.id}):[...t].sort((s,n)=>s.rider.skills.timeTrial-n.rider.skills.timeTrial||s.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,r=0;for(const s of this.bootstrap.stageSummary.segments){const n=(s.start_km+s.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,s.terrain),d=i>0?this.resolveWeightedSkill(t.rider,s.terrain,i):o,l=Math.max(0,o.value-d.value),{effectiveSkill:p}=this.resolveEffectiveSkill({rider:t,baseSkill:d.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),u=be(s.gradient_percent,-20,20),m=u>0?Math.exp(-.11*u):1-u*.06,f=this.windZones.find(b=>n>=b.startMeter&&n<=b.endMeter)??this.windZones[this.windZones.length-1],g=f?1+f.vector*(f.windSpeedKph/100)*.52:1;a+=p*m*g*s.length_km,r+=s.length_km}return r>0?a/r:0}resolveStartOffsetSeconds(t,a,r){if(this.isIndividualTimeTrial)return a*Dd;if(this.isTeamTimeTrial){const s=t.rider.activeTeamId;return(s!=null?r.get(s)??0:0)*_d}return 0}buildIntermediateMarkers(){return rt(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||$t(t)).map(({key:t,label:a,marker:r,kmMark:s})=>({key:t,distanceMeters:s*1e3,label:a,markerType:r.type,markerCategory:r.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(d=>d.distanceMeters<t.groupPhaseEndDistanceMeters),r=this.stageDistanceMeters*tc,s=a.some(d=>d.distanceMeters<=r);if(!(a.length<=1||!s))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(Ia,Math.ceil(r/Ia)*Ia);for(let d=o;d<t.groupPhaseEndDistanceMeters;d+=Ia)i.push(d);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,r){const s=dc(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,d=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),p=Math.min(85,o.value)+l,u=this.isTimeTrialMode?0:t.teamGroupBonus,m=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:f,staminaPenalty:g,elevationPenalty:b}=this.resolveEffectiveSkill({rider:t,baseSkill:p,staminaPenalty:d,teamGroupBonus:u,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:m}),y=be(a.gradient_percent,-20,20),v=y>0?Math.exp(-.11*y):1-y*.06,x=1+r.vector*(r.windSpeedKph/100)*.52,M=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:s,skillBreakdown:o.breakdown,baseSkill:p,teamGroupBonus:u,effectiveSkill:f,staminaPenalty:g,elevationPenalty:b,gradientPercent:y,gradientModifier:v,windModifier:x,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(f,t.distanceCoveredMeters,a,v,x):this.resolveRoadStageSpeedMps(f,t.distanceCoveredMeters,a,v,x,M)}}resolveRoadStageSpeedMps(t,a,r,s,n,i){const o=this.resolveSkillSpreadFactor(a,r),d=this.resolveSegmentElevation(r,a),l=this.resolveElevationSkillSpreadFactor(r,d),m=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,m*s*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const r=Math.max(0,a-jd),s=Math.floor(r/Od);return t.terrain==="Mountain"?1+(s*Ud+s*Math.max(0,s-1)*Yd/2):1+s*Vd}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const r=a.filter(n=>n.activeTerrain===t.activeTerrain);return(r.length>0?r:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,r){if(r<=1)return{draftModifier:1,draftPackFactor:0};const s=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,d=-i*(o/70),p=Math.max(.3,.35+.35*d)*Math.min(1,s)*sn,u=be(a.gradient_percent,-20,20),m=cn(u),f=mn(r);return{draftModifier:1+p*f*m,draftPackFactor:f}}resolveBreakawayTimeGapPenalty(t){if(t<ln)return 0;const a=Math.floor((t-ln)/Qd);return ec+a}recordBreakawayFallbackCheckpointCrossings(t,a,r,s,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>r)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const d=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?s+d-t.startOffsetSeconds:s+d);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let s=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((d,l)=>l.distanceCoveredMeters-d.distanceCoveredMeters||l.currentSpeedMps-d.currentSpeedMps||d.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,s;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const d=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!d)break;const l=n.markerCrossings[d.key]??null;if(!l)break;const p=t.map(u=>u.markerCrossings[d.key]??null).filter(u=>u!=null).sort((u,m)=>u.crossingTimeSeconds-m.crossingTimeSeconds||u.riderId-m.riderId)[0]??null;if(p){const u=l.crossingTimeSeconds-p.crossingTimeSeconds;s=this.resolveBreakawayTimeGapPenalty(u),this.breakawayGapStatus={gapSeconds:u,penalty:s,kmMark:d.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const d=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[d]??null;if(l==null)break;const p=t.map(u=>u.breakawayFallbackCheckpointTimes[d]??null).filter(u=>u!=null).sort((u,m)=>u-m)[0]??null;if(p!=null){const u=l-p;s=this.resolveBreakawayTimeGapPenalty(u),this.breakawayGapStatus={gapSeconds:u,penalty:s,kmMark:d<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[d]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return s}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),r=this.riders.filter(o=>!te(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),s=this.riders.filter(o=>!te(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(r.length===0||s.length===0){this.breakawayGapStatus=null;return}const n=[...r].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null,i=[...s].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const d=this.intermediateMarkers[o];if(!d)continue;const l=n.markerCrossings[d.key]??null,p=i.markerCrossings[d.key]??null;if(!l||!p)continue;const u=p.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:u,penalty:this.resolveBreakawayTimeGapPenalty(u),kmMark:d.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const d=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(d==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,p=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||p==null)continue;const u=p-l;this.breakawayGapStatus={gapSeconds:u,penalty:this.resolveBreakawayTimeGapPenalty(u),kmMark:d/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=new Set(a.riderIds),s=this.riders.filter(o=>!te(o)&&r.has(o.rider.id));if(s.length===0)return;const n=this.riders.filter(o=>!te(o)&&!r.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(s,n);for(const o of s)o.breakawayGapPenalty=i;for(const o of s){const d=this.currentSegment(o);if(!d)continue;const p=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=p,o.tempSpeedMps=this.resolveRoadStageSpeedMps(p,o.distanceCoveredMeters,d,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(d.terrain));const u=this.resolveMaxBreakawayDraftModifier(o,d,s.length);o.draftModifier=u.draftModifier,o.draftNearbyRiderCount=Math.max(0,s.length-1),o.draftPackFactor=u.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*u.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,r,s,n){return this.resolveRoadStageSpeedMps(t,a,r,s,n,.5)}syncRiderTelemetry(t,a=null){var i;const r=this.currentSegment(t),s=this.currentWindZone(t);if(te(t)||!r||!s){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,r,s);t.segmentStartKm=r.start_km,t.segmentEndKm=r.end_km,t.segmentStartElevation=r.start_elevation,t.segmentEndElevation=r.end_elevation,t.activeTerrain=r.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),r=this.riders.reduce((n,i)=>te(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(r<=t.phaseEndDistanceMeters)return!1;let s=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(r<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<nc){n.breakawayMalus=0,s=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),d=Math.floor(o/ac),l=Math.min(sc,n.breakawayInitialMalus),p=Math.max(l,n.breakawayInitialMalus-d*rc),u=jt(p);u!==n.breakawayMalus&&(n.breakawayMalus=u,s=!0)}return s}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const r=new Set(a.riderIds);for(const s of this.riders)te(s)||!r.has(s.rider.id)||this.syncRiderTelemetry(s,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(s=>t.riderIds.includes(s.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const s of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:s.rider.id,riderName:s.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(s.rider.id,s.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let r=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),r=!0}if(this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayMalus=t.malusValue,s.breakawayInitialMalus=t.malusValue,s.breakawayRecoveryStartDistanceMeters=null,s.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return r}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=this.riders.filter(o=>!te(o)&&a.riderIds.includes(o.rider.id));if(r.length===0)return;const s=[...r].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0];if(!s)return;const n=Math.max(.1,s.currentSpeedMps),i=s.distanceCoveredMeters+n*t;for(const o of r){if(Math.max(0,s.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?Sd:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const r=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(r==null||r.isCounterAttack)return!0;const s=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(s==null?void 0:s.isCounterAttack)===!0&&s.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(r=>r.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const r=this.resolvePreStageGcRank(t);return r!=null?`${a} (${r}.)`:a}triggerStageAttacksForRider(t,a,r,s){if(te(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||r<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(r/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const d=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/d),p=s+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:p,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const u=new Set(this.activeStageAttacksByRiderId.keys()),m=this.stageFavorites.slice(0,20).filter(b=>{if(b.kind!=="rider"||b.riderId==null)return!1;const y=this.riders.find(x=>x.rider.id===b.riderId);if(!y||te(y))return!1;const v=t.distanceCoveredMeters-y.distanceCoveredMeters;return v>=0&&v<=150}),f=Rd(m,t.rider.id,u),g=[];for(const b of f){const y=this.riders.find(v=>v.rider.id===b);!y||te(y)||this.activeStageAttacksByRiderId.has(b)||(this.activeStageAttacksByRiderId.set(b,{riderId:b,remainingSeconds:an,startedAtElapsedSeconds:p,triggerDistanceMeters:y.distanceCoveredMeters,durationSeconds:an,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),y.isAttacking=!0,g.push({riderId:b,riderName:this.formatRiderWithPreStageGc(b,y.riderName),riderTeamId:y.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:p,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const b of g)this.pushMessage({elapsedSeconds:p,riderId:b.riderId,riderName:b.riderName,type:"counter_attack",tone:"warning",title:`${b.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const r of t){if(r.finishStatus==="dnf")continue;const s=a[a.length-1];if(!s||Math.abs(s.distanceMeter-r.distanceCoveredMeters)>=Ma){a.push({riderIds:[r.rider.id],riderCount:1,distanceMeter:r.distanceCoveredMeters,distanceSum:r.distanceCoveredMeters});continue}s.riderIds.push(r.rider.id),s.riderCount+=1,s.distanceSum+=r.distanceCoveredMeters,s.distanceMeter=s.distanceSum/s.riderCount}return a.map(({distanceSum:r,...s})=>s)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!te(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),r=new Map;let s=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],d=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-d<Ma;){const u=a[n].rider.activeTeamId;u!=null&&r.set(u,(r.get(u)??0)+1),n+=1}for(;s<a.length&&d-a[s].distanceCoveredMeters>=Ma;){const u=a[s].rider.activeTeamId;if(u!=null){const m=(r.get(u)??0)-1;m<=0?r.delete(u):r.set(u,m)}s+=1}const l=o.rider.activeTeamId,p=l==null?0:Math.max(0,(r.get(l)??0)-1);t.set(o.rider.id,p===0?0:jt(p*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?Wd:0,r=this.resolveBreakawaySkillBonus(t.rider),s=t.baseSkill+Xa(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+r+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,s),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const r=be(this.stageDistanceMeters/1e3,qd,Xd),s=this.interpolateStaminaDistanceValue(r),n=be(t,on,Rr),i=(Rr-n)/(Rr-on),o=s/3+i*s,d=this.stageDistanceMeters<=0?0:be(a/this.stageDistanceMeters,0,1);return o*d**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=wt[0].kmMark)return wt[0].value;for(let a=0;a<wt.length-1;a+=1){const r=wt[a],s=wt[a+1];if(t<=s.kmMark){const n=Math.max(1e-4,s.kmMark-r.kmMark),i=(t-r.kmMark)/n;return r.value+(s.value-r.value)*i}}return wt[wt.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/Mr),r=Math.max(1,Math.ceil(t/Mr)),s=ge(Ad,Bd),n=Array.from({length:r},()=>ge(.2,1.2)),i=n.reduce((l,p)=>l+p,0),o=Array.from({length:a+1},()=>1);o[0]=s;let d=0;for(let l=1;l<=r;l+=1)d+=n[l-1]??0,o[l]=s+(1-s)*(d/i);return o}resolveSkillSpreadFactor(t,a){const r=this.stageDistanceMeters<=0?1:be(t/this.stageDistanceMeters,0,1),s=Math.min(this.spreadCurve.length-1,Math.floor(r/Mr)),n=this.spreadCurve[s]??1;if(r<=this.lateStageStartRatio)return n;const i=Ul(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),d=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=be((r-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),p=this.interpolateFinalSpread(o,l);if(o<=1&&d<=1)return n;if(r<this.finalPushStartRatio||d<=o)return Math.max(n,p);const u=be((r-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),m=o+(d-o)*u;return Math.max(n,m)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const r=Mi(this.simulationMode,t,this.skillWeightRuleMap).map(s=>({key:s.key,weight:s.weight}));return this.weightedSkillComponentsByTerrain.set(t,r),r}resolveWeightedSkill(t,a,r=0){const s=this.resolveWeightedSkillComponents(a),n=r>0||t.mentorBoosts?{...t.skills}:t.skills;if(r>0&&(n.stamina=Math.max(0,n.stamina-r)),t.mentorBoosts)for(const[l,p]of Object.entries(t.mentorBoosts))typeof p=="number"&&(n[l]+=p);let i=0,o=0;for(const l of s)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:Ol(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,s)}}resolveSkillBreakdown(t,a,r){const s=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(s);if(n!==void 0)return n;const i=cc(t,r);return this.skillBreakdownCache.set(s,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const r=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,s=Math.max(0,100-r)/1e3,n=this.resolveElevationBucket(a);return s*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const r=a??this.interpolateElevation(t.distanceCoveredMeters),s=this.resolveElevationBucket(r);return s===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=s,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,r)),t.elevationPenalty}resolveSegmentElevation(t,a){const r=t.start_km*1e3,s=t.end_km*1e3,n=Math.max(1e-4,s-r),i=be((a-r)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const s=be(t,0,this.stageDistanceMeters)/1e3;if(s<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(s<=o.kmMark){const d=Math.max(1e-4,o.kmMark-i.kmMark),l=(s-i.kmMark)/d;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),Ir(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var u;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(Te).sort((m,f)=>(m.finishTimeSeconds??0)-(f.finishTimeSeconds??0)||f.photoFinishScore-m.photoFinishScore||m.rider.id-f.rider.id);if(t.length===0)return;const a=[];let r=null;for(const m of t){const f=m.finishTimeSeconds??0;if(a.length===0){a.push(m),r=f;continue}if(r!=null&&f-r<=ca){a.push(m),r=f;continue}break}const s=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=m=>m.photoFinishScore,o=[...a].sort((m,f)=>i(f)-i(m)||m.rider.id-f.rider.id),d=((u=o[0])==null?void 0:u.finishTimeSeconds)??0,l=this.finishWeightProfile,p=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${p} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${ca.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${s}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((m,f)=>{const g=bc(m,l).map($=>`${Ai[$.skillKey]} ${$.contribution.toFixed(2)} = ${$.effectiveSkill.toFixed(2)} x ${($.weight*100).toFixed(0)}%`).join(" | "),b=m.finishTimeSeconds??0,y=b-d,v=y<=1e-4?`${b.toFixed(2)} s`:`${b.toFixed(2)} s (+${y.toFixed(2)} s)`,x=this.calculatePhotoFinishScore(m),M=m.leadoutBonus??0,T=aa(m,s,n);console.log(`#${f+1} Zielsprint | ${m.riderName} | Zeit ${v} | Score (ohne Boni): ${x.toFixed(2)} -> Score (mit Boni): ${m.photoFinishScore.toFixed(2)} [SpecAdj: ${T>0?"+":""}${T.toFixed(2)}, Leadout: +${M.toFixed(2)}] | ID-Tiebreak ${m.rider.id} | (${g})`)}),console.groupEnd()}recordIntermediateSplits(t,a,r,s,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>r)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,d=Math.max(0,this.isTimeTrialMode?s+o-t.startOffsetSeconds:s+o);let l=this.resolveMarkerCrossingScore(t,i);const p=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;p&&(l+=aa(t,p,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=d,t.splitTimes[i.key]=d,t.splitTimes[i.label]=d,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:d,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return Ir(t,this.resolveSprintWeightProfile());const r=Ir(t,this.resolveClimbWeightProfile(a.markerCategory)),s=oc(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return r+s}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??Cd}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??Nd[a]}calculatePreLeadoutFinishScore(t){const r=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,s=Xa(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[d,l])=>{if(!l)return o;const p=d==="stamina"?r:0,u=Math.max(0,t.rider.skills[d]+s+t.dailyForm+t.microForm+t.teamGroupBonus-p);return o+u*l},0),i=aa(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}applySprintLeadoutBonuses(){const t=this.resolveFinishMarkerType();if(t!=="finish_flat"&&t!=="finish_hill"||this.isTimeTrialMode)return;const a=this.riders.filter(Te).sort((o,d)=>(o.finishTimeSeconds??0)-(d.finishTimeSeconds??0));if(a.length===0)return;const r=[];let s=null;for(const o of a){const d=o.finishTimeSeconds??0;if(r.length===0){r.push(o),s=d;continue}if(s!=null&&d-s<=ca){r.push(o),s=d;continue}break}const n=new Set(r.map(o=>o.rider.id)),i=new Map;for(const o of this.riders)if(o.finishStatus!=="dnf"&&o.finishStatus!=="otl"&&o.finishStatus!=="dns"&&o.finishTimeSeconds!=null&&o.rider.skills.sprint>=73&&o.rider.activeTeamId!=null&&n.has(o.rider.id)){const d=o.rider.activeTeamId,l=i.get(d)??[];l.push(o),i.set(d,l)}for(const[o,d]of i.entries()){if(d.length===0)continue;let l=null,p=Number.NEGATIVE_INFINITY;for(const u of d){const m=this.calculatePreLeadoutFinishScore(u);m>p?(p=m,l=u):m===p&&l!==null&&(u.rider.skills.sprint>l.rider.skills.sprint||u.rider.skills.sprint===l.rider.skills.sprint&&u.rider.id<l.rider.id)&&(l=u)}if(l){const u=this.calculateSprintLeadoutBonusForRider(l);u>0&&(l.leadoutBonus=u,l.photoFinishScore+=u)}}}calculateSprintLeadoutBonusForRider(t){const a=t.rider.activeTeamId;if(a==null)return 0;const r=this.riders.filter(p=>p.rider.activeTeamId===a);if(r.length===0)return 0;let s=this.teamSprintRandomValues.get(a);s===void 0&&(s=ge(.25,.6),this.teamSprintRandomValues.set(a,s));let n=this.teamSprintSpecialRandomValues.get(a);n===void 0&&(n=ge(.1,.3),this.teamSprintSpecialRandomValues.set(a,n)),t.leadoutRiderId=null;let i=0,o=0,d=null;const l=[];for(const p of r){if(p.rider.id===t.rider.id||p.finishStatus==="dnf"||p.finishStatus==="otl"||p.finishStatus==="dns")continue;let u=0;const m=p.rider.skills.sprint>=72,f=p.rider.skills.flat>=78,g=p.rider.skills.timeTrial>=76,b=p.rider.skills.acceleration>=80;if(m&&u++,f&&u++,g&&u++,b&&u++,u>0){const y=m?s:n;let v=1;u===2?v=1.25:u===3?v=1.5:u===4&&(v=2);const x=y*v*1.5;if(i+=y*v,l.push({riderId:p.rider.id,name:p.riderName,contribution:Number(x.toFixed(2))}),y*v>o)o=y*v,d=p.rider.id;else if(y*v===o&&d!==null){const M=this.riders.find(T=>T.rider.id===d);M&&p.rider.skills.sprint>M.rider.skills.sprint&&(d=p.rider.id)}}}return i>0&&(t.leadoutRiderId=d,t.leadoutContributions=l),i*1.5}resolveFinishMarkerType(){const t=rt(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const r=t[a].marker.type;if(r==="finish_flat"||r==="finish_hill"||r==="finish_mountain")return r}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return Fd;case"finish_mountain":return Pd;default:return Ed}}resolveRiderClockSeconds(t){if(Te(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,r,s=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(d=>d.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){s=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const d=this.riders.find(p=>p.rider.id===o);if(!d||te(d))continue;if(Math.abs(d.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const p=Ql(d.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(d,p,r,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:s?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:s?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:r,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(r=>r.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+Ma){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const Sc=300;async function kc(e,t){const a=new Hi(e,{maxSubstepSeconds:5});let r=!1;for(;!r;){const s=a.step(Sc);if(r=s.isFinished,t){const n=s.stageDistanceMeters>0?s.leaderDistanceMeters/s.stageDistanceMeters:0,i=e.riders.length>0?s.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const $c=[1,2,5,10,25,50,100,250,500],pn=new WeakMap;function xc(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function gn(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Tc(e){const t=pn.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${$c.map(r=>`
          <button
            type="button"
            class="race-sim-speed-btn"
            data-race-sim-speed="${r}"
          >${r}x</button>
        `).join("")}
      </div>
      <strong class="race-sim-control-meta" data-race-sim-field="time">00:00:00</strong>
      <strong class="race-sim-control-meta" data-race-sim-field="finished">0 / 0 im Ziel</strong>
      <strong class="race-sim-control-distance" data-race-sim-field="distance">0,0 km / 0,0 km</strong>
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return pn.set(e,a),a}function fn(e,t){const a=Tc(e);a.timeField&&(a.timeField.textContent=xc(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${gn(t.snapshot.leaderDistanceMeters)} / ${gn(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(r=>{const s=Number(r.dataset.raceSimSpeed);r.classList.toggle("active",s===t.timeMultiplier)})}const wc=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function Mc(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),r=t%60;return`${a}:${String(r).padStart(2,"0")}`}function Jt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Rc(e){return`/jersey/Jer_${e}.png`}function Gi(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${Jt(Rc(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Ic(e){return e.riderId==null||e.riderTeamId==null?"":Gi(e.riderTeamId)}function Cc(e){const t=Jt(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function Ec(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${Jt(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${Jt(e)}</button>`}function Fc(e,t){if(t==="all")return!0;const a=zi(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function Pc(e){const t=e.detail?Jt(e.detail):"",a=(e.secondaryRiders??[]).map(s=>`${s.riderTeamId!=null?Gi(s.riderTeamId,"race-sim-message-inline-jersey"):""}${Ec(s.riderName,s.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const r=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${r}</span>`}function zi(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function hn(e,t,a="all"){const r=t.filter(n=>Fc(n,a)),s=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${wc.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${r.length===0?`<div class="race-sim-message-empty">${s}</div>`:r.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${Jt(zi(n))}">
          <span class="race-sim-message-time">t=${Mc(n.elapsedSeconds)}</span>
          ${Ic(n)}
          <span class="race-sim-message-text">
            ${Cc(n)}
            ${Pc(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const Nc=1,Lc={Flat:12,Rolling:14,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:23,High_Mountain:25,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function Dc(e){return Math.max(0,Math.round(e))}function Ki(e){return e==="ITT"||e==="TTT"}function _c(e){return Lc[e]??20}function Ac(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+_c(e)/100))}function Bc(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function bn(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function Cr(e,t){if(Ki(t))return[...e].sort(Bc);const a=[...e].sort((o,d)=>o.stageTimeSeconds-d.stageTimeSeconds||bn(o,d)),r=[];let s=[],n=null;const i=()=>{r.push(...s.sort(bn))};for(const o of a){if(s.length===0){s=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=Nc){s.push(o),n=o.stageTimeSeconds;continue}i(),s=[o],n=o.stageTimeSeconds}return s.length>0&&i(),r}function Q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Hc(e){return`/jersey/Jer_${e}.png`}function va(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${Q(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${Q(Hc(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Sa(e,t,a){return e==null?`<span class="${a}" title="${Q(t)}">${Q(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${Q(t)}">${Q(t)}</button>`}function Gc(e){return e.toFixed(1).replace(".",",")}function Qa(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function zc(e){return`${e??0} Pkt.`}function Kc(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function Wc(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function Wi(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function jc(e){if(e==null||e<=0)return Wi(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function vt(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function Ea(e){return`${e.toFixed(1).replace(".",",")} km`}function yn(e){return`${e.toFixed(1).replace(".",",")}%`}function Fa(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function vn(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function Oc(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function Vc(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function Uc(e,t,a){return Array.from({length:t},(r,s)=>e.slice(s*a,(s+1)*a))}function Yc(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const r=Uc(e,4,5),s=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${r.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=Vc(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${va(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${Sa(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${Q(i.roleLabel)}">${Q(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?s.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${Q(Qa(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${Gc(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function ha(e,t){const a=e.riders.find(r=>r.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function pr(e,t){const a=e.riders.find(n=>n.id===t),r=(a==null?void 0:a.activeTeamId)??null,s=r!=null?e.teams.find(n=>n.id===r)??null:null;return{teamId:r,teamName:(s==null?void 0:s.name)??null}}function Zc(e,t,a,r={}){const s=(t??[]).slice(0,r.limit??8);return s.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${s.map(n=>{var u;const i=n.riderId??0,o=pr(e,i),d=ha(e,i),l=((u=r.distanceGapsByRiderId)==null?void 0:u.get(i))??null,p=[r.distanceGapClassName??"",Wc(l)].filter(m=>m.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${va(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${Sa(n.riderId,d,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${r.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${p}">${Q(Kc(l))}</span>`:""}
      </article>`}).join("")}</div>`}function Pa(e,t,a,r,s,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${Q(e)}</h4>
      ${Zc(a,r,s,n)}
    </section>`}function Ht(e,t,a,r,s=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${r}" ${s?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${r}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${Q(e)}</span>
      </summary>
      ${t}
    </details>`}function er(e,t,a,r){const s=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var d;const i=s.get(n.id)??null,o=((d=a.get(n.id))==null?void 0:d[r])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||ha(e,n.riderId).localeCompare(ha(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function Sn(e){const t=Jc(e)?e.stagePoints:0;return`${Q(zc("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${Q(t)}</span></span>`:""}`}function Jc(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function kn(e,t){if(t==null)return new Map;const a=e.riders.find(r=>r.riderId===t)??null;return a?new Map(e.riders.map(r=>[r.riderId,a.distanceCoveredMeters-r.distanceCoveredMeters])):new Map}function qc(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function Ka(e,t){var r;const a=(r=e.race.category)==null?void 0:r.bonusSystem;return!a||t==null||t==="Sprint"?[]:vt(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function ls(e){var r;const t=(r=e.race.category)==null?void 0:r.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return vt(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return vt(a?t.pointsMountainStage:t.pointsSprintFinish)}function ji(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:vt((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function Xc(e,t,a){let r=null;for(const s of e.stageSummary.segments){const n=Math.max(t,s.start_km),i=Math.min(a,s.end_km),o=Math.max(0,i-n);if(o<=0)continue;const d={lengthKm:o,gradient:s.gradient_percent};(r==null||d.gradient>r.gradient||d.gradient===r.gradient&&d.lengthKm>r.lengthKm)&&(r=d)}return r}function Er(e,t,a,r=null){return e.entries.filter(s=>r==null||r.has(s.riderId)).map((s,n)=>({riderId:s.riderId,rank:s.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:s.crossingTimeSeconds,gapSeconds:s.gapSeconds})).filter(s=>s.points>0)}function ds(e){const t=new Map;for(const a of e)for(const r of a.entries){const s=t.get(r.riderId)??{points:0,mountain:0};r.pointsKind==="mountain"?s.mountain+=r.points:s.points+=r.points,t.set(r.riderId,s)}return t}function Qc(e){return rt(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function tr(e,t){const a=Ki(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?Dc(a):null}function gr(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=tr(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const r=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(r)||r<=0)return Cr(a,e.stage.profile).map(n=>n.rider);const s=Ac(e.stage.profile,a.map(n=>n.stageTimeSeconds));return s==null?Cr(a,e.stage.profile).map(n=>n.rider):Cr(a.filter(n=>n.stageTimeSeconds<=s),e.stage.profile).map(n=>n.rider)}function eu(e,t){const a=ls(e);return a.length===0?[]:gr(e,t).map((r,s)=>({riderId:r.riderId,rank:s+1,points:a[s]??0,pointsKind:"points",crossingTimeSeconds:tr(e,r),gapSeconds:null})).filter(r=>r.points>0)}function tu(e,t){const a=gr(e,t).slice(0,20),r=a[0]!=null?tr(e,a[0])??0:0;return a.map((s,n)=>{const i=tr(e,s)??0;return{riderId:s.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-r),photoFinishScore:s.photoFinishScore}})}function au(e,t){var a;return((a=gr(e,t)[0])==null?void 0:a.riderId)??null}function cs(e,t,a){var M,T;const r=rt(e.stageSummary),s=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(gr(e,a).map($=>$.riderId)):null,i=r.filter(({marker:$})=>$.type==="climb_start"),o=r.filter(({marker:$})=>$t($)).sort(($,w)=>$.kmMark-w.kmMark).map(($,w)=>{var se,q;const C=[...i].reverse().find(ee=>ee.kmMark<=$.kmMark)??null,E=qc(e,$.kmMark),F=(C==null?void 0:C.kmMark)??(E==null?void 0:E.start_km)??$.kmMark,L=(C==null?void 0:C.elevation)??(E==null?void 0:E.start_elevation)??$.elevation,_=Math.max(0,$.kmMark-F),G=_>0?($.elevation-L)/(_*1e3)*100:(E==null?void 0:E.gradient_percent)??0,K=Xc(e,F,$.kmMark),R=t.find(ee=>ee.markerKey===$.key)??null,B=Ka(e,(R==null?void 0:R.markerCategory)??$.marker.cat??null),U=R?Er(R,B,"mountain",n):[],W=(R==null?void 0:R.markerCategory)??$.marker.cat??null;return{key:$.key,title:`${w+1}. Bergwertung`,label:$.label,categoryLabel:W?`Kat. ${W}`:null,categoryClassName:vn(W),kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:_,averageGradient:G,steepestSegmentLengthKm:(K==null?void 0:K.lengthKm)??null,steepestSegmentGradient:(K==null?void 0:K.gradient)??null,highlightMeta:$.kmMark>=s,leaderRiderId:((se=U[0])==null?void 0:se.riderId)??((q=R==null?void 0:R.entries[0])==null?void 0:q.riderId)??null,displayBadges:Fa(B,"mountain"),entries:U,timingEntries:(R==null?void 0:R.entries)??[],accent:"mountain"}}),d=r.filter(({marker:$})=>$.type==="sprint_intermediate").sort(($,w)=>$.kmMark-w.kmMark).map(($,w)=>{var L,_;const C=t.find(G=>G.markerKey===$.key)??null,E=ji(e),F=C?Er(C,E,"points",n):[];return{key:$.key,title:`${w+1}. Zwischensprint`,label:$.label,categoryLabel:null,categoryClassName:null,kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((L=F[0])==null?void 0:L.riderId)??((_=C==null?void 0:C.entries[0])==null?void 0:_.riderId)??null,displayBadges:Fa(E,"points"),entries:F,timingEntries:(C==null?void 0:C.entries)??[],accent:"sprint"}}),l=Qc(e),p=eu(e,a),u=l?t.find($=>$.markerKey===l.key)??null:null,m=u?Er(u,Ka(e,u.markerCategory),"mountain",n):[],f=ls(e),g=u?Ka(e,u.markerCategory):[],b=e.stage.profile==="ITT"||e.stage.profile==="TTT"?tu(e,a):(u==null?void 0:u.entries)??[],y=((M=p[0])==null?void 0:M.riderId)??((T=m[0])==null?void 0:T.riderId)??au(e,a),v={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:u!=null&&u.markerCategory?`Kat. ${u.markerCategory}`:null,categoryClassName:vn((u==null?void 0:u.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(u!=null&&u.markerCategory),leaderRiderId:y,displayBadges:[...Fa(f,"points"),...Fa(g,"mountain")],entries:[...p,...m],timingEntries:b,accent:"finish"};return[...[...d,...o].sort(($,w)=>$.kmMark-w.kmMark||$.title.localeCompare(w.title,"de")),v].filter($=>$.entries.length>0||$.timingEntries.length>0||$.accent!=="finish"||l!=null||a.isFinished)}function ru(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),r=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,s=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,r):t.entries.slice(0,r).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return s.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${s.map(n=>{const i=pr(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${va(i.teamId,i.teamName)}
            ${Sa(n.riderId,ha(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?Q(Wi(n.crossingTimeSeconds)):Q(jc(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function $n(e,t){var a;return((a=e==null?void 0:e.find(r=>r.riderId===t))==null?void 0:a.points)??0}function xn(e,t){var a;return((a=e.filter(r=>r.riderId!=null&&t.has(r.riderId)).sort((r,s)=>r.rank-s.rank||r.riderId-s.riderId)[0])==null?void 0:a.riderId)??null}function Na(e,t,a){if(!(!t||e.some(r=>r.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function su(e,t,a,r,s){const n=new Set(e.riderIds),i=new Map(t.riders.map(f=>[f.riderId,f])),d=e.riderIds.map(f=>i.get(f)??null).filter(f=>f!=null).sort((f,g)=>{var b,y;return(((b=a.get(f.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)-(((y=a.get(g.riderId))==null?void 0:y.rank)??Number.MAX_SAFE_INTEGER)||f.riderName.localeCompare(g.riderName,"de")||f.riderId-g.riderId}).slice(0,25),l=i.get(xn(r,n)??-1)??null,p=i.get(xn(s,n)??-1)??null,u=l!=null&&!d.some(f=>f.riderId===l.riderId),m=p!=null&&!d.some(f=>f.riderId===p.riderId);return d.length>=25&&u&&m&&l.riderId!==p.riderId?(Na(d,l,23),Na(d,p,24),d):(Na(d,l,24),Na(d,p,24),d)}function nu(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function iu(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function Tn(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function ou(e,t){const a=t.riders.filter(s=>e.riderIds.includes(s.riderId)).reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0),r=Math.max(0,t.leaderDistanceMeters-a);return r>0?`-${Math.round(r)} m`:"—"}function lu(e,t,a,r,s,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=Fl(a,r),d=a.find(m=>m.label===o)??a[0],l=new Map(e.gcStandings.map(m=>[m.riderId,m])),p=ds(i),u=su(d,t,l,s,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${Q(d.label)} <span class="race-sim-group-count">(${d.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${Q(Tn(d.previousGapMeters,"-"))}</span>
        <span>Leader ${Q(ou(d,t))}</span>
        <span>Hinten ${Q(Tn(d.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${u.map((m,f)=>{const g=l.get(m.riderId)??null,b=pr(e,m.riderId),y=p.get(m.riderId)??{points:0,mountain:0},v=$n(s,m.riderId),x=$n(n,m.riderId),M=nu(m.riderId,e.classificationLeaders),T=M.length>0?M.map($=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[$]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${iu(M)}" title="${Q(T)}">${f+1}.</strong>
              ${va(b.teamId,b.teamName)}
              <span class="race-sim-classification-main">
                ${Sa(m.riderId,m.riderName,`race-sim-group-rider-name${m.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${g?g.rank:"—"} · ${Q(g?Qa(g.gapSeconds):"—")} · ${Q(m.gapToLeaderMeters>0?`+${Math.round(m.gapToLeaderMeters)} m`:"—")}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${v}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${x}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${y.points>0?`▲ +${y.points}`:" "}</span>
                  <span class="race-sim-breakaway-stage-gain">${y.mountain>0?`▲ +${y.mountain}`:" "}</span>
                </span>
              </span>
            </article>`}).join("")}
      </div>
    </section>`}function du(e,t,a,r){const s=cs(t,a.markerClassifications,a),n=ds(s),i=er(t,t.pointsStandings,n,"points"),o=er(t,t.mountainStandings,n,"mountain"),d=os(is(a.clusters));e.innerHTML=lu(t,a,d,r,i,o,s)}function cu(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function uu(e){const t=rt(e.stageSummary),a=ji(e)[0]??0,r=ls(e)[0]??0,s=t.filter(({marker:n})=>$t(n)).reduce((n,{marker:i})=>n+(Ka(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+r,mountain:s}}function wn(e){const t=uu(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function mu(e){const t=Oc(e),a=[`<span class="race-sim-stage-points-meta-pill">${Q(Ea(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${Q(`${Ea(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${Q(`Länge ${Ea(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${Q(`Ø ${yn(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${Q(`Steilstes ${Ea(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${Q(yn(e.steepestSegmentGradient))}</span>`:""].filter(r=>r.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${Q(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${Q(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${Q(e.label)}">${Q(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((r,s)=>`${s>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${r}`).join("")}
    </span>`}function pu(e,t,a,r=null){const s=r??cs(e,t,a);return s.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${wn(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${wn(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${s.map(n=>{const i=n.leaderRiderId!=null?pr(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?ha(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${mu(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${cu(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${va(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?Sa(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${Q(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${ru(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function gu(e,t,a,r,s,n=new Set){var f,g;const i=cs(a,r,s),o=ds(i),d=er(a,a.pointsStandings,o,"points"),l=er(a,a.mountainStandings,o,"mountain"),p=kn(s,((f=a.gcStandings[0])==null?void 0:f.riderId)??null),u=kn(s,((g=a.youthStandings[0])==null?void 0:g.riderId)??null),m=b=>!n.has(b);e.innerHTML=`
    ${Ht("Stage Favorites",Yc(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",m("favorites"))}
    <section class="race-sim-classifications-section">
      ${Ht("GC",Pa("GC","gc",a,a.gcStandings,b=>Q(`GC ${b.rank} · ${Qa(b.gapSeconds)}`),{limit:20,distanceGapsByRiderId:p}),"race-sim-overview-classification race-sim-overview-gc","gc",m("gc"))}
      ${Ht("Punktewertung",Pa("Punktewertung","points",a,d,Sn),"race-sim-overview-classification race-sim-overview-points","points",m("points"))}
      ${Ht("Bergwertung",Pa("Bergwertung","mountain",a,l,Sn),"race-sim-overview-classification race-sim-overview-mountain","mountain",m("mountain"))}
      ${Ht("Nachwuchsfahrerwertung",Pa("Nachwuchsfahrerwertung","youth",a,a.youthStandings,b=>Q(`${b.rank}. · ${Qa(b.gapSeconds)}`),{distanceGapsByRiderId:u,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",m("youth"))}
    </section>
    ${Ht("Etappenwertungen",pu(a,r,s,i),"race-sim-overview-stage-scoring","stageScoring",m("stageScoring"))}
  `}const Mn=new WeakMap,tt=new WeakMap,Rn=new WeakMap,Oi=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function X(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Vi(e){return e<=0?"—":`+${Math.round(e)} m`}function ua(e){const t=Oi.format(e);return e>0?`+${t}`:t}function Fr(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function ce(e){return Oi.format(e)}function Dt(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Ui(e){return`+${Dt(e)}`}function Yi(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function us(e){return`${(e*3.6).toFixed(1)} km/h`}function fu(e){return`${ua(e)}%`}function Vr(e){return`${e.toFixed(1).replace(".",",")} km`}function Zi(e){return`${Vr(e.segmentStartKm)} - ${Vr(e.segmentEndKm)}`}function hu(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function Ji(e){return e.replace(/_/g," ")}function qi(e){return Ji(e)}function bu(e){return Ji(e)}function Xi(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function yu(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function vu(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Qi(e){return rt(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||$t(t)).map(({key:t,label:a})=>({key:t,label:a}))}function Su(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function ku(e,t,a,r){var s;return a!=="ITT"&&a!=="TTT"?((s=r.get(t))==null?void 0:s.get(e.riderId))??null:e.splitTimes[t]??null}function eo(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(s=>({label:s.key,displayLabel:s.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${s.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function $u(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function xu(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function to(e){const t=Mn.get(e);if(t)return t;const a=Qi(e),r={splitMarkers:a,columns:eo(e,a,!1),riderById:new Map(e.riders.map(s=>[s.id,s])),teamById:new Map((e.teams??[]).map(s=>[s.id,s])),teamAbbreviationById:new Map((e.teams??[]).map(s=>[s.id,s.abbreviation])),teamNameById:new Map((e.teams??[]).map(s=>[s.id,s.name])),gcByRiderId:new Map((e.gcStandings??[]).map(s=>[s.riderId,s]))};return Mn.set(e,r),r}function ao(e,t){const a=e.parentElement,r=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!r)return"";const s=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",r.insertAdjacentElement("beforebegin",l),l})(),n=ms(e),i=$u(t),o=xu(i,n),d=tt.get(e);return(d==null?void 0:d.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),s.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,r.innerHTML=t.map(l=>Tu(l,n)).join(""),tt.set(e,{layoutKey:o,orderedRiderIds:(d==null?void 0:d.orderedRiderIds)??[],rowsByRiderId:(d==null?void 0:d.rowsByRiderId)??new Map,openDetailRiderId:(d==null?void 0:d.openDetailRiderId)??null,openTeamId:(d==null?void 0:d.openTeamId)??null})),o}function st(e,t){e.textContent!==t&&(e.textContent=t)}function La(e,t){e.title!==t&&(e.title=t)}function Da(e,t){e.className!==t&&(e.className=t)}function _a(e,t,a){return e.lastValues[t]!==a}function Aa(e,t,a){e.lastValues[t]=a}function ms(e){const t=Rn.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return Rn.set(e,a),a}function Tu(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${X(e.label)}">${X(a)}</span>`;const r=!t.autoSort&&t.manualSortKey===e.sortKey,s=r?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${r?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${X(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${X(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${X(a)}<span class="race-sim-leaderboard-sort-indicator">${X(s)}</span></button>`}function wu(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function Mu(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function In(e,t,a,r,s,n,i){if(r.autoSort)return(d,l)=>e.stage.profile==="ITT"?ro(d,l,t):Eu(d,l);if(!r.manualSortKey)return null;const o=r.manualSortDirection==="asc"?1:-1;return(d,l)=>{if(Ne(d)!==Ne(l))return Ne(d)?1:-1;const p=s.get(d.riderId)??null,u=s.get(l.riderId)??null,m=Cn(d,p,r.manualSortKey??"",e,a,n,i),f=Cn(l,u,r.manualSortKey??"",e,a,n,i);return Mu(m,f)*o||d.riderId-l.riderId}}function Ru(e,t,a){if(e.length!==t.size)return!1;let r=null;for(const s of e){const n=t.get(s);if(!n||r&&a(r,n)>0)return!1;r=n}return!0}function Cn(e,t,a,r,s,n,i){const o=r.race.isStageRace&&r.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return r.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?ku(e,a.slice(6),r.stage.profile,s):null}}function Iu(e,t,a,r,s,n,i,o,d){if(!s.manualSortKey){if(s.autoSort){const m=In(t,a,r,s,n,i,o);return m?[...e].sort(m):[...e]}const u=new Map(s.frozenOrder.map((m,f)=>[m,f]));return[...e].sort((m,f)=>(Ne(m)===Ne(f)?0:Ne(m)?1:-1)||(u.get(m.riderId)??Number.MAX_SAFE_INTEGER)-(u.get(f.riderId)??Number.MAX_SAFE_INTEGER)||m.riderId-f.riderId)}const l=In(t,a,r,s,n,i,o);if(!l)return[...e];const p=new Map(e.map(u=>[u.riderId,u]));return Ru(d,p,l)?d.map(u=>p.get(u)).filter(u=>u!=null):[...e].sort(l)}function Cu(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const p=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(p))return!1;const u=tt.get(e);return u?(u.openTeamId=u.openTeamId===p?null:p,u.openTeamId==null&&(u.openDetailRiderId=null),!0):!1}const r=t.closest("button[data-race-sim-rider-toggle]");if(r){const p=Number(r.dataset.raceSimRiderToggle);if(!Number.isFinite(p))return!1;const u=tt.get(e);return u?(u.openDetailRiderId=u.openDetailRiderId===p?null:p,!0):!1}const s=ms(e);if(t.closest("button[data-race-sim-splits-toggle]"))return s.showSplitColumns=!s.showSplitColumns,!s.showSplitColumns&&((l=s.manualSortKey)!=null&&l.startsWith("split:"))&&(s.manualSortKey=null,s.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return s.autoSort=!s.autoSort,s.autoSort?(s.manualSortKey=null,s.frozenOrder=[]):(s.manualSortKey=null,s.manualSortDirection="asc",s.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(p=>Number(p.dataset.raceSimRiderRow)).filter(p=>Number.isFinite(p))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||s.autoSort)return!1;const d=o.dataset.raceSimSortKey;return d?(s.manualSortKey===d?s.manualSortDirection=s.manualSortDirection==="asc"?"desc":"asc":(s.manualSortKey=d,s.manualSortDirection=wu(d)),s.frozenOrder=[],!0):!1}function En(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function Ne(e){return e.finishStatus==="dnf"}function ro(e,t,a){if(Ne(e)!==Ne(t))return Ne(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const d=a[o];if(!d)continue;const l=e.splitTimes[d.key],p=t.splitTimes[d.key];if(l!=null&&p!=null&&l!==p)return l-p;if(l!=null&&p==null)return-1;if(l==null&&p!=null)return 1}const r=En(e,a),s=En(t,a);if(r!==s)return r?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function Eu(e,t){return Ne(e)!==Ne(t)?Ne(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function so(e,t){const a=(t==null?void 0:t.formBonus)??0,r=(t==null?void 0:t.raceFormBonus)??0,s=((t==null?void 0:t.fatigueMalus)??0)*.5,n=((t==null?void 0:t.longTermFatigueMalus)??0)*.5,i=((t==null?void 0:t.shortTermFatigueMalus)??0)*.5,o=e.teamGroupBonus,d=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,p=e.baseSkill+l+a+r+e.dailyForm+e.microForm+o-s-n-i,u=Math.max(0,p-e.staminaPenalty),m=p-u,f=u-e.effectiveSkill;return[`Basis ${ce(e.baseSkill)}`,e.isAttacking?`+ Attacke ${ce(l)}`:null,`+ S-Form ${ce(a)}`,`+ R-Form ${ce(r)}`,`+ T-Form ${ce(e.dailyForm)}`,`+ Zufällige Form ${ce(d)} (skaliert)`,`+ Teambonus ${ce(o)}`,`- Fatigue ${ce(s)}`,`- Langzeit ${ce(n)}`,`- Akut ${ce(i)}`,`- Stamina ${ce(m)}`,`- HM ${ce(f)}`,`= Effektiv ${ce(e.effectiveSkill)}`].filter(g=>g!=null)}function Fu(e,t){return so(e,t).join(`
`)}function Pu(e){return ua(Math.max(-2.5,Math.min(2.5,e*2.5)))}function Nu(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function no(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${X(e.riderName)}">${X(e.riderName)}</button>`}function Lu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId)??"—",s=a.get(e.activeTeamId)??r;return`<span class="race-sim-team-code" title="${X(s)}">${X(r)}</span>`}function io(e){return`/jersey/Jer_${e}.png`}function Du(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId);if(!r)return"—";const s=a.get(e.activeTeamId)??r.name,n=io(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${X(s)}">
      <img
        class="race-sim-team-jersey-img"
        src="${X(n)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function _u(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function Au(e,t,a,r){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=r.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const s=e.splitTimes[t];return s!=null?Dt(s):"—"}function oo(e,t,a){const r=so(e,t),s=[{label:"Terrain / Skill",value:`${qi(e.activeTerrain)} / ${bu(e.skillName)}`},{label:"Aktiver Abschnitt",value:Zi(e)},{label:"Segmenthöhe",value:hu(e)},{label:"Basis",value:ce(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${ce(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:ua((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:ua((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:Fr((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:Fr((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:Fr((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:ce(e.staminaPenalty)},{label:"HM",value:ce(e.elevationPenalty)},{label:"T-Form",value:ua(e.dailyForm)},{label:"Zufall",value:Pu(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:Nu(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?Yi(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${X(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${X(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${s.map(n=>`<div class="race-sim-rider-detail-item"><span>${X(n.label)}</span><strong>${X(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${r.map(n=>X(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${X(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function Bu(e,t,a,r,s,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const d=document.createElement("div");d.className="race-sim-row-grid",o.appendChild(d);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",d.appendChild(l);const p=document.createElement("span");p.className="race-sim-row-flag",p.innerHTML=t?Cl(vu(t)):"—",d.appendChild(p);const u=document.createElement("span");u.className="race-sim-row-name",u.innerHTML=no(e,a),d.appendChild(u);const m=u.querySelector(".race-sim-row-name-btn");if(!m)throw new Error("race-sim-row-name-btn not found");const f=document.createElement("span");f.className="race-sim-row-team-visual",f.innerHTML=Du(t,s,i),d.appendChild(f);const g=document.createElement("strong");g.className="race-sim-row-team",g.innerHTML=Lu(t,n,i),d.appendChild(g);const b=(L="")=>{const _=document.createElement("strong");return L&&(_.className=L),d.appendChild(_),_},y=b("race-sim-gap"),v=b("race-sim-cell-effective-skill"),x=b(),M=b(),T=b(),$=r.map(()=>b()),w=b(),C=b(),E=b("race-sim-form-state-cell"),F=document.createElement("div");return F.className="race-sim-row-detail-popover hidden",o.appendChild(F),{row:o,rankField:l,nameButton:m,gapField:y,clockField:T,splitFields:$,effectiveSkillField:v,gcRankField:x,gcGapField:M,gradientPercentField:w,speedField:C,formStateField:E,detailPanel:F,initialized:!1,lastValues:{}}}function Hu(e,t,a,r,s,n,i,o,d,l,p){const u=(r==null?void 0:r.formBonus)??0,m=(r==null?void 0:r.raceFormBonus)??0,f=d&&l>1?p.get(a.riderId)??null:null,g=Ne(a),b=i!=="ITT"&&i!=="TTT"?g?"DNF":"—":a.hasStarted?g?"DNF":a.riderClockSeconds!=null?Dt(a.riderClockSeconds):"—":Ui(a.startOffsetSeconds);Da(e.row,`race-sim-row${t===1&&!g?" race-sim-row-leader":""}${s?" race-sim-row-detail-open":""}${g?" race-sim-row-dnf":""}`),st(e.rankField,`${t}.`),st(e.gapField,g?"DNF":Vi(a.gapToLeaderMeters)),st(e.clockField,b),e.nameButton.setAttribute("aria-expanded",s?"true":"false"),Da(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),La(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((M,T)=>{const $=e.splitFields[T];if(!$)return;const w=Au(a,M.key,i,o);st($,w),La($,M.label)}),_a(e,"effectiveSkillValue",a.effectiveSkill)&&(st(e.effectiveSkillField,ce(a.effectiveSkill)),Aa(e,"effectiveSkillValue",a.effectiveSkill));const y=`race-sim-cell-effective-skill ${Xi(a)}`;_a(e,"effectiveSkillClass",y)&&(Da(e.effectiveSkillField,y),Aa(e,"effectiveSkillClass",y));const v=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,u,m,a.dailyForm,a.microForm,(r==null?void 0:r.fatigueMalus)??0,(r==null?void 0:r.longTermFatigueMalus)??0,(r==null?void 0:r.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");_a(e,"effectiveSkillTitleKey",v)&&(La(e.effectiveSkillField,Fu(a,r)),Aa(e,"effectiveSkillTitleKey",v)),st(e.gcRankField,f?String(f.rank):"—"),st(e.gcGapField,f?Yi(f.gapSeconds):"—"),st(e.gradientPercentField,fu(a.gradientPercent)),Da(e.gradientPercentField,yu(a.gradientPercent)),La(e.gradientPercentField,`${qi(a.activeTerrain)} · ${Zi(a)}`),st(e.speedField,us(a.currentSpeedMps)),e.formStateField.innerHTML=_u(a);const x=[s?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,u,m,(r==null?void 0:r.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(f==null?void 0:f.rank)??"—",(f==null?void 0:f.gapSeconds)??"—",a.skillBreakdown].join("|");_a(e,"detailKey",x)&&(e.detailPanel.innerHTML=s?oo(a,r,f):"",e.detailPanel.classList.toggle("hidden",!s),Aa(e,"detailKey",x)),e.detailPanel.classList.toggle("hidden",!s),e.initialized=!0}function Gu(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${X(e.name)}">${X(e.name)}</button>`}function zu(e){const t=io(e.id);return`
    <span class="race-sim-team-visual" title="${X(e.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${X(t)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Ku(e,t,a){const r=new Map;for(const s of e.riders){const n=a.get(s.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=r.get(i)??[];o.push(s),r.set(i,o)}return t.teams.filter(s=>r.has(s.id)).map(s=>{const n=(r.get(s.id)??[]).slice().sort((p,u)=>u.effectiveSkill-p.effectiveSkill||p.riderId-u.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),d=n.slice(0,o).reduce((p,u)=>p+u.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:s,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,d-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(p=>p.isFinished).length}}).sort((s,n)=>ro(s.representative,n.representative,Qi(t))||s.team.id-n.team.id)}function Wu(e,t,a,r,s){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${X(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${X(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${X(ce(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${X(us(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${X(e.teamClockSeconds!=null?Dt(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${X(Vr(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&r>1?t.gcByRiderId.get(n.riderId)??null:null,d=s===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${no(n,d)}
                <strong>${X(ce(n.effectiveSkill))}</strong>
                <span>${X(n.riderClockSeconds!=null?Dt(n.riderClockSeconds):"—")}</span>
              </div>
              ${d?oo(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function ju(e,t,a){var f,g;const r=performance.now(),s=to(a),n=s.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(b=>({label:b.key,displayLabel:b.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(f=tt.get(e))==null?void 0:f.layoutKey,d=ao(e,i),l=tt.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==d&&(e.innerHTML="");const p=Ku(t,a,s.riderById),u=((g=p[0])==null?void 0:g.teamDistanceMeters)??0;return e.innerHTML=p.map((b,y)=>{const v=l.openTeamId===b.team.id;return`
      <article class="race-sim-row${y===0?" race-sim-row-leader":""}${v?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${y+1}.</strong>
          <span class="race-sim-row-name">${Gu(b.team,v)}</span>
          <span class="race-sim-row-team-visual">${zu(b.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${X(b.team.name)}">${X(b.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${X(Vi(Math.max(0,u-b.teamDistanceMeters)))}</strong>
          <strong>${X(b.teamClockSeconds!=null?Dt(b.teamClockSeconds):Ui(b.representative.startOffsetSeconds))}</strong>
          ${n.map(x=>`<strong>${X(b.splitTimes[x.key]!=null?Dt(b.splitTimes[x.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${Xi(b.representative)}">${X(ce(b.teamEffectiveSkill))}</strong>
          <strong>${X(us(b.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${v?"":" hidden"}">${v?Wu(b,s,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),tt.set(e,{layoutKey:d,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-r,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:p.length,rowsCreated:p.length,rowsRemoved:0,rowsUpdated:p.length,rowsSkippedInvisible:0,orderChanged:1}}function Fn(e,t,a){if(a.stage.profile==="TTT")return ju(e,t,a);const r=performance.now(),s={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=to(a),{splitMarkers:o}=i,d=Su(t),l=ms(e),p=l.showSplitColumns?o:[],u=tt.get(e);s.prepMs=performance.now()-n;const m=performance.now(),f=Iu(t.riders,a,o,d,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(u==null?void 0:u.orderedRiderIds)??[]);s.sortMs=performance.now()-m;const g=u==null?void 0:u.layoutKey,b=performance.now(),y=ao(e,eo(a,p,l.showSplitColumns));s.layoutMs=performance.now()-b;const v=tt.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};g!=null&&g!==y&&(e.innerHTML="",v.rowsByRiderId.clear(),v.orderedRiderIds=[]);const x=f.map(F=>F.riderId),M=new Set(x),T=performance.now();for(const[F,L]of v.rowsByRiderId)M.has(F)||(L.row.remove(),v.rowsByRiderId.delete(F),s.rowsRemoved+=1);s.removeRowsMs=performance.now()-T;const $=performance.now();for(let F=0;F<f.length;F+=1){const L=f[F],_=i.riderById.get(L.riderId)??null;let G=v.rowsByRiderId.get(L.riderId);G||(G=Bu(L,_,v.openDetailRiderId===L.riderId,p,i.teamById,i.teamAbbreviationById,i.teamNameById),v.rowsByRiderId.set(L.riderId,G),s.rowsCreated+=1)}s.createRowsMs=performance.now()-$;const w=performance.now(),C=v.orderedRiderIds.length===x.length&&v.orderedRiderIds.every((F,L)=>F===x[L]);s.orderCheckMs=performance.now()-w;const E=performance.now();if(!C){const F=document.createDocumentFragment();for(const L of x){const _=v.rowsByRiderId.get(L);_&&F.appendChild(_.row)}e.replaceChildren(F),s.orderChanged=1}s.reorderMs=performance.now()-E;for(let F=0;F<f.length;F+=1){const L=f[F],_=v.rowsByRiderId.get(L.riderId),G=i.riderById.get(L.riderId)??null;if(!_)continue;const K=performance.now();Hu(_,F+1,L,G,v.openDetailRiderId===L.riderId,p,a.stage.profile,d,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),s.updateRowsMs+=performance.now()-K,s.rowsUpdated+=1}return tt.set(e,{layoutKey:y,orderedRiderIds:x,rowsByRiderId:v.rowsByRiderId,openDetailRiderId:v.openDetailRiderId,openTeamId:v.openTeamId}),s.finalizeMs=performance.now()-(r+s.prepMs+s.sortMs+s.layoutMs+s.removeRowsMs+s.createRowsMs+s.orderCheckMs+s.reorderMs+s.visibilityMs+s.updateRowsMs),s.totalMs=performance.now()-r,s.finalizeMs=Math.max(0,s.totalMs-s.prepMs-s.sortMs-s.layoutMs-s.removeRowsMs-s.createRowsMs-s.orderCheckMs-s.reorderMs-s.visibilityMs-s.updateRowsMs),s}const Ou=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],Vu=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],lo=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],co=["Sprint","4","3","2","1","HC"],ar=.2,Uu=7,Yu=100,Zu=3,Ju=50,qu=-2,Xu=1,Qu=2.5,em=-3,tm=15,am=200,rm=600,sm=850;function Be(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function rr(e){return e==="finish_hill"||e==="finish_mountain"}function sr(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function fr(e,t){return e==="climb_top"||rr(e)&&sr(t)}function ka(e){return Math.round(e*10)/10}function He(e){return Number(e.toFixed(2))}function It(e){return`${e.toFixed(2).replace(".",",")} km`}function uo(e){return`${Math.round(e)} hm`}function nm(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function ps(e){return Ou.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function im(e){return Vu.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function om(e,t="start",a=0,r=1){const s=lo.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:Be(i)?a===r-1:i==="climb_top"||i==="sprint_intermediate");return(s.includes(e)?s:[e,...s.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${S(i)}</option>`).join("")}function lm(e){return['<option value="">–</option>',...co.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`)].join("")}function Pn(e){return lo.indexOf(e)}function Ve(e){return[...e].sort((t,a)=>Pn(t.type)-Pn(a.type))}function ba(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:Ve(e[0].markers)}];let a=0;return e.forEach(r=>{a=He(a+r.lengthKm);const s=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),n=t[t.length-1];n.terrain=r.terrain,n.techLevel=r.techLevel,n.windExp=r.windExp,n.markers=Ve([...n.markers,...r.markers]),t.push({kmMark:a,elevation:s,terrain:r.terrain,techLevel:r.techLevel,windExp:r.windExp,markers:Ve(r.endMarkers)})}),t}function dm(e){return e?" stage-editor-input-invalid":""}function gs(e,t){const a=e.segments[t];if(!a)return[];const r=[],s=cm(e).get(t)??[];return a.lengthKm<ar&&r.push(`Laenge unter ${ar.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&r.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&r.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&r.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>Be(n.type))&&r.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&r.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>Be(n.type))&&r.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{Be(n.type)&&r.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&r.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&r.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&r.push(`${n.type} gehoert in den Startmarker-Slot.`),fr(n.type,n.cat)&&!sr(n.cat)&&r.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&r.push("Sprintmarker erlaubt nur Kategorie Sprint."),Be(n.type)&&!rr(n.type)&&n.cat!=null&&r.push("finish_flat und finish_TT duerfen keine Kategorie haben."),rr(n.type)&&n.cat!=null&&!sr(n.cat)&&r.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),r.push(...s),[...new Set(r)]}function cm(e){const t=new Map,a=[],r=(s,n)=>{const i=t.get(s)??[];i.push(n),t.set(s,i)};return e.segments.forEach((s,n)=>{s.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),s.endMarkers.forEach(i=>{var l;if(!fr(i.type,i.cat))return;if(!i.name){r(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let p=a.length-1;p>=0;p-=1)if(((l=a[p])==null?void 0:l.name)===i.name){o=p;break}const d=o>=0?o:a.length-1;if(d<0){r(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(d,1)})}),a.forEach(s=>{const n=s.name?` "${s.name}"`:"";r(s.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function um(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:rr(e.type)?{...e,cat:sr(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function mo(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:mm(e.waypoints??[])).map(r=>({...r,startElevation:Math.round(r.startElevation),lengthKm:Number.isFinite(r.lengthKm)?He(r.lengthKm):ar,gradientPercent:Number.isFinite(r.gradientPercent)?ka(r.gradientPercent):0,techLevel:Number.isFinite(r.techLevel)?r.techLevel:5,windExp:Number.isFinite(r.windExp)?r.windExp:5,markers:Nn(r.markers),endMarkers:Nn(r.endMarkers)})),waypoints:[]};return xt(t),t}function mm(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const r=e[a],s=e[a+1],n=He(s.kmMark-r.kmMark),i=s.elevation-r.elevation,o=ka(n>0?i/(n*10):0);t.push({startElevation:r.elevation,lengthKm:n,gradientPercent:o,techLevel:r.techLevel??5,windExp:r.windExp??5,terrain:r.terrain??"Flat",markers:r.markers??[],endMarkers:s.markers??[]})}return t}function Nn(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function pm(e,t,a){const r=e*a*8+t/12;return r>=95?"HC":r>=68?"1":r>=46?"2":r>=28?"3":"4"}function Ln(e){const t=[];let a=null,r=null,s=0;const n=i=>{if(a==null||i==null||i<=a){a=null,r=null,s=0;return}const o=e[a],d=e[i],l=d.kmMark-o.kmMark,p=Math.max(0,d.elevation-o.elevation),u=l>0?p/(l*10):0;p>=Yu&&u>=Zu&&t.push({startKm:He(o.kmMark),endKm:He(d.kmMark),distanceKm:He(l),gainMeters:Math.round(p),avgGradient:ka(u),category:pm(l,p,u),startIndex:a,topIndex:i,topElevation:Math.round(d.elevation)}),a=null,r=null,s=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],d=e[i],l=d.elevation-o.elevation;if(a==null&&l>0){a=i-1,r=i,s=0;continue}if(a!=null){if(l>=0){(r==null||d.elevation>=e[r].elevation)&&(r=i),s=0;continue}s+=Math.abs(l),s>=Ju&&n(r)}}return n(r),t}function gm(e){const t=e.segments.some(s=>s.terrain==="Cobble_Hill"),a=e.segments.some(s=>s.terrain==="Cobble"),r=e.climbs.some(s=>s.category==="HC"||s.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":r&&e.elevationGainMeters>=2800?"High_Mountain":r||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function Ba(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function fm(e){return e.gainMeters>=rm&&e.topElevation>=sm?"Mountain":e.gainMeters>am?"Medium_Mountain":"Hill"}function hm(e){return e.gradientPercent<em?"Abfahrt":e.gradientPercent<Qu||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<tm?"Flat":"Hill"}function bm(e){if(e.segments.length===0)return;if(e.waypoints=ba(e.segments),e.sourceFormat==="csv"){const i=Ln(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:d,topElevation:l,...p})=>p);return}const t=e.segments.map(i=>i.manualTerrain||Ba(i.terrain)?i.terrain:hm(i)),a=Ln(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:d,...l})=>l),a.forEach(i=>{const o=fm(i);if(o)for(let d=i.startIndex;d<i.topIndex;d+=1)e.segments[d].manualTerrain||Ba(t[d])||(t[d]=o)});let r=null,s=0;const n=i=>{if(r==null||s<=Xu){r=null,s=0;return}for(let o=r;o<i;o+=1)!(e.segments[o].manualTerrain||Ba(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");r=null,s=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<qu){r==null&&(r=i),s+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{Ba(i.terrain)||(i.terrain=t[o])}),e.waypoints=ba(e.segments),e.suggestedProfile=gm(e)}function xt(e){ym(e),Dn(e),bm(e),e.waypoints=ba(e.segments),Dn(e)}function ym(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,r)=>{const s={...a,startElevation:Math.round(r===0?a.startElevation:t),lengthKm:He(a.lengthKm),gradientPercent:ka(a.gradientPercent),markers:Ve(a.markers),endMarkers:Ve(a.endMarkers)};return t=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),s}),e.waypoints=ba(e.segments)}function Dn(e){e.totalDistanceKm=He(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,r)=>{if(r===0)return 0;const s=a.elevation-e.waypoints[r-1].elevation;return t+Math.max(0,s)},0)}function pt(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(r=>r.type==="start")||(t.markers=Ve([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(r=>Be(r.type))||(a.endMarkers=Ve([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=ba(e.segments))}function vm(e,t,a,r){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((s,n)=>{const i=r==="start"&&t===0&&s.type==="start",o=e.filter(p=>Be(p.type)).length,d=r==="end"&&t===a-1&&Be(s.type)&&o===1,l=!(i||d);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${r}" data-marker-index="${n}">${om(s.type,r,t,a)}</select>
        <input type="text" value="${S(s.name??"")}" data-field="markerName" data-marker-scope="${r}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${r}" data-marker-index="${n}">${lm(s.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${r}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function _n(e,t,a,r){const s=r==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${vm(e,t,a,r)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${r}" data-segment-index="${t}">${s}</button>
    </div>`}function Sm(e,t,a,r,s){if(!c.stageEditorDraft)return;const n=c.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(r==="markerType"){o.type=s;const d=um(o);if(o.name=d.name,o.cat=d.cat,Be(o.type)){const l=i.filter((p,u)=>u===t||!Be(p.type));a==="start"?n.markers=l:n.endMarkers=l}}else r==="markerName"?o.name=s.trim()||null:r==="markerCat"&&(o.cat=s||null);a==="start"?n.markers=Ve(n.markers):n.endMarkers=Ve(n.endMarkers),xt(c.stageEditorDraft),pt(c.stageEditorDraft),me()}}function km(e,t){if(!c.stageEditorDraft)return;const a=c.stageEditorDraft.segments[e];if(!a)return;const r=t==="start"?e===0&&!a.markers.some(s=>s.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===c.stageEditorDraft.segments.length-1&&!a.endMarkers.some(s=>Be(s.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(r),a.markers=Ve(a.markers)):(a.endMarkers.push(r),a.endMarkers=Ve(a.endMarkers)),xt(c.stageEditorDraft),pt(c.stageEditorDraft),me()}function $m(e,t,a){if(!c.stageEditorDraft)return;const r=c.stageEditorDraft.segments[e];r&&(a==="start"?r.markers.splice(t,1):r.endMarkers.splice(t,1),xt(c.stageEditorDraft),pt(c.stageEditorDraft),me())}let Ot=0,Vt=0;async function xm(){h("stage-editor-profile").innerHTML=ps("Flat"),h("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',h("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([V.listStageEditorCountries(),V.listStageEditorRaceCategories(),V.listStageEditorRacePrograms()]);if(e.success&&e.data){const r=h("stage-editor-race-country");r.innerHTML=e.data.map(s=>`<option value="${s.id}">${S(s.name)} (${S(s.code3)})</option>`).join("")}if(t.success&&t.data){const r=h("stage-editor-race-category");r.innerHTML=t.data.map(s=>`<option value="${s.id}">${S(s.name)}</option>`).join("")}a.success&&a.data&&(c.stageEditorPrograms=a.data,Tm())}function Tm(){const e=h("stage-editor-programs-list");c.stageEditorPrograms&&(e.innerHTML=c.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${S(t.name)}</span>
      </label>
    `).join(""))}function wm(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=h("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(r=>{var n;const s=(n=c.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===r.value);return s?s.name:r.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function fs(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function po(){const e=c.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function Mm(){const e=[...c.stageEditorExistingStages.map(t=>t.raceId),...c.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function Rm(e,t){let a=e;const r=new Set(c.stageEditorExistingStages.map(s=>s.stageId));for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function Im(e,t){let a=e;const r=new Set([...c.stageEditorExistingStages.map(s=>s.raceId),...c.races.map(s=>s.id)]);for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function Cm(e){var o;const t=h("stage-editor-profile");t.innerHTML=ps(e.suggestedProfile),t.value=e.suggestedProfile;const a=po(),r=Mm();h("stage-editor-stage-id").value=String(a),h("stage-editor-race-id").value=String(r),Ot=a,Vt=r;const s=h("stage-editor-details-file");s.value.trim()||(s.value=`${nm(e.routeName)}.csv`);const n=h("stage-editor-date");!n.value&&((o=c.gameState)!=null&&o.currentDate)&&(n.value=c.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(d=>{d.checked=!0})}function Em(e){h("stage-editor-stage-id").value=String(e.stageId),h("stage-editor-race-id").value=String(e.raceId),Ot=e.stageId,Vt=e.raceId,h("stage-editor-stage-number").value=String(e.stageNumber),h("stage-editor-date").value=e.date,h("stage-editor-details-file").value=e.detailsCsvFile;const t=h("stage-editor-profile");t.innerHTML=ps(e.profile),t.value=e.profile,h("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),h("stage-editor-final-push-start").value=String(e.finalPushStartPercent),h("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),h("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),h("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(s=>s.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(s=>{s.checked=a.includes(s.value)})}function go(e){var r;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((r=e.segments[0])!=null&&r.markers.some(s=>s.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(s=>Be(s.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((s,n)=>{gs(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...s.markers??[],...s.endMarkers??[]].forEach(i=>{i.cat!=null&&!co.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function fo(){const e=[],t=Number(h("stage-editor-stage-id").value),a=Number(h("stage-editor-race-id").value),r=Number(h("stage-editor-stage-number").value),s=h("stage-editor-date").value.trim(),n=h("stage-editor-details-file").value.trim(),i=Number(h("stage-editor-final-spread-start").value),o=Number(h("stage-editor-final-push-start").value),d=Number(h("stage-editor-final-spread-difficulty").value),l=Number(h("stage-editor-crash-multiplier").value),p=Number(h("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(r)||r<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(s)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(d)||d<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(p)||p<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),c.stageEditorExistingStages.map(y=>y.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const f=h("stage-editor-new-race-checkbox").checked,g=[...c.stageEditorExistingStages.map(y=>y.raceId),...c.races.map(y=>y.id)];if(f){g.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const y=h("stage-editor-race-name").value.trim(),v=Number(h("stage-editor-race-country").value),x=Number(h("stage-editor-race-category").value),M=Number(h("stage-editor-race-num-stages").value),T=h("stage-editor-race-start-date").value.trim(),$=h("stage-editor-race-end-date").value.trim(),w=Number(h("stage-editor-race-prestige").value);y||e.push("Rennname fehlt."),(!Number.isInteger(v)||v<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger(x)||x<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(M)||M<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(T)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test($)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(w)||w<1||w>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else g.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return h("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function Fm(){var a,r;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(s=>s.value).join("|");return{stageId:Number(h("stage-editor-stage-id").value),raceId:Number(h("stage-editor-race-id").value),stageNumber:Number(h("stage-editor-stage-number").value),date:h("stage-editor-date").value.trim(),profile:h("stage-editor-profile").value,detailsCsvFile:h("stage-editor-details-file").value.trim(),startElevation:((r=(a=c.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:r.startElevation)??0,finalSpreadStartPercent:Number(h("stage-editor-final-spread-start").value),finalPushStartPercent:Number(h("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(h("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(h("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(h("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function Pm(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function Nm(e){return["gainMeters","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function hr(e,t,a){const s=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-s*118),i=54,o=.14+s*.12,d=.26+s*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${d};`}">${Math.round(e)}</span>`}function hs(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),r=Math.round(40-t*22),s=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${s};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function Lm(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function Dm(e,t,a,r){const s=r!=null?` data-stage-profile-open-climb-id="${S(r)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${s}>${e}</button>`}function _m(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",r=e.profileScore??e.score,s=[...c.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=s.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-climbs stage-editor-score-popover-grid-head">
        <span>Nr.</span>
        <span>Name</span>
        <span class="text-right">Score</span>
        <span class="text-right">Länge</span>
        <span class="text-right">Ø %</span>
      </div>
      ${s.map(i=>`
        <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-climbs">
          <span class="text-muted">${i.climbIndex}</span>
          <span>${S(i.name)}</span>
          <span class="text-right">${hs(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${hr(r,0,100)}
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
    </div>`}function Am(e){const t=s=>s!=null?`${s.toFixed(1).replace(".",",")} km`:"—",a=s=>s!=null?`${Math.round(s).toLocaleString("de-DE")} m`:"—",r=s=>s!=null?`${s.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${hs(e.climbScore??0)}
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
        <strong class="text-right">${r(e.avgGradient)}</strong>
      </div>
      <div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact">
        <span>Max Steigung</span>
        <strong class="text-right">${r(e.maxGradient)}</strong>
      </div>
    </div>`}function ho(e,t,a,r,s,n,i,o){const d=o??hr(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${Dm(d,r,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${s}
      </div>
    </div>`}function ue(e,t,a,r,s){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?r==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${s}-sort="${t}">
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function na(){const e=h("stage-editor-stages-table"),t=h("stage-editor-stages-empty"),a=h("stage-editor-stages-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=c.stageEditorStagesSort.key,i=c.stageEditorStagesSort.direction;r&&(r.innerHTML=`<tr>
      ${ue("ID","stageId",n,i,"stages")}
      ${ue("Land","countryCode",n,i,"stages")}
      ${ue("Rennen","raceName",n,i,"stages")}
      ${ue("Etappe","stageNumber",n,i,"stages")}
      ${ue("Score","profileScore",n,i,"stages")}
      ${ue("Profil","profile",n,i,"stages")}
      ${ue("Distanz","distanceKm",n,i,"stages")}
      ${ue("Höhenmeter","elevationGainMeters",n,i,"stages")}
      ${ue("Sprints","sprintCount",n,i,"stages")}
      ${ue("Climbs","climbCount",n,i,"stages")}
    </tr>`);const o=Hm(c.stageEditorStageRows);s.innerHTML=o.map(d=>`
    <tr>
      <td>${d.stageId}</td>
      <td>${de(d.countryCode||"")}</td>
      <td><strong>${S(d.raceName)}</strong></td>
      <td><strong>${S(xa({stageNumber:d.stageNumber}))}</strong></td>
      <td>${ho(d.profileScore,0,100,d.stageId,_m(d),Sr({name:d.raceName},{stageNumber:d.stageNumber,profile:d.profile}))}</td>
      <td>${Ta(d.profile)}</td>
      <td>${It(d.distanceKm)}</td>
      <td>${uo(d.elevationGainMeters)}</td>
      <td>${d.sprintCount} Sprints</td>
      <td>${d.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${c.stageEditorStageRows.length} vorhandene Etappen`}function ia(){const e=h("stage-editor-climbs-table"),t=h("stage-editor-climbs-empty"),a=h("stage-editor-climbs-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=c.stageEditorClimbsSort.key,i=c.stageEditorClimbsSort.direction;r&&(r.innerHTML=`<tr>
      ${ue("km","placementKm",n,i,"climbs")}
      ${ue("Name","name",n,i,"climbs")}
      ${ue("Kat.","category",n,i,"climbs")}
      ${ue("Score","climbScore",n,i,"climbs")}
      ${ue("Land","countryCode",n,i,"climbs")}
      ${ue("Rennen","raceName",n,i,"climbs")}
      ${ue("Etappe","stageNumber",n,i,"climbs")}
      ${ue("Höhenmeter","gainMeters",n,i,"climbs")}
      ${ue("Distanz","distanceKm",n,i,"climbs")}
      ${ue("Ø Steigung","avgGradient",n,i,"climbs")}
      ${ue("Max Steigung","maxGradient",n,i,"climbs")}
    </tr>`);const o=Gm(c.stageEditorClimbRows);s.innerHTML=o.map(d=>`
    <tr>
      <td>${d.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${S(d.name)}</strong></td>
      <td>${Lm(d.category)}</td>
      <td>${ho(d.climbScore,0,350,d.stageId,Am(d),Sr({name:d.raceName},{stageNumber:d.stageNumber,profile:"Mountain"}),d.id,hs(d.climbScore))}</td>
      <td>${de(d.countryCode||"")}</td>
      <td><strong>${S(d.raceName)}</strong></td>
      <td><strong>${S(xa({stageNumber:d.stageNumber}))}</strong></td>
      <td>${uo(d.gainMeters)}</td>
      <td>${It(d.distanceKm)}</td>
      <td>${d.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${d.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${c.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function bo(e=!1){if(c.stageEditorOverviewLoaded&&!e){na(),ia();return}c.stageEditorOverviewLoading=!0,na(),ia();const t=await V.getStageEditorOverview();if(c.stageEditorOverviewLoading=!1,c.stageEditorOverviewLoaded=!0,!t.success||!t.data){c.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),na(),ia();return}c.stageEditorStageRows=t.data.stages,c.stageEditorClimbRows=t.data.climbs,na(),ia()}async function Bm(e=!1){const t=h("stage-editor-existing-stage-wrap");if(c.stageEditorExistingStagesLoaded&&!e){Ur();return}t.classList.add("loading");const a=h("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const r=await V.listStageEditorStages();if(t.classList.remove("loading"),c.stageEditorExistingStagesLoaded=!0,!r.success||!r.data){c.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}c.stageEditorExistingStages=r.data.stages,Ur()}function Ur(){const e=h("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+c.stageEditorExistingStages.map(a=>{const r=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${S(a.raceName)} · Etappe ${a.stageNumber}${r}</option>`}).join("")}function Hm(e){const t=c.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(c.stageEditorStagesSort.key){case"stageId":s=a.stageId-r.stageId;break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"profile":s=a.profile.localeCompare(r.profile,"de");break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"elevationGainMeters":s=a.elevationGainMeters-r.elevationGainMeters;break;case"sprintCount":s=a.sprintCount-r.sprintCount;break;case"climbCount":s=a.climbCount-r.climbCount;break;case"profileScore":s=a.profileScore-r.profileScore;break}return s*t||a.stageId-r.stageId})}function Gm(e){const t=c.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(c.stageEditorClimbsSort.key){case"placementKm":s=a.placementKm-r.placementKm;break;case"name":s=a.name.localeCompare(r.name,"de");break;case"category":s=(a.category??"").localeCompare(r.category??"","de");break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"gainMeters":s=a.gainMeters-r.gainMeters;break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"avgGradient":s=a.avgGradient-r.avgGradient;break;case"maxGradient":s=a.maxGradient-r.maxGradient;break;case"climbScore":s=a.climbScore-r.climbScore;break}return s*t||a.placementKm-r.placementKm})}function zm(e){return e.map(t=>t.type).join(" | ")}function Km(e){const t=[],a=[];let r=0;return e.segments.forEach((s,n)=>{const i=r,o=He(i+s.lengthKm),d=fs(s);s.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:s.startElevation})}),s.endMarkers.forEach(l=>{if(fr(l.type,l.cat)&&l.name){let p=-1;for(let u=a.length-1;u>=0;u--)if(a[u].name===l.name){p=u;break}if(p>=0){const u=a[p];a.splice(p,1);const m=He(o-u.startKm),f=Math.max(0,d-u.startElevation),g=m>0?ka(f/(m*10)):0;t.push({name:l.name,startKm:u.startKm,endKm:o,distanceKm:m,gainMeters:f,avgGradient:g,category:l.cat||"4"})}}}),r=o}),t}function Wm(e){const t=[];let a=0;return e.segments.forEach(r=>{const s=He(a+r.lengthKm);r.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:s})}),a=s}),t}function jm(e){const t=new Set,a=[];let r=0;return e.segments.forEach((s,n)=>{const o=He(r+s.lengthKm);s.markers.forEach(d=>{d.type==="climb_start"&&d.name&&a.push({name:d.name,segmentIndex:n})}),a.length>0&&t.add(n),s.endMarkers.forEach(d=>{if(fr(d.type,d.cat)&&d.name){let l=-1;for(let p=a.length-1;p>=0;p--)if(a[p].name===d.name){l=p;break}l>=0&&a.splice(l,1)}}),r=o}),t}function Om(e,t,a){const r=e.segments[t];if(!r||a.has(t)||r.markers.length>0||r.endMarkers.length>0)return!1;const s=r.terrain==="Flat"&&r.gradientPercent>=-3&&r.gradientPercent<=1.5,n=r.terrain==="Abfahrt"&&r.gradientPercent<=-3;return s||n}function me(){Ur();const e=c.stageEditorDraft,t=h("stage-editor-import-summary"),a=h("stage-editor-warnings"),r=h("stage-editor-climbs"),s=h("stage-editor-empty"),n=h("stage-editor-chart"),i=h("stage-editor-waypoints-body"),o=h("stage-editor-export-hint"),d=h("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",r.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',s.classList.remove("hidden"),n.innerHTML=An(null),i.innerHTML=`<tr><td colspan="${Uu}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",d.disabled=!0;return}s.classList.add("hidden");const l=go(e),p=fo(),u=document.getElementById("stage-editor-profile"),m=u&&u.value?u.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${S(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${It(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${S(m)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const f=[...e.warnings,...l,...p];a.innerHTML=f.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':f.map(M=>`<div class="stage-editor-alert">${S(M)}</div>`).join("");const g=Km(e),b=Wm(e);let y="";g.length>0?y+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (${g.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${g.map(M=>`
          <div class="stage-editor-climb" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="color: #fff; font-size: 0.85rem;">${S(M.name)}</strong>
              <span class="stage-editor-climb-category-badge ${M.category==="HC"?"is-hc":`is-cat-${M.category}`}" style="font-size: 0.7rem; padding: 0.1rem 0.35rem;">
                Kat. ${S(M.category)}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-300); display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span>${It(M.startKm)} - ${It(M.endKm)}</span>
              <span>·</span>
              <span><strong>${M.distanceKm.toFixed(1).replace(".",",")} km</strong></span>
              <span>·</span>
              <span><strong>${M.gainMeters} hm</strong></span>
              <span>·</span>
              <span><strong>${M.avgGradient.toFixed(1).replace(".",",")}%</strong></span>
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
        ${b.map(M=>`
          <div class="stage-editor-sprint" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--success); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.85rem;">${S(M.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-300); font-weight: bold;">
              ${It(M.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:y+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `;const v=h("stage-editor-hide-boring-segments-checkbox");v&&(v.checked=c.stageEditorHideBoringSegments),r.innerHTML=y,n.innerHTML=An(e);const x=jm(e);i.innerHTML=e.segments.map((M,T)=>{const $=c.stageEditorHideBoringSegments&&Om(e,T,x);return`
    <tr data-segment-index="${T}" class="${gs(e,T).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;${$?" display: none;":""}">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${T+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${M.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${dm(M.lengthKm<ar)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${M.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${im(M.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${_n(M.markers,T,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${_n(M.endMarkers,T,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div class="text-muted" style="min-width:3.5rem;">${fs(M)} m</div>
          ${Vm(e,T)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${T}">+</button>
          ${T===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${T}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${T}">✕</button>`:""}
        </div>
      </td>
    </tr>`}).join(""),d.disabled=f.length>0,o.textContent=f.length>0?`${f.length} Validierungshinweise vor dem Export.`:`Exportiert ${h("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function Vm(e,t){const a=gs(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(r=>`<div>${S(r)}</div>`).join("")}</div>`}function An(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,r=24,s=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(g=>g.elevation)),d=Math.max(...n.map(g=>g.elevation)),l=Math.max(1,d-o),p=n.map(g=>{const b=r+g.kmMark/Math.max(i,.1)*(t-r*2),y=a-s-(g.elevation-o)/l*(a-s*2);return{x:b,y,waypoint:g}}),u=p.map((g,b)=>`${b===0?"M":"L"} ${g.x.toFixed(1)} ${g.y.toFixed(1)}`).join(" "),m=`${u} L ${(t-r).toFixed(1)} ${(a-s).toFixed(1)} L ${r.toFixed(1)} ${(a-s).toFixed(1)} Z`,f=p.filter(g=>g.waypoint.markers.length>0).map(g=>`
      <line x1="${g.x.toFixed(1)}" y1="${s}" x2="${g.x.toFixed(1)}" y2="${(a-s).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${g.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${S(zm(g.waypoint.markers))}</text>`).join("");return`
    <svg viewBox="0 0 ${t} ${a}" role="img" aria-label="Stage-Profil ${S(e.routeName)}">
      <defs>
        <linearGradient id="stage-editor-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(96, 165, 250, 0.38)"></stop>
          <stop offset="100%" stop-color="rgba(14, 165, 233, 0.04)"></stop>
        </linearGradient>
      </defs>
      <line x1="${r}" y1="${a-s}" x2="${t-r}" y2="${a-s}" class="stage-editor-chart-axis" />
      <line x1="${r}" y1="${s}" x2="${r}" y2="${a-s}" class="stage-editor-chart-axis" />
      ${f}
      <path d="${m}" fill="url(#stage-editor-area)"></path>
      <path d="${u}" class="stage-editor-chart-line"></path>
      ${p.map(g=>`<circle cx="${g.x.toFixed(1)}" cy="${g.y.toFixed(1)}" r="3.5" class="stage-editor-chart-point"></circle>`).join("")}
      <text x="${r}" y="${s-4}" class="stage-editor-chart-scale">${Math.round(d)} m</text>
      <text x="${r}" y="${a-4}" class="stage-editor-chart-scale">${Math.round(o)} m</text>
      <text x="${t-r}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${It(i)}</text>
    </svg>`}function Um(e,t,a){const r=c.stageEditorDraft;if(!r)return;const s=r.segments[e];s&&(t==="startElevation"?s.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?s.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?s.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(s.terrain=a,s.manualTerrain=!0):t==="techLevel"?s.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(s.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),xt(r),pt(r),me())}function Ym(e){const t=c.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const r={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,r),xt(t),pt(t),me()}function Zm(){const e=c.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],r={startElevation:t?fs(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(r),xt(e),pt(e),me()}function Jm(e){const t=c.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),xt(t),pt(t),me()))}async function qm(){var a;const t=(a=h("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}h("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,Re("Route wird importiert……");try{const r=await t.text(),s=await V.importStageRoute({fileName:t.name,fileContent:r});if(!s.success||!s.data){alert(`Import fehlgeschlagen: ${s.error??"Unbekannter Fehler"}`);return}const n=mo(s.data);c.stageEditorDraft=n,pt(n),Cm(n),me(),At("stage-editor")}finally{ke()}}async function Xm(){const e=Number(h("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}Re("CSV-Stage wird geladen...");try{const t=await V.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=mo(t.data.draft);c.stageEditorDraft=a,pt(a),Em(t.data.metadata),me(),At("stage-editor")}finally{ke()}}async function Qm(){if(!c.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...go(c.stageEditorDraft),...fo()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),me();return}const t=h("stage-editor-new-race-checkbox").checked,a=h("stage-editor-program-checkbox").checked;let r;t&&(r={name:h("stage-editor-race-name").value.trim(),countryId:Number(h("stage-editor-race-country").value),categoryId:Number(h("stage-editor-race-category").value),isStageRace:Number(h("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(h("stage-editor-race-num-stages").value),startDate:h("stage-editor-race-start-date").value.trim(),endDate:h("stage-editor-race-end-date").value.trim(),prestige:Number(h("stage-editor-race-prestige").value)});let s;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');s=Array.from(n).map(i=>Number(i.value))}Re("CSV-Dateien werden erstellt……");try{const n=await V.exportStageRoute({metadata:Fm(),draft:c.stageEditorDraft,newRace:t,raceDetails:r,updatePrograms:a,programIds:s});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}jr(n.data.stagesFileName,n.data.stagesCsv),jr(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=h("stage-editor-stage-number"),o=Number(i.value)||1;i.value=String(o+1);const d=h("stage-editor-date"),l=d.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(l)){const y=new Date(l);y.setDate(y.getDate()+1);const v=y.getFullYear(),x=String(y.getMonth()+1).padStart(2,"0"),M=String(y.getDate()).padStart(2,"0");d.value=`${v}-${x}-${M}`}await Promise.all([bo(!0),Bm(!0)]);const p=po();h("stage-editor-stage-id").value=String(p),Ot=p;const u=h("stage-editor-new-race-checkbox");u&&(u.checked=!1);const m=h("stage-editor-new-race-details");m&&(m.classList.add("hidden"),m.style.display="none");const f=h("stage-editor-program-checkbox");f&&(f.checked=!1);const g=h("stage-editor-program-details");g&&(g.classList.add("hidden"),g.style.display="none"),Vt=Number(h("stage-editor-race-id").value),me()}finally{ke()}}function ep(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",$=>{const w=$.target.closest("button[data-stage-profile-open-stage-id]");if(w){const F=Number(w.dataset.stageProfileOpenStageId);Number.isFinite(F)&&lr(F);return}const C=$.target.closest("button[data-stage-editor-stages-sort]");if(!C)return;const E=C.dataset.stageEditorStagesSort;c.stageEditorStagesSort.key===E?c.stageEditorStagesSort.direction=c.stageEditorStagesSort.direction==="asc"?"desc":"asc":c.stageEditorStagesSort={key:E,direction:Pm(E)},na()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",$=>{const w=$.target.closest("button[data-stage-profile-open-stage-id]");if(w){const F=Number(w.dataset.stageProfileOpenStageId),L=w.dataset.stageProfileOpenClimbId??null;if(Number.isFinite(F)){let _=null;L&&c.stageEditorClimbRows&&(_=c.stageEditorClimbRows.find(G=>G.id===L)??null),lr(F,_)}return}const C=$.target.closest("button[data-stage-editor-climbs-sort]");if(!C)return;const E=C.dataset.stageEditorClimbsSort;c.stageEditorClimbsSort.key===E?c.stageEditorClimbsSort.direction=c.stageEditorClimbsSort.direction==="asc"?"desc":"asc":c.stageEditorClimbsSort={key:E,direction:Nm(E)},ia()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{qm()});const r=document.getElementById("btn-stage-editor-load-existing");r&&r.addEventListener("click",()=>{Xm()});const s=document.getElementById("btn-stage-editor-export");s&&s.addEventListener("click",()=>{Qm()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",$=>{var C;const w=((C=$.target.files)==null?void 0:C[0])??null;h("stage-editor-file-hint").textContent=w?`${w.name} · ${(w.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",$=>{const w=$.target,C=w.closest("tr[data-segment-index]"),E=w.dataset.field;if(!C||!E)return;const F=Number(C.dataset.segmentIndex);if(Number.isInteger(F)){if(E==="markerType"||E==="markerName"||E==="markerCat"){const L=Number(w.dataset.markerIndex),_=w.dataset.markerScope;if(!Number.isInteger(L)||_!=="start"&&_!=="end")return;Sm(F,L,_,E,w.value);return}Um(F,E,w.value)}}),i.addEventListener("click",$=>{const w=$.target.closest("button[data-segment-action]");if(!w)return;const C=Number(w.dataset.segmentIndex);if(Number.isInteger(C)){if(w.dataset.segmentAction==="insert"){Ym(C);return}if(w.dataset.segmentAction==="append"){Zm();return}if(w.dataset.segmentAction==="add-marker"){const E=w.dataset.markerScope;if(E!=="start"&&E!=="end")return;km(C,E);return}if(w.dataset.segmentAction==="remove-marker"){const E=Number(w.dataset.markerIndex),F=w.dataset.markerScope;if(!Number.isInteger(E)||F!=="start"&&F!=="end")return;$m(C,E,F);return}w.dataset.segmentAction==="delete"&&Jm(C)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach($=>{const w=document.getElementById($);w&&w.addEventListener("change",()=>me())}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach($=>{$.addEventListener("change",()=>me())});const d=h("stage-editor-new-race-checkbox"),l=h("stage-editor-new-race-details"),p=h("stage-editor-program-checkbox"),u=h("stage-editor-program-details");d&&d.addEventListener("change",()=>{d.checked?(l&&(l.classList.remove("hidden"),l.style.display="grid"),p&&(p.checked=!0,u&&(u.classList.remove("hidden"),u.style.display="block"))):l&&(l.classList.add("hidden"),l.style.display="none"),me()}),p&&p.addEventListener("change",()=>{p.checked?u&&(u.classList.remove("hidden"),u.style.display="block"):u&&(u.classList.add("hidden"),u.style.display="none"),me()});const m=h("stage-editor-programs-dropdown-trigger"),f=h("stage-editor-programs-dropdown-menu"),g=h("btn-stage-editor-programs-ok");m&&f&&(m.addEventListener("click",$=>{$.stopPropagation();const w=f.style.display==="none"||!f.style.display;f.style.display=w?"flex":"none"}),g&&g.addEventListener("click",$=>{$.stopPropagation(),f.style.display="none",me()}),document.addEventListener("click",$=>{const w=$.target;f.style.display==="flex"&&!f.contains(w)&&w!==m&&!m.contains(w)&&(f.style.display="none",me())}));const b=h("stage-editor-programs-list");b&&b.addEventListener("change",$=>{$.target.name==="stage-editor-program-selection"&&wm()});let y=!1,v=null;const x=h("stage-editor-stage-id"),M=h("stage-editor-race-id");if(x&&M){[x,M].forEach(w=>{w.addEventListener("keydown",C=>{C.key!=="ArrowUp"&&C.key!=="ArrowDown"&&(y=!0,v&&clearTimeout(v))}),w.addEventListener("keyup",C=>{C.key!=="ArrowUp"&&C.key!=="ArrowDown"&&(v&&clearTimeout(v),v=setTimeout(()=>{y=!1},150))}),w.addEventListener("blur",()=>{y=!1})});const $=(w,C)=>{const E=Number(w.value);if(!Number.isInteger(E)||E<=0){C==="stage"?Ot=E:Vt=E;return}const L=E-(C==="stage"?Ot:Vt);if(!y&&(L===1||L===-1)){let _=E;C==="stage"?_=Rm(E,L):h("stage-editor-new-race-checkbox").checked&&(_=Im(E,L)),w.value=String(_)}C==="stage"?Ot=Number(w.value):Vt=Number(w.value)};x.addEventListener("input",()=>{$(x,"stage"),me()}),M.addEventListener("input",()=>{$(M,"race"),me()})}const T=h("stage-editor-hide-boring-segments-checkbox");T&&T.addEventListener("change",()=>{c.stageEditorHideBoringSegments=T.checked,me()})}let dt=[],Wt=null,De={form:!0,combinedFatigue:!0,shortFatigue:!1,longFatigue:!1};const Gt=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"];function bs(e,t){if(e==null)return"";const a=t?S(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const ae={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function nr(e,t,a){const r=ut(e??null);return`<span class="badge badge-race-category" style="${ur(r)}; white-space: nowrap; display: inline-block;">${S(e??"Unbekannt")}</span>`}function ys(e){if(!e)return"-";const t=ut(e);return`<span class="badge badge-race-category" style="${ur(t)}; white-space: nowrap; display: inline-block;">${S(e)}</span>`}function tp(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function ap(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${tp(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function yo(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";case"breakaway_final":return"is-breakaway";default:return""}}function vs(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";case"breakaway_final":return"Ausreißer";default:return"Etappe"}}function rp(e){return`<span class="rider-stats-final-type ${yo(e)}">${S(vs(e))}</span>`}function le(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?r+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?r+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?r+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?r+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?r+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(r+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function we(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?r+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?r+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?r+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?r+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?r+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?r+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(r+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function sp(e){return`${e.startDate===e.endDate?ie(e.startDate):`${ie(e.startDate)} - ${ie(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function ir(e){if(e==null||c.riders.length===0)return null;const a=[...c.riders].sort((r,s)=>(s.seasonPoints??0)-(r.seasonPoints??0)||(s.seasonWins??0)-(r.seasonWins??0)||s.overallRating-r.overallRating||`${r.lastName} ${r.firstName}`.localeCompare(`${s.lastName} ${s.firstName}`,"de")||r.id-s.id).findIndex(r=>r.id===e);return a>=0?a+1:null}function Bn(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;case"breakaway_final":return 4;default:return 5}}function np(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||Bn(t.rowType)-Bn(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function ip(e){return[...e].map(t=>({...t,rows:np(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function vo(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(50,Math.min(85,e));for(let d=1;d<t.length;d++){const l=t[d-1],p=t[d];if(s<=p.score){const u=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*u),r=Math.round(l.lightness+(p.lightness-l.lightness)*u);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function ft(e,t,a,r){const s=r>0?Math.max(0,Math.min(1,a/r)):.5,n=Math.round(6+s*118),i=.26+s*.18,o=.14+s*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${S(t)}">${e} ${a}</span>`}function Pr(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function Nr(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return ae.mountain;case"Hill":return ae.hilly;case"Sprint":return ae.sprint;case"Timetrial":return ae.timetrial;case"Cobble":return ae.cobble;case"Attacker":return ae.attacker;default:return""}}function Ye(e,t,a,r,s){var ee,Y,j;const n=(t==null?void 0:t.countryCode)??r??null,i=n?de(n):s,o=(t==null?void 0:t.roleName)??((ee=e==null?void 0:e.role)==null?void 0:ee.name)??"Ohne Rolle",d=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,p=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",u=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",m=((Y=t==null?void 0:t.program)==null?void 0:Y.name)??((j=e==null?void 0:e.seasonProgram)==null?void 0:j.name)??"-",f=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,g=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,b=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,y=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,v=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,x=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,M=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",T=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,$=(t==null?void 0:t.currentSeasonRank)??ir((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),w=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,C=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,E=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,F=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},L=Math.max(F.flat,F.hilly,F.mediumMountain,F.mountain,F.timetrial,F.cobble),_=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},G=Math.max(_.stageRace,_.oneDay),K=e!=null&&e.specialization1?Pr(e.specialization1):"-",R=e!=null&&e.specialization2?Pr(e.specialization2):"-",B=e!=null&&e.specialization3?Pr(e.specialization3):"-",U=Nr((e==null?void 0:e.specialization1)??null),W=Nr((e==null?void 0:e.specialization2)??null),se=Nr((e==null?void 0:e.specialization3)??null);let q="";return t!=null&&t.lieutenantInfo?q=`
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.lieutenantInfo.name)}</a></span></span>
    `:t!=null&&t.leaderInfo&&(q=`
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.leaderInfo.name)}</a></span></span>
    `),`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${S(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?Nt(l,p):""} <span>${S(p)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${S(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${vi(u)} <span>Form</span></span>
        ${q}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${vo(d)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${ae.seasonForm} ${f>=0?"+":""}${f}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${ae.raceForm} ${g>=0?"+":""}${g}</span>
        <span class="rider-stats-icon-pill" title="Programm">${S(m)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${ae.raceDays} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${y>14?"text-warning":""}" title="30-Tage Renntage">${ae.rollingRaceDays} <span class="rider-stats-icon-pill-value">${y}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${ae.longFatigue} <span class="rider-stats-icon-pill-value">${v}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${M!=="none"?"text-error":""}" title="Kurzzeitfatigue">${ae.shortFatigue} <span class="rider-stats-icon-pill-value">${x}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${ae.seasonPoints} <span class="rider-stats-icon-pill-value">${T}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${ae.rank} <span class="rider-stats-icon-pill-value">${ap($)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${ae.raceDays} <span class="rider-stats-icon-pill-value">${w}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${ae.wins} <span class="rider-stats-icon-pill-value">${C}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${U} ${S(K)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${W} ${S(R)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${se} ${S(B)}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${ft(ae.stageRace,"Rundfahrten Punkte",_.stageRace,G)}
        ${ft(ae.oneDay,"Eintagesrennen Punkte",_.oneDay,G)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${ae.breakaway} <span class="rider-stats-icon-pill-value">${E}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${ft(ae.flat,"Flach-Punkte",F.flat,L)}
        ${ft(ae.hilly,"Hügel-Punkte",F.hilly,L)}
        ${ft(ae.mediumMountain,"Mittelgebirge-Punkte",F.mediumMountain,L)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${ft(ae.mountain,"Hochgebirge-Punkte",F.mountain,L)}
        ${ft(ae.timetrial,"Zeitfahren-Punkte",F.timetrial,L)}
        ${ft(ae.cobble,"Kopfsteinpflaster-Punkte",F.cobble,L)}
      </div>
    </div>
  `}function Hn(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",r=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${S(a)} <strong>${S(r)}</strong>`}function Ze(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${c.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${c.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${c.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${c.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${c.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${c.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${c.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
    </div>`}function op(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(55,Math.min(80,e));for(let d=1;d<t.length;d++){const l=t[d-1],p=t[d];if(s<=p.score){const u=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*u),r=Math.round(l.lightness+(p.lightness-l.lightness)*u);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function lp(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},r=["mountain","hill","sprint","timeTrial","cobble","attack"],s=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,d=i/2,l=160,p=60,u=85,m=u-p,f=_=>{const G=[];for(let K=0;K<6;K++){const R=K*Math.PI/3-Math.PI/2;G.push(`${o+_*Math.cos(R)},${d+_*Math.sin(R)}`)}return G},g=`
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
    </defs>`,b=`<circle cx="${o}" cy="${d}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let y="";for(let _=p;_<=u;_+=2.5){const G=l*((_-p)/m);if(G<1){y+=`<circle cx="${o}" cy="${d}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const K=f(G),R=_%5===0,B=R?1:.6,U=R?"none":"4,4",W=R?.4:.18;y+=`<polygon points="${K.join(" ")}" fill="none" stroke="rgba(255,255,255,${W})" stroke-width="${B}" stroke-dasharray="${U}" />`,R&&_>p&&(y+=`<text x="${o+5}" y="${d-G+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${_}</text>`)}let v="",x="";for(let _=0;_<6;_++){const G=_*Math.PI/3-Math.PI/2,K=o+l*Math.cos(G),R=d+l*Math.sin(G);v+=`<line x1="${o}" y1="${d}" x2="${K}" y2="${R}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const B=l+28,U=o+B*Math.cos(G),W=d+B*Math.sin(G),se=Math.cos(G);let q="middle";se>.15?q="start":se<-.15&&(q="end");const ee=a[r[_]]??p;x+=`<text x="${U}" y="${W}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${q}" dominant-baseline="middle">${s[_]}</text>`,x+=`<text x="${U}" y="${W+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${q}" dominant-baseline="middle">${ee}</text>`}const M=[],T=[];r.forEach((_,G)=>{const K=a[_]??p,R=l*((Math.max(p,Math.min(u,K))-p)/m),B=G*Math.PI/3-Math.PI/2,U=o+R*Math.cos(B),W=d+R*Math.sin(B);M.push(`${U},${W}`),T.push(`<circle cx="${U}" cy="${W}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${s[G]}: ${K}</title></circle>`)});const $=`<polygon points="${M.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,C=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((_,G)=>{const K=a[_.key]??60;return(a[G.key]??60)-K}),E=[],F=[];C.forEach((_,G)=>{const K=a[_.key]??60,R=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${_.label}</span>
        ${op(K)}
      </div>
    `;G%2===0?E.push(R):F.push(R)});const L=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${E.join("")}</div>
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
            ${T.join("")}
            ${x}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${L}
        </div>
      </div>
    </section>
  `}function dp(e,t){const a=t.shortTermFatigueMalus??0,r=t.longTermFatigueDecayable??0,s=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),d=(r/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const p=t.fatigueHistory??[];let u="";return p.length===0?u='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':u=p.map(m=>{const f=ie(m.date);let g="";m.type==="race"?g=`${S(m.raceName)}${m.stageNumber!=null?` - Etappe ${m.stageNumber}`:""}`:g=m.raceName?S(m.raceName):"Regeneration";const b=m.type==="race"&&m.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${m.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let y="";m.shortChange>0?y=`<span style="color: #ef4444; font-weight: 600;">+${m.shortChange.toFixed(2).replace(".",",")}</span>`:m.shortChange<0?y=`<span style="color: #2ecc71; font-weight: 600;">${m.shortChange.toFixed(2).replace(".",",")}</span>`:y='<span style="color: #666;">0,00</span>';const v=[];if(m.longDecayableChange!==0){const T=m.longDecayableChange>0?"+":"",$=m.longDecayableChange>0?"#ef4444":"#2ecc71";v.push(`<span style="color: ${$}; font-weight: 500;">${T}${m.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(m.longLockedChange!==0){const T=m.longLockedChange>0?"+":"",$=m.longLockedChange>0?"#a855f7":"#2ecc71";v.push(`<span style="color: ${$}; font-weight: 500;">${T}${m.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const x=v.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${v.join("")}</div>`:'<span style="color: #666;">0,00</span>',M=m.shortAfter+m.longAfter;return`
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
              ${x}
              <span style="font-size: 0.85rem; color: #888;">(${m.longAfter.toFixed(2).replace(".",",")})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <strong style="color: #ef4444; font-size: 0.95rem;">-${M.toFixed(2).replace(".",",")}</strong>
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
                ${ae.shortFatigue}
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
                ${ae.longFatigue}
              </span>
              <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: #fff;">Langzeit (Abbaubar)</h4>
            </div>
            <p style="margin: 0 0 1rem 0; font-size: 0.8rem; color: #999; line-height: 1.4;">
              Steigt durch Rennbelastungen proportional zum Stage Score. Regeneriert langsam um 0,01 pro tageswechsel.
            </p>
          </div>
          <div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #ef4444; margin-bottom: 0.25rem;">
              -${r.toFixed(2).replace(".",",")} <span style="font-size: 0.85rem; font-weight: 400; color: #888;">Abzug</span>
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
              -${s.toFixed(2).replace(".",",")} <span style="font-size: 0.85rem; font-weight: 400; color: #888;">Abzug</span>
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
  `}function cp(e){var j;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((D,A)=>A%2===0),r=((j=c.gameState)==null?void 0:j.currentDate)??new Date().toISOString(),s=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(r).getUTCFullYear(),n=new Date(Date.UTC(s,0,1)).getTime(),i=864e5,o=1260,d=384,l=40,p=20,u=a.map(D=>{const P=(new Date(D.date).getTime()-n)/i,O=l+P/365*o,z=p+d-Math.min(8,Math.max(0,D.totalForm))/8*d;return{x:O,y:z,form:D.totalForm,date:D.date}});let m="",f="",g="";De.form&&u.length>0&&(m=`M ${u.map(D=>`${D.x},${D.y}`).join(" L ")}`,f=u.map(D=>`<circle cx="${D.x}" cy="${D.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${D.date}): ${D.form}</title></circle>`).join(""),g=`${m} L ${u[u.length-1].x},${p+d} L ${u[0].x},${p+d} Z`);let b="",y="";if(De.combinedFatigue&&u.length>0){const D=a.map(P=>{const z=(new Date(P.date).getTime()-n)/i,k=l+z/365*o,I=P.combinedFatigue??0,N=p+d-Math.min(15,Math.max(0,I))/15*d;return{x:k,y:N,val:I,date:P.date}});b=`<path d="${`M ${D.map(P=>`${P.x},${P.y}`).join(" L ")}`}" fill="none" stroke="#ef4444" stroke-width="2" />`,y=D.map(P=>`<circle cx="${P.x}" cy="${P.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${P.date}): ${P.val.toFixed(2)}</title></circle>`).join("")}let v="",x="";if(De.shortFatigue&&u.length>0){const D=a.map(P=>{const z=(new Date(P.date).getTime()-n)/i,k=l+z/365*o,I=P.shortFatigue??0,N=p+d-Math.min(15,Math.max(0,I))/15*d;return{x:k,y:N,val:I,date:P.date}});v=`<path d="${`M ${D.map(P=>`${P.x},${P.y}`).join(" L ")}`}" fill="none" stroke="#facc15" stroke-width="2" />`,x=D.map(P=>`<circle cx="${P.x}" cy="${P.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${P.date}): ${P.val.toFixed(2)}</title></circle>`).join("")}let M="",T="";if(De.longFatigue&&u.length>0){const D=a.map(P=>{const z=(new Date(P.date).getTime()-n)/i,k=l+z/365*o,I=P.longFatigue??0,N=p+d-Math.min(15,Math.max(0,I))/15*d;return{x:k,y:N,val:I,date:P.date}});M=`<path d="${`M ${D.map(P=>`${P.x},${P.y}`).join(" L ")}`}" fill="none" stroke="#a855f7" stroke-width="2" />`,T=D.map(P=>`<circle cx="${P.x}" cy="${P.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${P.date}): ${P.val.toFixed(2)}</title></circle>`).join("")}const $="rgba(251, 191, 36, 0.15)";let w="";for(let D=0;D<=8;D+=2){const A=p+d-D/8*d;w+=`<line x1="${l}" y1="${A}" x2="${l+o}" y2="${A}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,w+=`<text x="${l-5}" y="${A+4}" fill="#ffffff" font-size="10" text-anchor="end">${D}</text>`}for(let D=0;D<=15;D+=3){const A=p+d-D/15*d;w+=`<text x="${l+o+5}" y="${A+4}" fill="#ef4444" font-size="10" text-anchor="start">${D}</text>`}let C="";for(let D=0;D<=52;D+=5){const A=l+D/52*o;w+=`<line x1="${A}" y1="${p}" x2="${A}" y2="${p+d}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,C+=`<text x="${A}" y="${p+d+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${D}</text>`}let E="",F="";if(e.peakDates){const D=[...e.peakDates].sort((A,P)=>new Date(A).getTime()-new Date(P).getTime());for(let A=0;A<D.length;A++){const P=D[A],z=(new Date(P).getTime()-n)/i,k=l+z/365*o;E+=`<line x1="${k}" y1="${p}" x2="${k}" y2="${p+d}" stroke="#ffffff" stroke-width="2"><title>Peak: ${P}</title></line>`;const I=A>0?(new Date(D[A-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,N=z-56,H=I+14,Z=Math.max(0,Math.max(N,H)),ne=z-Z,fe=l+Z/365*o,pe=ne/365*o;F+=`<rect x="${fe}" y="${p}" width="${pe}" height="${d}" fill="rgba(16, 185, 129, 0.1)" />`;const $e=14/365*o;F+=`<rect x="${k}" y="${p}" width="${$e}" height="${d}" fill="rgba(239, 68, 68, 0.1)" />`}}const _=(new Date(r).getTime()-n)/i,G=l+_/365*o;E+=`<line x1="${G}" y1="${p}" x2="${G}" y2="${p+d}" stroke="#ef4444" stroke-width="3"><title>Heute: ${r}</title></line>`,dt.forEach((D,A)=>{const P=Gt[A%Gt.length];D.peakDates&&D.peakDates.forEach(O=>{const k=(new Date(O).getTime()-n)/i,I=l+k/365*o;E+=`<line x1="${I}" y1="${p}" x2="${I}" y2="${p+d}" stroke="${P}" stroke-width="1.5" stroke-dasharray="3,3"><title>${D.riderName} Peak: ${O}</title></line>`})});let K="",R="";dt.forEach((D,A)=>{const P=Gt[A%Gt.length],O=D.formHistory.filter((z,k)=>k%2===0).map(z=>{const I=(new Date(z.date).getTime()-n)/i,N=l+I/365*o,H=p+d-Math.min(8,Math.max(0,z.totalForm))/8*d;return{x:N,y:H,form:z.totalForm,date:z.date}});if(O.length>0){const z=`M ${O.map(k=>`${k.x},${k.y}`).join(" L ")}`;K+=`<path d="${z}" fill="none" stroke="${P}" stroke-width="2" />`,R+=O.map(k=>`<circle cx="${k.x}" cy="${k.y}" r="3" fill="#fff" stroke="${P}" stroke-width="2"><title>${D.riderName} (${k.date}): ${k.form}</title></circle>`).join("")}});const B=c.teams.filter(D=>D.division==="WorldTour"||D.divisionName==="WorldTour");let U='<option value="">-- Team auswählen --</option>';for(const D of B){const A=Wt===D.id?" selected":"";U+=`<option value="${D.id}"${A}>${S(D.name)}</option>`}let W='<option value="">-- Fahrer auswählen --</option>';if(Wt!=null){const D=c.riders.filter(A=>A.activeTeamId===Wt&&A.id!==e.riderId&&!dt.some(P=>P.riderId===A.id));for(const A of D)W+=`<option value="${A.id}">${S(A.firstName)} ${S(A.lastName)}</option>`}const se=`
    <div class="rider-compare-controls" style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-primary);">
      <span style="font-weight: 600; color: var(--text-100); font-size: 0.95rem;">Mit anderem Fahrer vergleichen:</span>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-team-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Team (Tier 1):</label>
        <select id="rider-compare-team-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);">
          ${U}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-rider-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Fahrer:</label>
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${Wt==null?"disabled":""}>
          ${W}
        </select>
      </div>
    </div>
  `,q=e.currentSeasonRank??ir(e.riderId)??"–",ee=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(e.riderName)} (${e.currentSeasonPoints}/${q})">${S(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${q})</span></span>
    </div>
    `];dt.forEach((D,A)=>{const P=Gt[A%Gt.length],O=D.currentSeasonRank??ir(D.riderId)??"–";ee.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${P}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(D.riderName)} (${D.currentSeasonPoints}/${O})">${S(D.riderName)} <span style="color: var(--text-500);">(${D.currentSeasonPoints}/${O})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${D.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const Y=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      
      <!-- Chart Line Toggle Checkboxes -->
      <div class="chart-line-toggles" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-form" ${De.form?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-combined-fatigue" ${De.combinedFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #ef4444;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
          Gesamtfatigue (0-15)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-short-fatigue" ${De.shortFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #facc15;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #facc15; border-radius: 50%;"></span>
          Kurzzeitfatigue (0-15)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-long-fatigue" ${De.longFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #a855f7;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #a855f7; border-radius: 50%;"></span>
          Langzeitfatigue (0-15)
        </label>
      </div>

      <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-500); font-weight: bold; margin-bottom: 0.5rem; letter-spacing: 0.5px;">Fahrer</div>
      ${ee.join("")}
    </div>
  `;return`
    <section class="rider-stats-form-tab">
      <div class="rider-stats-season-head">
        <h3>Formverlauf (Saison ${s})</h3>
      </div>
      ${se}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${F}
            ${w}
            ${C}
            ${E}
            ${g?`<path d="${g}" fill="${$}" />`:""}
            ${m?`<path d="${m}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${f}
            ${b}
            ${y}
            ${v}
            ${x}
            ${M}
            ${T}
            ${K}
            ${R}
          </svg>
        </div>
        ${Y}
      </div>
    </section>
  `}function up(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
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
            ${t.map(a=>{var s;const r=e.unavailableUntil?a.startDate<=e.unavailableUntil&&a.endDate>=c.gameState.currentDate:!1;return`
              <tr>
                <td>${S(yr(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${r?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(s=a.country)!=null&&s.code3?de(a.country.code3):"–"}</td>
                <td><strong>${S(a.name)}</strong></td>
                <td>${br(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function Ss(e){const t=new Set;if(e.jerseysWorn){const i=e.jerseysWorn.split(",").map(o=>o.trim()).filter(Boolean);for(const o of i)t.add(o)}const a=new Map;if(e.eventIds){const i=e.eventIds.split("|");for(const o of i){const[d,l]=o.split(":");d&&a.set(d,l?parseInt(l,10):1)}}const r=[{type:"jersey",key:"yellow",label:"Gelbes Trikot (Gesamtwertung)",colorClass:"jersey-dot-yellow"},{type:"jersey",key:"green",label:"Grünes Trikot (Punktewertung)",colorClass:"jersey-dot-green"},{type:"jersey",key:"red",label:"Bergtrikot (Bergwertung)",colorClass:"jersey-dot-red"},{type:"jersey",key:"white",label:"Weißes Trikot (Nachwuchswertung)",colorClass:"jersey-dot-white"},{type:"jersey",key:"purple",label:"Lila Trikot (Aktivste Fahrer)",colorClass:"jersey-dot-purple-worn"},{type:"event",key:"3",label:"Superform",colorClass:"event-dot-3"},{type:"event",key:"4",label:"Supermalus",colorClass:"event-dot-4"},{type:"event",key:"1",label:"Sturz",colorClass:"event-dot-1"},{type:"event",key:"2",label:"Defekt",colorClass:"event-dot-2"},{type:"event",key:"7",label:"Heimvorteil",colorClass:"event-dot-7"},{type:"event",key:"8",label:"Heimbonus",colorClass:"event-dot-8"},{type:"event",key:"9",label:"Heimmalus",colorClass:"event-dot-9"},{type:"event",key:"5",label:"Attacken",colorClass:"event-dot-5"},{type:"event",key:"6",label:"Konterattacken",colorClass:"event-dot-6"}],s=[],n=[];for(const i of r)if(i.type==="jersey")t.has(i.key)&&(s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${S(i.label)}</span>
          </div>
        `));else{const o=a.get(i.key);if(o!==void 0&&o>0){const d=o>1?` (${o}x)`:"";s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${S(i.label)}${S(d)}</span>
          </div>
        `)}}return e.superTeamId!=null&&e.teamId!=null&&e.superTeamId===e.teamId&&(s.push('<span class="status-dot status-dot-superteam"></span>'),n.push(`
      <div class="status-tooltip-row">
        <span class="status-dot status-dot-superteam"></span>
        <span>Superteam-Teilnahme</span>
      </div>
    `)),s.length===0?"":`
    <div class="status-dots-container">
      ${s.join("")}
      <div class="status-tooltip">
        <div class="status-tooltip-title">Status Details</div>
        ${n.join("")}
      </div>
    </div>
  `}function _t(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${S(e)}</span>`}function mp(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function pp(e){return e.finishStatus==="otl"?_t("OTL","place"):e.finishStatus==="dnf"?_t("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${S(String(e.resultRank))}</span>`}function gp(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":_t(String(e.gcRank),"gc")}function fp(e){return e.finishStatus==="otl"?Gr(e.statusReason,!0):e.finishStatus==="dnf"?Gr(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${Ya(e.stageTimeSeconds)}`:e.resultLabel}function ze(e,t,a=!1){var o,d;const r=(e==null?void 0:e.activeTeamId)!=null?((o=c.teams.find(l=>l.id===e.activeTeamId))==null?void 0:o.name)??null:null,s=((d=e==null?void 0:e.country)==null?void 0:d.code3)??(e==null?void 0:e.nationality)??null,n=s?de(s):"",i=t==null?[]:[...t.seasons].map(l=>({...l,raceBlocks:ip(l.raceBlocks)})).sort((l,p)=>p.season-l.season);return a?`
      ${Ye(e,t,r,s,n)}
      ${Ze(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`:t?c.riderStatsTab==="skills"?`
      ${Ye(e,t,r,s,n)}
      ${Ze(t)}
      ${lp(e)}`:c.riderStatsTab==="fatigue"?`
      ${Ye(e,t,r,s,n)}
      ${Ze(t)}
      ${dp(e,t)}`:c.riderStatsTab==="program"?`
      ${Ye(e,t,r,s,n)}
      ${Ze(t)}
      ${up(t)}`:c.riderStatsTab==="form"?`
      ${Ye(e,t,r,s,n)}
      ${Ze(t)}
      ${cp(t)}`:c.riderStatsTab==="topResults"?`
      ${Ye(e,t,r,s,n)}
      ${Ze(t)}
      ${bp(t)}`:c.riderStatsTab==="career"?`
      ${Ye(e,t,r,s,n)}
      ${Ze(t)}
      ${yp(t)}`:t.seasons.length===0?`
      ${Ye(e,t,r,s,n)}
      ${Ze(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`:`
    ${Ye(e,t,r,s,n)}
    ${Ze(t)}
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
                  <p>${S(sp(p))}</p>
                </div>
                ${nr(p.raceCategoryName,p.isStageRace,p.rows.filter(u=>u.rowType==="stage_result").length||null)}
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
                    ${p.rows.map(u=>{const m=u.rowType!=="stage_result",f=m?`${u.raceName} · ${vs(u.rowType)}`:u.stageName?`${u.raceName} · ${u.stageName}`:u.raceName;return`
                        <tr class="rider-stats-row${m?" rider-stats-row-final":""}">
                          <td>${S(ie(u.date))}</td>
                          <td>${pp(u)}</td>
                          <td>${gp(u)}</td>
                          <td class="rider-stats-breakaway-col">${mp(u)}</td>
                          <td>${m?"":bs(u.rolledWeatherId,u.rolledWetterName)}</td>
                          <td>${m?rp(u.rowType):nr(u.raceCategoryName?u.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):u.raceCategoryName,u.isStageRace)}</td>
                          <td>${S(f)}</td>
                          <td class="status-cell">${Ss(u)}</td>
                          <td>${m?"–":u.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${u.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${Ta(u.profile)}</button>`:"–"}</td>
                          <td>${m?"-":u.distanceKm!=null?S(u.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                          <td>${m?"-":u.elevationGainMeters!=null?S(String(Math.round(u.elevationGainMeters))):"–"}</td>
                          <td>${S(fp(u))}</td>
                          <td>${u.seasonPoints}</td>
                        </tr>`}).join("")}
                  </tbody>
                </table>
              </div>
            </section>`).join("")}
        </div>
      </section>`).join("")}`:`
      ${Ye(e,t,r,s,n)}
      ${Ze(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`}function Yr(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(c.riderStatsTab)?(e.style.minWidth="min(1475px, 95vw)",e.style.maxWidth="1687px"):(e.style.minWidth="",e.style.maxWidth="")}async function qt(e){var d,l,p,u;const t=Ie(e),a=(t==null?void 0:t.activeTeamId)!=null?((d=c.teams.find(m=>m.id===t.activeTeamId))==null?void 0:d.name)??null:null;dt=[],Wt=null,c.riderStatsSelectedRiderId=e,c.riderStatsTab="results",Yr(),c.riderStatsTopResultsFilterCategory=null,c.riderStatsTopResultsFilterSeason=null,c.riderStatsTopResultsPage=1,h("rider-stats-title").innerHTML=Hn(t,null),h("rider-stats-jersey").innerHTML="";const r=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((l=t.role)==null?void 0:l.name)??"Fahrer"} · ${a??"Team unbekannt"}${r}`:"Historie wird geladen",h("rider-stats-body").innerHTML=ze(t,null,!0),Qe("riderStats");const s=await V.getRiderStats(e);if(c.riderStatsSelectedRiderId!==e)return;if(!s.success||!s.data){const m=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((p=t.role)==null?void 0:p.name)??"Fahrer"} · ${a??"Team unbekannt"}${m}`:"Fehler beim Laden",h("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>`;return}c.riderStatsPayload=s.data,Yr(),h("rider-stats-title").innerHTML=Hn(t,s.data),h("rider-stats-jersey").innerHTML="";const n=s.data.age?` · Alter ${s.data.age}`:t!=null&&t.age?` · Alter ${t.age}`:"",i=s.data.mentorName?` · Mentor: ${s.data.mentorName}`:"",o=s.data.mentoredRiderNames&&s.data.mentoredRiderNames.length>0?` · Mentor von: ${s.data.mentoredRiderNames.join(" - ")}`:"";h("rider-stats-meta").textContent=`${((u=t==null?void 0:t.role)==null?void 0:u.name)??"Fahrer"} · ${s.data.teamName??a??"Ohne aktives Team"}${n} · ${s.data.seasons.length} Saisons${i}${o}`,h("rider-stats-body").innerHTML=ze(t,s.data,!1)}function hp(){h("rider-stats-body").addEventListener("click",e=>{var s;if(e.target&&e.target.id&&e.target.id.startsWith("toggle-chart-")){const n=e.target.id,i=e.target.checked;n==="toggle-chart-form"?De.form=i:n==="toggle-chart-combined-fatigue"?De.combinedFatigue=i:n==="toggle-chart-short-fatigue"?De.shortFatigue=i:n==="toggle-chart-long-fatigue"&&(De.longFatigue=i);const o=Ie(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=ze(o,c.riderStatsPayload,!1);return}const t=e.target.closest("button[data-rider-stats-tab]");if(!t){const n=e.target.closest("button[data-remove-compare-id]");if(n){const d=Number(n.dataset.removeCompareId);dt=dt.filter(p=>p.riderId!==d);const l=Ie(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=ze(l,c.riderStatsPayload,!1);return}const i=e.target.closest("button[data-top-results-page]");if(i){const d=Number(i.dataset.topResultsPage);if(!isNaN(d)&&d>=1){c.riderStatsTopResultsPage=d;const l=Ie(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=ze(l,c.riderStatsPayload,!1)}return}const o=e.target.closest("button[data-stage-profile-id]");if(o){const d=Number(o.dataset.stageProfileId);Number.isFinite(d)&&lr(d);return}return}const a=t.dataset.riderStatsTab;if(a!=="results"&&a!=="program"&&a!=="form"&&a!=="topResults"&&a!=="skills"&&a!=="career"&&a!=="fatigue"||a==="program"&&(((s=c.riderStatsPayload)==null?void 0:s.programRaces.length)??0)===0)return;c.riderStatsTab=a,Yr();const r=Ie(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=ze(r,c.riderStatsPayload,!1)}),h("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){c.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,c.riderStatsTopResultsPage=1;const a=Ie(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=ze(a,c.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){c.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),c.riderStatsTopResultsPage=1;const a=Ie(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=ze(a,c.riderStatsPayload,!1)}else if(t.classList.contains("rider-stats-filter-checkbox")){const a=t.dataset.filterType;c.riderStatsTopResultsFilters[a]=t.checked,c.riderStatsTopResultsPage=1;const r=Ie(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=ze(r,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;Wt=a?Number(a):null;const r=Ie(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=ze(r,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const r=Number(a);if(dt.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const s=await V.getRiderStats(r,!0);s.success&&s.data?dt.push({riderId:s.data.riderId,riderName:s.data.riderName,teamId:s.data.teamId,teamName:s.data.teamName,formHistory:s.data.formHistory??[],peakDates:s.data.peakDates??[],currentSeasonPoints:s.data.currentSeasonPoints??0,currentSeasonRank:s.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(s.error??""));const n=Ie(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=ze(n,c.riderStatsPayload,!1)}}})}function Gn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function bp(e){const t=[];for(const g of e.seasons)for(const b of g.raceBlocks)for(const y of b.rows)t.push({...y,season:g.season,isStageRace:b.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,b)=>g.localeCompare(b,"de"));const r=Array.from(new Set(t.map(g=>g.season))).sort((g,b)=>b-g);let s=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?c.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?c.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?c.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?c.riderStatsTopResultsFilters.youth:!0:g.isStageRace?c.riderStatsTopResultsFilters.stage:c.riderStatsTopResultsFilters.oneDay);if(c.riderStatsTopResultsFilterCategory){const g=c.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const b=g.substring(0,g.length-8);s=s.filter(y=>y.raceCategoryName===b&&y.rowType==="stage_result")}else if(g.endsWith("-gc")){const b=g.substring(0,g.length-3);s=s.filter(y=>y.raceCategoryName===b&&y.rowType!=="stage_result")}else s=s.filter(b=>b.raceCategoryName===g)}c.riderStatsTopResultsFilterSeason!=null&&(s=s.filter(g=>g.season===c.riderStatsTopResultsFilterSeason)),s.sort((g,b)=>{if(b.seasonPoints!==g.seasonPoints)return b.seasonPoints-g.seasonPoints;const y=g.rowType!=="stage_result",v=b.rowType!=="stage_result",x=g.resultRank??9999,M=b.resultRank??9999;if(c.riderStatsTopResultsFilterCategory)return x!==M?x-M:y!==v?y?-1:1:0;{const T=Gn(g.raceCategoryName),$=Gn(b.raceCategoryName);return T!==$?T-$:y!==v?y?-1:1:x-M}});const n=200,i=s.slice(0,1e3),o=Math.max(1,Math.ceil(i.length/n));c.riderStatsTopResultsPage>o&&(c.riderStatsTopResultsPage=o);const d=(c.riderStatsTopResultsPage-1)*n,l=i.slice(d,d+n),u=`
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
          ${r.map(g=>`<option value="${g}" ${c.riderStatsTopResultsFilterSeason===g?"selected":""}>Saison ${g}</option>`).join("")}
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
  `,m=l.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':l.map(g=>{const b=g.rowType!=="stage_result",y=b?`${g.raceName} · ${vs(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let v="–",x="–";g.finishStatus==="otl"?v=_t("OTL","place"):g.finishStatus==="dnf"?v=_t("DNF","place"):g.resultRank==null||(b?x=`<span class="rider-stats-final-type ${yo(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:v=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${S(String(g.resultRank))}</span>`);const M=b?"–":g.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${g.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${Ta(g.profile)}</button>`:"–",T=!b&&g.stageScore!=null&&g.stageScore>0?hr(g.stageScore,0,350):"–",$=nr(g.raceCategoryName?g.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${b?" rider-stats-row-final":""}">
            <td>${v}</td>
            <td>${x}</td>
            <td><strong>${S(y)}</strong>${b?"":bs(g.rolledWeatherId,g.rolledWetterName)}</td>
            <td class="status-cell">${Ss(g)}</td>
            <td>${M}</td>
            <td>${T}</td>
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
  `}function yp(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,superteamCount:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),r=(n,i,o,d)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let p="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?p+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?p+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?p+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?p+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?p+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?p+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?p+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?p+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(p+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${p}" title="${S(o)}">${n}</span>`},s=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Superteam</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #6366f1;">${t.superteamCount??0}</div>
        </div>
      </div>

      <!-- Categories details -->
      <h3 style="margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; font-weight: 500; font-size: 1.15rem; color: #fff;">Ergebnisse nach Rennklasse</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 1.25rem;">
        ${s.map(n=>{const i=t.categories[n.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(n.name)}">${S(n.name)}</span>
                ${ys(n.key)}
              </div>
              
              ${n.isStage?`
                <!-- Stage Race layout: GC & Classifications -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">GC & Wertungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${r(i.gcWins,"gold","Gesamtwertung Siege")}
                    ${r(i.gcSecond,"silver","Gesamtwertung Platz 2")}
                    ${r(i.gcThird,"bronze","Gesamtwertung Platz 3")}
                    ${r(i.gcTopTen||0,"purple","Gesamtwertung Ränge 4-10")}
                    <span style="border-left: 1px solid rgba(255,255,255,0.15); height: 1rem; margin: 0 0.1rem; display: inline-block;"></span>
                    ${r(i.mountainWins,"red","Bergwertung Siege")}
                    ${r(i.pointsWins,"green","Punktewertung Siege")}
                    ${r(i.youthWins,"white","Nachwuchswertung Siege")}
                    ${r(i.breakawayWins||0,"breakaway","Ausreißerwertung Siege")}
                  </div>
                </div>
                
                <!-- Etappenergebnisse -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Etappenergebnisse</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${r(i.stageWins,"gold","Etappensiege")}
                    ${r(i.stageSecond,"silver","Etappen Platz 2")}
                    ${r(i.stageThird,"bronze","Etappen Platz 3")}
                    ${r(i.stageTopTen||0,"purple","Etappen Ränge 4-10")}
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
                    ${r(i.oneDayWins,"gold","Siege")}
                    ${r(i.oneDaySecond,"silver","Platz 2")}
                    ${r(i.oneDayThird,"bronze","Platz 3")}
                    ${r(i.oneDayTopTen||0,"purple","Ränge 4-10")}
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
                  ${r(i.sprintWins||0,"green","Sprint: Gewonnene Zwischensprints")}
                  ${r(i.climbWinsHC||0,"red","HC: Gewonnene HC-Bergwertungen")}
                  ${r(i.climbWins1||0,"red","C1: Gewonnene Bergwertungen Kategorie 1")}
                  ${r(i.climbWins2||0,"red","C2: Gewonnene Bergwertungen Kategorie 2")}
                  ${r(i.climbWins3||0,"red","C3: Gewonnene Bergwertungen Kategorie 3")}
                  ${r(i.climbWins4||0,"red","C4: Gewonnene Bergwertungen Kategorie 4")}
                </div>
              </div>

              <!-- Profil Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Profil Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${le(i.winFlat||0,"flat","Flach (Flat)")}
                  ${le(i.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${le(i.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${le(i.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${le(i.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${le(i.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${le(i.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${le(i.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${le(i.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${le(i.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${le(i.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${we(i.winWeather1||0,1,"Sonnig")}
                  ${we(i.winWeather2||0,2,"Extreme Hitze")}
                  ${we(i.winWeather3||0,3,"Leichter Regen")}
                  ${we(i.winWeather4||0,4,"Starkregen")}
                  ${we(i.winWeather5||0,5,"Starker Wind")}
                  ${we(i.winWeather6||0,6,"Dichter Nebel")}
                  ${we(i.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${ae.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${i.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}window.openRiderStatsFromRiderStats=qt;const vp=250,zt=1200,Sp=250,kp=1200,zn=.2;class $p{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",r=>{var i,o,d,l;const s=r.target.closest("button[data-race-sim-action]");if(s){if(s.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const u=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;u&&((l=(d=this.options).onFinishRequested)==null||l.call(d,u,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=r.target.closest("button[data-race-sim-speed]");if(n){const p=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(p))return;this.timeMultiplier=p,this.render()}}),this.elements.messages.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-group-rider-id]");if(s){const d=this.resolveRiderIdFromGroupButton(s);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),qt(d));return}const n=r.target.closest("button[data-race-sim-group-rider-name]");if(n){const d=this.resolveRiderIdFromGroupButton(n);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),qt(d));return}const i=r.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),hn(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",r=>{const s=r.target.closest("[data-race-sim-overview-summary]");if(s){const n=s.dataset.raceSimOverviewSummary,i=s.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(r)}),this.elements.groupBox.addEventListener("click",r=>{this.handleGroupInteraction(r)}),this.elements.profile.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-timing-mode]");if(!s)return;const n=s.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+zt,this.render())})}handleGroupInteraction(t){var p,u;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const m=this.resolveRiderIdFromGroupButton(a);m!=null&&this.selectGroupByRiderId(m,this.detailSnapshot);return}const r=t.target.closest("button[data-race-sim-group-nav]");if(!r)return;const s=this.buildRaceGroups(this.detailSnapshot);if(s.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,s.findIndex(m=>m.label===n)),o=r.dataset.raceSimGroupNav==="prev"?-1:1,d=(i+o+s.length)%s.length,l=((p=s[d])==null?void 0:p.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",m=>{const f=m.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+zt)}),this.elements.profile.addEventListener("wheel",m=>{const f=m.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+zt)},{passive:!0}),this.elements.profile.addEventListener("scroll",m=>{const f=m.target;!(f instanceof HTMLElement)||!f.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+zt)},!0),(u=this.elements.sidebar.parentElement)==null||u.addEventListener("click",m=>{if(!this.bootstrap||!this.detailSnapshot||!Cu(this.elements.sidebar,m.target))return;const g=performance.now(),b=Fn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const y=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",y),this.scheduleSidebarPaintTelemetry(g,y),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new Hi(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const r=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(r),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(s=>this.frame(s));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const r=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-r),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(s=>this.frame(s))}render(t=performance.now(),a=!1){var f;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const r=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",s=Nl(this.bootstrap.stageSummary),n=[`${s.segmentCount} Segmente`,s.sprintCount>0?`${s.sprintCount} Sprint${s.sprintCount===1?"":"s"}`:null,s.climbCount>0?`${s.climbCount} Bergwertung${s.climbCount===1?"":"en"}`:null].filter(g=>g!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,d=o!=null?i[o]??"":"",l=d?` · ${d}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${r}${n?` · ${n}`:""}${l}`;const p=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=vp,u=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,m=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=Sp;if(p||u||m){const g=performance.now();this.detailSnapshot=((f=this.engine)==null?void 0:f.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-g)}if(p&&this.detailSnapshot){const g=this.elements.profile.querySelector(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop);const b=performance.now();Gl(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-b),this.lastProfileRenderTime=t;const y=this.elements.profile.querySelector(".race-sim-timing-scroll");y&&(y.scrollTop=this.timingScrollTop)}if(u&&this.detailSnapshot){this.lastSidebarRenderTime=t;const g=performance.now(),b=Fn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const y=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",y),this.scheduleSidebarPaintTelemetry(g,y)}m&&this.detailSnapshot&&(hn(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),gu(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),du(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),fn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const r=a.find(s=>s.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(r)return r.label}return this.selectedGroupLabel!=null&&a.some(r=>r.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return os(is(t.clusters))}resolveInitialGroupLabel(t){var a,r;return((a=t.find(s=>s.label==="P"))==null?void 0:a.label)??((r=t[0])==null?void 0:r.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(r=>[r.riderId,r]));return[...t.riderIds].sort((r,s)=>{var n,i;return(((n=a.get(r))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(s))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||r-s})[0]??null}selectGroupByLabel(t,a,r=!0){const s=this.buildRaceGroups(a),n=s.find(i=>i.label===t)??s.find(i=>i.label==="P")??s[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),r&&(this.profileInteractionHoldUntilMs=performance.now()+zt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const s=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;s&&(this.selectedGroupLabel=s.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+zt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+kp,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const r=t.dataset.raceSimGroupRiderName;if(!r)return null;const s=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===r&&(s==null||i.activeTeamId===s))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const r=this.perfTelemetry[t];this.perfTelemetry[t]=r<=0?a:r*(1-zn)+a*zn}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const r=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(r!==this.sidebarPaintSequence)return;const s=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",s),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||fn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const qe="__stage_overview__",So="__non_finishers__",ko="__events__",$o="__roster__";let Le="all";function ks(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function Kn(e){return ks(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function xp(e){return[...e].sort((t,a)=>Kn(t)-Kn(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function Tp(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=ks(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function wp(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function Mp(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${ie(t.date)}`}async function Zr(e,t){var s;const a=Za(e);if(a&&(c.selectedResultsRaceId=a.race.id,c.selectedResultsStageId=e),c.riders.length===0){const n=await V.getRiders();n.success&&(c.riders=n.data??[])}const r=await V.getStageResults(e);if(!r.success){c.stageResults=null,Ce(),!t&&r.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+r.error);return}c.stageResults=r.data??null,c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId,c.selectedResultTypeId=((s=c.stageResults.classifications[0])==null?void 0:s.resultTypeId)??1,c.selectedResultsMarkerKey=qe,c.selectedResultsSpecialView=null),c.selectedResultsRaceId!=null&&xo(c.selectedResultsRaceId),Ce()}async function xo(e){if(!c.seasonStandings){const a=await V.getSeasonStandings();a.success&&a.data&&(c.seasonStandings=a.data)}const t=await V.getRaceResultsRoster(e);t.success&&t.data?c.resultsRoster=t.data:c.resultsRoster=null}function Rp(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function Wn(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function Ip(){const e=c.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=kt(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=[...e.entries].sort((y,v)=>v.overallRating-y.overallRating),s=new Set(r.slice(0,5).map(y=>y.riderId)),n=y=>{var x;const v=c.riders.find(M=>M.id===y);return((x=v==null?void 0:v.skills)==null?void 0:x.sprint)??0},o=[...e.entries.filter(y=>!s.has(y.riderId))].sort((y,v)=>{const x=n(y.riderId),M=n(v.riderId);return M!==x?M-x:v.overallRating-y.overallRating}),d=new Set(o.slice(0,5).map(y=>y.riderId));function l(y){switch(y){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return y}}const p=new Map;for(const y of e.entries){const v=y.teamId;p.has(v)||p.set(v,{teamId:y.teamId,teamName:y.teamName,riders:[],avgRating:0}),p.get(v).riders.push(y)}for(const y of p.values())y.avgRating=y.riders.reduce((v,x)=>v+x.overallRating,0)/y.riders.length;const u=y=>{let v=Number.POSITIVE_INFINITY;for(const x of y)!x.hasDropped&&x.gcRank!=null&&x.gcRank<v&&(v=x.gcRank);return v},m=y=>{var x;if(!((x=c.seasonStandings)!=null&&x.riderStandings))return 0;let v=0;for(const M of y){const T=c.seasonStandings.riderStandings.find($=>$.riderId===M.riderId);T&&T.points>v&&(v=T.points)}return v},f=y=>{if(y==null)return 0;const v=c.riders.filter(T=>T.activeTeamId===y);if(v.length===0)return 0;const x=v.map(T=>T.overallRating??0);x.sort((T,$)=>$-T);const M=x.slice(0,10);return M.length===0?0:M.reduce((T,$)=>T+$,0)/M.length},g=[...p.values()].sort((y,v)=>{const x=u(y.riders),M=u(v.riders);if((x!==Number.POSITIVE_INFINITY||M!==Number.POSITIVE_INFINITY)&&x!==M)return x-M;const T=m(y.riders),$=m(v.riders);if((T>0||$>0)&&T!==$)return $-T;const w=f(y.teamId),C=f(v.teamId);return Math.abs(w-C)>1e-4?C-w:(y.teamName??"").localeCompare(v.teamName??"","de")});for(const y of g)y.riders.sort((v,x)=>Wn(v.roleId)-Wn(x.roleId)||x.overallRating-v.overallRating||v.lastName.localeCompare(x.lastName,"de"));return`<div class="results-roster-grid">${g.map(y=>{const v=y.teamId!=null?Nt(y.teamId,y.teamName):"",x=y.riders.map(T=>{var j;const $=Rp(T.roleId),w=T.countryCode?je[T.countryCode]??T.countryCode.slice(0,2).toLowerCase():null,C=w?`<span class="fi fi-${w} results-roster-flag" title="${S(T.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',E=`${T.firstName.charAt(0)}. ${T.lastName}`,F=T.roleName??"–",L=T.specialization1?l(T.specialization1):null,_=T.specialization2?l(T.specialization2):null;let G=F;L&&(G+=` · ${L}`),_&&(G+=` · ${_}`);const K=`<span class="results-roster-overall-badge" style="color:${Cp(T.overallRating)}" title="Gesamtstärke: ${T.overallRating.toFixed(2)}">${T.overallRating.toFixed(2)}</span>`,R=T.hasDropped?" dropped":"";let B="";T.hasDropped?T.dropoutStatus==="dns"?B="DNS":T.dropoutStatus==="dnf"?B=((j=T.dropoutReason)==null?void 0:j.startsWith("OTL"))??!1?"OTL":"DNF":B="OUT":T.gcRank!=null&&(B=`${T.gcRank}`);let U="";if(T.hasDropped)U=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${S(T.dropoutReason||"")}">${B}</span>`;else if(T.gcRank!=null){let D="rider-stats-rank-badge-gc";T.gcRank===1?D="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":T.gcRank===2?D="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":T.gcRank===3&&(D="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),U=`<span class="rider-stats-rank-badge ${D}" title="GC Stand: Platz ${T.gcRank}">${T.gcRank}</span>`}const se=`style="color: ${T.hasDropped?"var(--text-500)":$.color}; font-weight: bold;"`,q=s.has(T.riderId),ee=d.has(T.riderId);return`<div class="results-roster-rider${R}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${C}
            <span class="results-roster-name${q?" strongest-rider":ee?" best-sprinter":""}">
              ${_e(E,{riderId:T.riderId,teamId:T.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${Wa(T.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${se}>${S(G)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${U||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${K}
        </div>
      </div>`}).join(""),M=y.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${v}</div>
        <div class="results-roster-team-name" title="${S(y.teamName??"–")}">${ot(y.teamName??"–",y.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${M})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${x}</div>
    </div>`}).join("")}</div>`}function Cp(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function Ep(e){var l,p;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=c.stageResults)==null?void 0:l.classifications.find(u=>u.resultTypeId===1),a=new Set(t?t.rows.map(u=>u.riderId).filter(u=>u!=null):[]),r=c.riders.filter(u=>u.activeTeamId===e.teamId&&a.has(u.id)),s=new Set((((p=c.stageResults)==null?void 0:p.nonFinishers)??[]).map(u=>u.riderId)),n=[];for(const u of r){if(u.id===e.riderId||s.has(u.id))continue;let m=0;const f=u.skills.sprint>=72,g=u.skills.flat>=78,b=u.skills.timeTrial>=76,y=u.skills.acceleration>=80;if(f&&m++,g&&m++,b&&m++,y&&m++,m>0){let v=1;m===2?v=1.25:m===3?v=1.5:m===4&&(v=2),n.push({id:u.id,firstName:u.firstName,lastName:u.lastName,countryCode:u.nationality??null,isSprinter:f,multiplier:v,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const u=n.filter(y=>y.isSprinter).reduce((y,v)=>y+v.multiplier,0),m=n.filter(y=>!y.isSprinter).reduce((y,v)=>y+v.multiplier,0);let f=0,g=0;u>0&&m>0?(f=i/(2.125*u+m),g=2.125*f,f=Math.max(.1,Math.min(.3,f)),g=Math.max(.25,Math.min(.6,g))):u>0?(g=i/u,g=Math.max(.25,Math.min(.6,g)),f=g/2.125):m>0&&(f=i/m,f=Math.max(.1,Math.min(.3,f)),g=2.125*f);for(const y of n)y.contribution=y.isSprinter?g*y.multiplier:f*y.multiplier;const b=n.reduce((y,v)=>y+v.contribution,0);if(b>0){const y=i/b;for(const v of n)v.contribution*=y}n.sort((y,v)=>v.contribution-y.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),d=n.map(u=>{const m=lt(Ct(u.id)??u.countryCode),f=u.firstName?`${u.firstName.charAt(0)}. ${u.lastName}`:u.lastName,g=u.contribution.toFixed(2).replace(".",",");return`
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
  `}function jn(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function Wa(e){var u,m,f,g,b,y,v,x,M,T;if(e==null||!c.stageResults)return"";const t=kt(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=c.stageResults.classifications,s=(m=(u=r.find($=>$.resultTypeId===za))==null?void 0:u.rows.find($=>$.rank===1))==null?void 0:m.riderId,n=(g=(f=r.find($=>$.resultTypeId===Hr))==null?void 0:f.rows.find($=>$.rank===1))==null?void 0:g.riderId,i=(y=(b=r.find($=>$.resultTypeId===mi))==null?void 0:b.rows.find($=>$.rank===1))==null?void 0:y.riderId,o=(x=(v=r.find($=>$.resultTypeId===5))==null?void 0:v.rows.find($=>$.rank===1))==null?void 0:x.riderId,d=(T=(M=r.find($=>$.resultTypeId===7))==null?void 0:M.rows.find($=>$.rank===1))==null?void 0:T.riderId,l=[],p=c.selectedResultTypeId;return e===s&&(p===za||p===1&&a||p!==1&&p!==za)&&l.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&l.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&l.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&l.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===d&&l.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>'),l.length===0?"":`<span class="jersey-dots-wrapper">${l.join("")}</span>`}function On(e){if(!e)return"";let t=e;const a=[],r=[...c.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of r){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),d=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");d.test(t)&&(t=t.replace(d,l=>{const p=`__RIDER_LINK_${a.length}__`,u=_e(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(u),p}))}let s=S(t);for(let n=0;n<a.length;n++)s=s.replace(`__RIDER_LINK_${n}__`,a[n]);return s}function Ce(){var A,P,O,z;c.riders.length===0&&V.getRiders().then(k=>{k.success&&k.data&&(c.riders=k.data,Ce())});const e=h("results-race-select"),t=h("results-stage-select"),a=h("results-type-tabs"),r=h("results-marker-tabs"),s=h("results-stage-meta"),n=h("results-empty"),i=h("results-table"),o=i.querySelector("thead tr"),d=h("results-tbody"),l=h("results-marker-classifications"),p=h("results-roster"),u=i.querySelector("colgroup");u&&u.remove(),i.style.tableLayout="",c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+c.races.filter(k=>{var I;return(((I=k.stages)==null?void 0:I.length)??0)>0}).map(k=>`<option value="${k.id}"${k.id===c.selectedResultsRaceId?" selected":""}>${S(k.name)}</option>`).join("");const m=kt(c.selectedResultsRaceId),f=m==null?"":(m.stages??[]).map(k=>`<option value="${k.id}"${k.id===c.selectedResultsStageId?" selected":""}>${S(Mp(m,k))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+f;const g=((A=c.stageResults)==null?void 0:A.classifications.filter(k=>!(m&&!m.isStageRace&&k.resultTypeId!==1&&k.resultTypeId!==6)))??[],b=g.find(k=>k.resultTypeId===c.selectedResultTypeId)??g[0]??null,y=c.selectedResultsSpecialView==="nonFinishers",v=c.selectedResultsSpecialView==="events",x=c.selectedResultsSpecialView==="roster";if(b&&!y&&!v&&!x&&(c.selectedResultTypeId=b.resultTypeId),v){i.style.tableLayout="fixed";const k=document.createElement("colgroup");k.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(k,i.firstChild)}if(!c.stageResults&&!x||!b&&!y&&!v&&!x){const k=Za(c.selectedResultsStageId);s.textContent=k?`${k.race.name} · ${k.stage.profile} · ${ie(k.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",r.innerHTML="",r.classList.add("hidden"),d.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),p.innerHTML="",p.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=c.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}x?c.resultsRoster&&(s.textContent=`${c.resultsRoster.raceName} · Starterfeld`):c.stageResults&&(s.textContent=`${c.stageResults.raceName} · Etappe ${c.stageResults.stageNumber} · ${c.stageResults.profile} · ${ie(c.stageResults.date)}`);const M=c.stageResults?Za(c.stageResults.stageId):null,T=(M==null?void 0:M.stage.distanceKm)??null,$=new Map,w=new Map,C=new Map;if(c.stageResults){const k=c.stageResults.classifications.find(I=>I.resultTypeId===1);if(k)for(const I of k.rows)I.riderId!=null&&I.points!=null&&I.points>0&&$.set(I.riderId,I.points),I.riderId!=null&&I.breakawayKms!=null&&I.breakawayKms>0&&C.set(I.riderId,I.breakawayKms);if(c.stageResults.markerClassifications){for(const I of c.stageResults.markerClassifications)if(ks(I.markerType,I.markerCategory)){for(const N of I.entries)if(N.riderId!=null&&N.pointsAwarded!=null&&N.pointsAwarded>0){const H=w.get(N.riderId)??0;w.set(N.riderId,H+N.pointsAwarded)}}}}const E=(b==null?void 0:b.resultTypeId)===za,F=(b==null?void 0:b.resultTypeId)===Hr||(b==null?void 0:b.resultTypeId)===mi,L=(b==null?void 0:b.resultTypeId)===5,_=(b==null?void 0:b.resultTypeId)===6,G=(b==null?void 0:b.resultTypeId)===7,K=E||F||L||_||G,R=g.map(k=>`
    <button
      type="button"
      class="results-type-btn${!y&&!v&&!x&&k.resultTypeId===c.selectedResultTypeId?" active":""}"
      data-result-type-id="${k.resultTypeId}"
    >${S(k.resultTypeName)}</button>
  `),B=`
    <button
      type="button"
      class="results-type-btn${y?" active":""}"
      data-results-special-view="${So}"
    >OTL/DNF</button>
  `,U=`
    <button
      type="button"
      class="results-type-btn${v?" active":""}"
      data-results-special-view="${ko}"
    >Ereignisse</button>
  `,W=`
    <button
      type="button"
      class="results-type-btn${x?" active":""}"
      data-results-special-view="${$o}"
    >Teilnehmer</button>
  `,se=g.findIndex(k=>k.resultTypeName.toLocaleLowerCase("de").includes("team"));se>=0?R.splice(se+1,0,B,U,W):R.push(B,U,W),a.innerHTML=R.join("");const q=xp(((P=c.stageResults)==null?void 0:P.markerClassifications)??[]);if(x){p.innerHTML=Ip(),p.classList.remove("hidden"),i.classList.add("hidden"),r.innerHTML="",r.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else p.innerHTML="",p.classList.add("hidden");const ee=!y&&!v&&!x&&(b==null?void 0:b.resultTypeId)===1&&q.length>0,Y=ee?c.selectedResultsMarkerKey??qe:null,j=ee&&Y!==qe?q.find(k=>k.markerKey===Y)??null:null;if(ee&&(c.selectedResultsMarkerKey=(j==null?void 0:j.markerKey)??qe),v){const k=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"},{key:"superteam",label:"Superteam"}];r.innerHTML=k.map(I=>`
      <button
        type="button"
        class="results-type-btn${I.key===Le?" active":""}"
        data-event-filter="${I.key}"
      >${S(I.label)}</button>
    `).join("")}else r.innerHTML=ee?[`
        <button
          type="button"
          class="results-type-btn${c.selectedResultsMarkerKey===qe?" active":""}"
          data-marker-key="${qe}"
        >Tageswertung</button>`,...q.map(k=>`
        <button
          type="button"
          class="results-type-btn${k.markerKey===c.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${k.markerKey}"
        >${S(Tp(k))}</button>
      `)].join(""):"";r.classList.toggle("hidden",!v&&!ee);const D=y||v||!ee||c.selectedResultsMarkerKey===qe;if(o&&D&&(o.innerHTML=y?`
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
      `:E?`
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
        `:G?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Kilometer</th>
          <th>UCI Punkte</th>
        `:_?`
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
        ${K?"<th>Trend</th>":""}
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
        <th class="results-points-cell">Punktewertung</th>
        <th>UCI Punkte</th>
      `),d.innerHTML=y?(((O=c.stageResults)==null?void 0:O.nonFinishers)??[]).map(k=>`
      <tr>
        <td>${k.stageNumber}</td>
        <td>${pl(k.isOtl)}</td>
        <td class="results-jersey-col-cell">${ra(k.teamId,k.teamName)}</td>
        <td>${sa(k.riderName,!0,!1,k.riderId,k.teamId)}</td>
        <td class="results-flag-col-cell">${lt(k.countryCode)}</td>
        <td>${ot(k.teamName||"–",k.teamId)}</td>
        <td>${S(Gr(k.statusReason,k.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':v?[...((z=c.stageResults)==null?void 0:z.events)??[]].filter(k=>Le==="all"?!0:Le==="form"?!!(k.title&&(k.title.includes("guten Tag")||k.title.includes("schlechten Tag")||k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))):Le==="attack"?(k.type==="attack"||k.type==="counter_attack")&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Le==="breakaway"?!!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Le==="incident"?(k.type==="incident"||!!(k.title&&k.title.includes("Massensturz")))&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Le==="exit"?k.type==="dnf"||!!(k.title&&k.title.includes("nicht am Start")):Le==="home"?!!(k.title&&(k.title.includes("Heimvorteil")||k.title.includes("Heimdruck"))):Le==="weather"?!!(k.title&&k.title.startsWith("Wetterbericht:")):Le==="superteam"?k.type==="superteam":!0).sort((k,I)=>{const N=k.kmMark??0,H=I.kmMark??0;if(Math.abs(N-H)>1e-4)return N-H;if(N===0){const fe=jn(k),pe=jn(I);if(fe!==pe)return fe-pe}const Z=k.riderName??"",ne=I.riderName??"";return Z.localeCompare(ne,"de")}).map(k=>{var Qt,gt,ea;const I=k.kmMark!=null?`${k.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",N=k.riderId,H=N!=null?Ie(N):null,Z=k.riderTeamId??(H==null?void 0:H.activeTeamId)??null,ne=Z!=null?((Qt=c.teams.find(xe=>xe.id===Z))==null?void 0:Qt.name)??null:null;let fe=ra(Z,ne);const pe=!!(k.title&&k.title.startsWith("Wetterbericht:"));let $e=k.title||"";if(pe){const xe=(gt=c.stageResults)==null?void 0:gt.rolledWeatherId,Tt=(ea=c.stageResults)==null?void 0:ea.rolledWetterName;fe=`<span class="results-jersey-cell">${bs(xe,Tt)}</span>`,Tt&&($e=`Wetterbericht: ${Tt}`)}const ye=k.type==="superteam",he=ye&&N==null,ve=pe||he?"":lt(N!=null?Ct(N):null),Ue=pe?"":he?ot(ne||"–",Z):N!=null?sa(k.riderName??"",!0,!1,N,Z):S(k.riderName||"–");let oe="";return k.title&&k.title.includes("guten Tag")?oe='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':k.title&&k.title.includes("schlechten Tag")?oe='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':k.title&&(k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))?oe='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':k.title&&k.title.includes("nicht am Start")?oe='<span class="event-badge event-badge-dns">DNS</span>':k.title&&k.title.includes("Massensturz")?oe='<span class="event-badge event-badge-masscrash">Massensturz</span>':k.type==="dnf"?oe='<span class="event-badge event-badge-dnf">DNF</span>':k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))?oe='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':k.type==="attack"?oe='<span class="event-badge event-badge-attack">Attacke</span>':k.type==="counter_attack"?oe='<span class="event-badge event-badge-counter">Konterattacke</span>':k.type==="incident"?k.title&&(k.title.toLowerCase().includes("defekt")||k.title.toLowerCase().includes("panne")||k.title.toLowerCase().includes("technisch"))?oe='<span class="event-badge event-badge-defect">Defekt</span>':oe='<span class="event-badge event-badge-crash">Sturz</span>':k.title&&k.title.includes("Super-Heimvorteil")?oe='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>':k.title&&k.title.includes("Heimdruck")?oe='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>':k.title&&k.title.includes("Heimvorteil")?oe='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':k.title&&k.title.startsWith("Wetterbericht:")?oe='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>':ye&&(oe='<span class="event-badge event-badge-superteam"><span class="event-icon">⚡</span> Superteam</span>'),`
          <tr>
            <td>${I}</td>
            <td>
              <div class="event-rider-info">
                ${fe}
                ${ve}
                ${Ue}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${On($e)}</span>
                  ${oe}
                </div>
                ${k.detail?`<div class="event-detail">${On(k.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':D&&b?b.rows.map(k=>{const I=k.riderName??k.teamName,N=k.riderName?k.teamName:"–",H=ra(k.teamId,k.teamName),Z=sa(I,!0,k.isBreakaway===!0,k.riderId,k.teamId),ne=lt(Ct(k.riderId)),fe=b.resultTypeId===1&&k.rank===1&&k.timeSeconds!=null&&T!=null,pe=k.timeSeconds!=null?`${Ya(k.timeSeconds)}${fe?` (${wp(T,k.timeSeconds)})`:""}`:"–",$e=K?`<td class="results-gc-delta-cell">${zr(k.previousRank,k.rankDelta)}</td>`:"";if(F){let he=k.points!=null?String(k.points):"–";if(k.points!=null&&k.riderId!=null&&b){const Ue=b.resultTypeId===Hr?$.get(k.riderId)??0:w.get(k.riderId)??0;Ue>0&&(he+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${Ue}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${$e}
            <td class="results-jersey-col-cell">${H}</td>
            <td>${Z}${Wa(k.riderId)}</td>
            <td class="results-flag-col-cell">${ne}</td>
            <td>${ot(N,k.teamId)}</td>
            <td class="results-points-cell">${he}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(G){let he=k.breakawayKms!=null?`${k.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if(k.breakawayKms!=null&&k.riderId!=null){const ve=C.get(k.riderId)??0;ve>0&&(he+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${ve.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${$e}
            <td class="results-jersey-col-cell">${H}</td>
            <td>${Z}${Wa(k.riderId)}</td>
            <td class="results-flag-col-cell">${ne}</td>
            <td>${ot(N,k.teamId)}</td>
            <td class="results-points-cell">${he}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(_)return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${$e}
            <td class="results-jersey-col-cell">${H}</td>
            <td>${ot(k.teamName,k.teamId)}</td>
            <td class="results-flag-col-cell">${ne}</td>
            <td>${pe}</td>
            <td>${S(xr(k.gapSeconds))}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`;let ye=k.points!=null?String(k.points):"–";if(k.leadoutBonus!=null&&k.leadoutBonus>0&&k.leadoutRiderId!=null){const he=Ep(k);ye=`
          <div class="leadout-bonus-anchor">
            ${k.points!=null?k.points:"–"}
            ${he}
          </div>
        `}return`
        <tr>
          <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
          ${$e}
          <td class="results-jersey-col-cell">${H}</td>
          <td>${Z}${Wa(k.riderId)}</td>
          <td class="results-flag-col-cell">${ne}</td>
          <td>${ot(N,k.teamId)}</td>
          <td>${pe}</td>
          <td>${S(xr(k.gapSeconds))}</td>
          <td class="results-points-cell">${ye}</td>
          <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
        </tr>`}).join(""):"",n.classList.toggle("hidden",!!b||y||v||x),i.classList.toggle("hidden",!D||x),j){const k=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${S(gl(j.markerType,j.markerLabel))}</h4>
          <div class="results-marker-card-meta">${S(`${j.kmMark.toFixed(1).replace(".",",")} km${j.markerCategory?` · Kat. ${j.markerCategory}`:""}`)}</div>
        </div>
      </section>`,I=j.entries.map(N=>{var fe;const H=Ie(N.riderId),Z=H?`${H.firstName} ${H.lastName}`:`Fahrer ${N.riderId}`,ne=(H==null?void 0:H.activeTeamId)!=null?((fe=c.teams.find(pe=>pe.id===H.activeTeamId))==null?void 0:fe.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${N.rank}.</div>
          <div class="results-marker-jersey">${ra(H==null?void 0:H.activeTeamId,ne)}</div>
          <div class="results-marker-name">${sa(Z,!1,!1,(H==null?void 0:H.id)??null,(H==null?void 0:H.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${lt(Ct(H==null?void 0:H.id))}</div>
          <div class="results-marker-time">${S(Ya(N.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${S(xr(N.gapSeconds))}</div>
          <div class="results-marker-points">${N.pointsAwarded!=null&&N.pointsAwarded>0?N.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${k}<div class="results-marker-list">${I}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!j)}function Fp(){h("results-race-select").addEventListener("change",e=>{var r,s;const t=e.target.value;c.selectedResultsRaceId=t?Number(t):null;const a=kt(c.selectedResultsRaceId);c.selectedResultsStageId=((s=(r=a==null?void 0:a.stages)==null?void 0:r[0])==null?void 0:s.id)??null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=qe,c.selectedResultsSpecialView=null,c.stageResults=null,Ce(),c.selectedResultsStageId!=null&&Zr(c.selectedResultsStageId,!0)}),h("results-stage-select").addEventListener("change",e=>{const t=e.target.value;c.selectedResultsStageId=t?Number(t):null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=qe,c.selectedResultsSpecialView=null,c.stageResults=null,Ce(),c.selectedResultsStageId!=null&&Zr(c.selectedResultsStageId,!0)}),h("results-type-tabs").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-result-type-id]");if(t){c.selectedResultsSpecialView=null,c.selectedResultTypeId=Number(t.dataset.resultTypeId),Ce();return}const a=e.target.closest("button[data-results-special-view]");if(a){const s=a.dataset.resultsSpecialView;s===So?(c.selectedResultsSpecialView="nonFinishers",Ce()):s===ko?(c.selectedResultsSpecialView="events",Le="all",Ce()):s===$o&&(c.selectedResultsSpecialView="roster",c.selectedResultsRaceId!=null&&((r=c.resultsRoster)==null?void 0:r.raceId)!==c.selectedResultsRaceId&&xo(c.selectedResultsRaceId).then(()=>Ce()),Ce())}}),h("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const r=t.dataset.markerKey;c.selectedResultsMarkerKey=r??qe,Ce();return}const a=e.target.closest("button[data-event-filter]");a&&(Le=a.dataset.eventFilter??"all",Ce())})}const $s=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],$a=["skills","form","profile","preferences"],xs=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],Ts={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...$s.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function ws(){return[...xs,...Ts[c.teamDetailPage]]}function To(e,t=12){const a=c.riders.filter(s=>s.activeTeamId===e).sort((s,n)=>n.overallRating-s.overallRating).slice(0,t);return a.length===0?null:a.reduce((s,n)=>s+n.overallRating,0)/a.length}function wo(e){const t=c.riders.filter(r=>r.activeTeamId===e);return t.length===0?null:t.reduce((r,s)=>r+s.overallRating,0)/t.length}function Mo(e){const t=To(e);return t==null?"–":t.toFixed(1).replace(".",",")}function Ro(e){const t=wo(e);return t==null?"–":t.toFixed(1).replace(".",",")}function re(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function Ee(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:re(e,t)}function Se(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function Fe(e){return e==null?void 0:typeof e=="string"?la(e):e.name}function Ms(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...$s.map(t=>t.key)].includes(e)?"desc":"asc"}function Io(e){return c.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function Co(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=c.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Io(e.sortKey)}
      </button>
    </th>`}function Eo(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${$a.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const Fo={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function Rs(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":Fo[e]??String(e)}function Po(e){const t=[...e],a=c.teamTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(c.teamTableSort.key){case"name":n=re(r.lastName,s.lastName)||re(r.firstName,s.firstName);break;case"countryCode":n=re(Lt(r),Lt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=re(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=re(St(r),St(s));break;case"riderType":n=re(r.riderType,s.riderType)||re(Ae(r),Ae(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Ee(Fe(r.specialization1),Fe(s.specialization1));break;case"specialization2":n=Ee(Fe(r.specialization2),Fe(s.specialization2));break;case"specialization3":n=Ee(Fe(r.specialization3),Fe(s.specialization3));break;case"peak1":n=Ee(Se(r,0),Se(s,0));break;case"peak2":n=Ee(Se(r,1),Se(s,1));break;case"peak3":n=Ee(Se(r,2),Se(s,2));break;default:n=r.skills[c.teamTableSort.key]-s.skills[c.teamTableSort.key];break}return n===0&&(n=re(r.lastName,s.lastName)||re(r.firstName,s.firstName)),n*a}),t}function No(e){const t=[...e],a=c.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(c.riderMenuTableSort.key){case"name":n=re(r.lastName,s.lastName)||re(r.firstName,s.firstName);break;case"countryCode":n=re(Lt(r),Lt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=re(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=re(St(r),St(s));break;case"riderType":n=re(r.riderType,s.riderType)||re(Ae(r),Ae(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Ee(Fe(r.specialization1),Fe(s.specialization1));break;case"specialization2":n=Ee(Fe(r.specialization2),Fe(s.specialization2));break;case"specialization3":n=Ee(Fe(r.specialization3),Fe(s.specialization3));break;case"peak1":n=Ee(Se(r,0),Se(s,0));break;case"peak2":n=Ee(Se(r,1),Se(s,1));break;case"peak3":n=Ee(Se(r,2),Se(s,2));break;default:n=r.skills[c.riderMenuTableSort.key]-s.skills[c.riderMenuTableSort.key];break}return n===0&&(n=re(r.lastName,s.lastName)||re(r.firstName,s.firstName)),n*a}),t}function Jr(e){return e.length===0?"–":e.map(t=>{const a=c.races.find(r=>r.id===t);return a?S(a.name):`Rennen ${t}`}).join(", ")}function Pp(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function Is(e,t){var a,r;switch(t.id){case"name":return`<td class="team-table-name-cell">${_e(Ae(e),{riderId:e.id,teamId:e.activeTeamId,strong:c.teamDetailPage==="form"||c.teamDetailPage==="profile"||c.teamDetailPage==="preferences"})}${kl(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${de(Lt(e))}<span>${S(Lt(e))}</span></span></td>`;case"age":return`<td>${e.age??(c.gameState?c.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${S(St(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${js(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${vl(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${js((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${Os(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${Os(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${yi(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${S(Se(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${S(Se(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${S(Se(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${S(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?S(la(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?S(la(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?S(la(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${Sl(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${de(e.mentorCountryCode??"UNK")} <span>${S(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${Jr(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${Jr(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const s=t.sortKey;return s&&s in e.skills?`<td>${yl(e.skills[s],(a=e.yearStartSkills)==null?void 0:a[s],(r=e.potentials)==null?void 0:r[s])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function or(){Re("Teams/Fahrer werden aktualisiert...");try{const e=await V.getRiders();if(e.success&&(c.riders=e.data??[]),await V.getTeams().then(t=>{t.success&&(c.teams=t.data??[])}),Me("teams")&&Cs(),Me("riders")){const{renderRidersMenu:t}=await Si(async()=>{const{renderRidersMenu:a}=await Promise.resolve().then(()=>ag);return{renderRidersMenu:a}},void 0);t()}}finally{ke()}}async function Np(e={}){const t=await V.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),h("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${S(t.error??"Unbekannt")}</p>`;return}c.teams=t.data??[],e.render!==!1&&Me("teams")&&Cs()}function Cs(){const e=h("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+c.teams.map(r=>`<option value="${r.id}"${String(r.id)===t?" selected":""}>${S(r.name)} (${S(r.division??r.divisionName??"")}) · ${S(r.abbreviation)}</option>`).join("");const a=t?Number(t):null;ma(a)}function ma(e){const t=h("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=c.teams.find(i=>i.id===e);if(!a){t.innerHTML="";return}const r=Po(c.riders.filter(i=>i.activeTeamId===e)),s=a.division==="U23"?"badge-u23":"badge-classics",n=ws();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${S(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${s}">${S(a.division??a.divisionName??"")}</span>
          <span>${fl(a.country,a.countryCode)}</span>
          <span>Kürzel: ${S(a.abbreviation)} · Top 12 ${S(Mo(a.id))} (${S(Ro(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(Rs(c.teamTableSort.key))} ${c.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Eo()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${n.map(Co).join("")}
          </tr></thead>
          <tbody>
            ${r.length===0?`<tr><td colspan="${n.length}" class="text-muted">Keine Fahrer.</td></tr>`:r.map(i=>`
                <tr class="team-detail-row">
                  ${n.map(o=>Is(i,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function Lo(){h("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;c.teamDetailPage="skills",ma(t?Number(t):null)}),h("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&Ns(s);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const s=a.dataset.teamDetailPage;if($a.includes(s)){c.teamDetailPage=s,new Set(ws().map(o=>o.sortKey).filter(o=>o!=null)).has(c.teamTableSort.key)||(c.teamTableSort={key:"name",direction:"asc"});const i=Number(h("teams-dropdown").value);ma(Number.isFinite(i)?i:null)}return}const r=e.target.closest("button[data-team-sort]");if(r){const s=r.dataset.teamSort;c.teamTableSort.key===s?c.teamTableSort.direction=c.teamTableSort.direction==="asc"?"desc":"asc":c.teamTableSort={key:s,direction:Ms(s)};const n=Number(h("teams-dropdown").value);ma(Number.isFinite(n)?n:null);return}})}const Lp=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:Ts,TEAM_DETAIL_PAGE_ORDER:$a,TEAM_SKILL_COLUMNS:$s,TEAM_SKILL_TITLES:Fo,TEAM_TABLE_COLUMNS:xs,compareOptionalStrings:Ee,compareStrings:re,formatTeamAverage:Ro,formatTeamTopAverage:Mo,getActiveTeamTableColumns:ws,getDefaultTeamSortDirection:Ms,getPeakDate:Se,getSortIndicator:Io,getSpecializationSortLabel:Fe,getTeamAverage:wo,getTeamSortLabel:Rs,getTeamTopAverage:To,initTeamsListeners:Lo,loadTeams:Np,refreshTeamsViewData:or,renderPeakDatesSummary:Pp,renderRacePrefs:Jr,renderTeamDetail:ma,renderTeamDetailPageTabs:Eo,renderTeamTableCell:Is,renderTeamTableHeader:Co,renderTeams:Cs,sortRiderMenuRiders:No,sortTeamRiders:Po},Symbol.toStringTag,{value:"Module"}));function Dp(e,t,a){return`${e} · Etappe ${t} · ${a}`}function Do(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function _o(e,t){const a=[];for(const r of e.riders)if(r.leadoutBonus!=null&&r.leadoutBonus>0&&r.leadoutContributions&&r.leadoutContributions.length>0){const s=t.riders.find(i=>i.id===r.riderId),n=(s==null?void 0:s.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:r.riderId,leadoutBonus:r.leadoutBonus,contributorsJson:JSON.stringify(r.leadoutContributions)})}return a}async function Ao(e,t=!1){if(ci!=null||rs)return!1;Gs(e),bl(0);try{const a=await V.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const r=a.data;c.realtimeBootstrap=r;const s=await kc(r,o=>fi(o)),n=Do(s,r),i=_o(s,r);return await Wo(e,n,s.markerClassifications,s.incidents,s.allEvents,t,i,s.superTeamId),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{Gs(null),ke()}}function Bo(e){var r;const t=(r=c.rosterEditor)==null?void 0:r.teams.find(s=>s.team.id===e);if(!t)return 0;const a=new Set(c.rosterEditorSelectedRiderIds);return t.riders.filter(s=>a.has(s.rider.id)).length}function Ho(){return c.rosterEditor?c.rosterEditor.teams.every(e=>Bo(e.team.id)===e.riderLimit):!1}function Lr(){const e=h("roster-editor-title"),t=h("roster-editor-meta"),a=h("roster-editor-body"),r=h("btn-apply-roster-editor"),s=c.rosterEditor;if(!s){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',r.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=s.race.isStageRace?`${s.race.name} · Etappe ${s.stage.stageNumber} · ${s.stage.profile}`:`${s.race.name} · ${s.stage.profile}`;const n=new Set(c.rosterEditorSelectedRiderIds);a.innerHTML=s.teams.map(i=>{const o=Bo(i.team.id),d=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${S(i.team.name)}</h3>
            <p class="text-muted">${S(i.team.abbreviation)} · ${S(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${d}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var b;const u=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),m=l.rider.country?de(l.rider.country.code3):"",f=[((b=l.rider.role)==null?void 0:b.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),g=l.lockReason?`<span class="roster-editor-rider-lock">${S(l.lockReason)}</span>`:"";return`
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
      </section>`}).join(""),r.disabled=!Ho()}function qr(){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],fa("roster-editor-error"),Je("rosterEditor")}function Go(e,t){c.selectedRealtimeStageId=e.stage.id,c.realtimeBootstrap=e,c.realtimeError=null,t&&At("live-race"),zo().load(e,{autoplay:!0,resetSpeed:!0}),Ut()}function zo(){let e=oa;if(!e){const t=h("race-sim-layout"),a=h("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new $p({layout:t,emptyState:a,controlsHeader:h("race-sim-controls-header"),profile:h("race-sim-profile"),groupBox:h("race-sim-group-box"),messages:h("race-sim-messages-body"),favorites:h("race-sim-favorites-body"),sidebar:h("race-sim-sidebar-body"),controls:h("race-sim-controls"),meta:h("race-sim-stage-meta")},{onFinishRequested:(r,s)=>{const n=Do(r,s),i=_o(r,s);Wo(s.stage.id,n,r.markerClassifications,r.incidents,r.allEvents,!1,i,r.superTeamId)}}),ml(e)}return e}async function _p(e){Re("Starterfeld wird geladen..."),fa("roster-editor-error");try{const t=await V.getRosterEditor(e);if(!t.success||!t.data){Et("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),Qe("rosterEditor"),Lr();return}c.rosterEditor=t.data,c.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(r=>r.isSelected).map(r=>r.rider.id)),Lr(),Qe("rosterEditor")}catch(t){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],Et("roster-editor-error",t.message),Qe("rosterEditor"),Lr()}finally{ke()}}async function Ap(){const e=c.rosterEditor;if(e){if(!Ho()){Et("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}fa("roster-editor-error"),Re("Starterfeld wird übernommen...");try{const t=await V.applyRosterEditor(e.stage.id,{riderIds:c.rosterEditorSelectedRiderIds});if(!t.success||!t.data){Et("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}qr(),Go(t.data,!0)}catch(t){Et("roster-editor-error",t.message)}finally{ke()}}}function Ut(){var n,i;const e=h("race-sim-stage-select"),t=((n=c.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===c.selectedRealtimeStageId)||(c.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===c.selectedRealtimeStageId?" selected":""}>${S(Dp(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const r=t.find(o=>o.stageId===c.selectedRealtimeStageId)??null,s=zo();if(!r){c.realtimeBootstrap=null,c.realtimeError=null,s.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!c.realtimeBootstrap||c.realtimeBootstrap.stage.id!==r.stageId)&&(c.realtimeError?s.clear(c.realtimeError):s.hide())}async function Ko(e,t){if(Br!==e){zs(e),c.selectedRealtimeStageId=e,t&&At("live-race"),Ut(),Re("Live-Simulation wird geladen...");try{const a=await V.getRealtimeSimulation(e);if(!a.success||!a.data){c.realtimeBootstrap=null,c.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",Ut(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}Go(a.data,!1)}catch(a){c.realtimeBootstrap=null,c.realtimeError=a.message,Ut(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{Br===e&&zs(null),ke()}}}async function Wo(e,t,a,r,s,n=!1,i,o){if(!rs){Hs(!0),Re("Live-Ergebnis wird gespeichert...");try{const d=await V.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:r,events:s,leadoutContributions:i,superTeamId:o});if(!d.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(d.error??"Unbekannter Fehler"));return}const l=d.data;c.selectedResultsRaceId=(l==null?void 0:l.raceId)??c.selectedResultsRaceId,c.selectedResultsStageId=(l==null?void 0:l.stageId)??e,c.selectedResultTypeId=1,c.realtimeBootstrap=null,c.realtimeError=null,await Zr(e,!1),await Fs(),await Ps(),await or(),Ut(),n||At("results")}catch(d){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+d.message)}finally{Hs(!1),ke()}}}function Bp(){h("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);c.selectedRealtimeStageId=Number.isFinite(t)?t:null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null),c.realtimeError=null,Ko(t,!1)})}function Es(e){var r;const t=ut((r=e.category)==null?void 0:r.name),a=ur(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function br(e){var s,n;const t=ut((s=e.category)==null?void 0:s.name),a=ur(t),r=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${S(r)}</span>`}function Hp(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(r=>r.date).sort((r,s)=>r.localeCompare(s));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function yr(e){const{startDate:t,endDate:a}=Hp(e);return t===a?ie(t):`${ie(t)} - ${ie(a)}`}function Gp(e){return e.stageId>0}async function Fs(){const[e,t]=await Promise.all([V.getGameState(),V.getGameStatus()]);if(!e.success){console.error(e.error);return}c.gameState=e.data??null,c.gameStatus=t.success?t.data??null:null,zp(),Me("dashboard")&&vr()}function zp(){var s;if(!c.gameState)return;h("meta-date").textContent=c.gameState.formattedDate,h("meta-season").textContent=`Saison ${c.gameState.season}`;const e=h("meta-race-hint"),t=h("btn-advance-day"),a=h("pending-stages-list"),r=((s=c.gameStatus)==null?void 0:s.pendingStages)??[];r.length>0?(e.textContent=`${r.length} offene Etappe${r.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=r.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${ie(n.date)}`:`${n.profile} · ${ie(n.date)}`,o=Gp(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
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
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):c.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function vr(){var t,a,r,s,n;const e=c.teams.find(i=>i.isPlayerTeam)??c.teams.find(i=>{var o;return i.name===((o=c.currentSave)==null?void 0:o.teamName)})??null;h("dashboard-career").textContent=((t=c.currentSave)==null?void 0:t.careerName)??"–",h("dashboard-team").textContent=(e==null?void 0:e.name)??((a=c.currentSave)==null?void 0:a.teamName)??"–",h("dashboard-date").textContent=((r=c.gameState)==null?void 0:r.formattedDate)??"–",h("dashboard-season").textContent=c.gameState?`Saison ${c.gameState.season}`:"–",h("dashboard-races-today").textContent=String(((s=c.gameStatus)==null?void 0:s.pendingStages.length)??((n=c.gameState)==null?void 0:n.racesTodayCount)??0),Op()}async function Ps(){const e=await V.getRaces();if(!e.success){console.error(e.error);return}c.races=e.data??[],Me("dashboard")&&vr(),Kp(),Wp()}async function Kp(){var n;const e=(n=c.gameState)==null?void 0:n.season;if(!e||c.races.length===0)return;const t=`participantCountsLogged_${e}`;if(localStorage.getItem(t))return;const a=c.races.slice(0,30),r=await Promise.all(a.map(async i=>{var d;const o=await V.getRaceProgramParticipants(i.id);return{race:i,count:o.success?((d=o.data)==null?void 0:d.length)??0:-1}}));if(r.some(i=>i.count>0)){console.group(`[Velo] Teilnehmeranzahl Saison ${e}`);for(const{race:i,count:o}of r)o>=0&&console.log(`${i.name} (${i.startDate}): ${o} Programmfahrer`);console.groupEnd(),localStorage.setItem(t,"1")}}async function Wp(){var i;const e=(i=c.gameState)==null?void 0:i.season;if(!e)return;const t=`programAssignmentsLogged_${e}`;if(localStorage.getItem(t))return;const a=await V.getRiders();if(!a.success||!a.data)return;const r=a.data,s=new Map;for(const o of r)if(o.seasonProgram){const d=o.seasonProgram;s.has(d.id)||s.set(d.id,{name:d.name,riders:[]}),s.get(d.id).riders.push(o)}if(s.size===0)return;console.group(`[Velo] Programmzuweisungen Saison ${e}`);const n=Array.from(s.keys()).sort((o,d)=>o-d);for(const o of n){const d=s.get(o);console.log(`Program: ${o} - ${d.name} (Count: ${d.riders.length})`)}console.groupEnd(),localStorage.setItem(t,"1")}function jp(e,t){const[a,r,s]=e.split("-").map(Number),n=new Date(a,r-1,s);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),d=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${d}`}function Vn(e){var p,u,m,f;const t=c.gameState!=null&&e.startDate<=c.gameState.currentDate&&e.endDate>=c.gameState.currentDate,r=c.gameState!=null&&e.endDate<c.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',s=((p=e.country)==null?void 0:p.name)??`Land ${e.countryId}`,n=(u=e.country)!=null&&u.code3?de(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.distanceKm??0),0):((m=e.upcomingStage)==null?void 0:m.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.elevationGainMeters??0),0):((f=e.upcomingStage)==null?void 0:f.elevationGainMeters)??null,d=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${ie(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${S(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${Es(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${S(s)}</span></span></td>
      <td>${br(e)}</td>
      <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${e.id}">Teilnehmer</button></td>
      <td>${d}</td>
      <td>${l}</td>
      <td>${r}</td>
    </tr>`}function Op(){const e=h("dashboard-races-tbody");if(!c.gameState){e.innerHTML='<tr><td colspan="9" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=c.gameState.currentDate,a=jp(t,7),r=c.races.filter(i=>i.startDate<=t&&i.endDate>=t),s=c.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>In Progress</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=r.map(i=>Vn(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=s.map(i=>Vn(i)).join(""),e.innerHTML=n}function xa(e){return`Etappe ${e.stageNumber}`}function Vp(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,r)=>r[1]!==a[1]?r[1]-a[1]:a[0].localeCompare(r[0])).map(([a,r])=>`${r}x ${a}`).join(" · ")}function Up(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function Ta(e){return`<span class="stage-profile-badge ${Up(e)}">${S(e)}</span>`}function Sr(e,t){return`${e.name} · ${xa(t)} · ${t.profile}`}async function Yp(e){var s;const t=c.stageSummariesByStageId[e];if(t)return t;const a=await V.getStageSummary(e);if(a.success&&a.data)return c.stageSummariesByStageId[e]=a.data,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],a.data;const r=await V.getRealtimeSimulation(e);return r.success&&((s=r.data)!=null&&s.stageSummary)?(c.stageSummariesByStageId[e]=r.data.stageSummary,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],r.data.stageSummary):(c.stageSummaryErrorsByStageId&&(c.stageSummaryErrorsByStageId[e]=a.error??r.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:r.error}),c.stageSummariesByStageId&&delete c.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function Zp(){var d;const e=h("race-stages-title"),t=h("race-stages-meta"),a=h("race-stages-body"),r=kt(c.selectedDashboardRaceId);if(!r){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const s=r.stages??[],n=s.reduce((l,p)=>l+(p.distanceKm??0),0),i=s.reduce((l,p)=>l+(p.elevationGainMeters??0),0),o=Vp(s);if(e.textContent=r.name,t.textContent=`${yr(r)} · ${((d=r.country)==null?void 0:d.name)??`Land ${r.countryId}`} · ${r.isStageRace?`${r.numberOfStages} Etappen`:"Eintagesrennen"} · ${Kr(n)} · ${Wr(i)} · ${o}`,s.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
          ${s.map(l=>`
              <tr class="dashboard-race-stage-row">
                <td>${ie(l.date)}</td>
                <td><strong>${S(xa(l))}</strong></td>
                <td>${Ta(l.profile)}</td>
                <td>${l.distanceKm!=null?Kr(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?Wr(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${S(Sr(r,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Xr(e){kt(e)&&(c.selectedDashboardRaceId=e,Zp(),Qe("raceStages"))}function Jp(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,r;return`
            <tr>
              <td>${yr(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?de(t.country.code3):""}<span>${S(((r=t.country)==null?void 0:r.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${S(t.name)}</strong></td>
              <td>${br(t)}</td>
              <td>${Es(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function Ns(e){const t=c.riders.find(r=>r.id===e);h("rider-program-title").textContent=t?Ae(t):"Programm",h("rider-program-meta").textContent="Lade Programmrennen ...",h("rider-program-body").innerHTML="",Qe("riderProgram");const a=await V.getRiderProgramRaces(e);if(!a.success||!a.data){h("rider-program-meta").textContent="",h("rider-program-body").innerHTML=`<div class="results-empty">${S(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}h("rider-program-title").textContent=a.data.program.name,h("rider-program-meta").textContent=t?Ae(t):"",h("rider-program-body").innerHTML=Jp(a.data)}function qp(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=Xp(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${Mt("Team","team","Team")}
          ${Mt("Fahrer","rider","Fahrer")}
          ${Mt("Spec1","spec1","Spezialisierung 1")}
          ${Mt("Rolle","role","Rolle")}
          ${Mt("Ges","overall","Gesamtstärke")}
          ${Mt("Phase","phase","Formphase")}
          ${Mt("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var r,s;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${Nt((r=a.team)==null?void 0:r.id,(s=a.team)==null?void 0:s.name)}</td>
              <td><span class="race-participant-rider-cell">${de(Lt(a.rider))}<strong>${S(Ae(a.rider))}</strong></span></td>
              <td>${S(Qr(a.rider))}</td>
              <td>${S(St(a.rider))}</td>
              <td>${bi(a.rider.overallRating)}</td>
              <td>${yi(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${S(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function Mt(e,t,a){const r=c.raceParticipantsSort.key===t?" race-participants-sort-active":"",s=c.raceParticipantsSort.key===t?c.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${S(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${r}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${c.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${s}</span>
      </button>
    </th>`}function Xp(e){const t=c.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{var n,i,o,d;let s=0;switch(c.raceParticipantsSort.key){case"team":s=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=r.team)==null?void 0:i.name)??"","de");break;case"rider":s=Ae(a.rider).localeCompare(Ae(r.rider),"de");break;case"spec1":s=Qr(a.rider).localeCompare(Qr(r.rider),"de");break;case"role":s=St(a.rider).localeCompare(St(r.rider),"de");break;case"overall":s=a.rider.overallRating-r.rider.overallRating;break;case"phase":s=(a.rider.seasonFormPhase??"neutral").localeCompare(r.rider.seasonFormPhase??"neutral","de");break;default:s=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((d=r.program)==null?void 0:d.name)??"","de")}return s*t||Ae(a.rider).localeCompare(Ae(r.rider),"de")})}function Qr(e){return e.specialization1!=null?la(e.specialization1):"–"}async function jo(e){const t=kt(e);c.selectedRaceParticipantsRaceId=e,h("race-participants-title").textContent=(t==null?void 0:t.name)??"Teilnehmer",h("race-participants-meta").textContent="Lade Programmfahrer ...",h("race-participants-body").innerHTML="",c.raceParticipants=[],Qe("raceParticipants"),await Oo()}async function Oo(e=!1){const t=c.selectedRaceParticipantsRaceId;if(t==null)return;const a=kt(t);e&&(h("race-participants-meta").textContent="Lade Programmfahrer ...");const r=await V.getRaceProgramParticipants(t);if(!r.success||!r.data){h("race-participants-meta").textContent="",h("race-participants-body").innerHTML=`<div class="results-empty">${S(r.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}c.raceParticipants=r.data,h("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",h("race-participants-meta").textContent=`${r.data.length} Programmfahrer · ${a?yr(a):""}`,h("race-participants-body").innerHTML=qp(c.raceParticipants)}async function lr(e,t=null){let a=Za(e);if(!a&&c.stageEditorStageRows){const n=c.stageEditorStageRows.find(i=>i.stageId===e);n&&(a={race:{id:n.raceId,name:n.raceName,countryId:0,categoryId:0,isStageRace:!0,numberOfStages:1,startDate:"",endDate:"",prestige:0},stage:{id:n.stageId,raceId:n.raceId,stageNumber:n.stageNumber,date:"2026-01-01",profile:n.profile,startElevation:0,detailsCsvFile:"",distanceKm:n.distanceKm,elevationGainMeters:n.elevationGainMeters}})}if(!a)return;const r=await Yp(e);if(!r){alert(c.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}c.selectedDashboardProfileStageId=e,h("stage-profile-title").textContent=`${a.race.name} · ${xa(a.stage)}`;const s=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";h("stage-profile-meta").textContent=`${ie(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?Kr(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?Wr(a.stage.elevationGainMeters):"–"}${s}`,Hl(h("stage-profile-view"),r,a.stage.profile,Sr(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),Qe("stageProfile")}function Qp(){h("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const s=Number(t.dataset.editStageRoster);if(!Number.isFinite(s))return;_p(s);return}const a=e.target.closest("button[data-live-stage]");if(a){const s=Number(a.dataset.liveStage);if(!Number.isFinite(s))return;Ko(s,!0);return}const r=e.target.closest("button[data-instant-stage]");if(r){const s=Number(r.dataset.instantStage);if(!Number.isFinite(s))return;Ao(s)}}),h("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-participants-id]");if(t){const s=Number(t.dataset.dashboardRaceParticipantsId);Number.isFinite(s)&&jo(s);return}const a=e.target.closest("button[data-dashboard-race-id]");if(!a)return;const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&Xr(r)}),h("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&lr(a)}),h("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&Ns(s);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const r=a.dataset.raceParticipantsSort;c.raceParticipantsSort.key===r?c.raceParticipantsSort.direction=c.raceParticipantsSort.direction==="asc"?"desc":"asc":c.raceParticipantsSort={key:r,direction:"asc"},Oo()}),h("btn-advance-day").addEventListener("click",async()=>{await Vo()}),h("btn-auto-progress").addEventListener("click",()=>{eg()})}async function Vo(){Re("Tag wird fortgeschrieben...");try{const e=await V.advanceDay();if(!e.success)return alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler")),!1;if(c.currentSave&&e.data&&(c.currentSave.currentSeason=e.data.season),await Fs(),await Ps(),Me("teams")){const{refreshTeamsViewData:t}=await Si(async()=>{const{refreshTeamsViewData:a}=await Promise.resolve().then(()=>Lp);return{refreshTeamsViewData:a}},void 0);await t()}return!0}catch(e){return alert("Unerwarteter Fehler beim Tageswechsel: "+e.message),!1}finally{ke()}}function Ls(){const e=document.getElementById("btn-auto-progress");e&&(mt?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function eg(){mt?dr():Uo()}function Uo(){mt||(ui(!0),Ls(),tg())}function dr(){mt&&(ui(!1),c.autoProgressTargetDate=null,Ls())}async function tg(){var e,t;for(;mt;){const a=(e=c.gameState)==null?void 0:e.currentDate;if(c.autoProgressTargetDate&&a&&a>=c.autoProgressTargetDate){dr();break}const r=((t=c.gameStatus)==null?void 0:t.pendingStages)??[];let s=!1;if(r.length>0){const n=r[0];s=await Ao(n.stageId,!0)}else s=await Vo();if(!s){dr();break}await new Promise(n=>setTimeout(n,100))}Ls()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&mt){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),dr()}});const pa=50;function Ds(){return[...xs,...Ts[c.riderMenuDetailPage]]}function Yo(e){return c.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function Zo(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=c.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Yo(e.sortKey)}
      </button>
    </th>`}function Jo(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${$a.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function ja(){const e=h("riders-detail"),t=Ds(),a=No(c.riders),r=a.length,s=Math.max(1,Math.ceil(r/pa));c.riderMenuPage=Math.min(s,Math.max(1,c.riderMenuPage));const n=(c.riderMenuPage-1)*pa,i=Math.min(r,n+pa),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(Rs(c.riderMenuTableSort.key))} ${c.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Jo()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(Zo).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(d=>`
                <tr class="team-detail-row">
                  ${t.map(l=>Is(d,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${c.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${c.riderMenuPage} / ${s} · Fahrer ${r===0?0:n+1}-${i} von ${r}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${c.riderMenuPage>=s?"disabled":""}>Weiter</button>
      </div>
    </div>`}function qo(){h("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&Ns(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;$a.includes(n)&&(c.riderMenuDetailPage=n,new Set(Ds().map(o=>o.sortKey).filter(o=>o!=null)).has(c.riderMenuTableSort.key)||(c.riderMenuTableSort={key:"name",direction:"asc"}),c.riderMenuPage=1,ja());return}const r=e.target.closest("button[data-riders-sort]");if(r){const n=r.dataset.ridersSort;c.riderMenuTableSort.key===n?c.riderMenuTableSort.direction=c.riderMenuTableSort.direction==="asc"?"desc":"asc":c.riderMenuTableSort={key:n,direction:Ms(n)},c.riderMenuPage=1,ja();return}const s=e.target.closest("button[data-riders-page-action]");if(s){const n=s.dataset.ridersPageAction,i=Math.max(1,Math.ceil(c.riders.length/pa));n==="prev"&&(c.riderMenuPage=Math.max(1,c.riderMenuPage-1)),n==="next"&&(c.riderMenuPage=Math.min(i,c.riderMenuPage+1)),ja();return}})}const ag=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:pa,getActiveRiderMenuTableColumns:Ds,getRiderMenuSortIndicator:Yo,initRidersListeners:qo,renderRiderMenuDetailPageTabs:Jo,renderRiderMenuTableHeader:Zo,renderRidersMenu:ja},Symbol.toStringTag,{value:"Module"})),Ha=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function at(e){return e==null?"free-agents":String(e)}function Un(e){var a;const t=c.riderTeamEditorPayload;return t?((a=t.teams.find(r=>r.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function rg(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return hi(t/11.2,0,100)}function sg(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function ng(e){return c.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function ig(e){const t=c.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${S(e.title)}"
        aria-label="${S(e.title)}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${ng(e.key)}
      </button>
    </th>`}function og(e,t){switch(c.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return re(e.firstName,t.firstName);case"lastName":return re(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return re(Un(e.teamId),Un(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return re(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return re(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function lg(e){const t=c.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>(og(a,r)||re(a.lastName,r.lastName)||re(a.firstName,r.firstName)||a.riderId-r.riderId)*t)}function dg(e){const t=c.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(r=>at(r.teamId)===t);return lg(a)}function cg(e){const t=c.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${at(a.teamId)}"${a.teamId===e?" selected":""}>${S(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function Xo(e){return c.riderTeamEditorDirtyRiderIds.includes(e)}function ug(e,t){const a=Xo(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${ns(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${cg(e.teamId)}</select></td>`;case"number":{const r=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${r}"></td>`}case"text":{const r=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${S(r)}"></td>`}default:return"<td>–</td>"}}function mg(e){const t=[...e.teams].sort((a,r)=>a.rank-r.rank||re(a.name,r.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${c.riderTeamEditorSelectedTeamKey===at(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${at(a.teamId)}">
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
    </aside>`}function Ge(){var o;const e=h("rider-team-editor-root"),t=h("rider-team-editor-meta"),a=c.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const r=c.riderTeamEditorSelectedTeamKey?a.teams.find(d=>at(d.teamId)===c.riderTeamEditorSelectedTeamKey)??null:null,s=dg(a),n=c.riderTeamEditorDirtyRiderIds.length,i=r==null?"Kein Team gewählt":`${r.riderCount} Fahrer · Ø ${r.averageOverall!=null?r.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${r.rank}`;t.textContent=r==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${r.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${c.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(d=>`
                  <option value="${at(d.teamId)}"${c.riderTeamEditorSelectedTeamKey===at(d.teamId)?" selected":""}>${S(d.name)} (${d.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${S(c.riderTeamEditorSort.key==="teamName"?"Team":((o=Ha.find(d=>d.key===c.riderTeamEditorSort.key))==null?void 0:o.title)??c.riderTeamEditorSort.key)} ${c.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${Ha.map(ig).join("")}
                </tr>
              </thead>
              <tbody>
                ${s.length===0?`<tr><td colspan="${Ha.length}" class="text-muted">${c.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:s.map(d=>`
                    <tr class="team-detail-row${Xo(d.riderId)?" rider-team-editor-row-dirty":""}">
                      ${Ha.map(l=>ug(d,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${mg(a)}
    </div>`}function pg(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),d=o.length===0?null:Math.round(o.reduce((l,p)=>l+p.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:d,rank:0}}),r=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:r.length,averageOverall:r.length===0?null:Math.round(r.reduce((i,o)=>i+o.overallRating,0)/r.length*100)/100,rank:0,isFreeAgents:!0});const s=[...a].sort((i,o)=>{const d=i.averageOverall??-1;return(o.averageOverall??-1)-d||o.riderCount-i.riderCount||re(i.name,o.name)}),n=new Map(s.map((i,o)=>[at(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(at(i.teamId))??a.length}))}async function Qo(e=!1){if(c.riderTeamEditorPayload&&!e){Ge();return}h("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await V.getRiderTeamEditor();if(!t.success||!t.data){h("rider-team-editor-root").innerHTML=`<div class="results-empty">${S(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}c.riderTeamEditorPayload=t.data,c.riderTeamEditorDirtyRiderIds=[],c.riderTeamEditorSaving=!1,c.riderTeamEditorExporting=!1,c.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(r=>at(r.teamId)===c.riderTeamEditorSelectedTeamKey)||(c.riderTeamEditorSelectedTeamKey="")),Ge()}function gg(e,t,a){const r=c.riderTeamEditorPayload;if(!r)return;const s=r.riders.find(n=>n.riderId===e);s&&(t==="teamId"?s.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof s[t]=="number"?s[t]=Number.parseInt(a||"0",10):s[t]=a,s.overallRating=rg(s),r.teams=pg(r),c.riderTeamEditorDirtyRiderIds.includes(e)||(c.riderTeamEditorDirtyRiderIds=[...c.riderTeamEditorDirtyRiderIds,e]),Ge())}async function fg(){if(!c.riderTeamEditorPayload||c.riderTeamEditorSaving)return;c.riderTeamEditorSaving=!0,Ge();const e=await V.saveRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Ge();return}c.riderTeamEditorPayload=e.data,c.riderTeamEditorDirtyRiderIds=[],Ge()}async function hg(){if(!c.riderTeamEditorPayload||c.riderTeamEditorExporting)return;c.riderTeamEditorExporting=!0,Ge();const e=await V.exportRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Ge();return}jr(e.data.fileName,e.data.content),Ge()}function bg(){h("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const s=t.dataset.riderTeamEditorSort;c.riderTeamEditorSort.key===s?c.riderTeamEditorSort.direction=c.riderTeamEditorSort.direction==="asc"?"desc":"asc":c.riderTeamEditorSort={key:s,direction:sg(s)},Ge();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){c.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Ge();return}const r=e.target.closest("button[data-rider-team-editor-action]");if(r){const s=r.dataset.riderTeamEditorAction;if(s==="reload"){Qo(!0);return}if(s==="export"){hg();return}s==="save"&&fg()}}),h("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){c.riderTeamEditorSelectedTeamKey=t.value,Ge();return}const a=e.target.closest(".rider-team-editor-input");if(a){const r=Number(a.dataset.riderTeamEditorRiderId),s=a.dataset.riderTeamEditorField;Number.isFinite(r)&&s&&gg(r,s,a.value)}})}let nt={key:"pickNumber",asc:!0};function Yn(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),r=.26+t*.18,s=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${r};--rider-stats-pill-bg-alpha:${s};`}async function el(e,t=!1){const a=await V.getDraftHistory(e);if(!a.success){c.draftHistory=null,Me("draft")&&es(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}c.draftHistory=a.data??null,Me("draft")&&es()}function es(){const e=h("draft-table-container"),t=h("draft-season-select");if(!c.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const i=c.currentSave.startSeason??2026;for(let o=c.currentSave.currentSeason;o>=i;o--){const d=document.createElement("option");d.value=o.toString(),d.textContent=`Saison ${o}`,t.appendChild(d)}c.draftSelectedSeason||(c.draftSelectedSeason=c.currentSave.currentSeason),t.value=c.draftSelectedSeason.toString(),t.onchange=o=>{const d=o.target;c.draftSelectedSeason=parseInt(d.value,10),el(c.draftSelectedSeason)}}if(!c.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(c.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...c.draftHistory.rows].sort((i,o)=>{let d=0;const l=nt.key;return l==="riderLastName"?d=i.riderLastName.localeCompare(o.riderLastName):l==="teamName"?d=i.teamName.localeCompare(o.teamName):l==="oldTeamName"?d=(i.oldTeamName||"").localeCompare(o.oldTeamName||""):l==="countryCode"?d=i.countryCode.localeCompare(o.countryCode):d=(i[l]??0)-(o[l]??0),nt.asc?d:-d}),r=i=>nt.key!==i?'<span class="sort-icon-placeholder"></span>':nt.asc?" ▲":" ▼",s=i=>{nt.key===i?nt.asc=!nt.asc:(nt.key=i,nt.asc=!0),es()};window.setDraftSort=s;let n=`
    <table class="data-table">
      <thead>
        <tr>
          <th class="sortable text-center" onclick="setDraftSort('pickNumber')">Pick${r("pickNumber")}</th>
          <th class="sortable text-center" onclick="setDraftSort('draftRound')">Runde${r("draftRound")}</th>
          <th class="sortable" onclick="setDraftSort('teamName')">Neues Team${r("teamName")}</th>
          <th class="sortable" onclick="setDraftSort('oldTeamName')">Altes Team${r("oldTeamName")}</th>
          <th class="sortable text-center" onclick="setDraftSort('countryCode')">Land${r("countryCode")}</th>
          <th class="sortable" onclick="setDraftSort('riderLastName')">Fahrer${r("riderLastName")}</th>
          <th class="sortable text-center" onclick="setDraftSort('riderBirthYear')">Alter${r("riderBirthYear")}</th>
          <th class="sortable text-center" onclick="setDraftSort('contractLength')">Vertrag${r("contractLength")}</th>
          <th class="sortable text-center" onclick="setDraftSort('overallAtDraft')">Stärke${r("overallAtDraft")}</th>
          <th class="sortable text-center" onclick="setDraftSort('potOverallAtDraft')">Potenzial${r("potOverallAtDraft")}</th>
        </tr>
      </thead>
      <tbody>
  `;for(const i of a){const o=c.draftHistory.season-i.riderBirthYear;let d="-";i.oldTeamName&&(d=`<div style="display:flex; align-items:center; gap:0.5rem;">${Nt(i.oldTeamId,i.oldTeamName)} ${S(i.oldTeamName)}</div>`);const l=`<div style="display:flex; align-items:center; gap:0.5rem;">${Nt(i.teamId,i.teamName)} ${S(i.teamName)}</div>`;n+=`
      <tr>
        <td class="text-center">#${i.pickNumber}</td>
        <td class="text-center">Runde ${i.draftRound}</td>
        <td>${l}</td>
        <td>${d}</td>
        <td class="text-center">${de(i.countryCode)}</td>
        <td>${S(i.riderFirstName)} ${S(i.riderLastName)}</td>
        <td class="text-center">${o} J.</td>
        <td class="text-center">${i.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Yn(i.overallAtDraft)}">${i.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Yn(i.potOverallAtDraft)}">${i.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}n+="</tbody></table>",e.innerHTML=n}async function yg(e=!1){const t=await V.getInjuries();if(!t.success){c.injuries=null,Me("injuries")&&Zn(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}c.injuries=t.data??[],Me("injuries")&&Zn()}function Zn(){const e=h("injuries-table-container");if(!c.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(h("injuries-meta").textContent=c.injuries.length+" Ausfälle",c.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=qt;let t="";const a=c.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),r=new Map;for(const n of a){const i=n.teamId;r.has(i)||r.set(i,[]),r.get(i).push(n)}for(const n of r.keys())r.get(n).sort((i,o)=>o.overallRating-i.overallRating);const s=Array.from(r.keys()).sort((n,i)=>{const o=r.get(n)[0].teamAbbreviation||"",d=r.get(i)[0].teamAbbreviation||"";return o.localeCompare(d)});if(s.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of s){const i=r.get(n),o=i[0].teamAbbreviation;t+=`
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
      `;for(const d of i){const l=d.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let p="";if(d.fitDate){const u=ie(d.fitDate);if(d.missedRaces&&d.missedRaces.length>0){let m="";for(const f of d.missedRaces)m+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${ie(f.startDate)}</span>
                  ${de(f.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${S(f.name)}</strong>
                  ${ys(f.categoryName)}
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
            <td>${de(d.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${d.riderId})" style="color: inherit; text-decoration: none;"><strong>${S(d.riderFirstName)} ${S(d.riderLastName)}</strong></a></td>
            <td>${d.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${vo(d.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${d.unavailableDays} Tage</strong></td>
            <td>${p}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function Jn(e){return e===0?"–":`-${e}`}function vg(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${lt(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${_e(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function Sg(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${S(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${vg(e.topRiders)}
      </div>
    </div>`}function kg(e,t){const a=t.filter(r=>r.teamId!=null&&e.teamId!=null&&r.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
      ${a.map(r=>`
        <div class="season-standings-country-popover-grid">
          <strong>${r.rank}</strong>
          <span class="results-flag-col-cell">${lt(r.countryCode)}</span>
          <span class="season-standings-country-rider-name">${_e(r.riderName??"–",{riderId:r.riderId,teamId:r.teamId,strong:!1})}</span>
          <strong>${r.points}</strong>
        </div>
      `).join("")}
    </div>`}function $g(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${ot(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${kg(e,t)}
      </div>
    </div>`}async function xg(e){const t=await V.getSeasonStandings();if(!t.success){c.seasonStandings=null,Me("season-standings")&&ts();return}c.seasonStandings=t.data??null,Me("season-standings")&&ts()}function ts(){var g,b,y,v,x,M;const e=h("season-standings-meta"),t=h("season-standings-scope-tabs"),a=h("season-standings-empty"),r=h("season-standings-table"),s=h("season-standings-tbody"),n=h("season-standings-jersey-header"),i=h("season-standings-primary-header"),o=h("season-standings-flag-header"),d=h("season-standings-secondary-header"),l=((g=c.seasonStandings)==null?void 0:g.season)??((b=c.gameState)==null?void 0:b.season)??((y=c.currentSave)==null?void 0:y.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.",t.innerHTML=`
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
  `;const p=c.selectedSeasonStandingScope==="countries",u=p?((v=c.seasonStandings)==null?void 0:v.countryStandings)??[]:c.selectedSeasonStandingScope==="teams"?((x=c.seasonStandings)==null?void 0:x.teamStandings)??[]:((M=c.seasonStandings)==null?void 0:M.riderStandings)??[],m=p?u:[],f=p?[]:u;if(n.textContent="Trikot",i.textContent=p?"Land":c.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",d.textContent=c.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",p),d.classList.toggle("hidden",p),!c.seasonStandings||u.length===0){s.innerHTML="",r.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}s.innerHTML=p?m.map(T=>`
      <tr>
        <td class="pos-${Math.min(T.rank,3)}">${T.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${Sg(T)}</td>
        <td class="results-flag-col-cell">${lt(T.countryCode)}</td>
        <td class="hidden"></td>
        <td>${T.points}</td>
        <td>${S(Jn(T.gapPoints))}</td>
      </tr>`).join(""):f.map(T=>{var L;const $=T.riderName??T.teamName,w=ra(T.teamId,T.teamName),C=c.selectedSeasonStandingScope==="teams"?$g(T,((L=c.seasonStandings)==null?void 0:L.riderStandings)??[]):sa($,!0,!1,T.riderId,T.teamId),E=lt(T.countryCode),F=c.selectedSeasonStandingScope==="teams"?S(T.countryName??T.countryCode??"–"):ot(T.teamName??"–",T.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(T.rank,3)}">${T.rank}</td>
          <td class="results-jersey-col-cell">${w}</td>
          <td>${C}</td>
          <td class="results-flag-col-cell">${E}</td>
          <td>${F}</td>
          <td>${T.points}</td>
          <td>${S(Jn(T.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),r.classList.remove("hidden")}function Tg(){h("season-standings-scope-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-season-scope]");if(!t)return;const a=t.dataset.seasonScope;a!=="riders"&&a!=="teams"&&a!=="countries"||(c.selectedSeasonStandingScope=a,ts())})}function qn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function wg(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,r=[...e].map(l=>({rider:l,score:t(l)})).sort((l,p)=>p.score-l.score).slice(0,10),s=[...e].map(l=>({rider:l,score:a(l)})).sort((l,p)=>p.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,p)=>p.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,p)=>p.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,p)=>p.score-l.score).slice(0,10),d=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,p)=>p.score-l.score).slice(0,10);return{Gesamtklassement:r,Sprinter:s,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:d}}function Mg(e,t){const a=c.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const r=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,s=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>r(o)):t==="Sprinter"?n=a.map(o=>s(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,d)=>d-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,d)=>o+d,0)/i.length}function Rg(e,t){var i;const r=c.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:Mg(o.id,t)}));r.sort((o,d)=>d.avgScore-o.avgScore);const s=r.findIndex(o=>o.teamId===e)+1,n=((i=r.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:s,total:r.length,average:n}}function Ig(e){const t=c.riders.filter(s=>s.activeTeamId===e);if(t.length===0)return 0;const a=t.map(s=>s.overallRating??0);a.sort((s,n)=>n-s);const r=a.slice(0,10);return r.length===0?0:r.reduce((s,n)=>s+n,0)/r.length}function Cg(e){var n;const a=c.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:Ig(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const r=a.findIndex(i=>i.teamId===e)+1,s=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:r,total:a.length,average:s}}function Ga(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function Dr(e){e.countryCode&&de(e.countryCode);const t=wg(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,p)=>p.formValue-l.formValue).slice(0,10),r=[...e.riders].map(l=>({rider:l,uciRank:ir(l.id)})).filter(l=>l.uciRank!==null).sort((l,p)=>l.uciRank-p.uciRank).slice(0,10),s=Object.entries(t).map(([l,p])=>{const u=Rg(e.teamId,l),m=u.average.toFixed(1).replace(".",","),f=p.map(({rider:g,score:b})=>{const y=`${g.firstName.charAt(0)}. ${g.lastName}`,v=_e(y,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),x=g.nationality?je[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,M=x?`<span class="fi fi-${x} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",T=c.riders.find(w=>w.id===g.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${Ga((T==null?void 0:T.roleId)??null).color};">
            ${M}
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
    `}).join(""),i=[...e.riders].sort((l,p)=>(p.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const p=`${l.firstName.charAt(0)}. ${l.lastName}`,u=_e(p,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),m=l.nationality?je[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=m?`<span class="fi fi-${m} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",g=l.overallRating.toFixed(0),b=c.riders.find(v=>v.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ga((b==null?void 0:b.roleId)??null).color};">
          ${f}
          ${u}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:p})=>{const u=`${l.firstName.charAt(0)}. ${l.lastName}`,m=_e(u,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?je[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",b=(p>=0?"+":"")+p.toFixed(1).replace(".",","),y=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,v=c.riders.find(M=>M.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ga((v==null?void 0:v.roleId)??null).color};">
          ${g}
          ${m}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${y}">${b}</span>
      </li>
    `}).join(""),d=r.map(({rider:l,uciRank:p})=>{const u=`${l.firstName.charAt(0)}. ${l.lastName}`,m=_e(u,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?je[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"";let b="rider-stats-rank-badge-gc";p===1?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":p===2?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":p===3&&(b="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const y=`<span class="rider-stats-rank-badge ${b}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${p}">${p}</span>`,v=c.riders.find(M=>M.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ga((v==null?void 0:v.roleId)??null).color};">
          ${g}
          ${m}
        </span>
        ${y}
      </li>
    `}).join("");return`
    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
        ${s}
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
  `}function _r(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${c.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${c.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${c.teamStatsTab==="contracts"?"true":"false"}">Auslaufende Verträge</button>
    </div>`}function Eg(e){const t=Array.from(new Set(e.topResults.map(m=>m.raceCategoryName).filter(Boolean)));t.sort((m,f)=>m.localeCompare(f,"de"));const a=Array.from(new Set(e.topResults.map(m=>m.season))).sort((m,f)=>f-m);let r=e.topResults.filter(m=>m.rowType!=="stage_result"?m.rowType==="gc_final"?c.teamStatsTopResultsFilters.gc:m.rowType==="mountain_final"?c.teamStatsTopResultsFilters.mountain:m.rowType==="points_final"?c.teamStatsTopResultsFilters.points:m.rowType==="youth_final"?c.teamStatsTopResultsFilters.youth:!0:m.profile==="TTT"||m.isStageRace||m.stageNumber!=null?c.teamStatsTopResultsFilters.stage:c.teamStatsTopResultsFilters.oneDay);if(c.teamStatsTopResultsFilterCategory){const m=c.teamStatsTopResultsFilterCategory;if(m.endsWith("-etappen")){const f=m.substring(0,m.length-8);r=r.filter(g=>g.raceCategoryName===f&&g.rowType==="stage_result")}else if(m.endsWith("-gc")){const f=m.substring(0,m.length-3);r=r.filter(g=>g.raceCategoryName===f&&g.rowType!=="stage_result")}else r=r.filter(f=>f.raceCategoryName===m)}c.teamStatsTopResultsFilterSeason!=null&&(r=r.filter(m=>m.season===c.teamStatsTopResultsFilterSeason)),r.sort((m,f)=>{if(f.seasonPoints!==m.seasonPoints)return f.seasonPoints-m.seasonPoints;const g=m.rowType!=="stage_result",b=f.rowType!=="stage_result",y=m.resultRank??9999,v=f.resultRank??9999;if(c.teamStatsTopResultsFilterCategory)return y!==v?y-v:g!==b?g?-1:1:0;{const x=qn(m.raceCategoryName),M=qn(f.raceCategoryName);return x!==M?x-M:g!==b?g?-1:1:y-v}});const s=20,n=Math.max(1,Math.min(10,Math.ceil(r.length/s)));c.teamStatsTopResultsPage>n&&(c.teamStatsTopResultsPage=n);const i=(c.teamStatsTopResultsPage-1)*s,o=r.slice(i,i+s),l=`
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
  `,p=o.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(m=>{const f=m.rowType!=="stage_result",g=f?`${m.raceName} · ${m.rowType==="gc_final"?"Gesamtwertung":m.rowType==="points_final"?"Punktewertung":m.rowType==="mountain_final"?"Bergwertung":"Nachwuchs"}`:m.stageNumber?`${m.raceName} · Etappe ${m.stageNumber}`:m.raceName;let b="–",y="–";m.finishStatus==="otl"?b=_t("OTL","place"):m.finishStatus==="dnf"?b=_t("DNF","place"):m.resultRank==null||(f?y=`<span class="rider-stats-final-type ${m.rowType==="gc_final"?"is-gc":m.rowType==="points_final"?"is-points":m.rowType==="mountain_final"?"is-mountain":"is-youth"}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${m.resultRank}</span>`:b=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${m.resultRank<=3?` rider-stats-rank-badge-top-${m.resultRank}`:""}">${S(String(m.resultRank))}</span>`);const v=m.profile?Ta(m.profile):"–",x=!f&&m.stageScore!=null&&m.stageScore>0?hr(m.stageScore,0,350):"–",M=nr(m.raceCategoryName),T=m.riderCountryCode?je[m.riderCountryCode]??m.riderCountryCode.slice(0,2).toLowerCase():null,$=T?`<span class="fi fi-${T} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(m.riderCountryCode??"")}"></span>`:"–",w=_e(m.riderName,{riderId:m.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${b}</td>
            <td>${y}</td>
            <td>${$}</td>
            <td style="white-space: nowrap;">${w}</td>
            <td><strong>${S(g)}</strong></td>
            <td class="status-cell">${Ss(m)}</td>
            <td>${v}</td>
            <td>${x}</td>
            <td>${M}</td>
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
  `}function Fg(e){const t=String(c.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,superteamCount:0,categories:{}},r=t==="all",s=u=>r?u:"–",n=(u,m)=>r?`${u} / ${m} T`:"–",i=r?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(u,m,f,g)=>{const b=typeof u=="number"?u:parseFloat(String(u))||0;let y="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return b===0?y+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":m==="gold"?y+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":m==="silver"?y+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":m==="bronze"?y+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":m==="purple"?y+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":m==="green"?y+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":m==="red"?y+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":m==="white"&&(y+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${y}" title="${S(f)}: ${b} Siege">${u}</span>`},d=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #fff;">Karrierestatistiken (Team)</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="team-stats-success-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
        <select id="team-stats-success-season-select" class="form-control" style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">
          <option value="all" ${r?"selected":""}>Ewig (All-Time)</option>
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
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Ausreißer-Kms</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #c084fc; line-height: 1.25;">${Math.round(a.breakawayKms??0)}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">km</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${r?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Attacken</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #ffd700;">${s(a.attacks)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${r?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Konterattacken</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e67e22;">${s(a.counterAttacks)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${r?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Stürze</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #e74c3c;">${s(a.crashes)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);" ${r?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Defekte</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #95a5a6;">${s(a.defects)}</div>
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
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;" ${r?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Krankheiten</div>
          <div style="font-size: 1.35rem; font-weight: bold; color: #ed64a6; line-height: 1.25;">${n(a.illnesses,a.illnessDays)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;" ${r?"":i}>
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Verletzungen</div>
          <div style="font-size: 1.35rem; font-weight: bold; color: #f6ad55; line-height: 1.25;">${n(a.injuries,a.injuryDays)}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Heimvorteil</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #38bdf8; line-height: 1.25;">${a.homeAdvantageDays??0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Heimbonus</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #facc15; line-height: 1.25;">${a.superHomeAdvantageDays??0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Heimmalus</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fb7185; line-height: 1.25;">${a.homePressureDays??0}</div>
          <div style="font-size: 0.85rem; font-weight: 500; color: #cbd5e0; line-height: 1.25;">Tage</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Superteam</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #6366f1;">${a.superteamCount??0}</div>
        </div>
      </div>

      <!-- Categories details -->
      <h3 style="margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; font-weight: 500; font-size: 1.15rem; color: #fff;">Ergebnisse nach Rennklasse</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 1.25rem;">
        ${d.map(u=>{const m=a.categories[u.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(u.name)}">${S(u.name)}</span>
                ${ys(u.key)}
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
                  ${le(m.winFlat||0,"flat","Flach (Flat)")}
                  ${le(m.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${le(m.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${le(m.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${le(m.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${le(m.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${le(m.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${le(m.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${le(m.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${le(m.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${le(m.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${we(m.winWeather1||0,1,"Sonnig")}
                  ${we(m.winWeather2||0,2,"Extreme Hitze")}
                  ${we(m.winWeather3||0,3,"Leichter Regen")}
                  ${we(m.winWeather4||0,4,"Starkregen")}
                  ${we(m.winWeather5||0,5,"Starker Wind")}
                  ${we(m.winWeather6||0,6,"Dichter Nebel")}
                  ${we(m.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${ae.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${m.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}function Pg(e){var s;const t=((s=c.gameState)==null?void 0:s.season)??new Date().getFullYear(),a=[...e.riders].sort((n,i)=>{const o=n.contractEndSeason??9999,d=i.contractEndSeason??9999;return o!==d?o-d:i.overallRating-n.overallRating});return`
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
            ${a.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Vertragsdaten verfügbar.</td></tr>':a.map(n=>{const i=n.nationality?je[n.nationality]??n.nationality.slice(0,2).toLowerCase():null,o=i?`<span class="fi fi-${i} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(n.nationality)}"></span>`:"–",d=_e(`${n.firstName} ${n.lastName}`,{riderId:n.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),l=c.riders.find(b=>b.id===n.id),p=`<span class="results-roster-overall-badge" style="color:${Xn(n.overallRating)}" title="Stärke: ${n.overallRating.toFixed(2)}">${n.overallRating.toFixed(1)}</span>`;let u="–";l&&l.potential!=null&&(u=`<span class="results-roster-overall-badge" style="color:${Xn(l.potential)}" title="Potential: ${l.potential.toFixed(2)}">${l.potential.toFixed(1)}</span>`);const m=n.contractEndSeason===t,f=n.contractEndSeason?`Saison ${n.contractEndSeason}`:"Ohne Vertrag",g=m?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${S(f)}</span>`:`<span style="font-weight: 500;">${S(f)}</span>`;return`
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
  `}function Xn(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function Rt(e){return c.teamStatsTab==="career"?`
      ${Dr(e)}
      ${_r()}
      ${Fg(e)}
    `:c.teamStatsTab==="contracts"?`
      ${Dr(e)}
      ${_r()}
      ${Pg(e)}
    `:`
    ${Dr(e)}
    ${_r()}
    ${Eg(e)}
  `}function Ng(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((r=c.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${S(a)}" aria-label="${S(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S(pi(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function tl(e){c.teamStatsSelectedTeamId=e,c.teamStatsTab="topResults",c.teamStatsTopResultsFilterCategory=null,c.teamStatsTopResultsFilterSeason=null,c.teamStatsSelectedSeason="all",c.teamStatsTopResultsPage=1;const t=c.teams.find(n=>n.id===e);h("team-stats-title").innerHTML=t?`Team <strong>${S(t.name)}</strong>`:"Teamstatistik",h("team-stats-jersey").innerHTML=Ng(e,(t==null?void 0:t.name)??"");const a=Cg(e),r=a.average.toFixed(2).replace(".",",");h("team-stats-meta").innerHTML=t?`${S(t.abbreviation)} · ${S(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${r})`:"Daten werden geladen",h("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,Qe("teamStats");const s=await V.getTeamStats(e);if(c.teamStatsSelectedTeamId===e){if(!s.success||!s.data){h("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}c.teamStatsPayload=s.data,h("team-stats-body").innerHTML=Rt(s.data)}}function Lg(){h("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-stats-tab]");if(a){const s=a.dataset.teamStatsTab;(s==="topResults"||s==="career"||s==="contracts")&&(c.teamStatsTab=s,c.teamStatsPayload&&(h("team-stats-body").innerHTML=Rt(c.teamStatsPayload)));return}const r=t.closest("button[data-team-top-results-page]");if(r){const s=Number(r.dataset.teamTopResultsPage);!isNaN(s)&&s>=1&&(c.teamStatsTopResultsPage=s,c.teamStatsPayload&&(h("team-stats-body").innerHTML=Rt(c.teamStatsPayload)));return}}),h("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;c.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=Rt(c.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;c.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=Rt(c.teamStatsPayload))}else if(t.classList.contains("team-stats-filter-checkbox")){const a=t,r=a.dataset.filterType;c.teamStatsTopResultsFilters[r]=a.checked,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=Rt(c.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;c.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),c.teamStatsPayload&&(h("team-stats-body").innerHTML=Rt(c.teamStatsPayload))}})}let Kt="riders",ct="season",_s="season",Xe="";const cr=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function Dg(){const e=h("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");Ag(o)})})}const t=h("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");Bg(o)})})}cr.forEach(n=>{const i=h(n);i&&i.addEventListener("change",()=>{const o=i.value;o?Hg(o,n):cr.some(l=>{const p=h(l);return p&&p.value!==""})||(Xe="",Xt())})}),window.openRiderStatsFromLeaderboard=qt;const a=h("leaderboard-filter-wt"),r=h("leaderboard-filter-pt"),s=h("leaderboard-filter-other");[a,r,s].forEach(n=>{n&&n.addEventListener("change",()=>{Xt()})})}function _g(){Xt()}function Ag(e){Kt=e;const t=h("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&((Gg(Xe)||Xe==="strongest_lieutenants")&&(zg(),Xe=""),ct==="live"&&(ct=_s,Oa())),Xt()}function Bg(e){ct=e,_s=e,Xt()}function Hg(e,t){Xe=e,cr.forEach(a=>{if(a!==t){const r=h(a);r&&(r.value="")}}),al(e)?(ct="live",Oa()):As(e)?(ct="alltime",Oa()):(ct=_s,Oa()),Xt()}function al(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function As(e){return["max_short_term_fatigue","max_long_term_fatigue","max_combined_fatigue","max_s_form","max_r_form","max_combined_form","mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function Gg(e){return al(e)||As(e)||e==="mentors_ranking"}function zg(){cr.forEach(e=>{const t=h(e);t&&(t.value="")})}function Oa(){const e=h("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');ct==="live"?e.style.display="none":(e.style.display="flex",As(Xe)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),ct==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function Xt(){var u,m,f;const e=h("leaderboard-empty"),t=h("leaderboard-table"),a=h("leaderboard-thead"),r=h("leaderboard-tbody");if(!e||!t||!a||!r)return;const s=h("leaderboard-filter-container");if(s&&(s.style.display=Kt==="teams"?"none":"flex"),!Xe){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await V.getLeaderboards(Kt,Xe,ct);if(!Me("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(Kt==="riders"){const g=((u=h("leaderboard-filter-wt"))==null?void 0:u.checked)??!0,b=((m=h("leaderboard-filter-pt"))==null?void 0:m.checked)??!0,y=((f=h("leaderboard-filter-other"))==null?void 0:f.checked)??!1;if(i=n.data.filter(v=>{const x=v.teamDivisionId===1&&!v.isRetired,M=v.teamDivisionId===2&&!v.isRetired,T=v.teamDivisionId===null||v.teamDivisionId===void 0||v.isRetired||v.teamDivisionId!==1&&v.teamDivisionId!==2;return!!(x&&g||M&&b||T&&y)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const o=Xe==="highest_leadout_bonus",d=Xe==="strongest_lieutenants";Kt==="riders"?a.innerHTML=`
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
    `;let l="",p=1;for(const g of i){const b=p++,v=`<span class="badge ${b===1?"badge-primary":b<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${b}</span>`,x=Nt(g.teamId,g.teamName);let M="";if(o){const $=g.stageNumber!=null?`Etappe ${g.stageNumber}`:"–";M=`<td style="vertical-align: middle;">${S(g.raceName??"–")} · ${S($)} · ${S(String(g.season??"–"))}</td>`}let T="";if(d)if(g.lieutenantDetails){const $=g.lieutenantDetails,w=$.leaderNationality?de($.leaderNationality):"",C=$.leaderRoleName?` (${$.leaderRoleName})`:"";T=`
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${w}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${$.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${S($.leaderFirstName)} ${S($.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${S(C)}</span>
            </span>
          </td>
        `}else T='<td style="vertical-align: middle;">–</td>';if(Kt==="riders"){const $=g.nationality?de(g.nationality):"—",w=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${g.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.firstName)} ${S(g.lastName)}</a>`,C=g.teamAbbr?`<span class="text-muted" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</span>`:"—";l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${v}</td>
          <td style="text-align: center; vertical-align: middle;">${x}</td>
          <td style="text-align: center; vertical-align: middle;">${$}</td>
          <td style="vertical-align: middle;">${w}</td>
          <td style="vertical-align: middle;">${C}</td>
          ${M}
          ${T}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}else{let $="";if(g.leadoutDetails){const w=g.leadoutDetails,C=w.sprinterNationality?de(w.sprinterNationality):"";$=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">${S(g.teamName.split(" (Sprinter:")[0])}</div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${C}${S(w.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${w.contributors.map(E=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${E.nationality?de(E.nationality):""}${S(E.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${E.contribution.toFixed(2)})</span>
                  </div>
                `).join("")}
            </div>
          </div>
        `}else $=`<strong>${S(g.teamName??"")}</strong>`;l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${v}</td>
          <td style="text-align: center; vertical-align: middle;">${x}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${$}</td>
          ${M}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}}r.innerHTML=l}let Yt=2026,Ke=5,Qn=!1;const Kg=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function ei(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${r}`}function Wg(e){var s;const t=(s=c.gameState)==null?void 0:s.currentDate;if(!t||e<=t)return;const a=ie(e);confirm(`Möchtest du automatisch bis zum ${a} simulieren?`)&&(c.autoProgressTargetDate=e,Uo())}function jg(e,t){const a=[],r=new Date(e,t,1),s=new Date(e,t+1,0);let i=(r.getDay()+6)%7;const o=new Date(r);o.setDate(o.getDate()-i);const d=new Date(o);for(;d<=s||d.getDay()!==1;){const l=[];for(let p=0;p<7;p++)l.push(new Date(d)),d.setDate(d.getDate()+1);a.push(l)}return a}function Og(){if(Qn)return;Qn=!0,h("calendar-prev-month").addEventListener("click",()=>{Ke--,Ke<0&&(Ke=11,Yt--),Va()}),h("calendar-next-month").addEventListener("click",()=>{Ke++,Ke>11&&(Ke=0,Yt++),Va()}),h("calendar-today-btn").addEventListener("click",()=>{var t;if((t=c.gameState)!=null&&t.currentDate){const[a,r]=c.gameState.currentDate.split("-").map(Number);Yt=a,Ke=r-1}Va()}),h("calendar-race-search").addEventListener("input",()=>{rl()}),h("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&Xr(s);return}const r=t.target.closest("[data-calendar-date]");if(r){const s=r.dataset.calendarDate;s&&Wg(s)}}),h("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const s=Number(a.dataset.dashboardRaceId);Number.isFinite(s)&&Xr(s);return}const r=t.target.closest("button[data-dashboard-race-participants-id]");if(r){const s=Number(r.dataset.dashboardRaceParticipantsId);Number.isFinite(s)&&jo(s)}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.remove("calendar-highlight")})}},!0))}function Vg(){var e;if((e=c.gameState)!=null&&e.currentDate){const[t,a]=c.gameState.currentDate.split("-").map(Number);Yt=t,Ke=a-1}Va()}function Va(){var s;if(!Me("calendar"))return;h("calendar-month-label").textContent=`${Kg[Ke]} ${Yt}`;const e=jg(Yt,Ke),t=h("calendar-weeks"),a=((s=c.gameState)==null?void 0:s.currentDate)??"";let r="";for(const n of e){const i=n.map(ei),o=[];for(const u of c.races)if(u.startDate<=i[6]&&u.endDate>=i[0]){const m=u.startDate<i[0]?0:i.indexOf(u.startDate),f=u.endDate>i[6]?6:i.indexOf(u.endDate);o.push({race:u,startIdx:m,endIdx:f})}o.sort((u,m)=>{const f=u.endIdx-u.startIdx+1,g=m.endIdx-m.startIdx+1;return g!==f?g-f:u.startIdx-m.startIdx});const d=Array.from({length:3},()=>Array(7).fill(!1));for(const u of o){let m=2;for(let f=0;f<3;f++){let g=!0;for(let b=u.startIdx;b<=u.endIdx;b++)if(d[f][b]){g=!1;break}if(g){m=f;break}}for(let f=u.startIdx;f<=u.endIdx;f++)d[m][f]=!0;u.slot=m}const l=n.map(u=>{const m=ei(u),f=u.getMonth()!==Ke,g=m===a,b=m>a;return`
        <div class="${["calendar-day-cell",f?"other-month":"",g?"today":"",b?"is-future":""].filter(Boolean).join(" ")}" data-calendar-date="${m}">
          <span class="calendar-day-number" data-calendar-date="${m}">${u.getDate()}</span>
        </div>
      `}).join(""),p=o.map(u=>{var M;const m=u.race,f=a>=m.startDate&&a<=m.endDate,g=a>m.endDate,b=ut((M=m.category)==null?void 0:M.name),y=f?'<span class="calendar-live-dot"></span>':"",v=g?"opacity: 0.55;":"",x=u.endIdx-u.startIdx+1;return`
        <div class="calendar-event-bar ${f?"is-live":""}"
             data-race-id="${m.id}"
             style="grid-column: ${u.startIdx+1} / span ${x};
                    grid-row: ${u.slot+1};
                    background-color: ${b.background};
                    border: 1px solid ${b.border};
                    color: ${b.color};
                    ${v}"
             title="${S(m.name)} (${ie(m.startDate)} - ${ie(m.endDate)})">
          ${y}<span class="calendar-event-name">${S(m.name)}</span>
        </div>
      `}).join("");r+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${p}</div>
      </div>
    `}t.innerHTML=r,rl()}function rl(){var n;const e=h("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=h("calendar-races-tbody"),r=((n=c.gameState)==null?void 0:n.currentDate)??"",s=c.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(s.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=s.map(i=>{var y,v,x,M;const o=r>=i.startDate&&r<=i.endDate,l=r>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',p=((y=i.country)==null?void 0:y.name)??`Land ${i.countryId}`,u=(v=i.country)!=null&&v.code3?de(i.country.code3):"",m=i.isStageRace?(i.stages??[]).reduce((T,$)=>T+($.distanceKm??0),0):((x=i.upcomingStage)==null?void 0:x.distanceKm)??null,f=i.isStageRace?(i.stages??[]).reduce((T,$)=>T+($.elevationGainMeters??0),0):((M=i.upcomingStage)==null?void 0:M.elevationGainMeters)??null,g=m!=null?String(m.toFixed(1)).replace(".",","):"-",b=f!=null?String(Math.round(f)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${ie(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${S(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${Es(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${u}<span>${S(p)}</span></span></td>
        <td>${br(i)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${i.id}">Teilnehmer</button></td>
        <td>${g}</td>
        <td>${b}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}let bt=null,yt=null,We="id",ga=!0;function Bt(e){const t=new Date(e);t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));const a=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t.getTime()-a.getTime())/864e5+1)/7)}function kr(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return"peak";const r=n=>{const i=n-8,o=n-1;if(i>=1)return t>=i&&t<=o;{const d=i+53;return t>=d||t<=o}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)?"prep":"none"}function sl(e){return e==="peak"?"cell-peak":e==="prep"?"cell-prep":""}function ti(e,t){const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),d=`${n}-${i}-${o}`,l=Bt(d),p=kr(e,l);if(p==="peak"||p==="prep")return!0}return!1}function Ug(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return!0;const r=s=>{const n=s-6,i=s-1;if(n>=1)return t>=n&&t<=i;{const o=n+53;return t>=o||t<=i}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)}function Yg(e,t){const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),d=`${n}-${i}-${o}`,l=Bt(d);if(Ug(e,l))return!0}return!1}function nl(e,t,a){const r=[{min:e.peak1_min,max:e.peak1_max},{min:e.peak2_min,max:e.peak2_max},{min:e.peak3_min,max:e.peak3_max}].sort((l,p)=>l.min-p.min);let s=0,n=0,i=0,o=0;const d=a.races.filter(l=>t.has(l.id));for(const l of d){const p=new Date(l.start_date),u=new Date(l.end_date);for(let m=new Date(p);m<=u;m.setDate(m.getDate()+1)){const f=m.getFullYear(),g=String(m.getMonth()+1).padStart(2,"0"),b=String(m.getDate()).padStart(2,"0"),y=`${f}-${g}-${b}`,v=Bt(y);v<=r[0].max?s++:v<=r[1].max?n++:v<=r[2].max?i++:o++}}return{phase1:s,phase2:n,phase3:i,phase4:o}}function Zg(e,t,a){const r=new Set(a.raceProgramRaces.filter(p=>p.program_id===e.id&&p.race_id!==t.id).map(p=>p.race_id)),s=nl(e,r,a),n=new Set,i=new Date(t.start_date),o=new Date(t.end_date),d=[{min:e.peak1_min,max:e.peak1_max},{min:e.peak2_min,max:e.peak2_max},{min:e.peak3_min,max:e.peak3_max}].sort((p,u)=>p.min-u.min);for(let p=new Date(i);p<=o;p.setDate(p.getDate()+1)){const u=p.getFullYear(),m=String(p.getMonth()+1).padStart(2,"0"),f=String(p.getDate()).padStart(2,"0"),g=`${u}-${m}-${f}`,b=Bt(g);b<=d[0].max?n.add("phase1"):b<=d[1].max?n.add("phase2"):b<=d[2].max?n.add("phase3"):n.add("phase4")}const l=t.is_stage_race===1;for(const p of n)if(p==="phase1"){if(l&&s.phase1>35||!l&&s.phase1>36)return!1}else if(p==="phase2"){if(l&&s.phase2>35||!l&&s.phase2>36)return!1}else if(p==="phase3"&&(l&&s.phase3>35||!l&&s.phase3>36))return!1;return!0}function Jg(e,t){const a=c.raceProgramsPayload;if(!a)return;const r=a.raceProgramRaces.findIndex(s=>s.program_id===e&&s.race_id===t);if(r===-1){const s=a.races.find(n=>n.id===t);if(s){const n=s.start_date,i=s.end_date,o=[];a.raceProgramRaces.forEach((d,l)=>{if(d.program_id===e&&d.race_id!==t){const p=a.races.find(u=>u.id===d.race_id);p&&p.start_date<=i&&p.end_date>=n&&o.push(l)}}),o.sort((d,l)=>l-d).forEach(d=>{a.raceProgramRaces.splice(d,1)})}a.raceProgramRaces.push({program_id:e,race_id:t})}else a.raceProgramRaces.splice(r,1);c.raceProgramsDirty=!0,Pe()}const as=(()=>{const e=[],t=new Date(2026,0,1),a=new Date(2026,11,31),r=["So","Mo","Di","Mi","Do","Fr","Sa"];for(let s=new Date(t);s<=a;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),d=`${n}-${i}-${o}`,l=`${r[s.getDay()]}, ${o}.${String(s.getMonth()+1).padStart(2,"0")}`;e.push({dateStr:d,label:l,weekNum:Bt(d)})}return e})();async function Bs(e=!1){if(c.raceProgramsPayload&&!e){Pe();return}h("race-programs-root").innerHTML='<div class="results-empty">Programmdaten werden geladen...</div>';const t=await V.getRaceProgramsEditor();if(!t.success||!t.data){h("race-programs-root").innerHTML=`<div class="results-empty text-danger">${S(t.error??"Fehler beim Laden.")}</div>`;return}c.raceProgramsPayload=t.data,c.raceProgramsDirty=!1,c.raceProgramsSaving=!1,bt=null,yt=null,Pe()}function qg(){h("view-race-programs").addEventListener("click",e=>{const t=e.target,a=t.closest(".results-type-btn[data-tab]");if(a){const u=a.dataset.tab??"calendar-cols";c.raceProgramsActiveTab=u,Pe();return}const r=t.closest(".race-programs-action-btn");if(r){const u=r.dataset.action;u==="reload"?Bs(!0):u==="save"&&tf();return}const s=t.closest(".race-row-expand-btn");if(s){const u=s.dataset.raceId,m=h(`race-details-row-${u}`);m&&(m.classList.toggle("hidden"),s.textContent=m.classList.contains("hidden")?"▶":"▼");return}const n=t.closest(".program-row-expand-btn");if(n){const u=n.dataset.programId,m=h(`program-details-row-${u}`);m&&(m.classList.toggle("hidden"),n.textContent=m.classList.contains("hidden")?"▶":"▼");return}const i=t.closest(".program-roles-sort-header");if(i){const u=i.dataset.sortKey;We===u?ga=!ga:(We=u,ga=u==="name"||u==="id"),Pe();return}const o=t.closest(".combo-origin-trigger");if(o){const u=o.dataset.raceId,m=o.dataset.comboKey,f=h(`combo-origin-${u}-${m}`);f&&f.classList.toggle("hidden");return}const d=t.closest(".race-popover-trigger");if(d){e.stopPropagation();const u=parseInt(d.dataset.raceId??"0",10);yt=null,bt===u?bt=null:bt=u,Pe();return}const l=t.closest(".race-rider-count-trigger");if(l){e.stopPropagation();const u=parseInt(l.dataset.raceId??"0",10);bt=null,yt===u?yt=null:yt=u,Pe();return}const p=t.closest(".popover-program-toggle");if(p){if(e.stopPropagation(),p.classList.contains("disabled"))return;const u=parseInt(p.dataset.programId??"0",10),m=parseInt(p.dataset.raceId??"0",10);Jg(u,m);return}!t.closest(".race-stages-popover-card")&&!t.closest(".race-rider-programs-popover-card")&&(bt!==null||yt!==null)&&(bt=null,yt=null,Pe())}),h("view-race-programs").addEventListener("click",e=>{const t=e.target.closest(".toggleable-race-cell[data-day]");if(!t)return;const a=t.dataset.day,r=parseInt(t.dataset.programId,10);ef(r,a)}),h("view-race-programs").addEventListener("change",e=>{const t=e.target;if(t.classList.contains("peak-date-picker")){const a=parseInt(t.dataset.programId,10),r=parseInt(t.dataset.peak,10),s=t.value;if(s){const n=Bt(s);Qg(a,r,n)}return}if(t.classList.contains("peak-number-input")){const a=parseInt(t.dataset.programId,10),r=t.dataset.field,s=parseInt(t.value||"1",10);Xg(a,r,s)}})}function Xg(e,t,a){const r=c.raceProgramsPayload;if(!r)return;const s=r.programs.find(i=>i.id===e);if(!s)return;const n=Math.max(1,Math.min(53,a));if(s[t]=n,t.endsWith("_min")){const i=t.replace("_min","_max");s[i]<n&&(s[i]=n)}else if(t.endsWith("_max")){const i=t.replace("_max","_min");s[i]>n&&(s[i]=n)}c.raceProgramsDirty=!0,Pe()}function Qg(e,t,a){const r=c.raceProgramsPayload;if(!r)return;const s=r.programs.find(o=>o.id===e);if(!s)return;const n=`peak${t}_min`,i=`peak${t}_max`;s[n]=Math.max(1,a-2),s[i]=Math.min(53,a+2),c.raceProgramsDirty=!0,Pe()}function ef(e,t){const a=c.raceProgramsPayload;if(!a)return;const r=a.races.filter(n=>n.start_date<=t&&n.end_date>=t);if(r.length===0)return;const s=a.raceProgramRaces.findIndex(n=>n.program_id===e&&r.some(i=>i.id===n.race_id));if(s===-1)a.raceProgramRaces.push({program_id:e,race_id:r[0].id});else{const n=a.raceProgramRaces[s],i=r.findIndex(o=>o.id===n.race_id);i<r.length-1?n.race_id=r[i+1].id:a.raceProgramRaces.splice(s,1)}c.raceProgramsDirty=!0,Pe()}async function tf(){if(!c.raceProgramsPayload||c.raceProgramsSaving)return;c.raceProgramsSaving=!0,Pe();const e=await V.saveRaceProgramsEditor({programs:c.raceProgramsPayload.programs,raceProgramRaces:c.raceProgramsPayload.raceProgramRaces});if(c.raceProgramsSaving=!1,!e.success){alert(`Fehler beim Speichern:
${e.error??"Unbekannter Fehler"}`),Pe();return}c.raceProgramsDirty=!1,Bs(!0)}function $r(e,t){let a=0,r=0,s=0;const n=new Set(t.raceProgramRaces.filter(o=>o.program_id===e.id).map(o=>o.race_id)),i=t.races.filter(o=>n.has(o.id));for(const o of i){const d=new Date(o.start_date),l=new Date(o.end_date);for(let p=new Date(d);p<=l;p.setDate(p.getDate()+1)){const u=p.getFullYear(),m=String(p.getMonth()+1).padStart(2,"0"),f=String(p.getDate()).padStart(2,"0"),g=Bt(`${u}-${m}-${f}`),b=kr(e,g);b==="peak"?a++:b==="prep"?r++:s++}}return{peak:a,prep:r,none:s}}function Pe(){const e=h("race-programs-root"),t=c.raceProgramsPayload;if(!t){e.innerHTML='<div class="results-empty">Keine Daten geladen.</div>';return}const a=window.scrollX,r=window.scrollY,s={},n=document.querySelector(".team-detail-table-scroll");n&&(s.table={scrollTop:n.scrollTop,scrollLeft:n.scrollLeft}),document.querySelectorAll(".popover-program-list-scroll").forEach(f=>{const g=f.getAttribute("data-race-id");g&&(s[`popover-${g}`]={scrollTop:f.scrollTop,scrollLeft:f.scrollLeft})});const o=c.raceProgramsDirty,d=c.raceProgramsSaving,l=c.raceProgramsActiveTab;let p=`
    <div class="race-programs-layout">
      <div class="race-programs-toolbar">
        <div class="results-type-tabs" style="margin: 0;">
          <button class="results-type-btn${l==="calendar-cols"?" active":""}" data-tab="calendar-cols">Kalender Programme (Spalten)</button>
          <button class="results-type-btn${l==="calendar-rows"?" active":""}" data-tab="calendar-rows">Kalender Programme (Zeilen)</button>
          <button class="results-type-btn${l==="peak-editor"?" active":""}" data-tab="peak-editor">Peak-Editor Programme</button>
          <button class="results-type-btn${l==="rider-role"?" active":""}" data-tab="rider-role">Rider-Role Programme</button>
          <button class="results-type-btn${l==="program-roles"?" active":""}" data-tab="program-roles">Programm-Rollen</button>
        </div>
        <div class="race-programs-actions">
          <button type="button" class="btn btn-secondary race-programs-action-btn" data-action="reload">Neu laden</button>
          <button type="button" class="btn btn-primary race-programs-action-btn" data-action="save" ${!o||d?"disabled":""}>
            ${d?"Speichert…":"Änderungen exportieren"}
          </button>
        </div>
      </div>
  `;l==="calendar-cols"?p+=af(t):l==="calendar-rows"?p+=rf(t):l==="peak-editor"?p+=sf(t):l==="rider-role"?p+=of(t):l==="program-roles"&&(p+=df(t)),p+="</div>",e.innerHTML=p;const u=document.querySelector(".team-detail-table-scroll");u&&s.table&&(u.scrollTop=s.table.scrollTop,u.scrollLeft=s.table.scrollLeft),document.querySelectorAll(".popover-program-list-scroll").forEach(f=>{const g=f.getAttribute("data-race-id");g&&s[`popover-${g}`]&&(f.scrollTop=s[`popover-${g}`].scrollTop,f.scrollLeft=s[`popover-${g}`].scrollLeft)}),window.scrollTo(a,r)}function af(e){var o,d,l;const t=e.programs,a=e.raceProgramRaces,r=e.races,s=t.map(p=>({id:p.id,stats:$r(p,e)}));let n=`<tr>
    <th class="sticky-col-header" style="z-index: 15;">Tag / Datum</th>
    <th style="width: 50px; text-align: center;">KW</th>
  `;for(const p of t){const u=(o=s.find(m=>m.id===p.id))==null?void 0:o.stats;n+=`
      <th style="min-width: 140px; text-align: center;">
        <div style="font-weight: bold; font-size: 0.9rem;">${S(p.name)}</div>
        <div class="text-muted" style="font-size: 0.72rem; margin-top: 0.15rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${u==null?void 0:u.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${u==null?void 0:u.prep}</span> | 
          O: <span>${u==null?void 0:u.none}</span>
        </div>
      </th>
    `}n+="</tr>";let i="";for(const p of as){const u=r.filter(y=>y.start_date<=p.dateStr&&y.end_date>=p.dateStr),m=u.length>0,f=m?"row-has-races":"";let g="";if(m){g='<div style="display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.15rem;">';for(const y of u){const v=ut((d=y.category)==null?void 0:d.name);g+=`
          <span class="race-id-badge" style="background-color: ${v.background}; border: 1px solid ${v.border}; color: ${v.color}; font-size: 0.65rem; padding: 0.05rem 0.2rem; text-align: left; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${S(y.name)}">
            ${S(y.name)}
          </span>
        `}g+="</div>"}let b=`
      <td class="sticky-col ${f}" style="font-weight: 600; vertical-align: top; padding: 0.4rem 0.6rem;">
        <div>${p.label}</div>
        ${g}
      </td>
      <td style="text-align: center; color: var(--text-500); font-variant-numeric: tabular-nums; vertical-align: top; padding-top: 0.4rem;">${p.weekNum}</td>
    `;for(const y of t){const v=kr(y,p.weekNum),x=sl(v),M=a.find(C=>C.program_id===y.id&&u.some(E=>E.id===C.race_id));let T="",$=`toggleable-race-cell ${x}`,w=`data-day="${p.dateStr}" data-program-id="${y.id}"`;if(M){const C=r.find(F=>F.id===M.race_id),E=ut((l=C==null?void 0:C.category)==null?void 0:l.name);T=`
          <span class="race-program-badge" style="background-color: ${E.background}; border: 1px solid ${E.border}; color: ${E.color};" title="${S(C==null?void 0:C.name)}">
            ${S(C==null?void 0:C.name)}
          </span>
        `}else m?T='<span class="race-cell-placeholder" title="Klicken zum Zuweisen">＋</span>':($=x,w="");b+=`<td class="${$}" ${w} style="text-align: center; vertical-align: middle;">${T}</td>`}i+=`<tr>${b}</tr>`}return`
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh;">
        <table class="data-table data-table-teams race-programs-calendar-table">
          <thead>
            ${n}
          </thead>
          <tbody>
            ${i}
          </tbody>
        </table>
      </div>
    </div>
  `}function rf(e){var f;const t=e.programs,a=e.raceProgramRaces,r=e.races;let s='<th class="sticky-col-header" style="z-index: 15;">Monat</th>',n='<th class="sticky-col-header" style="z-index: 15;">Tag / KW</th>',i='<th class="sticky-col-header" style="z-index: 15;">Rennen Anzahl</th>',o='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #1</th>',d='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #2</th>',l='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #3</th>';const p=[],u=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];for(const g of as){const b=parseInt(g.dateStr.split("-")[1],10)-1,y=u[b];p.length===0||p[p.length-1].name!==y?p.push({name:y,span:1}):p[p.length-1].span++;const v=r.filter(w=>w.start_date<=g.dateStr&&w.end_date>=g.dateStr),x=v.length>0,M=x?`${v.length} R`:"",T=x?"race-count-active":"";n+=`<th style="text-align: center; min-width: 40px; font-variant-numeric: tabular-nums;">
      <div style="font-size: 0.8rem; font-weight: bold;">${g.dateStr.split("-")[2]}</div>
      <div style="font-size: 0.65rem; color: var(--text-500);">W${g.weekNum}</div>
    </th>`,i+=`<th class="${T}" style="text-align: center; font-size: 0.72rem; font-weight: bold;">${M}</th>`;const $=w=>{var L;const C=v[w];if(!C)return"";const E=ut((L=C.category)==null?void 0:L.name),F=a.filter(_=>_.race_id===C.id).length;return`
        <span class="race-id-badge" style="background-color: ${E.background}; border: 1px solid ${E.border}; color: ${E.color}; cursor: help;" 
              title="${S(C.name)}
Zugelassene Programme: ${F}">
          R${C.id}
        </span>
      `};o+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(0)}</th>`,d+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(1)}</th>`,l+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(2)}</th>`}for(const g of p)s+=`<th colspan="${g.span}" style="text-align: center; font-weight: bold; border-left: 1px solid var(--border);">${g.name}</th>`;let m="";for(const g of t){const b=$r(g,e);let y=`
      <td class="sticky-col" style="z-index: 5; white-space: nowrap; font-weight: bold; border-right: 2px solid var(--border);">
        <div style="font-size: 0.85rem;">${S(g.name)}</div>
        <div class="text-muted" style="font-size: 0.7rem; font-weight: normal; margin-top: 0.1rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${b.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${b.prep}</span> | 
          O: <span>${b.none}</span>
        </div>
      </td>
    `;for(const v of as){const x=kr(g,v.weekNum),M=sl(x),T=r.filter(L=>L.start_date<=v.dateStr&&L.end_date>=v.dateStr),$=T.length>0,w=a.find(L=>L.program_id===g.id&&T.some(_=>_.id===L.race_id));let C="",E=`toggleable-race-cell ${M}`,F=`data-day="${v.dateStr}" data-program-id="${g.id}"`;if(w){const L=r.find(G=>G.id===w.race_id),_=ut((f=L==null?void 0:L.category)==null?void 0:f.name);C=`
          <span class="race-id-badge" style="background-color: ${_.background}; border: 1px solid ${_.border}; color: ${_.color};" title="${S(L==null?void 0:L.name)}">
            R${L==null?void 0:L.id}
          </span>
        `}else $?C='<span style="font-size: 0.72rem; color: var(--text-500); opacity: 0.5;">＋</span>':(E=M,F="");y+=`<td class="${E}" ${F} style="text-align: center; vertical-align: middle; padding: 0.35rem 0;">${C}</td>`}m+=`<tr>${y}</tr>`}return`
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh; overflow-x: auto;">
        <table class="data-table data-table-teams race-programs-calendar-table">
          <thead>
            <tr class="month-header-row">${s}</tr>
            <tr>${n}</tr>
            <tr style="background: rgba(148, 163, 184, 0.05);">${i}</tr>
            <tr>${o}</tr>
            <tr>${d}</tr>
            <tr>${l}</tr>
          </thead>
          <tbody>
            ${m}
          </tbody>
        </table>
      </div>
    </div>
  `}function sf(e){return`
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">ID</th>
              <th>Programm</th>
              <th>Peak 1 (KW Min / Max)</th>
              <th>Peak 2 (KW Min / Max)</th>
              <th>Peak 3 (KW Min / Max)</th>
              <th style="width: 100px; text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${e.programs.map(r=>{const s=[{min:r.peak1_min,max:r.peak1_max},{min:r.peak2_min,max:r.peak2_max},{min:r.peak3_min,max:r.peak3_max}].sort((p,u)=>p.min-u.min),n=s[1].min-s[0].max<8,i=s[2].min-s[1].max<8,d=n||i?'<span style="color: #f97316; font-size: 1.1rem; cursor: help;" title="Warnung: Peakbereiche liegen weniger als 8 Wochen auseinander!">⚠️</span>':'<span style="color: #22c55e;">✔ OK</span>',l=p=>{const u=r[`peak${p}_min`]??1,m=r[`peak${p}_max`]??1;return`
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <input type="number" class="peak-number-input form-control" data-program-id="${r.id}" data-field="peak${p}_min" min="1" max="53" value="${u}" style="width: 55px; text-align: center; padding: 0.2rem;">
          <span class="text-muted">–</span>
          <input type="number" class="peak-number-input form-control" data-program-id="${r.id}" data-field="peak${p}_max" min="1" max="53" value="${m}" style="width: 55px; text-align: center; padding: 0.2rem;">
          <input type="date" class="peak-date-picker form-control" data-program-id="${r.id}" data-peak="${p}" style="width: 40px; padding: 0.15rem; font-size: 0.8rem; cursor: pointer;" title="KW aus Datum berechnen (-2/+2 Wochen)">
        </div>
      `};return`
      <tr>
        <td style="font-weight: bold; color: var(--text-100);">${r.id}</td>
        <td style="font-weight: bold; min-width: 150px;">${S(r.name)}</td>
        <td>${l(1)}</td>
        <td>${l(2)}</td>
        <td>${l(3)}</td>
        <td style="text-align: center;">${d}</td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function nf(e,t){const a=t.filter(o=>o.race_id===e).sort((o,d)=>o.stage_number-d.stage_number);if(a.length===0)return{countHtml:"Keine Etappen",stagesListHtml:"Keine Etappendaten vorhanden."};const r={};for(const o of a)r[o.profile]=(r[o.profile]||0)+1;const n=Object.entries(r).sort((o,d)=>d[1]-o[1]).map(([o,d])=>`${S(o)}: ${d}x`).join("<br>"),i=a.map(o=>`
    <div class="popover-stage-row">
      <span class="popover-stage-num">Et. ${o.stage_number}:</span>
      <span class="popover-stage-profile">${S(o.profile)}</span>
    </div>
  `).join("");return{countHtml:n,stagesListHtml:i}}function of(e){const t=[...e.races].sort((i,o)=>i.start_date.localeCompare(o.start_date)),a=e.raceProgramRaces,r=e.stages,s=e.programDistribution;return`
    <div class="team-detail-card" style="margin-top: 1rem; position: relative;">
      <div class="team-detail-table-scroll" style="max-height: 75vh;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40px;"></th>
              <th>Startdatum</th>
              <th>Rennen</th>
              <th style="text-align: center;">Profil (1-Day)</th>
              <th style="text-align: center;">Fahrer gesamt</th>
              <th style="text-align: center;">Kapitän</th>
              <th style="text-align: center;">Co-Kapitän</th>
              <th style="text-align: center;">Sprinter</th>
              <th style="text-align: center;">Edelhelfer</th>
              <th style="text-align: center;">Starke Helfer</th>
              <th style="text-align: center;">Wasserträger</th>
            </tr>
          </thead>
          <tbody>
            ${t.map(i=>{const o=new Set(a.filter(I=>I.race_id===i.id).map(I=>I.program_id)),d=s.filter(I=>o.has(I.program_id)),u=e.programs.map(I=>{const N=a.some(gt=>gt.program_id===I.id&&gt.race_id===i.id),H=s.find(gt=>gt.program_id===I.id),Z=H?parseInt(H.deterministic_rider_count||"0",10):0,ne=H?parseInt(H.deterministic_role_Kapitaen||"0",10):0,fe=H?parseInt(H.deterministic_role_Co_Kapitaen||"0",10):0,pe=H?parseInt(H.deterministic_role_Edelhelfer||"0",10):0,$e=H?parseInt(H.deterministic_role_Starke_Helfer||"0",10):0,ye=H?parseInt(H.deterministic_role_Wassertraeger||"0",10):0,he=H?parseInt(H.deterministic_role_Sprinter||"0",10):0,ve=[];ne>0&&ve.push(`${ne} Kapitän`),fe>0&&ve.push(`${fe} Co-Kapitän`),pe>0&&ve.push(`${pe} Edelhelfer`),$e>0&&ve.push(`${$e} Starke Helfer`),ye>0&&ve.push(`${ye} Wasserträger`),he>0&&ve.push(`${he} Sprinter`);const Ue=ve.length>0?`(${ve.join(", ")})`:"",oe=$r(I,e),Qt=oe.peak+oe.prep+oe.none;return{program:I,isAssigned:N,count:Z,rolesStr:Ue,totalDays:Qt}}).sort((I,N)=>I.isAssigned!==N.isAssigned?I.isAssigned?-1:1:N.count-I.count).filter(I=>ti(I.program,i)||I.isAssigned).map(I=>{const N=I.program,H=ti(N,i);let Z="";H||(Z='<span style="color: #fb923c; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(251, 146, 60, 0.15); border: 1px solid #fb923c; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb der Peak- und Aufbauphase dieses Programms!">!</span>');let ne="";Yg(N,i)||(ne='<span style="color: #c084fc; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(192, 132, 252, 0.15); border: 1px solid #c084fc; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb des Peakbereichs und der 6-wöchigen Anstiegsphase dieses Programms!">!</span>');let pe="";Zg(N,i,e)||(pe='<span style="color: #38bdf8; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; border-radius: 50%; font-size: 0.65rem;" title="Achtung: Dieses Programm hat in diesem Saisonabschnitt bereits das Limit an Renntagen erreicht (max. 36 Tage bzw. 35 Tage für Rundfahrten)!">!</span>');let ye="";if(!I.isAssigned){const ea=a.filter(xe=>xe.program_id===N.id&&xe.race_id!==i.id).map(xe=>e.races.find(Tt=>Tt.id===xe.race_id)).filter(xe=>xe&&xe.start_date<=i.end_date&&xe.end_date>=i.start_date);if(ea.length>0){const xe=ea.map(Tt=>Tt.name).join(", ");ye=`<span style="color: #ef4444; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 50%; font-size: 0.65rem;" title="Kollision: Dieses Programm ist bereits einem zeitlich parallelen Rennen zugewiesen: ${S(xe)}!">!</span>`}}const he=I.isAssigned?"font-weight: bold; color: var(--text-100);":"color: var(--text-500);",ve=I.isAssigned?"☑":"☐",Ue=H||I.isAssigned,oe=Ue?"cursor: pointer;":"cursor: not-allowed; opacity: 0.4; pointer-events: none;";return`
        <div class="popover-program-toggle${Ue?"":" disabled"}" data-program-id="${N.id}" data-race-id="${i.id}" 
             style="${oe} padding: 0.45rem 0.6rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); transition: background-color 0.15s; white-space: nowrap;"
             onmouseover="${Ue?"this.style.backgroundColor='rgba(99, 102, 241, 0.08)'":""}"
             onmouseout="this.style.backgroundColor='transparent'">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
            <span style="font-size: 1.15rem; line-height: 1; user-select: none; color: ${I.isAssigned?"var(--accent-h)":"var(--text-500)"};">${ve}</span>
            <span style="${he} font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis;" title="${S(N.name)} (${I.totalDays} Renntage)">
              ${S(N.name)} (${I.totalDays} RT)
            </span>
            ${Z}
            ${ne}
            ${pe}
            ${ye}
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;">
            <strong style="font-size: 0.8rem; color: var(--accent-h);">${I.count} Fahrer</strong>
            <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal;" title="${S(I.rolesStr)}">${S(I.rolesStr)}</span>
          </div>
        </div>
      `}).join(""),m=yt===i.id;let f=0,g=0,b=0,y=0,v=0,x=0,M=0;const T={Kapitaen:{},Co_Kapitaen:{},Sprinter:{},Edelhelfer:{},Starke_Helfer:{},Wassertraeger:{}},$=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],w=["Berg","Hill","Sprint","Timetrial","Cobble","Attacker"];for(const I of d){f+=parseInt(I.deterministic_rider_count||"0",10),g+=parseInt(I.deterministic_role_Kapitaen||"0",10),b+=parseInt(I.deterministic_role_Co_Kapitaen||"0",10),y+=parseInt(I.deterministic_role_Sprinter||"0",10),v+=parseInt(I.deterministic_role_Edelhelfer||"0",10),x+=parseInt(I.deterministic_role_Starke_Helfer||"0",10),M+=parseInt(I.deterministic_role_Wassertraeger||"0",10);for(const N of $)for(const H of w){const Z=`deterministic_${N}_spec1_${H}`,ne=parseInt(I[Z]||"0",10);T[N][H]=(T[N][H]||0)+ne}}let C=0;i.is_stage_race===1&&(C=r.filter(N=>N.race_id===i.id).filter(N=>{const H=(N.profile||"").toLowerCase();return H==="flat"||H==="rolling"}).length);let E=!1,F=0;if(i.is_stage_race===0){const I=r.find(H=>H.race_id===i.id),N=((I==null?void 0:I.profile)||"").toLowerCase();E=N==="cobble"||N==="cobble_hill",E&&(F=(e.roleSpecCombinations||[]).filter(Z=>o.has(Z.program_id)).filter(Z=>Z.spec1==="Cobble"||Z.spec2==="Cobble"||Z.spec3==="Cobble").reduce((Z,ne)=>Z+ne.count,0))}let L="<strong>Rennprogramme verwalten</strong>";i.is_stage_race===0&&E?L=`
        <strong>Rennprogramme verwalten 
          (<span style="color: ${F<20?"#ef4444":"var(--accent-h)"}; font-weight: bold;" title="Kopfsteinpflaster-Spezialisten: ${F} / min. 20">Gesamtfahrer: ${f}</span>)
        </strong>
      `:L=`<strong>Rennprogramme verwalten (Gesamtfahrer: ${f})</strong>`;const _=`
      <div class="race-rider-programs-popover-card ${m?"":"hidden"}"
           style="position: absolute; top: calc(100% + 0.45rem); right: 0; z-index: 120; min-width: 600px; max-width: 750px; padding: 0.8rem 0.9rem; border: 1px solid rgba(148, 163, 184, 0.18); border-radius: var(--radius-md); background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%); box-shadow: var(--shadow); text-align: left; font-weight: normal;">
        <div class="popover-head" style="border-bottom: 1px solid rgba(148, 163, 184, 0.12); padding-bottom: 0.4rem; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
          ${L}
          <span style="font-size: 0.65rem; font-weight: normal; color: var(--text-500);">Klicken zum Aktivieren</span>
        </div>
        <div class="popover-program-list-scroll" data-race-id="${i.id}" style="display: flex; flex-direction: column; gap: 0.2rem; max-height: 350px; overflow-y: auto;">
          ${u}
        </div>
      </div>
    `;let G="text-align: center; font-variant-numeric: tabular-nums;";i.is_stage_race===1&&C>=2&&(y<=7?G+=" background-color: rgba(239, 68, 68, 0.2); color: #ef4444; font-weight: bold;":y>7&&y<10&&(G+=" background-color: rgba(234, 179, 8, 0.2); color: #eab308; font-weight: bold;"));let K="position: relative; text-align: center; font-variant-numeric: tabular-nums; vertical-align: middle;",R="font-weight: bold; border: none; background: transparent; padding: 0.15rem 0.4rem; cursor: pointer; color: var(--accent-h); text-decoration: underline;";i.is_stage_race===0&&E&&F<20&&(K+=" background-color: rgba(239, 68, 68, 0.2);",R+=" color: #ef4444; font-weight: bold;");const B=`
      <button type="button" class="race-rider-count-trigger btn-link" data-race-id="${i.id}" 
              style="${R}">
        ${f}
      </button>
    `;let U="—";if(i.is_stage_race===0){const I=r.find(N=>N.race_id===i.id);U=(I==null?void 0:I.profile)??"Flat"}let W="",se=`<strong>${S(i.name)}</strong>`;if(i.is_stage_race===1){const I=bt===i.id,{countHtml:N,stagesListHtml:H}=nf(i.id,r);W=`
        <div class="race-stages-popover-card ${I?"":"hidden"}">
          <div class="popover-head"><strong>${S(i.name)}</strong> - Etappen</div>
          <div class="popover-stages-list">${H}</div>
          <div class="popover-separator"></div>
          <div class="popover-head">Profile Zusammenfassung</div>
          <div class="popover-profiles-summary">${N}</div>
        </div>
      `,se=`
        <button type="button" class="race-popover-trigger btn-link" data-race-id="${i.id}" style="text-align: left; font-weight: bold; border: none; background: transparent; padding: 0; cursor: pointer; color: var(--accent-h);">
          ${S(i.name)}
        </button>
      `}let q=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"];if(i.is_stage_race===0){const I=r.find(H=>H.race_id===i.id),N=((I==null?void 0:I.profile)??"").toLowerCase();N.includes("cobble")?q=["Cobble","Sprint","Hill","Attacker","Timetrial","Berg"]:(N.includes("flat")||N.includes("rolling"))&&(q=["Sprint","Timetrial","Attacker","Hill","Cobble","Berg"])}const ee=[],Y=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],j={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},D={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},A=(e.roleSpecCombinations||[]).filter(I=>o.has(I.program_id)),P=new Map;for(const I of A){const N=I.spec2||"—",H=`${I.role}|${I.spec1}|${N}`;P.set(H,(P.get(H)||0)+I.count)}const O=[...P.entries()].map(([I,N])=>{const[H,Z,ne]=I.split("|");return{role:H,spec1:Z,spec2:ne,count:N}}).sort((I,N)=>{const H=Y.indexOf(I.role)-Y.indexOf(N.role);if(H!==0)return H;const Z=q.indexOf(I.spec1)-q.indexOf(N.spec1);return Z!==0?Z:N.count-I.count}),z=(I,N)=>{const H=D[I]??I,Z=N!=="—"?D[N]??N:"—";return`${H} / ${Z}`};for(const I of O)if(I.count>0){const N=I.spec1==="Berg"&&I.spec2==="Cobble"||I.spec1==="Cobble"&&I.spec2==="Berg",H=N?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",Z=N?"color: #f97316; font-weight: bold;":"color: var(--text-100);",ne=N?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",fe=`${I.role}_${I.spec1}_${I.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`,$e=A.filter(ye=>ye.role===I.role&&ye.spec1===I.spec1&&(ye.spec2||"—")===I.spec2).map(ye=>{const he=e.programs.find(ve=>ve.id===ye.program_id);return`<span style="white-space: nowrap; margin-right: 0.8rem;">${S((he==null?void 0:he.name)??"Unbekannt")}: <strong>${ye.count}</strong></span>`}).join(" ");ee.push(`
          <div style="${H}">
            <span style="${Z}">${j[I.role]||I.role} <span class="text-muted">(${z(I.spec1,I.spec2)})</span></span>
            <strong style="${ne} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="${i.id}" data-combo-key="${fe}">
              ${I.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-${i.id}-${fe}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: ${$e}
          </div>
        `)}const k=ee.length>0?ee.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost race-row-expand-btn" data-race-id="${i.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td>${ie(i.start_date)}</td>
        <td class="race-programs-popup-anchor" style="position: relative; vertical-align: middle;">
          ${se}
          ${W}
        </td>
        <td style="font-weight: bold; color: var(--accent-h); text-align: center;">${U}</td>
        <td class="race-programs-popup-anchor" style="${K}">
          ${B}
          ${_}
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${g}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${b}</td>
        <td style="${G}">${y}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${v}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${x}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${M}</td>
      </tr>
      <tr id="race-details-row-${i.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
        <td colspan="11" style="padding: 0.5rem 1.5rem;">
          <div style="max-width: 450px; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
            <div style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; font-weight: bold; background: rgba(99,102,241,0.08); color: var(--text-100);">Zusammensetzung (Rolle / Spezialisierung)</div>
            ${k}
          </div>
        </td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function il(e){return We!==e?'<span style="opacity:0.35; margin-left:4px;">↕</span>':`<span style="color:var(--accent-h); margin-left:4px; font-weight:bold;">${ga?"↑":"↓"}</span>`}function it(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${We===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
        <span>${S(t)}</span>
        ${il(e)}
      </div>
    </th>
  `}function lf(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${We===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: flex-start; gap: 2px;">
        <span>${S(t)}</span>
        ${il(e)}
      </div>
    </th>
  `}function df(e){const t=e.programs,a=e.roleSpecCombinations||[],r={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},s={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},n=t.map(o=>{const d=a.filter(f=>f.program_id===o.id);let l=0;const p={Kapitaen:0,Co_Kapitaen:0,Sprinter:0,Edelhelfer:0,Starke_Helfer:0,Wassertraeger:0};for(const f of d)l+=f.count,p[f.role]!==void 0&&(p[f.role]+=f.count);const u=$r(o,e),m=u.peak+u.prep+u.none;return{program:o,totalRiders:l,roleCounts:p,progCombos:d,raceDays:m}});n.sort((o,d)=>{let l=0;return We==="id"?l=o.program.id-d.program.id:We==="name"?l=o.program.name.localeCompare(d.program.name):We==="total"?l=o.totalRiders-d.totalRiders:We==="raceDays"?l=o.raceDays-d.raceDays:l=(o.roleCounts[We]||0)-(d.roleCounts[We]||0),l===0&&(l=o.program.id-d.program.id),ga?l:-l});const i=n.map(o=>{const d=o.program,l=o.progCombos,p=o.totalRiders,u=o.roleCounts,m=o.raceDays,f=new Set(e.raceProgramRaces.filter(w=>w.program_id===d.id).map(w=>w.race_id)),g=nl(d,f,e),b=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],y=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"],v=new Map;for(const w of l){const C=w.spec2||"—",E=`${w.role}|${w.spec1}|${C}`;v.set(E,(v.get(E)||0)+w.count)}const x=[...v.entries()].map(([w,C])=>{const[E,F,L]=w.split("|");return{role:E,spec1:F,spec2:L,count:C}}).sort((w,C)=>{const E=b.indexOf(w.role)-b.indexOf(C.role);if(E!==0)return E;const F=y.indexOf(w.spec1)-y.indexOf(C.spec1);return F!==0?F:C.count-w.count}),M=(w,C)=>{const E=s[w]??w,F=C!=="—"?s[C]??C:"—";return`${E} / ${F}`},T=[];for(const w of x)if(w.count>0){const C=w.spec1==="Berg"&&w.spec2==="Cobble"||w.spec1==="Cobble"&&w.spec2==="Berg",E=C?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",F=C?"color: #f97316; font-weight: bold;":"color: var(--text-100);",L=C?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",_=`${w.role}_${w.spec1}_${w.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`;T.push(`
          <div style="${E}">
            <span style="${F}">${r[w.role]||w.role} <span class="text-muted">(${M(w.spec1,w.spec2)})</span></span>
            <strong style="${L} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="prog-${d.id}" data-combo-key="${_}">
              ${w.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-prog-${d.id}-${_}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: <span style="white-space: nowrap; margin-right: 0.8rem;">${S(d.name)}: <strong>${w.count}</strong></span>
          </div>
        `)}const $=T.length>0?T.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost program-row-expand-btn" data-program-id="${d.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td style="font-weight: bold; color: var(--text-100);">${d.id}</td>
        <td style="font-weight: bold; min-width: 150px;">${S(d.name)}</td>
        <td style="text-align: center; font-weight: bold; color: var(--accent-h); font-variant-numeric: tabular-nums;">${p}</td>
        <td style="text-align: center; font-weight: bold; color: var(--text-100); font-variant-numeric: tabular-nums;" title="Abschnitts-Renntage:
Start bis Peak 1: ${g.phase1} Tage
Peak 1 bis Peak 2: ${g.phase2} Tage
Peak 2 bis Peak 3: ${g.phase3} Tage
Jenseits Peak 3: ${g.phase4} Tage">
          ${m} <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal; display: block; margin-top: 0.15rem;">${g.phase1} / ${g.phase2} / ${g.phase3} / ${g.phase4}</span>
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${u.Kapitaen||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${u.Co_Kapitaen||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${u.Sprinter||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${u.Edelhelfer||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${u.Starke_Helfer||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${u.Wassertraeger||"—"}</td>
      </tr>
      <tr id="program-details-row-${d.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
        <td colspan="11" style="padding: 0.5rem 1.5rem;">
          <div style="max-width: 450px; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
            <div style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; font-weight: bold; background: rgba(99,102,241,0.08); color: var(--text-100);">Zusammensetzung (Rolle / Spezialisierung)</div>
            ${$}
          </div>
        </td>
      </tr>
    `});return`
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40px;"></th>
              ${it("id","ID","width: 50px;")}
              ${lf("name","Programm")}
              ${it("total","Fahrer gesamt","width: 110px; text-align: center; font-weight: bold;")}
              ${it("raceDays","Renntage","width: 100px; text-align: center; font-weight: bold;")}
              ${it("Kapitaen","Kapitän","width: 90px; text-align: center;")}
              ${it("Co_Kapitaen","Co-Kapitän","width: 90px; text-align: center;")}
              ${it("Sprinter","Sprinter","width: 90px; text-align: center;")}
              ${it("Edelhelfer","Edelhelfer","width: 90px; text-align: center;")}
              ${it("Starke_Helfer","Starke Helfer","width: 100px; text-align: center;")}
              ${it("Wassertraeger","Wasserträger","width: 100px; text-align: center;")}
            </tr>
          </thead>
          <tbody>
            ${i.join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.openTeamStats=tl;async function ol(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}ss("game"),h("meta-career").textContent=((e=c.currentSave)==null?void 0:e.careerName)??"",At("dashboard"),Re("Spiel wird geladen…");try{await Fs(),await Ps(),vr()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{ke()}}function cf(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";At(t),t==="dashboard"&&vr(),t==="teams"&&or(),t==="riders"&&or(),t==="rider-team-editor"&&Qo(),t==="live-race"&&Ut(),t==="results"&&Ce(),t==="draft"&&el(c.draftSelectedSeason||((a=c.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&yg(),t==="season-standings"&&xg(),t==="leaderboards"&&_g(),t==="calendar"&&Vg(),t==="race-programs"&&Bs(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&bo()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&qt(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&tl(a)}),h("btn-cancel-new").addEventListener("click",()=>Je("newCareer")),h("btn-close-race-stages").addEventListener("click",()=>Je("raceStages")),h("btn-close-stage-profile").addEventListener("click",()=>Je("stageProfile")),h("btn-close-rider-program").addEventListener("click",()=>Je("riderProgram")),h("btn-close-rider-stats").addEventListener("click",()=>Je("riderStats")),h("btn-close-team-stats").addEventListener("click",()=>Je("teamStats")),h("btn-close-race-participants").addEventListener("click",()=>Je("raceParticipants")),h("btn-close-roster-editor").addEventListener("click",()=>qr()),h("btn-cancel-roster-editor").addEventListener("click",()=>qr()),h("btn-apply-roster-editor").addEventListener("click",()=>{Ap()}),h("btn-back-menu").addEventListener("click",()=>{oa==null||oa.pause(),ss("menu"),ya()}),wl(),Qp(),Og(),Lo(),qo(),bg(),Bp(),Fp(),ep(),hp(),Lg(),Tg(),Dg(),qg()}(async()=>(xm(),me(),cf(),ss("menu"),await ya()))();
