(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();function xi(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function es(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function lt(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function wa(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function Ne(e,t={}){const a=t.strong===!1?"span":"strong",r=es("app-rider-link-label",t.labelClassName),s=`<${a} class="${r}">${xi(e)}</${a}>`;if(t.riderId==null)return s;const n=['type="button"','class="'+es("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${s}</button>`}function Ze(e,t,a=!0,r=""){const s=a===!1?"span":"strong",n=`<${s} class="app-team-link-label">${xi(e)}</${s}>`;return t==null?n:`<button type="button" class="${es("app-team-link",r)}" data-team-id="${t}">${n}</button>`}function Ti(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function wi(e){return Math.round(e*10)/10}function Mi(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function Ri(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function Ii(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function Pl(e,t){return e.skills.stamina*(t/300)}function Ci(e,t,a){return e.skills.timeTrial+Ii(e,t)+e.skills.mountain*(a/500)}function Nl(e,t,a,r){const s=Pl(e,a),n=Ii(e,r);switch(t.profile){case"Flat":return .8*e.skills.sprint+.15*e.skills.acceleration+.05*e.skills.flat+n+s;case"Rolling":return .7*e.skills.sprint+.2*e.skills.acceleration+.1*e.skills.hill+n+s;case"Hilly":return .45*e.skills.sprint+.1*e.skills.flat+.45*e.skills.hill+n+s;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+s;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+s;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+s;case"High_Mountain":return e.skills.mountain+n+s;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+s;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+s;default:return .8*e.skills.sprint+.2*e.skills.flat+n+s}}function Ll(e,t,a,r,s){return t.profile==="ITT"||t.profile==="TTT"?Ci(e,s,r):Nl(e,t,a,s)}function Dl(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:wi(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function Ei(e,t,a,r){Mi(a,r);const s=Ri(a,r),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const p=o.get(l.activeTeamId)??[];p.push(l),o.set(l.activeTeamId,p)}return[...o.entries()].map(([l,p])=>{const m=n.get(l),f=p.map(b=>Ci(b,Ti(b.id,r==null?void 0:r.dailyFormByRiderId),s)).sort((b,$)=>$-b).slice(0,5),g=f.length,v=g>0?f.reduce((b,$)=>b+$,0)/g:0,h=Math.max(0,5-g)*2;return{team:m??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:v-h}}).sort((l,p)=>p.score-l.score||l.team.id-p.team.id).slice(0,20).map((l,p)=>({rank:p+1,kind:"team",effectiveSkill:wi(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(r!=null?rr(e,t,a,r):rr(e,t,a)).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id).slice(0,20).map((o,c)=>Dl(o,c+1))}function rr(e,t,a,r){const s=Mi(a,r),n=Ri(a,r),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var c;return{rider:o,teamName:o.activeTeamId!=null?((c=i.get(o.activeTeamId))==null?void 0:c.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:Ll(o,a,s,n,Ti(o.id,r==null?void 0:r.dailyFormByRiderId))}}).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id)}const d={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,seasonStandingsSelectedSeason:null,draftHistory:null,injuries:null,draftSelectedSeason:null,draftOverlayActive:!1,draftOverlayAuto:!0,draftOverlayPicks:null,draftOverlayCurrentIndex:0,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorHideBoringSegments:!0,stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsSelectedSeason:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedRosterYear:null,teamStatsRosterSort:{key:"overallRating",direction:"desc"},teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1,autoProgressTargetDate:null,raceProgramsPayload:null,raceProgramsActiveTab:"calendar-cols",raceProgramsDirty:!1,raceProgramsSaving:!1};let Yt=null;function Fi(e){Yt=e}let Mr=!1;function ts(e){Mr=e}let vs=null;function as(e){vs=e}let sr=null;function rs(e){sr=e}let ct=!1;function Ss(e){ct=e}function y(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ie(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function va(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),r=Math.floor(e%60),s=String(a).padStart(2,"0"),n=String(r).padStart(2,"0");return t>0?`${t}:${s}:${n}`:`${a}:${n}`}function Za(e){return e==null||e===0?"–":`+${va(e)}`}const ma=2,nr=3,ks=4;function $s(e){return`/jersey/Jer_${e}.png`}function _e(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((r=d.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${S(a)}" aria-label="${S(a)}">
      <img
        class="results-team-jersey-img"
        src="${S($s(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function jt(e,t){return`<span class="results-jersey-cell">${_e(e,t)}</span>`}function rt(e){return e&&oe(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function wt(e){var a;if(e==null)return null;const t=Me(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function Me(e){return e==null?null:d.riders.find(t=>t.id===e)??null}function bt(e){return e==null?null:d.races.find(t=>t.id===e)??null}function Sa(e){var t;if(e==null)return null;for(const a of d.races){const r=(t=a.stages)==null?void 0:t.find(s=>s.id===e);if(r)return{race:a,stage:r}}return null}function Vt(e,t=!0,a=!1,r=null,s=null){const n=Ne(e,{riderId:r,teamId:s,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function Pi(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function ir(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function or(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function Ni(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}const ze={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function oe(e){const t=ze[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function Li(e,t){return e?`<span class="country-chip">${oe(e.code3)}<span>${S(e.name)}</span></span>`:t?S(t):"–"}function lr(e){return`${e.toFixed(2).replace(".",",")} km`}function dr(e){return`${Math.round(e)} hm`}function _l(e){return`${e>0?"+":""}${e.toFixed(1).replace(".",",")}%`}const Di=new Set;function Al(e){Di.add(e)}function Rr(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),y(`screen-${e}`).classList.remove("hidden")}function Xe(e){y(`modal-${e}`).classList.remove("hidden")}function Ue(e){y(`modal-${e}`).classList.add("hidden")}function dn(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function _i(){var v,h;const e=d.realtimeBootstrap;if(!e)return;const t=y("instant-sim-favorites"),a=y("instant-sim-gc"),r=y("instant-sim-points");if(!t||!a||!r)return;const s=y("instant-sim-race"),n=y("instant-sim-stage-desc"),i=y("instant-sim-date");s&&(s.textContent=e.race.name),n&&(n.textContent=`Etappe ${e.stage.stageNumber} · ${e.stage.profile}`),i&&(i.textContent=ie(e.stage.date));const c=Ei(e.riders,e.teams,e.stage,{distanceKm:(v=e.stageSummary)==null?void 0:v.distanceKm,elevationGainMeters:(h=e.stageSummary)==null?void 0:h.elevationGainMeters}).slice(0,10),l=new Map(e.gcStandings.map(b=>[b.riderId,b]));let p=`
    <h3>
      <span>Etappen-Favoriten</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const b of c){const $=e.riders.find(F=>F.id===b.riderId);if(!$)continue;const M=wt($.id)??"un",T=ze[M]??"un",x=e.teams.find(F=>F.id===$.activeTeamId),R=(x==null?void 0:x.abbreviation)??"—",w=l.get($.id),E=w?`GC ${w.rank} (${w.rank===1?"Gelb":dn(w.gapSeconds)})`:"GC –";p+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${$.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${b.rank}</span>
            <span class="fi fi-${T} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${S($.firstName)} <strong>${S($.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(R)}</span>
            <span class="instant-sim-gc-info">${E}</span>
          </div>
        </div>
      </div>
    `}p+="</div>",t.innerHTML=p;const m=e.gcStandings.slice(0,10);let u=`
    <h3>
      <span>Gesamtwertung (GC)</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const b of m){const $=e.riders.find(E=>E.id===b.riderId);if(!$)continue;const M=wt($.id)??"un",T=ze[M]??"un",x=e.teams.find(E=>E.id===$.activeTeamId),R=(x==null?void 0:x.abbreviation)??"—",w=b.rank===1?"Gelb":dn(b.gapSeconds);u+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${$.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${b.rank}</span>
            ${or(b.previousRank,b.rankDelta)}
            <span class="fi fi-${T} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${S($.firstName)} <strong>${S($.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(R)}</span>
            <span class="instant-sim-gc-info">${w}</span>
          </div>
        </div>
      </div>
    `}u+="</div>",a.innerHTML=u;const f=e.pointsStandings.slice(0,10);let g=`
    <h3>
      <span>Punktewertung</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const b of f){if(b.riderId==null)continue;const $=e.riders.find(E=>E.id===b.riderId);if(!$)continue;const M=wt($.id)??"un",T=ze[M]??"un",x=e.teams.find(E=>E.id===$.activeTeamId),R=(x==null?void 0:x.abbreviation)??"—",w=`${b.points??0} Punkte`;g+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${$.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${b.rank}</span>
            ${or(b.previousRank,b.rankDelta)}
            <span class="fi fi-${T} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${S($.firstName)} <strong>${S($.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(R)}</span>
            <span class="instant-sim-gc-info">${w}</span>
          </div>
        </div>
      </div>
    `}g+="</div>",r.innerHTML=g}function xe(e="Lade…"){var r;const t=ct?" (Leertaste zum Stoppen)":"",a=y("default-loader");a&&(y("loading-msg").textContent=e+t,y("loading-progress").classList.add("hidden"),a.classList.remove("hidden"),(r=y("instant-sim-panel"))==null||r.classList.add("hidden")),y("loading-overlay").classList.remove("hidden")}function ye(){y("loading-overlay").classList.add("hidden")}function Ai(e){var t,a;if((t=y("default-loader"))==null||t.classList.add("hidden"),(a=y("instant-sim-panel"))==null||a.classList.remove("hidden"),y("loading-overlay").classList.remove("hidden"),d.realtimeBootstrap)_i();else{const r=y("instant-sim-favorites"),s=y("instant-sim-gc");r&&(r.innerHTML=""),s&&(s.innerHTML="")}xs(e)}function xs(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),r=`Instant-Simulation läuft … ${t}%${ct?" (Leertaste zum Stoppen)":""}`,s=y("loading-msg");s&&(s.textContent=r);const n=y("loading-progress-bar");n&&(n.style.width=`${t}%`);const i=y("instant-loading-msg");i&&(i.textContent=r);const o=y("instant-loading-progress-bar");o&&(o.style.width=`${t}%`);const c=y("instant-sim-favorites");c&&c.innerHTML.trim()===""&&d.realtimeBootstrap&&_i()}function Mt(e,t){const a=y(e);a.textContent=t,a.classList.remove("hidden")}function aa(e){y(e).classList.add("hidden")}function It(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),y(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),y("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of Di)try{a(e)}catch(r){console.error(`Fehler bei View-Aktivierung von "${e}":`,r)}}function ke(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function Zt(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function Ts(e,t,a){return Math.max(t,Math.min(a,e))}function Ja(e,t,a){return Math.round(e+(t-e)*a)}function ss(e,t,a){return`rgb(${Ja(e[0],t[0],a)} ${Ja(e[1],t[1],a)} ${Ja(e[2],t[2],a)})`}function Ir(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=Ts(e,t[0].value,t[t.length-1].value);for(let r=1;r<t.length;r+=1){const s=t[r-1],n=t[r];if(a<=n.value){const i=(a-s.value)/(n.value-s.value);return ss(s.color,n.color,i)}}return ss(t[t.length-1].color,t[t.length-1].color,1)}function ws(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${Ir(e)}"${a}>${e.toFixed(2)}</span>`}function Bi(e,t,a){if(t==null)return ws(e,a);const r=Math.round((e-t)*100)/100,s=r>0?"skill-delta-positive":r<0?"skill-delta-negative":"skill-delta-neutral",n=r>0?"+":"",i=`<span class="skill-delta ${s}">${n}${r.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${Ir(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function Hi(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function ns(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",r=t>0?"+":"";return`<span class="${a}">${r}${t.toFixed(1).replace(".",",")}</span>`}function is(e,t="none",a){const r=e??0,s=["race-sim-form-negative"];t==="warning"&&s.push("load-warning"),t==="critical"&&s.push("load-warning-critical");const n=a?` title="${S(a)}"`:"";return r===0?`<span class="${s.join(" ")}"${n}>0,0</span>`:`<span class="${s.join(" ")}"${n}>-${r.toFixed(1).replace(".",",")}</span>`}function Ms(e){const t=e.seasonFormPhase??"neutral";return Rs(t)}function Rs(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${S(a.label)}">${a.symbol}</span>`}function zi(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${S(e.seasonProgram.name)}</button>`:"–"}function Rt(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Le(e){return`${e.lastName} ${e.firstName}`}function Gi(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,r=e.unavailableUntil?` bis ${ie(e.unavailableUntil)}`:"",s=`${t}: noch ${a} Tag${a===1?"":"e"}${r}`;return`<span class="rider-availability-marker" title="${S(s)}" aria-label="${S(s)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function ht(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function cr(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=e,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(r)}const Bl=Object.freeze(Object.defineProperty({__proto__:null,$:y,FLAG_CODE_BY_CODE3:ze,GC_RESULT_TYPE_ID:ma,MOUNTAIN_RESULT_TYPE_ID:ks,POINTS_RESULT_TYPE_ID:nr,activateView:It,addActiveViewListener:Al,get autoProgressActive(){return ct},buildRaceCategoryBadgeCssVariables:wa,clamp:Ts,downloadTextFile:cr,esc:S,findRaceById:bt,findRiderById:Me,findStageById:Sa,formatDate:ie,formatElevationGain:dr,formatGradient:_l,formatKm:lr,formatMarkerLabel:Ni,formatNonFinisherReason:ir,formatRaceGap:Za,formatRaceTime:va,formatRiderName:Le,getRiderCountryCode:Rt,getRiderRoleName:ht,getRiderSpecializationLabel:Zt,getSkillColor:Ir,hideError:aa,hideLoading:ye,hideModal:Ue,get instantStageInFlightId(){return vs},interpolateChannel:Ja,interpolateColor:ss,isActiveView:ke,get raceSimView(){return Yt},get realtimeCompletionInFlight(){return Mr},get realtimeStageLoadInFlightId(){return sr},renderCountry:Li,renderFlag:oe,renderLoadMalusValue:is,renderMiniJersey:_e,renderNonFinisherStatusBadge:Pi,renderRaceFormBonusValue:Hi,renderRankDelta:or,renderResultsFlagColumn:rt,renderResultsJerseyColumn:jt,renderResultsParticipant:Vt,renderRiderAvailabilityMarker:Gi,renderRiderNameLink:Ne,renderRiderProgramButton:zi,renderSeasonFormPhase:Ms,renderSeasonFormPhaseIndicator:Rs,renderSeasonFormValue:ns,renderSkillValue:ws,renderSkillValueWithDelta:Bi,renderTeamNameLink:Ze,resolveRaceCategoryBadgeStyle:lt,resolveRiderCountryCode:wt,resolveTeamJerseyAssetPath:$s,setAutoProgressActive:Ss,setInstantStageInFlightId:as,setRaceSimView:Fi,setRealtimeCompletionInFlight:ts,setRealtimeStageLoadInFlightId:rs,showError:Mt,showInstantProgress:Ai,showLoading:xe,showModal:Xe,showScreen:Rr,state:d,updateInstantProgress:xs},Symbol.toStringTag,{value:"Module"}));async function q(e,t,a){try{const r=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(r.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await r.text();return{success:!1,error:r.ok?"Antwort war kein JSON.":`HTTP ${r.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return r.json()}catch(r){return{success:!1,error:`Netzwerkfehler: ${r.message}`}}}const V={listSaves:()=>q("GET","/api/saves"),createSave:(e,t,a)=>q("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>q("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>q("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>q("GET","/api/teams/available"),getTeams:()=>q("GET","/api/teams"),getTeam:e=>q("GET",`/api/teams/${e}`),getTeamStats:e=>q("GET",`/api/teams/${e}/stats`),getRiders:(e,t=!1)=>{const a=new URLSearchParams;e!=null&&a.set("teamId",String(e)),t&&a.set("onlyWithTeam","true");const r=a.toString();return q("GET",`/api/riders${r?`?${r}`:""}`)},getRiderStats:(e,t=!1)=>q("GET",`/api/riders/${e}/stats${t?"?excludeFatigue=true":""}`),getRiderProgramRaces:e=>q("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>q("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>q("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>q("POST","/api/rider-team-editor/export",e),getRaces:()=>q("GET","/api/races"),getRaceProgramParticipants:e=>q("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>q("GET",`/api/races/${e}/results-roster`),getGameState:()=>q("GET","/api/state"),getGameStatus:()=>q("GET","/api/game/status"),getStageSummary:e=>q("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>q("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>q("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>q("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>q("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>q("POST","/api/state/advance"),getStageResults:e=>q("GET",`/api/results/${e}`),getSeasonStandings:e=>q("GET",`/api/season-standings${e?`?season=${e}`:""}`),listStageEditorStages:()=>q("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>q("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>q("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>q("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>q("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>q("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>q("POST","/api/stage-editor/import",e),exportStageRoute:e=>q("POST","/api/stage-editor/export",e),getInjuries:()=>q("GET","/api/injuries"),getDraftHistory:e=>q("GET",`/api/draft/${e}`),getDraftDetails:e=>q("GET",`/api/draft/${e}/details`),getLeaderboards:(e,t,a)=>q("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`),getRaceProgramsEditor:()=>q("GET","/api/race-programs-editor"),saveRaceProgramsEditor:e=>q("POST","/api/race-programs-editor/save",e)};async function Ma(){const e=await V.listSaves(),t=y("saves-list"),a=y("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(r=>`
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
  `).join("")}async function Hl(e){xe("Karriere wird geladen…");const t=await V.loadSave(e);if(ye(),!t.success){alert("Fehler beim Laden: "+t.error);return}d.currentSave=t.data??null,await Fl()}async function zl(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;xe("Löschen…");const a=await V.deleteSave(e);if(ye(),!a.success){alert("Fehler: "+a.error);return}await Ma()}async function Gl(){const e=await V.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){y("btn-delete-all-careers").classList.add("hidden"),y("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){xe("Alle Karrieren werden gelöscht…");try{for(const a of t){const r=await V.deleteSave(a.filename);if(!r.success){alert(`Fehler beim Löschen von "${a.careerName}": ${r.error??"Unbekannter Fehler"}`);break}}}finally{ye()}await Ma()}}function Kl(){y("btn-new-career").addEventListener("click",async()=>{var s;aa("new-career-error"),y("input-career-name").value="";const a=y("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',Xe("newCareer");const r=await V.getAvailableTeams();if(!r.success||!((s=r.data)!=null&&s.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=r.data.map(n=>`<option value="${n.id}">${S(n.name)} (${S(n.division??n.divisionName??"")})</option>`).join("")}),y("btn-cancel-new").addEventListener("click",()=>Ue("newCareer")),y("btn-confirm-new").addEventListener("click",async()=>{const a=y("input-career-name").value.trim(),r=y("input-team-id").value;if(!a||!r){Mt("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const s=Number(r),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;aa("new-career-error"),xe("Neue Karriere wird erstellt…");const o=await V.createSave(i,a,s);if(!o.success){ye(),Mt("new-career-error",o.error??"Unbekannter Fehler.");return}const c=await V.loadSave(i);if(ye(),Ue("newCareer"),!c.success){alert("Fehler: "+c.error);return}d.currentSave=c.data??null,await Fl()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>Ma());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{Gl()}),y("saves-list").addEventListener("click",async a=>{const r=a.target.closest("button[data-save-action]");if(!r)return;const{saveAction:s,filename:n,careerName:i}=r.dataset;if(n){if(s==="load"){await Hl(n);return}s==="delete"&&await zl(n,i??n)}})}const Ol="modulepreload",Wl=function(e){return"/"+e},cn={},qa=function(t,a,r){let s=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));s=Promise.allSettled(a.map(c=>{if(c=Wl(c),c in cn)return;cn[c]=!0;const l=c.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":Ol,l||(m.as="script"),m.crossOrigin="",m.href=c,o&&m.setAttribute("nonce",o),document.head.appendChild(m),l)return new Promise((u,f)=>{m.addEventListener("load",u),m.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return s.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},jl={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function Vl(e){const t=jl[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const Ul=200;function Is(e){if(e.length===0)return[];const t=[];for(const a of e){const r=t[t.length-1];if(!r||Math.abs(r.distanceMeter-a.distanceMeter)>=Ul){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}r.riderIds.push(...a.riderIds),r.riderCount+=a.riderCount,r.distanceSum+=a.distanceMeter*a.riderCount,r.distanceMeter=r.distanceSum/r.riderCount}return t.map(({distanceSum:a,...r})=>r)}function Cs(e){if(e.length===0)return[];let t=0;for(let s=1;s<e.length;s+=1)e[s].riderCount>e[t].riderCount&&(t=s);let a=0,r=0;return e.map((s,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(r+=1,o=`A${r}`),{...s,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-s.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,s.distanceMeter-e[n+1].distanceMeter):null}})}function Yl(e,t=null){var a,r,s;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((r=e.find(n=>n.label==="P"))==null?void 0:r.label)??((s=e[0])==null?void 0:s.label)??null}function Ct(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function un(e,t,a,r){return`${r.type}:${e}:${t}:${a}`}function Zl(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:Ct(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function dt(e){const t=[];e.segments.forEach((s,n)=>{const i=n*2;(s.start_markers??[]).forEach((o,c)=>{t.push({key:un(n,"start",c,o),label:"",marker:o,kmMark:s.start_km,elevation:s.start_elevation,boundary:"start",sequence:i+c/100})}),(s.end_markers??[]).forEach((o,c)=>{t.push({key:un(n,"end",c,o),label:"",marker:o,kmMark:s.end_km,elevation:s.end_elevation,boundary:"end",sequence:i+1+c/100})})});const a=t.sort((s,n)=>s.kmMark-n.kmMark||s.sequence-n.sequence),r=new Map;return a.map(s=>{const n=(r.get(s.marker.type)??0)+1;return r.set(s.marker.type,n),{...s,label:s.marker.name??Zl(s.marker,n)}})}function Jl(e){const t=dt(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>Ct(a)).length}}function ra(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ql(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Qe(e,t,a,r){return t<=0?r:r+e/t*(a-r*2)}function ur(e,t){const a=t/1e3,r=e.points;if(a<=r[0].kmMark)return r[0].elevation;for(let s=0;s<r.length-1;s+=1){const n=r[s],i=r[s+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),c=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*c}return r[r.length-1].elevation}function Ki(e){const t=e.points.map(p=>p.elevation),a=Math.min(...t),r=Math.max(...t),s=Math.max(1,r-a),n=Math.max(40,s*.08),i=Math.max(0,a-n),o=r+n;let c=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=c&&(l=c+100),{axisMinElevation:c,axisMaxElevation:l}}function nt(e,t,a,r,s,n){const i=Math.max(1,a-t);return r-n-(e-t)/i*(r-s-n)}function pa(e){return`${Math.round(e)} m`}function mn(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function pn(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function Oi(e,t,a,r,s,n,i,o,c){var g;const l=[],p=[];let m=null,u="#b91c1c";for(const v of dt(e)){const{marker:h,kmMark:b,elevation:$}=v;if(h.type==="climb_start"){p.push({kmMark:b,elevation:$,name:h.name});continue}if(Ct(h)){let M=-1;for(let w=p.length-1;w>=0;w-=1)if(h.name&&((g=p[w])==null?void 0:g.name)===h.name){M=w;break}const T=M>=0?p.splice(M,1)[0]:p.pop();T&&Math.max(0,b-T.kmMark),T&&Math.max(0,$-T.elevation);const x=pn(h.cat,h.type),R=mn(h.cat);if(h.type==="finish_hill"||h.type==="finish_mountain"){m=h.cat??null,u=x.accentColor;continue}l.push({x:Qe(b*1e3,t,a,r),anchorY:nt($,o,c,s,n,i),primaryLabel:R??"Berg",secondaryLabel:pa($),distanceLabel:`${b.toFixed(1).replace(".",",")} km`,accentColor:x.accentColor});continue}if(h.type==="sprint_intermediate"){const M=pn(h.cat,h.type);l.push({x:Qe(b*1e3,t,a,r),anchorY:nt($,o,c,s,n,i),primaryLabel:"Sprint",secondaryLabel:pa($),distanceLabel:`${b.toFixed(1).replace(".",",")} km`,accentColor:M.accentColor})}}const f=e.points[e.points.length-1];return l.push({x:Qe(f.kmMark*1e3,t,a,r),anchorY:nt(f.elevation,o,c,s,n,i),primaryLabel:m?`${mn(m)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:pa(f.elevation),distanceLabel:`${f.kmMark.toFixed(1).replace(".",",")} km`,accentColor:u}),l.sort((v,h)=>v.x-h.x)}function Wi(e,t,a){const r=t+4,s=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${ra(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-detail">${ra(e.distanceLabel)}</text>
    </g>`}function ji(e,t){const a=new Set,r=t/1e3;for(let s=0;s<=r;s+=25)a.add(Math.round(s*1e3));return a.add(Math.round(t)),[...a].filter(s=>s>=0&&s<=t).sort((s,n)=>s-n)}function Vi(e,t,a,r,s,n){const i=new Set(dt(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const c=Qe(o,a,r,s),p=i.has(o)?18:12,m=n+p+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${c.toFixed(1)}" y1="${n.toFixed(1)}" x2="${c.toFixed(1)}" y2="${(n+p).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${c.toFixed(1)}" y="${m.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${ra(ql(o))}</text>
      </g>`}).join("")}function Xl(e,t,a,r,s,n,i,o,c,l,p){const m=Qe(e.distanceMeter,a,r,n),u=ur(t,e.distanceMeter),f=nt(u,c,l,s,i,o),g=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),v=e.riderCount>1?`<text x="${m.toFixed(1)}" y="${(f+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${m.toFixed(1)}" cy="${f.toFixed(1)}" r="${g.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${p?" race-sim-cluster-dot-selected":""}"></circle>
      ${v}
    </g>`}function Ql(e,t,a,r,s,n,i,o,c,l,p){const m=new Map(p.riders.map(f=>[f.id,f])),u=new Map((p.teams??[]).map(f=>[f.id,f.abbreviation]));return e.filter(f=>f.riderCount===1).map(f=>{const g=f.riderIds[0];if(g==null)return"";const v=m.get(g);if(!v)return"";const h=Qe(f.distanceMeter,a,r,n),b=ur(t,f.distanceMeter),$=nt(b,c,l,s,i,o),M=v.activeTeamId!=null?u.get(v.activeTeamId)??"":"",T=`${v.lastName} (${M})`,x=$-34,R=$-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${h.toFixed(1)}" y1="${($-5).toFixed(1)}" x2="${h.toFixed(1)}" y2="${x.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${h.toFixed(1)}" y="${R.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${ra(T)}</text>
        </g>`}).join("")}function ed(e,t,a,r,s,n,i,o,c,l,p){const m=Math.max(0,Math.min(l,e.distanceKm)),u=Math.max(0,Math.min(p,e.distanceKm));if(u<=m)return null;const f=[{kmMark:m,elevation:ur(e,m*1e3)},...e.points.filter($=>$.kmMark>m&&$.kmMark<u),{kmMark:u,elevation:ur(e,u*1e3)}];if(f.length<2)return null;const g=s-i,v=f.map(($,M)=>{const T=Qe($.kmMark*1e3,t,a,r),x=nt($.elevation,o,c,s,n,i);return`${M===0?"M":"L"} ${T.toFixed(1)} ${x.toFixed(1)}`}).join(" "),h=Qe(m*1e3,t,a,r),b=Qe(u*1e3,t,a,r);return`${v} L ${b.toFixed(1)} ${g.toFixed(1)} L ${h.toFixed(1)} ${g.toFixed(1)} Z`}function td(e,t,a,r,s={}){const p=e.distanceKm*1e3,{axisMinElevation:m,axisMaxElevation:u}=Ki(e),f=533,g=12,h=e.points.map(w=>{const E=Qe(w.kmMark*1e3,p,1584,28),F=nt(w.elevation,m,u,634,168,101);return{x:E,y:F}}).map((w,E)=>`${E===0?"M":"L"} ${w.x.toFixed(1)} ${w.y.toFixed(1)}`).join(" "),b=`${h} L ${1556 .toFixed(1)} ${f.toFixed(1)} L ${28 .toFixed(1)} ${f.toFixed(1)} Z`,$=s.selectedClimbRange!=null?ed(e,p,1584,28,634,168,101,m,u,s.selectedClimbRange.startKm,s.selectedClimbRange.endKm):null,M=Oi(e,p,1584,28,634,168,101,m,u).map(w=>Wi(w,g,f)).join(""),x=Array.from({length:5},(w,E)=>m+(u-m)/4*E).map(w=>{const E=nt(w,m,u,634,168,101);return`
      <line x1="28" y1="${E.toFixed(1)}" x2="1556" y2="${E.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${E.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${E.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(E+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${pa(w)}</text>`}).join(""),R=Vi(ji(e,p),e,p,1584,28,f);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${ra(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      <line x1="28" y1="${f}" x2="1556" y2="${f}" class="race-sim-axis"></line>
      ${`<line x1="28" y1="168" x2="28" y2="${f}" class="race-sim-axis"></line>`}
      <path d="${b}" fill="url(#dashboard-large-area)"></path>
      ${$?`<path d="${$}" class="dashboard-stage-profile-climb-highlight"></path>`:""}
      <path d="${h}" class="race-sim-profile-line"></path>
      ${M}
      ${R}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function ad(e,t,a,r,s){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${td(t,a,r,!1,s)}</div>`}function rd(e,t,a,r,s,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,c=634,l=28,p=168,m=101,{axisMinElevation:u,axisMaxElevation:f}=Ki(t),g=c-m,v=12,h=Array.from({length:5},(O,G)=>u+(f-u)/4*G),b=Is(a.clusters),$=Cs(b),M=ji(t,a.stageDistanceMeters),x=t.points.map(O=>{const G=Qe(O.kmMark*1e3,a.stageDistanceMeters,o,l),C=nt(O.elevation,u,f,c,p,m);return{x:G,y:C}}).map((O,G)=>`${G===0?"M":"L"} ${O.x.toFixed(1)} ${O.y.toFixed(1)}`).join(" "),R=`${x} L ${(o-l).toFixed(1)} ${g.toFixed(1)} L ${l.toFixed(1)} ${g.toFixed(1)} Z`,w=Oi(t,a.stageDistanceMeters,o,l,c,p,m,u,f).map(O=>Wi(O,v,g)).join(""),E=h.map(O=>{const G=nt(O,u,f,c,p,m);return`
      <line x1="${l}" y1="${G.toFixed(1)}" x2="${o-l}" y2="${G.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${G.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${G.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(G+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${pa(O)}</text>`}).join(""),F=Vi(M,t,a.stageDistanceMeters,o,l,g),A=new Map(b.map((O,G)=>[O,$[G]??null])),_=b.map(O=>{var G;return Xl(O,t,a.stageDistanceMeters,o,c,l,p,m,u,f,((G=A.get(O))==null?void 0:G.label)===i)}).join(""),z=s.stage.profile==="ITT"?Ql(b,t,a.stageDistanceMeters,o,c,l,p,m,u,f,s):"";e.innerHTML=`
    <div class="race-sim-profile-layout${s.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${c}" role="img" aria-label="${ra(r)}">
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
          ${E}
          <line x1="${l}" y1="${g}" x2="${o-l}" y2="${g}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${p}" x2="${l}" y2="${g}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${R}" fill="url(#race-sim-area)"></path>
            <path d="${x}" class="race-sim-profile-line"></path>
            ${w}
            ${_}
          </g>
          ${z}
          ${F}
          <text x="${l.toFixed(1)}" y="${(p-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const sd={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},gn={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function os(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function Cr(e,t){return`${e}:${t}`}function nd(e){return new Map(e.map(t=>[Cr(t.simulationMode,t.terrain),t.weights]))}function id(e){return new Map(e.map(t=>[Cr(t.simulationMode,t.terrain),t]))}function od(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function Ui(e,t,a){const r=a.get(Cr(e,t));if(!r)return[{key:os(t),weight:1}];const s=Object.entries(r).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return s.length>0?s:[{key:os(t),weight:1}]}function ld(e,t,a,r){const s=Ui(t,a,r),n=s.reduce((o,c)=>o+c.weight,0);return n<=0?e[os(a)]:s.reduce((o,c)=>o+e[c.key]*c.weight,0)/n}function dd(e,t){const a=t.find(r=>r.simulationMode==="ttt"&&r.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??sd[e]??1.05}function cd(e,t,a){const r=a==null?void 0:a.get(Cr(e,t));return{lateMultiplier:(r==null?void 0:r.finalSpreadLateMultiplier)??gn[t].lateMultiplier,peakMultiplier:(r==null?void 0:r.finalSpreadPeakMultiplier)??gn[t].peakMultiplier}}const fn={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}};function ud(e,t){const a=fn[e]||fn[1];return a.pref.includes(t)?"pref":a.malus.includes(t)?"malus":"neutral"}const md=.005,pd=.005,Yi=70,Zi=1e3,Ji=15,qi=360,Xi=8,Qi=-.75,eo=10;function _t(e,t){return e+Math.random()*(t-e)}function to(e,t,a){return Math.max(t,Math.min(a,e))}function gd(e){return e==="ITT"||e==="TTT"}function ao(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(r=>{var s,n,i;return r.id!==e.id&&r.activeTeamId===e.activeTeamId&&(((s=r.role)==null?void 0:s.name)==="Edelhelfer"||((n=r.role)==null?void 0:n.name)==="Starke Helfer"||((i=r.role)==null?void 0:i.name)==="Wassertraeger")}).map(r=>r.id)}function ro(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function fd(e,t,a,r){const s=r==="crash"?ro():null,n=Number(_t(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=to(n/Math.max(.1,a)*100,0,100),c=o<=Yi;return{riderId:e.id,type:r,severity:s,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(r==="crash"?_t(10,60):_t(10,45)),recoverySeconds:c?Zi:qi,recoveryFormBonus:c?Ji:Xi,dayFormPenalty:Qi,staminaPenalty:eo,recoveryPenaltyStages:r==="crash"?s==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:r==="crash"&&s==="medium"?15:0,supportRiderIds:ao(e,t)}}function hd(e,t,a){if(gd(t.profile)||a<=0)return[];const r=[];for(const s of e){const n=Math.random(),i=Math.random(),o=md*Math.max(0,t.crashIncidentMultiplier??1),c=pd*Math.max(0,t.mechanicalIncidentMultiplier??1);let l=o+(t.rolledEffektSturz??0)/100,p=c+(t.rolledEffektDefekt??0)/100;const m=t.rolledWeatherId||1,u=s.weatherProfileId||1;ud(u,m)==="pref"&&(l*=.5,p*=.5);const g=n<l,v=i<p;if(!g&&!v)continue;const h=g&&v?n<=i?"crash":"mechanical":g?"crash":"mechanical",b=fd(s,e,a,h);if(h==="crash"&&Math.random()<.01){b.isMassCrashTrigger=!0;const $=Math.floor(_t(2,26)),T=[...e.filter(x=>x.id!==s.id)].sort(()=>.5-Math.random());b.massCrashPotentialRiderIds=T.slice(0,$).map(x=>x.id),Math.random()<.2&&(b.hasAdditionalMechanical=!0,b.waitDurationSeconds+=Math.round(_t(10,45)))}r.push(b)}return r}function bd(e,t,a,r){const s=ro(),n=Math.round(a*1e3),i=to(a/Math.max(.1,r)*100,0,100),o=i<=Yi;let c=Math.round(_t(10,60)),l=!1;return Math.random()<.2&&(l=!0,c+=Math.round(_t(10,45))),{riderId:e.id,type:"crash",severity:s,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:c,recoverySeconds:o?Zi:qi,recoveryFormBonus:o?Ji:Xi,dayFormPenalty:Qi,staminaPenalty:eo,recoveryPenaltyStages:s==="light"?[10,5,2]:[],raceRecuperationPenalty:s==="medium"?15:0,supportRiderIds:ao(e,t),hasAdditionalMechanical:l}}function yd(e,t){return e+Math.random()*(t-e)}function hn(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const r=Math.floor(yd(0,a+1)),s=t[a];t[a]=t[r]??s,t[r]=s}return t}function vd(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function Sd(e,t,a={}){if(e.length===0)return[];const r=e.map(f=>({...f,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),s=a.teams??vd(r),n=rr(r,s,t,a),i=new Set(n.slice(0,20).map(f=>f.rider.id)),o=Math.min(Math.ceil(r.length*.02),Math.max(0,r.length-i.size)),c=Math.min(Math.ceil(r.length*.01),r.length),l=hn(r.filter(f=>!i.has(f.id))),p=new Set(l.slice(0,o).map(f=>f.id)),m=hn(r.filter(f=>!p.has(f.id))),u=new Set(m.slice(0,c).map(f=>f.id));return r.map(f=>p.has(f.id)?{...f,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:u.has(f.id)?{...f,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:f)}function Pt(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}function bn(e,t){return e+Math.random()*(t-e)}function kd(e,t,a){const r=[...e],s=[];for(;s.length<t&&r.length>0;){const n=r.reduce((l,p)=>l+Math.max(1e-4,a(p)),0);let i=Math.random()*n,o=0;for(let l=0;l<r.length;l+=1)if(i-=Math.max(1e-4,a(r[l])),i<=0){o=l;break}const[c]=r.splice(o,1);c&&s.push(c)}return s}function $d(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function yn(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function xd(e,t,a){return new Set(e.map(r=>r.riderId).filter(r=>r!=null&&!t.has(r)).slice(0,a))}function Td(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function kt(e){var t;return Td((t=e.role)==null?void 0:t.name)}function wd(e){return dt(e).some(({marker:t})=>Ct(t))}function Md(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function Rd(e,t){const a=Md(e),r=e.hasSuperform===!0?40:1,s=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&kt(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*r*s*n*i;return{attackFactor:a,superformFactor:r,gcLeaderTeamFactor:s,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function Id(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function Cd(e,t){var r,s;const a=((r=t[0])==null?void 0:r.riderId)??null;return a==null?null:((s=e.find(n=>n.id===a))==null?void 0:s.activeTeamId)??null}function Ed(e,t,a){const r=new Map(t.map(n=>[n.id,n])),s=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=r.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||s.has(i.activeTeamId))&&(s.add(i.activeTeamId),s.size>=a))break}return s}function Fd(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),kt(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function Pd(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const r=t.stageNumber<=10,s=Math.max(1,Math.floor(a*(r?.01:.05))),n=Math.max(s,Math.floor(a*(r?.08:.2)));return{min:s,max:n}}function Nd(e,t){const a=t.profile==="Flat"||t.profile==="Rolling";return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?a?{min:.45,max:.65}:{min:.45,max:.75}:a?{min:.5,max:.75}:{min:.5,max:.85}}function Ld(e,t,a,r,s,n,i,o){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||r.distanceKm<=0)return null;const c=e.length,{min:l,max:p}=Pd(t,a,c),m=Pt(l,p),u=t.isStageRace&&a.stageNumber<=10,f=!t.isStageRace,g=Cd(e,n),v=u?Ed(s,e,5):new Set,h=u?Fd(e):new Map,b=wd(r),$=$d(s,5),M=yn(n,10),T=new Set([...$,...M]),x=b?xd(i,T,5):new Set,R=Id(a),w=["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain"].includes(a.profile),E=t.isStageRace&&w&&a.stageNumber>=4;let F;const A=new Set;if(E){const L=yn(n,10),Y=rr(e,o??[],a,{distanceKm:r.distanceKm,elevationGainMeters:r.elevationGainMeters});let K=[];for(const k of Y){if(K.length>=5)break;const I=k.rider;if(I.activeTeamId==null||!L.has(I.id))continue;const D=kt(I);(D==="kapitaen"||D==="co-kapitaen")&&(K.includes(I.activeTeamId)||K.push(I.activeTeamId))}if(K.length===0)for(const k of Y){if(K.length>=5)break;const I=k.rider;if(I.activeTeamId==null||!L.has(I.id))continue;kt(I)==="edelhelfer"&&(K.includes(I.activeTeamId)||K.push(I.activeTeamId))}if(K.length>0&&Math.random()<.5){const k=Pt(0,K.length-1);F=K[k]}}if(F!=null){const L=e.filter(K=>K.activeTeamId===F),N=L.filter(K=>kt(K)==="kapitaen"),Y=L.filter(K=>kt(K)==="co-kapitaen");if(N.length>0){if(N.forEach(K=>A.add(K.id)),N.length===1&&Y.length>0){const K=[...Y].sort((k,I)=>I.overallRating-k.overallRating||I.id-k.id);A.add(K[0].id)}}else if(Y.length>0)[...Y].sort((k,I)=>I.overallRating-k.overallRating||I.id-k.id).slice(0,2).forEach(k=>A.add(k.id));else{const K=L.filter(k=>kt(k)==="edelhelfer");if(K.length>0){const k=[...K].sort((I,D)=>D.overallRating-I.overallRating||D.id-I.id);A.add(k[0].id)}}}let _;if(F!=null){const N=e.filter(Y=>Y.activeTeamId===F).filter(Y=>!A.has(Y.id));N.length>0&&(_=[...N].sort((K,k)=>k.skills.attack-K.skills.attack||k.overallRating-K.overallRating||k.id-K.id)[0])}const z=e.filter(L=>{if(L.activeTeamId==null||$.has(L.id)||M.has(L.id)||F!=null&&L.activeTeamId===F&&(A.has(L.id)||_!=null&&L.id===_.id)||u&&g!=null&&L.activeTeamId===g||u&&v.has(L.activeTeamId))return!1;const N=kt(L);return!(f&&(N==="kapitaen"||N==="co-kapitaen")||u&&N==="kapitaen"||u&&N==="co-kapitaen"&&h.get(L.activeTeamId)!==!0||N==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(z.length===0)return null;const O=new Map(z.map(L=>[L.id,Rd(L,{isEarlyStageRace:u,race:t,gcLeaderTeamId:g,stageHasMountainClassifications:b,topMountainIds:x,isHardStage:R})])),G=z.reduce((L,N)=>{var Y;return L+(((Y=O.get(N.id))==null?void 0:Y.finalWeight)??0)},0),C=kd(z,Math.max(0,Math.min(m-(_?1:0),z.length)),L=>{var N;return((N=O.get(L.id))==null?void 0:N.finalWeight)??1});if(_&&C.push(_),C.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${C.length}/${m} ausgewählt aus ${z.length}`),console.log(`Gesamtgewicht im Pool: ${G.toFixed(2)}`),console.table(C.map(L=>{var Y;const N=O.get(L.id);return{Fahrer:`${L.firstName} ${L.lastName}`,Team:L.activeTeamId,Rolle:((Y=L.role)==null?void 0:Y.name)??null,Atk:L.skills.attack,Hill:L.skills.hill,Chance:`${((G>0&&N!=null?N.finalWeight/G:0)*100).toFixed(2)}%`,Gewicht:((N==null?void 0:N.finalWeight)??1).toFixed(2),Attacke:`x${((N==null?void 0:N.attackFactor)??1).toFixed(2)}`,Superform:`x${(N==null?void 0:N.superformFactor)??1}`,GC_Team:`x${((N==null?void 0:N.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(N==null?void 0:N.mountainFactor)??1}`,Sprinter:`x${(N==null?void 0:N.sprinterFactor)??1}`}})),console.groupEnd();const H=r.distanceKm*1e3,U=Pt(0,Math.min(1e4,Math.max(0,Math.floor(H*.1)))),j=Nd(t,a),X=Math.round(H*bn(j.min,j.max)),J=Math.round(H*bn(.1,.25)),te=Math.max(U+1e3,Math.min(X-1e3,X-J)),W=a.rolledBreakawayBonus??0,P=a.profile==="Flat"||a.profile==="Rolling"?Pt(2,4):Pt(3+W,8+W);return{riderIds:C.map(L=>L.id),triggerDistanceMeters:U,groupPhaseEndDistanceMeters:te,phaseEndDistanceMeters:X,skillBonus:P,malusValue:a.profile==="Flat"||a.profile==="Rolling"?Pt(6,10):Pt(5,8),superTeamId:F}}const Dd=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),_d=3,Ad=7,vn=120,Sn=200,kn=180,Bd=10,Na=8e3;function At(e,t,a=Math.random()){const r=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(a*(s-r+1))+r}function Hd(e){for(let t=e.length-1;t>0;t-=1){const a=At(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function mr(e,t){return t<=0||e.length===0?[]:Hd([...e]).slice(0,Math.min(t,e.length))}function zd(e,t,a){if(t<=0||e.length===0)return[];const r=[...e],s=[];for(;r.length>0&&s.length<t;){const n=r.reduce((c,l)=>c+Math.max(0,a(l)),0);if(n<=0){s.push(...mr(r,t-s.length));break}let i=Math.random()*n,o=r.length-1;for(let c=0;c<r.length;c+=1)if(i-=Math.max(0,a(r[c])),i<=0){o=c;break}s.push(r[o]),r.splice(o,1)}return s}function Gd(e){return Dd.has(e.profile)}function Kd(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function Od(e,t){if(!Gd(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(r=>{if(!Kd(r))return[];const s=r.start_km*1e3,n=r.end_km*1e3,i=Math.max(s,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:s,sourceSegmentEndMeters:n}]})}function $n(e,t){const a=t==null?e:e.filter(c=>{const l=Math.min(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t)),p=Math.max(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t));return l>=Na||p>=Na});if(a.length===0)return null;const r=a[At(0,a.length-1)];if(!r)return null;const s=Math.ceil(r.startMeters),n=Math.floor(r.endMeters);if(n<=s)return null;let i=0;for(;i<12;){const c=At(s,n);if(t==null||Math.abs(c-t)>=Na)return{triggerDistanceMeters:c,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<r.startMeters?n:s;return t==null||Math.abs(o-t)>=Na?{triggerDistanceMeters:o,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters}:null}function Wd(e,t,a,r=()=>1){const s=e.slice(0,15),n=Od(t,a);if(s.length===0||n.length===0)return[];const i=At(_d,Math.min(Ad,s.length)),o=zd(s,i,r),c=[];for(const u of o){const f=$n(n);f&&c.push({riderId:u.id,attackNumber:1,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:At(vn,Sn),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}if(c.length===0)return[];const l=c.map(u=>u.riderId),p=Math.floor(l.length*.5),m=new Set(mr(l,p));for(const u of[...c]){if(!m.has(u.riderId))continue;const f=$n(n,u.triggerDistanceMeters);f&&c.push({riderId:u.riderId,attackNumber:2,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:At(vn,Sn),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}return c.sort((u,f)=>u.triggerDistanceMeters-f.triggerDistanceMeters||u.riderId-f.riderId||u.attackNumber-f.attackNumber)}function jd(e,t,a){var c;if(e.length===0)return[];const r=((c=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:c.teamId)??null,s=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||r!=null&&l.teamId===r));if(s.length===0)return[];const n=new Map;for(const l of s){const p=n.get(l.teamId)??[];p.push(l),n.set(l.teamId,p)}const i=[...n.values()].map(l=>mr(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(At(0,3),i.length);return mr(i,o).map(l=>l.riderId)}function Vd(e,t){const a=[],r=[];for(const[s,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){r.push(s);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:r}}function Kr(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}const Ud={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},Yd={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},Zd={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},Jd={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},qd={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function Xd(e){const t=new Map;for(const a of e){const r=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",r);else if(a.appliesTo==="climb_top"){const s=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${s}`,r)}else a.appliesTo==="finish"&&t.set(a.markerType,r)}return t}const La=20,Qd=120,ec=300,Or=.025,tc=.1,ac=.4,rc=.6,sc=.8,ga=1,xn=2/3,nc=.1,Da=10,Tn=50,ic=25,oc=7,lc=500,dc=100,cc=.02,uc=.04,mc=.009,pc=120,gc=150,fc=100,hc=300,wn=50,Wr=85,Nt=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],Mn=5*60,bc=60,yc=.5,vc=.3,_a=5e3,Sc=2e3,kc=1,$c=2,xc=.05,so={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},Tc={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},Aa=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function be(e,t,a){return Math.max(t,Math.min(a,e))}function de(e,t){return e+Math.random()*(t-e)}const Rn={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}};function In(e,t){const a=Rn[e]||Rn[1];return a.pref.includes(t)?"pref":a.malus.includes(t)?"malus":"neutral"}function Cn(e){return e[Math.floor(Math.random()*e.length)]}function Jt(e){return Math.round(e*100)/100}function wc(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function En(e){if(e<2)return 1;const t=be(e,2,20),a=Aa[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let r=1;r<Aa.length;r+=1){const s=Aa[r-1],n=Aa[r];if(t>n.gradientPercent)continue;const i=(t-s.gradientPercent)/Math.max(1e-4,n.gradientPercent-s.gradientPercent),o=s.draftPenaltyShare+(n.draftPenaltyShare-s.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function Mc(e){return e==="Flat"?pc:e==="Abfahrt"?gc:Number.POSITIVE_INFINITY}function Rc(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function pr(e){return(e.formBonus??0)+(e.raceFormBonus??0)-((e.fatigueMalus??0)+(e.longTermFatigueMalus??0)+(e.shortTermFatigueMalus??0))*.5}function Ic(e,t){if(t.length===0)return"";const a=t.reduce((p,m)=>p+m.weight,0),r=t.map(p=>{const m=e.skills[p.key],u=Math.round(p.weight/a*100);return`${so[p.key]} ${Math.round(m)} (${u}%)`}),s=e.formBonus??0,n=e.raceFormBonus??0,i=(e.fatigueMalus??0)*.5,o=(e.longTermFatigueMalus??0)*.5,c=(e.shortTermFatigueMalus??0)*.5;r.push(`S-Form ${s>=0?"+":""}${s.toFixed(1).replace(".",",")}`),r.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&r.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&r.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),c>0&&r.push(`Akut -${c.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const p of t)l+=(e.mentorBoosts[p.key]||0)*(p.weight/a);return l>0&&r.push(`Mentor +${l.toFixed(1).replace(".",",")}`),r.join(" • ")}function Cc(){const e=Math.random();return e<.9?de(5,20):e<.98?de(20,40):de(40,70)}function Fn(){const e=Math.random();return e<.9?Jt(de(-1,1)):e<.995?Jt(Cn([-1,1])*de(1,2)):Jt(Cn([-1,1])*de(3,4))}function Ec(){return Jt(de(-3,3))}function Fc(e){const t=[];let a=0,r=Cc(),s=de(-1,1);for(;a<e;){const n=Math.min(e-a,de(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:r,vector:s}),a+=n,a>=e)break;r=be(r+(Math.random()<.5?-1:1)*de(2,10),5,70),s=be(s+(Math.random()<.5?-1:1)*de(0,.5),-1,1)}return t}function no(e,t){const a=ae(e),r=ae(t);if(a!==r)return a?1:-1;const s=Re(e),n=Re(t);return s&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:s?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function ae(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function Re(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function da(e,t,a=!1,r=null){var c;const s="rider"in e?e.rider:null,n=(s==null?void 0:s.specialization1)??null,i=(s==null?void 0:s.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(c=s==null?void 0:s.role)==null?void 0:c.name;r==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function Pc(e,t,a=null,r=null,s=!1){var f,g;const n=v=>v.photoFinishScore;if(!t){const v=[...e].sort((b,$)=>b.crossingTimeSeconds-$.crossingTimeSeconds||$.photoFinishScore-b.photoFinishScore||b.riderId-$.riderId),h=((f=v[0])==null?void 0:f.crossingTimeSeconds)??0;return v.map((b,$)=>({riderId:b.riderId,rank:$+1,crossingTimeSeconds:b.crossingTimeSeconds,gapSeconds:Math.max(0,b.crossingTimeSeconds-h),photoFinishScore:b.photoFinishScore}))}const i=[...e].sort((v,h)=>v.crossingTimeSeconds-h.crossingTimeSeconds||h.photoFinishScore-v.photoFinishScore||v.riderId-h.riderId),o=((g=i[0])==null?void 0:g.crossingTimeSeconds)??0,c=[];let l=[],p=0,m=null;const u=()=>{const v=Math.max(0,p-o),h=l.sort((b,$)=>n($)-n(b)||b.riderId-$.riderId);for(const b of h)c.push({riderId:b.riderId,rank:c.length+1,crossingTimeSeconds:b.crossingTimeSeconds,gapSeconds:v,photoFinishScore:b.photoFinishScore})};for(const v of i){if(l.length===0){l=[v],p=v.crossingTimeSeconds,m=v.crossingTimeSeconds;continue}if(m!=null&&v.crossingTimeSeconds-m<=ga){l.push(v),m=v.crossingTimeSeconds;continue}u(),l=[v],p=v.crossingTimeSeconds,m=v.crossingTimeSeconds}return l.length>0&&u(),c}function Nc(e,t,a){const r=e.filter(Re).sort((m,u)=>(m.finishTimeSeconds??0)-(u.finishTimeSeconds??0)||u.photoFinishScore-m.photoFinishScore||m.rider.id-u.rider.id),s=e.filter(m=>!ae(m)).sort(no),n=e.filter(m=>m.finishStatus==="dnf").sort((m,u)=>u.distanceCoveredMeters-m.distanceCoveredMeters||m.rider.id-u.rider.id),i=[];let o=[],c=null;const l=m=>m.photoFinishScore,p=()=>{i.push(...o.sort((m,u)=>l(u)-l(m)||m.rider.id-u.rider.id))};for(const m of r){const u=m.finishTimeSeconds??0;if(o.length===0){o=[m],c=u;continue}if(c!=null&&u-c<=ga){o.push(m),c=u;continue}p(),o=[m],c=u}return o.length>0&&p(),[...i,...s,...n]}function Lc(e,t){const a=ae(e),r=ae(t);if(a!==r)return a?1:-1;const s=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(s)>=.1?s:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:Re(e)&&Re(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:Re(e)?-1:Re(t)?1:e.rider.id-t.rider.id}function Pn(e){const t=be(e,1,Tn);return t<=2?.12*t:t<=Da?.24+(t-2)/Math.max(1,Da-2)*.58:.82+(t-Da)/Math.max(1,Tn-Da)*.18}function jr(e,t){const a=pr(e.rider);return Object.entries(t).reduce((r,[s,n])=>{if(!n)return r;const i=s==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[s]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return r+o*n},0)}function Dc(e,t){const a=pr(e.rider);return Object.entries(t).filter(r=>!!r[1]).map(([r,s])=>{const n=r,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:s,effectiveSkill:o,contribution:o*s}})}function _c(e,t,a){let r=t;for(;r>0;){const n=e[r-1].distanceCoveredMeters-e[r].distanceCoveredMeters;if(n<=0||n>=a)break;r-=1}let s=t;for(;s<e.length-1;){const n=e[s].distanceCoveredMeters-e[s+1].distanceCoveredMeters;if(n<=0||n>=a)break;s+=1}return{startIndex:r,endIndex:s,size:s-r+1,positionInGroup:t-r}}function Ac(e,t){if(e<ic)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class io{constructor(t,a){var O,G;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.superTeamProtectedLeaderIds=new Set,this.superTeamBonusAmount=0,this.superTeamMalusAmount=0,this.superTeamStartPercent=0,this.superTeamEndPercent=0,this.superTeamBreakawayRiderCaught=!1,this.hasLoggedFinishSprintTieBreak=!1,this.hasAppliedSprintLeadoutBonuses=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const r=(O=t.race.country)==null?void 0:O.code3;r&&(t.riders=t.riders.map(C=>{var U;const H=C.nationality||((U=C.country)==null?void 0:U.code3);if(H&&H.trim().toUpperCase()===r.trim().toUpperCase()){const j={...C,skills:{...C.skills}},X=Math.random(),J=t.stage.profile,te=J==="ITT"||J==="TTT",W=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(J==="Cobble"||J==="Cobble_Hill")&&W.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(J)||W.push("mountain","mediumMountain");const Y=[...(K=>{const k=[...W],I=[];if(te){I.push("timeTrial");const D=Math.min(K-1,k.length);for(let B=0;B<D;B++){const Z=Math.floor(Math.random()*k.length);I.push(k.splice(Z,1)[0])}}else{const D=Math.min(K,k.length);for(let B=0;B<D;B++){const Z=Math.floor(Math.random()*k.length);I.push(k.splice(Z,1)[0])}}return I})(5)].sort(()=>Math.random()-.5);if(j.homeEffectSkills=Y,X<.05){j.homeEffect="home_pressure";for(const K of Y)j.skills[K]=Math.max(0,j.skills[K]-.5)}else if(X<.1){j.homeEffect="super_home";const K=Y[0];j.skills[K]=Math.min(100,j.skills[K]+3);for(let k=1;k<5;k++){const I=Y[k];j.skills[I]=Math.min(100,j.skills[I]+1)}}else{j.homeEffect="normal_home";for(const K of Y)j.skills[K]=Math.min(100,j.skills[K]+1)}return j}return C}));const s=t.stage.rolledWeatherId||1;t.riders=t.riders.map(C=>{const H=C.weatherProfileId||1,U=In(H,s);if(U==="neutral")return C;const j={...C,skills:{...C.skills}},X=["flat","mountain","stamina","bikeHandling","recuperation","downhill"];if(U==="pref")for(const J of X){const te=de(.2,1);j.skills[J]=Math.min(100,j.skills[J]+te)}else if(U==="malus"){let J=0;if(t.lieutenants){const te=t.lieutenants.find(W=>W.leaderId===C.id);if(te&&t.riders.some(P=>P.id===te.lieutenantId)){const P=t.riders.find(Y=>Y.id===te.lieutenantId),L=(P==null?void 0:P.weatherProfileId)||1;In(L,s)==="pref"&&(J=de(.4,.75))}}for(const te of X){const W=de(.2,1)*(1-J);j.skills[te]=Math.max(0,j.skills[te]-W)}}return j}),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=od(t.stage.profile),this.skillWeightRuleMap=nd(t.skillWeightRules??[]),this.skillWeightConfigMap=id(t.skillWeightRules??[]),this.stageScoringWeightMap=Xd(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=Fc(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const n=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=n!=null?be(n/100,0,1):de(rc,sc);const i=t.stage.finalPushStartPercent;this.finalPushStartRatio=i!=null?be(i/100,this.lateStageStartRatio,1):be(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const o=hd(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(o.map(C=>[C.riderId,C])),o.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",o.map(H=>({riderId:H.riderId,type:H.type,severity:H.severity,kmMark:H.triggerDistanceKm,waitDurationSeconds:H.waitDurationSeconds,supportRiderIds:H.supportRiderIds})));const C=o.filter(H=>H.isMassCrashTrigger);C.length>0&&C.forEach(H=>{var U;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${H.riderId} bei Km ${H.triggerDistanceKm}. Potenziell betroffene Fahrer (${(U=H.massCrashPotentialRiderIds)==null?void 0:U.length}):`,H.massCrashPotentialRiderIds)})}const c=t.riders.map(C=>{const H={rider:C,riderName:`${C.firstName} ${C.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:Ec(),microForm:Fn(),nextFormUpdateMeter:de(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(C.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(H),H}),l=new Map(c.map(C=>[C.rider.id,C.dailyForm]));this.stageFavorites=Ei(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:l});const p=this.stageFavorites.filter(C=>C.kind==="rider"&&C.riderId!=null).slice(0,15).map(C=>t.riders.find(H=>H.id===C.riderId)??null).filter(C=>C!=null),m=((G=t.gcStandings.find(C=>C.rank===1))==null?void 0:G.riderId)??null,u=Wd(p,t.stage,t.stageSummary,C=>Math.max(1,Math.pow(10,(C.skills.attack-65)/10))*(C.id===m?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const C of u){const H=this.precalculatedStageAttacksByRiderId.get(C.riderId)??[];H.push(C),this.precalculatedStageAttacksByRiderId.set(C.riderId,H)}this.breakawayPlan=Ld(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings,t.teams);const f=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=f.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=f.fallbackCheckpointsMeters;for(const C of c)C.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const g=Sd(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:l}),v=new Map(g.map(C=>[C.id,C])),h=c.map(C=>{const H=v.get(C.rider.id)??C.rider;return{...C,rider:H,riderName:`${H.firstName} ${H.lastName}`,dailyForm:C.dailyForm+(H.specialFormDelta??0)}}),b=g.filter(C=>C.hasSuperform),$=g.filter(C=>C.hasSupermalus);(b.length>0||$.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:b.map(C=>`${C.firstName} ${C.lastName}`),supermalus:$.map(C=>`${C.firstName} ${C.lastName}`)});const M=this.resolveStartOrder(h),T=new Map((this.bootstrap.teamStartOrder??[]).map((C,H)=>[C,H]));if(this.riders=M.map((C,H)=>({...C,startOffsetSeconds:this.resolveStartOffsetSeconds(C,H,T)})),this.riders.forEach(C=>this.syncRiderTelemetry(C)),this.breakawayPlan&&this.breakawayPlan.superTeamId!=null){this.superTeamId=this.breakawayPlan.superTeamId,this.superTeamBonusAmount=Kr(2,6),this.superTeamMalusAmount=Kr(4,8),this.superTeamStartPercent=de(.4,.6),this.superTeamEndPercent=de(.86,.96);const C=W=>(W??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),H=t.riders.filter(W=>W.activeTeamId===this.superTeamId),U=H.filter(W=>{var P;return C((P=W.role)==null?void 0:P.name)==="kapitaen"}),j=H.filter(W=>{var P;return C((P=W.role)==null?void 0:P.name)==="co-kapitaen"});if(U.length>0){if(U.forEach(W=>this.superTeamProtectedLeaderIds.add(W.id)),U.length===1&&j.length>0){const W=[...j].sort((P,L)=>L.overallRating-P.overallRating||L.id-P.id);this.superTeamProtectedLeaderIds.add(W[0].id)}}else if(j.length>0)[...j].sort((P,L)=>L.overallRating-P.overallRating||L.id-P.id).slice(0,2).forEach(P=>this.superTeamProtectedLeaderIds.add(P.id));else{const W=H.filter(P=>{var L;return C((L=P.role)==null?void 0:L.name)==="edelhelfer"});if(W.length>0){const P=[...W].sort((L,N)=>N.overallRating-L.overallRating||N.id-L.id);this.superTeamProtectedLeaderIds.add(P[0].id)}}const X=t.teams.find(W=>W.id===this.superTeamId),J=X?X.name:`Team ${this.superTeamId}`;this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,riderTeamId:this.superTeamId,type:"superteam",tone:"neutral",title:`Superteam des Tages: ${J}`,detail:`Dieses Team hat sich heute zusammengeschlossen, um seinen Leader zu unterstützen! Die Helfer erhalten zwischen ${(this.superTeamStartPercent*100).toFixed(0)}% und ${(this.superTeamEndPercent*100).toFixed(0)}% der Etappe einen Bonus von +${this.superTeamBonusAmount} auf Berg, Hill, Medium Mountain und Flat. Danach folgt ein individueller Malus von -4 bis -8 wegen Erschöpfung.`});const te=this.riders.find(W=>{var P;return W.rider.activeTeamId===this.superTeamId&&((P=this.breakawayPlan)==null?void 0:P.riderIds.includes(W.rider.id))});te&&(this.superTeamBreakawayRiderId=te.rider.id)}for(const C of this.riders){const H=C.rider.homeEffectSkills,U=j=>Tc[j]||j;if(C.rider.homeEffect==="super_home"){const j=H&&H.length===5?`${U(H[0])} (+3), ${U(H[1])} (+1), ${U(H[2])} (+1), ${U(H[3])} (+1), ${U(H[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${j})`})}if(C.rider.homeEffect==="home_pressure"){const j=H?H.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${j})`})}if(C.rider.homeEffect==="normal_home"){const j=H?H.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${j})`})}C.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),C.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),C.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const x=this.bootstrap.stage.rolledWetterName??"Sonnig",R=this.bootstrap.stage.rolledEffektSturz??0,w=this.bootstrap.stage.rolledEffektDefekt??0,E=this.bootstrap.stage.rolledWindkantenGefahr??0,F=this.bootstrap.stage.rolledEffektFatigue??0,A=this.bootstrap.stage.rolledBreakawayBonus??0,_=[];R>0&&_.push(`Sturzwahrscheinlichkeit +${R.toFixed(1)}%`),w>0&&_.push(`Defektwahrscheinlichkeit +${w.toFixed(1)}%`),E>0&&_.push(`Windkanten-Gefahr +${(E*100).toFixed(1)}%`),F>0&&_.push(`Fatigue +${F.toFixed(1)}%`),A>0&&_.push(`Ausreißer-Bonus +${A.toFixed(1)}`);const z=_.length>0?`Wettereinflüsse: ${_.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${x}`,detail:z})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const r=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(r),a-=r}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(r=>({riderId:r.rider.id,riderName:r.riderName,startOffsetSeconds:r.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(r),hasStarted:r.hasStarted||ae(r),distanceCoveredMeters:r.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-r.distanceCoveredMeters),segmentStartKm:r.segmentStartKm,segmentEndKm:r.segmentEndKm,segmentStartElevation:r.segmentStartElevation,segmentEndElevation:r.segmentEndElevation,activeTerrain:Re(r)?"Finish":r.activeTerrain,skillName:Re(r)?"Finish":r.skillName,skillBreakdown:Re(r)?"":r.skillBreakdown,baseSkill:r.baseSkill,teamGroupBonus:r.teamGroupBonus,effectiveSkill:r.effectiveSkill,staminaPenalty:r.staminaPenalty,elevationPenalty:r.elevationPenalty,dailyForm:r.dailyForm,microForm:r.microForm,gradientPercent:r.gradientPercent,gradientModifier:r.gradientModifier,windModifier:r.windModifier,draftModifier:r.draftModifier,draftNearbyRiderCount:r.draftNearbyRiderCount,draftPackFactor:r.draftPackFactor,currentSpeedMps:r.currentSpeedMps,photoFinishScore:r.photoFinishScore,leadoutBonus:r.leadoutBonus,leadoutRiderId:r.leadoutRiderId,leadoutContributions:r.leadoutContributions,lastSplitLabel:r.lastSplitLabel,lastSplitTimeSeconds:r.lastSplitTimeSeconds,splitTimes:{...r.splitTimes},finishTimeSeconds:Number.isFinite(r.finishTimeSeconds??Number.NaN)?r.finishTimeSeconds:null,finishStatus:r.finishStatus,statusReason:r.statusReason,isAttacking:r.isAttacking,isBreakaway:r.isBreakaway,isLeadingGroup:r.isLeadingGroup,hasSuperform:r.rider.hasSuperform===!0,hasSupermalus:r.rider.hasSupermalus===!0,isFinished:Re(r)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(r=>r.appliedIncident?[r.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus},superTeamId:this.superTeamId}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let r=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(r=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(r==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,c)=>Math.max(o,c.distanceCoveredMeters),0);r=Number((i/1e3).toFixed(2))}const s={id:this.nextMessageId,...t,riderTeamId:a,kmMark:r};this.messages.unshift(s),this.allEvents.push(s),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(r=>[r.rider.id,r]));return this.intermediateMarkers.map(r=>{const s=t.map(i=>i.markerCrossings[r.key]??null).filter(i=>i!=null),n=Pc(s,!this.isTimeTrialMode,r.markerType,a,this.isClimberMalusStage());return{markerKey:r.key,markerLabel:r.label,markerType:r.markerType,markerCategory:r.markerCategory,kmMark:r.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.isTimeTrialMode?[...this.riders].sort(no):Nc(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(s=>s.finishStatus!=="dnf").reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0);let r=0;for(const s of t)Re(s)&&(r+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:r,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(ae)}advanceSubstep(t){const a=this.elapsedSeconds,r=a+t,s=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();if(this.updateBreakawayPhaseState(),this.superTeamId!=null&&this.superTeamBreakawayRiderId!=null&&!this.superTeamBreakawayRiderCaught){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&!ae(l)&&this.riders.filter(u=>this.superTeamProtectedLeaderIds.has(u.rider.id)&&!ae(u)).some(u=>u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&u.distanceCoveredMeters>=l.distanceCoveredMeters)&&(this.superTeamBreakawayRiderCaught=!0,l.breakawayMalus=0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} von Leader eingeholt!`,detail:"Der Ausreißer wurde von seinem Kapitän eingeholt und unterstützt das Team ab jetzt mit frischen Kräften!"}))}if(this.superTeamBreakawayRiderCaught&&this.superTeamBreakawayRiderId!=null){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&(l.breakawayMalus=0)}for(const l of this.riders){if(ae(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,r-p);if(m<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-m),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const u=this.currentSegment(l),f=this.currentWindZone(l);if(!u||!f){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=p,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const v=da(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=v,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[];continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,s);const g=this.calculateBasePhysics(l,u,f);l.activeTerrain=u.terrain,l.skillName=g.skillName,l.skillBreakdown=g.skillBreakdown,l.baseSkill=g.baseSkill,l.teamGroupBonus=g.teamGroupBonus,l.effectiveSkill=g.effectiveSkill,l.staminaPenalty=g.staminaPenalty,l.elevationPenalty=g.elevationPenalty,l.gradientPercent=g.gradientPercent,l.gradientModifier=g.gradientModifier,l.windModifier=g.windModifier,l.tempSpeedMps=g.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=g.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*m}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,r);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const p of this.riders)l.push(p);l.sort(Lc);for(let p=0;p<l.length;p+=1){const m=l[p];if(ae(m))continue;const u=this.isActiveBreakawayRider(m),f=m.tempSpeedMps/14,g=Math.max(5,50*f),v=this.currentSegment(m),h=Math.max(15,150*f),b=Math.max(g,Math.min(h,Mc(v==null?void 0:v.terrain))),$=_c(l,p,b),M=$.size,T=Pn(M),x=Ac(M,$.positionInGroup);let R=0,w=Number.POSITIVE_INFINITY,E=null;for(let P=p-1;P>=0;P-=1){const L=l[P],N=L.distanceCoveredMeters-m.distanceCoveredMeters;if(N>=b+nc)break;!this.canReceiveDraftFromCandidate(m,L)||this.isActiveBreakawayRider(L)||N<=0||N>=b||(R+=1,N<=w&&(w=N,E=L))}if(R===0||!E){if(u)continue;m.draftModifier=1,m.draftNearbyRiderCount=0,m.draftPackFactor=0,m.currentSpeedMps=m.tempSpeedMps,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,m.isLeadingGroup=!0,this.applyCaptainWaitLogic(m);continue}const F=ae(E)?E.tempSpeedMps:E.currentSpeedMps,A=w,_=A<=g?1:1-(A-g)/Math.max(1e-4,b-g),z=this.currentWindZone(m),O=(z==null?void 0:z.vector)??0,G=(z==null?void 0:z.windSpeedKph)??0,C=-O*(G/70),U=Math.max(.3,.35+.35*C)*Math.min(1,f)*xn,j=be((v==null?void 0:v.gradient_percent)??0,-20,20),X=En(j),te=1+(x?0:U*_*T*X),W=m.tempSpeedMps*te;if(!(u&&te<=m.draftModifier)){if(m.draftModifier=te,m.draftNearbyRiderCount=M,m.draftPackFactor=T,m.isLeadingGroup=x,W>F){if(m.tempSpeedMps>E.tempSpeedMps){m.currentSpeedMps=W,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t;continue}if(A<1){m.currentSpeedMps=F,m.nextDistanceCoveredMeters=E.distanceCoveredMeters+F*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=Math.min(W,F+2),m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=W,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(ae(l))continue;if(this.superTeamId!=null&&l.rider.activeTeamId===this.superTeamId&&!this.superTeamProtectedLeaderIds.has(l.rider.id)){const b=l.rider.id===this.superTeamBreakawayRiderId;if(!b||this.superTeamBreakawayRiderCaught){const $=l.distanceCoveredMeters/this.stageDistanceMeters;let M=0,T=!1,x=!1;b?$<this.superTeamEndPercent?T=!0:l.superTeamActiveLogged&&(x=!0):$>=this.superTeamStartPercent&&$<this.superTeamEndPercent?T=!0:$>=this.superTeamEndPercent&&l.superTeamActiveLogged&&(x=!0),T?(M=this.superTeamBonusAmount,l.superTeamActiveLogged||(l.superTeamActiveLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} leistet Führungsarbeit!`,detail:b?`Der eingeholte Ausreißer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`:`Der Edelhelfer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`}))):x&&(l.superTeamMalusAmount==null&&(l.superTeamMalusAmount=Kr(4,8)),M=-l.superTeamMalusAmount,l.superTeamExhaustedLogged||(l.superTeamExhaustedLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"warning",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} ist erschöpft!`,detail:`Die Führungsarbeit hat ihren Tribut gefordert. Der Fahrer erhält für den Rest der Etappe einen Malus von -${l.superTeamMalusAmount} auf Berg-, Hügel- und Flachpassagen.`}))),l.originalSkills||(l.originalSkills={flat:l.rider.skills.flat,mountain:l.rider.skills.mountain,mediumMountain:l.rider.skills.mediumMountain,hill:l.rider.skills.hill}),l.rider.skills.flat=l.originalSkills.flat+M,l.rider.skills.mountain=l.originalSkills.mountain+M,l.rider.skills.mediumMountain=l.originalSkills.mediumMountain+M,l.rider.skills.hill=l.originalSkills.hill+M}}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds)continue;const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,r-p);if(m<=0)continue;const u=l.distanceCoveredMeters,f=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*m,g=l.pendingIncident;if(g&&u<g.triggerDistanceMeters&&f>=g.triggerDistanceMeters){const b=Math.max(.1,l.currentSpeedMps),$=Math.max(0,(g.triggerDistanceMeters-u)/b);l.distanceCoveredMeters=g.triggerDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.applyIncident(l,g,p+$),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const v=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,f-l.distanceCoveredMeters)>=v){const b=v/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),l.finishTimeSeconds=p+b,l.currentSpeedMps=0;const $=da(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=$,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[]}else l.distanceCoveredMeters=f,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,u,l.distanceCoveredMeters,p),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-m),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!ae(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=Fn(),l.nextFormUpdateMeter+=de(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),p=this.riders.filter(u=>l.has(u.rider.id)&&!ae(u)),m=this.riders.filter(u=>!l.has(u.rider.id)&&!ae(u));if(p.length>0&&m.length>0){const u=p.reduce((g,v)=>v.distanceCoveredMeters>g.distanceCoveredMeters?v:g,p[0]);m.reduce((g,v)=>v.distanceCoveredMeters>g.distanceCoveredMeters?v:g,m[0]).distanceCoveredMeters>=u.distanceCoveredMeters&&(u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:u.rider.id,riderName:u.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${u.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const c=Vd(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of c.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!ae(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const r=new Map;for(const s of this.riders){if(ae(s)||s.rider.activeTeamId==null||a<=s.startOffsetSeconds)continue;const n=r.get(s.rider.activeTeamId)??[];n.push(s),r.set(s.rider.activeTeamId,n)}for(const s of r.values()){const n=s[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,s.length),c=[...s].sort((u,f)=>f.effectiveSkill-u.effectiveSkill||u.rider.id-f.rider.id).slice(0,o).reduce((u,f)=>u+f.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-s.length),p=Math.max(1,c-l),m=this.resolveTimeTrialSpeedMps(p,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*dd(i.terrain,this.bootstrap.skillWeightRules??[]);for(const u of s){const f=Math.max(t,u.startOffsetSeconds),g=Math.max(0,a-f);u.currentSpeedMps=m,u.tempSpeedMps=m,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+m*g}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const s=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?s.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,c=i.rider.activeTeamId!=null?s.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==c?o-c:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(s=>[s.riderId,s.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((s,n)=>{const i=a.get(s.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(s)-this.resolveProjectedIttStartScore(n)||s.rider.id-n.rider.id}):[...t].sort((s,n)=>s.rider.skills.timeTrial-n.rider.skills.timeTrial||s.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,r=0;for(const s of this.bootstrap.stageSummary.segments){const n=(s.start_km+s.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,s.terrain),c=i>0?this.resolveWeightedSkill(t.rider,s.terrain,i):o,l=Math.max(0,o.value-c.value),{effectiveSkill:p}=this.resolveEffectiveSkill({rider:t,baseSkill:c.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),m=be(s.gradient_percent,-20,20),u=m>0?Math.exp(-.11*m):1-m*.06,f=this.windZones.find(v=>n>=v.startMeter&&n<=v.endMeter)??this.windZones[this.windZones.length-1],g=f?1+f.vector*(f.windSpeedKph/100)*.52:1;a+=p*u*g*s.length_km,r+=s.length_km}return r>0?a/r:0}resolveStartOffsetSeconds(t,a,r){if(this.isIndividualTimeTrial)return a*Qd;if(this.isTeamTimeTrial){const s=t.rider.activeTeamId;return(s!=null?r.get(s)??0:0)*ec}return 0}buildIntermediateMarkers(){return dt(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||Ct(t)).map(({key:t,label:a,marker:r,kmMark:s})=>({key:t,distanceMeters:s*1e3,label:a,markerType:r.type,markerCategory:r.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(c=>c.distanceMeters<t.groupPhaseEndDistanceMeters),r=this.stageDistanceMeters*vc,s=a.some(c=>c.distanceMeters<=r);if(!(a.length<=1||!s))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(_a,Math.ceil(r/_a)*_a);for(let c=o;c<t.groupPhaseEndDistanceMeters;c+=_a)i.push(c);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,r){const s=Rc(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,c=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),p=Math.min(85,o.value)+l,m=this.isTimeTrialMode?0:t.teamGroupBonus,u=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:f,staminaPenalty:g,elevationPenalty:v}=this.resolveEffectiveSkill({rider:t,baseSkill:p,staminaPenalty:c,teamGroupBonus:m,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:u}),h=be(a.gradient_percent,-20,20),b=h>0?Math.exp(-.11*h):1-h*.06,$=1+r.vector*(r.windSpeedKph/100)*.52,M=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:s,skillBreakdown:o.breakdown,baseSkill:p,teamGroupBonus:m,effectiveSkill:f,staminaPenalty:g,elevationPenalty:v,gradientPercent:h,gradientModifier:b,windModifier:$,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(f,t.distanceCoveredMeters,a,b,$):this.resolveRoadStageSpeedMps(f,t.distanceCoveredMeters,a,b,$,M)}}resolveRoadStageSpeedMps(t,a,r,s,n,i){const o=this.resolveSkillSpreadFactor(a,r),c=this.resolveSegmentElevation(r,a),l=this.resolveElevationSkillSpreadFactor(r,c),u=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,u*s*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const r=Math.max(0,a-lc),s=Math.floor(r/dc);return t.terrain==="Mountain"?1+(s*uc+s*Math.max(0,s-1)*mc/2):1+s*cc}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const r=a.filter(n=>n.activeTerrain===t.activeTerrain);return(r.length>0?r:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,r){if(r<=1)return{draftModifier:1,draftPackFactor:0};const s=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,c=-i*(o/70),p=Math.max(.3,.35+.35*c)*Math.min(1,s)*xn,m=be(a.gradient_percent,-20,20),u=En(m),f=Pn(r);return{draftModifier:1+p*f*u,draftPackFactor:f}}resolveBreakawayTimeGapPenalty(t){if(t<Mn)return 0;const a=Math.floor((t-Mn)/bc);return yc+a}recordBreakawayFallbackCheckpointCrossings(t,a,r,s,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>r)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const c=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?s+c-t.startOffsetSeconds:s+c);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let s=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((c,l)=>l.distanceCoveredMeters-c.distanceCoveredMeters||l.currentSpeedMps-c.currentSpeedMps||c.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,s;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const c=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!c)break;const l=n.markerCrossings[c.key]??null;if(!l)break;const p=t.map(m=>m.markerCrossings[c.key]??null).filter(m=>m!=null).sort((m,u)=>m.crossingTimeSeconds-u.crossingTimeSeconds||m.riderId-u.riderId)[0]??null;if(p){const m=l.crossingTimeSeconds-p.crossingTimeSeconds;s=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:s,kmMark:c.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const c=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[c]??null;if(l==null)break;const p=t.map(m=>m.breakawayFallbackCheckpointTimes[c]??null).filter(m=>m!=null).sort((m,u)=>m-u)[0]??null;if(p!=null){const m=l-p;s=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:s,kmMark:c<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[c]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return s}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),r=this.riders.filter(o=>!ae(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),s=this.riders.filter(o=>!ae(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(r.length===0||s.length===0){this.breakawayGapStatus=null;return}const n=[...r].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null,i=[...s].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const c=this.intermediateMarkers[o];if(!c)continue;const l=n.markerCrossings[c.key]??null,p=i.markerCrossings[c.key]??null;if(!l||!p)continue;const m=p.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:c.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const c=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(c==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,p=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||p==null)continue;const m=p-l;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:c/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=new Set(a.riderIds),s=this.riders.filter(o=>!ae(o)&&r.has(o.rider.id));if(s.length===0)return;const n=this.riders.filter(o=>!ae(o)&&!r.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(s,n);for(const o of s)o.breakawayGapPenalty=i;for(const o of s){const c=this.currentSegment(o);if(!c)continue;const p=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=p,o.tempSpeedMps=this.resolveRoadStageSpeedMps(p,o.distanceCoveredMeters,c,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(c.terrain));const m=this.resolveMaxBreakawayDraftModifier(o,c,s.length);o.draftModifier=m.draftModifier,o.draftNearbyRiderCount=Math.max(0,s.length-1),o.draftPackFactor=m.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*m.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,r,s,n){return this.resolveRoadStageSpeedMps(t,a,r,s,n,.5)}syncRiderTelemetry(t,a=null){var i;const r=this.currentSegment(t),s=this.currentWindZone(t);if(ae(t)||!r||!s){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,r,s);t.segmentStartKm=r.start_km,t.segmentEndKm=r.end_km,t.segmentStartElevation=r.start_elevation,t.segmentEndElevation=r.end_elevation,t.activeTerrain=r.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),r=this.riders.reduce((n,i)=>ae(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(r<=t.phaseEndDistanceMeters)return!1;let s=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(r<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<xc){n.breakawayMalus=0,s=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),c=Math.floor(o/Sc),l=Math.min($c,n.breakawayInitialMalus),p=Math.max(l,n.breakawayInitialMalus-c*kc),m=Jt(p);m!==n.breakawayMalus&&(n.breakawayMalus=m,s=!0)}return s}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const r=new Set(a.riderIds);for(const s of this.riders)ae(s)||!r.has(s.rider.id)||this.syncRiderTelemetry(s,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(s=>t.riderIds.includes(s.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const s of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:s.rider.id,riderName:s.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(s.rider.id,s.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let r=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),r=!0}if(this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayMalus=t.malusValue,s.breakawayInitialMalus=t.malusValue,s.breakawayRecoveryStartDistanceMeters=null,s.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return r}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=this.riders.filter(o=>!ae(o)&&a.riderIds.includes(o.rider.id));if(r.length===0)return;const s=[...r].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0];if(!s)return;const n=Math.max(.1,s.currentSpeedMps),i=s.distanceCoveredMeters+n*t;for(const o of r){if(Math.max(0,s.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?Bd:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const r=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(r==null||r.isCounterAttack)return!0;const s=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(s==null?void 0:s.isCounterAttack)===!0&&s.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(r=>r.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const r=this.resolvePreStageGcRank(t);return r!=null?`${a} (${r}.)`:a}triggerStageAttacksForRider(t,a,r,s){if(ae(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||r<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(r/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const c=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/c),p=s+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:p,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const m=new Set(this.activeStageAttacksByRiderId.keys()),u=this.stageFavorites.slice(0,20).filter(v=>{if(v.kind!=="rider"||v.riderId==null)return!1;const h=this.riders.find($=>$.rider.id===v.riderId);if(!h||ae(h))return!1;const b=t.distanceCoveredMeters-h.distanceCoveredMeters;return b>=0&&b<=150}),f=jd(u,t.rider.id,m),g=[];for(const v of f){const h=this.riders.find(b=>b.rider.id===v);!h||ae(h)||this.activeStageAttacksByRiderId.has(v)||(this.activeStageAttacksByRiderId.set(v,{riderId:v,remainingSeconds:kn,startedAtElapsedSeconds:p,triggerDistanceMeters:h.distanceCoveredMeters,durationSeconds:kn,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),h.isAttacking=!0,g.push({riderId:v,riderName:this.formatRiderWithPreStageGc(v,h.riderName),riderTeamId:h.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:p,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const v of g)this.pushMessage({elapsedSeconds:p,riderId:v.riderId,riderName:v.riderName,type:"counter_attack",tone:"warning",title:`${v.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const r of t){if(r.finishStatus==="dnf")continue;const s=a[a.length-1];if(!s||Math.abs(s.distanceMeter-r.distanceCoveredMeters)>=La){a.push({riderIds:[r.rider.id],riderCount:1,distanceMeter:r.distanceCoveredMeters,distanceSum:r.distanceCoveredMeters});continue}s.riderIds.push(r.rider.id),s.riderCount+=1,s.distanceSum+=r.distanceCoveredMeters,s.distanceMeter=s.distanceSum/s.riderCount}return a.map(({distanceSum:r,...s})=>s)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!ae(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),r=new Map;let s=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],c=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-c<La;){const m=a[n].rider.activeTeamId;m!=null&&r.set(m,(r.get(m)??0)+1),n+=1}for(;s<a.length&&c-a[s].distanceCoveredMeters>=La;){const m=a[s].rider.activeTeamId;if(m!=null){const u=(r.get(m)??0)-1;u<=0?r.delete(m):r.set(m,u)}s+=1}const l=o.rider.activeTeamId,p=l==null?0:Math.max(0,(r.get(l)??0)-1);t.set(o.rider.id,p===0?0:Jt(p*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?oc:0,r=this.resolveBreakawaySkillBonus(t.rider),s=t.baseSkill+pr(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+r+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,s),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const r=be(this.stageDistanceMeters/1e3,fc,hc),s=this.interpolateStaminaDistanceValue(r),n=be(t,wn,Wr),i=(Wr-n)/(Wr-wn),o=s/3+i*s,c=this.stageDistanceMeters<=0?0:be(a/this.stageDistanceMeters,0,1);return o*c**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=Nt[0].kmMark)return Nt[0].value;for(let a=0;a<Nt.length-1;a+=1){const r=Nt[a],s=Nt[a+1];if(t<=s.kmMark){const n=Math.max(1e-4,s.kmMark-r.kmMark),i=(t-r.kmMark)/n;return r.value+(s.value-r.value)*i}}return Nt[Nt.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/Or),r=Math.max(1,Math.ceil(t/Or)),s=de(tc,ac),n=Array.from({length:r},()=>de(.2,1.2)),i=n.reduce((l,p)=>l+p,0),o=Array.from({length:a+1},()=>1);o[0]=s;let c=0;for(let l=1;l<=r;l+=1)c+=n[l-1]??0,o[l]=s+(1-s)*(c/i);return o}resolveSkillSpreadFactor(t,a){const r=this.stageDistanceMeters<=0?1:be(t/this.stageDistanceMeters,0,1),s=Math.min(this.spreadCurve.length-1,Math.floor(r/Or)),n=this.spreadCurve[s]??1;if(r<=this.lateStageStartRatio)return n;const i=cd(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),c=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=be((r-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),p=this.interpolateFinalSpread(o,l);if(o<=1&&c<=1)return n;if(r<this.finalPushStartRatio||c<=o)return Math.max(n,p);const m=be((r-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),u=o+(c-o)*m;return Math.max(n,u)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const r=Ui(this.simulationMode,t,this.skillWeightRuleMap).map(s=>({key:s.key,weight:s.weight}));return this.weightedSkillComponentsByTerrain.set(t,r),r}resolveWeightedSkill(t,a,r=0){const s=this.resolveWeightedSkillComponents(a),n=r>0||t.mentorBoosts?{...t.skills}:t.skills;if(r>0&&(n.stamina=Math.max(0,n.stamina-r)),t.mentorBoosts)for(const[l,p]of Object.entries(t.mentorBoosts))typeof p=="number"&&(n[l]+=p);let i=0,o=0;for(const l of s)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:ld(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,s)}}resolveSkillBreakdown(t,a,r){const s=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(s);if(n!==void 0)return n;const i=Ic(t,r);return this.skillBreakdownCache.set(s,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const r=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,s=Math.max(0,100-r)/1e3,n=this.resolveElevationBucket(a);return s*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const r=a??this.interpolateElevation(t.distanceCoveredMeters),s=this.resolveElevationBucket(r);return s===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=s,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,r)),t.elevationPenalty}resolveSegmentElevation(t,a){const r=t.start_km*1e3,s=t.end_km*1e3,n=Math.max(1e-4,s-r),i=be((a-r)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const s=be(t,0,this.stageDistanceMeters)/1e3;if(s<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(s<=o.kmMark){const c=Math.max(1e-4,o.kmMark-i.kmMark),l=(s-i.kmMark)/c;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),jr(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var m;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(Re).sort((u,f)=>(u.finishTimeSeconds??0)-(f.finishTimeSeconds??0)||f.photoFinishScore-u.photoFinishScore||u.rider.id-f.rider.id);if(t.length===0)return;const a=[];let r=null;for(const u of t){const f=u.finishTimeSeconds??0;if(a.length===0){a.push(u),r=f;continue}if(r!=null&&f-r<=ga){a.push(u),r=f;continue}break}const s=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=u=>u.photoFinishScore,o=[...a].sort((u,f)=>i(f)-i(u)||u.rider.id-f.rider.id),c=((m=o[0])==null?void 0:m.finishTimeSeconds)??0,l=this.finishWeightProfile,p=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${p} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${ga.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${s}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((u,f)=>{const g=Dc(u,l).map(x=>`${so[x.skillKey]} ${x.contribution.toFixed(2)} = ${x.effectiveSkill.toFixed(2)} x ${(x.weight*100).toFixed(0)}%`).join(" | "),v=u.finishTimeSeconds??0,h=v-c,b=h<=1e-4?`${v.toFixed(2)} s`:`${v.toFixed(2)} s (+${h.toFixed(2)} s)`,$=this.calculatePhotoFinishScore(u),M=u.leadoutBonus??0,T=da(u,s,n);console.log(`#${f+1} Zielsprint | ${u.riderName} | Zeit ${b} | Score (ohne Boni): ${$.toFixed(2)} -> Score (mit Boni): ${u.photoFinishScore.toFixed(2)} [SpecAdj: ${T>0?"+":""}${T.toFixed(2)}, Leadout: +${M.toFixed(2)}] | ID-Tiebreak ${u.rider.id} | (${g})`)}),console.groupEnd()}recordIntermediateSplits(t,a,r,s,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>r)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,c=Math.max(0,this.isTimeTrialMode?s+o-t.startOffsetSeconds:s+o);let l=this.resolveMarkerCrossingScore(t,i);const p=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;p&&(l+=da(t,p,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=c,t.splitTimes[i.key]=c,t.splitTimes[i.label]=c,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:c,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return jr(t,this.resolveSprintWeightProfile());const r=jr(t,this.resolveClimbWeightProfile(a.markerCategory)),s=wc(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return r+s}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??Ud}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??qd[a]}calculatePreLeadoutFinishScore(t){const r=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,s=pr(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[c,l])=>{if(!l)return o;const p=c==="stamina"?r:0,m=Math.max(0,t.rider.skills[c]+s+t.dailyForm+t.microForm+t.teamGroupBonus-p);return o+m*l},0),i=da(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}applySprintLeadoutBonuses(){const t=this.resolveFinishMarkerType();if(t!=="finish_flat"&&t!=="finish_hill"||this.isTimeTrialMode)return;const a=this.riders.filter(Re).sort((o,c)=>(o.finishTimeSeconds??0)-(c.finishTimeSeconds??0));if(a.length===0)return;const r=[];let s=null;for(const o of a){const c=o.finishTimeSeconds??0;if(r.length===0){r.push(o),s=c;continue}if(s!=null&&c-s<=ga){r.push(o),s=c;continue}break}const n=new Set(r.map(o=>o.rider.id)),i=new Map;for(const o of this.riders)if(o.finishStatus!=="dnf"&&o.finishStatus!=="otl"&&o.finishStatus!=="dns"&&o.finishTimeSeconds!=null&&o.rider.skills.sprint>=73&&o.rider.activeTeamId!=null&&n.has(o.rider.id)){const c=o.rider.activeTeamId,l=i.get(c)??[];l.push(o),i.set(c,l)}for(const[o,c]of i.entries()){if(c.length===0)continue;let l=null,p=Number.NEGATIVE_INFINITY;for(const m of c){const u=this.calculatePreLeadoutFinishScore(m);u>p?(p=u,l=m):u===p&&l!==null&&(m.rider.skills.sprint>l.rider.skills.sprint||m.rider.skills.sprint===l.rider.skills.sprint&&m.rider.id<l.rider.id)&&(l=m)}if(l){const m=this.calculateSprintLeadoutBonusForRider(l);m>0&&(l.leadoutBonus=m,l.photoFinishScore+=m)}}}calculateSprintLeadoutBonusForRider(t){const a=t.rider.activeTeamId;if(a==null)return 0;const r=this.riders.filter(p=>p.rider.activeTeamId===a);if(r.length===0)return 0;let s=this.teamSprintRandomValues.get(a);s===void 0&&(s=de(.25,.6),this.teamSprintRandomValues.set(a,s));let n=this.teamSprintSpecialRandomValues.get(a);n===void 0&&(n=de(.1,.3),this.teamSprintSpecialRandomValues.set(a,n)),t.leadoutRiderId=null;let i=0,o=0,c=null;const l=[];for(const p of r){if(p.rider.id===t.rider.id||p.finishStatus==="dnf"||p.finishStatus==="otl"||p.finishStatus==="dns")continue;let m=0;const u=p.rider.skills.sprint>=72,f=p.rider.skills.flat>=78,g=p.rider.skills.timeTrial>=76,v=p.rider.skills.acceleration>=80;if(u&&m++,f&&m++,g&&m++,v&&m++,m>0){const h=u?s:n;let b=1;m===2?b=1.25:m===3?b=1.5:m===4&&(b=2);const $=h*b*1.5;if(i+=h*b,l.push({riderId:p.rider.id,name:p.riderName,contribution:Number($.toFixed(2))}),h*b>o)o=h*b,c=p.rider.id;else if(h*b===o&&c!==null){const M=this.riders.find(T=>T.rider.id===c);M&&p.rider.skills.sprint>M.rider.skills.sprint&&(c=p.rider.id)}}}return i>0&&(t.leadoutRiderId=c,t.leadoutContributions=l),i*1.5}resolveFinishMarkerType(){const t=dt(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const r=t[a].marker.type;if(r==="finish_flat"||r==="finish_hill"||r==="finish_mountain")return r}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return Zd;case"finish_mountain":return Jd;default:return Yd}}resolveRiderClockSeconds(t){if(Re(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,r,s=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(c=>c.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){s=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const c=this.riders.find(p=>p.rider.id===o);if(!c||ae(c))continue;if(Math.abs(c.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const p=bd(c.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(c,p,r,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:s?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:s?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:r,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(r=>r.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+La){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const Bc=300;async function Hc(e,t){const a=new io(e,{maxSubstepSeconds:5});let r=!1;for(;!r;){const s=a.step(Bc);if(r=s.isFinished,t){const n=s.stageDistanceMeters>0?s.leaderDistanceMeters/s.stageDistanceMeters:0,i=e.riders.length>0?s.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const zc=[1,2,5,10,25,50,100,250,500],Nn=new WeakMap;function Gc(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Ln(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Kc(e){const t=Nn.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${zc.map(r=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return Nn.set(e,a),a}function Dn(e,t){const a=Kc(e);a.timeField&&(a.timeField.textContent=Gc(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${Ln(t.snapshot.leaderDistanceMeters)} / ${Ln(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(r=>{const s=Number(r.dataset.raceSimSpeed);r.classList.toggle("active",s===t.timeMultiplier)})}const Oc=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function Wc(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),r=t%60;return`${a}:${String(r).padStart(2,"0")}`}function sa(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function jc(e){return`/jersey/Jer_${e}.png`}function oo(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${sa(jc(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Vc(e){return e.riderId==null||e.riderTeamId==null?"":oo(e.riderTeamId)}function Uc(e){const t=sa(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function Yc(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${sa(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${sa(e)}</button>`}function Zc(e,t){if(t==="all")return!0;const a=lo(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function Jc(e){const t=e.detail?sa(e.detail):"",a=(e.secondaryRiders??[]).map(s=>`${s.riderTeamId!=null?oo(s.riderTeamId,"race-sim-message-inline-jersey"):""}${Yc(s.riderName,s.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const r=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${r}</span>`}function lo(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function _n(e,t,a="all"){const r=t.filter(n=>Zc(n,a)),s=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${Oc.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${r.length===0?`<div class="race-sim-message-empty">${s}</div>`:r.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${sa(lo(n))}">
          <span class="race-sim-message-time">t=${Wc(n.elapsedSeconds)}</span>
          ${Vc(n)}
          <span class="race-sim-message-text">
            ${Uc(n)}
            ${Jc(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const qc=1,Xc={Flat:14,Rolling:15,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:25,High_Mountain:27,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function Qc(e){return Math.max(0,Math.round(e))}function co(e){return e==="ITT"||e==="TTT"}function eu(e){return Xc[e]??20}function tu(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+eu(e)/100))}function au(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function An(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function Vr(e,t){if(co(t))return[...e].sort(au);const a=[...e].sort((o,c)=>o.stageTimeSeconds-c.stageTimeSeconds||An(o,c)),r=[];let s=[],n=null;const i=()=>{r.push(...s.sort(An))};for(const o of a){if(s.length===0){s=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=qc){s.push(o),n=o.stageTimeSeconds;continue}i(),s=[o],n=o.stageTimeSeconds}return s.length>0&&i(),r}function ee(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ru(e){return`/jersey/Jer_${e}.png`}function Ra(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${ee(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${ee(ru(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Ia(e,t,a){return e==null?`<span class="${a}" title="${ee(t)}">${ee(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${ee(t)}">${ee(t)}</button>`}function su(e){return e.toFixed(1).replace(".",",")}function gr(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function nu(e){return`${e??0} Pkt.`}function iu(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function ou(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function uo(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function lu(e){if(e==null||e<=0)return uo(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Tt(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function Ba(e){return`${e.toFixed(1).replace(".",",")} km`}function Bn(e){return`${e.toFixed(1).replace(".",",")}%`}function Ha(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function Hn(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function du(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function cu(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function uu(e,t,a){return Array.from({length:t},(r,s)=>e.slice(s*a,(s+1)*a))}function mu(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const r=uu(e,4,5),s=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${r.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=cu(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${Ra(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${Ia(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${ee(i.roleLabel)}">${ee(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?s.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${ee(gr(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${su(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function ka(e,t){const a=e.riders.find(r=>r.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function Er(e,t){const a=e.riders.find(n=>n.id===t),r=(a==null?void 0:a.activeTeamId)??null,s=r!=null?e.teams.find(n=>n.id===r)??null:null;return{teamId:r,teamName:(s==null?void 0:s.name)??null}}function pu(e,t,a,r={}){const s=(t??[]).slice(0,r.limit??8);return s.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${s.map(n=>{var m;const i=n.riderId??0,o=Er(e,i),c=ka(e,i),l=((m=r.distanceGapsByRiderId)==null?void 0:m.get(i))??null,p=[r.distanceGapClassName??"",ou(l)].filter(u=>u.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${Ra(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${Ia(n.riderId,c,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${r.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${p}">${ee(iu(l))}</span>`:""}
      </article>`}).join("")}</div>`}function za(e,t,a,r,s,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${ee(e)}</h4>
      ${pu(a,r,s,n)}
    </section>`}function Gt(e,t,a,r,s=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${r}" ${s?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${r}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${ee(e)}</span>
      </summary>
      ${t}
    </details>`}function fr(e,t,a,r){const s=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var c;const i=s.get(n.id)??null,o=((c=a.get(n.id))==null?void 0:c[r])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||ka(e,n.riderId).localeCompare(ka(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function zn(e){const t=gu(e)?e.stagePoints:0;return`${ee(nu("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${ee(t)}</span></span>`:""}`}function gu(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function Gn(e,t){if(t==null)return new Map;const a=e.riders.find(r=>r.riderId===t)??null;return a?new Map(e.riders.map(r=>[r.riderId,a.distanceCoveredMeters-r.distanceCoveredMeters])):new Map}function fu(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function Xa(e,t){var r;const a=(r=e.race.category)==null?void 0:r.bonusSystem;return!a||t==null||t==="Sprint"?[]:Tt(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function Es(e){var r;const t=(r=e.race.category)==null?void 0:r.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return Tt(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return Tt(a?t.pointsMountainStage:t.pointsSprintFinish)}function mo(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:Tt((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function hu(e,t,a){let r=null;for(const s of e.stageSummary.segments){const n=Math.max(t,s.start_km),i=Math.min(a,s.end_km),o=Math.max(0,i-n);if(o<=0)continue;const c={lengthKm:o,gradient:s.gradient_percent};(r==null||c.gradient>r.gradient||c.gradient===r.gradient&&c.lengthKm>r.lengthKm)&&(r=c)}return r}function Ur(e,t,a,r=null){return e.entries.filter(s=>r==null||r.has(s.riderId)).map((s,n)=>({riderId:s.riderId,rank:s.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:s.crossingTimeSeconds,gapSeconds:s.gapSeconds})).filter(s=>s.points>0)}function Fs(e){const t=new Map;for(const a of e)for(const r of a.entries){const s=t.get(r.riderId)??{points:0,mountain:0};r.pointsKind==="mountain"?s.mountain+=r.points:s.points+=r.points,t.set(r.riderId,s)}return t}function bu(e){return dt(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function hr(e,t){const a=co(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?Qc(a):null}function Fr(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=hr(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const r=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(r)||r<=0)return Vr(a,e.stage.profile).map(n=>n.rider);const s=tu(e.stage.profile,a.map(n=>n.stageTimeSeconds));return s==null?Vr(a,e.stage.profile).map(n=>n.rider):Vr(a.filter(n=>n.stageTimeSeconds<=s),e.stage.profile).map(n=>n.rider)}function yu(e,t){const a=Es(e);return a.length===0?[]:Fr(e,t).map((r,s)=>({riderId:r.riderId,rank:s+1,points:a[s]??0,pointsKind:"points",crossingTimeSeconds:hr(e,r),gapSeconds:null})).filter(r=>r.points>0)}function vu(e,t){const a=Fr(e,t).slice(0,20),r=a[0]!=null?hr(e,a[0])??0:0;return a.map((s,n)=>{const i=hr(e,s)??0;return{riderId:s.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-r),photoFinishScore:s.photoFinishScore}})}function Su(e,t){var a;return((a=Fr(e,t)[0])==null?void 0:a.riderId)??null}function Ps(e,t,a){var M,T;const r=dt(e.stageSummary),s=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(Fr(e,a).map(x=>x.riderId)):null,i=r.filter(({marker:x})=>x.type==="climb_start"),o=r.filter(({marker:x})=>Ct(x)).sort((x,R)=>x.kmMark-R.kmMark).map((x,R)=>{var j,X;const w=[...i].reverse().find(J=>J.kmMark<=x.kmMark)??null,E=fu(e,x.kmMark),F=(w==null?void 0:w.kmMark)??(E==null?void 0:E.start_km)??x.kmMark,A=(w==null?void 0:w.elevation)??(E==null?void 0:E.start_elevation)??x.elevation,_=Math.max(0,x.kmMark-F),z=_>0?(x.elevation-A)/(_*1e3)*100:(E==null?void 0:E.gradient_percent)??0,O=hu(e,F,x.kmMark),G=t.find(J=>J.markerKey===x.key)??null,C=Xa(e,(G==null?void 0:G.markerCategory)??x.marker.cat??null),H=G?Ur(G,C,"mountain",n):[],U=(G==null?void 0:G.markerCategory)??x.marker.cat??null;return{key:x.key,title:`${R+1}. Bergwertung`,label:x.label,categoryLabel:U?`Kat. ${U}`:null,categoryClassName:Hn(U),kmMark:x.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-x.kmMark),climbLengthKm:_,averageGradient:z,steepestSegmentLengthKm:(O==null?void 0:O.lengthKm)??null,steepestSegmentGradient:(O==null?void 0:O.gradient)??null,highlightMeta:x.kmMark>=s,leaderRiderId:((j=H[0])==null?void 0:j.riderId)??((X=G==null?void 0:G.entries[0])==null?void 0:X.riderId)??null,displayBadges:Ha(C,"mountain"),entries:H,timingEntries:(G==null?void 0:G.entries)??[],accent:"mountain"}}),c=r.filter(({marker:x})=>x.type==="sprint_intermediate").sort((x,R)=>x.kmMark-R.kmMark).map((x,R)=>{var A,_;const w=t.find(z=>z.markerKey===x.key)??null,E=mo(e),F=w?Ur(w,E,"points",n):[];return{key:x.key,title:`${R+1}. Zwischensprint`,label:x.label,categoryLabel:null,categoryClassName:null,kmMark:x.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-x.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((A=F[0])==null?void 0:A.riderId)??((_=w==null?void 0:w.entries[0])==null?void 0:_.riderId)??null,displayBadges:Ha(E,"points"),entries:F,timingEntries:(w==null?void 0:w.entries)??[],accent:"sprint"}}),l=bu(e),p=yu(e,a),m=l?t.find(x=>x.markerKey===l.key)??null:null,u=m?Ur(m,Xa(e,m.markerCategory),"mountain",n):[],f=Es(e),g=m?Xa(e,m.markerCategory):[],v=e.stage.profile==="ITT"||e.stage.profile==="TTT"?vu(e,a):(m==null?void 0:m.entries)??[],h=((M=p[0])==null?void 0:M.riderId)??((T=u[0])==null?void 0:T.riderId)??Su(e,a),b={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:m!=null&&m.markerCategory?`Kat. ${m.markerCategory}`:null,categoryClassName:Hn((m==null?void 0:m.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(m!=null&&m.markerCategory),leaderRiderId:h,displayBadges:[...Ha(f,"points"),...Ha(g,"mountain")],entries:[...p,...u],timingEntries:v,accent:"finish"};return[...[...c,...o].sort((x,R)=>x.kmMark-R.kmMark||x.title.localeCompare(R.title,"de")),b].filter(x=>x.entries.length>0||x.timingEntries.length>0||x.accent!=="finish"||l!=null||a.isFinished)}function ku(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),r=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,s=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,r):t.entries.slice(0,r).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return s.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${s.map(n=>{const i=Er(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${Ra(i.teamId,i.teamName)}
            ${Ia(n.riderId,ka(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?ee(uo(n.crossingTimeSeconds)):ee(lu(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function Kn(e,t){var a;return((a=e==null?void 0:e.find(r=>r.riderId===t))==null?void 0:a.points)??0}function On(e,t){var a;return((a=e.filter(r=>r.riderId!=null&&t.has(r.riderId)).sort((r,s)=>r.rank-s.rank||r.riderId-s.riderId)[0])==null?void 0:a.riderId)??null}function Ga(e,t,a){if(!(!t||e.some(r=>r.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function $u(e,t,a,r,s){const n=new Set(e.riderIds),i=new Map(t.riders.map(f=>[f.riderId,f])),c=e.riderIds.map(f=>i.get(f)??null).filter(f=>f!=null).sort((f,g)=>{var v,h;return(((v=a.get(f.riderId))==null?void 0:v.rank)??Number.MAX_SAFE_INTEGER)-(((h=a.get(g.riderId))==null?void 0:h.rank)??Number.MAX_SAFE_INTEGER)||f.riderName.localeCompare(g.riderName,"de")||f.riderId-g.riderId}).slice(0,25),l=i.get(On(r,n)??-1)??null,p=i.get(On(s,n)??-1)??null,m=l!=null&&!c.some(f=>f.riderId===l.riderId),u=p!=null&&!c.some(f=>f.riderId===p.riderId);return c.length>=25&&m&&u&&l.riderId!==p.riderId?(Ga(c,l,23),Ga(c,p,24),c):(Ga(c,l,24),Ga(c,p,24),c)}function xu(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function Tu(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function Wn(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function wu(e,t){const a=t.riders.filter(s=>e.riderIds.includes(s.riderId)).reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0),r=Math.max(0,t.leaderDistanceMeters-a);return r>0?`-${Math.round(r)} m`:"—"}function Mu(e,t,a,r,s,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=Yl(a,r),c=a.find(u=>u.label===o)??a[0],l=new Map(e.gcStandings.map(u=>[u.riderId,u])),p=Fs(i),m=$u(c,t,l,s,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${ee(c.label)} <span class="race-sim-group-count">(${c.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${ee(Wn(c.previousGapMeters,"-"))}</span>
        <span>Leader ${ee(wu(c,t))}</span>
        <span>Hinten ${ee(Wn(c.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${m.map((u,f)=>{const g=l.get(u.riderId)??null,v=Er(e,u.riderId),h=p.get(u.riderId)??{points:0,mountain:0},b=Kn(s,u.riderId),$=Kn(n,u.riderId),M=xu(u.riderId,e.classificationLeaders),T=M.length>0?M.map(x=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[x]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${Tu(M)}" title="${ee(T)}">${f+1}.</strong>
              ${Ra(v.teamId,v.teamName)}
              <span class="race-sim-classification-main">
                ${Ia(u.riderId,u.riderName,`race-sim-group-rider-name${u.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${g?g.rank:"—"} · ${ee(g?gr(g.gapSeconds):"—")} · ${ee(u.gapToLeaderMeters>0?`+${Math.round(u.gapToLeaderMeters)} m`:"—")}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${b}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${$}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${h.points>0?`▲ +${h.points}`:" "}</span>
                  <span class="race-sim-breakaway-stage-gain">${h.mountain>0?`▲ +${h.mountain}`:" "}</span>
                </span>
              </span>
            </article>`}).join("")}
      </div>
    </section>`}function Ru(e,t,a,r){const s=Ps(t,a.markerClassifications,a),n=Fs(s),i=fr(t,t.pointsStandings,n,"points"),o=fr(t,t.mountainStandings,n,"mountain"),c=Cs(Is(a.clusters));e.innerHTML=Mu(t,a,c,r,i,o,s)}function Iu(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function Cu(e){const t=dt(e.stageSummary),a=mo(e)[0]??0,r=Es(e)[0]??0,s=t.filter(({marker:n})=>Ct(n)).reduce((n,{marker:i})=>n+(Xa(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+r,mountain:s}}function jn(e){const t=Cu(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function Eu(e){const t=du(e),a=[`<span class="race-sim-stage-points-meta-pill">${ee(Ba(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${ee(`${Ba(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${ee(`Länge ${Ba(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${ee(`Ø ${Bn(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${ee(`Steilstes ${Ba(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${ee(Bn(e.steepestSegmentGradient))}</span>`:""].filter(r=>r.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${ee(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${ee(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${ee(e.label)}">${ee(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((r,s)=>`${s>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${r}`).join("")}
    </span>`}function Fu(e,t,a,r=null){const s=r??Ps(e,t,a);return s.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${jn(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${jn(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${s.map(n=>{const i=n.leaderRiderId!=null?Er(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?ka(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${Eu(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${Iu(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${Ra(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?Ia(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${ee(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${ku(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function Pu(e,t,a,r,s,n=new Set){var f,g;const i=Ps(a,r,s),o=Fs(i),c=fr(a,a.pointsStandings,o,"points"),l=fr(a,a.mountainStandings,o,"mountain"),p=Gn(s,((f=a.gcStandings[0])==null?void 0:f.riderId)??null),m=Gn(s,((g=a.youthStandings[0])==null?void 0:g.riderId)??null),u=v=>!n.has(v);e.innerHTML=`
    ${Gt("Stage Favorites",mu(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",u("favorites"))}
    <section class="race-sim-classifications-section">
      ${Gt("GC",za("GC","gc",a,a.gcStandings,v=>ee(`GC ${v.rank} · ${gr(v.gapSeconds)}`),{limit:20,distanceGapsByRiderId:p}),"race-sim-overview-classification race-sim-overview-gc","gc",u("gc"))}
      ${Gt("Punktewertung",za("Punktewertung","points",a,c,zn),"race-sim-overview-classification race-sim-overview-points","points",u("points"))}
      ${Gt("Bergwertung",za("Bergwertung","mountain",a,l,zn),"race-sim-overview-classification race-sim-overview-mountain","mountain",u("mountain"))}
      ${Gt("Nachwuchsfahrerwertung",za("Nachwuchsfahrerwertung","youth",a,a.youthStandings,v=>ee(`${v.rank}. · ${gr(v.gapSeconds)}`),{distanceGapsByRiderId:m,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",u("youth"))}
    </section>
    ${Gt("Etappenwertungen",Fu(a,r,s,i),"race-sim-overview-stage-scoring","stageScoring",u("stageScoring"))}
  `}const Vn=new WeakMap,it=new WeakMap,Un=new WeakMap,po=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function Q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function go(e){return e<=0?"—":`+${Math.round(e)} m`}function fa(e){const t=po.format(e);return e>0?`+${t}`:t}function Yr(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function me(e){return po.format(e)}function Bt(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function fo(e){return`+${Bt(e)}`}function ho(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Ns(e){return`${(e*3.6).toFixed(1)} km/h`}function Nu(e){return`${fa(e)}%`}function ls(e){return`${e.toFixed(1).replace(".",",")} km`}function bo(e){return`${ls(e.segmentStartKm)} - ${ls(e.segmentEndKm)}`}function Lu(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function yo(e){return e.replace(/_/g," ")}function vo(e){return yo(e)}function Du(e){return yo(e)}function So(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function _u(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function Au(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function ko(e){return dt(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||Ct(t)).map(({key:t,label:a})=>({key:t,label:a}))}function Bu(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function Hu(e,t,a,r){var s;return a!=="ITT"&&a!=="TTT"?((s=r.get(t))==null?void 0:s.get(e.riderId))??null:e.splitTimes[t]??null}function $o(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(s=>({label:s.key,displayLabel:s.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${s.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function zu(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function Gu(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function xo(e){const t=Vn.get(e);if(t)return t;const a=ko(e),r={splitMarkers:a,columns:$o(e,a,!1),riderById:new Map(e.riders.map(s=>[s.id,s])),teamById:new Map((e.teams??[]).map(s=>[s.id,s])),teamAbbreviationById:new Map((e.teams??[]).map(s=>[s.id,s.abbreviation])),teamNameById:new Map((e.teams??[]).map(s=>[s.id,s.name])),gcByRiderId:new Map((e.gcStandings??[]).map(s=>[s.riderId,s]))};return Vn.set(e,r),r}function To(e,t){const a=e.parentElement,r=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!r)return"";const s=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",r.insertAdjacentElement("beforebegin",l),l})(),n=Ls(e),i=zu(t),o=Gu(i,n),c=it.get(e);return(c==null?void 0:c.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),s.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,r.innerHTML=t.map(l=>Ku(l,n)).join(""),it.set(e,{layoutKey:o,orderedRiderIds:(c==null?void 0:c.orderedRiderIds)??[],rowsByRiderId:(c==null?void 0:c.rowsByRiderId)??new Map,openDetailRiderId:(c==null?void 0:c.openDetailRiderId)??null,openTeamId:(c==null?void 0:c.openTeamId)??null})),o}function ut(e,t){e.textContent!==t&&(e.textContent=t)}function Ka(e,t){e.title!==t&&(e.title=t)}function Oa(e,t){e.className!==t&&(e.className=t)}function Wa(e,t,a){return e.lastValues[t]!==a}function ja(e,t,a){e.lastValues[t]=a}function Ls(e){const t=Un.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return Un.set(e,a),a}function Ku(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${Q(e.label)}">${Q(a)}</span>`;const r=!t.autoSort&&t.manualSortKey===e.sortKey,s=r?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${r?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${Q(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${Q(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${Q(a)}<span class="race-sim-leaderboard-sort-indicator">${Q(s)}</span></button>`}function Ou(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function Wu(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function Yn(e,t,a,r,s,n,i){if(r.autoSort)return(c,l)=>e.stage.profile==="ITT"?wo(c,l,t):Yu(c,l);if(!r.manualSortKey)return null;const o=r.manualSortDirection==="asc"?1:-1;return(c,l)=>{if(De(c)!==De(l))return De(c)?1:-1;const p=s.get(c.riderId)??null,m=s.get(l.riderId)??null,u=Zn(c,p,r.manualSortKey??"",e,a,n,i),f=Zn(l,m,r.manualSortKey??"",e,a,n,i);return Wu(u,f)*o||c.riderId-l.riderId}}function ju(e,t,a){if(e.length!==t.size)return!1;let r=null;for(const s of e){const n=t.get(s);if(!n||r&&a(r,n)>0)return!1;r=n}return!0}function Zn(e,t,a,r,s,n,i){const o=r.race.isStageRace&&r.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return r.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?Hu(e,a.slice(6),r.stage.profile,s):null}}function Vu(e,t,a,r,s,n,i,o,c){if(!s.manualSortKey){if(s.autoSort){const u=Yn(t,a,r,s,n,i,o);return u?[...e].sort(u):[...e]}const m=new Map(s.frozenOrder.map((u,f)=>[u,f]));return[...e].sort((u,f)=>(De(u)===De(f)?0:De(u)?1:-1)||(m.get(u.riderId)??Number.MAX_SAFE_INTEGER)-(m.get(f.riderId)??Number.MAX_SAFE_INTEGER)||u.riderId-f.riderId)}const l=Yn(t,a,r,s,n,i,o);if(!l)return[...e];const p=new Map(e.map(m=>[m.riderId,m]));return ju(c,p,l)?c.map(m=>p.get(m)).filter(m=>m!=null):[...e].sort(l)}function Uu(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const p=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(p))return!1;const m=it.get(e);return m?(m.openTeamId=m.openTeamId===p?null:p,m.openTeamId==null&&(m.openDetailRiderId=null),!0):!1}const r=t.closest("button[data-race-sim-rider-toggle]");if(r){const p=Number(r.dataset.raceSimRiderToggle);if(!Number.isFinite(p))return!1;const m=it.get(e);return m?(m.openDetailRiderId=m.openDetailRiderId===p?null:p,!0):!1}const s=Ls(e);if(t.closest("button[data-race-sim-splits-toggle]"))return s.showSplitColumns=!s.showSplitColumns,!s.showSplitColumns&&((l=s.manualSortKey)!=null&&l.startsWith("split:"))&&(s.manualSortKey=null,s.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return s.autoSort=!s.autoSort,s.autoSort?(s.manualSortKey=null,s.frozenOrder=[]):(s.manualSortKey=null,s.manualSortDirection="asc",s.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(p=>Number(p.dataset.raceSimRiderRow)).filter(p=>Number.isFinite(p))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||s.autoSort)return!1;const c=o.dataset.raceSimSortKey;return c?(s.manualSortKey===c?s.manualSortDirection=s.manualSortDirection==="asc"?"desc":"asc":(s.manualSortKey=c,s.manualSortDirection=Ou(c)),s.frozenOrder=[],!0):!1}function Jn(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function De(e){return e.finishStatus==="dnf"}function wo(e,t,a){if(De(e)!==De(t))return De(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const c=a[o];if(!c)continue;const l=e.splitTimes[c.key],p=t.splitTimes[c.key];if(l!=null&&p!=null&&l!==p)return l-p;if(l!=null&&p==null)return-1;if(l==null&&p!=null)return 1}const r=Jn(e,a),s=Jn(t,a);if(r!==s)return r?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function Yu(e,t){return De(e)!==De(t)?De(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function Mo(e,t){const a=(t==null?void 0:t.formBonus)??0,r=(t==null?void 0:t.raceFormBonus)??0,s=((t==null?void 0:t.fatigueMalus)??0)*.5,n=((t==null?void 0:t.longTermFatigueMalus)??0)*.5,i=((t==null?void 0:t.shortTermFatigueMalus)??0)*.5,o=e.teamGroupBonus,c=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,p=e.baseSkill+l+a+r+e.dailyForm+e.microForm+o-s-n-i,m=Math.max(0,p-e.staminaPenalty),u=p-m,f=m-e.effectiveSkill;return[`Basis ${me(e.baseSkill)}`,e.isAttacking?`+ Attacke ${me(l)}`:null,`+ S-Form ${me(a)}`,`+ R-Form ${me(r)}`,`+ T-Form ${me(e.dailyForm)}`,`+ Zufällige Form ${me(c)} (skaliert)`,`+ Teambonus ${me(o)}`,`- Fatigue ${me(s)}`,`- Langzeit ${me(n)}`,`- Akut ${me(i)}`,`- Stamina ${me(u)}`,`- HM ${me(f)}`,`= Effektiv ${me(e.effectiveSkill)}`].filter(g=>g!=null)}function Zu(e,t){return Mo(e,t).join(`
`)}function Ju(e){return fa(Math.max(-2.5,Math.min(2.5,e*2.5)))}function qu(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function Ro(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${Q(e.riderName)}">${Q(e.riderName)}</button>`}function Xu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId)??"—",s=a.get(e.activeTeamId)??r;return`<span class="race-sim-team-code" title="${Q(s)}">${Q(r)}</span>`}function Io(e){return`/jersey/Jer_${e}.png`}function Qu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId);if(!r)return"—";const s=a.get(e.activeTeamId)??r.name,n=Io(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${Q(s)}">
      <img
        class="race-sim-team-jersey-img"
        src="${Q(n)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function em(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function tm(e,t,a,r){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=r.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const s=e.splitTimes[t];return s!=null?Bt(s):"—"}function Co(e,t,a){const r=Mo(e,t),s=[{label:"Terrain / Skill",value:`${vo(e.activeTerrain)} / ${Du(e.skillName)}`},{label:"Aktiver Abschnitt",value:bo(e)},{label:"Segmenthöhe",value:Lu(e)},{label:"Basis",value:me(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${me(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:fa((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:fa((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:Yr((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:Yr((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:Yr((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:me(e.staminaPenalty)},{label:"HM",value:me(e.elevationPenalty)},{label:"T-Form",value:fa(e.dailyForm)},{label:"Zufall",value:Ju(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:qu(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?ho(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${Q(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${Q(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${s.map(n=>`<div class="race-sim-rider-detail-item"><span>${Q(n.label)}</span><strong>${Q(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${r.map(n=>Q(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${Q(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function am(e,t,a,r,s,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const c=document.createElement("div");c.className="race-sim-row-grid",o.appendChild(c);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",c.appendChild(l);const p=document.createElement("span");p.className="race-sim-row-flag",p.innerHTML=t?Vl(Au(t)):"—",c.appendChild(p);const m=document.createElement("span");m.className="race-sim-row-name",m.innerHTML=Ro(e,a),c.appendChild(m);const u=m.querySelector(".race-sim-row-name-btn");if(!u)throw new Error("race-sim-row-name-btn not found");const f=document.createElement("span");f.className="race-sim-row-team-visual",f.innerHTML=Qu(t,s,i),c.appendChild(f);const g=document.createElement("strong");g.className="race-sim-row-team",g.innerHTML=Xu(t,n,i),c.appendChild(g);const v=(A="")=>{const _=document.createElement("strong");return A&&(_.className=A),c.appendChild(_),_},h=v("race-sim-gap"),b=v("race-sim-cell-effective-skill"),$=v(),M=v(),T=v(),x=r.map(()=>v()),R=v(),w=v(),E=v("race-sim-form-state-cell"),F=document.createElement("div");return F.className="race-sim-row-detail-popover hidden",o.appendChild(F),{row:o,rankField:l,nameButton:u,gapField:h,clockField:T,splitFields:x,effectiveSkillField:b,gcRankField:$,gcGapField:M,gradientPercentField:R,speedField:w,formStateField:E,detailPanel:F,initialized:!1,lastValues:{}}}function rm(e,t,a,r,s,n,i,o,c,l,p){const m=(r==null?void 0:r.formBonus)??0,u=(r==null?void 0:r.raceFormBonus)??0,f=c&&l>1?p.get(a.riderId)??null:null,g=De(a),v=i!=="ITT"&&i!=="TTT"?g?"DNF":"—":a.hasStarted?g?"DNF":a.riderClockSeconds!=null?Bt(a.riderClockSeconds):"—":fo(a.startOffsetSeconds);Oa(e.row,`race-sim-row${t===1&&!g?" race-sim-row-leader":""}${s?" race-sim-row-detail-open":""}${g?" race-sim-row-dnf":""}`),ut(e.rankField,`${t}.`),ut(e.gapField,g?"DNF":go(a.gapToLeaderMeters)),ut(e.clockField,v),e.nameButton.setAttribute("aria-expanded",s?"true":"false"),Oa(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),Ka(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((M,T)=>{const x=e.splitFields[T];if(!x)return;const R=tm(a,M.key,i,o);ut(x,R),Ka(x,M.label)}),Wa(e,"effectiveSkillValue",a.effectiveSkill)&&(ut(e.effectiveSkillField,me(a.effectiveSkill)),ja(e,"effectiveSkillValue",a.effectiveSkill));const h=`race-sim-cell-effective-skill ${So(a)}`;Wa(e,"effectiveSkillClass",h)&&(Oa(e.effectiveSkillField,h),ja(e,"effectiveSkillClass",h));const b=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,m,u,a.dailyForm,a.microForm,(r==null?void 0:r.fatigueMalus)??0,(r==null?void 0:r.longTermFatigueMalus)??0,(r==null?void 0:r.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");Wa(e,"effectiveSkillTitleKey",b)&&(Ka(e.effectiveSkillField,Zu(a,r)),ja(e,"effectiveSkillTitleKey",b)),ut(e.gcRankField,f?String(f.rank):"—"),ut(e.gcGapField,f?ho(f.gapSeconds):"—"),ut(e.gradientPercentField,Nu(a.gradientPercent)),Oa(e.gradientPercentField,_u(a.gradientPercent)),Ka(e.gradientPercentField,`${vo(a.activeTerrain)} · ${bo(a)}`),ut(e.speedField,Ns(a.currentSpeedMps)),e.formStateField.innerHTML=em(a);const $=[s?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,m,u,(r==null?void 0:r.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(f==null?void 0:f.rank)??"—",(f==null?void 0:f.gapSeconds)??"—",a.skillBreakdown].join("|");Wa(e,"detailKey",$)&&(e.detailPanel.innerHTML=s?Co(a,r,f):"",e.detailPanel.classList.toggle("hidden",!s),ja(e,"detailKey",$)),e.detailPanel.classList.toggle("hidden",!s),e.initialized=!0}function sm(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${Q(e.name)}">${Q(e.name)}</button>`}function nm(e){const t=Io(e.id);return`
    <span class="race-sim-team-visual" title="${Q(e.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${Q(t)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function im(e,t,a){const r=new Map;for(const s of e.riders){const n=a.get(s.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=r.get(i)??[];o.push(s),r.set(i,o)}return t.teams.filter(s=>r.has(s.id)).map(s=>{const n=(r.get(s.id)??[]).slice().sort((p,m)=>m.effectiveSkill-p.effectiveSkill||p.riderId-m.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),c=n.slice(0,o).reduce((p,m)=>p+m.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:s,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,c-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(p=>p.isFinished).length}}).sort((s,n)=>wo(s.representative,n.representative,ko(t))||s.team.id-n.team.id)}function om(e,t,a,r,s){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${Q(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${Q(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${Q(me(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${Q(Ns(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${Q(e.teamClockSeconds!=null?Bt(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${Q(ls(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&r>1?t.gcByRiderId.get(n.riderId)??null:null,c=s===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${Ro(n,c)}
                <strong>${Q(me(n.effectiveSkill))}</strong>
                <span>${Q(n.riderClockSeconds!=null?Bt(n.riderClockSeconds):"—")}</span>
              </div>
              ${c?Co(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function lm(e,t,a){var f,g;const r=performance.now(),s=xo(a),n=s.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(v=>({label:v.key,displayLabel:v.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(f=it.get(e))==null?void 0:f.layoutKey,c=To(e,i),l=it.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==c&&(e.innerHTML="");const p=im(t,a,s.riderById),m=((g=p[0])==null?void 0:g.teamDistanceMeters)??0;return e.innerHTML=p.map((v,h)=>{const b=l.openTeamId===v.team.id;return`
      <article class="race-sim-row${h===0?" race-sim-row-leader":""}${b?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${h+1}.</strong>
          <span class="race-sim-row-name">${sm(v.team,b)}</span>
          <span class="race-sim-row-team-visual">${nm(v.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${Q(v.team.name)}">${Q(v.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${Q(go(Math.max(0,m-v.teamDistanceMeters)))}</strong>
          <strong>${Q(v.teamClockSeconds!=null?Bt(v.teamClockSeconds):fo(v.representative.startOffsetSeconds))}</strong>
          ${n.map($=>`<strong>${Q(v.splitTimes[$.key]!=null?Bt(v.splitTimes[$.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${So(v.representative)}">${Q(me(v.teamEffectiveSkill))}</strong>
          <strong>${Q(Ns(v.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${b?"":" hidden"}">${b?om(v,s,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),it.set(e,{layoutKey:c,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-r,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:p.length,rowsCreated:p.length,rowsRemoved:0,rowsUpdated:p.length,rowsSkippedInvisible:0,orderChanged:1}}function qn(e,t,a){if(a.stage.profile==="TTT")return lm(e,t,a);const r=performance.now(),s={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=xo(a),{splitMarkers:o}=i,c=Bu(t),l=Ls(e),p=l.showSplitColumns?o:[],m=it.get(e);s.prepMs=performance.now()-n;const u=performance.now(),f=Vu(t.riders,a,o,c,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(m==null?void 0:m.orderedRiderIds)??[]);s.sortMs=performance.now()-u;const g=m==null?void 0:m.layoutKey,v=performance.now(),h=To(e,$o(a,p,l.showSplitColumns));s.layoutMs=performance.now()-v;const b=it.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};g!=null&&g!==h&&(e.innerHTML="",b.rowsByRiderId.clear(),b.orderedRiderIds=[]);const $=f.map(F=>F.riderId),M=new Set($),T=performance.now();for(const[F,A]of b.rowsByRiderId)M.has(F)||(A.row.remove(),b.rowsByRiderId.delete(F),s.rowsRemoved+=1);s.removeRowsMs=performance.now()-T;const x=performance.now();for(let F=0;F<f.length;F+=1){const A=f[F],_=i.riderById.get(A.riderId)??null;let z=b.rowsByRiderId.get(A.riderId);z||(z=am(A,_,b.openDetailRiderId===A.riderId,p,i.teamById,i.teamAbbreviationById,i.teamNameById),b.rowsByRiderId.set(A.riderId,z),s.rowsCreated+=1)}s.createRowsMs=performance.now()-x;const R=performance.now(),w=b.orderedRiderIds.length===$.length&&b.orderedRiderIds.every((F,A)=>F===$[A]);s.orderCheckMs=performance.now()-R;const E=performance.now();if(!w){const F=document.createDocumentFragment();for(const A of $){const _=b.rowsByRiderId.get(A);_&&F.appendChild(_.row)}e.replaceChildren(F),s.orderChanged=1}s.reorderMs=performance.now()-E;for(let F=0;F<f.length;F+=1){const A=f[F],_=b.rowsByRiderId.get(A.riderId),z=i.riderById.get(A.riderId)??null;if(!_)continue;const O=performance.now();rm(_,F+1,A,z,b.openDetailRiderId===A.riderId,p,a.stage.profile,c,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),s.updateRowsMs+=performance.now()-O,s.rowsUpdated+=1}return it.set(e,{layoutKey:h,orderedRiderIds:$,rowsByRiderId:b.rowsByRiderId,openDetailRiderId:b.openDetailRiderId,openTeamId:b.openTeamId}),s.finalizeMs=performance.now()-(r+s.prepMs+s.sortMs+s.layoutMs+s.removeRowsMs+s.createRowsMs+s.orderCheckMs+s.reorderMs+s.visibilityMs+s.updateRowsMs),s.totalMs=performance.now()-r,s.finalizeMs=Math.max(0,s.totalMs-s.prepMs-s.sortMs-s.layoutMs-s.removeRowsMs-s.createRowsMs-s.orderCheckMs-s.reorderMs-s.visibilityMs-s.updateRowsMs),s}const dm=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],cm=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],Eo=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],Fo=["Sprint","4","3","2","1","HC"],br=.2,um=7,mm=100,pm=3,gm=50,fm=-2,hm=1,bm=2.5,ym=-3,vm=15,Sm=200,km=600,$m=850;function Ge(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function yr(e){return e==="finish_hill"||e==="finish_mountain"}function vr(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function Pr(e,t){return e==="climb_top"||yr(e)&&vr(t)}function Ca(e){return Math.round(e*10)/10}function Ke(e){return Number(e.toFixed(2))}function Dt(e){return`${e.toFixed(2).replace(".",",")} km`}function Po(e){return`${Math.round(e)} hm`}function xm(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function Ds(e){return dm.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function Tm(e){return cm.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function wm(e,t="start",a=0,r=1){const s=Eo.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:Ge(i)?a===r-1:i==="climb_top"||i==="sprint_intermediate");return(s.includes(e)?s:[e,...s.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${S(i)}</option>`).join("")}function Mm(e){return['<option value="">–</option>',...Fo.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`)].join("")}function Xn(e){return Eo.indexOf(e)}function et(e){return[...e].sort((t,a)=>Xn(t.type)-Xn(a.type))}function $a(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:et(e[0].markers)}];let a=0;return e.forEach(r=>{a=Ke(a+r.lengthKm);const s=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),n=t[t.length-1];n.terrain=r.terrain,n.techLevel=r.techLevel,n.windExp=r.windExp,n.markers=et([...n.markers,...r.markers]),t.push({kmMark:a,elevation:s,terrain:r.terrain,techLevel:r.techLevel,windExp:r.windExp,markers:et(r.endMarkers)})}),t}function Rm(e){return e?" stage-editor-input-invalid":""}function _s(e,t){const a=e.segments[t];if(!a)return[];const r=[],s=Im(e).get(t)??[];return a.lengthKm<br&&r.push(`Laenge unter ${br.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&r.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&r.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&r.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>Ge(n.type))&&r.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&r.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>Ge(n.type))&&r.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{Ge(n.type)&&r.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&r.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&r.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&r.push(`${n.type} gehoert in den Startmarker-Slot.`),Pr(n.type,n.cat)&&!vr(n.cat)&&r.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&r.push("Sprintmarker erlaubt nur Kategorie Sprint."),Ge(n.type)&&!yr(n.type)&&n.cat!=null&&r.push("finish_flat und finish_TT duerfen keine Kategorie haben."),yr(n.type)&&n.cat!=null&&!vr(n.cat)&&r.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),r.push(...s),[...new Set(r)]}function Im(e){const t=new Map,a=[],r=(s,n)=>{const i=t.get(s)??[];i.push(n),t.set(s,i)};return e.segments.forEach((s,n)=>{s.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),s.endMarkers.forEach(i=>{var l;if(!Pr(i.type,i.cat))return;if(!i.name){r(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let p=a.length-1;p>=0;p-=1)if(((l=a[p])==null?void 0:l.name)===i.name){o=p;break}const c=o>=0?o:a.length-1;if(c<0){r(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(c,1)})}),a.forEach(s=>{const n=s.name?` "${s.name}"`:"";r(s.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function Cm(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:yr(e.type)?{...e,cat:vr(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function No(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:Em(e.waypoints??[])).map(r=>({...r,startElevation:Math.round(r.startElevation),lengthKm:Number.isFinite(r.lengthKm)?Ke(r.lengthKm):br,gradientPercent:Number.isFinite(r.gradientPercent)?Ca(r.gradientPercent):0,techLevel:Number.isFinite(r.techLevel)?r.techLevel:5,windExp:Number.isFinite(r.windExp)?r.windExp:5,markers:Qn(r.markers),endMarkers:Qn(r.endMarkers)})),waypoints:[]};return Et(t),t}function Em(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const r=e[a],s=e[a+1],n=Ke(s.kmMark-r.kmMark),i=s.elevation-r.elevation,o=Ca(n>0?i/(n*10):0);t.push({startElevation:r.elevation,lengthKm:n,gradientPercent:o,techLevel:r.techLevel??5,windExp:r.windExp??5,terrain:r.terrain??"Flat",markers:r.markers??[],endMarkers:s.markers??[]})}return t}function Qn(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function Fm(e,t,a){const r=e*a*8+t/12;return r>=95?"HC":r>=68?"1":r>=46?"2":r>=28?"3":"4"}function ei(e){const t=[];let a=null,r=null,s=0;const n=i=>{if(a==null||i==null||i<=a){a=null,r=null,s=0;return}const o=e[a],c=e[i],l=c.kmMark-o.kmMark,p=Math.max(0,c.elevation-o.elevation),m=l>0?p/(l*10):0;p>=mm&&m>=pm&&t.push({startKm:Ke(o.kmMark),endKm:Ke(c.kmMark),distanceKm:Ke(l),gainMeters:Math.round(p),avgGradient:Ca(m),category:Fm(l,p,m),startIndex:a,topIndex:i,topElevation:Math.round(c.elevation)}),a=null,r=null,s=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],c=e[i],l=c.elevation-o.elevation;if(a==null&&l>0){a=i-1,r=i,s=0;continue}if(a!=null){if(l>=0){(r==null||c.elevation>=e[r].elevation)&&(r=i),s=0;continue}s+=Math.abs(l),s>=gm&&n(r)}}return n(r),t}function Pm(e){const t=e.segments.some(s=>s.terrain==="Cobble_Hill"),a=e.segments.some(s=>s.terrain==="Cobble"),r=e.climbs.some(s=>s.category==="HC"||s.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":r&&e.elevationGainMeters>=2800?"High_Mountain":r||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function Va(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function Nm(e){return e.gainMeters>=km&&e.topElevation>=$m?"Mountain":e.gainMeters>Sm?"Medium_Mountain":"Hill"}function Lm(e){return e.gradientPercent<ym?"Abfahrt":e.gradientPercent<bm||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<vm?"Flat":"Hill"}function Dm(e){if(e.segments.length===0)return;if(e.waypoints=$a(e.segments),e.sourceFormat==="csv"){const i=ei(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:c,topElevation:l,...p})=>p);return}const t=e.segments.map(i=>i.manualTerrain||Va(i.terrain)?i.terrain:Lm(i)),a=ei(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:c,...l})=>l),a.forEach(i=>{const o=Nm(i);if(o)for(let c=i.startIndex;c<i.topIndex;c+=1)e.segments[c].manualTerrain||Va(t[c])||(t[c]=o)});let r=null,s=0;const n=i=>{if(r==null||s<=hm){r=null,s=0;return}for(let o=r;o<i;o+=1)!(e.segments[o].manualTerrain||Va(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");r=null,s=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<fm){r==null&&(r=i),s+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{Va(i.terrain)||(i.terrain=t[o])}),e.waypoints=$a(e.segments),e.suggestedProfile=Pm(e)}function Et(e){_m(e),ti(e),Dm(e),e.waypoints=$a(e.segments),ti(e)}function _m(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,r)=>{const s={...a,startElevation:Math.round(r===0?a.startElevation:t),lengthKm:Ke(a.lengthKm),gradientPercent:Ca(a.gradientPercent),markers:et(a.markers),endMarkers:et(a.endMarkers)};return t=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),s}),e.waypoints=$a(e.segments)}function ti(e){e.totalDistanceKm=Ke(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,r)=>{if(r===0)return 0;const s=a.elevation-e.waypoints[r-1].elevation;return t+Math.max(0,s)},0)}function yt(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(r=>r.type==="start")||(t.markers=et([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(r=>Ge(r.type))||(a.endMarkers=et([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=$a(e.segments))}function Am(e,t,a,r){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((s,n)=>{const i=r==="start"&&t===0&&s.type==="start",o=e.filter(p=>Ge(p.type)).length,c=r==="end"&&t===a-1&&Ge(s.type)&&o===1,l=!(i||c);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${r}" data-marker-index="${n}">${wm(s.type,r,t,a)}</select>
        <input type="text" value="${S(s.name??"")}" data-field="markerName" data-marker-scope="${r}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${r}" data-marker-index="${n}">${Mm(s.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${r}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function ai(e,t,a,r){const s=r==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${Am(e,t,a,r)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${r}" data-segment-index="${t}">${s}</button>
    </div>`}function Bm(e,t,a,r,s){if(!d.stageEditorDraft)return;const n=d.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(r==="markerType"){o.type=s;const c=Cm(o);if(o.name=c.name,o.cat=c.cat,Ge(o.type)){const l=i.filter((p,m)=>m===t||!Ge(p.type));a==="start"?n.markers=l:n.endMarkers=l}}else r==="markerName"?o.name=s.trim()||null:r==="markerCat"&&(o.cat=s||null);a==="start"?n.markers=et(n.markers):n.endMarkers=et(n.endMarkers),Et(d.stageEditorDraft),yt(d.stageEditorDraft),pe()}}function Hm(e,t){if(!d.stageEditorDraft)return;const a=d.stageEditorDraft.segments[e];if(!a)return;const r=t==="start"?e===0&&!a.markers.some(s=>s.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===d.stageEditorDraft.segments.length-1&&!a.endMarkers.some(s=>Ge(s.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(r),a.markers=et(a.markers)):(a.endMarkers.push(r),a.endMarkers=et(a.endMarkers)),Et(d.stageEditorDraft),yt(d.stageEditorDraft),pe()}function zm(e,t,a){if(!d.stageEditorDraft)return;const r=d.stageEditorDraft.segments[e];r&&(a==="start"?r.markers.splice(t,1):r.endMarkers.splice(t,1),Et(d.stageEditorDraft),yt(d.stageEditorDraft),pe())}let qt=0,Xt=0;async function Gm(){y("stage-editor-profile").innerHTML=Ds("Flat"),y("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',y("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([V.listStageEditorCountries(),V.listStageEditorRaceCategories(),V.listStageEditorRacePrograms()]);if(e.success&&e.data){const r=y("stage-editor-race-country");r.innerHTML=e.data.map(s=>`<option value="${s.id}">${S(s.name)} (${S(s.code3)})</option>`).join("")}if(t.success&&t.data){const r=y("stage-editor-race-category");r.innerHTML=t.data.map(s=>`<option value="${s.id}">${S(s.name)}</option>`).join("")}a.success&&a.data&&(d.stageEditorPrograms=a.data,Km())}function Km(){const e=y("stage-editor-programs-list");d.stageEditorPrograms&&(e.innerHTML=d.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${S(t.name)}</span>
      </label>
    `).join(""))}function Om(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=y("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(r=>{var n;const s=(n=d.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===r.value);return s?s.name:r.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function As(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function Lo(){const e=d.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function Wm(){const e=[...d.stageEditorExistingStages.map(t=>t.raceId),...d.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function jm(e,t){let a=e;const r=new Set(d.stageEditorExistingStages.map(s=>s.stageId));for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function Vm(e,t){let a=e;const r=new Set([...d.stageEditorExistingStages.map(s=>s.raceId),...d.races.map(s=>s.id)]);for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function Um(e){var o;const t=y("stage-editor-profile");t.innerHTML=Ds(e.suggestedProfile),t.value=e.suggestedProfile;const a=Lo(),r=Wm();y("stage-editor-stage-id").value=String(a),y("stage-editor-race-id").value=String(r),qt=a,Xt=r;const s=y("stage-editor-details-file");s.value.trim()||(s.value=`${xm(e.routeName)}.csv`);const n=y("stage-editor-date");!n.value&&((o=d.gameState)!=null&&o.currentDate)&&(n.value=d.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(c=>{c.checked=!0})}function Ym(e){y("stage-editor-stage-id").value=String(e.stageId),y("stage-editor-race-id").value=String(e.raceId),qt=e.stageId,Xt=e.raceId,y("stage-editor-stage-number").value=String(e.stageNumber),y("stage-editor-date").value=e.date,y("stage-editor-details-file").value=e.detailsCsvFile;const t=y("stage-editor-profile");t.innerHTML=Ds(e.profile),t.value=e.profile,y("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),y("stage-editor-final-push-start").value=String(e.finalPushStartPercent),y("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),y("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),y("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(s=>s.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(s=>{s.checked=a.includes(s.value)})}function Do(e){var r;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((r=e.segments[0])!=null&&r.markers.some(s=>s.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(s=>Ge(s.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((s,n)=>{_s(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...s.markers??[],...s.endMarkers??[]].forEach(i=>{i.cat!=null&&!Fo.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function _o(){const e=[],t=Number(y("stage-editor-stage-id").value),a=Number(y("stage-editor-race-id").value),r=Number(y("stage-editor-stage-number").value),s=y("stage-editor-date").value.trim(),n=y("stage-editor-details-file").value.trim(),i=Number(y("stage-editor-final-spread-start").value),o=Number(y("stage-editor-final-push-start").value),c=Number(y("stage-editor-final-spread-difficulty").value),l=Number(y("stage-editor-crash-multiplier").value),p=Number(y("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(r)||r<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(s)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(c)||c<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(p)||p<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),d.stageEditorExistingStages.map(h=>h.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const f=y("stage-editor-new-race-checkbox").checked,g=[...d.stageEditorExistingStages.map(h=>h.raceId),...d.races.map(h=>h.id)];if(f){g.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const h=y("stage-editor-race-name").value.trim(),b=Number(y("stage-editor-race-country").value),$=Number(y("stage-editor-race-category").value),M=Number(y("stage-editor-race-num-stages").value),T=y("stage-editor-race-start-date").value.trim(),x=y("stage-editor-race-end-date").value.trim(),R=Number(y("stage-editor-race-prestige").value);h||e.push("Rennname fehlt."),(!Number.isInteger(b)||b<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger($)||$<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(M)||M<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(T)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test(x)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(R)||R<1||R>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else g.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return y("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function Zm(){var a,r;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(s=>s.value).join("|");return{stageId:Number(y("stage-editor-stage-id").value),raceId:Number(y("stage-editor-race-id").value),stageNumber:Number(y("stage-editor-stage-number").value),date:y("stage-editor-date").value.trim(),profile:y("stage-editor-profile").value,detailsCsvFile:y("stage-editor-details-file").value.trim(),startElevation:((r=(a=d.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:r.startElevation)??0,finalSpreadStartPercent:Number(y("stage-editor-final-spread-start").value),finalPushStartPercent:Number(y("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(y("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(y("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(y("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function Jm(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function qm(e){return["gainMeters","elevationAtTop","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function Nr(e,t,a){const s=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-s*118),i=54,o=.14+s*.12,c=.26+s*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${c};`}">${Math.round(e)}</span>`}function Bs(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),r=Math.round(40-t*22),s=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${s};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function Xm(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function Qm(e,t,a,r){const s=r!=null?` data-stage-profile-open-climb-id="${S(r)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${s}>${e}</button>`}function ep(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",r=e.profileScore??e.score,s=[...d.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=s.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span class="text-right">${Bs(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${Nr(r,0,100)}
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
    </div>`}function tp(e){const t=s=>s!=null?`${s.toFixed(1).replace(".",",")} km`:"—",a=s=>s!=null?`${Math.round(s).toLocaleString("de-DE")} m`:"—",r=s=>s!=null?`${s.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${Bs(e.climbScore??0)}
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
    </div>`}function Ao(e,t,a,r,s,n,i,o){const c=o??Nr(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${Qm(c,r,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${s}
      </div>
    </div>`}function ce(e,t,a,r,s){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?r==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${s}-sort="${t}">
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function ca(){const e=y("stage-editor-stages-table"),t=y("stage-editor-stages-empty"),a=y("stage-editor-stages-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=d.stageEditorStagesSort.key,i=d.stageEditorStagesSort.direction;r&&(r.innerHTML=`<tr>
      ${ce("ID","stageId",n,i,"stages")}
      ${ce("Land","countryCode",n,i,"stages")}
      ${ce("Rennen","raceName",n,i,"stages")}
      ${ce("Etappe","stageNumber",n,i,"stages")}
      ${ce("Score","profileScore",n,i,"stages")}
      ${ce("Profil","profile",n,i,"stages")}
      ${ce("Distanz","distanceKm",n,i,"stages")}
      ${ce("Höhenmeter","elevationGainMeters",n,i,"stages")}
      ${ce("Sprints","sprintCount",n,i,"stages")}
      ${ce("Climbs","climbCount",n,i,"stages")}
    </tr>`);const o=rp(d.stageEditorStageRows);s.innerHTML=o.map(c=>`
    <tr>
      <td>${c.stageId}</td>
      <td>${oe(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(Fa({stageNumber:c.stageNumber}))}</strong></td>
      <td>${Ao(c.profileScore,0,100,c.stageId,ep(c),Ar({name:c.raceName},{stageNumber:c.stageNumber,profile:c.profile}))}</td>
      <td>${Pa(c.profile)}</td>
      <td>${Dt(c.distanceKm)}</td>
      <td>${Po(c.elevationGainMeters)}</td>
      <td>${c.sprintCount} Sprints</td>
      <td>${c.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${d.stageEditorStageRows.length} vorhandene Etappen`}function ua(){const e=y("stage-editor-climbs-table"),t=y("stage-editor-climbs-empty"),a=y("stage-editor-climbs-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=d.stageEditorClimbsSort.key,i=d.stageEditorClimbsSort.direction;r&&(r.innerHTML=`<tr>
      ${ce("km","placementKm",n,i,"climbs")}
      ${ce("Name","name",n,i,"climbs")}
      ${ce("Kat.","category",n,i,"climbs")}
      ${ce("Score","climbScore",n,i,"climbs")}
      ${ce("Land","countryCode",n,i,"climbs")}
      ${ce("Rennen","raceName",n,i,"climbs")}
      ${ce("Etappe","stageNumber",n,i,"climbs")}
      ${ce("Höhenmeter","gainMeters",n,i,"climbs")}
      ${ce("Höhe (Top)","elevationAtTop",n,i,"climbs")}
      ${ce("Distanz","distanceKm",n,i,"climbs")}
      ${ce("Ø Steigung","avgGradient",n,i,"climbs")}
      ${ce("Max Steigung","maxGradient",n,i,"climbs")}
    </tr>`);const o=sp(d.stageEditorClimbRows);s.innerHTML=o.map(c=>`
    <tr>
      <td>${c.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${S(c.name)}</strong></td>
      <td>${Xm(c.category)}</td>
      <td>${Ao(c.climbScore,0,350,c.stageId,tp(c),Ar({name:c.raceName},{stageNumber:c.stageNumber,profile:"Mountain"}),c.id,Bs(c.climbScore))}</td>
      <td>${oe(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(Fa({stageNumber:c.stageNumber}))}</strong></td>
      <td>${Po(c.gainMeters)}</td>
      <td>${Math.round(c.elevationAtTop).toLocaleString("de-DE")} m</td>
      <td>${Dt(c.distanceKm)}</td>
      <td>${c.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${c.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${d.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function Bo(e=!1){if(d.stageEditorOverviewLoaded&&!e){ca(),ua();return}d.stageEditorOverviewLoading=!0,ca(),ua();const t=await V.getStageEditorOverview();if(d.stageEditorOverviewLoading=!1,d.stageEditorOverviewLoaded=!0,!t.success||!t.data){d.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),ca(),ua();return}d.stageEditorStageRows=t.data.stages,d.stageEditorClimbRows=t.data.climbs,ca(),ua()}async function ap(e=!1){const t=y("stage-editor-existing-stage-wrap");if(d.stageEditorExistingStagesLoaded&&!e){ds();return}t.classList.add("loading");const a=y("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const r=await V.listStageEditorStages();if(t.classList.remove("loading"),d.stageEditorExistingStagesLoaded=!0,!r.success||!r.data){d.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}d.stageEditorExistingStages=r.data.stages,ds()}function ds(){const e=y("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+d.stageEditorExistingStages.map(a=>{const r=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${S(a.raceName)} · Etappe ${a.stageNumber}${r}</option>`}).join("")}function rp(e){const t=d.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(d.stageEditorStagesSort.key){case"stageId":s=a.stageId-r.stageId;break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"profile":s=a.profile.localeCompare(r.profile,"de");break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"elevationGainMeters":s=a.elevationGainMeters-r.elevationGainMeters;break;case"sprintCount":s=a.sprintCount-r.sprintCount;break;case"climbCount":s=a.climbCount-r.climbCount;break;case"profileScore":s=a.profileScore-r.profileScore;break}return s*t||a.stageId-r.stageId})}function sp(e){const t=d.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(d.stageEditorClimbsSort.key){case"placementKm":s=a.placementKm-r.placementKm;break;case"name":s=a.name.localeCompare(r.name,"de");break;case"category":s=(a.category??"").localeCompare(r.category??"","de");break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"gainMeters":s=a.gainMeters-r.gainMeters;break;case"elevationAtTop":s=a.elevationAtTop-r.elevationAtTop;break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"avgGradient":s=a.avgGradient-r.avgGradient;break;case"maxGradient":s=a.maxGradient-r.maxGradient;break;case"climbScore":s=a.climbScore-r.climbScore;break}return s*t||a.placementKm-r.placementKm})}function np(e){return e.map(t=>t.type).join(" | ")}function ip(e){const t=[],a=[];let r=0;return e.segments.forEach((s,n)=>{const i=r,o=Ke(i+s.lengthKm),c=As(s);s.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:s.startElevation})}),s.endMarkers.forEach(l=>{if(Pr(l.type,l.cat)&&l.name){let p=-1;for(let m=a.length-1;m>=0;m--)if(a[m].name===l.name){p=m;break}if(p>=0){const m=a[p];a.splice(p,1);const u=Ke(o-m.startKm),f=Math.max(0,c-m.startElevation),g=u>0?Ca(f/(u*10)):0;t.push({name:l.name,startKm:m.startKm,endKm:o,distanceKm:u,gainMeters:f,avgGradient:g,category:l.cat||"4"})}}}),r=o}),t}function op(e){const t=[];let a=0;return e.segments.forEach(r=>{const s=Ke(a+r.lengthKm);r.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:s})}),a=s}),t}function lp(e){const t=new Set,a=[];let r=0;return e.segments.forEach((s,n)=>{const o=Ke(r+s.lengthKm);s.markers.forEach(c=>{c.type==="climb_start"&&c.name&&a.push({name:c.name,segmentIndex:n})}),a.length>0&&t.add(n),s.endMarkers.forEach(c=>{if(Pr(c.type,c.cat)&&c.name){let l=-1;for(let p=a.length-1;p>=0;p--)if(a[p].name===c.name){l=p;break}l>=0&&a.splice(l,1)}}),r=o}),t}function dp(e,t,a){const r=e.segments[t];if(!r||a.has(t)||r.markers.length>0||r.endMarkers.length>0)return!1;const s=r.terrain==="Flat"&&r.gradientPercent>=-3&&r.gradientPercent<=1.5,n=r.terrain==="Abfahrt"&&r.gradientPercent<=-3;return s||n}function pe(){ds();const e=d.stageEditorDraft,t=y("stage-editor-import-summary"),a=y("stage-editor-warnings"),r=y("stage-editor-climbs"),s=y("stage-editor-empty"),n=y("stage-editor-chart"),i=y("stage-editor-waypoints-body"),o=y("stage-editor-export-hint"),c=y("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",r.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',s.classList.remove("hidden"),n.innerHTML=ri(null),i.innerHTML=`<tr><td colspan="${um}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",c.disabled=!0;return}s.classList.add("hidden");const l=Do(e),p=_o(),m=document.getElementById("stage-editor-profile"),u=m&&m.value?m.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${S(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${Dt(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${S(u)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const f=[...e.warnings,...l,...p];a.innerHTML=f.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':f.map(M=>`<div class="stage-editor-alert">${S(M)}</div>`).join("");const g=ip(e),v=op(e);let h="";g.length>0?h+=`
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
              <span>${Dt(M.startKm)} - ${Dt(M.endKm)}</span>
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
    `:h+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Bergwertungen definiert (climb_start und climb_top Marker mit gleichem Namen paaren).</p>
    `,v.length>0?h+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (${v.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${v.map(M=>`
          <div class="stage-editor-sprint" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--success); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.85rem;">${S(M.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-300); font-weight: bold;">
              ${Dt(M.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:h+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `;const b=y("stage-editor-hide-boring-segments-checkbox");b&&(b.checked=d.stageEditorHideBoringSegments),r.innerHTML=h,n.innerHTML=ri(e);const $=lp(e);i.innerHTML=e.segments.map((M,T)=>{const x=d.stageEditorHideBoringSegments&&dp(e,T,$);return`
    <tr data-segment-index="${T}" class="${_s(e,T).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;${x?" display: none;":""}">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${T+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${M.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${Rm(M.lengthKm<br)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${M.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${Tm(M.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${ai(M.markers,T,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${ai(M.endMarkers,T,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div class="text-muted" style="min-width:3.5rem;">${As(M)} m</div>
          ${cp(e,T)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${T}">+</button>
          ${T===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${T}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${T}">✕</button>`:""}
        </div>
      </td>
    </tr>`}).join(""),c.disabled=f.length>0,o.textContent=f.length>0?`${f.length} Validierungshinweise vor dem Export.`:`Exportiert ${y("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function cp(e,t){const a=_s(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(r=>`<div>${S(r)}</div>`).join("")}</div>`}function ri(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,r=24,s=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(g=>g.elevation)),c=Math.max(...n.map(g=>g.elevation)),l=Math.max(1,c-o),p=n.map(g=>{const v=r+g.kmMark/Math.max(i,.1)*(t-r*2),h=a-s-(g.elevation-o)/l*(a-s*2);return{x:v,y:h,waypoint:g}}),m=p.map((g,v)=>`${v===0?"M":"L"} ${g.x.toFixed(1)} ${g.y.toFixed(1)}`).join(" "),u=`${m} L ${(t-r).toFixed(1)} ${(a-s).toFixed(1)} L ${r.toFixed(1)} ${(a-s).toFixed(1)} Z`,f=p.filter(g=>g.waypoint.markers.length>0).map(g=>`
      <line x1="${g.x.toFixed(1)}" y1="${s}" x2="${g.x.toFixed(1)}" y2="${(a-s).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${g.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${S(np(g.waypoint.markers))}</text>`).join("");return`
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
      <path d="${u}" fill="url(#stage-editor-area)"></path>
      <path d="${m}" class="stage-editor-chart-line"></path>
      ${p.map(g=>`<circle cx="${g.x.toFixed(1)}" cy="${g.y.toFixed(1)}" r="3.5" class="stage-editor-chart-point"></circle>`).join("")}
      <text x="${r}" y="${s-4}" class="stage-editor-chart-scale">${Math.round(c)} m</text>
      <text x="${r}" y="${a-4}" class="stage-editor-chart-scale">${Math.round(o)} m</text>
      <text x="${t-r}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${Dt(i)}</text>
    </svg>`}function up(e,t,a){const r=d.stageEditorDraft;if(!r)return;const s=r.segments[e];s&&(t==="startElevation"?s.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?s.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?s.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(s.terrain=a,s.manualTerrain=!0):t==="techLevel"?s.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(s.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),Et(r),yt(r),pe())}function mp(e){const t=d.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const r={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,r),Et(t),yt(t),pe()}function pp(){const e=d.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],r={startElevation:t?As(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(r),Et(e),yt(e),pe()}function gp(e){const t=d.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),Et(t),yt(t),pe()))}async function fp(){var a;const t=(a=y("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}y("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,xe("Route wird importiert……");try{const r=await t.text(),s=await V.importStageRoute({fileName:t.name,fileContent:r});if(!s.success||!s.data){alert(`Import fehlgeschlagen: ${s.error??"Unbekannter Fehler"}`);return}const n=No(s.data);d.stageEditorDraft=n,yt(n),Um(n),pe(),It("stage-editor")}finally{ye()}}async function hp(){const e=Number(y("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}xe("CSV-Stage wird geladen...");try{const t=await V.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=No(t.data.draft);d.stageEditorDraft=a,yt(a),Ym(t.data.metadata),pe(),It("stage-editor")}finally{ye()}}async function bp(){if(!d.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...Do(d.stageEditorDraft),..._o()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),pe();return}const t=y("stage-editor-new-race-checkbox").checked,a=y("stage-editor-program-checkbox").checked;let r;t&&(r={name:y("stage-editor-race-name").value.trim(),countryId:Number(y("stage-editor-race-country").value),categoryId:Number(y("stage-editor-race-category").value),isStageRace:Number(y("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(y("stage-editor-race-num-stages").value),startDate:y("stage-editor-race-start-date").value.trim(),endDate:y("stage-editor-race-end-date").value.trim(),prestige:Number(y("stage-editor-race-prestige").value)});let s;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');s=Array.from(n).map(i=>Number(i.value))}xe("CSV-Dateien werden erstellt……");try{const n=await V.exportStageRoute({metadata:Zm(),draft:d.stageEditorDraft,newRace:t,raceDetails:r,updatePrograms:a,programIds:s});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}cr(n.data.stagesFileName,n.data.stagesCsv),cr(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=y("stage-editor-stage-number"),o=Number(i.value)||1;i.value=String(o+1);const c=y("stage-editor-date"),l=c.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(l)){const h=new Date(l);h.setDate(h.getDate()+1);const b=h.getFullYear(),$=String(h.getMonth()+1).padStart(2,"0"),M=String(h.getDate()).padStart(2,"0");c.value=`${b}-${$}-${M}`}await Promise.all([Bo(!0),ap(!0)]);const p=Lo();y("stage-editor-stage-id").value=String(p),qt=p;const m=y("stage-editor-new-race-checkbox");m&&(m.checked=!1);const u=y("stage-editor-new-race-details");u&&(u.classList.add("hidden"),u.style.display="none");const f=y("stage-editor-program-checkbox");f&&(f.checked=!1);const g=y("stage-editor-program-details");g&&(g.classList.add("hidden"),g.style.display="none"),Xt=Number(y("stage-editor-race-id").value),pe()}finally{ye()}}function yp(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",x=>{const R=x.target.closest("button[data-stage-profile-open-stage-id]");if(R){const F=Number(R.dataset.stageProfileOpenStageId);Number.isFinite(F)&&xr(F);return}const w=x.target.closest("button[data-stage-editor-stages-sort]");if(!w)return;const E=w.dataset.stageEditorStagesSort;d.stageEditorStagesSort.key===E?d.stageEditorStagesSort.direction=d.stageEditorStagesSort.direction==="asc"?"desc":"asc":d.stageEditorStagesSort={key:E,direction:Jm(E)},ca()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",x=>{const R=x.target.closest("button[data-stage-profile-open-stage-id]");if(R){const F=Number(R.dataset.stageProfileOpenStageId),A=R.dataset.stageProfileOpenClimbId??null;if(Number.isFinite(F)){let _=null;A&&d.stageEditorClimbRows&&(_=d.stageEditorClimbRows.find(z=>z.id===A)??null),xr(F,_)}return}const w=x.target.closest("button[data-stage-editor-climbs-sort]");if(!w)return;const E=w.dataset.stageEditorClimbsSort;d.stageEditorClimbsSort.key===E?d.stageEditorClimbsSort.direction=d.stageEditorClimbsSort.direction==="asc"?"desc":"asc":d.stageEditorClimbsSort={key:E,direction:qm(E)},ua()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{fp()});const r=document.getElementById("btn-stage-editor-load-existing");r&&r.addEventListener("click",()=>{hp()});const s=document.getElementById("btn-stage-editor-export");s&&s.addEventListener("click",()=>{bp()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",x=>{var w;const R=((w=x.target.files)==null?void 0:w[0])??null;y("stage-editor-file-hint").textContent=R?`${R.name} · ${(R.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",x=>{const R=x.target,w=R.closest("tr[data-segment-index]"),E=R.dataset.field;if(!w||!E)return;const F=Number(w.dataset.segmentIndex);if(Number.isInteger(F)){if(E==="markerType"||E==="markerName"||E==="markerCat"){const A=Number(R.dataset.markerIndex),_=R.dataset.markerScope;if(!Number.isInteger(A)||_!=="start"&&_!=="end")return;Bm(F,A,_,E,R.value);return}up(F,E,R.value)}}),i.addEventListener("click",x=>{const R=x.target.closest("button[data-segment-action]");if(!R)return;const w=Number(R.dataset.segmentIndex);if(Number.isInteger(w)){if(R.dataset.segmentAction==="insert"){mp(w);return}if(R.dataset.segmentAction==="append"){pp();return}if(R.dataset.segmentAction==="add-marker"){const E=R.dataset.markerScope;if(E!=="start"&&E!=="end")return;Hm(w,E);return}if(R.dataset.segmentAction==="remove-marker"){const E=Number(R.dataset.markerIndex),F=R.dataset.markerScope;if(!Number.isInteger(E)||F!=="start"&&F!=="end")return;zm(w,E,F);return}R.dataset.segmentAction==="delete"&&gp(w)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(x=>{const R=document.getElementById(x);R&&R.addEventListener("change",()=>pe())}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(x=>{x.addEventListener("change",()=>pe())});const c=y("stage-editor-new-race-checkbox"),l=y("stage-editor-new-race-details"),p=y("stage-editor-program-checkbox"),m=y("stage-editor-program-details");c&&c.addEventListener("change",()=>{c.checked?(l&&(l.classList.remove("hidden"),l.style.display="grid"),p&&(p.checked=!0,m&&(m.classList.remove("hidden"),m.style.display="block"))):l&&(l.classList.add("hidden"),l.style.display="none"),pe()}),p&&p.addEventListener("change",()=>{p.checked?m&&(m.classList.remove("hidden"),m.style.display="block"):m&&(m.classList.add("hidden"),m.style.display="none"),pe()});const u=y("stage-editor-programs-dropdown-trigger"),f=y("stage-editor-programs-dropdown-menu"),g=y("btn-stage-editor-programs-ok");u&&f&&(u.addEventListener("click",x=>{x.stopPropagation();const R=f.style.display==="none"||!f.style.display;f.style.display=R?"flex":"none"}),g&&g.addEventListener("click",x=>{x.stopPropagation(),f.style.display="none",pe()}),document.addEventListener("click",x=>{const R=x.target;f.style.display==="flex"&&!f.contains(R)&&R!==u&&!u.contains(R)&&(f.style.display="none",pe())}));const v=y("stage-editor-programs-list");v&&v.addEventListener("change",x=>{x.target.name==="stage-editor-program-selection"&&Om()});let h=!1,b=null;const $=y("stage-editor-stage-id"),M=y("stage-editor-race-id");if($&&M){[$,M].forEach(R=>{R.addEventListener("keydown",w=>{w.key!=="ArrowUp"&&w.key!=="ArrowDown"&&(h=!0,b&&clearTimeout(b))}),R.addEventListener("keyup",w=>{w.key!=="ArrowUp"&&w.key!=="ArrowDown"&&(b&&clearTimeout(b),b=setTimeout(()=>{h=!1},150))}),R.addEventListener("blur",()=>{h=!1})});const x=(R,w)=>{const E=Number(R.value);if(!Number.isInteger(E)||E<=0){w==="stage"?qt=E:Xt=E;return}const A=E-(w==="stage"?qt:Xt);if(!h&&(A===1||A===-1)){let _=E;w==="stage"?_=jm(E,A):y("stage-editor-new-race-checkbox").checked&&(_=Vm(E,A)),R.value=String(_)}w==="stage"?qt=Number(R.value):Xt=Number(R.value)};$.addEventListener("input",()=>{x($,"stage"),pe()}),M.addEventListener("input",()=>{x(M,"race"),pe()})}const T=y("stage-editor-hide-boring-segments-checkbox");T&&T.addEventListener("change",()=>{d.stageEditorHideBoringSegments=T.checked,pe()})}let gt=[],Ut=null,He={form:!0,combinedFatigue:!0,shortFatigue:!1,longFatigue:!1};const Kt=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"],si={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}},ni={1:"Sonnig",2:"Extreme Hitze",3:"Leichter Regen",4:"Starkregen",5:"Starker Wind",6:"Dichter Nebel",7:"Schnee/Eis"};function xa(e,t){if(e==null)return"";const a=t?S(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const re={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function Sr(e,t,a){const r=lt(e??null);return`<span class="badge badge-race-category" style="${wa(r)}; white-space: nowrap; display: inline-block;">${S(e??"Unbekannt")}</span>`}function Hs(e){if(!e)return"-";const t=lt(e);return`<span class="badge badge-race-category" style="${wa(t)}; white-space: nowrap; display: inline-block;">${S(e)}</span>`}function vp(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function Sp(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${vp(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function Ho(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";case"breakaway_final":return"is-breakaway";default:return""}}function zs(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";case"breakaway_final":return"Ausreißer";default:return"Etappe"}}function kp(e){return`<span class="rider-stats-final-type ${Ho(e)}">${S(zs(e))}</span>`}function ue(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?r+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?r+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?r+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?r+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?r+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(r+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function Ie(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?r+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?r+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?r+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?r+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?r+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?r+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(r+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function $p(e){return`${e.startDate===e.endDate?ie(e.startDate):`${ie(e.startDate)} - ${ie(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function kr(e){if(e==null||d.riders.length===0)return null;const a=[...d.riders].sort((r,s)=>(s.seasonPoints??0)-(r.seasonPoints??0)||(s.seasonWins??0)-(r.seasonWins??0)||s.overallRating-r.overallRating||`${r.lastName} ${r.firstName}`.localeCompare(`${s.lastName} ${s.firstName}`,"de")||r.id-s.id).findIndex(r=>r.id===e);return a>=0?a+1:null}function ii(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;case"breakaway_final":return 4;default:return 5}}function xp(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||ii(t.rowType)-ii(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function Tp(e){return[...e].map(t=>({...t,rows:xp(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function zo(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(50,Math.min(85,e));for(let c=1;c<t.length;c++){const l=t[c-1],p=t[c];if(s<=p.score){const m=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*m),r=Math.round(l.lightness+(p.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function St(e,t,a,r){const s=r>0?Math.max(0,Math.min(1,a/r)):.5,n=Math.round(6+s*118),i=.26+s*.18,o=.14+s*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${S(t)}">${e} ${a}</span>`}function Zr(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function Jr(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return re.mountain;case"Hill":return re.hilly;case"Sprint":return re.sprint;case"Timetrial":return re.timetrial;case"Cobble":return re.cobble;case"Attacker":return re.attacker;default:return""}}function We(e,t,a,r,s){var Y,K,k;const n=(t==null?void 0:t.countryCode)??r??null,i=n?oe(n):s,o=(t==null?void 0:t.roleName)??((Y=e==null?void 0:e.role)==null?void 0:Y.name)??"Ohne Rolle",c=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,p=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",m=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",u=((K=t==null?void 0:t.program)==null?void 0:K.name)??((k=e==null?void 0:e.seasonProgram)==null?void 0:k.name)??"-",f=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,g=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,v=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,h=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,b=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,$=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,M=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",T=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,x=(t==null?void 0:t.currentSeasonRank)??kr((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),R=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,w=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,E=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,F=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},A=Math.max(F.flat,F.hilly,F.mediumMountain,F.mountain,F.timetrial,F.cobble),_=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},z=Math.max(_.stageRace,_.oneDay),O=e!=null&&e.specialization1?Zr(e.specialization1):"-",G=e!=null&&e.specialization2?Zr(e.specialization2):"-",C=e!=null&&e.specialization3?Zr(e.specialization3):"-",H=Jr((e==null?void 0:e.specialization1)??null),U=Jr((e==null?void 0:e.specialization2)??null),j=Jr((e==null?void 0:e.specialization3)??null),X=(e==null?void 0:e.weatherProfileId)??(t==null?void 0:t.weatherProfileId)??1,J=si[X]||si[1],te=J.pref[0],W=J.pref[1],P=ni[te],L=ni[W];let N="";return t!=null&&t.lieutenantInfo?N=`
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.lieutenantInfo.name)}</a></span></span>
    `:t!=null&&t.leaderInfo&&(N=`
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.leaderInfo.name)}</a></span></span>
    `),`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${S(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?_e(l,p):""} <span>${S(p)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${S(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${Rs(m)} <span>Form</span></span>
        ${N}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${zo(c)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${re.seasonForm} ${f>=0?"+":""}${f}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${re.raceForm} ${g>=0?"+":""}${g}</span>
        <span class="rider-stats-icon-pill" title="Programm">${S(u)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${re.raceDays} <span class="rider-stats-icon-pill-value">${v}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${h>14?"text-warning":""}" title="30-Tage Renntage">${re.rollingRaceDays} <span class="rider-stats-icon-pill-value">${h}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${re.longFatigue} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${M!=="none"?"text-error":""}" title="Kurzzeitfatigue">${re.shortFatigue} <span class="rider-stats-icon-pill-value">${$}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${re.seasonPoints} <span class="rider-stats-icon-pill-value">${T}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${re.rank} <span class="rider-stats-icon-pill-value">${Sp(x)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${re.raceDays} <span class="rider-stats-icon-pill-value">${R}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${re.wins} <span class="rider-stats-icon-pill-value">${w}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${H} ${S(O)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${U} ${S(G)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${j} ${S(C)}</span>
        <span class="rider-stats-icon-pill" title="Wetterpräferenzen" style="display: inline-flex; align-items: center; gap: 4px; padding: 0.2rem 0.6rem;">🌤️ ${xa(te,P)} ${xa(W,L)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${St(re.stageRace,"Rundfahrten Punkte",_.stageRace,z)}
        ${St(re.oneDay,"Eintagesrennen Punkte",_.oneDay,z)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${re.breakaway} <span class="rider-stats-icon-pill-value">${E}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${St(re.flat,"Flach-Punkte",F.flat,A)}
        ${St(re.hilly,"Hügel-Punkte",F.hilly,A)}
        ${St(re.mediumMountain,"Mittelgebirge-Punkte",F.mediumMountain,A)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${St(re.mountain,"Hochgebirge-Punkte",F.mountain,A)}
        ${St(re.timetrial,"Zeitfahren-Punkte",F.timetrial,A)}
        ${St(re.cobble,"Kopfsteinpflaster-Punkte",F.cobble,A)}
      </div>
    </div>
  `}function oi(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",r=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${S(a)} <strong>${S(r)}</strong>`}function je(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${d.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${d.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${d.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${d.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${d.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${d.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${d.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-rider-stats-tab="contracts" aria-selected="${d.riderStatsTab==="contracts"?"true":"false"}">Verträge</button>
    </div>`}function wp(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(55,Math.min(80,e));for(let c=1;c<t.length;c++){const l=t[c-1],p=t[c];if(s<=p.score){const m=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*m),r=Math.round(l.lightness+(p.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function Mp(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},r=["mountain","hill","sprint","timeTrial","cobble","attack"],s=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,c=i/2,l=160,p=60,m=85,u=m-p,f=_=>{const z=[];for(let O=0;O<6;O++){const G=O*Math.PI/3-Math.PI/2;z.push(`${o+_*Math.cos(G)},${c+_*Math.sin(G)}`)}return z},g=`
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
    </defs>`,v=`<circle cx="${o}" cy="${c}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let h="";for(let _=p;_<=m;_+=2.5){const z=l*((_-p)/u);if(z<1){h+=`<circle cx="${o}" cy="${c}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const O=f(z),G=_%5===0,C=G?1:.6,H=G?"none":"4,4",U=G?.4:.18;h+=`<polygon points="${O.join(" ")}" fill="none" stroke="rgba(255,255,255,${U})" stroke-width="${C}" stroke-dasharray="${H}" />`,G&&_>p&&(h+=`<text x="${o+5}" y="${c-z+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${_}</text>`)}let b="",$="";for(let _=0;_<6;_++){const z=_*Math.PI/3-Math.PI/2,O=o+l*Math.cos(z),G=c+l*Math.sin(z);b+=`<line x1="${o}" y1="${c}" x2="${O}" y2="${G}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const C=l+28,H=o+C*Math.cos(z),U=c+C*Math.sin(z),j=Math.cos(z);let X="middle";j>.15?X="start":j<-.15&&(X="end");const J=a[r[_]]??p;$+=`<text x="${H}" y="${U}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${X}" dominant-baseline="middle">${s[_]}</text>`,$+=`<text x="${H}" y="${U+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${X}" dominant-baseline="middle">${J}</text>`}const M=[],T=[];r.forEach((_,z)=>{const O=a[_]??p,G=l*((Math.max(p,Math.min(m,O))-p)/u),C=z*Math.PI/3-Math.PI/2,H=o+G*Math.cos(C),U=c+G*Math.sin(C);M.push(`${H},${U}`),T.push(`<circle cx="${H}" cy="${U}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${s[z]}: ${O}</title></circle>`)});const x=`<polygon points="${M.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,w=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((_,z)=>{const O=a[_.key]??60;return(a[z.key]??60)-O}),E=[],F=[];w.forEach((_,z)=>{const O=a[_.key]??60,G=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${_.label}</span>
        ${wp(O)}
      </div>
    `;z%2===0?E.push(G):F.push(G)});const A=`
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
            ${v}
            ${h}
            ${b}
            ${x}
            ${T.join("")}
            ${$}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${A}
        </div>
      </div>
    </section>
  `}function Rp(e,t){const a=t.shortTermFatigueMalus??0,r=t.longTermFatigueDecayable??0,s=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),c=(r/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const p=t.fatigueHistory??[];let m="";return p.length===0?m='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':m=p.map(u=>{const f=ie(u.date);let g="";u.type==="race"?g=`${S(u.raceName)}${u.stageNumber!=null?` - Etappe ${u.stageNumber}`:""}`:g=u.raceName?S(u.raceName):"Regeneration";const v=u.type==="race"&&u.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${u.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let h="";u.shortChange>0?h=`<span style="color: #ef4444; font-weight: 600;">+${u.shortChange.toFixed(2).replace(".",",")}</span>`:u.shortChange<0?h=`<span style="color: #2ecc71; font-weight: 600;">${u.shortChange.toFixed(2).replace(".",",")}</span>`:h='<span style="color: #666;">0,00</span>';const b=[];if(u.longDecayableChange!==0){const T=u.longDecayableChange>0?"+":"",x=u.longDecayableChange>0?"#ef4444":"#2ecc71";b.push(`<span style="color: ${x}; font-weight: 500;">${T}${u.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(u.longLockedChange!==0){const T=u.longLockedChange>0?"+":"",x=u.longLockedChange>0?"#a855f7":"#2ecc71";b.push(`<span style="color: ${x}; font-weight: 500;">${T}${u.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const $=b.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${b.join("")}</div>`:'<span style="color: #666;">0,00</span>',M=u.shortAfter+u.longAfter;return`
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${f}</td>
          <td style="color: #fff; font-weight: 600; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${g}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${v}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${h}
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
            <strong style="color: #ef4444; font-size: 0.95rem;">-${M.toFixed(2).replace(".",",")}</strong>
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
            ${m}
          </tbody>
        </table>
      </div>
    </section>
  `}function Ip(e){var W;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((P,L)=>L%2===0),r=((W=d.gameState)==null?void 0:W.currentDate)??new Date().toISOString(),s=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(r).getUTCFullYear(),n=new Date(Date.UTC(s,0,1)).getTime(),i=864e5,o=1260,c=384,l=40,p=20,m=a.map(P=>{const N=(new Date(P.date).getTime()-n)/i,Y=l+N/365*o,K=p+c-Math.min(8,Math.max(0,P.totalForm))/8*c;return{x:Y,y:K,form:P.totalForm,date:P.date}});let u="",f="",g="";He.form&&m.length>0&&(u=`M ${m.map(P=>`${P.x},${P.y}`).join(" L ")}`,f=m.map(P=>`<circle cx="${P.x}" cy="${P.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${P.date}): ${P.form}</title></circle>`).join(""),g=`${u} L ${m[m.length-1].x},${p+c} L ${m[0].x},${p+c} Z`);let v="",h="";if(He.combinedFatigue&&m.length>0){const P=a.map(N=>{const K=(new Date(N.date).getTime()-n)/i,k=l+K/365*o,I=(N.shortFatigue??0)+(N.longFatigue??0),D=p+c-Math.min(25,Math.max(0,I))/25*c;return{x:k,y:D,val:I,date:N.date}});v=`<path d="${`M ${P.map(N=>`${N.x},${N.y}`).join(" L ")}`}" fill="none" stroke="#ef4444" stroke-width="2" />`,h=P.map(N=>`<circle cx="${N.x}" cy="${N.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${N.date}): ${N.val.toFixed(2)}</title></circle>`).join("")}let b="",$="";if(He.shortFatigue&&m.length>0){const P=a.map(N=>{const K=(new Date(N.date).getTime()-n)/i,k=l+K/365*o,I=N.shortFatigue??0,D=p+c-Math.min(25,Math.max(0,I))/25*c;return{x:k,y:D,val:I,date:N.date}});b=`<path d="${`M ${P.map(N=>`${N.x},${N.y}`).join(" L ")}`}" fill="none" stroke="#facc15" stroke-width="2" />`,$=P.map(N=>`<circle cx="${N.x}" cy="${N.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${N.date}): ${N.val.toFixed(2)}</title></circle>`).join("")}let M="",T="";if(He.longFatigue&&m.length>0){const P=a.map(N=>{const K=(new Date(N.date).getTime()-n)/i,k=l+K/365*o,I=N.longFatigue??0,D=p+c-Math.min(25,Math.max(0,I))/25*c;return{x:k,y:D,val:I,date:N.date}});M=`<path d="${`M ${P.map(N=>`${N.x},${N.y}`).join(" L ")}`}" fill="none" stroke="#a855f7" stroke-width="2" />`,T=P.map(N=>`<circle cx="${N.x}" cy="${N.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${N.date}): ${N.val.toFixed(2)}</title></circle>`).join("")}const x="rgba(251, 191, 36, 0.15)";let R="";for(let P=0;P<=8;P+=2){const L=p+c-P/8*c;R+=`<line x1="${l}" y1="${L}" x2="${l+o}" y2="${L}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,R+=`<text x="${l-5}" y="${L+4}" fill="#ffffff" font-size="10" text-anchor="end">${P}</text>`}for(let P=0;P<=25;P+=5){const L=p+c-P/25*c;R+=`<text x="${l+o+5}" y="${L+4}" fill="#ef4444" font-size="10" text-anchor="start">${P}</text>`}let w="";for(let P=0;P<=52;P+=5){const L=l+P/52*o;R+=`<line x1="${L}" y1="${p}" x2="${L}" y2="${p+c}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,w+=`<text x="${L}" y="${p+c+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${P}</text>`}let E="",F="";if(e.peakDates){const P=[...e.peakDates].sort((L,N)=>new Date(L).getTime()-new Date(N).getTime());for(let L=0;L<P.length;L++){const N=P[L],K=(new Date(N).getTime()-n)/i,k=l+K/365*o;E+=`<line x1="${k}" y1="${p}" x2="${k}" y2="${p+c}" stroke="#ffffff" stroke-width="2"><title>Peak: ${N}</title></line>`;const I=L>0?(new Date(P[L-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,D=K-56,B=I+14,Z=Math.max(0,Math.max(D,B)),ne=K-Z,fe=l+Z/365*o,ge=ne/365*o;F+=`<rect x="${fe}" y="${p}" width="${ge}" height="${c}" fill="rgba(16, 185, 129, 0.1)" />`;const Te=14/365*o;F+=`<rect x="${k}" y="${p}" width="${Te}" height="${c}" fill="rgba(239, 68, 68, 0.1)" />`}}const _=(new Date(r).getTime()-n)/i,z=l+_/365*o;E+=`<line x1="${z}" y1="${p}" x2="${z}" y2="${p+c}" stroke="#ef4444" stroke-width="3"><title>Heute: ${r}</title></line>`,gt.forEach((P,L)=>{const N=Kt[L%Kt.length];P.peakDates&&P.peakDates.forEach(Y=>{const k=(new Date(Y).getTime()-n)/i,I=l+k/365*o;E+=`<line x1="${I}" y1="${p}" x2="${I}" y2="${p+c}" stroke="${N}" stroke-width="1.5" stroke-dasharray="3,3"><title>${P.riderName} Peak: ${Y}</title></line>`})});let O="",G="";gt.forEach((P,L)=>{const N=Kt[L%Kt.length],Y=P.formHistory.filter((K,k)=>k%2===0).map(K=>{const I=(new Date(K.date).getTime()-n)/i,D=l+I/365*o,B=p+c-Math.min(8,Math.max(0,K.totalForm))/8*c;return{x:D,y:B,form:K.totalForm,date:K.date}});if(Y.length>0){const K=`M ${Y.map(k=>`${k.x},${k.y}`).join(" L ")}`;O+=`<path d="${K}" fill="none" stroke="${N}" stroke-width="2" />`,G+=Y.map(k=>`<circle cx="${k.x}" cy="${k.y}" r="3" fill="#fff" stroke="${N}" stroke-width="2"><title>${P.riderName} (${k.date}): ${k.form}</title></circle>`).join("")}});const C=d.teams.filter(P=>P.division==="WorldTour"||P.divisionName==="WorldTour");let H='<option value="">-- Team auswählen --</option>';for(const P of C){const L=Ut===P.id?" selected":"";H+=`<option value="${P.id}"${L}>${S(P.name)}</option>`}let U='<option value="">-- Fahrer auswählen --</option>';if(Ut!=null){const P=d.riders.filter(L=>L.activeTeamId===Ut&&L.id!==e.riderId&&!gt.some(N=>N.riderId===L.id));for(const L of P)U+=`<option value="${L.id}">${S(L.firstName)} ${S(L.lastName)}</option>`}const j=`
    <div class="rider-compare-controls" style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-primary);">
      <span style="font-weight: 600; color: var(--text-100); font-size: 0.95rem;">Mit anderem Fahrer vergleichen:</span>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-team-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Team (Tier 1):</label>
        <select id="rider-compare-team-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);">
          ${H}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-rider-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Fahrer:</label>
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${Ut==null?"disabled":""}>
          ${U}
        </select>
      </div>
    </div>
  `,X=e.currentSeasonRank??kr(e.riderId)??"–",J=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(e.riderName)} (${e.currentSeasonPoints}/${X})">${S(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${X})</span></span>
    </div>
    `];gt.forEach((P,L)=>{const N=Kt[L%Kt.length],Y=P.currentSeasonRank??kr(P.riderId)??"–";J.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${N}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(P.riderName)} (${P.currentSeasonPoints}/${Y})">${S(P.riderName)} <span style="color: var(--text-500);">(${P.currentSeasonPoints}/${Y})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${P.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const te=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      
      <!-- Chart Line Toggle Checkboxes -->
      <div class="chart-line-toggles" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-form" ${He.form?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-combined-fatigue" ${He.combinedFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #ef4444;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
          Gesamtfatigue (0-25)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-short-fatigue" ${He.shortFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #facc15;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #facc15; border-radius: 50%;"></span>
          Kurzzeitfatigue (0-25)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-long-fatigue" ${He.longFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #a855f7;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #a855f7; border-radius: 50%;"></span>
          Langzeitfatigue (0-25)
        </label>
      </div>

      <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-500); font-weight: bold; margin-bottom: 0.5rem; letter-spacing: 0.5px;">Fahrer</div>
      ${J.join("")}
    </div>
  `;return`
    <section class="rider-stats-form-tab">
      <div class="rider-stats-season-head">
        <h3>Formverlauf (Saison ${s})</h3>
      </div>
      ${j}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${F}
            ${R}
            ${w}
            ${E}
            ${g?`<path d="${g}" fill="${x}" />`:""}
            ${u?`<path d="${u}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${f}
            ${v}
            ${h}
            ${b}
            ${$}
            ${M}
            ${T}
            ${O}
            ${G}
          </svg>
        </div>
        ${te}
      </div>
    </section>
  `}function Cp(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
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
            ${t.map(a=>{var s;const r=e.unavailableUntil?a.startDate<=e.unavailableUntil&&a.endDate>=d.gameState.currentDate:!1;return`
              <tr>
                <td>${S(Dr(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${r?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(s=a.country)!=null&&s.code3?oe(a.country.code3):"–"}</td>
                <td><strong>${S(a.name)}</strong></td>
                <td>${Lr(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function Gs(e){const t=new Set;if(e.jerseysWorn){const i=e.jerseysWorn.split(",").map(o=>o.trim()).filter(Boolean);for(const o of i)t.add(o)}const a=new Map;if(e.eventIds){const i=e.eventIds.split("|");for(const o of i){const[c,l]=o.split(":");c&&a.set(c,l?parseInt(l,10):1)}}const r=[{type:"jersey",key:"yellow",label:"Gelbes Trikot (Gesamtwertung)",colorClass:"jersey-dot-yellow"},{type:"jersey",key:"green",label:"Grünes Trikot (Punktewertung)",colorClass:"jersey-dot-green"},{type:"jersey",key:"red",label:"Bergtrikot (Bergwertung)",colorClass:"jersey-dot-red"},{type:"jersey",key:"white",label:"Weißes Trikot (Nachwuchswertung)",colorClass:"jersey-dot-white"},{type:"jersey",key:"purple",label:"Lila Trikot (Aktivste Fahrer)",colorClass:"jersey-dot-purple-worn"},{type:"event",key:"3",label:"Superform",colorClass:"event-dot-3"},{type:"event",key:"4",label:"Supermalus",colorClass:"event-dot-4"},{type:"event",key:"1",label:"Sturz",colorClass:"event-dot-1"},{type:"event",key:"2",label:"Defekt",colorClass:"event-dot-2"},{type:"event",key:"7",label:"Heimvorteil",colorClass:"event-dot-7"},{type:"event",key:"8",label:"Heimbonus",colorClass:"event-dot-8"},{type:"event",key:"9",label:"Heimmalus",colorClass:"event-dot-9"},{type:"event",key:"5",label:"Attacken",colorClass:"event-dot-5"},{type:"event",key:"6",label:"Konterattacken",colorClass:"event-dot-6"}],s=[],n=[];for(const i of r)if(i.type==="jersey")t.has(i.key)&&(s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${S(i.label)}</span>
          </div>
        `));else{const o=a.get(i.key);if(o!==void 0&&o>0){const c=o>1?` (${o}x)`:"";s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${S(i.label)}${S(c)}</span>
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
  `}function Ht(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${S(e)}</span>`}function Ep(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function Fp(e){return e.finishStatus==="otl"?Ht("OTL","place"):e.finishStatus==="dnf"?Ht("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${S(String(e.resultRank))}</span>`}function Pp(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":Ht(String(e.gcRank),"gc")}function Np(e){return e.finishStatus==="otl"?ir(e.statusReason,!0):e.finishStatus==="dnf"?ir(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${va(e.stageTimeSeconds)}`:e.resultLabel}function Ae(e,t,a=!1){var f,g,v;const r=(e==null?void 0:e.activeTeamId)!=null?((f=d.teams.find(h=>h.id===e.activeTeamId))==null?void 0:f.name)??null:null,s=((g=e==null?void 0:e.country)==null?void 0:g.code3)??(e==null?void 0:e.nationality)??null,n=s?oe(s):"",i=t==null?[]:[...t.seasons].map(h=>({...h,raceBlocks:Tp(h.raceBlocks)})).sort((h,b)=>b.season-h.season);if(a)return`
      ${We(e,t,r,s,n)}
      ${je(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`;if(!t)return`
      ${We(e,t,r,s,n)}
      ${je(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`;if(d.riderStatsTab==="skills")return`
      ${We(e,t,r,s,n)}
      ${je(t)}
      ${Mp(e)}`;if(d.riderStatsTab==="fatigue")return`
      ${We(e,t,r,s,n)}
      ${je(t)}
      ${Rp(e,t)}`;if(d.riderStatsTab==="program")return`
      ${We(e,t,r,s,n)}
      ${je(t)}
      ${Cp(t)}`;if(d.riderStatsTab==="form")return`
      ${We(e,t,r,s,n)}
      ${je(t)}
      ${Ip(t)}`;if(d.riderStatsTab==="topResults")return`
      ${We(e,t,r,s,n)}
      ${je(t)}
      ${Dp(t)}`;if(d.riderStatsTab==="career")return`
      ${We(e,t,r,s,n)}
      ${je(t)}
      ${Ap(t)}`;if(d.riderStatsTab==="contracts")return`
      ${We(e,t,r,s,n)}
      ${je(t)}
      ${_p(t)}`;const o=((v=d.gameState)==null?void 0:v.season)??2026,c=Array.from(new Set([o,...i.map(h=>h.season)])).sort((h,b)=>b-h);(d.riderStatsSelectedSeason===null||!c.includes(d.riderStatsSelectedSeason))&&(d.riderStatsSelectedSeason=o);const l=d.riderStatsSelectedSeason,p=i.find(h=>h.season===l);if(t.seasons.length===0)return`
      ${We(e,t,r,s,n)}
      ${je(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`;const m=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.02); padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <h3 style="margin: 0; font-size: 1rem; color: #fff;">Rennergebnisse</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-stats-results-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500; margin: 0;">Saison filtern:</label>
        <select id="rider-stats-results-season-select" class="form-control" style="background: #222; border: 1px solid #444; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer; width: auto; display: inline-block;">
          ${c.map(h=>`<option value="${h}" ${h===l?"selected":""}>Saison ${h}</option>`).join("")}
        </select>
      </div>
    </div>
  `,u=p?`
    <section class="rider-stats-season" style="margin-top: 0;">
      <div class="rider-stats-season-head" style="display: none;">
        <h3>Saison ${p.season}</h3>
        <span>${p.raceBlocks.length} Rennen</span>
      </div>
      <div class="rider-stats-race-list">
        ${p.raceBlocks.map(h=>`
          <section class="rider-stats-race-block">
            <div class="rider-stats-race-head">
              <div>
                <h4>${S(h.raceName)}</h4>
                <p>${S($p(h))}</p>
              </div>
              ${Sr(h.raceCategoryName,h.isStageRace,h.rows.filter(b=>b.rowType==="stage_result").length||null)}
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
                  ${h.rows.map(b=>{const $=b.rowType!=="stage_result",M=$?`${b.raceName} · ${zs(b.rowType)}`:b.stageNumber&&b.isStageRace?`${b.raceName} · Etappe ${b.stageNumber}`:b.raceName;return`
                      <tr class="rider-stats-row${$?" rider-stats-row-final":""}">
                        <td>${S(ie(b.date))}</td>
                        <td>${Fp(b)}</td>
                        <td>${Pp(b)}</td>
                        <td class="rider-stats-breakaway-col">${Ep(b)}</td>
                        <td>${$?"":xa(b.rolledWeatherId,b.rolledWetterName)}</td>
                        <td>${$?kp(b.rowType):Sr(b.raceCategoryName?b.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):b.raceCategoryName,b.isStageRace)}</td>
                        <td>${S(M)}</td>
                        <td class="status-cell">${Gs(b)}</td>
                        <td>${$?"–":b.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${b.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${Pa(b.profile)}</button>`:"–"}</td>
                        <td>${$?"-":b.distanceKm!=null?S(b.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                        <td>${$?"-":b.elevationGainMeters!=null?S(String(Math.round(b.elevationGainMeters))):"–"}</td>
                        <td>${S(Np(b))}</td>
                        <td>${b.seasonPoints}</td>
                      </tr>`}).join("")}
                </tbody>
              </table>
            </div>
          </section>`).join("")}
      </div>
    </section>
  `:`
    <section class="rider-stats-placeholder" style="margin-top: 1rem;">
      <h3>Keine Rennergebnisse</h3>
      <p>Dieser Fahrer hat in der Saison ${l} keine Rennen bestritten.</p>
    </section>
  `;return`
    ${We(e,t,r,s,n)}
    ${je(t)}
    ${m}
    ${u}
  `}function cs(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(d.riderStatsTab)?(e.style.minWidth="min(1475px, 95vw)",e.style.maxWidth="1687px"):(e.style.minWidth="",e.style.maxWidth="")}async function na(e){var c,l,p,m,u;const t=Me(e),a=(t==null?void 0:t.activeTeamId)!=null?((c=d.teams.find(f=>f.id===t.activeTeamId))==null?void 0:c.name)??null:null;gt=[],Ut=null,d.riderStatsSelectedRiderId=e,d.riderStatsTab="results",d.riderStatsSelectedSeason=((l=d.gameState)==null?void 0:l.season)??2026,cs(),d.riderStatsTopResultsFilterCategory=null,d.riderStatsTopResultsFilterSeason=null,d.riderStatsTopResultsPage=1,y("rider-stats-title").innerHTML=oi(t,null),y("rider-stats-jersey").innerHTML="";const r=t!=null&&t.age?` · Alter ${t.age}`:"";y("rider-stats-meta").textContent=t?`${((p=t.role)==null?void 0:p.name)??"Fahrer"} · ${a??"Team unbekannt"}${r}`:"Historie wird geladen",y("rider-stats-body").innerHTML=Ae(t,null,!0),Xe("riderStats");const s=await V.getRiderStats(e);if(d.riderStatsSelectedRiderId!==e)return;if(!s.success||!s.data){const f=t!=null&&t.age?` · Alter ${t.age}`:"";y("rider-stats-meta").textContent=t?`${((m=t.role)==null?void 0:m.name)??"Fahrer"} · ${a??"Team unbekannt"}${f}`:"Fehler beim Laden",y("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>`;return}d.riderStatsPayload=s.data,cs(),y("rider-stats-title").innerHTML=oi(t,s.data),y("rider-stats-jersey").innerHTML="";const n=s.data.age?` · Alter ${s.data.age}`:t!=null&&t.age?` · Alter ${t.age}`:"",i=s.data.mentorName?` · Mentor: ${s.data.mentorName}`:"",o=s.data.mentoredRiderNames&&s.data.mentoredRiderNames.length>0?` · Mentor von: ${s.data.mentoredRiderNames.join(" - ")}`:"";y("rider-stats-meta").textContent=`${((u=t==null?void 0:t.role)==null?void 0:u.name)??"Fahrer"} · ${s.data.teamName??a??"Ohne aktives Team"}${n} · ${s.data.seasons.length} Saisons${i}${o}`,y("rider-stats-body").innerHTML=Ae(t,s.data,!1)}function Lp(){y("rider-stats-body").addEventListener("click",e=>{var s;if(e.target&&e.target.id&&e.target.id.startsWith("toggle-chart-")){const n=e.target.id,i=e.target.checked;n==="toggle-chart-form"?He.form=i:n==="toggle-chart-combined-fatigue"?He.combinedFatigue=i:n==="toggle-chart-short-fatigue"?He.shortFatigue=i:n==="toggle-chart-long-fatigue"&&(He.longFatigue=i);const o=Me(d.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Ae(o,d.riderStatsPayload,!1);return}const t=e.target.closest("button[data-rider-stats-tab]");if(!t){const n=e.target.closest("button[data-remove-compare-id]");if(n){const c=Number(n.dataset.removeCompareId);gt=gt.filter(p=>p.riderId!==c);const l=Me(d.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Ae(l,d.riderStatsPayload,!1);return}const i=e.target.closest("button[data-top-results-page]");if(i){const c=Number(i.dataset.topResultsPage);if(!isNaN(c)&&c>=1){d.riderStatsTopResultsPage=c;const l=Me(d.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Ae(l,d.riderStatsPayload,!1)}return}const o=e.target.closest("button[data-stage-profile-id]");if(o){const c=Number(o.dataset.stageProfileId);Number.isFinite(c)&&xr(c);return}return}const a=t.dataset.riderStatsTab;if(a!=="results"&&a!=="program"&&a!=="form"&&a!=="topResults"&&a!=="skills"&&a!=="career"&&a!=="fatigue"&&a!=="contracts"||a==="program"&&(((s=d.riderStatsPayload)==null?void 0:s.programRaces.length)??0)===0)return;d.riderStatsTab=a,cs();const r=Me(d.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Ae(r,d.riderStatsPayload,!1)}),y("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){d.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,d.riderStatsTopResultsPage=1;const a=Me(d.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Ae(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){d.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),d.riderStatsTopResultsPage=1;const a=Me(d.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Ae(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-results-season-select"){d.riderStatsSelectedSeason=Number(t.value);const a=Me(d.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Ae(a,d.riderStatsPayload,!1)}else if(t.classList.contains("rider-stats-filter-checkbox")){const a=t.dataset.filterType;d.riderStatsTopResultsFilters[a]=t.checked,d.riderStatsTopResultsPage=1;const r=Me(d.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Ae(r,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;Ut=a?Number(a):null;const r=Me(d.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Ae(r,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const r=Number(a);if(gt.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const s=await V.getRiderStats(r,!0);s.success&&s.data?gt.push({riderId:s.data.riderId,riderName:s.data.riderName,teamId:s.data.teamId,teamName:s.data.teamName,formHistory:s.data.formHistory??[],peakDates:s.data.peakDates??[],currentSeasonPoints:s.data.currentSeasonPoints??0,currentSeasonRank:s.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(s.error??""));const n=Me(d.riderStatsSelectedRiderId);y("rider-stats-body").innerHTML=Ae(n,d.riderStatsPayload,!1)}}})}function li(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function Dp(e){const t=[];for(const g of e.seasons)for(const v of g.raceBlocks)for(const h of v.rows)t.push({...h,season:g.season,isStageRace:v.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,v)=>g.localeCompare(v,"de"));const r=Array.from(new Set(t.map(g=>g.season))).sort((g,v)=>v-g);let s=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?d.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?d.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?d.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?d.riderStatsTopResultsFilters.youth:!0:g.isStageRace?d.riderStatsTopResultsFilters.stage:d.riderStatsTopResultsFilters.oneDay);if(d.riderStatsTopResultsFilterCategory){const g=d.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const v=g.substring(0,g.length-8);s=s.filter(h=>h.raceCategoryName===v&&h.rowType==="stage_result")}else if(g.endsWith("-gc")){const v=g.substring(0,g.length-3);s=s.filter(h=>h.raceCategoryName===v&&h.rowType!=="stage_result")}else s=s.filter(v=>v.raceCategoryName===g)}d.riderStatsTopResultsFilterSeason!=null&&(s=s.filter(g=>g.season===d.riderStatsTopResultsFilterSeason)),s.sort((g,v)=>{if(v.seasonPoints!==g.seasonPoints)return v.seasonPoints-g.seasonPoints;const h=g.rowType!=="stage_result",b=v.rowType!=="stage_result",$=g.resultRank??9999,M=v.resultRank??9999;if(d.riderStatsTopResultsFilterCategory)return $!==M?$-M:h!==b?h?-1:1:0;{const T=li(g.raceCategoryName),x=li(v.raceCategoryName);return T!==x?T-x:h!==b?h?-1:1:$-M}});const n=200,i=s.slice(0,1e3),o=Math.max(1,Math.ceil(i.length/n));d.riderStatsTopResultsPage>o&&(d.riderStatsTopResultsPage=o);const c=(d.riderStatsTopResultsPage-1)*n,l=i.slice(c,c+n),m=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${a.map(g=>{if(g.toLowerCase().includes("stage race")||g.toLowerCase().includes("grand tour")||g.toLowerCase().includes("tour de france")){const h=`${g}-etappen`,b=`${g}-gc`;return`
        <option value="${S(h)}" ${d.riderStatsTopResultsFilterCategory===h?"selected":""}>${S(g)} - Etappen</option>
        <option value="${S(b)}" ${d.riderStatsTopResultsFilterCategory===b?"selected":""}>${S(g)} - GC</option>
      `}else return`<option value="${S(g)}" ${d.riderStatsTopResultsFilterCategory===g?"selected":""}>${S(g)}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="rider-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${r.map(g=>`<option value="${g}" ${d.riderStatsTopResultsFilterSeason===g?"selected":""}>Saison ${g}</option>`).join("")}
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
  `,u=l.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':l.map(g=>{const v=g.rowType!=="stage_result",h=v?`${g.raceName} · ${zs(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let b="–",$="–";g.finishStatus==="otl"?b=Ht("OTL","place"):g.finishStatus==="dnf"?b=Ht("DNF","place"):g.resultRank==null||(v?$=`<span class="rider-stats-final-type ${Ho(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:b=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${S(String(g.resultRank))}</span>`);const M=v?"–":g.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${g.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${Pa(g.profile)}</button>`:"–",T=!v&&g.stageScore!=null&&g.stageScore>0?Nr(g.stageScore,0,350):"–",x=Sr(g.raceCategoryName?g.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${v?" rider-stats-row-final":""}">
            <td>${b}</td>
            <td>${$}</td>
            <td><strong>${S(h)}</strong>${v?"":xa(g.rolledWeatherId,g.rolledWetterName)}</td>
            <td class="status-cell">${Gs(g)}</td>
            <td>${M}</td>
            <td>${T}</td>
            <td>${x}</td>
            <td>Saison ${g.season}</td>
            <td><strong>${g.seasonPoints}</strong></td>
          </tr>
        `}).join(""),f=o>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${d.riderStatsTopResultsPage-1}" ${d.riderStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        <span style="font-weight: 600; color: #ccc;">Seite ${d.riderStatsTopResultsPage} von ${o}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${d.riderStatsTopResultsPage+1}" ${d.riderStatsTopResultsPage===o?"disabled":""}>Weiter &raquo;</button>
      </div>
    `:"";return`
    <section class="rider-stats-top-results" style="margin-top: 1.5rem;">
      ${m}
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
            ${u}
          </tbody>
        </table>
      </div>
      ${f}
    </section>
  `}function _p(e){var n,i,o,c,l;const t=(e==null?void 0:e.contracts)||[];if(t.length===0)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Vertragsdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden keine Verträge in der Datenbank erfasst.</p>
      </section>
    `;const a=((n=d.gameState)==null?void 0:n.season)??2026,r=[];for(const p of t)for(let m=p.startSeason;m<=p.endSeason;m++){let u=null;m>a?u="-":m===a?u=(e==null?void 0:e.roleName)||((o=(i=e==null?void 0:e.seasonRoles)==null?void 0:i.find(g=>g.season===m))==null?void 0:o.roleName)||"-":u=((l=(c=e==null?void 0:e.seasonRoles)==null?void 0:c.find(g=>g.season===m))==null?void 0:l.roleName)||"-";const f=m===a?'<span style="color: #22c55e; font-weight: bold;">Aktiv</span>':m>a?'<span style="color: #60a5fa; font-weight: bold;">Zukünftig</span>':'<span style="color: #94a3b8;">Abgelaufen</span>';r.push({season:m,teamId:p.teamId,teamName:p.teamName,roleName:u,statusText:f})}return r.sort((p,m)=>m.season-p.season),`
    <section class="rider-stats-section" style="margin-top: 1.5rem;">
      <h3 style="margin-bottom: 1rem; font-size: 1.1rem; color: #fff;">Vertragshistorie</h3>
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.02);">
              <th style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center; width: 15%;">Saison</th>
              <th style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: left; width: 45%;">Team</th>
              <th style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center; width: 25%;">Rolle</th>
              <th style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center; width: 15%;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${r.map(p=>{const m=p.teamId?_e(p.teamId,p.teamName):"",u=p.teamId?Ze(p.teamName||"",p.teamId,!0,"results-rider-link"):"Freier Fahrer (Free Agent)",f=p.teamId?`<div style="display: flex; align-items: center; gap: 0.5rem;">${m} <span style="vertical-align: middle;">${u}</span></div>`:`<span style="color: #94a3b8; font-style: italic;">${u}</span>`;return`
      <tr>
        <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-weight: bold; color: #fff;">Saison ${p.season}</td>
        <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-weight: 500;">${f}</td>
        <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; color: #ccc;">${S(p.roleName||"-")}</td>
        <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${p.statusText}</td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `}function Ap(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,superteamCount:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),r=(n,i,o,c)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let p="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?p+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?p+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?p+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?p+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?p+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?p+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?p+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?p+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(p+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${p}" title="${S(o)}">${n}</span>`},s=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
                ${Hs(n.key)}
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
                  ${ue(i.winFlat||0,"flat","Flach (Flat)")}
                  ${ue(i.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${ue(i.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${ue(i.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${ue(i.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${ue(i.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${ue(i.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${ue(i.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${ue(i.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${ue(i.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${ue(i.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${Ie(i.winWeather1||0,1,"Sonnig")}
                  ${Ie(i.winWeather2||0,2,"Extreme Hitze")}
                  ${Ie(i.winWeather3||0,3,"Leichter Regen")}
                  ${Ie(i.winWeather4||0,4,"Starkregen")}
                  ${Ie(i.winWeather5||0,5,"Starker Wind")}
                  ${Ie(i.winWeather6||0,6,"Dichter Nebel")}
                  ${Ie(i.winWeather7||0,7,"Schnee/Eis")}
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
  `}window.openRiderStatsFromRiderStats=na;const Bp=250,Ot=1200,Hp=250,zp=1200,di=.2;class Gp{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",r=>{var i,o,c,l;const s=r.target.closest("button[data-race-sim-action]");if(s){if(s.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const m=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;m&&((l=(c=this.options).onFinishRequested)==null||l.call(c,m,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=r.target.closest("button[data-race-sim-speed]");if(n){const p=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(p))return;this.timeMultiplier=p,this.render()}}),this.elements.messages.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-group-rider-id]");if(s){const c=this.resolveRiderIdFromGroupButton(s);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),na(c));return}const n=r.target.closest("button[data-race-sim-group-rider-name]");if(n){const c=this.resolveRiderIdFromGroupButton(n);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),na(c));return}const i=r.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),_n(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",r=>{const s=r.target.closest("[data-race-sim-overview-summary]");if(s){const n=s.dataset.raceSimOverviewSummary,i=s.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(r)}),this.elements.groupBox.addEventListener("click",r=>{this.handleGroupInteraction(r)}),this.elements.profile.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-timing-mode]");if(!s)return;const n=s.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+Ot,this.render())})}handleGroupInteraction(t){var p,m;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const u=this.resolveRiderIdFromGroupButton(a);u!=null&&this.selectGroupByRiderId(u,this.detailSnapshot);return}const r=t.target.closest("button[data-race-sim-group-nav]");if(!r)return;const s=this.buildRaceGroups(this.detailSnapshot);if(s.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,s.findIndex(u=>u.label===n)),o=r.dataset.raceSimGroupNav==="prev"?-1:1,c=(i+o+s.length)%s.length,l=((p=s[c])==null?void 0:p.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",u=>{const f=u.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Ot)}),this.elements.profile.addEventListener("wheel",u=>{const f=u.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Ot)},{passive:!0}),this.elements.profile.addEventListener("scroll",u=>{const f=u.target;!(f instanceof HTMLElement)||!f.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Ot)},!0),(m=this.elements.sidebar.parentElement)==null||m.addEventListener("click",u=>{if(!this.bootstrap||!this.detailSnapshot||!Uu(this.elements.sidebar,u.target))return;const g=performance.now(),v=qn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(v);const h=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",h),this.scheduleSidebarPaintTelemetry(g,h),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new io(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const r=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(r),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(s=>this.frame(s));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const r=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-r),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(s=>this.frame(s))}render(t=performance.now(),a=!1){var f;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const r=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",s=Jl(this.bootstrap.stageSummary),n=[`${s.segmentCount} Segmente`,s.sprintCount>0?`${s.sprintCount} Sprint${s.sprintCount===1?"":"s"}`:null,s.climbCount>0?`${s.climbCount} Bergwertung${s.climbCount===1?"":"en"}`:null].filter(g=>g!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,c=o!=null?i[o]??"":"",l=c?` · ${c}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${r}${n?` · ${n}`:""}${l}`;const p=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=Bp,m=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,u=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=Hp;if(p||m||u){const g=performance.now();this.detailSnapshot=((f=this.engine)==null?void 0:f.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-g)}if(p&&this.detailSnapshot){const g=this.elements.profile.querySelector(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop);const v=performance.now();rd(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-v),this.lastProfileRenderTime=t;const h=this.elements.profile.querySelector(".race-sim-timing-scroll");h&&(h.scrollTop=this.timingScrollTop)}if(m&&this.detailSnapshot){this.lastSidebarRenderTime=t;const g=performance.now(),v=qn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(v);const h=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",h),this.scheduleSidebarPaintTelemetry(g,h)}u&&this.detailSnapshot&&(_n(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),Pu(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),Ru(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),Dn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const r=a.find(s=>s.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(r)return r.label}return this.selectedGroupLabel!=null&&a.some(r=>r.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return Cs(Is(t.clusters))}resolveInitialGroupLabel(t){var a,r;return((a=t.find(s=>s.label==="P"))==null?void 0:a.label)??((r=t[0])==null?void 0:r.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(r=>[r.riderId,r]));return[...t.riderIds].sort((r,s)=>{var n,i;return(((n=a.get(r))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(s))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||r-s})[0]??null}selectGroupByLabel(t,a,r=!0){const s=this.buildRaceGroups(a),n=s.find(i=>i.label===t)??s.find(i=>i.label==="P")??s[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),r&&(this.profileInteractionHoldUntilMs=performance.now()+Ot,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const s=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;s&&(this.selectedGroupLabel=s.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+Ot,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+zp,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const r=t.dataset.raceSimGroupRiderName;if(!r)return null;const s=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===r&&(s==null||i.activeTeamId===s))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const r=this.perfTelemetry[t];this.perfTelemetry[t]=r<=0?a:r*(1-di)+a*di}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const r=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(r!==this.sidebarPaintSequence)return;const s=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",s),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||Dn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const at="__stage_overview__",Go="__non_finishers__",Ko="__events__",Oo="__roster__";let Be="all";function Ks(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function ci(e){return Ks(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function Kp(e){return[...e].sort((t,a)=>ci(t)-ci(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function Op(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=Ks(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function Wp(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function jp(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${ie(t.date)}`}async function us(e,t){var s;const a=Sa(e);if(a&&(d.selectedResultsRaceId=a.race.id,d.selectedResultsStageId=e),d.riders.length===0){const n=await V.getRiders();n.success&&(d.riders=n.data??[])}const r=await V.getStageResults(e);if(!r.success){d.stageResults=null,Ce(),!t&&r.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+r.error);return}d.stageResults=r.data??null,d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId,d.selectedResultTypeId=((s=d.stageResults.classifications[0])==null?void 0:s.resultTypeId)??1,d.selectedResultsMarkerKey=at,d.selectedResultsSpecialView=null),d.selectedResultsRaceId!=null&&Wo(d.selectedResultsRaceId),Ce()}async function Wo(e){if(!d.seasonStandings){const a=await V.getSeasonStandings();a.success&&a.data&&(d.seasonStandings=a.data)}const t=await V.getRaceResultsRoster(e);t.success&&t.data?d.resultsRoster=t.data:d.resultsRoster=null}function Vp(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function ui(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function Up(){const e=d.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=bt(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=[...e.entries].sort((h,b)=>b.overallRating-h.overallRating),s=new Set(r.slice(0,5).map(h=>h.riderId)),n=h=>{var $;const b=d.riders.find(M=>M.id===h);return(($=b==null?void 0:b.skills)==null?void 0:$.sprint)??0},o=[...e.entries.filter(h=>!s.has(h.riderId))].sort((h,b)=>{const $=n(h.riderId),M=n(b.riderId);return M!==$?M-$:b.overallRating-h.overallRating}),c=new Set(o.slice(0,5).map(h=>h.riderId));function l(h){switch(h){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return h}}const p=new Map;for(const h of e.entries){const b=h.teamId;p.has(b)||p.set(b,{teamId:h.teamId,teamName:h.teamName,riders:[],avgRating:0}),p.get(b).riders.push(h)}for(const h of p.values())h.avgRating=h.riders.reduce((b,$)=>b+$.overallRating,0)/h.riders.length;const m=h=>{let b=Number.POSITIVE_INFINITY;for(const $ of h)!$.hasDropped&&$.gcRank!=null&&$.gcRank<b&&(b=$.gcRank);return b},u=h=>{var $;if(!(($=d.seasonStandings)!=null&&$.riderStandings))return 0;let b=0;for(const M of h){const T=d.seasonStandings.riderStandings.find(x=>x.riderId===M.riderId);T&&T.points>b&&(b=T.points)}return b},f=h=>{if(h==null)return 0;const b=d.riders.filter(T=>T.activeTeamId===h);if(b.length===0)return 0;const $=b.map(T=>T.overallRating??0);$.sort((T,x)=>x-T);const M=$.slice(0,10);return M.length===0?0:M.reduce((T,x)=>T+x,0)/M.length},g=[...p.values()].sort((h,b)=>{const $=m(h.riders),M=m(b.riders);if(($!==Number.POSITIVE_INFINITY||M!==Number.POSITIVE_INFINITY)&&$!==M)return $-M;const T=u(h.riders),x=u(b.riders);if((T>0||x>0)&&T!==x)return x-T;const R=f(h.teamId),w=f(b.teamId);return Math.abs(R-w)>1e-4?w-R:(h.teamName??"").localeCompare(b.teamName??"","de")});for(const h of g)h.riders.sort((b,$)=>ui(b.roleId)-ui($.roleId)||$.overallRating-b.overallRating||b.lastName.localeCompare($.lastName,"de"));return`<div class="results-roster-grid">${g.map(h=>{const b=h.teamId!=null?_e(h.teamId,h.teamName):"",$=h.riders.map(T=>{var W;const x=Vp(T.roleId),R=T.countryCode?ze[T.countryCode]??T.countryCode.slice(0,2).toLowerCase():null,w=R?`<span class="fi fi-${R} results-roster-flag" title="${S(T.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',E=`${T.firstName.charAt(0)}. ${T.lastName}`,F=T.roleName??"–",A=T.specialization1?l(T.specialization1):null,_=T.specialization2?l(T.specialization2):null;let z=F;A&&(z+=` · ${A}`),_&&(z+=` · ${_}`);const O=`<span class="results-roster-overall-badge" style="color:${Yp(T.overallRating)}" title="Gesamtstärke: ${T.overallRating.toFixed(2)}">${T.overallRating.toFixed(2)}</span>`,G=T.hasDropped?" dropped":"";let C="";T.hasDropped?T.dropoutStatus==="dns"?C="DNS":T.dropoutStatus==="dnf"?C=((W=T.dropoutReason)==null?void 0:W.startsWith("OTL"))??!1?"OTL":"DNF":C="OUT":T.gcRank!=null&&(C=`${T.gcRank}`);let H="";if(T.hasDropped)H=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${S(T.dropoutReason||"")}">${C}</span>`;else if(T.gcRank!=null){let P="rider-stats-rank-badge-gc";T.gcRank===1?P="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":T.gcRank===2?P="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":T.gcRank===3&&(P="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),H=`<span class="rider-stats-rank-badge ${P}" title="GC Stand: Platz ${T.gcRank}">${T.gcRank}</span>`}const j=`style="color: ${T.hasDropped?"var(--text-500)":x.color}; font-weight: bold;"`,X=s.has(T.riderId),J=c.has(T.riderId);return`<div class="results-roster-rider${G}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${w}
            <span class="results-roster-name${X?" strongest-rider":J?" best-sprinter":""}">
              ${Ne(E,{riderId:T.riderId,teamId:T.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${Qa(T.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${j}>${S(z)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${H||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${O}
        </div>
      </div>`}).join(""),M=h.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${b}</div>
        <div class="results-roster-team-name" title="${S(h.teamName??"–")}">${Ze(h.teamName??"–",h.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${M})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${$}</div>
    </div>`}).join("")}</div>`}function Yp(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function Zp(e){var l,p;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=d.stageResults)==null?void 0:l.classifications.find(m=>m.resultTypeId===1),a=new Set(t?t.rows.map(m=>m.riderId).filter(m=>m!=null):[]),r=d.riders.filter(m=>m.activeTeamId===e.teamId&&a.has(m.id)),s=new Set((((p=d.stageResults)==null?void 0:p.nonFinishers)??[]).map(m=>m.riderId)),n=[];for(const m of r){if(m.id===e.riderId||s.has(m.id))continue;let u=0;const f=m.skills.sprint>=72,g=m.skills.flat>=78,v=m.skills.timeTrial>=76,h=m.skills.acceleration>=80;if(f&&u++,g&&u++,v&&u++,h&&u++,u>0){let b=1;u===2?b=1.25:u===3?b=1.5:u===4&&(b=2),n.push({id:m.id,firstName:m.firstName,lastName:m.lastName,countryCode:m.nationality??null,isSprinter:f,multiplier:b,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const m=n.filter(h=>h.isSprinter).reduce((h,b)=>h+b.multiplier,0),u=n.filter(h=>!h.isSprinter).reduce((h,b)=>h+b.multiplier,0);let f=0,g=0;m>0&&u>0?(f=i/(2.125*m+u),g=2.125*f,f=Math.max(.1,Math.min(.3,f)),g=Math.max(.25,Math.min(.6,g))):m>0?(g=i/m,g=Math.max(.25,Math.min(.6,g)),f=g/2.125):u>0&&(f=i/u,f=Math.max(.1,Math.min(.3,f)),g=2.125*f);for(const h of n)h.contribution=h.isSprinter?g*h.multiplier:f*h.multiplier;const v=n.reduce((h,b)=>h+b.contribution,0);if(v>0){const h=i/v;for(const b of n)b.contribution*=h}n.sort((h,b)=>b.contribution-h.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),c=n.map(m=>{const u=rt(wt(m.id)??m.countryCode),f=m.firstName?`${m.firstName.charAt(0)}. ${m.lastName}`:m.lastName,g=m.contribution.toFixed(2).replace(".",",");return`
      <div class="leadout-bonus-popover-grid">
        <span class="results-flag-col-cell">${u}</span>
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
        ${c}
      </div>
    </div>
  `}function mi(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function Qa(e){var m,u,f,g,v,h,b,$,M,T;if(e==null||!d.stageResults)return"";const t=bt(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=d.stageResults.classifications,s=(u=(m=r.find(x=>x.resultTypeId===ma))==null?void 0:m.rows.find(x=>x.rank===1))==null?void 0:u.riderId,n=(g=(f=r.find(x=>x.resultTypeId===nr))==null?void 0:f.rows.find(x=>x.rank===1))==null?void 0:g.riderId,i=(h=(v=r.find(x=>x.resultTypeId===ks))==null?void 0:v.rows.find(x=>x.rank===1))==null?void 0:h.riderId,o=($=(b=r.find(x=>x.resultTypeId===5))==null?void 0:b.rows.find(x=>x.rank===1))==null?void 0:$.riderId,c=(T=(M=r.find(x=>x.resultTypeId===7))==null?void 0:M.rows.find(x=>x.rank===1))==null?void 0:T.riderId,l=[],p=d.selectedResultTypeId;return e===s&&(p===ma||p===1&&a||p!==1&&p!==ma)&&l.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&l.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&l.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&l.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===c&&l.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>'),l.length===0?"":`<span class="jersey-dots-wrapper">${l.join("")}</span>`}function pi(e){if(!e)return"";let t=e;const a=[],r=[...d.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of r){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),c=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");c.test(t)&&(t=t.replace(c,l=>{const p=`__RIDER_LINK_${a.length}__`,m=Ne(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(m),p}))}let s=S(t);for(let n=0;n<a.length;n++)s=s.replace(`__RIDER_LINK_${n}__`,a[n]);return s}function Ce(){var L,N,Y,K;d.riders.length===0&&V.getRiders().then(k=>{k.success&&k.data&&(d.riders=k.data,Ce())});const e=y("results-race-select"),t=y("results-stage-select"),a=y("results-type-tabs"),r=y("results-marker-tabs"),s=y("results-stage-meta"),n=y("results-empty"),i=y("results-table"),o=i.querySelector("thead tr"),c=y("results-tbody"),l=y("results-marker-classifications"),p=y("results-roster"),m=i.querySelector("colgroup");m&&m.remove(),i.style.tableLayout="",d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+d.races.filter(k=>{var I;return(((I=k.stages)==null?void 0:I.length)??0)>0}).map(k=>`<option value="${k.id}"${k.id===d.selectedResultsRaceId?" selected":""}>${S(k.name)}</option>`).join("");const u=bt(d.selectedResultsRaceId),f=u==null?"":(u.stages??[]).map(k=>`<option value="${k.id}"${k.id===d.selectedResultsStageId?" selected":""}>${S(jp(u,k))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+f;const g=((L=d.stageResults)==null?void 0:L.classifications.filter(k=>!(u&&!u.isStageRace&&k.resultTypeId!==1&&k.resultTypeId!==6)))??[],v=g.find(k=>k.resultTypeId===d.selectedResultTypeId)??g[0]??null,h=d.selectedResultsSpecialView==="nonFinishers",b=d.selectedResultsSpecialView==="events",$=d.selectedResultsSpecialView==="roster";if(v&&!h&&!b&&!$&&(d.selectedResultTypeId=v.resultTypeId),b){i.style.tableLayout="fixed";const k=document.createElement("colgroup");k.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(k,i.firstChild)}if(!d.stageResults&&!$||!v&&!h&&!b&&!$){const k=Sa(d.selectedResultsStageId);s.textContent=k?`${k.race.name} · ${k.stage.profile} · ${ie(k.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",r.innerHTML="",r.classList.add("hidden"),c.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),p.innerHTML="",p.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=d.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}$?d.resultsRoster&&(s.textContent=`${d.resultsRoster.raceName} · Starterfeld`):d.stageResults&&(s.textContent=`${d.stageResults.raceName} · Etappe ${d.stageResults.stageNumber} · ${d.stageResults.profile} · ${ie(d.stageResults.date)}`);const M=d.stageResults?Sa(d.stageResults.stageId):null,T=(M==null?void 0:M.stage.distanceKm)??null,x=new Map,R=new Map,w=new Map;if(d.stageResults){const k=d.stageResults.classifications.find(I=>I.resultTypeId===1);if(k)for(const I of k.rows)I.riderId!=null&&I.points!=null&&I.points>0&&x.set(I.riderId,I.points),I.riderId!=null&&I.breakawayKms!=null&&I.breakawayKms>0&&w.set(I.riderId,I.breakawayKms);if(d.stageResults.markerClassifications){for(const I of d.stageResults.markerClassifications)if(Ks(I.markerType,I.markerCategory)){for(const D of I.entries)if(D.riderId!=null&&D.pointsAwarded!=null&&D.pointsAwarded>0){const B=R.get(D.riderId)??0;R.set(D.riderId,B+D.pointsAwarded)}}}}const E=(v==null?void 0:v.resultTypeId)===ma,F=(v==null?void 0:v.resultTypeId)===nr||(v==null?void 0:v.resultTypeId)===ks,A=(v==null?void 0:v.resultTypeId)===5,_=(v==null?void 0:v.resultTypeId)===6,z=(v==null?void 0:v.resultTypeId)===7,O=E||F||A||_||z,G=g.map(k=>`
    <button
      type="button"
      class="results-type-btn${!h&&!b&&!$&&k.resultTypeId===d.selectedResultTypeId?" active":""}"
      data-result-type-id="${k.resultTypeId}"
    >${S(k.resultTypeName)}</button>
  `),C=`
    <button
      type="button"
      class="results-type-btn${h?" active":""}"
      data-results-special-view="${Go}"
    >OTL/DNF</button>
  `,H=`
    <button
      type="button"
      class="results-type-btn${b?" active":""}"
      data-results-special-view="${Ko}"
    >Ereignisse</button>
  `,U=`
    <button
      type="button"
      class="results-type-btn${$?" active":""}"
      data-results-special-view="${Oo}"
    >Teilnehmer</button>
  `,j=g.findIndex(k=>k.resultTypeName.toLocaleLowerCase("de").includes("team"));j>=0?G.splice(j+1,0,C,H,U):G.push(C,H,U),a.innerHTML=G.join("");const X=Kp(((N=d.stageResults)==null?void 0:N.markerClassifications)??[]);if($){p.innerHTML=Up(),p.classList.remove("hidden"),i.classList.add("hidden"),r.innerHTML="",r.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else p.innerHTML="",p.classList.add("hidden");const J=!h&&!b&&!$&&(v==null?void 0:v.resultTypeId)===1&&X.length>0,te=J?d.selectedResultsMarkerKey??at:null,W=J&&te!==at?X.find(k=>k.markerKey===te)??null:null;if(J&&(d.selectedResultsMarkerKey=(W==null?void 0:W.markerKey)??at),b){const k=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"},{key:"superteam",label:"Superteam"}];r.innerHTML=k.map(I=>`
      <button
        type="button"
        class="results-type-btn${I.key===Be?" active":""}"
        data-event-filter="${I.key}"
      >${S(I.label)}</button>
    `).join("")}else r.innerHTML=J?[`
        <button
          type="button"
          class="results-type-btn${d.selectedResultsMarkerKey===at?" active":""}"
          data-marker-key="${at}"
        >Tageswertung</button>`,...X.map(k=>`
        <button
          type="button"
          class="results-type-btn${k.markerKey===d.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${k.markerKey}"
        >${S(Op(k))}</button>
      `)].join(""):"";r.classList.toggle("hidden",!b&&!J);const P=h||b||!J||d.selectedResultsMarkerKey===at;if(o&&P&&(o.innerHTML=h?`
        <th>Etappe</th>
        <th>Status</th>
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Grund</th>
      `:b?`
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
        `:z?`
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
        ${O?"<th>Trend</th>":""}
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
        <th class="results-points-cell">Punktewertung</th>
        <th>UCI Punkte</th>
      `),c.innerHTML=h?(((Y=d.stageResults)==null?void 0:Y.nonFinishers)??[]).map(k=>`
      <tr>
        <td>${k.stageNumber}</td>
        <td>${Pi(k.isOtl)}</td>
        <td class="results-jersey-col-cell">${jt(k.teamId,k.teamName)}</td>
        <td>${Vt(k.riderName,!0,!1,k.riderId,k.teamId)}</td>
        <td class="results-flag-col-cell">${rt(k.countryCode)}</td>
        <td>${Ze(k.teamName||"–",k.teamId)}</td>
        <td>${S(ir(k.statusReason,k.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':b?[...((K=d.stageResults)==null?void 0:K.events)??[]].filter(k=>Be==="all"?!0:Be==="form"?!!(k.title&&(k.title.includes("guten Tag")||k.title.includes("schlechten Tag")||k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))):Be==="attack"?(k.type==="attack"||k.type==="counter_attack")&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Be==="breakaway"?!!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Be==="incident"?(k.type==="incident"||!!(k.title&&k.title.includes("Massensturz")))&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Be==="exit"?k.type==="dnf"||!!(k.title&&k.title.includes("nicht am Start")):Be==="home"?!!(k.title&&(k.title.includes("Heimvorteil")||k.title.includes("Heimdruck"))):Be==="weather"?!!(k.title&&k.title.startsWith("Wetterbericht:")):Be==="superteam"?k.type==="superteam":!0).sort((k,I)=>{const D=k.kmMark??0,B=I.kmMark??0;if(Math.abs(D-B)>1e-4)return D-B;if(D===0){const fe=mi(k),ge=mi(I);if(fe!==ge)return fe-ge}const Z=k.riderName??"",ne=I.riderName??"";return Z.localeCompare(ne,"de")}).map(k=>{var oa,vt,la;const I=k.kmMark!=null?`${k.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",D=k.riderId,B=D!=null?Me(D):null,Z=k.riderTeamId??(B==null?void 0:B.activeTeamId)??null,ne=Z!=null?((oa=d.teams.find(we=>we.id===Z))==null?void 0:oa.name)??null:null;let fe=jt(Z,ne);const ge=!!(k.title&&k.title.startsWith("Wetterbericht:"));let Te=k.title||"";if(ge){const we=(vt=d.stageResults)==null?void 0:vt.rolledWeatherId,Ft=(la=d.stageResults)==null?void 0:la.rolledWetterName;fe=`<span class="results-jersey-cell">${xa(we,Ft)}</span>`,Ft&&(Te=`Wetterbericht: ${Ft}`)}const ve=k.type==="superteam",he=ve&&D==null,Se=ge||he?"":rt(D!=null?wt(D):null),tt=ge?"":he?Ze(ne||"–",Z):D!=null?Vt(k.riderName??"",!0,!1,D,Z):S(k.riderName||"–");let le="";return k.title&&k.title.includes("guten Tag")?le='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':k.title&&k.title.includes("schlechten Tag")?le='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':k.title&&(k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))?le='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':k.title&&k.title.includes("nicht am Start")?le='<span class="event-badge event-badge-dns">DNS</span>':k.title&&k.title.includes("Massensturz")?le='<span class="event-badge event-badge-masscrash">Massensturz</span>':k.type==="dnf"?le='<span class="event-badge event-badge-dnf">DNF</span>':k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))?le='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':k.type==="attack"?le='<span class="event-badge event-badge-attack">Attacke</span>':k.type==="counter_attack"?le='<span class="event-badge event-badge-counter">Konterattacke</span>':k.type==="incident"?k.title&&(k.title.toLowerCase().includes("defekt")||k.title.toLowerCase().includes("panne")||k.title.toLowerCase().includes("technisch"))?le='<span class="event-badge event-badge-defect">Defekt</span>':le='<span class="event-badge event-badge-crash">Sturz</span>':k.title&&k.title.includes("Super-Heimvorteil")?le='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>':k.title&&k.title.includes("Heimdruck")?le='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>':k.title&&k.title.includes("Heimvorteil")?le='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':k.title&&k.title.startsWith("Wetterbericht:")?le='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>':ve&&(le='<span class="event-badge event-badge-superteam"><span class="event-icon">⚡</span> Superteam</span>'),`
          <tr>
            <td>${I}</td>
            <td>
              <div class="event-rider-info">
                ${fe}
                ${Se}
                ${tt}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${pi(Te)}</span>
                  ${le}
                </div>
                ${k.detail?`<div class="event-detail">${pi(k.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':P&&v?v.rows.map(k=>{const I=k.riderName??k.teamName,D=k.riderName?k.teamName:"–",B=jt(k.teamId,k.teamName),Z=Vt(I,!0,k.isBreakaway===!0,k.riderId,k.teamId),ne=rt(wt(k.riderId)),fe=v.resultTypeId===1&&k.rank===1&&k.timeSeconds!=null&&T!=null,ge=k.timeSeconds!=null?`${va(k.timeSeconds)}${fe?` (${Wp(T,k.timeSeconds)})`:""}`:"–",Te=O?`<td class="results-gc-delta-cell">${or(k.previousRank,k.rankDelta)}</td>`:"";if(F){let he=k.points!=null?String(k.points):"–";if(k.points!=null&&k.riderId!=null&&v){const tt=v.resultTypeId===nr?x.get(k.riderId)??0:R.get(k.riderId)??0;tt>0&&(he+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${tt}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Te}
            <td class="results-jersey-col-cell">${B}</td>
            <td>${Z}${Qa(k.riderId)}</td>
            <td class="results-flag-col-cell">${ne}</td>
            <td>${Ze(D,k.teamId)}</td>
            <td class="results-points-cell">${he}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(z){let he=k.breakawayKms!=null?`${k.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if(k.breakawayKms!=null&&k.riderId!=null){const Se=w.get(k.riderId)??0;Se>0&&(he+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${Se.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Te}
            <td class="results-jersey-col-cell">${B}</td>
            <td>${Z}${Qa(k.riderId)}</td>
            <td class="results-flag-col-cell">${ne}</td>
            <td>${Ze(D,k.teamId)}</td>
            <td class="results-points-cell">${he}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(_)return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Te}
            <td class="results-jersey-col-cell">${B}</td>
            <td>${Ze(k.teamName,k.teamId)}</td>
            <td class="results-flag-col-cell">${ne}</td>
            <td>${ge}</td>
            <td>${S(Za(k.gapSeconds))}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`;let ve=k.points!=null?String(k.points):"–";if(k.leadoutBonus!=null&&k.leadoutBonus>0&&k.leadoutRiderId!=null){const he=Zp(k);ve=`
          <div class="leadout-bonus-anchor">
            ${k.points!=null?k.points:"–"}
            ${he}
          </div>
        `}return`
        <tr>
          <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
          ${Te}
          <td class="results-jersey-col-cell">${B}</td>
          <td>${Z}${Qa(k.riderId)}</td>
          <td class="results-flag-col-cell">${ne}</td>
          <td>${Ze(D,k.teamId)}</td>
          <td>${ge}</td>
          <td>${S(Za(k.gapSeconds))}</td>
          <td class="results-points-cell">${ve}</td>
          <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
        </tr>`}).join(""):"",n.classList.toggle("hidden",!!v||h||b||$),i.classList.toggle("hidden",!P||$),W){const k=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${S(Ni(W.markerType,W.markerLabel))}</h4>
          <div class="results-marker-card-meta">${S(`${W.kmMark.toFixed(1).replace(".",",")} km${W.markerCategory?` · Kat. ${W.markerCategory}`:""}`)}</div>
        </div>
      </section>`,I=W.entries.map(D=>{var fe;const B=Me(D.riderId),Z=B?`${B.firstName} ${B.lastName}`:`Fahrer ${D.riderId}`,ne=(B==null?void 0:B.activeTeamId)!=null?((fe=d.teams.find(ge=>ge.id===B.activeTeamId))==null?void 0:fe.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${D.rank}.</div>
          <div class="results-marker-jersey">${jt(B==null?void 0:B.activeTeamId,ne)}</div>
          <div class="results-marker-name">${Vt(Z,!1,!1,(B==null?void 0:B.id)??null,(B==null?void 0:B.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${rt(wt(B==null?void 0:B.id))}</div>
          <div class="results-marker-time">${S(va(D.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${S(Za(D.gapSeconds))}</div>
          <div class="results-marker-points">${D.pointsAwarded!=null&&D.pointsAwarded>0?D.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${k}<div class="results-marker-list">${I}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!W)}function Jp(){y("results-race-select").addEventListener("change",e=>{var r,s;const t=e.target.value;d.selectedResultsRaceId=t?Number(t):null;const a=bt(d.selectedResultsRaceId);d.selectedResultsStageId=((s=(r=a==null?void 0:a.stages)==null?void 0:r[0])==null?void 0:s.id)??null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=at,d.selectedResultsSpecialView=null,d.stageResults=null,Ce(),d.selectedResultsStageId!=null&&us(d.selectedResultsStageId,!0)}),y("results-stage-select").addEventListener("change",e=>{const t=e.target.value;d.selectedResultsStageId=t?Number(t):null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=at,d.selectedResultsSpecialView=null,d.stageResults=null,Ce(),d.selectedResultsStageId!=null&&us(d.selectedResultsStageId,!0)}),y("results-type-tabs").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-result-type-id]");if(t){d.selectedResultsSpecialView=null,d.selectedResultTypeId=Number(t.dataset.resultTypeId),Ce();return}const a=e.target.closest("button[data-results-special-view]");if(a){const s=a.dataset.resultsSpecialView;s===Go?(d.selectedResultsSpecialView="nonFinishers",Ce()):s===Ko?(d.selectedResultsSpecialView="events",Be="all",Ce()):s===Oo&&(d.selectedResultsSpecialView="roster",d.selectedResultsRaceId!=null&&((r=d.resultsRoster)==null?void 0:r.raceId)!==d.selectedResultsRaceId&&Wo(d.selectedResultsRaceId).then(()=>Ce()),Ce())}}),y("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const r=t.dataset.markerKey;d.selectedResultsMarkerKey=r??at,Ce();return}const a=e.target.closest("button[data-event-filter]");a&&(Be=a.dataset.eventFilter??"all",Ce())})}const Os=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],Ea=["skills","form","profile","preferences"],Ws=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],js={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...Os.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function Vs(){return[...Ws,...js[d.teamDetailPage]]}function jo(e,t=12){const a=d.riders.filter(s=>s.activeTeamId===e).sort((s,n)=>n.overallRating-s.overallRating).slice(0,t);return a.length===0?null:a.reduce((s,n)=>s+n.overallRating,0)/a.length}function Vo(e){const t=d.riders.filter(r=>r.activeTeamId===e);return t.length===0?null:t.reduce((r,s)=>r+s.overallRating,0)/t.length}function Uo(e){const t=jo(e);return t==null?"–":t.toFixed(2).replace(".",",")}function Yo(e){const t=Vo(e);return t==null?"–":t.toFixed(2).replace(".",",")}function se(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function Ee(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:se(e,t)}function $e(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function Fe(e){return e==null?void 0:typeof e=="string"?Zt(e):e.name}function Us(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...Os.map(t=>t.key)].includes(e)?"desc":"asc"}function Zo(e){return d.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function Jo(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Zo(e.sortKey)}
      </button>
    </th>`}function qo(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${Ea.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const Xo={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function Ys(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":Xo[e]??String(e)}function Qo(e){const t=[...e],a=d.teamTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(d.teamTableSort.key){case"name":n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName);break;case"countryCode":n=se(Rt(r),Rt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=se(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=se(ht(r),ht(s));break;case"riderType":n=se(r.riderType,s.riderType)||se(Le(r),Le(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Ee(Fe(r.specialization1),Fe(s.specialization1));break;case"specialization2":n=Ee(Fe(r.specialization2),Fe(s.specialization2));break;case"specialization3":n=Ee(Fe(r.specialization3),Fe(s.specialization3));break;case"peak1":n=Ee($e(r,0),$e(s,0));break;case"peak2":n=Ee($e(r,1),$e(s,1));break;case"peak3":n=Ee($e(r,2),$e(s,2));break;default:n=r.skills[d.teamTableSort.key]-s.skills[d.teamTableSort.key];break}return n===0&&(n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName)),n*a}),t}function el(e){const t=[...e],a=d.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(d.riderMenuTableSort.key){case"name":n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName);break;case"countryCode":n=se(Rt(r),Rt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=se(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=se(ht(r),ht(s));break;case"riderType":n=se(r.riderType,s.riderType)||se(Le(r),Le(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Ee(Fe(r.specialization1),Fe(s.specialization1));break;case"specialization2":n=Ee(Fe(r.specialization2),Fe(s.specialization2));break;case"specialization3":n=Ee(Fe(r.specialization3),Fe(s.specialization3));break;case"peak1":n=Ee($e(r,0),$e(s,0));break;case"peak2":n=Ee($e(r,1),$e(s,1));break;case"peak3":n=Ee($e(r,2),$e(s,2));break;default:n=r.skills[d.riderMenuTableSort.key]-s.skills[d.riderMenuTableSort.key];break}return n===0&&(n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName)),n*a}),t}function ms(e){return e.length===0?"–":e.map(t=>{const a=d.races.find(r=>r.id===t);return a?S(a.name):`Rennen ${t}`}).join(", ")}function qp(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function Zs(e,t){var a,r;switch(t.id){case"name":return`<td class="team-table-name-cell">${Ne(Le(e),{riderId:e.id,teamId:e.activeTeamId,strong:d.teamDetailPage==="form"||d.teamDetailPage==="profile"||d.teamDetailPage==="preferences"})}${Gi(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${oe(Rt(e))}<span>${S(Rt(e))}</span></span></td>`;case"age":return`<td>${e.age??(d.gameState?d.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${S(ht(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating.toFixed(2)}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${ns(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${Hi(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${ns((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${is(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${is(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${Ms(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${S($e(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${S($e(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${S($e(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${S(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?S(Zt(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?S(Zt(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?S(Zt(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${zi(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${oe(e.mentorCountryCode??"UNK")} <span>${S(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${ms(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${ms(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const s=t.sortKey;return s&&s in e.skills?`<td>${Bi(e.skills[s],(a=e.yearStartSkills)==null?void 0:a[s],(r=e.potentials)==null?void 0:r[s])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function $r(){xe("Teams/Fahrer werden aktualisiert...");try{const e=!ke("riders"),t=await V.getRiders(void 0,e);if(t.success&&(d.riders=t.data??[]),await V.getTeams().then(a=>{a.success&&(d.teams=a.data??[])}),ke("teams")&&Js(),ke("riders")){const{renderRidersMenu:a}=await qa(async()=>{const{renderRidersMenu:r}=await Promise.resolve().then(()=>kg);return{renderRidersMenu:r}},void 0);a()}}finally{ye()}}async function Xp(e={}){const t=await V.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),y("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${S(t.error??"Unbekannt")}</p>`;return}d.teams=t.data??[],e.render!==!1&&ke("teams")&&Js()}function Js(){const e=y("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+d.teams.map(r=>`<option value="${r.id}"${String(r.id)===t?" selected":""}>${S(r.name)} (${S(r.division??r.divisionName??"")}) · ${S(r.abbreviation)}</option>`).join("");const a=t?Number(t):null;ha(a)}function ha(e){const t=y("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=d.teams.find(i=>i.id===e);if(!a){t.innerHTML="";return}const r=Qo(d.riders.filter(i=>i.activeTeamId===e)),s=a.division==="U23"?"badge-u23":"badge-classics",n=Vs();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${S(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${s}">${S(a.division??a.divisionName??"")}</span>
          <span>${Li(a.country,a.countryCode)}</span>
          <span>Kürzel: ${S(a.abbreviation)} · Top 12 ${S(Uo(a.id))} (${S(Yo(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(Ys(d.teamTableSort.key))} ${d.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${qo()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${n.map(Jo).join("")}
          </tr></thead>
          <tbody>
            ${r.length===0?`<tr><td colspan="${n.length}" class="text-muted">Keine Fahrer.</td></tr>`:r.map(i=>`
                <tr class="team-detail-row">
                  ${n.map(o=>Zs(i,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function tl(){y("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;d.teamDetailPage="skills",ha(t?Number(t):null)}),y("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&en(s);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const s=a.dataset.teamDetailPage;if(Ea.includes(s)){d.teamDetailPage=s,new Set(Vs().map(o=>o.sortKey).filter(o=>o!=null)).has(d.teamTableSort.key)||(d.teamTableSort={key:"name",direction:"asc"});const i=Number(y("teams-dropdown").value);ha(Number.isFinite(i)?i:null)}return}const r=e.target.closest("button[data-team-sort]");if(r){const s=r.dataset.teamSort;d.teamTableSort.key===s?d.teamTableSort.direction=d.teamTableSort.direction==="asc"?"desc":"asc":d.teamTableSort={key:s,direction:Us(s)};const n=Number(y("teams-dropdown").value);ha(Number.isFinite(n)?n:null);return}})}const Qp=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:js,TEAM_DETAIL_PAGE_ORDER:Ea,TEAM_SKILL_COLUMNS:Os,TEAM_SKILL_TITLES:Xo,TEAM_TABLE_COLUMNS:Ws,compareOptionalStrings:Ee,compareStrings:se,formatTeamAverage:Yo,formatTeamTopAverage:Uo,getActiveTeamTableColumns:Vs,getDefaultTeamSortDirection:Us,getPeakDate:$e,getSortIndicator:Zo,getSpecializationSortLabel:Fe,getTeamAverage:Vo,getTeamSortLabel:Ys,getTeamTopAverage:jo,initTeamsListeners:tl,loadTeams:Xp,refreshTeamsViewData:$r,renderPeakDatesSummary:qp,renderRacePrefs:ms,renderTeamDetail:ha,renderTeamDetailPageTabs:qo,renderTeamTableCell:Zs,renderTeamTableHeader:Jo,renderTeams:Js,sortRiderMenuRiders:el,sortTeamRiders:Qo},Symbol.toStringTag,{value:"Module"}));function eg(e,t,a){return`${e} · Etappe ${t} · ${a}`}function al(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function rl(e,t){const a=[];for(const r of e.riders)if(r.leadoutBonus!=null&&r.leadoutBonus>0&&r.leadoutContributions&&r.leadoutContributions.length>0){const s=t.riders.find(i=>i.id===r.riderId),n=(s==null?void 0:s.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:r.riderId,leadoutBonus:r.leadoutBonus,contributorsJson:JSON.stringify(r.leadoutContributions)})}return a}async function sl(e,t=!1){if(vs!=null||Mr)return!1;as(e),Ai(0);try{const a=await V.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const r=a.data;d.realtimeBootstrap=r;const s=await Hc(r,o=>xs(o)),n=al(s,r),i=rl(s,r);return await cl(e,n,s.markerClassifications,s.incidents,s.allEvents,t,i,s.superTeamId),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{as(null),ye()}}function nl(e){var r;const t=(r=d.rosterEditor)==null?void 0:r.teams.find(s=>s.team.id===e);if(!t)return 0;const a=new Set(d.rosterEditorSelectedRiderIds);return t.riders.filter(s=>a.has(s.rider.id)).length}function il(){return d.rosterEditor?d.rosterEditor.teams.every(e=>nl(e.team.id)===e.riderLimit):!1}function qr(){const e=y("roster-editor-title"),t=y("roster-editor-meta"),a=y("roster-editor-body"),r=y("btn-apply-roster-editor"),s=d.rosterEditor;if(!s){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',r.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=s.race.isStageRace?`${s.race.name} · Etappe ${s.stage.stageNumber} · ${s.stage.profile}`:`${s.race.name} · ${s.stage.profile}`;const n=new Set(d.rosterEditorSelectedRiderIds);a.innerHTML=s.teams.map(i=>{const o=nl(i.team.id),c=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${S(i.team.name)}</h3>
            <p class="text-muted">${S(i.team.abbreviation)} · ${S(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${c}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var v;const m=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),u=l.rider.country?oe(l.rider.country.code3):"",f=[((v=l.rider.role)==null?void 0:v.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),g=l.lockReason?`<span class="roster-editor-rider-lock">${S(l.lockReason)}</span>`:"";return`
              <button
                type="button"
                class="${m}"
                data-roster-team-id="${i.team.id}"
                data-roster-rider-id="${l.rider.id}"
                ${l.isLocked?"disabled":""}
              >
                <span class="roster-editor-rider-name">${u}<span>${S(l.rider.firstName)} ${S(l.rider.lastName)}</span></span>
                <span class="roster-editor-rider-meta">${S(f)}</span>
                ${g}
              </button>`}).join("")}
        </div>
      </section>`}).join(""),r.disabled=!il()}function ps(){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],aa("roster-editor-error"),Ue("rosterEditor")}function ol(e,t){d.selectedRealtimeStageId=e.stage.id,d.realtimeBootstrap=e,d.realtimeError=null,t&&It("live-race"),ll().load(e,{autoplay:!0,resetSpeed:!0}),Qt()}function ll(){let e=Yt;if(!e){const t=y("race-sim-layout"),a=y("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new Gp({layout:t,emptyState:a,controlsHeader:y("race-sim-controls-header"),profile:y("race-sim-profile"),groupBox:y("race-sim-group-box"),messages:y("race-sim-messages-body"),favorites:y("race-sim-favorites-body"),sidebar:y("race-sim-sidebar-body"),controls:y("race-sim-controls"),meta:y("race-sim-stage-meta")},{onFinishRequested:(r,s)=>{const n=al(r,s),i=rl(r,s);cl(s.stage.id,n,r.markerClassifications,r.incidents,r.allEvents,!1,i,r.superTeamId)}}),Fi(e)}return e}async function tg(e){xe("Starterfeld wird geladen..."),aa("roster-editor-error");try{const t=await V.getRosterEditor(e);if(!t.success||!t.data){Mt("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),Xe("rosterEditor"),qr();return}d.rosterEditor=t.data,d.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(r=>r.isSelected).map(r=>r.rider.id)),qr(),Xe("rosterEditor")}catch(t){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],Mt("roster-editor-error",t.message),Xe("rosterEditor"),qr()}finally{ye()}}async function ag(){const e=d.rosterEditor;if(e){if(!il()){Mt("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}aa("roster-editor-error"),xe("Starterfeld wird übernommen...");try{const t=await V.applyRosterEditor(e.stage.id,{riderIds:d.rosterEditorSelectedRiderIds});if(!t.success||!t.data){Mt("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}ps(),ol(t.data,!0)}catch(t){Mt("roster-editor-error",t.message)}finally{ye()}}}function Qt(){var n,i;const e=y("race-sim-stage-select"),t=((n=d.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===d.selectedRealtimeStageId)||(d.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===d.selectedRealtimeStageId?" selected":""}>${S(eg(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const r=t.find(o=>o.stageId===d.selectedRealtimeStageId)??null,s=ll();if(!r){d.realtimeBootstrap=null,d.realtimeError=null,s.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!d.realtimeBootstrap||d.realtimeBootstrap.stage.id!==r.stageId)&&(d.realtimeError?s.clear(d.realtimeError):s.hide())}async function dl(e,t){if(sr!==e){rs(e),d.selectedRealtimeStageId=e,t&&It("live-race"),Qt(),xe("Live-Simulation wird geladen...");try{const a=await V.getRealtimeSimulation(e);if(!a.success||!a.data){d.realtimeBootstrap=null,d.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",Qt(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}ol(a.data,!1)}catch(a){d.realtimeBootstrap=null,d.realtimeError=a.message,Qt(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{sr===e&&rs(null),ye()}}}async function cl(e,t,a,r,s,n=!1,i,o){if(!Mr){ts(!0),xe("Live-Ergebnis wird gespeichert...");try{const c=await V.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:r,events:s,leadoutContributions:i,superTeamId:o});if(!c.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(c.error??"Unbekannter Fehler"));return}const l=c.data;d.selectedResultsRaceId=(l==null?void 0:l.raceId)??d.selectedResultsRaceId,d.selectedResultsStageId=(l==null?void 0:l.stageId)??e,d.selectedResultTypeId=1,d.realtimeBootstrap=null,d.realtimeError=null,await us(e,!1),await Xs(),await Qs(),(ke("teams")||ke("riders"))&&await $r(),Qt(),n||It("results")}catch(c){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+c.message)}finally{ts(!1),ye()}}}function rg(){y("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);d.selectedRealtimeStageId=Number.isFinite(t)?t:null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null),d.realtimeError=null,dl(t,!1)})}function qs(e){var r;const t=lt((r=e.category)==null?void 0:r.name),a=wa(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function Lr(e){var s,n;const t=lt((s=e.category)==null?void 0:s.name),a=wa(t),r=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${S(r)}</span>`}function sg(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(r=>r.date).sort((r,s)=>r.localeCompare(s));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function Dr(e){const{startDate:t,endDate:a}=sg(e);return t===a?ie(t):`${ie(t)} - ${ie(a)}`}function ng(e){return e.stageId>0}async function Xs(){const[e,t]=await Promise.all([V.getGameState(),V.getGameStatus()]);if(!e.success){console.error(e.error);return}d.gameState=e.data??null,d.gameStatus=t.success?t.data??null:null,ig(),ke("dashboard")&&_r()}function ig(){var s;if(!d.gameState)return;y("meta-date").textContent=d.gameState.formattedDate,y("meta-season").textContent=`Saison ${d.gameState.season}`;const e=y("meta-race-hint"),t=y("btn-advance-day"),a=y("pending-stages-list"),r=((s=d.gameStatus)==null?void 0:s.pendingStages)??[];r.length>0?(e.textContent=`${r.length} offene Etappe${r.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=r.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${ie(n.date)}`:`${n.profile} · ${ie(n.date)}`,o=ng(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
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
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):d.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function _r(){var t,a,r,s,n;const e=d.teams.find(i=>i.isPlayerTeam)??d.teams.find(i=>{var o;return i.name===((o=d.currentSave)==null?void 0:o.teamName)})??null;y("dashboard-career").textContent=((t=d.currentSave)==null?void 0:t.careerName)??"–",y("dashboard-team").textContent=(e==null?void 0:e.name)??((a=d.currentSave)==null?void 0:a.teamName)??"–",y("dashboard-date").textContent=((r=d.gameState)==null?void 0:r.formattedDate)??"–",y("dashboard-season").textContent=d.gameState?`Saison ${d.gameState.season}`:"–",y("dashboard-races-today").textContent=String(((s=d.gameStatus)==null?void 0:s.pendingStages.length)??((n=d.gameState)==null?void 0:n.racesTodayCount)??0),cg()}async function Qs(){const e=await V.getRaces();if(!e.success){console.error(e.error);return}d.races=e.data??[],ke("dashboard")&&_r(),og(),lg()}async function og(){var n;const e=(n=d.gameState)==null?void 0:n.season;if(!e||d.races.length===0)return;const t=`participantCountsLogged_${e}`;if(localStorage.getItem(t))return;const a=d.races.slice(0,30),r=await Promise.all(a.map(async i=>{var c;const o=await V.getRaceProgramParticipants(i.id);return{race:i,count:o.success?((c=o.data)==null?void 0:c.length)??0:-1}}));if(r.some(i=>i.count>0)){console.group(`[Velo] Teilnehmeranzahl Saison ${e}`);for(const{race:i,count:o}of r)o>=0&&console.log(`${i.name} (${i.startDate}): ${o} Programmfahrer`);console.groupEnd(),localStorage.setItem(t,"1")}}async function lg(){var i;const e=(i=d.gameState)==null?void 0:i.season;if(!e)return;const t=`programAssignmentsLogged_${e}`;if(localStorage.getItem(t))return;const a=await V.getRiders();if(!a.success||!a.data)return;const r=a.data,s=new Map;for(const o of r)if(o.seasonProgram){const c=o.seasonProgram;s.has(c.id)||s.set(c.id,{name:c.name,riders:[]}),s.get(c.id).riders.push(o)}if(s.size===0)return;console.group(`[Velo] Programmzuweisungen Saison ${e}`);const n=Array.from(s.keys()).sort((o,c)=>o-c);for(const o of n){const c=s.get(o);console.log(`Program: ${o} - ${c.name} (Count: ${c.riders.length})`)}console.groupEnd(),localStorage.setItem(t,"1")}function dg(e,t){const[a,r,s]=e.split("-").map(Number),n=new Date(a,r-1,s);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),c=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${c}`}function gi(e){var p,m,u,f;const t=d.gameState!=null&&e.startDate<=d.gameState.currentDate&&e.endDate>=d.gameState.currentDate,r=d.gameState!=null&&e.endDate<d.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',s=((p=e.country)==null?void 0:p.name)??`Land ${e.countryId}`,n=(m=e.country)!=null&&m.code3?oe(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((g,v)=>g+(v.distanceKm??0),0):((u=e.upcomingStage)==null?void 0:u.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((g,v)=>g+(v.elevationGainMeters??0),0):((f=e.upcomingStage)==null?void 0:f.elevationGainMeters)??null,c=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${ie(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${S(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${qs(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${S(s)}</span></span></td>
      <td>${Lr(e)}</td>
      <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${e.id}">Teilnehmer</button></td>
      <td>${c}</td>
      <td>${l}</td>
      <td>${r}</td>
    </tr>`}function cg(){const e=y("dashboard-races-tbody");if(!d.gameState){e.innerHTML='<tr><td colspan="9" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=d.gameState.currentDate,a=dg(t,7),r=d.races.filter(i=>i.startDate<=t&&i.endDate>=t),s=d.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>In Progress</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=r.map(i=>gi(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=s.map(i=>gi(i)).join(""),e.innerHTML=n}function Fa(e){return`Etappe ${e.stageNumber}`}function ug(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,r)=>r[1]!==a[1]?r[1]-a[1]:a[0].localeCompare(r[0])).map(([a,r])=>`${r}x ${a}`).join(" · ")}function mg(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function Pa(e){return`<span class="stage-profile-badge ${mg(e)}">${S(e)}</span>`}function Ar(e,t){return`${e.name} · ${Fa(t)} · ${t.profile}`}async function pg(e){var s;const t=d.stageSummariesByStageId[e];if(t)return t;const a=await V.getStageSummary(e);if(a.success&&a.data)return d.stageSummariesByStageId[e]=a.data,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],a.data;const r=await V.getRealtimeSimulation(e);return r.success&&((s=r.data)!=null&&s.stageSummary)?(d.stageSummariesByStageId[e]=r.data.stageSummary,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],r.data.stageSummary):(d.stageSummaryErrorsByStageId&&(d.stageSummaryErrorsByStageId[e]=a.error??r.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:r.error}),d.stageSummariesByStageId&&delete d.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function gg(){var c;const e=y("race-stages-title"),t=y("race-stages-meta"),a=y("race-stages-body"),r=bt(d.selectedDashboardRaceId);if(!r){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const s=r.stages??[],n=s.reduce((l,p)=>l+(p.distanceKm??0),0),i=s.reduce((l,p)=>l+(p.elevationGainMeters??0),0),o=ug(s);if(e.textContent=r.name,t.textContent=`${Dr(r)} · ${((c=r.country)==null?void 0:c.name)??`Land ${r.countryId}`} · ${r.isStageRace?`${r.numberOfStages} Etappen`:"Eintagesrennen"} · ${lr(n)} · ${dr(i)} · ${o}`,s.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
                <td><strong>${S(Fa(l))}</strong></td>
                <td>${Pa(l.profile)}</td>
                <td>${l.distanceKm!=null?lr(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?dr(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${S(Ar(r,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function gs(e){bt(e)&&(d.selectedDashboardRaceId=e,gg(),Xe("raceStages"))}function fg(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,r;return`
            <tr>
              <td>${Dr(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?oe(t.country.code3):""}<span>${S(((r=t.country)==null?void 0:r.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${S(t.name)}</strong></td>
              <td>${Lr(t)}</td>
              <td>${qs(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function en(e){const t=d.riders.find(r=>r.id===e);y("rider-program-title").textContent=t?Le(t):"Programm",y("rider-program-meta").textContent="Lade Programmrennen ...",y("rider-program-body").innerHTML="",Xe("riderProgram");const a=await V.getRiderProgramRaces(e);if(!a.success||!a.data){y("rider-program-meta").textContent="",y("rider-program-body").innerHTML=`<div class="results-empty">${S(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}y("rider-program-title").textContent=a.data.program.name,y("rider-program-meta").textContent=t?Le(t):"",y("rider-program-body").innerHTML=fg(a.data)}function hg(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=bg(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${Lt("Team","team","Team")}
          ${Lt("Fahrer","rider","Fahrer")}
          ${Lt("Spec1","spec1","Spezialisierung 1")}
          ${Lt("Rolle","role","Rolle")}
          ${Lt("Ges","overall","Gesamtstärke")}
          ${Lt("Phase","phase","Formphase")}
          ${Lt("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var r,s;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${_e((r=a.team)==null?void 0:r.id,(s=a.team)==null?void 0:s.name)}</td>
              <td><span class="race-participant-rider-cell">${oe(Rt(a.rider))}<strong>${S(Le(a.rider))}</strong></span></td>
              <td>${S(fs(a.rider))}</td>
              <td>${S(ht(a.rider))}</td>
              <td>${ws(a.rider.overallRating)}</td>
              <td>${Ms(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${S(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function Lt(e,t,a){const r=d.raceParticipantsSort.key===t?" race-participants-sort-active":"",s=d.raceParticipantsSort.key===t?d.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${S(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${r}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${d.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${s}</span>
      </button>
    </th>`}function bg(e){const t=d.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{var n,i,o,c;let s=0;switch(d.raceParticipantsSort.key){case"team":s=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=r.team)==null?void 0:i.name)??"","de");break;case"rider":s=Le(a.rider).localeCompare(Le(r.rider),"de");break;case"spec1":s=fs(a.rider).localeCompare(fs(r.rider),"de");break;case"role":s=ht(a.rider).localeCompare(ht(r.rider),"de");break;case"overall":s=a.rider.overallRating-r.rider.overallRating;break;case"phase":s=(a.rider.seasonFormPhase??"neutral").localeCompare(r.rider.seasonFormPhase??"neutral","de");break;default:s=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((c=r.program)==null?void 0:c.name)??"","de")}return s*t||Le(a.rider).localeCompare(Le(r.rider),"de")})}function fs(e){return e.specialization1!=null?Zt(e.specialization1):"–"}async function ul(e){const t=bt(e);d.selectedRaceParticipantsRaceId=e,y("race-participants-title").textContent=(t==null?void 0:t.name)??"Teilnehmer",y("race-participants-meta").textContent="Lade Programmfahrer ...",y("race-participants-body").innerHTML="",d.raceParticipants=[],Xe("raceParticipants"),await ml()}async function ml(e=!1){const t=d.selectedRaceParticipantsRaceId;if(t==null)return;const a=bt(t);e&&(y("race-participants-meta").textContent="Lade Programmfahrer ...");const r=await V.getRaceProgramParticipants(t);if(!r.success||!r.data){y("race-participants-meta").textContent="",y("race-participants-body").innerHTML=`<div class="results-empty">${S(r.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}d.raceParticipants=r.data,y("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",y("race-participants-meta").textContent=`${r.data.length} Programmfahrer · ${a?Dr(a):""}`,y("race-participants-body").innerHTML=hg(d.raceParticipants)}async function xr(e,t=null){let a=Sa(e);if(!a&&d.stageEditorStageRows){const n=d.stageEditorStageRows.find(i=>i.stageId===e);n&&(a={race:{id:n.raceId,name:n.raceName,countryId:0,categoryId:0,isStageRace:!0,numberOfStages:1,startDate:"",endDate:"",prestige:0},stage:{id:n.stageId,raceId:n.raceId,stageNumber:n.stageNumber,date:"2026-01-01",profile:n.profile,startElevation:0,detailsCsvFile:"",distanceKm:n.distanceKm,elevationGainMeters:n.elevationGainMeters}})}if(!a)return;const r=await pg(e);if(!r){alert(d.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}d.selectedDashboardProfileStageId=e,y("stage-profile-title").textContent=`${a.race.name} · ${Fa(a.stage)}`;const s=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";y("stage-profile-meta").textContent=`${ie(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?lr(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?dr(a.stage.elevationGainMeters):"–"}${s}`,ad(y("stage-profile-view"),r,a.stage.profile,Ar(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),Xe("stageProfile")}function yg(){y("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const s=Number(t.dataset.editStageRoster);if(!Number.isFinite(s))return;tg(s);return}const a=e.target.closest("button[data-live-stage]");if(a){const s=Number(a.dataset.liveStage);if(!Number.isFinite(s))return;dl(s,!0);return}const r=e.target.closest("button[data-instant-stage]");if(r){const s=Number(r.dataset.instantStage);if(!Number.isFinite(s))return;sl(s)}}),y("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-participants-id]");if(t){const s=Number(t.dataset.dashboardRaceParticipantsId);Number.isFinite(s)&&ul(s);return}const a=e.target.closest("button[data-dashboard-race-id]");if(!a)return;const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&gs(r)}),y("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&xr(a)}),y("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&en(s);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const r=a.dataset.raceParticipantsSort;d.raceParticipantsSort.key===r?d.raceParticipantsSort.direction=d.raceParticipantsSort.direction==="asc"?"desc":"asc":d.raceParticipantsSort={key:r,direction:"asc"},ml()}),y("btn-advance-day").addEventListener("click",async()=>{await pl()}),y("btn-auto-progress").addEventListener("click",()=>{vg()})}async function pl(){var t,a;xe("Tag wird fortgeschrieben...");const e=(t=d.gameState)==null?void 0:t.season;try{const r=await V.advanceDay();if(!r.success)return alert(`Tageswechsel fehlgeschlagen:
`+(r.error??"Unbekannter Fehler")),!1;if(d.currentSave&&r.data&&(d.currentSave.currentSeason=r.data.season),await Xs(),await Qs(),ke("teams")){const{refreshTeamsViewData:n}=await qa(async()=>{const{refreshTeamsViewData:i}=await Promise.resolve().then(()=>Qp);return{refreshTeamsViewData:i}},void 0);await n()}const s=(a=d.gameState)==null?void 0:a.season;if(e&&s&&s>e){Ta();const{startDraftPresentation:n}=await qa(async()=>{const{startDraftPresentation:o}=await Promise.resolve().then(()=>Gg);return{startDraftPresentation:o}},void 0),{activateView:i}=await qa(async()=>{const{activateView:o}=await Promise.resolve().then(()=>Bl);return{activateView:o}},void 0);i("draft"),await n(s)}return!0}catch(r){return alert("Unerwarteter Fehler beim Tageswechsel: "+r.message),!1}finally{ye()}}function tn(){const e=document.getElementById("btn-auto-progress");e&&(ct?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function vg(){ct?Ta():gl()}function gl(){ct||(Ss(!0),tn(),Sg())}function Ta(){ct&&(Ss(!1),d.autoProgressTargetDate=null,tn())}async function Sg(){var e,t;for(;ct;){const a=(e=d.gameState)==null?void 0:e.currentDate;if(d.autoProgressTargetDate&&a&&a>=d.autoProgressTargetDate){Ta();break}const r=((t=d.gameStatus)==null?void 0:t.pendingStages)??[];let s=!1;if(r.length>0){const n=r[0];s=await sl(n.stageId,!0)}else s=await pl();if(!s){Ta();break}await new Promise(n=>setTimeout(n,100))}tn()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&ct){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),Ta()}});const ba=50;function an(){return[...Ws,...js[d.riderMenuDetailPage]]}function fl(e){return d.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function hl(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${fl(e.sortKey)}
      </button>
    </th>`}function bl(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${Ea.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function er(){const e=y("riders-detail"),t=an(),a=el(d.riders),r=a.length,s=Math.max(1,Math.ceil(r/ba));d.riderMenuPage=Math.min(s,Math.max(1,d.riderMenuPage));const n=(d.riderMenuPage-1)*ba,i=Math.min(r,n+ba),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(Ys(d.riderMenuTableSort.key))} ${d.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${bl()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(hl).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(c=>`
                <tr class="team-detail-row">
                  ${t.map(l=>Zs(c,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${d.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${d.riderMenuPage} / ${s} · Fahrer ${r===0?0:n+1}-${i} von ${r}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${d.riderMenuPage>=s?"disabled":""}>Weiter</button>
      </div>
    </div>`}function yl(){y("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&en(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;Ea.includes(n)&&(d.riderMenuDetailPage=n,new Set(an().map(o=>o.sortKey).filter(o=>o!=null)).has(d.riderMenuTableSort.key)||(d.riderMenuTableSort={key:"name",direction:"asc"}),d.riderMenuPage=1,er());return}const r=e.target.closest("button[data-riders-sort]");if(r){const n=r.dataset.ridersSort;d.riderMenuTableSort.key===n?d.riderMenuTableSort.direction=d.riderMenuTableSort.direction==="asc"?"desc":"asc":d.riderMenuTableSort={key:n,direction:Us(n)},d.riderMenuPage=1,er();return}const s=e.target.closest("button[data-riders-page-action]");if(s){const n=s.dataset.ridersPageAction,i=Math.max(1,Math.ceil(d.riders.length/ba));n==="prev"&&(d.riderMenuPage=Math.max(1,d.riderMenuPage-1)),n==="next"&&(d.riderMenuPage=Math.min(i,d.riderMenuPage+1)),er();return}})}const kg=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:ba,getActiveRiderMenuTableColumns:an,getRiderMenuSortIndicator:fl,initRidersListeners:yl,renderRiderMenuDetailPageTabs:bl,renderRiderMenuTableHeader:hl,renderRidersMenu:er},Symbol.toStringTag,{value:"Module"})),Ua=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function ot(e){return e==null?"free-agents":String(e)}function fi(e){var a;const t=d.riderTeamEditorPayload;return t?((a=t.teams.find(r=>r.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function $g(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return Ts(t/11.2,0,100)}function xg(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function Tg(e){return d.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function wg(e){const t=d.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${S(e.title)}"
        aria-label="${S(e.title)}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Tg(e.key)}
      </button>
    </th>`}function Mg(e,t){switch(d.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return se(e.firstName,t.firstName);case"lastName":return se(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return se(fi(e.teamId),fi(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return se(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return se(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function Rg(e){const t=d.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>(Mg(a,r)||se(a.lastName,r.lastName)||se(a.firstName,r.firstName)||a.riderId-r.riderId)*t)}function Ig(e){const t=d.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(r=>ot(r.teamId)===t);return Rg(a)}function Cg(e){const t=d.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${ot(a.teamId)}"${a.teamId===e?" selected":""}>${S(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function vl(e){return d.riderTeamEditorDirtyRiderIds.includes(e)}function Eg(e,t){const a=vl(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${Ir(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${Cg(e.teamId)}</select></td>`;case"number":{const r=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${r}"></td>`}case"text":{const r=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${S(r)}"></td>`}default:return"<td>–</td>"}}function Fg(e){const t=[...e.teams].sort((a,r)=>a.rank-r.rank||se(a.name,r.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${d.riderTeamEditorSelectedTeamKey===ot(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${ot(a.teamId)}">
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
    </aside>`}function Oe(){var o;const e=y("rider-team-editor-root"),t=y("rider-team-editor-meta"),a=d.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const r=d.riderTeamEditorSelectedTeamKey?a.teams.find(c=>ot(c.teamId)===d.riderTeamEditorSelectedTeamKey)??null:null,s=Ig(a),n=d.riderTeamEditorDirtyRiderIds.length,i=r==null?"Kein Team gewählt":`${r.riderCount} Fahrer · Ø ${r.averageOverall!=null?r.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${r.rank}`;t.textContent=r==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${r.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${d.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(c=>`
                  <option value="${ot(c.teamId)}"${d.riderTeamEditorSelectedTeamKey===ot(c.teamId)?" selected":""}>${S(c.name)} (${c.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${S(d.riderTeamEditorSort.key==="teamName"?"Team":((o=Ua.find(c=>c.key===d.riderTeamEditorSort.key))==null?void 0:o.title)??d.riderTeamEditorSort.key)} ${d.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${Ua.map(wg).join("")}
                </tr>
              </thead>
              <tbody>
                ${s.length===0?`<tr><td colspan="${Ua.length}" class="text-muted">${d.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:s.map(c=>`
                    <tr class="team-detail-row${vl(c.riderId)?" rider-team-editor-row-dirty":""}">
                      ${Ua.map(l=>Eg(c,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${Fg(a)}
    </div>`}function Pg(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),c=o.length===0?null:Math.round(o.reduce((l,p)=>l+p.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:c,rank:0}}),r=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:r.length,averageOverall:r.length===0?null:Math.round(r.reduce((i,o)=>i+o.overallRating,0)/r.length*100)/100,rank:0,isFreeAgents:!0});const s=[...a].sort((i,o)=>{const c=i.averageOverall??-1;return(o.averageOverall??-1)-c||o.riderCount-i.riderCount||se(i.name,o.name)}),n=new Map(s.map((i,o)=>[ot(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(ot(i.teamId))??a.length}))}async function Sl(e=!1){if(d.riderTeamEditorPayload&&!e){Oe();return}y("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await V.getRiderTeamEditor();if(!t.success||!t.data){y("rider-team-editor-root").innerHTML=`<div class="results-empty">${S(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}d.riderTeamEditorPayload=t.data,d.riderTeamEditorDirtyRiderIds=[],d.riderTeamEditorSaving=!1,d.riderTeamEditorExporting=!1,d.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(r=>ot(r.teamId)===d.riderTeamEditorSelectedTeamKey)||(d.riderTeamEditorSelectedTeamKey="")),Oe()}function Ng(e,t,a){const r=d.riderTeamEditorPayload;if(!r)return;const s=r.riders.find(n=>n.riderId===e);s&&(t==="teamId"?s.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof s[t]=="number"?s[t]=Number.parseInt(a||"0",10):s[t]=a,s.overallRating=$g(s),r.teams=Pg(r),d.riderTeamEditorDirtyRiderIds.includes(e)||(d.riderTeamEditorDirtyRiderIds=[...d.riderTeamEditorDirtyRiderIds,e]),Oe())}async function Lg(){if(!d.riderTeamEditorPayload||d.riderTeamEditorSaving)return;d.riderTeamEditorSaving=!0,Oe();const e=await V.saveRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Oe();return}d.riderTeamEditorPayload=e.data,d.riderTeamEditorDirtyRiderIds=[],Oe()}async function Dg(){if(!d.riderTeamEditorPayload||d.riderTeamEditorExporting)return;d.riderTeamEditorExporting=!0,Oe();const e=await V.exportRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Oe();return}cr(e.data.fileName,e.data.content),Oe()}function _g(){y("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const s=t.dataset.riderTeamEditorSort;d.riderTeamEditorSort.key===s?d.riderTeamEditorSort.direction=d.riderTeamEditorSort.direction==="asc"?"desc":"asc":d.riderTeamEditorSort={key:s,direction:xg(s)},Oe();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){d.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Oe();return}const r=e.target.closest("button[data-rider-team-editor-action]");if(r){const s=r.dataset.riderTeamEditorAction;if(s==="reload"){Sl(!0);return}if(s==="export"){Dg();return}s==="save"&&Lg()}}),y("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){d.riderTeamEditorSelectedTeamKey=t.value,Oe();return}const a=e.target.closest(".rider-team-editor-input");if(a){const r=Number(a.dataset.riderTeamEditorRiderId),s=a.dataset.riderTeamEditorField;Number.isFinite(r)&&s&&Ng(r,s,a.value)}})}let qe={key:"pickNumber",asc:!0};function hs(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),r=.26+t*.18,s=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${r};--rider-stats-pill-bg-alpha:${s};`}function kl(e){return qe.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${qe.asc?"↑":"↓"}</span>`}function Ve(e,t,a=""){const r=qe.key===t?" team-table-sort-active":"";return`
    <th class="${S(a)}">
      <button
        type="button"
        class="team-table-sort${r}"
        data-draft-sort="${S(t)}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        ${kl(t)}
      </button>
    </th>`}async function Br(e,t=!1){const a=await V.getDraftHistory(e);if(!a.success){d.draftHistory=null,ke("draft")&&Tr(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}d.draftHistory=a.data??null,ke("draft")&&Tr()}function Tr(){const e=y("draft-table-container"),t=y("draft-season-select");if(!d.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const s=(d.currentSave.startSeason??2026)+1;for(let n=d.currentSave.currentSeason;n>=s;n--){const i=document.createElement("option");i.value=n.toString(),i.textContent=`Saison ${n}`,t.appendChild(i)}d.draftSelectedSeason||(d.draftSelectedSeason=Math.max(s,d.currentSave.currentSeason)),t.value=d.draftSelectedSeason.toString(),t.onchange=n=>{const i=n.target;d.draftSelectedSeason=parseInt(i.value,10),Br(d.draftSelectedSeason)}}if(!d.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(d.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...d.draftHistory.rows].sort((s,n)=>{let i=0;const o=qe.key;return o==="riderLastName"?i=s.riderLastName.localeCompare(n.riderLastName):o==="teamName"?i=s.teamName.localeCompare(n.teamName):o==="oldTeamName"?i=(s.oldTeamName||"").localeCompare(n.oldTeamName||""):o==="countryCode"?i=s.countryCode.localeCompare(n.countryCode):i=(s[o]??0)-(n[o]??0),qe.asc?i:-i});let r=`
    <table class="data-table">
      <thead>
        <tr>
          ${Ve("Pick","pickNumber","text-center")}
          ${Ve("Runde","draftRound","text-center")}
          ${Ve("Neues Team","teamName")}
          ${Ve("Altes Team","oldTeamName")}
          ${Ve("Land","countryCode","text-center")}
          ${Ve("Fahrer","riderLastName")}
          ${Ve("Alter","riderBirthYear","text-center")}
          ${Ve("Vertrag","contractLength","text-center")}
          ${Ve("Stärke","overallAtDraft","text-center")}
          ${Ve("Potenzial","potOverallAtDraft","text-center")}
        </tr>
      </thead>
      <tbody>
  `;for(const s of a){const n=d.draftHistory.season-s.riderBirthYear;let i="-";s.oldTeamName&&(i=`
        <div style="display:flex; align-items:center; gap:0.5rem;">
          ${_e(s.oldTeamId,s.oldTeamName)}
          <button class="app-team-link" data-team-id="${s.oldTeamId}" style="background: none; border: none; padding: 0; color: #94a3b8; font-weight: normal; cursor: pointer; text-align: left; font-size: inherit;">
            ${S(s.oldTeamName)}
          </button>
        </div>`);const o=`
      <div style="display:flex; align-items:center; gap:0.5rem;">
        ${_e(s.teamId,s.teamName)}
        <button class="app-team-link" data-team-id="${s.teamId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: inherit;">
          ${S(s.teamName)}
        </button>
      </div>`;r+=`
      <tr>
        <td class="text-center">#${s.pickNumber}</td>
        <td class="text-center">Runde ${s.draftRound}</td>
        <td>${o}</td>
        <td>${i}</td>
        <td class="text-center">${oe(s.countryCode)}</td>
        <td>
          <button class="app-rider-link" data-rider-id="${s.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: inherit;">
            ${S(s.riderFirstName)} ${S(s.riderLastName)}
          </button>
        </td>
        <td class="text-center">${n} J.</td>
        <td class="text-center">${s.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${hs(s.overallAtDraft)}">${s.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${hs(s.potOverallAtDraft)}">${s.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}r+="</tbody></table>",e.innerHTML=r}function $l(){y("draft-table-container").addEventListener("click",a=>{const r=a.target.closest("button[data-draft-sort]");if(r){const s=r.dataset.draftSort;s&&(qe.key===s?qe.asc=!qe.asc:(qe.key=s,qe.asc=!0),Tr())}});const t=y("draft-replay-btn");t&&t.addEventListener("click",()=>{const a=y("draft-season-select");if(a){const r=Number(a.value);isNaN(r)||Tl(r)}})}function Hr(){d.draftOverlayTimer1&&(clearTimeout(d.draftOverlayTimer1),d.draftOverlayTimer1=null),d.draftOverlayTimer2&&(clearTimeout(d.draftOverlayTimer2),d.draftOverlayTimer2=null)}function xl(e,t,a){const r=d.teams.find(c=>c.id===e),s=(r==null?void 0:r.division)==="U23"?20:(r==null?void 0:r.division)==="ProTour"?30:32,n=d.riders.filter(c=>c.activeTeamId===e).length,i=a.slice(t+1).filter(c=>c.teamId===e).length,o=n-i;return Math.max(0,s-o)}function Ag(e,t){return e==null||e<=0?`
      <svg viewBox="0 0 100 100" width="36" height="36" style="display: block;">
        <path d="M 30,20 Q 50,15 70,20 L 80,45 L 65,50 L 60,35 L 60,85 L 40,85 L 40,35 L 35,50 L 20,45 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      </svg>
    `:_e(e,t||"")}function Bg(e,t){const a=t?"border: 2px solid var(--accent, #38bdf8); background: rgba(56, 189, 248, 0.08);":"border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);",r=e.uciRank?`UCI: #${e.uciRank}`:"UCI: -",s=e.specialization?S(e.specialization):"Allrounder";return`
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; border-radius: 8px; transition: all 0.2s; ${a}">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="flex-shrink: 0;">
          ${Ag(e.oldTeamId,e.oldTeamName)}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            ${oe(e.countryCode)}
            <button class="app-rider-link" data-rider-id="${e.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: 0.95rem; text-decoration: none;">
              ${S(e.firstName)} ${S(e.lastName)}
            </button>
          </div>
          <div style="font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 0.5rem; margin-top: 0.1rem; flex-wrap: wrap;">
            <span>${s}</span>
            <span>·</span>
            <span>${r}</span>
            <span>·</span>
            ${e.oldTeamId?`
              <button class="app-team-link" data-team-id="${e.oldTeamId}" style="background: none; border: none; padding: 0; color: #94a3b8; cursor: pointer; font-size: 0.8rem; text-align: left; text-decoration: none;">
                ${S(e.oldTeamName)}
              </button>
            `:'<span style="color: #64748b;">Freier Fahrer</span>'}
          </div>
        </div>
      </div>
      
      <div style="text-align: right;">
        <div style="font-size: 0.95rem; font-weight: 600; color: #fff;">OVR ${e.overallRating.toFixed(1)} <span style="font-size: 0.8rem; color: #94a3b8; font-weight: normal;">(POT ${e.potential.toFixed(1)})</span></div>
        <div style="font-size: 0.8rem; color: var(--accent, #38bdf8); font-weight: 500; margin-top: 0.1rem;">${e.probability.toFixed(1)}%</div>
      </div>
    </div>
  `}function Hg(e){const t=d.draftHistory?d.draftHistory.season-e.riderBirthYear:0,a=e.riderSpecialization||"Allrounder";return`
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center; animation: scaleIn 0.3s ease-out;">
      <style>
        @keyframes scaleIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      </style>
      
      <div style="transform: scale(3.5); margin-bottom: 2.5rem; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));">
        ${_e(e.teamId,e.teamName)}
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 2rem; width: 85%; max-width: 460px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);">
        <div style="font-size: 0.9rem; color: var(--accent, #38bdf8); font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">GEZOGENER FAHRER</div>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.75rem;">
          ${oe(e.countryCode)}
          <button class="app-rider-link" data-rider-id="${e.riderId}" style="background: none; border: none; padding: 0; color: #fff; font-weight: 700; font-size: 1.8rem; cursor: pointer; text-decoration: none; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            ${S(e.riderFirstName)} ${S(e.riderLastName)}
          </button>
        </div>
        
        <div style="font-size: 1.1rem; color: #94a3b8; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <span>${a}</span>
          <span>·</span>
          <span>${t} Jahre</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 1rem 0; margin-bottom: 1.5rem;">
          <div>
            <div style="font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Stärke (OVR)</div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #fff;">${e.overallAtDraft.toFixed(1)}</div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Potenzial (POT)</div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #fff;">${e.potOverallAtDraft.toFixed(1)}</div>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.95rem;">
          <div style="display: flex; justify-content: space-between; color: #94a3b8;">
            <span>Vertragslaufzeit:</span>
            <strong style="color: #fff;">${e.contractLength} Jahre</strong>
          </div>
          <div style="display: flex; justify-content: space-between; color: #94a3b8;">
            <span>Altes Team:</span>
            ${e.oldTeamId?`
              <button class="app-team-link" data-team-id="${e.oldTeamId}" style="background: none; border: none; padding: 0; color: #60a5fa; cursor: pointer; font-weight: 600; text-decoration: none;">
                ${S(e.oldTeamName)}
              </button>
            `:'<strong style="color: #64748b;">Freier Fahrer</strong>'}
          </div>
          <div style="display: flex; justify-content: space-between; color: #94a3b8;">
            <span>Neues Team:</span>
            <button class="app-team-link" data-team-id="${e.teamId}" style="background: none; border: none; padding: 0; color: #60a5fa; cursor: pointer; font-weight: 600; text-decoration: none;">
              ${S(e.teamName)}
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function zg(e){let t=document.getElementById("draft-overlay");return t||(t=document.createElement("div"),t.id="draft-overlay",t.style.cssText=`
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(15, 23, 42, 0.98); z-index: 10000;
    display: flex; flex-direction: column; padding: 2rem; color: #fff;
    font-family: inherit; overflow: hidden; box-sizing: border-box;
  `,document.body.appendChild(t),t.innerHTML=`
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-shrink: 0;">
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <div id="draft-overlay-team-jersey-wrap" style="transform: scale(1.4); transform-origin: left center;"></div>
        <div>
          <h2 id="draft-overlay-round-title" style="margin: 0; font-size: 1.6rem; font-weight: 700;">-</h2>
          <p id="draft-overlay-team-subtitle" style="margin: 0.2rem 0 0; color: #94a3b8; font-size: 1rem;">-</p>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 2rem;">
        <div style="text-align: right;">
          <div style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Offene Plätze</div>
          <div id="draft-overlay-roster-slots" style="font-size: 1.3rem; font-weight: 600; color: var(--accent, #38bdf8);">-</div>
        </div>
        
        <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); padding: 0.5rem 1rem; border-radius: 8px;">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none; margin: 0; font-size: 0.9rem; color: #fff;">
            <input type="checkbox" id="draft-overlay-auto-checkbox" ${d.draftOverlayAuto?"checked":""} style="cursor: pointer; width: 16px; height: 16px; margin: 0;" />
            Auto Progress
          </label>
        </div>
        
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button id="draft-overlay-prev-btn" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 1rem;">◀</button>
          <span id="draft-overlay-progress-label" style="font-size: 0.95rem; min-width: 60px; text-align: center; color: #94a3b8;">- / -</span>
          <button id="draft-overlay-next-btn" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 1rem;">▶</button>
        </div>
        
        <button id="draft-overlay-quick-btn" class="btn btn-danger" style="font-weight: 600; padding: 0.5rem 1rem;">Quick Finish</button>
      </div>
    </header>
    
    <div style="display: flex; flex: 1; gap: 2rem; overflow: hidden; min-height: 0;">
      <!-- Linke Spalte: Kandidaten -->
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
        <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0;">Kandidaten-Pool</h3>
        <div id="draft-overlay-candidates-list" style="display: flex; flex-direction: column; gap: 0.6rem; overflow-y: auto; flex: 1; padding-right: 0.5rem;"></div>
      </div>
      
      <!-- Rechte Spalte: Auswahl -->
      <div style="flex: 1.3; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(255,255,255,0.01); border: 2px dashed rgba(255,255,255,0.08); border-radius: 12px; padding: 2rem; position: relative; min-height: 0;">
        <div id="draft-overlay-pick-display" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0;"></div>
      </div>
    </div>
  `,t.addEventListener("click",a=>{const r=a.target;if(r.id==="draft-overlay-quick-btn"){rn();return}if(r.id==="draft-overlay-prev-btn"||r.closest("#draft-overlay-prev-btn")){if(d.draftOverlayCurrentIndex>0){const s=document.getElementById("draft-overlay-auto-checkbox");s&&(s.checked=!1,d.draftOverlayAuto=!1),ea(d.draftOverlayCurrentIndex-1)}return}if(r.id==="draft-overlay-next-btn"||r.closest("#draft-overlay-next-btn")){if(d.draftOverlayPicks&&d.draftOverlayCurrentIndex+1<d.draftOverlayPicks.length){const s=document.getElementById("draft-overlay-auto-checkbox");s&&(s.checked=!1,d.draftOverlayAuto=!1),ea(d.draftOverlayCurrentIndex+1)}return}}),t.addEventListener("change",a=>{const r=a.target;r.id==="draft-overlay-auto-checkbox"&&(d.draftOverlayAuto=r.checked,d.draftOverlayAuto?ea(d.draftOverlayCurrentIndex):Hr())}),t)}function ea(e){if(!d.draftOverlayPicks||e<0||e>=d.draftOverlayPicks.length)return;Hr(),d.draftOverlayCurrentIndex=e;const t=d.draftOverlayPicks[e];if(!document.getElementById("draft-overlay"))return;const r=document.getElementById("draft-overlay-round-title");r&&(r.textContent=`Runde ${t.draftRound} - Pick #${t.pickNumber}`);const s=document.getElementById("draft-overlay-team-subtitle");s&&(s.innerHTML=`Team: <strong>${S(t.teamName)}</strong>`);const n=document.getElementById("draft-overlay-team-jersey-wrap");n&&(n.innerHTML=_e(t.teamId,t.teamName));const i=document.getElementById("draft-overlay-progress-label");i&&(i.textContent=`${e+1} / ${d.draftOverlayPicks.length}`);const o=xl(t.teamId,e,d.draftOverlayPicks),c=document.getElementById("draft-overlay-roster-slots");c&&(c.textContent=`${o}`);const l=document.getElementById("draft-overlay-prev-btn");l&&(l.disabled=e===0);const p=document.getElementById("draft-overlay-next-btn");p&&(p.disabled=e===d.draftOverlayPicks.length-1);const m=document.getElementById("draft-overlay-candidates-list");m&&(m.innerHTML=t.candidates.map(f=>{const g=f.riderId===t.riderId;return Bg(f,g)}).join(""));const u=document.getElementById("draft-overlay-pick-display");if(u){u.innerHTML=`
      <div style="font-size: 1.3rem; font-weight: 500; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
        <div style="transform: scale(2.5); animation: pulse 1s infinite alternate; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));">
          ${_e(t.teamId,t.teamName)}
        </div>
        <style>
          @keyframes pulse {
            from { opacity: 0.3; transform: scale(2.4); }
            to { opacity: 1; transform: scale(2.6); }
          }
        </style>
        <span>Treffe Auswahl...</span>
      </div>
    `;const f=window.setTimeout(()=>{if(!(!d.draftOverlayActive||d.draftOverlayCurrentIndex!==e)&&(u.innerHTML=Hg(t),d.draftOverlayAuto)){const g=window.setTimeout(()=>{!d.draftOverlayActive||d.draftOverlayCurrentIndex!==e||(e+1<d.draftOverlayPicks.length?ea(e+1):rn())},3e3);d.draftOverlayTimer2=g}},2e3);d.draftOverlayTimer1=f}}function rn(){Hr(),d.draftOverlayActive=!1,d.draftOverlayPicks=null;const e=document.getElementById("draft-overlay");e&&e.remove(),d.draftSelectedSeason&&Br(d.draftSelectedSeason)}async function Tl(e){Hr(),d.draftOverlayActive=!0,d.draftOverlayAuto=!0,d.draftOverlayCurrentIndex=0,xe("Draft-Präsentation wird geladen...");try{const t=await V.getDraftDetails(e);if(!t.success||!t.data||!t.data.picks||t.data.picks.length===0){ye(),d.draftOverlayActive=!1;return}d.draftOverlayPicks=t.data.picks,zg(e),ea(0)}catch(t){console.error(t),d.draftOverlayActive=!1}finally{ye()}}const Gg=Object.freeze(Object.defineProperty({__proto__:null,closeDraftOverlay:rn,currentDraftSort:qe,getDraftSortIndicator:kl,getHeatmapStyleForRating:hs,getOpenSlotsForPick:xl,initDraftListeners:$l,loadDraftHistory:Br,renderDraftHeaderCell:Ve,renderDraftView:Tr,showDraftPick:ea,startDraftPresentation:Tl},Symbol.toStringTag,{value:"Module"}));async function Kg(e=!1){const t=await V.getInjuries();if(!t.success){d.injuries=null,ke("injuries")&&hi(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}d.injuries=t.data??[],ke("injuries")&&hi()}function hi(){const e=y("injuries-table-container");if(!d.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(y("injuries-meta").textContent=d.injuries.length+" Ausfälle",d.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=na;let t="";const a=d.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),r=new Map;for(const n of a){const i=n.teamId;r.has(i)||r.set(i,[]),r.get(i).push(n)}for(const n of r.keys())r.get(n).sort((i,o)=>o.overallRating-i.overallRating);const s=Array.from(r.keys()).sort((n,i)=>{const o=r.get(n)[0].teamAbbreviation||"",c=r.get(i)[0].teamAbbreviation||"";return o.localeCompare(c)});if(s.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of s){const i=r.get(n),o=i[0].teamAbbreviation;t+=`
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
      `;for(const c of i){const l=c.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let p="";if(c.fitDate){const m=ie(c.fitDate);if(c.missedRaces&&c.missedRaces.length>0){let u="";for(const f of c.missedRaces)u+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${ie(f.startDate)}</span>
                  ${oe(f.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${S(f.name)}</strong>
                  ${Hs(f.categoryName)}
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
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${c.riderId})" style="color: inherit; text-decoration: none;"><strong>${S(c.riderFirstName)} ${S(c.riderLastName)}</strong></a></td>
            <td>${c.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${zo(c.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${c.unavailableDays} Tage</strong></td>
            <td>${p}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function bi(e){return e===0?"–":`-${e}`}function Og(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${rt(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Ne(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function Wg(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${S(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${Og(e.topRiders)}
      </div>
    </div>`}function jg(e,t){const a=t.filter(r=>r.teamId!=null&&e.teamId!=null&&r.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${rt(r.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Ne(r.riderName??"–",{riderId:r.riderId,teamId:r.teamId,strong:!1})}</span>
          <strong>${r.points}</strong>
        </div>
      `).join("")}
    </div>`}function Vg(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${Ze(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${jg(e,t)}
      </div>
    </div>`}async function wl(e){const t=d.seasonStandingsSelectedSeason??void 0,a=await V.getSeasonStandings(t);if(!a.success){d.seasonStandings=null,ke("season-standings")&&bs(),!e&&a.error&&alert(`Saisonwertung konnte nicht geladen werden:
`+a.error);return}d.seasonStandings=a.data??null,ke("season-standings")&&bs()}function bs(){var v,h,b,$,M,T,x,R;const e=y("season-standings-meta"),t=y("season-standings-scope-tabs"),a=y("season-standings-empty"),r=y("season-standings-table"),s=y("season-standings-tbody"),n=y("season-standings-jersey-header"),i=y("season-standings-primary-header"),o=y("season-standings-flag-header"),c=y("season-standings-secondary-header"),l=((v=d.seasonStandings)==null?void 0:v.season)??((h=d.gameState)==null?void 0:h.season)??((b=d.currentSave)==null?void 0:b.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.";const p=y("season-standings-year-select");if(p){const w=(($=d.seasonStandings)==null?void 0:$.availableSeasons)||[],E=d.seasonStandingsSelectedSeason??((M=d.gameState)==null?void 0:M.season)??2026;p.innerHTML=w.map(F=>`
      <option value="${F}" ${F===E?"selected":""}>Saison ${F}</option>
    `).join("")}t.innerHTML=`
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
  `;const m=d.selectedSeasonStandingScope==="countries",u=m?((T=d.seasonStandings)==null?void 0:T.countryStandings)??[]:d.selectedSeasonStandingScope==="teams"?((x=d.seasonStandings)==null?void 0:x.teamStandings)??[]:((R=d.seasonStandings)==null?void 0:R.riderStandings)??[],f=m?u:[],g=m?[]:u;if(n.textContent="Trikot",i.textContent=m?"Land":d.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",c.textContent=d.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",m),c.classList.toggle("hidden",m),!d.seasonStandings||u.length===0){s.innerHTML="",r.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}s.innerHTML=m?f.map(w=>`
      <tr>
        <td class="pos-${Math.min(w.rank,3)}">${w.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${Wg(w)}</td>
        <td class="results-flag-col-cell">${rt(w.countryCode)}</td>
        <td class="hidden"></td>
        <td>${w.points}</td>
        <td>${S(bi(w.gapPoints))}</td>
      </tr>`).join(""):g.map(w=>{var O;const E=w.riderName??w.teamName,F=jt(w.teamId,w.teamName),A=d.selectedSeasonStandingScope==="teams"?Vg(w,((O=d.seasonStandings)==null?void 0:O.riderStandings)??[]):Vt(E,!0,!1,w.riderId,w.teamId),_=rt(w.countryCode),z=d.selectedSeasonStandingScope==="teams"?S(w.countryName??w.countryCode??"–"):Ze(w.teamName??"–",w.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(w.rank,3)}">${w.rank}</td>
          <td class="results-jersey-col-cell">${F}</td>
          <td>${A}</td>
          <td class="results-flag-col-cell">${_}</td>
          <td>${z}</td>
          <td>${w.points}</td>
          <td>${S(bi(w.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),r.classList.remove("hidden")}function Ug(){y("season-standings-scope-tabs").addEventListener("click",t=>{const a=t.target.closest("button[data-season-scope]");if(!a)return;const r=a.dataset.seasonScope;r!=="riders"&&r!=="teams"&&r!=="countries"||(d.selectedSeasonStandingScope=r,bs())});const e=y("season-standings-year-select");e&&e.addEventListener("change",t=>{const a=t.target;d.seasonStandingsSelectedSeason=Number(a.value),wl(!1)})}function yi(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function Yg(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,r=[...e].map(l=>({rider:l,score:t(l)})).sort((l,p)=>p.score-l.score).slice(0,10),s=[...e].map(l=>({rider:l,score:a(l)})).sort((l,p)=>p.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,p)=>p.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,p)=>p.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,p)=>p.score-l.score).slice(0,10),c=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,p)=>p.score-l.score).slice(0,10);return{Gesamtklassement:r,Sprinter:s,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:c}}function Zg(e,t){const a=d.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const r=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,s=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>r(o)):t==="Sprinter"?n=a.map(o=>s(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,c)=>c-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,c)=>o+c,0)/i.length}function Jg(e,t){var i;const r=d.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:Zg(o.id,t)}));r.sort((o,c)=>c.avgScore-o.avgScore);const s=r.findIndex(o=>o.teamId===e)+1,n=((i=r.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:s,total:r.length,average:n}}function qg(e){const t=d.riders.filter(s=>s.activeTeamId===e);if(t.length===0)return 0;const a=t.map(s=>s.overallRating??0);a.sort((s,n)=>n-s);const r=a.slice(0,10);return r.length===0?0:r.reduce((s,n)=>s+n,0)/r.length}function Xg(e){var n;const a=d.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:qg(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const r=a.findIndex(i=>i.teamId===e)+1,s=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:r,total:a.length,average:s}}function Ya(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function Xr(e){e.countryCode&&oe(e.countryCode);const t=Yg(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,p)=>p.formValue-l.formValue).slice(0,10),r=[...e.riders].map(l=>({rider:l,uciRank:kr(l.id)})).filter(l=>l.uciRank!==null).sort((l,p)=>l.uciRank-p.uciRank).slice(0,10),s=Object.entries(t).map(([l,p])=>{const m=Jg(e.teamId,l),u=m.average.toFixed(1).replace(".",","),f=p.map(({rider:g,score:v})=>{const h=`${g.firstName.charAt(0)}. ${g.lastName}`,b=Ne(h,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),$=g.nationality?ze[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,M=$?`<span class="fi fi-${$} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",T=d.riders.find(R=>R.id===g.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${Ya((T==null?void 0:T.roleId)??null).color};">
            ${M}
            ${b}
          </span>
          <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${v.toFixed(0)}</span>
        </li>
      `}).join("");return`
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
          ${l}
          <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-400); display: block; margin-top: 0.1rem;">Platz ${m.rank}/${m.total} · Ø ${u}</span>
        </h4>
        <ul style="margin: 0; padding: 0; list-style: none;">${f}</ul>
      </div>
    `}).join(""),i=[...e.riders].sort((l,p)=>(p.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const p=`${l.firstName.charAt(0)}. ${l.lastName}`,m=Ne(p,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),u=l.nationality?ze[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=u?`<span class="fi fi-${u} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",g=l.overallRating.toFixed(0),v=d.riders.find(b=>b.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ya((v==null?void 0:v.roleId)??null).color};">
          ${f}
          ${m}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:p})=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Ne(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?ze[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",v=(p>=0?"+":"")+p.toFixed(1).replace(".",","),h=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,b=d.riders.find(M=>M.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ya((b==null?void 0:b.roleId)??null).color};">
          ${g}
          ${u}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${h}">${v}</span>
      </li>
    `}).join(""),c=r.map(({rider:l,uciRank:p})=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Ne(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?ze[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"";let v="rider-stats-rank-badge-gc";p===1?v="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":p===2?v="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":p===3&&(v="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const h=`<span class="rider-stats-rank-badge ${v}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${p}">${p}</span>`,b=d.riders.find(M=>M.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ya((b==null?void 0:b.roleId)??null).color};">
          ${g}
          ${u}
        </span>
        ${h}
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
          <ul style="margin: 0; padding: 0; list-style: none;">${c||'<li class="text-muted" style="font-size:0.85rem;">Keine Fahrer platziert</li>'}</ul>
        </div>
      </div>
    </div>
  `}function Qr(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${d.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${d.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${d.teamStatsTab==="contracts"?"true":"false"}">Kader & Verträge</button>
    </div>`}function Qg(e){const t=Array.from(new Set(e.topResults.map(u=>u.raceCategoryName).filter(Boolean)));t.sort((u,f)=>u.localeCompare(f,"de"));const a=Array.from(new Set(e.topResults.map(u=>u.season))).sort((u,f)=>f-u);let r=e.topResults.filter(u=>u.rowType!=="stage_result"?u.rowType==="gc_final"?d.teamStatsTopResultsFilters.gc:u.rowType==="mountain_final"?d.teamStatsTopResultsFilters.mountain:u.rowType==="points_final"?d.teamStatsTopResultsFilters.points:u.rowType==="youth_final"?d.teamStatsTopResultsFilters.youth:!0:u.isStageRace?d.teamStatsTopResultsFilters.stage:d.teamStatsTopResultsFilters.oneDay);if(d.teamStatsTopResultsFilterCategory){const u=d.teamStatsTopResultsFilterCategory;if(u.endsWith("-etappen")){const f=u.substring(0,u.length-8);r=r.filter(g=>g.raceCategoryName===f&&g.rowType==="stage_result")}else if(u.endsWith("-gc")){const f=u.substring(0,u.length-3);r=r.filter(g=>g.raceCategoryName===f&&g.rowType!=="stage_result")}else r=r.filter(f=>f.raceCategoryName===u)}d.teamStatsTopResultsFilterSeason!=null&&(r=r.filter(u=>u.season===d.teamStatsTopResultsFilterSeason)),r.sort((u,f)=>{if(f.seasonPoints!==u.seasonPoints)return f.seasonPoints-u.seasonPoints;const g=u.rowType!=="stage_result",v=f.rowType!=="stage_result",h=u.resultRank??9999,b=f.resultRank??9999;if(d.teamStatsTopResultsFilterCategory)return h!==b?h-b:g!==v?g?-1:1:0;{const $=yi(u.raceCategoryName),M=yi(f.raceCategoryName);return $!==M?$-M:g!==v?g?-1:1:h-b}});const s=20,n=Math.max(1,Math.min(10,Math.ceil(r.length/s)));d.teamStatsTopResultsPage>n&&(d.teamStatsTopResultsPage=n);const i=(d.teamStatsTopResultsPage-1)*s,o=r.slice(i,i+s),l=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${t.map(u=>{if(u.toLowerCase().includes("stage race")||u.toLowerCase().includes("grand tour")||u.toLowerCase().includes("tour de france")){const g=`${u}-etappen`,v=`${u}-gc`;return`
        <option value="${S(g)}" ${d.teamStatsTopResultsFilterCategory===g?"selected":""}>${S(u)} - Etappen</option>
        <option value="${S(v)}" ${d.teamStatsTopResultsFilterCategory===v?"selected":""}>${S(u)} - GC</option>
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
  `,p=o.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(u=>{const f=u.rowType!=="stage_result",g=f?`${u.raceName} · ${u.rowType==="gc_final"?"Gesamtwertung":u.rowType==="points_final"?"Punktewertung":u.rowType==="mountain_final"?"Bergwertung":"Nachwuchs"}`:u.stageNumber&&u.isStageRace?`${u.raceName} · Etappe ${u.stageNumber}`:u.raceName;let v="–",h="–";u.finishStatus==="otl"?v=Ht("OTL","place"):u.finishStatus==="dnf"?v=Ht("DNF","place"):u.resultRank==null||(f?h=`<span class="rider-stats-final-type ${u.rowType==="gc_final"?"is-gc":u.rowType==="points_final"?"is-points":u.rowType==="mountain_final"?"is-mountain":"is-youth"}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${u.resultRank}</span>`:v=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${u.resultRank<=3?` rider-stats-rank-badge-top-${u.resultRank}`:""}">${S(String(u.resultRank))}</span>`);const b=u.profile?Pa(u.profile):"–",$=!f&&u.stageScore!=null&&u.stageScore>0?Nr(u.stageScore,0,350):"–",M=Sr(u.raceCategoryName),T=u.riderCountryCode?ze[u.riderCountryCode]??u.riderCountryCode.slice(0,2).toLowerCase():null,x=T?`<span class="fi fi-${T} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(u.riderCountryCode??"")}"></span>`:"–",R=Ne(u.riderName,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${v}</td>
            <td>${h}</td>
            <td>${x}</td>
            <td style="white-space: nowrap;">${R}</td>
            <td><strong>${S(g)}</strong></td>
            <td class="status-cell">${Gs(u)}</td>
            <td>${b}</td>
            <td>${$}</td>
            <td>${M}</td>
            <td>Saison ${u.season}</td>
            <td><strong>${u.seasonPoints}</strong></td>
          </tr>
        `}).join(""),m=n>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${d.teamStatsTopResultsPage-1}" ${d.teamStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        ${Array.from({length:n}).map((u,f)=>{const g=f+1;return`<button type="button" class="btn btn-sm ${d.teamStatsTopResultsPage===g?"btn-primary":"btn-secondary"}" data-team-top-results-page="${g}">${g}</button>`}).join("")}
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${d.teamStatsTopResultsPage+1}" ${d.teamStatsTopResultsPage===n?"disabled":""}>Weiter &raquo;</button>
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
      ${m}
    </section>
  `}function ef(e){const t=String(d.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,superteamCount:0,categories:{}},r=t==="all",s=m=>r?m:"–",n=(m,u)=>r?`${m} / ${u} T`:"–",i=r?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(m,u,f,g)=>{const v=typeof m=="number"?m:parseFloat(String(m))||0;let h="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return v===0?h+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":u==="gold"?h+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":u==="silver"?h+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":u==="bronze"?h+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":u==="purple"?h+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":u==="green"?h+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":u==="red"?h+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":u==="white"&&(h+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${h}" title="${S(f)}: ${v} Siege">${m}</span>`},c=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #fff;">Karrierestatistiken (Team)</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="team-stats-success-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
        <select id="team-stats-success-season-select" class="form-control" style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">
          <option value="all" ${r?"selected":""}>Ewig (All-Time)</option>
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
        ${c.map(m=>{const u=a.categories[m.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(m.name)}">${S(m.name)}</span>
                ${Hs(m.key)}
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
                    <!-- Ausreißertrikot (Aktivste Fahrer) -->
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 20px; ${(u.breakawayJerseys||0)===0?"background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":"background: linear-gradient(135deg, #f3e8ff, #d8b4fe); color: #581c87; border: 1px solid #a855f7; box-shadow: 0 0 4px rgba(168, 85, 247, 0.4);"}" title="Tage im Ausreißertrikot (Aktivste Fahrer)">
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
                  ${ue(u.winFlat||0,"flat","Flach (Flat)")}
                  ${ue(u.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${ue(u.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${ue(u.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${ue(u.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${ue(u.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${ue(u.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${ue(u.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${ue(u.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${ue(u.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${ue(u.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${Ie(u.winWeather1||0,1,"Sonnig")}
                  ${Ie(u.winWeather2||0,2,"Extreme Hitze")}
                  ${Ie(u.winWeather3||0,3,"Leichter Regen")}
                  ${Ie(u.winWeather4||0,4,"Starkregen")}
                  ${Ie(u.winWeather5||0,5,"Starker Wind")}
                  ${Ie(u.winWeather6||0,6,"Dichter Nebel")}
                  ${Ie(u.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${re.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${u.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}function tf(e){var m;const t=e.historyRosters||{},a=Object.keys(t).map(Number).sort((u,f)=>u-f);if(a.length===0)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Kader- und Vertragsdaten vorhanden</h3>
        <p>Für dieses Team wurden keine Verträge in der Datenbank erfasst.</p>
      </section>
    `;if(d.teamStatsSelectedRosterYear===null||!a.includes(d.teamStatsSelectedRosterYear)){const u=((m=d.gameState)==null?void 0:m.season)??2026;a.includes(u)?d.teamStatsSelectedRosterYear=u:d.teamStatsSelectedRosterYear=a[0]}const r=d.teamStatsSelectedRosterYear,n=[...t[r]||[]],i=d.teamStatsRosterSort.key,o=d.teamStatsRosterSort.direction;n.sort((u,f)=>{let g=0;if(i==="nationality"){const v=u.nationality||"",h=f.nationality||"";g=v.localeCompare(h,"de")}else if(i==="name"){const v=`${u.lastName||""}, ${u.firstName||""}`,h=`${f.lastName||""}, ${f.firstName||""}`;g=v.localeCompare(h,"de")}else if(i==="overallRating")g=(u.overallRating||0)-(f.overallRating||0);else if(i==="potential")g=(u.potential||0)-(f.potential||0);else if(i==="roleName"){const v=u.roleName||"",h=f.roleName||"";g=v.localeCompare(h,"de")}else i==="contractEndSeason"&&(g=(u.contractEndSeason||0)-(f.contractEndSeason||0));return o==="asc"?g:-g});const c=a.map(u=>`
    <option value="${u}" ${u===r?"selected":""}>Kader ${u}</option>
  `).join(""),l=u=>d.teamStatsRosterSort.key!==u?' <span style="opacity: 0.3; font-size: 0.75rem;">↕</span>':d.teamStatsRosterSort.direction==="asc"?' <span style="font-size: 0.75rem;">▲</span>':' <span style="font-size: 0.75rem;">▼</span>',p=n.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Fahrer für dieses Jahr unter Vertrag.</td></tr>':n.map(u=>{const f=u.nationality?ze[u.nationality]??u.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(u.nationality)}"></span>`:"–",v=Ne(`${u.firstName} ${u.lastName}`,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),h=`<span class="results-roster-overall-badge" style="color:${vi(u.overallRating)}" title="Stärke: ${u.overallRating.toFixed(2)}">${u.overallRating.toFixed(1)}</span>`;let b="–";u.potential!=null&&(b=`<span class="results-roster-overall-badge" style="color:${vi(u.potential)}" title="Potential: ${u.potential.toFixed(2)}">${u.potential.toFixed(1)}</span>`);const $=S(u.roleName||"-"),M=u.contractEndSeason?`Saison ${u.contractEndSeason}`:"Ohne Vertrag",x=u.contractEndSeason===r?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${S(M)}</span>`:`<span style="font-weight: 500;">${S(M)}</span>`;return`
          <tr class="rider-stats-row">
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${g}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); white-space: nowrap;">${v}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${h}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${b}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; color: #ccc;">${$}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${x}</td>
          </tr>
        `}).join("");return`
    <section class="rider-stats-contracts" style="margin-top: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h3 style="margin: 0; font-size: 1.15rem; font-weight: bold; color: #fff;">Kaderzusammensetzung</h3>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="team-stats-roster-year-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Jahr auswählen:</label>
          <select id="team-stats-roster-year-select" class="form-control" style="background: #222; border: 1px solid #444; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer; width: auto; display: inline-block;">
            ${c}
          </select>
        </div>
      </div>
      
      <div class="dashboard-race-stages-table-wrap rider-stats-table-wrap">
        <table class="data-table rider-stats-table" style="width: 100%; border-collapse: collapse; text-align: left;">
          <colgroup>
            <col style="width: 8%;">
            <col style="width: 32%;">
            <col style="width: 15%;">
            <col style="width: 15%;">
            <col style="width: 15%;">
            <col style="width: 15%;">
          </colgroup>
          <thead>
            <tr style="border-bottom: 2px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.02);">
              <th data-team-roster-sort="nationality" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Nat${l("nationality")}</th>
              <th data-team-roster-sort="name" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: left;">Fahrer${l("name")}</th>
              <th data-team-roster-sort="overallRating" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Gesamtstärke${l("overallRating")}</th>
              <th data-team-roster-sort="potential" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Pot. Gesamtstärke${l("potential")}</th>
              <th data-team-roster-sort="roleName" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Rolle${l("roleName")}</th>
              <th data-team-roster-sort="contractEndSeason" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Vertragsende${l("contractEndSeason")}</th>
            </tr>
          </thead>
          <tbody>
            ${p}
          </tbody>
        </table>
      </div>
    </section>
  `}function vi(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function pt(e){return d.teamStatsTab==="career"?`
      ${Xr(e)}
      ${Qr()}
      ${ef(e)}
    `:d.teamStatsTab==="contracts"?`
      ${Xr(e)}
      ${Qr()}
      ${tf(e)}
    `:`
    ${Xr(e)}
    ${Qr()}
    ${Qg(e)}
  `}function af(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((r=d.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${S(a)}" aria-label="${S(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S($s(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function sn(e){var n;d.teamStatsSelectedTeamId=e,d.teamStatsTab="topResults",d.teamStatsTopResultsFilterCategory=null,d.teamStatsTopResultsFilterSeason=null,d.teamStatsSelectedSeason="all",d.teamStatsSelectedRosterYear=((n=d.gameState)==null?void 0:n.season)??2026,d.teamStatsRosterSort={key:"overallRating",direction:"desc"},d.teamStatsTopResultsPage=1;const t=d.teams.find(i=>i.id===e);y("team-stats-title").innerHTML=t?`Team <strong>${S(t.name)}</strong>`:"Teamstatistik",y("team-stats-jersey").innerHTML=af(e,(t==null?void 0:t.name)??"");const a=Xg(e),r=a.average.toFixed(2).replace(".",",");y("team-stats-meta").innerHTML=t?`${S(t.abbreviation)} · ${S(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${r})`:"Daten werden geladen",y("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,Xe("teamStats");const s=await V.getTeamStats(e);if(d.teamStatsSelectedTeamId===e){if(!s.success||!s.data){y("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}d.teamStatsPayload=s.data,y("team-stats-body").innerHTML=pt(s.data)}}function rf(){y("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-stats-tab]");if(a){const n=a.dataset.teamStatsTab;(n==="topResults"||n==="career"||n==="contracts")&&(d.teamStatsTab=n,d.teamStatsPayload&&(y("team-stats-body").innerHTML=pt(d.teamStatsPayload)));return}const r=t.closest("button[data-team-top-results-page]");if(r){const n=Number(r.dataset.teamTopResultsPage);!isNaN(n)&&n>=1&&(d.teamStatsTopResultsPage=n,d.teamStatsPayload&&(y("team-stats-body").innerHTML=pt(d.teamStatsPayload)));return}const s=t.closest("th[data-team-roster-sort]");if(s){const n=s.dataset.teamRosterSort;n&&(d.teamStatsRosterSort.key===n?d.teamStatsRosterSort.direction=d.teamStatsRosterSort.direction==="asc"?"desc":"asc":(d.teamStatsRosterSort.key=n,d.teamStatsRosterSort.direction=n==="overallRating"||n==="potential"||n==="contractEndSeason"?"desc":"asc"),d.teamStatsPayload&&(y("team-stats-body").innerHTML=pt(d.teamStatsPayload)));return}}),y("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;d.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(y("team-stats-body").innerHTML=pt(d.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;d.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(y("team-stats-body").innerHTML=pt(d.teamStatsPayload))}else if(t.classList.contains("team-stats-filter-checkbox")){const a=t,r=a.dataset.filterType;d.teamStatsTopResultsFilters[r]=a.checked,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(y("team-stats-body").innerHTML=pt(d.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;d.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),d.teamStatsPayload&&(y("team-stats-body").innerHTML=pt(d.teamStatsPayload))}else if(t.id==="team-stats-roster-year-select"){const a=t;d.teamStatsSelectedRosterYear=Number(a.value),d.teamStatsPayload&&(y("team-stats-body").innerHTML=pt(d.teamStatsPayload))}})}let Wt="riders",ft="season",nn="season",st="";const wr=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function sf(){const e=y("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");of(o)})})}const t=y("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");lf(o)})})}wr.forEach(n=>{const i=y(n);i&&i.addEventListener("change",()=>{const o=i.value;o?df(o,n):wr.some(l=>{const p=y(l);return p&&p.value!==""})||(st="",ia())})}),window.openRiderStatsFromLeaderboard=na,window.openTeamStatsFromLeaderboard=sn;const a=y("leaderboard-filter-wt"),r=y("leaderboard-filter-pt"),s=y("leaderboard-filter-other");[a,r,s].forEach(n=>{n&&n.addEventListener("change",()=>{ia()})})}function nf(){ia()}function of(e){Wt=e;const t=y("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&((cf(st)||st==="strongest_lieutenants")&&(uf(),st=""),ft==="live"&&(ft=nn,tr())),ia()}function lf(e){ft=e,nn=e,ia()}function df(e,t){st=e,wr.forEach(a=>{if(a!==t){const r=y(a);r&&(r.value="")}}),Ml(e)?(ft="live",tr()):on(e)?(ft="alltime",tr()):(ft=nn,tr()),ia()}function Ml(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function on(e){return["max_short_term_fatigue","max_long_term_fatigue","max_combined_fatigue","max_s_form","max_r_form","max_combined_form","mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function cf(e){return Ml(e)||on(e)||e==="mentors_ranking"}function uf(){wr.forEach(e=>{const t=y(e);t&&(t.value="")})}function tr(){const e=y("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');ft==="live"?e.style.display="none":(e.style.display="flex",on(st)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),ft==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function ia(){var m,u,f;const e=y("leaderboard-empty"),t=y("leaderboard-table"),a=y("leaderboard-thead"),r=y("leaderboard-tbody");if(!e||!t||!a||!r)return;const s=y("leaderboard-filter-container");if(s&&(s.style.display=Wt==="teams"?"none":"flex"),!st){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await V.getLeaderboards(Wt,st,ft);if(!ke("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(Wt==="riders"){const g=((m=y("leaderboard-filter-wt"))==null?void 0:m.checked)??!0,v=((u=y("leaderboard-filter-pt"))==null?void 0:u.checked)??!0,h=((f=y("leaderboard-filter-other"))==null?void 0:f.checked)??!1;if(i=n.data.filter(b=>{const $=b.teamDivisionId===1&&!b.isRetired,M=b.teamDivisionId===2&&!b.isRetired,T=b.teamDivisionId===null||b.teamDivisionId===void 0||b.isRetired||b.teamDivisionId!==1&&b.teamDivisionId!==2;return!!($&&g||M&&v||T&&h)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const o=st==="highest_leadout_bonus",c=st==="strongest_lieutenants";Wt==="riders"?a.innerHTML=`
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 50px; text-align: center;">Trikot</th>
        <th style="width: 60px; text-align: center;">Land</th>
        <th>Fahrer</th>
        <th>Team</th>
        ${o?"<th>Rennen / Etappe / Jahr</th>":""}
        ${c?"<th>Fährt für</th>":""}
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
    `;let l="",p=1;for(const g of i){const v=p++,b=`<span class="badge ${v===1?"badge-primary":v<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${v}</span>`,$=_e(g.teamId,g.teamName);let M="";if(o){const x=g.stageNumber!=null?`Etappe ${g.stageNumber}`:"–";M=`<td style="vertical-align: middle;">${S(g.raceName??"–")} · ${S(x)} · ${S(String(g.season??"–"))}</td>`}let T="";if(c)if(g.lieutenantDetails){const x=g.lieutenantDetails,R=x.leaderNationality?oe(x.leaderNationality):"",w=x.leaderRoleName?` (${x.leaderRoleName})`:"";T=`
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${R}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${x.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${S(x.leaderFirstName)} ${S(x.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${S(w)}</span>
            </span>
          </td>
        `}else T='<td style="vertical-align: middle;">–</td>';if(Wt==="riders"){const x=g.nationality?oe(g.nationality):"—",R=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${g.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.firstName)} ${S(g.lastName)}</a>`,w=g.teamAbbr&&g.teamId!=null?`<a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #94a3b8; text-decoration: none; hover: text-decoration: underline;" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</a>`:g.teamAbbr?`<span class="text-muted" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</span>`:"—";l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${b}</td>
          <td style="text-align: center; vertical-align: middle;">${$}</td>
          <td style="text-align: center; vertical-align: middle;">${x}</td>
          <td style="vertical-align: middle;">${R}</td>
          <td style="vertical-align: middle;">${w}</td>
          ${M}
          ${T}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}else{let x="";if(g.leadoutDetails){const R=g.leadoutDetails,w=R.sprinterNationality?oe(R.sprinterNationality):"";x=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">
            <a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
              ${S(g.teamName.split(" (Sprinter:")[0])}
            </a>
          </div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${w}${S(R.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${R.contributors.map(E=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${E.nationality?oe(E.nationality):""}${S(E.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${E.contribution.toFixed(2)})</span>
                  </div>
                `).join("")}
            </div>
          </div>
        `}else x=`<strong><a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.teamName??"")}</a></strong>`;l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${b}</td>
          <td style="text-align: center; vertical-align: middle;">${$}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${x}</td>
          ${M}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}}r.innerHTML=l}let ta=2026,Ye=5,Si=!1;const mf=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function ki(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${r}`}function pf(e){var s;const t=(s=d.gameState)==null?void 0:s.currentDate;if(!t||e<=t)return;const a=ie(e);confirm(`Möchtest du automatisch bis zum ${a} simulieren?`)&&(d.autoProgressTargetDate=e,gl())}function gf(e,t){const a=[],r=new Date(e,t,1),s=new Date(e,t+1,0);let i=(r.getDay()+6)%7;const o=new Date(r);o.setDate(o.getDate()-i);const c=new Date(o);for(;c<=s||c.getDay()!==1;){const l=[];for(let p=0;p<7;p++)l.push(new Date(c)),c.setDate(c.getDate()+1);a.push(l)}return a}function ff(){if(Si)return;Si=!0,y("calendar-prev-month").addEventListener("click",()=>{Ye--,Ye<0&&(Ye=11,ta--),ar()}),y("calendar-next-month").addEventListener("click",()=>{Ye++,Ye>11&&(Ye=0,ta++),ar()}),y("calendar-today-btn").addEventListener("click",()=>{var t;if((t=d.gameState)!=null&&t.currentDate){const[a,r]=d.gameState.currentDate.split("-").map(Number);ta=a,Ye=r-1}ar()}),y("calendar-race-search").addEventListener("input",()=>{Rl()}),y("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&gs(s);return}const r=t.target.closest("[data-calendar-date]");if(r){const s=r.dataset.calendarDate;s&&pf(s)}}),y("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const s=Number(a.dataset.dashboardRaceId);Number.isFinite(s)&&gs(s);return}const r=t.target.closest("button[data-dashboard-race-participants-id]");if(r){const s=Number(r.dataset.dashboardRaceParticipantsId);Number.isFinite(s)&&ul(s)}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.remove("calendar-highlight")})}},!0))}function hf(){var e;if((e=d.gameState)!=null&&e.currentDate){const[t,a]=d.gameState.currentDate.split("-").map(Number);ta=t,Ye=a-1}ar()}function ar(){var s;if(!ke("calendar"))return;y("calendar-month-label").textContent=`${mf[Ye]} ${ta}`;const e=gf(ta,Ye),t=y("calendar-weeks"),a=((s=d.gameState)==null?void 0:s.currentDate)??"";let r="";for(const n of e){const i=n.map(ki),o=[];for(const m of d.races)if(m.startDate<=i[6]&&m.endDate>=i[0]){const u=m.startDate<i[0]?0:i.indexOf(m.startDate),f=m.endDate>i[6]?6:i.indexOf(m.endDate);o.push({race:m,startIdx:u,endIdx:f})}o.sort((m,u)=>{const f=m.endIdx-m.startIdx+1,g=u.endIdx-u.startIdx+1;return g!==f?g-f:m.startIdx-u.startIdx});const c=Array.from({length:3},()=>Array(7).fill(!1));for(const m of o){let u=2;for(let f=0;f<3;f++){let g=!0;for(let v=m.startIdx;v<=m.endIdx;v++)if(c[f][v]){g=!1;break}if(g){u=f;break}}for(let f=m.startIdx;f<=m.endIdx;f++)c[u][f]=!0;m.slot=u}const l=n.map(m=>{const u=ki(m),f=m.getMonth()!==Ye,g=u===a,v=u>a;return`
        <div class="${["calendar-day-cell",f?"other-month":"",g?"today":"",v?"is-future":""].filter(Boolean).join(" ")}" data-calendar-date="${u}">
          <span class="calendar-day-number" data-calendar-date="${u}">${m.getDate()}</span>
        </div>
      `}).join(""),p=o.map(m=>{var M;const u=m.race,f=a>=u.startDate&&a<=u.endDate,g=a>u.endDate,v=lt((M=u.category)==null?void 0:M.name),h=f?'<span class="calendar-live-dot"></span>':"",b=g?"opacity: 0.55;":"",$=m.endIdx-m.startIdx+1;return`
        <div class="calendar-event-bar ${f?"is-live":""}"
             data-race-id="${u.id}"
             style="grid-column: ${m.startIdx+1} / span ${$};
                    grid-row: ${m.slot+1};
                    background-color: ${v.background};
                    border: 1px solid ${v.border};
                    color: ${v.color};
                    ${b}"
             title="${S(u.name)} (${ie(u.startDate)} - ${ie(u.endDate)})">
          ${h}<span class="calendar-event-name">${S(u.name)}</span>
        </div>
      `}).join("");r+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${p}</div>
      </div>
    `}t.innerHTML=r,Rl()}function Rl(){var n;const e=y("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=y("calendar-races-tbody"),r=((n=d.gameState)==null?void 0:n.currentDate)??"",s=d.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(s.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=s.map(i=>{var h,b,$,M;const o=r>=i.startDate&&r<=i.endDate,l=r>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',p=((h=i.country)==null?void 0:h.name)??`Land ${i.countryId}`,m=(b=i.country)!=null&&b.code3?oe(i.country.code3):"",u=i.isStageRace?(i.stages??[]).reduce((T,x)=>T+(x.distanceKm??0),0):(($=i.upcomingStage)==null?void 0:$.distanceKm)??null,f=i.isStageRace?(i.stages??[]).reduce((T,x)=>T+(x.elevationGainMeters??0),0):((M=i.upcomingStage)==null?void 0:M.elevationGainMeters)??null,g=u!=null?String(u.toFixed(1)).replace(".",","):"-",v=f!=null?String(Math.round(f)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${ie(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${S(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${qs(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${m}<span>${S(p)}</span></span></td>
        <td>${Lr(i)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${i.id}">Teilnehmer</button></td>
        <td>${g}</td>
        <td>${v}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}let $t=null,xt=null,Je="id",ya=!0;function zt(e){const t=new Date(e);t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));const a=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t.getTime()-a.getTime())/864e5+1)/7)}function zr(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return"peak";const r=n=>{const i=n-8,o=n-1;if(i>=1)return t>=i&&t<=o;{const c=i+53;return t>=c||t<=o}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)?"prep":"none"}function Il(e){return e==="peak"?"cell-peak":e==="prep"?"cell-prep":""}function $i(e,t){const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${o}`,l=zt(c),p=zr(e,l);if(p==="peak"||p==="prep")return!0}return!1}function bf(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return!0;const r=s=>{const n=s-6,i=s-1;if(n>=1)return t>=n&&t<=i;{const o=n+53;return t>=o||t<=i}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)}function yf(e,t){const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${o}`,l=zt(c);if(bf(e,l))return!0}return!1}function Cl(e,t,a){const r=[{min:e.peak1_min,max:e.peak1_max},{min:e.peak2_min,max:e.peak2_max},{min:e.peak3_min,max:e.peak3_max}].sort((l,p)=>l.min-p.min);let s=0,n=0,i=0,o=0;const c=a.races.filter(l=>t.has(l.id));for(const l of c){const p=new Date(l.start_date),m=new Date(l.end_date);for(let u=new Date(p);u<=m;u.setDate(u.getDate()+1)){const f=u.getFullYear(),g=String(u.getMonth()+1).padStart(2,"0"),v=String(u.getDate()).padStart(2,"0"),h=`${f}-${g}-${v}`,b=zt(h);b<=r[0].max?s++:b<=r[1].max?n++:b<=r[2].max?i++:o++}}return{phase1:s,phase2:n,phase3:i,phase4:o}}function vf(e,t,a){const r=new Set(a.raceProgramRaces.filter(p=>p.program_id===e.id&&p.race_id!==t.id).map(p=>p.race_id)),s=Cl(e,r,a),n=new Set,i=new Date(t.start_date),o=new Date(t.end_date),c=[{min:e.peak1_min,max:e.peak1_max},{min:e.peak2_min,max:e.peak2_max},{min:e.peak3_min,max:e.peak3_max}].sort((p,m)=>p.min-m.min);for(let p=new Date(i);p<=o;p.setDate(p.getDate()+1)){const m=p.getFullYear(),u=String(p.getMonth()+1).padStart(2,"0"),f=String(p.getDate()).padStart(2,"0"),g=`${m}-${u}-${f}`,v=zt(g);v<=c[0].max?n.add("phase1"):v<=c[1].max?n.add("phase2"):v<=c[2].max?n.add("phase3"):n.add("phase4")}const l=t.is_stage_race===1;for(const p of n)if(p==="phase1"){if(l&&s.phase1>35||!l&&s.phase1>36)return!1}else if(p==="phase2"){if(l&&s.phase2>35||!l&&s.phase2>36)return!1}else if(p==="phase3"&&(l&&s.phase3>35||!l&&s.phase3>36))return!1;return!0}function Sf(e,t){const a=d.raceProgramsPayload;if(!a)return;const r=a.raceProgramRaces.findIndex(s=>s.program_id===e&&s.race_id===t);if(r===-1){const s=a.races.find(n=>n.id===t);if(s){const n=s.start_date,i=s.end_date,o=[];a.raceProgramRaces.forEach((c,l)=>{if(c.program_id===e&&c.race_id!==t){const p=a.races.find(m=>m.id===c.race_id);p&&p.start_date<=i&&p.end_date>=n&&o.push(l)}}),o.sort((c,l)=>l-c).forEach(c=>{a.raceProgramRaces.splice(c,1)})}a.raceProgramRaces.push({program_id:e,race_id:t})}else a.raceProgramRaces.splice(r,1);d.raceProgramsDirty=!0,Pe()}const ys=(()=>{const e=[],t=new Date(2026,0,1),a=new Date(2026,11,31),r=["So","Mo","Di","Mi","Do","Fr","Sa"];for(let s=new Date(t);s<=a;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${o}`,l=`${r[s.getDay()]}, ${o}.${String(s.getMonth()+1).padStart(2,"0")}`;e.push({dateStr:c,label:l,weekNum:zt(c)})}return e})();async function ln(e=!1){if(d.raceProgramsPayload&&!e){Pe();return}y("race-programs-root").innerHTML='<div class="results-empty">Programmdaten werden geladen...</div>';const t=await V.getRaceProgramsEditor();if(!t.success||!t.data){y("race-programs-root").innerHTML=`<div class="results-empty text-danger">${S(t.error??"Fehler beim Laden.")}</div>`;return}d.raceProgramsPayload=t.data,d.raceProgramsDirty=!1,d.raceProgramsSaving=!1,$t=null,xt=null,Pe()}function kf(){y("view-race-programs").addEventListener("click",e=>{const t=e.target,a=t.closest(".results-type-btn[data-tab]");if(a){const m=a.dataset.tab??"calendar-cols";d.raceProgramsActiveTab=m,Pe();return}const r=t.closest(".race-programs-action-btn");if(r){const m=r.dataset.action;m==="reload"?ln(!0):m==="save"&&wf();return}const s=t.closest(".race-row-expand-btn");if(s){const m=s.dataset.raceId,u=y(`race-details-row-${m}`);u&&(u.classList.toggle("hidden"),s.textContent=u.classList.contains("hidden")?"▶":"▼");return}const n=t.closest(".program-row-expand-btn");if(n){const m=n.dataset.programId,u=y(`program-details-row-${m}`);u&&(u.classList.toggle("hidden"),n.textContent=u.classList.contains("hidden")?"▶":"▼");return}const i=t.closest(".program-roles-sort-header");if(i){const m=i.dataset.sortKey;Je===m?ya=!ya:(Je=m,ya=m==="name"||m==="id"),Pe();return}const o=t.closest(".combo-origin-trigger");if(o){const m=o.dataset.raceId,u=o.dataset.comboKey,f=y(`combo-origin-${m}-${u}`);f&&f.classList.toggle("hidden");return}const c=t.closest(".race-popover-trigger");if(c){e.stopPropagation();const m=parseInt(c.dataset.raceId??"0",10);xt=null,$t===m?$t=null:$t=m,Pe();return}const l=t.closest(".race-rider-count-trigger");if(l){e.stopPropagation();const m=parseInt(l.dataset.raceId??"0",10);$t=null,xt===m?xt=null:xt=m,Pe();return}const p=t.closest(".popover-program-toggle");if(p){if(e.stopPropagation(),p.classList.contains("disabled"))return;const m=parseInt(p.dataset.programId??"0",10),u=parseInt(p.dataset.raceId??"0",10);Sf(m,u);return}!t.closest(".race-stages-popover-card")&&!t.closest(".race-rider-programs-popover-card")&&($t!==null||xt!==null)&&($t=null,xt=null,Pe())}),y("view-race-programs").addEventListener("click",e=>{const t=e.target.closest(".toggleable-race-cell[data-day]");if(!t)return;const a=t.dataset.day,r=parseInt(t.dataset.programId,10);Tf(r,a)}),y("view-race-programs").addEventListener("change",e=>{const t=e.target;if(t.classList.contains("peak-date-picker")){const a=parseInt(t.dataset.programId,10),r=parseInt(t.dataset.peak,10),s=t.value;if(s){const n=zt(s);xf(a,r,n)}return}if(t.classList.contains("peak-number-input")){const a=parseInt(t.dataset.programId,10),r=t.dataset.field,s=parseInt(t.value||"1",10);$f(a,r,s)}})}function $f(e,t,a){const r=d.raceProgramsPayload;if(!r)return;const s=r.programs.find(i=>i.id===e);if(!s)return;const n=Math.max(1,Math.min(53,a));if(s[t]=n,t.endsWith("_min")){const i=t.replace("_min","_max");s[i]<n&&(s[i]=n)}else if(t.endsWith("_max")){const i=t.replace("_max","_min");s[i]>n&&(s[i]=n)}d.raceProgramsDirty=!0,Pe()}function xf(e,t,a){const r=d.raceProgramsPayload;if(!r)return;const s=r.programs.find(o=>o.id===e);if(!s)return;const n=`peak${t}_min`,i=`peak${t}_max`;s[n]=Math.max(1,a-2),s[i]=Math.min(53,a+2),d.raceProgramsDirty=!0,Pe()}function Tf(e,t){const a=d.raceProgramsPayload;if(!a)return;const r=a.races.filter(n=>n.start_date<=t&&n.end_date>=t);if(r.length===0)return;const s=a.raceProgramRaces.findIndex(n=>n.program_id===e&&r.some(i=>i.id===n.race_id));if(s===-1)a.raceProgramRaces.push({program_id:e,race_id:r[0].id});else{const n=a.raceProgramRaces[s],i=r.findIndex(o=>o.id===n.race_id);i<r.length-1?n.race_id=r[i+1].id:a.raceProgramRaces.splice(s,1)}d.raceProgramsDirty=!0,Pe()}async function wf(){if(!d.raceProgramsPayload||d.raceProgramsSaving)return;d.raceProgramsSaving=!0,Pe();const e=await V.saveRaceProgramsEditor({programs:d.raceProgramsPayload.programs,raceProgramRaces:d.raceProgramsPayload.raceProgramRaces});if(d.raceProgramsSaving=!1,!e.success){alert(`Fehler beim Speichern:
${e.error??"Unbekannter Fehler"}`),Pe();return}d.raceProgramsDirty=!1,ln(!0)}function Gr(e,t){let a=0,r=0,s=0;const n=new Set(t.raceProgramRaces.filter(o=>o.program_id===e.id).map(o=>o.race_id)),i=t.races.filter(o=>n.has(o.id));for(const o of i){const c=new Date(o.start_date),l=new Date(o.end_date);for(let p=new Date(c);p<=l;p.setDate(p.getDate()+1)){const m=p.getFullYear(),u=String(p.getMonth()+1).padStart(2,"0"),f=String(p.getDate()).padStart(2,"0"),g=zt(`${m}-${u}-${f}`),v=zr(e,g);v==="peak"?a++:v==="prep"?r++:s++}}return{peak:a,prep:r,none:s}}function Pe(){const e=y("race-programs-root"),t=d.raceProgramsPayload;if(!t){e.innerHTML='<div class="results-empty">Keine Daten geladen.</div>';return}const a=window.scrollX,r=window.scrollY,s={},n=document.querySelector(".team-detail-table-scroll");n&&(s.table={scrollTop:n.scrollTop,scrollLeft:n.scrollLeft}),document.querySelectorAll(".popover-program-list-scroll").forEach(f=>{const g=f.getAttribute("data-race-id");g&&(s[`popover-${g}`]={scrollTop:f.scrollTop,scrollLeft:f.scrollLeft})});const o=d.raceProgramsDirty,c=d.raceProgramsSaving,l=d.raceProgramsActiveTab;let p=`
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
          <button type="button" class="btn btn-primary race-programs-action-btn" data-action="save" ${!o||c?"disabled":""}>
            ${c?"Speichert…":"Änderungen exportieren"}
          </button>
        </div>
      </div>
  `;l==="calendar-cols"?p+=Mf(t):l==="calendar-rows"?p+=Rf(t):l==="peak-editor"?p+=If(t):l==="rider-role"?p+=Ef(t):l==="program-roles"&&(p+=Pf(t)),p+="</div>",e.innerHTML=p;const m=document.querySelector(".team-detail-table-scroll");m&&s.table&&(m.scrollTop=s.table.scrollTop,m.scrollLeft=s.table.scrollLeft),document.querySelectorAll(".popover-program-list-scroll").forEach(f=>{const g=f.getAttribute("data-race-id");g&&s[`popover-${g}`]&&(f.scrollTop=s[`popover-${g}`].scrollTop,f.scrollLeft=s[`popover-${g}`].scrollLeft)}),window.scrollTo(a,r)}function Mf(e){var o,c,l;const t=e.programs,a=e.raceProgramRaces,r=e.races,s=t.map(p=>({id:p.id,stats:Gr(p,e)}));let n=`<tr>
    <th class="sticky-col-header" style="z-index: 15;">Tag / Datum</th>
    <th style="width: 50px; text-align: center;">KW</th>
  `;for(const p of t){const m=(o=s.find(u=>u.id===p.id))==null?void 0:o.stats;n+=`
      <th style="min-width: 140px; text-align: center;">
        <div style="font-weight: bold; font-size: 0.9rem;">${S(p.name)}</div>
        <div class="text-muted" style="font-size: 0.72rem; margin-top: 0.15rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${m==null?void 0:m.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${m==null?void 0:m.prep}</span> | 
          O: <span>${m==null?void 0:m.none}</span>
        </div>
      </th>
    `}n+="</tr>";let i="";for(const p of ys){const m=r.filter(h=>h.start_date<=p.dateStr&&h.end_date>=p.dateStr),u=m.length>0,f=u?"row-has-races":"";let g="";if(u){g='<div style="display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.15rem;">';for(const h of m){const b=lt((c=h.category)==null?void 0:c.name);g+=`
          <span class="race-id-badge" style="background-color: ${b.background}; border: 1px solid ${b.border}; color: ${b.color}; font-size: 0.65rem; padding: 0.05rem 0.2rem; text-align: left; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${S(h.name)}">
            ${S(h.name)}
          </span>
        `}g+="</div>"}let v=`
      <td class="sticky-col ${f}" style="font-weight: 600; vertical-align: top; padding: 0.4rem 0.6rem;">
        <div>${p.label}</div>
        ${g}
      </td>
      <td style="text-align: center; color: var(--text-500); font-variant-numeric: tabular-nums; vertical-align: top; padding-top: 0.4rem;">${p.weekNum}</td>
    `;for(const h of t){const b=zr(h,p.weekNum),$=Il(b),M=a.find(w=>w.program_id===h.id&&m.some(E=>E.id===w.race_id));let T="",x=`toggleable-race-cell ${$}`,R=`data-day="${p.dateStr}" data-program-id="${h.id}"`;if(M){const w=r.find(F=>F.id===M.race_id),E=lt((l=w==null?void 0:w.category)==null?void 0:l.name);T=`
          <span class="race-program-badge" style="background-color: ${E.background}; border: 1px solid ${E.border}; color: ${E.color};" title="${S(w==null?void 0:w.name)}">
            ${S(w==null?void 0:w.name)}
          </span>
        `}else u?T='<span class="race-cell-placeholder" title="Klicken zum Zuweisen">＋</span>':(x=$,R="");v+=`<td class="${x}" ${R} style="text-align: center; vertical-align: middle;">${T}</td>`}i+=`<tr>${v}</tr>`}return`
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
  `}function Rf(e){var f;const t=e.programs,a=e.raceProgramRaces,r=e.races;let s='<th class="sticky-col-header" style="z-index: 15;">Monat</th>',n='<th class="sticky-col-header" style="z-index: 15;">Tag / KW</th>',i='<th class="sticky-col-header" style="z-index: 15;">Rennen Anzahl</th>',o='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #1</th>',c='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #2</th>',l='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #3</th>';const p=[],m=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];for(const g of ys){const v=parseInt(g.dateStr.split("-")[1],10)-1,h=m[v];p.length===0||p[p.length-1].name!==h?p.push({name:h,span:1}):p[p.length-1].span++;const b=r.filter(R=>R.start_date<=g.dateStr&&R.end_date>=g.dateStr),$=b.length>0,M=$?`${b.length} R`:"",T=$?"race-count-active":"";n+=`<th style="text-align: center; min-width: 40px; font-variant-numeric: tabular-nums;">
      <div style="font-size: 0.8rem; font-weight: bold;">${g.dateStr.split("-")[2]}</div>
      <div style="font-size: 0.65rem; color: var(--text-500);">W${g.weekNum}</div>
    </th>`,i+=`<th class="${T}" style="text-align: center; font-size: 0.72rem; font-weight: bold;">${M}</th>`;const x=R=>{var A;const w=b[R];if(!w)return"";const E=lt((A=w.category)==null?void 0:A.name),F=a.filter(_=>_.race_id===w.id).length;return`
        <span class="race-id-badge" style="background-color: ${E.background}; border: 1px solid ${E.border}; color: ${E.color}; cursor: help;" 
              title="${S(w.name)}
Zugelassene Programme: ${F}">
          R${w.id}
        </span>
      `};o+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${x(0)}</th>`,c+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${x(1)}</th>`,l+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${x(2)}</th>`}for(const g of p)s+=`<th colspan="${g.span}" style="text-align: center; font-weight: bold; border-left: 1px solid var(--border);">${g.name}</th>`;let u="";for(const g of t){const v=Gr(g,e);let h=`
      <td class="sticky-col" style="z-index: 5; white-space: nowrap; font-weight: bold; border-right: 2px solid var(--border);">
        <div style="font-size: 0.85rem;">${S(g.name)}</div>
        <div class="text-muted" style="font-size: 0.7rem; font-weight: normal; margin-top: 0.1rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${v.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${v.prep}</span> | 
          O: <span>${v.none}</span>
        </div>
      </td>
    `;for(const b of ys){const $=zr(g,b.weekNum),M=Il($),T=r.filter(A=>A.start_date<=b.dateStr&&A.end_date>=b.dateStr),x=T.length>0,R=a.find(A=>A.program_id===g.id&&T.some(_=>_.id===A.race_id));let w="",E=`toggleable-race-cell ${M}`,F=`data-day="${b.dateStr}" data-program-id="${g.id}"`;if(R){const A=r.find(z=>z.id===R.race_id),_=lt((f=A==null?void 0:A.category)==null?void 0:f.name);w=`
          <span class="race-id-badge" style="background-color: ${_.background}; border: 1px solid ${_.border}; color: ${_.color};" title="${S(A==null?void 0:A.name)}">
            R${A==null?void 0:A.id}
          </span>
        `}else x?w='<span style="font-size: 0.72rem; color: var(--text-500); opacity: 0.5;">＋</span>':(E=M,F="");h+=`<td class="${E}" ${F} style="text-align: center; vertical-align: middle; padding: 0.35rem 0;">${w}</td>`}u+=`<tr>${h}</tr>`}return`
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh; overflow-x: auto;">
        <table class="data-table data-table-teams race-programs-calendar-table">
          <thead>
            <tr class="month-header-row">${s}</tr>
            <tr>${n}</tr>
            <tr style="background: rgba(148, 163, 184, 0.05);">${i}</tr>
            <tr>${o}</tr>
            <tr>${c}</tr>
            <tr>${l}</tr>
          </thead>
          <tbody>
            ${u}
          </tbody>
        </table>
      </div>
    </div>
  `}function If(e){return`
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
            ${e.programs.map(r=>{const s=[{min:r.peak1_min,max:r.peak1_max},{min:r.peak2_min,max:r.peak2_max},{min:r.peak3_min,max:r.peak3_max}].sort((p,m)=>p.min-m.min),n=s[1].min-s[0].max<8,i=s[2].min-s[1].max<8,c=n||i?'<span style="color: #f97316; font-size: 1.1rem; cursor: help;" title="Warnung: Peakbereiche liegen weniger als 8 Wochen auseinander!">⚠️</span>':'<span style="color: #22c55e;">✔ OK</span>',l=p=>{const m=r[`peak${p}_min`]??1,u=r[`peak${p}_max`]??1;return`
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <input type="number" class="peak-number-input form-control" data-program-id="${r.id}" data-field="peak${p}_min" min="1" max="53" value="${m}" style="width: 55px; text-align: center; padding: 0.2rem;">
          <span class="text-muted">–</span>
          <input type="number" class="peak-number-input form-control" data-program-id="${r.id}" data-field="peak${p}_max" min="1" max="53" value="${u}" style="width: 55px; text-align: center; padding: 0.2rem;">
          <input type="date" class="peak-date-picker form-control" data-program-id="${r.id}" data-peak="${p}" style="width: 40px; padding: 0.15rem; font-size: 0.8rem; cursor: pointer;" title="KW aus Datum berechnen (-2/+2 Wochen)">
        </div>
      `};return`
      <tr>
        <td style="font-weight: bold; color: var(--text-100);">${r.id}</td>
        <td style="font-weight: bold; min-width: 150px;">${S(r.name)}</td>
        <td>${l(1)}</td>
        <td>${l(2)}</td>
        <td>${l(3)}</td>
        <td style="text-align: center;">${c}</td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function Cf(e,t){const a=t.filter(o=>o.race_id===e).sort((o,c)=>o.stage_number-c.stage_number);if(a.length===0)return{countHtml:"Keine Etappen",stagesListHtml:"Keine Etappendaten vorhanden."};const r={};for(const o of a)r[o.profile]=(r[o.profile]||0)+1;const n=Object.entries(r).sort((o,c)=>c[1]-o[1]).map(([o,c])=>`${S(o)}: ${c}x`).join("<br>"),i=a.map(o=>`
    <div class="popover-stage-row">
      <span class="popover-stage-num">Et. ${o.stage_number}:</span>
      <span class="popover-stage-profile">${S(o.profile)}</span>
    </div>
  `).join("");return{countHtml:n,stagesListHtml:i}}function Ef(e){const t=[...e.races].sort((i,o)=>i.start_date.localeCompare(o.start_date)),a=e.raceProgramRaces,r=e.stages,s=e.programDistribution;return`
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
            ${t.map(i=>{const o=new Set(a.filter(I=>I.race_id===i.id).map(I=>I.program_id)),c=s.filter(I=>o.has(I.program_id)),m=e.programs.map(I=>{const D=a.some(vt=>vt.program_id===I.id&&vt.race_id===i.id),B=s.find(vt=>vt.program_id===I.id),Z=B?parseInt(B.deterministic_rider_count||"0",10):0,ne=B?parseInt(B.deterministic_role_Kapitaen||"0",10):0,fe=B?parseInt(B.deterministic_role_Co_Kapitaen||"0",10):0,ge=B?parseInt(B.deterministic_role_Edelhelfer||"0",10):0,Te=B?parseInt(B.deterministic_role_Starke_Helfer||"0",10):0,ve=B?parseInt(B.deterministic_role_Wassertraeger||"0",10):0,he=B?parseInt(B.deterministic_role_Sprinter||"0",10):0,Se=[];ne>0&&Se.push(`${ne} Kapitän`),fe>0&&Se.push(`${fe} Co-Kapitän`),ge>0&&Se.push(`${ge} Edelhelfer`),Te>0&&Se.push(`${Te} Starke Helfer`),ve>0&&Se.push(`${ve} Wasserträger`),he>0&&Se.push(`${he} Sprinter`);const tt=Se.length>0?`(${Se.join(", ")})`:"",le=Gr(I,e),oa=le.peak+le.prep+le.none;return{program:I,isAssigned:D,count:Z,rolesStr:tt,totalDays:oa}}).sort((I,D)=>I.isAssigned!==D.isAssigned?I.isAssigned?-1:1:D.count-I.count).filter(I=>$i(I.program,i)||I.isAssigned).map(I=>{const D=I.program,B=$i(D,i);let Z="";B||(Z='<span style="color: #fb923c; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(251, 146, 60, 0.15); border: 1px solid #fb923c; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb der Peak- und Aufbauphase dieses Programms!">!</span>');let ne="";yf(D,i)||(ne='<span style="color: #c084fc; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(192, 132, 252, 0.15); border: 1px solid #c084fc; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb des Peakbereichs und der 6-wöchigen Anstiegsphase dieses Programms!">!</span>');let ge="";vf(D,i,e)||(ge='<span style="color: #38bdf8; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; border-radius: 50%; font-size: 0.65rem;" title="Achtung: Dieses Programm hat in diesem Saisonabschnitt bereits das Limit an Renntagen erreicht (max. 36 Tage bzw. 35 Tage für Rundfahrten)!">!</span>');let ve="";if(!I.isAssigned){const la=a.filter(we=>we.program_id===D.id&&we.race_id!==i.id).map(we=>e.races.find(Ft=>Ft.id===we.race_id)).filter(we=>we&&we.start_date<=i.end_date&&we.end_date>=i.start_date);if(la.length>0){const we=la.map(Ft=>Ft.name).join(", ");ve=`<span style="color: #ef4444; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 50%; font-size: 0.65rem;" title="Kollision: Dieses Programm ist bereits einem zeitlich parallelen Rennen zugewiesen: ${S(we)}!">!</span>`}}const he=I.isAssigned?"font-weight: bold; color: var(--text-100);":"color: var(--text-500);",Se=I.isAssigned?"☑":"☐",tt=B||I.isAssigned,le=tt?"cursor: pointer;":"cursor: not-allowed; opacity: 0.4; pointer-events: none;";return`
        <div class="popover-program-toggle${tt?"":" disabled"}" data-program-id="${D.id}" data-race-id="${i.id}" 
             style="${le} padding: 0.45rem 0.6rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); transition: background-color 0.15s; white-space: nowrap;"
             onmouseover="${tt?"this.style.backgroundColor='rgba(99, 102, 241, 0.08)'":""}"
             onmouseout="this.style.backgroundColor='transparent'">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
            <span style="font-size: 1.15rem; line-height: 1; user-select: none; color: ${I.isAssigned?"var(--accent-h)":"var(--text-500)"};">${Se}</span>
            <span style="${he} font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis;" title="${S(D.name)} (${I.totalDays} Renntage)">
              ${S(D.name)} (${I.totalDays} RT)
            </span>
            ${Z}
            ${ne}
            ${ge}
            ${ve}
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;">
            <strong style="font-size: 0.8rem; color: var(--accent-h);">${I.count} Fahrer</strong>
            <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal;" title="${S(I.rolesStr)}">${S(I.rolesStr)}</span>
          </div>
        </div>
      `}).join(""),u=xt===i.id;let f=0,g=0,v=0,h=0,b=0,$=0,M=0;const T={Kapitaen:{},Co_Kapitaen:{},Sprinter:{},Edelhelfer:{},Starke_Helfer:{},Wassertraeger:{}},x=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],R=["Berg","Hill","Sprint","Timetrial","Cobble","Attacker"];for(const I of c){f+=parseInt(I.deterministic_rider_count||"0",10),g+=parseInt(I.deterministic_role_Kapitaen||"0",10),v+=parseInt(I.deterministic_role_Co_Kapitaen||"0",10),h+=parseInt(I.deterministic_role_Sprinter||"0",10),b+=parseInt(I.deterministic_role_Edelhelfer||"0",10),$+=parseInt(I.deterministic_role_Starke_Helfer||"0",10),M+=parseInt(I.deterministic_role_Wassertraeger||"0",10);for(const D of x)for(const B of R){const Z=`deterministic_${D}_spec1_${B}`,ne=parseInt(I[Z]||"0",10);T[D][B]=(T[D][B]||0)+ne}}let w=0;i.is_stage_race===1&&(w=r.filter(D=>D.race_id===i.id).filter(D=>{const B=(D.profile||"").toLowerCase();return B==="flat"||B==="rolling"}).length);let E=!1,F=0;if(i.is_stage_race===0){const I=r.find(B=>B.race_id===i.id),D=((I==null?void 0:I.profile)||"").toLowerCase();E=D==="cobble"||D==="cobble_hill",E&&(F=(e.roleSpecCombinations||[]).filter(Z=>o.has(Z.program_id)).filter(Z=>Z.spec1==="Cobble"||Z.spec2==="Cobble"||Z.spec3==="Cobble").reduce((Z,ne)=>Z+ne.count,0))}let A="<strong>Rennprogramme verwalten</strong>";i.is_stage_race===0&&E?A=`
        <strong>Rennprogramme verwalten 
          (<span style="color: ${F<20?"#ef4444":"var(--accent-h)"}; font-weight: bold;" title="Kopfsteinpflaster-Spezialisten: ${F} / min. 20">Gesamtfahrer: ${f}</span>)
        </strong>
      `:A=`<strong>Rennprogramme verwalten (Gesamtfahrer: ${f})</strong>`;const _=`
      <div class="race-rider-programs-popover-card ${u?"":"hidden"}"
           style="position: absolute; top: calc(100% + 0.45rem); right: 0; z-index: 120; min-width: 600px; max-width: 750px; padding: 0.8rem 0.9rem; border: 1px solid rgba(148, 163, 184, 0.18); border-radius: var(--radius-md); background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%); box-shadow: var(--shadow); text-align: left; font-weight: normal;">
        <div class="popover-head" style="border-bottom: 1px solid rgba(148, 163, 184, 0.12); padding-bottom: 0.4rem; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
          ${A}
          <span style="font-size: 0.65rem; font-weight: normal; color: var(--text-500);">Klicken zum Aktivieren</span>
        </div>
        <div class="popover-program-list-scroll" data-race-id="${i.id}" style="display: flex; flex-direction: column; gap: 0.2rem; max-height: 350px; overflow-y: auto;">
          ${m}
        </div>
      </div>
    `;let z="text-align: center; font-variant-numeric: tabular-nums;";i.is_stage_race===1&&w>=2&&(h<=7?z+=" background-color: rgba(239, 68, 68, 0.2); color: #ef4444; font-weight: bold;":h>7&&h<10&&(z+=" background-color: rgba(234, 179, 8, 0.2); color: #eab308; font-weight: bold;"));let O="position: relative; text-align: center; font-variant-numeric: tabular-nums; vertical-align: middle;",G="font-weight: bold; border: none; background: transparent; padding: 0.15rem 0.4rem; cursor: pointer; color: var(--accent-h); text-decoration: underline;";i.is_stage_race===0&&E&&F<20&&(O+=" background-color: rgba(239, 68, 68, 0.2);",G+=" color: #ef4444; font-weight: bold;");const C=`
      <button type="button" class="race-rider-count-trigger btn-link" data-race-id="${i.id}" 
              style="${G}">
        ${f}
      </button>
    `;let H="—";if(i.is_stage_race===0){const I=r.find(D=>D.race_id===i.id);H=(I==null?void 0:I.profile)??"Flat"}let U="",j=`<strong>${S(i.name)}</strong>`;if(i.is_stage_race===1){const I=$t===i.id,{countHtml:D,stagesListHtml:B}=Cf(i.id,r);U=`
        <div class="race-stages-popover-card ${I?"":"hidden"}">
          <div class="popover-head"><strong>${S(i.name)}</strong> - Etappen</div>
          <div class="popover-stages-list">${B}</div>
          <div class="popover-separator"></div>
          <div class="popover-head">Profile Zusammenfassung</div>
          <div class="popover-profiles-summary">${D}</div>
        </div>
      `,j=`
        <button type="button" class="race-popover-trigger btn-link" data-race-id="${i.id}" style="text-align: left; font-weight: bold; border: none; background: transparent; padding: 0; cursor: pointer; color: var(--accent-h);">
          ${S(i.name)}
        </button>
      `}let X=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"];if(i.is_stage_race===0){const I=r.find(B=>B.race_id===i.id),D=((I==null?void 0:I.profile)??"").toLowerCase();D.includes("cobble")?X=["Cobble","Sprint","Hill","Attacker","Timetrial","Berg"]:(D.includes("flat")||D.includes("rolling"))&&(X=["Sprint","Timetrial","Attacker","Hill","Cobble","Berg"])}const J=[],te=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],W={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},P={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},L=(e.roleSpecCombinations||[]).filter(I=>o.has(I.program_id)),N=new Map;for(const I of L){const D=I.spec2||"—",B=`${I.role}|${I.spec1}|${D}`;N.set(B,(N.get(B)||0)+I.count)}const Y=[...N.entries()].map(([I,D])=>{const[B,Z,ne]=I.split("|");return{role:B,spec1:Z,spec2:ne,count:D}}).sort((I,D)=>{const B=te.indexOf(I.role)-te.indexOf(D.role);if(B!==0)return B;const Z=X.indexOf(I.spec1)-X.indexOf(D.spec1);return Z!==0?Z:D.count-I.count}),K=(I,D)=>{const B=P[I]??I,Z=D!=="—"?P[D]??D:"—";return`${B} / ${Z}`};for(const I of Y)if(I.count>0){const D=I.spec1==="Berg"&&I.spec2==="Cobble"||I.spec1==="Cobble"&&I.spec2==="Berg",B=D?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",Z=D?"color: #f97316; font-weight: bold;":"color: var(--text-100);",ne=D?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",fe=`${I.role}_${I.spec1}_${I.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`,Te=L.filter(ve=>ve.role===I.role&&ve.spec1===I.spec1&&(ve.spec2||"—")===I.spec2).map(ve=>{const he=e.programs.find(Se=>Se.id===ve.program_id);return`<span style="white-space: nowrap; margin-right: 0.8rem;">${S((he==null?void 0:he.name)??"Unbekannt")}: <strong>${ve.count}</strong></span>`}).join(" ");J.push(`
          <div style="${B}">
            <span style="${Z}">${W[I.role]||I.role} <span class="text-muted">(${K(I.spec1,I.spec2)})</span></span>
            <strong style="${ne} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="${i.id}" data-combo-key="${fe}">
              ${I.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-${i.id}-${fe}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: ${Te}
          </div>
        `)}const k=J.length>0?J.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost race-row-expand-btn" data-race-id="${i.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td>${ie(i.start_date)}</td>
        <td class="race-programs-popup-anchor" style="position: relative; vertical-align: middle;">
          ${j}
          ${U}
        </td>
        <td style="font-weight: bold; color: var(--accent-h); text-align: center;">${H}</td>
        <td class="race-programs-popup-anchor" style="${O}">
          ${C}
          ${_}
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${g}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${v}</td>
        <td style="${z}">${h}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${b}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${$}</td>
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
  `}function El(e){return Je!==e?'<span style="opacity:0.35; margin-left:4px;">↕</span>':`<span style="color:var(--accent-h); margin-left:4px; font-weight:bold;">${ya?"↑":"↓"}</span>`}function mt(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${Je===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
        <span>${S(t)}</span>
        ${El(e)}
      </div>
    </th>
  `}function Ff(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${Je===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: flex-start; gap: 2px;">
        <span>${S(t)}</span>
        ${El(e)}
      </div>
    </th>
  `}function Pf(e){const t=e.programs,a=e.roleSpecCombinations||[],r={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},s={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},n=t.map(o=>{const c=a.filter(f=>f.program_id===o.id);let l=0;const p={Kapitaen:0,Co_Kapitaen:0,Sprinter:0,Edelhelfer:0,Starke_Helfer:0,Wassertraeger:0};for(const f of c)l+=f.count,p[f.role]!==void 0&&(p[f.role]+=f.count);const m=Gr(o,e),u=m.peak+m.prep+m.none;return{program:o,totalRiders:l,roleCounts:p,progCombos:c,raceDays:u}});n.sort((o,c)=>{let l=0;return Je==="id"?l=o.program.id-c.program.id:Je==="name"?l=o.program.name.localeCompare(c.program.name):Je==="total"?l=o.totalRiders-c.totalRiders:Je==="raceDays"?l=o.raceDays-c.raceDays:l=(o.roleCounts[Je]||0)-(c.roleCounts[Je]||0),l===0&&(l=o.program.id-c.program.id),ya?l:-l});const i=n.map(o=>{const c=o.program,l=o.progCombos,p=o.totalRiders,m=o.roleCounts,u=o.raceDays,f=new Set(e.raceProgramRaces.filter(R=>R.program_id===c.id).map(R=>R.race_id)),g=Cl(c,f,e),v=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],h=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"],b=new Map;for(const R of l){const w=R.spec2||"—",E=`${R.role}|${R.spec1}|${w}`;b.set(E,(b.get(E)||0)+R.count)}const $=[...b.entries()].map(([R,w])=>{const[E,F,A]=R.split("|");return{role:E,spec1:F,spec2:A,count:w}}).sort((R,w)=>{const E=v.indexOf(R.role)-v.indexOf(w.role);if(E!==0)return E;const F=h.indexOf(R.spec1)-h.indexOf(w.spec1);return F!==0?F:w.count-R.count}),M=(R,w)=>{const E=s[R]??R,F=w!=="—"?s[w]??w:"—";return`${E} / ${F}`},T=[];for(const R of $)if(R.count>0){const w=R.spec1==="Berg"&&R.spec2==="Cobble"||R.spec1==="Cobble"&&R.spec2==="Berg",E=w?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",F=w?"color: #f97316; font-weight: bold;":"color: var(--text-100);",A=w?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",_=`${R.role}_${R.spec1}_${R.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`;T.push(`
          <div style="${E}">
            <span style="${F}">${r[R.role]||R.role} <span class="text-muted">(${M(R.spec1,R.spec2)})</span></span>
            <strong style="${A} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="prog-${c.id}" data-combo-key="${_}">
              ${R.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-prog-${c.id}-${_}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: <span style="white-space: nowrap; margin-right: 0.8rem;">${S(c.name)}: <strong>${R.count}</strong></span>
          </div>
        `)}const x=T.length>0?T.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost program-row-expand-btn" data-program-id="${c.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td style="font-weight: bold; color: var(--text-100);">${c.id}</td>
        <td style="font-weight: bold; min-width: 150px;">${S(c.name)}</td>
        <td style="text-align: center; font-weight: bold; color: var(--accent-h); font-variant-numeric: tabular-nums;">${p}</td>
        <td style="text-align: center; font-weight: bold; color: var(--text-100); font-variant-numeric: tabular-nums;" title="Abschnitts-Renntage:
Start bis Peak 1: ${g.phase1} Tage
Peak 1 bis Peak 2: ${g.phase2} Tage
Peak 2 bis Peak 3: ${g.phase3} Tage
Jenseits Peak 3: ${g.phase4} Tage">
          ${u} <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal; display: block; margin-top: 0.15rem;">${g.phase1} / ${g.phase2} / ${g.phase3} / ${g.phase4}</span>
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${m.Kapitaen||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${m.Co_Kapitaen||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${m.Sprinter||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${m.Edelhelfer||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${m.Starke_Helfer||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${m.Wassertraeger||"—"}</td>
      </tr>
      <tr id="program-details-row-${c.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
        <td colspan="11" style="padding: 0.5rem 1.5rem;">
          <div style="max-width: 450px; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
            <div style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; font-weight: bold; background: rgba(99,102,241,0.08); color: var(--text-100);">Zusammensetzung (Rolle / Spezialisierung)</div>
            ${x}
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
              ${mt("id","ID","width: 50px;")}
              ${Ff("name","Programm")}
              ${mt("total","Fahrer gesamt","width: 110px; text-align: center; font-weight: bold;")}
              ${mt("raceDays","Renntage","width: 100px; text-align: center; font-weight: bold;")}
              ${mt("Kapitaen","Kapitän","width: 90px; text-align: center;")}
              ${mt("Co_Kapitaen","Co-Kapitän","width: 90px; text-align: center;")}
              ${mt("Sprinter","Sprinter","width: 90px; text-align: center;")}
              ${mt("Edelhelfer","Edelhelfer","width: 90px; text-align: center;")}
              ${mt("Starke_Helfer","Starke Helfer","width: 100px; text-align: center;")}
              ${mt("Wassertraeger","Wasserträger","width: 100px; text-align: center;")}
            </tr>
          </thead>
          <tbody>
            ${i.join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.openTeamStats=sn;async function Fl(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}Rr("game"),y("meta-career").textContent=((e=d.currentSave)==null?void 0:e.careerName)??"",d.seasonStandingsSelectedSeason=null,d.riderStatsSelectedSeason=null,It("dashboard"),xe("Spiel wird geladen…");try{await Xs(),await Qs(),_r()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{ye()}}function Nf(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";It(t),t==="dashboard"&&_r(),t==="teams"&&$r(),t==="riders"&&$r(),t==="rider-team-editor"&&Sl(),t==="live-race"&&Qt(),t==="results"&&Ce(),t==="draft"&&Br(d.draftSelectedSeason||((a=d.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&Kg(),t==="season-standings"&&wl(!0),t==="leaderboards"&&nf(),t==="calendar"&&hf(),t==="race-programs"&&ln(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&Bo()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&na(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&sn(a)}),y("btn-cancel-new").addEventListener("click",()=>Ue("newCareer")),y("btn-close-race-stages").addEventListener("click",()=>Ue("raceStages")),y("btn-close-stage-profile").addEventListener("click",()=>Ue("stageProfile")),y("btn-close-rider-program").addEventListener("click",()=>Ue("riderProgram")),y("btn-close-rider-stats").addEventListener("click",()=>Ue("riderStats")),y("btn-close-team-stats").addEventListener("click",()=>Ue("teamStats")),y("btn-close-race-participants").addEventListener("click",()=>Ue("raceParticipants")),y("btn-close-roster-editor").addEventListener("click",()=>ps()),y("btn-cancel-roster-editor").addEventListener("click",()=>ps()),y("btn-apply-roster-editor").addEventListener("click",()=>{ag()}),y("btn-back-menu").addEventListener("click",()=>{Yt==null||Yt.pause(),Rr("menu"),Ma()}),Kl(),yg(),ff(),tl(),yl(),_g(),rg(),Jp(),yp(),Lp(),rf(),Ug(),sf(),kf(),$l()}(async()=>(Gm(),pe(),Nf(),Rr("menu"),await Ma()))();
