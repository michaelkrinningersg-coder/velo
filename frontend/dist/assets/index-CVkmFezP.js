(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();function mo(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Ds(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function dt(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function Za(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function De(e,t={}){const a=t.strong===!1?"span":"strong",r=Ds("app-rider-link-label",t.labelClassName),s=`<${a} class="${r}">${mo(e)}</${a}>`;if(t.riderId==null)return s;const n=['type="button"','class="'+Ds("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${s}</button>`}function rt(e,t,a=!0,r=""){const s=a===!1?"span":"strong",n=`<${s} class="app-team-link-label">${mo(e)}</${s}>`;return t==null?n:`<button type="button" class="${Ds("app-team-link",r)}" data-team-id="${t}">${n}</button>`}function po(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function go(e){return Math.round(e*10)/10}function fo(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function ho(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function bo(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function vd(e,t){return e.skills.stamina*(t/300)}function yo(e,t,a){return e.skills.timeTrial+bo(e,t)+e.skills.mountain*(a/500)}function Sd(e,t,a,r){const s=vd(e,a),n=bo(e,r);switch(t.profile){case"Flat":return .8*e.skills.sprint+.15*e.skills.acceleration+.05*e.skills.flat+n+s;case"Rolling":return .7*e.skills.sprint+.2*e.skills.acceleration+.1*e.skills.hill+n+s;case"Hilly":return .45*e.skills.sprint+.1*e.skills.flat+.45*e.skills.hill+n+s;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+s;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+s;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+s;case"High_Mountain":return e.skills.mountain+n+s;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+s;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+s;default:return .8*e.skills.sprint+.2*e.skills.flat+n+s}}function kd(e,t,a,r,s){return t.profile==="ITT"||t.profile==="TTT"?yo(e,s,r):Sd(e,t,a,s)}function $d(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:go(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function vo(e,t,a,r){fo(a,r);const s=ho(a,r),n=new Map(t.map(l=>[l.id,l]));if(a.profile==="TTT"){const l=new Map;for(const o of e){if(o.activeTeamId==null)continue;const m=l.get(o.activeTeamId)??[];m.push(o),l.set(o.activeTeamId,m)}return[...l.entries()].map(([o,m])=>{const p=n.get(o),f=m.map(y=>yo(y,po(y.id,r==null?void 0:r.dailyFormByRiderId),s)).sort((y,k)=>k-y).slice(0,5),g=f.length,h=g>0?f.reduce((y,k)=>y+k,0)/g:0,b=Math.max(0,5-g)*2;return{team:p??{id:o,name:`Team ${o}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:h-b}}).sort((o,m)=>m.score-o.score||o.team.id-m.team.id).slice(0,20).map((o,m)=>({rank:m+1,kind:"team",effectiveSkill:go(o.score),teamId:o.team.id,teamName:o.team.name,displayName:o.team.name,roleLabel:"TTT"}))}return(r!=null?Lr(e,t,a,r):Lr(e,t,a)).sort((l,c)=>c.effectiveSkill-l.effectiveSkill||l.rider.id-c.rider.id).slice(0,20).map((l,c)=>$d(l,c+1))}function Lr(e,t,a,r){const s=fo(a,r),n=ho(a,r),i=new Map(t.map(l=>[l.id,l]));return e.map(l=>{var c;return{rider:l,teamName:l.activeTeamId!=null?((c=i.get(l.activeTeamId))==null?void 0:c.name)??`Team ${l.activeTeamId}`:"—",effectiveSkill:kd(l,a,s,n,po(l.id,r==null?void 0:r.dailyFormByRiderId))}}).sort((l,c)=>c.effectiveSkill-l.effectiveSkill||l.rider.id-c.rider.id)}const d={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,seasonStandingsSelectedSeason:null,draftHistory:null,injuries:null,draftSelectedSeason:null,draftOverlayActive:!1,draftOverlayAuto:!0,draftOverlayPicks:null,draftOverlayCurrentIndex:0,draftSpeedMultiplier:1,draftPaused:!1,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorHideBoringSegments:!0,stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsSelectedSeason:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsFilterRank:null,riderStatsTopResultsFilterProfile:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,breakaway:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedRosterYear:null,teamStatsRosterSort:{key:"overallRating",direction:"desc"},teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsFilterRank:null,teamStatsTopResultsFilterProfile:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,breakaway:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1,autoProgressTargetDate:null,raceProgramsPayload:null,raceProgramsActiveTab:"calendar-cols",raceProgramsDirty:!1,raceProgramsSaving:!1};let la=null;function So(e){la=e}let ss=!1;function Ls(e){ss=e}let tn=null;function _s(e){tn=e}let _r=null;function As(e){_r=e}let St=!1;function an(e){St=e}function v(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ce(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function za(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),r=Math.floor(e%60),s=String(a).padStart(2,"0"),n=String(r).padStart(2,"0");return t>0?`${t}:${s}:${n}`:`${a}:${n}`}function Rr(e){return e==null||e===0?"–":`+${za(e)}`}const Da=2,Ar=3,rn=4;function sn(e){return`/jersey/Jer_${e}.png`}function Mt(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((r=d.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${S(a)}" aria-label="${S(a)}">
      <img
        class="results-team-jersey-img"
        src="${S(sn(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function ra(e,t){return`<span class="results-jersey-cell">${Mt(e,t)}</span>`}function pt(e){return e&&de(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function At(e){var a;if(e==null)return null;const t=Ce(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function Ce(e){return e==null?null:d.riders.find(t=>t.id===e)??null}function Gt(e){return e==null?null:d.races.find(t=>t.id===e)??null}function Ga(e){var t;if(e==null)return null;for(const a of d.races){const r=(t=a.stages)==null?void 0:t.find(s=>s.id===e);if(r)return{race:a,stage:r}}return null}function sa(e,t=!0,a=!1,r=null,s=null){const n=De(e,{riderId:r,teamId:s,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function ko(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function Br(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function Hr(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function $o(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}let nr=new Map,Yn=null;function nn(e){if(d.riders!==Yn){nr.clear(),Yn=d.riders;for(let t=0;t<d.riders.length;t++){const a=d.riders[t];if(a.activeTeamId!=null){let r=nr.get(a.activeTeamId);r||(r=[],nr.set(a.activeTeamId,r)),r.push(a)}}}return nr.get(e)||[]}const He={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function de(e){const t=He[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function xo(e,t){return e?`<span class="country-chip">${de(e.code3)}<span>${S(e.name)}</span></span>`:t?S(t):"–"}function zr(e){return`${e.toFixed(2).replace(".",",")} km`}function Gr(e){return`${Math.round(e)} hm`}function xd(e){return`${e>0?"+":""}${e.toFixed(1).replace(".",",")}%`}const To=new Set;function Td(e){To.add(e)}function ns(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),v(`screen-${e}`).classList.remove("hidden")}function ft(e){v(`modal-${e}`).classList.remove("hidden")}function tt(e){v(`modal-${e}`).classList.add("hidden")}function Zn(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function wo(){var h,b;const e=d.realtimeBootstrap;if(!e)return;const t=v("instant-sim-favorites"),a=v("instant-sim-gc"),r=v("instant-sim-points");if(!t||!a||!r)return;const s=v("instant-sim-race"),n=v("instant-sim-stage-desc"),i=v("instant-sim-date");s&&(s.textContent=e.race.name),n&&(n.textContent=`Etappe ${e.stage.stageNumber} · ${e.stage.profile}`),i&&(i.textContent=ce(e.stage.date));const c=vo(e.riders,e.teams,e.stage,{distanceKm:(h=e.stageSummary)==null?void 0:h.distanceKm,elevationGainMeters:(b=e.stageSummary)==null?void 0:b.elevationGainMeters}).slice(0,10),o=new Map(e.gcStandings.map(y=>[y.riderId,y]));let m=`
    <h3>
      <span>Etappen-Favoriten</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const y of c){const k=e.riders.find(I=>I.id===y.riderId);if(!k)continue;const T=At(k.id)??"un",x=He[T]??"un",$=e.teams.find(I=>I.id===k.activeTeamId),N=($==null?void 0:$.abbreviation)??"—",E=o.get(k.id),R=E?`GC ${E.rank} (${E.rank===1?"Gelb":Zn(E.gapSeconds)})`:"GC –";m+=`
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
            <span class="instant-sim-team-abbr">${S(N)}</span>
            <span class="instant-sim-gc-info">${R}</span>
          </div>
        </div>
      </div>
    `}m+="</div>",t.innerHTML=m;const p=e.gcStandings.slice(0,10);let u=`
    <h3>
      <span>Gesamtwertung (GC)</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const y of p){const k=e.riders.find(R=>R.id===y.riderId);if(!k)continue;const T=At(k.id)??"un",x=He[T]??"un",$=e.teams.find(R=>R.id===k.activeTeamId),N=($==null?void 0:$.abbreviation)??"—",E=y.rank===1?"Gelb":Zn(y.gapSeconds);u+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${k.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${y.rank}</span>
            ${Hr(y.previousRank,y.rankDelta)}
            <span class="fi fi-${x} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${S(k.firstName)} <strong>${S(k.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(N)}</span>
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
  `;for(const y of f){if(y.riderId==null)continue;const k=e.riders.find(R=>R.id===y.riderId);if(!k)continue;const T=At(k.id)??"un",x=He[T]??"un",$=e.teams.find(R=>R.id===k.activeTeamId),N=($==null?void 0:$.abbreviation)??"—",E=`${y.points??0} Punkte`;g+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${k.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${y.rank}</span>
            ${Hr(y.previousRank,y.rankDelta)}
            <span class="fi fi-${x} country-flag" style="font-size: 0.8rem; margin-left: 0.25rem;"></span>
            <span class="instant-sim-name">${S(k.firstName)} <strong>${S(k.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(N)}</span>
            <span class="instant-sim-gc-info">${E}</span>
          </div>
        </div>
      </div>
    `}g+="</div>",r.innerHTML=g}function Te(e="Lade…"){var r;const t=St?" (Leertaste zum Stoppen)":"",a=v("default-loader");a&&(v("loading-msg").textContent=e+t,v("loading-progress").classList.add("hidden"),a.classList.remove("hidden"),(r=v("instant-sim-panel"))==null||r.classList.add("hidden")),v("loading-overlay").classList.remove("hidden")}function ve(){v("loading-overlay").classList.add("hidden")}function Mo(e){var t,a;if((t=v("default-loader"))==null||t.classList.add("hidden"),(a=v("instant-sim-panel"))==null||a.classList.remove("hidden"),v("loading-overlay").classList.remove("hidden"),d.realtimeBootstrap)wo();else{const r=v("instant-sim-favorites"),s=v("instant-sim-gc");r&&(r.innerHTML=""),s&&(s.innerHTML="")}on(e)}function on(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),r=`Instant-Simulation läuft … ${t}%${St?" (Leertaste zum Stoppen)":""}`,s=v("loading-msg");s&&(s.textContent=r);const n=v("loading-progress-bar");n&&(n.style.width=`${t}%`);const i=v("instant-loading-msg");i&&(i.textContent=r);const l=v("instant-loading-progress-bar");l&&(l.style.width=`${t}%`);const c=v("instant-sim-favorites");c&&c.innerHTML.trim()===""&&d.realtimeBootstrap&&wo()}function Bt(e,t){const a=v(e);a.textContent=t,a.classList.remove("hidden")}function ya(e){v(e).classList.add("hidden")}function Rt(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),v(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),v("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of To)try{a(e)}catch(r){console.error(`Fehler bei View-Aktivierung von "${e}":`,r)}}function Re(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function da(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";case"Flat":return"Flachlandspezialist";default:return e}}function ln(e,t,a){return Math.max(t,Math.min(a,e))}function Ir(e,t,a){return Math.round(e+(t-e)*a)}function Bs(e,t,a){return`rgb(${Ir(e[0],t[0],a)} ${Ir(e[1],t[1],a)} ${Ir(e[2],t[2],a)})`}function is(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=ln(e,t[0].value,t[t.length-1].value);for(let r=1;r<t.length;r+=1){const s=t[r-1],n=t[r];if(a<=n.value){const i=(a-s.value)/(n.value-s.value);return Bs(s.color,n.color,i)}}return Bs(t[t.length-1].color,t[t.length-1].color,1)}function dn(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${is(e)}"${a}>${e.toFixed(2)}</span>`}function Ro(e,t,a){if(t==null)return dn(e,a);const r=Math.round((e-t)*100)/100,s=r>0?"skill-delta-positive":r<0?"skill-delta-negative":"skill-delta-neutral",n=r>0?"+":"",i=`<span class="skill-delta ${s}">${n}${r.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${is(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function Io(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function Hs(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",r=t>0?"+":"";return`<span class="${a}">${r}${t.toFixed(1).replace(".",",")}</span>`}function zs(e,t="none",a){const r=e??0,s=["race-sim-form-negative"];t==="warning"&&s.push("load-warning"),t==="critical"&&s.push("load-warning-critical");const n=a?` title="${S(a)}"`:"";return r===0?`<span class="${s.join(" ")}"${n}>0,0</span>`:`<span class="${s.join(" ")}"${n}>-${r.toFixed(1).replace(".",",")}</span>`}function cn(e){const t=e.seasonFormPhase??"neutral";return un(t)}function un(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${S(a.label)}">${a.symbol}</span>`}function Co(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${S(e.seasonProgram.name)}</button>`:"–"}function zt(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function ze(e){return`${e.lastName} ${e.firstName}`}function Fo(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,r=e.unavailableUntil?` bis ${ce(e.unavailableUntil)}`:"",s=`${t}: noch ${a} Tag${a===1?"":"e"}${r}`;return`<span class="rider-availability-marker" title="${S(s)}" aria-label="${S(s)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function It(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function Kr(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=e,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(r)}const wd=Object.freeze(Object.defineProperty({__proto__:null,$:v,FLAG_CODE_BY_CODE3:He,GC_RESULT_TYPE_ID:Da,MOUNTAIN_RESULT_TYPE_ID:rn,POINTS_RESULT_TYPE_ID:Ar,activateView:Rt,addActiveViewListener:Td,get autoProgressActive(){return St},buildRaceCategoryBadgeCssVariables:Za,clamp:ln,downloadTextFile:Kr,esc:S,findRaceById:Gt,findRiderById:Ce,findStageById:Ga,formatDate:ce,formatElevationGain:Gr,formatGradient:xd,formatKm:zr,formatMarkerLabel:$o,formatNonFinisherReason:Br,formatRaceGap:Rr,formatRaceTime:za,formatRiderName:ze,getRiderCountryCode:zt,getRiderRoleName:It,getRiderSpecializationLabel:da,getRidersByTeam:nn,getSkillColor:is,hideError:ya,hideLoading:ve,hideModal:tt,get instantStageInFlightId(){return tn},interpolateChannel:Ir,interpolateColor:Bs,isActiveView:Re,get raceSimView(){return la},get realtimeCompletionInFlight(){return ss},get realtimeStageLoadInFlightId(){return _r},renderCountry:xo,renderFlag:de,renderLoadMalusValue:zs,renderMiniJersey:Mt,renderNonFinisherStatusBadge:ko,renderRaceFormBonusValue:Io,renderRankDelta:Hr,renderResultsFlagColumn:pt,renderResultsJerseyColumn:ra,renderResultsParticipant:sa,renderRiderAvailabilityMarker:Fo,renderRiderNameLink:De,renderRiderProgramButton:Co,renderSeasonFormPhase:cn,renderSeasonFormPhaseIndicator:un,renderSeasonFormValue:Hs,renderSkillValue:dn,renderSkillValueWithDelta:Ro,renderTeamNameLink:rt,resolveRaceCategoryBadgeStyle:dt,resolveRiderCountryCode:At,resolveTeamJerseyAssetPath:sn,setAutoProgressActive:an,setInstantStageInFlightId:_s,setRaceSimView:So,setRealtimeCompletionInFlight:Ls,setRealtimeStageLoadInFlightId:As,showError:Bt,showInstantProgress:Mo,showLoading:Te,showModal:ft,showScreen:ns,state:d,updateInstantProgress:on},Symbol.toStringTag,{value:"Module"}));async function ee(e,t,a){try{const r=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(r.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await r.text();return{success:!1,error:r.ok?"Antwort war kein JSON.":`HTTP ${r.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return r.json()}catch(r){return{success:!1,error:`Netzwerkfehler: ${r.message}`}}}const Y={listSaves:()=>ee("GET","/api/saves"),createSave:(e,t,a)=>ee("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>ee("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>ee("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>ee("GET","/api/teams/available"),getTeams:()=>ee("GET","/api/teams"),getTeam:e=>ee("GET",`/api/teams/${e}`),getTeamStats:e=>ee("GET",`/api/teams/${e}/stats`),getRiders:(e,t=!1,a=!0,r)=>{const s=new URLSearchParams;e!=null&&s.set("teamId",String(e)),t&&s.set("onlyWithTeam","true"),r!=null&&s.set("season",String(r)),a&&s.set("summary","true");const n=s.toString();return ee("GET",`/api/riders${n?`?${n}`:""}`)},getRiderStats:(e,t=!1)=>ee("GET",`/api/riders/${e}/stats${t?"?excludeFatigue=true":""}`),getRiderProgramRaces:e=>ee("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>ee("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>ee("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>ee("POST","/api/rider-team-editor/export",e),getRaces:()=>ee("GET","/api/races"),getRaceProgramParticipants:e=>ee("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>ee("GET",`/api/races/${e}/results-roster`),getGameState:()=>ee("GET","/api/state"),getGameStatus:()=>ee("GET","/api/game/status"),getStageSummary:e=>ee("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>ee("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>ee("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>ee("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>ee("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>ee("POST","/api/state/advance"),getStageResults:e=>ee("GET",`/api/results/${e}`),getSeasonStandings:e=>ee("GET",`/api/season-standings${e?`?season=${e}`:""}`),listStageEditorStages:()=>ee("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>ee("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>ee("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>ee("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>ee("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>ee("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>ee("POST","/api/stage-editor/import",e),exportStageRoute:e=>ee("POST","/api/stage-editor/export",e),getInjuries:()=>ee("GET","/api/injuries"),getDraftHistory:e=>ee("GET",`/api/draft/${e}`),getDraftDetails:e=>ee("GET",`/api/draft/${e}/details`),getDraftState:e=>ee("GET",`/api/draft/${e}/state`),makeDraftPick:(e,t)=>ee("POST",`/api/draft/${e}/pick`,{riderId:t}),quickCompleteDraft:e=>ee("POST",`/api/draft/${e}/quick-complete`),getLeaderboards:(e,t,a)=>ee("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`),getRaceProgramsEditor:()=>ee("GET","/api/race-programs-editor"),saveRaceProgramsEditor:e=>ee("POST","/api/race-programs-editor/save",e)};async function Ja(){const e=await Y.listSaves(),t=v("saves-list"),a=v("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(r=>`
    <div class="save-card">
      <h3>${S(r.careerName)}</h3>
      <p class="save-meta">
        ${S(r.teamName)} · Saison ${r.currentSeason}
        ${r.lastSaved?"· "+ce(r.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${S(r.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${S(r.filename)}" data-career-name="${S(r.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function Md(e){Te("Karriere wird geladen…");const t=await Y.loadSave(e);if(ve(),!t.success){alert("Fehler beim Laden: "+t.error);return}d.currentSave=t.data??null,await yd()}async function Rd(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;Te("Löschen…");const a=await Y.deleteSave(e);if(ve(),!a.success){alert("Fehler: "+a.error);return}await Ja()}async function Id(){const e=await Y.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){v("btn-delete-all-careers").classList.add("hidden"),v("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){Te("Alle Karrieren werden gelöscht…");try{for(const a of t){const r=await Y.deleteSave(a.filename);if(!r.success){alert(`Fehler beim Löschen von "${a.careerName}": ${r.error??"Unbekannter Fehler"}`);break}}}finally{ve()}await Ja()}}function Cd(){v("btn-new-career").addEventListener("click",async()=>{var s;ya("new-career-error"),v("input-career-name").value="";const a=v("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',ft("newCareer");const r=await Y.getAvailableTeams();if(!r.success||!((s=r.data)!=null&&s.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=r.data.map(n=>`<option value="${n.id}">${S(n.name)} (${S(n.division??n.divisionName??"")})</option>`).join("")}),v("btn-cancel-new").addEventListener("click",()=>tt("newCareer")),v("btn-confirm-new").addEventListener("click",async()=>{const a=v("input-career-name").value.trim(),r=v("input-team-id").value;if(!a||!r){Bt("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const s=Number(r),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;ya("new-career-error"),Te("Neue Karriere wird erstellt…");const l=await Y.createSave(i,a,s);if(!l.success){ve(),Bt("new-career-error",l.error??"Unbekannter Fehler.");return}const c=await Y.loadSave(i);if(ve(),tt("newCareer"),!c.success){alert("Fehler: "+c.error);return}d.currentSave=c.data??null,await yd()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>Ja());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{Id()}),v("saves-list").addEventListener("click",async a=>{const r=a.target.closest("button[data-save-action]");if(!r)return;const{saveAction:s,filename:n,careerName:i}=r.dataset;if(n){if(s==="load"){await Md(n);return}s==="delete"&&await Rd(n,i??n)}})}const Fd="modulepreload",Ed=function(e){return"/"+e},Jn={},Cr=function(t,a,r){let s=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),l=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));s=Promise.allSettled(a.map(c=>{if(c=Ed(c),c in Jn)return;Jn[c]=!0;const o=c.endsWith(".css"),m=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const p=document.createElement("link");if(p.rel=o?"stylesheet":Fd,o||(p.as="script"),p.crossOrigin="",p.href=c,l&&p.setAttribute("nonce",l),document.head.appendChild(p),o)return new Promise((u,f)=>{p.addEventListener("load",u),p.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(i){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=i,window.dispatchEvent(l),!l.defaultPrevented)throw i}return s.then(i=>{for(const l of i||[])l.status==="rejected"&&n(l.reason);return t().catch(n)})},Pd={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function Nd(e){const t=Pd[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const Dd=200;function mn(e){if(e.length===0)return[];const t=[];for(const a of e){const r=t[t.length-1];if(!r||Math.abs(r.distanceMeter-a.distanceMeter)>=Dd){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}r.riderIds.push(...a.riderIds),r.riderCount+=a.riderCount,r.distanceSum+=a.distanceMeter*a.riderCount,r.distanceMeter=r.distanceSum/r.riderCount}return t.map(({distanceSum:a,...r})=>r)}function pn(e){if(e.length===0)return[];let t=0;for(let s=1;s<e.length;s+=1)e[s].riderCount>e[t].riderCount&&(t=s);let a=0,r=0;return e.map((s,n)=>{const i=n===t;let l;return i?l="P":n<t?(a+=1,l=`E${a}`):(r+=1,l=`A${r}`),{...s,label:l,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-s.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,s.distanceMeter-e[n+1].distanceMeter):null}})}function Ld(e,t=null){var a,r,s;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((r=e.find(n=>n.label==="P"))==null?void 0:r.label)??((s=e[0])==null?void 0:s.label)??null}function Kt(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function qn(e,t,a,r){return`${r.type}:${e}:${t}:${a}`}function _d(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:Kt(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function vt(e){const t=[];e.segments.forEach((s,n)=>{const i=n*2;(s.start_markers??[]).forEach((l,c)=>{t.push({key:qn(n,"start",c,l),label:"",marker:l,kmMark:s.start_km,elevation:s.start_elevation,boundary:"start",sequence:i+c/100})}),(s.end_markers??[]).forEach((l,c)=>{t.push({key:qn(n,"end",c,l),label:"",marker:l,kmMark:s.end_km,elevation:s.end_elevation,boundary:"end",sequence:i+1+c/100})})});const a=t.sort((s,n)=>s.kmMark-n.kmMark||s.sequence-n.sequence),r=new Map;return a.map(s=>{const n=(r.get(s.marker.type)??0)+1;return r.set(s.marker.type,n),{...s,label:s.marker.name??_d(s.marker,n)}})}function Ad(e){const t=vt(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>Kt(a)).length}}function va(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Bd(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function ot(e,t,a,r){return t<=0?r:r+e/t*(a-r*2)}function Or(e,t){const a=t/1e3,r=e.points;if(a<=r[0].kmMark)return r[0].elevation;for(let s=0;s<r.length-1;s+=1){const n=r[s],i=r[s+1];if(a>i.kmMark)continue;const l=Math.max(1e-4,i.kmMark-n.kmMark),c=(a-n.kmMark)/l;return n.elevation+(i.elevation-n.elevation)*c}return r[r.length-1].elevation}function Eo(e){const t=e.points.map(m=>m.elevation),a=Math.min(...t),r=Math.max(...t),s=Math.max(1,r-a),n=Math.max(40,s*.08),i=Math.max(0,a-n),l=r+n;let c=Math.floor(i/50)*50,o=Math.ceil(l/50)*50;return o<=c&&(o=c+100),{axisMinElevation:c,axisMaxElevation:o}}function ht(e,t,a,r,s,n){const i=Math.max(1,a-t);return r-n-(e-t)/i*(r-s-n)}function La(e){return`${Math.round(e)} m`}function Xn(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function Qn(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function Po(e,t,a,r,s,n,i,l,c){var g;const o=[],m=[];let p=null,u="#b91c1c";for(const h of vt(e)){const{marker:b,kmMark:y,elevation:k}=h;if(b.type==="climb_start"){m.push({kmMark:y,elevation:k,name:b.name});continue}if(Kt(b)){let T=-1;for(let E=m.length-1;E>=0;E-=1)if(b.name&&((g=m[E])==null?void 0:g.name)===b.name){T=E;break}const x=T>=0?m.splice(T,1)[0]:m.pop();x&&Math.max(0,y-x.kmMark),x&&Math.max(0,k-x.elevation);const $=Qn(b.cat,b.type),N=Xn(b.cat);if(b.type==="finish_hill"||b.type==="finish_mountain"){p=b.cat??null,u=$.accentColor;continue}o.push({x:ot(y*1e3,t,a,r),anchorY:ht(k,l,c,s,n,i),primaryLabel:N??"Berg",secondaryLabel:La(k),distanceLabel:`${y.toFixed(1).replace(".",",")} km`,accentColor:$.accentColor});continue}if(b.type==="sprint_intermediate"){const T=Qn(b.cat,b.type);o.push({x:ot(y*1e3,t,a,r),anchorY:ht(k,l,c,s,n,i),primaryLabel:"Sprint",secondaryLabel:La(k),distanceLabel:`${y.toFixed(1).replace(".",",")} km`,accentColor:T.accentColor})}}const f=e.points[e.points.length-1];return o.push({x:ot(f.kmMark*1e3,t,a,r),anchorY:ht(f.elevation,l,c,s,n,i),primaryLabel:p?`${Xn(p)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:La(f.elevation),distanceLabel:`${f.kmMark.toFixed(1).replace(".",",")} km`,accentColor:u}),o.sort((h,b)=>h.x-b.x)}function No(e,t,a){const r=t+4,s=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${va(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-detail">${va(e.distanceLabel)}</text>
    </g>`}function Do(e,t){const a=new Set,r=t/1e3;for(let s=0;s<=r;s+=25)a.add(Math.round(s*1e3));return a.add(Math.round(t)),[...a].filter(s=>s>=0&&s<=t).sort((s,n)=>s-n)}function Lo(e,t,a,r,s,n){const i=new Set(vt(t).map(l=>Math.round(l.kmMark*1e3)));return e.map(l=>{const c=ot(l,a,r,s),m=i.has(l)?18:12,p=n+m+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${c.toFixed(1)}" y1="${n.toFixed(1)}" x2="${c.toFixed(1)}" y2="${(n+m).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${c.toFixed(1)}" y="${p.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${va(Bd(l))}</text>
      </g>`}).join("")}function Hd(e,t,a,r,s,n,i,l,c,o,m){const p=ot(e.distanceMeter,a,r,n),u=Or(t,e.distanceMeter),f=ht(u,c,o,s,i,l),g=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),h=e.riderCount>1?`<text x="${p.toFixed(1)}" y="${(f+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${p.toFixed(1)}" cy="${f.toFixed(1)}" r="${g.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${m?" race-sim-cluster-dot-selected":""}"></circle>
      ${h}
    </g>`}function zd(e,t,a,r,s,n,i,l,c,o,m){const p=new Map(m.riders.map(f=>[f.id,f])),u=new Map((m.teams??[]).map(f=>[f.id,f.abbreviation]));return e.filter(f=>f.riderCount===1).map(f=>{const g=f.riderIds[0];if(g==null)return"";const h=p.get(g);if(!h)return"";const b=ot(f.distanceMeter,a,r,n),y=Or(t,f.distanceMeter),k=ht(y,c,o,s,i,l),T=h.activeTeamId!=null?u.get(h.activeTeamId)??"":"",x=`${h.lastName} (${T})`,$=k-34,N=k-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${b.toFixed(1)}" y1="${(k-5).toFixed(1)}" x2="${b.toFixed(1)}" y2="${$.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${b.toFixed(1)}" y="${N.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${va(x)}</text>
        </g>`}).join("")}function Gd(e,t,a,r,s,n,i,l,c,o,m){const p=Math.max(0,Math.min(o,e.distanceKm)),u=Math.max(0,Math.min(m,e.distanceKm));if(u<=p)return null;const f=[{kmMark:p,elevation:Or(e,p*1e3)},...e.points.filter(k=>k.kmMark>p&&k.kmMark<u),{kmMark:u,elevation:Or(e,u*1e3)}];if(f.length<2)return null;const g=s-i,h=f.map((k,T)=>{const x=ot(k.kmMark*1e3,t,a,r),$=ht(k.elevation,l,c,s,n,i);return`${T===0?"M":"L"} ${x.toFixed(1)} ${$.toFixed(1)}`}).join(" "),b=ot(p*1e3,t,a,r),y=ot(u*1e3,t,a,r);return`${h} L ${y.toFixed(1)} ${g.toFixed(1)} L ${b.toFixed(1)} ${g.toFixed(1)} Z`}function Kd(e,t,a,r,s={}){const m=e.distanceKm*1e3,{axisMinElevation:p,axisMaxElevation:u}=Eo(e),f=533,g=12,b=e.points.map(E=>{const R=ot(E.kmMark*1e3,m,1584,28),I=ht(E.elevation,p,u,634,168,101);return{x:R,y:I}}).map((E,R)=>`${R===0?"M":"L"} ${E.x.toFixed(1)} ${E.y.toFixed(1)}`).join(" "),y=`${b} L ${1556 .toFixed(1)} ${f.toFixed(1)} L ${28 .toFixed(1)} ${f.toFixed(1)} Z`,k=s.selectedClimbRange!=null?Gd(e,m,1584,28,634,168,101,p,u,s.selectedClimbRange.startKm,s.selectedClimbRange.endKm):null,T=Po(e,m,1584,28,634,168,101,p,u).map(E=>No(E,g,f)).join(""),$=Array.from({length:5},(E,R)=>p+(u-p)/4*R).map(E=>{const R=ht(E,p,u,634,168,101);return`
      <line x1="28" y1="${R.toFixed(1)}" x2="1556" y2="${R.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${R.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${R.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(R+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${La(E)}</text>`}).join(""),N=Lo(Do(e,m),e,m,1584,28,f);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${va(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      ${N}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function Od(e,t,a,r,s){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${Kd(t,a,r,!1,s)}</div>`}function jd(e,t,a,r,s,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const l=1584,c=634,o=28,m=168,p=101,{axisMinElevation:u,axisMaxElevation:f}=Eo(t),g=c-p,h=12,b=Array.from({length:5},(G,B)=>u+(f-u)/4*B),y=mn(a.clusters),k=pn(y),T=Do(t,a.stageDistanceMeters),$=t.points.map(G=>{const B=ot(G.kmMark*1e3,a.stageDistanceMeters,l,o),q=ht(G.elevation,u,f,c,m,p);return{x:B,y:q}}).map((G,B)=>`${B===0?"M":"L"} ${G.x.toFixed(1)} ${G.y.toFixed(1)}`).join(" "),N=`${$} L ${(l-o).toFixed(1)} ${g.toFixed(1)} L ${o.toFixed(1)} ${g.toFixed(1)} Z`,E=Po(t,a.stageDistanceMeters,l,o,c,m,p,u,f).map(G=>No(G,h,g)).join(""),R=b.map(G=>{const B=ht(G,u,f,c,m,p);return`
      <line x1="${o}" y1="${B.toFixed(1)}" x2="${l-o}" y2="${B.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${o}" y1="${B.toFixed(1)}" x2="${(o-8).toFixed(1)}" y2="${B.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(o-14).toFixed(1)}" y="${(B+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${La(G)}</text>`}).join(""),I=Lo(T,t,a.stageDistanceMeters,l,o,g),_=new Map(y.map((G,B)=>[G,k[B]??null])),P=y.map(G=>{var B;return Hd(G,t,a.stageDistanceMeters,l,c,o,m,p,u,f,((B=_.get(G))==null?void 0:B.label)===i)}).join(""),D=s.stage.profile==="ITT"?zd(y,t,a.stageDistanceMeters,l,c,o,m,p,u,f,s):"";e.innerHTML=`
    <div class="race-sim-profile-layout${s.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${l} ${c}" role="img" aria-label="${va(r)}">
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
              <rect x="${o}" y="0" width="${l-o*2}" height="${c}"></rect>
            </clipPath>
          </defs>
          <rect x="0" y="0" width="${l}" height="${c}" fill="url(#race-sim-paper)"></rect>
          ${R}
          <line x1="${o}" y1="${g}" x2="${l-o}" y2="${g}" class="race-sim-axis"></line>
          <line x1="${o}" y1="${m}" x2="${o}" y2="${g}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${N}" fill="url(#race-sim-area)"></path>
            <path d="${$}" class="race-sim-profile-line"></path>
            ${E}
            ${P}
          </g>
          ${D}
          ${I}
          <text x="${o.toFixed(1)}" y="${(m-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const Wd={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},ei={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function Gs(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function os(e,t){return`${e}:${t}`}function Vd(e){return new Map(e.map(t=>[os(t.simulationMode,t.terrain),t.weights]))}function Ud(e){return new Map(e.map(t=>[os(t.simulationMode,t.terrain),t]))}function Yd(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function _o(e,t,a){const r=a.get(os(e,t));if(!r)return[{key:Gs(t),weight:1}];const s=Object.entries(r).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return s.length>0?s:[{key:Gs(t),weight:1}]}function ti(e,t,a,r){const s=_o(t,a,r),n=s.reduce((l,c)=>l+c.weight,0);return n<=0?e[Gs(a)]:s.reduce((l,c)=>l+e[c.key]*c.weight,0)/n}function Zd(e,t){const a=t.find(r=>r.simulationMode==="ttt"&&r.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??Wd[e]??1.05}function Jd(e,t,a){const r=a==null?void 0:a.get(os(e,t));return{lateMultiplier:(r==null?void 0:r.finalSpreadLateMultiplier)??ei[t].lateMultiplier,peakMultiplier:(r==null?void 0:r.finalSpreadPeakMultiplier)??ei[t].peakMultiplier}}const ai={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}};function qd(e,t){const a=ai[e]||ai[1];return a.pref.includes(t)?"pref":a.malus.includes(t)?"malus":"neutral"}const Xd=.005,Qd=.005,Ao=70,Bo=1e3,Ho=15,zo=360,Go=8,Ko=-.75,Oo=10;function Ut(e,t){return e+Math.random()*(t-e)}function jo(e,t,a){return Math.max(t,Math.min(a,e))}function ec(e){return e==="ITT"||e==="TTT"}function Wo(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(r=>{var s,n,i;return r.id!==e.id&&r.activeTeamId===e.activeTeamId&&(((s=r.role)==null?void 0:s.name)==="Edelhelfer"||((n=r.role)==null?void 0:n.name)==="Starke Helfer"||((i=r.role)==null?void 0:i.name)==="Wassertraeger")}).map(r=>r.id)}function Vo(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function tc(e,t,a,r){const s=r==="crash"?Vo():null,n=Number(Ut(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),l=jo(n/Math.max(.1,a)*100,0,100),c=l<=Ao;return{riderId:e.id,type:r,severity:s,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:l,waitDurationSeconds:Math.round(r==="crash"?Ut(10,60):Ut(10,45)),recoverySeconds:c?Bo:zo,recoveryFormBonus:c?Ho:Go,dayFormPenalty:Ko,staminaPenalty:Oo,recoveryPenaltyStages:r==="crash"?s==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:r==="crash"&&s==="medium"?15:0,supportRiderIds:Wo(e,t)}}function ac(e,t,a){if(ec(t.profile)||a<=0)return[];const r=[];for(const s of e){const n=Math.random(),i=Math.random(),l=Xd*Math.max(0,t.crashIncidentMultiplier??1),c=Qd*Math.max(0,t.mechanicalIncidentMultiplier??1);let o=l+(t.rolledEffektSturz??0)/100,m=c+(t.rolledEffektDefekt??0)/100;const p=t.rolledWeatherId||1,u=s.weatherProfileId||1;qd(u,p)==="pref"&&(o*=.5,m*=.5);const g=n<o,h=i<m;if(!g&&!h)continue;const b=g&&h?n<=i?"crash":"mechanical":g?"crash":"mechanical",y=tc(s,e,a,b);if(b==="crash"&&Math.random()<.01){y.isMassCrashTrigger=!0;const k=Math.floor(Ut(2,26)),x=[...e.filter($=>$.id!==s.id)].sort(()=>.5-Math.random());y.massCrashPotentialRiderIds=x.slice(0,k).map($=>$.id),Math.random()<.2&&(y.hasAdditionalMechanical=!0,y.waitDurationSeconds+=Math.round(Ut(10,45)))}r.push(y)}return r}function rc(e,t,a,r){const s=Vo(),n=Math.round(a*1e3),i=jo(a/Math.max(.1,r)*100,0,100),l=i<=Ao;let c=Math.round(Ut(10,60)),o=!1;return Math.random()<.2&&(o=!0,c+=Math.round(Ut(10,45))),{riderId:e.id,type:"crash",severity:s,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:c,recoverySeconds:l?Bo:zo,recoveryFormBonus:l?Ho:Go,dayFormPenalty:Ko,staminaPenalty:Oo,recoveryPenaltyStages:s==="light"?[10,5,2]:[],raceRecuperationPenalty:s==="medium"?15:0,supportRiderIds:Wo(e,t),hasAdditionalMechanical:o}}function sc(e,t){return e+Math.random()*(t-e)}function ri(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const r=Math.floor(sc(0,a+1)),s=t[a];t[a]=t[r]??s,t[r]=s}return t}function nc(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function ic(e,t,a={}){if(e.length===0)return[];const r=e.map(f=>({...f,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),s=a.teams??nc(r),n=Lr(r,s,t,a),i=new Set(n.slice(0,20).map(f=>f.rider.id)),l=Math.min(Math.ceil(r.length*.02),Math.max(0,r.length-i.size)),c=Math.min(Math.ceil(r.length*.01),r.length),o=ri(r.filter(f=>!i.has(f.id))),m=new Set(o.slice(0,l).map(f=>f.id)),p=ri(r.filter(f=>!m.has(f.id))),u=new Set(p.slice(0,c).map(f=>f.id));return r.map(f=>m.has(f.id)?{...f,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:u.has(f.id)?{...f,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:f)}function jt(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}function si(e,t){return e+Math.random()*(t-e)}function oc(e,t,a){const r=[...e],s=[];for(;s.length<t&&r.length>0;){const n=r.reduce((o,m)=>o+Math.max(1e-4,a(m)),0);let i=Math.random()*n,l=0;for(let o=0;o<r.length;o+=1)if(i-=Math.max(1e-4,a(r[o])),i<=0){l=o;break}const[c]=r.splice(l,1);c&&s.push(c)}return s}function lc(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function ni(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function dc(e,t,a){return new Set(e.map(r=>r.riderId).filter(r=>r!=null&&!t.has(r)).slice(0,a))}function cc(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function Pt(e){var t;return cc((t=e.role)==null?void 0:t.name)}function uc(e){return vt(e).some(({marker:t})=>Kt(t))}function mc(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function pc(e,t){const a=mc(e),r=e.hasSuperform===!0?40:1,s=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&Pt(e)==="sprinter"&&e.skills.hill>67?20:1,l=a*r*s*n*i;return{attackFactor:a,superformFactor:r,gcLeaderTeamFactor:s,mountainFactor:n,sprinterFactor:i,finalWeight:l}}function gc(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function fc(e,t){var r,s;const a=((r=t[0])==null?void 0:r.riderId)??null;return a==null?null:((s=e.find(n=>n.id===a))==null?void 0:s.activeTeamId)??null}function hc(e,t,a){const r=new Map(t.map(n=>[n.id,n])),s=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=r.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||s.has(i.activeTeamId))&&(s.add(i.activeTeamId),s.size>=a))break}return s}function bc(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),Pt(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function yc(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),l=Math.max(i,Math.ceil(a*.06));return{min:i,max:l}}const r=t.stageNumber<=10,s=Math.max(1,Math.floor(a*(r?.01:.05))),n=Math.max(s,Math.floor(a*(r?.08:.2)));return{min:s,max:n}}function vc(e,t){const a=t.profile==="Flat"||t.profile==="Rolling";return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?a?{min:.45,max:.65}:{min:.45,max:.75}:a?{min:.5,max:.75}:{min:.5,max:.85}}function Sc(e,t,a,r,s,n,i,l){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||r.distanceKm<=0)return null;const c=e.length,{min:o,max:m}=yc(t,a,c),p=jt(o,m),u=t.isStageRace&&a.stageNumber<=10,f=!t.isStageRace,g=fc(e,n),h=u?hc(s,e,5):new Set,b=u?bc(e):new Map,y=uc(r),k=lc(s,5),T=ni(n,10),x=new Set([...k,...T]),$=y?dc(i,x,5):new Set,N=gc(a),E=["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain"].includes(a.profile),R=t.isStageRace&&E&&a.stageNumber>=4;let I;const _=new Set;if(R){const L=ni(n,10),j=Lr(e,l??[],a,{distanceKm:r.distanceKm,elevationGainMeters:r.elevationGainMeters});let O=[];for(const w of j){if(O.length>=5)break;const C=w.rider;if(C.activeTeamId==null||!L.has(C.id))continue;const J=Pt(C);(J==="kapitaen"||J==="co-kapitaen")&&(O.includes(C.activeTeamId)||O.push(C.activeTeamId))}if(O.length===0)for(const w of j){if(O.length>=5)break;const C=w.rider;if(C.activeTeamId==null||!L.has(C.id))continue;Pt(C)==="edelhelfer"&&(O.includes(C.activeTeamId)||O.push(C.activeTeamId))}if(O.length>0&&Math.random()<.5){const w=jt(0,O.length-1);I=O[w]}}if(I!=null){const L=e.filter(O=>O.activeTeamId===I),F=L.filter(O=>Pt(O)==="kapitaen"),j=L.filter(O=>Pt(O)==="co-kapitaen");if(F.length>0){if(F.forEach(O=>_.add(O.id)),F.length===1&&j.length>0){const O=[...j].sort((w,C)=>C.overallRating-w.overallRating||C.id-w.id);_.add(O[0].id)}}else if(j.length>0)[...j].sort((w,C)=>C.overallRating-w.overallRating||C.id-w.id).slice(0,2).forEach(w=>_.add(w.id));else{const O=L.filter(w=>Pt(w)==="edelhelfer");if(O.length>0){const w=[...O].sort((C,J)=>J.overallRating-C.overallRating||J.id-C.id);_.add(w[0].id)}}}let P;if(I!=null){const F=e.filter(j=>j.activeTeamId===I).filter(j=>!_.has(j.id));F.length>0&&(P=[...F].sort((O,w)=>w.skills.attack-O.skills.attack||w.overallRating-O.overallRating||w.id-O.id)[0])}const D=e.filter(L=>{if(L.activeTeamId==null||k.has(L.id)||T.has(L.id)||I!=null&&L.activeTeamId===I&&(_.has(L.id)||P!=null&&L.id===P.id)||u&&g!=null&&L.activeTeamId===g||u&&h.has(L.activeTeamId))return!1;const F=Pt(L);return!(f&&(F==="kapitaen"||F==="co-kapitaen")||u&&F==="kapitaen"||u&&F==="co-kapitaen"&&b.get(L.activeTeamId)!==!0||F==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(D.length===0)return null;const G=new Map(D.map(L=>[L.id,pc(L,{isEarlyStageRace:u,race:t,gcLeaderTeamId:g,stageHasMountainClassifications:y,topMountainIds:$,isHardStage:N})])),B=D.reduce((L,F)=>{var j;return L+(((j=G.get(F.id))==null?void 0:j.finalWeight)??0)},0),q=oc(D,Math.max(0,Math.min(p-(P?1:0),D.length)),L=>{var F;return((F=G.get(L.id))==null?void 0:F.finalWeight)??1});if(P&&q.push(P),q.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${q.length}/${p} ausgewählt aus ${D.length}`),console.log(`Gesamtgewicht im Pool: ${B.toFixed(2)}`),console.table(q.map(L=>{var j;const F=G.get(L.id);return{Fahrer:`${L.firstName} ${L.lastName}`,Team:L.activeTeamId,Rolle:((j=L.role)==null?void 0:j.name)??null,Atk:L.skills.attack,Hill:L.skills.hill,Chance:`${((B>0&&F!=null?F.finalWeight/B:0)*100).toFixed(2)}%`,Gewicht:((F==null?void 0:F.finalWeight)??1).toFixed(2),Attacke:`x${((F==null?void 0:F.attackFactor)??1).toFixed(2)}`,Superform:`x${(F==null?void 0:F.superformFactor)??1}`,GC_Team:`x${((F==null?void 0:F.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(F==null?void 0:F.mountainFactor)??1}`,Sprinter:`x${(F==null?void 0:F.sprinterFactor)??1}`}})),console.groupEnd();const te=r.distanceKm*1e3,ae=jt(0,Math.min(1e4,Math.max(0,Math.floor(te*.1)))),M=vc(t,a),z=Math.round(te*si(M.min,M.max)),V=Math.round(te*si(.1,.25)),U=Math.max(ae+1e3,Math.min(z-1e3,z-V)),X=a.rolledBreakawayBonus??0,A=a.profile==="Flat"||a.profile==="Rolling"?jt(2,4):jt(3+X,8+X);return{riderIds:q.map(L=>L.id),triggerDistanceMeters:ae,groupPhaseEndDistanceMeters:U,phaseEndDistanceMeters:z,skillBonus:A,malusValue:a.profile==="Flat"||a.profile==="Rolling"?jt(6,10):jt(5,8),superTeamId:I}}const kc=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),$c=3,xc=7,ii=120,oi=200,li=180,Tc=10,ir=8e3;function Yt(e,t,a=Math.random()){const r=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(a*(s-r+1))+r}function wc(e){for(let t=e.length-1;t>0;t-=1){const a=Yt(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function jr(e,t){return t<=0||e.length===0?[]:wc([...e]).slice(0,Math.min(t,e.length))}function Mc(e,t,a){if(t<=0||e.length===0)return[];const r=[...e],s=[];for(;r.length>0&&s.length<t;){const n=r.reduce((c,o)=>c+Math.max(0,a(o)),0);if(n<=0){s.push(...jr(r,t-s.length));break}let i=Math.random()*n,l=r.length-1;for(let c=0;c<r.length;c+=1)if(i-=Math.max(0,a(r[c])),i<=0){l=c;break}s.push(r[l]),r.splice(l,1)}return s}function Rc(e){return kc.has(e.profile)}function Ic(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function Cc(e,t){if(!Rc(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(r=>{if(!Ic(r))return[];const s=r.start_km*1e3,n=r.end_km*1e3,i=Math.max(s,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:s,sourceSegmentEndMeters:n}]})}function di(e,t){const a=t==null?e:e.filter(c=>{const o=Math.min(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t)),m=Math.max(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t));return o>=ir||m>=ir});if(a.length===0)return null;const r=a[Yt(0,a.length-1)];if(!r)return null;const s=Math.ceil(r.startMeters),n=Math.floor(r.endMeters);if(n<=s)return null;let i=0;for(;i<12;){const c=Yt(s,n);if(t==null||Math.abs(c-t)>=ir)return{triggerDistanceMeters:c,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters};i+=1}const l=t!=null&&t<r.startMeters?n:s;return t==null||Math.abs(l-t)>=ir?{triggerDistanceMeters:l,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters}:null}function Fc(e,t,a,r=()=>1){const s=e.slice(0,15),n=Cc(t,a);if(s.length===0||n.length===0)return[];const i=Yt($c,Math.min(xc,s.length)),l=Mc(s,i,r),c=[];for(const u of l){const f=di(n);f&&c.push({riderId:u.id,attackNumber:1,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:Yt(ii,oi),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}if(c.length===0)return[];const o=c.map(u=>u.riderId),m=Math.floor(o.length*.5),p=new Set(jr(o,m));for(const u of[...c]){if(!p.has(u.riderId))continue;const f=di(n,u.triggerDistanceMeters);f&&c.push({riderId:u.riderId,attackNumber:2,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:Yt(ii,oi),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}return c.sort((u,f)=>u.triggerDistanceMeters-f.triggerDistanceMeters||u.riderId-f.riderId||u.attackNumber-f.attackNumber)}function Ec(e,t,a){var c;if(e.length===0)return[];const r=((c=e.find(o=>o.kind==="rider"&&o.riderId===t))==null?void 0:c.teamId)??null,s=e.filter(o=>!(o.kind!=="rider"||o.riderId==null||o.riderId===t||a.has(o.riderId)||r!=null&&o.teamId===r));if(s.length===0)return[];const n=new Map;for(const o of s){const m=n.get(o.teamId)??[];m.push(o),n.set(o.teamId,m)}const i=[...n.values()].map(o=>jr(o,1)[0]??null).filter(o=>o!=null&&o.riderId!=null);if(i.length===0)return[];const l=Math.min(Yt(0,3),i.length);return jr(i,l).map(o=>o.riderId)}function Pc(e,t){const a=[],r=[];for(const[s,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){r.push(s);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:r}}function vs(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}const Nc={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},Dc={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},Lc={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},_c={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},Ac={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function Bc(e){const t=new Map;for(const a of e){const r=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",r);else if(a.appliesTo==="climb_top"){const s=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${s}`,r)}else a.appliesTo==="finish"&&t.set(a.markerType,r)}return t}const or=20,Hc=120,zc=300,Ss=.025,Gc=.1,Kc=.4,Oc=.6,jc=.8,_a=1,ci=2/3,Wc=.1,lr=10,na=50,Vc=(()=>{const e=[];for(let t=0;t<=na;t++){const a=t<1?1:t>na?na:t;if(a<=2)e.push(.12*a);else if(a<=lr){const r=(a-2)/Math.max(1,lr-2);e.push(.24+r*.58)}else{const r=(a-lr)/Math.max(1,na-lr);e.push(.82+r*.18)}}return e})(),Uc=25,Yc=7,Zc=500,Jc=100,qc=.02,Xc=.04,Qc=.009,eu=120,tu=150,au=100,ru=300,ui=50,ks=85,Wt=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],mi=5*60,su=60,nu=.5,iu=.3,dr=5e3,ou=2e3,lu=1,du=2,cu=.05,Uo={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},uu={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},cr=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function xe(e,t,a){return Math.max(t,Math.min(a,e))}function pe(e,t){return e+Math.random()*(t-e)}const pi={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}};function gi(e,t){const a=pi[e]||pi[1];return a.pref.includes(t)?"pref":a.malus.includes(t)?"malus":"neutral"}function fi(e){return e[Math.floor(Math.random()*e.length)]}function ca(e){return Math.round(e*100)/100}function mu(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function hi(e){if(e<2)return 1;const t=xe(e,2,20),a=cr[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let r=1;r<cr.length;r+=1){const s=cr[r-1],n=cr[r];if(t>n.gradientPercent)continue;const i=(t-s.gradientPercent)/Math.max(1e-4,n.gradientPercent-s.gradientPercent),l=s.draftPenaltyShare+(n.draftPenaltyShare-s.draftPenaltyShare)*i;return Math.max(0,1-l)}return 0}function pu(e){return e==="Flat"?eu:e==="Abfahrt"?tu:Number.POSITIVE_INFINITY}function gu(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function fu(e){return(e.formBonus??0)+(e.raceFormBonus??0)-((e.fatigueMalus??0)+(e.longTermFatigueMalus??0)+(e.shortTermFatigueMalus??0))*.5}function hu(e,t){if(t.length===0)return"";const a=t.reduce((m,p)=>m+p.weight,0),r=t.map(m=>{const p=e.skills[m.key],u=Math.round(m.weight/a*100);return`${Uo[m.key]} ${Math.round(p)} (${u}%)`}),s=e.formBonus??0,n=e.raceFormBonus??0,i=(e.fatigueMalus??0)*.5,l=(e.longTermFatigueMalus??0)*.5,c=(e.shortTermFatigueMalus??0)*.5;r.push(`S-Form ${s>=0?"+":""}${s.toFixed(1).replace(".",",")}`),r.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&r.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),l>0&&r.push(`Langzeit -${l.toFixed(1).replace(".",",")}`),c>0&&r.push(`Akut -${c.toFixed(1).replace(".",",")}`);let o=0;if(e.mentorBoosts)for(const m of t)o+=(e.mentorBoosts[m.key]||0)*(m.weight/a);return o>0&&r.push(`Mentor +${o.toFixed(1).replace(".",",")}`),r.join(" • ")}function bu(){const e=Math.random();return e<.9?pe(5,20):e<.98?pe(20,40):pe(40,70)}function bi(){const e=Math.random();return e<.9?ca(pe(-1,1)):e<.995?ca(fi([-1,1])*pe(1,2)):ca(fi([-1,1])*pe(3,4))}function yu(){return ca(pe(-3,3))}function vu(e){const t=[];let a=0,r=bu(),s=pe(-1,1);for(;a<e;){const n=Math.min(e-a,pe(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:r,vector:s}),a+=n,a>=e)break;r=xe(r+(Math.random()<.5?-1:1)*pe(2,10),5,70),s=xe(s+(Math.random()<.5?-1:1)*pe(0,.5),-1,1)}return t}function Yo(e,t){const a=ie(e),r=ie(t);if(a!==r)return a?1:-1;const s=et(e),n=et(t);return s&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:s?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function ie(e){return e.isInactiveCached??(e.finishStatus==="dnf"||e.finishTimeSeconds!=null)}function et(e){return e.isFinisherCached??(e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null)}function ur(e){e.isInactiveCached=e.finishStatus==="dnf"||e.finishTimeSeconds!=null,e.isFinisherCached=e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function Ca(e,t,a=!1,r=null){var c;const s="rider"in e?e.rider:null,n=(s==null?void 0:s.specialization1)??null,i=(s==null?void 0:s.specialization2)??null;let l=0;if(t==="sprint_intermediate")n==="Berg"?l-=3:i==="Berg"&&(l-=2),n==="Sprint"?l+=1:i==="Sprint"&&(l+=.5);else if(t==="finish_flat")n==="Sprint"?l+=2:i==="Sprint"&&(l+=1),a&&((n==="Sprint"||i==="Sprint")&&(l+=1),n==="Berg"?l-=3:i==="Berg"&&(l-=2));else if(t==="climb_top"){const o=(c=s==null?void 0:s.role)==null?void 0:c.name;r==="4"?(n==="Sprint"?l-=3:i==="Sprint"&&(l-=1.5),(o==="Edelhelfer"||o==="Starke Helfer")&&(l+=2),o==="Wassertraeger"&&(l+=1),o==="Co-Kapitaen"&&(l-=1),o==="Kapitaen"&&(l-=3)):(n==="Sprint"?l-=3:i==="Sprint"&&(l-=1.5),o==="Edelhelfer"&&(l+=3),o==="Starke Helfer"&&(l+=1.5),o==="Wassertraeger"&&(l+=.5),o==="Co-Kapitaen"&&(l-=1),o==="Kapitaen"&&(l-=2)),(n==="Attacker"||i==="Attacker")&&(l+=3)}return l}function Su(e,t,a=null,r=null,s=!1){var f,g;const n=h=>h.photoFinishScore;if(!t){const h=[...e].sort((y,k)=>y.crossingTimeSeconds-k.crossingTimeSeconds||k.photoFinishScore-y.photoFinishScore||y.riderId-k.riderId),b=((f=h[0])==null?void 0:f.crossingTimeSeconds)??0;return h.map((y,k)=>({riderId:y.riderId,rank:k+1,crossingTimeSeconds:y.crossingTimeSeconds,gapSeconds:Math.max(0,y.crossingTimeSeconds-b),photoFinishScore:y.photoFinishScore}))}const i=[...e].sort((h,b)=>h.crossingTimeSeconds-b.crossingTimeSeconds||b.photoFinishScore-h.photoFinishScore||h.riderId-b.riderId),l=((g=i[0])==null?void 0:g.crossingTimeSeconds)??0,c=[];let o=[],m=0,p=null;const u=()=>{const h=Math.max(0,m-l),b=o.sort((y,k)=>n(k)-n(y)||y.riderId-k.riderId);for(const y of b)c.push({riderId:y.riderId,rank:c.length+1,crossingTimeSeconds:y.crossingTimeSeconds,gapSeconds:h,photoFinishScore:y.photoFinishScore})};for(const h of i){if(o.length===0){o=[h],m=h.crossingTimeSeconds,p=h.crossingTimeSeconds;continue}if(p!=null&&h.crossingTimeSeconds-p<=_a){o.push(h),p=h.crossingTimeSeconds;continue}u(),o=[h],m=h.crossingTimeSeconds,p=h.crossingTimeSeconds}return o.length>0&&u(),c}function ku(e,t,a){const r=e.filter(et).sort((p,u)=>(p.finishTimeSeconds??0)-(u.finishTimeSeconds??0)||u.photoFinishScore-p.photoFinishScore||p.rider.id-u.rider.id),s=e.filter(p=>!ie(p)).sort(Yo),n=e.filter(p=>p.finishStatus==="dnf").sort((p,u)=>u.distanceCoveredMeters-p.distanceCoveredMeters||p.rider.id-u.rider.id),i=[];let l=[],c=null;const o=p=>p.photoFinishScore,m=()=>{i.push(...l.sort((p,u)=>o(u)-o(p)||p.rider.id-u.rider.id))};for(const p of r){const u=p.finishTimeSeconds??0;if(l.length===0){l=[p],c=u;continue}if(c!=null&&u-c<=_a){l.push(p),c=u;continue}m(),l=[p],c=u}return l.length>0&&m(),[...i,...s,...n]}function $u(e,t){const a=e.isInactiveCached??!1,r=t.isInactiveCached??!1;if(a!==r)return a?1:-1;const s=t.distanceCoveredMeters-e.distanceCoveredMeters;if(Math.abs(s)>=.1)return s;if(e.tempSpeedMps!==t.tempSpeedMps)return t.tempSpeedMps-e.tempSpeedMps;const n=e.isFinisherCached??!1,i=t.isFinisherCached??!1;return n&&i?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:n?-1:i?1:e.rider.id-t.rider.id}function yi(e){const t=e<1?1:e>na?na:e;return Vc[t]}function $s(e,t){const a=e.conditionFormBonus??0;return Object.entries(t).reduce((r,[s,n])=>{if(!n)return r;const i=s==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,l=Math.max(0,e.rider.skills[s]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return r+l*n},0)}function xu(e,t){const a=e.conditionFormBonus??0;return Object.entries(t).filter(r=>!!r[1]).map(([r,s])=>{const n=r,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,l=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:s,effectiveSkill:l,contribution:l*s}})}let vi=null,mr=-1,pr=-1,xs=0,Ts=0;function Tu(e,t,a){if(vi!==e&&(vi=e,mr=-1,pr=-1,xs=0,Ts=0),pr>=t&&Math.abs(a-Ts)<1e-4)return{startIndex:mr,endIndex:pr,size:xs,positionInGroup:t-mr};let r=t;for(;r>0;){const i=e[r-1].distanceCoveredMeters-e[r].distanceCoveredMeters;if(i<=0||i>=a)break;r-=1}let s=t;for(;s<e.length-1;){const i=e[s].distanceCoveredMeters-e[s+1].distanceCoveredMeters;if(i<=0||i>=a)break;s+=1}const n=s-r+1;return mr=r,pr=s,xs=n,Ts=a,{startIndex:r,endIndex:s,size:n,positionInGroup:t-r}}function wu(e,t){if(e<Uc)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class Zo{constructor(t,a){var te,ae;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.staminaWeightByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.superTeamProtectedLeaderIds=new Set,this.superTeamBonusAmount=0,this.superTeamMalusAmount=0,this.superTeamStartPercent=0,this.superTeamEndPercent=0,this.superTeamBreakawayRiderCaught=!1,this.hasLoggedFinishSprintTieBreak=!1,this.hasAppliedSprintLeadoutBonuses=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1,this.isInstantSimulation=(a==null?void 0:a.isInstantSimulation)??!1;const r=(te=t.race.country)==null?void 0:te.code3;r&&(t.riders=t.riders.map(M=>{var V;const z=M.nationality||((V=M.country)==null?void 0:V.code3);if(z&&z.trim().toUpperCase()===r.trim().toUpperCase()){const U={...M,skills:{...M.skills}},X=Math.random(),A=t.stage.profile,L=A==="ITT"||A==="TTT",F=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(A==="Cobble"||A==="Cobble_Hill")&&F.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(A)||F.push("mountain","mediumMountain");const C=[...(J=>{const re=[...F],Q=[];if(L){Q.push("timeTrial");const we=Math.min(J-1,re.length);for(let me=0;me<we;me++){const Se=Math.floor(Math.random()*re.length);Q.push(re.splice(Se,1)[0])}}else{const we=Math.min(J,re.length);for(let me=0;me<we;me++){const Se=Math.floor(Math.random()*re.length);Q.push(re.splice(Se,1)[0])}}return Q})(5)].sort(()=>Math.random()-.5);if(U.homeEffectSkills=C,X<.05){U.homeEffect="home_pressure";for(const J of C)U.skills[J]=Math.max(0,U.skills[J]-.5)}else if(X<.1){U.homeEffect="super_home";const J=C[0];U.skills[J]=Math.min(100,U.skills[J]+3);for(let re=1;re<5;re++){const Q=C[re];U.skills[Q]=Math.min(100,U.skills[Q]+1)}}else{U.homeEffect="normal_home";for(const J of C)U.skills[J]=Math.min(100,U.skills[J]+1)}return U}return M}));const s=t.stage.rolledWeatherId||1;t.riders=t.riders.map(M=>{const z=M.weatherProfileId||1,V=gi(z,s);if(V==="neutral")return M;const U={...M,skills:{...M.skills}},X=["flat","mountain","stamina","bikeHandling","recuperation","downhill"];if(V==="pref")for(const A of X){const L=pe(.2,1);U.skills[A]=Math.min(100,U.skills[A]+L)}else if(V==="malus"){let A=0;if(t.lieutenants){const L=t.lieutenants.find(F=>F.leaderId===M.id);if(L&&t.riders.some(j=>j.id===L.lieutenantId)){const j=t.riders.find(C=>C.id===L.lieutenantId),O=(j==null?void 0:j.weatherProfileId)||1;gi(O,s)==="pref"&&(A=pe(.4,.75))}}for(const L of X){const F=pe(.2,1)*(1-A);U.skills[L]=Math.max(0,U.skills[L]-F)}}return U}),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=Yd(t.stage.profile),this.skillWeightRuleMap=Vd(t.skillWeightRules??[]),this.skillWeightConfigMap=Ud(t.skillWeightRules??[]),this.stageScoringWeightMap=Bc(t.stageScoringRules??[]),this.finalSpreadConfigMap=new Map;const n=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"];for(const M of n){this.finalSpreadConfigMap.set(M,Jd(this.simulationMode,M,this.skillWeightConfigMap));const z=this.resolveWeightedSkillComponents(M),V=z.reduce((A,L)=>A+L.weight,0),U=z.find(A=>A.key==="stamina"),X=U&&V>0?U.weight/V:0;this.staminaWeightByTerrain.set(M,X)}for(const M of t.stageSummary.segments){M.endMeterCached=M.end_km*1e3;const z=xe(M.gradient_percent,-20,20);M.gradientModifierCached=z>0?Math.exp(-.11*z):1-z*.06}this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=vu(this.stageDistanceMeters);for(const M of this.windZones)M.windModifierCached=1+M.vector*(M.windSpeedKph/100)*.52;const i=5,l=Math.ceil(this.stageDistanceMeters/i)+1;this.elevationGrid=new Float32Array(l);for(let M=0;M<l;M++){const z=M*i,V=t.stageSummary.segments.find(U=>z>=U.start_km*1e3&&z<=U.end_km*1e3)||t.stageSummary.segments[t.stageSummary.segments.length-1];this.elevationGrid[M]=this.resolveSegmentElevationExact(V,z)}this.intermediateMarkers=this.buildIntermediateMarkers();const c=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=c!=null?xe(c/100,0,1):pe(Oc,jc);const o=t.stage.finalPushStartPercent;this.finalPushStartRatio=o!=null?xe(o/100,this.lateStageStartRatio,1):xe(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const m=ac(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(m.map(M=>[M.riderId,M])),m.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",m.map(z=>({riderId:z.riderId,type:z.type,severity:z.severity,kmMark:z.triggerDistanceKm,waitDurationSeconds:z.waitDurationSeconds,supportRiderIds:z.supportRiderIds})));const M=m.filter(z=>z.isMassCrashTrigger);M.length>0&&M.forEach(z=>{var V;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${z.riderId} bei Km ${z.triggerDistanceKm}. Potenziell betroffene Fahrer (${(V=z.massCrashPotentialRiderIds)==null?void 0:V.length}):`,z.massCrashPotentialRiderIds)})}const p=t.riders.map(M=>{var V,U;const z={rider:M,riderName:`${M.firstName} ${M.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:yu(),microForm:bi(),nextFormUpdateMeter:pe(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(M.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode,baseSkillsCached:(()=>{const X={},A=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"];for(const L of A)X[L]=this.resolveWeightedSkillExact(M,L);return X})(),nextSegmentBoundaryMeters:((V=t.stageSummary.segments[0])==null?void 0:V.endMeterCached)??1/0,nextWindZoneBoundaryMeters:((U=this.windZones[0])==null?void 0:U.endMeter)??1/0,staminaCalculatedThisTick:!1,nextStaminaUpdateMeter:0};return this.applyPersistentStageRaceState(z),z}),u=new Map(p.map(M=>[M.rider.id,M.dailyForm]));this.stageFavorites=vo(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:u});const f=this.stageFavorites.filter(M=>M.kind==="rider"&&M.riderId!=null).slice(0,15).map(M=>t.riders.find(z=>z.id===M.riderId)??null).filter(M=>M!=null),g=((ae=t.gcStandings.find(M=>M.rank===1))==null?void 0:ae.riderId)??null,h=Fc(f,t.stage,t.stageSummary,M=>Math.max(1,Math.pow(10,(M.skills.attack-65)/10))*(M.id===g?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const M of h){const z=this.precalculatedStageAttacksByRiderId.get(M.riderId)??[];z.push(M),this.precalculatedStageAttacksByRiderId.set(M.riderId,z)}this.breakawayPlan=Sc(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings,t.teams);const b=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=b.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=b.fallbackCheckpointsMeters;for(const M of p)M.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const y=ic(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:u}),k=new Map(y.map(M=>[M.id,M])),T=p.map(M=>{const z=k.get(M.rider.id)??M.rider;return{...M,rider:z,riderName:`${z.firstName} ${z.lastName}`,dailyForm:M.dailyForm+(z.specialFormDelta??0)}}),x=y.filter(M=>M.hasSuperform),$=y.filter(M=>M.hasSupermalus);(x.length>0||$.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:x.map(M=>`${M.firstName} ${M.lastName}`),supermalus:$.map(M=>`${M.firstName} ${M.lastName}`)});const N=this.resolveStartOrder(T),E=new Map((this.bootstrap.teamStartOrder??[]).map((M,z)=>[M,z]));if(this.riders=N.map((M,z)=>({...M,startOffsetSeconds:this.resolveStartOffsetSeconds(M,z,E)})),this.riders.forEach(M=>{ur(M),M.conditionFormBonus=fu(M.rider),M.staminaEndPenaltyCached=this.precalculateStaminaEndPenalty(M.rider.skills.stamina),this.syncRiderTelemetry(M)}),this.breakawayPlan&&this.breakawayPlan.superTeamId!=null){this.superTeamId=this.breakawayPlan.superTeamId,this.superTeamBonusAmount=vs(2,6),this.superTeamMalusAmount=vs(4,8),this.superTeamStartPercent=pe(.4,.6),this.superTeamEndPercent=pe(.86,.96);const M=F=>(F??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),z=t.riders.filter(F=>F.activeTeamId===this.superTeamId),V=z.filter(F=>{var j;return M((j=F.role)==null?void 0:j.name)==="kapitaen"}),U=z.filter(F=>{var j;return M((j=F.role)==null?void 0:j.name)==="co-kapitaen"});if(V.length>0){if(V.forEach(F=>this.superTeamProtectedLeaderIds.add(F.id)),V.length===1&&U.length>0){const F=[...U].sort((j,O)=>O.overallRating-j.overallRating||O.id-j.id);this.superTeamProtectedLeaderIds.add(F[0].id)}}else if(U.length>0)[...U].sort((j,O)=>O.overallRating-j.overallRating||O.id-j.id).slice(0,2).forEach(j=>this.superTeamProtectedLeaderIds.add(j.id));else{const F=z.filter(j=>{var O;return M((O=j.role)==null?void 0:O.name)==="edelhelfer"});if(F.length>0){const j=[...F].sort((O,w)=>w.overallRating-O.overallRating||w.id-O.id);this.superTeamProtectedLeaderIds.add(j[0].id)}}const X=t.teams.find(F=>F.id===this.superTeamId),A=X?X.name:`Team ${this.superTeamId}`;this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,riderTeamId:this.superTeamId,type:"superteam",tone:"neutral",title:`Superteam des Tages: ${A}`,detail:`Dieses Team hat sich heute zusammengeschlossen, um seinen Leader zu unterstützen! Die Helfer erhalten zwischen ${(this.superTeamStartPercent*100).toFixed(0)}% und ${(this.superTeamEndPercent*100).toFixed(0)}% der Etappe einen Bonus von +${this.superTeamBonusAmount} auf Berg, Hill, Medium Mountain und Flat. Danach folgt ein individueller Malus von -4 bis -8 wegen Erschöpfung.`});const L=this.riders.find(F=>{var j;return F.rider.activeTeamId===this.superTeamId&&((j=this.breakawayPlan)==null?void 0:j.riderIds.includes(F.rider.id))});L&&(this.superTeamBreakawayRiderId=L.rider.id)}for(const M of this.riders){const z=M.rider.homeEffectSkills,V=U=>uu[U]||U;if(M.rider.homeEffect==="super_home"){const U=z&&z.length===5?`${V(z[0])} (+3), ${V(z[1])} (+1), ${V(z[2])} (+1), ${V(z[3])} (+1), ${V(z[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${U})`})}if(M.rider.homeEffect==="home_pressure"){const U=z?z.map(V).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${U})`})}if(M.rider.homeEffect==="normal_home"){const U=z?z.map(V).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${U})`})}M.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),M.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),M.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:M.rider.id,riderName:M.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(M.rider.id,M.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const R=this.bootstrap.stage.rolledWetterName??"Sonnig",I=this.bootstrap.stage.rolledEffektSturz??0,_=this.bootstrap.stage.rolledEffektDefekt??0,P=this.bootstrap.stage.rolledWindkantenGefahr??0,D=this.bootstrap.stage.rolledEffektFatigue??0,G=this.bootstrap.stage.rolledBreakawayBonus??0,B=[];I>0&&B.push(`Sturzwahrscheinlichkeit +${I.toFixed(1)}%`),_>0&&B.push(`Defektwahrscheinlichkeit +${_.toFixed(1)}%`),P>0&&B.push(`Windkanten-Gefahr +${(P*100).toFixed(1)}%`),D>0&&B.push(`Fatigue +${D.toFixed(1)}%`),G>0&&B.push(`Ausreißer-Bonus +${G.toFixed(1)}`);const q=B.length>0?`Wettereinflüsse: ${B.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${R}`,detail:q})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const r=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(r),a-=r}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(r=>({riderId:r.rider.id,riderName:r.riderName,startOffsetSeconds:r.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(r),hasStarted:r.hasStarted||ie(r),distanceCoveredMeters:r.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-r.distanceCoveredMeters),segmentStartKm:r.segmentStartKm,segmentEndKm:r.segmentEndKm,segmentStartElevation:r.segmentStartElevation,segmentEndElevation:r.segmentEndElevation,activeTerrain:et(r)?"Finish":r.activeTerrain,skillName:et(r)?"Finish":r.skillName,skillBreakdown:et(r)?"":r.skillBreakdown,baseSkill:r.baseSkill,teamGroupBonus:r.teamGroupBonus,effectiveSkill:r.effectiveSkill,staminaPenalty:r.staminaPenalty,elevationPenalty:r.elevationPenalty,dailyForm:r.dailyForm,microForm:r.microForm,gradientPercent:r.gradientPercent,gradientModifier:r.gradientModifier,windModifier:r.windModifier,draftModifier:r.draftModifier,draftNearbyRiderCount:r.draftNearbyRiderCount,draftPackFactor:r.draftPackFactor,currentSpeedMps:r.currentSpeedMps,photoFinishScore:r.photoFinishScore,leadoutBonus:r.leadoutBonus,leadoutRiderId:r.leadoutRiderId,leadoutContributions:r.leadoutContributions,lastSplitLabel:r.lastSplitLabel,lastSplitTimeSeconds:r.lastSplitTimeSeconds,splitTimes:{...r.splitTimes},finishTimeSeconds:Number.isFinite(r.finishTimeSeconds??Number.NaN)?r.finishTimeSeconds:null,finishStatus:r.finishStatus,statusReason:r.statusReason,isAttacking:r.isAttacking,isBreakaway:r.isBreakaway,isLeadingGroup:r.isLeadingGroup,hasSuperform:r.rider.hasSuperform===!0,hasSupermalus:r.rider.hasSupermalus===!0,isFinished:et(r)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(r=>r.appliedIncident?[r.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus},superTeamId:this.superTeamId}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;if(this.isInstantSimulation){const i={id:this.nextMessageId,elapsedSeconds:t.elapsedSeconds,riderId:t.riderId,riderName:t.riderName,type:t.type,tone:t.tone,title:"",detail:"",riderTeamId:null,kmMark:0};this.messages.unshift(i),this.allEvents.push(i),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60);return}const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let r=null;if(t.riderId!=null){const i=this.riders.find(l=>l.rider.id===t.riderId);i&&(r=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(r==null){const i=this.riders.filter(l=>l.finishStatus!=="dnf").reduce((l,c)=>Math.max(l,c.distanceCoveredMeters),0);r=Number((i/1e3).toFixed(2))}const s={id:this.nextMessageId,...t,riderTeamId:a,kmMark:r};this.messages.unshift(s),this.allEvents.push(s),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(r=>[r.rider.id,r]));return this.intermediateMarkers.map(r=>{const s=t.map(i=>i.markerCrossings[r.key]??null).filter(i=>i!=null),n=Su(s,!this.isTimeTrialMode,r.markerType,a,this.isClimberMalusStage());return{markerKey:r.key,markerLabel:r.label,markerType:r.markerType,markerCategory:r.markerCategory,kmMark:r.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.isTimeTrialMode?[...this.riders].sort(Yo):ku(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(s=>s.finishStatus!=="dnf").reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0);let r=0;for(const s of t)et(s)&&(r+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:r,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(ie)}advanceSubstep(t){for(const o of this.riders)o.staminaCalculatedThisTick=!1;const a=this.elapsedSeconds,r=a+t,s=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();if(this.updateBreakawayPhaseState(),this.superTeamId!=null&&this.superTeamBreakawayRiderId!=null&&!this.superTeamBreakawayRiderCaught){const o=this.riders.find(m=>m.rider.id===this.superTeamBreakawayRiderId);o&&!ie(o)&&this.riders.filter(u=>this.superTeamProtectedLeaderIds.has(u.rider.id)&&!ie(u)).some(u=>u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&u.distanceCoveredMeters>=o.distanceCoveredMeters)&&(this.superTeamBreakawayRiderCaught=!0,o.breakawayMalus=0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:o.rider.id,riderName:o.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(o.rider.id,o.riderName)} von Leader eingeholt!`,detail:"Der Ausreißer wurde von seinem Kapitän eingeholt und unterstützt das Team ab jetzt mit frischen Kräften!"}))}if(this.superTeamBreakawayRiderCaught&&this.superTeamBreakawayRiderId!=null){const o=this.riders.find(m=>m.rider.id===this.superTeamBreakawayRiderId);o&&(o.breakawayMalus=0)}for(const o of this.riders){if(ie(o)){o.nextDistanceCoveredMeters=null,o.tempSpeedMps=0,o.draftModifier=1,o.draftNearbyRiderCount=0,o.draftPackFactor=0,o.currentSpeedMps=0,o.isAttacking=!1,o.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&r<=o.startOffsetSeconds){o.nextDistanceCoveredMeters=null,o.tempSpeedMps=0,o.draftModifier=1,o.draftNearbyRiderCount=0,o.draftPackFactor=0,o.currentSpeedMps=0,o.teamGroupBonus=0,o.isAttacking=!1,o.isLeadingGroup=!1;continue}const m=this.isTimeTrialMode?Math.max(a,o.startOffsetSeconds):a,p=Math.max(0,r-m);if(p<=0)continue;if(o.incidentDelaySecondsRemaining>0){o.incidentDelaySecondsRemaining=Math.max(0,o.incidentDelaySecondsRemaining-p),o.tempSpeedMps=0,o.currentSpeedMps=0,o.nextDistanceCoveredMeters=o.distanceCoveredMeters,o.isAttacking=this.activeStageAttacksByRiderId.has(o.rider.id);continue}o.hasStarted=!0,this.advanceIndexForDistance(o);const u=this.currentSegment(o),f=this.currentWindZone(o);if(o.currentSegmentCached=u,o.currentWindZoneCached=f,!u||!f){o.distanceCoveredMeters=this.stageDistanceMeters,o.nextDistanceCoveredMeters=this.stageDistanceMeters,o.finishTimeSeconds=m,ur(o),o.tempSpeedMps=0,o.draftModifier=1,o.draftNearbyRiderCount=0,o.draftPackFactor=0,o.currentSpeedMps=0,o.isAttacking=!1,o.isLeadingGroup=!1,o.activeTerrain="Finish",o.skillName="Finish",o.skillBreakdown="",o.photoFinishScore=this.calculatePhotoFinishScore(o);const g=Ca(o,this.resolveFinishMarkerType(),this.isClimberMalusStage());o.photoFinishScore+=g,o.leadoutBonus=0,o.leadoutRiderId=null,o.leadoutContributions=[];continue}o.teamGroupBonus=this.resolveTeamGroupBonusValue(o,s),this.calculateBasePhysics(o,u,f),o.activeTerrain=u.terrain,o.draftModifier=1,o.draftNearbyRiderCount=0,o.draftPackFactor=0,o.currentSpeedMps=o.tempSpeedMps,o.photoFinishScore=this.calculatePhotoFinishScore(o),o.isAttacking=this.activeStageAttacksByRiderId.has(o.rider.id),o.isLeadingGroup=!this.isTimeTrialMode,o.nextDistanceCoveredMeters=null,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*p}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,r);else if(!this.isTimeTrialMode){const o=this.draftOrderScratch;o.length=0;for(const m of this.riders)ie(m)||o.push(m);o.sort($u);for(let m=0;m<o.length;m+=1){const p=o[m];if(ie(p))continue;const u=this.isActiveBreakawayRider(p),f=p.tempSpeedMps/14,g=Math.max(5,50*f),h=p.currentSegmentCached,b=Math.max(15,150*f),y=Math.max(g,Math.min(b,pu(h==null?void 0:h.terrain))),k=Tu(o,m,y),T=k.size,x=yi(T),$=wu(T,k.positionInGroup);let N=0,E=Number.POSITIVE_INFINITY,R=null;for(let A=m-1;A>=0;A-=1){const L=o[A],F=L.distanceCoveredMeters-p.distanceCoveredMeters;if(F>=y+Wc)break;!this.canReceiveDraftFromCandidate(p,L)||this.isActiveBreakawayRider(L)||F<=0||F>=y||(N+=1,F<=E&&(E=F,R=L))}if(N===0||!R){if(u)continue;p.draftModifier=1,p.draftNearbyRiderCount=0,p.draftPackFactor=0,p.currentSpeedMps=p.tempSpeedMps,p.nextDistanceCoveredMeters=p.distanceCoveredMeters+p.currentSpeedMps*t,p.isLeadingGroup=!0,this.applyCaptainWaitLogic(p);continue}const I=ie(R)?R.tempSpeedMps:R.currentSpeedMps,_=E,P=_<=g?1:1-(_-g)/Math.max(1e-4,y-g),D=this.currentWindZone(p),G=(D==null?void 0:D.vector)??0,B=(D==null?void 0:D.windSpeedKph)??0,q=-G*(B/70),ae=Math.max(.3,.35+.35*q)*Math.min(1,f)*ci,M=xe((h==null?void 0:h.gradient_percent)??0,-20,20),z=hi(M),U=1+($?0:ae*P*x*z),X=p.tempSpeedMps*U;if(!(u&&U<=p.draftModifier)){if(p.draftModifier=U,p.draftNearbyRiderCount=T,p.draftPackFactor=x,p.isLeadingGroup=$,X>I){if(p.tempSpeedMps>R.tempSpeedMps){p.currentSpeedMps=X,p.nextDistanceCoveredMeters=p.distanceCoveredMeters+p.currentSpeedMps*t;continue}if(_<1){p.currentSpeedMps=I,p.nextDistanceCoveredMeters=R.distanceCoveredMeters+I*t,u||this.applyCaptainWaitLogic(p);continue}p.currentSpeedMps=Math.min(X,I+2),p.nextDistanceCoveredMeters=p.distanceCoveredMeters+p.currentSpeedMps*t,u||this.applyCaptainWaitLogic(p);continue}p.currentSpeedMps=X,p.nextDistanceCoveredMeters=p.distanceCoveredMeters+p.currentSpeedMps*t,u||this.applyCaptainWaitLogic(p)}}}this.applyBreakawayGroupTempo(t);for(const o of this.riders)o.incidentRecoverySecondsRemaining>0&&o.draftModifier>=1.2&&(o.incidentRecoverySecondsRemaining=0,o.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const o of this.riders){if(ie(o))continue;if(this.superTeamId!=null&&o.rider.activeTeamId===this.superTeamId&&!this.superTeamProtectedLeaderIds.has(o.rider.id)){const y=o.rider.id===this.superTeamBreakawayRiderId;if(!y||this.superTeamBreakawayRiderCaught){const k=o.distanceCoveredMeters/this.stageDistanceMeters;let T=0,x=!1,$=!1;y?k<this.superTeamEndPercent?x=!0:o.superTeamActiveLogged&&($=!0):k>=this.superTeamStartPercent&&k<this.superTeamEndPercent?x=!0:k>=this.superTeamEndPercent&&o.superTeamActiveLogged&&($=!0),x?(T=this.superTeamBonusAmount,o.superTeamActiveLogged||(o.superTeamActiveLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:o.rider.id,riderName:o.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(o.rider.id,o.riderName)} leistet Führungsarbeit!`,detail:y?`Der eingeholte Ausreißer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`:`Der Edelhelfer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`}))):$&&(o.superTeamMalusAmount==null&&(o.superTeamMalusAmount=vs(4,8)),T=-o.superTeamMalusAmount,o.superTeamExhaustedLogged||(o.superTeamExhaustedLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:o.rider.id,riderName:o.riderName,type:"superteam",tone:"warning",title:`${this.formatRiderWithPreStageGc(o.rider.id,o.riderName)} ist erschöpft!`,detail:`Die Führungsarbeit hat ihren Tribut gefordert. Der Fahrer erhält für den Rest der Etappe einen Malus von -${o.superTeamMalusAmount} auf Berg-, Hügel- und Flachpassagen.`}))),o.originalSkills||(o.originalSkills={flat:o.rider.skills.flat,mountain:o.rider.skills.mountain,mediumMountain:o.rider.skills.mediumMountain,hill:o.rider.skills.hill}),o.rider.skills.flat=o.originalSkills.flat+T,o.rider.skills.mountain=o.originalSkills.mountain+T,o.rider.skills.mediumMountain=o.originalSkills.mediumMountain+T,o.rider.skills.hill=o.originalSkills.hill+T}}if(this.isTimeTrialMode&&r<=o.startOffsetSeconds)continue;const m=this.isTimeTrialMode?Math.max(a,o.startOffsetSeconds):a,p=Math.max(0,r-m);if(p<=0)continue;const u=o.distanceCoveredMeters,f=o.nextDistanceCoveredMeters??o.distanceCoveredMeters+o.currentSpeedMps*p,g=o.pendingIncident;if(g&&u<g.triggerDistanceMeters&&f>=g.triggerDistanceMeters){const y=Math.max(.1,o.currentSpeedMps),k=Math.max(0,(g.triggerDistanceMeters-u)/y);o.distanceCoveredMeters=g.triggerDistanceMeters,this.recordIntermediateSplits(o,u,o.distanceCoveredMeters,m,o.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(o,u,o.distanceCoveredMeters,m,o.currentSpeedMps),this.applyIncident(o,g,m+k),o.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(o),this.syncRiderTelemetry(o,n);continue}const h=this.stageDistanceMeters-o.distanceCoveredMeters;if(Math.max(0,f-o.distanceCoveredMeters)>=h){const y=h/o.currentSpeedMps;o.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(o,u,o.distanceCoveredMeters,m,o.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(o,u,o.distanceCoveredMeters,m,o.currentSpeedMps),o.finishTimeSeconds=m+y,ur(o),o.currentSpeedMps=0;const k=Ca(o,this.resolveFinishMarkerType(),this.isClimberMalusStage());o.photoFinishScore+=k,o.leadoutBonus=0,o.leadoutRiderId=null,o.leadoutContributions=[]}else o.distanceCoveredMeters=f,this.recordIntermediateSplits(o,u,o.distanceCoveredMeters,m,o.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(o,u,o.distanceCoveredMeters,m,o.currentSpeedMps);for(this.triggerStageAttacksForRider(o,u,o.distanceCoveredMeters,m),o.nextDistanceCoveredMeters=null,o.incidentRecoverySecondsRemaining>0&&(o.incidentRecoverySecondsRemaining=Math.max(0,o.incidentRecoverySecondsRemaining-p),o.incidentRecoverySecondsRemaining<=0&&(o.incidentRecoveryFormBonus=0));!ie(o)&&o.distanceCoveredMeters>=o.nextFormUpdateMeter;)o.microForm=bi(),o.nextFormUpdateMeter+=pe(5e3,4e4);this.advanceIndexForDistance(o),this.syncRiderTelemetry(o,n)}const i=this.updateBreakawayPhaseState(),l=this.updateBreakawayMalusRecovery();if((i||l)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const o=new Set(this.breakawayPlan.riderIds),m=this.riders.filter(u=>o.has(u.rider.id)&&!ie(u)),p=this.riders.filter(u=>!o.has(u.rider.id)&&!ie(u));if(m.length>0&&p.length>0){const u=m.reduce((g,h)=>h.distanceCoveredMeters>g.distanceCoveredMeters?h:g,m[0]);p.reduce((g,h)=>h.distanceCoveredMeters>g.distanceCoveredMeters?h:g,p[0]).distanceCoveredMeters>=u.distanceCoveredMeters&&(u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:u.rider.id,riderName:u.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${u.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const c=Pc(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const o of c.newActiveAttacks)this.activeStageAttacksByRiderId.set(o.riderId,o);for(const o of this.riders)o.isAttacking=!ie(o)&&this.activeStageAttacksByRiderId.has(o.rider.id);this.elapsedSeconds+=t,this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const r=new Map;for(const s of this.riders){if(ie(s)||s.rider.activeTeamId==null||a<=s.startOffsetSeconds)continue;const n=r.get(s.rider.activeTeamId)??[];n.push(s),r.set(s.rider.activeTeamId,n)}for(const s of r.values()){const n=s[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const l=Math.min(5,s.length),c=[...s].sort((u,f)=>f.effectiveSkill-u.effectiveSkill||u.rider.id-f.rider.id).slice(0,l).reduce((u,f)=>u+f.effectiveSkill,0)/Math.max(l,1),o=Math.max(0,8-s.length),m=Math.max(1,c-o),p=this.resolveTimeTrialSpeedMps(m,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*Zd(i.terrain,this.bootstrap.skillWeightRules??[]);for(const u of s){const f=Math.max(t,u.startOffsetSeconds),g=Math.max(0,a-f);u.currentSpeedMps=p,u.tempSpeedMps=p,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+p*g}}}advanceIndexForDistance(t){const a=t.distanceCoveredMeters;if(a<(t.nextSegmentBoundaryMeters??1/0)&&a<(t.nextWindZoneBoundaryMeters??1/0))return;for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const n=this.bootstrap.stageSummary.segments[t.segmentIndex],i=n.endMeterCached??n.end_km*1e3;if(a<i)break;t.segmentIndex+=1}const r=this.bootstrap.stageSummary.segments[t.segmentIndex];for(t.nextSegmentBoundaryMeters=r?r.endMeterCached??r.end_km*1e3:1/0;t.windZoneIndex<this.windZones.length-1;){const n=this.windZones[t.windZoneIndex];if(a<n.endMeter)break;t.windZoneIndex+=1}const s=this.windZones[t.windZoneIndex];t.nextWindZoneBoundaryMeters=s?s.endMeter:1/0}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const s=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const l=n.rider.activeTeamId!=null?s.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,c=i.rider.activeTeamId!=null?s.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return l!==c?l-c:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(s=>[s.riderId,s.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((s,n)=>{const i=a.get(s.rider.id),l=a.get(n.rider.id);return i!=null&&l!=null?l-i:i!=null?-1:l!=null?1:this.resolveProjectedIttStartScore(s)-this.resolveProjectedIttStartScore(n)||s.rider.id-n.rider.id}):[...t].sort((s,n)=>s.rider.skills.timeTrial-n.rider.skills.timeTrial||s.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,r=0;for(const s of this.bootstrap.stageSummary.segments){const n=(s.start_km+s.end_km)/2*1e3,i=this.resolveStaminaPenalty(t,n)+t.incidentStaminaPenalty,l=this.resolveWeightedSkill(t.rider,s.terrain),c=i>0?this.resolveWeightedSkill(t.rider,s.terrain,i):l,o=Math.max(0,l.value-c.value),{effectiveSkill:m}=this.resolveEffectiveSkill(t,c.value,o,0,n),p=xe(s.gradient_percent,-20,20),u=p>0?Math.exp(-.11*p):1-p*.06,f=this.windZones.find(h=>n>=h.startMeter&&n<=h.endMeter)??this.windZones[this.windZones.length-1],g=f?1+f.vector*(f.windSpeedKph/100)*.52:1;a+=m*u*g*s.length_km,r+=s.length_km}return r>0?a/r:0}resolveStartOffsetSeconds(t,a,r){if(this.isIndividualTimeTrial)return a*Hc;if(this.isTeamTimeTrial){const s=t.rider.activeTeamId;return(s!=null?r.get(s)??0:0)*zc}return 0}buildIntermediateMarkers(){return vt(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||Kt(t)).map(({key:t,label:a,marker:r,kmMark:s})=>({key:t,distanceMeters:s*1e3,label:a,markerType:r.type,markerCategory:r.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(c=>c.distanceMeters<t.groupPhaseEndDistanceMeters),r=this.stageDistanceMeters*iu,s=a.some(c=>c.distanceMeters<=r);if(!(a.length<=1||!s))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],l=Math.max(dr,Math.ceil(r/dr)*dr);for(let c=l;c<t.groupPhaseEndDistanceMeters;c+=dr)i.push(c);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,r){var $;const s=gu(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty;let i=0,l=0,c="";if(this.isInstantSimulation){i=(($=t.baseSkillsCached)==null?void 0:$[a.terrain])??0;const N=this.staminaWeightByTerrain.get(a.terrain)??0;l=Math.max(0,i-n*N)}else{const N=this.resolveWeightedSkill(t.rider,a.terrain),E=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):N;i=N.value,l=E.value,c=E.breakdown}const o=Math.max(0,i-l),m=this.resolveAttackSkillBonus(t),p=Math.min(85,l)+m,u=this.isTimeTrialMode?0:t.teamGroupBonus,f=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:g,staminaPenalty:h,elevationPenalty:b}=this.resolveEffectiveSkill(t,p,o,u,t.distanceCoveredMeters,f),y=xe(a.gradient_percent,-20,20),k=a.gradientModifierCached??(y>0?Math.exp(-.11*y):1-y*.06),T=r.windModifierCached??1+r.vector*(r.windSpeedKph/100)*.52,x=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);t.skillName=s,t.skillBreakdown=c,t.baseSkill=p,t.teamGroupBonus=u,t.effectiveSkill=g,t.staminaPenalty=h,t.elevationPenalty=b,t.gradientPercent=y,t.gradientModifier=k,t.windModifier=T,t.tempSpeedMps=this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(g,t.distanceCoveredMeters,a,k,T):this.resolveRoadStageSpeedMps(g,t.distanceCoveredMeters,a,k,T,x)}resolveRoadStageSpeedMps(t,a,r,s,n,i){const l=this.resolveSkillSpreadFactor(a,r),c=this.resolveSegmentElevation(r,a),o=this.resolveElevationSkillSpreadFactor(r,c),u=(40+(t-50)*i*l*o)/3.6;return Math.max(.5,u*s*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const r=Math.max(0,a-Zc),s=Math.floor(r/Jc);return t.terrain==="Mountain"?1+(s*Xc+s*Math.max(0,s-1)*Qc/2):1+s*qc}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkillCached(t,a,r){const s=a[t.activeTerrain],n=s!==void 0&&s!==-1/0?s:r;return n>t.effectiveSkill?n:t.effectiveSkill}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,r){if(r<=1)return{draftModifier:1,draftPackFactor:0};const s=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,l=(n==null?void 0:n.windSpeedKph)??0,c=-i*(l/70),m=Math.max(.3,.35+.35*c)*Math.min(1,s)*ci,p=xe(a.gradient_percent,-20,20),u=hi(p),f=yi(r);return{draftModifier:1+m*f*u,draftPackFactor:f}}resolveBreakawayTimeGapPenalty(t){if(t<mi)return 0;const a=Math.floor((t-mi)/su);return nu+a}recordBreakawayFallbackCheckpointCrossings(t,a,r,s,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,l=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(l==null||l>r)break;if(l<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const c=(l-a)/n,o=Math.max(0,this.isTimeTrialMode?s+c-t.startOffsetSeconds:s+c);t.breakawayFallbackCheckpointTimes[i]=o,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,l;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let s=((l=t[0])==null?void 0:l.breakawayGapPenalty)??0,n=null;for(const c of a){if(!n){n=c;continue}const o=c.distanceCoveredMeters-n.distanceCoveredMeters;if(o>0)n=c;else if(o===0){const m=c.currentSpeedMps-n.currentSpeedMps;(m>0||m===0&&c.rider.id<n.rider.id)&&(n=c)}}if(!n)return this.breakawayGapStatus=null,s;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const c=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!c)break;const o=n.markerCrossings[c.key]??null;if(!o)break;let m=null;for(const p of t){const u=p.markerCrossings[c.key];if(!u)continue;if(!m){m=u;continue}const f=u.crossingTimeSeconds-m.crossingTimeSeconds;(f<0||f===0&&u.riderId<m.riderId)&&(m=u)}if(m){const p=o.crossingTimeSeconds-m.crossingTimeSeconds;s=this.resolveBreakawayTimeGapPenalty(p),this.breakawayGapStatus={gapSeconds:p,penalty:s,kmMark:c.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const c=this.nextBreakawayGapPenaltyFallbackIndex,o=n.breakawayFallbackCheckpointTimes[c]??null;if(o==null)break;let m=null;for(const p of t){const u=p.breakawayFallbackCheckpointTimes[c];u!=null&&(m==null||u<m)&&(m=u)}if(m!=null){const p=o-m;s=this.resolveBreakawayTimeGapPenalty(p),this.breakawayGapStatus={gapSeconds:p,penalty:s,kmMark:c<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[c]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return s}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),r=this.riders.filter(l=>!ie(l)&&a.has(l.rider.id)&&l.activeTerrain!=="Finish"),s=this.riders.filter(l=>!ie(l)&&!a.has(l.rider.id)&&l.activeTerrain!=="Finish");if(r.length===0||s.length===0){this.breakawayGapStatus=null;return}let n=null;for(const l of r){if(!n){n=l;continue}const c=l.distanceCoveredMeters-n.distanceCoveredMeters;if(c>0)n=l;else if(c===0){const o=l.currentSpeedMps-n.currentSpeedMps;(o>0||o===0&&l.rider.id<n.rider.id)&&(n=l)}}let i=null;for(const l of s){if(!i){i=l;continue}const c=l.distanceCoveredMeters-i.distanceCoveredMeters;if(c>0)i=l;else if(c===0){const o=l.currentSpeedMps-i.currentSpeedMps;(o>0||o===0&&l.rider.id<i.rider.id)&&(i=l)}}if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let l=this.intermediateMarkers.length-1;l>=0;l-=1){const c=this.intermediateMarkers[l];if(!c)continue;const o=n.markerCrossings[c.key]??null,m=i.markerCrossings[c.key]??null;if(!o||!m)continue;const p=m.crossingTimeSeconds-o.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:p,penalty:this.resolveBreakawayTimeGapPenalty(p),kmMark:c.distanceMeters/1e3};return}for(let l=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;l>=0;l-=1){const c=this.breakawayGapPenaltyFallbackCheckpointsMeters[l];if(c==null)continue;const o=n.breakawayFallbackCheckpointTimes[l]??null,m=i.breakawayFallbackCheckpointTimes[l]??null;if(o==null||m==null)continue;const p=m-o;this.breakawayGapStatus={gapSeconds:p,penalty:this.resolveBreakawayTimeGapPenalty(p),kmMark:c/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=new Set(a.riderIds),s=this.riders.filter(o=>!ie(o)&&r.has(o.rider.id));if(s.length===0)return;const n=this.riders.filter(o=>!ie(o)&&!r.has(o.rider.id)&&o.activeTerrain!=="Finish"),i={};let l=-1/0;for(const o of n){const m=o.activeTerrain;o.effectiveSkill>(i[m]??-1/0)&&(i[m]=o.effectiveSkill),o.effectiveSkill>l&&(l=o.effectiveSkill)}const c=this.updateBreakawayGapPenaltyFromCheckpoints(s,n);for(const o of s)o.breakawayGapPenalty=c;for(const o of s){const m=o.currentSegmentCached;if(!m)continue;const u=this.resolveBreakawayReferenceSkillCached(o,i,l)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=u,o.tempSpeedMps=this.resolveRoadStageSpeedMps(u,o.distanceCoveredMeters,m,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(m.terrain));const f=this.resolveMaxBreakawayDraftModifier(o,m,s.length);o.draftModifier=f.draftModifier,o.draftNearbyRiderCount=Math.max(0,s.length-1),o.draftPackFactor=f.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*f.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,r,s,n){return this.resolveRoadStageSpeedMps(t,a,r,s,n,.5)}syncRiderTelemetry(t,a=null){var i;const r=t.currentSegmentCached!==void 0?t.currentSegmentCached:t.currentSegmentCached=this.currentSegment(t),s=t.currentWindZoneCached!==void 0?t.currentWindZoneCached:t.currentWindZoneCached=this.currentWindZone(t);if(ie(t)||!r||!s){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a),this.calculateBasePhysics(t,r,s),t.segmentStartKm=r.start_km,t.segmentEndKm=r.end_km,t.segmentStartElevation=r.start_elevation,t.segmentEndElevation=r.end_elevation,t.activeTerrain=r.terrain;const n=this.resolveAttackSkillBonus(t);n>0&&(t.skillBreakdown=`${t.skillBreakdown} · Attack +${n}`),t.currentSpeedMps=t.tempSpeedMps*t.draftModifier,t.photoFinishScore===0&&(t.photoFinishScore=this.calculatePhotoFinishScore(t)),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),r=this.riders.reduce((n,i)=>ie(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(r<=t.phaseEndDistanceMeters)return!1;let s=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(r<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<cu){n.breakawayMalus=0,s=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const l=Math.max(0,n.distanceCoveredMeters-i),c=Math.floor(l/ou),o=Math.min(du,n.breakawayInitialMalus),m=Math.max(o,n.breakawayInitialMalus-c*lu),p=ca(m);p!==n.breakawayMalus&&(n.breakawayMalus=p,s=!0)}return s}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const r=new Set(a.riderIds);for(const s of this.riders)ie(s)||!r.has(s.rider.id)||this.syncRiderTelemetry(s,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(s=>t.riderIds.includes(s.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const s of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:s.rider.id,riderName:s.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(s.rider.id,s.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let r=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),r=!0}if(this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayMalus=t.malusValue,s.breakawayInitialMalus=t.malusValue,s.breakawayRecoveryStartDistanceMeters=null,s.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return r}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=this.riders.filter(l=>!ie(l)&&a.riderIds.includes(l.rider.id));if(r.length===0)return;const s=[...r].sort((l,c)=>c.distanceCoveredMeters-l.distanceCoveredMeters||c.currentSpeedMps-l.currentSpeedMps||l.rider.id-c.rider.id)[0];if(!s)return;const n=Math.max(.1,s.currentSpeedMps),i=s.distanceCoveredMeters+n*t;for(const l of r){if(Math.max(0,s.distanceCoveredMeters-l.distanceCoveredMeters)>0){const o=n+.1;l.currentSpeedMps=o,l.nextDistanceCoveredMeters=Math.min(i,l.distanceCoveredMeters+o*t);continue}l.currentSpeedMps=n,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return t.isAttacking?Tc:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const r=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(r==null||r.isCounterAttack)return!0;const s=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(s==null?void 0:s.isCounterAttack)===!0&&s.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(r=>r.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const r=this.resolvePreStageGcRank(t);return r!=null?`${a} (${r}.)`:a}triggerStageAttacksForRider(t,a,r,s){if(ie(t)||t.isAttacking)return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||r<i.triggerDistanceMeters)return;const l=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(l<=0||l>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${l}, aktuelle km ${(r/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const c=Math.max(.1,t.currentSpeedMps),o=Math.max(0,(i.triggerDistanceMeters-a)/c),m=s+o;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:m,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const p=new Set(this.activeStageAttacksByRiderId.keys()),u=this.stageFavorites.slice(0,20).filter(h=>{if(h.kind!=="rider"||h.riderId==null)return!1;const b=this.riders.find(k=>k.rider.id===h.riderId);if(!b||ie(b))return!1;const y=t.distanceCoveredMeters-b.distanceCoveredMeters;return y>=0&&y<=150}),f=Ec(u,t.rider.id,p),g=[];for(const h of f){const b=this.riders.find(y=>y.rider.id===h);!b||ie(b)||b.isAttacking||(this.activeStageAttacksByRiderId.set(h,{riderId:h,remainingSeconds:li,startedAtElapsedSeconds:m,triggerDistanceMeters:b.distanceCoveredMeters,durationSeconds:li,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),b.isAttacking=!0,g.push({riderId:h,riderName:this.formatRiderWithPreStageGc(h,b.riderName),riderTeamId:b.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:m,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const h of g)this.pushMessage({elapsedSeconds:m,riderId:h.riderId,riderName:h.riderName,type:"counter_attack",tone:"warning",title:`${h.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const r of t){if(r.finishStatus==="dnf")continue;const s=a[a.length-1];if(!s||Math.abs(s.distanceMeter-r.distanceCoveredMeters)>=or){a.push({riderIds:[r.rider.id],riderCount:1,distanceMeter:r.distanceCoveredMeters,distanceSum:r.distanceCoveredMeters});continue}s.riderIds.push(r.rider.id),s.riderCount+=1,s.distanceSum+=r.distanceCoveredMeters,s.distanceMeter=s.distanceSum/s.riderCount}return a.map(({distanceSum:r,...s})=>s)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!ie(i)&&i.rider.activeTeamId!=null).sort((i,l)=>i.distanceCoveredMeters-l.distanceCoveredMeters||i.rider.id-l.rider.id),r=new Map;let s=0,n=0;for(let i=0;i<a.length;i+=1){const l=a[i],c=l.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-c<or;){const p=a[n].rider.activeTeamId;p!=null&&r.set(p,(r.get(p)??0)+1),n+=1}for(;s<a.length&&c-a[s].distanceCoveredMeters>=or;){const p=a[s].rider.activeTeamId;if(p!=null){const u=(r.get(p)??0)-1;u<=0?r.delete(p):r.set(p,u)}s+=1}const o=l.rider.activeTeamId,m=o==null?0:Math.max(0,(r.get(o)??0)-1);t.set(l.rider.id,m===0?0:ca(m*.3*this.resolveTeamBonusRoleMultiplier(l)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t,a,r,s,n,i){const l=t.incidentRecoverySecondsRemaining>0?Yc:0,c=this.resolveBreakawaySkillBonus(t),o=a+(t.conditionFormBonus??0)+t.dailyForm+t.incidentRecoveryFormBonus+l+t.microForm+c+s-t.breakawayMalus,m=Math.max(0,o),p=n===t.distanceCoveredMeters?this.resolveRiderElevationPenalty(t,i):this.resolveElevationPenalty(t,n);return{effectiveSkill:Math.max(0,m-p),staminaPenalty:r,elevationPenalty:p}}precalculateStaminaEndPenalty(t){const a=xe(this.stageDistanceMeters/1e3,au,ru),r=this.interpolateStaminaDistanceValue(a),s=xe(t,ui,ks),n=(ks-s)/(ks-ui);return r/3+n*r}resolveStaminaPenalty(t,a){const r=this.stageDistanceMeters<=0?0:xe(a/this.stageDistanceMeters,0,1);return(t.staminaEndPenaltyCached??0)*(r*r)}resolveRiderStaminaPenalty(t){if(t.staminaCalculatedThisTick)return t.staminaSkillPenalty;if(t.distanceCoveredMeters<(t.nextStaminaUpdateMeter??0))return t.staminaCalculatedThisTick=!0,t.staminaSkillPenalty;const a=Math.max(0,Math.floor(t.distanceCoveredMeters/3e3));return t.nextStaminaUpdateMeter=(a+1)*3e3,t.staminaSkillPenalty=this.resolveStaminaPenalty(t,t.distanceCoveredMeters),t.staminaCalculatedThisTick=!0,t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=Wt[0].kmMark)return Wt[0].value;for(let a=0;a<Wt.length-1;a+=1){const r=Wt[a],s=Wt[a+1];if(t<=s.kmMark){const n=Math.max(1e-4,s.kmMark-r.kmMark),i=(t-r.kmMark)/n;return r.value+(s.value-r.value)*i}}return Wt[Wt.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/Ss),r=Math.max(1,Math.ceil(t/Ss)),s=pe(Gc,Kc),n=Array.from({length:r},()=>pe(.2,1.2)),i=n.reduce((o,m)=>o+m,0),l=Array.from({length:a+1},()=>1);l[0]=s;let c=0;for(let o=1;o<=r;o+=1)c+=n[o-1]??0,l[o]=s+(1-s)*(c/i);return l}resolveSkillSpreadFactor(t,a){const r=this.stageDistanceMeters<=0?1:xe(t/this.stageDistanceMeters,0,1),s=Math.min(this.spreadCurve.length-1,Math.floor(r/Ss)),n=this.spreadCurve[s]??1;if(r<=this.lateStageStartRatio)return n;const i=this.finalSpreadConfigMap.get(a.terrain),l=this.scaleFinalSpreadMultiplier(i.lateMultiplier),c=Math.max(l,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),o=xe((r-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),m=this.interpolateFinalSpread(l,o);if(l<=1&&c<=1)return n;if(r<this.finalPushStartRatio||c<=l)return Math.max(n,m);const p=xe((r-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),u=l+(c-l)*p;return Math.max(n,u)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const r=_o(this.simulationMode,t,this.skillWeightRuleMap).map(s=>({key:s.key,weight:s.weight}));return this.weightedSkillComponentsByTerrain.set(t,r),r}resolveWeightedSkillExact(t,a){var l,c,o,m;const r=this.resolveWeightedSkillComponents(a);if(r.length===1){const p=r[0];let u=t.skills[p.key];if((((l=t.role)==null?void 0:l.name)==="Kapitaen"||((c=t.role)==null?void 0:c.name)==="Co-Kapitaen")&&t.mentorBoosts){const g=t.mentorBoosts[p.key];typeof g=="number"&&(u+=g)}return u}let s=0,n=0;const i=((o=t.role)==null?void 0:o.name)==="Kapitaen"||((m=t.role)==null?void 0:m.name)==="Co-Kapitaen";for(const p of r){s+=p.weight;let u=t.skills[p.key];if(i&&t.mentorBoosts){const f=t.mentorBoosts[p.key];typeof f=="number"&&(u+=f)}n+=u*p.weight}return s>0?n/s:ti(t.skills,this.simulationMode,a,this.skillWeightRuleMap)}resolveWeightedSkill(t,a,r=0){var o,m;const s=this.resolveWeightedSkillComponents(a);let n=0,i=0;const l=((o=t.role)==null?void 0:o.name)==="Kapitaen"||((m=t.role)==null?void 0:m.name)==="Co-Kapitaen";for(const p of s){n+=p.weight;let u=t.skills[p.key];if(p.key==="stamina"&&r>0&&(u=Math.max(0,u-r)),l&&t.mentorBoosts){const f=t.mentorBoosts[p.key];typeof f=="number"&&(u+=f)}i+=u*p.weight}let c=0;if(n>0)c=i/n;else{const p=r>0||l&&t.mentorBoosts?{...t.skills}:t.skills;if(r>0&&(p.stamina=Math.max(0,p.stamina-r)),l&&t.mentorBoosts)for(const[u,f]of Object.entries(t.mentorBoosts))typeof f=="number"&&(p[u]+=f);c=ti(p,this.simulationMode,a,this.skillWeightRuleMap)}return{value:c,breakdown:this.isInstantSimulation?"":this.resolveSkillBreakdown(t,a,s)}}resolveSkillBreakdown(t,a,r){const s=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(s);if(n!==void 0)return n;const i=hu(t,r);return this.skillBreakdownCache.set(s,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const r=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,s=Math.max(0,100-r)/1e3,n=this.resolveElevationBucket(a);return s*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const r=a??this.interpolateElevation(t.distanceCoveredMeters),s=this.resolveElevationBucket(r);return s===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=s,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,r)),t.elevationPenalty}resolveSegmentElevationExact(t,a){const r=t.start_km*1e3,s=t.end_km*1e3,n=Math.max(1e-4,s-r),i=xe((a-r)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveSegmentElevation(t,a){const r=Math.min(this.elevationGrid.length-1,Math.max(0,Math.round(a/5)));return this.elevationGrid[r]}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const s=xe(t,0,this.stageDistanceMeters)/1e3;if(s<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],l=a[n+1];if(s<=l.kmMark){const c=Math.max(1e-4,l.kmMark-i.kmMark),o=(s-i.kmMark)/c;return i.elevation+(l.elevation-i.elevation)*o}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),$s(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var p;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(et).sort((u,f)=>(u.finishTimeSeconds??0)-(f.finishTimeSeconds??0)||f.photoFinishScore-u.photoFinishScore||u.rider.id-f.rider.id);if(t.length===0)return;const a=[];let r=null;for(const u of t){const f=u.finishTimeSeconds??0;if(a.length===0){a.push(u),r=f;continue}if(r!=null&&f-r<=_a){a.push(u),r=f;continue}break}const s=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=u=>u.photoFinishScore,l=[...a].sort((u,f)=>i(f)-i(u)||u.rider.id-f.rider.id),c=((p=l[0])==null?void 0:p.finishTimeSeconds)??0,o=this.finishWeightProfile,m=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${m} | erste Zielgruppe (${l.length} Fahrer) | Zeitfenster <= ${_a.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${s}${n?" | Bergfahrer-Malus aktiv":""}`),l.forEach((u,f)=>{const g=xu(u,o).map($=>`${Uo[$.skillKey]} ${$.contribution.toFixed(2)} = ${$.effectiveSkill.toFixed(2)} x ${($.weight*100).toFixed(0)}%`).join(" | "),h=u.finishTimeSeconds??0,b=h-c,y=b<=1e-4?`${h.toFixed(2)} s`:`${h.toFixed(2)} s (+${b.toFixed(2)} s)`,k=this.calculatePhotoFinishScore(u),T=u.leadoutBonus??0,x=Ca(u,s,n);console.log(`#${f+1} Zielsprint | ${u.riderName} | Zeit ${y} | Score (ohne Boni): ${k.toFixed(2)} -> Score (mit Boni): ${u.photoFinishScore.toFixed(2)} [SpecAdj: ${x>0?"+":""}${x.toFixed(2)}, Leadout: +${T.toFixed(2)}] | ID-Tiebreak ${u.rider.id} | (${g})`)}),console.groupEnd()}recordIntermediateSplits(t,a,r,s,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>r)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const l=(i.distanceMeters-a)/n,c=Math.max(0,this.isTimeTrialMode?s+l-t.startOffsetSeconds:s+l);let o=this.resolveMarkerCrossingScore(t,i);const m=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;m&&(o+=Ca(t,m,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=c,t.splitTimes[i.key]=c,t.splitTimes[i.label]=c,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:c,photoFinishScore:o},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return $s(t,this.resolveSprintWeightProfile());const r=$s(t,this.resolveClimbWeightProfile(a.markerCategory)),s=mu(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return r+s}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??Nc}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??Ac[a]}calculatePreLeadoutFinishScore(t){const r=this.resolveStaminaPenalty(t,this.stageDistanceMeters)+t.incidentStaminaPenalty,s=t.conditionFormBonus??0,n=Object.entries(this.finishWeightProfile).reduce((l,[c,o])=>{if(!o)return l;const m=c==="stamina"?r:0,p=Math.max(0,t.rider.skills[c]+s+t.dailyForm+t.microForm+t.teamGroupBonus-m);return l+p*o},0),i=Ca(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}applySprintLeadoutBonuses(){const t=this.resolveFinishMarkerType();if(t!=="finish_flat"&&t!=="finish_hill"||this.isTimeTrialMode)return;const a=this.riders.filter(et).sort((l,c)=>(l.finishTimeSeconds??0)-(c.finishTimeSeconds??0));if(a.length===0)return;const r=[];let s=null;for(const l of a){const c=l.finishTimeSeconds??0;if(r.length===0){r.push(l),s=c;continue}if(s!=null&&c-s<=_a){r.push(l),s=c;continue}break}const n=new Set(r.map(l=>l.rider.id)),i=new Map;for(const l of this.riders)if(l.finishStatus!=="dnf"&&l.finishStatus!=="otl"&&l.finishStatus!=="dns"&&l.finishTimeSeconds!=null&&l.rider.skills.sprint>=73&&l.rider.activeTeamId!=null&&n.has(l.rider.id)){const c=l.rider.activeTeamId,o=i.get(c)??[];o.push(l),i.set(c,o)}for(const[l,c]of i.entries()){if(c.length===0)continue;let o=null,m=Number.NEGATIVE_INFINITY;for(const p of c){const u=this.calculatePreLeadoutFinishScore(p);u>m?(m=u,o=p):u===m&&o!==null&&(p.rider.skills.sprint>o.rider.skills.sprint||p.rider.skills.sprint===o.rider.skills.sprint&&p.rider.id<o.rider.id)&&(o=p)}if(o){const p=this.calculateSprintLeadoutBonusForRider(o);p>0&&(o.leadoutBonus=p,o.photoFinishScore+=p)}}}calculateSprintLeadoutBonusForRider(t){const a=t.rider.activeTeamId;if(a==null)return 0;const r=this.riders.filter(m=>m.rider.activeTeamId===a);if(r.length===0)return 0;let s=this.teamSprintRandomValues.get(a);s===void 0&&(s=pe(.25,.6),this.teamSprintRandomValues.set(a,s));let n=this.teamSprintSpecialRandomValues.get(a);n===void 0&&(n=pe(.1,.3),this.teamSprintSpecialRandomValues.set(a,n)),t.leadoutRiderId=null;let i=0,l=0,c=null;const o=[];for(const m of r){if(m.rider.id===t.rider.id||m.finishStatus==="dnf"||m.finishStatus==="otl"||m.finishStatus==="dns")continue;let p=0;const u=m.rider.skills.sprint>=72,f=m.rider.skills.flat>=78,g=m.rider.skills.timeTrial>=76,h=m.rider.skills.acceleration>=80;if(u&&p++,f&&p++,g&&p++,h&&p++,p>0){const b=u?s:n;let y=1;p===2?y=1.25:p===3?y=1.5:p===4&&(y=2);const k=b*y*1.5;if(i+=b*y,o.push({riderId:m.rider.id,name:m.riderName,contribution:Number(k.toFixed(2))}),b*y>l)l=b*y,c=m.rider.id;else if(b*y===l&&c!==null){const T=this.riders.find(x=>x.rider.id===c);T&&m.rider.skills.sprint>T.rider.skills.sprint&&(c=m.rider.id)}}}return i>0&&(t.leadoutRiderId=c,t.leadoutContributions=o),i*1.5}resolveFinishMarkerType(){const t=vt(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const r=t[a].marker.type;if(r==="finish_flat"||r==="finish_hill"||r==="finish_mountain")return r}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return Lc;case"finish_mountain":return _c;default:return Dc}}resolveRiderClockSeconds(t){if(et(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,r,s=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const l=this.riders.find(c=>c.rider.id===i);l&&(l.waitingForCaptainId=t.rider.id,l.waitForCaptainRecovery=!0,l.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){s=!0;const i=[];for(const l of a.massCrashPotentialRiderIds){const c=this.riders.find(m=>m.rider.id===l);if(!c||ie(c))continue;if(Math.abs(c.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(l);const m=rc(c.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(c,m,r,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:s?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",l="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",l="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",l="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${l} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:s?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:r,supportRiderIds:a.supportRiderIds}),ur(t)}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(r=>r.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+or){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const Mu=300;async function Ru(e,t){const a=new Zo(e,{maxSubstepSeconds:5,isInstantSimulation:!0});let r=!1;for(;!r;){const s=a.step(Mu);if(r=s.isFinished,t){const n=s.stageDistanceMeters>0?s.leaderDistanceMeters/s.stageDistanceMeters:0,i=e.riders.length>0?s.finishedRiders/e.riders.length:0,l=Math.min(1,Math.max(0,Math.max(n,i)));t(l)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const Iu=[1,2,5,10,25,50,100,250,500],Si=new WeakMap;function Cu(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function ki(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Fu(e){const t=Si.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${Iu.map(r=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return Si.set(e,a),a}function $i(e,t){const a=Fu(e);a.timeField&&(a.timeField.textContent=Cu(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${ki(t.snapshot.leaderDistanceMeters)} / ${ki(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(r=>{const s=Number(r.dataset.raceSimSpeed);r.classList.toggle("active",s===t.timeMultiplier)})}const Eu=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function Pu(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),r=t%60;return`${a}:${String(r).padStart(2,"0")}`}function Sa(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Nu(e){return`/jersey/Jer_${e}.png`}function Jo(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${Sa(Nu(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Du(e){return e.riderId==null||e.riderTeamId==null?"":Jo(e.riderTeamId)}function Lu(e){const t=Sa(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function _u(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${Sa(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${Sa(e)}</button>`}function Au(e,t){if(t==="all")return!0;const a=qo(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function Bu(e){const t=e.detail?Sa(e.detail):"",a=(e.secondaryRiders??[]).map(s=>`${s.riderTeamId!=null?Jo(s.riderTeamId,"race-sim-message-inline-jersey"):""}${_u(s.riderName,s.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const r=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${r}</span>`}function qo(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function xi(e,t,a="all"){const r=t.filter(n=>Au(n,a)),s=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${Eu.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${r.length===0?`<div class="race-sim-message-empty">${s}</div>`:r.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${Sa(qo(n))}">
          <span class="race-sim-message-time">t=${Pu(n.elapsedSeconds)}</span>
          ${Du(n)}
          <span class="race-sim-message-text">
            ${Lu(n)}
            ${Bu(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const Hu=1,zu={Flat:14,Rolling:15,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:25,High_Mountain:27,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function Gu(e){return Math.max(0,Math.round(e))}function Xo(e){return e==="ITT"||e==="TTT"}function Ku(e){return zu[e]??20}function Ou(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+Ku(e)/100))}function ju(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function Ti(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function ws(e,t){if(Xo(t))return[...e].sort(ju);const a=[...e].sort((l,c)=>l.stageTimeSeconds-c.stageTimeSeconds||Ti(l,c)),r=[];let s=[],n=null;const i=()=>{r.push(...s.sort(Ti))};for(const l of a){if(s.length===0){s=[l],n=l.stageTimeSeconds;continue}if(n!=null&&l.stageTimeSeconds-n<=Hu){s.push(l),n=l.stageTimeSeconds;continue}i(),s=[l],n=l.stageTimeSeconds}return s.length>0&&i(),r}function ne(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Wu(e){return`/jersey/Jer_${e}.png`}function qa(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${ne(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${ne(Wu(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Xa(e,t,a){return e==null?`<span class="${a}" title="${ne(t)}">${ne(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${ne(t)}">${ne(t)}</button>`}function Vu(e){return e.toFixed(1).replace(".",",")}function Wr(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Uu(e){return`${e??0} Pkt.`}function Yu(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function Zu(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function Qo(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Ju(e){if(e==null||e<=0)return Qo(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Lt(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function gr(e){return`${e.toFixed(1).replace(".",",")} km`}function wi(e){return`${e.toFixed(1).replace(".",",")}%`}function fr(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function Mi(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function qu(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function Xu(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function Qu(e,t,a){return Array.from({length:t},(r,s)=>e.slice(s*a,(s+1)*a))}function em(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const r=Qu(e,4,5),s=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${r.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const l=Xu(i,a);return l?` is-${l}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${qa(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${Xa(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${ne(i.roleLabel)}">${ne(i.roleLabel)}</span>
            ${(()=>{const l=i.riderId!=null?s.get(i.riderId)??null:null;return l?`<span class="race-sim-favorite-gc">GC ${l.rank} · ${ne(Wr(l.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${Vu(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function Ka(e,t){const a=e.riders.find(r=>r.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function ls(e,t){const a=e.riders.find(n=>n.id===t),r=(a==null?void 0:a.activeTeamId)??null,s=r!=null?e.teams.find(n=>n.id===r)??null:null;return{teamId:r,teamName:(s==null?void 0:s.name)??null}}function tm(e,t,a,r={}){const s=(t??[]).slice(0,r.limit??8);return s.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${s.map(n=>{var p;const i=n.riderId??0,l=ls(e,i),c=Ka(e,i),o=((p=r.distanceGapsByRiderId)==null?void 0:p.get(i))??null,m=[r.distanceGapClassName??"",Zu(o)].filter(u=>u.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${qa(l.teamId,l.teamName)}
        <span class="race-sim-classification-main">
          ${Xa(n.riderId,c,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${r.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${m}">${ne(Yu(o))}</span>`:""}
      </article>`}).join("")}</div>`}function hr(e,t,a,r,s,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${ne(e)}</h4>
      ${tm(a,r,s,n)}
    </section>`}function Qt(e,t,a,r,s=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${r}" ${s?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${r}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${ne(e)}</span>
      </summary>
      ${t}
    </details>`}function Vr(e,t,a,r){const s=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var c;const i=s.get(n.id)??null,l=((c=a.get(n.id))==null?void 0:c[r])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+l,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:l}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||Ka(e,n.riderId).localeCompare(Ka(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function Ri(e){const t=am(e)?e.stagePoints:0;return`${ne(Uu("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${ne(t)}</span></span>`:""}`}function am(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function Ii(e,t){if(t==null)return new Map;const a=e.riders.find(r=>r.riderId===t)??null;return a?new Map(e.riders.map(r=>[r.riderId,a.distanceCoveredMeters-r.distanceCoveredMeters])):new Map}function rm(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function Fr(e,t){var r;const a=(r=e.race.category)==null?void 0:r.bonusSystem;return!a||t==null||t==="Sprint"?[]:Lt(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function gn(e){var r;const t=(r=e.race.category)==null?void 0:r.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return Lt(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return Lt(a?t.pointsMountainStage:t.pointsSprintFinish)}function el(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:Lt((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function sm(e,t,a){let r=null;for(const s of e.stageSummary.segments){const n=Math.max(t,s.start_km),i=Math.min(a,s.end_km),l=Math.max(0,i-n);if(l<=0)continue;const c={lengthKm:l,gradient:s.gradient_percent};(r==null||c.gradient>r.gradient||c.gradient===r.gradient&&c.lengthKm>r.lengthKm)&&(r=c)}return r}function Ms(e,t,a,r=null){return e.entries.filter(s=>r==null||r.has(s.riderId)).map((s,n)=>({riderId:s.riderId,rank:s.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:s.crossingTimeSeconds,gapSeconds:s.gapSeconds})).filter(s=>s.points>0)}function fn(e){const t=new Map;for(const a of e)for(const r of a.entries){const s=t.get(r.riderId)??{points:0,mountain:0};r.pointsKind==="mountain"?s.mountain+=r.points:s.points+=r.points,t.set(r.riderId,s)}return t}function nm(e){return vt(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function Ur(e,t){const a=Xo(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?Gu(a):null}function ds(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=Ur(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const r=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(r)||r<=0)return ws(a,e.stage.profile).map(n=>n.rider);const s=Ou(e.stage.profile,a.map(n=>n.stageTimeSeconds));return s==null?ws(a,e.stage.profile).map(n=>n.rider):ws(a.filter(n=>n.stageTimeSeconds<=s),e.stage.profile).map(n=>n.rider)}function im(e,t){const a=gn(e);return a.length===0?[]:ds(e,t).map((r,s)=>({riderId:r.riderId,rank:s+1,points:a[s]??0,pointsKind:"points",crossingTimeSeconds:Ur(e,r),gapSeconds:null})).filter(r=>r.points>0)}function om(e,t){const a=ds(e,t).slice(0,20),r=a[0]!=null?Ur(e,a[0])??0:0;return a.map((s,n)=>{const i=Ur(e,s)??0;return{riderId:s.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-r),photoFinishScore:s.photoFinishScore}})}function lm(e,t){var a;return((a=ds(e,t)[0])==null?void 0:a.riderId)??null}function hn(e,t,a){var T,x;const r=vt(e.stageSummary),s=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(ds(e,a).map($=>$.riderId)):null,i=r.filter(({marker:$})=>$.type==="climb_start"),l=r.filter(({marker:$})=>Kt($)).sort(($,N)=>$.kmMark-N.kmMark).map(($,N)=>{var M,z;const E=[...i].reverse().find(V=>V.kmMark<=$.kmMark)??null,R=rm(e,$.kmMark),I=(E==null?void 0:E.kmMark)??(R==null?void 0:R.start_km)??$.kmMark,_=(E==null?void 0:E.elevation)??(R==null?void 0:R.start_elevation)??$.elevation,P=Math.max(0,$.kmMark-I),D=P>0?($.elevation-_)/(P*1e3)*100:(R==null?void 0:R.gradient_percent)??0,G=sm(e,I,$.kmMark),B=t.find(V=>V.markerKey===$.key)??null,q=Fr(e,(B==null?void 0:B.markerCategory)??$.marker.cat??null),te=B?Ms(B,q,"mountain",n):[],ae=(B==null?void 0:B.markerCategory)??$.marker.cat??null;return{key:$.key,title:`${N+1}. Bergwertung`,label:$.label,categoryLabel:ae?`Kat. ${ae}`:null,categoryClassName:Mi(ae),kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:P,averageGradient:D,steepestSegmentLengthKm:(G==null?void 0:G.lengthKm)??null,steepestSegmentGradient:(G==null?void 0:G.gradient)??null,highlightMeta:$.kmMark>=s,leaderRiderId:((M=te[0])==null?void 0:M.riderId)??((z=B==null?void 0:B.entries[0])==null?void 0:z.riderId)??null,displayBadges:fr(q,"mountain"),entries:te,timingEntries:(B==null?void 0:B.entries)??[],accent:"mountain"}}),c=r.filter(({marker:$})=>$.type==="sprint_intermediate").sort(($,N)=>$.kmMark-N.kmMark).map(($,N)=>{var _,P;const E=t.find(D=>D.markerKey===$.key)??null,R=el(e),I=E?Ms(E,R,"points",n):[];return{key:$.key,title:`${N+1}. Zwischensprint`,label:$.label,categoryLabel:null,categoryClassName:null,kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((_=I[0])==null?void 0:_.riderId)??((P=E==null?void 0:E.entries[0])==null?void 0:P.riderId)??null,displayBadges:fr(R,"points"),entries:I,timingEntries:(E==null?void 0:E.entries)??[],accent:"sprint"}}),o=nm(e),m=im(e,a),p=o?t.find($=>$.markerKey===o.key)??null:null,u=p?Ms(p,Fr(e,p.markerCategory),"mountain",n):[],f=gn(e),g=p?Fr(e,p.markerCategory):[],h=e.stage.profile==="ITT"||e.stage.profile==="TTT"?om(e,a):(p==null?void 0:p.entries)??[],b=((T=m[0])==null?void 0:T.riderId)??((x=u[0])==null?void 0:x.riderId)??lm(e,a),y={key:"finish",title:"Zielsprint",label:(o==null?void 0:o.label)??"Ziel",categoryLabel:p!=null&&p.markerCategory?`Kat. ${p.markerCategory}`:null,categoryClassName:Mi((p==null?void 0:p.markerCategory)??null),kmMark:(o==null?void 0:o.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(p!=null&&p.markerCategory),leaderRiderId:b,displayBadges:[...fr(f,"points"),...fr(g,"mountain")],entries:[...m,...u],timingEntries:h,accent:"finish"};return[...[...c,...l].sort(($,N)=>$.kmMark-N.kmMark||$.title.localeCompare(N.title,"de")),y].filter($=>$.entries.length>0||$.timingEntries.length>0||$.accent!=="finish"||o!=null||a.isFinished)}function dm(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),r=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,s=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,r):t.entries.slice(0,r).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return s.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${s.map(n=>{const i=ls(e,n.riderId),l=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${qa(i.teamId,i.teamName)}
            ${Xa(n.riderId,Ka(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?ne(Qo(n.crossingTimeSeconds)):ne(Ju(n.gapSeconds))}</strong>
            ${l?`<strong class="race-sim-stage-points-value-${l.pointsKind}">${l.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function Ci(e,t){var a;return((a=e==null?void 0:e.find(r=>r.riderId===t))==null?void 0:a.points)??0}function Fi(e,t){var a;return((a=e.filter(r=>r.riderId!=null&&t.has(r.riderId)).sort((r,s)=>r.rank-s.rank||r.riderId-s.riderId)[0])==null?void 0:a.riderId)??null}function br(e,t,a){if(!(!t||e.some(r=>r.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function cm(e,t,a,r,s){const n=new Set(e.riderIds),i=new Map(t.riders.map(f=>[f.riderId,f])),c=e.riderIds.map(f=>i.get(f)??null).filter(f=>f!=null).sort((f,g)=>{var h,b;return(((h=a.get(f.riderId))==null?void 0:h.rank)??Number.MAX_SAFE_INTEGER)-(((b=a.get(g.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)||f.riderName.localeCompare(g.riderName,"de")||f.riderId-g.riderId}).slice(0,25),o=i.get(Fi(r,n)??-1)??null,m=i.get(Fi(s,n)??-1)??null,p=o!=null&&!c.some(f=>f.riderId===o.riderId),u=m!=null&&!c.some(f=>f.riderId===m.riderId);return c.length>=25&&p&&u&&o.riderId!==m.riderId?(br(c,o,23),br(c,m,24),c):(br(c,o,24),br(c,m,24),c)}function um(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function mm(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function Ei(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function pm(e,t){const a=t.riders.filter(s=>e.riderIds.includes(s.riderId)).reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0),r=Math.max(0,t.leaderDistanceMeters-a);return r>0?`-${Math.round(r)} m`:"—"}function gm(e,t,a,r,s,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const l=Ld(a,r),c=a.find(u=>u.label===l)??a[0],o=new Map(e.gcStandings.map(u=>[u.riderId,u])),m=fn(i),p=cm(c,t,o,s,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${ne(c.label)} <span class="race-sim-group-count">(${c.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${ne(Ei(c.previousGapMeters,"-"))}</span>
        <span>Leader ${ne(pm(c,t))}</span>
        <span>Hinten ${ne(Ei(c.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${p.map((u,f)=>{const g=o.get(u.riderId)??null,h=ls(e,u.riderId),b=m.get(u.riderId)??{points:0,mountain:0},y=Ci(s,u.riderId),k=Ci(n,u.riderId),T=um(u.riderId,e.classificationLeaders),x=T.length>0?T.map($=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[$]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${mm(T)}" title="${ne(x)}">${f+1}.</strong>
              ${qa(h.teamId,h.teamName)}
              <span class="race-sim-classification-main">
                ${Xa(u.riderId,u.riderName,`race-sim-group-rider-name${u.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${g?g.rank:"—"} · ${ne(g?Wr(g.gapSeconds):"—")} · ${ne(u.gapToLeaderMeters>0?`+${Math.round(u.gapToLeaderMeters)} m`:"—")}</strong>
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
    </section>`}function fm(e,t,a,r){const s=hn(t,a.markerClassifications,a),n=fn(s),i=Vr(t,t.pointsStandings,n,"points"),l=Vr(t,t.mountainStandings,n,"mountain"),c=pn(mn(a.clusters));e.innerHTML=gm(t,a,c,r,i,l,s)}function hm(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function bm(e){const t=vt(e.stageSummary),a=el(e)[0]??0,r=gn(e)[0]??0,s=t.filter(({marker:n})=>Kt(n)).reduce((n,{marker:i})=>n+(Fr(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+r,mountain:s}}function Pi(e){const t=bm(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function ym(e){const t=qu(e),a=[`<span class="race-sim-stage-points-meta-pill">${ne(gr(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${ne(`${gr(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${ne(`Länge ${gr(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${ne(`Ø ${wi(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${ne(`Steilstes ${gr(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${ne(wi(e.steepestSegmentGradient))}</span>`:""].filter(r=>r.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${ne(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${ne(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${ne(e.label)}">${ne(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((r,s)=>`${s>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${r}`).join("")}
    </span>`}function vm(e,t,a,r=null){const s=r??hn(e,t,a);return s.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${Pi(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${Pi(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${s.map(n=>{const i=n.leaderRiderId!=null?ls(e,n.leaderRiderId):{teamId:null,teamName:null},l=n.leaderRiderId!=null?Ka(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${ym(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${hm(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${qa(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?Xa(n.leaderRiderId,l,"race-sim-stage-scoring-leader-name"):`<strong>${ne(l)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${dm(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function Sm(e,t,a,r,s,n=new Set){var f,g;const i=hn(a,r,s),l=fn(i),c=Vr(a,a.pointsStandings,l,"points"),o=Vr(a,a.mountainStandings,l,"mountain"),m=Ii(s,((f=a.gcStandings[0])==null?void 0:f.riderId)??null),p=Ii(s,((g=a.youthStandings[0])==null?void 0:g.riderId)??null),u=h=>!n.has(h);e.innerHTML=`
    ${Qt("Stage Favorites",em(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",u("favorites"))}
    <section class="race-sim-classifications-section">
      ${Qt("GC",hr("GC","gc",a,a.gcStandings,h=>ne(`GC ${h.rank} · ${Wr(h.gapSeconds)}`),{limit:20,distanceGapsByRiderId:m}),"race-sim-overview-classification race-sim-overview-gc","gc",u("gc"))}
      ${Qt("Punktewertung",hr("Punktewertung","points",a,c,Ri),"race-sim-overview-classification race-sim-overview-points","points",u("points"))}
      ${Qt("Bergwertung",hr("Bergwertung","mountain",a,o,Ri),"race-sim-overview-classification race-sim-overview-mountain","mountain",u("mountain"))}
      ${Qt("Nachwuchsfahrerwertung",hr("Nachwuchsfahrerwertung","youth",a,a.youthStandings,h=>ne(`${h.rank}. · ${Wr(h.gapSeconds)}`),{distanceGapsByRiderId:p,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",u("youth"))}
    </section>
    ${Qt("Etappenwertungen",vm(a,r,s,i),"race-sim-overview-stage-scoring","stageScoring",u("stageScoring"))}
  `}const Ni=new WeakMap,bt=new WeakMap,Di=new WeakMap,tl=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function se(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function al(e){return e<=0?"—":`+${Math.round(e)} m`}function Aa(e){const t=tl.format(e);return e>0?`+${t}`:t}function Rs(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function be(e){return tl.format(e)}function Zt(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function rl(e){return`+${Zt(e)}`}function sl(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function bn(e){return`${(e*3.6).toFixed(1)} km/h`}function km(e){return`${Aa(e)}%`}function Ks(e){return`${e.toFixed(1).replace(".",",")} km`}function nl(e){return`${Ks(e.segmentStartKm)} - ${Ks(e.segmentEndKm)}`}function $m(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function il(e){return e.replace(/_/g," ")}function ol(e){return il(e)}function xm(e){return il(e)}function ll(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function Tm(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function wm(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function dl(e){return vt(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||Kt(t)).map(({key:t,label:a})=>({key:t,label:a}))}function Mm(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function Rm(e,t,a,r){var s;return a!=="ITT"&&a!=="TTT"?((s=r.get(t))==null?void 0:s.get(e.riderId))??null:e.splitTimes[t]??null}function cl(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(s=>({label:s.key,displayLabel:s.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${s.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function Im(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function Cm(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function ul(e){const t=Ni.get(e);if(t)return t;const a=dl(e),r={splitMarkers:a,columns:cl(e,a,!1),riderById:new Map(e.riders.map(s=>[s.id,s])),teamById:new Map((e.teams??[]).map(s=>[s.id,s])),teamAbbreviationById:new Map((e.teams??[]).map(s=>[s.id,s.abbreviation])),teamNameById:new Map((e.teams??[]).map(s=>[s.id,s.name])),gcByRiderId:new Map((e.gcStandings??[]).map(s=>[s.riderId,s]))};return Ni.set(e,r),r}function ml(e,t){const a=e.parentElement,r=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!r)return"";const s=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const o=document.createElement("div");return o.className="race-sim-leaderboard-toolbar",r.insertAdjacentElement("beforebegin",o),o})(),n=yn(e),i=Im(t),l=Cm(i,n),c=bt.get(e);return(c==null?void 0:c.layoutKey)===l||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(o=>o.width).join(" ")),s.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,r.innerHTML=t.map(o=>Fm(o,n)).join(""),bt.set(e,{layoutKey:l,orderedRiderIds:(c==null?void 0:c.orderedRiderIds)??[],rowsByRiderId:(c==null?void 0:c.rowsByRiderId)??new Map,openDetailRiderId:(c==null?void 0:c.openDetailRiderId)??null,openTeamId:(c==null?void 0:c.openTeamId)??null})),l}function kt(e,t){e.textContent!==t&&(e.textContent=t)}function yr(e,t){e.title!==t&&(e.title=t)}function vr(e,t){e.className!==t&&(e.className=t)}function Sr(e,t,a){return e.lastValues[t]!==a}function kr(e,t,a){e.lastValues[t]=a}function yn(e){const t=Di.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return Di.set(e,a),a}function Fm(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${se(e.label)}">${se(a)}</span>`;const r=!t.autoSort&&t.manualSortKey===e.sortKey,s=r?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${r?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${se(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${se(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${se(a)}<span class="race-sim-leaderboard-sort-indicator">${se(s)}</span></button>`}function Em(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function Pm(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function Li(e,t,a,r,s,n,i){if(r.autoSort)return(c,o)=>e.stage.profile==="ITT"?pl(c,o,t):_m(c,o);if(!r.manualSortKey)return null;const l=r.manualSortDirection==="asc"?1:-1;return(c,o)=>{if(Ge(c)!==Ge(o))return Ge(c)?1:-1;const m=s.get(c.riderId)??null,p=s.get(o.riderId)??null,u=_i(c,m,r.manualSortKey??"",e,a,n,i),f=_i(o,p,r.manualSortKey??"",e,a,n,i);return Pm(u,f)*l||c.riderId-o.riderId}}function Nm(e,t,a){if(e.length!==t.size)return!1;let r=null;for(const s of e){const n=t.get(s);if(!n||r&&a(r,n)>0)return!1;r=n}return!0}function _i(e,t,a,r,s,n,i){const l=r.race.isStageRace&&r.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return r.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(l==null?void 0:l.rank)??null;case"gcGap":return(l==null?void 0:l.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?Rm(e,a.slice(6),r.stage.profile,s):null}}function Dm(e,t,a,r,s,n,i,l,c){if(!s.manualSortKey){if(s.autoSort){const u=Li(t,a,r,s,n,i,l);return u?[...e].sort(u):[...e]}const p=new Map(s.frozenOrder.map((u,f)=>[u,f]));return[...e].sort((u,f)=>(Ge(u)===Ge(f)?0:Ge(u)?1:-1)||(p.get(u.riderId)??Number.MAX_SAFE_INTEGER)-(p.get(f.riderId)??Number.MAX_SAFE_INTEGER)||u.riderId-f.riderId)}const o=Li(t,a,r,s,n,i,l);if(!o)return[...e];const m=new Map(e.map(p=>[p.riderId,p]));return Nm(c,m,o)?c.map(p=>m.get(p)).filter(p=>p!=null):[...e].sort(o)}function Lm(e,t){var o;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const m=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(m))return!1;const p=bt.get(e);return p?(p.openTeamId=p.openTeamId===m?null:m,p.openTeamId==null&&(p.openDetailRiderId=null),!0):!1}const r=t.closest("button[data-race-sim-rider-toggle]");if(r){const m=Number(r.dataset.raceSimRiderToggle);if(!Number.isFinite(m))return!1;const p=bt.get(e);return p?(p.openDetailRiderId=p.openDetailRiderId===m?null:m,!0):!1}const s=yn(e);if(t.closest("button[data-race-sim-splits-toggle]"))return s.showSplitColumns=!s.showSplitColumns,!s.showSplitColumns&&((o=s.manualSortKey)!=null&&o.startsWith("split:"))&&(s.manualSortKey=null,s.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return s.autoSort=!s.autoSort,s.autoSort?(s.manualSortKey=null,s.frozenOrder=[]):(s.manualSortKey=null,s.manualSortDirection="asc",s.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(m=>Number(m.dataset.raceSimRiderRow)).filter(m=>Number.isFinite(m))),!0;const l=t.closest("button[data-race-sim-sort-key]");if(!l||s.autoSort)return!1;const c=l.dataset.raceSimSortKey;return c?(s.manualSortKey===c?s.manualSortDirection=s.manualSortDirection==="asc"?"desc":"asc":(s.manualSortKey=c,s.manualSortDirection=Em(c)),s.frozenOrder=[],!0):!1}function Ai(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function Ge(e){return e.finishStatus==="dnf"}function pl(e,t,a){if(Ge(e)!==Ge(t))return Ge(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let l=a.length-1;l>=0;l-=1){const c=a[l];if(!c)continue;const o=e.splitTimes[c.key],m=t.splitTimes[c.key];if(o!=null&&m!=null&&o!==m)return o-m;if(o!=null&&m==null)return-1;if(o==null&&m!=null)return 1}const r=Ai(e,a),s=Ai(t,a);if(r!==s)return r?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function _m(e,t){return Ge(e)!==Ge(t)?Ge(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function gl(e,t){const a=(t==null?void 0:t.formBonus)??0,r=(t==null?void 0:t.raceFormBonus)??0,s=((t==null?void 0:t.fatigueMalus)??0)*.5,n=((t==null?void 0:t.longTermFatigueMalus)??0)*.5,i=((t==null?void 0:t.shortTermFatigueMalus)??0)*.5,l=e.teamGroupBonus,c=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),o=e.isAttacking?10:0,m=e.baseSkill+o+a+r+e.dailyForm+e.microForm+l-s-n-i,p=Math.max(0,m-e.staminaPenalty),u=m-p,f=p-e.effectiveSkill;return[`Basis ${be(e.baseSkill)}`,e.isAttacking?`+ Attacke ${be(o)}`:null,`+ S-Form ${be(a)}`,`+ R-Form ${be(r)}`,`+ T-Form ${be(e.dailyForm)}`,`+ Zufällige Form ${be(c)} (skaliert)`,`+ Teambonus ${be(l)}`,`- Fatigue ${be(s)}`,`- Langzeit ${be(n)}`,`- Akut ${be(i)}`,`- Stamina ${be(u)}`,`- HM ${be(f)}`,`= Effektiv ${be(e.effectiveSkill)}`].filter(g=>g!=null)}function Am(e,t){return gl(e,t).join(`
`)}function Bm(e){return Aa(Math.max(-2.5,Math.min(2.5,e*2.5)))}function Hm(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function fl(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${se(e.riderName)}">${se(e.riderName)}</button>`}function zm(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId)??"—",s=a.get(e.activeTeamId)??r;return`<span class="race-sim-team-code" title="${se(s)}">${se(r)}</span>`}function hl(e){return`/jersey/Jer_${e}.png`}function Gm(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId);if(!r)return"—";const s=a.get(e.activeTeamId)??r.name,n=hl(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${se(s)}">
      <img
        class="race-sim-team-jersey-img"
        src="${se(n)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Km(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function Om(e,t,a,r){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=r.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const s=e.splitTimes[t];return s!=null?Zt(s):"—"}function bl(e,t,a){const r=gl(e,t),s=[{label:"Terrain / Skill",value:`${ol(e.activeTerrain)} / ${xm(e.skillName)}`},{label:"Aktiver Abschnitt",value:nl(e)},{label:"Segmenthöhe",value:$m(e)},{label:"Basis",value:be(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${be(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:Aa((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:Aa((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:Rs((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:Rs((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:Rs((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:be(e.staminaPenalty)},{label:"HM",value:be(e.elevationPenalty)},{label:"T-Form",value:Aa(e.dailyForm)},{label:"Zufall",value:Bm(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:Hm(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?sl(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${se(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${se(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${s.map(n=>`<div class="race-sim-rider-detail-item"><span>${se(n.label)}</span><strong>${se(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${r.map(n=>se(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${se(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function jm(e,t,a,r,s,n,i){const l=document.createElement("article");l.dataset.raceSimRiderRow=String(e.riderId);const c=document.createElement("div");c.className="race-sim-row-grid",l.appendChild(c);const o=document.createElement("strong");o.className="race-sim-row-rank",o.textContent="0.",c.appendChild(o);const m=document.createElement("span");m.className="race-sim-row-flag",m.innerHTML=t?Nd(wm(t)):"—",c.appendChild(m);const p=document.createElement("span");p.className="race-sim-row-name",p.innerHTML=fl(e,a),c.appendChild(p);const u=p.querySelector(".race-sim-row-name-btn");if(!u)throw new Error("race-sim-row-name-btn not found");const f=document.createElement("span");f.className="race-sim-row-team-visual",f.innerHTML=Gm(t,s,i),c.appendChild(f);const g=document.createElement("strong");g.className="race-sim-row-team",g.innerHTML=zm(t,n,i),c.appendChild(g);const h=(_="")=>{const P=document.createElement("strong");return _&&(P.className=_),c.appendChild(P),P},b=h("race-sim-gap"),y=h("race-sim-cell-effective-skill"),k=h(),T=h(),x=h(),$=r.map(()=>h()),N=h(),E=h(),R=h("race-sim-form-state-cell"),I=document.createElement("div");return I.className="race-sim-row-detail-popover hidden",l.appendChild(I),{row:l,rankField:o,nameButton:u,gapField:b,clockField:x,splitFields:$,effectiveSkillField:y,gcRankField:k,gcGapField:T,gradientPercentField:N,speedField:E,formStateField:R,detailPanel:I,initialized:!1,lastValues:{}}}function Wm(e,t,a,r,s,n,i,l,c,o,m){const p=(r==null?void 0:r.formBonus)??0,u=(r==null?void 0:r.raceFormBonus)??0,f=c&&o>1?m.get(a.riderId)??null:null,g=Ge(a),h=i!=="ITT"&&i!=="TTT"?g?"DNF":"—":a.hasStarted?g?"DNF":a.riderClockSeconds!=null?Zt(a.riderClockSeconds):"—":rl(a.startOffsetSeconds);vr(e.row,`race-sim-row${t===1&&!g?" race-sim-row-leader":""}${s?" race-sim-row-detail-open":""}${g?" race-sim-row-dnf":""}`),kt(e.rankField,`${t}.`),kt(e.gapField,g?"DNF":al(a.gapToLeaderMeters)),kt(e.clockField,h),e.nameButton.setAttribute("aria-expanded",s?"true":"false"),vr(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),yr(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((T,x)=>{const $=e.splitFields[x];if(!$)return;const N=Om(a,T.key,i,l);kt($,N),yr($,T.label)}),Sr(e,"effectiveSkillValue",a.effectiveSkill)&&(kt(e.effectiveSkillField,be(a.effectiveSkill)),kr(e,"effectiveSkillValue",a.effectiveSkill));const b=`race-sim-cell-effective-skill ${ll(a)}`;Sr(e,"effectiveSkillClass",b)&&(vr(e.effectiveSkillField,b),kr(e,"effectiveSkillClass",b));const y=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,p,u,a.dailyForm,a.microForm,(r==null?void 0:r.fatigueMalus)??0,(r==null?void 0:r.longTermFatigueMalus)??0,(r==null?void 0:r.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");Sr(e,"effectiveSkillTitleKey",y)&&(yr(e.effectiveSkillField,Am(a,r)),kr(e,"effectiveSkillTitleKey",y)),kt(e.gcRankField,f?String(f.rank):"—"),kt(e.gcGapField,f?sl(f.gapSeconds):"—"),kt(e.gradientPercentField,km(a.gradientPercent)),vr(e.gradientPercentField,Tm(a.gradientPercent)),yr(e.gradientPercentField,`${ol(a.activeTerrain)} · ${nl(a)}`),kt(e.speedField,bn(a.currentSpeedMps)),e.formStateField.innerHTML=Km(a);const k=[s?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,p,u,(r==null?void 0:r.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(f==null?void 0:f.rank)??"—",(f==null?void 0:f.gapSeconds)??"—",a.skillBreakdown].join("|");Sr(e,"detailKey",k)&&(e.detailPanel.innerHTML=s?bl(a,r,f):"",e.detailPanel.classList.toggle("hidden",!s),kr(e,"detailKey",k)),e.detailPanel.classList.toggle("hidden",!s),e.initialized=!0}function Vm(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${se(e.name)}">${se(e.name)}</button>`}function Um(e){const t=hl(e.id);return`
    <span class="race-sim-team-visual" title="${se(e.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${se(t)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Ym(e,t,a){const r=new Map;for(const s of e.riders){const n=a.get(s.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const l=r.get(i)??[];l.push(s),r.set(i,l)}return t.teams.filter(s=>r.has(s.id)).map(s=>{const n=(r.get(s.id)??[]).slice().sort((m,p)=>p.effectiveSkill-m.effectiveSkill||m.riderId-p.riderId),i=n[0]??e.riders[0],l=Math.min(5,n.length),c=n.slice(0,l).reduce((m,p)=>m+p.effectiveSkill,0)/Math.max(l,1),o=Math.max(0,8-n.length);return{team:s,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,c-o),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(m=>m.isFinished).length}}).sort((s,n)=>pl(s.representative,n.representative,dl(t))||s.team.id-n.team.id)}function Zm(e,t,a,r,s){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${se(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${se(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${se(be(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${se(bn(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${se(e.teamClockSeconds!=null?Zt(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${se(Ks(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,l=a&&r>1?t.gcByRiderId.get(n.riderId)??null:null,c=s===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${fl(n,c)}
                <strong>${se(be(n.effectiveSkill))}</strong>
                <span>${se(n.riderClockSeconds!=null?Zt(n.riderClockSeconds):"—")}</span>
              </div>
              ${c?bl(n,i,l):""}
            </article>`}).join("")}
      </div>
    </section>`}function Jm(e,t,a){var f,g;const r=performance.now(),s=ul(a),n=s.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(h=>({label:h.key,displayLabel:h.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],l=(f=bt.get(e))==null?void 0:f.layoutKey,c=ml(e,i),o=bt.get(e)??{openDetailRiderId:null,openTeamId:null};l!=null&&l!==c&&(e.innerHTML="");const m=Ym(t,a,s.riderById),p=((g=m[0])==null?void 0:g.teamDistanceMeters)??0;return e.innerHTML=m.map((h,b)=>{const y=o.openTeamId===h.team.id;return`
      <article class="race-sim-row${b===0?" race-sim-row-leader":""}${y?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${b+1}.</strong>
          <span class="race-sim-row-name">${Vm(h.team,y)}</span>
          <span class="race-sim-row-team-visual">${Um(h.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${se(h.team.name)}">${se(h.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${se(al(Math.max(0,p-h.teamDistanceMeters)))}</strong>
          <strong>${se(h.teamClockSeconds!=null?Zt(h.teamClockSeconds):rl(h.representative.startOffsetSeconds))}</strong>
          ${n.map(k=>`<strong>${se(h.splitTimes[k.key]!=null?Zt(h.splitTimes[k.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${ll(h.representative)}">${se(be(h.teamEffectiveSkill))}</strong>
          <strong>${se(bn(h.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${y?"":" hidden"}">${y?Zm(h,s,a.race.isStageRace,a.stage.stageNumber,o.openDetailRiderId):""}</div>
      </article>`}).join(""),bt.set(e,{layoutKey:c,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:o.openDetailRiderId,openTeamId:o.openTeamId}),{totalMs:performance.now()-r,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:m.length,rowsCreated:m.length,rowsRemoved:0,rowsUpdated:m.length,rowsSkippedInvisible:0,orderChanged:1}}function Bi(e,t,a){if(a.stage.profile==="TTT")return Jm(e,t,a);const r=performance.now(),s={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=ul(a),{splitMarkers:l}=i,c=Mm(t),o=yn(e),m=o.showSplitColumns?l:[],p=bt.get(e);s.prepMs=performance.now()-n;const u=performance.now(),f=Dm(t.riders,a,l,c,o,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(p==null?void 0:p.orderedRiderIds)??[]);s.sortMs=performance.now()-u;const g=p==null?void 0:p.layoutKey,h=performance.now(),b=ml(e,cl(a,m,o.showSplitColumns));s.layoutMs=performance.now()-h;const y=bt.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};g!=null&&g!==b&&(e.innerHTML="",y.rowsByRiderId.clear(),y.orderedRiderIds=[]);const k=f.map(I=>I.riderId),T=new Set(k),x=performance.now();for(const[I,_]of y.rowsByRiderId)T.has(I)||(_.row.remove(),y.rowsByRiderId.delete(I),s.rowsRemoved+=1);s.removeRowsMs=performance.now()-x;const $=performance.now();for(let I=0;I<f.length;I+=1){const _=f[I],P=i.riderById.get(_.riderId)??null;let D=y.rowsByRiderId.get(_.riderId);D||(D=jm(_,P,y.openDetailRiderId===_.riderId,m,i.teamById,i.teamAbbreviationById,i.teamNameById),y.rowsByRiderId.set(_.riderId,D),s.rowsCreated+=1)}s.createRowsMs=performance.now()-$;const N=performance.now(),E=y.orderedRiderIds.length===k.length&&y.orderedRiderIds.every((I,_)=>I===k[_]);s.orderCheckMs=performance.now()-N;const R=performance.now();if(!E){const I=document.createDocumentFragment();for(const _ of k){const P=y.rowsByRiderId.get(_);P&&I.appendChild(P.row)}e.replaceChildren(I),s.orderChanged=1}s.reorderMs=performance.now()-R;for(let I=0;I<f.length;I+=1){const _=f[I],P=y.rowsByRiderId.get(_.riderId),D=i.riderById.get(_.riderId)??null;if(!P)continue;const G=performance.now();Wm(P,I+1,_,D,y.openDetailRiderId===_.riderId,m,a.stage.profile,c,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),s.updateRowsMs+=performance.now()-G,s.rowsUpdated+=1}return bt.set(e,{layoutKey:b,orderedRiderIds:k,rowsByRiderId:y.rowsByRiderId,openDetailRiderId:y.openDetailRiderId,openTeamId:y.openTeamId}),s.finalizeMs=performance.now()-(r+s.prepMs+s.sortMs+s.layoutMs+s.removeRowsMs+s.createRowsMs+s.orderCheckMs+s.reorderMs+s.visibilityMs+s.updateRowsMs),s.totalMs=performance.now()-r,s.finalizeMs=Math.max(0,s.totalMs-s.prepMs-s.sortMs-s.layoutMs-s.removeRowsMs-s.createRowsMs-s.orderCheckMs-s.reorderMs-s.visibilityMs-s.updateRowsMs),s}const qm=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],Xm=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],yl=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],vl=["Sprint","4","3","2","1","HC"],Yr=.2,Qm=7,ep=100,tp=3,ap=50,rp=-2,sp=1,np=2.5,ip=-3,op=15,lp=200,dp=600,cp=850;function Ze(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function Zr(e){return e==="finish_hill"||e==="finish_mountain"}function Jr(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function cs(e,t){return e==="climb_top"||Zr(e)&&Jr(t)}function Qa(e){return Math.round(e*10)/10}function Ke(e){return Number(e.toFixed(2))}function _t(e){return`${e.toFixed(2).replace(".",",")} km`}function Sl(e){return`${Math.round(e)} hm`}function up(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function vn(e){return qm.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function mp(e){return Xm.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function pp(e,t="start",a=0,r=1){const s=yl.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:Ze(i)?a===r-1:i==="climb_top"||i==="sprint_intermediate");return(s.includes(e)?s:[e,...s.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${S(i)}</option>`).join("")}function gp(e){return['<option value="">–</option>',...vl.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`)].join("")}function Hi(e){return yl.indexOf(e)}function lt(e){return[...e].sort((t,a)=>Hi(t.type)-Hi(a.type))}function Oa(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:lt(e[0].markers)}];let a=0;return e.forEach(r=>{a=Ke(a+r.lengthKm);const s=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),n=t[t.length-1];n.terrain=r.terrain,n.techLevel=r.techLevel,n.windExp=r.windExp,n.markers=lt([...n.markers,...r.markers]),t.push({kmMark:a,elevation:s,terrain:r.terrain,techLevel:r.techLevel,windExp:r.windExp,markers:lt(r.endMarkers)})}),t}function fp(e){return e?" stage-editor-input-invalid":""}function Sn(e,t){const a=e.segments[t];if(!a)return[];const r=[],s=hp(e).get(t)??[];return a.lengthKm<Yr&&r.push(`Laenge unter ${Yr.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&r.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&r.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&r.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>Ze(n.type))&&r.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&r.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>Ze(n.type))&&r.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{Ze(n.type)&&r.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&r.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&r.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&r.push(`${n.type} gehoert in den Startmarker-Slot.`),cs(n.type,n.cat)&&!Jr(n.cat)&&r.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&r.push("Sprintmarker erlaubt nur Kategorie Sprint."),Ze(n.type)&&!Zr(n.type)&&n.cat!=null&&r.push("finish_flat und finish_TT duerfen keine Kategorie haben."),Zr(n.type)&&n.cat!=null&&!Jr(n.cat)&&r.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),r.push(...s),[...new Set(r)]}function hp(e){const t=new Map,a=[],r=(s,n)=>{const i=t.get(s)??[];i.push(n),t.set(s,i)};return e.segments.forEach((s,n)=>{s.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),s.endMarkers.forEach(i=>{var o;if(!cs(i.type,i.cat))return;if(!i.name){r(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let l=-1;for(let m=a.length-1;m>=0;m-=1)if(((o=a[m])==null?void 0:o.name)===i.name){l=m;break}const c=l>=0?l:a.length-1;if(c<0){r(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(c,1)})}),a.forEach(s=>{const n=s.name?` "${s.name}"`:"";r(s.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function bp(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:Zr(e.type)?{...e,cat:Jr(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function kl(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:yp(e.waypoints??[])).map(r=>({...r,startElevation:Math.round(r.startElevation),lengthKm:Number.isFinite(r.lengthKm)?Ke(r.lengthKm):Yr,gradientPercent:Number.isFinite(r.gradientPercent)?Qa(r.gradientPercent):0,techLevel:Number.isFinite(r.techLevel)?r.techLevel:5,windExp:Number.isFinite(r.windExp)?r.windExp:5,markers:zi(r.markers),endMarkers:zi(r.endMarkers)})),waypoints:[]};return Ot(t),t}function yp(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const r=e[a],s=e[a+1],n=Ke(s.kmMark-r.kmMark),i=s.elevation-r.elevation,l=Qa(n>0?i/(n*10):0);t.push({startElevation:r.elevation,lengthKm:n,gradientPercent:l,techLevel:r.techLevel??5,windExp:r.windExp??5,terrain:r.terrain??"Flat",markers:r.markers??[],endMarkers:s.markers??[]})}return t}function zi(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function vp(e,t,a){const r=e*a*8+t/12;return r>=95?"HC":r>=68?"1":r>=46?"2":r>=28?"3":"4"}function Gi(e){const t=[];let a=null,r=null,s=0;const n=i=>{if(a==null||i==null||i<=a){a=null,r=null,s=0;return}const l=e[a],c=e[i],o=c.kmMark-l.kmMark,m=Math.max(0,c.elevation-l.elevation),p=o>0?m/(o*10):0;m>=ep&&p>=tp&&t.push({startKm:Ke(l.kmMark),endKm:Ke(c.kmMark),distanceKm:Ke(o),gainMeters:Math.round(m),avgGradient:Qa(p),category:vp(o,m,p),startIndex:a,topIndex:i,topElevation:Math.round(c.elevation)}),a=null,r=null,s=0};for(let i=1;i<e.length;i+=1){const l=e[i-1],c=e[i],o=c.elevation-l.elevation;if(a==null&&o>0){a=i-1,r=i,s=0;continue}if(a!=null){if(o>=0){(r==null||c.elevation>=e[r].elevation)&&(r=i),s=0;continue}s+=Math.abs(o),s>=ap&&n(r)}}return n(r),t}function Sp(e){const t=e.segments.some(s=>s.terrain==="Cobble_Hill"),a=e.segments.some(s=>s.terrain==="Cobble"),r=e.climbs.some(s=>s.category==="HC"||s.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":r&&e.elevationGainMeters>=2800?"High_Mountain":r||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function $r(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function kp(e){return e.gainMeters>=dp&&e.topElevation>=cp?"Mountain":e.gainMeters>lp?"Medium_Mountain":"Hill"}function $p(e){return e.gradientPercent<ip?"Abfahrt":e.gradientPercent<np||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<op?"Flat":"Hill"}function xp(e){if(e.segments.length===0)return;if(e.waypoints=Oa(e.segments),e.sourceFormat==="csv"){const i=Gi(e.waypoints);e.climbs=i.map(({startIndex:l,topIndex:c,topElevation:o,...m})=>m);return}const t=e.segments.map(i=>i.manualTerrain||$r(i.terrain)?i.terrain:$p(i)),a=Gi(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:l,topElevation:c,...o})=>o),a.forEach(i=>{const l=kp(i);if(l)for(let c=i.startIndex;c<i.topIndex;c+=1)e.segments[c].manualTerrain||$r(t[c])||(t[c]=l)});let r=null,s=0;const n=i=>{if(r==null||s<=sp){r=null,s=0;return}for(let l=r;l<i;l+=1)!(e.segments[l].manualTerrain||$r(t[l]))&&t[l]==="Flat"&&(t[l]="Abfahrt");r=null,s=0};for(let i=0;i<e.segments.length;i+=1){const l=e.segments[i];if(l&&l.gradientPercent<rp){r==null&&(r=i),s+=l.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,l)=>{$r(i.terrain)||(i.terrain=t[l])}),e.waypoints=Oa(e.segments),e.suggestedProfile=Sp(e)}function Ot(e){Tp(e),Ki(e),xp(e),e.waypoints=Oa(e.segments),Ki(e)}function Tp(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,r)=>{const s={...a,startElevation:Math.round(r===0?a.startElevation:t),lengthKm:Ke(a.lengthKm),gradientPercent:Qa(a.gradientPercent),markers:lt(a.markers),endMarkers:lt(a.endMarkers)};return t=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),s}),e.waypoints=Oa(e.segments)}function Ki(e){e.totalDistanceKm=Ke(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,r)=>{if(r===0)return 0;const s=a.elevation-e.waypoints[r-1].elevation;return t+Math.max(0,s)},0)}function Ct(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(r=>r.type==="start")||(t.markers=lt([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(r=>Ze(r.type))||(a.endMarkers=lt([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=Oa(e.segments))}function wp(e,t,a,r){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((s,n)=>{const i=r==="start"&&t===0&&s.type==="start",l=e.filter(m=>Ze(m.type)).length,c=r==="end"&&t===a-1&&Ze(s.type)&&l===1,o=!(i||c);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${r}" data-marker-index="${n}">${pp(s.type,r,t,a)}</select>
        <input type="text" value="${S(s.name??"")}" data-field="markerName" data-marker-scope="${r}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${r}" data-marker-index="${n}">${gp(s.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${r}" data-marker-index="${n}" data-segment-index="${t}" ${o?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function Oi(e,t,a,r){const s=r==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${wp(e,t,a,r)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${r}" data-segment-index="${t}">${s}</button>
    </div>`}function Mp(e,t,a,r,s){if(!d.stageEditorDraft)return;const n=d.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,l=i[t];if(l){if(r==="markerType"){l.type=s;const c=bp(l);if(l.name=c.name,l.cat=c.cat,Ze(l.type)){const o=i.filter((m,p)=>p===t||!Ze(m.type));a==="start"?n.markers=o:n.endMarkers=o}}else r==="markerName"?l.name=s.trim()||null:r==="markerCat"&&(l.cat=s||null);a==="start"?n.markers=lt(n.markers):n.endMarkers=lt(n.endMarkers),Ot(d.stageEditorDraft),Ct(d.stageEditorDraft),ye()}}function Rp(e,t){if(!d.stageEditorDraft)return;const a=d.stageEditorDraft.segments[e];if(!a)return;const r=t==="start"?e===0&&!a.markers.some(s=>s.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===d.stageEditorDraft.segments.length-1&&!a.endMarkers.some(s=>Ze(s.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(r),a.markers=lt(a.markers)):(a.endMarkers.push(r),a.endMarkers=lt(a.endMarkers)),Ot(d.stageEditorDraft),Ct(d.stageEditorDraft),ye()}function Ip(e,t,a){if(!d.stageEditorDraft)return;const r=d.stageEditorDraft.segments[e];r&&(a==="start"?r.markers.splice(t,1):r.endMarkers.splice(t,1),Ot(d.stageEditorDraft),Ct(d.stageEditorDraft),ye())}let ua=0,ma=0;async function Cp(){v("stage-editor-profile").innerHTML=vn("Flat"),v("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',v("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([Y.listStageEditorCountries(),Y.listStageEditorRaceCategories(),Y.listStageEditorRacePrograms(),xn()]);if(e.success&&e.data){const r=v("stage-editor-race-country");r.innerHTML=e.data.map(s=>`<option value="${s.id}">${S(s.name)} (${S(s.code3)})</option>`).join("")}if(t.success&&t.data){const r=v("stage-editor-race-category");r.innerHTML=t.data.map(s=>`<option value="${s.id}">${S(s.name)}</option>`).join("")}a.success&&a.data&&(d.stageEditorPrograms=a.data,Fp())}function Fp(){const e=v("stage-editor-programs-list");d.stageEditorPrograms&&(e.innerHTML=d.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${S(t.name)}</span>
      </label>
    `).join(""))}function Ep(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=v("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(r=>{var n;const s=(n=d.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===r.value);return s?s.name:r.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function Pp(e,t){var r;let a=0;for(let s=0;s<t;s+=1)a+=((r=e.segments[s])==null?void 0:r.lengthKm)??0;return Ke(a)}function kn(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function $l(){const e=d.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function Np(){const e=[...d.stageEditorExistingStages.map(t=>t.raceId),...d.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function Dp(e,t){let a=e;const r=new Set(d.stageEditorExistingStages.map(s=>s.stageId));for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function Lp(e,t){let a=e;const r=new Set([...d.stageEditorExistingStages.map(s=>s.raceId),...d.races.map(s=>s.id)]);for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function ia(){const e=v("stage-editor-date");if(!e)return;const t=e.value.trim();if(!/^\d{4}-\d{2}-\d{2}$/.test(t))return;const a=document.getElementById("stage-editor-new-race-checkbox");if(!a||!a.checked)return;const r=document.getElementById("stage-editor-race-is-stage-race");if(!r)return;const s=Number(r.value)===1,n=v("stage-editor-race-start-date"),i=v("stage-editor-race-end-date");if(!(!n||!i))if(!s)n.value=t,i.value=t;else{n.value=t;const l=document.getElementById("stage-editor-race-num-stages"),c=l&&Number(l.value)||1,[o,m,p]=t.split("-").map(Number),u=new Date(o,m-1,p);let f=0;c===21?f=2:c>=14&&(f=1);const g=c+f;u.setDate(u.getDate()+g-1);const h=u.getFullYear(),b=String(u.getMonth()+1).padStart(2,"0"),y=String(u.getDate()).padStart(2,"0");i.value=`${h}-${b}-${y}`}}function _p(e){var l;const t=v("stage-editor-profile");t.innerHTML=vn(e.suggestedProfile),t.value=e.suggestedProfile;const a=$l(),r=Np();v("stage-editor-stage-id").value=String(a),v("stage-editor-race-id").value=String(r),ua=a,ma=r;const s=v("stage-editor-details-file");s.value.trim()||(s.value=`${up(e.routeName)}.csv`);const n=v("stage-editor-date");!n.value&&((l=d.gameState)!=null&&l.currentDate)&&(n.value=d.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(c=>{c.checked=!0}),ia()}function Ap(e){v("stage-editor-stage-id").value=String(e.stageId),v("stage-editor-race-id").value=String(e.raceId),ua=e.stageId,ma=e.raceId,v("stage-editor-stage-number").value=String(e.stageNumber),v("stage-editor-date").value=e.date,v("stage-editor-details-file").value=e.detailsCsvFile;const t=v("stage-editor-profile");t.innerHTML=vn(e.profile),t.value=e.profile,v("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),v("stage-editor-final-push-start").value=String(e.finalPushStartPercent),v("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),v("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),v("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(s=>s.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(s=>{s.checked=a.includes(s.value)}),ia()}function xl(e){var r;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((r=e.segments[0])!=null&&r.markers.some(s=>s.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(s=>Ze(s.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((s,n)=>{Sn(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...s.markers??[],...s.endMarkers??[]].forEach(i=>{i.cat!=null&&!vl.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function Tl(){const e=[],t=Number(v("stage-editor-stage-id").value),a=Number(v("stage-editor-race-id").value),r=Number(v("stage-editor-stage-number").value),s=v("stage-editor-date").value.trim(),n=v("stage-editor-details-file").value.trim(),i=Number(v("stage-editor-final-spread-start").value),l=Number(v("stage-editor-final-push-start").value),c=Number(v("stage-editor-final-spread-difficulty").value),o=Number(v("stage-editor-crash-multiplier").value),m=Number(v("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(r)||r<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(s)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(l)||l<0||l>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(c)||c<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(o)||o<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(m)||m<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),d.stageEditorExistingStages.map(b=>b.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const f=v("stage-editor-new-race-checkbox").checked,g=[...d.stageEditorExistingStages.map(b=>b.raceId),...d.races.map(b=>b.id)];if(f){g.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const b=v("stage-editor-race-name").value.trim(),y=Number(v("stage-editor-race-country").value),k=Number(v("stage-editor-race-category").value),T=Number(v("stage-editor-race-num-stages").value),x=v("stage-editor-race-start-date").value.trim(),$=v("stage-editor-race-end-date").value.trim(),N=Number(v("stage-editor-race-prestige").value);b||e.push("Rennname fehlt."),(!Number.isInteger(y)||y<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger(k)||k<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(T)||T<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(x)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test($)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(N)||N<1||N>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else g.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return v("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function Bp(){var a,r;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(s=>s.value).join("|");return{stageId:Number(v("stage-editor-stage-id").value),raceId:Number(v("stage-editor-race-id").value),stageNumber:Number(v("stage-editor-stage-number").value),date:v("stage-editor-date").value.trim(),profile:v("stage-editor-profile").value,detailsCsvFile:v("stage-editor-details-file").value.trim(),startElevation:((r=(a=d.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:r.startElevation)??0,finalSpreadStartPercent:Number(v("stage-editor-final-spread-start").value),finalPushStartPercent:Number(v("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(v("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(v("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(v("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function Hp(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function zp(e){return["gainMeters","elevationAtTop","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function us(e,t,a){const s=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-s*118),i=54,l=.14+s*.12,c=.26+s*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${l};--stage-editor-score-border-alpha:${c};`}">${Math.round(e)}</span>`}function $n(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),r=Math.round(40-t*22),s=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${s};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function Gp(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function Kp(e,t,a,r){const s=r!=null?` data-stage-profile-open-climb-id="${S(r)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${s}>${e}</button>`}function Op(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",r=e.profileScore??e.score,s=[...d.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,l)=>i.climbIndex-l.climbIndex),n=s.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span class="text-right">${$n(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${us(r,0,100)}
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
    </div>`}function jp(e){const t=s=>s!=null?`${s.toFixed(1).replace(".",",")} km`:"—",a=s=>s!=null?`${Math.round(s).toLocaleString("de-DE")} m`:"—",r=s=>s!=null?`${s.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${$n(e.climbScore??0)}
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
    </div>`}function wl(e,t,a,r,s,n,i,l){const c=l??us(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${Kp(c,r,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${s}
      </div>
    </div>`}function ge(e,t,a,r,s){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?r==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${s}-sort="${t}">
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function Ea(){const e=v("stage-editor-stages-table"),t=v("stage-editor-stages-empty"),a=v("stage-editor-stages-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=d.stageEditorStagesSort.key,i=d.stageEditorStagesSort.direction;r&&(r.innerHTML=`<tr>
      ${ge("ID","stageId",n,i,"stages")}
      ${ge("Land","countryCode",n,i,"stages")}
      ${ge("Rennen","raceName",n,i,"stages")}
      ${ge("Etappe","stageNumber",n,i,"stages")}
      ${ge("Score","profileScore",n,i,"stages")}
      ${ge("Profil","profile",n,i,"stages")}
      ${ge("Distanz","distanceKm",n,i,"stages")}
      ${ge("Höhenmeter","elevationGainMeters",n,i,"stages")}
      ${ge("Sprints","sprintCount",n,i,"stages")}
      ${ge("Climbs","climbCount",n,i,"stages")}
    </tr>`);const l=Wp(d.stageEditorStageRows);s.innerHTML=l.map(c=>`
    <tr>
      <td>${c.stageId}</td>
      <td>${de(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(ar({stageNumber:c.stageNumber}))}</strong></td>
      <td>${wl(c.profileScore,0,100,c.stageId,Op(c),hs({name:c.raceName},{stageNumber:c.stageNumber,profile:c.profile}))}</td>
      <td>${rr(c.profile)}</td>
      <td>${_t(c.distanceKm)}</td>
      <td>${Sl(c.elevationGainMeters)}</td>
      <td>${c.sprintCount} Sprints</td>
      <td>${c.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",l.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${d.stageEditorStageRows.length} vorhandene Etappen`}function Pa(){const e=v("stage-editor-climbs-table"),t=v("stage-editor-climbs-empty"),a=v("stage-editor-climbs-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=d.stageEditorClimbsSort.key,i=d.stageEditorClimbsSort.direction;r&&(r.innerHTML=`<tr>
      ${ge("km","placementKm",n,i,"climbs")}
      ${ge("Name","name",n,i,"climbs")}
      ${ge("Kat.","category",n,i,"climbs")}
      ${ge("Score","climbScore",n,i,"climbs")}
      ${ge("Land","countryCode",n,i,"climbs")}
      ${ge("Rennen","raceName",n,i,"climbs")}
      ${ge("Etappe","stageNumber",n,i,"climbs")}
      ${ge("Höhenmeter","gainMeters",n,i,"climbs")}
      ${ge("Höhe (Top)","elevationAtTop",n,i,"climbs")}
      ${ge("Distanz","distanceKm",n,i,"climbs")}
      ${ge("Ø Steigung","avgGradient",n,i,"climbs")}
      ${ge("Max Steigung","maxGradient",n,i,"climbs")}
    </tr>`);const l=Vp(d.stageEditorClimbRows);s.innerHTML=l.map(c=>`
    <tr>
      <td>${c.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${S(c.name)}</strong></td>
      <td>${Gp(c.category)}</td>
      <td>${wl(c.climbScore,0,350,c.stageId,jp(c),hs({name:c.raceName},{stageNumber:c.stageNumber,profile:"Mountain"}),c.id,$n(c.climbScore))}</td>
      <td>${de(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(ar({stageNumber:c.stageNumber}))}</strong></td>
      <td>${Sl(c.gainMeters)}</td>
      <td>${Math.round(c.elevationAtTop).toLocaleString("de-DE")} m</td>
      <td>${_t(c.distanceKm)}</td>
      <td>${c.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${c.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",l.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${d.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function Ml(e=!1){if(d.stageEditorOverviewLoaded&&!e){Ea(),Pa();return}d.stageEditorOverviewLoading=!0,Ea(),Pa();const t=await Y.getStageEditorOverview();if(d.stageEditorOverviewLoading=!1,d.stageEditorOverviewLoaded=!0,!t.success||!t.data){d.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),Ea(),Pa();return}d.stageEditorStageRows=t.data.stages,d.stageEditorClimbRows=t.data.climbs,Ea(),Pa()}async function xn(e=!1){const t=v("stage-editor-existing-stage-wrap");if(d.stageEditorExistingStagesLoaded&&!e){Os();return}t.classList.add("loading");const a=v("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const r=await Y.listStageEditorStages();if(t.classList.remove("loading"),d.stageEditorExistingStagesLoaded=!0,!r.success||!r.data){d.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}d.stageEditorExistingStages=r.data.stages,Os()}function Os(){const e=v("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+d.stageEditorExistingStages.map(a=>{const r=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${S(a.raceName)} · Etappe ${a.stageNumber}${r}</option>`}).join("")}function Wp(e){const t=d.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(d.stageEditorStagesSort.key){case"stageId":s=a.stageId-r.stageId;break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"profile":s=a.profile.localeCompare(r.profile,"de");break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"elevationGainMeters":s=a.elevationGainMeters-r.elevationGainMeters;break;case"sprintCount":s=a.sprintCount-r.sprintCount;break;case"climbCount":s=a.climbCount-r.climbCount;break;case"profileScore":s=a.profileScore-r.profileScore;break}return s*t||a.stageId-r.stageId})}function Vp(e){const t=d.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(d.stageEditorClimbsSort.key){case"placementKm":s=a.placementKm-r.placementKm;break;case"name":s=a.name.localeCompare(r.name,"de");break;case"category":s=(a.category??"").localeCompare(r.category??"","de");break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"gainMeters":s=a.gainMeters-r.gainMeters;break;case"elevationAtTop":s=a.elevationAtTop-r.elevationAtTop;break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"avgGradient":s=a.avgGradient-r.avgGradient;break;case"maxGradient":s=a.maxGradient-r.maxGradient;break;case"climbScore":s=a.climbScore-r.climbScore;break}return s*t||a.placementKm-r.placementKm})}function Up(e){return e.map(t=>t.type).join(" | ")}function Yp(e){const t=[],a=[];let r=0;return e.segments.forEach((s,n)=>{const i=r,l=Ke(i+s.lengthKm),c=kn(s);s.markers.forEach(o=>{o.type==="climb_start"&&o.name&&a.push({name:o.name,segmentIndex:n,startKm:i,startElevation:s.startElevation})}),s.endMarkers.forEach(o=>{if(cs(o.type,o.cat)&&o.name){let m=-1;for(let p=a.length-1;p>=0;p--)if(a[p].name===o.name){m=p;break}if(m>=0){const p=a[m];a.splice(m,1);const u=Ke(l-p.startKm),f=Math.max(0,c-p.startElevation),g=u>0?Qa(f/(u*10)):0;t.push({name:o.name,startKm:p.startKm,endKm:l,distanceKm:u,gainMeters:f,avgGradient:g,category:o.cat||"4"})}}}),r=l}),t}function Zp(e){const t=[];let a=0;return e.segments.forEach(r=>{const s=Ke(a+r.lengthKm);r.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:s})}),a=s}),t}function Jp(e){const t=new Set,a=[];let r=0;return e.segments.forEach((s,n)=>{const l=Ke(r+s.lengthKm);s.markers.forEach(c=>{c.type==="climb_start"&&c.name&&a.push({name:c.name,segmentIndex:n})}),a.length>0&&t.add(n),s.endMarkers.forEach(c=>{if(cs(c.type,c.cat)&&c.name){let o=-1;for(let m=a.length-1;m>=0;m--)if(a[m].name===c.name){o=m;break}o>=0&&a.splice(o,1)}}),r=l}),t}function qp(e,t,a){const r=e.segments[t];if(!r||a.has(t)||r.markers.length>0||r.endMarkers.length>0)return!1;const s=r.terrain==="Flat"&&r.gradientPercent>=-3&&r.gradientPercent<=1.5,n=r.terrain==="Abfahrt"&&r.gradientPercent<=-3;return s||n}function ye(){Os();const e=d.stageEditorDraft,t=v("stage-editor-import-summary"),a=v("stage-editor-warnings"),r=v("stage-editor-climbs"),s=v("stage-editor-empty"),n=v("stage-editor-chart"),i=v("stage-editor-waypoints-body"),l=v("stage-editor-export-hint"),c=v("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",r.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',s.classList.remove("hidden"),n.innerHTML=ji(null),i.innerHTML=`<tr><td colspan="${Qm}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,l.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",c.disabled=!0;return}s.classList.add("hidden");const o=xl(e),m=Tl(),p=document.getElementById("stage-editor-profile"),u=p&&p.value?p.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${S(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${_t(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${S(u)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const f=[...e.warnings,...o,...m];a.innerHTML=f.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':f.map(T=>`<div class="stage-editor-alert">${S(T)}</div>`).join("");const g=Yp(e),h=Zp(e);let b="";g.length>0?b+=`
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
              <span>${_t(T.startKm)} - ${_t(T.endKm)}</span>
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
              ${_t(T.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:b+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `;const y=v("stage-editor-hide-boring-segments-checkbox");y&&(y.checked=d.stageEditorHideBoringSegments),r.innerHTML=b,n.innerHTML=ji(e);const k=Jp(e);i.innerHTML=e.segments.map((T,x)=>{const $=d.stageEditorHideBoringSegments&&qp(e,x,k);return`
    <tr data-segment-index="${x}" class="${Sn(e,x).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;${$?" display: none;":""}">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${x+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${T.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${fp(T.lengthKm<Yr)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${T.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${mp(T.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${Oi(T.markers,x,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${Oi(T.endMarkers,x,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div style="display: flex; flex-direction: column; min-width: 3.5rem; justify-content: center; line-height: 1.2;">
            <span class="text-muted" style="font-size: 0.85rem;">${kn(T)} m</span>
            <span style="font-size: 0.7rem; color: #888; font-weight: normal;">${_t(Pp(e,x)+T.lengthKm)}</span>
          </div>
          ${Xp(e,x)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${x}">+</button>
          ${x===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${x}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${x}">✕</button>`:""}
        </div>
      </td>
    </tr>`}).join(""),c.disabled=f.length>0,l.textContent=f.length>0?`${f.length} Validierungshinweise vor dem Export.`:`Exportiert ${v("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function Xp(e,t){const a=Sn(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(r=>`<div>${S(r)}</div>`).join("")}</div>`}function ji(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,r=24,s=20,n=e.waypoints,i=n[n.length-1].kmMark,l=Math.min(...n.map(g=>g.elevation)),c=Math.max(...n.map(g=>g.elevation)),o=Math.max(1,c-l),m=n.map(g=>{const h=r+g.kmMark/Math.max(i,.1)*(t-r*2),b=a-s-(g.elevation-l)/o*(a-s*2);return{x:h,y:b,waypoint:g}}),p=m.map((g,h)=>`${h===0?"M":"L"} ${g.x.toFixed(1)} ${g.y.toFixed(1)}`).join(" "),u=`${p} L ${(t-r).toFixed(1)} ${(a-s).toFixed(1)} L ${r.toFixed(1)} ${(a-s).toFixed(1)} Z`,f=m.filter(g=>g.waypoint.markers.length>0).map(g=>`
      <line x1="${g.x.toFixed(1)}" y1="${s}" x2="${g.x.toFixed(1)}" y2="${(a-s).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${g.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${S(Up(g.waypoint.markers))}</text>`).join("");return`
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
      <text x="${r}" y="${a-4}" class="stage-editor-chart-scale">${Math.round(l)} m</text>
      <text x="${t-r}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${_t(i)}</text>
    </svg>`}function Qp(e,t,a){const r=d.stageEditorDraft;if(!r)return;const s=r.segments[e];s&&(t==="startElevation"?s.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?s.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?s.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(s.terrain=a,s.manualTerrain=!0):t==="techLevel"?s.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(s.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),Ot(r),Ct(r),ye())}function eg(e){const t=d.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const r={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,r),Ot(t),Ct(t),ye()}function tg(){const e=d.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],r={startElevation:t?kn(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(r),Ot(e),Ct(e),ye()}function ag(e){const t=d.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),Ot(t),Ct(t),ye()))}async function rg(){var a;const t=(a=v("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}v("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,Te("Route wird importiert……");try{const r=await t.text(),s=await Y.importStageRoute({fileName:t.name,fileContent:r});if(!s.success||!s.data){alert(`Import fehlgeschlagen: ${s.error??"Unbekannter Fehler"}`);return}const n=kl(s.data);d.stageEditorDraft=n,Ct(n),_p(n),ye(),Rt("stage-editor")}finally{ve()}}async function sg(){const e=Number(v("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}Te("CSV-Stage wird geladen...");try{const t=await Y.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=kl(t.data.draft);d.stageEditorDraft=a,Ct(a),Ap(t.data.metadata),ye(),Rt("stage-editor")}finally{ve()}}async function ng(){if(!d.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...xl(d.stageEditorDraft),...Tl()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),ye();return}const t=v("stage-editor-new-race-checkbox").checked,a=v("stage-editor-program-checkbox").checked;let r;t&&(r={name:v("stage-editor-race-name").value.trim(),countryId:Number(v("stage-editor-race-country").value),categoryId:Number(v("stage-editor-race-category").value),isStageRace:Number(v("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(v("stage-editor-race-num-stages").value),startDate:v("stage-editor-race-start-date").value.trim(),endDate:v("stage-editor-race-end-date").value.trim(),prestige:Number(v("stage-editor-race-prestige").value)});let s;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');s=Array.from(n).map(i=>Number(i.value))}Te("CSV-Dateien werden erstellt……");try{const n=await Y.exportStageRoute({metadata:Bp(),draft:d.stageEditorDraft,newRace:t,raceDetails:r,updatePrograms:a,programIds:s});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}Kr(n.data.stagesFileName,n.data.stagesCsv),Kr(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=v("stage-editor-stage-number"),l=Number(i.value)||1;i.value=String(l+1);const c=v("stage-editor-date"),o=c.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(o)){const b=new Date(o);b.setDate(b.getDate()+1);const y=b.getFullYear(),k=String(b.getMonth()+1).padStart(2,"0"),T=String(b.getDate()).padStart(2,"0");c.value=`${y}-${k}-${T}`}await Promise.all([Ml(!0),xn(!0)]);const m=$l();v("stage-editor-stage-id").value=String(m),ua=m;const p=v("stage-editor-new-race-checkbox");p&&(p.checked=!1);const u=v("stage-editor-new-race-details");u&&(u.classList.add("hidden"),u.style.display="none");const f=v("stage-editor-program-checkbox");f&&(f.checked=!1);const g=v("stage-editor-program-details");g&&(g.classList.add("hidden"),g.style.display="none"),ma=Number(v("stage-editor-race-id").value),ye()}finally{ve()}}function ig(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",R=>{const I=R.target.closest("button[data-stage-profile-open-stage-id]");if(I){const D=Number(I.dataset.stageProfileOpenStageId);Number.isFinite(D)&&es(D);return}const _=R.target.closest("button[data-stage-editor-stages-sort]");if(!_)return;const P=_.dataset.stageEditorStagesSort;d.stageEditorStagesSort.key===P?d.stageEditorStagesSort.direction=d.stageEditorStagesSort.direction==="asc"?"desc":"asc":d.stageEditorStagesSort={key:P,direction:Hp(P)},Ea()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",R=>{const I=R.target.closest("button[data-stage-profile-open-stage-id]");if(I){const D=Number(I.dataset.stageProfileOpenStageId),G=I.dataset.stageProfileOpenClimbId??null;if(Number.isFinite(D)){let B=null;G&&d.stageEditorClimbRows&&(B=d.stageEditorClimbRows.find(q=>q.id===G)??null),es(D,B)}return}const _=R.target.closest("button[data-stage-editor-climbs-sort]");if(!_)return;const P=_.dataset.stageEditorClimbsSort;d.stageEditorClimbsSort.key===P?d.stageEditorClimbsSort.direction=d.stageEditorClimbsSort.direction==="asc"?"desc":"asc":d.stageEditorClimbsSort={key:P,direction:zp(P)},Pa()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{rg()});const r=document.getElementById("btn-stage-editor-load-existing");r&&r.addEventListener("click",()=>{sg()});const s=document.getElementById("btn-stage-editor-export");s&&s.addEventListener("click",()=>{ng()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",R=>{var _;const I=((_=R.target.files)==null?void 0:_[0])??null;v("stage-editor-file-hint").textContent=I?`${I.name} · ${(I.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",R=>{const I=R.target,_=I.closest("tr[data-segment-index]"),P=I.dataset.field;if(!_||!P)return;const D=Number(_.dataset.segmentIndex);if(Number.isInteger(D)){if(P==="markerType"||P==="markerName"||P==="markerCat"){const G=Number(I.dataset.markerIndex),B=I.dataset.markerScope;if(!Number.isInteger(G)||B!=="start"&&B!=="end")return;Mp(D,G,B,P,I.value);return}Qp(D,P,I.value)}}),i.addEventListener("click",R=>{const I=R.target.closest("button[data-segment-action]");if(!I)return;const _=Number(I.dataset.segmentIndex);if(Number.isInteger(_)){if(I.dataset.segmentAction==="insert"){eg(_);return}if(I.dataset.segmentAction==="append"){tg();return}if(I.dataset.segmentAction==="add-marker"){const P=I.dataset.markerScope;if(P!=="start"&&P!=="end")return;Rp(_,P);return}if(I.dataset.segmentAction==="remove-marker"){const P=Number(I.dataset.markerIndex),D=I.dataset.markerScope;if(!Number.isInteger(P)||D!=="start"&&D!=="end")return;Ip(_,P,D);return}I.dataset.segmentAction==="delete"&&ag(_)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(R=>{const I=document.getElementById(R);I&&I.addEventListener("change",()=>{R==="stage-editor-date"&&ia(),ye()})}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(R=>{R.addEventListener("change",()=>ye())});const c=v("stage-editor-new-race-checkbox"),o=v("stage-editor-new-race-details"),m=v("stage-editor-program-checkbox"),p=v("stage-editor-program-details");c&&c.addEventListener("change",()=>{c.checked?(o&&(o.classList.remove("hidden"),o.style.display="grid"),m&&(m.checked=!0,p&&(p.classList.remove("hidden"),p.style.display="block")),ia()):o&&(o.classList.add("hidden"),o.style.display="none"),ye()});const u=document.getElementById("stage-editor-race-is-stage-race");u&&u.addEventListener("change",()=>{ia()});const f=document.getElementById("stage-editor-race-num-stages");f&&f.addEventListener("input",()=>{ia()});const g=document.getElementById("stage-editor-race-start-date");g&&g.addEventListener("change",()=>{const R=g.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(R)){const I=document.getElementById("stage-editor-race-is-stage-race"),_=I?Number(I.value)===1:!1,P=v("stage-editor-race-end-date");if(P)if(!_)P.value=R;else{const D=document.getElementById("stage-editor-race-num-stages"),G=D&&Number(D.value)||1,[B,q,te]=R.split("-").map(Number),ae=new Date(B,q-1,te);let M=0;G===21?M=2:G>=14&&(M=1);const z=G+M;ae.setDate(ae.getDate()+z-1);const V=ae.getFullYear(),U=String(ae.getMonth()+1).padStart(2,"0"),X=String(ae.getDate()).padStart(2,"0");P.value=`${V}-${U}-${X}`}}}),m&&m.addEventListener("change",()=>{m.checked?p&&(p.classList.remove("hidden"),p.style.display="block"):p&&(p.classList.add("hidden"),p.style.display="none"),ye()});const h=v("stage-editor-programs-dropdown-trigger"),b=v("stage-editor-programs-dropdown-menu"),y=v("btn-stage-editor-programs-ok");h&&b&&(h.addEventListener("click",R=>{R.stopPropagation();const I=b.style.display==="none"||!b.style.display;b.style.display=I?"flex":"none"}),y&&y.addEventListener("click",R=>{R.stopPropagation(),b.style.display="none",ye()}),document.addEventListener("click",R=>{const I=R.target;b.style.display==="flex"&&!b.contains(I)&&I!==h&&!h.contains(I)&&(b.style.display="none",ye())}));const k=v("stage-editor-programs-list");k&&k.addEventListener("change",R=>{R.target.name==="stage-editor-program-selection"&&Ep()});let T=!1,x=null;const $=v("stage-editor-stage-id"),N=v("stage-editor-race-id");if($&&N){[$,N].forEach(I=>{I.addEventListener("keydown",_=>{_.key==="ArrowUp"||_.key==="ArrowDown"?(T=!1,x&&clearTimeout(x)):(T=!0,x&&clearTimeout(x))}),I.addEventListener("keyup",_=>{_.key!=="ArrowUp"&&_.key!=="ArrowDown"&&(x&&clearTimeout(x),x=setTimeout(()=>{T=!1},150))}),I.addEventListener("mousedown",()=>{T=!1}),I.addEventListener("blur",()=>{T=!1})});const R=(I,_)=>{const P=Number(I.value);if(!Number.isInteger(P)||P<=0){_==="stage"?ua=P:ma=P;return}const G=P-(_==="stage"?ua:ma);if(!T&&(G===1||G===-1)){let B=P;_==="stage"?B=Dp(P,G):v("stage-editor-new-race-checkbox").checked&&(B=Lp(P,G)),I.value=String(B)}_==="stage"?ua=Number(I.value):ma=Number(I.value)};$.addEventListener("input",()=>{R($,"stage"),ye()}),N.addEventListener("input",()=>{R(N,"race"),ye()})}const E=v("stage-editor-hide-boring-segments-checkbox");E&&E.addEventListener("change",()=>{d.stageEditorHideBoringSegments=E.checked,ye()})}let xt=[],oa=null,Ye={form:!0,combinedFatigue:!0,shortFatigue:!1,longFatigue:!1};const ea=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"],Wi={1:{pref:[1,2],malus:[4,7],neutral:[3,5,6]},2:{pref:[3,5],malus:[2,7],neutral:[1,4,6]},3:{pref:[4,7],malus:[2,5],neutral:[1,3,6]},4:{pref:[6,7],malus:[2,5],neutral:[1,3,4]},5:{pref:[1,5],malus:[6,7],neutral:[2,3,4]},6:{pref:[1,3],malus:[4,7],neutral:[2,5,6]},7:{pref:[3,4],malus:[2,7],neutral:[1,5,6]}},Vi={1:"Sonnig",2:"Extreme Hitze",3:"Leichter Regen",4:"Starkregen",5:"Starker Wind",6:"Dichter Nebel",7:"Schnee/Eis"};function ja(e,t){if(e==null)return"";const a=t?S(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const oe={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function qr(e,t,a){const r=dt(e??null);return`<span class="badge badge-race-category" style="${Za(r)}; white-space: nowrap; display: inline-block;">${S(e??"Unbekannt")}</span>`}function Tn(e){if(!e)return"-";const t=dt(e);return`<span class="badge badge-race-category" style="${Za(t)}; white-space: nowrap; display: inline-block;">${S(e)}</span>`}function og(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function lg(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${og(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function fe(e,t,a,r,s,n,i){const l=t?`background: ${a}; border: 1px solid transparent; color: ${r}; box-shadow: 0 0 8px ${s}; font-weight: 700;`:"background: var(--bg-800); border: 1px solid var(--border); color: var(--text-300);";return`
    <button type="button"
      class="results-type-btn"
      ${n}="${S(i)}"
      style="width: 120px; height: 24px; padding: 0; font-size: 0.8rem; font-weight: ${t?"700":"500"}; line-height: 22px; text-align: center; border-radius: 999px; transition: all 0.15s ease; cursor: pointer; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ${l}"
      onmouseenter="if(!${t}) this.style.borderColor='${s}'"
      onmouseleave="if(!${t}) this.style.borderColor='var(--border)'"
    >${S(e)}</button>
  `}function wn(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";case"breakaway_final":return"is-breakaway";default:return""}}function ms(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";case"breakaway_final":return"Ausreißer";default:return"Etappe"}}function dg(e){return`<span class="rider-stats-final-type ${wn(e)}">${S(ms(e))}</span>`}function he(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?r+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?r+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?r+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?r+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?r+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(r+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function Ne(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?r+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?r+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?r+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?r+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?r+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?r+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(r+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function cg(e){return`${e.startDate===e.endDate?ce(e.startDate):`${ce(e.startDate)} - ${ce(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function Xr(e){if(e==null||d.riders.length===0)return null;const a=[...d.riders].sort((r,s)=>(s.seasonPoints??0)-(r.seasonPoints??0)||(s.seasonWins??0)-(r.seasonWins??0)||s.overallRating-r.overallRating||`${r.lastName} ${r.firstName}`.localeCompare(`${s.lastName} ${s.firstName}`,"de")||r.id-s.id).findIndex(r=>r.id===e);return a>=0?a+1:null}function Ui(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;case"breakaway_final":return 4;default:return 5}}function ug(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||Ui(t.rowType)-Ui(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function mg(e){return[...e].map(t=>({...t,rows:ug(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function Rl(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(50,Math.min(85,e));for(let c=1;c<t.length;c++){const o=t[c-1],m=t[c];if(s<=m.score){const p=(s-o.score)/(m.score-o.score);a=Math.round(o.hue+(m.hue-o.hue)*p),r=Math.round(o.lightness+(m.lightness-o.lightness)*p);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function Et(e,t,a,r){const s=r>0?Math.max(0,Math.min(1,a/r)):.5,n=Math.round(6+s*118),i=.26+s*.18,l=.14+s*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${l};`}" title="${S(t)}">${e} ${a}</span>`}function Is(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";case"Flat":return"Flachlandspezialist";default:return e}return e.name}function Cs(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return oe.mountain;case"Hill":return oe.hilly;case"Sprint":return oe.sprint;case"Timetrial":return oe.timetrial;case"Cobble":return oe.cobble;case"Attacker":return oe.attacker;case"Flat":return oe.flat;default:return""}}function qe(e,t,a,r,s){var F,j,O;const n=(t==null?void 0:t.countryCode)??r??null,i=n?de(n):s,l=(t==null?void 0:t.roleName)??((F=e==null?void 0:e.role)==null?void 0:F.name)??"Ohne Rolle",c=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,o=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,m=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",p=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",u=((j=t==null?void 0:t.program)==null?void 0:j.name)??((O=e==null?void 0:e.seasonProgram)==null?void 0:O.name)??"-",f=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,g=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,h=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0;(t==null?void 0:t.rolling30dRaceDays)??(e==null||e.rolling30dRaceDays);const b=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,y=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,k=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",T=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,x=(t==null?void 0:t.currentSeasonRank)??Xr((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),$=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,N=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,E=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,R=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},I=Math.max(R.flat,R.hilly,R.mediumMountain,R.mountain,R.timetrial,R.cobble),_=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},P=Math.max(_.stageRace,_.oneDay),D=e!=null&&e.specialization1?Is(e.specialization1):"-",G=e!=null&&e.specialization2?Is(e.specialization2):"-",B=e!=null&&e.specialization3?Is(e.specialization3):"-",q=Cs((e==null?void 0:e.specialization1)??null),te=Cs((e==null?void 0:e.specialization2)??null),ae=Cs((e==null?void 0:e.specialization3)??null),M=(e==null?void 0:e.weatherProfileId)??(t==null?void 0:t.weatherProfileId)??1,z=Wi[M]||Wi[1],V=z.pref[0],U=z.pref[1],X=Vi[V],A=Vi[U];let L="";return t!=null&&t.lieutenantInfo?L=`
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.lieutenantInfo.name)}</a></span></span>
    `:t!=null&&t.leaderInfo&&(L=`
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.leaderInfo.name)}</a></span></span>
    `),`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${S(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${o?Mt(o,m):""} <span>${S(m)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${S(l)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${un(p)} <span>Form</span></span>
        ${L}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${Rl(c)}</span>
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
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${oe.rank} <span class="rider-stats-icon-pill-value">${lg(x)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${oe.raceDays} <span class="rider-stats-icon-pill-value">${$}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${oe.wins} <span class="rider-stats-icon-pill-value">${N}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${q} ${S(D)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${te} ${S(G)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${ae} ${S(B)}</span>
        <span class="rider-stats-icon-pill" title="Wetterpräferenzen" style="display: inline-flex; align-items: center; gap: 4px; padding: 0.2rem 0.6rem;">🌤️ ${ja(V,X)} ${ja(U,A)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${Et(oe.stageRace,"Rundfahrten Punkte",_.stageRace,P)}
        ${Et(oe.oneDay,"Eintagesrennen Punkte",_.oneDay,P)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${oe.breakaway} <span class="rider-stats-icon-pill-value">${E}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${Et(oe.flat,"Flach-Punkte",R.flat,I)}
        ${Et(oe.hilly,"Hügel-Punkte",R.hilly,I)}
        ${Et(oe.mediumMountain,"Mittelgebirge-Punkte",R.mediumMountain,I)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${Et(oe.mountain,"Hochgebirge-Punkte",R.mountain,I)}
        ${Et(oe.timetrial,"Zeitfahren-Punkte",R.timetrial,I)}
        ${Et(oe.cobble,"Kopfsteinpflaster-Punkte",R.cobble,I)}
      </div>
    </div>
  `}function Yi(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",r=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${S(a)} <strong>${S(r)}</strong>`}function Xe(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${d.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${d.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${d.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${d.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${d.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${d.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${d.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-rider-stats-tab="contracts" aria-selected="${d.riderStatsTab==="contracts"?"true":"false"}">Verträge</button>
    </div>`}function pg(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(55,Math.min(80,e));for(let c=1;c<t.length;c++){const o=t[c-1],m=t[c];if(s<=m.score){const p=(s-o.score)/(m.score-o.score);a=Math.round(o.hue+(m.hue-o.hue)*p),r=Math.round(o.lightness+(m.lightness-o.lightness)*p);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function gg(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},r=["mountain","hill","sprint","timeTrial","cobble","attack"],s=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,l=n/2,c=i/2,o=160,m=60,p=85,u=p-m,f=P=>{const D=[];for(let G=0;G<6;G++){const B=G*Math.PI/3-Math.PI/2;D.push(`${l+P*Math.cos(B)},${c+P*Math.sin(B)}`)}return D},g=`
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
    </defs>`,h=`<circle cx="${l}" cy="${c}" r="${o+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let b="";for(let P=m;P<=p;P+=2.5){const D=o*((P-m)/u);if(D<1){b+=`<circle cx="${l}" cy="${c}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const G=f(D),B=P%5===0,q=B?1:.6,te=B?"none":"4,4",ae=B?.4:.18;b+=`<polygon points="${G.join(" ")}" fill="none" stroke="rgba(255,255,255,${ae})" stroke-width="${q}" stroke-dasharray="${te}" />`,B&&P>m&&(b+=`<text x="${l+5}" y="${c-D+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${P}</text>`)}let y="",k="";for(let P=0;P<6;P++){const D=P*Math.PI/3-Math.PI/2,G=l+o*Math.cos(D),B=c+o*Math.sin(D);y+=`<line x1="${l}" y1="${c}" x2="${G}" y2="${B}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const q=o+28,te=l+q*Math.cos(D),ae=c+q*Math.sin(D),M=Math.cos(D);let z="middle";M>.15?z="start":M<-.15&&(z="end");const V=a[r[P]]??m;k+=`<text x="${te}" y="${ae}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${z}" dominant-baseline="middle">${s[P]}</text>`,k+=`<text x="${te}" y="${ae+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${z}" dominant-baseline="middle">${V}</text>`}const T=[],x=[];r.forEach((P,D)=>{const G=a[P]??m,B=o*((Math.max(m,Math.min(p,G))-m)/u),q=D*Math.PI/3-Math.PI/2,te=l+B*Math.cos(q),ae=c+B*Math.sin(q);T.push(`${te},${ae}`),x.push(`<circle cx="${te}" cy="${ae}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${s[D]}: ${G}</title></circle>`)});const $=`<polygon points="${T.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,E=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((P,D)=>{const G=a[P.key]??60;return(a[D.key]??60)-G}),R=[],I=[];E.forEach((P,D)=>{const G=a[P.key]??60,B=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${P.label}</span>
        ${pg(G)}
      </div>
    `;D%2===0?R.push(B):I.push(B)});const _=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${R.join("")}</div>
      <div class="skills-col">${I.join("")}</div>
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
  `}function fg(e,t){const a=t.shortTermFatigueMalus??0,r=t.longTermFatigueDecayable??0,s=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,l=(a/.2).toFixed(1).replace(".",","),c=(r/.01).toFixed(0);let o="#fff";t.shortTermFatigueWarning==="critical"?o="#ef4444":t.shortTermFatigueWarning==="warning"&&(o="#fbbf24");const m=t.fatigueHistory??[];let p="";return m.length===0?p='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':p=m.map(u=>{const f=ce(u.date);let g="";u.type==="race"?g=`${S(u.raceName)}${u.stageNumber!=null?` - Etappe ${u.stageNumber}`:""}`:g=u.raceName?S(u.raceName):"Regeneration";const h=u.type==="race"&&u.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${u.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let b="";u.shortChange>0?b=`<span style="color: #ef4444; font-weight: 600;">+${u.shortChange.toFixed(2).replace(".",",")}</span>`:u.shortChange<0?b=`<span style="color: #2ecc71; font-weight: 600;">${u.shortChange.toFixed(2).replace(".",",")}</span>`:b='<span style="color: #666;">0,00</span>';const y=[];if(u.longDecayableChange!==0){const x=u.longDecayableChange>0?"+":"",$=u.longDecayableChange>0?"#ef4444":"#2ecc71";y.push(`<span style="color: ${$}; font-weight: 500;">${x}${u.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(u.longLockedChange!==0){const x=u.longLockedChange>0?"+":"",$=u.longLockedChange>0?"#a855f7":"#2ecc71";y.push(`<span style="color: ${$}; font-weight: 500;">${x}${u.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const k=y.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${y.join("")}</div>`:'<span style="color: #666;">0,00</span>',T=u.shortAfter+u.longAfter;return`
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
            <div style="font-size: 1.6rem; font-weight: 700; color: ${o}; margin-bottom: 0.25rem;">
              -${a.toFixed(2).replace(".",",")} <span style="font-size: 0.85rem; font-weight: 400; color: #888;">Abzug</span>
            </div>
            <div style="font-size: 0.8rem; color: #aaa;">
              Erholungszeit: <strong style="color: #fff;">${l} Tage</strong> (ohne Belastung)
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
  `}function hg(e){var X;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((A,L)=>L%2===0),r=((X=d.gameState)==null?void 0:X.currentDate)??new Date().toISOString(),s=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(r).getUTCFullYear(),n=new Date(Date.UTC(s,0,1)).getTime(),i=864e5,l=1260,c=384,o=40,m=20,p=a.map(A=>{const F=(new Date(A.date).getTime()-n)/i,j=o+F/365*l,O=m+c-Math.min(8,Math.max(0,A.totalForm))/8*c;return{x:j,y:O,form:A.totalForm,date:A.date}});let u="",f="",g="";Ye.form&&p.length>0&&(u=`M ${p.map(A=>`${A.x},${A.y}`).join(" L ")}`,f=p.map(A=>`<circle cx="${A.x}" cy="${A.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${A.date}): ${A.form}</title></circle>`).join(""),g=`${u} L ${p[p.length-1].x},${m+c} L ${p[0].x},${m+c} Z`);let h="",b="";if(Ye.combinedFatigue&&p.length>0){const A=a.map(F=>{const O=(new Date(F.date).getTime()-n)/i,w=o+O/365*l,C=(F.shortFatigue??0)+(F.longFatigue??0),J=m+c-Math.min(25,Math.max(0,C))/25*c;return{x:w,y:J,val:C,date:F.date}});h=`<path d="${`M ${A.map(F=>`${F.x},${F.y}`).join(" L ")}`}" fill="none" stroke="#ef4444" stroke-width="2" />`,b=A.map(F=>`<circle cx="${F.x}" cy="${F.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${F.date}): ${F.val.toFixed(2)}</title></circle>`).join("")}let y="",k="";if(Ye.shortFatigue&&p.length>0){const A=a.map(F=>{const O=(new Date(F.date).getTime()-n)/i,w=o+O/365*l,C=F.shortFatigue??0,J=m+c-Math.min(25,Math.max(0,C))/25*c;return{x:w,y:J,val:C,date:F.date}});y=`<path d="${`M ${A.map(F=>`${F.x},${F.y}`).join(" L ")}`}" fill="none" stroke="#facc15" stroke-width="2" />`,k=A.map(F=>`<circle cx="${F.x}" cy="${F.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${F.date}): ${F.val.toFixed(2)}</title></circle>`).join("")}let T="",x="";if(Ye.longFatigue&&p.length>0){const A=a.map(F=>{const O=(new Date(F.date).getTime()-n)/i,w=o+O/365*l,C=F.longFatigue??0,J=m+c-Math.min(25,Math.max(0,C))/25*c;return{x:w,y:J,val:C,date:F.date}});T=`<path d="${`M ${A.map(F=>`${F.x},${F.y}`).join(" L ")}`}" fill="none" stroke="#a855f7" stroke-width="2" />`,x=A.map(F=>`<circle cx="${F.x}" cy="${F.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${F.date}): ${F.val.toFixed(2)}</title></circle>`).join("")}const $="rgba(251, 191, 36, 0.15)";let N="";for(let A=0;A<=8;A+=2){const L=m+c-A/8*c;N+=`<line x1="${o}" y1="${L}" x2="${o+l}" y2="${L}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,N+=`<text x="${o-5}" y="${L+4}" fill="#ffffff" font-size="10" text-anchor="end">${A}</text>`}for(let A=0;A<=25;A+=5){const L=m+c-A/25*c;N+=`<text x="${o+l+5}" y="${L+4}" fill="#ef4444" font-size="10" text-anchor="start">${A}</text>`}let E="";for(let A=0;A<=52;A+=5){const L=o+A/52*l;N+=`<line x1="${L}" y1="${m}" x2="${L}" y2="${m+c}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,E+=`<text x="${L}" y="${m+c+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${A}</text>`}let R="",I="";if(e.peakDates){const A=[...e.peakDates].sort((L,F)=>new Date(L).getTime()-new Date(F).getTime());for(let L=0;L<A.length;L++){const F=A[L],O=(new Date(F).getTime()-n)/i,w=o+O/365*l;R+=`<line x1="${w}" y1="${m}" x2="${w}" y2="${m+c}" stroke="#ffffff" stroke-width="2"><title>Peak: ${F}</title></line>`;const C=L>0?(new Date(A[L-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,J=O-56,re=C+14,Q=Math.max(0,Math.max(J,re)),we=O-Q,me=o+Q/365*l,Se=we/365*l;I+=`<rect x="${me}" y="${m}" width="${Se}" height="${c}" fill="rgba(16, 185, 129, 0.1)" />`;const Oe=14/365*l;I+=`<rect x="${w}" y="${m}" width="${Oe}" height="${c}" fill="rgba(239, 68, 68, 0.1)" />`}}const P=(new Date(r).getTime()-n)/i,D=o+P/365*l;R+=`<line x1="${D}" y1="${m}" x2="${D}" y2="${m+c}" stroke="#ef4444" stroke-width="3"><title>Heute: ${r}</title></line>`,xt.forEach((A,L)=>{const F=ea[L%ea.length];A.peakDates&&A.peakDates.forEach(j=>{const w=(new Date(j).getTime()-n)/i,C=o+w/365*l;R+=`<line x1="${C}" y1="${m}" x2="${C}" y2="${m+c}" stroke="${F}" stroke-width="1.5" stroke-dasharray="3,3"><title>${A.riderName} Peak: ${j}</title></line>`})});let G="",B="";xt.forEach((A,L)=>{const F=ea[L%ea.length],j=A.formHistory.filter((O,w)=>w%2===0).map(O=>{const C=(new Date(O.date).getTime()-n)/i,J=o+C/365*l,re=m+c-Math.min(8,Math.max(0,O.totalForm))/8*c;return{x:J,y:re,form:O.totalForm,date:O.date}});if(j.length>0){const O=`M ${j.map(w=>`${w.x},${w.y}`).join(" L ")}`;G+=`<path d="${O}" fill="none" stroke="${F}" stroke-width="2" />`,B+=j.map(w=>`<circle cx="${w.x}" cy="${w.y}" r="3" fill="#fff" stroke="${F}" stroke-width="2"><title>${A.riderName} (${w.date}): ${w.form}</title></circle>`).join("")}});const q=d.teams.filter(A=>A.division==="WorldTour"||A.divisionName==="WorldTour");let te='<option value="">-- Team auswählen --</option>';for(const A of q){const L=oa===A.id?" selected":"";te+=`<option value="${A.id}"${L}>${S(A.name)}</option>`}let ae='<option value="">-- Fahrer auswählen --</option>';if(oa!=null){const A=d.riders.filter(L=>L.activeTeamId===oa&&L.id!==e.riderId&&!xt.some(F=>F.riderId===L.id));for(const L of A)ae+=`<option value="${L.id}">${S(L.firstName)} ${S(L.lastName)}</option>`}const M=`
    <div class="rider-compare-controls" style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-primary);">
      <span style="font-weight: 600; color: var(--text-100); font-size: 0.95rem;">Mit anderem Fahrer vergleichen:</span>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-team-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Team (Tier 1):</label>
        <select id="rider-compare-team-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);">
          ${te}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-rider-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Fahrer:</label>
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${oa==null?"disabled":""}>
          ${ae}
        </select>
      </div>
    </div>
  `,z=e.currentSeasonRank??Xr(e.riderId)??"–",V=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(e.riderName)} (${e.currentSeasonPoints}/${z})">${S(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${z})</span></span>
    </div>
    `];xt.forEach((A,L)=>{const F=ea[L%ea.length],j=A.currentSeasonRank??Xr(A.riderId)??"–";V.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${F}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(A.riderName)} (${A.currentSeasonPoints}/${j})">${S(A.riderName)} <span style="color: var(--text-500);">(${A.currentSeasonPoints}/${j})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${A.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const U=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      
      <!-- Chart Line Toggle Checkboxes -->
      <div class="chart-line-toggles" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-form" ${Ye.form?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-combined-fatigue" ${Ye.combinedFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #ef4444;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
          Gesamtfatigue (0-25)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-short-fatigue" ${Ye.shortFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #facc15;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #facc15; border-radius: 50%;"></span>
          Kurzzeitfatigue (0-25)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-long-fatigue" ${Ye.longFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #a855f7;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #a855f7; border-radius: 50%;"></span>
          Langzeitfatigue (0-25)
        </label>
      </div>

      <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-500); font-weight: bold; margin-bottom: 0.5rem; letter-spacing: 0.5px;">Fahrer</div>
      ${V.join("")}
    </div>
  `;return`
    <section class="rider-stats-form-tab">
      <div class="rider-stats-season-head">
        <h3>Formverlauf (Saison ${s})</h3>
      </div>
      ${M}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${I}
            ${N}
            ${E}
            ${R}
            ${g?`<path d="${g}" fill="${$}" />`:""}
            ${u?`<path d="${u}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${f}
            ${h}
            ${b}
            ${y}
            ${k}
            ${T}
            ${x}
            ${G}
            ${B}
          </svg>
        </div>
        ${U}
      </div>
    </section>
  `}function bg(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
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
                <td>${S(gs(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${r?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(s=a.country)!=null&&s.code3?de(a.country.code3):"–"}</td>
                <td><strong>${S(a.name)}</strong></td>
                <td>${ps(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function Mn(e){const t=new Set;if(e.jerseysWorn){const i=e.jerseysWorn.split(",").map(l=>l.trim()).filter(Boolean);for(const l of i)t.add(l)}const a=new Map;if(e.eventIds){const i=e.eventIds.split("|");for(const l of i){const[c,o]=l.split(":");c&&a.set(c,o?parseInt(o,10):1)}}const r=[{type:"jersey",key:"yellow",label:"Gelbes Trikot (Gesamtwertung)",colorClass:"jersey-dot-yellow"},{type:"jersey",key:"green",label:"Grünes Trikot (Punktewertung)",colorClass:"jersey-dot-green"},{type:"jersey",key:"red",label:"Bergtrikot (Bergwertung)",colorClass:"jersey-dot-red"},{type:"jersey",key:"white",label:"Weißes Trikot (Nachwuchswertung)",colorClass:"jersey-dot-white"},{type:"jersey",key:"purple",label:"Lila Trikot (Aktivste Fahrer)",colorClass:"jersey-dot-purple-worn"},{type:"event",key:"3",label:"Superform",colorClass:"event-dot-3"},{type:"event",key:"4",label:"Supermalus",colorClass:"event-dot-4"},{type:"event",key:"1",label:"Sturz",colorClass:"event-dot-1"},{type:"event",key:"2",label:"Defekt",colorClass:"event-dot-2"},{type:"event",key:"7",label:"Heimvorteil",colorClass:"event-dot-7"},{type:"event",key:"8",label:"Heimbonus",colorClass:"event-dot-8"},{type:"event",key:"9",label:"Heimmalus",colorClass:"event-dot-9"},{type:"event",key:"5",label:"Attacken",colorClass:"event-dot-5"},{type:"event",key:"6",label:"Konterattacken",colorClass:"event-dot-6"}],s=[],n=[];for(const i of r)if(i.type==="jersey")t.has(i.key)&&(s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${S(i.label)}</span>
          </div>
        `));else{const l=a.get(i.key);if(l!==void 0&&l>0){const c=l>1?` (${l}x)`:"";s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
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
  `}function Jt(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${S(e)}</span>`}function yg(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function vg(e){return e.finishStatus==="otl"?Jt("OTL","place"):e.finishStatus==="dnf"?Jt("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${S(String(e.resultRank))}</span>`}function Sg(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":Jt(String(e.gcRank),"gc")}function kg(e){return e.finishStatus==="otl"?Br(e.statusReason,!0):e.finishStatus==="dnf"?Br(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${za(e.stageTimeSeconds)}`:e.resultLabel}function Pe(e,t,a=!1){var f,g,h;const r=(e==null?void 0:e.activeTeamId)!=null?((f=d.teams.find(b=>b.id===e.activeTeamId))==null?void 0:f.name)??null:null,s=((g=e==null?void 0:e.country)==null?void 0:g.code3)??(e==null?void 0:e.nationality)??null,n=s?de(s):"",i=t==null?[]:[...t.seasons].map(b=>({...b,raceBlocks:mg(b.raceBlocks)})).sort((b,y)=>y.season-b.season);if(a)return`
      ${qe(e,t,r,s,n)}
      ${Xe(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`;if(!t)return`
      ${qe(e,t,r,s,n)}
      ${Xe(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`;if(d.riderStatsTab==="skills")return`
      ${qe(e,t,r,s,n)}
      ${Xe(t)}
      ${gg(e)}`;if(d.riderStatsTab==="fatigue")return`
      ${qe(e,t,r,s,n)}
      ${Xe(t)}
      ${fg(e,t)}`;if(d.riderStatsTab==="program")return`
      ${qe(e,t,r,s,n)}
      ${Xe(t)}
      ${bg(t)}`;if(d.riderStatsTab==="form")return`
      ${qe(e,t,r,s,n)}
      ${Xe(t)}
      ${hg(t)}`;if(d.riderStatsTab==="topResults")return`
      ${qe(e,t,r,s,n)}
      ${Xe(t)}
      ${xg(t)}`;if(d.riderStatsTab==="career")return`
      ${qe(e,t,r,s,n)}
      ${Xe(t)}
      ${wg(t)}`;if(d.riderStatsTab==="contracts")return`
      ${qe(e,t,r,s,n)}
      ${Xe(t)}
      ${Tg(t)}`;const l=((h=d.gameState)==null?void 0:h.season)??2026,c=Array.from(new Set([l,...i.map(b=>b.season)])).sort((b,y)=>y-b);(d.riderStatsSelectedSeason===null||!c.includes(d.riderStatsSelectedSeason))&&(d.riderStatsSelectedSeason=l);const o=d.riderStatsSelectedSeason,m=i.find(b=>b.season===o);if(t.seasons.length===0)return`
      ${qe(e,t,r,s,n)}
      ${Xe(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`;const p=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.02); padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <h3 style="margin: 0; font-size: 1rem; color: #fff;">Rennergebnisse</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-stats-results-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500; margin: 0;">Saison filtern:</label>
        <select id="rider-stats-results-season-select" class="form-control" style="background: #222; border: 1px solid #444; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer; width: auto; display: inline-block;">
          ${c.map(b=>`<option value="${b}" ${b===o?"selected":""}>Saison ${b}</option>`).join("")}
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
                <p>${S(cg(b))}</p>
              </div>
              ${qr(b.raceCategoryName,b.isStageRace,b.rows.filter(y=>y.rowType==="stage_result").length||null)}
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
                  ${b.rows.map(y=>{const k=y.rowType!=="stage_result",T=k?`${y.raceName} · ${ms(y.rowType)}`:y.stageNumber&&y.isStageRace?`${y.raceName} · Etappe ${y.stageNumber}`:y.raceName;return`
                      <tr class="rider-stats-row${k?" rider-stats-row-final":""}">
                        <td>${S(ce(y.date))}</td>
                        <td>${vg(y)}</td>
                        <td>${Sg(y)}</td>
                        <td class="rider-stats-breakaway-col">${yg(y)}</td>
                        <td>${k?"":ja(y.rolledWeatherId,y.rolledWetterName)}</td>
                        <td>${k?dg(y.rowType):qr(y.raceCategoryName?y.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):y.raceCategoryName,y.isStageRace)}</td>
                        <td>${S(T)}</td>
                        <td class="status-cell">${Mn(y)}</td>
                        <td>${k?"–":y.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${y.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${rr(y.profile)}</button>`:"–"}</td>
                        <td>${k?"-":y.distanceKm!=null?S(y.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                        <td>${k?"-":y.elevationGainMeters!=null?S(String(Math.round(y.elevationGainMeters))):"–"}</td>
                        <td>${S(kg(y))}</td>
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
      <p>Dieser Fahrer hat in der Saison ${o} keine Rennen bestritten.</p>
    </section>
  `;return`
    ${qe(e,t,r,s,n)}
    ${Xe(t)}
    ${p}
    ${u}
  `}function js(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(d.riderStatsTab)?(e.style.minWidth="min(1475px, 95vw)",e.style.maxWidth="1687px"):(e.style.minWidth="",e.style.maxWidth="")}function Fs(e,t){let a="var(--text-200)",r="rgba(255, 255, 255, 0.05)";return t===1?(a="#fbbf24",r="rgba(251, 191, 36, 0.1)"):t===2?(a="#cbd5e1",r="rgba(203, 213, 225, 0.1)"):t===6?(a="#4ade80",r="rgba(74, 222, 128, 0.1)"):t===3?(a="#c084fc",r="rgba(192, 132, 252, 0.1)"):t===4?(a="#38bdf8",r="rgba(56, 189, 248, 0.1)"):t===5&&(a="#fb923c",r="rgba(251, 146, 60, 0.1)"),`<span style="color: ${a}; background: ${r}; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.05); font-weight: bold; font-size: 0.85rem; display: inline-block; line-height: 1;">${S(e)}</span>`}async function ka(e){var m,p,u,f,g;const t=Ce(e);(t==null?void 0:t.activeTeamId)!=null&&((m=d.teams.find(h=>h.id===t.activeTeamId))==null||m.name),xt=[],oa=null,d.riderStatsSelectedRiderId=e,d.riderStatsTab="results",d.riderStatsSelectedSeason=((p=d.gameState)==null?void 0:p.season)??2026,js(),d.riderStatsTopResultsFilterCategory=null,d.riderStatsTopResultsFilterSeason=null,d.riderStatsTopResultsFilterRank=null,d.riderStatsTopResultsFilterProfile=null,d.riderStatsTopResultsPage=1,v("rider-stats-title").innerHTML=Yi(t,null),v("rider-stats-jersey").innerHTML="";const a=t?Fs(((u=t.role)==null?void 0:u.name)??"Fahrer",t.roleId??null):"Fahrer",r=t!=null&&t.age?` · <span style="color: #fbbf24; font-weight: 600;">Alter ${t.age}</span>`:"";v("rider-stats-meta").innerHTML=t?`${a}${r}`:"Historie wird geladen",v("rider-stats-body").innerHTML=Pe(t,null,!0),ft("riderStats");const s=await Y.getRiderStats(e);if(d.riderStatsSelectedRiderId!==e)return;if(!s.success||!s.data){const h=t?Fs(((f=t.role)==null?void 0:f.name)??"Fahrer",t.roleId??null):"Fahrer",b=t!=null&&t.age?` · <span style="color: #fbbf24; font-weight: 600;">Alter ${t.age}</span>`:"";v("rider-stats-meta").innerHTML=t?`${h}${b}`:"Fehler beim Laden",v("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>`;return}d.riderStatsPayload=s.data,js(),v("rider-stats-title").innerHTML=Yi(t,s.data),v("rider-stats-jersey").innerHTML="";const n=s.data.age?s.data.age:t!=null&&t.age?t.age:null,i=n?` · <span style="color: #fbbf24; font-weight: 600;">Alter ${n}</span>`:"",l=s.data.mentorName?` · Mentor: ${s.data.mentorName}`:"",c=s.data.mentoredRiderNames&&s.data.mentoredRiderNames.length>0?` · Mentor von: ${s.data.mentoredRiderNames.join(" - ")}`:"",o=Fs(((g=t==null?void 0:t.role)==null?void 0:g.name)??"Fahrer",(t==null?void 0:t.roleId)??null);v("rider-stats-meta").innerHTML=`${o}${i} · ${s.data.seasons.length} Saisons${l}${c}`,v("rider-stats-body").innerHTML=Pe(t,s.data,!1)}function $g(){v("rider-stats-body").addEventListener("click",e=>{var i;const t=e.target.closest("button[data-top-results-rank]");if(t){const l=t.dataset.topResultsRank,c=l==="all"?null:Number(l);d.riderStatsTopResultsFilterRank=d.riderStatsTopResultsFilterRank===c?null:c,d.riderStatsTopResultsPage=1;const o=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(o,d.riderStatsPayload,!1);return}const a=e.target.closest("button[data-top-results-filter]");if(a){const l=a.dataset.topResultsFilter;d.riderStatsTopResultsFilters[l]=!d.riderStatsTopResultsFilters[l],d.riderStatsTopResultsPage=1;const c=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(c,d.riderStatsPayload,!1);return}if(e.target&&e.target.id&&e.target.id.startsWith("toggle-chart-")){const l=e.target.id,c=e.target.checked;l==="toggle-chart-form"?Ye.form=c:l==="toggle-chart-combined-fatigue"?Ye.combinedFatigue=c:l==="toggle-chart-short-fatigue"?Ye.shortFatigue=c:l==="toggle-chart-long-fatigue"&&(Ye.longFatigue=c);const o=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(o,d.riderStatsPayload,!1);return}const r=e.target.closest("button[data-rider-stats-tab]");if(!r){const l=e.target.closest("button[data-remove-compare-id]");if(l){const m=Number(l.dataset.removeCompareId);xt=xt.filter(u=>u.riderId!==m);const p=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(p,d.riderStatsPayload,!1);return}const c=e.target.closest("button[data-top-results-page]");if(c){const m=Number(c.dataset.topResultsPage);if(!isNaN(m)&&m>=1){d.riderStatsTopResultsPage=m;const p=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(p,d.riderStatsPayload,!1)}return}const o=e.target.closest("button[data-stage-profile-id]");if(o){const m=Number(o.dataset.stageProfileId);Number.isFinite(m)&&es(m);return}return}const s=r.dataset.riderStatsTab;if(s!=="results"&&s!=="program"&&s!=="form"&&s!=="topResults"&&s!=="skills"&&s!=="career"&&s!=="fatigue"&&s!=="contracts"||s==="program"&&(((i=d.riderStatsPayload)==null?void 0:i.programRaces.length)??0)===0)return;d.riderStatsTab=s,js();const n=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(n,d.riderStatsPayload,!1)}),v("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){d.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,d.riderStatsTopResultsPage=1;const a=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){d.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),d.riderStatsTopResultsPage=1;const a=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-profile"){d.riderStatsTopResultsFilterProfile=t.value==="all"?null:t.value,d.riderStatsTopResultsPage=1;const a=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-results-season-select"){d.riderStatsSelectedSeason=Number(t.value);const a=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(a,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;oa=a?Number(a):null;const r=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(r,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const r=Number(a);if(xt.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const s=await Y.getRiderStats(r,!0);s.success&&s.data?xt.push({riderId:s.data.riderId,riderName:s.data.riderName,teamId:s.data.teamId,teamName:s.data.teamName,formHistory:s.data.formHistory??[],peakDates:s.data.peakDates??[],currentSeasonPoints:s.data.currentSeasonPoints??0,currentSeasonRank:s.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(s.error??""));const n=Ce(d.riderStatsSelectedRiderId);v("rider-stats-body").innerHTML=Pe(n,d.riderStatsPayload,!1)}}})}function Zi(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function xg(e){const t=[];for(const g of e.seasons)for(const h of g.raceBlocks)for(const b of h.rows)t.push({...b,season:g.season,isStageRace:h.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,h)=>g.localeCompare(h,"de"));const r=Array.from(new Set(t.map(g=>g.season))).sort((g,h)=>h-g);let s=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?d.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?d.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?d.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?d.riderStatsTopResultsFilters.youth:g.rowType==="breakaway_final"?d.riderStatsTopResultsFilters.breakaway:!0:g.isStageRace?d.riderStatsTopResultsFilters.stage:d.riderStatsTopResultsFilters.oneDay);if(d.riderStatsTopResultsFilterCategory){const g=d.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const h=g.substring(0,g.length-8);s=s.filter(b=>b.raceCategoryName===h&&b.rowType==="stage_result")}else if(g.endsWith("-gc")){const h=g.substring(0,g.length-3);s=s.filter(b=>b.raceCategoryName===h&&b.rowType!=="stage_result")}else s=s.filter(h=>h.raceCategoryName===g)}d.riderStatsTopResultsFilterSeason!=null&&(s=s.filter(g=>g.season===d.riderStatsTopResultsFilterSeason)),d.riderStatsTopResultsFilterRank!=null&&!isNaN(d.riderStatsTopResultsFilterRank)&&(s=s.filter(g=>g.resultRank!=null&&g.resultRank<=d.riderStatsTopResultsFilterRank)),d.riderStatsTopResultsFilterProfile&&(s=s.filter(g=>g.profile===d.riderStatsTopResultsFilterProfile)),s.sort((g,h)=>{if(h.seasonPoints!==g.seasonPoints)return h.seasonPoints-g.seasonPoints;const b=g.rowType!=="stage_result",y=h.rowType!=="stage_result",k=g.resultRank??9999,T=h.resultRank??9999;if(d.riderStatsTopResultsFilterCategory)return k!==T?k-T:b!==y?b?-1:1:0;{const x=Zi(g.raceCategoryName),$=Zi(h.raceCategoryName);return x!==$?x-$:b!==y?b?-1:1:k-T}});const n=200,i=s.slice(0,1e3),l=Math.max(1,Math.ceil(i.length/n));d.riderStatsTopResultsPage>l&&(d.riderStatsTopResultsPage=l);const c=(d.riderStatsTopResultsPage-1)*n,o=i.slice(c,c+n),p=`
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
          ${fe("Siege",d.riderStatsTopResultsFilterRank===1,"linear-gradient(135deg, #fbbf24, #d4af37)","#000","rgba(251, 191, 36, 0.4)","data-top-results-rank","1")}
        </div>
        <div style="grid-row: 2; grid-column: 1;">
          ${fe("Top 3",d.riderStatsTopResultsFilterRank===3,"linear-gradient(135deg, #e2e8f0, #94a3b8)","#000","rgba(148, 163, 184, 0.4)","data-top-results-rank","3")}
        </div>

        <!-- Column 2: Top 5 / Top 10 -->
        <div style="grid-row: 1; grid-column: 2;">
          ${fe("Top 5",d.riderStatsTopResultsFilterRank===5,"linear-gradient(135deg, #d97706, #b45309)","#fff","rgba(217, 119, 6, 0.4)","data-top-results-rank","5")}
        </div>
        <div style="grid-row: 2; grid-column: 2;">
          ${fe("Top 10",d.riderStatsTopResultsFilterRank===10,"linear-gradient(135deg, #a16207, #78350f)","#fff","rgba(161, 98, 7, 0.4)","data-top-results-rank","10")}
        </div>

        <!-- Column 3: GC / [Empty] -->
        <div style="grid-row: 1; grid-column: 3;">
          ${fe("GC",d.riderStatsTopResultsFilters.gc,"linear-gradient(135deg, #facc15, #ca8a04)","#000","rgba(234, 179, 8, 0.4)","data-top-results-filter","gc")}
        </div>
        <div style="grid-row: 2; grid-column: 3;">
          <!-- Empty for GC single layout -->
        </div>

        <!-- Column 4: Punkte / Berg -->
        <div style="grid-row: 1; grid-column: 4;">
          ${fe("Punkte",d.riderStatsTopResultsFilters.points,"linear-gradient(135deg, #4ade80, #16a34a)","#fff","rgba(74, 222, 128, 0.4)","data-top-results-filter","points")}
        </div>
        <div style="grid-row: 2; grid-column: 4;">
          ${fe("Berg",d.riderStatsTopResultsFilters.mountain,"linear-gradient(135deg, #f87171, #dc2626)","#fff","rgba(239, 68, 68, 0.4)","data-top-results-filter","mountain")}
        </div>

        <!-- Column 5: Nachwuchs / Ausreißer -->
        <div style="grid-row: 1; grid-column: 5;">
          ${fe("Nachwuchs",d.riderStatsTopResultsFilters.youth,"linear-gradient(135deg, #ffffff, #e2e8f0)","#0f172a","rgba(255, 255, 255, 0.4)","data-top-results-filter","youth")}
        </div>
        <div style="grid-row: 2; grid-column: 5;">
          ${fe("Ausreißer",d.riderStatsTopResultsFilters.breakaway,"linear-gradient(135deg, #c084fc, #7c3aed)","#fff","rgba(168, 85, 247, 0.4)","data-top-results-filter","breakaway")}
        </div>

        <!-- Column 6: Etappen / One Day -->
        <div style="grid-row: 1; grid-column: 6;">
          ${fe("Etappen",d.riderStatsTopResultsFilters.stage,"linear-gradient(135deg, #60a5fa, #2563eb)","#fff","rgba(59, 130, 246, 0.4)","data-top-results-filter","stage")}
        </div>
        <div style="grid-row: 2; grid-column: 6;">
          ${fe("One Day",d.riderStatsTopResultsFilters.oneDay,"linear-gradient(135deg, #b91c1c, #7f1d1d)","#fff","rgba(185, 28, 28, 0.4)","data-top-results-filter","oneDay")}
        </div>
      </div>
    </div>
  `,u=o.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(g=>{const h=g.rowType!=="stage_result",b=h?`${g.raceName} · ${ms(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let y="–",k="–";g.finishStatus==="otl"?y=Jt("OTL","place"):g.finishStatus==="dnf"?y=Jt("DNF","place"):g.resultRank==null||(h?k=`<span class="rider-stats-final-type ${wn(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:y=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${S(String(g.resultRank))}</span>`);const T=h?"–":g.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${g.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${rr(g.profile)}</button>`:"–",x=!h&&g.stageScore!=null&&g.stageScore>0?us(g.stageScore,0,350):"–",$=qr(g.raceCategoryName?g.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${h?" rider-stats-row-final":""}">
            <td>${y}</td>
            <td>${k}</td>
            <td><strong>${S(b)}</strong>${h?"":ja(g.rolledWeatherId,g.rolledWetterName)}</td>
            <td class="status-cell">${Mn(g)}</td>
            <td>${T}</td>
            <td>${x}</td>
            <td>${$}</td>
            <td>Saison ${g.season}</td>
            <td><strong>${g.seasonPoints}</strong></td>
          </tr>
        `}).join(""),f=l>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${d.riderStatsTopResultsPage-1}" ${d.riderStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        <span style="font-weight: 600; color: #ccc;">Seite ${d.riderStatsTopResultsPage} von ${l}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-top-results-page="${d.riderStatsTopResultsPage+1}" ${d.riderStatsTopResultsPage===l?"disabled":""}>Weiter &raquo;</button>
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
  `}function Tg(e){var n,i,l,c,o;const t=(e==null?void 0:e.contracts)||[];if(t.length===0)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Vertragsdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden keine Verträge in der Datenbank erfasst.</p>
      </section>
    `;const a=((n=d.gameState)==null?void 0:n.season)??2026,r=[];for(const m of t)for(let p=m.startSeason;p<=m.endSeason;p++){let u=null;p>a?u="-":p===a?u=(e==null?void 0:e.roleName)||((l=(i=e==null?void 0:e.seasonRoles)==null?void 0:i.find(g=>g.season===p))==null?void 0:l.roleName)||"-":u=((o=(c=e==null?void 0:e.seasonRoles)==null?void 0:c.find(g=>g.season===p))==null?void 0:o.roleName)||"-";const f=p===a?'<span style="color: #22c55e; font-weight: bold;">Aktiv</span>':p>a?'<span style="color: #60a5fa; font-weight: bold;">Zukünftig</span>':'<span style="color: #94a3b8;">Abgelaufen</span>';r.push({season:p,teamId:m.teamId,teamName:m.teamName,roleName:u,statusText:f})}return r.sort((m,p)=>p.season-m.season),`
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
  `}function wg(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,superteamCount:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const l=i.raceDays??i.race_days??i.racedays??0;return n+Number(l)},0),r=(n,i,l,c)=>{const o=typeof n=="number"?n:parseFloat(String(n))||0;let m="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return o===0?m+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?m+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?m+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?m+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?m+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?m+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?m+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?m+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(m+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${m}" title="${S(l)}">${n}</span>`},s=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
                ${Tn(n.key)}
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
                  ${he(i.winFlat||0,"flat","Flach (Flat)")}
                  ${he(i.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${he(i.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${he(i.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${he(i.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${he(i.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${he(i.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${he(i.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${he(i.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${he(i.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${he(i.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${Ne(i.winWeather1||0,1,"Sonnig")}
                  ${Ne(i.winWeather2||0,2,"Extreme Hitze")}
                  ${Ne(i.winWeather3||0,3,"Leichter Regen")}
                  ${Ne(i.winWeather4||0,4,"Starkregen")}
                  ${Ne(i.winWeather5||0,5,"Starker Wind")}
                  ${Ne(i.winWeather6||0,6,"Dichter Nebel")}
                  ${Ne(i.winWeather7||0,7,"Schnee/Eis")}
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
  `}window.openRiderStatsFromRiderStats=ka;const Mg=250,ta=1200,Rg=250,Ig=1200,Ji=.2;class Cg{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",r=>{var i,l,c,o;const s=r.target.closest("button[data-race-sim-action]");if(s){if(s.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const p=((l=this.engine)==null?void 0:l.getSnapshot())??this.detailSnapshot;p&&((o=(c=this.options).onFinishRequested)==null||o.call(c,p,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=r.target.closest("button[data-race-sim-speed]");if(n){const m=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(m))return;this.timeMultiplier=m,this.render()}}),this.elements.messages.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-group-rider-id]");if(s){const c=this.resolveRiderIdFromGroupButton(s);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),ka(c));return}const n=r.target.closest("button[data-race-sim-group-rider-name]");if(n){const c=this.resolveRiderIdFromGroupButton(n);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),ka(c));return}const i=r.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const l=i.dataset.raceSimMessageFilter;l&&(this.messageFilter=l,this.holdOverviewInteraction(),xi(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",r=>{const s=r.target.closest("[data-race-sim-overview-summary]");if(s){const n=s.dataset.raceSimOverviewSummary,i=s.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(r)}),this.elements.groupBox.addEventListener("click",r=>{this.handleGroupInteraction(r)}),this.elements.profile.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-timing-mode]");if(!s)return;const n=s.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+ta,this.render())})}handleGroupInteraction(t){var m,p;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const u=this.resolveRiderIdFromGroupButton(a);u!=null&&this.selectGroupByRiderId(u,this.detailSnapshot);return}const r=t.target.closest("button[data-race-sim-group-nav]");if(!r)return;const s=this.buildRaceGroups(this.detailSnapshot);if(s.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,s.findIndex(u=>u.label===n)),l=r.dataset.raceSimGroupNav==="prev"?-1:1,c=(i+l+s.length)%s.length,o=((m=s[c])==null?void 0:m.label)??n;this.selectGroupByLabel(o,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",u=>{const f=u.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+ta)}),this.elements.profile.addEventListener("wheel",u=>{const f=u.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+ta)},{passive:!0}),this.elements.profile.addEventListener("scroll",u=>{const f=u.target;!(f instanceof HTMLElement)||!f.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+ta)},!0),(p=this.elements.sidebar.parentElement)==null||p.addEventListener("click",u=>{if(!this.bootstrap||!this.detailSnapshot||!Lm(this.elements.sidebar,u.target))return;const g=performance.now(),h=Bi(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(h);const b=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",b),this.scheduleSidebarPaintTelemetry(g,b),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new Zo(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const r=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(r),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(s=>this.frame(s));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const r=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-r),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(s=>this.frame(s))}render(t=performance.now(),a=!1){var f;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const r=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",s=Ad(this.bootstrap.stageSummary),n=[`${s.segmentCount} Segmente`,s.sprintCount>0?`${s.sprintCount} Sprint${s.sprintCount===1?"":"s"}`:null,s.climbCount>0?`${s.climbCount} Bergwertung${s.climbCount===1?"":"en"}`:null].filter(g=>g!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},l=this.bootstrap.stage.rolledWeatherId,c=l!=null?i[l]??"":"",o=c?` · ${c}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${r}${n?` · ${n}`:""}${o}`;const m=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=Mg,p=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,u=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=Rg;if(m||p||u){const g=performance.now();this.detailSnapshot=((f=this.engine)==null?void 0:f.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-g)}if(m&&this.detailSnapshot){const g=this.elements.profile.querySelector(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop);const h=performance.now();jd(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-h),this.lastProfileRenderTime=t;const b=this.elements.profile.querySelector(".race-sim-timing-scroll");b&&(b.scrollTop=this.timingScrollTop)}if(p&&this.detailSnapshot){this.lastSidebarRenderTime=t;const g=performance.now(),h=Bi(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(h);const b=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",b),this.scheduleSidebarPaintTelemetry(g,b)}u&&this.detailSnapshot&&(xi(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),Sm(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),fm(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),$i(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const r=a.find(s=>s.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(r)return r.label}return this.selectedGroupLabel!=null&&a.some(r=>r.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return pn(mn(t.clusters))}resolveInitialGroupLabel(t){var a,r;return((a=t.find(s=>s.label==="P"))==null?void 0:a.label)??((r=t[0])==null?void 0:r.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(r=>[r.riderId,r]));return[...t.riderIds].sort((r,s)=>{var n,i;return(((n=a.get(r))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(s))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||r-s})[0]??null}selectGroupByLabel(t,a,r=!0){const s=this.buildRaceGroups(a),n=s.find(i=>i.label===t)??s.find(i=>i.label==="P")??s[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),r&&(this.profileInteractionHoldUntilMs=performance.now()+ta,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const s=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;s&&(this.selectedGroupLabel=s.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+ta,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+Ig,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const r=t.dataset.raceSimGroupRiderName;if(!r)return null;const s=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===r&&(s==null||i.activeTeamId===s))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const r=this.perfTelemetry[t];this.perfTelemetry[t]=r<=0?a:r*(1-Ji)+a*Ji}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const r=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(r!==this.sidebarPaintSequence)return;const s=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",s),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||$i(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const mt="__stage_overview__",Il="__non_finishers__",Cl="__events__",Fl="__roster__";let Ue="all";function Rn(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function qi(e){return Rn(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function Fg(e){return[...e].sort((t,a)=>qi(t)-qi(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function Eg(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=Rn(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function Pg(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function Ng(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${ce(t.date)}`}async function Ws(e,t){var s;const a=Ga(e);if(a&&(d.selectedResultsRaceId=a.race.id,d.selectedResultsStageId=e),d.riders.length===0){const n=await Y.getRiders();n.success&&(d.riders=n.data??[])}const r=await Y.getStageResults(e);if(!r.success){d.stageResults=null,_e(),!t&&r.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+r.error);return}d.stageResults=r.data??null,d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId,d.selectedResultTypeId=((s=d.stageResults.classifications[0])==null?void 0:s.resultTypeId)??1,d.selectedResultsMarkerKey=mt,d.selectedResultsSpecialView=null),d.selectedResultsRaceId!=null&&El(d.selectedResultsRaceId),_e()}async function El(e){if(!d.seasonStandings){const a=await Y.getSeasonStandings();a.success&&a.data&&(d.seasonStandings=a.data)}const t=await Y.getRaceResultsRoster(e);t.success&&t.data?d.resultsRoster=t.data:d.resultsRoster=null}function Dg(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function Xi(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function Lg(){const e=d.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=Gt(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=[...e.entries].sort((b,y)=>y.overallRating-b.overallRating),s=new Set(r.slice(0,5).map(b=>b.riderId)),n=b=>{var k;const y=d.riders.find(T=>T.id===b);return((k=y==null?void 0:y.skills)==null?void 0:k.sprint)??0},l=[...e.entries.filter(b=>!s.has(b.riderId))].sort((b,y)=>{const k=n(b.riderId),T=n(y.riderId);return T!==k?T-k:y.overallRating-b.overallRating}),c=new Set(l.slice(0,5).map(b=>b.riderId));function o(b){switch(b){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return b}}const m=new Map;for(const b of e.entries){const y=b.teamId;m.has(y)||m.set(y,{teamId:b.teamId,teamName:b.teamName,riders:[],avgRating:0}),m.get(y).riders.push(b)}for(const b of m.values())b.avgRating=b.riders.reduce((y,k)=>y+k.overallRating,0)/b.riders.length;const p=b=>{let y=Number.POSITIVE_INFINITY;for(const k of b)!k.hasDropped&&k.gcRank!=null&&k.gcRank<y&&(y=k.gcRank);return y},u=b=>{var k;if(!((k=d.seasonStandings)!=null&&k.riderStandings))return 0;let y=0;for(const T of b){const x=d.seasonStandings.riderStandings.find($=>$.riderId===T.riderId);x&&x.points>y&&(y=x.points)}return y},f=b=>{if(b==null)return 0;const y=nn(b);if(y.length===0)return 0;const k=y.map(x=>x.overallRating??0);k.sort((x,$)=>$-x);const T=k.slice(0,10);return T.length===0?0:T.reduce((x,$)=>x+$,0)/T.length},g=[...m.values()].sort((b,y)=>{const k=p(b.riders),T=p(y.riders);if((k!==Number.POSITIVE_INFINITY||T!==Number.POSITIVE_INFINITY)&&k!==T)return k-T;const x=u(b.riders),$=u(y.riders);if((x>0||$>0)&&x!==$)return $-x;const N=f(b.teamId),E=f(y.teamId);return Math.abs(N-E)>1e-4?E-N:(b.teamName??"").localeCompare(y.teamName??"","de")});for(const b of g)b.riders.sort((y,k)=>Xi(y.roleId)-Xi(k.roleId)||k.overallRating-y.overallRating||y.lastName.localeCompare(k.lastName,"de"));return`<div class="results-roster-grid">${g.map(b=>{const y=b.teamId!=null?Mt(b.teamId,b.teamName):"",k=b.riders.map(x=>{var X;const $=Dg(x.roleId),N=x.countryCode?He[x.countryCode]??x.countryCode.slice(0,2).toLowerCase():null,E=N?`<span class="fi fi-${N} results-roster-flag" title="${S(x.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',R=`${x.firstName.charAt(0)}. ${x.lastName}`,I=x.roleName??"–",_=x.specialization1?o(x.specialization1):null,P=x.specialization2?o(x.specialization2):null;let D=I;_&&(D+=` · ${_}`),P&&(D+=` · ${P}`);const G=`<span class="results-roster-overall-badge" style="color:${_g(x.overallRating)}" title="Gesamtstärke: ${x.overallRating.toFixed(2)}">${x.overallRating.toFixed(2)}</span>`,B=x.hasDropped?" dropped":"";let q="";x.hasDropped?x.dropoutStatus==="dns"?q="DNS":x.dropoutStatus==="dnf"?q=((X=x.dropoutReason)==null?void 0:X.startsWith("OTL"))??!1?"OTL":"DNF":q="OUT":x.gcRank!=null&&(q=`${x.gcRank}`);let te="";if(x.hasDropped)te=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${S(x.dropoutReason||"")}">${q}</span>`;else if(x.gcRank!=null){let A="rider-stats-rank-badge-gc";x.gcRank===1?A="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":x.gcRank===2?A="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":x.gcRank===3&&(A="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),te=`<span class="rider-stats-rank-badge ${A}" title="GC Stand: Platz ${x.gcRank}">${x.gcRank}</span>`}const M=`style="color: ${x.hasDropped?"var(--text-500)":$.color}; font-weight: bold;"`,z=s.has(x.riderId),V=c.has(x.riderId);return`<div class="results-roster-rider${B}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${E}
            <span class="results-roster-name${z?" strongest-rider":V?" best-sprinter":""}">
              ${De(R,{riderId:x.riderId,teamId:x.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${Er(x.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${M}>${S(D)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${te||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${G}
        </div>
      </div>`}).join(""),T=b.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${y}</div>
        <div class="results-roster-team-name" title="${S(b.teamName??"–")}">${rt(b.teamName??"–",b.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${T})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${k}</div>
    </div>`}).join("")}</div>`}function _g(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function Ag(e){var o,m;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(o=d.stageResults)==null?void 0:o.classifications.find(p=>p.resultTypeId===1),a=new Set(t?t.rows.map(p=>p.riderId).filter(p=>p!=null):[]),r=d.riders.filter(p=>p.activeTeamId===e.teamId&&a.has(p.id)),s=new Set((((m=d.stageResults)==null?void 0:m.nonFinishers)??[]).map(p=>p.riderId)),n=[];for(const p of r){if(p.id===e.riderId||s.has(p.id))continue;let u=0;const f=p.skills.sprint>=72,g=p.skills.flat>=78,h=p.skills.timeTrial>=76,b=p.skills.acceleration>=80;if(f&&u++,g&&u++,h&&u++,b&&u++,u>0){let y=1;u===2?y=1.25:u===3?y=1.5:u===4&&(y=2),n.push({id:p.id,firstName:p.firstName,lastName:p.lastName,countryCode:p.nationality??null,isSprinter:f,multiplier:y,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const p=n.filter(b=>b.isSprinter).reduce((b,y)=>b+y.multiplier,0),u=n.filter(b=>!b.isSprinter).reduce((b,y)=>b+y.multiplier,0);let f=0,g=0;p>0&&u>0?(f=i/(2.125*p+u),g=2.125*f,f=Math.max(.1,Math.min(.3,f)),g=Math.max(.25,Math.min(.6,g))):p>0?(g=i/p,g=Math.max(.25,Math.min(.6,g)),f=g/2.125):u>0&&(f=i/u,f=Math.max(.1,Math.min(.3,f)),g=2.125*f);for(const b of n)b.contribution=b.isSprinter?g*b.multiplier:f*b.multiplier;const h=n.reduce((b,y)=>b+y.contribution,0);if(h>0){const b=i/h;for(const y of n)y.contribution*=b}n.sort((b,y)=>y.contribution-b.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const l=i.toFixed(2).replace(".",","),c=n.map(p=>{const u=pt(At(p.id)??p.countryCode),f=p.firstName?`${p.firstName.charAt(0)}. ${p.lastName}`:p.lastName,g=p.contribution.toFixed(2).replace(".",",");return`
      <div class="leadout-bonus-popover-grid">
        <span class="results-flag-col-cell">${u}</span>
        <span class="leadout-bonus-rider-name">${S(f)}</span>
        <strong>+${g}</strong>
      </div>
    `}).join("");return`
    <div class="leadout-bonus-popover">
      <div class="leadout-bonus-popover-card">
        <div class="leadout-bonus-popover-head">
          <strong>Leadout-Bonus Details (Gesamt: +${l})</strong>
        </div>
        <div class="leadout-bonus-popover-grid leadout-bonus-popover-grid-head">
          <span>Land</span>
          <span>Fahrer</span>
          <span>Beitrag</span>
        </div>
        ${c}
      </div>
    </div>
  `}function Qi(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function Er(e){var p,u,f,g,h,b,y,k,T,x;if(e==null||!d.stageResults)return"";const t=Gt(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=d.stageResults.classifications,s=(u=(p=r.find($=>$.resultTypeId===Da))==null?void 0:p.rows.find($=>$.rank===1))==null?void 0:u.riderId,n=(g=(f=r.find($=>$.resultTypeId===Ar))==null?void 0:f.rows.find($=>$.rank===1))==null?void 0:g.riderId,i=(b=(h=r.find($=>$.resultTypeId===rn))==null?void 0:h.rows.find($=>$.rank===1))==null?void 0:b.riderId,l=(k=(y=r.find($=>$.resultTypeId===5))==null?void 0:y.rows.find($=>$.rank===1))==null?void 0:k.riderId,c=(x=(T=r.find($=>$.resultTypeId===7))==null?void 0:T.rows.find($=>$.rank===1))==null?void 0:x.riderId,o=[],m=d.selectedResultTypeId;return e===s&&(m===Da||m===1&&a||m!==1&&m!==Da)&&o.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&o.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&o.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===l&&o.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===c&&o.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>'),o.length===0?"":`<span class="jersey-dots-wrapper">${o.join("")}</span>`}function eo(e){if(!e)return"";let t=e;const a=[],r=[...d.riders].sort((n,i)=>{const l=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-l.length});for(const n of r){const l=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),c=new RegExp(`${l}(\\s+\\(\\d+\\.\\))?`,"g");c.test(t)&&(t=t.replace(c,o=>{const m=`__RIDER_LINK_${a.length}__`,p=De(o,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(p),m}))}let s=S(t);for(let n=0;n<a.length;n++)s=s.replace(`__RIDER_LINK_${n}__`,a[n]);return s}function _e(){var L,F,j,O;d.riders.length===0&&Y.getRiders().then(w=>{w.success&&w.data&&(d.riders=w.data,_e())});const e=v("results-race-select"),t=v("results-stage-select"),a=v("results-type-tabs"),r=v("results-marker-tabs"),s=v("results-stage-meta"),n=v("results-empty"),i=v("results-table"),l=i.querySelector("thead tr"),c=v("results-tbody"),o=v("results-marker-classifications"),m=v("results-roster"),p=i.querySelector("colgroup");p&&p.remove(),i.style.tableLayout="",d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+d.races.filter(w=>{var C;return(((C=w.stages)==null?void 0:C.length)??0)>0}).map(w=>`<option value="${w.id}"${w.id===d.selectedResultsRaceId?" selected":""}>${S(w.name)}</option>`).join("");const u=Gt(d.selectedResultsRaceId),f=u==null?"":(u.stages??[]).map(w=>`<option value="${w.id}"${w.id===d.selectedResultsStageId?" selected":""}>${S(Ng(u,w))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+f;const g=((L=d.stageResults)==null?void 0:L.classifications.filter(w=>!(u&&!u.isStageRace&&w.resultTypeId!==1&&w.resultTypeId!==6)))??[],h=g.find(w=>w.resultTypeId===d.selectedResultTypeId)??g[0]??null,b=d.selectedResultsSpecialView==="nonFinishers",y=d.selectedResultsSpecialView==="events",k=d.selectedResultsSpecialView==="roster";if(h&&!b&&!y&&!k&&(d.selectedResultTypeId=h.resultTypeId),y){i.style.tableLayout="fixed";const w=document.createElement("colgroup");w.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(w,i.firstChild)}if(!d.stageResults&&!k||!h&&!b&&!y&&!k){const w=Ga(d.selectedResultsStageId);s.textContent=w?`${w.race.name} · ${w.stage.profile} · ${ce(w.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",r.innerHTML="",r.classList.add("hidden"),c.innerHTML="",o.innerHTML="",o.classList.add("hidden"),i.classList.add("hidden"),m.innerHTML="",m.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=d.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}k?d.resultsRoster&&(s.textContent=`${d.resultsRoster.raceName} · Starterfeld`):d.stageResults&&(s.textContent=`${d.stageResults.raceName} · Etappe ${d.stageResults.stageNumber} · ${d.stageResults.profile} · ${ce(d.stageResults.date)}`);const T=d.stageResults?Ga(d.stageResults.stageId):null,x=(T==null?void 0:T.stage.distanceKm)??null,$=new Map,N=new Map,E=new Map;if(d.stageResults){const w=d.stageResults.classifications.find(C=>C.resultTypeId===1);if(w)for(const C of w.rows)C.riderId!=null&&C.points!=null&&C.points>0&&$.set(C.riderId,C.points),C.riderId!=null&&C.breakawayKms!=null&&C.breakawayKms>0&&E.set(C.riderId,C.breakawayKms);if(d.stageResults.markerClassifications){for(const C of d.stageResults.markerClassifications)if(Rn(C.markerType,C.markerCategory)){for(const J of C.entries)if(J.riderId!=null&&J.pointsAwarded!=null&&J.pointsAwarded>0){const re=N.get(J.riderId)??0;N.set(J.riderId,re+J.pointsAwarded)}}}}const R=(h==null?void 0:h.resultTypeId)===Da,I=(h==null?void 0:h.resultTypeId)===Ar||(h==null?void 0:h.resultTypeId)===rn,_=(h==null?void 0:h.resultTypeId)===5,P=(h==null?void 0:h.resultTypeId)===6,D=(h==null?void 0:h.resultTypeId)===7,G=R||I||_||P||D,B=g.map(w=>`
    <button
      type="button"
      class="results-type-btn${!b&&!y&&!k&&w.resultTypeId===d.selectedResultTypeId?" active":""}"
      data-result-type-id="${w.resultTypeId}"
    >${S(w.resultTypeName)}</button>
  `),q=`
    <button
      type="button"
      class="results-type-btn${b?" active":""}"
      data-results-special-view="${Il}"
    >OTL/DNF</button>
  `,te=`
    <button
      type="button"
      class="results-type-btn${y?" active":""}"
      data-results-special-view="${Cl}"
    >Ereignisse</button>
  `,ae=`
    <button
      type="button"
      class="results-type-btn${k?" active":""}"
      data-results-special-view="${Fl}"
    >Teilnehmer</button>
  `,M=g.findIndex(w=>w.resultTypeName.toLocaleLowerCase("de").includes("team"));M>=0?B.splice(M+1,0,q,te,ae):B.push(q,te,ae),a.innerHTML=B.join("");const z=Fg(((F=d.stageResults)==null?void 0:F.markerClassifications)??[]);if(k){m.innerHTML=Lg(),m.classList.remove("hidden"),i.classList.add("hidden"),r.innerHTML="",r.classList.add("hidden"),o.innerHTML="",o.classList.add("hidden"),n.classList.add("hidden");return}else m.innerHTML="",m.classList.add("hidden");const V=!b&&!y&&!k&&(h==null?void 0:h.resultTypeId)===1&&z.length>0,U=V?d.selectedResultsMarkerKey??mt:null,X=V&&U!==mt?z.find(w=>w.markerKey===U)??null:null;if(V&&(d.selectedResultsMarkerKey=(X==null?void 0:X.markerKey)??mt),y){const w=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"},{key:"superteam",label:"Superteam"}];r.innerHTML=w.map(C=>`
      <button
        type="button"
        class="results-type-btn${C.key===Ue?" active":""}"
        data-event-filter="${C.key}"
      >${S(C.label)}</button>
    `).join("")}else r.innerHTML=V?[`
        <button
          type="button"
          class="results-type-btn${d.selectedResultsMarkerKey===mt?" active":""}"
          data-marker-key="${mt}"
        >Tageswertung</button>`,...z.map(w=>`
        <button
          type="button"
          class="results-type-btn${w.markerKey===d.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${w.markerKey}"
        >${S(Eg(w))}</button>
      `)].join(""):"";r.classList.toggle("hidden",!y&&!V);const A=b||y||!V||d.selectedResultsMarkerKey===mt;if(l&&A&&(l.innerHTML=b?`
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
      `:R?`
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
      `:I?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Punkte</th>
          <th>UCI Punkte</th>
        `:D?`
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
      `),c.innerHTML=b?(((j=d.stageResults)==null?void 0:j.nonFinishers)??[]).map(w=>`
      <tr>
        <td>${w.stageNumber}</td>
        <td>${ko(w.isOtl)}</td>
        <td class="results-jersey-col-cell">${ra(w.teamId,w.teamName)}</td>
        <td>${sa(w.riderName,!0,!1,w.riderId,w.teamId)}</td>
        <td class="results-flag-col-cell">${pt(w.countryCode)}</td>
        <td>${rt(w.teamName||"–",w.teamId)}</td>
        <td>${S(Br(w.statusReason,w.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':y?[...((O=d.stageResults)==null?void 0:O.events)??[]].filter(w=>Ue==="all"?!0:Ue==="form"?!!(w.title&&(w.title.includes("guten Tag")||w.title.includes("schlechten Tag")||w.title.includes("Formhöhepunkt")||w.title.includes("Formhoehepunkt"))):Ue==="attack"?(w.type==="attack"||w.type==="counter_attack")&&!(w.title&&(w.title.toLowerCase().includes("ausreiß")||w.title.toLowerCase().includes("ausreiss"))):Ue==="breakaway"?!!(w.title&&(w.title.toLowerCase().includes("ausreiß")||w.title.toLowerCase().includes("ausreiss"))):Ue==="incident"?(w.type==="incident"||!!(w.title&&w.title.includes("Massensturz")))&&!(w.title&&(w.title.toLowerCase().includes("ausreiß")||w.title.toLowerCase().includes("ausreiss"))):Ue==="exit"?w.type==="dnf"||!!(w.title&&w.title.includes("nicht am Start")):Ue==="home"?!!(w.title&&(w.title.includes("Heimvorteil")||w.title.includes("Heimdruck"))):Ue==="weather"?!!(w.title&&w.title.startsWith("Wetterbericht:")):Ue==="superteam"?w.type==="superteam":!0).sort((w,C)=>{const J=w.kmMark??0,re=C.kmMark??0;if(Math.abs(J-re)>1e-4)return J-re;if(J===0){const me=Qi(w),Se=Qi(C);if(me!==Se)return me-Se}const Q=w.riderName??"",we=C.riderName??"";return Q.localeCompare(we,"de")}).map(w=>{var ue,Me,je;const C=w.kmMark!=null?`${w.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",J=w.riderId,re=J!=null?Ce(J):null,Q=w.riderTeamId??(re==null?void 0:re.activeTeamId)??null,we=Q!=null?((ue=d.teams.find(Le=>Le.id===Q))==null?void 0:ue.name)??null:null;let me=ra(Q,we);const Se=!!(w.title&&w.title.startsWith("Wetterbericht:"));let Oe=w.title||"";if(Se){const Le=(Me=d.stageResults)==null?void 0:Me.rolledWeatherId,$e=(je=d.stageResults)==null?void 0:je.rolledWetterName;me=`<span class="results-jersey-cell">${ja(Le,$e)}</span>`,$e&&(Oe=`Wetterbericht: ${$e}`)}const ct=w.type==="superteam",H=ct&&J==null,K=Se||H?"":pt(J!=null?At(J):null),W=Se?"":H?rt(we||"–",Q):J!=null?sa(w.riderName??"",!0,!1,J,Q):S(w.riderName||"–");let Z="";return w.title&&w.title.includes("guten Tag")?Z='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':w.title&&w.title.includes("schlechten Tag")?Z='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':w.title&&(w.title.includes("Formhöhepunkt")||w.title.includes("Formhoehepunkt"))?Z='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':w.title&&w.title.includes("nicht am Start")?Z='<span class="event-badge event-badge-dns">DNS</span>':w.title&&w.title.includes("Massensturz")?Z='<span class="event-badge event-badge-masscrash">Massensturz</span>':w.type==="dnf"?Z='<span class="event-badge event-badge-dnf">DNF</span>':w.title&&(w.title.toLowerCase().includes("ausreiß")||w.title.toLowerCase().includes("ausreiss"))?Z='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':w.type==="attack"?Z='<span class="event-badge event-badge-attack">Attacke</span>':w.type==="counter_attack"?Z='<span class="event-badge event-badge-counter">Konterattacke</span>':w.type==="incident"?w.title&&(w.title.toLowerCase().includes("defekt")||w.title.toLowerCase().includes("panne")||w.title.toLowerCase().includes("technisch"))?Z='<span class="event-badge event-badge-defect">Defekt</span>':Z='<span class="event-badge event-badge-crash">Sturz</span>':w.title&&w.title.includes("Super-Heimvorteil")?Z='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>':w.title&&w.title.includes("Heimdruck")?Z='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>':w.title&&w.title.includes("Heimvorteil")?Z='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':w.title&&w.title.startsWith("Wetterbericht:")?Z='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>':ct&&(Z='<span class="event-badge event-badge-superteam"><span class="event-icon">⚡</span> Superteam</span>'),`
          <tr>
            <td>${C}</td>
            <td>
              <div class="event-rider-info">
                ${me}
                ${K}
                ${W}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${eo(Oe)}</span>
                  ${Z}
                </div>
                ${w.detail?`<div class="event-detail">${eo(w.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':A&&h?h.rows.map(C=>{const J=C.riderName??C.teamName,re=C.riderName?C.teamName:"–",Q=ra(C.teamId,C.teamName),we=sa(J,!0,C.isBreakaway===!0,C.riderId,C.teamId),me=pt(At(C.riderId)),Se=h.resultTypeId===1&&C.rank===1&&C.timeSeconds!=null&&x!=null,Oe=C.timeSeconds!=null?`${za(C.timeSeconds)}${Se?` (${Pg(x,C.timeSeconds)})`:""}`:"–",ct=G?`<td class="results-gc-delta-cell">${Hr(C.previousRank,C.rankDelta)}</td>`:"";if(I){let K=C.points!=null?String(C.points):"–";if(C.points!=null&&C.riderId!=null&&h){const Z=h.resultTypeId===Ar?$.get(C.riderId)??0:N.get(C.riderId)??0;Z>0&&(K+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${Z}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(C.rank,3)}">${C.rank}</td>
            ${ct}
            <td class="results-jersey-col-cell">${Q}</td>
            <td>${we}${Er(C.riderId)}</td>
            <td class="results-flag-col-cell">${me}</td>
            <td>${rt(re,C.teamId)}</td>
            <td class="results-points-cell">${K}</td>
            <td>${C.uciPoints!=null?C.uciPoints:"–"}</td>
          </tr>`}if(D){let K=C.breakawayKms!=null?`${C.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if(C.breakawayKms!=null&&C.riderId!=null){const W=E.get(C.riderId)??0;W>0&&(K+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${W.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min(C.rank,3)}">${C.rank}</td>
            ${ct}
            <td class="results-jersey-col-cell">${Q}</td>
            <td>${we}${Er(C.riderId)}</td>
            <td class="results-flag-col-cell">${me}</td>
            <td>${rt(re,C.teamId)}</td>
            <td class="results-points-cell">${K}</td>
            <td>${C.uciPoints!=null?C.uciPoints:"–"}</td>
          </tr>`}if(P)return`
          <tr>
            <td class="pos-${Math.min(C.rank,3)}">${C.rank}</td>
            ${ct}
            <td class="results-jersey-col-cell">${Q}</td>
            <td>${rt(C.teamName,C.teamId)}</td>
            <td class="results-flag-col-cell">${me}</td>
            <td>${Oe}</td>
            <td>${S(Rr(C.gapSeconds))}</td>
            <td>${C.uciPoints!=null?C.uciPoints:"–"}</td>
          </tr>`;let H=C.points!=null?String(C.points):"–";if(C.leadoutBonus!=null&&C.leadoutBonus>0&&C.leadoutRiderId!=null){const K=Ag(C);H=`
          <div class="leadout-bonus-anchor">
            ${C.points!=null?C.points:"–"}
            ${K}
          </div>
        `}return`
            <tr>
              <td class="pos-${Math.min(C.rank,3)}">${C.rank}</td>
              ${ct}
              <td class="results-jersey-col-cell">${Q}</td>
              <td>${we}${Er(C.riderId)}</td>
              <td class="results-flag-col-cell">${me}</td>
              <td>${rt(re,C.teamId)}</td>
              <td>${Oe}</td>
              <td>${S(Rr(C.gapSeconds))}</td>
              <td class="results-points-cell">${H}</td>
              <td>${C.uciPoints!=null?C.uciPoints:"–"}</td>
            </tr>`}).join(""):"",n.classList.toggle("hidden",!!h||b||y||k),i.classList.toggle("hidden",!A||k),X){const w=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${S($o(X.markerType,X.markerLabel))}</h4>
          <div class="results-marker-card-meta">${S(`${X.kmMark.toFixed(1).replace(".",",")} km${X.markerCategory?` · Kat. ${X.markerCategory}`:""}`)}</div>
        </div>
      </section>`,J=X.entries.map(re=>{var Se;const Q=Ce(re.riderId),we=Q?`${Q.firstName} ${Q.lastName}`:`Fahrer ${re.riderId}`,me=(Q==null?void 0:Q.activeTeamId)!=null?((Se=d.teams.find(Oe=>Oe.id===Q.activeTeamId))==null?void 0:Se.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${re.rank}.</div>
          <div class="results-marker-jersey">${ra(Q==null?void 0:Q.activeTeamId,me)}</div>
          <div class="results-marker-name">${sa(we,!1,!1,(Q==null?void 0:Q.id)??null,(Q==null?void 0:Q.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${pt(At(Q==null?void 0:Q.id))}</div>
          <div class="results-marker-time">${S(za(re.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${S(Rr(re.gapSeconds))}</div>
          <div class="results-marker-points">${re.pointsAwarded!=null&&re.pointsAwarded>0?re.pointsAwarded:"–"}</div>
        </div>`}).join("");o.innerHTML=`${w}<div class="results-marker-list">${J}</div>`}else o.innerHTML="";o.classList.toggle("hidden",!X)}function Bg(){v("results-race-select").addEventListener("change",e=>{var r,s;const t=e.target.value;d.selectedResultsRaceId=t?Number(t):null;const a=Gt(d.selectedResultsRaceId);d.selectedResultsStageId=((s=(r=a==null?void 0:a.stages)==null?void 0:r[0])==null?void 0:s.id)??null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=mt,d.selectedResultsSpecialView=null,d.stageResults=null,_e(),d.selectedResultsStageId!=null&&Ws(d.selectedResultsStageId,!0)}),v("results-stage-select").addEventListener("change",e=>{const t=e.target.value;d.selectedResultsStageId=t?Number(t):null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=mt,d.selectedResultsSpecialView=null,d.stageResults=null,_e(),d.selectedResultsStageId!=null&&Ws(d.selectedResultsStageId,!0)}),v("results-type-tabs").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-result-type-id]");if(t){d.selectedResultsSpecialView=null,d.selectedResultTypeId=Number(t.dataset.resultTypeId),_e();return}const a=e.target.closest("button[data-results-special-view]");if(a){const s=a.dataset.resultsSpecialView;s===Il?(d.selectedResultsSpecialView="nonFinishers",_e()):s===Cl?(d.selectedResultsSpecialView="events",Ue="all",_e()):s===Fl&&(d.selectedResultsSpecialView="roster",d.selectedResultsRaceId!=null&&((r=d.resultsRoster)==null?void 0:r.raceId)!==d.selectedResultsRaceId&&El(d.selectedResultsRaceId).then(()=>_e()),_e())}}),v("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const r=t.dataset.markerKey;d.selectedResultsMarkerKey=r??mt,_e();return}const a=e.target.closest("button[data-event-filter]");a&&(Ue=a.dataset.eventFilter??"all",_e())})}const In=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],er=["skills","form","profile","preferences"],Cn=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],Fn={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...In.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function En(){return[...Cn,...Fn[d.teamDetailPage]]}function Pl(e,t=12){const a=d.riders.filter(s=>s.activeTeamId===e).sort((s,n)=>n.overallRating-s.overallRating).slice(0,t);return a.length===0?null:a.reduce((s,n)=>s+n.overallRating,0)/a.length}function Nl(e){const t=d.riders.filter(r=>r.activeTeamId===e);return t.length===0?null:t.reduce((r,s)=>r+s.overallRating,0)/t.length}function Dl(e){const t=Pl(e);return t==null?"–":t.toFixed(2).replace(".",",")}function Ll(e){const t=Nl(e);return t==null?"–":t.toFixed(2).replace(".",",")}function le(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function Ae(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:le(e,t)}function Ee(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function Be(e){return e==null?void 0:typeof e=="string"?da(e):e.name}function Pn(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...In.map(t=>t.key)].includes(e)?"desc":"asc"}function _l(e){return d.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function Al(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${_l(e.sortKey)}
      </button>
    </th>`}function Bl(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${er.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const Hl={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function Nn(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":Hl[e]??String(e)}function zl(e){const t=[...e],a=d.teamTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(d.teamTableSort.key){case"name":n=le(r.lastName,s.lastName)||le(r.firstName,s.firstName);break;case"countryCode":n=le(zt(r),zt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=le(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=le(It(r),It(s));break;case"riderType":n=le(r.riderType,s.riderType)||le(ze(r),ze(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Ae(Be(r.specialization1),Be(s.specialization1));break;case"specialization2":n=Ae(Be(r.specialization2),Be(s.specialization2));break;case"specialization3":n=Ae(Be(r.specialization3),Be(s.specialization3));break;case"peak1":n=Ae(Ee(r,0),Ee(s,0));break;case"peak2":n=Ae(Ee(r,1),Ee(s,1));break;case"peak3":n=Ae(Ee(r,2),Ee(s,2));break;default:n=r.skills[d.teamTableSort.key]-s.skills[d.teamTableSort.key];break}return n===0&&(n=le(r.lastName,s.lastName)||le(r.firstName,s.firstName)),n*a}),t}function Gl(e){const t=[...e],a=d.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(d.riderMenuTableSort.key){case"name":n=le(r.lastName,s.lastName)||le(r.firstName,s.firstName);break;case"countryCode":n=le(zt(r),zt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=le(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=le(It(r),It(s));break;case"riderType":n=le(r.riderType,s.riderType)||le(ze(r),ze(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Ae(Be(r.specialization1),Be(s.specialization1));break;case"specialization2":n=Ae(Be(r.specialization2),Be(s.specialization2));break;case"specialization3":n=Ae(Be(r.specialization3),Be(s.specialization3));break;case"peak1":n=Ae(Ee(r,0),Ee(s,0));break;case"peak2":n=Ae(Ee(r,1),Ee(s,1));break;case"peak3":n=Ae(Ee(r,2),Ee(s,2));break;default:n=r.skills[d.riderMenuTableSort.key]-s.skills[d.riderMenuTableSort.key];break}return n===0&&(n=le(r.lastName,s.lastName)||le(r.firstName,s.firstName)),n*a}),t}function Vs(e){return e.length===0?"–":e.map(t=>{const a=d.races.find(r=>r.id===t);return a?S(a.name):`Rennen ${t}`}).join(", ")}function Hg(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function Dn(e,t){var a,r;switch(t.id){case"name":return`<td class="team-table-name-cell">${De(ze(e),{riderId:e.id,teamId:e.activeTeamId,strong:d.teamDetailPage==="form"||d.teamDetailPage==="profile"||d.teamDetailPage==="preferences"})}${Fo(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${de(zt(e))}<span>${S(zt(e))}</span></span></td>`;case"age":return`<td>${e.age??(d.gameState?d.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${S(It(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating.toFixed(2)}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${Hs(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${Io(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${Hs((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${zs(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${zs(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${cn(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${S(Ee(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${S(Ee(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${S(Ee(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${S(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?S(da(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?S(da(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?S(da(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${Co(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${de(e.mentorCountryCode??"UNK")} <span>${S(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${Vs(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${Vs(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const s=t.sortKey;return s&&s in e.skills?`<td>${Ro(e.skills[s],(a=e.yearStartSkills)==null?void 0:a[s],(r=e.potentials)==null?void 0:r[s])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function Qr(){Te("Teams/Fahrer werden aktualisiert...");try{const e=!Re("riders"),t=await Y.getRiders(void 0,e);if(t.success&&(d.riders=t.data??[]),await Y.getTeams().then(a=>{a.success&&(d.teams=a.data??[])}),Re("teams")&&Ln(),Re("riders")){const{renderRidersMenu:a}=await Cr(async()=>{const{renderRidersMenu:r}=await Promise.resolve().then(()=>df);return{renderRidersMenu:r}},void 0);a()}}finally{ve()}}async function zg(e={}){const t=await Y.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),v("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${S(t.error??"Unbekannt")}</p>`;return}d.teams=t.data??[],e.render!==!1&&Re("teams")&&Ln()}function Ln(){const e=v("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+d.teams.map(r=>`<option value="${r.id}"${String(r.id)===t?" selected":""}>${S(r.name)} (${S(r.division??r.divisionName??"")}) · ${S(r.abbreviation)}</option>`).join("");const a=t?Number(t):null;pa(a)}function pa(e){const t=v("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=d.teams.find(c=>c.id===e);if(!a){t.innerHTML="";return}const r=nn(e);if(r.some(c=>c.yearStartSkills===void 0)){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Lade Team-Daten...</p>',Y.getRiders(e,!1,!1).then(c=>{if(c.success&&c.data){const o=new Map(c.data.map(m=>[m.id,m]));d.riders=d.riders.map(m=>o.get(m.id)||m),pa(e)}}).catch(console.error);return}const n=zl(r),i=a.division==="U23"?"badge-u23":"badge-classics",l=En();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${S(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${i}">${S(a.division??a.divisionName??"")}</span>
          <span>${xo(a.country,a.countryCode)}</span>
          <span>Kürzel: ${S(a.abbreviation)} · Top 12 ${S(Dl(a.id))} (${S(Ll(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${n.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(Nn(d.teamTableSort.key))} ${d.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${Bl()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${l.map(Al).join("")}
          </tr></thead>
          <tbody>
            ${n.length===0?`<tr><td colspan="${l.length}" class="text-muted">Keine Fahrer.</td></tr>`:n.map(c=>`
                <tr class="team-detail-row">
                  ${l.map(o=>Dn(c,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function Kl(){v("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;d.teamDetailPage="skills",pa(t?Number(t):null)}),v("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&Bn(s);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const s=a.dataset.teamDetailPage;if(er.includes(s)){d.teamDetailPage=s,new Set(En().map(l=>l.sortKey).filter(l=>l!=null)).has(d.teamTableSort.key)||(d.teamTableSort={key:"name",direction:"asc"});const i=Number(v("teams-dropdown").value);pa(Number.isFinite(i)?i:null)}return}const r=e.target.closest("button[data-team-sort]");if(r){const s=r.dataset.teamSort;d.teamTableSort.key===s?d.teamTableSort.direction=d.teamTableSort.direction==="asc"?"desc":"asc":d.teamTableSort={key:s,direction:Pn(s)};const n=Number(v("teams-dropdown").value);pa(Number.isFinite(n)?n:null);return}})}const Gg=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:Fn,TEAM_DETAIL_PAGE_ORDER:er,TEAM_SKILL_COLUMNS:In,TEAM_SKILL_TITLES:Hl,TEAM_TABLE_COLUMNS:Cn,compareOptionalStrings:Ae,compareStrings:le,formatTeamAverage:Ll,formatTeamTopAverage:Dl,getActiveTeamTableColumns:En,getDefaultTeamSortDirection:Pn,getPeakDate:Ee,getSortIndicator:_l,getSpecializationSortLabel:Be,getTeamAverage:Nl,getTeamSortLabel:Nn,getTeamTopAverage:Pl,initTeamsListeners:Kl,loadTeams:zg,refreshTeamsViewData:Qr,renderPeakDatesSummary:Hg,renderRacePrefs:Vs,renderTeamDetail:pa,renderTeamDetailPageTabs:Bl,renderTeamTableCell:Dn,renderTeamTableHeader:Al,renderTeams:Ln,sortRiderMenuRiders:Gl,sortTeamRiders:zl},Symbol.toStringTag,{value:"Module"}));function Kg(e,t,a){return`${e} · Etappe ${t} · ${a}`}function Ol(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function jl(e,t){const a=[];for(const r of e.riders)if(r.leadoutBonus!=null&&r.leadoutBonus>0&&r.leadoutContributions&&r.leadoutContributions.length>0){const s=t.riders.find(i=>i.id===r.riderId),n=(s==null?void 0:s.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:r.riderId,leadoutBonus:r.leadoutBonus,contributorsJson:JSON.stringify(r.leadoutContributions)})}return a}async function Wl(e,t=!1){if(tn!=null||ss)return!1;_s(e),Mo(0);try{const a=await Y.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const r=a.data;d.realtimeBootstrap=r;const s=await Ru(r,l=>on(l)),n=Ol(s,r),i=jl(s,r);return await ql(e,n,s.markerClassifications,s.incidents,s.allEvents,t,i,s.superTeamId),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{_s(null),ve()}}function Vl(e){var r;const t=(r=d.rosterEditor)==null?void 0:r.teams.find(s=>s.team.id===e);if(!t)return 0;const a=new Set(d.rosterEditorSelectedRiderIds);return t.riders.filter(s=>a.has(s.rider.id)).length}function Ul(){return d.rosterEditor?d.rosterEditor.teams.every(e=>Vl(e.team.id)===e.riderLimit):!1}function Es(){const e=v("roster-editor-title"),t=v("roster-editor-meta"),a=v("roster-editor-body"),r=v("btn-apply-roster-editor"),s=d.rosterEditor;if(!s){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',r.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=s.race.isStageRace?`${s.race.name} · Etappe ${s.stage.stageNumber} · ${s.stage.profile}`:`${s.race.name} · ${s.stage.profile}`;const n=new Set(d.rosterEditorSelectedRiderIds);a.innerHTML=s.teams.map(i=>{const l=Vl(i.team.id),c=l===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${S(i.team.name)}</h3>
            <p class="text-muted">${S(i.team.abbreviation)} · ${S(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${c}">${l} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(o=>{var h;const p=["roster-editor-rider",n.has(o.rider.id)?"roster-editor-rider-selected":"",o.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),u=o.rider.country?de(o.rider.country.code3):"",f=[((h=o.rider.role)==null?void 0:h.name)??"Ohne Rolle",`OVR ${Math.round(o.rider.overallRating)}`].join(" · "),g=o.lockReason?`<span class="roster-editor-rider-lock">${S(o.lockReason)}</span>`:"";return`
              <button
                type="button"
                class="${p}"
                data-roster-team-id="${i.team.id}"
                data-roster-rider-id="${o.rider.id}"
                ${o.isLocked?"disabled":""}
              >
                <span class="roster-editor-rider-name">${u}<span>${S(o.rider.firstName)} ${S(o.rider.lastName)}</span></span>
                <span class="roster-editor-rider-meta">${S(f)}</span>
                ${g}
              </button>`}).join("")}
        </div>
      </section>`}).join(""),r.disabled=!Ul()}function Us(){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],ya("roster-editor-error"),tt("rosterEditor")}function Yl(e,t){d.selectedRealtimeStageId=e.stage.id,d.realtimeBootstrap=e,d.realtimeError=null,t&&Rt("live-race"),Zl().load(e,{autoplay:!0,resetSpeed:!0}),ga()}function Zl(){let e=la;if(!e){const t=v("race-sim-layout"),a=v("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new Cg({layout:t,emptyState:a,controlsHeader:v("race-sim-controls-header"),profile:v("race-sim-profile"),groupBox:v("race-sim-group-box"),messages:v("race-sim-messages-body"),favorites:v("race-sim-favorites-body"),sidebar:v("race-sim-sidebar-body"),controls:v("race-sim-controls"),meta:v("race-sim-stage-meta")},{onFinishRequested:(r,s)=>{const n=Ol(r,s),i=jl(r,s);ql(s.stage.id,n,r.markerClassifications,r.incidents,r.allEvents,!1,i,r.superTeamId)}}),So(e)}return e}async function Og(e){Te("Starterfeld wird geladen..."),ya("roster-editor-error");try{const t=await Y.getRosterEditor(e);if(!t.success||!t.data){Bt("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),ft("rosterEditor"),Es();return}d.rosterEditor=t.data,d.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(r=>r.isSelected).map(r=>r.rider.id)),Es(),ft("rosterEditor")}catch(t){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],Bt("roster-editor-error",t.message),ft("rosterEditor"),Es()}finally{ve()}}async function jg(){const e=d.rosterEditor;if(e){if(!Ul()){Bt("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}ya("roster-editor-error"),Te("Starterfeld wird übernommen...");try{const t=await Y.applyRosterEditor(e.stage.id,{riderIds:d.rosterEditorSelectedRiderIds});if(!t.success||!t.data){Bt("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}Us(),Yl(t.data,!0)}catch(t){Bt("roster-editor-error",t.message)}finally{ve()}}}function ga(){var n,i;const e=v("race-sim-stage-select"),t=((n=d.gameStatus)==null?void 0:n.pendingStages)??[];t.some(l=>l.stageId===d.selectedRealtimeStageId)||(d.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(l=>`
      <option value="${l.stageId}"${l.stageId===d.selectedRealtimeStageId?" selected":""}>${S(Kg(l.raceName,l.stageNumber,l.profile))}</option>
    `).join(""),e.disabled=t.length===0;const r=t.find(l=>l.stageId===d.selectedRealtimeStageId)??null,s=Zl();if(!r){d.realtimeBootstrap=null,d.realtimeError=null,s.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!d.realtimeBootstrap||d.realtimeBootstrap.stage.id!==r.stageId)&&(d.realtimeError?s.clear(d.realtimeError):s.hide())}async function Jl(e,t){if(_r!==e){As(e),d.selectedRealtimeStageId=e,t&&Rt("live-race"),ga(),Te("Live-Simulation wird geladen...");try{const a=await Y.getRealtimeSimulation(e);if(!a.success||!a.data){d.realtimeBootstrap=null,d.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",ga(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}Yl(a.data,!1)}catch(a){d.realtimeBootstrap=null,d.realtimeError=a.message,ga(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{_r===e&&As(null),ve()}}}async function ql(e,t,a,r,s,n=!1,i,l){if(!ss){Ls(!0),Te("Live-Ergebnis wird gespeichert...");try{const c=await Y.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:r,events:s,leadoutContributions:i,superTeamId:l});if(!c.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(c.error??"Unbekannter Fehler"));return}const o=c.data;d.selectedResultsRaceId=(o==null?void 0:o.raceId)??d.selectedResultsRaceId,d.selectedResultsStageId=(o==null?void 0:o.stageId)??e,d.selectedResultTypeId=1,d.realtimeBootstrap=null,d.realtimeError=null,await Ws(e,!1),await tr(),await An(),(Re("teams")||Re("riders"))&&await Qr(),ga(),n||Rt("results")}catch(c){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+c.message)}finally{Ls(!1),ve()}}}function Wg(){v("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);d.selectedRealtimeStageId=Number.isFinite(t)?t:null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null),d.realtimeError=null,Jl(t,!1)})}function _n(e){var r;const t=dt((r=e.category)==null?void 0:r.name),a=Za(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function ps(e){var s,n;const t=dt((s=e.category)==null?void 0:s.name),a=Za(t),r=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${S(r)}</span>`}function Vg(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(r=>r.date).sort((r,s)=>r.localeCompare(s));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function gs(e){const{startDate:t,endDate:a}=Vg(e);return t===a?ce(t):`${ce(t)} - ${ce(a)}`}function Ug(e){return e.stageId>0}async function tr(){const[e,t]=await Promise.all([Y.getGameState(),Y.getGameStatus()]);if(!e.success){console.error(e.error);return}d.gameState=e.data??null,d.gameStatus=t.success?t.data??null:null,Yg(),Re("dashboard")&&fs()}function Yg(){var s;if(!d.gameState)return;v("meta-date").textContent=d.gameState.formattedDate,v("meta-season").textContent=`Saison ${d.gameState.season}`;const e=v("meta-race-hint"),t=v("btn-advance-day"),a=v("pending-stages-list"),r=((s=d.gameStatus)==null?void 0:s.pendingStages)??[];r.length>0?(e.textContent=`${r.length} offene Etappe${r.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=r.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${ce(n.date)}`:`${n.profile} · ${ce(n.date)}`,l=Ug(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
        <div class="pending-stage-item">
          <div class="pending-stage-meta">
            <div class="pending-stage-title">${S(n.raceName)}</div>
            <div class="pending-stage-subtitle">${S(i)}</div>
          </div>
          <div class="pending-stage-actions">
            ${l}
            <button class="btn btn-secondary btn-sm" data-live-stage="${n.stageId}">Live-Sim</button>
            <button class="btn btn-secondary btn-sm" data-instant-stage="${n.stageId}">Instant</button>
          </div>
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):d.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function fs(){var t,a,r,s,n;const e=d.teams.find(i=>i.isPlayerTeam)??d.teams.find(i=>{var l;return i.name===((l=d.currentSave)==null?void 0:l.teamName)})??null;v("dashboard-career").textContent=((t=d.currentSave)==null?void 0:t.careerName)??"–",v("dashboard-team").textContent=(e==null?void 0:e.name)??((a=d.currentSave)==null?void 0:a.teamName)??"–",v("dashboard-date").textContent=((r=d.gameState)==null?void 0:r.formattedDate)??"–",v("dashboard-season").textContent=d.gameState?`Saison ${d.gameState.season}`:"–",v("dashboard-races-today").textContent=String(((s=d.gameStatus)==null?void 0:s.pendingStages.length)??((n=d.gameState)==null?void 0:n.racesTodayCount)??0),Jg()}async function An(){const e=await Y.getRaces();if(!e.success){console.error(e.error);return}d.races=e.data??[],Re("dashboard")&&fs()}function Zg(e,t){const[a,r,s]=e.split("-").map(Number),n=new Date(a,r-1,s);n.setDate(n.getDate()+t);const i=n.getFullYear(),l=String(n.getMonth()+1).padStart(2,"0"),c=String(n.getDate()).padStart(2,"0");return`${i}-${l}-${c}`}function to(e){var m,p,u,f;const t=d.gameState!=null&&e.startDate<=d.gameState.currentDate&&e.endDate>=d.gameState.currentDate,r=d.gameState!=null&&e.endDate<d.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',s=((m=e.country)==null?void 0:m.name)??`Land ${e.countryId}`,n=(p=e.country)!=null&&p.code3?de(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((g,h)=>g+(h.distanceKm??0),0):((u=e.upcomingStage)==null?void 0:u.distanceKm)??null,l=e.isStageRace?(e.stages??[]).reduce((g,h)=>g+(h.elevationGainMeters??0),0):((f=e.upcomingStage)==null?void 0:f.elevationGainMeters)??null,c=i!=null?String(i.toFixed(1)).replace(".",","):"-",o=l!=null?String(Math.round(l)):"-";return`
    <tr>
      <td>${ce(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${S(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${_n(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${S(s)}</span></span></td>
      <td>${ps(e)}</td>
      <td>${c}</td>
      <td>${o}</td>
      <td>${r}</td>
    </tr>`}function Jg(){const e=v("dashboard-races-tbody");if(!d.gameState){e.innerHTML='<tr><td colspan="8" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=d.gameState.currentDate,a=Zg(t,7),r=d.races.filter(i=>i.startDate<=t&&i.endDate>=t),s=d.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="8"><strong>In Progress</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="8" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=r.map(i=>to(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="8"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="8" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=s.map(i=>to(i)).join(""),e.innerHTML=n}function ar(e){return`Etappe ${e.stageNumber}`}function qg(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,r)=>r[1]!==a[1]?r[1]-a[1]:a[0].localeCompare(r[0])).map(([a,r])=>`${r}x ${a}`).join(" · ")}function Xg(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function rr(e){return`<span class="stage-profile-badge ${Xg(e)}">${S(e)}</span>`}function hs(e,t){return`${e.name} · ${ar(t)} · ${t.profile}`}async function Qg(e){var s;const t=d.stageSummariesByStageId[e];if(t)return t;const a=await Y.getStageSummary(e);if(a.success&&a.data)return d.stageSummariesByStageId[e]=a.data,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],a.data;const r=await Y.getRealtimeSimulation(e);return r.success&&((s=r.data)!=null&&s.stageSummary)?(d.stageSummariesByStageId[e]=r.data.stageSummary,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],r.data.stageSummary):(d.stageSummaryErrorsByStageId&&(d.stageSummaryErrorsByStageId[e]=a.error??r.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:r.error}),d.stageSummariesByStageId&&delete d.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function ef(){var c;const e=v("race-stages-title"),t=v("race-stages-meta"),a=v("race-stages-body"),r=Gt(d.selectedDashboardRaceId);if(!r){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const s=r.stages??[],n=s.reduce((o,m)=>o+(m.distanceKm??0),0),i=s.reduce((o,m)=>o+(m.elevationGainMeters??0),0),l=qg(s);if(e.textContent=r.name,t.textContent=`${gs(r)} · ${((c=r.country)==null?void 0:c.name)??`Land ${r.countryId}`} · ${r.isStageRace?`${r.numberOfStages} Etappen`:"Eintagesrennen"} · ${zr(n)} · ${Gr(i)} · ${l}`,s.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
          ${s.map(o=>`
              <tr class="dashboard-race-stage-row">
                <td>${ce(o.date)}</td>
                <td><strong>${S(ar(o))}</strong></td>
                <td>${rr(o.profile)}</td>
                <td>${o.distanceKm!=null?zr(o.distanceKm):"–"}</td>
                <td>${o.elevationGainMeters!=null?Gr(o.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${o.id}"
                    aria-label="Profil von ${S(hs(r,o))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Ys(e){Gt(e)&&(d.selectedDashboardRaceId=e,ef(),ft("raceStages"))}function tf(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,r;return`
            <tr>
              <td>${gs(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?de(t.country.code3):""}<span>${S(((r=t.country)==null?void 0:r.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${S(t.name)}</strong></td>
              <td>${ps(t)}</td>
              <td>${_n(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function Bn(e){const t=d.riders.find(r=>r.id===e);v("rider-program-title").textContent=t?ze(t):"Programm",v("rider-program-meta").textContent="Lade Programmrennen ...",v("rider-program-body").innerHTML="",ft("riderProgram");const a=await Y.getRiderProgramRaces(e);if(!a.success||!a.data){v("rider-program-meta").textContent="",v("rider-program-body").innerHTML=`<div class="results-empty">${S(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}v("rider-program-title").textContent=a.data.program.name,v("rider-program-meta").textContent=t?ze(t):"",v("rider-program-body").innerHTML=tf(a.data)}function af(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=rf(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${Vt("Team","team","Team")}
          ${Vt("Fahrer","rider","Fahrer")}
          ${Vt("Spec1","spec1","Spezialisierung 1")}
          ${Vt("Rolle","role","Rolle")}
          ${Vt("Ges","overall","Gesamtstärke")}
          ${Vt("Phase","phase","Formphase")}
          ${Vt("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var r,s;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${Mt((r=a.team)==null?void 0:r.id,(s=a.team)==null?void 0:s.name)}</td>
              <td><span class="race-participant-rider-cell">${de(zt(a.rider))}<strong>${S(ze(a.rider))}</strong></span></td>
              <td>${S(Zs(a.rider))}</td>
              <td>${S(It(a.rider))}</td>
              <td>${dn(a.rider.overallRating)}</td>
              <td>${cn(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${S(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function Vt(e,t,a){const r=d.raceParticipantsSort.key===t?" race-participants-sort-active":"",s=d.raceParticipantsSort.key===t?d.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${S(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${r}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${d.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${s}</span>
      </button>
    </th>`}function rf(e){const t=d.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{var n,i,l,c;let s=0;switch(d.raceParticipantsSort.key){case"team":s=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=r.team)==null?void 0:i.name)??"","de");break;case"rider":s=ze(a.rider).localeCompare(ze(r.rider),"de");break;case"spec1":s=Zs(a.rider).localeCompare(Zs(r.rider),"de");break;case"role":s=It(a.rider).localeCompare(It(r.rider),"de");break;case"overall":s=a.rider.overallRating-r.rider.overallRating;break;case"phase":s=(a.rider.seasonFormPhase??"neutral").localeCompare(r.rider.seasonFormPhase??"neutral","de");break;default:s=(((l=a.program)==null?void 0:l.name)??"").localeCompare(((c=r.program)==null?void 0:c.name)??"","de")}return s*t||ze(a.rider).localeCompare(ze(r.rider),"de")})}function Zs(e){return e.specialization1!=null?da(e.specialization1):"–"}async function sf(e=!1){const t=d.selectedRaceParticipantsRaceId;if(t==null)return;const a=Gt(t);e&&(v("race-participants-meta").textContent="Lade Programmfahrer ...");const r=await Y.getRaceProgramParticipants(t);if(!r.success||!r.data){v("race-participants-meta").textContent="",v("race-participants-body").innerHTML=`<div class="results-empty">${S(r.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}d.raceParticipants=r.data,v("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",v("race-participants-meta").textContent=`${r.data.length} Programmfahrer · ${a?gs(a):""}`,v("race-participants-body").innerHTML=af(d.raceParticipants)}async function es(e,t=null){let a=Ga(e);if(!a&&d.stageEditorStageRows){const n=d.stageEditorStageRows.find(i=>i.stageId===e);n&&(a={race:{id:n.raceId,name:n.raceName,countryId:0,categoryId:0,isStageRace:!0,numberOfStages:1,startDate:"",endDate:"",prestige:0},stage:{id:n.stageId,raceId:n.raceId,stageNumber:n.stageNumber,date:"2026-01-01",profile:n.profile,startElevation:0,detailsCsvFile:"",distanceKm:n.distanceKm,elevationGainMeters:n.elevationGainMeters}})}if(!a)return;const r=await Qg(e);if(!r){alert(d.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}d.selectedDashboardProfileStageId=e,v("stage-profile-title").textContent=`${a.race.name} · ${ar(a.stage)}`;const s=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";v("stage-profile-meta").textContent=`${ce(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?zr(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?Gr(a.stage.elevationGainMeters):"–"}${s}`,Od(v("stage-profile-view"),r,a.stage.profile,hs(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),ft("stageProfile")}function nf(){v("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const s=Number(t.dataset.editStageRoster);if(!Number.isFinite(s))return;Og(s);return}const a=e.target.closest("button[data-live-stage]");if(a){const s=Number(a.dataset.liveStage);if(!Number.isFinite(s))return;Jl(s,!0);return}const r=e.target.closest("button[data-instant-stage]");if(r){const s=Number(r.dataset.instantStage);if(!Number.isFinite(s))return;Wl(s)}}),v("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-id]");if(!t)return;const a=Number(t.dataset.dashboardRaceId);Number.isFinite(a)&&Ys(a)}),v("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&es(a)}),v("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&Bn(s);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const r=a.dataset.raceParticipantsSort;d.raceParticipantsSort.key===r?d.raceParticipantsSort.direction=d.raceParticipantsSort.direction==="asc"?"desc":"asc":d.raceParticipantsSort={key:r,direction:"asc"},sf()}),v("btn-advance-day").addEventListener("click",async()=>{await Xl()}),v("btn-auto-progress").addEventListener("click",()=>{of()})}async function Xl(){var t,a;Te("Tag wird fortgeschrieben...");const e=(t=d.gameState)==null?void 0:t.season;try{const r=await Y.advanceDay();if(!r.success)return alert(`Tageswechsel fehlgeschlagen:
`+(r.error??"Unbekannter Fehler")),!1;if(d.currentSave&&r.data&&(d.currentSave.currentSeason=r.data.season),await tr(),await An(),Re("teams")){const{refreshTeamsViewData:n}=await Cr(async()=>{const{refreshTeamsViewData:i}=await Promise.resolve().then(()=>Gg);return{refreshTeamsViewData:i}},void 0);await n()}const s=(a=d.gameState)==null?void 0:a.season;if(e&&s&&s>e){Wa();const{startDraftPresentation:n}=await Cr(async()=>{const{startDraftPresentation:l}=await Promise.resolve().then(()=>Pf);return{startDraftPresentation:l}},void 0),{activateView:i}=await Cr(async()=>{const{activateView:l}=await Promise.resolve().then(()=>wd);return{activateView:l}},void 0);i("draft"),await n(s)}return!0}catch(r){return alert("Unerwarteter Fehler beim Tageswechsel: "+r.message),!1}finally{ve()}}function Hn(){const e=document.getElementById("btn-auto-progress");e&&(St?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function of(){St?Wa():Ql()}function Ql(){St||(an(!0),Hn(),lf())}function Wa(){St&&(an(!1),d.autoProgressTargetDate=null,Hn())}async function lf(){var e,t;for(;St;){const a=(e=d.gameState)==null?void 0:e.currentDate;if(d.autoProgressTargetDate&&a&&a>=d.autoProgressTargetDate){Wa();break}const r=((t=d.gameStatus)==null?void 0:t.pendingStages)??[];let s=!1;if(r.length>0){const n=r[0];s=await Wl(n.stageId,!0)}else s=await Xl();if(!s){Wa();break}await new Promise(n=>setTimeout(n,100))}Hn()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&St){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),Wa()}});const Ba=50;function zn(){return[...Cn,...Fn[d.riderMenuDetailPage]]}function ed(e){return d.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function td(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${ed(e.sortKey)}
      </button>
    </th>`}function ad(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${er.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function Pr(){const e=v("riders-detail"),t=zn(),a=Gl(d.riders),r=a.length,s=Math.max(1,Math.ceil(r/Ba));d.riderMenuPage=Math.min(s,Math.max(1,d.riderMenuPage));const n=(d.riderMenuPage-1)*Ba,i=Math.min(r,n+Ba),l=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(Nn(d.riderMenuTableSort.key))} ${d.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${ad()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(td).join("")}
          </tr></thead>
          <tbody>
            ${l.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:l.map(c=>`
                <tr class="team-detail-row">
                  ${t.map(o=>Dn(c,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${d.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${d.riderMenuPage} / ${s} · Fahrer ${r===0?0:n+1}-${i} von ${r}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${d.riderMenuPage>=s?"disabled":""}>Weiter</button>
      </div>
    </div>`}function rd(){v("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&Bn(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;er.includes(n)&&(d.riderMenuDetailPage=n,new Set(zn().map(l=>l.sortKey).filter(l=>l!=null)).has(d.riderMenuTableSort.key)||(d.riderMenuTableSort={key:"name",direction:"asc"}),d.riderMenuPage=1,Pr());return}const r=e.target.closest("button[data-riders-sort]");if(r){const n=r.dataset.ridersSort;d.riderMenuTableSort.key===n?d.riderMenuTableSort.direction=d.riderMenuTableSort.direction==="asc"?"desc":"asc":d.riderMenuTableSort={key:n,direction:Pn(n)},d.riderMenuPage=1,Pr();return}const s=e.target.closest("button[data-riders-page-action]");if(s){const n=s.dataset.ridersPageAction,i=Math.max(1,Math.ceil(d.riders.length/Ba));n==="prev"&&(d.riderMenuPage=Math.max(1,d.riderMenuPage-1)),n==="next"&&(d.riderMenuPage=Math.min(i,d.riderMenuPage+1)),Pr();return}})}const df=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:Ba,getActiveRiderMenuTableColumns:zn,getRiderMenuSortIndicator:ed,initRidersListeners:rd,renderRiderMenuDetailPageTabs:ad,renderRiderMenuTableHeader:td,renderRidersMenu:Pr},Symbol.toStringTag,{value:"Module"})),xr=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function yt(e){return e==null?"free-agents":String(e)}function ao(e){var a;const t=d.riderTeamEditorPayload;return t?((a=t.teams.find(r=>r.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function cf(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return ln(t/11.2,0,100)}function uf(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function mf(e){return d.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function pf(e){const t=d.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${S(e.title)}"
        aria-label="${S(e.title)}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${mf(e.key)}
      </button>
    </th>`}function gf(e,t){switch(d.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return le(e.firstName,t.firstName);case"lastName":return le(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return le(ao(e.teamId),ao(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return le(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return le(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function ff(e){const t=d.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>(gf(a,r)||le(a.lastName,r.lastName)||le(a.firstName,r.firstName)||a.riderId-r.riderId)*t)}function hf(e){const t=d.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(r=>yt(r.teamId)===t);return ff(a)}function bf(e){const t=d.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${yt(a.teamId)}"${a.teamId===e?" selected":""}>${S(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function sd(e){return d.riderTeamEditorDirtyRiderIds.includes(e)}function yf(e,t){const a=sd(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${is(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${bf(e.teamId)}</select></td>`;case"number":{const r=e[t.key];return t.key==="countryId"?`
          <td>
            <div class="rider-team-editor-country-cell" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
              ${e.countryCode?de(e.countryCode):""}
              <input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${r}" style="width: 45px; text-align: center;">
            </div>
          </td>`:`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${r}"></td>`}case"text":{const r=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${S(r)}"></td>`}default:return"<td>–</td>"}}function vf(e){const t=[...e.teams].sort((a,r)=>a.rank-r.rank||le(a.name,r.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${d.riderTeamEditorSelectedTeamKey===yt(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${yt(a.teamId)}">
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
    </aside>`}function Je(){var l;const e=v("rider-team-editor-root"),t=v("rider-team-editor-meta"),a=d.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const r=d.riderTeamEditorSelectedTeamKey?a.teams.find(c=>yt(c.teamId)===d.riderTeamEditorSelectedTeamKey)??null:null,s=hf(a),n=d.riderTeamEditorDirtyRiderIds.length,i=r==null?"Kein Team gewählt":`${r.riderCount} Fahrer · Ø ${r.averageOverall!=null?r.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${r.rank}`;t.textContent=r==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${r.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${d.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(c=>`
                  <option value="${yt(c.teamId)}"${d.riderTeamEditorSelectedTeamKey===yt(c.teamId)?" selected":""}>${S(c.name)} (${c.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${S(d.riderTeamEditorSort.key==="teamName"?"Team":((l=xr.find(c=>c.key===d.riderTeamEditorSort.key))==null?void 0:l.title)??d.riderTeamEditorSort.key)} ${d.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${xr.map(pf).join("")}
                </tr>
              </thead>
              <tbody>
                ${s.length===0?`<tr><td colspan="${xr.length}" class="text-muted">${d.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:s.map(c=>`
                    <tr class="team-detail-row${sd(c.riderId)?" rider-team-editor-row-dirty":""}">
                      ${xr.map(o=>yf(c,o)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${vf(a)}
    </div>`}function Sf(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const l=e.riders.filter(o=>o.teamId===i.teamId),c=l.length===0?null:Math.round(l.reduce((o,m)=>o+m.overallRating,0)/l.length*100)/100;return{...i,riderCount:l.length,averageOverall:c,rank:0}}),r=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:r.length,averageOverall:r.length===0?null:Math.round(r.reduce((i,l)=>i+l.overallRating,0)/r.length*100)/100,rank:0,isFreeAgents:!0});const s=[...a].sort((i,l)=>{const c=i.averageOverall??-1;return(l.averageOverall??-1)-c||l.riderCount-i.riderCount||le(i.name,l.name)}),n=new Map(s.map((i,l)=>[yt(i.teamId),l+1]));return a.map(i=>({...i,rank:n.get(yt(i.teamId))??a.length}))}let nd=[];async function id(e=!1){if(d.riderTeamEditorPayload&&!e){Je();return}v("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const[t,a]=await Promise.all([Y.getRiderTeamEditor(),Y.listStageEditorCountries()]);if(!t.success||!t.data){v("rider-team-editor-root").innerHTML=`<div class="results-empty">${S(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}a.success&&a.data&&(nd=a.data),d.riderTeamEditorPayload=t.data,d.riderTeamEditorDirtyRiderIds=[],d.riderTeamEditorSaving=!1,d.riderTeamEditorExporting=!1,d.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(s=>yt(s.teamId)===d.riderTeamEditorSelectedTeamKey)||(d.riderTeamEditorSelectedTeamKey="")),Je()}function kf(e,t,a){const r=d.riderTeamEditorPayload;if(!r)return;const s=r.riders.find(n=>n.riderId===e);if(s){if(t==="teamId")s.teamId=a==="free-agents"?null:Number.parseInt(a,10);else if(typeof s[t]=="number"){const n=Number.parseInt(a||"0",10);if(s[t]=n,t==="countryId"){const i=nd.find(l=>l.id===n);s.countryCode=i?i.code3:"UNK"}}else s[t]=a;s.overallRating=cf(s),r.teams=Sf(r),d.riderTeamEditorDirtyRiderIds.includes(e)||(d.riderTeamEditorDirtyRiderIds=[...d.riderTeamEditorDirtyRiderIds,e]),Je()}}async function $f(){if(!d.riderTeamEditorPayload||d.riderTeamEditorSaving)return;d.riderTeamEditorSaving=!0,Je();const e=await Y.saveRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Je();return}d.riderTeamEditorPayload=e.data,d.riderTeamEditorDirtyRiderIds=[],Je()}async function xf(){if(!d.riderTeamEditorPayload||d.riderTeamEditorExporting)return;d.riderTeamEditorExporting=!0,Je();const e=await Y.exportRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Je();return}Kr(e.data.fileName,e.data.content),Je()}function Tf(){v("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const s=t.dataset.riderTeamEditorSort;d.riderTeamEditorSort.key===s?d.riderTeamEditorSort.direction=d.riderTeamEditorSort.direction==="asc"?"desc":"asc":d.riderTeamEditorSort={key:s,direction:uf(s)},Je();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){d.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Je();return}const r=e.target.closest("button[data-rider-team-editor-action]");if(r){const s=r.dataset.riderTeamEditorAction;if(s==="reload"){id(!0);return}if(s==="export"){xf();return}s==="save"&&$f()}}),v("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){d.riderTeamEditorSelectedTeamKey=t.value,Je();return}const a=e.target.closest(".rider-team-editor-input");if(a){const r=Number(a.dataset.riderTeamEditorRiderId),s=a.dataset.riderTeamEditorField;Number.isFinite(r)&&s&&kf(r,s,a.value)}})}let nt={key:"pickNumber",asc:!0};function Js(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),r=.26+t*.18,s=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${r};--rider-stats-pill-bg-alpha:${s};`}function od(e){return nt.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${nt.asc?"↑":"↓"}</span>`}function Qe(e,t,a=""){const r=nt.key===t?" team-table-sort-active":"";return`
    <th class="${S(a)}">
      <button
        type="button"
        class="team-table-sort${r}"
        data-draft-sort="${S(t)}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        ${od(t)}
      </button>
    </th>`}async function sr(e,t=!1){const a=await Y.getDraftHistory(e);if(!a.success){d.draftHistory=null,Re("draft")&&ts(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}d.draftHistory=a.data??null,Re("draft")&&ts()}function ts(){var n,i;const e=v("draft-table-container"),t=v("draft-season-select"),a=document.querySelector("#view-draft .results-toolbar");if(!d.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(((n=d.gameState)==null?void 0:n.draftStatus)==="active"){a&&a.classList.add("hidden");const l=d.gameState.draftSeason||((i=d.currentSave)==null?void 0:i.currentSeason)||2026;e.innerHTML=`
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; background: rgba(30, 41, 59, 0.7); border: 2px dashed rgba(255,255,255,0.1); border-radius: 12px; max-width: 600px; margin: 2rem auto; text-align: center; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
        <div style="font-size: 4rem; margin-bottom: 1.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));">🏆</div>
        <h2 style="font-size: 1.8rem; margin: 0 0 1rem 0; font-weight: bold; background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Fahrerdraft Saison ${l}</h2>
        <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.6; margin: 0 0 2rem 0; max-width: 450px;">
          Der jährliche Fahrerdraft für die Saison ${l} hat begonnen! Als Manager deines Teams triffst du deine Entscheidungen interaktiv.
        </p>
        <button id="draft-start-interactive-btn" class="btn btn-primary" style="padding: 0.85rem 2rem; font-size: 1.2rem; font-weight: bold; border-radius: 8px; background: linear-gradient(135deg, #38bdf8, #0284c7); border: none; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4); transition: transform 0.2s, box-shadow 0.2s;">
          DRAFT STARTEN & REPLAY ANSEHEN
        </button>
      </div>
    `;const c=document.getElementById("draft-start-interactive-btn");c&&(c.onclick=()=>{Gn(l)});return}if(a&&a.classList.remove("hidden"),t.options.length===0){const l=(d.currentSave.startSeason??2026)+1;for(let c=d.currentSave.currentSeason;c>=l;c--){const o=document.createElement("option");o.value=c.toString(),o.textContent=`Saison ${c}`,t.appendChild(o)}d.draftSelectedSeason||(d.draftSelectedSeason=Math.max(l,d.currentSave.currentSeason)),t.value=d.draftSelectedSeason.toString(),t.onchange=c=>{const o=c.target;d.draftSelectedSeason=parseInt(o.value,10),sr(d.draftSelectedSeason)}}if(!d.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(d.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const r=[...d.draftHistory.rows].sort((l,c)=>{let o=0;const m=nt.key;return m==="riderLastName"?o=l.riderLastName.localeCompare(c.riderLastName):m==="teamName"?o=l.teamName.localeCompare(c.teamName):m==="oldTeamName"?o=(l.oldTeamName||"").localeCompare(c.oldTeamName||""):m==="countryCode"?o=l.countryCode.localeCompare(c.countryCode):o=(l[m]??0)-(c[m]??0),nt.asc?o:-o});let s=`
    <table class="data-table">
      <thead>
        <tr>
          ${Qe("Pick","pickNumber","text-center")}
          ${Qe("Runde","draftRound","text-center")}
          ${Qe("Neues Team","teamName")}
          ${Qe("Altes Team","oldTeamName")}
          ${Qe("Land","countryCode","text-center")}
          ${Qe("Fahrer","riderLastName")}
          ${Qe("Alter","riderBirthYear","text-center")}
          ${Qe("Vertrag","contractLength","text-center")}
          ${Qe("Stärke","overallAtDraft","text-center")}
          ${Qe("Potenzial","potOverallAtDraft","text-center")}
        </tr>
      </thead>
      <tbody>
  `;for(const l of r){const c=d.draftHistory.season-l.riderBirthYear;let o="-";l.oldTeamName&&(o=`
        <div style="display:flex; align-items:center; gap:0.5rem;">
          ${Mt(l.oldTeamId,l.oldTeamName)}
          <button class="app-team-link" data-team-id="${l.oldTeamId}" style="background: none; border: none; padding: 0; color: #94a3b8; font-weight: normal; cursor: pointer; text-align: left; font-size: inherit;">
            ${S(l.oldTeamName)}
          </button>
        </div>`);const m=`
      <div style="display:flex; align-items:center; gap:0.5rem;">
        ${Mt(l.teamId,l.teamName)}
        <button class="app-team-link" data-team-id="${l.teamId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: inherit;">
          ${S(l.teamName)}
        </button>
      </div>`;s+=`
      <tr>
        <td class="text-center">#${l.pickNumber}</td>
        <td class="text-center">Runde ${l.draftRound}</td>
        <td>${m}</td>
        <td>${o}</td>
        <td class="text-center">${de(l.countryCode)}</td>
        <td>
          <button class="app-rider-link" data-rider-id="${l.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: inherit;">
            ${S(l.riderLastName)}
          </button>
        </td>
        <td class="text-center">${c} J.</td>
        <td class="text-center">${l.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Js(l.overallAtDraft)}">${l.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Js(l.potOverallAtDraft)}">${l.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}s+="</tbody></table>",e.innerHTML=s}function ld(){v("draft-table-container").addEventListener("click",a=>{const r=a.target.closest("button[data-draft-sort]");if(r){const s=r.dataset.draftSort;s&&(nt.key===s?nt.asc=!nt.asc:(nt.key=s,nt.asc=!0),ts())}});const t=v("draft-replay-btn");t&&t.addEventListener("click",()=>{const a=v("draft-season-select");if(a){const r=Number(a.value);isNaN(r)||Gn(r)}})}function Ma(){d.draftOverlayTimer1&&(clearTimeout(d.draftOverlayTimer1),d.draftOverlayTimer1=null),d.draftOverlayTimer2&&(clearTimeout(d.draftOverlayTimer2),d.draftOverlayTimer2=null)}function wf(e,t,a){const r=d.teams.find(c=>c.id===e),s=(r==null?void 0:r.division)==="U23"?20:(r==null?void 0:r.division)==="ProTour"?30:40,n=d.riders.filter(c=>c.activeTeamId===e).length,i=a.slice(t+1).filter(c=>c.teamId===e).length,l=n-i;return Math.max(0,s-l)}function it(e,t,a=50){var n;const r=e==null||e<=0?"Freier Fahrer":t??((n=d.teams.find(i=>i.id===e))==null?void 0:n.name)??`Team ${e}`,s=e==null||e<=0?"/jersey/Jer_placeholder.svg":`/jersey-large/Jer_${e}.png`;return`
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
    </span>`}function Va(e,t,a=!1){if(!d.draftOverlayPicks)return[];const r=d.riders.filter(l=>l.activeTeamId===e),s=a?t+1:t,n=d.draftOverlayPicks.slice(s),i=new Set(n.filter(l=>l.teamId===e).map(l=>l.riderId));return r.filter(l=>!i.has(l.id))}function qs(e){const t={Berg:{spec1:0,spec23:0},Hill:{spec1:0,spec23:0},Sprint:{spec1:0,spec23:0},Timetrial:{spec1:0,spec23:0},Cobble:{spec1:0,spec23:0}};for(const a of e){const r=a.specialization1,s=a.specialization2,n=a.specialization3;r&&t[r]!==void 0&&t[r].spec1++,s&&t[s]!==void 0&&t[s].spec23++,n&&t[n]!==void 0&&t[n].spec23++}return t}function dd(e,t,a,r){const s=["Berg","Hill","Sprint","Timetrial","Cobble"],n=g=>g==="Hill"?"Hügel":g==="Timetrial"?"ZF":g,i=(g,h,b)=>g==="Timetrial"?h>=4||h>=2&&b>=2:g==="Cobble"?h>=4||h>=3&&b>=2:h>=4,l=s.map(g=>{const h=t[g]||{spec1:0},b=a[g]||{spec1:0,spec23:0},k=i(g,b.spec1,b.spec23)?"#4ade80":"#f87171",T=String(r?b.spec1:h.spec1);let x="";return r&&b.spec1-h.spec1>0&&(x='<span class="count-anim" style="color: #4ade80; font-weight: bold; margin-left: 0.15rem; animation: fadeUp 1.5s forwards;">(+1)</span>'),`<div style="display: flex; align-items: center;"><span style="color: #94a3b8; margin-right: 0.25rem;">${n(g)}:</span><strong style="color: ${k};">${T}</strong>${x}</div>`}),c=d.teams.find(g=>g.id===e),o=(c==null?void 0:c.division)==="U23"?20:(c==null?void 0:c.division)==="ProTour"?30:40,m=Va(e,d.draftOverlayCurrentIndex,!1).length,p=Va(e,d.draftOverlayCurrentIndex,!0).length;let u="";r&&p>m&&(u='<span class="count-anim" style="color: #4ade80; font-weight: bold; margin-left: 0.15rem; animation: fadeUp 1.5s forwards;">(+1)</span>');const f=r?p:m;return l.push(`<div style="display: flex; align-items: center; border-left: 1px solid rgba(255,255,255,0.15); padding-left: 1rem;"><span style="color: #94a3b8; margin-right: 0.25rem;">Kader:</span><strong style="color: #fbbf24;">${f}/${o}</strong>${u}</div>`),l.join('<span style="color: rgba(255,255,255,0.15); margin: 0 0.25rem;">|</span>')}function Ps(e,t,a,r,s){const n=e.id===r,i=d.draftOverlayPicks.slice(0,a+1).some(p=>p.riderId===e.id&&p.teamId===s);let l="#fff",c="#94a3b8",o="normal";return n?(l="#4ade80",c="#4ade80",o="bold"):i&&(l="#facc15",c="#facc15",o="bold"),`
    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; transition: all 0.2s; ${n?"border-left: 3px solid #4ade80; padding: 0.25rem 0.4rem 0.25rem 0.2rem; background: rgba(74, 222, 128, 0.08); border-radius: 4px;":"padding: 0.25rem 0.4rem; background: transparent; border-radius: 4px;"}">
      <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span style="font-family: monospace; text-align: right; width: 1.25rem; display: inline-block; color: #64748b; font-weight: bold; margin-right: 0.2rem;">${String(t).padStart(2,"0")}</span>
        ${de(e.countryCode||e.nationality)}
        <span style="color: ${l}; font-weight: ${o}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${S(e.lastName)}
        </span>
      </div>
      <span style="color: ${c}; font-weight: bold;">${e.overallRating.toFixed(1)}</span>
    </div>
  `}function Ht(e){if(!e)return null;const t=e.toLowerCase();return t==="berg"||t==="climber"||t==="bergfahrer"?"Berg":t==="hill"||t==="puncher"||t==="huegelspezialist"?"Hügel":t==="sprint"||t==="sprinter"?"Sprint":t==="timetrial"||t==="time_trial"||t==="time trialist"||t==="zf"||t==="zeitfahrer"?"Zeitfahren":t==="cobble"||t==="classic"||t==="pave"||t==="pflasterspezialist"?"Cobble":t==="attacker"||t==="angreifer"?"Angreifer":e}function cd(e,t,a,r=!1){var y;const s=t?"border: 2px solid var(--accent, #38bdf8); background: rgba(56, 189, 248, 0.08);":"border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);",n=r?"cursor: pointer;":"",i=r?"draft-candidate-clickable":"",l=[],c=Ht(e.specialization1),o=Ht(e.specialization2),m=Ht(e.specialization3);c&&l.push(c),o&&l.push(o),m&&l.push(m);const p=l.length>0?l.map(k=>S(k)).join(" · "):"Allrounder",u=e.uciRank?`<span style="color: #4ade80; font-weight: bold;">${e.uciRank}</span>`:"—",g=(d.draftSelectedSeason??((y=d.currentSave)==null?void 0:y.currentSeason)??2026)-e.birthYear,h=e.wins&&e.wins>0?`<span>·</span><span style="color: #4ade80;">${e.wins===1?"1 Sieg":e.wins+" Siege"}</span>`:"";let b="";return e.oldTeamId&&e.oldTeamId>0?b=it(e.oldTeamId,e.oldTeamName,26):b="",`
    <div class="${i}" data-rider-id="${e.riderId}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.25rem 0.4rem; border-radius: 6px; transition: all 0.2s; ${s} ${n}">
      <div style="display: flex; align-items: center; gap: 0.45rem;">
        ${b?`
        <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
          ${b}
        </div>
        `:""}
        <div>
          <div style="display: flex; align-items: center; gap: 0.25rem;">
            ${de(e.countryCode)}
            <button class="app-rider-link" data-rider-id="${e.riderId}" style="background: none; border: none; padding: 0; color: #60a5fa; font-weight: bold; cursor: pointer; text-align: left; font-size: 0.8rem; text-decoration: none; line-height: 1.2;">
              ${S(e.lastName)}
            </button>
            <span style="color: #60a5fa; font-weight: bold; font-size: 0.78rem; margin-left: 0.1rem;">(</span><span style="color: #facc15; font-weight: bold; font-size: 0.78rem;">${g}</span><span style="color: #60a5fa; font-weight: bold; font-size: 0.78rem;">)</span>
          </div>
          <div style="font-size: 0.68rem; color: #facc15; font-weight: bold; display: flex; align-items: center; gap: 0.3rem; margin-top: 0.05rem; flex-wrap: wrap; line-height: 1.1;">
            <span>${p}</span>
            <span>·</span>
            <span>UCI: ${u}</span>
            ${h}
          </div>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 0.45rem;">
        <div style="text-align: right; line-height: 1.1;">
          <div style="font-size: 0.62rem; color: #64748b; text-transform: uppercase; font-weight: bold;">POT</div>
          <div style="font-size: 0.72rem; font-weight: bold; color: #94a3b8;">${e.potential.toFixed(1)}</div>
          <div style="font-size: 0.65rem; color: var(--accent, #38bdf8); font-weight: bold; margin-top: 0.02rem;">${e.probability.toFixed(1)}%</div>
        </div>
        <div style="border: 1px solid #fbbf24; border-radius: 4px; padding: 0.15rem 0.3rem; color: #fbbf24; font-weight: bold; font-size: 0.85rem; min-width: 2.2rem; text-align: center; background: rgba(251, 191, 36, 0.05); line-height: 1.1;">
          ${e.overallRating.toFixed(1)}
        </div>
      </div>
    </div>
  `}function Mf(e){var n;const a=(d.draftSelectedSeason??((n=d.currentSave)==null?void 0:n.currentSeason)??2026)-e.riderBirthYear,r=Ht(e.riderSpecialization)||"Allrounder";let s="";return e.oldTeamId===e.teamId?s=`
      ${it(null,null,95)}
      <span style="font-size: 2.5rem; color: #94a3b8; font-weight: bold; display: flex; align-items: center;">➔</span>
      ${it(e.teamId,e.teamName,95)}
    `:e.oldTeamId&&e.oldTeamId>0?s=`
      ${it(e.oldTeamId,e.oldTeamName,95)}
      <span style="font-size: 2.5rem; color: #94a3b8; font-weight: bold; display: flex; align-items: center;">➔</span>
      ${it(e.teamId,e.teamName,95)}
    `:s=`
      ${it(e.teamId,e.teamName,95)}
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
          ${de(e.countryCode)}
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
  `}function Rf(e){let t=document.getElementById("draft-overlay");return t||(t=document.createElement("div"),t.id="draft-overlay",t.style.cssText=`
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
      <!-- Linke Spalte: Kandidaten (3-Spalten) -->
      <div style="flex: 3.0; display: flex; flex-direction: column; min-height: 0;">
        <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0;">Kandidaten-Pool</h3>
        <div id="draft-overlay-candidates-list" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.4rem 0.6rem; overflow-y: auto; flex: 1; padding-right: 0.5rem;"></div>
      </div>
      
      <!-- Rechte Spalte: Auswahl (Schmaler) -->
      <div style="flex: 1.0; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(255,255,255,0.01); border: 2px dashed rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem; position: relative; min-height: 0;">
        <div id="draft-overlay-pick-display" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0;"></div>
      </div>
    </div>
  `,t.addEventListener("click",a=>{var i,l;const r=a.target;if(r.id==="draft-overlay-quick-btn"){((i=d.gameState)==null?void 0:i.draftStatus)==="active"?confirm("Möchtest du den Draft wirklich abkürzen? Die KI wird alle restlichen Runden automatisch für dein Team und alle anderen simulieren.")&&Ef():xa();return}if(r.id==="draft-overlay-finish-btn"){(async()=>(Te("Spielstand wird aktualisiert..."),await tr(),xa(),ve()))();return}if(r.id==="draft-overlay-confirm-btn"){const c=Number(r.dataset.riderId);isNaN(c)||Ff(c);return}const s=r.closest(".draft-candidate-clickable");if(s){const c=Number(s.dataset.riderId);d.selectedDraftRiderId=c,Ua();return}if(r.id==="draft-overlay-pause-btn"){d.draftPaused=!d.draftPaused,r.textContent=d.draftPaused?"Weiter":"Pause",r.classList.toggle("btn-primary",d.draftPaused),fa();return}const n=r.closest(".draft-speed-btn");if(n){const c=parseFloat(n.dataset.speed||"1");d.draftSpeedMultiplier=c,t.querySelectorAll(".draft-speed-btn").forEach(o=>{o.classList.remove("draft-speed-btn-active"),o.style.color="",o.style.fontWeight=""}),n.classList.add("draft-speed-btn-active"),n.style.color="var(--accent, #38bdf8)",n.style.fontWeight="bold",fa();return}if(r.id==="draft-overlay-prev-btn"||r.closest("#draft-overlay-prev-btn")){if(d.draftOverlayCurrentIndex>0){const c=document.getElementById("draft-overlay-auto-checkbox");c&&(c.checked=!1,d.draftOverlayAuto=!1),$a(d.draftOverlayCurrentIndex-1)}return}if(r.id==="draft-overlay-next-btn"||r.closest("#draft-overlay-next-btn")){if(d.draftOverlayPicks&&d.draftOverlayCurrentIndex+1<d.draftOverlayPicks.length){const c=document.getElementById("draft-overlay-auto-checkbox");c&&(c.checked=!1,d.draftOverlayAuto=!1),$a(d.draftOverlayCurrentIndex+1)}else if(d.draftOverlayPicks&&d.draftOverlayCurrentIndex+1===d.draftOverlayPicks.length&&((l=d.gameState)==null?void 0:l.draftStatus)==="active"){const c=document.getElementById("draft-overlay-auto-checkbox");c&&(c.checked=!1,d.draftOverlayAuto=!1),d.draftOverlayCurrentIndex=d.draftOverlayCurrentIndex+1,Ua()}return}}),t.addEventListener("change",a=>{const r=a.target;r.id==="draft-overlay-auto-checkbox"&&(d.draftOverlayAuto=r.checked,d.draftOverlayAuto?fa():Ma())}),t)}function fa(){if(Ma(),d.draftPaused)return;const e=d.draftSpeedMultiplier,t=d.draftOverlayCurrentIndex;if(d.draftRevealShown){if(d.draftOverlayAuto){const a=3e3/e;d.draftOverlayTimer2=window.setTimeout(()=>{const r=t+1;r<d.draftOverlayPicks.length?$a(r):xa()},a)}}else{const a=2e3/e;d.draftOverlayTimer1=window.setTimeout(()=>{ud()},a)}}function ud(){const e=d.draftOverlayCurrentIndex,t=d.draftOverlayPicks[e];d.draftRevealShown=!0;const a=Va(t.teamId,e,!1),r=Va(t.teamId,e,!0),s=qs(a),n=qs(r),i=document.getElementById("draft-overlay-specs-header");i&&(i.innerHTML=dd(t.teamId,s,n,!0));const l=document.getElementById("draft-overlay-pick-display");if(l){const c=[...r].sort((k,T)=>T.overallRating-k.overallRating),o=c.slice(0,10),m=o.some(k=>k.id===t.riderId),p=c.findIndex(k=>k.id===t.riderId)+1;let u=o.map((k,T)=>Ps(k,T+1,e,t.riderId,t.teamId)).join("");if(!m){const k=c.find(T=>T.id===t.riderId);k&&(u+=`
          <div style="border-top: 1px dashed rgba(255,255,255,0.15); margin: 0.3rem 0; padding-top: 0.3rem;"></div>
          ${Ps(k,p,e,t.riderId,t.teamId)}
        `)}const f=d.riders.find(k=>k.id===t.riderId),g=f==null?void 0:f.specialization1,h=Ht(g)||"Allrounder",b=c.filter(k=>g&&(k.specialization1===g||k.specialization2===g)).slice(0,10);let y=b.map(k=>{const T=c.findIndex(x=>x.id===k.id)+1;return Ps(k,T,e,t.riderId,t.teamId)}).join("");b.length===0&&(y='<div style="font-size: 0.8rem; color: #64748b; font-style: italic; padding: 0.5rem; text-align: center;">Keine Partner im Team</div>'),l.innerHTML=`
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
          ${Mf(t)}
        </div>
      </div>
    `}fa()}function If(e){const t=e.length,a=Math.ceil(t/2),r=[];for(let s=0;s<a;s++)r.push(e[s]),s+a<t&&r.push(e[s+a]);return r}function $a(e){if(!d.draftOverlayPicks||e<0||e>=d.draftOverlayPicks.length)return;Ma(),d.draftOverlayCurrentIndex=e,d.draftRevealShown=!1;const t=d.draftOverlayPicks[e];if(!document.getElementById("draft-overlay"))return;const r=document.getElementById("draft-overlay-round-title");r&&(r.textContent=`Runde ${t.draftRound} - Pick #${t.pickNumber}`);const s=document.getElementById("draft-overlay-team-subtitle");s&&(s.textContent=t.teamName);const n=document.getElementById("draft-overlay-team-jersey-wrap");n&&(n.innerHTML=it(t.teamId,t.teamName,72));const i=document.getElementById("draft-overlay-progress-label");i&&(i.textContent=`${e+1} / ${d.draftOverlayPicks.length}`);const l=Va(t.teamId,e,!1),c=qs(l),o=document.getElementById("draft-overlay-specs-header");o&&(o.innerHTML=dd(t.teamId,c,c,!1));const m=document.getElementById("draft-overlay-prev-btn");m&&(m.disabled=e===0);const p=document.getElementById("draft-overlay-next-btn");p&&(p.disabled=e===d.draftOverlayPicks.length-1);const u=[...t.candidates].sort((b,y)=>y.overallRating-b.overallRating),f=If(u),g=document.getElementById("draft-overlay-candidates-list");g&&(g.innerHTML=f.map(b=>{const y=b.riderId===t.riderId;return cd(b,y,t.teamId)}).join(""));const h=document.getElementById("draft-overlay-pick-display");h&&(h.innerHTML=`
      <div style="font-size: 1.3rem; font-weight: 500; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 2.25rem; transform: translateY(-20px);">
        <div style="animation: pulse 1s infinite alternate; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5)); display: flex; align-items: center; justify-content: center; width: 120px; height: 120px;">
          ${it(t.teamId,t.teamName,120)}
        </div>
        <style>
          @keyframes pulse {
            from { opacity: 0.4; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1.08); }
          }
        </style>
        <span>Treffe Auswahl...</span>
      </div>
    `),fa()}function xa(){Ma(),d.draftOverlayActive=!1,d.draftOverlayPicks=null;const e=document.getElementById("draft-overlay");e&&e.remove(),d.draftSelectedSeason&&sr(d.draftSelectedSeason)}async function Gn(e){var t;Ma(),d.draftOverlayActive=!0,d.draftOverlayAuto=!0,d.draftOverlayCurrentIndex=0,d.draftSelectedSeason=e,d.draftSpeedMultiplier=1,d.draftPaused=!1,d.draftRevealShown=!1,d.selectedDraftRiderId=null,Te("Draft-Präsentation wird geladen...");try{const[a,r,s]=await Promise.all([Y.getDraftDetails(e),Y.getRiders(void 0,!1,!0,e),Y.getTeams()]);r.success&&r.data&&(d.riders=r.data),s.success&&s.data&&(d.teams=s.data),d.draftOverlayPicks=a.success&&a.data?a.data.picks:[],Rf(e),d.draftOverlayPicks&&d.draftOverlayPicks.length>0?$a(0):((t=d.gameState)==null?void 0:t.draftStatus)==="active"?Ua():xa()}catch(a){console.error(a),d.draftOverlayActive=!1}finally{ve()}}async function Ua(){var p,u;Ma();const e=d.draftSelectedSeason||((p=d.currentSave)==null?void 0:p.currentSeason)||2026,t=document.getElementById("draft-overlay-pick-display");t&&(t.innerHTML='<div style="color: #94a3b8; font-size: 1.1rem;">Lade aktuellen Draft-Zustand...</div>');const a=await Y.getDraftState(e);if(!a.success){alert("Fehler beim Laden des Draft-Zustands: "+a.error);return}const r=a.data;if(r.finished){t&&(t.innerHTML=`
        <div style="text-align: center; color: #fff;">
          <h3 style="color: #10b981; font-size: 1.5rem; margin-bottom: 1rem;">Draft abgeschlossen!</h3>
          <p style="color: #94a3b8; margin-bottom: 2rem;">Alle Teams haben ihren Kader für die neue Saison zusammengestellt.</p>
          <button id="draft-overlay-finish-btn" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-weight: bold; background: #10b981; border: none;">Draft beenden & fortfahren</button>
        </div>
      `);const f=document.getElementById("draft-overlay-next-btn");f&&(f.disabled=!0);const g=document.getElementById("draft-overlay-prev-btn");g&&(g.disabled=!0);return}const s=document.getElementById("draft-overlay-round-title");s&&(s.textContent=`Runde ${r.currentRound}`);const n=document.getElementById("draft-overlay-team-subtitle");n&&(r.isPlayerTeam?(n.textContent="DU BIST AN DER REIHE!",n.style.color="#fbbf24"):(n.textContent=`${r.nextTeamName} wählt...`,n.style.color="#d97706"));const i=document.getElementById("draft-overlay-team-jersey-wrap");i&&(i.innerHTML=it(r.nextTeamId,r.nextTeamName,72));const l=document.getElementById("draft-overlay-progress-label");l&&(l.textContent=`Pick ${r.currentPickNumber}`);const c=document.getElementById("draft-overlay-prev-btn");c&&(c.disabled=!0);const o=document.getElementById("draft-overlay-next-btn");o&&(o.disabled=!0);const m=document.getElementById("draft-overlay-candidates-list");if(m&&(r.isPlayerTeam&&r.candidates&&r.candidates.length>0?m.innerHTML=r.candidates.map(f=>{const g=f.riderId===d.selectedDraftRiderId;return cd(f,g,r.nextTeamId,!0)}).join(""):m.innerHTML='<div style="color: #64748b; font-style: italic; padding: 1rem;">Warte auf den Zug der KI...</div>'),t&&r.isPlayerTeam){const f=d.selectedDraftRiderId,g=(u=r.candidates)==null?void 0:u.find(h=>h.riderId===f);g?t.innerHTML=Cf(g):t.innerHTML=`
          <div style="font-size: 1.1rem; color: #94a3b8; text-align: center; max-width: 80%;">
            Wähle links einen Fahrer aus dem Pool aus, um Details anzuzeigen und ihn zu verpflichten.
          </div>
        `}}function Cf(e){var i;const a=(d.draftSelectedSeason??((i=d.currentSave)==null?void 0:i.currentSeason)??2026)-e.birthYear,r=[];e.specialization1&&r.push(Ht(e.specialization1)),e.specialization2&&r.push(Ht(e.specialization2)),e.specialization3&&r.push(Ht(e.specialization3));const s=r.length>0?r.join(" · "):"Allrounder",n=e.uciRank?`${e.uciRank}`:"—";return`
    <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #fff;">
      <h3 style="margin: 0; color: var(--accent, #38bdf8); font-size: 1.3rem;">Fahrer auswählen</h3>
      <div style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
        ${e.oldTeamId?it(e.oldTeamId,e.oldTeamName,80):it(null,null,80)}
      </div>
      <div style="font-size: 1.4rem; font-weight: bold; text-align: center;">
        ${S(e.firstName)} ${S(e.lastName)} ${de(e.countryCode)}
      </div>
      <div style="display: flex; gap: 1rem; align-items: center; font-size: 0.95rem; color: #94a3b8;">
        <span>Alter: <strong style="color: #fff;">${a}</strong></span>
        <span>·</span>
        <span>OVR: <strong style="color: #fbbf24;">${e.overallRating.toFixed(1)}</strong></span>
        <span>·</span>
        <span>POT: <strong style="color: #60a5fa;">${e.potential.toFixed(1)}</strong></span>
      </div>
      <div style="font-size: 0.9rem; color: #facc15; font-weight: 500;">
        ${S(s)}
      </div>
      <div style="font-size: 0.85rem; color: #94a3b8; display: flex; gap: 1rem;">
        <span>UCI-Rang: <strong>${n}</strong></span>
        <span>·</span>
        <span>Siege: <strong>${e.wins}</strong></span>
      </div>

      <button id="draft-overlay-confirm-btn" class="btn btn-primary" data-rider-id="${e.riderId}" style="margin-top: 1.5rem; width: 80%; padding: 0.75rem; font-size: 1.1rem; font-weight: bold; background: linear-gradient(135deg, #10b981, #059669); border: none; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
        FAHRER VERPFLICHTEN
      </button>
    </div>
  `}async function Ff(e){var a,r;const t=d.draftSelectedSeason||((a=d.currentSave)==null?void 0:a.currentSeason)||2026;Te("Fahrer wird verpflichtet...");try{const s=await Y.makeDraftPick(t,e);if(!s.success){alert("Fehler beim Entwurf des Fahrers: "+s.error);return}d.selectedDraftRiderId=null;const n=await Y.getDraftDetails(t);if(n.success&&n.data){const i=((r=d.draftOverlayPicks)==null?void 0:r.length)??0;d.draftOverlayPicks=n.data.picks,d.draftOverlayPicks&&d.draftOverlayPicks.length>i?(d.draftOverlayActive=!0,d.draftRevealShown=!1,$a(i)):Ua()}else Ua()}catch(s){alert("Fehler beim Übermitteln des Picks: "+s.message)}finally{ve()}}async function Ef(){var t;const e=d.draftSelectedSeason||((t=d.currentSave)==null?void 0:t.currentSeason)||2026;Te("Draft wird simuliert...");try{const a=await Y.quickCompleteDraft(e);if(!a.success){alert("Fehler beim Beenden des Drafts: "+a.error);return}await tr(),xa(),alert("Der Draft wurde erfolgreich abgeschlossen!")}catch(a){alert("Fehler beim Beenden des Drafts: "+a.message)}finally{ve()}}const Pf=Object.freeze(Object.defineProperty({__proto__:null,closeDraftOverlay:xa,currentDraftSort:nt,getDraftSortIndicator:od,getHeatmapStyleForRating:Js,getOpenSlotsForPick:wf,initDraftListeners:ld,loadDraftHistory:sr,renderDraftHeaderCell:Qe,renderDraftView:ts,revealCurrentPick:ud,showDraftPick:$a,startDraftPresentation:Gn,triggerDraftSchedule:fa},Symbol.toStringTag,{value:"Module"}));async function Nf(e=!1){const t=await Y.getInjuries();if(!t.success){d.injuries=null,Re("injuries")&&ro(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}d.injuries=t.data??[],Re("injuries")&&ro()}function ro(){const e=v("injuries-table-container");if(!d.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(v("injuries-meta").textContent=d.injuries.length+" Ausfälle",d.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=ka;let t="";const a=d.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),r=new Map;for(const n of a){const i=n.teamId;r.has(i)||r.set(i,[]),r.get(i).push(n)}for(const n of r.keys())r.get(n).sort((i,l)=>l.overallRating-i.overallRating);const s=Array.from(r.keys()).sort((n,i)=>{const l=r.get(n)[0].teamAbbreviation||"",c=r.get(i)[0].teamAbbreviation||"";return l.localeCompare(c)});if(s.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of s){const i=r.get(n),l=i[0].teamAbbreviation;t+=`
        <div style="margin-bottom: 2rem;">
          <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 0.5rem;">
            <img src="/jersey/Jer_${n}.png" style="width: 128px; height: 128px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));" onerror="this.style.display='none'">
            <h3 style="margin: 0; font-size: 1.5rem;">${S(l??"Team "+n)}</h3>
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
      `;for(const c of i){const o=c.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let m="";if(c.fitDate){const p=ce(c.fitDate);if(c.missedRaces&&c.missedRaces.length>0){let u="";for(const f of c.missedRaces)u+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${ce(f.startDate)}</span>
                  ${de(f.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${S(f.name)}</strong>
                  ${Tn(f.categoryName)}
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
            <td>${de(c.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${c.riderId})" style="color: inherit; text-decoration: none;"><strong>${S(c.riderFirstName)} ${S(c.riderLastName)}</strong></a></td>
            <td>${c.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${Rl(c.overallRating)}</span></td>
            <td>${o}</td>
            <td><strong>${c.unavailableDays} Tage</strong></td>
            <td>${m}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function so(e){return e===0?"–":`-${e}`}function Df(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${pt(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${De(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function Lf(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${S(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${Df(e.topRiders)}
      </div>
    </div>`}function _f(e,t){const a=t.filter(r=>r.teamId!=null&&e.teamId!=null&&r.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${pt(r.countryCode)}</span>
          <span class="season-standings-country-rider-name">${De(r.riderName??"–",{riderId:r.riderId,teamId:r.teamId,strong:!1})}</span>
          <strong>${r.points}</strong>
        </div>
      `).join("")}
    </div>`}function Af(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${rt(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${_f(e,t)}
      </div>
    </div>`}async function md(e){const t=d.seasonStandingsSelectedSeason??void 0,a=await Y.getSeasonStandings(t);if(!a.success){d.seasonStandings=null,Re("season-standings")&&Xs(),!e&&a.error&&alert(`Saisonwertung konnte nicht geladen werden:
`+a.error);return}d.seasonStandings=a.data??null,Re("season-standings")&&Xs()}function Xs(){var h,b,y,k,T,x,$,N;const e=v("season-standings-meta"),t=v("season-standings-scope-tabs"),a=v("season-standings-empty"),r=v("season-standings-table"),s=v("season-standings-tbody"),n=v("season-standings-jersey-header"),i=v("season-standings-primary-header"),l=v("season-standings-flag-header"),c=v("season-standings-secondary-header"),o=((h=d.seasonStandings)==null?void 0:h.season)??((b=d.gameState)==null?void 0:b.season)??((y=d.currentSave)==null?void 0:y.currentSeason)??null;e.textContent=o!=null?`Saison ${o} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.";const m=v("season-standings-year-select");if(m){const E=((k=d.seasonStandings)==null?void 0:k.availableSeasons)||[],R=d.seasonStandingsSelectedSeason??((T=d.gameState)==null?void 0:T.season)??2026;m.innerHTML=E.map(I=>`
      <option value="${I}" ${I===R?"selected":""}>Saison ${I}</option>
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
  `;const p=d.selectedSeasonStandingScope==="countries",u=p?((x=d.seasonStandings)==null?void 0:x.countryStandings)??[]:d.selectedSeasonStandingScope==="teams"?(($=d.seasonStandings)==null?void 0:$.teamStandings)??[]:((N=d.seasonStandings)==null?void 0:N.riderStandings)??[],f=p?u:[],g=p?[]:u;if(n.textContent="Trikot",i.textContent=p?"Land":d.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",l.textContent="Flagge",c.textContent=d.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",p),c.classList.toggle("hidden",p),!d.seasonStandings||u.length===0){s.innerHTML="",r.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}s.innerHTML=p?f.map(E=>`
      <tr>
        <td class="pos-${Math.min(E.rank,3)}">${E.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${Lf(E)}</td>
        <td class="results-flag-col-cell">${pt(E.countryCode)}</td>
        <td class="hidden"></td>
        <td>${E.points}</td>
        <td>${S(so(E.gapPoints))}</td>
      </tr>`).join(""):g.map(E=>{var G;const R=E.riderName??E.teamName,I=ra(E.teamId,E.teamName),_=d.selectedSeasonStandingScope==="teams"?Af(E,((G=d.seasonStandings)==null?void 0:G.riderStandings)??[]):sa(R,!0,!1,E.riderId,E.teamId),P=pt(E.countryCode),D=d.selectedSeasonStandingScope==="teams"?S(E.countryName??E.countryCode??"–"):rt(E.teamName??"–",E.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(E.rank,3)}">${E.rank}</td>
          <td class="results-jersey-col-cell">${I}</td>
          <td>${_}</td>
          <td class="results-flag-col-cell">${P}</td>
          <td>${D}</td>
          <td>${E.points}</td>
          <td>${S(so(E.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),r.classList.remove("hidden")}function Bf(){v("season-standings-scope-tabs").addEventListener("click",t=>{const a=t.target.closest("button[data-season-scope]");if(!a)return;const r=a.dataset.seasonScope;r!=="riders"&&r!=="teams"&&r!=="countries"||(d.selectedSeasonStandingScope=r,Xs())});const e=v("season-standings-year-select");e&&e.addEventListener("change",t=>{const a=t.target;d.seasonStandingsSelectedSeason=Number(a.value),md(!1)})}function no(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function Hf(e){const t=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,a=o=>o.skills.sprint*.7+o.skills.acceleration*.3,r=[...e].map(o=>({rider:o,score:t(o)})).sort((o,m)=>m.score-o.score).slice(0,10),s=[...e].map(o=>({rider:o,score:a(o)})).sort((o,m)=>m.score-o.score).slice(0,10),n=[...e].map(o=>({rider:o,score:o.skills.mountain})).sort((o,m)=>m.score-o.score).slice(0,10),i=[...e].map(o=>({rider:o,score:o.skills.hill})).sort((o,m)=>m.score-o.score).slice(0,10),l=[...e].map(o=>({rider:o,score:o.skills.cobble})).sort((o,m)=>m.score-o.score).slice(0,10),c=[...e].map(o=>({rider:o,score:o.skills.attack})).sort((o,m)=>m.score-o.score).slice(0,10);return{Gesamtklassement:r,Sprinter:s,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:l,Angreifer:c}}function zf(e,t){const a=d.riders.filter(l=>l.activeTeamId===e);if(a.length===0)return 0;const r=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,s=l=>l.skills.sprint*.7+l.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(l=>r(l)):t==="Sprinter"?n=a.map(l=>s(l)):t==="Bergfahrer"?n=a.map(l=>l.skills.mountain):t==="Hügelspezialist"?n=a.map(l=>l.skills.hill):t==="Pflasterspezialist"?n=a.map(l=>l.skills.cobble):t==="Angreifer"&&(n=a.map(l=>l.skills.attack)),n.sort((l,c)=>c-l);const i=n.slice(0,8);return i.length===0?0:i.reduce((l,c)=>l+c,0)/i.length}function Gf(e,t){var i;const r=d.teams.filter(l=>l.division==="WorldTour"||l.divisionName==="WorldTour").map(l=>({teamId:l.id,avgScore:zf(l.id,t)}));r.sort((l,c)=>c.avgScore-l.avgScore);const s=r.findIndex(l=>l.teamId===e)+1,n=((i=r.find(l=>l.teamId===e))==null?void 0:i.avgScore)??0;return{rank:s,total:r.length,average:n}}function Kf(e){const t=d.riders.filter(s=>s.activeTeamId===e);if(t.length===0)return 0;const a=t.map(s=>s.overallRating??0);a.sort((s,n)=>n-s);const r=a.slice(0,10);return r.length===0?0:r.reduce((s,n)=>s+n,0)/r.length}function Of(e){var n;const a=d.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:Kf(i.id)}));a.sort((i,l)=>l.avgScore-i.avgScore);const r=a.findIndex(i=>i.teamId===e)+1,s=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:r,total:a.length,average:s}}function Tr(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function wr(e){e.countryCode&&de(e.countryCode);const t=Hf(e.riders),a=[...e.riders].map(o=>({rider:o,formValue:o.formBonus+o.raceFormBonus})).sort((o,m)=>m.formValue-o.formValue).slice(0,10),r=[...e.riders].map(o=>({rider:o,uciRank:Xr(o.id)})).filter(o=>o.uciRank!==null).sort((o,m)=>o.uciRank-m.uciRank).slice(0,10),s=Object.entries(t).map(([o,m])=>{const p=Gf(e.teamId,o),u=p.average.toFixed(1).replace(".",","),f=m.map(({rider:g,score:h})=>{const b=`${g.firstName.charAt(0)}. ${g.lastName}`,y=De(b,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),k=g.nationality?He[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,T=k?`<span class="fi fi-${k} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",x=d.riders.find(N=>N.id===g.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${Tr((x==null?void 0:x.roleId)??null).color};">
            ${T}
            ${y}
          </span>
          <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${h.toFixed(0)}</span>
        </li>
      `}).join("");return`
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.5rem 0.75rem; border-radius: 6px;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
          ${o}
          <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-400); display: block; margin-top: 0.1rem;">Platz ${p.rank}/${p.total} · Ø ${u}</span>
        </h4>
        <ul style="margin: 0; padding: 0; list-style: none;">${f}</ul>
      </div>
    `}).join(""),i=[...e.riders].sort((o,m)=>(m.overallRating??0)-(o.overallRating??0)).slice(0,10).map(o=>{const m=`${o.firstName.charAt(0)}. ${o.lastName}`,p=De(m,{riderId:o.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),u=o.nationality?He[o.nationality]??o.nationality.slice(0,2).toLowerCase():null,f=u?`<span class="fi fi-${u} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(o.nationality)}"></span>`:"",g=o.overallRating.toFixed(0),h=d.riders.find(y=>y.id===o.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Tr((h==null?void 0:h.roleId)??null).color};">
          ${f}
          ${p}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g}</span>
      </li>
    `}).join(""),l=a.map(({rider:o,formValue:m})=>{const p=`${o.firstName.charAt(0)}. ${o.lastName}`,u=De(p,{riderId:o.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=o.nationality?He[o.nationality]??o.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(o.nationality)}"></span>`:"",h=(m>=0?"+":"")+m.toFixed(1).replace(".",","),b=`S-Form: ${o.formBonus>=0?"+":""}${o.formBonus.toFixed(1)} / R-Form: ${o.raceFormBonus>=0?"+":""}${o.raceFormBonus.toFixed(1)}`,y=d.riders.find(T=>T.id===o.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Tr((y==null?void 0:y.roleId)??null).color};">
          ${g}
          ${u}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${b}">${h}</span>
      </li>
    `}).join(""),c=r.map(({rider:o,uciRank:m})=>{const p=`${o.firstName.charAt(0)}. ${o.lastName}`,u=De(p,{riderId:o.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=o.nationality?He[o.nationality]??o.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(o.nationality)}"></span>`:"";let h="rider-stats-rank-badge-gc";m===1?h="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":m===2?h="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":m===3&&(h="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const b=`<span class="rider-stats-rank-badge ${h}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${m}">${m}</span>`,y=d.riders.find(T=>T.id===o.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Tr((y==null?void 0:y.roleId)??null).color};">
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
          <ul style="margin: 0; padding: 0; list-style: none;">${l||'<li class="text-muted" style="font-size:0.85rem;">Keine Daten vorhanden</li>'}</ul>
        </div>
        <div style="background: rgba(59, 130, 246, 0.02); border: 1px solid rgba(59, 130, 246, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; font-weight: bold; color: #3b82f6;">Die 10 besten Fahrer (UCI Weltrangliste)</h4>
          <ul style="margin: 0; padding: 0; list-style: none;">${c||'<li class="text-muted" style="font-size:0.85rem;">Keine Fahrer platziert</li>'}</ul>
        </div>
      </div>
    </div>
  `}function Mr(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${d.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${d.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${d.teamStatsTab==="contracts"?"true":"false"}">Kader & Verträge</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="transfers"?" team-detail-page-tab-active":""}" data-team-stats-tab="transfers" aria-selected="${d.teamStatsTab==="transfers"?"true":"false"}">Transfers</button>
    </div>`}function jf(e){const t=Array.from(new Set(e.topResults.map(u=>u.raceCategoryName).filter(Boolean)));t.sort((u,f)=>u.localeCompare(f,"de"));const a=Array.from(new Set(e.topResults.map(u=>u.season))).sort((u,f)=>f-u);let r=e.topResults.filter(u=>u.rowType!=="stage_result"?u.rowType==="gc_final"?d.teamStatsTopResultsFilters.gc:u.rowType==="mountain_final"?d.teamStatsTopResultsFilters.mountain:u.rowType==="points_final"?d.teamStatsTopResultsFilters.points:u.rowType==="youth_final"?d.teamStatsTopResultsFilters.youth:u.rowType==="breakaway_final"?d.teamStatsTopResultsFilters.breakaway:!0:u.isStageRace?d.teamStatsTopResultsFilters.stage:d.teamStatsTopResultsFilters.oneDay);if(d.teamStatsTopResultsFilterCategory){const u=d.teamStatsTopResultsFilterCategory;if(u.endsWith("-etappen")){const f=u.substring(0,u.length-8);r=r.filter(g=>g.raceCategoryName===f&&g.rowType==="stage_result")}else if(u.endsWith("-gc")){const f=u.substring(0,u.length-3);r=r.filter(g=>g.raceCategoryName===f&&g.rowType!=="stage_result")}else r=r.filter(f=>f.raceCategoryName===u)}d.teamStatsTopResultsFilterSeason!=null&&(r=r.filter(u=>u.season===d.teamStatsTopResultsFilterSeason)),d.teamStatsTopResultsFilterRank!=null&&!isNaN(d.teamStatsTopResultsFilterRank)&&(r=r.filter(u=>u.resultRank!=null&&u.resultRank<=d.teamStatsTopResultsFilterRank)),d.teamStatsTopResultsFilterProfile&&(r=r.filter(u=>u.profile===d.teamStatsTopResultsFilterProfile)),r.sort((u,f)=>{if(f.seasonPoints!==u.seasonPoints)return f.seasonPoints-u.seasonPoints;const g=u.rowType!=="stage_result",h=f.rowType!=="stage_result",b=u.resultRank??9999,y=f.resultRank??9999;if(d.teamStatsTopResultsFilterCategory)return b!==y?b-y:g!==h?g?-1:1:0;{const k=no(u.raceCategoryName),T=no(f.raceCategoryName);return k!==T?k-T:g!==h?g?-1:1:b-y}});const s=20,n=Math.max(1,Math.min(10,Math.ceil(r.length/s)));d.teamStatsTopResultsPage>n&&(d.teamStatsTopResultsPage=n);const i=(d.teamStatsTopResultsPage-1)*s,l=r.slice(i,i+s),o=`
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
          ${fe("Siege",d.teamStatsTopResultsFilterRank===1,"linear-gradient(135deg, #fbbf24, #d4af37)","#000","rgba(251, 191, 36, 0.4)","data-team-top-results-rank","1")}
        </div>
        <div style="grid-row: 2; grid-column: 1;">
          ${fe("Top 3",d.teamStatsTopResultsFilterRank===3,"linear-gradient(135deg, #e2e8f0, #94a3b8)","#000","rgba(148, 163, 184, 0.4)","data-team-top-results-rank","3")}
        </div>

        <!-- Column 2: Top 5 / Top 10 -->
        <div style="grid-row: 1; grid-column: 2;">
          ${fe("Top 5",d.teamStatsTopResultsFilterRank===5,"linear-gradient(135deg, #d97706, #b45309)","#fff","rgba(217, 119, 6, 0.4)","data-team-top-results-rank","5")}
        </div>
        <div style="grid-row: 2; grid-column: 2;">
          ${fe("Top 10",d.teamStatsTopResultsFilterRank===10,"linear-gradient(135deg, #a16207, #78350f)","#fff","rgba(161, 98, 7, 0.4)","data-team-top-results-rank","10")}
        </div>

        <!-- Column 3: GC / [Empty] -->
        <div style="grid-row: 1; grid-column: 3;">
          ${fe("GC",d.teamStatsTopResultsFilters.gc,"linear-gradient(135deg, #facc15, #ca8a04)","#000","rgba(234, 179, 8, 0.4)","data-team-top-results-filter","gc")}
        </div>
        <div style="grid-row: 2; grid-column: 3;">
          <!-- Empty for GC single layout -->
        </div>

        <!-- Column 4: Punkte / Berg -->
        <div style="grid-row: 1; grid-column: 4;">
          ${fe("Punkte",d.teamStatsTopResultsFilters.points,"linear-gradient(135deg, #4ade80, #16a34a)","#fff","rgba(74, 222, 128, 0.4)","data-team-top-results-filter","points")}
        </div>
        <div style="grid-row: 2; grid-column: 4;">
          ${fe("Berg",d.teamStatsTopResultsFilters.mountain,"linear-gradient(135deg, #f87171, #dc2626)","#fff","rgba(239, 68, 68, 0.4)","data-team-top-results-filter","mountain")}
        </div>

        <!-- Column 5: Nachwuchs / Ausreißer -->
        <div style="grid-row: 1; grid-column: 5;">
          ${fe("Nachwuchs",d.teamStatsTopResultsFilters.youth,"linear-gradient(135deg, #ffffff, #e2e8f0)","#0f172a","rgba(255, 255, 255, 0.4)","data-team-top-results-filter","youth")}
        </div>
        <div style="grid-row: 2; grid-column: 5;">
          ${fe("Ausreißer",d.teamStatsTopResultsFilters.breakaway,"linear-gradient(135deg, #c084fc, #7c3aed)","#fff","rgba(168, 85, 247, 0.4)","data-team-top-results-filter","breakaway")}
        </div>

        <!-- Column 6: Etappen / One Day -->
        <div style="grid-row: 1; grid-column: 6;">
          ${fe("Etappen",d.teamStatsTopResultsFilters.stage,"linear-gradient(135deg, #60a5fa, #2563eb)","#fff","rgba(59, 130, 246, 0.4)","data-team-top-results-filter","stage")}
        </div>
        <div style="grid-row: 2; grid-column: 6;">
          ${fe("One Day",d.teamStatsTopResultsFilters.oneDay,"linear-gradient(135deg, #b91c1c, #7f1d1d)","#fff","rgba(185, 28, 28, 0.4)","data-team-top-results-filter","oneDay")}
        </div>
      </div>
    </div>
  `,m=l.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':l.map(u=>{const f=u.rowType!=="stage_result",g=f?`${u.raceName} · ${ms(u.rowType)}`:u.stageNumber&&u.isStageRace?`${u.raceName} · Etappe ${u.stageNumber}`:u.raceName;let h="–",b="–";u.finishStatus==="otl"?h=Jt("OTL","place"):u.finishStatus==="dnf"?h=Jt("DNF","place"):u.resultRank==null||(f?b=`<span class="rider-stats-final-type ${wn(u.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${u.resultRank}</span>`:h=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${u.resultRank<=3?` rider-stats-rank-badge-top-${u.resultRank}`:""}">${S(String(u.resultRank))}</span>`);const y=u.profile?rr(u.profile):"–",k=!f&&u.stageScore!=null&&u.stageScore>0?us(u.stageScore,0,350):"–",T=qr(u.raceCategoryName),x=u.riderCountryCode?He[u.riderCountryCode]??u.riderCountryCode.slice(0,2).toLowerCase():null,$=x?`<span class="fi fi-${x} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(u.riderCountryCode??"")}"></span>`:"–",N=De(u.riderName,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${h}</td>
            <td>${b}</td>
            <td>${$}</td>
            <td style="white-space: nowrap;">${N}</td>
            <td><strong>${S(g)}</strong></td>
            <td class="status-cell">${Mn(u)}</td>
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
      ${o}
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
  `}function Wf(e){const t=String(d.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,superteamCount:0,categories:{}},r=t==="all",s=p=>r?p:"–",n=(p,u)=>r?`${p} / ${u} T`:"–",i=r?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',l=(p,u,f,g)=>{const h=typeof p=="number"?p:parseFloat(String(p))||0;let b="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return h===0?b+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":u==="gold"?b+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":u==="silver"?b+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":u==="bronze"?b+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":u==="purple"?b+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":u==="green"?b+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":u==="red"?b+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":u==="white"&&(b+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${b}" title="${S(f)}: ${h} Siege">${p}</span>`},c=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],o=`
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
      ${o}
      
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
                ${Tn(p.key)}
              </div>
              
              ${p.isStage?`
                <!-- Stage Race layout: GC & Classifications -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">GC & Wertungen</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${l(u.gcWins,"gold","Gesamtwertung Siege")}
                    ${l(u.gcSecond,"silver","Gesamtwertung Platz 2")}
                    ${l(u.gcThird,"bronze","Gesamtwertung Platz 3")}
                    ${l(u.gcTopTen||0,"purple","Gesamtwertung Ränge 4-10")}
                    <span style="border-left: 1px solid rgba(255,255,255,0.15); height: 1rem; margin: 0 0.1rem; display: inline-block;"></span>
                    ${l(u.mountainWins,"red","Bergwertung Siege")}
                    ${l(u.pointsWins,"green","Punktewertung Siege")}
                    ${l(u.youthWins,"white","Nachwuchswertung Siege")}
                    ${l(u.breakawayWins||0,"purple","Ausreißerwertung Siege")}
                  </div>
                </div>
                
                <!-- Etappenergebnisse -->
                <div style="overflow: hidden; white-space: nowrap;">
                  <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Etappenergebnisse</div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; overflow: hidden; white-space: nowrap;">
                    ${l(u.stageWins,"gold","Etappensiege")}
                    ${l(u.stageSecond,"silver","Etappen Platz 2")}
                    ${l(u.stageThird,"bronze","Etappen Platz 3")}
                    ${l(u.stageTopTen||0,"purple","Etappen Ränge 4-10")}
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
                    ${l(u.oneDayWins,"gold","Siege")}
                    ${l(u.oneDaySecond,"silver","Platz 2")}
                    ${l(u.oneDayThird,"bronze","Platz 3")}
                    ${l(u.oneDayTopTen||0,"purple","Ränge 4-10")}
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
                  ${l(u.sprintWins||0,"green","Sprint: Gewonnene Zwischensprints")}
                  ${l(u.climbWinsHC||0,"red","HC: Gewonnene HC-Bergwertungen")}
                  ${l(u.climbWins1||0,"red","C1: Gewonnene Bergwertungen Kategorie 1")}
                  ${l(u.climbWins2||0,"red","C2: Gewonnene Bergwertungen Kategorie 2")}
                  ${l(u.climbWins3||0,"red","C3: Gewonnene Bergwertungen Kategorie 3")}
                  ${l(u.climbWins4||0,"red","C4: Gewonnene Bergwertungen Kategorie 4")}
                </div>
              </div>

              <!-- Profil Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Profil Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${he(u.winFlat||0,"flat","Flach (Flat)")}
                  ${he(u.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${he(u.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${he(u.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${he(u.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${he(u.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${he(u.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${he(u.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${he(u.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${he(u.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${he(u.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${Ne(u.winWeather1||0,1,"Sonnig")}
                  ${Ne(u.winWeather2||0,2,"Extreme Hitze")}
                  ${Ne(u.winWeather3||0,3,"Leichter Regen")}
                  ${Ne(u.winWeather4||0,4,"Starkregen")}
                  ${Ne(u.winWeather5||0,5,"Starker Wind")}
                  ${Ne(u.winWeather6||0,6,"Dichter Nebel")}
                  ${Ne(u.winWeather7||0,7,"Schnee/Eis")}
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
  `}function Vf(e){var p;const t=e.historyRosters||{},a=Object.keys(t).map(Number).sort((u,f)=>u-f);if(a.length===0)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Kader- und Vertragsdaten vorhanden</h3>
        <p>Für dieses Team wurden keine Verträge in der Datenbank erfasst.</p>
      </section>
    `;if(d.teamStatsSelectedRosterYear===null||!a.includes(d.teamStatsSelectedRosterYear)){const u=((p=d.gameState)==null?void 0:p.season)??2026;a.includes(u)?d.teamStatsSelectedRosterYear=u:d.teamStatsSelectedRosterYear=a[0]}const r=d.teamStatsSelectedRosterYear,n=[...t[r]||[]],i=d.teamStatsRosterSort.key,l=d.teamStatsRosterSort.direction;n.sort((u,f)=>{let g=0;if(i==="nationality"){const h=u.nationality||"",b=f.nationality||"";g=h.localeCompare(b,"de")}else if(i==="name"){const h=`${u.lastName||""}, ${u.firstName||""}`,b=`${f.lastName||""}, ${f.firstName||""}`;g=h.localeCompare(b,"de")}else if(i==="overallRating")g=(u.overallRating||0)-(f.overallRating||0);else if(i==="potential")g=(u.potential||0)-(f.potential||0);else if(i==="roleName"){const h=u.roleName||"",b=f.roleName||"";g=h.localeCompare(b,"de")}else i==="contractEndSeason"&&(g=(u.contractEndSeason||0)-(f.contractEndSeason||0));return l==="asc"?g:-g});const c=a.map(u=>`
    <option value="${u}" ${u===r?"selected":""}>Kader ${u}</option>
  `).join(""),o=u=>d.teamStatsRosterSort.key!==u?' <span style="opacity: 0.3; font-size: 0.75rem;">↕</span>':d.teamStatsRosterSort.direction==="asc"?' <span style="font-size: 0.75rem;">▲</span>':' <span style="font-size: 0.75rem;">▼</span>',m=n.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Fahrer für dieses Jahr unter Vertrag.</td></tr>':n.map(u=>{const f=u.nationality?He[u.nationality]??u.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(u.nationality)}"></span>`:"–",h=De(`${u.firstName} ${u.lastName}`,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),b=`<span class="results-roster-overall-badge" style="color:${io(u.overallRating)}" title="Stärke: ${u.overallRating.toFixed(2)}">${u.overallRating.toFixed(1)}</span>`;let y="–";u.potential!=null&&(y=`<span class="results-roster-overall-badge" style="color:${io(u.potential)}" title="Potential: ${u.potential.toFixed(2)}">${u.potential.toFixed(1)}</span>`);const k=S(u.roleName||"-"),T=u.contractEndSeason?`Saison ${u.contractEndSeason}`:"Ohne Vertrag",$=u.contractEndSeason===r?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${S(T)}</span>`:`<span style="font-weight: 500;">${S(T)}</span>`;return`
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
              <th data-team-roster-sort="nationality" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Nat${o("nationality")}</th>
              <th data-team-roster-sort="name" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: left;">Fahrer${o("name")}</th>
              <th data-team-roster-sort="overallRating" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Gesamtstärke${o("overallRating")}</th>
              <th data-team-roster-sort="potential" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Pot. Gesamtstärke${o("potential")}</th>
              <th data-team-roster-sort="roleName" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Rolle${o("roleName")}</th>
              <th data-team-roster-sort="contractEndSeason" style="padding: 0.75rem 1rem; color: #94a3b8; font-weight: 600; text-align: center;">Vertragsende${o("contractEndSeason")}</th>
            </tr>
          </thead>
          <tbody>
            ${m}
          </tbody>
        </table>
      </div>
    </section>
  `}function io(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function Ns(e){if(!e)return null;const t=e.toLowerCase();return t==="berg"||t==="climber"?"Berg":t==="hill"||t==="puncher"?"Hügel":t==="sprint"||t==="sprinter"?"Sprint":t==="timetrial"||t==="time_trial"||t==="time trialist"||t==="zf"?"Zeitfahren":t==="cobble"||t==="classic"||t==="pave"?"Cobble":e}function oo(e){if(!e)return 99;const t=e.toLowerCase().replace(/_/g," ").replace(/-/g," ");return t==="kapitaen"||t==="kapitän"?1:t==="co kapitaen"||t==="co kapitän"?2:t==="sprinter"?3:t==="edelhelfer"?4:t==="starke helfer"||t==="starker helfer"?5:t==="wassertraeger"||t==="wasserträger"?6:98}function Uf(e){if(!e)return"Helfer";const t=e.toLowerCase().replace(/_/g," ").replace(/-/g," ");return t==="kapitaen"||t==="kapitän"?"Kapitän":t==="co kapitaen"||t==="co kapitän"?"Co-Kapitän":t==="sprinter"?"Sprinter":t==="edelhelfer"?"Edelhelfer":t==="starke helfer"||t==="starker helfer"?"Starker Helfer":t==="wassertraeger"||t==="wasserträger"?"Wasserträger":e}function Yf(e){var f;const t=e.transfers||{},a=Object.keys(t).map(Number).sort((g,h)=>h-g);if(a.length===0)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Transferdaten vorhanden</h3>
        <p>Für dieses Team wurden keine Transfers erfasst.</p>
      </section>
    `;let r=typeof d.teamStatsSelectedSeason=="number"?d.teamStatsSelectedSeason:((f=d.gameState)==null?void 0:f.season)??2026;a.includes(r)||(r=a[0]);const s=a.map(g=>`
    <option value="${g}" ${g===r?"selected":""}>Saison ${g}</option>
  `).join(""),n=t[r]||{incoming:[],outgoing:[]},i=g=>{const h=[],b=Ns(g.specialization1),y=Ns(g.specialization2),k=Ns(g.specialization3);return b&&h.push(b),y&&h.push(y),k&&h.push(k),h.length>0?h.join(" · "):"Allrounder"},l=(g,h)=>{const b=g.nationality?He[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,y=b?`<span class="fi fi-${b} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",k=i(g),T=De(`${g.firstName} ${g.lastName}`,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});let x="";if(h==="incoming")x=`<span style="color: #64748b; font-size: 0.8rem; font-weight: normal; margin-left: 0.35rem;">(${g.fromTeamName?S(g.fromTeamName):"Freier Fahrer"})</span>`;else{const $=g.toTeamName?`zu: ${g.toTeamName}`:g.isRetired?"Karriereende":"Freier Fahrer";x=`<span style="color: #64748b; font-size: 0.8rem; font-weight: normal; margin-left: 0.35rem;">(${S($)})</span>`}return`
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
          <div style="font-size: 0.85rem; font-weight: bold; color: #facc15;">${S(Uf(g.roleName))}</div>
        </div>
      </div>
    `},c=g=>[...g].sort((h,b)=>{const y=oo(h.roleName),k=oo(b.roleName);return y!==k?y-k:(b.overallRating||0)-(h.overallRating||0)}),o=c(n.incoming),m=c(n.outgoing),p=o.length===0?'<div style="color: #64748b; font-style: italic; text-align: center; padding: 2rem;">Keine Zugänge in dieser Saison.</div>':o.map(g=>l(g,"incoming")).join(""),u=m.length===0?'<div style="color: #64748b; font-style: italic; text-align: center; padding: 2rem;">Keine Abgänge in dieser Saison.</div>':m.map(g=>l(g,"outgoing")).join("");return`
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
  `}function Ve(e){return d.teamStatsTab==="career"?`
      ${wr(e)}
      ${Mr()}
      ${Wf(e)}
    `:d.teamStatsTab==="contracts"?`
      ${wr(e)}
      ${Mr()}
      ${Vf(e)}
    `:d.teamStatsTab==="transfers"?`
      ${wr(e)}
      ${Mr()}
      ${Yf(e)}
    `:`
    ${wr(e)}
    ${Mr()}
    ${jf(e)}
  `}function Zf(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((r=d.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${S(a)}" aria-label="${S(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S(sn(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function Kn(e){var n;d.teamStatsSelectedTeamId=e,d.teamStatsTab="topResults",d.teamStatsTopResultsFilterCategory=null,d.teamStatsTopResultsFilterSeason=null,d.teamStatsTopResultsFilterRank=null,d.teamStatsTopResultsFilterProfile=null,d.teamStatsSelectedSeason="all",d.teamStatsSelectedRosterYear=((n=d.gameState)==null?void 0:n.season)??2026,d.teamStatsRosterSort={key:"overallRating",direction:"desc"},d.teamStatsTopResultsPage=1;const t=d.teams.find(i=>i.id===e);v("team-stats-title").innerHTML=t?`Team <strong>${S(t.name)}</strong>`:"Teamstatistik",v("team-stats-jersey").innerHTML=Zf(e,(t==null?void 0:t.name)??"");const a=Of(e),r=a.average.toFixed(2).replace(".",",");v("team-stats-meta").innerHTML=t?`${S(t.abbreviation)} · ${S(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${r})`:"Daten werden geladen",v("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,ft("teamStats");const s=await Y.getTeamStats(e);if(d.teamStatsSelectedTeamId===e){if(!s.success||!s.data){v("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}d.teamStatsPayload=s.data,v("team-stats-body").innerHTML=Ve(s.data)}}function Jf(){v("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-top-results-rank]");if(a){const l=a.dataset.teamTopResultsRank,c=l==="all"?null:Number(l);d.teamStatsTopResultsFilterRank=d.teamStatsTopResultsFilterRank===c?null:c,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload));return}const r=t.closest("button[data-team-top-results-filter]");if(r){const l=r.dataset.teamTopResultsFilter;d.teamStatsTopResultsFilters[l]=!d.teamStatsTopResultsFilters[l],d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload));return}const s=t.closest("button[data-team-stats-tab]");if(s){const l=s.dataset.teamStatsTab;(l==="topResults"||l==="career"||l==="contracts"||l==="transfers")&&(d.teamStatsTab=l,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload)));return}const n=t.closest("button[data-team-top-results-page]");if(n){const l=Number(n.dataset.teamTopResultsPage);!isNaN(l)&&l>=1&&(d.teamStatsTopResultsPage=l,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload)));return}const i=t.closest("th[data-team-roster-sort]");if(i){const l=i.dataset.teamRosterSort;l&&(d.teamStatsRosterSort.key===l?d.teamStatsRosterSort.direction=d.teamStatsRosterSort.direction==="asc"?"desc":"asc":(d.teamStatsRosterSort.key=l,d.teamStatsRosterSort.direction=l==="overallRating"||l==="potential"||l==="contractEndSeason"?"desc":"asc"),d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload)));return}}),v("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;d.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;d.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload))}else if(t.id==="team-stats-filter-profile"){const a=t;d.teamStatsTopResultsFilterProfile=a.value==="all"?null:a.value,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;d.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload))}else if(t.id==="team-stats-roster-year-select"){const a=t;d.teamStatsSelectedRosterYear=Number(a.value),d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload))}else if(t.id==="team-stats-transfers-season-select"){const a=t;d.teamStatsSelectedSeason=Number(a.value),d.teamStatsPayload&&(v("team-stats-body").innerHTML=Ve(d.teamStatsPayload))}})}let aa="riders",Tt="season",On="season",gt="";const as=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function qf(){const e=v("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const l=i.getAttribute("data-scope");Qf(l)})})}const t=v("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const l=i.getAttribute("data-period");eh(l)})})}as.forEach(n=>{const i=v(n);i&&i.addEventListener("change",()=>{const l=i.value;l?th(l,n):as.some(o=>{const m=v(o);return m&&m.value!==""})||(gt="",Ta())})}),window.openRiderStatsFromLeaderboard=ka,window.openTeamStatsFromLeaderboard=Kn;const a=v("leaderboard-filter-wt"),r=v("leaderboard-filter-pt"),s=v("leaderboard-filter-other");[a,r,s].forEach(n=>{n&&n.addEventListener("change",()=>{Ta()})})}function Xf(){Ta()}function Qf(e){aa=e;const t=v("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&((ah(gt)||gt==="strongest_lieutenants")&&(rh(),gt=""),Tt==="live"&&(Tt=On,Nr())),Ta()}function eh(e){Tt=e,On=e,Ta()}function th(e,t){gt=e,as.forEach(a=>{if(a!==t){const r=v(a);r&&(r.value="")}}),pd(e)?(Tt="live",Nr()):jn(e)?(Tt="alltime",Nr()):(Tt=On,Nr()),Ta()}function pd(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function jn(e){return["mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function ah(e){return pd(e)||jn(e)||e==="mentors_ranking"}function rh(){as.forEach(e=>{const t=v(e);t&&(t.value="")})}function Nr(){const e=v("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');Tt==="live"?e.style.display="none":(e.style.display="flex",jn(gt)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),Tt==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function Ta(){var p,u,f;const e=v("leaderboard-empty"),t=v("leaderboard-table"),a=v("leaderboard-thead"),r=v("leaderboard-tbody");if(!e||!t||!a||!r)return;const s=v("leaderboard-filter-container");if(s&&(s.style.display=aa==="teams"?"none":"flex"),!gt){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await Y.getLeaderboards(aa,gt,Tt);if(!Re("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(aa==="riders"){const g=((p=v("leaderboard-filter-wt"))==null?void 0:p.checked)??!0,h=((u=v("leaderboard-filter-pt"))==null?void 0:u.checked)??!0,b=((f=v("leaderboard-filter-other"))==null?void 0:f.checked)??!1;if(i=n.data.filter(y=>{const k=y.teamDivisionId===1&&!y.isRetired,T=y.teamDivisionId===2&&!y.isRetired,x=y.teamDivisionId===null||y.teamDivisionId===void 0||y.isRetired||y.teamDivisionId!==1&&y.teamDivisionId!==2;return!!(k&&g||T&&h||x&&b)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const l=gt==="highest_leadout_bonus",c=gt==="strongest_lieutenants";aa==="riders"?a.innerHTML=`
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 50px; text-align: center;">Trikot</th>
        <th style="width: 60px; text-align: center;">Land</th>
        <th>Fahrer</th>
        <th>Team</th>
        ${l?"<th>Rennen / Etappe / Jahr</th>":""}
        ${c?"<th>Fährt für</th>":""}
        <th style="text-align: right; width: 180px;">Wert</th>
      </tr>
    `:a.innerHTML=`
      <tr>
        <th style="width: 60px; text-align: center;">Platz</th>
        <th style="width: 60px; text-align: center;">Trikot</th>
        <th>Team</th>
        ${l?"<th>Rennen / Etappe / Jahr</th>":""}
        <th style="text-align: right; width: 180px;">Wert</th>
      </tr>
    `;let o="",m=1;for(const g of i){const h=m++,y=`<span class="badge ${h===1?"badge-primary":h<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${h}</span>`,k=Mt(g.teamId,g.teamName);let T="";if(l){const $=g.stageNumber!=null?`Etappe ${g.stageNumber}`:"–";T=`<td style="vertical-align: middle;">${S(g.raceName??"–")} · ${S($)} · ${S(String(g.season??"–"))}</td>`}let x="";if(c)if(g.lieutenantDetails){const $=g.lieutenantDetails,N=$.leaderNationality?de($.leaderNationality):"",E=$.leaderRoleName?` (${$.leaderRoleName})`:"";x=`
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${N}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${$.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${S($.leaderFirstName)} ${S($.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${S(E)}</span>
            </span>
          </td>
        `}else x='<td style="vertical-align: middle;">–</td>';if(aa==="riders"){const $=g.nationality?de(g.nationality):"—",N=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${g.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.firstName)} ${S(g.lastName)}</a>`,E=g.teamAbbr&&g.teamId!=null?`<a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #94a3b8; text-decoration: none; hover: text-decoration: underline;" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</a>`:g.teamAbbr?`<span class="text-muted" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</span>`:"—";o+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${y}</td>
          <td style="text-align: center; vertical-align: middle;">${k}</td>
          <td style="text-align: center; vertical-align: middle;">${$}</td>
          <td style="vertical-align: middle;">${N}</td>
          <td style="vertical-align: middle;">${E}</td>
          ${T}
          ${x}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}else{let $="";if(g.leadoutDetails){const N=g.leadoutDetails,E=N.sprinterNationality?de(N.sprinterNationality):"";$=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">
            <a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
              ${S(g.teamName.split(" (Sprinter:")[0])}
            </a>
          </div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${E}${S(N.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${N.contributors.map(R=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${R.nationality?de(R.nationality):""}${S(R.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${R.contribution.toFixed(2)})</span>
                  </div>
                `).join("")}
            </div>
          </div>
        `}else $=`<strong><a href="#" onclick="event.preventDefault(); openTeamStatsFromLeaderboard(${g.teamId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.teamName??"")}</a></strong>`;o+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${y}</td>
          <td style="text-align: center; vertical-align: middle;">${k}</td>
          <td style="vertical-align: middle; padding: 0.6rem 0.75rem;">${$}</td>
          ${T}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}}r.innerHTML=o}let ha=2026,at=5,lo=!1;const sh=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function co(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${r}`}function nh(e){var s;const t=(s=d.gameState)==null?void 0:s.currentDate;if(!t||e<=t)return;const a=ce(e);confirm(`Möchtest du automatisch bis zum ${a} simulieren?`)&&(d.autoProgressTargetDate=e,Ql())}function ih(e,t){const a=[],r=new Date(e,t,1),s=new Date(e,t+1,0);let i=(r.getDay()+6)%7;const l=new Date(r);l.setDate(l.getDate()-i);const c=new Date(l);for(;c<=s||c.getDay()!==1;){const o=[];for(let m=0;m<7;m++)o.push(new Date(c)),c.setDate(c.getDate()+1);a.push(o)}return a}function oh(){if(lo)return;lo=!0,v("calendar-prev-month").addEventListener("click",()=>{at--,at<0&&(at=11,ha--),Dr()}),v("calendar-next-month").addEventListener("click",()=>{at++,at>11&&(at=0,ha++),Dr()}),v("calendar-today-btn").addEventListener("click",()=>{var t;if((t=d.gameState)!=null&&t.currentDate){const[a,r]=d.gameState.currentDate.split("-").map(Number);ha=a,at=r-1}Dr()}),v("calendar-race-search").addEventListener("input",()=>{gd()}),v("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&Ys(s);return}const r=t.target.closest("[data-calendar-date]");if(r){const s=r.dataset.calendarDate;s&&nh(s)}}),v("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&Ys(r);return}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.remove("calendar-highlight")})}},!0))}function lh(){var e;if((e=d.gameState)!=null&&e.currentDate){const[t,a]=d.gameState.currentDate.split("-").map(Number);ha=t,at=a-1}Dr()}function Dr(){var s;if(!Re("calendar"))return;v("calendar-month-label").textContent=`${sh[at]} ${ha}`;const e=ih(ha,at),t=v("calendar-weeks"),a=((s=d.gameState)==null?void 0:s.currentDate)??"";let r="";for(const n of e){const i=n.map(co),l=[];for(const p of d.races)if(p.startDate<=i[6]&&p.endDate>=i[0]){const u=p.startDate<i[0]?0:i.indexOf(p.startDate),f=p.endDate>i[6]?6:i.indexOf(p.endDate);l.push({race:p,startIdx:u,endIdx:f})}l.sort((p,u)=>{const f=p.endIdx-p.startIdx+1,g=u.endIdx-u.startIdx+1;return g!==f?g-f:p.startIdx-u.startIdx});const c=Array.from({length:4},()=>Array(7).fill(!1));for(const p of l){let u=3;for(let f=0;f<4;f++){let g=!0;for(let h=p.startIdx;h<=p.endIdx;h++)if(c[f][h]){g=!1;break}if(g){u=f;break}}for(let f=p.startIdx;f<=p.endIdx;f++)c[u][f]=!0;p.slot=u}const o=n.map(p=>{const u=co(p),f=p.getMonth()!==at,g=u===a,h=u>a;return`
        <div class="${["calendar-day-cell",f?"other-month":"",g?"today":"",h?"is-future":""].filter(Boolean).join(" ")}" data-calendar-date="${u}">
          <span class="calendar-day-number" data-calendar-date="${u}">${p.getDate()}</span>
        </div>
      `}).join(""),m=l.map(p=>{var T;const u=p.race,f=a>=u.startDate&&a<=u.endDate,g=a>u.endDate,h=dt((T=u.category)==null?void 0:T.name),b=f?'<span class="calendar-live-dot"></span>':"",y=g?"opacity: 0.55;":"",k=p.endIdx-p.startIdx+1;return`
        <div class="calendar-event-bar ${f?"is-live":""}"
             data-race-id="${u.id}"
             style="grid-column: ${p.startIdx+1} / span ${k};
                    grid-row: ${p.slot+1};
                    background-color: ${h.background};
                    border: 1px solid ${h.border};
                    color: ${h.color};
                    ${y}"
             title="${S(u.name)} (${ce(u.startDate)} - ${ce(u.endDate)})">
          ${b}<span class="calendar-event-name">${S(u.name)}</span>
        </div>
      `}).join("");r+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${o}</div>
        <div class="calendar-event-overlay">${m}</div>
      </div>
    `}t.innerHTML=r,gd()}function gd(){var n;const e=v("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=v("calendar-races-tbody"),r=((n=d.gameState)==null?void 0:n.currentDate)??"",s=d.races.filter(i=>{var l;return t?i.name.toLowerCase().includes(t)||((l=i.category)==null?void 0:l.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,l)=>i.startDate.localeCompare(l.startDate));if(s.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=s.map(i=>{var b,y,k,T;const l=r>=i.startDate&&r<=i.endDate,o=r>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':l?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',m=((b=i.country)==null?void 0:b.name)??`Land ${i.countryId}`,p=(y=i.country)!=null&&y.code3?de(i.country.code3):"",u=i.isStageRace?(i.stages??[]).reduce((x,$)=>x+($.distanceKm??0),0):((k=i.upcomingStage)==null?void 0:k.distanceKm)??null,f=i.isStageRace?(i.stages??[]).reduce((x,$)=>x+($.elevationGainMeters??0),0):((T=i.upcomingStage)==null?void 0:T.elevationGainMeters)??null,g=u!=null?String(u.toFixed(1)).replace(".",","):"-",h=f!=null?String(Math.round(f)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${ce(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${S(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${_n(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${p}<span>${S(m)}</span></span></td>
        <td>${ps(i)}</td>
        <td>${g}</td>
        <td>${h}</td>
        <td>${o}</td>
      </tr>
    `}).join("")}let Nt=null,Dt=null,st="id",Ha=!0,ba="all",wt=new Set,Na="all",Ya=!1;const Qs=[[1,2,4],[13,14],[15,70],[62,63],[78,79],[88,90,91,92,64],[94,96]];function Fa(e){const t=e.split("_"),a=t[t.length-1],r=parseInt(a,10);return isNaN(r)?1:r}function ke(e,t){return(e.split("_")[0]||"").charAt(t-1)||""}function Wn(e,t){const a=e.toLowerCase(),r=a.includes("cobble")&&!a.includes("non_cobble")&&!a.includes("non cobble")&&!a.includes("non-cobble");return t==="cobble"?r:t==="non-cobble"?!r:!0}function qt(e){const t=new Date(e);t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));const a=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t.getTime()-a.getTime())/864e5+1)/7)}function wa(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return"peak";const r=n=>{const i=n-8,l=n-1;if(i>=1)return t>=i&&t<=l;{const c=i+53;return t>=c||t<=l}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)?"prep":"none"}function fd(e){return e==="peak"?"cell-peak":e==="prep"?"cell-prep":""}function dh(e,t){if(t.cachedKws){for(const s of t.cachedKws){const n=wa(e,s);if(n==="peak"||n==="prep")return!0}return!1}const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),l=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${l}`,o=qt(c),m=wa(e,o);if(m==="peak"||m==="prep")return!0}return!1}function uo(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return!0;const r=s=>{const n=s-6,i=s-1;if(n>=1)return t>=n&&t<=i;{const l=n+53;return t>=l||t<=i}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)}function ch(e,t){if(t.cachedKws){for(const s of t.cachedKws)if(uo(e,s))return!0;return!1}const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),l=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${l}`,o=qt(c);if(uo(e,o))return!0}return!1}function hd(e,t,a){const r=[{min:e.peak1_min,max:e.peak1_max},{min:e.peak2_min,max:e.peak2_max},{min:e.peak3_min,max:e.peak3_max}].sort((o,m)=>o.min-m.min);let s=0,n=0,i=0,l=0;const c=a.races.filter(o=>t.has(o.id));for(const o of c){if(o.cachedDays){o.cachedDays.forEach(u=>{const f=u.kw;f<=r[0].max?s++:f<=r[1].max?n++:f<=r[2].max?i++:l++});continue}const m=new Date(o.start_date),p=new Date(o.end_date);for(let u=new Date(m);u<=p;u.setDate(u.getDate()+1)){const f=u.getFullYear(),g=String(u.getMonth()+1).padStart(2,"0"),h=String(u.getDate()).padStart(2,"0"),b=`${f}-${g}-${h}`,y=qt(b);y<=r[0].max?s++:y<=r[1].max?n++:y<=r[2].max?i++:l++}}return{phase1:s,phase2:n,phase3:i,phase4:l}}function uh(e,t,a){let r;a.programToRacesMap?(r=new Set(a.programToRacesMap.get(e.id)||[]),r.delete(t.id)):r=new Set(a.raceProgramRaces.filter(c=>c.program_id===e.id&&c.race_id!==t.id).map(c=>c.race_id));const s=hd(e,r,a),n=new Set,i=[{min:e.peak1_min,max:e.peak1_max},{min:e.peak2_min,max:e.peak2_max},{min:e.peak3_min,max:e.peak3_max}].sort((c,o)=>c.min-o.min);if(t.cachedDays)t.cachedDays.forEach(c=>{const o=c.kw;o<=i[0].max?n.add("phase1"):o<=i[1].max?n.add("phase2"):o<=i[2].max?n.add("phase3"):n.add("phase4")});else{const c=new Date(t.start_date),o=new Date(t.end_date);for(let m=new Date(c);m<=o;m.setDate(m.getDate()+1)){const p=m.getFullYear(),u=String(m.getMonth()+1).padStart(2,"0"),f=String(m.getDate()).padStart(2,"0"),g=`${p}-${u}-${f}`,h=qt(g);h<=i[0].max?n.add("phase1"):h<=i[1].max?n.add("phase2"):h<=i[2].max?n.add("phase3"):n.add("phase4")}}const l=t.is_stage_race===1;for(const c of n)if(c==="phase1"){if(l&&s.phase1>35||!l&&s.phase1>36)return!1}else if(c==="phase2"){if(l&&s.phase2>35||!l&&s.phase2>36)return!1}else if(c==="phase3"&&(l&&s.phase3>35||!l&&s.phase3>36))return!1;return!0}function mh(e,t){const a=d.raceProgramsPayload;if(!a)return;const r=a.raceProgramRaces.findIndex(i=>i.program_id===e&&i.race_id===t),s=Ya?Qs.find(i=>i.includes(t)):null,n=s||[t];if(r===-1)for(const i of n){if(a.raceProgramRaces.some(o=>o.program_id===e&&o.race_id===i))continue;const c=a.races.find(o=>o.id===i);if(c){const o=c.start_date,m=c.end_date,p=[];a.raceProgramRaces.forEach((u,f)=>{if(u.program_id===e&&u.race_id!==i){const g=a.races.find(h=>h.id===u.race_id);g&&g.start_date<=m&&g.end_date>=o&&p.push(f)}}),p.sort((u,f)=>f-u).forEach(u=>{a.raceProgramRaces.splice(u,1)})}a.raceProgramRaces.push({program_id:e,race_id:i})}else for(const i of n){const l=a.raceProgramRaces.findIndex(c=>c.program_id===e&&c.race_id===i);l!==-1&&a.raceProgramRaces.splice(l,1)}d.raceProgramsDirty=!0,Fe()}const rs=(()=>{const e=[],t=new Date(2026,0,1),a=new Date(2026,11,31),r=["So","Mo","Di","Mi","Do","Fr","Sa"];for(let s=new Date(t);s<=a;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),l=String(s.getDate()).padStart(2,"0"),c=`${n}-${i}-${l}`,o=`${r[s.getDay()]}, ${l}.${String(s.getMonth()+1).padStart(2,"0")}`;e.push({dateStr:c,label:o,weekNum:qt(c)})}return e})();function ph(e){if(!e||e.enriched)return;e.races.forEach(r=>{const s=[],n=new Set,i=new Date(r.start_date),l=new Date(r.end_date);for(let c=new Date(i);c<=l;c.setDate(c.getDate()+1)){const o=c.getFullYear(),m=String(c.getMonth()+1).padStart(2,"0"),p=String(c.getDate()).padStart(2,"0"),u=`${o}-${m}-${p}`,f=qt(u);s.push({dateStr:u,kw:f}),n.add(f)}r.cachedDays=s,r.cachedKws=Array.from(n)});const t=new Map;rs.forEach(r=>{t.set(r.dateStr,[])}),e.races.forEach(r=>{r.cachedDays&&r.cachedDays.forEach(s=>{const n=t.get(s.dateStr);n&&n.push(r)})}),e.racesByDate=t;const a=new Map;e.programDistribution.forEach(r=>{a.set(r.program_id,r)}),e.distributionMap=a,e.enriched=!0}function en(e){if(!e)return;const t=new Map,a=new Map;e.raceProgramRaces.forEach(r=>{t.set(`${r.program_id}_${r.race_id}`,r),a.has(r.program_id)||a.set(r.program_id,new Set),a.get(r.program_id).add(r.race_id)}),e.assignmentMap=t,e.programToRacesMap=a}async function Vn(e=!1){if(d.raceProgramsPayload&&!e){en(d.raceProgramsPayload),wt.size===0&&d.raceProgramsPayload.raceCategories&&(wt=new Set(d.raceProgramsPayload.raceCategories.map(a=>a.id))),Fe();return}v("race-programs-root").innerHTML='<div class="results-empty">Programmdaten werden geladen...</div>';const t=await Y.getRaceProgramsEditor();if(!t.success||!t.data){v("race-programs-root").innerHTML=`<div class="results-empty text-danger">${S(t.error??"Fehler beim Laden.")}</div>`;return}d.raceProgramsPayload=t.data,ph(d.raceProgramsPayload),en(d.raceProgramsPayload),d.raceProgramsDirty=!1,d.raceProgramsSaving=!1,Nt=null,Dt=null,d.raceProgramsPayload&&d.raceProgramsPayload.raceCategories&&(wt=new Set(d.raceProgramsPayload.raceCategories.map(a=>a.id))),Fe()}function gh(){v("view-race-programs").addEventListener("click",e=>{const t=e.target,a=t.closest(".results-type-btn[data-tab]");if(a){const p=a.dataset.tab??"calendar-cols";d.raceProgramsActiveTab=p,Fe();return}const r=t.closest(".race-programs-action-btn");if(r){const p=r.dataset.action;p==="reload"?Vn(!0):p==="save"&&hh();return}const s=t.closest(".race-row-expand-btn");if(s){const p=s.dataset.raceId,u=v(`race-details-row-${p}`);u&&(u.classList.toggle("hidden"),s.textContent=u.classList.contains("hidden")?"▶":"▼");return}const n=t.closest(".program-row-expand-btn");if(n){const p=n.dataset.programId,u=v(`program-details-row-${p}`);u&&(u.classList.toggle("hidden"),n.textContent=u.classList.contains("hidden")?"▶":"▼");return}const i=t.closest(".program-roles-sort-header");if(i){const p=i.dataset.sortKey;st===p?Ha=!Ha:(st=p,Ha=p==="name"||p==="id"),Fe();return}const l=t.closest(".combo-origin-trigger");if(l){const p=l.dataset.raceId,u=l.dataset.comboKey,f=v(`combo-origin-${p}-${u}`);f&&f.classList.toggle("hidden");return}const c=t.closest(".race-popover-trigger");if(c){e.stopPropagation();const p=parseInt(c.dataset.raceId??"0",10);Dt=null,Nt===p?Nt=null:Nt=p,Fe();return}const o=t.closest(".race-rider-count-trigger");if(o){e.stopPropagation();const p=parseInt(o.dataset.raceId??"0",10);Nt=null,Dt===p?Dt=null:Dt=p,Fe();return}const m=t.closest(".popover-program-toggle");if(m){if(e.stopPropagation(),m.classList.contains("disabled"))return;const p=parseInt(m.dataset.programId??"0",10),u=parseInt(m.dataset.raceId??"0",10);mh(p,u);return}!t.closest(".race-stages-popover-card")&&!t.closest(".race-rider-programs-popover-card")&&(Nt!==null||Dt!==null)&&(Nt=null,Dt=null,Fe())}),v("view-race-programs").addEventListener("click",e=>{const t=e.target.closest(".toggleable-race-cell[data-day]");if(!t)return;const a=t.dataset.day,r=parseInt(t.dataset.programId,10);fh(r,a)}),v("view-race-programs").addEventListener("change",e=>{const t=e.target;if(t.classList.contains("filter-cobble-radio")){ba=t.value,Fe();return}if(t.classList.contains("popover-filter-cobble-radio")){Na=t.value,Fe();return}if(t.classList.contains("filter-category-checkbox")){const a=parseInt(t.dataset.categoryId,10);t.checked?wt.add(a):wt.delete(a),Fe();return}if(t.classList.contains("filter-auto-blocks-checkbox")){Ya=t.checked,Fe();return}})}function fh(e,t){const a=d.raceProgramsPayload;if(!a)return;const r=a.races.filter(n=>n.start_date<=t&&n.end_date>=t);if(r.length===0)return;const s=a.raceProgramRaces.findIndex(n=>n.program_id===e&&r.some(i=>i.id===n.race_id));if(s===-1){const n=r[0],i=Ya?Qs.find(c=>c.includes(n.id)):null,l=i||[n.id];for(const c of l){if(a.raceProgramRaces.some(p=>p.program_id===e&&p.race_id===c))continue;const m=a.races.find(p=>p.id===c);if(m){const p=m.start_date,u=m.end_date,f=[];a.raceProgramRaces.forEach((g,h)=>{if(g.program_id===e&&g.race_id!==c){const b=a.races.find(y=>y.id===g.race_id);b&&b.start_date<=u&&b.end_date>=p&&f.push(h)}}),f.sort((g,h)=>h-g).forEach(g=>{a.raceProgramRaces.splice(g,1)})}a.raceProgramRaces.push({program_id:e,race_id:c})}}else{const n=a.raceProgramRaces[s];if(Ya){const l=Qs.find(c=>c.includes(n.race_id));if(l){for(const c of l){const o=a.raceProgramRaces.findIndex(m=>m.program_id===e&&m.race_id===c);o!==-1&&a.raceProgramRaces.splice(o,1)}d.raceProgramsDirty=!0,Fe();return}}const i=r.findIndex(l=>l.id===n.race_id);i<r.length-1?n.race_id=r[i+1].id:a.raceProgramRaces.splice(s,1)}d.raceProgramsDirty=!0,Fe()}async function hh(){if(!d.raceProgramsPayload||d.raceProgramsSaving)return;d.raceProgramsSaving=!0,Fe();const e=await Y.saveRaceProgramsEditor({programs:d.raceProgramsPayload.programs,raceProgramRaces:d.raceProgramsPayload.raceProgramRaces});if(d.raceProgramsSaving=!1,!e.success){alert(`Fehler beim Speichern:
${e.error??"Unbekannter Fehler"}`),Fe();return}d.raceProgramsDirty=!1,Vn(!0)}function bs(e,t){let a=0,r=0,s=0,n;t.programToRacesMap?n=t.programToRacesMap.get(e.id)||new Set:n=new Set(t.raceProgramRaces.filter(l=>l.program_id===e.id).map(l=>l.race_id));const i=t.races.filter(l=>n.has(l.id));for(const l of i){if(l.cachedDays){l.cachedDays.forEach(m=>{const p=wa(e,m.kw);p==="peak"?a++:p==="prep"?r++:s++});continue}const c=new Date(l.start_date),o=new Date(l.end_date);for(let m=new Date(c);m<=o;m.setDate(m.getDate()+1)){const p=m.getFullYear(),u=String(m.getMonth()+1).padStart(2,"0"),f=String(m.getDate()).padStart(2,"0"),g=qt(`${p}-${u}-${f}`),h=wa(e,g);h==="peak"?a++:h==="prep"?r++:s++}}return{peak:a,prep:r,none:s}}function Fe(){const e=v("race-programs-root"),t=d.raceProgramsPayload;if(!t){e.innerHTML='<div class="results-empty">Keine Daten geladen.</div>';return}en(t);const a=window.scrollX,r=window.scrollY,s={},n=document.querySelector(".team-detail-table-scroll");n&&(s.table={scrollTop:n.scrollTop,scrollLeft:n.scrollLeft}),document.querySelectorAll(".popover-program-list-scroll").forEach(g=>{const h=g.getAttribute("data-race-id");h&&(s[`popover-${h}`]={scrollTop:g.scrollTop,scrollLeft:g.scrollLeft})});const l=d.raceProgramsDirty,c=d.raceProgramsSaving,o=d.raceProgramsActiveTab;function m(g){const h=g.raceCategories.map(b=>{const y=wt.has(b.id),k=dt(b.name);return`
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
            <input type="radio" name="filter-cobble-radio" class="filter-cobble-radio" value="all" ${ba==="all"?"checked":""}> Alle
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="radio" name="filter-cobble-radio" class="filter-cobble-radio" value="cobble" ${ba==="cobble"?"checked":""}> Cobble
          </label>
          <label style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
            <input type="radio" name="filter-cobble-radio" class="filter-cobble-radio" value="non-cobble" ${ba==="non-cobble"?"checked":""}> Non-Cobble
          </label>
        </div>

        <!-- Auto-Assign Blocks Option -->
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <label style="display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; font-weight: bold; cursor: pointer; user-select: none; color: var(--accent-h);">
            <input type="checkbox" class="filter-auto-blocks-checkbox" ${Ya?"checked":""}> Rennblöcke verkoppeln
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
          <button class="results-type-btn${o==="calendar-cols"?" active":""}" data-tab="calendar-cols">Kalender Programme (Spalten)</button>
          <button class="results-type-btn${o==="calendar-rows"?" active":""}" data-tab="calendar-rows">Kalender Programme (Zeilen)</button>
          <button class="results-type-btn${o==="rider-role"?" active":""}" data-tab="rider-role">Rider-Role Programme</button>
          <button class="results-type-btn${o==="program-roles"?" active":""}" data-tab="program-roles">Programm-Rollen</button>
        </div>
        <div class="race-programs-actions">
          <button type="button" class="btn btn-secondary race-programs-action-btn" data-action="reload">Neu laden</button>
          <button type="button" class="btn btn-primary race-programs-action-btn" data-action="save" ${!l||c?"disabled":""}>
            ${c?"Speichert…":"Änderungen exportieren"}
          </button>
        </div>
      </div>
  `;o==="calendar-cols"?(p+=m(t),p+=bh(t)):o==="calendar-rows"?(p+=m(t),p+=yh(t)):o==="rider-role"?p+=Sh(t):o==="program-roles"&&(p+=$h(t)),p+="</div>",e.innerHTML=p;const u=document.querySelector(".team-detail-table-scroll");u&&s.table&&(u.scrollTop=s.table.scrollTop,u.scrollLeft=s.table.scrollLeft),document.querySelectorAll(".popover-program-list-scroll").forEach(g=>{const h=g.getAttribute("data-race-id");h&&s[`popover-${h}`]&&(g.scrollTop=s[`popover-${h}`].scrollTop,g.scrollLeft=s[`popover-${h}`].scrollLeft)}),window.scrollTo(a,r)}function bh(e){var u,f,g;const t=e.programs,a=e.raceProgramRaces,r=e.races,s=e.programDistribution,n=e.distributionMap,i=e.racesByDate,l=e.assignmentMap,c=t.filter(h=>{const b=n?n.get(h.id):s.find(k=>k.program_id===h.id);return(b?parseInt(b.deterministic_rider_count||"0",10):0)===0?!1:Wn(h.name,ba)});c.sort((h,b)=>{let y=3;const k=ke(h.name,1),T=ke(h.name,2);k==="F"?y=1:T==="F"&&(y=2);let x=3;const $=ke(b.name,1),N=ke(b.name,2);return $==="F"?x=1:N==="F"&&(x=2),y!==x?y-x:h.name.localeCompare(b.name)});const o=c.map(h=>({id:h.id,stats:bs(h,e)}));let m=`<tr>
    <th class="sticky-col-header" style="z-index: 15;">Tag / Datum</th>
    <th style="width: 50px; text-align: center;">KW</th>
  `;for(const h of c){const b=(u=o.find(T=>T.id===h.id))==null?void 0:u.stats,y=n?n.get(h.id):s.find(T=>T.program_id===h.id),k=y?parseInt(y.deterministic_rider_count||"0",10):0;m+=`
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
    `}m+="</tr>";let p="";for(const h of rs){const b=(i?i.get(h.dateStr)||[]:r.filter($=>$.start_date<=h.dateStr&&$.end_date>=h.dateStr)).filter($=>wt.has($.category_id)),y=b.length>0,k=y?"row-has-races":"";let T="";if(y){T='<div style="display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.15rem;">';for(const $ of b){const N=dt((f=$.category)==null?void 0:f.name);T+=`
          <span class="race-id-badge" style="background-color: ${N.background}; border: 1px solid ${N.border}; color: ${N.color}; font-size: 0.65rem; padding: 0.05rem 0.2rem; text-align: left; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${S($.name)}">
            ${S($.name)}
          </span>
        `}T+="</div>"}let x=`
      <td class="sticky-col ${k}" style="font-weight: 600; vertical-align: top; padding: 0.4rem 0.6rem;">
        <div>${h.label}</div>
        ${T}
      </td>
      <td style="text-align: center; color: var(--text-500); font-variant-numeric: tabular-nums; vertical-align: top; padding-top: 0.4rem;">${h.weekNum}</td>
    `;for(const $ of c){const N=wa($,h.weekNum),E=fd(N);let R=null;if(l)for(const D of b){const G=`${$.id}_${D.id}`,B=l.get(G);if(B){R=B;break}}else R=a.find(D=>D.program_id===$.id&&b.some(G=>G.id===D.race_id));let I="",_=`toggleable-race-cell ${E}`,P=`data-day="${h.dateStr}" data-program-id="${$.id}"`;if(R){const D=r.find(B=>B.id===R.race_id),G=dt((g=D==null?void 0:D.category)==null?void 0:g.name);I=`
          <span class="race-program-badge" style="background-color: ${G.background}; border: 1px solid ${G.border}; color: ${G.color};" title="${S(D==null?void 0:D.name)}">
            ${S(D==null?void 0:D.name)}
          </span>
        `}else y?I='<span class="race-cell-placeholder" title="Klicken zum Zuweisen">＋</span>':(_=E,P="");x+=`<td class="${_}" ${P} style="text-align: center; vertical-align: middle;">${I}</td>`}p+=`<tr>${x}</tr>`}return`
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
  `}function yh(e){var T;const t=e.programs,a=e.raceProgramRaces,r=e.races,s=e.programDistribution,n=e.distributionMap,i=e.racesByDate,l=e.assignmentMap,c=t.filter(x=>{const $=n?n.get(x.id):s.find(E=>E.program_id===x.id);return($?parseInt($.deterministic_rider_count||"0",10):0)===0?!1:Wn(x.name,ba)});c.sort((x,$)=>{let N=3;const E=ke(x.name,1),R=ke(x.name,2);E==="F"?N=1:R==="F"&&(N=2);let I=3;const _=ke($.name,1),P=ke($.name,2);return _==="F"?I=1:P==="F"&&(I=2),N!==I?N-I:x.name.localeCompare($.name)});let o='<th class="sticky-col-header" style="z-index: 15;">Monat</th>',m='<th class="sticky-col-header" style="z-index: 15;">Tag / KW</th>',p='<th class="sticky-col-header" style="z-index: 15;">Rennen Anzahl</th>',u='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #1</th>',f='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #2</th>',g='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #3</th>';const h=[],b=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],y=new Map;a.forEach(x=>{y.set(x.race_id,(y.get(x.race_id)||0)+1)});for(const x of rs){const $=parseInt(x.dateStr.split("-")[1],10)-1,N=b[$];h.length===0||h[h.length-1].name!==N?h.push({name:N,span:1}):h[h.length-1].span++;const E=(i?i.get(x.dateStr)||[]:r.filter(D=>D.start_date<=x.dateStr&&D.end_date>=x.dateStr)).filter(D=>wt.has(D.category_id)),R=E.length>0,I=R?`${E.length} R`:"",_=R?"race-count-active":"";m+=`<th style="text-align: center; min-width: 40px; font-variant-numeric: tabular-nums;">
      <div style="font-size: 0.8rem; font-weight: bold;">${x.dateStr.split("-")[2]}</div>
      <div style="font-size: 0.65rem; color: var(--text-500);">W${x.weekNum}</div>
    </th>`,p+=`<th class="${_}" style="text-align: center; font-size: 0.72rem; font-weight: bold;">${I}</th>`;const P=D=>{var te;const G=E[D];if(!G)return"";const B=dt((te=G.category)==null?void 0:te.name),q=y.get(G.id)||0;return`
        <span class="race-id-badge" style="background-color: ${B.background}; border: 1px solid ${B.border}; color: ${B.color}; cursor: help;" 
              title="${S(G.name)}
Zugelassene Programme: ${q}">
          R${G.id}
        </span>
      `};u+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${P(0)}</th>`,f+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${P(1)}</th>`,g+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${P(2)}</th>`}for(const x of h)o+=`<th colspan="${x.span}" style="text-align: center; font-weight: bold; border-left: 1px solid var(--border);">${x.name}</th>`;let k="";for(const x of c){const $=bs(x,e),N=n?n.get(x.id):s.find(I=>I.program_id===x.id),E=N?parseInt(N.deterministic_rider_count||"0",10):0;let R=`
      <td class="sticky-col" style="z-index: 5; white-space: nowrap; font-weight: bold; border-right: 2px solid var(--border);">
        <div style="font-size: 0.85rem;">${S(x.name)} (${E} F)</div>
        <div class="text-muted" style="font-size: 0.7rem; font-weight: normal; margin-top: 0.1rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${$.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${$.prep}</span> | 
          O: <span>${$.none}</span>
        </div>
      </td>
    `;for(const I of rs){const _=wa(x,I.weekNum),P=fd(_),D=(i?i.get(I.dateStr)||[]:r.filter(M=>M.start_date<=I.dateStr&&M.end_date>=I.dateStr)).filter(M=>wt.has(M.category_id)),G=D.length>0;let B=null;if(l)for(const M of D){const z=`${x.id}_${M.id}`,V=l.get(z);if(V){B=V;break}}else B=a.find(M=>M.program_id===x.id&&D.some(z=>z.id===M.race_id));let q="",te=`toggleable-race-cell ${P}`,ae=`data-day="${I.dateStr}" data-program-id="${x.id}"`;if(B){const M=r.find(V=>V.id===B.race_id),z=dt((T=M==null?void 0:M.category)==null?void 0:T.name);q=`
          <span class="race-id-badge" style="background-color: ${z.background}; border: 1px solid ${z.border}; color: ${z.color};" title="${S(M==null?void 0:M.name)}">
            R${M==null?void 0:M.id}
          </span>
        `}else G?q='<span style="font-size: 0.72rem; color: var(--text-500); opacity: 0.5;">＋</span>':(te=P,ae="");R+=`<td class="${te}" ${ae} style="text-align: center; vertical-align: middle; padding: 0.35rem 0;">${q}</td>`}k+=`<tr>${R}</tr>`}return`
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh; overflow-x: auto;">
        <table class="data-table data-table-teams race-programs-calendar-table">
          <thead>
            <tr class="month-header-row">${o}</tr>
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
  `}function vh(e,t){const a=t.filter(l=>l.race_id===e).sort((l,c)=>l.stage_number-c.stage_number);if(a.length===0)return{countHtml:"Keine Etappen",stagesListHtml:"Keine Etappendaten vorhanden."};const r={};for(const l of a)r[l.profile]=(r[l.profile]||0)+1;const n=Object.entries(r).sort((l,c)=>c[1]-l[1]).map(([l,c])=>`${S(l)}: ${c}x`).join("<br>"),i=a.map(l=>`
    <div class="popover-stage-row">
      <span class="popover-stage-num">Et. ${l.stage_number}:</span>
      <span class="popover-stage-profile">${S(l.profile)}</span>
    </div>
  `).join("");return{countHtml:n,stagesListHtml:i}}function Sh(e){const t=[...e.races].sort((m,p)=>m.start_date.localeCompare(p.start_date)),a=e.raceProgramRaces,r=e.stages,s=e.programDistribution,n=e.distributionMap,i=e.assignmentMap,l=new Map;e.programs.forEach(m=>{l.set(m.id,bs(m,e))});const c=new Map;return a.forEach(m=>{c.has(m.race_id)||c.set(m.race_id,new Set),c.get(m.race_id).add(m.program_id)}),`
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
            ${t.map(m=>{var me,Se,Oe,ct;const p=c.get(m.id)||new Set,u=s.filter(H=>p.has(H.program_id));let f=null;if(m.is_stage_race===0){const H=r.find(W=>W.race_id===m.id),K=((H==null?void 0:H.profile)??"").toLowerCase();K==="cobble"||K==="cobble_hill"||K==="cobblehill"?f="P":K==="flat"||K==="rolling"?f="S":K==="hilly"||K==="hilly_difficult"?f="H":K==="medium_mountain"||K==="high_mountain"||K==="mountain"?f="B":(K==="itt"||K==="ttt")&&(f="T")}const g=e.programs.map(H=>{const K=i?i.has(`${H.id}_${m.id}`):a.some(Ia=>Ia.program_id===H.id&&Ia.race_id===m.id),W=n?n.get(H.id):s.find(Ia=>Ia.program_id===H.id),Z=W?parseInt(W.deterministic_rider_count||"0",10):0,ue=W?parseInt(W.deterministic_role_Kapitaen||"0",10):0,Me=W?parseInt(W.deterministic_role_Co_Kapitaen||"0",10):0,je=W?parseInt(W.deterministic_role_Edelhelfer||"0",10):0,Le=W?parseInt(W.deterministic_role_Starke_Helfer||"0",10):0,$e=W?parseInt(W.deterministic_role_Wassertraeger||"0",10):0,We=W?parseInt(W.deterministic_role_Sprinter||"0",10):0,Ie=[];ue>0&&Ie.push(`${ue} Kapitän`),Me>0&&Ie.push(`${Me} Co-Kapitän`),je>0&&Ie.push(`${je} Edelhelfer`),Le>0&&Ie.push(`${Le} Starke Helfer`),$e>0&&Ie.push(`${$e} Wasserträger`),We>0&&Ie.push(`${We} Sprinter`);const Xt=Ie.length>0?`(${Ie.join(", ")})`:"",Ft=l.get(H.id)||{peak:0,prep:0,none:0},Ra=Ft.peak+Ft.prep+Ft.none;return{program:H,isAssigned:K,count:Z,rolesStr:Xt,totalDays:Ra}});if(f!==null){const H=f,K=m.is_stage_race===0&&(((Se=(me=r.find(W=>W.race_id===m.id))==null?void 0:me.profile)==null?void 0:Se.toLowerCase())==="flat"||((ct=(Oe=r.find(W=>W.race_id===m.id))==null?void 0:Oe.profile)==null?void 0:ct.toLowerCase())==="rolling");g.sort((W,Z)=>{let ue=3,Me=3;if(K){const $e=ke(W.program.name,1),We=ke(W.program.name,2),Ie=ke(W.program.name,3);$e==="S"||$e==="F"?ue=0:We==="S"||We==="F"?ue=1:(Ie==="S"||Ie==="F")&&(ue=2);const Xt=ke(Z.program.name,1),Ft=ke(Z.program.name,2),Ra=ke(Z.program.name,3);Xt==="S"||Xt==="F"?Me=0:Ft==="S"||Ft==="F"?Me=1:(Ra==="S"||Ra==="F")&&(Me=2)}else ke(W.program.name,1)===H?ue=0:ke(W.program.name,2)===H?ue=1:ke(W.program.name,3)===H&&(ue=2),ke(Z.program.name,1)===H?Me=0:ke(Z.program.name,2)===H?Me=1:ke(Z.program.name,3)===H&&(Me=2);if(ue!==Me)return ue-Me;if(Z.count!==W.count)return Z.count-W.count;const je=Fa(W.program.name),Le=Fa(Z.program.name);return je!==Le?je-Le:W.program.id-Z.program.id})}else g.sort((H,K)=>{if(H.isAssigned!==K.isAssigned)return H.isAssigned?-1:1;if(K.count!==H.count)return K.count-H.count;const W=Fa(H.program.name),Z=Fa(K.program.name);return W!==Z?W-Z:H.program.id-K.program.id});const b=g.filter(H=>H.count===0?!1:Wn(H.program.name,Na)).map(H=>{const K=H.program,W=dh(K,m);let Z="";W||(Z='<span style="color: #fb923c; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(251, 146, 60, 0.15); border: 1px solid #fb923c; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb der Peak- und Aufbauphase dieses Programms!">!</span>');let ue="";ch(K,m)||(ue='<span style="color: #c084fc; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(192, 132, 252, 0.15); border: 1px solid #c084fc; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb des Peakbereichs und der 6-wöchigen Anstiegsphase dieses Programms!">!</span>');let je="";uh(K,m,e)||(je='<span style="color: #38bdf8; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; border-radius: 50%; font-size: 0.65rem;" title="Achtung: Dieses Programm hat in diesem Saisonabschnitt bereits das Limit an Renntagen erreicht (max. 36 Tage bzw. 35 Tage für Rundfahrten)!">!</span>');let $e="";if(!H.isAssigned){const Un=a.filter(ut=>ut.program_id===K.id&&ut.race_id!==m.id).map(ut=>e.races.find(ys=>ys.id===ut.race_id)).filter(ut=>ut&&ut.start_date<=m.end_date&&ut.end_date>=m.start_date);if(Un.length>0){const ut=Un.map(ys=>ys.name).join(", ");$e=`<span style="color: #ef4444; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 50%; font-size: 0.65rem;" title="Kollision: Dieses Programm ist bereits einem zeitlich parallelen Rennen zugewiesen: ${S(ut)}!">!</span>`}}const We=Fa(K.name),Ie=We>=1&&We<=3?"#f97316":"#22c55e",Xt=H.isAssigned?`font-weight: bold; color: ${Ie}; text-shadow: 0 0 1px ${Ie};`:`color: ${Ie}; opacity: 0.75;`,Ft=H.isAssigned?"☑":"☐";return`
        <div class="popover-program-toggle" data-program-id="${K.id}" data-race-id="${m.id}" 
             style="cursor: pointer; padding: 0.45rem 0.6rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); transition: background-color 0.15s; white-space: nowrap;"
             onmouseover="this.style.backgroundColor='rgba(99, 102, 241, 0.08)'"
             onmouseout="this.style.backgroundColor='transparent'">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
            <span style="font-size: 1.15rem; line-height: 1; user-select: none; color: ${H.isAssigned?"var(--accent-h)":"var(--text-500)"};">${Ft}</span>
            <span style="${Xt} font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis;" title="${S(K.name)} (${H.totalDays} Renntage)">
              ${S(K.name)} (${H.totalDays} RT)
            </span>
            ${Z}
            ${ue}
            ${je}
            ${$e}
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;">
            <strong style="font-size: 0.8rem; color: var(--accent-h);">${H.count} Fahrer</strong>
            <span style="font-size: 0.72rem; color: var(--text-500); font-weight: normal;" title="${S(H.rolesStr)}">${S(H.rolesStr)}</span>
          </div>
        </div>
      `}).join(""),y=Dt===m.id;let k=0,T=0,x=0,$=0,N=0,E=0,R=0;const I={Kapitaen:{},Co_Kapitaen:{},Sprinter:{},Edelhelfer:{},Starke_Helfer:{},Wassertraeger:{}},_=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],P=["Berg","Hill","Sprint","Timetrial","Cobble","Attacker"];for(const H of u){k+=parseInt(H.deterministic_rider_count||"0",10),T+=parseInt(H.deterministic_role_Kapitaen||"0",10),x+=parseInt(H.deterministic_role_Co_Kapitaen||"0",10),$+=parseInt(H.deterministic_role_Sprinter||"0",10),N+=parseInt(H.deterministic_role_Edelhelfer||"0",10),E+=parseInt(H.deterministic_role_Starke_Helfer||"0",10),R+=parseInt(H.deterministic_role_Wassertraeger||"0",10);for(const K of _)for(const W of P){const Z=`deterministic_${K}_spec1_${W}`,ue=parseInt(H[Z]||"0",10);I[K][W]=(I[K][W]||0)+ue}}let D=0;m.is_stage_race===1&&(D=r.filter(K=>K.race_id===m.id).filter(K=>{const W=(K.profile||"").toLowerCase();return W==="flat"||W==="rolling"}).length);let G=!1,B=0;if(m.is_stage_race===0){const H=r.find(W=>W.race_id===m.id),K=((H==null?void 0:H.profile)||"").toLowerCase();G=K==="cobble"||K==="cobble_hill",G&&(B=(e.roleSpecCombinations||[]).filter(Z=>p.has(Z.program_id)).filter(Z=>Z.spec1==="Cobble"||Z.spec2==="Cobble"||Z.spec3==="Cobble").reduce((Z,ue)=>Z+ue.count,0))}let q="<strong>Rennprogramme verwalten</strong>";m.is_stage_race===0&&G?q=`
        <strong>Rennprogramme verwalten 
          (<span style="color: ${B<20?"#ef4444":"var(--accent-h)"}; font-weight: bold;" title="Kopfsteinpflaster-Spezialisten: ${B} / min. 20">Gesamtfahrer: ${k}</span>)
        </strong>
      `:q=`<strong>Rennprogramme verwalten (Gesamtfahrer: ${k})</strong>`;const te=`
      <div class="race-rider-programs-popover-card ${y?"":"hidden"}"
           style="position: absolute; top: calc(100% + 0.45rem); right: 0; z-index: 120; min-width: 600px; max-width: 750px; padding: 0.8rem 0.9rem; border: 1px solid rgba(148, 163, 184, 0.18); border-radius: var(--radius-md); background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%); box-shadow: var(--shadow); text-align: left; font-weight: normal;">
        <div class="popover-head" style="border-bottom: 1px solid rgba(148, 163, 184, 0.12); padding-bottom: 0.4rem; margin-bottom: 0.4rem; display: flex; flex-direction: column; gap: 0.4rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            ${q}
          </div>
          <div style="display: flex; gap: 0.8rem; font-size: 0.75rem; align-items: center; background: rgba(0,0,0,0.18); padding: 0.25rem 0.4rem; border-radius: var(--radius-sm);">
            <span style="color: var(--text-400); font-weight: 500;">Programm-Typ:</span>
            <label style="display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; user-select: none; margin: 0;">
              <input type="radio" name="popover-filter-cobble-radio-${m.id}" class="popover-filter-cobble-radio" value="all" ${Na==="all"?"checked":""}> Alle
            </label>
            <label style="display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; user-select: none; margin: 0;">
              <input type="radio" name="popover-filter-cobble-radio-${m.id}" class="popover-filter-cobble-radio" value="cobble" ${Na==="cobble"?"checked":""}> Cobble
            </label>
            <label style="display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; user-select: none; margin: 0;">
              <input type="radio" name="popover-filter-cobble-radio-${m.id}" class="popover-filter-cobble-radio" value="non-cobble" ${Na==="non-cobble"?"checked":""}> Non-Cobble
            </label>
          </div>
        </div>
        <div class="popover-program-list-scroll" data-race-id="${m.id}" style="display: flex; flex-direction: column; gap: 0.2rem; max-height: 350px; overflow-y: auto;">
          ${b}
        </div>
      </div>
    `;let ae="text-align: center; font-variant-numeric: tabular-nums;";m.is_stage_race===1&&D>=2&&($<=7?ae+=" background-color: rgba(239, 68, 68, 0.2); color: #ef4444; font-weight: bold;":$>7&&$<10&&(ae+=" background-color: rgba(234, 179, 8, 0.2); color: #eab308; font-weight: bold;"));let M="position: relative; text-align: center; font-variant-numeric: tabular-nums; vertical-align: middle;",z="font-weight: bold; border: none; background: transparent; padding: 0.15rem 0.4rem; cursor: pointer; color: var(--accent-h); text-decoration: underline;";m.is_stage_race===0&&G&&B<20&&(M+=" background-color: rgba(239, 68, 68, 0.2);",z+=" color: #ef4444; font-weight: bold;");const V=`
      <button type="button" class="race-rider-count-trigger btn-link" data-race-id="${m.id}" 
              style="${z}">
        ${k}
      </button>
    `;let U="—";if(m.is_stage_race===0){const H=r.find(K=>K.race_id===m.id);U=(H==null?void 0:H.profile)??"Flat"}let X="",A=`<strong>${S(m.name)}</strong>`;if(m.is_stage_race===1){const H=Nt===m.id,{countHtml:K,stagesListHtml:W}=vh(m.id,r);X=`
        <div class="race-stages-popover-card ${H?"":"hidden"}">
          <div class="popover-head"><strong>${S(m.name)}</strong> - Etappen</div>
          <div class="popover-stages-list">${W}</div>
          <div class="popover-separator"></div>
          <div class="popover-head">Profile Zusammenfassung</div>
          <div class="popover-profiles-summary">${K}</div>
        </div>
      `,A=`
        <button type="button" class="race-popover-trigger btn-link" data-race-id="${m.id}" style="text-align: left; font-weight: bold; border: none; background: transparent; padding: 0; cursor: pointer; color: var(--accent-h);">
          ${S(m.name)}
        </button>
      `}let L=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"];if(m.is_stage_race===0){const H=r.find(W=>W.race_id===m.id),K=((H==null?void 0:H.profile)??"").toLowerCase();K.includes("cobble")?L=["Cobble","Sprint","Hill","Attacker","Timetrial","Berg"]:(K.includes("flat")||K.includes("rolling"))&&(L=["Sprint","Timetrial","Attacker","Hill","Cobble","Berg"])}const F=[],j=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],O={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},w={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},C=(e.roleSpecCombinations||[]).filter(H=>p.has(H.program_id)),J=new Map;for(const H of C){const K=H.spec2||"—",W=`${H.role}|${H.spec1}|${K}`;J.set(W,(J.get(W)||0)+H.count)}const re=[...J.entries()].map(([H,K])=>{const[W,Z,ue]=H.split("|");return{role:W,spec1:Z,spec2:ue,count:K}}).sort((H,K)=>{const W=j.indexOf(H.role)-j.indexOf(K.role);if(W!==0)return W;const Z=L.indexOf(H.spec1)-L.indexOf(K.spec1);return Z!==0?Z:K.count-H.count}),Q=(H,K)=>{const W=w[H]??H,Z=K!=="—"?w[K]??K:"—";return`${W} / ${Z}`};for(const H of re)if(H.count>0){const K=H.spec1==="Berg"&&H.spec2==="Cobble"||H.spec1==="Cobble"&&H.spec2==="Berg",W=K?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",Z=K?"color: #f97316; font-weight: bold;":"color: var(--text-100);",ue=K?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",Me=`${H.role}_${H.spec1}_${H.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`,Le=C.filter($e=>$e.role===H.role&&$e.spec1===H.spec1&&($e.spec2||"—")===H.spec2).map($e=>{const We=e.programs.find(Ie=>Ie.id===$e.program_id);return`<span style="white-space: nowrap; margin-right: 0.8rem;">${S((We==null?void 0:We.name)??"Unbekannt")}: <strong>${$e.count}</strong></span>`}).join(" ");F.push(`
          <div style="${W}">
            <span style="${Z}">${O[H.role]||H.role} <span class="text-muted">(${Q(H.spec1,H.spec2)})</span></span>
            <strong style="${ue} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="${m.id}" data-combo-key="${Me}">
              ${H.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-${m.id}-${Me}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: ${Le}
          </div>
        `)}const we=F.length>0?F.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost race-row-expand-btn" data-race-id="${m.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td>${ce(m.start_date)}</td>
        <td class="race-programs-popup-anchor" style="position: relative; vertical-align: middle;">
          ${A}
          ${X}
        </td>
        <td style="font-weight: bold; color: var(--accent-h); text-align: center;">${U}</td>
        <td class="race-programs-popup-anchor" style="${M}">
          ${V}
          ${te}
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${T}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${x}</td>
        <td style="${ae}">${$}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${N}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${E}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${R}</td>
      </tr>
      <tr id="race-details-row-${m.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
        <td colspan="11" style="padding: 0.5rem 1.5rem;">
          <div style="max-width: 450px; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
            <div style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; font-weight: bold; background: rgba(99,102,241,0.08); color: var(--text-100);">Zusammensetzung (Rolle / Spezialisierung)</div>
            ${we}
          </div>
        </td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function bd(e){return st!==e?'<span style="opacity:0.35; margin-left:4px;">↕</span>':`<span style="color:var(--accent-h); margin-left:4px; font-weight:bold;">${Ha?"↑":"↓"}</span>`}function $t(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${st===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
        <span>${S(t)}</span>
        ${bd(e)}
      </div>
    </th>
  `}function kh(e,t,a=""){return`
    <th style="cursor: pointer; user-select: none; ${a}" class="program-roles-sort-header ${st===e?"sort-active":""}" data-sort-key="${e}">
      <div style="display: flex; align-items: center; justify-content: flex-start; gap: 2px;">
        <span>${S(t)}</span>
        ${bd(e)}
      </div>
    </th>
  `}function $h(e){const t=e.programs,a=e.roleSpecCombinations||[],r=e.programToRacesMap,s={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},n={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},i=new Map;a.forEach(o=>{i.has(o.program_id)||i.set(o.program_id,[]),i.get(o.program_id).push(o)});const l=t.map(o=>{const m=i.get(o.id)||[];let p=0;const u={Kapitaen:0,Co_Kapitaen:0,Sprinter:0,Edelhelfer:0,Starke_Helfer:0,Wassertraeger:0};for(const h of m)p+=h.count,u[h.role]!==void 0&&(u[h.role]+=h.count);const f=bs(o,e),g=f.peak+f.prep+f.none;return{program:o,totalRiders:p,roleCounts:u,progCombos:m,raceDays:g}});l.sort((o,m)=>{let p=0;return st==="id"?p=o.program.id-m.program.id:st==="name"?p=o.program.name.localeCompare(m.program.name):st==="total"?p=o.totalRiders-m.totalRiders:st==="raceDays"?p=o.raceDays-m.raceDays:p=(o.roleCounts[st]||0)-(m.roleCounts[st]||0),p===0&&(p=o.program.id-m.program.id),Ha?p:-p});const c=l.map(o=>{const m=o.program,p=o.progCombos,u=o.totalRiders,f=o.roleCounts,g=o.raceDays,h=r?r.get(m.id)||new Set:new Set(e.raceProgramRaces.filter(R=>R.program_id===m.id).map(R=>R.race_id)),b=hd(m,h,e),y=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],k=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"],T=new Map;for(const R of p){const I=R.spec2||"—",_=`${R.role}|${R.spec1}|${I}`;T.set(_,(T.get(_)||0)+R.count)}const x=[...T.entries()].map(([R,I])=>{const[_,P,D]=R.split("|");return{role:_,spec1:P,spec2:D,count:I}}).sort((R,I)=>{const _=y.indexOf(R.role)-y.indexOf(I.role);if(_!==0)return _;const P=k.indexOf(R.spec1)-k.indexOf(I.spec1);return P!==0?P:I.count-R.count}),$=(R,I)=>{const _=n[R]??R,P=I!=="—"?n[I]??I:"—";return`${_} / ${P}`},N=[];for(const R of x)if(R.count>0){const I=R.spec1==="Berg"&&R.spec2==="Cobble"||R.spec1==="Cobble"&&R.spec2==="Berg",_=I?"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem; background: rgba(249, 115, 22, 0.12); color: #f97316;":"display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;",P=I?"color: #f97316; font-weight: bold;":"color: var(--text-100);",D=I?"color: #f97316; font-weight: bold;":"color: var(--accent-h);",G=`${R.role}_${R.spec1}_${R.spec2.replace(/[^a-zA-Z0-9]/g,"_")}`;N.push(`
          <div style="${_}">
            <span style="${P}">${s[R.role]||R.role} <span class="text-muted">(${$(R.spec1,R.spec2)})</span></span>
            <strong style="${D} cursor: pointer; text-decoration: underline;" class="combo-origin-trigger" data-race-id="prog-${m.id}" data-combo-key="${G}">
              ${R.count} Fahrer
            </strong>
          </div>
          <div id="combo-origin-prog-${m.id}-${G}" class="hidden" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--text-400); background: rgba(0, 0, 0, 0.18); border-left: 2px solid var(--accent-h); text-align: left; line-height: 1.4;">
            Herkunft: <span style="white-space: nowrap; margin-right: 0.8rem;">${S(m.name)}: <strong>${R.count}</strong></span>
          </div>
        `)}const E=N.length>0?N.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
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
              ${$t("id","ID","width: 50px;")}
              ${kh("name","Programm")}
              ${$t("total","Fahrer gesamt","width: 110px; text-align: center; font-weight: bold;")}
              ${$t("raceDays","Renntage","width: 100px; text-align: center; font-weight: bold;")}
              ${$t("Kapitaen","Kapitän","width: 90px; text-align: center;")}
              ${$t("Co_Kapitaen","Co-Kapitän","width: 90px; text-align: center;")}
              ${$t("Sprinter","Sprinter","width: 90px; text-align: center;")}
              ${$t("Edelhelfer","Edelhelfer","width: 90px; text-align: center;")}
              ${$t("Starke_Helfer","Starke Helfer","width: 100px; text-align: center;")}
              ${$t("Wassertraeger","Wasserträger","width: 100px; text-align: center;")}
            </tr>
          </thead>
          <tbody>
            ${c.join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.openTeamStats=Kn;async function yd(){var e,t,a;for(let r=localStorage.length-1;r>=0;r--){const s=localStorage.key(r);s&&(s.startsWith("programAssignmentsLogged_")||s.startsWith("participantCountsLogged_"))&&localStorage.removeItem(s)}ns("game"),v("meta-career").textContent=((e=d.currentSave)==null?void 0:e.careerName)??"",d.seasonStandingsSelectedSeason=null,d.riderStatsSelectedSeason=null,Te("Spiel wird geladen…");try{await tr();const[r,s]=await Promise.all([Y.getTeams(),Y.getRiders(void 0,!1)]);r.success&&(d.teams=r.data??[]),s.success&&(d.riders=s.data??[]),await An(),((t=d.gameState)==null?void 0:t.draftStatus)==="active"?(Rt("draft"),sr(d.draftSelectedSeason||((a=d.currentSave)==null?void 0:a.currentSeason)||2026)):(Rt("dashboard"),fs())}catch(r){alert("Fehler beim Laden des Spiels: "+r.message)}finally{ve()}}function xh(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a,r;const t=e.dataset.view??"";if(((a=d.gameState)==null?void 0:a.draftStatus)==="active"&&t!=="draft"){alert("Ein Fahrerdraft läuft gerade. Du musst den Draft abschließen, bevor du das Spiel fortsetzen kannst.");return}Rt(t),t==="dashboard"&&fs(),t==="teams"&&Qr(),t==="riders"&&Qr(),t==="rider-team-editor"&&id(),t==="live-race"&&ga(),t==="results"&&_e(),t==="draft"&&sr(d.draftSelectedSeason||((r=d.currentSave)==null?void 0:r.currentSeason)||2026),t==="injuries"&&Nf(),t==="season-standings"&&md(!0),t==="leaderboards"&&Xf(),t==="calendar"&&lh(),t==="race-programs"&&Vn(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&Ml(),t==="stage-editor"&&xn()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&ka(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&Kn(a)}),v("btn-cancel-new").addEventListener("click",()=>tt("newCareer")),v("btn-close-race-stages").addEventListener("click",()=>tt("raceStages")),v("btn-close-stage-profile").addEventListener("click",()=>tt("stageProfile")),v("btn-close-rider-program").addEventListener("click",()=>tt("riderProgram")),v("btn-close-rider-stats").addEventListener("click",()=>tt("riderStats")),v("btn-close-team-stats").addEventListener("click",()=>tt("teamStats")),v("btn-close-race-participants").addEventListener("click",()=>tt("raceParticipants")),v("btn-close-roster-editor").addEventListener("click",()=>Us()),v("btn-cancel-roster-editor").addEventListener("click",()=>Us()),v("btn-apply-roster-editor").addEventListener("click",()=>{jg()}),v("btn-back-menu").addEventListener("click",()=>{la==null||la.pause(),ns("menu"),Ja()}),Cd(),nf(),oh(),Kl(),rd(),Tf(),Wg(),Bg(),ig(),$g(),Jf(),Bf(),qf(),gh(),ld()}(async()=>(Cp(),ye(),xh(),ns("menu"),await Ja()))();
