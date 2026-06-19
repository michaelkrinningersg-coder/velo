(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();function ei(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Pr(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function dt(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function ir(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function Le(e,t={}){const a=t.strong===!1?"span":"strong",r=Pr("app-rider-link-label",t.labelClassName),s=`<${a} class="${r}">${ei(e)}</${a}>`;if(t.riderId==null)return s;const n=['type="button"','class="'+Pr("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${s}</button>`}function nt(e,t,a=!0,r=""){const s=a===!1?"span":"strong",n=`<${s} class="app-team-link-label">${ei(e)}</${s}>`;return t==null?n:`<button type="button" class="${Pr("app-team-link",r)}" data-team-id="${t}">${n}</button>`}function ti(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function ai(e){return Math.round(e*10)/10}function ri(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function si(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function ni(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function nl(e,t){return e.skills.stamina*(t/300)}function ii(e,t,a){return e.skills.timeTrial+ni(e,t)+e.skills.mountain*(a/500)}function il(e,t,a,r){const s=nl(e,a),n=ni(e,r);switch(t.profile){case"Flat":return .8*e.skills.sprint+.15*e.skills.acceleration+.05*e.skills.flat+n+s;case"Rolling":return .7*e.skills.sprint+.2*e.skills.acceleration+.1*e.skills.hill+n+s;case"Hilly":return .45*e.skills.sprint+.1*e.skills.flat+.45*e.skills.hill+n+s;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+s;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+s;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+s;case"High_Mountain":return e.skills.mountain+n+s;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+s;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+s;default:return .8*e.skills.sprint+.2*e.skills.flat+n+s}}function ol(e,t,a,r,s){return t.profile==="ITT"||t.profile==="TTT"?ii(e,s,r):il(e,t,a,s)}function ll(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:ai(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function oi(e,t,a,r){ri(a,r);const s=si(a,r),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const p=o.get(l.activeTeamId)??[];p.push(l),o.set(l.activeTeamId,p)}return[...o.entries()].map(([l,p])=>{const u=n.get(l),f=p.map(S=>ii(S,ti(S.id,r==null?void 0:r.dailyFormByRiderId),s)).sort((S,T)=>T-S).slice(0,5),g=f.length,y=g>0?f.reduce((S,T)=>S+T,0)/g:0,v=Math.max(0,5-g)*2;return{team:u??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:y-v}}).sort((l,p)=>p.score-l.score||l.team.id-p.team.id).slice(0,20).map((l,p)=>({rank:p+1,kind:"team",effectiveSkill:ai(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(r!=null?Ka(e,t,a,r):Ka(e,t,a)).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id).slice(0,20).map((o,d)=>ll(o,d+1))}function Ka(e,t,a,r){const s=ri(a,r),n=si(a,r),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var d;return{rider:o,teamName:o.activeTeamId!=null?((d=i.get(o.activeTeamId))==null?void 0:d.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:ol(o,a,s,n,ti(o.id,r==null?void 0:r.dailyFormByRiderId))}}).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id)}const c={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,draftHistory:null,injuries:null,draftSelectedSeason:null,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1,autoProgressTargetDate:null,raceProgramsPayload:null,raceProgramsActiveTab:"calendar-cols",raceProgramsDirty:!1,raceProgramsSaving:!1};let ta=null;function dl(e){ta=e}let qr=!1;function Bs(e){qr=e}let li=null;function Hs(e){li=e}let Nr=null;function Gs(e){Nr=e}let ct=!1;function di(e){ct=e}function b(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function k(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ne(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function Wa(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),r=Math.floor(e%60),s=String(a).padStart(2,"0"),n=String(r).padStart(2,"0");return t>0?`${t}:${s}:${n}`:`${a}:${n}`}function yr(e){return e==null||e===0?"–":`+${Wa(e)}`}const _a=2,Lr=3,ci=4;function ui(e){return`/jersey/Jer_${e}.png`}function Ct(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((r=c.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${k(a)}" aria-label="${k(a)}">
      <img
        class="results-team-jersey-img"
        src="${k(ui(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function qt(e,t){return`<span class="results-jersey-cell">${Ct(e,t)}</span>`}function it(e){return e&&oe(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function Ht(e){var a;if(e==null)return null;const t=we(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function we(e){return e==null?null:c.riders.find(t=>t.id===e)??null}function yt(e){return e==null?null:c.races.find(t=>t.id===e)??null}function ja(e){var t;if(e==null)return null;for(const a of c.races){const r=(t=a.stages)==null?void 0:t.find(s=>s.id===e);if(r)return{race:a,stage:r}}return null}function Xt(e,t=!0,a=!1,r=null,s=null){const n=Le(e,{riderId:r,teamId:s,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function cl(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function Dr(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function ul(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function ml(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}const Ye={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function oe(e){const t=Ye[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function pl(e,t){return e?`<span class="country-chip">${oe(e.code3)}<span>${k(e.name)}</span></span>`:t?k(t):"–"}function _r(e){return`${e.toFixed(2).replace(".",",")} km`}function Ar(e){return`${Math.round(e)} hm`}const gl=new Set;function Xr(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),b(`screen-${e}`).classList.remove("hidden")}function Je(e){b(`modal-${e}`).classList.remove("hidden")}function Ve(e){b(`modal-${e}`).classList.add("hidden")}function zs(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function mi(){var l,p;const e=c.realtimeBootstrap;if(!e)return;const t=b("instant-sim-favorites"),a=b("instant-sim-gc");if(!t||!a)return;const s=oi(e.riders,e.teams,e.stage,{distanceKm:(l=e.stageSummary)==null?void 0:l.distanceKm,elevationGainMeters:(p=e.stageSummary)==null?void 0:p.elevationGainMeters}).slice(0,10),n=new Map(e.gcStandings.map(u=>[u.riderId,u]));let i=`
    <h3>
      <span>Etappen-Favoriten</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const u of s){const m=e.riders.find(M=>M.id===u.riderId);if(!m)continue;const f=Ht(m.id)??"un",g=Ye[f]??"un",y=e.teams.find(M=>M.id===m.activeTeamId),v=(y==null?void 0:y.abbreviation)??"—",S=n.get(m.id),T=S?`GC ${S.rank} (${S.rank===1?"Gelb":zs(S.gapSeconds)})`:"GC –";i+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${m.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${u.rank}</span>
            <span class="fi fi-${g} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${k(m.firstName)} <strong>${k(m.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${k(v)}</span>
            <span class="instant-sim-gc-info">${T}</span>
          </div>
        </div>
      </div>
    `}i+="</div>",t.innerHTML=i;const o=e.gcStandings.slice(0,10);let d=`
    <h3>
      <span>Gesamtwertung (GC)</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const u of o){const m=e.riders.find(T=>T.id===u.riderId);if(!m)continue;const f=Ht(m.id)??"un",g=Ye[f]??"un",y=e.teams.find(T=>T.id===m.activeTeamId),v=(y==null?void 0:y.abbreviation)??"—",S=u.rank===1?"Gelb":zs(u.gapSeconds);d+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${m.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${u.rank}</span>
            <span class="fi fi-${g} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${k(m.firstName)} <strong>${k(m.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${k(v)}</span>
            <span class="instant-sim-gc-info">${S}</span>
          </div>
        </div>
      </div>
    `}d+="</div>",a.innerHTML=d}function Te(e="Lade…"){var r;const t=ct?" (Leertaste zum Stoppen)":"",a=b("default-loader");a&&(b("loading-msg").textContent=e+t,b("loading-progress").classList.add("hidden"),a.classList.remove("hidden"),(r=b("instant-sim-panel"))==null||r.classList.add("hidden")),b("loading-overlay").classList.remove("hidden")}function Se(){b("loading-overlay").classList.add("hidden")}function fl(e){var t,a;if((t=b("default-loader"))==null||t.classList.add("hidden"),(a=b("instant-sim-panel"))==null||a.classList.remove("hidden"),b("loading-overlay").classList.remove("hidden"),c.realtimeBootstrap)mi();else{const r=b("instant-sim-favorites"),s=b("instant-sim-gc");r&&(r.innerHTML=""),s&&(s.innerHTML="")}pi(e)}function pi(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),r=`Instant-Simulation läuft … ${t}%${ct?" (Leertaste zum Stoppen)":""}`,s=b("loading-msg");s&&(s.textContent=r);const n=b("loading-progress-bar");n&&(n.style.width=`${t}%`);const i=b("instant-loading-msg");i&&(i.textContent=r);const o=b("instant-loading-progress-bar");o&&(o.style.width=`${t}%`);const d=b("instant-sim-favorites");d&&d.innerHTML.trim()===""&&c.realtimeBootstrap&&mi()}function Mt(e,t){const a=b(e);a.textContent=t,a.classList.remove("hidden")}function da(e){b(e).classList.add("hidden")}function Nt(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),b(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),b("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of gl)try{a(e)}catch(r){console.error(`Fehler bei View-Aktivierung von "${e}":`,r)}}function xe(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function aa(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function gi(e,t,a){return Math.max(t,Math.min(a,e))}function vr(e,t,a){return Math.round(e+(t-e)*a)}function Ks(e,t,a){return`rgb(${vr(e[0],t[0],a)} ${vr(e[1],t[1],a)} ${vr(e[2],t[2],a)})`}function Qr(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=gi(e,t[0].value,t[t.length-1].value);for(let r=1;r<t.length;r+=1){const s=t[r-1],n=t[r];if(a<=n.value){const i=(a-s.value)/(n.value-s.value);return Ks(s.color,n.color,i)}}return Ks(t[t.length-1].color,t[t.length-1].color,1)}function fi(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${Qr(e)}"${a}>${e.toFixed(2)}</span>`}function hl(e,t,a){if(t==null)return fi(e,a);const r=Math.round((e-t)*100)/100,s=r>0?"skill-delta-positive":r<0?"skill-delta-negative":"skill-delta-neutral",n=r>0?"+":"",i=`<span class="skill-delta ${s}">${n}${r.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${Qr(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function bl(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function Ws(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",r=t>0?"+":"";return`<span class="${a}">${r}${t.toFixed(1).replace(".",",")}</span>`}function js(e,t="none",a){const r=e??0,s=["race-sim-form-negative"];t==="warning"&&s.push("load-warning"),t==="critical"&&s.push("load-warning-critical");const n=a?` title="${k(a)}"`:"";return r===0?`<span class="${s.join(" ")}"${n}>0,0</span>`:`<span class="${s.join(" ")}"${n}>-${r.toFixed(1).replace(".",",")}</span>`}function hi(e){const t=e.seasonFormPhase??"neutral";return bi(t)}function bi(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${k(a.label)}">${a.symbol}</span>`}function yl(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${k(e.seasonProgram.name)}</button>`:"–"}function Et(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function De(e){return`${e.lastName} ${e.firstName}`}function vl(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,r=e.unavailableUntil?` bis ${ne(e.unavailableUntil)}`:"",s=`${t}: noch ${a} Tag${a===1?"":"e"}${r}`;return`<span class="rider-availability-marker" title="${k(s)}" aria-label="${k(s)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function bt(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function Br(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=e,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(r)}async function Z(e,t,a){try{const r=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(r.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await r.text();return{success:!1,error:r.ok?"Antwort war kein JSON.":`HTTP ${r.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return r.json()}catch(r){return{success:!1,error:`Netzwerkfehler: ${r.message}`}}}const V={listSaves:()=>Z("GET","/api/saves"),createSave:(e,t,a)=>Z("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>Z("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>Z("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>Z("GET","/api/teams/available"),getTeams:()=>Z("GET","/api/teams"),getTeam:e=>Z("GET",`/api/teams/${e}`),getTeamStats:e=>Z("GET",`/api/teams/${e}/stats`),getRiders:e=>Z("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRiderStats:(e,t=!1)=>Z("GET",`/api/riders/${e}/stats${t?"?excludeFatigue=true":""}`),getRiderProgramRaces:e=>Z("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>Z("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>Z("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>Z("POST","/api/rider-team-editor/export",e),getRaces:()=>Z("GET","/api/races"),getRaceProgramParticipants:e=>Z("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>Z("GET",`/api/races/${e}/results-roster`),getGameState:()=>Z("GET","/api/state"),getGameStatus:()=>Z("GET","/api/game/status"),getStageSummary:e=>Z("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>Z("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>Z("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>Z("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>Z("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>Z("POST","/api/state/advance"),getStageResults:e=>Z("GET",`/api/results/${e}`),getSeasonStandings:()=>Z("GET","/api/season-standings"),listStageEditorStages:()=>Z("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>Z("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>Z("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>Z("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>Z("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>Z("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>Z("POST","/api/stage-editor/import",e),exportStageRoute:e=>Z("POST","/api/stage-editor/export",e),getInjuries:()=>Z("GET","/api/injuries"),getDraftHistory:e=>Z("GET",`/api/draft/${e}`),getLeaderboards:(e,t,a)=>Z("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`),getRaceProgramsEditor:()=>Z("GET","/api/race-programs-editor"),saveRaceProgramsEditor:e=>Z("POST","/api/race-programs-editor/save",e)};async function ma(){const e=await V.listSaves(),t=b("saves-list"),a=b("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(r=>`
    <div class="save-card">
      <h3>${k(r.careerName)}</h3>
      <p class="save-meta">
        ${k(r.teamName)} · Saison ${r.currentSeason}
        ${r.lastSaved?"· "+ne(r.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${k(r.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${k(r.filename)}" data-career-name="${k(r.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function Sl(e){Te("Karriere wird geladen…");const t=await V.loadSave(e);if(Se(),!t.success){alert("Fehler beim Laden: "+t.error);return}c.currentSave=t.data??null,await sl()}async function kl(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;Te("Löschen…");const a=await V.deleteSave(e);if(Se(),!a.success){alert("Fehler: "+a.error);return}await ma()}async function $l(){const e=await V.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){b("btn-delete-all-careers").classList.add("hidden"),b("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){Te("Alle Karrieren werden gelöscht…");try{for(const a of t){const r=await V.deleteSave(a.filename);if(!r.success){alert(`Fehler beim Löschen von "${a.careerName}": ${r.error??"Unbekannter Fehler"}`);break}}}finally{Se()}await ma()}}function xl(){b("btn-new-career").addEventListener("click",async()=>{var s;da("new-career-error"),b("input-career-name").value="";const a=b("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',Je("newCareer");const r=await V.getAvailableTeams();if(!r.success||!((s=r.data)!=null&&s.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=r.data.map(n=>`<option value="${n.id}">${k(n.name)} (${k(n.division??n.divisionName??"")})</option>`).join("")}),b("btn-cancel-new").addEventListener("click",()=>Ve("newCareer")),b("btn-confirm-new").addEventListener("click",async()=>{const a=b("input-career-name").value.trim(),r=b("input-team-id").value;if(!a||!r){Mt("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const s=Number(r),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;da("new-career-error"),Te("Neue Karriere wird erstellt…");const o=await V.createSave(i,a,s);if(!o.success){Se(),Mt("new-career-error",o.error??"Unbekannter Fehler.");return}const d=await V.loadSave(i);if(Se(),Ve("newCareer"),!d.success){alert("Fehler: "+d.error);return}c.currentSave=d.data??null,await sl()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>ma());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{$l()}),b("saves-list").addEventListener("click",async a=>{const r=a.target.closest("button[data-save-action]");if(!r)return;const{saveAction:s,filename:n,careerName:i}=r.dataset;if(n){if(s==="load"){await Sl(n);return}s==="delete"&&await kl(n,i??n)}})}const Tl="modulepreload",wl=function(e){return"/"+e},Os={},yi=function(t,a,r){let s=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));s=Promise.allSettled(a.map(d=>{if(d=wl(d),d in Os)return;Os[d]=!0;const l=d.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${p}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":Tl,l||(u.as="script"),u.crossOrigin="",u.href=d,o&&u.setAttribute("nonce",o),document.head.appendChild(u),l)return new Promise((m,f)=>{u.addEventListener("load",m),u.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return s.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},Ml={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function Rl(e){const t=Ml[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const Il=200;function es(e){if(e.length===0)return[];const t=[];for(const a of e){const r=t[t.length-1];if(!r||Math.abs(r.distanceMeter-a.distanceMeter)>=Il){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}r.riderIds.push(...a.riderIds),r.riderCount+=a.riderCount,r.distanceSum+=a.distanceMeter*a.riderCount,r.distanceMeter=r.distanceSum/r.riderCount}return t.map(({distanceSum:a,...r})=>r)}function ts(e){if(e.length===0)return[];let t=0;for(let s=1;s<e.length;s+=1)e[s].riderCount>e[t].riderCount&&(t=s);let a=0,r=0;return e.map((s,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(r+=1,o=`A${r}`),{...s,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-s.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,s.distanceMeter-e[n+1].distanceMeter):null}})}function Cl(e,t=null){var a,r,s;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((r=e.find(n=>n.label==="P"))==null?void 0:r.label)??((s=e[0])==null?void 0:s.label)??null}function vt(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function Vs(e,t,a,r){return`${r.type}:${e}:${t}:${a}`}function El(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:vt(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function et(e){const t=[];e.segments.forEach((s,n)=>{const i=n*2;(s.start_markers??[]).forEach((o,d)=>{t.push({key:Vs(n,"start",d,o),label:"",marker:o,kmMark:s.start_km,elevation:s.start_elevation,boundary:"start",sequence:i+d/100})}),(s.end_markers??[]).forEach((o,d)=>{t.push({key:Vs(n,"end",d,o),label:"",marker:o,kmMark:s.end_km,elevation:s.end_elevation,boundary:"end",sequence:i+1+d/100})})});const a=t.sort((s,n)=>s.kmMark-n.kmMark||s.sequence-n.sequence),r=new Map;return a.map(s=>{const n=(r.get(s.marker.type)??0)+1;return r.set(s.marker.type,n),{...s,label:s.marker.name??El(s.marker,n)}})}function Fl(e){const t=et(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>vt(a)).length}}function Ot(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Pl(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function ze(e,t,a,r){return t<=0?r:r+e/t*(a-r*2)}function Oa(e,t){const a=t/1e3,r=e.points;if(a<=r[0].kmMark)return r[0].elevation;for(let s=0;s<r.length-1;s+=1){const n=r[s],i=r[s+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),d=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*d}return r[r.length-1].elevation}function vi(e){const t=e.points.map(p=>p.elevation),a=Math.min(...t),r=Math.max(...t),s=Math.max(1,r-a),n=Math.max(40,s*.08),i=Math.max(0,a-n),o=r+n;let d=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=d&&(l=d+100),{axisMinElevation:d,axisMaxElevation:l}}function qe(e,t,a,r,s,n){const i=Math.max(1,a-t);return r-n-(e-t)/i*(r-s-n)}function ra(e){return`${Math.round(e)} m`}function Us(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function Ys(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function Si(e,t,a,r,s,n,i,o,d){var g;const l=[],p=[];let u=null,m="#b91c1c";for(const y of et(e)){const{marker:v,kmMark:S,elevation:T}=y;if(v.type==="climb_start"){p.push({kmMark:S,elevation:T,name:v.name});continue}if(vt(v)){let M=-1;for(let R=p.length-1;R>=0;R-=1)if(v.name&&((g=p[R])==null?void 0:g.name)===v.name){M=R;break}const x=M>=0?p.splice(M,1)[0]:p.pop();x&&Math.max(0,S-x.kmMark),x&&Math.max(0,T-x.elevation);const $=Ys(v.cat,v.type),I=Us(v.cat);if(v.type==="finish_hill"||v.type==="finish_mountain"){u=v.cat??null,m=$.accentColor;continue}l.push({x:ze(S*1e3,t,a,r),anchorY:qe(T,o,d,s,n,i),primaryLabel:I??"Berg",secondaryLabel:ra(T),distanceLabel:`${S.toFixed(1).replace(".",",")} km`,accentColor:$.accentColor});continue}if(v.type==="sprint_intermediate"){const M=Ys(v.cat,v.type);l.push({x:ze(S*1e3,t,a,r),anchorY:qe(T,o,d,s,n,i),primaryLabel:"Sprint",secondaryLabel:ra(T),distanceLabel:`${S.toFixed(1).replace(".",",")} km`,accentColor:M.accentColor})}}const f=e.points[e.points.length-1];return l.push({x:ze(f.kmMark*1e3,t,a,r),anchorY:qe(f.elevation,o,d,s,n,i),primaryLabel:u?`${Us(u)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:ra(f.elevation),distanceLabel:`${f.kmMark.toFixed(1).replace(".",",")} km`,accentColor:m}),l.sort((y,v)=>y.x-v.x)}function ki(e,t,a){const r=t+4,s=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${Ot(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-detail">${Ot(e.distanceLabel)}</text>
    </g>`}function $i(e,t){const a=new Set,r=t/1e3;for(let s=0;s<=r;s+=25)a.add(Math.round(s*1e3));return a.add(Math.round(t)),[...a].filter(s=>s>=0&&s<=t).sort((s,n)=>s-n)}function xi(e,t,a,r,s,n){const i=new Set(et(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const d=ze(o,a,r,s),p=i.has(o)?18:12,u=n+p+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${d.toFixed(1)}" y1="${n.toFixed(1)}" x2="${d.toFixed(1)}" y2="${(n+p).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${d.toFixed(1)}" y="${u.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${Ot(Pl(o))}</text>
      </g>`}).join("")}function Nl(e,t,a,r,s,n,i,o,d,l,p){const u=ze(e.distanceMeter,a,r,n),m=Oa(t,e.distanceMeter),f=qe(m,d,l,s,i,o),g=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),y=e.riderCount>1?`<text x="${u.toFixed(1)}" y="${(f+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${u.toFixed(1)}" cy="${f.toFixed(1)}" r="${g.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${p?" race-sim-cluster-dot-selected":""}"></circle>
      ${y}
    </g>`}function Ll(e,t,a,r,s,n,i,o,d,l,p){const u=new Map(p.riders.map(f=>[f.id,f])),m=new Map((p.teams??[]).map(f=>[f.id,f.abbreviation]));return e.filter(f=>f.riderCount===1).map(f=>{const g=f.riderIds[0];if(g==null)return"";const y=u.get(g);if(!y)return"";const v=ze(f.distanceMeter,a,r,n),S=Oa(t,f.distanceMeter),T=qe(S,d,l,s,i,o),M=y.activeTeamId!=null?m.get(y.activeTeamId)??"":"",x=`${y.lastName} (${M})`,$=T-34,I=T-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${v.toFixed(1)}" y1="${(T-5).toFixed(1)}" x2="${v.toFixed(1)}" y2="${$.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${v.toFixed(1)}" y="${I.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${Ot(x)}</text>
        </g>`}).join("")}function Dl(e,t,a,r,s,n,i,o,d,l,p){const u=Math.max(0,Math.min(l,e.distanceKm)),m=Math.max(0,Math.min(p,e.distanceKm));if(m<=u)return null;const f=[{kmMark:u,elevation:Oa(e,u*1e3)},...e.points.filter(T=>T.kmMark>u&&T.kmMark<m),{kmMark:m,elevation:Oa(e,m*1e3)}];if(f.length<2)return null;const g=s-i,y=f.map((T,M)=>{const x=ze(T.kmMark*1e3,t,a,r),$=qe(T.elevation,o,d,s,n,i);return`${M===0?"M":"L"} ${x.toFixed(1)} ${$.toFixed(1)}`}).join(" "),v=ze(u*1e3,t,a,r),S=ze(m*1e3,t,a,r);return`${y} L ${S.toFixed(1)} ${g.toFixed(1)} L ${v.toFixed(1)} ${g.toFixed(1)} Z`}function _l(e,t,a,r,s={}){const p=e.distanceKm*1e3,{axisMinElevation:u,axisMaxElevation:m}=vi(e),f=533,g=12,v=e.points.map(R=>{const P=ze(R.kmMark*1e3,p,1584,28),F=qe(R.elevation,u,m,634,168,101);return{x:P,y:F}}).map((R,P)=>`${P===0?"M":"L"} ${R.x.toFixed(1)} ${R.y.toFixed(1)}`).join(" "),S=`${v} L ${1556 .toFixed(1)} ${f.toFixed(1)} L ${28 .toFixed(1)} ${f.toFixed(1)} Z`,T=s.selectedClimbRange!=null?Dl(e,p,1584,28,634,168,101,u,m,s.selectedClimbRange.startKm,s.selectedClimbRange.endKm):null,M=Si(e,p,1584,28,634,168,101,u,m).map(R=>ki(R,g,f)).join(""),$=Array.from({length:5},(R,P)=>u+(m-u)/4*P).map(R=>{const P=qe(R,u,m,634,168,101);return`
      <line x1="28" y1="${P.toFixed(1)}" x2="1556" y2="${P.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${P.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${P.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(P+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${ra(R)}</text>`}).join(""),I=xi($i(e,p),e,p,1584,28,f);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${Ot(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      <path d="${S}" fill="url(#dashboard-large-area)"></path>
      ${T?`<path d="${T}" class="dashboard-stage-profile-climb-highlight"></path>`:""}
      <path d="${v}" class="race-sim-profile-line"></path>
      ${M}
      ${I}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function Al(e,t,a,r,s){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${_l(t,a,r,!1,s)}</div>`}function Bl(e,t,a,r,s,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,d=634,l=28,p=168,u=101,{axisMinElevation:m,axisMaxElevation:f}=vi(t),g=d-u,y=12,v=Array.from({length:5},(K,w)=>m+(f-m)/4*w),S=es(a.clusters),T=ts(S),M=$i(t,a.stageDistanceMeters),$=t.points.map(K=>{const w=ze(K.kmMark*1e3,a.stageDistanceMeters,o,l),A=qe(K.elevation,m,f,d,p,u);return{x:w,y:A}}).map((K,w)=>`${w===0?"M":"L"} ${K.x.toFixed(1)} ${K.y.toFixed(1)}`).join(" "),I=`${$} L ${(o-l).toFixed(1)} ${g.toFixed(1)} L ${l.toFixed(1)} ${g.toFixed(1)} Z`,R=Si(t,a.stageDistanceMeters,o,l,d,p,u,m,f).map(K=>ki(K,y,g)).join(""),P=v.map(K=>{const w=qe(K,m,f,d,p,u);return`
      <line x1="${l}" y1="${w.toFixed(1)}" x2="${o-l}" y2="${w.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${w.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${w.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(w+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${ra(K)}</text>`}).join(""),F=xi(M,t,a.stageDistanceMeters,o,l,g),D=new Map(S.map((K,w)=>[K,T[w]??null])),B=S.map(K=>{var w;return Nl(K,t,a.stageDistanceMeters,o,d,l,p,u,m,f,((w=D.get(K))==null?void 0:w.label)===i)}).join(""),H=s.stage.profile==="ITT"?Ll(S,t,a.stageDistanceMeters,o,d,l,p,u,m,f,s):"";e.innerHTML=`
    <div class="race-sim-profile-layout${s.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${d}" role="img" aria-label="${Ot(r)}">
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
          ${P}
          <line x1="${l}" y1="${g}" x2="${o-l}" y2="${g}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${p}" x2="${l}" y2="${g}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${I}" fill="url(#race-sim-area)"></path>
            <path d="${$}" class="race-sim-profile-line"></path>
            ${R}
            ${B}
          </g>
          ${H}
          ${F}
          <text x="${l.toFixed(1)}" y="${(p-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const Hl={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},Zs={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function Hr(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function or(e,t){return`${e}:${t}`}function Gl(e){return new Map(e.map(t=>[or(t.simulationMode,t.terrain),t.weights]))}function zl(e){return new Map(e.map(t=>[or(t.simulationMode,t.terrain),t]))}function Kl(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function Ti(e,t,a){const r=a.get(or(e,t));if(!r)return[{key:Hr(t),weight:1}];const s=Object.entries(r).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return s.length>0?s:[{key:Hr(t),weight:1}]}function Wl(e,t,a,r){const s=Ti(t,a,r),n=s.reduce((o,d)=>o+d.weight,0);return n<=0?e[Hr(a)]:s.reduce((o,d)=>o+e[d.key]*d.weight,0)/n}function jl(e,t){const a=t.find(r=>r.simulationMode==="ttt"&&r.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??Hl[e]??1.05}function Ol(e,t,a){const r=a==null?void 0:a.get(or(e,t));return{lateMultiplier:(r==null?void 0:r.finalSpreadLateMultiplier)??Zs[t].lateMultiplier,peakMultiplier:(r==null?void 0:r.finalSpreadPeakMultiplier)??Zs[t].peakMultiplier}}const Vl=.005,Ul=.005,wi=70,Mi=1e3,Ri=15,Ii=360,Ci=8,Ei=-.75,Fi=10;function Rt(e,t){return e+Math.random()*(t-e)}function Pi(e,t,a){return Math.max(t,Math.min(a,e))}function Yl(e){return e==="ITT"||e==="TTT"}function Ni(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(r=>{var s,n,i;return r.id!==e.id&&r.activeTeamId===e.activeTeamId&&(((s=r.role)==null?void 0:s.name)==="Edelhelfer"||((n=r.role)==null?void 0:n.name)==="Starke Helfer"||((i=r.role)==null?void 0:i.name)==="Wassertraeger")}).map(r=>r.id)}function Li(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function Zl(e,t,a,r){const s=r==="crash"?Li():null,n=Number(Rt(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=Pi(n/Math.max(.1,a)*100,0,100),d=o<=wi;return{riderId:e.id,type:r,severity:s,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(r==="crash"?Rt(10,60):Rt(10,45)),recoverySeconds:d?Mi:Ii,recoveryFormBonus:d?Ri:Ci,dayFormPenalty:Ei,staminaPenalty:Fi,recoveryPenaltyStages:r==="crash"?s==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:r==="crash"&&s==="medium"?15:0,supportRiderIds:Ni(e,t)}}function Jl(e,t,a){if(Yl(t.profile)||a<=0)return[];const r=[];for(const s of e){const n=Math.random(),i=Math.random(),o=Vl*Math.max(0,t.crashIncidentMultiplier??1),d=Ul*Math.max(0,t.mechanicalIncidentMultiplier??1),l=o+(t.rolledEffektSturz??0)/100,p=d+(t.rolledEffektDefekt??0)/100,u=n<l,m=i<p;if(!u&&!m)continue;const f=u&&m?n<=i?"crash":"mechanical":u?"crash":"mechanical",g=Zl(s,e,a,f);if(f==="crash"&&Math.random()<.01){g.isMassCrashTrigger=!0;const y=Math.floor(Rt(2,26)),S=[...e.filter(T=>T.id!==s.id)].sort(()=>.5-Math.random());g.massCrashPotentialRiderIds=S.slice(0,y).map(T=>T.id),Math.random()<.2&&(g.hasAdditionalMechanical=!0,g.waitDurationSeconds+=Math.round(Rt(10,45)))}r.push(g)}return r}function ql(e,t,a,r){const s=Li(),n=Math.round(a*1e3),i=Pi(a/Math.max(.1,r)*100,0,100),o=i<=wi;let d=Math.round(Rt(10,60)),l=!1;return Math.random()<.2&&(l=!0,d+=Math.round(Rt(10,45))),{riderId:e.id,type:"crash",severity:s,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:d,recoverySeconds:o?Mi:Ii,recoveryFormBonus:o?Ri:Ci,dayFormPenalty:Ei,staminaPenalty:Fi,recoveryPenaltyStages:s==="light"?[10,5,2]:[],raceRecuperationPenalty:s==="medium"?15:0,supportRiderIds:Ni(e,t),hasAdditionalMechanical:l}}function Xl(e,t){return e+Math.random()*(t-e)}function Js(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const r=Math.floor(Xl(0,a+1)),s=t[a];t[a]=t[r]??s,t[r]=s}return t}function Ql(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function ed(e,t,a={}){if(e.length===0)return[];const r=e.map(f=>({...f,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),s=a.teams??Ql(r),n=Ka(r,s,t,a),i=new Set(n.slice(0,20).map(f=>f.rider.id)),o=Math.min(Math.ceil(r.length*.02),Math.max(0,r.length-i.size)),d=Math.min(Math.ceil(r.length*.01),r.length),l=Js(r.filter(f=>!i.has(f.id))),p=new Set(l.slice(0,o).map(f=>f.id)),u=Js(r.filter(f=>!p.has(f.id))),m=new Set(u.slice(0,d).map(f=>f.id));return r.map(f=>p.has(f.id)?{...f,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:m.has(f.id)?{...f,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:f)}function Zt(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}function qs(e,t){return e+Math.random()*(t-e)}function td(e,t,a){const r=[...e],s=[];for(;s.length<t&&r.length>0;){const n=r.reduce((l,p)=>l+Math.max(1e-4,a(p)),0);let i=Math.random()*n,o=0;for(let l=0;l<r.length;l+=1)if(i-=Math.max(1e-4,a(r[l])),i<=0){o=l;break}const[d]=r.splice(o,1);d&&s.push(d)}return s}function ad(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function Xs(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function rd(e,t,a){return new Set(e.map(r=>r.riderId).filter(r=>r!=null&&!t.has(r)).slice(0,a))}function sd(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function pt(e){var t;return sd((t=e.role)==null?void 0:t.name)}function nd(e){return et(e).some(({marker:t})=>vt(t))}function id(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function od(e,t){const a=id(e),r=e.hasSuperform===!0?40:1,s=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&pt(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*r*s*n*i;return{attackFactor:a,superformFactor:r,gcLeaderTeamFactor:s,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function ld(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function dd(e,t){var r,s;const a=((r=t[0])==null?void 0:r.riderId)??null;return a==null?null:((s=e.find(n=>n.id===a))==null?void 0:s.activeTeamId)??null}function cd(e,t,a){const r=new Map(t.map(n=>[n.id,n])),s=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=r.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||s.has(i.activeTeamId))&&(s.add(i.activeTeamId),s.size>=a))break}return s}function ud(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),pt(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function md(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const r=t.stageNumber<=10,s=Math.max(1,Math.floor(a*(r?.01:.05))),n=Math.max(s,Math.floor(a*(r?.08:.2)));return{min:s,max:n}}function pd(e,t){return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?{min:.45,max:.75}:{min:.5,max:.85}}function gd(e,t,a,r,s,n,i,o){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||r.distanceKm<=0)return null;const d=e.length,{min:l,max:p}=md(t,a,d),u=Zt(l,p),m=t.isStageRace&&a.stageNumber<=10,f=!t.isStageRace,g=dd(e,n),y=m?cd(s,e,5):new Set,v=m?ud(e):new Map,S=nd(r),T=ad(s,5),M=Xs(n,10),x=new Set([...T,...M]),$=S?rd(i,x,5):new Set,I=ld(a),R=["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain"].includes(a.profile),P=t.isStageRace&&R&&a.stageNumber>=4;let F;const D=new Set;if(P){const _=Xs(n,10),O=Ka(e,o??[],a,{distanceKm:r.distanceKm,elevationGainMeters:r.elevationGainMeters});let G=[];for(const h of O){if(G.length>=5)break;const C=h.rider;if(C.activeTeamId==null||!_.has(C.id))continue;const N=pt(C);(N==="kapitaen"||N==="co-kapitaen")&&(G.includes(C.activeTeamId)||G.push(C.activeTeamId))}if(G.length===0)for(const h of O){if(G.length>=5)break;const C=h.rider;if(C.activeTeamId==null||!_.has(C.id))continue;pt(C)==="edelhelfer"&&(G.includes(C.activeTeamId)||G.push(C.activeTeamId))}if(G.length>0&&Math.random()<.5){const h=Zt(0,G.length-1);F=G[h]}}if(F!=null){const _=e.filter(G=>G.activeTeamId===F),E=_.filter(G=>pt(G)==="kapitaen"),O=_.filter(G=>pt(G)==="co-kapitaen");if(E.length>0){if(E.forEach(G=>D.add(G.id)),E.length===1&&O.length>0){const G=[...O].sort((h,C)=>C.overallRating-h.overallRating||C.id-h.id);D.add(G[0].id)}}else if(O.length>0)[...O].sort((h,C)=>C.overallRating-h.overallRating||C.id-h.id).slice(0,2).forEach(h=>D.add(h.id));else{const G=_.filter(h=>pt(h)==="edelhelfer");if(G.length>0){const h=[...G].sort((C,N)=>N.overallRating-C.overallRating||N.id-C.id);D.add(h[0].id)}}}let B;if(F!=null){const E=e.filter(O=>O.activeTeamId===F).filter(O=>!D.has(O.id));E.length>0&&(B=[...E].sort((G,h)=>h.skills.attack-G.skills.attack||h.overallRating-G.overallRating||h.id-G.id)[0])}const H=e.filter(_=>{if(_.activeTeamId==null||T.has(_.id)||M.has(_.id)||F!=null&&_.activeTeamId===F&&(D.has(_.id)||B!=null&&_.id===B.id)||m&&g!=null&&_.activeTeamId===g||m&&y.has(_.activeTeamId))return!1;const E=pt(_);return!(f&&(E==="kapitaen"||E==="co-kapitaen")||m&&E==="kapitaen"||m&&E==="co-kapitaen"&&v.get(_.activeTeamId)!==!0||E==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(H.length===0)return null;const K=new Map(H.map(_=>[_.id,od(_,{isEarlyStageRace:m,race:t,gcLeaderTeamId:g,stageHasMountainClassifications:S,topMountainIds:$,isHardStage:I})])),w=H.reduce((_,E)=>{var O;return _+(((O=K.get(E.id))==null?void 0:O.finalWeight)??0)},0),A=td(H,Math.max(0,Math.min(u-(B?1:0),H.length)),_=>{var E;return((E=K.get(_.id))==null?void 0:E.finalWeight)??1});if(B&&A.push(B),A.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${A.length}/${u} ausgewählt aus ${H.length}`),console.log(`Gesamtgewicht im Pool: ${w.toFixed(2)}`),console.table(A.map(_=>{var O;const E=K.get(_.id);return{Fahrer:`${_.firstName} ${_.lastName}`,Team:_.activeTeamId,Rolle:((O=_.role)==null?void 0:O.name)??null,Atk:_.skills.attack,Hill:_.skills.hill,Chance:`${((w>0&&E!=null?E.finalWeight/w:0)*100).toFixed(2)}%`,Gewicht:((E==null?void 0:E.finalWeight)??1).toFixed(2),Attacke:`x${((E==null?void 0:E.attackFactor)??1).toFixed(2)}`,Superform:`x${(E==null?void 0:E.superformFactor)??1}`,GC_Team:`x${((E==null?void 0:E.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(E==null?void 0:E.mountainFactor)??1}`,Sprinter:`x${(E==null?void 0:E.sprinterFactor)??1}`}})),console.groupEnd();const U=r.distanceKm*1e3,W=Zt(0,Math.min(1e4,Math.max(0,Math.floor(U*.1)))),te=pd(t,a),J=Math.round(U*qs(te.min,te.max)),Q=Math.round(U*qs(.1,.25)),Y=Math.max(W+1e3,Math.min(J-1e3,J-Q)),j=a.rolledBreakawayBonus??0,L=Zt(3+j,8+j);return{riderIds:A.map(_=>_.id),triggerDistanceMeters:W,groupPhaseEndDistanceMeters:Y,phaseEndDistanceMeters:J,skillBonus:L,malusValue:Zt(5,8),superTeamId:F}}const fd=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),hd=3,bd=7,Qs=120,en=200,tn=180,yd=10,Sa=8e3;function It(e,t,a=Math.random()){const r=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(a*(s-r+1))+r}function vd(e){for(let t=e.length-1;t>0;t-=1){const a=It(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function Va(e,t){return t<=0||e.length===0?[]:vd([...e]).slice(0,Math.min(t,e.length))}function Sd(e,t,a){if(t<=0||e.length===0)return[];const r=[...e],s=[];for(;r.length>0&&s.length<t;){const n=r.reduce((d,l)=>d+Math.max(0,a(l)),0);if(n<=0){s.push(...Va(r,t-s.length));break}let i=Math.random()*n,o=r.length-1;for(let d=0;d<r.length;d+=1)if(i-=Math.max(0,a(r[d])),i<=0){o=d;break}s.push(r[o]),r.splice(o,1)}return s}function kd(e){return fd.has(e.profile)}function $d(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function xd(e,t){if(!kd(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(r=>{if(!$d(r))return[];const s=r.start_km*1e3,n=r.end_km*1e3,i=Math.max(s,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:s,sourceSegmentEndMeters:n}]})}function an(e,t){const a=t==null?e:e.filter(d=>{const l=Math.min(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t)),p=Math.max(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t));return l>=Sa||p>=Sa});if(a.length===0)return null;const r=a[It(0,a.length-1)];if(!r)return null;const s=Math.ceil(r.startMeters),n=Math.floor(r.endMeters);if(n<=s)return null;let i=0;for(;i<12;){const d=It(s,n);if(t==null||Math.abs(d-t)>=Sa)return{triggerDistanceMeters:d,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<r.startMeters?n:s;return t==null||Math.abs(o-t)>=Sa?{triggerDistanceMeters:o,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters}:null}function Td(e,t,a,r=()=>1){const s=e.slice(0,15),n=xd(t,a);if(s.length===0||n.length===0)return[];const i=It(hd,Math.min(bd,s.length)),o=Sd(s,i,r),d=[];for(const m of o){const f=an(n);f&&d.push({riderId:m.id,attackNumber:1,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:It(Qs,en),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}if(d.length===0)return[];const l=d.map(m=>m.riderId),p=Math.floor(l.length*.5),u=new Set(Va(l,p));for(const m of[...d]){if(!u.has(m.riderId))continue;const f=an(n,m.triggerDistanceMeters);f&&d.push({riderId:m.riderId,attackNumber:2,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:It(Qs,en),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}return d.sort((m,f)=>m.triggerDistanceMeters-f.triggerDistanceMeters||m.riderId-f.riderId||m.attackNumber-f.attackNumber)}function wd(e,t,a){var d;if(e.length===0)return[];const r=((d=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:d.teamId)??null,s=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||r!=null&&l.teamId===r));if(s.length===0)return[];const n=new Map;for(const l of s){const p=n.get(l.teamId)??[];p.push(l),n.set(l.teamId,p)}const i=[...n.values()].map(l=>Va(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(It(0,3),i.length);return Va(i,o).map(l=>l.riderId)}function Md(e,t){const a=[],r=[];for(const[s,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){r.push(s);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:r}}function Sr(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}const Rd={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},Id={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},Cd={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},Ed={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},Fd={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function Pd(e){const t=new Map;for(const a of e){const r=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",r);else if(a.appliesTo==="climb_top"){const s=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${s}`,r)}else a.appliesTo==="finish"&&t.set(a.markerType,r)}return t}const ka=20,Nd=120,Ld=300,kr=.025,Dd=.1,_d=.4,Ad=.6,Bd=.8,sa=1,rn=2/3,Hd=.1,$a=10,sn=50,Gd=25,zd=7,Kd=500,Wd=100,jd=.02,Od=.04,Vd=.009,Ud=120,Yd=150,Zd=100,Jd=300,nn=50,$r=85,$t=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],on=5*60,qd=60,Xd=.5,Qd=.3,xa=5e3,ec=2e3,tc=1,ac=2,rc=.05,Di={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},sc={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},Ta=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function be(e,t,a){return Math.max(t,Math.min(a,e))}function fe(e,t){return e+Math.random()*(t-e)}function ln(e){return e[Math.floor(Math.random()*e.length)]}function Gt(e){return Math.round(e*100)/100}function nc(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function dn(e){if(e<2)return 1;const t=be(e,2,20),a=Ta[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let r=1;r<Ta.length;r+=1){const s=Ta[r-1],n=Ta[r];if(t>n.gradientPercent)continue;const i=(t-s.gradientPercent)/Math.max(1e-4,n.gradientPercent-s.gradientPercent),o=s.draftPenaltyShare+(n.draftPenaltyShare-s.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function ic(e){return e==="Flat"?Ud:e==="Abfahrt"?Yd:Number.POSITIVE_INFINITY}function oc(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function Ua(e){return(e.formBonus??0)+(e.raceFormBonus??0)-((e.fatigueMalus??0)+(e.longTermFatigueMalus??0)+(e.shortTermFatigueMalus??0))*.5}function lc(e,t){if(t.length===0)return"";const a=t.reduce((p,u)=>p+u.weight,0),r=t.map(p=>{const u=e.skills[p.key],m=Math.round(p.weight/a*100);return`${Di[p.key]} ${Math.round(u)} (${m}%)`}),s=e.formBonus??0,n=e.raceFormBonus??0,i=(e.fatigueMalus??0)*.5,o=(e.longTermFatigueMalus??0)*.5,d=(e.shortTermFatigueMalus??0)*.5;r.push(`S-Form ${s>=0?"+":""}${s.toFixed(1).replace(".",",")}`),r.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&r.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&r.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),d>0&&r.push(`Akut -${d.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const p of t)l+=(e.mentorBoosts[p.key]||0)*(p.weight/a);return l>0&&r.push(`Mentor +${l.toFixed(1).replace(".",",")}`),r.join(" • ")}function dc(){const e=Math.random();return e<.9?fe(5,20):e<.98?fe(20,40):fe(40,70)}function cn(){const e=Math.random();return e<.9?Gt(fe(-1,1)):e<.995?Gt(ln([-1,1])*fe(1,2)):Gt(ln([-1,1])*fe(3,4))}function cc(){return Gt(fe(-3,3))}function uc(e){const t=[];let a=0,r=dc(),s=fe(-1,1);for(;a<e;){const n=Math.min(e-a,fe(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:r,vector:s}),a+=n,a>=e)break;r=be(r+(Math.random()<.5?-1:1)*fe(2,10),5,70),s=be(s+(Math.random()<.5?-1:1)*fe(0,.5),-1,1)}return t}function _i(e,t){const a=ee(e),r=ee(t);if(a!==r)return a?1:-1;const s=ke(e),n=ke(t);return s&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:s?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function ee(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function ke(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function Jt(e,t,a=!1,r=null){var d;const s="rider"in e?e.rider:null,n=(s==null?void 0:s.specialization1)??null,i=(s==null?void 0:s.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(d=s==null?void 0:s.role)==null?void 0:d.name;r==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function mc(e,t,a=null,r=null,s=!1){var f,g;const n=y=>y.photoFinishScore;if(!t){const y=[...e].sort((S,T)=>S.crossingTimeSeconds-T.crossingTimeSeconds||T.photoFinishScore-S.photoFinishScore||S.riderId-T.riderId),v=((f=y[0])==null?void 0:f.crossingTimeSeconds)??0;return y.map((S,T)=>({riderId:S.riderId,rank:T+1,crossingTimeSeconds:S.crossingTimeSeconds,gapSeconds:Math.max(0,S.crossingTimeSeconds-v),photoFinishScore:S.photoFinishScore}))}const i=[...e].sort((y,v)=>y.crossingTimeSeconds-v.crossingTimeSeconds||v.photoFinishScore-y.photoFinishScore||y.riderId-v.riderId),o=((g=i[0])==null?void 0:g.crossingTimeSeconds)??0,d=[];let l=[],p=0,u=null;const m=()=>{const y=Math.max(0,p-o),v=l.sort((S,T)=>n(T)-n(S)||S.riderId-T.riderId);for(const S of v)d.push({riderId:S.riderId,rank:d.length+1,crossingTimeSeconds:S.crossingTimeSeconds,gapSeconds:y,photoFinishScore:S.photoFinishScore})};for(const y of i){if(l.length===0){l=[y],p=y.crossingTimeSeconds,u=y.crossingTimeSeconds;continue}if(u!=null&&y.crossingTimeSeconds-u<=sa){l.push(y),u=y.crossingTimeSeconds;continue}m(),l=[y],p=y.crossingTimeSeconds,u=y.crossingTimeSeconds}return l.length>0&&m(),d}function pc(e,t,a){const r=e.filter(ke).sort((u,m)=>(u.finishTimeSeconds??0)-(m.finishTimeSeconds??0)||m.photoFinishScore-u.photoFinishScore||u.rider.id-m.rider.id),s=e.filter(u=>!ee(u)).sort(_i),n=e.filter(u=>u.finishStatus==="dnf").sort((u,m)=>m.distanceCoveredMeters-u.distanceCoveredMeters||u.rider.id-m.rider.id),i=[];let o=[],d=null;const l=u=>u.photoFinishScore,p=()=>{i.push(...o.sort((u,m)=>l(m)-l(u)||u.rider.id-m.rider.id))};for(const u of r){const m=u.finishTimeSeconds??0;if(o.length===0){o=[u],d=m;continue}if(d!=null&&m-d<=sa){o.push(u),d=m;continue}p(),o=[u],d=m}return o.length>0&&p(),[...i,...s,...n]}function gc(e,t){const a=ee(e),r=ee(t);if(a!==r)return a?1:-1;const s=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(s)>=.1?s:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:ke(e)&&ke(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:ke(e)?-1:ke(t)?1:e.rider.id-t.rider.id}function un(e){const t=be(e,1,sn);return t<=2?.12*t:t<=$a?.24+(t-2)/Math.max(1,$a-2)*.58:.82+(t-$a)/Math.max(1,sn-$a)*.18}function xr(e,t){const a=Ua(e.rider);return Object.entries(t).reduce((r,[s,n])=>{if(!n)return r;const i=s==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[s]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return r+o*n},0)}function fc(e,t){const a=Ua(e.rider);return Object.entries(t).filter(r=>!!r[1]).map(([r,s])=>{const n=r,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:s,effectiveSkill:o,contribution:o*s}})}function hc(e,t,a){let r=t;for(;r>0;){const n=e[r-1].distanceCoveredMeters-e[r].distanceCoveredMeters;if(n<=0||n>=a)break;r-=1}let s=t;for(;s<e.length-1;){const n=e[s].distanceCoveredMeters-e[s+1].distanceCoveredMeters;if(n<=0||n>=a)break;s+=1}return{startIndex:r,endIndex:s,size:s-r+1,positionInGroup:t-r}}function bc(e,t){if(e<Gd)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class Ai{constructor(t,a){var H,K;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.superTeamProtectedLeaderIds=new Set,this.superTeamBonusAmount=0,this.superTeamMalusAmount=0,this.superTeamStartPercent=0,this.superTeamEndPercent=0,this.superTeamBreakawayRiderCaught=!1,this.hasLoggedFinishSprintTieBreak=!1,this.hasAppliedSprintLeadoutBonuses=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const r=(H=t.race.country)==null?void 0:H.code3;r&&(t.riders=t.riders.map(w=>{var U;const A=w.nationality||((U=w.country)==null?void 0:U.code3);if(A&&A.trim().toUpperCase()===r.trim().toUpperCase()){const W={...w,skills:{...w.skills}},te=Math.random(),J=t.stage.profile,Q=J==="ITT"||J==="TTT",Y=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(J==="Cobble"||J==="Cobble_Hill")&&Y.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(J)||Y.push("mountain","mediumMountain");const E=[...(O=>{const G=[...Y],h=[];if(Q){h.push("timeTrial");const C=Math.min(O-1,G.length);for(let N=0;N<C;N++){const z=Math.floor(Math.random()*G.length);h.push(G.splice(z,1)[0])}}else{const C=Math.min(O,G.length);for(let N=0;N<C;N++){const z=Math.floor(Math.random()*G.length);h.push(G.splice(z,1)[0])}}return h})(5)].sort(()=>Math.random()-.5);if(W.homeEffectSkills=E,te<.05){W.homeEffect="home_pressure";for(const O of E)W.skills[O]=Math.max(0,W.skills[O]-.5)}else if(te<.1){W.homeEffect="super_home";const O=E[0];W.skills[O]=Math.min(100,W.skills[O]+3);for(let G=1;G<5;G++){const h=E[G];W.skills[h]=Math.min(100,W.skills[h]+1)}}else{W.homeEffect="normal_home";for(const O of E)W.skills[O]=Math.min(100,W.skills[O]+1)}return W}return w})),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=Kl(t.stage.profile),this.skillWeightRuleMap=Gl(t.skillWeightRules??[]),this.skillWeightConfigMap=zl(t.skillWeightRules??[]),this.stageScoringWeightMap=Pd(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=uc(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const s=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=s!=null?be(s/100,0,1):fe(Ad,Bd);const n=t.stage.finalPushStartPercent;this.finalPushStartRatio=n!=null?be(n/100,this.lateStageStartRatio,1):be(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const i=Jl(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(i.map(w=>[w.riderId,w])),i.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",i.map(A=>({riderId:A.riderId,type:A.type,severity:A.severity,kmMark:A.triggerDistanceKm,waitDurationSeconds:A.waitDurationSeconds,supportRiderIds:A.supportRiderIds})));const w=i.filter(A=>A.isMassCrashTrigger);w.length>0&&w.forEach(A=>{var U;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${A.riderId} bei Km ${A.triggerDistanceKm}. Potenziell betroffene Fahrer (${(U=A.massCrashPotentialRiderIds)==null?void 0:U.length}):`,A.massCrashPotentialRiderIds)})}const o=t.riders.map(w=>{const A={rider:w,riderName:`${w.firstName} ${w.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:cc(),microForm:cn(),nextFormUpdateMeter:fe(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(w.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(A),A}),d=new Map(o.map(w=>[w.rider.id,w.dailyForm]));this.stageFavorites=oi(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d});const l=this.stageFavorites.filter(w=>w.kind==="rider"&&w.riderId!=null).slice(0,15).map(w=>t.riders.find(A=>A.id===w.riderId)??null).filter(w=>w!=null),p=((K=t.gcStandings.find(w=>w.rank===1))==null?void 0:K.riderId)??null,u=Td(l,t.stage,t.stageSummary,w=>Math.max(1,Math.pow(10,(w.skills.attack-65)/10))*(w.id===p?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const w of u){const A=this.precalculatedStageAttacksByRiderId.get(w.riderId)??[];A.push(w),this.precalculatedStageAttacksByRiderId.set(w.riderId,A)}this.breakawayPlan=gd(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings,t.teams);const m=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=m.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=m.fallbackCheckpointsMeters;for(const w of o)w.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const f=ed(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d}),g=new Map(f.map(w=>[w.id,w])),y=o.map(w=>{const A=g.get(w.rider.id)??w.rider;return{...w,rider:A,riderName:`${A.firstName} ${A.lastName}`,dailyForm:w.dailyForm+(A.specialFormDelta??0)}}),v=f.filter(w=>w.hasSuperform),S=f.filter(w=>w.hasSupermalus);(v.length>0||S.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:v.map(w=>`${w.firstName} ${w.lastName}`),supermalus:S.map(w=>`${w.firstName} ${w.lastName}`)});const T=this.resolveStartOrder(y),M=new Map((this.bootstrap.teamStartOrder??[]).map((w,A)=>[w,A]));if(this.riders=T.map((w,A)=>({...w,startOffsetSeconds:this.resolveStartOffsetSeconds(w,A,M)})),this.riders.forEach(w=>this.syncRiderTelemetry(w)),this.breakawayPlan&&this.breakawayPlan.superTeamId!=null){this.superTeamId=this.breakawayPlan.superTeamId,this.superTeamBonusAmount=Sr(2,6),this.superTeamMalusAmount=Sr(4,8),this.superTeamStartPercent=fe(.4,.6),this.superTeamEndPercent=fe(.86,.96);const w=Y=>(Y??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),A=t.riders.filter(Y=>Y.activeTeamId===this.superTeamId),U=A.filter(Y=>{var j;return w((j=Y.role)==null?void 0:j.name)==="kapitaen"}),W=A.filter(Y=>{var j;return w((j=Y.role)==null?void 0:j.name)==="co-kapitaen"});if(U.length>0){if(U.forEach(Y=>this.superTeamProtectedLeaderIds.add(Y.id)),U.length===1&&W.length>0){const Y=[...W].sort((j,L)=>L.overallRating-j.overallRating||L.id-j.id);this.superTeamProtectedLeaderIds.add(Y[0].id)}}else if(W.length>0)[...W].sort((j,L)=>L.overallRating-j.overallRating||L.id-j.id).slice(0,2).forEach(j=>this.superTeamProtectedLeaderIds.add(j.id));else{const Y=A.filter(j=>{var L;return w((L=j.role)==null?void 0:L.name)==="edelhelfer"});if(Y.length>0){const j=[...Y].sort((L,_)=>_.overallRating-L.overallRating||_.id-L.id);this.superTeamProtectedLeaderIds.add(j[0].id)}}const te=t.teams.find(Y=>Y.id===this.superTeamId),J=te?te.name:`Team ${this.superTeamId}`;this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,riderTeamId:this.superTeamId,type:"superteam",tone:"neutral",title:`Superteam des Tages: ${J}`,detail:`Dieses Team hat sich heute zusammengeschlossen, um seinen Leader zu unterstützen! Die Helfer erhalten zwischen ${(this.superTeamStartPercent*100).toFixed(0)}% und ${(this.superTeamEndPercent*100).toFixed(0)}% der Etappe einen Bonus von +${this.superTeamBonusAmount} auf Berg, Hill, Medium Mountain und Flat. Danach folgt ein individueller Malus von -4 bis -8 wegen Erschöpfung.`});const Q=this.riders.find(Y=>{var j;return Y.rider.activeTeamId===this.superTeamId&&((j=this.breakawayPlan)==null?void 0:j.riderIds.includes(Y.rider.id))});Q&&(this.superTeamBreakawayRiderId=Q.rider.id)}for(const w of this.riders){const A=w.rider.homeEffectSkills,U=W=>sc[W]||W;if(w.rider.homeEffect==="super_home"){const W=A&&A.length===5?`${U(A[0])} (+3), ${U(A[1])} (+1), ${U(A[2])} (+1), ${U(A[3])} (+1), ${U(A[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${W})`})}if(w.rider.homeEffect==="home_pressure"){const W=A?A.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${W})`})}if(w.rider.homeEffect==="normal_home"){const W=A?A.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${W})`})}w.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),w.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),w.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const x=this.bootstrap.stage.rolledWetterName??"Sonnig",$=this.bootstrap.stage.rolledEffektSturz??0,I=this.bootstrap.stage.rolledEffektDefekt??0,R=this.bootstrap.stage.rolledWindkantenGefahr??0,P=this.bootstrap.stage.rolledEffektFatigue??0,F=this.bootstrap.stage.rolledBreakawayBonus??0,D=[];$>0&&D.push(`Sturzwahrscheinlichkeit +${$.toFixed(1)}%`),I>0&&D.push(`Defektwahrscheinlichkeit +${I.toFixed(1)}%`),R>0&&D.push(`Windkanten-Gefahr +${(R*100).toFixed(1)}%`),P>0&&D.push(`Fatigue +${P.toFixed(1)}%`),F>0&&D.push(`Ausreißer-Bonus +${F.toFixed(1)}`);const B=D.length>0?`Wettereinflüsse: ${D.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${x}`,detail:B})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const r=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(r),a-=r}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(r=>({riderId:r.rider.id,riderName:r.riderName,startOffsetSeconds:r.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(r),hasStarted:r.hasStarted||ee(r),distanceCoveredMeters:r.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-r.distanceCoveredMeters),segmentStartKm:r.segmentStartKm,segmentEndKm:r.segmentEndKm,segmentStartElevation:r.segmentStartElevation,segmentEndElevation:r.segmentEndElevation,activeTerrain:ke(r)?"Finish":r.activeTerrain,skillName:ke(r)?"Finish":r.skillName,skillBreakdown:ke(r)?"":r.skillBreakdown,baseSkill:r.baseSkill,teamGroupBonus:r.teamGroupBonus,effectiveSkill:r.effectiveSkill,staminaPenalty:r.staminaPenalty,elevationPenalty:r.elevationPenalty,dailyForm:r.dailyForm,microForm:r.microForm,gradientPercent:r.gradientPercent,gradientModifier:r.gradientModifier,windModifier:r.windModifier,draftModifier:r.draftModifier,draftNearbyRiderCount:r.draftNearbyRiderCount,draftPackFactor:r.draftPackFactor,currentSpeedMps:r.currentSpeedMps,photoFinishScore:r.photoFinishScore,leadoutBonus:r.leadoutBonus,leadoutRiderId:r.leadoutRiderId,leadoutContributions:r.leadoutContributions,lastSplitLabel:r.lastSplitLabel,lastSplitTimeSeconds:r.lastSplitTimeSeconds,splitTimes:{...r.splitTimes},finishTimeSeconds:Number.isFinite(r.finishTimeSeconds??Number.NaN)?r.finishTimeSeconds:null,finishStatus:r.finishStatus,statusReason:r.statusReason,isAttacking:r.isAttacking,isBreakaway:r.isBreakaway,isLeadingGroup:r.isLeadingGroup,hasSuperform:r.rider.hasSuperform===!0,hasSupermalus:r.rider.hasSupermalus===!0,isFinished:ke(r)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(r=>r.appliedIncident?[r.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus},superTeamId:this.superTeamId}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let r=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(r=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(r==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,d)=>Math.max(o,d.distanceCoveredMeters),0);r=Number((i/1e3).toFixed(2))}const s={id:this.nextMessageId,...t,riderTeamId:a,kmMark:r};this.messages.unshift(s),this.allEvents.push(s),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(r=>[r.rider.id,r]));return this.intermediateMarkers.map(r=>{const s=t.map(i=>i.markerCrossings[r.key]??null).filter(i=>i!=null),n=mc(s,!this.isTimeTrialMode,r.markerType,a,this.isClimberMalusStage());return{markerKey:r.key,markerLabel:r.label,markerType:r.markerType,markerCategory:r.markerCategory,kmMark:r.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.isTimeTrialMode?[...this.riders].sort(_i):pc(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(s=>s.finishStatus!=="dnf").reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0);let r=0;for(const s of t)ke(s)&&(r+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:r,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(ee)}advanceSubstep(t){const a=this.elapsedSeconds,r=a+t,s=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();if(this.updateBreakawayPhaseState(),this.superTeamId!=null&&this.superTeamBreakawayRiderId!=null&&!this.superTeamBreakawayRiderCaught){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&!ee(l)&&this.riders.filter(m=>this.superTeamProtectedLeaderIds.has(m.rider.id)&&!ee(m)).some(m=>m.distanceCoveredMeters>=l.distanceCoveredMeters)&&(this.superTeamBreakawayRiderCaught=!0,l.breakawayMalus=0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} von Leader eingeholt!`,detail:"Der Ausreißer wurde von seinem Kapitän eingeholt und unterstützt das Team ab jetzt mit frischen Kräften!"}))}if(this.superTeamBreakawayRiderCaught&&this.superTeamBreakawayRiderId!=null){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&(l.breakawayMalus=0)}for(const l of this.riders){if(ee(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,u=Math.max(0,r-p);if(u<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-u),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const m=this.currentSegment(l),f=this.currentWindZone(l);if(!m||!f){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=p,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const y=Jt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=y,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[];continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,s);const g=this.calculateBasePhysics(l,m,f);l.activeTerrain=m.terrain,l.skillName=g.skillName,l.skillBreakdown=g.skillBreakdown,l.baseSkill=g.baseSkill,l.teamGroupBonus=g.teamGroupBonus,l.effectiveSkill=g.effectiveSkill,l.staminaPenalty=g.staminaPenalty,l.elevationPenalty=g.elevationPenalty,l.gradientPercent=g.gradientPercent,l.gradientModifier=g.gradientModifier,l.windModifier=g.windModifier,l.tempSpeedMps=g.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=g.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*u}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,r);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const p of this.riders)l.push(p);l.sort(gc);for(let p=0;p<l.length;p+=1){const u=l[p];if(ee(u))continue;const m=this.isActiveBreakawayRider(u),f=u.tempSpeedMps/14,g=Math.max(5,50*f),y=this.currentSegment(u),v=Math.max(15,150*f),S=Math.max(g,Math.min(v,ic(y==null?void 0:y.terrain))),T=hc(l,p,S),M=T.size,x=un(M),$=bc(M,T.positionInGroup);let I=0,R=Number.POSITIVE_INFINITY,P=null;for(let L=p-1;L>=0;L-=1){const _=l[L],E=_.distanceCoveredMeters-u.distanceCoveredMeters;if(E>=S+Hd)break;!this.canReceiveDraftFromCandidate(u,_)||this.isActiveBreakawayRider(_)||E<=0||E>=S||(I+=1,E<=R&&(R=E,P=_))}if(I===0||!P){if(m)continue;u.draftModifier=1,u.draftNearbyRiderCount=0,u.draftPackFactor=0,u.currentSpeedMps=u.tempSpeedMps,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,u.isLeadingGroup=!0,this.applyCaptainWaitLogic(u);continue}const F=ee(P)?P.tempSpeedMps:P.currentSpeedMps,D=R,B=D<=g?1:1-(D-g)/Math.max(1e-4,S-g),H=this.currentWindZone(u),K=(H==null?void 0:H.vector)??0,w=(H==null?void 0:H.windSpeedKph)??0,A=-K*(w/70),W=Math.max(.3,.35+.35*A)*Math.min(1,f)*rn,te=be((y==null?void 0:y.gradient_percent)??0,-20,20),J=dn(te),Y=1+($?0:W*B*x*J),j=u.tempSpeedMps*Y;if(!(m&&Y<=u.draftModifier)){if(u.draftModifier=Y,u.draftNearbyRiderCount=M,u.draftPackFactor=x,u.isLeadingGroup=$,j>F){if(u.tempSpeedMps>P.tempSpeedMps){u.currentSpeedMps=j,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t;continue}if(D<1){u.currentSpeedMps=F,u.nextDistanceCoveredMeters=P.distanceCoveredMeters+F*t,m||this.applyCaptainWaitLogic(u);continue}u.currentSpeedMps=Math.min(j,F+2),u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,m||this.applyCaptainWaitLogic(u);continue}u.currentSpeedMps=j,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,m||this.applyCaptainWaitLogic(u)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(ee(l))continue;if(this.superTeamId!=null&&l.rider.activeTeamId===this.superTeamId&&!this.superTeamProtectedLeaderIds.has(l.rider.id)){const S=l.rider.id===this.superTeamBreakawayRiderId;if(!S||this.superTeamBreakawayRiderCaught){const T=l.distanceCoveredMeters/this.stageDistanceMeters;let M=0,x=!1,$=!1;S?T<this.superTeamEndPercent?x=!0:l.superTeamActiveLogged&&($=!0):T>=this.superTeamStartPercent&&T<this.superTeamEndPercent?x=!0:T>=this.superTeamEndPercent&&l.superTeamActiveLogged&&($=!0),x?(M=this.superTeamBonusAmount,l.superTeamActiveLogged||(l.superTeamActiveLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} leistet Führungsarbeit!`,detail:S?`Der eingeholte Ausreißer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`:`Der Edelhelfer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`}))):$&&(l.superTeamMalusAmount==null&&(l.superTeamMalusAmount=Sr(4,8)),M=-l.superTeamMalusAmount,l.superTeamExhaustedLogged||(l.superTeamExhaustedLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"warning",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} ist erschöpft!`,detail:`Die Führungsarbeit hat ihren Tribut gefordert. Der Fahrer erhält für den Rest der Etappe einen Malus von -${l.superTeamMalusAmount} auf Berg-, Hügel- und Flachpassagen.`}))),l.originalSkills||(l.originalSkills={flat:l.rider.skills.flat,mountain:l.rider.skills.mountain,mediumMountain:l.rider.skills.mediumMountain,hill:l.rider.skills.hill}),l.rider.skills.flat=l.originalSkills.flat+M,l.rider.skills.mountain=l.originalSkills.mountain+M,l.rider.skills.mediumMountain=l.originalSkills.mediumMountain+M,l.rider.skills.hill=l.originalSkills.hill+M}}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds)continue;const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,u=Math.max(0,r-p);if(u<=0)continue;const m=l.distanceCoveredMeters,f=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*u,g=l.pendingIncident;if(g&&m<g.triggerDistanceMeters&&f>=g.triggerDistanceMeters){const S=Math.max(.1,l.currentSpeedMps),T=Math.max(0,(g.triggerDistanceMeters-m)/S);l.distanceCoveredMeters=g.triggerDistanceMeters,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.applyIncident(l,g,p+T),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const y=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,f-l.distanceCoveredMeters)>=y){const S=y/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),l.finishTimeSeconds=p+S,l.currentSpeedMps=0;const T=Jt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=T,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[]}else l.distanceCoveredMeters=f,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,m,l.distanceCoveredMeters,p),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-u),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!ee(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=cn(),l.nextFormUpdateMeter+=fe(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),p=this.riders.filter(m=>l.has(m.rider.id)&&!ee(m)),u=this.riders.filter(m=>!l.has(m.rider.id)&&!ee(m));if(p.length>0&&u.length>0){const m=p.reduce((g,y)=>y.distanceCoveredMeters>g.distanceCoveredMeters?y:g,p[0]);u.reduce((g,y)=>y.distanceCoveredMeters>g.distanceCoveredMeters?y:g,u[0]).distanceCoveredMeters>=m.distanceCoveredMeters&&(m.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:m.rider.id,riderName:m.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${m.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const d=Md(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of d.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!ee(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const r=new Map;for(const s of this.riders){if(ee(s)||s.rider.activeTeamId==null||a<=s.startOffsetSeconds)continue;const n=r.get(s.rider.activeTeamId)??[];n.push(s),r.set(s.rider.activeTeamId,n)}for(const s of r.values()){const n=s[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,s.length),d=[...s].sort((m,f)=>f.effectiveSkill-m.effectiveSkill||m.rider.id-f.rider.id).slice(0,o).reduce((m,f)=>m+f.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-s.length),p=Math.max(1,d-l),u=this.resolveTimeTrialSpeedMps(p,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*jl(i.terrain,this.bootstrap.skillWeightRules??[]);for(const m of s){const f=Math.max(t,m.startOffsetSeconds),g=Math.max(0,a-f);m.currentSpeedMps=u,m.tempSpeedMps=u,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+u*g}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const s=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?s.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,d=i.rider.activeTeamId!=null?s.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==d?o-d:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(s=>[s.riderId,s.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((s,n)=>{const i=a.get(s.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(s)-this.resolveProjectedIttStartScore(n)||s.rider.id-n.rider.id}):[...t].sort((s,n)=>s.rider.skills.timeTrial-n.rider.skills.timeTrial||s.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,r=0;for(const s of this.bootstrap.stageSummary.segments){const n=(s.start_km+s.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,s.terrain),d=i>0?this.resolveWeightedSkill(t.rider,s.terrain,i):o,l=Math.max(0,o.value-d.value),{effectiveSkill:p}=this.resolveEffectiveSkill({rider:t,baseSkill:d.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),u=be(s.gradient_percent,-20,20),m=u>0?Math.exp(-.11*u):1-u*.06,f=this.windZones.find(y=>n>=y.startMeter&&n<=y.endMeter)??this.windZones[this.windZones.length-1],g=f?1+f.vector*(f.windSpeedKph/100)*.52:1;a+=p*m*g*s.length_km,r+=s.length_km}return r>0?a/r:0}resolveStartOffsetSeconds(t,a,r){if(this.isIndividualTimeTrial)return a*Nd;if(this.isTeamTimeTrial){const s=t.rider.activeTeamId;return(s!=null?r.get(s)??0:0)*Ld}return 0}buildIntermediateMarkers(){return et(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||vt(t)).map(({key:t,label:a,marker:r,kmMark:s})=>({key:t,distanceMeters:s*1e3,label:a,markerType:r.type,markerCategory:r.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(d=>d.distanceMeters<t.groupPhaseEndDistanceMeters),r=this.stageDistanceMeters*Qd,s=a.some(d=>d.distanceMeters<=r);if(!(a.length<=1||!s))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(xa,Math.ceil(r/xa)*xa);for(let d=o;d<t.groupPhaseEndDistanceMeters;d+=xa)i.push(d);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,r){const s=oc(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,d=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),p=Math.min(85,o.value)+l,u=this.isTimeTrialMode?0:t.teamGroupBonus,m=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:f,staminaPenalty:g,elevationPenalty:y}=this.resolveEffectiveSkill({rider:t,baseSkill:p,staminaPenalty:d,teamGroupBonus:u,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:m}),v=be(a.gradient_percent,-20,20),S=v>0?Math.exp(-.11*v):1-v*.06,T=1+r.vector*(r.windSpeedKph/100)*.52,M=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:s,skillBreakdown:o.breakdown,baseSkill:p,teamGroupBonus:u,effectiveSkill:f,staminaPenalty:g,elevationPenalty:y,gradientPercent:v,gradientModifier:S,windModifier:T,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(f,t.distanceCoveredMeters,a,S,T):this.resolveRoadStageSpeedMps(f,t.distanceCoveredMeters,a,S,T,M)}}resolveRoadStageSpeedMps(t,a,r,s,n,i){const o=this.resolveSkillSpreadFactor(a,r),d=this.resolveSegmentElevation(r,a),l=this.resolveElevationSkillSpreadFactor(r,d),m=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,m*s*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const r=Math.max(0,a-Kd),s=Math.floor(r/Wd);return t.terrain==="Mountain"?1+(s*Od+s*Math.max(0,s-1)*Vd/2):1+s*jd}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const r=a.filter(n=>n.activeTerrain===t.activeTerrain);return(r.length>0?r:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,r){if(r<=1)return{draftModifier:1,draftPackFactor:0};const s=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,d=-i*(o/70),p=Math.max(.3,.35+.35*d)*Math.min(1,s)*rn,u=be(a.gradient_percent,-20,20),m=dn(u),f=un(r);return{draftModifier:1+p*f*m,draftPackFactor:f}}resolveBreakawayTimeGapPenalty(t){if(t<on)return 0;const a=Math.floor((t-on)/qd);return Xd+a}recordBreakawayFallbackCheckpointCrossings(t,a,r,s,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>r)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const d=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?s+d-t.startOffsetSeconds:s+d);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let s=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((d,l)=>l.distanceCoveredMeters-d.distanceCoveredMeters||l.currentSpeedMps-d.currentSpeedMps||d.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,s;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const d=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!d)break;const l=n.markerCrossings[d.key]??null;if(!l)break;const p=t.map(u=>u.markerCrossings[d.key]??null).filter(u=>u!=null).sort((u,m)=>u.crossingTimeSeconds-m.crossingTimeSeconds||u.riderId-m.riderId)[0]??null;if(p){const u=l.crossingTimeSeconds-p.crossingTimeSeconds;s=this.resolveBreakawayTimeGapPenalty(u),this.breakawayGapStatus={gapSeconds:u,penalty:s,kmMark:d.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const d=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[d]??null;if(l==null)break;const p=t.map(u=>u.breakawayFallbackCheckpointTimes[d]??null).filter(u=>u!=null).sort((u,m)=>u-m)[0]??null;if(p!=null){const u=l-p;s=this.resolveBreakawayTimeGapPenalty(u),this.breakawayGapStatus={gapSeconds:u,penalty:s,kmMark:d<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[d]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return s}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),r=this.riders.filter(o=>!ee(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),s=this.riders.filter(o=>!ee(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(r.length===0||s.length===0){this.breakawayGapStatus=null;return}const n=[...r].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null,i=[...s].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const d=this.intermediateMarkers[o];if(!d)continue;const l=n.markerCrossings[d.key]??null,p=i.markerCrossings[d.key]??null;if(!l||!p)continue;const u=p.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:u,penalty:this.resolveBreakawayTimeGapPenalty(u),kmMark:d.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const d=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(d==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,p=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||p==null)continue;const u=p-l;this.breakawayGapStatus={gapSeconds:u,penalty:this.resolveBreakawayTimeGapPenalty(u),kmMark:d/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=new Set(a.riderIds),s=this.riders.filter(o=>!ee(o)&&r.has(o.rider.id));if(s.length===0)return;const n=this.riders.filter(o=>!ee(o)&&!r.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(s,n);for(const o of s)o.breakawayGapPenalty=i;for(const o of s){const d=this.currentSegment(o);if(!d)continue;const p=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=p,o.tempSpeedMps=this.resolveRoadStageSpeedMps(p,o.distanceCoveredMeters,d,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(d.terrain));const u=this.resolveMaxBreakawayDraftModifier(o,d,s.length);o.draftModifier=u.draftModifier,o.draftNearbyRiderCount=Math.max(0,s.length-1),o.draftPackFactor=u.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*u.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,r,s,n){return this.resolveRoadStageSpeedMps(t,a,r,s,n,.5)}syncRiderTelemetry(t,a=null){var i;const r=this.currentSegment(t),s=this.currentWindZone(t);if(ee(t)||!r||!s){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,r,s);t.segmentStartKm=r.start_km,t.segmentEndKm=r.end_km,t.segmentStartElevation=r.start_elevation,t.segmentEndElevation=r.end_elevation,t.activeTerrain=r.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),r=this.riders.reduce((n,i)=>ee(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(r<=t.phaseEndDistanceMeters)return!1;let s=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(r<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<rc){n.breakawayMalus=0,s=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),d=Math.floor(o/ec),l=Math.min(ac,n.breakawayInitialMalus),p=Math.max(l,n.breakawayInitialMalus-d*tc),u=Gt(p);u!==n.breakawayMalus&&(n.breakawayMalus=u,s=!0)}return s}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const r=new Set(a.riderIds);for(const s of this.riders)ee(s)||!r.has(s.rider.id)||this.syncRiderTelemetry(s,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(s=>t.riderIds.includes(s.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const s of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:s.rider.id,riderName:s.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(s.rider.id,s.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let r=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),r=!0}if(this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayMalus=t.malusValue,s.breakawayInitialMalus=t.malusValue,s.breakawayRecoveryStartDistanceMeters=null,s.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return r}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=this.riders.filter(o=>!ee(o)&&a.riderIds.includes(o.rider.id));if(r.length===0)return;const s=[...r].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0];if(!s)return;const n=Math.max(.1,s.currentSpeedMps),i=s.distanceCoveredMeters+n*t;for(const o of r){if(Math.max(0,s.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?yd:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const r=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(r==null||r.isCounterAttack)return!0;const s=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(s==null?void 0:s.isCounterAttack)===!0&&s.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(r=>r.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const r=this.resolvePreStageGcRank(t);return r!=null?`${a} (${r}.)`:a}triggerStageAttacksForRider(t,a,r,s){if(ee(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||r<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(r/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const d=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/d),p=s+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:p,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const u=new Set(this.activeStageAttacksByRiderId.keys()),m=this.stageFavorites.slice(0,20).filter(y=>{if(y.kind!=="rider"||y.riderId==null)return!1;const v=this.riders.find(T=>T.rider.id===y.riderId);if(!v||ee(v))return!1;const S=t.distanceCoveredMeters-v.distanceCoveredMeters;return S>=0&&S<=150}),f=wd(m,t.rider.id,u),g=[];for(const y of f){const v=this.riders.find(S=>S.rider.id===y);!v||ee(v)||this.activeStageAttacksByRiderId.has(y)||(this.activeStageAttacksByRiderId.set(y,{riderId:y,remainingSeconds:tn,startedAtElapsedSeconds:p,triggerDistanceMeters:v.distanceCoveredMeters,durationSeconds:tn,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),v.isAttacking=!0,g.push({riderId:y,riderName:this.formatRiderWithPreStageGc(y,v.riderName),riderTeamId:v.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:p,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const y of g)this.pushMessage({elapsedSeconds:p,riderId:y.riderId,riderName:y.riderName,type:"counter_attack",tone:"warning",title:`${y.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const r of t){if(r.finishStatus==="dnf")continue;const s=a[a.length-1];if(!s||Math.abs(s.distanceMeter-r.distanceCoveredMeters)>=ka){a.push({riderIds:[r.rider.id],riderCount:1,distanceMeter:r.distanceCoveredMeters,distanceSum:r.distanceCoveredMeters});continue}s.riderIds.push(r.rider.id),s.riderCount+=1,s.distanceSum+=r.distanceCoveredMeters,s.distanceMeter=s.distanceSum/s.riderCount}return a.map(({distanceSum:r,...s})=>s)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!ee(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),r=new Map;let s=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],d=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-d<ka;){const u=a[n].rider.activeTeamId;u!=null&&r.set(u,(r.get(u)??0)+1),n+=1}for(;s<a.length&&d-a[s].distanceCoveredMeters>=ka;){const u=a[s].rider.activeTeamId;if(u!=null){const m=(r.get(u)??0)-1;m<=0?r.delete(u):r.set(u,m)}s+=1}const l=o.rider.activeTeamId,p=l==null?0:Math.max(0,(r.get(l)??0)-1);t.set(o.rider.id,p===0?0:Gt(p*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?zd:0,r=this.resolveBreakawaySkillBonus(t.rider),s=t.baseSkill+Ua(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+r+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,s),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const r=be(this.stageDistanceMeters/1e3,Zd,Jd),s=this.interpolateStaminaDistanceValue(r),n=be(t,nn,$r),i=($r-n)/($r-nn),o=s/3+i*s,d=this.stageDistanceMeters<=0?0:be(a/this.stageDistanceMeters,0,1);return o*d**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=$t[0].kmMark)return $t[0].value;for(let a=0;a<$t.length-1;a+=1){const r=$t[a],s=$t[a+1];if(t<=s.kmMark){const n=Math.max(1e-4,s.kmMark-r.kmMark),i=(t-r.kmMark)/n;return r.value+(s.value-r.value)*i}}return $t[$t.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/kr),r=Math.max(1,Math.ceil(t/kr)),s=fe(Dd,_d),n=Array.from({length:r},()=>fe(.2,1.2)),i=n.reduce((l,p)=>l+p,0),o=Array.from({length:a+1},()=>1);o[0]=s;let d=0;for(let l=1;l<=r;l+=1)d+=n[l-1]??0,o[l]=s+(1-s)*(d/i);return o}resolveSkillSpreadFactor(t,a){const r=this.stageDistanceMeters<=0?1:be(t/this.stageDistanceMeters,0,1),s=Math.min(this.spreadCurve.length-1,Math.floor(r/kr)),n=this.spreadCurve[s]??1;if(r<=this.lateStageStartRatio)return n;const i=Ol(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),d=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=be((r-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),p=this.interpolateFinalSpread(o,l);if(o<=1&&d<=1)return n;if(r<this.finalPushStartRatio||d<=o)return Math.max(n,p);const u=be((r-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),m=o+(d-o)*u;return Math.max(n,m)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const r=Ti(this.simulationMode,t,this.skillWeightRuleMap).map(s=>({key:s.key,weight:s.weight}));return this.weightedSkillComponentsByTerrain.set(t,r),r}resolveWeightedSkill(t,a,r=0){const s=this.resolveWeightedSkillComponents(a),n=r>0||t.mentorBoosts?{...t.skills}:t.skills;if(r>0&&(n.stamina=Math.max(0,n.stamina-r)),t.mentorBoosts)for(const[l,p]of Object.entries(t.mentorBoosts))typeof p=="number"&&(n[l]+=p);let i=0,o=0;for(const l of s)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:Wl(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,s)}}resolveSkillBreakdown(t,a,r){const s=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(s);if(n!==void 0)return n;const i=lc(t,r);return this.skillBreakdownCache.set(s,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const r=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,s=Math.max(0,100-r)/1e3,n=this.resolveElevationBucket(a);return s*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const r=a??this.interpolateElevation(t.distanceCoveredMeters),s=this.resolveElevationBucket(r);return s===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=s,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,r)),t.elevationPenalty}resolveSegmentElevation(t,a){const r=t.start_km*1e3,s=t.end_km*1e3,n=Math.max(1e-4,s-r),i=be((a-r)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const s=be(t,0,this.stageDistanceMeters)/1e3;if(s<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(s<=o.kmMark){const d=Math.max(1e-4,o.kmMark-i.kmMark),l=(s-i.kmMark)/d;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),xr(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var u;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(ke).sort((m,f)=>(m.finishTimeSeconds??0)-(f.finishTimeSeconds??0)||f.photoFinishScore-m.photoFinishScore||m.rider.id-f.rider.id);if(t.length===0)return;const a=[];let r=null;for(const m of t){const f=m.finishTimeSeconds??0;if(a.length===0){a.push(m),r=f;continue}if(r!=null&&f-r<=sa){a.push(m),r=f;continue}break}const s=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=m=>m.photoFinishScore,o=[...a].sort((m,f)=>i(f)-i(m)||m.rider.id-f.rider.id),d=((u=o[0])==null?void 0:u.finishTimeSeconds)??0,l=this.finishWeightProfile,p=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${p} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${sa.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${s}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((m,f)=>{const g=fc(m,l).map($=>`${Di[$.skillKey]} ${$.contribution.toFixed(2)} = ${$.effectiveSkill.toFixed(2)} x ${($.weight*100).toFixed(0)}%`).join(" | "),y=m.finishTimeSeconds??0,v=y-d,S=v<=1e-4?`${y.toFixed(2)} s`:`${y.toFixed(2)} s (+${v.toFixed(2)} s)`,T=this.calculatePhotoFinishScore(m),M=m.leadoutBonus??0,x=Jt(m,s,n);console.log(`#${f+1} Zielsprint | ${m.riderName} | Zeit ${S} | Score (ohne Boni): ${T.toFixed(2)} -> Score (mit Boni): ${m.photoFinishScore.toFixed(2)} [SpecAdj: ${x>0?"+":""}${x.toFixed(2)}, Leadout: +${M.toFixed(2)}] | ID-Tiebreak ${m.rider.id} | (${g})`)}),console.groupEnd()}recordIntermediateSplits(t,a,r,s,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>r)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,d=Math.max(0,this.isTimeTrialMode?s+o-t.startOffsetSeconds:s+o);let l=this.resolveMarkerCrossingScore(t,i);const p=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;p&&(l+=Jt(t,p,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=d,t.splitTimes[i.key]=d,t.splitTimes[i.label]=d,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:d,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return xr(t,this.resolveSprintWeightProfile());const r=xr(t,this.resolveClimbWeightProfile(a.markerCategory)),s=nc(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return r+s}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??Rd}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??Fd[a]}calculatePreLeadoutFinishScore(t){const r=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,s=Ua(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[d,l])=>{if(!l)return o;const p=d==="stamina"?r:0,u=Math.max(0,t.rider.skills[d]+s+t.dailyForm+t.microForm+t.teamGroupBonus-p);return o+u*l},0),i=Jt(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}applySprintLeadoutBonuses(){const t=this.resolveFinishMarkerType();if(t!=="finish_flat"&&t!=="finish_hill"||this.isTimeTrialMode)return;const a=this.riders.filter(ke).sort((o,d)=>(o.finishTimeSeconds??0)-(d.finishTimeSeconds??0));if(a.length===0)return;const r=[];let s=null;for(const o of a){const d=o.finishTimeSeconds??0;if(r.length===0){r.push(o),s=d;continue}if(s!=null&&d-s<=sa){r.push(o),s=d;continue}break}const n=new Set(r.map(o=>o.rider.id)),i=new Map;for(const o of this.riders)if(o.finishStatus!=="dnf"&&o.finishStatus!=="otl"&&o.finishStatus!=="dns"&&o.finishTimeSeconds!=null&&o.rider.skills.sprint>=73&&o.rider.activeTeamId!=null&&n.has(o.rider.id)){const d=o.rider.activeTeamId,l=i.get(d)??[];l.push(o),i.set(d,l)}for(const[o,d]of i.entries()){if(d.length===0)continue;let l=null,p=Number.NEGATIVE_INFINITY;for(const u of d){const m=this.calculatePreLeadoutFinishScore(u);m>p?(p=m,l=u):m===p&&l!==null&&(u.rider.skills.sprint>l.rider.skills.sprint||u.rider.skills.sprint===l.rider.skills.sprint&&u.rider.id<l.rider.id)&&(l=u)}if(l){const u=this.calculateSprintLeadoutBonusForRider(l);u>0&&(l.leadoutBonus=u,l.photoFinishScore+=u)}}}calculateSprintLeadoutBonusForRider(t){const a=t.rider.activeTeamId;if(a==null)return 0;const r=this.riders.filter(p=>p.rider.activeTeamId===a);if(r.length===0)return 0;let s=this.teamSprintRandomValues.get(a);s===void 0&&(s=fe(.25,.6),this.teamSprintRandomValues.set(a,s));let n=this.teamSprintSpecialRandomValues.get(a);n===void 0&&(n=fe(.1,.3),this.teamSprintSpecialRandomValues.set(a,n)),t.leadoutRiderId=null;let i=0,o=0,d=null;const l=[];for(const p of r){if(p.rider.id===t.rider.id||p.finishStatus==="dnf"||p.finishStatus==="otl"||p.finishStatus==="dns")continue;let u=0;const m=p.rider.skills.sprint>=72,f=p.rider.skills.flat>=78,g=p.rider.skills.timeTrial>=76,y=p.rider.skills.acceleration>=80;if(m&&u++,f&&u++,g&&u++,y&&u++,u>0){const v=m?s:n;let S=1;u===2?S=1.25:u===3?S=1.5:u===4&&(S=2);const T=v*S*1.5;if(i+=v*S,l.push({riderId:p.rider.id,name:p.riderName,contribution:Number(T.toFixed(2))}),v*S>o)o=v*S,d=p.rider.id;else if(v*S===o&&d!==null){const M=this.riders.find(x=>x.rider.id===d);M&&p.rider.skills.sprint>M.rider.skills.sprint&&(d=p.rider.id)}}}return i>0&&(t.leadoutRiderId=d,t.leadoutContributions=l),i*1.5}resolveFinishMarkerType(){const t=et(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const r=t[a].marker.type;if(r==="finish_flat"||r==="finish_hill"||r==="finish_mountain")return r}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return Cd;case"finish_mountain":return Ed;default:return Id}}resolveRiderClockSeconds(t){if(ke(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,r,s=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(d=>d.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){s=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const d=this.riders.find(p=>p.rider.id===o);if(!d||ee(d))continue;if(Math.abs(d.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const p=ql(d.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(d,p,r,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:s?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:s?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:r,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(r=>r.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+ka){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const yc=300;async function vc(e,t){const a=new Ai(e,{maxSubstepSeconds:5});let r=!1;for(;!r;){const s=a.step(yc);if(r=s.isFinished,t){const n=s.stageDistanceMeters>0?s.leaderDistanceMeters/s.stageDistanceMeters:0,i=e.riders.length>0?s.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const Sc=[1,2,5,10,25,50,100,250,500],mn=new WeakMap;function kc(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function pn(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function $c(e){const t=mn.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${Sc.map(r=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return mn.set(e,a),a}function gn(e,t){const a=$c(e);a.timeField&&(a.timeField.textContent=kc(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${pn(t.snapshot.leaderDistanceMeters)} / ${pn(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(r=>{const s=Number(r.dataset.raceSimSpeed);r.classList.toggle("active",s===t.timeMultiplier)})}const xc=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function Tc(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),r=t%60;return`${a}:${String(r).padStart(2,"0")}`}function Vt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function wc(e){return`/jersey/Jer_${e}.png`}function Bi(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${Vt(wc(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Mc(e){return e.riderId==null||e.riderTeamId==null?"":Bi(e.riderTeamId)}function Rc(e){const t=Vt(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function Ic(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${Vt(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${Vt(e)}</button>`}function Cc(e,t){if(t==="all")return!0;const a=Hi(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function Ec(e){const t=e.detail?Vt(e.detail):"",a=(e.secondaryRiders??[]).map(s=>`${s.riderTeamId!=null?Bi(s.riderTeamId,"race-sim-message-inline-jersey"):""}${Ic(s.riderName,s.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const r=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${r}</span>`}function Hi(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function fn(e,t,a="all"){const r=t.filter(n=>Cc(n,a)),s=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${xc.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${r.length===0?`<div class="race-sim-message-empty">${s}</div>`:r.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${Vt(Hi(n))}">
          <span class="race-sim-message-time">t=${Tc(n.elapsedSeconds)}</span>
          ${Mc(n)}
          <span class="race-sim-message-text">
            ${Rc(n)}
            ${Ec(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const Fc=1,Pc={Flat:12,Rolling:14,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:23,High_Mountain:25,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function Nc(e){return Math.max(0,Math.round(e))}function Gi(e){return e==="ITT"||e==="TTT"}function Lc(e){return Pc[e]??20}function Dc(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+Lc(e)/100))}function _c(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function hn(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function Tr(e,t){if(Gi(t))return[...e].sort(_c);const a=[...e].sort((o,d)=>o.stageTimeSeconds-d.stageTimeSeconds||hn(o,d)),r=[];let s=[],n=null;const i=()=>{r.push(...s.sort(hn))};for(const o of a){if(s.length===0){s=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=Fc){s.push(o),n=o.stageTimeSeconds;continue}i(),s=[o],n=o.stageTimeSeconds}return s.length>0&&i(),r}function X(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Ac(e){return`/jersey/Jer_${e}.png`}function pa(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${X(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${X(Ac(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function ga(e,t,a){return e==null?`<span class="${a}" title="${X(t)}">${X(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${X(t)}">${X(t)}</button>`}function Bc(e){return e.toFixed(1).replace(".",",")}function Ya(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Hc(e){return`${e??0} Pkt.`}function Gc(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function zc(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function zi(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Kc(e){if(e==null||e<=0)return zi(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function ht(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function wa(e){return`${e.toFixed(1).replace(".",",")} km`}function bn(e){return`${e.toFixed(1).replace(".",",")}%`}function Ma(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function yn(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function Wc(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function jc(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function Oc(e,t,a){return Array.from({length:t},(r,s)=>e.slice(s*a,(s+1)*a))}function Vc(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const r=Oc(e,4,5),s=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${r.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=jc(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${pa(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${ga(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${X(i.roleLabel)}">${X(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?s.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${X(Ya(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${Bc(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function ca(e,t){const a=e.riders.find(r=>r.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function lr(e,t){const a=e.riders.find(n=>n.id===t),r=(a==null?void 0:a.activeTeamId)??null,s=r!=null?e.teams.find(n=>n.id===r)??null:null;return{teamId:r,teamName:(s==null?void 0:s.name)??null}}function Uc(e,t,a,r={}){const s=(t??[]).slice(0,r.limit??8);return s.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${s.map(n=>{var u;const i=n.riderId??0,o=lr(e,i),d=ca(e,i),l=((u=r.distanceGapsByRiderId)==null?void 0:u.get(i))??null,p=[r.distanceGapClassName??"",zc(l)].filter(m=>m.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${pa(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${ga(n.riderId,d,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${r.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${p}">${X(Gc(l))}</span>`:""}
      </article>`}).join("")}</div>`}function Ra(e,t,a,r,s,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${X(e)}</h4>
      ${Uc(a,r,s,n)}
    </section>`}function Lt(e,t,a,r,s=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${r}" ${s?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${r}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${X(e)}</span>
      </summary>
      ${t}
    </details>`}function Za(e,t,a,r){const s=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var d;const i=s.get(n.id)??null,o=((d=a.get(n.id))==null?void 0:d[r])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||ca(e,n.riderId).localeCompare(ca(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function vn(e){const t=Yc(e)?e.stagePoints:0;return`${X(Hc("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${X(t)}</span></span>`:""}`}function Yc(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function Sn(e,t){if(t==null)return new Map;const a=e.riders.find(r=>r.riderId===t)??null;return a?new Map(e.riders.map(r=>[r.riderId,a.distanceCoveredMeters-r.distanceCoveredMeters])):new Map}function Zc(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function Aa(e,t){var r;const a=(r=e.race.category)==null?void 0:r.bonusSystem;return!a||t==null||t==="Sprint"?[]:ht(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function as(e){var r;const t=(r=e.race.category)==null?void 0:r.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return ht(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return ht(a?t.pointsMountainStage:t.pointsSprintFinish)}function Ki(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:ht((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function Jc(e,t,a){let r=null;for(const s of e.stageSummary.segments){const n=Math.max(t,s.start_km),i=Math.min(a,s.end_km),o=Math.max(0,i-n);if(o<=0)continue;const d={lengthKm:o,gradient:s.gradient_percent};(r==null||d.gradient>r.gradient||d.gradient===r.gradient&&d.lengthKm>r.lengthKm)&&(r=d)}return r}function wr(e,t,a,r=null){return e.entries.filter(s=>r==null||r.has(s.riderId)).map((s,n)=>({riderId:s.riderId,rank:s.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:s.crossingTimeSeconds,gapSeconds:s.gapSeconds})).filter(s=>s.points>0)}function rs(e){const t=new Map;for(const a of e)for(const r of a.entries){const s=t.get(r.riderId)??{points:0,mountain:0};r.pointsKind==="mountain"?s.mountain+=r.points:s.points+=r.points,t.set(r.riderId,s)}return t}function qc(e){return et(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function Ja(e,t){const a=Gi(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?Nc(a):null}function dr(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=Ja(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const r=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(r)||r<=0)return Tr(a,e.stage.profile).map(n=>n.rider);const s=Dc(e.stage.profile,a.map(n=>n.stageTimeSeconds));return s==null?Tr(a,e.stage.profile).map(n=>n.rider):Tr(a.filter(n=>n.stageTimeSeconds<=s),e.stage.profile).map(n=>n.rider)}function Xc(e,t){const a=as(e);return a.length===0?[]:dr(e,t).map((r,s)=>({riderId:r.riderId,rank:s+1,points:a[s]??0,pointsKind:"points",crossingTimeSeconds:Ja(e,r),gapSeconds:null})).filter(r=>r.points>0)}function Qc(e,t){const a=dr(e,t).slice(0,20),r=a[0]!=null?Ja(e,a[0])??0:0;return a.map((s,n)=>{const i=Ja(e,s)??0;return{riderId:s.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-r),photoFinishScore:s.photoFinishScore}})}function eu(e,t){var a;return((a=dr(e,t)[0])==null?void 0:a.riderId)??null}function ss(e,t,a){var M,x;const r=et(e.stageSummary),s=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(dr(e,a).map($=>$.riderId)):null,i=r.filter(({marker:$})=>$.type==="climb_start"),o=r.filter(({marker:$})=>vt($)).sort(($,I)=>$.kmMark-I.kmMark).map(($,I)=>{var te,J;const R=[...i].reverse().find(Q=>Q.kmMark<=$.kmMark)??null,P=Zc(e,$.kmMark),F=(R==null?void 0:R.kmMark)??(P==null?void 0:P.start_km)??$.kmMark,D=(R==null?void 0:R.elevation)??(P==null?void 0:P.start_elevation)??$.elevation,B=Math.max(0,$.kmMark-F),H=B>0?($.elevation-D)/(B*1e3)*100:(P==null?void 0:P.gradient_percent)??0,K=Jc(e,F,$.kmMark),w=t.find(Q=>Q.markerKey===$.key)??null,A=Aa(e,(w==null?void 0:w.markerCategory)??$.marker.cat??null),U=w?wr(w,A,"mountain",n):[],W=(w==null?void 0:w.markerCategory)??$.marker.cat??null;return{key:$.key,title:`${I+1}. Bergwertung`,label:$.label,categoryLabel:W?`Kat. ${W}`:null,categoryClassName:yn(W),kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:B,averageGradient:H,steepestSegmentLengthKm:(K==null?void 0:K.lengthKm)??null,steepestSegmentGradient:(K==null?void 0:K.gradient)??null,highlightMeta:$.kmMark>=s,leaderRiderId:((te=U[0])==null?void 0:te.riderId)??((J=w==null?void 0:w.entries[0])==null?void 0:J.riderId)??null,displayBadges:Ma(A,"mountain"),entries:U,timingEntries:(w==null?void 0:w.entries)??[],accent:"mountain"}}),d=r.filter(({marker:$})=>$.type==="sprint_intermediate").sort(($,I)=>$.kmMark-I.kmMark).map(($,I)=>{var D,B;const R=t.find(H=>H.markerKey===$.key)??null,P=Ki(e),F=R?wr(R,P,"points",n):[];return{key:$.key,title:`${I+1}. Zwischensprint`,label:$.label,categoryLabel:null,categoryClassName:null,kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((D=F[0])==null?void 0:D.riderId)??((B=R==null?void 0:R.entries[0])==null?void 0:B.riderId)??null,displayBadges:Ma(P,"points"),entries:F,timingEntries:(R==null?void 0:R.entries)??[],accent:"sprint"}}),l=qc(e),p=Xc(e,a),u=l?t.find($=>$.markerKey===l.key)??null:null,m=u?wr(u,Aa(e,u.markerCategory),"mountain",n):[],f=as(e),g=u?Aa(e,u.markerCategory):[],y=e.stage.profile==="ITT"||e.stage.profile==="TTT"?Qc(e,a):(u==null?void 0:u.entries)??[],v=((M=p[0])==null?void 0:M.riderId)??((x=m[0])==null?void 0:x.riderId)??eu(e,a),S={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:u!=null&&u.markerCategory?`Kat. ${u.markerCategory}`:null,categoryClassName:yn((u==null?void 0:u.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(u!=null&&u.markerCategory),leaderRiderId:v,displayBadges:[...Ma(f,"points"),...Ma(g,"mountain")],entries:[...p,...m],timingEntries:y,accent:"finish"};return[...[...d,...o].sort(($,I)=>$.kmMark-I.kmMark||$.title.localeCompare(I.title,"de")),S].filter($=>$.entries.length>0||$.timingEntries.length>0||$.accent!=="finish"||l!=null||a.isFinished)}function tu(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),r=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,s=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,r):t.entries.slice(0,r).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return s.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${s.map(n=>{const i=lr(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${pa(i.teamId,i.teamName)}
            ${ga(n.riderId,ca(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?X(zi(n.crossingTimeSeconds)):X(Kc(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function kn(e,t){var a;return((a=e==null?void 0:e.find(r=>r.riderId===t))==null?void 0:a.points)??0}function $n(e,t){var a;return((a=e.filter(r=>r.riderId!=null&&t.has(r.riderId)).sort((r,s)=>r.rank-s.rank||r.riderId-s.riderId)[0])==null?void 0:a.riderId)??null}function Ia(e,t,a){if(!(!t||e.some(r=>r.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function au(e,t,a,r,s){const n=new Set(e.riderIds),i=new Map(t.riders.map(f=>[f.riderId,f])),d=e.riderIds.map(f=>i.get(f)??null).filter(f=>f!=null).sort((f,g)=>{var y,v;return(((y=a.get(f.riderId))==null?void 0:y.rank)??Number.MAX_SAFE_INTEGER)-(((v=a.get(g.riderId))==null?void 0:v.rank)??Number.MAX_SAFE_INTEGER)||f.riderName.localeCompare(g.riderName,"de")||f.riderId-g.riderId}).slice(0,25),l=i.get($n(r,n)??-1)??null,p=i.get($n(s,n)??-1)??null,u=l!=null&&!d.some(f=>f.riderId===l.riderId),m=p!=null&&!d.some(f=>f.riderId===p.riderId);return d.length>=25&&u&&m&&l.riderId!==p.riderId?(Ia(d,l,23),Ia(d,p,24),d):(Ia(d,l,24),Ia(d,p,24),d)}function ru(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function su(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function xn(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function nu(e,t){const a=t.riders.filter(s=>e.riderIds.includes(s.riderId)).reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0),r=Math.max(0,t.leaderDistanceMeters-a);return r>0?`-${Math.round(r)} m`:"—"}function iu(e,t,a,r,s,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=Cl(a,r),d=a.find(m=>m.label===o)??a[0],l=new Map(e.gcStandings.map(m=>[m.riderId,m])),p=rs(i),u=au(d,t,l,s,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${X(d.label)} <span class="race-sim-group-count">(${d.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${X(xn(d.previousGapMeters,"-"))}</span>
        <span>Leader ${X(nu(d,t))}</span>
        <span>Hinten ${X(xn(d.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${u.map((m,f)=>{const g=l.get(m.riderId)??null,y=lr(e,m.riderId),v=p.get(m.riderId)??{points:0,mountain:0},S=kn(s,m.riderId),T=kn(n,m.riderId),M=ru(m.riderId,e.classificationLeaders),x=M.length>0?M.map($=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[$]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${su(M)}" title="${X(x)}">${f+1}.</strong>
              ${pa(y.teamId,y.teamName)}
              <span class="race-sim-classification-main">
                ${ga(m.riderId,m.riderName,`race-sim-group-rider-name${m.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${g?g.rank:"—"} · ${X(g?Ya(g.gapSeconds):"—")} · ${X(m.gapToLeaderMeters>0?`+${Math.round(m.gapToLeaderMeters)} m`:"—")}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${S}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${T}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${v.points>0?`▲ +${v.points}`:" "}</span>
                  <span class="race-sim-breakaway-stage-gain">${v.mountain>0?`▲ +${v.mountain}`:" "}</span>
                </span>
              </span>
            </article>`}).join("")}
      </div>
    </section>`}function ou(e,t,a,r){const s=ss(t,a.markerClassifications,a),n=rs(s),i=Za(t,t.pointsStandings,n,"points"),o=Za(t,t.mountainStandings,n,"mountain"),d=ts(es(a.clusters));e.innerHTML=iu(t,a,d,r,i,o,s)}function lu(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function du(e){const t=et(e.stageSummary),a=Ki(e)[0]??0,r=as(e)[0]??0,s=t.filter(({marker:n})=>vt(n)).reduce((n,{marker:i})=>n+(Aa(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+r,mountain:s}}function Tn(e){const t=du(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function cu(e){const t=Wc(e),a=[`<span class="race-sim-stage-points-meta-pill">${X(wa(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${X(`${wa(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${X(`Länge ${wa(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${X(`Ø ${bn(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${X(`Steilstes ${wa(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${X(bn(e.steepestSegmentGradient))}</span>`:""].filter(r=>r.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${X(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${X(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${X(e.label)}">${X(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((r,s)=>`${s>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${r}`).join("")}
    </span>`}function uu(e,t,a,r=null){const s=r??ss(e,t,a);return s.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${Tn(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${Tn(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${s.map(n=>{const i=n.leaderRiderId!=null?lr(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?ca(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${cu(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${lu(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${pa(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?ga(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${X(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${tu(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function mu(e,t,a,r,s,n=new Set){var f,g;const i=ss(a,r,s),o=rs(i),d=Za(a,a.pointsStandings,o,"points"),l=Za(a,a.mountainStandings,o,"mountain"),p=Sn(s,((f=a.gcStandings[0])==null?void 0:f.riderId)??null),u=Sn(s,((g=a.youthStandings[0])==null?void 0:g.riderId)??null),m=y=>!n.has(y);e.innerHTML=`
    ${Lt("Stage Favorites",Vc(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",m("favorites"))}
    <section class="race-sim-classifications-section">
      ${Lt("GC",Ra("GC","gc",a,a.gcStandings,y=>X(`GC ${y.rank} · ${Ya(y.gapSeconds)}`),{limit:20,distanceGapsByRiderId:p}),"race-sim-overview-classification race-sim-overview-gc","gc",m("gc"))}
      ${Lt("Punktewertung",Ra("Punktewertung","points",a,d,vn),"race-sim-overview-classification race-sim-overview-points","points",m("points"))}
      ${Lt("Bergwertung",Ra("Bergwertung","mountain",a,l,vn),"race-sim-overview-classification race-sim-overview-mountain","mountain",m("mountain"))}
      ${Lt("Nachwuchsfahrerwertung",Ra("Nachwuchsfahrerwertung","youth",a,a.youthStandings,y=>X(`${y.rank}. · ${Ya(y.gapSeconds)}`),{distanceGapsByRiderId:u,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",m("youth"))}
    </section>
    ${Lt("Etappenwertungen",uu(a,r,s,i),"race-sim-overview-stage-scoring","stageScoring",m("stageScoring"))}
  `}const wn=new WeakMap,Xe=new WeakMap,Mn=new WeakMap,Wi=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ji(e){return e<=0?"—":`+${Math.round(e)} m`}function na(e){const t=Wi.format(e);return e>0?`+${t}`:t}function Mr(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function ce(e){return Wi.format(e)}function Ft(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Oi(e){return`+${Ft(e)}`}function Vi(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function ns(e){return`${(e*3.6).toFixed(1)} km/h`}function pu(e){return`${na(e)}%`}function Gr(e){return`${e.toFixed(1).replace(".",",")} km`}function Ui(e){return`${Gr(e.segmentStartKm)} - ${Gr(e.segmentEndKm)}`}function gu(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function Yi(e){return e.replace(/_/g," ")}function Zi(e){return Yi(e)}function fu(e){return Yi(e)}function Ji(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function hu(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function bu(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function qi(e){return et(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||vt(t)).map(({key:t,label:a})=>({key:t,label:a}))}function yu(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function vu(e,t,a,r){var s;return a!=="ITT"&&a!=="TTT"?((s=r.get(t))==null?void 0:s.get(e.riderId))??null:e.splitTimes[t]??null}function Xi(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(s=>({label:s.key,displayLabel:s.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${s.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function Su(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function ku(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function Qi(e){const t=wn.get(e);if(t)return t;const a=qi(e),r={splitMarkers:a,columns:Xi(e,a,!1),riderById:new Map(e.riders.map(s=>[s.id,s])),teamById:new Map((e.teams??[]).map(s=>[s.id,s])),teamAbbreviationById:new Map((e.teams??[]).map(s=>[s.id,s.abbreviation])),teamNameById:new Map((e.teams??[]).map(s=>[s.id,s.name])),gcByRiderId:new Map((e.gcStandings??[]).map(s=>[s.riderId,s]))};return wn.set(e,r),r}function eo(e,t){const a=e.parentElement,r=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!r)return"";const s=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",r.insertAdjacentElement("beforebegin",l),l})(),n=is(e),i=Su(t),o=ku(i,n),d=Xe.get(e);return(d==null?void 0:d.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),s.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,r.innerHTML=t.map(l=>$u(l,n)).join(""),Xe.set(e,{layoutKey:o,orderedRiderIds:(d==null?void 0:d.orderedRiderIds)??[],rowsByRiderId:(d==null?void 0:d.rowsByRiderId)??new Map,openDetailRiderId:(d==null?void 0:d.openDetailRiderId)??null,openTeamId:(d==null?void 0:d.openTeamId)??null})),o}function at(e,t){e.textContent!==t&&(e.textContent=t)}function Ca(e,t){e.title!==t&&(e.title=t)}function Ea(e,t){e.className!==t&&(e.className=t)}function Fa(e,t,a){return e.lastValues[t]!==a}function Pa(e,t,a){e.lastValues[t]=a}function is(e){const t=Mn.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return Mn.set(e,a),a}function $u(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${q(e.label)}">${q(a)}</span>`;const r=!t.autoSort&&t.manualSortKey===e.sortKey,s=r?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${r?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${q(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${q(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${q(a)}<span class="race-sim-leaderboard-sort-indicator">${q(s)}</span></button>`}function xu(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function Tu(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function Rn(e,t,a,r,s,n,i){if(r.autoSort)return(d,l)=>e.stage.profile==="ITT"?to(d,l,t):Iu(d,l);if(!r.manualSortKey)return null;const o=r.manualSortDirection==="asc"?1:-1;return(d,l)=>{if(Ee(d)!==Ee(l))return Ee(d)?1:-1;const p=s.get(d.riderId)??null,u=s.get(l.riderId)??null,m=In(d,p,r.manualSortKey??"",e,a,n,i),f=In(l,u,r.manualSortKey??"",e,a,n,i);return Tu(m,f)*o||d.riderId-l.riderId}}function wu(e,t,a){if(e.length!==t.size)return!1;let r=null;for(const s of e){const n=t.get(s);if(!n||r&&a(r,n)>0)return!1;r=n}return!0}function In(e,t,a,r,s,n,i){const o=r.race.isStageRace&&r.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return r.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?vu(e,a.slice(6),r.stage.profile,s):null}}function Mu(e,t,a,r,s,n,i,o,d){if(!s.manualSortKey){if(s.autoSort){const m=Rn(t,a,r,s,n,i,o);return m?[...e].sort(m):[...e]}const u=new Map(s.frozenOrder.map((m,f)=>[m,f]));return[...e].sort((m,f)=>(Ee(m)===Ee(f)?0:Ee(m)?1:-1)||(u.get(m.riderId)??Number.MAX_SAFE_INTEGER)-(u.get(f.riderId)??Number.MAX_SAFE_INTEGER)||m.riderId-f.riderId)}const l=Rn(t,a,r,s,n,i,o);if(!l)return[...e];const p=new Map(e.map(u=>[u.riderId,u]));return wu(d,p,l)?d.map(u=>p.get(u)).filter(u=>u!=null):[...e].sort(l)}function Ru(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const p=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(p))return!1;const u=Xe.get(e);return u?(u.openTeamId=u.openTeamId===p?null:p,u.openTeamId==null&&(u.openDetailRiderId=null),!0):!1}const r=t.closest("button[data-race-sim-rider-toggle]");if(r){const p=Number(r.dataset.raceSimRiderToggle);if(!Number.isFinite(p))return!1;const u=Xe.get(e);return u?(u.openDetailRiderId=u.openDetailRiderId===p?null:p,!0):!1}const s=is(e);if(t.closest("button[data-race-sim-splits-toggle]"))return s.showSplitColumns=!s.showSplitColumns,!s.showSplitColumns&&((l=s.manualSortKey)!=null&&l.startsWith("split:"))&&(s.manualSortKey=null,s.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return s.autoSort=!s.autoSort,s.autoSort?(s.manualSortKey=null,s.frozenOrder=[]):(s.manualSortKey=null,s.manualSortDirection="asc",s.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(p=>Number(p.dataset.raceSimRiderRow)).filter(p=>Number.isFinite(p))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||s.autoSort)return!1;const d=o.dataset.raceSimSortKey;return d?(s.manualSortKey===d?s.manualSortDirection=s.manualSortDirection==="asc"?"desc":"asc":(s.manualSortKey=d,s.manualSortDirection=xu(d)),s.frozenOrder=[],!0):!1}function Cn(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function Ee(e){return e.finishStatus==="dnf"}function to(e,t,a){if(Ee(e)!==Ee(t))return Ee(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const d=a[o];if(!d)continue;const l=e.splitTimes[d.key],p=t.splitTimes[d.key];if(l!=null&&p!=null&&l!==p)return l-p;if(l!=null&&p==null)return-1;if(l==null&&p!=null)return 1}const r=Cn(e,a),s=Cn(t,a);if(r!==s)return r?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function Iu(e,t){return Ee(e)!==Ee(t)?Ee(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function ao(e,t){const a=(t==null?void 0:t.formBonus)??0,r=(t==null?void 0:t.raceFormBonus)??0,s=((t==null?void 0:t.fatigueMalus)??0)*.5,n=((t==null?void 0:t.longTermFatigueMalus)??0)*.5,i=((t==null?void 0:t.shortTermFatigueMalus)??0)*.5,o=e.teamGroupBonus,d=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,p=e.baseSkill+l+a+r+e.dailyForm+e.microForm+o-s-n-i,u=Math.max(0,p-e.staminaPenalty),m=p-u,f=u-e.effectiveSkill;return[`Basis ${ce(e.baseSkill)}`,e.isAttacking?`+ Attacke ${ce(l)}`:null,`+ S-Form ${ce(a)}`,`+ R-Form ${ce(r)}`,`+ T-Form ${ce(e.dailyForm)}`,`+ Zufällige Form ${ce(d)} (skaliert)`,`+ Teambonus ${ce(o)}`,`- Fatigue ${ce(s)}`,`- Langzeit ${ce(n)}`,`- Akut ${ce(i)}`,`- Stamina ${ce(m)}`,`- HM ${ce(f)}`,`= Effektiv ${ce(e.effectiveSkill)}`].filter(g=>g!=null)}function Cu(e,t){return ao(e,t).join(`
`)}function Eu(e){return na(Math.max(-2.5,Math.min(2.5,e*2.5)))}function Fu(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function ro(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${q(e.riderName)}">${q(e.riderName)}</button>`}function Pu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId)??"—",s=a.get(e.activeTeamId)??r;return`<span class="race-sim-team-code" title="${q(s)}">${q(r)}</span>`}function so(e){return`/jersey/Jer_${e}.png`}function Nu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId);if(!r)return"—";const s=a.get(e.activeTeamId)??r.name,n=so(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${q(s)}">
      <img
        class="race-sim-team-jersey-img"
        src="${q(n)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Lu(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function Du(e,t,a,r){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=r.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const s=e.splitTimes[t];return s!=null?Ft(s):"—"}function no(e,t,a){const r=ao(e,t),s=[{label:"Terrain / Skill",value:`${Zi(e.activeTerrain)} / ${fu(e.skillName)}`},{label:"Aktiver Abschnitt",value:Ui(e)},{label:"Segmenthöhe",value:gu(e)},{label:"Basis",value:ce(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${ce(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:na((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:na((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:Mr((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:Mr((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:Mr((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:ce(e.staminaPenalty)},{label:"HM",value:ce(e.elevationPenalty)},{label:"T-Form",value:na(e.dailyForm)},{label:"Zufall",value:Eu(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:Fu(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?Vi(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${q(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${q(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${s.map(n=>`<div class="race-sim-rider-detail-item"><span>${q(n.label)}</span><strong>${q(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${r.map(n=>q(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${q(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function _u(e,t,a,r,s,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const d=document.createElement("div");d.className="race-sim-row-grid",o.appendChild(d);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",d.appendChild(l);const p=document.createElement("span");p.className="race-sim-row-flag",p.innerHTML=t?Rl(bu(t)):"—",d.appendChild(p);const u=document.createElement("span");u.className="race-sim-row-name",u.innerHTML=ro(e,a),d.appendChild(u);const m=u.querySelector(".race-sim-row-name-btn");if(!m)throw new Error("race-sim-row-name-btn not found");const f=document.createElement("span");f.className="race-sim-row-team-visual",f.innerHTML=Nu(t,s,i),d.appendChild(f);const g=document.createElement("strong");g.className="race-sim-row-team",g.innerHTML=Pu(t,n,i),d.appendChild(g);const y=(D="")=>{const B=document.createElement("strong");return D&&(B.className=D),d.appendChild(B),B},v=y("race-sim-gap"),S=y("race-sim-cell-effective-skill"),T=y(),M=y(),x=y(),$=r.map(()=>y()),I=y(),R=y(),P=y("race-sim-form-state-cell"),F=document.createElement("div");return F.className="race-sim-row-detail-popover hidden",o.appendChild(F),{row:o,rankField:l,nameButton:m,gapField:v,clockField:x,splitFields:$,effectiveSkillField:S,gcRankField:T,gcGapField:M,gradientPercentField:I,speedField:R,formStateField:P,detailPanel:F,initialized:!1,lastValues:{}}}function Au(e,t,a,r,s,n,i,o,d,l,p){const u=(r==null?void 0:r.formBonus)??0,m=(r==null?void 0:r.raceFormBonus)??0,f=d&&l>1?p.get(a.riderId)??null:null,g=Ee(a),y=i!=="ITT"&&i!=="TTT"?g?"DNF":"—":a.hasStarted?g?"DNF":a.riderClockSeconds!=null?Ft(a.riderClockSeconds):"—":Oi(a.startOffsetSeconds);Ea(e.row,`race-sim-row${t===1&&!g?" race-sim-row-leader":""}${s?" race-sim-row-detail-open":""}${g?" race-sim-row-dnf":""}`),at(e.rankField,`${t}.`),at(e.gapField,g?"DNF":ji(a.gapToLeaderMeters)),at(e.clockField,y),e.nameButton.setAttribute("aria-expanded",s?"true":"false"),Ea(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),Ca(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((M,x)=>{const $=e.splitFields[x];if(!$)return;const I=Du(a,M.key,i,o);at($,I),Ca($,M.label)}),Fa(e,"effectiveSkillValue",a.effectiveSkill)&&(at(e.effectiveSkillField,ce(a.effectiveSkill)),Pa(e,"effectiveSkillValue",a.effectiveSkill));const v=`race-sim-cell-effective-skill ${Ji(a)}`;Fa(e,"effectiveSkillClass",v)&&(Ea(e.effectiveSkillField,v),Pa(e,"effectiveSkillClass",v));const S=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,u,m,a.dailyForm,a.microForm,(r==null?void 0:r.fatigueMalus)??0,(r==null?void 0:r.longTermFatigueMalus)??0,(r==null?void 0:r.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");Fa(e,"effectiveSkillTitleKey",S)&&(Ca(e.effectiveSkillField,Cu(a,r)),Pa(e,"effectiveSkillTitleKey",S)),at(e.gcRankField,f?String(f.rank):"—"),at(e.gcGapField,f?Vi(f.gapSeconds):"—"),at(e.gradientPercentField,pu(a.gradientPercent)),Ea(e.gradientPercentField,hu(a.gradientPercent)),Ca(e.gradientPercentField,`${Zi(a.activeTerrain)} · ${Ui(a)}`),at(e.speedField,ns(a.currentSpeedMps)),e.formStateField.innerHTML=Lu(a);const T=[s?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,u,m,(r==null?void 0:r.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(f==null?void 0:f.rank)??"—",(f==null?void 0:f.gapSeconds)??"—",a.skillBreakdown].join("|");Fa(e,"detailKey",T)&&(e.detailPanel.innerHTML=s?no(a,r,f):"",e.detailPanel.classList.toggle("hidden",!s),Pa(e,"detailKey",T)),e.detailPanel.classList.toggle("hidden",!s),e.initialized=!0}function Bu(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${q(e.name)}">${q(e.name)}</button>`}function Hu(e){const t=so(e.id);return`
    <span class="race-sim-team-visual" title="${q(e.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${q(t)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Gu(e,t,a){const r=new Map;for(const s of e.riders){const n=a.get(s.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=r.get(i)??[];o.push(s),r.set(i,o)}return t.teams.filter(s=>r.has(s.id)).map(s=>{const n=(r.get(s.id)??[]).slice().sort((p,u)=>u.effectiveSkill-p.effectiveSkill||p.riderId-u.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),d=n.slice(0,o).reduce((p,u)=>p+u.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:s,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,d-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(p=>p.isFinished).length}}).sort((s,n)=>to(s.representative,n.representative,qi(t))||s.team.id-n.team.id)}function zu(e,t,a,r,s){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${q(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${q(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${q(ce(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${q(ns(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${q(e.teamClockSeconds!=null?Ft(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${q(Gr(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&r>1?t.gcByRiderId.get(n.riderId)??null:null,d=s===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${ro(n,d)}
                <strong>${q(ce(n.effectiveSkill))}</strong>
                <span>${q(n.riderClockSeconds!=null?Ft(n.riderClockSeconds):"—")}</span>
              </div>
              ${d?no(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function Ku(e,t,a){var f,g;const r=performance.now(),s=Qi(a),n=s.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(y=>({label:y.key,displayLabel:y.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(f=Xe.get(e))==null?void 0:f.layoutKey,d=eo(e,i),l=Xe.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==d&&(e.innerHTML="");const p=Gu(t,a,s.riderById),u=((g=p[0])==null?void 0:g.teamDistanceMeters)??0;return e.innerHTML=p.map((y,v)=>{const S=l.openTeamId===y.team.id;return`
      <article class="race-sim-row${v===0?" race-sim-row-leader":""}${S?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${v+1}.</strong>
          <span class="race-sim-row-name">${Bu(y.team,S)}</span>
          <span class="race-sim-row-team-visual">${Hu(y.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${q(y.team.name)}">${q(y.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${q(ji(Math.max(0,u-y.teamDistanceMeters)))}</strong>
          <strong>${q(y.teamClockSeconds!=null?Ft(y.teamClockSeconds):Oi(y.representative.startOffsetSeconds))}</strong>
          ${n.map(T=>`<strong>${q(y.splitTimes[T.key]!=null?Ft(y.splitTimes[T.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${Ji(y.representative)}">${q(ce(y.teamEffectiveSkill))}</strong>
          <strong>${q(ns(y.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${S?"":" hidden"}">${S?zu(y,s,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),Xe.set(e,{layoutKey:d,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-r,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:p.length,rowsCreated:p.length,rowsRemoved:0,rowsUpdated:p.length,rowsSkippedInvisible:0,orderChanged:1}}function En(e,t,a){if(a.stage.profile==="TTT")return Ku(e,t,a);const r=performance.now(),s={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=Qi(a),{splitMarkers:o}=i,d=yu(t),l=is(e),p=l.showSplitColumns?o:[],u=Xe.get(e);s.prepMs=performance.now()-n;const m=performance.now(),f=Mu(t.riders,a,o,d,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(u==null?void 0:u.orderedRiderIds)??[]);s.sortMs=performance.now()-m;const g=u==null?void 0:u.layoutKey,y=performance.now(),v=eo(e,Xi(a,p,l.showSplitColumns));s.layoutMs=performance.now()-y;const S=Xe.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};g!=null&&g!==v&&(e.innerHTML="",S.rowsByRiderId.clear(),S.orderedRiderIds=[]);const T=f.map(F=>F.riderId),M=new Set(T),x=performance.now();for(const[F,D]of S.rowsByRiderId)M.has(F)||(D.row.remove(),S.rowsByRiderId.delete(F),s.rowsRemoved+=1);s.removeRowsMs=performance.now()-x;const $=performance.now();for(let F=0;F<f.length;F+=1){const D=f[F],B=i.riderById.get(D.riderId)??null;let H=S.rowsByRiderId.get(D.riderId);H||(H=_u(D,B,S.openDetailRiderId===D.riderId,p,i.teamById,i.teamAbbreviationById,i.teamNameById),S.rowsByRiderId.set(D.riderId,H),s.rowsCreated+=1)}s.createRowsMs=performance.now()-$;const I=performance.now(),R=S.orderedRiderIds.length===T.length&&S.orderedRiderIds.every((F,D)=>F===T[D]);s.orderCheckMs=performance.now()-I;const P=performance.now();if(!R){const F=document.createDocumentFragment();for(const D of T){const B=S.rowsByRiderId.get(D);B&&F.appendChild(B.row)}e.replaceChildren(F),s.orderChanged=1}s.reorderMs=performance.now()-P;for(let F=0;F<f.length;F+=1){const D=f[F],B=S.rowsByRiderId.get(D.riderId),H=i.riderById.get(D.riderId)??null;if(!B)continue;const K=performance.now();Au(B,F+1,D,H,S.openDetailRiderId===D.riderId,p,a.stage.profile,d,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),s.updateRowsMs+=performance.now()-K,s.rowsUpdated+=1}return Xe.set(e,{layoutKey:v,orderedRiderIds:T,rowsByRiderId:S.rowsByRiderId,openDetailRiderId:S.openDetailRiderId,openTeamId:S.openTeamId}),s.finalizeMs=performance.now()-(r+s.prepMs+s.sortMs+s.layoutMs+s.removeRowsMs+s.createRowsMs+s.orderCheckMs+s.reorderMs+s.visibilityMs+s.updateRowsMs),s.totalMs=performance.now()-r,s.finalizeMs=Math.max(0,s.totalMs-s.prepMs-s.sortMs-s.layoutMs-s.removeRowsMs-s.createRowsMs-s.orderCheckMs-s.reorderMs-s.visibilityMs-s.updateRowsMs),s}const Wu=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],ju=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],io=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],oo=["Sprint","4","3","2","1","HC"],qa=.2,Ou=7,Vu=100,Uu=3,Yu=50,Zu=-2,Ju=1,qu=2.5,Xu=-3,Qu=15,em=200,tm=600,am=850;function _e(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function Xa(e){return e==="finish_hill"||e==="finish_mountain"}function Qa(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function os(e,t){return e==="climb_top"||Xa(e)&&Qa(t)}function fa(e){return Math.round(e*10)/10}function Ke(e){return Number(e.toFixed(2))}function wt(e){return`${e.toFixed(2).replace(".",",")} km`}function lo(e){return`${Math.round(e)} hm`}function rm(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function ls(e){return Wu.map(t=>`<option value="${t}"${t===e?" selected":""}>${k(t)}</option>`).join("")}function sm(e){return ju.map(t=>`<option value="${t}"${t===e?" selected":""}>${k(t)}</option>`).join("")}function nm(e,t="start",a=0,r=1){const s=io.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:_e(i)?a===r-1:i==="climb_top"||i==="sprint_intermediate");return(s.includes(e)?s:[e,...s.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${k(i)}</option>`).join("")}function im(e){return['<option value="">–</option>',...oo.map(t=>`<option value="${t}"${t===e?" selected":""}>${k(t)}</option>`)].join("")}function Fn(e){return io.indexOf(e)}function We(e){return[...e].sort((t,a)=>Fn(t.type)-Fn(a.type))}function ua(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:We(e[0].markers)}];let a=0;return e.forEach(r=>{a=Ke(a+r.lengthKm);const s=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),n=t[t.length-1];n.terrain=r.terrain,n.techLevel=r.techLevel,n.windExp=r.windExp,n.markers=We([...n.markers,...r.markers]),t.push({kmMark:a,elevation:s,terrain:r.terrain,techLevel:r.techLevel,windExp:r.windExp,markers:We(r.endMarkers)})}),t}function om(e){return e?" stage-editor-input-invalid":""}function ds(e,t){const a=e.segments[t];if(!a)return[];const r=[],s=lm(e).get(t)??[];return a.lengthKm<qa&&r.push(`Laenge unter ${qa.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&r.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&r.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&r.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>_e(n.type))&&r.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&r.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>_e(n.type))&&r.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{_e(n.type)&&r.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&r.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&r.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&r.push(`${n.type} gehoert in den Startmarker-Slot.`),os(n.type,n.cat)&&!Qa(n.cat)&&r.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&r.push("Sprintmarker erlaubt nur Kategorie Sprint."),_e(n.type)&&!Xa(n.type)&&n.cat!=null&&r.push("finish_flat und finish_TT duerfen keine Kategorie haben."),Xa(n.type)&&n.cat!=null&&!Qa(n.cat)&&r.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),r.push(...s),[...new Set(r)]}function lm(e){const t=new Map,a=[],r=(s,n)=>{const i=t.get(s)??[];i.push(n),t.set(s,i)};return e.segments.forEach((s,n)=>{s.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),s.endMarkers.forEach(i=>{var l;if(!os(i.type,i.cat))return;if(!i.name){r(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let p=a.length-1;p>=0;p-=1)if(((l=a[p])==null?void 0:l.name)===i.name){o=p;break}const d=o>=0?o:a.length-1;if(d<0){r(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(d,1)})}),a.forEach(s=>{const n=s.name?` "${s.name}"`:"";r(s.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function dm(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:Xa(e.type)?{...e,cat:Qa(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function co(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:cm(e.waypoints??[])).map(r=>({...r,startElevation:Math.round(r.startElevation),lengthKm:Number.isFinite(r.lengthKm)?Ke(r.lengthKm):qa,gradientPercent:Number.isFinite(r.gradientPercent)?fa(r.gradientPercent):0,techLevel:Number.isFinite(r.techLevel)?r.techLevel:5,windExp:Number.isFinite(r.windExp)?r.windExp:5,markers:Pn(r.markers),endMarkers:Pn(r.endMarkers)})),waypoints:[]};return St(t),t}function cm(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const r=e[a],s=e[a+1],n=Ke(s.kmMark-r.kmMark),i=s.elevation-r.elevation,o=fa(n>0?i/(n*10):0);t.push({startElevation:r.elevation,lengthKm:n,gradientPercent:o,techLevel:r.techLevel??5,windExp:r.windExp??5,terrain:r.terrain??"Flat",markers:r.markers??[],endMarkers:s.markers??[]})}return t}function Pn(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function um(e,t,a){const r=e*a*8+t/12;return r>=95?"HC":r>=68?"1":r>=46?"2":r>=28?"3":"4"}function Nn(e){const t=[];let a=null,r=null,s=0;const n=i=>{if(a==null||i==null||i<=a){a=null,r=null,s=0;return}const o=e[a],d=e[i],l=d.kmMark-o.kmMark,p=Math.max(0,d.elevation-o.elevation),u=l>0?p/(l*10):0;p>=Vu&&u>=Uu&&t.push({startKm:Ke(o.kmMark),endKm:Ke(d.kmMark),distanceKm:Ke(l),gainMeters:Math.round(p),avgGradient:fa(u),category:um(l,p,u),startIndex:a,topIndex:i,topElevation:Math.round(d.elevation)}),a=null,r=null,s=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],d=e[i],l=d.elevation-o.elevation;if(a==null&&l>0){a=i-1,r=i,s=0;continue}if(a!=null){if(l>=0){(r==null||d.elevation>=e[r].elevation)&&(r=i),s=0;continue}s+=Math.abs(l),s>=Yu&&n(r)}}return n(r),t}function mm(e){const t=e.segments.some(s=>s.terrain==="Cobble_Hill"),a=e.segments.some(s=>s.terrain==="Cobble"),r=e.climbs.some(s=>s.category==="HC"||s.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":r&&e.elevationGainMeters>=2800?"High_Mountain":r||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function Na(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function pm(e){return e.gainMeters>=tm&&e.topElevation>=am?"Mountain":e.gainMeters>em?"Medium_Mountain":"Hill"}function gm(e){return e.gradientPercent<Xu?"Abfahrt":e.gradientPercent<qu||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<Qu?"Flat":"Hill"}function fm(e){if(e.segments.length===0)return;if(e.waypoints=ua(e.segments),e.sourceFormat==="csv"){const i=Nn(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:d,topElevation:l,...p})=>p);return}const t=e.segments.map(i=>i.manualTerrain||Na(i.terrain)?i.terrain:gm(i)),a=Nn(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:d,...l})=>l),a.forEach(i=>{const o=pm(i);if(o)for(let d=i.startIndex;d<i.topIndex;d+=1)e.segments[d].manualTerrain||Na(t[d])||(t[d]=o)});let r=null,s=0;const n=i=>{if(r==null||s<=Ju){r=null,s=0;return}for(let o=r;o<i;o+=1)!(e.segments[o].manualTerrain||Na(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");r=null,s=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<Zu){r==null&&(r=i),s+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{Na(i.terrain)||(i.terrain=t[o])}),e.waypoints=ua(e.segments),e.suggestedProfile=mm(e)}function St(e){hm(e),Ln(e),fm(e),e.waypoints=ua(e.segments),Ln(e)}function hm(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,r)=>{const s={...a,startElevation:Math.round(r===0?a.startElevation:t),lengthKm:Ke(a.lengthKm),gradientPercent:fa(a.gradientPercent),markers:We(a.markers),endMarkers:We(a.endMarkers)};return t=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),s}),e.waypoints=ua(e.segments)}function Ln(e){e.totalDistanceKm=Ke(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,r)=>{if(r===0)return 0;const s=a.elevation-e.waypoints[r-1].elevation;return t+Math.max(0,s)},0)}function ut(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(r=>r.type==="start")||(t.markers=We([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(r=>_e(r.type))||(a.endMarkers=We([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=ua(e.segments))}function bm(e,t,a,r){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((s,n)=>{const i=r==="start"&&t===0&&s.type==="start",o=e.filter(p=>_e(p.type)).length,d=r==="end"&&t===a-1&&_e(s.type)&&o===1,l=!(i||d);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${r}" data-marker-index="${n}">${nm(s.type,r,t,a)}</select>
        <input type="text" value="${k(s.name??"")}" data-field="markerName" data-marker-scope="${r}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${r}" data-marker-index="${n}">${im(s.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${r}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function Dn(e,t,a,r){const s=r==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${bm(e,t,a,r)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${r}" data-segment-index="${t}">${s}</button>
    </div>`}function ym(e,t,a,r,s){if(!c.stageEditorDraft)return;const n=c.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(r==="markerType"){o.type=s;const d=dm(o);if(o.name=d.name,o.cat=d.cat,_e(o.type)){const l=i.filter((p,u)=>u===t||!_e(p.type));a==="start"?n.markers=l:n.endMarkers=l}}else r==="markerName"?o.name=s.trim()||null:r==="markerCat"&&(o.cat=s||null);a==="start"?n.markers=We(n.markers):n.endMarkers=We(n.endMarkers),St(c.stageEditorDraft),ut(c.stageEditorDraft),he()}}function vm(e,t){if(!c.stageEditorDraft)return;const a=c.stageEditorDraft.segments[e];if(!a)return;const r=t==="start"?e===0&&!a.markers.some(s=>s.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===c.stageEditorDraft.segments.length-1&&!a.endMarkers.some(s=>_e(s.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(r),a.markers=We(a.markers)):(a.endMarkers.push(r),a.endMarkers=We(a.endMarkers)),St(c.stageEditorDraft),ut(c.stageEditorDraft),he()}function Sm(e,t,a){if(!c.stageEditorDraft)return;const r=c.stageEditorDraft.segments[e];r&&(a==="start"?r.markers.splice(t,1):r.endMarkers.splice(t,1),St(c.stageEditorDraft),ut(c.stageEditorDraft),he())}let zt=0,Kt=0;async function km(){b("stage-editor-profile").innerHTML=ls("Flat"),b("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',b("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([V.listStageEditorCountries(),V.listStageEditorRaceCategories(),V.listStageEditorRacePrograms()]);if(e.success&&e.data){const r=b("stage-editor-race-country");r.innerHTML=e.data.map(s=>`<option value="${s.id}">${k(s.name)} (${k(s.code3)})</option>`).join("")}if(t.success&&t.data){const r=b("stage-editor-race-category");r.innerHTML=t.data.map(s=>`<option value="${s.id}">${k(s.name)}</option>`).join("")}a.success&&a.data&&(c.stageEditorPrograms=a.data,$m())}function $m(){const e=b("stage-editor-programs-list");c.stageEditorPrograms&&(e.innerHTML=c.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${k(t.name)}</span>
      </label>
    `).join(""))}function xm(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=b("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(r=>{var n;const s=(n=c.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===r.value);return s?s.name:r.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function cs(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function uo(){const e=c.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function Tm(){const e=[...c.stageEditorExistingStages.map(t=>t.raceId),...c.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function wm(e,t){let a=e;const r=new Set(c.stageEditorExistingStages.map(s=>s.stageId));for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function Mm(e,t){let a=e;const r=new Set([...c.stageEditorExistingStages.map(s=>s.raceId),...c.races.map(s=>s.id)]);for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function Rm(e){var o;const t=b("stage-editor-profile");t.innerHTML=ls(e.suggestedProfile),t.value=e.suggestedProfile;const a=uo(),r=Tm();b("stage-editor-stage-id").value=String(a),b("stage-editor-race-id").value=String(r),zt=a,Kt=r;const s=b("stage-editor-details-file");s.value.trim()||(s.value=`${rm(e.routeName)}.csv`);const n=b("stage-editor-date");!n.value&&((o=c.gameState)!=null&&o.currentDate)&&(n.value=c.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(d=>{d.checked=!0})}function Im(e){b("stage-editor-stage-id").value=String(e.stageId),b("stage-editor-race-id").value=String(e.raceId),zt=e.stageId,Kt=e.raceId,b("stage-editor-stage-number").value=String(e.stageNumber),b("stage-editor-date").value=e.date,b("stage-editor-details-file").value=e.detailsCsvFile;const t=b("stage-editor-profile");t.innerHTML=ls(e.profile),t.value=e.profile,b("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),b("stage-editor-final-push-start").value=String(e.finalPushStartPercent),b("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),b("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),b("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(s=>s.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(s=>{s.checked=a.includes(s.value)})}function mo(e){var r;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((r=e.segments[0])!=null&&r.markers.some(s=>s.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(s=>_e(s.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((s,n)=>{ds(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...s.markers??[],...s.endMarkers??[]].forEach(i=>{i.cat!=null&&!oo.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function po(){const e=[],t=Number(b("stage-editor-stage-id").value),a=Number(b("stage-editor-race-id").value),r=Number(b("stage-editor-stage-number").value),s=b("stage-editor-date").value.trim(),n=b("stage-editor-details-file").value.trim(),i=Number(b("stage-editor-final-spread-start").value),o=Number(b("stage-editor-final-push-start").value),d=Number(b("stage-editor-final-spread-difficulty").value),l=Number(b("stage-editor-crash-multiplier").value),p=Number(b("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(r)||r<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(s)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(d)||d<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(p)||p<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),c.stageEditorExistingStages.map(v=>v.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const f=b("stage-editor-new-race-checkbox").checked,g=[...c.stageEditorExistingStages.map(v=>v.raceId),...c.races.map(v=>v.id)];if(f){g.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const v=b("stage-editor-race-name").value.trim(),S=Number(b("stage-editor-race-country").value),T=Number(b("stage-editor-race-category").value),M=Number(b("stage-editor-race-num-stages").value),x=b("stage-editor-race-start-date").value.trim(),$=b("stage-editor-race-end-date").value.trim(),I=Number(b("stage-editor-race-prestige").value);v||e.push("Rennname fehlt."),(!Number.isInteger(S)||S<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger(T)||T<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(M)||M<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(x)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test($)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(I)||I<1||I>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else g.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return b("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function Cm(){var a,r;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(s=>s.value).join("|");return{stageId:Number(b("stage-editor-stage-id").value),raceId:Number(b("stage-editor-race-id").value),stageNumber:Number(b("stage-editor-stage-number").value),date:b("stage-editor-date").value.trim(),profile:b("stage-editor-profile").value,detailsCsvFile:b("stage-editor-details-file").value.trim(),startElevation:((r=(a=c.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:r.startElevation)??0,finalSpreadStartPercent:Number(b("stage-editor-final-spread-start").value),finalPushStartPercent:Number(b("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(b("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(b("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(b("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function Em(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function Fm(e){return["gainMeters","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function cr(e,t,a){const s=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-s*118),i=54,o=.14+s*.12,d=.26+s*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${d};`}">${Math.round(e)}</span>`}function us(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),r=Math.round(40-t*22),s=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${s};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function Pm(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function Nm(e,t,a,r){const s=r!=null?` data-stage-profile-open-climb-id="${k(r)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${s}>${e}</button>`}function Lm(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",r=e.profileScore??e.score,s=[...c.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=s.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span>${k(i.name)}</span>
          <span class="text-right">${us(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${cr(r,0,100)}
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
    </div>`}function Dm(e){const t=s=>s!=null?`${s.toFixed(1).replace(".",",")} km`:"—",a=s=>s!=null?`${Math.round(s).toLocaleString("de-DE")} m`:"—",r=s=>s!=null?`${s.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${us(e.climbScore??0)}
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
    </div>`}function go(e,t,a,r,s,n,i,o){const d=o??cr(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${Nm(d,r,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${s}
      </div>
    </div>`}function ue(e,t,a,r,s){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?r==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${s}-sort="${t}">
        <span class="team-table-sort-label">${k(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function Qt(){const e=b("stage-editor-stages-table"),t=b("stage-editor-stages-empty"),a=b("stage-editor-stages-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=c.stageEditorStagesSort.key,i=c.stageEditorStagesSort.direction;r&&(r.innerHTML=`<tr>
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
    </tr>`);const o=Am(c.stageEditorStageRows);s.innerHTML=o.map(d=>`
    <tr>
      <td>${d.stageId}</td>
      <td>${oe(d.countryCode||"")}</td>
      <td><strong>${k(d.raceName)}</strong></td>
      <td><strong>${k(ba({stageNumber:d.stageNumber}))}</strong></td>
      <td>${go(d.profileScore,0,100,d.stageId,Lm(d),gr({name:d.raceName},{stageNumber:d.stageNumber,profile:d.profile}))}</td>
      <td>${ya(d.profile)}</td>
      <td>${wt(d.distanceKm)}</td>
      <td>${lo(d.elevationGainMeters)}</td>
      <td>${d.sprintCount} Sprints</td>
      <td>${d.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${c.stageEditorStageRows.length} vorhandene Etappen`}function ea(){const e=b("stage-editor-climbs-table"),t=b("stage-editor-climbs-empty"),a=b("stage-editor-climbs-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=c.stageEditorClimbsSort.key,i=c.stageEditorClimbsSort.direction;r&&(r.innerHTML=`<tr>
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
    </tr>`);const o=Bm(c.stageEditorClimbRows);s.innerHTML=o.map(d=>`
    <tr>
      <td>${d.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${k(d.name)}</strong></td>
      <td>${Pm(d.category)}</td>
      <td>${go(d.climbScore,0,350,d.stageId,Dm(d),gr({name:d.raceName},{stageNumber:d.stageNumber,profile:"Mountain"}),d.id,us(d.climbScore))}</td>
      <td>${oe(d.countryCode||"")}</td>
      <td><strong>${k(d.raceName)}</strong></td>
      <td><strong>${k(ba({stageNumber:d.stageNumber}))}</strong></td>
      <td>${lo(d.gainMeters)}</td>
      <td>${wt(d.distanceKm)}</td>
      <td>${d.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${d.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${c.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function fo(e=!1){if(c.stageEditorOverviewLoaded&&!e){Qt(),ea();return}c.stageEditorOverviewLoading=!0,Qt(),ea();const t=await V.getStageEditorOverview();if(c.stageEditorOverviewLoading=!1,c.stageEditorOverviewLoaded=!0,!t.success||!t.data){c.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),Qt(),ea();return}c.stageEditorStageRows=t.data.stages,c.stageEditorClimbRows=t.data.climbs,Qt(),ea()}async function _m(e=!1){const t=b("stage-editor-existing-stage-wrap");if(c.stageEditorExistingStagesLoaded&&!e){zr();return}t.classList.add("loading");const a=b("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const r=await V.listStageEditorStages();if(t.classList.remove("loading"),c.stageEditorExistingStagesLoaded=!0,!r.success||!r.data){c.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}c.stageEditorExistingStages=r.data.stages,zr()}function zr(){const e=b("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+c.stageEditorExistingStages.map(a=>{const r=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${k(a.raceName)} · Etappe ${a.stageNumber}${r}</option>`}).join("")}function Am(e){const t=c.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(c.stageEditorStagesSort.key){case"stageId":s=a.stageId-r.stageId;break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"profile":s=a.profile.localeCompare(r.profile,"de");break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"elevationGainMeters":s=a.elevationGainMeters-r.elevationGainMeters;break;case"sprintCount":s=a.sprintCount-r.sprintCount;break;case"climbCount":s=a.climbCount-r.climbCount;break;case"profileScore":s=a.profileScore-r.profileScore;break}return s*t||a.stageId-r.stageId})}function Bm(e){const t=c.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(c.stageEditorClimbsSort.key){case"placementKm":s=a.placementKm-r.placementKm;break;case"name":s=a.name.localeCompare(r.name,"de");break;case"category":s=(a.category??"").localeCompare(r.category??"","de");break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"gainMeters":s=a.gainMeters-r.gainMeters;break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"avgGradient":s=a.avgGradient-r.avgGradient;break;case"maxGradient":s=a.maxGradient-r.maxGradient;break;case"climbScore":s=a.climbScore-r.climbScore;break}return s*t||a.placementKm-r.placementKm})}function Hm(e){return e.map(t=>t.type).join(" | ")}function Gm(e){const t=[],a=[];let r=0;return e.segments.forEach((s,n)=>{const i=r,o=Ke(i+s.lengthKm),d=cs(s);s.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:s.startElevation})}),s.endMarkers.forEach(l=>{if(os(l.type,l.cat)&&l.name){let p=-1;for(let u=a.length-1;u>=0;u--)if(a[u].name===l.name){p=u;break}if(p>=0){const u=a[p];a.splice(p,1);const m=Ke(o-u.startKm),f=Math.max(0,d-u.startElevation),g=m>0?fa(f/(m*10)):0;t.push({name:l.name,startKm:u.startKm,endKm:o,distanceKm:m,gainMeters:f,avgGradient:g,category:l.cat||"4"})}}}),r=o}),t}function zm(e){const t=[];let a=0;return e.segments.forEach(r=>{const s=Ke(a+r.lengthKm);r.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:s})}),a=s}),t}function he(){zr();const e=c.stageEditorDraft,t=b("stage-editor-import-summary"),a=b("stage-editor-warnings"),r=b("stage-editor-climbs"),s=b("stage-editor-empty"),n=b("stage-editor-chart"),i=b("stage-editor-waypoints-body"),o=b("stage-editor-export-hint"),d=b("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",r.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',s.classList.remove("hidden"),n.innerHTML=_n(null),i.innerHTML=`<tr><td colspan="${Ou}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",d.disabled=!0;return}s.classList.add("hidden");const l=mo(e),p=po(),u=document.getElementById("stage-editor-profile"),m=u&&u.value?u.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${k(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${wt(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${k(m)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const f=[...e.warnings,...l,...p];a.innerHTML=f.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':f.map(S=>`<div class="stage-editor-alert">${k(S)}</div>`).join("");const g=Gm(e),y=zm(e);let v="";g.length>0?v+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (${g.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${g.map(S=>`
          <div class="stage-editor-climb" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="color: #fff; font-size: 0.85rem;">${k(S.name)}</strong>
              <span class="stage-editor-climb-category-badge ${S.category==="HC"?"is-hc":`is-cat-${S.category}`}" style="font-size: 0.7rem; padding: 0.1rem 0.35rem;">
                Kat. ${k(S.category)}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-300); display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span>${wt(S.startKm)} - ${wt(S.endKm)}</span>
              <span>·</span>
              <span><strong>${S.distanceKm.toFixed(1).replace(".",",")} km</strong></span>
              <span>·</span>
              <span><strong>${S.gainMeters} hm</strong></span>
              <span>·</span>
              <span><strong>${S.avgGradient.toFixed(1).replace(".",",")}%</strong></span>
            </div>
          </div>
        `).join("")}
      </div>
    `:v+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Bergwertungen definiert (climb_start und climb_top Marker mit gleichem Namen paaren).</p>
    `,y.length>0?v+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (${y.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${y.map(S=>`
          <div class="stage-editor-sprint" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--success); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.85rem;">${k(S.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-300); font-weight: bold;">
              ${wt(S.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:v+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `,r.innerHTML=v,n.innerHTML=_n(e),i.innerHTML=e.segments.map((S,T)=>`
    <tr data-segment-index="${T}" class="${ds(e,T).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${T+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${S.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${om(S.lengthKm<qa)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${S.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${sm(S.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${Dn(S.markers,T,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${Dn(S.endMarkers,T,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div class="text-muted" style="min-width:3.5rem;">${cs(S)} m</div>
          ${Km(e,T)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${T}">+</button>
          ${T===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${T}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${T}">✕</button>`:""}
        </div>
      </td>
    </tr>`).join(""),d.disabled=f.length>0,o.textContent=f.length>0?`${f.length} Validierungshinweise vor dem Export.`:`Exportiert ${b("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function Km(e,t){const a=ds(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(r=>`<div>${k(r)}</div>`).join("")}</div>`}function _n(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,r=24,s=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(g=>g.elevation)),d=Math.max(...n.map(g=>g.elevation)),l=Math.max(1,d-o),p=n.map(g=>{const y=r+g.kmMark/Math.max(i,.1)*(t-r*2),v=a-s-(g.elevation-o)/l*(a-s*2);return{x:y,y:v,waypoint:g}}),u=p.map((g,y)=>`${y===0?"M":"L"} ${g.x.toFixed(1)} ${g.y.toFixed(1)}`).join(" "),m=`${u} L ${(t-r).toFixed(1)} ${(a-s).toFixed(1)} L ${r.toFixed(1)} ${(a-s).toFixed(1)} Z`,f=p.filter(g=>g.waypoint.markers.length>0).map(g=>`
      <line x1="${g.x.toFixed(1)}" y1="${s}" x2="${g.x.toFixed(1)}" y2="${(a-s).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${g.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${k(Hm(g.waypoint.markers))}</text>`).join("");return`
    <svg viewBox="0 0 ${t} ${a}" role="img" aria-label="Stage-Profil ${k(e.routeName)}">
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
      <text x="${t-r}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${wt(i)}</text>
    </svg>`}function Wm(e,t,a){const r=c.stageEditorDraft;if(!r)return;const s=r.segments[e];s&&(t==="startElevation"?s.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?s.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?s.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(s.terrain=a,s.manualTerrain=!0):t==="techLevel"?s.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(s.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),St(r),ut(r),he())}function jm(e){const t=c.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const r={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,r),St(t),ut(t),he()}function Om(){const e=c.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],r={startElevation:t?cs(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(r),St(e),ut(e),he()}function Vm(e){const t=c.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),St(t),ut(t),he()))}async function Um(){var a;const t=(a=b("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}b("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,Te("Route wird importiert……");try{const r=await t.text(),s=await V.importStageRoute({fileName:t.name,fileContent:r});if(!s.success||!s.data){alert(`Import fehlgeschlagen: ${s.error??"Unbekannter Fehler"}`);return}const n=co(s.data);c.stageEditorDraft=n,ut(n),Rm(n),he(),Nt("stage-editor")}finally{Se()}}async function Ym(){const e=Number(b("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}Te("CSV-Stage wird geladen...");try{const t=await V.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=co(t.data.draft);c.stageEditorDraft=a,ut(a),Im(t.data.metadata),he(),Nt("stage-editor")}finally{Se()}}async function Zm(){if(!c.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...mo(c.stageEditorDraft),...po()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),he();return}const t=b("stage-editor-new-race-checkbox").checked,a=b("stage-editor-program-checkbox").checked;let r;t&&(r={name:b("stage-editor-race-name").value.trim(),countryId:Number(b("stage-editor-race-country").value),categoryId:Number(b("stage-editor-race-category").value),isStageRace:Number(b("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(b("stage-editor-race-num-stages").value),startDate:b("stage-editor-race-start-date").value.trim(),endDate:b("stage-editor-race-end-date").value.trim(),prestige:Number(b("stage-editor-race-prestige").value)});let s;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');s=Array.from(n).map(i=>Number(i.value))}Te("CSV-Dateien werden erstellt……");try{const n=await V.exportStageRoute({metadata:Cm(),draft:c.stageEditorDraft,newRace:t,raceDetails:r,updatePrograms:a,programIds:s});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}Br(n.data.stagesFileName,n.data.stagesCsv),Br(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=b("stage-editor-stage-number"),o=Number(i.value)||1;i.value=String(o+1);const d=b("stage-editor-date"),l=d.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(l)){const v=new Date(l);v.setDate(v.getDate()+1);const S=v.getFullYear(),T=String(v.getMonth()+1).padStart(2,"0"),M=String(v.getDate()).padStart(2,"0");d.value=`${S}-${T}-${M}`}await Promise.all([fo(!0),_m(!0)]);const p=uo();b("stage-editor-stage-id").value=String(p),zt=p;const u=b("stage-editor-new-race-checkbox");u&&(u.checked=!1);const m=b("stage-editor-new-race-details");m&&(m.classList.add("hidden"),m.style.display="none");const f=b("stage-editor-program-checkbox");f&&(f.checked=!1);const g=b("stage-editor-program-details");g&&(g.classList.add("hidden"),g.style.display="none"),Kt=Number(b("stage-editor-race-id").value),he()}finally{Se()}}function Jm(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",x=>{const $=x.target.closest("button[data-stage-profile-open-stage-id]");if($){const P=Number($.dataset.stageProfileOpenStageId);Number.isFinite(P)&&rr(P);return}const I=x.target.closest("button[data-stage-editor-stages-sort]");if(!I)return;const R=I.dataset.stageEditorStagesSort;c.stageEditorStagesSort.key===R?c.stageEditorStagesSort.direction=c.stageEditorStagesSort.direction==="asc"?"desc":"asc":c.stageEditorStagesSort={key:R,direction:Em(R)},Qt()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",x=>{const $=x.target.closest("button[data-stage-profile-open-stage-id]");if($){const P=Number($.dataset.stageProfileOpenStageId),F=$.dataset.stageProfileOpenClimbId??null;if(Number.isFinite(P)){let D=null;F&&c.stageEditorClimbRows&&(D=c.stageEditorClimbRows.find(B=>B.id===F)??null),rr(P,D)}return}const I=x.target.closest("button[data-stage-editor-climbs-sort]");if(!I)return;const R=I.dataset.stageEditorClimbsSort;c.stageEditorClimbsSort.key===R?c.stageEditorClimbsSort.direction=c.stageEditorClimbsSort.direction==="asc"?"desc":"asc":c.stageEditorClimbsSort={key:R,direction:Fm(R)},ea()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{Um()});const r=document.getElementById("btn-stage-editor-load-existing");r&&r.addEventListener("click",()=>{Ym()});const s=document.getElementById("btn-stage-editor-export");s&&s.addEventListener("click",()=>{Zm()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",x=>{var I;const $=((I=x.target.files)==null?void 0:I[0])??null;b("stage-editor-file-hint").textContent=$?`${$.name} · ${($.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",x=>{const $=x.target,I=$.closest("tr[data-segment-index]"),R=$.dataset.field;if(!I||!R)return;const P=Number(I.dataset.segmentIndex);if(Number.isInteger(P)){if(R==="markerType"||R==="markerName"||R==="markerCat"){const F=Number($.dataset.markerIndex),D=$.dataset.markerScope;if(!Number.isInteger(F)||D!=="start"&&D!=="end")return;ym(P,F,D,R,$.value);return}Wm(P,R,$.value)}}),i.addEventListener("click",x=>{const $=x.target.closest("button[data-segment-action]");if(!$)return;const I=Number($.dataset.segmentIndex);if(Number.isInteger(I)){if($.dataset.segmentAction==="insert"){jm(I);return}if($.dataset.segmentAction==="append"){Om();return}if($.dataset.segmentAction==="add-marker"){const R=$.dataset.markerScope;if(R!=="start"&&R!=="end")return;vm(I,R);return}if($.dataset.segmentAction==="remove-marker"){const R=Number($.dataset.markerIndex),P=$.dataset.markerScope;if(!Number.isInteger(R)||P!=="start"&&P!=="end")return;Sm(I,R,P);return}$.dataset.segmentAction==="delete"&&Vm(I)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(x=>{const $=document.getElementById(x);$&&$.addEventListener("change",()=>he())}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(x=>{x.addEventListener("change",()=>he())});const d=b("stage-editor-new-race-checkbox"),l=b("stage-editor-new-race-details"),p=b("stage-editor-program-checkbox"),u=b("stage-editor-program-details");d&&d.addEventListener("change",()=>{d.checked?(l&&(l.classList.remove("hidden"),l.style.display="grid"),p&&(p.checked=!0,u&&(u.classList.remove("hidden"),u.style.display="block"))):l&&(l.classList.add("hidden"),l.style.display="none"),he()}),p&&p.addEventListener("change",()=>{p.checked?u&&(u.classList.remove("hidden"),u.style.display="block"):u&&(u.classList.add("hidden"),u.style.display="none"),he()});const m=b("stage-editor-programs-dropdown-trigger"),f=b("stage-editor-programs-dropdown-menu"),g=b("btn-stage-editor-programs-ok");m&&f&&(m.addEventListener("click",x=>{x.stopPropagation();const $=f.style.display==="none"||!f.style.display;f.style.display=$?"flex":"none"}),g&&g.addEventListener("click",x=>{x.stopPropagation(),f.style.display="none",he()}),document.addEventListener("click",x=>{const $=x.target;f.style.display==="flex"&&!f.contains($)&&$!==m&&!m.contains($)&&(f.style.display="none",he())}));const y=b("stage-editor-programs-list");y&&y.addEventListener("change",x=>{x.target.name==="stage-editor-program-selection"&&xm()});let v=!1,S=null;const T=b("stage-editor-stage-id"),M=b("stage-editor-race-id");if(T&&M){[T,M].forEach($=>{$.addEventListener("keydown",I=>{I.key!=="ArrowUp"&&I.key!=="ArrowDown"&&(v=!0,S&&clearTimeout(S))}),$.addEventListener("keyup",I=>{I.key!=="ArrowUp"&&I.key!=="ArrowDown"&&(S&&clearTimeout(S),S=setTimeout(()=>{v=!1},150))}),$.addEventListener("blur",()=>{v=!1})});const x=($,I)=>{const R=Number($.value);if(!Number.isInteger(R)||R<=0){I==="stage"?zt=R:Kt=R;return}const F=R-(I==="stage"?zt:Kt);if(!v&&(F===1||F===-1)){let D=R;I==="stage"?D=wm(R,F):b("stage-editor-new-race-checkbox").checked&&(D=Mm(R,F)),$.value=String(D)}I==="stage"?zt=Number($.value):Kt=Number($.value)};T.addEventListener("input",()=>{x(T,"stage"),he()}),M.addEventListener("input",()=>{x(M,"race"),he()})}}let ot=[],Bt=null,Ne={form:!0,combinedFatigue:!0,shortFatigue:!1,longFatigue:!1};const Dt=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"];function ms(e,t){if(e==null)return"";const a=t?k(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const re={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function er(e,t,a){const r=dt(e??null);return`<span class="badge badge-race-category" style="${ir(r)}; white-space: nowrap; display: inline-block;">${k(e??"Unbekannt")}</span>`}function ps(e){if(!e)return"-";const t=dt(e);return`<span class="badge badge-race-category" style="${ir(t)}; white-space: nowrap; display: inline-block;">${k(e)}</span>`}function qm(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function Xm(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${qm(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function ho(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";case"breakaway_final":return"is-breakaway";default:return""}}function gs(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";case"breakaway_final":return"Ausreißer";default:return"Etappe"}}function Qm(e){return`<span class="rider-stats-final-type ${ho(e)}">${k(gs(e))}</span>`}function ie(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?r+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?r+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?r+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?r+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?r+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(r+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${r}" title="${k(a)}: ${e} Siege">${e}</span>`}function $e(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?r+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?r+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?r+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?r+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?r+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?r+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(r+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${r}" title="${k(a)}: ${e} Siege">${e}</span>`}function ep(e){return`${e.startDate===e.endDate?ne(e.startDate):`${ne(e.startDate)} - ${ne(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function tr(e){if(e==null||c.riders.length===0)return null;const a=[...c.riders].sort((r,s)=>(s.seasonPoints??0)-(r.seasonPoints??0)||(s.seasonWins??0)-(r.seasonWins??0)||s.overallRating-r.overallRating||`${r.lastName} ${r.firstName}`.localeCompare(`${s.lastName} ${s.firstName}`,"de")||r.id-s.id).findIndex(r=>r.id===e);return a>=0?a+1:null}function An(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;case"breakaway_final":return 4;default:return 5}}function tp(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||An(t.rowType)-An(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function ap(e){return[...e].map(t=>({...t,rows:tp(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function bo(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(50,Math.min(85,e));for(let d=1;d<t.length;d++){const l=t[d-1],p=t[d];if(s<=p.score){const u=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*u),r=Math.round(l.lightness+(p.lightness-l.lightness)*u);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function mt(e,t,a,r){const s=r>0?Math.max(0,Math.min(1,a/r)):.5,n=Math.round(6+s*118),i=.26+s*.18,o=.14+s*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${k(t)}">${e} ${a}</span>`}function Rr(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function Ir(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return re.mountain;case"Hill":return re.hilly;case"Sprint":return re.sprint;case"Timetrial":return re.timetrial;case"Cobble":return re.cobble;case"Attacker":return re.attacker;default:return""}}function je(e,t,a,r,s){var Q,Y,j;const n=(t==null?void 0:t.countryCode)??r??null,i=n?oe(n):s,o=(t==null?void 0:t.roleName)??((Q=e==null?void 0:e.role)==null?void 0:Q.name)??"Ohne Rolle",d=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,p=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",u=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",m=((Y=t==null?void 0:t.program)==null?void 0:Y.name)??((j=e==null?void 0:e.seasonProgram)==null?void 0:j.name)??"-",f=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,g=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,y=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,v=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,S=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,T=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,M=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",x=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,$=(t==null?void 0:t.currentSeasonRank)??tr((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),I=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,R=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,P=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,F=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},D=Math.max(F.flat,F.hilly,F.mediumMountain,F.mountain,F.timetrial,F.cobble),B=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},H=Math.max(B.stageRace,B.oneDay),K=e!=null&&e.specialization1?Rr(e.specialization1):"-",w=e!=null&&e.specialization2?Rr(e.specialization2):"-",A=e!=null&&e.specialization3?Rr(e.specialization3):"-",U=Ir((e==null?void 0:e.specialization1)??null),W=Ir((e==null?void 0:e.specialization2)??null),te=Ir((e==null?void 0:e.specialization3)??null);let J="";return t!=null&&t.lieutenantInfo?J=`
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${k(t.lieutenantInfo.name)}</a></span></span>
    `:t!=null&&t.leaderInfo&&(J=`
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${k(t.leaderInfo.name)}</a></span></span>
    `),`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${k(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?Ct(l,p):""} <span>${k(p)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${k(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${bi(u)} <span>Form</span></span>
        ${J}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${bo(d)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${re.seasonForm} ${f>=0?"+":""}${f}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${re.raceForm} ${g>=0?"+":""}${g}</span>
        <span class="rider-stats-icon-pill" title="Programm">${k(m)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${re.raceDays} <span class="rider-stats-icon-pill-value">${y}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${v>14?"text-warning":""}" title="30-Tage Renntage">${re.rollingRaceDays} <span class="rider-stats-icon-pill-value">${v}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${re.longFatigue} <span class="rider-stats-icon-pill-value">${S}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${M!=="none"?"text-error":""}" title="Kurzzeitfatigue">${re.shortFatigue} <span class="rider-stats-icon-pill-value">${T}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${re.seasonPoints} <span class="rider-stats-icon-pill-value">${x}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${re.rank} <span class="rider-stats-icon-pill-value">${Xm($)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${re.raceDays} <span class="rider-stats-icon-pill-value">${I}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${re.wins} <span class="rider-stats-icon-pill-value">${R}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${U} ${k(K)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${W} ${k(w)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${te} ${k(A)}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${mt(re.stageRace,"Rundfahrten Punkte",B.stageRace,H)}
        ${mt(re.oneDay,"Eintagesrennen Punkte",B.oneDay,H)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${re.breakaway} <span class="rider-stats-icon-pill-value">${P}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${mt(re.flat,"Flach-Punkte",F.flat,D)}
        ${mt(re.hilly,"Hügel-Punkte",F.hilly,D)}
        ${mt(re.mediumMountain,"Mittelgebirge-Punkte",F.mediumMountain,D)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${mt(re.mountain,"Hochgebirge-Punkte",F.mountain,D)}
        ${mt(re.timetrial,"Zeitfahren-Punkte",F.timetrial,D)}
        ${mt(re.cobble,"Kopfsteinpflaster-Punkte",F.cobble,D)}
      </div>
    </div>
  `}function Bn(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",r=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${k(a)} <strong>${k(r)}</strong>`}function Oe(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${c.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${c.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${c.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${c.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${c.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${c.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${c.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
    </div>`}function rp(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(55,Math.min(80,e));for(let d=1;d<t.length;d++){const l=t[d-1],p=t[d];if(s<=p.score){const u=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*u),r=Math.round(l.lightness+(p.lightness-l.lightness)*u);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function sp(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},r=["mountain","hill","sprint","timeTrial","cobble","attack"],s=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,d=i/2,l=160,p=60,u=85,m=u-p,f=B=>{const H=[];for(let K=0;K<6;K++){const w=K*Math.PI/3-Math.PI/2;H.push(`${o+B*Math.cos(w)},${d+B*Math.sin(w)}`)}return H},g=`
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
    </defs>`,y=`<circle cx="${o}" cy="${d}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let v="";for(let B=p;B<=u;B+=2.5){const H=l*((B-p)/m);if(H<1){v+=`<circle cx="${o}" cy="${d}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const K=f(H),w=B%5===0,A=w?1:.6,U=w?"none":"4,4",W=w?.4:.18;v+=`<polygon points="${K.join(" ")}" fill="none" stroke="rgba(255,255,255,${W})" stroke-width="${A}" stroke-dasharray="${U}" />`,w&&B>p&&(v+=`<text x="${o+5}" y="${d-H+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${B}</text>`)}let S="",T="";for(let B=0;B<6;B++){const H=B*Math.PI/3-Math.PI/2,K=o+l*Math.cos(H),w=d+l*Math.sin(H);S+=`<line x1="${o}" y1="${d}" x2="${K}" y2="${w}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const A=l+28,U=o+A*Math.cos(H),W=d+A*Math.sin(H),te=Math.cos(H);let J="middle";te>.15?J="start":te<-.15&&(J="end");const Q=a[r[B]]??p;T+=`<text x="${U}" y="${W}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${J}" dominant-baseline="middle">${s[B]}</text>`,T+=`<text x="${U}" y="${W+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${J}" dominant-baseline="middle">${Q}</text>`}const M=[],x=[];r.forEach((B,H)=>{const K=a[B]??p,w=l*((Math.max(p,Math.min(u,K))-p)/m),A=H*Math.PI/3-Math.PI/2,U=o+w*Math.cos(A),W=d+w*Math.sin(A);M.push(`${U},${W}`),x.push(`<circle cx="${U}" cy="${W}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${s[H]}: ${K}</title></circle>`)});const $=`<polygon points="${M.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,R=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((B,H)=>{const K=a[B.key]??60;return(a[H.key]??60)-K}),P=[],F=[];R.forEach((B,H)=>{const K=a[B.key]??60,w=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${B.label}</span>
        ${rp(K)}
      </div>
    `;H%2===0?P.push(w):F.push(w)});const D=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${P.join("")}</div>
      <div class="skills-col">${F.join("")}</div>
    </div>
  `;return`
    <section class="rider-stats-skills-tab" style="margin-top: 1rem;">
      <div class="rider-stats-skills-container" style="display: grid; grid-template-columns: 540px 1fr; gap: 2rem; align-items: start; background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-primary);">
        <div class="skills-radar-wrapper" style="display: flex; justify-content: center; align-items: center; background: var(--bg-900); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-primary);">
          <svg width="540" height="440" viewBox="0 0 ${n} ${i}" style="overflow: visible;">
            ${g}
            ${y}
            ${v}
            ${S}
            ${$}
            ${x.join("")}
            ${T}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${D}
        </div>
      </div>
    </section>
  `}function np(e,t){const a=t.shortTermFatigueMalus??0,r=t.longTermFatigueDecayable??0,s=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),d=(r/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const p=t.fatigueHistory??[];let u="";return p.length===0?u='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':u=p.map(m=>{const f=ne(m.date);let g="";m.type==="race"?g=`${k(m.raceName)}${m.stageNumber!=null?` - Etappe ${m.stageNumber}`:""}`:g=m.raceName?k(m.raceName):"Regeneration";const y=m.type==="race"&&m.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${m.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let v="";m.shortChange>0?v=`<span style="color: #ef4444; font-weight: 600;">+${m.shortChange.toFixed(2).replace(".",",")}</span>`:m.shortChange<0?v=`<span style="color: #2ecc71; font-weight: 600;">${m.shortChange.toFixed(2).replace(".",",")}</span>`:v='<span style="color: #666;">0,00</span>';const S=[];if(m.longDecayableChange!==0){const x=m.longDecayableChange>0?"+":"",$=m.longDecayableChange>0?"#ef4444":"#2ecc71";S.push(`<span style="color: ${$}; font-weight: 500;">${x}${m.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(m.longLockedChange!==0){const x=m.longLockedChange>0?"+":"",$=m.longLockedChange>0?"#a855f7":"#2ecc71";S.push(`<span style="color: ${$}; font-weight: 500;">${x}${m.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const T=S.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${S.join("")}</div>`:'<span style="color: #666;">0,00</span>',M=m.shortAfter+m.longAfter;return`
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${f}</td>
          <td style="color: #fff; font-weight: 600; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${g}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${y}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${v}
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
                ${re.shortFatigue}
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
                ${re.longFatigue}
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
  `}function ip(e){var j;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((L,_)=>_%2===0),r=((j=c.gameState)==null?void 0:j.currentDate)??new Date().toISOString(),s=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(r).getUTCFullYear(),n=new Date(Date.UTC(s,0,1)).getTime(),i=864e5,o=1260,d=384,l=40,p=20,u=a.map(L=>{const E=(new Date(L.date).getTime()-n)/i,O=l+E/365*o,G=p+d-Math.min(8,Math.max(0,L.totalForm))/8*d;return{x:O,y:G,form:L.totalForm,date:L.date}});let m="",f="",g="";Ne.form&&u.length>0&&(m=`M ${u.map(L=>`${L.x},${L.y}`).join(" L ")}`,f=u.map(L=>`<circle cx="${L.x}" cy="${L.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${L.date}): ${L.form}</title></circle>`).join(""),g=`${m} L ${u[u.length-1].x},${p+d} L ${u[0].x},${p+d} Z`);let y="",v="";if(Ne.combinedFatigue&&u.length>0){const L=a.map(E=>{const G=(new Date(E.date).getTime()-n)/i,h=l+G/365*o,C=E.combinedFatigue??0,N=p+d-Math.min(15,Math.max(0,C))/15*d;return{x:h,y:N,val:C,date:E.date}});y=`<path d="${`M ${L.map(E=>`${E.x},${E.y}`).join(" L ")}`}" fill="none" stroke="#ef4444" stroke-width="2" />`,v=L.map(E=>`<circle cx="${E.x}" cy="${E.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${E.date}): ${E.val.toFixed(2)}</title></circle>`).join("")}let S="",T="";if(Ne.shortFatigue&&u.length>0){const L=a.map(E=>{const G=(new Date(E.date).getTime()-n)/i,h=l+G/365*o,C=E.shortFatigue??0,N=p+d-Math.min(15,Math.max(0,C))/15*d;return{x:h,y:N,val:C,date:E.date}});S=`<path d="${`M ${L.map(E=>`${E.x},${E.y}`).join(" L ")}`}" fill="none" stroke="#facc15" stroke-width="2" />`,T=L.map(E=>`<circle cx="${E.x}" cy="${E.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${E.date}): ${E.val.toFixed(2)}</title></circle>`).join("")}let M="",x="";if(Ne.longFatigue&&u.length>0){const L=a.map(E=>{const G=(new Date(E.date).getTime()-n)/i,h=l+G/365*o,C=E.longFatigue??0,N=p+d-Math.min(15,Math.max(0,C))/15*d;return{x:h,y:N,val:C,date:E.date}});M=`<path d="${`M ${L.map(E=>`${E.x},${E.y}`).join(" L ")}`}" fill="none" stroke="#a855f7" stroke-width="2" />`,x=L.map(E=>`<circle cx="${E.x}" cy="${E.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${E.date}): ${E.val.toFixed(2)}</title></circle>`).join("")}const $="rgba(251, 191, 36, 0.15)";let I="";for(let L=0;L<=8;L+=2){const _=p+d-L/8*d;I+=`<line x1="${l}" y1="${_}" x2="${l+o}" y2="${_}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,I+=`<text x="${l-5}" y="${_+4}" fill="#ffffff" font-size="10" text-anchor="end">${L}</text>`}for(let L=0;L<=15;L+=3){const _=p+d-L/15*d;I+=`<text x="${l+o+5}" y="${_+4}" fill="#ef4444" font-size="10" text-anchor="start">${L}</text>`}let R="";for(let L=0;L<=52;L+=5){const _=l+L/52*o;I+=`<line x1="${_}" y1="${p}" x2="${_}" y2="${p+d}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,R+=`<text x="${_}" y="${p+d+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${L}</text>`}let P="",F="";if(e.peakDates){const L=[...e.peakDates].sort((_,E)=>new Date(_).getTime()-new Date(E).getTime());for(let _=0;_<L.length;_++){const E=L[_],G=(new Date(E).getTime()-n)/i,h=l+G/365*o;P+=`<line x1="${h}" y1="${p}" x2="${h}" y2="${p+d}" stroke="#ffffff" stroke-width="2"><title>Peak: ${E}</title></line>`;const C=_>0?(new Date(L[_-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,N=G-56,z=C+14,ae=Math.max(0,Math.max(N,z)),le=G-ae,me=l+ae/365*o,pe=le/365*o;F+=`<rect x="${me}" y="${p}" width="${pe}" height="${d}" fill="rgba(16, 185, 129, 0.1)" />`;const ge=14/365*o;F+=`<rect x="${h}" y="${p}" width="${ge}" height="${d}" fill="rgba(239, 68, 68, 0.1)" />`}}const B=(new Date(r).getTime()-n)/i,H=l+B/365*o;P+=`<line x1="${H}" y1="${p}" x2="${H}" y2="${p+d}" stroke="#ef4444" stroke-width="3"><title>Heute: ${r}</title></line>`,ot.forEach((L,_)=>{const E=Dt[_%Dt.length];L.peakDates&&L.peakDates.forEach(O=>{const h=(new Date(O).getTime()-n)/i,C=l+h/365*o;P+=`<line x1="${C}" y1="${p}" x2="${C}" y2="${p+d}" stroke="${E}" stroke-width="1.5" stroke-dasharray="3,3"><title>${L.riderName} Peak: ${O}</title></line>`})});let K="",w="";ot.forEach((L,_)=>{const E=Dt[_%Dt.length],O=L.formHistory.filter((G,h)=>h%2===0).map(G=>{const C=(new Date(G.date).getTime()-n)/i,N=l+C/365*o,z=p+d-Math.min(8,Math.max(0,G.totalForm))/8*d;return{x:N,y:z,form:G.totalForm,date:G.date}});if(O.length>0){const G=`M ${O.map(h=>`${h.x},${h.y}`).join(" L ")}`;K+=`<path d="${G}" fill="none" stroke="${E}" stroke-width="2" />`,w+=O.map(h=>`<circle cx="${h.x}" cy="${h.y}" r="3" fill="#fff" stroke="${E}" stroke-width="2"><title>${L.riderName} (${h.date}): ${h.form}</title></circle>`).join("")}});const A=c.teams.filter(L=>L.division==="WorldTour"||L.divisionName==="WorldTour");let U='<option value="">-- Team auswählen --</option>';for(const L of A){const _=Bt===L.id?" selected":"";U+=`<option value="${L.id}"${_}>${k(L.name)}</option>`}let W='<option value="">-- Fahrer auswählen --</option>';if(Bt!=null){const L=c.riders.filter(_=>_.activeTeamId===Bt&&_.id!==e.riderId&&!ot.some(E=>E.riderId===_.id));for(const _ of L)W+=`<option value="${_.id}">${k(_.firstName)} ${k(_.lastName)}</option>`}const te=`
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
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${Bt==null?"disabled":""}>
          ${W}
        </select>
      </div>
    </div>
  `,J=e.currentSeasonRank??tr(e.riderId)??"–",Q=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${k(e.riderName)} (${e.currentSeasonPoints}/${J})">${k(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${J})</span></span>
    </div>
    `];ot.forEach((L,_)=>{const E=Dt[_%Dt.length],O=L.currentSeasonRank??tr(L.riderId)??"–";Q.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${E}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${k(L.riderName)} (${L.currentSeasonPoints}/${O})">${k(L.riderName)} <span style="color: var(--text-500);">(${L.currentSeasonPoints}/${O})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${L.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const Y=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      
      <!-- Chart Line Toggle Checkboxes -->
      <div class="chart-line-toggles" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-form" ${Ne.form?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-combined-fatigue" ${Ne.combinedFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #ef4444;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
          Gesamtfatigue (0-15)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-short-fatigue" ${Ne.shortFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #facc15;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #facc15; border-radius: 50%;"></span>
          Kurzzeitfatigue (0-15)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-long-fatigue" ${Ne.longFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #a855f7;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #a855f7; border-radius: 50%;"></span>
          Langzeitfatigue (0-15)
        </label>
      </div>

      <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-500); font-weight: bold; margin-bottom: 0.5rem; letter-spacing: 0.5px;">Fahrer</div>
      ${Q.join("")}
    </div>
  `;return`
    <section class="rider-stats-form-tab">
      <div class="rider-stats-season-head">
        <h3>Formverlauf (Saison ${s})</h3>
      </div>
      ${te}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${F}
            ${I}
            ${R}
            ${P}
            ${g?`<path d="${g}" fill="${$}" />`:""}
            ${m?`<path d="${m}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${f}
            ${y}
            ${v}
            ${S}
            ${T}
            ${M}
            ${x}
            ${K}
            ${w}
          </svg>
        </div>
        ${Y}
      </div>
    </section>
  `}function op(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
      <section class="rider-stats-placeholder">
        <h3>${k(e.program.name)}</h3>
        <p>Diesem Programm sind aktuell keine Rennen zugeordnet.</p>
      </section>`:`
    <section class="rider-stats-program">
      <div class="rider-stats-season-head">
        <h3>${k(e.program.name)}</h3>
        <span>${t.length} Rennen</span>
      </div>
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table rider-stats-program-table">
          <thead><tr><th>Datum</th><th class="text-center">Status</th><th>Land</th><th>Rennen</th><th>Rennklasse</th></tr></thead>
          <tbody>
            ${t.map(a=>{var s;const r=e.unavailableUntil?a.startDate<=e.unavailableUntil&&a.endDate>=c.gameState.currentDate:!1;return`
              <tr>
                <td>${k(mr(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${r?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(s=a.country)!=null&&s.code3?oe(a.country.code3):"–"}</td>
                <td><strong>${k(a.name)}</strong></td>
                <td>${ur(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function fs(e){const t=new Set;if(e.jerseysWorn){const i=e.jerseysWorn.split(",").map(o=>o.trim()).filter(Boolean);for(const o of i)t.add(o)}const a=new Map;if(e.eventIds){const i=e.eventIds.split("|");for(const o of i){const[d,l]=o.split(":");d&&a.set(d,l?parseInt(l,10):1)}}const r=[{type:"jersey",key:"yellow",label:"Gelbes Trikot (Gesamtwertung)",colorClass:"jersey-dot-yellow"},{type:"jersey",key:"green",label:"Grünes Trikot (Punktewertung)",colorClass:"jersey-dot-green"},{type:"jersey",key:"red",label:"Bergtrikot (Bergwertung)",colorClass:"jersey-dot-red"},{type:"jersey",key:"white",label:"Weißes Trikot (Nachwuchswertung)",colorClass:"jersey-dot-white"},{type:"jersey",key:"purple",label:"Lila Trikot (Aktivste Fahrer)",colorClass:"jersey-dot-purple-worn"},{type:"event",key:"3",label:"Superform",colorClass:"event-dot-3"},{type:"event",key:"4",label:"Supermalus",colorClass:"event-dot-4"},{type:"event",key:"1",label:"Sturz",colorClass:"event-dot-1"},{type:"event",key:"2",label:"Defekt",colorClass:"event-dot-2"},{type:"event",key:"7",label:"Heimvorteil",colorClass:"event-dot-7"},{type:"event",key:"8",label:"Heimbonus",colorClass:"event-dot-8"},{type:"event",key:"9",label:"Heimmalus",colorClass:"event-dot-9"},{type:"event",key:"5",label:"Attacken",colorClass:"event-dot-5"},{type:"event",key:"6",label:"Konterattacken",colorClass:"event-dot-6"}],s=[],n=[];for(const i of r)if(i.type==="jersey")t.has(i.key)&&(s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${k(i.label)}</span>
          </div>
        `));else{const o=a.get(i.key);if(o!==void 0&&o>0){const d=o>1?` (${o}x)`:"";s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${k(i.label)}${k(d)}</span>
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
  `}function Pt(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${k(e)}</span>`}function lp(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function dp(e){return e.finishStatus==="otl"?Pt("OTL","place"):e.finishStatus==="dnf"?Pt("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${k(String(e.resultRank))}</span>`}function cp(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":Pt(String(e.gcRank),"gc")}function up(e){return e.finishStatus==="otl"?Dr(e.statusReason,!0):e.finishStatus==="dnf"?Dr(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${Wa(e.stageTimeSeconds)}`:e.resultLabel}function Be(e,t,a=!1){var o,d;const r=(e==null?void 0:e.activeTeamId)!=null?((o=c.teams.find(l=>l.id===e.activeTeamId))==null?void 0:o.name)??null:null,s=((d=e==null?void 0:e.country)==null?void 0:d.code3)??(e==null?void 0:e.nationality)??null,n=s?oe(s):"",i=t==null?[]:[...t.seasons].map(l=>({...l,raceBlocks:ap(l.raceBlocks)})).sort((l,p)=>p.season-l.season);return a?`
      ${je(e,t,r,s,n)}
      ${Oe(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`:t?c.riderStatsTab==="skills"?`
      ${je(e,t,r,s,n)}
      ${Oe(t)}
      ${sp(e)}`:c.riderStatsTab==="fatigue"?`
      ${je(e,t,r,s,n)}
      ${Oe(t)}
      ${np(e,t)}`:c.riderStatsTab==="program"?`
      ${je(e,t,r,s,n)}
      ${Oe(t)}
      ${op(t)}`:c.riderStatsTab==="form"?`
      ${je(e,t,r,s,n)}
      ${Oe(t)}
      ${ip(t)}`:c.riderStatsTab==="topResults"?`
      ${je(e,t,r,s,n)}
      ${Oe(t)}
      ${pp(t)}`:c.riderStatsTab==="career"?`
      ${je(e,t,r,s,n)}
      ${Oe(t)}
      ${gp(t)}`:t.seasons.length===0?`
      ${je(e,t,r,s,n)}
      ${Oe(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`:`
    ${je(e,t,r,s,n)}
    ${Oe(t)}
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
                  <h4>${k(p.raceName)}</h4>
                  <p>${k(ep(p))}</p>
                </div>
                ${er(p.raceCategoryName,p.isStageRace,p.rows.filter(u=>u.rowType==="stage_result").length||null)}
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
                    ${p.rows.map(u=>{const m=u.rowType!=="stage_result",f=m?`${u.raceName} · ${gs(u.rowType)}`:u.stageName?`${u.raceName} · ${u.stageName}`:u.raceName;return`
                        <tr class="rider-stats-row${m?" rider-stats-row-final":""}">
                          <td>${k(ne(u.date))}</td>
                          <td>${dp(u)}</td>
                          <td>${cp(u)}</td>
                          <td class="rider-stats-breakaway-col">${lp(u)}</td>
                          <td>${m?"":ms(u.rolledWeatherId,u.rolledWetterName)}</td>
                          <td>${m?Qm(u.rowType):er(u.raceCategoryName?u.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):u.raceCategoryName,u.isStageRace)}</td>
                          <td>${k(f)}</td>
                          <td class="status-cell">${fs(u)}</td>
                          <td>${m?"–":u.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${u.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${ya(u.profile)}</button>`:"–"}</td>
                          <td>${m?"-":u.distanceKm!=null?k(u.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                          <td>${m?"-":u.elevationGainMeters!=null?k(String(Math.round(u.elevationGainMeters))):"–"}</td>
                          <td>${k(up(u))}</td>
                          <td>${u.seasonPoints}</td>
                        </tr>`}).join("")}
                  </tbody>
                </table>
              </div>
            </section>`).join("")}
        </div>
      </section>`).join("")}`:`
      ${je(e,t,r,s,n)}
      ${Oe(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`}function Kr(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(c.riderStatsTab)?(e.style.minWidth="min(1475px, 95vw)",e.style.maxWidth="1687px"):(e.style.minWidth="",e.style.maxWidth="")}async function Ut(e){var d,l,p,u;const t=we(e),a=(t==null?void 0:t.activeTeamId)!=null?((d=c.teams.find(m=>m.id===t.activeTeamId))==null?void 0:d.name)??null:null;ot=[],Bt=null,c.riderStatsSelectedRiderId=e,c.riderStatsTab="results",Kr(),c.riderStatsTopResultsFilterCategory=null,c.riderStatsTopResultsFilterSeason=null,c.riderStatsTopResultsPage=1,b("rider-stats-title").innerHTML=Bn(t,null),b("rider-stats-jersey").innerHTML="";const r=t!=null&&t.age?` · Alter ${t.age}`:"";b("rider-stats-meta").textContent=t?`${((l=t.role)==null?void 0:l.name)??"Fahrer"} · ${a??"Team unbekannt"}${r}`:"Historie wird geladen",b("rider-stats-body").innerHTML=Be(t,null,!0),Je("riderStats");const s=await V.getRiderStats(e);if(c.riderStatsSelectedRiderId!==e)return;if(!s.success||!s.data){const m=t!=null&&t.age?` · Alter ${t.age}`:"";b("rider-stats-meta").textContent=t?`${((p=t.role)==null?void 0:p.name)??"Fahrer"} · ${a??"Team unbekannt"}${m}`:"Fehler beim Laden",b("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${k(s.error??"Unbekannter Fehler")}</p>
      </section>`;return}c.riderStatsPayload=s.data,Kr(),b("rider-stats-title").innerHTML=Bn(t,s.data),b("rider-stats-jersey").innerHTML="";const n=s.data.age?` · Alter ${s.data.age}`:t!=null&&t.age?` · Alter ${t.age}`:"",i=s.data.mentorName?` · Mentor: ${s.data.mentorName}`:"",o=s.data.mentoredRiderNames&&s.data.mentoredRiderNames.length>0?` · Mentor von: ${s.data.mentoredRiderNames.join(" - ")}`:"";b("rider-stats-meta").textContent=`${((u=t==null?void 0:t.role)==null?void 0:u.name)??"Fahrer"} · ${s.data.teamName??a??"Ohne aktives Team"}${n} · ${s.data.seasons.length} Saisons${i}${o}`,b("rider-stats-body").innerHTML=Be(t,s.data,!1)}function mp(){b("rider-stats-body").addEventListener("click",e=>{var s;if(e.target&&e.target.id&&e.target.id.startsWith("toggle-chart-")){const n=e.target.id,i=e.target.checked;n==="toggle-chart-form"?Ne.form=i:n==="toggle-chart-combined-fatigue"?Ne.combinedFatigue=i:n==="toggle-chart-short-fatigue"?Ne.shortFatigue=i:n==="toggle-chart-long-fatigue"&&(Ne.longFatigue=i);const o=we(c.riderStatsSelectedRiderId);b("rider-stats-body").innerHTML=Be(o,c.riderStatsPayload,!1);return}const t=e.target.closest("button[data-rider-stats-tab]");if(!t){const n=e.target.closest("button[data-remove-compare-id]");if(n){const d=Number(n.dataset.removeCompareId);ot=ot.filter(p=>p.riderId!==d);const l=we(c.riderStatsSelectedRiderId);b("rider-stats-body").innerHTML=Be(l,c.riderStatsPayload,!1);return}const i=e.target.closest("button[data-top-results-page]");if(i){const d=Number(i.dataset.topResultsPage);if(!isNaN(d)&&d>=1){c.riderStatsTopResultsPage=d;const l=we(c.riderStatsSelectedRiderId);b("rider-stats-body").innerHTML=Be(l,c.riderStatsPayload,!1)}return}const o=e.target.closest("button[data-stage-profile-id]");if(o){const d=Number(o.dataset.stageProfileId);Number.isFinite(d)&&rr(d);return}return}const a=t.dataset.riderStatsTab;if(a!=="results"&&a!=="program"&&a!=="form"&&a!=="topResults"&&a!=="skills"&&a!=="career"&&a!=="fatigue"||a==="program"&&(((s=c.riderStatsPayload)==null?void 0:s.programRaces.length)??0)===0)return;c.riderStatsTab=a,Kr();const r=we(c.riderStatsSelectedRiderId);b("rider-stats-body").innerHTML=Be(r,c.riderStatsPayload,!1)}),b("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){c.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,c.riderStatsTopResultsPage=1;const a=we(c.riderStatsSelectedRiderId);b("rider-stats-body").innerHTML=Be(a,c.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){c.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),c.riderStatsTopResultsPage=1;const a=we(c.riderStatsSelectedRiderId);b("rider-stats-body").innerHTML=Be(a,c.riderStatsPayload,!1)}else if(t.classList.contains("rider-stats-filter-checkbox")){const a=t.dataset.filterType;c.riderStatsTopResultsFilters[a]=t.checked,c.riderStatsTopResultsPage=1;const r=we(c.riderStatsSelectedRiderId);b("rider-stats-body").innerHTML=Be(r,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;Bt=a?Number(a):null;const r=we(c.riderStatsSelectedRiderId);b("rider-stats-body").innerHTML=Be(r,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const r=Number(a);if(ot.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const s=await V.getRiderStats(r,!0);s.success&&s.data?ot.push({riderId:s.data.riderId,riderName:s.data.riderName,teamId:s.data.teamId,teamName:s.data.teamName,formHistory:s.data.formHistory??[],peakDates:s.data.peakDates??[],currentSeasonPoints:s.data.currentSeasonPoints??0,currentSeasonRank:s.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(s.error??""));const n=we(c.riderStatsSelectedRiderId);b("rider-stats-body").innerHTML=Be(n,c.riderStatsPayload,!1)}}})}function Hn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function pp(e){const t=[];for(const g of e.seasons)for(const y of g.raceBlocks)for(const v of y.rows)t.push({...v,season:g.season,isStageRace:y.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,y)=>g.localeCompare(y,"de"));const r=Array.from(new Set(t.map(g=>g.season))).sort((g,y)=>y-g);let s=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?c.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?c.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?c.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?c.riderStatsTopResultsFilters.youth:!0:g.isStageRace?c.riderStatsTopResultsFilters.stage:c.riderStatsTopResultsFilters.oneDay);if(c.riderStatsTopResultsFilterCategory){const g=c.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const y=g.substring(0,g.length-8);s=s.filter(v=>v.raceCategoryName===y&&v.rowType==="stage_result")}else if(g.endsWith("-gc")){const y=g.substring(0,g.length-3);s=s.filter(v=>v.raceCategoryName===y&&v.rowType!=="stage_result")}else s=s.filter(y=>y.raceCategoryName===g)}c.riderStatsTopResultsFilterSeason!=null&&(s=s.filter(g=>g.season===c.riderStatsTopResultsFilterSeason)),s.sort((g,y)=>{if(y.seasonPoints!==g.seasonPoints)return y.seasonPoints-g.seasonPoints;const v=g.rowType!=="stage_result",S=y.rowType!=="stage_result",T=g.resultRank??9999,M=y.resultRank??9999;if(c.riderStatsTopResultsFilterCategory)return T!==M?T-M:v!==S?v?-1:1:0;{const x=Hn(g.raceCategoryName),$=Hn(y.raceCategoryName);return x!==$?x-$:v!==S?v?-1:1:T-M}});const n=200,i=s.slice(0,1e3),o=Math.max(1,Math.ceil(i.length/n));c.riderStatsTopResultsPage>o&&(c.riderStatsTopResultsPage=o);const d=(c.riderStatsTopResultsPage-1)*n,l=i.slice(d,d+n),u=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${a.map(g=>{if(g.toLowerCase().includes("stage race")||g.toLowerCase().includes("grand tour")||g.toLowerCase().includes("tour de france")){const v=`${g}-etappen`,S=`${g}-gc`;return`
        <option value="${k(v)}" ${c.riderStatsTopResultsFilterCategory===v?"selected":""}>${k(g)} - Etappen</option>
        <option value="${k(S)}" ${c.riderStatsTopResultsFilterCategory===S?"selected":""}>${k(g)} - GC</option>
      `}else return`<option value="${k(g)}" ${c.riderStatsTopResultsFilterCategory===g?"selected":""}>${k(g)}</option>`}).join("")}
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
  `,m=l.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':l.map(g=>{const y=g.rowType!=="stage_result",v=y?`${g.raceName} · ${gs(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let S="–",T="–";g.finishStatus==="otl"?S=Pt("OTL","place"):g.finishStatus==="dnf"?S=Pt("DNF","place"):g.resultRank==null||(y?T=`<span class="rider-stats-final-type ${ho(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:S=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${k(String(g.resultRank))}</span>`);const M=y?"–":g.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${g.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${ya(g.profile)}</button>`:"–",x=!y&&g.stageScore!=null&&g.stageScore>0?cr(g.stageScore,0,350):"–",$=er(g.raceCategoryName?g.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${y?" rider-stats-row-final":""}">
            <td>${S}</td>
            <td>${T}</td>
            <td><strong>${k(v)}</strong>${y?"":ms(g.rolledWeatherId,g.rolledWetterName)}</td>
            <td class="status-cell">${fs(g)}</td>
            <td>${M}</td>
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
  `}function gp(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,superteamCount:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),r=(n,i,o,d)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let p="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?p+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?p+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?p+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?p+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?p+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?p+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?p+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?p+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(p+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${p}" title="${k(o)}">${n}</span>`},s=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${k(n.name)}">${k(n.name)}</span>
                ${ps(n.key)}
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
                  ${ie(i.winFlat||0,"flat","Flach (Flat)")}
                  ${ie(i.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${ie(i.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${ie(i.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${ie(i.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${ie(i.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${ie(i.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${ie(i.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${ie(i.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${ie(i.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${ie(i.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${$e(i.winWeather1||0,1,"Sonnig")}
                  ${$e(i.winWeather2||0,2,"Extreme Hitze")}
                  ${$e(i.winWeather3||0,3,"Leichter Regen")}
                  ${$e(i.winWeather4||0,4,"Starkregen")}
                  ${$e(i.winWeather5||0,5,"Starker Wind")}
                  ${$e(i.winWeather6||0,6,"Dichter Nebel")}
                  ${$e(i.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${re.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${i.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}window.openRiderStatsFromRiderStats=Ut;const fp=250,_t=1200,hp=250,bp=1200,Gn=.2;class yp{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",r=>{var i,o,d,l;const s=r.target.closest("button[data-race-sim-action]");if(s){if(s.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const u=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;u&&((l=(d=this.options).onFinishRequested)==null||l.call(d,u,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=r.target.closest("button[data-race-sim-speed]");if(n){const p=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(p))return;this.timeMultiplier=p,this.render()}}),this.elements.messages.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-group-rider-id]");if(s){const d=this.resolveRiderIdFromGroupButton(s);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),Ut(d));return}const n=r.target.closest("button[data-race-sim-group-rider-name]");if(n){const d=this.resolveRiderIdFromGroupButton(n);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),Ut(d));return}const i=r.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),fn(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",r=>{const s=r.target.closest("[data-race-sim-overview-summary]");if(s){const n=s.dataset.raceSimOverviewSummary,i=s.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(r)}),this.elements.groupBox.addEventListener("click",r=>{this.handleGroupInteraction(r)}),this.elements.profile.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-timing-mode]");if(!s)return;const n=s.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+_t,this.render())})}handleGroupInteraction(t){var p,u;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const m=this.resolveRiderIdFromGroupButton(a);m!=null&&this.selectGroupByRiderId(m,this.detailSnapshot);return}const r=t.target.closest("button[data-race-sim-group-nav]");if(!r)return;const s=this.buildRaceGroups(this.detailSnapshot);if(s.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,s.findIndex(m=>m.label===n)),o=r.dataset.raceSimGroupNav==="prev"?-1:1,d=(i+o+s.length)%s.length,l=((p=s[d])==null?void 0:p.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",m=>{const f=m.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+_t)}),this.elements.profile.addEventListener("wheel",m=>{const f=m.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+_t)},{passive:!0}),this.elements.profile.addEventListener("scroll",m=>{const f=m.target;!(f instanceof HTMLElement)||!f.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+_t)},!0),(u=this.elements.sidebar.parentElement)==null||u.addEventListener("click",m=>{if(!this.bootstrap||!this.detailSnapshot||!Ru(this.elements.sidebar,m.target))return;const g=performance.now(),y=En(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(y);const v=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",v),this.scheduleSidebarPaintTelemetry(g,v),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new Ai(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const r=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(r),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(s=>this.frame(s));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const r=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-r),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(s=>this.frame(s))}render(t=performance.now(),a=!1){var f;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const r=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",s=Fl(this.bootstrap.stageSummary),n=[`${s.segmentCount} Segmente`,s.sprintCount>0?`${s.sprintCount} Sprint${s.sprintCount===1?"":"s"}`:null,s.climbCount>0?`${s.climbCount} Bergwertung${s.climbCount===1?"":"en"}`:null].filter(g=>g!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,d=o!=null?i[o]??"":"",l=d?` · ${d}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${r}${n?` · ${n}`:""}${l}`;const p=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=fp,u=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,m=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=hp;if(p||u||m){const g=performance.now();this.detailSnapshot=((f=this.engine)==null?void 0:f.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-g)}if(p&&this.detailSnapshot){const g=this.elements.profile.querySelector(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop);const y=performance.now();Bl(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-y),this.lastProfileRenderTime=t;const v=this.elements.profile.querySelector(".race-sim-timing-scroll");v&&(v.scrollTop=this.timingScrollTop)}if(u&&this.detailSnapshot){this.lastSidebarRenderTime=t;const g=performance.now(),y=En(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(y);const v=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",v),this.scheduleSidebarPaintTelemetry(g,v)}m&&this.detailSnapshot&&(fn(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),mu(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),ou(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),gn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const r=a.find(s=>s.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(r)return r.label}return this.selectedGroupLabel!=null&&a.some(r=>r.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return ts(es(t.clusters))}resolveInitialGroupLabel(t){var a,r;return((a=t.find(s=>s.label==="P"))==null?void 0:a.label)??((r=t[0])==null?void 0:r.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(r=>[r.riderId,r]));return[...t.riderIds].sort((r,s)=>{var n,i;return(((n=a.get(r))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(s))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||r-s})[0]??null}selectGroupByLabel(t,a,r=!0){const s=this.buildRaceGroups(a),n=s.find(i=>i.label===t)??s.find(i=>i.label==="P")??s[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),r&&(this.profileInteractionHoldUntilMs=performance.now()+_t,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const s=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;s&&(this.selectedGroupLabel=s.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+_t,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+bp,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const r=t.dataset.raceSimGroupRiderName;if(!r)return null;const s=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===r&&(s==null||i.activeTeamId===s))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const r=this.perfTelemetry[t];this.perfTelemetry[t]=r<=0?a:r*(1-Gn)+a*Gn}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const r=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(r!==this.sidebarPaintSequence)return;const s=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",s),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||gn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const Ue="__stage_overview__",yo="__non_finishers__",vo="__events__",So="__roster__";let Pe="all";function hs(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function zn(e){return hs(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function vp(e){return[...e].sort((t,a)=>zn(t)-zn(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function Sp(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=hs(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function kp(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function $p(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${ne(t.date)}`}async function Wr(e,t){var s;const a=ja(e);if(a&&(c.selectedResultsRaceId=a.race.id,c.selectedResultsStageId=e),c.riders.length===0){const n=await V.getRiders();n.success&&(c.riders=n.data??[])}const r=await V.getStageResults(e);if(!r.success){c.stageResults=null,Me(),!t&&r.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+r.error);return}c.stageResults=r.data??null,c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId,c.selectedResultTypeId=((s=c.stageResults.classifications[0])==null?void 0:s.resultTypeId)??1,c.selectedResultsMarkerKey=Ue,c.selectedResultsSpecialView=null),c.selectedResultsRaceId!=null&&ko(c.selectedResultsRaceId),Me()}async function ko(e){if(!c.seasonStandings){const a=await V.getSeasonStandings();a.success&&a.data&&(c.seasonStandings=a.data)}const t=await V.getRaceResultsRoster(e);t.success&&t.data?c.resultsRoster=t.data:c.resultsRoster=null}function xp(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function Kn(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function Tp(){const e=c.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=yt(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=[...e.entries].sort((v,S)=>S.overallRating-v.overallRating),s=new Set(r.slice(0,5).map(v=>v.riderId)),n=v=>{var T;const S=c.riders.find(M=>M.id===v);return((T=S==null?void 0:S.skills)==null?void 0:T.sprint)??0},o=[...e.entries.filter(v=>!s.has(v.riderId))].sort((v,S)=>{const T=n(v.riderId),M=n(S.riderId);return M!==T?M-T:S.overallRating-v.overallRating}),d=new Set(o.slice(0,5).map(v=>v.riderId));function l(v){switch(v){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return v}}const p=new Map;for(const v of e.entries){const S=v.teamId;p.has(S)||p.set(S,{teamId:v.teamId,teamName:v.teamName,riders:[],avgRating:0}),p.get(S).riders.push(v)}for(const v of p.values())v.avgRating=v.riders.reduce((S,T)=>S+T.overallRating,0)/v.riders.length;const u=v=>{let S=Number.POSITIVE_INFINITY;for(const T of v)!T.hasDropped&&T.gcRank!=null&&T.gcRank<S&&(S=T.gcRank);return S},m=v=>{var T;if(!((T=c.seasonStandings)!=null&&T.riderStandings))return 0;let S=0;for(const M of v){const x=c.seasonStandings.riderStandings.find($=>$.riderId===M.riderId);x&&x.points>S&&(S=x.points)}return S},f=v=>{if(v==null)return 0;const S=c.riders.filter(x=>x.activeTeamId===v);if(S.length===0)return 0;const T=S.map(x=>x.overallRating??0);T.sort((x,$)=>$-x);const M=T.slice(0,10);return M.length===0?0:M.reduce((x,$)=>x+$,0)/M.length},g=[...p.values()].sort((v,S)=>{const T=u(v.riders),M=u(S.riders);if((T!==Number.POSITIVE_INFINITY||M!==Number.POSITIVE_INFINITY)&&T!==M)return T-M;const x=m(v.riders),$=m(S.riders);if((x>0||$>0)&&x!==$)return $-x;const I=f(v.teamId),R=f(S.teamId);return Math.abs(I-R)>1e-4?R-I:(v.teamName??"").localeCompare(S.teamName??"","de")});for(const v of g)v.riders.sort((S,T)=>Kn(S.roleId)-Kn(T.roleId)||T.overallRating-S.overallRating||S.lastName.localeCompare(T.lastName,"de"));return`<div class="results-roster-grid">${g.map(v=>{const S=v.teamId!=null?Ct(v.teamId,v.teamName):"",T=v.riders.map(x=>{var j;const $=xp(x.roleId),I=x.countryCode?Ye[x.countryCode]??x.countryCode.slice(0,2).toLowerCase():null,R=I?`<span class="fi fi-${I} results-roster-flag" title="${k(x.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',P=`${x.firstName.charAt(0)}. ${x.lastName}`,F=x.roleName??"–",D=x.specialization1?l(x.specialization1):null,B=x.specialization2?l(x.specialization2):null;let H=F;D&&(H+=` · ${D}`),B&&(H+=` · ${B}`);const K=`<span class="results-roster-overall-badge" style="color:${wp(x.overallRating)}" title="Gesamtstärke: ${x.overallRating.toFixed(2)}">${x.overallRating.toFixed(2)}</span>`,w=x.hasDropped?" dropped":"";let A="";x.hasDropped?x.dropoutStatus==="dns"?A="DNS":x.dropoutStatus==="dnf"?A=((j=x.dropoutReason)==null?void 0:j.startsWith("OTL"))??!1?"OTL":"DNF":A="OUT":x.gcRank!=null&&(A=`${x.gcRank}`);let U="";if(x.hasDropped)U=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${k(x.dropoutReason||"")}">${A}</span>`;else if(x.gcRank!=null){let L="rider-stats-rank-badge-gc";x.gcRank===1?L="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":x.gcRank===2?L="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":x.gcRank===3&&(L="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),U=`<span class="rider-stats-rank-badge ${L}" title="GC Stand: Platz ${x.gcRank}">${x.gcRank}</span>`}const te=`style="color: ${x.hasDropped?"var(--text-500)":$.color}; font-weight: bold;"`,J=s.has(x.riderId),Q=d.has(x.riderId);return`<div class="results-roster-rider${w}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${R}
            <span class="results-roster-name${J?" strongest-rider":Q?" best-sprinter":""}">
              ${Le(P,{riderId:x.riderId,teamId:x.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${Ba(x.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${te}>${k(H)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${U||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${K}
        </div>
      </div>`}).join(""),M=v.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${S}</div>
        <div class="results-roster-team-name" title="${k(v.teamName??"–")}">${nt(v.teamName??"–",v.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${M})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${T}</div>
    </div>`}).join("")}</div>`}function wp(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function Mp(e){var l,p;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=c.stageResults)==null?void 0:l.classifications.find(u=>u.resultTypeId===1),a=new Set(t?t.rows.map(u=>u.riderId).filter(u=>u!=null):[]),r=c.riders.filter(u=>u.activeTeamId===e.teamId&&a.has(u.id)),s=new Set((((p=c.stageResults)==null?void 0:p.nonFinishers)??[]).map(u=>u.riderId)),n=[];for(const u of r){if(u.id===e.riderId||s.has(u.id))continue;let m=0;const f=u.skills.sprint>=72,g=u.skills.flat>=78,y=u.skills.timeTrial>=76,v=u.skills.acceleration>=80;if(f&&m++,g&&m++,y&&m++,v&&m++,m>0){let S=1;m===2?S=1.25:m===3?S=1.5:m===4&&(S=2),n.push({id:u.id,firstName:u.firstName,lastName:u.lastName,countryCode:u.nationality??null,isSprinter:f,multiplier:S,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const u=n.filter(v=>v.isSprinter).reduce((v,S)=>v+S.multiplier,0),m=n.filter(v=>!v.isSprinter).reduce((v,S)=>v+S.multiplier,0);let f=0,g=0;u>0&&m>0?(f=i/(2.125*u+m),g=2.125*f,f=Math.max(.1,Math.min(.3,f)),g=Math.max(.25,Math.min(.6,g))):u>0?(g=i/u,g=Math.max(.25,Math.min(.6,g)),f=g/2.125):m>0&&(f=i/m,f=Math.max(.1,Math.min(.3,f)),g=2.125*f);for(const v of n)v.contribution=v.isSprinter?g*v.multiplier:f*v.multiplier;const y=n.reduce((v,S)=>v+S.contribution,0);if(y>0){const v=i/y;for(const S of n)S.contribution*=v}n.sort((v,S)=>S.contribution-v.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),d=n.map(u=>{const m=it(Ht(u.id)??u.countryCode),f=u.firstName?`${u.firstName.charAt(0)}. ${u.lastName}`:u.lastName,g=u.contribution.toFixed(2).replace(".",",");return`
      <div class="leadout-bonus-popover-grid">
        <span class="results-flag-col-cell">${m}</span>
        <span class="leadout-bonus-rider-name">${k(f)}</span>
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
  `}function Wn(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function Ba(e){var u,m,f,g,y,v,S,T,M,x;if(e==null||!c.stageResults)return"";const t=yt(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=c.stageResults.classifications,s=(m=(u=r.find($=>$.resultTypeId===_a))==null?void 0:u.rows.find($=>$.rank===1))==null?void 0:m.riderId,n=(g=(f=r.find($=>$.resultTypeId===Lr))==null?void 0:f.rows.find($=>$.rank===1))==null?void 0:g.riderId,i=(v=(y=r.find($=>$.resultTypeId===ci))==null?void 0:y.rows.find($=>$.rank===1))==null?void 0:v.riderId,o=(T=(S=r.find($=>$.resultTypeId===5))==null?void 0:S.rows.find($=>$.rank===1))==null?void 0:T.riderId,d=(x=(M=r.find($=>$.resultTypeId===7))==null?void 0:M.rows.find($=>$.rank===1))==null?void 0:x.riderId,l=[],p=c.selectedResultTypeId;return e===s&&(p===_a||p===1&&a||p!==1&&p!==_a)&&l.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&l.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&l.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&l.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===d&&l.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>'),l.length===0?"":`<span class="jersey-dots-wrapper">${l.join("")}</span>`}function jn(e){if(!e)return"";let t=e;const a=[],r=[...c.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of r){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),d=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");d.test(t)&&(t=t.replace(d,l=>{const p=`__RIDER_LINK_${a.length}__`,u=Le(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(u),p}))}let s=k(t);for(let n=0;n<a.length;n++)s=s.replace(`__RIDER_LINK_${n}__`,a[n]);return s}function Me(){var _,E,O,G;c.riders.length===0&&V.getRiders().then(h=>{h.success&&h.data&&(c.riders=h.data,Me())});const e=b("results-race-select"),t=b("results-stage-select"),a=b("results-type-tabs"),r=b("results-marker-tabs"),s=b("results-stage-meta"),n=b("results-empty"),i=b("results-table"),o=i.querySelector("thead tr"),d=b("results-tbody"),l=b("results-marker-classifications"),p=b("results-roster"),u=i.querySelector("colgroup");u&&u.remove(),i.style.tableLayout="",c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+c.races.filter(h=>{var C;return(((C=h.stages)==null?void 0:C.length)??0)>0}).map(h=>`<option value="${h.id}"${h.id===c.selectedResultsRaceId?" selected":""}>${k(h.name)}</option>`).join("");const m=yt(c.selectedResultsRaceId),f=m==null?"":(m.stages??[]).map(h=>`<option value="${h.id}"${h.id===c.selectedResultsStageId?" selected":""}>${k($p(m,h))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+f;const g=((_=c.stageResults)==null?void 0:_.classifications.filter(h=>!(m&&!m.isStageRace&&h.resultTypeId!==1&&h.resultTypeId!==6)))??[],y=g.find(h=>h.resultTypeId===c.selectedResultTypeId)??g[0]??null,v=c.selectedResultsSpecialView==="nonFinishers",S=c.selectedResultsSpecialView==="events",T=c.selectedResultsSpecialView==="roster";if(y&&!v&&!S&&!T&&(c.selectedResultTypeId=y.resultTypeId),S){i.style.tableLayout="fixed";const h=document.createElement("colgroup");h.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(h,i.firstChild)}if(!c.stageResults&&!T||!y&&!v&&!S&&!T){const h=ja(c.selectedResultsStageId);s.textContent=h?`${h.race.name} · ${h.stage.profile} · ${ne(h.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",r.innerHTML="",r.classList.add("hidden"),d.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),p.innerHTML="",p.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=c.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}T?c.resultsRoster&&(s.textContent=`${c.resultsRoster.raceName} · Starterfeld`):c.stageResults&&(s.textContent=`${c.stageResults.raceName} · Etappe ${c.stageResults.stageNumber} · ${c.stageResults.profile} · ${ne(c.stageResults.date)}`);const M=c.stageResults?ja(c.stageResults.stageId):null,x=(M==null?void 0:M.stage.distanceKm)??null,$=new Map,I=new Map,R=new Map;if(c.stageResults){const h=c.stageResults.classifications.find(C=>C.resultTypeId===1);if(h)for(const C of h.rows)C.riderId!=null&&C.points!=null&&C.points>0&&$.set(C.riderId,C.points),C.riderId!=null&&C.breakawayKms!=null&&C.breakawayKms>0&&R.set(C.riderId,C.breakawayKms);if(c.stageResults.markerClassifications){for(const C of c.stageResults.markerClassifications)if(hs(C.markerType,C.markerCategory)){for(const N of C.entries)if(N.riderId!=null&&N.pointsAwarded!=null&&N.pointsAwarded>0){const z=I.get(N.riderId)??0;I.set(N.riderId,z+N.pointsAwarded)}}}}const P=(y==null?void 0:y.resultTypeId)===_a,F=(y==null?void 0:y.resultTypeId)===Lr||(y==null?void 0:y.resultTypeId)===ci,D=(y==null?void 0:y.resultTypeId)===5,B=(y==null?void 0:y.resultTypeId)===6,H=(y==null?void 0:y.resultTypeId)===7,K=P||F||D||B||H,w=g.map(h=>`
    <button
      type="button"
      class="results-type-btn${!v&&!S&&!T&&h.resultTypeId===c.selectedResultTypeId?" active":""}"
      data-result-type-id="${h.resultTypeId}"
    >${k(h.resultTypeName)}</button>
  `),A=`
    <button
      type="button"
      class="results-type-btn${v?" active":""}"
      data-results-special-view="${yo}"
    >OTL/DNF</button>
  `,U=`
    <button
      type="button"
      class="results-type-btn${S?" active":""}"
      data-results-special-view="${vo}"
    >Ereignisse</button>
  `,W=`
    <button
      type="button"
      class="results-type-btn${T?" active":""}"
      data-results-special-view="${So}"
    >Teilnehmer</button>
  `,te=g.findIndex(h=>h.resultTypeName.toLocaleLowerCase("de").includes("team"));te>=0?w.splice(te+1,0,A,U,W):w.push(A,U,W),a.innerHTML=w.join("");const J=vp(((E=c.stageResults)==null?void 0:E.markerClassifications)??[]);if(T){p.innerHTML=Tp(),p.classList.remove("hidden"),i.classList.add("hidden"),r.innerHTML="",r.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else p.innerHTML="",p.classList.add("hidden");const Q=!v&&!S&&!T&&(y==null?void 0:y.resultTypeId)===1&&J.length>0,Y=Q?c.selectedResultsMarkerKey??Ue:null,j=Q&&Y!==Ue?J.find(h=>h.markerKey===Y)??null:null;if(Q&&(c.selectedResultsMarkerKey=(j==null?void 0:j.markerKey)??Ue),S){const h=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"},{key:"superteam",label:"Superteam"}];r.innerHTML=h.map(C=>`
      <button
        type="button"
        class="results-type-btn${C.key===Pe?" active":""}"
        data-event-filter="${C.key}"
      >${k(C.label)}</button>
    `).join("")}else r.innerHTML=Q?[`
        <button
          type="button"
          class="results-type-btn${c.selectedResultsMarkerKey===Ue?" active":""}"
          data-marker-key="${Ue}"
        >Tageswertung</button>`,...J.map(h=>`
        <button
          type="button"
          class="results-type-btn${h.markerKey===c.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${h.markerKey}"
        >${k(Sp(h))}</button>
      `)].join(""):"";r.classList.toggle("hidden",!S&&!Q);const L=v||S||!Q||c.selectedResultsMarkerKey===Ue;if(o&&L&&(o.innerHTML=v?`
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
      `:P?`
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
        `:H?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Kilometer</th>
          <th>UCI Punkte</th>
        `:B?`
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
      `),d.innerHTML=v?(((O=c.stageResults)==null?void 0:O.nonFinishers)??[]).map(h=>`
      <tr>
        <td>${h.stageNumber}</td>
        <td>${cl(h.isOtl)}</td>
        <td class="results-jersey-col-cell">${qt(h.teamId,h.teamName)}</td>
        <td>${Xt(h.riderName,!0,!1,h.riderId,h.teamId)}</td>
        <td class="results-flag-col-cell">${it(h.countryCode)}</td>
        <td>${nt(h.teamName||"–",h.teamId)}</td>
        <td>${k(Dr(h.statusReason,h.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':S?[...((G=c.stageResults)==null?void 0:G.events)??[]].filter(h=>Pe==="all"?!0:Pe==="form"?!!(h.title&&(h.title.includes("guten Tag")||h.title.includes("schlechten Tag")||h.title.includes("Formhöhepunkt")||h.title.includes("Formhoehepunkt"))):Pe==="attack"?(h.type==="attack"||h.type==="counter_attack")&&!(h.title&&(h.title.toLowerCase().includes("ausreiß")||h.title.toLowerCase().includes("ausreiss"))):Pe==="breakaway"?!!(h.title&&(h.title.toLowerCase().includes("ausreiß")||h.title.toLowerCase().includes("ausreiss"))):Pe==="incident"?(h.type==="incident"||!!(h.title&&h.title.includes("Massensturz")))&&!(h.title&&(h.title.toLowerCase().includes("ausreiß")||h.title.toLowerCase().includes("ausreiss"))):Pe==="exit"?h.type==="dnf"||!!(h.title&&h.title.includes("nicht am Start")):Pe==="home"?!!(h.title&&(h.title.includes("Heimvorteil")||h.title.includes("Heimdruck"))):Pe==="weather"?!!(h.title&&h.title.startsWith("Wetterbericht:")):Pe==="superteam"?h.type==="superteam":!0).sort((h,C)=>{const N=h.kmMark??0,z=C.kmMark??0;if(Math.abs(N-z)>1e-4)return N-z;if(N===0){const me=Wn(h),pe=Wn(C);if(me!==pe)return me-pe}const ae=h.riderName??"",le=C.riderName??"";return ae.localeCompare(le,"de")}).map(h=>{var Ds,_s,As;const C=h.kmMark!=null?`${h.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",N=h.riderId,z=N!=null?we(N):null,ae=h.riderTeamId??(z==null?void 0:z.activeTeamId)??null,le=ae!=null?((Ds=c.teams.find(va=>va.id===ae))==null?void 0:Ds.name)??null:null;let me=qt(ae,le);const pe=!!(h.title&&h.title.startsWith("Wetterbericht:"));let ge=h.title||"";if(pe){const va=(_s=c.stageResults)==null?void 0:_s.rolledWeatherId,br=(As=c.stageResults)==null?void 0:As.rolledWetterName;me=`<span class="results-jersey-cell">${ms(va,br)}</span>`,br&&(ge=`Wetterbericht: ${br}`)}const Fe=h.type==="superteam",de=Fe&&N==null,kt=pe||de?"":it(N!=null?Ht(N):null),tt=pe?"":de?nt(le||"–",ae):N!=null?Xt(h.riderName??"",!0,!1,N,ae):k(h.riderName||"–");let ye="";return h.title&&h.title.includes("guten Tag")?ye='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':h.title&&h.title.includes("schlechten Tag")?ye='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':h.title&&(h.title.includes("Formhöhepunkt")||h.title.includes("Formhoehepunkt"))?ye='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':h.title&&h.title.includes("nicht am Start")?ye='<span class="event-badge event-badge-dns">DNS</span>':h.title&&h.title.includes("Massensturz")?ye='<span class="event-badge event-badge-masscrash">Massensturz</span>':h.type==="dnf"?ye='<span class="event-badge event-badge-dnf">DNF</span>':h.title&&(h.title.toLowerCase().includes("ausreiß")||h.title.toLowerCase().includes("ausreiss"))?ye='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':h.type==="attack"?ye='<span class="event-badge event-badge-attack">Attacke</span>':h.type==="counter_attack"?ye='<span class="event-badge event-badge-counter">Konterattacke</span>':h.type==="incident"?h.title&&(h.title.toLowerCase().includes("defekt")||h.title.toLowerCase().includes("panne")||h.title.toLowerCase().includes("technisch"))?ye='<span class="event-badge event-badge-defect">Defekt</span>':ye='<span class="event-badge event-badge-crash">Sturz</span>':h.title&&h.title.includes("Super-Heimvorteil")?ye='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>':h.title&&h.title.includes("Heimdruck")?ye='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>':h.title&&h.title.includes("Heimvorteil")?ye='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':h.title&&h.title.startsWith("Wetterbericht:")?ye='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>':Fe&&(ye='<span class="event-badge event-badge-superteam"><span class="event-icon">⚡</span> Superteam</span>'),`
          <tr>
            <td>${C}</td>
            <td>
              <div class="event-rider-info">
                ${me}
                ${kt}
                ${tt}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${jn(ge)}</span>
                  ${ye}
                </div>
                ${h.detail?`<div class="event-detail">${jn(h.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':L&&y?y.rows.map(h=>{const C=h.riderName??h.teamName,N=h.riderName?h.teamName:"–",z=qt(h.teamId,h.teamName),ae=Xt(C,!0,h.isBreakaway===!0,h.riderId,h.teamId),le=it(Ht(h.riderId)),me=y.resultTypeId===1&&h.rank===1&&h.timeSeconds!=null&&x!=null,pe=h.timeSeconds!=null?`${Wa(h.timeSeconds)}${me?` (${kp(x,h.timeSeconds)})`:""}`:"–",ge=K?`<td class="results-gc-delta-cell">${ul(h.previousRank,h.rankDelta)}</td>`:"";if(F){let de=h.points!=null?String(h.points):"–";if(h.points!=null&&h.riderId!=null&&y){const tt=y.resultTypeId===Lr?$.get(h.riderId)??0:I.get(h.riderId)??0;tt>0&&(de+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${tt}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(h.rank,3)}">${h.rank}</td>
            ${ge}
            <td class="results-jersey-col-cell">${z}</td>
            <td>${ae}${Ba(h.riderId)}</td>
            <td class="results-flag-col-cell">${le}</td>
            <td>${nt(N,h.teamId)}</td>
            <td class="results-points-cell">${de}</td>
            <td>${h.uciPoints!=null?h.uciPoints:"–"}</td>
          </tr>`}if(H){let de=h.breakawayKms!=null?`${h.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if(h.breakawayKms!=null&&h.riderId!=null){const kt=R.get(h.riderId)??0;kt>0&&(de+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${kt.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min(h.rank,3)}">${h.rank}</td>
            ${ge}
            <td class="results-jersey-col-cell">${z}</td>
            <td>${ae}${Ba(h.riderId)}</td>
            <td class="results-flag-col-cell">${le}</td>
            <td>${nt(N,h.teamId)}</td>
            <td class="results-points-cell">${de}</td>
            <td>${h.uciPoints!=null?h.uciPoints:"–"}</td>
          </tr>`}if(B)return`
          <tr>
            <td class="pos-${Math.min(h.rank,3)}">${h.rank}</td>
            ${ge}
            <td class="results-jersey-col-cell">${z}</td>
            <td>${nt(h.teamName,h.teamId)}</td>
            <td class="results-flag-col-cell">${le}</td>
            <td>${pe}</td>
            <td>${k(yr(h.gapSeconds))}</td>
            <td>${h.uciPoints!=null?h.uciPoints:"–"}</td>
          </tr>`;let Fe=h.points!=null?String(h.points):"–";if(h.leadoutBonus!=null&&h.leadoutBonus>0&&h.leadoutRiderId!=null){const de=Mp(h);Fe=`
          <div class="leadout-bonus-anchor">
            ${h.points!=null?h.points:"–"}
            ${de}
          </div>
        `}return`
        <tr>
          <td class="pos-${Math.min(h.rank,3)}">${h.rank}</td>
          ${ge}
          <td class="results-jersey-col-cell">${z}</td>
          <td>${ae}${Ba(h.riderId)}</td>
          <td class="results-flag-col-cell">${le}</td>
          <td>${nt(N,h.teamId)}</td>
          <td>${pe}</td>
          <td>${k(yr(h.gapSeconds))}</td>
          <td class="results-points-cell">${Fe}</td>
          <td>${h.uciPoints!=null?h.uciPoints:"–"}</td>
        </tr>`}).join(""):"",n.classList.toggle("hidden",!!y||v||S||T),i.classList.toggle("hidden",!L||T),j){const h=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${k(ml(j.markerType,j.markerLabel))}</h4>
          <div class="results-marker-card-meta">${k(`${j.kmMark.toFixed(1).replace(".",",")} km${j.markerCategory?` · Kat. ${j.markerCategory}`:""}`)}</div>
        </div>
      </section>`,C=j.entries.map(N=>{var me;const z=we(N.riderId),ae=z?`${z.firstName} ${z.lastName}`:`Fahrer ${N.riderId}`,le=(z==null?void 0:z.activeTeamId)!=null?((me=c.teams.find(pe=>pe.id===z.activeTeamId))==null?void 0:me.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${N.rank}.</div>
          <div class="results-marker-jersey">${qt(z==null?void 0:z.activeTeamId,le)}</div>
          <div class="results-marker-name">${Xt(ae,!1,!1,(z==null?void 0:z.id)??null,(z==null?void 0:z.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${it(Ht(z==null?void 0:z.id))}</div>
          <div class="results-marker-time">${k(Wa(N.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${k(yr(N.gapSeconds))}</div>
          <div class="results-marker-points">${N.pointsAwarded!=null&&N.pointsAwarded>0?N.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${h}<div class="results-marker-list">${C}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!j)}function Rp(){b("results-race-select").addEventListener("change",e=>{var r,s;const t=e.target.value;c.selectedResultsRaceId=t?Number(t):null;const a=yt(c.selectedResultsRaceId);c.selectedResultsStageId=((s=(r=a==null?void 0:a.stages)==null?void 0:r[0])==null?void 0:s.id)??null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=Ue,c.selectedResultsSpecialView=null,c.stageResults=null,Me(),c.selectedResultsStageId!=null&&Wr(c.selectedResultsStageId,!0)}),b("results-stage-select").addEventListener("change",e=>{const t=e.target.value;c.selectedResultsStageId=t?Number(t):null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=Ue,c.selectedResultsSpecialView=null,c.stageResults=null,Me(),c.selectedResultsStageId!=null&&Wr(c.selectedResultsStageId,!0)}),b("results-type-tabs").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-result-type-id]");if(t){c.selectedResultsSpecialView=null,c.selectedResultTypeId=Number(t.dataset.resultTypeId),Me();return}const a=e.target.closest("button[data-results-special-view]");if(a){const s=a.dataset.resultsSpecialView;s===yo?(c.selectedResultsSpecialView="nonFinishers",Me()):s===vo?(c.selectedResultsSpecialView="events",Pe="all",Me()):s===So&&(c.selectedResultsSpecialView="roster",c.selectedResultsRaceId!=null&&((r=c.resultsRoster)==null?void 0:r.raceId)!==c.selectedResultsRaceId&&ko(c.selectedResultsRaceId).then(()=>Me()),Me())}}),b("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const r=t.dataset.markerKey;c.selectedResultsMarkerKey=r??Ue,Me();return}const a=e.target.closest("button[data-event-filter]");a&&(Pe=a.dataset.eventFilter??"all",Me())})}const bs=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],ha=["skills","form","profile","preferences"],ys=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],vs={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...bs.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function Ss(){return[...ys,...vs[c.teamDetailPage]]}function $o(e,t=12){const a=c.riders.filter(s=>s.activeTeamId===e).sort((s,n)=>n.overallRating-s.overallRating).slice(0,t);return a.length===0?null:a.reduce((s,n)=>s+n.overallRating,0)/a.length}function xo(e){const t=c.riders.filter(r=>r.activeTeamId===e);return t.length===0?null:t.reduce((r,s)=>r+s.overallRating,0)/t.length}function To(e){const t=$o(e);return t==null?"–":t.toFixed(1).replace(".",",")}function wo(e){const t=xo(e);return t==null?"–":t.toFixed(1).replace(".",",")}function se(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function Re(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:se(e,t)}function ve(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function Ie(e){return e==null?void 0:typeof e=="string"?aa(e):e.name}function ks(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...bs.map(t=>t.key)].includes(e)?"desc":"asc"}function Mo(e){return c.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function Ro(e){if(!e.sortKey)return`<th class="${k(e.className??"")}" title="${k(e.title)}">${k(e.label)}</th>`;const t=c.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${k(e.className??"")}" title="${k(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${k(e.label)}</span>
        ${Mo(e.sortKey)}
      </button>
    </th>`}function Io(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${ha.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const Co={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function $s(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":Co[e]??String(e)}function Eo(e){const t=[...e],a=c.teamTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(c.teamTableSort.key){case"name":n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName);break;case"countryCode":n=se(Et(r),Et(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=se(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=se(bt(r),bt(s));break;case"riderType":n=se(r.riderType,s.riderType)||se(De(r),De(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Re(Ie(r.specialization1),Ie(s.specialization1));break;case"specialization2":n=Re(Ie(r.specialization2),Ie(s.specialization2));break;case"specialization3":n=Re(Ie(r.specialization3),Ie(s.specialization3));break;case"peak1":n=Re(ve(r,0),ve(s,0));break;case"peak2":n=Re(ve(r,1),ve(s,1));break;case"peak3":n=Re(ve(r,2),ve(s,2));break;default:n=r.skills[c.teamTableSort.key]-s.skills[c.teamTableSort.key];break}return n===0&&(n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName)),n*a}),t}function Fo(e){const t=[...e],a=c.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(c.riderMenuTableSort.key){case"name":n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName);break;case"countryCode":n=se(Et(r),Et(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=se(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=se(bt(r),bt(s));break;case"riderType":n=se(r.riderType,s.riderType)||se(De(r),De(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Re(Ie(r.specialization1),Ie(s.specialization1));break;case"specialization2":n=Re(Ie(r.specialization2),Ie(s.specialization2));break;case"specialization3":n=Re(Ie(r.specialization3),Ie(s.specialization3));break;case"peak1":n=Re(ve(r,0),ve(s,0));break;case"peak2":n=Re(ve(r,1),ve(s,1));break;case"peak3":n=Re(ve(r,2),ve(s,2));break;default:n=r.skills[c.riderMenuTableSort.key]-s.skills[c.riderMenuTableSort.key];break}return n===0&&(n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName)),n*a}),t}function jr(e){return e.length===0?"–":e.map(t=>{const a=c.races.find(r=>r.id===t);return a?k(a.name):`Rennen ${t}`}).join(", ")}function Ip(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function xs(e,t){var a,r;switch(t.id){case"name":return`<td class="team-table-name-cell">${Le(De(e),{riderId:e.id,teamId:e.activeTeamId,strong:c.teamDetailPage==="form"||c.teamDetailPage==="profile"||c.teamDetailPage==="preferences"})}${vl(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${oe(Et(e))}<span>${k(Et(e))}</span></span></td>`;case"age":return`<td>${e.age??(c.gameState?c.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${k(bt(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${Ws(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${bl(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${Ws((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${js(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${js(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${hi(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${k(ve(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${k(ve(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${k(ve(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${k(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?k(aa(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?k(aa(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?k(aa(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${yl(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${oe(e.mentorCountryCode??"UNK")} <span>${k(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${jr(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${jr(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const s=t.sortKey;return s&&s in e.skills?`<td>${hl(e.skills[s],(a=e.yearStartSkills)==null?void 0:a[s],(r=e.potentials)==null?void 0:r[s])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function ar(){Te("Teams/Fahrer werden aktualisiert...");try{const e=await V.getRiders();if(e.success&&(c.riders=e.data??[]),await V.getTeams().then(t=>{t.success&&(c.teams=t.data??[])}),xe("teams")&&Ts(),xe("riders")){const{renderRidersMenu:t}=await yi(async()=>{const{renderRidersMenu:a}=await Promise.resolve().then(()=>Xp);return{renderRidersMenu:a}},void 0);t()}}finally{Se()}}async function Cp(e={}){const t=await V.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),b("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${k(t.error??"Unbekannt")}</p>`;return}c.teams=t.data??[],e.render!==!1&&xe("teams")&&Ts()}function Ts(){const e=b("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+c.teams.map(r=>`<option value="${r.id}"${String(r.id)===t?" selected":""}>${k(r.name)} (${k(r.division??r.divisionName??"")}) · ${k(r.abbreviation)}</option>`).join("");const a=t?Number(t):null;ia(a)}function ia(e){const t=b("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=c.teams.find(i=>i.id===e);if(!a){t.innerHTML="";return}const r=Eo(c.riders.filter(i=>i.activeTeamId===e)),s=a.division==="U23"?"badge-u23":"badge-classics",n=Ss();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${k(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${s}">${k(a.division??a.divisionName??"")}</span>
          <span>${pl(a.country,a.countryCode)}</span>
          <span>Kürzel: ${k(a.abbreviation)} · Top 12 ${k(To(a.id))} (${k(wo(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${k($s(c.teamTableSort.key))} ${c.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Io()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${n.map(Ro).join("")}
          </tr></thead>
          <tbody>
            ${r.length===0?`<tr><td colspan="${n.length}" class="text-muted">Keine Fahrer.</td></tr>`:r.map(i=>`
                <tr class="team-detail-row">
                  ${n.map(o=>xs(i,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function Po(){b("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;c.teamDetailPage="skills",ia(t?Number(t):null)}),b("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&Is(s);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const s=a.dataset.teamDetailPage;if(ha.includes(s)){c.teamDetailPage=s,new Set(Ss().map(o=>o.sortKey).filter(o=>o!=null)).has(c.teamTableSort.key)||(c.teamTableSort={key:"name",direction:"asc"});const i=Number(b("teams-dropdown").value);ia(Number.isFinite(i)?i:null)}return}const r=e.target.closest("button[data-team-sort]");if(r){const s=r.dataset.teamSort;c.teamTableSort.key===s?c.teamTableSort.direction=c.teamTableSort.direction==="asc"?"desc":"asc":c.teamTableSort={key:s,direction:ks(s)};const n=Number(b("teams-dropdown").value);ia(Number.isFinite(n)?n:null);return}})}const Ep=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:vs,TEAM_DETAIL_PAGE_ORDER:ha,TEAM_SKILL_COLUMNS:bs,TEAM_SKILL_TITLES:Co,TEAM_TABLE_COLUMNS:ys,compareOptionalStrings:Re,compareStrings:se,formatTeamAverage:wo,formatTeamTopAverage:To,getActiveTeamTableColumns:Ss,getDefaultTeamSortDirection:ks,getPeakDate:ve,getSortIndicator:Mo,getSpecializationSortLabel:Ie,getTeamAverage:xo,getTeamSortLabel:$s,getTeamTopAverage:$o,initTeamsListeners:Po,loadTeams:Cp,refreshTeamsViewData:ar,renderPeakDatesSummary:Ip,renderRacePrefs:jr,renderTeamDetail:ia,renderTeamDetailPageTabs:Io,renderTeamTableCell:xs,renderTeamTableHeader:Ro,renderTeams:Ts,sortRiderMenuRiders:Fo,sortTeamRiders:Eo},Symbol.toStringTag,{value:"Module"}));function Fp(e,t,a){return`${e} · Etappe ${t} · ${a}`}function No(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function Lo(e,t){const a=[];for(const r of e.riders)if(r.leadoutBonus!=null&&r.leadoutBonus>0&&r.leadoutContributions&&r.leadoutContributions.length>0){const s=t.riders.find(i=>i.id===r.riderId),n=(s==null?void 0:s.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:r.riderId,leadoutBonus:r.leadoutBonus,contributorsJson:JSON.stringify(r.leadoutContributions)})}return a}async function Do(e,t=!1){if(li!=null||qr)return!1;Hs(e),fl(0);try{const a=await V.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const r=a.data;c.realtimeBootstrap=r;const s=await vc(r,o=>pi(o)),n=No(s,r),i=Lo(s,r);return await zo(e,n,s.markerClassifications,s.incidents,s.allEvents,t,i,s.superTeamId),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{Hs(null),Se()}}function _o(e){var r;const t=(r=c.rosterEditor)==null?void 0:r.teams.find(s=>s.team.id===e);if(!t)return 0;const a=new Set(c.rosterEditorSelectedRiderIds);return t.riders.filter(s=>a.has(s.rider.id)).length}function Ao(){return c.rosterEditor?c.rosterEditor.teams.every(e=>_o(e.team.id)===e.riderLimit):!1}function Cr(){const e=b("roster-editor-title"),t=b("roster-editor-meta"),a=b("roster-editor-body"),r=b("btn-apply-roster-editor"),s=c.rosterEditor;if(!s){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',r.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=s.race.isStageRace?`${s.race.name} · Etappe ${s.stage.stageNumber} · ${s.stage.profile}`:`${s.race.name} · ${s.stage.profile}`;const n=new Set(c.rosterEditorSelectedRiderIds);a.innerHTML=s.teams.map(i=>{const o=_o(i.team.id),d=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${k(i.team.name)}</h3>
            <p class="text-muted">${k(i.team.abbreviation)} · ${k(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${d}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var y;const u=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),m=l.rider.country?oe(l.rider.country.code3):"",f=[((y=l.rider.role)==null?void 0:y.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),g=l.lockReason?`<span class="roster-editor-rider-lock">${k(l.lockReason)}</span>`:"";return`
              <button
                type="button"
                class="${u}"
                data-roster-team-id="${i.team.id}"
                data-roster-rider-id="${l.rider.id}"
                ${l.isLocked?"disabled":""}
              >
                <span class="roster-editor-rider-name">${m}<span>${k(l.rider.firstName)} ${k(l.rider.lastName)}</span></span>
                <span class="roster-editor-rider-meta">${k(f)}</span>
                ${g}
              </button>`}).join("")}
        </div>
      </section>`}).join(""),r.disabled=!Ao()}function Or(){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],da("roster-editor-error"),Ve("rosterEditor")}function Bo(e,t){c.selectedRealtimeStageId=e.stage.id,c.realtimeBootstrap=e,c.realtimeError=null,t&&Nt("live-race"),Ho().load(e,{autoplay:!0,resetSpeed:!0}),Wt()}function Ho(){let e=ta;if(!e){const t=b("race-sim-layout"),a=b("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new yp({layout:t,emptyState:a,controlsHeader:b("race-sim-controls-header"),profile:b("race-sim-profile"),groupBox:b("race-sim-group-box"),messages:b("race-sim-messages-body"),favorites:b("race-sim-favorites-body"),sidebar:b("race-sim-sidebar-body"),controls:b("race-sim-controls"),meta:b("race-sim-stage-meta")},{onFinishRequested:(r,s)=>{const n=No(r,s),i=Lo(r,s);zo(s.stage.id,n,r.markerClassifications,r.incidents,r.allEvents,!1,i,r.superTeamId)}}),dl(e)}return e}async function Pp(e){Te("Starterfeld wird geladen..."),da("roster-editor-error");try{const t=await V.getRosterEditor(e);if(!t.success||!t.data){Mt("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),Je("rosterEditor"),Cr();return}c.rosterEditor=t.data,c.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(r=>r.isSelected).map(r=>r.rider.id)),Cr(),Je("rosterEditor")}catch(t){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],Mt("roster-editor-error",t.message),Je("rosterEditor"),Cr()}finally{Se()}}async function Np(){const e=c.rosterEditor;if(e){if(!Ao()){Mt("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}da("roster-editor-error"),Te("Starterfeld wird übernommen...");try{const t=await V.applyRosterEditor(e.stage.id,{riderIds:c.rosterEditorSelectedRiderIds});if(!t.success||!t.data){Mt("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}Or(),Bo(t.data,!0)}catch(t){Mt("roster-editor-error",t.message)}finally{Se()}}}function Wt(){var n,i;const e=b("race-sim-stage-select"),t=((n=c.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===c.selectedRealtimeStageId)||(c.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===c.selectedRealtimeStageId?" selected":""}>${k(Fp(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const r=t.find(o=>o.stageId===c.selectedRealtimeStageId)??null,s=Ho();if(!r){c.realtimeBootstrap=null,c.realtimeError=null,s.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!c.realtimeBootstrap||c.realtimeBootstrap.stage.id!==r.stageId)&&(c.realtimeError?s.clear(c.realtimeError):s.hide())}async function Go(e,t){if(Nr!==e){Gs(e),c.selectedRealtimeStageId=e,t&&Nt("live-race"),Wt(),Te("Live-Simulation wird geladen...");try{const a=await V.getRealtimeSimulation(e);if(!a.success||!a.data){c.realtimeBootstrap=null,c.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",Wt(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}Bo(a.data,!1)}catch(a){c.realtimeBootstrap=null,c.realtimeError=a.message,Wt(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{Nr===e&&Gs(null),Se()}}}async function zo(e,t,a,r,s,n=!1,i,o){if(!qr){Bs(!0),Te("Live-Ergebnis wird gespeichert...");try{const d=await V.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:r,events:s,leadoutContributions:i,superTeamId:o});if(!d.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(d.error??"Unbekannter Fehler"));return}const l=d.data;c.selectedResultsRaceId=(l==null?void 0:l.raceId)??c.selectedResultsRaceId,c.selectedResultsStageId=(l==null?void 0:l.stageId)??e,c.selectedResultTypeId=1,c.realtimeBootstrap=null,c.realtimeError=null,await Wr(e,!1),await Ms(),await Rs(),await ar(),Wt(),n||Nt("results")}catch(d){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+d.message)}finally{Bs(!1),Se()}}}function Lp(){b("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);c.selectedRealtimeStageId=Number.isFinite(t)?t:null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null),c.realtimeError=null,Go(t,!1)})}function ws(e){var r;const t=dt((r=e.category)==null?void 0:r.name),a=ir(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function ur(e){var s,n;const t=dt((s=e.category)==null?void 0:s.name),a=ir(t),r=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${k(r)}</span>`}function Dp(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(r=>r.date).sort((r,s)=>r.localeCompare(s));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function mr(e){const{startDate:t,endDate:a}=Dp(e);return t===a?ne(t):`${ne(t)} - ${ne(a)}`}function _p(e){return e.stageId>0}async function Ms(){const[e,t]=await Promise.all([V.getGameState(),V.getGameStatus()]);if(!e.success){console.error(e.error);return}c.gameState=e.data??null,c.gameStatus=t.success?t.data??null:null,Ap(),xe("dashboard")&&pr()}function Ap(){var s;if(!c.gameState)return;b("meta-date").textContent=c.gameState.formattedDate,b("meta-season").textContent=`Saison ${c.gameState.season}`;const e=b("meta-race-hint"),t=b("btn-advance-day"),a=b("pending-stages-list"),r=((s=c.gameStatus)==null?void 0:s.pendingStages)??[];r.length>0?(e.textContent=`${r.length} offene Etappe${r.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=r.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${ne(n.date)}`:`${n.profile} · ${ne(n.date)}`,o=_p(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
        <div class="pending-stage-item">
          <div class="pending-stage-meta">
            <div class="pending-stage-title">${k(n.raceName)}</div>
            <div class="pending-stage-subtitle">${k(i)}</div>
          </div>
          <div class="pending-stage-actions">
            ${o}
            <button class="btn btn-secondary btn-sm" data-live-stage="${n.stageId}">Live-Sim</button>
            <button class="btn btn-secondary btn-sm" data-instant-stage="${n.stageId}">Instant</button>
          </div>
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):c.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function pr(){var t,a,r,s,n;const e=c.teams.find(i=>i.isPlayerTeam)??c.teams.find(i=>{var o;return i.name===((o=c.currentSave)==null?void 0:o.teamName)})??null;b("dashboard-career").textContent=((t=c.currentSave)==null?void 0:t.careerName)??"–",b("dashboard-team").textContent=(e==null?void 0:e.name)??((a=c.currentSave)==null?void 0:a.teamName)??"–",b("dashboard-date").textContent=((r=c.gameState)==null?void 0:r.formattedDate)??"–",b("dashboard-season").textContent=c.gameState?`Saison ${c.gameState.season}`:"–",b("dashboard-races-today").textContent=String(((s=c.gameStatus)==null?void 0:s.pendingStages.length)??((n=c.gameState)==null?void 0:n.racesTodayCount)??0),zp()}async function Rs(){const e=await V.getRaces();if(!e.success){console.error(e.error);return}c.races=e.data??[],xe("dashboard")&&pr(),Bp(),Hp()}async function Bp(){var n;const e=(n=c.gameState)==null?void 0:n.season;if(!e||c.races.length===0)return;const t=`participantCountsLogged_${e}`;if(localStorage.getItem(t))return;const a=c.races.slice(0,30),r=await Promise.all(a.map(async i=>{var d;const o=await V.getRaceProgramParticipants(i.id);return{race:i,count:o.success?((d=o.data)==null?void 0:d.length)??0:-1}}));if(r.some(i=>i.count>0)){console.group(`[Velo] Teilnehmeranzahl Saison ${e}`);for(const{race:i,count:o}of r)o>=0&&console.log(`${i.name} (${i.startDate}): ${o} Programmfahrer`);console.groupEnd(),localStorage.setItem(t,"1")}}async function Hp(){var i;const e=(i=c.gameState)==null?void 0:i.season;if(!e)return;const t=`programAssignmentsLogged_${e}`;if(localStorage.getItem(t))return;const a=await V.getRiders();if(!a.success||!a.data)return;const r=a.data,s=new Map;for(const o of r)if(o.seasonProgram){const d=o.seasonProgram;s.has(d.id)||s.set(d.id,{name:d.name,riders:[]}),s.get(d.id).riders.push(o)}if(s.size===0)return;console.group(`[Velo] Programmzuweisungen Saison ${e}`);const n=Array.from(s.keys()).sort((o,d)=>o-d);for(const o of n){const d=s.get(o);console.log(`Program: ${o} - ${d.name} (Count: ${d.riders.length})`)}console.groupEnd(),localStorage.setItem(t,"1")}function Gp(e,t){const[a,r,s]=e.split("-").map(Number),n=new Date(a,r-1,s);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),d=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${d}`}function On(e){var p,u,m,f;const t=c.gameState!=null&&e.startDate<=c.gameState.currentDate&&e.endDate>=c.gameState.currentDate,r=c.gameState!=null&&e.endDate<c.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',s=((p=e.country)==null?void 0:p.name)??`Land ${e.countryId}`,n=(u=e.country)!=null&&u.code3?oe(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((g,y)=>g+(y.distanceKm??0),0):((m=e.upcomingStage)==null?void 0:m.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((g,y)=>g+(y.elevationGainMeters??0),0):((f=e.upcomingStage)==null?void 0:f.elevationGainMeters)??null,d=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${ne(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${k(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${ws(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${k(s)}</span></span></td>
      <td>${ur(e)}</td>
      <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${e.id}">Teilnehmer</button></td>
      <td>${d}</td>
      <td>${l}</td>
      <td>${r}</td>
    </tr>`}function zp(){const e=b("dashboard-races-tbody");if(!c.gameState){e.innerHTML='<tr><td colspan="9" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=c.gameState.currentDate,a=Gp(t,7),r=c.races.filter(i=>i.startDate<=t&&i.endDate>=t),s=c.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>In Progress</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=r.map(i=>On(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=s.map(i=>On(i)).join(""),e.innerHTML=n}function ba(e){return`Etappe ${e.stageNumber}`}function Kp(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,r)=>r[1]!==a[1]?r[1]-a[1]:a[0].localeCompare(r[0])).map(([a,r])=>`${r}x ${a}`).join(" · ")}function Wp(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function ya(e){return`<span class="stage-profile-badge ${Wp(e)}">${k(e)}</span>`}function gr(e,t){return`${e.name} · ${ba(t)} · ${t.profile}`}async function jp(e){var s;const t=c.stageSummariesByStageId[e];if(t)return t;const a=await V.getStageSummary(e);if(a.success&&a.data)return c.stageSummariesByStageId[e]=a.data,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],a.data;const r=await V.getRealtimeSimulation(e);return r.success&&((s=r.data)!=null&&s.stageSummary)?(c.stageSummariesByStageId[e]=r.data.stageSummary,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],r.data.stageSummary):(c.stageSummaryErrorsByStageId&&(c.stageSummaryErrorsByStageId[e]=a.error??r.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:r.error}),c.stageSummariesByStageId&&delete c.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function Op(){var d;const e=b("race-stages-title"),t=b("race-stages-meta"),a=b("race-stages-body"),r=yt(c.selectedDashboardRaceId);if(!r){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const s=r.stages??[],n=s.reduce((l,p)=>l+(p.distanceKm??0),0),i=s.reduce((l,p)=>l+(p.elevationGainMeters??0),0),o=Kp(s);if(e.textContent=r.name,t.textContent=`${mr(r)} · ${((d=r.country)==null?void 0:d.name)??`Land ${r.countryId}`} · ${r.isStageRace?`${r.numberOfStages} Etappen`:"Eintagesrennen"} · ${_r(n)} · ${Ar(i)} · ${o}`,s.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
                <td>${ne(l.date)}</td>
                <td><strong>${k(ba(l))}</strong></td>
                <td>${ya(l.profile)}</td>
                <td>${l.distanceKm!=null?_r(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?Ar(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${k(gr(r,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Vr(e){yt(e)&&(c.selectedDashboardRaceId=e,Op(),Je("raceStages"))}function Vp(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,r;return`
            <tr>
              <td>${mr(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?oe(t.country.code3):""}<span>${k(((r=t.country)==null?void 0:r.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${k(t.name)}</strong></td>
              <td>${ur(t)}</td>
              <td>${ws(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function Is(e){const t=c.riders.find(r=>r.id===e);b("rider-program-title").textContent=t?De(t):"Programm",b("rider-program-meta").textContent="Lade Programmrennen ...",b("rider-program-body").innerHTML="",Je("riderProgram");const a=await V.getRiderProgramRaces(e);if(!a.success||!a.data){b("rider-program-meta").textContent="",b("rider-program-body").innerHTML=`<div class="results-empty">${k(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}b("rider-program-title").textContent=a.data.program.name,b("rider-program-meta").textContent=t?De(t):"",b("rider-program-body").innerHTML=Vp(a.data)}function Up(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=Yp(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${xt("Team","team","Team")}
          ${xt("Fahrer","rider","Fahrer")}
          ${xt("Spec1","spec1","Spezialisierung 1")}
          ${xt("Rolle","role","Rolle")}
          ${xt("Ges","overall","Gesamtstärke")}
          ${xt("Phase","phase","Formphase")}
          ${xt("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var r,s;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${Ct((r=a.team)==null?void 0:r.id,(s=a.team)==null?void 0:s.name)}</td>
              <td><span class="race-participant-rider-cell">${oe(Et(a.rider))}<strong>${k(De(a.rider))}</strong></span></td>
              <td>${k(Ur(a.rider))}</td>
              <td>${k(bt(a.rider))}</td>
              <td>${fi(a.rider.overallRating)}</td>
              <td>${hi(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${k(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function xt(e,t,a){const r=c.raceParticipantsSort.key===t?" race-participants-sort-active":"",s=c.raceParticipantsSort.key===t?c.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${k(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${r}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${k(e)}</span>
        <span class="team-table-sort-indicator${c.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${s}</span>
      </button>
    </th>`}function Yp(e){const t=c.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{var n,i,o,d;let s=0;switch(c.raceParticipantsSort.key){case"team":s=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=r.team)==null?void 0:i.name)??"","de");break;case"rider":s=De(a.rider).localeCompare(De(r.rider),"de");break;case"spec1":s=Ur(a.rider).localeCompare(Ur(r.rider),"de");break;case"role":s=bt(a.rider).localeCompare(bt(r.rider),"de");break;case"overall":s=a.rider.overallRating-r.rider.overallRating;break;case"phase":s=(a.rider.seasonFormPhase??"neutral").localeCompare(r.rider.seasonFormPhase??"neutral","de");break;default:s=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((d=r.program)==null?void 0:d.name)??"","de")}return s*t||De(a.rider).localeCompare(De(r.rider),"de")})}function Ur(e){return e.specialization1!=null?aa(e.specialization1):"–"}async function Ko(e){const t=yt(e);c.selectedRaceParticipantsRaceId=e,b("race-participants-title").textContent=(t==null?void 0:t.name)??"Teilnehmer",b("race-participants-meta").textContent="Lade Programmfahrer ...",b("race-participants-body").innerHTML="",c.raceParticipants=[],Je("raceParticipants"),await Wo()}async function Wo(e=!1){const t=c.selectedRaceParticipantsRaceId;if(t==null)return;const a=yt(t);e&&(b("race-participants-meta").textContent="Lade Programmfahrer ...");const r=await V.getRaceProgramParticipants(t);if(!r.success||!r.data){b("race-participants-meta").textContent="",b("race-participants-body").innerHTML=`<div class="results-empty">${k(r.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}c.raceParticipants=r.data,b("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",b("race-participants-meta").textContent=`${r.data.length} Programmfahrer · ${a?mr(a):""}`,b("race-participants-body").innerHTML=Up(c.raceParticipants)}async function rr(e,t=null){let a=ja(e);if(!a&&c.stageEditorStageRows){const n=c.stageEditorStageRows.find(i=>i.stageId===e);n&&(a={race:{id:n.raceId,name:n.raceName,countryId:0,categoryId:0,isStageRace:!0,numberOfStages:1,startDate:"",endDate:"",prestige:0},stage:{id:n.stageId,raceId:n.raceId,stageNumber:n.stageNumber,date:"2026-01-01",profile:n.profile,startElevation:0,detailsCsvFile:"",distanceKm:n.distanceKm,elevationGainMeters:n.elevationGainMeters}})}if(!a)return;const r=await jp(e);if(!r){alert(c.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}c.selectedDashboardProfileStageId=e,b("stage-profile-title").textContent=`${a.race.name} · ${ba(a.stage)}`;const s=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";b("stage-profile-meta").textContent=`${ne(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?_r(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?Ar(a.stage.elevationGainMeters):"–"}${s}`,Al(b("stage-profile-view"),r,a.stage.profile,gr(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),Je("stageProfile")}function Zp(){b("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const s=Number(t.dataset.editStageRoster);if(!Number.isFinite(s))return;Pp(s);return}const a=e.target.closest("button[data-live-stage]");if(a){const s=Number(a.dataset.liveStage);if(!Number.isFinite(s))return;Go(s,!0);return}const r=e.target.closest("button[data-instant-stage]");if(r){const s=Number(r.dataset.instantStage);if(!Number.isFinite(s))return;Do(s)}}),b("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-participants-id]");if(t){const s=Number(t.dataset.dashboardRaceParticipantsId);Number.isFinite(s)&&Ko(s);return}const a=e.target.closest("button[data-dashboard-race-id]");if(!a)return;const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&Vr(r)}),b("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&rr(a)}),b("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&Is(s);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const r=a.dataset.raceParticipantsSort;c.raceParticipantsSort.key===r?c.raceParticipantsSort.direction=c.raceParticipantsSort.direction==="asc"?"desc":"asc":c.raceParticipantsSort={key:r,direction:"asc"},Wo()}),b("btn-advance-day").addEventListener("click",async()=>{await jo()}),b("btn-auto-progress").addEventListener("click",()=>{Jp()})}async function jo(){Te("Tag wird fortgeschrieben...");try{const e=await V.advanceDay();if(!e.success)return alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler")),!1;if(c.currentSave&&e.data&&(c.currentSave.currentSeason=e.data.season),await Ms(),await Rs(),xe("teams")){const{refreshTeamsViewData:t}=await yi(async()=>{const{refreshTeamsViewData:a}=await Promise.resolve().then(()=>Ep);return{refreshTeamsViewData:a}},void 0);await t()}return!0}catch(e){return alert("Unerwarteter Fehler beim Tageswechsel: "+e.message),!1}finally{Se()}}function Cs(){const e=document.getElementById("btn-auto-progress");e&&(ct?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function Jp(){ct?sr():Oo()}function Oo(){ct||(di(!0),Cs(),qp())}function sr(){ct&&(di(!1),c.autoProgressTargetDate=null,Cs())}async function qp(){var e,t;for(;ct;){const a=(e=c.gameState)==null?void 0:e.currentDate;if(c.autoProgressTargetDate&&a&&a>=c.autoProgressTargetDate){sr();break}const r=((t=c.gameStatus)==null?void 0:t.pendingStages)??[];let s=!1;if(r.length>0){const n=r[0];s=await Do(n.stageId,!0)}else s=await jo();if(!s){sr();break}await new Promise(n=>setTimeout(n,100))}Cs()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&ct){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),sr()}});const oa=50;function Es(){return[...ys,...vs[c.riderMenuDetailPage]]}function Vo(e){return c.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function Uo(e){if(!e.sortKey)return`<th class="${k(e.className??"")}" title="${k(e.title)}">${k(e.label)}</th>`;const t=c.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${k(e.className??"")}" title="${k(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${k(e.label)}</span>
        ${Vo(e.sortKey)}
      </button>
    </th>`}function Yo(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${ha.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function Ha(){const e=b("riders-detail"),t=Es(),a=Fo(c.riders),r=a.length,s=Math.max(1,Math.ceil(r/oa));c.riderMenuPage=Math.min(s,Math.max(1,c.riderMenuPage));const n=(c.riderMenuPage-1)*oa,i=Math.min(r,n+oa),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r} Fahrer</span>
        <span class="text-muted">Sortierung: ${k($s(c.riderMenuTableSort.key))} ${c.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Yo()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(Uo).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(d=>`
                <tr class="team-detail-row">
                  ${t.map(l=>xs(d,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${c.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${c.riderMenuPage} / ${s} · Fahrer ${r===0?0:n+1}-${i} von ${r}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${c.riderMenuPage>=s?"disabled":""}>Weiter</button>
      </div>
    </div>`}function Zo(){b("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&Is(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;ha.includes(n)&&(c.riderMenuDetailPage=n,new Set(Es().map(o=>o.sortKey).filter(o=>o!=null)).has(c.riderMenuTableSort.key)||(c.riderMenuTableSort={key:"name",direction:"asc"}),c.riderMenuPage=1,Ha());return}const r=e.target.closest("button[data-riders-sort]");if(r){const n=r.dataset.ridersSort;c.riderMenuTableSort.key===n?c.riderMenuTableSort.direction=c.riderMenuTableSort.direction==="asc"?"desc":"asc":c.riderMenuTableSort={key:n,direction:ks(n)},c.riderMenuPage=1,Ha();return}const s=e.target.closest("button[data-riders-page-action]");if(s){const n=s.dataset.ridersPageAction,i=Math.max(1,Math.ceil(c.riders.length/oa));n==="prev"&&(c.riderMenuPage=Math.max(1,c.riderMenuPage-1)),n==="next"&&(c.riderMenuPage=Math.min(i,c.riderMenuPage+1)),Ha();return}})}const Xp=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:oa,getActiveRiderMenuTableColumns:Es,getRiderMenuSortIndicator:Vo,initRidersListeners:Zo,renderRiderMenuDetailPageTabs:Yo,renderRiderMenuTableHeader:Uo,renderRidersMenu:Ha},Symbol.toStringTag,{value:"Module"})),La=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function Qe(e){return e==null?"free-agents":String(e)}function Vn(e){var a;const t=c.riderTeamEditorPayload;return t?((a=t.teams.find(r=>r.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function Qp(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return gi(t/11.2,0,100)}function eg(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function tg(e){return c.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function ag(e){const t=c.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${k(e.title)}"
        aria-label="${k(e.title)}"
      >
        <span class="team-table-sort-label">${k(e.label)}</span>
        ${tg(e.key)}
      </button>
    </th>`}function rg(e,t){switch(c.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return se(e.firstName,t.firstName);case"lastName":return se(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return se(Vn(e.teamId),Vn(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return se(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return se(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function sg(e){const t=c.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>(rg(a,r)||se(a.lastName,r.lastName)||se(a.firstName,r.firstName)||a.riderId-r.riderId)*t)}function ng(e){const t=c.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(r=>Qe(r.teamId)===t);return sg(a)}function ig(e){const t=c.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${Qe(a.teamId)}"${a.teamId===e?" selected":""}>${k(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function Jo(e){return c.riderTeamEditorDirtyRiderIds.includes(e)}function og(e,t){const a=Jo(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${Qr(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${ig(e.teamId)}</select></td>`;case"number":{const r=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${r}"></td>`}case"text":{const r=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${k(r)}"></td>`}default:return"<td>–</td>"}}function lg(e){const t=[...e.teams].sort((a,r)=>a.rank-r.rank||se(a.name,r.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${c.riderTeamEditorSelectedTeamKey===Qe(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${Qe(a.teamId)}">
              <span class="rider-team-editor-sidebar-main">
                <span>${k(a.name)}</span>
                <span class="text-muted">${k(a.abbreviation)} · ${k(a.divisionName)}</span>
              </span>
              <span class="rider-team-editor-sidebar-stats">
                <strong>${a.riderCount}</strong>
                <span>Ø ${a.averageOverall!=null?a.averageOverall.toFixed(1).replace(".",","):"–"} · #${a.rank}</span>
              </span>
            </button>
          `).join("")}
        </div>
      </div>
    </aside>`}function Ae(){var o;const e=b("rider-team-editor-root"),t=b("rider-team-editor-meta"),a=c.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const r=c.riderTeamEditorSelectedTeamKey?a.teams.find(d=>Qe(d.teamId)===c.riderTeamEditorSelectedTeamKey)??null:null,s=ng(a),n=c.riderTeamEditorDirtyRiderIds.length,i=r==null?"Kein Team gewählt":`${r.riderCount} Fahrer · Ø ${r.averageOverall!=null?r.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${r.rank}`;t.textContent=r==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${r.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${c.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(d=>`
                  <option value="${Qe(d.teamId)}"${c.riderTeamEditorSelectedTeamKey===Qe(d.teamId)?" selected":""}>${k(d.name)} (${d.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${k(c.riderTeamEditorSort.key==="teamName"?"Team":((o=La.find(d=>d.key===c.riderTeamEditorSort.key))==null?void 0:o.title)??c.riderTeamEditorSort.key)} ${c.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${La.map(ag).join("")}
                </tr>
              </thead>
              <tbody>
                ${s.length===0?`<tr><td colspan="${La.length}" class="text-muted">${c.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:s.map(d=>`
                    <tr class="team-detail-row${Jo(d.riderId)?" rider-team-editor-row-dirty":""}">
                      ${La.map(l=>og(d,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${lg(a)}
    </div>`}function dg(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),d=o.length===0?null:Math.round(o.reduce((l,p)=>l+p.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:d,rank:0}}),r=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:r.length,averageOverall:r.length===0?null:Math.round(r.reduce((i,o)=>i+o.overallRating,0)/r.length*100)/100,rank:0,isFreeAgents:!0});const s=[...a].sort((i,o)=>{const d=i.averageOverall??-1;return(o.averageOverall??-1)-d||o.riderCount-i.riderCount||se(i.name,o.name)}),n=new Map(s.map((i,o)=>[Qe(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(Qe(i.teamId))??a.length}))}async function qo(e=!1){if(c.riderTeamEditorPayload&&!e){Ae();return}b("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await V.getRiderTeamEditor();if(!t.success||!t.data){b("rider-team-editor-root").innerHTML=`<div class="results-empty">${k(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}c.riderTeamEditorPayload=t.data,c.riderTeamEditorDirtyRiderIds=[],c.riderTeamEditorSaving=!1,c.riderTeamEditorExporting=!1,c.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(r=>Qe(r.teamId)===c.riderTeamEditorSelectedTeamKey)||(c.riderTeamEditorSelectedTeamKey="")),Ae()}function cg(e,t,a){const r=c.riderTeamEditorPayload;if(!r)return;const s=r.riders.find(n=>n.riderId===e);s&&(t==="teamId"?s.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof s[t]=="number"?s[t]=Number.parseInt(a||"0",10):s[t]=a,s.overallRating=Qp(s),r.teams=dg(r),c.riderTeamEditorDirtyRiderIds.includes(e)||(c.riderTeamEditorDirtyRiderIds=[...c.riderTeamEditorDirtyRiderIds,e]),Ae())}async function ug(){if(!c.riderTeamEditorPayload||c.riderTeamEditorSaving)return;c.riderTeamEditorSaving=!0,Ae();const e=await V.saveRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Ae();return}c.riderTeamEditorPayload=e.data,c.riderTeamEditorDirtyRiderIds=[],Ae()}async function mg(){if(!c.riderTeamEditorPayload||c.riderTeamEditorExporting)return;c.riderTeamEditorExporting=!0,Ae();const e=await V.exportRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Ae();return}Br(e.data.fileName,e.data.content),Ae()}function pg(){b("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const s=t.dataset.riderTeamEditorSort;c.riderTeamEditorSort.key===s?c.riderTeamEditorSort.direction=c.riderTeamEditorSort.direction==="asc"?"desc":"asc":c.riderTeamEditorSort={key:s,direction:eg(s)},Ae();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){c.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Ae();return}const r=e.target.closest("button[data-rider-team-editor-action]");if(r){const s=r.dataset.riderTeamEditorAction;if(s==="reload"){qo(!0);return}if(s==="export"){mg();return}s==="save"&&ug()}}),b("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){c.riderTeamEditorSelectedTeamKey=t.value,Ae();return}const a=e.target.closest(".rider-team-editor-input");if(a){const r=Number(a.dataset.riderTeamEditorRiderId),s=a.dataset.riderTeamEditorField;Number.isFinite(r)&&s&&cg(r,s,a.value)}})}let rt={key:"pickNumber",asc:!0};function Un(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),r=.26+t*.18,s=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${r};--rider-stats-pill-bg-alpha:${s};`}async function Xo(e,t=!1){const a=await V.getDraftHistory(e);if(!a.success){c.draftHistory=null,xe("draft")&&Yr(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}c.draftHistory=a.data??null,xe("draft")&&Yr()}function Yr(){const e=b("draft-table-container"),t=b("draft-season-select");if(!c.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const i=c.currentSave.startSeason??2026;for(let o=c.currentSave.currentSeason;o>=i;o--){const d=document.createElement("option");d.value=o.toString(),d.textContent=`Saison ${o}`,t.appendChild(d)}c.draftSelectedSeason||(c.draftSelectedSeason=c.currentSave.currentSeason),t.value=c.draftSelectedSeason.toString(),t.onchange=o=>{const d=o.target;c.draftSelectedSeason=parseInt(d.value,10),Xo(c.draftSelectedSeason)}}if(!c.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(c.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...c.draftHistory.rows].sort((i,o)=>{let d=0;const l=rt.key;return l==="riderLastName"?d=i.riderLastName.localeCompare(o.riderLastName):l==="teamName"?d=i.teamName.localeCompare(o.teamName):l==="oldTeamName"?d=(i.oldTeamName||"").localeCompare(o.oldTeamName||""):l==="countryCode"?d=i.countryCode.localeCompare(o.countryCode):d=(i[l]??0)-(o[l]??0),rt.asc?d:-d}),r=i=>rt.key!==i?'<span class="sort-icon-placeholder"></span>':rt.asc?" ▲":" ▼",s=i=>{rt.key===i?rt.asc=!rt.asc:(rt.key=i,rt.asc=!0),Yr()};window.setDraftSort=s;let n=`
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
  `;for(const i of a){const o=c.draftHistory.season-i.riderBirthYear;let d="-";i.oldTeamName&&(d=`<div style="display:flex; align-items:center; gap:0.5rem;">${Ct(i.oldTeamId,i.oldTeamName)} ${k(i.oldTeamName)}</div>`);const l=`<div style="display:flex; align-items:center; gap:0.5rem;">${Ct(i.teamId,i.teamName)} ${k(i.teamName)}</div>`;n+=`
      <tr>
        <td class="text-center">#${i.pickNumber}</td>
        <td class="text-center">Runde ${i.draftRound}</td>
        <td>${l}</td>
        <td>${d}</td>
        <td class="text-center">${oe(i.countryCode)}</td>
        <td>${k(i.riderFirstName)} ${k(i.riderLastName)}</td>
        <td class="text-center">${o} J.</td>
        <td class="text-center">${i.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Un(i.overallAtDraft)}">${i.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Un(i.potOverallAtDraft)}">${i.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}n+="</tbody></table>",e.innerHTML=n}async function gg(e=!1){const t=await V.getInjuries();if(!t.success){c.injuries=null,xe("injuries")&&Yn(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}c.injuries=t.data??[],xe("injuries")&&Yn()}function Yn(){const e=b("injuries-table-container");if(!c.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(b("injuries-meta").textContent=c.injuries.length+" Ausfälle",c.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=Ut;let t="";const a=c.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),r=new Map;for(const n of a){const i=n.teamId;r.has(i)||r.set(i,[]),r.get(i).push(n)}for(const n of r.keys())r.get(n).sort((i,o)=>o.overallRating-i.overallRating);const s=Array.from(r.keys()).sort((n,i)=>{const o=r.get(n)[0].teamAbbreviation||"",d=r.get(i)[0].teamAbbreviation||"";return o.localeCompare(d)});if(s.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of s){const i=r.get(n),o=i[0].teamAbbreviation;t+=`
        <div style="margin-bottom: 2rem;">
          <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 0.5rem;">
            <img src="/jersey/Jer_${n}.png" style="width: 128px; height: 128px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));" onerror="this.style.display='none'">
            <h3 style="margin: 0; font-size: 1.5rem;">${k(o??"Team "+n)}</h3>
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
      `;for(const d of i){const l=d.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let p="";if(d.fitDate){const u=ne(d.fitDate);if(d.missedRaces&&d.missedRaces.length>0){let m="";for(const f of d.missedRaces)m+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${ne(f.startDate)}</span>
                  ${oe(f.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${k(f.name)}</strong>
                  ${ps(f.categoryName)}
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
            <td>${oe(d.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${d.riderId})" style="color: inherit; text-decoration: none;"><strong>${k(d.riderFirstName)} ${k(d.riderLastName)}</strong></a></td>
            <td>${d.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${bo(d.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${d.unavailableDays} Tage</strong></td>
            <td>${p}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function Zn(e){return e===0?"–":`-${e}`}function fg(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${it(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Le(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function hg(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${k(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${fg(e.topRiders)}
      </div>
    </div>`}function bg(e,t){const a=t.filter(r=>r.teamId!=null&&e.teamId!=null&&r.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${it(r.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Le(r.riderName??"–",{riderId:r.riderId,teamId:r.teamId,strong:!1})}</span>
          <strong>${r.points}</strong>
        </div>
      `).join("")}
    </div>`}function yg(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${nt(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${bg(e,t)}
      </div>
    </div>`}async function vg(e){const t=await V.getSeasonStandings();if(!t.success){c.seasonStandings=null,xe("season-standings")&&Zr();return}c.seasonStandings=t.data??null,xe("season-standings")&&Zr()}function Zr(){var g,y,v,S,T,M;const e=b("season-standings-meta"),t=b("season-standings-scope-tabs"),a=b("season-standings-empty"),r=b("season-standings-table"),s=b("season-standings-tbody"),n=b("season-standings-jersey-header"),i=b("season-standings-primary-header"),o=b("season-standings-flag-header"),d=b("season-standings-secondary-header"),l=((g=c.seasonStandings)==null?void 0:g.season)??((y=c.gameState)==null?void 0:y.season)??((v=c.currentSave)==null?void 0:v.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.",t.innerHTML=`
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
  `;const p=c.selectedSeasonStandingScope==="countries",u=p?((S=c.seasonStandings)==null?void 0:S.countryStandings)??[]:c.selectedSeasonStandingScope==="teams"?((T=c.seasonStandings)==null?void 0:T.teamStandings)??[]:((M=c.seasonStandings)==null?void 0:M.riderStandings)??[],m=p?u:[],f=p?[]:u;if(n.textContent="Trikot",i.textContent=p?"Land":c.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",d.textContent=c.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",p),d.classList.toggle("hidden",p),!c.seasonStandings||u.length===0){s.innerHTML="",r.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}s.innerHTML=p?m.map(x=>`
      <tr>
        <td class="pos-${Math.min(x.rank,3)}">${x.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${hg(x)}</td>
        <td class="results-flag-col-cell">${it(x.countryCode)}</td>
        <td class="hidden"></td>
        <td>${x.points}</td>
        <td>${k(Zn(x.gapPoints))}</td>
      </tr>`).join(""):f.map(x=>{var D;const $=x.riderName??x.teamName,I=qt(x.teamId,x.teamName),R=c.selectedSeasonStandingScope==="teams"?yg(x,((D=c.seasonStandings)==null?void 0:D.riderStandings)??[]):Xt($,!0,!1,x.riderId,x.teamId),P=it(x.countryCode),F=c.selectedSeasonStandingScope==="teams"?k(x.countryName??x.countryCode??"–"):nt(x.teamName??"–",x.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(x.rank,3)}">${x.rank}</td>
          <td class="results-jersey-col-cell">${I}</td>
          <td>${R}</td>
          <td class="results-flag-col-cell">${P}</td>
          <td>${F}</td>
          <td>${x.points}</td>
          <td>${k(Zn(x.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),r.classList.remove("hidden")}function Sg(){b("season-standings-scope-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-season-scope]");if(!t)return;const a=t.dataset.seasonScope;a!=="riders"&&a!=="teams"&&a!=="countries"||(c.selectedSeasonStandingScope=a,Zr())})}function Jn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function kg(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,r=[...e].map(l=>({rider:l,score:t(l)})).sort((l,p)=>p.score-l.score).slice(0,10),s=[...e].map(l=>({rider:l,score:a(l)})).sort((l,p)=>p.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,p)=>p.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,p)=>p.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,p)=>p.score-l.score).slice(0,10),d=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,p)=>p.score-l.score).slice(0,10);return{Gesamtklassement:r,Sprinter:s,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:d}}function $g(e,t){const a=c.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const r=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,s=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>r(o)):t==="Sprinter"?n=a.map(o=>s(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,d)=>d-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,d)=>o+d,0)/i.length}function xg(e,t){var i;const r=c.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:$g(o.id,t)}));r.sort((o,d)=>d.avgScore-o.avgScore);const s=r.findIndex(o=>o.teamId===e)+1,n=((i=r.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:s,total:r.length,average:n}}function Tg(e){const t=c.riders.filter(s=>s.activeTeamId===e);if(t.length===0)return 0;const a=t.map(s=>s.overallRating??0);a.sort((s,n)=>n-s);const r=a.slice(0,10);return r.length===0?0:r.reduce((s,n)=>s+n,0)/r.length}function wg(e){var n;const a=c.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:Tg(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const r=a.findIndex(i=>i.teamId===e)+1,s=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:r,total:a.length,average:s}}function Da(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function Er(e){e.countryCode&&oe(e.countryCode);const t=kg(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,p)=>p.formValue-l.formValue).slice(0,10),r=[...e.riders].map(l=>({rider:l,uciRank:tr(l.id)})).filter(l=>l.uciRank!==null).sort((l,p)=>l.uciRank-p.uciRank).slice(0,10),s=Object.entries(t).map(([l,p])=>{const u=xg(e.teamId,l),m=u.average.toFixed(1).replace(".",","),f=p.map(({rider:g,score:y})=>{const v=`${g.firstName.charAt(0)}. ${g.lastName}`,S=Le(v,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),T=g.nationality?Ye[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,M=T?`<span class="fi fi-${T} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${k(g.nationality)}"></span>`:"",x=c.riders.find(I=>I.id===g.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${Da((x==null?void 0:x.roleId)??null).color};">
            ${M}
            ${S}
          </span>
          <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${y.toFixed(0)}</span>
        </li>
      `}).join("");return`
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
          ${l}
          <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-400); display: block; margin-top: 0.1rem;">Platz ${u.rank}/${u.total} · Ø ${m}</span>
        </h4>
        <ul style="margin: 0; padding: 0; list-style: none;">${f}</ul>
      </div>
    `}).join(""),i=[...e.riders].sort((l,p)=>(p.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const p=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Le(p,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),m=l.nationality?Ye[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=m?`<span class="fi fi-${m} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${k(l.nationality)}"></span>`:"",g=l.overallRating.toFixed(0),y=c.riders.find(S=>S.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Da((y==null?void 0:y.roleId)??null).color};">
          ${f}
          ${u}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:p})=>{const u=`${l.firstName.charAt(0)}. ${l.lastName}`,m=Le(u,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?Ye[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${k(l.nationality)}"></span>`:"",y=(p>=0?"+":"")+p.toFixed(1).replace(".",","),v=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,S=c.riders.find(M=>M.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Da((S==null?void 0:S.roleId)??null).color};">
          ${g}
          ${m}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${v}">${y}</span>
      </li>
    `}).join(""),d=r.map(({rider:l,uciRank:p})=>{const u=`${l.firstName.charAt(0)}. ${l.lastName}`,m=Le(u,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?Ye[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${k(l.nationality)}"></span>`:"";let y="rider-stats-rank-badge-gc";p===1?y="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":p===2?y="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":p===3&&(y="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const v=`<span class="rider-stats-rank-badge ${y}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${p}">${p}</span>`,S=c.riders.find(M=>M.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Da((S==null?void 0:S.roleId)??null).color};">
          ${g}
          ${m}
        </span>
        ${v}
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
  `}function Fr(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${c.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${c.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${c.teamStatsTab==="contracts"?"true":"false"}">Auslaufende Verträge</button>
    </div>`}function Mg(e){const t=Array.from(new Set(e.topResults.map(m=>m.raceCategoryName).filter(Boolean)));t.sort((m,f)=>m.localeCompare(f,"de"));const a=Array.from(new Set(e.topResults.map(m=>m.season))).sort((m,f)=>f-m);let r=e.topResults.filter(m=>m.rowType!=="stage_result"?m.rowType==="gc_final"?c.teamStatsTopResultsFilters.gc:m.rowType==="mountain_final"?c.teamStatsTopResultsFilters.mountain:m.rowType==="points_final"?c.teamStatsTopResultsFilters.points:m.rowType==="youth_final"?c.teamStatsTopResultsFilters.youth:!0:m.profile==="TTT"||m.isStageRace||m.stageNumber!=null?c.teamStatsTopResultsFilters.stage:c.teamStatsTopResultsFilters.oneDay);if(c.teamStatsTopResultsFilterCategory){const m=c.teamStatsTopResultsFilterCategory;if(m.endsWith("-etappen")){const f=m.substring(0,m.length-8);r=r.filter(g=>g.raceCategoryName===f&&g.rowType==="stage_result")}else if(m.endsWith("-gc")){const f=m.substring(0,m.length-3);r=r.filter(g=>g.raceCategoryName===f&&g.rowType!=="stage_result")}else r=r.filter(f=>f.raceCategoryName===m)}c.teamStatsTopResultsFilterSeason!=null&&(r=r.filter(m=>m.season===c.teamStatsTopResultsFilterSeason)),r.sort((m,f)=>{if(f.seasonPoints!==m.seasonPoints)return f.seasonPoints-m.seasonPoints;const g=m.rowType!=="stage_result",y=f.rowType!=="stage_result",v=m.resultRank??9999,S=f.resultRank??9999;if(c.teamStatsTopResultsFilterCategory)return v!==S?v-S:g!==y?g?-1:1:0;{const T=Jn(m.raceCategoryName),M=Jn(f.raceCategoryName);return T!==M?T-M:g!==y?g?-1:1:v-S}});const s=20,n=Math.max(1,Math.min(10,Math.ceil(r.length/s)));c.teamStatsTopResultsPage>n&&(c.teamStatsTopResultsPage=n);const i=(c.teamStatsTopResultsPage-1)*s,o=r.slice(i,i+s),l=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${t.map(m=>{if(m.toLowerCase().includes("stage race")||m.toLowerCase().includes("grand tour")||m.toLowerCase().includes("tour de france")){const g=`${m}-etappen`,y=`${m}-gc`;return`
        <option value="${k(g)}" ${c.teamStatsTopResultsFilterCategory===g?"selected":""}>${k(m)} - Etappen</option>
        <option value="${k(y)}" ${c.teamStatsTopResultsFilterCategory===y?"selected":""}>${k(m)} - GC</option>
      `}else return`<option value="${k(m)}" ${c.teamStatsTopResultsFilterCategory===m?"selected":""}>${k(m)}</option>`}).join("")}
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
  `,p=o.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(m=>{const f=m.rowType!=="stage_result",g=f?`${m.raceName} · ${m.rowType==="gc_final"?"Gesamtwertung":m.rowType==="points_final"?"Punktewertung":m.rowType==="mountain_final"?"Bergwertung":"Nachwuchs"}`:m.stageNumber?`${m.raceName} · Etappe ${m.stageNumber}`:m.raceName;let y="–",v="–";m.finishStatus==="otl"?y=Pt("OTL","place"):m.finishStatus==="dnf"?y=Pt("DNF","place"):m.resultRank==null||(f?v=`<span class="rider-stats-final-type ${m.rowType==="gc_final"?"is-gc":m.rowType==="points_final"?"is-points":m.rowType==="mountain_final"?"is-mountain":"is-youth"}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${m.resultRank}</span>`:y=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${m.resultRank<=3?` rider-stats-rank-badge-top-${m.resultRank}`:""}">${k(String(m.resultRank))}</span>`);const S=m.profile?ya(m.profile):"–",T=!f&&m.stageScore!=null&&m.stageScore>0?cr(m.stageScore,0,350):"–",M=er(m.raceCategoryName),x=m.riderCountryCode?Ye[m.riderCountryCode]??m.riderCountryCode.slice(0,2).toLowerCase():null,$=x?`<span class="fi fi-${x} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${k(m.riderCountryCode??"")}"></span>`:"–",I=Le(m.riderName,{riderId:m.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${y}</td>
            <td>${v}</td>
            <td>${$}</td>
            <td style="white-space: nowrap;">${I}</td>
            <td><strong>${k(g)}</strong></td>
            <td class="status-cell">${fs(m)}</td>
            <td>${S}</td>
            <td>${T}</td>
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
  `}function Rg(e){const t=String(c.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,superteamCount:0,categories:{}},r=t==="all",s=u=>r?u:"–",n=(u,m)=>r?`${u} / ${m} T`:"–",i=r?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(u,m,f,g)=>{const y=typeof u=="number"?u:parseFloat(String(u))||0;let v="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return y===0?v+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":m==="gold"?v+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":m==="silver"?v+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":m==="bronze"?v+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":m==="purple"?v+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":m==="green"?v+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":m==="red"?v+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":m==="white"&&(v+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${v}" title="${k(f)}: ${y} Siege">${u}</span>`},d=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
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
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${k(u.name)}">${k(u.name)}</span>
                ${ps(u.key)}
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
                  ${ie(m.winFlat||0,"flat","Flach (Flat)")}
                  ${ie(m.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${ie(m.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${ie(m.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${ie(m.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${ie(m.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${ie(m.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${ie(m.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${ie(m.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${ie(m.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${ie(m.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${$e(m.winWeather1||0,1,"Sonnig")}
                  ${$e(m.winWeather2||0,2,"Extreme Hitze")}
                  ${$e(m.winWeather3||0,3,"Leichter Regen")}
                  ${$e(m.winWeather4||0,4,"Starkregen")}
                  ${$e(m.winWeather5||0,5,"Starker Wind")}
                  ${$e(m.winWeather6||0,6,"Dichter Nebel")}
                  ${$e(m.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${re.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${m.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}function Ig(e){var s;const t=((s=c.gameState)==null?void 0:s.season)??new Date().getFullYear(),a=[...e.riders].sort((n,i)=>{const o=n.contractEndSeason??9999,d=i.contractEndSeason??9999;return o!==d?o-d:i.overallRating-n.overallRating});return`
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
            ${a.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Vertragsdaten verfügbar.</td></tr>':a.map(n=>{const i=n.nationality?Ye[n.nationality]??n.nationality.slice(0,2).toLowerCase():null,o=i?`<span class="fi fi-${i} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${k(n.nationality)}"></span>`:"–",d=Le(`${n.firstName} ${n.lastName}`,{riderId:n.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),l=c.riders.find(y=>y.id===n.id),p=`<span class="results-roster-overall-badge" style="color:${qn(n.overallRating)}" title="Stärke: ${n.overallRating.toFixed(2)}">${n.overallRating.toFixed(1)}</span>`;let u="–";l&&l.potential!=null&&(u=`<span class="results-roster-overall-badge" style="color:${qn(l.potential)}" title="Potential: ${l.potential.toFixed(2)}">${l.potential.toFixed(1)}</span>`);const m=n.contractEndSeason===t,f=n.contractEndSeason?`Saison ${n.contractEndSeason}`:"Ohne Vertrag",g=m?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${k(f)}</span>`:`<span style="font-weight: 500;">${k(f)}</span>`;return`
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
  `}function qn(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function Tt(e){return c.teamStatsTab==="career"?`
      ${Er(e)}
      ${Fr()}
      ${Rg(e)}
    `:c.teamStatsTab==="contracts"?`
      ${Er(e)}
      ${Fr()}
      ${Ig(e)}
    `:`
    ${Er(e)}
    ${Fr()}
    ${Mg(e)}
  `}function Cg(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((r=c.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${k(a)}" aria-label="${k(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${k(ui(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function Qo(e){c.teamStatsSelectedTeamId=e,c.teamStatsTab="topResults",c.teamStatsTopResultsFilterCategory=null,c.teamStatsTopResultsFilterSeason=null,c.teamStatsSelectedSeason="all",c.teamStatsTopResultsPage=1;const t=c.teams.find(n=>n.id===e);b("team-stats-title").innerHTML=t?`Team <strong>${k(t.name)}</strong>`:"Teamstatistik",b("team-stats-jersey").innerHTML=Cg(e,(t==null?void 0:t.name)??"");const a=wg(e),r=a.average.toFixed(2).replace(".",",");b("team-stats-meta").innerHTML=t?`${k(t.abbreviation)} · ${k(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${r})`:"Daten werden geladen",b("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,Je("teamStats");const s=await V.getTeamStats(e);if(c.teamStatsSelectedTeamId===e){if(!s.success||!s.data){b("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${k(s.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}c.teamStatsPayload=s.data,b("team-stats-body").innerHTML=Tt(s.data)}}function Eg(){b("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-stats-tab]");if(a){const s=a.dataset.teamStatsTab;(s==="topResults"||s==="career"||s==="contracts")&&(c.teamStatsTab=s,c.teamStatsPayload&&(b("team-stats-body").innerHTML=Tt(c.teamStatsPayload)));return}const r=t.closest("button[data-team-top-results-page]");if(r){const s=Number(r.dataset.teamTopResultsPage);!isNaN(s)&&s>=1&&(c.teamStatsTopResultsPage=s,c.teamStatsPayload&&(b("team-stats-body").innerHTML=Tt(c.teamStatsPayload)));return}}),b("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;c.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(b("team-stats-body").innerHTML=Tt(c.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;c.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(b("team-stats-body").innerHTML=Tt(c.teamStatsPayload))}else if(t.classList.contains("team-stats-filter-checkbox")){const a=t,r=a.dataset.filterType;c.teamStatsTopResultsFilters[r]=a.checked,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(b("team-stats-body").innerHTML=Tt(c.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;c.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),c.teamStatsPayload&&(b("team-stats-body").innerHTML=Tt(c.teamStatsPayload))}})}let At="riders",lt="season",Fs="season",Ze="";const nr=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function Fg(){const e=b("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");Ng(o)})})}const t=b("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");Lg(o)})})}nr.forEach(n=>{const i=b(n);i&&i.addEventListener("change",()=>{const o=i.value;o?Dg(o,n):nr.some(l=>{const p=b(l);return p&&p.value!==""})||(Ze="",Yt())})}),window.openRiderStatsFromLeaderboard=Ut;const a=b("leaderboard-filter-wt"),r=b("leaderboard-filter-pt"),s=b("leaderboard-filter-other");[a,r,s].forEach(n=>{n&&n.addEventListener("change",()=>{Yt()})})}function Pg(){Yt()}function Ng(e){At=e;const t=b("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&((_g(Ze)||Ze==="strongest_lieutenants")&&(Ag(),Ze=""),lt==="live"&&(lt=Fs,Ga())),Yt()}function Lg(e){lt=e,Fs=e,Yt()}function Dg(e,t){Ze=e,nr.forEach(a=>{if(a!==t){const r=b(a);r&&(r.value="")}}),el(e)?(lt="live",Ga()):Ps(e)?(lt="alltime",Ga()):(lt=Fs,Ga()),Yt()}function el(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function Ps(e){return["max_short_term_fatigue","max_long_term_fatigue","max_combined_fatigue","max_s_form","max_r_form","max_combined_form","mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function _g(e){return el(e)||Ps(e)||e==="mentors_ranking"}function Ag(){nr.forEach(e=>{const t=b(e);t&&(t.value="")})}function Ga(){const e=b("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');lt==="live"?e.style.display="none":(e.style.display="flex",Ps(Ze)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),lt==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function Yt(){var u,m,f;const e=b("leaderboard-empty"),t=b("leaderboard-table"),a=b("leaderboard-thead"),r=b("leaderboard-tbody");if(!e||!t||!a||!r)return;const s=b("leaderboard-filter-container");if(s&&(s.style.display=At==="teams"?"none":"flex"),!Ze){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await V.getLeaderboards(At,Ze,lt);if(!xe("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(At==="riders"){const g=((u=b("leaderboard-filter-wt"))==null?void 0:u.checked)??!0,y=((m=b("leaderboard-filter-pt"))==null?void 0:m.checked)??!0,v=((f=b("leaderboard-filter-other"))==null?void 0:f.checked)??!1;if(i=n.data.filter(S=>{const T=S.teamDivisionId===1&&!S.isRetired,M=S.teamDivisionId===2&&!S.isRetired,x=S.teamDivisionId===null||S.teamDivisionId===void 0||S.isRetired||S.teamDivisionId!==1&&S.teamDivisionId!==2;return!!(T&&g||M&&y||x&&v)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const o=Ze==="highest_leadout_bonus",d=Ze==="strongest_lieutenants";At==="riders"?a.innerHTML=`
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
    `;let l="",p=1;for(const g of i){const y=p++,S=`<span class="badge ${y===1?"badge-primary":y<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${y}</span>`,T=Ct(g.teamId,g.teamName);let M="";if(o){const $=g.stageNumber!=null?`Etappe ${g.stageNumber}`:"–";M=`<td style="vertical-align: middle;">${k(g.raceName??"–")} · ${k($)} · ${k(String(g.season??"–"))}</td>`}let x="";if(d)if(g.lieutenantDetails){const $=g.lieutenantDetails,I=$.leaderNationality?oe($.leaderNationality):"",R=$.leaderRoleName?` (${$.leaderRoleName})`:"";x=`
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${I}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${$.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${k($.leaderFirstName)} ${k($.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${k(R)}</span>
            </span>
          </td>
        `}else x='<td style="vertical-align: middle;">–</td>';if(At==="riders"){const $=g.nationality?oe(g.nationality):"—",I=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${g.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${k(g.firstName)} ${k(g.lastName)}</a>`,R=g.teamAbbr?`<span class="text-muted" title="${k(g.teamName??"")}">${k(g.teamAbbr)}</span>`:"—";l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${S}</td>
          <td style="text-align: center; vertical-align: middle;">${T}</td>
          <td style="text-align: center; vertical-align: middle;">${$}</td>
          <td style="vertical-align: middle;">${I}</td>
          <td style="vertical-align: middle;">${R}</td>
          ${M}
          ${x}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${k(String(g.value))}</td>
        </tr>
      `}else{let $="";if(g.leadoutDetails){const I=g.leadoutDetails,R=I.sprinterNationality?oe(I.sprinterNationality):"";$=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">${k(g.teamName.split(" (Sprinter:")[0])}</div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${R}${k(I.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${I.contributors.map(P=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${P.nationality?oe(P.nationality):""}${k(P.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${P.contribution.toFixed(2)})</span>
                  </div>
                `).join("")}
            </div>
          </div>
        `}else $=`<strong>${k(g.teamName??"")}</strong>`;l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${S}</td>
          <td style="text-align: center; vertical-align: middle;">${T}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${$}</td>
          ${M}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${k(String(g.value))}</td>
        </tr>
      `}}r.innerHTML=l}let jt=2026,He=5,Xn=!1;const Bg=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function Qn(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${r}`}function Hg(e){var s;const t=(s=c.gameState)==null?void 0:s.currentDate;if(!t||e<=t)return;const a=ne(e);confirm(`Möchtest du automatisch bis zum ${a} simulieren?`)&&(c.autoProgressTargetDate=e,Oo())}function Gg(e,t){const a=[],r=new Date(e,t,1),s=new Date(e,t+1,0);let i=(r.getDay()+6)%7;const o=new Date(r);o.setDate(o.getDate()-i);const d=new Date(o);for(;d<=s||d.getDay()!==1;){const l=[];for(let p=0;p<7;p++)l.push(new Date(d)),d.setDate(d.getDate()+1);a.push(l)}return a}function zg(){if(Xn)return;Xn=!0,b("calendar-prev-month").addEventListener("click",()=>{He--,He<0&&(He=11,jt--),za()}),b("calendar-next-month").addEventListener("click",()=>{He++,He>11&&(He=0,jt++),za()}),b("calendar-today-btn").addEventListener("click",()=>{var t;if((t=c.gameState)!=null&&t.currentDate){const[a,r]=c.gameState.currentDate.split("-").map(Number);jt=a,He=r-1}za()}),b("calendar-race-search").addEventListener("input",()=>{tl()}),b("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&Vr(s);return}const r=t.target.closest("[data-calendar-date]");if(r){const s=r.dataset.calendarDate;s&&Hg(s)}}),b("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const s=Number(a.dataset.dashboardRaceId);Number.isFinite(s)&&Vr(s);return}const r=t.target.closest("button[data-dashboard-race-participants-id]");if(r){const s=Number(r.dataset.dashboardRaceParticipantsId);Number.isFinite(s)&&Ko(s)}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.remove("calendar-highlight")})}},!0))}function Kg(){var e;if((e=c.gameState)!=null&&e.currentDate){const[t,a]=c.gameState.currentDate.split("-").map(Number);jt=t,He=a-1}za()}function za(){var s;if(!xe("calendar"))return;b("calendar-month-label").textContent=`${Bg[He]} ${jt}`;const e=Gg(jt,He),t=b("calendar-weeks"),a=((s=c.gameState)==null?void 0:s.currentDate)??"";let r="";for(const n of e){const i=n.map(Qn),o=[];for(const u of c.races)if(u.startDate<=i[6]&&u.endDate>=i[0]){const m=u.startDate<i[0]?0:i.indexOf(u.startDate),f=u.endDate>i[6]?6:i.indexOf(u.endDate);o.push({race:u,startIdx:m,endIdx:f})}o.sort((u,m)=>{const f=u.endIdx-u.startIdx+1,g=m.endIdx-m.startIdx+1;return g!==f?g-f:u.startIdx-m.startIdx});const d=Array.from({length:3},()=>Array(7).fill(!1));for(const u of o){let m=2;for(let f=0;f<3;f++){let g=!0;for(let y=u.startIdx;y<=u.endIdx;y++)if(d[f][y]){g=!1;break}if(g){m=f;break}}for(let f=u.startIdx;f<=u.endIdx;f++)d[m][f]=!0;u.slot=m}const l=n.map(u=>{const m=Qn(u),f=u.getMonth()!==He,g=m===a,y=m>a;return`
        <div class="${["calendar-day-cell",f?"other-month":"",g?"today":"",y?"is-future":""].filter(Boolean).join(" ")}" data-calendar-date="${m}">
          <span class="calendar-day-number" data-calendar-date="${m}">${u.getDate()}</span>
        </div>
      `}).join(""),p=o.map(u=>{var M;const m=u.race,f=a>=m.startDate&&a<=m.endDate,g=a>m.endDate,y=dt((M=m.category)==null?void 0:M.name),v=f?'<span class="calendar-live-dot"></span>':"",S=g?"opacity: 0.55;":"",T=u.endIdx-u.startIdx+1;return`
        <div class="calendar-event-bar ${f?"is-live":""}"
             data-race-id="${m.id}"
             style="grid-column: ${u.startIdx+1} / span ${T};
                    grid-row: ${u.slot+1};
                    background-color: ${y.background};
                    border: 1px solid ${y.border};
                    color: ${y.color};
                    ${S}"
             title="${k(m.name)} (${ne(m.startDate)} - ${ne(m.endDate)})">
          ${v}<span class="calendar-event-name">${k(m.name)}</span>
        </div>
      `}).join("");r+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${p}</div>
      </div>
    `}t.innerHTML=r,tl()}function tl(){var n;const e=b("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=b("calendar-races-tbody"),r=((n=c.gameState)==null?void 0:n.currentDate)??"",s=c.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(s.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=s.map(i=>{var v,S,T,M;const o=r>=i.startDate&&r<=i.endDate,l=r>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',p=((v=i.country)==null?void 0:v.name)??`Land ${i.countryId}`,u=(S=i.country)!=null&&S.code3?oe(i.country.code3):"",m=i.isStageRace?(i.stages??[]).reduce((x,$)=>x+($.distanceKm??0),0):((T=i.upcomingStage)==null?void 0:T.distanceKm)??null,f=i.isStageRace?(i.stages??[]).reduce((x,$)=>x+($.elevationGainMeters??0),0):((M=i.upcomingStage)==null?void 0:M.elevationGainMeters)??null,g=m!=null?String(m.toFixed(1)).replace(".",","):"-",y=f!=null?String(Math.round(f)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${ne(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${k(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${ws(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${u}<span>${k(p)}</span></span></td>
        <td>${ur(i)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${i.id}">Teilnehmer</button></td>
        <td>${g}</td>
        <td>${y}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}let gt=null,ft=null,Ge="id",la=!0;function fr(e){const t=new Date(e);t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));const a=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t.getTime()-a.getTime())/864e5+1)/7)}function hr(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return"peak";const r=n=>{const i=n-8,o=n-1;if(i>=1)return t>=i&&t<=o;{const d=i+53;return t>=d||t<=o}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)?"prep":"none"}function al(e){return e==="peak"?"cell-peak":e==="prep"?"cell-prep":""}function Wg(e,t){const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),d=`${n}-${i}-${o}`,l=fr(d),p=hr(e,l);if(p==="peak"||p==="prep")return!0}return!1}function jg(e,t){const a=c.raceProgramsPayload;if(!a)return;const r=a.raceProgramRaces.findIndex(s=>s.program_id===e&&s.race_id===t);if(r===-1){const s=a.races.find(n=>n.id===t);if(s){const n=s.start_date,i=s.end_date,o=[];a.raceProgramRaces.forEach((d,l)=>{if(d.program_id===e&&d.race_id!==t){const p=a.races.find(u=>u.id===d.race_id);p&&p.start_date<=i&&p.end_date>=n&&o.push(l)}}),o.sort((d,l)=>l-d).forEach(d=>{a.raceProgramRaces.splice(d,1)})}a.raceProgramRaces.push({program_id:e,race_id:t})}else a.raceProgramRaces.splice(r,1);c.raceProgramsDirty=!0,Ce()}const Jr=(()=>{const e=[],t=new Date(2026,0,1),a=new Date(2026,11,31),r=["So","Mo","Di","Mi","Do","Fr","Sa"];for(let s=new Date(t);s<=a;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),d=`${n}-${i}-${o}`,l=`${r[s.getDay()]}, ${o}.${String(s.getMonth()+1).padStart(2,"0")}`;e.push({dateStr:d,label:l,weekNum:fr(d)})}return e})();async function Ns(e=!1){if(c.raceProgramsPayload&&!e){Ce();return}b("race-programs-root").innerHTML='<div class="results-empty">Programmdaten werden geladen...</div>';const t=await V.getRaceProgramsEditor();if(!t.success||!t.data){b("race-programs-root").innerHTML=`<div class="results-empty text-danger">${k(t.error??"Fehler beim Laden.")}</div>`;return}c.raceProgramsPayload=t.data,c.raceProgramsDirty=!1,c.raceProgramsSaving=!1,gt=null,ft=null,Ce()}function Og(){b("view-race-programs").addEventListener("click",e=>{const t=e.target,a=t.closest(".results-type-btn[data-tab]");if(a){const u=a.dataset.tab??"calendar-cols";c.raceProgramsActiveTab=u,Ce();return}const r=t.closest(".race-programs-action-btn");if(r){const u=r.dataset.action;u==="reload"?Ns(!0):u==="save"&&Zg();return}const s=t.closest(".race-row-expand-btn");if(s){const u=s.dataset.raceId,m=b(`race-details-row-${u}`);m&&(m.classList.toggle("hidden"),s.textContent=m.classList.contains("hidden")?"▶":"▼");return}const n=t.closest(".program-row-expand-btn");if(n){const u=n.dataset.programId,m=b(`program-details-row-${u}`);m&&(m.classList.toggle("hidden"),n.textContent=m.classList.contains("hidden")?"▶":"▼");return}const i=t.closest(".program-roles-sort-header");if(i){const u=i.dataset.sortKey;Ge===u?la=!la:(Ge=u,la=u==="name"||u==="id"),Ce();return}const o=t.closest(".combo-origin-trigger");if(o){const u=o.dataset.raceId,m=o.dataset.comboKey,f=b(`combo-origin-${u}-${m}`);f&&f.classList.toggle("hidden");return}const d=t.closest(".race-popover-trigger");if(d){e.stopPropagation();const u=parseInt(d.dataset.raceId??"0",10);ft=null,gt===u?gt=null:gt=u,Ce();return}const l=t.closest(".race-rider-count-trigger");if(l){e.stopPropagation();const u=parseInt(l.dataset.raceId??"0",10);gt=null,ft===u?ft=null:ft=u,Ce();return}const p=t.closest(".popover-program-toggle");if(p){if(e.stopPropagation(),p.classList.contains("disabled"))return;const u=parseInt(p.dataset.programId??"0",10),m=parseInt(p.dataset.raceId??"0",10);jg(u,m);return}!t.closest(".race-stages-popover-card")&&!t.closest(".race-rider-programs-popover-card")&&(gt!==null||ft!==null)&&(gt=null,ft=null,Ce())}),b("view-race-programs").addEventListener("click",e=>{const t=e.target.closest(".toggleable-race-cell[data-day]");if(!t)return;const a=t.dataset.day,r=parseInt(t.dataset.programId,10);Yg(r,a)}),b("view-race-programs").addEventListener("change",e=>{const t=e.target;if(t.classList.contains("peak-date-picker")){const a=parseInt(t.dataset.programId,10),r=parseInt(t.dataset.peak,10),s=t.value;if(s){const n=fr(s);Ug(a,r,n)}return}if(t.classList.contains("peak-number-input")){const a=parseInt(t.dataset.programId,10),r=t.dataset.field,s=parseInt(t.value||"1",10);Vg(a,r,s)}})}function Vg(e,t,a){const r=c.raceProgramsPayload;if(!r)return;const s=r.programs.find(i=>i.id===e);if(!s)return;const n=Math.max(1,Math.min(53,a));if(s[t]=n,t.endsWith("_min")){const i=t.replace("_min","_max");s[i]<n&&(s[i]=n)}else if(t.endsWith("_max")){const i=t.replace("_max","_min");s[i]>n&&(s[i]=n)}c.raceProgramsDirty=!0,Ce()}function Ug(e,t,a){const r=c.raceProgramsPayload;if(!r)return;const s=r.programs.find(o=>o.id===e);if(!s)return;const n=`peak${t}_min`,i=`peak${t}_max`;s[n]=Math.max(1,a-2),s[i]=Math.min(53,a+2),c.raceProgramsDirty=!0,Ce()}function Yg(e,t){const a=c.raceProgramsPayload;if(!a)return;const r=a.races.filter(n=>n.start_date<=t&&n.end_date>=t);if(r.length===0)return;const s=a.raceProgramRaces.findIndex(n=>n.program_id===e&&r.some(i=>i.id===n.race_id));if(s===-1)a.raceProgramRaces.push({program_id:e,race_id:r[0].id});else{const n=a.raceProgramRaces[s],i=r.findIndex(o=>o.id===n.race_id);i<r.length-1?n.race_id=r[i+1].id:a.raceProgramRaces.splice(s,1)}c.raceProgramsDirty=!0,Ce()}async function Zg(){if(!c.raceProgramsPayload||c.raceProgramsSaving)return;c.raceProgramsSaving=!0,Ce();const e=await V.saveRaceProgramsEditor({programs:c.raceProgramsPayload.programs,raceProgramRaces:c.raceProgramsPayload.raceProgramRaces});if(c.raceProgramsSaving=!1,!e.success){alert(`Fehler beim Speichern:
${e.error??"Unbekannter Fehler"}`),Ce();return}c.raceProgramsDirty=!1,Ns(!0)}function Ls(e,t){let a=0,r=0,s=0;const n=new Set(t.raceProgramRaces.filter(o=>o.program_id===e.id).map(o=>o.race_id)),i=t.races.filter(o=>n.has(o.id));for(const o of i){const d=new Date(o.start_date),l=new Date(o.end_date);for(let p=new Date(d);p<=l;p.setDate(p.getDate()+1)){const u=p.getFullYear(),m=String(p.getMonth()+1).padStart(2,"0"),f=String(p.getDate()).padStart(2,"0"),g=fr(`${u}-${m}-${f}`),y=hr(e,g);y==="peak"?a++:y==="prep"?r++:s++}}return{peak:a,prep:r,none:s}}function Ce(){const e=b("race-programs-root"),t=c.raceProgramsPayload;if(!t){e.innerHTML='<div class="results-empty">Keine Daten geladen.</div>';return}const a=c.raceProgramsDirty,r=c.raceProgramsSaving,s=c.raceProgramsActiveTab;let n=`
    <div class="race-programs-layout">
      <div class="race-programs-toolbar">
        <div class="results-type-tabs" style="margin: 0;">
          <button class="results-type-btn${s==="calendar-cols"?" active":""}" data-tab="calendar-cols">Kalender Programme (Spalten)</button>
          <button class="results-type-btn${s==="calendar-rows"?" active":""}" data-tab="calendar-rows">Kalender Programme (Zeilen)</button>
          <button class="results-type-btn${s==="peak-editor"?" active":""}" data-tab="peak-editor">Peak-Editor Programme</button>
          <button class="results-type-btn${s==="rider-role"?" active":""}" data-tab="rider-role">Rider-Role Programme</button>
          <button class="results-type-btn${s==="program-roles"?" active":""}" data-tab="program-roles">Programm-Rollen</button>
        </div>
        <div class="race-programs-actions">
          <button type="button" class="btn btn-secondary race-programs-action-btn" data-action="reload">Neu laden</button>
          <button type="button" class="btn btn-primary race-programs-action-btn" data-action="save" ${!a||r?"disabled":""}>
            ${r?"Speichert…":"Änderungen exportieren"}
          </button>
        </div>
      </div>
  `;s==="calendar-cols"?n+=Jg(t):s==="calendar-rows"?n+=qg(t):s==="peak-editor"?n+=Xg(t):s==="rider-role"?n+=ef(t):s==="program-roles"&&(n+=af(t)),n+="</div>",e.innerHTML=n}function Jg(e){var o,d,l;const t=e.programs,a=e.raceProgramRaces,r=e.races,s=t.map(p=>({id:p.id,stats:Ls(p,e)}));let n=`<tr>
    <th class="sticky-col-header" style="z-index: 15;">Tag / Datum</th>
    <th style="width: 50px; text-align: center;">KW</th>
  `;for(const p of t){const u=(o=s.find(m=>m.id===p.id))==null?void 0:o.stats;n+=`
      <th style="min-width: 140px; text-align: center;">
        <div style="font-weight: bold; font-size: 0.9rem;">${k(p.name)}</div>
        <div class="text-muted" style="font-size: 0.72rem; margin-top: 0.15rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${u==null?void 0:u.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${u==null?void 0:u.prep}</span> | 
          O: <span>${u==null?void 0:u.none}</span>
        </div>
      </th>
    `}n+="</tr>";let i="";for(const p of Jr){const u=r.filter(v=>v.start_date<=p.dateStr&&v.end_date>=p.dateStr),m=u.length>0,f=m?"row-has-races":"";let g="";if(m){g='<div style="display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.15rem;">';for(const v of u){const S=dt((d=v.category)==null?void 0:d.name);g+=`
          <span class="race-id-badge" style="background-color: ${S.background}; border: 1px solid ${S.border}; color: ${S.color}; font-size: 0.65rem; padding: 0.05rem 0.2rem; text-align: left; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${k(v.name)}">
            ${k(v.name)}
          </span>
        `}g+="</div>"}let y=`
      <td class="sticky-col ${f}" style="font-weight: 600; vertical-align: top; padding: 0.4rem 0.6rem;">
        <div>${p.label}</div>
        ${g}
      </td>
      <td style="text-align: center; color: var(--text-500); font-variant-numeric: tabular-nums; vertical-align: top; padding-top: 0.4rem;">${p.weekNum}</td>
    `;for(const v of t){const S=hr(v,p.weekNum),T=al(S),M=a.find(R=>R.program_id===v.id&&u.some(P=>P.id===R.race_id));let x="",$=`toggleable-race-cell ${T}`,I=`data-day="${p.dateStr}" data-program-id="${v.id}"`;if(M){const R=r.find(F=>F.id===M.race_id),P=dt((l=R==null?void 0:R.category)==null?void 0:l.name);x=`
          <span class="race-program-badge" style="background-color: ${P.background}; border: 1px solid ${P.border}; color: ${P.color};" title="${k(R==null?void 0:R.name)}">
            ${k(R==null?void 0:R.name)}
          </span>
        `}else m?x='<span class="race-cell-placeholder" title="Klicken zum Zuweisen">＋</span>':($=T,I="");y+=`<td class="${$}" ${I} style="text-align: center; vertical-align: middle;">${x}</td>`}i+=`<tr>${y}</tr>`}return`
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
  `}function qg(e){var f;const t=e.programs,a=e.raceProgramRaces,r=e.races;let s='<th class="sticky-col-header" style="z-index: 15;">Monat</th>',n='<th class="sticky-col-header" style="z-index: 15;">Tag / KW</th>',i='<th class="sticky-col-header" style="z-index: 15;">Rennen Anzahl</th>',o='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #1</th>',d='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #2</th>',l='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #3</th>';const p=[],u=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];for(const g of Jr){const y=parseInt(g.dateStr.split("-")[1],10)-1,v=u[y];p.length===0||p[p.length-1].name!==v?p.push({name:v,span:1}):p[p.length-1].span++;const S=r.filter(I=>I.start_date<=g.dateStr&&I.end_date>=g.dateStr),T=S.length>0,M=T?`${S.length} R`:"",x=T?"race-count-active":"";n+=`<th style="text-align: center; min-width: 40px; font-variant-numeric: tabular-nums;">
      <div style="font-size: 0.8rem; font-weight: bold;">${g.dateStr.split("-")[2]}</div>
      <div style="font-size: 0.65rem; color: var(--text-500);">W${g.weekNum}</div>
    </th>`,i+=`<th class="${x}" style="text-align: center; font-size: 0.72rem; font-weight: bold;">${M}</th>`;const $=I=>{var D;const R=S[I];if(!R)return"";const P=dt((D=R.category)==null?void 0:D.name),F=a.filter(B=>B.race_id===R.id).length;return`
        <span class="race-id-badge" style="background-color: ${P.background}; border: 1px solid ${P.border}; color: ${P.color}; cursor: help;" 
              title="${k(R.name)}
Zugelassene Programme: ${F}">
          R${R.id}
        </span>
      `};o+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(0)}</th>`,d+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(1)}</th>`,l+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(2)}</th>`}for(const g of p)s+=`<th colspan="${g.span}" style="text-align: center; font-weight: bold; border-left: 1px solid var(--border);">${g.name}</th>`;let m="";for(const g of t){const y=Ls(g,e);let v=`
      <td class="sticky-col" style="z-index: 5; white-space: nowrap; font-weight: bold; border-right: 2px solid var(--border);">
        <div style="font-size: 0.85rem;">${k(g.name)}</div>
        <div class="text-muted" style="font-size: 0.7rem; font-weight: normal; margin-top: 0.1rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${y.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${y.prep}</span> | 
          O: <span>${y.none}</span>
        </div>
      </td>
    `;for(const S of Jr){const T=hr(g,S.weekNum),M=al(T),x=r.filter(D=>D.start_date<=S.dateStr&&D.end_date>=S.dateStr),$=x.length>0,I=a.find(D=>D.program_id===g.id&&x.some(B=>B.id===D.race_id));let R="",P=`toggleable-race-cell ${M}`,F=`data-day="${S.dateStr}" data-program-id="${g.id}"`;if(I){const D=r.find(H=>H.id===I.race_id),B=dt((f=D==null?void 0:D.category)==null?void 0:f.name);R=`
          <span class="race-id-badge" style="background-color: ${B.background}; border: 1px solid ${B.border}; color: ${B.color};" title="${k(D==null?void 0:D.name)}">
            R${D==null?void 0:D.id}
          </span>
        `}else $?R='<span style="font-size: 0.72rem; color: var(--text-500); opacity: 0.5;">＋</span>':(P=M,F="");v+=`<td class="${P}" ${F} style="text-align: center; vertical-align: middle; padding: 0.35rem 0;">${R}</td>`}m+=`<tr>${v}</tr>`}return`
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
  `}function Xg(e){return`
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
        <td style="font-weight: bold; min-width: 150px;">${k(r.name)}</td>
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
  `}function Qg(e,t){const a=t.filter(o=>o.race_id===e).sort((o,d)=>o.stage_number-d.stage_number);if(a.length===0)return{countHtml:"Keine Etappen",stagesListHtml:"Keine Etappendaten vorhanden."};const r={};for(const o of a)r[o.profile]=(r[o.profile]||0)+1;const n=Object.entries(r).sort((o,d)=>d[1]-o[1]).map(([o,d])=>`${k(o)}: ${d}x`).join("<br>"),i=a.map(o=>`
    <div class="popover-stage-row">
      <span class="popover-stage-num">Et. ${o.stage_number}:</span>
      <span class="popover-stage-profile">${k(o.profile)}</span>
    </div>
  `).join("");return{countHtml:n,stagesListHtml:i}}function ef(e){const t=[...e.races].sort((i,o)=>i.start_date.localeCompare(o.start_date)),a=e.raceProgramRaces,r=e.stages,s=e.programDistribution;return`
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
            ${t.map(i=>{const o=new Set(a.filter(h=>h.race_id===i.id).map(h=>h.program_id)),d=s.filter(h=>o.has(h.program_id)),p=e.programs.map(h=>{const C=a.some(tt=>tt.program_id===h.id&&tt.race_id===i.id),N=s.find(tt=>tt.program_id===h.id),z=N?parseInt(N.deterministic_rider_count||"0",10):0,ae=N?parseInt(N.deterministic_role_Kapitaen||"0",10):0,le=N?parseInt(N.deterministic_role_Co_Kapitaen||"0",10):0,me=N?parseInt(N.deterministic_role_Edelhelfer||"0",10):0,pe=N?parseInt(N.deterministic_role_Starke_Helfer||"0",10):0,ge=N?parseInt(N.deterministic_role_Wassertraeger||"0",10):0,Fe=N?parseInt(N.deterministic_role_Sprinter||"0",10):0,de=[];ae>0&&de.push(`${ae} Kapitän`),le>0&&de.push(`${le} Co-Kapitän`),me>0&&de.push(`${me} Edelhelfer`),pe>0&&de.push(`${pe} Starke Helfer`),ge>0&&de.push(`${ge} Wasserträger`),Fe>0&&de.push(`${Fe} Sprinter`);const kt=de.length>0?`(${de.join(", ")})`:"";return{program:h,isAssigned:C,count:z,rolesStr:kt}}).sort((h,C)=>C.count-h.count).map(h=>{const C=h.program,N=Wg(C,i);let z="";N||(z='<span style="color: #fb923c; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(251, 146, 60, 0.15); border: 1px solid #fb923c; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb der Peak- und Aufbauphase dieses Programms!">!</span>');const ae=h.isAssigned?"font-weight: bold; color: var(--text-100);":"color: var(--text-500);",le=h.isAssigned?"☑":"☐",me=N||h.isAssigned,pe=me?"cursor: pointer;":"cursor: not-allowed; opacity: 0.4; pointer-events: none;";return`
        <div class="popover-program-toggle${me?"":" disabled"}" data-program-id="${C.id}" data-race-id="${i.id}" 
             style="${pe} padding: 0.45rem 0.6rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); transition: background-color 0.15s; white-space: nowrap;"
             onmouseover="${me?"this.style.backgroundColor='rgba(99, 102, 241, 0.08)'":""}"
             onmouseout="this.style.backgroundColor='transparent'">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
            <span style="font-size: 1.15rem; line-height: 1; user-select: none; color: ${h.isAssigned?"var(--accent-h)":"var(--text-500)"};">${le}</span>
            <span style="${ae} font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis;" title="${k(C.name)}">
              ${k(C.name)}
            </span>
            ${z}
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;">
            <strong style="font-size: 0.8rem; color: var(--accent-h);">${h.count} Fahrer</strong>
            <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal;" title="${k(h.rolesStr)}">${k(h.rolesStr)}</span>
          </div>
        </div>
      `}).join(""),u=ft===i.id;let m=0,f=0,g=0,y=0,v=0,S=0,T=0;const M={Kapitaen:{},Co_Kapitaen:{},Sprinter:{},Edelhelfer:{},Starke_Helfer:{},Wassertraeger:{}},x=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],$=["Berg","Hill","Sprint","Timetrial","Cobble","Attacker"];for(const h of d){m+=parseInt(h.deterministic_rider_count||"0",10),f+=parseInt(h.deterministic_role_Kapitaen||"0",10),g+=parseInt(h.deterministic_role_Co_Kapitaen||"0",10),y+=parseInt(h.deterministic_role_Sprinter||"0",10),v+=parseInt(h.deterministic_role_Edelhelfer||"0",10),S+=parseInt(h.deterministic_role_Starke_Helfer||"0",10),T+=parseInt(h.deterministic_role_Wassertraeger||"0",10);for(const C of x)for(const N of $){const z=`deterministic_${C}_spec1_${N}`,ae=parseInt(h[z]||"0",10);M[C][N]=(M[C][N]||0)+ae}}let I=0;i.is_stage_race===1&&(I=r.filter(C=>C.race_id===i.id).filter(C=>{const N=(C.profile||"").toLowerCase();return N==="flat"||N==="rolling"}).length);let R=!1,P=0;if(i.is_stage_race===0){const h=r.find(N=>N.race_id===i.id),C=((h==null?void 0:h.profile)||"").toLowerCase();R=C==="cobble"||C==="cobble_hill",R&&(P=(e.roleSpecCombinations||[]).filter(z=>o.has(z.program_id)).filter(z=>z.spec1==="Cobble"||z.spec2==="Cobble"||z.spec3==="Cobble").reduce((z,ae)=>z+ae.count,0))}let F="<strong>Rennprogramme verwalten</strong>";i.is_stage_race===0&&R?F=`
        <strong>Rennprogramme verwalten 
          (<span style="color: ${P<20?"#ef4444":"var(--accent-h)"}; font-weight: bold;" title="Kopfsteinpflaster-Spezialisten: ${P} / min. 20">Gesamtfahrer: ${m}</span>)
        </strong>
      `:F=`<strong>Rennprogramme verwalten (Gesamtfahrer: ${m})</strong>`;const D=`
      <div class="race-rider-programs-popover-card ${u?"":"hidden"}"
           style="position: absolute; top: calc(100% + 0.45rem); right: 0; z-index: 120; min-width: 600px; max-width: 750px; padding: 0.8rem 0.9rem; border: 1px solid rgba(148, 163, 184, 0.18); border-radius: var(--radius-md); background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%); box-shadow: var(--shadow); text-align: left; font-weight: normal;">
        <div class="popover-head" style="border-bottom: 1px solid rgba(148, 163, 184, 0.12); padding-bottom: 0.4rem; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
          ${F}
          <span style="font-size: 0.65rem; font-weight: normal; color: var(--text-500);">Klicken zum Aktivieren</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.2rem; max-height: 350px; overflow-y: auto;">
          ${p}
        </div>
      </div>
    `;let B="text-align: center; font-variant-numeric: tabular-nums;";i.is_stage_race===1&&I>=2&&(y<=7?B+=" background-color: rgba(239, 68, 68, 0.2); color: #ef4444; font-weight: bold;":y>7&&y<10&&(B+=" background-color: rgba(234, 179, 8, 0.2); color: #eab308; font-weight: bold;"));let H="position: relative; text-align: center; font-variant-numeric: tabular-nums; vertical-align: middle;",K="font-weight: bold; border: none; background: transparent; padding: 0.15rem 0.4rem; cursor: pointer; color: var(--accent-h); text-decoration: underline;";i.is_stage_race===0&&R&&P<20&&(H+=" background-color: rgba(239, 68, 68, 0.2);",K+=" color: #ef4444; font-weight: bold;");const w=`
      <button type="button" class="race-rider-count-trigger btn-link" data-race-id="${i.id}" 
              style="${K}">
        ${m}
      </button>
    `;let A="—";if(i.is_stage_race===0){const h=r.find(C=>C.race_id===i.id);A=(h==null?void 0:h.profile)??"Flat"}let U="",W=`<strong>${k(i.name)}</strong>`;if(i.is_stage_race===1){const h=gt===i.id,{countHtml:C,stagesListHtml:N}=Qg(i.id,r);U=`
        <div class="race-stages-popover-card ${h?"":"hidden"}">
          <div class="popover-head"><strong>${k(i.name)}</strong> - Etappen</div>
          <div class="popover-stages-list">${N}</div>
          <div class="popover-separator"></div>
          <div class="popover-head">Profile Zusammenfassung</div>
          <div class="popover-profiles-summary">${C}</div>
        </div>
      `,W=`
        <button type="button" class="race-popover-trigger btn-link" data-race-id="${i.id}" style="text-align: left; font-weight: bold; border: none; background: transparent; padding: 0; cursor: pointer; color: var(--accent-h);">
          ${k(i.name)}
        </button>
      `}let te=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"];if(i.is_stage_race===0){const h=r.find(N=>N.race_id===i.id),C=((h==null?void 0:h.profile)??"").toLowerCase();C.includes("cobble")?te=["Cobble","Sprint","Hill","Attacker","Timetrial","Berg"]:(C.includes("flat")||C.includes("rolling"))&&(te=["Sprint","Timetrial","Attacker","Hill","Cobble","Berg"])}const J=[],Q=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],Y={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},j={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},L=(e.roleSpecCombinations||[]).filter(h=>o.has(h.program_id)),_=new Map;for(const h of L){const C=h.spec2||"—",N=`${h.role}|${h.spec1}|${C}`;_.set(N,(_.get(N)||0)+h.count)}const E=[..._.entries()].map(([h,C])=>{const[N,z,ae]=h.split("|");return{role:N,spec1:z,spec2:ae,count:C}}).sort((h,C)=>{const N=Q.indexOf(h.role)-Q.indexOf(C.role);if(N!==0)return N;const z=te.indexOf(h.spec1)-te.indexOf(C.spec1);return z!==0?z:C.count-h.count}),O=(h,C)=>{const N=j[h]??h,z=C!=="—"?j[C]??C:"—";return`${N} / ${z}`};for(const h of E)if(h.count>0){const C=h.spec1==="Berg"&&h.spec2==="Cobble"||h.spec1==="Cobble"&&h.spec2==="Berg",N=C?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",z=C?"color: #f97316; font-weight: bold;":"color: var(--text-100);",ae=C?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",le=`${h.role}_${h.spec1}_${h.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`,pe=L.filter(ge=>ge.role===h.role&&ge.spec1===h.spec1&&(ge.spec2||"—")===h.spec2).map(ge=>{const Fe=e.programs.find(de=>de.id===ge.program_id);return`<span style="white-space: nowrap; margin-right: 0.8rem;">${k((Fe==null?void 0:Fe.name)??"Unbekannt")}: <strong>${ge.count}</strong></span>`}).join(" ");J.push(`
          <div style="${N}">
            <span style="${z}">${Y[h.role]||h.role} <span class="text-muted">(${O(h.spec1,h.spec2)})</span></span>
            <strong style="${ae} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="${i.id}" data-combo-key="${le}">
              ${h.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-${i.id}-${le}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: ${pe}
          </div>
        `)}const G=J.length>0?J.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost race-row-expand-btn" data-race-id="${i.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td>${ne(i.start_date)}</td>
        <td class="race-programs-popup-anchor" style="position: relative; vertical-align: middle;">
          ${W}
          ${U}
        </td>
        <td style="font-weight: bold; color: var(--accent-h); text-align: center;">${A}</td>
        <td class="race-programs-popup-anchor" style="${H}">
          ${w}
          ${D}
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${f}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${g}</td>
        <td style="${B}">${y}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${v}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${S}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${T}</td>
      </tr>
      <tr id="race-details-row-${i.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
        <td colspan="11" style="padding: 0.5rem 1.5rem;">
          <div style="max-width: 450px; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
            <div style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; font-weight: bold; background: rgba(99,102,241,0.08); color: var(--text-100);">Zusammensetzung (Rolle / Spezialisierung)</div>
            ${G}
          </div>
        </td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function rl(e){return Ge!==e?'<span style="opacity:0.35; margin-left:4px;">↕</span>':`<span style="color:var(--accent-h); margin-left:4px; font-weight:bold;">${la?"↑":"↓"}</span>`}function st(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${Ge===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
        <span>${k(t)}</span>
        ${rl(e)}
      </div>
    </th>
  `}function tf(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${Ge===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: flex-start; gap: 2px;">
        <span>${k(t)}</span>
        ${rl(e)}
      </div>
    </th>
  `}function af(e){const t=e.programs,a=e.roleSpecCombinations||[],r={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},s={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},n=t.map(o=>{const d=a.filter(f=>f.program_id===o.id);let l=0;const p={Kapitaen:0,Co_Kapitaen:0,Sprinter:0,Edelhelfer:0,Starke_Helfer:0,Wassertraeger:0};for(const f of d)l+=f.count,p[f.role]!==void 0&&(p[f.role]+=f.count);const u=Ls(o,e),m=u.peak+u.prep+u.none;return{program:o,totalRiders:l,roleCounts:p,progCombos:d,raceDays:m}});n.sort((o,d)=>{let l=0;return Ge==="id"?l=o.program.id-d.program.id:Ge==="name"?l=o.program.name.localeCompare(d.program.name):Ge==="total"?l=o.totalRiders-d.totalRiders:Ge==="raceDays"?l=o.raceDays-d.raceDays:l=(o.roleCounts[Ge]||0)-(d.roleCounts[Ge]||0),l===0&&(l=o.program.id-d.program.id),la?l:-l});const i=n.map(o=>{const d=o.program,l=o.progCombos,p=o.totalRiders,u=o.roleCounts,m=o.raceDays,f=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],g=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"],y=new Map;for(const x of l){const $=x.spec2||"—",I=`${x.role}|${x.spec1}|${$}`;y.set(I,(y.get(I)||0)+x.count)}const v=[...y.entries()].map(([x,$])=>{const[I,R,P]=x.split("|");return{role:I,spec1:R,spec2:P,count:$}}).sort((x,$)=>{const I=f.indexOf(x.role)-f.indexOf($.role);if(I!==0)return I;const R=g.indexOf(x.spec1)-g.indexOf($.spec1);return R!==0?R:$.count-x.count}),S=(x,$)=>{const I=s[x]??x,R=$!=="—"?s[$]??$:"—";return`${I} / ${R}`},T=[];for(const x of v)if(x.count>0){const $=x.spec1==="Berg"&&x.spec2==="Cobble"||x.spec1==="Cobble"&&x.spec2==="Berg",I=$?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",R=$?"color: #f97316; font-weight: bold;":"color: var(--text-100);",P=$?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",F=`${x.role}_${x.spec1}_${x.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`;T.push(`
          <div style="${I}">
            <span style="${R}">${r[x.role]||x.role} <span class="text-muted">(${S(x.spec1,x.spec2)})</span></span>
            <strong style="${P} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="prog-${d.id}" data-combo-key="${F}">
              ${x.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-prog-${d.id}-${F}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: <span style="white-space: nowrap; margin-right: 0.8rem;">${k(d.name)}: <strong>${x.count}</strong></span>
          </div>
        `)}const M=T.length>0?T.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost program-row-expand-btn" data-program-id="${d.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td style="font-weight: bold; color: var(--text-100);">${d.id}</td>
        <td style="font-weight: bold; min-width: 150px;">${k(d.name)}</td>
        <td style="text-align: center; font-weight: bold; color: var(--accent-h); font-variant-numeric: tabular-nums;">${p}</td>
        <td style="text-align: center; font-weight: bold; color: var(--text-100); font-variant-numeric: tabular-nums;">${m}</td>
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
            ${M}
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
              ${st("id","ID","width: 50px;")}
              ${tf("name","Programm")}
              ${st("total","Fahrer gesamt","width: 110px; text-align: center; font-weight: bold;")}
              ${st("raceDays","Renntage","width: 100px; text-align: center; font-weight: bold;")}
              ${st("Kapitaen","Kapitän","width: 90px; text-align: center;")}
              ${st("Co_Kapitaen","Co-Kapitän","width: 90px; text-align: center;")}
              ${st("Sprinter","Sprinter","width: 90px; text-align: center;")}
              ${st("Edelhelfer","Edelhelfer","width: 90px; text-align: center;")}
              ${st("Starke_Helfer","Starke Helfer","width: 100px; text-align: center;")}
              ${st("Wassertraeger","Wasserträger","width: 100px; text-align: center;")}
            </tr>
          </thead>
          <tbody>
            ${i.join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.openTeamStats=Qo;async function sl(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}Xr("game"),b("meta-career").textContent=((e=c.currentSave)==null?void 0:e.careerName)??"",Nt("dashboard"),Te("Spiel wird geladen…");try{await Ms(),await Rs(),pr()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{Se()}}function rf(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";Nt(t),t==="dashboard"&&pr(),t==="teams"&&ar(),t==="riders"&&ar(),t==="rider-team-editor"&&qo(),t==="live-race"&&Wt(),t==="results"&&Me(),t==="draft"&&Xo(c.draftSelectedSeason||((a=c.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&gg(),t==="season-standings"&&vg(),t==="leaderboards"&&Pg(),t==="calendar"&&Kg(),t==="race-programs"&&Ns(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&fo()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&Ut(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&Qo(a)}),b("btn-cancel-new").addEventListener("click",()=>Ve("newCareer")),b("btn-close-race-stages").addEventListener("click",()=>Ve("raceStages")),b("btn-close-stage-profile").addEventListener("click",()=>Ve("stageProfile")),b("btn-close-rider-program").addEventListener("click",()=>Ve("riderProgram")),b("btn-close-rider-stats").addEventListener("click",()=>Ve("riderStats")),b("btn-close-team-stats").addEventListener("click",()=>Ve("teamStats")),b("btn-close-race-participants").addEventListener("click",()=>Ve("raceParticipants")),b("btn-close-roster-editor").addEventListener("click",()=>Or()),b("btn-cancel-roster-editor").addEventListener("click",()=>Or()),b("btn-apply-roster-editor").addEventListener("click",()=>{Np()}),b("btn-back-menu").addEventListener("click",()=>{ta==null||ta.pause(),Xr("menu"),ma()}),xl(),Zp(),zg(),Po(),Zo(),pg(),Lp(),Rp(),Jm(),mp(),Eg(),Sg(),Fg(),Og()}(async()=>(km(),he(),rf(),Xr("menu"),await ma()))();
