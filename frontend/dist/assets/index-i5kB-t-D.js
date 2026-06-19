(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();function ti(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Dr(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function ct(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function lr(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function De(e,t={}){const a=t.strong===!1?"span":"strong",r=Dr("app-rider-link-label",t.labelClassName),s=`<${a} class="${r}">${ti(e)}</${a}>`;if(t.riderId==null)return s;const n=['type="button"','class="'+Dr("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${s}</button>`}function it(e,t,a=!0,r=""){const s=a===!1?"span":"strong",n=`<${s} class="app-team-link-label">${ti(e)}</${s}>`;return t==null?n:`<button type="button" class="${Dr("app-team-link",r)}" data-team-id="${t}">${n}</button>`}function ai(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function ri(e){return Math.round(e*10)/10}function si(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function ni(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function ii(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function il(e,t){return e.skills.stamina*(t/300)}function oi(e,t,a){return e.skills.timeTrial+ii(e,t)+e.skills.mountain*(a/500)}function ol(e,t,a,r){const s=il(e,a),n=ii(e,r);switch(t.profile){case"Flat":return .8*e.skills.sprint+.15*e.skills.acceleration+.05*e.skills.flat+n+s;case"Rolling":return .7*e.skills.sprint+.2*e.skills.acceleration+.1*e.skills.hill+n+s;case"Hilly":return .45*e.skills.sprint+.1*e.skills.flat+.45*e.skills.hill+n+s;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+s;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+s;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+s;case"High_Mountain":return e.skills.mountain+n+s;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+s;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+s;default:return .8*e.skills.sprint+.2*e.skills.flat+n+s}}function ll(e,t,a,r,s){return t.profile==="ITT"||t.profile==="TTT"?oi(e,s,r):ol(e,t,a,s)}function dl(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:ri(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function li(e,t,a,r){si(a,r);const s=ni(a,r),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const p=o.get(l.activeTeamId)??[];p.push(l),o.set(l.activeTeamId,p)}return[...o.entries()].map(([l,p])=>{const u=n.get(l),f=p.map(y=>oi(y,ai(y.id,r==null?void 0:r.dailyFormByRiderId),s)).sort((y,T)=>T-y).slice(0,5),g=f.length,b=g>0?f.reduce((y,T)=>y+T,0)/g:0,v=Math.max(0,5-g)*2;return{team:u??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:b-v}}).sort((l,p)=>p.score-l.score||l.team.id-p.team.id).slice(0,20).map((l,p)=>({rank:p+1,kind:"team",effectiveSkill:ri(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(r!=null?ja(e,t,a,r):ja(e,t,a)).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id).slice(0,20).map((o,d)=>dl(o,d+1))}function ja(e,t,a,r){const s=si(a,r),n=ni(a,r),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var d;return{rider:o,teamName:o.activeTeamId!=null?((d=i.get(o.activeTeamId))==null?void 0:d.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:ll(o,a,s,n,ai(o.id,r==null?void 0:r.dailyFormByRiderId))}}).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id)}const c={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,draftHistory:null,injuries:null,draftSelectedSeason:null,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1,autoProgressTargetDate:null,raceProgramsPayload:null,raceProgramsActiveTab:"calendar-cols",raceProgramsDirty:!1,raceProgramsSaving:!1};let ra=null;function cl(e){ra=e}let es=!1;function Bs(e){es=e}let di=null;function Hs(e){di=e}let _r=null;function Gs(e){_r=e}let ut=!1;function ci(e){ut=e}function h(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function oe(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function Oa(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),r=Math.floor(e%60),s=String(a).padStart(2,"0"),n=String(r).padStart(2,"0");return t>0?`${t}:${s}:${n}`:`${a}:${n}`}function kr(e){return e==null||e===0?"–":`+${Oa(e)}`}const Ba=2,Ar=3,ui=4;function mi(e){return`/jersey/Jer_${e}.png`}function Ft(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((r=c.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${S(a)}" aria-label="${S(a)}">
      <img
        class="results-team-jersey-img"
        src="${S(mi(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Qt(e,t){return`<span class="results-jersey-cell">${Ft(e,t)}</span>`}function ot(e){return e&&de(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function zt(e){var a;if(e==null)return null;const t=Re(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function Re(e){return e==null?null:c.riders.find(t=>t.id===e)??null}function St(e){return e==null?null:c.races.find(t=>t.id===e)??null}function Va(e){var t;if(e==null)return null;for(const a of c.races){const r=(t=a.stages)==null?void 0:t.find(s=>s.id===e);if(r)return{race:a,stage:r}}return null}function ea(e,t=!0,a=!1,r=null,s=null){const n=De(e,{riderId:r,teamId:s,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function ul(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function Br(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function ml(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function pl(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}const Ze={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function de(e){const t=Ze[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function gl(e,t){return e?`<span class="country-chip">${de(e.code3)}<span>${S(e.name)}</span></span>`:t?S(t):"–"}function Hr(e){return`${e.toFixed(2).replace(".",",")} km`}function Gr(e){return`${Math.round(e)} hm`}const fl=new Set;function ts(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),h(`screen-${e}`).classList.remove("hidden")}function qe(e){h(`modal-${e}`).classList.remove("hidden")}function Ue(e){h(`modal-${e}`).classList.add("hidden")}function zs(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function pi(){var l,p;const e=c.realtimeBootstrap;if(!e)return;const t=h("instant-sim-favorites"),a=h("instant-sim-gc");if(!t||!a)return;const s=li(e.riders,e.teams,e.stage,{distanceKm:(l=e.stageSummary)==null?void 0:l.distanceKm,elevationGainMeters:(p=e.stageSummary)==null?void 0:p.elevationGainMeters}).slice(0,10),n=new Map(e.gcStandings.map(u=>[u.riderId,u]));let i=`
    <h3>
      <span>Etappen-Favoriten</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const u of s){const m=e.riders.find(R=>R.id===u.riderId);if(!m)continue;const f=zt(m.id)??"un",g=Ze[f]??"un",b=e.teams.find(R=>R.id===m.activeTeamId),v=(b==null?void 0:b.abbreviation)??"—",y=n.get(m.id),T=y?`GC ${y.rank} (${y.rank===1?"Gelb":zs(y.gapSeconds)})`:"GC –";i+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${m.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${u.rank}</span>
            <span class="fi fi-${g} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${S(m.firstName)} <strong>${S(m.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(v)}</span>
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
  `;for(const u of o){const m=e.riders.find(T=>T.id===u.riderId);if(!m)continue;const f=zt(m.id)??"un",g=Ze[f]??"un",b=e.teams.find(T=>T.id===m.activeTeamId),v=(b==null?void 0:b.abbreviation)??"—",y=u.rank===1?"Gelb":zs(u.gapSeconds);d+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${m.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${u.rank}</span>
            <span class="fi fi-${g} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${S(m.firstName)} <strong>${S(m.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(v)}</span>
            <span class="instant-sim-gc-info">${y}</span>
          </div>
        </div>
      </div>
    `}d+="</div>",a.innerHTML=d}function Me(e="Lade…"){var r;const t=ut?" (Leertaste zum Stoppen)":"",a=h("default-loader");a&&(h("loading-msg").textContent=e+t,h("loading-progress").classList.add("hidden"),a.classList.remove("hidden"),(r=h("instant-sim-panel"))==null||r.classList.add("hidden")),h("loading-overlay").classList.remove("hidden")}function $e(){h("loading-overlay").classList.add("hidden")}function hl(e){var t,a;if((t=h("default-loader"))==null||t.classList.add("hidden"),(a=h("instant-sim-panel"))==null||a.classList.remove("hidden"),h("loading-overlay").classList.remove("hidden"),c.realtimeBootstrap)pi();else{const r=h("instant-sim-favorites"),s=h("instant-sim-gc");r&&(r.innerHTML=""),s&&(s.innerHTML="")}gi(e)}function gi(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),r=`Instant-Simulation läuft … ${t}%${ut?" (Leertaste zum Stoppen)":""}`,s=h("loading-msg");s&&(s.textContent=r);const n=h("loading-progress-bar");n&&(n.style.width=`${t}%`);const i=h("instant-loading-msg");i&&(i.textContent=r);const o=h("instant-loading-progress-bar");o&&(o.style.width=`${t}%`);const d=h("instant-sim-favorites");d&&d.innerHTML.trim()===""&&c.realtimeBootstrap&&pi()}function It(e,t){const a=h(e);a.textContent=t,a.classList.remove("hidden")}function ua(e){h(e).classList.add("hidden")}function Dt(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),h(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),h("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of fl)try{a(e)}catch(r){console.error(`Fehler bei View-Aktivierung von "${e}":`,r)}}function we(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function sa(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function fi(e,t,a){return Math.max(t,Math.min(a,e))}function $r(e,t,a){return Math.round(e+(t-e)*a)}function Ks(e,t,a){return`rgb(${$r(e[0],t[0],a)} ${$r(e[1],t[1],a)} ${$r(e[2],t[2],a)})`}function as(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=fi(e,t[0].value,t[t.length-1].value);for(let r=1;r<t.length;r+=1){const s=t[r-1],n=t[r];if(a<=n.value){const i=(a-s.value)/(n.value-s.value);return Ks(s.color,n.color,i)}}return Ks(t[t.length-1].color,t[t.length-1].color,1)}function hi(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${as(e)}"${a}>${e.toFixed(2)}</span>`}function bl(e,t,a){if(t==null)return hi(e,a);const r=Math.round((e-t)*100)/100,s=r>0?"skill-delta-positive":r<0?"skill-delta-negative":"skill-delta-neutral",n=r>0?"+":"",i=`<span class="skill-delta ${s}">${n}${r.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${as(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function vl(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function Ws(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",r=t>0?"+":"";return`<span class="${a}">${r}${t.toFixed(1).replace(".",",")}</span>`}function js(e,t="none",a){const r=e??0,s=["race-sim-form-negative"];t==="warning"&&s.push("load-warning"),t==="critical"&&s.push("load-warning-critical");const n=a?` title="${S(a)}"`:"";return r===0?`<span class="${s.join(" ")}"${n}>0,0</span>`:`<span class="${s.join(" ")}"${n}>-${r.toFixed(1).replace(".",",")}</span>`}function bi(e){const t=e.seasonFormPhase??"neutral";return vi(t)}function vi(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${S(a.label)}">${a.symbol}</span>`}function yl(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${S(e.seasonProgram.name)}</button>`:"–"}function Pt(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function _e(e){return`${e.lastName} ${e.firstName}`}function Sl(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,r=e.unavailableUntil?` bis ${oe(e.unavailableUntil)}`:"",s=`${t}: noch ${a} Tag${a===1?"":"e"}${r}`;return`<span class="rider-availability-marker" title="${S(s)}" aria-label="${S(s)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function yt(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function zr(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=e,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(r)}async function J(e,t,a){try{const r=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(r.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await r.text();return{success:!1,error:r.ok?"Antwort war kein JSON.":`HTTP ${r.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return r.json()}catch(r){return{success:!1,error:`Netzwerkfehler: ${r.message}`}}}const V={listSaves:()=>J("GET","/api/saves"),createSave:(e,t,a)=>J("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>J("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>J("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>J("GET","/api/teams/available"),getTeams:()=>J("GET","/api/teams"),getTeam:e=>J("GET",`/api/teams/${e}`),getTeamStats:e=>J("GET",`/api/teams/${e}/stats`),getRiders:e=>J("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRiderStats:(e,t=!1)=>J("GET",`/api/riders/${e}/stats${t?"?excludeFatigue=true":""}`),getRiderProgramRaces:e=>J("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>J("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>J("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>J("POST","/api/rider-team-editor/export",e),getRaces:()=>J("GET","/api/races"),getRaceProgramParticipants:e=>J("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>J("GET",`/api/races/${e}/results-roster`),getGameState:()=>J("GET","/api/state"),getGameStatus:()=>J("GET","/api/game/status"),getStageSummary:e=>J("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>J("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>J("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>J("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>J("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>J("POST","/api/state/advance"),getStageResults:e=>J("GET",`/api/results/${e}`),getSeasonStandings:()=>J("GET","/api/season-standings"),listStageEditorStages:()=>J("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>J("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>J("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>J("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>J("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>J("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>J("POST","/api/stage-editor/import",e),exportStageRoute:e=>J("POST","/api/stage-editor/export",e),getInjuries:()=>J("GET","/api/injuries"),getDraftHistory:e=>J("GET",`/api/draft/${e}`),getLeaderboards:(e,t,a)=>J("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`),getRaceProgramsEditor:()=>J("GET","/api/race-programs-editor"),saveRaceProgramsEditor:e=>J("POST","/api/race-programs-editor/save",e)};async function ga(){const e=await V.listSaves(),t=h("saves-list"),a=h("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(r=>`
    <div class="save-card">
      <h3>${S(r.careerName)}</h3>
      <p class="save-meta">
        ${S(r.teamName)} · Saison ${r.currentSeason}
        ${r.lastSaved?"· "+oe(r.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${S(r.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${S(r.filename)}" data-career-name="${S(r.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function kl(e){Me("Karriere wird geladen…");const t=await V.loadSave(e);if($e(),!t.success){alert("Fehler beim Laden: "+t.error);return}c.currentSave=t.data??null,await nl()}async function $l(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;Me("Löschen…");const a=await V.deleteSave(e);if($e(),!a.success){alert("Fehler: "+a.error);return}await ga()}async function xl(){const e=await V.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){h("btn-delete-all-careers").classList.add("hidden"),h("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){Me("Alle Karrieren werden gelöscht…");try{for(const a of t){const r=await V.deleteSave(a.filename);if(!r.success){alert(`Fehler beim Löschen von "${a.careerName}": ${r.error??"Unbekannter Fehler"}`);break}}}finally{$e()}await ga()}}function Tl(){h("btn-new-career").addEventListener("click",async()=>{var s;ua("new-career-error"),h("input-career-name").value="";const a=h("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',qe("newCareer");const r=await V.getAvailableTeams();if(!r.success||!((s=r.data)!=null&&s.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=r.data.map(n=>`<option value="${n.id}">${S(n.name)} (${S(n.division??n.divisionName??"")})</option>`).join("")}),h("btn-cancel-new").addEventListener("click",()=>Ue("newCareer")),h("btn-confirm-new").addEventListener("click",async()=>{const a=h("input-career-name").value.trim(),r=h("input-team-id").value;if(!a||!r){It("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const s=Number(r),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;ua("new-career-error"),Me("Neue Karriere wird erstellt…");const o=await V.createSave(i,a,s);if(!o.success){$e(),It("new-career-error",o.error??"Unbekannter Fehler.");return}const d=await V.loadSave(i);if($e(),Ue("newCareer"),!d.success){alert("Fehler: "+d.error);return}c.currentSave=d.data??null,await nl()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>ga());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{xl()}),h("saves-list").addEventListener("click",async a=>{const r=a.target.closest("button[data-save-action]");if(!r)return;const{saveAction:s,filename:n,careerName:i}=r.dataset;if(n){if(s==="load"){await kl(n);return}s==="delete"&&await $l(n,i??n)}})}const wl="modulepreload",Ml=function(e){return"/"+e},Os={},yi=function(t,a,r){let s=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));s=Promise.allSettled(a.map(d=>{if(d=Ml(d),d in Os)return;Os[d]=!0;const l=d.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${p}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":wl,l||(u.as="script"),u.crossOrigin="",u.href=d,o&&u.setAttribute("nonce",o),document.head.appendChild(u),l)return new Promise((m,f)=>{u.addEventListener("load",m),u.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return s.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},Rl={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function Il(e){const t=Rl[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const Cl=200;function rs(e){if(e.length===0)return[];const t=[];for(const a of e){const r=t[t.length-1];if(!r||Math.abs(r.distanceMeter-a.distanceMeter)>=Cl){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}r.riderIds.push(...a.riderIds),r.riderCount+=a.riderCount,r.distanceSum+=a.distanceMeter*a.riderCount,r.distanceMeter=r.distanceSum/r.riderCount}return t.map(({distanceSum:a,...r})=>r)}function ss(e){if(e.length===0)return[];let t=0;for(let s=1;s<e.length;s+=1)e[s].riderCount>e[t].riderCount&&(t=s);let a=0,r=0;return e.map((s,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(r+=1,o=`A${r}`),{...s,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-s.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,s.distanceMeter-e[n+1].distanceMeter):null}})}function El(e,t=null){var a,r,s;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((r=e.find(n=>n.label==="P"))==null?void 0:r.label)??((s=e[0])==null?void 0:s.label)??null}function kt(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function Vs(e,t,a,r){return`${r.type}:${e}:${t}:${a}`}function Fl(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:kt(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function tt(e){const t=[];e.segments.forEach((s,n)=>{const i=n*2;(s.start_markers??[]).forEach((o,d)=>{t.push({key:Vs(n,"start",d,o),label:"",marker:o,kmMark:s.start_km,elevation:s.start_elevation,boundary:"start",sequence:i+d/100})}),(s.end_markers??[]).forEach((o,d)=>{t.push({key:Vs(n,"end",d,o),label:"",marker:o,kmMark:s.end_km,elevation:s.end_elevation,boundary:"end",sequence:i+1+d/100})})});const a=t.sort((s,n)=>s.kmMark-n.kmMark||s.sequence-n.sequence),r=new Map;return a.map(s=>{const n=(r.get(s.marker.type)??0)+1;return r.set(s.marker.type,n),{...s,label:s.marker.name??Fl(s.marker,n)}})}function Pl(e){const t=tt(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>kt(a)).length}}function Ut(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Nl(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Ke(e,t,a,r){return t<=0?r:r+e/t*(a-r*2)}function Ua(e,t){const a=t/1e3,r=e.points;if(a<=r[0].kmMark)return r[0].elevation;for(let s=0;s<r.length-1;s+=1){const n=r[s],i=r[s+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),d=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*d}return r[r.length-1].elevation}function Si(e){const t=e.points.map(p=>p.elevation),a=Math.min(...t),r=Math.max(...t),s=Math.max(1,r-a),n=Math.max(40,s*.08),i=Math.max(0,a-n),o=r+n;let d=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=d&&(l=d+100),{axisMinElevation:d,axisMaxElevation:l}}function Xe(e,t,a,r,s,n){const i=Math.max(1,a-t);return r-n-(e-t)/i*(r-s-n)}function na(e){return`${Math.round(e)} m`}function Us(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function Ys(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function ki(e,t,a,r,s,n,i,o,d){var g;const l=[],p=[];let u=null,m="#b91c1c";for(const b of tt(e)){const{marker:v,kmMark:y,elevation:T}=b;if(v.type==="climb_start"){p.push({kmMark:y,elevation:T,name:v.name});continue}if(kt(v)){let R=-1;for(let I=p.length-1;I>=0;I-=1)if(v.name&&((g=p[I])==null?void 0:g.name)===v.name){R=I;break}const x=R>=0?p.splice(R,1)[0]:p.pop();x&&Math.max(0,y-x.kmMark),x&&Math.max(0,T-x.elevation);const $=Ys(v.cat,v.type),C=Us(v.cat);if(v.type==="finish_hill"||v.type==="finish_mountain"){u=v.cat??null,m=$.accentColor;continue}l.push({x:Ke(y*1e3,t,a,r),anchorY:Xe(T,o,d,s,n,i),primaryLabel:C??"Berg",secondaryLabel:na(T),distanceLabel:`${y.toFixed(1).replace(".",",")} km`,accentColor:$.accentColor});continue}if(v.type==="sprint_intermediate"){const R=Ys(v.cat,v.type);l.push({x:Ke(y*1e3,t,a,r),anchorY:Xe(T,o,d,s,n,i),primaryLabel:"Sprint",secondaryLabel:na(T),distanceLabel:`${y.toFixed(1).replace(".",",")} km`,accentColor:R.accentColor})}}const f=e.points[e.points.length-1];return l.push({x:Ke(f.kmMark*1e3,t,a,r),anchorY:Xe(f.elevation,o,d,s,n,i),primaryLabel:u?`${Us(u)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:na(f.elevation),distanceLabel:`${f.kmMark.toFixed(1).replace(".",",")} km`,accentColor:m}),l.sort((b,v)=>b.x-v.x)}function $i(e,t,a){const r=t+4,s=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${Ut(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-detail">${Ut(e.distanceLabel)}</text>
    </g>`}function xi(e,t){const a=new Set,r=t/1e3;for(let s=0;s<=r;s+=25)a.add(Math.round(s*1e3));return a.add(Math.round(t)),[...a].filter(s=>s>=0&&s<=t).sort((s,n)=>s-n)}function Ti(e,t,a,r,s,n){const i=new Set(tt(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const d=Ke(o,a,r,s),p=i.has(o)?18:12,u=n+p+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${d.toFixed(1)}" y1="${n.toFixed(1)}" x2="${d.toFixed(1)}" y2="${(n+p).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${d.toFixed(1)}" y="${u.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${Ut(Nl(o))}</text>
      </g>`}).join("")}function Ll(e,t,a,r,s,n,i,o,d,l,p){const u=Ke(e.distanceMeter,a,r,n),m=Ua(t,e.distanceMeter),f=Xe(m,d,l,s,i,o),g=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),b=e.riderCount>1?`<text x="${u.toFixed(1)}" y="${(f+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${u.toFixed(1)}" cy="${f.toFixed(1)}" r="${g.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${p?" race-sim-cluster-dot-selected":""}"></circle>
      ${b}
    </g>`}function Dl(e,t,a,r,s,n,i,o,d,l,p){const u=new Map(p.riders.map(f=>[f.id,f])),m=new Map((p.teams??[]).map(f=>[f.id,f.abbreviation]));return e.filter(f=>f.riderCount===1).map(f=>{const g=f.riderIds[0];if(g==null)return"";const b=u.get(g);if(!b)return"";const v=Ke(f.distanceMeter,a,r,n),y=Ua(t,f.distanceMeter),T=Xe(y,d,l,s,i,o),R=b.activeTeamId!=null?m.get(b.activeTeamId)??"":"",x=`${b.lastName} (${R})`,$=T-34,C=T-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${v.toFixed(1)}" y1="${(T-5).toFixed(1)}" x2="${v.toFixed(1)}" y2="${$.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${v.toFixed(1)}" y="${C.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${Ut(x)}</text>
        </g>`}).join("")}function _l(e,t,a,r,s,n,i,o,d,l,p){const u=Math.max(0,Math.min(l,e.distanceKm)),m=Math.max(0,Math.min(p,e.distanceKm));if(m<=u)return null;const f=[{kmMark:u,elevation:Ua(e,u*1e3)},...e.points.filter(T=>T.kmMark>u&&T.kmMark<m),{kmMark:m,elevation:Ua(e,m*1e3)}];if(f.length<2)return null;const g=s-i,b=f.map((T,R)=>{const x=Ke(T.kmMark*1e3,t,a,r),$=Xe(T.elevation,o,d,s,n,i);return`${R===0?"M":"L"} ${x.toFixed(1)} ${$.toFixed(1)}`}).join(" "),v=Ke(u*1e3,t,a,r),y=Ke(m*1e3,t,a,r);return`${b} L ${y.toFixed(1)} ${g.toFixed(1)} L ${v.toFixed(1)} ${g.toFixed(1)} Z`}function Al(e,t,a,r,s={}){const p=e.distanceKm*1e3,{axisMinElevation:u,axisMaxElevation:m}=Si(e),f=533,g=12,v=e.points.map(I=>{const P=Ke(I.kmMark*1e3,p,1584,28),F=Xe(I.elevation,u,m,634,168,101);return{x:P,y:F}}).map((I,P)=>`${P===0?"M":"L"} ${I.x.toFixed(1)} ${I.y.toFixed(1)}`).join(" "),y=`${v} L ${1556 .toFixed(1)} ${f.toFixed(1)} L ${28 .toFixed(1)} ${f.toFixed(1)} Z`,T=s.selectedClimbRange!=null?_l(e,p,1584,28,634,168,101,u,m,s.selectedClimbRange.startKm,s.selectedClimbRange.endKm):null,R=ki(e,p,1584,28,634,168,101,u,m).map(I=>$i(I,g,f)).join(""),$=Array.from({length:5},(I,P)=>u+(m-u)/4*P).map(I=>{const P=Xe(I,u,m,634,168,101);return`
      <line x1="28" y1="${P.toFixed(1)}" x2="1556" y2="${P.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${P.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${P.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(P+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${na(I)}</text>`}).join(""),C=Ti(xi(e,p),e,p,1584,28,f);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${Ut(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      <path d="${y}" fill="url(#dashboard-large-area)"></path>
      ${T?`<path d="${T}" class="dashboard-stage-profile-climb-highlight"></path>`:""}
      <path d="${v}" class="race-sim-profile-line"></path>
      ${R}
      ${C}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function Bl(e,t,a,r,s){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${Al(t,a,r,!1,s)}</div>`}function Hl(e,t,a,r,s,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,d=634,l=28,p=168,u=101,{axisMinElevation:m,axisMaxElevation:f}=Si(t),g=d-u,b=12,v=Array.from({length:5},(K,w)=>m+(f-m)/4*w),y=rs(a.clusters),T=ss(y),R=xi(t,a.stageDistanceMeters),$=t.points.map(K=>{const w=Ke(K.kmMark*1e3,a.stageDistanceMeters,o,l),A=Xe(K.elevation,m,f,d,p,u);return{x:w,y:A}}).map((K,w)=>`${w===0?"M":"L"} ${K.x.toFixed(1)} ${K.y.toFixed(1)}`).join(" "),C=`${$} L ${(o-l).toFixed(1)} ${g.toFixed(1)} L ${l.toFixed(1)} ${g.toFixed(1)} Z`,I=ki(t,a.stageDistanceMeters,o,l,d,p,u,m,f).map(K=>$i(K,b,g)).join(""),P=v.map(K=>{const w=Xe(K,m,f,d,p,u);return`
      <line x1="${l}" y1="${w.toFixed(1)}" x2="${o-l}" y2="${w.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${w.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${w.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(w+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${na(K)}</text>`}).join(""),F=Ti(R,t,a.stageDistanceMeters,o,l,g),L=new Map(y.map((K,w)=>[K,T[w]??null])),H=y.map(K=>{var w;return Ll(K,t,a.stageDistanceMeters,o,d,l,p,u,m,f,((w=L.get(K))==null?void 0:w.label)===i)}).join(""),G=s.stage.profile==="ITT"?Dl(y,t,a.stageDistanceMeters,o,d,l,p,u,m,f,s):"";e.innerHTML=`
    <div class="race-sim-profile-layout${s.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${d}" role="img" aria-label="${Ut(r)}">
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
            <path d="${C}" fill="url(#race-sim-area)"></path>
            <path d="${$}" class="race-sim-profile-line"></path>
            ${I}
            ${H}
          </g>
          ${G}
          ${F}
          <text x="${l.toFixed(1)}" y="${(p-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const Gl={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},Zs={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function Kr(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function dr(e,t){return`${e}:${t}`}function zl(e){return new Map(e.map(t=>[dr(t.simulationMode,t.terrain),t.weights]))}function Kl(e){return new Map(e.map(t=>[dr(t.simulationMode,t.terrain),t]))}function Wl(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function wi(e,t,a){const r=a.get(dr(e,t));if(!r)return[{key:Kr(t),weight:1}];const s=Object.entries(r).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return s.length>0?s:[{key:Kr(t),weight:1}]}function jl(e,t,a,r){const s=wi(t,a,r),n=s.reduce((o,d)=>o+d.weight,0);return n<=0?e[Kr(a)]:s.reduce((o,d)=>o+e[d.key]*d.weight,0)/n}function Ol(e,t){const a=t.find(r=>r.simulationMode==="ttt"&&r.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??Gl[e]??1.05}function Vl(e,t,a){const r=a==null?void 0:a.get(dr(e,t));return{lateMultiplier:(r==null?void 0:r.finalSpreadLateMultiplier)??Zs[t].lateMultiplier,peakMultiplier:(r==null?void 0:r.finalSpreadPeakMultiplier)??Zs[t].peakMultiplier}}const Ul=.005,Yl=.005,Mi=70,Ri=1e3,Ii=15,Ci=360,Ei=8,Fi=-.75,Pi=10;function Ct(e,t){return e+Math.random()*(t-e)}function Ni(e,t,a){return Math.max(t,Math.min(a,e))}function Zl(e){return e==="ITT"||e==="TTT"}function Li(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(r=>{var s,n,i;return r.id!==e.id&&r.activeTeamId===e.activeTeamId&&(((s=r.role)==null?void 0:s.name)==="Edelhelfer"||((n=r.role)==null?void 0:n.name)==="Starke Helfer"||((i=r.role)==null?void 0:i.name)==="Wassertraeger")}).map(r=>r.id)}function Di(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function Jl(e,t,a,r){const s=r==="crash"?Di():null,n=Number(Ct(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=Ni(n/Math.max(.1,a)*100,0,100),d=o<=Mi;return{riderId:e.id,type:r,severity:s,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(r==="crash"?Ct(10,60):Ct(10,45)),recoverySeconds:d?Ri:Ci,recoveryFormBonus:d?Ii:Ei,dayFormPenalty:Fi,staminaPenalty:Pi,recoveryPenaltyStages:r==="crash"?s==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:r==="crash"&&s==="medium"?15:0,supportRiderIds:Li(e,t)}}function ql(e,t,a){if(Zl(t.profile)||a<=0)return[];const r=[];for(const s of e){const n=Math.random(),i=Math.random(),o=Ul*Math.max(0,t.crashIncidentMultiplier??1),d=Yl*Math.max(0,t.mechanicalIncidentMultiplier??1),l=o+(t.rolledEffektSturz??0)/100,p=d+(t.rolledEffektDefekt??0)/100,u=n<l,m=i<p;if(!u&&!m)continue;const f=u&&m?n<=i?"crash":"mechanical":u?"crash":"mechanical",g=Jl(s,e,a,f);if(f==="crash"&&Math.random()<.01){g.isMassCrashTrigger=!0;const b=Math.floor(Ct(2,26)),y=[...e.filter(T=>T.id!==s.id)].sort(()=>.5-Math.random());g.massCrashPotentialRiderIds=y.slice(0,b).map(T=>T.id),Math.random()<.2&&(g.hasAdditionalMechanical=!0,g.waitDurationSeconds+=Math.round(Ct(10,45)))}r.push(g)}return r}function Xl(e,t,a,r){const s=Di(),n=Math.round(a*1e3),i=Ni(a/Math.max(.1,r)*100,0,100),o=i<=Mi;let d=Math.round(Ct(10,60)),l=!1;return Math.random()<.2&&(l=!0,d+=Math.round(Ct(10,45))),{riderId:e.id,type:"crash",severity:s,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:d,recoverySeconds:o?Ri:Ci,recoveryFormBonus:o?Ii:Ei,dayFormPenalty:Fi,staminaPenalty:Pi,recoveryPenaltyStages:s==="light"?[10,5,2]:[],raceRecuperationPenalty:s==="medium"?15:0,supportRiderIds:Li(e,t),hasAdditionalMechanical:l}}function Ql(e,t){return e+Math.random()*(t-e)}function Js(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const r=Math.floor(Ql(0,a+1)),s=t[a];t[a]=t[r]??s,t[r]=s}return t}function ed(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function td(e,t,a={}){if(e.length===0)return[];const r=e.map(f=>({...f,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),s=a.teams??ed(r),n=ja(r,s,t,a),i=new Set(n.slice(0,20).map(f=>f.rider.id)),o=Math.min(Math.ceil(r.length*.02),Math.max(0,r.length-i.size)),d=Math.min(Math.ceil(r.length*.01),r.length),l=Js(r.filter(f=>!i.has(f.id))),p=new Set(l.slice(0,o).map(f=>f.id)),u=Js(r.filter(f=>!p.has(f.id))),m=new Set(u.slice(0,d).map(f=>f.id));return r.map(f=>p.has(f.id)?{...f,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:m.has(f.id)?{...f,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:f)}function qt(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}function qs(e,t){return e+Math.random()*(t-e)}function ad(e,t,a){const r=[...e],s=[];for(;s.length<t&&r.length>0;){const n=r.reduce((l,p)=>l+Math.max(1e-4,a(p)),0);let i=Math.random()*n,o=0;for(let l=0;l<r.length;l+=1)if(i-=Math.max(1e-4,a(r[l])),i<=0){o=l;break}const[d]=r.splice(o,1);d&&s.push(d)}return s}function rd(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function Xs(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function sd(e,t,a){return new Set(e.map(r=>r.riderId).filter(r=>r!=null&&!t.has(r)).slice(0,a))}function nd(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function ft(e){var t;return nd((t=e.role)==null?void 0:t.name)}function id(e){return tt(e).some(({marker:t})=>kt(t))}function od(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function ld(e,t){const a=od(e),r=e.hasSuperform===!0?40:1,s=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&ft(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*r*s*n*i;return{attackFactor:a,superformFactor:r,gcLeaderTeamFactor:s,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function dd(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function cd(e,t){var r,s;const a=((r=t[0])==null?void 0:r.riderId)??null;return a==null?null:((s=e.find(n=>n.id===a))==null?void 0:s.activeTeamId)??null}function ud(e,t,a){const r=new Map(t.map(n=>[n.id,n])),s=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=r.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||s.has(i.activeTeamId))&&(s.add(i.activeTeamId),s.size>=a))break}return s}function md(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),ft(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function pd(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const r=t.stageNumber<=10,s=Math.max(1,Math.floor(a*(r?.01:.05))),n=Math.max(s,Math.floor(a*(r?.08:.2)));return{min:s,max:n}}function gd(e,t){return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?{min:.45,max:.75}:{min:.5,max:.85}}function fd(e,t,a,r,s,n,i,o){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||r.distanceKm<=0)return null;const d=e.length,{min:l,max:p}=pd(t,a,d),u=qt(l,p),m=t.isStageRace&&a.stageNumber<=10,f=!t.isStageRace,g=cd(e,n),b=m?ud(s,e,5):new Set,v=m?md(e):new Map,y=id(r),T=rd(s,5),R=Xs(n,10),x=new Set([...T,...R]),$=y?sd(i,x,5):new Set,C=dd(a),I=["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain"].includes(a.profile),P=t.isStageRace&&I&&a.stageNumber>=4;let F;const L=new Set;if(P){const _=Xs(n,10),O=ja(e,o??[],a,{distanceKm:r.distanceKm,elevationGainMeters:r.elevationGainMeters});let z=[];for(const k of O){if(z.length>=5)break;const M=k.rider;if(M.activeTeamId==null||!_.has(M.id))continue;const N=ft(M);(N==="kapitaen"||N==="co-kapitaen")&&(z.includes(M.activeTeamId)||z.push(M.activeTeamId))}if(z.length===0)for(const k of O){if(z.length>=5)break;const M=k.rider;if(M.activeTeamId==null||!_.has(M.id))continue;ft(M)==="edelhelfer"&&(z.includes(M.activeTeamId)||z.push(M.activeTeamId))}if(z.length>0&&Math.random()<.5){const k=qt(0,z.length-1);F=z[k]}}if(F!=null){const _=e.filter(z=>z.activeTeamId===F),E=_.filter(z=>ft(z)==="kapitaen"),O=_.filter(z=>ft(z)==="co-kapitaen");if(E.length>0){if(E.forEach(z=>L.add(z.id)),E.length===1&&O.length>0){const z=[...O].sort((k,M)=>M.overallRating-k.overallRating||M.id-k.id);L.add(z[0].id)}}else if(O.length>0)[...O].sort((k,M)=>M.overallRating-k.overallRating||M.id-k.id).slice(0,2).forEach(k=>L.add(k.id));else{const z=_.filter(k=>ft(k)==="edelhelfer");if(z.length>0){const k=[...z].sort((M,N)=>N.overallRating-M.overallRating||N.id-M.id);L.add(k[0].id)}}}let H;if(F!=null){const E=e.filter(O=>O.activeTeamId===F).filter(O=>!L.has(O.id));E.length>0&&(H=[...E].sort((z,k)=>k.skills.attack-z.skills.attack||k.overallRating-z.overallRating||k.id-z.id)[0])}const G=e.filter(_=>{if(_.activeTeamId==null||T.has(_.id)||R.has(_.id)||F!=null&&_.activeTeamId===F&&(L.has(_.id)||H!=null&&_.id===H.id)||m&&g!=null&&_.activeTeamId===g||m&&b.has(_.activeTeamId))return!1;const E=ft(_);return!(f&&(E==="kapitaen"||E==="co-kapitaen")||m&&E==="kapitaen"||m&&E==="co-kapitaen"&&v.get(_.activeTeamId)!==!0||E==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(G.length===0)return null;const K=new Map(G.map(_=>[_.id,ld(_,{isEarlyStageRace:m,race:t,gcLeaderTeamId:g,stageHasMountainClassifications:y,topMountainIds:$,isHardStage:C})])),w=G.reduce((_,E)=>{var O;return _+(((O=K.get(E.id))==null?void 0:O.finalWeight)??0)},0),A=ad(G,Math.max(0,Math.min(u-(H?1:0),G.length)),_=>{var E;return((E=K.get(_.id))==null?void 0:E.finalWeight)??1});if(H&&A.push(H),A.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${A.length}/${u} ausgewählt aus ${G.length}`),console.log(`Gesamtgewicht im Pool: ${w.toFixed(2)}`),console.table(A.map(_=>{var O;const E=K.get(_.id);return{Fahrer:`${_.firstName} ${_.lastName}`,Team:_.activeTeamId,Rolle:((O=_.role)==null?void 0:O.name)??null,Atk:_.skills.attack,Hill:_.skills.hill,Chance:`${((w>0&&E!=null?E.finalWeight/w:0)*100).toFixed(2)}%`,Gewicht:((E==null?void 0:E.finalWeight)??1).toFixed(2),Attacke:`x${((E==null?void 0:E.attackFactor)??1).toFixed(2)}`,Superform:`x${(E==null?void 0:E.superformFactor)??1}`,GC_Team:`x${((E==null?void 0:E.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(E==null?void 0:E.mountainFactor)??1}`,Sprinter:`x${(E==null?void 0:E.sprinterFactor)??1}`}})),console.groupEnd();const U=r.distanceKm*1e3,W=qt(0,Math.min(1e4,Math.max(0,Math.floor(U*.1)))),ne=gd(t,a),q=Math.round(U*qs(ne.min,ne.max)),ee=Math.round(U*qs(.1,.25)),Y=Math.max(W+1e3,Math.min(q-1e3,q-ee)),j=a.rolledBreakawayBonus??0,D=qt(3+j,8+j);return{riderIds:A.map(_=>_.id),triggerDistanceMeters:W,groupPhaseEndDistanceMeters:Y,phaseEndDistanceMeters:q,skillBonus:D,malusValue:qt(5,8),superTeamId:F}}const hd=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),bd=3,vd=7,Qs=120,en=200,tn=180,yd=10,$a=8e3;function Et(e,t,a=Math.random()){const r=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(a*(s-r+1))+r}function Sd(e){for(let t=e.length-1;t>0;t-=1){const a=Et(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function Ya(e,t){return t<=0||e.length===0?[]:Sd([...e]).slice(0,Math.min(t,e.length))}function kd(e,t,a){if(t<=0||e.length===0)return[];const r=[...e],s=[];for(;r.length>0&&s.length<t;){const n=r.reduce((d,l)=>d+Math.max(0,a(l)),0);if(n<=0){s.push(...Ya(r,t-s.length));break}let i=Math.random()*n,o=r.length-1;for(let d=0;d<r.length;d+=1)if(i-=Math.max(0,a(r[d])),i<=0){o=d;break}s.push(r[o]),r.splice(o,1)}return s}function $d(e){return hd.has(e.profile)}function xd(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function Td(e,t){if(!$d(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(r=>{if(!xd(r))return[];const s=r.start_km*1e3,n=r.end_km*1e3,i=Math.max(s,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:s,sourceSegmentEndMeters:n}]})}function an(e,t){const a=t==null?e:e.filter(d=>{const l=Math.min(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t)),p=Math.max(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t));return l>=$a||p>=$a});if(a.length===0)return null;const r=a[Et(0,a.length-1)];if(!r)return null;const s=Math.ceil(r.startMeters),n=Math.floor(r.endMeters);if(n<=s)return null;let i=0;for(;i<12;){const d=Et(s,n);if(t==null||Math.abs(d-t)>=$a)return{triggerDistanceMeters:d,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<r.startMeters?n:s;return t==null||Math.abs(o-t)>=$a?{triggerDistanceMeters:o,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters}:null}function wd(e,t,a,r=()=>1){const s=e.slice(0,15),n=Td(t,a);if(s.length===0||n.length===0)return[];const i=Et(bd,Math.min(vd,s.length)),o=kd(s,i,r),d=[];for(const m of o){const f=an(n);f&&d.push({riderId:m.id,attackNumber:1,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:Et(Qs,en),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}if(d.length===0)return[];const l=d.map(m=>m.riderId),p=Math.floor(l.length*.5),u=new Set(Ya(l,p));for(const m of[...d]){if(!u.has(m.riderId))continue;const f=an(n,m.triggerDistanceMeters);f&&d.push({riderId:m.riderId,attackNumber:2,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:Et(Qs,en),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}return d.sort((m,f)=>m.triggerDistanceMeters-f.triggerDistanceMeters||m.riderId-f.riderId||m.attackNumber-f.attackNumber)}function Md(e,t,a){var d;if(e.length===0)return[];const r=((d=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:d.teamId)??null,s=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||r!=null&&l.teamId===r));if(s.length===0)return[];const n=new Map;for(const l of s){const p=n.get(l.teamId)??[];p.push(l),n.set(l.teamId,p)}const i=[...n.values()].map(l=>Ya(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(Et(0,3),i.length);return Ya(i,o).map(l=>l.riderId)}function Rd(e,t){const a=[],r=[];for(const[s,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){r.push(s);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:r}}function xr(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}const Id={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},Cd={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},Ed={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},Fd={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},Pd={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function Nd(e){const t=new Map;for(const a of e){const r=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",r);else if(a.appliesTo==="climb_top"){const s=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${s}`,r)}else a.appliesTo==="finish"&&t.set(a.markerType,r)}return t}const xa=20,Ld=120,Dd=300,Tr=.025,_d=.1,Ad=.4,Bd=.6,Hd=.8,ia=1,rn=2/3,Gd=.1,Ta=10,sn=50,zd=25,Kd=7,Wd=500,jd=100,Od=.02,Vd=.04,Ud=.009,Yd=120,Zd=150,Jd=100,qd=300,nn=50,wr=85,Tt=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],on=5*60,Xd=60,Qd=.5,ec=.3,wa=5e3,tc=2e3,ac=1,rc=2,sc=.05,_i={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},nc={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},Ma=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function he(e,t,a){return Math.max(t,Math.min(a,e))}function pe(e,t){return e+Math.random()*(t-e)}function ln(e){return e[Math.floor(Math.random()*e.length)]}function Kt(e){return Math.round(e*100)/100}function ic(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function dn(e){if(e<2)return 1;const t=he(e,2,20),a=Ma[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let r=1;r<Ma.length;r+=1){const s=Ma[r-1],n=Ma[r];if(t>n.gradientPercent)continue;const i=(t-s.gradientPercent)/Math.max(1e-4,n.gradientPercent-s.gradientPercent),o=s.draftPenaltyShare+(n.draftPenaltyShare-s.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function oc(e){return e==="Flat"?Yd:e==="Abfahrt"?Zd:Number.POSITIVE_INFINITY}function lc(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function Za(e){return(e.formBonus??0)+(e.raceFormBonus??0)-((e.fatigueMalus??0)+(e.longTermFatigueMalus??0)+(e.shortTermFatigueMalus??0))*.5}function dc(e,t){if(t.length===0)return"";const a=t.reduce((p,u)=>p+u.weight,0),r=t.map(p=>{const u=e.skills[p.key],m=Math.round(p.weight/a*100);return`${_i[p.key]} ${Math.round(u)} (${m}%)`}),s=e.formBonus??0,n=e.raceFormBonus??0,i=(e.fatigueMalus??0)*.5,o=(e.longTermFatigueMalus??0)*.5,d=(e.shortTermFatigueMalus??0)*.5;r.push(`S-Form ${s>=0?"+":""}${s.toFixed(1).replace(".",",")}`),r.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&r.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&r.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),d>0&&r.push(`Akut -${d.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const p of t)l+=(e.mentorBoosts[p.key]||0)*(p.weight/a);return l>0&&r.push(`Mentor +${l.toFixed(1).replace(".",",")}`),r.join(" • ")}function cc(){const e=Math.random();return e<.9?pe(5,20):e<.98?pe(20,40):pe(40,70)}function cn(){const e=Math.random();return e<.9?Kt(pe(-1,1)):e<.995?Kt(ln([-1,1])*pe(1,2)):Kt(ln([-1,1])*pe(3,4))}function uc(){return Kt(pe(-3,3))}function mc(e){const t=[];let a=0,r=cc(),s=pe(-1,1);for(;a<e;){const n=Math.min(e-a,pe(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:r,vector:s}),a+=n,a>=e)break;r=he(r+(Math.random()<.5?-1:1)*pe(2,10),5,70),s=he(s+(Math.random()<.5?-1:1)*pe(0,.5),-1,1)}return t}function Ai(e,t){const a=ae(e),r=ae(t);if(a!==r)return a?1:-1;const s=xe(e),n=xe(t);return s&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:s?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function ae(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function xe(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function Xt(e,t,a=!1,r=null){var d;const s="rider"in e?e.rider:null,n=(s==null?void 0:s.specialization1)??null,i=(s==null?void 0:s.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(d=s==null?void 0:s.role)==null?void 0:d.name;r==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function pc(e,t,a=null,r=null,s=!1){var f,g;const n=b=>b.photoFinishScore;if(!t){const b=[...e].sort((y,T)=>y.crossingTimeSeconds-T.crossingTimeSeconds||T.photoFinishScore-y.photoFinishScore||y.riderId-T.riderId),v=((f=b[0])==null?void 0:f.crossingTimeSeconds)??0;return b.map((y,T)=>({riderId:y.riderId,rank:T+1,crossingTimeSeconds:y.crossingTimeSeconds,gapSeconds:Math.max(0,y.crossingTimeSeconds-v),photoFinishScore:y.photoFinishScore}))}const i=[...e].sort((b,v)=>b.crossingTimeSeconds-v.crossingTimeSeconds||v.photoFinishScore-b.photoFinishScore||b.riderId-v.riderId),o=((g=i[0])==null?void 0:g.crossingTimeSeconds)??0,d=[];let l=[],p=0,u=null;const m=()=>{const b=Math.max(0,p-o),v=l.sort((y,T)=>n(T)-n(y)||y.riderId-T.riderId);for(const y of v)d.push({riderId:y.riderId,rank:d.length+1,crossingTimeSeconds:y.crossingTimeSeconds,gapSeconds:b,photoFinishScore:y.photoFinishScore})};for(const b of i){if(l.length===0){l=[b],p=b.crossingTimeSeconds,u=b.crossingTimeSeconds;continue}if(u!=null&&b.crossingTimeSeconds-u<=ia){l.push(b),u=b.crossingTimeSeconds;continue}m(),l=[b],p=b.crossingTimeSeconds,u=b.crossingTimeSeconds}return l.length>0&&m(),d}function gc(e,t,a){const r=e.filter(xe).sort((u,m)=>(u.finishTimeSeconds??0)-(m.finishTimeSeconds??0)||m.photoFinishScore-u.photoFinishScore||u.rider.id-m.rider.id),s=e.filter(u=>!ae(u)).sort(Ai),n=e.filter(u=>u.finishStatus==="dnf").sort((u,m)=>m.distanceCoveredMeters-u.distanceCoveredMeters||u.rider.id-m.rider.id),i=[];let o=[],d=null;const l=u=>u.photoFinishScore,p=()=>{i.push(...o.sort((u,m)=>l(m)-l(u)||u.rider.id-m.rider.id))};for(const u of r){const m=u.finishTimeSeconds??0;if(o.length===0){o=[u],d=m;continue}if(d!=null&&m-d<=ia){o.push(u),d=m;continue}p(),o=[u],d=m}return o.length>0&&p(),[...i,...s,...n]}function fc(e,t){const a=ae(e),r=ae(t);if(a!==r)return a?1:-1;const s=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(s)>=.1?s:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:xe(e)&&xe(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:xe(e)?-1:xe(t)?1:e.rider.id-t.rider.id}function un(e){const t=he(e,1,sn);return t<=2?.12*t:t<=Ta?.24+(t-2)/Math.max(1,Ta-2)*.58:.82+(t-Ta)/Math.max(1,sn-Ta)*.18}function Mr(e,t){const a=Za(e.rider);return Object.entries(t).reduce((r,[s,n])=>{if(!n)return r;const i=s==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[s]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return r+o*n},0)}function hc(e,t){const a=Za(e.rider);return Object.entries(t).filter(r=>!!r[1]).map(([r,s])=>{const n=r,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:s,effectiveSkill:o,contribution:o*s}})}function bc(e,t,a){let r=t;for(;r>0;){const n=e[r-1].distanceCoveredMeters-e[r].distanceCoveredMeters;if(n<=0||n>=a)break;r-=1}let s=t;for(;s<e.length-1;){const n=e[s].distanceCoveredMeters-e[s+1].distanceCoveredMeters;if(n<=0||n>=a)break;s+=1}return{startIndex:r,endIndex:s,size:s-r+1,positionInGroup:t-r}}function vc(e,t){if(e<zd)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class Bi{constructor(t,a){var G,K;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.superTeamProtectedLeaderIds=new Set,this.superTeamBonusAmount=0,this.superTeamMalusAmount=0,this.superTeamStartPercent=0,this.superTeamEndPercent=0,this.superTeamBreakawayRiderCaught=!1,this.hasLoggedFinishSprintTieBreak=!1,this.hasAppliedSprintLeadoutBonuses=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const r=(G=t.race.country)==null?void 0:G.code3;r&&(t.riders=t.riders.map(w=>{var U;const A=w.nationality||((U=w.country)==null?void 0:U.code3);if(A&&A.trim().toUpperCase()===r.trim().toUpperCase()){const W={...w,skills:{...w.skills}},ne=Math.random(),q=t.stage.profile,ee=q==="ITT"||q==="TTT",Y=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(q==="Cobble"||q==="Cobble_Hill")&&Y.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(q)||Y.push("mountain","mediumMountain");const E=[...(O=>{const z=[...Y],k=[];if(ee){k.push("timeTrial");const M=Math.min(O-1,z.length);for(let N=0;N<M;N++){const B=Math.floor(Math.random()*z.length);k.push(z.splice(B,1)[0])}}else{const M=Math.min(O,z.length);for(let N=0;N<M;N++){const B=Math.floor(Math.random()*z.length);k.push(z.splice(B,1)[0])}}return k})(5)].sort(()=>Math.random()-.5);if(W.homeEffectSkills=E,ne<.05){W.homeEffect="home_pressure";for(const O of E)W.skills[O]=Math.max(0,W.skills[O]-.5)}else if(ne<.1){W.homeEffect="super_home";const O=E[0];W.skills[O]=Math.min(100,W.skills[O]+3);for(let z=1;z<5;z++){const k=E[z];W.skills[k]=Math.min(100,W.skills[k]+1)}}else{W.homeEffect="normal_home";for(const O of E)W.skills[O]=Math.min(100,W.skills[O]+1)}return W}return w})),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=Wl(t.stage.profile),this.skillWeightRuleMap=zl(t.skillWeightRules??[]),this.skillWeightConfigMap=Kl(t.skillWeightRules??[]),this.stageScoringWeightMap=Nd(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=mc(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const s=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=s!=null?he(s/100,0,1):pe(Bd,Hd);const n=t.stage.finalPushStartPercent;this.finalPushStartRatio=n!=null?he(n/100,this.lateStageStartRatio,1):he(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const i=ql(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(i.map(w=>[w.riderId,w])),i.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",i.map(A=>({riderId:A.riderId,type:A.type,severity:A.severity,kmMark:A.triggerDistanceKm,waitDurationSeconds:A.waitDurationSeconds,supportRiderIds:A.supportRiderIds})));const w=i.filter(A=>A.isMassCrashTrigger);w.length>0&&w.forEach(A=>{var U;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${A.riderId} bei Km ${A.triggerDistanceKm}. Potenziell betroffene Fahrer (${(U=A.massCrashPotentialRiderIds)==null?void 0:U.length}):`,A.massCrashPotentialRiderIds)})}const o=t.riders.map(w=>{const A={rider:w,riderName:`${w.firstName} ${w.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:uc(),microForm:cn(),nextFormUpdateMeter:pe(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(w.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(A),A}),d=new Map(o.map(w=>[w.rider.id,w.dailyForm]));this.stageFavorites=li(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d});const l=this.stageFavorites.filter(w=>w.kind==="rider"&&w.riderId!=null).slice(0,15).map(w=>t.riders.find(A=>A.id===w.riderId)??null).filter(w=>w!=null),p=((K=t.gcStandings.find(w=>w.rank===1))==null?void 0:K.riderId)??null,u=wd(l,t.stage,t.stageSummary,w=>Math.max(1,Math.pow(10,(w.skills.attack-65)/10))*(w.id===p?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const w of u){const A=this.precalculatedStageAttacksByRiderId.get(w.riderId)??[];A.push(w),this.precalculatedStageAttacksByRiderId.set(w.riderId,A)}this.breakawayPlan=fd(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings,t.teams);const m=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=m.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=m.fallbackCheckpointsMeters;for(const w of o)w.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const f=td(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d}),g=new Map(f.map(w=>[w.id,w])),b=o.map(w=>{const A=g.get(w.rider.id)??w.rider;return{...w,rider:A,riderName:`${A.firstName} ${A.lastName}`,dailyForm:w.dailyForm+(A.specialFormDelta??0)}}),v=f.filter(w=>w.hasSuperform),y=f.filter(w=>w.hasSupermalus);(v.length>0||y.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:v.map(w=>`${w.firstName} ${w.lastName}`),supermalus:y.map(w=>`${w.firstName} ${w.lastName}`)});const T=this.resolveStartOrder(b),R=new Map((this.bootstrap.teamStartOrder??[]).map((w,A)=>[w,A]));if(this.riders=T.map((w,A)=>({...w,startOffsetSeconds:this.resolveStartOffsetSeconds(w,A,R)})),this.riders.forEach(w=>this.syncRiderTelemetry(w)),this.breakawayPlan&&this.breakawayPlan.superTeamId!=null){this.superTeamId=this.breakawayPlan.superTeamId,this.superTeamBonusAmount=xr(2,6),this.superTeamMalusAmount=xr(4,8),this.superTeamStartPercent=pe(.4,.6),this.superTeamEndPercent=pe(.86,.96);const w=Y=>(Y??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),A=t.riders.filter(Y=>Y.activeTeamId===this.superTeamId),U=A.filter(Y=>{var j;return w((j=Y.role)==null?void 0:j.name)==="kapitaen"}),W=A.filter(Y=>{var j;return w((j=Y.role)==null?void 0:j.name)==="co-kapitaen"});if(U.length>0){if(U.forEach(Y=>this.superTeamProtectedLeaderIds.add(Y.id)),U.length===1&&W.length>0){const Y=[...W].sort((j,D)=>D.overallRating-j.overallRating||D.id-j.id);this.superTeamProtectedLeaderIds.add(Y[0].id)}}else if(W.length>0)[...W].sort((j,D)=>D.overallRating-j.overallRating||D.id-j.id).slice(0,2).forEach(j=>this.superTeamProtectedLeaderIds.add(j.id));else{const Y=A.filter(j=>{var D;return w((D=j.role)==null?void 0:D.name)==="edelhelfer"});if(Y.length>0){const j=[...Y].sort((D,_)=>_.overallRating-D.overallRating||_.id-D.id);this.superTeamProtectedLeaderIds.add(j[0].id)}}const ne=t.teams.find(Y=>Y.id===this.superTeamId),q=ne?ne.name:`Team ${this.superTeamId}`;this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,riderTeamId:this.superTeamId,type:"superteam",tone:"neutral",title:`Superteam des Tages: ${q}`,detail:`Dieses Team hat sich heute zusammengeschlossen, um seinen Leader zu unterstützen! Die Helfer erhalten zwischen ${(this.superTeamStartPercent*100).toFixed(0)}% und ${(this.superTeamEndPercent*100).toFixed(0)}% der Etappe einen Bonus von +${this.superTeamBonusAmount} auf Berg, Hill, Medium Mountain und Flat. Danach folgt ein individueller Malus von -4 bis -8 wegen Erschöpfung.`});const ee=this.riders.find(Y=>{var j;return Y.rider.activeTeamId===this.superTeamId&&((j=this.breakawayPlan)==null?void 0:j.riderIds.includes(Y.rider.id))});ee&&(this.superTeamBreakawayRiderId=ee.rider.id)}for(const w of this.riders){const A=w.rider.homeEffectSkills,U=W=>nc[W]||W;if(w.rider.homeEffect==="super_home"){const W=A&&A.length===5?`${U(A[0])} (+3), ${U(A[1])} (+1), ${U(A[2])} (+1), ${U(A[3])} (+1), ${U(A[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${W})`})}if(w.rider.homeEffect==="home_pressure"){const W=A?A.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${W})`})}if(w.rider.homeEffect==="normal_home"){const W=A?A.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${W})`})}w.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),w.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),w.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const x=this.bootstrap.stage.rolledWetterName??"Sonnig",$=this.bootstrap.stage.rolledEffektSturz??0,C=this.bootstrap.stage.rolledEffektDefekt??0,I=this.bootstrap.stage.rolledWindkantenGefahr??0,P=this.bootstrap.stage.rolledEffektFatigue??0,F=this.bootstrap.stage.rolledBreakawayBonus??0,L=[];$>0&&L.push(`Sturzwahrscheinlichkeit +${$.toFixed(1)}%`),C>0&&L.push(`Defektwahrscheinlichkeit +${C.toFixed(1)}%`),I>0&&L.push(`Windkanten-Gefahr +${(I*100).toFixed(1)}%`),P>0&&L.push(`Fatigue +${P.toFixed(1)}%`),F>0&&L.push(`Ausreißer-Bonus +${F.toFixed(1)}`);const H=L.length>0?`Wettereinflüsse: ${L.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${x}`,detail:H})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const r=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(r),a-=r}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(r=>({riderId:r.rider.id,riderName:r.riderName,startOffsetSeconds:r.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(r),hasStarted:r.hasStarted||ae(r),distanceCoveredMeters:r.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-r.distanceCoveredMeters),segmentStartKm:r.segmentStartKm,segmentEndKm:r.segmentEndKm,segmentStartElevation:r.segmentStartElevation,segmentEndElevation:r.segmentEndElevation,activeTerrain:xe(r)?"Finish":r.activeTerrain,skillName:xe(r)?"Finish":r.skillName,skillBreakdown:xe(r)?"":r.skillBreakdown,baseSkill:r.baseSkill,teamGroupBonus:r.teamGroupBonus,effectiveSkill:r.effectiveSkill,staminaPenalty:r.staminaPenalty,elevationPenalty:r.elevationPenalty,dailyForm:r.dailyForm,microForm:r.microForm,gradientPercent:r.gradientPercent,gradientModifier:r.gradientModifier,windModifier:r.windModifier,draftModifier:r.draftModifier,draftNearbyRiderCount:r.draftNearbyRiderCount,draftPackFactor:r.draftPackFactor,currentSpeedMps:r.currentSpeedMps,photoFinishScore:r.photoFinishScore,leadoutBonus:r.leadoutBonus,leadoutRiderId:r.leadoutRiderId,leadoutContributions:r.leadoutContributions,lastSplitLabel:r.lastSplitLabel,lastSplitTimeSeconds:r.lastSplitTimeSeconds,splitTimes:{...r.splitTimes},finishTimeSeconds:Number.isFinite(r.finishTimeSeconds??Number.NaN)?r.finishTimeSeconds:null,finishStatus:r.finishStatus,statusReason:r.statusReason,isAttacking:r.isAttacking,isBreakaway:r.isBreakaway,isLeadingGroup:r.isLeadingGroup,hasSuperform:r.rider.hasSuperform===!0,hasSupermalus:r.rider.hasSupermalus===!0,isFinished:xe(r)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(r=>r.appliedIncident?[r.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus},superTeamId:this.superTeamId}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let r=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(r=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(r==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,d)=>Math.max(o,d.distanceCoveredMeters),0);r=Number((i/1e3).toFixed(2))}const s={id:this.nextMessageId,...t,riderTeamId:a,kmMark:r};this.messages.unshift(s),this.allEvents.push(s),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(r=>[r.rider.id,r]));return this.intermediateMarkers.map(r=>{const s=t.map(i=>i.markerCrossings[r.key]??null).filter(i=>i!=null),n=pc(s,!this.isTimeTrialMode,r.markerType,a,this.isClimberMalusStage());return{markerKey:r.key,markerLabel:r.label,markerType:r.markerType,markerCategory:r.markerCategory,kmMark:r.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.isTimeTrialMode?[...this.riders].sort(Ai):gc(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(s=>s.finishStatus!=="dnf").reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0);let r=0;for(const s of t)xe(s)&&(r+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:r,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(ae)}advanceSubstep(t){const a=this.elapsedSeconds,r=a+t,s=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();if(this.updateBreakawayPhaseState(),this.superTeamId!=null&&this.superTeamBreakawayRiderId!=null&&!this.superTeamBreakawayRiderCaught){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&!ae(l)&&this.riders.filter(m=>this.superTeamProtectedLeaderIds.has(m.rider.id)&&!ae(m)).some(m=>m.distanceCoveredMeters>=.4*this.stageDistanceMeters&&m.distanceCoveredMeters>=l.distanceCoveredMeters)&&(this.superTeamBreakawayRiderCaught=!0,l.breakawayMalus=0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} von Leader eingeholt!`,detail:"Der Ausreißer wurde von seinem Kapitän eingeholt und unterstützt das Team ab jetzt mit frischen Kräften!"}))}if(this.superTeamBreakawayRiderCaught&&this.superTeamBreakawayRiderId!=null){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&(l.breakawayMalus=0)}for(const l of this.riders){if(ae(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,u=Math.max(0,r-p);if(u<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-u),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const m=this.currentSegment(l),f=this.currentWindZone(l);if(!m||!f){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=p,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const b=Xt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=b,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[];continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,s);const g=this.calculateBasePhysics(l,m,f);l.activeTerrain=m.terrain,l.skillName=g.skillName,l.skillBreakdown=g.skillBreakdown,l.baseSkill=g.baseSkill,l.teamGroupBonus=g.teamGroupBonus,l.effectiveSkill=g.effectiveSkill,l.staminaPenalty=g.staminaPenalty,l.elevationPenalty=g.elevationPenalty,l.gradientPercent=g.gradientPercent,l.gradientModifier=g.gradientModifier,l.windModifier=g.windModifier,l.tempSpeedMps=g.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=g.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*u}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,r);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const p of this.riders)l.push(p);l.sort(fc);for(let p=0;p<l.length;p+=1){const u=l[p];if(ae(u))continue;const m=this.isActiveBreakawayRider(u),f=u.tempSpeedMps/14,g=Math.max(5,50*f),b=this.currentSegment(u),v=Math.max(15,150*f),y=Math.max(g,Math.min(v,oc(b==null?void 0:b.terrain))),T=bc(l,p,y),R=T.size,x=un(R),$=vc(R,T.positionInGroup);let C=0,I=Number.POSITIVE_INFINITY,P=null;for(let D=p-1;D>=0;D-=1){const _=l[D],E=_.distanceCoveredMeters-u.distanceCoveredMeters;if(E>=y+Gd)break;!this.canReceiveDraftFromCandidate(u,_)||this.isActiveBreakawayRider(_)||E<=0||E>=y||(C+=1,E<=I&&(I=E,P=_))}if(C===0||!P){if(m)continue;u.draftModifier=1,u.draftNearbyRiderCount=0,u.draftPackFactor=0,u.currentSpeedMps=u.tempSpeedMps,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,u.isLeadingGroup=!0,this.applyCaptainWaitLogic(u);continue}const F=ae(P)?P.tempSpeedMps:P.currentSpeedMps,L=I,H=L<=g?1:1-(L-g)/Math.max(1e-4,y-g),G=this.currentWindZone(u),K=(G==null?void 0:G.vector)??0,w=(G==null?void 0:G.windSpeedKph)??0,A=-K*(w/70),W=Math.max(.3,.35+.35*A)*Math.min(1,f)*rn,ne=he((b==null?void 0:b.gradient_percent)??0,-20,20),q=dn(ne),Y=1+($?0:W*H*x*q),j=u.tempSpeedMps*Y;if(!(m&&Y<=u.draftModifier)){if(u.draftModifier=Y,u.draftNearbyRiderCount=R,u.draftPackFactor=x,u.isLeadingGroup=$,j>F){if(u.tempSpeedMps>P.tempSpeedMps){u.currentSpeedMps=j,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t;continue}if(L<1){u.currentSpeedMps=F,u.nextDistanceCoveredMeters=P.distanceCoveredMeters+F*t,m||this.applyCaptainWaitLogic(u);continue}u.currentSpeedMps=Math.min(j,F+2),u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,m||this.applyCaptainWaitLogic(u);continue}u.currentSpeedMps=j,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,m||this.applyCaptainWaitLogic(u)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(ae(l))continue;if(this.superTeamId!=null&&l.rider.activeTeamId===this.superTeamId&&!this.superTeamProtectedLeaderIds.has(l.rider.id)){const y=l.rider.id===this.superTeamBreakawayRiderId;if(!y||this.superTeamBreakawayRiderCaught){const T=l.distanceCoveredMeters/this.stageDistanceMeters;let R=0,x=!1,$=!1;y?T<this.superTeamEndPercent?x=!0:l.superTeamActiveLogged&&($=!0):T>=this.superTeamStartPercent&&T<this.superTeamEndPercent?x=!0:T>=this.superTeamEndPercent&&l.superTeamActiveLogged&&($=!0),x?(R=this.superTeamBonusAmount,l.superTeamActiveLogged||(l.superTeamActiveLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} leistet Führungsarbeit!`,detail:y?`Der eingeholte Ausreißer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`:`Der Edelhelfer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`}))):$&&(l.superTeamMalusAmount==null&&(l.superTeamMalusAmount=xr(4,8)),R=-l.superTeamMalusAmount,l.superTeamExhaustedLogged||(l.superTeamExhaustedLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"warning",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} ist erschöpft!`,detail:`Die Führungsarbeit hat ihren Tribut gefordert. Der Fahrer erhält für den Rest der Etappe einen Malus von -${l.superTeamMalusAmount} auf Berg-, Hügel- und Flachpassagen.`}))),l.originalSkills||(l.originalSkills={flat:l.rider.skills.flat,mountain:l.rider.skills.mountain,mediumMountain:l.rider.skills.mediumMountain,hill:l.rider.skills.hill}),l.rider.skills.flat=l.originalSkills.flat+R,l.rider.skills.mountain=l.originalSkills.mountain+R,l.rider.skills.mediumMountain=l.originalSkills.mediumMountain+R,l.rider.skills.hill=l.originalSkills.hill+R}}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds)continue;const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,u=Math.max(0,r-p);if(u<=0)continue;const m=l.distanceCoveredMeters,f=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*u,g=l.pendingIncident;if(g&&m<g.triggerDistanceMeters&&f>=g.triggerDistanceMeters){const y=Math.max(.1,l.currentSpeedMps),T=Math.max(0,(g.triggerDistanceMeters-m)/y);l.distanceCoveredMeters=g.triggerDistanceMeters,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.applyIncident(l,g,p+T),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const b=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,f-l.distanceCoveredMeters)>=b){const y=b/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),l.finishTimeSeconds=p+y,l.currentSpeedMps=0;const T=Xt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=T,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[]}else l.distanceCoveredMeters=f,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,m,l.distanceCoveredMeters,p),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-u),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!ae(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=cn(),l.nextFormUpdateMeter+=pe(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),p=this.riders.filter(m=>l.has(m.rider.id)&&!ae(m)),u=this.riders.filter(m=>!l.has(m.rider.id)&&!ae(m));if(p.length>0&&u.length>0){const m=p.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,p[0]);u.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,u[0]).distanceCoveredMeters>=m.distanceCoveredMeters&&(m.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:m.rider.id,riderName:m.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${m.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const d=Rd(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of d.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!ae(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const r=new Map;for(const s of this.riders){if(ae(s)||s.rider.activeTeamId==null||a<=s.startOffsetSeconds)continue;const n=r.get(s.rider.activeTeamId)??[];n.push(s),r.set(s.rider.activeTeamId,n)}for(const s of r.values()){const n=s[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,s.length),d=[...s].sort((m,f)=>f.effectiveSkill-m.effectiveSkill||m.rider.id-f.rider.id).slice(0,o).reduce((m,f)=>m+f.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-s.length),p=Math.max(1,d-l),u=this.resolveTimeTrialSpeedMps(p,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*Ol(i.terrain,this.bootstrap.skillWeightRules??[]);for(const m of s){const f=Math.max(t,m.startOffsetSeconds),g=Math.max(0,a-f);m.currentSpeedMps=u,m.tempSpeedMps=u,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+u*g}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const s=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?s.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,d=i.rider.activeTeamId!=null?s.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==d?o-d:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(s=>[s.riderId,s.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((s,n)=>{const i=a.get(s.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(s)-this.resolveProjectedIttStartScore(n)||s.rider.id-n.rider.id}):[...t].sort((s,n)=>s.rider.skills.timeTrial-n.rider.skills.timeTrial||s.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,r=0;for(const s of this.bootstrap.stageSummary.segments){const n=(s.start_km+s.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,s.terrain),d=i>0?this.resolveWeightedSkill(t.rider,s.terrain,i):o,l=Math.max(0,o.value-d.value),{effectiveSkill:p}=this.resolveEffectiveSkill({rider:t,baseSkill:d.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),u=he(s.gradient_percent,-20,20),m=u>0?Math.exp(-.11*u):1-u*.06,f=this.windZones.find(b=>n>=b.startMeter&&n<=b.endMeter)??this.windZones[this.windZones.length-1],g=f?1+f.vector*(f.windSpeedKph/100)*.52:1;a+=p*m*g*s.length_km,r+=s.length_km}return r>0?a/r:0}resolveStartOffsetSeconds(t,a,r){if(this.isIndividualTimeTrial)return a*Ld;if(this.isTeamTimeTrial){const s=t.rider.activeTeamId;return(s!=null?r.get(s)??0:0)*Dd}return 0}buildIntermediateMarkers(){return tt(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||kt(t)).map(({key:t,label:a,marker:r,kmMark:s})=>({key:t,distanceMeters:s*1e3,label:a,markerType:r.type,markerCategory:r.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(d=>d.distanceMeters<t.groupPhaseEndDistanceMeters),r=this.stageDistanceMeters*ec,s=a.some(d=>d.distanceMeters<=r);if(!(a.length<=1||!s))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(wa,Math.ceil(r/wa)*wa);for(let d=o;d<t.groupPhaseEndDistanceMeters;d+=wa)i.push(d);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,r){const s=lc(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,d=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),p=Math.min(85,o.value)+l,u=this.isTimeTrialMode?0:t.teamGroupBonus,m=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:f,staminaPenalty:g,elevationPenalty:b}=this.resolveEffectiveSkill({rider:t,baseSkill:p,staminaPenalty:d,teamGroupBonus:u,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:m}),v=he(a.gradient_percent,-20,20),y=v>0?Math.exp(-.11*v):1-v*.06,T=1+r.vector*(r.windSpeedKph/100)*.52,R=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:s,skillBreakdown:o.breakdown,baseSkill:p,teamGroupBonus:u,effectiveSkill:f,staminaPenalty:g,elevationPenalty:b,gradientPercent:v,gradientModifier:y,windModifier:T,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(f,t.distanceCoveredMeters,a,y,T):this.resolveRoadStageSpeedMps(f,t.distanceCoveredMeters,a,y,T,R)}}resolveRoadStageSpeedMps(t,a,r,s,n,i){const o=this.resolveSkillSpreadFactor(a,r),d=this.resolveSegmentElevation(r,a),l=this.resolveElevationSkillSpreadFactor(r,d),m=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,m*s*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const r=Math.max(0,a-Wd),s=Math.floor(r/jd);return t.terrain==="Mountain"?1+(s*Vd+s*Math.max(0,s-1)*Ud/2):1+s*Od}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const r=a.filter(n=>n.activeTerrain===t.activeTerrain);return(r.length>0?r:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,r){if(r<=1)return{draftModifier:1,draftPackFactor:0};const s=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,d=-i*(o/70),p=Math.max(.3,.35+.35*d)*Math.min(1,s)*rn,u=he(a.gradient_percent,-20,20),m=dn(u),f=un(r);return{draftModifier:1+p*f*m,draftPackFactor:f}}resolveBreakawayTimeGapPenalty(t){if(t<on)return 0;const a=Math.floor((t-on)/Xd);return Qd+a}recordBreakawayFallbackCheckpointCrossings(t,a,r,s,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>r)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const d=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?s+d-t.startOffsetSeconds:s+d);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let s=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((d,l)=>l.distanceCoveredMeters-d.distanceCoveredMeters||l.currentSpeedMps-d.currentSpeedMps||d.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,s;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const d=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!d)break;const l=n.markerCrossings[d.key]??null;if(!l)break;const p=t.map(u=>u.markerCrossings[d.key]??null).filter(u=>u!=null).sort((u,m)=>u.crossingTimeSeconds-m.crossingTimeSeconds||u.riderId-m.riderId)[0]??null;if(p){const u=l.crossingTimeSeconds-p.crossingTimeSeconds;s=this.resolveBreakawayTimeGapPenalty(u),this.breakawayGapStatus={gapSeconds:u,penalty:s,kmMark:d.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const d=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[d]??null;if(l==null)break;const p=t.map(u=>u.breakawayFallbackCheckpointTimes[d]??null).filter(u=>u!=null).sort((u,m)=>u-m)[0]??null;if(p!=null){const u=l-p;s=this.resolveBreakawayTimeGapPenalty(u),this.breakawayGapStatus={gapSeconds:u,penalty:s,kmMark:d<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[d]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return s}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),r=this.riders.filter(o=>!ae(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),s=this.riders.filter(o=>!ae(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(r.length===0||s.length===0){this.breakawayGapStatus=null;return}const n=[...r].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null,i=[...s].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const d=this.intermediateMarkers[o];if(!d)continue;const l=n.markerCrossings[d.key]??null,p=i.markerCrossings[d.key]??null;if(!l||!p)continue;const u=p.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:u,penalty:this.resolveBreakawayTimeGapPenalty(u),kmMark:d.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const d=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(d==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,p=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||p==null)continue;const u=p-l;this.breakawayGapStatus={gapSeconds:u,penalty:this.resolveBreakawayTimeGapPenalty(u),kmMark:d/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=new Set(a.riderIds),s=this.riders.filter(o=>!ae(o)&&r.has(o.rider.id));if(s.length===0)return;const n=this.riders.filter(o=>!ae(o)&&!r.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(s,n);for(const o of s)o.breakawayGapPenalty=i;for(const o of s){const d=this.currentSegment(o);if(!d)continue;const p=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=p,o.tempSpeedMps=this.resolveRoadStageSpeedMps(p,o.distanceCoveredMeters,d,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(d.terrain));const u=this.resolveMaxBreakawayDraftModifier(o,d,s.length);o.draftModifier=u.draftModifier,o.draftNearbyRiderCount=Math.max(0,s.length-1),o.draftPackFactor=u.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*u.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,r,s,n){return this.resolveRoadStageSpeedMps(t,a,r,s,n,.5)}syncRiderTelemetry(t,a=null){var i;const r=this.currentSegment(t),s=this.currentWindZone(t);if(ae(t)||!r||!s){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,r,s);t.segmentStartKm=r.start_km,t.segmentEndKm=r.end_km,t.segmentStartElevation=r.start_elevation,t.segmentEndElevation=r.end_elevation,t.activeTerrain=r.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),r=this.riders.reduce((n,i)=>ae(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(r<=t.phaseEndDistanceMeters)return!1;let s=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(r<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<sc){n.breakawayMalus=0,s=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),d=Math.floor(o/tc),l=Math.min(rc,n.breakawayInitialMalus),p=Math.max(l,n.breakawayInitialMalus-d*ac),u=Kt(p);u!==n.breakawayMalus&&(n.breakawayMalus=u,s=!0)}return s}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const r=new Set(a.riderIds);for(const s of this.riders)ae(s)||!r.has(s.rider.id)||this.syncRiderTelemetry(s,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(s=>t.riderIds.includes(s.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const s of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:s.rider.id,riderName:s.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(s.rider.id,s.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let r=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),r=!0}if(this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayMalus=t.malusValue,s.breakawayInitialMalus=t.malusValue,s.breakawayRecoveryStartDistanceMeters=null,s.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return r}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=this.riders.filter(o=>!ae(o)&&a.riderIds.includes(o.rider.id));if(r.length===0)return;const s=[...r].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0];if(!s)return;const n=Math.max(.1,s.currentSpeedMps),i=s.distanceCoveredMeters+n*t;for(const o of r){if(Math.max(0,s.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?yd:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const r=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(r==null||r.isCounterAttack)return!0;const s=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(s==null?void 0:s.isCounterAttack)===!0&&s.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(r=>r.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const r=this.resolvePreStageGcRank(t);return r!=null?`${a} (${r}.)`:a}triggerStageAttacksForRider(t,a,r,s){if(ae(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||r<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(r/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const d=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/d),p=s+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:p,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const u=new Set(this.activeStageAttacksByRiderId.keys()),m=this.stageFavorites.slice(0,20).filter(b=>{if(b.kind!=="rider"||b.riderId==null)return!1;const v=this.riders.find(T=>T.rider.id===b.riderId);if(!v||ae(v))return!1;const y=t.distanceCoveredMeters-v.distanceCoveredMeters;return y>=0&&y<=150}),f=Md(m,t.rider.id,u),g=[];for(const b of f){const v=this.riders.find(y=>y.rider.id===b);!v||ae(v)||this.activeStageAttacksByRiderId.has(b)||(this.activeStageAttacksByRiderId.set(b,{riderId:b,remainingSeconds:tn,startedAtElapsedSeconds:p,triggerDistanceMeters:v.distanceCoveredMeters,durationSeconds:tn,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),v.isAttacking=!0,g.push({riderId:b,riderName:this.formatRiderWithPreStageGc(b,v.riderName),riderTeamId:v.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:p,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const b of g)this.pushMessage({elapsedSeconds:p,riderId:b.riderId,riderName:b.riderName,type:"counter_attack",tone:"warning",title:`${b.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const r of t){if(r.finishStatus==="dnf")continue;const s=a[a.length-1];if(!s||Math.abs(s.distanceMeter-r.distanceCoveredMeters)>=xa){a.push({riderIds:[r.rider.id],riderCount:1,distanceMeter:r.distanceCoveredMeters,distanceSum:r.distanceCoveredMeters});continue}s.riderIds.push(r.rider.id),s.riderCount+=1,s.distanceSum+=r.distanceCoveredMeters,s.distanceMeter=s.distanceSum/s.riderCount}return a.map(({distanceSum:r,...s})=>s)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!ae(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),r=new Map;let s=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],d=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-d<xa;){const u=a[n].rider.activeTeamId;u!=null&&r.set(u,(r.get(u)??0)+1),n+=1}for(;s<a.length&&d-a[s].distanceCoveredMeters>=xa;){const u=a[s].rider.activeTeamId;if(u!=null){const m=(r.get(u)??0)-1;m<=0?r.delete(u):r.set(u,m)}s+=1}const l=o.rider.activeTeamId,p=l==null?0:Math.max(0,(r.get(l)??0)-1);t.set(o.rider.id,p===0?0:Kt(p*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?Kd:0,r=this.resolveBreakawaySkillBonus(t.rider),s=t.baseSkill+Za(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+r+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,s),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const r=he(this.stageDistanceMeters/1e3,Jd,qd),s=this.interpolateStaminaDistanceValue(r),n=he(t,nn,wr),i=(wr-n)/(wr-nn),o=s/3+i*s,d=this.stageDistanceMeters<=0?0:he(a/this.stageDistanceMeters,0,1);return o*d**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=Tt[0].kmMark)return Tt[0].value;for(let a=0;a<Tt.length-1;a+=1){const r=Tt[a],s=Tt[a+1];if(t<=s.kmMark){const n=Math.max(1e-4,s.kmMark-r.kmMark),i=(t-r.kmMark)/n;return r.value+(s.value-r.value)*i}}return Tt[Tt.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/Tr),r=Math.max(1,Math.ceil(t/Tr)),s=pe(_d,Ad),n=Array.from({length:r},()=>pe(.2,1.2)),i=n.reduce((l,p)=>l+p,0),o=Array.from({length:a+1},()=>1);o[0]=s;let d=0;for(let l=1;l<=r;l+=1)d+=n[l-1]??0,o[l]=s+(1-s)*(d/i);return o}resolveSkillSpreadFactor(t,a){const r=this.stageDistanceMeters<=0?1:he(t/this.stageDistanceMeters,0,1),s=Math.min(this.spreadCurve.length-1,Math.floor(r/Tr)),n=this.spreadCurve[s]??1;if(r<=this.lateStageStartRatio)return n;const i=Vl(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),d=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=he((r-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),p=this.interpolateFinalSpread(o,l);if(o<=1&&d<=1)return n;if(r<this.finalPushStartRatio||d<=o)return Math.max(n,p);const u=he((r-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),m=o+(d-o)*u;return Math.max(n,m)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const r=wi(this.simulationMode,t,this.skillWeightRuleMap).map(s=>({key:s.key,weight:s.weight}));return this.weightedSkillComponentsByTerrain.set(t,r),r}resolveWeightedSkill(t,a,r=0){const s=this.resolveWeightedSkillComponents(a),n=r>0||t.mentorBoosts?{...t.skills}:t.skills;if(r>0&&(n.stamina=Math.max(0,n.stamina-r)),t.mentorBoosts)for(const[l,p]of Object.entries(t.mentorBoosts))typeof p=="number"&&(n[l]+=p);let i=0,o=0;for(const l of s)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:jl(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,s)}}resolveSkillBreakdown(t,a,r){const s=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(s);if(n!==void 0)return n;const i=dc(t,r);return this.skillBreakdownCache.set(s,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const r=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,s=Math.max(0,100-r)/1e3,n=this.resolveElevationBucket(a);return s*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const r=a??this.interpolateElevation(t.distanceCoveredMeters),s=this.resolveElevationBucket(r);return s===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=s,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,r)),t.elevationPenalty}resolveSegmentElevation(t,a){const r=t.start_km*1e3,s=t.end_km*1e3,n=Math.max(1e-4,s-r),i=he((a-r)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const s=he(t,0,this.stageDistanceMeters)/1e3;if(s<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(s<=o.kmMark){const d=Math.max(1e-4,o.kmMark-i.kmMark),l=(s-i.kmMark)/d;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),Mr(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var u;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(xe).sort((m,f)=>(m.finishTimeSeconds??0)-(f.finishTimeSeconds??0)||f.photoFinishScore-m.photoFinishScore||m.rider.id-f.rider.id);if(t.length===0)return;const a=[];let r=null;for(const m of t){const f=m.finishTimeSeconds??0;if(a.length===0){a.push(m),r=f;continue}if(r!=null&&f-r<=ia){a.push(m),r=f;continue}break}const s=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=m=>m.photoFinishScore,o=[...a].sort((m,f)=>i(f)-i(m)||m.rider.id-f.rider.id),d=((u=o[0])==null?void 0:u.finishTimeSeconds)??0,l=this.finishWeightProfile,p=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${p} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${ia.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${s}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((m,f)=>{const g=hc(m,l).map($=>`${_i[$.skillKey]} ${$.contribution.toFixed(2)} = ${$.effectiveSkill.toFixed(2)} x ${($.weight*100).toFixed(0)}%`).join(" | "),b=m.finishTimeSeconds??0,v=b-d,y=v<=1e-4?`${b.toFixed(2)} s`:`${b.toFixed(2)} s (+${v.toFixed(2)} s)`,T=this.calculatePhotoFinishScore(m),R=m.leadoutBonus??0,x=Xt(m,s,n);console.log(`#${f+1} Zielsprint | ${m.riderName} | Zeit ${y} | Score (ohne Boni): ${T.toFixed(2)} -> Score (mit Boni): ${m.photoFinishScore.toFixed(2)} [SpecAdj: ${x>0?"+":""}${x.toFixed(2)}, Leadout: +${R.toFixed(2)}] | ID-Tiebreak ${m.rider.id} | (${g})`)}),console.groupEnd()}recordIntermediateSplits(t,a,r,s,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>r)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,d=Math.max(0,this.isTimeTrialMode?s+o-t.startOffsetSeconds:s+o);let l=this.resolveMarkerCrossingScore(t,i);const p=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;p&&(l+=Xt(t,p,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=d,t.splitTimes[i.key]=d,t.splitTimes[i.label]=d,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:d,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return Mr(t,this.resolveSprintWeightProfile());const r=Mr(t,this.resolveClimbWeightProfile(a.markerCategory)),s=ic(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return r+s}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??Id}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??Pd[a]}calculatePreLeadoutFinishScore(t){const r=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,s=Za(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[d,l])=>{if(!l)return o;const p=d==="stamina"?r:0,u=Math.max(0,t.rider.skills[d]+s+t.dailyForm+t.microForm+t.teamGroupBonus-p);return o+u*l},0),i=Xt(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}applySprintLeadoutBonuses(){const t=this.resolveFinishMarkerType();if(t!=="finish_flat"&&t!=="finish_hill"||this.isTimeTrialMode)return;const a=this.riders.filter(xe).sort((o,d)=>(o.finishTimeSeconds??0)-(d.finishTimeSeconds??0));if(a.length===0)return;const r=[];let s=null;for(const o of a){const d=o.finishTimeSeconds??0;if(r.length===0){r.push(o),s=d;continue}if(s!=null&&d-s<=ia){r.push(o),s=d;continue}break}const n=new Set(r.map(o=>o.rider.id)),i=new Map;for(const o of this.riders)if(o.finishStatus!=="dnf"&&o.finishStatus!=="otl"&&o.finishStatus!=="dns"&&o.finishTimeSeconds!=null&&o.rider.skills.sprint>=73&&o.rider.activeTeamId!=null&&n.has(o.rider.id)){const d=o.rider.activeTeamId,l=i.get(d)??[];l.push(o),i.set(d,l)}for(const[o,d]of i.entries()){if(d.length===0)continue;let l=null,p=Number.NEGATIVE_INFINITY;for(const u of d){const m=this.calculatePreLeadoutFinishScore(u);m>p?(p=m,l=u):m===p&&l!==null&&(u.rider.skills.sprint>l.rider.skills.sprint||u.rider.skills.sprint===l.rider.skills.sprint&&u.rider.id<l.rider.id)&&(l=u)}if(l){const u=this.calculateSprintLeadoutBonusForRider(l);u>0&&(l.leadoutBonus=u,l.photoFinishScore+=u)}}}calculateSprintLeadoutBonusForRider(t){const a=t.rider.activeTeamId;if(a==null)return 0;const r=this.riders.filter(p=>p.rider.activeTeamId===a);if(r.length===0)return 0;let s=this.teamSprintRandomValues.get(a);s===void 0&&(s=pe(.25,.6),this.teamSprintRandomValues.set(a,s));let n=this.teamSprintSpecialRandomValues.get(a);n===void 0&&(n=pe(.1,.3),this.teamSprintSpecialRandomValues.set(a,n)),t.leadoutRiderId=null;let i=0,o=0,d=null;const l=[];for(const p of r){if(p.rider.id===t.rider.id||p.finishStatus==="dnf"||p.finishStatus==="otl"||p.finishStatus==="dns")continue;let u=0;const m=p.rider.skills.sprint>=72,f=p.rider.skills.flat>=78,g=p.rider.skills.timeTrial>=76,b=p.rider.skills.acceleration>=80;if(m&&u++,f&&u++,g&&u++,b&&u++,u>0){const v=m?s:n;let y=1;u===2?y=1.25:u===3?y=1.5:u===4&&(y=2);const T=v*y*1.5;if(i+=v*y,l.push({riderId:p.rider.id,name:p.riderName,contribution:Number(T.toFixed(2))}),v*y>o)o=v*y,d=p.rider.id;else if(v*y===o&&d!==null){const R=this.riders.find(x=>x.rider.id===d);R&&p.rider.skills.sprint>R.rider.skills.sprint&&(d=p.rider.id)}}}return i>0&&(t.leadoutRiderId=d,t.leadoutContributions=l),i*1.5}resolveFinishMarkerType(){const t=tt(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const r=t[a].marker.type;if(r==="finish_flat"||r==="finish_hill"||r==="finish_mountain")return r}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return Ed;case"finish_mountain":return Fd;default:return Cd}}resolveRiderClockSeconds(t){if(xe(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,r,s=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(d=>d.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){s=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const d=this.riders.find(p=>p.rider.id===o);if(!d||ae(d))continue;if(Math.abs(d.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const p=Xl(d.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(d,p,r,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:s?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:s?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:r,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(r=>r.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+xa){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const yc=300;async function Sc(e,t){const a=new Bi(e,{maxSubstepSeconds:5});let r=!1;for(;!r;){const s=a.step(yc);if(r=s.isFinished,t){const n=s.stageDistanceMeters>0?s.leaderDistanceMeters/s.stageDistanceMeters:0,i=e.riders.length>0?s.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const kc=[1,2,5,10,25,50,100,250,500],mn=new WeakMap;function $c(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function pn(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function xc(e){const t=mn.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${kc.map(r=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return mn.set(e,a),a}function gn(e,t){const a=xc(e);a.timeField&&(a.timeField.textContent=$c(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${pn(t.snapshot.leaderDistanceMeters)} / ${pn(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(r=>{const s=Number(r.dataset.raceSimSpeed);r.classList.toggle("active",s===t.timeMultiplier)})}const Tc=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function wc(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),r=t%60;return`${a}:${String(r).padStart(2,"0")}`}function Yt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Mc(e){return`/jersey/Jer_${e}.png`}function Hi(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${Yt(Mc(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Rc(e){return e.riderId==null||e.riderTeamId==null?"":Hi(e.riderTeamId)}function Ic(e){const t=Yt(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function Cc(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${Yt(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${Yt(e)}</button>`}function Ec(e,t){if(t==="all")return!0;const a=Gi(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function Fc(e){const t=e.detail?Yt(e.detail):"",a=(e.secondaryRiders??[]).map(s=>`${s.riderTeamId!=null?Hi(s.riderTeamId,"race-sim-message-inline-jersey"):""}${Cc(s.riderName,s.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const r=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${r}</span>`}function Gi(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function fn(e,t,a="all"){const r=t.filter(n=>Ec(n,a)),s=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${Tc.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${r.length===0?`<div class="race-sim-message-empty">${s}</div>`:r.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${Yt(Gi(n))}">
          <span class="race-sim-message-time">t=${wc(n.elapsedSeconds)}</span>
          ${Rc(n)}
          <span class="race-sim-message-text">
            ${Ic(n)}
            ${Fc(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const Pc=1,Nc={Flat:12,Rolling:14,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:23,High_Mountain:25,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function Lc(e){return Math.max(0,Math.round(e))}function zi(e){return e==="ITT"||e==="TTT"}function Dc(e){return Nc[e]??20}function _c(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+Dc(e)/100))}function Ac(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function hn(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function Rr(e,t){if(zi(t))return[...e].sort(Ac);const a=[...e].sort((o,d)=>o.stageTimeSeconds-d.stageTimeSeconds||hn(o,d)),r=[];let s=[],n=null;const i=()=>{r.push(...s.sort(hn))};for(const o of a){if(s.length===0){s=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=Pc){s.push(o),n=o.stageTimeSeconds;continue}i(),s=[o],n=o.stageTimeSeconds}return s.length>0&&i(),r}function Q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Bc(e){return`/jersey/Jer_${e}.png`}function fa(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${Q(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${Q(Bc(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function ha(e,t,a){return e==null?`<span class="${a}" title="${Q(t)}">${Q(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${Q(t)}">${Q(t)}</button>`}function Hc(e){return e.toFixed(1).replace(".",",")}function Ja(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Gc(e){return`${e??0} Pkt.`}function zc(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function Kc(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function Ki(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Wc(e){if(e==null||e<=0)return Ki(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function vt(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function Ra(e){return`${e.toFixed(1).replace(".",",")} km`}function bn(e){return`${e.toFixed(1).replace(".",",")}%`}function Ia(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function vn(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function jc(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function Oc(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function Vc(e,t,a){return Array.from({length:t},(r,s)=>e.slice(s*a,(s+1)*a))}function Uc(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const r=Vc(e,4,5),s=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${r.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=Oc(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${fa(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${ha(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${Q(i.roleLabel)}">${Q(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?s.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${Q(Ja(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${Hc(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function ma(e,t){const a=e.riders.find(r=>r.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function cr(e,t){const a=e.riders.find(n=>n.id===t),r=(a==null?void 0:a.activeTeamId)??null,s=r!=null?e.teams.find(n=>n.id===r)??null:null;return{teamId:r,teamName:(s==null?void 0:s.name)??null}}function Yc(e,t,a,r={}){const s=(t??[]).slice(0,r.limit??8);return s.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${s.map(n=>{var u;const i=n.riderId??0,o=cr(e,i),d=ma(e,i),l=((u=r.distanceGapsByRiderId)==null?void 0:u.get(i))??null,p=[r.distanceGapClassName??"",Kc(l)].filter(m=>m.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${fa(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${ha(n.riderId,d,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${r.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${p}">${Q(zc(l))}</span>`:""}
      </article>`}).join("")}</div>`}function Ca(e,t,a,r,s,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${Q(e)}</h4>
      ${Yc(a,r,s,n)}
    </section>`}function _t(e,t,a,r,s=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${r}" ${s?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${r}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${Q(e)}</span>
      </summary>
      ${t}
    </details>`}function qa(e,t,a,r){const s=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var d;const i=s.get(n.id)??null,o=((d=a.get(n.id))==null?void 0:d[r])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||ma(e,n.riderId).localeCompare(ma(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function yn(e){const t=Zc(e)?e.stagePoints:0;return`${Q(Gc("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${Q(t)}</span></span>`:""}`}function Zc(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function Sn(e,t){if(t==null)return new Map;const a=e.riders.find(r=>r.riderId===t)??null;return a?new Map(e.riders.map(r=>[r.riderId,a.distanceCoveredMeters-r.distanceCoveredMeters])):new Map}function Jc(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function Ha(e,t){var r;const a=(r=e.race.category)==null?void 0:r.bonusSystem;return!a||t==null||t==="Sprint"?[]:vt(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function ns(e){var r;const t=(r=e.race.category)==null?void 0:r.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return vt(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return vt(a?t.pointsMountainStage:t.pointsSprintFinish)}function Wi(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:vt((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function qc(e,t,a){let r=null;for(const s of e.stageSummary.segments){const n=Math.max(t,s.start_km),i=Math.min(a,s.end_km),o=Math.max(0,i-n);if(o<=0)continue;const d={lengthKm:o,gradient:s.gradient_percent};(r==null||d.gradient>r.gradient||d.gradient===r.gradient&&d.lengthKm>r.lengthKm)&&(r=d)}return r}function Ir(e,t,a,r=null){return e.entries.filter(s=>r==null||r.has(s.riderId)).map((s,n)=>({riderId:s.riderId,rank:s.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:s.crossingTimeSeconds,gapSeconds:s.gapSeconds})).filter(s=>s.points>0)}function is(e){const t=new Map;for(const a of e)for(const r of a.entries){const s=t.get(r.riderId)??{points:0,mountain:0};r.pointsKind==="mountain"?s.mountain+=r.points:s.points+=r.points,t.set(r.riderId,s)}return t}function Xc(e){return tt(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function Xa(e,t){const a=zi(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?Lc(a):null}function ur(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=Xa(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const r=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(r)||r<=0)return Rr(a,e.stage.profile).map(n=>n.rider);const s=_c(e.stage.profile,a.map(n=>n.stageTimeSeconds));return s==null?Rr(a,e.stage.profile).map(n=>n.rider):Rr(a.filter(n=>n.stageTimeSeconds<=s),e.stage.profile).map(n=>n.rider)}function Qc(e,t){const a=ns(e);return a.length===0?[]:ur(e,t).map((r,s)=>({riderId:r.riderId,rank:s+1,points:a[s]??0,pointsKind:"points",crossingTimeSeconds:Xa(e,r),gapSeconds:null})).filter(r=>r.points>0)}function eu(e,t){const a=ur(e,t).slice(0,20),r=a[0]!=null?Xa(e,a[0])??0:0;return a.map((s,n)=>{const i=Xa(e,s)??0;return{riderId:s.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-r),photoFinishScore:s.photoFinishScore}})}function tu(e,t){var a;return((a=ur(e,t)[0])==null?void 0:a.riderId)??null}function os(e,t,a){var R,x;const r=tt(e.stageSummary),s=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(ur(e,a).map($=>$.riderId)):null,i=r.filter(({marker:$})=>$.type==="climb_start"),o=r.filter(({marker:$})=>kt($)).sort(($,C)=>$.kmMark-C.kmMark).map(($,C)=>{var ne,q;const I=[...i].reverse().find(ee=>ee.kmMark<=$.kmMark)??null,P=Jc(e,$.kmMark),F=(I==null?void 0:I.kmMark)??(P==null?void 0:P.start_km)??$.kmMark,L=(I==null?void 0:I.elevation)??(P==null?void 0:P.start_elevation)??$.elevation,H=Math.max(0,$.kmMark-F),G=H>0?($.elevation-L)/(H*1e3)*100:(P==null?void 0:P.gradient_percent)??0,K=qc(e,F,$.kmMark),w=t.find(ee=>ee.markerKey===$.key)??null,A=Ha(e,(w==null?void 0:w.markerCategory)??$.marker.cat??null),U=w?Ir(w,A,"mountain",n):[],W=(w==null?void 0:w.markerCategory)??$.marker.cat??null;return{key:$.key,title:`${C+1}. Bergwertung`,label:$.label,categoryLabel:W?`Kat. ${W}`:null,categoryClassName:vn(W),kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:H,averageGradient:G,steepestSegmentLengthKm:(K==null?void 0:K.lengthKm)??null,steepestSegmentGradient:(K==null?void 0:K.gradient)??null,highlightMeta:$.kmMark>=s,leaderRiderId:((ne=U[0])==null?void 0:ne.riderId)??((q=w==null?void 0:w.entries[0])==null?void 0:q.riderId)??null,displayBadges:Ia(A,"mountain"),entries:U,timingEntries:(w==null?void 0:w.entries)??[],accent:"mountain"}}),d=r.filter(({marker:$})=>$.type==="sprint_intermediate").sort(($,C)=>$.kmMark-C.kmMark).map(($,C)=>{var L,H;const I=t.find(G=>G.markerKey===$.key)??null,P=Wi(e),F=I?Ir(I,P,"points",n):[];return{key:$.key,title:`${C+1}. Zwischensprint`,label:$.label,categoryLabel:null,categoryClassName:null,kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((L=F[0])==null?void 0:L.riderId)??((H=I==null?void 0:I.entries[0])==null?void 0:H.riderId)??null,displayBadges:Ia(P,"points"),entries:F,timingEntries:(I==null?void 0:I.entries)??[],accent:"sprint"}}),l=Xc(e),p=Qc(e,a),u=l?t.find($=>$.markerKey===l.key)??null:null,m=u?Ir(u,Ha(e,u.markerCategory),"mountain",n):[],f=ns(e),g=u?Ha(e,u.markerCategory):[],b=e.stage.profile==="ITT"||e.stage.profile==="TTT"?eu(e,a):(u==null?void 0:u.entries)??[],v=((R=p[0])==null?void 0:R.riderId)??((x=m[0])==null?void 0:x.riderId)??tu(e,a),y={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:u!=null&&u.markerCategory?`Kat. ${u.markerCategory}`:null,categoryClassName:vn((u==null?void 0:u.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(u!=null&&u.markerCategory),leaderRiderId:v,displayBadges:[...Ia(f,"points"),...Ia(g,"mountain")],entries:[...p,...m],timingEntries:b,accent:"finish"};return[...[...d,...o].sort(($,C)=>$.kmMark-C.kmMark||$.title.localeCompare(C.title,"de")),y].filter($=>$.entries.length>0||$.timingEntries.length>0||$.accent!=="finish"||l!=null||a.isFinished)}function au(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),r=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,s=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,r):t.entries.slice(0,r).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return s.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${s.map(n=>{const i=cr(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${fa(i.teamId,i.teamName)}
            ${ha(n.riderId,ma(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?Q(Ki(n.crossingTimeSeconds)):Q(Wc(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function kn(e,t){var a;return((a=e==null?void 0:e.find(r=>r.riderId===t))==null?void 0:a.points)??0}function $n(e,t){var a;return((a=e.filter(r=>r.riderId!=null&&t.has(r.riderId)).sort((r,s)=>r.rank-s.rank||r.riderId-s.riderId)[0])==null?void 0:a.riderId)??null}function Ea(e,t,a){if(!(!t||e.some(r=>r.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function ru(e,t,a,r,s){const n=new Set(e.riderIds),i=new Map(t.riders.map(f=>[f.riderId,f])),d=e.riderIds.map(f=>i.get(f)??null).filter(f=>f!=null).sort((f,g)=>{var b,v;return(((b=a.get(f.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)-(((v=a.get(g.riderId))==null?void 0:v.rank)??Number.MAX_SAFE_INTEGER)||f.riderName.localeCompare(g.riderName,"de")||f.riderId-g.riderId}).slice(0,25),l=i.get($n(r,n)??-1)??null,p=i.get($n(s,n)??-1)??null,u=l!=null&&!d.some(f=>f.riderId===l.riderId),m=p!=null&&!d.some(f=>f.riderId===p.riderId);return d.length>=25&&u&&m&&l.riderId!==p.riderId?(Ea(d,l,23),Ea(d,p,24),d):(Ea(d,l,24),Ea(d,p,24),d)}function su(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function nu(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function xn(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function iu(e,t){const a=t.riders.filter(s=>e.riderIds.includes(s.riderId)).reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0),r=Math.max(0,t.leaderDistanceMeters-a);return r>0?`-${Math.round(r)} m`:"—"}function ou(e,t,a,r,s,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=El(a,r),d=a.find(m=>m.label===o)??a[0],l=new Map(e.gcStandings.map(m=>[m.riderId,m])),p=is(i),u=ru(d,t,l,s,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${Q(d.label)} <span class="race-sim-group-count">(${d.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${Q(xn(d.previousGapMeters,"-"))}</span>
        <span>Leader ${Q(iu(d,t))}</span>
        <span>Hinten ${Q(xn(d.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${u.map((m,f)=>{const g=l.get(m.riderId)??null,b=cr(e,m.riderId),v=p.get(m.riderId)??{points:0,mountain:0},y=kn(s,m.riderId),T=kn(n,m.riderId),R=su(m.riderId,e.classificationLeaders),x=R.length>0?R.map($=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[$]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${nu(R)}" title="${Q(x)}">${f+1}.</strong>
              ${fa(b.teamId,b.teamName)}
              <span class="race-sim-classification-main">
                ${ha(m.riderId,m.riderName,`race-sim-group-rider-name${m.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${g?g.rank:"—"} · ${Q(g?Ja(g.gapSeconds):"—")} · ${Q(m.gapToLeaderMeters>0?`+${Math.round(m.gapToLeaderMeters)} m`:"—")}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${y}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${T}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${v.points>0?`▲ +${v.points}`:" "}</span>
                  <span class="race-sim-breakaway-stage-gain">${v.mountain>0?`▲ +${v.mountain}`:" "}</span>
                </span>
              </span>
            </article>`}).join("")}
      </div>
    </section>`}function lu(e,t,a,r){const s=os(t,a.markerClassifications,a),n=is(s),i=qa(t,t.pointsStandings,n,"points"),o=qa(t,t.mountainStandings,n,"mountain"),d=ss(rs(a.clusters));e.innerHTML=ou(t,a,d,r,i,o,s)}function du(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function cu(e){const t=tt(e.stageSummary),a=Wi(e)[0]??0,r=ns(e)[0]??0,s=t.filter(({marker:n})=>kt(n)).reduce((n,{marker:i})=>n+(Ha(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+r,mountain:s}}function Tn(e){const t=cu(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function uu(e){const t=jc(e),a=[`<span class="race-sim-stage-points-meta-pill">${Q(Ra(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${Q(`${Ra(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${Q(`Länge ${Ra(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${Q(`Ø ${bn(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${Q(`Steilstes ${Ra(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${Q(bn(e.steepestSegmentGradient))}</span>`:""].filter(r=>r.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${Q(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${Q(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${Q(e.label)}">${Q(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((r,s)=>`${s>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${r}`).join("")}
    </span>`}function mu(e,t,a,r=null){const s=r??os(e,t,a);return s.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${Tn(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${Tn(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${s.map(n=>{const i=n.leaderRiderId!=null?cr(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?ma(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${uu(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${du(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${fa(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?ha(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${Q(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${au(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function pu(e,t,a,r,s,n=new Set){var f,g;const i=os(a,r,s),o=is(i),d=qa(a,a.pointsStandings,o,"points"),l=qa(a,a.mountainStandings,o,"mountain"),p=Sn(s,((f=a.gcStandings[0])==null?void 0:f.riderId)??null),u=Sn(s,((g=a.youthStandings[0])==null?void 0:g.riderId)??null),m=b=>!n.has(b);e.innerHTML=`
    ${_t("Stage Favorites",Uc(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",m("favorites"))}
    <section class="race-sim-classifications-section">
      ${_t("GC",Ca("GC","gc",a,a.gcStandings,b=>Q(`GC ${b.rank} · ${Ja(b.gapSeconds)}`),{limit:20,distanceGapsByRiderId:p}),"race-sim-overview-classification race-sim-overview-gc","gc",m("gc"))}
      ${_t("Punktewertung",Ca("Punktewertung","points",a,d,yn),"race-sim-overview-classification race-sim-overview-points","points",m("points"))}
      ${_t("Bergwertung",Ca("Bergwertung","mountain",a,l,yn),"race-sim-overview-classification race-sim-overview-mountain","mountain",m("mountain"))}
      ${_t("Nachwuchsfahrerwertung",Ca("Nachwuchsfahrerwertung","youth",a,a.youthStandings,b=>Q(`${b.rank}. · ${Ja(b.gapSeconds)}`),{distanceGapsByRiderId:u,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",m("youth"))}
    </section>
    ${_t("Etappenwertungen",mu(a,r,s,i),"race-sim-overview-stage-scoring","stageScoring",m("stageScoring"))}
  `}const wn=new WeakMap,Qe=new WeakMap,Mn=new WeakMap,ji=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function X(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Oi(e){return e<=0?"—":`+${Math.round(e)} m`}function oa(e){const t=ji.format(e);return e>0?`+${t}`:t}function Cr(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function ce(e){return ji.format(e)}function Nt(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Vi(e){return`+${Nt(e)}`}function Ui(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function ls(e){return`${(e*3.6).toFixed(1)} km/h`}function gu(e){return`${oa(e)}%`}function Wr(e){return`${e.toFixed(1).replace(".",",")} km`}function Yi(e){return`${Wr(e.segmentStartKm)} - ${Wr(e.segmentEndKm)}`}function fu(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function Zi(e){return e.replace(/_/g," ")}function Ji(e){return Zi(e)}function hu(e){return Zi(e)}function qi(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function bu(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function vu(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Xi(e){return tt(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||kt(t)).map(({key:t,label:a})=>({key:t,label:a}))}function yu(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function Su(e,t,a,r){var s;return a!=="ITT"&&a!=="TTT"?((s=r.get(t))==null?void 0:s.get(e.riderId))??null:e.splitTimes[t]??null}function Qi(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(s=>({label:s.key,displayLabel:s.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${s.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function ku(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function $u(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function eo(e){const t=wn.get(e);if(t)return t;const a=Xi(e),r={splitMarkers:a,columns:Qi(e,a,!1),riderById:new Map(e.riders.map(s=>[s.id,s])),teamById:new Map((e.teams??[]).map(s=>[s.id,s])),teamAbbreviationById:new Map((e.teams??[]).map(s=>[s.id,s.abbreviation])),teamNameById:new Map((e.teams??[]).map(s=>[s.id,s.name])),gcByRiderId:new Map((e.gcStandings??[]).map(s=>[s.riderId,s]))};return wn.set(e,r),r}function to(e,t){const a=e.parentElement,r=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!r)return"";const s=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",r.insertAdjacentElement("beforebegin",l),l})(),n=ds(e),i=ku(t),o=$u(i,n),d=Qe.get(e);return(d==null?void 0:d.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),s.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,r.innerHTML=t.map(l=>xu(l,n)).join(""),Qe.set(e,{layoutKey:o,orderedRiderIds:(d==null?void 0:d.orderedRiderIds)??[],rowsByRiderId:(d==null?void 0:d.rowsByRiderId)??new Map,openDetailRiderId:(d==null?void 0:d.openDetailRiderId)??null,openTeamId:(d==null?void 0:d.openTeamId)??null})),o}function rt(e,t){e.textContent!==t&&(e.textContent=t)}function Fa(e,t){e.title!==t&&(e.title=t)}function Pa(e,t){e.className!==t&&(e.className=t)}function Na(e,t,a){return e.lastValues[t]!==a}function La(e,t,a){e.lastValues[t]=a}function ds(e){const t=Mn.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return Mn.set(e,a),a}function xu(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${X(e.label)}">${X(a)}</span>`;const r=!t.autoSort&&t.manualSortKey===e.sortKey,s=r?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${r?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${X(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${X(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${X(a)}<span class="race-sim-leaderboard-sort-indicator">${X(s)}</span></button>`}function Tu(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function wu(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function Rn(e,t,a,r,s,n,i){if(r.autoSort)return(d,l)=>e.stage.profile==="ITT"?ao(d,l,t):Cu(d,l);if(!r.manualSortKey)return null;const o=r.manualSortDirection==="asc"?1:-1;return(d,l)=>{if(Pe(d)!==Pe(l))return Pe(d)?1:-1;const p=s.get(d.riderId)??null,u=s.get(l.riderId)??null,m=In(d,p,r.manualSortKey??"",e,a,n,i),f=In(l,u,r.manualSortKey??"",e,a,n,i);return wu(m,f)*o||d.riderId-l.riderId}}function Mu(e,t,a){if(e.length!==t.size)return!1;let r=null;for(const s of e){const n=t.get(s);if(!n||r&&a(r,n)>0)return!1;r=n}return!0}function In(e,t,a,r,s,n,i){const o=r.race.isStageRace&&r.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return r.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?Su(e,a.slice(6),r.stage.profile,s):null}}function Ru(e,t,a,r,s,n,i,o,d){if(!s.manualSortKey){if(s.autoSort){const m=Rn(t,a,r,s,n,i,o);return m?[...e].sort(m):[...e]}const u=new Map(s.frozenOrder.map((m,f)=>[m,f]));return[...e].sort((m,f)=>(Pe(m)===Pe(f)?0:Pe(m)?1:-1)||(u.get(m.riderId)??Number.MAX_SAFE_INTEGER)-(u.get(f.riderId)??Number.MAX_SAFE_INTEGER)||m.riderId-f.riderId)}const l=Rn(t,a,r,s,n,i,o);if(!l)return[...e];const p=new Map(e.map(u=>[u.riderId,u]));return Mu(d,p,l)?d.map(u=>p.get(u)).filter(u=>u!=null):[...e].sort(l)}function Iu(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const p=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(p))return!1;const u=Qe.get(e);return u?(u.openTeamId=u.openTeamId===p?null:p,u.openTeamId==null&&(u.openDetailRiderId=null),!0):!1}const r=t.closest("button[data-race-sim-rider-toggle]");if(r){const p=Number(r.dataset.raceSimRiderToggle);if(!Number.isFinite(p))return!1;const u=Qe.get(e);return u?(u.openDetailRiderId=u.openDetailRiderId===p?null:p,!0):!1}const s=ds(e);if(t.closest("button[data-race-sim-splits-toggle]"))return s.showSplitColumns=!s.showSplitColumns,!s.showSplitColumns&&((l=s.manualSortKey)!=null&&l.startsWith("split:"))&&(s.manualSortKey=null,s.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return s.autoSort=!s.autoSort,s.autoSort?(s.manualSortKey=null,s.frozenOrder=[]):(s.manualSortKey=null,s.manualSortDirection="asc",s.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(p=>Number(p.dataset.raceSimRiderRow)).filter(p=>Number.isFinite(p))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||s.autoSort)return!1;const d=o.dataset.raceSimSortKey;return d?(s.manualSortKey===d?s.manualSortDirection=s.manualSortDirection==="asc"?"desc":"asc":(s.manualSortKey=d,s.manualSortDirection=Tu(d)),s.frozenOrder=[],!0):!1}function Cn(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function Pe(e){return e.finishStatus==="dnf"}function ao(e,t,a){if(Pe(e)!==Pe(t))return Pe(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const d=a[o];if(!d)continue;const l=e.splitTimes[d.key],p=t.splitTimes[d.key];if(l!=null&&p!=null&&l!==p)return l-p;if(l!=null&&p==null)return-1;if(l==null&&p!=null)return 1}const r=Cn(e,a),s=Cn(t,a);if(r!==s)return r?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function Cu(e,t){return Pe(e)!==Pe(t)?Pe(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function ro(e,t){const a=(t==null?void 0:t.formBonus)??0,r=(t==null?void 0:t.raceFormBonus)??0,s=((t==null?void 0:t.fatigueMalus)??0)*.5,n=((t==null?void 0:t.longTermFatigueMalus)??0)*.5,i=((t==null?void 0:t.shortTermFatigueMalus)??0)*.5,o=e.teamGroupBonus,d=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,p=e.baseSkill+l+a+r+e.dailyForm+e.microForm+o-s-n-i,u=Math.max(0,p-e.staminaPenalty),m=p-u,f=u-e.effectiveSkill;return[`Basis ${ce(e.baseSkill)}`,e.isAttacking?`+ Attacke ${ce(l)}`:null,`+ S-Form ${ce(a)}`,`+ R-Form ${ce(r)}`,`+ T-Form ${ce(e.dailyForm)}`,`+ Zufällige Form ${ce(d)} (skaliert)`,`+ Teambonus ${ce(o)}`,`- Fatigue ${ce(s)}`,`- Langzeit ${ce(n)}`,`- Akut ${ce(i)}`,`- Stamina ${ce(m)}`,`- HM ${ce(f)}`,`= Effektiv ${ce(e.effectiveSkill)}`].filter(g=>g!=null)}function Eu(e,t){return ro(e,t).join(`
`)}function Fu(e){return oa(Math.max(-2.5,Math.min(2.5,e*2.5)))}function Pu(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function so(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${X(e.riderName)}">${X(e.riderName)}</button>`}function Nu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId)??"—",s=a.get(e.activeTeamId)??r;return`<span class="race-sim-team-code" title="${X(s)}">${X(r)}</span>`}function no(e){return`/jersey/Jer_${e}.png`}function Lu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId);if(!r)return"—";const s=a.get(e.activeTeamId)??r.name,n=no(e.activeTeamId);return`
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
    </span>`}function Du(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function _u(e,t,a,r){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=r.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const s=e.splitTimes[t];return s!=null?Nt(s):"—"}function io(e,t,a){const r=ro(e,t),s=[{label:"Terrain / Skill",value:`${Ji(e.activeTerrain)} / ${hu(e.skillName)}`},{label:"Aktiver Abschnitt",value:Yi(e)},{label:"Segmenthöhe",value:fu(e)},{label:"Basis",value:ce(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${ce(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:oa((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:oa((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:Cr((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:Cr((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:Cr((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:ce(e.staminaPenalty)},{label:"HM",value:ce(e.elevationPenalty)},{label:"T-Form",value:oa(e.dailyForm)},{label:"Zufall",value:Fu(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:Pu(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?Ui(a.gapSeconds):"—"}];return`
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
    </section>`}function Au(e,t,a,r,s,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const d=document.createElement("div");d.className="race-sim-row-grid",o.appendChild(d);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",d.appendChild(l);const p=document.createElement("span");p.className="race-sim-row-flag",p.innerHTML=t?Il(vu(t)):"—",d.appendChild(p);const u=document.createElement("span");u.className="race-sim-row-name",u.innerHTML=so(e,a),d.appendChild(u);const m=u.querySelector(".race-sim-row-name-btn");if(!m)throw new Error("race-sim-row-name-btn not found");const f=document.createElement("span");f.className="race-sim-row-team-visual",f.innerHTML=Lu(t,s,i),d.appendChild(f);const g=document.createElement("strong");g.className="race-sim-row-team",g.innerHTML=Nu(t,n,i),d.appendChild(g);const b=(L="")=>{const H=document.createElement("strong");return L&&(H.className=L),d.appendChild(H),H},v=b("race-sim-gap"),y=b("race-sim-cell-effective-skill"),T=b(),R=b(),x=b(),$=r.map(()=>b()),C=b(),I=b(),P=b("race-sim-form-state-cell"),F=document.createElement("div");return F.className="race-sim-row-detail-popover hidden",o.appendChild(F),{row:o,rankField:l,nameButton:m,gapField:v,clockField:x,splitFields:$,effectiveSkillField:y,gcRankField:T,gcGapField:R,gradientPercentField:C,speedField:I,formStateField:P,detailPanel:F,initialized:!1,lastValues:{}}}function Bu(e,t,a,r,s,n,i,o,d,l,p){const u=(r==null?void 0:r.formBonus)??0,m=(r==null?void 0:r.raceFormBonus)??0,f=d&&l>1?p.get(a.riderId)??null:null,g=Pe(a),b=i!=="ITT"&&i!=="TTT"?g?"DNF":"—":a.hasStarted?g?"DNF":a.riderClockSeconds!=null?Nt(a.riderClockSeconds):"—":Vi(a.startOffsetSeconds);Pa(e.row,`race-sim-row${t===1&&!g?" race-sim-row-leader":""}${s?" race-sim-row-detail-open":""}${g?" race-sim-row-dnf":""}`),rt(e.rankField,`${t}.`),rt(e.gapField,g?"DNF":Oi(a.gapToLeaderMeters)),rt(e.clockField,b),e.nameButton.setAttribute("aria-expanded",s?"true":"false"),Pa(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),Fa(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((R,x)=>{const $=e.splitFields[x];if(!$)return;const C=_u(a,R.key,i,o);rt($,C),Fa($,R.label)}),Na(e,"effectiveSkillValue",a.effectiveSkill)&&(rt(e.effectiveSkillField,ce(a.effectiveSkill)),La(e,"effectiveSkillValue",a.effectiveSkill));const v=`race-sim-cell-effective-skill ${qi(a)}`;Na(e,"effectiveSkillClass",v)&&(Pa(e.effectiveSkillField,v),La(e,"effectiveSkillClass",v));const y=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,u,m,a.dailyForm,a.microForm,(r==null?void 0:r.fatigueMalus)??0,(r==null?void 0:r.longTermFatigueMalus)??0,(r==null?void 0:r.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");Na(e,"effectiveSkillTitleKey",y)&&(Fa(e.effectiveSkillField,Eu(a,r)),La(e,"effectiveSkillTitleKey",y)),rt(e.gcRankField,f?String(f.rank):"—"),rt(e.gcGapField,f?Ui(f.gapSeconds):"—"),rt(e.gradientPercentField,gu(a.gradientPercent)),Pa(e.gradientPercentField,bu(a.gradientPercent)),Fa(e.gradientPercentField,`${Ji(a.activeTerrain)} · ${Yi(a)}`),rt(e.speedField,ls(a.currentSpeedMps)),e.formStateField.innerHTML=Du(a);const T=[s?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,u,m,(r==null?void 0:r.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(f==null?void 0:f.rank)??"—",(f==null?void 0:f.gapSeconds)??"—",a.skillBreakdown].join("|");Na(e,"detailKey",T)&&(e.detailPanel.innerHTML=s?io(a,r,f):"",e.detailPanel.classList.toggle("hidden",!s),La(e,"detailKey",T)),e.detailPanel.classList.toggle("hidden",!s),e.initialized=!0}function Hu(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${X(e.name)}">${X(e.name)}</button>`}function Gu(e){const t=no(e.id);return`
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
    </span>`}function zu(e,t,a){const r=new Map;for(const s of e.riders){const n=a.get(s.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=r.get(i)??[];o.push(s),r.set(i,o)}return t.teams.filter(s=>r.has(s.id)).map(s=>{const n=(r.get(s.id)??[]).slice().sort((p,u)=>u.effectiveSkill-p.effectiveSkill||p.riderId-u.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),d=n.slice(0,o).reduce((p,u)=>p+u.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:s,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,d-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(p=>p.isFinished).length}}).sort((s,n)=>ao(s.representative,n.representative,Xi(t))||s.team.id-n.team.id)}function Ku(e,t,a,r,s){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${X(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${X(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${X(ce(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${X(ls(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${X(e.teamClockSeconds!=null?Nt(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${X(Wr(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&r>1?t.gcByRiderId.get(n.riderId)??null:null,d=s===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${so(n,d)}
                <strong>${X(ce(n.effectiveSkill))}</strong>
                <span>${X(n.riderClockSeconds!=null?Nt(n.riderClockSeconds):"—")}</span>
              </div>
              ${d?io(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function Wu(e,t,a){var f,g;const r=performance.now(),s=eo(a),n=s.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(b=>({label:b.key,displayLabel:b.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(f=Qe.get(e))==null?void 0:f.layoutKey,d=to(e,i),l=Qe.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==d&&(e.innerHTML="");const p=zu(t,a,s.riderById),u=((g=p[0])==null?void 0:g.teamDistanceMeters)??0;return e.innerHTML=p.map((b,v)=>{const y=l.openTeamId===b.team.id;return`
      <article class="race-sim-row${v===0?" race-sim-row-leader":""}${y?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${v+1}.</strong>
          <span class="race-sim-row-name">${Hu(b.team,y)}</span>
          <span class="race-sim-row-team-visual">${Gu(b.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${X(b.team.name)}">${X(b.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${X(Oi(Math.max(0,u-b.teamDistanceMeters)))}</strong>
          <strong>${X(b.teamClockSeconds!=null?Nt(b.teamClockSeconds):Vi(b.representative.startOffsetSeconds))}</strong>
          ${n.map(T=>`<strong>${X(b.splitTimes[T.key]!=null?Nt(b.splitTimes[T.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${qi(b.representative)}">${X(ce(b.teamEffectiveSkill))}</strong>
          <strong>${X(ls(b.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${y?"":" hidden"}">${y?Ku(b,s,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),Qe.set(e,{layoutKey:d,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-r,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:p.length,rowsCreated:p.length,rowsRemoved:0,rowsUpdated:p.length,rowsSkippedInvisible:0,orderChanged:1}}function En(e,t,a){if(a.stage.profile==="TTT")return Wu(e,t,a);const r=performance.now(),s={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=eo(a),{splitMarkers:o}=i,d=yu(t),l=ds(e),p=l.showSplitColumns?o:[],u=Qe.get(e);s.prepMs=performance.now()-n;const m=performance.now(),f=Ru(t.riders,a,o,d,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(u==null?void 0:u.orderedRiderIds)??[]);s.sortMs=performance.now()-m;const g=u==null?void 0:u.layoutKey,b=performance.now(),v=to(e,Qi(a,p,l.showSplitColumns));s.layoutMs=performance.now()-b;const y=Qe.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};g!=null&&g!==v&&(e.innerHTML="",y.rowsByRiderId.clear(),y.orderedRiderIds=[]);const T=f.map(F=>F.riderId),R=new Set(T),x=performance.now();for(const[F,L]of y.rowsByRiderId)R.has(F)||(L.row.remove(),y.rowsByRiderId.delete(F),s.rowsRemoved+=1);s.removeRowsMs=performance.now()-x;const $=performance.now();for(let F=0;F<f.length;F+=1){const L=f[F],H=i.riderById.get(L.riderId)??null;let G=y.rowsByRiderId.get(L.riderId);G||(G=Au(L,H,y.openDetailRiderId===L.riderId,p,i.teamById,i.teamAbbreviationById,i.teamNameById),y.rowsByRiderId.set(L.riderId,G),s.rowsCreated+=1)}s.createRowsMs=performance.now()-$;const C=performance.now(),I=y.orderedRiderIds.length===T.length&&y.orderedRiderIds.every((F,L)=>F===T[L]);s.orderCheckMs=performance.now()-C;const P=performance.now();if(!I){const F=document.createDocumentFragment();for(const L of T){const H=y.rowsByRiderId.get(L);H&&F.appendChild(H.row)}e.replaceChildren(F),s.orderChanged=1}s.reorderMs=performance.now()-P;for(let F=0;F<f.length;F+=1){const L=f[F],H=y.rowsByRiderId.get(L.riderId),G=i.riderById.get(L.riderId)??null;if(!H)continue;const K=performance.now();Bu(H,F+1,L,G,y.openDetailRiderId===L.riderId,p,a.stage.profile,d,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),s.updateRowsMs+=performance.now()-K,s.rowsUpdated+=1}return Qe.set(e,{layoutKey:v,orderedRiderIds:T,rowsByRiderId:y.rowsByRiderId,openDetailRiderId:y.openDetailRiderId,openTeamId:y.openTeamId}),s.finalizeMs=performance.now()-(r+s.prepMs+s.sortMs+s.layoutMs+s.removeRowsMs+s.createRowsMs+s.orderCheckMs+s.reorderMs+s.visibilityMs+s.updateRowsMs),s.totalMs=performance.now()-r,s.finalizeMs=Math.max(0,s.totalMs-s.prepMs-s.sortMs-s.layoutMs-s.removeRowsMs-s.createRowsMs-s.orderCheckMs-s.reorderMs-s.visibilityMs-s.updateRowsMs),s}const ju=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],Ou=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],oo=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],lo=["Sprint","4","3","2","1","HC"],Qa=.2,Vu=7,Uu=100,Yu=3,Zu=50,Ju=-2,qu=1,Xu=2.5,Qu=-3,em=15,tm=200,am=600,rm=850;function Ae(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function er(e){return e==="finish_hill"||e==="finish_mountain"}function tr(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function cs(e,t){return e==="climb_top"||er(e)&&tr(t)}function ba(e){return Math.round(e*10)/10}function We(e){return Number(e.toFixed(2))}function Rt(e){return`${e.toFixed(2).replace(".",",")} km`}function co(e){return`${Math.round(e)} hm`}function sm(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function us(e){return ju.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function nm(e){return Ou.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function im(e,t="start",a=0,r=1){const s=oo.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:Ae(i)?a===r-1:i==="climb_top"||i==="sprint_intermediate");return(s.includes(e)?s:[e,...s.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${S(i)}</option>`).join("")}function om(e){return['<option value="">–</option>',...lo.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`)].join("")}function Fn(e){return oo.indexOf(e)}function je(e){return[...e].sort((t,a)=>Fn(t.type)-Fn(a.type))}function pa(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:je(e[0].markers)}];let a=0;return e.forEach(r=>{a=We(a+r.lengthKm);const s=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),n=t[t.length-1];n.terrain=r.terrain,n.techLevel=r.techLevel,n.windExp=r.windExp,n.markers=je([...n.markers,...r.markers]),t.push({kmMark:a,elevation:s,terrain:r.terrain,techLevel:r.techLevel,windExp:r.windExp,markers:je(r.endMarkers)})}),t}function lm(e){return e?" stage-editor-input-invalid":""}function ms(e,t){const a=e.segments[t];if(!a)return[];const r=[],s=dm(e).get(t)??[];return a.lengthKm<Qa&&r.push(`Laenge unter ${Qa.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&r.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&r.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&r.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>Ae(n.type))&&r.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&r.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>Ae(n.type))&&r.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{Ae(n.type)&&r.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&r.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&r.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&r.push(`${n.type} gehoert in den Startmarker-Slot.`),cs(n.type,n.cat)&&!tr(n.cat)&&r.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&r.push("Sprintmarker erlaubt nur Kategorie Sprint."),Ae(n.type)&&!er(n.type)&&n.cat!=null&&r.push("finish_flat und finish_TT duerfen keine Kategorie haben."),er(n.type)&&n.cat!=null&&!tr(n.cat)&&r.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),r.push(...s),[...new Set(r)]}function dm(e){const t=new Map,a=[],r=(s,n)=>{const i=t.get(s)??[];i.push(n),t.set(s,i)};return e.segments.forEach((s,n)=>{s.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),s.endMarkers.forEach(i=>{var l;if(!cs(i.type,i.cat))return;if(!i.name){r(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let p=a.length-1;p>=0;p-=1)if(((l=a[p])==null?void 0:l.name)===i.name){o=p;break}const d=o>=0?o:a.length-1;if(d<0){r(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(d,1)})}),a.forEach(s=>{const n=s.name?` "${s.name}"`:"";r(s.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function cm(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:er(e.type)?{...e,cat:tr(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function uo(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:um(e.waypoints??[])).map(r=>({...r,startElevation:Math.round(r.startElevation),lengthKm:Number.isFinite(r.lengthKm)?We(r.lengthKm):Qa,gradientPercent:Number.isFinite(r.gradientPercent)?ba(r.gradientPercent):0,techLevel:Number.isFinite(r.techLevel)?r.techLevel:5,windExp:Number.isFinite(r.windExp)?r.windExp:5,markers:Pn(r.markers),endMarkers:Pn(r.endMarkers)})),waypoints:[]};return $t(t),t}function um(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const r=e[a],s=e[a+1],n=We(s.kmMark-r.kmMark),i=s.elevation-r.elevation,o=ba(n>0?i/(n*10):0);t.push({startElevation:r.elevation,lengthKm:n,gradientPercent:o,techLevel:r.techLevel??5,windExp:r.windExp??5,terrain:r.terrain??"Flat",markers:r.markers??[],endMarkers:s.markers??[]})}return t}function Pn(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function mm(e,t,a){const r=e*a*8+t/12;return r>=95?"HC":r>=68?"1":r>=46?"2":r>=28?"3":"4"}function Nn(e){const t=[];let a=null,r=null,s=0;const n=i=>{if(a==null||i==null||i<=a){a=null,r=null,s=0;return}const o=e[a],d=e[i],l=d.kmMark-o.kmMark,p=Math.max(0,d.elevation-o.elevation),u=l>0?p/(l*10):0;p>=Uu&&u>=Yu&&t.push({startKm:We(o.kmMark),endKm:We(d.kmMark),distanceKm:We(l),gainMeters:Math.round(p),avgGradient:ba(u),category:mm(l,p,u),startIndex:a,topIndex:i,topElevation:Math.round(d.elevation)}),a=null,r=null,s=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],d=e[i],l=d.elevation-o.elevation;if(a==null&&l>0){a=i-1,r=i,s=0;continue}if(a!=null){if(l>=0){(r==null||d.elevation>=e[r].elevation)&&(r=i),s=0;continue}s+=Math.abs(l),s>=Zu&&n(r)}}return n(r),t}function pm(e){const t=e.segments.some(s=>s.terrain==="Cobble_Hill"),a=e.segments.some(s=>s.terrain==="Cobble"),r=e.climbs.some(s=>s.category==="HC"||s.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":r&&e.elevationGainMeters>=2800?"High_Mountain":r||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function Da(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function gm(e){return e.gainMeters>=am&&e.topElevation>=rm?"Mountain":e.gainMeters>tm?"Medium_Mountain":"Hill"}function fm(e){return e.gradientPercent<Qu?"Abfahrt":e.gradientPercent<Xu||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<em?"Flat":"Hill"}function hm(e){if(e.segments.length===0)return;if(e.waypoints=pa(e.segments),e.sourceFormat==="csv"){const i=Nn(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:d,topElevation:l,...p})=>p);return}const t=e.segments.map(i=>i.manualTerrain||Da(i.terrain)?i.terrain:fm(i)),a=Nn(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:d,...l})=>l),a.forEach(i=>{const o=gm(i);if(o)for(let d=i.startIndex;d<i.topIndex;d+=1)e.segments[d].manualTerrain||Da(t[d])||(t[d]=o)});let r=null,s=0;const n=i=>{if(r==null||s<=qu){r=null,s=0;return}for(let o=r;o<i;o+=1)!(e.segments[o].manualTerrain||Da(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");r=null,s=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<Ju){r==null&&(r=i),s+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{Da(i.terrain)||(i.terrain=t[o])}),e.waypoints=pa(e.segments),e.suggestedProfile=pm(e)}function $t(e){bm(e),Ln(e),hm(e),e.waypoints=pa(e.segments),Ln(e)}function bm(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,r)=>{const s={...a,startElevation:Math.round(r===0?a.startElevation:t),lengthKm:We(a.lengthKm),gradientPercent:ba(a.gradientPercent),markers:je(a.markers),endMarkers:je(a.endMarkers)};return t=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),s}),e.waypoints=pa(e.segments)}function Ln(e){e.totalDistanceKm=We(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,r)=>{if(r===0)return 0;const s=a.elevation-e.waypoints[r-1].elevation;return t+Math.max(0,s)},0)}function mt(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(r=>r.type==="start")||(t.markers=je([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(r=>Ae(r.type))||(a.endMarkers=je([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=pa(e.segments))}function vm(e,t,a,r){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((s,n)=>{const i=r==="start"&&t===0&&s.type==="start",o=e.filter(p=>Ae(p.type)).length,d=r==="end"&&t===a-1&&Ae(s.type)&&o===1,l=!(i||d);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${r}" data-marker-index="${n}">${im(s.type,r,t,a)}</select>
        <input type="text" value="${S(s.name??"")}" data-field="markerName" data-marker-scope="${r}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${r}" data-marker-index="${n}">${om(s.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${r}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function Dn(e,t,a,r){const s=r==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${vm(e,t,a,r)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${r}" data-segment-index="${t}">${s}</button>
    </div>`}function ym(e,t,a,r,s){if(!c.stageEditorDraft)return;const n=c.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(r==="markerType"){o.type=s;const d=cm(o);if(o.name=d.name,o.cat=d.cat,Ae(o.type)){const l=i.filter((p,u)=>u===t||!Ae(p.type));a==="start"?n.markers=l:n.endMarkers=l}}else r==="markerName"?o.name=s.trim()||null:r==="markerCat"&&(o.cat=s||null);a==="start"?n.markers=je(n.markers):n.endMarkers=je(n.endMarkers),$t(c.stageEditorDraft),mt(c.stageEditorDraft),ge()}}function Sm(e,t){if(!c.stageEditorDraft)return;const a=c.stageEditorDraft.segments[e];if(!a)return;const r=t==="start"?e===0&&!a.markers.some(s=>s.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===c.stageEditorDraft.segments.length-1&&!a.endMarkers.some(s=>Ae(s.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(r),a.markers=je(a.markers)):(a.endMarkers.push(r),a.endMarkers=je(a.endMarkers)),$t(c.stageEditorDraft),mt(c.stageEditorDraft),ge()}function km(e,t,a){if(!c.stageEditorDraft)return;const r=c.stageEditorDraft.segments[e];r&&(a==="start"?r.markers.splice(t,1):r.endMarkers.splice(t,1),$t(c.stageEditorDraft),mt(c.stageEditorDraft),ge())}let Wt=0,jt=0;async function $m(){h("stage-editor-profile").innerHTML=us("Flat"),h("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',h("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([V.listStageEditorCountries(),V.listStageEditorRaceCategories(),V.listStageEditorRacePrograms()]);if(e.success&&e.data){const r=h("stage-editor-race-country");r.innerHTML=e.data.map(s=>`<option value="${s.id}">${S(s.name)} (${S(s.code3)})</option>`).join("")}if(t.success&&t.data){const r=h("stage-editor-race-category");r.innerHTML=t.data.map(s=>`<option value="${s.id}">${S(s.name)}</option>`).join("")}a.success&&a.data&&(c.stageEditorPrograms=a.data,xm())}function xm(){const e=h("stage-editor-programs-list");c.stageEditorPrograms&&(e.innerHTML=c.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${S(t.name)}</span>
      </label>
    `).join(""))}function Tm(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=h("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(r=>{var n;const s=(n=c.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===r.value);return s?s.name:r.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function ps(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function mo(){const e=c.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function wm(){const e=[...c.stageEditorExistingStages.map(t=>t.raceId),...c.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function Mm(e,t){let a=e;const r=new Set(c.stageEditorExistingStages.map(s=>s.stageId));for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function Rm(e,t){let a=e;const r=new Set([...c.stageEditorExistingStages.map(s=>s.raceId),...c.races.map(s=>s.id)]);for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function Im(e){var o;const t=h("stage-editor-profile");t.innerHTML=us(e.suggestedProfile),t.value=e.suggestedProfile;const a=mo(),r=wm();h("stage-editor-stage-id").value=String(a),h("stage-editor-race-id").value=String(r),Wt=a,jt=r;const s=h("stage-editor-details-file");s.value.trim()||(s.value=`${sm(e.routeName)}.csv`);const n=h("stage-editor-date");!n.value&&((o=c.gameState)!=null&&o.currentDate)&&(n.value=c.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(d=>{d.checked=!0})}function Cm(e){h("stage-editor-stage-id").value=String(e.stageId),h("stage-editor-race-id").value=String(e.raceId),Wt=e.stageId,jt=e.raceId,h("stage-editor-stage-number").value=String(e.stageNumber),h("stage-editor-date").value=e.date,h("stage-editor-details-file").value=e.detailsCsvFile;const t=h("stage-editor-profile");t.innerHTML=us(e.profile),t.value=e.profile,h("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),h("stage-editor-final-push-start").value=String(e.finalPushStartPercent),h("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),h("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),h("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(s=>s.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(s=>{s.checked=a.includes(s.value)})}function po(e){var r;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((r=e.segments[0])!=null&&r.markers.some(s=>s.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(s=>Ae(s.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((s,n)=>{ms(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...s.markers??[],...s.endMarkers??[]].forEach(i=>{i.cat!=null&&!lo.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function go(){const e=[],t=Number(h("stage-editor-stage-id").value),a=Number(h("stage-editor-race-id").value),r=Number(h("stage-editor-stage-number").value),s=h("stage-editor-date").value.trim(),n=h("stage-editor-details-file").value.trim(),i=Number(h("stage-editor-final-spread-start").value),o=Number(h("stage-editor-final-push-start").value),d=Number(h("stage-editor-final-spread-difficulty").value),l=Number(h("stage-editor-crash-multiplier").value),p=Number(h("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(r)||r<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(s)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(d)||d<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(p)||p<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),c.stageEditorExistingStages.map(v=>v.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const f=h("stage-editor-new-race-checkbox").checked,g=[...c.stageEditorExistingStages.map(v=>v.raceId),...c.races.map(v=>v.id)];if(f){g.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const v=h("stage-editor-race-name").value.trim(),y=Number(h("stage-editor-race-country").value),T=Number(h("stage-editor-race-category").value),R=Number(h("stage-editor-race-num-stages").value),x=h("stage-editor-race-start-date").value.trim(),$=h("stage-editor-race-end-date").value.trim(),C=Number(h("stage-editor-race-prestige").value);v||e.push("Rennname fehlt."),(!Number.isInteger(y)||y<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger(T)||T<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(R)||R<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(x)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test($)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(C)||C<1||C>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else g.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return h("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function Em(){var a,r;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(s=>s.value).join("|");return{stageId:Number(h("stage-editor-stage-id").value),raceId:Number(h("stage-editor-race-id").value),stageNumber:Number(h("stage-editor-stage-number").value),date:h("stage-editor-date").value.trim(),profile:h("stage-editor-profile").value,detailsCsvFile:h("stage-editor-details-file").value.trim(),startElevation:((r=(a=c.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:r.startElevation)??0,finalSpreadStartPercent:Number(h("stage-editor-final-spread-start").value),finalPushStartPercent:Number(h("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(h("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(h("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(h("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function Fm(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function Pm(e){return["gainMeters","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function mr(e,t,a){const s=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-s*118),i=54,o=.14+s*.12,d=.26+s*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${d};`}">${Math.round(e)}</span>`}function gs(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),r=Math.round(40-t*22),s=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${s};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function Nm(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function Lm(e,t,a,r){const s=r!=null?` data-stage-profile-open-climb-id="${S(r)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${s}>${e}</button>`}function Dm(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",r=e.profileScore??e.score,s=[...c.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=s.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span class="text-right">${gs(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${mr(r,0,100)}
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
    </div>`}function _m(e){const t=s=>s!=null?`${s.toFixed(1).replace(".",",")} km`:"—",a=s=>s!=null?`${Math.round(s).toLocaleString("de-DE")} m`:"—",r=s=>s!=null?`${s.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${gs(e.climbScore??0)}
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
    </div>`}function fo(e,t,a,r,s,n,i,o){const d=o??mr(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${Lm(d,r,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${s}
      </div>
    </div>`}function ue(e,t,a,r,s){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?r==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${s}-sort="${t}">
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function ta(){const e=h("stage-editor-stages-table"),t=h("stage-editor-stages-empty"),a=h("stage-editor-stages-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=c.stageEditorStagesSort.key,i=c.stageEditorStagesSort.direction;r&&(r.innerHTML=`<tr>
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
    </tr>`);const o=Bm(c.stageEditorStageRows);s.innerHTML=o.map(d=>`
    <tr>
      <td>${d.stageId}</td>
      <td>${de(d.countryCode||"")}</td>
      <td><strong>${S(d.raceName)}</strong></td>
      <td><strong>${S(ya({stageNumber:d.stageNumber}))}</strong></td>
      <td>${fo(d.profileScore,0,100,d.stageId,Dm(d),hr({name:d.raceName},{stageNumber:d.stageNumber,profile:d.profile}))}</td>
      <td>${Sa(d.profile)}</td>
      <td>${Rt(d.distanceKm)}</td>
      <td>${co(d.elevationGainMeters)}</td>
      <td>${d.sprintCount} Sprints</td>
      <td>${d.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${c.stageEditorStageRows.length} vorhandene Etappen`}function aa(){const e=h("stage-editor-climbs-table"),t=h("stage-editor-climbs-empty"),a=h("stage-editor-climbs-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=c.stageEditorClimbsSort.key,i=c.stageEditorClimbsSort.direction;r&&(r.innerHTML=`<tr>
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
    </tr>`);const o=Hm(c.stageEditorClimbRows);s.innerHTML=o.map(d=>`
    <tr>
      <td>${d.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${S(d.name)}</strong></td>
      <td>${Nm(d.category)}</td>
      <td>${fo(d.climbScore,0,350,d.stageId,_m(d),hr({name:d.raceName},{stageNumber:d.stageNumber,profile:"Mountain"}),d.id,gs(d.climbScore))}</td>
      <td>${de(d.countryCode||"")}</td>
      <td><strong>${S(d.raceName)}</strong></td>
      <td><strong>${S(ya({stageNumber:d.stageNumber}))}</strong></td>
      <td>${co(d.gainMeters)}</td>
      <td>${Rt(d.distanceKm)}</td>
      <td>${d.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${d.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${c.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function ho(e=!1){if(c.stageEditorOverviewLoaded&&!e){ta(),aa();return}c.stageEditorOverviewLoading=!0,ta(),aa();const t=await V.getStageEditorOverview();if(c.stageEditorOverviewLoading=!1,c.stageEditorOverviewLoaded=!0,!t.success||!t.data){c.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),ta(),aa();return}c.stageEditorStageRows=t.data.stages,c.stageEditorClimbRows=t.data.climbs,ta(),aa()}async function Am(e=!1){const t=h("stage-editor-existing-stage-wrap");if(c.stageEditorExistingStagesLoaded&&!e){jr();return}t.classList.add("loading");const a=h("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const r=await V.listStageEditorStages();if(t.classList.remove("loading"),c.stageEditorExistingStagesLoaded=!0,!r.success||!r.data){c.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}c.stageEditorExistingStages=r.data.stages,jr()}function jr(){const e=h("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+c.stageEditorExistingStages.map(a=>{const r=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${S(a.raceName)} · Etappe ${a.stageNumber}${r}</option>`}).join("")}function Bm(e){const t=c.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(c.stageEditorStagesSort.key){case"stageId":s=a.stageId-r.stageId;break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"profile":s=a.profile.localeCompare(r.profile,"de");break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"elevationGainMeters":s=a.elevationGainMeters-r.elevationGainMeters;break;case"sprintCount":s=a.sprintCount-r.sprintCount;break;case"climbCount":s=a.climbCount-r.climbCount;break;case"profileScore":s=a.profileScore-r.profileScore;break}return s*t||a.stageId-r.stageId})}function Hm(e){const t=c.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(c.stageEditorClimbsSort.key){case"placementKm":s=a.placementKm-r.placementKm;break;case"name":s=a.name.localeCompare(r.name,"de");break;case"category":s=(a.category??"").localeCompare(r.category??"","de");break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"gainMeters":s=a.gainMeters-r.gainMeters;break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"avgGradient":s=a.avgGradient-r.avgGradient;break;case"maxGradient":s=a.maxGradient-r.maxGradient;break;case"climbScore":s=a.climbScore-r.climbScore;break}return s*t||a.placementKm-r.placementKm})}function Gm(e){return e.map(t=>t.type).join(" | ")}function zm(e){const t=[],a=[];let r=0;return e.segments.forEach((s,n)=>{const i=r,o=We(i+s.lengthKm),d=ps(s);s.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:s.startElevation})}),s.endMarkers.forEach(l=>{if(cs(l.type,l.cat)&&l.name){let p=-1;for(let u=a.length-1;u>=0;u--)if(a[u].name===l.name){p=u;break}if(p>=0){const u=a[p];a.splice(p,1);const m=We(o-u.startKm),f=Math.max(0,d-u.startElevation),g=m>0?ba(f/(m*10)):0;t.push({name:l.name,startKm:u.startKm,endKm:o,distanceKm:m,gainMeters:f,avgGradient:g,category:l.cat||"4"})}}}),r=o}),t}function Km(e){const t=[];let a=0;return e.segments.forEach(r=>{const s=We(a+r.lengthKm);r.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:s})}),a=s}),t}function ge(){jr();const e=c.stageEditorDraft,t=h("stage-editor-import-summary"),a=h("stage-editor-warnings"),r=h("stage-editor-climbs"),s=h("stage-editor-empty"),n=h("stage-editor-chart"),i=h("stage-editor-waypoints-body"),o=h("stage-editor-export-hint"),d=h("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",r.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',s.classList.remove("hidden"),n.innerHTML=_n(null),i.innerHTML=`<tr><td colspan="${Vu}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",d.disabled=!0;return}s.classList.add("hidden");const l=po(e),p=go(),u=document.getElementById("stage-editor-profile"),m=u&&u.value?u.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${S(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${Rt(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${S(m)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const f=[...e.warnings,...l,...p];a.innerHTML=f.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':f.map(y=>`<div class="stage-editor-alert">${S(y)}</div>`).join("");const g=zm(e),b=Km(e);let v="";g.length>0?v+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (${g.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${g.map(y=>`
          <div class="stage-editor-climb" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="color: #fff; font-size: 0.85rem;">${S(y.name)}</strong>
              <span class="stage-editor-climb-category-badge ${y.category==="HC"?"is-hc":`is-cat-${y.category}`}" style="font-size: 0.7rem; padding: 0.1rem 0.35rem;">
                Kat. ${S(y.category)}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-300); display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span>${Rt(y.startKm)} - ${Rt(y.endKm)}</span>
              <span>·</span>
              <span><strong>${y.distanceKm.toFixed(1).replace(".",",")} km</strong></span>
              <span>·</span>
              <span><strong>${y.gainMeters} hm</strong></span>
              <span>·</span>
              <span><strong>${y.avgGradient.toFixed(1).replace(".",",")}%</strong></span>
            </div>
          </div>
        `).join("")}
      </div>
    `:v+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Bergwertungen definiert (climb_start und climb_top Marker mit gleichem Namen paaren).</p>
    `,b.length>0?v+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (${b.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${b.map(y=>`
          <div class="stage-editor-sprint" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--success); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.85rem;">${S(y.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-300); font-weight: bold;">
              ${Rt(y.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:v+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `,r.innerHTML=v,n.innerHTML=_n(e),i.innerHTML=e.segments.map((y,T)=>`
    <tr data-segment-index="${T}" class="${ms(e,T).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${T+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${y.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${lm(y.lengthKm<Qa)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${y.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${nm(y.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${Dn(y.markers,T,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${Dn(y.endMarkers,T,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div class="text-muted" style="min-width:3.5rem;">${ps(y)} m</div>
          ${Wm(e,T)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${T}">+</button>
          ${T===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${T}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${T}">✕</button>`:""}
        </div>
      </td>
    </tr>`).join(""),d.disabled=f.length>0,o.textContent=f.length>0?`${f.length} Validierungshinweise vor dem Export.`:`Exportiert ${h("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function Wm(e,t){const a=ms(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(r=>`<div>${S(r)}</div>`).join("")}</div>`}function _n(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,r=24,s=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(g=>g.elevation)),d=Math.max(...n.map(g=>g.elevation)),l=Math.max(1,d-o),p=n.map(g=>{const b=r+g.kmMark/Math.max(i,.1)*(t-r*2),v=a-s-(g.elevation-o)/l*(a-s*2);return{x:b,y:v,waypoint:g}}),u=p.map((g,b)=>`${b===0?"M":"L"} ${g.x.toFixed(1)} ${g.y.toFixed(1)}`).join(" "),m=`${u} L ${(t-r).toFixed(1)} ${(a-s).toFixed(1)} L ${r.toFixed(1)} ${(a-s).toFixed(1)} Z`,f=p.filter(g=>g.waypoint.markers.length>0).map(g=>`
      <line x1="${g.x.toFixed(1)}" y1="${s}" x2="${g.x.toFixed(1)}" y2="${(a-s).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${g.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${S(Gm(g.waypoint.markers))}</text>`).join("");return`
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
      <text x="${t-r}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${Rt(i)}</text>
    </svg>`}function jm(e,t,a){const r=c.stageEditorDraft;if(!r)return;const s=r.segments[e];s&&(t==="startElevation"?s.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?s.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?s.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(s.terrain=a,s.manualTerrain=!0):t==="techLevel"?s.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(s.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),$t(r),mt(r),ge())}function Om(e){const t=c.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const r={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,r),$t(t),mt(t),ge()}function Vm(){const e=c.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],r={startElevation:t?ps(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(r),$t(e),mt(e),ge()}function Um(e){const t=c.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),$t(t),mt(t),ge()))}async function Ym(){var a;const t=(a=h("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}h("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,Me("Route wird importiert……");try{const r=await t.text(),s=await V.importStageRoute({fileName:t.name,fileContent:r});if(!s.success||!s.data){alert(`Import fehlgeschlagen: ${s.error??"Unbekannter Fehler"}`);return}const n=uo(s.data);c.stageEditorDraft=n,mt(n),Im(n),ge(),Dt("stage-editor")}finally{$e()}}async function Zm(){const e=Number(h("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}Me("CSV-Stage wird geladen...");try{const t=await V.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=uo(t.data.draft);c.stageEditorDraft=a,mt(a),Cm(t.data.metadata),ge(),Dt("stage-editor")}finally{$e()}}async function Jm(){if(!c.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...po(c.stageEditorDraft),...go()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),ge();return}const t=h("stage-editor-new-race-checkbox").checked,a=h("stage-editor-program-checkbox").checked;let r;t&&(r={name:h("stage-editor-race-name").value.trim(),countryId:Number(h("stage-editor-race-country").value),categoryId:Number(h("stage-editor-race-category").value),isStageRace:Number(h("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(h("stage-editor-race-num-stages").value),startDate:h("stage-editor-race-start-date").value.trim(),endDate:h("stage-editor-race-end-date").value.trim(),prestige:Number(h("stage-editor-race-prestige").value)});let s;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');s=Array.from(n).map(i=>Number(i.value))}Me("CSV-Dateien werden erstellt……");try{const n=await V.exportStageRoute({metadata:Em(),draft:c.stageEditorDraft,newRace:t,raceDetails:r,updatePrograms:a,programIds:s});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}zr(n.data.stagesFileName,n.data.stagesCsv),zr(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=h("stage-editor-stage-number"),o=Number(i.value)||1;i.value=String(o+1);const d=h("stage-editor-date"),l=d.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(l)){const v=new Date(l);v.setDate(v.getDate()+1);const y=v.getFullYear(),T=String(v.getMonth()+1).padStart(2,"0"),R=String(v.getDate()).padStart(2,"0");d.value=`${y}-${T}-${R}`}await Promise.all([ho(!0),Am(!0)]);const p=mo();h("stage-editor-stage-id").value=String(p),Wt=p;const u=h("stage-editor-new-race-checkbox");u&&(u.checked=!1);const m=h("stage-editor-new-race-details");m&&(m.classList.add("hidden"),m.style.display="none");const f=h("stage-editor-program-checkbox");f&&(f.checked=!1);const g=h("stage-editor-program-details");g&&(g.classList.add("hidden"),g.style.display="none"),jt=Number(h("stage-editor-race-id").value),ge()}finally{$e()}}function qm(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",x=>{const $=x.target.closest("button[data-stage-profile-open-stage-id]");if($){const P=Number($.dataset.stageProfileOpenStageId);Number.isFinite(P)&&nr(P);return}const C=x.target.closest("button[data-stage-editor-stages-sort]");if(!C)return;const I=C.dataset.stageEditorStagesSort;c.stageEditorStagesSort.key===I?c.stageEditorStagesSort.direction=c.stageEditorStagesSort.direction==="asc"?"desc":"asc":c.stageEditorStagesSort={key:I,direction:Fm(I)},ta()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",x=>{const $=x.target.closest("button[data-stage-profile-open-stage-id]");if($){const P=Number($.dataset.stageProfileOpenStageId),F=$.dataset.stageProfileOpenClimbId??null;if(Number.isFinite(P)){let L=null;F&&c.stageEditorClimbRows&&(L=c.stageEditorClimbRows.find(H=>H.id===F)??null),nr(P,L)}return}const C=x.target.closest("button[data-stage-editor-climbs-sort]");if(!C)return;const I=C.dataset.stageEditorClimbsSort;c.stageEditorClimbsSort.key===I?c.stageEditorClimbsSort.direction=c.stageEditorClimbsSort.direction==="asc"?"desc":"asc":c.stageEditorClimbsSort={key:I,direction:Pm(I)},aa()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{Ym()});const r=document.getElementById("btn-stage-editor-load-existing");r&&r.addEventListener("click",()=>{Zm()});const s=document.getElementById("btn-stage-editor-export");s&&s.addEventListener("click",()=>{Jm()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",x=>{var C;const $=((C=x.target.files)==null?void 0:C[0])??null;h("stage-editor-file-hint").textContent=$?`${$.name} · ${($.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",x=>{const $=x.target,C=$.closest("tr[data-segment-index]"),I=$.dataset.field;if(!C||!I)return;const P=Number(C.dataset.segmentIndex);if(Number.isInteger(P)){if(I==="markerType"||I==="markerName"||I==="markerCat"){const F=Number($.dataset.markerIndex),L=$.dataset.markerScope;if(!Number.isInteger(F)||L!=="start"&&L!=="end")return;ym(P,F,L,I,$.value);return}jm(P,I,$.value)}}),i.addEventListener("click",x=>{const $=x.target.closest("button[data-segment-action]");if(!$)return;const C=Number($.dataset.segmentIndex);if(Number.isInteger(C)){if($.dataset.segmentAction==="insert"){Om(C);return}if($.dataset.segmentAction==="append"){Vm();return}if($.dataset.segmentAction==="add-marker"){const I=$.dataset.markerScope;if(I!=="start"&&I!=="end")return;Sm(C,I);return}if($.dataset.segmentAction==="remove-marker"){const I=Number($.dataset.markerIndex),P=$.dataset.markerScope;if(!Number.isInteger(I)||P!=="start"&&P!=="end")return;km(C,I,P);return}$.dataset.segmentAction==="delete"&&Um(C)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(x=>{const $=document.getElementById(x);$&&$.addEventListener("change",()=>ge())}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(x=>{x.addEventListener("change",()=>ge())});const d=h("stage-editor-new-race-checkbox"),l=h("stage-editor-new-race-details"),p=h("stage-editor-program-checkbox"),u=h("stage-editor-program-details");d&&d.addEventListener("change",()=>{d.checked?(l&&(l.classList.remove("hidden"),l.style.display="grid"),p&&(p.checked=!0,u&&(u.classList.remove("hidden"),u.style.display="block"))):l&&(l.classList.add("hidden"),l.style.display="none"),ge()}),p&&p.addEventListener("change",()=>{p.checked?u&&(u.classList.remove("hidden"),u.style.display="block"):u&&(u.classList.add("hidden"),u.style.display="none"),ge()});const m=h("stage-editor-programs-dropdown-trigger"),f=h("stage-editor-programs-dropdown-menu"),g=h("btn-stage-editor-programs-ok");m&&f&&(m.addEventListener("click",x=>{x.stopPropagation();const $=f.style.display==="none"||!f.style.display;f.style.display=$?"flex":"none"}),g&&g.addEventListener("click",x=>{x.stopPropagation(),f.style.display="none",ge()}),document.addEventListener("click",x=>{const $=x.target;f.style.display==="flex"&&!f.contains($)&&$!==m&&!m.contains($)&&(f.style.display="none",ge())}));const b=h("stage-editor-programs-list");b&&b.addEventListener("change",x=>{x.target.name==="stage-editor-program-selection"&&Tm()});let v=!1,y=null;const T=h("stage-editor-stage-id"),R=h("stage-editor-race-id");if(T&&R){[T,R].forEach($=>{$.addEventListener("keydown",C=>{C.key!=="ArrowUp"&&C.key!=="ArrowDown"&&(v=!0,y&&clearTimeout(y))}),$.addEventListener("keyup",C=>{C.key!=="ArrowUp"&&C.key!=="ArrowDown"&&(y&&clearTimeout(y),y=setTimeout(()=>{v=!1},150))}),$.addEventListener("blur",()=>{v=!1})});const x=($,C)=>{const I=Number($.value);if(!Number.isInteger(I)||I<=0){C==="stage"?Wt=I:jt=I;return}const F=I-(C==="stage"?Wt:jt);if(!v&&(F===1||F===-1)){let L=I;C==="stage"?L=Mm(I,F):h("stage-editor-new-race-checkbox").checked&&(L=Rm(I,F)),$.value=String(L)}C==="stage"?Wt=Number($.value):jt=Number($.value)};T.addEventListener("input",()=>{x(T,"stage"),ge()}),R.addEventListener("input",()=>{x(R,"race"),ge()})}}let lt=[],Gt=null,Le={form:!0,combinedFatigue:!0,shortFatigue:!1,longFatigue:!1};const At=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"];function fs(e,t){if(e==null)return"";const a=t?S(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const re={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function ar(e,t,a){const r=ct(e??null);return`<span class="badge badge-race-category" style="${lr(r)}; white-space: nowrap; display: inline-block;">${S(e??"Unbekannt")}</span>`}function hs(e){if(!e)return"-";const t=ct(e);return`<span class="badge badge-race-category" style="${lr(t)}; white-space: nowrap; display: inline-block;">${S(e)}</span>`}function Xm(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function Qm(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${Xm(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function bo(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";case"breakaway_final":return"is-breakaway";default:return""}}function bs(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";case"breakaway_final":return"Ausreißer";default:return"Etappe"}}function ep(e){return`<span class="rider-stats-final-type ${bo(e)}">${S(bs(e))}</span>`}function le(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?r+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?r+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?r+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?r+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?r+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(r+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function Te(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?r+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?r+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?r+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?r+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?r+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?r+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(r+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function tp(e){return`${e.startDate===e.endDate?oe(e.startDate):`${oe(e.startDate)} - ${oe(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function rr(e){if(e==null||c.riders.length===0)return null;const a=[...c.riders].sort((r,s)=>(s.seasonPoints??0)-(r.seasonPoints??0)||(s.seasonWins??0)-(r.seasonWins??0)||s.overallRating-r.overallRating||`${r.lastName} ${r.firstName}`.localeCompare(`${s.lastName} ${s.firstName}`,"de")||r.id-s.id).findIndex(r=>r.id===e);return a>=0?a+1:null}function An(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;case"breakaway_final":return 4;default:return 5}}function ap(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||An(t.rowType)-An(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function rp(e){return[...e].map(t=>({...t,rows:ap(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function vo(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(50,Math.min(85,e));for(let d=1;d<t.length;d++){const l=t[d-1],p=t[d];if(s<=p.score){const u=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*u),r=Math.round(l.lightness+(p.lightness-l.lightness)*u);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function gt(e,t,a,r){const s=r>0?Math.max(0,Math.min(1,a/r)):.5,n=Math.round(6+s*118),i=.26+s*.18,o=.14+s*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${S(t)}">${e} ${a}</span>`}function Er(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function Fr(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return re.mountain;case"Hill":return re.hilly;case"Sprint":return re.sprint;case"Timetrial":return re.timetrial;case"Cobble":return re.cobble;case"Attacker":return re.attacker;default:return""}}function Oe(e,t,a,r,s){var ee,Y,j;const n=(t==null?void 0:t.countryCode)??r??null,i=n?de(n):s,o=(t==null?void 0:t.roleName)??((ee=e==null?void 0:e.role)==null?void 0:ee.name)??"Ohne Rolle",d=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,p=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",u=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",m=((Y=t==null?void 0:t.program)==null?void 0:Y.name)??((j=e==null?void 0:e.seasonProgram)==null?void 0:j.name)??"-",f=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,g=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,b=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,v=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,y=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,T=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,R=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",x=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,$=(t==null?void 0:t.currentSeasonRank)??rr((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),C=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,I=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,P=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,F=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},L=Math.max(F.flat,F.hilly,F.mediumMountain,F.mountain,F.timetrial,F.cobble),H=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},G=Math.max(H.stageRace,H.oneDay),K=e!=null&&e.specialization1?Er(e.specialization1):"-",w=e!=null&&e.specialization2?Er(e.specialization2):"-",A=e!=null&&e.specialization3?Er(e.specialization3):"-",U=Fr((e==null?void 0:e.specialization1)??null),W=Fr((e==null?void 0:e.specialization2)??null),ne=Fr((e==null?void 0:e.specialization3)??null);let q="";return t!=null&&t.lieutenantInfo?q=`
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.lieutenantInfo.name)}</a></span></span>
    `:t!=null&&t.leaderInfo&&(q=`
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.leaderInfo.name)}</a></span></span>
    `),`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${S(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?Ft(l,p):""} <span>${S(p)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${S(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${vi(u)} <span>Form</span></span>
        ${q}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${vo(d)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${re.seasonForm} ${f>=0?"+":""}${f}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${re.raceForm} ${g>=0?"+":""}${g}</span>
        <span class="rider-stats-icon-pill" title="Programm">${S(m)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${re.raceDays} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${v>14?"text-warning":""}" title="30-Tage Renntage">${re.rollingRaceDays} <span class="rider-stats-icon-pill-value">${v}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${re.longFatigue} <span class="rider-stats-icon-pill-value">${y}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${R!=="none"?"text-error":""}" title="Kurzzeitfatigue">${re.shortFatigue} <span class="rider-stats-icon-pill-value">${T}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${re.seasonPoints} <span class="rider-stats-icon-pill-value">${x}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${re.rank} <span class="rider-stats-icon-pill-value">${Qm($)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${re.raceDays} <span class="rider-stats-icon-pill-value">${C}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${re.wins} <span class="rider-stats-icon-pill-value">${I}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${U} ${S(K)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${W} ${S(w)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${ne} ${S(A)}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${gt(re.stageRace,"Rundfahrten Punkte",H.stageRace,G)}
        ${gt(re.oneDay,"Eintagesrennen Punkte",H.oneDay,G)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${re.breakaway} <span class="rider-stats-icon-pill-value">${P}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${gt(re.flat,"Flach-Punkte",F.flat,L)}
        ${gt(re.hilly,"Hügel-Punkte",F.hilly,L)}
        ${gt(re.mediumMountain,"Mittelgebirge-Punkte",F.mediumMountain,L)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${gt(re.mountain,"Hochgebirge-Punkte",F.mountain,L)}
        ${gt(re.timetrial,"Zeitfahren-Punkte",F.timetrial,L)}
        ${gt(re.cobble,"Kopfsteinpflaster-Punkte",F.cobble,L)}
      </div>
    </div>
  `}function Bn(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",r=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${S(a)} <strong>${S(r)}</strong>`}function Ve(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${c.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${c.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${c.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${c.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${c.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${c.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${c.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
    </div>`}function sp(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(55,Math.min(80,e));for(let d=1;d<t.length;d++){const l=t[d-1],p=t[d];if(s<=p.score){const u=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*u),r=Math.round(l.lightness+(p.lightness-l.lightness)*u);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function np(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},r=["mountain","hill","sprint","timeTrial","cobble","attack"],s=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,d=i/2,l=160,p=60,u=85,m=u-p,f=H=>{const G=[];for(let K=0;K<6;K++){const w=K*Math.PI/3-Math.PI/2;G.push(`${o+H*Math.cos(w)},${d+H*Math.sin(w)}`)}return G},g=`
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
    </defs>`,b=`<circle cx="${o}" cy="${d}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let v="";for(let H=p;H<=u;H+=2.5){const G=l*((H-p)/m);if(G<1){v+=`<circle cx="${o}" cy="${d}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const K=f(G),w=H%5===0,A=w?1:.6,U=w?"none":"4,4",W=w?.4:.18;v+=`<polygon points="${K.join(" ")}" fill="none" stroke="rgba(255,255,255,${W})" stroke-width="${A}" stroke-dasharray="${U}" />`,w&&H>p&&(v+=`<text x="${o+5}" y="${d-G+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${H}</text>`)}let y="",T="";for(let H=0;H<6;H++){const G=H*Math.PI/3-Math.PI/2,K=o+l*Math.cos(G),w=d+l*Math.sin(G);y+=`<line x1="${o}" y1="${d}" x2="${K}" y2="${w}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const A=l+28,U=o+A*Math.cos(G),W=d+A*Math.sin(G),ne=Math.cos(G);let q="middle";ne>.15?q="start":ne<-.15&&(q="end");const ee=a[r[H]]??p;T+=`<text x="${U}" y="${W}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${q}" dominant-baseline="middle">${s[H]}</text>`,T+=`<text x="${U}" y="${W+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${q}" dominant-baseline="middle">${ee}</text>`}const R=[],x=[];r.forEach((H,G)=>{const K=a[H]??p,w=l*((Math.max(p,Math.min(u,K))-p)/m),A=G*Math.PI/3-Math.PI/2,U=o+w*Math.cos(A),W=d+w*Math.sin(A);R.push(`${U},${W}`),x.push(`<circle cx="${U}" cy="${W}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${s[G]}: ${K}</title></circle>`)});const $=`<polygon points="${R.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,I=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((H,G)=>{const K=a[H.key]??60;return(a[G.key]??60)-K}),P=[],F=[];I.forEach((H,G)=>{const K=a[H.key]??60,w=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${H.label}</span>
        ${sp(K)}
      </div>
    `;G%2===0?P.push(w):F.push(w)});const L=`
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
            ${b}
            ${v}
            ${y}
            ${$}
            ${x.join("")}
            ${T}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${L}
        </div>
      </div>
    </section>
  `}function ip(e,t){const a=t.shortTermFatigueMalus??0,r=t.longTermFatigueDecayable??0,s=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),d=(r/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const p=t.fatigueHistory??[];let u="";return p.length===0?u='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':u=p.map(m=>{const f=oe(m.date);let g="";m.type==="race"?g=`${S(m.raceName)}${m.stageNumber!=null?` - Etappe ${m.stageNumber}`:""}`:g=m.raceName?S(m.raceName):"Regeneration";const b=m.type==="race"&&m.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${m.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let v="";m.shortChange>0?v=`<span style="color: #ef4444; font-weight: 600;">+${m.shortChange.toFixed(2).replace(".",",")}</span>`:m.shortChange<0?v=`<span style="color: #2ecc71; font-weight: 600;">${m.shortChange.toFixed(2).replace(".",",")}</span>`:v='<span style="color: #666;">0,00</span>';const y=[];if(m.longDecayableChange!==0){const x=m.longDecayableChange>0?"+":"",$=m.longDecayableChange>0?"#ef4444":"#2ecc71";y.push(`<span style="color: ${$}; font-weight: 500;">${x}${m.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(m.longLockedChange!==0){const x=m.longLockedChange>0?"+":"",$=m.longLockedChange>0?"#a855f7":"#2ecc71";y.push(`<span style="color: ${$}; font-weight: 500;">${x}${m.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const T=y.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${y.join("")}</div>`:'<span style="color: #666;">0,00</span>',R=m.shortAfter+m.longAfter;return`
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${f}</td>
          <td style="color: #fff; font-weight: 600; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${g}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${b}</td>
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
            <strong style="color: #ef4444; font-size: 0.95rem;">-${R.toFixed(2).replace(".",",")}</strong>
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
  `}function op(e){var j;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((D,_)=>_%2===0),r=((j=c.gameState)==null?void 0:j.currentDate)??new Date().toISOString(),s=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(r).getUTCFullYear(),n=new Date(Date.UTC(s,0,1)).getTime(),i=864e5,o=1260,d=384,l=40,p=20,u=a.map(D=>{const E=(new Date(D.date).getTime()-n)/i,O=l+E/365*o,z=p+d-Math.min(8,Math.max(0,D.totalForm))/8*d;return{x:O,y:z,form:D.totalForm,date:D.date}});let m="",f="",g="";Le.form&&u.length>0&&(m=`M ${u.map(D=>`${D.x},${D.y}`).join(" L ")}`,f=u.map(D=>`<circle cx="${D.x}" cy="${D.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${D.date}): ${D.form}</title></circle>`).join(""),g=`${m} L ${u[u.length-1].x},${p+d} L ${u[0].x},${p+d} Z`);let b="",v="";if(Le.combinedFatigue&&u.length>0){const D=a.map(E=>{const z=(new Date(E.date).getTime()-n)/i,k=l+z/365*o,M=E.combinedFatigue??0,N=p+d-Math.min(15,Math.max(0,M))/15*d;return{x:k,y:N,val:M,date:E.date}});b=`<path d="${`M ${D.map(E=>`${E.x},${E.y}`).join(" L ")}`}" fill="none" stroke="#ef4444" stroke-width="2" />`,v=D.map(E=>`<circle cx="${E.x}" cy="${E.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${E.date}): ${E.val.toFixed(2)}</title></circle>`).join("")}let y="",T="";if(Le.shortFatigue&&u.length>0){const D=a.map(E=>{const z=(new Date(E.date).getTime()-n)/i,k=l+z/365*o,M=E.shortFatigue??0,N=p+d-Math.min(15,Math.max(0,M))/15*d;return{x:k,y:N,val:M,date:E.date}});y=`<path d="${`M ${D.map(E=>`${E.x},${E.y}`).join(" L ")}`}" fill="none" stroke="#facc15" stroke-width="2" />`,T=D.map(E=>`<circle cx="${E.x}" cy="${E.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${E.date}): ${E.val.toFixed(2)}</title></circle>`).join("")}let R="",x="";if(Le.longFatigue&&u.length>0){const D=a.map(E=>{const z=(new Date(E.date).getTime()-n)/i,k=l+z/365*o,M=E.longFatigue??0,N=p+d-Math.min(15,Math.max(0,M))/15*d;return{x:k,y:N,val:M,date:E.date}});R=`<path d="${`M ${D.map(E=>`${E.x},${E.y}`).join(" L ")}`}" fill="none" stroke="#a855f7" stroke-width="2" />`,x=D.map(E=>`<circle cx="${E.x}" cy="${E.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${E.date}): ${E.val.toFixed(2)}</title></circle>`).join("")}const $="rgba(251, 191, 36, 0.15)";let C="";for(let D=0;D<=8;D+=2){const _=p+d-D/8*d;C+=`<line x1="${l}" y1="${_}" x2="${l+o}" y2="${_}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,C+=`<text x="${l-5}" y="${_+4}" fill="#ffffff" font-size="10" text-anchor="end">${D}</text>`}for(let D=0;D<=15;D+=3){const _=p+d-D/15*d;C+=`<text x="${l+o+5}" y="${_+4}" fill="#ef4444" font-size="10" text-anchor="start">${D}</text>`}let I="";for(let D=0;D<=52;D+=5){const _=l+D/52*o;C+=`<line x1="${_}" y1="${p}" x2="${_}" y2="${p+d}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,I+=`<text x="${_}" y="${p+d+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${D}</text>`}let P="",F="";if(e.peakDates){const D=[...e.peakDates].sort((_,E)=>new Date(_).getTime()-new Date(E).getTime());for(let _=0;_<D.length;_++){const E=D[_],z=(new Date(E).getTime()-n)/i,k=l+z/365*o;P+=`<line x1="${k}" y1="${p}" x2="${k}" y2="${p+d}" stroke="#ffffff" stroke-width="2"><title>Peak: ${E}</title></line>`;const M=_>0?(new Date(D[_-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,N=z-56,B=M+14,Z=Math.max(0,Math.max(N,B)),ie=z-Z,me=l+Z/365*o,fe=ie/365*o;F+=`<rect x="${me}" y="${p}" width="${fe}" height="${d}" fill="rgba(16, 185, 129, 0.1)" />`;const be=14/365*o;F+=`<rect x="${k}" y="${p}" width="${be}" height="${d}" fill="rgba(239, 68, 68, 0.1)" />`}}const H=(new Date(r).getTime()-n)/i,G=l+H/365*o;P+=`<line x1="${G}" y1="${p}" x2="${G}" y2="${p+d}" stroke="#ef4444" stroke-width="3"><title>Heute: ${r}</title></line>`,lt.forEach((D,_)=>{const E=At[_%At.length];D.peakDates&&D.peakDates.forEach(O=>{const k=(new Date(O).getTime()-n)/i,M=l+k/365*o;P+=`<line x1="${M}" y1="${p}" x2="${M}" y2="${p+d}" stroke="${E}" stroke-width="1.5" stroke-dasharray="3,3"><title>${D.riderName} Peak: ${O}</title></line>`})});let K="",w="";lt.forEach((D,_)=>{const E=At[_%At.length],O=D.formHistory.filter((z,k)=>k%2===0).map(z=>{const M=(new Date(z.date).getTime()-n)/i,N=l+M/365*o,B=p+d-Math.min(8,Math.max(0,z.totalForm))/8*d;return{x:N,y:B,form:z.totalForm,date:z.date}});if(O.length>0){const z=`M ${O.map(k=>`${k.x},${k.y}`).join(" L ")}`;K+=`<path d="${z}" fill="none" stroke="${E}" stroke-width="2" />`,w+=O.map(k=>`<circle cx="${k.x}" cy="${k.y}" r="3" fill="#fff" stroke="${E}" stroke-width="2"><title>${D.riderName} (${k.date}): ${k.form}</title></circle>`).join("")}});const A=c.teams.filter(D=>D.division==="WorldTour"||D.divisionName==="WorldTour");let U='<option value="">-- Team auswählen --</option>';for(const D of A){const _=Gt===D.id?" selected":"";U+=`<option value="${D.id}"${_}>${S(D.name)}</option>`}let W='<option value="">-- Fahrer auswählen --</option>';if(Gt!=null){const D=c.riders.filter(_=>_.activeTeamId===Gt&&_.id!==e.riderId&&!lt.some(E=>E.riderId===_.id));for(const _ of D)W+=`<option value="${_.id}">${S(_.firstName)} ${S(_.lastName)}</option>`}const ne=`
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
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${Gt==null?"disabled":""}>
          ${W}
        </select>
      </div>
    </div>
  `,q=e.currentSeasonRank??rr(e.riderId)??"–",ee=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(e.riderName)} (${e.currentSeasonPoints}/${q})">${S(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${q})</span></span>
    </div>
    `];lt.forEach((D,_)=>{const E=At[_%At.length],O=D.currentSeasonRank??rr(D.riderId)??"–";ee.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${E}; border-radius: 2px; flex-shrink: 0;"></span>
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
          <input type="checkbox" id="toggle-chart-form" ${Le.form?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-combined-fatigue" ${Le.combinedFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #ef4444;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
          Gesamtfatigue (0-15)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-short-fatigue" ${Le.shortFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #facc15;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #facc15; border-radius: 50%;"></span>
          Kurzzeitfatigue (0-15)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-long-fatigue" ${Le.longFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #a855f7;" />
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
      ${ne}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${F}
            ${C}
            ${I}
            ${P}
            ${g?`<path d="${g}" fill="${$}" />`:""}
            ${m?`<path d="${m}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${f}
            ${b}
            ${v}
            ${y}
            ${T}
            ${R}
            ${x}
            ${K}
            ${w}
          </svg>
        </div>
        ${Y}
      </div>
    </section>
  `}function lp(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
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
                <td>${S(gr(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${r?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(s=a.country)!=null&&s.code3?de(a.country.code3):"–"}</td>
                <td><strong>${S(a.name)}</strong></td>
                <td>${pr(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function vs(e){const t=new Set;if(e.jerseysWorn){const i=e.jerseysWorn.split(",").map(o=>o.trim()).filter(Boolean);for(const o of i)t.add(o)}const a=new Map;if(e.eventIds){const i=e.eventIds.split("|");for(const o of i){const[d,l]=o.split(":");d&&a.set(d,l?parseInt(l,10):1)}}const r=[{type:"jersey",key:"yellow",label:"Gelbes Trikot (Gesamtwertung)",colorClass:"jersey-dot-yellow"},{type:"jersey",key:"green",label:"Grünes Trikot (Punktewertung)",colorClass:"jersey-dot-green"},{type:"jersey",key:"red",label:"Bergtrikot (Bergwertung)",colorClass:"jersey-dot-red"},{type:"jersey",key:"white",label:"Weißes Trikot (Nachwuchswertung)",colorClass:"jersey-dot-white"},{type:"jersey",key:"purple",label:"Lila Trikot (Aktivste Fahrer)",colorClass:"jersey-dot-purple-worn"},{type:"event",key:"3",label:"Superform",colorClass:"event-dot-3"},{type:"event",key:"4",label:"Supermalus",colorClass:"event-dot-4"},{type:"event",key:"1",label:"Sturz",colorClass:"event-dot-1"},{type:"event",key:"2",label:"Defekt",colorClass:"event-dot-2"},{type:"event",key:"7",label:"Heimvorteil",colorClass:"event-dot-7"},{type:"event",key:"8",label:"Heimbonus",colorClass:"event-dot-8"},{type:"event",key:"9",label:"Heimmalus",colorClass:"event-dot-9"},{type:"event",key:"5",label:"Attacken",colorClass:"event-dot-5"},{type:"event",key:"6",label:"Konterattacken",colorClass:"event-dot-6"}],s=[],n=[];for(const i of r)if(i.type==="jersey")t.has(i.key)&&(s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
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
  `}function Lt(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${S(e)}</span>`}function dp(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function cp(e){return e.finishStatus==="otl"?Lt("OTL","place"):e.finishStatus==="dnf"?Lt("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${S(String(e.resultRank))}</span>`}function up(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":Lt(String(e.gcRank),"gc")}function mp(e){return e.finishStatus==="otl"?Br(e.statusReason,!0):e.finishStatus==="dnf"?Br(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${Oa(e.stageTimeSeconds)}`:e.resultLabel}function He(e,t,a=!1){var o,d;const r=(e==null?void 0:e.activeTeamId)!=null?((o=c.teams.find(l=>l.id===e.activeTeamId))==null?void 0:o.name)??null:null,s=((d=e==null?void 0:e.country)==null?void 0:d.code3)??(e==null?void 0:e.nationality)??null,n=s?de(s):"",i=t==null?[]:[...t.seasons].map(l=>({...l,raceBlocks:rp(l.raceBlocks)})).sort((l,p)=>p.season-l.season);return a?`
      ${Oe(e,t,r,s,n)}
      ${Ve(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`:t?c.riderStatsTab==="skills"?`
      ${Oe(e,t,r,s,n)}
      ${Ve(t)}
      ${np(e)}`:c.riderStatsTab==="fatigue"?`
      ${Oe(e,t,r,s,n)}
      ${Ve(t)}
      ${ip(e,t)}`:c.riderStatsTab==="program"?`
      ${Oe(e,t,r,s,n)}
      ${Ve(t)}
      ${lp(t)}`:c.riderStatsTab==="form"?`
      ${Oe(e,t,r,s,n)}
      ${Ve(t)}
      ${op(t)}`:c.riderStatsTab==="topResults"?`
      ${Oe(e,t,r,s,n)}
      ${Ve(t)}
      ${gp(t)}`:c.riderStatsTab==="career"?`
      ${Oe(e,t,r,s,n)}
      ${Ve(t)}
      ${fp(t)}`:t.seasons.length===0?`
      ${Oe(e,t,r,s,n)}
      ${Ve(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`:`
    ${Oe(e,t,r,s,n)}
    ${Ve(t)}
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
                  <p>${S(tp(p))}</p>
                </div>
                ${ar(p.raceCategoryName,p.isStageRace,p.rows.filter(u=>u.rowType==="stage_result").length||null)}
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
                    ${p.rows.map(u=>{const m=u.rowType!=="stage_result",f=m?`${u.raceName} · ${bs(u.rowType)}`:u.stageName?`${u.raceName} · ${u.stageName}`:u.raceName;return`
                        <tr class="rider-stats-row${m?" rider-stats-row-final":""}">
                          <td>${S(oe(u.date))}</td>
                          <td>${cp(u)}</td>
                          <td>${up(u)}</td>
                          <td class="rider-stats-breakaway-col">${dp(u)}</td>
                          <td>${m?"":fs(u.rolledWeatherId,u.rolledWetterName)}</td>
                          <td>${m?ep(u.rowType):ar(u.raceCategoryName?u.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):u.raceCategoryName,u.isStageRace)}</td>
                          <td>${S(f)}</td>
                          <td class="status-cell">${vs(u)}</td>
                          <td>${m?"–":u.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${u.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${Sa(u.profile)}</button>`:"–"}</td>
                          <td>${m?"-":u.distanceKm!=null?S(u.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                          <td>${m?"-":u.elevationGainMeters!=null?S(String(Math.round(u.elevationGainMeters))):"–"}</td>
                          <td>${S(mp(u))}</td>
                          <td>${u.seasonPoints}</td>
                        </tr>`}).join("")}
                  </tbody>
                </table>
              </div>
            </section>`).join("")}
        </div>
      </section>`).join("")}`:`
      ${Oe(e,t,r,s,n)}
      ${Ve(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`}function Or(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(c.riderStatsTab)?(e.style.minWidth="min(1475px, 95vw)",e.style.maxWidth="1687px"):(e.style.minWidth="",e.style.maxWidth="")}async function Zt(e){var d,l,p,u;const t=Re(e),a=(t==null?void 0:t.activeTeamId)!=null?((d=c.teams.find(m=>m.id===t.activeTeamId))==null?void 0:d.name)??null:null;lt=[],Gt=null,c.riderStatsSelectedRiderId=e,c.riderStatsTab="results",Or(),c.riderStatsTopResultsFilterCategory=null,c.riderStatsTopResultsFilterSeason=null,c.riderStatsTopResultsPage=1,h("rider-stats-title").innerHTML=Bn(t,null),h("rider-stats-jersey").innerHTML="";const r=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((l=t.role)==null?void 0:l.name)??"Fahrer"} · ${a??"Team unbekannt"}${r}`:"Historie wird geladen",h("rider-stats-body").innerHTML=He(t,null,!0),qe("riderStats");const s=await V.getRiderStats(e);if(c.riderStatsSelectedRiderId!==e)return;if(!s.success||!s.data){const m=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((p=t.role)==null?void 0:p.name)??"Fahrer"} · ${a??"Team unbekannt"}${m}`:"Fehler beim Laden",h("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>`;return}c.riderStatsPayload=s.data,Or(),h("rider-stats-title").innerHTML=Bn(t,s.data),h("rider-stats-jersey").innerHTML="";const n=s.data.age?` · Alter ${s.data.age}`:t!=null&&t.age?` · Alter ${t.age}`:"",i=s.data.mentorName?` · Mentor: ${s.data.mentorName}`:"",o=s.data.mentoredRiderNames&&s.data.mentoredRiderNames.length>0?` · Mentor von: ${s.data.mentoredRiderNames.join(" - ")}`:"";h("rider-stats-meta").textContent=`${((u=t==null?void 0:t.role)==null?void 0:u.name)??"Fahrer"} · ${s.data.teamName??a??"Ohne aktives Team"}${n} · ${s.data.seasons.length} Saisons${i}${o}`,h("rider-stats-body").innerHTML=He(t,s.data,!1)}function pp(){h("rider-stats-body").addEventListener("click",e=>{var s;if(e.target&&e.target.id&&e.target.id.startsWith("toggle-chart-")){const n=e.target.id,i=e.target.checked;n==="toggle-chart-form"?Le.form=i:n==="toggle-chart-combined-fatigue"?Le.combinedFatigue=i:n==="toggle-chart-short-fatigue"?Le.shortFatigue=i:n==="toggle-chart-long-fatigue"&&(Le.longFatigue=i);const o=Re(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=He(o,c.riderStatsPayload,!1);return}const t=e.target.closest("button[data-rider-stats-tab]");if(!t){const n=e.target.closest("button[data-remove-compare-id]");if(n){const d=Number(n.dataset.removeCompareId);lt=lt.filter(p=>p.riderId!==d);const l=Re(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=He(l,c.riderStatsPayload,!1);return}const i=e.target.closest("button[data-top-results-page]");if(i){const d=Number(i.dataset.topResultsPage);if(!isNaN(d)&&d>=1){c.riderStatsTopResultsPage=d;const l=Re(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=He(l,c.riderStatsPayload,!1)}return}const o=e.target.closest("button[data-stage-profile-id]");if(o){const d=Number(o.dataset.stageProfileId);Number.isFinite(d)&&nr(d);return}return}const a=t.dataset.riderStatsTab;if(a!=="results"&&a!=="program"&&a!=="form"&&a!=="topResults"&&a!=="skills"&&a!=="career"&&a!=="fatigue"||a==="program"&&(((s=c.riderStatsPayload)==null?void 0:s.programRaces.length)??0)===0)return;c.riderStatsTab=a,Or();const r=Re(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=He(r,c.riderStatsPayload,!1)}),h("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){c.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,c.riderStatsTopResultsPage=1;const a=Re(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=He(a,c.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){c.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),c.riderStatsTopResultsPage=1;const a=Re(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=He(a,c.riderStatsPayload,!1)}else if(t.classList.contains("rider-stats-filter-checkbox")){const a=t.dataset.filterType;c.riderStatsTopResultsFilters[a]=t.checked,c.riderStatsTopResultsPage=1;const r=Re(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=He(r,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;Gt=a?Number(a):null;const r=Re(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=He(r,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const r=Number(a);if(lt.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const s=await V.getRiderStats(r,!0);s.success&&s.data?lt.push({riderId:s.data.riderId,riderName:s.data.riderName,teamId:s.data.teamId,teamName:s.data.teamName,formHistory:s.data.formHistory??[],peakDates:s.data.peakDates??[],currentSeasonPoints:s.data.currentSeasonPoints??0,currentSeasonRank:s.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(s.error??""));const n=Re(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=He(n,c.riderStatsPayload,!1)}}})}function Hn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function gp(e){const t=[];for(const g of e.seasons)for(const b of g.raceBlocks)for(const v of b.rows)t.push({...v,season:g.season,isStageRace:b.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,b)=>g.localeCompare(b,"de"));const r=Array.from(new Set(t.map(g=>g.season))).sort((g,b)=>b-g);let s=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?c.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?c.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?c.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?c.riderStatsTopResultsFilters.youth:!0:g.isStageRace?c.riderStatsTopResultsFilters.stage:c.riderStatsTopResultsFilters.oneDay);if(c.riderStatsTopResultsFilterCategory){const g=c.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const b=g.substring(0,g.length-8);s=s.filter(v=>v.raceCategoryName===b&&v.rowType==="stage_result")}else if(g.endsWith("-gc")){const b=g.substring(0,g.length-3);s=s.filter(v=>v.raceCategoryName===b&&v.rowType!=="stage_result")}else s=s.filter(b=>b.raceCategoryName===g)}c.riderStatsTopResultsFilterSeason!=null&&(s=s.filter(g=>g.season===c.riderStatsTopResultsFilterSeason)),s.sort((g,b)=>{if(b.seasonPoints!==g.seasonPoints)return b.seasonPoints-g.seasonPoints;const v=g.rowType!=="stage_result",y=b.rowType!=="stage_result",T=g.resultRank??9999,R=b.resultRank??9999;if(c.riderStatsTopResultsFilterCategory)return T!==R?T-R:v!==y?v?-1:1:0;{const x=Hn(g.raceCategoryName),$=Hn(b.raceCategoryName);return x!==$?x-$:v!==y?v?-1:1:T-R}});const n=200,i=s.slice(0,1e3),o=Math.max(1,Math.ceil(i.length/n));c.riderStatsTopResultsPage>o&&(c.riderStatsTopResultsPage=o);const d=(c.riderStatsTopResultsPage-1)*n,l=i.slice(d,d+n),u=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${a.map(g=>{if(g.toLowerCase().includes("stage race")||g.toLowerCase().includes("grand tour")||g.toLowerCase().includes("tour de france")){const v=`${g}-etappen`,y=`${g}-gc`;return`
        <option value="${S(v)}" ${c.riderStatsTopResultsFilterCategory===v?"selected":""}>${S(g)} - Etappen</option>
        <option value="${S(y)}" ${c.riderStatsTopResultsFilterCategory===y?"selected":""}>${S(g)} - GC</option>
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
  `,m=l.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':l.map(g=>{const b=g.rowType!=="stage_result",v=b?`${g.raceName} · ${bs(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let y="–",T="–";g.finishStatus==="otl"?y=Lt("OTL","place"):g.finishStatus==="dnf"?y=Lt("DNF","place"):g.resultRank==null||(b?T=`<span class="rider-stats-final-type ${bo(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:y=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${S(String(g.resultRank))}</span>`);const R=b?"–":g.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${g.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${Sa(g.profile)}</button>`:"–",x=!b&&g.stageScore!=null&&g.stageScore>0?mr(g.stageScore,0,350):"–",$=ar(g.raceCategoryName?g.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${b?" rider-stats-row-final":""}">
            <td>${y}</td>
            <td>${T}</td>
            <td><strong>${S(v)}</strong>${b?"":fs(g.rolledWeatherId,g.rolledWetterName)}</td>
            <td class="status-cell">${vs(g)}</td>
            <td>${R}</td>
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
  `}function fp(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,superteamCount:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),r=(n,i,o,d)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let p="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?p+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?p+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?p+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?p+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?p+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?p+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?p+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?p+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(p+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${p}" title="${S(o)}">${n}</span>`},s=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
                ${hs(n.key)}
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
                  ${Te(i.winWeather1||0,1,"Sonnig")}
                  ${Te(i.winWeather2||0,2,"Extreme Hitze")}
                  ${Te(i.winWeather3||0,3,"Leichter Regen")}
                  ${Te(i.winWeather4||0,4,"Starkregen")}
                  ${Te(i.winWeather5||0,5,"Starker Wind")}
                  ${Te(i.winWeather6||0,6,"Dichter Nebel")}
                  ${Te(i.winWeather7||0,7,"Schnee/Eis")}
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
  `}window.openRiderStatsFromRiderStats=Zt;const hp=250,Bt=1200,bp=250,vp=1200,Gn=.2;class yp{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",r=>{var i,o,d,l;const s=r.target.closest("button[data-race-sim-action]");if(s){if(s.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const u=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;u&&((l=(d=this.options).onFinishRequested)==null||l.call(d,u,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=r.target.closest("button[data-race-sim-speed]");if(n){const p=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(p))return;this.timeMultiplier=p,this.render()}}),this.elements.messages.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-group-rider-id]");if(s){const d=this.resolveRiderIdFromGroupButton(s);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),Zt(d));return}const n=r.target.closest("button[data-race-sim-group-rider-name]");if(n){const d=this.resolveRiderIdFromGroupButton(n);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),Zt(d));return}const i=r.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),fn(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",r=>{const s=r.target.closest("[data-race-sim-overview-summary]");if(s){const n=s.dataset.raceSimOverviewSummary,i=s.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(r)}),this.elements.groupBox.addEventListener("click",r=>{this.handleGroupInteraction(r)}),this.elements.profile.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-timing-mode]");if(!s)return;const n=s.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+Bt,this.render())})}handleGroupInteraction(t){var p,u;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const m=this.resolveRiderIdFromGroupButton(a);m!=null&&this.selectGroupByRiderId(m,this.detailSnapshot);return}const r=t.target.closest("button[data-race-sim-group-nav]");if(!r)return;const s=this.buildRaceGroups(this.detailSnapshot);if(s.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,s.findIndex(m=>m.label===n)),o=r.dataset.raceSimGroupNav==="prev"?-1:1,d=(i+o+s.length)%s.length,l=((p=s[d])==null?void 0:p.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",m=>{const f=m.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Bt)}),this.elements.profile.addEventListener("wheel",m=>{const f=m.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Bt)},{passive:!0}),this.elements.profile.addEventListener("scroll",m=>{const f=m.target;!(f instanceof HTMLElement)||!f.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Bt)},!0),(u=this.elements.sidebar.parentElement)==null||u.addEventListener("click",m=>{if(!this.bootstrap||!this.detailSnapshot||!Iu(this.elements.sidebar,m.target))return;const g=performance.now(),b=En(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const v=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",v),this.scheduleSidebarPaintTelemetry(g,v),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new Bi(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const r=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(r),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(s=>this.frame(s));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const r=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-r),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(s=>this.frame(s))}render(t=performance.now(),a=!1){var f;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const r=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",s=Pl(this.bootstrap.stageSummary),n=[`${s.segmentCount} Segmente`,s.sprintCount>0?`${s.sprintCount} Sprint${s.sprintCount===1?"":"s"}`:null,s.climbCount>0?`${s.climbCount} Bergwertung${s.climbCount===1?"":"en"}`:null].filter(g=>g!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,d=o!=null?i[o]??"":"",l=d?` · ${d}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${r}${n?` · ${n}`:""}${l}`;const p=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=hp,u=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,m=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=bp;if(p||u||m){const g=performance.now();this.detailSnapshot=((f=this.engine)==null?void 0:f.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-g)}if(p&&this.detailSnapshot){const g=this.elements.profile.querySelector(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop);const b=performance.now();Hl(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-b),this.lastProfileRenderTime=t;const v=this.elements.profile.querySelector(".race-sim-timing-scroll");v&&(v.scrollTop=this.timingScrollTop)}if(u&&this.detailSnapshot){this.lastSidebarRenderTime=t;const g=performance.now(),b=En(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const v=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",v),this.scheduleSidebarPaintTelemetry(g,v)}m&&this.detailSnapshot&&(fn(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),pu(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),lu(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),gn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const r=a.find(s=>s.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(r)return r.label}return this.selectedGroupLabel!=null&&a.some(r=>r.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return ss(rs(t.clusters))}resolveInitialGroupLabel(t){var a,r;return((a=t.find(s=>s.label==="P"))==null?void 0:a.label)??((r=t[0])==null?void 0:r.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(r=>[r.riderId,r]));return[...t.riderIds].sort((r,s)=>{var n,i;return(((n=a.get(r))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(s))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||r-s})[0]??null}selectGroupByLabel(t,a,r=!0){const s=this.buildRaceGroups(a),n=s.find(i=>i.label===t)??s.find(i=>i.label==="P")??s[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),r&&(this.profileInteractionHoldUntilMs=performance.now()+Bt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const s=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;s&&(this.selectedGroupLabel=s.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+Bt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+vp,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const r=t.dataset.raceSimGroupRiderName;if(!r)return null;const s=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===r&&(s==null||i.activeTeamId===s))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const r=this.perfTelemetry[t];this.perfTelemetry[t]=r<=0?a:r*(1-Gn)+a*Gn}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const r=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(r!==this.sidebarPaintSequence)return;const s=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",s),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||gn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const Ye="__stage_overview__",yo="__non_finishers__",So="__events__",ko="__roster__";let Ne="all";function ys(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function zn(e){return ys(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function Sp(e){return[...e].sort((t,a)=>zn(t)-zn(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function kp(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=ys(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function $p(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function xp(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${oe(t.date)}`}async function Vr(e,t){var s;const a=Va(e);if(a&&(c.selectedResultsRaceId=a.race.id,c.selectedResultsStageId=e),c.riders.length===0){const n=await V.getRiders();n.success&&(c.riders=n.data??[])}const r=await V.getStageResults(e);if(!r.success){c.stageResults=null,Ie(),!t&&r.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+r.error);return}c.stageResults=r.data??null,c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId,c.selectedResultTypeId=((s=c.stageResults.classifications[0])==null?void 0:s.resultTypeId)??1,c.selectedResultsMarkerKey=Ye,c.selectedResultsSpecialView=null),c.selectedResultsRaceId!=null&&$o(c.selectedResultsRaceId),Ie()}async function $o(e){if(!c.seasonStandings){const a=await V.getSeasonStandings();a.success&&a.data&&(c.seasonStandings=a.data)}const t=await V.getRaceResultsRoster(e);t.success&&t.data?c.resultsRoster=t.data:c.resultsRoster=null}function Tp(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function Kn(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function wp(){const e=c.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=St(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=[...e.entries].sort((v,y)=>y.overallRating-v.overallRating),s=new Set(r.slice(0,5).map(v=>v.riderId)),n=v=>{var T;const y=c.riders.find(R=>R.id===v);return((T=y==null?void 0:y.skills)==null?void 0:T.sprint)??0},o=[...e.entries.filter(v=>!s.has(v.riderId))].sort((v,y)=>{const T=n(v.riderId),R=n(y.riderId);return R!==T?R-T:y.overallRating-v.overallRating}),d=new Set(o.slice(0,5).map(v=>v.riderId));function l(v){switch(v){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return v}}const p=new Map;for(const v of e.entries){const y=v.teamId;p.has(y)||p.set(y,{teamId:v.teamId,teamName:v.teamName,riders:[],avgRating:0}),p.get(y).riders.push(v)}for(const v of p.values())v.avgRating=v.riders.reduce((y,T)=>y+T.overallRating,0)/v.riders.length;const u=v=>{let y=Number.POSITIVE_INFINITY;for(const T of v)!T.hasDropped&&T.gcRank!=null&&T.gcRank<y&&(y=T.gcRank);return y},m=v=>{var T;if(!((T=c.seasonStandings)!=null&&T.riderStandings))return 0;let y=0;for(const R of v){const x=c.seasonStandings.riderStandings.find($=>$.riderId===R.riderId);x&&x.points>y&&(y=x.points)}return y},f=v=>{if(v==null)return 0;const y=c.riders.filter(x=>x.activeTeamId===v);if(y.length===0)return 0;const T=y.map(x=>x.overallRating??0);T.sort((x,$)=>$-x);const R=T.slice(0,10);return R.length===0?0:R.reduce((x,$)=>x+$,0)/R.length},g=[...p.values()].sort((v,y)=>{const T=u(v.riders),R=u(y.riders);if((T!==Number.POSITIVE_INFINITY||R!==Number.POSITIVE_INFINITY)&&T!==R)return T-R;const x=m(v.riders),$=m(y.riders);if((x>0||$>0)&&x!==$)return $-x;const C=f(v.teamId),I=f(y.teamId);return Math.abs(C-I)>1e-4?I-C:(v.teamName??"").localeCompare(y.teamName??"","de")});for(const v of g)v.riders.sort((y,T)=>Kn(y.roleId)-Kn(T.roleId)||T.overallRating-y.overallRating||y.lastName.localeCompare(T.lastName,"de"));return`<div class="results-roster-grid">${g.map(v=>{const y=v.teamId!=null?Ft(v.teamId,v.teamName):"",T=v.riders.map(x=>{var j;const $=Tp(x.roleId),C=x.countryCode?Ze[x.countryCode]??x.countryCode.slice(0,2).toLowerCase():null,I=C?`<span class="fi fi-${C} results-roster-flag" title="${S(x.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',P=`${x.firstName.charAt(0)}. ${x.lastName}`,F=x.roleName??"–",L=x.specialization1?l(x.specialization1):null,H=x.specialization2?l(x.specialization2):null;let G=F;L&&(G+=` · ${L}`),H&&(G+=` · ${H}`);const K=`<span class="results-roster-overall-badge" style="color:${Mp(x.overallRating)}" title="Gesamtstärke: ${x.overallRating.toFixed(2)}">${x.overallRating.toFixed(2)}</span>`,w=x.hasDropped?" dropped":"";let A="";x.hasDropped?x.dropoutStatus==="dns"?A="DNS":x.dropoutStatus==="dnf"?A=((j=x.dropoutReason)==null?void 0:j.startsWith("OTL"))??!1?"OTL":"DNF":A="OUT":x.gcRank!=null&&(A=`${x.gcRank}`);let U="";if(x.hasDropped)U=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${S(x.dropoutReason||"")}">${A}</span>`;else if(x.gcRank!=null){let D="rider-stats-rank-badge-gc";x.gcRank===1?D="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":x.gcRank===2?D="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":x.gcRank===3&&(D="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),U=`<span class="rider-stats-rank-badge ${D}" title="GC Stand: Platz ${x.gcRank}">${x.gcRank}</span>`}const ne=`style="color: ${x.hasDropped?"var(--text-500)":$.color}; font-weight: bold;"`,q=s.has(x.riderId),ee=d.has(x.riderId);return`<div class="results-roster-rider${w}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${I}
            <span class="results-roster-name${q?" strongest-rider":ee?" best-sprinter":""}">
              ${De(P,{riderId:x.riderId,teamId:x.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${Ga(x.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${ne}>${S(G)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${U||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${K}
        </div>
      </div>`}).join(""),R=v.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${y}</div>
        <div class="results-roster-team-name" title="${S(v.teamName??"–")}">${it(v.teamName??"–",v.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${R})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${T}</div>
    </div>`}).join("")}</div>`}function Mp(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function Rp(e){var l,p;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=c.stageResults)==null?void 0:l.classifications.find(u=>u.resultTypeId===1),a=new Set(t?t.rows.map(u=>u.riderId).filter(u=>u!=null):[]),r=c.riders.filter(u=>u.activeTeamId===e.teamId&&a.has(u.id)),s=new Set((((p=c.stageResults)==null?void 0:p.nonFinishers)??[]).map(u=>u.riderId)),n=[];for(const u of r){if(u.id===e.riderId||s.has(u.id))continue;let m=0;const f=u.skills.sprint>=72,g=u.skills.flat>=78,b=u.skills.timeTrial>=76,v=u.skills.acceleration>=80;if(f&&m++,g&&m++,b&&m++,v&&m++,m>0){let y=1;m===2?y=1.25:m===3?y=1.5:m===4&&(y=2),n.push({id:u.id,firstName:u.firstName,lastName:u.lastName,countryCode:u.nationality??null,isSprinter:f,multiplier:y,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const u=n.filter(v=>v.isSprinter).reduce((v,y)=>v+y.multiplier,0),m=n.filter(v=>!v.isSprinter).reduce((v,y)=>v+y.multiplier,0);let f=0,g=0;u>0&&m>0?(f=i/(2.125*u+m),g=2.125*f,f=Math.max(.1,Math.min(.3,f)),g=Math.max(.25,Math.min(.6,g))):u>0?(g=i/u,g=Math.max(.25,Math.min(.6,g)),f=g/2.125):m>0&&(f=i/m,f=Math.max(.1,Math.min(.3,f)),g=2.125*f);for(const v of n)v.contribution=v.isSprinter?g*v.multiplier:f*v.multiplier;const b=n.reduce((v,y)=>v+y.contribution,0);if(b>0){const v=i/b;for(const y of n)y.contribution*=v}n.sort((v,y)=>y.contribution-v.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),d=n.map(u=>{const m=ot(zt(u.id)??u.countryCode),f=u.firstName?`${u.firstName.charAt(0)}. ${u.lastName}`:u.lastName,g=u.contribution.toFixed(2).replace(".",",");return`
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
  `}function Wn(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function Ga(e){var u,m,f,g,b,v,y,T,R,x;if(e==null||!c.stageResults)return"";const t=St(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=c.stageResults.classifications,s=(m=(u=r.find($=>$.resultTypeId===Ba))==null?void 0:u.rows.find($=>$.rank===1))==null?void 0:m.riderId,n=(g=(f=r.find($=>$.resultTypeId===Ar))==null?void 0:f.rows.find($=>$.rank===1))==null?void 0:g.riderId,i=(v=(b=r.find($=>$.resultTypeId===ui))==null?void 0:b.rows.find($=>$.rank===1))==null?void 0:v.riderId,o=(T=(y=r.find($=>$.resultTypeId===5))==null?void 0:y.rows.find($=>$.rank===1))==null?void 0:T.riderId,d=(x=(R=r.find($=>$.resultTypeId===7))==null?void 0:R.rows.find($=>$.rank===1))==null?void 0:x.riderId,l=[],p=c.selectedResultTypeId;return e===s&&(p===Ba||p===1&&a||p!==1&&p!==Ba)&&l.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&l.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&l.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&l.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===d&&l.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>'),l.length===0?"":`<span class="jersey-dots-wrapper">${l.join("")}</span>`}function jn(e){if(!e)return"";let t=e;const a=[],r=[...c.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of r){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),d=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");d.test(t)&&(t=t.replace(d,l=>{const p=`__RIDER_LINK_${a.length}__`,u=De(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(u),p}))}let s=S(t);for(let n=0;n<a.length;n++)s=s.replace(`__RIDER_LINK_${n}__`,a[n]);return s}function Ie(){var _,E,O,z;c.riders.length===0&&V.getRiders().then(k=>{k.success&&k.data&&(c.riders=k.data,Ie())});const e=h("results-race-select"),t=h("results-stage-select"),a=h("results-type-tabs"),r=h("results-marker-tabs"),s=h("results-stage-meta"),n=h("results-empty"),i=h("results-table"),o=i.querySelector("thead tr"),d=h("results-tbody"),l=h("results-marker-classifications"),p=h("results-roster"),u=i.querySelector("colgroup");u&&u.remove(),i.style.tableLayout="",c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+c.races.filter(k=>{var M;return(((M=k.stages)==null?void 0:M.length)??0)>0}).map(k=>`<option value="${k.id}"${k.id===c.selectedResultsRaceId?" selected":""}>${S(k.name)}</option>`).join("");const m=St(c.selectedResultsRaceId),f=m==null?"":(m.stages??[]).map(k=>`<option value="${k.id}"${k.id===c.selectedResultsStageId?" selected":""}>${S(xp(m,k))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+f;const g=((_=c.stageResults)==null?void 0:_.classifications.filter(k=>!(m&&!m.isStageRace&&k.resultTypeId!==1&&k.resultTypeId!==6)))??[],b=g.find(k=>k.resultTypeId===c.selectedResultTypeId)??g[0]??null,v=c.selectedResultsSpecialView==="nonFinishers",y=c.selectedResultsSpecialView==="events",T=c.selectedResultsSpecialView==="roster";if(b&&!v&&!y&&!T&&(c.selectedResultTypeId=b.resultTypeId),y){i.style.tableLayout="fixed";const k=document.createElement("colgroup");k.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(k,i.firstChild)}if(!c.stageResults&&!T||!b&&!v&&!y&&!T){const k=Va(c.selectedResultsStageId);s.textContent=k?`${k.race.name} · ${k.stage.profile} · ${oe(k.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",r.innerHTML="",r.classList.add("hidden"),d.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),p.innerHTML="",p.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=c.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}T?c.resultsRoster&&(s.textContent=`${c.resultsRoster.raceName} · Starterfeld`):c.stageResults&&(s.textContent=`${c.stageResults.raceName} · Etappe ${c.stageResults.stageNumber} · ${c.stageResults.profile} · ${oe(c.stageResults.date)}`);const R=c.stageResults?Va(c.stageResults.stageId):null,x=(R==null?void 0:R.stage.distanceKm)??null,$=new Map,C=new Map,I=new Map;if(c.stageResults){const k=c.stageResults.classifications.find(M=>M.resultTypeId===1);if(k)for(const M of k.rows)M.riderId!=null&&M.points!=null&&M.points>0&&$.set(M.riderId,M.points),M.riderId!=null&&M.breakawayKms!=null&&M.breakawayKms>0&&I.set(M.riderId,M.breakawayKms);if(c.stageResults.markerClassifications){for(const M of c.stageResults.markerClassifications)if(ys(M.markerType,M.markerCategory)){for(const N of M.entries)if(N.riderId!=null&&N.pointsAwarded!=null&&N.pointsAwarded>0){const B=C.get(N.riderId)??0;C.set(N.riderId,B+N.pointsAwarded)}}}}const P=(b==null?void 0:b.resultTypeId)===Ba,F=(b==null?void 0:b.resultTypeId)===Ar||(b==null?void 0:b.resultTypeId)===ui,L=(b==null?void 0:b.resultTypeId)===5,H=(b==null?void 0:b.resultTypeId)===6,G=(b==null?void 0:b.resultTypeId)===7,K=P||F||L||H||G,w=g.map(k=>`
    <button
      type="button"
      class="results-type-btn${!v&&!y&&!T&&k.resultTypeId===c.selectedResultTypeId?" active":""}"
      data-result-type-id="${k.resultTypeId}"
    >${S(k.resultTypeName)}</button>
  `),A=`
    <button
      type="button"
      class="results-type-btn${v?" active":""}"
      data-results-special-view="${yo}"
    >OTL/DNF</button>
  `,U=`
    <button
      type="button"
      class="results-type-btn${y?" active":""}"
      data-results-special-view="${So}"
    >Ereignisse</button>
  `,W=`
    <button
      type="button"
      class="results-type-btn${T?" active":""}"
      data-results-special-view="${ko}"
    >Teilnehmer</button>
  `,ne=g.findIndex(k=>k.resultTypeName.toLocaleLowerCase("de").includes("team"));ne>=0?w.splice(ne+1,0,A,U,W):w.push(A,U,W),a.innerHTML=w.join("");const q=Sp(((E=c.stageResults)==null?void 0:E.markerClassifications)??[]);if(T){p.innerHTML=wp(),p.classList.remove("hidden"),i.classList.add("hidden"),r.innerHTML="",r.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else p.innerHTML="",p.classList.add("hidden");const ee=!v&&!y&&!T&&(b==null?void 0:b.resultTypeId)===1&&q.length>0,Y=ee?c.selectedResultsMarkerKey??Ye:null,j=ee&&Y!==Ye?q.find(k=>k.markerKey===Y)??null:null;if(ee&&(c.selectedResultsMarkerKey=(j==null?void 0:j.markerKey)??Ye),y){const k=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"},{key:"superteam",label:"Superteam"}];r.innerHTML=k.map(M=>`
      <button
        type="button"
        class="results-type-btn${M.key===Ne?" active":""}"
        data-event-filter="${M.key}"
      >${S(M.label)}</button>
    `).join("")}else r.innerHTML=ee?[`
        <button
          type="button"
          class="results-type-btn${c.selectedResultsMarkerKey===Ye?" active":""}"
          data-marker-key="${Ye}"
        >Tageswertung</button>`,...q.map(k=>`
        <button
          type="button"
          class="results-type-btn${k.markerKey===c.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${k.markerKey}"
        >${S(kp(k))}</button>
      `)].join(""):"";r.classList.toggle("hidden",!y&&!ee);const D=v||y||!ee||c.selectedResultsMarkerKey===Ye;if(o&&D&&(o.innerHTML=v?`
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
        `:G?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Kilometer</th>
          <th>UCI Punkte</th>
        `:H?`
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
      `),d.innerHTML=v?(((O=c.stageResults)==null?void 0:O.nonFinishers)??[]).map(k=>`
      <tr>
        <td>${k.stageNumber}</td>
        <td>${ul(k.isOtl)}</td>
        <td class="results-jersey-col-cell">${Qt(k.teamId,k.teamName)}</td>
        <td>${ea(k.riderName,!0,!1,k.riderId,k.teamId)}</td>
        <td class="results-flag-col-cell">${ot(k.countryCode)}</td>
        <td>${it(k.teamName||"–",k.teamId)}</td>
        <td>${S(Br(k.statusReason,k.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':y?[...((z=c.stageResults)==null?void 0:z.events)??[]].filter(k=>Ne==="all"?!0:Ne==="form"?!!(k.title&&(k.title.includes("guten Tag")||k.title.includes("schlechten Tag")||k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))):Ne==="attack"?(k.type==="attack"||k.type==="counter_attack")&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Ne==="breakaway"?!!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Ne==="incident"?(k.type==="incident"||!!(k.title&&k.title.includes("Massensturz")))&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Ne==="exit"?k.type==="dnf"||!!(k.title&&k.title.includes("nicht am Start")):Ne==="home"?!!(k.title&&(k.title.includes("Heimvorteil")||k.title.includes("Heimdruck"))):Ne==="weather"?!!(k.title&&k.title.startsWith("Wetterbericht:")):Ne==="superteam"?k.type==="superteam":!0).sort((k,M)=>{const N=k.kmMark??0,B=M.kmMark??0;if(Math.abs(N-B)>1e-4)return N-B;if(N===0){const me=Wn(k),fe=Wn(M);if(me!==fe)return me-fe}const Z=k.riderName??"",ie=M.riderName??"";return Z.localeCompare(ie,"de")}).map(k=>{var pt,xt,As;const M=k.kmMark!=null?`${k.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",N=k.riderId,B=N!=null?Re(N):null,Z=k.riderTeamId??(B==null?void 0:B.activeTeamId)??null,ie=Z!=null?((pt=c.teams.find(ka=>ka.id===Z))==null?void 0:pt.name)??null:null;let me=Qt(Z,ie);const fe=!!(k.title&&k.title.startsWith("Wetterbericht:"));let be=k.title||"";if(fe){const ka=(xt=c.stageResults)==null?void 0:xt.rolledWeatherId,Sr=(As=c.stageResults)==null?void 0:As.rolledWetterName;me=`<span class="results-jersey-cell">${fs(ka,Sr)}</span>`,Sr&&(be=`Wetterbericht: ${Sr}`)}const ye=k.type==="superteam",ve=ye&&N==null,Se=fe||ve?"":ot(N!=null?zt(N):null),at=fe?"":ve?it(ie||"–",Z):N!=null?ea(k.riderName??"",!0,!1,N,Z):S(k.riderName||"–");let te="";return k.title&&k.title.includes("guten Tag")?te='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':k.title&&k.title.includes("schlechten Tag")?te='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':k.title&&(k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))?te='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':k.title&&k.title.includes("nicht am Start")?te='<span class="event-badge event-badge-dns">DNS</span>':k.title&&k.title.includes("Massensturz")?te='<span class="event-badge event-badge-masscrash">Massensturz</span>':k.type==="dnf"?te='<span class="event-badge event-badge-dnf">DNF</span>':k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))?te='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':k.type==="attack"?te='<span class="event-badge event-badge-attack">Attacke</span>':k.type==="counter_attack"?te='<span class="event-badge event-badge-counter">Konterattacke</span>':k.type==="incident"?k.title&&(k.title.toLowerCase().includes("defekt")||k.title.toLowerCase().includes("panne")||k.title.toLowerCase().includes("technisch"))?te='<span class="event-badge event-badge-defect">Defekt</span>':te='<span class="event-badge event-badge-crash">Sturz</span>':k.title&&k.title.includes("Super-Heimvorteil")?te='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>':k.title&&k.title.includes("Heimdruck")?te='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>':k.title&&k.title.includes("Heimvorteil")?te='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':k.title&&k.title.startsWith("Wetterbericht:")?te='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>':ye&&(te='<span class="event-badge event-badge-superteam"><span class="event-icon">⚡</span> Superteam</span>'),`
          <tr>
            <td>${M}</td>
            <td>
              <div class="event-rider-info">
                ${me}
                ${Se}
                ${at}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${jn(be)}</span>
                  ${te}
                </div>
                ${k.detail?`<div class="event-detail">${jn(k.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':D&&b?b.rows.map(k=>{const M=k.riderName??k.teamName,N=k.riderName?k.teamName:"–",B=Qt(k.teamId,k.teamName),Z=ea(M,!0,k.isBreakaway===!0,k.riderId,k.teamId),ie=ot(zt(k.riderId)),me=b.resultTypeId===1&&k.rank===1&&k.timeSeconds!=null&&x!=null,fe=k.timeSeconds!=null?`${Oa(k.timeSeconds)}${me?` (${$p(x,k.timeSeconds)})`:""}`:"–",be=K?`<td class="results-gc-delta-cell">${ml(k.previousRank,k.rankDelta)}</td>`:"";if(F){let ve=k.points!=null?String(k.points):"–";if(k.points!=null&&k.riderId!=null&&b){const at=b.resultTypeId===Ar?$.get(k.riderId)??0:C.get(k.riderId)??0;at>0&&(ve+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${at}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${be}
            <td class="results-jersey-col-cell">${B}</td>
            <td>${Z}${Ga(k.riderId)}</td>
            <td class="results-flag-col-cell">${ie}</td>
            <td>${it(N,k.teamId)}</td>
            <td class="results-points-cell">${ve}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(G){let ve=k.breakawayKms!=null?`${k.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if(k.breakawayKms!=null&&k.riderId!=null){const Se=I.get(k.riderId)??0;Se>0&&(ve+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${Se.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${be}
            <td class="results-jersey-col-cell">${B}</td>
            <td>${Z}${Ga(k.riderId)}</td>
            <td class="results-flag-col-cell">${ie}</td>
            <td>${it(N,k.teamId)}</td>
            <td class="results-points-cell">${ve}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(H)return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${be}
            <td class="results-jersey-col-cell">${B}</td>
            <td>${it(k.teamName,k.teamId)}</td>
            <td class="results-flag-col-cell">${ie}</td>
            <td>${fe}</td>
            <td>${S(kr(k.gapSeconds))}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`;let ye=k.points!=null?String(k.points):"–";if(k.leadoutBonus!=null&&k.leadoutBonus>0&&k.leadoutRiderId!=null){const ve=Rp(k);ye=`
          <div class="leadout-bonus-anchor">
            ${k.points!=null?k.points:"–"}
            ${ve}
          </div>
        `}return`
        <tr>
          <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
          ${be}
          <td class="results-jersey-col-cell">${B}</td>
          <td>${Z}${Ga(k.riderId)}</td>
          <td class="results-flag-col-cell">${ie}</td>
          <td>${it(N,k.teamId)}</td>
          <td>${fe}</td>
          <td>${S(kr(k.gapSeconds))}</td>
          <td class="results-points-cell">${ye}</td>
          <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
        </tr>`}).join(""):"",n.classList.toggle("hidden",!!b||v||y||T),i.classList.toggle("hidden",!D||T),j){const k=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${S(pl(j.markerType,j.markerLabel))}</h4>
          <div class="results-marker-card-meta">${S(`${j.kmMark.toFixed(1).replace(".",",")} km${j.markerCategory?` · Kat. ${j.markerCategory}`:""}`)}</div>
        </div>
      </section>`,M=j.entries.map(N=>{var me;const B=Re(N.riderId),Z=B?`${B.firstName} ${B.lastName}`:`Fahrer ${N.riderId}`,ie=(B==null?void 0:B.activeTeamId)!=null?((me=c.teams.find(fe=>fe.id===B.activeTeamId))==null?void 0:me.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${N.rank}.</div>
          <div class="results-marker-jersey">${Qt(B==null?void 0:B.activeTeamId,ie)}</div>
          <div class="results-marker-name">${ea(Z,!1,!1,(B==null?void 0:B.id)??null,(B==null?void 0:B.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${ot(zt(B==null?void 0:B.id))}</div>
          <div class="results-marker-time">${S(Oa(N.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${S(kr(N.gapSeconds))}</div>
          <div class="results-marker-points">${N.pointsAwarded!=null&&N.pointsAwarded>0?N.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${k}<div class="results-marker-list">${M}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!j)}function Ip(){h("results-race-select").addEventListener("change",e=>{var r,s;const t=e.target.value;c.selectedResultsRaceId=t?Number(t):null;const a=St(c.selectedResultsRaceId);c.selectedResultsStageId=((s=(r=a==null?void 0:a.stages)==null?void 0:r[0])==null?void 0:s.id)??null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=Ye,c.selectedResultsSpecialView=null,c.stageResults=null,Ie(),c.selectedResultsStageId!=null&&Vr(c.selectedResultsStageId,!0)}),h("results-stage-select").addEventListener("change",e=>{const t=e.target.value;c.selectedResultsStageId=t?Number(t):null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=Ye,c.selectedResultsSpecialView=null,c.stageResults=null,Ie(),c.selectedResultsStageId!=null&&Vr(c.selectedResultsStageId,!0)}),h("results-type-tabs").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-result-type-id]");if(t){c.selectedResultsSpecialView=null,c.selectedResultTypeId=Number(t.dataset.resultTypeId),Ie();return}const a=e.target.closest("button[data-results-special-view]");if(a){const s=a.dataset.resultsSpecialView;s===yo?(c.selectedResultsSpecialView="nonFinishers",Ie()):s===So?(c.selectedResultsSpecialView="events",Ne="all",Ie()):s===ko&&(c.selectedResultsSpecialView="roster",c.selectedResultsRaceId!=null&&((r=c.resultsRoster)==null?void 0:r.raceId)!==c.selectedResultsRaceId&&$o(c.selectedResultsRaceId).then(()=>Ie()),Ie())}}),h("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const r=t.dataset.markerKey;c.selectedResultsMarkerKey=r??Ye,Ie();return}const a=e.target.closest("button[data-event-filter]");a&&(Ne=a.dataset.eventFilter??"all",Ie())})}const Ss=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],va=["skills","form","profile","preferences"],ks=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],$s={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...Ss.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function xs(){return[...ks,...$s[c.teamDetailPage]]}function xo(e,t=12){const a=c.riders.filter(s=>s.activeTeamId===e).sort((s,n)=>n.overallRating-s.overallRating).slice(0,t);return a.length===0?null:a.reduce((s,n)=>s+n.overallRating,0)/a.length}function To(e){const t=c.riders.filter(r=>r.activeTeamId===e);return t.length===0?null:t.reduce((r,s)=>r+s.overallRating,0)/t.length}function wo(e){const t=xo(e);return t==null?"–":t.toFixed(1).replace(".",",")}function Mo(e){const t=To(e);return t==null?"–":t.toFixed(1).replace(".",",")}function se(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function Ce(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:se(e,t)}function ke(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function Ee(e){return e==null?void 0:typeof e=="string"?sa(e):e.name}function Ts(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...Ss.map(t=>t.key)].includes(e)?"desc":"asc"}function Ro(e){return c.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function Io(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=c.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Ro(e.sortKey)}
      </button>
    </th>`}function Co(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${va.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const Eo={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function ws(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":Eo[e]??String(e)}function Fo(e){const t=[...e],a=c.teamTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(c.teamTableSort.key){case"name":n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName);break;case"countryCode":n=se(Pt(r),Pt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=se(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=se(yt(r),yt(s));break;case"riderType":n=se(r.riderType,s.riderType)||se(_e(r),_e(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Ce(Ee(r.specialization1),Ee(s.specialization1));break;case"specialization2":n=Ce(Ee(r.specialization2),Ee(s.specialization2));break;case"specialization3":n=Ce(Ee(r.specialization3),Ee(s.specialization3));break;case"peak1":n=Ce(ke(r,0),ke(s,0));break;case"peak2":n=Ce(ke(r,1),ke(s,1));break;case"peak3":n=Ce(ke(r,2),ke(s,2));break;default:n=r.skills[c.teamTableSort.key]-s.skills[c.teamTableSort.key];break}return n===0&&(n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName)),n*a}),t}function Po(e){const t=[...e],a=c.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(c.riderMenuTableSort.key){case"name":n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName);break;case"countryCode":n=se(Pt(r),Pt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=se(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=se(yt(r),yt(s));break;case"riderType":n=se(r.riderType,s.riderType)||se(_e(r),_e(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Ce(Ee(r.specialization1),Ee(s.specialization1));break;case"specialization2":n=Ce(Ee(r.specialization2),Ee(s.specialization2));break;case"specialization3":n=Ce(Ee(r.specialization3),Ee(s.specialization3));break;case"peak1":n=Ce(ke(r,0),ke(s,0));break;case"peak2":n=Ce(ke(r,1),ke(s,1));break;case"peak3":n=Ce(ke(r,2),ke(s,2));break;default:n=r.skills[c.riderMenuTableSort.key]-s.skills[c.riderMenuTableSort.key];break}return n===0&&(n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName)),n*a}),t}function Ur(e){return e.length===0?"–":e.map(t=>{const a=c.races.find(r=>r.id===t);return a?S(a.name):`Rennen ${t}`}).join(", ")}function Cp(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function Ms(e,t){var a,r;switch(t.id){case"name":return`<td class="team-table-name-cell">${De(_e(e),{riderId:e.id,teamId:e.activeTeamId,strong:c.teamDetailPage==="form"||c.teamDetailPage==="profile"||c.teamDetailPage==="preferences"})}${Sl(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${de(Pt(e))}<span>${S(Pt(e))}</span></span></td>`;case"age":return`<td>${e.age??(c.gameState?c.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${S(yt(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${Ws(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${vl(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${Ws((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${js(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${js(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${bi(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${S(ke(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${S(ke(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${S(ke(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${S(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?S(sa(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?S(sa(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?S(sa(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${yl(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${de(e.mentorCountryCode??"UNK")} <span>${S(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${Ur(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${Ur(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const s=t.sortKey;return s&&s in e.skills?`<td>${bl(e.skills[s],(a=e.yearStartSkills)==null?void 0:a[s],(r=e.potentials)==null?void 0:r[s])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function sr(){Me("Teams/Fahrer werden aktualisiert...");try{const e=await V.getRiders();if(e.success&&(c.riders=e.data??[]),await V.getTeams().then(t=>{t.success&&(c.teams=t.data??[])}),we("teams")&&Rs(),we("riders")){const{renderRidersMenu:t}=await yi(async()=>{const{renderRidersMenu:a}=await Promise.resolve().then(()=>Qp);return{renderRidersMenu:a}},void 0);t()}}finally{$e()}}async function Ep(e={}){const t=await V.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),h("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${S(t.error??"Unbekannt")}</p>`;return}c.teams=t.data??[],e.render!==!1&&we("teams")&&Rs()}function Rs(){const e=h("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+c.teams.map(r=>`<option value="${r.id}"${String(r.id)===t?" selected":""}>${S(r.name)} (${S(r.division??r.divisionName??"")}) · ${S(r.abbreviation)}</option>`).join("");const a=t?Number(t):null;la(a)}function la(e){const t=h("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=c.teams.find(i=>i.id===e);if(!a){t.innerHTML="";return}const r=Fo(c.riders.filter(i=>i.activeTeamId===e)),s=a.division==="U23"?"badge-u23":"badge-classics",n=xs();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${S(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${s}">${S(a.division??a.divisionName??"")}</span>
          <span>${gl(a.country,a.countryCode)}</span>
          <span>Kürzel: ${S(a.abbreviation)} · Top 12 ${S(wo(a.id))} (${S(Mo(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(ws(c.teamTableSort.key))} ${c.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Co()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${n.map(Io).join("")}
          </tr></thead>
          <tbody>
            ${r.length===0?`<tr><td colspan="${n.length}" class="text-muted">Keine Fahrer.</td></tr>`:r.map(i=>`
                <tr class="team-detail-row">
                  ${n.map(o=>Ms(i,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function No(){h("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;c.teamDetailPage="skills",la(t?Number(t):null)}),h("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&Fs(s);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const s=a.dataset.teamDetailPage;if(va.includes(s)){c.teamDetailPage=s,new Set(xs().map(o=>o.sortKey).filter(o=>o!=null)).has(c.teamTableSort.key)||(c.teamTableSort={key:"name",direction:"asc"});const i=Number(h("teams-dropdown").value);la(Number.isFinite(i)?i:null)}return}const r=e.target.closest("button[data-team-sort]");if(r){const s=r.dataset.teamSort;c.teamTableSort.key===s?c.teamTableSort.direction=c.teamTableSort.direction==="asc"?"desc":"asc":c.teamTableSort={key:s,direction:Ts(s)};const n=Number(h("teams-dropdown").value);la(Number.isFinite(n)?n:null);return}})}const Fp=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:$s,TEAM_DETAIL_PAGE_ORDER:va,TEAM_SKILL_COLUMNS:Ss,TEAM_SKILL_TITLES:Eo,TEAM_TABLE_COLUMNS:ks,compareOptionalStrings:Ce,compareStrings:se,formatTeamAverage:Mo,formatTeamTopAverage:wo,getActiveTeamTableColumns:xs,getDefaultTeamSortDirection:Ts,getPeakDate:ke,getSortIndicator:Ro,getSpecializationSortLabel:Ee,getTeamAverage:To,getTeamSortLabel:ws,getTeamTopAverage:xo,initTeamsListeners:No,loadTeams:Ep,refreshTeamsViewData:sr,renderPeakDatesSummary:Cp,renderRacePrefs:Ur,renderTeamDetail:la,renderTeamDetailPageTabs:Co,renderTeamTableCell:Ms,renderTeamTableHeader:Io,renderTeams:Rs,sortRiderMenuRiders:Po,sortTeamRiders:Fo},Symbol.toStringTag,{value:"Module"}));function Pp(e,t,a){return`${e} · Etappe ${t} · ${a}`}function Lo(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function Do(e,t){const a=[];for(const r of e.riders)if(r.leadoutBonus!=null&&r.leadoutBonus>0&&r.leadoutContributions&&r.leadoutContributions.length>0){const s=t.riders.find(i=>i.id===r.riderId),n=(s==null?void 0:s.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:r.riderId,leadoutBonus:r.leadoutBonus,contributorsJson:JSON.stringify(r.leadoutContributions)})}return a}async function _o(e,t=!1){if(di!=null||es)return!1;Hs(e),hl(0);try{const a=await V.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const r=a.data;c.realtimeBootstrap=r;const s=await Sc(r,o=>gi(o)),n=Lo(s,r),i=Do(s,r);return await Ko(e,n,s.markerClassifications,s.incidents,s.allEvents,t,i,s.superTeamId),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{Hs(null),$e()}}function Ao(e){var r;const t=(r=c.rosterEditor)==null?void 0:r.teams.find(s=>s.team.id===e);if(!t)return 0;const a=new Set(c.rosterEditorSelectedRiderIds);return t.riders.filter(s=>a.has(s.rider.id)).length}function Bo(){return c.rosterEditor?c.rosterEditor.teams.every(e=>Ao(e.team.id)===e.riderLimit):!1}function Pr(){const e=h("roster-editor-title"),t=h("roster-editor-meta"),a=h("roster-editor-body"),r=h("btn-apply-roster-editor"),s=c.rosterEditor;if(!s){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',r.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=s.race.isStageRace?`${s.race.name} · Etappe ${s.stage.stageNumber} · ${s.stage.profile}`:`${s.race.name} · ${s.stage.profile}`;const n=new Set(c.rosterEditorSelectedRiderIds);a.innerHTML=s.teams.map(i=>{const o=Ao(i.team.id),d=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
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
      </section>`}).join(""),r.disabled=!Bo()}function Yr(){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],ua("roster-editor-error"),Ue("rosterEditor")}function Ho(e,t){c.selectedRealtimeStageId=e.stage.id,c.realtimeBootstrap=e,c.realtimeError=null,t&&Dt("live-race"),Go().load(e,{autoplay:!0,resetSpeed:!0}),Ot()}function Go(){let e=ra;if(!e){const t=h("race-sim-layout"),a=h("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new yp({layout:t,emptyState:a,controlsHeader:h("race-sim-controls-header"),profile:h("race-sim-profile"),groupBox:h("race-sim-group-box"),messages:h("race-sim-messages-body"),favorites:h("race-sim-favorites-body"),sidebar:h("race-sim-sidebar-body"),controls:h("race-sim-controls"),meta:h("race-sim-stage-meta")},{onFinishRequested:(r,s)=>{const n=Lo(r,s),i=Do(r,s);Ko(s.stage.id,n,r.markerClassifications,r.incidents,r.allEvents,!1,i,r.superTeamId)}}),cl(e)}return e}async function Np(e){Me("Starterfeld wird geladen..."),ua("roster-editor-error");try{const t=await V.getRosterEditor(e);if(!t.success||!t.data){It("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),qe("rosterEditor"),Pr();return}c.rosterEditor=t.data,c.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(r=>r.isSelected).map(r=>r.rider.id)),Pr(),qe("rosterEditor")}catch(t){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],It("roster-editor-error",t.message),qe("rosterEditor"),Pr()}finally{$e()}}async function Lp(){const e=c.rosterEditor;if(e){if(!Bo()){It("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}ua("roster-editor-error"),Me("Starterfeld wird übernommen...");try{const t=await V.applyRosterEditor(e.stage.id,{riderIds:c.rosterEditorSelectedRiderIds});if(!t.success||!t.data){It("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}Yr(),Ho(t.data,!0)}catch(t){It("roster-editor-error",t.message)}finally{$e()}}}function Ot(){var n,i;const e=h("race-sim-stage-select"),t=((n=c.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===c.selectedRealtimeStageId)||(c.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===c.selectedRealtimeStageId?" selected":""}>${S(Pp(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const r=t.find(o=>o.stageId===c.selectedRealtimeStageId)??null,s=Go();if(!r){c.realtimeBootstrap=null,c.realtimeError=null,s.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!c.realtimeBootstrap||c.realtimeBootstrap.stage.id!==r.stageId)&&(c.realtimeError?s.clear(c.realtimeError):s.hide())}async function zo(e,t){if(_r!==e){Gs(e),c.selectedRealtimeStageId=e,t&&Dt("live-race"),Ot(),Me("Live-Simulation wird geladen...");try{const a=await V.getRealtimeSimulation(e);if(!a.success||!a.data){c.realtimeBootstrap=null,c.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",Ot(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}Ho(a.data,!1)}catch(a){c.realtimeBootstrap=null,c.realtimeError=a.message,Ot(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{_r===e&&Gs(null),$e()}}}async function Ko(e,t,a,r,s,n=!1,i,o){if(!es){Bs(!0),Me("Live-Ergebnis wird gespeichert...");try{const d=await V.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:r,events:s,leadoutContributions:i,superTeamId:o});if(!d.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(d.error??"Unbekannter Fehler"));return}const l=d.data;c.selectedResultsRaceId=(l==null?void 0:l.raceId)??c.selectedResultsRaceId,c.selectedResultsStageId=(l==null?void 0:l.stageId)??e,c.selectedResultTypeId=1,c.realtimeBootstrap=null,c.realtimeError=null,await Vr(e,!1),await Cs(),await Es(),await sr(),Ot(),n||Dt("results")}catch(d){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+d.message)}finally{Bs(!1),$e()}}}function Dp(){h("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);c.selectedRealtimeStageId=Number.isFinite(t)?t:null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null),c.realtimeError=null,zo(t,!1)})}function Is(e){var r;const t=ct((r=e.category)==null?void 0:r.name),a=lr(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function pr(e){var s,n;const t=ct((s=e.category)==null?void 0:s.name),a=lr(t),r=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${S(r)}</span>`}function _p(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(r=>r.date).sort((r,s)=>r.localeCompare(s));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function gr(e){const{startDate:t,endDate:a}=_p(e);return t===a?oe(t):`${oe(t)} - ${oe(a)}`}function Ap(e){return e.stageId>0}async function Cs(){const[e,t]=await Promise.all([V.getGameState(),V.getGameStatus()]);if(!e.success){console.error(e.error);return}c.gameState=e.data??null,c.gameStatus=t.success?t.data??null:null,Bp(),we("dashboard")&&fr()}function Bp(){var s;if(!c.gameState)return;h("meta-date").textContent=c.gameState.formattedDate,h("meta-season").textContent=`Saison ${c.gameState.season}`;const e=h("meta-race-hint"),t=h("btn-advance-day"),a=h("pending-stages-list"),r=((s=c.gameStatus)==null?void 0:s.pendingStages)??[];r.length>0?(e.textContent=`${r.length} offene Etappe${r.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=r.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${oe(n.date)}`:`${n.profile} · ${oe(n.date)}`,o=Ap(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
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
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):c.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function fr(){var t,a,r,s,n;const e=c.teams.find(i=>i.isPlayerTeam)??c.teams.find(i=>{var o;return i.name===((o=c.currentSave)==null?void 0:o.teamName)})??null;h("dashboard-career").textContent=((t=c.currentSave)==null?void 0:t.careerName)??"–",h("dashboard-team").textContent=(e==null?void 0:e.name)??((a=c.currentSave)==null?void 0:a.teamName)??"–",h("dashboard-date").textContent=((r=c.gameState)==null?void 0:r.formattedDate)??"–",h("dashboard-season").textContent=c.gameState?`Saison ${c.gameState.season}`:"–",h("dashboard-races-today").textContent=String(((s=c.gameStatus)==null?void 0:s.pendingStages.length)??((n=c.gameState)==null?void 0:n.racesTodayCount)??0),Kp()}async function Es(){const e=await V.getRaces();if(!e.success){console.error(e.error);return}c.races=e.data??[],we("dashboard")&&fr(),Hp(),Gp()}async function Hp(){var n;const e=(n=c.gameState)==null?void 0:n.season;if(!e||c.races.length===0)return;const t=`participantCountsLogged_${e}`;if(localStorage.getItem(t))return;const a=c.races.slice(0,30),r=await Promise.all(a.map(async i=>{var d;const o=await V.getRaceProgramParticipants(i.id);return{race:i,count:o.success?((d=o.data)==null?void 0:d.length)??0:-1}}));if(r.some(i=>i.count>0)){console.group(`[Velo] Teilnehmeranzahl Saison ${e}`);for(const{race:i,count:o}of r)o>=0&&console.log(`${i.name} (${i.startDate}): ${o} Programmfahrer`);console.groupEnd(),localStorage.setItem(t,"1")}}async function Gp(){var i;const e=(i=c.gameState)==null?void 0:i.season;if(!e)return;const t=`programAssignmentsLogged_${e}`;if(localStorage.getItem(t))return;const a=await V.getRiders();if(!a.success||!a.data)return;const r=a.data,s=new Map;for(const o of r)if(o.seasonProgram){const d=o.seasonProgram;s.has(d.id)||s.set(d.id,{name:d.name,riders:[]}),s.get(d.id).riders.push(o)}if(s.size===0)return;console.group(`[Velo] Programmzuweisungen Saison ${e}`);const n=Array.from(s.keys()).sort((o,d)=>o-d);for(const o of n){const d=s.get(o);console.log(`Program: ${o} - ${d.name} (Count: ${d.riders.length})`)}console.groupEnd(),localStorage.setItem(t,"1")}function zp(e,t){const[a,r,s]=e.split("-").map(Number),n=new Date(a,r-1,s);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),d=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${d}`}function On(e){var p,u,m,f;const t=c.gameState!=null&&e.startDate<=c.gameState.currentDate&&e.endDate>=c.gameState.currentDate,r=c.gameState!=null&&e.endDate<c.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',s=((p=e.country)==null?void 0:p.name)??`Land ${e.countryId}`,n=(u=e.country)!=null&&u.code3?de(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.distanceKm??0),0):((m=e.upcomingStage)==null?void 0:m.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.elevationGainMeters??0),0):((f=e.upcomingStage)==null?void 0:f.elevationGainMeters)??null,d=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${oe(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${S(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${Is(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${S(s)}</span></span></td>
      <td>${pr(e)}</td>
      <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${e.id}">Teilnehmer</button></td>
      <td>${d}</td>
      <td>${l}</td>
      <td>${r}</td>
    </tr>`}function Kp(){const e=h("dashboard-races-tbody");if(!c.gameState){e.innerHTML='<tr><td colspan="9" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=c.gameState.currentDate,a=zp(t,7),r=c.races.filter(i=>i.startDate<=t&&i.endDate>=t),s=c.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
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
    `:n+=s.map(i=>On(i)).join(""),e.innerHTML=n}function ya(e){return`Etappe ${e.stageNumber}`}function Wp(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,r)=>r[1]!==a[1]?r[1]-a[1]:a[0].localeCompare(r[0])).map(([a,r])=>`${r}x ${a}`).join(" · ")}function jp(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function Sa(e){return`<span class="stage-profile-badge ${jp(e)}">${S(e)}</span>`}function hr(e,t){return`${e.name} · ${ya(t)} · ${t.profile}`}async function Op(e){var s;const t=c.stageSummariesByStageId[e];if(t)return t;const a=await V.getStageSummary(e);if(a.success&&a.data)return c.stageSummariesByStageId[e]=a.data,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],a.data;const r=await V.getRealtimeSimulation(e);return r.success&&((s=r.data)!=null&&s.stageSummary)?(c.stageSummariesByStageId[e]=r.data.stageSummary,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],r.data.stageSummary):(c.stageSummaryErrorsByStageId&&(c.stageSummaryErrorsByStageId[e]=a.error??r.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:r.error}),c.stageSummariesByStageId&&delete c.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function Vp(){var d;const e=h("race-stages-title"),t=h("race-stages-meta"),a=h("race-stages-body"),r=St(c.selectedDashboardRaceId);if(!r){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const s=r.stages??[],n=s.reduce((l,p)=>l+(p.distanceKm??0),0),i=s.reduce((l,p)=>l+(p.elevationGainMeters??0),0),o=Wp(s);if(e.textContent=r.name,t.textContent=`${gr(r)} · ${((d=r.country)==null?void 0:d.name)??`Land ${r.countryId}`} · ${r.isStageRace?`${r.numberOfStages} Etappen`:"Eintagesrennen"} · ${Hr(n)} · ${Gr(i)} · ${o}`,s.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
                <td>${oe(l.date)}</td>
                <td><strong>${S(ya(l))}</strong></td>
                <td>${Sa(l.profile)}</td>
                <td>${l.distanceKm!=null?Hr(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?Gr(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${S(hr(r,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Zr(e){St(e)&&(c.selectedDashboardRaceId=e,Vp(),qe("raceStages"))}function Up(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,r;return`
            <tr>
              <td>${gr(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?de(t.country.code3):""}<span>${S(((r=t.country)==null?void 0:r.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${S(t.name)}</strong></td>
              <td>${pr(t)}</td>
              <td>${Is(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function Fs(e){const t=c.riders.find(r=>r.id===e);h("rider-program-title").textContent=t?_e(t):"Programm",h("rider-program-meta").textContent="Lade Programmrennen ...",h("rider-program-body").innerHTML="",qe("riderProgram");const a=await V.getRiderProgramRaces(e);if(!a.success||!a.data){h("rider-program-meta").textContent="",h("rider-program-body").innerHTML=`<div class="results-empty">${S(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}h("rider-program-title").textContent=a.data.program.name,h("rider-program-meta").textContent=t?_e(t):"",h("rider-program-body").innerHTML=Up(a.data)}function Yp(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=Zp(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${wt("Team","team","Team")}
          ${wt("Fahrer","rider","Fahrer")}
          ${wt("Spec1","spec1","Spezialisierung 1")}
          ${wt("Rolle","role","Rolle")}
          ${wt("Ges","overall","Gesamtstärke")}
          ${wt("Phase","phase","Formphase")}
          ${wt("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var r,s;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${Ft((r=a.team)==null?void 0:r.id,(s=a.team)==null?void 0:s.name)}</td>
              <td><span class="race-participant-rider-cell">${de(Pt(a.rider))}<strong>${S(_e(a.rider))}</strong></span></td>
              <td>${S(Jr(a.rider))}</td>
              <td>${S(yt(a.rider))}</td>
              <td>${hi(a.rider.overallRating)}</td>
              <td>${bi(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${S(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function wt(e,t,a){const r=c.raceParticipantsSort.key===t?" race-participants-sort-active":"",s=c.raceParticipantsSort.key===t?c.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${S(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${r}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${c.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${s}</span>
      </button>
    </th>`}function Zp(e){const t=c.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{var n,i,o,d;let s=0;switch(c.raceParticipantsSort.key){case"team":s=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=r.team)==null?void 0:i.name)??"","de");break;case"rider":s=_e(a.rider).localeCompare(_e(r.rider),"de");break;case"spec1":s=Jr(a.rider).localeCompare(Jr(r.rider),"de");break;case"role":s=yt(a.rider).localeCompare(yt(r.rider),"de");break;case"overall":s=a.rider.overallRating-r.rider.overallRating;break;case"phase":s=(a.rider.seasonFormPhase??"neutral").localeCompare(r.rider.seasonFormPhase??"neutral","de");break;default:s=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((d=r.program)==null?void 0:d.name)??"","de")}return s*t||_e(a.rider).localeCompare(_e(r.rider),"de")})}function Jr(e){return e.specialization1!=null?sa(e.specialization1):"–"}async function Wo(e){const t=St(e);c.selectedRaceParticipantsRaceId=e,h("race-participants-title").textContent=(t==null?void 0:t.name)??"Teilnehmer",h("race-participants-meta").textContent="Lade Programmfahrer ...",h("race-participants-body").innerHTML="",c.raceParticipants=[],qe("raceParticipants"),await jo()}async function jo(e=!1){const t=c.selectedRaceParticipantsRaceId;if(t==null)return;const a=St(t);e&&(h("race-participants-meta").textContent="Lade Programmfahrer ...");const r=await V.getRaceProgramParticipants(t);if(!r.success||!r.data){h("race-participants-meta").textContent="",h("race-participants-body").innerHTML=`<div class="results-empty">${S(r.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}c.raceParticipants=r.data,h("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",h("race-participants-meta").textContent=`${r.data.length} Programmfahrer · ${a?gr(a):""}`,h("race-participants-body").innerHTML=Yp(c.raceParticipants)}async function nr(e,t=null){let a=Va(e);if(!a&&c.stageEditorStageRows){const n=c.stageEditorStageRows.find(i=>i.stageId===e);n&&(a={race:{id:n.raceId,name:n.raceName,countryId:0,categoryId:0,isStageRace:!0,numberOfStages:1,startDate:"",endDate:"",prestige:0},stage:{id:n.stageId,raceId:n.raceId,stageNumber:n.stageNumber,date:"2026-01-01",profile:n.profile,startElevation:0,detailsCsvFile:"",distanceKm:n.distanceKm,elevationGainMeters:n.elevationGainMeters}})}if(!a)return;const r=await Op(e);if(!r){alert(c.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}c.selectedDashboardProfileStageId=e,h("stage-profile-title").textContent=`${a.race.name} · ${ya(a.stage)}`;const s=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";h("stage-profile-meta").textContent=`${oe(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?Hr(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?Gr(a.stage.elevationGainMeters):"–"}${s}`,Bl(h("stage-profile-view"),r,a.stage.profile,hr(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),qe("stageProfile")}function Jp(){h("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const s=Number(t.dataset.editStageRoster);if(!Number.isFinite(s))return;Np(s);return}const a=e.target.closest("button[data-live-stage]");if(a){const s=Number(a.dataset.liveStage);if(!Number.isFinite(s))return;zo(s,!0);return}const r=e.target.closest("button[data-instant-stage]");if(r){const s=Number(r.dataset.instantStage);if(!Number.isFinite(s))return;_o(s)}}),h("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-participants-id]");if(t){const s=Number(t.dataset.dashboardRaceParticipantsId);Number.isFinite(s)&&Wo(s);return}const a=e.target.closest("button[data-dashboard-race-id]");if(!a)return;const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&Zr(r)}),h("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&nr(a)}),h("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&Fs(s);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const r=a.dataset.raceParticipantsSort;c.raceParticipantsSort.key===r?c.raceParticipantsSort.direction=c.raceParticipantsSort.direction==="asc"?"desc":"asc":c.raceParticipantsSort={key:r,direction:"asc"},jo()}),h("btn-advance-day").addEventListener("click",async()=>{await Oo()}),h("btn-auto-progress").addEventListener("click",()=>{qp()})}async function Oo(){Me("Tag wird fortgeschrieben...");try{const e=await V.advanceDay();if(!e.success)return alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler")),!1;if(c.currentSave&&e.data&&(c.currentSave.currentSeason=e.data.season),await Cs(),await Es(),we("teams")){const{refreshTeamsViewData:t}=await yi(async()=>{const{refreshTeamsViewData:a}=await Promise.resolve().then(()=>Fp);return{refreshTeamsViewData:a}},void 0);await t()}return!0}catch(e){return alert("Unerwarteter Fehler beim Tageswechsel: "+e.message),!1}finally{$e()}}function Ps(){const e=document.getElementById("btn-auto-progress");e&&(ut?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function qp(){ut?ir():Vo()}function Vo(){ut||(ci(!0),Ps(),Xp())}function ir(){ut&&(ci(!1),c.autoProgressTargetDate=null,Ps())}async function Xp(){var e,t;for(;ut;){const a=(e=c.gameState)==null?void 0:e.currentDate;if(c.autoProgressTargetDate&&a&&a>=c.autoProgressTargetDate){ir();break}const r=((t=c.gameStatus)==null?void 0:t.pendingStages)??[];let s=!1;if(r.length>0){const n=r[0];s=await _o(n.stageId,!0)}else s=await Oo();if(!s){ir();break}await new Promise(n=>setTimeout(n,100))}Ps()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&ut){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),ir()}});const da=50;function Ns(){return[...ks,...$s[c.riderMenuDetailPage]]}function Uo(e){return c.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function Yo(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=c.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Uo(e.sortKey)}
      </button>
    </th>`}function Zo(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${va.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function za(){const e=h("riders-detail"),t=Ns(),a=Po(c.riders),r=a.length,s=Math.max(1,Math.ceil(r/da));c.riderMenuPage=Math.min(s,Math.max(1,c.riderMenuPage));const n=(c.riderMenuPage-1)*da,i=Math.min(r,n+da),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(ws(c.riderMenuTableSort.key))} ${c.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Zo()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(Yo).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(d=>`
                <tr class="team-detail-row">
                  ${t.map(l=>Ms(d,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${c.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${c.riderMenuPage} / ${s} · Fahrer ${r===0?0:n+1}-${i} von ${r}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${c.riderMenuPage>=s?"disabled":""}>Weiter</button>
      </div>
    </div>`}function Jo(){h("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&Fs(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;va.includes(n)&&(c.riderMenuDetailPage=n,new Set(Ns().map(o=>o.sortKey).filter(o=>o!=null)).has(c.riderMenuTableSort.key)||(c.riderMenuTableSort={key:"name",direction:"asc"}),c.riderMenuPage=1,za());return}const r=e.target.closest("button[data-riders-sort]");if(r){const n=r.dataset.ridersSort;c.riderMenuTableSort.key===n?c.riderMenuTableSort.direction=c.riderMenuTableSort.direction==="asc"?"desc":"asc":c.riderMenuTableSort={key:n,direction:Ts(n)},c.riderMenuPage=1,za();return}const s=e.target.closest("button[data-riders-page-action]");if(s){const n=s.dataset.ridersPageAction,i=Math.max(1,Math.ceil(c.riders.length/da));n==="prev"&&(c.riderMenuPage=Math.max(1,c.riderMenuPage-1)),n==="next"&&(c.riderMenuPage=Math.min(i,c.riderMenuPage+1)),za();return}})}const Qp=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:da,getActiveRiderMenuTableColumns:Ns,getRiderMenuSortIndicator:Uo,initRidersListeners:Jo,renderRiderMenuDetailPageTabs:Zo,renderRiderMenuTableHeader:Yo,renderRidersMenu:za},Symbol.toStringTag,{value:"Module"})),_a=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function et(e){return e==null?"free-agents":String(e)}function Vn(e){var a;const t=c.riderTeamEditorPayload;return t?((a=t.teams.find(r=>r.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function eg(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return fi(t/11.2,0,100)}function tg(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function ag(e){return c.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function rg(e){const t=c.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${S(e.title)}"
        aria-label="${S(e.title)}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${ag(e.key)}
      </button>
    </th>`}function sg(e,t){switch(c.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return se(e.firstName,t.firstName);case"lastName":return se(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return se(Vn(e.teamId),Vn(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return se(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return se(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function ng(e){const t=c.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>(sg(a,r)||se(a.lastName,r.lastName)||se(a.firstName,r.firstName)||a.riderId-r.riderId)*t)}function ig(e){const t=c.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(r=>et(r.teamId)===t);return ng(a)}function og(e){const t=c.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${et(a.teamId)}"${a.teamId===e?" selected":""}>${S(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function qo(e){return c.riderTeamEditorDirtyRiderIds.includes(e)}function lg(e,t){const a=qo(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${as(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${og(e.teamId)}</select></td>`;case"number":{const r=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${r}"></td>`}case"text":{const r=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${S(r)}"></td>`}default:return"<td>–</td>"}}function dg(e){const t=[...e.teams].sort((a,r)=>a.rank-r.rank||se(a.name,r.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${c.riderTeamEditorSelectedTeamKey===et(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${et(a.teamId)}">
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
    </aside>`}function Be(){var o;const e=h("rider-team-editor-root"),t=h("rider-team-editor-meta"),a=c.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const r=c.riderTeamEditorSelectedTeamKey?a.teams.find(d=>et(d.teamId)===c.riderTeamEditorSelectedTeamKey)??null:null,s=ig(a),n=c.riderTeamEditorDirtyRiderIds.length,i=r==null?"Kein Team gewählt":`${r.riderCount} Fahrer · Ø ${r.averageOverall!=null?r.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${r.rank}`;t.textContent=r==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${r.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${c.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(d=>`
                  <option value="${et(d.teamId)}"${c.riderTeamEditorSelectedTeamKey===et(d.teamId)?" selected":""}>${S(d.name)} (${d.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${S(c.riderTeamEditorSort.key==="teamName"?"Team":((o=_a.find(d=>d.key===c.riderTeamEditorSort.key))==null?void 0:o.title)??c.riderTeamEditorSort.key)} ${c.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${_a.map(rg).join("")}
                </tr>
              </thead>
              <tbody>
                ${s.length===0?`<tr><td colspan="${_a.length}" class="text-muted">${c.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:s.map(d=>`
                    <tr class="team-detail-row${qo(d.riderId)?" rider-team-editor-row-dirty":""}">
                      ${_a.map(l=>lg(d,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${dg(a)}
    </div>`}function cg(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),d=o.length===0?null:Math.round(o.reduce((l,p)=>l+p.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:d,rank:0}}),r=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:r.length,averageOverall:r.length===0?null:Math.round(r.reduce((i,o)=>i+o.overallRating,0)/r.length*100)/100,rank:0,isFreeAgents:!0});const s=[...a].sort((i,o)=>{const d=i.averageOverall??-1;return(o.averageOverall??-1)-d||o.riderCount-i.riderCount||se(i.name,o.name)}),n=new Map(s.map((i,o)=>[et(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(et(i.teamId))??a.length}))}async function Xo(e=!1){if(c.riderTeamEditorPayload&&!e){Be();return}h("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await V.getRiderTeamEditor();if(!t.success||!t.data){h("rider-team-editor-root").innerHTML=`<div class="results-empty">${S(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}c.riderTeamEditorPayload=t.data,c.riderTeamEditorDirtyRiderIds=[],c.riderTeamEditorSaving=!1,c.riderTeamEditorExporting=!1,c.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(r=>et(r.teamId)===c.riderTeamEditorSelectedTeamKey)||(c.riderTeamEditorSelectedTeamKey="")),Be()}function ug(e,t,a){const r=c.riderTeamEditorPayload;if(!r)return;const s=r.riders.find(n=>n.riderId===e);s&&(t==="teamId"?s.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof s[t]=="number"?s[t]=Number.parseInt(a||"0",10):s[t]=a,s.overallRating=eg(s),r.teams=cg(r),c.riderTeamEditorDirtyRiderIds.includes(e)||(c.riderTeamEditorDirtyRiderIds=[...c.riderTeamEditorDirtyRiderIds,e]),Be())}async function mg(){if(!c.riderTeamEditorPayload||c.riderTeamEditorSaving)return;c.riderTeamEditorSaving=!0,Be();const e=await V.saveRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Be();return}c.riderTeamEditorPayload=e.data,c.riderTeamEditorDirtyRiderIds=[],Be()}async function pg(){if(!c.riderTeamEditorPayload||c.riderTeamEditorExporting)return;c.riderTeamEditorExporting=!0,Be();const e=await V.exportRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Be();return}zr(e.data.fileName,e.data.content),Be()}function gg(){h("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const s=t.dataset.riderTeamEditorSort;c.riderTeamEditorSort.key===s?c.riderTeamEditorSort.direction=c.riderTeamEditorSort.direction==="asc"?"desc":"asc":c.riderTeamEditorSort={key:s,direction:tg(s)},Be();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){c.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Be();return}const r=e.target.closest("button[data-rider-team-editor-action]");if(r){const s=r.dataset.riderTeamEditorAction;if(s==="reload"){Xo(!0);return}if(s==="export"){pg();return}s==="save"&&mg()}}),h("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){c.riderTeamEditorSelectedTeamKey=t.value,Be();return}const a=e.target.closest(".rider-team-editor-input");if(a){const r=Number(a.dataset.riderTeamEditorRiderId),s=a.dataset.riderTeamEditorField;Number.isFinite(r)&&s&&ug(r,s,a.value)}})}let st={key:"pickNumber",asc:!0};function Un(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),r=.26+t*.18,s=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${r};--rider-stats-pill-bg-alpha:${s};`}async function Qo(e,t=!1){const a=await V.getDraftHistory(e);if(!a.success){c.draftHistory=null,we("draft")&&qr(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}c.draftHistory=a.data??null,we("draft")&&qr()}function qr(){const e=h("draft-table-container"),t=h("draft-season-select");if(!c.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const i=c.currentSave.startSeason??2026;for(let o=c.currentSave.currentSeason;o>=i;o--){const d=document.createElement("option");d.value=o.toString(),d.textContent=`Saison ${o}`,t.appendChild(d)}c.draftSelectedSeason||(c.draftSelectedSeason=c.currentSave.currentSeason),t.value=c.draftSelectedSeason.toString(),t.onchange=o=>{const d=o.target;c.draftSelectedSeason=parseInt(d.value,10),Qo(c.draftSelectedSeason)}}if(!c.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(c.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...c.draftHistory.rows].sort((i,o)=>{let d=0;const l=st.key;return l==="riderLastName"?d=i.riderLastName.localeCompare(o.riderLastName):l==="teamName"?d=i.teamName.localeCompare(o.teamName):l==="oldTeamName"?d=(i.oldTeamName||"").localeCompare(o.oldTeamName||""):l==="countryCode"?d=i.countryCode.localeCompare(o.countryCode):d=(i[l]??0)-(o[l]??0),st.asc?d:-d}),r=i=>st.key!==i?'<span class="sort-icon-placeholder"></span>':st.asc?" ▲":" ▼",s=i=>{st.key===i?st.asc=!st.asc:(st.key=i,st.asc=!0),qr()};window.setDraftSort=s;let n=`
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
  `;for(const i of a){const o=c.draftHistory.season-i.riderBirthYear;let d="-";i.oldTeamName&&(d=`<div style="display:flex; align-items:center; gap:0.5rem;">${Ft(i.oldTeamId,i.oldTeamName)} ${S(i.oldTeamName)}</div>`);const l=`<div style="display:flex; align-items:center; gap:0.5rem;">${Ft(i.teamId,i.teamName)} ${S(i.teamName)}</div>`;n+=`
      <tr>
        <td class="text-center">#${i.pickNumber}</td>
        <td class="text-center">Runde ${i.draftRound}</td>
        <td>${l}</td>
        <td>${d}</td>
        <td class="text-center">${de(i.countryCode)}</td>
        <td>${S(i.riderFirstName)} ${S(i.riderLastName)}</td>
        <td class="text-center">${o} J.</td>
        <td class="text-center">${i.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Un(i.overallAtDraft)}">${i.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Un(i.potOverallAtDraft)}">${i.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}n+="</tbody></table>",e.innerHTML=n}async function fg(e=!1){const t=await V.getInjuries();if(!t.success){c.injuries=null,we("injuries")&&Yn(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}c.injuries=t.data??[],we("injuries")&&Yn()}function Yn(){const e=h("injuries-table-container");if(!c.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(h("injuries-meta").textContent=c.injuries.length+" Ausfälle",c.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=Zt;let t="";const a=c.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),r=new Map;for(const n of a){const i=n.teamId;r.has(i)||r.set(i,[]),r.get(i).push(n)}for(const n of r.keys())r.get(n).sort((i,o)=>o.overallRating-i.overallRating);const s=Array.from(r.keys()).sort((n,i)=>{const o=r.get(n)[0].teamAbbreviation||"",d=r.get(i)[0].teamAbbreviation||"";return o.localeCompare(d)});if(s.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of s){const i=r.get(n),o=i[0].teamAbbreviation;t+=`
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
      `;for(const d of i){const l=d.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let p="";if(d.fitDate){const u=oe(d.fitDate);if(d.missedRaces&&d.missedRaces.length>0){let m="";for(const f of d.missedRaces)m+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${oe(f.startDate)}</span>
                  ${de(f.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${S(f.name)}</strong>
                  ${hs(f.categoryName)}
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
        `}t+="</tbody></table></div>"}e.innerHTML=t}function Zn(e){return e===0?"–":`-${e}`}function hg(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${ot(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${De(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function bg(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${S(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${hg(e.topRiders)}
      </div>
    </div>`}function vg(e,t){const a=t.filter(r=>r.teamId!=null&&e.teamId!=null&&r.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${ot(r.countryCode)}</span>
          <span class="season-standings-country-rider-name">${De(r.riderName??"–",{riderId:r.riderId,teamId:r.teamId,strong:!1})}</span>
          <strong>${r.points}</strong>
        </div>
      `).join("")}
    </div>`}function yg(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${it(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${vg(e,t)}
      </div>
    </div>`}async function Sg(e){const t=await V.getSeasonStandings();if(!t.success){c.seasonStandings=null,we("season-standings")&&Xr();return}c.seasonStandings=t.data??null,we("season-standings")&&Xr()}function Xr(){var g,b,v,y,T,R;const e=h("season-standings-meta"),t=h("season-standings-scope-tabs"),a=h("season-standings-empty"),r=h("season-standings-table"),s=h("season-standings-tbody"),n=h("season-standings-jersey-header"),i=h("season-standings-primary-header"),o=h("season-standings-flag-header"),d=h("season-standings-secondary-header"),l=((g=c.seasonStandings)==null?void 0:g.season)??((b=c.gameState)==null?void 0:b.season)??((v=c.currentSave)==null?void 0:v.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.",t.innerHTML=`
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
  `;const p=c.selectedSeasonStandingScope==="countries",u=p?((y=c.seasonStandings)==null?void 0:y.countryStandings)??[]:c.selectedSeasonStandingScope==="teams"?((T=c.seasonStandings)==null?void 0:T.teamStandings)??[]:((R=c.seasonStandings)==null?void 0:R.riderStandings)??[],m=p?u:[],f=p?[]:u;if(n.textContent="Trikot",i.textContent=p?"Land":c.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",d.textContent=c.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",p),d.classList.toggle("hidden",p),!c.seasonStandings||u.length===0){s.innerHTML="",r.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}s.innerHTML=p?m.map(x=>`
      <tr>
        <td class="pos-${Math.min(x.rank,3)}">${x.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${bg(x)}</td>
        <td class="results-flag-col-cell">${ot(x.countryCode)}</td>
        <td class="hidden"></td>
        <td>${x.points}</td>
        <td>${S(Zn(x.gapPoints))}</td>
      </tr>`).join(""):f.map(x=>{var L;const $=x.riderName??x.teamName,C=Qt(x.teamId,x.teamName),I=c.selectedSeasonStandingScope==="teams"?yg(x,((L=c.seasonStandings)==null?void 0:L.riderStandings)??[]):ea($,!0,!1,x.riderId,x.teamId),P=ot(x.countryCode),F=c.selectedSeasonStandingScope==="teams"?S(x.countryName??x.countryCode??"–"):it(x.teamName??"–",x.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(x.rank,3)}">${x.rank}</td>
          <td class="results-jersey-col-cell">${C}</td>
          <td>${I}</td>
          <td class="results-flag-col-cell">${P}</td>
          <td>${F}</td>
          <td>${x.points}</td>
          <td>${S(Zn(x.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),r.classList.remove("hidden")}function kg(){h("season-standings-scope-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-season-scope]");if(!t)return;const a=t.dataset.seasonScope;a!=="riders"&&a!=="teams"&&a!=="countries"||(c.selectedSeasonStandingScope=a,Xr())})}function Jn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function $g(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,r=[...e].map(l=>({rider:l,score:t(l)})).sort((l,p)=>p.score-l.score).slice(0,10),s=[...e].map(l=>({rider:l,score:a(l)})).sort((l,p)=>p.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,p)=>p.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,p)=>p.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,p)=>p.score-l.score).slice(0,10),d=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,p)=>p.score-l.score).slice(0,10);return{Gesamtklassement:r,Sprinter:s,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:d}}function xg(e,t){const a=c.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const r=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,s=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>r(o)):t==="Sprinter"?n=a.map(o=>s(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,d)=>d-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,d)=>o+d,0)/i.length}function Tg(e,t){var i;const r=c.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:xg(o.id,t)}));r.sort((o,d)=>d.avgScore-o.avgScore);const s=r.findIndex(o=>o.teamId===e)+1,n=((i=r.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:s,total:r.length,average:n}}function wg(e){const t=c.riders.filter(s=>s.activeTeamId===e);if(t.length===0)return 0;const a=t.map(s=>s.overallRating??0);a.sort((s,n)=>n-s);const r=a.slice(0,10);return r.length===0?0:r.reduce((s,n)=>s+n,0)/r.length}function Mg(e){var n;const a=c.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:wg(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const r=a.findIndex(i=>i.teamId===e)+1,s=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:r,total:a.length,average:s}}function Aa(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function Nr(e){e.countryCode&&de(e.countryCode);const t=$g(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,p)=>p.formValue-l.formValue).slice(0,10),r=[...e.riders].map(l=>({rider:l,uciRank:rr(l.id)})).filter(l=>l.uciRank!==null).sort((l,p)=>l.uciRank-p.uciRank).slice(0,10),s=Object.entries(t).map(([l,p])=>{const u=Tg(e.teamId,l),m=u.average.toFixed(1).replace(".",","),f=p.map(({rider:g,score:b})=>{const v=`${g.firstName.charAt(0)}. ${g.lastName}`,y=De(v,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),T=g.nationality?Ze[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,R=T?`<span class="fi fi-${T} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",x=c.riders.find(C=>C.id===g.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${Aa((x==null?void 0:x.roleId)??null).color};">
            ${R}
            ${y}
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
    `}).join(""),i=[...e.riders].sort((l,p)=>(p.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const p=`${l.firstName.charAt(0)}. ${l.lastName}`,u=De(p,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),m=l.nationality?Ze[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=m?`<span class="fi fi-${m} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",g=l.overallRating.toFixed(0),b=c.riders.find(y=>y.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Aa((b==null?void 0:b.roleId)??null).color};">
          ${f}
          ${u}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:p})=>{const u=`${l.firstName.charAt(0)}. ${l.lastName}`,m=De(u,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?Ze[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",b=(p>=0?"+":"")+p.toFixed(1).replace(".",","),v=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,y=c.riders.find(R=>R.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Aa((y==null?void 0:y.roleId)??null).color};">
          ${g}
          ${m}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${v}">${b}</span>
      </li>
    `}).join(""),d=r.map(({rider:l,uciRank:p})=>{const u=`${l.firstName.charAt(0)}. ${l.lastName}`,m=De(u,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?Ze[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"";let b="rider-stats-rank-badge-gc";p===1?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":p===2?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":p===3&&(b="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const v=`<span class="rider-stats-rank-badge ${b}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${p}">${p}</span>`,y=c.riders.find(R=>R.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Aa((y==null?void 0:y.roleId)??null).color};">
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
  `}function Lr(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${c.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${c.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${c.teamStatsTab==="contracts"?"true":"false"}">Auslaufende Verträge</button>
    </div>`}function Rg(e){const t=Array.from(new Set(e.topResults.map(m=>m.raceCategoryName).filter(Boolean)));t.sort((m,f)=>m.localeCompare(f,"de"));const a=Array.from(new Set(e.topResults.map(m=>m.season))).sort((m,f)=>f-m);let r=e.topResults.filter(m=>m.rowType!=="stage_result"?m.rowType==="gc_final"?c.teamStatsTopResultsFilters.gc:m.rowType==="mountain_final"?c.teamStatsTopResultsFilters.mountain:m.rowType==="points_final"?c.teamStatsTopResultsFilters.points:m.rowType==="youth_final"?c.teamStatsTopResultsFilters.youth:!0:m.profile==="TTT"||m.isStageRace||m.stageNumber!=null?c.teamStatsTopResultsFilters.stage:c.teamStatsTopResultsFilters.oneDay);if(c.teamStatsTopResultsFilterCategory){const m=c.teamStatsTopResultsFilterCategory;if(m.endsWith("-etappen")){const f=m.substring(0,m.length-8);r=r.filter(g=>g.raceCategoryName===f&&g.rowType==="stage_result")}else if(m.endsWith("-gc")){const f=m.substring(0,m.length-3);r=r.filter(g=>g.raceCategoryName===f&&g.rowType!=="stage_result")}else r=r.filter(f=>f.raceCategoryName===m)}c.teamStatsTopResultsFilterSeason!=null&&(r=r.filter(m=>m.season===c.teamStatsTopResultsFilterSeason)),r.sort((m,f)=>{if(f.seasonPoints!==m.seasonPoints)return f.seasonPoints-m.seasonPoints;const g=m.rowType!=="stage_result",b=f.rowType!=="stage_result",v=m.resultRank??9999,y=f.resultRank??9999;if(c.teamStatsTopResultsFilterCategory)return v!==y?v-y:g!==b?g?-1:1:0;{const T=Jn(m.raceCategoryName),R=Jn(f.raceCategoryName);return T!==R?T-R:g!==b?g?-1:1:v-y}});const s=20,n=Math.max(1,Math.min(10,Math.ceil(r.length/s)));c.teamStatsTopResultsPage>n&&(c.teamStatsTopResultsPage=n);const i=(c.teamStatsTopResultsPage-1)*s,o=r.slice(i,i+s),l=`
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
  `,p=o.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(m=>{const f=m.rowType!=="stage_result",g=f?`${m.raceName} · ${m.rowType==="gc_final"?"Gesamtwertung":m.rowType==="points_final"?"Punktewertung":m.rowType==="mountain_final"?"Bergwertung":"Nachwuchs"}`:m.stageNumber?`${m.raceName} · Etappe ${m.stageNumber}`:m.raceName;let b="–",v="–";m.finishStatus==="otl"?b=Lt("OTL","place"):m.finishStatus==="dnf"?b=Lt("DNF","place"):m.resultRank==null||(f?v=`<span class="rider-stats-final-type ${m.rowType==="gc_final"?"is-gc":m.rowType==="points_final"?"is-points":m.rowType==="mountain_final"?"is-mountain":"is-youth"}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${m.resultRank}</span>`:b=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${m.resultRank<=3?` rider-stats-rank-badge-top-${m.resultRank}`:""}">${S(String(m.resultRank))}</span>`);const y=m.profile?Sa(m.profile):"–",T=!f&&m.stageScore!=null&&m.stageScore>0?mr(m.stageScore,0,350):"–",R=ar(m.raceCategoryName),x=m.riderCountryCode?Ze[m.riderCountryCode]??m.riderCountryCode.slice(0,2).toLowerCase():null,$=x?`<span class="fi fi-${x} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(m.riderCountryCode??"")}"></span>`:"–",C=De(m.riderName,{riderId:m.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${b}</td>
            <td>${v}</td>
            <td>${$}</td>
            <td style="white-space: nowrap;">${C}</td>
            <td><strong>${S(g)}</strong></td>
            <td class="status-cell">${vs(m)}</td>
            <td>${y}</td>
            <td>${T}</td>
            <td>${R}</td>
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
  `}function Ig(e){const t=String(c.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,superteamCount:0,categories:{}},r=t==="all",s=u=>r?u:"–",n=(u,m)=>r?`${u} / ${m} T`:"–",i=r?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(u,m,f,g)=>{const b=typeof u=="number"?u:parseFloat(String(u))||0;let v="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return b===0?v+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":m==="gold"?v+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":m==="silver"?v+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":m==="bronze"?v+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":m==="purple"?v+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":m==="green"?v+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":m==="red"?v+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":m==="white"&&(v+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${v}" title="${S(f)}: ${b} Siege">${u}</span>`},d=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
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
                ${hs(u.key)}
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
                  ${Te(m.winWeather1||0,1,"Sonnig")}
                  ${Te(m.winWeather2||0,2,"Extreme Hitze")}
                  ${Te(m.winWeather3||0,3,"Leichter Regen")}
                  ${Te(m.winWeather4||0,4,"Starkregen")}
                  ${Te(m.winWeather5||0,5,"Starker Wind")}
                  ${Te(m.winWeather6||0,6,"Dichter Nebel")}
                  ${Te(m.winWeather7||0,7,"Schnee/Eis")}
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
  `}function Cg(e){var s;const t=((s=c.gameState)==null?void 0:s.season)??new Date().getFullYear(),a=[...e.riders].sort((n,i)=>{const o=n.contractEndSeason??9999,d=i.contractEndSeason??9999;return o!==d?o-d:i.overallRating-n.overallRating});return`
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
            ${a.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Vertragsdaten verfügbar.</td></tr>':a.map(n=>{const i=n.nationality?Ze[n.nationality]??n.nationality.slice(0,2).toLowerCase():null,o=i?`<span class="fi fi-${i} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(n.nationality)}"></span>`:"–",d=De(`${n.firstName} ${n.lastName}`,{riderId:n.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),l=c.riders.find(b=>b.id===n.id),p=`<span class="results-roster-overall-badge" style="color:${qn(n.overallRating)}" title="Stärke: ${n.overallRating.toFixed(2)}">${n.overallRating.toFixed(1)}</span>`;let u="–";l&&l.potential!=null&&(u=`<span class="results-roster-overall-badge" style="color:${qn(l.potential)}" title="Potential: ${l.potential.toFixed(2)}">${l.potential.toFixed(1)}</span>`);const m=n.contractEndSeason===t,f=n.contractEndSeason?`Saison ${n.contractEndSeason}`:"Ohne Vertrag",g=m?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${S(f)}</span>`:`<span style="font-weight: 500;">${S(f)}</span>`;return`
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
  `}function qn(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function Mt(e){return c.teamStatsTab==="career"?`
      ${Nr(e)}
      ${Lr()}
      ${Ig(e)}
    `:c.teamStatsTab==="contracts"?`
      ${Nr(e)}
      ${Lr()}
      ${Cg(e)}
    `:`
    ${Nr(e)}
    ${Lr()}
    ${Rg(e)}
  `}function Eg(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((r=c.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${S(a)}" aria-label="${S(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S(mi(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function el(e){c.teamStatsSelectedTeamId=e,c.teamStatsTab="topResults",c.teamStatsTopResultsFilterCategory=null,c.teamStatsTopResultsFilterSeason=null,c.teamStatsSelectedSeason="all",c.teamStatsTopResultsPage=1;const t=c.teams.find(n=>n.id===e);h("team-stats-title").innerHTML=t?`Team <strong>${S(t.name)}</strong>`:"Teamstatistik",h("team-stats-jersey").innerHTML=Eg(e,(t==null?void 0:t.name)??"");const a=Mg(e),r=a.average.toFixed(2).replace(".",",");h("team-stats-meta").innerHTML=t?`${S(t.abbreviation)} · ${S(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${r})`:"Daten werden geladen",h("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,qe("teamStats");const s=await V.getTeamStats(e);if(c.teamStatsSelectedTeamId===e){if(!s.success||!s.data){h("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}c.teamStatsPayload=s.data,h("team-stats-body").innerHTML=Mt(s.data)}}function Fg(){h("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-stats-tab]");if(a){const s=a.dataset.teamStatsTab;(s==="topResults"||s==="career"||s==="contracts")&&(c.teamStatsTab=s,c.teamStatsPayload&&(h("team-stats-body").innerHTML=Mt(c.teamStatsPayload)));return}const r=t.closest("button[data-team-top-results-page]");if(r){const s=Number(r.dataset.teamTopResultsPage);!isNaN(s)&&s>=1&&(c.teamStatsTopResultsPage=s,c.teamStatsPayload&&(h("team-stats-body").innerHTML=Mt(c.teamStatsPayload)));return}}),h("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;c.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=Mt(c.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;c.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=Mt(c.teamStatsPayload))}else if(t.classList.contains("team-stats-filter-checkbox")){const a=t,r=a.dataset.filterType;c.teamStatsTopResultsFilters[r]=a.checked,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=Mt(c.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;c.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),c.teamStatsPayload&&(h("team-stats-body").innerHTML=Mt(c.teamStatsPayload))}})}let Ht="riders",dt="season",Ls="season",Je="";const or=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function Pg(){const e=h("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");Lg(o)})})}const t=h("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");Dg(o)})})}or.forEach(n=>{const i=h(n);i&&i.addEventListener("change",()=>{const o=i.value;o?_g(o,n):or.some(l=>{const p=h(l);return p&&p.value!==""})||(Je="",Jt())})}),window.openRiderStatsFromLeaderboard=Zt;const a=h("leaderboard-filter-wt"),r=h("leaderboard-filter-pt"),s=h("leaderboard-filter-other");[a,r,s].forEach(n=>{n&&n.addEventListener("change",()=>{Jt()})})}function Ng(){Jt()}function Lg(e){Ht=e;const t=h("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&((Ag(Je)||Je==="strongest_lieutenants")&&(Bg(),Je=""),dt==="live"&&(dt=Ls,Ka())),Jt()}function Dg(e){dt=e,Ls=e,Jt()}function _g(e,t){Je=e,or.forEach(a=>{if(a!==t){const r=h(a);r&&(r.value="")}}),tl(e)?(dt="live",Ka()):Ds(e)?(dt="alltime",Ka()):(dt=Ls,Ka()),Jt()}function tl(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function Ds(e){return["max_short_term_fatigue","max_long_term_fatigue","max_combined_fatigue","max_s_form","max_r_form","max_combined_form","mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function Ag(e){return tl(e)||Ds(e)||e==="mentors_ranking"}function Bg(){or.forEach(e=>{const t=h(e);t&&(t.value="")})}function Ka(){const e=h("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');dt==="live"?e.style.display="none":(e.style.display="flex",Ds(Je)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),dt==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function Jt(){var u,m,f;const e=h("leaderboard-empty"),t=h("leaderboard-table"),a=h("leaderboard-thead"),r=h("leaderboard-tbody");if(!e||!t||!a||!r)return;const s=h("leaderboard-filter-container");if(s&&(s.style.display=Ht==="teams"?"none":"flex"),!Je){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await V.getLeaderboards(Ht,Je,dt);if(!we("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(Ht==="riders"){const g=((u=h("leaderboard-filter-wt"))==null?void 0:u.checked)??!0,b=((m=h("leaderboard-filter-pt"))==null?void 0:m.checked)??!0,v=((f=h("leaderboard-filter-other"))==null?void 0:f.checked)??!1;if(i=n.data.filter(y=>{const T=y.teamDivisionId===1&&!y.isRetired,R=y.teamDivisionId===2&&!y.isRetired,x=y.teamDivisionId===null||y.teamDivisionId===void 0||y.isRetired||y.teamDivisionId!==1&&y.teamDivisionId!==2;return!!(T&&g||R&&b||x&&v)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const o=Je==="highest_leadout_bonus",d=Je==="strongest_lieutenants";Ht==="riders"?a.innerHTML=`
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
    `;let l="",p=1;for(const g of i){const b=p++,y=`<span class="badge ${b===1?"badge-primary":b<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${b}</span>`,T=Ft(g.teamId,g.teamName);let R="";if(o){const $=g.stageNumber!=null?`Etappe ${g.stageNumber}`:"–";R=`<td style="vertical-align: middle;">${S(g.raceName??"–")} · ${S($)} · ${S(String(g.season??"–"))}</td>`}let x="";if(d)if(g.lieutenantDetails){const $=g.lieutenantDetails,C=$.leaderNationality?de($.leaderNationality):"",I=$.leaderRoleName?` (${$.leaderRoleName})`:"";x=`
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${C}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${$.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${S($.leaderFirstName)} ${S($.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${S(I)}</span>
            </span>
          </td>
        `}else x='<td style="vertical-align: middle;">–</td>';if(Ht==="riders"){const $=g.nationality?de(g.nationality):"—",C=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${g.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.firstName)} ${S(g.lastName)}</a>`,I=g.teamAbbr?`<span class="text-muted" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</span>`:"—";l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${y}</td>
          <td style="text-align: center; vertical-align: middle;">${T}</td>
          <td style="text-align: center; vertical-align: middle;">${$}</td>
          <td style="vertical-align: middle;">${C}</td>
          <td style="vertical-align: middle;">${I}</td>
          ${R}
          ${x}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}else{let $="";if(g.leadoutDetails){const C=g.leadoutDetails,I=C.sprinterNationality?de(C.sprinterNationality):"";$=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">${S(g.teamName.split(" (Sprinter:")[0])}</div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${I}${S(C.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${C.contributors.map(P=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${P.nationality?de(P.nationality):""}${S(P.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${P.contribution.toFixed(2)})</span>
                  </div>
                `).join("")}
            </div>
          </div>
        `}else $=`<strong>${S(g.teamName??"")}</strong>`;l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${y}</td>
          <td style="text-align: center; vertical-align: middle;">${T}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${$}</td>
          ${R}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}}r.innerHTML=l}let Vt=2026,Ge=5,Xn=!1;const Hg=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function Qn(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${r}`}function Gg(e){var s;const t=(s=c.gameState)==null?void 0:s.currentDate;if(!t||e<=t)return;const a=oe(e);confirm(`Möchtest du automatisch bis zum ${a} simulieren?`)&&(c.autoProgressTargetDate=e,Vo())}function zg(e,t){const a=[],r=new Date(e,t,1),s=new Date(e,t+1,0);let i=(r.getDay()+6)%7;const o=new Date(r);o.setDate(o.getDate()-i);const d=new Date(o);for(;d<=s||d.getDay()!==1;){const l=[];for(let p=0;p<7;p++)l.push(new Date(d)),d.setDate(d.getDate()+1);a.push(l)}return a}function Kg(){if(Xn)return;Xn=!0,h("calendar-prev-month").addEventListener("click",()=>{Ge--,Ge<0&&(Ge=11,Vt--),Wa()}),h("calendar-next-month").addEventListener("click",()=>{Ge++,Ge>11&&(Ge=0,Vt++),Wa()}),h("calendar-today-btn").addEventListener("click",()=>{var t;if((t=c.gameState)!=null&&t.currentDate){const[a,r]=c.gameState.currentDate.split("-").map(Number);Vt=a,Ge=r-1}Wa()}),h("calendar-race-search").addEventListener("input",()=>{al()}),h("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&Zr(s);return}const r=t.target.closest("[data-calendar-date]");if(r){const s=r.dataset.calendarDate;s&&Gg(s)}}),h("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const s=Number(a.dataset.dashboardRaceId);Number.isFinite(s)&&Zr(s);return}const r=t.target.closest("button[data-dashboard-race-participants-id]");if(r){const s=Number(r.dataset.dashboardRaceParticipantsId);Number.isFinite(s)&&Wo(s)}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.remove("calendar-highlight")})}},!0))}function Wg(){var e;if((e=c.gameState)!=null&&e.currentDate){const[t,a]=c.gameState.currentDate.split("-").map(Number);Vt=t,Ge=a-1}Wa()}function Wa(){var s;if(!we("calendar"))return;h("calendar-month-label").textContent=`${Hg[Ge]} ${Vt}`;const e=zg(Vt,Ge),t=h("calendar-weeks"),a=((s=c.gameState)==null?void 0:s.currentDate)??"";let r="";for(const n of e){const i=n.map(Qn),o=[];for(const u of c.races)if(u.startDate<=i[6]&&u.endDate>=i[0]){const m=u.startDate<i[0]?0:i.indexOf(u.startDate),f=u.endDate>i[6]?6:i.indexOf(u.endDate);o.push({race:u,startIdx:m,endIdx:f})}o.sort((u,m)=>{const f=u.endIdx-u.startIdx+1,g=m.endIdx-m.startIdx+1;return g!==f?g-f:u.startIdx-m.startIdx});const d=Array.from({length:3},()=>Array(7).fill(!1));for(const u of o){let m=2;for(let f=0;f<3;f++){let g=!0;for(let b=u.startIdx;b<=u.endIdx;b++)if(d[f][b]){g=!1;break}if(g){m=f;break}}for(let f=u.startIdx;f<=u.endIdx;f++)d[m][f]=!0;u.slot=m}const l=n.map(u=>{const m=Qn(u),f=u.getMonth()!==Ge,g=m===a,b=m>a;return`
        <div class="${["calendar-day-cell",f?"other-month":"",g?"today":"",b?"is-future":""].filter(Boolean).join(" ")}" data-calendar-date="${m}">
          <span class="calendar-day-number" data-calendar-date="${m}">${u.getDate()}</span>
        </div>
      `}).join(""),p=o.map(u=>{var R;const m=u.race,f=a>=m.startDate&&a<=m.endDate,g=a>m.endDate,b=ct((R=m.category)==null?void 0:R.name),v=f?'<span class="calendar-live-dot"></span>':"",y=g?"opacity: 0.55;":"",T=u.endIdx-u.startIdx+1;return`
        <div class="calendar-event-bar ${f?"is-live":""}"
             data-race-id="${m.id}"
             style="grid-column: ${u.startIdx+1} / span ${T};
                    grid-row: ${u.slot+1};
                    background-color: ${b.background};
                    border: 1px solid ${b.border};
                    color: ${b.color};
                    ${y}"
             title="${S(m.name)} (${oe(m.startDate)} - ${oe(m.endDate)})">
          ${v}<span class="calendar-event-name">${S(m.name)}</span>
        </div>
      `}).join("");r+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${p}</div>
      </div>
    `}t.innerHTML=r,al()}function al(){var n;const e=h("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=h("calendar-races-tbody"),r=((n=c.gameState)==null?void 0:n.currentDate)??"",s=c.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(s.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=s.map(i=>{var v,y,T,R;const o=r>=i.startDate&&r<=i.endDate,l=r>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',p=((v=i.country)==null?void 0:v.name)??`Land ${i.countryId}`,u=(y=i.country)!=null&&y.code3?de(i.country.code3):"",m=i.isStageRace?(i.stages??[]).reduce((x,$)=>x+($.distanceKm??0),0):((T=i.upcomingStage)==null?void 0:T.distanceKm)??null,f=i.isStageRace?(i.stages??[]).reduce((x,$)=>x+($.elevationGainMeters??0),0):((R=i.upcomingStage)==null?void 0:R.elevationGainMeters)??null,g=m!=null?String(m.toFixed(1)).replace(".",","):"-",b=f!=null?String(Math.round(f)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${oe(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${S(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${Is(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${u}<span>${S(p)}</span></span></td>
        <td>${pr(i)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${i.id}">Teilnehmer</button></td>
        <td>${g}</td>
        <td>${b}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}let ht=null,bt=null,ze="id",ca=!0;function br(e){const t=new Date(e);t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));const a=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t.getTime()-a.getTime())/864e5+1)/7)}function vr(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return"peak";const r=n=>{const i=n-8,o=n-1;if(i>=1)return t>=i&&t<=o;{const d=i+53;return t>=d||t<=o}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)?"prep":"none"}function rl(e){return e==="peak"?"cell-peak":e==="prep"?"cell-prep":""}function ei(e,t){const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),d=`${n}-${i}-${o}`,l=br(d),p=vr(e,l);if(p==="peak"||p==="prep")return!0}return!1}function jg(e,t){const a=c.raceProgramsPayload;if(!a)return;const r=a.raceProgramRaces.findIndex(s=>s.program_id===e&&s.race_id===t);if(r===-1){const s=a.races.find(n=>n.id===t);if(s){const n=s.start_date,i=s.end_date,o=[];a.raceProgramRaces.forEach((d,l)=>{if(d.program_id===e&&d.race_id!==t){const p=a.races.find(u=>u.id===d.race_id);p&&p.start_date<=i&&p.end_date>=n&&o.push(l)}}),o.sort((d,l)=>l-d).forEach(d=>{a.raceProgramRaces.splice(d,1)})}a.raceProgramRaces.push({program_id:e,race_id:t})}else a.raceProgramRaces.splice(r,1);c.raceProgramsDirty=!0,Fe()}const Qr=(()=>{const e=[],t=new Date(2026,0,1),a=new Date(2026,11,31),r=["So","Mo","Di","Mi","Do","Fr","Sa"];for(let s=new Date(t);s<=a;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),d=`${n}-${i}-${o}`,l=`${r[s.getDay()]}, ${o}.${String(s.getMonth()+1).padStart(2,"0")}`;e.push({dateStr:d,label:l,weekNum:br(d)})}return e})();async function _s(e=!1){if(c.raceProgramsPayload&&!e){Fe();return}h("race-programs-root").innerHTML='<div class="results-empty">Programmdaten werden geladen...</div>';const t=await V.getRaceProgramsEditor();if(!t.success||!t.data){h("race-programs-root").innerHTML=`<div class="results-empty text-danger">${S(t.error??"Fehler beim Laden.")}</div>`;return}c.raceProgramsPayload=t.data,c.raceProgramsDirty=!1,c.raceProgramsSaving=!1,ht=null,bt=null,Fe()}function Og(){h("view-race-programs").addEventListener("click",e=>{const t=e.target,a=t.closest(".results-type-btn[data-tab]");if(a){const u=a.dataset.tab??"calendar-cols";c.raceProgramsActiveTab=u,Fe();return}const r=t.closest(".race-programs-action-btn");if(r){const u=r.dataset.action;u==="reload"?_s(!0):u==="save"&&Zg();return}const s=t.closest(".race-row-expand-btn");if(s){const u=s.dataset.raceId,m=h(`race-details-row-${u}`);m&&(m.classList.toggle("hidden"),s.textContent=m.classList.contains("hidden")?"▶":"▼");return}const n=t.closest(".program-row-expand-btn");if(n){const u=n.dataset.programId,m=h(`program-details-row-${u}`);m&&(m.classList.toggle("hidden"),n.textContent=m.classList.contains("hidden")?"▶":"▼");return}const i=t.closest(".program-roles-sort-header");if(i){const u=i.dataset.sortKey;ze===u?ca=!ca:(ze=u,ca=u==="name"||u==="id"),Fe();return}const o=t.closest(".combo-origin-trigger");if(o){const u=o.dataset.raceId,m=o.dataset.comboKey,f=h(`combo-origin-${u}-${m}`);f&&f.classList.toggle("hidden");return}const d=t.closest(".race-popover-trigger");if(d){e.stopPropagation();const u=parseInt(d.dataset.raceId??"0",10);bt=null,ht===u?ht=null:ht=u,Fe();return}const l=t.closest(".race-rider-count-trigger");if(l){e.stopPropagation();const u=parseInt(l.dataset.raceId??"0",10);ht=null,bt===u?bt=null:bt=u,Fe();return}const p=t.closest(".popover-program-toggle");if(p){if(e.stopPropagation(),p.classList.contains("disabled"))return;const u=parseInt(p.dataset.programId??"0",10),m=parseInt(p.dataset.raceId??"0",10);jg(u,m);return}!t.closest(".race-stages-popover-card")&&!t.closest(".race-rider-programs-popover-card")&&(ht!==null||bt!==null)&&(ht=null,bt=null,Fe())}),h("view-race-programs").addEventListener("click",e=>{const t=e.target.closest(".toggleable-race-cell[data-day]");if(!t)return;const a=t.dataset.day,r=parseInt(t.dataset.programId,10);Yg(r,a)}),h("view-race-programs").addEventListener("change",e=>{const t=e.target;if(t.classList.contains("peak-date-picker")){const a=parseInt(t.dataset.programId,10),r=parseInt(t.dataset.peak,10),s=t.value;if(s){const n=br(s);Ug(a,r,n)}return}if(t.classList.contains("peak-number-input")){const a=parseInt(t.dataset.programId,10),r=t.dataset.field,s=parseInt(t.value||"1",10);Vg(a,r,s)}})}function Vg(e,t,a){const r=c.raceProgramsPayload;if(!r)return;const s=r.programs.find(i=>i.id===e);if(!s)return;const n=Math.max(1,Math.min(53,a));if(s[t]=n,t.endsWith("_min")){const i=t.replace("_min","_max");s[i]<n&&(s[i]=n)}else if(t.endsWith("_max")){const i=t.replace("_max","_min");s[i]>n&&(s[i]=n)}c.raceProgramsDirty=!0,Fe()}function Ug(e,t,a){const r=c.raceProgramsPayload;if(!r)return;const s=r.programs.find(o=>o.id===e);if(!s)return;const n=`peak${t}_min`,i=`peak${t}_max`;s[n]=Math.max(1,a-2),s[i]=Math.min(53,a+2),c.raceProgramsDirty=!0,Fe()}function Yg(e,t){const a=c.raceProgramsPayload;if(!a)return;const r=a.races.filter(n=>n.start_date<=t&&n.end_date>=t);if(r.length===0)return;const s=a.raceProgramRaces.findIndex(n=>n.program_id===e&&r.some(i=>i.id===n.race_id));if(s===-1)a.raceProgramRaces.push({program_id:e,race_id:r[0].id});else{const n=a.raceProgramRaces[s],i=r.findIndex(o=>o.id===n.race_id);i<r.length-1?n.race_id=r[i+1].id:a.raceProgramRaces.splice(s,1)}c.raceProgramsDirty=!0,Fe()}async function Zg(){if(!c.raceProgramsPayload||c.raceProgramsSaving)return;c.raceProgramsSaving=!0,Fe();const e=await V.saveRaceProgramsEditor({programs:c.raceProgramsPayload.programs,raceProgramRaces:c.raceProgramsPayload.raceProgramRaces});if(c.raceProgramsSaving=!1,!e.success){alert(`Fehler beim Speichern:
${e.error??"Unbekannter Fehler"}`),Fe();return}c.raceProgramsDirty=!1,_s(!0)}function yr(e,t){let a=0,r=0,s=0;const n=new Set(t.raceProgramRaces.filter(o=>o.program_id===e.id).map(o=>o.race_id)),i=t.races.filter(o=>n.has(o.id));for(const o of i){const d=new Date(o.start_date),l=new Date(o.end_date);for(let p=new Date(d);p<=l;p.setDate(p.getDate()+1)){const u=p.getFullYear(),m=String(p.getMonth()+1).padStart(2,"0"),f=String(p.getDate()).padStart(2,"0"),g=br(`${u}-${m}-${f}`),b=vr(e,g);b==="peak"?a++:b==="prep"?r++:s++}}return{peak:a,prep:r,none:s}}function Fe(){const e=h("race-programs-root"),t=c.raceProgramsPayload;if(!t){e.innerHTML='<div class="results-empty">Keine Daten geladen.</div>';return}const a=window.scrollX,r=window.scrollY,s={},n=document.querySelector(".team-detail-table-scroll");n&&(s.table={scrollTop:n.scrollTop,scrollLeft:n.scrollLeft}),document.querySelectorAll(".popover-program-list-scroll").forEach(f=>{const g=f.getAttribute("data-race-id");g&&(s[`popover-${g}`]={scrollTop:f.scrollTop,scrollLeft:f.scrollLeft})});const o=c.raceProgramsDirty,d=c.raceProgramsSaving,l=c.raceProgramsActiveTab;let p=`
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
  `;l==="calendar-cols"?p+=Jg(t):l==="calendar-rows"?p+=qg(t):l==="peak-editor"?p+=Xg(t):l==="rider-role"?p+=ef(t):l==="program-roles"&&(p+=af(t)),p+="</div>",e.innerHTML=p;const u=document.querySelector(".team-detail-table-scroll");u&&s.table&&(u.scrollTop=s.table.scrollTop,u.scrollLeft=s.table.scrollLeft),document.querySelectorAll(".popover-program-list-scroll").forEach(f=>{const g=f.getAttribute("data-race-id");g&&s[`popover-${g}`]&&(f.scrollTop=s[`popover-${g}`].scrollTop,f.scrollLeft=s[`popover-${g}`].scrollLeft)}),window.scrollTo(a,r)}function Jg(e){var o,d,l;const t=e.programs,a=e.raceProgramRaces,r=e.races,s=t.map(p=>({id:p.id,stats:yr(p,e)}));let n=`<tr>
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
    `}n+="</tr>";let i="";for(const p of Qr){const u=r.filter(v=>v.start_date<=p.dateStr&&v.end_date>=p.dateStr),m=u.length>0,f=m?"row-has-races":"";let g="";if(m){g='<div style="display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.15rem;">';for(const v of u){const y=ct((d=v.category)==null?void 0:d.name);g+=`
          <span class="race-id-badge" style="background-color: ${y.background}; border: 1px solid ${y.border}; color: ${y.color}; font-size: 0.65rem; padding: 0.05rem 0.2rem; text-align: left; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${S(v.name)}">
            ${S(v.name)}
          </span>
        `}g+="</div>"}let b=`
      <td class="sticky-col ${f}" style="font-weight: 600; vertical-align: top; padding: 0.4rem 0.6rem;">
        <div>${p.label}</div>
        ${g}
      </td>
      <td style="text-align: center; color: var(--text-500); font-variant-numeric: tabular-nums; vertical-align: top; padding-top: 0.4rem;">${p.weekNum}</td>
    `;for(const v of t){const y=vr(v,p.weekNum),T=rl(y),R=a.find(I=>I.program_id===v.id&&u.some(P=>P.id===I.race_id));let x="",$=`toggleable-race-cell ${T}`,C=`data-day="${p.dateStr}" data-program-id="${v.id}"`;if(R){const I=r.find(F=>F.id===R.race_id),P=ct((l=I==null?void 0:I.category)==null?void 0:l.name);x=`
          <span class="race-program-badge" style="background-color: ${P.background}; border: 1px solid ${P.border}; color: ${P.color};" title="${S(I==null?void 0:I.name)}">
            ${S(I==null?void 0:I.name)}
          </span>
        `}else m?x='<span class="race-cell-placeholder" title="Klicken zum Zuweisen">＋</span>':($=T,C="");b+=`<td class="${$}" ${C} style="text-align: center; vertical-align: middle;">${x}</td>`}i+=`<tr>${b}</tr>`}return`
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
  `}function qg(e){var f;const t=e.programs,a=e.raceProgramRaces,r=e.races;let s='<th class="sticky-col-header" style="z-index: 15;">Monat</th>',n='<th class="sticky-col-header" style="z-index: 15;">Tag / KW</th>',i='<th class="sticky-col-header" style="z-index: 15;">Rennen Anzahl</th>',o='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #1</th>',d='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #2</th>',l='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #3</th>';const p=[],u=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];for(const g of Qr){const b=parseInt(g.dateStr.split("-")[1],10)-1,v=u[b];p.length===0||p[p.length-1].name!==v?p.push({name:v,span:1}):p[p.length-1].span++;const y=r.filter(C=>C.start_date<=g.dateStr&&C.end_date>=g.dateStr),T=y.length>0,R=T?`${y.length} R`:"",x=T?"race-count-active":"";n+=`<th style="text-align: center; min-width: 40px; font-variant-numeric: tabular-nums;">
      <div style="font-size: 0.8rem; font-weight: bold;">${g.dateStr.split("-")[2]}</div>
      <div style="font-size: 0.65rem; color: var(--text-500);">W${g.weekNum}</div>
    </th>`,i+=`<th class="${x}" style="text-align: center; font-size: 0.72rem; font-weight: bold;">${R}</th>`;const $=C=>{var L;const I=y[C];if(!I)return"";const P=ct((L=I.category)==null?void 0:L.name),F=a.filter(H=>H.race_id===I.id).length;return`
        <span class="race-id-badge" style="background-color: ${P.background}; border: 1px solid ${P.border}; color: ${P.color}; cursor: help;" 
              title="${S(I.name)}
Zugelassene Programme: ${F}">
          R${I.id}
        </span>
      `};o+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(0)}</th>`,d+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(1)}</th>`,l+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(2)}</th>`}for(const g of p)s+=`<th colspan="${g.span}" style="text-align: center; font-weight: bold; border-left: 1px solid var(--border);">${g.name}</th>`;let m="";for(const g of t){const b=yr(g,e);let v=`
      <td class="sticky-col" style="z-index: 5; white-space: nowrap; font-weight: bold; border-right: 2px solid var(--border);">
        <div style="font-size: 0.85rem;">${S(g.name)}</div>
        <div class="text-muted" style="font-size: 0.7rem; font-weight: normal; margin-top: 0.1rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${b.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${b.prep}</span> | 
          O: <span>${b.none}</span>
        </div>
      </td>
    `;for(const y of Qr){const T=vr(g,y.weekNum),R=rl(T),x=r.filter(L=>L.start_date<=y.dateStr&&L.end_date>=y.dateStr),$=x.length>0,C=a.find(L=>L.program_id===g.id&&x.some(H=>H.id===L.race_id));let I="",P=`toggleable-race-cell ${R}`,F=`data-day="${y.dateStr}" data-program-id="${g.id}"`;if(C){const L=r.find(G=>G.id===C.race_id),H=ct((f=L==null?void 0:L.category)==null?void 0:f.name);I=`
          <span class="race-id-badge" style="background-color: ${H.background}; border: 1px solid ${H.border}; color: ${H.color};" title="${S(L==null?void 0:L.name)}">
            R${L==null?void 0:L.id}
          </span>
        `}else $?I='<span style="font-size: 0.72rem; color: var(--text-500); opacity: 0.5;">＋</span>':(P=R,F="");v+=`<td class="${P}" ${F} style="text-align: center; vertical-align: middle; padding: 0.35rem 0;">${I}</td>`}m+=`<tr>${v}</tr>`}return`
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
  `}function Qg(e,t){const a=t.filter(o=>o.race_id===e).sort((o,d)=>o.stage_number-d.stage_number);if(a.length===0)return{countHtml:"Keine Etappen",stagesListHtml:"Keine Etappendaten vorhanden."};const r={};for(const o of a)r[o.profile]=(r[o.profile]||0)+1;const n=Object.entries(r).sort((o,d)=>d[1]-o[1]).map(([o,d])=>`${S(o)}: ${d}x`).join("<br>"),i=a.map(o=>`
    <div class="popover-stage-row">
      <span class="popover-stage-num">Et. ${o.stage_number}:</span>
      <span class="popover-stage-profile">${S(o.profile)}</span>
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
            ${t.map(i=>{const o=new Set(a.filter(M=>M.race_id===i.id).map(M=>M.program_id)),d=s.filter(M=>o.has(M.program_id)),u=e.programs.map(M=>{const N=a.some(xt=>xt.program_id===M.id&&xt.race_id===i.id),B=s.find(xt=>xt.program_id===M.id),Z=B?parseInt(B.deterministic_rider_count||"0",10):0,ie=B?parseInt(B.deterministic_role_Kapitaen||"0",10):0,me=B?parseInt(B.deterministic_role_Co_Kapitaen||"0",10):0,fe=B?parseInt(B.deterministic_role_Edelhelfer||"0",10):0,be=B?parseInt(B.deterministic_role_Starke_Helfer||"0",10):0,ye=B?parseInt(B.deterministic_role_Wassertraeger||"0",10):0,ve=B?parseInt(B.deterministic_role_Sprinter||"0",10):0,Se=[];ie>0&&Se.push(`${ie} Kapitän`),me>0&&Se.push(`${me} Co-Kapitän`),fe>0&&Se.push(`${fe} Edelhelfer`),be>0&&Se.push(`${be} Starke Helfer`),ye>0&&Se.push(`${ye} Wasserträger`),ve>0&&Se.push(`${ve} Sprinter`);const at=Se.length>0?`(${Se.join(", ")})`:"",te=yr(M,e),pt=te.peak+te.prep+te.none;return{program:M,isAssigned:N,count:Z,rolesStr:at,totalDays:pt}}).sort((M,N)=>N.count-M.count).filter(M=>ei(M.program,i)||M.isAssigned).map(M=>{const N=M.program,B=ei(N,i);let Z="";B||(Z='<span style="color: #fb923c; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(251, 146, 60, 0.15); border: 1px solid #fb923c; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb der Peak- und Aufbauphase dieses Programms!">!</span>');let ie="";if(!M.isAssigned){const at=a.filter(te=>te.program_id===N.id&&te.race_id!==i.id).map(te=>e.races.find(pt=>pt.id===te.race_id)).filter(te=>te&&te.start_date<=i.end_date&&te.end_date>=i.start_date);if(at.length>0){const te=at.map(pt=>pt.name).join(", ");ie=`<span style="color: #ef4444; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 50%; font-size: 0.65rem;" title="Kollision: Dieses Programm ist bereits einem zeitlich parallelen Rennen zugewiesen: ${S(te)}!">!</span>`}}const me=M.isAssigned?"font-weight: bold; color: var(--text-100);":"color: var(--text-500);",fe=M.isAssigned?"☑":"☐",be=B||M.isAssigned,ye=be?"cursor: pointer;":"cursor: not-allowed; opacity: 0.4; pointer-events: none;";return`
        <div class="popover-program-toggle${be?"":" disabled"}" data-program-id="${N.id}" data-race-id="${i.id}" 
             style="${ye} padding: 0.45rem 0.6rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); transition: background-color 0.15s; white-space: nowrap;"
             onmouseover="${be?"this.style.backgroundColor='rgba(99, 102, 241, 0.08)'":""}"
             onmouseout="this.style.backgroundColor='transparent'">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
            <span style="font-size: 1.15rem; line-height: 1; user-select: none; color: ${M.isAssigned?"var(--accent-h)":"var(--text-500)"};">${fe}</span>
            <span style="${me} font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis;" title="${S(N.name)} (${M.totalDays} Renntage)">
              ${S(N.name)} (${M.totalDays} RT)
            </span>
            ${Z}
            ${ie}
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;">
            <strong style="font-size: 0.8rem; color: var(--accent-h);">${M.count} Fahrer</strong>
            <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal;" title="${S(M.rolesStr)}">${S(M.rolesStr)}</span>
          </div>
        </div>
      `}).join(""),m=bt===i.id;let f=0,g=0,b=0,v=0,y=0,T=0,R=0;const x={Kapitaen:{},Co_Kapitaen:{},Sprinter:{},Edelhelfer:{},Starke_Helfer:{},Wassertraeger:{}},$=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],C=["Berg","Hill","Sprint","Timetrial","Cobble","Attacker"];for(const M of d){f+=parseInt(M.deterministic_rider_count||"0",10),g+=parseInt(M.deterministic_role_Kapitaen||"0",10),b+=parseInt(M.deterministic_role_Co_Kapitaen||"0",10),v+=parseInt(M.deterministic_role_Sprinter||"0",10),y+=parseInt(M.deterministic_role_Edelhelfer||"0",10),T+=parseInt(M.deterministic_role_Starke_Helfer||"0",10),R+=parseInt(M.deterministic_role_Wassertraeger||"0",10);for(const N of $)for(const B of C){const Z=`deterministic_${N}_spec1_${B}`,ie=parseInt(M[Z]||"0",10);x[N][B]=(x[N][B]||0)+ie}}let I=0;i.is_stage_race===1&&(I=r.filter(N=>N.race_id===i.id).filter(N=>{const B=(N.profile||"").toLowerCase();return B==="flat"||B==="rolling"}).length);let P=!1,F=0;if(i.is_stage_race===0){const M=r.find(B=>B.race_id===i.id),N=((M==null?void 0:M.profile)||"").toLowerCase();P=N==="cobble"||N==="cobble_hill",P&&(F=(e.roleSpecCombinations||[]).filter(Z=>o.has(Z.program_id)).filter(Z=>Z.spec1==="Cobble"||Z.spec2==="Cobble"||Z.spec3==="Cobble").reduce((Z,ie)=>Z+ie.count,0))}let L="<strong>Rennprogramme verwalten</strong>";i.is_stage_race===0&&P?L=`
        <strong>Rennprogramme verwalten 
          (<span style="color: ${F<20?"#ef4444":"var(--accent-h)"}; font-weight: bold;" title="Kopfsteinpflaster-Spezialisten: ${F} / min. 20">Gesamtfahrer: ${f}</span>)
        </strong>
      `:L=`<strong>Rennprogramme verwalten (Gesamtfahrer: ${f})</strong>`;const H=`
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
    `;let G="text-align: center; font-variant-numeric: tabular-nums;";i.is_stage_race===1&&I>=2&&(v<=7?G+=" background-color: rgba(239, 68, 68, 0.2); color: #ef4444; font-weight: bold;":v>7&&v<10&&(G+=" background-color: rgba(234, 179, 8, 0.2); color: #eab308; font-weight: bold;"));let K="position: relative; text-align: center; font-variant-numeric: tabular-nums; vertical-align: middle;",w="font-weight: bold; border: none; background: transparent; padding: 0.15rem 0.4rem; cursor: pointer; color: var(--accent-h); text-decoration: underline;";i.is_stage_race===0&&P&&F<20&&(K+=" background-color: rgba(239, 68, 68, 0.2);",w+=" color: #ef4444; font-weight: bold;");const A=`
      <button type="button" class="race-rider-count-trigger btn-link" data-race-id="${i.id}" 
              style="${w}">
        ${f}
      </button>
    `;let U="—";if(i.is_stage_race===0){const M=r.find(N=>N.race_id===i.id);U=(M==null?void 0:M.profile)??"Flat"}let W="",ne=`<strong>${S(i.name)}</strong>`;if(i.is_stage_race===1){const M=ht===i.id,{countHtml:N,stagesListHtml:B}=Qg(i.id,r);W=`
        <div class="race-stages-popover-card ${M?"":"hidden"}">
          <div class="popover-head"><strong>${S(i.name)}</strong> - Etappen</div>
          <div class="popover-stages-list">${B}</div>
          <div class="popover-separator"></div>
          <div class="popover-head">Profile Zusammenfassung</div>
          <div class="popover-profiles-summary">${N}</div>
        </div>
      `,ne=`
        <button type="button" class="race-popover-trigger btn-link" data-race-id="${i.id}" style="text-align: left; font-weight: bold; border: none; background: transparent; padding: 0; cursor: pointer; color: var(--accent-h);">
          ${S(i.name)}
        </button>
      `}let q=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"];if(i.is_stage_race===0){const M=r.find(B=>B.race_id===i.id),N=((M==null?void 0:M.profile)??"").toLowerCase();N.includes("cobble")?q=["Cobble","Sprint","Hill","Attacker","Timetrial","Berg"]:(N.includes("flat")||N.includes("rolling"))&&(q=["Sprint","Timetrial","Attacker","Hill","Cobble","Berg"])}const ee=[],Y=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],j={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},D={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},_=(e.roleSpecCombinations||[]).filter(M=>o.has(M.program_id)),E=new Map;for(const M of _){const N=M.spec2||"—",B=`${M.role}|${M.spec1}|${N}`;E.set(B,(E.get(B)||0)+M.count)}const O=[...E.entries()].map(([M,N])=>{const[B,Z,ie]=M.split("|");return{role:B,spec1:Z,spec2:ie,count:N}}).sort((M,N)=>{const B=Y.indexOf(M.role)-Y.indexOf(N.role);if(B!==0)return B;const Z=q.indexOf(M.spec1)-q.indexOf(N.spec1);return Z!==0?Z:N.count-M.count}),z=(M,N)=>{const B=D[M]??M,Z=N!=="—"?D[N]??N:"—";return`${B} / ${Z}`};for(const M of O)if(M.count>0){const N=M.spec1==="Berg"&&M.spec2==="Cobble"||M.spec1==="Cobble"&&M.spec2==="Berg",B=N?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",Z=N?"color: #f97316; font-weight: bold;":"color: var(--text-100);",ie=N?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",me=`${M.role}_${M.spec1}_${M.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`,be=_.filter(ye=>ye.role===M.role&&ye.spec1===M.spec1&&(ye.spec2||"—")===M.spec2).map(ye=>{const ve=e.programs.find(Se=>Se.id===ye.program_id);return`<span style="white-space: nowrap; margin-right: 0.8rem;">${S((ve==null?void 0:ve.name)??"Unbekannt")}: <strong>${ye.count}</strong></span>`}).join(" ");ee.push(`
          <div style="${B}">
            <span style="${Z}">${j[M.role]||M.role} <span class="text-muted">(${z(M.spec1,M.spec2)})</span></span>
            <strong style="${ie} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="${i.id}" data-combo-key="${me}">
              ${M.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-${i.id}-${me}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: ${be}
          </div>
        `)}const k=ee.length>0?ee.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost race-row-expand-btn" data-race-id="${i.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td>${oe(i.start_date)}</td>
        <td class="race-programs-popup-anchor" style="position: relative; vertical-align: middle;">
          ${ne}
          ${W}
        </td>
        <td style="font-weight: bold; color: var(--accent-h); text-align: center;">${U}</td>
        <td class="race-programs-popup-anchor" style="${K}">
          ${A}
          ${H}
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${g}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${b}</td>
        <td style="${G}">${v}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${y}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${T}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${R}</td>
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
  `}function sl(e){return ze!==e?'<span style="opacity:0.35; margin-left:4px;">↕</span>':`<span style="color:var(--accent-h); margin-left:4px; font-weight:bold;">${ca?"↑":"↓"}</span>`}function nt(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${ze===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
        <span>${S(t)}</span>
        ${sl(e)}
      </div>
    </th>
  `}function tf(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${ze===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: flex-start; gap: 2px;">
        <span>${S(t)}</span>
        ${sl(e)}
      </div>
    </th>
  `}function af(e){const t=e.programs,a=e.roleSpecCombinations||[],r={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},s={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},n=t.map(o=>{const d=a.filter(f=>f.program_id===o.id);let l=0;const p={Kapitaen:0,Co_Kapitaen:0,Sprinter:0,Edelhelfer:0,Starke_Helfer:0,Wassertraeger:0};for(const f of d)l+=f.count,p[f.role]!==void 0&&(p[f.role]+=f.count);const u=yr(o,e),m=u.peak+u.prep+u.none;return{program:o,totalRiders:l,roleCounts:p,progCombos:d,raceDays:m}});n.sort((o,d)=>{let l=0;return ze==="id"?l=o.program.id-d.program.id:ze==="name"?l=o.program.name.localeCompare(d.program.name):ze==="total"?l=o.totalRiders-d.totalRiders:ze==="raceDays"?l=o.raceDays-d.raceDays:l=(o.roleCounts[ze]||0)-(d.roleCounts[ze]||0),l===0&&(l=o.program.id-d.program.id),ca?l:-l});const i=n.map(o=>{const d=o.program,l=o.progCombos,p=o.totalRiders,u=o.roleCounts,m=o.raceDays,f=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],g=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"],b=new Map;for(const x of l){const $=x.spec2||"—",C=`${x.role}|${x.spec1}|${$}`;b.set(C,(b.get(C)||0)+x.count)}const v=[...b.entries()].map(([x,$])=>{const[C,I,P]=x.split("|");return{role:C,spec1:I,spec2:P,count:$}}).sort((x,$)=>{const C=f.indexOf(x.role)-f.indexOf($.role);if(C!==0)return C;const I=g.indexOf(x.spec1)-g.indexOf($.spec1);return I!==0?I:$.count-x.count}),y=(x,$)=>{const C=s[x]??x,I=$!=="—"?s[$]??$:"—";return`${C} / ${I}`},T=[];for(const x of v)if(x.count>0){const $=x.spec1==="Berg"&&x.spec2==="Cobble"||x.spec1==="Cobble"&&x.spec2==="Berg",C=$?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",I=$?"color: #f97316; font-weight: bold;":"color: var(--text-100);",P=$?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",F=`${x.role}_${x.spec1}_${x.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`;T.push(`
          <div style="${C}">
            <span style="${I}">${r[x.role]||x.role} <span class="text-muted">(${y(x.spec1,x.spec2)})</span></span>
            <strong style="${P} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="prog-${d.id}" data-combo-key="${F}">
              ${x.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-prog-${d.id}-${F}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: <span style="white-space: nowrap; margin-right: 0.8rem;">${S(d.name)}: <strong>${x.count}</strong></span>
          </div>
        `)}const R=T.length>0?T.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost program-row-expand-btn" data-program-id="${d.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td style="font-weight: bold; color: var(--text-100);">${d.id}</td>
        <td style="font-weight: bold; min-width: 150px;">${S(d.name)}</td>
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
            ${R}
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
              ${nt("id","ID","width: 50px;")}
              ${tf("name","Programm")}
              ${nt("total","Fahrer gesamt","width: 110px; text-align: center; font-weight: bold;")}
              ${nt("raceDays","Renntage","width: 100px; text-align: center; font-weight: bold;")}
              ${nt("Kapitaen","Kapitän","width: 90px; text-align: center;")}
              ${nt("Co_Kapitaen","Co-Kapitän","width: 90px; text-align: center;")}
              ${nt("Sprinter","Sprinter","width: 90px; text-align: center;")}
              ${nt("Edelhelfer","Edelhelfer","width: 90px; text-align: center;")}
              ${nt("Starke_Helfer","Starke Helfer","width: 100px; text-align: center;")}
              ${nt("Wassertraeger","Wasserträger","width: 100px; text-align: center;")}
            </tr>
          </thead>
          <tbody>
            ${i.join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.openTeamStats=el;async function nl(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}ts("game"),h("meta-career").textContent=((e=c.currentSave)==null?void 0:e.careerName)??"",Dt("dashboard"),Me("Spiel wird geladen…");try{await Cs(),await Es(),fr()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{$e()}}function rf(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";Dt(t),t==="dashboard"&&fr(),t==="teams"&&sr(),t==="riders"&&sr(),t==="rider-team-editor"&&Xo(),t==="live-race"&&Ot(),t==="results"&&Ie(),t==="draft"&&Qo(c.draftSelectedSeason||((a=c.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&fg(),t==="season-standings"&&Sg(),t==="leaderboards"&&Ng(),t==="calendar"&&Wg(),t==="race-programs"&&_s(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&ho()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&Zt(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&el(a)}),h("btn-cancel-new").addEventListener("click",()=>Ue("newCareer")),h("btn-close-race-stages").addEventListener("click",()=>Ue("raceStages")),h("btn-close-stage-profile").addEventListener("click",()=>Ue("stageProfile")),h("btn-close-rider-program").addEventListener("click",()=>Ue("riderProgram")),h("btn-close-rider-stats").addEventListener("click",()=>Ue("riderStats")),h("btn-close-team-stats").addEventListener("click",()=>Ue("teamStats")),h("btn-close-race-participants").addEventListener("click",()=>Ue("raceParticipants")),h("btn-close-roster-editor").addEventListener("click",()=>Yr()),h("btn-cancel-roster-editor").addEventListener("click",()=>Yr()),h("btn-apply-roster-editor").addEventListener("click",()=>{Lp()}),h("btn-back-menu").addEventListener("click",()=>{ra==null||ra.pause(),ts("menu"),ga()}),Tl(),Jp(),Kg(),No(),Jo(),gg(),Dp(),Ip(),qm(),pp(),Fg(),kg(),Pg(),Og()}(async()=>($m(),ge(),rf(),ts("menu"),await ga()))();
