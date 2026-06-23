(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();function Hi(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function us(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function dt(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function Ea(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function Ee(e,t={}){const a=t.strong===!1?"span":"strong",r=us("app-rider-link-label",t.labelClassName),s=`<${a} class="${r}">${Hi(e)}</${a}>`;if(t.riderId==null)return s;const n=['type="button"','class="'+us("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${s}</button>`}function qe(e,t,a=!0,r=""){const s=a===!1?"span":"strong",n=`<${s} class="app-team-link-label">${Hi(e)}</${s}>`;return t==null?n:`<button type="button" class="${us("app-team-link",r)}" data-team-id="${t}">${n}</button>`}function zi(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function Gi(e){return Math.round(e*10)/10}function Ki(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function ji(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function Oi(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function Vl(e,t){return e.skills.stamina*(t/300)}function Wi(e,t,a){return e.skills.timeTrial+Oi(e,t)+e.skills.mountain*(a/500)}function Ul(e,t,a,r){const s=Vl(e,a),n=Oi(e,r);switch(t.profile){case"Flat":return .8*e.skills.sprint+.15*e.skills.acceleration+.05*e.skills.flat+n+s;case"Rolling":return .7*e.skills.sprint+.2*e.skills.acceleration+.1*e.skills.hill+n+s;case"Hilly":return .45*e.skills.sprint+.1*e.skills.flat+.45*e.skills.hill+n+s;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+s;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+s;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+s;case"High_Mountain":return e.skills.mountain+n+s;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+s;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+s;default:return .8*e.skills.sprint+.2*e.skills.flat+n+s}}function Yl(e,t,a,r,s){return t.profile==="ITT"||t.profile==="TTT"?Wi(e,s,r):Ul(e,t,a,s)}function Zl(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:Gi(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function Vi(e,t,a,r){Ki(a,r);const s=ji(a,r),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const p=o.get(l.activeTeamId)??[];p.push(l),o.set(l.activeTeamId,p)}return[...o.entries()].map(([l,p])=>{const m=n.get(l),f=p.map(y=>Wi(y,zi(y.id,r==null?void 0:r.dailyFormByRiderId),s)).sort((y,k)=>k-y).slice(0,5),g=f.length,b=g>0?f.reduce((y,k)=>y+k,0)/g:0,h=Math.max(0,5-g)*2;return{team:m??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:b-h}}).sort((l,p)=>p.score-l.score||l.team.id-p.team.id).slice(0,20).map((l,p)=>({rank:p+1,kind:"team",effectiveSkill:Gi(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(r!=null?pr(e,t,a,r):pr(e,t,a)).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id).slice(0,20).map((o,c)=>Zl(o,c+1))}function pr(e,t,a,r){const s=Ki(a,r),n=ji(a,r),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var c;return{rider:o,teamName:o.activeTeamId!=null?((c=i.get(o.activeTeamId))==null?void 0:c.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:Yl(o,a,s,n,zi(o.id,r==null?void 0:r.dailyFormByRiderId))}}).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id)}const d={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,seasonStandingsSelectedSeason:null,draftHistory:null,injuries:null,draftSelectedSeason:null,draftOverlayActive:!1,draftOverlayAuto:!0,draftOverlayPicks:null,draftOverlayCurrentIndex:0,draftSpeedMultiplier:1,draftPaused:!1,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorHideBoringSegments:!0,stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsSelectedSeason:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsFilterRank:null,riderStatsTopResultsFilterProfile:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,breakaway:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedRosterYear:null,teamStatsRosterSort:{key:"overallRating",direction:"desc"},teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsFilterRank:null,teamStatsTopResultsFilterProfile:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,breakaway:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1,autoProgressTargetDate:null,raceProgramsPayload:null,raceProgramsActiveTab:"calendar-cols",raceProgramsDirty:!1,raceProgramsSaving:!1};let qt=null;function Ui(e){qt=e}let Ar=!1;function ms(e){Ar=e}let Es=null;function ps(e){Es=e}let gr=null;function gs(e){gr=e}let ut=!1;function Ps(e){ut=e}function v(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ne(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function xa(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),r=Math.floor(e%60),s=String(a).padStart(2,"0"),n=String(r).padStart(2,"0");return t>0?`${t}:${s}:${n}`:`${a}:${n}`}function nr(e){return e==null||e===0?"–":`+${xa(e)}`}const ha=2,fr=3,Ns=4;function Ls(e){return`/jersey/Jer_${e}.png`}function bt(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((r=d.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${S(a)}" aria-label="${S(a)}">
      <img
        class="results-team-jersey-img"
        src="${S(Ls(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Ut(e,t){return`<span class="results-jersey-cell">${bt(e,t)}</span>`}function rt(e){return e&&le(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function Rt(e){var a;if(e==null)return null;const t=$e(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function $e(e){return e==null?null:d.riders.find(t=>t.id===e)??null}function Ft(e){return e==null?null:d.races.find(t=>t.id===e)??null}function Ta(e){var t;if(e==null)return null;for(const a of d.races){const r=(t=a.stages)==null?void 0:t.find(s=>s.id===e);if(r)return{race:a,stage:r}}return null}function Yt(e,t=!0,a=!1,r=null,s=null){const n=Ee(e,{riderId:r,teamId:s,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function Yi(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function hr(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function br(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function Zi(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}let za=new Map,xn=null;function Ds(e){if(d.riders!==xn){za.clear(),xn=d.riders;for(let t=0;t<d.riders.length;t++){const a=d.riders[t];if(a.activeTeamId!=null){let r=za.get(a.activeTeamId);r||(r=[],za.set(a.activeTeamId,r)),r.push(a)}}}return za.get(e)||[]}const Ae={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function le(e){const t=Ae[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function Ji(e,t){return e?`<span class="country-chip">${le(e.code3)}<span>${S(e.name)}</span></span>`:t?S(t):"–"}function yr(e){return`${e.toFixed(2).replace(".",",")} km`}function vr(e){return`${Math.round(e)} hm`}function Jl(e){return`${e>0?"+":""}${e.toFixed(1).replace(".",",")}%`}const qi=new Set;function ql(e){qi.add(e)}function _r(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),v(`screen-${e}`).classList.remove("hidden")}function nt(e){v(`modal-${e}`).classList.remove("hidden")}function Ze(e){v(`modal-${e}`).classList.add("hidden")}function Tn(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Xi(){var b,h;const e=d.realtimeBootstrap;if(!e)return;const t=v("instant-sim-favorites"),a=v("instant-sim-gc"),r=v("instant-sim-points");if(!t||!a||!r)return;const s=v("instant-sim-race"),n=v("instant-sim-stage-desc"),i=v("instant-sim-date");s&&(s.textContent=e.race.name),n&&(n.textContent=`Etappe ${e.stage.stageNumber} · ${e.stage.profile}`),i&&(i.textContent=ne(e.stage.date));const c=Vi(e.riders,e.teams,e.stage,{distanceKm:(b=e.stageSummary)==null?void 0:b.distanceKm,elevationGainMeters:(h=e.stageSummary)==null?void 0:h.elevationGainMeters}).slice(0,10),l=new Map(e.gcStandings.map(y=>[y.riderId,y]));let p=`
    <h3>
      <span>Etappen-Favoriten</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const y of c){const k=e.riders.find(R=>R.id===y.riderId);if(!k)continue;const w=Rt(k.id)??"un",M=Ae[w]??"un",x=e.teams.find(R=>R.id===k.activeTeamId),E=(x==null?void 0:x.abbreviation)??"—",I=l.get(k.id),F=I?`GC ${I.rank} (${I.rank===1?"Gelb":Tn(I.gapSeconds)})`:"GC –";p+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${k.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${y.rank}</span>
            <span class="fi fi-${M} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${S(k.firstName)} <strong>${S(k.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(E)}</span>
            <span class="instant-sim-gc-info">${F}</span>
          </div>
        </div>
      </div>
    `}p+="</div>",t.innerHTML=p;const m=e.gcStandings.slice(0,10);let u=`
    <h3>
      <span>Gesamtwertung (GC)</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const y of m){const k=e.riders.find(F=>F.id===y.riderId);if(!k)continue;const w=Rt(k.id)??"un",M=Ae[w]??"un",x=e.teams.find(F=>F.id===k.activeTeamId),E=(x==null?void 0:x.abbreviation)??"—",I=y.rank===1?"Gelb":Tn(y.gapSeconds);u+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${k.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${y.rank}</span>
            ${br(y.previousRank,y.rankDelta)}
            <span class="fi fi-${M} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${S(k.firstName)} <strong>${S(k.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(E)}</span>
            <span class="instant-sim-gc-info">${I}</span>
          </div>
        </div>
      </div>
    `}u+="</div>",a.innerHTML=u;const f=e.pointsStandings.slice(0,10);let g=`
    <h3>
      <span>Punktewertung</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const y of f){if(y.riderId==null)continue;const k=e.riders.find(F=>F.id===y.riderId);if(!k)continue;const w=Rt(k.id)??"un",M=Ae[w]??"un",x=e.teams.find(F=>F.id===k.activeTeamId),E=(x==null?void 0:x.abbreviation)??"—",I=`${y.points??0} Punkte`;g+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${k.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${y.rank}</span>
            ${br(y.previousRank,y.rankDelta)}
            <span class="fi fi-${M} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${S(k.firstName)} <strong>${S(k.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(E)}</span>
            <span class="instant-sim-gc-info">${I}</span>
          </div>
        </div>
      </div>
    `}g+="</div>",r.innerHTML=g}function Te(e="Lade…"){var r;const t=ut?" (Leertaste zum Stoppen)":"",a=v("default-loader");a&&(v("loading-msg").textContent=e+t,v("loading-progress").classList.add("hidden"),a.classList.remove("hidden"),(r=v("instant-sim-panel"))==null||r.classList.add("hidden")),v("loading-overlay").classList.remove("hidden")}function Se(){v("loading-overlay").classList.add("hidden")}function Qi(e){var t,a;if((t=v("default-loader"))==null||t.classList.add("hidden"),(a=v("instant-sim-panel"))==null||a.classList.remove("hidden"),v("loading-overlay").classList.remove("hidden"),d.realtimeBootstrap)Xi();else{const r=v("instant-sim-favorites"),s=v("instant-sim-gc");r&&(r.innerHTML=""),s&&(s.innerHTML="")}As(e)}function As(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),r=`Instant-Simulation läuft … ${t}%${ut?" (Leertaste zum Stoppen)":""}`,s=v("loading-msg");s&&(s.textContent=r);const n=v("loading-progress-bar");n&&(n.style.width=`${t}%`);const i=v("instant-loading-msg");i&&(i.textContent=r);const o=v("instant-loading-progress-bar");o&&(o.style.width=`${t}%`);const c=v("instant-sim-favorites");c&&c.innerHTML.trim()===""&&d.realtimeBootstrap&&Xi()}function It(e,t){const a=v(e);a.textContent=t,a.classList.remove("hidden")}function ia(e){v(e).classList.add("hidden")}function Et(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),v(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),v("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of qi)try{a(e)}catch(r){console.error(`Fehler bei View-Aktivierung von "${e}":`,r)}}function ke(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function Xt(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function _s(e,t,a){return Math.max(t,Math.min(a,e))}function ir(e,t,a){return Math.round(e+(t-e)*a)}function fs(e,t,a){return`rgb(${ir(e[0],t[0],a)} ${ir(e[1],t[1],a)} ${ir(e[2],t[2],a)})`}function Br(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=_s(e,t[0].value,t[t.length-1].value);for(let r=1;r<t.length;r+=1){const s=t[r-1],n=t[r];if(a<=n.value){const i=(a-s.value)/(n.value-s.value);return fs(s.color,n.color,i)}}return fs(t[t.length-1].color,t[t.length-1].color,1)}function Bs(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${Br(e)}"${a}>${e.toFixed(2)}</span>`}function eo(e,t,a){if(t==null)return Bs(e,a);const r=Math.round((e-t)*100)/100,s=r>0?"skill-delta-positive":r<0?"skill-delta-negative":"skill-delta-neutral",n=r>0?"+":"",i=`<span class="skill-delta ${s}">${n}${r.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${Br(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function to(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function hs(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",r=t>0?"+":"";return`<span class="${a}">${r}${t.toFixed(1).replace(".",",")}</span>`}function bs(e,t="none",a){const r=e??0,s=["race-sim-form-negative"];t==="warning"&&s.push("load-warning"),t==="critical"&&s.push("load-warning-critical");const n=a?` title="${S(a)}"`:"";return r===0?`<span class="${s.join(" ")}"${n}>0,0</span>`:`<span class="${s.join(" ")}"${n}>-${r.toFixed(1).replace(".",",")}</span>`}function Hs(e){const t=e.seasonFormPhase??"neutral";return zs(t)}function zs(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${S(a.label)}">${a.symbol}</span>`}function ao(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${S(e.seasonProgram.name)}</button>`:"–"}function Ct(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function _e(e){return`${e.lastName} ${e.firstName}`}function ro(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,r=e.unavailableUntil?` bis ${ne(e.unavailableUntil)}`:"",s=`${t}: noch ${a} Tag${a===1?"":"e"}${r}`;return`<span class="rider-availability-marker" title="${S(s)}" aria-label="${S(s)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function yt(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function Sr(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=e,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(r)}const Xl=Object.freeze(Object.defineProperty({__proto__:null,$:v,FLAG_CODE_BY_CODE3:Ae,GC_RESULT_TYPE_ID:ha,MOUNTAIN_RESULT_TYPE_ID:Ns,POINTS_RESULT_TYPE_ID:fr,activateView:Et,addActiveViewListener:ql,get autoProgressActive(){return ut},buildRaceCategoryBadgeCssVariables:Ea,clamp:_s,downloadTextFile:Sr,esc:S,findRaceById:Ft,findRiderById:$e,findStageById:Ta,formatDate:ne,formatElevationGain:vr,formatGradient:Jl,formatKm:yr,formatMarkerLabel:Zi,formatNonFinisherReason:hr,formatRaceGap:nr,formatRaceTime:xa,formatRiderName:_e,getRiderCountryCode:Ct,getRiderRoleName:yt,getRiderSpecializationLabel:Xt,getRidersByTeam:Ds,getSkillColor:Br,hideError:ia,hideLoading:Se,hideModal:Ze,get instantStageInFlightId(){return Es},interpolateChannel:ir,interpolateColor:fs,isActiveView:ke,get raceSimView(){return qt},get realtimeCompletionInFlight(){return Ar},get realtimeStageLoadInFlightId(){return gr},renderCountry:Ji,renderFlag:le,renderLoadMalusValue:bs,renderMiniJersey:bt,renderNonFinisherStatusBadge:Yi,renderRaceFormBonusValue:to,renderRankDelta:br,renderResultsFlagColumn:rt,renderResultsJerseyColumn:Ut,renderResultsParticipant:Yt,renderRiderAvailabilityMarker:ro,renderRiderNameLink:Ee,renderRiderProgramButton:ao,renderSeasonFormPhase:Hs,renderSeasonFormPhaseIndicator:zs,renderSeasonFormValue:hs,renderSkillValue:Bs,renderSkillValueWithDelta:eo,renderTeamNameLink:qe,resolveRaceCategoryBadgeStyle:dt,resolveRiderCountryCode:Rt,resolveTeamJerseyAssetPath:Ls,setAutoProgressActive:Ps,setInstantStageInFlightId:ps,setRaceSimView:Ui,setRealtimeCompletionInFlight:ms,setRealtimeStageLoadInFlightId:gs,showError:It,showInstantProgress:Qi,showLoading:Te,showModal:nt,showScreen:_r,state:d,updateInstantProgress:As},Symbol.toStringTag,{value:"Module"}));async function q(e,t,a){try{const r=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(r.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await r.text();return{success:!1,error:r.ok?"Antwort war kein JSON.":`HTTP ${r.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return r.json()}catch(r){return{success:!1,error:`Netzwerkfehler: ${r.message}`}}}const Y={listSaves:()=>q("GET","/api/saves"),createSave:(e,t,a)=>q("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>q("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>q("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>q("GET","/api/teams/available"),getTeams:()=>q("GET","/api/teams"),getTeam:e=>q("GET",`/api/teams/${e}`),getTeamStats:e=>q("GET",`/api/teams/${e}/stats`),getRiders:(e,t=!1,a=!0,r)=>{const s=new URLSearchParams;e!=null&&s.set("teamId",String(e)),t&&s.set("onlyWithTeam","true"),r!=null&&s.set("season",String(r)),a&&s.set("summary","true");const n=s.toString();return q("GET",`/api/riders${n?`?${n}`:""}`)},getRiderStats:(e,t=!1)=>q("GET",`/api/riders/${e}/stats${t?"?excludeFatigue=true":""}`),getRiderProgramRaces:e=>q("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>q("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>q("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>q("POST","/api/rider-team-editor/export",e),getRaces:()=>q("GET","/api/races"),getRaceProgramParticipants:e=>q("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>q("GET",`/api/races/${e}/results-roster`),getGameState:()=>q("GET","/api/state"),getGameStatus:()=>q("GET","/api/game/status"),getStageSummary:e=>q("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>q("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>q("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>q("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>q("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>q("POST","/api/state/advance"),getStageResults:e=>q("GET",`/api/results/${e}`),getSeasonStandings:e=>q("GET",`/api/season-standings${e?`?season=${e}`:""}`),listStageEditorStages:()=>q("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>q("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>q("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>q("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>q("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>q("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>q("POST","/api/stage-editor/import",e),exportStageRoute:e=>q("POST","/api/stage-editor/export",e),getInjuries:()=>q("GET","/api/injuries"),getDraftHistory:e=>q("GET",`/api/draft/${e}`),getDraftDetails:e=>q("GET",`/api/draft/${e}/details`),getLeaderboards:(e,t,a)=>q("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`),getRaceProgramsEditor:()=>q("GET","/api/race-programs-editor"),saveRaceProgramsEditor:e=>q("POST","/api/race-programs-editor/save",e)};async function Pa(){const e=await Y.listSaves(),t=v("saves-list"),a=v("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(r=>`
    <div class="save-card">
      <h3>${S(r.careerName)}</h3>
      <p class="save-meta">
        ${S(r.teamName)} · Saison ${r.currentSeason}
        ${r.lastSaved?"· "+ne(r.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${S(r.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${S(r.filename)}" data-career-name="${S(r.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function Ql(e){Te("Karriere wird geladen…");const t=await Y.loadSave(e);if(Se(),!t.success){alert("Fehler beim Laden: "+t.error);return}d.currentSave=t.data??null,await Wl()}async function ed(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;Te("Löschen…");const a=await Y.deleteSave(e);if(Se(),!a.success){alert("Fehler: "+a.error);return}await Pa()}async function td(){const e=await Y.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){v("btn-delete-all-careers").classList.add("hidden"),v("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){Te("Alle Karrieren werden gelöscht…");try{for(const a of t){const r=await Y.deleteSave(a.filename);if(!r.success){alert(`Fehler beim Löschen von "${a.careerName}": ${r.error??"Unbekannter Fehler"}`);break}}}finally{Se()}await Pa()}}function ad(){v("btn-new-career").addEventListener("click",async()=>{var s;ia("new-career-error"),v("input-career-name").value="";const a=v("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',nt("newCareer");const r=await Y.getAvailableTeams();if(!r.success||!((s=r.data)!=null&&s.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=r.data.map(n=>`<option value="${n.id}">${S(n.name)} (${S(n.division??n.divisionName??"")})</option>`).join("")}),v("btn-cancel-new").addEventListener("click",()=>Ze("newCareer")),v("btn-confirm-new").addEventListener("click",async()=>{const a=v("input-career-name").value.trim(),r=v("input-team-id").value;if(!a||!r){It("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const s=Number(r),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;ia("new-career-error"),Te("Neue Karriere wird erstellt…");const o=await Y.createSave(i,a,s);if(!o.success){Se(),It("new-career-error",o.error??"Unbekannter Fehler.");return}const c=await Y.loadSave(i);if(Se(),Ze("newCareer"),!c.success){alert("Fehler: "+c.error);return}d.currentSave=c.data??null,await Wl()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>Pa());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{td()}),v("saves-list").addEventListener("click",async a=>{const r=a.target.closest("button[data-save-action]");if(!r)return;const{saveAction:s,filename:n,careerName:i}=r.dataset;if(n){if(s==="load"){await Ql(n);return}s==="delete"&&await ed(n,i??n)}})}const rd="modulepreload",sd=function(e){return"/"+e},wn={},or=function(t,a,r){let s=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));s=Promise.allSettled(a.map(c=>{if(c=sd(c),c in wn)return;wn[c]=!0;const l=c.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":rd,l||(m.as="script"),m.crossOrigin="",m.href=c,o&&m.setAttribute("nonce",o),document.head.appendChild(m),l)return new Promise((u,f)=>{m.addEventListener("load",u),m.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return s.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},nd={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function id(e){const t=nd[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const od=200;function Gs(e){if(e.length===0)return[];const t=[];for(const a of e){const r=t[t.length-1];if(!r||Math.abs(r.distanceMeter-a.distanceMeter)>=od){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}r.riderIds.push(...a.riderIds),r.riderCount+=a.riderCount,r.distanceSum+=a.distanceMeter*a.riderCount,r.distanceMeter=r.distanceSum/r.riderCount}return t.map(({distanceSum:a,...r})=>r)}function Ks(e){if(e.length===0)return[];let t=0;for(let s=1;s<e.length;s+=1)e[s].riderCount>e[t].riderCount&&(t=s);let a=0,r=0;return e.map((s,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(r+=1,o=`A${r}`),{...s,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-s.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,s.distanceMeter-e[n+1].distanceMeter):null}})}function ld(e,t=null){var a,r,s;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((r=e.find(n=>n.label==="P"))==null?void 0:r.label)??((s=e[0])==null?void 0:s.label)??null}function Pt(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function Mn(e,t,a,r){return`${r.type}:${e}:${t}:${a}`}function dd(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:Pt(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function ct(e){const t=[];e.segments.forEach((s,n)=>{const i=n*2;(s.start_markers??[]).forEach((o,c)=>{t.push({key:Mn(n,"start",c,o),label:"",marker:o,kmMark:s.start_km,elevation:s.start_elevation,boundary:"start",sequence:i+c/100})}),(s.end_markers??[]).forEach((o,c)=>{t.push({key:Mn(n,"end",c,o),label:"",marker:o,kmMark:s.end_km,elevation:s.end_elevation,boundary:"end",sequence:i+1+c/100})})});const a=t.sort((s,n)=>s.kmMark-n.kmMark||s.sequence-n.sequence),r=new Map;return a.map(s=>{const n=(r.get(s.marker.type)??0)+1;return r.set(s.marker.type,n),{...s,label:s.marker.name??dd(s.marker,n)}})}function cd(e){const t=ct(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>Pt(a)).length}}function oa(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ud(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function et(e,t,a,r){return t<=0?r:r+e/t*(a-r*2)}function kr(e,t){const a=t/1e3,r=e.points;if(a<=r[0].kmMark)return r[0].elevation;for(let s=0;s<r.length-1;s+=1){const n=r[s],i=r[s+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),c=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*c}return r[r.length-1].elevation}function so(e){const t=e.points.map(p=>p.elevation),a=Math.min(...t),r=Math.max(...t),s=Math.max(1,r-a),n=Math.max(40,s*.08),i=Math.max(0,a-n),o=r+n;let c=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=c&&(l=c+100),{axisMinElevation:c,axisMaxElevation:l}}function it(e,t,a,r,s,n){const i=Math.max(1,a-t);return r-n-(e-t)/i*(r-s-n)}function ba(e){return`${Math.round(e)} m`}function Rn(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function In(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function no(e,t,a,r,s,n,i,o,c){var g;const l=[],p=[];let m=null,u="#b91c1c";for(const b of ct(e)){const{marker:h,kmMark:y,elevation:k}=b;if(h.type==="climb_start"){p.push({kmMark:y,elevation:k,name:h.name});continue}if(Pt(h)){let w=-1;for(let I=p.length-1;I>=0;I-=1)if(h.name&&((g=p[I])==null?void 0:g.name)===h.name){w=I;break}const M=w>=0?p.splice(w,1)[0]:p.pop();M&&Math.max(0,y-M.kmMark),M&&Math.max(0,k-M.elevation);const x=In(h.cat,h.type),E=Rn(h.cat);if(h.type==="finish_hill"||h.type==="finish_mountain"){m=h.cat??null,u=x.accentColor;continue}l.push({x:et(y*1e3,t,a,r),anchorY:it(k,o,c,s,n,i),primaryLabel:E??"Berg",secondaryLabel:ba(k),distanceLabel:`${y.toFixed(1).replace(".",",")} km`,accentColor:x.accentColor});continue}if(h.type==="sprint_intermediate"){const w=In(h.cat,h.type);l.push({x:et(y*1e3,t,a,r),anchorY:it(k,o,c,s,n,i),primaryLabel:"Sprint",secondaryLabel:ba(k),distanceLabel:`${y.toFixed(1).replace(".",",")} km`,accentColor:w.accentColor})}}const f=e.points[e.points.length-1];return l.push({x:et(f.kmMark*1e3,t,a,r),anchorY:it(f.elevation,o,c,s,n,i),primaryLabel:m?`${Rn(m)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:ba(f.elevation),distanceLabel:`${f.kmMark.toFixed(1).replace(".",",")} km`,accentColor:u}),l.sort((b,h)=>b.x-h.x)}function io(e,t,a){const r=t+4,s=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${oa(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-detail">${oa(e.distanceLabel)}</text>
    </g>`}function oo(e,t){const a=new Set,r=t/1e3;for(let s=0;s<=r;s+=25)a.add(Math.round(s*1e3));return a.add(Math.round(t)),[...a].filter(s=>s>=0&&s<=t).sort((s,n)=>s-n)}function lo(e,t,a,r,s,n){const i=new Set(ct(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const c=et(o,a,r,s),p=i.has(o)?18:12,m=n+p+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${c.toFixed(1)}" y1="${n.toFixed(1)}" x2="${c.toFixed(1)}" y2="${(n+p).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${c.toFixed(1)}" y="${m.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${oa(ud(o))}</text>
      </g>`}).join("")}function md(e,t,a,r,s,n,i,o,c,l,p){const m=et(e.distanceMeter,a,r,n),u=kr(t,e.distanceMeter),f=it(u,c,l,s,i,o),g=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),b=e.riderCount>1?`<text x="${m.toFixed(1)}" y="${(f+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${m.toFixed(1)}" cy="${f.toFixed(1)}" r="${g.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${p?" race-sim-cluster-dot-selected":""}"></circle>
      ${b}
    </g>`}function pd(e,t,a,r,s,n,i,o,c,l,p){const m=new Map(p.riders.map(f=>[f.id,f])),u=new Map((p.teams??[]).map(f=>[f.id,f.abbreviation]));return e.filter(f=>f.riderCount===1).map(f=>{const g=f.riderIds[0];if(g==null)return"";const b=m.get(g);if(!b)return"";const h=et(f.distanceMeter,a,r,n),y=kr(t,f.distanceMeter),k=it(y,c,l,s,i,o),w=b.activeTeamId!=null?u.get(b.activeTeamId)??"":"",M=`${b.lastName} (${w})`,x=k-34,E=k-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${h.toFixed(1)}" y1="${(k-5).toFixed(1)}" x2="${h.toFixed(1)}" y2="${x.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${h.toFixed(1)}" y="${E.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${oa(M)}</text>
        </g>`}).join("")}function gd(e,t,a,r,s,n,i,o,c,l,p){const m=Math.max(0,Math.min(l,e.distanceKm)),u=Math.max(0,Math.min(p,e.distanceKm));if(u<=m)return null;const f=[{kmMark:m,elevation:kr(e,m*1e3)},...e.points.filter(k=>k.kmMark>m&&k.kmMark<u),{kmMark:u,elevation:kr(e,u*1e3)}];if(f.length<2)return null;const g=s-i,b=f.map((k,w)=>{const M=et(k.kmMark*1e3,t,a,r),x=it(k.elevation,o,c,s,n,i);return`${w===0?"M":"L"} ${M.toFixed(1)} ${x.toFixed(1)}`}).join(" "),h=et(m*1e3,t,a,r),y=et(u*1e3,t,a,r);return`${b} L ${y.toFixed(1)} ${g.toFixed(1)} L ${h.toFixed(1)} ${g.toFixed(1)} Z`}function fd(e,t,a,r,s={}){const p=e.distanceKm*1e3,{axisMinElevation:m,axisMaxElevation:u}=so(e),f=533,g=12,h=e.points.map(I=>{const F=et(I.kmMark*1e3,p,1584,28),R=it(I.elevation,m,u,634,168,101);return{x:F,y:R}}).map((I,F)=>`${F===0?"M":"L"} ${I.x.toFixed(1)} ${I.y.toFixed(1)}`).join(" "),y=`${h} L ${1556 .toFixed(1)} ${f.toFixed(1)} L ${28 .toFixed(1)} ${f.toFixed(1)} Z`,k=s.selectedClimbRange!=null?gd(e,p,1584,28,634,168,101,m,u,s.selectedClimbRange.startKm,s.selectedClimbRange.endKm):null,w=no(e,p,1584,28,634,168,101,m,u).map(I=>io(I,g,f)).join(""),x=Array.from({length:5},(I,F)=>m+(u-m)/4*F).map(I=>{const F=it(I,m,u,634,168,101);return`
      <line x1="28" y1="${F.toFixed(1)}" x2="1556" y2="${F.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${F.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${F.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(F+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${ba(I)}</text>`}).join(""),E=lo(oo(e,p),e,p,1584,28,f);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${oa(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      <path d="${y}" fill="url(#dashboard-large-area)"></path>
      ${k?`<path d="${k}" class="dashboard-stage-profile-climb-highlight"></path>`:""}
      <path d="${h}" class="race-sim-profile-line"></path>
      ${w}
      ${E}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function hd(e,t,a,r,s){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${fd(t,a,r,!1,s)}</div>`}function bd(e,t,a,r,s,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,c=634,l=28,p=168,m=101,{axisMinElevation:u,axisMaxElevation:f}=so(t),g=c-m,b=12,h=Array.from({length:5},(G,z)=>u+(f-u)/4*z),y=Gs(a.clusters),k=Ks(y),w=oo(t,a.stageDistanceMeters),x=t.points.map(G=>{const z=et(G.kmMark*1e3,a.stageDistanceMeters,o,l),C=it(G.elevation,u,f,c,p,m);return{x:z,y:C}}).map((G,z)=>`${z===0?"M":"L"} ${G.x.toFixed(1)} ${G.y.toFixed(1)}`).join(" "),E=`${x} L ${(o-l).toFixed(1)} ${g.toFixed(1)} L ${l.toFixed(1)} ${g.toFixed(1)} Z`,I=no(t,a.stageDistanceMeters,o,l,c,p,m,u,f).map(G=>io(G,b,g)).join(""),F=h.map(G=>{const z=it(G,u,f,c,p,m);return`
      <line x1="${l}" y1="${z.toFixed(1)}" x2="${o-l}" y2="${z.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${z.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${z.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(z+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${ba(G)}</text>`}).join(""),R=lo(w,t,a.stageDistanceMeters,o,l,g),N=new Map(y.map((G,z)=>[G,k[z]??null])),P=y.map(G=>{var z;return md(G,t,a.stageDistanceMeters,o,c,l,p,m,u,f,((z=N.get(G))==null?void 0:z.label)===i)}).join(""),B=s.stage.profile==="ITT"?pd(y,t,a.stageDistanceMeters,o,c,l,p,m,u,f,s):"";e.innerHTML=`
    <div class="race-sim-profile-layout${s.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${c}" role="img" aria-label="${oa(r)}">
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
          ${F}
          <line x1="${l}" y1="${g}" x2="${o-l}" y2="${g}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${p}" x2="${l}" y2="${g}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${E}" fill="url(#race-sim-area)"></path>
            <path d="${x}" class="race-sim-profile-line"></path>
            ${I}
            ${P}
          </g>
          ${B}
          ${R}
          <text x="${l.toFixed(1)}" y="${(p-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const yd={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},Cn={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function ys(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function Hr(e,t){return`${e}:${t}`}function vd(e){return new Map(e.map(t=>[Hr(t.simulationMode,t.terrain),t.weights]))}function Sd(e){return new Map(e.map(t=>[Hr(t.simulationMode,t.terrain),t]))}function kd(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function co(e,t,a){const r=a.get(Hr(e,t));if(!r)return[{key:ys(t),weight:1}];const s=Object.entries(r).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return s.length>0?s:[{key:ys(t),weight:1}]}function $d(e,t,a,r){const s=co(t,a,r),n=s.reduce((o,c)=>o+c.weight,0);return n<=0?e[ys(a)]:s.reduce((o,c)=>o+e[c.key]*c.weight,0)/n}function xd(e,t){const a=t.find(r=>r.simulationMode==="ttt"&&r.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??yd[e]??1.05}function Td(e,t,a){const r=a==null?void 0:a.get(Hr(e,t));return{lateMultiplier:(r==null?void 0:r.finalSpreadLateMultiplier)??Cn[t].lateMultiplier,peakMultiplier:(r==null?void 0:r.finalSpreadPeakMultiplier)??Cn[t].peakMultiplier}}const Fn={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}};function wd(e,t){const a=Fn[e]||Fn[1];return a.pref.includes(t)?"pref":a.malus.includes(t)?"malus":"neutral"}const Md=.005,Rd=.005,uo=70,mo=1e3,po=15,go=360,fo=8,ho=-.75,bo=10;function Bt(e,t){return e+Math.random()*(t-e)}function yo(e,t,a){return Math.max(t,Math.min(a,e))}function Id(e){return e==="ITT"||e==="TTT"}function vo(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(r=>{var s,n,i;return r.id!==e.id&&r.activeTeamId===e.activeTeamId&&(((s=r.role)==null?void 0:s.name)==="Edelhelfer"||((n=r.role)==null?void 0:n.name)==="Starke Helfer"||((i=r.role)==null?void 0:i.name)==="Wassertraeger")}).map(r=>r.id)}function So(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function Cd(e,t,a,r){const s=r==="crash"?So():null,n=Number(Bt(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=yo(n/Math.max(.1,a)*100,0,100),c=o<=uo;return{riderId:e.id,type:r,severity:s,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(r==="crash"?Bt(10,60):Bt(10,45)),recoverySeconds:c?mo:go,recoveryFormBonus:c?po:fo,dayFormPenalty:ho,staminaPenalty:bo,recoveryPenaltyStages:r==="crash"?s==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:r==="crash"&&s==="medium"?15:0,supportRiderIds:vo(e,t)}}function Fd(e,t,a){if(Id(t.profile)||a<=0)return[];const r=[];for(const s of e){const n=Math.random(),i=Math.random(),o=Md*Math.max(0,t.crashIncidentMultiplier??1),c=Rd*Math.max(0,t.mechanicalIncidentMultiplier??1);let l=o+(t.rolledEffektSturz??0)/100,p=c+(t.rolledEffektDefekt??0)/100;const m=t.rolledWeatherId||1,u=s.weatherProfileId||1;wd(u,m)==="pref"&&(l*=.5,p*=.5);const g=n<l,b=i<p;if(!g&&!b)continue;const h=g&&b?n<=i?"crash":"mechanical":g?"crash":"mechanical",y=Cd(s,e,a,h);if(h==="crash"&&Math.random()<.01){y.isMassCrashTrigger=!0;const k=Math.floor(Bt(2,26)),M=[...e.filter(x=>x.id!==s.id)].sort(()=>.5-Math.random());y.massCrashPotentialRiderIds=M.slice(0,k).map(x=>x.id),Math.random()<.2&&(y.hasAdditionalMechanical=!0,y.waitDurationSeconds+=Math.round(Bt(10,45)))}r.push(y)}return r}function Ed(e,t,a,r){const s=So(),n=Math.round(a*1e3),i=yo(a/Math.max(.1,r)*100,0,100),o=i<=uo;let c=Math.round(Bt(10,60)),l=!1;return Math.random()<.2&&(l=!0,c+=Math.round(Bt(10,45))),{riderId:e.id,type:"crash",severity:s,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:c,recoverySeconds:o?mo:go,recoveryFormBonus:o?po:fo,dayFormPenalty:ho,staminaPenalty:bo,recoveryPenaltyStages:s==="light"?[10,5,2]:[],raceRecuperationPenalty:s==="medium"?15:0,supportRiderIds:vo(e,t),hasAdditionalMechanical:l}}function Pd(e,t){return e+Math.random()*(t-e)}function En(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const r=Math.floor(Pd(0,a+1)),s=t[a];t[a]=t[r]??s,t[r]=s}return t}function Nd(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function Ld(e,t,a={}){if(e.length===0)return[];const r=e.map(f=>({...f,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),s=a.teams??Nd(r),n=pr(r,s,t,a),i=new Set(n.slice(0,20).map(f=>f.rider.id)),o=Math.min(Math.ceil(r.length*.02),Math.max(0,r.length-i.size)),c=Math.min(Math.ceil(r.length*.01),r.length),l=En(r.filter(f=>!i.has(f.id))),p=new Set(l.slice(0,o).map(f=>f.id)),m=En(r.filter(f=>!p.has(f.id))),u=new Set(m.slice(0,c).map(f=>f.id));return r.map(f=>p.has(f.id)?{...f,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:u.has(f.id)?{...f,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:f)}function Dt(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}function Pn(e,t){return e+Math.random()*(t-e)}function Dd(e,t,a){const r=[...e],s=[];for(;s.length<t&&r.length>0;){const n=r.reduce((l,p)=>l+Math.max(1e-4,a(p)),0);let i=Math.random()*n,o=0;for(let l=0;l<r.length;l+=1)if(i-=Math.max(1e-4,a(r[l])),i<=0){o=l;break}const[c]=r.splice(o,1);c&&s.push(c)}return s}function Ad(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function Nn(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function _d(e,t,a){return new Set(e.map(r=>r.riderId).filter(r=>r!=null&&!t.has(r)).slice(0,a))}function Bd(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function $t(e){var t;return Bd((t=e.role)==null?void 0:t.name)}function Hd(e){return ct(e).some(({marker:t})=>Pt(t))}function zd(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function Gd(e,t){const a=zd(e),r=e.hasSuperform===!0?40:1,s=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&$t(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*r*s*n*i;return{attackFactor:a,superformFactor:r,gcLeaderTeamFactor:s,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function Kd(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function jd(e,t){var r,s;const a=((r=t[0])==null?void 0:r.riderId)??null;return a==null?null:((s=e.find(n=>n.id===a))==null?void 0:s.activeTeamId)??null}function Od(e,t,a){const r=new Map(t.map(n=>[n.id,n])),s=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=r.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||s.has(i.activeTeamId))&&(s.add(i.activeTeamId),s.size>=a))break}return s}function Wd(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),$t(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function Vd(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const r=t.stageNumber<=10,s=Math.max(1,Math.floor(a*(r?.01:.05))),n=Math.max(s,Math.floor(a*(r?.08:.2)));return{min:s,max:n}}function Ud(e,t){const a=t.profile==="Flat"||t.profile==="Rolling";return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?a?{min:.45,max:.65}:{min:.45,max:.75}:a?{min:.5,max:.75}:{min:.5,max:.85}}function Yd(e,t,a,r,s,n,i,o){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||r.distanceKm<=0)return null;const c=e.length,{min:l,max:p}=Vd(t,a,c),m=Dt(l,p),u=t.isStageRace&&a.stageNumber<=10,f=!t.isStageRace,g=jd(e,n),b=u?Od(s,e,5):new Set,h=u?Wd(e):new Map,y=Hd(r),k=Ad(s,5),w=Nn(n,10),M=new Set([...k,...w]),x=y?_d(i,M,5):new Set,E=Kd(a),I=["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain"].includes(a.profile),F=t.isStageRace&&I&&a.stageNumber>=4;let R;const N=new Set;if(F){const A=Nn(n,10),Z=pr(e,o??[],a,{distanceKm:r.distanceKm,elevationGainMeters:r.elevationGainMeters});let j=[];for(const T of Z){if(j.length>=5)break;const $=T.rider;if($.activeTeamId==null||!A.has($.id))continue;const _=$t($);(_==="kapitaen"||_==="co-kapitaen")&&(j.includes($.activeTeamId)||j.push($.activeTeamId))}if(j.length===0)for(const T of Z){if(j.length>=5)break;const $=T.rider;if($.activeTeamId==null||!A.has($.id))continue;$t($)==="edelhelfer"&&(j.includes($.activeTeamId)||j.push($.activeTeamId))}if(j.length>0&&Math.random()<.5){const T=Dt(0,j.length-1);R=j[T]}}if(R!=null){const A=e.filter(j=>j.activeTeamId===R),D=A.filter(j=>$t(j)==="kapitaen"),Z=A.filter(j=>$t(j)==="co-kapitaen");if(D.length>0){if(D.forEach(j=>N.add(j.id)),D.length===1&&Z.length>0){const j=[...Z].sort((T,$)=>$.overallRating-T.overallRating||$.id-T.id);N.add(j[0].id)}}else if(Z.length>0)[...Z].sort((T,$)=>$.overallRating-T.overallRating||$.id-T.id).slice(0,2).forEach(T=>N.add(T.id));else{const j=A.filter(T=>$t(T)==="edelhelfer");if(j.length>0){const T=[...j].sort(($,_)=>_.overallRating-$.overallRating||_.id-$.id);N.add(T[0].id)}}}let P;if(R!=null){const D=e.filter(Z=>Z.activeTeamId===R).filter(Z=>!N.has(Z.id));D.length>0&&(P=[...D].sort((j,T)=>T.skills.attack-j.skills.attack||T.overallRating-j.overallRating||T.id-j.id)[0])}const B=e.filter(A=>{if(A.activeTeamId==null||k.has(A.id)||w.has(A.id)||R!=null&&A.activeTeamId===R&&(N.has(A.id)||P!=null&&A.id===P.id)||u&&g!=null&&A.activeTeamId===g||u&&b.has(A.activeTeamId))return!1;const D=$t(A);return!(f&&(D==="kapitaen"||D==="co-kapitaen")||u&&D==="kapitaen"||u&&D==="co-kapitaen"&&h.get(A.activeTeamId)!==!0||D==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(B.length===0)return null;const G=new Map(B.map(A=>[A.id,Gd(A,{isEarlyStageRace:u,race:t,gcLeaderTeamId:g,stageHasMountainClassifications:y,topMountainIds:x,isHardStage:E})])),z=B.reduce((A,D)=>{var Z;return A+(((Z=G.get(D.id))==null?void 0:Z.finalWeight)??0)},0),C=Dd(B,Math.max(0,Math.min(m-(P?1:0),B.length)),A=>{var D;return((D=G.get(A.id))==null?void 0:D.finalWeight)??1});if(P&&C.push(P),C.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${C.length}/${m} ausgewählt aus ${B.length}`),console.log(`Gesamtgewicht im Pool: ${z.toFixed(2)}`),console.table(C.map(A=>{var Z;const D=G.get(A.id);return{Fahrer:`${A.firstName} ${A.lastName}`,Team:A.activeTeamId,Rolle:((Z=A.role)==null?void 0:Z.name)??null,Atk:A.skills.attack,Hill:A.skills.hill,Chance:`${((z>0&&D!=null?D.finalWeight/z:0)*100).toFixed(2)}%`,Gewicht:((D==null?void 0:D.finalWeight)??1).toFixed(2),Attacke:`x${((D==null?void 0:D.attackFactor)??1).toFixed(2)}`,Superform:`x${(D==null?void 0:D.superformFactor)??1}`,GC_Team:`x${((D==null?void 0:D.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(D==null?void 0:D.mountainFactor)??1}`,Sprinter:`x${(D==null?void 0:D.sprinterFactor)??1}`}})),console.groupEnd();const H=r.distanceKm*1e3,U=Dt(0,Math.min(1e4,Math.max(0,Math.floor(H*.1)))),V=Ud(t,a),X=Math.round(H*Pn(V.min,V.max)),J=Math.round(H*Pn(.1,.25)),te=Math.max(U+1e3,Math.min(X-1e3,X-J)),W=a.rolledBreakawayBonus??0,L=a.profile==="Flat"||a.profile==="Rolling"?Dt(2,4):Dt(3+W,8+W);return{riderIds:C.map(A=>A.id),triggerDistanceMeters:U,groupPhaseEndDistanceMeters:te,phaseEndDistanceMeters:X,skillBonus:L,malusValue:a.profile==="Flat"||a.profile==="Rolling"?Dt(6,10):Dt(5,8),superTeamId:R}}const Zd=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),Jd=3,qd=7,Ln=120,Dn=200,An=180,Xd=10,Ga=8e3;function Ht(e,t,a=Math.random()){const r=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(a*(s-r+1))+r}function Qd(e){for(let t=e.length-1;t>0;t-=1){const a=Ht(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function $r(e,t){return t<=0||e.length===0?[]:Qd([...e]).slice(0,Math.min(t,e.length))}function ec(e,t,a){if(t<=0||e.length===0)return[];const r=[...e],s=[];for(;r.length>0&&s.length<t;){const n=r.reduce((c,l)=>c+Math.max(0,a(l)),0);if(n<=0){s.push(...$r(r,t-s.length));break}let i=Math.random()*n,o=r.length-1;for(let c=0;c<r.length;c+=1)if(i-=Math.max(0,a(r[c])),i<=0){o=c;break}s.push(r[o]),r.splice(o,1)}return s}function tc(e){return Zd.has(e.profile)}function ac(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function rc(e,t){if(!tc(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(r=>{if(!ac(r))return[];const s=r.start_km*1e3,n=r.end_km*1e3,i=Math.max(s,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:s,sourceSegmentEndMeters:n}]})}function _n(e,t){const a=t==null?e:e.filter(c=>{const l=Math.min(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t)),p=Math.max(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t));return l>=Ga||p>=Ga});if(a.length===0)return null;const r=a[Ht(0,a.length-1)];if(!r)return null;const s=Math.ceil(r.startMeters),n=Math.floor(r.endMeters);if(n<=s)return null;let i=0;for(;i<12;){const c=Ht(s,n);if(t==null||Math.abs(c-t)>=Ga)return{triggerDistanceMeters:c,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<r.startMeters?n:s;return t==null||Math.abs(o-t)>=Ga?{triggerDistanceMeters:o,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters}:null}function sc(e,t,a,r=()=>1){const s=e.slice(0,15),n=rc(t,a);if(s.length===0||n.length===0)return[];const i=Ht(Jd,Math.min(qd,s.length)),o=ec(s,i,r),c=[];for(const u of o){const f=_n(n);f&&c.push({riderId:u.id,attackNumber:1,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:Ht(Ln,Dn),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}if(c.length===0)return[];const l=c.map(u=>u.riderId),p=Math.floor(l.length*.5),m=new Set($r(l,p));for(const u of[...c]){if(!m.has(u.riderId))continue;const f=_n(n,u.triggerDistanceMeters);f&&c.push({riderId:u.riderId,attackNumber:2,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:Ht(Ln,Dn),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}return c.sort((u,f)=>u.triggerDistanceMeters-f.triggerDistanceMeters||u.riderId-f.riderId||u.attackNumber-f.attackNumber)}function nc(e,t,a){var c;if(e.length===0)return[];const r=((c=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:c.teamId)??null,s=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||r!=null&&l.teamId===r));if(s.length===0)return[];const n=new Map;for(const l of s){const p=n.get(l.teamId)??[];p.push(l),n.set(l.teamId,p)}const i=[...n.values()].map(l=>$r(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(Ht(0,3),i.length);return $r(i,o).map(l=>l.riderId)}function ic(e,t){const a=[],r=[];for(const[s,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){r.push(s);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:r}}function Xr(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}const oc={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},lc={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},dc={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},cc={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},uc={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function mc(e){const t=new Map;for(const a of e){const r=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",r);else if(a.appliesTo==="climb_top"){const s=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${s}`,r)}else a.appliesTo==="finish"&&t.set(a.markerType,r)}return t}const Ka=20,pc=120,gc=300,Qr=.025,fc=.1,hc=.4,bc=.6,yc=.8,ya=1,Bn=2/3,vc=.1,ja=10,Hn=50,Sc=25,kc=7,$c=500,xc=100,Tc=.02,wc=.04,Mc=.009,Rc=120,Ic=150,Cc=100,Fc=300,zn=50,es=85,At=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],Gn=5*60,Ec=60,Pc=.5,Nc=.3,Oa=5e3,Lc=2e3,Dc=1,Ac=2,_c=.05,ko={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},Bc={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},Wa=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function ve(e,t,a){return Math.max(t,Math.min(a,e))}function de(e,t){return e+Math.random()*(t-e)}const Kn={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}};function jn(e,t){const a=Kn[e]||Kn[1];return a.pref.includes(t)?"pref":a.malus.includes(t)?"malus":"neutral"}function On(e){return e[Math.floor(Math.random()*e.length)]}function Qt(e){return Math.round(e*100)/100}function Hc(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function Wn(e){if(e<2)return 1;const t=ve(e,2,20),a=Wa[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let r=1;r<Wa.length;r+=1){const s=Wa[r-1],n=Wa[r];if(t>n.gradientPercent)continue;const i=(t-s.gradientPercent)/Math.max(1e-4,n.gradientPercent-s.gradientPercent),o=s.draftPenaltyShare+(n.draftPenaltyShare-s.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function zc(e){return e==="Flat"?Rc:e==="Abfahrt"?Ic:Number.POSITIVE_INFINITY}function Gc(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function xr(e){return(e.formBonus??0)+(e.raceFormBonus??0)-((e.fatigueMalus??0)+(e.longTermFatigueMalus??0)+(e.shortTermFatigueMalus??0))*.5}function Kc(e,t){if(t.length===0)return"";const a=t.reduce((p,m)=>p+m.weight,0),r=t.map(p=>{const m=e.skills[p.key],u=Math.round(p.weight/a*100);return`${ko[p.key]} ${Math.round(m)} (${u}%)`}),s=e.formBonus??0,n=e.raceFormBonus??0,i=(e.fatigueMalus??0)*.5,o=(e.longTermFatigueMalus??0)*.5,c=(e.shortTermFatigueMalus??0)*.5;r.push(`S-Form ${s>=0?"+":""}${s.toFixed(1).replace(".",",")}`),r.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&r.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&r.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),c>0&&r.push(`Akut -${c.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const p of t)l+=(e.mentorBoosts[p.key]||0)*(p.weight/a);return l>0&&r.push(`Mentor +${l.toFixed(1).replace(".",",")}`),r.join(" • ")}function jc(){const e=Math.random();return e<.9?de(5,20):e<.98?de(20,40):de(40,70)}function Vn(){const e=Math.random();return e<.9?Qt(de(-1,1)):e<.995?Qt(On([-1,1])*de(1,2)):Qt(On([-1,1])*de(3,4))}function Oc(){return Qt(de(-3,3))}function Wc(e){const t=[];let a=0,r=jc(),s=de(-1,1);for(;a<e;){const n=Math.min(e-a,de(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:r,vector:s}),a+=n,a>=e)break;r=ve(r+(Math.random()<.5?-1:1)*de(2,10),5,70),s=ve(s+(Math.random()<.5?-1:1)*de(0,.5),-1,1)}return t}function $o(e,t){const a=ae(e),r=ae(t);if(a!==r)return a?1:-1;const s=Re(e),n=Re(t);return s&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:s?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function ae(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function Re(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function pa(e,t,a=!1,r=null){var c;const s="rider"in e?e.rider:null,n=(s==null?void 0:s.specialization1)??null,i=(s==null?void 0:s.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(c=s==null?void 0:s.role)==null?void 0:c.name;r==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function Vc(e,t,a=null,r=null,s=!1){var f,g;const n=b=>b.photoFinishScore;if(!t){const b=[...e].sort((y,k)=>y.crossingTimeSeconds-k.crossingTimeSeconds||k.photoFinishScore-y.photoFinishScore||y.riderId-k.riderId),h=((f=b[0])==null?void 0:f.crossingTimeSeconds)??0;return b.map((y,k)=>({riderId:y.riderId,rank:k+1,crossingTimeSeconds:y.crossingTimeSeconds,gapSeconds:Math.max(0,y.crossingTimeSeconds-h),photoFinishScore:y.photoFinishScore}))}const i=[...e].sort((b,h)=>b.crossingTimeSeconds-h.crossingTimeSeconds||h.photoFinishScore-b.photoFinishScore||b.riderId-h.riderId),o=((g=i[0])==null?void 0:g.crossingTimeSeconds)??0,c=[];let l=[],p=0,m=null;const u=()=>{const b=Math.max(0,p-o),h=l.sort((y,k)=>n(k)-n(y)||y.riderId-k.riderId);for(const y of h)c.push({riderId:y.riderId,rank:c.length+1,crossingTimeSeconds:y.crossingTimeSeconds,gapSeconds:b,photoFinishScore:y.photoFinishScore})};for(const b of i){if(l.length===0){l=[b],p=b.crossingTimeSeconds,m=b.crossingTimeSeconds;continue}if(m!=null&&b.crossingTimeSeconds-m<=ya){l.push(b),m=b.crossingTimeSeconds;continue}u(),l=[b],p=b.crossingTimeSeconds,m=b.crossingTimeSeconds}return l.length>0&&u(),c}function Uc(e,t,a){const r=e.filter(Re).sort((m,u)=>(m.finishTimeSeconds??0)-(u.finishTimeSeconds??0)||u.photoFinishScore-m.photoFinishScore||m.rider.id-u.rider.id),s=e.filter(m=>!ae(m)).sort($o),n=e.filter(m=>m.finishStatus==="dnf").sort((m,u)=>u.distanceCoveredMeters-m.distanceCoveredMeters||m.rider.id-u.rider.id),i=[];let o=[],c=null;const l=m=>m.photoFinishScore,p=()=>{i.push(...o.sort((m,u)=>l(u)-l(m)||m.rider.id-u.rider.id))};for(const m of r){const u=m.finishTimeSeconds??0;if(o.length===0){o=[m],c=u;continue}if(c!=null&&u-c<=ya){o.push(m),c=u;continue}p(),o=[m],c=u}return o.length>0&&p(),[...i,...s,...n]}function Yc(e,t){const a=ae(e),r=ae(t);if(a!==r)return a?1:-1;const s=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(s)>=.1?s:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:Re(e)&&Re(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:Re(e)?-1:Re(t)?1:e.rider.id-t.rider.id}function Un(e){const t=ve(e,1,Hn);return t<=2?.12*t:t<=ja?.24+(t-2)/Math.max(1,ja-2)*.58:.82+(t-ja)/Math.max(1,Hn-ja)*.18}function ts(e,t){const a=xr(e.rider);return Object.entries(t).reduce((r,[s,n])=>{if(!n)return r;const i=s==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[s]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return r+o*n},0)}function Zc(e,t){const a=xr(e.rider);return Object.entries(t).filter(r=>!!r[1]).map(([r,s])=>{const n=r,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:s,effectiveSkill:o,contribution:o*s}})}function Jc(e,t,a){let r=t;for(;r>0;){const n=e[r-1].distanceCoveredMeters-e[r].distanceCoveredMeters;if(n<=0||n>=a)break;r-=1}let s=t;for(;s<e.length-1;){const n=e[s].distanceCoveredMeters-e[s+1].distanceCoveredMeters;if(n<=0||n>=a)break;s+=1}return{startIndex:r,endIndex:s,size:s-r+1,positionInGroup:t-r}}function qc(e,t){if(e<Sc)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class xo{constructor(t,a){var G,z;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.superTeamProtectedLeaderIds=new Set,this.superTeamBonusAmount=0,this.superTeamMalusAmount=0,this.superTeamStartPercent=0,this.superTeamEndPercent=0,this.superTeamBreakawayRiderCaught=!1,this.hasLoggedFinishSprintTieBreak=!1,this.hasAppliedSprintLeadoutBonuses=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const r=(G=t.race.country)==null?void 0:G.code3;r&&(t.riders=t.riders.map(C=>{var U;const H=C.nationality||((U=C.country)==null?void 0:U.code3);if(H&&H.trim().toUpperCase()===r.trim().toUpperCase()){const V={...C,skills:{...C.skills}},X=Math.random(),J=t.stage.profile,te=J==="ITT"||J==="TTT",W=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(J==="Cobble"||J==="Cobble_Hill")&&W.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(J)||W.push("mountain","mediumMountain");const Z=[...(j=>{const T=[...W],$=[];if(te){$.push("timeTrial");const _=Math.min(j-1,T.length);for(let K=0;K<_;K++){const O=Math.floor(Math.random()*T.length);$.push(T.splice(O,1)[0])}}else{const _=Math.min(j,T.length);for(let K=0;K<_;K++){const O=Math.floor(Math.random()*T.length);$.push(T.splice(O,1)[0])}}return $})(5)].sort(()=>Math.random()-.5);if(V.homeEffectSkills=Z,X<.05){V.homeEffect="home_pressure";for(const j of Z)V.skills[j]=Math.max(0,V.skills[j]-.5)}else if(X<.1){V.homeEffect="super_home";const j=Z[0];V.skills[j]=Math.min(100,V.skills[j]+3);for(let T=1;T<5;T++){const $=Z[T];V.skills[$]=Math.min(100,V.skills[$]+1)}}else{V.homeEffect="normal_home";for(const j of Z)V.skills[j]=Math.min(100,V.skills[j]+1)}return V}return C}));const s=t.stage.rolledWeatherId||1;t.riders=t.riders.map(C=>{const H=C.weatherProfileId||1,U=jn(H,s);if(U==="neutral")return C;const V={...C,skills:{...C.skills}},X=["flat","mountain","stamina","bikeHandling","recuperation","downhill"];if(U==="pref")for(const J of X){const te=de(.2,1);V.skills[J]=Math.min(100,V.skills[J]+te)}else if(U==="malus"){let J=0;if(t.lieutenants){const te=t.lieutenants.find(W=>W.leaderId===C.id);if(te&&t.riders.some(L=>L.id===te.lieutenantId)){const L=t.riders.find(Z=>Z.id===te.lieutenantId),A=(L==null?void 0:L.weatherProfileId)||1;jn(A,s)==="pref"&&(J=de(.4,.75))}}for(const te of X){const W=de(.2,1)*(1-J);V.skills[te]=Math.max(0,V.skills[te]-W)}}return V}),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=kd(t.stage.profile),this.skillWeightRuleMap=vd(t.skillWeightRules??[]),this.skillWeightConfigMap=Sd(t.skillWeightRules??[]),this.stageScoringWeightMap=mc(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=Wc(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const n=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=n!=null?ve(n/100,0,1):de(bc,yc);const i=t.stage.finalPushStartPercent;this.finalPushStartRatio=i!=null?ve(i/100,this.lateStageStartRatio,1):ve(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const o=Fd(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(o.map(C=>[C.riderId,C])),o.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",o.map(H=>({riderId:H.riderId,type:H.type,severity:H.severity,kmMark:H.triggerDistanceKm,waitDurationSeconds:H.waitDurationSeconds,supportRiderIds:H.supportRiderIds})));const C=o.filter(H=>H.isMassCrashTrigger);C.length>0&&C.forEach(H=>{var U;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${H.riderId} bei Km ${H.triggerDistanceKm}. Potenziell betroffene Fahrer (${(U=H.massCrashPotentialRiderIds)==null?void 0:U.length}):`,H.massCrashPotentialRiderIds)})}const c=t.riders.map(C=>{const H={rider:C,riderName:`${C.firstName} ${C.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:Oc(),microForm:Vn(),nextFormUpdateMeter:de(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(C.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(H),H}),l=new Map(c.map(C=>[C.rider.id,C.dailyForm]));this.stageFavorites=Vi(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:l});const p=this.stageFavorites.filter(C=>C.kind==="rider"&&C.riderId!=null).slice(0,15).map(C=>t.riders.find(H=>H.id===C.riderId)??null).filter(C=>C!=null),m=((z=t.gcStandings.find(C=>C.rank===1))==null?void 0:z.riderId)??null,u=sc(p,t.stage,t.stageSummary,C=>Math.max(1,Math.pow(10,(C.skills.attack-65)/10))*(C.id===m?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const C of u){const H=this.precalculatedStageAttacksByRiderId.get(C.riderId)??[];H.push(C),this.precalculatedStageAttacksByRiderId.set(C.riderId,H)}this.breakawayPlan=Yd(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings,t.teams);const f=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=f.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=f.fallbackCheckpointsMeters;for(const C of c)C.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const g=Ld(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:l}),b=new Map(g.map(C=>[C.id,C])),h=c.map(C=>{const H=b.get(C.rider.id)??C.rider;return{...C,rider:H,riderName:`${H.firstName} ${H.lastName}`,dailyForm:C.dailyForm+(H.specialFormDelta??0)}}),y=g.filter(C=>C.hasSuperform),k=g.filter(C=>C.hasSupermalus);(y.length>0||k.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:y.map(C=>`${C.firstName} ${C.lastName}`),supermalus:k.map(C=>`${C.firstName} ${C.lastName}`)});const w=this.resolveStartOrder(h),M=new Map((this.bootstrap.teamStartOrder??[]).map((C,H)=>[C,H]));if(this.riders=w.map((C,H)=>({...C,startOffsetSeconds:this.resolveStartOffsetSeconds(C,H,M)})),this.riders.forEach(C=>this.syncRiderTelemetry(C)),this.breakawayPlan&&this.breakawayPlan.superTeamId!=null){this.superTeamId=this.breakawayPlan.superTeamId,this.superTeamBonusAmount=Xr(2,6),this.superTeamMalusAmount=Xr(4,8),this.superTeamStartPercent=de(.4,.6),this.superTeamEndPercent=de(.86,.96);const C=W=>(W??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),H=t.riders.filter(W=>W.activeTeamId===this.superTeamId),U=H.filter(W=>{var L;return C((L=W.role)==null?void 0:L.name)==="kapitaen"}),V=H.filter(W=>{var L;return C((L=W.role)==null?void 0:L.name)==="co-kapitaen"});if(U.length>0){if(U.forEach(W=>this.superTeamProtectedLeaderIds.add(W.id)),U.length===1&&V.length>0){const W=[...V].sort((L,A)=>A.overallRating-L.overallRating||A.id-L.id);this.superTeamProtectedLeaderIds.add(W[0].id)}}else if(V.length>0)[...V].sort((L,A)=>A.overallRating-L.overallRating||A.id-L.id).slice(0,2).forEach(L=>this.superTeamProtectedLeaderIds.add(L.id));else{const W=H.filter(L=>{var A;return C((A=L.role)==null?void 0:A.name)==="edelhelfer"});if(W.length>0){const L=[...W].sort((A,D)=>D.overallRating-A.overallRating||D.id-A.id);this.superTeamProtectedLeaderIds.add(L[0].id)}}const X=t.teams.find(W=>W.id===this.superTeamId),J=X?X.name:`Team ${this.superTeamId}`;this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,riderTeamId:this.superTeamId,type:"superteam",tone:"neutral",title:`Superteam des Tages: ${J}`,detail:`Dieses Team hat sich heute zusammengeschlossen, um seinen Leader zu unterstützen! Die Helfer erhalten zwischen ${(this.superTeamStartPercent*100).toFixed(0)}% und ${(this.superTeamEndPercent*100).toFixed(0)}% der Etappe einen Bonus von +${this.superTeamBonusAmount} auf Berg, Hill, Medium Mountain und Flat. Danach folgt ein individueller Malus von -4 bis -8 wegen Erschöpfung.`});const te=this.riders.find(W=>{var L;return W.rider.activeTeamId===this.superTeamId&&((L=this.breakawayPlan)==null?void 0:L.riderIds.includes(W.rider.id))});te&&(this.superTeamBreakawayRiderId=te.rider.id)}for(const C of this.riders){const H=C.rider.homeEffectSkills,U=V=>Bc[V]||V;if(C.rider.homeEffect==="super_home"){const V=H&&H.length===5?`${U(H[0])} (+3), ${U(H[1])} (+1), ${U(H[2])} (+1), ${U(H[3])} (+1), ${U(H[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${V})`})}if(C.rider.homeEffect==="home_pressure"){const V=H?H.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${V})`})}if(C.rider.homeEffect==="normal_home"){const V=H?H.map(U).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${V})`})}C.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),C.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),C.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:C.rider.id,riderName:C.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(C.rider.id,C.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const x=this.bootstrap.stage.rolledWetterName??"Sonnig",E=this.bootstrap.stage.rolledEffektSturz??0,I=this.bootstrap.stage.rolledEffektDefekt??0,F=this.bootstrap.stage.rolledWindkantenGefahr??0,R=this.bootstrap.stage.rolledEffektFatigue??0,N=this.bootstrap.stage.rolledBreakawayBonus??0,P=[];E>0&&P.push(`Sturzwahrscheinlichkeit +${E.toFixed(1)}%`),I>0&&P.push(`Defektwahrscheinlichkeit +${I.toFixed(1)}%`),F>0&&P.push(`Windkanten-Gefahr +${(F*100).toFixed(1)}%`),R>0&&P.push(`Fatigue +${R.toFixed(1)}%`),N>0&&P.push(`Ausreißer-Bonus +${N.toFixed(1)}`);const B=P.length>0?`Wettereinflüsse: ${P.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${x}`,detail:B})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const r=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(r),a-=r}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(r=>({riderId:r.rider.id,riderName:r.riderName,startOffsetSeconds:r.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(r),hasStarted:r.hasStarted||ae(r),distanceCoveredMeters:r.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-r.distanceCoveredMeters),segmentStartKm:r.segmentStartKm,segmentEndKm:r.segmentEndKm,segmentStartElevation:r.segmentStartElevation,segmentEndElevation:r.segmentEndElevation,activeTerrain:Re(r)?"Finish":r.activeTerrain,skillName:Re(r)?"Finish":r.skillName,skillBreakdown:Re(r)?"":r.skillBreakdown,baseSkill:r.baseSkill,teamGroupBonus:r.teamGroupBonus,effectiveSkill:r.effectiveSkill,staminaPenalty:r.staminaPenalty,elevationPenalty:r.elevationPenalty,dailyForm:r.dailyForm,microForm:r.microForm,gradientPercent:r.gradientPercent,gradientModifier:r.gradientModifier,windModifier:r.windModifier,draftModifier:r.draftModifier,draftNearbyRiderCount:r.draftNearbyRiderCount,draftPackFactor:r.draftPackFactor,currentSpeedMps:r.currentSpeedMps,photoFinishScore:r.photoFinishScore,leadoutBonus:r.leadoutBonus,leadoutRiderId:r.leadoutRiderId,leadoutContributions:r.leadoutContributions,lastSplitLabel:r.lastSplitLabel,lastSplitTimeSeconds:r.lastSplitTimeSeconds,splitTimes:{...r.splitTimes},finishTimeSeconds:Number.isFinite(r.finishTimeSeconds??Number.NaN)?r.finishTimeSeconds:null,finishStatus:r.finishStatus,statusReason:r.statusReason,isAttacking:r.isAttacking,isBreakaway:r.isBreakaway,isLeadingGroup:r.isLeadingGroup,hasSuperform:r.rider.hasSuperform===!0,hasSupermalus:r.rider.hasSupermalus===!0,isFinished:Re(r)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(r=>r.appliedIncident?[r.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus},superTeamId:this.superTeamId}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let r=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(r=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(r==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,c)=>Math.max(o,c.distanceCoveredMeters),0);r=Number((i/1e3).toFixed(2))}const s={id:this.nextMessageId,...t,riderTeamId:a,kmMark:r};this.messages.unshift(s),this.allEvents.push(s),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(r=>[r.rider.id,r]));return this.intermediateMarkers.map(r=>{const s=t.map(i=>i.markerCrossings[r.key]??null).filter(i=>i!=null),n=Vc(s,!this.isTimeTrialMode,r.markerType,a,this.isClimberMalusStage());return{markerKey:r.key,markerLabel:r.label,markerType:r.markerType,markerCategory:r.markerCategory,kmMark:r.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.isTimeTrialMode?[...this.riders].sort($o):Uc(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(s=>s.finishStatus!=="dnf").reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0);let r=0;for(const s of t)Re(s)&&(r+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:r,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(ae)}advanceSubstep(t){const a=this.elapsedSeconds,r=a+t,s=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();if(this.updateBreakawayPhaseState(),this.superTeamId!=null&&this.superTeamBreakawayRiderId!=null&&!this.superTeamBreakawayRiderCaught){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&!ae(l)&&this.riders.filter(u=>this.superTeamProtectedLeaderIds.has(u.rider.id)&&!ae(u)).some(u=>u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&u.distanceCoveredMeters>=l.distanceCoveredMeters)&&(this.superTeamBreakawayRiderCaught=!0,l.breakawayMalus=0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} von Leader eingeholt!`,detail:"Der Ausreißer wurde von seinem Kapitän eingeholt und unterstützt das Team ab jetzt mit frischen Kräften!"}))}if(this.superTeamBreakawayRiderCaught&&this.superTeamBreakawayRiderId!=null){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&(l.breakawayMalus=0)}for(const l of this.riders){if(ae(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,r-p);if(m<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-m),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const u=this.currentSegment(l),f=this.currentWindZone(l);if(!u||!f){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=p,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const b=pa(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=b,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[];continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,s);const g=this.calculateBasePhysics(l,u,f);l.activeTerrain=u.terrain,l.skillName=g.skillName,l.skillBreakdown=g.skillBreakdown,l.baseSkill=g.baseSkill,l.teamGroupBonus=g.teamGroupBonus,l.effectiveSkill=g.effectiveSkill,l.staminaPenalty=g.staminaPenalty,l.elevationPenalty=g.elevationPenalty,l.gradientPercent=g.gradientPercent,l.gradientModifier=g.gradientModifier,l.windModifier=g.windModifier,l.tempSpeedMps=g.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=g.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*m}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,r);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const p of this.riders)l.push(p);l.sort(Yc);for(let p=0;p<l.length;p+=1){const m=l[p];if(ae(m))continue;const u=this.isActiveBreakawayRider(m),f=m.tempSpeedMps/14,g=Math.max(5,50*f),b=this.currentSegment(m),h=Math.max(15,150*f),y=Math.max(g,Math.min(h,zc(b==null?void 0:b.terrain))),k=Jc(l,p,y),w=k.size,M=Un(w),x=qc(w,k.positionInGroup);let E=0,I=Number.POSITIVE_INFINITY,F=null;for(let L=p-1;L>=0;L-=1){const A=l[L],D=A.distanceCoveredMeters-m.distanceCoveredMeters;if(D>=y+vc)break;!this.canReceiveDraftFromCandidate(m,A)||this.isActiveBreakawayRider(A)||D<=0||D>=y||(E+=1,D<=I&&(I=D,F=A))}if(E===0||!F){if(u)continue;m.draftModifier=1,m.draftNearbyRiderCount=0,m.draftPackFactor=0,m.currentSpeedMps=m.tempSpeedMps,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,m.isLeadingGroup=!0,this.applyCaptainWaitLogic(m);continue}const R=ae(F)?F.tempSpeedMps:F.currentSpeedMps,N=I,P=N<=g?1:1-(N-g)/Math.max(1e-4,y-g),B=this.currentWindZone(m),G=(B==null?void 0:B.vector)??0,z=(B==null?void 0:B.windSpeedKph)??0,C=-G*(z/70),U=Math.max(.3,.35+.35*C)*Math.min(1,f)*Bn,V=ve((b==null?void 0:b.gradient_percent)??0,-20,20),X=Wn(V),te=1+(x?0:U*P*M*X),W=m.tempSpeedMps*te;if(!(u&&te<=m.draftModifier)){if(m.draftModifier=te,m.draftNearbyRiderCount=w,m.draftPackFactor=M,m.isLeadingGroup=x,W>R){if(m.tempSpeedMps>F.tempSpeedMps){m.currentSpeedMps=W,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t;continue}if(N<1){m.currentSpeedMps=R,m.nextDistanceCoveredMeters=F.distanceCoveredMeters+R*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=Math.min(W,R+2),m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=W,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(ae(l))continue;if(this.superTeamId!=null&&l.rider.activeTeamId===this.superTeamId&&!this.superTeamProtectedLeaderIds.has(l.rider.id)){const y=l.rider.id===this.superTeamBreakawayRiderId;if(!y||this.superTeamBreakawayRiderCaught){const k=l.distanceCoveredMeters/this.stageDistanceMeters;let w=0,M=!1,x=!1;y?k<this.superTeamEndPercent?M=!0:l.superTeamActiveLogged&&(x=!0):k>=this.superTeamStartPercent&&k<this.superTeamEndPercent?M=!0:k>=this.superTeamEndPercent&&l.superTeamActiveLogged&&(x=!0),M?(w=this.superTeamBonusAmount,l.superTeamActiveLogged||(l.superTeamActiveLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} leistet Führungsarbeit!`,detail:y?`Der eingeholte Ausreißer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`:`Der Edelhelfer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`}))):x&&(l.superTeamMalusAmount==null&&(l.superTeamMalusAmount=Xr(4,8)),w=-l.superTeamMalusAmount,l.superTeamExhaustedLogged||(l.superTeamExhaustedLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"warning",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} ist erschöpft!`,detail:`Die Führungsarbeit hat ihren Tribut gefordert. Der Fahrer erhält für den Rest der Etappe einen Malus von -${l.superTeamMalusAmount} auf Berg-, Hügel- und Flachpassagen.`}))),l.originalSkills||(l.originalSkills={flat:l.rider.skills.flat,mountain:l.rider.skills.mountain,mediumMountain:l.rider.skills.mediumMountain,hill:l.rider.skills.hill}),l.rider.skills.flat=l.originalSkills.flat+w,l.rider.skills.mountain=l.originalSkills.mountain+w,l.rider.skills.mediumMountain=l.originalSkills.mediumMountain+w,l.rider.skills.hill=l.originalSkills.hill+w}}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds)continue;const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,r-p);if(m<=0)continue;const u=l.distanceCoveredMeters,f=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*m,g=l.pendingIncident;if(g&&u<g.triggerDistanceMeters&&f>=g.triggerDistanceMeters){const y=Math.max(.1,l.currentSpeedMps),k=Math.max(0,(g.triggerDistanceMeters-u)/y);l.distanceCoveredMeters=g.triggerDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.applyIncident(l,g,p+k),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const b=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,f-l.distanceCoveredMeters)>=b){const y=b/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),l.finishTimeSeconds=p+y,l.currentSpeedMps=0;const k=pa(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=k,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[]}else l.distanceCoveredMeters=f,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,u,l.distanceCoveredMeters,p),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-m),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!ae(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=Vn(),l.nextFormUpdateMeter+=de(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),p=this.riders.filter(u=>l.has(u.rider.id)&&!ae(u)),m=this.riders.filter(u=>!l.has(u.rider.id)&&!ae(u));if(p.length>0&&m.length>0){const u=p.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,p[0]);m.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,m[0]).distanceCoveredMeters>=u.distanceCoveredMeters&&(u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:u.rider.id,riderName:u.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${u.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const c=ic(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of c.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!ae(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const r=new Map;for(const s of this.riders){if(ae(s)||s.rider.activeTeamId==null||a<=s.startOffsetSeconds)continue;const n=r.get(s.rider.activeTeamId)??[];n.push(s),r.set(s.rider.activeTeamId,n)}for(const s of r.values()){const n=s[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,s.length),c=[...s].sort((u,f)=>f.effectiveSkill-u.effectiveSkill||u.rider.id-f.rider.id).slice(0,o).reduce((u,f)=>u+f.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-s.length),p=Math.max(1,c-l),m=this.resolveTimeTrialSpeedMps(p,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*xd(i.terrain,this.bootstrap.skillWeightRules??[]);for(const u of s){const f=Math.max(t,u.startOffsetSeconds),g=Math.max(0,a-f);u.currentSpeedMps=m,u.tempSpeedMps=m,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+m*g}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const s=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?s.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,c=i.rider.activeTeamId!=null?s.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==c?o-c:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(s=>[s.riderId,s.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((s,n)=>{const i=a.get(s.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(s)-this.resolveProjectedIttStartScore(n)||s.rider.id-n.rider.id}):[...t].sort((s,n)=>s.rider.skills.timeTrial-n.rider.skills.timeTrial||s.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,r=0;for(const s of this.bootstrap.stageSummary.segments){const n=(s.start_km+s.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,s.terrain),c=i>0?this.resolveWeightedSkill(t.rider,s.terrain,i):o,l=Math.max(0,o.value-c.value),{effectiveSkill:p}=this.resolveEffectiveSkill({rider:t,baseSkill:c.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),m=ve(s.gradient_percent,-20,20),u=m>0?Math.exp(-.11*m):1-m*.06,f=this.windZones.find(b=>n>=b.startMeter&&n<=b.endMeter)??this.windZones[this.windZones.length-1],g=f?1+f.vector*(f.windSpeedKph/100)*.52:1;a+=p*u*g*s.length_km,r+=s.length_km}return r>0?a/r:0}resolveStartOffsetSeconds(t,a,r){if(this.isIndividualTimeTrial)return a*pc;if(this.isTeamTimeTrial){const s=t.rider.activeTeamId;return(s!=null?r.get(s)??0:0)*gc}return 0}buildIntermediateMarkers(){return ct(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||Pt(t)).map(({key:t,label:a,marker:r,kmMark:s})=>({key:t,distanceMeters:s*1e3,label:a,markerType:r.type,markerCategory:r.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(c=>c.distanceMeters<t.groupPhaseEndDistanceMeters),r=this.stageDistanceMeters*Nc,s=a.some(c=>c.distanceMeters<=r);if(!(a.length<=1||!s))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(Oa,Math.ceil(r/Oa)*Oa);for(let c=o;c<t.groupPhaseEndDistanceMeters;c+=Oa)i.push(c);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,r){const s=Gc(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,c=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),p=Math.min(85,o.value)+l,m=this.isTimeTrialMode?0:t.teamGroupBonus,u=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:f,staminaPenalty:g,elevationPenalty:b}=this.resolveEffectiveSkill({rider:t,baseSkill:p,staminaPenalty:c,teamGroupBonus:m,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:u}),h=ve(a.gradient_percent,-20,20),y=h>0?Math.exp(-.11*h):1-h*.06,k=1+r.vector*(r.windSpeedKph/100)*.52,w=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:s,skillBreakdown:o.breakdown,baseSkill:p,teamGroupBonus:m,effectiveSkill:f,staminaPenalty:g,elevationPenalty:b,gradientPercent:h,gradientModifier:y,windModifier:k,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(f,t.distanceCoveredMeters,a,y,k):this.resolveRoadStageSpeedMps(f,t.distanceCoveredMeters,a,y,k,w)}}resolveRoadStageSpeedMps(t,a,r,s,n,i){const o=this.resolveSkillSpreadFactor(a,r),c=this.resolveSegmentElevation(r,a),l=this.resolveElevationSkillSpreadFactor(r,c),u=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,u*s*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const r=Math.max(0,a-$c),s=Math.floor(r/xc);return t.terrain==="Mountain"?1+(s*wc+s*Math.max(0,s-1)*Mc/2):1+s*Tc}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const r=a.filter(n=>n.activeTerrain===t.activeTerrain);return(r.length>0?r:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,r){if(r<=1)return{draftModifier:1,draftPackFactor:0};const s=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,c=-i*(o/70),p=Math.max(.3,.35+.35*c)*Math.min(1,s)*Bn,m=ve(a.gradient_percent,-20,20),u=Wn(m),f=Un(r);return{draftModifier:1+p*f*u,draftPackFactor:f}}resolveBreakawayTimeGapPenalty(t){if(t<Gn)return 0;const a=Math.floor((t-Gn)/Ec);return Pc+a}recordBreakawayFallbackCheckpointCrossings(t,a,r,s,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>r)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const c=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?s+c-t.startOffsetSeconds:s+c);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let s=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((c,l)=>l.distanceCoveredMeters-c.distanceCoveredMeters||l.currentSpeedMps-c.currentSpeedMps||c.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,s;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const c=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!c)break;const l=n.markerCrossings[c.key]??null;if(!l)break;const p=t.map(m=>m.markerCrossings[c.key]??null).filter(m=>m!=null).sort((m,u)=>m.crossingTimeSeconds-u.crossingTimeSeconds||m.riderId-u.riderId)[0]??null;if(p){const m=l.crossingTimeSeconds-p.crossingTimeSeconds;s=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:s,kmMark:c.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const c=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[c]??null;if(l==null)break;const p=t.map(m=>m.breakawayFallbackCheckpointTimes[c]??null).filter(m=>m!=null).sort((m,u)=>m-u)[0]??null;if(p!=null){const m=l-p;s=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:s,kmMark:c<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[c]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return s}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),r=this.riders.filter(o=>!ae(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),s=this.riders.filter(o=>!ae(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(r.length===0||s.length===0){this.breakawayGapStatus=null;return}const n=[...r].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null,i=[...s].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const c=this.intermediateMarkers[o];if(!c)continue;const l=n.markerCrossings[c.key]??null,p=i.markerCrossings[c.key]??null;if(!l||!p)continue;const m=p.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:c.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const c=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(c==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,p=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||p==null)continue;const m=p-l;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:c/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=new Set(a.riderIds),s=this.riders.filter(o=>!ae(o)&&r.has(o.rider.id));if(s.length===0)return;const n=this.riders.filter(o=>!ae(o)&&!r.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(s,n);for(const o of s)o.breakawayGapPenalty=i;for(const o of s){const c=this.currentSegment(o);if(!c)continue;const p=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=p,o.tempSpeedMps=this.resolveRoadStageSpeedMps(p,o.distanceCoveredMeters,c,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(c.terrain));const m=this.resolveMaxBreakawayDraftModifier(o,c,s.length);o.draftModifier=m.draftModifier,o.draftNearbyRiderCount=Math.max(0,s.length-1),o.draftPackFactor=m.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*m.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,r,s,n){return this.resolveRoadStageSpeedMps(t,a,r,s,n,.5)}syncRiderTelemetry(t,a=null){var i;const r=this.currentSegment(t),s=this.currentWindZone(t);if(ae(t)||!r||!s){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,r,s);t.segmentStartKm=r.start_km,t.segmentEndKm=r.end_km,t.segmentStartElevation=r.start_elevation,t.segmentEndElevation=r.end_elevation,t.activeTerrain=r.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),r=this.riders.reduce((n,i)=>ae(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(r<=t.phaseEndDistanceMeters)return!1;let s=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(r<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<_c){n.breakawayMalus=0,s=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),c=Math.floor(o/Lc),l=Math.min(Ac,n.breakawayInitialMalus),p=Math.max(l,n.breakawayInitialMalus-c*Dc),m=Qt(p);m!==n.breakawayMalus&&(n.breakawayMalus=m,s=!0)}return s}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const r=new Set(a.riderIds);for(const s of this.riders)ae(s)||!r.has(s.rider.id)||this.syncRiderTelemetry(s,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(s=>t.riderIds.includes(s.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const s of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:s.rider.id,riderName:s.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(s.rider.id,s.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let r=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),r=!0}if(this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayMalus=t.malusValue,s.breakawayInitialMalus=t.malusValue,s.breakawayRecoveryStartDistanceMeters=null,s.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return r}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=this.riders.filter(o=>!ae(o)&&a.riderIds.includes(o.rider.id));if(r.length===0)return;const s=[...r].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0];if(!s)return;const n=Math.max(.1,s.currentSpeedMps),i=s.distanceCoveredMeters+n*t;for(const o of r){if(Math.max(0,s.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?Xd:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const r=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(r==null||r.isCounterAttack)return!0;const s=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(s==null?void 0:s.isCounterAttack)===!0&&s.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(r=>r.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const r=this.resolvePreStageGcRank(t);return r!=null?`${a} (${r}.)`:a}triggerStageAttacksForRider(t,a,r,s){if(ae(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||r<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(r/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const c=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/c),p=s+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:p,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const m=new Set(this.activeStageAttacksByRiderId.keys()),u=this.stageFavorites.slice(0,20).filter(b=>{if(b.kind!=="rider"||b.riderId==null)return!1;const h=this.riders.find(k=>k.rider.id===b.riderId);if(!h||ae(h))return!1;const y=t.distanceCoveredMeters-h.distanceCoveredMeters;return y>=0&&y<=150}),f=nc(u,t.rider.id,m),g=[];for(const b of f){const h=this.riders.find(y=>y.rider.id===b);!h||ae(h)||this.activeStageAttacksByRiderId.has(b)||(this.activeStageAttacksByRiderId.set(b,{riderId:b,remainingSeconds:An,startedAtElapsedSeconds:p,triggerDistanceMeters:h.distanceCoveredMeters,durationSeconds:An,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),h.isAttacking=!0,g.push({riderId:b,riderName:this.formatRiderWithPreStageGc(b,h.riderName),riderTeamId:h.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:p,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const b of g)this.pushMessage({elapsedSeconds:p,riderId:b.riderId,riderName:b.riderName,type:"counter_attack",tone:"warning",title:`${b.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const r of t){if(r.finishStatus==="dnf")continue;const s=a[a.length-1];if(!s||Math.abs(s.distanceMeter-r.distanceCoveredMeters)>=Ka){a.push({riderIds:[r.rider.id],riderCount:1,distanceMeter:r.distanceCoveredMeters,distanceSum:r.distanceCoveredMeters});continue}s.riderIds.push(r.rider.id),s.riderCount+=1,s.distanceSum+=r.distanceCoveredMeters,s.distanceMeter=s.distanceSum/s.riderCount}return a.map(({distanceSum:r,...s})=>s)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!ae(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),r=new Map;let s=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],c=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-c<Ka;){const m=a[n].rider.activeTeamId;m!=null&&r.set(m,(r.get(m)??0)+1),n+=1}for(;s<a.length&&c-a[s].distanceCoveredMeters>=Ka;){const m=a[s].rider.activeTeamId;if(m!=null){const u=(r.get(m)??0)-1;u<=0?r.delete(m):r.set(m,u)}s+=1}const l=o.rider.activeTeamId,p=l==null?0:Math.max(0,(r.get(l)??0)-1);t.set(o.rider.id,p===0?0:Qt(p*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?kc:0,r=this.resolveBreakawaySkillBonus(t.rider),s=t.baseSkill+xr(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+r+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,s),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const r=ve(this.stageDistanceMeters/1e3,Cc,Fc),s=this.interpolateStaminaDistanceValue(r),n=ve(t,zn,es),i=(es-n)/(es-zn),o=s/3+i*s,c=this.stageDistanceMeters<=0?0:ve(a/this.stageDistanceMeters,0,1);return o*c**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=At[0].kmMark)return At[0].value;for(let a=0;a<At.length-1;a+=1){const r=At[a],s=At[a+1];if(t<=s.kmMark){const n=Math.max(1e-4,s.kmMark-r.kmMark),i=(t-r.kmMark)/n;return r.value+(s.value-r.value)*i}}return At[At.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/Qr),r=Math.max(1,Math.ceil(t/Qr)),s=de(fc,hc),n=Array.from({length:r},()=>de(.2,1.2)),i=n.reduce((l,p)=>l+p,0),o=Array.from({length:a+1},()=>1);o[0]=s;let c=0;for(let l=1;l<=r;l+=1)c+=n[l-1]??0,o[l]=s+(1-s)*(c/i);return o}resolveSkillSpreadFactor(t,a){const r=this.stageDistanceMeters<=0?1:ve(t/this.stageDistanceMeters,0,1),s=Math.min(this.spreadCurve.length-1,Math.floor(r/Qr)),n=this.spreadCurve[s]??1;if(r<=this.lateStageStartRatio)return n;const i=Td(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),c=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=ve((r-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),p=this.interpolateFinalSpread(o,l);if(o<=1&&c<=1)return n;if(r<this.finalPushStartRatio||c<=o)return Math.max(n,p);const m=ve((r-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),u=o+(c-o)*m;return Math.max(n,u)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const r=co(this.simulationMode,t,this.skillWeightRuleMap).map(s=>({key:s.key,weight:s.weight}));return this.weightedSkillComponentsByTerrain.set(t,r),r}resolveWeightedSkill(t,a,r=0){const s=this.resolveWeightedSkillComponents(a),n=r>0||t.mentorBoosts?{...t.skills}:t.skills;if(r>0&&(n.stamina=Math.max(0,n.stamina-r)),t.mentorBoosts)for(const[l,p]of Object.entries(t.mentorBoosts))typeof p=="number"&&(n[l]+=p);let i=0,o=0;for(const l of s)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:$d(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,s)}}resolveSkillBreakdown(t,a,r){const s=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(s);if(n!==void 0)return n;const i=Kc(t,r);return this.skillBreakdownCache.set(s,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const r=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,s=Math.max(0,100-r)/1e3,n=this.resolveElevationBucket(a);return s*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const r=a??this.interpolateElevation(t.distanceCoveredMeters),s=this.resolveElevationBucket(r);return s===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=s,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,r)),t.elevationPenalty}resolveSegmentElevation(t,a){const r=t.start_km*1e3,s=t.end_km*1e3,n=Math.max(1e-4,s-r),i=ve((a-r)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const s=ve(t,0,this.stageDistanceMeters)/1e3;if(s<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(s<=o.kmMark){const c=Math.max(1e-4,o.kmMark-i.kmMark),l=(s-i.kmMark)/c;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),ts(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var m;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(Re).sort((u,f)=>(u.finishTimeSeconds??0)-(f.finishTimeSeconds??0)||f.photoFinishScore-u.photoFinishScore||u.rider.id-f.rider.id);if(t.length===0)return;const a=[];let r=null;for(const u of t){const f=u.finishTimeSeconds??0;if(a.length===0){a.push(u),r=f;continue}if(r!=null&&f-r<=ya){a.push(u),r=f;continue}break}const s=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=u=>u.photoFinishScore,o=[...a].sort((u,f)=>i(f)-i(u)||u.rider.id-f.rider.id),c=((m=o[0])==null?void 0:m.finishTimeSeconds)??0,l=this.finishWeightProfile,p=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${p} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${ya.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${s}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((u,f)=>{const g=Zc(u,l).map(x=>`${ko[x.skillKey]} ${x.contribution.toFixed(2)} = ${x.effectiveSkill.toFixed(2)} x ${(x.weight*100).toFixed(0)}%`).join(" | "),b=u.finishTimeSeconds??0,h=b-c,y=h<=1e-4?`${b.toFixed(2)} s`:`${b.toFixed(2)} s (+${h.toFixed(2)} s)`,k=this.calculatePhotoFinishScore(u),w=u.leadoutBonus??0,M=pa(u,s,n);console.log(`#${f+1} Zielsprint | ${u.riderName} | Zeit ${y} | Score (ohne Boni): ${k.toFixed(2)} -> Score (mit Boni): ${u.photoFinishScore.toFixed(2)} [SpecAdj: ${M>0?"+":""}${M.toFixed(2)}, Leadout: +${w.toFixed(2)}] | ID-Tiebreak ${u.rider.id} | (${g})`)}),console.groupEnd()}recordIntermediateSplits(t,a,r,s,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>r)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,c=Math.max(0,this.isTimeTrialMode?s+o-t.startOffsetSeconds:s+o);let l=this.resolveMarkerCrossingScore(t,i);const p=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;p&&(l+=pa(t,p,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=c,t.splitTimes[i.key]=c,t.splitTimes[i.label]=c,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:c,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return ts(t,this.resolveSprintWeightProfile());const r=ts(t,this.resolveClimbWeightProfile(a.markerCategory)),s=Hc(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return r+s}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??oc}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??uc[a]}calculatePreLeadoutFinishScore(t){const r=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,s=xr(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[c,l])=>{if(!l)return o;const p=c==="stamina"?r:0,m=Math.max(0,t.rider.skills[c]+s+t.dailyForm+t.microForm+t.teamGroupBonus-p);return o+m*l},0),i=pa(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}applySprintLeadoutBonuses(){const t=this.resolveFinishMarkerType();if(t!=="finish_flat"&&t!=="finish_hill"||this.isTimeTrialMode)return;const a=this.riders.filter(Re).sort((o,c)=>(o.finishTimeSeconds??0)-(c.finishTimeSeconds??0));if(a.length===0)return;const r=[];let s=null;for(const o of a){const c=o.finishTimeSeconds??0;if(r.length===0){r.push(o),s=c;continue}if(s!=null&&c-s<=ya){r.push(o),s=c;continue}break}const n=new Set(r.map(o=>o.rider.id)),i=new Map;for(const o of this.riders)if(o.finishStatus!=="dnf"&&o.finishStatus!=="otl"&&o.finishStatus!=="dns"&&o.finishTimeSeconds!=null&&o.rider.skills.sprint>=73&&o.rider.activeTeamId!=null&&n.has(o.rider.id)){const c=o.rider.activeTeamId,l=i.get(c)??[];l.push(o),i.set(c,l)}for(const[o,c]of i.entries()){if(c.length===0)continue;let l=null,p=Number.NEGATIVE_INFINITY;for(const m of c){const u=this.calculatePreLeadoutFinishScore(m);u>p?(p=u,l=m):u===p&&l!==null&&(m.rider.skills.sprint>l.rider.skills.sprint||m.rider.skills.sprint===l.rider.skills.sprint&&m.rider.id<l.rider.id)&&(l=m)}if(l){const m=this.calculateSprintLeadoutBonusForRider(l);m>0&&(l.leadoutBonus=m,l.photoFinishScore+=m)}}}calculateSprintLeadoutBonusForRider(t){const a=t.rider.activeTeamId;if(a==null)return 0;const r=this.riders.filter(p=>p.rider.activeTeamId===a);if(r.length===0)return 0;let s=this.teamSprintRandomValues.get(a);s===void 0&&(s=de(.25,.6),this.teamSprintRandomValues.set(a,s));let n=this.teamSprintSpecialRandomValues.get(a);n===void 0&&(n=de(.1,.3),this.teamSprintSpecialRandomValues.set(a,n)),t.leadoutRiderId=null;let i=0,o=0,c=null;const l=[];for(const p of r){if(p.rider.id===t.rider.id||p.finishStatus==="dnf"||p.finishStatus==="otl"||p.finishStatus==="dns")continue;let m=0;const u=p.rider.skills.sprint>=72,f=p.rider.skills.flat>=78,g=p.rider.skills.timeTrial>=76,b=p.rider.skills.acceleration>=80;if(u&&m++,f&&m++,g&&m++,b&&m++,m>0){const h=u?s:n;let y=1;m===2?y=1.25:m===3?y=1.5:m===4&&(y=2);const k=h*y*1.5;if(i+=h*y,l.push({riderId:p.rider.id,name:p.riderName,contribution:Number(k.toFixed(2))}),h*y>o)o=h*y,c=p.rider.id;else if(h*y===o&&c!==null){const w=this.riders.find(M=>M.rider.id===c);w&&p.rider.skills.sprint>w.rider.skills.sprint&&(c=p.rider.id)}}}return i>0&&(t.leadoutRiderId=c,t.leadoutContributions=l),i*1.5}resolveFinishMarkerType(){const t=ct(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const r=t[a].marker.type;if(r==="finish_flat"||r==="finish_hill"||r==="finish_mountain")return r}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return dc;case"finish_mountain":return cc;default:return lc}}resolveRiderClockSeconds(t){if(Re(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,r,s=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(c=>c.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){s=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const c=this.riders.find(p=>p.rider.id===o);if(!c||ae(c))continue;if(Math.abs(c.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const p=Ed(c.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(c,p,r,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:s?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:s?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:r,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(r=>r.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+Ka){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const Xc=300;async function Qc(e,t){const a=new xo(e,{maxSubstepSeconds:5});let r=!1;for(;!r;){const s=a.step(Xc);if(r=s.isFinished,t){const n=s.stageDistanceMeters>0?s.leaderDistanceMeters/s.stageDistanceMeters:0,i=e.riders.length>0?s.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const eu=[1,2,5,10,25,50,100,250,500],Yn=new WeakMap;function tu(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Zn(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function au(e){const t=Yn.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${eu.map(r=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return Yn.set(e,a),a}function Jn(e,t){const a=au(e);a.timeField&&(a.timeField.textContent=tu(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${Zn(t.snapshot.leaderDistanceMeters)} / ${Zn(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(r=>{const s=Number(r.dataset.raceSimSpeed);r.classList.toggle("active",s===t.timeMultiplier)})}const ru=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function su(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),r=t%60;return`${a}:${String(r).padStart(2,"0")}`}function la(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function nu(e){return`/jersey/Jer_${e}.png`}function To(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${la(nu(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function iu(e){return e.riderId==null||e.riderTeamId==null?"":To(e.riderTeamId)}function ou(e){const t=la(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function lu(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${la(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${la(e)}</button>`}function du(e,t){if(t==="all")return!0;const a=wo(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function cu(e){const t=e.detail?la(e.detail):"",a=(e.secondaryRiders??[]).map(s=>`${s.riderTeamId!=null?To(s.riderTeamId,"race-sim-message-inline-jersey"):""}${lu(s.riderName,s.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const r=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${r}</span>`}function wo(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function qn(e,t,a="all"){const r=t.filter(n=>du(n,a)),s=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${ru.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${r.length===0?`<div class="race-sim-message-empty">${s}</div>`:r.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${la(wo(n))}">
          <span class="race-sim-message-time">t=${su(n.elapsedSeconds)}</span>
          ${iu(n)}
          <span class="race-sim-message-text">
            ${ou(n)}
            ${cu(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const uu=1,mu={Flat:14,Rolling:15,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:25,High_Mountain:27,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function pu(e){return Math.max(0,Math.round(e))}function Mo(e){return e==="ITT"||e==="TTT"}function gu(e){return mu[e]??20}function fu(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+gu(e)/100))}function hu(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function Xn(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function as(e,t){if(Mo(t))return[...e].sort(hu);const a=[...e].sort((o,c)=>o.stageTimeSeconds-c.stageTimeSeconds||Xn(o,c)),r=[];let s=[],n=null;const i=()=>{r.push(...s.sort(Xn))};for(const o of a){if(s.length===0){s=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=uu){s.push(o),n=o.stageTimeSeconds;continue}i(),s=[o],n=o.stageTimeSeconds}return s.length>0&&i(),r}function ee(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function bu(e){return`/jersey/Jer_${e}.png`}function Na(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${ee(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${ee(bu(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function La(e,t,a){return e==null?`<span class="${a}" title="${ee(t)}">${ee(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${ee(t)}">${ee(t)}</button>`}function yu(e){return e.toFixed(1).replace(".",",")}function Tr(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function vu(e){return`${e??0} Pkt.`}function Su(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function ku(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function Ro(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function $u(e){if(e==null||e<=0)return Ro(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function wt(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function Va(e){return`${e.toFixed(1).replace(".",",")} km`}function Qn(e){return`${e.toFixed(1).replace(".",",")}%`}function Ua(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function ei(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function xu(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function Tu(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function wu(e,t,a){return Array.from({length:t},(r,s)=>e.slice(s*a,(s+1)*a))}function Mu(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const r=wu(e,4,5),s=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${r.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=Tu(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${Na(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${La(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${ee(i.roleLabel)}">${ee(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?s.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${ee(Tr(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${yu(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function wa(e,t){const a=e.riders.find(r=>r.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function zr(e,t){const a=e.riders.find(n=>n.id===t),r=(a==null?void 0:a.activeTeamId)??null,s=r!=null?e.teams.find(n=>n.id===r)??null:null;return{teamId:r,teamName:(s==null?void 0:s.name)??null}}function Ru(e,t,a,r={}){const s=(t??[]).slice(0,r.limit??8);return s.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${s.map(n=>{var m;const i=n.riderId??0,o=zr(e,i),c=wa(e,i),l=((m=r.distanceGapsByRiderId)==null?void 0:m.get(i))??null,p=[r.distanceGapClassName??"",ku(l)].filter(u=>u.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${Na(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${La(n.riderId,c,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${r.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${p}">${ee(Su(l))}</span>`:""}
      </article>`}).join("")}</div>`}function Ya(e,t,a,r,s,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${ee(e)}</h4>
      ${Ru(a,r,s,n)}
    </section>`}function jt(e,t,a,r,s=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${r}" ${s?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${r}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${ee(e)}</span>
      </summary>
      ${t}
    </details>`}function wr(e,t,a,r){const s=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var c;const i=s.get(n.id)??null,o=((c=a.get(n.id))==null?void 0:c[r])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||wa(e,n.riderId).localeCompare(wa(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function ti(e){const t=Iu(e)?e.stagePoints:0;return`${ee(vu("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${ee(t)}</span></span>`:""}`}function Iu(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function ai(e,t){if(t==null)return new Map;const a=e.riders.find(r=>r.riderId===t)??null;return a?new Map(e.riders.map(r=>[r.riderId,a.distanceCoveredMeters-r.distanceCoveredMeters])):new Map}function Cu(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function lr(e,t){var r;const a=(r=e.race.category)==null?void 0:r.bonusSystem;return!a||t==null||t==="Sprint"?[]:wt(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function js(e){var r;const t=(r=e.race.category)==null?void 0:r.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return wt(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return wt(a?t.pointsMountainStage:t.pointsSprintFinish)}function Io(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:wt((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function Fu(e,t,a){let r=null;for(const s of e.stageSummary.segments){const n=Math.max(t,s.start_km),i=Math.min(a,s.end_km),o=Math.max(0,i-n);if(o<=0)continue;const c={lengthKm:o,gradient:s.gradient_percent};(r==null||c.gradient>r.gradient||c.gradient===r.gradient&&c.lengthKm>r.lengthKm)&&(r=c)}return r}function rs(e,t,a,r=null){return e.entries.filter(s=>r==null||r.has(s.riderId)).map((s,n)=>({riderId:s.riderId,rank:s.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:s.crossingTimeSeconds,gapSeconds:s.gapSeconds})).filter(s=>s.points>0)}function Os(e){const t=new Map;for(const a of e)for(const r of a.entries){const s=t.get(r.riderId)??{points:0,mountain:0};r.pointsKind==="mountain"?s.mountain+=r.points:s.points+=r.points,t.set(r.riderId,s)}return t}function Eu(e){return ct(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function Mr(e,t){const a=Mo(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?pu(a):null}function Gr(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=Mr(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const r=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(r)||r<=0)return as(a,e.stage.profile).map(n=>n.rider);const s=fu(e.stage.profile,a.map(n=>n.stageTimeSeconds));return s==null?as(a,e.stage.profile).map(n=>n.rider):as(a.filter(n=>n.stageTimeSeconds<=s),e.stage.profile).map(n=>n.rider)}function Pu(e,t){const a=js(e);return a.length===0?[]:Gr(e,t).map((r,s)=>({riderId:r.riderId,rank:s+1,points:a[s]??0,pointsKind:"points",crossingTimeSeconds:Mr(e,r),gapSeconds:null})).filter(r=>r.points>0)}function Nu(e,t){const a=Gr(e,t).slice(0,20),r=a[0]!=null?Mr(e,a[0])??0:0;return a.map((s,n)=>{const i=Mr(e,s)??0;return{riderId:s.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-r),photoFinishScore:s.photoFinishScore}})}function Lu(e,t){var a;return((a=Gr(e,t)[0])==null?void 0:a.riderId)??null}function Ws(e,t,a){var w,M;const r=ct(e.stageSummary),s=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(Gr(e,a).map(x=>x.riderId)):null,i=r.filter(({marker:x})=>x.type==="climb_start"),o=r.filter(({marker:x})=>Pt(x)).sort((x,E)=>x.kmMark-E.kmMark).map((x,E)=>{var V,X;const I=[...i].reverse().find(J=>J.kmMark<=x.kmMark)??null,F=Cu(e,x.kmMark),R=(I==null?void 0:I.kmMark)??(F==null?void 0:F.start_km)??x.kmMark,N=(I==null?void 0:I.elevation)??(F==null?void 0:F.start_elevation)??x.elevation,P=Math.max(0,x.kmMark-R),B=P>0?(x.elevation-N)/(P*1e3)*100:(F==null?void 0:F.gradient_percent)??0,G=Fu(e,R,x.kmMark),z=t.find(J=>J.markerKey===x.key)??null,C=lr(e,(z==null?void 0:z.markerCategory)??x.marker.cat??null),H=z?rs(z,C,"mountain",n):[],U=(z==null?void 0:z.markerCategory)??x.marker.cat??null;return{key:x.key,title:`${E+1}. Bergwertung`,label:x.label,categoryLabel:U?`Kat. ${U}`:null,categoryClassName:ei(U),kmMark:x.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-x.kmMark),climbLengthKm:P,averageGradient:B,steepestSegmentLengthKm:(G==null?void 0:G.lengthKm)??null,steepestSegmentGradient:(G==null?void 0:G.gradient)??null,highlightMeta:x.kmMark>=s,leaderRiderId:((V=H[0])==null?void 0:V.riderId)??((X=z==null?void 0:z.entries[0])==null?void 0:X.riderId)??null,displayBadges:Ua(C,"mountain"),entries:H,timingEntries:(z==null?void 0:z.entries)??[],accent:"mountain"}}),c=r.filter(({marker:x})=>x.type==="sprint_intermediate").sort((x,E)=>x.kmMark-E.kmMark).map((x,E)=>{var N,P;const I=t.find(B=>B.markerKey===x.key)??null,F=Io(e),R=I?rs(I,F,"points",n):[];return{key:x.key,title:`${E+1}. Zwischensprint`,label:x.label,categoryLabel:null,categoryClassName:null,kmMark:x.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-x.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((N=R[0])==null?void 0:N.riderId)??((P=I==null?void 0:I.entries[0])==null?void 0:P.riderId)??null,displayBadges:Ua(F,"points"),entries:R,timingEntries:(I==null?void 0:I.entries)??[],accent:"sprint"}}),l=Eu(e),p=Pu(e,a),m=l?t.find(x=>x.markerKey===l.key)??null:null,u=m?rs(m,lr(e,m.markerCategory),"mountain",n):[],f=js(e),g=m?lr(e,m.markerCategory):[],b=e.stage.profile==="ITT"||e.stage.profile==="TTT"?Nu(e,a):(m==null?void 0:m.entries)??[],h=((w=p[0])==null?void 0:w.riderId)??((M=u[0])==null?void 0:M.riderId)??Lu(e,a),y={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:m!=null&&m.markerCategory?`Kat. ${m.markerCategory}`:null,categoryClassName:ei((m==null?void 0:m.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(m!=null&&m.markerCategory),leaderRiderId:h,displayBadges:[...Ua(f,"points"),...Ua(g,"mountain")],entries:[...p,...u],timingEntries:b,accent:"finish"};return[...[...c,...o].sort((x,E)=>x.kmMark-E.kmMark||x.title.localeCompare(E.title,"de")),y].filter(x=>x.entries.length>0||x.timingEntries.length>0||x.accent!=="finish"||l!=null||a.isFinished)}function Du(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),r=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,s=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,r):t.entries.slice(0,r).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return s.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${s.map(n=>{const i=zr(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${Na(i.teamId,i.teamName)}
            ${La(n.riderId,wa(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?ee(Ro(n.crossingTimeSeconds)):ee($u(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function ri(e,t){var a;return((a=e==null?void 0:e.find(r=>r.riderId===t))==null?void 0:a.points)??0}function si(e,t){var a;return((a=e.filter(r=>r.riderId!=null&&t.has(r.riderId)).sort((r,s)=>r.rank-s.rank||r.riderId-s.riderId)[0])==null?void 0:a.riderId)??null}function Za(e,t,a){if(!(!t||e.some(r=>r.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function Au(e,t,a,r,s){const n=new Set(e.riderIds),i=new Map(t.riders.map(f=>[f.riderId,f])),c=e.riderIds.map(f=>i.get(f)??null).filter(f=>f!=null).sort((f,g)=>{var b,h;return(((b=a.get(f.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)-(((h=a.get(g.riderId))==null?void 0:h.rank)??Number.MAX_SAFE_INTEGER)||f.riderName.localeCompare(g.riderName,"de")||f.riderId-g.riderId}).slice(0,25),l=i.get(si(r,n)??-1)??null,p=i.get(si(s,n)??-1)??null,m=l!=null&&!c.some(f=>f.riderId===l.riderId),u=p!=null&&!c.some(f=>f.riderId===p.riderId);return c.length>=25&&m&&u&&l.riderId!==p.riderId?(Za(c,l,23),Za(c,p,24),c):(Za(c,l,24),Za(c,p,24),c)}function _u(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function Bu(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function ni(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function Hu(e,t){const a=t.riders.filter(s=>e.riderIds.includes(s.riderId)).reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0),r=Math.max(0,t.leaderDistanceMeters-a);return r>0?`-${Math.round(r)} m`:"—"}function zu(e,t,a,r,s,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=ld(a,r),c=a.find(u=>u.label===o)??a[0],l=new Map(e.gcStandings.map(u=>[u.riderId,u])),p=Os(i),m=Au(c,t,l,s,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${ee(c.label)} <span class="race-sim-group-count">(${c.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${ee(ni(c.previousGapMeters,"-"))}</span>
        <span>Leader ${ee(Hu(c,t))}</span>
        <span>Hinten ${ee(ni(c.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${m.map((u,f)=>{const g=l.get(u.riderId)??null,b=zr(e,u.riderId),h=p.get(u.riderId)??{points:0,mountain:0},y=ri(s,u.riderId),k=ri(n,u.riderId),w=_u(u.riderId,e.classificationLeaders),M=w.length>0?w.map(x=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[x]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${Bu(w)}" title="${ee(M)}">${f+1}.</strong>
              ${Na(b.teamId,b.teamName)}
              <span class="race-sim-classification-main">
                ${La(u.riderId,u.riderName,`race-sim-group-rider-name${u.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${g?g.rank:"—"} · ${ee(g?Tr(g.gapSeconds):"—")} · ${ee(u.gapToLeaderMeters>0?`+${Math.round(u.gapToLeaderMeters)} m`:"—")}</strong>
              </span>
              <span class="race-sim-breakaway-points-panel">
                <span class="race-sim-breakaway-badges">
                  <span class="race-sim-stage-points-header-badge is-points">Sprint ${y}</span>
                  <span class="race-sim-stage-points-header-badge is-mountain">Berg ${k}</span>
                </span>
                <span class="race-sim-breakaway-stage-gains">
                  <span class="race-sim-breakaway-stage-gain">${h.points>0?`▲ +${h.points}`:" "}</span>
                  <span class="race-sim-breakaway-stage-gain">${h.mountain>0?`▲ +${h.mountain}`:" "}</span>
                </span>
              </span>
            </article>`}).join("")}
      </div>
    </section>`}function Gu(e,t,a,r){const s=Ws(t,a.markerClassifications,a),n=Os(s),i=wr(t,t.pointsStandings,n,"points"),o=wr(t,t.mountainStandings,n,"mountain"),c=Ks(Gs(a.clusters));e.innerHTML=zu(t,a,c,r,i,o,s)}function Ku(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function ju(e){const t=ct(e.stageSummary),a=Io(e)[0]??0,r=js(e)[0]??0,s=t.filter(({marker:n})=>Pt(n)).reduce((n,{marker:i})=>n+(lr(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+r,mountain:s}}function ii(e){const t=ju(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function Ou(e){const t=xu(e),a=[`<span class="race-sim-stage-points-meta-pill">${ee(Va(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${ee(`${Va(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${ee(`Länge ${Va(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${ee(`Ø ${Qn(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${ee(`Steilstes ${Va(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${ee(Qn(e.steepestSegmentGradient))}</span>`:""].filter(r=>r.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${ee(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${ee(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${ee(e.label)}">${ee(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((r,s)=>`${s>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${r}`).join("")}
    </span>`}function Wu(e,t,a,r=null){const s=r??Ws(e,t,a);return s.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${ii(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${ii(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${s.map(n=>{const i=n.leaderRiderId!=null?zr(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?wa(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${Ou(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${Ku(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${Na(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?La(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${ee(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${Du(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function Vu(e,t,a,r,s,n=new Set){var f,g;const i=Ws(a,r,s),o=Os(i),c=wr(a,a.pointsStandings,o,"points"),l=wr(a,a.mountainStandings,o,"mountain"),p=ai(s,((f=a.gcStandings[0])==null?void 0:f.riderId)??null),m=ai(s,((g=a.youthStandings[0])==null?void 0:g.riderId)??null),u=b=>!n.has(b);e.innerHTML=`
    ${jt("Stage Favorites",Mu(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",u("favorites"))}
    <section class="race-sim-classifications-section">
      ${jt("GC",Ya("GC","gc",a,a.gcStandings,b=>ee(`GC ${b.rank} · ${Tr(b.gapSeconds)}`),{limit:20,distanceGapsByRiderId:p}),"race-sim-overview-classification race-sim-overview-gc","gc",u("gc"))}
      ${jt("Punktewertung",Ya("Punktewertung","points",a,c,ti),"race-sim-overview-classification race-sim-overview-points","points",u("points"))}
      ${jt("Bergwertung",Ya("Bergwertung","mountain",a,l,ti),"race-sim-overview-classification race-sim-overview-mountain","mountain",u("mountain"))}
      ${jt("Nachwuchsfahrerwertung",Ya("Nachwuchsfahrerwertung","youth",a,a.youthStandings,b=>ee(`${b.rank}. · ${Tr(b.gapSeconds)}`),{distanceGapsByRiderId:m,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",u("youth"))}
    </section>
    ${jt("Etappenwertungen",Wu(a,r,s,i),"race-sim-overview-stage-scoring","stageScoring",u("stageScoring"))}
  `}const oi=new WeakMap,ot=new WeakMap,li=new WeakMap,Co=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function Q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Fo(e){return e<=0?"—":`+${Math.round(e)} m`}function va(e){const t=Co.format(e);return e>0?`+${t}`:t}function ss(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function fe(e){return Co.format(e)}function zt(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Eo(e){return`+${zt(e)}`}function Po(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Vs(e){return`${(e*3.6).toFixed(1)} km/h`}function Uu(e){return`${va(e)}%`}function vs(e){return`${e.toFixed(1).replace(".",",")} km`}function No(e){return`${vs(e.segmentStartKm)} - ${vs(e.segmentEndKm)}`}function Yu(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function Lo(e){return e.replace(/_/g," ")}function Do(e){return Lo(e)}function Zu(e){return Lo(e)}function Ao(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function Ju(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function qu(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function _o(e){return ct(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||Pt(t)).map(({key:t,label:a})=>({key:t,label:a}))}function Xu(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function Qu(e,t,a,r){var s;return a!=="ITT"&&a!=="TTT"?((s=r.get(t))==null?void 0:s.get(e.riderId))??null:e.splitTimes[t]??null}function Bo(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(s=>({label:s.key,displayLabel:s.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${s.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function em(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function tm(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function Ho(e){const t=oi.get(e);if(t)return t;const a=_o(e),r={splitMarkers:a,columns:Bo(e,a,!1),riderById:new Map(e.riders.map(s=>[s.id,s])),teamById:new Map((e.teams??[]).map(s=>[s.id,s])),teamAbbreviationById:new Map((e.teams??[]).map(s=>[s.id,s.abbreviation])),teamNameById:new Map((e.teams??[]).map(s=>[s.id,s.name])),gcByRiderId:new Map((e.gcStandings??[]).map(s=>[s.riderId,s]))};return oi.set(e,r),r}function zo(e,t){const a=e.parentElement,r=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!r)return"";const s=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",r.insertAdjacentElement("beforebegin",l),l})(),n=Us(e),i=em(t),o=tm(i,n),c=ot.get(e);return(c==null?void 0:c.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),s.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,r.innerHTML=t.map(l=>am(l,n)).join(""),ot.set(e,{layoutKey:o,orderedRiderIds:(c==null?void 0:c.orderedRiderIds)??[],rowsByRiderId:(c==null?void 0:c.rowsByRiderId)??new Map,openDetailRiderId:(c==null?void 0:c.openDetailRiderId)??null,openTeamId:(c==null?void 0:c.openTeamId)??null})),o}function mt(e,t){e.textContent!==t&&(e.textContent=t)}function Ja(e,t){e.title!==t&&(e.title=t)}function qa(e,t){e.className!==t&&(e.className=t)}function Xa(e,t,a){return e.lastValues[t]!==a}function Qa(e,t,a){e.lastValues[t]=a}function Us(e){const t=li.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return li.set(e,a),a}function am(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${Q(e.label)}">${Q(a)}</span>`;const r=!t.autoSort&&t.manualSortKey===e.sortKey,s=r?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${r?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${Q(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${Q(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${Q(a)}<span class="race-sim-leaderboard-sort-indicator">${Q(s)}</span></button>`}function rm(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function sm(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function di(e,t,a,r,s,n,i){if(r.autoSort)return(c,l)=>e.stage.profile==="ITT"?Go(c,l,t):lm(c,l);if(!r.manualSortKey)return null;const o=r.manualSortDirection==="asc"?1:-1;return(c,l)=>{if(Be(c)!==Be(l))return Be(c)?1:-1;const p=s.get(c.riderId)??null,m=s.get(l.riderId)??null,u=ci(c,p,r.manualSortKey??"",e,a,n,i),f=ci(l,m,r.manualSortKey??"",e,a,n,i);return sm(u,f)*o||c.riderId-l.riderId}}function nm(e,t,a){if(e.length!==t.size)return!1;let r=null;for(const s of e){const n=t.get(s);if(!n||r&&a(r,n)>0)return!1;r=n}return!0}function ci(e,t,a,r,s,n,i){const o=r.race.isStageRace&&r.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return r.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?Qu(e,a.slice(6),r.stage.profile,s):null}}function im(e,t,a,r,s,n,i,o,c){if(!s.manualSortKey){if(s.autoSort){const u=di(t,a,r,s,n,i,o);return u?[...e].sort(u):[...e]}const m=new Map(s.frozenOrder.map((u,f)=>[u,f]));return[...e].sort((u,f)=>(Be(u)===Be(f)?0:Be(u)?1:-1)||(m.get(u.riderId)??Number.MAX_SAFE_INTEGER)-(m.get(f.riderId)??Number.MAX_SAFE_INTEGER)||u.riderId-f.riderId)}const l=di(t,a,r,s,n,i,o);if(!l)return[...e];const p=new Map(e.map(m=>[m.riderId,m]));return nm(c,p,l)?c.map(m=>p.get(m)).filter(m=>m!=null):[...e].sort(l)}function om(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const p=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(p))return!1;const m=ot.get(e);return m?(m.openTeamId=m.openTeamId===p?null:p,m.openTeamId==null&&(m.openDetailRiderId=null),!0):!1}const r=t.closest("button[data-race-sim-rider-toggle]");if(r){const p=Number(r.dataset.raceSimRiderToggle);if(!Number.isFinite(p))return!1;const m=ot.get(e);return m?(m.openDetailRiderId=m.openDetailRiderId===p?null:p,!0):!1}const s=Us(e);if(t.closest("button[data-race-sim-splits-toggle]"))return s.showSplitColumns=!s.showSplitColumns,!s.showSplitColumns&&((l=s.manualSortKey)!=null&&l.startsWith("split:"))&&(s.manualSortKey=null,s.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return s.autoSort=!s.autoSort,s.autoSort?(s.manualSortKey=null,s.frozenOrder=[]):(s.manualSortKey=null,s.manualSortDirection="asc",s.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(p=>Number(p.dataset.raceSimRiderRow)).filter(p=>Number.isFinite(p))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||s.autoSort)return!1;const c=o.dataset.raceSimSortKey;return c?(s.manualSortKey===c?s.manualSortDirection=s.manualSortDirection==="asc"?"desc":"asc":(s.manualSortKey=c,s.manualSortDirection=rm(c)),s.frozenOrder=[],!0):!1}function ui(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function Be(e){return e.finishStatus==="dnf"}function Go(e,t,a){if(Be(e)!==Be(t))return Be(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const c=a[o];if(!c)continue;const l=e.splitTimes[c.key],p=t.splitTimes[c.key];if(l!=null&&p!=null&&l!==p)return l-p;if(l!=null&&p==null)return-1;if(l==null&&p!=null)return 1}const r=ui(e,a),s=ui(t,a);if(r!==s)return r?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function lm(e,t){return Be(e)!==Be(t)?Be(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function Ko(e,t){const a=(t==null?void 0:t.formBonus)??0,r=(t==null?void 0:t.raceFormBonus)??0,s=((t==null?void 0:t.fatigueMalus)??0)*.5,n=((t==null?void 0:t.longTermFatigueMalus)??0)*.5,i=((t==null?void 0:t.shortTermFatigueMalus)??0)*.5,o=e.teamGroupBonus,c=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,p=e.baseSkill+l+a+r+e.dailyForm+e.microForm+o-s-n-i,m=Math.max(0,p-e.staminaPenalty),u=p-m,f=m-e.effectiveSkill;return[`Basis ${fe(e.baseSkill)}`,e.isAttacking?`+ Attacke ${fe(l)}`:null,`+ S-Form ${fe(a)}`,`+ R-Form ${fe(r)}`,`+ T-Form ${fe(e.dailyForm)}`,`+ Zufällige Form ${fe(c)} (skaliert)`,`+ Teambonus ${fe(o)}`,`- Fatigue ${fe(s)}`,`- Langzeit ${fe(n)}`,`- Akut ${fe(i)}`,`- Stamina ${fe(u)}`,`- HM ${fe(f)}`,`= Effektiv ${fe(e.effectiveSkill)}`].filter(g=>g!=null)}function dm(e,t){return Ko(e,t).join(`
`)}function cm(e){return va(Math.max(-2.5,Math.min(2.5,e*2.5)))}function um(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function jo(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${Q(e.riderName)}">${Q(e.riderName)}</button>`}function mm(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId)??"—",s=a.get(e.activeTeamId)??r;return`<span class="race-sim-team-code" title="${Q(s)}">${Q(r)}</span>`}function Oo(e){return`/jersey/Jer_${e}.png`}function pm(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId);if(!r)return"—";const s=a.get(e.activeTeamId)??r.name,n=Oo(e.activeTeamId);return`
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
    </span>`}function gm(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function fm(e,t,a,r){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=r.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const s=e.splitTimes[t];return s!=null?zt(s):"—"}function Wo(e,t,a){const r=Ko(e,t),s=[{label:"Terrain / Skill",value:`${Do(e.activeTerrain)} / ${Zu(e.skillName)}`},{label:"Aktiver Abschnitt",value:No(e)},{label:"Segmenthöhe",value:Yu(e)},{label:"Basis",value:fe(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${fe(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:va((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:va((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:ss((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:ss((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:ss((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:fe(e.staminaPenalty)},{label:"HM",value:fe(e.elevationPenalty)},{label:"T-Form",value:va(e.dailyForm)},{label:"Zufall",value:cm(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:um(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?Po(a.gapSeconds):"—"}];return`
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
    </section>`}function hm(e,t,a,r,s,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const c=document.createElement("div");c.className="race-sim-row-grid",o.appendChild(c);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",c.appendChild(l);const p=document.createElement("span");p.className="race-sim-row-flag",p.innerHTML=t?id(qu(t)):"—",c.appendChild(p);const m=document.createElement("span");m.className="race-sim-row-name",m.innerHTML=jo(e,a),c.appendChild(m);const u=m.querySelector(".race-sim-row-name-btn");if(!u)throw new Error("race-sim-row-name-btn not found");const f=document.createElement("span");f.className="race-sim-row-team-visual",f.innerHTML=pm(t,s,i),c.appendChild(f);const g=document.createElement("strong");g.className="race-sim-row-team",g.innerHTML=mm(t,n,i),c.appendChild(g);const b=(N="")=>{const P=document.createElement("strong");return N&&(P.className=N),c.appendChild(P),P},h=b("race-sim-gap"),y=b("race-sim-cell-effective-skill"),k=b(),w=b(),M=b(),x=r.map(()=>b()),E=b(),I=b(),F=b("race-sim-form-state-cell"),R=document.createElement("div");return R.className="race-sim-row-detail-popover hidden",o.appendChild(R),{row:o,rankField:l,nameButton:u,gapField:h,clockField:M,splitFields:x,effectiveSkillField:y,gcRankField:k,gcGapField:w,gradientPercentField:E,speedField:I,formStateField:F,detailPanel:R,initialized:!1,lastValues:{}}}function bm(e,t,a,r,s,n,i,o,c,l,p){const m=(r==null?void 0:r.formBonus)??0,u=(r==null?void 0:r.raceFormBonus)??0,f=c&&l>1?p.get(a.riderId)??null:null,g=Be(a),b=i!=="ITT"&&i!=="TTT"?g?"DNF":"—":a.hasStarted?g?"DNF":a.riderClockSeconds!=null?zt(a.riderClockSeconds):"—":Eo(a.startOffsetSeconds);qa(e.row,`race-sim-row${t===1&&!g?" race-sim-row-leader":""}${s?" race-sim-row-detail-open":""}${g?" race-sim-row-dnf":""}`),mt(e.rankField,`${t}.`),mt(e.gapField,g?"DNF":Fo(a.gapToLeaderMeters)),mt(e.clockField,b),e.nameButton.setAttribute("aria-expanded",s?"true":"false"),qa(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),Ja(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((w,M)=>{const x=e.splitFields[M];if(!x)return;const E=fm(a,w.key,i,o);mt(x,E),Ja(x,w.label)}),Xa(e,"effectiveSkillValue",a.effectiveSkill)&&(mt(e.effectiveSkillField,fe(a.effectiveSkill)),Qa(e,"effectiveSkillValue",a.effectiveSkill));const h=`race-sim-cell-effective-skill ${Ao(a)}`;Xa(e,"effectiveSkillClass",h)&&(qa(e.effectiveSkillField,h),Qa(e,"effectiveSkillClass",h));const y=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,m,u,a.dailyForm,a.microForm,(r==null?void 0:r.fatigueMalus)??0,(r==null?void 0:r.longTermFatigueMalus)??0,(r==null?void 0:r.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");Xa(e,"effectiveSkillTitleKey",y)&&(Ja(e.effectiveSkillField,dm(a,r)),Qa(e,"effectiveSkillTitleKey",y)),mt(e.gcRankField,f?String(f.rank):"—"),mt(e.gcGapField,f?Po(f.gapSeconds):"—"),mt(e.gradientPercentField,Uu(a.gradientPercent)),qa(e.gradientPercentField,Ju(a.gradientPercent)),Ja(e.gradientPercentField,`${Do(a.activeTerrain)} · ${No(a)}`),mt(e.speedField,Vs(a.currentSpeedMps)),e.formStateField.innerHTML=gm(a);const k=[s?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,m,u,(r==null?void 0:r.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(f==null?void 0:f.rank)??"—",(f==null?void 0:f.gapSeconds)??"—",a.skillBreakdown].join("|");Xa(e,"detailKey",k)&&(e.detailPanel.innerHTML=s?Wo(a,r,f):"",e.detailPanel.classList.toggle("hidden",!s),Qa(e,"detailKey",k)),e.detailPanel.classList.toggle("hidden",!s),e.initialized=!0}function ym(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${Q(e.name)}">${Q(e.name)}</button>`}function vm(e){const t=Oo(e.id);return`
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
    </span>`}function Sm(e,t,a){const r=new Map;for(const s of e.riders){const n=a.get(s.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=r.get(i)??[];o.push(s),r.set(i,o)}return t.teams.filter(s=>r.has(s.id)).map(s=>{const n=(r.get(s.id)??[]).slice().sort((p,m)=>m.effectiveSkill-p.effectiveSkill||p.riderId-m.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),c=n.slice(0,o).reduce((p,m)=>p+m.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:s,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,c-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(p=>p.isFinished).length}}).sort((s,n)=>Go(s.representative,n.representative,_o(t))||s.team.id-n.team.id)}function km(e,t,a,r,s){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${Q(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${Q(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${Q(fe(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${Q(Vs(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${Q(e.teamClockSeconds!=null?zt(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${Q(vs(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&r>1?t.gcByRiderId.get(n.riderId)??null:null,c=s===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${jo(n,c)}
                <strong>${Q(fe(n.effectiveSkill))}</strong>
                <span>${Q(n.riderClockSeconds!=null?zt(n.riderClockSeconds):"—")}</span>
              </div>
              ${c?Wo(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function $m(e,t,a){var f,g;const r=performance.now(),s=Ho(a),n=s.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(b=>({label:b.key,displayLabel:b.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(f=ot.get(e))==null?void 0:f.layoutKey,c=zo(e,i),l=ot.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==c&&(e.innerHTML="");const p=Sm(t,a,s.riderById),m=((g=p[0])==null?void 0:g.teamDistanceMeters)??0;return e.innerHTML=p.map((b,h)=>{const y=l.openTeamId===b.team.id;return`
      <article class="race-sim-row${h===0?" race-sim-row-leader":""}${y?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${h+1}.</strong>
          <span class="race-sim-row-name">${ym(b.team,y)}</span>
          <span class="race-sim-row-team-visual">${vm(b.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${Q(b.team.name)}">${Q(b.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${Q(Fo(Math.max(0,m-b.teamDistanceMeters)))}</strong>
          <strong>${Q(b.teamClockSeconds!=null?zt(b.teamClockSeconds):Eo(b.representative.startOffsetSeconds))}</strong>
          ${n.map(k=>`<strong>${Q(b.splitTimes[k.key]!=null?zt(b.splitTimes[k.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${Ao(b.representative)}">${Q(fe(b.teamEffectiveSkill))}</strong>
          <strong>${Q(Vs(b.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${y?"":" hidden"}">${y?km(b,s,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),ot.set(e,{layoutKey:c,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-r,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:p.length,rowsCreated:p.length,rowsRemoved:0,rowsUpdated:p.length,rowsSkippedInvisible:0,orderChanged:1}}function mi(e,t,a){if(a.stage.profile==="TTT")return $m(e,t,a);const r=performance.now(),s={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=Ho(a),{splitMarkers:o}=i,c=Xu(t),l=Us(e),p=l.showSplitColumns?o:[],m=ot.get(e);s.prepMs=performance.now()-n;const u=performance.now(),f=im(t.riders,a,o,c,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(m==null?void 0:m.orderedRiderIds)??[]);s.sortMs=performance.now()-u;const g=m==null?void 0:m.layoutKey,b=performance.now(),h=zo(e,Bo(a,p,l.showSplitColumns));s.layoutMs=performance.now()-b;const y=ot.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};g!=null&&g!==h&&(e.innerHTML="",y.rowsByRiderId.clear(),y.orderedRiderIds=[]);const k=f.map(R=>R.riderId),w=new Set(k),M=performance.now();for(const[R,N]of y.rowsByRiderId)w.has(R)||(N.row.remove(),y.rowsByRiderId.delete(R),s.rowsRemoved+=1);s.removeRowsMs=performance.now()-M;const x=performance.now();for(let R=0;R<f.length;R+=1){const N=f[R],P=i.riderById.get(N.riderId)??null;let B=y.rowsByRiderId.get(N.riderId);B||(B=hm(N,P,y.openDetailRiderId===N.riderId,p,i.teamById,i.teamAbbreviationById,i.teamNameById),y.rowsByRiderId.set(N.riderId,B),s.rowsCreated+=1)}s.createRowsMs=performance.now()-x;const E=performance.now(),I=y.orderedRiderIds.length===k.length&&y.orderedRiderIds.every((R,N)=>R===k[N]);s.orderCheckMs=performance.now()-E;const F=performance.now();if(!I){const R=document.createDocumentFragment();for(const N of k){const P=y.rowsByRiderId.get(N);P&&R.appendChild(P.row)}e.replaceChildren(R),s.orderChanged=1}s.reorderMs=performance.now()-F;for(let R=0;R<f.length;R+=1){const N=f[R],P=y.rowsByRiderId.get(N.riderId),B=i.riderById.get(N.riderId)??null;if(!P)continue;const G=performance.now();bm(P,R+1,N,B,y.openDetailRiderId===N.riderId,p,a.stage.profile,c,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),s.updateRowsMs+=performance.now()-G,s.rowsUpdated+=1}return ot.set(e,{layoutKey:h,orderedRiderIds:k,rowsByRiderId:y.rowsByRiderId,openDetailRiderId:y.openDetailRiderId,openTeamId:y.openTeamId}),s.finalizeMs=performance.now()-(r+s.prepMs+s.sortMs+s.layoutMs+s.removeRowsMs+s.createRowsMs+s.orderCheckMs+s.reorderMs+s.visibilityMs+s.updateRowsMs),s.totalMs=performance.now()-r,s.finalizeMs=Math.max(0,s.totalMs-s.prepMs-s.sortMs-s.layoutMs-s.removeRowsMs-s.createRowsMs-s.orderCheckMs-s.reorderMs-s.visibilityMs-s.updateRowsMs),s}const xm=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],Tm=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],Vo=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],Uo=["Sprint","4","3","2","1","HC"],Rr=.2,wm=7,Mm=100,Rm=3,Im=50,Cm=-2,Fm=1,Em=2.5,Pm=-3,Nm=15,Lm=200,Dm=600,Am=850;function je(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function Ir(e){return e==="finish_hill"||e==="finish_mountain"}function Cr(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function Kr(e,t){return e==="climb_top"||Ir(e)&&Cr(t)}function Da(e){return Math.round(e*10)/10}function He(e){return Number(e.toFixed(2))}function Mt(e){return`${e.toFixed(2).replace(".",",")} km`}function Yo(e){return`${Math.round(e)} hm`}function _m(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function Ys(e){return xm.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function Bm(e){return Tm.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function Hm(e,t="start",a=0,r=1){const s=Vo.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:je(i)?a===r-1:i==="climb_top"||i==="sprint_intermediate");return(s.includes(e)?s:[e,...s.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${S(i)}</option>`).join("")}function zm(e){return['<option value="">–</option>',...Uo.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`)].join("")}function pi(e){return Vo.indexOf(e)}function tt(e){return[...e].sort((t,a)=>pi(t.type)-pi(a.type))}function Ma(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:tt(e[0].markers)}];let a=0;return e.forEach(r=>{a=He(a+r.lengthKm);const s=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),n=t[t.length-1];n.terrain=r.terrain,n.techLevel=r.techLevel,n.windExp=r.windExp,n.markers=tt([...n.markers,...r.markers]),t.push({kmMark:a,elevation:s,terrain:r.terrain,techLevel:r.techLevel,windExp:r.windExp,markers:tt(r.endMarkers)})}),t}function Gm(e){return e?" stage-editor-input-invalid":""}function Zs(e,t){const a=e.segments[t];if(!a)return[];const r=[],s=Km(e).get(t)??[];return a.lengthKm<Rr&&r.push(`Laenge unter ${Rr.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&r.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&r.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&r.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>je(n.type))&&r.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&r.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>je(n.type))&&r.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{je(n.type)&&r.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&r.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&r.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&r.push(`${n.type} gehoert in den Startmarker-Slot.`),Kr(n.type,n.cat)&&!Cr(n.cat)&&r.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&r.push("Sprintmarker erlaubt nur Kategorie Sprint."),je(n.type)&&!Ir(n.type)&&n.cat!=null&&r.push("finish_flat und finish_TT duerfen keine Kategorie haben."),Ir(n.type)&&n.cat!=null&&!Cr(n.cat)&&r.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),r.push(...s),[...new Set(r)]}function Km(e){const t=new Map,a=[],r=(s,n)=>{const i=t.get(s)??[];i.push(n),t.set(s,i)};return e.segments.forEach((s,n)=>{s.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),s.endMarkers.forEach(i=>{var l;if(!Kr(i.type,i.cat))return;if(!i.name){r(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let p=a.length-1;p>=0;p-=1)if(((l=a[p])==null?void 0:l.name)===i.name){o=p;break}const c=o>=0?o:a.length-1;if(c<0){r(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(c,1)})}),a.forEach(s=>{const n=s.name?` "${s.name}"`:"";r(s.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function jm(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:Ir(e.type)?{...e,cat:Cr(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function Zo(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:Om(e.waypoints??[])).map(r=>({...r,startElevation:Math.round(r.startElevation),lengthKm:Number.isFinite(r.lengthKm)?He(r.lengthKm):Rr,gradientPercent:Number.isFinite(r.gradientPercent)?Da(r.gradientPercent):0,techLevel:Number.isFinite(r.techLevel)?r.techLevel:5,windExp:Number.isFinite(r.windExp)?r.windExp:5,markers:gi(r.markers),endMarkers:gi(r.endMarkers)})),waypoints:[]};return Nt(t),t}function Om(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const r=e[a],s=e[a+1],n=He(s.kmMark-r.kmMark),i=s.elevation-r.elevation,o=Da(n>0?i/(n*10):0);t.push({startElevation:r.elevation,lengthKm:n,gradientPercent:o,techLevel:r.techLevel??5,windExp:r.windExp??5,terrain:r.terrain??"Flat",markers:r.markers??[],endMarkers:s.markers??[]})}return t}function gi(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function Wm(e,t,a){const r=e*a*8+t/12;return r>=95?"HC":r>=68?"1":r>=46?"2":r>=28?"3":"4"}function fi(e){const t=[];let a=null,r=null,s=0;const n=i=>{if(a==null||i==null||i<=a){a=null,r=null,s=0;return}const o=e[a],c=e[i],l=c.kmMark-o.kmMark,p=Math.max(0,c.elevation-o.elevation),m=l>0?p/(l*10):0;p>=Mm&&m>=Rm&&t.push({startKm:He(o.kmMark),endKm:He(c.kmMark),distanceKm:He(l),gainMeters:Math.round(p),avgGradient:Da(m),category:Wm(l,p,m),startIndex:a,topIndex:i,topElevation:Math.round(c.elevation)}),a=null,r=null,s=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],c=e[i],l=c.elevation-o.elevation;if(a==null&&l>0){a=i-1,r=i,s=0;continue}if(a!=null){if(l>=0){(r==null||c.elevation>=e[r].elevation)&&(r=i),s=0;continue}s+=Math.abs(l),s>=Im&&n(r)}}return n(r),t}function Vm(e){const t=e.segments.some(s=>s.terrain==="Cobble_Hill"),a=e.segments.some(s=>s.terrain==="Cobble"),r=e.climbs.some(s=>s.category==="HC"||s.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":r&&e.elevationGainMeters>=2800?"High_Mountain":r||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function er(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function Um(e){return e.gainMeters>=Dm&&e.topElevation>=Am?"Mountain":e.gainMeters>Lm?"Medium_Mountain":"Hill"}function Ym(e){return e.gradientPercent<Pm?"Abfahrt":e.gradientPercent<Em||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<Nm?"Flat":"Hill"}function Zm(e){if(e.segments.length===0)return;if(e.waypoints=Ma(e.segments),e.sourceFormat==="csv"){const i=fi(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:c,topElevation:l,...p})=>p);return}const t=e.segments.map(i=>i.manualTerrain||er(i.terrain)?i.terrain:Ym(i)),a=fi(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:c,...l})=>l),a.forEach(i=>{const o=Um(i);if(o)for(let c=i.startIndex;c<i.topIndex;c+=1)e.segments[c].manualTerrain||er(t[c])||(t[c]=o)});let r=null,s=0;const n=i=>{if(r==null||s<=Fm){r=null,s=0;return}for(let o=r;o<i;o+=1)!(e.segments[o].manualTerrain||er(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");r=null,s=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<Cm){r==null&&(r=i),s+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{er(i.terrain)||(i.terrain=t[o])}),e.waypoints=Ma(e.segments),e.suggestedProfile=Vm(e)}function Nt(e){Jm(e),hi(e),Zm(e),e.waypoints=Ma(e.segments),hi(e)}function Jm(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,r)=>{const s={...a,startElevation:Math.round(r===0?a.startElevation:t),lengthKm:He(a.lengthKm),gradientPercent:Da(a.gradientPercent),markers:tt(a.markers),endMarkers:tt(a.endMarkers)};return t=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),s}),e.waypoints=Ma(e.segments)}function hi(e){e.totalDistanceKm=He(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,r)=>{if(r===0)return 0;const s=a.elevation-e.waypoints[r-1].elevation;return t+Math.max(0,s)},0)}function vt(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(r=>r.type==="start")||(t.markers=tt([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(r=>je(r.type))||(a.endMarkers=tt([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=Ma(e.segments))}function qm(e,t,a,r){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((s,n)=>{const i=r==="start"&&t===0&&s.type==="start",o=e.filter(p=>je(p.type)).length,c=r==="end"&&t===a-1&&je(s.type)&&o===1,l=!(i||c);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${r}" data-marker-index="${n}">${Hm(s.type,r,t,a)}</select>
        <input type="text" value="${S(s.name??"")}" data-field="markerName" data-marker-scope="${r}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${r}" data-marker-index="${n}">${zm(s.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${r}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function bi(e,t,a,r){const s=r==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${qm(e,t,a,r)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${r}" data-segment-index="${t}">${s}</button>
    </div>`}function Xm(e,t,a,r,s){if(!d.stageEditorDraft)return;const n=d.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(r==="markerType"){o.type=s;const c=jm(o);if(o.name=c.name,o.cat=c.cat,je(o.type)){const l=i.filter((p,m)=>m===t||!je(p.type));a==="start"?n.markers=l:n.endMarkers=l}}else r==="markerName"?o.name=s.trim()||null:r==="markerCat"&&(o.cat=s||null);a==="start"?n.markers=tt(n.markers):n.endMarkers=tt(n.endMarkers),Nt(d.stageEditorDraft),vt(d.stageEditorDraft),he()}}function Qm(e,t){if(!d.stageEditorDraft)return;const a=d.stageEditorDraft.segments[e];if(!a)return;const r=t==="start"?e===0&&!a.markers.some(s=>s.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===d.stageEditorDraft.segments.length-1&&!a.endMarkers.some(s=>je(s.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(r),a.markers=tt(a.markers)):(a.endMarkers.push(r),a.endMarkers=tt(a.endMarkers)),Nt(d.stageEditorDraft),vt(d.stageEditorDraft),he()}function ep(e,t,a){if(!d.stageEditorDraft)return;const r=d.stageEditorDraft.segments[e];r&&(a==="start"?r.markers.splice(t,1):r.endMarkers.splice(t,1),Nt(d.stageEditorDraft),vt(d.stageEditorDraft),he())}let ea=0,ta=0;async function tp(){v("stage-editor-profile").innerHTML=Ys("Flat"),v("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',v("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([Y.listStageEditorCountries(),Y.listStageEditorRaceCategories(),Y.listStageEditorRacePrograms(),Xs()]);if(e.success&&e.data){const r=v("stage-editor-race-country");r.innerHTML=e.data.map(s=>`<option value="${s.id}">${S(s.name)} (${S(s.code3)})</option>`).join("")}if(t.success&&t.data){const r=v("stage-editor-race-category");r.innerHTML=t.data.map(s=>`<option value="${s.id}">${S(s.name)}</option>`).join("")}a.success&&a.data&&(d.stageEditorPrograms=a.data,ap())}function ap(){const e=v("stage-editor-programs-list");d.stageEditorPrograms&&(e.innerHTML=d.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${S(t.name)}</span>
      </label>
    `).join(""))}function rp(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=v("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(r=>{var n;const s=(n=d.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===r.value);return s?s.name:r.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function sp(e,t){var r;let a=0;for(let s=0;s<t;s+=1)a+=((r=e.segments[s])==null?void 0:r.lengthKm)??0;return He(a)}function Js(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function Jo(){const e=d.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function np(){const e=[...d.stageEditorExistingStages.map(t=>t.raceId),...d.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function ip(e,t){let a=e;const r=new Set(d.stageEditorExistingStages.map(s=>s.stageId));for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function op(e,t){let a=e;const r=new Set([...d.stageEditorExistingStages.map(s=>s.raceId),...d.races.map(s=>s.id)]);for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function Zt(){const e=v("stage-editor-date");if(!e)return;const t=e.value.trim();if(!/^\d{4}-\d{2}-\d{2}$/.test(t))return;const a=document.getElementById("stage-editor-new-race-checkbox");if(!a||!a.checked)return;const r=document.getElementById("stage-editor-race-is-stage-race");if(!r)return;const s=Number(r.value)===1,n=v("stage-editor-race-start-date"),i=v("stage-editor-race-end-date");if(!(!n||!i))if(!s)n.value=t,i.value=t;else{n.value=t;const o=document.getElementById("stage-editor-race-num-stages"),c=o&&Number(o.value)||1,[l,p,m]=t.split("-").map(Number),u=new Date(l,p-1,m);let f=0;c===21?f=2:c>=14&&(f=1);const g=c+f;u.setDate(u.getDate()+g-1);const b=u.getFullYear(),h=String(u.getMonth()+1).padStart(2,"0"),y=String(u.getDate()).padStart(2,"0");i.value=`${b}-${h}-${y}`}}function lp(e){var o;const t=v("stage-editor-profile");t.innerHTML=Ys(e.suggestedProfile),t.value=e.suggestedProfile;const a=Jo(),r=np();v("stage-editor-stage-id").value=String(a),v("stage-editor-race-id").value=String(r),ea=a,ta=r;const s=v("stage-editor-details-file");s.value.trim()||(s.value=`${_m(e.routeName)}.csv`);const n=v("stage-editor-date");!n.value&&((o=d.gameState)!=null&&o.currentDate)&&(n.value=d.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(c=>{c.checked=!0}),Zt()}function dp(e){v("stage-editor-stage-id").value=String(e.stageId),v("stage-editor-race-id").value=String(e.raceId),ea=e.stageId,ta=e.raceId,v("stage-editor-stage-number").value=String(e.stageNumber),v("stage-editor-date").value=e.date,v("stage-editor-details-file").value=e.detailsCsvFile;const t=v("stage-editor-profile");t.innerHTML=Ys(e.profile),t.value=e.profile,v("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),v("stage-editor-final-push-start").value=String(e.finalPushStartPercent),v("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),v("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),v("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(s=>s.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(s=>{s.checked=a.includes(s.value)}),Zt()}function qo(e){var r;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((r=e.segments[0])!=null&&r.markers.some(s=>s.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(s=>je(s.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((s,n)=>{Zs(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...s.markers??[],...s.endMarkers??[]].forEach(i=>{i.cat!=null&&!Uo.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function Xo(){const e=[],t=Number(v("stage-editor-stage-id").value),a=Number(v("stage-editor-race-id").value),r=Number(v("stage-editor-stage-number").value),s=v("stage-editor-date").value.trim(),n=v("stage-editor-details-file").value.trim(),i=Number(v("stage-editor-final-spread-start").value),o=Number(v("stage-editor-final-push-start").value),c=Number(v("stage-editor-final-spread-difficulty").value),l=Number(v("stage-editor-crash-multiplier").value),p=Number(v("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(r)||r<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(s)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(c)||c<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(p)||p<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),d.stageEditorExistingStages.map(h=>h.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const f=v("stage-editor-new-race-checkbox").checked,g=[...d.stageEditorExistingStages.map(h=>h.raceId),...d.races.map(h=>h.id)];if(f){g.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const h=v("stage-editor-race-name").value.trim(),y=Number(v("stage-editor-race-country").value),k=Number(v("stage-editor-race-category").value),w=Number(v("stage-editor-race-num-stages").value),M=v("stage-editor-race-start-date").value.trim(),x=v("stage-editor-race-end-date").value.trim(),E=Number(v("stage-editor-race-prestige").value);h||e.push("Rennname fehlt."),(!Number.isInteger(y)||y<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger(k)||k<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(w)||w<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(M)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test(x)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(E)||E<1||E>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else g.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return v("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function cp(){var a,r;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(s=>s.value).join("|");return{stageId:Number(v("stage-editor-stage-id").value),raceId:Number(v("stage-editor-race-id").value),stageNumber:Number(v("stage-editor-stage-number").value),date:v("stage-editor-date").value.trim(),profile:v("stage-editor-profile").value,detailsCsvFile:v("stage-editor-details-file").value.trim(),startElevation:((r=(a=d.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:r.startElevation)??0,finalSpreadStartPercent:Number(v("stage-editor-final-spread-start").value),finalPushStartPercent:Number(v("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(v("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(v("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(v("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function up(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function mp(e){return["gainMeters","elevationAtTop","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function jr(e,t,a){const s=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-s*118),i=54,o=.14+s*.12,c=.26+s*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${c};`}">${Math.round(e)}</span>`}function qs(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),r=Math.round(40-t*22),s=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${s};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function pp(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function gp(e,t,a,r){const s=r!=null?` data-stage-profile-open-climb-id="${S(r)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${s}>${e}</button>`}function fp(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",r=e.profileScore??e.score,s=[...d.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=s.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span class="text-right">${qs(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${jr(r,0,100)}
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
    </div>`}function hp(e){const t=s=>s!=null?`${s.toFixed(1).replace(".",",")} km`:"—",a=s=>s!=null?`${Math.round(s).toLocaleString("de-DE")} m`:"—",r=s=>s!=null?`${s.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${qs(e.climbScore??0)}
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
    </div>`}function Qo(e,t,a,r,s,n,i,o){const c=o??jr(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${gp(c,r,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${s}
      </div>
    </div>`}function ue(e,t,a,r,s){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?r==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${s}-sort="${t}">
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function ga(){const e=v("stage-editor-stages-table"),t=v("stage-editor-stages-empty"),a=v("stage-editor-stages-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=d.stageEditorStagesSort.key,i=d.stageEditorStagesSort.direction;r&&(r.innerHTML=`<tr>
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
    </tr>`);const o=bp(d.stageEditorStageRows);s.innerHTML=o.map(c=>`
    <tr>
      <td>${c.stageId}</td>
      <td>${le(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(_a({stageNumber:c.stageNumber}))}</strong></td>
      <td>${Qo(c.profileScore,0,100,c.stageId,fp(c),Yr({name:c.raceName},{stageNumber:c.stageNumber,profile:c.profile}))}</td>
      <td>${Ba(c.profile)}</td>
      <td>${Mt(c.distanceKm)}</td>
      <td>${Yo(c.elevationGainMeters)}</td>
      <td>${c.sprintCount} Sprints</td>
      <td>${c.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${d.stageEditorStageRows.length} vorhandene Etappen`}function fa(){const e=v("stage-editor-climbs-table"),t=v("stage-editor-climbs-empty"),a=v("stage-editor-climbs-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=d.stageEditorClimbsSort.key,i=d.stageEditorClimbsSort.direction;r&&(r.innerHTML=`<tr>
      ${ue("km","placementKm",n,i,"climbs")}
      ${ue("Name","name",n,i,"climbs")}
      ${ue("Kat.","category",n,i,"climbs")}
      ${ue("Score","climbScore",n,i,"climbs")}
      ${ue("Land","countryCode",n,i,"climbs")}
      ${ue("Rennen","raceName",n,i,"climbs")}
      ${ue("Etappe","stageNumber",n,i,"climbs")}
      ${ue("Höhenmeter","gainMeters",n,i,"climbs")}
      ${ue("Höhe (Top)","elevationAtTop",n,i,"climbs")}
      ${ue("Distanz","distanceKm",n,i,"climbs")}
      ${ue("Ø Steigung","avgGradient",n,i,"climbs")}
      ${ue("Max Steigung","maxGradient",n,i,"climbs")}
    </tr>`);const o=yp(d.stageEditorClimbRows);s.innerHTML=o.map(c=>`
    <tr>
      <td>${c.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${S(c.name)}</strong></td>
      <td>${pp(c.category)}</td>
      <td>${Qo(c.climbScore,0,350,c.stageId,hp(c),Yr({name:c.raceName},{stageNumber:c.stageNumber,profile:"Mountain"}),c.id,qs(c.climbScore))}</td>
      <td>${le(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(_a({stageNumber:c.stageNumber}))}</strong></td>
      <td>${Yo(c.gainMeters)}</td>
      <td>${Math.round(c.elevationAtTop).toLocaleString("de-DE")} m</td>
      <td>${Mt(c.distanceKm)}</td>
      <td>${c.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${c.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${d.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function el(e=!1){if(d.stageEditorOverviewLoaded&&!e){ga(),fa();return}d.stageEditorOverviewLoading=!0,ga(),fa();const t=await Y.getStageEditorOverview();if(d.stageEditorOverviewLoading=!1,d.stageEditorOverviewLoaded=!0,!t.success||!t.data){d.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),ga(),fa();return}d.stageEditorStageRows=t.data.stages,d.stageEditorClimbRows=t.data.climbs,ga(),fa()}async function Xs(e=!1){const t=v("stage-editor-existing-stage-wrap");if(d.stageEditorExistingStagesLoaded&&!e){Ss();return}t.classList.add("loading");const a=v("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const r=await Y.listStageEditorStages();if(t.classList.remove("loading"),d.stageEditorExistingStagesLoaded=!0,!r.success||!r.data){d.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}d.stageEditorExistingStages=r.data.stages,Ss()}function Ss(){const e=v("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+d.stageEditorExistingStages.map(a=>{const r=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${S(a.raceName)} · Etappe ${a.stageNumber}${r}</option>`}).join("")}function bp(e){const t=d.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(d.stageEditorStagesSort.key){case"stageId":s=a.stageId-r.stageId;break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"profile":s=a.profile.localeCompare(r.profile,"de");break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"elevationGainMeters":s=a.elevationGainMeters-r.elevationGainMeters;break;case"sprintCount":s=a.sprintCount-r.sprintCount;break;case"climbCount":s=a.climbCount-r.climbCount;break;case"profileScore":s=a.profileScore-r.profileScore;break}return s*t||a.stageId-r.stageId})}function yp(e){const t=d.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(d.stageEditorClimbsSort.key){case"placementKm":s=a.placementKm-r.placementKm;break;case"name":s=a.name.localeCompare(r.name,"de");break;case"category":s=(a.category??"").localeCompare(r.category??"","de");break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"gainMeters":s=a.gainMeters-r.gainMeters;break;case"elevationAtTop":s=a.elevationAtTop-r.elevationAtTop;break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"avgGradient":s=a.avgGradient-r.avgGradient;break;case"maxGradient":s=a.maxGradient-r.maxGradient;break;case"climbScore":s=a.climbScore-r.climbScore;break}return s*t||a.placementKm-r.placementKm})}function vp(e){return e.map(t=>t.type).join(" | ")}function Sp(e){const t=[],a=[];let r=0;return e.segments.forEach((s,n)=>{const i=r,o=He(i+s.lengthKm),c=Js(s);s.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:s.startElevation})}),s.endMarkers.forEach(l=>{if(Kr(l.type,l.cat)&&l.name){let p=-1;for(let m=a.length-1;m>=0;m--)if(a[m].name===l.name){p=m;break}if(p>=0){const m=a[p];a.splice(p,1);const u=He(o-m.startKm),f=Math.max(0,c-m.startElevation),g=u>0?Da(f/(u*10)):0;t.push({name:l.name,startKm:m.startKm,endKm:o,distanceKm:u,gainMeters:f,avgGradient:g,category:l.cat||"4"})}}}),r=o}),t}function kp(e){const t=[];let a=0;return e.segments.forEach(r=>{const s=He(a+r.lengthKm);r.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:s})}),a=s}),t}function $p(e){const t=new Set,a=[];let r=0;return e.segments.forEach((s,n)=>{const o=He(r+s.lengthKm);s.markers.forEach(c=>{c.type==="climb_start"&&c.name&&a.push({name:c.name,segmentIndex:n})}),a.length>0&&t.add(n),s.endMarkers.forEach(c=>{if(Kr(c.type,c.cat)&&c.name){let l=-1;for(let p=a.length-1;p>=0;p--)if(a[p].name===c.name){l=p;break}l>=0&&a.splice(l,1)}}),r=o}),t}function xp(e,t,a){const r=e.segments[t];if(!r||a.has(t)||r.markers.length>0||r.endMarkers.length>0)return!1;const s=r.terrain==="Flat"&&r.gradientPercent>=-3&&r.gradientPercent<=1.5,n=r.terrain==="Abfahrt"&&r.gradientPercent<=-3;return s||n}function he(){Ss();const e=d.stageEditorDraft,t=v("stage-editor-import-summary"),a=v("stage-editor-warnings"),r=v("stage-editor-climbs"),s=v("stage-editor-empty"),n=v("stage-editor-chart"),i=v("stage-editor-waypoints-body"),o=v("stage-editor-export-hint"),c=v("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",r.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',s.classList.remove("hidden"),n.innerHTML=yi(null),i.innerHTML=`<tr><td colspan="${wm}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",c.disabled=!0;return}s.classList.add("hidden");const l=qo(e),p=Xo(),m=document.getElementById("stage-editor-profile"),u=m&&m.value?m.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${S(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${Mt(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${S(u)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const f=[...e.warnings,...l,...p];a.innerHTML=f.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':f.map(w=>`<div class="stage-editor-alert">${S(w)}</div>`).join("");const g=Sp(e),b=kp(e);let h="";g.length>0?h+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (${g.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${g.map(w=>`
          <div class="stage-editor-climb" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="color: #fff; font-size: 0.85rem;">${S(w.name)}</strong>
              <span class="stage-editor-climb-category-badge ${w.category==="HC"?"is-hc":`is-cat-${w.category}`}" style="font-size: 0.7rem; padding: 0.1rem 0.35rem;">
                Kat. ${S(w.category)}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-300); display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span>${Mt(w.startKm)} - ${Mt(w.endKm)}</span>
              <span>·</span>
              <span><strong>${w.distanceKm.toFixed(1).replace(".",",")} km</strong></span>
              <span>·</span>
              <span><strong>${w.gainMeters} hm</strong></span>
              <span>·</span>
              <span><strong>${w.avgGradient.toFixed(1).replace(".",",")}%</strong></span>
            </div>
          </div>
        `).join("")}
      </div>
    `:h+=`
      <div style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--accent-h);">
        Bergwertungen (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Bergwertungen definiert (climb_start und climb_top Marker mit gleichem Namen paaren).</p>
    `,b.length>0?h+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (${b.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${b.map(w=>`
          <div class="stage-editor-sprint" style="padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border-left: 3px solid var(--success); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.85rem;">${S(w.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-300); font-weight: bold;">
              ${Mt(w.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:h+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `;const y=v("stage-editor-hide-boring-segments-checkbox");y&&(y.checked=d.stageEditorHideBoringSegments),r.innerHTML=h,n.innerHTML=yi(e);const k=$p(e);i.innerHTML=e.segments.map((w,M)=>{const x=d.stageEditorHideBoringSegments&&xp(e,M,k);return`
    <tr data-segment-index="${M}" class="${Zs(e,M).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;${x?" display: none;":""}">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${M+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${w.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${Gm(w.lengthKm<Rr)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${w.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${Bm(w.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${bi(w.markers,M,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${bi(w.endMarkers,M,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div style="display: flex; flex-direction: column; min-width: 3.5rem; justify-content: center; line-height: 1.2;">
            <span class="text-muted" style="font-size: 0.85rem;">${Js(w)} m</span>
            <span style="font-size: 0.7rem; color: #888; font-weight: normal;">${Mt(sp(e,M)+w.lengthKm)}</span>
          </div>
          ${Tp(e,M)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${M}">+</button>
          ${M===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${M}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${M}">✕</button>`:""}
        </div>
      </td>
    </tr>`}).join(""),c.disabled=f.length>0,o.textContent=f.length>0?`${f.length} Validierungshinweise vor dem Export.`:`Exportiert ${v("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function Tp(e,t){const a=Zs(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(r=>`<div>${S(r)}</div>`).join("")}</div>`}function yi(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,r=24,s=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(g=>g.elevation)),c=Math.max(...n.map(g=>g.elevation)),l=Math.max(1,c-o),p=n.map(g=>{const b=r+g.kmMark/Math.max(i,.1)*(t-r*2),h=a-s-(g.elevation-o)/l*(a-s*2);return{x:b,y:h,waypoint:g}}),m=p.map((g,b)=>`${b===0?"M":"L"} ${g.x.toFixed(1)} ${g.y.toFixed(1)}`).join(" "),u=`${m} L ${(t-r).toFixed(1)} ${(a-s).toFixed(1)} L ${r.toFixed(1)} ${(a-s).toFixed(1)} Z`,f=p.filter(g=>g.waypoint.markers.length>0).map(g=>`
      <line x1="${g.x.toFixed(1)}" y1="${s}" x2="${g.x.toFixed(1)}" y2="${(a-s).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${g.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${S(vp(g.waypoint.markers))}</text>`).join("");return`
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
      <text x="${t-r}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${Mt(i)}</text>
    </svg>`}function wp(e,t,a){const r=d.stageEditorDraft;if(!r)return;const s=r.segments[e];s&&(t==="startElevation"?s.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?s.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?s.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(s.terrain=a,s.manualTerrain=!0):t==="techLevel"?s.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(s.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),Nt(r),vt(r),he())}function Mp(e){const t=d.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const r={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,r),Nt(t),vt(t),he()}function Rp(){const e=d.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],r={startElevation:t?Js(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(r),Nt(e),vt(e),he()}function Ip(e){const t=d.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),Nt(t),vt(t),he()))}async function Cp(){var a;const t=(a=v("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}v("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,Te("Route wird importiert……");try{const r=await t.text(),s=await Y.importStageRoute({fileName:t.name,fileContent:r});if(!s.success||!s.data){alert(`Import fehlgeschlagen: ${s.error??"Unbekannter Fehler"}`);return}const n=Zo(s.data);d.stageEditorDraft=n,vt(n),lp(n),he(),Et("stage-editor")}finally{Se()}}async function Fp(){const e=Number(v("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}Te("CSV-Stage wird geladen...");try{const t=await Y.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=Zo(t.data.draft);d.stageEditorDraft=a,vt(a),dp(t.data.metadata),he(),Et("stage-editor")}finally{Se()}}async function Ep(){if(!d.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...qo(d.stageEditorDraft),...Xo()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),he();return}const t=v("stage-editor-new-race-checkbox").checked,a=v("stage-editor-program-checkbox").checked;let r;t&&(r={name:v("stage-editor-race-name").value.trim(),countryId:Number(v("stage-editor-race-country").value),categoryId:Number(v("stage-editor-race-category").value),isStageRace:Number(v("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(v("stage-editor-race-num-stages").value),startDate:v("stage-editor-race-start-date").value.trim(),endDate:v("stage-editor-race-end-date").value.trim(),prestige:Number(v("stage-editor-race-prestige").value)});let s;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');s=Array.from(n).map(i=>Number(i.value))}Te("CSV-Dateien werden erstellt……");try{const n=await Y.exportStageRoute({metadata:cp(),draft:d.stageEditorDraft,newRace:t,raceDetails:r,updatePrograms:a,programIds:s});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}Sr(n.data.stagesFileName,n.data.stagesCsv),Sr(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=v("stage-editor-stage-number"),o=Number(i.value)||1;i.value=String(o+1);const c=v("stage-editor-date"),l=c.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(l)){const h=new Date(l);h.setDate(h.getDate()+1);const y=h.getFullYear(),k=String(h.getMonth()+1).padStart(2,"0"),w=String(h.getDate()).padStart(2,"0");c.value=`${y}-${k}-${w}`}await Promise.all([el(!0),Xs(!0)]);const p=Jo();v("stage-editor-stage-id").value=String(p),ea=p;const m=v("stage-editor-new-race-checkbox");m&&(m.checked=!1);const u=v("stage-editor-new-race-details");u&&(u.classList.add("hidden"),u.style.display="none");const f=v("stage-editor-program-checkbox");f&&(f.checked=!1);const g=v("stage-editor-program-details");g&&(g.classList.add("hidden"),g.style.display="none"),ta=Number(v("stage-editor-race-id").value),he()}finally{Se()}}function Pp(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",F=>{const R=F.target.closest("button[data-stage-profile-open-stage-id]");if(R){const B=Number(R.dataset.stageProfileOpenStageId);Number.isFinite(B)&&Nr(B);return}const N=F.target.closest("button[data-stage-editor-stages-sort]");if(!N)return;const P=N.dataset.stageEditorStagesSort;d.stageEditorStagesSort.key===P?d.stageEditorStagesSort.direction=d.stageEditorStagesSort.direction==="asc"?"desc":"asc":d.stageEditorStagesSort={key:P,direction:up(P)},ga()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",F=>{const R=F.target.closest("button[data-stage-profile-open-stage-id]");if(R){const B=Number(R.dataset.stageProfileOpenStageId),G=R.dataset.stageProfileOpenClimbId??null;if(Number.isFinite(B)){let z=null;G&&d.stageEditorClimbRows&&(z=d.stageEditorClimbRows.find(C=>C.id===G)??null),Nr(B,z)}return}const N=F.target.closest("button[data-stage-editor-climbs-sort]");if(!N)return;const P=N.dataset.stageEditorClimbsSort;d.stageEditorClimbsSort.key===P?d.stageEditorClimbsSort.direction=d.stageEditorClimbsSort.direction==="asc"?"desc":"asc":d.stageEditorClimbsSort={key:P,direction:mp(P)},fa()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{Cp()});const r=document.getElementById("btn-stage-editor-load-existing");r&&r.addEventListener("click",()=>{Fp()});const s=document.getElementById("btn-stage-editor-export");s&&s.addEventListener("click",()=>{Ep()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",F=>{var N;const R=((N=F.target.files)==null?void 0:N[0])??null;v("stage-editor-file-hint").textContent=R?`${R.name} · ${(R.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",F=>{const R=F.target,N=R.closest("tr[data-segment-index]"),P=R.dataset.field;if(!N||!P)return;const B=Number(N.dataset.segmentIndex);if(Number.isInteger(B)){if(P==="markerType"||P==="markerName"||P==="markerCat"){const G=Number(R.dataset.markerIndex),z=R.dataset.markerScope;if(!Number.isInteger(G)||z!=="start"&&z!=="end")return;Xm(B,G,z,P,R.value);return}wp(B,P,R.value)}}),i.addEventListener("click",F=>{const R=F.target.closest("button[data-segment-action]");if(!R)return;const N=Number(R.dataset.segmentIndex);if(Number.isInteger(N)){if(R.dataset.segmentAction==="insert"){Mp(N);return}if(R.dataset.segmentAction==="append"){Rp();return}if(R.dataset.segmentAction==="add-marker"){const P=R.dataset.markerScope;if(P!=="start"&&P!=="end")return;Qm(N,P);return}if(R.dataset.segmentAction==="remove-marker"){const P=Number(R.dataset.markerIndex),B=R.dataset.markerScope;if(!Number.isInteger(P)||B!=="start"&&B!=="end")return;ep(N,P,B);return}R.dataset.segmentAction==="delete"&&Ip(N)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(F=>{const R=document.getElementById(F);R&&R.addEventListener("change",()=>{F==="stage-editor-date"&&Zt(),he()})}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(F=>{F.addEventListener("change",()=>he())});const c=v("stage-editor-new-race-checkbox"),l=v("stage-editor-new-race-details"),p=v("stage-editor-program-checkbox"),m=v("stage-editor-program-details");c&&c.addEventListener("change",()=>{c.checked?(l&&(l.classList.remove("hidden"),l.style.display="grid"),p&&(p.checked=!0,m&&(m.classList.remove("hidden"),m.style.display="block")),Zt()):l&&(l.classList.add("hidden"),l.style.display="none"),he()});const u=document.getElementById("stage-editor-race-is-stage-race");u&&u.addEventListener("change",()=>{Zt()});const f=document.getElementById("stage-editor-race-num-stages");f&&f.addEventListener("input",()=>{Zt()});const g=document.getElementById("stage-editor-race-start-date");g&&g.addEventListener("change",()=>{const F=g.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(F)){const R=document.getElementById("stage-editor-race-is-stage-race"),N=R?Number(R.value)===1:!1,P=v("stage-editor-race-end-date");if(P)if(!N)P.value=F;else{const B=document.getElementById("stage-editor-race-num-stages"),G=B&&Number(B.value)||1,[z,C,H]=F.split("-").map(Number),U=new Date(z,C-1,H);let V=0;G===21?V=2:G>=14&&(V=1);const X=G+V;U.setDate(U.getDate()+X-1);const J=U.getFullYear(),te=String(U.getMonth()+1).padStart(2,"0"),W=String(U.getDate()).padStart(2,"0");P.value=`${J}-${te}-${W}`}}}),p&&p.addEventListener("change",()=>{p.checked?m&&(m.classList.remove("hidden"),m.style.display="block"):m&&(m.classList.add("hidden"),m.style.display="none"),he()});const b=v("stage-editor-programs-dropdown-trigger"),h=v("stage-editor-programs-dropdown-menu"),y=v("btn-stage-editor-programs-ok");b&&h&&(b.addEventListener("click",F=>{F.stopPropagation();const R=h.style.display==="none"||!h.style.display;h.style.display=R?"flex":"none"}),y&&y.addEventListener("click",F=>{F.stopPropagation(),h.style.display="none",he()}),document.addEventListener("click",F=>{const R=F.target;h.style.display==="flex"&&!h.contains(R)&&R!==b&&!b.contains(R)&&(h.style.display="none",he())}));const k=v("stage-editor-programs-list");k&&k.addEventListener("change",F=>{F.target.name==="stage-editor-program-selection"&&rp()});let w=!1,M=null;const x=v("stage-editor-stage-id"),E=v("stage-editor-race-id");if(x&&E){[x,E].forEach(R=>{R.addEventListener("keydown",N=>{N.key==="ArrowUp"||N.key==="ArrowDown"?(w=!1,M&&clearTimeout(M)):(w=!0,M&&clearTimeout(M))}),R.addEventListener("keyup",N=>{N.key!=="ArrowUp"&&N.key!=="ArrowDown"&&(M&&clearTimeout(M),M=setTimeout(()=>{w=!1},150))}),R.addEventListener("mousedown",()=>{w=!1}),R.addEventListener("blur",()=>{w=!1})});const F=(R,N)=>{const P=Number(R.value);if(!Number.isInteger(P)||P<=0){N==="stage"?ea=P:ta=P;return}const G=P-(N==="stage"?ea:ta);if(!w&&(G===1||G===-1)){let z=P;N==="stage"?z=ip(P,G):v("stage-editor-new-race-checkbox").checked&&(z=op(P,G)),R.value=String(z)}N==="stage"?ea=Number(R.value):ta=Number(R.value)};x.addEventListener("input",()=>{F(x,"stage"),he()}),E.addEventListener("input",()=>{F(E,"race"),he()})}const I=v("stage-editor-hide-boring-segments-checkbox");I&&I.addEventListener("change",()=>{d.stageEditorHideBoringSegments=I.checked,he()})}let ft=[],Jt=null,Ke={form:!0,combinedFatigue:!0,shortFatigue:!1,longFatigue:!1};const Ot=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"],vi={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}},Si={1:"Sonnig",2:"Extreme Hitze",3:"Leichter Regen",4:"Starkregen",5:"Starker Wind",6:"Dichter Nebel",7:"Schnee/Eis"};function Ra(e,t){if(e==null)return"";const a=t?S(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const re={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function Fr(e,t,a){const r=dt(e??null);return`<span class="badge badge-race-category" style="${Ea(r)}; white-space: nowrap; display: inline-block;">${S(e??"Unbekannt")}</span>`}function Qs(e){if(!e)return"-";const t=dt(e);return`<span class="badge badge-race-category" style="${Ea(t)}; white-space: nowrap; display: inline-block;">${S(e)}</span>`}function Np(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function Lp(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${Np(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function me(e,t,a,r,s,n,i){const o=t?`background: ${a}; border: 1px solid transparent; color: ${r}; box-shadow: 0 0 8px ${s}; font-weight: 700;`:"background: var(--bg-800); border: 1px solid var(--border); color: var(--text-300);";return`
    <button type="button"
      class="results-type-btn"
      ${n}="${S(i)}"
      style="width: 120px; height: 24px; padding: 0; font-size: 0.8rem; font-weight: ${t?"700":"500"}; line-height: 22px; text-align: center; border-radius: 999px; transition: all 0.15s ease; cursor: pointer; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ${o}"
      onmouseenter="if(!${t}) this.style.borderColor='${s}'"
      onmouseleave="if(!${t}) this.style.borderColor='var(--border)'"
    >${S(e)}</button>
  `}function en(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";case"breakaway_final":return"is-breakaway";default:return""}}function Or(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";case"breakaway_final":return"Ausreißer";default:return"Etappe"}}function Dp(e){return`<span class="rider-stats-final-type ${en(e)}">${S(Or(e))}</span>`}function pe(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?r+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?r+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?r+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?r+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?r+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(r+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function Fe(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?r+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?r+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?r+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?r+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?r+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?r+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(r+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function Ap(e){return`${e.startDate===e.endDate?ne(e.startDate):`${ne(e.startDate)} - ${ne(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function Er(e){if(e==null||d.riders.length===0)return null;const a=[...d.riders].sort((r,s)=>(s.seasonPoints??0)-(r.seasonPoints??0)||(s.seasonWins??0)-(r.seasonWins??0)||s.overallRating-r.overallRating||`${r.lastName} ${r.firstName}`.localeCompare(`${s.lastName} ${s.firstName}`,"de")||r.id-s.id).findIndex(r=>r.id===e);return a>=0?a+1:null}function ki(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;case"breakaway_final":return 4;default:return 5}}function _p(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||ki(t.rowType)-ki(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function Bp(e){return[...e].map(t=>({...t,rows:_p(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function tl(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(50,Math.min(85,e));for(let c=1;c<t.length;c++){const l=t[c-1],p=t[c];if(s<=p.score){const m=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*m),r=Math.round(l.lightness+(p.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function kt(e,t,a,r){const s=r>0?Math.max(0,Math.min(1,a/r)):.5,n=Math.round(6+s*118),i=.26+s*.18,o=.14+s*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${S(t)}">${e} ${a}</span>`}function ns(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function is(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return re.mountain;case"Hill":return re.hilly;case"Sprint":return re.sprint;case"Timetrial":return re.timetrial;case"Cobble":return re.cobble;case"Attacker":return re.attacker;default:return""}}function Ve(e,t,a,r,s){var Z,j,T;const n=(t==null?void 0:t.countryCode)??r??null,i=n?le(n):s,o=(t==null?void 0:t.roleName)??((Z=e==null?void 0:e.role)==null?void 0:Z.name)??"Ohne Rolle",c=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,p=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",m=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",u=((j=t==null?void 0:t.program)==null?void 0:j.name)??((T=e==null?void 0:e.seasonProgram)==null?void 0:T.name)??"-",f=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,g=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,b=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,h=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,y=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,k=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,w=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",M=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,x=(t==null?void 0:t.currentSeasonRank)??Er((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),E=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,I=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,F=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,R=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},N=Math.max(R.flat,R.hilly,R.mediumMountain,R.mountain,R.timetrial,R.cobble),P=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},B=Math.max(P.stageRace,P.oneDay),G=e!=null&&e.specialization1?ns(e.specialization1):"-",z=e!=null&&e.specialization2?ns(e.specialization2):"-",C=e!=null&&e.specialization3?ns(e.specialization3):"-",H=is((e==null?void 0:e.specialization1)??null),U=is((e==null?void 0:e.specialization2)??null),V=is((e==null?void 0:e.specialization3)??null),X=(e==null?void 0:e.weatherProfileId)??(t==null?void 0:t.weatherProfileId)??1,J=vi[X]||vi[1],te=J.pref[0],W=J.pref[1],L=Si[te],A=Si[W];let D="";return t!=null&&t.lieutenantInfo?D=`
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.lieutenantInfo.name)}</a></span></span>
    `:t!=null&&t.leaderInfo&&(D=`
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.leaderInfo.name)}</a></span></span>
    `),`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${S(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?bt(l,p):""} <span>${S(p)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${S(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${zs(m)} <span>Form</span></span>
        ${D}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${tl(c)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${re.seasonForm} ${f>=0?"+":""}${f}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${re.raceForm} ${g>=0?"+":""}${g}</span>
        <span class="rider-stats-icon-pill" title="Programm">${S(u)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${re.raceDays} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${h>14?"text-warning":""}" title="30-Tage Renntage">${re.rollingRaceDays} <span class="rider-stats-icon-pill-value">${h}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${re.longFatigue} <span class="rider-stats-icon-pill-value">${y}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${w!=="none"?"text-error":""}" title="Kurzzeitfatigue">${re.shortFatigue} <span class="rider-stats-icon-pill-value">${k}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${re.seasonPoints} <span class="rider-stats-icon-pill-value">${M}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${re.rank} <span class="rider-stats-icon-pill-value">${Lp(x)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${re.raceDays} <span class="rider-stats-icon-pill-value">${E}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${re.wins} <span class="rider-stats-icon-pill-value">${I}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${H} ${S(G)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${U} ${S(z)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${V} ${S(C)}</span>
        <span class="rider-stats-icon-pill" title="Wetterpräferenzen" style="display: inline-flex; align-items: center; gap: 4px; padding: 0.2rem 0.6rem;">🌤️ ${Ra(te,L)} ${Ra(W,A)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${kt(re.stageRace,"Rundfahrten Punkte",P.stageRace,B)}
        ${kt(re.oneDay,"Eintagesrennen Punkte",P.oneDay,B)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${re.breakaway} <span class="rider-stats-icon-pill-value">${F}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${kt(re.flat,"Flach-Punkte",R.flat,N)}
        ${kt(re.hilly,"Hügel-Punkte",R.hilly,N)}
        ${kt(re.mediumMountain,"Mittelgebirge-Punkte",R.mediumMountain,N)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${kt(re.mountain,"Hochgebirge-Punkte",R.mountain,N)}
        ${kt(re.timetrial,"Zeitfahren-Punkte",R.timetrial,N)}
        ${kt(re.cobble,"Kopfsteinpflaster-Punkte",R.cobble,N)}
      </div>
    </div>
  `}function $i(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",r=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${S(a)} <strong>${S(r)}</strong>`}function Ue(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${d.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${d.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${d.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${d.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${d.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${d.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${d.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-rider-stats-tab="contracts" aria-selected="${d.riderStatsTab==="contracts"?"true":"false"}">Verträge</button>
    </div>`}function Hp(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(55,Math.min(80,e));for(let c=1;c<t.length;c++){const l=t[c-1],p=t[c];if(s<=p.score){const m=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*m),r=Math.round(l.lightness+(p.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function zp(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},r=["mountain","hill","sprint","timeTrial","cobble","attack"],s=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,c=i/2,l=160,p=60,m=85,u=m-p,f=P=>{const B=[];for(let G=0;G<6;G++){const z=G*Math.PI/3-Math.PI/2;B.push(`${o+P*Math.cos(z)},${c+P*Math.sin(z)}`)}return B},g=`
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
    </defs>`,b=`<circle cx="${o}" cy="${c}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let h="";for(let P=p;P<=m;P+=2.5){const B=l*((P-p)/u);if(B<1){h+=`<circle cx="${o}" cy="${c}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const G=f(B),z=P%5===0,C=z?1:.6,H=z?"none":"4,4",U=z?.4:.18;h+=`<polygon points="${G.join(" ")}" fill="none" stroke="rgba(255,255,255,${U})" stroke-width="${C}" stroke-dasharray="${H}" />`,z&&P>p&&(h+=`<text x="${o+5}" y="${c-B+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${P}</text>`)}let y="",k="";for(let P=0;P<6;P++){const B=P*Math.PI/3-Math.PI/2,G=o+l*Math.cos(B),z=c+l*Math.sin(B);y+=`<line x1="${o}" y1="${c}" x2="${G}" y2="${z}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const C=l+28,H=o+C*Math.cos(B),U=c+C*Math.sin(B),V=Math.cos(B);let X="middle";V>.15?X="start":V<-.15&&(X="end");const J=a[r[P]]??p;k+=`<text x="${H}" y="${U}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${X}" dominant-baseline="middle">${s[P]}</text>`,k+=`<text x="${H}" y="${U+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${X}" dominant-baseline="middle">${J}</text>`}const w=[],M=[];r.forEach((P,B)=>{const G=a[P]??p,z=l*((Math.max(p,Math.min(m,G))-p)/u),C=B*Math.PI/3-Math.PI/2,H=o+z*Math.cos(C),U=c+z*Math.sin(C);w.push(`${H},${U}`),M.push(`<circle cx="${H}" cy="${U}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${s[B]}: ${G}</title></circle>`)});const x=`<polygon points="${w.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,I=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((P,B)=>{const G=a[P.key]??60;return(a[B.key]??60)-G}),F=[],R=[];I.forEach((P,B)=>{const G=a[P.key]??60,z=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${P.label}</span>
        ${Hp(G)}
      </div>
    `;B%2===0?F.push(z):R.push(z)});const N=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${F.join("")}</div>
      <div class="skills-col">${R.join("")}</div>
    </div>
  `;return`
    <section class="rider-stats-skills-tab" style="margin-top: 1rem;">
      <div class="rider-stats-skills-container" style="display: grid; grid-template-columns: 540px 1fr; gap: 2rem; align-items: start; background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-primary);">
        <div class="skills-radar-wrapper" style="display: flex; justify-content: center; align-items: center; background: var(--bg-900); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-primary);">
          <svg width="540" height="440" viewBox="0 0 ${n} ${i}" style="overflow: visible;">
            ${g}
            ${b}
            ${h}
            ${y}
            ${x}
            ${M.join("")}
            ${k}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${N}
        </div>
      </div>
    </section>
  `}function Gp(e,t){const a=t.shortTermFatigueMalus??0,r=t.longTermFatigueDecayable??0,s=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),c=(r/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const p=t.fatigueHistory??[];let m="";return p.length===0?m='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':m=p.map(u=>{const f=ne(u.date);let g="";u.type==="race"?g=`${S(u.raceName)}${u.stageNumber!=null?` - Etappe ${u.stageNumber}`:""}`:g=u.raceName?S(u.raceName):"Regeneration";const b=u.type==="race"&&u.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${u.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let h="";u.shortChange>0?h=`<span style="color: #ef4444; font-weight: 600;">+${u.shortChange.toFixed(2).replace(".",",")}</span>`:u.shortChange<0?h=`<span style="color: #2ecc71; font-weight: 600;">${u.shortChange.toFixed(2).replace(".",",")}</span>`:h='<span style="color: #666;">0,00</span>';const y=[];if(u.longDecayableChange!==0){const M=u.longDecayableChange>0?"+":"",x=u.longDecayableChange>0?"#ef4444":"#2ecc71";y.push(`<span style="color: ${x}; font-weight: 500;">${M}${u.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(u.longLockedChange!==0){const M=u.longLockedChange>0?"+":"",x=u.longLockedChange>0?"#a855f7":"#2ecc71";y.push(`<span style="color: ${x}; font-weight: 500;">${M}${u.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const k=y.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${y.join("")}</div>`:'<span style="color: #666;">0,00</span>',w=u.shortAfter+u.longAfter;return`
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${f}</td>
          <td style="color: #fff; font-weight: 600; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${g}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${b}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${h}
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
  `}function Kp(e){var W;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((L,A)=>A%2===0),r=((W=d.gameState)==null?void 0:W.currentDate)??new Date().toISOString(),s=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(r).getUTCFullYear(),n=new Date(Date.UTC(s,0,1)).getTime(),i=864e5,o=1260,c=384,l=40,p=20,m=a.map(L=>{const D=(new Date(L.date).getTime()-n)/i,Z=l+D/365*o,j=p+c-Math.min(8,Math.max(0,L.totalForm))/8*c;return{x:Z,y:j,form:L.totalForm,date:L.date}});let u="",f="",g="";Ke.form&&m.length>0&&(u=`M ${m.map(L=>`${L.x},${L.y}`).join(" L ")}`,f=m.map(L=>`<circle cx="${L.x}" cy="${L.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${L.date}): ${L.form}</title></circle>`).join(""),g=`${u} L ${m[m.length-1].x},${p+c} L ${m[0].x},${p+c} Z`);let b="",h="";if(Ke.combinedFatigue&&m.length>0){const L=a.map(D=>{const j=(new Date(D.date).getTime()-n)/i,T=l+j/365*o,$=(D.shortFatigue??0)+(D.longFatigue??0),_=p+c-Math.min(25,Math.max(0,$))/25*c;return{x:T,y:_,val:$,date:D.date}});b=`<path d="${`M ${L.map(D=>`${D.x},${D.y}`).join(" L ")}`}" fill="none" stroke="#ef4444" stroke-width="2" />`,h=L.map(D=>`<circle cx="${D.x}" cy="${D.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${D.date}): ${D.val.toFixed(2)}</title></circle>`).join("")}let y="",k="";if(Ke.shortFatigue&&m.length>0){const L=a.map(D=>{const j=(new Date(D.date).getTime()-n)/i,T=l+j/365*o,$=D.shortFatigue??0,_=p+c-Math.min(25,Math.max(0,$))/25*c;return{x:T,y:_,val:$,date:D.date}});y=`<path d="${`M ${L.map(D=>`${D.x},${D.y}`).join(" L ")}`}" fill="none" stroke="#facc15" stroke-width="2" />`,k=L.map(D=>`<circle cx="${D.x}" cy="${D.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${D.date}): ${D.val.toFixed(2)}</title></circle>`).join("")}let w="",M="";if(Ke.longFatigue&&m.length>0){const L=a.map(D=>{const j=(new Date(D.date).getTime()-n)/i,T=l+j/365*o,$=D.longFatigue??0,_=p+c-Math.min(25,Math.max(0,$))/25*c;return{x:T,y:_,val:$,date:D.date}});w=`<path d="${`M ${L.map(D=>`${D.x},${D.y}`).join(" L ")}`}" fill="none" stroke="#a855f7" stroke-width="2" />`,M=L.map(D=>`<circle cx="${D.x}" cy="${D.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${D.date}): ${D.val.toFixed(2)}</title></circle>`).join("")}const x="rgba(251, 191, 36, 0.15)";let E="";for(let L=0;L<=8;L+=2){const A=p+c-L/8*c;E+=`<line x1="${l}" y1="${A}" x2="${l+o}" y2="${A}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,E+=`<text x="${l-5}" y="${A+4}" fill="#ffffff" font-size="10" text-anchor="end">${L}</text>`}for(let L=0;L<=25;L+=5){const A=p+c-L/25*c;E+=`<text x="${l+o+5}" y="${A+4}" fill="#ef4444" font-size="10" text-anchor="start">${L}</text>`}let I="";for(let L=0;L<=52;L+=5){const A=l+L/52*o;E+=`<line x1="${A}" y1="${p}" x2="${A}" y2="${p+c}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,I+=`<text x="${A}" y="${p+c+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${L}</text>`}let F="",R="";if(e.peakDates){const L=[...e.peakDates].sort((A,D)=>new Date(A).getTime()-new Date(D).getTime());for(let A=0;A<L.length;A++){const D=L[A],j=(new Date(D).getTime()-n)/i,T=l+j/365*o;F+=`<line x1="${T}" y1="${p}" x2="${T}" y2="${p+c}" stroke="#ffffff" stroke-width="2"><title>Peak: ${D}</title></line>`;const $=A>0?(new Date(L[A-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,_=j-56,K=$+14,O=Math.max(0,Math.max(_,K)),ie=j-O,ge=l+O/365*o,be=ie/365*o;R+=`<rect x="${ge}" y="${p}" width="${be}" height="${c}" fill="rgba(16, 185, 129, 0.1)" />`;const we=14/365*o;R+=`<rect x="${T}" y="${p}" width="${we}" height="${c}" fill="rgba(239, 68, 68, 0.1)" />`}}const P=(new Date(r).getTime()-n)/i,B=l+P/365*o;F+=`<line x1="${B}" y1="${p}" x2="${B}" y2="${p+c}" stroke="#ef4444" stroke-width="3"><title>Heute: ${r}</title></line>`,ft.forEach((L,A)=>{const D=Ot[A%Ot.length];L.peakDates&&L.peakDates.forEach(Z=>{const T=(new Date(Z).getTime()-n)/i,$=l+T/365*o;F+=`<line x1="${$}" y1="${p}" x2="${$}" y2="${p+c}" stroke="${D}" stroke-width="1.5" stroke-dasharray="3,3"><title>${L.riderName} Peak: ${Z}</title></line>`})});let G="",z="";ft.forEach((L,A)=>{const D=Ot[A%Ot.length],Z=L.formHistory.filter((j,T)=>T%2===0).map(j=>{const $=(new Date(j.date).getTime()-n)/i,_=l+$/365*o,K=p+c-Math.min(8,Math.max(0,j.totalForm))/8*c;return{x:_,y:K,form:j.totalForm,date:j.date}});if(Z.length>0){const j=`M ${Z.map(T=>`${T.x},${T.y}`).join(" L ")}`;G+=`<path d="${j}" fill="none" stroke="${D}" stroke-width="2" />`,z+=Z.map(T=>`<circle cx="${T.x}" cy="${T.y}" r="3" fill="#fff" stroke="${D}" stroke-width="2"><title>${L.riderName} (${T.date}): ${T.form}</title></circle>`).join("")}});const C=d.teams.filter(L=>L.division==="WorldTour"||L.divisionName==="WorldTour");let H='<option value="">-- Team auswählen --</option>';for(const L of C){const A=Jt===L.id?" selected":"";H+=`<option value="${L.id}"${A}>${S(L.name)}</option>`}let U='<option value="">-- Fahrer auswählen --</option>';if(Jt!=null){const L=d.riders.filter(A=>A.activeTeamId===Jt&&A.id!==e.riderId&&!ft.some(D=>D.riderId===A.id));for(const A of L)U+=`<option value="${A.id}">${S(A.firstName)} ${S(A.lastName)}</option>`}const V=`
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
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${Jt==null?"disabled":""}>
          ${U}
        </select>
      </div>
    </div>
  `,X=e.currentSeasonRank??Er(e.riderId)??"–",J=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(e.riderName)} (${e.currentSeasonPoints}/${X})">${S(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${X})</span></span>
    </div>
    `];ft.forEach((L,A)=>{const D=Ot[A%Ot.length],Z=L.currentSeasonRank??Er(L.riderId)??"–";J.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${D}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(L.riderName)} (${L.currentSeasonPoints}/${Z})">${S(L.riderName)} <span style="color: var(--text-500);">(${L.currentSeasonPoints}/${Z})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${L.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const te=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      
      <!-- Chart Line Toggle Checkboxes -->
      <div class="chart-line-toggles" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-form" ${Ke.form?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-combined-fatigue" ${Ke.combinedFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #ef4444;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
          Gesamtfatigue (0-25)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-short-fatigue" ${Ke.shortFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #facc15;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #facc15; border-radius: 50%;"></span>
          Kurzzeitfatigue (0-25)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-long-fatigue" ${Ke.longFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #a855f7;" />
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
      ${V}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${R}
            ${E}
            ${I}
            ${F}
            ${g?`<path d="${g}" fill="${x}" />`:""}
            ${u?`<path d="${u}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${f}
            ${b}
            ${h}
            ${y}
            ${k}
            ${w}
            ${M}
            ${G}
            ${z}
          </svg>
        </div>
        ${te}
      </div>
    </section>
  `}function jp(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
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
                <td>${S(Vr(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${r?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(s=a.country)!=null&&s.code3?le(a.country.code3):"–"}</td>
                <td><strong>${S(a.name)}</strong></td>
                <td>${Wr(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function tn(e){const t=new Set;if(e.jerseysWorn){const i=e.jerseysWorn.split(",").map(o=>o.trim()).filter(Boolean);for(const o of i)t.add(o)}const a=new Map;if(e.eventIds){const i=e.eventIds.split("|");for(const o of i){const[c,l]=o.split(":");c&&a.set(c,l?parseInt(l,10):1)}}const r=[{type:"jersey",key:"yellow",label:"Gelbes Trikot (Gesamtwertung)",colorClass:"jersey-dot-yellow"},{type:"jersey",key:"green",label:"Grünes Trikot (Punktewertung)",colorClass:"jersey-dot-green"},{type:"jersey",key:"red",label:"Bergtrikot (Bergwertung)",colorClass:"jersey-dot-red"},{type:"jersey",key:"white",label:"Weißes Trikot (Nachwuchswertung)",colorClass:"jersey-dot-white"},{type:"jersey",key:"purple",label:"Lila Trikot (Aktivste Fahrer)",colorClass:"jersey-dot-purple-worn"},{type:"event",key:"3",label:"Superform",colorClass:"event-dot-3"},{type:"event",key:"4",label:"Supermalus",colorClass:"event-dot-4"},{type:"event",key:"1",label:"Sturz",colorClass:"event-dot-1"},{type:"event",key:"2",label:"Defekt",colorClass:"event-dot-2"},{type:"event",key:"7",label:"Heimvorteil",colorClass:"event-dot-7"},{type:"event",key:"8",label:"Heimbonus",colorClass:"event-dot-8"},{type:"event",key:"9",label:"Heimmalus",colorClass:"event-dot-9"},{type:"event",key:"5",label:"Attacken",colorClass:"event-dot-5"},{type:"event",key:"6",label:"Konterattacken",colorClass:"event-dot-6"}],s=[],n=[];for(const i of r)if(i.type==="jersey")t.has(i.key)&&(s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
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
  `}function Gt(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${S(e)}</span>`}function Op(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function Wp(e){return e.finishStatus==="otl"?Gt("OTL","place"):e.finishStatus==="dnf"?Gt("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${S(String(e.resultRank))}</span>`}function Vp(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":Gt(String(e.gcRank),"gc")}function Up(e){return e.finishStatus==="otl"?hr(e.statusReason,!0):e.finishStatus==="dnf"?hr(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${xa(e.stageTimeSeconds)}`:e.resultLabel}function Ce(e,t,a=!1){var f,g,b;const r=(e==null?void 0:e.activeTeamId)!=null?((f=d.teams.find(h=>h.id===e.activeTeamId))==null?void 0:f.name)??null:null,s=((g=e==null?void 0:e.country)==null?void 0:g.code3)??(e==null?void 0:e.nationality)??null,n=s?le(s):"",i=t==null?[]:[...t.seasons].map(h=>({...h,raceBlocks:Bp(h.raceBlocks)})).sort((h,y)=>y.season-h.season);if(a)return`
      ${Ve(e,t,r,s,n)}
      ${Ue(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`;if(!t)return`
      ${Ve(e,t,r,s,n)}
      ${Ue(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`;if(d.riderStatsTab==="skills")return`
      ${Ve(e,t,r,s,n)}
      ${Ue(t)}
      ${zp(e)}`;if(d.riderStatsTab==="fatigue")return`
      ${Ve(e,t,r,s,n)}
      ${Ue(t)}
      ${Gp(e,t)}`;if(d.riderStatsTab==="program")return`
      ${Ve(e,t,r,s,n)}
      ${Ue(t)}
      ${jp(t)}`;if(d.riderStatsTab==="form")return`
      ${Ve(e,t,r,s,n)}
      ${Ue(t)}
      ${Kp(t)}`;if(d.riderStatsTab==="topResults")return`
      ${Ve(e,t,r,s,n)}
      ${Ue(t)}
      ${Zp(t)}`;if(d.riderStatsTab==="career")return`
      ${Ve(e,t,r,s,n)}
      ${Ue(t)}
      ${qp(t)}`;if(d.riderStatsTab==="contracts")return`
      ${Ve(e,t,r,s,n)}
      ${Ue(t)}
      ${Jp(t)}`;const o=((b=d.gameState)==null?void 0:b.season)??2026,c=Array.from(new Set([o,...i.map(h=>h.season)])).sort((h,y)=>y-h);(d.riderStatsSelectedSeason===null||!c.includes(d.riderStatsSelectedSeason))&&(d.riderStatsSelectedSeason=o);const l=d.riderStatsSelectedSeason,p=i.find(h=>h.season===l);if(t.seasons.length===0)return`
      ${Ve(e,t,r,s,n)}
      ${Ue(t)}
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
                <p>${S(Ap(h))}</p>
              </div>
              ${Fr(h.raceCategoryName,h.isStageRace,h.rows.filter(y=>y.rowType==="stage_result").length||null)}
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
                  ${h.rows.map(y=>{const k=y.rowType!=="stage_result",w=k?`${y.raceName} · ${Or(y.rowType)}`:y.stageNumber&&y.isStageRace?`${y.raceName} · Etappe ${y.stageNumber}`:y.raceName;return`
                      <tr class="rider-stats-row${k?" rider-stats-row-final":""}">
                        <td>${S(ne(y.date))}</td>
                        <td>${Wp(y)}</td>
                        <td>${Vp(y)}</td>
                        <td class="rider-stats-breakaway-col">${Op(y)}</td>
                        <td>${k?"":Ra(y.rolledWeatherId,y.rolledWetterName)}</td>
                        <td>${k?Dp(y.rowType):Fr(y.raceCategoryName?y.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):y.raceCategoryName,y.isStageRace)}</td>
                        <td>${S(w)}</td>
                        <td class="status-cell">${tn(y)}</td>
                        <td>${k?"–":y.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${y.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${Ba(y.profile)}</button>`:"–"}</td>
                        <td>${k?"-":y.distanceKm!=null?S(y.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                        <td>${k?"-":y.elevationGainMeters!=null?S(String(Math.round(y.elevationGainMeters))):"–"}</td>
                        <td>${S(Up(y))}</td>
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
    ${Ve(e,t,r,s,n)}
    ${Ue(t)}
    ${m}
    ${u}
  `}function ks(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(d.riderStatsTab)?(e.style.minWidth="min(1475px, 95vw)",e.style.maxWidth="1687px"):(e.style.minWidth="",e.style.maxWidth="")}function os(e,t){let a="var(--text-200)",r="rgba(255, 255, 255, 0.05)";return t===1?(a="#fbbf24",r="rgba(251, 191, 36, 0.1)"):t===2?(a="#cbd5e1",r="rgba(203, 213, 225, 0.1)"):t===6?(a="#4ade80",r="rgba(74, 222, 128, 0.1)"):t===3?(a="#c084fc",r="rgba(192, 132, 252, 0.1)"):t===4?(a="#38bdf8",r="rgba(56, 189, 248, 0.1)"):t===5&&(a="#fb923c",r="rgba(251, 146, 60, 0.1)"),`<span style="color: ${a}; background: ${r}; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.05); font-weight: bold; font-size: 0.85rem; display: inline-block; line-height: 1;">${S(e)}</span>`}async function da(e){var p,m,u,f,g;const t=$e(e);(t==null?void 0:t.activeTeamId)!=null&&((p=d.teams.find(b=>b.id===t.activeTeamId))==null||p.name),ft=[],Jt=null,d.riderStatsSelectedRiderId=e,d.riderStatsTab="results",d.riderStatsSelectedSeason=((m=d.gameState)==null?void 0:m.season)??2026,ks(),d.riderStatsTopResultsFilterCategory=null,d.riderStatsTopResultsFilterSeason=null,d.riderStatsTopResultsFilterRank=null,d.riderStatsTopResultsFilterProfile=null,d.riderStatsTopResultsPage=1,v("rider-stats-title").innerHTML=$i(t,null),v("rider-stats-jersey").innerHTML="";const a=t?os(((u=t.role)==null?void 0:u.name)??"Fahrer",t.roleId??null):"Fahrer",r=t!=null&&t.age?` · <span style="color: #fbbf24; font-weight: 600;">Alter ${t.age}</span>`:"";v("rider-stats-meta").innerHTML=t?`${a}${r}`:"Historie wird geladen",v("rider-stats-body").innerHTML=Ce(t,null,!0),nt("riderStats");const s=await Y.getRiderStats(e);if(d.riderStatsSelectedRiderId!==e)return;if(!s.success||!s.data){const b=t?os(((f=t.role)==null?void 0:f.name)??"Fahrer",t.roleId??null):"Fahrer",h=t!=null&&t.age?` · <span style="color: #fbbf24; font-weight: 600;">Alter ${t.age}</span>`:"";v("rider-stats-meta").innerHTML=t?`${b}${h}`:"Fehler beim Laden",v("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>`;return}d.riderStatsPayload=s.data,ks(),v("rider-stats-title").innerHTML=$i(t,s.data),v("rider-stats-jersey").innerHTML="";const n=s.data.age?s.data.age:t!=null&&t.age?t.age:null,i=n?` · <span style="color: #fbbf24; font-weight: 600;">Alter ${n}</span>`:"",o=s.data.mentorName?` · Mentor: ${s.data.mentorName}`:"",c=s.data.mentoredRiderNames&&s.data.mentoredRiderNames.length>0?` · Mentor von: ${s.data.mentoredRiderNames.join(" - ")}`:"",l=os(((g=t==null?void 0:t.role)==null?void 0:g.name)??"Fahrer",(t==null?void 0:t.roleId)??null);v("rider-stats-meta").innerHTML=`${l}${i} · ${s.data.seasons.length} Saisons${o}${c}`,v("rider-stats-body").innerHTML=Ce(t,s.data,!1)}function Yp(){v("rider-stats-body").addEventListener("click",e=>{var i;const t=e.target.closest("button[data-top-results-rank]");if(t){const o=t.dataset.topResultsRank,c=o==="all"?null:Number(o);d.riderStatsTopResultsFilterRank=d.riderStatsTopResultsFilterRank===c?null:c,d.riderStatsTopResultsPage=1;const l=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(l,d.riderStatsPayload,!1);return}const a=e.target.closest("button[data-top-results-filter]");if(a){const o=a.dataset.topResultsFilter;d.riderStatsTopResultsFilters[o]=!d.riderStatsTopResultsFilters[o],d.riderStatsTopResultsPage=1;const c=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(c,d.riderStatsPayload,!1);return}if(e.target&&e.target.id&&e.target.id.startsWith("toggle-chart-")){const o=e.target.id,c=e.target.checked;o==="toggle-chart-form"?Ke.form=c:o==="toggle-chart-combined-fatigue"?Ke.combinedFatigue=c:o==="toggle-chart-short-fatigue"?Ke.shortFatigue=c:o==="toggle-chart-long-fatigue"&&(Ke.longFatigue=c);const l=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(l,d.riderStatsPayload,!1);return}const r=e.target.closest("button[data-rider-stats-tab]");if(!r){const o=e.target.closest("button[data-remove-compare-id]");if(o){const p=Number(o.dataset.removeCompareId);ft=ft.filter(u=>u.riderId!==p);const m=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(m,d.riderStatsPayload,!1);return}const c=e.target.closest("button[data-top-results-page]");if(c){const p=Number(c.dataset.topResultsPage);if(!isNaN(p)&&p>=1){d.riderStatsTopResultsPage=p;const m=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(m,d.riderStatsPayload,!1)}return}const l=e.target.closest("button[data-stage-profile-id]");if(l){const p=Number(l.dataset.stageProfileId);Number.isFinite(p)&&Nr(p);return}return}const s=r.dataset.riderStatsTab;if(s!=="results"&&s!=="program"&&s!=="form"&&s!=="topResults"&&s!=="skills"&&s!=="career"&&s!=="fatigue"&&s!=="contracts"||s==="program"&&(((i=d.riderStatsPayload)==null?void 0:i.programRaces.length)??0)===0)return;d.riderStatsTab=s,ks();const n=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(n,d.riderStatsPayload,!1)}),v("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){d.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,d.riderStatsTopResultsPage=1;const a=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){d.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),d.riderStatsTopResultsPage=1;const a=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-profile"){d.riderStatsTopResultsFilterProfile=t.value==="all"?null:t.value,d.riderStatsTopResultsPage=1;const a=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-results-season-select"){d.riderStatsSelectedSeason=Number(t.value);const a=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(a,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;Jt=a?Number(a):null;const r=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(r,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const r=Number(a);if(ft.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const s=await Y.getRiderStats(r,!0);s.success&&s.data?ft.push({riderId:s.data.riderId,riderName:s.data.riderName,teamId:s.data.teamId,teamName:s.data.teamName,formHistory:s.data.formHistory??[],peakDates:s.data.peakDates??[],currentSeasonPoints:s.data.currentSeasonPoints??0,currentSeasonRank:s.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(s.error??""));const n=$e(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Ce(n,d.riderStatsPayload,!1)}}})}function xi(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function Zp(e){const t=[];for(const g of e.seasons)for(const b of g.raceBlocks)for(const h of b.rows)t.push({...h,season:g.season,isStageRace:b.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,b)=>g.localeCompare(b,"de"));const r=Array.from(new Set(t.map(g=>g.season))).sort((g,b)=>b-g);let s=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?d.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?d.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?d.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?d.riderStatsTopResultsFilters.youth:g.rowType==="breakaway_final"?d.riderStatsTopResultsFilters.breakaway:!0:g.isStageRace?d.riderStatsTopResultsFilters.stage:d.riderStatsTopResultsFilters.oneDay);if(d.riderStatsTopResultsFilterCategory){const g=d.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const b=g.substring(0,g.length-8);s=s.filter(h=>h.raceCategoryName===b&&h.rowType==="stage_result")}else if(g.endsWith("-gc")){const b=g.substring(0,g.length-3);s=s.filter(h=>h.raceCategoryName===b&&h.rowType!=="stage_result")}else s=s.filter(b=>b.raceCategoryName===g)}d.riderStatsTopResultsFilterSeason!=null&&(s=s.filter(g=>g.season===d.riderStatsTopResultsFilterSeason)),d.riderStatsTopResultsFilterRank!=null&&!isNaN(d.riderStatsTopResultsFilterRank)&&(s=s.filter(g=>g.resultRank!=null&&g.resultRank<=d.riderStatsTopResultsFilterRank)),d.riderStatsTopResultsFilterProfile&&(s=s.filter(g=>g.profile===d.riderStatsTopResultsFilterProfile)),s.sort((g,b)=>{if(b.seasonPoints!==g.seasonPoints)return b.seasonPoints-g.seasonPoints;const h=g.rowType!=="stage_result",y=b.rowType!=="stage_result",k=g.resultRank??9999,w=b.resultRank??9999;if(d.riderStatsTopResultsFilterCategory)return k!==w?k-w:h!==y?h?-1:1:0;{const M=xi(g.raceCategoryName),x=xi(b.raceCategoryName);return M!==x?M-x:h!==y?h?-1:1:k-w}});const n=200,i=s.slice(0,1e3),o=Math.max(1,Math.ceil(i.length/n));d.riderStatsTopResultsPage>o&&(d.riderStatsTopResultsPage=o);const c=(d.riderStatsTopResultsPage-1)*n,l=i.slice(c,c+n),m=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: flex-start; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${a.map(g=>{if(g.toLowerCase().includes("stage race")||g.toLowerCase().includes("grand tour")||g.toLowerCase().includes("tour de france")){const h=`${g}-etappen`,y=`${g}-gc`;return`
        <option value="${S(h)}" ${d.riderStatsTopResultsFilterCategory===h?"selected":""}>${S(g)} - Etappen</option>
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
          ${me("Siege",d.riderStatsTopResultsFilterRank===1,"linear-gradient(135deg, #fbbf24, #d4af37)","#000","rgba(251, 191, 36, 0.4)","data-top-results-rank","1")}
        </div>
        <div style="grid-row: 2; grid-column: 1;">
          ${me("Top 3",d.riderStatsTopResultsFilterRank===3,"linear-gradient(135deg, #e2e8f0, #94a3b8)","#000","rgba(148, 163, 184, 0.4)","data-top-results-rank","3")}
        </div>

        <!-- Column 2: Top 5 / Top 10 -->
        <div style="grid-row: 1; grid-column: 2;">
          ${me("Top 5",d.riderStatsTopResultsFilterRank===5,"linear-gradient(135deg, #d97706, #b45309)","#fff","rgba(217, 119, 6, 0.4)","data-top-results-rank","5")}
        </div>
        <div style="grid-row: 2; grid-column: 2;">
          ${me("Top 10",d.riderStatsTopResultsFilterRank===10,"linear-gradient(135deg, #a16207, #78350f)","#fff","rgba(161, 98, 7, 0.4)","data-top-results-rank","10")}
        </div>

        <!-- Column 3: GC / [Empty] -->
        <div style="grid-row: 1; grid-column: 3;">
          ${me("GC",d.riderStatsTopResultsFilters.gc,"linear-gradient(135deg, #facc15, #ca8a04)","#000","rgba(234, 179, 8, 0.4)","data-top-results-filter","gc")}
        </div>
        <div style="grid-row: 2; grid-column: 3;">
          <!-- Empty for GC single layout -->
        </div>

        <!-- Column 4: Punkte / Berg -->
        <div style="grid-row: 1; grid-column: 4;">
          ${me("Punkte",d.riderStatsTopResultsFilters.points,"linear-gradient(135deg, #4ade80, #16a34a)","#fff","rgba(74, 222, 128, 0.4)","data-top-results-filter","points")}
        </div>
        <div style="grid-row: 2; grid-column: 4;">
          ${me("Berg",d.riderStatsTopResultsFilters.mountain,"linear-gradient(135deg, #f87171, #dc2626)","#fff","rgba(239, 68, 68, 0.4)","data-top-results-filter","mountain")}
        </div>

        <!-- Column 5: Nachwuchs / Ausreißer -->
        <div style="grid-row: 1; grid-column: 5;">
          ${me("Nachwuchs",d.riderStatsTopResultsFilters.youth,"linear-gradient(135deg, #ffffff, #e2e8f0)","#0f172a","rgba(255, 255, 255, 0.4)","data-top-results-filter","youth")}
        </div>
        <div style="grid-row: 2; grid-column: 5;">
          ${me("Ausreißer",d.riderStatsTopResultsFilters.breakaway,"linear-gradient(135deg, #c084fc, #7c3aed)","#fff","rgba(168, 85, 247, 0.4)","data-top-results-filter","breakaway")}
        </div>

        <!-- Column 6: Etappen / One Day -->
        <div style="grid-row: 1; grid-column: 6;">
          ${me("Etappen",d.riderStatsTopResultsFilters.stage,"linear-gradient(135deg, #60a5fa, #2563eb)","#fff","rgba(59, 130, 246, 0.4)","data-top-results-filter","stage")}
        </div>
        <div style="grid-row: 2; grid-column: 6;">
          ${me("One Day",d.riderStatsTopResultsFilters.oneDay,"linear-gradient(135deg, #b91c1c, #7f1d1d)","#fff","rgba(185, 28, 28, 0.4)","data-top-results-filter","oneDay")}
        </div>
      </div>
    </div>
  `,u=l.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':l.map(g=>{const b=g.rowType!=="stage_result",h=b?`${g.raceName} · ${Or(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let y="–",k="–";g.finishStatus==="otl"?y=Gt("OTL","place"):g.finishStatus==="dnf"?y=Gt("DNF","place"):g.resultRank==null||(b?k=`<span class="rider-stats-final-type ${en(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:y=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${S(String(g.resultRank))}</span>`);const w=b?"–":g.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${g.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${Ba(g.profile)}</button>`:"–",M=!b&&g.stageScore!=null&&g.stageScore>0?jr(g.stageScore,0,350):"–",x=Fr(g.raceCategoryName?g.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${b?" rider-stats-row-final":""}">
            <td>${y}</td>
            <td>${k}</td>
            <td><strong>${S(h)}</strong>${b?"":Ra(g.rolledWeatherId,g.rolledWetterName)}</td>
            <td class="status-cell">${tn(g)}</td>
            <td>${w}</td>
            <td>${M}</td>
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
  `}function Jp(e){var n,i,o,c,l;const t=(e==null?void 0:e.contracts)||[];if(t.length===0)return`
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
            ${r.map(p=>{const m=p.teamId?bt(p.teamId,p.teamName):"",u=p.teamId?qe(p.teamName||"",p.teamId,!0,"results-rider-link"):"Freier Fahrer (Free Agent)",f=p.teamId?`<div style="display: flex; align-items: center; gap: 0.5rem;">${m} <span style="vertical-align: middle;">${u}</span></div>`:`<span style="color: #94a3b8; font-style: italic;">${u}</span>`;return`
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
  `}function qp(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,superteamCount:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),r=(n,i,o,c)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let p="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?p+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?p+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?p+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?p+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?p+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?p+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?p+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?p+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(p+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${p}" title="${S(o)}">${n}</span>`},s=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
                ${Qs(n.key)}
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
                  ${pe(i.winFlat||0,"flat","Flach (Flat)")}
                  ${pe(i.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${pe(i.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${pe(i.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${pe(i.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${pe(i.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${pe(i.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${pe(i.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${pe(i.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${pe(i.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${pe(i.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${Fe(i.winWeather1||0,1,"Sonnig")}
                  ${Fe(i.winWeather2||0,2,"Extreme Hitze")}
                  ${Fe(i.winWeather3||0,3,"Leichter Regen")}
                  ${Fe(i.winWeather4||0,4,"Starkregen")}
                  ${Fe(i.winWeather5||0,5,"Starker Wind")}
                  ${Fe(i.winWeather6||0,6,"Dichter Nebel")}
                  ${Fe(i.winWeather7||0,7,"Schnee/Eis")}
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
  `}window.openRiderStatsFromRiderStats=da;const Xp=250,Wt=1200,Qp=250,eg=1200,Ti=.2;class tg{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",r=>{var i,o,c,l;const s=r.target.closest("button[data-race-sim-action]");if(s){if(s.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const m=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;m&&((l=(c=this.options).onFinishRequested)==null||l.call(c,m,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=r.target.closest("button[data-race-sim-speed]");if(n){const p=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(p))return;this.timeMultiplier=p,this.render()}}),this.elements.messages.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-group-rider-id]");if(s){const c=this.resolveRiderIdFromGroupButton(s);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),da(c));return}const n=r.target.closest("button[data-race-sim-group-rider-name]");if(n){const c=this.resolveRiderIdFromGroupButton(n);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),da(c));return}const i=r.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),qn(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",r=>{const s=r.target.closest("[data-race-sim-overview-summary]");if(s){const n=s.dataset.raceSimOverviewSummary,i=s.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(r)}),this.elements.groupBox.addEventListener("click",r=>{this.handleGroupInteraction(r)}),this.elements.profile.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-timing-mode]");if(!s)return;const n=s.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+Wt,this.render())})}handleGroupInteraction(t){var p,m;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const u=this.resolveRiderIdFromGroupButton(a);u!=null&&this.selectGroupByRiderId(u,this.detailSnapshot);return}const r=t.target.closest("button[data-race-sim-group-nav]");if(!r)return;const s=this.buildRaceGroups(this.detailSnapshot);if(s.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,s.findIndex(u=>u.label===n)),o=r.dataset.raceSimGroupNav==="prev"?-1:1,c=(i+o+s.length)%s.length,l=((p=s[c])==null?void 0:p.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",u=>{const f=u.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Wt)}),this.elements.profile.addEventListener("wheel",u=>{const f=u.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Wt)},{passive:!0}),this.elements.profile.addEventListener("scroll",u=>{const f=u.target;!(f instanceof HTMLElement)||!f.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Wt)},!0),(m=this.elements.sidebar.parentElement)==null||m.addEventListener("click",u=>{if(!this.bootstrap||!this.detailSnapshot||!om(this.elements.sidebar,u.target))return;const g=performance.now(),b=mi(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const h=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",h),this.scheduleSidebarPaintTelemetry(g,h),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new xo(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const r=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(r),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(s=>this.frame(s));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const r=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-r),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(s=>this.frame(s))}render(t=performance.now(),a=!1){var f;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const r=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",s=cd(this.bootstrap.stageSummary),n=[`${s.segmentCount} Segmente`,s.sprintCount>0?`${s.sprintCount} Sprint${s.sprintCount===1?"":"s"}`:null,s.climbCount>0?`${s.climbCount} Bergwertung${s.climbCount===1?"":"en"}`:null].filter(g=>g!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,c=o!=null?i[o]??"":"",l=c?` · ${c}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${r}${n?` · ${n}`:""}${l}`;const p=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=Xp,m=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,u=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=Qp;if(p||m||u){const g=performance.now();this.detailSnapshot=((f=this.engine)==null?void 0:f.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-g)}if(p&&this.detailSnapshot){const g=this.elements.profile.querySelector(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop);const b=performance.now();bd(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-b),this.lastProfileRenderTime=t;const h=this.elements.profile.querySelector(".race-sim-timing-scroll");h&&(h.scrollTop=this.timingScrollTop)}if(m&&this.detailSnapshot){this.lastSidebarRenderTime=t;const g=performance.now(),b=mi(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const h=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",h),this.scheduleSidebarPaintTelemetry(g,h)}u&&this.detailSnapshot&&(qn(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),Vu(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),Gu(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),Jn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const r=a.find(s=>s.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(r)return r.label}return this.selectedGroupLabel!=null&&a.some(r=>r.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return Ks(Gs(t.clusters))}resolveInitialGroupLabel(t){var a,r;return((a=t.find(s=>s.label==="P"))==null?void 0:a.label)??((r=t[0])==null?void 0:r.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(r=>[r.riderId,r]));return[...t.riderIds].sort((r,s)=>{var n,i;return(((n=a.get(r))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(s))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||r-s})[0]??null}selectGroupByLabel(t,a,r=!0){const s=this.buildRaceGroups(a),n=s.find(i=>i.label===t)??s.find(i=>i.label==="P")??s[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),r&&(this.profileInteractionHoldUntilMs=performance.now()+Wt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const s=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;s&&(this.selectedGroupLabel=s.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+Wt,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+eg,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const r=t.dataset.raceSimGroupRiderName;if(!r)return null;const s=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===r&&(s==null||i.activeTeamId===s))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const r=this.perfTelemetry[t];this.perfTelemetry[t]=r<=0?a:r*(1-Ti)+a*Ti}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const r=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(r!==this.sidebarPaintSequence)return;const s=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",s),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||Jn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const at="__stage_overview__",al="__non_finishers__",rl="__events__",sl="__roster__";let Ge="all";function an(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function wi(e){return an(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function ag(e){return[...e].sort((t,a)=>wi(t)-wi(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function rg(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=an(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function sg(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function ng(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${ne(t.date)}`}async function $s(e,t){var s;const a=Ta(e);if(a&&(d.selectedResultsRaceId=a.race.id,d.selectedResultsStageId=e),d.riders.length===0){const n=await Y.getRiders();n.success&&(d.riders=n.data??[])}const r=await Y.getStageResults(e);if(!r.success){d.stageResults=null,Pe(),!t&&r.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+r.error);return}d.stageResults=r.data??null,d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId,d.selectedResultTypeId=((s=d.stageResults.classifications[0])==null?void 0:s.resultTypeId)??1,d.selectedResultsMarkerKey=at,d.selectedResultsSpecialView=null),d.selectedResultsRaceId!=null&&nl(d.selectedResultsRaceId),Pe()}async function nl(e){if(!d.seasonStandings){const a=await Y.getSeasonStandings();a.success&&a.data&&(d.seasonStandings=a.data)}const t=await Y.getRaceResultsRoster(e);t.success&&t.data?d.resultsRoster=t.data:d.resultsRoster=null}function ig(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function Mi(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function og(){const e=d.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=Ft(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=[...e.entries].sort((h,y)=>y.overallRating-h.overallRating),s=new Set(r.slice(0,5).map(h=>h.riderId)),n=h=>{var k;const y=d.riders.find(w=>w.id===h);return((k=y==null?void 0:y.skills)==null?void 0:k.sprint)??0},o=[...e.entries.filter(h=>!s.has(h.riderId))].sort((h,y)=>{const k=n(h.riderId),w=n(y.riderId);return w!==k?w-k:y.overallRating-h.overallRating}),c=new Set(o.slice(0,5).map(h=>h.riderId));function l(h){switch(h){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return h}}const p=new Map;for(const h of e.entries){const y=h.teamId;p.has(y)||p.set(y,{teamId:h.teamId,teamName:h.teamName,riders:[],avgRating:0}),p.get(y).riders.push(h)}for(const h of p.values())h.avgRating=h.riders.reduce((y,k)=>y+k.overallRating,0)/h.riders.length;const m=h=>{let y=Number.POSITIVE_INFINITY;for(const k of h)!k.hasDropped&&k.gcRank!=null&&k.gcRank<y&&(y=k.gcRank);return y},u=h=>{var k;if(!((k=d.seasonStandings)!=null&&k.riderStandings))return 0;let y=0;for(const w of h){const M=d.seasonStandings.riderStandings.find(x=>x.riderId===w.riderId);M&&M.points>y&&(y=M.points)}return y},f=h=>{if(h==null)return 0;const y=Ds(h);if(y.length===0)return 0;const k=y.map(M=>M.overallRating??0);k.sort((M,x)=>x-M);const w=k.slice(0,10);return w.length===0?0:w.reduce((M,x)=>M+x,0)/w.length},g=[...p.values()].sort((h,y)=>{const k=m(h.riders),w=m(y.riders);if((k!==Number.POSITIVE_INFINITY||w!==Number.POSITIVE_INFINITY)&&k!==w)return k-w;const M=u(h.riders),x=u(y.riders);if((M>0||x>0)&&M!==x)return x-M;const E=f(h.teamId),I=f(y.teamId);return Math.abs(E-I)>1e-4?I-E:(h.teamName??"").localeCompare(y.teamName??"","de")});for(const h of g)h.riders.sort((y,k)=>Mi(y.roleId)-Mi(k.roleId)||k.overallRating-y.overallRating||y.lastName.localeCompare(k.lastName,"de"));return`<div class="results-roster-grid">${g.map(h=>{const y=h.teamId!=null?bt(h.teamId,h.teamName):"",k=h.riders.map(M=>{var W;const x=ig(M.roleId),E=M.countryCode?Ae[M.countryCode]??M.countryCode.slice(0,2).toLowerCase():null,I=E?`<span class="fi fi-${E} results-roster-flag" title="${S(M.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',F=`${M.firstName.charAt(0)}. ${M.lastName}`,R=M.roleName??"–",N=M.specialization1?l(M.specialization1):null,P=M.specialization2?l(M.specialization2):null;let B=R;N&&(B+=` · ${N}`),P&&(B+=` · ${P}`);const G=`<span class="results-roster-overall-badge" style="color:${lg(M.overallRating)}" title="Gesamtstärke: ${M.overallRating.toFixed(2)}">${M.overallRating.toFixed(2)}</span>`,z=M.hasDropped?" dropped":"";let C="";M.hasDropped?M.dropoutStatus==="dns"?C="DNS":M.dropoutStatus==="dnf"?C=((W=M.dropoutReason)==null?void 0:W.startsWith("OTL"))??!1?"OTL":"DNF":C="OUT":M.gcRank!=null&&(C=`${M.gcRank}`);let H="";if(M.hasDropped)H=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${S(M.dropoutReason||"")}">${C}</span>`;else if(M.gcRank!=null){let L="rider-stats-rank-badge-gc";M.gcRank===1?L="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":M.gcRank===2?L="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":M.gcRank===3&&(L="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),H=`<span class="rider-stats-rank-badge ${L}" title="GC Stand: Platz ${M.gcRank}">${M.gcRank}</span>`}const V=`style="color: ${M.hasDropped?"var(--text-500)":x.color}; font-weight: bold;"`,X=s.has(M.riderId),J=c.has(M.riderId);return`<div class="results-roster-rider${z}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${I}
            <span class="results-roster-name${X?" strongest-rider":J?" best-sprinter":""}">
              ${Ee(F,{riderId:M.riderId,teamId:M.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${dr(M.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${V}>${S(B)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${H||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${G}
        </div>
      </div>`}).join(""),w=h.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${y}</div>
        <div class="results-roster-team-name" title="${S(h.teamName??"–")}">${qe(h.teamName??"–",h.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${w})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${k}</div>
    </div>`}).join("")}</div>`}function lg(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function dg(e){var l,p;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=d.stageResults)==null?void 0:l.classifications.find(m=>m.resultTypeId===1),a=new Set(t?t.rows.map(m=>m.riderId).filter(m=>m!=null):[]),r=d.riders.filter(m=>m.activeTeamId===e.teamId&&a.has(m.id)),s=new Set((((p=d.stageResults)==null?void 0:p.nonFinishers)??[]).map(m=>m.riderId)),n=[];for(const m of r){if(m.id===e.riderId||s.has(m.id))continue;let u=0;const f=m.skills.sprint>=72,g=m.skills.flat>=78,b=m.skills.timeTrial>=76,h=m.skills.acceleration>=80;if(f&&u++,g&&u++,b&&u++,h&&u++,u>0){let y=1;u===2?y=1.25:u===3?y=1.5:u===4&&(y=2),n.push({id:m.id,firstName:m.firstName,lastName:m.lastName,countryCode:m.nationality??null,isSprinter:f,multiplier:y,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const m=n.filter(h=>h.isSprinter).reduce((h,y)=>h+y.multiplier,0),u=n.filter(h=>!h.isSprinter).reduce((h,y)=>h+y.multiplier,0);let f=0,g=0;m>0&&u>0?(f=i/(2.125*m+u),g=2.125*f,f=Math.max(.1,Math.min(.3,f)),g=Math.max(.25,Math.min(.6,g))):m>0?(g=i/m,g=Math.max(.25,Math.min(.6,g)),f=g/2.125):u>0&&(f=i/u,f=Math.max(.1,Math.min(.3,f)),g=2.125*f);for(const h of n)h.contribution=h.isSprinter?g*h.multiplier:f*h.multiplier;const b=n.reduce((h,y)=>h+y.contribution,0);if(b>0){const h=i/b;for(const y of n)y.contribution*=h}n.sort((h,y)=>y.contribution-h.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),c=n.map(m=>{const u=rt(Rt(m.id)??m.countryCode),f=m.firstName?`${m.firstName.charAt(0)}. ${m.lastName}`:m.lastName,g=m.contribution.toFixed(2).replace(".",",");return`
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
  `}function Ri(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function dr(e){var m,u,f,g,b,h,y,k,w,M;if(e==null||!d.stageResults)return"";const t=Ft(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=d.stageResults.classifications,s=(u=(m=r.find(x=>x.resultTypeId===ha))==null?void 0:m.rows.find(x=>x.rank===1))==null?void 0:u.riderId,n=(g=(f=r.find(x=>x.resultTypeId===fr))==null?void 0:f.rows.find(x=>x.rank===1))==null?void 0:g.riderId,i=(h=(b=r.find(x=>x.resultTypeId===Ns))==null?void 0:b.rows.find(x=>x.rank===1))==null?void 0:h.riderId,o=(k=(y=r.find(x=>x.resultTypeId===5))==null?void 0:y.rows.find(x=>x.rank===1))==null?void 0:k.riderId,c=(M=(w=r.find(x=>x.resultTypeId===7))==null?void 0:w.rows.find(x=>x.rank===1))==null?void 0:M.riderId,l=[],p=d.selectedResultTypeId;return e===s&&(p===ha||p===1&&a||p!==1&&p!==ha)&&l.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&l.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&l.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&l.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===c&&l.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>'),l.length===0?"":`<span class="jersey-dots-wrapper">${l.join("")}</span>`}function Ii(e){if(!e)return"";let t=e;const a=[],r=[...d.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of r){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),c=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");c.test(t)&&(t=t.replace(c,l=>{const p=`__RIDER_LINK_${a.length}__`,m=Ee(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(m),p}))}let s=S(t);for(let n=0;n<a.length;n++)s=s.replace(`__RIDER_LINK_${n}__`,a[n]);return s}function Pe(){var A,D,Z,j;d.riders.length===0&&Y.getRiders().then(T=>{T.success&&T.data&&(d.riders=T.data,Pe())});const e=v("results-race-select"),t=v("results-stage-select"),a=v("results-type-tabs"),r=v("results-marker-tabs"),s=v("results-stage-meta"),n=v("results-empty"),i=v("results-table"),o=i.querySelector("thead tr"),c=v("results-tbody"),l=v("results-marker-classifications"),p=v("results-roster"),m=i.querySelector("colgroup");m&&m.remove(),i.style.tableLayout="",d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+d.races.filter(T=>{var $;return((($=T.stages)==null?void 0:$.length)??0)>0}).map(T=>`<option value="${T.id}"${T.id===d.selectedResultsRaceId?" selected":""}>${S(T.name)}</option>`).join("");const u=Ft(d.selectedResultsRaceId),f=u==null?"":(u.stages??[]).map(T=>`<option value="${T.id}"${T.id===d.selectedResultsStageId?" selected":""}>${S(ng(u,T))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+f;const g=((A=d.stageResults)==null?void 0:A.classifications.filter(T=>!(u&&!u.isStageRace&&T.resultTypeId!==1&&T.resultTypeId!==6)))??[],b=g.find(T=>T.resultTypeId===d.selectedResultTypeId)??g[0]??null,h=d.selectedResultsSpecialView==="nonFinishers",y=d.selectedResultsSpecialView==="events",k=d.selectedResultsSpecialView==="roster";if(b&&!h&&!y&&!k&&(d.selectedResultTypeId=b.resultTypeId),y){i.style.tableLayout="fixed";const T=document.createElement("colgroup");T.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(T,i.firstChild)}if(!d.stageResults&&!k||!b&&!h&&!y&&!k){const T=Ta(d.selectedResultsStageId);s.textContent=T?`${T.race.name} · ${T.stage.profile} · ${ne(T.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",r.innerHTML="",r.classList.add("hidden"),c.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),p.innerHTML="",p.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=d.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}k?d.resultsRoster&&(s.textContent=`${d.resultsRoster.raceName} · Starterfeld`):d.stageResults&&(s.textContent=`${d.stageResults.raceName} · Etappe ${d.stageResults.stageNumber} · ${d.stageResults.profile} · ${ne(d.stageResults.date)}`);const w=d.stageResults?Ta(d.stageResults.stageId):null,M=(w==null?void 0:w.stage.distanceKm)??null,x=new Map,E=new Map,I=new Map;if(d.stageResults){const T=d.stageResults.classifications.find($=>$.resultTypeId===1);if(T)for(const $ of T.rows)$.riderId!=null&&$.points!=null&&$.points>0&&x.set($.riderId,$.points),$.riderId!=null&&$.breakawayKms!=null&&$.breakawayKms>0&&I.set($.riderId,$.breakawayKms);if(d.stageResults.markerClassifications){for(const $ of d.stageResults.markerClassifications)if(an($.markerType,$.markerCategory)){for(const _ of $.entries)if(_.riderId!=null&&_.pointsAwarded!=null&&_.pointsAwarded>0){const K=E.get(_.riderId)??0;E.set(_.riderId,K+_.pointsAwarded)}}}}const F=(b==null?void 0:b.resultTypeId)===ha,R=(b==null?void 0:b.resultTypeId)===fr||(b==null?void 0:b.resultTypeId)===Ns,N=(b==null?void 0:b.resultTypeId)===5,P=(b==null?void 0:b.resultTypeId)===6,B=(b==null?void 0:b.resultTypeId)===7,G=F||R||N||P||B,z=g.map(T=>`
    <button
      type="button"
      class="results-type-btn${!h&&!y&&!k&&T.resultTypeId===d.selectedResultTypeId?" active":""}"
      data-result-type-id="${T.resultTypeId}"
    >${S(T.resultTypeName)}</button>
  `),C=`
    <button
      type="button"
      class="results-type-btn${h?" active":""}"
      data-results-special-view="${al}"
    >OTL/DNF</button>
  `,H=`
    <button
      type="button"
      class="results-type-btn${y?" active":""}"
      data-results-special-view="${rl}"
    >Ereignisse</button>
  `,U=`
    <button
      type="button"
      class="results-type-btn${k?" active":""}"
      data-results-special-view="${sl}"
    >Teilnehmer</button>
  `,V=g.findIndex(T=>T.resultTypeName.toLocaleLowerCase("de").includes("team"));V>=0?z.splice(V+1,0,C,H,U):z.push(C,H,U),a.innerHTML=z.join("");const X=ag(((D=d.stageResults)==null?void 0:D.markerClassifications)??[]);if(k){p.innerHTML=og(),p.classList.remove("hidden"),i.classList.add("hidden"),r.innerHTML="",r.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else p.innerHTML="",p.classList.add("hidden");const J=!h&&!y&&!k&&(b==null?void 0:b.resultTypeId)===1&&X.length>0,te=J?d.selectedResultsMarkerKey??at:null,W=J&&te!==at?X.find(T=>T.markerKey===te)??null:null;if(J&&(d.selectedResultsMarkerKey=(W==null?void 0:W.markerKey)??at),y){const T=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"},{key:"superteam",label:"Superteam"}];r.innerHTML=T.map($=>`
      <button
        type="button"
        class="results-type-btn${$.key===Ge?" active":""}"
        data-event-filter="${$.key}"
      >${S($.label)}</button>
    `).join("")}else r.innerHTML=J?[`
        <button
          type="button"
          class="results-type-btn${d.selectedResultsMarkerKey===at?" active":""}"
          data-marker-key="${at}"
        >Tageswertung</button>`,...X.map(T=>`
        <button
          type="button"
          class="results-type-btn${T.markerKey===d.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${T.markerKey}"
        >${S(rg(T))}</button>
      `)].join(""):"";r.classList.toggle("hidden",!y&&!J);const L=h||y||!J||d.selectedResultsMarkerKey===at;if(o&&L&&(o.innerHTML=h?`
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
      `:F?`
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
        `:B?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Kilometer</th>
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
        ${G?"<th>Trend</th>":""}
        <th class="results-jersey-col">Trikot</th>
        <th>Fahrer / Team</th>
        <th class="results-flag-col">Flagge</th>
        <th>Team</th>
        <th>Zeit</th>
        <th>Rückstand</th>
        <th class="results-points-cell">Punktewertung</th>
        <th>UCI Punkte</th>
      `),c.innerHTML=h?(((Z=d.stageResults)==null?void 0:Z.nonFinishers)??[]).map(T=>`
      <tr>
        <td>${T.stageNumber}</td>
        <td>${Yi(T.isOtl)}</td>
        <td class="results-jersey-col-cell">${Ut(T.teamId,T.teamName)}</td>
        <td>${Yt(T.riderName,!0,!1,T.riderId,T.teamId)}</td>
        <td class="results-flag-col-cell">${rt(T.countryCode)}</td>
        <td>${qe(T.teamName||"–",T.teamId)}</td>
        <td>${S(hr(T.statusReason,T.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':y?[...((j=d.stageResults)==null?void 0:j.events)??[]].filter(T=>Ge==="all"?!0:Ge==="form"?!!(T.title&&(T.title.includes("guten Tag")||T.title.includes("schlechten Tag")||T.title.includes("Formhöhepunkt")||T.title.includes("Formhoehepunkt"))):Ge==="attack"?(T.type==="attack"||T.type==="counter_attack")&&!(T.title&&(T.title.toLowerCase().includes("ausreiß")||T.title.toLowerCase().includes("ausreiss"))):Ge==="breakaway"?!!(T.title&&(T.title.toLowerCase().includes("ausreiß")||T.title.toLowerCase().includes("ausreiss"))):Ge==="incident"?(T.type==="incident"||!!(T.title&&T.title.includes("Massensturz")))&&!(T.title&&(T.title.toLowerCase().includes("ausreiß")||T.title.toLowerCase().includes("ausreiss"))):Ge==="exit"?T.type==="dnf"||!!(T.title&&T.title.includes("nicht am Start")):Ge==="home"?!!(T.title&&(T.title.includes("Heimvorteil")||T.title.includes("Heimdruck"))):Ge==="weather"?!!(T.title&&T.title.startsWith("Wetterbericht:")):Ge==="superteam"?T.type==="superteam":!0).sort((T,$)=>{const _=T.kmMark??0,K=$.kmMark??0;if(Math.abs(_-K)>1e-4)return _-K;if(_===0){const ge=Ri(T),be=Ri($);if(ge!==be)return ge-be}const O=T.riderName??"",ie=$.riderName??"";return O.localeCompare(ie,"de")}).map(T=>{var ua,St,ma;const $=T.kmMark!=null?`${T.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",_=T.riderId,K=_!=null?$e(_):null,O=T.riderTeamId??(K==null?void 0:K.activeTeamId)??null,ie=O!=null?((ua=d.teams.find(Me=>Me.id===O))==null?void 0:ua.name)??null:null;let ge=Ut(O,ie);const be=!!(T.title&&T.title.startsWith("Wetterbericht:"));let we=T.title||"";if(be){const Me=(St=d.stageResults)==null?void 0:St.rolledWeatherId,Lt=(ma=d.stageResults)==null?void 0:ma.rolledWetterName;ge=`<span class="results-jersey-cell">${Ra(Me,Lt)}</span>`,Lt&&(we=`Wetterbericht: ${Lt}`)}const ye=T.type==="superteam",Ie=ye&&_==null,ce=be||Ie?"":rt(_!=null?Rt(_):null),We=be?"":Ie?qe(ie||"–",O):_!=null?Yt(T.riderName??"",!0,!1,_,O):S(T.riderName||"–");let oe="";return T.title&&T.title.includes("guten Tag")?oe='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':T.title&&T.title.includes("schlechten Tag")?oe='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':T.title&&(T.title.includes("Formhöhepunkt")||T.title.includes("Formhoehepunkt"))?oe='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':T.title&&T.title.includes("nicht am Start")?oe='<span class="event-badge event-badge-dns">DNS</span>':T.title&&T.title.includes("Massensturz")?oe='<span class="event-badge event-badge-masscrash">Massensturz</span>':T.type==="dnf"?oe='<span class="event-badge event-badge-dnf">DNF</span>':T.title&&(T.title.toLowerCase().includes("ausreiß")||T.title.toLowerCase().includes("ausreiss"))?oe='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':T.type==="attack"?oe='<span class="event-badge event-badge-attack">Attacke</span>':T.type==="counter_attack"?oe='<span class="event-badge event-badge-counter">Konterattacke</span>':T.type==="incident"?T.title&&(T.title.toLowerCase().includes("defekt")||T.title.toLowerCase().includes("panne")||T.title.toLowerCase().includes("technisch"))?oe='<span class="event-badge event-badge-defect">Defekt</span>':oe='<span class="event-badge event-badge-crash">Sturz</span>':T.title&&T.title.includes("Super-Heimvorteil")?oe='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>':T.title&&T.title.includes("Heimdruck")?oe='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>':T.title&&T.title.includes("Heimvorteil")?oe='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':T.title&&T.title.startsWith("Wetterbericht:")?oe='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>':ye&&(oe='<span class="event-badge event-badge-superteam"><span class="event-icon">⚡</span> Superteam</span>'),`
          <tr>
            <td>${$}</td>
            <td>
              <div class="event-rider-info">
                ${ge}
                ${ce}
                ${We}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${Ii(we)}</span>
                  ${oe}
                </div>
                ${T.detail?`<div class="event-detail">${Ii(T.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':L&&b?b.rows.map($=>{const _=$.riderName??$.teamName,K=$.riderName?$.teamName:"–",O=Ut($.teamId,$.teamName),ie=Yt(_,!0,$.isBreakaway===!0,$.riderId,$.teamId),ge=rt(Rt($.riderId)),be=b.resultTypeId===1&&$.rank===1&&$.timeSeconds!=null&&M!=null,we=$.timeSeconds!=null?`${xa($.timeSeconds)}${be?` (${sg(M,$.timeSeconds)})`:""}`:"–",ye=G?`<td class="results-gc-delta-cell">${br($.previousRank,$.rankDelta)}</td>`:"";if(R){let ce=$.points!=null?String($.points):"–";if($.points!=null&&$.riderId!=null&&b){const oe=b.resultTypeId===fr?x.get($.riderId)??0:E.get($.riderId)??0;oe>0&&(ce+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${oe}</span>`)}return`
          <tr>
            <td class="pos-${Math.min($.rank,3)}">${$.rank}</td>
            ${ye}
            <td class="results-jersey-col-cell">${O}</td>
            <td>${ie}${dr($.riderId)}</td>
            <td class="results-flag-col-cell">${ge}</td>
            <td>${qe(K,$.teamId)}</td>
            <td class="results-points-cell">${ce}</td>
            <td>${$.uciPoints!=null?$.uciPoints:"–"}</td>
          </tr>`}if(B){let ce=$.breakawayKms!=null?`${$.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if($.breakawayKms!=null&&$.riderId!=null){const We=I.get($.riderId)??0;We>0&&(ce+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${We.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min($.rank,3)}">${$.rank}</td>
            ${ye}
            <td class="results-jersey-col-cell">${O}</td>
            <td>${ie}${dr($.riderId)}</td>
            <td class="results-flag-col-cell">${ge}</td>
            <td>${qe(K,$.teamId)}</td>
            <td class="results-points-cell">${ce}</td>
            <td>${$.uciPoints!=null?$.uciPoints:"–"}</td>
          </tr>`}if(P)return`
          <tr>
            <td class="pos-${Math.min($.rank,3)}">${$.rank}</td>
            ${ye}
            <td class="results-jersey-col-cell">${O}</td>
            <td>${qe($.teamName,$.teamId)}</td>
            <td class="results-flag-col-cell">${ge}</td>
            <td>${we}</td>
            <td>${S(nr($.gapSeconds))}</td>
            <td>${$.uciPoints!=null?$.uciPoints:"–"}</td>
          </tr>`;let Ie=$.points!=null?String($.points):"–";if($.leadoutBonus!=null&&$.leadoutBonus>0&&$.leadoutRiderId!=null){const ce=dg($);Ie=`
          <div class="leadout-bonus-anchor">
            ${$.points!=null?$.points:"–"}
            ${ce}
          </div>
        `}return`
            <tr>
              <td class="pos-${Math.min($.rank,3)}">${$.rank}</td>
              ${ye}
              <td class="results-jersey-col-cell">${O}</td>
              <td>${ie}${dr($.riderId)}</td>
              <td class="results-flag-col-cell">${ge}</td>
              <td>${qe(K,$.teamId)}</td>
              <td>${we}</td>
              <td>${S(nr($.gapSeconds))}</td>
              <td class="results-points-cell">${Ie}</td>
              <td>${$.uciPoints!=null?$.uciPoints:"–"}</td>
            </tr>`}).join(""):"",n.classList.toggle("hidden",!!b||h||y||k),i.classList.toggle("hidden",!L||k),W){const T=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${S(Zi(W.markerType,W.markerLabel))}</h4>
          <div class="results-marker-card-meta">${S(`${W.kmMark.toFixed(1).replace(".",",")} km${W.markerCategory?` · Kat. ${W.markerCategory}`:""}`)}</div>
        </div>
      </section>`,_=W.entries.map(K=>{var be;const O=$e(K.riderId),ie=O?`${O.firstName} ${O.lastName}`:`Fahrer ${K.riderId}`,ge=(O==null?void 0:O.activeTeamId)!=null?((be=d.teams.find(we=>we.id===O.activeTeamId))==null?void 0:be.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${K.rank}.</div>
          <div class="results-marker-jersey">${Ut(O==null?void 0:O.activeTeamId,ge)}</div>
          <div class="results-marker-name">${Yt(ie,!1,!1,(O==null?void 0:O.id)??null,(O==null?void 0:O.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${rt(Rt(O==null?void 0:O.id))}</div>
          <div class="results-marker-time">${S(xa(K.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${S(nr(K.gapSeconds))}</div>
          <div class="results-marker-points">${K.pointsAwarded!=null&&K.pointsAwarded>0?K.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${T}<div class="results-marker-list">${_}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!W)}function cg(){v("results-race-select").addEventListener("change",e=>{var r,s;const t=e.target.value;d.selectedResultsRaceId=t?Number(t):null;const a=Ft(d.selectedResultsRaceId);d.selectedResultsStageId=((s=(r=a==null?void 0:a.stages)==null?void 0:r[0])==null?void 0:s.id)??null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=at,d.selectedResultsSpecialView=null,d.stageResults=null,Pe(),d.selectedResultsStageId!=null&&$s(d.selectedResultsStageId,!0)}),v("results-stage-select").addEventListener("change",e=>{const t=e.target.value;d.selectedResultsStageId=t?Number(t):null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=at,d.selectedResultsSpecialView=null,d.stageResults=null,Pe(),d.selectedResultsStageId!=null&&$s(d.selectedResultsStageId,!0)}),v("results-type-tabs").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-result-type-id]");if(t){d.selectedResultsSpecialView=null,d.selectedResultTypeId=Number(t.dataset.resultTypeId),Pe();return}const a=e.target.closest("button[data-results-special-view]");if(a){const s=a.dataset.resultsSpecialView;s===al?(d.selectedResultsSpecialView="nonFinishers",Pe()):s===rl?(d.selectedResultsSpecialView="events",Ge="all",Pe()):s===sl&&(d.selectedResultsSpecialView="roster",d.selectedResultsRaceId!=null&&((r=d.resultsRoster)==null?void 0:r.raceId)!==d.selectedResultsRaceId&&nl(d.selectedResultsRaceId).then(()=>Pe()),Pe())}}),v("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const r=t.dataset.markerKey;d.selectedResultsMarkerKey=r??at,Pe();return}const a=e.target.closest("button[data-event-filter]");a&&(Ge=a.dataset.eventFilter??"all",Pe())})}const rn=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],Aa=["skills","form","profile","preferences"],sn=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],nn={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...rn.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function on(){return[...sn,...nn[d.teamDetailPage]]}function il(e,t=12){const a=d.riders.filter(s=>s.activeTeamId===e).sort((s,n)=>n.overallRating-s.overallRating).slice(0,t);return a.length===0?null:a.reduce((s,n)=>s+n.overallRating,0)/a.length}function ol(e){const t=d.riders.filter(r=>r.activeTeamId===e);return t.length===0?null:t.reduce((r,s)=>r+s.overallRating,0)/t.length}function ll(e){const t=il(e);return t==null?"–":t.toFixed(2).replace(".",",")}function dl(e){const t=ol(e);return t==null?"–":t.toFixed(2).replace(".",",")}function se(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function Ne(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:se(e,t)}function xe(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function Le(e){return e==null?void 0:typeof e=="string"?Xt(e):e.name}function ln(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...rn.map(t=>t.key)].includes(e)?"desc":"asc"}function cl(e){return d.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function ul(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${cl(e.sortKey)}
      </button>
    </th>`}function ml(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${Aa.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const pl={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function dn(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":pl[e]??String(e)}function gl(e){const t=[...e],a=d.teamTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(d.teamTableSort.key){case"name":n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName);break;case"countryCode":n=se(Ct(r),Ct(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=se(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=se(yt(r),yt(s));break;case"riderType":n=se(r.riderType,s.riderType)||se(_e(r),_e(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Ne(Le(r.specialization1),Le(s.specialization1));break;case"specialization2":n=Ne(Le(r.specialization2),Le(s.specialization2));break;case"specialization3":n=Ne(Le(r.specialization3),Le(s.specialization3));break;case"peak1":n=Ne(xe(r,0),xe(s,0));break;case"peak2":n=Ne(xe(r,1),xe(s,1));break;case"peak3":n=Ne(xe(r,2),xe(s,2));break;default:n=r.skills[d.teamTableSort.key]-s.skills[d.teamTableSort.key];break}return n===0&&(n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName)),n*a}),t}function fl(e){const t=[...e],a=d.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(d.riderMenuTableSort.key){case"name":n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName);break;case"countryCode":n=se(Ct(r),Ct(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=se(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=se(yt(r),yt(s));break;case"riderType":n=se(r.riderType,s.riderType)||se(_e(r),_e(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Ne(Le(r.specialization1),Le(s.specialization1));break;case"specialization2":n=Ne(Le(r.specialization2),Le(s.specialization2));break;case"specialization3":n=Ne(Le(r.specialization3),Le(s.specialization3));break;case"peak1":n=Ne(xe(r,0),xe(s,0));break;case"peak2":n=Ne(xe(r,1),xe(s,1));break;case"peak3":n=Ne(xe(r,2),xe(s,2));break;default:n=r.skills[d.riderMenuTableSort.key]-s.skills[d.riderMenuTableSort.key];break}return n===0&&(n=se(r.lastName,s.lastName)||se(r.firstName,s.firstName)),n*a}),t}function xs(e){return e.length===0?"–":e.map(t=>{const a=d.races.find(r=>r.id===t);return a?S(a.name):`Rennen ${t}`}).join(", ")}function ug(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function cn(e,t){var a,r;switch(t.id){case"name":return`<td class="team-table-name-cell">${Ee(_e(e),{riderId:e.id,teamId:e.activeTeamId,strong:d.teamDetailPage==="form"||d.teamDetailPage==="profile"||d.teamDetailPage==="preferences"})}${ro(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${le(Ct(e))}<span>${S(Ct(e))}</span></span></td>`;case"age":return`<td>${e.age??(d.gameState?d.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${S(yt(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating.toFixed(2)}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${hs(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${to(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${hs((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${bs(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${bs(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${Hs(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${S(xe(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${S(xe(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${S(xe(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${S(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?S(Xt(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?S(Xt(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?S(Xt(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${ao(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${le(e.mentorCountryCode??"UNK")} <span>${S(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${xs(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${xs(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const s=t.sortKey;return s&&s in e.skills?`<td>${eo(e.skills[s],(a=e.yearStartSkills)==null?void 0:a[s],(r=e.potentials)==null?void 0:r[s])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function Pr(){Te("Teams/Fahrer werden aktualisiert...");try{const e=!ke("riders"),t=await Y.getRiders(void 0,e);if(t.success&&(d.riders=t.data??[]),await Y.getTeams().then(a=>{a.success&&(d.teams=a.data??[])}),ke("teams")&&un(),ke("riders")){const{renderRidersMenu:a}=await or(async()=>{const{renderRidersMenu:r}=await Promise.resolve().then(()=>Lg);return{renderRidersMenu:r}},void 0);a()}}finally{Se()}}async function mg(e={}){const t=await Y.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),v("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${S(t.error??"Unbekannt")}</p>`;return}d.teams=t.data??[],e.render!==!1&&ke("teams")&&un()}function un(){const e=v("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+d.teams.map(r=>`<option value="${r.id}"${String(r.id)===t?" selected":""}>${S(r.name)} (${S(r.division??r.divisionName??"")}) · ${S(r.abbreviation)}</option>`).join("");const a=t?Number(t):null;aa(a)}function aa(e){const t=v("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=d.teams.find(c=>c.id===e);if(!a){t.innerHTML="";return}const r=Ds(e);if(r.some(c=>c.yearStartSkills===void 0)){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Lade Team-Daten...</p>',Y.getRiders(e,!1,!1).then(c=>{if(c.success&&c.data){const l=new Map(c.data.map(p=>[p.id,p]));d.riders=d.riders.map(p=>l.get(p.id)||p),aa(e)}}).catch(console.error);return}const n=gl(r),i=a.division==="U23"?"badge-u23":"badge-classics",o=on();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${S(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${i}">${S(a.division??a.divisionName??"")}</span>
          <span>${Ji(a.country,a.countryCode)}</span>
          <span>Kürzel: ${S(a.abbreviation)} · Top 12 ${S(ll(a.id))} (${S(dl(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${n.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(dn(d.teamTableSort.key))} ${d.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${ml()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${o.map(ul).join("")}
          </tr></thead>
          <tbody>
            ${n.length===0?`<tr><td colspan="${o.length}" class="text-muted">Keine Fahrer.</td></tr>`:n.map(c=>`
                <tr class="team-detail-row">
                  ${o.map(l=>cn(c,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function hl(){v("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;d.teamDetailPage="skills",aa(t?Number(t):null)}),v("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&fn(s);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const s=a.dataset.teamDetailPage;if(Aa.includes(s)){d.teamDetailPage=s,new Set(on().map(o=>o.sortKey).filter(o=>o!=null)).has(d.teamTableSort.key)||(d.teamTableSort={key:"name",direction:"asc"});const i=Number(v("teams-dropdown").value);aa(Number.isFinite(i)?i:null)}return}const r=e.target.closest("button[data-team-sort]");if(r){const s=r.dataset.teamSort;d.teamTableSort.key===s?d.teamTableSort.direction=d.teamTableSort.direction==="asc"?"desc":"asc":d.teamTableSort={key:s,direction:ln(s)};const n=Number(v("teams-dropdown").value);aa(Number.isFinite(n)?n:null);return}})}const pg=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:nn,TEAM_DETAIL_PAGE_ORDER:Aa,TEAM_SKILL_COLUMNS:rn,TEAM_SKILL_TITLES:pl,TEAM_TABLE_COLUMNS:sn,compareOptionalStrings:Ne,compareStrings:se,formatTeamAverage:dl,formatTeamTopAverage:ll,getActiveTeamTableColumns:on,getDefaultTeamSortDirection:ln,getPeakDate:xe,getSortIndicator:cl,getSpecializationSortLabel:Le,getTeamAverage:ol,getTeamSortLabel:dn,getTeamTopAverage:il,initTeamsListeners:hl,loadTeams:mg,refreshTeamsViewData:Pr,renderPeakDatesSummary:ug,renderRacePrefs:xs,renderTeamDetail:aa,renderTeamDetailPageTabs:ml,renderTeamTableCell:cn,renderTeamTableHeader:ul,renderTeams:un,sortRiderMenuRiders:fl,sortTeamRiders:gl},Symbol.toStringTag,{value:"Module"}));function gg(e,t,a){return`${e} · Etappe ${t} · ${a}`}function bl(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function yl(e,t){const a=[];for(const r of e.riders)if(r.leadoutBonus!=null&&r.leadoutBonus>0&&r.leadoutContributions&&r.leadoutContributions.length>0){const s=t.riders.find(i=>i.id===r.riderId),n=(s==null?void 0:s.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:r.riderId,leadoutBonus:r.leadoutBonus,contributorsJson:JSON.stringify(r.leadoutContributions)})}return a}async function vl(e,t=!1){if(Es!=null||Ar)return!1;ps(e),Qi(0);try{const a=await Y.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const r=a.data;d.realtimeBootstrap=r;const s=await Qc(r,o=>As(o)),n=bl(s,r),i=yl(s,r);return await wl(e,n,s.markerClassifications,s.incidents,s.allEvents,t,i,s.superTeamId),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{ps(null),Se()}}function Sl(e){var r;const t=(r=d.rosterEditor)==null?void 0:r.teams.find(s=>s.team.id===e);if(!t)return 0;const a=new Set(d.rosterEditorSelectedRiderIds);return t.riders.filter(s=>a.has(s.rider.id)).length}function kl(){return d.rosterEditor?d.rosterEditor.teams.every(e=>Sl(e.team.id)===e.riderLimit):!1}function ls(){const e=v("roster-editor-title"),t=v("roster-editor-meta"),a=v("roster-editor-body"),r=v("btn-apply-roster-editor"),s=d.rosterEditor;if(!s){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',r.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=s.race.isStageRace?`${s.race.name} · Etappe ${s.stage.stageNumber} · ${s.stage.profile}`:`${s.race.name} · ${s.stage.profile}`;const n=new Set(d.rosterEditorSelectedRiderIds);a.innerHTML=s.teams.map(i=>{const o=Sl(i.team.id),c=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${S(i.team.name)}</h3>
            <p class="text-muted">${S(i.team.abbreviation)} · ${S(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${c}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var b;const m=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),u=l.rider.country?le(l.rider.country.code3):"",f=[((b=l.rider.role)==null?void 0:b.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),g=l.lockReason?`<span class="roster-editor-rider-lock">${S(l.lockReason)}</span>`:"";return`
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
      </section>`}).join(""),r.disabled=!kl()}function Ts(){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],ia("roster-editor-error"),Ze("rosterEditor")}function $l(e,t){d.selectedRealtimeStageId=e.stage.id,d.realtimeBootstrap=e,d.realtimeError=null,t&&Et("live-race"),xl().load(e,{autoplay:!0,resetSpeed:!0}),ra()}function xl(){let e=qt;if(!e){const t=v("race-sim-layout"),a=v("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new tg({layout:t,emptyState:a,controlsHeader:v("race-sim-controls-header"),profile:v("race-sim-profile"),groupBox:v("race-sim-group-box"),messages:v("race-sim-messages-body"),favorites:v("race-sim-favorites-body"),sidebar:v("race-sim-sidebar-body"),controls:v("race-sim-controls"),meta:v("race-sim-stage-meta")},{onFinishRequested:(r,s)=>{const n=bl(r,s),i=yl(r,s);wl(s.stage.id,n,r.markerClassifications,r.incidents,r.allEvents,!1,i,r.superTeamId)}}),Ui(e)}return e}async function fg(e){Te("Starterfeld wird geladen..."),ia("roster-editor-error");try{const t=await Y.getRosterEditor(e);if(!t.success||!t.data){It("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),nt("rosterEditor"),ls();return}d.rosterEditor=t.data,d.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(r=>r.isSelected).map(r=>r.rider.id)),ls(),nt("rosterEditor")}catch(t){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],It("roster-editor-error",t.message),nt("rosterEditor"),ls()}finally{Se()}}async function hg(){const e=d.rosterEditor;if(e){if(!kl()){It("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}ia("roster-editor-error"),Te("Starterfeld wird übernommen...");try{const t=await Y.applyRosterEditor(e.stage.id,{riderIds:d.rosterEditorSelectedRiderIds});if(!t.success||!t.data){It("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}Ts(),$l(t.data,!0)}catch(t){It("roster-editor-error",t.message)}finally{Se()}}}function ra(){var n,i;const e=v("race-sim-stage-select"),t=((n=d.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===d.selectedRealtimeStageId)||(d.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===d.selectedRealtimeStageId?" selected":""}>${S(gg(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const r=t.find(o=>o.stageId===d.selectedRealtimeStageId)??null,s=xl();if(!r){d.realtimeBootstrap=null,d.realtimeError=null,s.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!d.realtimeBootstrap||d.realtimeBootstrap.stage.id!==r.stageId)&&(d.realtimeError?s.clear(d.realtimeError):s.hide())}async function Tl(e,t){if(gr!==e){gs(e),d.selectedRealtimeStageId=e,t&&Et("live-race"),ra(),Te("Live-Simulation wird geladen...");try{const a=await Y.getRealtimeSimulation(e);if(!a.success||!a.data){d.realtimeBootstrap=null,d.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",ra(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}$l(a.data,!1)}catch(a){d.realtimeBootstrap=null,d.realtimeError=a.message,ra(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{gr===e&&gs(null),Se()}}}async function wl(e,t,a,r,s,n=!1,i,o){if(!Ar){ms(!0),Te("Live-Ergebnis wird gespeichert...");try{const c=await Y.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:r,events:s,leadoutContributions:i,superTeamId:o});if(!c.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(c.error??"Unbekannter Fehler"));return}const l=c.data;d.selectedResultsRaceId=(l==null?void 0:l.raceId)??d.selectedResultsRaceId,d.selectedResultsStageId=(l==null?void 0:l.stageId)??e,d.selectedResultTypeId=1,d.realtimeBootstrap=null,d.realtimeError=null,await $s(e,!1),await pn(),await gn(),(ke("teams")||ke("riders"))&&await Pr(),ra(),n||Et("results")}catch(c){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+c.message)}finally{ms(!1),Se()}}}function bg(){v("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);d.selectedRealtimeStageId=Number.isFinite(t)?t:null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null),d.realtimeError=null,Tl(t,!1)})}function mn(e){var r;const t=dt((r=e.category)==null?void 0:r.name),a=Ea(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function Wr(e){var s,n;const t=dt((s=e.category)==null?void 0:s.name),a=Ea(t),r=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${S(r)}</span>`}function yg(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(r=>r.date).sort((r,s)=>r.localeCompare(s));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function Vr(e){const{startDate:t,endDate:a}=yg(e);return t===a?ne(t):`${ne(t)} - ${ne(a)}`}function vg(e){return e.stageId>0}async function pn(){const[e,t]=await Promise.all([Y.getGameState(),Y.getGameStatus()]);if(!e.success){console.error(e.error);return}d.gameState=e.data??null,d.gameStatus=t.success?t.data??null:null,Sg(),ke("dashboard")&&Ur()}function Sg(){var s;if(!d.gameState)return;v("meta-date").textContent=d.gameState.formattedDate,v("meta-season").textContent=`Saison ${d.gameState.season}`;const e=v("meta-race-hint"),t=v("btn-advance-day"),a=v("pending-stages-list"),r=((s=d.gameStatus)==null?void 0:s.pendingStages)??[];r.length>0?(e.textContent=`${r.length} offene Etappe${r.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=r.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${ne(n.date)}`:`${n.profile} · ${ne(n.date)}`,o=vg(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
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
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):d.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function Ur(){var t,a,r,s,n;const e=d.teams.find(i=>i.isPlayerTeam)??d.teams.find(i=>{var o;return i.name===((o=d.currentSave)==null?void 0:o.teamName)})??null;v("dashboard-career").textContent=((t=d.currentSave)==null?void 0:t.careerName)??"–",v("dashboard-team").textContent=(e==null?void 0:e.name)??((a=d.currentSave)==null?void 0:a.teamName)??"–",v("dashboard-date").textContent=((r=d.gameState)==null?void 0:r.formattedDate)??"–",v("dashboard-season").textContent=d.gameState?`Saison ${d.gameState.season}`:"–",v("dashboard-races-today").textContent=String(((s=d.gameStatus)==null?void 0:s.pendingStages.length)??((n=d.gameState)==null?void 0:n.racesTodayCount)??0),$g()}async function gn(){const e=await Y.getRaces();if(!e.success){console.error(e.error);return}d.races=e.data??[],ke("dashboard")&&Ur()}function kg(e,t){const[a,r,s]=e.split("-").map(Number),n=new Date(a,r-1,s);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),c=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${c}`}function Ci(e){var p,m,u,f;const t=d.gameState!=null&&e.startDate<=d.gameState.currentDate&&e.endDate>=d.gameState.currentDate,r=d.gameState!=null&&e.endDate<d.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',s=((p=e.country)==null?void 0:p.name)??`Land ${e.countryId}`,n=(m=e.country)!=null&&m.code3?le(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.distanceKm??0),0):((u=e.upcomingStage)==null?void 0:u.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.elevationGainMeters??0),0):((f=e.upcomingStage)==null?void 0:f.elevationGainMeters)??null,c=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${ne(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${S(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${mn(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${S(s)}</span></span></td>
      <td>${Wr(e)}</td>
      <td>${c}</td>
      <td>${l}</td>
      <td>${r}</td>
    </tr>`}function $g(){const e=v("dashboard-races-tbody");if(!d.gameState){e.innerHTML='<tr><td colspan="8" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=d.gameState.currentDate,a=kg(t,7),r=d.races.filter(i=>i.startDate<=t&&i.endDate>=t),s=d.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="8"><strong>In Progress</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="8" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=r.map(i=>Ci(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="8"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="8" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=s.map(i=>Ci(i)).join(""),e.innerHTML=n}function _a(e){return`Etappe ${e.stageNumber}`}function xg(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,r)=>r[1]!==a[1]?r[1]-a[1]:a[0].localeCompare(r[0])).map(([a,r])=>`${r}x ${a}`).join(" · ")}function Tg(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function Ba(e){return`<span class="stage-profile-badge ${Tg(e)}">${S(e)}</span>`}function Yr(e,t){return`${e.name} · ${_a(t)} · ${t.profile}`}async function wg(e){var s;const t=d.stageSummariesByStageId[e];if(t)return t;const a=await Y.getStageSummary(e);if(a.success&&a.data)return d.stageSummariesByStageId[e]=a.data,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],a.data;const r=await Y.getRealtimeSimulation(e);return r.success&&((s=r.data)!=null&&s.stageSummary)?(d.stageSummariesByStageId[e]=r.data.stageSummary,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],r.data.stageSummary):(d.stageSummaryErrorsByStageId&&(d.stageSummaryErrorsByStageId[e]=a.error??r.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:r.error}),d.stageSummariesByStageId&&delete d.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function Mg(){var c;const e=v("race-stages-title"),t=v("race-stages-meta"),a=v("race-stages-body"),r=Ft(d.selectedDashboardRaceId);if(!r){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const s=r.stages??[],n=s.reduce((l,p)=>l+(p.distanceKm??0),0),i=s.reduce((l,p)=>l+(p.elevationGainMeters??0),0),o=xg(s);if(e.textContent=r.name,t.textContent=`${Vr(r)} · ${((c=r.country)==null?void 0:c.name)??`Land ${r.countryId}`} · ${r.isStageRace?`${r.numberOfStages} Etappen`:"Eintagesrennen"} · ${yr(n)} · ${vr(i)} · ${o}`,s.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
                <td><strong>${S(_a(l))}</strong></td>
                <td>${Ba(l.profile)}</td>
                <td>${l.distanceKm!=null?yr(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?vr(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${S(Yr(r,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function ws(e){Ft(e)&&(d.selectedDashboardRaceId=e,Mg(),nt("raceStages"))}function Rg(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,r;return`
            <tr>
              <td>${Vr(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?le(t.country.code3):""}<span>${S(((r=t.country)==null?void 0:r.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${S(t.name)}</strong></td>
              <td>${Wr(t)}</td>
              <td>${mn(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function fn(e){const t=d.riders.find(r=>r.id===e);v("rider-program-title").textContent=t?_e(t):"Programm",v("rider-program-meta").textContent="Lade Programmrennen ...",v("rider-program-body").innerHTML="",nt("riderProgram");const a=await Y.getRiderProgramRaces(e);if(!a.success||!a.data){v("rider-program-meta").textContent="",v("rider-program-body").innerHTML=`<div class="results-empty">${S(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}v("rider-program-title").textContent=a.data.program.name,v("rider-program-meta").textContent=t?_e(t):"",v("rider-program-body").innerHTML=Rg(a.data)}function Ig(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=Cg(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${_t("Team","team","Team")}
          ${_t("Fahrer","rider","Fahrer")}
          ${_t("Spec1","spec1","Spezialisierung 1")}
          ${_t("Rolle","role","Rolle")}
          ${_t("Ges","overall","Gesamtstärke")}
          ${_t("Phase","phase","Formphase")}
          ${_t("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var r,s;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${bt((r=a.team)==null?void 0:r.id,(s=a.team)==null?void 0:s.name)}</td>
              <td><span class="race-participant-rider-cell">${le(Ct(a.rider))}<strong>${S(_e(a.rider))}</strong></span></td>
              <td>${S(Ms(a.rider))}</td>
              <td>${S(yt(a.rider))}</td>
              <td>${Bs(a.rider.overallRating)}</td>
              <td>${Hs(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${S(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function _t(e,t,a){const r=d.raceParticipantsSort.key===t?" race-participants-sort-active":"",s=d.raceParticipantsSort.key===t?d.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${S(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${r}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${d.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${s}</span>
      </button>
    </th>`}function Cg(e){const t=d.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{var n,i,o,c;let s=0;switch(d.raceParticipantsSort.key){case"team":s=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=r.team)==null?void 0:i.name)??"","de");break;case"rider":s=_e(a.rider).localeCompare(_e(r.rider),"de");break;case"spec1":s=Ms(a.rider).localeCompare(Ms(r.rider),"de");break;case"role":s=yt(a.rider).localeCompare(yt(r.rider),"de");break;case"overall":s=a.rider.overallRating-r.rider.overallRating;break;case"phase":s=(a.rider.seasonFormPhase??"neutral").localeCompare(r.rider.seasonFormPhase??"neutral","de");break;default:s=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((c=r.program)==null?void 0:c.name)??"","de")}return s*t||_e(a.rider).localeCompare(_e(r.rider),"de")})}function Ms(e){return e.specialization1!=null?Xt(e.specialization1):"–"}async function Fg(e=!1){const t=d.selectedRaceParticipantsRaceId;if(t==null)return;const a=Ft(t);e&&(v("race-participants-meta").textContent="Lade Programmfahrer ...");const r=await Y.getRaceProgramParticipants(t);if(!r.success||!r.data){v("race-participants-meta").textContent="",v("race-participants-body").innerHTML=`<div class="results-empty">${S(r.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}d.raceParticipants=r.data,v("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",v("race-participants-meta").textContent=`${r.data.length} Programmfahrer · ${a?Vr(a):""}`,v("race-participants-body").innerHTML=Ig(d.raceParticipants)}async function Nr(e,t=null){let a=Ta(e);if(!a&&d.stageEditorStageRows){const n=d.stageEditorStageRows.find(i=>i.stageId===e);n&&(a={race:{id:n.raceId,name:n.raceName,countryId:0,categoryId:0,isStageRace:!0,numberOfStages:1,startDate:"",endDate:"",prestige:0},stage:{id:n.stageId,raceId:n.raceId,stageNumber:n.stageNumber,date:"2026-01-01",profile:n.profile,startElevation:0,detailsCsvFile:"",distanceKm:n.distanceKm,elevationGainMeters:n.elevationGainMeters}})}if(!a)return;const r=await wg(e);if(!r){alert(d.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}d.selectedDashboardProfileStageId=e,v("stage-profile-title").textContent=`${a.race.name} · ${_a(a.stage)}`;const s=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";v("stage-profile-meta").textContent=`${ne(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?yr(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?vr(a.stage.elevationGainMeters):"–"}${s}`,hd(v("stage-profile-view"),r,a.stage.profile,Yr(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),nt("stageProfile")}function Eg(){v("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const s=Number(t.dataset.editStageRoster);if(!Number.isFinite(s))return;fg(s);return}const a=e.target.closest("button[data-live-stage]");if(a){const s=Number(a.dataset.liveStage);if(!Number.isFinite(s))return;Tl(s,!0);return}const r=e.target.closest("button[data-instant-stage]");if(r){const s=Number(r.dataset.instantStage);if(!Number.isFinite(s))return;vl(s)}}),v("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-id]");if(!t)return;const a=Number(t.dataset.dashboardRaceId);Number.isFinite(a)&&ws(a)}),v("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&Nr(a)}),v("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&fn(s);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const r=a.dataset.raceParticipantsSort;d.raceParticipantsSort.key===r?d.raceParticipantsSort.direction=d.raceParticipantsSort.direction==="asc"?"desc":"asc":d.raceParticipantsSort={key:r,direction:"asc"},Fg()}),v("btn-advance-day").addEventListener("click",async()=>{await Ml()}),v("btn-auto-progress").addEventListener("click",()=>{Pg()})}async function Ml(){var t,a;Te("Tag wird fortgeschrieben...");const e=(t=d.gameState)==null?void 0:t.season;try{const r=await Y.advanceDay();if(!r.success)return alert(`Tageswechsel fehlgeschlagen:
`+(r.error??"Unbekannter Fehler")),!1;if(d.currentSave&&r.data&&(d.currentSave.currentSeason=r.data.season),await pn(),await gn(),ke("teams")){const{refreshTeamsViewData:n}=await or(async()=>{const{refreshTeamsViewData:i}=await Promise.resolve().then(()=>pg);return{refreshTeamsViewData:i}},void 0);await n()}const s=(a=d.gameState)==null?void 0:a.season;if(e&&s&&s>e){Ia();const{startDraftPresentation:n}=await or(async()=>{const{startDraftPresentation:o}=await Promise.resolve().then(()=>tf);return{startDraftPresentation:o}},void 0),{activateView:i}=await or(async()=>{const{activateView:o}=await Promise.resolve().then(()=>Xl);return{activateView:o}},void 0);i("draft"),await n(s)}return!0}catch(r){return alert("Unerwarteter Fehler beim Tageswechsel: "+r.message),!1}finally{Se()}}function hn(){const e=document.getElementById("btn-auto-progress");e&&(ut?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function Pg(){ut?Ia():Rl()}function Rl(){ut||(Ps(!0),hn(),Ng())}function Ia(){ut&&(Ps(!1),d.autoProgressTargetDate=null,hn())}async function Ng(){var e,t;for(;ut;){const a=(e=d.gameState)==null?void 0:e.currentDate;if(d.autoProgressTargetDate&&a&&a>=d.autoProgressTargetDate){Ia();break}const r=((t=d.gameStatus)==null?void 0:t.pendingStages)??[];let s=!1;if(r.length>0){const n=r[0];s=await vl(n.stageId,!0)}else s=await Ml();if(!s){Ia();break}await new Promise(n=>setTimeout(n,100))}hn()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&ut){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),Ia()}});const Sa=50;function bn(){return[...sn,...nn[d.riderMenuDetailPage]]}function Il(e){return d.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function Cl(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Il(e.sortKey)}
      </button>
    </th>`}function Fl(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${Aa.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function cr(){const e=v("riders-detail"),t=bn(),a=fl(d.riders),r=a.length,s=Math.max(1,Math.ceil(r/Sa));d.riderMenuPage=Math.min(s,Math.max(1,d.riderMenuPage));const n=(d.riderMenuPage-1)*Sa,i=Math.min(r,n+Sa),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(dn(d.riderMenuTableSort.key))} ${d.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Fl()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(Cl).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(c=>`
                <tr class="team-detail-row">
                  ${t.map(l=>cn(c,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${d.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${d.riderMenuPage} / ${s} · Fahrer ${r===0?0:n+1}-${i} von ${r}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${d.riderMenuPage>=s?"disabled":""}>Weiter</button>
      </div>
    </div>`}function El(){v("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&fn(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;Aa.includes(n)&&(d.riderMenuDetailPage=n,new Set(bn().map(o=>o.sortKey).filter(o=>o!=null)).has(d.riderMenuTableSort.key)||(d.riderMenuTableSort={key:"name",direction:"asc"}),d.riderMenuPage=1,cr());return}const r=e.target.closest("button[data-riders-sort]");if(r){const n=r.dataset.ridersSort;d.riderMenuTableSort.key===n?d.riderMenuTableSort.direction=d.riderMenuTableSort.direction==="asc"?"desc":"asc":d.riderMenuTableSort={key:n,direction:ln(n)},d.riderMenuPage=1,cr();return}const s=e.target.closest("button[data-riders-page-action]");if(s){const n=s.dataset.ridersPageAction,i=Math.max(1,Math.ceil(d.riders.length/Sa));n==="prev"&&(d.riderMenuPage=Math.max(1,d.riderMenuPage-1)),n==="next"&&(d.riderMenuPage=Math.min(i,d.riderMenuPage+1)),cr();return}})}const Lg=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:Sa,getActiveRiderMenuTableColumns:bn,getRiderMenuSortIndicator:Il,initRidersListeners:El,renderRiderMenuDetailPageTabs:Fl,renderRiderMenuTableHeader:Cl,renderRidersMenu:cr},Symbol.toStringTag,{value:"Module"})),tr=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function lt(e){return e==null?"free-agents":String(e)}function Fi(e){var a;const t=d.riderTeamEditorPayload;return t?((a=t.teams.find(r=>r.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function Dg(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return _s(t/11.2,0,100)}function Ag(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function _g(e){return d.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function Bg(e){const t=d.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${S(e.title)}"
        aria-label="${S(e.title)}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${_g(e.key)}
      </button>
    </th>`}function Hg(e,t){switch(d.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return se(e.firstName,t.firstName);case"lastName":return se(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return se(Fi(e.teamId),Fi(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return se(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return se(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function zg(e){const t=d.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>(Hg(a,r)||se(a.lastName,r.lastName)||se(a.firstName,r.firstName)||a.riderId-r.riderId)*t)}function Gg(e){const t=d.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(r=>lt(r.teamId)===t);return zg(a)}function Kg(e){const t=d.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${lt(a.teamId)}"${a.teamId===e?" selected":""}>${S(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function Pl(e){return d.riderTeamEditorDirtyRiderIds.includes(e)}function jg(e,t){const a=Pl(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${Br(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${Kg(e.teamId)}</select></td>`;case"number":{const r=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${r}"></td>`}case"text":{const r=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${S(r)}"></td>`}default:return"<td>–</td>"}}function Og(e){const t=[...e.teams].sort((a,r)=>a.rank-r.rank||se(a.name,r.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${d.riderTeamEditorSelectedTeamKey===lt(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${lt(a.teamId)}">
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
    </aside>`}function Oe(){var o;const e=v("rider-team-editor-root"),t=v("rider-team-editor-meta"),a=d.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const r=d.riderTeamEditorSelectedTeamKey?a.teams.find(c=>lt(c.teamId)===d.riderTeamEditorSelectedTeamKey)??null:null,s=Gg(a),n=d.riderTeamEditorDirtyRiderIds.length,i=r==null?"Kein Team gewählt":`${r.riderCount} Fahrer · Ø ${r.averageOverall!=null?r.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${r.rank}`;t.textContent=r==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${r.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${d.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(c=>`
                  <option value="${lt(c.teamId)}"${d.riderTeamEditorSelectedTeamKey===lt(c.teamId)?" selected":""}>${S(c.name)} (${c.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${S(d.riderTeamEditorSort.key==="teamName"?"Team":((o=tr.find(c=>c.key===d.riderTeamEditorSort.key))==null?void 0:o.title)??d.riderTeamEditorSort.key)} ${d.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${tr.map(Bg).join("")}
                </tr>
              </thead>
              <tbody>
                ${s.length===0?`<tr><td colspan="${tr.length}" class="text-muted">${d.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:s.map(c=>`
                    <tr class="team-detail-row${Pl(c.riderId)?" rider-team-editor-row-dirty":""}">
                      ${tr.map(l=>jg(c,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${Og(a)}
    </div>`}function Wg(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),c=o.length===0?null:Math.round(o.reduce((l,p)=>l+p.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:c,rank:0}}),r=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:r.length,averageOverall:r.length===0?null:Math.round(r.reduce((i,o)=>i+o.overallRating,0)/r.length*100)/100,rank:0,isFreeAgents:!0});const s=[...a].sort((i,o)=>{const c=i.averageOverall??-1;return(o.averageOverall??-1)-c||o.riderCount-i.riderCount||se(i.name,o.name)}),n=new Map(s.map((i,o)=>[lt(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(lt(i.teamId))??a.length}))}async function Nl(e=!1){if(d.riderTeamEditorPayload&&!e){Oe();return}v("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await Y.getRiderTeamEditor();if(!t.success||!t.data){v("rider-team-editor-root").innerHTML=`<div class="results-empty">${S(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}d.riderTeamEditorPayload=t.data,d.riderTeamEditorDirtyRiderIds=[],d.riderTeamEditorSaving=!1,d.riderTeamEditorExporting=!1,d.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(r=>lt(r.teamId)===d.riderTeamEditorSelectedTeamKey)||(d.riderTeamEditorSelectedTeamKey="")),Oe()}function Vg(e,t,a){const r=d.riderTeamEditorPayload;if(!r)return;const s=r.riders.find(n=>n.riderId===e);s&&(t==="teamId"?s.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof s[t]=="number"?s[t]=Number.parseInt(a||"0",10):s[t]=a,s.overallRating=Dg(s),r.teams=Wg(r),d.riderTeamEditorDirtyRiderIds.includes(e)||(d.riderTeamEditorDirtyRiderIds=[...d.riderTeamEditorDirtyRiderIds,e]),Oe())}async function Ug(){if(!d.riderTeamEditorPayload||d.riderTeamEditorSaving)return;d.riderTeamEditorSaving=!0,Oe();const e=await Y.saveRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Oe();return}d.riderTeamEditorPayload=e.data,d.riderTeamEditorDirtyRiderIds=[],Oe()}async function Yg(){if(!d.riderTeamEditorPayload||d.riderTeamEditorExporting)return;d.riderTeamEditorExporting=!0,Oe();const e=await Y.exportRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Oe();return}Sr(e.data.fileName,e.data.content),Oe()}function Zg(){v("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const s=t.dataset.riderTeamEditorSort;d.riderTeamEditorSort.key===s?d.riderTeamEditorSort.direction=d.riderTeamEditorSort.direction==="asc"?"desc":"asc":d.riderTeamEditorSort={key:s,direction:Ag(s)},Oe();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){d.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Oe();return}const r=e.target.closest("button[data-rider-team-editor-action]");if(r){const s=r.dataset.riderTeamEditorAction;if(s==="reload"){Nl(!0);return}if(s==="export"){Yg();return}s==="save"&&Ug()}}),v("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){d.riderTeamEditorSelectedTeamKey=t.value,Oe();return}const a=e.target.closest(".rider-team-editor-input");if(a){const r=Number(a.dataset.riderTeamEditorRiderId),s=a.dataset.riderTeamEditorField;Number.isFinite(r)&&s&&Vg(r,s,a.value)}})}let Qe={key:"pickNumber",asc:!0};function Rs(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),r=.26+t*.18,s=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${r};--rider-stats-pill-bg-alpha:${s};`}function Ll(e){return Qe.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${Qe.asc?"↑":"↓"}</span>`}function Ye(e,t,a=""){const r=Qe.key===t?" team-table-sort-active":"";return`
    <th class="${S(a)}">
      <button
        type="button"
        class="team-table-sort${r}"
        data-draft-sort="${S(t)}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        ${Ll(t)}
      </button>
    </th>`}async function Zr(e,t=!1){const a=await Y.getDraftHistory(e);if(!a.success){d.draftHistory=null,ke("draft")&&Lr(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}d.draftHistory=a.data??null,ke("draft")&&Lr()}function Lr(){const e=v("draft-table-container"),t=v("draft-season-select");if(!d.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const s=(d.currentSave.startSeason??2026)+1;for(let n=d.currentSave.currentSeason;n>=s;n--){const i=document.createElement("option");i.value=n.toString(),i.textContent=`Saison ${n}`,t.appendChild(i)}d.draftSelectedSeason||(d.draftSelectedSeason=Math.max(s,d.currentSave.currentSeason)),t.value=d.draftSelectedSeason.toString(),t.onchange=n=>{const i=n.target;d.draftSelectedSeason=parseInt(i.value,10),Zr(d.draftSelectedSeason)}}if(!d.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(d.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...d.draftHistory.rows].sort((s,n)=>{let i=0;const o=Qe.key;return o==="riderLastName"?i=s.riderLastName.localeCompare(n.riderLastName):o==="teamName"?i=s.teamName.localeCompare(n.teamName):o==="oldTeamName"?i=(s.oldTeamName||"").localeCompare(n.oldTeamName||""):o==="countryCode"?i=s.countryCode.localeCompare(n.countryCode):i=(s[o]??0)-(n[o]??0),Qe.asc?i:-i});let r=`
    <table class="data-table">
      <thead>
        <tr>
          ${Ye("Pick","pickNumber","text-center")}
          ${Ye("Runde","draftRound","text-center")}
          ${Ye("Neues Team","teamName")}
          ${Ye("Altes Team","oldTeamName")}
          ${Ye("Land","countryCode","text-center")}
          ${Ye("Fahrer","riderLastName")}
          ${Ye("Alter","riderBirthYear","text-center")}
          ${Ye("Vertrag","contractLength","text-center")}
          ${Ye("Stärke","overallAtDraft","text-center")}
          ${Ye("Potenzial","potOverallAtDraft","text-center")}
        </tr>
      </thead>
      <tbody>
  `;for(const s of a){const n=d.draftHistory.season-s.riderBirthYear;let i="-";s.oldTeamName&&(i=`
        <div style="display:flex; align-items:center; gap:0.5rem;">
          ${bt(s.oldTeamId,s.oldTeamName)}
          <button class="app-team-link" data-team-id="${s.oldTeamId}" style="background: none; border: none; padding: 0; color: #94a3b8; font-weight: normal; cursor: pointer; text-align: left; font-size: inherit;">
            ${S(s.oldTeamName)}
          </button>
        </div>`);const o=`
      <div style="display:flex; align-items:center; gap:0.5rem;">
        ${bt(s.teamId,s.teamName)}
        <button class="app-team-link" data-team-id="${s.teamId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: inherit;">
          ${S(s.teamName)}
        </button>
      </div>`;r+=`
      <tr>
        <td class="text-center">#${s.pickNumber}</td>
        <td class="text-center">Runde ${s.draftRound}</td>
        <td>${o}</td>
        <td>${i}</td>
        <td class="text-center">${le(s.countryCode)}</td>
        <td>
          <button class="app-rider-link" data-rider-id="${s.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: inherit;">
            ${S(s.riderLastName)}
          </button>
        </td>
        <td class="text-center">${n} J.</td>
        <td class="text-center">${s.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Rs(s.overallAtDraft)}">${s.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Rs(s.potOverallAtDraft)}">${s.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}r+="</tbody></table>",e.innerHTML=r}function Dl(){v("draft-table-container").addEventListener("click",a=>{const r=a.target.closest("button[data-draft-sort]");if(r){const s=r.dataset.draftSort;s&&(Qe.key===s?Qe.asc=!Qe.asc:(Qe.key=s,Qe.asc=!0),Lr())}});const t=v("draft-replay-btn");t&&t.addEventListener("click",()=>{const a=v("draft-season-select");if(a){const r=Number(a.value);isNaN(r)||Bl(r)}})}function Ha(){d.draftOverlayTimer1&&(clearTimeout(d.draftOverlayTimer1),d.draftOverlayTimer1=null),d.draftOverlayTimer2&&(clearTimeout(d.draftOverlayTimer2),d.draftOverlayTimer2=null)}function Jg(e,t,a){const r=d.teams.find(c=>c.id===e),s=(r==null?void 0:r.division)==="U23"?20:(r==null?void 0:r.division)==="ProTour"?30:32,n=d.riders.filter(c=>c.activeTeamId===e).length,i=a.slice(t+1).filter(c=>c.teamId===e).length,o=n-i;return Math.max(0,s-o)}function gt(e,t,a=50){var n;const r=e==null||e<=0?"Freier Fahrer":t??((n=d.teams.find(i=>i.id===e))==null?void 0:n.name)??`Team ${e}`,s=e==null||e<=0?"/jersey/Jer_placeholder.svg":`/jersey-large/Jer_${e}.png`;return`
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
    </span>`}function Ca(e,t,a=!1){if(!d.draftOverlayPicks)return[];const r=d.riders.filter(o=>o.activeTeamId===e),s=a?t+1:t,n=d.draftOverlayPicks.slice(s),i=new Set(n.filter(o=>o.teamId===e).map(o=>o.riderId));return r.filter(o=>!i.has(o.id))}function Is(e){const t={Berg:{spec1:0,spec23:0},Hill:{spec1:0,spec23:0},Sprint:{spec1:0,spec23:0},Timetrial:{spec1:0,spec23:0},Cobble:{spec1:0,spec23:0}};for(const a of e){const r=a.specialization1,s=a.specialization2,n=a.specialization3;r&&t[r]!==void 0&&t[r].spec1++,s&&t[s]!==void 0&&t[s].spec23++,n&&t[n]!==void 0&&t[n].spec23++}return t}function Al(e,t,a,r){const s=["Berg","Hill","Sprint","Timetrial","Cobble"],n=g=>g==="Hill"?"Hügel":g==="Timetrial"?"ZF":g,i=(g,b,h)=>g==="Timetrial"?b>=4||b>=2&&h>=2:g==="Cobble"?b>=4||b>=3&&h>=2:b>=4,o=s.map(g=>{const b=t[g]||{spec1:0},h=a[g]||{spec1:0,spec23:0},k=i(g,h.spec1,h.spec23)?"#4ade80":"#f87171",w=String(r?h.spec1:b.spec1);let M="";return r&&h.spec1-b.spec1>0&&(M='<span class="count-anim" style="color: #4ade80; font-weight: bold; margin-left: 0.15rem; animation: fadeUp 1.5s forwards;">(+1)</span>'),`<div style="display: flex; align-items: center;"><span style="color: #94a3b8; margin-right: 0.25rem;">${n(g)}:</span><strong style="color: ${k};">${w}</strong>${M}</div>`}),c=d.teams.find(g=>g.id===e),l=(c==null?void 0:c.division)==="U23"?20:(c==null?void 0:c.division)==="ProTour"?30:32,p=Ca(e,d.draftOverlayCurrentIndex,!1).length,m=Ca(e,d.draftOverlayCurrentIndex,!0).length;let u="";r&&m>p&&(u='<span class="count-anim" style="color: #4ade80; font-weight: bold; margin-left: 0.15rem; animation: fadeUp 1.5s forwards;">(+1)</span>');const f=r?m:p;return o.push(`<div style="display: flex; align-items: center; border-left: 1px solid rgba(255,255,255,0.15); padding-left: 1rem;"><span style="color: #94a3b8; margin-right: 0.25rem;">Kader:</span><strong style="color: #fbbf24;">${f}/${l}</strong>${u}</div>`),o.join('<span style="color: rgba(255,255,255,0.15); margin: 0 0.25rem;">|</span>')}function ds(e,t,a,r,s){const n=e.id===r,i=d.draftOverlayPicks.slice(0,a+1).some(m=>m.riderId===e.id&&m.teamId===s);let o="#fff",c="#94a3b8",l="normal";return n?(o="#4ade80",c="#4ade80",l="bold"):i&&(o="#facc15",c="#facc15",l="bold"),`
    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; transition: all 0.2s; ${n?"border-left: 3px solid #4ade80; padding: 0.25rem 0.4rem 0.25rem 0.2rem; background: rgba(74, 222, 128, 0.08); border-radius: 4px;":"padding: 0.25rem 0.4rem; background: transparent; border-radius: 4px;"}">
      <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span style="font-family: monospace; text-align: right; width: 1.25rem; display: inline-block; color: #64748b; font-weight: bold; margin-right: 0.2rem;">${String(t).padStart(2,"0")}</span>
        ${le(e.countryCode||e.nationality)}
        <span style="color: ${o}; font-weight: ${l}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${S(e.lastName)}
        </span>
      </div>
      <span style="color: ${c}; font-weight: bold;">${e.overallRating.toFixed(1)}</span>
    </div>
  `}function ka(e){if(!e)return null;const t=e.toLowerCase();return t==="berg"||t==="climber"||t==="bergfahrer"?"Berg":t==="hill"||t==="puncher"||t==="huegelspezialist"?"Hügel":t==="sprint"||t==="sprinter"?"Sprint":t==="timetrial"||t==="time_trial"||t==="time trialist"||t==="zf"||t==="zeitfahrer"?"Zeitfahren":t==="cobble"||t==="classic"||t==="pave"||t==="pflasterspezialist"?"Cobble":t==="attacker"||t==="angreifer"?"Angreifer":e}function qg(e,t,a){var g;const r=t?"border: 2px solid var(--accent, #38bdf8); background: rgba(56, 189, 248, 0.08);":"border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);",s=[],n=ka(e.specialization1),i=ka(e.specialization2),o=ka(e.specialization3);n&&s.push(n),i&&s.push(i),o&&s.push(o);const c=s.length>0?s.map(b=>S(b)).join(" · "):"Allrounder",l=e.uciRank?`<span style="color: #4ade80; font-weight: bold;">${e.uciRank}</span>`:"—",m=(d.draftSelectedSeason??((g=d.currentSave)==null?void 0:g.currentSeason)??2026)-e.birthYear,u=e.wins&&e.wins>0?`<span>·</span><span style="color: #4ade80;">${e.wins===1?"1 Sieg":e.wins+" Siege"}</span>`:"";let f="";return e.oldTeamId===a?f=gt(null,null,32):e.oldTeamId&&e.oldTeamId>0?f=gt(e.oldTeamId,e.oldTeamName,32):f="",`
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0.5rem; border-radius: 6px; transition: all 0.2s; ${r}">
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        ${f?`
        <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
          ${f}
        </div>
        `:""}
        <div>
          <div style="display: flex; align-items: center; gap: 0.35rem;">
            ${le(e.countryCode)}
            <button class="app-rider-link" data-rider-id="${e.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: 0.88rem; text-decoration: none;">
              ${S(e.lastName)}
            </button>
            <span style="color: #60a5fa; font-weight: bold; font-size: 0.85rem; margin-left: 0.15rem;">(</span><span style="color: #facc15; font-weight: bold; font-size: 0.85rem;">${m}</span><span style="color: #60a5fa; font-weight: bold; font-size: 0.85rem;">)</span>
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
  `}function Xg(e){var n;const a=(d.draftSelectedSeason??((n=d.currentSave)==null?void 0:n.currentSeason)??2026)-e.riderBirthYear,r=ka(e.riderSpecialization)||"Allrounder";let s="";return e.oldTeamId===e.teamId?s=`
      ${gt(null,null,95)}
      <span style="font-size: 2.5rem; color: #94a3b8; font-weight: bold; display: flex; align-items: center;">➔</span>
      ${gt(e.teamId,e.teamName,95)}
    `:e.oldTeamId&&e.oldTeamId>0?s=`
      ${gt(e.oldTeamId,e.oldTeamName,95)}
      <span style="font-size: 2.5rem; color: #94a3b8; font-weight: bold; display: flex; align-items: center;">➔</span>
      ${gt(e.teamId,e.teamName,95)}
    `:s=`
      ${gt(e.teamId,e.teamName,95)}
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
          ${le(e.countryCode)}
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
  `}function Qg(e){let t=document.getElementById("draft-overlay");return t||(t=document.createElement("div"),t.id="draft-overlay",t.style.cssText=`
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
  `,t.addEventListener("click",a=>{const r=a.target;if(r.id==="draft-overlay-quick-btn"){yn();return}if(r.id==="draft-overlay-pause-btn"){d.draftPaused=!d.draftPaused,r.textContent=d.draftPaused?"Weiter":"Pause",r.classList.toggle("btn-primary",d.draftPaused),sa();return}const s=r.closest(".draft-speed-btn");if(s){const n=parseFloat(s.dataset.speed||"1");d.draftSpeedMultiplier=n,t.querySelectorAll(".draft-speed-btn").forEach(i=>{i.classList.remove("draft-speed-btn-active"),i.style.color="",i.style.fontWeight=""}),s.classList.add("draft-speed-btn-active"),s.style.color="var(--accent, #38bdf8)",s.style.fontWeight="bold",sa();return}if(r.id==="draft-overlay-prev-btn"||r.closest("#draft-overlay-prev-btn")){if(d.draftOverlayCurrentIndex>0){const n=document.getElementById("draft-overlay-auto-checkbox");n&&(n.checked=!1,d.draftOverlayAuto=!1),Fa(d.draftOverlayCurrentIndex-1)}return}if(r.id==="draft-overlay-next-btn"||r.closest("#draft-overlay-next-btn")){if(d.draftOverlayPicks&&d.draftOverlayCurrentIndex+1<d.draftOverlayPicks.length){const n=document.getElementById("draft-overlay-auto-checkbox");n&&(n.checked=!1,d.draftOverlayAuto=!1),Fa(d.draftOverlayCurrentIndex+1)}return}}),t.addEventListener("change",a=>{const r=a.target;r.id==="draft-overlay-auto-checkbox"&&(d.draftOverlayAuto=r.checked,d.draftOverlayAuto?sa():Ha())}),t)}function sa(){if(Ha(),d.draftPaused)return;const e=d.draftSpeedMultiplier,t=d.draftOverlayCurrentIndex;if(d.draftRevealShown){if(d.draftOverlayAuto){const a=3e3/e;d.draftOverlayTimer2=window.setTimeout(()=>{const r=t+1;r<d.draftOverlayPicks.length?Fa(r):yn()},a)}}else{const a=2e3/e;d.draftOverlayTimer1=window.setTimeout(()=>{_l()},a)}}function _l(){const e=d.draftOverlayCurrentIndex,t=d.draftOverlayPicks[e];d.draftRevealShown=!0;const a=Ca(t.teamId,e,!1),r=Ca(t.teamId,e,!0),s=Is(a),n=Is(r),i=document.getElementById("draft-overlay-specs-header");i&&(i.innerHTML=Al(t.teamId,s,n,!0));const o=document.getElementById("draft-overlay-pick-display");if(o){const c=[...r].sort((k,w)=>w.overallRating-k.overallRating),l=c.slice(0,10),p=l.some(k=>k.id===t.riderId),m=c.findIndex(k=>k.id===t.riderId)+1;let u=l.map((k,w)=>ds(k,w+1,e,t.riderId,t.teamId)).join("");if(!p){const k=c.find(w=>w.id===t.riderId);k&&(u+=`
          <div style="border-top: 1px dashed rgba(255,255,255,0.15); margin: 0.3rem 0; padding-top: 0.3rem;"></div>
          ${ds(k,m,e,t.riderId,t.teamId)}
        `)}const f=d.riders.find(k=>k.id===t.riderId),g=f==null?void 0:f.specialization1,b=ka(g)||"Allrounder",h=c.filter(k=>g&&(k.specialization1===g||k.specialization2===g)).slice(0,10);let y=h.map(k=>{const w=c.findIndex(M=>M.id===k.id)+1;return ds(k,w,e,t.riderId,t.teamId)}).join("");h.length===0&&(y='<div style="font-size: 0.8rem; color: #64748b; font-style: italic; padding: 0.5rem; text-align: center;">Keine Partner im Team</div>'),o.innerHTML=`
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
              <span>Spec: ${S(b)}</span>
              <span style="font-size: 0.75rem; font-weight: normal; color: #64748b;">(max 10)</span>
            </h4>
            <div style="overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 0.35rem; padding-right: 0.25rem;">
              ${y}
            </div>
          </div>
          
        </div>
        
        <!-- Right Column: Draft Big Card -->
        <div style="flex: 2.0; display: flex; justify-content: center; align-items: center; min-height: 0;">
          ${Xg(t)}
        </div>
      </div>
    `}sa()}function ef(e){const t=e.length,a=Math.ceil(t/2),r=[];for(let s=0;s<a;s++)r.push(e[s]),s+a<t&&r.push(e[s+a]);return r}function Fa(e){if(!d.draftOverlayPicks||e<0||e>=d.draftOverlayPicks.length)return;Ha(),d.draftOverlayCurrentIndex=e,d.draftRevealShown=!1;const t=d.draftOverlayPicks[e];if(!document.getElementById("draft-overlay"))return;const r=document.getElementById("draft-overlay-round-title");r&&(r.textContent=`Runde ${t.draftRound} - Pick #${t.pickNumber}`);const s=document.getElementById("draft-overlay-team-subtitle");s&&(s.textContent=t.teamName);const n=document.getElementById("draft-overlay-team-jersey-wrap");n&&(n.innerHTML=gt(t.teamId,t.teamName,72));const i=document.getElementById("draft-overlay-progress-label");i&&(i.textContent=`${e+1} / ${d.draftOverlayPicks.length}`);const o=Ca(t.teamId,e,!1),c=Is(o),l=document.getElementById("draft-overlay-specs-header");l&&(l.innerHTML=Al(t.teamId,c,c,!1));const p=document.getElementById("draft-overlay-prev-btn");p&&(p.disabled=e===0);const m=document.getElementById("draft-overlay-next-btn");m&&(m.disabled=e===d.draftOverlayPicks.length-1);const u=[...t.candidates].sort((h,y)=>y.overallRating-h.overallRating),f=ef(u),g=document.getElementById("draft-overlay-candidates-list");g&&(g.innerHTML=f.map(h=>{const y=h.riderId===t.riderId;return qg(h,y,t.teamId)}).join(""));const b=document.getElementById("draft-overlay-pick-display");b&&(b.innerHTML=`
      <div style="font-size: 1.3rem; font-weight: 500; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 2.25rem; transform: translateY(-20px);">
        <div style="animation: pulse 1s infinite alternate; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5)); display: flex; align-items: center; justify-content: center; width: 120px; height: 120px;">
          ${gt(t.teamId,t.teamName,120)}
        </div>
        <style>
          @keyframes pulse {
            from { opacity: 0.4; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1.08); }
          }
        </style>
        <span>Treffe Auswahl...</span>
      </div>
    `),sa()}function yn(){Ha(),d.draftOverlayActive=!1,d.draftOverlayPicks=null;const e=document.getElementById("draft-overlay");e&&e.remove(),d.draftSelectedSeason&&Zr(d.draftSelectedSeason)}async function Bl(e){Ha(),d.draftOverlayActive=!0,d.draftOverlayAuto=!0,d.draftOverlayCurrentIndex=0,d.draftSelectedSeason=e,d.draftSpeedMultiplier=1,d.draftPaused=!1,d.draftRevealShown=!1,Te("Draft-Präsentation wird geladen...");try{const[t,a,r]=await Promise.all([Y.getDraftDetails(e),Y.getRiders(void 0,!1,!0,e),Y.getTeams()]);if(!t.success||!t.data||!t.data.picks||t.data.picks.length===0){Se(),d.draftOverlayActive=!1;return}a.success&&a.data&&(d.riders=a.data),r.success&&r.data&&(d.teams=r.data),d.draftOverlayPicks=t.data.picks,Qg(e),Fa(0)}catch(t){console.error(t),d.draftOverlayActive=!1}finally{Se()}}const tf=Object.freeze(Object.defineProperty({__proto__:null,closeDraftOverlay:yn,currentDraftSort:Qe,getDraftSortIndicator:Ll,getHeatmapStyleForRating:Rs,getOpenSlotsForPick:Jg,initDraftListeners:Dl,loadDraftHistory:Zr,renderDraftHeaderCell:Ye,renderDraftView:Lr,revealCurrentPick:_l,showDraftPick:Fa,startDraftPresentation:Bl,triggerDraftSchedule:sa},Symbol.toStringTag,{value:"Module"}));async function af(e=!1){const t=await Y.getInjuries();if(!t.success){d.injuries=null,ke("injuries")&&Ei(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}d.injuries=t.data??[],ke("injuries")&&Ei()}function Ei(){const e=v("injuries-table-container");if(!d.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(v("injuries-meta").textContent=d.injuries.length+" Ausfälle",d.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=da;let t="";const a=d.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),r=new Map;for(const n of a){const i=n.teamId;r.has(i)||r.set(i,[]),r.get(i).push(n)}for(const n of r.keys())r.get(n).sort((i,o)=>o.overallRating-i.overallRating);const s=Array.from(r.keys()).sort((n,i)=>{const o=r.get(n)[0].teamAbbreviation||"",c=r.get(i)[0].teamAbbreviation||"";return o.localeCompare(c)});if(s.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of s){const i=r.get(n),o=i[0].teamAbbreviation;t+=`
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
      `;for(const c of i){const l=c.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let p="";if(c.fitDate){const m=ne(c.fitDate);if(c.missedRaces&&c.missedRaces.length>0){let u="";for(const f of c.missedRaces)u+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${ne(f.startDate)}</span>
                  ${le(f.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${S(f.name)}</strong>
                  ${Qs(f.categoryName)}
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
            <td>${le(c.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${c.riderId})" style="color: inherit; text-decoration: none;"><strong>${S(c.riderFirstName)} ${S(c.riderLastName)}</strong></a></td>
            <td>${c.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${tl(c.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${c.unavailableDays} Tage</strong></td>
            <td>${p}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function Pi(e){return e===0?"–":`-${e}`}function rf(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="season-standings-country-rider-name">${Ee(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function sf(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${S(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${rf(e.topRiders)}
      </div>
    </div>`}function nf(e,t){const a=t.filter(r=>r.teamId!=null&&e.teamId!=null&&r.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="season-standings-country-rider-name">${Ee(r.riderName??"–",{riderId:r.riderId,teamId:r.teamId,strong:!1})}</span>
          <strong>${r.points}</strong>
        </div>
      `).join("")}
    </div>`}function of(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${qe(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${nf(e,t)}
      </div>
    </div>`}async function Hl(e){const t=d.seasonStandingsSelectedSeason??void 0,a=await Y.getSeasonStandings(t);if(!a.success){d.seasonStandings=null,ke("season-standings")&&Cs(),!e&&a.error&&alert(`Saisonwertung konnte nicht geladen werden:
`+a.error);return}d.seasonStandings=a.data??null,ke("season-standings")&&Cs()}function Cs(){var b,h,y,k,w,M,x,E;const e=v("season-standings-meta"),t=v("season-standings-scope-tabs"),a=v("season-standings-empty"),r=v("season-standings-table"),s=v("season-standings-tbody"),n=v("season-standings-jersey-header"),i=v("season-standings-primary-header"),o=v("season-standings-flag-header"),c=v("season-standings-secondary-header"),l=((b=d.seasonStandings)==null?void 0:b.season)??((h=d.gameState)==null?void 0:h.season)??((y=d.currentSave)==null?void 0:y.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.";const p=v("season-standings-year-select");if(p){const I=((k=d.seasonStandings)==null?void 0:k.availableSeasons)||[],F=d.seasonStandingsSelectedSeason??((w=d.gameState)==null?void 0:w.season)??2026;p.innerHTML=I.map(R=>`
      <option value="${R}" ${R===F?"selected":""}>Saison ${R}</option>
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
  `;const m=d.selectedSeasonStandingScope==="countries",u=m?((M=d.seasonStandings)==null?void 0:M.countryStandings)??[]:d.selectedSeasonStandingScope==="teams"?((x=d.seasonStandings)==null?void 0:x.teamStandings)??[]:((E=d.seasonStandings)==null?void 0:E.riderStandings)??[],f=m?u:[],g=m?[]:u;if(n.textContent="Trikot",i.textContent=m?"Land":d.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",c.textContent=d.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",m),c.classList.toggle("hidden",m),!d.seasonStandings||u.length===0){s.innerHTML="",r.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}s.innerHTML=m?f.map(I=>`
      <tr>
        <td class="pos-${Math.min(I.rank,3)}">${I.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${sf(I)}</td>
        <td class="results-flag-col-cell">${rt(I.countryCode)}</td>
        <td class="hidden"></td>
        <td>${I.points}</td>
        <td>${S(Pi(I.gapPoints))}</td>
      </tr>`).join(""):g.map(I=>{var G;const F=I.riderName??I.teamName,R=Ut(I.teamId,I.teamName),N=d.selectedSeasonStandingScope==="teams"?of(I,((G=d.seasonStandings)==null?void 0:G.riderStandings)??[]):Yt(F,!0,!1,I.riderId,I.teamId),P=rt(I.countryCode),B=d.selectedSeasonStandingScope==="teams"?S(I.countryName??I.countryCode??"–"):qe(I.teamName??"–",I.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(I.rank,3)}">${I.rank}</td>
          <td class="results-jersey-col-cell">${R}</td>
          <td>${N}</td>
          <td class="results-flag-col-cell">${P}</td>
          <td>${B}</td>
          <td>${I.points}</td>
          <td>${S(Pi(I.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),r.classList.remove("hidden")}function lf(){v("season-standings-scope-tabs").addEventListener("click",t=>{const a=t.target.closest("button[data-season-scope]");if(!a)return;const r=a.dataset.seasonScope;r!=="riders"&&r!=="teams"&&r!=="countries"||(d.selectedSeasonStandingScope=r,Cs())});const e=v("season-standings-year-select");e&&e.addEventListener("change",t=>{const a=t.target;d.seasonStandingsSelectedSeason=Number(a.value),Hl(!1)})}function Ni(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function df(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,r=[...e].map(l=>({rider:l,score:t(l)})).sort((l,p)=>p.score-l.score).slice(0,10),s=[...e].map(l=>({rider:l,score:a(l)})).sort((l,p)=>p.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,p)=>p.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,p)=>p.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,p)=>p.score-l.score).slice(0,10),c=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,p)=>p.score-l.score).slice(0,10);return{Gesamtklassement:r,Sprinter:s,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:c}}function cf(e,t){const a=d.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const r=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,s=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>r(o)):t==="Sprinter"?n=a.map(o=>s(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,c)=>c-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,c)=>o+c,0)/i.length}function uf(e,t){var i;const r=d.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:cf(o.id,t)}));r.sort((o,c)=>c.avgScore-o.avgScore);const s=r.findIndex(o=>o.teamId===e)+1,n=((i=r.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:s,total:r.length,average:n}}function mf(e){const t=d.riders.filter(s=>s.activeTeamId===e);if(t.length===0)return 0;const a=t.map(s=>s.overallRating??0);a.sort((s,n)=>n-s);const r=a.slice(0,10);return r.length===0?0:r.reduce((s,n)=>s+n,0)/r.length}function pf(e){var n;const a=d.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:mf(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const r=a.findIndex(i=>i.teamId===e)+1,s=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:r,total:a.length,average:s}}function ar(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function rr(e){e.countryCode&&le(e.countryCode);const t=df(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,p)=>p.formValue-l.formValue).slice(0,10),r=[...e.riders].map(l=>({rider:l,uciRank:Er(l.id)})).filter(l=>l.uciRank!==null).sort((l,p)=>l.uciRank-p.uciRank).slice(0,10),s=Object.entries(t).map(([l,p])=>{const m=uf(e.teamId,l),u=m.average.toFixed(1).replace(".",","),f=p.map(({rider:g,score:b})=>{const h=`${g.firstName.charAt(0)}. ${g.lastName}`,y=Ee(h,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),k=g.nationality?Ae[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,w=k?`<span class="fi fi-${k} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",M=d.riders.find(E=>E.id===g.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${ar((M==null?void 0:M.roleId)??null).color};">
            ${w}
            ${y}
          </span>
          <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${b.toFixed(0)}</span>
        </li>
      `}).join("");return`
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
          ${l}
          <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-400); display: block; margin-top: 0.1rem;">Platz ${m.rank}/${m.total} · Ø ${u}</span>
        </h4>
        <ul style="margin: 0; padding: 0; list-style: none;">${f}</ul>
      </div>
    `}).join(""),i=[...e.riders].sort((l,p)=>(p.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const p=`${l.firstName.charAt(0)}. ${l.lastName}`,m=Ee(p,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),u=l.nationality?Ae[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=u?`<span class="fi fi-${u} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",g=l.overallRating.toFixed(0),b=d.riders.find(y=>y.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${ar((b==null?void 0:b.roleId)??null).color};">
          ${f}
          ${m}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:p})=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Ee(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?Ae[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",b=(p>=0?"+":"")+p.toFixed(1).replace(".",","),h=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,y=d.riders.find(w=>w.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${ar((y==null?void 0:y.roleId)??null).color};">
          ${g}
          ${u}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${h}">${b}</span>
      </li>
    `}).join(""),c=r.map(({rider:l,uciRank:p})=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Ee(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?Ae[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"";let b="rider-stats-rank-badge-gc";p===1?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":p===2?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":p===3&&(b="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const h=`<span class="rider-stats-rank-badge ${b}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${p}">${p}</span>`,y=d.riders.find(w=>w.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${ar((y==null?void 0:y.roleId)??null).color};">
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
  `}function sr(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${d.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${d.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${d.teamStatsTab==="contracts"?"true":"false"}">Kader & Verträge</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="transfers"?" team-detail-page-tab-active":""}" data-team-stats-tab="transfers" aria-selected="${d.teamStatsTab==="transfers"?"true":"false"}">Transfers</button>
    </div>`}function gf(e){const t=Array.from(new Set(e.topResults.map(u=>u.raceCategoryName).filter(Boolean)));t.sort((u,f)=>u.localeCompare(f,"de"));const a=Array.from(new Set(e.topResults.map(u=>u.season))).sort((u,f)=>f-u);let r=e.topResults.filter(u=>u.rowType!=="stage_result"?u.rowType==="gc_final"?d.teamStatsTopResultsFilters.gc:u.rowType==="mountain_final"?d.teamStatsTopResultsFilters.mountain:u.rowType==="points_final"?d.teamStatsTopResultsFilters.points:u.rowType==="youth_final"?d.teamStatsTopResultsFilters.youth:u.rowType==="breakaway_final"?d.teamStatsTopResultsFilters.breakaway:!0:u.isStageRace?d.teamStatsTopResultsFilters.stage:d.teamStatsTopResultsFilters.oneDay);if(d.teamStatsTopResultsFilterCategory){const u=d.teamStatsTopResultsFilterCategory;if(u.endsWith("-etappen")){const f=u.substring(0,u.length-8);r=r.filter(g=>g.raceCategoryName===f&&g.rowType==="stage_result")}else if(u.endsWith("-gc")){const f=u.substring(0,u.length-3);r=r.filter(g=>g.raceCategoryName===f&&g.rowType!=="stage_result")}else r=r.filter(f=>f.raceCategoryName===u)}d.teamStatsTopResultsFilterSeason!=null&&(r=r.filter(u=>u.season===d.teamStatsTopResultsFilterSeason)),d.teamStatsTopResultsFilterRank!=null&&!isNaN(d.teamStatsTopResultsFilterRank)&&(r=r.filter(u=>u.resultRank!=null&&u.resultRank<=d.teamStatsTopResultsFilterRank)),d.teamStatsTopResultsFilterProfile&&(r=r.filter(u=>u.profile===d.teamStatsTopResultsFilterProfile)),r.sort((u,f)=>{if(f.seasonPoints!==u.seasonPoints)return f.seasonPoints-u.seasonPoints;const g=u.rowType!=="stage_result",b=f.rowType!=="stage_result",h=u.resultRank??9999,y=f.resultRank??9999;if(d.teamStatsTopResultsFilterCategory)return h!==y?h-y:g!==b?g?-1:1:0;{const k=Ni(u.raceCategoryName),w=Ni(f.raceCategoryName);return k!==w?k-w:g!==b?g?-1:1:h-y}});const s=20,n=Math.max(1,Math.min(10,Math.ceil(r.length/s)));d.teamStatsTopResultsPage>n&&(d.teamStatsTopResultsPage=n);const i=(d.teamStatsTopResultsPage-1)*s,o=r.slice(i,i+s),l=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: flex-start; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${t.map(u=>{if(u.toLowerCase().includes("stage race")||u.toLowerCase().includes("grand tour")||u.toLowerCase().includes("tour de france")){const g=`${u}-etappen`,b=`${u}-gc`;return`
        <option value="${S(g)}" ${d.teamStatsTopResultsFilterCategory===g?"selected":""}>${S(u)} - Etappen</option>
        <option value="${S(b)}" ${d.teamStatsTopResultsFilterCategory===b?"selected":""}>${S(u)} - GC</option>
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
          ${me("Siege",d.teamStatsTopResultsFilterRank===1,"linear-gradient(135deg, #fbbf24, #d4af37)","#000","rgba(251, 191, 36, 0.4)","data-team-top-results-rank","1")}
        </div>
        <div style="grid-row: 2; grid-column: 1;">
          ${me("Top 3",d.teamStatsTopResultsFilterRank===3,"linear-gradient(135deg, #e2e8f0, #94a3b8)","#000","rgba(148, 163, 184, 0.4)","data-team-top-results-rank","3")}
        </div>

        <!-- Column 2: Top 5 / Top 10 -->
        <div style="grid-row: 1; grid-column: 2;">
          ${me("Top 5",d.teamStatsTopResultsFilterRank===5,"linear-gradient(135deg, #d97706, #b45309)","#fff","rgba(217, 119, 6, 0.4)","data-team-top-results-rank","5")}
        </div>
        <div style="grid-row: 2; grid-column: 2;">
          ${me("Top 10",d.teamStatsTopResultsFilterRank===10,"linear-gradient(135deg, #a16207, #78350f)","#fff","rgba(161, 98, 7, 0.4)","data-team-top-results-rank","10")}
        </div>

        <!-- Column 3: GC / [Empty] -->
        <div style="grid-row: 1; grid-column: 3;">
          ${me("GC",d.teamStatsTopResultsFilters.gc,"linear-gradient(135deg, #facc15, #ca8a04)","#000","rgba(234, 179, 8, 0.4)","data-team-top-results-filter","gc")}
        </div>
        <div style="grid-row: 2; grid-column: 3;">
          <!-- Empty for GC single layout -->
        </div>

        <!-- Column 4: Punkte / Berg -->
        <div style="grid-row: 1; grid-column: 4;">
          ${me("Punkte",d.teamStatsTopResultsFilters.points,"linear-gradient(135deg, #4ade80, #16a34a)","#fff","rgba(74, 222, 128, 0.4)","data-team-top-results-filter","points")}
        </div>
        <div style="grid-row: 2; grid-column: 4;">
          ${me("Berg",d.teamStatsTopResultsFilters.mountain,"linear-gradient(135deg, #f87171, #dc2626)","#fff","rgba(239, 68, 68, 0.4)","data-team-top-results-filter","mountain")}
        </div>

        <!-- Column 5: Nachwuchs / Ausreißer -->
        <div style="grid-row: 1; grid-column: 5;">
          ${me("Nachwuchs",d.teamStatsTopResultsFilters.youth,"linear-gradient(135deg, #ffffff, #e2e8f0)","#0f172a","rgba(255, 255, 255, 0.4)","data-team-top-results-filter","youth")}
        </div>
        <div style="grid-row: 2; grid-column: 5;">
          ${me("Ausreißer",d.teamStatsTopResultsFilters.breakaway,"linear-gradient(135deg, #c084fc, #7c3aed)","#fff","rgba(168, 85, 247, 0.4)","data-team-top-results-filter","breakaway")}
        </div>

        <!-- Column 6: Etappen / One Day -->
        <div style="grid-row: 1; grid-column: 6;">
          ${me("Etappen",d.teamStatsTopResultsFilters.stage,"linear-gradient(135deg, #60a5fa, #2563eb)","#fff","rgba(59, 130, 246, 0.4)","data-team-top-results-filter","stage")}
        </div>
        <div style="grid-row: 2; grid-column: 6;">
          ${me("One Day",d.teamStatsTopResultsFilters.oneDay,"linear-gradient(135deg, #b91c1c, #7f1d1d)","#fff","rgba(185, 28, 28, 0.4)","data-team-top-results-filter","oneDay")}
        </div>
      </div>
    </div>
  `,p=o.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(u=>{const f=u.rowType!=="stage_result",g=f?`${u.raceName} · ${Or(u.rowType)}`:u.stageNumber&&u.isStageRace?`${u.raceName} · Etappe ${u.stageNumber}`:u.raceName;let b="–",h="–";u.finishStatus==="otl"?b=Gt("OTL","place"):u.finishStatus==="dnf"?b=Gt("DNF","place"):u.resultRank==null||(f?h=`<span class="rider-stats-final-type ${en(u.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${u.resultRank}</span>`:b=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${u.resultRank<=3?` rider-stats-rank-badge-top-${u.resultRank}`:""}">${S(String(u.resultRank))}</span>`);const y=u.profile?Ba(u.profile):"–",k=!f&&u.stageScore!=null&&u.stageScore>0?jr(u.stageScore,0,350):"–",w=Fr(u.raceCategoryName),M=u.riderCountryCode?Ae[u.riderCountryCode]??u.riderCountryCode.slice(0,2).toLowerCase():null,x=M?`<span class="fi fi-${M} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(u.riderCountryCode??"")}"></span>`:"–",E=Ee(u.riderName,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${b}</td>
            <td>${h}</td>
            <td>${x}</td>
            <td style="white-space: nowrap;">${E}</td>
            <td><strong>${S(g)}</strong></td>
            <td class="status-cell">${tn(u)}</td>
            <td>${y}</td>
            <td>${k}</td>
            <td>${w}</td>
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
  `}function ff(e){const t=String(d.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,superteamCount:0,categories:{}},r=t==="all",s=m=>r?m:"–",n=(m,u)=>r?`${m} / ${u} T`:"–",i=r?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(m,u,f,g)=>{const b=typeof m=="number"?m:parseFloat(String(m))||0;let h="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return b===0?h+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":u==="gold"?h+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":u==="silver"?h+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":u==="bronze"?h+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":u==="purple"?h+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":u==="green"?h+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":u==="red"?h+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":u==="white"&&(h+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${h}" title="${S(f)}: ${b} Siege">${m}</span>`},c=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
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
                ${Qs(m.key)}
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
                  ${pe(u.winFlat||0,"flat","Flach (Flat)")}
                  ${pe(u.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${pe(u.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${pe(u.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${pe(u.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${pe(u.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${pe(u.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${pe(u.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${pe(u.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${pe(u.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${pe(u.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${Fe(u.winWeather1||0,1,"Sonnig")}
                  ${Fe(u.winWeather2||0,2,"Extreme Hitze")}
                  ${Fe(u.winWeather3||0,3,"Leichter Regen")}
                  ${Fe(u.winWeather4||0,4,"Starkregen")}
                  ${Fe(u.winWeather5||0,5,"Starker Wind")}
                  ${Fe(u.winWeather6||0,6,"Dichter Nebel")}
                  ${Fe(u.winWeather7||0,7,"Schnee/Eis")}
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
  `}function hf(e){var m;const t=e.historyRosters||{},a=Object.keys(t).map(Number).sort((u,f)=>u-f);if(a.length===0)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Kader- und Vertragsdaten vorhanden</h3>
        <p>Für dieses Team wurden keine Verträge in der Datenbank erfasst.</p>
      </section>
    `;if(d.teamStatsSelectedRosterYear===null||!a.includes(d.teamStatsSelectedRosterYear)){const u=((m=d.gameState)==null?void 0:m.season)??2026;a.includes(u)?d.teamStatsSelectedRosterYear=u:d.teamStatsSelectedRosterYear=a[0]}const r=d.teamStatsSelectedRosterYear,n=[...t[r]||[]],i=d.teamStatsRosterSort.key,o=d.teamStatsRosterSort.direction;n.sort((u,f)=>{let g=0;if(i==="nationality"){const b=u.nationality||"",h=f.nationality||"";g=b.localeCompare(h,"de")}else if(i==="name"){const b=`${u.lastName||""}, ${u.firstName||""}`,h=`${f.lastName||""}, ${f.firstName||""}`;g=b.localeCompare(h,"de")}else if(i==="overallRating")g=(u.overallRating||0)-(f.overallRating||0);else if(i==="potential")g=(u.potential||0)-(f.potential||0);else if(i==="roleName"){const b=u.roleName||"",h=f.roleName||"";g=b.localeCompare(h,"de")}else i==="contractEndSeason"&&(g=(u.contractEndSeason||0)-(f.contractEndSeason||0));return o==="asc"?g:-g});const c=a.map(u=>`
    <option value="${u}" ${u===r?"selected":""}>Kader ${u}</option>
  `).join(""),l=u=>d.teamStatsRosterSort.key!==u?' <span style="opacity: 0.3; font-size: 0.75rem;">↕</span>':d.teamStatsRosterSort.direction==="asc"?' <span style="font-size: 0.75rem;">▲</span>':' <span style="font-size: 0.75rem;">▼</span>',p=n.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Fahrer für dieses Jahr unter Vertrag.</td></tr>':n.map(u=>{const f=u.nationality?Ae[u.nationality]??u.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(u.nationality)}"></span>`:"–",b=Ee(`${u.firstName} ${u.lastName}`,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),h=`<span class="results-roster-overall-badge" style="color:${Li(u.overallRating)}" title="Stärke: ${u.overallRating.toFixed(2)}">${u.overallRating.toFixed(1)}</span>`;let y="–";u.potential!=null&&(y=`<span class="results-roster-overall-badge" style="color:${Li(u.potential)}" title="Potential: ${u.potential.toFixed(2)}">${u.potential.toFixed(1)}</span>`);const k=S(u.roleName||"-"),w=u.contractEndSeason?`Saison ${u.contractEndSeason}`:"Ohne Vertrag",x=u.contractEndSeason===r?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${S(w)}</span>`:`<span style="font-weight: 500;">${S(w)}</span>`;return`
          <tr class="rider-stats-row">
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${g}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); white-space: nowrap;">${b}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${h}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">${y}</td>
            <td style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; color: #ccc;">${k}</td>
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
  `}function Li(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function cs(e){if(!e)return null;const t=e.toLowerCase();return t==="berg"||t==="climber"?"Berg":t==="hill"||t==="puncher"?"Hügel":t==="sprint"||t==="sprinter"?"Sprint":t==="timetrial"||t==="time_trial"||t==="time trialist"||t==="zf"?"Zeitfahren":t==="cobble"||t==="classic"||t==="pave"?"Cobble":e}function Di(e){if(!e)return 99;const t=e.toLowerCase().replace(/_/g," ").replace(/-/g," ");return t==="kapitaen"||t==="kapitän"?1:t==="co kapitaen"||t==="co kapitän"?2:t==="sprinter"?3:t==="edelhelfer"?4:t==="starke helfer"||t==="starker helfer"?5:t==="wassertraeger"||t==="wasserträger"?6:98}function bf(e){if(!e)return"Helfer";const t=e.toLowerCase().replace(/_/g," ").replace(/-/g," ");return t==="kapitaen"||t==="kapitän"?"Kapitän":t==="co kapitaen"||t==="co kapitän"?"Co-Kapitän":t==="sprinter"?"Sprinter":t==="edelhelfer"?"Edelhelfer":t==="starke helfer"||t==="starker helfer"?"Starker Helfer":t==="wassertraeger"||t==="wasserträger"?"Wasserträger":e}function yf(e){var f;const t=e.transfers||{},a=Object.keys(t).map(Number).sort((g,b)=>b-g);if(a.length===0)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Transferdaten vorhanden</h3>
        <p>Für dieses Team wurden keine Transfers erfasst.</p>
      </section>
    `;let r=typeof d.teamStatsSelectedSeason=="number"?d.teamStatsSelectedSeason:((f=d.gameState)==null?void 0:f.season)??2026;a.includes(r)||(r=a[0]);const s=a.map(g=>`
    <option value="${g}" ${g===r?"selected":""}>Saison ${g}</option>
  `).join(""),n=t[r]||{incoming:[],outgoing:[]},i=g=>{const b=[],h=cs(g.specialization1),y=cs(g.specialization2),k=cs(g.specialization3);return h&&b.push(h),y&&b.push(y),k&&b.push(k),b.length>0?b.join(" · "):"Allrounder"},o=(g,b)=>{const h=g.nationality?Ae[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,y=h?`<span class="fi fi-${h} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",k=i(g),w=Ee(`${g.firstName} ${g.lastName}`,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});let M="";if(b==="incoming")M=`<span style="color: #64748b; font-size: 0.8rem; font-weight: normal; margin-left: 0.35rem;">(${g.fromTeamName?S(g.fromTeamName):"Freier Fahrer"})</span>`;else{const x=g.toTeamName?`zu: ${g.toTeamName}`:g.isRetired?"Karriereende":"Freier Fahrer";M=`<span style="color: #64748b; font-size: 0.8rem; font-weight: normal; margin-left: 0.35rem;">(${S(x)})</span>`}return`
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); margin-bottom: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${y}
              ${w}
              ${M}
            </div>
            <div style="font-size: 0.8rem; color: #facc15; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; margin-top: 0.1rem; flex-wrap: wrap;">
              <span>${S(k)}</span>
            </div>
          </div>
        </div>
        <div style="text-align: right; flex-shrink: 0; margin-left: 0.5rem;">
          <div style="font-size: 0.85rem; font-weight: bold; color: #facc15;">${S(bf(g.roleName))}</div>
        </div>
      </div>
    `},c=g=>[...g].sort((b,h)=>{const y=Di(b.roleName),k=Di(h.roleName);return y!==k?y-k:(h.overallRating||0)-(b.overallRating||0)}),l=c(n.incoming),p=c(n.outgoing),m=l.length===0?'<div style="color: #64748b; font-style: italic; text-align: center; padding: 2rem;">Keine Zugänge in dieser Saison.</div>':l.map(g=>o(g,"incoming")).join(""),u=p.length===0?'<div style="color: #64748b; font-style: italic; text-align: center; padding: 2rem;">Keine Abgänge in dieser Saison.</div>':p.map(g=>o(g,"outgoing")).join("");return`
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
            ${m}
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
  `}function ze(e){return d.teamStatsTab==="career"?`
      ${rr(e)}
      ${sr()}
      ${ff(e)}
    `:d.teamStatsTab==="contracts"?`
      ${rr(e)}
      ${sr()}
      ${hf(e)}
    `:d.teamStatsTab==="transfers"?`
      ${rr(e)}
      ${sr()}
      ${yf(e)}
    `:`
    ${rr(e)}
    ${sr()}
    ${gf(e)}
  `}function vf(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((r=d.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${S(a)}" aria-label="${S(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S(Ls(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function vn(e){var n;d.teamStatsSelectedTeamId=e,d.teamStatsTab="topResults",d.teamStatsTopResultsFilterCategory=null,d.teamStatsTopResultsFilterSeason=null,d.teamStatsTopResultsFilterRank=null,d.teamStatsTopResultsFilterProfile=null,d.teamStatsSelectedSeason="all",d.teamStatsSelectedRosterYear=((n=d.gameState)==null?void 0:n.season)??2026,d.teamStatsRosterSort={key:"overallRating",direction:"desc"},d.teamStatsTopResultsPage=1;const t=d.teams.find(i=>i.id===e);v("team-stats-title").innerHTML=t?`Team <strong>${S(t.name)}</strong>`:"Teamstatistik",v("team-stats-jersey").innerHTML=vf(e,(t==null?void 0:t.name)??"");const a=pf(e),r=a.average.toFixed(2).replace(".",",");v("team-stats-meta").innerHTML=t?`${S(t.abbreviation)} · ${S(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${r})`:"Daten werden geladen",v("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,nt("teamStats");const s=await Y.getTeamStats(e);if(d.teamStatsSelectedTeamId===e){if(!s.success||!s.data){v("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}d.teamStatsPayload=s.data,v("team-stats-body").innerHTML=ze(s.data)}}function Sf(){v("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-top-results-rank]");if(a){const o=a.dataset.teamTopResultsRank,c=o==="all"?null:Number(o);d.teamStatsTopResultsFilterRank=d.teamStatsTopResultsFilterRank===c?null:c,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload));return}const r=t.closest("button[data-team-top-results-filter]");if(r){const o=r.dataset.teamTopResultsFilter;d.teamStatsTopResultsFilters[o]=!d.teamStatsTopResultsFilters[o],d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload));return}const s=t.closest("button[data-team-stats-tab]");if(s){const o=s.dataset.teamStatsTab;(o==="topResults"||o==="career"||o==="contracts"||o==="transfers")&&(d.teamStatsTab=o,d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload)));return}const n=t.closest("button[data-team-top-results-page]");if(n){const o=Number(n.dataset.teamTopResultsPage);!isNaN(o)&&o>=1&&(d.teamStatsTopResultsPage=o,d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload)));return}const i=t.closest("th[data-team-roster-sort]");if(i){const o=i.dataset.teamRosterSort;o&&(d.teamStatsRosterSort.key===o?d.teamStatsRosterSort.direction=d.teamStatsRosterSort.direction==="asc"?"desc":"asc":(d.teamStatsRosterSort.key=o,d.teamStatsRosterSort.direction=o==="overallRating"||o==="potential"||o==="contractEndSeason"?"desc":"asc"),d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload)));return}}),v("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;d.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;d.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload))}else if(t.id==="team-stats-filter-profile"){const a=t;d.teamStatsTopResultsFilterProfile=a.value==="all"?null:a.value,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;d.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload))}else if(t.id==="team-stats-roster-year-select"){const a=t;d.teamStatsSelectedRosterYear=Number(a.value),d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload))}else if(t.id==="team-stats-transfers-season-select"){const a=t;d.teamStatsSelectedSeason=Number(a.value),d.teamStatsPayload&&(v("team-stats-body").innerHTML=ze(d.teamStatsPayload))}})}let Vt="riders",ht="season",Sn="season",st="";const Dr=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function kf(){const e=v("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");xf(o)})})}const t=v("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");Tf(o)})})}Dr.forEach(n=>{const i=v(n);i&&i.addEventListener("change",()=>{const o=i.value;o?wf(o,n):Dr.some(l=>{const p=v(l);return p&&p.value!==""})||(st="",ca())})}),window.openRiderStatsFromLeaderboard=da,window.openTeamStatsFromLeaderboard=vn;const a=v("leaderboard-filter-wt"),r=v("leaderboard-filter-pt"),s=v("leaderboard-filter-other");[a,r,s].forEach(n=>{n&&n.addEventListener("change",()=>{ca()})})}function $f(){ca()}function xf(e){Vt=e;const t=v("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&((Mf(st)||st==="strongest_lieutenants")&&(Rf(),st=""),ht==="live"&&(ht=Sn,ur())),ca()}function Tf(e){ht=e,Sn=e,ca()}function wf(e,t){st=e,Dr.forEach(a=>{if(a!==t){const r=v(a);r&&(r.value="")}}),zl(e)?(ht="live",ur()):kn(e)?(ht="alltime",ur()):(ht=Sn,ur()),ca()}function zl(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function kn(e){return["max_short_term_fatigue","max_long_term_fatigue","max_combined_fatigue","max_s_form","max_r_form","max_combined_form","mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function Mf(e){return zl(e)||kn(e)||e==="mentors_ranking"}function Rf(){Dr.forEach(e=>{const t=v(e);t&&(t.value="")})}function ur(){const e=v("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');ht==="live"?e.style.display="none":(e.style.display="flex",kn(st)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),ht==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function ca(){var m,u,f;const e=v("leaderboard-empty"),t=v("leaderboard-table"),a=v("leaderboard-thead"),r=v("leaderboard-tbody");if(!e||!t||!a||!r)return;const s=v("leaderboard-filter-container");if(s&&(s.style.display=Vt==="teams"?"none":"flex"),!st){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await Y.getLeaderboards(Vt,st,ht);if(!ke("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(Vt==="riders"){const g=((m=v("leaderboard-filter-wt"))==null?void 0:m.checked)??!0,b=((u=v("leaderboard-filter-pt"))==null?void 0:u.checked)??!0,h=((f=v("leaderboard-filter-other"))==null?void 0:f.checked)??!1;if(i=n.data.filter(y=>{const k=y.teamDivisionId===1&&!y.isRetired,w=y.teamDivisionId===2&&!y.isRetired,M=y.teamDivisionId===null||y.teamDivisionId===void 0||y.isRetired||y.teamDivisionId!==1&&y.teamDivisionId!==2;return!!(k&&g||w&&b||M&&h)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const o=st==="highest_leadout_bonus",c=st==="strongest_lieutenants";Vt==="riders"?a.innerHTML=`
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
    `;let l="",p=1;for(const g of i){const b=p++,y=`<span class="badge ${b===1?"badge-primary":b<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${b}</span>`,k=bt(g.teamId,g.teamName);let w="";if(o){const x=g.stageNumber!=null?`Etappe ${g.stageNumber}`:"–";w=`<td style="vertical-align: middle;">${S(g.raceName??"–")} · ${S(x)} · ${S(String(g.season??"–"))}</td>`}let M="";if(c)if(g.lieutenantDetails){const x=g.lieutenantDetails,E=x.leaderNationality?le(x.leaderNationality):"",I=x.leaderRoleName?` (${x.leaderRoleName})`:"";M=`
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${E}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${x.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${S(x.leaderFirstName)} ${S(x.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${S(I)}</span>
            </span>
          </td>
        `}else M='<td style="vertical-align: middle;">–</td>';if(Vt==="riders"){const x=g.nationality?le(g.nationality):"—",E=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${g.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.firstName)} ${S(g.lastName)}</a>`,I=g.teamAbbr&&g.teamId!=null?`<a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #94a3b8; text-decoration: none; hover: text-decoration: underline;" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</a>`:g.teamAbbr?`<span class="text-muted" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</span>`:"—";l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${y}</td>
          <td style="text-align: center; vertical-align: middle;">${k}</td>
          <td style="text-align: center; vertical-align: middle;">${x}</td>
          <td style="vertical-align: middle;">${E}</td>
          <td style="vertical-align: middle;">${I}</td>
          ${w}
          ${M}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}else{let x="";if(g.leadoutDetails){const E=g.leadoutDetails,I=E.sprinterNationality?le(E.sprinterNationality):"";x=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">
            <a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
              ${S(g.teamName.split(" (Sprinter:")[0])}
            </a>
          </div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${I}${S(E.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${E.contributors.map(F=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${F.nationality?le(F.nationality):""}${S(F.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${F.contribution.toFixed(2)})</span>
                  </div>
                `).join("")}
            </div>
          </div>
        `}else x=`<strong><a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.teamName??"")}</a></strong>`;l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${y}</td>
          <td style="text-align: center; vertical-align: middle;">${k}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${x}</td>
          ${w}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}}r.innerHTML=l}let na=2026,Je=5,Ai=!1;const If=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function _i(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${r}`}function Cf(e){var s;const t=(s=d.gameState)==null?void 0:s.currentDate;if(!t||e<=t)return;const a=ne(e);confirm(`Möchtest du automatisch bis zum ${a} simulieren?`)&&(d.autoProgressTargetDate=e,Rl())}function Ff(e,t){const a=[],r=new Date(e,t,1),s=new Date(e,t+1,0);let i=(r.getDay()+6)%7;const o=new Date(r);o.setDate(o.getDate()-i);const c=new Date(o);for(;c<=s||c.getDay()!==1;){const l=[];for(let p=0;p<7;p++)l.push(new Date(c)),c.setDate(c.getDate()+1);a.push(l)}return a}function Ef(){if(Ai)return;Ai=!0,v("calendar-prev-month").addEventListener("click",()=>{Je--,Je<0&&(Je=11,na--),mr()}),v("calendar-next-month").addEventListener("click",()=>{Je++,Je>11&&(Je=0,na++),mr()}),v("calendar-today-btn").addEventListener("click",()=>{var t;if((t=d.gameState)!=null&&t.currentDate){const[a,r]=d.gameState.currentDate.split("-").map(Number);na=a,Je=r-1}mr()}),v("calendar-race-search").addEventListener("input",()=>{Gl()}),v("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&ws(s);return}const r=t.target.closest("[data-calendar-date]");if(r){const s=r.dataset.calendarDate;s&&Cf(s)}}),v("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&ws(r);return}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.remove("calendar-highlight")})}},!0))}function Pf(){var e;if((e=d.gameState)!=null&&e.currentDate){const[t,a]=d.gameState.currentDate.split("-").map(Number);na=t,Je=a-1}mr()}function mr(){var s;if(!ke("calendar"))return;v("calendar-month-label").textContent=`${If[Je]} ${na}`;const e=Ff(na,Je),t=v("calendar-weeks"),a=((s=d.gameState)==null?void 0:s.currentDate)??"";let r="";for(const n of e){const i=n.map(_i),o=[];for(const m of d.races)if(m.startDate<=i[6]&&m.endDate>=i[0]){const u=m.startDate<i[0]?0:i.indexOf(m.startDate),f=m.endDate>i[6]?6:i.indexOf(m.endDate);o.push({race:m,startIdx:u,endIdx:f})}o.sort((m,u)=>{const f=m.endIdx-m.startIdx+1,g=u.endIdx-u.startIdx+1;return g!==f?g-f:m.startIdx-u.startIdx});const c=Array.from({length:3},()=>Array(7).fill(!1));for(const m of o){let u=2;for(let f=0;f<3;f++){let g=!0;for(let b=m.startIdx;b<=m.endIdx;b++)if(c[f][b]){g=!1;break}if(g){u=f;break}}for(let f=m.startIdx;f<=m.endIdx;f++)c[u][f]=!0;m.slot=u}const l=n.map(m=>{const u=_i(m),f=m.getMonth()!==Je,g=u===a,b=u>a;return`
        <div class="${["calendar-day-cell",f?"other-month":"",g?"today":"",b?"is-future":""].filter(Boolean).join(" ")}" data-calendar-date="${u}">
          <span class="calendar-day-number" data-calendar-date="${u}">${m.getDate()}</span>
        </div>
      `}).join(""),p=o.map(m=>{var w;const u=m.race,f=a>=u.startDate&&a<=u.endDate,g=a>u.endDate,b=dt((w=u.category)==null?void 0:w.name),h=f?'<span class="calendar-live-dot"></span>':"",y=g?"opacity: 0.55;":"",k=m.endIdx-m.startIdx+1;return`
        <div class="calendar-event-bar ${f?"is-live":""}"
             data-race-id="${u.id}"
             style="grid-column: ${m.startIdx+1} / span ${k};
                    grid-row: ${m.slot+1};
                    background-color: ${b.background};
                    border: 1px solid ${b.border};
                    color: ${b.color};
                    ${y}"
             title="${S(u.name)} (${ne(u.startDate)} - ${ne(u.endDate)})">
          ${h}<span class="calendar-event-name">${S(u.name)}</span>
        </div>
      `}).join("");r+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${p}</div>
      </div>
    `}t.innerHTML=r,Gl()}function Gl(){var n;const e=v("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=v("calendar-races-tbody"),r=((n=d.gameState)==null?void 0:n.currentDate)??"",s=d.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(s.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=s.map(i=>{var h,y,k,w;const o=r>=i.startDate&&r<=i.endDate,l=r>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',p=((h=i.country)==null?void 0:h.name)??`Land ${i.countryId}`,m=(y=i.country)!=null&&y.code3?le(i.country.code3):"",u=i.isStageRace?(i.stages??[]).reduce((M,x)=>M+(x.distanceKm??0),0):((k=i.upcomingStage)==null?void 0:k.distanceKm)??null,f=i.isStageRace?(i.stages??[]).reduce((M,x)=>M+(x.elevationGainMeters??0),0):((w=i.upcomingStage)==null?void 0:w.elevationGainMeters)??null,g=u!=null?String(u.toFixed(1)).replace(".",","):"-",b=f!=null?String(Math.round(f)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${ne(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${S(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${mn(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${m}<span>${S(p)}</span></span></td>
        <td>${Wr(i)}</td>
        <td>${g}</td>
        <td>${b}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}let xt=null,Tt=null,Xe="id",$a=!0;function Kt(e){const t=new Date(e);t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));const a=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t.getTime()-a.getTime())/864e5+1)/7)}function Jr(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return"peak";const r=n=>{const i=n-8,o=n-1;if(i>=1)return t>=i&&t<=o;{const c=i+53;return t>=c||t<=o}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)?"prep":"none"}function Kl(e){return e==="peak"?"cell-peak":e==="prep"?"cell-prep":""}function Bi(e,t){const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${o}`,l=Kt(c),p=Jr(e,l);if(p==="peak"||p==="prep")return!0}return!1}function Nf(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return!0;const r=s=>{const n=s-6,i=s-1;if(n>=1)return t>=n&&t<=i;{const o=n+53;return t>=o||t<=i}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)}function Lf(e,t){const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${o}`,l=Kt(c);if(Nf(e,l))return!0}return!1}function jl(e,t,a){const r=[{min:e.peak1_min,max:e.peak1_max},{min:e.peak2_min,max:e.peak2_max},{min:e.peak3_min,max:e.peak3_max}].sort((l,p)=>l.min-p.min);let s=0,n=0,i=0,o=0;const c=a.races.filter(l=>t.has(l.id));for(const l of c){const p=new Date(l.start_date),m=new Date(l.end_date);for(let u=new Date(p);u<=m;u.setDate(u.getDate()+1)){const f=u.getFullYear(),g=String(u.getMonth()+1).padStart(2,"0"),b=String(u.getDate()).padStart(2,"0"),h=`${f}-${g}-${b}`,y=Kt(h);y<=r[0].max?s++:y<=r[1].max?n++:y<=r[2].max?i++:o++}}return{phase1:s,phase2:n,phase3:i,phase4:o}}function Df(e,t,a){const r=new Set(a.raceProgramRaces.filter(p=>p.program_id===e.id&&p.race_id!==t.id).map(p=>p.race_id)),s=jl(e,r,a),n=new Set,i=new Date(t.start_date),o=new Date(t.end_date),c=[{min:e.peak1_min,max:e.peak1_max},{min:e.peak2_min,max:e.peak2_max},{min:e.peak3_min,max:e.peak3_max}].sort((p,m)=>p.min-m.min);for(let p=new Date(i);p<=o;p.setDate(p.getDate()+1)){const m=p.getFullYear(),u=String(p.getMonth()+1).padStart(2,"0"),f=String(p.getDate()).padStart(2,"0"),g=`${m}-${u}-${f}`,b=Kt(g);b<=c[0].max?n.add("phase1"):b<=c[1].max?n.add("phase2"):b<=c[2].max?n.add("phase3"):n.add("phase4")}const l=t.is_stage_race===1;for(const p of n)if(p==="phase1"){if(l&&s.phase1>35||!l&&s.phase1>36)return!1}else if(p==="phase2"){if(l&&s.phase2>35||!l&&s.phase2>36)return!1}else if(p==="phase3"&&(l&&s.phase3>35||!l&&s.phase3>36))return!1;return!0}function Af(e,t){const a=d.raceProgramsPayload;if(!a)return;const r=a.raceProgramRaces.findIndex(s=>s.program_id===e&&s.race_id===t);if(r===-1){const s=a.races.find(n=>n.id===t);if(s){const n=s.start_date,i=s.end_date,o=[];a.raceProgramRaces.forEach((c,l)=>{if(c.program_id===e&&c.race_id!==t){const p=a.races.find(m=>m.id===c.race_id);p&&p.start_date<=i&&p.end_date>=n&&o.push(l)}}),o.sort((c,l)=>l-c).forEach(c=>{a.raceProgramRaces.splice(c,1)})}a.raceProgramRaces.push({program_id:e,race_id:t})}else a.raceProgramRaces.splice(r,1);d.raceProgramsDirty=!0,De()}const Fs=(()=>{const e=[],t=new Date(2026,0,1),a=new Date(2026,11,31),r=["So","Mo","Di","Mi","Do","Fr","Sa"];for(let s=new Date(t);s<=a;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${o}`,l=`${r[s.getDay()]}, ${o}.${String(s.getMonth()+1).padStart(2,"0")}`;e.push({dateStr:c,label:l,weekNum:Kt(c)})}return e})();async function $n(e=!1){if(d.raceProgramsPayload&&!e){De();return}v("race-programs-root").innerHTML='<div class="results-empty">Programmdaten werden geladen...</div>';const t=await Y.getRaceProgramsEditor();if(!t.success||!t.data){v("race-programs-root").innerHTML=`<div class="results-empty text-danger">${S(t.error??"Fehler beim Laden.")}</div>`;return}d.raceProgramsPayload=t.data,d.raceProgramsDirty=!1,d.raceProgramsSaving=!1,xt=null,Tt=null,De()}function _f(){v("view-race-programs").addEventListener("click",e=>{const t=e.target,a=t.closest(".results-type-btn[data-tab]");if(a){const m=a.dataset.tab??"calendar-cols";d.raceProgramsActiveTab=m,De();return}const r=t.closest(".race-programs-action-btn");if(r){const m=r.dataset.action;m==="reload"?$n(!0):m==="save"&&Gf();return}const s=t.closest(".race-row-expand-btn");if(s){const m=s.dataset.raceId,u=v(`race-details-row-${m}`);u&&(u.classList.toggle("hidden"),s.textContent=u.classList.contains("hidden")?"▶":"▼");return}const n=t.closest(".program-row-expand-btn");if(n){const m=n.dataset.programId,u=v(`program-details-row-${m}`);u&&(u.classList.toggle("hidden"),n.textContent=u.classList.contains("hidden")?"▶":"▼");return}const i=t.closest(".program-roles-sort-header");if(i){const m=i.dataset.sortKey;Xe===m?$a=!$a:(Xe=m,$a=m==="name"||m==="id"),De();return}const o=t.closest(".combo-origin-trigger");if(o){const m=o.dataset.raceId,u=o.dataset.comboKey,f=v(`combo-origin-${m}-${u}`);f&&f.classList.toggle("hidden");return}const c=t.closest(".race-popover-trigger");if(c){e.stopPropagation();const m=parseInt(c.dataset.raceId??"0",10);Tt=null,xt===m?xt=null:xt=m,De();return}const l=t.closest(".race-rider-count-trigger");if(l){e.stopPropagation();const m=parseInt(l.dataset.raceId??"0",10);xt=null,Tt===m?Tt=null:Tt=m,De();return}const p=t.closest(".popover-program-toggle");if(p){if(e.stopPropagation(),p.classList.contains("disabled"))return;const m=parseInt(p.dataset.programId??"0",10),u=parseInt(p.dataset.raceId??"0",10);Af(m,u);return}!t.closest(".race-stages-popover-card")&&!t.closest(".race-rider-programs-popover-card")&&(xt!==null||Tt!==null)&&(xt=null,Tt=null,De())}),v("view-race-programs").addEventListener("click",e=>{const t=e.target.closest(".toggleable-race-cell[data-day]");if(!t)return;const a=t.dataset.day,r=parseInt(t.dataset.programId,10);zf(r,a)}),v("view-race-programs").addEventListener("change",e=>{const t=e.target;if(t.classList.contains("peak-date-picker")){const a=parseInt(t.dataset.programId,10),r=parseInt(t.dataset.peak,10),s=t.value;if(s){const n=Kt(s);Hf(a,r,n)}return}if(t.classList.contains("peak-number-input")){const a=parseInt(t.dataset.programId,10),r=t.dataset.field,s=parseInt(t.value||"1",10);Bf(a,r,s)}})}function Bf(e,t,a){const r=d.raceProgramsPayload;if(!r)return;const s=r.programs.find(i=>i.id===e);if(!s)return;const n=Math.max(1,Math.min(53,a));if(s[t]=n,t.endsWith("_min")){const i=t.replace("_min","_max");s[i]<n&&(s[i]=n)}else if(t.endsWith("_max")){const i=t.replace("_max","_min");s[i]>n&&(s[i]=n)}d.raceProgramsDirty=!0,De()}function Hf(e,t,a){const r=d.raceProgramsPayload;if(!r)return;const s=r.programs.find(o=>o.id===e);if(!s)return;const n=`peak${t}_min`,i=`peak${t}_max`;s[n]=Math.max(1,a-2),s[i]=Math.min(53,a+2),d.raceProgramsDirty=!0,De()}function zf(e,t){const a=d.raceProgramsPayload;if(!a)return;const r=a.races.filter(n=>n.start_date<=t&&n.end_date>=t);if(r.length===0)return;const s=a.raceProgramRaces.findIndex(n=>n.program_id===e&&r.some(i=>i.id===n.race_id));if(s===-1)a.raceProgramRaces.push({program_id:e,race_id:r[0].id});else{const n=a.raceProgramRaces[s],i=r.findIndex(o=>o.id===n.race_id);i<r.length-1?n.race_id=r[i+1].id:a.raceProgramRaces.splice(s,1)}d.raceProgramsDirty=!0,De()}async function Gf(){if(!d.raceProgramsPayload||d.raceProgramsSaving)return;d.raceProgramsSaving=!0,De();const e=await Y.saveRaceProgramsEditor({programs:d.raceProgramsPayload.programs,raceProgramRaces:d.raceProgramsPayload.raceProgramRaces});if(d.raceProgramsSaving=!1,!e.success){alert(`Fehler beim Speichern:
${e.error??"Unbekannter Fehler"}`),De();return}d.raceProgramsDirty=!1,$n(!0)}function qr(e,t){let a=0,r=0,s=0;const n=new Set(t.raceProgramRaces.filter(o=>o.program_id===e.id).map(o=>o.race_id)),i=t.races.filter(o=>n.has(o.id));for(const o of i){const c=new Date(o.start_date),l=new Date(o.end_date);for(let p=new Date(c);p<=l;p.setDate(p.getDate()+1)){const m=p.getFullYear(),u=String(p.getMonth()+1).padStart(2,"0"),f=String(p.getDate()).padStart(2,"0"),g=Kt(`${m}-${u}-${f}`),b=Jr(e,g);b==="peak"?a++:b==="prep"?r++:s++}}return{peak:a,prep:r,none:s}}function De(){const e=v("race-programs-root"),t=d.raceProgramsPayload;if(!t){e.innerHTML='<div class="results-empty">Keine Daten geladen.</div>';return}const a=window.scrollX,r=window.scrollY,s={},n=document.querySelector(".team-detail-table-scroll");n&&(s.table={scrollTop:n.scrollTop,scrollLeft:n.scrollLeft}),document.querySelectorAll(".popover-program-list-scroll").forEach(f=>{const g=f.getAttribute("data-race-id");g&&(s[`popover-${g}`]={scrollTop:f.scrollTop,scrollLeft:f.scrollLeft})});const o=d.raceProgramsDirty,c=d.raceProgramsSaving,l=d.raceProgramsActiveTab;let p=`
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
  `;l==="calendar-cols"?p+=Kf(t):l==="calendar-rows"?p+=jf(t):l==="peak-editor"?p+=Of(t):l==="rider-role"?p+=Vf(t):l==="program-roles"&&(p+=Yf(t)),p+="</div>",e.innerHTML=p;const m=document.querySelector(".team-detail-table-scroll");m&&s.table&&(m.scrollTop=s.table.scrollTop,m.scrollLeft=s.table.scrollLeft),document.querySelectorAll(".popover-program-list-scroll").forEach(f=>{const g=f.getAttribute("data-race-id");g&&s[`popover-${g}`]&&(f.scrollTop=s[`popover-${g}`].scrollTop,f.scrollLeft=s[`popover-${g}`].scrollLeft)}),window.scrollTo(a,r)}function Kf(e){var o,c,l;const t=e.programs,a=e.raceProgramRaces,r=e.races,s=t.map(p=>({id:p.id,stats:qr(p,e)}));let n=`<tr>
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
    `}n+="</tr>";let i="";for(const p of Fs){const m=r.filter(h=>h.start_date<=p.dateStr&&h.end_date>=p.dateStr),u=m.length>0,f=u?"row-has-races":"";let g="";if(u){g='<div style="display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.15rem;">';for(const h of m){const y=dt((c=h.category)==null?void 0:c.name);g+=`
          <span class="race-id-badge" style="background-color: ${y.background}; border: 1px solid ${y.border}; color: ${y.color}; font-size: 0.65rem; padding: 0.05rem 0.2rem; text-align: left; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${S(h.name)}">
            ${S(h.name)}
          </span>
        `}g+="</div>"}let b=`
      <td class="sticky-col ${f}" style="font-weight: 600; vertical-align: top; padding: 0.4rem 0.6rem;">
        <div>${p.label}</div>
        ${g}
      </td>
      <td style="text-align: center; color: var(--text-500); font-variant-numeric: tabular-nums; vertical-align: top; padding-top: 0.4rem;">${p.weekNum}</td>
    `;for(const h of t){const y=Jr(h,p.weekNum),k=Kl(y),w=a.find(I=>I.program_id===h.id&&m.some(F=>F.id===I.race_id));let M="",x=`toggleable-race-cell ${k}`,E=`data-day="${p.dateStr}" data-program-id="${h.id}"`;if(w){const I=r.find(R=>R.id===w.race_id),F=dt((l=I==null?void 0:I.category)==null?void 0:l.name);M=`
          <span class="race-program-badge" style="background-color: ${F.background}; border: 1px solid ${F.border}; color: ${F.color};" title="${S(I==null?void 0:I.name)}">
            ${S(I==null?void 0:I.name)}
          </span>
        `}else u?M='<span class="race-cell-placeholder" title="Klicken zum Zuweisen">＋</span>':(x=k,E="");b+=`<td class="${x}" ${E} style="text-align: center; vertical-align: middle;">${M}</td>`}i+=`<tr>${b}</tr>`}return`
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
  `}function jf(e){var f;const t=e.programs,a=e.raceProgramRaces,r=e.races;let s='<th class="sticky-col-header" style="z-index: 15;">Monat</th>',n='<th class="sticky-col-header" style="z-index: 15;">Tag / KW</th>',i='<th class="sticky-col-header" style="z-index: 15;">Rennen Anzahl</th>',o='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #1</th>',c='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #2</th>',l='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #3</th>';const p=[],m=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];for(const g of Fs){const b=parseInt(g.dateStr.split("-")[1],10)-1,h=m[b];p.length===0||p[p.length-1].name!==h?p.push({name:h,span:1}):p[p.length-1].span++;const y=r.filter(E=>E.start_date<=g.dateStr&&E.end_date>=g.dateStr),k=y.length>0,w=k?`${y.length} R`:"",M=k?"race-count-active":"";n+=`<th style="text-align: center; min-width: 40px; font-variant-numeric: tabular-nums;">
      <div style="font-size: 0.8rem; font-weight: bold;">${g.dateStr.split("-")[2]}</div>
      <div style="font-size: 0.65rem; color: var(--text-500);">W${g.weekNum}</div>
    </th>`,i+=`<th class="${M}" style="text-align: center; font-size: 0.72rem; font-weight: bold;">${w}</th>`;const x=E=>{var N;const I=y[E];if(!I)return"";const F=dt((N=I.category)==null?void 0:N.name),R=a.filter(P=>P.race_id===I.id).length;return`
        <span class="race-id-badge" style="background-color: ${F.background}; border: 1px solid ${F.border}; color: ${F.color}; cursor: help;" 
              title="${S(I.name)}
Zugelassene Programme: ${R}">
          R${I.id}
        </span>
      `};o+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${x(0)}</th>`,c+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${x(1)}</th>`,l+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${x(2)}</th>`}for(const g of p)s+=`<th colspan="${g.span}" style="text-align: center; font-weight: bold; border-left: 1px solid var(--border);">${g.name}</th>`;let u="";for(const g of t){const b=qr(g,e);let h=`
      <td class="sticky-col" style="z-index: 5; white-space: nowrap; font-weight: bold; border-right: 2px solid var(--border);">
        <div style="font-size: 0.85rem;">${S(g.name)}</div>
        <div class="text-muted" style="font-size: 0.7rem; font-weight: normal; margin-top: 0.1rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${b.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${b.prep}</span> | 
          O: <span>${b.none}</span>
        </div>
      </td>
    `;for(const y of Fs){const k=Jr(g,y.weekNum),w=Kl(k),M=r.filter(N=>N.start_date<=y.dateStr&&N.end_date>=y.dateStr),x=M.length>0,E=a.find(N=>N.program_id===g.id&&M.some(P=>P.id===N.race_id));let I="",F=`toggleable-race-cell ${w}`,R=`data-day="${y.dateStr}" data-program-id="${g.id}"`;if(E){const N=r.find(B=>B.id===E.race_id),P=dt((f=N==null?void 0:N.category)==null?void 0:f.name);I=`
          <span class="race-id-badge" style="background-color: ${P.background}; border: 1px solid ${P.border}; color: ${P.color};" title="${S(N==null?void 0:N.name)}">
            R${N==null?void 0:N.id}
          </span>
        `}else x?I='<span style="font-size: 0.72rem; color: var(--text-500); opacity: 0.5;">＋</span>':(F=w,R="");h+=`<td class="${F}" ${R} style="text-align: center; vertical-align: middle; padding: 0.35rem 0;">${I}</td>`}u+=`<tr>${h}</tr>`}return`
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
  `}function Of(e){return`
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
  `}function Wf(e,t){const a=t.filter(o=>o.race_id===e).sort((o,c)=>o.stage_number-c.stage_number);if(a.length===0)return{countHtml:"Keine Etappen",stagesListHtml:"Keine Etappendaten vorhanden."};const r={};for(const o of a)r[o.profile]=(r[o.profile]||0)+1;const n=Object.entries(r).sort((o,c)=>c[1]-o[1]).map(([o,c])=>`${S(o)}: ${c}x`).join("<br>"),i=a.map(o=>`
    <div class="popover-stage-row">
      <span class="popover-stage-num">Et. ${o.stage_number}:</span>
      <span class="popover-stage-profile">${S(o.profile)}</span>
    </div>
  `).join("");return{countHtml:n,stagesListHtml:i}}function Vf(e){const t=[...e.races].sort((i,o)=>i.start_date.localeCompare(o.start_date)),a=e.raceProgramRaces,r=e.stages,s=e.programDistribution;return`
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
            ${t.map(i=>{const o=new Set(a.filter($=>$.race_id===i.id).map($=>$.program_id)),c=s.filter($=>o.has($.program_id)),m=e.programs.map($=>{const _=a.some(St=>St.program_id===$.id&&St.race_id===i.id),K=s.find(St=>St.program_id===$.id),O=K?parseInt(K.deterministic_rider_count||"0",10):0,ie=K?parseInt(K.deterministic_role_Kapitaen||"0",10):0,ge=K?parseInt(K.deterministic_role_Co_Kapitaen||"0",10):0,be=K?parseInt(K.deterministic_role_Edelhelfer||"0",10):0,we=K?parseInt(K.deterministic_role_Starke_Helfer||"0",10):0,ye=K?parseInt(K.deterministic_role_Wassertraeger||"0",10):0,Ie=K?parseInt(K.deterministic_role_Sprinter||"0",10):0,ce=[];ie>0&&ce.push(`${ie} Kapitän`),ge>0&&ce.push(`${ge} Co-Kapitän`),be>0&&ce.push(`${be} Edelhelfer`),we>0&&ce.push(`${we} Starke Helfer`),ye>0&&ce.push(`${ye} Wasserträger`),Ie>0&&ce.push(`${Ie} Sprinter`);const We=ce.length>0?`(${ce.join(", ")})`:"",oe=qr($,e),ua=oe.peak+oe.prep+oe.none;return{program:$,isAssigned:_,count:O,rolesStr:We,totalDays:ua}}).sort(($,_)=>$.isAssigned!==_.isAssigned?$.isAssigned?-1:1:_.count-$.count).filter($=>Bi($.program,i)||$.isAssigned).map($=>{const _=$.program,K=Bi(_,i);let O="";K||(O='<span style="color: #fb923c; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(251, 146, 60, 0.15); border: 1px solid #fb923c; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb der Peak- und Aufbauphase dieses Programms!">!</span>');let ie="";Lf(_,i)||(ie='<span style="color: #c084fc; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(192, 132, 252, 0.15); border: 1px solid #c084fc; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb des Peakbereichs und der 6-wöchigen Anstiegsphase dieses Programms!">!</span>');let be="";Df(_,i,e)||(be='<span style="color: #38bdf8; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; border-radius: 50%; font-size: 0.65rem;" title="Achtung: Dieses Programm hat in diesem Saisonabschnitt bereits das Limit an Renntagen erreicht (max. 36 Tage bzw. 35 Tage für Rundfahrten)!">!</span>');let ye="";if(!$.isAssigned){const ma=a.filter(Me=>Me.program_id===_.id&&Me.race_id!==i.id).map(Me=>e.races.find(Lt=>Lt.id===Me.race_id)).filter(Me=>Me&&Me.start_date<=i.end_date&&Me.end_date>=i.start_date);if(ma.length>0){const Me=ma.map(Lt=>Lt.name).join(", ");ye=`<span style="color: #ef4444; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 50%; font-size: 0.65rem;" title="Kollision: Dieses Programm ist bereits einem zeitlich parallelen Rennen zugewiesen: ${S(Me)}!">!</span>`}}const Ie=$.isAssigned?"font-weight: bold; color: var(--text-100);":"color: var(--text-500);",ce=$.isAssigned?"☑":"☐",We=K||$.isAssigned,oe=We?"cursor: pointer;":"cursor: not-allowed; opacity: 0.4; pointer-events: none;";return`
        <div class="popover-program-toggle${We?"":" disabled"}" data-program-id="${_.id}" data-race-id="${i.id}" 
             style="${oe} padding: 0.45rem 0.6rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); transition: background-color 0.15s; white-space: nowrap;"
             onmouseover="${We?"this.style.backgroundColor='rgba(99, 102, 241, 0.08)'":""}"
             onmouseout="this.style.backgroundColor='transparent'">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
            <span style="font-size: 1.15rem; line-height: 1; user-select: none; color: ${$.isAssigned?"var(--accent-h)":"var(--text-500)"};">${ce}</span>
            <span style="${Ie} font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis;" title="${S(_.name)} (${$.totalDays} Renntage)">
              ${S(_.name)} (${$.totalDays} RT)
            </span>
            ${O}
            ${ie}
            ${be}
            ${ye}
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;">
            <strong style="font-size: 0.8rem; color: var(--accent-h);">${$.count} Fahrer</strong>
            <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal;" title="${S($.rolesStr)}">${S($.rolesStr)}</span>
          </div>
        </div>
      `}).join(""),u=Tt===i.id;let f=0,g=0,b=0,h=0,y=0,k=0,w=0;const M={Kapitaen:{},Co_Kapitaen:{},Sprinter:{},Edelhelfer:{},Starke_Helfer:{},Wassertraeger:{}},x=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],E=["Berg","Hill","Sprint","Timetrial","Cobble","Attacker"];for(const $ of c){f+=parseInt($.deterministic_rider_count||"0",10),g+=parseInt($.deterministic_role_Kapitaen||"0",10),b+=parseInt($.deterministic_role_Co_Kapitaen||"0",10),h+=parseInt($.deterministic_role_Sprinter||"0",10),y+=parseInt($.deterministic_role_Edelhelfer||"0",10),k+=parseInt($.deterministic_role_Starke_Helfer||"0",10),w+=parseInt($.deterministic_role_Wassertraeger||"0",10);for(const _ of x)for(const K of E){const O=`deterministic_${_}_spec1_${K}`,ie=parseInt($[O]||"0",10);M[_][K]=(M[_][K]||0)+ie}}let I=0;i.is_stage_race===1&&(I=r.filter(_=>_.race_id===i.id).filter(_=>{const K=(_.profile||"").toLowerCase();return K==="flat"||K==="rolling"}).length);let F=!1,R=0;if(i.is_stage_race===0){const $=r.find(K=>K.race_id===i.id),_=(($==null?void 0:$.profile)||"").toLowerCase();F=_==="cobble"||_==="cobble_hill",F&&(R=(e.roleSpecCombinations||[]).filter(O=>o.has(O.program_id)).filter(O=>O.spec1==="Cobble"||O.spec2==="Cobble"||O.spec3==="Cobble").reduce((O,ie)=>O+ie.count,0))}let N="<strong>Rennprogramme verwalten</strong>";i.is_stage_race===0&&F?N=`
        <strong>Rennprogramme verwalten 
          (<span style="color: ${R<20?"#ef4444":"var(--accent-h)"}; font-weight: bold;" title="Kopfsteinpflaster-Spezialisten: ${R} / min. 20">Gesamtfahrer: ${f}</span>)
        </strong>
      `:N=`<strong>Rennprogramme verwalten (Gesamtfahrer: ${f})</strong>`;const P=`
      <div class="race-rider-programs-popover-card ${u?"":"hidden"}"
           style="position: absolute; top: calc(100% + 0.45rem); right: 0; z-index: 120; min-width: 600px; max-width: 750px; padding: 0.8rem 0.9rem; border: 1px solid rgba(148, 163, 184, 0.18); border-radius: var(--radius-md); background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%); box-shadow: var(--shadow); text-align: left; font-weight: normal;">
        <div class="popover-head" style="border-bottom: 1px solid rgba(148, 163, 184, 0.12); padding-bottom: 0.4rem; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
          ${N}
          <span style="font-size: 0.65rem; font-weight: normal; color: var(--text-500);">Klicken zum Aktivieren</span>
        </div>
        <div class="popover-program-list-scroll" data-race-id="${i.id}" style="display: flex; flex-direction: column; gap: 0.2rem; max-height: 350px; overflow-y: auto;">
          ${m}
        </div>
      </div>
    `;let B="text-align: center; font-variant-numeric: tabular-nums;";i.is_stage_race===1&&I>=2&&(h<=7?B+=" background-color: rgba(239, 68, 68, 0.2); color: #ef4444; font-weight: bold;":h>7&&h<10&&(B+=" background-color: rgba(234, 179, 8, 0.2); color: #eab308; font-weight: bold;"));let G="position: relative; text-align: center; font-variant-numeric: tabular-nums; vertical-align: middle;",z="font-weight: bold; border: none; background: transparent; padding: 0.15rem 0.4rem; cursor: pointer; color: var(--accent-h); text-decoration: underline;";i.is_stage_race===0&&F&&R<20&&(G+=" background-color: rgba(239, 68, 68, 0.2);",z+=" color: #ef4444; font-weight: bold;");const C=`
      <button type="button" class="race-rider-count-trigger btn-link" data-race-id="${i.id}" 
              style="${z}">
        ${f}
      </button>
    `;let H="—";if(i.is_stage_race===0){const $=r.find(_=>_.race_id===i.id);H=($==null?void 0:$.profile)??"Flat"}let U="",V=`<strong>${S(i.name)}</strong>`;if(i.is_stage_race===1){const $=xt===i.id,{countHtml:_,stagesListHtml:K}=Wf(i.id,r);U=`
        <div class="race-stages-popover-card ${$?"":"hidden"}">
          <div class="popover-head"><strong>${S(i.name)}</strong> - Etappen</div>
          <div class="popover-stages-list">${K}</div>
          <div class="popover-separator"></div>
          <div class="popover-head">Profile Zusammenfassung</div>
          <div class="popover-profiles-summary">${_}</div>
        </div>
      `,V=`
        <button type="button" class="race-popover-trigger btn-link" data-race-id="${i.id}" style="text-align: left; font-weight: bold; border: none; background: transparent; padding: 0; cursor: pointer; color: var(--accent-h);">
          ${S(i.name)}
        </button>
      `}let X=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"];if(i.is_stage_race===0){const $=r.find(K=>K.race_id===i.id),_=(($==null?void 0:$.profile)??"").toLowerCase();_.includes("cobble")?X=["Cobble","Sprint","Hill","Attacker","Timetrial","Berg"]:(_.includes("flat")||_.includes("rolling"))&&(X=["Sprint","Timetrial","Attacker","Hill","Cobble","Berg"])}const J=[],te=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],W={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},L={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},A=(e.roleSpecCombinations||[]).filter($=>o.has($.program_id)),D=new Map;for(const $ of A){const _=$.spec2||"—",K=`${$.role}|${$.spec1}|${_}`;D.set(K,(D.get(K)||0)+$.count)}const Z=[...D.entries()].map(([$,_])=>{const[K,O,ie]=$.split("|");return{role:K,spec1:O,spec2:ie,count:_}}).sort(($,_)=>{const K=te.indexOf($.role)-te.indexOf(_.role);if(K!==0)return K;const O=X.indexOf($.spec1)-X.indexOf(_.spec1);return O!==0?O:_.count-$.count}),j=($,_)=>{const K=L[$]??$,O=_!=="—"?L[_]??_:"—";return`${K} / ${O}`};for(const $ of Z)if($.count>0){const _=$.spec1==="Berg"&&$.spec2==="Cobble"||$.spec1==="Cobble"&&$.spec2==="Berg",K=_?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",O=_?"color: #f97316; font-weight: bold;":"color: var(--text-100);",ie=_?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",ge=`${$.role}_${$.spec1}_${$.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`,we=A.filter(ye=>ye.role===$.role&&ye.spec1===$.spec1&&(ye.spec2||"—")===$.spec2).map(ye=>{const Ie=e.programs.find(ce=>ce.id===ye.program_id);return`<span style="white-space: nowrap; margin-right: 0.8rem;">${S((Ie==null?void 0:Ie.name)??"Unbekannt")}: <strong>${ye.count}</strong></span>`}).join(" ");J.push(`
          <div style="${K}">
            <span style="${O}">${W[$.role]||$.role} <span class="text-muted">(${j($.spec1,$.spec2)})</span></span>
            <strong style="${ie} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="${i.id}" data-combo-key="${ge}">
              ${$.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-${i.id}-${ge}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: ${we}
          </div>
        `)}const T=J.length>0?J.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost race-row-expand-btn" data-race-id="${i.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td>${ne(i.start_date)}</td>
        <td class="race-programs-popup-anchor" style="position: relative; vertical-align: middle;">
          ${V}
          ${U}
        </td>
        <td style="font-weight: bold; color: var(--accent-h); text-align: center;">${H}</td>
        <td class="race-programs-popup-anchor" style="${G}">
          ${C}
          ${P}
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${g}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${b}</td>
        <td style="${B}">${h}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${y}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${k}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${w}</td>
      </tr>
      <tr id="race-details-row-${i.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
        <td colspan="11" style="padding: 0.5rem 1.5rem;">
          <div style="max-width: 450px; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
            <div style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; font-weight: bold; background: rgba(99,102,241,0.08); color: var(--text-100);">Zusammensetzung (Rolle / Spezialisierung)</div>
            ${T}
          </div>
        </td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function Ol(e){return Xe!==e?'<span style="opacity:0.35; margin-left:4px;">↕</span>':`<span style="color:var(--accent-h); margin-left:4px; font-weight:bold;">${$a?"↑":"↓"}</span>`}function pt(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${Xe===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
        <span>${S(t)}</span>
        ${Ol(e)}
      </div>
    </th>
  `}function Uf(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${Xe===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: flex-start; gap: 2px;">
        <span>${S(t)}</span>
        ${Ol(e)}
      </div>
    </th>
  `}function Yf(e){const t=e.programs,a=e.roleSpecCombinations||[],r={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},s={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},n=t.map(o=>{const c=a.filter(f=>f.program_id===o.id);let l=0;const p={Kapitaen:0,Co_Kapitaen:0,Sprinter:0,Edelhelfer:0,Starke_Helfer:0,Wassertraeger:0};for(const f of c)l+=f.count,p[f.role]!==void 0&&(p[f.role]+=f.count);const m=qr(o,e),u=m.peak+m.prep+m.none;return{program:o,totalRiders:l,roleCounts:p,progCombos:c,raceDays:u}});n.sort((o,c)=>{let l=0;return Xe==="id"?l=o.program.id-c.program.id:Xe==="name"?l=o.program.name.localeCompare(c.program.name):Xe==="total"?l=o.totalRiders-c.totalRiders:Xe==="raceDays"?l=o.raceDays-c.raceDays:l=(o.roleCounts[Xe]||0)-(c.roleCounts[Xe]||0),l===0&&(l=o.program.id-c.program.id),$a?l:-l});const i=n.map(o=>{const c=o.program,l=o.progCombos,p=o.totalRiders,m=o.roleCounts,u=o.raceDays,f=new Set(e.raceProgramRaces.filter(E=>E.program_id===c.id).map(E=>E.race_id)),g=jl(c,f,e),b=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],h=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"],y=new Map;for(const E of l){const I=E.spec2||"—",F=`${E.role}|${E.spec1}|${I}`;y.set(F,(y.get(F)||0)+E.count)}const k=[...y.entries()].map(([E,I])=>{const[F,R,N]=E.split("|");return{role:F,spec1:R,spec2:N,count:I}}).sort((E,I)=>{const F=b.indexOf(E.role)-b.indexOf(I.role);if(F!==0)return F;const R=h.indexOf(E.spec1)-h.indexOf(I.spec1);return R!==0?R:I.count-E.count}),w=(E,I)=>{const F=s[E]??E,R=I!=="—"?s[I]??I:"—";return`${F} / ${R}`},M=[];for(const E of k)if(E.count>0){const I=E.spec1==="Berg"&&E.spec2==="Cobble"||E.spec1==="Cobble"&&E.spec2==="Berg",F=I?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",R=I?"color: #f97316; font-weight: bold;":"color: var(--text-100);",N=I?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",P=`${E.role}_${E.spec1}_${E.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`;M.push(`
          <div style="${F}">
            <span style="${R}">${r[E.role]||E.role} <span class="text-muted">(${w(E.spec1,E.spec2)})</span></span>
            <strong style="${N} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="prog-${c.id}" data-combo-key="${P}">
              ${E.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-prog-${c.id}-${P}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: <span style="white-space: nowrap; margin-right: 0.8rem;">${S(c.name)}: <strong>${E.count}</strong></span>
          </div>
        `)}const x=M.length>0?M.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
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
              ${pt("id","ID","width: 50px;")}
              ${Uf("name","Programm")}
              ${pt("total","Fahrer gesamt","width: 110px; text-align: center; font-weight: bold;")}
              ${pt("raceDays","Renntage","width: 100px; text-align: center; font-weight: bold;")}
              ${pt("Kapitaen","Kapitän","width: 90px; text-align: center;")}
              ${pt("Co_Kapitaen","Co-Kapitän","width: 90px; text-align: center;")}
              ${pt("Sprinter","Sprinter","width: 90px; text-align: center;")}
              ${pt("Edelhelfer","Edelhelfer","width: 90px; text-align: center;")}
              ${pt("Starke_Helfer","Starke Helfer","width: 100px; text-align: center;")}
              ${pt("Wassertraeger","Wasserträger","width: 100px; text-align: center;")}
            </tr>
          </thead>
          <tbody>
            ${i.join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.openTeamStats=vn;async function Wl(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}_r("game"),v("meta-career").textContent=((e=d.currentSave)==null?void 0:e.careerName)??"",d.seasonStandingsSelectedSeason=null,d.riderStatsSelectedSeason=null,Et("dashboard"),Te("Spiel wird geladen…");try{await pn();const[t,a]=await Promise.all([Y.getTeams(),Y.getRiders(void 0,!1)]);t.success&&(d.teams=t.data??[]),a.success&&(d.riders=a.data??[]),await gn(),Ur()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{Se()}}function Zf(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";Et(t),t==="dashboard"&&Ur(),t==="teams"&&Pr(),t==="riders"&&Pr(),t==="rider-team-editor"&&Nl(),t==="live-race"&&ra(),t==="results"&&Pe(),t==="draft"&&Zr(d.draftSelectedSeason||((a=d.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&af(),t==="season-standings"&&Hl(!0),t==="leaderboards"&&$f(),t==="calendar"&&Pf(),t==="race-programs"&&$n(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&el(),t==="stage-editor"&&Xs()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&da(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&vn(a)}),v("btn-cancel-new").addEventListener("click",()=>Ze("newCareer")),v("btn-close-race-stages").addEventListener("click",()=>Ze("raceStages")),v("btn-close-stage-profile").addEventListener("click",()=>Ze("stageProfile")),v("btn-close-rider-program").addEventListener("click",()=>Ze("riderProgram")),v("btn-close-rider-stats").addEventListener("click",()=>Ze("riderStats")),v("btn-close-team-stats").addEventListener("click",()=>Ze("teamStats")),v("btn-close-race-participants").addEventListener("click",()=>Ze("raceParticipants")),v("btn-close-roster-editor").addEventListener("click",()=>Ts()),v("btn-cancel-roster-editor").addEventListener("click",()=>Ts()),v("btn-apply-roster-editor").addEventListener("click",()=>{hg()}),v("btn-back-menu").addEventListener("click",()=>{qt==null||qt.pause(),_r("menu"),Pa()}),ad(),Eg(),Ef(),hl(),El(),Zg(),bg(),cg(),Pp(),Yp(),Sf(),lf(),kf(),_f(),Dl()}(async()=>(tp(),he(),Zf(),_r("menu"),await Pa()))();
