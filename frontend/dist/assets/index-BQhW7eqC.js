(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();function Jn(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Er(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function nt(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function rr(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function Ce(e,t={}){const a=t.strong===!1?"span":"strong",r=Er("app-rider-link-label",t.labelClassName),s=`<${a} class="${r}">${Jn(e)}</${a}>`;if(t.riderId==null)return s;const n=['type="button"','class="'+Er("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${s}</button>`}function tt(e,t,a=!0,r=""){const s=a===!1?"span":"strong",n=`<${s} class="app-team-link-label">${Jn(e)}</${s}>`;return t==null?n:`<button type="button" class="${Er("app-team-link",r)}" data-team-id="${t}">${n}</button>`}function qn(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function Xn(e){return Math.round(e*10)/10}function Qn(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function ei(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function ti(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function tl(e,t){return e.skills.stamina*(t/300)}function ai(e,t,a){return e.skills.timeTrial+ti(e,t)+e.skills.mountain*(a/500)}function al(e,t,a,r){const s=tl(e,a),n=ti(e,r);switch(t.profile){case"Flat":return .8*e.skills.sprint+.15*e.skills.acceleration+.05*e.skills.flat+n+s;case"Rolling":return .7*e.skills.sprint+.2*e.skills.acceleration+.1*e.skills.hill+n+s;case"Hilly":return .45*e.skills.sprint+.1*e.skills.flat+.45*e.skills.hill+n+s;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+s;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+s;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+s;case"High_Mountain":return e.skills.mountain+n+s;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+s;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+s;default:return .8*e.skills.sprint+.2*e.skills.flat+n+s}}function rl(e,t,a,r,s){return t.profile==="ITT"||t.profile==="TTT"?ai(e,s,r):al(e,t,a,s)}function sl(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:Xn(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function ri(e,t,a,r){Qn(a,r);const s=ei(a,r),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const p=o.get(l.activeTeamId)??[];p.push(l),o.set(l.activeTeamId,p)}return[...o.entries()].map(([l,p])=>{const m=n.get(l),f=p.map(v=>ai(v,qn(v.id,r==null?void 0:r.dailyFormByRiderId),s)).sort((v,x)=>x-v).slice(0,5),g=f.length,b=g>0?f.reduce((v,x)=>v+x,0)/g:0,y=Math.max(0,5-g)*2;return{team:m??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:b-y}}).sort((l,p)=>p.score-l.score||l.team.id-p.team.id).slice(0,20).map((l,p)=>({rank:p+1,kind:"team",effectiveSkill:Xn(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(r!=null?Ga(e,t,a,r):Ga(e,t,a)).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id).slice(0,20).map((o,d)=>sl(o,d+1))}function Ga(e,t,a,r){const s=Qn(a,r),n=ei(a,r),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var d;return{rider:o,teamName:o.activeTeamId!=null?((d=i.get(o.activeTeamId))==null?void 0:d.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:rl(o,a,s,n,qn(o.id,r==null?void 0:r.dailyFormByRiderId))}}).sort((o,d)=>d.effectiveSkill-o.effectiveSkill||o.rider.id-d.rider.id)}const c={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,draftHistory:null,injuries:null,draftSelectedSeason:null,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1,autoProgressTargetDate:null,raceProgramsPayload:null,raceProgramsActiveTab:"calendar-cols",raceProgramsDirty:!1,raceProgramsSaving:!1};let Xt=null;function nl(e){Xt=e}let Yr=!1;function Ls(e){Yr=e}let si=null;function Ds(e){si=e}let Cr=null;function As(e){Cr=e}let it=!1;function ni(e){it=e}function h(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function se(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function Ha(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),r=Math.floor(e%60),s=String(a).padStart(2,"0"),n=String(r).padStart(2,"0");return t>0?`${t}:${s}:${n}`:`${a}:${n}`}function fr(e){return e==null||e===0?"–":`+${Ha(e)}`}const Na=2,Fr=3,ii=4;function oi(e){return`/jersey/Jer_${e}.png`}function Tt(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((r=c.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${S(a)}" aria-label="${S(a)}">
      <img
        class="results-team-jersey-img"
        src="${S(oi(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Yt(e,t){return`<span class="results-jersey-cell">${Tt(e,t)}</span>`}function at(e){return e&&ie(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function Lt(e){var a;if(e==null)return null;const t=$e(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function $e(e){return e==null?null:c.riders.find(t=>t.id===e)??null}function gt(e){return e==null?null:c.races.find(t=>t.id===e)??null}function za(e){var t;if(e==null)return null;for(const a of c.races){const r=(t=a.stages)==null?void 0:t.find(s=>s.id===e);if(r)return{race:a,stage:r}}return null}function Zt(e,t=!0,a=!1,r=null,s=null){const n=Ce(e,{riderId:r,teamId:s,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function il(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function Pr(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function ol(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function ll(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}const Oe={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function ie(e){const t=Oe[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function dl(e,t){return e?`<span class="country-chip">${ie(e.code3)}<span>${S(e.name)}</span></span>`:t?S(t):"–"}function Nr(e){return`${e.toFixed(2).replace(".",",")} km`}function Lr(e){return`${Math.round(e)} hm`}const cl=new Set;function Zr(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),h(`screen-${e}`).classList.remove("hidden")}function Ue(e){h(`modal-${e}`).classList.remove("hidden")}function We(e){h(`modal-${e}`).classList.add("hidden")}function _s(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function li(){var l,p;const e=c.realtimeBootstrap;if(!e)return;const t=h("instant-sim-favorites"),a=h("instant-sim-gc");if(!t||!a)return;const s=ri(e.riders,e.teams,e.stage,{distanceKm:(l=e.stageSummary)==null?void 0:l.distanceKm,elevationGainMeters:(p=e.stageSummary)==null?void 0:p.elevationGainMeters}).slice(0,10),n=new Map(e.gcStandings.map(m=>[m.riderId,m]));let i=`
    <h3>
      <span>Etappen-Favoriten</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const m of s){const u=e.riders.find(M=>M.id===m.riderId);if(!u)continue;const f=Lt(u.id)??"un",g=Oe[f]??"un",b=e.teams.find(M=>M.id===u.activeTeamId),y=(b==null?void 0:b.abbreviation)??"—",v=n.get(u.id),x=v?`GC ${v.rank} (${v.rank===1?"Gelb":_s(v.gapSeconds)})`:"GC –";i+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${u.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${m.rank}</span>
            <span class="fi fi-${g} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${S(u.firstName)} <strong>${S(u.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(y)}</span>
            <span class="instant-sim-gc-info">${x}</span>
          </div>
        </div>
      </div>
    `}i+="</div>",t.innerHTML=i;const o=e.gcStandings.slice(0,10);let d=`
    <h3>
      <span>Gesamtwertung (GC)</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const m of o){const u=e.riders.find(x=>x.id===m.riderId);if(!u)continue;const f=Lt(u.id)??"un",g=Oe[f]??"un",b=e.teams.find(x=>x.id===u.activeTeamId),y=(b==null?void 0:b.abbreviation)??"—",v=m.rank===1?"Gelb":_s(m.gapSeconds);d+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${u.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">${m.rank}</span>
            <span class="fi fi-${g} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${S(u.firstName)} <strong>${S(u.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(y)}</span>
            <span class="instant-sim-gc-info">${v}</span>
          </div>
        </div>
      </div>
    `}d+="</div>",a.innerHTML=d}function Se(e="Lade…"){var r;const t=it?" (Leertaste zum Stoppen)":"",a=h("default-loader");a&&(h("loading-msg").textContent=e+t,h("loading-progress").classList.add("hidden"),a.classList.remove("hidden"),(r=h("instant-sim-panel"))==null||r.classList.add("hidden")),h("loading-overlay").classList.remove("hidden")}function he(){h("loading-overlay").classList.add("hidden")}function ul(e){var t,a;if((t=h("default-loader"))==null||t.classList.add("hidden"),(a=h("instant-sim-panel"))==null||a.classList.remove("hidden"),h("loading-overlay").classList.remove("hidden"),c.realtimeBootstrap)li();else{const r=h("instant-sim-favorites"),s=h("instant-sim-gc");r&&(r.innerHTML=""),s&&(s.innerHTML="")}di(e)}function di(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),r=`Instant-Simulation läuft … ${t}%${it?" (Leertaste zum Stoppen)":""}`,s=h("loading-msg");s&&(s.textContent=r);const n=h("loading-progress-bar");n&&(n.style.width=`${t}%`);const i=h("instant-loading-msg");i&&(i.textContent=r);const o=h("instant-loading-progress-bar");o&&(o.style.width=`${t}%`);const d=h("instant-sim-favorites");d&&d.innerHTML.trim()===""&&c.realtimeBootstrap&&li()}function kt(e,t){const a=h(e);a.textContent=t,a.classList.remove("hidden")}function na(e){h(e).classList.add("hidden")}function It(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),h(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),h("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of cl)try{a(e)}catch(r){console.error(`Fehler bei View-Aktivierung von "${e}":`,r)}}function ve(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function Qt(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function ci(e,t,a){return Math.max(t,Math.min(a,e))}function hr(e,t,a){return Math.round(e+(t-e)*a)}function Bs(e,t,a){return`rgb(${hr(e[0],t[0],a)} ${hr(e[1],t[1],a)} ${hr(e[2],t[2],a)})`}function Jr(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=ci(e,t[0].value,t[t.length-1].value);for(let r=1;r<t.length;r+=1){const s=t[r-1],n=t[r];if(a<=n.value){const i=(a-s.value)/(n.value-s.value);return Bs(s.color,n.color,i)}}return Bs(t[t.length-1].color,t[t.length-1].color,1)}function ui(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${Jr(e)}"${a}>${e.toFixed(2)}</span>`}function ml(e,t,a){if(t==null)return ui(e,a);const r=Math.round((e-t)*100)/100,s=r>0?"skill-delta-positive":r<0?"skill-delta-negative":"skill-delta-neutral",n=r>0?"+":"",i=`<span class="skill-delta ${s}">${n}${r.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${Jr(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function pl(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function Gs(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",r=t>0?"+":"";return`<span class="${a}">${r}${t.toFixed(1).replace(".",",")}</span>`}function Hs(e,t="none",a){const r=e??0,s=["race-sim-form-negative"];t==="warning"&&s.push("load-warning"),t==="critical"&&s.push("load-warning-critical");const n=a?` title="${S(a)}"`:"";return r===0?`<span class="${s.join(" ")}"${n}>0,0</span>`:`<span class="${s.join(" ")}"${n}>-${r.toFixed(1).replace(".",",")}</span>`}function mi(e){const t=e.seasonFormPhase??"neutral";return pi(t)}function pi(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${S(a.label)}">${a.symbol}</span>`}function gl(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${S(e.seasonProgram.name)}</button>`:"–"}function wt(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Fe(e){return`${e.lastName} ${e.firstName}`}function fl(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,r=e.unavailableUntil?` bis ${se(e.unavailableUntil)}`:"",s=`${t}: noch ${a} Tag${a===1?"":"e"}${r}`;return`<span class="rider-availability-marker" title="${S(s)}" aria-label="${S(s)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function pt(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function Dr(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=e,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(r)}async function Z(e,t,a){try{const r=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(r.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await r.text();return{success:!1,error:r.ok?"Antwort war kein JSON.":`HTTP ${r.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return r.json()}catch(r){return{success:!1,error:`Netzwerkfehler: ${r.message}`}}}const V={listSaves:()=>Z("GET","/api/saves"),createSave:(e,t,a)=>Z("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>Z("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>Z("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>Z("GET","/api/teams/available"),getTeams:()=>Z("GET","/api/teams"),getTeam:e=>Z("GET",`/api/teams/${e}`),getTeamStats:e=>Z("GET",`/api/teams/${e}/stats`),getRiders:e=>Z("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRiderStats:(e,t=!1)=>Z("GET",`/api/riders/${e}/stats${t?"?excludeFatigue=true":""}`),getRiderProgramRaces:e=>Z("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>Z("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>Z("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>Z("POST","/api/rider-team-editor/export",e),getRaces:()=>Z("GET","/api/races"),getRaceProgramParticipants:e=>Z("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>Z("GET",`/api/races/${e}/results-roster`),getGameState:()=>Z("GET","/api/state"),getGameStatus:()=>Z("GET","/api/game/status"),getStageSummary:e=>Z("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>Z("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>Z("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>Z("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>Z("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>Z("POST","/api/state/advance"),getStageResults:e=>Z("GET",`/api/results/${e}`),getSeasonStandings:()=>Z("GET","/api/season-standings"),listStageEditorStages:()=>Z("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>Z("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>Z("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>Z("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>Z("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>Z("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>Z("POST","/api/stage-editor/import",e),exportStageRoute:e=>Z("POST","/api/stage-editor/export",e),getInjuries:()=>Z("GET","/api/injuries"),getDraftHistory:e=>Z("GET",`/api/draft/${e}`),getLeaderboards:(e,t,a)=>Z("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`),getRaceProgramsEditor:()=>Z("GET","/api/race-programs-editor"),saveRaceProgramsEditor:e=>Z("POST","/api/race-programs-editor/save",e)};async function la(){const e=await V.listSaves(),t=h("saves-list"),a=h("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(r=>`
    <div class="save-card">
      <h3>${S(r.careerName)}</h3>
      <p class="save-meta">
        ${S(r.teamName)} · Saison ${r.currentSeason}
        ${r.lastSaved?"· "+se(r.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${S(r.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${S(r.filename)}" data-career-name="${S(r.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function hl(e){Se("Karriere wird geladen…");const t=await V.loadSave(e);if(he(),!t.success){alert("Fehler beim Laden: "+t.error);return}c.currentSave=t.data??null,await el()}async function bl(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;Se("Löschen…");const a=await V.deleteSave(e);if(he(),!a.success){alert("Fehler: "+a.error);return}await la()}async function yl(){const e=await V.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){h("btn-delete-all-careers").classList.add("hidden"),h("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){Se("Alle Karrieren werden gelöscht…");try{for(const a of t){const r=await V.deleteSave(a.filename);if(!r.success){alert(`Fehler beim Löschen von "${a.careerName}": ${r.error??"Unbekannter Fehler"}`);break}}}finally{he()}await la()}}function vl(){h("btn-new-career").addEventListener("click",async()=>{var s;na("new-career-error"),h("input-career-name").value="";const a=h("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',Ue("newCareer");const r=await V.getAvailableTeams();if(!r.success||!((s=r.data)!=null&&s.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=r.data.map(n=>`<option value="${n.id}">${S(n.name)} (${S(n.division??n.divisionName??"")})</option>`).join("")}),h("btn-cancel-new").addEventListener("click",()=>We("newCareer")),h("btn-confirm-new").addEventListener("click",async()=>{const a=h("input-career-name").value.trim(),r=h("input-team-id").value;if(!a||!r){kt("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const s=Number(r),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;na("new-career-error"),Se("Neue Karriere wird erstellt…");const o=await V.createSave(i,a,s);if(!o.success){he(),kt("new-career-error",o.error??"Unbekannter Fehler.");return}const d=await V.loadSave(i);if(he(),We("newCareer"),!d.success){alert("Fehler: "+d.error);return}c.currentSave=d.data??null,await el()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>la());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{yl()}),h("saves-list").addEventListener("click",async a=>{const r=a.target.closest("button[data-save-action]");if(!r)return;const{saveAction:s,filename:n,careerName:i}=r.dataset;if(n){if(s==="load"){await hl(n);return}s==="delete"&&await bl(n,i??n)}})}const Sl="modulepreload",kl=function(e){return"/"+e},zs={},gi=function(t,a,r){let s=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));s=Promise.allSettled(a.map(d=>{if(d=kl(d),d in zs)return;zs[d]=!0;const l=d.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${p}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":Sl,l||(m.as="script"),m.crossOrigin="",m.href=d,o&&m.setAttribute("nonce",o),document.head.appendChild(m),l)return new Promise((u,f)=>{m.addEventListener("load",u),m.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return s.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},$l={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function xl(e){const t=$l[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const Tl=200;function qr(e){if(e.length===0)return[];const t=[];for(const a of e){const r=t[t.length-1];if(!r||Math.abs(r.distanceMeter-a.distanceMeter)>=Tl){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}r.riderIds.push(...a.riderIds),r.riderCount+=a.riderCount,r.distanceSum+=a.distanceMeter*a.riderCount,r.distanceMeter=r.distanceSum/r.riderCount}return t.map(({distanceSum:a,...r})=>r)}function Xr(e){if(e.length===0)return[];let t=0;for(let s=1;s<e.length;s+=1)e[s].riderCount>e[t].riderCount&&(t=s);let a=0,r=0;return e.map((s,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(r+=1,o=`A${r}`),{...s,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-s.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,s.distanceMeter-e[n+1].distanceMeter):null}})}function wl(e,t=null){var a,r,s;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((r=e.find(n=>n.label==="P"))==null?void 0:r.label)??((s=e[0])==null?void 0:s.label)??null}function ft(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function Ks(e,t,a,r){return`${r.type}:${e}:${t}:${a}`}function Ml(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:ft(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function qe(e){const t=[];e.segments.forEach((s,n)=>{const i=n*2;(s.start_markers??[]).forEach((o,d)=>{t.push({key:Ks(n,"start",d,o),label:"",marker:o,kmMark:s.start_km,elevation:s.start_elevation,boundary:"start",sequence:i+d/100})}),(s.end_markers??[]).forEach((o,d)=>{t.push({key:Ks(n,"end",d,o),label:"",marker:o,kmMark:s.end_km,elevation:s.end_elevation,boundary:"end",sequence:i+1+d/100})})});const a=t.sort((s,n)=>s.kmMark-n.kmMark||s.sequence-n.sequence),r=new Map;return a.map(s=>{const n=(r.get(s.marker.type)??0)+1;return r.set(s.marker.type,n),{...s,label:s.marker.name??Ml(s.marker,n)}})}function Rl(e){const t=qe(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>ft(a)).length}}function Ht(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Il(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function _e(e,t,a,r){return t<=0?r:r+e/t*(a-r*2)}function Ka(e,t){const a=t/1e3,r=e.points;if(a<=r[0].kmMark)return r[0].elevation;for(let s=0;s<r.length-1;s+=1){const n=r[s],i=r[s+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),d=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*d}return r[r.length-1].elevation}function fi(e){const t=e.points.map(p=>p.elevation),a=Math.min(...t),r=Math.max(...t),s=Math.max(1,r-a),n=Math.max(40,s*.08),i=Math.max(0,a-n),o=r+n;let d=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=d&&(l=d+100),{axisMinElevation:d,axisMaxElevation:l}}function Ye(e,t,a,r,s,n){const i=Math.max(1,a-t);return r-n-(e-t)/i*(r-s-n)}function ea(e){return`${Math.round(e)} m`}function Ws(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function js(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function hi(e,t,a,r,s,n,i,o,d){var g;const l=[],p=[];let m=null,u="#b91c1c";for(const b of qe(e)){const{marker:y,kmMark:v,elevation:x}=b;if(y.type==="climb_start"){p.push({kmMark:v,elevation:x,name:y.name});continue}if(ft(y)){let M=-1;for(let R=p.length-1;R>=0;R-=1)if(y.name&&((g=p[R])==null?void 0:g.name)===y.name){M=R;break}const T=M>=0?p.splice(M,1)[0]:p.pop();T&&Math.max(0,v-T.kmMark),T&&Math.max(0,x-T.elevation);const $=js(y.cat,y.type),C=Ws(y.cat);if(y.type==="finish_hill"||y.type==="finish_mountain"){m=y.cat??null,u=$.accentColor;continue}l.push({x:_e(v*1e3,t,a,r),anchorY:Ye(x,o,d,s,n,i),primaryLabel:C??"Berg",secondaryLabel:ea(x),distanceLabel:`${v.toFixed(1).replace(".",",")} km`,accentColor:$.accentColor});continue}if(y.type==="sprint_intermediate"){const M=js(y.cat,y.type);l.push({x:_e(v*1e3,t,a,r),anchorY:Ye(x,o,d,s,n,i),primaryLabel:"Sprint",secondaryLabel:ea(x),distanceLabel:`${v.toFixed(1).replace(".",",")} km`,accentColor:M.accentColor})}}const f=e.points[e.points.length-1];return l.push({x:_e(f.kmMark*1e3,t,a,r),anchorY:Ye(f.elevation,o,d,s,n,i),primaryLabel:m?`${Ws(m)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:ea(f.elevation),distanceLabel:`${f.kmMark.toFixed(1).replace(".",",")} km`,accentColor:u}),l.sort((b,y)=>b.x-y.x)}function bi(e,t,a){const r=t+4,s=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${Ht(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-detail">${Ht(e.distanceLabel)}</text>
    </g>`}function yi(e,t){const a=new Set,r=t/1e3;for(let s=0;s<=r;s+=25)a.add(Math.round(s*1e3));return a.add(Math.round(t)),[...a].filter(s=>s>=0&&s<=t).sort((s,n)=>s-n)}function vi(e,t,a,r,s,n){const i=new Set(qe(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const d=_e(o,a,r,s),p=i.has(o)?18:12,m=n+p+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${d.toFixed(1)}" y1="${n.toFixed(1)}" x2="${d.toFixed(1)}" y2="${(n+p).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${d.toFixed(1)}" y="${m.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${Ht(Il(o))}</text>
      </g>`}).join("")}function El(e,t,a,r,s,n,i,o,d,l,p){const m=_e(e.distanceMeter,a,r,n),u=Ka(t,e.distanceMeter),f=Ye(u,d,l,s,i,o),g=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),b=e.riderCount>1?`<text x="${m.toFixed(1)}" y="${(f+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${m.toFixed(1)}" cy="${f.toFixed(1)}" r="${g.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${p?" race-sim-cluster-dot-selected":""}"></circle>
      ${b}
    </g>`}function Cl(e,t,a,r,s,n,i,o,d,l,p){const m=new Map(p.riders.map(f=>[f.id,f])),u=new Map((p.teams??[]).map(f=>[f.id,f.abbreviation]));return e.filter(f=>f.riderCount===1).map(f=>{const g=f.riderIds[0];if(g==null)return"";const b=m.get(g);if(!b)return"";const y=_e(f.distanceMeter,a,r,n),v=Ka(t,f.distanceMeter),x=Ye(v,d,l,s,i,o),M=b.activeTeamId!=null?u.get(b.activeTeamId)??"":"",T=`${b.lastName} (${M})`,$=x-34,C=x-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${y.toFixed(1)}" y1="${(x-5).toFixed(1)}" x2="${y.toFixed(1)}" y2="${$.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${y.toFixed(1)}" y="${C.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${Ht(T)}</text>
        </g>`}).join("")}function Fl(e,t,a,r,s,n,i,o,d,l,p){const m=Math.max(0,Math.min(l,e.distanceKm)),u=Math.max(0,Math.min(p,e.distanceKm));if(u<=m)return null;const f=[{kmMark:m,elevation:Ka(e,m*1e3)},...e.points.filter(x=>x.kmMark>m&&x.kmMark<u),{kmMark:u,elevation:Ka(e,u*1e3)}];if(f.length<2)return null;const g=s-i,b=f.map((x,M)=>{const T=_e(x.kmMark*1e3,t,a,r),$=Ye(x.elevation,o,d,s,n,i);return`${M===0?"M":"L"} ${T.toFixed(1)} ${$.toFixed(1)}`}).join(" "),y=_e(m*1e3,t,a,r),v=_e(u*1e3,t,a,r);return`${b} L ${v.toFixed(1)} ${g.toFixed(1)} L ${y.toFixed(1)} ${g.toFixed(1)} Z`}function Pl(e,t,a,r,s={}){const p=e.distanceKm*1e3,{axisMinElevation:m,axisMaxElevation:u}=fi(e),f=533,g=12,y=e.points.map(R=>{const L=_e(R.kmMark*1e3,p,1584,28),P=Ye(R.elevation,m,u,634,168,101);return{x:L,y:P}}).map((R,L)=>`${L===0?"M":"L"} ${R.x.toFixed(1)} ${R.y.toFixed(1)}`).join(" "),v=`${y} L ${1556 .toFixed(1)} ${f.toFixed(1)} L ${28 .toFixed(1)} ${f.toFixed(1)} Z`,x=s.selectedClimbRange!=null?Fl(e,p,1584,28,634,168,101,m,u,s.selectedClimbRange.startKm,s.selectedClimbRange.endKm):null,M=hi(e,p,1584,28,634,168,101,m,u).map(R=>bi(R,g,f)).join(""),$=Array.from({length:5},(R,L)=>m+(u-m)/4*L).map(R=>{const L=Ye(R,m,u,634,168,101);return`
      <line x1="28" y1="${L.toFixed(1)}" x2="1556" y2="${L.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${L.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${L.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(L+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${ea(R)}</text>`}).join(""),C=vi(yi(e,p),e,p,1584,28,f);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${Ht(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      ${C}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function Nl(e,t,a,r,s){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${Pl(t,a,r,!1,s)}</div>`}function Ll(e,t,a,r,s,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,d=634,l=28,p=168,m=101,{axisMinElevation:u,axisMaxElevation:f}=fi(t),g=d-m,b=12,y=Array.from({length:5},(K,w)=>u+(f-u)/4*w),v=qr(a.clusters),x=Xr(v),M=yi(t,a.stageDistanceMeters),$=t.points.map(K=>{const w=_e(K.kmMark*1e3,a.stageDistanceMeters,o,l),A=Ye(K.elevation,u,f,d,p,m);return{x:w,y:A}}).map((K,w)=>`${w===0?"M":"L"} ${K.x.toFixed(1)} ${K.y.toFixed(1)}`).join(" "),C=`${$} L ${(o-l).toFixed(1)} ${g.toFixed(1)} L ${l.toFixed(1)} ${g.toFixed(1)} Z`,R=hi(t,a.stageDistanceMeters,o,l,d,p,m,u,f).map(K=>bi(K,b,g)).join(""),L=y.map(K=>{const w=Ye(K,u,f,d,p,m);return`
      <line x1="${l}" y1="${w.toFixed(1)}" x2="${o-l}" y2="${w.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${w.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${w.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(w+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${ea(K)}</text>`}).join(""),P=vi(M,t,a.stageDistanceMeters,o,l,g),D=new Map(v.map((K,w)=>[K,x[w]??null])),_=v.map(K=>{var w;return El(K,t,a.stageDistanceMeters,o,d,l,p,m,u,f,((w=D.get(K))==null?void 0:w.label)===i)}).join(""),H=s.stage.profile==="ITT"?Cl(v,t,a.stageDistanceMeters,o,d,l,p,m,u,f,s):"";e.innerHTML=`
    <div class="race-sim-profile-layout${s.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${d}" role="img" aria-label="${Ht(r)}">
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
          ${L}
          <line x1="${l}" y1="${g}" x2="${o-l}" y2="${g}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${p}" x2="${l}" y2="${g}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${C}" fill="url(#race-sim-area)"></path>
            <path d="${$}" class="race-sim-profile-line"></path>
            ${R}
            ${_}
          </g>
          ${H}
          ${P}
          <text x="${l.toFixed(1)}" y="${(p-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const Dl={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},Os={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function Ar(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function sr(e,t){return`${e}:${t}`}function Al(e){return new Map(e.map(t=>[sr(t.simulationMode,t.terrain),t.weights]))}function _l(e){return new Map(e.map(t=>[sr(t.simulationMode,t.terrain),t]))}function Bl(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function Si(e,t,a){const r=a.get(sr(e,t));if(!r)return[{key:Ar(t),weight:1}];const s=Object.entries(r).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return s.length>0?s:[{key:Ar(t),weight:1}]}function Gl(e,t,a,r){const s=Si(t,a,r),n=s.reduce((o,d)=>o+d.weight,0);return n<=0?e[Ar(a)]:s.reduce((o,d)=>o+e[d.key]*d.weight,0)/n}function Hl(e,t){const a=t.find(r=>r.simulationMode==="ttt"&&r.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??Dl[e]??1.05}function zl(e,t,a){const r=a==null?void 0:a.get(sr(e,t));return{lateMultiplier:(r==null?void 0:r.finalSpreadLateMultiplier)??Os[t].lateMultiplier,peakMultiplier:(r==null?void 0:r.finalSpreadPeakMultiplier)??Os[t].peakMultiplier}}const Kl=.005,Wl=.005,ki=70,$i=1e3,xi=15,Ti=360,wi=8,Mi=-.75,Ri=10;function $t(e,t){return e+Math.random()*(t-e)}function Ii(e,t,a){return Math.max(t,Math.min(a,e))}function jl(e){return e==="ITT"||e==="TTT"}function Ei(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(r=>{var s,n,i;return r.id!==e.id&&r.activeTeamId===e.activeTeamId&&(((s=r.role)==null?void 0:s.name)==="Edelhelfer"||((n=r.role)==null?void 0:n.name)==="Starke Helfer"||((i=r.role)==null?void 0:i.name)==="Wassertraeger")}).map(r=>r.id)}function Ci(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function Ol(e,t,a,r){const s=r==="crash"?Ci():null,n=Number($t(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=Ii(n/Math.max(.1,a)*100,0,100),d=o<=ki;return{riderId:e.id,type:r,severity:s,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(r==="crash"?$t(10,60):$t(10,45)),recoverySeconds:d?$i:Ti,recoveryFormBonus:d?xi:wi,dayFormPenalty:Mi,staminaPenalty:Ri,recoveryPenaltyStages:r==="crash"?s==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:r==="crash"&&s==="medium"?15:0,supportRiderIds:Ei(e,t)}}function Vl(e,t,a){if(jl(t.profile)||a<=0)return[];const r=[];for(const s of e){const n=Math.random(),i=Math.random(),o=Kl*Math.max(0,t.crashIncidentMultiplier??1),d=Wl*Math.max(0,t.mechanicalIncidentMultiplier??1),l=o+(t.rolledEffektSturz??0)/100,p=d+(t.rolledEffektDefekt??0)/100,m=n<l,u=i<p;if(!m&&!u)continue;const f=m&&u?n<=i?"crash":"mechanical":m?"crash":"mechanical",g=Ol(s,e,a,f);if(f==="crash"&&Math.random()<.01){g.isMassCrashTrigger=!0;const b=Math.floor($t(2,26)),v=[...e.filter(x=>x.id!==s.id)].sort(()=>.5-Math.random());g.massCrashPotentialRiderIds=v.slice(0,b).map(x=>x.id),Math.random()<.2&&(g.hasAdditionalMechanical=!0,g.waitDurationSeconds+=Math.round($t(10,45)))}r.push(g)}return r}function Ul(e,t,a,r){const s=Ci(),n=Math.round(a*1e3),i=Ii(a/Math.max(.1,r)*100,0,100),o=i<=ki;let d=Math.round($t(10,60)),l=!1;return Math.random()<.2&&(l=!0,d+=Math.round($t(10,45))),{riderId:e.id,type:"crash",severity:s,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:d,recoverySeconds:o?$i:Ti,recoveryFormBonus:o?xi:wi,dayFormPenalty:Mi,staminaPenalty:Ri,recoveryPenaltyStages:s==="light"?[10,5,2]:[],raceRecuperationPenalty:s==="medium"?15:0,supportRiderIds:Ei(e,t),hasAdditionalMechanical:l}}function Yl(e,t){return e+Math.random()*(t-e)}function Vs(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const r=Math.floor(Yl(0,a+1)),s=t[a];t[a]=t[r]??s,t[r]=s}return t}function Zl(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function Jl(e,t,a={}){if(e.length===0)return[];const r=e.map(f=>({...f,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),s=a.teams??Zl(r),n=Ga(r,s,t,a),i=new Set(n.slice(0,20).map(f=>f.rider.id)),o=Math.min(Math.ceil(r.length*.02),Math.max(0,r.length-i.size)),d=Math.min(Math.ceil(r.length*.01),r.length),l=Vs(r.filter(f=>!i.has(f.id))),p=new Set(l.slice(0,o).map(f=>f.id)),m=Vs(r.filter(f=>!p.has(f.id))),u=new Set(m.slice(0,d).map(f=>f.id));return r.map(f=>p.has(f.id)?{...f,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:u.has(f.id)?{...f,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:f)}function Vt(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}function Us(e,t){return e+Math.random()*(t-e)}function ql(e,t,a){const r=[...e],s=[];for(;s.length<t&&r.length>0;){const n=r.reduce((l,p)=>l+Math.max(1e-4,a(p)),0);let i=Math.random()*n,o=0;for(let l=0;l<r.length;l+=1)if(i-=Math.max(1e-4,a(r[l])),i<=0){o=l;break}const[d]=r.splice(o,1);d&&s.push(d)}return s}function Xl(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function Ys(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function Ql(e,t,a){return new Set(e.map(r=>r.riderId).filter(r=>r!=null&&!t.has(r)).slice(0,a))}function ed(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function dt(e){var t;return ed((t=e.role)==null?void 0:t.name)}function td(e){return qe(e).some(({marker:t})=>ft(t))}function ad(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function rd(e,t){const a=ad(e),r=e.hasSuperform===!0?40:1,s=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&dt(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*r*s*n*i;return{attackFactor:a,superformFactor:r,gcLeaderTeamFactor:s,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function sd(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function nd(e,t){var r,s;const a=((r=t[0])==null?void 0:r.riderId)??null;return a==null?null:((s=e.find(n=>n.id===a))==null?void 0:s.activeTeamId)??null}function id(e,t,a){const r=new Map(t.map(n=>[n.id,n])),s=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=r.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||s.has(i.activeTeamId))&&(s.add(i.activeTeamId),s.size>=a))break}return s}function od(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),dt(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function ld(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const r=t.stageNumber<=10,s=Math.max(1,Math.floor(a*(r?.01:.05))),n=Math.max(s,Math.floor(a*(r?.08:.2)));return{min:s,max:n}}function dd(e,t){return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?{min:.45,max:.75}:{min:.5,max:.85}}function cd(e,t,a,r,s,n,i,o){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||r.distanceKm<=0)return null;const d=e.length,{min:l,max:p}=ld(t,a,d),m=Vt(l,p),u=t.isStageRace&&a.stageNumber<=10,f=!t.isStageRace,g=nd(e,n),b=u?id(s,e,5):new Set,y=u?od(e):new Map,v=td(r),x=Xl(s,5),M=Ys(n,10),T=new Set([...x,...M]),$=v?Ql(i,T,5):new Set,C=sd(a),R=["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain"].includes(a.profile),L=t.isStageRace&&R&&a.stageNumber>=4;let P;const D=new Set;if(L){const N=Ys(n,10),O=Ga(e,o??[],a,{distanceKm:r.distanceKm,elevationGainMeters:r.elevationGainMeters});let z=[];for(const k of O){if(z.length>=5)break;const G=k.rider;if(G.activeTeamId==null||!N.has(G.id))continue;const j=dt(G);(j==="kapitaen"||j==="co-kapitaen")&&(z.includes(G.activeTeamId)||z.push(G.activeTeamId))}if(z.length===0)for(const k of O){if(z.length>=5)break;const G=k.rider;if(G.activeTeamId==null||!N.has(G.id))continue;dt(G)==="edelhelfer"&&(z.includes(G.activeTeamId)||z.push(G.activeTeamId))}if(z.length>0&&Math.random()<.5){const k=Vt(0,z.length-1);P=z[k]}}if(P!=null){const N=e.filter(z=>z.activeTeamId===P),E=N.filter(z=>dt(z)==="kapitaen"),O=N.filter(z=>dt(z)==="co-kapitaen");if(E.length>0){if(E.forEach(z=>D.add(z.id)),E.length===1&&O.length>0){const z=[...O].sort((k,G)=>G.overallRating-k.overallRating||G.id-k.id);D.add(z[0].id)}}else if(O.length>0)[...O].sort((k,G)=>G.overallRating-k.overallRating||G.id-k.id).slice(0,2).forEach(k=>D.add(k.id));else{const z=N.filter(k=>dt(k)==="edelhelfer");if(z.length>0){const k=[...z].sort((G,j)=>j.overallRating-G.overallRating||j.id-G.id);D.add(k[0].id)}}}let _;if(P!=null){const E=e.filter(O=>O.activeTeamId===P).filter(O=>!D.has(O.id));E.length>0&&(_=[...E].sort((z,k)=>k.skills.attack-z.skills.attack||k.overallRating-z.overallRating||k.id-z.id)[0])}const H=e.filter(N=>{if(N.activeTeamId==null||x.has(N.id)||M.has(N.id)||P!=null&&N.activeTeamId===P&&(D.has(N.id)||_!=null&&N.id===_.id)||u&&g!=null&&N.activeTeamId===g||u&&b.has(N.activeTeamId))return!1;const E=dt(N);return!(f&&(E==="kapitaen"||E==="co-kapitaen")||u&&E==="kapitaen"||u&&E==="co-kapitaen"&&y.get(N.activeTeamId)!==!0||E==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(H.length===0)return null;const K=new Map(H.map(N=>[N.id,rd(N,{isEarlyStageRace:u,race:t,gcLeaderTeamId:g,stageHasMountainClassifications:v,topMountainIds:$,isHardStage:C})])),w=H.reduce((N,E)=>{var O;return N+(((O=K.get(E.id))==null?void 0:O.finalWeight)??0)},0),A=ql(H,Math.max(0,Math.min(m-(_?1:0),H.length)),N=>{var E;return((E=K.get(N.id))==null?void 0:E.finalWeight)??1});if(_&&A.push(_),A.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${A.length}/${m} ausgewählt aus ${H.length}`),console.log(`Gesamtgewicht im Pool: ${w.toFixed(2)}`),console.table(A.map(N=>{var O;const E=K.get(N.id);return{Fahrer:`${N.firstName} ${N.lastName}`,Team:N.activeTeamId,Rolle:((O=N.role)==null?void 0:O.name)??null,Atk:N.skills.attack,Hill:N.skills.hill,Chance:`${((w>0&&E!=null?E.finalWeight/w:0)*100).toFixed(2)}%`,Gewicht:((E==null?void 0:E.finalWeight)??1).toFixed(2),Attacke:`x${((E==null?void 0:E.attackFactor)??1).toFixed(2)}`,Superform:`x${(E==null?void 0:E.superformFactor)??1}`,GC_Team:`x${((E==null?void 0:E.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(E==null?void 0:E.mountainFactor)??1}`,Sprinter:`x${(E==null?void 0:E.sprinterFactor)??1}`}})),console.groupEnd();const Y=r.distanceKm*1e3,W=Vt(0,Math.min(1e4,Math.max(0,Math.floor(Y*.1)))),re=dd(t,a),q=Math.round(Y*Us(re.min,re.max)),ee=Math.round(Y*Us(.1,.25)),F=Math.max(W+1e3,Math.min(q-1e3,q-ee)),B=a.rolledBreakawayBonus??0,I=Vt(3+B,8+B);return{riderIds:A.map(N=>N.id),triggerDistanceMeters:W,groupPhaseEndDistanceMeters:F,phaseEndDistanceMeters:q,skillBonus:I,malusValue:Vt(5,8),superTeamId:P}}const ud=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),md=3,pd=7,Zs=120,Js=200,qs=180,gd=10,ba=8e3;function xt(e,t,a=Math.random()){const r=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(a*(s-r+1))+r}function fd(e){for(let t=e.length-1;t>0;t-=1){const a=xt(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function Wa(e,t){return t<=0||e.length===0?[]:fd([...e]).slice(0,Math.min(t,e.length))}function hd(e,t,a){if(t<=0||e.length===0)return[];const r=[...e],s=[];for(;r.length>0&&s.length<t;){const n=r.reduce((d,l)=>d+Math.max(0,a(l)),0);if(n<=0){s.push(...Wa(r,t-s.length));break}let i=Math.random()*n,o=r.length-1;for(let d=0;d<r.length;d+=1)if(i-=Math.max(0,a(r[d])),i<=0){o=d;break}s.push(r[o]),r.splice(o,1)}return s}function bd(e){return ud.has(e.profile)}function yd(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function vd(e,t){if(!bd(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(r=>{if(!yd(r))return[];const s=r.start_km*1e3,n=r.end_km*1e3,i=Math.max(s,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:s,sourceSegmentEndMeters:n}]})}function Xs(e,t){const a=t==null?e:e.filter(d=>{const l=Math.min(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t)),p=Math.max(Math.abs(d.startMeters-t),Math.abs(d.endMeters-t));return l>=ba||p>=ba});if(a.length===0)return null;const r=a[xt(0,a.length-1)];if(!r)return null;const s=Math.ceil(r.startMeters),n=Math.floor(r.endMeters);if(n<=s)return null;let i=0;for(;i<12;){const d=xt(s,n);if(t==null||Math.abs(d-t)>=ba)return{triggerDistanceMeters:d,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<r.startMeters?n:s;return t==null||Math.abs(o-t)>=ba?{triggerDistanceMeters:o,sourceSegmentStartMeters:r.sourceSegmentStartMeters,sourceSegmentEndMeters:r.sourceSegmentEndMeters}:null}function Sd(e,t,a,r=()=>1){const s=e.slice(0,15),n=vd(t,a);if(s.length===0||n.length===0)return[];const i=xt(md,Math.min(pd,s.length)),o=hd(s,i,r),d=[];for(const u of o){const f=Xs(n);f&&d.push({riderId:u.id,attackNumber:1,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:xt(Zs,Js),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}if(d.length===0)return[];const l=d.map(u=>u.riderId),p=Math.floor(l.length*.5),m=new Set(Wa(l,p));for(const u of[...d]){if(!m.has(u.riderId))continue;const f=Xs(n,u.triggerDistanceMeters);f&&d.push({riderId:u.riderId,attackNumber:2,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:xt(Zs,Js),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}return d.sort((u,f)=>u.triggerDistanceMeters-f.triggerDistanceMeters||u.riderId-f.riderId||u.attackNumber-f.attackNumber)}function kd(e,t,a){var d;if(e.length===0)return[];const r=((d=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:d.teamId)??null,s=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||r!=null&&l.teamId===r));if(s.length===0)return[];const n=new Map;for(const l of s){const p=n.get(l.teamId)??[];p.push(l),n.set(l.teamId,p)}const i=[...n.values()].map(l=>Wa(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(xt(0,3),i.length);return Wa(i,o).map(l=>l.riderId)}function $d(e,t){const a=[],r=[];for(const[s,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){r.push(s);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:r}}function br(e,t){const a=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(r-a+1))+a}const xd={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},Td={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},wd={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},Md={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},Rd={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function Id(e){const t=new Map;for(const a of e){const r=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",r);else if(a.appliesTo==="climb_top"){const s=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${s}`,r)}else a.appliesTo==="finish"&&t.set(a.markerType,r)}return t}const ya=20,Ed=120,Cd=300,yr=.025,Fd=.1,Pd=.4,Nd=.6,Ld=.8,ta=1,Qs=2/3,Dd=.1,va=10,en=50,Ad=25,_d=7,Bd=500,Gd=100,Hd=.02,zd=.04,Kd=.009,Wd=120,jd=150,Od=100,Vd=300,tn=50,vr=85,bt=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],an=5*60,Ud=60,Yd=.5,Zd=.3,Sa=5e3,Jd=2e3,qd=1,Xd=2,Qd=.05,Fi={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},ec={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},ka=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function ue(e,t,a){return Math.max(t,Math.min(a,e))}function de(e,t){return e+Math.random()*(t-e)}function rn(e){return e[Math.floor(Math.random()*e.length)]}function Dt(e){return Math.round(e*100)/100}function tc(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function sn(e){if(e<2)return 1;const t=ue(e,2,20),a=ka[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let r=1;r<ka.length;r+=1){const s=ka[r-1],n=ka[r];if(t>n.gradientPercent)continue;const i=(t-s.gradientPercent)/Math.max(1e-4,n.gradientPercent-s.gradientPercent),o=s.draftPenaltyShare+(n.draftPenaltyShare-s.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function ac(e){return e==="Flat"?Wd:e==="Abfahrt"?jd:Number.POSITIVE_INFINITY}function rc(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function ja(e){return(e.formBonus??0)+(e.raceFormBonus??0)-((e.fatigueMalus??0)+(e.longTermFatigueMalus??0)+(e.shortTermFatigueMalus??0))*.5}function sc(e,t){if(t.length===0)return"";const a=t.reduce((p,m)=>p+m.weight,0),r=t.map(p=>{const m=e.skills[p.key],u=Math.round(p.weight/a*100);return`${Fi[p.key]} ${Math.round(m)} (${u}%)`}),s=e.formBonus??0,n=e.raceFormBonus??0,i=(e.fatigueMalus??0)*.5,o=(e.longTermFatigueMalus??0)*.5,d=(e.shortTermFatigueMalus??0)*.5;r.push(`S-Form ${s>=0?"+":""}${s.toFixed(1).replace(".",",")}`),r.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&r.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&r.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),d>0&&r.push(`Akut -${d.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const p of t)l+=(e.mentorBoosts[p.key]||0)*(p.weight/a);return l>0&&r.push(`Mentor +${l.toFixed(1).replace(".",",")}`),r.join(" • ")}function nc(){const e=Math.random();return e<.9?de(5,20):e<.98?de(20,40):de(40,70)}function nn(){const e=Math.random();return e<.9?Dt(de(-1,1)):e<.995?Dt(rn([-1,1])*de(1,2)):Dt(rn([-1,1])*de(3,4))}function ic(){return Dt(de(-3,3))}function oc(e){const t=[];let a=0,r=nc(),s=de(-1,1);for(;a<e;){const n=Math.min(e-a,de(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:r,vector:s}),a+=n,a>=e)break;r=ue(r+(Math.random()<.5?-1:1)*de(2,10),5,70),s=ue(s+(Math.random()<.5?-1:1)*de(0,.5),-1,1)}return t}function Pi(e,t){const a=Q(e),r=Q(t);if(a!==r)return a?1:-1;const s=be(e),n=be(t);return s&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:s?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function Q(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function be(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function Ut(e,t,a=!1,r=null){var d;const s="rider"in e?e.rider:null,n=(s==null?void 0:s.specialization1)??null,i=(s==null?void 0:s.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(d=s==null?void 0:s.role)==null?void 0:d.name;r==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function lc(e,t,a=null,r=null,s=!1){var f,g;const n=b=>b.photoFinishScore;if(!t){const b=[...e].sort((v,x)=>v.crossingTimeSeconds-x.crossingTimeSeconds||x.photoFinishScore-v.photoFinishScore||v.riderId-x.riderId),y=((f=b[0])==null?void 0:f.crossingTimeSeconds)??0;return b.map((v,x)=>({riderId:v.riderId,rank:x+1,crossingTimeSeconds:v.crossingTimeSeconds,gapSeconds:Math.max(0,v.crossingTimeSeconds-y),photoFinishScore:v.photoFinishScore}))}const i=[...e].sort((b,y)=>b.crossingTimeSeconds-y.crossingTimeSeconds||y.photoFinishScore-b.photoFinishScore||b.riderId-y.riderId),o=((g=i[0])==null?void 0:g.crossingTimeSeconds)??0,d=[];let l=[],p=0,m=null;const u=()=>{const b=Math.max(0,p-o),y=l.sort((v,x)=>n(x)-n(v)||v.riderId-x.riderId);for(const v of y)d.push({riderId:v.riderId,rank:d.length+1,crossingTimeSeconds:v.crossingTimeSeconds,gapSeconds:b,photoFinishScore:v.photoFinishScore})};for(const b of i){if(l.length===0){l=[b],p=b.crossingTimeSeconds,m=b.crossingTimeSeconds;continue}if(m!=null&&b.crossingTimeSeconds-m<=ta){l.push(b),m=b.crossingTimeSeconds;continue}u(),l=[b],p=b.crossingTimeSeconds,m=b.crossingTimeSeconds}return l.length>0&&u(),d}function dc(e,t,a){const r=e.filter(be).sort((m,u)=>(m.finishTimeSeconds??0)-(u.finishTimeSeconds??0)||u.photoFinishScore-m.photoFinishScore||m.rider.id-u.rider.id),s=e.filter(m=>!Q(m)).sort(Pi),n=e.filter(m=>m.finishStatus==="dnf").sort((m,u)=>u.distanceCoveredMeters-m.distanceCoveredMeters||m.rider.id-u.rider.id),i=[];let o=[],d=null;const l=m=>m.photoFinishScore,p=()=>{i.push(...o.sort((m,u)=>l(u)-l(m)||m.rider.id-u.rider.id))};for(const m of r){const u=m.finishTimeSeconds??0;if(o.length===0){o=[m],d=u;continue}if(d!=null&&u-d<=ta){o.push(m),d=u;continue}p(),o=[m],d=u}return o.length>0&&p(),[...i,...s,...n]}function cc(e,t){const a=Q(e),r=Q(t);if(a!==r)return a?1:-1;const s=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(s)>=.1?s:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:be(e)&&be(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:be(e)?-1:be(t)?1:e.rider.id-t.rider.id}function on(e){const t=ue(e,1,en);return t<=2?.12*t:t<=va?.24+(t-2)/Math.max(1,va-2)*.58:.82+(t-va)/Math.max(1,en-va)*.18}function Sr(e,t){const a=ja(e.rider);return Object.entries(t).reduce((r,[s,n])=>{if(!n)return r;const i=s==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[s]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return r+o*n},0)}function uc(e,t){const a=ja(e.rider);return Object.entries(t).filter(r=>!!r[1]).map(([r,s])=>{const n=r,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:s,effectiveSkill:o,contribution:o*s}})}function mc(e,t,a){let r=t;for(;r>0;){const n=e[r-1].distanceCoveredMeters-e[r].distanceCoveredMeters;if(n<=0||n>=a)break;r-=1}let s=t;for(;s<e.length-1;){const n=e[s].distanceCoveredMeters-e[s+1].distanceCoveredMeters;if(n<=0||n>=a)break;s+=1}return{startIndex:r,endIndex:s,size:s-r+1,positionInGroup:t-r}}function pc(e,t){if(e<Ad)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class Ni{constructor(t,a){var H,K;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.superTeamProtectedLeaderIds=new Set,this.superTeamBonusAmount=0,this.superTeamMalusAmount=0,this.superTeamStartPercent=0,this.superTeamEndPercent=0,this.superTeamBreakawayRiderCaught=!1,this.hasLoggedFinishSprintTieBreak=!1,this.hasAppliedSprintLeadoutBonuses=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const r=(H=t.race.country)==null?void 0:H.code3;r&&(t.riders=t.riders.map(w=>{var Y;const A=w.nationality||((Y=w.country)==null?void 0:Y.code3);if(A&&A.trim().toUpperCase()===r.trim().toUpperCase()){const W={...w,skills:{...w.skills}},re=Math.random(),q=t.stage.profile,ee=q==="ITT"||q==="TTT",F=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(q==="Cobble"||q==="Cobble_Hill")&&F.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(q)||F.push("mountain","mediumMountain");const E=[...(O=>{const z=[...F],k=[];if(ee){k.push("timeTrial");const G=Math.min(O-1,z.length);for(let j=0;j<G;j++){const U=Math.floor(Math.random()*z.length);k.push(z.splice(U,1)[0])}}else{const G=Math.min(O,z.length);for(let j=0;j<G;j++){const U=Math.floor(Math.random()*z.length);k.push(z.splice(U,1)[0])}}return k})(5)].sort(()=>Math.random()-.5);if(W.homeEffectSkills=E,re<.05){W.homeEffect="home_pressure";for(const O of E)W.skills[O]=Math.max(0,W.skills[O]-.5)}else if(re<.1){W.homeEffect="super_home";const O=E[0];W.skills[O]=Math.min(100,W.skills[O]+3);for(let z=1;z<5;z++){const k=E[z];W.skills[k]=Math.min(100,W.skills[k]+1)}}else{W.homeEffect="normal_home";for(const O of E)W.skills[O]=Math.min(100,W.skills[O]+1)}return W}return w})),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=Bl(t.stage.profile),this.skillWeightRuleMap=Al(t.skillWeightRules??[]),this.skillWeightConfigMap=_l(t.skillWeightRules??[]),this.stageScoringWeightMap=Id(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=oc(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const s=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=s!=null?ue(s/100,0,1):de(Nd,Ld);const n=t.stage.finalPushStartPercent;this.finalPushStartRatio=n!=null?ue(n/100,this.lateStageStartRatio,1):ue(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const i=Vl(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(i.map(w=>[w.riderId,w])),i.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",i.map(A=>({riderId:A.riderId,type:A.type,severity:A.severity,kmMark:A.triggerDistanceKm,waitDurationSeconds:A.waitDurationSeconds,supportRiderIds:A.supportRiderIds})));const w=i.filter(A=>A.isMassCrashTrigger);w.length>0&&w.forEach(A=>{var Y;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${A.riderId} bei Km ${A.triggerDistanceKm}. Potenziell betroffene Fahrer (${(Y=A.massCrashPotentialRiderIds)==null?void 0:Y.length}):`,A.massCrashPotentialRiderIds)})}const o=t.riders.map(w=>{const A={rider:w,riderName:`${w.firstName} ${w.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:ic(),microForm:nn(),nextFormUpdateMeter:de(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(w.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(A),A}),d=new Map(o.map(w=>[w.rider.id,w.dailyForm]));this.stageFavorites=ri(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d});const l=this.stageFavorites.filter(w=>w.kind==="rider"&&w.riderId!=null).slice(0,15).map(w=>t.riders.find(A=>A.id===w.riderId)??null).filter(w=>w!=null),p=((K=t.gcStandings.find(w=>w.rank===1))==null?void 0:K.riderId)??null,m=Sd(l,t.stage,t.stageSummary,w=>Math.max(1,Math.pow(10,(w.skills.attack-65)/10))*(w.id===p?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const w of m){const A=this.precalculatedStageAttacksByRiderId.get(w.riderId)??[];A.push(w),this.precalculatedStageAttacksByRiderId.set(w.riderId,A)}this.breakawayPlan=cd(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings,t.teams);const u=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=u.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=u.fallbackCheckpointsMeters;for(const w of o)w.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const f=Jl(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:d}),g=new Map(f.map(w=>[w.id,w])),b=o.map(w=>{const A=g.get(w.rider.id)??w.rider;return{...w,rider:A,riderName:`${A.firstName} ${A.lastName}`,dailyForm:w.dailyForm+(A.specialFormDelta??0)}}),y=f.filter(w=>w.hasSuperform),v=f.filter(w=>w.hasSupermalus);(y.length>0||v.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:y.map(w=>`${w.firstName} ${w.lastName}`),supermalus:v.map(w=>`${w.firstName} ${w.lastName}`)});const x=this.resolveStartOrder(b),M=new Map((this.bootstrap.teamStartOrder??[]).map((w,A)=>[w,A]));if(this.riders=x.map((w,A)=>({...w,startOffsetSeconds:this.resolveStartOffsetSeconds(w,A,M)})),this.riders.forEach(w=>this.syncRiderTelemetry(w)),this.breakawayPlan&&this.breakawayPlan.superTeamId!=null){this.superTeamId=this.breakawayPlan.superTeamId,this.superTeamBonusAmount=br(2,6),this.superTeamMalusAmount=br(4,8),this.superTeamStartPercent=de(.4,.6),this.superTeamEndPercent=de(.86,.96);const w=F=>(F??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),A=t.riders.filter(F=>F.activeTeamId===this.superTeamId),Y=A.filter(F=>{var B;return w((B=F.role)==null?void 0:B.name)==="kapitaen"}),W=A.filter(F=>{var B;return w((B=F.role)==null?void 0:B.name)==="co-kapitaen"});if(Y.length>0){if(Y.forEach(F=>this.superTeamProtectedLeaderIds.add(F.id)),Y.length===1&&W.length>0){const F=[...W].sort((B,I)=>I.overallRating-B.overallRating||I.id-B.id);this.superTeamProtectedLeaderIds.add(F[0].id)}}else if(W.length>0)[...W].sort((B,I)=>I.overallRating-B.overallRating||I.id-B.id).slice(0,2).forEach(B=>this.superTeamProtectedLeaderIds.add(B.id));else{const F=A.filter(B=>{var I;return w((I=B.role)==null?void 0:I.name)==="edelhelfer"});if(F.length>0){const B=[...F].sort((I,N)=>N.overallRating-I.overallRating||N.id-I.id);this.superTeamProtectedLeaderIds.add(B[0].id)}}const re=t.teams.find(F=>F.id===this.superTeamId),q=re?re.name:`Team ${this.superTeamId}`;this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,riderTeamId:this.superTeamId,type:"superteam",tone:"neutral",title:`Superteam des Tages: ${q}`,detail:`Dieses Team hat sich heute zusammengeschlossen, um seinen Leader zu unterstützen! Die Helfer erhalten zwischen ${(this.superTeamStartPercent*100).toFixed(0)}% und ${(this.superTeamEndPercent*100).toFixed(0)}% der Etappe einen Bonus von +${this.superTeamBonusAmount} auf Berg, Hill, Medium Mountain und Flat. Danach folgt ein individueller Malus von -4 bis -8 wegen Erschöpfung.`});const ee=this.riders.find(F=>{var B;return F.rider.activeTeamId===this.superTeamId&&((B=this.breakawayPlan)==null?void 0:B.riderIds.includes(F.rider.id))});ee&&(this.superTeamBreakawayRiderId=ee.rider.id)}for(const w of this.riders){const A=w.rider.homeEffectSkills,Y=W=>ec[W]||W;if(w.rider.homeEffect==="super_home"){const W=A&&A.length===5?`${Y(A[0])} (+3), ${Y(A[1])} (+1), ${Y(A[2])} (+1), ${Y(A[3])} (+1), ${Y(A[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${W})`})}if(w.rider.homeEffect==="home_pressure"){const W=A?A.map(Y).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${W})`})}if(w.rider.homeEffect==="normal_home"){const W=A?A.map(Y).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${W})`})}w.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),w.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),w.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:w.rider.id,riderName:w.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(w.rider.id,w.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const T=this.bootstrap.stage.rolledWetterName??"Sonnig",$=this.bootstrap.stage.rolledEffektSturz??0,C=this.bootstrap.stage.rolledEffektDefekt??0,R=this.bootstrap.stage.rolledWindkantenGefahr??0,L=this.bootstrap.stage.rolledEffektFatigue??0,P=this.bootstrap.stage.rolledBreakawayBonus??0,D=[];$>0&&D.push(`Sturzwahrscheinlichkeit +${$.toFixed(1)}%`),C>0&&D.push(`Defektwahrscheinlichkeit +${C.toFixed(1)}%`),R>0&&D.push(`Windkanten-Gefahr +${(R*100).toFixed(1)}%`),L>0&&D.push(`Fatigue +${L.toFixed(1)}%`),P>0&&D.push(`Ausreißer-Bonus +${P.toFixed(1)}`);const _=D.length>0?`Wettereinflüsse: ${D.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${T}`,detail:_})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const r=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(r),a-=r}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(r=>({riderId:r.rider.id,riderName:r.riderName,startOffsetSeconds:r.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(r),hasStarted:r.hasStarted||Q(r),distanceCoveredMeters:r.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-r.distanceCoveredMeters),segmentStartKm:r.segmentStartKm,segmentEndKm:r.segmentEndKm,segmentStartElevation:r.segmentStartElevation,segmentEndElevation:r.segmentEndElevation,activeTerrain:be(r)?"Finish":r.activeTerrain,skillName:be(r)?"Finish":r.skillName,skillBreakdown:be(r)?"":r.skillBreakdown,baseSkill:r.baseSkill,teamGroupBonus:r.teamGroupBonus,effectiveSkill:r.effectiveSkill,staminaPenalty:r.staminaPenalty,elevationPenalty:r.elevationPenalty,dailyForm:r.dailyForm,microForm:r.microForm,gradientPercent:r.gradientPercent,gradientModifier:r.gradientModifier,windModifier:r.windModifier,draftModifier:r.draftModifier,draftNearbyRiderCount:r.draftNearbyRiderCount,draftPackFactor:r.draftPackFactor,currentSpeedMps:r.currentSpeedMps,photoFinishScore:r.photoFinishScore,leadoutBonus:r.leadoutBonus,leadoutRiderId:r.leadoutRiderId,leadoutContributions:r.leadoutContributions,lastSplitLabel:r.lastSplitLabel,lastSplitTimeSeconds:r.lastSplitTimeSeconds,splitTimes:{...r.splitTimes},finishTimeSeconds:Number.isFinite(r.finishTimeSeconds??Number.NaN)?r.finishTimeSeconds:null,finishStatus:r.finishStatus,statusReason:r.statusReason,isAttacking:r.isAttacking,isBreakaway:r.isBreakaway,isLeadingGroup:r.isLeadingGroup,hasSuperform:r.rider.hasSuperform===!0,hasSupermalus:r.rider.hasSupermalus===!0,isFinished:be(r)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(r=>r.appliedIncident?[r.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus},superTeamId:this.superTeamId}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let r=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(r=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(r==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,d)=>Math.max(o,d.distanceCoveredMeters),0);r=Number((i/1e3).toFixed(2))}const s={id:this.nextMessageId,...t,riderTeamId:a,kmMark:r};this.messages.unshift(s),this.allEvents.push(s),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(r=>[r.rider.id,r]));return this.intermediateMarkers.map(r=>{const s=t.map(i=>i.markerCrossings[r.key]??null).filter(i=>i!=null),n=lc(s,!this.isTimeTrialMode,r.markerType,a,this.isClimberMalusStage());return{markerKey:r.key,markerLabel:r.label,markerType:r.markerType,markerCategory:r.markerCategory,kmMark:r.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.isTimeTrialMode?[...this.riders].sort(Pi):dc(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(s=>s.finishStatus!=="dnf").reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0);let r=0;for(const s of t)be(s)&&(r+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:r,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(Q)}advanceSubstep(t){const a=this.elapsedSeconds,r=a+t,s=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();if(this.updateBreakawayPhaseState(),this.superTeamId!=null&&this.superTeamBreakawayRiderId!=null&&!this.superTeamBreakawayRiderCaught){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&!Q(l)&&this.riders.filter(u=>this.superTeamProtectedLeaderIds.has(u.rider.id)&&!Q(u)).some(u=>u.distanceCoveredMeters>=l.distanceCoveredMeters)&&(this.superTeamBreakawayRiderCaught=!0,l.breakawayMalus=0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} von Leader eingeholt!`,detail:"Der Ausreißer wurde von seinem Kapitän eingeholt und unterstützt das Team ab jetzt mit frischen Kräften!"}))}if(this.superTeamBreakawayRiderCaught&&this.superTeamBreakawayRiderId!=null){const l=this.riders.find(p=>p.rider.id===this.superTeamBreakawayRiderId);l&&(l.breakawayMalus=0)}for(const l of this.riders){if(Q(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,r-p);if(m<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-m),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const u=this.currentSegment(l),f=this.currentWindZone(l);if(!u||!f){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=p,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const b=Ut(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=b,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[];continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,s);const g=this.calculateBasePhysics(l,u,f);l.activeTerrain=u.terrain,l.skillName=g.skillName,l.skillBreakdown=g.skillBreakdown,l.baseSkill=g.baseSkill,l.teamGroupBonus=g.teamGroupBonus,l.effectiveSkill=g.effectiveSkill,l.staminaPenalty=g.staminaPenalty,l.elevationPenalty=g.elevationPenalty,l.gradientPercent=g.gradientPercent,l.gradientModifier=g.gradientModifier,l.windModifier=g.windModifier,l.tempSpeedMps=g.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=g.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*m}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,r);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const p of this.riders)l.push(p);l.sort(cc);for(let p=0;p<l.length;p+=1){const m=l[p];if(Q(m))continue;const u=this.isActiveBreakawayRider(m),f=m.tempSpeedMps/14,g=Math.max(5,50*f),b=this.currentSegment(m),y=Math.max(15,150*f),v=Math.max(g,Math.min(y,ac(b==null?void 0:b.terrain))),x=mc(l,p,v),M=x.size,T=on(M),$=pc(M,x.positionInGroup);let C=0,R=Number.POSITIVE_INFINITY,L=null;for(let I=p-1;I>=0;I-=1){const N=l[I],E=N.distanceCoveredMeters-m.distanceCoveredMeters;if(E>=v+Dd)break;!this.canReceiveDraftFromCandidate(m,N)||this.isActiveBreakawayRider(N)||E<=0||E>=v||(C+=1,E<=R&&(R=E,L=N))}if(C===0||!L){if(u)continue;m.draftModifier=1,m.draftNearbyRiderCount=0,m.draftPackFactor=0,m.currentSpeedMps=m.tempSpeedMps,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,m.isLeadingGroup=!0,this.applyCaptainWaitLogic(m);continue}const P=Q(L)?L.tempSpeedMps:L.currentSpeedMps,D=R,_=D<=g?1:1-(D-g)/Math.max(1e-4,v-g),H=this.currentWindZone(m),K=(H==null?void 0:H.vector)??0,w=(H==null?void 0:H.windSpeedKph)??0,A=-K*(w/70),W=Math.max(.3,.35+.35*A)*Math.min(1,f)*Qs,re=ue((b==null?void 0:b.gradient_percent)??0,-20,20),q=sn(re),F=1+($?0:W*_*T*q),B=m.tempSpeedMps*F;if(!(u&&F<=m.draftModifier)){if(m.draftModifier=F,m.draftNearbyRiderCount=M,m.draftPackFactor=T,m.isLeadingGroup=$,B>P){if(m.tempSpeedMps>L.tempSpeedMps){m.currentSpeedMps=B,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t;continue}if(D<1){m.currentSpeedMps=P,m.nextDistanceCoveredMeters=L.distanceCoveredMeters+P*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=Math.min(B,P+2),m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m);continue}m.currentSpeedMps=B,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+m.currentSpeedMps*t,u||this.applyCaptainWaitLogic(m)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(Q(l))continue;if(this.superTeamId!=null&&l.rider.activeTeamId===this.superTeamId&&!this.superTeamProtectedLeaderIds.has(l.rider.id)){const v=l.rider.id===this.superTeamBreakawayRiderId;if(!v||this.superTeamBreakawayRiderCaught){const x=l.distanceCoveredMeters/this.stageDistanceMeters;let M=0,T=!1,$=!1;v?x<this.superTeamEndPercent?T=!0:l.superTeamActiveLogged&&($=!0):x>=this.superTeamStartPercent&&x<this.superTeamEndPercent?T=!0:x>=this.superTeamEndPercent&&l.superTeamActiveLogged&&($=!0),T?(M=this.superTeamBonusAmount,l.superTeamActiveLogged||(l.superTeamActiveLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} leistet Führungsarbeit!`,detail:v?`Der eingeholte Ausreißer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`:`Der Edelhelfer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`}))):$&&(l.superTeamMalusAmount==null&&(l.superTeamMalusAmount=br(4,8)),M=-l.superTeamMalusAmount,l.superTeamExhaustedLogged||(l.superTeamExhaustedLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"warning",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} ist erschöpft!`,detail:`Die Führungsarbeit hat ihren Tribut gefordert. Der Fahrer erhält für den Rest der Etappe einen Malus von -${l.superTeamMalusAmount} auf Berg-, Hügel- und Flachpassagen.`}))),l.originalSkills||(l.originalSkills={flat:l.rider.skills.flat,mountain:l.rider.skills.mountain,mediumMountain:l.rider.skills.mediumMountain,hill:l.rider.skills.hill}),l.rider.skills.flat=l.originalSkills.flat+M,l.rider.skills.mountain=l.originalSkills.mountain+M,l.rider.skills.mediumMountain=l.originalSkills.mediumMountain+M,l.rider.skills.hill=l.originalSkills.hill+M}}if(this.isTimeTrialMode&&r<=l.startOffsetSeconds)continue;const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,m=Math.max(0,r-p);if(m<=0)continue;const u=l.distanceCoveredMeters,f=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*m,g=l.pendingIncident;if(g&&u<g.triggerDistanceMeters&&f>=g.triggerDistanceMeters){const v=Math.max(.1,l.currentSpeedMps),x=Math.max(0,(g.triggerDistanceMeters-u)/v);l.distanceCoveredMeters=g.triggerDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.applyIncident(l,g,p+x),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const b=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,f-l.distanceCoveredMeters)>=b){const v=b/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),l.finishTimeSeconds=p+v,l.currentSpeedMps=0;const x=Ut(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=x,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[]}else l.distanceCoveredMeters=f,this.recordIntermediateSplits(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,u,l.distanceCoveredMeters,p,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,u,l.distanceCoveredMeters,p),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-m),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!Q(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=nn(),l.nextFormUpdateMeter+=de(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),p=this.riders.filter(u=>l.has(u.rider.id)&&!Q(u)),m=this.riders.filter(u=>!l.has(u.rider.id)&&!Q(u));if(p.length>0&&m.length>0){const u=p.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,p[0]);m.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,m[0]).distanceCoveredMeters>=u.distanceCoveredMeters&&(u.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:u.rider.id,riderName:u.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${u.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const d=$d(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of d.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!Q(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const r=new Map;for(const s of this.riders){if(Q(s)||s.rider.activeTeamId==null||a<=s.startOffsetSeconds)continue;const n=r.get(s.rider.activeTeamId)??[];n.push(s),r.set(s.rider.activeTeamId,n)}for(const s of r.values()){const n=s[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,s.length),d=[...s].sort((u,f)=>f.effectiveSkill-u.effectiveSkill||u.rider.id-f.rider.id).slice(0,o).reduce((u,f)=>u+f.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-s.length),p=Math.max(1,d-l),m=this.resolveTimeTrialSpeedMps(p,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*Hl(i.terrain,this.bootstrap.skillWeightRules??[]);for(const u of s){const f=Math.max(t,u.startOffsetSeconds),g=Math.max(0,a-f);u.currentSpeedMps=m,u.tempSpeedMps=m,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+m*g}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const s=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?s.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,d=i.rider.activeTeamId!=null?s.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==d?o-d:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(s=>[s.riderId,s.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((s,n)=>{const i=a.get(s.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(s)-this.resolveProjectedIttStartScore(n)||s.rider.id-n.rider.id}):[...t].sort((s,n)=>s.rider.skills.timeTrial-n.rider.skills.timeTrial||s.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,r=0;for(const s of this.bootstrap.stageSummary.segments){const n=(s.start_km+s.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,s.terrain),d=i>0?this.resolveWeightedSkill(t.rider,s.terrain,i):o,l=Math.max(0,o.value-d.value),{effectiveSkill:p}=this.resolveEffectiveSkill({rider:t,baseSkill:d.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),m=ue(s.gradient_percent,-20,20),u=m>0?Math.exp(-.11*m):1-m*.06,f=this.windZones.find(b=>n>=b.startMeter&&n<=b.endMeter)??this.windZones[this.windZones.length-1],g=f?1+f.vector*(f.windSpeedKph/100)*.52:1;a+=p*u*g*s.length_km,r+=s.length_km}return r>0?a/r:0}resolveStartOffsetSeconds(t,a,r){if(this.isIndividualTimeTrial)return a*Ed;if(this.isTeamTimeTrial){const s=t.rider.activeTeamId;return(s!=null?r.get(s)??0:0)*Cd}return 0}buildIntermediateMarkers(){return qe(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||ft(t)).map(({key:t,label:a,marker:r,kmMark:s})=>({key:t,distanceMeters:s*1e3,label:a,markerType:r.type,markerCategory:r.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(d=>d.distanceMeters<t.groupPhaseEndDistanceMeters),r=this.stageDistanceMeters*Zd,s=a.some(d=>d.distanceMeters<=r);if(!(a.length<=1||!s))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(Sa,Math.ceil(r/Sa)*Sa);for(let d=o;d<t.groupPhaseEndDistanceMeters;d+=Sa)i.push(d);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,r){const s=rc(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,d=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),p=Math.min(85,o.value)+l,m=this.isTimeTrialMode?0:t.teamGroupBonus,u=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:f,staminaPenalty:g,elevationPenalty:b}=this.resolveEffectiveSkill({rider:t,baseSkill:p,staminaPenalty:d,teamGroupBonus:m,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:u}),y=ue(a.gradient_percent,-20,20),v=y>0?Math.exp(-.11*y):1-y*.06,x=1+r.vector*(r.windSpeedKph/100)*.52,M=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:s,skillBreakdown:o.breakdown,baseSkill:p,teamGroupBonus:m,effectiveSkill:f,staminaPenalty:g,elevationPenalty:b,gradientPercent:y,gradientModifier:v,windModifier:x,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(f,t.distanceCoveredMeters,a,v,x):this.resolveRoadStageSpeedMps(f,t.distanceCoveredMeters,a,v,x,M)}}resolveRoadStageSpeedMps(t,a,r,s,n,i){const o=this.resolveSkillSpreadFactor(a,r),d=this.resolveSegmentElevation(r,a),l=this.resolveElevationSkillSpreadFactor(r,d),u=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,u*s*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const r=Math.max(0,a-Bd),s=Math.floor(r/Gd);return t.terrain==="Mountain"?1+(s*zd+s*Math.max(0,s-1)*Kd/2):1+s*Hd}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const r=a.filter(n=>n.activeTerrain===t.activeTerrain);return(r.length>0?r:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,r){if(r<=1)return{draftModifier:1,draftPackFactor:0};const s=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,d=-i*(o/70),p=Math.max(.3,.35+.35*d)*Math.min(1,s)*Qs,m=ue(a.gradient_percent,-20,20),u=sn(m),f=on(r);return{draftModifier:1+p*f*u,draftPackFactor:f}}resolveBreakawayTimeGapPenalty(t){if(t<an)return 0;const a=Math.floor((t-an)/Ud);return Yd+a}recordBreakawayFallbackCheckpointCrossings(t,a,r,s,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>r)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const d=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?s+d-t.startOffsetSeconds:s+d);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let s=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((d,l)=>l.distanceCoveredMeters-d.distanceCoveredMeters||l.currentSpeedMps-d.currentSpeedMps||d.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,s;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const d=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!d)break;const l=n.markerCrossings[d.key]??null;if(!l)break;const p=t.map(m=>m.markerCrossings[d.key]??null).filter(m=>m!=null).sort((m,u)=>m.crossingTimeSeconds-u.crossingTimeSeconds||m.riderId-u.riderId)[0]??null;if(p){const m=l.crossingTimeSeconds-p.crossingTimeSeconds;s=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:s,kmMark:d.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const d=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[d]??null;if(l==null)break;const p=t.map(m=>m.breakawayFallbackCheckpointTimes[d]??null).filter(m=>m!=null).sort((m,u)=>m-u)[0]??null;if(p!=null){const m=l-p;s=this.resolveBreakawayTimeGapPenalty(m),this.breakawayGapStatus={gapSeconds:m,penalty:s,kmMark:d<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[d]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return s}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),r=this.riders.filter(o=>!Q(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),s=this.riders.filter(o=>!Q(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(r.length===0||s.length===0){this.breakawayGapStatus=null;return}const n=[...r].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null,i=[...s].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const d=this.intermediateMarkers[o];if(!d)continue;const l=n.markerCrossings[d.key]??null,p=i.markerCrossings[d.key]??null;if(!l||!p)continue;const m=p.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:d.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const d=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(d==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,p=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||p==null)continue;const m=p-l;this.breakawayGapStatus={gapSeconds:m,penalty:this.resolveBreakawayTimeGapPenalty(m),kmMark:d/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=new Set(a.riderIds),s=this.riders.filter(o=>!Q(o)&&r.has(o.rider.id));if(s.length===0)return;const n=this.riders.filter(o=>!Q(o)&&!r.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(s,n);for(const o of s)o.breakawayGapPenalty=i;for(const o of s){const d=this.currentSegment(o);if(!d)continue;const p=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=p,o.tempSpeedMps=this.resolveRoadStageSpeedMps(p,o.distanceCoveredMeters,d,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(d.terrain));const m=this.resolveMaxBreakawayDraftModifier(o,d,s.length);o.draftModifier=m.draftModifier,o.draftNearbyRiderCount=Math.max(0,s.length-1),o.draftPackFactor=m.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*m.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,r,s,n){return this.resolveRoadStageSpeedMps(t,a,r,s,n,.5)}syncRiderTelemetry(t,a=null){var i;const r=this.currentSegment(t),s=this.currentWindZone(t);if(Q(t)||!r||!s){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,r,s);t.segmentStartKm=r.start_km,t.segmentEndKm=r.end_km,t.segmentStartElevation=r.start_elevation,t.segmentEndElevation=r.end_elevation,t.activeTerrain=r.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),r=this.riders.reduce((n,i)=>Q(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(r<=t.phaseEndDistanceMeters)return!1;let s=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(r<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<Qd){n.breakawayMalus=0,s=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),d=Math.floor(o/Jd),l=Math.min(Xd,n.breakawayInitialMalus),p=Math.max(l,n.breakawayInitialMalus-d*qd),m=Dt(p);m!==n.breakawayMalus&&(n.breakawayMalus=m,s=!0)}return s}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const r=new Set(a.riderIds);for(const s of this.riders)Q(s)||!r.has(s.rider.id)||this.syncRiderTelemetry(s,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(s=>t.riderIds.includes(s.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const s of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:s.rider.id,riderName:s.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(s.rider.id,s.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let r=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),r=!0}if(this.breakawayPhaseActive&&a.some(s=>s.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const s of a)s.breakawayMalus=t.malusValue,s.breakawayInitialMalus=t.malusValue,s.breakawayRecoveryStartDistanceMeters=null,s.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return r}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const r=this.riders.filter(o=>!Q(o)&&a.riderIds.includes(o.rider.id));if(r.length===0)return;const s=[...r].sort((o,d)=>d.distanceCoveredMeters-o.distanceCoveredMeters||d.currentSpeedMps-o.currentSpeedMps||o.rider.id-d.rider.id)[0];if(!s)return;const n=Math.max(.1,s.currentSpeedMps),i=s.distanceCoveredMeters+n*t;for(const o of r){if(Math.max(0,s.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?gd:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const r=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(r==null||r.isCounterAttack)return!0;const s=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(s==null?void 0:s.isCounterAttack)===!0&&s.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(r=>r.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const r=this.resolvePreStageGcRank(t);return r!=null?`${a} (${r}.)`:a}triggerStageAttacksForRider(t,a,r,s){if(Q(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||r<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(r/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const d=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/d),p=s+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:p,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const m=new Set(this.activeStageAttacksByRiderId.keys()),u=this.stageFavorites.slice(0,20).filter(b=>{if(b.kind!=="rider"||b.riderId==null)return!1;const y=this.riders.find(x=>x.rider.id===b.riderId);if(!y||Q(y))return!1;const v=t.distanceCoveredMeters-y.distanceCoveredMeters;return v>=0&&v<=150}),f=kd(u,t.rider.id,m),g=[];for(const b of f){const y=this.riders.find(v=>v.rider.id===b);!y||Q(y)||this.activeStageAttacksByRiderId.has(b)||(this.activeStageAttacksByRiderId.set(b,{riderId:b,remainingSeconds:qs,startedAtElapsedSeconds:p,triggerDistanceMeters:y.distanceCoveredMeters,durationSeconds:qs,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),y.isAttacking=!0,g.push({riderId:b,riderName:this.formatRiderWithPreStageGc(b,y.riderName),riderTeamId:y.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:p,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const b of g)this.pushMessage({elapsedSeconds:p,riderId:b.riderId,riderName:b.riderName,type:"counter_attack",tone:"warning",title:`${b.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const r of t){if(r.finishStatus==="dnf")continue;const s=a[a.length-1];if(!s||Math.abs(s.distanceMeter-r.distanceCoveredMeters)>=ya){a.push({riderIds:[r.rider.id],riderCount:1,distanceMeter:r.distanceCoveredMeters,distanceSum:r.distanceCoveredMeters});continue}s.riderIds.push(r.rider.id),s.riderCount+=1,s.distanceSum+=r.distanceCoveredMeters,s.distanceMeter=s.distanceSum/s.riderCount}return a.map(({distanceSum:r,...s})=>s)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!Q(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),r=new Map;let s=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],d=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-d<ya;){const m=a[n].rider.activeTeamId;m!=null&&r.set(m,(r.get(m)??0)+1),n+=1}for(;s<a.length&&d-a[s].distanceCoveredMeters>=ya;){const m=a[s].rider.activeTeamId;if(m!=null){const u=(r.get(m)??0)-1;u<=0?r.delete(m):r.set(m,u)}s+=1}const l=o.rider.activeTeamId,p=l==null?0:Math.max(0,(r.get(l)??0)-1);t.set(o.rider.id,p===0?0:Dt(p*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?_d:0,r=this.resolveBreakawaySkillBonus(t.rider),s=t.baseSkill+ja(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+r+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,s),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const r=ue(this.stageDistanceMeters/1e3,Od,Vd),s=this.interpolateStaminaDistanceValue(r),n=ue(t,tn,vr),i=(vr-n)/(vr-tn),o=s/3+i*s,d=this.stageDistanceMeters<=0?0:ue(a/this.stageDistanceMeters,0,1);return o*d**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=bt[0].kmMark)return bt[0].value;for(let a=0;a<bt.length-1;a+=1){const r=bt[a],s=bt[a+1];if(t<=s.kmMark){const n=Math.max(1e-4,s.kmMark-r.kmMark),i=(t-r.kmMark)/n;return r.value+(s.value-r.value)*i}}return bt[bt.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/yr),r=Math.max(1,Math.ceil(t/yr)),s=de(Fd,Pd),n=Array.from({length:r},()=>de(.2,1.2)),i=n.reduce((l,p)=>l+p,0),o=Array.from({length:a+1},()=>1);o[0]=s;let d=0;for(let l=1;l<=r;l+=1)d+=n[l-1]??0,o[l]=s+(1-s)*(d/i);return o}resolveSkillSpreadFactor(t,a){const r=this.stageDistanceMeters<=0?1:ue(t/this.stageDistanceMeters,0,1),s=Math.min(this.spreadCurve.length-1,Math.floor(r/yr)),n=this.spreadCurve[s]??1;if(r<=this.lateStageStartRatio)return n;const i=zl(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),d=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=ue((r-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),p=this.interpolateFinalSpread(o,l);if(o<=1&&d<=1)return n;if(r<this.finalPushStartRatio||d<=o)return Math.max(n,p);const m=ue((r-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),u=o+(d-o)*m;return Math.max(n,u)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const r=Si(this.simulationMode,t,this.skillWeightRuleMap).map(s=>({key:s.key,weight:s.weight}));return this.weightedSkillComponentsByTerrain.set(t,r),r}resolveWeightedSkill(t,a,r=0){const s=this.resolveWeightedSkillComponents(a),n=r>0||t.mentorBoosts?{...t.skills}:t.skills;if(r>0&&(n.stamina=Math.max(0,n.stamina-r)),t.mentorBoosts)for(const[l,p]of Object.entries(t.mentorBoosts))typeof p=="number"&&(n[l]+=p);let i=0,o=0;for(const l of s)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:Gl(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,s)}}resolveSkillBreakdown(t,a,r){const s=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(s);if(n!==void 0)return n;const i=sc(t,r);return this.skillBreakdownCache.set(s,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const r=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,s=Math.max(0,100-r)/1e3,n=this.resolveElevationBucket(a);return s*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const r=a??this.interpolateElevation(t.distanceCoveredMeters),s=this.resolveElevationBucket(r);return s===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=s,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,r)),t.elevationPenalty}resolveSegmentElevation(t,a){const r=t.start_km*1e3,s=t.end_km*1e3,n=Math.max(1e-4,s-r),i=ue((a-r)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const s=ue(t,0,this.stageDistanceMeters)/1e3;if(s<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(s<=o.kmMark){const d=Math.max(1e-4,o.kmMark-i.kmMark),l=(s-i.kmMark)/d;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),Sr(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var m;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(be).sort((u,f)=>(u.finishTimeSeconds??0)-(f.finishTimeSeconds??0)||f.photoFinishScore-u.photoFinishScore||u.rider.id-f.rider.id);if(t.length===0)return;const a=[];let r=null;for(const u of t){const f=u.finishTimeSeconds??0;if(a.length===0){a.push(u),r=f;continue}if(r!=null&&f-r<=ta){a.push(u),r=f;continue}break}const s=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=u=>u.photoFinishScore,o=[...a].sort((u,f)=>i(f)-i(u)||u.rider.id-f.rider.id),d=((m=o[0])==null?void 0:m.finishTimeSeconds)??0,l=this.finishWeightProfile,p=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${p} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${ta.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${s}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((u,f)=>{const g=uc(u,l).map($=>`${Fi[$.skillKey]} ${$.contribution.toFixed(2)} = ${$.effectiveSkill.toFixed(2)} x ${($.weight*100).toFixed(0)}%`).join(" | "),b=u.finishTimeSeconds??0,y=b-d,v=y<=1e-4?`${b.toFixed(2)} s`:`${b.toFixed(2)} s (+${y.toFixed(2)} s)`,x=this.calculatePhotoFinishScore(u),M=u.leadoutBonus??0,T=Ut(u,s,n);console.log(`#${f+1} Zielsprint | ${u.riderName} | Zeit ${v} | Score (ohne Boni): ${x.toFixed(2)} -> Score (mit Boni): ${u.photoFinishScore.toFixed(2)} [SpecAdj: ${T>0?"+":""}${T.toFixed(2)}, Leadout: +${M.toFixed(2)}] | ID-Tiebreak ${u.rider.id} | (${g})`)}),console.groupEnd()}recordIntermediateSplits(t,a,r,s,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>r)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,d=Math.max(0,this.isTimeTrialMode?s+o-t.startOffsetSeconds:s+o);let l=this.resolveMarkerCrossingScore(t,i);const p=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;p&&(l+=Ut(t,p,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=d,t.splitTimes[i.key]=d,t.splitTimes[i.label]=d,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:d,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return Sr(t,this.resolveSprintWeightProfile());const r=Sr(t,this.resolveClimbWeightProfile(a.markerCategory)),s=tc(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return r+s}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??xd}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??Rd[a]}calculatePreLeadoutFinishScore(t){const r=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,s=ja(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[d,l])=>{if(!l)return o;const p=d==="stamina"?r:0,m=Math.max(0,t.rider.skills[d]+s+t.dailyForm+t.microForm+t.teamGroupBonus-p);return o+m*l},0),i=Ut(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}applySprintLeadoutBonuses(){const t=this.resolveFinishMarkerType();if(t!=="finish_flat"&&t!=="finish_hill"||this.isTimeTrialMode)return;const a=this.riders.filter(be).sort((o,d)=>(o.finishTimeSeconds??0)-(d.finishTimeSeconds??0));if(a.length===0)return;const r=[];let s=null;for(const o of a){const d=o.finishTimeSeconds??0;if(r.length===0){r.push(o),s=d;continue}if(s!=null&&d-s<=ta){r.push(o),s=d;continue}break}const n=new Set(r.map(o=>o.rider.id)),i=new Map;for(const o of this.riders)if(o.finishStatus!=="dnf"&&o.finishStatus!=="otl"&&o.finishStatus!=="dns"&&o.finishTimeSeconds!=null&&o.rider.skills.sprint>=73&&o.rider.activeTeamId!=null&&n.has(o.rider.id)){const d=o.rider.activeTeamId,l=i.get(d)??[];l.push(o),i.set(d,l)}for(const[o,d]of i.entries()){if(d.length===0)continue;let l=null,p=Number.NEGATIVE_INFINITY;for(const m of d){const u=this.calculatePreLeadoutFinishScore(m);u>p?(p=u,l=m):u===p&&l!==null&&(m.rider.skills.sprint>l.rider.skills.sprint||m.rider.skills.sprint===l.rider.skills.sprint&&m.rider.id<l.rider.id)&&(l=m)}if(l){const m=this.calculateSprintLeadoutBonusForRider(l);m>0&&(l.leadoutBonus=m,l.photoFinishScore+=m)}}}calculateSprintLeadoutBonusForRider(t){const a=t.rider.activeTeamId;if(a==null)return 0;const r=this.riders.filter(p=>p.rider.activeTeamId===a);if(r.length===0)return 0;let s=this.teamSprintRandomValues.get(a);s===void 0&&(s=de(.25,.6),this.teamSprintRandomValues.set(a,s));let n=this.teamSprintSpecialRandomValues.get(a);n===void 0&&(n=de(.1,.3),this.teamSprintSpecialRandomValues.set(a,n)),t.leadoutRiderId=null;let i=0,o=0,d=null;const l=[];for(const p of r){if(p.rider.id===t.rider.id||p.finishStatus==="dnf"||p.finishStatus==="otl"||p.finishStatus==="dns")continue;let m=0;const u=p.rider.skills.sprint>=72,f=p.rider.skills.flat>=78,g=p.rider.skills.timeTrial>=76,b=p.rider.skills.acceleration>=80;if(u&&m++,f&&m++,g&&m++,b&&m++,m>0){const y=u?s:n;let v=1;m===2?v=1.25:m===3?v=1.5:m===4&&(v=2);const x=y*v*1.5;if(i+=y*v,l.push({riderId:p.rider.id,name:p.riderName,contribution:Number(x.toFixed(2))}),y*v>o)o=y*v,d=p.rider.id;else if(y*v===o&&d!==null){const M=this.riders.find(T=>T.rider.id===d);M&&p.rider.skills.sprint>M.rider.skills.sprint&&(d=p.rider.id)}}}return i>0&&(t.leadoutRiderId=d,t.leadoutContributions=l),i*1.5}resolveFinishMarkerType(){const t=qe(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const r=t[a].marker.type;if(r==="finish_flat"||r==="finish_hill"||r==="finish_mountain")return r}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return wd;case"finish_mountain":return Md;default:return Td}}resolveRiderClockSeconds(t){if(be(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,r,s=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(d=>d.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){s=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const d=this.riders.find(p=>p.rider.id===o);if(!d||Q(d))continue;if(Math.abs(d.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const p=Ul(d.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(d,p,r,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:s?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:r,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:s?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:r,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(r=>r.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+ya){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const gc=300;async function fc(e,t){const a=new Ni(e,{maxSubstepSeconds:5});let r=!1;for(;!r;){const s=a.step(gc);if(r=s.isFinished,t){const n=s.stageDistanceMeters>0?s.leaderDistanceMeters/s.stageDistanceMeters:0,i=e.riders.length>0?s.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const hc=[1,2,5,10,25,50,100,250,500],ln=new WeakMap;function bc(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function dn(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function yc(e){const t=ln.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${hc.map(r=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return ln.set(e,a),a}function cn(e,t){const a=yc(e);a.timeField&&(a.timeField.textContent=bc(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${dn(t.snapshot.leaderDistanceMeters)} / ${dn(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(r=>{const s=Number(r.dataset.raceSimSpeed);r.classList.toggle("active",s===t.timeMultiplier)})}const vc=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function Sc(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),r=t%60;return`${a}:${String(r).padStart(2,"0")}`}function zt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function kc(e){return`/jersey/Jer_${e}.png`}function Li(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${zt(kc(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function $c(e){return e.riderId==null||e.riderTeamId==null?"":Li(e.riderTeamId)}function xc(e){const t=zt(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function Tc(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${zt(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${zt(e)}</button>`}function wc(e,t){if(t==="all")return!0;const a=Di(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function Mc(e){const t=e.detail?zt(e.detail):"",a=(e.secondaryRiders??[]).map(s=>`${s.riderTeamId!=null?Li(s.riderTeamId,"race-sim-message-inline-jersey"):""}${Tc(s.riderName,s.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const r=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${r}</span>`}function Di(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function un(e,t,a="all"){const r=t.filter(n=>wc(n,a)),s=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${vc.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${r.length===0?`<div class="race-sim-message-empty">${s}</div>`:r.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${zt(Di(n))}">
          <span class="race-sim-message-time">t=${Sc(n.elapsedSeconds)}</span>
          ${$c(n)}
          <span class="race-sim-message-text">
            ${xc(n)}
            ${Mc(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const Rc=1,Ic={Flat:12,Rolling:14,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:23,High_Mountain:25,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function Ec(e){return Math.max(0,Math.round(e))}function Ai(e){return e==="ITT"||e==="TTT"}function Cc(e){return Ic[e]??20}function Fc(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+Cc(e)/100))}function Pc(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function mn(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function kr(e,t){if(Ai(t))return[...e].sort(Pc);const a=[...e].sort((o,d)=>o.stageTimeSeconds-d.stageTimeSeconds||mn(o,d)),r=[];let s=[],n=null;const i=()=>{r.push(...s.sort(mn))};for(const o of a){if(s.length===0){s=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=Rc){s.push(o),n=o.stageTimeSeconds;continue}i(),s=[o],n=o.stageTimeSeconds}return s.length>0&&i(),r}function X(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Nc(e){return`/jersey/Jer_${e}.png`}function da(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${X(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${X(Nc(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function ca(e,t,a){return e==null?`<span class="${a}" title="${X(t)}">${X(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${X(t)}">${X(t)}</button>`}function Lc(e){return e.toFixed(1).replace(".",",")}function Oa(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Dc(e){return`${e??0} Pkt.`}function Ac(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function _c(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function _i(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Bc(e){if(e==null||e<=0)return _i(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function mt(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function $a(e){return`${e.toFixed(1).replace(".",",")} km`}function pn(e){return`${e.toFixed(1).replace(".",",")}%`}function xa(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function gn(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function Gc(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function Hc(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function zc(e,t,a){return Array.from({length:t},(r,s)=>e.slice(s*a,(s+1)*a))}function Kc(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const r=zc(e,4,5),s=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${r.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=Hc(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${da(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${ca(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${X(i.roleLabel)}">${X(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?s.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${X(Oa(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${Lc(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function ia(e,t){const a=e.riders.find(r=>r.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function nr(e,t){const a=e.riders.find(n=>n.id===t),r=(a==null?void 0:a.activeTeamId)??null,s=r!=null?e.teams.find(n=>n.id===r)??null:null;return{teamId:r,teamName:(s==null?void 0:s.name)??null}}function Wc(e,t,a,r={}){const s=(t??[]).slice(0,r.limit??8);return s.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${s.map(n=>{var m;const i=n.riderId??0,o=nr(e,i),d=ia(e,i),l=((m=r.distanceGapsByRiderId)==null?void 0:m.get(i))??null,p=[r.distanceGapClassName??"",_c(l)].filter(u=>u.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${da(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${ca(n.riderId,d,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${r.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${p}">${X(Ac(l))}</span>`:""}
      </article>`}).join("")}</div>`}function Ta(e,t,a,r,s,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${X(e)}</h4>
      ${Wc(a,r,s,n)}
    </section>`}function Et(e,t,a,r,s=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${r}" ${s?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${r}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${X(e)}</span>
      </summary>
      ${t}
    </details>`}function Va(e,t,a,r){const s=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var d;const i=s.get(n.id)??null,o=((d=a.get(n.id))==null?void 0:d[r])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||ia(e,n.riderId).localeCompare(ia(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function fn(e){const t=jc(e)?e.stagePoints:0;return`${X(Dc("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${X(t)}</span></span>`:""}`}function jc(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function hn(e,t){if(t==null)return new Map;const a=e.riders.find(r=>r.riderId===t)??null;return a?new Map(e.riders.map(r=>[r.riderId,a.distanceCoveredMeters-r.distanceCoveredMeters])):new Map}function Oc(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function La(e,t){var r;const a=(r=e.race.category)==null?void 0:r.bonusSystem;return!a||t==null||t==="Sprint"?[]:mt(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function Qr(e){var r;const t=(r=e.race.category)==null?void 0:r.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return mt(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return mt(a?t.pointsMountainStage:t.pointsSprintFinish)}function Bi(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:mt((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function Vc(e,t,a){let r=null;for(const s of e.stageSummary.segments){const n=Math.max(t,s.start_km),i=Math.min(a,s.end_km),o=Math.max(0,i-n);if(o<=0)continue;const d={lengthKm:o,gradient:s.gradient_percent};(r==null||d.gradient>r.gradient||d.gradient===r.gradient&&d.lengthKm>r.lengthKm)&&(r=d)}return r}function $r(e,t,a,r=null){return e.entries.filter(s=>r==null||r.has(s.riderId)).map((s,n)=>({riderId:s.riderId,rank:s.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:s.crossingTimeSeconds,gapSeconds:s.gapSeconds})).filter(s=>s.points>0)}function es(e){const t=new Map;for(const a of e)for(const r of a.entries){const s=t.get(r.riderId)??{points:0,mountain:0};r.pointsKind==="mountain"?s.mountain+=r.points:s.points+=r.points,t.set(r.riderId,s)}return t}function Uc(e){return qe(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function Ua(e,t){const a=Ai(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?Ec(a):null}function ir(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=Ua(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const r=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(r)||r<=0)return kr(a,e.stage.profile).map(n=>n.rider);const s=Fc(e.stage.profile,a.map(n=>n.stageTimeSeconds));return s==null?kr(a,e.stage.profile).map(n=>n.rider):kr(a.filter(n=>n.stageTimeSeconds<=s),e.stage.profile).map(n=>n.rider)}function Yc(e,t){const a=Qr(e);return a.length===0?[]:ir(e,t).map((r,s)=>({riderId:r.riderId,rank:s+1,points:a[s]??0,pointsKind:"points",crossingTimeSeconds:Ua(e,r),gapSeconds:null})).filter(r=>r.points>0)}function Zc(e,t){const a=ir(e,t).slice(0,20),r=a[0]!=null?Ua(e,a[0])??0:0;return a.map((s,n)=>{const i=Ua(e,s)??0;return{riderId:s.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-r),photoFinishScore:s.photoFinishScore}})}function Jc(e,t){var a;return((a=ir(e,t)[0])==null?void 0:a.riderId)??null}function ts(e,t,a){var M,T;const r=qe(e.stageSummary),s=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(ir(e,a).map($=>$.riderId)):null,i=r.filter(({marker:$})=>$.type==="climb_start"),o=r.filter(({marker:$})=>ft($)).sort(($,C)=>$.kmMark-C.kmMark).map(($,C)=>{var re,q;const R=[...i].reverse().find(ee=>ee.kmMark<=$.kmMark)??null,L=Oc(e,$.kmMark),P=(R==null?void 0:R.kmMark)??(L==null?void 0:L.start_km)??$.kmMark,D=(R==null?void 0:R.elevation)??(L==null?void 0:L.start_elevation)??$.elevation,_=Math.max(0,$.kmMark-P),H=_>0?($.elevation-D)/(_*1e3)*100:(L==null?void 0:L.gradient_percent)??0,K=Vc(e,P,$.kmMark),w=t.find(ee=>ee.markerKey===$.key)??null,A=La(e,(w==null?void 0:w.markerCategory)??$.marker.cat??null),Y=w?$r(w,A,"mountain",n):[],W=(w==null?void 0:w.markerCategory)??$.marker.cat??null;return{key:$.key,title:`${C+1}. Bergwertung`,label:$.label,categoryLabel:W?`Kat. ${W}`:null,categoryClassName:gn(W),kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:_,averageGradient:H,steepestSegmentLengthKm:(K==null?void 0:K.lengthKm)??null,steepestSegmentGradient:(K==null?void 0:K.gradient)??null,highlightMeta:$.kmMark>=s,leaderRiderId:((re=Y[0])==null?void 0:re.riderId)??((q=w==null?void 0:w.entries[0])==null?void 0:q.riderId)??null,displayBadges:xa(A,"mountain"),entries:Y,timingEntries:(w==null?void 0:w.entries)??[],accent:"mountain"}}),d=r.filter(({marker:$})=>$.type==="sprint_intermediate").sort(($,C)=>$.kmMark-C.kmMark).map(($,C)=>{var D,_;const R=t.find(H=>H.markerKey===$.key)??null,L=Bi(e),P=R?$r(R,L,"points",n):[];return{key:$.key,title:`${C+1}. Zwischensprint`,label:$.label,categoryLabel:null,categoryClassName:null,kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((D=P[0])==null?void 0:D.riderId)??((_=R==null?void 0:R.entries[0])==null?void 0:_.riderId)??null,displayBadges:xa(L,"points"),entries:P,timingEntries:(R==null?void 0:R.entries)??[],accent:"sprint"}}),l=Uc(e),p=Yc(e,a),m=l?t.find($=>$.markerKey===l.key)??null:null,u=m?$r(m,La(e,m.markerCategory),"mountain",n):[],f=Qr(e),g=m?La(e,m.markerCategory):[],b=e.stage.profile==="ITT"||e.stage.profile==="TTT"?Zc(e,a):(m==null?void 0:m.entries)??[],y=((M=p[0])==null?void 0:M.riderId)??((T=u[0])==null?void 0:T.riderId)??Jc(e,a),v={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:m!=null&&m.markerCategory?`Kat. ${m.markerCategory}`:null,categoryClassName:gn((m==null?void 0:m.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(m!=null&&m.markerCategory),leaderRiderId:y,displayBadges:[...xa(f,"points"),...xa(g,"mountain")],entries:[...p,...u],timingEntries:b,accent:"finish"};return[...[...d,...o].sort(($,C)=>$.kmMark-C.kmMark||$.title.localeCompare(C.title,"de")),v].filter($=>$.entries.length>0||$.timingEntries.length>0||$.accent!=="finish"||l!=null||a.isFinished)}function qc(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),r=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,s=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,r):t.entries.slice(0,r).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return s.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${s.map(n=>{const i=nr(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${da(i.teamId,i.teamName)}
            ${ca(n.riderId,ia(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?X(_i(n.crossingTimeSeconds)):X(Bc(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function bn(e,t){var a;return((a=e==null?void 0:e.find(r=>r.riderId===t))==null?void 0:a.points)??0}function yn(e,t){var a;return((a=e.filter(r=>r.riderId!=null&&t.has(r.riderId)).sort((r,s)=>r.rank-s.rank||r.riderId-s.riderId)[0])==null?void 0:a.riderId)??null}function wa(e,t,a){if(!(!t||e.some(r=>r.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function Xc(e,t,a,r,s){const n=new Set(e.riderIds),i=new Map(t.riders.map(f=>[f.riderId,f])),d=e.riderIds.map(f=>i.get(f)??null).filter(f=>f!=null).sort((f,g)=>{var b,y;return(((b=a.get(f.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)-(((y=a.get(g.riderId))==null?void 0:y.rank)??Number.MAX_SAFE_INTEGER)||f.riderName.localeCompare(g.riderName,"de")||f.riderId-g.riderId}).slice(0,25),l=i.get(yn(r,n)??-1)??null,p=i.get(yn(s,n)??-1)??null,m=l!=null&&!d.some(f=>f.riderId===l.riderId),u=p!=null&&!d.some(f=>f.riderId===p.riderId);return d.length>=25&&m&&u&&l.riderId!==p.riderId?(wa(d,l,23),wa(d,p,24),d):(wa(d,l,24),wa(d,p,24),d)}function Qc(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function eu(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function vn(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function tu(e,t){const a=t.riders.filter(s=>e.riderIds.includes(s.riderId)).reduce((s,n)=>Math.max(s,n.distanceCoveredMeters),0),r=Math.max(0,t.leaderDistanceMeters-a);return r>0?`-${Math.round(r)} m`:"—"}function au(e,t,a,r,s,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=wl(a,r),d=a.find(u=>u.label===o)??a[0],l=new Map(e.gcStandings.map(u=>[u.riderId,u])),p=es(i),m=Xc(d,t,l,s,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${X(d.label)} <span class="race-sim-group-count">(${d.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${X(vn(d.previousGapMeters,"-"))}</span>
        <span>Leader ${X(tu(d,t))}</span>
        <span>Hinten ${X(vn(d.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${m.map((u,f)=>{const g=l.get(u.riderId)??null,b=nr(e,u.riderId),y=p.get(u.riderId)??{points:0,mountain:0},v=bn(s,u.riderId),x=bn(n,u.riderId),M=Qc(u.riderId,e.classificationLeaders),T=M.length>0?M.map($=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[$]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${eu(M)}" title="${X(T)}">${f+1}.</strong>
              ${da(b.teamId,b.teamName)}
              <span class="race-sim-classification-main">
                ${ca(u.riderId,u.riderName,`race-sim-group-rider-name${u.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${g?g.rank:"—"} · ${X(g?Oa(g.gapSeconds):"—")} · ${X(u.gapToLeaderMeters>0?`+${Math.round(u.gapToLeaderMeters)} m`:"—")}</strong>
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
    </section>`}function ru(e,t,a,r){const s=ts(t,a.markerClassifications,a),n=es(s),i=Va(t,t.pointsStandings,n,"points"),o=Va(t,t.mountainStandings,n,"mountain"),d=Xr(qr(a.clusters));e.innerHTML=au(t,a,d,r,i,o,s)}function su(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function nu(e){const t=qe(e.stageSummary),a=Bi(e)[0]??0,r=Qr(e)[0]??0,s=t.filter(({marker:n})=>ft(n)).reduce((n,{marker:i})=>n+(La(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+r,mountain:s}}function Sn(e){const t=nu(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function iu(e){const t=Gc(e),a=[`<span class="race-sim-stage-points-meta-pill">${X($a(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${X(`${$a(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${X(`Länge ${$a(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${X(`Ø ${pn(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${X(`Steilstes ${$a(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${X(pn(e.steepestSegmentGradient))}</span>`:""].filter(r=>r.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${X(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${X(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${X(e.label)}">${X(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((r,s)=>`${s>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${r}`).join("")}
    </span>`}function ou(e,t,a,r=null){const s=r??ts(e,t,a);return s.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${Sn(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${Sn(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${s.map(n=>{const i=n.leaderRiderId!=null?nr(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?ia(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${iu(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${su(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${da(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?ca(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${X(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${qc(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function lu(e,t,a,r,s,n=new Set){var f,g;const i=ts(a,r,s),o=es(i),d=Va(a,a.pointsStandings,o,"points"),l=Va(a,a.mountainStandings,o,"mountain"),p=hn(s,((f=a.gcStandings[0])==null?void 0:f.riderId)??null),m=hn(s,((g=a.youthStandings[0])==null?void 0:g.riderId)??null),u=b=>!n.has(b);e.innerHTML=`
    ${Et("Stage Favorites",Kc(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",u("favorites"))}
    <section class="race-sim-classifications-section">
      ${Et("GC",Ta("GC","gc",a,a.gcStandings,b=>X(`GC ${b.rank} · ${Oa(b.gapSeconds)}`),{limit:20,distanceGapsByRiderId:p}),"race-sim-overview-classification race-sim-overview-gc","gc",u("gc"))}
      ${Et("Punktewertung",Ta("Punktewertung","points",a,d,fn),"race-sim-overview-classification race-sim-overview-points","points",u("points"))}
      ${Et("Bergwertung",Ta("Bergwertung","mountain",a,l,fn),"race-sim-overview-classification race-sim-overview-mountain","mountain",u("mountain"))}
      ${Et("Nachwuchsfahrerwertung",Ta("Nachwuchsfahrerwertung","youth",a,a.youthStandings,b=>X(`${b.rank}. · ${Oa(b.gapSeconds)}`),{distanceGapsByRiderId:m,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",u("youth"))}
    </section>
    ${Et("Etappenwertungen",ou(a,r,s,i),"race-sim-overview-stage-scoring","stageScoring",u("stageScoring"))}
  `}const kn=new WeakMap,Ze=new WeakMap,$n=new WeakMap,Gi=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function J(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Hi(e){return e<=0?"—":`+${Math.round(e)} m`}function aa(e){const t=Gi.format(e);return e>0?`+${t}`:t}function xr(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function oe(e){return Gi.format(e)}function Mt(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),r=Math.floor(t%3600/60),s=t%60;return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function zi(e){return`+${Mt(e)}`}function Ki(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function as(e){return`${(e*3.6).toFixed(1)} km/h`}function du(e){return`${aa(e)}%`}function _r(e){return`${e.toFixed(1).replace(".",",")} km`}function Wi(e){return`${_r(e.segmentStartKm)} - ${_r(e.segmentEndKm)}`}function cu(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function ji(e){return e.replace(/_/g," ")}function Oi(e){return ji(e)}function uu(e){return ji(e)}function Vi(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function mu(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function pu(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Ui(e){return qe(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||ft(t)).map(({key:t,label:a})=>({key:t,label:a}))}function gu(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function fu(e,t,a,r){var s;return a!=="ITT"&&a!=="TTT"?((s=r.get(t))==null?void 0:s.get(e.riderId))??null:e.splitTimes[t]??null}function Yi(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(s=>({label:s.key,displayLabel:s.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${s.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function hu(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function bu(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function Zi(e){const t=kn.get(e);if(t)return t;const a=Ui(e),r={splitMarkers:a,columns:Yi(e,a,!1),riderById:new Map(e.riders.map(s=>[s.id,s])),teamById:new Map((e.teams??[]).map(s=>[s.id,s])),teamAbbreviationById:new Map((e.teams??[]).map(s=>[s.id,s.abbreviation])),teamNameById:new Map((e.teams??[]).map(s=>[s.id,s.name])),gcByRiderId:new Map((e.gcStandings??[]).map(s=>[s.riderId,s]))};return kn.set(e,r),r}function Ji(e,t){const a=e.parentElement,r=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!r)return"";const s=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",r.insertAdjacentElement("beforebegin",l),l})(),n=rs(e),i=hu(t),o=bu(i,n),d=Ze.get(e);return(d==null?void 0:d.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),s.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,r.innerHTML=t.map(l=>yu(l,n)).join(""),Ze.set(e,{layoutKey:o,orderedRiderIds:(d==null?void 0:d.orderedRiderIds)??[],rowsByRiderId:(d==null?void 0:d.rowsByRiderId)??new Map,openDetailRiderId:(d==null?void 0:d.openDetailRiderId)??null,openTeamId:(d==null?void 0:d.openTeamId)??null})),o}function Qe(e,t){e.textContent!==t&&(e.textContent=t)}function Ma(e,t){e.title!==t&&(e.title=t)}function Ra(e,t){e.className!==t&&(e.className=t)}function Ia(e,t,a){return e.lastValues[t]!==a}function Ea(e,t,a){e.lastValues[t]=a}function rs(e){const t=$n.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return $n.set(e,a),a}function yu(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${J(e.label)}">${J(a)}</span>`;const r=!t.autoSort&&t.manualSortKey===e.sortKey,s=r?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${r?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${J(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${J(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${J(a)}<span class="race-sim-leaderboard-sort-indicator">${J(s)}</span></button>`}function vu(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function Su(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function xn(e,t,a,r,s,n,i){if(r.autoSort)return(d,l)=>e.stage.profile==="ITT"?qi(d,l,t):Tu(d,l);if(!r.manualSortKey)return null;const o=r.manualSortDirection==="asc"?1:-1;return(d,l)=>{if(Me(d)!==Me(l))return Me(d)?1:-1;const p=s.get(d.riderId)??null,m=s.get(l.riderId)??null,u=Tn(d,p,r.manualSortKey??"",e,a,n,i),f=Tn(l,m,r.manualSortKey??"",e,a,n,i);return Su(u,f)*o||d.riderId-l.riderId}}function ku(e,t,a){if(e.length!==t.size)return!1;let r=null;for(const s of e){const n=t.get(s);if(!n||r&&a(r,n)>0)return!1;r=n}return!0}function Tn(e,t,a,r,s,n,i){const o=r.race.isStageRace&&r.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return r.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?fu(e,a.slice(6),r.stage.profile,s):null}}function $u(e,t,a,r,s,n,i,o,d){if(!s.manualSortKey){if(s.autoSort){const u=xn(t,a,r,s,n,i,o);return u?[...e].sort(u):[...e]}const m=new Map(s.frozenOrder.map((u,f)=>[u,f]));return[...e].sort((u,f)=>(Me(u)===Me(f)?0:Me(u)?1:-1)||(m.get(u.riderId)??Number.MAX_SAFE_INTEGER)-(m.get(f.riderId)??Number.MAX_SAFE_INTEGER)||u.riderId-f.riderId)}const l=xn(t,a,r,s,n,i,o);if(!l)return[...e];const p=new Map(e.map(m=>[m.riderId,m]));return ku(d,p,l)?d.map(m=>p.get(m)).filter(m=>m!=null):[...e].sort(l)}function xu(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const p=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(p))return!1;const m=Ze.get(e);return m?(m.openTeamId=m.openTeamId===p?null:p,m.openTeamId==null&&(m.openDetailRiderId=null),!0):!1}const r=t.closest("button[data-race-sim-rider-toggle]");if(r){const p=Number(r.dataset.raceSimRiderToggle);if(!Number.isFinite(p))return!1;const m=Ze.get(e);return m?(m.openDetailRiderId=m.openDetailRiderId===p?null:p,!0):!1}const s=rs(e);if(t.closest("button[data-race-sim-splits-toggle]"))return s.showSplitColumns=!s.showSplitColumns,!s.showSplitColumns&&((l=s.manualSortKey)!=null&&l.startsWith("split:"))&&(s.manualSortKey=null,s.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return s.autoSort=!s.autoSort,s.autoSort?(s.manualSortKey=null,s.frozenOrder=[]):(s.manualSortKey=null,s.manualSortDirection="asc",s.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(p=>Number(p.dataset.raceSimRiderRow)).filter(p=>Number.isFinite(p))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||s.autoSort)return!1;const d=o.dataset.raceSimSortKey;return d?(s.manualSortKey===d?s.manualSortDirection=s.manualSortDirection==="asc"?"desc":"asc":(s.manualSortKey=d,s.manualSortDirection=vu(d)),s.frozenOrder=[],!0):!1}function wn(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function Me(e){return e.finishStatus==="dnf"}function qi(e,t,a){if(Me(e)!==Me(t))return Me(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const d=a[o];if(!d)continue;const l=e.splitTimes[d.key],p=t.splitTimes[d.key];if(l!=null&&p!=null&&l!==p)return l-p;if(l!=null&&p==null)return-1;if(l==null&&p!=null)return 1}const r=wn(e,a),s=wn(t,a);if(r!==s)return r?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function Tu(e,t){return Me(e)!==Me(t)?Me(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function Xi(e,t){const a=(t==null?void 0:t.formBonus)??0,r=(t==null?void 0:t.raceFormBonus)??0,s=((t==null?void 0:t.fatigueMalus)??0)*.5,n=((t==null?void 0:t.longTermFatigueMalus)??0)*.5,i=((t==null?void 0:t.shortTermFatigueMalus)??0)*.5,o=e.teamGroupBonus,d=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,p=e.baseSkill+l+a+r+e.dailyForm+e.microForm+o-s-n-i,m=Math.max(0,p-e.staminaPenalty),u=p-m,f=m-e.effectiveSkill;return[`Basis ${oe(e.baseSkill)}`,e.isAttacking?`+ Attacke ${oe(l)}`:null,`+ S-Form ${oe(a)}`,`+ R-Form ${oe(r)}`,`+ T-Form ${oe(e.dailyForm)}`,`+ Zufällige Form ${oe(d)} (skaliert)`,`+ Teambonus ${oe(o)}`,`- Fatigue ${oe(s)}`,`- Langzeit ${oe(n)}`,`- Akut ${oe(i)}`,`- Stamina ${oe(u)}`,`- HM ${oe(f)}`,`= Effektiv ${oe(e.effectiveSkill)}`].filter(g=>g!=null)}function wu(e,t){return Xi(e,t).join(`
`)}function Mu(e){return aa(Math.max(-2.5,Math.min(2.5,e*2.5)))}function Ru(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function Qi(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${J(e.riderName)}">${J(e.riderName)}</button>`}function Iu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId)??"—",s=a.get(e.activeTeamId)??r;return`<span class="race-sim-team-code" title="${J(s)}">${J(r)}</span>`}function eo(e){return`/jersey/Jer_${e}.png`}function Eu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const r=t.get(e.activeTeamId);if(!r)return"—";const s=a.get(e.activeTeamId)??r.name,n=eo(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${J(s)}">
      <img
        class="race-sim-team-jersey-img"
        src="${J(n)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Cu(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function Fu(e,t,a,r){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=r.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const s=e.splitTimes[t];return s!=null?Mt(s):"—"}function to(e,t,a){const r=Xi(e,t),s=[{label:"Terrain / Skill",value:`${Oi(e.activeTerrain)} / ${uu(e.skillName)}`},{label:"Aktiver Abschnitt",value:Wi(e)},{label:"Segmenthöhe",value:cu(e)},{label:"Basis",value:oe(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${oe(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:aa((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:aa((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:xr((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:xr((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:xr((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:oe(e.staminaPenalty)},{label:"HM",value:oe(e.elevationPenalty)},{label:"T-Form",value:aa(e.dailyForm)},{label:"Zufall",value:Mu(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:Ru(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?Ki(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${J(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${J(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${s.map(n=>`<div class="race-sim-rider-detail-item"><span>${J(n.label)}</span><strong>${J(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${r.map(n=>J(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${J(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function Pu(e,t,a,r,s,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const d=document.createElement("div");d.className="race-sim-row-grid",o.appendChild(d);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",d.appendChild(l);const p=document.createElement("span");p.className="race-sim-row-flag",p.innerHTML=t?xl(pu(t)):"—",d.appendChild(p);const m=document.createElement("span");m.className="race-sim-row-name",m.innerHTML=Qi(e,a),d.appendChild(m);const u=m.querySelector(".race-sim-row-name-btn");if(!u)throw new Error("race-sim-row-name-btn not found");const f=document.createElement("span");f.className="race-sim-row-team-visual",f.innerHTML=Eu(t,s,i),d.appendChild(f);const g=document.createElement("strong");g.className="race-sim-row-team",g.innerHTML=Iu(t,n,i),d.appendChild(g);const b=(D="")=>{const _=document.createElement("strong");return D&&(_.className=D),d.appendChild(_),_},y=b("race-sim-gap"),v=b("race-sim-cell-effective-skill"),x=b(),M=b(),T=b(),$=r.map(()=>b()),C=b(),R=b(),L=b("race-sim-form-state-cell"),P=document.createElement("div");return P.className="race-sim-row-detail-popover hidden",o.appendChild(P),{row:o,rankField:l,nameButton:u,gapField:y,clockField:T,splitFields:$,effectiveSkillField:v,gcRankField:x,gcGapField:M,gradientPercentField:C,speedField:R,formStateField:L,detailPanel:P,initialized:!1,lastValues:{}}}function Nu(e,t,a,r,s,n,i,o,d,l,p){const m=(r==null?void 0:r.formBonus)??0,u=(r==null?void 0:r.raceFormBonus)??0,f=d&&l>1?p.get(a.riderId)??null:null,g=Me(a),b=i!=="ITT"&&i!=="TTT"?g?"DNF":"—":a.hasStarted?g?"DNF":a.riderClockSeconds!=null?Mt(a.riderClockSeconds):"—":zi(a.startOffsetSeconds);Ra(e.row,`race-sim-row${t===1&&!g?" race-sim-row-leader":""}${s?" race-sim-row-detail-open":""}${g?" race-sim-row-dnf":""}`),Qe(e.rankField,`${t}.`),Qe(e.gapField,g?"DNF":Hi(a.gapToLeaderMeters)),Qe(e.clockField,b),e.nameButton.setAttribute("aria-expanded",s?"true":"false"),Ra(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),Ma(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((M,T)=>{const $=e.splitFields[T];if(!$)return;const C=Fu(a,M.key,i,o);Qe($,C),Ma($,M.label)}),Ia(e,"effectiveSkillValue",a.effectiveSkill)&&(Qe(e.effectiveSkillField,oe(a.effectiveSkill)),Ea(e,"effectiveSkillValue",a.effectiveSkill));const y=`race-sim-cell-effective-skill ${Vi(a)}`;Ia(e,"effectiveSkillClass",y)&&(Ra(e.effectiveSkillField,y),Ea(e,"effectiveSkillClass",y));const v=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,m,u,a.dailyForm,a.microForm,(r==null?void 0:r.fatigueMalus)??0,(r==null?void 0:r.longTermFatigueMalus)??0,(r==null?void 0:r.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");Ia(e,"effectiveSkillTitleKey",v)&&(Ma(e.effectiveSkillField,wu(a,r)),Ea(e,"effectiveSkillTitleKey",v)),Qe(e.gcRankField,f?String(f.rank):"—"),Qe(e.gcGapField,f?Ki(f.gapSeconds):"—"),Qe(e.gradientPercentField,du(a.gradientPercent)),Ra(e.gradientPercentField,mu(a.gradientPercent)),Ma(e.gradientPercentField,`${Oi(a.activeTerrain)} · ${Wi(a)}`),Qe(e.speedField,as(a.currentSpeedMps)),e.formStateField.innerHTML=Cu(a);const x=[s?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,m,u,(r==null?void 0:r.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(f==null?void 0:f.rank)??"—",(f==null?void 0:f.gapSeconds)??"—",a.skillBreakdown].join("|");Ia(e,"detailKey",x)&&(e.detailPanel.innerHTML=s?to(a,r,f):"",e.detailPanel.classList.toggle("hidden",!s),Ea(e,"detailKey",x)),e.detailPanel.classList.toggle("hidden",!s),e.initialized=!0}function Lu(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${J(e.name)}">${J(e.name)}</button>`}function Du(e){const t=eo(e.id);return`
    <span class="race-sim-team-visual" title="${J(e.name)}">
      <img
        class="race-sim-team-jersey-img"
        src="${J(t)}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function Au(e,t,a){const r=new Map;for(const s of e.riders){const n=a.get(s.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=r.get(i)??[];o.push(s),r.set(i,o)}return t.teams.filter(s=>r.has(s.id)).map(s=>{const n=(r.get(s.id)??[]).slice().sort((p,m)=>m.effectiveSkill-p.effectiveSkill||p.riderId-m.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),d=n.slice(0,o).reduce((p,m)=>p+m.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:s,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,d-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(p=>p.isFinished).length}}).sort((s,n)=>qi(s.representative,n.representative,Ui(t))||s.team.id-n.team.id)}function _u(e,t,a,r,s){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${J(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${J(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${J(oe(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${J(as(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${J(e.teamClockSeconds!=null?Mt(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${J(_r(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&r>1?t.gcByRiderId.get(n.riderId)??null:null,d=s===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${Qi(n,d)}
                <strong>${J(oe(n.effectiveSkill))}</strong>
                <span>${J(n.riderClockSeconds!=null?Mt(n.riderClockSeconds):"—")}</span>
              </div>
              ${d?to(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function Bu(e,t,a){var f,g;const r=performance.now(),s=Zi(a),n=s.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(b=>({label:b.key,displayLabel:b.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(f=Ze.get(e))==null?void 0:f.layoutKey,d=Ji(e,i),l=Ze.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==d&&(e.innerHTML="");const p=Au(t,a,s.riderById),m=((g=p[0])==null?void 0:g.teamDistanceMeters)??0;return e.innerHTML=p.map((b,y)=>{const v=l.openTeamId===b.team.id;return`
      <article class="race-sim-row${y===0?" race-sim-row-leader":""}${v?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${y+1}.</strong>
          <span class="race-sim-row-name">${Lu(b.team,v)}</span>
          <span class="race-sim-row-team-visual">${Du(b.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${J(b.team.name)}">${J(b.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${J(Hi(Math.max(0,m-b.teamDistanceMeters)))}</strong>
          <strong>${J(b.teamClockSeconds!=null?Mt(b.teamClockSeconds):zi(b.representative.startOffsetSeconds))}</strong>
          ${n.map(x=>`<strong>${J(b.splitTimes[x.key]!=null?Mt(b.splitTimes[x.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${Vi(b.representative)}">${J(oe(b.teamEffectiveSkill))}</strong>
          <strong>${J(as(b.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${v?"":" hidden"}">${v?_u(b,s,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),Ze.set(e,{layoutKey:d,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-r,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:p.length,rowsCreated:p.length,rowsRemoved:0,rowsUpdated:p.length,rowsSkippedInvisible:0,orderChanged:1}}function Mn(e,t,a){if(a.stage.profile==="TTT")return Bu(e,t,a);const r=performance.now(),s={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=Zi(a),{splitMarkers:o}=i,d=gu(t),l=rs(e),p=l.showSplitColumns?o:[],m=Ze.get(e);s.prepMs=performance.now()-n;const u=performance.now(),f=$u(t.riders,a,o,d,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(m==null?void 0:m.orderedRiderIds)??[]);s.sortMs=performance.now()-u;const g=m==null?void 0:m.layoutKey,b=performance.now(),y=Ji(e,Yi(a,p,l.showSplitColumns));s.layoutMs=performance.now()-b;const v=Ze.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};g!=null&&g!==y&&(e.innerHTML="",v.rowsByRiderId.clear(),v.orderedRiderIds=[]);const x=f.map(P=>P.riderId),M=new Set(x),T=performance.now();for(const[P,D]of v.rowsByRiderId)M.has(P)||(D.row.remove(),v.rowsByRiderId.delete(P),s.rowsRemoved+=1);s.removeRowsMs=performance.now()-T;const $=performance.now();for(let P=0;P<f.length;P+=1){const D=f[P],_=i.riderById.get(D.riderId)??null;let H=v.rowsByRiderId.get(D.riderId);H||(H=Pu(D,_,v.openDetailRiderId===D.riderId,p,i.teamById,i.teamAbbreviationById,i.teamNameById),v.rowsByRiderId.set(D.riderId,H),s.rowsCreated+=1)}s.createRowsMs=performance.now()-$;const C=performance.now(),R=v.orderedRiderIds.length===x.length&&v.orderedRiderIds.every((P,D)=>P===x[D]);s.orderCheckMs=performance.now()-C;const L=performance.now();if(!R){const P=document.createDocumentFragment();for(const D of x){const _=v.rowsByRiderId.get(D);_&&P.appendChild(_.row)}e.replaceChildren(P),s.orderChanged=1}s.reorderMs=performance.now()-L;for(let P=0;P<f.length;P+=1){const D=f[P],_=v.rowsByRiderId.get(D.riderId),H=i.riderById.get(D.riderId)??null;if(!_)continue;const K=performance.now();Nu(_,P+1,D,H,v.openDetailRiderId===D.riderId,p,a.stage.profile,d,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),s.updateRowsMs+=performance.now()-K,s.rowsUpdated+=1}return Ze.set(e,{layoutKey:y,orderedRiderIds:x,rowsByRiderId:v.rowsByRiderId,openDetailRiderId:v.openDetailRiderId,openTeamId:v.openTeamId}),s.finalizeMs=performance.now()-(r+s.prepMs+s.sortMs+s.layoutMs+s.removeRowsMs+s.createRowsMs+s.orderCheckMs+s.reorderMs+s.visibilityMs+s.updateRowsMs),s.totalMs=performance.now()-r,s.finalizeMs=Math.max(0,s.totalMs-s.prepMs-s.sortMs-s.layoutMs-s.removeRowsMs-s.createRowsMs-s.orderCheckMs-s.reorderMs-s.visibilityMs-s.updateRowsMs),s}const Gu=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],Hu=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],ao=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],ro=["Sprint","4","3","2","1","HC"],Ya=.2,zu=7,Ku=100,Wu=3,ju=50,Ou=-2,Vu=1,Uu=2.5,Yu=-3,Zu=15,Ju=200,qu=600,Xu=850;function Pe(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function Za(e){return e==="finish_hill"||e==="finish_mountain"}function Ja(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function ss(e,t){return e==="climb_top"||Za(e)&&Ja(t)}function ua(e){return Math.round(e*10)/10}function Be(e){return Number(e.toFixed(2))}function St(e){return`${e.toFixed(2).replace(".",",")} km`}function so(e){return`${Math.round(e)} hm`}function Qu(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function ns(e){return Gu.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function em(e){return Hu.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function tm(e,t="start",a=0,r=1){const s=ao.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:Pe(i)?a===r-1:i==="climb_top"||i==="sprint_intermediate");return(s.includes(e)?s:[e,...s.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${S(i)}</option>`).join("")}function am(e){return['<option value="">–</option>',...ro.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`)].join("")}function Rn(e){return ao.indexOf(e)}function Ge(e){return[...e].sort((t,a)=>Rn(t.type)-Rn(a.type))}function oa(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:Ge(e[0].markers)}];let a=0;return e.forEach(r=>{a=Be(a+r.lengthKm);const s=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),n=t[t.length-1];n.terrain=r.terrain,n.techLevel=r.techLevel,n.windExp=r.windExp,n.markers=Ge([...n.markers,...r.markers]),t.push({kmMark:a,elevation:s,terrain:r.terrain,techLevel:r.techLevel,windExp:r.windExp,markers:Ge(r.endMarkers)})}),t}function rm(e){return e?" stage-editor-input-invalid":""}function is(e,t){const a=e.segments[t];if(!a)return[];const r=[],s=sm(e).get(t)??[];return a.lengthKm<Ya&&r.push(`Laenge unter ${Ya.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&r.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&r.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&r.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>Pe(n.type))&&r.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&r.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>Pe(n.type))&&r.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{Pe(n.type)&&r.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&r.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&r.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&r.push(`${n.type} gehoert in den Startmarker-Slot.`),ss(n.type,n.cat)&&!Ja(n.cat)&&r.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&r.push("Sprintmarker erlaubt nur Kategorie Sprint."),Pe(n.type)&&!Za(n.type)&&n.cat!=null&&r.push("finish_flat und finish_TT duerfen keine Kategorie haben."),Za(n.type)&&n.cat!=null&&!Ja(n.cat)&&r.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),r.push(...s),[...new Set(r)]}function sm(e){const t=new Map,a=[],r=(s,n)=>{const i=t.get(s)??[];i.push(n),t.set(s,i)};return e.segments.forEach((s,n)=>{s.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),s.endMarkers.forEach(i=>{var l;if(!ss(i.type,i.cat))return;if(!i.name){r(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let p=a.length-1;p>=0;p-=1)if(((l=a[p])==null?void 0:l.name)===i.name){o=p;break}const d=o>=0?o:a.length-1;if(d<0){r(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(d,1)})}),a.forEach(s=>{const n=s.name?` "${s.name}"`:"";r(s.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function nm(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:Za(e.type)?{...e,cat:Ja(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function no(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:im(e.waypoints??[])).map(r=>({...r,startElevation:Math.round(r.startElevation),lengthKm:Number.isFinite(r.lengthKm)?Be(r.lengthKm):Ya,gradientPercent:Number.isFinite(r.gradientPercent)?ua(r.gradientPercent):0,techLevel:Number.isFinite(r.techLevel)?r.techLevel:5,windExp:Number.isFinite(r.windExp)?r.windExp:5,markers:In(r.markers),endMarkers:In(r.endMarkers)})),waypoints:[]};return ht(t),t}function im(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const r=e[a],s=e[a+1],n=Be(s.kmMark-r.kmMark),i=s.elevation-r.elevation,o=ua(n>0?i/(n*10):0);t.push({startElevation:r.elevation,lengthKm:n,gradientPercent:o,techLevel:r.techLevel??5,windExp:r.windExp??5,terrain:r.terrain??"Flat",markers:r.markers??[],endMarkers:s.markers??[]})}return t}function In(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function om(e,t,a){const r=e*a*8+t/12;return r>=95?"HC":r>=68?"1":r>=46?"2":r>=28?"3":"4"}function En(e){const t=[];let a=null,r=null,s=0;const n=i=>{if(a==null||i==null||i<=a){a=null,r=null,s=0;return}const o=e[a],d=e[i],l=d.kmMark-o.kmMark,p=Math.max(0,d.elevation-o.elevation),m=l>0?p/(l*10):0;p>=Ku&&m>=Wu&&t.push({startKm:Be(o.kmMark),endKm:Be(d.kmMark),distanceKm:Be(l),gainMeters:Math.round(p),avgGradient:ua(m),category:om(l,p,m),startIndex:a,topIndex:i,topElevation:Math.round(d.elevation)}),a=null,r=null,s=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],d=e[i],l=d.elevation-o.elevation;if(a==null&&l>0){a=i-1,r=i,s=0;continue}if(a!=null){if(l>=0){(r==null||d.elevation>=e[r].elevation)&&(r=i),s=0;continue}s+=Math.abs(l),s>=ju&&n(r)}}return n(r),t}function lm(e){const t=e.segments.some(s=>s.terrain==="Cobble_Hill"),a=e.segments.some(s=>s.terrain==="Cobble"),r=e.climbs.some(s=>s.category==="HC"||s.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":r&&e.elevationGainMeters>=2800?"High_Mountain":r||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function Ca(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function dm(e){return e.gainMeters>=qu&&e.topElevation>=Xu?"Mountain":e.gainMeters>Ju?"Medium_Mountain":"Hill"}function cm(e){return e.gradientPercent<Yu?"Abfahrt":e.gradientPercent<Uu||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<Zu?"Flat":"Hill"}function um(e){if(e.segments.length===0)return;if(e.waypoints=oa(e.segments),e.sourceFormat==="csv"){const i=En(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:d,topElevation:l,...p})=>p);return}const t=e.segments.map(i=>i.manualTerrain||Ca(i.terrain)?i.terrain:cm(i)),a=En(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:d,...l})=>l),a.forEach(i=>{const o=dm(i);if(o)for(let d=i.startIndex;d<i.topIndex;d+=1)e.segments[d].manualTerrain||Ca(t[d])||(t[d]=o)});let r=null,s=0;const n=i=>{if(r==null||s<=Vu){r=null,s=0;return}for(let o=r;o<i;o+=1)!(e.segments[o].manualTerrain||Ca(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");r=null,s=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<Ou){r==null&&(r=i),s+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{Ca(i.terrain)||(i.terrain=t[o])}),e.waypoints=oa(e.segments),e.suggestedProfile=lm(e)}function ht(e){mm(e),Cn(e),um(e),e.waypoints=oa(e.segments),Cn(e)}function mm(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,r)=>{const s={...a,startElevation:Math.round(r===0?a.startElevation:t),lengthKm:Be(a.lengthKm),gradientPercent:ua(a.gradientPercent),markers:Ge(a.markers),endMarkers:Ge(a.endMarkers)};return t=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),s}),e.waypoints=oa(e.segments)}function Cn(e){e.totalDistanceKm=Be(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,r)=>{if(r===0)return 0;const s=a.elevation-e.waypoints[r-1].elevation;return t+Math.max(0,s)},0)}function ot(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(r=>r.type==="start")||(t.markers=Ge([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(r=>Pe(r.type))||(a.endMarkers=Ge([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=oa(e.segments))}function pm(e,t,a,r){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((s,n)=>{const i=r==="start"&&t===0&&s.type==="start",o=e.filter(p=>Pe(p.type)).length,d=r==="end"&&t===a-1&&Pe(s.type)&&o===1,l=!(i||d);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${r}" data-marker-index="${n}">${tm(s.type,r,t,a)}</select>
        <input type="text" value="${S(s.name??"")}" data-field="markerName" data-marker-scope="${r}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${r}" data-marker-index="${n}">${am(s.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${r}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function Fn(e,t,a,r){const s=r==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${pm(e,t,a,r)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${r}" data-segment-index="${t}">${s}</button>
    </div>`}function gm(e,t,a,r,s){if(!c.stageEditorDraft)return;const n=c.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(r==="markerType"){o.type=s;const d=nm(o);if(o.name=d.name,o.cat=d.cat,Pe(o.type)){const l=i.filter((p,m)=>m===t||!Pe(p.type));a==="start"?n.markers=l:n.endMarkers=l}}else r==="markerName"?o.name=s.trim()||null:r==="markerCat"&&(o.cat=s||null);a==="start"?n.markers=Ge(n.markers):n.endMarkers=Ge(n.endMarkers),ht(c.stageEditorDraft),ot(c.stageEditorDraft),ce()}}function fm(e,t){if(!c.stageEditorDraft)return;const a=c.stageEditorDraft.segments[e];if(!a)return;const r=t==="start"?e===0&&!a.markers.some(s=>s.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===c.stageEditorDraft.segments.length-1&&!a.endMarkers.some(s=>Pe(s.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(r),a.markers=Ge(a.markers)):(a.endMarkers.push(r),a.endMarkers=Ge(a.endMarkers)),ht(c.stageEditorDraft),ot(c.stageEditorDraft),ce()}function hm(e,t,a){if(!c.stageEditorDraft)return;const r=c.stageEditorDraft.segments[e];r&&(a==="start"?r.markers.splice(t,1):r.endMarkers.splice(t,1),ht(c.stageEditorDraft),ot(c.stageEditorDraft),ce())}let At=0,_t=0;async function bm(){h("stage-editor-profile").innerHTML=ns("Flat"),h("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',h("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([V.listStageEditorCountries(),V.listStageEditorRaceCategories(),V.listStageEditorRacePrograms()]);if(e.success&&e.data){const r=h("stage-editor-race-country");r.innerHTML=e.data.map(s=>`<option value="${s.id}">${S(s.name)} (${S(s.code3)})</option>`).join("")}if(t.success&&t.data){const r=h("stage-editor-race-category");r.innerHTML=t.data.map(s=>`<option value="${s.id}">${S(s.name)}</option>`).join("")}a.success&&a.data&&(c.stageEditorPrograms=a.data,ym())}function ym(){const e=h("stage-editor-programs-list");c.stageEditorPrograms&&(e.innerHTML=c.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${S(t.name)}</span>
      </label>
    `).join(""))}function vm(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=h("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(r=>{var n;const s=(n=c.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===r.value);return s?s.name:r.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function os(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function io(){const e=c.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function Sm(){const e=[...c.stageEditorExistingStages.map(t=>t.raceId),...c.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function km(e,t){let a=e;const r=new Set(c.stageEditorExistingStages.map(s=>s.stageId));for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function $m(e,t){let a=e;const r=new Set([...c.stageEditorExistingStages.map(s=>s.raceId),...c.races.map(s=>s.id)]);for(;a>0&&r.has(a);)a+=t;if(a<=0)for(a=1;r.has(a);)a+=1;return a}function xm(e){var o;const t=h("stage-editor-profile");t.innerHTML=ns(e.suggestedProfile),t.value=e.suggestedProfile;const a=io(),r=Sm();h("stage-editor-stage-id").value=String(a),h("stage-editor-race-id").value=String(r),At=a,_t=r;const s=h("stage-editor-details-file");s.value.trim()||(s.value=`${Qu(e.routeName)}.csv`);const n=h("stage-editor-date");!n.value&&((o=c.gameState)!=null&&o.currentDate)&&(n.value=c.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(d=>{d.checked=!0})}function Tm(e){h("stage-editor-stage-id").value=String(e.stageId),h("stage-editor-race-id").value=String(e.raceId),At=e.stageId,_t=e.raceId,h("stage-editor-stage-number").value=String(e.stageNumber),h("stage-editor-date").value=e.date,h("stage-editor-details-file").value=e.detailsCsvFile;const t=h("stage-editor-profile");t.innerHTML=ns(e.profile),t.value=e.profile,h("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),h("stage-editor-final-push-start").value=String(e.finalPushStartPercent),h("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),h("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),h("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(s=>s.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(s=>{s.checked=a.includes(s.value)})}function oo(e){var r;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((r=e.segments[0])!=null&&r.markers.some(s=>s.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(s=>Pe(s.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((s,n)=>{is(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...s.markers??[],...s.endMarkers??[]].forEach(i=>{i.cat!=null&&!ro.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function lo(){const e=[],t=Number(h("stage-editor-stage-id").value),a=Number(h("stage-editor-race-id").value),r=Number(h("stage-editor-stage-number").value),s=h("stage-editor-date").value.trim(),n=h("stage-editor-details-file").value.trim(),i=Number(h("stage-editor-final-spread-start").value),o=Number(h("stage-editor-final-push-start").value),d=Number(h("stage-editor-final-spread-difficulty").value),l=Number(h("stage-editor-crash-multiplier").value),p=Number(h("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(r)||r<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(s)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(d)||d<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(p)||p<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),c.stageEditorExistingStages.map(y=>y.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const f=h("stage-editor-new-race-checkbox").checked,g=[...c.stageEditorExistingStages.map(y=>y.raceId),...c.races.map(y=>y.id)];if(f){g.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const y=h("stage-editor-race-name").value.trim(),v=Number(h("stage-editor-race-country").value),x=Number(h("stage-editor-race-category").value),M=Number(h("stage-editor-race-num-stages").value),T=h("stage-editor-race-start-date").value.trim(),$=h("stage-editor-race-end-date").value.trim(),C=Number(h("stage-editor-race-prestige").value);y||e.push("Rennname fehlt."),(!Number.isInteger(v)||v<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger(x)||x<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(M)||M<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(T)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test($)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(C)||C<1||C>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else g.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return h("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function wm(){var a,r;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(s=>s.value).join("|");return{stageId:Number(h("stage-editor-stage-id").value),raceId:Number(h("stage-editor-race-id").value),stageNumber:Number(h("stage-editor-stage-number").value),date:h("stage-editor-date").value.trim(),profile:h("stage-editor-profile").value,detailsCsvFile:h("stage-editor-details-file").value.trim(),startElevation:((r=(a=c.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:r.startElevation)??0,finalSpreadStartPercent:Number(h("stage-editor-final-spread-start").value),finalPushStartPercent:Number(h("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(h("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(h("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(h("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function Mm(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function Rm(e){return["gainMeters","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function or(e,t,a){const s=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-s*118),i=54,o=.14+s*.12,d=.26+s*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${d};`}">${Math.round(e)}</span>`}function ls(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),r=Math.round(40-t*22),s=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${s};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function Im(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function Em(e,t,a,r){const s=r!=null?` data-stage-profile-open-climb-id="${S(r)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${s}>${e}</button>`}function Cm(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",r=e.profileScore??e.score,s=[...c.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=s.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span class="text-right">${ls(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${or(r,0,100)}
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
    </div>`}function Fm(e){const t=s=>s!=null?`${s.toFixed(1).replace(".",",")} km`:"—",a=s=>s!=null?`${Math.round(s).toLocaleString("de-DE")} m`:"—",r=s=>s!=null?`${s.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${ls(e.climbScore??0)}
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
    </div>`}function co(e,t,a,r,s,n,i,o){const d=o??or(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${Em(d,r,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${s}
      </div>
    </div>`}function le(e,t,a,r,s){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?r==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${s}-sort="${t}">
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function Jt(){const e=h("stage-editor-stages-table"),t=h("stage-editor-stages-empty"),a=h("stage-editor-stages-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=c.stageEditorStagesSort.key,i=c.stageEditorStagesSort.direction;r&&(r.innerHTML=`<tr>
      ${le("ID","stageId",n,i,"stages")}
      ${le("Land","countryCode",n,i,"stages")}
      ${le("Rennen","raceName",n,i,"stages")}
      ${le("Etappe","stageNumber",n,i,"stages")}
      ${le("Score","profileScore",n,i,"stages")}
      ${le("Profil","profile",n,i,"stages")}
      ${le("Distanz","distanceKm",n,i,"stages")}
      ${le("Höhenmeter","elevationGainMeters",n,i,"stages")}
      ${le("Sprints","sprintCount",n,i,"stages")}
      ${le("Climbs","climbCount",n,i,"stages")}
    </tr>`);const o=Nm(c.stageEditorStageRows);s.innerHTML=o.map(d=>`
    <tr>
      <td>${d.stageId}</td>
      <td>${ie(d.countryCode||"")}</td>
      <td><strong>${S(d.raceName)}</strong></td>
      <td><strong>${S(pa({stageNumber:d.stageNumber}))}</strong></td>
      <td>${co(d.profileScore,0,100,d.stageId,Cm(d),ur({name:d.raceName},{stageNumber:d.stageNumber,profile:d.profile}))}</td>
      <td>${ga(d.profile)}</td>
      <td>${St(d.distanceKm)}</td>
      <td>${so(d.elevationGainMeters)}</td>
      <td>${d.sprintCount} Sprints</td>
      <td>${d.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${c.stageEditorStageRows.length} vorhandene Etappen`}function qt(){const e=h("stage-editor-climbs-table"),t=h("stage-editor-climbs-empty"),a=h("stage-editor-climbs-meta"),r=e.querySelector("thead"),s=e.querySelector("tbody");if(!s)return;const n=c.stageEditorClimbsSort.key,i=c.stageEditorClimbsSort.direction;r&&(r.innerHTML=`<tr>
      ${le("km","placementKm",n,i,"climbs")}
      ${le("Name","name",n,i,"climbs")}
      ${le("Kat.","category",n,i,"climbs")}
      ${le("Score","climbScore",n,i,"climbs")}
      ${le("Land","countryCode",n,i,"climbs")}
      ${le("Rennen","raceName",n,i,"climbs")}
      ${le("Etappe","stageNumber",n,i,"climbs")}
      ${le("Höhenmeter","gainMeters",n,i,"climbs")}
      ${le("Distanz","distanceKm",n,i,"climbs")}
      ${le("Ø Steigung","avgGradient",n,i,"climbs")}
      ${le("Max Steigung","maxGradient",n,i,"climbs")}
    </tr>`);const o=Lm(c.stageEditorClimbRows);s.innerHTML=o.map(d=>`
    <tr>
      <td>${d.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${S(d.name)}</strong></td>
      <td>${Im(d.category)}</td>
      <td>${co(d.climbScore,0,350,d.stageId,Fm(d),ur({name:d.raceName},{stageNumber:d.stageNumber,profile:"Mountain"}),d.id,ls(d.climbScore))}</td>
      <td>${ie(d.countryCode||"")}</td>
      <td><strong>${S(d.raceName)}</strong></td>
      <td><strong>${S(pa({stageNumber:d.stageNumber}))}</strong></td>
      <td>${so(d.gainMeters)}</td>
      <td>${St(d.distanceKm)}</td>
      <td>${d.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${d.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||c.stageEditorOverviewLoading),a.textContent=c.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${c.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function uo(e=!1){if(c.stageEditorOverviewLoaded&&!e){Jt(),qt();return}c.stageEditorOverviewLoading=!0,Jt(),qt();const t=await V.getStageEditorOverview();if(c.stageEditorOverviewLoading=!1,c.stageEditorOverviewLoaded=!0,!t.success||!t.data){c.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),Jt(),qt();return}c.stageEditorStageRows=t.data.stages,c.stageEditorClimbRows=t.data.climbs,Jt(),qt()}async function Pm(e=!1){const t=h("stage-editor-existing-stage-wrap");if(c.stageEditorExistingStagesLoaded&&!e){Br();return}t.classList.add("loading");const a=h("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const r=await V.listStageEditorStages();if(t.classList.remove("loading"),c.stageEditorExistingStagesLoaded=!0,!r.success||!r.data){c.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}c.stageEditorExistingStages=r.data.stages,Br()}function Br(){const e=h("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+c.stageEditorExistingStages.map(a=>{const r=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${S(a.raceName)} · Etappe ${a.stageNumber}${r}</option>`}).join("")}function Nm(e){const t=c.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(c.stageEditorStagesSort.key){case"stageId":s=a.stageId-r.stageId;break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"profile":s=a.profile.localeCompare(r.profile,"de");break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"elevationGainMeters":s=a.elevationGainMeters-r.elevationGainMeters;break;case"sprintCount":s=a.sprintCount-r.sprintCount;break;case"climbCount":s=a.climbCount-r.climbCount;break;case"profileScore":s=a.profileScore-r.profileScore;break}return s*t||a.stageId-r.stageId})}function Lm(e){const t=c.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{let s=0;switch(c.stageEditorClimbsSort.key){case"placementKm":s=a.placementKm-r.placementKm;break;case"name":s=a.name.localeCompare(r.name,"de");break;case"category":s=(a.category??"").localeCompare(r.category??"","de");break;case"countryCode":s=(a.countryCode||"").localeCompare(r.countryCode||"","de");break;case"raceName":s=a.raceName.localeCompare(r.raceName,"de");break;case"stageNumber":s=a.stageNumber-r.stageNumber;break;case"gainMeters":s=a.gainMeters-r.gainMeters;break;case"distanceKm":s=a.distanceKm-r.distanceKm;break;case"avgGradient":s=a.avgGradient-r.avgGradient;break;case"maxGradient":s=a.maxGradient-r.maxGradient;break;case"climbScore":s=a.climbScore-r.climbScore;break}return s*t||a.placementKm-r.placementKm})}function Dm(e){return e.map(t=>t.type).join(" | ")}function Am(e){const t=[],a=[];let r=0;return e.segments.forEach((s,n)=>{const i=r,o=Be(i+s.lengthKm),d=os(s);s.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:s.startElevation})}),s.endMarkers.forEach(l=>{if(ss(l.type,l.cat)&&l.name){let p=-1;for(let m=a.length-1;m>=0;m--)if(a[m].name===l.name){p=m;break}if(p>=0){const m=a[p];a.splice(p,1);const u=Be(o-m.startKm),f=Math.max(0,d-m.startElevation),g=u>0?ua(f/(u*10)):0;t.push({name:l.name,startKm:m.startKm,endKm:o,distanceKm:u,gainMeters:f,avgGradient:g,category:l.cat||"4"})}}}),r=o}),t}function _m(e){const t=[];let a=0;return e.segments.forEach(r=>{const s=Be(a+r.lengthKm);r.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:s})}),a=s}),t}function ce(){Br();const e=c.stageEditorDraft,t=h("stage-editor-import-summary"),a=h("stage-editor-warnings"),r=h("stage-editor-climbs"),s=h("stage-editor-empty"),n=h("stage-editor-chart"),i=h("stage-editor-waypoints-body"),o=h("stage-editor-export-hint"),d=h("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",r.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',s.classList.remove("hidden"),n.innerHTML=Pn(null),i.innerHTML=`<tr><td colspan="${zu}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",d.disabled=!0;return}s.classList.add("hidden");const l=oo(e),p=lo(),m=document.getElementById("stage-editor-profile"),u=m&&m.value?m.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${S(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${St(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${S(u)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const f=[...e.warnings,...l,...p];a.innerHTML=f.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':f.map(v=>`<div class="stage-editor-alert">${S(v)}</div>`).join("");const g=Am(e),b=_m(e);let y="";g.length>0?y+=`
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
              <span>${St(v.startKm)} - ${St(v.endKm)}</span>
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
              ${St(v.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:y+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `,r.innerHTML=y,n.innerHTML=Pn(e),i.innerHTML=e.segments.map((v,x)=>`
    <tr data-segment-index="${x}" class="${is(e,x).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${x+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${v.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${rm(v.lengthKm<Ya)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${v.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${em(v.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${Fn(v.markers,x,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${Fn(v.endMarkers,x,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div class="text-muted" style="min-width:3.5rem;">${os(v)} m</div>
          ${Bm(e,x)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${x}">+</button>
          ${x===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${x}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${x}">✕</button>`:""}
        </div>
      </td>
    </tr>`).join(""),d.disabled=f.length>0,o.textContent=f.length>0?`${f.length} Validierungshinweise vor dem Export.`:`Exportiert ${h("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function Bm(e,t){const a=is(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(r=>`<div>${S(r)}</div>`).join("")}</div>`}function Pn(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,r=24,s=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(g=>g.elevation)),d=Math.max(...n.map(g=>g.elevation)),l=Math.max(1,d-o),p=n.map(g=>{const b=r+g.kmMark/Math.max(i,.1)*(t-r*2),y=a-s-(g.elevation-o)/l*(a-s*2);return{x:b,y,waypoint:g}}),m=p.map((g,b)=>`${b===0?"M":"L"} ${g.x.toFixed(1)} ${g.y.toFixed(1)}`).join(" "),u=`${m} L ${(t-r).toFixed(1)} ${(a-s).toFixed(1)} L ${r.toFixed(1)} ${(a-s).toFixed(1)} Z`,f=p.filter(g=>g.waypoint.markers.length>0).map(g=>`
      <line x1="${g.x.toFixed(1)}" y1="${s}" x2="${g.x.toFixed(1)}" y2="${(a-s).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${g.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${S(Dm(g.waypoint.markers))}</text>`).join("");return`
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
      <text x="${r}" y="${s-4}" class="stage-editor-chart-scale">${Math.round(d)} m</text>
      <text x="${r}" y="${a-4}" class="stage-editor-chart-scale">${Math.round(o)} m</text>
      <text x="${t-r}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${St(i)}</text>
    </svg>`}function Gm(e,t,a){const r=c.stageEditorDraft;if(!r)return;const s=r.segments[e];s&&(t==="startElevation"?s.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?s.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?s.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(s.terrain=a,s.manualTerrain=!0):t==="techLevel"?s.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(s.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),ht(r),ot(r),ce())}function Hm(e){const t=c.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const r={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,r),ht(t),ot(t),ce()}function zm(){const e=c.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],r={startElevation:t?os(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(r),ht(e),ot(e),ce()}function Km(e){const t=c.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),ht(t),ot(t),ce()))}async function Wm(){var a;const t=(a=h("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}h("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,Se("Route wird importiert……");try{const r=await t.text(),s=await V.importStageRoute({fileName:t.name,fileContent:r});if(!s.success||!s.data){alert(`Import fehlgeschlagen: ${s.error??"Unbekannter Fehler"}`);return}const n=no(s.data);c.stageEditorDraft=n,ot(n),xm(n),ce(),It("stage-editor")}finally{he()}}async function jm(){const e=Number(h("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}Se("CSV-Stage wird geladen...");try{const t=await V.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=no(t.data.draft);c.stageEditorDraft=a,ot(a),Tm(t.data.metadata),ce(),It("stage-editor")}finally{he()}}async function Om(){if(!c.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...oo(c.stageEditorDraft),...lo()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),ce();return}const t=h("stage-editor-new-race-checkbox").checked,a=h("stage-editor-program-checkbox").checked;let r;t&&(r={name:h("stage-editor-race-name").value.trim(),countryId:Number(h("stage-editor-race-country").value),categoryId:Number(h("stage-editor-race-category").value),isStageRace:Number(h("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(h("stage-editor-race-num-stages").value),startDate:h("stage-editor-race-start-date").value.trim(),endDate:h("stage-editor-race-end-date").value.trim(),prestige:Number(h("stage-editor-race-prestige").value)});let s;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');s=Array.from(n).map(i=>Number(i.value))}Se("CSV-Dateien werden erstellt……");try{const n=await V.exportStageRoute({metadata:wm(),draft:c.stageEditorDraft,newRace:t,raceDetails:r,updatePrograms:a,programIds:s});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}Dr(n.data.stagesFileName,n.data.stagesCsv),Dr(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=h("stage-editor-stage-number"),o=Number(i.value)||1;i.value=String(o+1);const d=h("stage-editor-date"),l=d.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(l)){const y=new Date(l);y.setDate(y.getDate()+1);const v=y.getFullYear(),x=String(y.getMonth()+1).padStart(2,"0"),M=String(y.getDate()).padStart(2,"0");d.value=`${v}-${x}-${M}`}await Promise.all([uo(!0),Pm(!0)]);const p=io();h("stage-editor-stage-id").value=String(p),At=p;const m=h("stage-editor-new-race-checkbox");m&&(m.checked=!1);const u=h("stage-editor-new-race-details");u&&(u.classList.add("hidden"),u.style.display="none");const f=h("stage-editor-program-checkbox");f&&(f.checked=!1);const g=h("stage-editor-program-details");g&&(g.classList.add("hidden"),g.style.display="none"),_t=Number(h("stage-editor-race-id").value),ce()}finally{he()}}function Vm(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",T=>{const $=T.target.closest("button[data-stage-profile-open-stage-id]");if($){const L=Number($.dataset.stageProfileOpenStageId);Number.isFinite(L)&&er(L);return}const C=T.target.closest("button[data-stage-editor-stages-sort]");if(!C)return;const R=C.dataset.stageEditorStagesSort;c.stageEditorStagesSort.key===R?c.stageEditorStagesSort.direction=c.stageEditorStagesSort.direction==="asc"?"desc":"asc":c.stageEditorStagesSort={key:R,direction:Mm(R)},Jt()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",T=>{const $=T.target.closest("button[data-stage-profile-open-stage-id]");if($){const L=Number($.dataset.stageProfileOpenStageId),P=$.dataset.stageProfileOpenClimbId??null;if(Number.isFinite(L)){let D=null;P&&c.stageEditorClimbRows&&(D=c.stageEditorClimbRows.find(_=>_.id===P)??null),er(L,D)}return}const C=T.target.closest("button[data-stage-editor-climbs-sort]");if(!C)return;const R=C.dataset.stageEditorClimbsSort;c.stageEditorClimbsSort.key===R?c.stageEditorClimbsSort.direction=c.stageEditorClimbsSort.direction==="asc"?"desc":"asc":c.stageEditorClimbsSort={key:R,direction:Rm(R)},qt()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{Wm()});const r=document.getElementById("btn-stage-editor-load-existing");r&&r.addEventListener("click",()=>{jm()});const s=document.getElementById("btn-stage-editor-export");s&&s.addEventListener("click",()=>{Om()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",T=>{var C;const $=((C=T.target.files)==null?void 0:C[0])??null;h("stage-editor-file-hint").textContent=$?`${$.name} · ${($.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",T=>{const $=T.target,C=$.closest("tr[data-segment-index]"),R=$.dataset.field;if(!C||!R)return;const L=Number(C.dataset.segmentIndex);if(Number.isInteger(L)){if(R==="markerType"||R==="markerName"||R==="markerCat"){const P=Number($.dataset.markerIndex),D=$.dataset.markerScope;if(!Number.isInteger(P)||D!=="start"&&D!=="end")return;gm(L,P,D,R,$.value);return}Gm(L,R,$.value)}}),i.addEventListener("click",T=>{const $=T.target.closest("button[data-segment-action]");if(!$)return;const C=Number($.dataset.segmentIndex);if(Number.isInteger(C)){if($.dataset.segmentAction==="insert"){Hm(C);return}if($.dataset.segmentAction==="append"){zm();return}if($.dataset.segmentAction==="add-marker"){const R=$.dataset.markerScope;if(R!=="start"&&R!=="end")return;fm(C,R);return}if($.dataset.segmentAction==="remove-marker"){const R=Number($.dataset.markerIndex),L=$.dataset.markerScope;if(!Number.isInteger(R)||L!=="start"&&L!=="end")return;hm(C,R,L);return}$.dataset.segmentAction==="delete"&&Km(C)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(T=>{const $=document.getElementById(T);$&&$.addEventListener("change",()=>ce())}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(T=>{T.addEventListener("change",()=>ce())});const d=h("stage-editor-new-race-checkbox"),l=h("stage-editor-new-race-details"),p=h("stage-editor-program-checkbox"),m=h("stage-editor-program-details");d&&d.addEventListener("change",()=>{d.checked?(l&&(l.classList.remove("hidden"),l.style.display="grid"),p&&(p.checked=!0,m&&(m.classList.remove("hidden"),m.style.display="block"))):l&&(l.classList.add("hidden"),l.style.display="none"),ce()}),p&&p.addEventListener("change",()=>{p.checked?m&&(m.classList.remove("hidden"),m.style.display="block"):m&&(m.classList.add("hidden"),m.style.display="none"),ce()});const u=h("stage-editor-programs-dropdown-trigger"),f=h("stage-editor-programs-dropdown-menu"),g=h("btn-stage-editor-programs-ok");u&&f&&(u.addEventListener("click",T=>{T.stopPropagation();const $=f.style.display==="none"||!f.style.display;f.style.display=$?"flex":"none"}),g&&g.addEventListener("click",T=>{T.stopPropagation(),f.style.display="none",ce()}),document.addEventListener("click",T=>{const $=T.target;f.style.display==="flex"&&!f.contains($)&&$!==u&&!u.contains($)&&(f.style.display="none",ce())}));const b=h("stage-editor-programs-list");b&&b.addEventListener("change",T=>{T.target.name==="stage-editor-program-selection"&&vm()});let y=!1,v=null;const x=h("stage-editor-stage-id"),M=h("stage-editor-race-id");if(x&&M){[x,M].forEach($=>{$.addEventListener("keydown",C=>{C.key!=="ArrowUp"&&C.key!=="ArrowDown"&&(y=!0,v&&clearTimeout(v))}),$.addEventListener("keyup",C=>{C.key!=="ArrowUp"&&C.key!=="ArrowDown"&&(v&&clearTimeout(v),v=setTimeout(()=>{y=!1},150))}),$.addEventListener("blur",()=>{y=!1})});const T=($,C)=>{const R=Number($.value);if(!Number.isInteger(R)||R<=0){C==="stage"?At=R:_t=R;return}const P=R-(C==="stage"?At:_t);if(!y&&(P===1||P===-1)){let D=R;C==="stage"?D=km(R,P):h("stage-editor-new-race-checkbox").checked&&(D=$m(R,P)),$.value=String(D)}C==="stage"?At=Number($.value):_t=Number($.value)};x.addEventListener("input",()=>{T(x,"stage"),ce()}),M.addEventListener("input",()=>{T(M,"race"),ce()})}}let rt=[],Nt=null,Ee={form:!0,combinedFatigue:!0,shortFatigue:!1,longFatigue:!1};const Ct=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"];function ds(e,t){if(e==null)return"";const a=t?S(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const te={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function qa(e,t,a){const r=nt(e??null);return`<span class="badge badge-race-category" style="${rr(r)}; white-space: nowrap; display: inline-block;">${S(e??"Unbekannt")}</span>`}function cs(e){if(!e)return"-";const t=nt(e);return`<span class="badge badge-race-category" style="${rr(t)}; white-space: nowrap; display: inline-block;">${S(e)}</span>`}function Um(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function Ym(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${Um(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function mo(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";case"breakaway_final":return"is-breakaway";default:return""}}function us(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";case"breakaway_final":return"Ausreißer";default:return"Etappe"}}function Zm(e){return`<span class="rider-stats-final-type ${mo(e)}">${S(us(e))}</span>`}function ne(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?r+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?r+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?r+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?r+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?r+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(r+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function ye(e,t,a){let r="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?r+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?r+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?r+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?r+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?r+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?r+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?r+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(r+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${r}" title="${S(a)}: ${e} Siege">${e}</span>`}function Jm(e){return`${e.startDate===e.endDate?se(e.startDate):`${se(e.startDate)} - ${se(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function Xa(e){if(e==null||c.riders.length===0)return null;const a=[...c.riders].sort((r,s)=>(s.seasonPoints??0)-(r.seasonPoints??0)||(s.seasonWins??0)-(r.seasonWins??0)||s.overallRating-r.overallRating||`${r.lastName} ${r.firstName}`.localeCompare(`${s.lastName} ${s.firstName}`,"de")||r.id-s.id).findIndex(r=>r.id===e);return a>=0?a+1:null}function Nn(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;case"breakaway_final":return 4;default:return 5}}function qm(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||Nn(t.rowType)-Nn(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function Xm(e){return[...e].map(t=>({...t,rows:qm(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function po(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(50,Math.min(85,e));for(let d=1;d<t.length;d++){const l=t[d-1],p=t[d];if(s<=p.score){const m=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*m),r=Math.round(l.lightness+(p.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function lt(e,t,a,r){const s=r>0?Math.max(0,Math.min(1,a/r)):.5,n=Math.round(6+s*118),i=.26+s*.18,o=.14+s*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${S(t)}">${e} ${a}</span>`}function Tr(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function wr(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return te.mountain;case"Hill":return te.hilly;case"Sprint":return te.sprint;case"Timetrial":return te.timetrial;case"Cobble":return te.cobble;case"Attacker":return te.attacker;default:return""}}function ze(e,t,a,r,s){var ee,F,B;const n=(t==null?void 0:t.countryCode)??r??null,i=n?ie(n):s,o=(t==null?void 0:t.roleName)??((ee=e==null?void 0:e.role)==null?void 0:ee.name)??"Ohne Rolle",d=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,p=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",m=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",u=((F=t==null?void 0:t.program)==null?void 0:F.name)??((B=e==null?void 0:e.seasonProgram)==null?void 0:B.name)??"-",f=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,g=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,b=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,y=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,v=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,x=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,M=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",T=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,$=(t==null?void 0:t.currentSeasonRank)??Xa((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),C=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,R=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,L=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,P=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},D=Math.max(P.flat,P.hilly,P.mediumMountain,P.mountain,P.timetrial,P.cobble),_=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},H=Math.max(_.stageRace,_.oneDay),K=e!=null&&e.specialization1?Tr(e.specialization1):"-",w=e!=null&&e.specialization2?Tr(e.specialization2):"-",A=e!=null&&e.specialization3?Tr(e.specialization3):"-",Y=wr((e==null?void 0:e.specialization1)??null),W=wr((e==null?void 0:e.specialization2)??null),re=wr((e==null?void 0:e.specialization3)??null);let q="";return t!=null&&t.lieutenantInfo?q=`
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.lieutenantInfo.name)}</a></span></span>
    `:t!=null&&t.leaderInfo&&(q=`
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.leaderInfo.name)}</a></span></span>
    `),`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${S(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?Tt(l,p):""} <span>${S(p)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${S(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${pi(m)} <span>Form</span></span>
        ${q}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${po(d)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${te.seasonForm} ${f>=0?"+":""}${f}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${te.raceForm} ${g>=0?"+":""}${g}</span>
        <span class="rider-stats-icon-pill" title="Programm">${S(u)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${te.raceDays} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${y>14?"text-warning":""}" title="30-Tage Renntage">${te.rollingRaceDays} <span class="rider-stats-icon-pill-value">${y}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${te.longFatigue} <span class="rider-stats-icon-pill-value">${v}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${M!=="none"?"text-error":""}" title="Kurzzeitfatigue">${te.shortFatigue} <span class="rider-stats-icon-pill-value">${x}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${te.seasonPoints} <span class="rider-stats-icon-pill-value">${T}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${te.rank} <span class="rider-stats-icon-pill-value">${Ym($)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${te.raceDays} <span class="rider-stats-icon-pill-value">${C}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${te.wins} <span class="rider-stats-icon-pill-value">${R}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${Y} ${S(K)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${W} ${S(w)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${re} ${S(A)}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${lt(te.stageRace,"Rundfahrten Punkte",_.stageRace,H)}
        ${lt(te.oneDay,"Eintagesrennen Punkte",_.oneDay,H)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${te.breakaway} <span class="rider-stats-icon-pill-value">${L}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${lt(te.flat,"Flach-Punkte",P.flat,D)}
        ${lt(te.hilly,"Hügel-Punkte",P.hilly,D)}
        ${lt(te.mediumMountain,"Mittelgebirge-Punkte",P.mediumMountain,D)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${lt(te.mountain,"Hochgebirge-Punkte",P.mountain,D)}
        ${lt(te.timetrial,"Zeitfahren-Punkte",P.timetrial,D)}
        ${lt(te.cobble,"Kopfsteinpflaster-Punkte",P.cobble,D)}
      </div>
    </div>
  `}function Ln(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",r=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${S(a)} <strong>${S(r)}</strong>`}function Ke(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${c.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${c.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${c.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${c.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${c.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${c.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${c.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${c.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
    </div>`}function Qm(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,r=36;const s=Math.max(55,Math.min(80,e));for(let d=1;d<t.length;d++){const l=t[d-1],p=t[d];if(s<=p.score){const m=(s-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*m),r=Math.round(l.lightness+(p.lightness-l.lightness)*m);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${r}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function ep(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},r=["mountain","hill","sprint","timeTrial","cobble","attack"],s=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,d=i/2,l=160,p=60,m=85,u=m-p,f=_=>{const H=[];for(let K=0;K<6;K++){const w=K*Math.PI/3-Math.PI/2;H.push(`${o+_*Math.cos(w)},${d+_*Math.sin(w)}`)}return H},g=`
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
    </defs>`,b=`<circle cx="${o}" cy="${d}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let y="";for(let _=p;_<=m;_+=2.5){const H=l*((_-p)/u);if(H<1){y+=`<circle cx="${o}" cy="${d}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const K=f(H),w=_%5===0,A=w?1:.6,Y=w?"none":"4,4",W=w?.4:.18;y+=`<polygon points="${K.join(" ")}" fill="none" stroke="rgba(255,255,255,${W})" stroke-width="${A}" stroke-dasharray="${Y}" />`,w&&_>p&&(y+=`<text x="${o+5}" y="${d-H+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${_}</text>`)}let v="",x="";for(let _=0;_<6;_++){const H=_*Math.PI/3-Math.PI/2,K=o+l*Math.cos(H),w=d+l*Math.sin(H);v+=`<line x1="${o}" y1="${d}" x2="${K}" y2="${w}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const A=l+28,Y=o+A*Math.cos(H),W=d+A*Math.sin(H),re=Math.cos(H);let q="middle";re>.15?q="start":re<-.15&&(q="end");const ee=a[r[_]]??p;x+=`<text x="${Y}" y="${W}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${q}" dominant-baseline="middle">${s[_]}</text>`,x+=`<text x="${Y}" y="${W+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${q}" dominant-baseline="middle">${ee}</text>`}const M=[],T=[];r.forEach((_,H)=>{const K=a[_]??p,w=l*((Math.max(p,Math.min(m,K))-p)/u),A=H*Math.PI/3-Math.PI/2,Y=o+w*Math.cos(A),W=d+w*Math.sin(A);M.push(`${Y},${W}`),T.push(`<circle cx="${Y}" cy="${W}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${s[H]}: ${K}</title></circle>`)});const $=`<polygon points="${M.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,R=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((_,H)=>{const K=a[_.key]??60;return(a[H.key]??60)-K}),L=[],P=[];R.forEach((_,H)=>{const K=a[_.key]??60,w=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${_.label}</span>
        ${Qm(K)}
      </div>
    `;H%2===0?L.push(w):P.push(w)});const D=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${L.join("")}</div>
      <div class="skills-col">${P.join("")}</div>
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
          ${D}
        </div>
      </div>
    </section>
  `}function tp(e,t){const a=t.shortTermFatigueMalus??0,r=t.longTermFatigueDecayable??0,s=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),d=(r/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const p=t.fatigueHistory??[];let m="";return p.length===0?m='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':m=p.map(u=>{const f=se(u.date);let g="";u.type==="race"?g=`${S(u.raceName)}${u.stageNumber!=null?` - Etappe ${u.stageNumber}`:""}`:g=u.raceName?S(u.raceName):"Regeneration";const b=u.type==="race"&&u.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${u.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let y="";u.shortChange>0?y=`<span style="color: #ef4444; font-weight: 600;">+${u.shortChange.toFixed(2).replace(".",",")}</span>`:u.shortChange<0?y=`<span style="color: #2ecc71; font-weight: 600;">${u.shortChange.toFixed(2).replace(".",",")}</span>`:y='<span style="color: #666;">0,00</span>';const v=[];if(u.longDecayableChange!==0){const T=u.longDecayableChange>0?"+":"",$=u.longDecayableChange>0?"#ef4444":"#2ecc71";v.push(`<span style="color: ${$}; font-weight: 500;">${T}${u.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(u.longLockedChange!==0){const T=u.longLockedChange>0?"+":"",$=u.longLockedChange>0?"#a855f7":"#2ecc71";v.push(`<span style="color: ${$}; font-weight: 500;">${T}${u.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const x=v.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${v.join("")}</div>`:'<span style="color: #666;">0,00</span>',M=u.shortAfter+u.longAfter;return`
        <tr>
          <td style="color: #ccc; font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${f}</td>
          <td style="color: #fff; font-weight: 600; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${g}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${b}</td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${y}
              <span style="font-size: 0.85rem; color: #888;">(${u.shortAfter.toFixed(2).replace(".",",")})</span>
            </div>
          </td>
          <td style="text-align: right; padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; justify-content: flex-end; width: 100%;">
              ${x}
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
                ${te.shortFatigue}
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
                ${te.longFatigue}
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
            ${m}
          </tbody>
        </table>
      </div>
    </section>
  `}function ap(e){var B;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((I,N)=>N%2===0),r=((B=c.gameState)==null?void 0:B.currentDate)??new Date().toISOString(),s=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(r).getUTCFullYear(),n=new Date(Date.UTC(s,0,1)).getTime(),i=864e5,o=1260,d=384,l=40,p=20,m=a.map(I=>{const E=(new Date(I.date).getTime()-n)/i,O=l+E/365*o,z=p+d-Math.min(8,Math.max(0,I.totalForm))/8*d;return{x:O,y:z,form:I.totalForm,date:I.date}});let u="",f="",g="";Ee.form&&m.length>0&&(u=`M ${m.map(I=>`${I.x},${I.y}`).join(" L ")}`,f=m.map(I=>`<circle cx="${I.x}" cy="${I.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${I.date}): ${I.form}</title></circle>`).join(""),g=`${u} L ${m[m.length-1].x},${p+d} L ${m[0].x},${p+d} Z`);let b="",y="";if(Ee.combinedFatigue&&m.length>0){const I=a.map(E=>{const z=(new Date(E.date).getTime()-n)/i,k=l+z/365*o,G=E.combinedFatigue??0,j=p+d-Math.min(15,Math.max(0,G))/15*d;return{x:k,y:j,val:G,date:E.date}});b=`<path d="${`M ${I.map(E=>`${E.x},${E.y}`).join(" L ")}`}" fill="none" stroke="#ef4444" stroke-width="2" />`,y=I.map(E=>`<circle cx="${E.x}" cy="${E.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${E.date}): ${E.val.toFixed(2)}</title></circle>`).join("")}let v="",x="";if(Ee.shortFatigue&&m.length>0){const I=a.map(E=>{const z=(new Date(E.date).getTime()-n)/i,k=l+z/365*o,G=E.shortFatigue??0,j=p+d-Math.min(15,Math.max(0,G))/15*d;return{x:k,y:j,val:G,date:E.date}});v=`<path d="${`M ${I.map(E=>`${E.x},${E.y}`).join(" L ")}`}" fill="none" stroke="#facc15" stroke-width="2" />`,x=I.map(E=>`<circle cx="${E.x}" cy="${E.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${E.date}): ${E.val.toFixed(2)}</title></circle>`).join("")}let M="",T="";if(Ee.longFatigue&&m.length>0){const I=a.map(E=>{const z=(new Date(E.date).getTime()-n)/i,k=l+z/365*o,G=E.longFatigue??0,j=p+d-Math.min(15,Math.max(0,G))/15*d;return{x:k,y:j,val:G,date:E.date}});M=`<path d="${`M ${I.map(E=>`${E.x},${E.y}`).join(" L ")}`}" fill="none" stroke="#a855f7" stroke-width="2" />`,T=I.map(E=>`<circle cx="${E.x}" cy="${E.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${E.date}): ${E.val.toFixed(2)}</title></circle>`).join("")}const $="rgba(251, 191, 36, 0.15)";let C="";for(let I=0;I<=8;I+=2){const N=p+d-I/8*d;C+=`<line x1="${l}" y1="${N}" x2="${l+o}" y2="${N}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,C+=`<text x="${l-5}" y="${N+4}" fill="#ffffff" font-size="10" text-anchor="end">${I}</text>`}for(let I=0;I<=15;I+=3){const N=p+d-I/15*d;C+=`<text x="${l+o+5}" y="${N+4}" fill="#ef4444" font-size="10" text-anchor="start">${I}</text>`}let R="";for(let I=0;I<=52;I+=5){const N=l+I/52*o;C+=`<line x1="${N}" y1="${p}" x2="${N}" y2="${p+d}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,R+=`<text x="${N}" y="${p+d+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${I}</text>`}let L="",P="";if(e.peakDates){const I=[...e.peakDates].sort((N,E)=>new Date(N).getTime()-new Date(E).getTime());for(let N=0;N<I.length;N++){const E=I[N],z=(new Date(E).getTime()-n)/i,k=l+z/365*o;L+=`<line x1="${k}" y1="${p}" x2="${k}" y2="${p+d}" stroke="#ffffff" stroke-width="2"><title>Peak: ${E}</title></line>`;const G=N>0?(new Date(I[N-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,j=z-56,U=G+14,me=Math.max(0,Math.max(j,U)),pe=z-me,Re=l+me/365*o,ke=pe/365*o;P+=`<rect x="${Re}" y="${p}" width="${ke}" height="${d}" fill="rgba(16, 185, 129, 0.1)" />`;const Xe=14/365*o;P+=`<rect x="${k}" y="${p}" width="${Xe}" height="${d}" fill="rgba(239, 68, 68, 0.1)" />`}}const _=(new Date(r).getTime()-n)/i,H=l+_/365*o;L+=`<line x1="${H}" y1="${p}" x2="${H}" y2="${p+d}" stroke="#ef4444" stroke-width="3"><title>Heute: ${r}</title></line>`,rt.forEach((I,N)=>{const E=Ct[N%Ct.length];I.peakDates&&I.peakDates.forEach(O=>{const k=(new Date(O).getTime()-n)/i,G=l+k/365*o;L+=`<line x1="${G}" y1="${p}" x2="${G}" y2="${p+d}" stroke="${E}" stroke-width="1.5" stroke-dasharray="3,3"><title>${I.riderName} Peak: ${O}</title></line>`})});let K="",w="";rt.forEach((I,N)=>{const E=Ct[N%Ct.length],O=I.formHistory.filter((z,k)=>k%2===0).map(z=>{const G=(new Date(z.date).getTime()-n)/i,j=l+G/365*o,U=p+d-Math.min(8,Math.max(0,z.totalForm))/8*d;return{x:j,y:U,form:z.totalForm,date:z.date}});if(O.length>0){const z=`M ${O.map(k=>`${k.x},${k.y}`).join(" L ")}`;K+=`<path d="${z}" fill="none" stroke="${E}" stroke-width="2" />`,w+=O.map(k=>`<circle cx="${k.x}" cy="${k.y}" r="3" fill="#fff" stroke="${E}" stroke-width="2"><title>${I.riderName} (${k.date}): ${k.form}</title></circle>`).join("")}});const A=c.teams.filter(I=>I.division==="WorldTour"||I.divisionName==="WorldTour");let Y='<option value="">-- Team auswählen --</option>';for(const I of A){const N=Nt===I.id?" selected":"";Y+=`<option value="${I.id}"${N}>${S(I.name)}</option>`}let W='<option value="">-- Fahrer auswählen --</option>';if(Nt!=null){const I=c.riders.filter(N=>N.activeTeamId===Nt&&N.id!==e.riderId&&!rt.some(E=>E.riderId===N.id));for(const N of I)W+=`<option value="${N.id}">${S(N.firstName)} ${S(N.lastName)}</option>`}const re=`
    <div class="rider-compare-controls" style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-primary);">
      <span style="font-weight: 600; color: var(--text-100); font-size: 0.95rem;">Mit anderem Fahrer vergleichen:</span>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-team-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Team (Tier 1):</label>
        <select id="rider-compare-team-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);">
          ${Y}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
        <label for="rider-compare-rider-select" style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-300);">Fahrer:</label>
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${Nt==null?"disabled":""}>
          ${W}
        </select>
      </div>
    </div>
  `,q=e.currentSeasonRank??Xa(e.riderId)??"–",ee=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(e.riderName)} (${e.currentSeasonPoints}/${q})">${S(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${q})</span></span>
    </div>
    `];rt.forEach((I,N)=>{const E=Ct[N%Ct.length],O=I.currentSeasonRank??Xa(I.riderId)??"–";ee.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${E}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(I.riderName)} (${I.currentSeasonPoints}/${O})">${S(I.riderName)} <span style="color: var(--text-500);">(${I.currentSeasonPoints}/${O})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${I.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const F=`
    <div class="rider-stats-compare-legend" style="background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary); max-height: 460px; overflow-y: auto; display: flex; flex-direction: column;">
      <h4 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; color: var(--text-100); font-weight: bold;">Legende</h4>
      
      <!-- Chart Line Toggle Checkboxes -->
      <div class="chart-line-toggles" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-form" ${Ee.form?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: var(--accent-primary);" />
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%;"></span>
          Form (0-8)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-combined-fatigue" ${Ee.combinedFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #ef4444;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
          Gesamtfatigue (0-15)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-short-fatigue" ${Ee.shortFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #facc15;" />
          <span style="display: inline-block; width: 8px; height: 8px; background: #facc15; border-radius: 50%;"></span>
          Kurzzeitfatigue (0-15)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-100); font-size: 0.9rem; margin: 0; user-select: none;">
          <input type="checkbox" id="toggle-chart-long-fatigue" ${Ee.longFatigue?"checked":""} style="cursor: pointer; width: 14px; height: 14px; accent-color: #a855f7;" />
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
      ${re}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${P}
            ${C}
            ${R}
            ${L}
            ${g?`<path d="${g}" fill="${$}" />`:""}
            ${u?`<path d="${u}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${f}
            ${b}
            ${y}
            ${v}
            ${x}
            ${M}
            ${T}
            ${K}
            ${w}
          </svg>
        </div>
        ${F}
      </div>
    </section>
  `}function rp(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
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
                <td>${S(dr(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${r?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(s=a.country)!=null&&s.code3?ie(a.country.code3):"–"}</td>
                <td><strong>${S(a.name)}</strong></td>
                <td>${lr(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function ms(e){const t=new Set;if(e.jerseysWorn){const i=e.jerseysWorn.split(",").map(o=>o.trim()).filter(Boolean);for(const o of i)t.add(o)}const a=new Map;if(e.eventIds){const i=e.eventIds.split("|");for(const o of i){const[d,l]=o.split(":");d&&a.set(d,l?parseInt(l,10):1)}}const r=[{type:"jersey",key:"yellow",label:"Gelbes Trikot (Gesamtwertung)",colorClass:"jersey-dot-yellow"},{type:"jersey",key:"green",label:"Grünes Trikot (Punktewertung)",colorClass:"jersey-dot-green"},{type:"jersey",key:"red",label:"Bergtrikot (Bergwertung)",colorClass:"jersey-dot-red"},{type:"jersey",key:"white",label:"Weißes Trikot (Nachwuchswertung)",colorClass:"jersey-dot-white"},{type:"jersey",key:"purple",label:"Lila Trikot (Aktivste Fahrer)",colorClass:"jersey-dot-purple-worn"},{type:"event",key:"3",label:"Superform",colorClass:"event-dot-3"},{type:"event",key:"4",label:"Supermalus",colorClass:"event-dot-4"},{type:"event",key:"1",label:"Sturz",colorClass:"event-dot-1"},{type:"event",key:"2",label:"Defekt",colorClass:"event-dot-2"},{type:"event",key:"7",label:"Heimvorteil",colorClass:"event-dot-7"},{type:"event",key:"8",label:"Heimbonus",colorClass:"event-dot-8"},{type:"event",key:"9",label:"Heimmalus",colorClass:"event-dot-9"},{type:"event",key:"5",label:"Attacken",colorClass:"event-dot-5"},{type:"event",key:"6",label:"Konterattacken",colorClass:"event-dot-6"}],s=[],n=[];for(const i of r)if(i.type==="jersey")t.has(i.key)&&(s.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
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
  `}function Rt(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${S(e)}</span>`}function sp(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function np(e){return e.finishStatus==="otl"?Rt("OTL","place"):e.finishStatus==="dnf"?Rt("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${S(String(e.resultRank))}</span>`}function ip(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":Rt(String(e.gcRank),"gc")}function op(e){return e.finishStatus==="otl"?Pr(e.statusReason,!0):e.finishStatus==="dnf"?Pr(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${Ha(e.stageTimeSeconds)}`:e.resultLabel}function De(e,t,a=!1){var o,d;const r=(e==null?void 0:e.activeTeamId)!=null?((o=c.teams.find(l=>l.id===e.activeTeamId))==null?void 0:o.name)??null:null,s=((d=e==null?void 0:e.country)==null?void 0:d.code3)??(e==null?void 0:e.nationality)??null,n=s?ie(s):"",i=t==null?[]:[...t.seasons].map(l=>({...l,raceBlocks:Xm(l.raceBlocks)})).sort((l,p)=>p.season-l.season);return a?`
      ${ze(e,t,r,s,n)}
      ${Ke(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`:t?c.riderStatsTab==="skills"?`
      ${ze(e,t,r,s,n)}
      ${Ke(t)}
      ${ep(e)}`:c.riderStatsTab==="fatigue"?`
      ${ze(e,t,r,s,n)}
      ${Ke(t)}
      ${tp(e,t)}`:c.riderStatsTab==="program"?`
      ${ze(e,t,r,s,n)}
      ${Ke(t)}
      ${rp(t)}`:c.riderStatsTab==="form"?`
      ${ze(e,t,r,s,n)}
      ${Ke(t)}
      ${ap(t)}`:c.riderStatsTab==="topResults"?`
      ${ze(e,t,r,s,n)}
      ${Ke(t)}
      ${dp(t)}`:c.riderStatsTab==="career"?`
      ${ze(e,t,r,s,n)}
      ${Ke(t)}
      ${cp(t)}`:t.seasons.length===0?`
      ${ze(e,t,r,s,n)}
      ${Ke(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`:`
    ${ze(e,t,r,s,n)}
    ${Ke(t)}
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
                  <p>${S(Jm(p))}</p>
                </div>
                ${qa(p.raceCategoryName,p.isStageRace,p.rows.filter(m=>m.rowType==="stage_result").length||null)}
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
                    ${p.rows.map(m=>{const u=m.rowType!=="stage_result",f=u?`${m.raceName} · ${us(m.rowType)}`:m.stageName?`${m.raceName} · ${m.stageName}`:m.raceName;return`
                        <tr class="rider-stats-row${u?" rider-stats-row-final":""}">
                          <td>${S(se(m.date))}</td>
                          <td>${np(m)}</td>
                          <td>${ip(m)}</td>
                          <td class="rider-stats-breakaway-col">${sp(m)}</td>
                          <td>${u?"":ds(m.rolledWeatherId,m.rolledWetterName)}</td>
                          <td>${u?Zm(m.rowType):qa(m.raceCategoryName?m.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):m.raceCategoryName,m.isStageRace)}</td>
                          <td>${S(f)}</td>
                          <td class="status-cell">${ms(m)}</td>
                          <td>${u?"–":m.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${m.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${ga(m.profile)}</button>`:"–"}</td>
                          <td>${u?"-":m.distanceKm!=null?S(m.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                          <td>${u?"-":m.elevationGainMeters!=null?S(String(Math.round(m.elevationGainMeters))):"–"}</td>
                          <td>${S(op(m))}</td>
                          <td>${m.seasonPoints}</td>
                        </tr>`}).join("")}
                  </tbody>
                </table>
              </div>
            </section>`).join("")}
        </div>
      </section>`).join("")}`:`
      ${ze(e,t,r,s,n)}
      ${Ke(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`}function Gr(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(c.riderStatsTab)?(e.style.minWidth="min(1475px, 95vw)",e.style.maxWidth="1687px"):(e.style.minWidth="",e.style.maxWidth="")}async function Kt(e){var d,l,p,m;const t=$e(e),a=(t==null?void 0:t.activeTeamId)!=null?((d=c.teams.find(u=>u.id===t.activeTeamId))==null?void 0:d.name)??null:null;rt=[],Nt=null,c.riderStatsSelectedRiderId=e,c.riderStatsTab="results",Gr(),c.riderStatsTopResultsFilterCategory=null,c.riderStatsTopResultsFilterSeason=null,c.riderStatsTopResultsPage=1,h("rider-stats-title").innerHTML=Ln(t,null),h("rider-stats-jersey").innerHTML="";const r=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((l=t.role)==null?void 0:l.name)??"Fahrer"} · ${a??"Team unbekannt"}${r}`:"Historie wird geladen",h("rider-stats-body").innerHTML=De(t,null,!0),Ue("riderStats");const s=await V.getRiderStats(e);if(c.riderStatsSelectedRiderId!==e)return;if(!s.success||!s.data){const u=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((p=t.role)==null?void 0:p.name)??"Fahrer"} · ${a??"Team unbekannt"}${u}`:"Fehler beim Laden",h("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>`;return}c.riderStatsPayload=s.data,Gr(),h("rider-stats-title").innerHTML=Ln(t,s.data),h("rider-stats-jersey").innerHTML="";const n=s.data.age?` · Alter ${s.data.age}`:t!=null&&t.age?` · Alter ${t.age}`:"",i=s.data.mentorName?` · Mentor: ${s.data.mentorName}`:"",o=s.data.mentoredRiderNames&&s.data.mentoredRiderNames.length>0?` · Mentor von: ${s.data.mentoredRiderNames.join(" - ")}`:"";h("rider-stats-meta").textContent=`${((m=t==null?void 0:t.role)==null?void 0:m.name)??"Fahrer"} · ${s.data.teamName??a??"Ohne aktives Team"}${n} · ${s.data.seasons.length} Saisons${i}${o}`,h("rider-stats-body").innerHTML=De(t,s.data,!1)}function lp(){h("rider-stats-body").addEventListener("click",e=>{var s;if(e.target&&e.target.id&&e.target.id.startsWith("toggle-chart-")){const n=e.target.id,i=e.target.checked;n==="toggle-chart-form"?Ee.form=i:n==="toggle-chart-combined-fatigue"?Ee.combinedFatigue=i:n==="toggle-chart-short-fatigue"?Ee.shortFatigue=i:n==="toggle-chart-long-fatigue"&&(Ee.longFatigue=i);const o=$e(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=De(o,c.riderStatsPayload,!1);return}const t=e.target.closest("button[data-rider-stats-tab]");if(!t){const n=e.target.closest("button[data-remove-compare-id]");if(n){const d=Number(n.dataset.removeCompareId);rt=rt.filter(p=>p.riderId!==d);const l=$e(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=De(l,c.riderStatsPayload,!1);return}const i=e.target.closest("button[data-top-results-page]");if(i){const d=Number(i.dataset.topResultsPage);if(!isNaN(d)&&d>=1){c.riderStatsTopResultsPage=d;const l=$e(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=De(l,c.riderStatsPayload,!1)}return}const o=e.target.closest("button[data-stage-profile-id]");if(o){const d=Number(o.dataset.stageProfileId);Number.isFinite(d)&&er(d);return}return}const a=t.dataset.riderStatsTab;if(a!=="results"&&a!=="program"&&a!=="form"&&a!=="topResults"&&a!=="skills"&&a!=="career"&&a!=="fatigue"||a==="program"&&(((s=c.riderStatsPayload)==null?void 0:s.programRaces.length)??0)===0)return;c.riderStatsTab=a,Gr();const r=$e(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=De(r,c.riderStatsPayload,!1)}),h("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){c.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,c.riderStatsTopResultsPage=1;const a=$e(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=De(a,c.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){c.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),c.riderStatsTopResultsPage=1;const a=$e(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=De(a,c.riderStatsPayload,!1)}else if(t.classList.contains("rider-stats-filter-checkbox")){const a=t.dataset.filterType;c.riderStatsTopResultsFilters[a]=t.checked,c.riderStatsTopResultsPage=1;const r=$e(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=De(r,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;Nt=a?Number(a):null;const r=$e(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=De(r,c.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const r=Number(a);if(rt.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const s=await V.getRiderStats(r,!0);s.success&&s.data?rt.push({riderId:s.data.riderId,riderName:s.data.riderName,teamId:s.data.teamId,teamName:s.data.teamName,formHistory:s.data.formHistory??[],peakDates:s.data.peakDates??[],currentSeasonPoints:s.data.currentSeasonPoints??0,currentSeasonRank:s.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(s.error??""));const n=$e(c.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=De(n,c.riderStatsPayload,!1)}}})}function Dn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function dp(e){const t=[];for(const g of e.seasons)for(const b of g.raceBlocks)for(const y of b.rows)t.push({...y,season:g.season,isStageRace:b.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,b)=>g.localeCompare(b,"de"));const r=Array.from(new Set(t.map(g=>g.season))).sort((g,b)=>b-g);let s=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?c.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?c.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?c.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?c.riderStatsTopResultsFilters.youth:!0:g.isStageRace?c.riderStatsTopResultsFilters.stage:c.riderStatsTopResultsFilters.oneDay);if(c.riderStatsTopResultsFilterCategory){const g=c.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const b=g.substring(0,g.length-8);s=s.filter(y=>y.raceCategoryName===b&&y.rowType==="stage_result")}else if(g.endsWith("-gc")){const b=g.substring(0,g.length-3);s=s.filter(y=>y.raceCategoryName===b&&y.rowType!=="stage_result")}else s=s.filter(b=>b.raceCategoryName===g)}c.riderStatsTopResultsFilterSeason!=null&&(s=s.filter(g=>g.season===c.riderStatsTopResultsFilterSeason)),s.sort((g,b)=>{if(b.seasonPoints!==g.seasonPoints)return b.seasonPoints-g.seasonPoints;const y=g.rowType!=="stage_result",v=b.rowType!=="stage_result",x=g.resultRank??9999,M=b.resultRank??9999;if(c.riderStatsTopResultsFilterCategory)return x!==M?x-M:y!==v?y?-1:1:0;{const T=Dn(g.raceCategoryName),$=Dn(b.raceCategoryName);return T!==$?T-$:y!==v?y?-1:1:x-M}});const n=200,i=s.slice(0,1e3),o=Math.max(1,Math.ceil(i.length/n));c.riderStatsTopResultsPage>o&&(c.riderStatsTopResultsPage=o);const d=(c.riderStatsTopResultsPage-1)*n,l=i.slice(d,d+n),m=`
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
  `,u=l.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':l.map(g=>{const b=g.rowType!=="stage_result",y=b?`${g.raceName} · ${us(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let v="–",x="–";g.finishStatus==="otl"?v=Rt("OTL","place"):g.finishStatus==="dnf"?v=Rt("DNF","place"):g.resultRank==null||(b?x=`<span class="rider-stats-final-type ${mo(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:v=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${S(String(g.resultRank))}</span>`);const M=b?"–":g.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${g.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${ga(g.profile)}</button>`:"–",T=!b&&g.stageScore!=null&&g.stageScore>0?or(g.stageScore,0,350):"–",$=qa(g.raceCategoryName?g.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${b?" rider-stats-row-final":""}">
            <td>${v}</td>
            <td>${x}</td>
            <td><strong>${S(y)}</strong>${b?"":ds(g.rolledWeatherId,g.rolledWetterName)}</td>
            <td class="status-cell">${ms(g)}</td>
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
  `}function cp(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,superteamCount:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),r=(n,i,o,d)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let p="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?p+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?p+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?p+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?p+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?p+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?p+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?p+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?p+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(p+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${p}" title="${S(o)}">${n}</span>`},s=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
                ${cs(n.key)}
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
                  ${ne(i.winFlat||0,"flat","Flach (Flat)")}
                  ${ne(i.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${ne(i.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${ne(i.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${ne(i.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${ne(i.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${ne(i.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${ne(i.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${ne(i.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${ne(i.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${ne(i.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${ye(i.winWeather1||0,1,"Sonnig")}
                  ${ye(i.winWeather2||0,2,"Extreme Hitze")}
                  ${ye(i.winWeather3||0,3,"Leichter Regen")}
                  ${ye(i.winWeather4||0,4,"Starkregen")}
                  ${ye(i.winWeather5||0,5,"Starker Wind")}
                  ${ye(i.winWeather6||0,6,"Dichter Nebel")}
                  ${ye(i.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${te.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${i.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}window.openRiderStatsFromRiderStats=Kt;const up=250,Ft=1200,mp=250,pp=1200,An=.2;class gp{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",r=>{var i,o,d,l;const s=r.target.closest("button[data-race-sim-action]");if(s){if(s.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const m=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;m&&((l=(d=this.options).onFinishRequested)==null||l.call(d,m,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=r.target.closest("button[data-race-sim-speed]");if(n){const p=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(p))return;this.timeMultiplier=p,this.render()}}),this.elements.messages.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-group-rider-id]");if(s){const d=this.resolveRiderIdFromGroupButton(s);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),Kt(d));return}const n=r.target.closest("button[data-race-sim-group-rider-name]");if(n){const d=this.resolveRiderIdFromGroupButton(n);d!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(d,this.detailSnapshot),Kt(d));return}const i=r.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),un(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",r=>{const s=r.target.closest("[data-race-sim-overview-summary]");if(s){const n=s.dataset.raceSimOverviewSummary,i=s.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(r)}),this.elements.groupBox.addEventListener("click",r=>{this.handleGroupInteraction(r)}),this.elements.profile.addEventListener("click",r=>{const s=r.target.closest("button[data-race-sim-timing-mode]");if(!s)return;const n=s.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+Ft,this.render())})}handleGroupInteraction(t){var p,m;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const u=this.resolveRiderIdFromGroupButton(a);u!=null&&this.selectGroupByRiderId(u,this.detailSnapshot);return}const r=t.target.closest("button[data-race-sim-group-nav]");if(!r)return;const s=this.buildRaceGroups(this.detailSnapshot);if(s.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,s.findIndex(u=>u.label===n)),o=r.dataset.raceSimGroupNav==="prev"?-1:1,d=(i+o+s.length)%s.length,l=((p=s[d])==null?void 0:p.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",u=>{const f=u.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Ft)}),this.elements.profile.addEventListener("wheel",u=>{const f=u.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Ft)},{passive:!0}),this.elements.profile.addEventListener("scroll",u=>{const f=u.target;!(f instanceof HTMLElement)||!f.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+Ft)},!0),(m=this.elements.sidebar.parentElement)==null||m.addEventListener("click",u=>{if(!this.bootstrap||!this.detailSnapshot||!xu(this.elements.sidebar,u.target))return;const g=performance.now(),b=Mn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const y=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",y),this.scheduleSidebarPaintTelemetry(g,y),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new Ni(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const r=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(r),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(s=>this.frame(s));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const r=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-r),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(s=>this.frame(s))}render(t=performance.now(),a=!1){var f;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const r=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",s=Rl(this.bootstrap.stageSummary),n=[`${s.segmentCount} Segmente`,s.sprintCount>0?`${s.sprintCount} Sprint${s.sprintCount===1?"":"s"}`:null,s.climbCount>0?`${s.climbCount} Bergwertung${s.climbCount===1?"":"en"}`:null].filter(g=>g!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,d=o!=null?i[o]??"":"",l=d?` · ${d}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${r}${n?` · ${n}`:""}${l}`;const p=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=up,m=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,u=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=mp;if(p||m||u){const g=performance.now();this.detailSnapshot=((f=this.engine)==null?void 0:f.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-g)}if(p&&this.detailSnapshot){const g=this.elements.profile.querySelector(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop);const b=performance.now();Ll(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-b),this.lastProfileRenderTime=t;const y=this.elements.profile.querySelector(".race-sim-timing-scroll");y&&(y.scrollTop=this.timingScrollTop)}if(m&&this.detailSnapshot){this.lastSidebarRenderTime=t;const g=performance.now(),b=Mn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const y=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",y),this.scheduleSidebarPaintTelemetry(g,y)}u&&this.detailSnapshot&&(un(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),lu(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),ru(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),cn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const r=a.find(s=>s.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(r)return r.label}return this.selectedGroupLabel!=null&&a.some(r=>r.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return Xr(qr(t.clusters))}resolveInitialGroupLabel(t){var a,r;return((a=t.find(s=>s.label==="P"))==null?void 0:a.label)??((r=t[0])==null?void 0:r.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(r=>[r.riderId,r]));return[...t.riderIds].sort((r,s)=>{var n,i;return(((n=a.get(r))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(s))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||r-s})[0]??null}selectGroupByLabel(t,a,r=!0){const s=this.buildRaceGroups(a),n=s.find(i=>i.label===t)??s.find(i=>i.label==="P")??s[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),r&&(this.profileInteractionHoldUntilMs=performance.now()+Ft,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const s=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;s&&(this.selectedGroupLabel=s.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+Ft,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+pp,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const r=t.dataset.raceSimGroupRiderName;if(!r)return null;const s=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===r&&(s==null||i.activeTeamId===s))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const r=this.perfTelemetry[t];this.perfTelemetry[t]=r<=0?a:r*(1-An)+a*An}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const r=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(r!==this.sidebarPaintSequence)return;const s=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",s),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||cn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const je="__stage_overview__",go="__non_finishers__",fo="__events__",ho="__roster__";let Ie="all";function ps(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function _n(e){return ps(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function fp(e){return[...e].sort((t,a)=>_n(t)-_n(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function hp(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=ps(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function bp(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function yp(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${se(t.date)}`}async function Hr(e,t){var s;const a=za(e);if(a&&(c.selectedResultsRaceId=a.race.id,c.selectedResultsStageId=e),c.riders.length===0){const n=await V.getRiders();n.success&&(c.riders=n.data??[])}const r=await V.getStageResults(e);if(!r.success){c.stageResults=null,xe(),!t&&r.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+r.error);return}c.stageResults=r.data??null,c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId,c.selectedResultTypeId=((s=c.stageResults.classifications[0])==null?void 0:s.resultTypeId)??1,c.selectedResultsMarkerKey=je,c.selectedResultsSpecialView=null),c.selectedResultsRaceId!=null&&bo(c.selectedResultsRaceId),xe()}async function bo(e){if(!c.seasonStandings){const a=await V.getSeasonStandings();a.success&&a.data&&(c.seasonStandings=a.data)}const t=await V.getRaceResultsRoster(e);t.success&&t.data?c.resultsRoster=t.data:c.resultsRoster=null}function vp(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function Bn(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function Sp(){const e=c.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=gt(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=[...e.entries].sort((y,v)=>v.overallRating-y.overallRating),s=new Set(r.slice(0,5).map(y=>y.riderId)),n=y=>{var x;const v=c.riders.find(M=>M.id===y);return((x=v==null?void 0:v.skills)==null?void 0:x.sprint)??0},o=[...e.entries.filter(y=>!s.has(y.riderId))].sort((y,v)=>{const x=n(y.riderId),M=n(v.riderId);return M!==x?M-x:v.overallRating-y.overallRating}),d=new Set(o.slice(0,5).map(y=>y.riderId));function l(y){switch(y){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return y}}const p=new Map;for(const y of e.entries){const v=y.teamId;p.has(v)||p.set(v,{teamId:y.teamId,teamName:y.teamName,riders:[],avgRating:0}),p.get(v).riders.push(y)}for(const y of p.values())y.avgRating=y.riders.reduce((v,x)=>v+x.overallRating,0)/y.riders.length;const m=y=>{let v=Number.POSITIVE_INFINITY;for(const x of y)!x.hasDropped&&x.gcRank!=null&&x.gcRank<v&&(v=x.gcRank);return v},u=y=>{var x;if(!((x=c.seasonStandings)!=null&&x.riderStandings))return 0;let v=0;for(const M of y){const T=c.seasonStandings.riderStandings.find($=>$.riderId===M.riderId);T&&T.points>v&&(v=T.points)}return v},f=y=>{if(y==null)return 0;const v=c.riders.filter(T=>T.activeTeamId===y);if(v.length===0)return 0;const x=v.map(T=>T.overallRating??0);x.sort((T,$)=>$-T);const M=x.slice(0,10);return M.length===0?0:M.reduce((T,$)=>T+$,0)/M.length},g=[...p.values()].sort((y,v)=>{const x=m(y.riders),M=m(v.riders);if((x!==Number.POSITIVE_INFINITY||M!==Number.POSITIVE_INFINITY)&&x!==M)return x-M;const T=u(y.riders),$=u(v.riders);if((T>0||$>0)&&T!==$)return $-T;const C=f(y.teamId),R=f(v.teamId);return Math.abs(C-R)>1e-4?R-C:(y.teamName??"").localeCompare(v.teamName??"","de")});for(const y of g)y.riders.sort((v,x)=>Bn(v.roleId)-Bn(x.roleId)||x.overallRating-v.overallRating||v.lastName.localeCompare(x.lastName,"de"));return`<div class="results-roster-grid">${g.map(y=>{const v=y.teamId!=null?Tt(y.teamId,y.teamName):"",x=y.riders.map(T=>{var B;const $=vp(T.roleId),C=T.countryCode?Oe[T.countryCode]??T.countryCode.slice(0,2).toLowerCase():null,R=C?`<span class="fi fi-${C} results-roster-flag" title="${S(T.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',L=`${T.firstName.charAt(0)}. ${T.lastName}`,P=T.roleName??"–",D=T.specialization1?l(T.specialization1):null,_=T.specialization2?l(T.specialization2):null;let H=P;D&&(H+=` · ${D}`),_&&(H+=` · ${_}`);const K=`<span class="results-roster-overall-badge" style="color:${kp(T.overallRating)}" title="Gesamtstärke: ${T.overallRating.toFixed(2)}">${T.overallRating.toFixed(2)}</span>`,w=T.hasDropped?" dropped":"";let A="";T.hasDropped?T.dropoutStatus==="dns"?A="DNS":T.dropoutStatus==="dnf"?A=((B=T.dropoutReason)==null?void 0:B.startsWith("OTL"))??!1?"OTL":"DNF":A="OUT":T.gcRank!=null&&(A=`${T.gcRank}`);let Y="";if(T.hasDropped)Y=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${S(T.dropoutReason||"")}">${A}</span>`;else if(T.gcRank!=null){let I="rider-stats-rank-badge-gc";T.gcRank===1?I="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":T.gcRank===2?I="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":T.gcRank===3&&(I="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),Y=`<span class="rider-stats-rank-badge ${I}" title="GC Stand: Platz ${T.gcRank}">${T.gcRank}</span>`}const re=`style="color: ${T.hasDropped?"var(--text-500)":$.color}; font-weight: bold;"`,q=s.has(T.riderId),ee=d.has(T.riderId);return`<div class="results-roster-rider${w}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${R}
            <span class="results-roster-name${q?" strongest-rider":ee?" best-sprinter":""}">
              ${Ce(L,{riderId:T.riderId,teamId:T.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${Da(T.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${re}>${S(H)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${Y||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${K}
        </div>
      </div>`}).join(""),M=y.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${v}</div>
        <div class="results-roster-team-name" title="${S(y.teamName??"–")}">${tt(y.teamName??"–",y.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${M})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${x}</div>
    </div>`}).join("")}</div>`}function kp(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function $p(e){var l,p;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=c.stageResults)==null?void 0:l.classifications.find(m=>m.resultTypeId===1),a=new Set(t?t.rows.map(m=>m.riderId).filter(m=>m!=null):[]),r=c.riders.filter(m=>m.activeTeamId===e.teamId&&a.has(m.id)),s=new Set((((p=c.stageResults)==null?void 0:p.nonFinishers)??[]).map(m=>m.riderId)),n=[];for(const m of r){if(m.id===e.riderId||s.has(m.id))continue;let u=0;const f=m.skills.sprint>=72,g=m.skills.flat>=78,b=m.skills.timeTrial>=76,y=m.skills.acceleration>=80;if(f&&u++,g&&u++,b&&u++,y&&u++,u>0){let v=1;u===2?v=1.25:u===3?v=1.5:u===4&&(v=2),n.push({id:m.id,firstName:m.firstName,lastName:m.lastName,countryCode:m.nationality??null,isSprinter:f,multiplier:v,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const m=n.filter(y=>y.isSprinter).reduce((y,v)=>y+v.multiplier,0),u=n.filter(y=>!y.isSprinter).reduce((y,v)=>y+v.multiplier,0);let f=0,g=0;m>0&&u>0?(f=i/(2.125*m+u),g=2.125*f,f=Math.max(.1,Math.min(.3,f)),g=Math.max(.25,Math.min(.6,g))):m>0?(g=i/m,g=Math.max(.25,Math.min(.6,g)),f=g/2.125):u>0&&(f=i/u,f=Math.max(.1,Math.min(.3,f)),g=2.125*f);for(const y of n)y.contribution=y.isSprinter?g*y.multiplier:f*y.multiplier;const b=n.reduce((y,v)=>y+v.contribution,0);if(b>0){const y=i/b;for(const v of n)v.contribution*=y}n.sort((y,v)=>v.contribution-y.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),d=n.map(m=>{const u=at(Lt(m.id)??m.countryCode),f=m.firstName?`${m.firstName.charAt(0)}. ${m.lastName}`:m.lastName,g=m.contribution.toFixed(2).replace(".",",");return`
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
        ${d}
      </div>
    </div>
  `}function Gn(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function Da(e){var m,u,f,g,b,y,v,x,M,T;if(e==null||!c.stageResults)return"";const t=gt(c.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,r=c.stageResults.classifications,s=(u=(m=r.find($=>$.resultTypeId===Na))==null?void 0:m.rows.find($=>$.rank===1))==null?void 0:u.riderId,n=(g=(f=r.find($=>$.resultTypeId===Fr))==null?void 0:f.rows.find($=>$.rank===1))==null?void 0:g.riderId,i=(y=(b=r.find($=>$.resultTypeId===ii))==null?void 0:b.rows.find($=>$.rank===1))==null?void 0:y.riderId,o=(x=(v=r.find($=>$.resultTypeId===5))==null?void 0:v.rows.find($=>$.rank===1))==null?void 0:x.riderId,d=(T=(M=r.find($=>$.resultTypeId===7))==null?void 0:M.rows.find($=>$.rank===1))==null?void 0:T.riderId,l=[],p=c.selectedResultTypeId;return e===s&&(p===Na||p===1&&a||p!==1&&p!==Na)&&l.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&l.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&l.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&l.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===d&&l.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>'),l.length===0?"":`<span class="jersey-dots-wrapper">${l.join("")}</span>`}function Hn(e){if(!e)return"";let t=e;const a=[],r=[...c.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of r){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),d=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");d.test(t)&&(t=t.replace(d,l=>{const p=`__RIDER_LINK_${a.length}__`,m=Ce(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(m),p}))}let s=S(t);for(let n=0;n<a.length;n++)s=s.replace(`__RIDER_LINK_${n}__`,a[n]);return s}function xe(){var N,E,O,z;c.riders.length===0&&V.getRiders().then(k=>{k.success&&k.data&&(c.riders=k.data,xe())});const e=h("results-race-select"),t=h("results-stage-select"),a=h("results-type-tabs"),r=h("results-marker-tabs"),s=h("results-stage-meta"),n=h("results-empty"),i=h("results-table"),o=i.querySelector("thead tr"),d=h("results-tbody"),l=h("results-marker-classifications"),p=h("results-roster"),m=i.querySelector("colgroup");m&&m.remove(),i.style.tableLayout="",c.stageResults&&(c.selectedResultsRaceId=c.stageResults.raceId,c.selectedResultsStageId=c.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+c.races.filter(k=>{var G;return(((G=k.stages)==null?void 0:G.length)??0)>0}).map(k=>`<option value="${k.id}"${k.id===c.selectedResultsRaceId?" selected":""}>${S(k.name)}</option>`).join("");const u=gt(c.selectedResultsRaceId),f=u==null?"":(u.stages??[]).map(k=>`<option value="${k.id}"${k.id===c.selectedResultsStageId?" selected":""}>${S(yp(u,k))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+f;const g=((N=c.stageResults)==null?void 0:N.classifications.filter(k=>!(u&&!u.isStageRace&&k.resultTypeId!==1&&k.resultTypeId!==6)))??[],b=g.find(k=>k.resultTypeId===c.selectedResultTypeId)??g[0]??null,y=c.selectedResultsSpecialView==="nonFinishers",v=c.selectedResultsSpecialView==="events",x=c.selectedResultsSpecialView==="roster";if(b&&!y&&!v&&!x&&(c.selectedResultTypeId=b.resultTypeId),v){i.style.tableLayout="fixed";const k=document.createElement("colgroup");k.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(k,i.firstChild)}if(!c.stageResults&&!x||!b&&!y&&!v&&!x){const k=za(c.selectedResultsStageId);s.textContent=k?`${k.race.name} · ${k.stage.profile} · ${se(k.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",r.innerHTML="",r.classList.add("hidden"),d.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),p.innerHTML="",p.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=c.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}x?c.resultsRoster&&(s.textContent=`${c.resultsRoster.raceName} · Starterfeld`):c.stageResults&&(s.textContent=`${c.stageResults.raceName} · Etappe ${c.stageResults.stageNumber} · ${c.stageResults.profile} · ${se(c.stageResults.date)}`);const M=c.stageResults?za(c.stageResults.stageId):null,T=(M==null?void 0:M.stage.distanceKm)??null,$=new Map,C=new Map,R=new Map;if(c.stageResults){const k=c.stageResults.classifications.find(G=>G.resultTypeId===1);if(k)for(const G of k.rows)G.riderId!=null&&G.points!=null&&G.points>0&&$.set(G.riderId,G.points),G.riderId!=null&&G.breakawayKms!=null&&G.breakawayKms>0&&R.set(G.riderId,G.breakawayKms);if(c.stageResults.markerClassifications){for(const G of c.stageResults.markerClassifications)if(ps(G.markerType,G.markerCategory)){for(const j of G.entries)if(j.riderId!=null&&j.pointsAwarded!=null&&j.pointsAwarded>0){const U=C.get(j.riderId)??0;C.set(j.riderId,U+j.pointsAwarded)}}}}const L=(b==null?void 0:b.resultTypeId)===Na,P=(b==null?void 0:b.resultTypeId)===Fr||(b==null?void 0:b.resultTypeId)===ii,D=(b==null?void 0:b.resultTypeId)===5,_=(b==null?void 0:b.resultTypeId)===6,H=(b==null?void 0:b.resultTypeId)===7,K=L||P||D||_||H,w=g.map(k=>`
    <button
      type="button"
      class="results-type-btn${!y&&!v&&!x&&k.resultTypeId===c.selectedResultTypeId?" active":""}"
      data-result-type-id="${k.resultTypeId}"
    >${S(k.resultTypeName)}</button>
  `),A=`
    <button
      type="button"
      class="results-type-btn${y?" active":""}"
      data-results-special-view="${go}"
    >OTL/DNF</button>
  `,Y=`
    <button
      type="button"
      class="results-type-btn${v?" active":""}"
      data-results-special-view="${fo}"
    >Ereignisse</button>
  `,W=`
    <button
      type="button"
      class="results-type-btn${x?" active":""}"
      data-results-special-view="${ho}"
    >Teilnehmer</button>
  `,re=g.findIndex(k=>k.resultTypeName.toLocaleLowerCase("de").includes("team"));re>=0?w.splice(re+1,0,A,Y,W):w.push(A,Y,W),a.innerHTML=w.join("");const q=fp(((E=c.stageResults)==null?void 0:E.markerClassifications)??[]);if(x){p.innerHTML=Sp(),p.classList.remove("hidden"),i.classList.add("hidden"),r.innerHTML="",r.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else p.innerHTML="",p.classList.add("hidden");const ee=!y&&!v&&!x&&(b==null?void 0:b.resultTypeId)===1&&q.length>0,F=ee?c.selectedResultsMarkerKey??je:null,B=ee&&F!==je?q.find(k=>k.markerKey===F)??null:null;if(ee&&(c.selectedResultsMarkerKey=(B==null?void 0:B.markerKey)??je),v){const k=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"},{key:"superteam",label:"Superteam"}];r.innerHTML=k.map(G=>`
      <button
        type="button"
        class="results-type-btn${G.key===Ie?" active":""}"
        data-event-filter="${G.key}"
      >${S(G.label)}</button>
    `).join("")}else r.innerHTML=ee?[`
        <button
          type="button"
          class="results-type-btn${c.selectedResultsMarkerKey===je?" active":""}"
          data-marker-key="${je}"
        >Tageswertung</button>`,...q.map(k=>`
        <button
          type="button"
          class="results-type-btn${k.markerKey===c.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${k.markerKey}"
        >${S(hp(k))}</button>
      `)].join(""):"";r.classList.toggle("hidden",!v&&!ee);const I=y||v||!ee||c.selectedResultsMarkerKey===je;if(o&&I&&(o.innerHTML=y?`
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
      `:L?`
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
      `:P?`
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
        <td>${il(k.isOtl)}</td>
        <td class="results-jersey-col-cell">${Yt(k.teamId,k.teamName)}</td>
        <td>${Zt(k.riderName,!0,!1,k.riderId,k.teamId)}</td>
        <td class="results-flag-col-cell">${at(k.countryCode)}</td>
        <td>${tt(k.teamName||"–",k.teamId)}</td>
        <td>${S(Pr(k.statusReason,k.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':v?[...((z=c.stageResults)==null?void 0:z.events)??[]].filter(k=>Ie==="all"?!0:Ie==="form"?!!(k.title&&(k.title.includes("guten Tag")||k.title.includes("schlechten Tag")||k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))):Ie==="attack"?(k.type==="attack"||k.type==="counter_attack")&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Ie==="breakaway"?!!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Ie==="incident"?(k.type==="incident"||!!(k.title&&k.title.includes("Massensturz")))&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Ie==="exit"?k.type==="dnf"||!!(k.title&&k.title.includes("nicht am Start")):Ie==="home"?!!(k.title&&(k.title.includes("Heimvorteil")||k.title.includes("Heimdruck"))):Ie==="weather"?!!(k.title&&k.title.startsWith("Wetterbericht:")):Ie==="superteam"?k.type==="superteam":!0).sort((k,G)=>{const j=k.kmMark??0,U=G.kmMark??0;if(Math.abs(j-U)>1e-4)return j-U;if(j===0){const Re=Gn(k),ke=Gn(G);if(Re!==ke)return Re-ke}const me=k.riderName??"",pe=G.riderName??"";return me.localeCompare(pe,"de")}).map(k=>{var Fs,Ps,Ns;const G=k.kmMark!=null?`${k.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",j=k.riderId,U=j!=null?$e(j):null,me=k.riderTeamId??(U==null?void 0:U.activeTeamId)??null,pe=me!=null?((Fs=c.teams.find(ha=>ha.id===me))==null?void 0:Fs.name)??null:null;let Re=Yt(me,pe);const ke=!!(k.title&&k.title.startsWith("Wetterbericht:"));let Xe=k.title||"";if(ke){const ha=(Ps=c.stageResults)==null?void 0:Ps.rolledWeatherId,gr=(Ns=c.stageResults)==null?void 0:Ns.rolledWetterName;Re=`<span class="results-jersey-cell">${ds(ha,gr)}</span>`,gr&&(Xe=`Wetterbericht: ${gr}`)}const jt=k.type==="superteam",He=jt&&j==null,Ot=ke||He?"":at(j!=null?Lt(j):null),fa=ke?"":He?tt(pe||"–",me):j!=null?Zt(k.riderName??"",!0,!1,j,me):S(k.riderName||"–");let ge="";return k.title&&k.title.includes("guten Tag")?ge='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':k.title&&k.title.includes("schlechten Tag")?ge='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':k.title&&(k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))?ge='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':k.title&&k.title.includes("nicht am Start")?ge='<span class="event-badge event-badge-dns">DNS</span>':k.title&&k.title.includes("Massensturz")?ge='<span class="event-badge event-badge-masscrash">Massensturz</span>':k.type==="dnf"?ge='<span class="event-badge event-badge-dnf">DNF</span>':k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))?ge='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':k.type==="attack"?ge='<span class="event-badge event-badge-attack">Attacke</span>':k.type==="counter_attack"?ge='<span class="event-badge event-badge-counter">Konterattacke</span>':k.type==="incident"?k.title&&(k.title.toLowerCase().includes("defekt")||k.title.toLowerCase().includes("panne")||k.title.toLowerCase().includes("technisch"))?ge='<span class="event-badge event-badge-defect">Defekt</span>':ge='<span class="event-badge event-badge-crash">Sturz</span>':k.title&&k.title.includes("Super-Heimvorteil")?ge='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>':k.title&&k.title.includes("Heimdruck")?ge='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>':k.title&&k.title.includes("Heimvorteil")?ge='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':k.title&&k.title.startsWith("Wetterbericht:")?ge='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>':jt&&(ge='<span class="event-badge event-badge-superteam"><span class="event-icon">⚡</span> Superteam</span>'),`
          <tr>
            <td>${G}</td>
            <td>
              <div class="event-rider-info">
                ${Re}
                ${Ot}
                ${fa}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${Hn(Xe)}</span>
                  ${ge}
                </div>
                ${k.detail?`<div class="event-detail">${Hn(k.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':I&&b?b.rows.map(k=>{const G=k.riderName??k.teamName,j=k.riderName?k.teamName:"–",U=Yt(k.teamId,k.teamName),me=Zt(G,!0,k.isBreakaway===!0,k.riderId,k.teamId),pe=at(Lt(k.riderId)),Re=b.resultTypeId===1&&k.rank===1&&k.timeSeconds!=null&&T!=null,ke=k.timeSeconds!=null?`${Ha(k.timeSeconds)}${Re?` (${bp(T,k.timeSeconds)})`:""}`:"–",Xe=K?`<td class="results-gc-delta-cell">${ol(k.previousRank,k.rankDelta)}</td>`:"";if(P){let He=k.points!=null?String(k.points):"–";if(k.points!=null&&k.riderId!=null&&b){const fa=b.resultTypeId===Fr?$.get(k.riderId)??0:C.get(k.riderId)??0;fa>0&&(He+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${fa}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Xe}
            <td class="results-jersey-col-cell">${U}</td>
            <td>${me}${Da(k.riderId)}</td>
            <td class="results-flag-col-cell">${pe}</td>
            <td>${tt(j,k.teamId)}</td>
            <td class="results-points-cell">${He}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(H){let He=k.breakawayKms!=null?`${k.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if(k.breakawayKms!=null&&k.riderId!=null){const Ot=R.get(k.riderId)??0;Ot>0&&(He+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${Ot.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Xe}
            <td class="results-jersey-col-cell">${U}</td>
            <td>${me}${Da(k.riderId)}</td>
            <td class="results-flag-col-cell">${pe}</td>
            <td>${tt(j,k.teamId)}</td>
            <td class="results-points-cell">${He}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(_)return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${Xe}
            <td class="results-jersey-col-cell">${U}</td>
            <td>${tt(k.teamName,k.teamId)}</td>
            <td class="results-flag-col-cell">${pe}</td>
            <td>${ke}</td>
            <td>${S(fr(k.gapSeconds))}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`;let jt=k.points!=null?String(k.points):"–";if(k.leadoutBonus!=null&&k.leadoutBonus>0&&k.leadoutRiderId!=null){const He=$p(k);jt=`
          <div class="leadout-bonus-anchor">
            ${k.points!=null?k.points:"–"}
            ${He}
          </div>
        `}return`
        <tr>
          <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
          ${Xe}
          <td class="results-jersey-col-cell">${U}</td>
          <td>${me}${Da(k.riderId)}</td>
          <td class="results-flag-col-cell">${pe}</td>
          <td>${tt(j,k.teamId)}</td>
          <td>${ke}</td>
          <td>${S(fr(k.gapSeconds))}</td>
          <td class="results-points-cell">${jt}</td>
          <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
        </tr>`}).join(""):"",n.classList.toggle("hidden",!!b||y||v||x),i.classList.toggle("hidden",!I||x),B){const k=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${S(ll(B.markerType,B.markerLabel))}</h4>
          <div class="results-marker-card-meta">${S(`${B.kmMark.toFixed(1).replace(".",",")} km${B.markerCategory?` · Kat. ${B.markerCategory}`:""}`)}</div>
        </div>
      </section>`,G=B.entries.map(j=>{var Re;const U=$e(j.riderId),me=U?`${U.firstName} ${U.lastName}`:`Fahrer ${j.riderId}`,pe=(U==null?void 0:U.activeTeamId)!=null?((Re=c.teams.find(ke=>ke.id===U.activeTeamId))==null?void 0:Re.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${j.rank}.</div>
          <div class="results-marker-jersey">${Yt(U==null?void 0:U.activeTeamId,pe)}</div>
          <div class="results-marker-name">${Zt(me,!1,!1,(U==null?void 0:U.id)??null,(U==null?void 0:U.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${at(Lt(U==null?void 0:U.id))}</div>
          <div class="results-marker-time">${S(Ha(j.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${S(fr(j.gapSeconds))}</div>
          <div class="results-marker-points">${j.pointsAwarded!=null&&j.pointsAwarded>0?j.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${k}<div class="results-marker-list">${G}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!B)}function xp(){h("results-race-select").addEventListener("change",e=>{var r,s;const t=e.target.value;c.selectedResultsRaceId=t?Number(t):null;const a=gt(c.selectedResultsRaceId);c.selectedResultsStageId=((s=(r=a==null?void 0:a.stages)==null?void 0:r[0])==null?void 0:s.id)??null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=je,c.selectedResultsSpecialView=null,c.stageResults=null,xe(),c.selectedResultsStageId!=null&&Hr(c.selectedResultsStageId,!0)}),h("results-stage-select").addEventListener("change",e=>{const t=e.target.value;c.selectedResultsStageId=t?Number(t):null,c.selectedResultTypeId=1,c.selectedResultsMarkerKey=je,c.selectedResultsSpecialView=null,c.stageResults=null,xe(),c.selectedResultsStageId!=null&&Hr(c.selectedResultsStageId,!0)}),h("results-type-tabs").addEventListener("click",e=>{var r;const t=e.target.closest("button[data-result-type-id]");if(t){c.selectedResultsSpecialView=null,c.selectedResultTypeId=Number(t.dataset.resultTypeId),xe();return}const a=e.target.closest("button[data-results-special-view]");if(a){const s=a.dataset.resultsSpecialView;s===go?(c.selectedResultsSpecialView="nonFinishers",xe()):s===fo?(c.selectedResultsSpecialView="events",Ie="all",xe()):s===ho&&(c.selectedResultsSpecialView="roster",c.selectedResultsRaceId!=null&&((r=c.resultsRoster)==null?void 0:r.raceId)!==c.selectedResultsRaceId&&bo(c.selectedResultsRaceId).then(()=>xe()),xe())}}),h("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const r=t.dataset.markerKey;c.selectedResultsMarkerKey=r??je,xe();return}const a=e.target.closest("button[data-event-filter]");a&&(Ie=a.dataset.eventFilter??"all",xe())})}const gs=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],ma=["skills","form","profile","preferences"],fs=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],hs={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...gs.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function bs(){return[...fs,...hs[c.teamDetailPage]]}function yo(e,t=12){const a=c.riders.filter(s=>s.activeTeamId===e).sort((s,n)=>n.overallRating-s.overallRating).slice(0,t);return a.length===0?null:a.reduce((s,n)=>s+n.overallRating,0)/a.length}function vo(e){const t=c.riders.filter(r=>r.activeTeamId===e);return t.length===0?null:t.reduce((r,s)=>r+s.overallRating,0)/t.length}function So(e){const t=yo(e);return t==null?"–":t.toFixed(1).replace(".",",")}function ko(e){const t=vo(e);return t==null?"–":t.toFixed(1).replace(".",",")}function ae(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function Te(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:ae(e,t)}function fe(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function we(e){return e==null?void 0:typeof e=="string"?Qt(e):e.name}function ys(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...gs.map(t=>t.key)].includes(e)?"desc":"asc"}function $o(e){return c.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function xo(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=c.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${$o(e.sortKey)}
      </button>
    </th>`}function To(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${ma.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const wo={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function vs(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":wo[e]??String(e)}function Mo(e){const t=[...e],a=c.teamTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(c.teamTableSort.key){case"name":n=ae(r.lastName,s.lastName)||ae(r.firstName,s.firstName);break;case"countryCode":n=ae(wt(r),wt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=ae(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=ae(pt(r),pt(s));break;case"riderType":n=ae(r.riderType,s.riderType)||ae(Fe(r),Fe(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Te(we(r.specialization1),we(s.specialization1));break;case"specialization2":n=Te(we(r.specialization2),we(s.specialization2));break;case"specialization3":n=Te(we(r.specialization3),we(s.specialization3));break;case"peak1":n=Te(fe(r,0),fe(s,0));break;case"peak2":n=Te(fe(r,1),fe(s,1));break;case"peak3":n=Te(fe(r,2),fe(s,2));break;default:n=r.skills[c.teamTableSort.key]-s.skills[c.teamTableSort.key];break}return n===0&&(n=ae(r.lastName,s.lastName)||ae(r.firstName,s.firstName)),n*a}),t}function Ro(e){const t=[...e],a=c.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((r,s)=>{let n=0;switch(c.riderMenuTableSort.key){case"name":n=ae(r.lastName,s.lastName)||ae(r.firstName,s.firstName);break;case"countryCode":n=ae(wt(r),wt(s));break;case"birthYear":n=r.birthYear-s.birthYear;break;case"age":n=(r.age??0)-(s.age??0);break;case"overallRating":n=r.overallRating-s.overallRating;break;case"potOverall":n=(r.potential??0)-(s.potential??0);break;case"formBonus":n=(r.formBonus??0)-(s.formBonus??0);break;case"raceFormBonus":n=(r.raceFormBonus??0)-(s.raceFormBonus??0);break;case"longTermFatigueMalus":n=(r.longTermFatigueMalus??0)-(s.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(r.shortTermFatigueMalus??0)-(s.shortTermFatigueMalus??0);break;case"seasonPoints":n=(r.seasonPoints??0)-(s.seasonPoints??0);break;case"seasonRaceDays":n=(r.seasonRaceDays??0)-(s.seasonRaceDays??0);break;case"seasonWins":n=(r.seasonWins??0)-(s.seasonWins??0);break;case"contractEndSeason":n=(r.contractEndSeason??Number.MAX_SAFE_INTEGER)-(s.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=ae(r.seasonFormPhase??"neutral",s.seasonFormPhase??"neutral");break;case"roleName":n=ae(pt(r),pt(s));break;case"riderType":n=ae(r.riderType,s.riderType)||ae(Fe(r),Fe(s));break;case"skillDevelopment":n=(r.skillDevelopment??0)-(s.skillDevelopment??0);break;case"specialization1":n=Te(we(r.specialization1),we(s.specialization1));break;case"specialization2":n=Te(we(r.specialization2),we(s.specialization2));break;case"specialization3":n=Te(we(r.specialization3),we(s.specialization3));break;case"peak1":n=Te(fe(r,0),fe(s,0));break;case"peak2":n=Te(fe(r,1),fe(s,1));break;case"peak3":n=Te(fe(r,2),fe(s,2));break;default:n=r.skills[c.riderMenuTableSort.key]-s.skills[c.riderMenuTableSort.key];break}return n===0&&(n=ae(r.lastName,s.lastName)||ae(r.firstName,s.firstName)),n*a}),t}function zr(e){return e.length===0?"–":e.map(t=>{const a=c.races.find(r=>r.id===t);return a?S(a.name):`Rennen ${t}`}).join(", ")}function Tp(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function Ss(e,t){var a,r;switch(t.id){case"name":return`<td class="team-table-name-cell">${Ce(Fe(e),{riderId:e.id,teamId:e.activeTeamId,strong:c.teamDetailPage==="form"||c.teamDetailPage==="profile"||c.teamDetailPage==="preferences"})}${fl(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${ie(wt(e))}<span>${S(wt(e))}</span></span></td>`;case"age":return`<td>${e.age??(c.gameState?c.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${S(pt(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${Gs(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${pl(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${Gs((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${Hs(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${Hs(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${mi(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${S(fe(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${S(fe(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${S(fe(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${S(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?S(Qt(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?S(Qt(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?S(Qt(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${gl(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${ie(e.mentorCountryCode??"UNK")} <span>${S(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${zr(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${zr(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const s=t.sortKey;return s&&s in e.skills?`<td>${ml(e.skills[s],(a=e.yearStartSkills)==null?void 0:a[s],(r=e.potentials)==null?void 0:r[s])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function Qa(){Se("Teams/Fahrer werden aktualisiert...");try{const e=await V.getRiders();if(e.success&&(c.riders=e.data??[]),await V.getTeams().then(t=>{t.success&&(c.teams=t.data??[])}),ve("teams")&&ks(),ve("riders")){const{renderRidersMenu:t}=await gi(async()=>{const{renderRidersMenu:a}=await Promise.resolve().then(()=>Yp);return{renderRidersMenu:a}},void 0);t()}}finally{he()}}async function wp(e={}){const t=await V.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),h("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${S(t.error??"Unbekannt")}</p>`;return}c.teams=t.data??[],e.render!==!1&&ve("teams")&&ks()}function ks(){const e=h("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+c.teams.map(r=>`<option value="${r.id}"${String(r.id)===t?" selected":""}>${S(r.name)} (${S(r.division??r.divisionName??"")}) · ${S(r.abbreviation)}</option>`).join("");const a=t?Number(t):null;ra(a)}function ra(e){const t=h("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=c.teams.find(i=>i.id===e);if(!a){t.innerHTML="";return}const r=Mo(c.riders.filter(i=>i.activeTeamId===e)),s=a.division==="U23"?"badge-u23":"badge-classics",n=bs();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${S(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${s}">${S(a.division??a.divisionName??"")}</span>
          <span>${dl(a.country,a.countryCode)}</span>
          <span>Kürzel: ${S(a.abbreviation)} · Top 12 ${S(So(a.id))} (${S(ko(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(vs(c.teamTableSort.key))} ${c.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${To()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${n.map(xo).join("")}
          </tr></thead>
          <tbody>
            ${r.length===0?`<tr><td colspan="${n.length}" class="text-muted">Keine Fahrer.</td></tr>`:r.map(i=>`
                <tr class="team-detail-row">
                  ${n.map(o=>Ss(i,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function Io(){h("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;c.teamDetailPage="skills",ra(t?Number(t):null)}),h("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&ws(s);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const s=a.dataset.teamDetailPage;if(ma.includes(s)){c.teamDetailPage=s,new Set(bs().map(o=>o.sortKey).filter(o=>o!=null)).has(c.teamTableSort.key)||(c.teamTableSort={key:"name",direction:"asc"});const i=Number(h("teams-dropdown").value);ra(Number.isFinite(i)?i:null)}return}const r=e.target.closest("button[data-team-sort]");if(r){const s=r.dataset.teamSort;c.teamTableSort.key===s?c.teamTableSort.direction=c.teamTableSort.direction==="asc"?"desc":"asc":c.teamTableSort={key:s,direction:ys(s)};const n=Number(h("teams-dropdown").value);ra(Number.isFinite(n)?n:null);return}})}const Mp=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:hs,TEAM_DETAIL_PAGE_ORDER:ma,TEAM_SKILL_COLUMNS:gs,TEAM_SKILL_TITLES:wo,TEAM_TABLE_COLUMNS:fs,compareOptionalStrings:Te,compareStrings:ae,formatTeamAverage:ko,formatTeamTopAverage:So,getActiveTeamTableColumns:bs,getDefaultTeamSortDirection:ys,getPeakDate:fe,getSortIndicator:$o,getSpecializationSortLabel:we,getTeamAverage:vo,getTeamSortLabel:vs,getTeamTopAverage:yo,initTeamsListeners:Io,loadTeams:wp,refreshTeamsViewData:Qa,renderPeakDatesSummary:Tp,renderRacePrefs:zr,renderTeamDetail:ra,renderTeamDetailPageTabs:To,renderTeamTableCell:Ss,renderTeamTableHeader:xo,renderTeams:ks,sortRiderMenuRiders:Ro,sortTeamRiders:Mo},Symbol.toStringTag,{value:"Module"}));function Rp(e,t,a){return`${e} · Etappe ${t} · ${a}`}function Eo(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function Co(e,t){const a=[];for(const r of e.riders)if(r.leadoutBonus!=null&&r.leadoutBonus>0&&r.leadoutContributions&&r.leadoutContributions.length>0){const s=t.riders.find(i=>i.id===r.riderId),n=(s==null?void 0:s.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:r.riderId,leadoutBonus:r.leadoutBonus,contributorsJson:JSON.stringify(r.leadoutContributions)})}return a}async function Fo(e,t=!1){if(si!=null||Yr)return!1;Ds(e),ul(0);try{const a=await V.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const r=a.data;c.realtimeBootstrap=r;const s=await fc(r,o=>di(o)),n=Eo(s,r),i=Co(s,r);return await _o(e,n,s.markerClassifications,s.incidents,s.allEvents,t,i,s.superTeamId),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{Ds(null),he()}}function Po(e){var r;const t=(r=c.rosterEditor)==null?void 0:r.teams.find(s=>s.team.id===e);if(!t)return 0;const a=new Set(c.rosterEditorSelectedRiderIds);return t.riders.filter(s=>a.has(s.rider.id)).length}function No(){return c.rosterEditor?c.rosterEditor.teams.every(e=>Po(e.team.id)===e.riderLimit):!1}function Mr(){const e=h("roster-editor-title"),t=h("roster-editor-meta"),a=h("roster-editor-body"),r=h("btn-apply-roster-editor"),s=c.rosterEditor;if(!s){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',r.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=s.race.isStageRace?`${s.race.name} · Etappe ${s.stage.stageNumber} · ${s.stage.profile}`:`${s.race.name} · ${s.stage.profile}`;const n=new Set(c.rosterEditorSelectedRiderIds);a.innerHTML=s.teams.map(i=>{const o=Po(i.team.id),d=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${S(i.team.name)}</h3>
            <p class="text-muted">${S(i.team.abbreviation)} · ${S(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${d}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var b;const m=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),u=l.rider.country?ie(l.rider.country.code3):"",f=[((b=l.rider.role)==null?void 0:b.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),g=l.lockReason?`<span class="roster-editor-rider-lock">${S(l.lockReason)}</span>`:"";return`
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
      </section>`}).join(""),r.disabled=!No()}function Kr(){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],na("roster-editor-error"),We("rosterEditor")}function Lo(e,t){c.selectedRealtimeStageId=e.stage.id,c.realtimeBootstrap=e,c.realtimeError=null,t&&It("live-race"),Do().load(e,{autoplay:!0,resetSpeed:!0}),Bt()}function Do(){let e=Xt;if(!e){const t=h("race-sim-layout"),a=h("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new gp({layout:t,emptyState:a,controlsHeader:h("race-sim-controls-header"),profile:h("race-sim-profile"),groupBox:h("race-sim-group-box"),messages:h("race-sim-messages-body"),favorites:h("race-sim-favorites-body"),sidebar:h("race-sim-sidebar-body"),controls:h("race-sim-controls"),meta:h("race-sim-stage-meta")},{onFinishRequested:(r,s)=>{const n=Eo(r,s),i=Co(r,s);_o(s.stage.id,n,r.markerClassifications,r.incidents,r.allEvents,!1,i,r.superTeamId)}}),nl(e)}return e}async function Ip(e){Se("Starterfeld wird geladen..."),na("roster-editor-error");try{const t=await V.getRosterEditor(e);if(!t.success||!t.data){kt("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),Ue("rosterEditor"),Mr();return}c.rosterEditor=t.data,c.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(r=>r.isSelected).map(r=>r.rider.id)),Mr(),Ue("rosterEditor")}catch(t){c.rosterEditor=null,c.rosterEditorSelectedRiderIds=[],kt("roster-editor-error",t.message),Ue("rosterEditor"),Mr()}finally{he()}}async function Ep(){const e=c.rosterEditor;if(e){if(!No()){kt("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}na("roster-editor-error"),Se("Starterfeld wird übernommen...");try{const t=await V.applyRosterEditor(e.stage.id,{riderIds:c.rosterEditorSelectedRiderIds});if(!t.success||!t.data){kt("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}Kr(),Lo(t.data,!0)}catch(t){kt("roster-editor-error",t.message)}finally{he()}}}function Bt(){var n,i;const e=h("race-sim-stage-select"),t=((n=c.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===c.selectedRealtimeStageId)||(c.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===c.selectedRealtimeStageId?" selected":""}>${S(Rp(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const r=t.find(o=>o.stageId===c.selectedRealtimeStageId)??null,s=Do();if(!r){c.realtimeBootstrap=null,c.realtimeError=null,s.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!c.realtimeBootstrap||c.realtimeBootstrap.stage.id!==r.stageId)&&(c.realtimeError?s.clear(c.realtimeError):s.hide())}async function Ao(e,t){if(Cr!==e){As(e),c.selectedRealtimeStageId=e,t&&It("live-race"),Bt(),Se("Live-Simulation wird geladen...");try{const a=await V.getRealtimeSimulation(e);if(!a.success||!a.data){c.realtimeBootstrap=null,c.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",Bt(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}Lo(a.data,!1)}catch(a){c.realtimeBootstrap=null,c.realtimeError=a.message,Bt(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{Cr===e&&As(null),he()}}}async function _o(e,t,a,r,s,n=!1,i,o){if(!Yr){Ls(!0),Se("Live-Ergebnis wird gespeichert...");try{const d=await V.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:r,events:s,leadoutContributions:i,superTeamId:o});if(!d.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(d.error??"Unbekannter Fehler"));return}const l=d.data;c.selectedResultsRaceId=(l==null?void 0:l.raceId)??c.selectedResultsRaceId,c.selectedResultsStageId=(l==null?void 0:l.stageId)??e,c.selectedResultTypeId=1,c.realtimeBootstrap=null,c.realtimeError=null,await Hr(e,!1),await xs(),await Ts(),await Qa(),Bt(),n||It("results")}catch(d){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+d.message)}finally{Ls(!1),he()}}}function Cp(){h("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);c.selectedRealtimeStageId=Number.isFinite(t)?t:null,c.realtimeBootstrap&&c.realtimeBootstrap.stage.id!==c.selectedRealtimeStageId&&(c.realtimeBootstrap=null),c.realtimeError=null,Ao(t,!1)})}function $s(e){var r;const t=nt((r=e.category)==null?void 0:r.name),a=rr(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function lr(e){var s,n;const t=nt((s=e.category)==null?void 0:s.name),a=rr(t),r=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${S(r)}</span>`}function Fp(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(r=>r.date).sort((r,s)=>r.localeCompare(s));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function dr(e){const{startDate:t,endDate:a}=Fp(e);return t===a?se(t):`${se(t)} - ${se(a)}`}function Pp(e){return e.stageId>0}async function xs(){const[e,t]=await Promise.all([V.getGameState(),V.getGameStatus()]);if(!e.success){console.error(e.error);return}c.gameState=e.data??null,c.gameStatus=t.success?t.data??null:null,Np(),ve("dashboard")&&cr()}function Np(){var s;if(!c.gameState)return;h("meta-date").textContent=c.gameState.formattedDate,h("meta-season").textContent=`Saison ${c.gameState.season}`;const e=h("meta-race-hint"),t=h("btn-advance-day"),a=h("pending-stages-list"),r=((s=c.gameStatus)==null?void 0:s.pendingStages)??[];r.length>0?(e.textContent=`${r.length} offene Etappe${r.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=r.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${se(n.date)}`:`${n.profile} · ${se(n.date)}`,o=Pp(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
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
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):c.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function cr(){var t,a,r,s,n;const e=c.teams.find(i=>i.isPlayerTeam)??c.teams.find(i=>{var o;return i.name===((o=c.currentSave)==null?void 0:o.teamName)})??null;h("dashboard-career").textContent=((t=c.currentSave)==null?void 0:t.careerName)??"–",h("dashboard-team").textContent=(e==null?void 0:e.name)??((a=c.currentSave)==null?void 0:a.teamName)??"–",h("dashboard-date").textContent=((r=c.gameState)==null?void 0:r.formattedDate)??"–",h("dashboard-season").textContent=c.gameState?`Saison ${c.gameState.season}`:"–",h("dashboard-races-today").textContent=String(((s=c.gameStatus)==null?void 0:s.pendingStages.length)??((n=c.gameState)==null?void 0:n.racesTodayCount)??0),_p()}async function Ts(){const e=await V.getRaces();if(!e.success){console.error(e.error);return}c.races=e.data??[],ve("dashboard")&&cr(),Lp(),Dp()}async function Lp(){var n;const e=(n=c.gameState)==null?void 0:n.season;if(!e||c.races.length===0)return;const t=`participantCountsLogged_${e}`;if(localStorage.getItem(t))return;const a=c.races.slice(0,30),r=await Promise.all(a.map(async i=>{var d;const o=await V.getRaceProgramParticipants(i.id);return{race:i,count:o.success?((d=o.data)==null?void 0:d.length)??0:-1}}));if(r.some(i=>i.count>0)){console.group(`[Velo] Teilnehmeranzahl Saison ${e}`);for(const{race:i,count:o}of r)o>=0&&console.log(`${i.name} (${i.startDate}): ${o} Programmfahrer`);console.groupEnd(),localStorage.setItem(t,"1")}}async function Dp(){var i;const e=(i=c.gameState)==null?void 0:i.season;if(!e)return;const t=`programAssignmentsLogged_${e}`;if(localStorage.getItem(t))return;const a=await V.getRiders();if(!a.success||!a.data)return;const r=a.data,s=new Map;for(const o of r)if(o.seasonProgram){const d=o.seasonProgram;s.has(d.id)||s.set(d.id,{name:d.name,riders:[]}),s.get(d.id).riders.push(o)}if(s.size===0)return;console.group(`[Velo] Programmzuweisungen Saison ${e}`);const n=Array.from(s.keys()).sort((o,d)=>o-d);for(const o of n){const d=s.get(o);console.log(`Program: ${o} - ${d.name} (Count: ${d.riders.length})`)}console.groupEnd(),localStorage.setItem(t,"1")}function Ap(e,t){const[a,r,s]=e.split("-").map(Number),n=new Date(a,r-1,s);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),d=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${d}`}function zn(e){var p,m,u,f;const t=c.gameState!=null&&e.startDate<=c.gameState.currentDate&&e.endDate>=c.gameState.currentDate,r=c.gameState!=null&&e.endDate<c.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',s=((p=e.country)==null?void 0:p.name)??`Land ${e.countryId}`,n=(m=e.country)!=null&&m.code3?ie(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.distanceKm??0),0):((u=e.upcomingStage)==null?void 0:u.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.elevationGainMeters??0),0):((f=e.upcomingStage)==null?void 0:f.elevationGainMeters)??null,d=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${se(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${S(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${$s(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${S(s)}</span></span></td>
      <td>${lr(e)}</td>
      <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${e.id}">Teilnehmer</button></td>
      <td>${d}</td>
      <td>${l}</td>
      <td>${r}</td>
    </tr>`}function _p(){const e=h("dashboard-races-tbody");if(!c.gameState){e.innerHTML='<tr><td colspan="9" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=c.gameState.currentDate,a=Ap(t,7),r=c.races.filter(i=>i.startDate<=t&&i.endDate>=t),s=c.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>In Progress</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=r.map(i=>zn(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=s.map(i=>zn(i)).join(""),e.innerHTML=n}function pa(e){return`Etappe ${e.stageNumber}`}function Bp(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,r)=>r[1]!==a[1]?r[1]-a[1]:a[0].localeCompare(r[0])).map(([a,r])=>`${r}x ${a}`).join(" · ")}function Gp(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function ga(e){return`<span class="stage-profile-badge ${Gp(e)}">${S(e)}</span>`}function ur(e,t){return`${e.name} · ${pa(t)} · ${t.profile}`}async function Hp(e){var s;const t=c.stageSummariesByStageId[e];if(t)return t;const a=await V.getStageSummary(e);if(a.success&&a.data)return c.stageSummariesByStageId[e]=a.data,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],a.data;const r=await V.getRealtimeSimulation(e);return r.success&&((s=r.data)!=null&&s.stageSummary)?(c.stageSummariesByStageId[e]=r.data.stageSummary,c.stageSummaryErrorsByStageId&&delete c.stageSummaryErrorsByStageId[e],r.data.stageSummary):(c.stageSummaryErrorsByStageId&&(c.stageSummaryErrorsByStageId[e]=a.error??r.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:r.error}),c.stageSummariesByStageId&&delete c.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function zp(){var d;const e=h("race-stages-title"),t=h("race-stages-meta"),a=h("race-stages-body"),r=gt(c.selectedDashboardRaceId);if(!r){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const s=r.stages??[],n=s.reduce((l,p)=>l+(p.distanceKm??0),0),i=s.reduce((l,p)=>l+(p.elevationGainMeters??0),0),o=Bp(s);if(e.textContent=r.name,t.textContent=`${dr(r)} · ${((d=r.country)==null?void 0:d.name)??`Land ${r.countryId}`} · ${r.isStageRace?`${r.numberOfStages} Etappen`:"Eintagesrennen"} · ${Nr(n)} · ${Lr(i)} · ${o}`,s.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
                <td>${se(l.date)}</td>
                <td><strong>${S(pa(l))}</strong></td>
                <td>${ga(l.profile)}</td>
                <td>${l.distanceKm!=null?Nr(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?Lr(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${S(ur(r,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Wr(e){gt(e)&&(c.selectedDashboardRaceId=e,zp(),Ue("raceStages"))}function Kp(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,r;return`
            <tr>
              <td>${dr(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?ie(t.country.code3):""}<span>${S(((r=t.country)==null?void 0:r.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${S(t.name)}</strong></td>
              <td>${lr(t)}</td>
              <td>${$s(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function ws(e){const t=c.riders.find(r=>r.id===e);h("rider-program-title").textContent=t?Fe(t):"Programm",h("rider-program-meta").textContent="Lade Programmrennen ...",h("rider-program-body").innerHTML="",Ue("riderProgram");const a=await V.getRiderProgramRaces(e);if(!a.success||!a.data){h("rider-program-meta").textContent="",h("rider-program-body").innerHTML=`<div class="results-empty">${S(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}h("rider-program-title").textContent=a.data.program.name,h("rider-program-meta").textContent=t?Fe(t):"",h("rider-program-body").innerHTML=Kp(a.data)}function Wp(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=jp(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${yt("Team","team","Team")}
          ${yt("Fahrer","rider","Fahrer")}
          ${yt("Spec1","spec1","Spezialisierung 1")}
          ${yt("Rolle","role","Rolle")}
          ${yt("Ges","overall","Gesamtstärke")}
          ${yt("Phase","phase","Formphase")}
          ${yt("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var r,s;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${Tt((r=a.team)==null?void 0:r.id,(s=a.team)==null?void 0:s.name)}</td>
              <td><span class="race-participant-rider-cell">${ie(wt(a.rider))}<strong>${S(Fe(a.rider))}</strong></span></td>
              <td>${S(jr(a.rider))}</td>
              <td>${S(pt(a.rider))}</td>
              <td>${ui(a.rider.overallRating)}</td>
              <td>${mi(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${S(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function yt(e,t,a){const r=c.raceParticipantsSort.key===t?" race-participants-sort-active":"",s=c.raceParticipantsSort.key===t?c.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${S(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${r}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${c.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${s}</span>
      </button>
    </th>`}function jp(e){const t=c.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>{var n,i,o,d;let s=0;switch(c.raceParticipantsSort.key){case"team":s=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=r.team)==null?void 0:i.name)??"","de");break;case"rider":s=Fe(a.rider).localeCompare(Fe(r.rider),"de");break;case"spec1":s=jr(a.rider).localeCompare(jr(r.rider),"de");break;case"role":s=pt(a.rider).localeCompare(pt(r.rider),"de");break;case"overall":s=a.rider.overallRating-r.rider.overallRating;break;case"phase":s=(a.rider.seasonFormPhase??"neutral").localeCompare(r.rider.seasonFormPhase??"neutral","de");break;default:s=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((d=r.program)==null?void 0:d.name)??"","de")}return s*t||Fe(a.rider).localeCompare(Fe(r.rider),"de")})}function jr(e){return e.specialization1!=null?Qt(e.specialization1):"–"}async function Bo(e){const t=gt(e);c.selectedRaceParticipantsRaceId=e,h("race-participants-title").textContent=(t==null?void 0:t.name)??"Teilnehmer",h("race-participants-meta").textContent="Lade Programmfahrer ...",h("race-participants-body").innerHTML="",c.raceParticipants=[],Ue("raceParticipants"),await Go()}async function Go(e=!1){const t=c.selectedRaceParticipantsRaceId;if(t==null)return;const a=gt(t);e&&(h("race-participants-meta").textContent="Lade Programmfahrer ...");const r=await V.getRaceProgramParticipants(t);if(!r.success||!r.data){h("race-participants-meta").textContent="",h("race-participants-body").innerHTML=`<div class="results-empty">${S(r.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}c.raceParticipants=r.data,h("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",h("race-participants-meta").textContent=`${r.data.length} Programmfahrer · ${a?dr(a):""}`,h("race-participants-body").innerHTML=Wp(c.raceParticipants)}async function er(e,t=null){let a=za(e);if(!a&&c.stageEditorStageRows){const n=c.stageEditorStageRows.find(i=>i.stageId===e);n&&(a={race:{id:n.raceId,name:n.raceName,countryId:0,categoryId:0,isStageRace:!0,numberOfStages:1,startDate:"",endDate:"",prestige:0},stage:{id:n.stageId,raceId:n.raceId,stageNumber:n.stageNumber,date:"2026-01-01",profile:n.profile,startElevation:0,detailsCsvFile:"",distanceKm:n.distanceKm,elevationGainMeters:n.elevationGainMeters}})}if(!a)return;const r=await Hp(e);if(!r){alert(c.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}c.selectedDashboardProfileStageId=e,h("stage-profile-title").textContent=`${a.race.name} · ${pa(a.stage)}`;const s=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";h("stage-profile-meta").textContent=`${se(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?Nr(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?Lr(a.stage.elevationGainMeters):"–"}${s}`,Nl(h("stage-profile-view"),r,a.stage.profile,ur(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),Ue("stageProfile")}function Op(){h("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const s=Number(t.dataset.editStageRoster);if(!Number.isFinite(s))return;Ip(s);return}const a=e.target.closest("button[data-live-stage]");if(a){const s=Number(a.dataset.liveStage);if(!Number.isFinite(s))return;Ao(s,!0);return}const r=e.target.closest("button[data-instant-stage]");if(r){const s=Number(r.dataset.instantStage);if(!Number.isFinite(s))return;Fo(s)}}),h("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-participants-id]");if(t){const s=Number(t.dataset.dashboardRaceParticipantsId);Number.isFinite(s)&&Bo(s);return}const a=e.target.closest("button[data-dashboard-race-id]");if(!a)return;const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&Wr(r)}),h("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&er(a)}),h("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const s=Number(t.dataset.riderProgramId);Number.isFinite(s)&&ws(s);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const r=a.dataset.raceParticipantsSort;c.raceParticipantsSort.key===r?c.raceParticipantsSort.direction=c.raceParticipantsSort.direction==="asc"?"desc":"asc":c.raceParticipantsSort={key:r,direction:"asc"},Go()}),h("btn-advance-day").addEventListener("click",async()=>{await Ho()}),h("btn-auto-progress").addEventListener("click",()=>{Vp()})}async function Ho(){Se("Tag wird fortgeschrieben...");try{const e=await V.advanceDay();if(!e.success)return alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler")),!1;if(c.currentSave&&e.data&&(c.currentSave.currentSeason=e.data.season),await xs(),await Ts(),ve("teams")){const{refreshTeamsViewData:t}=await gi(async()=>{const{refreshTeamsViewData:a}=await Promise.resolve().then(()=>Mp);return{refreshTeamsViewData:a}},void 0);await t()}return!0}catch(e){return alert("Unerwarteter Fehler beim Tageswechsel: "+e.message),!1}finally{he()}}function Ms(){const e=document.getElementById("btn-auto-progress");e&&(it?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function Vp(){it?tr():zo()}function zo(){it||(ni(!0),Ms(),Up())}function tr(){it&&(ni(!1),c.autoProgressTargetDate=null,Ms())}async function Up(){var e,t;for(;it;){const a=(e=c.gameState)==null?void 0:e.currentDate;if(c.autoProgressTargetDate&&a&&a>=c.autoProgressTargetDate){tr();break}const r=((t=c.gameStatus)==null?void 0:t.pendingStages)??[];let s=!1;if(r.length>0){const n=r[0];s=await Fo(n.stageId,!0)}else s=await Ho();if(!s){tr();break}await new Promise(n=>setTimeout(n,100))}Ms()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&it){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),tr()}});const sa=50;function Rs(){return[...fs,...hs[c.riderMenuDetailPage]]}function Ko(e){return c.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function Wo(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=c.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Ko(e.sortKey)}
      </button>
    </th>`}function jo(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${ma.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${c.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${c.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function Aa(){const e=h("riders-detail"),t=Rs(),a=Ro(c.riders),r=a.length,s=Math.max(1,Math.ceil(r/sa));c.riderMenuPage=Math.min(s,Math.max(1,c.riderMenuPage));const n=(c.riderMenuPage-1)*sa,i=Math.min(r,n+sa),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${r} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(vs(c.riderMenuTableSort.key))} ${c.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${jo()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(Wo).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(d=>`
                <tr class="team-detail-row">
                  ${t.map(l=>Ss(d,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${c.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${c.riderMenuPage} / ${s} · Fahrer ${r===0?0:n+1}-${i} von ${r}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${c.riderMenuPage>=s?"disabled":""}>Weiter</button>
      </div>
    </div>`}function Oo(){h("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&ws(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;ma.includes(n)&&(c.riderMenuDetailPage=n,new Set(Rs().map(o=>o.sortKey).filter(o=>o!=null)).has(c.riderMenuTableSort.key)||(c.riderMenuTableSort={key:"name",direction:"asc"}),c.riderMenuPage=1,Aa());return}const r=e.target.closest("button[data-riders-sort]");if(r){const n=r.dataset.ridersSort;c.riderMenuTableSort.key===n?c.riderMenuTableSort.direction=c.riderMenuTableSort.direction==="asc"?"desc":"asc":c.riderMenuTableSort={key:n,direction:ys(n)},c.riderMenuPage=1,Aa();return}const s=e.target.closest("button[data-riders-page-action]");if(s){const n=s.dataset.ridersPageAction,i=Math.max(1,Math.ceil(c.riders.length/sa));n==="prev"&&(c.riderMenuPage=Math.max(1,c.riderMenuPage-1)),n==="next"&&(c.riderMenuPage=Math.min(i,c.riderMenuPage+1)),Aa();return}})}const Yp=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:sa,getActiveRiderMenuTableColumns:Rs,getRiderMenuSortIndicator:Ko,initRidersListeners:Oo,renderRiderMenuDetailPageTabs:jo,renderRiderMenuTableHeader:Wo,renderRidersMenu:Aa},Symbol.toStringTag,{value:"Module"})),Fa=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function Je(e){return e==null?"free-agents":String(e)}function Kn(e){var a;const t=c.riderTeamEditorPayload;return t?((a=t.teams.find(r=>r.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function Zp(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return ci(t/11.2,0,100)}function Jp(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function qp(e){return c.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${c.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function Xp(e){const t=c.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${S(e.title)}"
        aria-label="${S(e.title)}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${qp(e.key)}
      </button>
    </th>`}function Qp(e,t){switch(c.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return ae(e.firstName,t.firstName);case"lastName":return ae(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return ae(Kn(e.teamId),Kn(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return ae(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return ae(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function eg(e){const t=c.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,r)=>(Qp(a,r)||ae(a.lastName,r.lastName)||ae(a.firstName,r.firstName)||a.riderId-r.riderId)*t)}function tg(e){const t=c.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(r=>Je(r.teamId)===t);return eg(a)}function ag(e){const t=c.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${Je(a.teamId)}"${a.teamId===e?" selected":""}>${S(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function Vo(e){return c.riderTeamEditorDirtyRiderIds.includes(e)}function rg(e,t){const a=Vo(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${Jr(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${ag(e.teamId)}</select></td>`;case"number":{const r=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${r}"></td>`}case"text":{const r=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${S(r)}"></td>`}default:return"<td>–</td>"}}function sg(e){const t=[...e.teams].sort((a,r)=>a.rank-r.rank||ae(a.name,r.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${c.riderTeamEditorSelectedTeamKey===Je(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${Je(a.teamId)}">
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
    </aside>`}function Le(){var o;const e=h("rider-team-editor-root"),t=h("rider-team-editor-meta"),a=c.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const r=c.riderTeamEditorSelectedTeamKey?a.teams.find(d=>Je(d.teamId)===c.riderTeamEditorSelectedTeamKey)??null:null,s=tg(a),n=c.riderTeamEditorDirtyRiderIds.length,i=r==null?"Kein Team gewählt":`${r.riderCount} Fahrer · Ø ${r.averageOverall!=null?r.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${r.rank}`;t.textContent=r==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${r.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${c.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(d=>`
                  <option value="${Je(d.teamId)}"${c.riderTeamEditorSelectedTeamKey===Je(d.teamId)?" selected":""}>${S(d.name)} (${d.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${S(c.riderTeamEditorSort.key==="teamName"?"Team":((o=Fa.find(d=>d.key===c.riderTeamEditorSort.key))==null?void 0:o.title)??c.riderTeamEditorSort.key)} ${c.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${Fa.map(Xp).join("")}
                </tr>
              </thead>
              <tbody>
                ${s.length===0?`<tr><td colspan="${Fa.length}" class="text-muted">${c.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:s.map(d=>`
                    <tr class="team-detail-row${Vo(d.riderId)?" rider-team-editor-row-dirty":""}">
                      ${Fa.map(l=>rg(d,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${sg(a)}
    </div>`}function ng(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),d=o.length===0?null:Math.round(o.reduce((l,p)=>l+p.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:d,rank:0}}),r=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:r.length,averageOverall:r.length===0?null:Math.round(r.reduce((i,o)=>i+o.overallRating,0)/r.length*100)/100,rank:0,isFreeAgents:!0});const s=[...a].sort((i,o)=>{const d=i.averageOverall??-1;return(o.averageOverall??-1)-d||o.riderCount-i.riderCount||ae(i.name,o.name)}),n=new Map(s.map((i,o)=>[Je(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(Je(i.teamId))??a.length}))}async function Uo(e=!1){if(c.riderTeamEditorPayload&&!e){Le();return}h("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await V.getRiderTeamEditor();if(!t.success||!t.data){h("rider-team-editor-root").innerHTML=`<div class="results-empty">${S(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}c.riderTeamEditorPayload=t.data,c.riderTeamEditorDirtyRiderIds=[],c.riderTeamEditorSaving=!1,c.riderTeamEditorExporting=!1,c.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(r=>Je(r.teamId)===c.riderTeamEditorSelectedTeamKey)||(c.riderTeamEditorSelectedTeamKey="")),Le()}function ig(e,t,a){const r=c.riderTeamEditorPayload;if(!r)return;const s=r.riders.find(n=>n.riderId===e);s&&(t==="teamId"?s.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof s[t]=="number"?s[t]=Number.parseInt(a||"0",10):s[t]=a,s.overallRating=Zp(s),r.teams=ng(r),c.riderTeamEditorDirtyRiderIds.includes(e)||(c.riderTeamEditorDirtyRiderIds=[...c.riderTeamEditorDirtyRiderIds,e]),Le())}async function og(){if(!c.riderTeamEditorPayload||c.riderTeamEditorSaving)return;c.riderTeamEditorSaving=!0,Le();const e=await V.saveRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Le();return}c.riderTeamEditorPayload=e.data,c.riderTeamEditorDirtyRiderIds=[],Le()}async function lg(){if(!c.riderTeamEditorPayload||c.riderTeamEditorExporting)return;c.riderTeamEditorExporting=!0,Le();const e=await V.exportRiderTeamEditor({riders:c.riderTeamEditorPayload.riders});if(c.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Le();return}Dr(e.data.fileName,e.data.content),Le()}function dg(){h("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const s=t.dataset.riderTeamEditorSort;c.riderTeamEditorSort.key===s?c.riderTeamEditorSort.direction=c.riderTeamEditorSort.direction==="asc"?"desc":"asc":c.riderTeamEditorSort={key:s,direction:Jp(s)},Le();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){c.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Le();return}const r=e.target.closest("button[data-rider-team-editor-action]");if(r){const s=r.dataset.riderTeamEditorAction;if(s==="reload"){Uo(!0);return}if(s==="export"){lg();return}s==="save"&&og()}}),h("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){c.riderTeamEditorSelectedTeamKey=t.value,Le();return}const a=e.target.closest(".rider-team-editor-input");if(a){const r=Number(a.dataset.riderTeamEditorRiderId),s=a.dataset.riderTeamEditorField;Number.isFinite(r)&&s&&ig(r,s,a.value)}})}let et={key:"pickNumber",asc:!0};function Wn(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),r=.26+t*.18,s=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${r};--rider-stats-pill-bg-alpha:${s};`}async function Yo(e,t=!1){const a=await V.getDraftHistory(e);if(!a.success){c.draftHistory=null,ve("draft")&&Or(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}c.draftHistory=a.data??null,ve("draft")&&Or()}function Or(){const e=h("draft-table-container"),t=h("draft-season-select");if(!c.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const i=c.currentSave.startSeason??2026;for(let o=c.currentSave.currentSeason;o>=i;o--){const d=document.createElement("option");d.value=o.toString(),d.textContent=`Saison ${o}`,t.appendChild(d)}c.draftSelectedSeason||(c.draftSelectedSeason=c.currentSave.currentSeason),t.value=c.draftSelectedSeason.toString(),t.onchange=o=>{const d=o.target;c.draftSelectedSeason=parseInt(d.value,10),Yo(c.draftSelectedSeason)}}if(!c.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(c.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...c.draftHistory.rows].sort((i,o)=>{let d=0;const l=et.key;return l==="riderLastName"?d=i.riderLastName.localeCompare(o.riderLastName):l==="teamName"?d=i.teamName.localeCompare(o.teamName):l==="oldTeamName"?d=(i.oldTeamName||"").localeCompare(o.oldTeamName||""):l==="countryCode"?d=i.countryCode.localeCompare(o.countryCode):d=(i[l]??0)-(o[l]??0),et.asc?d:-d}),r=i=>et.key!==i?'<span class="sort-icon-placeholder"></span>':et.asc?" ▲":" ▼",s=i=>{et.key===i?et.asc=!et.asc:(et.key=i,et.asc=!0),Or()};window.setDraftSort=s;let n=`
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
  `;for(const i of a){const o=c.draftHistory.season-i.riderBirthYear;let d="-";i.oldTeamName&&(d=`<div style="display:flex; align-items:center; gap:0.5rem;">${Tt(i.oldTeamId,i.oldTeamName)} ${S(i.oldTeamName)}</div>`);const l=`<div style="display:flex; align-items:center; gap:0.5rem;">${Tt(i.teamId,i.teamName)} ${S(i.teamName)}</div>`;n+=`
      <tr>
        <td class="text-center">#${i.pickNumber}</td>
        <td class="text-center">Runde ${i.draftRound}</td>
        <td>${l}</td>
        <td>${d}</td>
        <td class="text-center">${ie(i.countryCode)}</td>
        <td>${S(i.riderFirstName)} ${S(i.riderLastName)}</td>
        <td class="text-center">${o} J.</td>
        <td class="text-center">${i.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Wn(i.overallAtDraft)}">${i.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Wn(i.potOverallAtDraft)}">${i.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}n+="</tbody></table>",e.innerHTML=n}async function cg(e=!1){const t=await V.getInjuries();if(!t.success){c.injuries=null,ve("injuries")&&jn(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}c.injuries=t.data??[],ve("injuries")&&jn()}function jn(){const e=h("injuries-table-container");if(!c.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(h("injuries-meta").textContent=c.injuries.length+" Ausfälle",c.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=Kt;let t="";const a=c.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),r=new Map;for(const n of a){const i=n.teamId;r.has(i)||r.set(i,[]),r.get(i).push(n)}for(const n of r.keys())r.get(n).sort((i,o)=>o.overallRating-i.overallRating);const s=Array.from(r.keys()).sort((n,i)=>{const o=r.get(n)[0].teamAbbreviation||"",d=r.get(i)[0].teamAbbreviation||"";return o.localeCompare(d)});if(s.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of s){const i=r.get(n),o=i[0].teamAbbreviation;t+=`
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
      `;for(const d of i){const l=d.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let p="";if(d.fitDate){const m=se(d.fitDate);if(d.missedRaces&&d.missedRaces.length>0){let u="";for(const f of d.missedRaces)u+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${se(f.startDate)}</span>
                  ${ie(f.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${S(f.name)}</strong>
                  ${cs(f.categoryName)}
                </div>
              `;p=`
              <div class="injury-fit-cell">
                <strong>${m}</strong>
                <div class="injury-fit-tooltip">
                  <div style="margin-bottom: 0.4rem; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.2rem;">Verpasste Rennen (${d.missedRaces.length})</div>
                  ${u}
                </div>
              </div>
            `}else p=`<strong>${m}</strong>`}else p="Unbekannt";t+=`
          <tr>
            <td>${ie(d.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${d.riderId})" style="color: inherit; text-decoration: none;"><strong>${S(d.riderFirstName)} ${S(d.riderLastName)}</strong></a></td>
            <td>${d.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${po(d.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${d.unavailableDays} Tage</strong></td>
            <td>${p}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function On(e){return e===0?"–":`-${e}`}function ug(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${at(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Ce(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function mg(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${S(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${ug(e.topRiders)}
      </div>
    </div>`}function pg(e,t){const a=t.filter(r=>r.teamId!=null&&e.teamId!=null&&r.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${at(r.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Ce(r.riderName??"–",{riderId:r.riderId,teamId:r.teamId,strong:!1})}</span>
          <strong>${r.points}</strong>
        </div>
      `).join("")}
    </div>`}function gg(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${tt(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${pg(e,t)}
      </div>
    </div>`}async function fg(e){const t=await V.getSeasonStandings();if(!t.success){c.seasonStandings=null,ve("season-standings")&&Vr();return}c.seasonStandings=t.data??null,ve("season-standings")&&Vr()}function Vr(){var g,b,y,v,x,M;const e=h("season-standings-meta"),t=h("season-standings-scope-tabs"),a=h("season-standings-empty"),r=h("season-standings-table"),s=h("season-standings-tbody"),n=h("season-standings-jersey-header"),i=h("season-standings-primary-header"),o=h("season-standings-flag-header"),d=h("season-standings-secondary-header"),l=((g=c.seasonStandings)==null?void 0:g.season)??((b=c.gameState)==null?void 0:b.season)??((y=c.currentSave)==null?void 0:y.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.",t.innerHTML=`
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
  `;const p=c.selectedSeasonStandingScope==="countries",m=p?((v=c.seasonStandings)==null?void 0:v.countryStandings)??[]:c.selectedSeasonStandingScope==="teams"?((x=c.seasonStandings)==null?void 0:x.teamStandings)??[]:((M=c.seasonStandings)==null?void 0:M.riderStandings)??[],u=p?m:[],f=p?[]:m;if(n.textContent="Trikot",i.textContent=p?"Land":c.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",d.textContent=c.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",p),d.classList.toggle("hidden",p),!c.seasonStandings||m.length===0){s.innerHTML="",r.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}s.innerHTML=p?u.map(T=>`
      <tr>
        <td class="pos-${Math.min(T.rank,3)}">${T.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${mg(T)}</td>
        <td class="results-flag-col-cell">${at(T.countryCode)}</td>
        <td class="hidden"></td>
        <td>${T.points}</td>
        <td>${S(On(T.gapPoints))}</td>
      </tr>`).join(""):f.map(T=>{var D;const $=T.riderName??T.teamName,C=Yt(T.teamId,T.teamName),R=c.selectedSeasonStandingScope==="teams"?gg(T,((D=c.seasonStandings)==null?void 0:D.riderStandings)??[]):Zt($,!0,!1,T.riderId,T.teamId),L=at(T.countryCode),P=c.selectedSeasonStandingScope==="teams"?S(T.countryName??T.countryCode??"–"):tt(T.teamName??"–",T.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(T.rank,3)}">${T.rank}</td>
          <td class="results-jersey-col-cell">${C}</td>
          <td>${R}</td>
          <td class="results-flag-col-cell">${L}</td>
          <td>${P}</td>
          <td>${T.points}</td>
          <td>${S(On(T.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),r.classList.remove("hidden")}function hg(){h("season-standings-scope-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-season-scope]");if(!t)return;const a=t.dataset.seasonScope;a!=="riders"&&a!=="teams"&&a!=="countries"||(c.selectedSeasonStandingScope=a,Vr())})}function Vn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function bg(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,r=[...e].map(l=>({rider:l,score:t(l)})).sort((l,p)=>p.score-l.score).slice(0,10),s=[...e].map(l=>({rider:l,score:a(l)})).sort((l,p)=>p.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,p)=>p.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,p)=>p.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,p)=>p.score-l.score).slice(0,10),d=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,p)=>p.score-l.score).slice(0,10);return{Gesamtklassement:r,Sprinter:s,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:d}}function yg(e,t){const a=c.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const r=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,s=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>r(o)):t==="Sprinter"?n=a.map(o=>s(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,d)=>d-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,d)=>o+d,0)/i.length}function vg(e,t){var i;const r=c.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:yg(o.id,t)}));r.sort((o,d)=>d.avgScore-o.avgScore);const s=r.findIndex(o=>o.teamId===e)+1,n=((i=r.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:s,total:r.length,average:n}}function Sg(e){const t=c.riders.filter(s=>s.activeTeamId===e);if(t.length===0)return 0;const a=t.map(s=>s.overallRating??0);a.sort((s,n)=>n-s);const r=a.slice(0,10);return r.length===0?0:r.reduce((s,n)=>s+n,0)/r.length}function kg(e){var n;const a=c.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:Sg(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const r=a.findIndex(i=>i.teamId===e)+1,s=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:r,total:a.length,average:s}}function Pa(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function Rr(e){e.countryCode&&ie(e.countryCode);const t=bg(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,p)=>p.formValue-l.formValue).slice(0,10),r=[...e.riders].map(l=>({rider:l,uciRank:Xa(l.id)})).filter(l=>l.uciRank!==null).sort((l,p)=>l.uciRank-p.uciRank).slice(0,10),s=Object.entries(t).map(([l,p])=>{const m=vg(e.teamId,l),u=m.average.toFixed(1).replace(".",","),f=p.map(({rider:g,score:b})=>{const y=`${g.firstName.charAt(0)}. ${g.lastName}`,v=Ce(y,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),x=g.nationality?Oe[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,M=x?`<span class="fi fi-${x} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",T=c.riders.find(C=>C.id===g.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${Pa((T==null?void 0:T.roleId)??null).color};">
            ${M}
            ${v}
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
    `}).join(""),i=[...e.riders].sort((l,p)=>(p.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const p=`${l.firstName.charAt(0)}. ${l.lastName}`,m=Ce(p,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),u=l.nationality?Oe[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=u?`<span class="fi fi-${u} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",g=l.overallRating.toFixed(0),b=c.riders.find(v=>v.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Pa((b==null?void 0:b.roleId)??null).color};">
          ${f}
          ${m}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:p})=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Ce(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?Oe[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",b=(p>=0?"+":"")+p.toFixed(1).replace(".",","),y=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,v=c.riders.find(M=>M.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Pa((v==null?void 0:v.roleId)??null).color};">
          ${g}
          ${u}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${y}">${b}</span>
      </li>
    `}).join(""),d=r.map(({rider:l,uciRank:p})=>{const m=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Ce(m,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?Oe[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"";let b="rider-stats-rank-badge-gc";p===1?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":p===2?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":p===3&&(b="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const y=`<span class="rider-stats-rank-badge ${b}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${p}">${p}</span>`,v=c.riders.find(M=>M.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Pa((v==null?void 0:v.roleId)??null).color};">
          ${g}
          ${u}
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
  `}function Ir(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${c.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${c.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${c.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${c.teamStatsTab==="contracts"?"true":"false"}">Auslaufende Verträge</button>
    </div>`}function $g(e){const t=Array.from(new Set(e.topResults.map(u=>u.raceCategoryName).filter(Boolean)));t.sort((u,f)=>u.localeCompare(f,"de"));const a=Array.from(new Set(e.topResults.map(u=>u.season))).sort((u,f)=>f-u);let r=e.topResults.filter(u=>u.rowType!=="stage_result"?u.rowType==="gc_final"?c.teamStatsTopResultsFilters.gc:u.rowType==="mountain_final"?c.teamStatsTopResultsFilters.mountain:u.rowType==="points_final"?c.teamStatsTopResultsFilters.points:u.rowType==="youth_final"?c.teamStatsTopResultsFilters.youth:!0:u.profile==="TTT"||u.isStageRace||u.stageNumber!=null?c.teamStatsTopResultsFilters.stage:c.teamStatsTopResultsFilters.oneDay);if(c.teamStatsTopResultsFilterCategory){const u=c.teamStatsTopResultsFilterCategory;if(u.endsWith("-etappen")){const f=u.substring(0,u.length-8);r=r.filter(g=>g.raceCategoryName===f&&g.rowType==="stage_result")}else if(u.endsWith("-gc")){const f=u.substring(0,u.length-3);r=r.filter(g=>g.raceCategoryName===f&&g.rowType!=="stage_result")}else r=r.filter(f=>f.raceCategoryName===u)}c.teamStatsTopResultsFilterSeason!=null&&(r=r.filter(u=>u.season===c.teamStatsTopResultsFilterSeason)),r.sort((u,f)=>{if(f.seasonPoints!==u.seasonPoints)return f.seasonPoints-u.seasonPoints;const g=u.rowType!=="stage_result",b=f.rowType!=="stage_result",y=u.resultRank??9999,v=f.resultRank??9999;if(c.teamStatsTopResultsFilterCategory)return y!==v?y-v:g!==b?g?-1:1:0;{const x=Vn(u.raceCategoryName),M=Vn(f.raceCategoryName);return x!==M?x-M:g!==b?g?-1:1:y-v}});const s=20,n=Math.max(1,Math.min(10,Math.ceil(r.length/s)));c.teamStatsTopResultsPage>n&&(c.teamStatsTopResultsPage=n);const i=(c.teamStatsTopResultsPage-1)*s,o=r.slice(i,i+s),l=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${t.map(u=>{if(u.toLowerCase().includes("stage race")||u.toLowerCase().includes("grand tour")||u.toLowerCase().includes("tour de france")){const g=`${u}-etappen`,b=`${u}-gc`;return`
        <option value="${S(g)}" ${c.teamStatsTopResultsFilterCategory===g?"selected":""}>${S(u)} - Etappen</option>
        <option value="${S(b)}" ${c.teamStatsTopResultsFilterCategory===b?"selected":""}>${S(u)} - GC</option>
      `}else return`<option value="${S(u)}" ${c.teamStatsTopResultsFilterCategory===u?"selected":""}>${S(u)}</option>`}).join("")}
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
  `,p=o.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(u=>{const f=u.rowType!=="stage_result",g=f?`${u.raceName} · ${u.rowType==="gc_final"?"Gesamtwertung":u.rowType==="points_final"?"Punktewertung":u.rowType==="mountain_final"?"Bergwertung":"Nachwuchs"}`:u.stageNumber?`${u.raceName} · Etappe ${u.stageNumber}`:u.raceName;let b="–",y="–";u.finishStatus==="otl"?b=Rt("OTL","place"):u.finishStatus==="dnf"?b=Rt("DNF","place"):u.resultRank==null||(f?y=`<span class="rider-stats-final-type ${u.rowType==="gc_final"?"is-gc":u.rowType==="points_final"?"is-points":u.rowType==="mountain_final"?"is-mountain":"is-youth"}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${u.resultRank}</span>`:b=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${u.resultRank<=3?` rider-stats-rank-badge-top-${u.resultRank}`:""}">${S(String(u.resultRank))}</span>`);const v=u.profile?ga(u.profile):"–",x=!f&&u.stageScore!=null&&u.stageScore>0?or(u.stageScore,0,350):"–",M=qa(u.raceCategoryName),T=u.riderCountryCode?Oe[u.riderCountryCode]??u.riderCountryCode.slice(0,2).toLowerCase():null,$=T?`<span class="fi fi-${T} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(u.riderCountryCode??"")}"></span>`:"–",C=Ce(u.riderName,{riderId:u.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${b}</td>
            <td>${y}</td>
            <td>${$}</td>
            <td style="white-space: nowrap;">${C}</td>
            <td><strong>${S(g)}</strong></td>
            <td class="status-cell">${ms(u)}</td>
            <td>${v}</td>
            <td>${x}</td>
            <td>${M}</td>
            <td>Saison ${u.season}</td>
            <td><strong>${u.seasonPoints}</strong></td>
          </tr>
        `}).join(""),m=n>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${c.teamStatsTopResultsPage-1}" ${c.teamStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        ${Array.from({length:n}).map((u,f)=>{const g=f+1;return`<button type="button" class="btn btn-sm ${c.teamStatsTopResultsPage===g?"btn-primary":"btn-secondary"}" data-team-top-results-page="${g}">${g}</button>`}).join("")}
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
      ${m}
    </section>
  `}function xg(e){const t=String(c.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,superteamCount:0,categories:{}},r=t==="all",s=m=>r?m:"–",n=(m,u)=>r?`${m} / ${u} T`:"–",i=r?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(m,u,f,g)=>{const b=typeof m=="number"?m:parseFloat(String(m))||0;let y="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return b===0?y+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":u==="gold"?y+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":u==="silver"?y+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":u==="bronze"?y+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":u==="purple"?y+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":u==="green"?y+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":u==="red"?y+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":u==="white"&&(y+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${y}" title="${S(f)}: ${b} Siege">${m}</span>`},d=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #fff;">Karrierestatistiken (Team)</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="team-stats-success-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
        <select id="team-stats-success-season-select" class="form-control" style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">
          <option value="all" ${r?"selected":""}>Ewig (All-Time)</option>
          ${Object.keys(e.successStats).filter(m=>m!=="all").sort((m,u)=>u.localeCompare(m)).map(m=>`
            <option value="${m}" ${String(c.teamStatsSelectedSeason)===m?"selected":""}>Saison ${m}</option>
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
        ${d.map(m=>{const u=a.categories[m.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(m.name)}">${S(m.name)}</span>
                ${cs(m.key)}
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
                  ${ne(u.winFlat||0,"flat","Flach (Flat)")}
                  ${ne(u.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${ne(u.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${ne(u.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${ne(u.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${ne(u.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${ne(u.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${ne(u.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${ne(u.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${ne(u.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${ne(u.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
                </div>
              </div>

              <!-- Wetter Siege -->
              <div style="overflow: hidden; white-space: nowrap;">
                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 0.2rem; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Wetter Siege</div>
                <div style="display: flex; gap: 0.25rem; align-items: center; overflow: hidden; white-space: nowrap; flex-wrap: nowrap;">
                  ${ye(u.winWeather1||0,1,"Sonnig")}
                  ${ye(u.winWeather2||0,2,"Extreme Hitze")}
                  ${ye(u.winWeather3||0,3,"Leichter Regen")}
                  ${ye(u.winWeather4||0,4,"Starkregen")}
                  ${ye(u.winWeather5||0,5,"Starker Wind")}
                  ${ye(u.winWeather6||0,6,"Dichter Nebel")}
                  ${ye(u.winWeather7||0,7,"Schnee/Eis")}
                </div>
              </div>
              
              <!-- Race Days in bottom right -->
              <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 0.8rem; color: #888; white-space: nowrap;" title="Renntage in dieser Rennklasse">
                ${te.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${u.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}function Tg(e){var s;const t=((s=c.gameState)==null?void 0:s.season)??new Date().getFullYear(),a=[...e.riders].sort((n,i)=>{const o=n.contractEndSeason??9999,d=i.contractEndSeason??9999;return o!==d?o-d:i.overallRating-n.overallRating});return`
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
            ${a.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Vertragsdaten verfügbar.</td></tr>':a.map(n=>{const i=n.nationality?Oe[n.nationality]??n.nationality.slice(0,2).toLowerCase():null,o=i?`<span class="fi fi-${i} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(n.nationality)}"></span>`:"–",d=Ce(`${n.firstName} ${n.lastName}`,{riderId:n.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),l=c.riders.find(b=>b.id===n.id),p=`<span class="results-roster-overall-badge" style="color:${Un(n.overallRating)}" title="Stärke: ${n.overallRating.toFixed(2)}">${n.overallRating.toFixed(1)}</span>`;let m="–";l&&l.potential!=null&&(m=`<span class="results-roster-overall-badge" style="color:${Un(l.potential)}" title="Potential: ${l.potential.toFixed(2)}">${l.potential.toFixed(1)}</span>`);const u=n.contractEndSeason===t,f=n.contractEndSeason?`Saison ${n.contractEndSeason}`:"Ohne Vertrag",g=u?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${S(f)}</span>`:`<span style="font-weight: 500;">${S(f)}</span>`;return`
          <tr class="rider-stats-row">
            <td>${o}</td>
            <td style="white-space: nowrap;">${d}</td>
            <td>${n.age}</td>
            <td>${p}</td>
            <td>${m}</td>
            <td>${g}</td>
          </tr>
        `}).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `}function Un(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function vt(e){return c.teamStatsTab==="career"?`
      ${Rr(e)}
      ${Ir()}
      ${xg(e)}
    `:c.teamStatsTab==="contracts"?`
      ${Rr(e)}
      ${Ir()}
      ${Tg(e)}
    `:`
    ${Rr(e)}
    ${Ir()}
    ${$g(e)}
  `}function wg(e,t){var r;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((r=c.teams.find(s=>s.id===e))==null?void 0:r.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${S(a)}" aria-label="${S(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S(oi(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function Zo(e){c.teamStatsSelectedTeamId=e,c.teamStatsTab="topResults",c.teamStatsTopResultsFilterCategory=null,c.teamStatsTopResultsFilterSeason=null,c.teamStatsSelectedSeason="all",c.teamStatsTopResultsPage=1;const t=c.teams.find(n=>n.id===e);h("team-stats-title").innerHTML=t?`Team <strong>${S(t.name)}</strong>`:"Teamstatistik",h("team-stats-jersey").innerHTML=wg(e,(t==null?void 0:t.name)??"");const a=kg(e),r=a.average.toFixed(2).replace(".",",");h("team-stats-meta").innerHTML=t?`${S(t.abbreviation)} · ${S(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${r})`:"Daten werden geladen",h("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,Ue("teamStats");const s=await V.getTeamStats(e);if(c.teamStatsSelectedTeamId===e){if(!s.success||!s.data){h("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${S(s.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}c.teamStatsPayload=s.data,h("team-stats-body").innerHTML=vt(s.data)}}function Mg(){h("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-stats-tab]");if(a){const s=a.dataset.teamStatsTab;(s==="topResults"||s==="career"||s==="contracts")&&(c.teamStatsTab=s,c.teamStatsPayload&&(h("team-stats-body").innerHTML=vt(c.teamStatsPayload)));return}const r=t.closest("button[data-team-top-results-page]");if(r){const s=Number(r.dataset.teamTopResultsPage);!isNaN(s)&&s>=1&&(c.teamStatsTopResultsPage=s,c.teamStatsPayload&&(h("team-stats-body").innerHTML=vt(c.teamStatsPayload)));return}}),h("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;c.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=vt(c.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;c.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=vt(c.teamStatsPayload))}else if(t.classList.contains("team-stats-filter-checkbox")){const a=t,r=a.dataset.filterType;c.teamStatsTopResultsFilters[r]=a.checked,c.teamStatsTopResultsPage=1,c.teamStatsPayload&&(h("team-stats-body").innerHTML=vt(c.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;c.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),c.teamStatsPayload&&(h("team-stats-body").innerHTML=vt(c.teamStatsPayload))}})}let Pt="riders",st="season",Is="season",Ve="";const ar=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function Rg(){const e=h("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");Eg(o)})})}const t=h("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(d=>d.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");Cg(o)})})}ar.forEach(n=>{const i=h(n);i&&i.addEventListener("change",()=>{const o=i.value;o?Fg(o,n):ar.some(l=>{const p=h(l);return p&&p.value!==""})||(Ve="",Wt())})}),window.openRiderStatsFromLeaderboard=Kt;const a=h("leaderboard-filter-wt"),r=h("leaderboard-filter-pt"),s=h("leaderboard-filter-other");[a,r,s].forEach(n=>{n&&n.addEventListener("change",()=>{Wt()})})}function Ig(){Wt()}function Eg(e){Pt=e;const t=h("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&((Pg(Ve)||Ve==="strongest_lieutenants")&&(Ng(),Ve=""),st==="live"&&(st=Is,_a())),Wt()}function Cg(e){st=e,Is=e,Wt()}function Fg(e,t){Ve=e,ar.forEach(a=>{if(a!==t){const r=h(a);r&&(r.value="")}}),Jo(e)?(st="live",_a()):Es(e)?(st="alltime",_a()):(st=Is,_a()),Wt()}function Jo(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function Es(e){return["max_short_term_fatigue","max_long_term_fatigue","max_combined_fatigue","max_s_form","max_r_form","max_combined_form","mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function Pg(e){return Jo(e)||Es(e)||e==="mentors_ranking"}function Ng(){ar.forEach(e=>{const t=h(e);t&&(t.value="")})}function _a(){const e=h("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');st==="live"?e.style.display="none":(e.style.display="flex",Es(Ve)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),st==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function Wt(){var m,u,f;const e=h("leaderboard-empty"),t=h("leaderboard-table"),a=h("leaderboard-thead"),r=h("leaderboard-tbody");if(!e||!t||!a||!r)return;const s=h("leaderboard-filter-container");if(s&&(s.style.display=Pt==="teams"?"none":"flex"),!Ve){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await V.getLeaderboards(Pt,Ve,st);if(!ve("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(Pt==="riders"){const g=((m=h("leaderboard-filter-wt"))==null?void 0:m.checked)??!0,b=((u=h("leaderboard-filter-pt"))==null?void 0:u.checked)??!0,y=((f=h("leaderboard-filter-other"))==null?void 0:f.checked)??!1;if(i=n.data.filter(v=>{const x=v.teamDivisionId===1&&!v.isRetired,M=v.teamDivisionId===2&&!v.isRetired,T=v.teamDivisionId===null||v.teamDivisionId===void 0||v.isRetired||v.teamDivisionId!==1&&v.teamDivisionId!==2;return!!(x&&g||M&&b||T&&y)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const o=Ve==="highest_leadout_bonus",d=Ve==="strongest_lieutenants";Pt==="riders"?a.innerHTML=`
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
    `;let l="",p=1;for(const g of i){const b=p++,v=`<span class="badge ${b===1?"badge-primary":b<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${b}</span>`,x=Tt(g.teamId,g.teamName);let M="";if(o){const $=g.stageNumber!=null?`Etappe ${g.stageNumber}`:"–";M=`<td style="vertical-align: middle;">${S(g.raceName??"–")} · ${S($)} · ${S(String(g.season??"–"))}</td>`}let T="";if(d)if(g.lieutenantDetails){const $=g.lieutenantDetails,C=$.leaderNationality?ie($.leaderNationality):"",R=$.leaderRoleName?` (${$.leaderRoleName})`:"";T=`
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${C}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${$.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${S($.leaderFirstName)} ${S($.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${S(R)}</span>
            </span>
          </td>
        `}else T='<td style="vertical-align: middle;">–</td>';if(Pt==="riders"){const $=g.nationality?ie(g.nationality):"—",C=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${g.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.firstName)} ${S(g.lastName)}</a>`,R=g.teamAbbr?`<span class="text-muted" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</span>`:"—";l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${v}</td>
          <td style="text-align: center; vertical-align: middle;">${x}</td>
          <td style="text-align: center; vertical-align: middle;">${$}</td>
          <td style="vertical-align: middle;">${C}</td>
          <td style="vertical-align: middle;">${R}</td>
          ${M}
          ${T}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}else{let $="";if(g.leadoutDetails){const C=g.leadoutDetails,R=C.sprinterNationality?ie(C.sprinterNationality):"";$=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">${S(g.teamName.split(" (Sprinter:")[0])}</div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${R}${S(C.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${C.contributors.map(L=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${L.nationality?ie(L.nationality):""}${S(L.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${L.contribution.toFixed(2)})</span>
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
      `}}r.innerHTML=l}let Gt=2026,Ae=5,Yn=!1;const Lg=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function Zn(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${r}`}function Dg(e){var s;const t=(s=c.gameState)==null?void 0:s.currentDate;if(!t||e<=t)return;const a=se(e);confirm(`Möchtest du automatisch bis zum ${a} simulieren?`)&&(c.autoProgressTargetDate=e,zo())}function Ag(e,t){const a=[],r=new Date(e,t,1),s=new Date(e,t+1,0);let i=(r.getDay()+6)%7;const o=new Date(r);o.setDate(o.getDate()-i);const d=new Date(o);for(;d<=s||d.getDay()!==1;){const l=[];for(let p=0;p<7;p++)l.push(new Date(d)),d.setDate(d.getDate()+1);a.push(l)}return a}function _g(){if(Yn)return;Yn=!0,h("calendar-prev-month").addEventListener("click",()=>{Ae--,Ae<0&&(Ae=11,Gt--),Ba()}),h("calendar-next-month").addEventListener("click",()=>{Ae++,Ae>11&&(Ae=0,Gt++),Ba()}),h("calendar-today-btn").addEventListener("click",()=>{var t;if((t=c.gameState)!=null&&t.currentDate){const[a,r]=c.gameState.currentDate.split("-").map(Number);Gt=a,Ae=r-1}Ba()}),h("calendar-race-search").addEventListener("input",()=>{qo()}),h("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const s=Number(a.dataset.raceId);Number.isFinite(s)&&Wr(s);return}const r=t.target.closest("[data-calendar-date]");if(r){const s=r.dataset.calendarDate;s&&Dg(s)}}),h("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const s=Number(a.dataset.dashboardRaceId);Number.isFinite(s)&&Wr(s);return}const r=t.target.closest("button[data-dashboard-race-participants-id]");if(r){const s=Number(r.dataset.dashboardRaceParticipantsId);Number.isFinite(s)&&Bo(s)}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const r=a.dataset.raceId;r&&document.querySelectorAll(`[data-race-id="${r}"]`).forEach(s=>{s.classList.remove("calendar-highlight")})}},!0))}function Bg(){var e;if((e=c.gameState)!=null&&e.currentDate){const[t,a]=c.gameState.currentDate.split("-").map(Number);Gt=t,Ae=a-1}Ba()}function Ba(){var s;if(!ve("calendar"))return;h("calendar-month-label").textContent=`${Lg[Ae]} ${Gt}`;const e=Ag(Gt,Ae),t=h("calendar-weeks"),a=((s=c.gameState)==null?void 0:s.currentDate)??"";let r="";for(const n of e){const i=n.map(Zn),o=[];for(const m of c.races)if(m.startDate<=i[6]&&m.endDate>=i[0]){const u=m.startDate<i[0]?0:i.indexOf(m.startDate),f=m.endDate>i[6]?6:i.indexOf(m.endDate);o.push({race:m,startIdx:u,endIdx:f})}o.sort((m,u)=>{const f=m.endIdx-m.startIdx+1,g=u.endIdx-u.startIdx+1;return g!==f?g-f:m.startIdx-u.startIdx});const d=Array.from({length:3},()=>Array(7).fill(!1));for(const m of o){let u=2;for(let f=0;f<3;f++){let g=!0;for(let b=m.startIdx;b<=m.endIdx;b++)if(d[f][b]){g=!1;break}if(g){u=f;break}}for(let f=m.startIdx;f<=m.endIdx;f++)d[u][f]=!0;m.slot=u}const l=n.map(m=>{const u=Zn(m),f=m.getMonth()!==Ae,g=u===a,b=u>a;return`
        <div class="${["calendar-day-cell",f?"other-month":"",g?"today":"",b?"is-future":""].filter(Boolean).join(" ")}" data-calendar-date="${u}">
          <span class="calendar-day-number" data-calendar-date="${u}">${m.getDate()}</span>
        </div>
      `}).join(""),p=o.map(m=>{var M;const u=m.race,f=a>=u.startDate&&a<=u.endDate,g=a>u.endDate,b=nt((M=u.category)==null?void 0:M.name),y=f?'<span class="calendar-live-dot"></span>':"",v=g?"opacity: 0.55;":"",x=m.endIdx-m.startIdx+1;return`
        <div class="calendar-event-bar ${f?"is-live":""}"
             data-race-id="${u.id}"
             style="grid-column: ${m.startIdx+1} / span ${x};
                    grid-row: ${m.slot+1};
                    background-color: ${b.background};
                    border: 1px solid ${b.border};
                    color: ${b.color};
                    ${v}"
             title="${S(u.name)} (${se(u.startDate)} - ${se(u.endDate)})">
          ${y}<span class="calendar-event-name">${S(u.name)}</span>
        </div>
      `}).join("");r+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${p}</div>
      </div>
    `}t.innerHTML=r,qo()}function qo(){var n;const e=h("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=h("calendar-races-tbody"),r=((n=c.gameState)==null?void 0:n.currentDate)??"",s=c.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(s.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=s.map(i=>{var y,v,x,M;const o=r>=i.startDate&&r<=i.endDate,l=r>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',p=((y=i.country)==null?void 0:y.name)??`Land ${i.countryId}`,m=(v=i.country)!=null&&v.code3?ie(i.country.code3):"",u=i.isStageRace?(i.stages??[]).reduce((T,$)=>T+($.distanceKm??0),0):((x=i.upcomingStage)==null?void 0:x.distanceKm)??null,f=i.isStageRace?(i.stages??[]).reduce((T,$)=>T+($.elevationGainMeters??0),0):((M=i.upcomingStage)==null?void 0:M.elevationGainMeters)??null,g=u!=null?String(u.toFixed(1)).replace(".",","):"-",b=f!=null?String(Math.round(f)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${se(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${S(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${$s(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${m}<span>${S(p)}</span></span></td>
        <td>${lr(i)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${i.id}">Teilnehmer</button></td>
        <td>${g}</td>
        <td>${b}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}let ct=null,ut=null;function mr(e){const t=new Date(e);t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));const a=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t.getTime()-a.getTime())/864e5+1)/7)}function pr(e,t){if(t>=e.peak1_min&&t<=e.peak1_max||t>=e.peak2_min&&t<=e.peak2_max||t>=e.peak3_min&&t<=e.peak3_max)return"peak";const r=n=>{const i=n-8,o=n-1;if(i>=1)return t>=i&&t<=o;{const d=i+53;return t>=d||t<=o}};return r(e.peak1_min)||r(e.peak2_min)||r(e.peak3_min)?"prep":"none"}function Xo(e){return e==="peak"?"cell-peak":e==="prep"?"cell-prep":""}function Gg(e,t){const a=new Date(t.start_date),r=new Date(t.end_date);for(let s=new Date(a);s<=r;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),d=`${n}-${i}-${o}`,l=mr(d),p=pr(e,l);if(p==="peak"||p==="prep")return!0}return!1}function Hg(e,t){const a=c.raceProgramsPayload;if(!a)return;const r=a.raceProgramRaces.findIndex(s=>s.program_id===e&&s.race_id===t);r===-1?a.raceProgramRaces.push({program_id:e,race_id:t}):a.raceProgramRaces.splice(r,1),c.raceProgramsDirty=!0,Ne()}const Ur=(()=>{const e=[],t=new Date(2026,0,1),a=new Date(2026,11,31),r=["So","Mo","Di","Mi","Do","Fr","Sa"];for(let s=new Date(t);s<=a;s.setDate(s.getDate()+1)){const n=s.getFullYear(),i=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),d=`${n}-${i}-${o}`,l=`${r[s.getDay()]}, ${o}.${String(s.getMonth()+1).padStart(2,"0")}`;e.push({dateStr:d,label:l,weekNum:mr(d)})}return e})();async function Cs(e=!1){if(c.raceProgramsPayload&&!e){Ne();return}h("race-programs-root").innerHTML='<div class="results-empty">Programmdaten werden geladen...</div>';const t=await V.getRaceProgramsEditor();if(!t.success||!t.data){h("race-programs-root").innerHTML=`<div class="results-empty text-danger">${S(t.error??"Fehler beim Laden.")}</div>`;return}c.raceProgramsPayload=t.data,c.raceProgramsDirty=!1,c.raceProgramsSaving=!1,ct=null,ut=null,Ne()}function zg(){h("view-race-programs").addEventListener("click",e=>{const t=e.target,a=t.closest(".results-type-btn[data-tab]");if(a){const d=a.dataset.tab??"calendar-cols";c.raceProgramsActiveTab=d,Ne();return}const r=t.closest(".race-programs-action-btn");if(r){const d=r.dataset.action;d==="reload"?Cs(!0):d==="save"&&Og();return}const s=t.closest(".race-row-expand-btn");if(s){const d=s.dataset.raceId,l=h(`race-details-row-${d}`);l&&(l.classList.toggle("hidden"),s.textContent=l.classList.contains("hidden")?"▶":"▼");return}const n=t.closest(".race-popover-trigger");if(n){e.stopPropagation();const d=parseInt(n.dataset.raceId??"0",10);ut=null,ct===d?ct=null:ct=d,Ne();return}const i=t.closest(".race-rider-count-trigger");if(i){e.stopPropagation();const d=parseInt(i.dataset.raceId??"0",10);ct=null,ut===d?ut=null:ut=d,Ne();return}const o=t.closest(".popover-program-toggle");if(o){e.stopPropagation();const d=parseInt(o.dataset.programId??"0",10),l=parseInt(o.dataset.raceId??"0",10);Hg(d,l);return}!t.closest(".race-stages-popover-card")&&!t.closest(".race-rider-programs-popover-card")&&(ct!==null||ut!==null)&&(ct=null,ut=null,Ne())}),h("view-race-programs").addEventListener("click",e=>{const t=e.target.closest(".toggleable-race-cell[data-day]");if(!t)return;const a=t.dataset.day,r=parseInt(t.dataset.programId,10);jg(r,a)}),h("view-race-programs").addEventListener("change",e=>{const t=e.target;if(t.classList.contains("peak-date-picker")){const a=parseInt(t.dataset.programId,10),r=parseInt(t.dataset.peak,10),s=t.value;if(s){const n=mr(s);Wg(a,r,n)}return}if(t.classList.contains("peak-number-input")){const a=parseInt(t.dataset.programId,10),r=t.dataset.field,s=parseInt(t.value||"1",10);Kg(a,r,s)}})}function Kg(e,t,a){const r=c.raceProgramsPayload;if(!r)return;const s=r.programs.find(i=>i.id===e);if(!s)return;const n=Math.max(1,Math.min(53,a));if(s[t]=n,t.endsWith("_min")){const i=t.replace("_min","_max");s[i]<n&&(s[i]=n)}else if(t.endsWith("_max")){const i=t.replace("_max","_min");s[i]>n&&(s[i]=n)}c.raceProgramsDirty=!0,Ne()}function Wg(e,t,a){const r=c.raceProgramsPayload;if(!r)return;const s=r.programs.find(o=>o.id===e);if(!s)return;const n=`peak${t}_min`,i=`peak${t}_max`;s[n]=Math.max(1,a-2),s[i]=Math.min(53,a+2),c.raceProgramsDirty=!0,Ne()}function jg(e,t){const a=c.raceProgramsPayload;if(!a)return;const r=a.races.filter(n=>n.start_date<=t&&n.end_date>=t);if(r.length===0)return;const s=a.raceProgramRaces.findIndex(n=>n.program_id===e&&r.some(i=>i.id===n.race_id));if(s===-1)a.raceProgramRaces.push({program_id:e,race_id:r[0].id});else{const n=a.raceProgramRaces[s],i=r.findIndex(o=>o.id===n.race_id);i<r.length-1?n.race_id=r[i+1].id:a.raceProgramRaces.splice(s,1)}c.raceProgramsDirty=!0,Ne()}async function Og(){if(!c.raceProgramsPayload||c.raceProgramsSaving)return;c.raceProgramsSaving=!0,Ne();const e=await V.saveRaceProgramsEditor({programs:c.raceProgramsPayload.programs,raceProgramRaces:c.raceProgramsPayload.raceProgramRaces});if(c.raceProgramsSaving=!1,!e.success){alert(`Fehler beim Speichern:
${e.error??"Unbekannter Fehler"}`),Ne();return}c.raceProgramsDirty=!1,Cs(!0)}function Qo(e,t){let a=0,r=0,s=0;const n=new Set(t.raceProgramRaces.filter(o=>o.program_id===e.id).map(o=>o.race_id)),i=t.races.filter(o=>n.has(o.id));for(const o of i){const d=new Date(o.start_date),l=new Date(o.end_date);for(let p=new Date(d);p<=l;p.setDate(p.getDate()+1)){const m=p.getFullYear(),u=String(p.getMonth()+1).padStart(2,"0"),f=String(p.getDate()).padStart(2,"0"),g=mr(`${m}-${u}-${f}`),b=pr(e,g);b==="peak"?a++:b==="prep"?r++:s++}}return{peak:a,prep:r,none:s}}function Ne(){const e=h("race-programs-root"),t=c.raceProgramsPayload;if(!t){e.innerHTML='<div class="results-empty">Keine Daten geladen.</div>';return}const a=c.raceProgramsDirty,r=c.raceProgramsSaving,s=c.raceProgramsActiveTab;let n=`
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
  `;s==="calendar-cols"?n+=Vg(t):s==="calendar-rows"?n+=Ug(t):s==="peak-editor"?n+=Yg(t):s==="rider-role"?n+=Jg(t):s==="program-roles"&&(n+=qg(t)),n+="</div>",e.innerHTML=n}function Vg(e){var o,d,l;const t=e.programs,a=e.raceProgramRaces,r=e.races,s=t.map(p=>({id:p.id,stats:Qo(p,e)}));let n=`<tr>
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
    `}n+="</tr>";let i="";for(const p of Ur){const m=r.filter(y=>y.start_date<=p.dateStr&&y.end_date>=p.dateStr),u=m.length>0,f=u?"row-has-races":"";let g="";if(u){g='<div style="display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.15rem;">';for(const y of m){const v=nt((d=y.category)==null?void 0:d.name);g+=`
          <span class="race-id-badge" style="background-color: ${v.background}; border: 1px solid ${v.border}; color: ${v.color}; font-size: 0.65rem; padding: 0.05rem 0.2rem; text-align: left; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${S(y.name)}">
            ${S(y.name)}
          </span>
        `}g+="</div>"}let b=`
      <td class="sticky-col ${f}" style="font-weight: 600; vertical-align: top; padding: 0.4rem 0.6rem;">
        <div>${p.label}</div>
        ${g}
      </td>
      <td style="text-align: center; color: var(--text-500); font-variant-numeric: tabular-nums; vertical-align: top; padding-top: 0.4rem;">${p.weekNum}</td>
    `;for(const y of t){const v=pr(y,p.weekNum),x=Xo(v),M=a.find(R=>R.program_id===y.id&&m.some(L=>L.id===R.race_id));let T="",$=`toggleable-race-cell ${x}`,C=`data-day="${p.dateStr}" data-program-id="${y.id}"`;if(M){const R=r.find(P=>P.id===M.race_id),L=nt((l=R==null?void 0:R.category)==null?void 0:l.name);T=`
          <span class="race-program-badge" style="background-color: ${L.background}; border: 1px solid ${L.border}; color: ${L.color};" title="${S(R==null?void 0:R.name)}">
            ${S(R==null?void 0:R.name)}
          </span>
        `}else u?T='<span class="race-cell-placeholder" title="Klicken zum Zuweisen">＋</span>':($=x,C="");b+=`<td class="${$}" ${C} style="text-align: center; vertical-align: middle;">${T}</td>`}i+=`<tr>${b}</tr>`}return`
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
  `}function Ug(e){var f;const t=e.programs,a=e.raceProgramRaces,r=e.races;let s='<th class="sticky-col-header" style="z-index: 15;">Monat</th>',n='<th class="sticky-col-header" style="z-index: 15;">Tag / KW</th>',i='<th class="sticky-col-header" style="z-index: 15;">Rennen Anzahl</th>',o='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #1</th>',d='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #2</th>',l='<th class="sticky-col-header" style="z-index: 15; font-size: 0.75rem; color: var(--text-500);">Rennen #3</th>';const p=[],m=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];for(const g of Ur){const b=parseInt(g.dateStr.split("-")[1],10)-1,y=m[b];p.length===0||p[p.length-1].name!==y?p.push({name:y,span:1}):p[p.length-1].span++;const v=r.filter(C=>C.start_date<=g.dateStr&&C.end_date>=g.dateStr),x=v.length>0,M=x?`${v.length} R`:"",T=x?"race-count-active":"";n+=`<th style="text-align: center; min-width: 40px; font-variant-numeric: tabular-nums;">
      <div style="font-size: 0.8rem; font-weight: bold;">${g.dateStr.split("-")[2]}</div>
      <div style="font-size: 0.65rem; color: var(--text-500);">W${g.weekNum}</div>
    </th>`,i+=`<th class="${T}" style="text-align: center; font-size: 0.72rem; font-weight: bold;">${M}</th>`;const $=C=>{var D;const R=v[C];if(!R)return"";const L=nt((D=R.category)==null?void 0:D.name),P=a.filter(_=>_.race_id===R.id).length;return`
        <span class="race-id-badge" style="background-color: ${L.background}; border: 1px solid ${L.border}; color: ${L.color}; cursor: help;" 
              title="${S(R.name)}
Zugelassene Programme: ${P}">
          R${R.id}
        </span>
      `};o+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(0)}</th>`,d+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(1)}</th>`,l+=`<th style="text-align: center; vertical-align: middle; padding: 0.2rem 0;">${$(2)}</th>`}for(const g of p)s+=`<th colspan="${g.span}" style="text-align: center; font-weight: bold; border-left: 1px solid var(--border);">${g.name}</th>`;let u="";for(const g of t){const b=Qo(g,e);let y=`
      <td class="sticky-col" style="z-index: 5; white-space: nowrap; font-weight: bold; border-right: 2px solid var(--border);">
        <div style="font-size: 0.85rem;">${S(g.name)}</div>
        <div class="text-muted" style="font-size: 0.7rem; font-weight: normal; margin-top: 0.1rem;">
          P: <span style="color: #fb923c; font-weight: bold;">${b.peak}</span> | 
          A: <span style="color: #94a3b8; font-weight: bold;">${b.prep}</span> | 
          O: <span>${b.none}</span>
        </div>
      </td>
    `;for(const v of Ur){const x=pr(g,v.weekNum),M=Xo(x),T=r.filter(D=>D.start_date<=v.dateStr&&D.end_date>=v.dateStr),$=T.length>0,C=a.find(D=>D.program_id===g.id&&T.some(_=>_.id===D.race_id));let R="",L=`toggleable-race-cell ${M}`,P=`data-day="${v.dateStr}" data-program-id="${g.id}"`;if(C){const D=r.find(H=>H.id===C.race_id),_=nt((f=D==null?void 0:D.category)==null?void 0:f.name);R=`
          <span class="race-id-badge" style="background-color: ${_.background}; border: 1px solid ${_.border}; color: ${_.color};" title="${S(D==null?void 0:D.name)}">
            R${D==null?void 0:D.id}
          </span>
        `}else $?R='<span style="font-size: 0.72rem; color: var(--text-500); opacity: 0.5;">＋</span>':(L=M,P="");y+=`<td class="${L}" ${P} style="text-align: center; vertical-align: middle; padding: 0.35rem 0;">${R}</td>`}u+=`<tr>${y}</tr>`}return`
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
            ${u}
          </tbody>
        </table>
      </div>
    </div>
  `}function Yg(e){return`
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
            ${e.programs.map(r=>{const s=[{min:r.peak1_min,max:r.peak1_max},{min:r.peak2_min,max:r.peak2_max},{min:r.peak3_min,max:r.peak3_max}].sort((p,m)=>p.min-m.min),n=s[1].min-s[0].max<8,i=s[2].min-s[1].max<8,d=n||i?'<span style="color: #f97316; font-size: 1.1rem; cursor: help;" title="Warnung: Peakbereiche liegen weniger als 8 Wochen auseinander!">⚠️</span>':'<span style="color: #22c55e;">✔ OK</span>',l=p=>{const m=r[`peak${p}_min`]??1,u=r[`peak${p}_max`]??1;return`
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
        <td style="text-align: center;">${d}</td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function Zg(e,t){const a=t.filter(o=>o.race_id===e).sort((o,d)=>o.stage_number-d.stage_number);if(a.length===0)return{countHtml:"Keine Etappen",stagesListHtml:"Keine Etappendaten vorhanden."};const r={};for(const o of a)r[o.profile]=(r[o.profile]||0)+1;const n=Object.entries(r).sort((o,d)=>d[1]-o[1]).map(([o,d])=>`${S(o)}: ${d}x`).join("<br>"),i=a.map(o=>`
    <div class="popover-stage-row">
      <span class="popover-stage-num">Et. ${o.stage_number}:</span>
      <span class="popover-stage-profile">${S(o.profile)}</span>
    </div>
  `).join("");return{countHtml:n,stagesListHtml:i}}function Jg(e){const t=[...e.races].sort((i,o)=>i.start_date.localeCompare(o.start_date)),a=e.raceProgramRaces,r=e.stages,s=e.programDistribution;return`
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
            ${t.map(i=>{const o=new Set(a.filter(F=>F.race_id===i.id).map(F=>F.program_id)),d=s.filter(F=>o.has(F.program_id)),p=e.programs.map(F=>{const B=a.some(pe=>pe.program_id===F.id&&pe.race_id===i.id),I=s.find(pe=>pe.program_id===F.id),N=I?parseInt(I.deterministic_rider_count||"0",10):0,E=I?parseInt(I.deterministic_role_Kapitaen||"0",10):0,O=I?parseInt(I.deterministic_role_Co_Kapitaen||"0",10):0,z=I?parseInt(I.deterministic_role_Edelhelfer||"0",10):0,k=I?parseInt(I.deterministic_role_Starke_Helfer||"0",10):0,G=I?parseInt(I.deterministic_role_Wassertraeger||"0",10):0,j=I?parseInt(I.deterministic_role_Sprinter||"0",10):0,U=[];E>0&&U.push(`${E} Kap.`),O>0&&U.push(`${O} Co-Kap.`),z>0&&U.push(`${z} Edel.`),k>0&&U.push(`${k} St. H.`),G>0&&U.push(`${G} Wasser.`),j>0&&U.push(`${j} Sprint.`);const me=U.length>0?`(${U.join(", ")})`:"";return{program:F,isAssigned:B,count:N,rolesStr:me}}).sort((F,B)=>B.count-F.count).map(F=>{const B=F.program;let I="";F.isAssigned&&(Gg(B,i)||(I='<span style="color: #fb923c; font-weight: bold; margin-left: 0.35rem; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(251, 146, 60, 0.15); border: 1px solid #fb923c; border-radius: 50%; font-size: 0.65rem;" title="Dieses Rennen liegt außerhalb der Peak- und Aufbauphase dieses Programms!">!</span>'));const N=F.isAssigned?"font-weight: bold; color: var(--text-100);":"color: var(--text-500);",E=F.isAssigned?"☑":"☐";return`
        <div class="popover-program-toggle" data-program-id="${B.id}" data-race-id="${i.id}" 
             style="cursor: pointer; padding: 0.35rem 0.5rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); transition: background-color 0.15s;"
             onmouseover="this.style.backgroundColor='rgba(99, 102, 241, 0.08)'"
             onmouseout="this.style.backgroundColor='transparent'">
          <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;">
            <span style="font-size: 1.15rem; line-height: 1; user-select: none; color: ${F.isAssigned?"var(--accent-h)":"var(--text-500)"};">${E}</span>
            <span style="${N} font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${S(B.name)}">
              ${S(B.name)}
            </span>
            ${I}
          </div>
          <div style="text-align: right; min-width: 100px;">
            <strong style="font-size: 0.75rem; color: var(--accent-h);">${F.count} Fahrer</strong>
            <div style="font-size: 0.62rem; color: var(--text-500); font-weight: normal; margin-top: 0.05rem;" title="${S(F.rolesStr)}">${S(F.rolesStr)}</div>
          </div>
        </div>
      `}).join(""),u=`
      <div class="race-rider-programs-popover-card ${ut===i.id?"":"hidden"}"
           style="position: absolute; top: calc(100% + 0.45rem); right: 0; z-index: 120; min-width: 335px; max-width: 400px; padding: 0.8rem 0.9rem; border: 1px solid rgba(148, 163, 184, 0.18); border-radius: var(--radius-md); background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%); box-shadow: var(--shadow); text-align: left; font-weight: normal;">
        <div class="popover-head" style="border-bottom: 1px solid rgba(148, 163, 184, 0.12); padding-bottom: 0.4rem; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
          <strong>Rennprogramme verwalten</strong>
          <span style="font-size: 0.65rem; font-weight: normal; color: var(--text-500);">Klicken zum Aktivieren</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.2rem; max-height: 220px; overflow-y: auto;">
          ${p}
        </div>
      </div>
    `;let f=0,g=0,b=0,y=0,v=0,x=0,M=0;const T={Kapitaen:{},Co_Kapitaen:{},Sprinter:{},Edelhelfer:{},Starke_Helfer:{},Wassertraeger:{}},$=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],C=["Berg","Hill","Sprint","Timetrial","Cobble","Attacker"];for(const F of d){f+=parseInt(F.deterministic_rider_count||"0",10),g+=parseInt(F.deterministic_role_Kapitaen||"0",10),b+=parseInt(F.deterministic_role_Co_Kapitaen||"0",10),y+=parseInt(F.deterministic_role_Sprinter||"0",10),v+=parseInt(F.deterministic_role_Edelhelfer||"0",10),x+=parseInt(F.deterministic_role_Starke_Helfer||"0",10),M+=parseInt(F.deterministic_role_Wassertraeger||"0",10);for(const B of $)for(const I of C){const N=`deterministic_${B}_spec1_${I}`,E=parseInt(F[N]||"0",10);T[B][I]=(T[B][I]||0)+E}}const R=`
      <button type="button" class="race-rider-count-trigger btn-link" data-race-id="${i.id}" 
              style="font-weight: bold; border: none; background: transparent; padding: 0.15rem 0.4rem; cursor: pointer; color: var(--accent-h); text-decoration: underline;">
        ${f}
      </button>
    `;let L="—";if(i.is_stage_race===0){const F=r.find(B=>B.race_id===i.id);L=(F==null?void 0:F.profile)??"Flat"}let P="",D=`<strong>${S(i.name)}</strong>`;if(i.is_stage_race===1){const F=ct===i.id,{countHtml:B,stagesListHtml:I}=Zg(i.id,r);P=`
        <div class="race-stages-popover-card ${F?"":"hidden"}">
          <div class="popover-head"><strong>${S(i.name)}</strong> - Etappen</div>
          <div class="popover-stages-list">${I}</div>
          <div class="popover-separator"></div>
          <div class="popover-head">Profile Zusammenfassung</div>
          <div class="popover-profiles-summary">${B}</div>
        </div>
      `,D=`
        <button type="button" class="race-popover-trigger btn-link" data-race-id="${i.id}" style="text-align: left; font-weight: bold; border: none; background: transparent; padding: 0; cursor: pointer; color: var(--accent-h);">
          ${S(i.name)}
        </button>
      `}let _=["Berg","Hill","Sprint","Cobble","Timetrial","Attacker"];if(i.is_stage_race===0){const F=r.find(I=>I.race_id===i.id),B=((F==null?void 0:F.profile)??"").toLowerCase();B.includes("cobble")?_=["Cobble","Sprint","Hill","Attacker","Timetrial","Berg"]:(B.includes("flat")||B.includes("rolling"))&&(_=["Sprint","Timetrial","Attacker","Hill","Cobble","Berg"])}const H=[],K=["Kapitaen","Co_Kapitaen","Sprinter","Edelhelfer","Starke_Helfer","Wassertraeger"],w={Kapitaen:"Kapitän",Co_Kapitaen:"Co-Kapitän",Sprinter:"Sprinter",Edelhelfer:"Edelhelfer",Starke_Helfer:"Starke Helfer",Wassertraeger:"Wasserträger"},A={Berg:"Berg",Hill:"Hügel",Sprint:"Sprint",Cobble:"Cobble",Timetrial:"Timetrial",Attacker:"Attacker"},Y=(e.roleSpecCombinations||[]).filter(F=>o.has(F.program_id)),W=new Map;for(const F of Y){const B=F.spec2?` / ${F.spec2}`:"",I=`${F.role}|${F.spec1}${B}`;W.set(I,(W.get(I)||0)+F.count)}const re=[...W.entries()].map(([F,B])=>{const[I,N]=F.split("|");return{role:I,specs:N,count:B}}).sort((F,B)=>{const I=K.indexOf(F.role)-K.indexOf(B.role);if(I!==0)return I;const N=F.specs.split(" / ")[0],E=B.specs.split(" / ")[0],O=_.indexOf(N)-_.indexOf(E);return O!==0?O:B.count-F.count}),q=F=>F.split(" / ").map(B=>A[B]??B).join(" / ");for(const F of re)F.count>0&&H.push(`
          <div style="display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8rem;">
            <span style="color: var(--text-100);">${w[F.role]||F.role} <span class="text-muted">(${q(F.specs)})</span></span>
            <strong style="color: var(--accent-h);">${F.count} fahrer</strong>
          </div>
        `);const ee=H.length>0?H.join(""):'<div class="text-muted" style="padding: 0.5rem; font-size: 0.8rem;">Keine Fahrer zugewiesen.</div>';return`
      <tr style="position: relative;">
        <td style="text-align: center; vertical-align: middle;">
          <button type="button" class="btn btn-sm btn-ghost race-row-expand-btn" data-race-id="${i.id}" style="padding: 0.15rem 0.4rem;">▶</button>
        </td>
        <td>${se(i.start_date)}</td>
        <td class="race-programs-popup-anchor" style="position: relative; vertical-align: middle;">
          ${D}
          ${P}
        </td>
        <td style="font-weight: bold; color: var(--accent-h); text-align: center;">${L}</td>
        <td class="race-programs-popup-anchor" style="position: relative; text-align: center; font-variant-numeric: tabular-nums; vertical-align: middle;">
          ${R}
          ${u}
        </td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${g}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${b}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${y}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${v}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${x}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${M}</td>
      </tr>
      <tr id="race-details-row-${i.id}" class="hidden" style="background: rgba(15, 23, 42, 0.45);">
        <td colspan="11" style="padding: 0.5rem 1.5rem;">
          <div style="max-width: 450px; background: var(--bg-800); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
            <div style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; font-weight: bold; background: rgba(99,102,241,0.08); color: var(--text-100);">Zusammensetzung (Rolle / Spezialisierung)</div>
            ${ee}
          </div>
        </td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function qg(e){const t=e.programs,a=e.roleSpecCombinations||[];return`
    <div class="team-detail-card" style="margin-top: 1rem;">
      <div class="team-detail-table-scroll" style="max-height: 75vh;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">ID</th>
              <th>Programm</th>
              <th style="text-align: center; font-weight: bold; width: 110px;">Fahrer gesamt</th>
              <th style="text-align: center; width: 90px;">Kapitän</th>
              <th style="text-align: center; width: 90px;">Co-Kapitän</th>
              <th style="text-align: center; width: 90px;">Sprinter</th>
              <th style="text-align: center; width: 90px;">Edelhelfer</th>
              <th style="text-align: center; width: 100px;">Starke Helfer</th>
              <th style="text-align: center; width: 100px;">Wasserträger</th>
            </tr>
          </thead>
          <tbody>
            ${t.map(s=>{const n=a.filter(d=>d.program_id===s.id);let i=0;const o={Kapitaen:0,Co_Kapitaen:0,Sprinter:0,Edelhelfer:0,Starke_Helfer:0,Wassertraeger:0};for(const d of n)i+=d.count,o[d.role]!==void 0&&(o[d.role]+=d.count);return`
      <tr>
        <td style="font-weight: bold; color: var(--text-100);">${s.id}</td>
        <td style="font-weight: bold; min-width: 150px;">${S(s.name)}</td>
        <td style="text-align: center; font-weight: bold; color: var(--accent-h); font-variant-numeric: tabular-nums;">${i}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${o.Kapitaen||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${o.Co_Kapitaen||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${o.Sprinter||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${o.Edelhelfer||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${o.Starke_Helfer||"—"}</td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${o.Wassertraeger||"—"}</td>
      </tr>
    `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.openTeamStats=Zo;async function el(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}Zr("game"),h("meta-career").textContent=((e=c.currentSave)==null?void 0:e.careerName)??"",It("dashboard"),Se("Spiel wird geladen…");try{await xs(),await Ts(),cr()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{he()}}function Xg(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";It(t),t==="dashboard"&&cr(),t==="teams"&&Qa(),t==="riders"&&Qa(),t==="rider-team-editor"&&Uo(),t==="live-race"&&Bt(),t==="results"&&xe(),t==="draft"&&Yo(c.draftSelectedSeason||((a=c.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&cg(),t==="season-standings"&&fg(),t==="leaderboards"&&Ig(),t==="calendar"&&Bg(),t==="race-programs"&&Cs(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&uo()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&Kt(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&Zo(a)}),h("btn-cancel-new").addEventListener("click",()=>We("newCareer")),h("btn-close-race-stages").addEventListener("click",()=>We("raceStages")),h("btn-close-stage-profile").addEventListener("click",()=>We("stageProfile")),h("btn-close-rider-program").addEventListener("click",()=>We("riderProgram")),h("btn-close-rider-stats").addEventListener("click",()=>We("riderStats")),h("btn-close-team-stats").addEventListener("click",()=>We("teamStats")),h("btn-close-race-participants").addEventListener("click",()=>We("raceParticipants")),h("btn-close-roster-editor").addEventListener("click",()=>Kr()),h("btn-cancel-roster-editor").addEventListener("click",()=>Kr()),h("btn-apply-roster-editor").addEventListener("click",()=>{Ep()}),h("btn-back-menu").addEventListener("click",()=>{Xt==null||Xt.pause(),Zr("menu"),la()}),vl(),Op(),_g(),Io(),Oo(),dg(),Cp(),xp(),Vm(),lp(),Mg(),hg(),Rg(),zg()}(async()=>(bm(),ce(),Xg(),Zr("menu"),await la()))();
