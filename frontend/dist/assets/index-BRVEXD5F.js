(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();function ro(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Ms(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function lt(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function Wa(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function De(e,t={}){const a=t.strong===!1?"span":"strong",r=Ms("app-rider-link-label",t.labelClassName),s=`<${a} class="${r}">${ro(e)}</${a}>`;if(t.riderId==null)return s;const n=['type="button"','class="'+Ms("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${s}</button>`}function rt(e,t,a=!0,r=""){const s=a===!1?"span":"strong",n=`<${s} class="app-team-link-label">${ro(e)}</${s}>`;return t==null?n:`<button type="button" class="${Ms("app-team-link",r)}" data-team-id="${t}">${n}</button>`}function so(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function no(e){return Math.round(e*10)/10}function io(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function oo(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function lo(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function cd(e,t){return e.skills.stamina*(t/300)}function co(e,t,a){return e.skills.timeTrial+lo(e,t)+e.skills.mountain*(a/500)}function ud(e,t,a,r){const s=cd(e,a),n=lo(e,r);switch(t.profile){case"Flat":return .8*e.skills.sprint+.15*e.skills.acceleration+.05*e.skills.flat+n+s;case"Rolling":return .7*e.skills.sprint+.2*e.skills.acceleration+.1*e.skills.hill+n+s;case"Hilly":return .45*e.skills.sprint+.1*e.skills.flat+.45*e.skills.hill+n+s;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+s;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+s;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+s;case"High_Mountain":return e.skills.mountain+n+s;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+s;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+s;default:return .8*e.skills.sprint+.2*e.skills.flat+n+s}}function md(e,t,a,r,s){return t.profile==="ITT"||t.profile==="TTT"?co(e,s,r):ud(e,t,a,s)}function pd(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:no(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function uo(e,t,a,r){io(a,r);const s=oo(a,r),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const m=o.get(l.activeTeamId)??[];m.push(l),o.set(l.activeTeamId,m)}return[...o.entries()].map(([l,m])=>{const p=n.get(l),f=m.map(y=>co(y,so(y.id,r==null?void 0:r.dailyFormByRiderId),s)).sort((y,k)=>k-y).slice(0,5),g=f.length,h=g>0?f.reduce((y,k)=>y+k,0)/g:0,b=Math.max(0,5-g)*2;return{team:p??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:h-b}}).sort((l,m)=>m.score-l.score||l.team.id-m.team.id).slice(0,20).map((l,m)=>({rank:m+1,kind:"team",effectiveSkill:no(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(r!=null?Rr(e,t,a,r):Rr(e,t,a)).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id).slice(0,20).map((o,c)=>pd(o,c+1))}function Rr(e,t,a,r){const s=io(a,r),n=oo(a,r),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var c;return{rider:o,teamName:o.activeTeamId!=null?((c=i.get(o.activeTeamId))==null?void 0:c.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:md(o,a,s,n,so(o.id,r==null?void 0:r.dailyFormByRiderId))}}).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id)}const d={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,seasonStandingsSelectedSeason:null,draftHistory:null,injuries:null,draftSelectedSeason:null,draftOverlayActive:!1,draftOverlayAuto:!0,draftOverlayPicks:null,draftOverlayCurrentIndex:0,draftSpeedMultiplier:1,draftPaused:!1,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorHideBoringSegments:!0,stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsSelectedSeason:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsFilterRank:null,riderStatsTopResultsFilterProfile:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,breakaway:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedRosterYear:null,teamStatsRosterSort:{key:"overallRating",direction:"desc"},teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsFilterRank:null,teamStatsTopResultsFilterProfile:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,breakaway:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1,autoProgressTargetDate:null,raceProgramsPayload:null,raceProgramsActiveTab:"calendar-cols",raceProgramsDirty:!1,raceProgramsSaving:!1};let ia=null;function mo(e){ia=e}let qr=!1;function Rs(e){qr=e}let Us=null;function Is(e){Us=e}let Ir=null;function Cs(e){Ir=e}let vt=!1;function Ys(e){vt=e}function v(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function de(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function _a(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),r=Math.floor(e%60),s=String(a).padStart(2,"0"),n=String(r).padStart(2,"0");return t>0?`${t}:${s}:${n}`:`${a}:${n}`}function vr(e){return e==null||e===0?"–":`+${_a(e)}`}const Ca=2,Cr=3,Zs=4;function Js(e){return`/jersey/Jer_${e}.png`}function Mt(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((r=d.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${S(a)}" aria-label="${S(a)}">
      <img
        class="results-team-jersey-img"
        src="${S(Js(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function aa(e,t){return`<span class="results-jersey-cell">${Mt(e,t)}</span>`}function mt(e){return e&&ce(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function _t(e){var a;if(e==null)return null;const t=Me(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function Me(e){return e==null?null:d.riders.find(t=>t.id===e)??null}function Ht(e){return e==null?null:d.races.find(t=>t.id===e)??null}function Aa(e){var t;if(e==null)return null;for(const a of d.races){const r=(t=a.stages)==null?void 0:t.find(s=>s.id===e);if(r)return{race:a,stage:r}}return null}function ra(e,t=!0,a=!1,r=null,s=null){const n=De(e,{riderId:r,teamId:s,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function po(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function Fr(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function Er(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function go(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}let er=new Map,Gn=null;function qs(e){if(d.riders!==Gn){er.clear(),Gn=d.riders;for(let t=0;t<d.riders.length;t++){const a=d.riders[t];if(a.activeTeamId!=null){let r=er.get(a.activeTeamId);r||(r=[],er.set(a.activeTeamId,r)),r.push(a)}}}return er.get(e)||[]}const ze={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function ce(e){const t=ze[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function fo(e,t){return e?`<span class="country-chip">${ce(e.code3)}<span>${S(e.name)}</span></span>`:t?S(t):"–"}function Pr(e){return`${e.toFixed(2).replace(".",",")} km`}function Nr(e){return`${Math.round(e)} hm`}function gd(e){return`${e>0?"+":""}${e.toFixed(1).replace(".",",")}%`}const ho=new Set;function fd(e){ho.add(e)}function Xr(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),v(`screen-${e}`).classList.remove("hidden")}function gt(e){v(`modal-${e}`).classList.remove("hidden")}function tt(e){v(`modal-${e}`).classList.add("hidden")}function Kn(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function bo(){var h,b;const e=d.realtimeBootstrap;if(!e)return;const t=v("instant-sim-favorites"),a=v("instant-sim-gc"),r=v("instant-sim-points");if(!t||!a||!r)return;const s=v("instant-sim-race"),n=v("instant-sim-stage-desc"),i=v("instant-sim-date");s&&(s.textContent=e.race.name),n&&(n.textContent=`Etappe ${e.stage.stageNumber} · ${e.stage.profile}`),i&&(i.textContent=de(e.stage.date));const c=uo(e.riders,e.teams,e.stage,{distanceKm:(h=e.stageSummary)==null?void 0:h.distanceKm,elevationGainMeters:(b=e.stageSummary)==null?void 0:b.elevationGainMeters}).slice(0,10),l=new Map(e.gcStandings.map(y=>[y.riderId,y]));let m=`
    <h3>
      <span>Etappen-Favoriten</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const y of c){const k=e.riders.find(R=>R.id===y.riderId);if(!k)continue;const T=_t(k.id)??"un",x=ze[T]??"un",$=e.teams.find(R=>R.id===k.activeTeamId),D=($==null?void 0:$.abbreviation)??"—",E=l.get(k.id),M=E?`GC ${E.rank} (${E.rank===1?"Gelb":Kn(E.gapSeconds)})`:"GC –";m+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${k.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${y.rank}</span>
            <span class="fi fi-${x} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${S(k.firstName)} <strong>${S(k.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(D)}</span>
            <span class="instant-sim-gc-info">${M}</span>
          </div>
        </div>
      </div>
    `}m+="</div>",t.innerHTML=m;const p=e.gcStandings.slice(0,10);let u=`
    <h3>
      <span>Gesamtwertung (GC)</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const y of p){const k=e.riders.find(M=>M.id===y.riderId);if(!k)continue;const T=_t(k.id)??"un",x=ze[T]??"un",$=e.teams.find(M=>M.id===k.activeTeamId),D=($==null?void 0:$.abbreviation)??"—",E=y.rank===1?"Gelb":Kn(y.gapSeconds);u+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${k.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${y.rank}</span>
            ${Er(y.previousRank,y.rankDelta)}
            <span class="fi fi-${x} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${S(k.firstName)} <strong>${S(k.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(D)}</span>
            <span class="instant-sim-gc-info">${E}</span>
          </div>
        </div>
      </div>
    `}u+="</div>",a.innerHTML=u;const f=e.pointsStandings.slice(0,10);let g=`
    <h3>
      <span>Punktewertung</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const y of f){if(y.riderId==null)continue;const k=e.riders.find(M=>M.id===y.riderId);if(!k)continue;const T=_t(k.id)??"un",x=ze[T]??"un",$=e.teams.find(M=>M.id===k.activeTeamId),D=($==null?void 0:$.abbreviation)??"—",E=`${y.points??0} Punkte`;g+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${k.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${y.rank}</span>
            ${Er(y.previousRank,y.rankDelta)}
            <span class="fi fi-${x} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${S(k.firstName)} <strong>${S(k.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(D)}</span>
            <span class="instant-sim-gc-info">${E}</span>
          </div>
        </div>
      </div>
    `}g+="</div>",r.innerHTML=g}function Fe(e="Lade…"){var r;const t=vt?" (Leertaste zum Stoppen)":"",a=v("default-loader");a&&(v("loading-msg").textContent=e+t,v("loading-progress").classList.add("hidden"),a.classList.remove("hidden"),(r=v("instant-sim-panel"))==null||r.classList.add("hidden")),v("loading-overlay").classList.remove("hidden")}function ke(){v("loading-overlay").classList.add("hidden")}function yo(e){var t,a;if((t=v("default-loader"))==null||t.classList.add("hidden"),(a=v("instant-sim-panel"))==null||a.classList.remove("hidden"),v("loading-overlay").classList.remove("hidden"),d.realtimeBootstrap)bo();else{const r=v("instant-sim-favorites"),s=v("instant-sim-gc");r&&(r.innerHTML=""),s&&(s.innerHTML="")}Xs(e)}function Xs(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),r=`Instant-Simulation läuft … ${t}%${vt?" (Leertaste zum Stoppen)":""}`,s=v("loading-msg");s&&(s.textContent=r);const n=v("loading-progress-bar");n&&(n.style.width=`${t}%`);const i=v("instant-loading-msg");i&&(i.textContent=r);const o=v("instant-loading-progress-bar");o&&(o.style.width=`${t}%`);const c=v("instant-sim-favorites");c&&c.innerHTML.trim()===""&&d.realtimeBootstrap&&bo()}function At(e,t){const a=v(e);a.textContent=t,a.classList.remove("hidden")}function ha(e){v(e).classList.add("hidden")}function zt(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),v(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),v("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of ho)try{a(e)}catch(r){console.error(`Fehler bei View-Aktivierung von "${e}":`,r)}}function xe(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function oa(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";case"Flat":return"Flachlandspezialist";default:return e}}function Qs(e,t,a){return Math.max(t,Math.min(a,e))}function Sr(e,t,a){return Math.round(e+(t-e)*a)}function Fs(e,t,a){return`rgb(${Sr(e[0],t[0],a)} ${Sr(e[1],t[1],a)} ${Sr(e[2],t[2],a)})`}function Qr(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=Qs(e,t[0].value,t[t.length-1].value);for(let r=1;r<t.length;r+=1){const s=t[r-1],n=t[r];if(a<=n.value){const i=(a-s.value)/(n.value-s.value);return Fs(s.color,n.color,i)}}return Fs(t[t.length-1].color,t[t.length-1].color,1)}function en(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${Qr(e)}"${a}>${e.toFixed(2)}</span>`}function vo(e,t,a){if(t==null)return en(e,a);const r=Math.round((e-t)*100)/100,s=r>0?"skill-delta-positive":r<0?"skill-delta-negative":"skill-delta-neutral",n=r>0?"+":"",i=`<span class="skill-delta ${s}">${n}${r.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${Qr(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function So(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function Es(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",r=t>0?"+":"";return`<span class="${a}">${r}${t.toFixed(1).replace(".",",")}</span>`}function Ps(e,t="none",a){const r=e??0,s=["race-sim-form-negative"];t==="warning"&&s.push("load-warning"),t==="critical"&&s.push("load-warning-critical");const n=a?` title="${S(a)}"`:"";return r===0?`<span class="${s.join(" ")}"${n}>0,0</span>`:`<span class="${s.join(" ")}"${n}>-${r.toFixed(1).replace(".",",")}</span>`}function tn(e){const t=e.seasonFormPhase??"neutral";return an(t)}function an(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${S(a.label)}">${a.symbol}</span>`}function ko(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${S(e.seasonProgram.name)}</button>`:"–"}function Bt(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Ge(e){return`${e.lastName} ${e.firstName}`}function $o(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,r=e.unavailableUntil?` bis ${de(e.unavailableUntil)}`:"",s=`${t}: noch ${a} Tag${a===1?"":"e"}${r}`;return`<span class="rider-availability-marker" title="${S(s)}" aria-label="${S(s)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function Rt(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function Lr(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=e,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(r)}const hd=Object.freeze(Object.defineProperty({__proto__:null,$:v,FLAG_CODE_BY_CODE3:ze,GC_RESULT_TYPE_ID:Ca,MOUNTAIN_RESULT_TYPE_ID:Zs,POINTS_RESULT_TYPE_ID:Cr,activateView:zt,addActiveViewListener:fd,get autoProgressActive(){return vt},buildRaceCategoryBadgeCssVariables:Wa,clamp:Qs,downloadTextFile:Lr,esc:S,findRaceById:Ht,findRiderById:Me,findStageById:Aa,formatDate:de,formatElevationGain:Nr,formatGradient:gd,formatKm:Pr,formatMarkerLabel:go,formatNonFinisherReason:Fr,formatRaceGap:vr,formatRaceTime:_a,formatRiderName:Ge,getRiderCountryCode:Bt,getRiderRoleName:Rt,getRiderSpecializationLabel:oa,getRidersByTeam:qs,getSkillColor:Qr,hideError:ha,hideLoading:ke,hideModal:tt,get instantStageInFlightId(){return Us},interpolateChannel:Sr,interpolateColor:Fs,isActiveView:xe,get raceSimView(){return ia},get realtimeCompletionInFlight(){return qr},get realtimeStageLoadInFlightId(){return Ir},renderCountry:fo,renderFlag:ce,renderLoadMalusValue:Ps,renderMiniJersey:Mt,renderNonFinisherStatusBadge:po,renderRaceFormBonusValue:So,renderRankDelta:Er,renderResultsFlagColumn:mt,renderResultsJerseyColumn:aa,renderResultsParticipant:ra,renderRiderAvailabilityMarker:$o,renderRiderNameLink:De,renderRiderProgramButton:ko,renderSeasonFormPhase:tn,renderSeasonFormPhaseIndicator:an,renderSeasonFormValue:Es,renderSkillValue:en,renderSkillValueWithDelta:vo,renderTeamNameLink:rt,resolveRaceCategoryBadgeStyle:lt,resolveRiderCountryCode:_t,resolveTeamJerseyAssetPath:Js,setAutoProgressActive:Ys,setInstantStageInFlightId:Is,setRaceSimView:mo,setRealtimeCompletionInFlight:Rs,setRealtimeStageLoadInFlightId:Cs,showError:At,showInstantProgress:yo,showLoading:Fe,showModal:gt,showScreen:Xr,state:d,updateInstantProgress:Xs},Symbol.toStringTag,{value:"Module"}));async function te(e,t,a){try{const r=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(r.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await r.text();return{success:!1,error:r.ok?"Antwort war kein JSON.":`HTTP ${r.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return r.json()}catch(r){return{success:!1,error:`Netzwerkfehler: ${r.message}`}}}const Z={listSaves:()=>te("GET","/api/saves"),createSave:(e,t,a)=>te("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>te("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>te("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>te("GET","/api/teams/available"),getTeams:()=>te("GET","/api/teams"),getTeam:e=>te("GET",`/api/teams/${e}`),getTeamStats:e=>te("GET",`/api/teams/${e}/stats`),getRiders:(e,t=!1,a=!0,r)=>{const s=new URLSearchParams;e!=null&&s.set("teamId",String(e)),t&&s.set("onlyWithTeam","true"),r!=null&&s.set("season",String(r)),a&&s.set("summary","true");const n=s.toString();return te("GET",`/api/riders${n?`?${n}`:""}`)},getRiderStats:(e,t=!1)=>te("GET",`/api/riders/${e}/stats${t?"?excludeFatigue=true":""}`),getRiderProgramRaces:e=>te("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>te("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>te("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>te("POST","/api/rider-team-editor/export",e),getRaces:()=>te("GET","/api/races"),getRaceProgramParticipants:e=>te("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>te("GET",`/api/races/${e}/results-roster`),getGameState:()=>te("GET","/api/state"),getGameStatus:()=>te("GET","/api/game/status"),getStageSummary:e=>te("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>te("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>te("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>te("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>te("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>te("POST","/api/state/advance"),getStageResults:e=>te("GET",`/api/results/${e}`),getSeasonStandings:e=>te("GET",`/api/season-standings${e?`?season=${e}`:""}`),listStageEditorStages:()=>te("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>te("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>te("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>te("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>te("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>te("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>te("POST","/api/stage-editor/import",e),exportStageRoute:e=>te("POST","/api/stage-editor/export",e),getInjuries:()=>te("GET","/api/injuries"),getDraftHistory:e=>te("GET",`/api/draft/${e}`),getDraftDetails:e=>te("GET",`/api/draft/${e}/details`),getLeaderboards:(e,t,a)=>te("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`),getRaceProgramsEditor:()=>te("GET","/api/race-programs-editor"),saveRaceProgramsEditor:e=>te("POST","/api/race-programs-editor/save",e)};async function Va(){const e=await Z.listSaves(),t=v("saves-list"),a=v("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(r=>`
    <div class="save-card">
      <h3>${S(r.careerName)}</h3>
      <p class="save-meta">
        ${S(r.teamName)} · Saison ${r.currentSeason}
        ${r.lastSaved?"· "+de(r.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${S(r.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${S(r.filename)}" data-career-name="${S(r.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function bd(e){Fe("Karriere wird geladen…");const t=await Z.loadSave(e);if(ke(),!t.success){alert("Fehler beim Laden: "+t.error);return}d.currentSave=t.data??null,await dd()}async function yd(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;Fe("Löschen…");const a=await Z.deleteSave(e);if(ke(),!a.success){alert("Fehler: "+a.error);return}await Va()}async function vd(){const e=await Z.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){v("btn-delete-all-careers").classList.add("hidden"),v("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){Fe("Alle Karrieren werden gelöscht…");try{for(const a of t){const r=await Z.deleteSave(a.filename);if(!r.success){alert(`Fehler beim Löschen von "${a.careerName}": ${r.error??"Unbekannter Fehler"}`);break}}}finally{ke()}await Va()}}function Sd(){v("btn-new-career").addEventListener("click",async()=>{var s;ha("new-career-error"),v("input-career-name").value="";const a=v("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',gt("newCareer");const r=await Z.getAvailableTeams();if(!r.success||!((s=r.data)!=null&&s.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=r.data.map(n=>`<option value="${n.id}">${S(n.name)} (${S(n.division??n.divisionName??"")})</option>`).join("")}),v("btn-cancel-new").addEventListener("click",()=>tt("newCareer")),v("btn-confirm-new").addEventListener("click",async()=>{const a=v("input-career-name").value.trim(),r=v("input-team-id").value;if(!a||!r){At("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const s=Number(r),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;ha("new-career-error"),Fe("Neue Karriere wird erstellt…");const o=await Z.createSave(i,a,s);if(!o.success){ke(),At("new-career-error",o.error??"Unbekannter Fehler.");return}const c=await Z.loadSave(i);if(ke(),tt("newCareer"),!c.success){alert("Fehler: "+c.error);return}d.currentSave=c.data??null,await dd()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>Va());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{vd()}),v("saves-list").addEventListener("click",async a=>{const r=a.target.closest("button[data-save-action]");if(!r)return;const{saveAction:s,filename:n,careerName:i}=r.dataset;if(n){if(s==="load"){await bd(n);return}s==="delete"&&await yd(n,i??n)}})}const kd="modulepreload",$d=function(e){return"/"+e},On={},kr=function(t,a,r){let s=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));s=Promise.allSettled(a.map(c=>{if(c=$d(c),c in On)return;On[c]=!0;const l=c.endsWith(".css"),m=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":kd,l||(p.as="script"),p.crossOrigin="",p.href=c,o&&p.setAttribute("nonce",o),document.head.appendChild(p),l)return new Promise((u,f)=>{p.addEventListener("load",u),p.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return s.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},xd={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function Td(e){const t=xd[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const wd=200;function rn(e){if(e.length===0)return[];const t=[];for(const a of e){const r=t[t.length-1];if(!r||Math.abs(r.distanceMeter-a.distanceMeter)>=wd){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}r.riderIds.push(...a.riderIds),r.riderCount+=a.riderCount,r.distanceSum+=a.distanceMeter*a.riderCount,r.distanceMeter=r.distanceSum/r.riderCount}return t.map(({distanceSum:a,...r})=>r)}function sn(e){if(e.length===0)return[];let t=0;for(let s=1;s<e.length;s+=1)e[s].riderCount>e[t].riderCount&&(t=s);let a=0,r=0;return e.map((s,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(r+=1,o=`A${r}`),{...s,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-s.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,s.distanceMeter-e[n+1].distanceMeter):null}})}function Md(e,t=null){var a,r,s;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((r=e.find(n=>n.label==="P"))==null?void 0:r.label)??((s=e[0])==null?void 0:s.label)??null}function Gt(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function jn(e,t,a,r){return`${r.type}:${e}:${t}:${a}`}function Rd(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:Gt(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function yt(e){const t=[];e.segments.forEach((s,n)=>{const i=n*2;(s.start_markers??[]).forEach((o,c)=>{t.push({key:jn(n,"start",c,o),label:"",marker:o,kmMark:s.start_km,elevation:s.start_elevation,boundary:"start",sequence:i+c/100})}),(s.end_markers??[]).forEach((o,c)=>{t.push({key:jn(n,"end",c,o),label:"",marker:o,kmMark:s.end_km,elevation:s.end_elevation,boundary:"end",sequence:i+1+c/100})})});const a=t.sort((s,n)=>s.kmMark-n.kmMark||s.sequence-n.sequence),r=new Map;return a.map(s=>{const n=(r.get(s.marker.type)??0)+1;return r.set(s.marker.type,n),{...s,label:s.marker.name??Rd(s.marker,n)}})}function Id(e){const t=yt(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>Gt(a)).length}}function ba(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Cd(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function it(e,t,a,r){return t<=0?r:r+e/t*(a-r*2)}function Dr(e,t){const a=t/1e3,r=e.points;if(a<=r[0].kmMark)return r[0].elevation;for(let s=0;s<r.length-1;s+=1){const n=r[s],i=r[s+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),c=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*c}return r[r.length-1].elevation}function xo(e){const t=e.points.map(m=>m.elevation),a=Math.min(...t),r=Math.max(...t),s=Math.max(1,r-a),n=Math.max(40,s*.08),i=Math.max(0,a-n),o=r+n;let c=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=c&&(l=c+100),{axisMinElevation:c,axisMaxElevation:l}}function ft(e,t,a,r,s,n){const i=Math.max(1,a-t);return r-n-(e-t)/i*(r-s-n)}function Fa(e){return`${Math.round(e)} m`}function Wn(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function Vn(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function To(e,t,a,r,s,n,i,o,c){var g;const l=[],m=[];let p=null,u="#b91c1c";for(const h of yt(e)){const{marker:b,kmMark:y,elevation:k}=h;if(b.type==="climb_start"){m.push({kmMark:y,elevation:k,name:b.name});continue}if(Gt(b)){let T=-1;for(let E=m.length-1;E>=0;E-=1)if(b.name&&((g=m[E])==null?void 0:g.name)===b.name){T=E;break}const x=T>=0?m.splice(T,1)[0]:m.pop();x&&Math.max(0,y-x.kmMark),x&&Math.max(0,k-x.elevation);const $=Vn(b.cat,b.type),D=Wn(b.cat);if(b.type==="finish_hill"||b.type==="finish_mountain"){p=b.cat??null,u=$.accentColor;continue}l.push({x:it(y*1e3,t,a,r),anchorY:ft(k,o,c,s,n,i),primaryLabel:D??"Berg",secondaryLabel:Fa(k),distanceLabel:`${y.toFixed(1).replace(".",",")} km`,accentColor:$.accentColor});continue}if(b.type==="sprint_intermediate"){const T=Vn(b.cat,b.type);l.push({x:it(y*1e3,t,a,r),anchorY:ft(k,o,c,s,n,i),primaryLabel:"Sprint",secondaryLabel:Fa(k),distanceLabel:`${y.toFixed(1).replace(".",",")} km`,accentColor:T.accentColor})}}const f=e.points[e.points.length-1];return l.push({x:it(f.kmMark*1e3,t,a,r),anchorY:ft(f.elevation,o,c,s,n,i),primaryLabel:p?`${Wn(p)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:Fa(f.elevation),distanceLabel:`${f.kmMark.toFixed(1).replace(".",",")} km`,accentColor:u}),l.sort((h,b)=>h.x-b.x)}function wo(e,t,a){const r=t+4,s=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${ba(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-detail">${ba(e.distanceLabel)}</text>
    </g>`}function Mo(e,t){const a=new Set,r=t/1e3;for(let s=0;s<=r;s+=25)a.add(Math.round(s*1e3));return a.add(Math.round(t)),[...a].filter(s=>s>=0&&s<=t).sort((s,n)=>s-n)}function Ro(e,t,a,r,s,n){const i=new Set(yt(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const c=it(o,a,r,s),m=i.has(o)?18:12,p=n+m+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${c.toFixed(1)}" y1="${n.toFixed(1)}" x2="${c.toFixed(1)}" y2="${(n+m).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${c.toFixed(1)}" y="${p.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${ba(Cd(o))}</text>
      </g>`}).join("")}function Fd(e,t,a,r,s,n,i,o,c,l,m){const p=it(e.distanceMeter,a,r,n),u=Dr(t,e.distanceMeter),f=ft(u,c,l,s,i,o),g=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),h=e.riderCount>1?`<text x="${p.toFixed(1)}" y="${(f+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${p.toFixed(1)}" cy="${f.toFixed(1)}" r="${g.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${m?" race-sim-cluster-dot-selected":""}"></circle>
      ${h}
    </g>`}function Ed(e,t,a,r,s,n,i,o,c,l,m){const p=new Map(m.riders.map(f=>[f.id,f])),u=new Map((m.teams??[]).map(f=>[f.id,f.abbreviation]));return e.filter(f=>f.riderCount===1).map(f=>{const g=f.riderIds[0];if(g==null)return"";const h=p.get(g);if(!h)return"";const b=it(f.distanceMeter,a,r,n),y=Dr(t,f.distanceMeter),k=ft(y,c,l,s,i,o),T=h.activeTeamId!=null?u.get(h.activeTeamId)??"":"",x=`${h.lastName} (${T})`,$=k-34,D=k-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${b.toFixed(1)}" y1="${(k-5).toFixed(1)}" x2="${b.toFixed(1)}" y2="${$.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${b.toFixed(1)}" y="${D.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${ba(x)}</text>
        </g>`}).join("")}function Pd(e,t,a,r,s,n,i,o,c,l,m){const p=Math.max(0,Math.min(l,e.distanceKm)),u=Math.max(0,Math.min(m,e.distanceKm));if(u<=p)return null;const f=[{kmMark:p,elevation:Dr(e,p*1e3)},...e.points.filter(k=>k.kmMark>p&&k.kmMark<u),{kmMark:u,elevation:Dr(e,u*1e3)}];if(f.length<2)return null;const g=s-i,h=f.map((k,T)=>{const x=it(k.kmMark*1e3,t,a,r),$=ft(k.elevation,o,c,s,n,i);return`${T===0?"M":"L"} ${x.toFixed(1)} ${$.toFixed(1)}`}).join(" "),b=it(p*1e3,t,a,r),y=it(u*1e3,t,a,r);return`${h} L ${y.toFixed(1)} ${g.toFixed(1)} L ${b.toFixed(1)} ${g.toFixed(1)} Z`}function Nd(e,t,a,r,s={}){const m=e.distanceKm*1e3,{axisMinElevation:p,axisMaxElevation:u}=xo(e),f=533,g=12,b=e.points.map(E=>{const M=it(E.kmMark*1e3,m,1584,28),R=ft(E.elevation,p,u,634,168,101);return{x:M,y:R}}).map((E,M)=>`${M===0?"M":"L"} ${E.x.toFixed(1)} ${E.y.toFixed(1)}`).join(" "),y=`${b} L ${1556 .toFixed(1)} ${f.toFixed(1)} L ${28 .toFixed(1)} ${f.toFixed(1)} Z`,k=s.selectedClimbRange!=null?Pd(e,m,1584,28,634,168,101,p,u,s.selectedClimbRange.startKm,s.selectedClimbRange.endKm):null,T=To(e,m,1584,28,634,168,101,p,u).map(E=>wo(E,g,f)).join(""),$=Array.from({length:5},(E,M)=>p+(u-p)/4*M).map(E=>{const M=ft(E,p,u,634,168,101);return`
      <line x1="28" y1="${M.toFixed(1)}" x2="1556" y2="${M.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${M.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${M.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(M+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Fa(E)}</text>`}).join(""),D=Ro(Mo(e,m),e,m,1584,28,f);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${ba(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      ${k?`<path d="${k}" class="dashboard-stage-profile-climb-highlight"></path>`:""}
      <path d="${b}" class="race-sim-profile-line"></path>
      ${T}
      ${D}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function Ld(e,t,a,r,s){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${Nd(t,a,r,!1,s)}</div>`}function Dd(e,t,a,r,s,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,c=634,l=28,m=168,p=101,{axisMinElevation:u,axisMaxElevation:f}=xo(t),g=c-p,h=12,b=Array.from({length:5},(H,z)=>u+(f-u)/4*z),y=rn(a.clusters),k=sn(y),T=Mo(t,a.stageDistanceMeters),$=t.points.map(H=>{const z=it(H.kmMark*1e3,a.stageDistanceMeters,o,l),I=ft(H.elevation,u,f,c,m,p);return{x:z,y:I}}).map((H,z)=>`${z===0?"M":"L"} ${H.x.toFixed(1)} ${H.y.toFixed(1)}`).join(" "),D=`${$} L ${(o-l).toFixed(1)} ${g.toFixed(1)} L ${l.toFixed(1)} ${g.toFixed(1)} Z`,E=To(t,a.stageDistanceMeters,o,l,c,m,p,u,f).map(H=>wo(H,h,g)).join(""),M=b.map(H=>{const z=ft(H,u,f,c,m,p);return`
      <line x1="${l}" y1="${z.toFixed(1)}" x2="${o-l}" y2="${z.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${z.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${z.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(z+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Fa(H)}</text>`}).join(""),R=Ro(T,t,a.stageDistanceMeters,o,l,g),_=new Map(y.map((H,z)=>[H,k[z]??null])),F=y.map(H=>{var z;return Fd(H,t,a.stageDistanceMeters,o,c,l,m,p,u,f,((z=_.get(H))==null?void 0:z.label)===i)}).join(""),N=s.stage.profile==="ITT"?Ed(y,t,a.stageDistanceMeters,o,c,l,m,p,u,f,s):"";e.innerHTML=`
    <div class="race-sim-profile-layout${s.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${c}" role="img" aria-label="${ba(r)}">
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
          ${M}
          <line x1="${l}" y1="${g}" x2="${o-l}" y2="${g}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${m}" x2="${l}" y2="${g}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${D}" fill="url(#race-sim-area)"></path>
            <path d="${$}" class="race-sim-profile-line"></path>
            ${E}
            ${F}
          </g>
          ${N}
          ${R}
          <text x="${l.toFixed(1)}" y="${(m-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const _d={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},Un={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function Ns(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function es(e,t){return`${e}:${t}`}function Ad(e){return new Map(e.map(t=>[es(t.simulationMode,t.terrain),t.weights]))}function Bd(e){return new Map(e.map(t=>[es(t.simulationMode,t.terrain),t]))}function Hd(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function Io(e,t,a){const r=a.get(es(e,t));if(!r)return[{key:Ns(t),weight:1}];const s=Object.entries(r).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return s.length>0?s:[{key:Ns(t),weight:1}]}function zd(e,t,a,r){const s=Io(t,a,r),n=s.reduce((o,c)=>o+c.weight,0);return n<=0?e[Ns(a)]:s.reduce((o,c)=>o+e[c.key]*c.weight,0)/n}function Gd(e,t){const a=t.find(r=>r.simulationMode==="ttt"&&r.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??_d[e]??1.05}function Kd(e,t,a){const r=a==null?void 0:a.get(es(e,t));return{lateMultiplier:(r==null?void 0:r.finalSpreadLateMultiplier)??Un[t].lateMultiplier,peakMultiplier:(r==null?void 0:r.finalSpreadPeakMultiplier)??Un[t].peakMultiplier}}const Yn={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}};function Od(e,t){const a=Yn[e]||Yn[1];return a.pref.includes(t)?"pref":a.malus.includes(t)?"malus":"neutral"}const jd=.005,Wd=.005,Co=70,Fo=1e3,Eo=15,Po=360,No=8,Lo=-.75,Do=10;function Vt(e,t){return e+Math.random()*(t-e)}function _o(e,t,a){return Math.max(t,Math.min(a,e))}function Vd(e){return e==="ITT"||e==="TTT"}function Ao(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(r=>{var s,n,i;return r.id!==e.id&&r.activeTeamId===e.activeTeamId&&(((s=r.role)==null?void 0:s.name)==="Edelhelfer"||((n=r.role)==null?void 0:n.name)==="Starke Helfer"||((i=r.role)==null?void 0:i.name)==="Wassertraeger")}).map(r=>r.id)}function Bo(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function Ud(e,t,a,r){const s=r==="crash"?Bo():null,n=Number(Vt(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=_o(n/Math.max(.1,a)*100,0,100),c=o<=Co;return{riderId:e.id,type:r,severity:s,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(r==="crash"?Vt(10,60):Vt(10,45)),recoverySeconds:c?Fo:Po,recoveryFormBonus:c?Eo:No,dayFormPenalty:Lo,staminaPenalty:Do,recoveryPenaltyStages:r==="crash"?s==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:r==="crash"&&s==="medium"?15:0,supportRiderIds:Ao(e,t)}}function Yd(e,t,a){if(Vd(t.profile)||a<=0)return[];const r=[];for(const s of e){const n=Math.random(),i=Math.random(),o=jd*Math.max(0,t.crashIncidentMultiplier??1),c=Wd*Math.max(0,t.mechanicalIncidentMultiplier??1);let l=o+(t.rolledEffektSturz??0)/100,m=c+(t.rolledEffektDefekt??0)/100;const p=t.rolledWeatherId||1,u=s.weatherProfileId||1;Od(u,p)==="pref"&&(l*=.5,m*=.5);const g=n<l,h=i<m;if(!g&&!h)continue;const b=g&&h?n<=i?"crash":"mechanical":g?"crash":"mechanical",y=Ud(s,e,a,b);if(b==="crash"&&Math.random()<.01){y.isMassCrashTrigger=!0;const k=Math.floor(Vt(2,26)),x=[...e.filter($=>$.id!==s.id)].sort(()=>.5-Math.random());y.massCrashPotentialRiderIds=x.slice(0,k).map($=>$.id),Math.random()<.2&&(y.hasAdditionalMechanical=!0,y.waitDurationSeconds+=Math.round(Vt(10,45)))}r.push(y)}return r}function Zd(e,t,a,r){const s=Bo(),n=Math.round(a*1e3),i=_o(a/Math.max(.1,r)*100,0,100),o=i<=Co;let c=Math.round(Vt(10,60)),l=!1;return Math.random()<.2&&(l=!0,c+=Math.round(Vt(10,45))),{riderId:e.id,type:"crash",severity:s,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:c,recoverySeconds:o?Fo:Po,recoveryFormBonus:o?Eo:No,dayFormPenalty:Lo,staminaPenalty:Do,recoveryPenaltyStages:s==="light"?[10,5,2]:[],raceRecuperationPenalty:s==="medium"?15:0,supportRiderIds:Ao(e,t),hasAdditionalMechanical:l}}function Jd(e,t){return e+Math.random()*(t-e)}function Zn(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const r=Math.floor(Jd(0,a+1)),s=t[a];t[a]=t[r]??s,t[r]=s}return t}function qd(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function Xd(e,t,a={}){if(e.length===0)return[];const r=e.map(f=>({...f,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),s=a.teams??qd(r),n=Rr(r,s,t,a),i=new Set(n.slice(0,20).map(f=>f.rider.id)),o=Math.min(Math.ceil(r.length*.02),Math.max(0,r.length-i.size)),c=Math.min(Math.ceil(r.length*.01),r.length),l=Zn(r.filter(f=>!i.has(f.id))),m=new Set(l.slice(0,o).map(f=>f.id)),p=Zn(r.filter(f=>!m.has(f.id))),u=new Set(p.slice(0,c).map(f=>f.id));return r.map(f=>m.has(f.id)?{...f,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:u.has(f.id)?{...f,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:f)}function Ot(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}function Jn(e,t){return e+Math.random()*(t-e)}function Qd(e,t,a){const r=[...e],s=[];for(;s.length<t&&r.length>0;){const n=r.reduce((l,m)=>l+Math.max(1e-4,a(m)),0);let i=Math.random()*n,o=0;for(let l=0;l<r.length;l+=1)if(i-=Math.max(1e-4,a(r[l])),i<=0){o=l;break}const[c]=r.splice(o,1);c&&s.push(c)}return s}function ec(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function qn(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function tc(e,t,a){return new Set(e.map(r=>r.riderId).filter(r=>r!=null&&!t.has(r)).slice(0,a))}function ac(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function Et(e){var t;return ac((t=e.role)==null?void 0:t.name)}function rc(e){return yt(e).some(({marker:t})=>Gt(t))}function sc(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function nc(e,t){const a=sc(e),r=e.hasSuperform===!0?40:1,s=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&Et(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*r*s*n*i;return{attackFactor:a,superformFactor:r,gcLeaderTeamFactor:s,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function ic(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function oc(e,t){var r,s;const a=((r=t[0])==null?void 0:r.riderId)??null;return a==null?null:((s=e.find(n=>n.id===a))==null?void 0:s.activeTeamId)??null}function lc(e,t,a){const r=new Map(t.map(n=>[n.id,n])),s=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=r.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||s.has(i.activeTeamId))&&(s.add(i.activeTeamId),s.size>=a))break}return s}function dc(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),Et(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function cc(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const r=t.stageNumber<=10,s=Math.max(1,Math.floor(a*(r?.01:.05))),n=Math.max(s,Math.floor(a*(r?.08:.2)));return{min:s,max:n}}function uc(e,t){const a=t.profile==="Flat"||t.profile==="Rolling";return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?a?{min:.45,max:.65}:{min:.45,max:.75}:a?{min:.5,max:.75}:{min:.5,max:.85}}function mc(e,t,a,r,s,n,i,o){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||r.distanceKm<=0)return null;const c=e.length,{min:l,max:m}=cc(t,a,c),p=Ot(l,m),u=t.isStageRace&&a.stageNumber<=10,f=!t.isStageRace,g=oc(e,n),h=u?lc(s,e,5):new Set,b=u?dc(e):new Map,y=rc(r),k=ec(s,5),T=qn(n,10),x=new Set([...k,...T]),$=y?tc(i,x,5):new Set,D=ic(a),E=["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain"].includes(a.profile),M=t.isStageRace&&E&&a.stageNumber>=4;let R;const _=new Set;if(M){const A=qn(n,10),J=Rr(e,o??[],a,{distanceKm:r.distanceKm,elevationGainMeters:r.elevationGainMeters});let j=[];for(const w of J){if(j.length>=5)break;const C=w.rider;if(C.activeTeamId==null||!A.has(C.id))continue;const X=Et(C);(X==="kapitaen"||X==="co-kapitaen")&&(j.includes(C.activeTeamId)||j.push(C.activeTeamId))}if(j.length===0)for(const w of J){if(j.length>=5)break;const C=w.rider;if(C.activeTeamId==null||!A.has(C.id))continue;Et(C)==="edelhelfer"&&(j.includes(C.activeTeamId)||j.push(C.activeTeamId))}if(j.length>0&&Math.random()<.5){const w=Ot(0,j.length-1);R=j[w]}}if(R!=null){const A=e.filter(j=>j.activeTeamId===R),L=A.filter(j=>Et(j)==="kapitaen"),J=A.filter(j=>Et(j)==="co-kapitaen");if(L.length>0){if(L.forEach(j=>_.add(j.id)),L.length===1&&J.length>0){const j=[...J].sort((w,C)=>C.overallRating-w.overallRating||C.id-w.id);_.add(j[0].id)}}else if(J.length>0)[...J].sort((w,C)=>C.overallRating-w.overallRating||C.id-w.id).slice(0,2).forEach(w=>_.add(w.id));else{const j=A.filter(w=>Et(w)==="edelhelfer");if(j.length>0){const w=[...j].sort((C,X)=>X.overallRating-C.overallRating||X.id-C.id);_.add(w[0].id)}}}let F;if(R!=null){const L=e.filter(J=>J.activeTeamId===R).filter(J=>!_.has(J.id));L.length>0&&(F=[...L].sort((j,w)=>w.skills.attack-j.skills.attack||w.overallRating-j.overallRating||w.id-j.id)[0])}const N=e.filter(A=>{if(A.activeTeamId==null||k.has(A.id)||T.has(A.id)||R!=null&&A.activeTeamId===R&&(_.has(A.id)||F!=null&&A.id===F.id)||u&&g!=null&&A.activeTeamId===g||u&&h.has(A.activeTeamId))return!1;const L=Et(A);return!(f&&(L==="kapitaen"||L==="co-kapitaen")||u&&L==="kapitaen"||u&&L==="co-kapitaen"&&b.get(A.activeTeamId)!==!0||L==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(N.length===0)return null;const H=new Map(N.map(A=>[A.id,nc(A,{isEarlyStageRace:u,race:t,gcLeaderTeamId:g,stageHasMountainClassifications:y,topMountainIds:$,isHardStage:D})])),z=N.reduce((A,L)=>{var J;return A+(((J=H.get(L.id))==null?void 0:J.finalWeight)??0)},0),I=Qd(N,Math.max(0,Math.min(p-(F?1:0),N.length)),A=>{var L;return((L=H.get(A.id))==null?void 0:L.finalWeight)??1});if(F&&I.push(F),I.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${I.length}/${p} ausgewählt aus ${N.length}`),console.log(`Gesamtgewicht im Pool: ${z.toFixed(2)}`),console.table(I.map(A=>{var J;const L=H.get(A.id);return{Fahrer:`${A.firstName} ${A.lastName}`,Team:A.activeTeamId,Rolle:((J=A.role)==null?void 0:J.name)??null,Atk:A.skills.attack,Hill:A.skills.hill,Chance:`${((z>0&&L!=null?L.finalWeight/z:0)*100).toFixed(2)}%`,Gewicht:((L==null?void 0:L.finalWeight)??1).toFixed(2),Attacke:`x${((L==null?void 0:L.attackFactor)??1).toFixed(2)}`,Superform:`x${(L==null?void 0:L.superformFactor)??1}`,GC_Team:`x${((L==null?void 0:L.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(L==null?void 0:L.mountainFactor)??1}`,Sprinter:`x${(L==null?void 0:L.sprinterFactor)??1}`}})),console.groupEnd();const G=r.distanceKm*1e3,U=Ot(0,Math.min(1e4,Math.max(0,Math.floor(G*.1)))),K=uc(t,a),q=Math.round(G*Jn(K.min,K.max)),Q=Math.round(G*Jn(.1,.25)),se=Math.max(U+1e3,Math.min(q-1e3,q-Q)),V=a.rolledBreakawayBonus??0,P=a.profile==="Flat"||a.profile==="Rolling"?Ot(2,4):Ot(3+V,8+V);return{riderIds:I.map(A=>A.id),triggerDistanceMeters:U,groupPhaseEndDistanceMeters:se,phaseEndDistanceMeters:q,skillBonus:P,malusValue:a.profile==="Flat"||a.profile==="Rolling"?Ot(6,10):Ot(5,8),superTeamId:R}}const pc=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),gc=3,fc=7,Xn=120,Qn=200,ei=180,hc=10,tr=8e3;function Ut(e,t,a=Math.random()){const r=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(a*(s-r+1))+r}function bc(e){for(let t=e.length-1;t>0;t-=1){const a=Ut(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function _r(e,t){return t<=0||e.length===0?[]:bc([...e]).slice(0,Math.min(t,e.length))}function yc(e,t,a){if(t<=0||e.length===0)return[];const r=[...e],s=[];for(;r.length>0&&s.length<t;){const n=r.reduce((c,l)=>c+Math.max(0,a(l)),0);if(n<=0){s.push(..._r(r,t-s.length));break}let i=Math.random()*n,o=r.length-1;for(let c=0;c<r.length;c+=1)if(i-=Math.max(0,a(r[c])),i<=0){o=c;break}s.push(r[o]),r.splice(o,1)}return s}function vc(e){return pc.has(e.profile)}function Sc(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function kc(e,t){if(!vc(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(r=>{if(!Sc(r))return[];const s=r.start_km*1e3,n=r.end_km*1e3,i=Math.max(s,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:s,sourceSegmentEndMeters:n}]})}function ti(e,t){const a=t==null?e:e.filter(c=>{const l=Math.min(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t)),m=Math.max(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t));return l>=tr||m>=tr});if(a.length===0)return null;const r=a[Ut(0,a.length-1)];if(!r)return null;const s=Math.ceil(r.startMeters),n=Math.floor(r.endMeters);if(n<=s)return null;let i=0;for(;i<12;){const c=Ut(s,n);if(t==null||Math.abs(c-t)>=tr)return{triggerDistanceMeters:c,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<r.startMeters?n:s;return t==null||Math.abs(o-t)>=tr?{triggerDistanceMeters:o,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters}:null}function $c(e,t,a,r=()=>1){const s=e.slice(0,15),n=kc(t,a);if(s.length===0||n.length===0)return[];const i=Ut(gc,Math.min(fc,s.length)),o=yc(s,i,r),c=[];for(const u of o){const f=ti(n);f&&c.push({riderId:u.id,attackNumber:1,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:Ut(Xn,Qn),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}if(c.length===0)return[];const l=c.map(u=>u.riderId),m=Math.floor(l.length*.5),p=new Set(_r(l,m));for(const u of[...c]){if(!p.has(u.riderId))continue;const f=ti(n,u.triggerDistanceMeters);f&&c.push({riderId:u.riderId,attackNumber:2,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:Ut(Xn,Qn),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}return c.sort((u,f)=>u.triggerDistanceMeters-f.triggerDistanceMeters||u.riderId-f.riderId||u.attackNumber-f.attackNumber)}function xc(e,t,a){var c;if(e.length===0)return[];const r=((c=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:c.teamId)??null,s=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||r!=null&&l.teamId===r));if(s.length===0)return[];const n=new Map;for(const l of s){const m=n.get(l.teamId)??[];m.push(l),n.set(l.teamId,m)}const i=[...n.values()].map(l=>_r(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(Ut(0,3),i.length);return _r(i,o).map(l=>l.riderId)}function Tc(e,t){const a=[],r=[];for(const[s,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){r.push(s);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:r}}function ps(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}const wc={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},Mc={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},Rc={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},Ic={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},Cc={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function Fc(e){const t=new Map;for(const a of e){const r=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",r);else if(a.appliesTo==="climb_top"){const s=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${s}`,r)}else a.appliesTo==="finish"&&t.set(a.markerType,r)}return t}const ar=20,Ec=120,Pc=300,gs=.025,Nc=.1,Lc=.4,Dc=.6,_c=.8,Ea=1,ai=2/3,Ac=.1,rr=10,ri=50,Bc=25,Hc=7,zc=500,Gc=100,Kc=.02,Oc=.04,jc=.009,Wc=120,Vc=150,Uc=100,Yc=300,si=50,fs=85,jt=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],ni=5*60,Zc=60,Jc=.5,qc=.3,sr=5e3,Xc=2e3,Qc=1,eu=2,tu=.05,Ho={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},au={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},nr=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function Se(e,t,a){return Math.max(t,Math.min(a,e))}function me(e,t){return e+Math.random()*(t-e)}const ii={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}};function oi(e,t){const a=ii[e]||ii[1];return a.pref.includes(t)?"pref":a.malus.includes(t)?"malus":"neutral"}function li(e){return e[Math.floor(Math.random()*e.length)]}function la(e){return Math.round(e*100)/100}function ru(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function di(e){if(e<2)return 1;const t=Se(e,2,20),a=nr[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let r=1;r<nr.length;r+=1){const s=nr[r-1],n=nr[r];if(t>n.gradientPercent)continue;const i=(t-s.gradientPercent)/Math.max(1e-4,n.gradientPercent-s.gradientPercent),o=s.draftPenaltyShare+(n.draftPenaltyShare-s.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function su(e){return e==="Flat"?Wc:e==="Abfahrt"?Vc:Number.POSITIVE_INFINITY}function nu(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function Ar(e){return(e.formBonus??0)+(e.raceFormBonus??0)-((e.fatigueMalus??0)+(e.longTermFatigueMalus??0)+(e.shortTermFatigueMalus??0))*.5}function iu(e,t){if(t.length===0)return"";const a=t.reduce((m,p)=>m+p.weight,0),r=t.map(m=>{const p=e.skills[m.key],u=Math.round(m.weight/a*100);return`${Ho[m.key]} ${Math.round(p)} (${u}%)`}),s=e.formBonus??0,n=e.raceFormBonus??0,i=(e.fatigueMalus??0)*.5,o=(e.longTermFatigueMalus??0)*.5,c=(e.shortTermFatigueMalus??0)*.5;r.push(`S-Form ${s>=0?"+":""}${s.toFixed(1).replace(".",",")}`),r.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&r.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&r.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),c>0&&r.push(`Akut -${c.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const m of t)l+=(e.mentorBoosts[m.key]||0)*(m.weight/a);return l>0&&r.push(`Mentor +${l.toFixed(1).replace(".",",")}`),r.join(" • ")}function ou(){const e=Math.random();return e<.9?me(5,20):e<.98?me(20,40):me(40,70)}function ci(){const e=Math.random();return e<.9?la(me(-1,1)):e<.995?la(li([-1,1])*me(1,2)):la(li([-1,1])*me(3,4))}function lu(){return la(me(-3,3))}function du(e){const t=[];let a=0,r=ou(),s=me(-1,1);for(;a<e;){const n=Math.min(e-a,me(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:r,vector:s}),a+=n,a>=e)break;r=Se(r+(Math.random()<.5?-1:1)*me(2,10),5,70),s=Se(s+(Math.random()<.5?-1:1)*me(0,.5),-1,1)}return t}function zo(e,t){const a=ie(e),r=ie(t);if(a!==r)return a?1:-1;const s=Ee(e),n=Ee(t);return s&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:s?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function ie(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function Ee(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function Ta(e,t,a=!1,r=null){var c;const s="rider"in e?e.rider:null,n=(s==null?void 0:s.specialization1)??null,i=(s==null?void 0:s.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(c=s==null?void 0:s.role)==null?void 0:c.name;r==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function cu(e,t,a=null,r=null,s=!1){var f,g;const n=h=>h.photoFinishScore;if(!t){const h=[...e].sort((y,k)=>y.crossingTimeSeconds-k.crossingTimeSeconds||k.photoFinishScore-y.photoFinishScore||y.riderId-k.riderId),b=((f=h[0])==null?void 0:f.crossingTimeSeconds)??0;return h.map((y,k)=>({riderId:y.riderId,rank:k+1,crossingTimeSeconds:y.crossingTimeSeconds,gapSeconds:Math.max(0,y.crossingTimeSeconds-b),photoFinishScore:y.photoFinishScore}))}const i=[...e].sort((h,b)=>h.crossingTimeSeconds-b.crossingTimeSeconds||b.photoFinishScore-h.photoFinishScore||h.riderId-b.riderId),o=((g=i[0])==null?void 0:g.crossingTimeSeconds)??0,c=[];let l=[],m=0,p=null;const u=()=>{const h=Math.max(0,m-o),b=l.sort((y,k)=>n(k)-n(y)||y.riderId-k.riderId);for(const y of b)c.push({riderId:y.riderId,rank:c.length+1,crossingTimeSeconds:y.crossingTimeSeconds,gapSeconds:h,photoFinishScore:y.photoFinishScore})};for(const h of i){if(l.length===0){l=[h],m=h.crossingTimeSeconds,p=h.crossingTimeSeconds;continue}if(p!=null&&h.crossingTimeSeconds-p<=Ea){l.push(h),p=h.crossingTimeSeconds;continue}u(),l=[h],m=h.crossingTimeSeconds,p=h.crossingTimeSeconds}return l.length>0&&u(),c}function uu(e,t,a){const r=e.filter(Ee).sort((p,u)=>(p.finishTimeSeconds??0)-(u.finishTimeSeconds??0)||u.photoFinishScore-p.photoFinishScore||p.rider.id-u.rider.id),s=e.filter(p=>!ie(p)).sort(zo),n=e.filter(p=>p.finishStatus==="dnf").sort((p,u)=>u.distanceCoveredMeters-p.distanceCoveredMeters||p.rider.id-u.rider.id),i=[];let o=[],c=null;const l=p=>p.photoFinishScore,m=()=>{i.push(...o.sort((p,u)=>l(u)-l(p)||p.rider.id-u.rider.id))};for(const p of r){const u=p.finishTimeSeconds??0;if(o.length===0){o=[p],c=u;continue}if(c!=null&&u-c<=Ea){o.push(p),c=u;continue}m(),o=[p],c=u}return o.length>0&&m(),[...i,...s,...n]}function mu(e,t){const a=ie(e),r=ie(t);if(a!==r)return a?1:-1;const s=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(s)>=.1?s:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:Ee(e)&&Ee(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:Ee(e)?-1:Ee(t)?1:e.rider.id-t.rider.id}function ui(e){const t=Se(e,1,ri);return t<=2?.12*t:t<=rr?.24+(t-2)/Math.max(1,rr-2)*.58:.82+(t-rr)/Math.max(1,ri-rr)*.18}function hs(e,t){const a=Ar(e.rider);return Object.entries(t).reduce((r,[s,n])=>{if(!n)return r;const i=s==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[s]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return r+o*n},0)}function pu(e,t){const a=Ar(e.rider);return Object.entries(t).filter(r=>!!r[1]).map(([r,s])=>{const n=r,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:s,effectiveSkill:o,contribution:o*s}})}function gu(e,t,a){let r=t;for(;r>0;){const n=e[r-1].distanceCoveredMeters-e[r].distanceCoveredMeters;if(n<=0||n>=a)break;r-=1}let s=t;for(;s<e.length-1;){const n=e[s].distanceCoveredMeters-e[s+1].distanceCoveredMeters;if(n<=0||n>=a)break;s+=1}return{startIndex:r,endIndex:s,size:s-r+1,positionInGroup:t-r}}function fu(e,t){if(e<Bc)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class Go{constructor(t,a){var H,z;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.superTeamProtectedLeaderIds=new Set,this.superTeamBonusAmount=0,this.superTeamMalusAmount=0,this.superTeamStartPercent=0,this.superTeamEndPercent=0,this.superTeamBreakawayRiderCaught=!1,this.hasLoggedFinishSprintTieBreak=!1,this.hasAppliedSprintLeadoutBonuses=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const r=(H=t.race.country)==null?void 0:H.code3;r&&(t.riders=t.riders.map(I=>{var U;const G=I.nationality||((U=I.country)==null?void 0:U.code3);if(G&&G.trim().toUpperCase()===r.trim().toUpperCase()){const K={...I,skills:{...I.skills}},q=Math.random(),Q=t.stage.profile,se=Q==="ITT"||Q==="TTT",V=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(Q==="Cobble"||Q==="Cobble_Hill")&&V.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(Q)||V.push("mountain","mediumMountain");const J=[...(j=>{const w=[...V],C=[];if(se){C.push("timeTrial");const X=Math.min(j-1,w.length);for(let ne=0;ne<X;ne++){const ee=Math.floor(Math.random()*w.length);C.push(w.splice(ee,1)[0])}}else{const X=Math.min(j,w.length);for(let ne=0;ne<X;ne++){const ee=Math.floor(Math.random()*w.length);C.push(w.splice(ee,1)[0])}}return C})(5)].sort(()=>Math.random()-.5);if(K.homeEffectSkills=J,q<.05){K.homeEffect="home_pressure";for(const j of J)K.skills[j]=Math.max(0,K.skills[j]-.5)}else if(q<.1){K.homeEffect="super_home";const j=J[0];K.skills[j]=Math.min(100,K.skills[j]+3);for(let w=1;w<5;w++){const C=J[w];K.skills[C]=Math.min(100,K.skills[C]+1)}}else{K.homeEffect="normal_home";for(const j of J)K.skills[j]=Math.min(100,K.skills[j]+1)}return K}return I}));const s=t.stage.rolledWeatherId||1;t.riders=t.riders.map(I=>{const G=I.weatherProfileId||1,U=oi(G,s);if(U==="neutral")return I;const K={...I,skills:{...I.skills}},q=["flat","mountain","stamina","bikeHandling","recuperation","downhill"];if(U==="pref")for(const Q of q){const se=me(.2,1);K.skills[Q]=Math.min(100,K.skills[Q]+se)}else if(U==="malus"){let Q=0;if(t.lieutenants){const se=t.lieutenants.find(V=>V.leaderId===I.id);if(se&&t.riders.some(P=>P.id===se.lieutenantId)){const P=t.riders.find(J=>J.id===se.lieutenantId),A=(P==null?void 0:P.weatherProfileId)||1;oi(A,s)==="pref"&&(Q=me(.4,.75))}}for(const se of q){const V=me(.2,1)*(1-Q);K.skills[se]=Math.max(0,K.skills[se]-V)}}return K}),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=Hd(t.stage.profile),this.skillWeightRuleMap=Ad(t.skillWeightRules??[]),this.skillWeightConfigMap=Bd(t.skillWeightRules??[]),this.stageScoringWeightMap=Fc(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=du(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const n=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=n!=null?Se(n/100,0,1):me(Dc,_c);const i=t.stage.finalPushStartPercent;this.finalPushStartRatio=i!=null?Se(i/100,this.lateStageStartRatio,1):Se(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const o=Yd(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(o.map(I=>[I.riderId,I])),o.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",o.map(G=>({riderId:G.riderId,type:G.type,severity:G.severity,kmMark:G.triggerDistanceKm,waitDurationSeconds:G.waitDurationSeconds,supportRiderIds:G.supportRiderIds})));const I=o.filter(G=>G.isMassCrashTrigger);I.length>0&&I.forEach(G=>{var U;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${G.riderId} bei Km ${G.triggerDistanceKm}. Potenziell betroffene Fahrer (${(U=G.massCrashPotentialRiderIds)==null?void 0:U.length}):`,G.massCrashPotentialRiderIds)})}const c=t.riders.map(I=>{const G={rider:I,riderName:`${I.firstName} ${I.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:lu(),microForm:ci(),nextFormUpdateMeter:me(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(I.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(G),G}),l=new Map(c.map(I=>[I.rider.id,I.dailyForm]));this.stageFavorites=uo(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:l});const m=this.stageFavorites.filter(I=>I.kind==="rider"&&I.riderId!=null).slice(0,15).map(I=>t.riders.find(G=>G.id===I.riderId)??null).filter(I=>I!=null),p=((z=t.gcStandings.find(I=>I.rank===1))==null?void 0:z.riderId)??null,u=$c(m,t.stage,t.stageSummary,I=>Math.max(1,Math.pow(10,(I.skills.attack-65)/10))*(I.id===p?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const I of u){const G=this.precalculatedStageAttacksByRiderId.get(I.riderId)??[];G.push(I),this.precalculatedStageAttacksByRiderId.set(I.riderId,G)}this.breakawayPlan=mc(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings,t.teams);const f=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=f.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=f.fallbackCheckpointsMeters;for(const I of c)I.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const g=Xd(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:l}),h=new Map(g.map(I=>[I.id,I])),b=c.map(I=>{const G=h.get(I.rider.id)??I.rider;return{...I,rider:G,riderName:`${G.firstName} ${G.lastName}`,dailyForm:I.dailyForm+(G.specialFormDelta??0)}}),y=g.filter(I=>I.hasSuperform),k=g.filter(I=>I.hasSupermalus);(y.length>0||k.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:y.map(I=>`${I.firstName} ${I.lastName}`),supermalus:k.map(I=>`${I.firstName} ${I.lastName}`)});const T=this.resolveStartOrder(b),x=new Map((this.bootstrap.teamStartOrder??[]).map((I,G)=>[I,G]));if(this.riders=T.map((I,G)=>({...I,startOffsetSeconds:this.resolveStartOffsetSeconds(I,G,x)})),this.riders.forEach(I=>this.syncRiderTelemetry(I)),this.breakawayPlan&&this.breakawayPlan.superTeamId!=null){this.superTeamId=this.breakawayPlan.superTeamId,this.superTeamBonusAmount=ps(2,6),this.superTeamMalusAmount=ps(4,8),this.superTeamStartPercent=me(.4,.6),this.superTeamEndPercent=me(.86,.96);const I=V=>(V??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),G=t.riders.filter(V=>V.activeTeamId===this.superTeamId),U=G.filter(V=>{var P;return I((P=V.role)==null?void 0:P.name)==="kapitaen"}),K=G.filter(V=>{var P;return I((P=V.role)==null?void 0:P.name)==="co-kapitaen"});if(U.length>0){if(U.forEach(V=>this.superTeamProtectedLeaderIds.add(V.id)),U.length===1&&K.length>0){const V=[...K].sort((P,A)=>A.overallRating-P.overallRating||A.id-P.id);this.superTeamProtectedLeaderIds.add(V[0].id)}}else if(K.length>0)[...K].sort((P,A)=>A.overallRating-P.overallRating||A.id-P.id).slice(0,2).forEach(P=>this.superTeamProtectedLeaderIds.add(P.id));else{const V=G.filter(P=>{var A;return I((A=P.role)==null?void 0:A.name)==="edelhelfer"});if(V.length>0){const P=[...V].sort((A,L)=>L.overallRating-A.overallRating||L.id-A.id);this.superTeamProtectedLeaderIds.add(P[0].id)}}const q=t.teams.find(V=>V.id===this.superTeamId),Q=q?q.name:`Team ${this.superTeamId}`;this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,riderTeamId:this.superTeamId,type:"superteam",tone:"neutral",title:`Superteam des Tages: ${Q}`,detail:`Dieses Team hat sich heute zusammengeschlossen, um seinen Leader zu unterstützen! Die Helfer erhalten zwischen ${(this.superTeamStartPercent*100).toFixed(0)}% und ${(this.superTeamEndPercent*100).toFixed(0)}% der Etappe einen Bonus von +${this.superTeamBonusAmount} auf Berg, Hill, Medium Mountain und Flat. Danach folgt ein individueller Malus von -4 bis -8 wegen Erschöpfung.`});const se=this.riders.find(V=>{var P;return V.rider.activeTeamId===this.superTeamId&&((P=this.breakawayPlan)==null?void 0:P.riderIds.includes(V.rider.id))});se&&(this.superTeamBreakawayRiderId=se.rider.id)}for(const I of this.riders){const G=I.rider.homeEffectSkills,U=K=>au[K]||K;if(I.rider.homeEffect==="super_home"){const K=G&&G.length===5?`${U(G[0])} (+3), ${U(G[1])} (+1), ${U(G[2])} (+1), ${U(G[3])} (+1), ${U(G[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:I.rider.id,riderName:I.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(I.rider.id,I.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${K})`})}if(I.rider.homeEffect==="home_pressure"){const K=G?G.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:I.rider.id,riderName:I.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(I.rider.id,I.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${K})`})}if(I.rider.homeEffect==="normal_home"){const K=G?G.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:I.rider.id,riderName:I.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(I.rider.id,I.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${K})`})}I.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:I.rider.id,riderName:I.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(I.rider.id,I.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),I.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:I.rider.id,riderName:I.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(I.rider.id,I.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),I.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:I.rider.id,riderName:I.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(I.rider.id,I.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const $=this.bootstrap.stage.rolledWetterName??"Sonnig",D=this.bootstrap.stage.rolledEffektSturz??0,E=this.bootstrap.stage.rolledEffektDefekt??0,M=this.bootstrap.stage.rolledWindkantenGefahr??0,R=this.bootstrap.stage.rolledEffektFatigue??0,_=this.bootstrap.stage.rolledBreakawayBonus??0,F=[];D>0&&F.push(`Sturzwahrscheinlichkeit +${D.toFixed(1)}%`),E>0&&F.push(`Defektwahrscheinlichkeit +${E.toFixed(1)}%`),M>0&&F.push(`Windkanten-Gefahr +${(M*100).toFixed(1)}%`),R>0&&F.push(`Fatigue +${R.toFixed(1)}%`),_>0&&F.push(`Ausreißer-Bonus +${_.toFixed(1)}`);const N=F.length>0?`Wettereinflüsse: ${F.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${$}`,detail:N})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const r=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(r),a-=r}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(r=>({riderId:r.rider.id,riderName:r.riderName,startOffsetSeconds:r.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(r),hasStarted:r.hasStarted||ie(r),distanceCoveredMeters:r.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-r.distanceCoveredMeters),segmentStartKm:r.segmentStartKm,segmentEndKm:r.segmentEndKm,segmentStartElevation:r.segmentStartElevation,segmentEndElevation:r.segmentEndElevation,activeTerrain:Ee(r)?"Finish":r.activeTerrain,skillName:Ee(r)?"Finish":r.skillName,skillBreakdown:Ee(r)?"":r.skillBreakdown,baseSkill:r.baseSkill,teamGroupBonus:r.teamGroupBonus,effectiveSkill:r.effectiveSkill,staminaPenalty:r.staminaPenalty,elevationPenalty:r.elevationPenalty,dailyForm:r.dailyForm,microForm:r.microForm,gradientPercent:r.gradientPercent,gradientModifier:r.gradientModifier,windModifier:r.windModifier,draftModifier:r.draftModifier,draftNearbyRiderCount:r.draftNearbyRiderCount,draftPackFactor:r.draftPackFactor,currentSpeedMps:r.currentSpeedMps,photoFinishScore:r.photoFinishScore,leadoutBonus:r.leadoutBonus,leadoutRiderId:r.leadoutRiderId,leadoutContributions:r.leadoutContributions,lastSplitLabel:r.lastSplitLabel,lastSplitTimeSeconds:r.lastSplitTimeSeconds,splitTimes:{...r.splitTimes},finishTimeSeconds:Number.isFinite(r.finishTimeSeconds??Number.NaN)?r.finishTimeSeconds:null,finishStatus:r.finishStatus,statusReason:r.statusReason,isAttacking:r.isAttacking,isBreakaway:r.isBreakaway,isLeadingGroup:r.isLeadingGroup,hasSuperform:r.rider.hasSuperform===!0,hasSupermalus:r.rider.hasSupermalus===!0,isFinished:Ee(r)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(r=>r.appliedIncident?[r.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus},superTeamId:this.superTeamId}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let r=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(r=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(r==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,c)=>Math.max(o,c.distanceCoveredMeters),0);r=Number((i/1e3).toFixed(2))}const s={id:this.nextMessageId,...t,riderTeamId:a,kmMark:r};this.messages.unshift(s),this.allEvents.push(s),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(r=>[r.rider.id,r]));return this.intermediateMarkers.map(r=>{const s=t.map(i=>i.markerCrossings[r.key]??null).filter(i=>i!=null),n=cu(s,!this.isTimeTrialMode,r.markerType,a,this.isClimberMalusStage());return{markerKey:r.key,markerLabel:r.label,markerType:r.markerType,markerCategory:r.markerCategory,kmMark:r.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.isTimeTrialMode?[...this.riders].sort(zo):uu(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(s=>s.finishStatus!=="dnf").reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0);let r=0;for(const s of t)Ee(s)&&(r+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:r,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(ie)}advanceSubstep(t){const a=this.elapsedSeconds,r=a+t,s=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();if(this.updateBreakawayPhaseState(),this.superTeamId!=null&&this.superTeamBreakawayRiderId!=null&&!this.superTeamBreakawayRiderCaught){const l=this.riders.find(m=>m.rider.id===this.superTeamBreakawayRiderId);l&&!ie(l)&&this.riders.filter(u=>this.superTeamProtectedLeaderIds.has(u.rider.id)&&!ie(u)).some(u=>u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&u.distanceCoveredMeters>=l.distanceCoveredMeters)&&(this.superTeamBreakawayRiderCaught=!0,l.breakawayMalus=0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} von Leader eingeholt!`,detail:"Der Ausreißer wurde von seinem Kapitän eingeholt und unterstützt das Team ab jetzt mit frischen Kräften!"}))}if(this.superTeamBreakawayRiderCaught&&this.superTeamBreakawayRiderId!=null){const l=this.riders.find(m=>m.rider.id===this.superTeamBreakawayRiderId);l&&(l.breakawayMalus=0)}for(const l of this.riders){if(ie(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const m=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,p=Math.max(0,r-m);if(p<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-p),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const u=this.currentSegment(l),f=this.currentWindZone(l);if(!u||!f){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=m,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const h=Ta(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=h,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[];continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,s);const g=this.calculateBasePhysics(l,u,f);l.activeTerrain=u.terrain,l.skillName=g.skillName,l.skillBreakdown=g.skillBreakdown,l.baseSkill=g.baseSkill,l.teamGroupBonus=g.teamGroupBonus,l.effectiveSkill=g.effectiveSkill,l.staminaPenalty=g.staminaPenalty,l.elevationPenalty=g.elevationPenalty,l.gradientPercent=g.gradientPercent,l.gradientModifier=g.gradientModifier,l.windModifier=g.windModifier,l.tempSpeedMps=g.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=g.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*p}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,r);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const m of this.riders)l.push(m);l.sort(mu);for(let m=0;m<l.length;m+=1){const p=l[m];if(ie(p))continue;const u=this.isActiveBreakawayRider(p),f=p.tempSpeedMps/14,g=Math.max(5,50*f),h=this.currentSegment(p),b=Math.max(15,150*f),y=Math.max(g,Math.min(b,su(h==null?void 0:h.terrain))),k=gu(l,m,y),T=k.size,x=ui(T),$=fu(T,k.positionInGroup);let D=0,E=Number.POSITIVE_INFINITY,M=null;for(let P=m-1;P>=0;P-=1){const A=l[P],L=A.distanceCoveredMeters-p.distanceCoveredMeters;if(L>=y+Ac)break;!this.canReceiveDraftFromCandidate(p,A)||this.isActiveBreakawayRider(A)||L<=0||L>=y||(D+=1,L<=E&&(E=L,M=A))}if(D===0||!M){if(u)continue;p.draftModifier=1,p.draftNearbyRiderCount=0,p.draftPackFactor=0,p.currentSpeedMps=p.tempSpeedMps,p.nextDistanceCoveredMeters=p.distanceCoveredMeters+p.currentSpeedMps*t,p.isLeadingGroup=!0,this.applyCaptainWaitLogic(p);continue}const R=ie(M)?M.tempSpeedMps:M.currentSpeedMps,_=E,F=_<=g?1:1-(_-g)/Math.max(1e-4,y-g),N=this.currentWindZone(p),H=(N==null?void 0:N.vector)??0,z=(N==null?void 0:N.windSpeedKph)??0,I=-H*(z/70),U=Math.max(.3,.35+.35*I)*Math.min(1,f)*ai,K=Se((h==null?void 0:h.gradient_percent)??0,-20,20),q=di(K),se=1+($?0:U*F*x*q),V=p.tempSpeedMps*se;if(!(u&&se<=p.draftModifier)){if(p.draftModifier=se,p.draftNearbyRiderCount=T,p.draftPackFactor=x,p.isLeadingGroup=$,V>R){if(p.tempSpeedMps>M.tempSpeedMps){p.currentSpeedMps=V,p.nextDistanceCoveredMeters=p.distanceCoveredMeters+p.currentSpeedMps*t;continue}if(_<1){p.currentSpeedMps=R,p.nextDistanceCoveredMeters=M.distanceCoveredMeters+R*t,u||this.applyCaptainWaitLogic(p);continue}p.currentSpeedMps=Math.min(V,R+2),p.nextDistanceCoveredMeters=p.distanceCoveredMeters+p.currentSpeedMps*t,u||this.applyCaptainWaitLogic(p);continue}p.currentSpeedMps=V,p.nextDistanceCoveredMeters=p.distanceCoveredMeters+p.currentSpeedMps*t,u||this.applyCaptainWaitLogic(p)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(ie(l))continue;if(this.superTeamId!=null&&l.rider.activeTeamId===this.superTeamId&&!this.superTeamProtectedLeaderIds.has(l.rider.id)){const y=l.rider.id===this.superTeamBreakawayRiderId;if(!y||this.superTeamBreakawayRiderCaught){const k=l.distanceCoveredMeters/this.stageDistanceMeters;let T=0,x=!1,$=!1;y?k<this.superTeamEndPercent?x=!0:l.superTeamActiveLogged&&($=!0):k>=this.superTeamStartPercent&&k<this.superTeamEndPercent?x=!0:k>=this.superTeamEndPercent&&l.superTeamActiveLogged&&($=!0),x?(T=this.superTeamBonusAmount,l.superTeamActiveLogged||(l.superTeamActiveLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} leistet Führungsarbeit!`,detail:y?`Der eingeholte Ausreißer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`:`Der Edelhelfer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`}))):$&&(l.superTeamMalusAmount==null&&(l.superTeamMalusAmount=ps(4,8)),T=-l.superTeamMalusAmount,l.superTeamExhaustedLogged||(l.superTeamExhaustedLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"warning",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} ist erschöpft!`,detail:`Die Führungsarbeit hat ihren Tribut gefordert. Der Fahrer erhält für den Rest der Etappe einen Malus von -${l.superTeamMalusAmount} auf Berg-, Hügel- und Flachpassagen.`}))),l.originalSkills||(l.originalSkills={flat:l.rider.skills.flat,mountain:l.rider.skills.mountain,mediumMountain:l.rider.skills.mediumMountain,hill:l.rider.skills.hill}),l.rider.skills.flat=l.originalSkills.flat+T,l.rider.skills.mountain=l.originalSkills.mountain+T,l.rider.skills.mediumMountain=l.originalSkills.mediumMountain+T,l.rider.skills.hill=l.originalSkills.hill+T}}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds)continue;const m=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,p=Math.max(0,r-m);if(p<=0)continue;const u=l.distanceCoveredMeters,f=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*p,g=l.pendingIncident;if(g&&u<g.triggerDistanceMeters&&f>=g.triggerDistanceMeters){const y=Math.max(.1,l.currentSpeedMps),k=Math.max(0,(g.triggerDistanceMeters-u)/y);l.distanceCoveredMeters=g.triggerDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,m,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,m,l.currentSpeedMps),this.applyIncident(l,g,m+k),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const h=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,f-l.distanceCoveredMeters)>=h){const y=h/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,m,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,m,l.currentSpeedMps),l.finishTimeSeconds=m+y,l.currentSpeedMps=0;const k=Ta(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=k,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[]}else l.distanceCoveredMeters=f,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,m,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,m,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,u,l.distanceCoveredMeters,m),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-p),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!ie(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=ci(),l.nextFormUpdateMeter+=me(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),m=this.riders.filter(u=>l.has(u.rider.id)&&!ie(u)),p=this.riders.filter(u=>!l.has(u.rider.id)&&!ie(u));if(m.length>0&&p.length>0){const u=m.reduce((g,h)=>h.distanceCoveredMeters>g.distanceCoveredMeters?h:g,m[0]);p.reduce((g,h)=>h.distanceCoveredMeters>g.distanceCoveredMeters?h:g,p[0]).distanceCoveredMeters>=u.distanceCoveredMeters&&(u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:u.rider.id,riderName:u.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${u.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const c=Tc(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of c.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!ie(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const r=new Map;for(const s of this.riders){if(ie(s)||s.rider.activeTeamId==null||a<=s.startOffsetSeconds)continue;const n=r.get(s.rider.activeTeamId)??[];n.push(s),r.set(s.rider.activeTeamId,n)}for(const s of r.values()){const n=s[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,s.length),c=[...s].sort((u,f)=>f.effectiveSkill-u.effectiveSkill||u.rider.id-f.rider.id).slice(0,o).reduce((u,f)=>u+f.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-s.length),m=Math.max(1,c-l),p=this.resolveTimeTrialSpeedMps(m,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*Gd(i.terrain,this.bootstrap.skillWeightRules??[]);for(const u of s){const f=Math.max(t,u.startOffsetSeconds),g=Math.max(0,a-f);u.currentSpeedMps=p,u.tempSpeedMps=p,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+p*g}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const s=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?s.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,c=i.rider.activeTeamId!=null?s.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==c?o-c:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(s=>[s.riderId,s.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((s,n)=>{const i=a.get(s.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(s)-this.resolveProjectedIttStartScore(n)||s.rider.id-n.rider.id}):[...t].sort((s,n)=>s.rider.skills.timeTrial-n.rider.skills.timeTrial||s.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,r=0;for(const s of this.bootstrap.stageSummary.segments){const n=(s.start_km+s.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,s.terrain),c=i>0?this.resolveWeightedSkill(t.rider,s.terrain,i):o,l=Math.max(0,o.value-c.value),{effectiveSkill:m}=this.resolveEffectiveSkill({rider:t,baseSkill:c.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),p=Se(s.gradient_percent,-20,20),u=p>0?Math.exp(-.11*p):1-p*.06,f=this.windZones.find(h=>n>=h.startMeter&&n<=h.endMeter)??this.windZones[this.windZones.length-1],g=f?1+f.vector*(f.windSpeedKph/100)*.52:1;a+=m*u*g*s.length_km,r+=s.length_km}return r>0?a/r:0}resolveStartOffsetSeconds(t,a,r){if(this.isIndividualTimeTrial)return a*Ec;if(this.isTeamTimeTrial){const s=t.rider.activeTeamId;return(s!=null?r.get(s)??0:0)*Pc}return 0}buildIntermediateMarkers(){return yt(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||Gt(t)).map(({key:t,label:a,marker:r,kmMark:s})=>({key:t,distanceMeters:s*1e3,label:a,markerType:r.type,markerCategory:r.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(c=>c.distanceMeters<t.groupPhaseEndDistanceMeters),r=this.stageDistanceMeters*qc,s=a.some(c=>c.distanceMeters<=r);if(!(a.length<=1||!s))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(sr,Math.ceil(r/sr)*sr);for(let c=o;c<t.groupPhaseEndDistanceMeters;c+=sr)i.push(c);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,r){const s=nu(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,c=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),m=Math.min(85,o.value)+l,p=this.isTimeTrialMode?0:t.teamGroupBonus,u=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:f,staminaPenalty:g,elevationPenalty:h}=this.resolveEffectiveSkill({rider:t,baseSkill:m,staminaPenalty:c,teamGroupBonus:p,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:u}),b=Se(a.gradient_percent,-20,20),y=b>0?Math.exp(-.11*b):1-b*.06,k=1+r.vector*(r.windSpeedKph/100)*.52,T=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:s,skillBreakdown:o.breakdown,baseSkill:m,teamGroupBonus:p,effectiveSkill:f,staminaPenalty:g,elevationPenalty:h,gradientPercent:b,gradientModifier:y,windModifier:k,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(f,t.distanceCoveredMeters,a,y,k):this.resolveRoadStageSpeedMps(f,t.distanceCoveredMeters,a,y,k,T)}}resolveRoadStageSpeedMps(t,a,r,s,n,i){const o=this.resolveSkillSpreadFactor(a,r),c=this.resolveSegmentElevation(r,a),l=this.resolveElevationSkillSpreadFactor(r,c),u=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,u*s*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const r=Math.max(0,a-zc),s=Math.floor(r/Gc);return t.terrain==="Mountain"?1+(s*Oc+s*Math.max(0,s-1)*jc/2):1+s*Kc}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const r=a.filter(n=>n.activeTerrain===t.activeTerrain);return(r.length>0?r:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,r){if(r<=1)return{draftModifier:1,draftPackFactor:0};const s=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,c=-i*(o/70),m=Math.max(.3,.35+.35*c)*Math.min(1,s)*ai,p=Se(a.gradient_percent,-20,20),u=di(p),f=ui(r);return{draftModifier:1+m*f*u,draftPackFactor:f}}resolveBreakawayTimeGapPenalty(t){if(t<ni)return 0;const a=Math.floor((t-ni)/Zc);return Jc+a}recordBreakawayFallbackCheckpointCrossings(t,a,r,s,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>r)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const c=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?s+c-t.startOffsetSeconds:s+c);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let s=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((c,l)=>l.distanceCoveredMeters-c.distanceCoveredMeters||l.currentSpeedMps-c.currentSpeedMps||c.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,s;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const c=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!c)break;const l=n.markerCrossings[c.key]??null;if(!l)break;const m=t.map(p=>p.markerCrossings[c.key]??null).filter(p=>p!=null).sort((p,u)=>p.crossingTimeSeconds-u.crossingTimeSeconds||p.riderId-u.riderId)[0]??null;if(m){const p=l.crossingTimeSeconds-m.crossingTimeSeconds;s=this.resolveBreakawayTimeGapPenalty(p),this.breakawayGapStatus={gapSeconds:p,penalty:s,kmMark:c.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const c=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[c]??null;if(l==null)break;const m=t.map(p=>p.breakawayFallbackCheckpointTimes[c]??null).filter(p=>p!=null).sort((p,u)=>p-u)[0]??null;if(m!=null){const p=l-m;s=this.resolveBreakawayTimeGapPenalty(p),this.breakawayGapStatus={gapSeconds:p,penalty:s,kmMark:c<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[c]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return s}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),r=this.riders.filter(o=>!ie(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),s=this.riders.filter(o=>!ie(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(r.length===0||s.length===0){this.breakawayGapStatus=null;return}const n=[...r].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null,i=[...s].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const c=this.intermediateMarkers[o];if(!c)continue;const l=n.markerCrossings[c.key]??null,m=i.markerCrossings[c.key]??null;if(!l||!m)continue;const p=m.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:p,penalty:this.resolveBreakawayTimeGapPenalty(p),kmMark:c.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const c=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(c==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,m=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||m==null)continue;const p=m-l;this.breakawayGapStatus={gapSeconds:p,penalty:this.resolveBreakawayTimeGapPenalty(p),kmMark:c/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=new Set(a.riderIds),s=this.riders.filter(o=>!ie(o)&&r.has(o.rider.id));if(s.length===0)return;const n=this.riders.filter(o=>!ie(o)&&!r.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(s,n);for(const o of s)o.breakawayGapPenalty=i;for(const o of s){const c=this.currentSegment(o);if(!c)continue;const m=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=m,o.tempSpeedMps=this.resolveRoadStageSpeedMps(m,o.distanceCoveredMeters,c,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(c.terrain));const p=this.resolveMaxBreakawayDraftModifier(o,c,s.length);o.draftModifier=p.draftModifier,o.draftNearbyRiderCount=Math.max(0,s.length-1),o.draftPackFactor=p.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*p.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,r,s,n){return this.resolveRoadStageSpeedMps(t,a,r,s,n,.5)}syncRiderTelemetry(t,a=null){var i;const r=this.currentSegment(t),s=this.currentWindZone(t);if(ie(t)||!r||!s){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,r,s);t.segmentStartKm=r.start_km,t.segmentEndKm=r.end_km,t.segmentStartElevation=r.start_elevation,t.segmentEndElevation=r.end_elevation,t.activeTerrain=r.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),r=this.riders.reduce((n,i)=>ie(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(r<=t.phaseEndDistanceMeters)return!1;let s=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(r<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<tu){n.breakawayMalus=0,s=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),c=Math.floor(o/Xc),l=Math.min(eu,n.breakawayInitialMalus),m=Math.max(l,n.breakawayInitialMalus-c*Qc),p=la(m);p!==n.breakawayMalus&&(n.breakawayMalus=p,s=!0)}return s}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const r=new Set(a.riderIds);for(const s of this.riders)ie(s)||!r.has(s.rider.id)||this.syncRiderTelemetry(s,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(s=>t.riderIds.includes(s.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const s of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:s.rider.id,riderName:s.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(s.rider.id,s.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let r=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),r=!0}if(this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayMalus=t.malusValue,s.breakawayInitialMalus=t.malusValue,s.breakawayRecoveryStartDistanceMeters=null,s.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return r}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=this.riders.filter(o=>!ie(o)&&a.riderIds.includes(o.rider.id));if(r.length===0)return;const s=[...r].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0];if(!s)return;const n=Math.max(.1,s.currentSpeedMps),i=s.distanceCoveredMeters+n*t;for(const o of r){if(Math.max(0,s.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?hc:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const r=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(r==null||r.isCounterAttack)return!0;const s=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(s==null?void 0:s.isCounterAttack)===!0&&s.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(r=>r.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const r=this.resolvePreStageGcRank(t);return r!=null?`${a} (${r}.)`:a}triggerStageAttacksForRider(t,a,r,s){if(ie(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||r<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(r/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const c=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/c),m=s+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:m,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const p=new Set(this.activeStageAttacksByRiderId.keys()),u=this.stageFavorites.slice(0,20).filter(h=>{if(h.kind!=="rider"||h.riderId==null)return!1;const b=this.riders.find(k=>k.rider.id===h.riderId);if(!b||ie(b))return!1;const y=t.distanceCoveredMeters-b.distanceCoveredMeters;return y>=0&&y<=150}),f=xc(u,t.rider.id,p),g=[];for(const h of f){const b=this.riders.find(y=>y.rider.id===h);!b||ie(b)||this.activeStageAttacksByRiderId.has(h)||(this.activeStageAttacksByRiderId.set(h,{riderId:h,remainingSeconds:ei,startedAtElapsedSeconds:m,triggerDistanceMeters:b.distanceCoveredMeters,durationSeconds:ei,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),b.isAttacking=!0,g.push({riderId:h,riderName:this.formatRiderWithPreStageGc(h,b.riderName),riderTeamId:b.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:m,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const h of g)this.pushMessage({elapsedSeconds:m,riderId:h.riderId,riderName:h.riderName,type:"counter_attack",tone:"warning",title:`${h.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const r of t){if(r.finishStatus==="dnf")continue;const s=a[a.length-1];if(!s||Math.abs(s.distanceMeter-r.distanceCoveredMeters)>=ar){a.push({riderIds:[r.rider.id],riderCount:1,distanceMeter:r.distanceCoveredMeters,distanceSum:r.distanceCoveredMeters});continue}s.riderIds.push(r.rider.id),s.riderCount+=1,s.distanceSum+=r.distanceCoveredMeters,s.distanceMeter=s.distanceSum/s.riderCount}return a.map(({distanceSum:r,...s})=>s)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!ie(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),r=new Map;let s=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],c=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-c<ar;){const p=a[n].rider.activeTeamId;p!=null&&r.set(p,(r.get(p)??0)+1),n+=1}for(;s<a.length&&c-a[s].distanceCoveredMeters>=ar;){const p=a[s].rider.activeTeamId;if(p!=null){const u=(r.get(p)??0)-1;u<=0?r.delete(p):r.set(p,u)}s+=1}const l=o.rider.activeTeamId,m=l==null?0:Math.max(0,(r.get(l)??0)-1);t.set(o.rider.id,m===0?0:la(m*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?Hc:0,r=this.resolveBreakawaySkillBonus(t.rider),s=t.baseSkill+Ar(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+r+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,s),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const r=Se(this.stageDistanceMeters/1e3,Uc,Yc),s=this.interpolateStaminaDistanceValue(r),n=Se(t,si,fs),i=(fs-n)/(fs-si),o=s/3+i*s,c=this.stageDistanceMeters<=0?0:Se(a/this.stageDistanceMeters,0,1);return o*c**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=jt[0].kmMark)return jt[0].value;for(let a=0;a<jt.length-1;a+=1){const r=jt[a],s=jt[a+1];if(t<=s.kmMark){const n=Math.max(1e-4,s.kmMark-r.kmMark),i=(t-r.kmMark)/n;return r.value+(s.value-r.value)*i}}return jt[jt.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/gs),r=Math.max(1,Math.ceil(t/gs)),s=me(Nc,Lc),n=Array.from({length:r},()=>me(.2,1.2)),i=n.reduce((l,m)=>l+m,0),o=Array.from({length:a+1},()=>1);o[0]=s;let c=0;for(let l=1;l<=r;l+=1)c+=n[l-1]??0,o[l]=s+(1-s)*(c/i);return o}resolveSkillSpreadFactor(t,a){const r=this.stageDistanceMeters<=0?1:Se(t/this.stageDistanceMeters,0,1),s=Math.min(this.spreadCurve.length-1,Math.floor(r/gs)),n=this.spreadCurve[s]??1;if(r<=this.lateStageStartRatio)return n;const i=Kd(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),c=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=Se((r-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),m=this.interpolateFinalSpread(o,l);if(o<=1&&c<=1)return n;if(r<this.finalPushStartRatio||c<=o)return Math.max(n,m);const p=Se((r-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),u=o+(c-o)*p;return Math.max(n,u)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const r=Io(this.simulationMode,t,this.skillWeightRuleMap).map(s=>({key:s.key,weight:s.weight}));return this.weightedSkillComponentsByTerrain.set(t,r),r}resolveWeightedSkill(t,a,r=0){const s=this.resolveWeightedSkillComponents(a),n=r>0||t.mentorBoosts?{...t.skills}:t.skills;if(r>0&&(n.stamina=Math.max(0,n.stamina-r)),t.mentorBoosts)for(const[l,m]of Object.entries(t.mentorBoosts))typeof m=="number"&&(n[l]+=m);let i=0,o=0;for(const l of s)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:zd(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,s)}}resolveSkillBreakdown(t,a,r){const s=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(s);if(n!==void 0)return n;const i=iu(t,r);return this.skillBreakdownCache.set(s,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const r=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,s=Math.max(0,100-r)/1e3,n=this.resolveElevationBucket(a);return s*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const r=a??this.interpolateElevation(t.distanceCoveredMeters),s=this.resolveElevationBucket(r);return s===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=s,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,r)),t.elevationPenalty}resolveSegmentElevation(t,a){const r=t.start_km*1e3,s=t.end_km*1e3,n=Math.max(1e-4,s-r),i=Se((a-r)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const s=Se(t,0,this.stageDistanceMeters)/1e3;if(s<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(s<=o.kmMark){const c=Math.max(1e-4,o.kmMark-i.kmMark),l=(s-i.kmMark)/c;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),hs(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var p;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(Ee).sort((u,f)=>(u.finishTimeSeconds??0)-(f.finishTimeSeconds??0)||f.photoFinishScore-u.photoFinishScore||u.rider.id-f.rider.id);if(t.length===0)return;const a=[];let r=null;for(const u of t){const f=u.finishTimeSeconds??0;if(a.length===0){a.push(u),r=f;continue}if(r!=null&&f-r<=Ea){a.push(u),r=f;continue}break}const s=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=u=>u.photoFinishScore,o=[...a].sort((u,f)=>i(f)-i(u)||u.rider.id-f.rider.id),c=((p=o[0])==null?void 0:p.finishTimeSeconds)??0,l=this.finishWeightProfile,m=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${m} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${Ea.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${s}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((u,f)=>{const g=pu(u,l).map($=>`${Ho[$.skillKey]} ${$.contribution.toFixed(2)} = ${$.effectiveSkill.toFixed(2)} x ${($.weight*100).toFixed(0)}%`).join(" | "),h=u.finishTimeSeconds??0,b=h-c,y=b<=1e-4?`${h.toFixed(2)} s`:`${h.toFixed(2)} s (+${b.toFixed(2)} s)`,k=this.calculatePhotoFinishScore(u),T=u.leadoutBonus??0,x=Ta(u,s,n);console.log(`#${f+1} Zielsprint | ${u.riderName} | Zeit ${y} | Score (ohne Boni): ${k.toFixed(2)} -> Score (mit Boni): ${u.photoFinishScore.toFixed(2)} [SpecAdj: ${x>0?"+":""}${x.toFixed(2)}, Leadout: +${T.toFixed(2)}] | ID-Tiebreak ${u.rider.id} | (${g})`)}),console.groupEnd()}recordIntermediateSplits(t,a,r,s,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>r)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,c=Math.max(0,this.isTimeTrialMode?s+o-t.startOffsetSeconds:s+o);let l=this.resolveMarkerCrossingScore(t,i);const m=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;m&&(l+=Ta(t,m,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=c,t.splitTimes[i.key]=c,t.splitTimes[i.label]=c,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:c,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return hs(t,this.resolveSprintWeightProfile());const r=hs(t,this.resolveClimbWeightProfile(a.markerCategory)),s=ru(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return r+s}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??wc}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??Cc[a]}calculatePreLeadoutFinishScore(t){const r=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,s=Ar(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[c,l])=>{if(!l)return o;const m=c==="stamina"?r:0,p=Math.max(0,t.rider.skills[c]+s+t.dailyForm+t.microForm+t.teamGroupBonus-m);return o+p*l},0),i=Ta(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}applySprintLeadoutBonuses(){const t=this.resolveFinishMarkerType();if(t!=="finish_flat"&&t!=="finish_hill"||this.isTimeTrialMode)return;const a=this.riders.filter(Ee).sort((o,c)=>(o.finishTimeSeconds??0)-(c.finishTimeSeconds??0));if(a.length===0)return;const r=[];let s=null;for(const o of a){const c=o.finishTimeSeconds??0;if(r.length===0){r.push(o),s=c;continue}if(s!=null&&c-s<=Ea){r.push(o),s=c;continue}break}const n=new Set(r.map(o=>o.rider.id)),i=new Map;for(const o of this.riders)if(o.finishStatus!=="dnf"&&o.finishStatus!=="otl"&&o.finishStatus!=="dns"&&o.finishTimeSeconds!=null&&o.rider.skills.sprint>=73&&o.rider.activeTeamId!=null&&n.has(o.rider.id)){const c=o.rider.activeTeamId,l=i.get(c)??[];l.push(o),i.set(c,l)}for(const[o,c]of i.entries()){if(c.length===0)continue;let l=null,m=Number.NEGATIVE_INFINITY;for(const p of c){const u=this.calculatePreLeadoutFinishScore(p);u>m?(m=u,l=p):u===m&&l!==null&&(p.rider.skills.sprint>l.rider.skills.sprint||p.rider.skills.sprint===l.rider.skills.sprint&&p.rider.id<l.rider.id)&&(l=p)}if(l){const p=this.calculateSprintLeadoutBonusForRider(l);p>0&&(l.leadoutBonus=p,l.photoFinishScore+=p)}}}calculateSprintLeadoutBonusForRider(t){const a=t.rider.activeTeamId;if(a==null)return 0;const r=this.riders.filter(m=>m.rider.activeTeamId===a);if(r.length===0)return 0;let s=this.teamSprintRandomValues.get(a);s===void 0&&(s=me(.25,.6),this.teamSprintRandomValues.set(a,s));let n=this.teamSprintSpecialRandomValues.get(a);n===void 0&&(n=me(.1,.3),this.teamSprintSpecialRandomValues.set(a,n)),t.leadoutRiderId=null;let i=0,o=0,c=null;const l=[];for(const m of r){if(m.rider.id===t.rider.id||m.finishStatus==="dnf"||m.finishStatus==="otl"||m.finishStatus==="dns")continue;let p=0;const u=m.rider.skills.sprint>=72,f=m.rider.skills.flat>=78,g=m.rider.skills.timeTrial>=76,h=m.rider.skills.acceleration>=80;if(u&&p++,f&&p++,g&&p++,h&&p++,p>0){const b=u?s:n;let y=1;p===2?y=1.25:p===3?y=1.5:p===4&&(y=2);const k=b*y*1.5;if(i+=b*y,l.push({riderId:m.rider.id,name:m.riderName,contribution:Number(k.toFixed(2))}),b*y>o)o=b*y,c=m.rider.id;else if(b*y===o&&c!==null){const T=this.riders.find(x=>x.rider.id===c);T&&m.rider.skills.sprint>T.rider.skills.sprint&&(c=m.rider.id)}}}return i>0&&(t.leadoutRiderId=c,t.leadoutContributions=l),i*1.5}resolveFinishMarkerType(){const t=yt(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const r=t[a].marker.type;if(r==="finish_flat"||r==="finish_hill"||r==="finish_mountain")return r}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return Rc;case"finish_mountain":return Ic;default:return Mc}}resolveRiderClockSeconds(t){if(Ee(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,r,s=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(c=>c.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){s=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const c=this.riders.find(m=>m.rider.id===o);if(!c||ie(c))continue;if(Math.abs(c.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const m=Zd(c.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(c,m,r,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:s?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:s?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:r,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(r=>r.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+ar){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const hu=300;async function bu(e,t){const a=new Go(e,{maxSubstepSeconds:5});let r=!1;for(;!r;){const s=a.step(hu);if(r=s.isFinished,t){const n=s.stageDistanceMeters>0?s.leaderDistanceMeters/s.stageDistanceMeters:0,i=e.riders.length>0?s.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const yu=[1,2,5,10,25,50,100,250,500],mi=new WeakMap;function vu(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function pi(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Su(e){const t=mi.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${yu.map(r=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return mi.set(e,a),a}function gi(e,t){const a=Su(e);a.timeField&&(a.timeField.textContent=vu(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${pi(t.snapshot.leaderDistanceMeters)} / ${pi(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(r=>{const s=Number(r.dataset.raceSimSpeed);r.classList.toggle("active",s===t.timeMultiplier)})}const ku=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function $u(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),r=t%60;return`${a}:${String(r).padStart(2,"0")}`}function ya(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function xu(e){return`/jersey/Jer_${e}.png`}function Ko(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${ya(xu(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Tu(e){return e.riderId==null||e.riderTeamId==null?"":Ko(e.riderTeamId)}function wu(e){const t=ya(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function Mu(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${ya(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${ya(e)}</button>`}function Ru(e,t){if(t==="all")return!0;const a=Oo(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function Iu(e){const t=e.detail?ya(e.detail):"",a=(e.secondaryRiders??[]).map(s=>`${s.riderTeamId!=null?Ko(s.riderTeamId,"race-sim-message-inline-jersey"):""}${Mu(s.riderName,s.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const r=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${r}</span>`}function Oo(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function fi(e,t,a="all"){const r=t.filter(n=>Ru(n,a)),s=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${ku.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${r.length===0?`<div class="race-sim-message-empty">${s}</div>`:r.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${ya(Oo(n))}">
          <span class="race-sim-message-time">t=${$u(n.elapsedSeconds)}</span>
          ${Tu(n)}
          <span class="race-sim-message-text">
            ${wu(n)}
            ${Iu(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const Cu=1,Fu={Flat:14,Rolling:15,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:25,High_Mountain:27,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function Eu(e){return Math.max(0,Math.round(e))}function jo(e){return e==="ITT"||e==="TTT"}function Pu(e){return Fu[e]??20}function Nu(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+Pu(e)/100))}function Lu(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function hi(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function bs(e,t){if(jo(t))return[...e].sort(Lu);const a=[...e].sort((o,c)=>o.stageTimeSeconds-c.stageTimeSeconds||hi(o,c)),r=[];let s=[],n=null;const i=()=>{r.push(...s.sort(hi))};for(const o of a){if(s.length===0){s=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=Cu){s.push(o),n=o.stageTimeSeconds;continue}i(),s=[o],n=o.stageTimeSeconds}return s.length>0&&i(),r}function re(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Du(e){return`/jersey/Jer_${e}.png`}function Ua(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${re(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${re(Du(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Ya(e,t,a){return e==null?`<span class="${a}" title="${re(t)}">${re(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${re(t)}">${re(t)}</button>`}function _u(e){return e.toFixed(1).replace(".",",")}function Br(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Au(e){return`${e??0} Pkt.`}function Bu(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function Hu(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function Wo(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function zu(e){if(e==null||e<=0)return Wo(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Lt(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function ir(e){return`${e.toFixed(1).replace(".",",")} km`}function bi(e){return`${e.toFixed(1).replace(".",",")}%`}function or(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function yi(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function Gu(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function Ku(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function Ou(e,t,a){return Array.from({length:t},(r,s)=>e.slice(s*a,(s+1)*a))}function ju(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const r=Ou(e,4,5),s=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${r.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=Ku(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${Ua(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${Ya(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${re(i.roleLabel)}">${re(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?s.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${re(Br(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${_u(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function Ba(e,t){const a=e.riders.find(r=>r.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function ts(e,t){const a=e.riders.find(n=>n.id===t),r=(a==null?void 0:a.activeTeamId)??null,s=r!=null?e.teams.find(n=>n.id===r)??null:null;return{teamId:r,teamName:(s==null?void 0:s.name)??null}}function Wu(e,t,a,r={}){const s=(t??[]).slice(0,r.limit??8);return s.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${s.map(n=>{var p;const i=n.riderId??0,o=ts(e,i),c=Ba(e,i),l=((p=r.distanceGapsByRiderId)==null?void 0:p.get(i))??null,m=[r.distanceGapClassName??"",Hu(l)].filter(u=>u.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${Ua(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${Ya(n.riderId,c,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${r.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${m}">${re(Bu(l))}</span>`:""}
      </article>`}).join("")}</div>`}function lr(e,t,a,r,s,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${re(e)}</h4>
      ${Wu(a,r,s,n)}
    </section>`}function Xt(e,t,a,r,s=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${r}" ${s?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${r}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${re(e)}</span>
      </summary>
      ${t}
    </details>`}function Hr(e,t,a,r){const s=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var c;const i=s.get(n.id)??null,o=((c=a.get(n.id))==null?void 0:c[r])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||Ba(e,n.riderId).localeCompare(Ba(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function vi(e){const t=Vu(e)?e.stagePoints:0;return`${re(Au("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${re(t)}</span></span>`:""}`}function Vu(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function Si(e,t){if(t==null)return new Map;const a=e.riders.find(r=>r.riderId===t)??null;return a?new Map(e.riders.map(r=>[r.riderId,a.distanceCoveredMeters-r.distanceCoveredMeters])):new Map}function Uu(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function $r(e,t){var r;const a=(r=e.race.category)==null?void 0:r.bonusSystem;return!a||t==null||t==="Sprint"?[]:Lt(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function nn(e){var r;const t=(r=e.race.category)==null?void 0:r.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return Lt(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return Lt(a?t.pointsMountainStage:t.pointsSprintFinish)}function Vo(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:Lt((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function Yu(e,t,a){let r=null;for(const s of e.stageSummary.segments){const n=Math.max(t,s.start_km),i=Math.min(a,s.end_km),o=Math.max(0,i-n);if(o<=0)continue;const c={lengthKm:o,gradient:s.gradient_percent};(r==null||c.gradient>r.gradient||c.gradient===r.gradient&&c.lengthKm>r.lengthKm)&&(r=c)}return r}function ys(e,t,a,r=null){return e.entries.filter(s=>r==null||r.has(s.riderId)).map((s,n)=>({riderId:s.riderId,rank:s.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:s.crossingTimeSeconds,gapSeconds:s.gapSeconds})).filter(s=>s.points>0)}function on(e){const t=new Map;for(const a of e)for(const r of a.entries){const s=t.get(r.riderId)??{points:0,mountain:0};r.pointsKind==="mountain"?s.mountain+=r.points:s.points+=r.points,t.set(r.riderId,s)}return t}function Zu(e){return yt(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function zr(e,t){const a=jo(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?Eu(a):null}function as(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=zr(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const r=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(r)||r<=0)return bs(a,e.stage.profile).map(n=>n.rider);const s=Nu(e.stage.profile,a.map(n=>n.stageTimeSeconds));return s==null?bs(a,e.stage.profile).map(n=>n.rider):bs(a.filter(n=>n.stageTimeSeconds<=s),e.stage.profile).map(n=>n.rider)}function Ju(e,t){const a=nn(e);return a.length===0?[]:as(e,t).map((r,s)=>({riderId:r.riderId,rank:s+1,points:a[s]??0,pointsKind:"points",crossingTimeSeconds:zr(e,r),gapSeconds:null})).filter(r=>r.points>0)}function qu(e,t){const a=as(e,t).slice(0,20),r=a[0]!=null?zr(e,a[0])??0:0;return a.map((s,n)=>{const i=zr(e,s)??0;return{riderId:s.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-r),photoFinishScore:s.photoFinishScore}})}function Xu(e,t){var a;return((a=as(e,t)[0])==null?void 0:a.riderId)??null}function ln(e,t,a){var T,x;const r=yt(e.stageSummary),s=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(as(e,a).map($=>$.riderId)):null,i=r.filter(({marker:$})=>$.type==="climb_start"),o=r.filter(({marker:$})=>Gt($)).sort(($,D)=>$.kmMark-D.kmMark).map(($,D)=>{var K,q;const E=[...i].reverse().find(Q=>Q.kmMark<=$.kmMark)??null,M=Uu(e,$.kmMark),R=(E==null?void 0:E.kmMark)??(M==null?void 0:M.start_km)??$.kmMark,_=(E==null?void 0:E.elevation)??(M==null?void 0:M.start_elevation)??$.elevation,F=Math.max(0,$.kmMark-R),N=F>0?($.elevation-_)/(F*1e3)*100:(M==null?void 0:M.gradient_percent)??0,H=Yu(e,R,$.kmMark),z=t.find(Q=>Q.markerKey===$.key)??null,I=$r(e,(z==null?void 0:z.markerCategory)??$.marker.cat??null),G=z?ys(z,I,"mountain",n):[],U=(z==null?void 0:z.markerCategory)??$.marker.cat??null;return{key:$.key,title:`${D+1}. Bergwertung`,label:$.label,categoryLabel:U?`Kat. ${U}`:null,categoryClassName:yi(U),kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:F,averageGradient:N,steepestSegmentLengthKm:(H==null?void 0:H.lengthKm)??null,steepestSegmentGradient:(H==null?void 0:H.gradient)??null,highlightMeta:$.kmMark>=s,leaderRiderId:((K=G[0])==null?void 0:K.riderId)??((q=z==null?void 0:z.entries[0])==null?void 0:q.riderId)??null,displayBadges:or(I,"mountain"),entries:G,timingEntries:(z==null?void 0:z.entries)??[],accent:"mountain"}}),c=r.filter(({marker:$})=>$.type==="sprint_intermediate").sort(($,D)=>$.kmMark-D.kmMark).map(($,D)=>{var _,F;const E=t.find(N=>N.markerKey===$.key)??null,M=Vo(e),R=E?ys(E,M,"points",n):[];return{key:$.key,title:`${D+1}. Zwischensprint`,label:$.label,categoryLabel:null,categoryClassName:null,kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((_=R[0])==null?void 0:_.riderId)??((F=E==null?void 0:E.entries[0])==null?void 0:F.riderId)??null,displayBadges:or(M,"points"),entries:R,timingEntries:(E==null?void 0:E.entries)??[],accent:"sprint"}}),l=Zu(e),m=Ju(e,a),p=l?t.find($=>$.markerKey===l.key)??null:null,u=p?ys(p,$r(e,p.markerCategory),"mountain",n):[],f=nn(e),g=p?$r(e,p.markerCategory):[],h=e.stage.profile==="ITT"||e.stage.profile==="TTT"?qu(e,a):(p==null?void 0:p.entries)??[],b=((T=m[0])==null?void 0:T.riderId)??((x=u[0])==null?void 0:x.riderId)??Xu(e,a),y={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:p!=null&&p.markerCategory?`Kat. ${p.markerCategory}`:null,categoryClassName:yi((p==null?void 0:p.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(p!=null&&p.markerCategory),leaderRiderId:b,displayBadges:[...or(f,"points"),...or(g,"mountain")],entries:[...m,...u],timingEntries:h,accent:"finish"};return[...[...c,...o].sort(($,D)=>$.kmMark-D.kmMark||$.title.localeCompare(D.title,"de")),y].filter($=>$.entries.length>0||$.timingEntries.length>0||$.accent!=="finish"||l!=null||a.isFinished)}function Qu(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),r=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,s=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,r):t.entries.slice(0,r).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return s.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${s.map(n=>{const i=ts(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${Ua(i.teamId,i.teamName)}
            ${Ya(n.riderId,Ba(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?re(Wo(n.crossingTimeSeconds)):re(zu(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function ki(e,t){var a;return((a=e==null?void 0:e.find(r=>r.riderId===t))==null?void 0:a.points)??0}function $i(e,t){var a;return((a=e.filter(r=>r.riderId!=null&&t.has(r.riderId)).sort((r,s)=>r.rank-s.rank||r.riderId-s.riderId)[0])==null?void 0:a.riderId)??null}function dr(e,t,a){if(!(!t||e.some(r=>r.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function em(e,t,a,r,s){const n=new Set(e.riderIds),i=new Map(t.riders.map(f=>[f.riderId,f])),c=e.riderIds.map(f=>i.get(f)??null).filter(f=>f!=null).sort((f,g)=>{var h,b;return(((h=a.get(f.riderId))==null?void 0:h.rank)??Number.MAX_SAFE_INTEGER)-(((b=a.get(g.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)||f.riderName.localeCompare(g.riderName,"de")||f.riderId-g.riderId}).slice(0,25),l=i.get($i(r,n)??-1)??null,m=i.get($i(s,n)??-1)??null,p=l!=null&&!c.some(f=>f.riderId===l.riderId),u=m!=null&&!c.some(f=>f.riderId===m.riderId);return c.length>=25&&p&&u&&l.riderId!==m.riderId?(dr(c,l,23),dr(c,m,24),c):(dr(c,l,24),dr(c,m,24),c)}function tm(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function am(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function xi(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function rm(e,t){const a=t.riders.filter(s=>e.riderIds.includes(s.riderId)).reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0),r=Math.max(0,t.leaderDistanceMeters-a);return r>0?`-${Math.round(r)} m`:"—"}function sm(e,t,a,r,s,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=Md(a,r),c=a.find(u=>u.label===o)??a[0],l=new Map(e.gcStandings.map(u=>[u.riderId,u])),m=on(i),p=em(c,t,l,s,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${re(c.label)} <span class="race-sim-group-count">(${c.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${re(xi(c.previousGapMeters,"-"))}</span>
        <span>Leader ${re(rm(c,t))}</span>
        <span>Hinten ${re(xi(c.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${p.map((u,f)=>{const g=l.get(u.riderId)??null,h=ts(e,u.riderId),b=m.get(u.riderId)??{points:0,mountain:0},y=ki(s,u.riderId),k=ki(n,u.riderId),T=tm(u.riderId,e.classificationLeaders),x=T.length>0?T.map($=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[$]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${am(T)}" title="${re(x)}">${f+1}.</strong>
              ${Ua(h.teamId,h.teamName)}
              <span class="race-sim-classification-main">
                ${Ya(u.riderId,u.riderName,`race-sim-group-rider-name${u.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${g?g.rank:"—"} · ${re(g?Br(g.gapSeconds):"—")} · ${re(u.gapToLeaderMeters>0?`+${Math.round(u.gapToLeaderMeters)} m`:"—")}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${y}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${k}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${b.points>0?`▲ +${b.points}`:" "}</span>
                  <span class="race-sim-breakaway-stage-gain">${b.mountain>0?`▲ +${b.mountain}`:" "}</span>
                </span>
              </span>
            </article>`}).join("")}
      </div>
    </section>`}function nm(e,t,a,r){const s=ln(t,a.markerClassifications,a),n=on(s),i=Hr(t,t.pointsStandings,n,"points"),o=Hr(t,t.mountainStandings,n,"mountain"),c=sn(rn(a.clusters));e.innerHTML=sm(t,a,c,r,i,o,s)}function im(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function om(e){const t=yt(e.stageSummary),a=Vo(e)[0]??0,r=nn(e)[0]??0,s=t.filter(({marker:n})=>Gt(n)).reduce((n,{marker:i})=>n+($r(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+r,mountain:s}}function Ti(e){const t=om(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function lm(e){const t=Gu(e),a=[`<span class="race-sim-stage-points-meta-pill">${re(ir(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${re(`${ir(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${re(`Länge ${ir(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${re(`Ø ${bi(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${re(`Steilstes ${ir(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${re(bi(e.steepestSegmentGradient))}</span>`:""].filter(r=>r.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${re(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${re(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${re(e.label)}">${re(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((r,s)=>`${s>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${r}`).join("")}
    </span>`}function dm(e,t,a,r=null){const s=r??ln(e,t,a);return s.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${Ti(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${Ti(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${s.map(n=>{const i=n.leaderRiderId!=null?ts(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?Ba(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${lm(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${im(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${Ua(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?Ya(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${re(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${Qu(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function cm(e,t,a,r,s,n=new Set){var f,g;const i=ln(a,r,s),o=on(i),c=Hr(a,a.pointsStandings,o,"points"),l=Hr(a,a.mountainStandings,o,"mountain"),m=Si(s,((f=a.gcStandings[0])==null?void 0:f.riderId)??null),p=Si(s,((g=a.youthStandings[0])==null?void 0:g.riderId)??null),u=h=>!n.has(h);e.innerHTML=`
    ${Xt("Stage Favorites",ju(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",u("favorites"))}
    <section class="race-sim-classifications-section">
      ${Xt("GC",lr("GC","gc",a,a.gcStandings,h=>re(`GC ${h.rank} · ${Br(h.gapSeconds)}`),{limit:20,distanceGapsByRiderId:m}),"race-sim-overview-classification race-sim-overview-gc","gc",u("gc"))}
      ${Xt("Punktewertung",lr("Punktewertung","points",a,c,vi),"race-sim-overview-classification race-sim-overview-points","points",u("points"))}
      ${Xt("Bergwertung",lr("Bergwertung","mountain",a,l,vi),"race-sim-overview-classification race-sim-overview-mountain","mountain",u("mountain"))}
      ${Xt("Nachwuchsfahrerwertung",lr("Nachwuchsfahrerwertung","youth",a,a.youthStandings,h=>re(`${h.rank}. · ${Br(h.gapSeconds)}`),{distanceGapsByRiderId:p,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",u("youth"))}
    </section>
    ${Xt("Etappenwertungen",dm(a,r,s,i),"race-sim-overview-stage-scoring","stageScoring",u("stageScoring"))}
  `}const wi=new WeakMap,ht=new WeakMap,Mi=new WeakMap,Uo=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function ae(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Yo(e){return e<=0?"—":`+${Math.round(e)} m`}function Pa(e){const t=Uo.format(e);return e>0?`+${t}`:t}function vs(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function he(e){return Uo.format(e)}function Yt(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Zo(e){return`+${Yt(e)}`}function Jo(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function dn(e){return`${(e*3.6).toFixed(1)} km/h`}function um(e){return`${Pa(e)}%`}function Ls(e){return`${e.toFixed(1).replace(".",",")} km`}function qo(e){return`${Ls(e.segmentStartKm)} - ${Ls(e.segmentEndKm)}`}function mm(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function Xo(e){return e.replace(/_/g," ")}function Qo(e){return Xo(e)}function pm(e){return Xo(e)}function el(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function gm(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function fm(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function tl(e){return yt(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||Gt(t)).map(({key:t,label:a})=>({key:t,label:a}))}function hm(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function bm(e,t,a,r){var s;return a!=="ITT"&&a!=="TTT"?((s=r.get(t))==null?void 0:s.get(e.riderId))??null:e.splitTimes[t]??null}function al(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(s=>({label:s.key,displayLabel:s.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${s.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function ym(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function vm(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function rl(e){const t=wi.get(e);if(t)return t;const a=tl(e),r={splitMarkers:a,columns:al(e,a,!1),riderById:new Map(e.riders.map(s=>[s.id,s])),teamById:new Map((e.teams??[]).map(s=>[s.id,s])),teamAbbreviationById:new Map((e.teams??[]).map(s=>[s.id,s.abbreviation])),teamNameById:new Map((e.teams??[]).map(s=>[s.id,s.name])),gcByRiderId:new Map((e.gcStandings??[]).map(s=>[s.riderId,s]))};return wi.set(e,r),r}function sl(e,t){const a=e.parentElement,r=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!r)return"";const s=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",r.insertAdjacentElement("beforebegin",l),l})(),n=cn(e),i=ym(t),o=vm(i,n),c=ht.get(e);return(c==null?void 0:c.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),s.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,r.innerHTML=t.map(l=>Sm(l,n)).join(""),ht.set(e,{layoutKey:o,orderedRiderIds:(c==null?void 0:c.orderedRiderIds)??[],rowsByRiderId:(c==null?void 0:c.rowsByRiderId)??new Map,openDetailRiderId:(c==null?void 0:c.openDetailRiderId)??null,openTeamId:(c==null?void 0:c.openTeamId)??null})),o}function St(e,t){e.textContent!==t&&(e.textContent=t)}function cr(e,t){e.title!==t&&(e.title=t)}function ur(e,t){e.className!==t&&(e.className=t)}function mr(e,t,a){return e.lastValues[t]!==a}function pr(e,t,a){e.lastValues[t]=a}function cn(e){const t=Mi.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return Mi.set(e,a),a}function Sm(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${ae(e.label)}">${ae(a)}</span>`;const r=!t.autoSort&&t.manualSortKey===e.sortKey,s=r?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${r?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${ae(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${ae(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${ae(a)}<span class="race-sim-leaderboard-sort-indicator">${ae(s)}</span></button>`}function km(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function $m(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function Ri(e,t,a,r,s,n,i){if(r.autoSort)return(c,l)=>e.stage.profile==="ITT"?nl(c,l,t):Mm(c,l);if(!r.manualSortKey)return null;const o=r.manualSortDirection==="asc"?1:-1;return(c,l)=>{if(Ke(c)!==Ke(l))return Ke(c)?1:-1;const m=s.get(c.riderId)??null,p=s.get(l.riderId)??null,u=Ii(c,m,r.manualSortKey??"",e,a,n,i),f=Ii(l,p,r.manualSortKey??"",e,a,n,i);return $m(u,f)*o||c.riderId-l.riderId}}function xm(e,t,a){if(e.length!==t.size)return!1;let r=null;for(const s of e){const n=t.get(s);if(!n||r&&a(r,n)>0)return!1;r=n}return!0}function Ii(e,t,a,r,s,n,i){const o=r.race.isStageRace&&r.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return r.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?bm(e,a.slice(6),r.stage.profile,s):null}}function Tm(e,t,a,r,s,n,i,o,c){if(!s.manualSortKey){if(s.autoSort){const u=Ri(t,a,r,s,n,i,o);return u?[...e].sort(u):[...e]}const p=new Map(s.frozenOrder.map((u,f)=>[u,f]));return[...e].sort((u,f)=>(Ke(u)===Ke(f)?0:Ke(u)?1:-1)||(p.get(u.riderId)??Number.MAX_SAFE_INTEGER)-(p.get(f.riderId)??Number.MAX_SAFE_INTEGER)||u.riderId-f.riderId)}const l=Ri(t,a,r,s,n,i,o);if(!l)return[...e];const m=new Map(e.map(p=>[p.riderId,p]));return xm(c,m,l)?c.map(p=>m.get(p)).filter(p=>p!=null):[...e].sort(l)}function wm(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const m=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(m))return!1;const p=ht.get(e);return p?(p.openTeamId=p.openTeamId===m?null:m,p.openTeamId==null&&(p.openDetailRiderId=null),!0):!1}const r=t.closest("button[data-race-sim-rider-toggle]");if(r){const m=Number(r.dataset.raceSimRiderToggle);if(!Number.isFinite(m))return!1;const p=ht.get(e);return p?(p.openDetailRiderId=p.openDetailRiderId===m?null:m,!0):!1}const s=cn(e);if(t.closest("button[data-race-sim-splits-toggle]"))return s.showSplitColumns=!s.showSplitColumns,!s.showSplitColumns&&((l=s.manualSortKey)!=null&&l.startsWith("split:"))&&(s.manualSortKey=null,s.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return s.autoSort=!s.autoSort,s.autoSort?(s.manualSortKey=null,s.frozenOrder=[]):(s.manualSortKey=null,s.manualSortDirection="asc",s.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(m=>Number(m.dataset.raceSimRiderRow)).filter(m=>Number.isFinite(m))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||s.autoSort)return!1;const c=o.dataset.raceSimSortKey;return c?(s.manualSortKey===c?s.manualSortDirection=s.manualSortDirection==="asc"?"desc":"asc":(s.manualSortKey=c,s.manualSortDirection=km(c)),s.frozenOrder=[],!0):!1}function Ci(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function Ke(e){return e.finishStatus==="dnf"}function nl(e,t,a){if(Ke(e)!==Ke(t))return Ke(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const c=a[o];if(!c)continue;const l=e.splitTimes[c.key],m=t.splitTimes[c.key];if(l!=null&&m!=null&&l!==m)return l-m;if(l!=null&&m==null)return-1;if(l==null&&m!=null)return 1}const r=Ci(e,a),s=Ci(t,a);if(r!==s)return r?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function Mm(e,t){return Ke(e)!==Ke(t)?Ke(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function il(e,t){const a=(t==null?void 0:t.formBonus)??0,r=(t==null?void 0:t.raceFormBonus)??0,s=((t==null?void 0:t.fatigueMalus)??0)*.5,n=((t==null?void 0:t.longTermFatigueMalus)??0)*.5,i=((t==null?void 0:t.shortTermFatigueMalus)??0)*.5,o=e.teamGroupBonus,c=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,m=e.baseSkill+l+a+r+e.dailyForm+e.microForm+o-s-n-i,p=Math.max(0,m-e.staminaPenalty),u=m-p,f=p-e.effectiveSkill;return[`Basis ${he(e.baseSkill)}`,e.isAttacking?`+ Attacke ${he(l)}`:null,`+ S-Form ${he(a)}`,`+ R-Form ${he(r)}`,`+ T-Form ${he(e.dailyForm)}`,`+ Zufällige Form ${he(c)} (skaliert)`,`+ Teambonus ${he(o)}`,`- Fatigue ${he(s)}`,`- Langzeit ${he(n)}`,`- Akut ${he(i)}`,`- Stamina ${he(u)}`,`- HM ${he(f)}`,`= Effektiv ${he(e.effectiveSkill)}`].filter(g=>g!=null)}function Rm(e,t){return il(e,t).join(`
`)}function Im(e){return Pa(Math.max(-2.5,Math.min(2.5,e*2.5)))}function Cm(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function ol(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${ae(e.riderName)}">${ae(e.riderName)}</button>`}function Fm(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId)??"—",s=a.get(e.activeTeamId)??r;return`<span class="race-sim-team-code" title="${ae(s)}">${ae(r)}</span>`}function ll(e){return`/jersey/Jer_${e}.png`}function Em(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId);if(!r)return"—";const s=a.get(e.activeTeamId)??r.name,n=ll(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${ae(s)}">
      <img
        class="race-sim-team-jersey-img"
        src="${ae(n)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Pm(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function Nm(e,t,a,r){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=r.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const s=e.splitTimes[t];return s!=null?Yt(s):"—"}function dl(e,t,a){const r=il(e,t),s=[{label:"Terrain / Skill",value:`${Qo(e.activeTerrain)} / ${pm(e.skillName)}`},{label:"Aktiver Abschnitt",value:qo(e)},{label:"Segmenthöhe",value:mm(e)},{label:"Basis",value:he(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${he(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:Pa((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:Pa((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:vs((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:vs((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:vs((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:he(e.staminaPenalty)},{label:"HM",value:he(e.elevationPenalty)},{label:"T-Form",value:Pa(e.dailyForm)},{label:"Zufall",value:Im(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:Cm(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?Jo(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${ae(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${ae(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${s.map(n=>`<div class="race-sim-rider-detail-item"><span>${ae(n.label)}</span><strong>${ae(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${r.map(n=>ae(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${ae(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function Lm(e,t,a,r,s,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const c=document.createElement("div");c.className="race-sim-row-grid",o.appendChild(c);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",c.appendChild(l);const m=document.createElement("span");m.className="race-sim-row-flag",m.innerHTML=t?Td(fm(t)):"—",c.appendChild(m);const p=document.createElement("span");p.className="race-sim-row-name",p.innerHTML=ol(e,a),c.appendChild(p);const u=p.querySelector(".race-sim-row-name-btn");if(!u)throw new Error("race-sim-row-name-btn not found");const f=document.createElement("span");f.className="race-sim-row-team-visual",f.innerHTML=Em(t,s,i),c.appendChild(f);const g=document.createElement("strong");g.className="race-sim-row-team",g.innerHTML=Fm(t,n,i),c.appendChild(g);const h=(_="")=>{const F=document.createElement("strong");return _&&(F.className=_),c.appendChild(F),F},b=h("race-sim-gap"),y=h("race-sim-cell-effective-skill"),k=h(),T=h(),x=h(),$=r.map(()=>h()),D=h(),E=h(),M=h("race-sim-form-state-cell"),R=document.createElement("div");return R.className="race-sim-row-detail-popover hidden",o.appendChild(R),{row:o,rankField:l,nameButton:u,gapField:b,clockField:x,splitFields:$,effectiveSkillField:y,gcRankField:k,gcGapField:T,gradientPercentField:D,speedField:E,formStateField:M,detailPanel:R,initialized:!1,lastValues:{}}}function Dm(e,t,a,r,s,n,i,o,c,l,m){const p=(r==null?void 0:r.formBonus)??0,u=(r==null?void 0:r.raceFormBonus)??0,f=c&&l>1?m.get(a.riderId)??null:null,g=Ke(a),h=i!=="ITT"&&i!=="TTT"?g?"DNF":"—":a.hasStarted?g?"DNF":a.riderClockSeconds!=null?Yt(a.riderClockSeconds):"—":Zo(a.startOffsetSeconds);ur(e.row,`race-sim-row${t===1&&!g?" race-sim-row-leader":""}${s?" race-sim-row-detail-open":""}${g?" race-sim-row-dnf":""}`),St(e.rankField,`${t}.`),St(e.gapField,g?"DNF":Yo(a.gapToLeaderMeters)),St(e.clockField,h),e.nameButton.setAttribute("aria-expanded",s?"true":"false"),ur(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),cr(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((T,x)=>{const $=e.splitFields[x];if(!$)return;const D=Nm(a,T.key,i,o);St($,D),cr($,T.label)}),mr(e,"effectiveSkillValue",a.effectiveSkill)&&(St(e.effectiveSkillField,he(a.effectiveSkill)),pr(e,"effectiveSkillValue",a.effectiveSkill));const b=`race-sim-cell-effective-skill ${el(a)}`;mr(e,"effectiveSkillClass",b)&&(ur(e.effectiveSkillField,b),pr(e,"effectiveSkillClass",b));const y=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,p,u,a.dailyForm,a.microForm,(r==null?void 0:r.fatigueMalus)??0,(r==null?void 0:r.longTermFatigueMalus)??0,(r==null?void 0:r.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");mr(e,"effectiveSkillTitleKey",y)&&(cr(e.effectiveSkillField,Rm(a,r)),pr(e,"effectiveSkillTitleKey",y)),St(e.gcRankField,f?String(f.rank):"—"),St(e.gcGapField,f?Jo(f.gapSeconds):"—"),St(e.gradientPercentField,um(a.gradientPercent)),ur(e.gradientPercentField,gm(a.gradientPercent)),cr(e.gradientPercentField,`${Qo(a.activeTerrain)} · ${qo(a)}`),St(e.speedField,dn(a.currentSpeedMps)),e.formStateField.innerHTML=Pm(a);const k=[s?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,p,u,(r==null?void 0:r.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(f==null?void 0:f.rank)??"—",(f==null?void 0:f.gapSeconds)??"—",a.skillBreakdown].join("|");mr(e,"detailKey",k)&&(e.detailPanel.innerHTML=s?dl(a,r,f):"",e.detailPanel.classList.toggle("hidden",!s),pr(e,"detailKey",k)),e.detailPanel.classList.toggle("hidden",!s),e.initialized=!0}function _m(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${ae(e.name)}">${ae(e.name)}</button>`}function Am(e){const t=ll(e.id);return`
    <span class="race-sim-team-visual" title="${ae(e.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${ae(t)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Bm(e,t,a){const r=new Map;for(const s of e.riders){const n=a.get(s.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=r.get(i)??[];o.push(s),r.set(i,o)}return t.teams.filter(s=>r.has(s.id)).map(s=>{const n=(r.get(s.id)??[]).slice().sort((m,p)=>p.effectiveSkill-m.effectiveSkill||m.riderId-p.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),c=n.slice(0,o).reduce((m,p)=>m+p.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:s,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,c-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(m=>m.isFinished).length}}).sort((s,n)=>nl(s.representative,n.representative,tl(t))||s.team.id-n.team.id)}function Hm(e,t,a,r,s){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${ae(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${ae(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${ae(he(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${ae(dn(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${ae(e.teamClockSeconds!=null?Yt(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${ae(Ls(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&r>1?t.gcByRiderId.get(n.riderId)??null:null,c=s===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${ol(n,c)}
                <strong>${ae(he(n.effectiveSkill))}</strong>
                <span>${ae(n.riderClockSeconds!=null?Yt(n.riderClockSeconds):"—")}</span>
              </div>
              ${c?dl(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function zm(e,t,a){var f,g;const r=performance.now(),s=rl(a),n=s.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(h=>({label:h.key,displayLabel:h.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(f=ht.get(e))==null?void 0:f.layoutKey,c=sl(e,i),l=ht.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==c&&(e.innerHTML="");const m=Bm(t,a,s.riderById),p=((g=m[0])==null?void 0:g.teamDistanceMeters)??0;return e.innerHTML=m.map((h,b)=>{const y=l.openTeamId===h.team.id;return`
      <article class="race-sim-row${b===0?" race-sim-row-leader":""}${y?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${b+1}.</strong>
          <span class="race-sim-row-name">${_m(h.team,y)}</span>
          <span class="race-sim-row-team-visual">${Am(h.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${ae(h.team.name)}">${ae(h.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${ae(Yo(Math.max(0,p-h.teamDistanceMeters)))}</strong>
          <strong>${ae(h.teamClockSeconds!=null?Yt(h.teamClockSeconds):Zo(h.representative.startOffsetSeconds))}</strong>
          ${n.map(k=>`<strong>${ae(h.splitTimes[k.key]!=null?Yt(h.splitTimes[k.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${el(h.representative)}">${ae(he(h.teamEffectiveSkill))}</strong>
          <strong>${ae(dn(h.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${y?"":" hidden"}">${y?Hm(h,s,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),ht.set(e,{layoutKey:c,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-r,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:m.length,rowsCreated:m.length,rowsRemoved:0,rowsUpdated:m.length,rowsSkippedInvisible:0,orderChanged:1}}function Fi(e,t,a){if(a.stage.profile==="TTT")return zm(e,t,a);const r=performance.now(),s={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=rl(a),{splitMarkers:o}=i,c=hm(t),l=cn(e),m=l.showSplitColumns?o:[],p=ht.get(e);s.prepMs=performance.now()-n;const u=performance.now(),f=Tm(t.riders,a,o,c,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(p==null?void 0:p.orderedRiderIds)??[]);s.sortMs=performance.now()-u;const g=p==null?void 0:p.layoutKey,h=performance.now(),b=sl(e,al(a,m,l.showSplitColumns));s.layoutMs=performance.now()-h;const y=ht.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};g!=null&&g!==b&&(e.innerHTML="",y.rowsByRiderId.clear(),y.orderedRiderIds=[]);const k=f.map(R=>R.riderId),T=new Set(k),x=performance.now();for(const[R,_]of y.rowsByRiderId)T.has(R)||(_.row.remove(),y.rowsByRiderId.delete(R),s.rowsRemoved+=1);s.removeRowsMs=performance.now()-x;const $=performance.now();for(let R=0;R<f.length;R+=1){const _=f[R],F=i.riderById.get(_.riderId)??null;let N=y.rowsByRiderId.get(_.riderId);N||(N=Lm(_,F,y.openDetailRiderId===_.riderId,m,i.teamById,i.teamAbbreviationById,i.teamNameById),y.rowsByRiderId.set(_.riderId,N),s.rowsCreated+=1)}s.createRowsMs=performance.now()-$;const D=performance.now(),E=y.orderedRiderIds.length===k.length&&y.orderedRiderIds.every((R,_)=>R===k[_]);s.orderCheckMs=performance.now()-D;const M=performance.now();if(!E){const R=document.createDocumentFragment();for(const _ of k){const F=y.rowsByRiderId.get(_);F&&R.appendChild(F.row)}e.replaceChildren(R),s.orderChanged=1}s.reorderMs=performance.now()-M;for(let R=0;R<f.length;R+=1){const _=f[R],F=y.rowsByRiderId.get(_.riderId),N=i.riderById.get(_.riderId)??null;if(!F)continue;const H=performance.now();Dm(F,R+1,_,N,y.openDetailRiderId===_.riderId,m,a.stage.profile,c,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),s.updateRowsMs+=performance.now()-H,s.rowsUpdated+=1}return ht.set(e,{layoutKey:b,orderedRiderIds:k,rowsByRiderId:y.rowsByRiderId,openDetailRiderId:y.openDetailRiderId,openTeamId:y.openTeamId}),s.finalizeMs=performance.now()-(r+s.prepMs+s.sortMs+s.layoutMs+s.removeRowsMs+s.createRowsMs+s.orderCheckMs+s.reorderMs+s.visibilityMs+s.updateRowsMs),s.totalMs=performance.now()-r,s.finalizeMs=Math.max(0,s.totalMs-s.prepMs-s.sortMs-s.layoutMs-s.removeRowsMs-s.createRowsMs-s.orderCheckMs-s.reorderMs-s.visibilityMs-s.updateRowsMs),s}const Gm=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],Km=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],cl=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],ul=["Sprint","4","3","2","1","HC"],Gr=.2,Om=7,jm=100,Wm=3,Vm=50,Um=-2,Ym=1,Zm=2.5,Jm=-3,qm=15,Xm=200,Qm=600,ep=850;function Je(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function Kr(e){return e==="finish_hill"||e==="finish_mountain"}function Or(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function rs(e,t){return e==="climb_top"||Kr(e)&&Or(t)}function Za(e){return Math.round(e*10)/10}function Oe(e){return Number(e.toFixed(2))}function Dt(e){return`${e.toFixed(2).replace(".",",")} km`}function ml(e){return`${Math.round(e)} hm`}function tp(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function un(e){return Gm.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function ap(e){return Km.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function rp(e,t="start",a=0,r=1){const s=cl.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:Je(i)?a===r-1:i==="climb_top"||i==="sprint_intermediate");return(s.includes(e)?s:[e,...s.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${S(i)}</option>`).join("")}function sp(e){return['<option value="">–</option>',...ul.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`)].join("")}function Ei(e){return cl.indexOf(e)}function ot(e){return[...e].sort((t,a)=>Ei(t.type)-Ei(a.type))}function Ha(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:ot(e[0].markers)}];let a=0;return e.forEach(r=>{a=Oe(a+r.lengthKm);const s=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),n=t[t.length-1];n.terrain=r.terrain,n.techLevel=r.techLevel,n.windExp=r.windExp,n.markers=ot([...n.markers,...r.markers]),t.push({kmMark:a,elevation:s,terrain:r.terrain,techLevel:r.techLevel,windExp:r.windExp,markers:ot(r.endMarkers)})}),t}function np(e){return e?" stage-editor-input-invalid":""}function mn(e,t){const a=e.segments[t];if(!a)return[];const r=[],s=ip(e).get(t)??[];return a.lengthKm<Gr&&r.push(`Laenge unter ${Gr.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&r.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&r.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&r.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>Je(n.type))&&r.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&r.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>Je(n.type))&&r.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{Je(n.type)&&r.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&r.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&r.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&r.push(`${n.type} gehoert in den Startmarker-Slot.`),rs(n.type,n.cat)&&!Or(n.cat)&&r.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&r.push("Sprintmarker erlaubt nur Kategorie Sprint."),Je(n.type)&&!Kr(n.type)&&n.cat!=null&&r.push("finish_flat und finish_TT duerfen keine Kategorie haben."),Kr(n.type)&&n.cat!=null&&!Or(n.cat)&&r.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),r.push(...s),[...new Set(r)]}function ip(e){const t=new Map,a=[],r=(s,n)=>{const i=t.get(s)??[];i.push(n),t.set(s,i)};return e.segments.forEach((s,n)=>{s.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),s.endMarkers.forEach(i=>{var l;if(!rs(i.type,i.cat))return;if(!i.name){r(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let m=a.length-1;m>=0;m-=1)if(((l=a[m])==null?void 0:l.name)===i.name){o=m;break}const c=o>=0?o:a.length-1;if(c<0){r(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(c,1)})}),a.forEach(s=>{const n=s.name?` "${s.name}"`:"";r(s.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function op(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:Kr(e.type)?{...e,cat:Or(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function pl(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:lp(e.waypoints??[])).map(r=>({...r,startElevation:Math.round(r.startElevation),lengthKm:Number.isFinite(r.lengthKm)?Oe(r.lengthKm):Gr,gradientPercent:Number.isFinite(r.gradientPercent)?Za(r.gradientPercent):0,techLevel:Number.isFinite(r.techLevel)?r.techLevel:5,windExp:Number.isFinite(r.windExp)?r.windExp:5,markers:Pi(r.markers),endMarkers:Pi(r.endMarkers)})),waypoints:[]};return Kt(t),t}function lp(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const r=e[a],s=e[a+1],n=Oe(s.kmMark-r.kmMark),i=s.elevation-r.elevation,o=Za(n>0?i/(n*10):0);t.push({startElevation:r.elevation,lengthKm:n,gradientPercent:o,techLevel:r.techLevel??5,windExp:r.windExp??5,terrain:r.terrain??"Flat",markers:r.markers??[],endMarkers:s.markers??[]})}return t}function Pi(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function dp(e,t,a){const r=e*a*8+t/12;return r>=95?"HC":r>=68?"1":r>=46?"2":r>=28?"3":"4"}function Ni(e){const t=[];let a=null,r=null,s=0;const n=i=>{if(a==null||i==null||i<=a){a=null,r=null,s=0;return}const o=e[a],c=e[i],l=c.kmMark-o.kmMark,m=Math.max(0,c.elevation-o.elevation),p=l>0?m/(l*10):0;m>=jm&&p>=Wm&&t.push({startKm:Oe(o.kmMark),endKm:Oe(c.kmMark),distanceKm:Oe(l),gainMeters:Math.round(m),avgGradient:Za(p),category:dp(l,m,p),startIndex:a,topIndex:i,topElevation:Math.round(c.elevation)}),a=null,r=null,s=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],c=e[i],l=c.elevation-o.elevation;if(a==null&&l>0){a=i-1,r=i,s=0;continue}if(a!=null){if(l>=0){(r==null||c.elevation>=e[r].elevation)&&(r=i),s=0;continue}s+=Math.abs(l),s>=Vm&&n(r)}}return n(r),t}function cp(e){const t=e.segments.some(s=>s.terrain==="Cobble_Hill"),a=e.segments.some(s=>s.terrain==="Cobble"),r=e.climbs.some(s=>s.category==="HC"||s.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":r&&e.elevationGainMeters>=2800?"High_Mountain":r||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function gr(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function up(e){return e.gainMeters>=Qm&&e.topElevation>=ep?"Mountain":e.gainMeters>Xm?"Medium_Mountain":"Hill"}function mp(e){return e.gradientPercent<Jm?"Abfahrt":e.gradientPercent<Zm||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<qm?"Flat":"Hill"}function pp(e){if(e.segments.length===0)return;if(e.waypoints=Ha(e.segments),e.sourceFormat==="csv"){const i=Ni(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:c,topElevation:l,...m})=>m);return}const t=e.segments.map(i=>i.manualTerrain||gr(i.terrain)?i.terrain:mp(i)),a=Ni(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:c,...l})=>l),a.forEach(i=>{const o=up(i);if(o)for(let c=i.startIndex;c<i.topIndex;c+=1)e.segments[c].manualTerrain||gr(t[c])||(t[c]=o)});let r=null,s=0;const n=i=>{if(r==null||s<=Ym){r=null,s=0;return}for(let o=r;o<i;o+=1)!(e.segments[o].manualTerrain||gr(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");r=null,s=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<Um){r==null&&(r=i),s+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{gr(i.terrain)||(i.terrain=t[o])}),e.waypoints=Ha(e.segments),e.suggestedProfile=cp(e)}function Kt(e){gp(e),Li(e),pp(e),e.waypoints=Ha(e.segments),Li(e)}function gp(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,r)=>{const s={...a,startElevation:Math.round(r===0?a.startElevation:t),lengthKm:Oe(a.lengthKm),gradientPercent:Za(a.gradientPercent),markers:ot(a.markers),endMarkers:ot(a.endMarkers)};return t=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),s}),e.waypoints=Ha(e.segments)}function Li(e){e.totalDistanceKm=Oe(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,r)=>{if(r===0)return 0;const s=a.elevation-e.waypoints[r-1].elevation;return t+Math.max(0,s)},0)}function It(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(r=>r.type==="start")||(t.markers=ot([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(r=>Je(r.type))||(a.endMarkers=ot([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=Ha(e.segments))}function fp(e,t,a,r){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((s,n)=>{const i=r==="start"&&t===0&&s.type==="start",o=e.filter(m=>Je(m.type)).length,c=r==="end"&&t===a-1&&Je(s.type)&&o===1,l=!(i||c);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${r}" data-marker-index="${n}">${rp(s.type,r,t,a)}</select>
        <input type="text" value="${S(s.name??"")}" data-field="markerName" data-marker-scope="${r}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${r}" data-marker-index="${n}">${sp(s.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${r}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function Di(e,t,a,r){const s=r==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${fp(e,t,a,r)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${r}" data-segment-index="${t}">${s}</button>
    </div>`}function hp(e,t,a,r,s){if(!d.stageEditorDraft)return;const n=d.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(r==="markerType"){o.type=s;const c=op(o);if(o.name=c.name,o.cat=c.cat,Je(o.type)){const l=i.filter((m,p)=>p===t||!Je(m.type));a==="start"?n.markers=l:n.endMarkers=l}}else r==="markerName"?o.name=s.trim()||null:r==="markerCat"&&(o.cat=s||null);a==="start"?n.markers=ot(n.markers):n.endMarkers=ot(n.endMarkers),Kt(d.stageEditorDraft),It(d.stageEditorDraft),be()}}function bp(e,t){if(!d.stageEditorDraft)return;const a=d.stageEditorDraft.segments[e];if(!a)return;const r=t==="start"?e===0&&!a.markers.some(s=>s.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===d.stageEditorDraft.segments.length-1&&!a.endMarkers.some(s=>Je(s.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(r),a.markers=ot(a.markers)):(a.endMarkers.push(r),a.endMarkers=ot(a.endMarkers)),Kt(d.stageEditorDraft),It(d.stageEditorDraft),be()}function yp(e,t,a){if(!d.stageEditorDraft)return;const r=d.stageEditorDraft.segments[e];r&&(a==="start"?r.markers.splice(t,1):r.endMarkers.splice(t,1),Kt(d.stageEditorDraft),It(d.stageEditorDraft),be())}let da=0,ca=0;async function vp(){v("stage-editor-profile").innerHTML=un("Flat"),v("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',v("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([Z.listStageEditorCountries(),Z.listStageEditorRaceCategories(),Z.listStageEditorRacePrograms(),fn()]);if(e.success&&e.data){const r=v("stage-editor-race-country");r.innerHTML=e.data.map(s=>`<option value="${s.id}">${S(s.name)} (${S(s.code3)})</option>`).join("")}if(t.success&&t.data){const r=v("stage-editor-race-category");r.innerHTML=t.data.map(s=>`<option value="${s.id}">${S(s.name)}</option>`).join("")}a.success&&a.data&&(d.stageEditorPrograms=a.data,Sp())}function Sp(){const e=v("stage-editor-programs-list");d.stageEditorPrograms&&(e.innerHTML=d.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${S(t.name)}</span>
      </label>
    `).join(""))}function kp(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=v("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(r=>{var n;const s=(n=d.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===r.value);return s?s.name:r.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function $p(e,t){var r;let a=0;for(let s=0;s<t;s+=1)a+=((r=e.segments[s])==null?void 0:r.lengthKm)??0;return Oe(a)}function pn(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function gl(){const e=d.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function xp(){const e=[...d.stageEditorExistingStages.map(t=>t.raceId),...d.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function Tp(e,t){let a=e;const r=new Set(d.stageEditorExistingStages.map(s=>s.stageId));for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function wp(e,t){let a=e;const r=new Set([...d.stageEditorExistingStages.map(s=>s.raceId),...d.races.map(s=>s.id)]);for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function sa(){const e=v("stage-editor-date");if(!e)return;const t=e.value.trim();if(!/^\d{4}-\d{2}-\d{2}$/.test(t))return;const a=document.getElementById("stage-editor-new-race-checkbox");if(!a||!a.checked)return;const r=document.getElementById("stage-editor-race-is-stage-race");if(!r)return;const s=Number(r.value)===1,n=v("stage-editor-race-start-date"),i=v("stage-editor-race-end-date");if(!(!n||!i))if(!s)n.value=t,i.value=t;else{n.value=t;const o=document.getElementById("stage-editor-race-num-stages"),c=o&&Number(o.value)||1,[l,m,p]=t.split("-").map(Number),u=new Date(l,m-1,p);let f=0;c===21?f=2:c>=14&&(f=1);const g=c+f;u.setDate(u.getDate()+g-1);const h=u.getFullYear(),b=String(u.getMonth()+1).padStart(2,"0"),y=String(u.getDate()).padStart(2,"0");i.value=`${h}-${b}-${y}`}}function Mp(e){var o;const t=v("stage-editor-profile");t.innerHTML=un(e.suggestedProfile),t.value=e.suggestedProfile;const a=gl(),r=xp();v("stage-editor-stage-id").value=String(a),v("stage-editor-race-id").value=String(r),da=a,ca=r;const s=v("stage-editor-details-file");s.value.trim()||(s.value=`${tp(e.routeName)}.csv`);const n=v("stage-editor-date");!n.value&&((o=d.gameState)!=null&&o.currentDate)&&(n.value=d.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(c=>{c.checked=!0}),sa()}function Rp(e){v("stage-editor-stage-id").value=String(e.stageId),v("stage-editor-race-id").value=String(e.raceId),da=e.stageId,ca=e.raceId,v("stage-editor-stage-number").value=String(e.stageNumber),v("stage-editor-date").value=e.date,v("stage-editor-details-file").value=e.detailsCsvFile;const t=v("stage-editor-profile");t.innerHTML=un(e.profile),t.value=e.profile,v("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),v("stage-editor-final-push-start").value=String(e.finalPushStartPercent),v("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),v("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),v("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(s=>s.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(s=>{s.checked=a.includes(s.value)}),sa()}function fl(e){var r;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((r=e.segments[0])!=null&&r.markers.some(s=>s.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(s=>Je(s.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((s,n)=>{mn(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...s.markers??[],...s.endMarkers??[]].forEach(i=>{i.cat!=null&&!ul.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function hl(){const e=[],t=Number(v("stage-editor-stage-id").value),a=Number(v("stage-editor-race-id").value),r=Number(v("stage-editor-stage-number").value),s=v("stage-editor-date").value.trim(),n=v("stage-editor-details-file").value.trim(),i=Number(v("stage-editor-final-spread-start").value),o=Number(v("stage-editor-final-push-start").value),c=Number(v("stage-editor-final-spread-difficulty").value),l=Number(v("stage-editor-crash-multiplier").value),m=Number(v("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(r)||r<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(s)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(c)||c<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(m)||m<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),d.stageEditorExistingStages.map(b=>b.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const f=v("stage-editor-new-race-checkbox").checked,g=[...d.stageEditorExistingStages.map(b=>b.raceId),...d.races.map(b=>b.id)];if(f){g.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const b=v("stage-editor-race-name").value.trim(),y=Number(v("stage-editor-race-country").value),k=Number(v("stage-editor-race-category").value),T=Number(v("stage-editor-race-num-stages").value),x=v("stage-editor-race-start-date").value.trim(),$=v("stage-editor-race-end-date").value.trim(),D=Number(v("stage-editor-race-prestige").value);b||e.push("Rennname fehlt."),(!Number.isInteger(y)||y<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger(k)||k<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(T)||T<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(x)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test($)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(D)||D<1||D>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else g.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return v("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function Ip(){var a,r;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(s=>s.value).join("|");return{stageId:Number(v("stage-editor-stage-id").value),raceId:Number(v("stage-editor-race-id").value),stageNumber:Number(v("stage-editor-stage-number").value),date:v("stage-editor-date").value.trim(),profile:v("stage-editor-profile").value,detailsCsvFile:v("stage-editor-details-file").value.trim(),startElevation:((r=(a=d.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:r.startElevation)??0,finalSpreadStartPercent:Number(v("stage-editor-final-spread-start").value),finalPushStartPercent:Number(v("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(v("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(v("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(v("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function Cp(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function Fp(e){return["gainMeters","elevationAtTop","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function ss(e,t,a){const s=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-s*118),i=54,o=.14+s*.12,c=.26+s*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${c};`}">${Math.round(e)}</span>`}function gn(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),r=Math.round(40-t*22),s=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${s};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function Ep(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function Pp(e,t,a,r){const s=r!=null?` data-stage-profile-open-climb-id="${S(r)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${s}>${e}</button>`}function Np(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",r=e.profileScore??e.score,s=[...d.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=s.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span class="text-right">${gn(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${ss(r,0,100)}
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
    </div>`}function Lp(e){const t=s=>s!=null?`${s.toFixed(1).replace(".",",")} km`:"—",a=s=>s!=null?`${Math.round(s).toLocaleString("de-DE")} m`:"—",r=s=>s!=null?`${s.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${gn(e.climbScore??0)}
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
    </div>`}function bl(e,t,a,r,s,n,i,o){const c=o??ss(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${Pp(c,r,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${s}
      </div>
    </div>`}function pe(e,t,a,r,s){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?r==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${s}-sort="${t}">
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function Ma(){const e=v("stage-editor-stages-table"),t=v("stage-editor-stages-empty"),a=v("stage-editor-stages-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=d.stageEditorStagesSort.key,i=d.stageEditorStagesSort.direction;r&&(r.innerHTML=`<tr>
      ${pe("ID","stageId",n,i,"stages")}
      ${pe("Land","countryCode",n,i,"stages")}
      ${pe("Rennen","raceName",n,i,"stages")}
      ${pe("Etappe","stageNumber",n,i,"stages")}
      ${pe("Score","profileScore",n,i,"stages")}
      ${pe("Profil","profile",n,i,"stages")}
      ${pe("Distanz","distanceKm",n,i,"stages")}
      ${pe("Höhenmeter","elevationGainMeters",n,i,"stages")}
      ${pe("Sprints","sprintCount",n,i,"stages")}
      ${pe("Climbs","climbCount",n,i,"stages")}
    </tr>`);const o=Dp(d.stageEditorStageRows);s.innerHTML=o.map(c=>`
    <tr>
      <td>${c.stageId}</td>
      <td>${ce(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(qa({stageNumber:c.stageNumber}))}</strong></td>
      <td>${bl(c.profileScore,0,100,c.stageId,Np(c),ds({name:c.raceName},{stageNumber:c.stageNumber,profile:c.profile}))}</td>
      <td>${Xa(c.profile)}</td>
      <td>${Dt(c.distanceKm)}</td>
      <td>${ml(c.elevationGainMeters)}</td>
      <td>${c.sprintCount} Sprints</td>
      <td>${c.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${d.stageEditorStageRows.length} vorhandene Etappen`}function Ra(){const e=v("stage-editor-climbs-table"),t=v("stage-editor-climbs-empty"),a=v("stage-editor-climbs-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=d.stageEditorClimbsSort.key,i=d.stageEditorClimbsSort.direction;r&&(r.innerHTML=`<tr>
      ${pe("km","placementKm",n,i,"climbs")}
      ${pe("Name","name",n,i,"climbs")}
      ${pe("Kat.","category",n,i,"climbs")}
      ${pe("Score","climbScore",n,i,"climbs")}
      ${pe("Land","countryCode",n,i,"climbs")}
      ${pe("Rennen","raceName",n,i,"climbs")}
      ${pe("Etappe","stageNumber",n,i,"climbs")}
      ${pe("Höhenmeter","gainMeters",n,i,"climbs")}
      ${pe("Höhe (Top)","elevationAtTop",n,i,"climbs")}
      ${pe("Distanz","distanceKm",n,i,"climbs")}
      ${pe("Ø Steigung","avgGradient",n,i,"climbs")}
      ${pe("Max Steigung","maxGradient",n,i,"climbs")}
    </tr>`);const o=_p(d.stageEditorClimbRows);s.innerHTML=o.map(c=>`
    <tr>
      <td>${c.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${S(c.name)}</strong></td>
      <td>${Ep(c.category)}</td>
      <td>${bl(c.climbScore,0,350,c.stageId,Lp(c),ds({name:c.raceName},{stageNumber:c.stageNumber,profile:"Mountain"}),c.id,gn(c.climbScore))}</td>
      <td>${ce(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(qa({stageNumber:c.stageNumber}))}</strong></td>
      <td>${ml(c.gainMeters)}</td>
      <td>${Math.round(c.elevationAtTop).toLocaleString("de-DE")} m</td>
      <td>${Dt(c.distanceKm)}</td>
      <td>${c.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${c.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${d.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function yl(e=!1){if(d.stageEditorOverviewLoaded&&!e){Ma(),Ra();return}d.stageEditorOverviewLoading=!0,Ma(),Ra();const t=await Z.getStageEditorOverview();if(d.stageEditorOverviewLoading=!1,d.stageEditorOverviewLoaded=!0,!t.success||!t.data){d.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),Ma(),Ra();return}d.stageEditorStageRows=t.data.stages,d.stageEditorClimbRows=t.data.climbs,Ma(),Ra()}async function fn(e=!1){const t=v("stage-editor-existing-stage-wrap");if(d.stageEditorExistingStagesLoaded&&!e){Ds();return}t.classList.add("loading");const a=v("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const r=await Z.listStageEditorStages();if(t.classList.remove("loading"),d.stageEditorExistingStagesLoaded=!0,!r.success||!r.data){d.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}d.stageEditorExistingStages=r.data.stages,Ds()}function Ds(){const e=v("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+d.stageEditorExistingStages.map(a=>{const r=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${S(a.raceName)} · Etappe ${a.stageNumber}${r}</option>`}).join("")}function Dp(e){const t=d.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(d.stageEditorStagesSort.key){case"stageId":s=a.stageId-r.stageId;break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"profile":s=a.profile.localeCompare(r.profile,"de");break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"elevationGainMeters":s=a.elevationGainMeters-r.elevationGainMeters;break;case"sprintCount":s=a.sprintCount-r.sprintCount;break;case"climbCount":s=a.climbCount-r.climbCount;break;case"profileScore":s=a.profileScore-r.profileScore;break}return s*t||a.stageId-r.stageId})}function _p(e){const t=d.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(d.stageEditorClimbsSort.key){case"placementKm":s=a.placementKm-r.placementKm;break;case"name":s=a.name.localeCompare(r.name,"de");break;case"category":s=(a.category??"").localeCompare(r.category??"","de");break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"gainMeters":s=a.gainMeters-r.gainMeters;break;case"elevationAtTop":s=a.elevationAtTop-r.elevationAtTop;break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"avgGradient":s=a.avgGradient-r.avgGradient;break;case"maxGradient":s=a.maxGradient-r.maxGradient;break;case"climbScore":s=a.climbScore-r.climbScore;break}return s*t||a.placementKm-r.placementKm})}function Ap(e){return e.map(t=>t.type).join(" | ")}function Bp(e){const t=[],a=[];let r=0;return e.segments.forEach((s,n)=>{const i=r,o=Oe(i+s.lengthKm),c=pn(s);s.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:s.startElevation})}),s.endMarkers.forEach(l=>{if(rs(l.type,l.cat)&&l.name){let m=-1;for(let p=a.length-1;p>=0;p--)if(a[p].name===l.name){m=p;break}if(m>=0){const p=a[m];a.splice(m,1);const u=Oe(o-p.startKm),f=Math.max(0,c-p.startElevation),g=u>0?Za(f/(u*10)):0;t.push({name:l.name,startKm:p.startKm,endKm:o,distanceKm:u,gainMeters:f,avgGradient:g,category:l.cat||"4"})}}}),r=o}),t}function Hp(e){const t=[];let a=0;return e.segments.forEach(r=>{const s=Oe(a+r.lengthKm);r.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:s})}),a=s}),t}function zp(e){const t=new Set,a=[];let r=0;return e.segments.forEach((s,n)=>{const o=Oe(r+s.lengthKm);s.markers.forEach(c=>{c.type==="climb_start"&&c.name&&a.push({name:c.name,segmentIndex:n})}),a.length>0&&t.add(n),s.endMarkers.forEach(c=>{if(rs(c.type,c.cat)&&c.name){let l=-1;for(let m=a.length-1;m>=0;m--)if(a[m].name===c.name){l=m;break}l>=0&&a.splice(l,1)}}),r=o}),t}function Gp(e,t,a){const r=e.segments[t];if(!r||a.has(t)||r.markers.length>0||r.endMarkers.length>0)return!1;const s=r.terrain==="Flat"&&r.gradientPercent>=-3&&r.gradientPercent<=1.5,n=r.terrain==="Abfahrt"&&r.gradientPercent<=-3;return s||n}function be(){Ds();const e=d.stageEditorDraft,t=v("stage-editor-import-summary"),a=v("stage-editor-warnings"),r=v("stage-editor-climbs"),s=v("stage-editor-empty"),n=v("stage-editor-chart"),i=v("stage-editor-waypoints-body"),o=v("stage-editor-export-hint"),c=v("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",r.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',s.classList.remove("hidden"),n.innerHTML=_i(null),i.innerHTML=`<tr><td colspan="${Om}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",c.disabled=!0;return}s.classList.add("hidden");const l=fl(e),m=hl(),p=document.getElementById("stage-editor-profile"),u=p&&p.value?p.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${S(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${Dt(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${S(u)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const f=[...e.warnings,...l,...m];a.innerHTML=f.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':f.map(T=>`<div class="stage-editor-alert">${S(T)}</div>`).join("");const g=Bp(e),h=Hp(e);let b="";g.length>0?b+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (${g.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${g.map(T=>`
          <div class="stage-editor-climb" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="color: #fff; font-size: 0.85rem;">${S(T.name)}</strong>
              <span class="stage-editor-climb-category-badge ${T.category==="HC"?"is-hc":`is-cat-${T.category}`}" style="font-size: 0.7rem; padding: 0.1rem 0.35rem;">
                Kat. ${S(T.category)}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-300); display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span>${Dt(T.startKm)} - ${Dt(T.endKm)}</span>
              <span>·</span>
              <span><strong>${T.distanceKm.toFixed(1).replace(".",",")} km</strong></span>
              <span>·</span>
              <span><strong>${T.gainMeters} hm</strong></span>
              <span>·</span>
              <span><strong>${T.avgGradient.toFixed(1).replace(".",",")}%</strong></span>
            </div>
          </div>
        `).join("")}
      </div>
    `:b+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Bergwertungen definiert (climb_start und climb_top Marker mit gleichem Namen paaren).</p>
    `,h.length>0?b+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (${h.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${h.map(T=>`
          <div class="stage-editor-sprint" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--success); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.85rem;">${S(T.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-300); font-weight: bold;">
              ${Dt(T.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:b+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `;const y=v("stage-editor-hide-boring-segments-checkbox");y&&(y.checked=d.stageEditorHideBoringSegments),r.innerHTML=b,n.innerHTML=_i(e);const k=zp(e);i.innerHTML=e.segments.map((T,x)=>{const $=d.stageEditorHideBoringSegments&&Gp(e,x,k);return`
    <tr data-segment-index="${x}" class="${mn(e,x).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;${$?" display: none;":""}">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${x+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${T.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${np(T.lengthKm<Gr)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${T.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${ap(T.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${Di(T.markers,x,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${Di(T.endMarkers,x,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div style="display: flex; flex-direction: column; min-width: 3.5rem; justify-content: center; line-height: 1.2;">
            <span class="text-muted" style="font-size: 0.85rem;">${pn(T)} m</span>
            <span style="font-size: 0.7rem; color: #888; font-weight: normal;">${Dt($p(e,x)+T.lengthKm)}</span>
          </div>
          ${Kp(e,x)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${x}">+</button>
          ${x===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${x}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${x}">✕</button>`:""}
        </div>
      </td>
    </tr>`}).join(""),c.disabled=f.length>0,o.textContent=f.length>0?`${f.length} Validierungshinweise vor dem Export.`:`Exportiert ${v("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function Kp(e,t){const a=mn(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(r=>`<div>${S(r)}</div>`).join("")}</div>`}function _i(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,r=24,s=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(g=>g.elevation)),c=Math.max(...n.map(g=>g.elevation)),l=Math.max(1,c-o),m=n.map(g=>{const h=r+g.kmMark/Math.max(i,.1)*(t-r*2),b=a-s-(g.elevation-o)/l*(a-s*2);return{x:h,y:b,waypoint:g}}),p=m.map((g,h)=>`${h===0?"M":"L"} ${g.x.toFixed(1)} ${g.y.toFixed(1)}`).join(" "),u=`${p} L ${(t-r).toFixed(1)} ${(a-s).toFixed(1)} L ${r.toFixed(1)} ${(a-s).toFixed(1)} Z`,f=m.filter(g=>g.waypoint.markers.length>0).map(g=>`
      <line x1="${g.x.toFixed(1)}" y1="${s}" x2="${g.x.toFixed(1)}" y2="${(a-s).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${g.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${S(Ap(g.waypoint.markers))}</text>`).join("");return`
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
      <path d="${p}" class="stage-editor-chart-line"></path>
      ${m.map(g=>`<circle cx="${g.x.toFixed(1)}" cy="${g.y.toFixed(1)}" r="3.5" class="stage-editor-chart-point"></circle>`).join("")}
      <text x="${r}" y="${s-4}" class="stage-editor-chart-scale">${Math.round(c)} m</text>
      <text x="${r}" y="${a-4}" class="stage-editor-chart-scale">${Math.round(o)} m</text>
      <text x="${t-r}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${Dt(i)}</text>
    </svg>`}function Op(e,t,a){const r=d.stageEditorDraft;if(!r)return;const s=r.segments[e];s&&(t==="startElevation"?s.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?s.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?s.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(s.terrain=a,s.manualTerrain=!0):t==="techLevel"?s.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(s.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),Kt(r),It(r),be())}function jp(e){const t=d.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const r={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,r),Kt(t),It(t),be()}function Wp(){const e=d.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],r={startElevation:t?pn(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(r),Kt(e),It(e),be()}function Vp(e){const t=d.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),Kt(t),It(t),be()))}async function Up(){var a;const t=(a=v("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}v("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,Fe("Route wird importiert……");try{const r=await t.text(),s=await Z.importStageRoute({fileName:t.name,fileContent:r});if(!s.success||!s.data){alert(`Import fehlgeschlagen: ${s.error??"Unbekannter Fehler"}`);return}const n=pl(s.data);d.stageEditorDraft=n,It(n),Mp(n),be(),zt("stage-editor")}finally{ke()}}async function Yp(){const e=Number(v("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}Fe("CSV-Stage wird geladen...");try{const t=await Z.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=pl(t.data.draft);d.stageEditorDraft=a,It(a),Rp(t.data.metadata),be(),zt("stage-editor")}finally{ke()}}async function Zp(){if(!d.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...fl(d.stageEditorDraft),...hl()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),be();return}const t=v("stage-editor-new-race-checkbox").checked,a=v("stage-editor-program-checkbox").checked;let r;t&&(r={name:v("stage-editor-race-name").value.trim(),countryId:Number(v("stage-editor-race-country").value),categoryId:Number(v("stage-editor-race-category").value),isStageRace:Number(v("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(v("stage-editor-race-num-stages").value),startDate:v("stage-editor-race-start-date").value.trim(),endDate:v("stage-editor-race-end-date").value.trim(),prestige:Number(v("stage-editor-race-prestige").value)});let s;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');s=Array.from(n).map(i=>Number(i.value))}Fe("CSV-Dateien werden erstellt……");try{const n=await Z.exportStageRoute({metadata:Ip(),draft:d.stageEditorDraft,newRace:t,raceDetails:r,updatePrograms:a,programIds:s});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}Lr(n.data.stagesFileName,n.data.stagesCsv),Lr(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=v("stage-editor-stage-number"),o=Number(i.value)||1;i.value=String(o+1);const c=v("stage-editor-date"),l=c.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(l)){const b=new Date(l);b.setDate(b.getDate()+1);const y=b.getFullYear(),k=String(b.getMonth()+1).padStart(2,"0"),T=String(b.getDate()).padStart(2,"0");c.value=`${y}-${k}-${T}`}await Promise.all([yl(!0),fn(!0)]);const m=gl();v("stage-editor-stage-id").value=String(m),da=m;const p=v("stage-editor-new-race-checkbox");p&&(p.checked=!1);const u=v("stage-editor-new-race-details");u&&(u.classList.add("hidden"),u.style.display="none");const f=v("stage-editor-program-checkbox");f&&(f.checked=!1);const g=v("stage-editor-program-details");g&&(g.classList.add("hidden"),g.style.display="none"),ca=Number(v("stage-editor-race-id").value),be()}finally{ke()}}function Jp(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",M=>{const R=M.target.closest("button[data-stage-profile-open-stage-id]");if(R){const N=Number(R.dataset.stageProfileOpenStageId);Number.isFinite(N)&&Ur(N);return}const _=M.target.closest("button[data-stage-editor-stages-sort]");if(!_)return;const F=_.dataset.stageEditorStagesSort;d.stageEditorStagesSort.key===F?d.stageEditorStagesSort.direction=d.stageEditorStagesSort.direction==="asc"?"desc":"asc":d.stageEditorStagesSort={key:F,direction:Cp(F)},Ma()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",M=>{const R=M.target.closest("button[data-stage-profile-open-stage-id]");if(R){const N=Number(R.dataset.stageProfileOpenStageId),H=R.dataset.stageProfileOpenClimbId??null;if(Number.isFinite(N)){let z=null;H&&d.stageEditorClimbRows&&(z=d.stageEditorClimbRows.find(I=>I.id===H)??null),Ur(N,z)}return}const _=M.target.closest("button[data-stage-editor-climbs-sort]");if(!_)return;const F=_.dataset.stageEditorClimbsSort;d.stageEditorClimbsSort.key===F?d.stageEditorClimbsSort.direction=d.stageEditorClimbsSort.direction==="asc"?"desc":"asc":d.stageEditorClimbsSort={key:F,direction:Fp(F)},Ra()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{Up()});const r=document.getElementById("btn-stage-editor-load-existing");r&&r.addEventListener("click",()=>{Yp()});const s=document.getElementById("btn-stage-editor-export");s&&s.addEventListener("click",()=>{Zp()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",M=>{var _;const R=((_=M.target.files)==null?void 0:_[0])??null;v("stage-editor-file-hint").textContent=R?`${R.name} · ${(R.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",M=>{const R=M.target,_=R.closest("tr[data-segment-index]"),F=R.dataset.field;if(!_||!F)return;const N=Number(_.dataset.segmentIndex);if(Number.isInteger(N)){if(F==="markerType"||F==="markerName"||F==="markerCat"){const H=Number(R.dataset.markerIndex),z=R.dataset.markerScope;if(!Number.isInteger(H)||z!=="start"&&z!=="end")return;hp(N,H,z,F,R.value);return}Op(N,F,R.value)}}),i.addEventListener("click",M=>{const R=M.target.closest("button[data-segment-action]");if(!R)return;const _=Number(R.dataset.segmentIndex);if(Number.isInteger(_)){if(R.dataset.segmentAction==="insert"){jp(_);return}if(R.dataset.segmentAction==="append"){Wp();return}if(R.dataset.segmentAction==="add-marker"){const F=R.dataset.markerScope;if(F!=="start"&&F!=="end")return;bp(_,F);return}if(R.dataset.segmentAction==="remove-marker"){const F=Number(R.dataset.markerIndex),N=R.dataset.markerScope;if(!Number.isInteger(F)||N!=="start"&&N!=="end")return;yp(_,F,N);return}R.dataset.segmentAction==="delete"&&Vp(_)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(M=>{const R=document.getElementById(M);R&&R.addEventListener("change",()=>{M==="stage-editor-date"&&sa(),be()})}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(M=>{M.addEventListener("change",()=>be())});const c=v("stage-editor-new-race-checkbox"),l=v("stage-editor-new-race-details"),m=v("stage-editor-program-checkbox"),p=v("stage-editor-program-details");c&&c.addEventListener("change",()=>{c.checked?(l&&(l.classList.remove("hidden"),l.style.display="grid"),m&&(m.checked=!0,p&&(p.classList.remove("hidden"),p.style.display="block")),sa()):l&&(l.classList.add("hidden"),l.style.display="none"),be()});const u=document.getElementById("stage-editor-race-is-stage-race");u&&u.addEventListener("change",()=>{sa()});const f=document.getElementById("stage-editor-race-num-stages");f&&f.addEventListener("input",()=>{sa()});const g=document.getElementById("stage-editor-race-start-date");g&&g.addEventListener("change",()=>{const M=g.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(M)){const R=document.getElementById("stage-editor-race-is-stage-race"),_=R?Number(R.value)===1:!1,F=v("stage-editor-race-end-date");if(F)if(!_)F.value=M;else{const N=document.getElementById("stage-editor-race-num-stages"),H=N&&Number(N.value)||1,[z,I,G]=M.split("-").map(Number),U=new Date(z,I-1,G);let K=0;H===21?K=2:H>=14&&(K=1);const q=H+K;U.setDate(U.getDate()+q-1);const Q=U.getFullYear(),se=String(U.getMonth()+1).padStart(2,"0"),V=String(U.getDate()).padStart(2,"0");F.value=`${Q}-${se}-${V}`}}}),m&&m.addEventListener("change",()=>{m.checked?p&&(p.classList.remove("hidden"),p.style.display="block"):p&&(p.classList.add("hidden"),p.style.display="none"),be()});const h=v("stage-editor-programs-dropdown-trigger"),b=v("stage-editor-programs-dropdown-menu"),y=v("btn-stage-editor-programs-ok");h&&b&&(h.addEventListener("click",M=>{M.stopPropagation();const R=b.style.display==="none"||!b.style.display;b.style.display=R?"flex":"none"}),y&&y.addEventListener("click",M=>{M.stopPropagation(),b.style.display="none",be()}),document.addEventListener("click",M=>{const R=M.target;b.style.display==="flex"&&!b.contains(R)&&R!==h&&!h.contains(R)&&(b.style.display="none",be())}));const k=v("stage-editor-programs-list");k&&k.addEventListener("change",M=>{M.target.name==="stage-editor-program-selection"&&kp()});let T=!1,x=null;const $=v("stage-editor-stage-id"),D=v("stage-editor-race-id");if($&&D){[$,D].forEach(R=>{R.addEventListener("keydown",_=>{_.key==="ArrowUp"||_.key==="ArrowDown"?(T=!1,x&&clearTimeout(x)):(T=!0,x&&clearTimeout(x))}),R.addEventListener("keyup",_=>{_.key!=="ArrowUp"&&_.key!=="ArrowDown"&&(x&&clearTimeout(x),x=setTimeout(()=>{T=!1},150))}),R.addEventListener("mousedown",()=>{T=!1}),R.addEventListener("blur",()=>{T=!1})});const M=(R,_)=>{const F=Number(R.value);if(!Number.isInteger(F)||F<=0){_==="stage"?da=F:ca=F;return}const H=F-(_==="stage"?da:ca);if(!T&&(H===1||H===-1)){let z=F;_==="stage"?z=Tp(F,H):v("stage-editor-new-race-checkbox").checked&&(z=wp(F,H)),R.value=String(z)}_==="stage"?da=Number(R.value):ca=Number(R.value)};$.addEventListener("input",()=>{M($,"stage"),be()}),D.addEventListener("input",()=>{M(D,"race"),be()})}const E=v("stage-editor-hide-boring-segments-checkbox");E&&E.addEventListener("change",()=>{d.stageEditorHideBoringSegments=E.checked,be()})}let xt=[],na=null,Ze={form:!0,combinedFatigue:!0,shortFatigue:!1,longFatigue:!1};const Qt=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"],Ai={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}},Bi={1:"Sonnig",2:"Extreme Hitze",3:"Leichter Regen",4:"Starkregen",5:"Starker Wind",6:"Dichter Nebel",7:"Schnee/Eis"};function za(e,t){if(e==null)return"";const a=t?S(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const oe={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function jr(e,t,a){const r=lt(e??null);return`<span class="badge badge-race-category" style="${Wa(r)}; white-space: nowrap; display: inline-block;">${S(e??"Unbekannt")}</span>`}function hn(e){if(!e)return"-";const t=lt(e);return`<span class="badge badge-race-category" style="${Wa(t)}; white-space: nowrap; display: inline-block;">${S(e)}</span>`}function qp(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function Xp(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${qp(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function ge(e,t,a,r,s,n,i){const o=t?`background: ${a}; border: 1px solid transparent; color: ${r}; box-shadow: 0 0 8px ${s}; font-weight: 700;`:"background: var(--bg-800); border: 1px solid var(--border); color: var(--text-300);";return`
    <button type="button"
      class="results-type-btn"
      ${n}="${S(i)}"
      style="width: 120px; height: 24px; padding: 0; font-size: 0.8rem; font-weight: ${t?"700":"500"}; line-height: 22px; text-align: center; border-radius: 999px; transition: all 0.15s ease; cursor: pointer; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ${o}"
      onmouseenter="if(!${t}) this.style.borderColor='${s}'"
      onmouseleave="if(!${t}) this.style.borderColor='var(--border)'"
    >${S(e)}</button>
  `}function bn(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";case"breakaway_final":return"is-breakaway";default:return""}}function ns(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";case"breakaway_final":return"Ausreißer";default:return"Etappe"}}function Qp(e){return`<span class="rider-stats-final-type ${bn(e)}">${S(ns(e))}</span>`}function fe(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?r+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?r+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?r+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?r+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?r+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(r+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function Le(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?r+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?r+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?r+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?r+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?r+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?r+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(r+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function eg(e){return`${e.startDate===e.endDate?de(e.startDate):`${de(e.startDate)} - ${de(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function Wr(e){if(e==null||d.riders.length===0)return null;const a=[...d.riders].sort((r,s)=>(s.seasonPoints??0)-(r.seasonPoints??0)||(s.seasonWins??0)-(r.seasonWins??0)||s.overallRating-r.overallRating||`${r.lastName} ${r.firstName}`.localeCompare(`${s.lastName} ${s.firstName}`,"de")||r.id-s.id).findIndex(r=>r.id===e);return a>=0?a+1:null}function Hi(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;case"breakaway_final":return 4;default:return 5}}function tg(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||Hi(t.rowType)-Hi(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function ag(e){return[...e].map(t=>({...t,rows:tg(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function vl(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(50,Math.min(85,e));for(let c=1;c<t.length;c++){const l=t[c-1],m=t[c];if(s<=m.score){const p=(s-l.score)/(m.score-l.score);a=Math.round(l.hue+(m.hue-l.hue)*p),r=Math.round(l.lightness+(m.lightness-l.lightness)*p);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function Ft(e,t,a,r){const s=r>0?Math.max(0,Math.min(1,a/r)):.5,n=Math.round(6+s*118),i=.26+s*.18,o=.14+s*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${S(t)}">${e} ${a}</span>`}function Ss(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";case"Flat":return"Flachlandspezialist";default:return e}return e.name}function ks(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return oe.mountain;case"Hill":return oe.hilly;case"Sprint":return oe.sprint;case"Timetrial":return oe.timetrial;case"Cobble":return oe.cobble;case"Attacker":return oe.attacker;case"Flat":return oe.flat;default:return""}}function Xe(e,t,a,r,s){var L,J,j;const n=(t==null?void 0:t.countryCode)??r??null,i=n?ce(n):s,o=(t==null?void 0:t.roleName)??((L=e==null?void 0:e.role)==null?void 0:L.name)??"Ohne Rolle",c=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,m=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",p=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",u=((J=t==null?void 0:t.program)==null?void 0:J.name)??((j=e==null?void 0:e.seasonProgram)==null?void 0:j.name)??"-",f=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,g=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,h=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0;(t==null?void 0:t.rolling30dRaceDays)??(e==null||e.rolling30dRaceDays);const b=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,y=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,k=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",T=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,x=(t==null?void 0:t.currentSeasonRank)??Wr((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),$=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,D=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,E=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,M=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},R=Math.max(M.flat,M.hilly,M.mediumMountain,M.mountain,M.timetrial,M.cobble),_=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},F=Math.max(_.stageRace,_.oneDay),N=e!=null&&e.specialization1?Ss(e.specialization1):"-",H=e!=null&&e.specialization2?Ss(e.specialization2):"-",z=e!=null&&e.specialization3?Ss(e.specialization3):"-",I=ks((e==null?void 0:e.specialization1)??null),G=ks((e==null?void 0:e.specialization2)??null),U=ks((e==null?void 0:e.specialization3)??null),K=(e==null?void 0:e.weatherProfileId)??(t==null?void 0:t.weatherProfileId)??1,q=Ai[K]||Ai[1],Q=q.pref[0],se=q.pref[1],V=Bi[Q],P=Bi[se];let A="";return t!=null&&t.lieutenantInfo?A=`
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.lieutenantInfo.name)}</a></span></span>
    `:t!=null&&t.leaderInfo&&(A=`
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.leaderInfo.name)}</a></span></span>
    `),`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${S(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?Mt(l,m):""} <span>${S(m)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${S(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${an(p)} <span>Form</span></span>
        ${A}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${vl(c)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${oe.seasonForm} ${f>=0?"+":""}${f}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${oe.raceForm} ${g>=0?"+":""}${g}</span>
        <span class="rider-stats-icon-pill" title="Programm">${S(u)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${oe.raceDays} <span class="rider-stats-icon-pill-value">${h}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${oe.longFatigue} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${k!=="none"?"text-error":""}" title="Kurzzeitfatigue">${oe.shortFatigue} <span class="rider-stats-icon-pill-value">${y}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${oe.seasonPoints} <span class="rider-stats-icon-pill-value">${T}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${oe.rank} <span class="rider-stats-icon-pill-value">${Xp(x)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${oe.raceDays} <span class="rider-stats-icon-pill-value">${$}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${oe.wins} <span class="rider-stats-icon-pill-value">${D}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${I} ${S(N)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${G} ${S(H)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${U} ${S(z)}</span>
        <span class="rider-stats-icon-pill" title="Wetterpräferenzen" style="display: inline-flex; align-items: center; gap: 4px; padding: 0.2rem 0.6rem;">🌤️ ${za(Q,V)} ${za(se,P)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${Ft(oe.stageRace,"Rundfahrten Punkte",_.stageRace,F)}
        ${Ft(oe.oneDay,"Eintagesrennen Punkte",_.oneDay,F)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${oe.breakaway} <span class="rider-stats-icon-pill-value">${E}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${Ft(oe.flat,"Flach-Punkte",M.flat,R)}
        ${Ft(oe.hilly,"Hügel-Punkte",M.hilly,R)}
        ${Ft(oe.mediumMountain,"Mittelgebirge-Punkte",M.mediumMountain,R)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${Ft(oe.mountain,"Hochgebirge-Punkte",M.mountain,R)}
        ${Ft(oe.timetrial,"Zeitfahren-Punkte",M.timetrial,R)}
        ${Ft(oe.cobble,"Kopfsteinpflaster-Punkte",M.cobble,R)}
      </div>
    </div>
  `}function zi(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",r=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${S(a)} <strong>${S(r)}</strong>`}function Qe(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${d.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${d.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${d.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${d.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${d.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${d.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${d.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-rider-stats-tab="contracts" aria-selected="${d.riderStatsTab==="contracts"?"true":"false"}">Verträge</button>
    </div>`}function rg(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(55,Math.min(80,e));for(let c=1;c<t.length;c++){const l=t[c-1],m=t[c];if(s<=m.score){const p=(s-l.score)/(m.score-l.score);a=Math.round(l.hue+(m.hue-l.hue)*p),r=Math.round(l.lightness+(m.lightness-l.lightness)*p);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function sg(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},r=["mountain","hill","sprint","timeTrial","cobble","attack"],s=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,c=i/2,l=160,m=60,p=85,u=p-m,f=F=>{const N=[];for(let H=0;H<6;H++){const z=H*Math.PI/3-Math.PI/2;N.push(`${o+F*Math.cos(z)},${c+F*Math.sin(z)}`)}return N},g=`
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
    </defs>`,h=`<circle cx="${o}" cy="${c}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let b="";for(let F=m;F<=p;F+=2.5){const N=l*((F-m)/u);if(N<1){b+=`<circle cx="${o}" cy="${c}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const H=f(N),z=F%5===0,I=z?1:.6,G=z?"none":"4,4",U=z?.4:.18;b+=`<polygon points="${H.join(" ")}" fill="none" stroke="rgba(255,255,255,${U})" stroke-width="${I}" stroke-dasharray="${G}" />`,z&&F>m&&(b+=`<text x="${o+5}" y="${c-N+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${F}</text>`)}let y="",k="";for(let F=0;F<6;F++){const N=F*Math.PI/3-Math.PI/2,H=o+l*Math.cos(N),z=c+l*Math.sin(N);y+=`<line x1="${o}" y1="${c}" x2="${H}" y2="${z}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const I=l+28,G=o+I*Math.cos(N),U=c+I*Math.sin(N),K=Math.cos(N);let q="middle";K>.15?q="start":K<-.15&&(q="end");const Q=a[r[F]]??m;k+=`<text x="${G}" y="${U}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${q}" dominant-baseline="middle">${s[F]}</text>`,k+=`<text x="${G}" y="${U+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${q}" dominant-baseline="middle">${Q}</text>`}const T=[],x=[];r.forEach((F,N)=>{const H=a[F]??m,z=l*((Math.max(m,Math.min(p,H))-m)/u),I=N*Math.PI/3-Math.PI/2,G=o+z*Math.cos(I),U=c+z*Math.sin(I);T.push(`${G},${U}`),x.push(`<circle cx="${G}" cy="${U}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${s[N]}: ${H}</title></circle>`)});const $=`<polygon points="${T.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,E=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((F,N)=>{const H=a[F.key]??60;return(a[N.key]??60)-H}),M=[],R=[];E.forEach((F,N)=>{const H=a[F.key]??60,z=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${F.label}</span>
        ${rg(H)}
      </div>
    `;N%2===0?M.push(z):R.push(z)});const _=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${M.join("")}</div>
      <div class="skills-col">${R.join("")}</div>
    </div>
  `;return`
    <section class="rider-stats-skills-tab" style="margin-top: 1rem;">
      <div class="rider-stats-skills-container" style="display: grid; grid-template-columns: 540px 1fr; gap: 2rem; align-items: start; background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-primary);">
        <div class="skills-radar-wrapper" style="display: flex; justify-content: center; align-items: center; background: var(--bg-900); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-primary);">
          <svg width="540" height="440" viewBox="0 0 ${n} ${i}" style="overflow: visible;">
            ${g}
            ${h}
            ${b}
            ${y}
            ${$}
            ${x.join("")}
            ${k}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${_}
        </div>
      </div>
    </section>
  `}function ng(e,t){const a=t.shortTermFatigueMalus??0,r=t.longTermFatigueDecayable??0,s=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),c=(r/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const m=t.fatigueHistory??[];let p="";return m.length===0?p='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':p=m.map(u=>{const f=de(u.date);let g="";u.type==="race"?g=`${S(u.raceName)}${u.stageNumber!=null?` - Etappe ${u.stageNumber}`:""}`:g=u.raceName?S(u.raceName):"Regeneration";const h=u.type==="race"&&u.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${u.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let b="";u.shortChange>0?b=`<span style="color: #ef4444; font-weight: 600;">+${u.shortChange.toFixed(2).replace(".",",")}</span>`:u.shortChange<0?b=`<span style="color: #2ecc71; font-weight: 600;">${u.shortChange.toFixed(2).replace(".",",")}</span>`:b='<span style="color: #666;">0,00</span>';const y=[];if(u.longDecayableChange!==0){const x=u.longDecayableChange>0?"+":"",$=u.longDecayableChange>0?"#ef4444":"#2ecc71";y.push(`<span style="color: ${$}; font-weight: 500;">${x}${u.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(u.longLockedChange!==0){const x=u.longLockedChange>0?"+":"",$=u.longLockedChange>0?"#a855f7":"#2ecc71";y.push(`<span style="color: ${$}; font-weight: 500;">${x}${u.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const k=y.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${y.join("")}</div>`:'<span style="color: #666;">0,00</span>',T=u.shortAfter+u.longAfter;return`
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${f}</td>
          <td style="color: #fff; font-weight: 600; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${g}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${h}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${b}
              <span style="font-size: 0.85rem; color: #888;">(${u.shortAfter.toFixed(2).replace(".",",")})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; justify-content: flex-end; width: 100%;">
              ${k}
              <span style="font-size: 0.85rem; color: #888;">(${u.longAfter.toFixed(2).replace(".",",")})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <strong style="color: #ef4444; font-size: 0.95rem;">-${T.toFixed(2).replace(".",",")}</strong>
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
                ${oe.shortFatigue}
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
                ${oe.longFatigue}
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
            ${p}
          </tbody>
        </table>
      </div>
    </section>
  `}function ig(e){var V;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((P,A)=>A%2===0),r=((V=d.gameState)==null?void 0:V.currentDate)??new Date().toISOString(),s=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(r).getUTCFullYear(),n=new Date(Date.UTC(s,0,1)).getTime(),i=864e5,o=1260,c=384,l=40,m=20,p=a.map(P=>{const L=(new Date(P.date).getTime()-n)/i,J=l+L/365*o,j=m+c-Math.min(8,Math.max(0,P.totalForm))/8*c;return{x:J,y:j,form:P.totalForm,date:P.date}});let u="",f="",g="";Ze.form&&p.length>0&&(u=`M ${p.map(P=>`${P.x},${P.y}`).join(" L ")}`,f=p.map(P=>`<circle cx="${P.x}" cy="${P.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${P.date}): ${P.form}</title></circle>`).join(""),g=`${u} L ${p[p.length-1].x},${m+c} L ${p[0].x},${m+c} Z`);let h="",b="";if(Ze.combinedFatigue&&p.length>0){const P=a.map(L=>{const j=(new Date(L.date).getTime()-n)/i,w=l+j/365*o,C=(L.shortFatigue??0)+(L.longFatigue??0),X=m+c-Math.min(25,Math.max(0,C))/25*c;return{x:w,y:X,val:C,date:L.date}});h=`<path d="${`M ${P.map(L=>`${L.x},${L.y}`).join(" L ")}`}" fill="none" stroke="#ef4444" stroke-width="2" />`,b=P.map(L=>`<circle cx="${L.x}" cy="${L.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${L.date}): ${L.val.toFixed(2)}</title></circle>`).join("")}let y="",k="";if(Ze.shortFatigue&&p.length>0){const P=a.map(L=>{const j=(new Date(L.date).getTime()-n)/i,w=l+j/365*o,C=L.shortFatigue??0,X=m+c-Math.min(25,Math.max(0,C))/25*c;return{x:w,y:X,val:C,date:L.date}});y=`<path d="${`M ${P.map(L=>`${L.x},${L.y}`).join(" L ")}`}" fill="none" stroke="#facc15" stroke-width="2" />`,k=P.map(L=>`<circle cx="${L.x}" cy="${L.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${L.date}): ${L.val.toFixed(2)}</title></circle>`).join("")}let T="",x="";if(Ze.longFatigue&&p.length>0){const P=a.map(L=>{const j=(new Date(L.date).getTime()-n)/i,w=l+j/365*o,C=L.longFatigue??0,X=m+c-Math.min(25,Math.max(0,C))/25*c;return{x:w,y:X,val:C,date:L.date}});T=`<path d="${`M ${P.map(L=>`${L.x},${L.y}`).join(" L ")}`}" fill="none" stroke="#a855f7" stroke-width="2" />`,x=P.map(L=>`<circle cx="${L.x}" cy="${L.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${L.date}): ${L.val.toFixed(2)}</title></circle>`).join("")}const $="rgba(251, 191, 36, 0.15)";let D="";for(let P=0;P<=8;P+=2){const A=m+c-P/8*c;D+=`<line x1="${l}" y1="${A}" x2="${l+o}" y2="${A}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,D+=`<text x="${l-5}" y="${A+4}" fill="#ffffff" font-size="10" text-anchor="end">${P}</text>`}for(let P=0;P<=25;P+=5){const A=m+c-P/25*c;D+=`<text x="${l+o+5}" y="${A+4}" fill="#ef4444" font-size="10" text-anchor="start">${P}</text>`}let E="";for(let P=0;P<=52;P+=5){const A=l+P/52*o;D+=`<line x1="${A}" y1="${m}" x2="${A}" y2="${m+c}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,E+=`<text x="${A}" y="${m+c+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${P}</text>`}let M="",R="";if(e.peakDates){const P=[...e.peakDates].sort((A,L)=>new Date(A).getTime()-new Date(L).getTime());for(let A=0;A<P.length;A++){const L=P[A],j=(new Date(L).getTime()-n)/i,w=l+j/365*o;M+=`<line x1="${w}" y1="${m}" x2="${w}" y2="${m+c}" stroke="#ffffff" stroke-width="2"><title>Peak: ${L}</title></line>`;const C=A>0?(new Date(P[A-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,X=j-56,ne=C+14,ee=Math.max(0,Math.max(X,ne)),Pe=j-ee,Te=l+ee/365*o,Re=Pe/365*o;R+=`<rect x="${Te}" y="${m}" width="${Re}" height="${c}" fill="rgba(16, 185, 129, 0.1)" />`;const je=14/365*o;R+=`<rect x="${w}" y="${m}" width="${je}" height="${c}" fill="rgba(239, 68, 68, 0.1)" />`}}const F=(new Date(r).getTime()-n)/i,N=l+F/365*o;M+=`<line x1="${N}" y1="${m}" x2="${N}" y2="${m+c}" stroke="#ef4444" stroke-width="3"><title>Heute: ${r}</title></line>`,xt.forEach((P,A)=>{const L=Qt[A%Qt.length];P.peakDates&&P.peakDates.forEach(J=>{const w=(new Date(J).getTime()-n)/i,C=l+w/365*o;M+=`<line x1="${C}" y1="${m}" x2="${C}" y2="${m+c}" stroke="${L}" stroke-width="1.5" stroke-dasharray="3,3"><title>${P.riderName} Peak: ${J}</title></line>`})});let H="",z="";xt.forEach((P,A)=>{const L=Qt[A%Qt.length],J=P.formHistory.filter((j,w)=>w%2===0).map(j=>{const C=(new Date(j.date).getTime()-n)/i,X=l+C/365*o,ne=m+c-Math.min(8,Math.max(0,j.totalForm))/8*c;return{x:X,y:ne,form:j.totalForm,date:j.date}});if(J.length>0){const j=`M ${J.map(w=>`${w.x},${w.y}`).join(" L ")}`;H+=`<path d="${j}" fill="none" stroke="${L}" stroke-width="2" />`,z+=J.map(w=>`<circle cx="${w.x}" cy="${w.y}" r="3" fill="#fff" stroke="${L}" stroke-width="2"><title>${P.riderName} (${w.date}): ${w.form}</title></circle>`).join("")}});const I=d.teams.filter(P=>P.division==="WorldTour"||P.divisionName==="WorldTour");let G='<option value="">-- Team auswählen --</option>';for(const P of I){const A=na===P.id?" selected":"";G+=`<option value="${P.id}"${A}>${S(P.name)}</option>`}let U='<option value="">-- Fahrer auswählen --</option>';if(na!=null){const P=d.riders.filter(A=>A.activeTeamId===na&&A.id!==e.riderId&&!xt.some(L=>L.riderId===A.id));for(const A of P)U+=`<option value="${A.id}">${S(A.firstName)} ${S(A.lastName)}</option>`}const K=`
    <div class="rider-compare-controls" style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-primary);">
      <span style="font-weight: 600; color: var(--text-100); font-size: 0.95rem;">Mit anderem Fahrer vergleichen:</span>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-team-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Team (Tier 1):</label>
        <select id="rider-compare-team-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);">
          ${G}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-rider-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Fahrer:</label>
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${na==null?"disabled":""}>
          ${U}
        </select>
      </div>
    </div>
  `,q=e.currentSeasonRank??Wr(e.riderId)??"–",Q=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(e.riderName)} (${e.currentSeasonPoints}/${q})">${S(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${q})</span></span>
    </div>
    `];xt.forEach((P,A)=>{const L=Qt[A%Qt.length],J=P.currentSeasonRank??Wr(P.riderId)??"–";Q.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${L}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(P.riderName)} (${P.currentSeasonPoints}/${J})">${S(P.riderName)} <span style="color: var(--text-500);">(${P.currentSeasonPoints}/${J})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${P.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const se=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      
      <!-- Chart Line Toggle Checkboxes -->
      <div class="chart-line-toggles" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-form" ${Ze.form?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-combined-fatigue" ${Ze.combinedFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #ef4444;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
          Gesamtfatigue (0-25)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-short-fatigue" ${Ze.shortFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #facc15;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #facc15; border-radius: 50%;"></span>
          Kurzzeitfatigue (0-25)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-long-fatigue" ${Ze.longFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #a855f7;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #a855f7; border-radius: 50%;"></span>
          Langzeitfatigue (0-25)
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
      ${K}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${R}
            ${D}
            ${E}
            ${M}
            ${g?`<path d="${g}" fill="${$}" />`:""}
            ${u?`<path d="${u}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${f}
            ${h}
            ${b}
            ${y}
            ${k}
            ${T}
            ${x}
            ${H}
            ${z}
          </svg>
        </div>
        ${se}
      </div>
    </section>
  `}function og(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
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
                <td>${S(os(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${r?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(s=a.country)!=null&&s.code3?ce(a.country.code3):"–"}</td>
                <td><strong>${S(a.name)}</strong></td>
                <td>${is(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function yn(e){const t=new Set;if(e.jerseysWorn){const i=e.jerseysWorn.split(",").map(o=>o.trim()).filter(Boolean);for(const o of i)t.add(o)}const a=new Map;if(e.eventIds){const i=e.eventIds.split("|");for(const o of i){const[c,l]=o.split(":");c&&a.set(c,l?parseInt(l,10):1)}}const r=[{type:"jersey",key:"yellow",label:"Gelbes Trikot (Gesamtwertung)",colorClass:"jersey-dot-yellow"},{type:"jersey",key:"green",label:"Grünes Trikot (Punktewertung)",colorClass:"jersey-dot-green"},{type:"jersey",key:"red",label:"Bergtrikot (Bergwertung)",colorClass:"jersey-dot-red"},{type:"jersey",key:"white",label:"Weißes Trikot (Nachwuchswertung)",colorClass:"jersey-dot-white"},{type:"jersey",key:"purple",label:"Lila Trikot (Aktivste Fahrer)",colorClass:"jersey-dot-purple-worn"},{type:"event",key:"3",label:"Superform",colorClass:"event-dot-3"},{type:"event",key:"4",label:"Supermalus",colorClass:"event-dot-4"},{type:"event",key:"1",label:"Sturz",colorClass:"event-dot-1"},{type:"event",key:"2",label:"Defekt",colorClass:"event-dot-2"},{type:"event",key:"7",label:"Heimvorteil",colorClass:"event-dot-7"},{type:"event",key:"8",label:"Heimbonus",colorClass:"event-dot-8"},{type:"event",key:"9",label:"Heimmalus",colorClass:"event-dot-9"},{type:"event",key:"5",label:"Attacken",colorClass:"event-dot-5"},{type:"event",key:"6",label:"Konterattacken",colorClass:"event-dot-6"}],s=[],n=[];for(const i of r)if(i.type==="jersey")t.has(i.key)&&(s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
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
  `}function Zt(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${S(e)}</span>`}function lg(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function dg(e){return e.finishStatus==="otl"?Zt("OTL","place"):e.finishStatus==="dnf"?Zt("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${S(String(e.resultRank))}</span>`}function cg(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":Zt(String(e.gcRank),"gc")}function ug(e){return e.finishStatus==="otl"?Fr(e.statusReason,!0):e.finishStatus==="dnf"?Fr(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${_a(e.stageTimeSeconds)}`:e.resultLabel}function Ne(e,t,a=!1){var f,g,h;const r=(e==null?void 0:e.activeTeamId)!=null?((f=d.teams.find(b=>b.id===e.activeTeamId))==null?void 0:f.name)??null:null,s=((g=e==null?void 0:e.country)==null?void 0:g.code3)??(e==null?void 0:e.nationality)??null,n=s?ce(s):"",i=t==null?[]:[...t.seasons].map(b=>({...b,raceBlocks:ag(b.raceBlocks)})).sort((b,y)=>y.season-b.season);if(a)return`
      ${Xe(e,t,r,s,n)}
      ${Qe(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`;if(!t)return`
      ${Xe(e,t,r,s,n)}
      ${Qe(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`;if(d.riderStatsTab==="skills")return`
      ${Xe(e,t,r,s,n)}
      ${Qe(t)}
      ${sg(e)}`;if(d.riderStatsTab==="fatigue")return`
      ${Xe(e,t,r,s,n)}
      ${Qe(t)}
      ${ng(e,t)}`;if(d.riderStatsTab==="program")return`
      ${Xe(e,t,r,s,n)}
      ${Qe(t)}
      ${og(t)}`;if(d.riderStatsTab==="form")return`
      ${Xe(e,t,r,s,n)}
      ${Qe(t)}
      ${ig(t)}`;if(d.riderStatsTab==="topResults")return`
      ${Xe(e,t,r,s,n)}
      ${Qe(t)}
      ${pg(t)}`;if(d.riderStatsTab==="career")return`
      ${Xe(e,t,r,s,n)}
      ${Qe(t)}
      ${fg(t)}`;if(d.riderStatsTab==="contracts")return`
      ${Xe(e,t,r,s,n)}
      ${Qe(t)}
      ${gg(t)}`;const o=((h=d.gameState)==null?void 0:h.season)??2026,c=Array.from(new Set([o,...i.map(b=>b.season)])).sort((b,y)=>y-b);(d.riderStatsSelectedSeason===null||!c.includes(d.riderStatsSelectedSeason))&&(d.riderStatsSelectedSeason=o);const l=d.riderStatsSelectedSeason,m=i.find(b=>b.season===l);if(t.seasons.length===0)return`
      ${Xe(e,t,r,s,n)}
      ${Qe(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`;const p=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.02); padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <h3 style="margin: 0; font-size: 1rem; color: #fff;">Rennergebnisse</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-stats-results-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500; margin: 0;">Saison filtern:</label>
        <select id="rider-stats-results-season-select" class="form-control" style="background: #222; border: 1px solid #444; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer; width: auto; display: inline-block;">
          ${c.map(b=>`<option value="${b}" ${b===l?"selected":""}>Saison ${b}</option>`).join("")}
        </select>
      </div>
    </div>
  `,u=m?`
    <section class="rider-stats-season" style="margin-top: 0;">
      <div class="rider-stats-season-head" style="display: none;">
        <h3>Saison ${m.season}</h3>
        <span>${m.raceBlocks.length} Rennen</span>
      </div>
      <div class="rider-stats-race-list">
        ${m.raceBlocks.map(b=>`
          <section class="rider-stats-race-block">
            <div class="rider-stats-race-head">
              <div>
                <h4>${S(b.raceName)}</h4>
                <p>${S(eg(b))}</p>
              </div>
              ${jr(b.raceCategoryName,b.isStageRace,b.rows.filter(y=>y.rowType==="stage_result").length||null)}
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
                  ${b.rows.map(y=>{const k=y.rowType!=="stage_result",T=k?`${y.raceName} · ${ns(y.rowType)}`:y.stageNumber&&y.isStageRace?`${y.raceName} · Etappe ${y.stageNumber}`:y.raceName;return`
                      <tr class="rider-stats-row${k?" rider-stats-row-final":""}">
                        <td>${S(de(y.date))}</td>
                        <td>${dg(y)}</td>
                        <td>${cg(y)}</td>
                        <td class="rider-stats-breakaway-col">${lg(y)}</td>
                        <td>${k?"":za(y.rolledWeatherId,y.rolledWetterName)}</td>
                        <td>${k?Qp(y.rowType):jr(y.raceCategoryName?y.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):y.raceCategoryName,y.isStageRace)}</td>
                        <td>${S(T)}</td>
                        <td class="status-cell">${yn(y)}</td>
                        <td>${k?"–":y.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${y.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${Xa(y.profile)}</button>`:"–"}</td>
                        <td>${k?"-":y.distanceKm!=null?S(y.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                        <td>${k?"-":y.elevationGainMeters!=null?S(String(Math.round(y.elevationGainMeters))):"–"}</td>
                        <td>${S(ug(y))}</td>
                        <td>${y.seasonPoints}</td>
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
    ${Xe(e,t,r,s,n)}
    ${Qe(t)}
    ${p}
    ${u}
  `}function _s(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(d.riderStatsTab)?(e.style.minWidth="min(1475px, 95vw)",e.style.maxWidth="1687px"):(e.style.minWidth="",e.style.maxWidth="")}function $s(e,t){let a="var(--text-200)",r="rgba(255, 255, 255, 0.05)";return t===1?(a="#fbbf24",r="rgba(251, 191, 36, 0.1)"):t===2?(a="#cbd5e1",r="rgba(203, 213, 225, 0.1)"):t===6?(a="#4ade80",r="rgba(74, 222, 128, 0.1)"):t===3?(a="#c084fc",r="rgba(192, 132, 252, 0.1)"):t===4?(a="#38bdf8",r="rgba(56, 189, 248, 0.1)"):t===5&&(a="#fb923c",r="rgba(251, 146, 60, 0.1)"),`<span style="color: ${a}; background: ${r}; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.05); font-weight: bold; font-size: 0.85rem; display: inline-block; line-height: 1;">${S(e)}</span>`}async function va(e){var m,p,u,f,g;const t=Me(e);(t==null?void 0:t.activeTeamId)!=null&&((m=d.teams.find(h=>h.id===t.activeTeamId))==null||m.name),xt=[],na=null,d.riderStatsSelectedRiderId=e,d.riderStatsTab="results",d.riderStatsSelectedSeason=((p=d.gameState)==null?void 0:p.season)??2026,_s(),d.riderStatsTopResultsFilterCategory=null,d.riderStatsTopResultsFilterSeason=null,d.riderStatsTopResultsFilterRank=null,d.riderStatsTopResultsFilterProfile=null,d.riderStatsTopResultsPage=1,v("rider-stats-title").innerHTML=zi(t,null),v("rider-stats-jersey").innerHTML="";const a=t?$s(((u=t.role)==null?void 0:u.name)??"Fahrer",t.roleId??null):"Fahrer",r=t!=null&&t.age?` · <span style="color: #fbbf24; font-weight: 600;">Alter ${t.age}</span>`:"";v("rider-stats-meta").innerHTML=t?`${a}${r}`:"Historie wird geladen",v("rider-stats-body").innerHTML=Ne(t,null,!0),gt("riderStats");const s=await Z.getRiderStats(e);if(d.riderStatsSelectedRiderId!==e)return;if(!s.success||!s.data){const h=t?$s(((f=t.role)==null?void 0:f.name)??"Fahrer",t.roleId??null):"Fahrer",b=t!=null&&t.age?` · <span style="color: #fbbf24; font-weight: 600;">Alter ${t.age}</span>`:"";v("rider-stats-meta").innerHTML=t?`${h}${b}`:"Fehler beim Laden",v("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>`;return}d.riderStatsPayload=s.data,_s(),v("rider-stats-title").innerHTML=zi(t,s.data),v("rider-stats-jersey").innerHTML="";const n=s.data.age?s.data.age:t!=null&&t.age?t.age:null,i=n?` · <span style="color: #fbbf24; font-weight: 600;">Alter ${n}</span>`:"",o=s.data.mentorName?` · Mentor: ${s.data.mentorName}`:"",c=s.data.mentoredRiderNames&&s.data.mentoredRiderNames.length>0?` · Mentor von: ${s.data.mentoredRiderNames.join(" - ")}`:"",l=$s(((g=t==null?void 0:t.role)==null?void 0:g.name)??"Fahrer",(t==null?void 0:t.roleId)??null);v("rider-stats-meta").innerHTML=`${l}${i} · ${s.data.seasons.length} Saisons${o}${c}`,v("rider-stats-body").innerHTML=Ne(t,s.data,!1)}function mg(){v("rider-stats-body").addEventListener("click",e=>{var i;const t=e.target.closest("button[data-top-results-rank]");if(t){const o=t.dataset.topResultsRank,c=o==="all"?null:Number(o);d.riderStatsTopResultsFilterRank=d.riderStatsTopResultsFilterRank===c?null:c,d.riderStatsTopResultsPage=1;const l=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(l,d.riderStatsPayload,!1);return}const a=e.target.closest("button[data-top-results-filter]");if(a){const o=a.dataset.topResultsFilter;d.riderStatsTopResultsFilters[o]=!d.riderStatsTopResultsFilters[o],d.riderStatsTopResultsPage=1;const c=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(c,d.riderStatsPayload,!1);return}if(e.target&&e.target.id&&e.target.id.startsWith("toggle-chart-")){const o=e.target.id,c=e.target.checked;o==="toggle-chart-form"?Ze.form=c:o==="toggle-chart-combined-fatigue"?Ze.combinedFatigue=c:o==="toggle-chart-short-fatigue"?Ze.shortFatigue=c:o==="toggle-chart-long-fatigue"&&(Ze.longFatigue=c);const l=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(l,d.riderStatsPayload,!1);return}const r=e.target.closest("button[data-rider-stats-tab]");if(!r){const o=e.target.closest("button[data-remove-compare-id]");if(o){const m=Number(o.dataset.removeCompareId);xt=xt.filter(u=>u.riderId!==m);const p=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(p,d.riderStatsPayload,!1);return}const c=e.target.closest("button[data-top-results-page]");if(c){const m=Number(c.dataset.topResultsPage);if(!isNaN(m)&&m>=1){d.riderStatsTopResultsPage=m;const p=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(p,d.riderStatsPayload,!1)}return}const l=e.target.closest("button[data-stage-profile-id]");if(l){const m=Number(l.dataset.stageProfileId);Number.isFinite(m)&&Ur(m);return}return}const s=r.dataset.riderStatsTab;if(s!=="results"&&s!=="program"&&s!=="form"&&s!=="topResults"&&s!=="skills"&&s!=="career"&&s!=="fatigue"&&s!=="contracts"||s==="program"&&(((i=d.riderStatsPayload)==null?void 0:i.programRaces.length)??0)===0)return;d.riderStatsTab=s,_s();const n=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(n,d.riderStatsPayload,!1)}),v("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){d.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,d.riderStatsTopResultsPage=1;const a=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){d.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),d.riderStatsTopResultsPage=1;const a=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-profile"){d.riderStatsTopResultsFilterProfile=t.value==="all"?null:t.value,d.riderStatsTopResultsPage=1;const a=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-results-season-select"){d.riderStatsSelectedSeason=Number(t.value);const a=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(a,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;na=a?Number(a):null;const r=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(r,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const r=Number(a);if(xt.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const s=await Z.getRiderStats(r,!0);s.success&&s.data?xt.push({riderId:s.data.riderId,riderName:s.data.riderName,teamId:s.data.teamId,teamName:s.data.teamName,formHistory:s.data.formHistory??[],peakDates:s.data.peakDates??[],currentSeasonPoints:s.data.currentSeasonPoints??0,currentSeasonRank:s.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(s.error??""));const n=Me(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ne(n,d.riderStatsPayload,!1)}}})}function Gi(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function pg(e){const t=[];for(const g of e.seasons)for(const h of g.raceBlocks)for(const b of h.rows)t.push({...b,season:g.season,isStageRace:h.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,h)=>g.localeCompare(h,"de"));const r=Array.from(new Set(t.map(g=>g.season))).sort((g,h)=>h-g);let s=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?d.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?d.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?d.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?d.riderStatsTopResultsFilters.youth:g.rowType==="breakaway_final"?d.riderStatsTopResultsFilters.breakaway:!0:g.isStageRace?d.riderStatsTopResultsFilters.stage:d.riderStatsTopResultsFilters.oneDay);if(d.riderStatsTopResultsFilterCategory){const g=d.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const h=g.substring(0,g.length-8);s=s.filter(b=>b.raceCategoryName===h&&b.rowType==="stage_result")}else if(g.endsWith("-gc")){const h=g.substring(0,g.length-3);s=s.filter(b=>b.raceCategoryName===h&&b.rowType!=="stage_result")}else s=s.filter(h=>h.raceCategoryName===g)}d.riderStatsTopResultsFilterSeason!=null&&(s=s.filter(g=>g.season===d.riderStatsTopResultsFilterSeason)),d.riderStatsTopResultsFilterRank!=null&&!isNaN(d.riderStatsTopResultsFilterRank)&&(s=s.filter(g=>g.resultRank!=null&&g.resultRank<=d.riderStatsTopResultsFilterRank)),d.riderStatsTopResultsFilterProfile&&(s=s.filter(g=>g.profile===d.riderStatsTopResultsFilterProfile)),s.sort((g,h)=>{if(h.seasonPoints!==g.seasonPoints)return h.seasonPoints-g.seasonPoints;const b=g.rowType!=="stage_result",y=h.rowType!=="stage_result",k=g.resultRank??9999,T=h.resultRank??9999;if(d.riderStatsTopResultsFilterCategory)return k!==T?k-T:b!==y?b?-1:1:0;{const x=Gi(g.raceCategoryName),$=Gi(h.raceCategoryName);return x!==$?x-$:b!==y?b?-1:1:k-T}});const n=200,i=s.slice(0,1e3),o=Math.max(1,Math.ceil(i.length/n));d.riderStatsTopResultsPage>o&&(d.riderStatsTopResultsPage=o);const c=(d.riderStatsTopResultsPage-1)*n,l=i.slice(c,c+n),p=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: flex-start; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${a.map(g=>{if(g.toLowerCase().includes("stage race")||g.toLowerCase().includes("grand tour")||g.toLowerCase().includes("tour de france")){const b=`${g}-etappen`,y=`${g}-gc`;return`
        <option value="${S(b)}" ${d.riderStatsTopResultsFilterCategory===b?"selected":""}>${S(g)} - Etappen</option>
        <option value="${S(y)}" ${d.riderStatsTopResultsFilterCategory===y?"selected":""}>${S(g)} - GC</option>
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
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Profil:</label>
        <select id="rider-stats-filter-profile" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444; cursor: pointer;">
          <option value="all">Alle Profile</option>
          <option value="Flat" ${d.riderStatsTopResultsFilterProfile==="Flat"?"selected":""}>Flat</option>
          <option value="Rolling" ${d.riderStatsTopResultsFilterProfile==="Rolling"?"selected":""}>Rolling</option>
          <option value="Hilly" ${d.riderStatsTopResultsFilterProfile==="Hilly"?"selected":""}>Hilly</option>
          <option value="Hilly Difficult" ${d.riderStatsTopResultsFilterProfile==="Hilly Difficult"?"selected":""}>Hilly Difficult</option>
          <option value="Medium Mountain" ${d.riderStatsTopResultsFilterProfile==="Medium Mountain"?"selected":""}>Medium Mountain</option>
          <option value="Mountain" ${d.riderStatsTopResultsFilterProfile==="Mountain"?"selected":""}>Mountain</option>
          <option value="High Mountain" ${d.riderStatsTopResultsFilterProfile==="High Mountain"?"selected":""}>High Mountain</option>
          <option value="Cobble" ${d.riderStatsTopResultsFilterProfile==="Cobble"?"selected":""}>Cobble</option>
          <option value="Cobble Hill" ${d.riderStatsTopResultsFilterProfile==="Cobble Hill"?"selected":""}>Cobble Hill</option>
          <option value="ITT" ${d.riderStatsTopResultsFilterProfile==="ITT"?"selected":""}>ITT</option>
          <option value="TTT" ${d.riderStatsTopResultsFilterProfile==="TTT"?"selected":""}>TTT</option>
        </select>
      </div>
      
      <div style="display: grid; grid-template-rows: auto auto; grid-template-columns: repeat(6, 130px); gap: 0.5rem; align-items: center; justify-items: center; text-align: center; margin-left: auto; border-left: 1px solid rgba(255, 255, 255, 0.1); padding-left: 1rem;">
        <!-- Column 1: Siege / Top 3 -->
        <div style="grid-row: 1; grid-column: 1;">
          ${ge("Siege",d.riderStatsTopResultsFilterRank===1,"linear-gradient(135deg, #fbbf24, #d4af37)","#000","rgba(251, 191, 36, 0.4)","data-top-results-rank","1")}
        </div>
        <div style="grid-row: 2; grid-column: 1;">
          ${ge("Top 3",d.riderStatsTopResultsFilterRank===3,"linear-gradient(135deg, #e2e8f0, #94a3b8)","#000","rgba(148, 163, 184, 0.4)","data-top-results-rank","3")}
        </div>

        <!-- Column 2: Top 5 / Top 10 -->
        <div style="grid-row: 1; grid-column: 2;">
          ${ge("Top 5",d.riderStatsTopResultsFilterRank===5,"linear-gradient(135deg, #d97706, #b45309)","#fff","rgba(217, 119, 6, 0.4)","data-top-results-rank","5")}
        </div>
        <div style="grid-row: 2; grid-column: 2;">
          ${ge("Top 10",d.riderStatsTopResultsFilterRank===10,"linear-gradient(135deg, #a16207, #78350f)","#fff","rgba(161, 98, 7, 0.4)","data-top-results-rank","10")}
        </div>

        <!-- Column 3: GC / [Empty] -->
        <div style="grid-row: 1; grid-column: 3;">
          ${ge("GC",d.riderStatsTopResultsFilters.gc,"linear-gradient(135deg, #facc15, #ca8a04)","#000","rgba(234, 179, 8, 0.4)","data-top-results-filter","gc")}
        </div>
        <div style="grid-row: 2; grid-column: 3;">
          <!-- Empty for GC single layout -->
        </div>

        <!-- Column 4: Punkte / Berg -->
        <div style="grid-row: 1; grid-column: 4;">
          ${ge("Punkte",d.riderStatsTopResultsFilters.points,"linear-gradient(135deg, #4ade80, #16a34a)","#fff","rgba(74, 222, 128, 0.4)","data-top-results-filter","points")}
        </div>
        <div style="grid-row: 2; grid-column: 4;">
          ${ge("Berg",d.riderStatsTopResultsFilters.mountain,"linear-gradient(135deg, #f87171, #dc2626)","#fff","rgba(239, 68, 68, 0.4)","data-top-results-filter","mountain")}
        </div>

        <!-- Column 5: Nachwuchs / Ausreißer -->
        <div style="grid-row: 1; grid-column: 5;">
          ${ge("Nachwuchs",d.riderStatsTopResultsFilters.youth,"linear-gradient(135deg, #ffffff, #e2e8f0)","#0f172a","rgba(255, 255, 255, 0.4)","data-top-results-filter","youth")}
        </div>
        <div style="grid-row: 2; grid-column: 5;">
          ${ge("Ausreißer",d.riderStatsTopResultsFilters.breakaway,"linear-gradient(135deg, #c084fc, #7c3aed)","#fff","rgba(168, 85, 247, 0.4)","data-top-results-filter","breakaway")}
        </div>

        <!-- Column 6: Etappen / One Day -->
        <div style="grid-row: 1; grid-column: 6;">
          ${ge("Etappen",d.riderStatsTopResultsFilters.stage,"linear-gradient(135deg, #60a5fa, #2563eb)","#fff","rgba(59, 130, 246, 0.4)","data-top-results-filter","stage")}
        </div>
        <div style="grid-row: 2; grid-column: 6;">
          ${ge("One Day",d.riderStatsTopResultsFilters.oneDay,"linear-gradient(135deg, #b91c1c, #7f1d1d)","#fff","rgba(185, 28, 28, 0.4)","data-top-results-filter","oneDay")}
        </div>
      </div>
    </div>
  `,u=l.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':l.map(g=>{const h=g.rowType!=="stage_result",b=h?`${g.raceName} · ${ns(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let y="–",k="–";g.finishStatus==="otl"?y=Zt("OTL","place"):g.finishStatus==="dnf"?y=Zt("DNF","place"):g.resultRank==null||(h?k=`<span class="rider-stats-final-type ${bn(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:y=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${S(String(g.resultRank))}</span>`);const T=h?"–":g.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${g.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${Xa(g.profile)}</button>`:"–",x=!h&&g.stageScore!=null&&g.stageScore>0?ss(g.stageScore,0,350):"–",$=jr(g.raceCategoryName?g.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${h?" rider-stats-row-final":""}">
            <td>${y}</td>
            <td>${k}</td>
            <td><strong>${S(b)}</strong>${h?"":za(g.rolledWeatherId,g.rolledWetterName)}</td>
            <td class="status-cell">${yn(g)}</td>
            <td>${T}</td>
            <td>${x}</td>
            <td>${$}</td>
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
      ${p}
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
  `}function gg(e){var n,i,o,c,l;const t=(e==null?void 0:e.contracts)||[];if(t.length===0)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Vertragsdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden keine Verträge in der Datenbank erfasst.</p>
      </section>
    `;const a=((n=d.gameState)==null?void 0:n.season)??2026,r=[];for(const m of t)for(let p=m.startSeason;p<=m.endSeason;p++){let u=null;p>a?u="-":p===a?u=(e==null?void 0:e.roleName)||((o=(i=e==null?void 0:e.seasonRoles)==null?void 0:i.find(g=>g.season===p))==null?void 0:o.roleName)||"-":u=((l=(c=e==null?void 0:e.seasonRoles)==null?void 0:c.find(g=>g.season===p))==null?void 0:l.roleName)||"-";const f=p===a?'<span style="color: #22c55e; font-weight: bold;">Aktiv</span>':p>a?'<span style="color: #60a5fa; font-weight: bold;">Zukünftig</span>':'<span style="color: #94a3b8;">Abgelaufen</span>';r.push({season:p,teamId:m.teamId,teamName:m.teamName,roleName:u,statusText:f})}return r.sort((m,p)=>p.season-m.season),`
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
            ${r.map(m=>{const p=m.teamId?Mt(m.teamId,m.teamName):"",u=m.teamId?rt(m.teamName||"",m.teamId,!0,"results-rider-link"):"Freier Fahrer (Free Agent)",f=m.teamId?`<div style="display: flex; align-items: center; gap: 0.5rem;">${p} <span style="vertical-align: middle;">${u}</span></div>`:`<span style="color: #94a3b8; font-style: italic;">${u}</span>`;return`
      <tr>
        <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-weight: bold; color: #fff;">Saison ${m.season}</td>
        <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-weight: 500;">${f}</td>
        <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; color: #ccc;">${S(m.roleName||"-")}</td>
        <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${m.statusText}</td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `}function fg(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,superteamCount:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),r=(n,i,o,c)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let m="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?m+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?m+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?m+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?m+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?m+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?m+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?m+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?m+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(m+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${m}" title="${S(o)}">${n}</span>`},s=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
                ${hn(n.key)}
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
                  ${fe(i.winFlat||0,"flat","Flach (Flat)")}
                  ${fe(i.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${fe(i.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${fe(i.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${fe(i.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${fe(i.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${fe(i.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${fe(i.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${fe(i.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${fe(i.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${fe(i.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${Le(i.winWeather1||0,1,"Sonnig")}
                  ${Le(i.winWeather2||0,2,"Extreme Hitze")}
                  ${Le(i.winWeather3||0,3,"Leichter Regen")}
                  ${Le(i.winWeather4||0,4,"Starkregen")}
                  ${Le(i.winWeather5||0,5,"Starker Wind")}
                  ${Le(i.winWeather6||0,6,"Dichter Nebel")}
                  ${Le(i.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${oe.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${i.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}window.openRiderStatsFromRiderStats=va;const hg=250,ea=1200,bg=250,yg=1200,Ki=.2;class vg{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",r=>{var i,o,c,l;const s=r.target.closest("button[data-race-sim-action]");if(s){if(s.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const p=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;p&&((l=(c=this.options).onFinishRequested)==null||l.call(c,p,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=r.target.closest("button[data-race-sim-speed]");if(n){const m=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(m))return;this.timeMultiplier=m,this.render()}}),this.elements.messages.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-group-rider-id]");if(s){const c=this.resolveRiderIdFromGroupButton(s);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),va(c));return}const n=r.target.closest("button[data-race-sim-group-rider-name]");if(n){const c=this.resolveRiderIdFromGroupButton(n);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),va(c));return}const i=r.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),fi(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",r=>{const s=r.target.closest("[data-race-sim-overview-summary]");if(s){const n=s.dataset.raceSimOverviewSummary,i=s.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(r)}),this.elements.groupBox.addEventListener("click",r=>{this.handleGroupInteraction(r)}),this.elements.profile.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-timing-mode]");if(!s)return;const n=s.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+ea,this.render())})}handleGroupInteraction(t){var m,p;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const u=this.resolveRiderIdFromGroupButton(a);u!=null&&this.selectGroupByRiderId(u,this.detailSnapshot);return}const r=t.target.closest("button[data-race-sim-group-nav]");if(!r)return;const s=this.buildRaceGroups(this.detailSnapshot);if(s.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,s.findIndex(u=>u.label===n)),o=r.dataset.raceSimGroupNav==="prev"?-1:1,c=(i+o+s.length)%s.length,l=((m=s[c])==null?void 0:m.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",u=>{const f=u.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+ea)}),this.elements.profile.addEventListener("wheel",u=>{const f=u.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+ea)},{passive:!0}),this.elements.profile.addEventListener("scroll",u=>{const f=u.target;!(f instanceof HTMLElement)||!f.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+ea)},!0),(p=this.elements.sidebar.parentElement)==null||p.addEventListener("click",u=>{if(!this.bootstrap||!this.detailSnapshot||!wm(this.elements.sidebar,u.target))return;const g=performance.now(),h=Fi(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(h);const b=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",b),this.scheduleSidebarPaintTelemetry(g,b),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new Go(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const r=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(r),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(s=>this.frame(s));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const r=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-r),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(s=>this.frame(s))}render(t=performance.now(),a=!1){var f;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const r=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",s=Id(this.bootstrap.stageSummary),n=[`${s.segmentCount} Segmente`,s.sprintCount>0?`${s.sprintCount} Sprint${s.sprintCount===1?"":"s"}`:null,s.climbCount>0?`${s.climbCount} Bergwertung${s.climbCount===1?"":"en"}`:null].filter(g=>g!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,c=o!=null?i[o]??"":"",l=c?` · ${c}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${r}${n?` · ${n}`:""}${l}`;const m=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=hg,p=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,u=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=bg;if(m||p||u){const g=performance.now();this.detailSnapshot=((f=this.engine)==null?void 0:f.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-g)}if(m&&this.detailSnapshot){const g=this.elements.profile.querySelector(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop);const h=performance.now();Dd(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-h),this.lastProfileRenderTime=t;const b=this.elements.profile.querySelector(".race-sim-timing-scroll");b&&(b.scrollTop=this.timingScrollTop)}if(p&&this.detailSnapshot){this.lastSidebarRenderTime=t;const g=performance.now(),h=Fi(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(h);const b=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",b),this.scheduleSidebarPaintTelemetry(g,b)}u&&this.detailSnapshot&&(fi(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),cm(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),nm(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),gi(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const r=a.find(s=>s.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(r)return r.label}return this.selectedGroupLabel!=null&&a.some(r=>r.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return sn(rn(t.clusters))}resolveInitialGroupLabel(t){var a,r;return((a=t.find(s=>s.label==="P"))==null?void 0:a.label)??((r=t[0])==null?void 0:r.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(r=>[r.riderId,r]));return[...t.riderIds].sort((r,s)=>{var n,i;return(((n=a.get(r))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(s))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||r-s})[0]??null}selectGroupByLabel(t,a,r=!0){const s=this.buildRaceGroups(a),n=s.find(i=>i.label===t)??s.find(i=>i.label==="P")??s[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),r&&(this.profileInteractionHoldUntilMs=performance.now()+ea,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const s=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;s&&(this.selectedGroupLabel=s.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+ea,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+yg,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const r=t.dataset.raceSimGroupRiderName;if(!r)return null;const s=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===r&&(s==null||i.activeTeamId===s))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const r=this.perfTelemetry[t];this.perfTelemetry[t]=r<=0?a:r*(1-Ki)+a*Ki}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const r=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(r!==this.sidebarPaintSequence)return;const s=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",s),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||gi(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const ut="__stage_overview__",Sl="__non_finishers__",kl="__events__",$l="__roster__";let Ye="all";function vn(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function Oi(e){return vn(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function Sg(e){return[...e].sort((t,a)=>Oi(t)-Oi(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function kg(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=vn(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function $g(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function xg(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${de(t.date)}`}async function As(e,t){var s;const a=Aa(e);if(a&&(d.selectedResultsRaceId=a.race.id,d.selectedResultsStageId=e),d.riders.length===0){const n=await Z.getRiders();n.success&&(d.riders=n.data??[])}const r=await Z.getStageResults(e);if(!r.success){d.stageResults=null,Ae(),!t&&r.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+r.error);return}d.stageResults=r.data??null,d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId,d.selectedResultTypeId=((s=d.stageResults.classifications[0])==null?void 0:s.resultTypeId)??1,d.selectedResultsMarkerKey=ut,d.selectedResultsSpecialView=null),d.selectedResultsRaceId!=null&&xl(d.selectedResultsRaceId),Ae()}async function xl(e){if(!d.seasonStandings){const a=await Z.getSeasonStandings();a.success&&a.data&&(d.seasonStandings=a.data)}const t=await Z.getRaceResultsRoster(e);t.success&&t.data?d.resultsRoster=t.data:d.resultsRoster=null}function Tg(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function ji(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function wg(){const e=d.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=Ht(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=[...e.entries].sort((b,y)=>y.overallRating-b.overallRating),s=new Set(r.slice(0,5).map(b=>b.riderId)),n=b=>{var k;const y=d.riders.find(T=>T.id===b);return((k=y==null?void 0:y.skills)==null?void 0:k.sprint)??0},o=[...e.entries.filter(b=>!s.has(b.riderId))].sort((b,y)=>{const k=n(b.riderId),T=n(y.riderId);return T!==k?T-k:y.overallRating-b.overallRating}),c=new Set(o.slice(0,5).map(b=>b.riderId));function l(b){switch(b){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return b}}const m=new Map;for(const b of e.entries){const y=b.teamId;m.has(y)||m.set(y,{teamId:b.teamId,teamName:b.teamName,riders:[],avgRating:0}),m.get(y).riders.push(b)}for(const b of m.values())b.avgRating=b.riders.reduce((y,k)=>y+k.overallRating,0)/b.riders.length;const p=b=>{let y=Number.POSITIVE_INFINITY;for(const k of b)!k.hasDropped&&k.gcRank!=null&&k.gcRank<y&&(y=k.gcRank);return y},u=b=>{var k;if(!((k=d.seasonStandings)!=null&&k.riderStandings))return 0;let y=0;for(const T of b){const x=d.seasonStandings.riderStandings.find($=>$.riderId===T.riderId);x&&x.points>y&&(y=x.points)}return y},f=b=>{if(b==null)return 0;const y=qs(b);if(y.length===0)return 0;const k=y.map(x=>x.overallRating??0);k.sort((x,$)=>$-x);const T=k.slice(0,10);return T.length===0?0:T.reduce((x,$)=>x+$,0)/T.length},g=[...m.values()].sort((b,y)=>{const k=p(b.riders),T=p(y.riders);if((k!==Number.POSITIVE_INFINITY||T!==Number.POSITIVE_INFINITY)&&k!==T)return k-T;const x=u(b.riders),$=u(y.riders);if((x>0||$>0)&&x!==$)return $-x;const D=f(b.teamId),E=f(y.teamId);return Math.abs(D-E)>1e-4?E-D:(b.teamName??"").localeCompare(y.teamName??"","de")});for(const b of g)b.riders.sort((y,k)=>ji(y.roleId)-ji(k.roleId)||k.overallRating-y.overallRating||y.lastName.localeCompare(k.lastName,"de"));return`<div class="results-roster-grid">${g.map(b=>{const y=b.teamId!=null?Mt(b.teamId,b.teamName):"",k=b.riders.map(x=>{var V;const $=Tg(x.roleId),D=x.countryCode?ze[x.countryCode]??x.countryCode.slice(0,2).toLowerCase():null,E=D?`<span class="fi fi-${D} results-roster-flag" title="${S(x.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',M=`${x.firstName.charAt(0)}. ${x.lastName}`,R=x.roleName??"–",_=x.specialization1?l(x.specialization1):null,F=x.specialization2?l(x.specialization2):null;let N=R;_&&(N+=` · ${_}`),F&&(N+=` · ${F}`);const H=`<span class="results-roster-overall-badge" style="color:${Mg(x.overallRating)}" title="Gesamtstärke: ${x.overallRating.toFixed(2)}">${x.overallRating.toFixed(2)}</span>`,z=x.hasDropped?" dropped":"";let I="";x.hasDropped?x.dropoutStatus==="dns"?I="DNS":x.dropoutStatus==="dnf"?I=((V=x.dropoutReason)==null?void 0:V.startsWith("OTL"))??!1?"OTL":"DNF":I="OUT":x.gcRank!=null&&(I=`${x.gcRank}`);let G="";if(x.hasDropped)G=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${S(x.dropoutReason||"")}">${I}</span>`;else if(x.gcRank!=null){let P="rider-stats-rank-badge-gc";x.gcRank===1?P="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":x.gcRank===2?P="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":x.gcRank===3&&(P="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),G=`<span class="rider-stats-rank-badge ${P}" title="GC Stand: Platz ${x.gcRank}">${x.gcRank}</span>`}const K=`style="color: ${x.hasDropped?"var(--text-500)":$.color}; font-weight: bold;"`,q=s.has(x.riderId),Q=c.has(x.riderId);return`<div class="results-roster-rider${z}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${E}
            <span class="results-roster-name${q?" strongest-rider":Q?" best-sprinter":""}">
              ${De(M,{riderId:x.riderId,teamId:x.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${xr(x.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${K}>${S(N)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${G||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${H}
        </div>
      </div>`}).join(""),T=b.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${y}</div>
        <div class="results-roster-team-name" title="${S(b.teamName??"–")}">${rt(b.teamName??"–",b.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${T})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${k}</div>
    </div>`}).join("")}</div>`}function Mg(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function Rg(e){var l,m;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=d.stageResults)==null?void 0:l.classifications.find(p=>p.resultTypeId===1),a=new Set(t?t.rows.map(p=>p.riderId).filter(p=>p!=null):[]),r=d.riders.filter(p=>p.activeTeamId===e.teamId&&a.has(p.id)),s=new Set((((m=d.stageResults)==null?void 0:m.nonFinishers)??[]).map(p=>p.riderId)),n=[];for(const p of r){if(p.id===e.riderId||s.has(p.id))continue;let u=0;const f=p.skills.sprint>=72,g=p.skills.flat>=78,h=p.skills.timeTrial>=76,b=p.skills.acceleration>=80;if(f&&u++,g&&u++,h&&u++,b&&u++,u>0){let y=1;u===2?y=1.25:u===3?y=1.5:u===4&&(y=2),n.push({id:p.id,firstName:p.firstName,lastName:p.lastName,countryCode:p.nationality??null,isSprinter:f,multiplier:y,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const p=n.filter(b=>b.isSprinter).reduce((b,y)=>b+y.multiplier,0),u=n.filter(b=>!b.isSprinter).reduce((b,y)=>b+y.multiplier,0);let f=0,g=0;p>0&&u>0?(f=i/(2.125*p+u),g=2.125*f,f=Math.max(.1,Math.min(.3,f)),g=Math.max(.25,Math.min(.6,g))):p>0?(g=i/p,g=Math.max(.25,Math.min(.6,g)),f=g/2.125):u>0&&(f=i/u,f=Math.max(.1,Math.min(.3,f)),g=2.125*f);for(const b of n)b.contribution=b.isSprinter?g*b.multiplier:f*b.multiplier;const h=n.reduce((b,y)=>b+y.contribution,0);if(h>0){const b=i/h;for(const y of n)y.contribution*=b}n.sort((b,y)=>y.contribution-b.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),c=n.map(p=>{const u=mt(_t(p.id)??p.countryCode),f=p.firstName?`${p.firstName.charAt(0)}. ${p.lastName}`:p.lastName,g=p.contribution.toFixed(2).replace(".",",");return`
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
  `}function Wi(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function xr(e){var p,u,f,g,h,b,y,k,T,x;if(e==null||!d.stageResults)return"";const t=Ht(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=d.stageResults.classifications,s=(u=(p=r.find($=>$.resultTypeId===Ca))==null?void 0:p.rows.find($=>$.rank===1))==null?void 0:u.riderId,n=(g=(f=r.find($=>$.resultTypeId===Cr))==null?void 0:f.rows.find($=>$.rank===1))==null?void 0:g.riderId,i=(b=(h=r.find($=>$.resultTypeId===Zs))==null?void 0:h.rows.find($=>$.rank===1))==null?void 0:b.riderId,o=(k=(y=r.find($=>$.resultTypeId===5))==null?void 0:y.rows.find($=>$.rank===1))==null?void 0:k.riderId,c=(x=(T=r.find($=>$.resultTypeId===7))==null?void 0:T.rows.find($=>$.rank===1))==null?void 0:x.riderId,l=[],m=d.selectedResultTypeId;return e===s&&(m===Ca||m===1&&a||m!==1&&m!==Ca)&&l.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&l.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&l.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&l.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===c&&l.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>'),l.length===0?"":`<span class="jersey-dots-wrapper">${l.join("")}</span>`}function Vi(e){if(!e)return"";let t=e;const a=[],r=[...d.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of r){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),c=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");c.test(t)&&(t=t.replace(c,l=>{const m=`__RIDER_LINK_${a.length}__`,p=De(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(p),m}))}let s=S(t);for(let n=0;n<a.length;n++)s=s.replace(`__RIDER_LINK_${n}__`,a[n]);return s}function Ae(){var A,L,J,j;d.riders.length===0&&Z.getRiders().then(w=>{w.success&&w.data&&(d.riders=w.data,Ae())});const e=v("results-race-select"),t=v("results-stage-select"),a=v("results-type-tabs"),r=v("results-marker-tabs"),s=v("results-stage-meta"),n=v("results-empty"),i=v("results-table"),o=i.querySelector("thead tr"),c=v("results-tbody"),l=v("results-marker-classifications"),m=v("results-roster"),p=i.querySelector("colgroup");p&&p.remove(),i.style.tableLayout="",d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+d.races.filter(w=>{var C;return(((C=w.stages)==null?void 0:C.length)??0)>0}).map(w=>`<option value="${w.id}"${w.id===d.selectedResultsRaceId?" selected":""}>${S(w.name)}</option>`).join("");const u=Ht(d.selectedResultsRaceId),f=u==null?"":(u.stages??[]).map(w=>`<option value="${w.id}"${w.id===d.selectedResultsStageId?" selected":""}>${S(xg(u,w))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+f;const g=((A=d.stageResults)==null?void 0:A.classifications.filter(w=>!(u&&!u.isStageRace&&w.resultTypeId!==1&&w.resultTypeId!==6)))??[],h=g.find(w=>w.resultTypeId===d.selectedResultTypeId)??g[0]??null,b=d.selectedResultsSpecialView==="nonFinishers",y=d.selectedResultsSpecialView==="events",k=d.selectedResultsSpecialView==="roster";if(h&&!b&&!y&&!k&&(d.selectedResultTypeId=h.resultTypeId),y){i.style.tableLayout="fixed";const w=document.createElement("colgroup");w.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(w,i.firstChild)}if(!d.stageResults&&!k||!h&&!b&&!y&&!k){const w=Aa(d.selectedResultsStageId);s.textContent=w?`${w.race.name} · ${w.stage.profile} · ${de(w.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",r.innerHTML="",r.classList.add("hidden"),c.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),m.innerHTML="",m.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=d.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}k?d.resultsRoster&&(s.textContent=`${d.resultsRoster.raceName} · Starterfeld`):d.stageResults&&(s.textContent=`${d.stageResults.raceName} · Etappe ${d.stageResults.stageNumber} · ${d.stageResults.profile} · ${de(d.stageResults.date)}`);const T=d.stageResults?Aa(d.stageResults.stageId):null,x=(T==null?void 0:T.stage.distanceKm)??null,$=new Map,D=new Map,E=new Map;if(d.stageResults){const w=d.stageResults.classifications.find(C=>C.resultTypeId===1);if(w)for(const C of w.rows)C.riderId!=null&&C.points!=null&&C.points>0&&$.set(C.riderId,C.points),C.riderId!=null&&C.breakawayKms!=null&&C.breakawayKms>0&&E.set(C.riderId,C.breakawayKms);if(d.stageResults.markerClassifications){for(const C of d.stageResults.markerClassifications)if(vn(C.markerType,C.markerCategory)){for(const X of C.entries)if(X.riderId!=null&&X.pointsAwarded!=null&&X.pointsAwarded>0){const ne=D.get(X.riderId)??0;D.set(X.riderId,ne+X.pointsAwarded)}}}}const M=(h==null?void 0:h.resultTypeId)===Ca,R=(h==null?void 0:h.resultTypeId)===Cr||(h==null?void 0:h.resultTypeId)===Zs,_=(h==null?void 0:h.resultTypeId)===5,F=(h==null?void 0:h.resultTypeId)===6,N=(h==null?void 0:h.resultTypeId)===7,H=M||R||_||F||N,z=g.map(w=>`
    <button
      type="button"
      class="results-type-btn${!b&&!y&&!k&&w.resultTypeId===d.selectedResultTypeId?" active":""}"
      data-result-type-id="${w.resultTypeId}"
    >${S(w.resultTypeName)}</button>
  `),I=`
    <button
      type="button"
      class="results-type-btn${b?" active":""}"
      data-results-special-view="${Sl}"
    >OTL/DNF</button>
  `,G=`
    <button
      type="button"
      class="results-type-btn${y?" active":""}"
      data-results-special-view="${kl}"
    >Ereignisse</button>
  `,U=`
    <button
      type="button"
      class="results-type-btn${k?" active":""}"
      data-results-special-view="${$l}"
    >Teilnehmer</button>
  `,K=g.findIndex(w=>w.resultTypeName.toLocaleLowerCase("de").includes("team"));K>=0?z.splice(K+1,0,I,G,U):z.push(I,G,U),a.innerHTML=z.join("");const q=Sg(((L=d.stageResults)==null?void 0:L.markerClassifications)??[]);if(k){m.innerHTML=wg(),m.classList.remove("hidden"),i.classList.add("hidden"),r.innerHTML="",r.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else m.innerHTML="",m.classList.add("hidden");const Q=!b&&!y&&!k&&(h==null?void 0:h.resultTypeId)===1&&q.length>0,se=Q?d.selectedResultsMarkerKey??ut:null,V=Q&&se!==ut?q.find(w=>w.markerKey===se)??null:null;if(Q&&(d.selectedResultsMarkerKey=(V==null?void 0:V.markerKey)??ut),y){const w=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"},{key:"superteam",label:"Superteam"}];r.innerHTML=w.map(C=>`
      <button
        type="button"
        class="results-type-btn${C.key===Ye?" active":""}"
        data-event-filter="${C.key}"
      >${S(C.label)}</button>
    `).join("")}else r.innerHTML=Q?[`
        <button
          type="button"
          class="results-type-btn${d.selectedResultsMarkerKey===ut?" active":""}"
          data-marker-key="${ut}"
        >Tageswertung</button>`,...q.map(w=>`
        <button
          type="button"
          class="results-type-btn${w.markerKey===d.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${w.markerKey}"
        >${S(kg(w))}</button>
      `)].join(""):"";r.classList.toggle("hidden",!y&&!Q);const P=b||y||!Q||d.selectedResultsMarkerKey===ut;if(o&&P&&(o.innerHTML=b?`
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
      `:M?`
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
      `:R?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Punkte</th>
          <th>UCI Punkte</th>
        `:N?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Kilometer</th>
          <th>UCI Punkte</th>
        `:F?`
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
        ${H?"<th>Trend</th>":""}
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
        <th class="results-points-cell">Punktewertung</th>
        <th>UCI Punkte</th>
      `),c.innerHTML=b?(((J=d.stageResults)==null?void 0:J.nonFinishers)??[]).map(w=>`
      <tr>
        <td>${w.stageNumber}</td>
        <td>${po(w.isOtl)}</td>
        <td class="results-jersey-col-cell">${aa(w.teamId,w.teamName)}</td>
        <td>${ra(w.riderName,!0,!1,w.riderId,w.teamId)}</td>
        <td class="results-flag-col-cell">${mt(w.countryCode)}</td>
        <td>${rt(w.teamName||"–",w.teamId)}</td>
        <td>${S(Fr(w.statusReason,w.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':y?[...((j=d.stageResults)==null?void 0:j.events)??[]].filter(w=>Ye==="all"?!0:Ye==="form"?!!(w.title&&(w.title.includes("guten Tag")||w.title.includes("schlechten Tag")||w.title.includes("Formhöhepunkt")||w.title.includes("Formhoehepunkt"))):Ye==="attack"?(w.type==="attack"||w.type==="counter_attack")&&!(w.title&&(w.title.toLowerCase().includes("ausreiß")||w.title.toLowerCase().includes("ausreiss"))):Ye==="breakaway"?!!(w.title&&(w.title.toLowerCase().includes("ausreiß")||w.title.toLowerCase().includes("ausreiss"))):Ye==="incident"?(w.type==="incident"||!!(w.title&&w.title.includes("Massensturz")))&&!(w.title&&(w.title.toLowerCase().includes("ausreiß")||w.title.toLowerCase().includes("ausreiss"))):Ye==="exit"?w.type==="dnf"||!!(w.title&&w.title.includes("nicht am Start")):Ye==="home"?!!(w.title&&(w.title.includes("Heimvorteil")||w.title.includes("Heimdruck"))):Ye==="weather"?!!(w.title&&w.title.startsWith("Wetterbericht:")):Ye==="superteam"?w.type==="superteam":!0).sort((w,C)=>{const X=w.kmMark??0,ne=C.kmMark??0;if(Math.abs(X-ne)>1e-4)return X-ne;if(X===0){const Te=Wi(w),Re=Wi(C);if(Te!==Re)return Te-Re}const ee=w.riderName??"",Pe=C.riderName??"";return ee.localeCompare(Pe,"de")}).map(w=>{var ue,$e,We;const C=w.kmMark!=null?`${w.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",X=w.riderId,ne=X!=null?Me(X):null,ee=w.riderTeamId??(ne==null?void 0:ne.activeTeamId)??null,Pe=ee!=null?((ue=d.teams.find(_e=>_e.id===ee))==null?void 0:ue.name)??null:null;let Te=aa(ee,Pe);const Re=!!(w.title&&w.title.startsWith("Wetterbericht:"));let je=w.title||"";if(Re){const _e=($e=d.stageResults)==null?void 0:$e.rolledWeatherId,ve=(We=d.stageResults)==null?void 0:We.rolledWetterName;Te=`<span class="results-jersey-cell">${za(_e,ve)}</span>`,ve&&(je=`Wetterbericht: ${ve}`)}const dt=w.type==="superteam",B=dt&&X==null,O=Re||B?"":mt(X!=null?_t(X):null),W=Re?"":B?rt(Pe||"–",ee):X!=null?ra(w.riderName??"",!0,!1,X,ee):S(w.riderName||"–");let Y="";return w.title&&w.title.includes("guten Tag")?Y='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':w.title&&w.title.includes("schlechten Tag")?Y='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':w.title&&(w.title.includes("Formhöhepunkt")||w.title.includes("Formhoehepunkt"))?Y='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':w.title&&w.title.includes("nicht am Start")?Y='<span class="event-badge event-badge-dns">DNS</span>':w.title&&w.title.includes("Massensturz")?Y='<span class="event-badge event-badge-masscrash">Massensturz</span>':w.type==="dnf"?Y='<span class="event-badge event-badge-dnf">DNF</span>':w.title&&(w.title.toLowerCase().includes("ausreiß")||w.title.toLowerCase().includes("ausreiss"))?Y='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':w.type==="attack"?Y='<span class="event-badge event-badge-attack">Attacke</span>':w.type==="counter_attack"?Y='<span class="event-badge event-badge-counter">Konterattacke</span>':w.type==="incident"?w.title&&(w.title.toLowerCase().includes("defekt")||w.title.toLowerCase().includes("panne")||w.title.toLowerCase().includes("technisch"))?Y='<span class="event-badge event-badge-defect">Defekt</span>':Y='<span class="event-badge event-badge-crash">Sturz</span>':w.title&&w.title.includes("Super-Heimvorteil")?Y='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>':w.title&&w.title.includes("Heimdruck")?Y='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>':w.title&&w.title.includes("Heimvorteil")?Y='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':w.title&&w.title.startsWith("Wetterbericht:")?Y='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>':dt&&(Y='<span class="event-badge event-badge-superteam"><span class="event-icon">⚡</span> Superteam</span>'),`
          <tr>
            <td>${C}</td>
            <td>
              <div class="event-rider-info">
                ${Te}
                ${O}
                ${W}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${Vi(je)}</span>
                  ${Y}
                </div>
                ${w.detail?`<div class="event-detail">${Vi(w.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':P&&h?h.rows.map(C=>{const X=C.riderName??C.teamName,ne=C.riderName?C.teamName:"–",ee=aa(C.teamId,C.teamName),Pe=ra(X,!0,C.isBreakaway===!0,C.riderId,C.teamId),Te=mt(_t(C.riderId)),Re=h.resultTypeId===1&&C.rank===1&&C.timeSeconds!=null&&x!=null,je=C.timeSeconds!=null?`${_a(C.timeSeconds)}${Re?` (${$g(x,C.timeSeconds)})`:""}`:"–",dt=H?`<td class="results-gc-delta-cell">${Er(C.previousRank,C.rankDelta)}</td>`:"";if(R){let O=C.points!=null?String(C.points):"–";if(C.points!=null&&C.riderId!=null&&h){const Y=h.resultTypeId===Cr?$.get(C.riderId)??0:D.get(C.riderId)??0;Y>0&&(O+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${Y}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(C.rank,3)}">${C.rank}</td>
            ${dt}
            <td class="results-jersey-col-cell">${ee}</td>
            <td>${Pe}${xr(C.riderId)}</td>
            <td class="results-flag-col-cell">${Te}</td>
            <td>${rt(ne,C.teamId)}</td>
            <td class="results-points-cell">${O}</td>
            <td>${C.uciPoints!=null?C.uciPoints:"–"}</td>
          </tr>`}if(N){let O=C.breakawayKms!=null?`${C.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if(C.breakawayKms!=null&&C.riderId!=null){const W=E.get(C.riderId)??0;W>0&&(O+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${W.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min(C.rank,3)}">${C.rank}</td>
            ${dt}
            <td class="results-jersey-col-cell">${ee}</td>
            <td>${Pe}${xr(C.riderId)}</td>
            <td class="results-flag-col-cell">${Te}</td>
            <td>${rt(ne,C.teamId)}</td>
            <td class="results-points-cell">${O}</td>
            <td>${C.uciPoints!=null?C.uciPoints:"–"}</td>
          </tr>`}if(F)return`
          <tr>
            <td class="pos-${Math.min(C.rank,3)}">${C.rank}</td>
            ${dt}
            <td class="results-jersey-col-cell">${ee}</td>
            <td>${rt(C.teamName,C.teamId)}</td>
            <td class="results-flag-col-cell">${Te}</td>
            <td>${je}</td>
            <td>${S(vr(C.gapSeconds))}</td>
            <td>${C.uciPoints!=null?C.uciPoints:"–"}</td>
          </tr>`;let B=C.points!=null?String(C.points):"–";if(C.leadoutBonus!=null&&C.leadoutBonus>0&&C.leadoutRiderId!=null){const O=Rg(C);B=`
          <div class="leadout-bonus-anchor">
            ${C.points!=null?C.points:"–"}
            ${O}
          </div>
        `}return`
            <tr>
              <td class="pos-${Math.min(C.rank,3)}">${C.rank}</td>
              ${dt}
              <td class="results-jersey-col-cell">${ee}</td>
              <td>${Pe}${xr(C.riderId)}</td>
              <td class="results-flag-col-cell">${Te}</td>
              <td>${rt(ne,C.teamId)}</td>
              <td>${je}</td>
              <td>${S(vr(C.gapSeconds))}</td>
              <td class="results-points-cell">${B}</td>
              <td>${C.uciPoints!=null?C.uciPoints:"–"}</td>
            </tr>`}).join(""):"",n.classList.toggle("hidden",!!h||b||y||k),i.classList.toggle("hidden",!P||k),V){const w=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${S(go(V.markerType,V.markerLabel))}</h4>
          <div class="results-marker-card-meta">${S(`${V.kmMark.toFixed(1).replace(".",",")} km${V.markerCategory?` · Kat. ${V.markerCategory}`:""}`)}</div>
        </div>
      </section>`,X=V.entries.map(ne=>{var Re;const ee=Me(ne.riderId),Pe=ee?`${ee.firstName} ${ee.lastName}`:`Fahrer ${ne.riderId}`,Te=(ee==null?void 0:ee.activeTeamId)!=null?((Re=d.teams.find(je=>je.id===ee.activeTeamId))==null?void 0:Re.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${ne.rank}.</div>
          <div class="results-marker-jersey">${aa(ee==null?void 0:ee.activeTeamId,Te)}</div>
          <div class="results-marker-name">${ra(Pe,!1,!1,(ee==null?void 0:ee.id)??null,(ee==null?void 0:ee.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${mt(_t(ee==null?void 0:ee.id))}</div>
          <div class="results-marker-time">${S(_a(ne.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${S(vr(ne.gapSeconds))}</div>
          <div class="results-marker-points">${ne.pointsAwarded!=null&&ne.pointsAwarded>0?ne.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${w}<div class="results-marker-list">${X}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!V)}function Ig(){v("results-race-select").addEventListener("change",e=>{var r,s;const t=e.target.value;d.selectedResultsRaceId=t?Number(t):null;const a=Ht(d.selectedResultsRaceId);d.selectedResultsStageId=((s=(r=a==null?void 0:a.stages)==null?void 0:r[0])==null?void 0:s.id)??null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=ut,d.selectedResultsSpecialView=null,d.stageResults=null,Ae(),d.selectedResultsStageId!=null&&As(d.selectedResultsStageId,!0)}),v("results-stage-select").addEventListener("change",e=>{const t=e.target.value;d.selectedResultsStageId=t?Number(t):null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=ut,d.selectedResultsSpecialView=null,d.stageResults=null,Ae(),d.selectedResultsStageId!=null&&As(d.selectedResultsStageId,!0)}),v("results-type-tabs").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-result-type-id]");if(t){d.selectedResultsSpecialView=null,d.selectedResultTypeId=Number(t.dataset.resultTypeId),Ae();return}const a=e.target.closest("button[data-results-special-view]");if(a){const s=a.dataset.resultsSpecialView;s===Sl?(d.selectedResultsSpecialView="nonFinishers",Ae()):s===kl?(d.selectedResultsSpecialView="events",Ye="all",Ae()):s===$l&&(d.selectedResultsSpecialView="roster",d.selectedResultsRaceId!=null&&((r=d.resultsRoster)==null?void 0:r.raceId)!==d.selectedResultsRaceId&&xl(d.selectedResultsRaceId).then(()=>Ae()),Ae())}}),v("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const r=t.dataset.markerKey;d.selectedResultsMarkerKey=r??ut,Ae();return}const a=e.target.closest("button[data-event-filter]");a&&(Ye=a.dataset.eventFilter??"all",Ae())})}const Sn=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],Ja=["skills","form","profile","preferences"],kn=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],$n={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...Sn.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function xn(){return[...kn,...$n[d.teamDetailPage]]}function Tl(e,t=12){const a=d.riders.filter(s=>s.activeTeamId===e).sort((s,n)=>n.overallRating-s.overallRating).slice(0,t);return a.length===0?null:a.reduce((s,n)=>s+n.overallRating,0)/a.length}function wl(e){const t=d.riders.filter(r=>r.activeTeamId===e);return t.length===0?null:t.reduce((r,s)=>r+s.overallRating,0)/t.length}function Ml(e){const t=Tl(e);return t==null?"–":t.toFixed(2).replace(".",",")}function Rl(e){const t=wl(e);return t==null?"–":t.toFixed(2).replace(".",",")}function le(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function Be(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:le(e,t)}function Ce(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function He(e){return e==null?void 0:typeof e=="string"?oa(e):e.name}function Tn(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...Sn.map(t=>t.key)].includes(e)?"desc":"asc"}function Il(e){return d.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function Cl(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Il(e.sortKey)}
      </button>
    </th>`}function Fl(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${Ja.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const El={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function wn(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":El[e]??String(e)}function Pl(e){const t=[...e],a=d.teamTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(d.teamTableSort.key){case"name":n=le(r.lastName,s.lastName)||le(r.firstName,s.firstName);break;case"countryCode":n=le(Bt(r),Bt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=le(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=le(Rt(r),Rt(s));break;case"riderType":n=le(r.riderType,s.riderType)||le(Ge(r),Ge(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Be(He(r.specialization1),He(s.specialization1));break;case"specialization2":n=Be(He(r.specialization2),He(s.specialization2));break;case"specialization3":n=Be(He(r.specialization3),He(s.specialization3));break;case"peak1":n=Be(Ce(r,0),Ce(s,0));break;case"peak2":n=Be(Ce(r,1),Ce(s,1));break;case"peak3":n=Be(Ce(r,2),Ce(s,2));break;default:n=r.skills[d.teamTableSort.key]-s.skills[d.teamTableSort.key];break}return n===0&&(n=le(r.lastName,s.lastName)||le(r.firstName,s.firstName)),n*a}),t}function Nl(e){const t=[...e],a=d.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(d.riderMenuTableSort.key){case"name":n=le(r.lastName,s.lastName)||le(r.firstName,s.firstName);break;case"countryCode":n=le(Bt(r),Bt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=le(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=le(Rt(r),Rt(s));break;case"riderType":n=le(r.riderType,s.riderType)||le(Ge(r),Ge(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Be(He(r.specialization1),He(s.specialization1));break;case"specialization2":n=Be(He(r.specialization2),He(s.specialization2));break;case"specialization3":n=Be(He(r.specialization3),He(s.specialization3));break;case"peak1":n=Be(Ce(r,0),Ce(s,0));break;case"peak2":n=Be(Ce(r,1),Ce(s,1));break;case"peak3":n=Be(Ce(r,2),Ce(s,2));break;default:n=r.skills[d.riderMenuTableSort.key]-s.skills[d.riderMenuTableSort.key];break}return n===0&&(n=le(r.lastName,s.lastName)||le(r.firstName,s.firstName)),n*a}),t}function Bs(e){return e.length===0?"–":e.map(t=>{const a=d.races.find(r=>r.id===t);return a?S(a.name):`Rennen ${t}`}).join(", ")}function Cg(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function Mn(e,t){var a,r;switch(t.id){case"name":return`<td class="team-table-name-cell">${De(Ge(e),{riderId:e.id,teamId:e.activeTeamId,strong:d.teamDetailPage==="form"||d.teamDetailPage==="profile"||d.teamDetailPage==="preferences"})}${$o(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${ce(Bt(e))}<span>${S(Bt(e))}</span></span></td>`;case"age":return`<td>${e.age??(d.gameState?d.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${S(Rt(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating.toFixed(2)}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${Es(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${So(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${Es((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${Ps(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${Ps(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${tn(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${S(Ce(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${S(Ce(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${S(Ce(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${S(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?S(oa(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?S(oa(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?S(oa(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${ko(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${ce(e.mentorCountryCode??"UNK")} <span>${S(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${Bs(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${Bs(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const s=t.sortKey;return s&&s in e.skills?`<td>${vo(e.skills[s],(a=e.yearStartSkills)==null?void 0:a[s],(r=e.potentials)==null?void 0:r[s])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function Vr(){Fe("Teams/Fahrer werden aktualisiert...");try{const e=!xe("riders"),t=await Z.getRiders(void 0,e);if(t.success&&(d.riders=t.data??[]),await Z.getTeams().then(a=>{a.success&&(d.teams=a.data??[])}),xe("teams")&&Rn(),xe("riders")){const{renderRidersMenu:a}=await kr(async()=>{const{renderRidersMenu:r}=await Promise.resolve().then(()=>Xg);return{renderRidersMenu:r}},void 0);a()}}finally{ke()}}async function Fg(e={}){const t=await Z.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),v("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${S(t.error??"Unbekannt")}</p>`;return}d.teams=t.data??[],e.render!==!1&&xe("teams")&&Rn()}function Rn(){const e=v("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+d.teams.map(r=>`<option value="${r.id}"${String(r.id)===t?" selected":""}>${S(r.name)} (${S(r.division??r.divisionName??"")}) · ${S(r.abbreviation)}</option>`).join("");const a=t?Number(t):null;ua(a)}function ua(e){const t=v("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=d.teams.find(c=>c.id===e);if(!a){t.innerHTML="";return}const r=qs(e);if(r.some(c=>c.yearStartSkills===void 0)){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Lade Team-Daten...</p>',Z.getRiders(e,!1,!1).then(c=>{if(c.success&&c.data){const l=new Map(c.data.map(m=>[m.id,m]));d.riders=d.riders.map(m=>l.get(m.id)||m),ua(e)}}).catch(console.error);return}const n=Pl(r),i=a.division==="U23"?"badge-u23":"badge-classics",o=xn();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${S(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${i}">${S(a.division??a.divisionName??"")}</span>
          <span>${fo(a.country,a.countryCode)}</span>
          <span>Kürzel: ${S(a.abbreviation)} · Top 12 ${S(Ml(a.id))} (${S(Rl(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${n.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(wn(d.teamTableSort.key))} ${d.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Fl()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${o.map(Cl).join("")}
          </tr></thead>
          <tbody>
            ${n.length===0?`<tr><td colspan="${o.length}" class="text-muted">Keine Fahrer.</td></tr>`:n.map(c=>`
                <tr class="team-detail-row">
                  ${o.map(l=>Mn(c,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function Ll(){v("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;d.teamDetailPage="skills",ua(t?Number(t):null)}),v("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&En(s);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const s=a.dataset.teamDetailPage;if(Ja.includes(s)){d.teamDetailPage=s,new Set(xn().map(o=>o.sortKey).filter(o=>o!=null)).has(d.teamTableSort.key)||(d.teamTableSort={key:"name",direction:"asc"});const i=Number(v("teams-dropdown").value);ua(Number.isFinite(i)?i:null)}return}const r=e.target.closest("button[data-team-sort]");if(r){const s=r.dataset.teamSort;d.teamTableSort.key===s?d.teamTableSort.direction=d.teamTableSort.direction==="asc"?"desc":"asc":d.teamTableSort={key:s,direction:Tn(s)};const n=Number(v("teams-dropdown").value);ua(Number.isFinite(n)?n:null);return}})}const Eg=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:$n,TEAM_DETAIL_PAGE_ORDER:Ja,TEAM_SKILL_COLUMNS:Sn,TEAM_SKILL_TITLES:El,TEAM_TABLE_COLUMNS:kn,compareOptionalStrings:Be,compareStrings:le,formatTeamAverage:Rl,formatTeamTopAverage:Ml,getActiveTeamTableColumns:xn,getDefaultTeamSortDirection:Tn,getPeakDate:Ce,getSortIndicator:Il,getSpecializationSortLabel:He,getTeamAverage:wl,getTeamSortLabel:wn,getTeamTopAverage:Tl,initTeamsListeners:Ll,loadTeams:Fg,refreshTeamsViewData:Vr,renderPeakDatesSummary:Cg,renderRacePrefs:Bs,renderTeamDetail:ua,renderTeamDetailPageTabs:Fl,renderTeamTableCell:Mn,renderTeamTableHeader:Cl,renderTeams:Rn,sortRiderMenuRiders:Nl,sortTeamRiders:Pl},Symbol.toStringTag,{value:"Module"}));function Pg(e,t,a){return`${e} · Etappe ${t} · ${a}`}function Dl(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function _l(e,t){const a=[];for(const r of e.riders)if(r.leadoutBonus!=null&&r.leadoutBonus>0&&r.leadoutContributions&&r.leadoutContributions.length>0){const s=t.riders.find(i=>i.id===r.riderId),n=(s==null?void 0:s.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:r.riderId,leadoutBonus:r.leadoutBonus,contributorsJson:JSON.stringify(r.leadoutContributions)})}return a}async function Al(e,t=!1){if(Us!=null||qr)return!1;Is(e),yo(0);try{const a=await Z.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const r=a.data;d.realtimeBootstrap=r;const s=await bu(r,o=>Xs(o)),n=Dl(s,r),i=_l(s,r);return await Ol(e,n,s.markerClassifications,s.incidents,s.allEvents,t,i,s.superTeamId),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{Is(null),ke()}}function Bl(e){var r;const t=(r=d.rosterEditor)==null?void 0:r.teams.find(s=>s.team.id===e);if(!t)return 0;const a=new Set(d.rosterEditorSelectedRiderIds);return t.riders.filter(s=>a.has(s.rider.id)).length}function Hl(){return d.rosterEditor?d.rosterEditor.teams.every(e=>Bl(e.team.id)===e.riderLimit):!1}function xs(){const e=v("roster-editor-title"),t=v("roster-editor-meta"),a=v("roster-editor-body"),r=v("btn-apply-roster-editor"),s=d.rosterEditor;if(!s){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',r.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=s.race.isStageRace?`${s.race.name} · Etappe ${s.stage.stageNumber} · ${s.stage.profile}`:`${s.race.name} · ${s.stage.profile}`;const n=new Set(d.rosterEditorSelectedRiderIds);a.innerHTML=s.teams.map(i=>{const o=Bl(i.team.id),c=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${S(i.team.name)}</h3>
            <p class="text-muted">${S(i.team.abbreviation)} · ${S(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${c}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var h;const p=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),u=l.rider.country?ce(l.rider.country.code3):"",f=[((h=l.rider.role)==null?void 0:h.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),g=l.lockReason?`<span class="roster-editor-rider-lock">${S(l.lockReason)}</span>`:"";return`
              <button
                type="button"
                class="${p}"
                data-roster-team-id="${i.team.id}"
                data-roster-rider-id="${l.rider.id}"
                ${l.isLocked?"disabled":""}
              >
                <span class="roster-editor-rider-name">${u}<span>${S(l.rider.firstName)} ${S(l.rider.lastName)}</span></span>
                <span class="roster-editor-rider-meta">${S(f)}</span>
                ${g}
              </button>`}).join("")}
        </div>
      </section>`}).join(""),r.disabled=!Hl()}function Hs(){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],ha("roster-editor-error"),tt("rosterEditor")}function zl(e,t){d.selectedRealtimeStageId=e.stage.id,d.realtimeBootstrap=e,d.realtimeError=null,t&&zt("live-race"),Gl().load(e,{autoplay:!0,resetSpeed:!0}),ma()}function Gl(){let e=ia;if(!e){const t=v("race-sim-layout"),a=v("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new vg({layout:t,emptyState:a,controlsHeader:v("race-sim-controls-header"),profile:v("race-sim-profile"),groupBox:v("race-sim-group-box"),messages:v("race-sim-messages-body"),favorites:v("race-sim-favorites-body"),sidebar:v("race-sim-sidebar-body"),controls:v("race-sim-controls"),meta:v("race-sim-stage-meta")},{onFinishRequested:(r,s)=>{const n=Dl(r,s),i=_l(r,s);Ol(s.stage.id,n,r.markerClassifications,r.incidents,r.allEvents,!1,i,r.superTeamId)}}),mo(e)}return e}async function Ng(e){Fe("Starterfeld wird geladen..."),ha("roster-editor-error");try{const t=await Z.getRosterEditor(e);if(!t.success||!t.data){At("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),gt("rosterEditor"),xs();return}d.rosterEditor=t.data,d.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(r=>r.isSelected).map(r=>r.rider.id)),xs(),gt("rosterEditor")}catch(t){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],At("roster-editor-error",t.message),gt("rosterEditor"),xs()}finally{ke()}}async function Lg(){const e=d.rosterEditor;if(e){if(!Hl()){At("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}ha("roster-editor-error"),Fe("Starterfeld wird übernommen...");try{const t=await Z.applyRosterEditor(e.stage.id,{riderIds:d.rosterEditorSelectedRiderIds});if(!t.success||!t.data){At("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}Hs(),zl(t.data,!0)}catch(t){At("roster-editor-error",t.message)}finally{ke()}}}function ma(){var n,i;const e=v("race-sim-stage-select"),t=((n=d.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===d.selectedRealtimeStageId)||(d.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===d.selectedRealtimeStageId?" selected":""}>${S(Pg(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const r=t.find(o=>o.stageId===d.selectedRealtimeStageId)??null,s=Gl();if(!r){d.realtimeBootstrap=null,d.realtimeError=null,s.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!d.realtimeBootstrap||d.realtimeBootstrap.stage.id!==r.stageId)&&(d.realtimeError?s.clear(d.realtimeError):s.hide())}async function Kl(e,t){if(Ir!==e){Cs(e),d.selectedRealtimeStageId=e,t&&zt("live-race"),ma(),Fe("Live-Simulation wird geladen...");try{const a=await Z.getRealtimeSimulation(e);if(!a.success||!a.data){d.realtimeBootstrap=null,d.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",ma(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}zl(a.data,!1)}catch(a){d.realtimeBootstrap=null,d.realtimeError=a.message,ma(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{Ir===e&&Cs(null),ke()}}}async function Ol(e,t,a,r,s,n=!1,i,o){if(!qr){Rs(!0),Fe("Live-Ergebnis wird gespeichert...");try{const c=await Z.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:r,events:s,leadoutContributions:i,superTeamId:o});if(!c.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(c.error??"Unbekannter Fehler"));return}const l=c.data;d.selectedResultsRaceId=(l==null?void 0:l.raceId)??d.selectedResultsRaceId,d.selectedResultsStageId=(l==null?void 0:l.stageId)??e,d.selectedResultTypeId=1,d.realtimeBootstrap=null,d.realtimeError=null,await As(e,!1),await Cn(),await Fn(),(xe("teams")||xe("riders"))&&await Vr(),ma(),n||zt("results")}catch(c){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+c.message)}finally{Rs(!1),ke()}}}function Dg(){v("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);d.selectedRealtimeStageId=Number.isFinite(t)?t:null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null),d.realtimeError=null,Kl(t,!1)})}function In(e){var r;const t=lt((r=e.category)==null?void 0:r.name),a=Wa(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function is(e){var s,n;const t=lt((s=e.category)==null?void 0:s.name),a=Wa(t),r=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${S(r)}</span>`}function _g(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(r=>r.date).sort((r,s)=>r.localeCompare(s));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function os(e){const{startDate:t,endDate:a}=_g(e);return t===a?de(t):`${de(t)} - ${de(a)}`}function Ag(e){return e.stageId>0}async function Cn(){const[e,t]=await Promise.all([Z.getGameState(),Z.getGameStatus()]);if(!e.success){console.error(e.error);return}d.gameState=e.data??null,d.gameStatus=t.success?t.data??null:null,Bg(),xe("dashboard")&&ls()}function Bg(){var s;if(!d.gameState)return;v("meta-date").textContent=d.gameState.formattedDate,v("meta-season").textContent=`Saison ${d.gameState.season}`;const e=v("meta-race-hint"),t=v("btn-advance-day"),a=v("pending-stages-list"),r=((s=d.gameStatus)==null?void 0:s.pendingStages)??[];r.length>0?(e.textContent=`${r.length} offene Etappe${r.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=r.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${de(n.date)}`:`${n.profile} · ${de(n.date)}`,o=Ag(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
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
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):d.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function ls(){var t,a,r,s,n;const e=d.teams.find(i=>i.isPlayerTeam)??d.teams.find(i=>{var o;return i.name===((o=d.currentSave)==null?void 0:o.teamName)})??null;v("dashboard-career").textContent=((t=d.currentSave)==null?void 0:t.careerName)??"–",v("dashboard-team").textContent=(e==null?void 0:e.name)??((a=d.currentSave)==null?void 0:a.teamName)??"–",v("dashboard-date").textContent=((r=d.gameState)==null?void 0:r.formattedDate)??"–",v("dashboard-season").textContent=d.gameState?`Saison ${d.gameState.season}`:"–",v("dashboard-races-today").textContent=String(((s=d.gameStatus)==null?void 0:s.pendingStages.length)??((n=d.gameState)==null?void 0:n.racesTodayCount)??0),zg()}async function Fn(){const e=await Z.getRaces();if(!e.success){console.error(e.error);return}d.races=e.data??[],xe("dashboard")&&ls()}function Hg(e,t){const[a,r,s]=e.split("-").map(Number),n=new Date(a,r-1,s);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),c=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${c}`}function Ui(e){var m,p,u,f;const t=d.gameState!=null&&e.startDate<=d.gameState.currentDate&&e.endDate>=d.gameState.currentDate,r=d.gameState!=null&&e.endDate<d.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',s=((m=e.country)==null?void 0:m.name)??`Land ${e.countryId}`,n=(p=e.country)!=null&&p.code3?ce(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((g,h)=>g+(h.distanceKm??0),0):((u=e.upcomingStage)==null?void 0:u.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((g,h)=>g+(h.elevationGainMeters??0),0):((f=e.upcomingStage)==null?void 0:f.elevationGainMeters)??null,c=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${de(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${S(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${In(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${S(s)}</span></span></td>
      <td>${is(e)}</td>
      <td>${c}</td>
      <td>${l}</td>
      <td>${r}</td>
    </tr>`}function zg(){const e=v("dashboard-races-tbody");if(!d.gameState){e.innerHTML='<tr><td colspan="8" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=d.gameState.currentDate,a=Hg(t,7),r=d.races.filter(i=>i.startDate<=t&&i.endDate>=t),s=d.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="8"><strong>In Progress</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="8" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=r.map(i=>Ui(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="8"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="8" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=s.map(i=>Ui(i)).join(""),e.innerHTML=n}function qa(e){return`Etappe ${e.stageNumber}`}function Gg(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,r)=>r[1]!==a[1]?r[1]-a[1]:a[0].localeCompare(r[0])).map(([a,r])=>`${r}x ${a}`).join(" · ")}function Kg(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function Xa(e){return`<span class="stage-profile-badge ${Kg(e)}">${S(e)}</span>`}function ds(e,t){return`${e.name} · ${qa(t)} · ${t.profile}`}async function Og(e){var s;const t=d.stageSummariesByStageId[e];if(t)return t;const a=await Z.getStageSummary(e);if(a.success&&a.data)return d.stageSummariesByStageId[e]=a.data,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],a.data;const r=await Z.getRealtimeSimulation(e);return r.success&&((s=r.data)!=null&&s.stageSummary)?(d.stageSummariesByStageId[e]=r.data.stageSummary,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],r.data.stageSummary):(d.stageSummaryErrorsByStageId&&(d.stageSummaryErrorsByStageId[e]=a.error??r.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:r.error}),d.stageSummariesByStageId&&delete d.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function jg(){var c;const e=v("race-stages-title"),t=v("race-stages-meta"),a=v("race-stages-body"),r=Ht(d.selectedDashboardRaceId);if(!r){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const s=r.stages??[],n=s.reduce((l,m)=>l+(m.distanceKm??0),0),i=s.reduce((l,m)=>l+(m.elevationGainMeters??0),0),o=Gg(s);if(e.textContent=r.name,t.textContent=`${os(r)} · ${((c=r.country)==null?void 0:c.name)??`Land ${r.countryId}`} · ${r.isStageRace?`${r.numberOfStages} Etappen`:"Eintagesrennen"} · ${Pr(n)} · ${Nr(i)} · ${o}`,s.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
                <td>${de(l.date)}</td>
                <td><strong>${S(qa(l))}</strong></td>
                <td>${Xa(l.profile)}</td>
                <td>${l.distanceKm!=null?Pr(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?Nr(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${S(ds(r,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function zs(e){Ht(e)&&(d.selectedDashboardRaceId=e,jg(),gt("raceStages"))}function Wg(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,r;return`
            <tr>
              <td>${os(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?ce(t.country.code3):""}<span>${S(((r=t.country)==null?void 0:r.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${S(t.name)}</strong></td>
              <td>${is(t)}</td>
              <td>${In(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function En(e){const t=d.riders.find(r=>r.id===e);v("rider-program-title").textContent=t?Ge(t):"Programm",v("rider-program-meta").textContent="Lade Programmrennen ...",v("rider-program-body").innerHTML="",gt("riderProgram");const a=await Z.getRiderProgramRaces(e);if(!a.success||!a.data){v("rider-program-meta").textContent="",v("rider-program-body").innerHTML=`<div class="results-empty">${S(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}v("rider-program-title").textContent=a.data.program.name,v("rider-program-meta").textContent=t?Ge(t):"",v("rider-program-body").innerHTML=Wg(a.data)}function Vg(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=Ug(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${Wt("Team","team","Team")}
          ${Wt("Fahrer","rider","Fahrer")}
          ${Wt("Spec1","spec1","Spezialisierung 1")}
          ${Wt("Rolle","role","Rolle")}
          ${Wt("Ges","overall","Gesamtstärke")}
          ${Wt("Phase","phase","Formphase")}
          ${Wt("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var r,s;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${Mt((r=a.team)==null?void 0:r.id,(s=a.team)==null?void 0:s.name)}</td>
              <td><span class="race-participant-rider-cell">${ce(Bt(a.rider))}<strong>${S(Ge(a.rider))}</strong></span></td>
              <td>${S(Gs(a.rider))}</td>
              <td>${S(Rt(a.rider))}</td>
              <td>${en(a.rider.overallRating)}</td>
              <td>${tn(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${S(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function Wt(e,t,a){const r=d.raceParticipantsSort.key===t?" race-participants-sort-active":"",s=d.raceParticipantsSort.key===t?d.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${S(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${r}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${d.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${s}</span>
      </button>
    </th>`}function Ug(e){const t=d.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{var n,i,o,c;let s=0;switch(d.raceParticipantsSort.key){case"team":s=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=r.team)==null?void 0:i.name)??"","de");break;case"rider":s=Ge(a.rider).localeCompare(Ge(r.rider),"de");break;case"spec1":s=Gs(a.rider).localeCompare(Gs(r.rider),"de");break;case"role":s=Rt(a.rider).localeCompare(Rt(r.rider),"de");break;case"overall":s=a.rider.overallRating-r.rider.overallRating;break;case"phase":s=(a.rider.seasonFormPhase??"neutral").localeCompare(r.rider.seasonFormPhase??"neutral","de");break;default:s=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((c=r.program)==null?void 0:c.name)??"","de")}return s*t||Ge(a.rider).localeCompare(Ge(r.rider),"de")})}function Gs(e){return e.specialization1!=null?oa(e.specialization1):"–"}async function Yg(e=!1){const t=d.selectedRaceParticipantsRaceId;if(t==null)return;const a=Ht(t);e&&(v("race-participants-meta").textContent="Lade Programmfahrer ...");const r=await Z.getRaceProgramParticipants(t);if(!r.success||!r.data){v("race-participants-meta").textContent="",v("race-participants-body").innerHTML=`<div class="results-empty">${S(r.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}d.raceParticipants=r.data,v("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",v("race-participants-meta").textContent=`${r.data.length} Programmfahrer · ${a?os(a):""}`,v("race-participants-body").innerHTML=Vg(d.raceParticipants)}async function Ur(e,t=null){let a=Aa(e);if(!a&&d.stageEditorStageRows){const n=d.stageEditorStageRows.find(i=>i.stageId===e);n&&(a={race:{id:n.raceId,name:n.raceName,countryId:0,categoryId:0,isStageRace:!0,numberOfStages:1,startDate:"",endDate:"",prestige:0},stage:{id:n.stageId,raceId:n.raceId,stageNumber:n.stageNumber,date:"2026-01-01",profile:n.profile,startElevation:0,detailsCsvFile:"",distanceKm:n.distanceKm,elevationGainMeters:n.elevationGainMeters}})}if(!a)return;const r=await Og(e);if(!r){alert(d.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}d.selectedDashboardProfileStageId=e,v("stage-profile-title").textContent=`${a.race.name} · ${qa(a.stage)}`;const s=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";v("stage-profile-meta").textContent=`${de(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?Pr(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?Nr(a.stage.elevationGainMeters):"–"}${s}`,Ld(v("stage-profile-view"),r,a.stage.profile,ds(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),gt("stageProfile")}function Zg(){v("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const s=Number(t.dataset.editStageRoster);if(!Number.isFinite(s))return;Ng(s);return}const a=e.target.closest("button[data-live-stage]");if(a){const s=Number(a.dataset.liveStage);if(!Number.isFinite(s))return;Kl(s,!0);return}const r=e.target.closest("button[data-instant-stage]");if(r){const s=Number(r.dataset.instantStage);if(!Number.isFinite(s))return;Al(s)}}),v("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-id]");if(!t)return;const a=Number(t.dataset.dashboardRaceId);Number.isFinite(a)&&zs(a)}),v("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&Ur(a)}),v("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&En(s);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const r=a.dataset.raceParticipantsSort;d.raceParticipantsSort.key===r?d.raceParticipantsSort.direction=d.raceParticipantsSort.direction==="asc"?"desc":"asc":d.raceParticipantsSort={key:r,direction:"asc"},Yg()}),v("btn-advance-day").addEventListener("click",async()=>{await jl()}),v("btn-auto-progress").addEventListener("click",()=>{Jg()})}async function jl(){var t,a;Fe("Tag wird fortgeschrieben...");const e=(t=d.gameState)==null?void 0:t.season;try{const r=await Z.advanceDay();if(!r.success)return alert(`Tageswechsel fehlgeschlagen:
`+(r.error??"Unbekannter Fehler")),!1;if(d.currentSave&&r.data&&(d.currentSave.currentSeason=r.data.season),await Cn(),await Fn(),xe("teams")){const{refreshTeamsViewData:n}=await kr(async()=>{const{refreshTeamsViewData:i}=await Promise.resolve().then(()=>Eg);return{refreshTeamsViewData:i}},void 0);await n()}const s=(a=d.gameState)==null?void 0:a.season;if(e&&s&&s>e){Ga();const{startDraftPresentation:n}=await kr(async()=>{const{startDraftPresentation:o}=await Promise.resolve().then(()=>Sf);return{startDraftPresentation:o}},void 0),{activateView:i}=await kr(async()=>{const{activateView:o}=await Promise.resolve().then(()=>hd);return{activateView:o}},void 0);i("draft"),await n(s)}return!0}catch(r){return alert("Unerwarteter Fehler beim Tageswechsel: "+r.message),!1}finally{ke()}}function Pn(){const e=document.getElementById("btn-auto-progress");e&&(vt?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function Jg(){vt?Ga():Wl()}function Wl(){vt||(Ys(!0),Pn(),qg())}function Ga(){vt&&(Ys(!1),d.autoProgressTargetDate=null,Pn())}async function qg(){var e,t;for(;vt;){const a=(e=d.gameState)==null?void 0:e.currentDate;if(d.autoProgressTargetDate&&a&&a>=d.autoProgressTargetDate){Ga();break}const r=((t=d.gameStatus)==null?void 0:t.pendingStages)??[];let s=!1;if(r.length>0){const n=r[0];s=await Al(n.stageId,!0)}else s=await jl();if(!s){Ga();break}await new Promise(n=>setTimeout(n,100))}Pn()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&vt){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),Ga()}});const Na=50;function Nn(){return[...kn,...$n[d.riderMenuDetailPage]]}function Vl(e){return d.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function Ul(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Vl(e.sortKey)}
      </button>
    </th>`}function Yl(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${Ja.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function Tr(){const e=v("riders-detail"),t=Nn(),a=Nl(d.riders),r=a.length,s=Math.max(1,Math.ceil(r/Na));d.riderMenuPage=Math.min(s,Math.max(1,d.riderMenuPage));const n=(d.riderMenuPage-1)*Na,i=Math.min(r,n+Na),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(wn(d.riderMenuTableSort.key))} ${d.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Yl()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(Ul).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(c=>`
                <tr class="team-detail-row">
                  ${t.map(l=>Mn(c,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${d.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${d.riderMenuPage} / ${s} · Fahrer ${r===0?0:n+1}-${i} von ${r}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${d.riderMenuPage>=s?"disabled":""}>Weiter</button>
      </div>
    </div>`}function Zl(){v("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&En(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;Ja.includes(n)&&(d.riderMenuDetailPage=n,new Set(Nn().map(o=>o.sortKey).filter(o=>o!=null)).has(d.riderMenuTableSort.key)||(d.riderMenuTableSort={key:"name",direction:"asc"}),d.riderMenuPage=1,Tr());return}const r=e.target.closest("button[data-riders-sort]");if(r){const n=r.dataset.ridersSort;d.riderMenuTableSort.key===n?d.riderMenuTableSort.direction=d.riderMenuTableSort.direction==="asc"?"desc":"asc":d.riderMenuTableSort={key:n,direction:Tn(n)},d.riderMenuPage=1,Tr();return}const s=e.target.closest("button[data-riders-page-action]");if(s){const n=s.dataset.ridersPageAction,i=Math.max(1,Math.ceil(d.riders.length/Na));n==="prev"&&(d.riderMenuPage=Math.max(1,d.riderMenuPage-1)),n==="next"&&(d.riderMenuPage=Math.min(i,d.riderMenuPage+1)),Tr();return}})}const Xg=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:Na,getActiveRiderMenuTableColumns:Nn,getRiderMenuSortIndicator:Vl,initRidersListeners:Zl,renderRiderMenuDetailPageTabs:Yl,renderRiderMenuTableHeader:Ul,renderRidersMenu:Tr},Symbol.toStringTag,{value:"Module"})),fr=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function bt(e){return e==null?"free-agents":String(e)}function Yi(e){var a;const t=d.riderTeamEditorPayload;return t?((a=t.teams.find(r=>r.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function Qg(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return Qs(t/11.2,0,100)}function ef(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function tf(e){return d.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function af(e){const t=d.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${S(e.title)}"
        aria-label="${S(e.title)}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${tf(e.key)}
      </button>
    </th>`}function rf(e,t){switch(d.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return le(e.firstName,t.firstName);case"lastName":return le(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return le(Yi(e.teamId),Yi(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return le(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return le(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function sf(e){const t=d.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>(rf(a,r)||le(a.lastName,r.lastName)||le(a.firstName,r.firstName)||a.riderId-r.riderId)*t)}function nf(e){const t=d.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(r=>bt(r.teamId)===t);return sf(a)}function of(e){const t=d.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${bt(a.teamId)}"${a.teamId===e?" selected":""}>${S(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function Jl(e){return d.riderTeamEditorDirtyRiderIds.includes(e)}function lf(e,t){const a=Jl(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${Qr(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${of(e.teamId)}</select></td>`;case"number":{const r=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${r}"></td>`}case"text":{const r=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${S(r)}"></td>`}default:return"<td>–</td>"}}function df(e){const t=[...e.teams].sort((a,r)=>a.rank-r.rank||le(a.name,r.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${d.riderTeamEditorSelectedTeamKey===bt(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${bt(a.teamId)}">
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
    </aside>`}function qe(){var o;const e=v("rider-team-editor-root"),t=v("rider-team-editor-meta"),a=d.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const r=d.riderTeamEditorSelectedTeamKey?a.teams.find(c=>bt(c.teamId)===d.riderTeamEditorSelectedTeamKey)??null:null,s=nf(a),n=d.riderTeamEditorDirtyRiderIds.length,i=r==null?"Kein Team gewählt":`${r.riderCount} Fahrer · Ø ${r.averageOverall!=null?r.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${r.rank}`;t.textContent=r==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${r.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${d.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(c=>`
                  <option value="${bt(c.teamId)}"${d.riderTeamEditorSelectedTeamKey===bt(c.teamId)?" selected":""}>${S(c.name)} (${c.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${S(d.riderTeamEditorSort.key==="teamName"?"Team":((o=fr.find(c=>c.key===d.riderTeamEditorSort.key))==null?void 0:o.title)??d.riderTeamEditorSort.key)} ${d.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${fr.map(af).join("")}
                </tr>
              </thead>
              <tbody>
                ${s.length===0?`<tr><td colspan="${fr.length}" class="text-muted">${d.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:s.map(c=>`
                    <tr class="team-detail-row${Jl(c.riderId)?" rider-team-editor-row-dirty":""}">
                      ${fr.map(l=>lf(c,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${df(a)}
    </div>`}function cf(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),c=o.length===0?null:Math.round(o.reduce((l,m)=>l+m.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:c,rank:0}}),r=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:r.length,averageOverall:r.length===0?null:Math.round(r.reduce((i,o)=>i+o.overallRating,0)/r.length*100)/100,rank:0,isFreeAgents:!0});const s=[...a].sort((i,o)=>{const c=i.averageOverall??-1;return(o.averageOverall??-1)-c||o.riderCount-i.riderCount||le(i.name,o.name)}),n=new Map(s.map((i,o)=>[bt(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(bt(i.teamId))??a.length}))}async function ql(e=!1){if(d.riderTeamEditorPayload&&!e){qe();return}v("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await Z.getRiderTeamEditor();if(!t.success||!t.data){v("rider-team-editor-root").innerHTML=`<div class="results-empty">${S(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}d.riderTeamEditorPayload=t.data,d.riderTeamEditorDirtyRiderIds=[],d.riderTeamEditorSaving=!1,d.riderTeamEditorExporting=!1,d.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(r=>bt(r.teamId)===d.riderTeamEditorSelectedTeamKey)||(d.riderTeamEditorSelectedTeamKey="")),qe()}function uf(e,t,a){const r=d.riderTeamEditorPayload;if(!r)return;const s=r.riders.find(n=>n.riderId===e);s&&(t==="teamId"?s.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof s[t]=="number"?s[t]=Number.parseInt(a||"0",10):s[t]=a,s.overallRating=Qg(s),r.teams=cf(r),d.riderTeamEditorDirtyRiderIds.includes(e)||(d.riderTeamEditorDirtyRiderIds=[...d.riderTeamEditorDirtyRiderIds,e]),qe())}async function mf(){if(!d.riderTeamEditorPayload||d.riderTeamEditorSaving)return;d.riderTeamEditorSaving=!0,qe();const e=await Z.saveRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),qe();return}d.riderTeamEditorPayload=e.data,d.riderTeamEditorDirtyRiderIds=[],qe()}async function pf(){if(!d.riderTeamEditorPayload||d.riderTeamEditorExporting)return;d.riderTeamEditorExporting=!0,qe();const e=await Z.exportRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),qe();return}Lr(e.data.fileName,e.data.content),qe()}function gf(){v("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const s=t.dataset.riderTeamEditorSort;d.riderTeamEditorSort.key===s?d.riderTeamEditorSort.direction=d.riderTeamEditorSort.direction==="asc"?"desc":"asc":d.riderTeamEditorSort={key:s,direction:ef(s)},qe();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){d.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",qe();return}const r=e.target.closest("button[data-rider-team-editor-action]");if(r){const s=r.dataset.riderTeamEditorAction;if(s==="reload"){ql(!0);return}if(s==="export"){pf();return}s==="save"&&mf()}}),v("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){d.riderTeamEditorSelectedTeamKey=t.value,qe();return}const a=e.target.closest(".rider-team-editor-input");if(a){const r=Number(a.dataset.riderTeamEditorRiderId),s=a.dataset.riderTeamEditorField;Number.isFinite(r)&&s&&uf(r,s,a.value)}})}let nt={key:"pickNumber",asc:!0};function Ks(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),r=.26+t*.18,s=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${r};--rider-stats-pill-bg-alpha:${s};`}function Xl(e){return nt.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${nt.asc?"↑":"↓"}</span>`}function et(e,t,a=""){const r=nt.key===t?" team-table-sort-active":"";return`
    <th class="${S(a)}">
      <button
        type="button"
        class="team-table-sort${r}"
        data-draft-sort="${S(t)}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        ${Xl(t)}
      </button>
    </th>`}async function cs(e,t=!1){const a=await Z.getDraftHistory(e);if(!a.success){d.draftHistory=null,xe("draft")&&Yr(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}d.draftHistory=a.data??null,xe("draft")&&Yr()}function Yr(){const e=v("draft-table-container"),t=v("draft-season-select");if(!d.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const s=(d.currentSave.startSeason??2026)+1;for(let n=d.currentSave.currentSeason;n>=s;n--){const i=document.createElement("option");i.value=n.toString(),i.textContent=`Saison ${n}`,t.appendChild(i)}d.draftSelectedSeason||(d.draftSelectedSeason=Math.max(s,d.currentSave.currentSeason)),t.value=d.draftSelectedSeason.toString(),t.onchange=n=>{const i=n.target;d.draftSelectedSeason=parseInt(i.value,10),cs(d.draftSelectedSeason)}}if(!d.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(d.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...d.draftHistory.rows].sort((s,n)=>{let i=0;const o=nt.key;return o==="riderLastName"?i=s.riderLastName.localeCompare(n.riderLastName):o==="teamName"?i=s.teamName.localeCompare(n.teamName):o==="oldTeamName"?i=(s.oldTeamName||"").localeCompare(n.oldTeamName||""):o==="countryCode"?i=s.countryCode.localeCompare(n.countryCode):i=(s[o]??0)-(n[o]??0),nt.asc?i:-i});let r=`
    <table class="data-table">
      <thead>
        <tr>
          ${et("Pick","pickNumber","text-center")}
          ${et("Runde","draftRound","text-center")}
          ${et("Neues Team","teamName")}
          ${et("Altes Team","oldTeamName")}
          ${et("Land","countryCode","text-center")}
          ${et("Fahrer","riderLastName")}
          ${et("Alter","riderBirthYear","text-center")}
          ${et("Vertrag","contractLength","text-center")}
          ${et("Stärke","overallAtDraft","text-center")}
          ${et("Potenzial","potOverallAtDraft","text-center")}
        </tr>
      </thead>
      <tbody>
  `;for(const s of a){const n=d.draftHistory.season-s.riderBirthYear;let i="-";s.oldTeamName&&(i=`
        <div style="display:flex; align-items:center; gap:0.5rem;">
          ${Mt(s.oldTeamId,s.oldTeamName)}
          <button class="app-team-link" data-team-id="${s.oldTeamId}" style="background: none; border: none; padding: 0; color: #94a3b8; font-weight: normal; cursor: pointer; text-align: left; font-size: inherit;">
            ${S(s.oldTeamName)}
          </button>
        </div>`);const o=`
      <div style="display:flex; align-items:center; gap:0.5rem;">
        ${Mt(s.teamId,s.teamName)}
        <button class="app-team-link" data-team-id="${s.teamId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: inherit;">
          ${S(s.teamName)}
        </button>
      </div>`;r+=`
      <tr>
        <td class="text-center">#${s.pickNumber}</td>
        <td class="text-center">Runde ${s.draftRound}</td>
        <td>${o}</td>
        <td>${i}</td>
        <td class="text-center">${ce(s.countryCode)}</td>
        <td>
          <button class="app-rider-link" data-rider-id="${s.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: inherit;">
            ${S(s.riderLastName)}
          </button>
        </td>
        <td class="text-center">${n} J.</td>
        <td class="text-center">${s.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Ks(s.overallAtDraft)}">${s.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Ks(s.potOverallAtDraft)}">${s.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}r+="</tbody></table>",e.innerHTML=r}function Ql(){v("draft-table-container").addEventListener("click",a=>{const r=a.target.closest("button[data-draft-sort]");if(r){const s=r.dataset.draftSort;s&&(nt.key===s?nt.asc=!nt.asc:(nt.key=s,nt.asc=!0),Yr())}});const t=v("draft-replay-btn");t&&t.addEventListener("click",()=>{const a=v("draft-season-select");if(a){const r=Number(a.value);isNaN(r)||ad(r)}})}function Qa(){d.draftOverlayTimer1&&(clearTimeout(d.draftOverlayTimer1),d.draftOverlayTimer1=null),d.draftOverlayTimer2&&(clearTimeout(d.draftOverlayTimer2),d.draftOverlayTimer2=null)}function ff(e,t,a){const r=d.teams.find(c=>c.id===e),s=(r==null?void 0:r.division)==="U23"?20:(r==null?void 0:r.division)==="ProTour"?30:32,n=d.riders.filter(c=>c.activeTeamId===e).length,i=a.slice(t+1).filter(c=>c.teamId===e).length,o=n-i;return Math.max(0,s-o)}function $t(e,t,a=50){var n;const r=e==null||e<=0?"Freier Fahrer":t??((n=d.teams.find(i=>i.id===e))==null?void 0:n.name)??`Team ${e}`,s=e==null||e<=0?"/jersey/Jer_placeholder.svg":`/jersey-large/Jer_${e}.png`;return`
    <span class="results-team-jersey" title="${S(r)}" aria-label="${S(r)}" style="width: ${a}px; height: ${a}px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S(s)}"
        alt=""
        width="${a}"
        height="${a}"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: ${a}px; height: ${a}px; border-radius: 4px; object-fit: contain;"
      >
    </span>`}function Ka(e,t,a=!1){if(!d.draftOverlayPicks)return[];const r=d.riders.filter(o=>o.activeTeamId===e),s=a?t+1:t,n=d.draftOverlayPicks.slice(s),i=new Set(n.filter(o=>o.teamId===e).map(o=>o.riderId));return r.filter(o=>!i.has(o.id))}function Os(e){const t={Berg:{spec1:0,spec23:0},Hill:{spec1:0,spec23:0},Sprint:{spec1:0,spec23:0},Timetrial:{spec1:0,spec23:0},Cobble:{spec1:0,spec23:0}};for(const a of e){const r=a.specialization1,s=a.specialization2,n=a.specialization3;r&&t[r]!==void 0&&t[r].spec1++,s&&t[s]!==void 0&&t[s].spec23++,n&&t[n]!==void 0&&t[n].spec23++}return t}function ed(e,t,a,r){const s=["Berg","Hill","Sprint","Timetrial","Cobble"],n=g=>g==="Hill"?"Hügel":g==="Timetrial"?"ZF":g,i=(g,h,b)=>g==="Timetrial"?h>=4||h>=2&&b>=2:g==="Cobble"?h>=4||h>=3&&b>=2:h>=4,o=s.map(g=>{const h=t[g]||{spec1:0},b=a[g]||{spec1:0,spec23:0},k=i(g,b.spec1,b.spec23)?"#4ade80":"#f87171",T=String(r?b.spec1:h.spec1);let x="";return r&&b.spec1-h.spec1>0&&(x='<span class="count-anim" style="color: #4ade80; font-weight: bold; margin-left: 0.15rem; animation: fadeUp 1.5s forwards;">(+1)</span>'),`<div style="display: flex; align-items: center;"><span style="color: #94a3b8; margin-right: 0.25rem;">${n(g)}:</span><strong style="color: ${k};">${T}</strong>${x}</div>`}),c=d.teams.find(g=>g.id===e),l=(c==null?void 0:c.division)==="U23"?20:(c==null?void 0:c.division)==="ProTour"?30:32,m=Ka(e,d.draftOverlayCurrentIndex,!1).length,p=Ka(e,d.draftOverlayCurrentIndex,!0).length;let u="";r&&p>m&&(u='<span class="count-anim" style="color: #4ade80; font-weight: bold; margin-left: 0.15rem; animation: fadeUp 1.5s forwards;">(+1)</span>');const f=r?p:m;return o.push(`<div style="display: flex; align-items: center; border-left: 1px solid rgba(255,255,255,0.15); padding-left: 1rem;"><span style="color: #94a3b8; margin-right: 0.25rem;">Kader:</span><strong style="color: #fbbf24;">${f}/${l}</strong>${u}</div>`),o.join('<span style="color: rgba(255,255,255,0.15); margin: 0 0.25rem;">|</span>')}function Ts(e,t,a,r,s){const n=e.id===r,i=d.draftOverlayPicks.slice(0,a+1).some(p=>p.riderId===e.id&&p.teamId===s);let o="#fff",c="#94a3b8",l="normal";return n?(o="#4ade80",c="#4ade80",l="bold"):i&&(o="#facc15",c="#facc15",l="bold"),`
    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; transition: all 0.2s; ${n?"border-left: 3px solid #4ade80; padding: 0.25rem 0.4rem 0.25rem 0.2rem; background: rgba(74, 222, 128, 0.08); border-radius: 4px;":"padding: 0.25rem 0.4rem; background: transparent; border-radius: 4px;"}">
      <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span style="font-family: monospace; text-align: right; width: 1.25rem; display: inline-block; color: #64748b; font-weight: bold; margin-right: 0.2rem;">${String(t).padStart(2,"0")}</span>
        ${ce(e.countryCode||e.nationality)}
        <span style="color: ${o}; font-weight: ${l}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${S(e.lastName)}
        </span>
      </div>
      <span style="color: ${c}; font-weight: bold;">${e.overallRating.toFixed(1)}</span>
    </div>
  `}function La(e){if(!e)return null;const t=e.toLowerCase();return t==="berg"||t==="climber"||t==="bergfahrer"?"Berg":t==="hill"||t==="puncher"||t==="huegelspezialist"?"Hügel":t==="sprint"||t==="sprinter"?"Sprint":t==="timetrial"||t==="time_trial"||t==="time trialist"||t==="zf"||t==="zeitfahrer"?"Zeitfahren":t==="cobble"||t==="classic"||t==="pave"||t==="pflasterspezialist"?"Cobble":t==="attacker"||t==="angreifer"?"Angreifer":e}function hf(e,t,a){var g;const r=t?"border: 2px solid var(--accent, #38bdf8); background: rgba(56, 189, 248, 0.08);":"border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);",s=[],n=La(e.specialization1),i=La(e.specialization2),o=La(e.specialization3);n&&s.push(n),i&&s.push(i),o&&s.push(o);const c=s.length>0?s.map(h=>S(h)).join(" · "):"Allrounder",l=e.uciRank?`<span style="color: #4ade80; font-weight: bold;">${e.uciRank}</span>`:"—",p=(d.draftSelectedSeason??((g=d.currentSave)==null?void 0:g.currentSeason)??2026)-e.birthYear,u=e.wins&&e.wins>0?`<span>·</span><span style="color: #4ade80;">${e.wins===1?"1 Sieg":e.wins+" Siege"}</span>`:"";let f="";return e.oldTeamId===a?f=$t(null,null,32):e.oldTeamId&&e.oldTeamId>0?f=$t(e.oldTeamId,e.oldTeamName,32):f="",`
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0.5rem; border-radius: 6px; transition: all 0.2s; ${r}">
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        ${f?`
        <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
          ${f}
        </div>
        `:""}
        <div>
          <div style="display: flex; align-items: center; gap: 0.35rem;">
            ${ce(e.countryCode)}
            <button class="app-rider-link" data-rider-id="${e.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: 0.88rem; text-decoration: none;">
              ${S(e.lastName)}
            </button>
            <span style="color: #60a5fa; font-weight: bold; font-size: 0.85rem; margin-left: 0.15rem;">(</span><span style="color: #facc15; font-weight: bold; font-size: 0.85rem;">${p}</span><span style="color: #60a5fa; font-weight: bold; font-size: 0.85rem;">)</span>
          </div>
          <div style="font-size: 0.75rem; color: #facc15; font-weight: bold; display: flex; align-items: center; gap: 0.4rem; margin-top: 0.1rem; flex-wrap: wrap;">
            <span>${c}</span>
            <span>·</span>
            <span>UCI: ${l}</span>
            ${u}
          </div>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <div style="text-align: right;">
          <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase;">POT</div>
          <div style="font-size: 0.8rem; font-weight: 500; color: #94a3b8;">${e.potential.toFixed(1)}</div>
          <div style="font-size: 0.7rem; color: var(--accent, #38bdf8); font-weight: 500; margin-top: 0.1rem;">${e.probability.toFixed(1)}%</div>
        </div>
        <div style="border: 1.5px solid #fbbf24; border-radius: 5px; padding: 0.25rem 0.4rem; color: #fbbf24; font-weight: bold; font-size: 0.95rem; min-width: 2.6rem; text-align: center; background: rgba(251, 191, 36, 0.05); line-height: 1.1;">
          ${e.overallRating.toFixed(1)}
        </div>
      </div>
    </div>
  `}function bf(e){var n;const a=(d.draftSelectedSeason??((n=d.currentSave)==null?void 0:n.currentSeason)??2026)-e.riderBirthYear,r=La(e.riderSpecialization)||"Allrounder";let s="";return e.oldTeamId===e.teamId?s=`
      ${$t(null,null,95)}
      <span style="font-size: 2.5rem; color: #94a3b8; font-weight: bold; display: flex; align-items: center;">➔</span>
      ${$t(e.teamId,e.teamName,95)}
    `:e.oldTeamId&&e.oldTeamId>0?s=`
      ${$t(e.oldTeamId,e.oldTeamName,95)}
      <span style="font-size: 2.5rem; color: #94a3b8; font-weight: bold; display: flex; align-items: center;">➔</span>
      ${$t(e.teamId,e.teamName,95)}
    `:s=`
      ${$t(e.teamId,e.teamName,95)}
    `,`
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center; animation: scaleIn 0.3s ease-out;">
      <style>
        @keyframes scaleIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      </style>
      
      <div style="display: flex; align-items: center; justify-content: center; gap: 4.5rem; margin-bottom: 2.5rem; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));">
        ${s}
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 1.5rem; width: 95%; max-width: 420px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);">
        <div style="font-size: 0.9rem; color: var(--accent, #38bdf8); font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">GEZOGENER FAHRER</div>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.75rem;">
          ${ce(e.countryCode)}
          <button class="app-rider-link" data-rider-id="${e.riderId}" style="background: none; border: none; padding: 0; color: #fff; font-weight: 700; font-size: 1.8rem; cursor: pointer; text-decoration: none; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            ${S(e.riderLastName)}
          </button>
        </div>
        
        <div style="font-size: 1.1rem; color: #94a3b8; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <span>${r}</span>
          <span>·</span>
          <span>${a} Jahre</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 0.75rem 0; margin-bottom: 1.25rem;">
          <div style="border: 1.5px solid #fbbf24; border-radius: 8px; padding: 0.5rem; background: rgba(251, 191, 36, 0.05);">
            <div style="font-size: 0.8rem; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold;">Stärke</div>
            <div style="font-size: 1.6rem; font-weight: 700; color: #fbbf24;">${e.overallAtDraft.toFixed(1)}</div>
          </div>
          <div style="border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.5rem; background: rgba(255,255,255,0.02);">
            <div style="font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Potenzial</div>
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
  `}function yf(e){let t=document.getElementById("draft-overlay");return t||(t=document.createElement("div"),t.id="draft-overlay",t.style.cssText=`
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(15, 23, 42, 0.98); z-index: 10000;
    display: flex; flex-direction: column; padding: 2rem; color: #fff;
    font-family: inherit; overflow: hidden; box-sizing: border-box;
  `,document.body.appendChild(t),t.innerHTML=`
    <style>
      @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(3px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-8px); }
      }
    </style>
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-shrink: 0;">
      <div style="display: flex; align-items: center; gap: 2.25rem;">
        <div id="draft-overlay-team-jersey-wrap" style="display: flex; align-items: center; justify-content: center; width: 72px; height: 72px; flex-shrink: 0;"></div>
        <div>
          <h2 id="draft-overlay-round-title" style="margin: 0; font-size: 1.6rem; font-weight: 700;">-</h2>
          <p id="draft-overlay-team-subtitle" style="margin: 0.2rem 0 0; color: #d97706; font-weight: bold; font-size: 1.1rem;">-</p>
        </div>
      </div>
      
      <div id="draft-overlay-specs-header" style="display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.9rem;">
        <!-- Specs counts displayed here -->
      </div>
      
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 0.25rem; background: rgba(255,255,255,0.05); padding: 0.25rem; border-radius: 8px;">
          <button id="draft-overlay-pause-btn" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.9rem; font-weight: bold; min-width: 4rem;">Pause</button>
          <span style="border-left: 1px solid rgba(255,255,255,0.15); height: 1.5rem; margin: 0 0.25rem;"></span>
          <button class="btn btn-secondary draft-speed-btn" data-speed="0.25" style="padding: 0.4rem 0.6rem; font-size: 0.85rem;">x0.25</button>
          <button class="btn btn-secondary draft-speed-btn" data-speed="0.5" style="padding: 0.4rem 0.6rem; font-size: 0.85rem;">x0.5</button>
          <button class="btn btn-secondary draft-speed-btn draft-speed-btn-active" data-speed="1" style="padding: 0.4rem 0.6rem; font-size: 0.85rem; font-weight: bold; color: var(--accent, #38bdf8);">x1</button>
          <button class="btn btn-secondary draft-speed-btn" data-speed="2" style="padding: 0.4rem 0.6rem; font-size: 0.85rem;">x2</button>
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
      <div style="flex: 2.0; display: flex; flex-direction: column; min-height: 0;">
        <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0;">Kandidaten-Pool</h3>
        <div id="draft-overlay-candidates-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.45rem 0.75rem; overflow-y: auto; flex: 1; padding-right: 0.5rem;"></div>
      </div>
      
      <!-- Rechte Spalte: Auswahl -->
      <div style="flex: 1.0; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(255,255,255,0.01); border: 2px dashed rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem; position: relative; min-height: 0;">
        <div id="draft-overlay-pick-display" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0;"></div>
      </div>
    </div>
  `,t.addEventListener("click",a=>{const r=a.target;if(r.id==="draft-overlay-quick-btn"){Ln();return}if(r.id==="draft-overlay-pause-btn"){d.draftPaused=!d.draftPaused,r.textContent=d.draftPaused?"Weiter":"Pause",r.classList.toggle("btn-primary",d.draftPaused),pa();return}const s=r.closest(".draft-speed-btn");if(s){const n=parseFloat(s.dataset.speed||"1");d.draftSpeedMultiplier=n,t.querySelectorAll(".draft-speed-btn").forEach(i=>{i.classList.remove("draft-speed-btn-active"),i.style.color="",i.style.fontWeight=""}),s.classList.add("draft-speed-btn-active"),s.style.color="var(--accent, #38bdf8)",s.style.fontWeight="bold",pa();return}if(r.id==="draft-overlay-prev-btn"||r.closest("#draft-overlay-prev-btn")){if(d.draftOverlayCurrentIndex>0){const n=document.getElementById("draft-overlay-auto-checkbox");n&&(n.checked=!1,d.draftOverlayAuto=!1),Oa(d.draftOverlayCurrentIndex-1)}return}if(r.id==="draft-overlay-next-btn"||r.closest("#draft-overlay-next-btn")){if(d.draftOverlayPicks&&d.draftOverlayCurrentIndex+1<d.draftOverlayPicks.length){const n=document.getElementById("draft-overlay-auto-checkbox");n&&(n.checked=!1,d.draftOverlayAuto=!1),Oa(d.draftOverlayCurrentIndex+1)}return}}),t.addEventListener("change",a=>{const r=a.target;r.id==="draft-overlay-auto-checkbox"&&(d.draftOverlayAuto=r.checked,d.draftOverlayAuto?pa():Qa())}),t)}function pa(){if(Qa(),d.draftPaused)return;const e=d.draftSpeedMultiplier,t=d.draftOverlayCurrentIndex;if(d.draftRevealShown){if(d.draftOverlayAuto){const a=3e3/e;d.draftOverlayTimer2=window.setTimeout(()=>{const r=t+1;r<d.draftOverlayPicks.length?Oa(r):Ln()},a)}}else{const a=2e3/e;d.draftOverlayTimer1=window.setTimeout(()=>{td()},a)}}function td(){const e=d.draftOverlayCurrentIndex,t=d.draftOverlayPicks[e];d.draftRevealShown=!0;const a=Ka(t.teamId,e,!1),r=Ka(t.teamId,e,!0),s=Os(a),n=Os(r),i=document.getElementById("draft-overlay-specs-header");i&&(i.innerHTML=ed(t.teamId,s,n,!0));const o=document.getElementById("draft-overlay-pick-display");if(o){const c=[...r].sort((k,T)=>T.overallRating-k.overallRating),l=c.slice(0,10),m=l.some(k=>k.id===t.riderId),p=c.findIndex(k=>k.id===t.riderId)+1;let u=l.map((k,T)=>Ts(k,T+1,e,t.riderId,t.teamId)).join("");if(!m){const k=c.find(T=>T.id===t.riderId);k&&(u+=`
          <div style="border-top: 1px dashed rgba(255,255,255,0.15); margin: 0.3rem 0; padding-top: 0.3rem;"></div>
          ${Ts(k,p,e,t.riderId,t.teamId)}
        `)}const f=d.riders.find(k=>k.id===t.riderId),g=f==null?void 0:f.specialization1,h=La(g)||"Allrounder",b=c.filter(k=>g&&(k.specialization1===g||k.specialization2===g)).slice(0,10);let y=b.map(k=>{const T=c.findIndex(x=>x.id===k.id)+1;return Ts(k,T,e,t.riderId,t.teamId)}).join("");b.length===0&&(y='<div style="font-size: 0.8rem; color: #64748b; font-style: italic; padding: 0.5rem; text-align: center;">Keine Partner im Team</div>'),o.innerHTML=`
      <div style="display: flex; width: 100%; height: 100%; gap: 1rem; overflow: hidden; animation: scaleIn 0.3s ease-out;">
        <!-- Left Column: Both Gesamtstärke and Spec Box -->
        <div style="flex: 1.25; display: flex; flex-direction: column; gap: 1rem; min-height: 0;">
          
          <!-- Top Box: Gesamtstärkenrangliste -->
          <div style="flex: 1; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 0.75rem; display: flex; flex-direction: column; overflow: hidden; min-height: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.25rem;">Kader Top 10</h4>
            <div style="overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 0.35rem; padding-right: 0.25rem;">
              ${u}
            </div>
          </div>
          
          <!-- Bottom Box: Spec Rangliste -->
          <div style="flex: 1; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 0.75rem; display: flex; flex-direction: column; overflow: hidden; min-height: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span>Spec: ${S(h)}</span>
              <span style="font-size: 0.75rem; font-weight: normal; color: #64748b;">(max 10)</span>
            </h4>
            <div style="overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 0.35rem; padding-right: 0.25rem;">
              ${y}
            </div>
          </div>
          
        </div>
        
        <!-- Right Column: Draft Big Card -->
        <div style="flex: 2.0; display: flex; justify-content: center; align-items: center; min-height: 0;">
          ${bf(t)}
        </div>
      </div>
    `}pa()}function vf(e){const t=e.length,a=Math.ceil(t/2),r=[];for(let s=0;s<a;s++)r.push(e[s]),s+a<t&&r.push(e[s+a]);return r}function Oa(e){if(!d.draftOverlayPicks||e<0||e>=d.draftOverlayPicks.length)return;Qa(),d.draftOverlayCurrentIndex=e,d.draftRevealShown=!1;const t=d.draftOverlayPicks[e];if(!document.getElementById("draft-overlay"))return;const r=document.getElementById("draft-overlay-round-title");r&&(r.textContent=`Runde ${t.draftRound} - Pick #${t.pickNumber}`);const s=document.getElementById("draft-overlay-team-subtitle");s&&(s.textContent=t.teamName);const n=document.getElementById("draft-overlay-team-jersey-wrap");n&&(n.innerHTML=$t(t.teamId,t.teamName,72));const i=document.getElementById("draft-overlay-progress-label");i&&(i.textContent=`${e+1} / ${d.draftOverlayPicks.length}`);const o=Ka(t.teamId,e,!1),c=Os(o),l=document.getElementById("draft-overlay-specs-header");l&&(l.innerHTML=ed(t.teamId,c,c,!1));const m=document.getElementById("draft-overlay-prev-btn");m&&(m.disabled=e===0);const p=document.getElementById("draft-overlay-next-btn");p&&(p.disabled=e===d.draftOverlayPicks.length-1);const u=[...t.candidates].sort((b,y)=>y.overallRating-b.overallRating),f=vf(u),g=document.getElementById("draft-overlay-candidates-list");g&&(g.innerHTML=f.map(b=>{const y=b.riderId===t.riderId;return hf(b,y,t.teamId)}).join(""));const h=document.getElementById("draft-overlay-pick-display");h&&(h.innerHTML=`
      <div style="font-size: 1.3rem; font-weight: 500; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 2.25rem; transform: translateY(-20px);">
        <div style="animation: pulse 1s infinite alternate; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5)); display: flex; align-items: center; justify-content: center; width: 120px; height: 120px;">
          ${$t(t.teamId,t.teamName,120)}
        </div>
        <style>
          @keyframes pulse {
            from { opacity: 0.4; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1.08); }
          }
        </style>
        <span>Treffe Auswahl...</span>
      </div>
    `),pa()}function Ln(){Qa(),d.draftOverlayActive=!1,d.draftOverlayPicks=null;const e=document.getElementById("draft-overlay");e&&e.remove(),d.draftSelectedSeason&&cs(d.draftSelectedSeason)}async function ad(e){Qa(),d.draftOverlayActive=!0,d.draftOverlayAuto=!0,d.draftOverlayCurrentIndex=0,d.draftSelectedSeason=e,d.draftSpeedMultiplier=1,d.draftPaused=!1,d.draftRevealShown=!1,Fe("Draft-Präsentation wird geladen...");try{const[t,a,r]=await Promise.all([Z.getDraftDetails(e),Z.getRiders(void 0,!1,!0,e),Z.getTeams()]);if(!t.success||!t.data||!t.data.picks||t.data.picks.length===0){ke(),d.draftOverlayActive=!1;return}a.success&&a.data&&(d.riders=a.data),r.success&&r.data&&(d.teams=r.data),d.draftOverlayPicks=t.data.picks,yf(e),Oa(0)}catch(t){console.error(t),d.draftOverlayActive=!1}finally{ke()}}const Sf=Object.freeze(Object.defineProperty({__proto__:null,closeDraftOverlay:Ln,currentDraftSort:nt,getDraftSortIndicator:Xl,getHeatmapStyleForRating:Ks,getOpenSlotsForPick:ff,initDraftListeners:Ql,loadDraftHistory:cs,renderDraftHeaderCell:et,renderDraftView:Yr,revealCurrentPick:td,showDraftPick:Oa,startDraftPresentation:ad,triggerDraftSchedule:pa},Symbol.toStringTag,{value:"Module"}));async function kf(e=!1){const t=await Z.getInjuries();if(!t.success){d.injuries=null,xe("injuries")&&Zi(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}d.injuries=t.data??[],xe("injuries")&&Zi()}function Zi(){const e=v("injuries-table-container");if(!d.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(v("injuries-meta").textContent=d.injuries.length+" Ausfälle",d.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=va;let t="";const a=d.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),r=new Map;for(const n of a){const i=n.teamId;r.has(i)||r.set(i,[]),r.get(i).push(n)}for(const n of r.keys())r.get(n).sort((i,o)=>o.overallRating-i.overallRating);const s=Array.from(r.keys()).sort((n,i)=>{const o=r.get(n)[0].teamAbbreviation||"",c=r.get(i)[0].teamAbbreviation||"";return o.localeCompare(c)});if(s.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of s){const i=r.get(n),o=i[0].teamAbbreviation;t+=`
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
      `;for(const c of i){const l=c.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let m="";if(c.fitDate){const p=de(c.fitDate);if(c.missedRaces&&c.missedRaces.length>0){let u="";for(const f of c.missedRaces)u+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${de(f.startDate)}</span>
                  ${ce(f.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${S(f.name)}</strong>
                  ${hn(f.categoryName)}
                </div>
              `;m=`
              <div class="injury-fit-cell">
                <strong>${p}</strong>
                <div class="injury-fit-tooltip">
                  <div style="margin-bottom: 0.4rem; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.2rem;">Verpasste Rennen (${c.missedRaces.length})</div>
                  ${u}
                </div>
              </div>
            `}else m=`<strong>${p}</strong>`}else m="Unbekannt";t+=`
          <tr>
            <td>${ce(c.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${c.riderId})" style="color: inherit; text-decoration: none;"><strong>${S(c.riderFirstName)} ${S(c.riderLastName)}</strong></a></td>
            <td>${c.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${vl(c.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${c.unavailableDays} Tage</strong></td>
            <td>${m}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function Ji(e){return e===0?"–":`-${e}`}function $f(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${mt(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${De(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function xf(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${S(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${$f(e.topRiders)}
      </div>
    </div>`}function Tf(e,t){const a=t.filter(r=>r.teamId!=null&&e.teamId!=null&&r.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${mt(r.countryCode)}</span>
          <span class="season-standings-country-rider-name">${De(r.riderName??"–",{riderId:r.riderId,teamId:r.teamId,strong:!1})}</span>
          <strong>${r.points}</strong>
        </div>
      `).join("")}
    </div>`}function wf(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${rt(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${Tf(e,t)}
      </div>
    </div>`}async function rd(e){const t=d.seasonStandingsSelectedSeason??void 0,a=await Z.getSeasonStandings(t);if(!a.success){d.seasonStandings=null,xe("season-standings")&&js(),!e&&a.error&&alert(`Saisonwertung konnte nicht geladen werden:
`+a.error);return}d.seasonStandings=a.data??null,xe("season-standings")&&js()}function js(){var h,b,y,k,T,x,$,D;const e=v("season-standings-meta"),t=v("season-standings-scope-tabs"),a=v("season-standings-empty"),r=v("season-standings-table"),s=v("season-standings-tbody"),n=v("season-standings-jersey-header"),i=v("season-standings-primary-header"),o=v("season-standings-flag-header"),c=v("season-standings-secondary-header"),l=((h=d.seasonStandings)==null?void 0:h.season)??((b=d.gameState)==null?void 0:b.season)??((y=d.currentSave)==null?void 0:y.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.";const m=v("season-standings-year-select");if(m){const E=((k=d.seasonStandings)==null?void 0:k.availableSeasons)||[],M=d.seasonStandingsSelectedSeason??((T=d.gameState)==null?void 0:T.season)??2026;m.innerHTML=E.map(R=>`
      <option value="${R}" ${R===M?"selected":""}>Saison ${R}</option>
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
  `;const p=d.selectedSeasonStandingScope==="countries",u=p?((x=d.seasonStandings)==null?void 0:x.countryStandings)??[]:d.selectedSeasonStandingScope==="teams"?(($=d.seasonStandings)==null?void 0:$.teamStandings)??[]:((D=d.seasonStandings)==null?void 0:D.riderStandings)??[],f=p?u:[],g=p?[]:u;if(n.textContent="Trikot",i.textContent=p?"Land":d.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",c.textContent=d.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",p),c.classList.toggle("hidden",p),!d.seasonStandings||u.length===0){s.innerHTML="",r.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}s.innerHTML=p?f.map(E=>`
      <tr>
        <td class="pos-${Math.min(E.rank,3)}">${E.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${xf(E)}</td>
        <td class="results-flag-col-cell">${mt(E.countryCode)}</td>
        <td class="hidden"></td>
        <td>${E.points}</td>
        <td>${S(Ji(E.gapPoints))}</td>
      </tr>`).join(""):g.map(E=>{var H;const M=E.riderName??E.teamName,R=aa(E.teamId,E.teamName),_=d.selectedSeasonStandingScope==="teams"?wf(E,((H=d.seasonStandings)==null?void 0:H.riderStandings)??[]):ra(M,!0,!1,E.riderId,E.teamId),F=mt(E.countryCode),N=d.selectedSeasonStandingScope==="teams"?S(E.countryName??E.countryCode??"–"):rt(E.teamName??"–",E.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(E.rank,3)}">${E.rank}</td>
          <td class="results-jersey-col-cell">${R}</td>
          <td>${_}</td>
          <td class="results-flag-col-cell">${F}</td>
          <td>${N}</td>
          <td>${E.points}</td>
          <td>${S(Ji(E.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),r.classList.remove("hidden")}function Mf(){v("season-standings-scope-tabs").addEventListener("click",t=>{const a=t.target.closest("button[data-season-scope]");if(!a)return;const r=a.dataset.seasonScope;r!=="riders"&&r!=="teams"&&r!=="countries"||(d.selectedSeasonStandingScope=r,js())});const e=v("season-standings-year-select");e&&e.addEventListener("change",t=>{const a=t.target;d.seasonStandingsSelectedSeason=Number(a.value),rd(!1)})}function qi(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function Rf(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,r=[...e].map(l=>({rider:l,score:t(l)})).sort((l,m)=>m.score-l.score).slice(0,10),s=[...e].map(l=>({rider:l,score:a(l)})).sort((l,m)=>m.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,m)=>m.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,m)=>m.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,m)=>m.score-l.score).slice(0,10),c=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,m)=>m.score-l.score).slice(0,10);return{Gesamtklassement:r,Sprinter:s,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:c}}function If(e,t){const a=d.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const r=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,s=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>r(o)):t==="Sprinter"?n=a.map(o=>s(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,c)=>c-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,c)=>o+c,0)/i.length}function Cf(e,t){var i;const r=d.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:If(o.id,t)}));r.sort((o,c)=>c.avgScore-o.avgScore);const s=r.findIndex(o=>o.teamId===e)+1,n=((i=r.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:s,total:r.length,average:n}}function Ff(e){const t=d.riders.filter(s=>s.activeTeamId===e);if(t.length===0)return 0;const a=t.map(s=>s.overallRating??0);a.sort((s,n)=>n-s);const r=a.slice(0,10);return r.length===0?0:r.reduce((s,n)=>s+n,0)/r.length}function Ef(e){var n;const a=d.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:Ff(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const r=a.findIndex(i=>i.teamId===e)+1,s=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:r,total:a.length,average:s}}function hr(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function br(e){e.countryCode&&ce(e.countryCode);const t=Rf(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,m)=>m.formValue-l.formValue).slice(0,10),r=[...e.riders].map(l=>({rider:l,uciRank:Wr(l.id)})).filter(l=>l.uciRank!==null).sort((l,m)=>l.uciRank-m.uciRank).slice(0,10),s=Object.entries(t).map(([l,m])=>{const p=Cf(e.teamId,l),u=p.average.toFixed(1).replace(".",","),f=m.map(({rider:g,score:h})=>{const b=`${g.firstName.charAt(0)}. ${g.lastName}`,y=De(b,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),k=g.nationality?ze[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,T=k?`<span class="fi fi-${k} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",x=d.riders.find(D=>D.id===g.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${hr((x==null?void 0:x.roleId)??null).color};">
            ${T}
            ${y}
          </span>
          <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${h.toFixed(0)}</span>
        </li>
      `}).join("");return`
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
          ${l}
          <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-400); display: block; margin-top: 0.1rem;">Platz ${p.rank}/${p.total} · Ø ${u}</span>
        </h4>
        <ul style="margin: 0; padding: 0; list-style: none;">${f}</ul>
      </div>
    `}).join(""),i=[...e.riders].sort((l,m)=>(m.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,p=De(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),u=l.nationality?ze[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=u?`<span class="fi fi-${u} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",g=l.overallRating.toFixed(0),h=d.riders.find(y=>y.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${hr((h==null?void 0:h.roleId)??null).color};">
          ${f}
          ${p}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:m})=>{const p=`${l.firstName.charAt(0)}. ${l.lastName}`,u=De(p,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?ze[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",h=(m>=0?"+":"")+m.toFixed(1).replace(".",","),b=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,y=d.riders.find(T=>T.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${hr((y==null?void 0:y.roleId)??null).color};">
          ${g}
          ${u}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${b}">${h}</span>
      </li>
    `}).join(""),c=r.map(({rider:l,uciRank:m})=>{const p=`${l.firstName.charAt(0)}. ${l.lastName}`,u=De(p,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?ze[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"";let h="rider-stats-rank-badge-gc";m===1?h="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":m===2?h="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":m===3&&(h="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const b=`<span class="rider-stats-rank-badge ${h}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${m}">${m}</span>`,y=d.riders.find(T=>T.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${hr((y==null?void 0:y.roleId)??null).color};">
          ${g}
          ${u}
        </span>
        ${b}
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
  `}function yr(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${d.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${d.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${d.teamStatsTab==="contracts"?"true":"false"}">Kader & Verträge</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="transfers"?" team-detail-page-tab-active":""}" data-team-stats-tab="transfers" aria-selected="${d.teamStatsTab==="transfers"?"true":"false"}">Transfers</button>
    </div>`}function Pf(e){const t=Array.from(new Set(e.topResults.map(u=>u.raceCategoryName).filter(Boolean)));t.sort((u,f)=>u.localeCompare(f,"de"));const a=Array.from(new Set(e.topResults.map(u=>u.season))).sort((u,f)=>f-u);let r=e.topResults.filter(u=>u.rowType!=="stage_result"?u.rowType==="gc_final"?d.teamStatsTopResultsFilters.gc:u.rowType==="mountain_final"?d.teamStatsTopResultsFilters.mountain:u.rowType==="points_final"?d.teamStatsTopResultsFilters.points:u.rowType==="youth_final"?d.teamStatsTopResultsFilters.youth:u.rowType==="breakaway_final"?d.teamStatsTopResultsFilters.breakaway:!0:u.isStageRace?d.teamStatsTopResultsFilters.stage:d.teamStatsTopResultsFilters.oneDay);if(d.teamStatsTopResultsFilterCategory){const u=d.teamStatsTopResultsFilterCategory;if(u.endsWith("-etappen")){const f=u.substring(0,u.length-8);r=r.filter(g=>g.raceCategoryName===f&&g.rowType==="stage_result")}else if(u.endsWith("-gc")){const f=u.substring(0,u.length-3);r=r.filter(g=>g.raceCategoryName===f&&g.rowType!=="stage_result")}else r=r.filter(f=>f.raceCategoryName===u)}d.teamStatsTopResultsFilterSeason!=null&&(r=r.filter(u=>u.season===d.teamStatsTopResultsFilterSeason)),d.teamStatsTopResultsFilterRank!=null&&!isNaN(d.teamStatsTopResultsFilterRank)&&(r=r.filter(u=>u.resultRank!=null&&u.resultRank<=d.teamStatsTopResultsFilterRank)),d.teamStatsTopResultsFilterProfile&&(r=r.filter(u=>u.profile===d.teamStatsTopResultsFilterProfile)),r.sort((u,f)=>{if(f.seasonPoints!==u.seasonPoints)return f.seasonPoints-u.seasonPoints;const g=u.rowType!=="stage_result",h=f.rowType!=="stage_result",b=u.resultRank??9999,y=f.resultRank??9999;if(d.teamStatsTopResultsFilterCategory)return b!==y?b-y:g!==h?g?-1:1:0;{const k=qi(u.raceCategoryName),T=qi(f.raceCategoryName);return k!==T?k-T:g!==h?g?-1:1:b-y}});const s=20,n=Math.max(1,Math.min(10,Math.ceil(r.length/s)));d.teamStatsTopResultsPage>n&&(d.teamStatsTopResultsPage=n);const i=(d.teamStatsTopResultsPage-1)*s,o=r.slice(i,i+s),l=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: flex-start; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${t.map(u=>{if(u.toLowerCase().includes("stage race")||u.toLowerCase().includes("grand tour")||u.toLowerCase().includes("tour de france")){const g=`${u}-etappen`,h=`${u}-gc`;return`
        <option value="${S(g)}" ${d.teamStatsTopResultsFilterCategory===g?"selected":""}>${S(u)} - Etappen</option>
        <option value="${S(h)}" ${d.teamStatsTopResultsFilterCategory===h?"selected":""}>${S(u)} - GC</option>
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
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Profil:</label>
        <select id="team-stats-filter-profile" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444; cursor: pointer;">
          <option value="all">Alle Profile</option>
          <option value="Flat" ${d.teamStatsTopResultsFilterProfile==="Flat"?"selected":""}>Flat</option>
          <option value="Rolling" ${d.teamStatsTopResultsFilterProfile==="Rolling"?"selected":""}>Rolling</option>
          <option value="Hilly" ${d.teamStatsTopResultsFilterProfile==="Hilly"?"selected":""}>Hilly</option>
          <option value="Hilly Difficult" ${d.teamStatsTopResultsFilterProfile==="Hilly Difficult"?"selected":""}>Hilly Difficult</option>
          <option value="Medium Mountain" ${d.teamStatsTopResultsFilterProfile==="Medium Mountain"?"selected":""}>Medium Mountain</option>
          <option value="Mountain" ${d.teamStatsTopResultsFilterProfile==="Mountain"?"selected":""}>Mountain</option>
          <option value="High Mountain" ${d.teamStatsTopResultsFilterProfile==="High Mountain"?"selected":""}>High Mountain</option>
          <option value="Cobble" ${d.teamStatsTopResultsFilterProfile==="Cobble"?"selected":""}>Cobble</option>
          <option value="Cobble Hill" ${d.teamStatsTopResultsFilterProfile==="Cobble Hill"?"selected":""}>Cobble Hill</option>
          <option value="ITT" ${d.teamStatsTopResultsFilterProfile==="ITT"?"selected":""}>ITT</option>
          <option value="TTT" ${d.teamStatsTopResultsFilterProfile==="TTT"?"selected":""}>TTT</option>
        </select>
      </div>
      
      <div style="display: grid; grid-template-rows: auto auto; grid-template-columns: repeat(6, 130px); gap: 0.5rem; align-items: center; justify-items: center; text-align: center; margin-left: auto; border-left: 1px solid rgba(255, 255, 255, 0.1); padding-left: 1rem;">
        <!-- Column 1: Siege / Top 3 -->
        <div style="grid-row: 1; grid-column: 1;">
          ${ge("Siege",d.teamStatsTopResultsFilterRank===1,"linear-gradient(135deg, #fbbf24, #d4af37)","#000","rgba(251, 191, 36, 0.4)","data-team-top-results-rank","1")}
        </div>
        <div style="grid-row: 2; grid-column: 1;">
          ${ge("Top 3",d.teamStatsTopResultsFilterRank===3,"linear-gradient(135deg, #e2e8f0, #94a3b8)","#000","rgba(148, 163, 184, 0.4)","data-team-top-results-rank","3")}
        </div>

        <!-- Column 2: Top 5 / Top 10 -->
        <div style="grid-row: 1; grid-column: 2;">
          ${ge("Top 5",d.teamStatsTopResultsFilterRank===5,"linear-gradient(135deg, #d97706, #b45309)","#fff","rgba(217, 119, 6, 0.4)","data-team-top-results-rank","5")}
        </div>
        <div style="grid-row: 2; grid-column: 2;">
          ${ge("Top 10",d.teamStatsTopResultsFilterRank===10,"linear-gradient(135deg, #a16207, #78350f)","#fff","rgba(161, 98, 7, 0.4)","data-team-top-results-rank","10")}
        </div>

        <!-- Column 3: GC / [Empty] -->
        <div style="grid-row: 1; grid-column: 3;">
          ${ge("GC",d.teamStatsTopResultsFilters.gc,"linear-gradient(135deg, #facc15, #ca8a04)","#000","rgba(234, 179, 8, 0.4)","data-team-top-results-filter","gc")}
        </div>
        <div style="grid-row: 2; grid-column: 3;">
          <!-- Empty for GC single layout -->
        </div>

        <!-- Column 4: Punkte / Berg -->
        <div style="grid-row: 1; grid-column: 4;">
          ${ge("Punkte",d.teamStatsTopResultsFilters.points,"linear-gradient(135deg, #4ade80, #16a34a)","#fff","rgba(74, 222, 128, 0.4)","data-team-top-results-filter","points")}
        </div>
        <div style="grid-row: 2; grid-column: 4;">
          ${ge("Berg",d.teamStatsTopResultsFilters.mountain,"linear-gradient(135deg, #f87171, #dc2626)","#fff","rgba(239, 68, 68, 0.4)","data-team-top-results-filter","mountain")}
        </div>

        <!-- Column 5: Nachwuchs / Ausreißer -->
        <div style="grid-row: 1; grid-column: 5;">
          ${ge("Nachwuchs",d.teamStatsTopResultsFilters.youth,"linear-gradient(135deg, #ffffff, #e2e8f0)","#0f172a","rgba(255, 255, 255, 0.4)","data-team-top-results-filter","youth")}
        </div>
        <div style="grid-row: 2; grid-column: 5;">
          ${ge("Ausreißer",d.teamStatsTopResultsFilters.breakaway,"linear-gradient(135deg, #c084fc, #7c3aed)","#fff","rgba(168, 85, 247, 0.4)","data-team-top-results-filter","breakaway")}
        </div>

        <!-- Column 6: Etappen / One Day -->
        <div style="grid-row: 1; grid-column: 6;">
          ${ge("Etappen",d.teamStatsTopResultsFilters.stage,"linear-gradient(135deg, #60a5fa, #2563eb)","#fff","rgba(59, 130, 246, 0.4)","data-team-top-results-filter","stage")}
        </div>
        <div style="grid-row: 2; grid-column: 6;">
          ${ge("One Day",d.teamStatsTopResultsFilters.oneDay,"linear-gradient(135deg, #b91c1c, #7f1d1d)","#fff","rgba(185, 28, 28, 0.4)","data-team-top-results-filter","oneDay")}
        </div>
      </div>
    </div>
  `,m=o.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(u=>{const f=u.rowType!=="stage_result",g=f?`${u.raceName} · ${ns(u.rowType)}`:u.stageNumber&&u.isStageRace?`${u.raceName} · Etappe ${u.stageNumber}`:u.raceName;let h="–",b="–";u.finishStatus==="otl"?h=Zt("OTL","place"):u.finishStatus==="dnf"?h=Zt("DNF","place"):u.resultRank==null||(f?b=`<span class="rider-stats-final-type ${bn(u.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${u.resultRank}</span>`:h=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${u.resultRank<=3?` rider-stats-rank-badge-top-${u.resultRank}`:""}">${S(String(u.resultRank))}</span>`);const y=u.profile?Xa(u.profile):"–",k=!f&&u.stageScore!=null&&u.stageScore>0?ss(u.stageScore,0,350):"–",T=jr(u.raceCategoryName),x=u.riderCountryCode?ze[u.riderCountryCode]??u.riderCountryCode.slice(0,2).toLowerCase():null,$=x?`<span class="fi fi-${x} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(u.riderCountryCode??"")}"></span>`:"–",D=De(u.riderName,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${h}</td>
            <td>${b}</td>
            <td>${$}</td>
            <td style="white-space: nowrap;">${D}</td>
            <td><strong>${S(g)}</strong></td>
            <td class="status-cell">${yn(u)}</td>
            <td>${y}</td>
            <td>${k}</td>
            <td>${T}</td>
            <td>Saison ${u.season}</td>
            <td><strong>${u.seasonPoints}</strong></td>
          </tr>
        `}).join(""),p=n>1?`
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
            ${m}
          </tbody>
        </table>
      </div>
      ${p}
    </section>
  `}function Nf(e){const t=String(d.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,superteamCount:0,categories:{}},r=t==="all",s=p=>r?p:"–",n=(p,u)=>r?`${p} / ${u} T`:"–",i=r?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(p,u,f,g)=>{const h=typeof p=="number"?p:parseFloat(String(p))||0;let b="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return h===0?b+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":u==="gold"?b+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":u==="silver"?b+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":u==="bronze"?b+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":u==="purple"?b+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":u==="green"?b+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":u==="red"?b+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":u==="white"&&(b+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${b}" title="${S(f)}: ${h} Siege">${p}</span>`},c=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #fff;">Karrierestatistiken (Team)</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="team-stats-success-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
        <select id="team-stats-success-season-select" class="form-control" style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">
          <option value="all" ${r?"selected":""}>Ewig (All-Time)</option>
          ${Object.keys(e.successStats).filter(p=>p!=="all").sort((p,u)=>u.localeCompare(p)).map(p=>`
            <option value="${p}" ${String(d.teamStatsSelectedSeason)===p?"selected":""}>Saison ${p}</option>
          `).join("")}
        </select>
      </div>
    </div>
  `,m=a.totalGcWins+a.totalStageWins;return`
    <section class="rider-stats-career" style="margin-top: 1.5rem;">
      ${l}
      
      <!-- Career Summary cards -->
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Siege</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #fbbf24;">${m}</div>
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
        ${c.map(p=>{const u=a.categories[p.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(p.name)}">${S(p.name)}</span>
                ${hn(p.key)}
              </div>
              
              ${p.isStage?`
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
                  ${fe(u.winFlat||0,"flat","Flach (Flat)")}
                  ${fe(u.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${fe(u.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${fe(u.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${fe(u.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${fe(u.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${fe(u.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${fe(u.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${fe(u.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${fe(u.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${fe(u.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${Le(u.winWeather1||0,1,"Sonnig")}
                  ${Le(u.winWeather2||0,2,"Extreme Hitze")}
                  ${Le(u.winWeather3||0,3,"Leichter Regen")}
                  ${Le(u.winWeather4||0,4,"Starkregen")}
                  ${Le(u.winWeather5||0,5,"Starker Wind")}
                  ${Le(u.winWeather6||0,6,"Dichter Nebel")}
                  ${Le(u.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${oe.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${u.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}function Lf(e){var p;const t=e.historyRosters||{},a=Object.keys(t).map(Number).sort((u,f)=>u-f);if(a.length===0)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Kader- und Vertragsdaten vorhanden</h3>
        <p>Für dieses Team wurden keine Verträge in der Datenbank erfasst.</p>
      </section>
    `;if(d.teamStatsSelectedRosterYear===null||!a.includes(d.teamStatsSelectedRosterYear)){const u=((p=d.gameState)==null?void 0:p.season)??2026;a.includes(u)?d.teamStatsSelectedRosterYear=u:d.teamStatsSelectedRosterYear=a[0]}const r=d.teamStatsSelectedRosterYear,n=[...t[r]||[]],i=d.teamStatsRosterSort.key,o=d.teamStatsRosterSort.direction;n.sort((u,f)=>{let g=0;if(i==="nationality"){const h=u.nationality||"",b=f.nationality||"";g=h.localeCompare(b,"de")}else if(i==="name"){const h=`${u.lastName||""}, ${u.firstName||""}`,b=`${f.lastName||""}, ${f.firstName||""}`;g=h.localeCompare(b,"de")}else if(i==="overallRating")g=(u.overallRating||0)-(f.overallRating||0);else if(i==="potential")g=(u.potential||0)-(f.potential||0);else if(i==="roleName"){const h=u.roleName||"",b=f.roleName||"";g=h.localeCompare(b,"de")}else i==="contractEndSeason"&&(g=(u.contractEndSeason||0)-(f.contractEndSeason||0));return o==="asc"?g:-g});const c=a.map(u=>`
    <option value="${u}" ${u===r?"selected":""}>Kader ${u}</option>
  `).join(""),l=u=>d.teamStatsRosterSort.key!==u?' <span style="opacity: 0.3; font-size: 0.75rem;">↕</span>':d.teamStatsRosterSort.direction==="asc"?' <span style="font-size: 0.75rem;">▲</span>':' <span style="font-size: 0.75rem;">▼</span>',m=n.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Fahrer für dieses Jahr unter Vertrag.</td></tr>':n.map(u=>{const f=u.nationality?ze[u.nationality]??u.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(u.nationality)}"></span>`:"–",h=De(`${u.firstName} ${u.lastName}`,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),b=`<span class="results-roster-overall-badge" style="color:${Xi(u.overallRating)}" title="Stärke: ${u.overallRating.toFixed(2)}">${u.overallRating.toFixed(1)}</span>`;let y="–";u.potential!=null&&(y=`<span class="results-roster-overall-badge" style="color:${Xi(u.potential)}" title="Potential: ${u.potential.toFixed(2)}">${u.potential.toFixed(1)}</span>`);const k=S(u.roleName||"-"),T=u.contractEndSeason?`Saison ${u.contractEndSeason}`:"Ohne Vertrag",$=u.contractEndSeason===r?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${S(T)}</span>`:`<span style="font-weight: 500;">${S(T)}</span>`;return`
          <tr class="rider-stats-row">
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${g}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); white-space: nowrap;">${h}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${b}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${y}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; color: #ccc;">${k}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${$}</td>
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
            ${m}
          </tbody>
        </table>
      </div>
    </section>
  `}function Xi(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function ws(e){if(!e)return null;const t=e.toLowerCase();return t==="berg"||t==="climber"?"Berg":t==="hill"||t==="puncher"?"Hügel":t==="sprint"||t==="sprinter"?"Sprint":t==="timetrial"||t==="time_trial"||t==="time trialist"||t==="zf"?"Zeitfahren":t==="cobble"||t==="classic"||t==="pave"?"Cobble":e}function Qi(e){if(!e)return 99;const t=e.toLowerCase().replace(/_/g," ").replace(/-/g," ");return t==="kapitaen"||t==="kapitän"?1:t==="co kapitaen"||t==="co kapitän"?2:t==="sprinter"?3:t==="edelhelfer"?4:t==="starke helfer"||t==="starker helfer"?5:t==="wassertraeger"||t==="wasserträger"?6:98}function Df(e){if(!e)return"Helfer";const t=e.toLowerCase().replace(/_/g," ").replace(/-/g," ");return t==="kapitaen"||t==="kapitän"?"Kapitän":t==="co kapitaen"||t==="co kapitän"?"Co-Kapitän":t==="sprinter"?"Sprinter":t==="edelhelfer"?"Edelhelfer":t==="starke helfer"||t==="starker helfer"?"Starker Helfer":t==="wassertraeger"||t==="wasserträger"?"Wasserträger":e}function _f(e){var f;const t=e.transfers||{},a=Object.keys(t).map(Number).sort((g,h)=>h-g);if(a.length===0)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Transferdaten vorhanden</h3>
        <p>Für dieses Team wurden keine Transfers erfasst.</p>
      </section>
    `;let r=typeof d.teamStatsSelectedSeason=="number"?d.teamStatsSelectedSeason:((f=d.gameState)==null?void 0:f.season)??2026;a.includes(r)||(r=a[0]);const s=a.map(g=>`
    <option value="${g}" ${g===r?"selected":""}>Saison ${g}</option>
  `).join(""),n=t[r]||{incoming:[],outgoing:[]},i=g=>{const h=[],b=ws(g.specialization1),y=ws(g.specialization2),k=ws(g.specialization3);return b&&h.push(b),y&&h.push(y),k&&h.push(k),h.length>0?h.join(" · "):"Allrounder"},o=(g,h)=>{const b=g.nationality?ze[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,y=b?`<span class="fi fi-${b} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",k=i(g),T=De(`${g.firstName} ${g.lastName}`,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});let x="";if(h==="incoming")x=`<span style="color: #64748b; font-size: 0.8rem; font-weight: normal; margin-left: 0.35rem;">(${g.fromTeamName?S(g.fromTeamName):"Freier Fahrer"})</span>`;else{const $=g.toTeamName?`zu: ${g.toTeamName}`:g.isRetired?"Karriereende":"Freier Fahrer";x=`<span style="color: #64748b; font-size: 0.8rem; font-weight: normal; margin-left: 0.35rem;">(${S($)})</span>`}return`
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); margin-bottom: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${y}
              ${T}
              ${x}
            </div>
            <div style="font-size: 0.8rem; color: #facc15; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; margin-top: 0.1rem; flex-wrap: wrap;">
              <span>${S(k)}</span>
            </div>
          </div>
        </div>
        <div style="text-align: right; flex-shrink: 0; margin-left: 0.5rem;">
          <div style="font-size: 0.85rem; font-weight: bold; color: #facc15;">${S(Df(g.roleName))}</div>
        </div>
      </div>
    `},c=g=>[...g].sort((h,b)=>{const y=Qi(h.roleName),k=Qi(b.roleName);return y!==k?y-k:(b.overallRating||0)-(h.overallRating||0)}),l=c(n.incoming),m=c(n.outgoing),p=l.length===0?'<div style="color: #64748b; font-style: italic; text-align: center; padding: 2rem;">Keine Zugänge in dieser Saison.</div>':l.map(g=>o(g,"incoming")).join(""),u=m.length===0?'<div style="color: #64748b; font-style: italic; text-align: center; padding: 2rem;">Keine Abgänge in dieser Saison.</div>':m.map(g=>o(g,"outgoing")).join("");return`
    <section class="rider-stats-transfers" style="margin-top: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h3 style="margin: 0; font-size: 1.15rem; font-weight: bold; color: #fff;">Saison-Transfers</h3>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="team-stats-transfers-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
          <select id="team-stats-transfers-season-select" class="form-control" style="background: #222; border: 1px solid #444; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer; width: auto; display: inline-block;">
            ${s}
          </select>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <!-- Zugänge (Left) -->
        <div style="background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem;">
          <h4 style="margin: 0 0 1rem 0; font-size: 1.05rem; font-weight: bold; color: #4ade80; display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">⇦</span> Zugänge (${n.incoming.length})
          </h4>
          <div style="display: flex; flex-direction: column;">
            ${p}
          </div>
        </div>
        
        <!-- Abgänge (Right) -->
        <div style="background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem;">
          <h4 style="margin: 0 0 1rem 0; font-size: 1.05rem; font-weight: bold; color: #f87171; display: flex; align-items: center; gap: 0.5rem;">
            Abgänge (${n.outgoing.length}) <span style="font-size: 1.25rem;">⇨</span>
          </h4>
          <div style="display: flex; flex-direction: column;">
            ${u}
          </div>
        </div>
      </div>
    </section>
  `}function Ue(e){return d.teamStatsTab==="career"?`
      ${br(e)}
      ${yr()}
      ${Nf(e)}
    `:d.teamStatsTab==="contracts"?`
      ${br(e)}
      ${yr()}
      ${Lf(e)}
    `:d.teamStatsTab==="transfers"?`
      ${br(e)}
      ${yr()}
      ${_f(e)}
    `:`
    ${br(e)}
    ${yr()}
    ${Pf(e)}
  `}function Af(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((r=d.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${S(a)}" aria-label="${S(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S(Js(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function Dn(e){var n;d.teamStatsSelectedTeamId=e,d.teamStatsTab="topResults",d.teamStatsTopResultsFilterCategory=null,d.teamStatsTopResultsFilterSeason=null,d.teamStatsTopResultsFilterRank=null,d.teamStatsTopResultsFilterProfile=null,d.teamStatsSelectedSeason="all",d.teamStatsSelectedRosterYear=((n=d.gameState)==null?void 0:n.season)??2026,d.teamStatsRosterSort={key:"overallRating",direction:"desc"},d.teamStatsTopResultsPage=1;const t=d.teams.find(i=>i.id===e);v("team-stats-title").innerHTML=t?`Team <strong>${S(t.name)}</strong>`:"Teamstatistik",v("team-stats-jersey").innerHTML=Af(e,(t==null?void 0:t.name)??"");const a=Ef(e),r=a.average.toFixed(2).replace(".",",");v("team-stats-meta").innerHTML=t?`${S(t.abbreviation)} · ${S(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${r})`:"Daten werden geladen",v("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,gt("teamStats");const s=await Z.getTeamStats(e);if(d.teamStatsSelectedTeamId===e){if(!s.success||!s.data){v("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}d.teamStatsPayload=s.data,v("team-stats-body").innerHTML=Ue(s.data)}}function Bf(){v("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-top-results-rank]");if(a){const o=a.dataset.teamTopResultsRank,c=o==="all"?null:Number(o);d.teamStatsTopResultsFilterRank=d.teamStatsTopResultsFilterRank===c?null:c,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload));return}const r=t.closest("button[data-team-top-results-filter]");if(r){const o=r.dataset.teamTopResultsFilter;d.teamStatsTopResultsFilters[o]=!d.teamStatsTopResultsFilters[o],d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload));return}const s=t.closest("button[data-team-stats-tab]");if(s){const o=s.dataset.teamStatsTab;(o==="topResults"||o==="career"||o==="contracts"||o==="transfers")&&(d.teamStatsTab=o,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload)));return}const n=t.closest("button[data-team-top-results-page]");if(n){const o=Number(n.dataset.teamTopResultsPage);!isNaN(o)&&o>=1&&(d.teamStatsTopResultsPage=o,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload)));return}const i=t.closest("th[data-team-roster-sort]");if(i){const o=i.dataset.teamRosterSort;o&&(d.teamStatsRosterSort.key===o?d.teamStatsRosterSort.direction=d.teamStatsRosterSort.direction==="asc"?"desc":"asc":(d.teamStatsRosterSort.key=o,d.teamStatsRosterSort.direction=o==="overallRating"||o==="potential"||o==="contractEndSeason"?"desc":"asc"),d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload)));return}}),v("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;d.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;d.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload))}else if(t.id==="team-stats-filter-profile"){const a=t;d.teamStatsTopResultsFilterProfile=a.value==="all"?null:a.value,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;d.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload))}else if(t.id==="team-stats-roster-year-select"){const a=t;d.teamStatsSelectedRosterYear=Number(a.value),d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload))}else if(t.id==="team-stats-transfers-season-select"){const a=t;d.teamStatsSelectedSeason=Number(a.value),d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ue(d.teamStatsPayload))}})}let ta="riders",Tt="season",_n="season",pt="";const Zr=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function Hf(){const e=v("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");Gf(o)})})}const t=v("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");Kf(o)})})}Zr.forEach(n=>{const i=v(n);i&&i.addEventListener("change",()=>{const o=i.value;o?Of(o,n):Zr.some(l=>{const m=v(l);return m&&m.value!==""})||(pt="",Sa())})}),window.openRiderStatsFromLeaderboard=va,window.openTeamStatsFromLeaderboard=Dn;const a=v("leaderboard-filter-wt"),r=v("leaderboard-filter-pt"),s=v("leaderboard-filter-other");[a,r,s].forEach(n=>{n&&n.addEventListener("change",()=>{Sa()})})}function zf(){Sa()}function Gf(e){ta=e;const t=v("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&((jf(pt)||pt==="strongest_lieutenants")&&(Wf(),pt=""),Tt==="live"&&(Tt=_n,wr())),Sa()}function Kf(e){Tt=e,_n=e,Sa()}function Of(e,t){pt=e,Zr.forEach(a=>{if(a!==t){const r=v(a);r&&(r.value="")}}),sd(e)?(Tt="live",wr()):An(e)?(Tt="alltime",wr()):(Tt=_n,wr()),Sa()}function sd(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function An(e){return["mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function jf(e){return sd(e)||An(e)||e==="mentors_ranking"}function Wf(){Zr.forEach(e=>{const t=v(e);t&&(t.value="")})}function wr(){const e=v("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');Tt==="live"?e.style.display="none":(e.style.display="flex",An(pt)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),Tt==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function Sa(){var p,u,f;const e=v("leaderboard-empty"),t=v("leaderboard-table"),a=v("leaderboard-thead"),r=v("leaderboard-tbody");if(!e||!t||!a||!r)return;const s=v("leaderboard-filter-container");if(s&&(s.style.display=ta==="teams"?"none":"flex"),!pt){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await Z.getLeaderboards(ta,pt,Tt);if(!xe("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(ta==="riders"){const g=((p=v("leaderboard-filter-wt"))==null?void 0:p.checked)??!0,h=((u=v("leaderboard-filter-pt"))==null?void 0:u.checked)??!0,b=((f=v("leaderboard-filter-other"))==null?void 0:f.checked)??!1;if(i=n.data.filter(y=>{const k=y.teamDivisionId===1&&!y.isRetired,T=y.teamDivisionId===2&&!y.isRetired,x=y.teamDivisionId===null||y.teamDivisionId===void 0||y.isRetired||y.teamDivisionId!==1&&y.teamDivisionId!==2;return!!(k&&g||T&&h||x&&b)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const o=pt==="highest_leadout_bonus",c=pt==="strongest_lieutenants";ta==="riders"?a.innerHTML=`
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
    `;let l="",m=1;for(const g of i){const h=m++,y=`<span class="badge ${h===1?"badge-primary":h<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${h}</span>`,k=Mt(g.teamId,g.teamName);let T="";if(o){const $=g.stageNumber!=null?`Etappe ${g.stageNumber}`:"–";T=`<td style="vertical-align: middle;">${S(g.raceName??"–")} · ${S($)} · ${S(String(g.season??"–"))}</td>`}let x="";if(c)if(g.lieutenantDetails){const $=g.lieutenantDetails,D=$.leaderNationality?ce($.leaderNationality):"",E=$.leaderRoleName?` (${$.leaderRoleName})`:"";x=`
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${D}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${$.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${S($.leaderFirstName)} ${S($.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${S(E)}</span>
            </span>
          </td>
        `}else x='<td style="vertical-align: middle;">–</td>';if(ta==="riders"){const $=g.nationality?ce(g.nationality):"—",D=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${g.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.firstName)} ${S(g.lastName)}</a>`,E=g.teamAbbr&&g.teamId!=null?`<a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #94a3b8; text-decoration: none; hover: text-decoration: underline;" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</a>`:g.teamAbbr?`<span class="text-muted" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</span>`:"—";l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${y}</td>
          <td style="text-align: center; vertical-align: middle;">${k}</td>
          <td style="text-align: center; vertical-align: middle;">${$}</td>
          <td style="vertical-align: middle;">${D}</td>
          <td style="vertical-align: middle;">${E}</td>
          ${T}
          ${x}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}else{let $="";if(g.leadoutDetails){const D=g.leadoutDetails,E=D.sprinterNationality?ce(D.sprinterNationality):"";$=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">
            <a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
              ${S(g.teamName.split(" (Sprinter:")[0])}
            </a>
          </div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${E}${S(D.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${D.contributors.map(M=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${M.nationality?ce(M.nationality):""}${S(M.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${M.contribution.toFixed(2)})</span>
                  </div>
                `).join("")}
            </div>
          </div>
        `}else $=`<strong><a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.teamName??"")}</a></strong>`;l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${y}</td>
          <td style="text-align: center; vertical-align: middle;">${k}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${$}</td>
          ${T}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}}r.innerHTML=l}let ga=2026,at=5,eo=!1;const Vf=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function to(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${r}`}function Uf(e){var s;const t=(s=d.gameState)==null?void 0:s.currentDate;if(!t||e<=t)return;const a=de(e);confirm(`Möchtest du automatisch bis zum ${a} simulieren?`)&&(d.autoProgressTargetDate=e,Wl())}function Yf(e,t){const a=[],r=new Date(e,t,1),s=new Date(e,t+1,0);let i=(r.getDay()+6)%7;const o=new Date(r);o.setDate(o.getDate()-i);const c=new Date(o);for(;c<=s||c.getDay()!==1;){const l=[];for(let m=0;m<7;m++)l.push(new Date(c)),c.setDate(c.getDate()+1);a.push(l)}return a}function Zf(){if(eo)return;eo=!0,v("calendar-prev-month").addEventListener("click",()=>{at--,at<0&&(at=11,ga--),Mr()}),v("calendar-next-month").addEventListener("click",()=>{at++,at>11&&(at=0,ga++),Mr()}),v("calendar-today-btn").addEventListener("click",()=>{var t;if((t=d.gameState)!=null&&t.currentDate){const[a,r]=d.gameState.currentDate.split("-").map(Number);ga=a,at=r-1}Mr()}),v("calendar-race-search").addEventListener("input",()=>{nd()}),v("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&zs(s);return}const r=t.target.closest("[data-calendar-date]");if(r){const s=r.dataset.calendarDate;s&&Uf(s)}}),v("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&zs(r);return}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.remove("calendar-highlight")})}},!0))}function Jf(){var e;if((e=d.gameState)!=null&&e.currentDate){const[t,a]=d.gameState.currentDate.split("-").map(Number);ga=t,at=a-1}Mr()}function Mr(){var s;if(!xe("calendar"))return;v("calendar-month-label").textContent=`${Vf[at]} ${ga}`;const e=Yf(ga,at),t=v("calendar-weeks"),a=((s=d.gameState)==null?void 0:s.currentDate)??"";let r="";for(const n of e){const i=n.map(to),o=[];for(const p of d.races)if(p.startDate<=i[6]&&p.endDate>=i[0]){const u=p.startDate<i[0]?0:i.indexOf(p.startDate),f=p.endDate>i[6]?6:i.indexOf(p.endDate);o.push({race:p,startIdx:u,endIdx:f})}o.sort((p,u)=>{const f=p.endIdx-p.startIdx+1,g=u.endIdx-u.startIdx+1;return g!==f?g-f:p.startIdx-u.startIdx});const c=Array.from({length:4},()=>Array(7).fill(!1));for(const p of o){let u=3;for(let f=0;f<4;f++){let g=!0;for(let h=p.startIdx;h<=p.endIdx;h++)if(c[f][h]){g=!1;break}if(g){u=f;break}}for(let f=p.startIdx;f<=p.endIdx;f++)c[u][f]=!0;p.slot=u}const l=n.map(p=>{const u=to(p),f=p.getMonth()!==at,g=u===a,h=u>a;return`
        <div class="${["calendar-day-cell",f?"other-month":"",g?"today":"",h?"is-future":""].filter(Boolean).join(" ")}" data-calendar-date="${u}">
          <span class="calendar-day-number" data-calendar-date="${u}">${p.getDate()}</span>
        </div>
      `}).join(""),m=o.map(p=>{var T;const u=p.race,f=a>=u.startDate&&a<=u.endDate,g=a>u.endDate,h=lt((T=u.category)==null?void 0:T.name),b=f?'<span class="calendar-live-dot"></span>':"",y=g?"opacity: 0.55;":"",k=p.endIdx-p.startIdx+1;return`
        <div class="calendar-event-bar ${f?"is-live":""}"
             data-race-id="${u.id}"
             style="grid-column: ${p.startIdx+1} / span ${k};
                    grid-row: ${p.slot+1};
                    background-color: ${h.background};
                    border: 1px solid ${h.border};
                    color: ${h.color};
                    ${y}"
             title="${S(u.name)} (${de(u.startDate)} - ${de(u.endDate)})">
          ${b}<span class="calendar-event-name">${S(u.name)}</span>
        </div>
      `}).join("");r+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${m}</div>
      </div>
    `}t.innerHTML=r,nd()}function nd(){var n;const e=v("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=v("calendar-races-tbody"),r=((n=d.gameState)==null?void 0:n.currentDate)??"",s=d.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(s.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=s.map(i=>{var b,y,k,T;const o=r>=i.startDate&&r<=i.endDate,l=r>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',m=((b=i.country)==null?void 0:b.name)??`Land ${i.countryId}`,p=(y=i.country)!=null&&y.code3?ce(i.country.code3):"",u=i.isStageRace?(i.stages??[]).reduce((x,$)=>x+($.distanceKm??0),0):((k=i.upcomingStage)==null?void 0:k.distanceKm)??null,f=i.isStageRace?(i.stages??[]).reduce((x,$)=>x+($.elevationGainMeters??0),0):((T=i.upcomingStage)==null?void 0:T.elevationGainMeters)??null,g=u!=null?String(u.toFixed(1)).replace(".",","):"-",h=f!=null?String(Math.round(f)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${de(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${S(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${In(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${p}<span>${S(m)}</span></span></td>
        <td>${is(i)}</td>
        <td>${g}</td>
        <td>${h}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}let Pt=null,Nt=null,st="id",Da=!0,fa="all",wt=new Set,Ia="all",ja=!1;const Ws=[[1,2,4],[13,14],[15,70],[62,63],[78,79],[88,90,91,92,64],[94,96]];function wa(e){const t=e.split("_"),a=t[t.length-1],r=parseInt(a,10);return isNaN(r)?1:r}function ye(e,t){return(e.split("_")[0]||"").charAt(t-1)||""}function Bn(e,t){const a=e.toLowerCase(),r=a.includes("cobble")&&!a.includes("non_cobble")&&!a.includes("non cobble")&&!a.includes("non-cobble");return t==="cobble"?r:t==="non-cobble"?!r:!0}function Jt(e){const t=new Date(e);t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));const a=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t.getTime()-a.getTime())/864e5+1)/7)}function ka(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return"peak";const r=n=>{const i=n-8,o=n-1;if(i>=1)return t>=i&&t<=o;{const c=i+53;return t>=c||t<=o}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)?"prep":"none"}function id(e){return e==="peak"?"cell-peak":e==="prep"?"cell-prep":""}function qf(e,t){if(t.cachedKws){for(const s of t.cachedKws){const n=ka(e,s);if(n==="peak"||n==="prep")return!0}return!1}const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${o}`,l=Jt(c),m=ka(e,l);if(m==="peak"||m==="prep")return!0}return!1}function ao(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return!0;const r=s=>{const n=s-6,i=s-1;if(n>=1)return t>=n&&t<=i;{const o=n+53;return t>=o||t<=i}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)}function Xf(e,t){if(t.cachedKws){for(const s of t.cachedKws)if(ao(e,s))return!0;return!1}const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${o}`,l=Jt(c);if(ao(e,l))return!0}return!1}function od(e,t,a){const r=[{min:e.peak1_min,max:e.peak1_max},{min:e.peak2_min,max:e.peak2_max},{min:e.peak3_min,max:e.peak3_max}].sort((l,m)=>l.min-m.min);let s=0,n=0,i=0,o=0;const c=a.races.filter(l=>t.has(l.id));for(const l of c){if(l.cachedDays){l.cachedDays.forEach(u=>{const f=u.kw;f<=r[0].max?s++:f<=r[1].max?n++:f<=r[2].max?i++:o++});continue}const m=new Date(l.start_date),p=new Date(l.end_date);for(let u=new Date(m);u<=p;u.setDate(u.getDate()+1)){const f=u.getFullYear(),g=String(u.getMonth()+1).padStart(2,"0"),h=String(u.getDate()).padStart(2,"0"),b=`${f}-${g}-${h}`,y=Jt(b);y<=r[0].max?s++:y<=r[1].max?n++:y<=r[2].max?i++:o++}}return{phase1:s,phase2:n,phase3:i,phase4:o}}function Qf(e,t,a){let r;a.programToRacesMap?(r=new Set(a.programToRacesMap.get(e.id)||[]),r.delete(t.id)):r=new Set(a.raceProgramRaces.filter(c=>c.program_id===e.id&&c.race_id!==t.id).map(c=>c.race_id));const s=od(e,r,a),n=new Set,i=[{min:e.peak1_min,max:e.peak1_max},{min:e.peak2_min,max:e.peak2_max},{min:e.peak3_min,max:e.peak3_max}].sort((c,l)=>c.min-l.min);if(t.cachedDays)t.cachedDays.forEach(c=>{const l=c.kw;l<=i[0].max?n.add("phase1"):l<=i[1].max?n.add("phase2"):l<=i[2].max?n.add("phase3"):n.add("phase4")});else{const c=new Date(t.start_date),l=new Date(t.end_date);for(let m=new Date(c);m<=l;m.setDate(m.getDate()+1)){const p=m.getFullYear(),u=String(m.getMonth()+1).padStart(2,"0"),f=String(m.getDate()).padStart(2,"0"),g=`${p}-${u}-${f}`,h=Jt(g);h<=i[0].max?n.add("phase1"):h<=i[1].max?n.add("phase2"):h<=i[2].max?n.add("phase3"):n.add("phase4")}}const o=t.is_stage_race===1;for(const c of n)if(c==="phase1"){if(o&&s.phase1>35||!o&&s.phase1>36)return!1}else if(c==="phase2"){if(o&&s.phase2>35||!o&&s.phase2>36)return!1}else if(c==="phase3"&&(o&&s.phase3>35||!o&&s.phase3>36))return!1;return!0}function eh(e,t){const a=d.raceProgramsPayload;if(!a)return;const r=a.raceProgramRaces.findIndex(i=>i.program_id===e&&i.race_id===t),s=ja?Ws.find(i=>i.includes(t)):null,n=s||[t];if(r===-1)for(const i of n){if(a.raceProgramRaces.some(l=>l.program_id===e&&l.race_id===i))continue;const c=a.races.find(l=>l.id===i);if(c){const l=c.start_date,m=c.end_date,p=[];a.raceProgramRaces.forEach((u,f)=>{if(u.program_id===e&&u.race_id!==i){const g=a.races.find(h=>h.id===u.race_id);g&&g.start_date<=m&&g.end_date>=l&&p.push(f)}}),p.sort((u,f)=>f-u).forEach(u=>{a.raceProgramRaces.splice(u,1)})}a.raceProgramRaces.push({program_id:e,race_id:i})}else for(const i of n){const o=a.raceProgramRaces.findIndex(c=>c.program_id===e&&c.race_id===i);o!==-1&&a.raceProgramRaces.splice(o,1)}d.raceProgramsDirty=!0,Ie()}const Jr=(()=>{const e=[],t=new Date(2026,0,1),a=new Date(2026,11,31),r=["So","Mo","Di","Mi","Do","Fr","Sa"];for(let s=new Date(t);s<=a;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${o}`,l=`${r[s.getDay()]}, ${o}.${String(s.getMonth()+1).padStart(2,"0")}`;e.push({dateStr:c,label:l,weekNum:Jt(c)})}return e})();function th(e){if(!e||e.enriched)return;e.races.forEach(r=>{const s=[],n=new Set,i=new Date(r.start_date),o=new Date(r.end_date);for(let c=new Date(i);c<=o;c.setDate(c.getDate()+1)){const l=c.getFullYear(),m=String(c.getMonth()+1).padStart(2,"0"),p=String(c.getDate()).padStart(2,"0"),u=`${l}-${m}-${p}`,f=Jt(u);s.push({dateStr:u,kw:f}),n.add(f)}r.cachedDays=s,r.cachedKws=Array.from(n)});const t=new Map;Jr.forEach(r=>{t.set(r.dateStr,[])}),e.races.forEach(r=>{r.cachedDays&&r.cachedDays.forEach(s=>{const n=t.get(s.dateStr);n&&n.push(r)})}),e.racesByDate=t;const a=new Map;e.programDistribution.forEach(r=>{a.set(r.program_id,r)}),e.distributionMap=a,e.enriched=!0}function Vs(e){if(!e)return;const t=new Map,a=new Map;e.raceProgramRaces.forEach(r=>{t.set(`${r.program_id}_${r.race_id}`,r),a.has(r.program_id)||a.set(r.program_id,new Set),a.get(r.program_id).add(r.race_id)}),e.assignmentMap=t,e.programToRacesMap=a}async function Hn(e=!1){if(d.raceProgramsPayload&&!e){Vs(d.raceProgramsPayload),wt.size===0&&d.raceProgramsPayload.raceCategories&&(wt=new Set(d.raceProgramsPayload.raceCategories.map(a=>a.id))),Ie();return}v("race-programs-root").innerHTML='<div class="results-empty">Programmdaten werden geladen...</div>';const t=await Z.getRaceProgramsEditor();if(!t.success||!t.data){v("race-programs-root").innerHTML=`<div class="results-empty text-danger">${S(t.error??"Fehler beim Laden.")}</div>`;return}d.raceProgramsPayload=t.data,th(d.raceProgramsPayload),Vs(d.raceProgramsPayload),d.raceProgramsDirty=!1,d.raceProgramsSaving=!1,Pt=null,Nt=null,d.raceProgramsPayload&&d.raceProgramsPayload.raceCategories&&(wt=new Set(d.raceProgramsPayload.raceCategories.map(a=>a.id))),Ie()}function ah(){v("view-race-programs").addEventListener("click",e=>{const t=e.target,a=t.closest(".results-type-btn[data-tab]");if(a){const p=a.dataset.tab??"calendar-cols";d.raceProgramsActiveTab=p,Ie();return}const r=t.closest(".race-programs-action-btn");if(r){const p=r.dataset.action;p==="reload"?Hn(!0):p==="save"&&sh();return}const s=t.closest(".race-row-expand-btn");if(s){const p=s.dataset.raceId,u=v(`race-details-row-${p}`);u&&(u.classList.toggle("hidden"),s.textContent=u.classList.contains("hidden")?"▶":"▼");return}const n=t.closest(".program-row-expand-btn");if(n){const p=n.dataset.programId,u=v(`program-details-row-${p}`);u&&(u.classList.toggle("hidden"),n.textContent=u.classList.contains("hidden")?"▶":"▼");return}const i=t.closest(".program-roles-sort-header");if(i){const p=i.dataset.sortKey;st===p?Da=!Da:(st=p,Da=p==="name"||p==="id"),Ie();return}const o=t.closest(".combo-origin-trigger");if(o){const p=o.dataset.raceId,u=o.dataset.comboKey,f=v(`combo-origin-${p}-${u}`);f&&f.classList.toggle("hidden");return}const c=t.closest(".race-popover-trigger");if(c){e.stopPropagation();const p=parseInt(c.dataset.raceId??"0",10);Nt=null,Pt===p?Pt=null:Pt=p,Ie();return}const l=t.closest(".race-rider-count-trigger");if(l){e.stopPropagation();const p=parseInt(l.dataset.raceId??"0",10);Pt=null,Nt===p?Nt=null:Nt=p,Ie();return}const m=t.closest(".popover-program-toggle");if(m){if(e.stopPropagation(),m.classList.contains("disabled"))return;const p=parseInt(m.dataset.programId??"0",10),u=parseInt(m.dataset.raceId??"0",10);eh(p,u);return}!t.closest(".race-stages-popover-card")&&!t.closest(".race-rider-programs-popover-card")&&(Pt!==null||Nt!==null)&&(Pt=null,Nt=null,Ie())}),v("view-race-programs").addEventListener("click",e=>{const t=e.target.closest(".toggleable-race-cell[data-day]");if(!t)return;const a=t.dataset.day,r=parseInt(t.dataset.programId,10);rh(r,a)}),v("view-race-programs").addEventListener("change",e=>{const t=e.target;if(t.classList.contains("filter-cobble-radio")){fa=t.value,Ie();return}if(t.classList.contains("popover-filter-cobble-radio")){Ia=t.value,Ie();return}if(t.classList.contains("filter-category-checkbox")){const a=parseInt(t.dataset.categoryId,10);t.checked?wt.add(a):wt.delete(a),Ie();return}if(t.classList.contains("filter-auto-blocks-checkbox")){ja=t.checked,Ie();return}})}function rh(e,t){const a=d.raceProgramsPayload;if(!a)return;const r=a.races.filter(n=>n.start_date<=t&&n.end_date>=t);if(r.length===0)return;const s=a.raceProgramRaces.findIndex(n=>n.program_id===e&&r.some(i=>i.id===n.race_id));if(s===-1){const n=r[0],i=ja?Ws.find(c=>c.includes(n.id)):null,o=i||[n.id];for(const c of o){if(a.raceProgramRaces.some(p=>p.program_id===e&&p.race_id===c))continue;const m=a.races.find(p=>p.id===c);if(m){const p=m.start_date,u=m.end_date,f=[];a.raceProgramRaces.forEach((g,h)=>{if(g.program_id===e&&g.race_id!==c){const b=a.races.find(y=>y.id===g.race_id);b&&b.start_date<=u&&b.end_date>=p&&f.push(h)}}),f.sort((g,h)=>h-g).forEach(g=>{a.raceProgramRaces.splice(g,1)})}a.raceProgramRaces.push({program_id:e,race_id:c})}}else{const n=a.raceProgramRaces[s];if(ja){const o=Ws.find(c=>c.includes(n.race_id));if(o){for(const c of o){const l=a.raceProgramRaces.findIndex(m=>m.program_id===e&&m.race_id===c);l!==-1&&a.raceProgramRaces.splice(l,1)}d.raceProgramsDirty=!0,Ie();return}}const i=r.findIndex(o=>o.id===n.race_id);i<r.length-1?n.race_id=r[i+1].id:a.raceProgramRaces.splice(s,1)}d.raceProgramsDirty=!0,Ie()}async function sh(){if(!d.raceProgramsPayload||d.raceProgramsSaving)return;d.raceProgramsSaving=!0,Ie();const e=await Z.saveRaceProgramsEditor({programs:d.raceProgramsPayload.programs,raceProgramRaces:d.raceProgramsPayload.raceProgramRaces});if(d.raceProgramsSaving=!1,!e.success){alert(`Fehler beim Speichern:
${e.error??"Unbekannter Fehler"}`),Ie();return}d.raceProgramsDirty=!1,Hn(!0)}function us(e,t){let a=0,r=0,s=0,n;t.programToRacesMap?n=t.programToRacesMap.get(e.id)||new Set:n=new Set(t.raceProgramRaces.filter(o=>o.program_id===e.id).map(o=>o.race_id));const i=t.races.filter(o=>n.has(o.id));for(const o of i){if(o.cachedDays){o.cachedDays.forEach(m=>{const p=ka(e,m.kw);p==="peak"?a++:p==="prep"?r++:s++});continue}const c=new Date(o.start_date),l=new Date(o.end_date);for(let m=new Date(c);m<=l;m.setDate(m.getDate()+1)){const p=m.getFullYear(),u=String(m.getMonth()+1).padStart(2,"0"),f=String(m.getDate()).padStart(2,"0"),g=Jt(`${p}-${u}-${f}`),h=ka(e,g);h==="peak"?a++:h==="prep"?r++:s++}}return{peak:a,prep:r,none:s}}function Ie(){const e=v("race-programs-root"),t=d.raceProgramsPayload;if(!t){e.innerHTML='<div class="results-empty">Keine Daten geladen.</div>';return}Vs(t);const a=window.scrollX,r=window.scrollY,s={},n=document.querySelector(".team-detail-table-scroll");n&&(s.table={scrollTop:n.scrollTop,scrollLeft:n.scrollLeft}),document.querySelectorAll(".popover-program-list-scroll").forEach(g=>{const h=g.getAttribute("data-race-id");h&&(s[`popover-${h}`]={scrollTop:g.scrollTop,scrollLeft:g.scrollLeft})});const o=d.raceProgramsDirty,c=d.raceProgramsSaving,l=d.raceProgramsActiveTab;function m(g){const h=g.raceCategories.map(b=>{const y=wt.has(b.id),k=lt(b.name);return`
      <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
        <input type="checkbox" class="filter-category-checkbox" data-category-id="${b.id}" ${y?"checked":""}>
        <span class="race-id-badge" style="background-color: ${k.background}; border: 1px solid ${k.border}; color: ${k.color}; font-size: 0.72rem; padding: 0.05rem 0.25rem; border-radius: 3px;">
          ${S(b.name)}
        </span>
      </label>
    `}).join(`
`);return`
    <div class="race-programs-filters-card" style="margin-top: 1rem; padding: 0.8rem; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-md);">
      <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
        
        <!-- Cobble / Non-Cobble Filter -->
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="font-weight: bold; font-size: 0.85rem; color: var(--text-300);">Programm-Typ:</span>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="radio" name="filter-cobble-radio" class="filter-cobble-radio" value="all" ${fa==="all"?"checked":""}> Alle
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="radio" name="filter-cobble-radio" class="filter-cobble-radio" value="cobble" ${fa==="cobble"?"checked":""}> Cobble
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="radio" name="filter-cobble-radio" class="filter-cobble-radio" value="non-cobble" ${fa==="non-cobble"?"checked":""}> Non-Cobble
          </label>
        </div>

        <!-- Auto-Assign Blocks Option -->
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <label style="display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; font-weight: bold; cursor: pointer; user-select: none; color: var(--accent-h);">
            <input type="checkbox" class="filter-auto-blocks-checkbox" ${ja?"checked":""}> Rennblöcke verkoppeln
          </label>
        </div>

        <!-- Race Categories Filters -->
        <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
          <span style="font-weight: bold; font-size: 0.85rem; color: var(--text-300);">Rennen anzeigen nach Kategorie:</span>
          ${h}
        </div>

      </div>
    </div>
  `}let p=`
    <div class="race-programs-layout">
      <div class="race-programs-toolbar">
        <div class="results-type-tabs" style="margin: 0;">
          <button class="results-type-btn${l==="calendar-cols"?" active":""}" data-tab="calendar-cols">Kalender Programme (Spalten)</button>
          <button class="results-type-btn${l==="calendar-rows"?" active":""}" data-tab="calendar-rows">Kalender Programme (Zeilen)</button>
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
  `;l==="calendar-cols"?(p+=m(t),p+=nh(t)):l==="calendar-rows"?(p+=m(t),p+=ih(t)):l==="rider-role"?p+=lh(t):l==="program-roles"&&(p+=ch(t)),p+="</div>",e.innerHTML=p;const u=document.querySelector(".team-detail-table-scroll");u&&s.table&&(u.scrollTop=s.table.scrollTop,u.scrollLeft=s.table.scrollLeft),document.querySelectorAll(".popover-program-list-scroll").forEach(g=>{const h=g.getAttribute("data-race-id");h&&s[`popover-${h}`]&&(g.scrollTop=s[`popover-${h}`].scrollTop,g.scrollLeft=s[`popover-${h}`].scrollLeft)}),window.scrollTo(a,r)}function nh(e){var u,f,g;const t=e.programs,a=e.raceProgramRaces,r=e.races,s=e.programDistribution,n=e.distributionMap,i=e.racesByDate,o=e.assignmentMap,c=t.filter(h=>{const b=n?n.get(h.id):s.find(k=>k.program_id===h.id);return(b?parseInt(b.deterministic_rider_count||"0",10):0)===0?!1:Bn(h.name,fa)});c.sort((h,b)=>{let y=3;const k=ye(h.name,1),T=ye(h.name,2);k==="F"?y=1:T==="F"&&(y=2);let x=3;const $=ye(b.name,1),D=ye(b.name,2);return $==="F"?x=1:D==="F"&&(x=2),y!==x?y-x:h.name.localeCompare(b.name)});const l=c.map(h=>({id:h.id,stats:us(h,e)}));let m=`<tr>
    <th class="sticky-col-header" style="z-index: 15;">Tag / Datum</th>
    <th style="width: 50px; text-align: center;">KW</th>
  `;for(const h of c){const b=(u=l.find(T=>T.id===h.id))==null?void 0:u.stats,y=n?n.get(h.id):s.find(T=>T.program_id===h.id),k=y?parseInt(y.deterministic_rider_count||"0",10):0;m+=`
      <th style="min-width: 100px; max-width: 120px; text-align: center; vertical-align: top; padding: 0.35rem 0.2rem;">
        <div style="font-weight: bold; font-size: 0.72rem; line-height: 1.2; white-space: normal; word-wrap: break-word; overflow-wrap: break-word;">
          ${S(h.name).replace(/_/g," ")}
        </div>
        <div style="font-size: 0.7rem; font-weight: normal; color: var(--accent-h); margin-top: 0.15rem;">
          (${k} F)
        </div>
        <div class="text-muted" style="font-size: 0.62rem; margin-top: 0.2rem; font-weight: normal; white-space: nowrap;">
          P: <span style="color: #fb923c; font-weight: bold;">${b==null?void 0:b.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${b==null?void 0:b.prep}</span> | 
          O: <span>${b==null?void 0:b.none}</span>
        </div>
      </th>
    `}m+="</tr>";let p="";for(const h of Jr){const b=(i?i.get(h.dateStr)||[]:r.filter($=>$.start_date<=h.dateStr&&$.end_date>=h.dateStr)).filter($=>wt.has($.category_id)),y=b.length>0,k=y?"row-has-races":"";let T="";if(y){T='<div style="display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.15rem;">';for(const $ of b){const D=lt((f=$.category)==null?void 0:f.name);T+=`
          <span class="race-id-badge" style="background-color: ${D.background}; border: 1px solid ${D.border}; color: ${D.color}; font-size: 0.65rem; padding: 0.05rem 0.2rem; text-align: left; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${S($.name)}">
            ${S($.name)}
          </span>
        `}T+="</div>"}let x=`
      <td class="sticky-col ${k}" style="font-weight: 600; vertical-align: top; padding: 0.4rem 0.6rem;">
        <div>${h.label}</div>
        ${T}
      </td>
      <td style="text-align: center; color: var(--text-500); font-variant-numeric: tabular-nums; vertical-align: top; padding-top: 0.4rem;">${h.weekNum}</td>
    `;for(const $ of c){const D=ka($,h.weekNum),E=id(D);let M=null;if(o)for(const N of b){const H=`${$.id}_${N.id}`,z=o.get(H);if(z){M=z;break}}else M=a.find(N=>N.program_id===$.id&&b.some(H=>H.id===N.race_id));let R="",_=`toggleable-race-cell ${E}`,F=`data-day="${h.dateStr}" data-program-id="${$.id}"`;if(M){const N=r.find(z=>z.id===M.race_id),H=lt((g=N==null?void 0:N.category)==null?void 0:g.name);R=`
          <span class="race-program-badge" style="background-color: ${H.background}; border: 1px solid ${H.border}; color: ${H.color};" title="${S(N==null?void 0:N.name)}">
            ${S(N==null?void 0:N.name)}
          </span>
        `}else y?R='<span class="race-cell-placeholder" title="Klicken zum Zuweisen">＋</span>':(_=E,F="");x+=`<td class="${_}" ${F} style="text-align: center; vertical-align: middle;">${R}</td>`}p+=`<tr>${x}</tr>`}return`
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh;">
        <table class="data-table data-table-teams race-programs-calendar-table">
          <thead>
            ${m}
          </thead>
          <tbody>
            ${p}
          </tbody>
        </table>
      </div>
    </div>
  `}function ih(e){var T;const t=e.programs,a=e.raceProgramRaces,r=e.races,s=e.programDistribution,n=e.distributionMap,i=e.racesByDate,o=e.assignmentMap,c=t.filter(x=>{const $=n?n.get(x.id):s.find(E=>E.program_id===x.id);return($?parseInt($.deterministic_rider_count||"0",10):0)===0?!1:Bn(x.name,fa)});c.sort((x,$)=>{let D=3;const E=ye(x.name,1),M=ye(x.name,2);E==="F"?D=1:M==="F"&&(D=2);let R=3;const _=ye($.name,1),F=ye($.name,2);return _==="F"?R=1:F==="F"&&(R=2),D!==R?D-R:x.name.localeCompare($.name)});let l='<th class="sticky-col-header" style="z-index: 15;">Monat</th>',m='<th class="sticky-col-header" style="z-index: 15;">Tag / KW</th>',p='<th class="sticky-col-header" style="z-index: 15;">Rennen Anzahl</th>',u='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #1</th>',f='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #2</th>',g='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #3</th>';const h=[],b=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],y=new Map;a.forEach(x=>{y.set(x.race_id,(y.get(x.race_id)||0)+1)});for(const x of Jr){const $=parseInt(x.dateStr.split("-")[1],10)-1,D=b[$];h.length===0||h[h.length-1].name!==D?h.push({name:D,span:1}):h[h.length-1].span++;const E=(i?i.get(x.dateStr)||[]:r.filter(N=>N.start_date<=x.dateStr&&N.end_date>=x.dateStr)).filter(N=>wt.has(N.category_id)),M=E.length>0,R=M?`${E.length} R`:"",_=M?"race-count-active":"";m+=`<th style="text-align: center; min-width: 40px; font-variant-numeric: tabular-nums;">
      <div style="font-size: 0.8rem; font-weight: bold;">${x.dateStr.split("-")[2]}</div>
      <div style="font-size: 0.65rem; color: var(--text-500);">W${x.weekNum}</div>
    </th>`,p+=`<th class="${_}" style="text-align: center; font-size: 0.72rem; font-weight: bold;">${R}</th>`;const F=N=>{var G;const H=E[N];if(!H)return"";const z=lt((G=H.category)==null?void 0:G.name),I=y.get(H.id)||0;return`
        <span class="race-id-badge" style="background-color: ${z.background}; border: 1px solid ${z.border}; color: ${z.color}; cursor: help;" 
              title="${S(H.name)}
Zugelassene Programme: ${I}">
          R${H.id}
        </span>
      `};u+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${F(0)}</th>`,f+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${F(1)}</th>`,g+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${F(2)}</th>`}for(const x of h)l+=`<th colspan="${x.span}" style="text-align: center; font-weight: bold; border-left: 1px solid var(--border);">${x.name}</th>`;let k="";for(const x of c){const $=us(x,e),D=n?n.get(x.id):s.find(R=>R.program_id===x.id),E=D?parseInt(D.deterministic_rider_count||"0",10):0;let M=`
      <td class="sticky-col" style="z-index: 5; white-space: nowrap; font-weight: bold; border-right: 2px solid var(--border);">
        <div style="font-size: 0.85rem;">${S(x.name)} (${E} F)</div>
        <div class="text-muted" style="font-size: 0.7rem; font-weight: normal; margin-top: 0.1rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${$.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${$.prep}</span> | 
          O: <span>${$.none}</span>
        </div>
      </td>
    `;for(const R of Jr){const _=ka(x,R.weekNum),F=id(_),N=(i?i.get(R.dateStr)||[]:r.filter(K=>K.start_date<=R.dateStr&&K.end_date>=R.dateStr)).filter(K=>wt.has(K.category_id)),H=N.length>0;let z=null;if(o)for(const K of N){const q=`${x.id}_${K.id}`,Q=o.get(q);if(Q){z=Q;break}}else z=a.find(K=>K.program_id===x.id&&N.some(q=>q.id===K.race_id));let I="",G=`toggleable-race-cell ${F}`,U=`data-day="${R.dateStr}" data-program-id="${x.id}"`;if(z){const K=r.find(Q=>Q.id===z.race_id),q=lt((T=K==null?void 0:K.category)==null?void 0:T.name);I=`
          <span class="race-id-badge" style="background-color: ${q.background}; border: 1px solid ${q.border}; color: ${q.color};" title="${S(K==null?void 0:K.name)}">
            R${K==null?void 0:K.id}
          </span>
        `}else H?I='<span style="font-size: 0.72rem; color: var(--text-500); opacity: 0.5;">＋</span>':(G=F,U="");M+=`<td class="${G}" ${U} style="text-align: center; vertical-align: middle; padding: 0.35rem 0;">${I}</td>`}k+=`<tr>${M}</tr>`}return`
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh; overflow-x: auto;">
        <table class="data-table data-table-teams race-programs-calendar-table">
          <thead>
            <tr class="month-header-row">${l}</tr>
            <tr>${m}</tr>
            <tr style="background: rgba(148, 163, 184, 0.05);">${p}</tr>
            <tr>${u}</tr>
            <tr>${f}</tr>
            <tr>${g}</tr>
          </thead>
          <tbody>
            ${k}
          </tbody>
        </table>
      </div>
    </div>
  `}function oh(e,t){const a=t.filter(o=>o.race_id===e).sort((o,c)=>o.stage_number-c.stage_number);if(a.length===0)return{countHtml:"Keine Etappen",stagesListHtml:"Keine Etappendaten vorhanden."};const r={};for(const o of a)r[o.profile]=(r[o.profile]||0)+1;const n=Object.entries(r).sort((o,c)=>c[1]-o[1]).map(([o,c])=>`${S(o)}: ${c}x`).join("<br>"),i=a.map(o=>`
    <div class="popover-stage-row">
      <span class="popover-stage-num">Et. ${o.stage_number}:</span>
      <span class="popover-stage-profile">${S(o.profile)}</span>
    </div>
  `).join("");return{countHtml:n,stagesListHtml:i}}function lh(e){const t=[...e.races].sort((m,p)=>m.start_date.localeCompare(p.start_date)),a=e.raceProgramRaces,r=e.stages,s=e.programDistribution,n=e.distributionMap,i=e.assignmentMap,o=new Map;e.programs.forEach(m=>{o.set(m.id,us(m,e))});const c=new Map;return a.forEach(m=>{c.has(m.race_id)||c.set(m.race_id,new Set),c.get(m.race_id).add(m.program_id)}),`
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
            ${t.map(m=>{var Te,Re,je,dt;const p=c.get(m.id)||new Set,u=s.filter(B=>p.has(B.program_id));let f=null;if(m.is_stage_race===0){const B=r.find(W=>W.race_id===m.id),O=((B==null?void 0:B.profile)??"").toLowerCase();O==="cobble"||O==="cobble_hill"||O==="cobblehill"?f="P":O==="flat"||O==="rolling"?f="S":O==="hilly"||O==="hilly_difficult"?f="H":O==="medium_mountain"||O==="high_mountain"||O==="mountain"?f="B":(O==="itt"||O==="ttt")&&(f="T")}const g=e.programs.map(B=>{const O=i?i.has(`${B.id}_${m.id}`):a.some(xa=>xa.program_id===B.id&&xa.race_id===m.id),W=n?n.get(B.id):s.find(xa=>xa.program_id===B.id),Y=W?parseInt(W.deterministic_rider_count||"0",10):0,ue=W?parseInt(W.deterministic_role_Kapitaen||"0",10):0,$e=W?parseInt(W.deterministic_role_Co_Kapitaen||"0",10):0,We=W?parseInt(W.deterministic_role_Edelhelfer||"0",10):0,_e=W?parseInt(W.deterministic_role_Starke_Helfer||"0",10):0,ve=W?parseInt(W.deterministic_role_Wassertraeger||"0",10):0,Ve=W?parseInt(W.deterministic_role_Sprinter||"0",10):0,we=[];ue>0&&we.push(`${ue} Kapitän`),$e>0&&we.push(`${$e} Co-Kapitän`),We>0&&we.push(`${We} Edelhelfer`),_e>0&&we.push(`${_e} Starke Helfer`),ve>0&&we.push(`${ve} Wasserträger`),Ve>0&&we.push(`${Ve} Sprinter`);const qt=we.length>0?`(${we.join(", ")})`:"",Ct=o.get(B.id)||{peak:0,prep:0,none:0},$a=Ct.peak+Ct.prep+Ct.none;return{program:B,isAssigned:O,count:Y,rolesStr:qt,totalDays:$a}});if(f!==null){const B=f,O=m.is_stage_race===0&&(((Re=(Te=r.find(W=>W.race_id===m.id))==null?void 0:Te.profile)==null?void 0:Re.toLowerCase())==="flat"||((dt=(je=r.find(W=>W.race_id===m.id))==null?void 0:je.profile)==null?void 0:dt.toLowerCase())==="rolling");g.sort((W,Y)=>{let ue=3,$e=3;if(O){const ve=ye(W.program.name,1),Ve=ye(W.program.name,2),we=ye(W.program.name,3);ve==="S"||ve==="F"?ue=0:Ve==="S"||Ve==="F"?ue=1:(we==="S"||we==="F")&&(ue=2);const qt=ye(Y.program.name,1),Ct=ye(Y.program.name,2),$a=ye(Y.program.name,3);qt==="S"||qt==="F"?$e=0:Ct==="S"||Ct==="F"?$e=1:($a==="S"||$a==="F")&&($e=2)}else ye(W.program.name,1)===B?ue=0:ye(W.program.name,2)===B?ue=1:ye(W.program.name,3)===B&&(ue=2),ye(Y.program.name,1)===B?$e=0:ye(Y.program.name,2)===B?$e=1:ye(Y.program.name,3)===B&&($e=2);if(ue!==$e)return ue-$e;if(Y.count!==W.count)return Y.count-W.count;const We=wa(W.program.name),_e=wa(Y.program.name);return We!==_e?We-_e:W.program.id-Y.program.id})}else g.sort((B,O)=>{if(B.isAssigned!==O.isAssigned)return B.isAssigned?-1:1;if(O.count!==B.count)return O.count-B.count;const W=wa(B.program.name),Y=wa(O.program.name);return W!==Y?W-Y:B.program.id-O.program.id});const b=g.filter(B=>B.count===0?!1:Bn(B.program.name,Ia)).map(B=>{const O=B.program,W=qf(O,m);let Y="";W||(Y='<span style="color: #fb923c; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(251, 146, 60, 0.15); border: 1px solid #fb923c; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb der Peak- und Aufbauphase dieses Programms!">!</span>');let ue="";Xf(O,m)||(ue='<span style="color: #c084fc; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(192, 132, 252, 0.15); border: 1px solid #c084fc; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb des Peakbereichs und der 6-wöchigen Anstiegsphase dieses Programms!">!</span>');let We="";Qf(O,m,e)||(We='<span style="color: #38bdf8; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; border-radius: 50%; font-size: 0.65rem;" title="Achtung: Dieses Programm hat in diesem Saisonabschnitt bereits das Limit an Renntagen erreicht (max. 36 Tage bzw. 35 Tage für Rundfahrten)!">!</span>');let ve="";if(!B.isAssigned){const zn=a.filter(ct=>ct.program_id===O.id&&ct.race_id!==m.id).map(ct=>e.races.find(ms=>ms.id===ct.race_id)).filter(ct=>ct&&ct.start_date<=m.end_date&&ct.end_date>=m.start_date);if(zn.length>0){const ct=zn.map(ms=>ms.name).join(", ");ve=`<span style="color: #ef4444; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 50%; font-size: 0.65rem;" title="Kollision: Dieses Programm ist bereits einem zeitlich parallelen Rennen zugewiesen: ${S(ct)}!">!</span>`}}const Ve=wa(O.name),we=Ve>=1&&Ve<=3?"#f97316":"#22c55e",qt=B.isAssigned?`font-weight: bold; color: ${we}; text-shadow: 0 0 1px ${we};`:`color: ${we}; opacity: 0.75;`,Ct=B.isAssigned?"☑":"☐";return`
        <div class="popover-program-toggle" data-program-id="${O.id}" data-race-id="${m.id}" 
             style="cursor: pointer; padding: 0.45rem 0.6rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); transition: background-color 0.15s; white-space: nowrap;"
             onmouseover="this.style.backgroundColor='rgba(99, 102, 241, 0.08)'"
             onmouseout="this.style.backgroundColor='transparent'">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
            <span style="font-size: 1.15rem; line-height: 1; user-select: none; color: ${B.isAssigned?"var(--accent-h)":"var(--text-500)"};">${Ct}</span>
            <span style="${qt} font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis;" title="${S(O.name)} (${B.totalDays} Renntage)">
              ${S(O.name)} (${B.totalDays} RT)
            </span>
            ${Y}
            ${ue}
            ${We}
            ${ve}
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;">
            <strong style="font-size: 0.8rem; color: var(--accent-h);">${B.count} Fahrer</strong>
            <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal;" title="${S(B.rolesStr)}">${S(B.rolesStr)}</span>
          </div>
        </div>
      `}).join(""),y=Nt===m.id;let k=0,T=0,x=0,$=0,D=0,E=0,M=0;const R={Kapitaen:{},Co_Kapitaen:{},Sprinter:{},Edelhelfer:{},Starke_Helfer:{},Wassertraeger:{}},_=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],F=["Berg","Hill","Sprint","Timetrial","Cobble","Attacker"];for(const B of u){k+=parseInt(B.deterministic_rider_count||"0",10),T+=parseInt(B.deterministic_role_Kapitaen||"0",10),x+=parseInt(B.deterministic_role_Co_Kapitaen||"0",10),$+=parseInt(B.deterministic_role_Sprinter||"0",10),D+=parseInt(B.deterministic_role_Edelhelfer||"0",10),E+=parseInt(B.deterministic_role_Starke_Helfer||"0",10),M+=parseInt(B.deterministic_role_Wassertraeger||"0",10);for(const O of _)for(const W of F){const Y=`deterministic_${O}_spec1_${W}`,ue=parseInt(B[Y]||"0",10);R[O][W]=(R[O][W]||0)+ue}}let N=0;m.is_stage_race===1&&(N=r.filter(O=>O.race_id===m.id).filter(O=>{const W=(O.profile||"").toLowerCase();return W==="flat"||W==="rolling"}).length);let H=!1,z=0;if(m.is_stage_race===0){const B=r.find(W=>W.race_id===m.id),O=((B==null?void 0:B.profile)||"").toLowerCase();H=O==="cobble"||O==="cobble_hill",H&&(z=(e.roleSpecCombinations||[]).filter(Y=>p.has(Y.program_id)).filter(Y=>Y.spec1==="Cobble"||Y.spec2==="Cobble"||Y.spec3==="Cobble").reduce((Y,ue)=>Y+ue.count,0))}let I="<strong>Rennprogramme verwalten</strong>";m.is_stage_race===0&&H?I=`
        <strong>Rennprogramme verwalten 
          (<span style="color: ${z<20?"#ef4444":"var(--accent-h)"}; font-weight: bold;" title="Kopfsteinpflaster-Spezialisten: ${z} / min. 20">Gesamtfahrer: ${k}</span>)
        </strong>
      `:I=`<strong>Rennprogramme verwalten (Gesamtfahrer: ${k})</strong>`;const G=`
      <div class="race-rider-programs-popover-card ${y?"":"hidden"}"
           style="position: absolute; top: calc(100% + 0.45rem); right: 0; z-index: 120; min-width: 600px; max-width: 750px; padding: 0.8rem 0.9rem; border: 1px solid rgba(148, 163, 184, 0.18); border-radius: var(--radius-md); background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%); box-shadow: var(--shadow); text-align: left; font-weight: normal;">
        <div class="popover-head" style="border-bottom: 1px solid rgba(148, 163, 184, 0.12); padding-bottom: 0.4rem; margin-bottom: 0.4rem; display: flex; flex-direction: column; gap: 0.4rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            ${I}
          </div>
          <div style="display: flex; gap: 0.8rem; font-size: 0.75rem; align-items: center; background: rgba(0,0,0,0.18); padding: 0.25rem 0.4rem; border-radius: var(--radius-sm);">
            <span style="color: var(--text-400); font-weight: 500;">Programm-Typ:</span>
            <label style="display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; user-select: none; margin: 0;">
              <input type="radio" name="popover-filter-cobble-radio-${m.id}" class="popover-filter-cobble-radio" value="all" ${Ia==="all"?"checked":""}> Alle
            </label>
            <label style="display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; user-select: none; margin: 0;">
              <input type="radio" name="popover-filter-cobble-radio-${m.id}" class="popover-filter-cobble-radio" value="cobble" ${Ia==="cobble"?"checked":""}> Cobble
            </label>
            <label style="display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; user-select: none; margin: 0;">
              <input type="radio" name="popover-filter-cobble-radio-${m.id}" class="popover-filter-cobble-radio" value="non-cobble" ${Ia==="non-cobble"?"checked":""}> Non-Cobble
            </label>
          </div>
        </div>
        <div class="popover-program-list-scroll" data-race-id="${m.id}" style="display: flex; flex-direction: column; gap: 0.2rem; max-height: 350px; overflow-y: auto;">
          ${b}
        </div>
      </div>
    `;let U="text-align: center; font-variant-numeric: tabular-nums;";m.is_stage_race===1&&N>=2&&($<=7?U+=" background-color: rgba(239, 68, 68, 0.2); color: #ef4444; font-weight: bold;":$>7&&$<10&&(U+=" background-color: rgba(234, 179, 8, 0.2); color: #eab308; font-weight: bold;"));let K="position: relative; text-align: center; font-variant-numeric: tabular-nums; vertical-align: middle;",q="font-weight: bold; border: none; background: transparent; padding: 0.15rem 0.4rem; cursor: pointer; color: var(--accent-h); text-decoration: underline;";m.is_stage_race===0&&H&&z<20&&(K+=" background-color: rgba(239, 68, 68, 0.2);",q+=" color: #ef4444; font-weight: bold;");const Q=`
      <button type="button" class="race-rider-count-trigger btn-link" data-race-id="${m.id}" 
              style="${q}">
        ${k}
      </button>
    `;let se="—";if(m.is_stage_race===0){const B=r.find(O=>O.race_id===m.id);se=(B==null?void 0:B.profile)??"Flat"}let V="",P=`<strong>${S(m.name)}</strong>`;if(m.is_stage_race===1){const B=Pt===m.id,{countHtml:O,stagesListHtml:W}=oh(m.id,r);V=`
        <div class="race-stages-popover-card ${B?"":"hidden"}">
          <div class="popover-head"><strong>${S(m.name)}</strong> - Etappen</div>
          <div class="popover-stages-list">${W}</div>
          <div class="popover-separator"></div>
          <div class="popover-head">Profile Zusammenfassung</div>
          <div class="popover-profiles-summary">${O}</div>
        </div>
      `,P=`
        <button type="button" class="race-popover-trigger btn-link" data-race-id="${m.id}" style="text-align: left; font-weight: bold; border: none; background: transparent; padding: 0; cursor: pointer; color: var(--accent-h);">
          ${S(m.name)}
        </button>
      `}let A=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"];if(m.is_stage_race===0){const B=r.find(W=>W.race_id===m.id),O=((B==null?void 0:B.profile)??"").toLowerCase();O.includes("cobble")?A=["Cobble","Sprint","Hill","Attacker","Timetrial","Berg"]:(O.includes("flat")||O.includes("rolling"))&&(A=["Sprint","Timetrial","Attacker","Hill","Cobble","Berg"])}const L=[],J=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],j={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},w={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},C=(e.roleSpecCombinations||[]).filter(B=>p.has(B.program_id)),X=new Map;for(const B of C){const O=B.spec2||"—",W=`${B.role}|${B.spec1}|${O}`;X.set(W,(X.get(W)||0)+B.count)}const ne=[...X.entries()].map(([B,O])=>{const[W,Y,ue]=B.split("|");return{role:W,spec1:Y,spec2:ue,count:O}}).sort((B,O)=>{const W=J.indexOf(B.role)-J.indexOf(O.role);if(W!==0)return W;const Y=A.indexOf(B.spec1)-A.indexOf(O.spec1);return Y!==0?Y:O.count-B.count}),ee=(B,O)=>{const W=w[B]??B,Y=O!=="—"?w[O]??O:"—";return`${W} / ${Y}`};for(const B of ne)if(B.count>0){const O=B.spec1==="Berg"&&B.spec2==="Cobble"||B.spec1==="Cobble"&&B.spec2==="Berg",W=O?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",Y=O?"color: #f97316; font-weight: bold;":"color: var(--text-100);",ue=O?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",$e=`${B.role}_${B.spec1}_${B.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`,_e=C.filter(ve=>ve.role===B.role&&ve.spec1===B.spec1&&(ve.spec2||"—")===B.spec2).map(ve=>{const Ve=e.programs.find(we=>we.id===ve.program_id);return`<span style="white-space: nowrap; margin-right: 0.8rem;">${S((Ve==null?void 0:Ve.name)??"Unbekannt")}: <strong>${ve.count}</strong></span>`}).join(" ");L.push(`
          <div style="${W}">
            <span style="${Y}">${j[B.role]||B.role} <span class="text-muted">(${ee(B.spec1,B.spec2)})</span></span>
            <strong style="${ue} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="${m.id}" data-combo-key="${$e}">
              ${B.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-${m.id}-${$e}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: ${_e}
          </div>
        `)}const Pe=L.length>0?L.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost race-row-expand-btn" data-race-id="${m.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td>${de(m.start_date)}</td>
        <td class="race-programs-popup-anchor" style="position: relative; vertical-align: middle;">
          ${P}
          ${V}
        </td>
        <td style="font-weight: bold; color: var(--accent-h); text-align: center;">${se}</td>
        <td class="race-programs-popup-anchor" style="${K}">
          ${Q}
          ${G}
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${T}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${x}</td>
        <td style="${U}">${$}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${D}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${E}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${M}</td>
      </tr>
      <tr id="race-details-row-${m.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
        <td colspan="11" style="padding: 0.5rem 1.5rem;">
          <div style="max-width: 450px; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
            <div style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; font-weight: bold; background: rgba(99,102,241,0.08); color: var(--text-100);">Zusammensetzung (Rolle / Spezialisierung)</div>
            ${Pe}
          </div>
        </td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function ld(e){return st!==e?'<span style="opacity:0.35; margin-left:4px;">↕</span>':`<span style="color:var(--accent-h); margin-left:4px; font-weight:bold;">${Da?"↑":"↓"}</span>`}function kt(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${st===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
        <span>${S(t)}</span>
        ${ld(e)}
      </div>
    </th>
  `}function dh(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${st===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: flex-start; gap: 2px;">
        <span>${S(t)}</span>
        ${ld(e)}
      </div>
    </th>
  `}function ch(e){const t=e.programs,a=e.roleSpecCombinations||[],r=e.programToRacesMap,s={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},n={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},i=new Map;a.forEach(l=>{i.has(l.program_id)||i.set(l.program_id,[]),i.get(l.program_id).push(l)});const o=t.map(l=>{const m=i.get(l.id)||[];let p=0;const u={Kapitaen:0,Co_Kapitaen:0,Sprinter:0,Edelhelfer:0,Starke_Helfer:0,Wassertraeger:0};for(const h of m)p+=h.count,u[h.role]!==void 0&&(u[h.role]+=h.count);const f=us(l,e),g=f.peak+f.prep+f.none;return{program:l,totalRiders:p,roleCounts:u,progCombos:m,raceDays:g}});o.sort((l,m)=>{let p=0;return st==="id"?p=l.program.id-m.program.id:st==="name"?p=l.program.name.localeCompare(m.program.name):st==="total"?p=l.totalRiders-m.totalRiders:st==="raceDays"?p=l.raceDays-m.raceDays:p=(l.roleCounts[st]||0)-(m.roleCounts[st]||0),p===0&&(p=l.program.id-m.program.id),Da?p:-p});const c=o.map(l=>{const m=l.program,p=l.progCombos,u=l.totalRiders,f=l.roleCounts,g=l.raceDays,h=r?r.get(m.id)||new Set:new Set(e.raceProgramRaces.filter(M=>M.program_id===m.id).map(M=>M.race_id)),b=od(m,h,e),y=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],k=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"],T=new Map;for(const M of p){const R=M.spec2||"—",_=`${M.role}|${M.spec1}|${R}`;T.set(_,(T.get(_)||0)+M.count)}const x=[...T.entries()].map(([M,R])=>{const[_,F,N]=M.split("|");return{role:_,spec1:F,spec2:N,count:R}}).sort((M,R)=>{const _=y.indexOf(M.role)-y.indexOf(R.role);if(_!==0)return _;const F=k.indexOf(M.spec1)-k.indexOf(R.spec1);return F!==0?F:R.count-M.count}),$=(M,R)=>{const _=n[M]??M,F=R!=="—"?n[R]??R:"—";return`${_} / ${F}`},D=[];for(const M of x)if(M.count>0){const R=M.spec1==="Berg"&&M.spec2==="Cobble"||M.spec1==="Cobble"&&M.spec2==="Berg",_=R?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",F=R?"color: #f97316; font-weight: bold;":"color: var(--text-100);",N=R?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",H=`${M.role}_${M.spec1}_${M.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`;D.push(`
          <div style="${_}">
            <span style="${F}">${s[M.role]||M.role} <span class="text-muted">(${$(M.spec1,M.spec2)})</span></span>
            <strong style="${N} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="prog-${m.id}" data-combo-key="${H}">
              ${M.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-prog-${m.id}-${H}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: <span style="white-space: nowrap; margin-right: 0.8rem;">${S(m.name)}: <strong>${M.count}</strong></span>
          </div>
        `)}const E=D.length>0?D.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost program-row-expand-btn" data-program-id="${m.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td style="font-weight: bold; color: var(--text-100);">${m.id}</td>
        <td style="font-weight: bold; min-width: 150px;">${S(m.name)}</td>
        <td style="text-align: center; font-weight: bold; color: var(--accent-h); font-variant-numeric: tabular-nums;">${u}</td>
        <td style="text-align: center; font-weight: bold; color: var(--text-100); font-variant-numeric: tabular-nums;" title="Abschnitts-Renntage:
Start bis Peak 1: ${b.phase1} Tage
Peak 1 bis Peak 2: ${b.phase2} Tage
Peak 2 bis Peak 3: ${b.phase3} Tage
Jenseits Peak 3: ${b.phase4} Tage">
          ${g} <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal; display: block; margin-top: 0.15rem;">${b.phase1} / ${b.phase2} / ${b.phase3} / ${b.phase4}</span>
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${f.Kapitaen||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${f.Co_Kapitaen||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${f.Sprinter||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${f.Edelhelfer||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${f.Starke_Helfer||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${f.Wassertraeger||"—"}</td>
      </tr>
      <tr id="program-details-row-${m.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
        <td colspan="11" style="padding: 0.5rem 1.5rem;">
          <div style="max-width: 450px; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
            <div style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; font-weight: bold; background: rgba(99,102,241,0.08); color: var(--text-100);">Zusammensetzung (Rolle / Spezialisierung)</div>
            ${E}
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
              ${kt("id","ID","width: 50px;")}
              ${dh("name","Programm")}
              ${kt("total","Fahrer gesamt","width: 110px; text-align: center; font-weight: bold;")}
              ${kt("raceDays","Renntage","width: 100px; text-align: center; font-weight: bold;")}
              ${kt("Kapitaen","Kapitän","width: 90px; text-align: center;")}
              ${kt("Co_Kapitaen","Co-Kapitän","width: 90px; text-align: center;")}
              ${kt("Sprinter","Sprinter","width: 90px; text-align: center;")}
              ${kt("Edelhelfer","Edelhelfer","width: 90px; text-align: center;")}
              ${kt("Starke_Helfer","Starke Helfer","width: 100px; text-align: center;")}
              ${kt("Wassertraeger","Wasserträger","width: 100px; text-align: center;")}
            </tr>
          </thead>
          <tbody>
            ${c.join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.openTeamStats=Dn;async function dd(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}Xr("game"),v("meta-career").textContent=((e=d.currentSave)==null?void 0:e.careerName)??"",d.seasonStandingsSelectedSeason=null,d.riderStatsSelectedSeason=null,zt("dashboard"),Fe("Spiel wird geladen…");try{await Cn();const[t,a]=await Promise.all([Z.getTeams(),Z.getRiders(void 0,!1)]);t.success&&(d.teams=t.data??[]),a.success&&(d.riders=a.data??[]),await Fn(),ls()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{ke()}}function uh(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";zt(t),t==="dashboard"&&ls(),t==="teams"&&Vr(),t==="riders"&&Vr(),t==="rider-team-editor"&&ql(),t==="live-race"&&ma(),t==="results"&&Ae(),t==="draft"&&cs(d.draftSelectedSeason||((a=d.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&kf(),t==="season-standings"&&rd(!0),t==="leaderboards"&&zf(),t==="calendar"&&Jf(),t==="race-programs"&&Hn(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&yl(),t==="stage-editor"&&fn()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&va(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&Dn(a)}),v("btn-cancel-new").addEventListener("click",()=>tt("newCareer")),v("btn-close-race-stages").addEventListener("click",()=>tt("raceStages")),v("btn-close-stage-profile").addEventListener("click",()=>tt("stageProfile")),v("btn-close-rider-program").addEventListener("click",()=>tt("riderProgram")),v("btn-close-rider-stats").addEventListener("click",()=>tt("riderStats")),v("btn-close-team-stats").addEventListener("click",()=>tt("teamStats")),v("btn-close-race-participants").addEventListener("click",()=>tt("raceParticipants")),v("btn-close-roster-editor").addEventListener("click",()=>Hs()),v("btn-cancel-roster-editor").addEventListener("click",()=>Hs()),v("btn-apply-roster-editor").addEventListener("click",()=>{Lg()}),v("btn-back-menu").addEventListener("click",()=>{ia==null||ia.pause(),Xr("menu"),Va()}),Sd(),Zg(),Zf(),Ll(),Zl(),gf(),Dg(),Ig(),Jp(),mg(),Bf(),Mf(),Hf(),ah(),Ql()}(async()=>(vp(),be(),uh(),Xr("menu"),await Va()))();
