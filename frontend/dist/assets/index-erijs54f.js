(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=a(r);fetch(r.href,n)}})();function jn(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function $s(...e){return e.filter(t=>!!(t&&t.trim())).join(" ")}function ra(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?{background:"rgba(253, 224, 71, .25)",color:"#fef08a",border:"rgba(234, 179, 8, .6)"}:t.includes("grand tour")?{background:"rgba(6, 182, 212, .16)",color:"#a5f3fc",border:"rgba(34, 211, 238, .34)"}:t.includes("monument")?{background:"rgba(234, 179, 8, .18)",color:"#fde68a",border:"rgba(250, 204, 21, .38)"}:t.includes("stage race high")?{background:"rgba(37, 99, 235, .18)",color:"#bfdbfe",border:"rgba(96, 165, 250, .36)"}:t.includes("stage race middle")?{background:"rgba(79, 70, 229, .18)",color:"#c7d2fe",border:"rgba(129, 140, 248, .36)"}:t.includes("stage race low")?{background:"rgba(124, 58, 237, .18)",color:"#ddd6fe",border:"rgba(167, 139, 250, .38)"}:t.includes("one day high")?{background:"rgba(220, 38, 38, .18)",color:"#fecaca",border:"rgba(248, 113, 113, .36)"}:t.includes("one day middle")?{background:"rgba(234, 88, 12, .18)",color:"#fed7aa",border:"rgba(251, 146, 60, .36)"}:t.includes("one day low")?{background:"rgba(22, 163, 74, .16)",color:"#bbf7d0",border:"rgba(74, 222, 128, .34)"}:{background:"rgba(100, 116, 139, .2)",color:"#cbd5e1",border:"rgba(148, 163, 184, .3)"}}function Qa(e){return`--dashboard-race-category-badge-bg:${e.background};--dashboard-race-category-badge-color:${e.color};--dashboard-race-category-badge-border:${e.border};`}function Fe(e,t={}){const a=t.strong===!1?"span":"strong",s=$s("app-rider-link-label",t.labelClassName),r=`<${a} class="${s}">${jn(e)}</${a}>`;if(t.riderId==null)return r;const n=['type="button"','class="'+$s("app-rider-link",t.linkClassName)+'"',`data-rider-id="${t.riderId}"`];return t.teamId!=null&&n.push(`data-team-id="${t.teamId}"`),`<button ${n.join(" ")}>${r}</button>`}function et(e,t,a=!0,s=""){const r=a===!1?"span":"strong",n=`<${r} class="app-team-link-label">${jn(e)}</${r}>`;return t==null?n:`<button type="button" class="${$s("app-team-link",s)}" data-team-id="${t}">${n}</button>`}function On(e,t){return t?t instanceof Map?t.get(e)??0:t[e]??0:0}function Vn(e){return Math.round(e*10)/10}function Un(e,t){const a=e;return(t==null?void 0:t.distanceKm)??a.distanceKm??0}function Yn(e,t){const a=e;return(t==null?void 0:t.elevationGainMeters)??a.elevationGainMeters??0}function Zn(e,t){return t+(e.formBonus??0)+(e.raceFormBonus??0)}function Uo(e,t){return e.skills.stamina*(t/300)}function Jn(e,t,a){return e.skills.timeTrial+Zn(e,t)+e.skills.mountain*(a/500)}function Yo(e,t,a,s){const r=Uo(e,a),n=Zn(e,s);switch(t.profile){case"Flat":return .8*e.skills.sprint+.2*e.skills.flat+n+r;case"Rolling":return .7*e.skills.sprint+.2*e.skills.flat+.1*e.skills.hill+n+r;case"Hilly":return .4*e.skills.sprint+.2*e.skills.flat+.4*e.skills.hill+n+r;case"Hilly_Difficult":return .2*e.skills.sprint+.1*e.skills.flat+.7*e.skills.hill+n+r;case"Medium_Mountain":return .05*e.skills.sprint+.1*e.skills.flat+.35*e.skills.hill+.45*e.skills.mediumMountain+.05*e.skills.mountain+n+r;case"Mountain":return .05*e.skills.hill+.2*e.skills.mediumMountain+.75*e.skills.mountain+n+r;case"High_Mountain":return e.skills.mountain+n+r;case"Cobble":return .3*e.skills.sprint+.2*e.skills.flat+.5*e.skills.cobble+n+r;case"Cobble_Hill":return .3*e.skills.sprint+.2*e.skills.flat+.2*e.skills.hill+.3*e.skills.cobble+n+r;default:return .8*e.skills.sprint+.2*e.skills.flat+n+r}}function Zo(e,t,a,s,r){return t.profile==="ITT"||t.profile==="TTT"?Jn(e,r,s):Yo(e,t,a,r)}function Jo(e,t){var a;return{rank:t,kind:"rider",effectiveSkill:Vn(e.effectiveSkill),teamId:e.rider.activeTeamId??0,teamName:e.teamName,displayName:`${e.rider.firstName} ${e.rider.lastName}`,roleLabel:((a=e.rider.role)==null?void 0:a.name)??"–",riderId:e.rider.id}}function qn(e,t,a,s){Un(a,s);const r=Yn(a,s),n=new Map(t.map(o=>[o.id,o]));if(a.profile==="TTT"){const o=new Map;for(const l of e){if(l.activeTeamId==null)continue;const p=o.get(l.activeTeamId)??[];p.push(l),o.set(l.activeTeamId,p)}return[...o.entries()].map(([l,p])=>{const u=n.get(l),f=p.map(v=>Jn(v,On(v.id,s==null?void 0:s.dailyFormByRiderId),r)).sort((v,T)=>T-v).slice(0,5),g=f.length,b=g>0?f.reduce((v,T)=>v+T,0)/g:0,y=Math.max(0,5-g)*2;return{team:u??{id:l,name:`Team ${l}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0},score:b-y}}).sort((l,p)=>p.score-l.score||l.team.id-p.team.id).slice(0,20).map((l,p)=>({rank:p+1,kind:"team",effectiveSkill:Vn(l.score),teamId:l.team.id,teamName:l.team.name,displayName:l.team.name,roleLabel:"TTT"}))}return(s!=null?Ts(e,t,a,s):Ts(e,t,a)).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id).slice(0,20).map((o,c)=>Jo(o,c+1))}function Ts(e,t,a,s){const r=Un(a,s),n=Yn(a,s),i=new Map(t.map(o=>[o.id,o]));return e.map(o=>{var c;return{rider:o,teamName:o.activeTeamId!=null?((c=i.get(o.activeTeamId))==null?void 0:c.name)??`Team ${o.activeTeamId}`:"—",effectiveSkill:Zo(o,a,r,n,On(o.id,s==null?void 0:s.dailyFormByRiderId))}}).sort((o,c)=>c.effectiveSkill-o.effectiveSkill||o.rider.id-c.rider.id)}const d={currentSave:null,gameState:null,gameStatus:null,races:[],riders:[],teams:[],selectedResultsRaceId:null,selectedResultsStageId:null,selectedResultTypeId:1,selectedResultsMarkerKey:null,selectedResultsSpecialView:null,selectedDashboardRaceId:null,selectedRaceParticipantsRaceId:null,selectedDashboardProfileStageId:null,stageSummariesByStageId:{},stageSummaryErrorsByStageId:{},selectedRealtimeStageId:null,stageResults:null,resultsRoster:null,seasonStandings:null,draftHistory:null,injuries:null,draftSelectedSeason:null,selectedSeasonStandingScope:"riders",teamTableSort:{key:"name",direction:"asc"},teamDetailPage:"skills",riderMenuTableSort:{key:"name",direction:"asc"},riderMenuDetailPage:"skills",riderMenuPage:1,stageEditorDraft:null,stageEditorExistingStages:[],stageEditorExistingStagesLoaded:!1,stageEditorOverviewLoaded:!1,stageEditorOverviewLoading:!1,stageEditorStageRows:[],stageEditorClimbRows:[],stageEditorPrograms:[],stageEditorStagesSort:{key:"stageId",direction:"asc"},stageEditorClimbsSort:{key:"placementKm",direction:"asc"},realtimeBootstrap:null,realtimeError:null,rosterEditor:null,rosterEditorSelectedRiderIds:[],raceParticipants:[],raceParticipantsSort:{key:"team",direction:"asc"},riderStatsPayload:null,riderStatsTab:"results",riderStatsSelectedRiderId:null,riderStatsTopResultsFilterCategory:null,riderStatsTopResultsFilterSeason:null,riderStatsTopResultsPage:1,riderStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},teamStatsPayload:null,teamStatsTab:"topResults",teamStatsSelectedTeamId:null,teamStatsSelectedSeason:"all",teamStatsTopResultsFilterCategory:null,teamStatsTopResultsFilterSeason:null,teamStatsTopResultsPage:1,teamStatsTopResultsFilters:{gc:!0,mountain:!0,points:!0,youth:!0,oneDay:!0,stage:!0},riderTeamEditorPayload:null,riderTeamEditorSelectedTeamKey:"",riderTeamEditorSort:{key:"lastName",direction:"asc"},riderTeamEditorDirtyRiderIds:[],riderTeamEditorSaving:!1,riderTeamEditorExporting:!1,autoProgressTargetDate:null};let Yt=null;function qo(e){Yt=e}let zs=!1;function wr(e){zs=e}let Xn=null;function Ir(e){Xn=e}let Ms=null;function Rr(e){Ms=e}let rt=!1;function Qn(e){rt=e}function h(e){const t=document.getElementById(e);if(!t)throw new Error(`Element mit ID "${e}" wurde nicht gefunden.`);return t}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function re(e){return new Date(e).toLocaleDateString("de-DE",{day:"2-digit",month:"short",year:"numeric"})}function Aa(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),s=Math.floor(e%60),r=String(a).padStart(2,"0"),n=String(s).padStart(2,"0");return t>0?`${t}:${r}:${n}`:`${a}:${n}`}function ds(e){return e==null||e===0?"–":`+${Aa(e)}`}const Fa=2,xs=3,ei=4;function ti(e){return`/jersey/Jer_${e}.png`}function St(e,t){var s;if(e==null)return'<span class="results-team-jersey-placeholder" aria-hidden="true"></span>';const a=t??((s=d.teams.find(r=>r.id===e))==null?void 0:s.name)??`Team ${e}`;return`
    <span class="results-team-jersey" title="${S(a)}" aria-label="${S(a)}">
      <img
        class="results-team-jersey-img"
        src="${S(ti(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function jt(e,t){return`<span class="results-jersey-cell">${St(e,t)}</span>`}function tt(e){return e&&ie(e)||'<span class="results-flag-placeholder" aria-hidden="true"></span>'}function Ft(e){var a;if(e==null)return null;const t=$e(e);return((a=t==null?void 0:t.country)==null?void 0:a.code3)??(t==null?void 0:t.nationality)??null}function $e(e){return e==null?null:d.riders.find(t=>t.id===e)??null}function ct(e){return e==null?null:d.races.find(t=>t.id===e)??null}function Ba(e){var t;if(e==null)return null;for(const a of d.races){const s=(t=a.stages)==null?void 0:t.find(r=>r.id===e);if(s)return{race:a,stage:s}}return null}function Ot(e,t=!0,a=!1,s=null,r=null){const n=Fe(e,{riderId:s,teamId:r,strong:t,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`<span class="results-participant${a?" is-breakaway":""}">${n}</span>`}function Xo(e){return`<span class="results-status-badge ${e?"results-status-badge-otl":"results-status-badge-dnf"}">${e?"OTL":"DNF"}</span>`}function ws(e,t){return e?e.startsWith("crash:")?`Sturz · ${e.slice(6)}`:e==="mechanical"?"Defekt":e:t?"Außerhalb des Zeitlimits":"Aufgegeben"}function Qo(e,t){return e==null||t==null||t===0?'<span class="results-gc-delta results-gc-delta-neutral">●</span>':t>0?`<span class="results-gc-delta results-gc-delta-up"><span class="results-gc-delta-symbol">▲</span><span>${t}</span></span>`:`<span class="results-gc-delta results-gc-delta-down"><span class="results-gc-delta-symbol">▼</span><span>${Math.abs(t)}</span></span>`}function el(e,t){return e==="sprint_intermediate"?`Sprint · ${t}`:e==="climb_top"||e==="finish_hill"||e==="finish_mountain"?`Bergwertung · ${t}`:t}const je={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OMA:"om",OTH:"un"};function ie(e){const t=je[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}function tl(e,t){return e?`<span class="country-chip">${ie(e.code3)}<span>${S(e.name)}</span></span>`:t?S(t):"–"}function Is(e){return`${e.toFixed(2).replace(".",",")} km`}function Rs(e){return`${Math.round(e)} hm`}const al=new Set;function Ks(e){document.querySelectorAll(".screen").forEach(t=>t.classList.add("hidden")),h(`screen-${e}`).classList.remove("hidden")}function Ve(e){h(`modal-${e}`).classList.remove("hidden")}function Ke(e){h(`modal-${e}`).classList.add("hidden")}function Er(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function ai(){var l,p;const e=d.realtimeBootstrap;if(!e)return;const t=h("instant-sim-favorites"),a=h("instant-sim-gc");if(!t||!a)return;const r=qn(e.riders,e.teams,e.stage,{distanceKm:(l=e.stageSummary)==null?void 0:l.distanceKm,elevationGainMeters:(p=e.stageSummary)==null?void 0:p.elevationGainMeters}).slice(0,10),n=new Map(e.gcStandings.map(u=>[u.riderId,u]));let i=`
    <h3>
      <span>Etappen-Favoriten</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const u of r){const m=e.riders.find(w=>w.id===u.riderId);if(!m)continue;const f=Ft(m.id)??"un",g=je[f]??"un",b=e.teams.find(w=>w.id===m.activeTeamId),y=(b==null?void 0:b.abbreviation)??"—",v=n.get(m.id),T=v?`GC ${v.rank} (${v.rank===1?"Gelb":Er(v.gapSeconds)})`:"GC –";i+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${m.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">#${u.rank}</span>
            <span class="fi fi-${g} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${S(m.firstName)} <strong>${S(m.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(y)}</span>
            <span class="instant-sim-gc-info">${T}</span>
          </div>
        </div>
      </div>
    `}i+="</div>",t.innerHTML=i;const o=e.gcStandings.slice(0,10);let c=`
    <h3>
      <span>Gesamtwertung (GC)</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">Top 10</span>
    </h3>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;for(const u of o){const m=e.riders.find(T=>T.id===u.riderId);if(!m)continue;const f=Ft(m.id)??"un",g=je[f]??"un",b=e.teams.find(T=>T.id===m.activeTeamId),y=(b==null?void 0:b.abbreviation)??"—",v=u.rank===1?"Gelb":Er(u.gapSeconds);c+=`
      <div class="instant-sim-rider-card">
        <div class="instant-sim-jersey-column">
          <img src="/jersey/Jer_${m.activeTeamId}.png" class="instant-sim-large-jersey" onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';">
        </div>
        <div class="instant-sim-info-column">
          <div class="instant-sim-rider-header">
            <span class="instant-sim-rank-badge">#${u.rank}</span>
            <span class="fi fi-${g} country-flag" style="font-size: 0.8rem;"></span>
            <span class="instant-sim-name">${S(m.firstName)} <strong>${S(m.lastName)}</strong></span>
          </div>
          <div class="instant-sim-rider-meta">
            <span class="instant-sim-team-abbr">${S(y)}</span>
            <span class="instant-sim-gc-info">${v}</span>
          </div>
        </div>
      </div>
    `}c+="</div>",a.innerHTML=c}function ve(e="Lade…"){var s;const t=rt?" (Leertaste zum Stoppen)":"",a=h("default-loader");a&&(h("loading-msg").textContent=e+t,h("loading-progress").classList.add("hidden"),a.classList.remove("hidden"),(s=h("instant-sim-panel"))==null||s.classList.add("hidden")),h("loading-overlay").classList.remove("hidden")}function fe(){h("loading-overlay").classList.add("hidden")}function sl(e){var t,a;if((t=h("default-loader"))==null||t.classList.add("hidden"),(a=h("instant-sim-panel"))==null||a.classList.remove("hidden"),h("loading-overlay").classList.remove("hidden"),d.realtimeBootstrap)ai();else{const s=h("instant-sim-favorites"),r=h("instant-sim-gc");s&&(s.innerHTML=""),r&&(r.innerHTML="")}si(e)}function si(e){const t=Math.round(Math.min(1,Math.max(0,e))*100),s=`Instant-Simulation läuft … ${t}%${rt?" (Leertaste zum Stoppen)":""}`,r=h("loading-msg");r&&(r.textContent=s);const n=h("loading-progress-bar");n&&(n.style.width=`${t}%`);const i=h("instant-loading-msg");i&&(i.textContent=s);const o=h("instant-loading-progress-bar");o&&(o.style.width=`${t}%`);const c=h("instant-sim-favorites");c&&c.innerHTML.trim()===""&&d.realtimeBootstrap&&ai()}function bt(e,t){const a=h(e);a.textContent=t,a.classList.remove("hidden")}function ta(e){h(e).classList.add("hidden")}function Mt(e){var t;document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),h(`view-${e}`).classList.add("active"),(t=document.querySelector(`.nav-btn[data-view="${e}"]`))==null||t.classList.add("active"),h("game-state-bar").classList.toggle("hidden",e==="live-race");for(const a of al)try{a(e)}catch(s){console.error(`Fehler bei View-Aktivierung von "${e}":`,s)}}function ye(e){var t;return((t=document.getElementById(`view-${e}`))==null?void 0:t.classList.contains("active"))===!0}function Zt(e){switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}}function ri(e,t,a){return Math.max(t,Math.min(a,e))}function cs(e,t,a){return Math.round(e+(t-e)*a)}function Fr(e,t,a){return`rgb(${cs(e[0],t[0],a)} ${cs(e[1],t[1],a)} ${cs(e[2],t[2],a)})`}function Ws(e){const t=[{value:40,color:[86,16,28]},{value:50,color:[132,24,38]},{value:60,color:[185,72,18]},{value:70,color:[212,145,24]},{value:78,color:[88,191,92]},{value:85,color:[196,255,188]}],a=ri(e,t[0].value,t[t.length-1].value);for(let s=1;s<t.length;s+=1){const r=t[s-1],n=t[s];if(a<=n.value){const i=(a-r.value)/(n.value-r.value);return Fr(r.color,n.color,i)}}return Fr(t[t.length-1].color,t[t.length-1].color,1)}function ni(e,t){const a=t!=null?` title="Potential: ${t.toFixed(2)}"`:"";return`<span class="skill-value" style="color:${Ws(e)}"${a}>${e.toFixed(2)}</span>`}function rl(e,t,a){if(t==null)return ni(e,a);const s=Math.round((e-t)*100)/100,r=s>0?"skill-delta-positive":s<0?"skill-delta-negative":"skill-delta-neutral",n=s>0?"+":"",i=`<span class="skill-delta ${r}">${n}${s.toFixed(2)}</span>`;return`
    <div class="skill-with-delta">
      <span class="skill-value" style="color:${Ws(e)}" title="Potential: ${a!=null?a.toFixed(2):""}">${e.toFixed(2)}</span>
      ${i}
    </div>
  `}function nl(e){const t=e??0;return t<0?`${t.toFixed(1).replace(".",",")}`:t===0?"0,0":`<span class="race-sim-form-positive">+${t.toFixed(1).replace(".",",")}</span>`}function Cr(e){const t=e??0;if(t===0)return"0,0";const a=t>0?"race-sim-form-positive":"race-sim-form-negative",s=t>0?"+":"";return`<span class="${a}">${s}${t.toFixed(1).replace(".",",")}</span>`}function Nr(e,t="none",a){const s=e??0,r=["race-sim-form-negative"];t==="warning"&&r.push("load-warning"),t==="critical"&&r.push("load-warning-critical");const n=a?` title="${S(a)}"`:"";return s===0?`<span class="${r.join(" ")}"${n}>0,0</span>`:`<span class="${r.join(" ")}"${n}>-${s.toFixed(1).replace(".",",")}</span>`}function ii(e){const t=e.seasonFormPhase??"neutral";return oi(t)}function oi(e){const t={rise:{symbol:"▲",label:"Aufbau",className:"team-form-phase-rise"},fall:{symbol:"▼",label:"Abbau",className:"team-form-phase-fall"},neutral:{symbol:"●",label:"Neutral",className:"team-form-phase-neutral"}},a=t[e??"neutral"]??t.neutral;return`<span class="team-form-phase ${a.className}" title="${S(a.label)}">${a.symbol}</span>`}function il(e){return e.seasonProgram?`<button type="button" class="team-program-button" data-rider-program-id="${e.id}">${S(e.seasonProgram.name)}</button>`:"–"}function kt(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function Ce(e){return`${e.lastName} ${e.firstName}`}function ol(e){if(!e.isUnavailable)return"";const t=e.healthStatus==="injured"?"Verletzung":"Krankheit",a=e.unavailableDaysRemaining??0,s=e.unavailableUntil?` bis ${re(e.unavailableUntil)}`:"",r=`${t}: noch ${a} Tag${a===1?"":"e"}${s}`;return`<span class="rider-availability-marker" title="${S(r)}" aria-label="${S(r)}"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>`}function dt(e){var t;return((t=e.role)==null?void 0:t.name)??(e.roleId!=null?`Rolle ${e.roleId}`:"–")}function Es(e,t){const a=new Blob([t],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(a),r=document.createElement("a");r.href=s,r.download=e,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(s)}async function Z(e,t,a){try{const s=await fetch(t,{method:e,headers:a?{"Content-Type":"application/json"}:{},body:a?JSON.stringify(a):void 0});if(!(s.headers.get("content-type")??"").toLowerCase().includes("application/json")){const n=await s.text();return{success:!1,error:s.ok?"Antwort war kein JSON.":`HTTP ${s.status}: ${n.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()||"Unerwartete Antwort vom Server."}`}}return s.json()}catch(s){return{success:!1,error:`Netzwerkfehler: ${s.message}`}}}const j={listSaves:()=>Z("GET","/api/saves"),createSave:(e,t,a)=>Z("POST","/api/saves",{filename:e,careerName:t,teamId:a}),loadSave:e=>Z("POST",`/api/saves/${encodeURIComponent(e)}/load`),deleteSave:e=>Z("DELETE",`/api/saves/${encodeURIComponent(e)}`),getAvailableTeams:()=>Z("GET","/api/teams/available"),getTeams:()=>Z("GET","/api/teams"),getTeam:e=>Z("GET",`/api/teams/${e}`),getTeamStats:e=>Z("GET",`/api/teams/${e}/stats`),getRiders:e=>Z("GET",`/api/riders${e!=null?`?teamId=${e}`:""}`),getRiderStats:(e,t=!1)=>Z("GET",`/api/riders/${e}/stats${t?"?excludeFatigue=true":""}`),getRiderProgramRaces:e=>Z("GET",`/api/riders/${e}/program-races`),getRiderTeamEditor:()=>Z("GET","/api/rider-team-editor"),saveRiderTeamEditor:e=>Z("POST","/api/rider-team-editor",e),exportRiderTeamEditor:e=>Z("POST","/api/rider-team-editor/export",e),getRaces:()=>Z("GET","/api/races"),getRaceProgramParticipants:e=>Z("GET",`/api/races/${e}/program-participants`),getRaceResultsRoster:e=>Z("GET",`/api/races/${e}/results-roster`),getGameState:()=>Z("GET","/api/state"),getGameStatus:()=>Z("GET","/api/game/status"),getStageSummary:e=>Z("GET",`/api/stages/${e}/summary`),getRealtimeSimulation:e=>Z("GET",`/api/simulation/realtime/${e}`),getRosterEditor:e=>Z("GET",`/api/simulation/roster/${e}`),applyRosterEditor:(e,t)=>Z("POST",`/api/simulation/roster/${e}/apply`,t),completeRealtimeSimulation:(e,t)=>Z("POST",`/api/simulation/realtime/${e}/complete`,t),advanceDay:()=>Z("POST","/api/state/advance"),getStageResults:e=>Z("GET",`/api/results/${e}`),getSeasonStandings:()=>Z("GET","/api/season-standings"),listStageEditorStages:()=>Z("GET","/api/stage-editor/stages"),listStageEditorCountries:()=>Z("GET","/api/stage-editor/countries"),listStageEditorRaceCategories:()=>Z("GET","/api/stage-editor/race-categories"),listStageEditorRacePrograms:()=>Z("GET","/api/stage-editor/race-programs"),getStageEditorOverview:()=>Z("GET","/api/stage-editor/overview"),loadStageEditorStage:e=>Z("GET",`/api/stage-editor/stages/${e}`),importStageRoute:e=>Z("POST","/api/stage-editor/import",e),exportStageRoute:e=>Z("POST","/api/stage-editor/export",e),getInjuries:()=>Z("GET","/api/injuries"),getDraftHistory:e=>Z("GET",`/api/draft/${e}`),getLeaderboards:(e,t,a)=>Z("GET",`/api/leaderboards?scope=${e}&metricKey=${encodeURIComponent(t)}&period=${a}`)};async function na(){const e=await j.listSaves(),t=h("saves-list"),a=h("btn-delete-all-careers");if(!e.success||!e.data||e.data.length===0){t.classList.add("hidden"),a.classList.add("hidden");return}t.classList.remove("hidden"),a.classList.remove("hidden"),t.innerHTML=e.data.map(s=>`
    <div class="save-card">
      <h3>${S(s.careerName)}</h3>
      <p class="save-meta">
        ${S(s.teamName)} · Saison ${s.currentSeason}
        ${s.lastSaved?"· "+re(s.lastSaved):""}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${S(s.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${S(s.filename)}" data-career-name="${S(s.careerName)}">Löschen</button>
      </div>
    </div>
  `).join("")}async function ll(e){ve("Karriere wird geladen…");const t=await j.loadSave(e);if(fe(),!t.success){alert("Fehler beim Laden: "+t.error);return}d.currentSave=t.data??null,await Vo()}async function dl(e,t){if(!confirm(`Karriere "${t}" wirklich löschen?`))return;ve("Löschen…");const a=await j.deleteSave(e);if(fe(),!a.success){alert("Fehler: "+a.error);return}await na()}async function cl(){const e=await j.listSaves(),t=e.success?e.data??[]:[];if(t.length===0){h("btn-delete-all-careers").classList.add("hidden"),h("saves-list").classList.add("hidden");return}if(confirm(`Wirklich alle ${t.length} Karrieren löschen?`)&&confirm("Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?")){ve("Alle Karrieren werden gelöscht…");try{for(const a of t){const s=await j.deleteSave(a.filename);if(!s.success){alert(`Fehler beim Löschen von "${a.careerName}": ${s.error??"Unbekannter Fehler"}`);break}}}finally{fe()}await na()}}function ul(){h("btn-new-career").addEventListener("click",async()=>{var r;ta("new-career-error"),h("input-career-name").value="";const a=h("input-team-id");a.innerHTML='<option value="">Wird geladen…</option>',Ve("newCareer");const s=await j.getAvailableTeams();if(!s.success||!((r=s.data)!=null&&r.length)){a.innerHTML='<option value="">Fehler beim Laden der Teams</option>';return}a.innerHTML=s.data.map(n=>`<option value="${n.id}">${S(n.name)} (${S(n.division??n.divisionName??"")})</option>`).join("")}),h("btn-cancel-new").addEventListener("click",()=>Ke("newCareer")),h("btn-confirm-new").addEventListener("click",async()=>{const a=h("input-career-name").value.trim(),s=h("input-team-id").value;if(!a||!s){bt("new-career-error","Bitte Karriere-Name und Team auswählen.");return}const r=Number(s),i=`${a.toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)}_${Date.now()}.db`;ta("new-career-error"),ve("Neue Karriere wird erstellt…");const o=await j.createSave(i,a,r);if(!o.success){fe(),bt("new-career-error",o.error??"Unbekannter Fehler.");return}const c=await j.loadSave(i);if(fe(),Ke("newCareer"),!c.success){alert("Fehler: "+c.error);return}d.currentSave=c.data??null,await Vo()});const e=document.getElementById("btn-load-career");e&&e.addEventListener("click",()=>na());const t=document.getElementById("btn-delete-all-careers");t&&t.addEventListener("click",()=>{cl()}),h("saves-list").addEventListener("click",async a=>{const s=a.target.closest("button[data-save-action]");if(!s)return;const{saveAction:r,filename:n,careerName:i}=s.dataset;if(n){if(r==="load"){await ll(n);return}r==="delete"&&await dl(n,i??n)}})}const ml="modulepreload",pl=function(e){return"/"+e},Pr={},li=function(t,a,s){let r=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));r=Promise.allSettled(a.map(c=>{if(c=pl(c),c in Pr)return;Pr[c]=!0;const l=c.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":ml,l||(u.as="script"),u.crossOrigin="",u.href=c,o&&u.setAttribute("nonce",o),document.head.appendChild(u),l)return new Promise((m,f)=>{u.addEventListener("load",m),u.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return r.then(i=>{for(const o of i||[])o.status==="rejected"&&n(o.reason);return t().catch(n)})},gl={BEL:"be",FRA:"fr",ITA:"it",ESP:"es",NED:"nl",GER:"de",GBR:"gb",USA:"us",CAN:"ca",MEX:"mx",COL:"co",ECU:"ec",VEN:"ve",ARG:"ar",AUS:"au",NZL:"nz",DEN:"dk",NOR:"no",SLO:"si",POR:"pt",SWI:"ch",POL:"pl",AUT:"at",LUX:"lu",IRL:"ie",EST:"ee",LTU:"lt",LAT:"lv",CZE:"cz",SVK:"sk",KAZ:"kz",SWD:"se",FIN:"fi",UKR:"ua",MOL:"md",CRO:"hr",HUN:"hu",ERI:"er",RWA:"rw",ETH:"et",CMR:"cm",SAR:"za",JPN:"jp",UAE:"ae",BHR:"bh",SUI:"ch",IRE:"ie",RSA:"za",OTH:"un"};function fl(e){const t=gl[e]??null;return t?`<span class="fi fi-${t} country-flag" aria-hidden="true"></span>`:""}const hl=200;function js(e){if(e.length===0)return[];const t=[];for(const a of e){const s=t[t.length-1];if(!s||Math.abs(s.distanceMeter-a.distanceMeter)>=hl){t.push({riderIds:[...a.riderIds],riderCount:a.riderCount,distanceMeter:a.distanceMeter,distanceSum:a.distanceMeter*a.riderCount});continue}s.riderIds.push(...a.riderIds),s.riderCount+=a.riderCount,s.distanceSum+=a.distanceMeter*a.riderCount,s.distanceMeter=s.distanceSum/s.riderCount}return t.map(({distanceSum:a,...s})=>s)}function Os(e){if(e.length===0)return[];let t=0;for(let r=1;r<e.length;r+=1)e[r].riderCount>e[t].riderCount&&(t=r);let a=0,s=0;return e.map((r,n)=>{const i=n===t;let o;return i?o="P":n<t?(a+=1,o=`E${a}`):(s+=1,o=`A${s}`),{...r,label:o,isPeloton:i,previousGapMeters:n>0?Math.max(0,e[n-1].distanceMeter-r.distanceMeter):null,nextGapMeters:n<e.length-1?Math.max(0,r.distanceMeter-e[n+1].distanceMeter):null}})}function bl(e,t=null){var a,s,r;return t!=null&&e.some(n=>n.label===t)?t:((a=e.find(n=>n.label.startsWith("E")))==null?void 0:a.label)??((s=e.find(n=>n.label==="P"))==null?void 0:s.label)??((r=e[0])==null?void 0:r.label)??null}function ut(e){return e.type==="climb_top"||(e.type==="finish_hill"||e.type==="finish_mountain")&&e.cat!=null&&e.cat!=="Sprint"}function Lr(e,t,a,s){return`${s.type}:${e}:${t}:${a}`}function yl(e,t){return e.type==="sprint_intermediate"?`SZ ${t}`:ut(e)?`Berg ${t}`:e.type==="climb_start"?`Anstieg ${t}`:e.type==="start"?"Start":"Ziel"}function Je(e){const t=[];e.segments.forEach((r,n)=>{const i=n*2;(r.start_markers??[]).forEach((o,c)=>{t.push({key:Lr(n,"start",c,o),label:"",marker:o,kmMark:r.start_km,elevation:r.start_elevation,boundary:"start",sequence:i+c/100})}),(r.end_markers??[]).forEach((o,c)=>{t.push({key:Lr(n,"end",c,o),label:"",marker:o,kmMark:r.end_km,elevation:r.end_elevation,boundary:"end",sequence:i+1+c/100})})});const a=t.sort((r,n)=>r.kmMark-n.kmMark||r.sequence-n.sequence),s=new Map;return a.map(r=>{const n=(s.get(r.marker.type)??0)+1;return s.set(r.marker.type,n),{...r,label:r.marker.name??yl(r.marker,n)}})}function vl(e){const t=Je(e);return{segmentCount:e.segments.length,sprintCount:t.filter(({marker:a})=>a.type==="sprint_intermediate").length,climbCount:t.filter(({marker:a})=>ut(a)).length}}function At(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Sl(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function Ae(e,t,a,s){return t<=0?s:s+e/t*(a-s*2)}function _a(e,t){const a=t/1e3,s=e.points;if(a<=s[0].kmMark)return s[0].elevation;for(let r=0;r<s.length-1;r+=1){const n=s[r],i=s[r+1];if(a>i.kmMark)continue;const o=Math.max(1e-4,i.kmMark-n.kmMark),c=(a-n.kmMark)/o;return n.elevation+(i.elevation-n.elevation)*c}return s[s.length-1].elevation}function di(e){const t=e.points.map(p=>p.elevation),a=Math.min(...t),s=Math.max(...t),r=Math.max(1,s-a),n=Math.max(40,r*.08),i=Math.max(0,a-n),o=s+n;let c=Math.floor(i/50)*50,l=Math.ceil(o/50)*50;return l<=c&&(l=c+100),{axisMinElevation:c,axisMaxElevation:l}}function Ue(e,t,a,s,r,n){const i=Math.max(1,a-t);return s-n-(e-t)/i*(s-r-n)}function Jt(e){return`${Math.round(e)} m`}function Dr(e){return!e||e==="Sprint"?null:`Kat. ${e}`}function Ar(e,t){if(t==="sprint_intermediate")return{accentColor:"#15803d",fillColor:"#ecfdf5"};switch(e){case"HC":return{accentColor:"#b91c1c",fillColor:"#fef2f2"};case"1":return{accentColor:"#ea580c",fillColor:"#fff7ed"};case"2":return{accentColor:"#d97706",fillColor:"#fffbeb"};case"3":return{accentColor:"#ca8a04",fillColor:"#fefce8"};case"4":return{accentColor:"#65a30d",fillColor:"#f7fee7"};default:return{accentColor:"#1f2937",fillColor:"#f8fafc"}}}function ci(e,t,a,s,r,n,i,o,c){var g;const l=[],p=[];let u=null,m="#b91c1c";for(const b of Je(e)){const{marker:y,kmMark:v,elevation:T}=b;if(y.type==="climb_start"){p.push({kmMark:v,elevation:T,name:y.name});continue}if(ut(y)){let w=-1;for(let R=p.length-1;R>=0;R-=1)if(y.name&&((g=p[R])==null?void 0:g.name)===y.name){w=R;break}const M=w>=0?p.splice(w,1)[0]:p.pop();M&&Math.max(0,v-M.kmMark),M&&Math.max(0,T-M.elevation);const $=Ar(y.cat,y.type),E=Dr(y.cat);if(y.type==="finish_hill"||y.type==="finish_mountain"){u=y.cat??null,m=$.accentColor;continue}l.push({x:Ae(v*1e3,t,a,s),anchorY:Ue(T,o,c,r,n,i),primaryLabel:E??"Berg",secondaryLabel:Jt(T),distanceLabel:`${v.toFixed(1).replace(".",",")} km`,accentColor:$.accentColor});continue}if(y.type==="sprint_intermediate"){const w=Ar(y.cat,y.type);l.push({x:Ae(v*1e3,t,a,s),anchorY:Ue(T,o,c,r,n,i),primaryLabel:"Sprint",secondaryLabel:Jt(T),distanceLabel:`${v.toFixed(1).replace(".",",")} km`,accentColor:w.accentColor})}}const f=e.points[e.points.length-1];return l.push({x:Ae(f.kmMark*1e3,t,a,s),anchorY:Ue(f.elevation,o,c,r,n,i),primaryLabel:u?`${Dr(u)??"Ziel"} · Ziel`:"Ziel",secondaryLabel:Jt(f.elevation),distanceLabel:`${f.kmMark.toFixed(1).replace(".",",")} km`,accentColor:m}),l.sort((b,y)=>b.x-y.x)}function ui(e,t,a){const s=t+4,r=a+38,n=e.secondaryLabel?`${e.primaryLabel} · ${e.secondaryLabel}`:e.primaryLabel;return`
    <g class="race-sim-marker-group">
      <line x1="${e.x.toFixed(1)}" y1="${t.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(e.anchorY-10).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.4" opacity="0.75"></line>
      <line x1="${e.x.toFixed(1)}" y1="${(e.anchorY+8).toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${(a+26).toFixed(1)}" stroke="${e.accentColor}" stroke-width="1.2" opacity="0.55"></line>
      <circle cx="${e.x.toFixed(1)}" cy="${e.anchorY.toFixed(1)}" r="3.2" fill="${e.accentColor}" opacity="0.9"></circle>
      <text x="${e.x.toFixed(1)}" y="${s.toFixed(1)}" text-anchor="end" transform="rotate(-90 ${e.x.toFixed(1)} ${s.toFixed(1)})" class="race-sim-marker-title" fill="${e.accentColor}">${At(n)}</text>
      <text x="${e.x.toFixed(1)}" y="${r.toFixed(1)}" text-anchor="start" transform="rotate(-90 ${e.x.toFixed(1)} ${r.toFixed(1)})" class="race-sim-marker-detail">${At(e.distanceLabel)}</text>
    </g>`}function mi(e,t){const a=new Set,s=t/1e3;for(let r=0;r<=s;r+=25)a.add(Math.round(r*1e3));return a.add(Math.round(t)),[...a].filter(r=>r>=0&&r<=t).sort((r,n)=>r-n)}function pi(e,t,a,s,r,n){const i=new Set(Je(t).map(o=>Math.round(o.kmMark*1e3)));return e.map(o=>{const c=Ae(o,a,s,r),p=i.has(o)?18:12,u=n+p+26;return`
      <g class="race-sim-distance-tick">
        <line x1="${c.toFixed(1)}" y1="${n.toFixed(1)}" x2="${c.toFixed(1)}" y2="${(n+p).toFixed(1)}" class="race-sim-axis"></line>
        <text x="${c.toFixed(1)}" y="${u.toFixed(1)}" text-anchor="middle" class="race-sim-grid-label">${At(Sl(o))}</text>
      </g>`}).join("")}function kl(e,t,a,s,r,n,i,o,c,l,p){const u=Ae(e.distanceMeter,a,s,n),m=_a(t,e.distanceMeter),f=Ue(m,c,l,r,i,o),g=e.riderCount===1?2.2:Math.min(6.6,3.4+e.riderCount*.28),b=e.riderCount>1?`<text x="${u.toFixed(1)}" y="${(f+2.6).toFixed(1)}" class="race-sim-cluster-label">${e.riderCount}</text>`:"";return`
    <g class="race-sim-cluster-group">
      <circle cx="${u.toFixed(1)}" cy="${f.toFixed(1)}" r="${g.toFixed(1)}" class="race-sim-cluster-dot${e.riderCount>1?" race-sim-cluster-dot-group":""}${p?" race-sim-cluster-dot-selected":""}"></circle>
      ${b}
    </g>`}function $l(e,t,a,s,r,n,i,o,c,l,p){const u=new Map(p.riders.map(f=>[f.id,f])),m=new Map((p.teams??[]).map(f=>[f.id,f.abbreviation]));return e.filter(f=>f.riderCount===1).map(f=>{const g=f.riderIds[0];if(g==null)return"";const b=u.get(g);if(!b)return"";const y=Ae(f.distanceMeter,a,s,n),v=_a(t,f.distanceMeter),T=Ue(v,c,l,r,i,o),w=b.activeTeamId!=null?m.get(b.activeTeamId)??"":"",M=`${b.lastName} (${w})`,$=T-34,E=T-40;return`
        <g class="race-sim-itt-rider-label-group">
          <line x1="${y.toFixed(1)}" y1="${(T-5).toFixed(1)}" x2="${y.toFixed(1)}" y2="${$.toFixed(1)}" stroke="rgba(31, 41, 55, .55)" stroke-width="1"></line>
          <text x="${y.toFixed(1)}" y="${E.toFixed(1)}" text-anchor="middle" class="race-sim-marker-detail">${At(M)}</text>
        </g>`}).join("")}function Tl(e,t,a,s,r,n,i,o,c,l,p){const u=Math.max(0,Math.min(l,e.distanceKm)),m=Math.max(0,Math.min(p,e.distanceKm));if(m<=u)return null;const f=[{kmMark:u,elevation:_a(e,u*1e3)},...e.points.filter(T=>T.kmMark>u&&T.kmMark<m),{kmMark:m,elevation:_a(e,m*1e3)}];if(f.length<2)return null;const g=r-i,b=f.map((T,w)=>{const M=Ae(T.kmMark*1e3,t,a,s),$=Ue(T.elevation,o,c,r,n,i);return`${w===0?"M":"L"} ${M.toFixed(1)} ${$.toFixed(1)}`}).join(" "),y=Ae(u*1e3,t,a,s),v=Ae(m*1e3,t,a,s);return`${b} L ${v.toFixed(1)} ${g.toFixed(1)} L ${y.toFixed(1)} ${g.toFixed(1)} Z`}function Ml(e,t,a,s,r={}){const p=e.distanceKm*1e3,{axisMinElevation:u,axisMaxElevation:m}=di(e),f=533,g=12,y=e.points.map(R=>{const N=Ae(R.kmMark*1e3,p,1584,28),P=Ue(R.elevation,u,m,634,168,101);return{x:N,y:P}}).map((R,N)=>`${N===0?"M":"L"} ${R.x.toFixed(1)} ${R.y.toFixed(1)}`).join(" "),v=`${y} L ${1556 .toFixed(1)} ${f.toFixed(1)} L ${28 .toFixed(1)} ${f.toFixed(1)} Z`,T=r.selectedClimbRange!=null?Tl(e,p,1584,28,634,168,101,u,m,r.selectedClimbRange.startKm,r.selectedClimbRange.endKm):null,w=ci(e,p,1584,28,634,168,101,u,m).map(R=>ui(R,g,f)).join(""),$=Array.from({length:5},(R,N)=>u+(m-u)/4*N).map(R=>{const N=Ue(R,u,m,634,168,101);return`
      <line x1="28" y1="${N.toFixed(1)}" x2="1556" y2="${N.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="28" y1="${N.toFixed(1)}" x2="${20 .toFixed(1)}" y2="${N.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${14 .toFixed(1)}" y="${(N+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Jt(R)}</text>`}).join(""),E=pi(mi(e,p),e,p,1584,28,f);return`
    <svg viewBox="0 0 1584 634" role="img" aria-label="${At(a)}" class="dashboard-stage-profile-svg dashboard-stage-profile-svg-large" data-stage-profile="${t}">
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
      ${E}
      ${`<text x="${28 .toFixed(1)}" y="${148 .toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>`}
    </svg>`}function xl(e,t,a,s,r){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}e.innerHTML=`<div class="dashboard-stage-profile-wrap">${Ml(t,a,s,!1,r)}</div>`}function wl(e,t,a,s,r,n="finish",i=null){if(t.points.length<2){e.innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';return}const o=1584,c=634,l=28,p=168,u=101,{axisMinElevation:m,axisMaxElevation:f}=di(t),g=c-u,b=12,y=Array.from({length:5},(G,x)=>m+(f-m)/4*x),v=js(a.clusters),T=Os(v),w=mi(t,a.stageDistanceMeters),$=t.points.map(G=>{const x=Ae(G.kmMark*1e3,a.stageDistanceMeters,o,l),L=Ue(G.elevation,m,f,c,p,u);return{x,y:L}}).map((G,x)=>`${x===0?"M":"L"} ${G.x.toFixed(1)} ${G.y.toFixed(1)}`).join(" "),E=`${$} L ${(o-l).toFixed(1)} ${g.toFixed(1)} L ${l.toFixed(1)} ${g.toFixed(1)} Z`,R=ci(t,a.stageDistanceMeters,o,l,c,p,u,m,f).map(G=>ui(G,b,g)).join(""),N=y.map(G=>{const x=Ue(G,m,f,c,p,u);return`
      <line x1="${l}" y1="${x.toFixed(1)}" x2="${o-l}" y2="${x.toFixed(1)}" class="race-sim-grid-line"></line>
      <line x1="${l}" y1="${x.toFixed(1)}" x2="${(l-8).toFixed(1)}" y2="${x.toFixed(1)}" class="race-sim-axis"></line>
      <text x="${(l-14).toFixed(1)}" y="${(x+4).toFixed(1)}" text-anchor="end" class="race-sim-grid-label race-sim-elevation-label">${Jt(G)}</text>`}).join(""),P=pi(w,t,a.stageDistanceMeters,o,l,g),D=new Map(v.map((G,x)=>[G,T[x]??null])),A=v.map(G=>{var x;return kl(G,t,a.stageDistanceMeters,o,c,l,p,u,m,f,((x=D.get(G))==null?void 0:x.label)===i)}).join(""),_=r.stage.profile==="ITT"?$l(v,t,a.stageDistanceMeters,o,c,l,p,u,m,f,r):"";e.innerHTML=`
    <div class="race-sim-profile-layout${r.stage.profile==="ITT"?" race-sim-profile-layout-itt":""}">
      <div class="race-sim-profile-canvas-wrap">
        <svg viewBox="0 0 ${o} ${c}" role="img" aria-label="${At(s)}">
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
          ${N}
          <line x1="${l}" y1="${g}" x2="${o-l}" y2="${g}" class="race-sim-axis"></line>
          <line x1="${l}" y1="${p}" x2="${l}" y2="${g}" class="race-sim-axis"></line>
          <g clip-path="url(#race-sim-profile-plot-clip)">
            <path d="${E}" fill="url(#race-sim-area)"></path>
            <path d="${$}" class="race-sim-profile-line"></path>
            ${R}
            ${A}
          </g>
          ${_}
          ${P}
          <text x="${l.toFixed(1)}" y="${(p-20).toFixed(1)}" class="race-sim-scale race-sim-scale-title" text-anchor="start">Höhe</text>
        </svg>
      </div>
    </div>`}const Il={Flat:1.25,Hill:1.1,Medium_Mountain:1.05,Mountain:1.05,High_Mountain:1.05,Cobble:1.05,Cobble_Hill:1.05,Abfahrt:1.2,Sprint:1.05},Br={Flat:{lateMultiplier:1,peakMultiplier:1},Hill:{lateMultiplier:1.1,peakMultiplier:1.6},Medium_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},High_Mountain:{lateMultiplier:1.6,peakMultiplier:2.5},Cobble:{lateMultiplier:1.5,peakMultiplier:1.5},Cobble_Hill:{lateMultiplier:1.5,peakMultiplier:1.5},Abfahrt:{lateMultiplier:1,peakMultiplier:1},Sprint:{lateMultiplier:1,peakMultiplier:1}};function Fs(e){switch(e){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":case"High_Mountain":return"mountain";case"Cobble":case"Cobble_Hill":return"cobble";case"Sprint":return"sprint";case"Abfahrt":return"downhill";default:return"flat"}}function es(e,t){return`${e}:${t}`}function Rl(e){return new Map(e.map(t=>[es(t.simulationMode,t.terrain),t.weights]))}function El(e){return new Map(e.map(t=>[es(t.simulationMode,t.terrain),t]))}function Fl(e){return e==="ITT"?"itt":e==="TTT"?"ttt":"road"}function gi(e,t,a){const s=a.get(es(e,t));if(!s)return[{key:Fs(t),weight:1}];const r=Object.entries(s).map(([n,i])=>({key:n,weight:i??0})).filter(n=>n.weight>0);return r.length>0?r:[{key:Fs(t),weight:1}]}function Cl(e,t,a,s){const r=gi(t,a,s),n=r.reduce((o,c)=>o+c.weight,0);return n<=0?e[Fs(a)]:r.reduce((o,c)=>o+e[c.key]*c.weight,0)/n}function Nl(e,t){const a=t.find(s=>s.simulationMode==="ttt"&&s.terrain===e);return(a==null?void 0:a.tttSpeedMultiplier)??Il[e]??1.05}function Pl(e,t,a){const s=a==null?void 0:a.get(es(e,t));return{lateMultiplier:(s==null?void 0:s.finalSpreadLateMultiplier)??Br[t].lateMultiplier,peakMultiplier:(s==null?void 0:s.finalSpreadPeakMultiplier)??Br[t].peakMultiplier}}const Ll=.005,Dl=.005,fi=70,hi=1e3,bi=15,yi=360,vi=8,Si=-.75,ki=10;function yt(e,t){return e+Math.random()*(t-e)}function $i(e,t,a){return Math.max(t,Math.min(a,e))}function Al(e){return e==="ITT"||e==="TTT"}function Ti(e,t){var a;return((a=e.role)==null?void 0:a.name)!=="Kapitaen"||e.activeTeamId==null?[]:t.filter(s=>{var r,n,i;return s.id!==e.id&&s.activeTeamId===e.activeTeamId&&(((r=s.role)==null?void 0:r.name)==="Edelhelfer"||((n=s.role)==null?void 0:n.name)==="Starke Helfer"||((i=s.role)==null?void 0:i.name)==="Wassertraeger")}).map(s=>s.id)}function Mi(){const e=Math.random();return e<.1?"severe":e<.35?"medium":"light"}function Bl(e,t,a,s){const r=s==="crash"?Mi():null,n=Number(yt(.5,Math.max(.6,a-.25)).toFixed(2)),i=Math.round(n*1e3),o=$i(n/Math.max(.1,a)*100,0,100),c=o<=fi;return{riderId:e.id,type:s,severity:r,triggerDistanceKm:n,triggerDistanceMeters:i,triggerDistancePercent:o,waitDurationSeconds:Math.round(s==="crash"?yt(10,60):yt(10,45)),recoverySeconds:c?hi:yi,recoveryFormBonus:c?bi:vi,dayFormPenalty:Si,staminaPenalty:ki,recoveryPenaltyStages:s==="crash"?r==="light"?[10,5,2]:[]:[],raceRecuperationPenalty:s==="crash"&&r==="medium"?15:0,supportRiderIds:Ti(e,t)}}function _l(e,t,a){if(Al(t.profile)||a<=0)return[];const s=[];for(const r of e){const n=Math.random(),i=Math.random(),o=Ll*Math.max(0,t.crashIncidentMultiplier??1),c=Dl*Math.max(0,t.mechanicalIncidentMultiplier??1),l=o+(t.rolledEffektSturz??0)/100,p=c+(t.rolledEffektDefekt??0)/100,u=n<l,m=i<p;if(!u&&!m)continue;const f=u&&m?n<=i?"crash":"mechanical":u?"crash":"mechanical",g=Bl(r,e,a,f);if(f==="crash"&&Math.random()<.01){g.isMassCrashTrigger=!0;const b=Math.floor(yt(2,26)),v=[...e.filter(T=>T.id!==r.id)].sort(()=>.5-Math.random());g.massCrashPotentialRiderIds=v.slice(0,b).map(T=>T.id),Math.random()<.2&&(g.hasAdditionalMechanical=!0,g.waitDurationSeconds+=Math.round(yt(10,45)))}s.push(g)}return s}function Gl(e,t,a,s){const r=Mi(),n=Math.round(a*1e3),i=$i(a/Math.max(.1,s)*100,0,100),o=i<=fi;let c=Math.round(yt(10,60)),l=!1;return Math.random()<.2&&(l=!0,c+=Math.round(yt(10,45))),{riderId:e.id,type:"crash",severity:r,triggerDistanceKm:a,triggerDistanceMeters:n,triggerDistancePercent:i,waitDurationSeconds:c,recoverySeconds:o?hi:yi,recoveryFormBonus:o?bi:vi,dayFormPenalty:Si,staminaPenalty:ki,recoveryPenaltyStages:r==="light"?[10,5,2]:[],raceRecuperationPenalty:r==="medium"?15:0,supportRiderIds:Ti(e,t),hasAdditionalMechanical:l}}function Hl(e,t){return e+Math.random()*(t-e)}function _r(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const s=Math.floor(Hl(0,a+1)),r=t[a];t[a]=t[s]??r,t[s]=r}return t}function zl(e){const t=new Map;for(const a of e)a.activeTeamId==null||t.has(a.activeTeamId)||t.set(a.activeTeamId,{id:a.activeTeamId,name:`Team ${a.activeTeamId}`,abbreviation:"---",divisionId:0,u23TeamId:null,isPlayerTeam:!1,countryCode:"---",colorPrimary:"#000000",colorSecondary:"#ffffff",aiFocus1:0,aiFocus2:0,aiFocus3:0});return[...t.values()]}function Kl(e,t,a={}){if(e.length===0)return[];const s=e.map(f=>({...f,hasSuperform:!1,hasSupermalus:!1,specialFormDelta:0})),r=a.teams??zl(s),n=Ts(s,r,t,a),i=new Set(n.slice(0,20).map(f=>f.rider.id)),o=Math.min(Math.ceil(s.length*.02),Math.max(0,s.length-i.size)),c=Math.min(Math.ceil(s.length*.01),s.length),l=_r(s.filter(f=>!i.has(f.id))),p=new Set(l.slice(0,o).map(f=>f.id)),u=_r(s.filter(f=>!p.has(f.id))),m=new Set(u.slice(0,c).map(f=>f.id));return s.map(f=>p.has(f.id)?{...f,hasSuperform:!0,hasSupermalus:!1,specialFormDelta:4}:m.has(f.id)?{...f,hasSuperform:!1,hasSupermalus:!0,specialFormDelta:-6}:f)}function Kt(e,t){const a=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(s-a+1))+a}function Gr(e,t){return e+Math.random()*(t-e)}function Wl(e,t,a){const s=[...e],r=[];for(;r.length<t&&s.length>0;){const n=s.reduce((l,p)=>l+Math.max(1e-4,a(p)),0);let i=Math.random()*n,o=0;for(let l=0;l<s.length;l+=1)if(i-=Math.max(1e-4,a(s[l])),i<=0){o=l;break}const[c]=s.splice(o,1);c&&r.push(c)}return r}function Hr(e,t){return new Set(e.filter(a=>a.kind==="rider"&&a.riderId!=null).slice(0,t).map(a=>a.riderId))}function zr(e,t){return new Set(e.slice(0,t).map(a=>a.riderId))}function jl(e,t,a){return new Set(e.map(s=>s.riderId).filter(s=>s!=null&&!t.has(s)).slice(0,a))}function Ol(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function ot(e){var t;return Ol((t=e.role)==null?void 0:t.name)}function Vl(e){return Je(e).some(({marker:t})=>ut(t))}function Ul(e){return Math.max(1,Math.pow(10,(e.skills.attack-65)/10))}function Yl(e,t){const a=Ul(e),s=e.hasSuperform===!0?40:1,r=!t.isEarlyStageRace&&t.race.isStageRace&&t.gcLeaderTeamId!=null&&e.activeTeamId===t.gcLeaderTeamId?.25:1,n=t.stageHasMountainClassifications&&t.topMountainIds.has(e.id)?50:1,i=t.isHardStage&&ot(e)==="sprinter"&&e.skills.hill>67?20:1,o=a*s*r*n*i;return{attackFactor:a,superformFactor:s,gcLeaderTeamFactor:r,mountainFactor:n,sprinterFactor:i,finalWeight:o}}function Zl(e){return e.profile==="Hilly_Difficult"||e.profile==="Medium_Mountain"||e.profile==="Mountain"||e.profile==="High_Mountain"||e.profile==="Cobble_Hill"}function Jl(e,t){var s,r;const a=((s=t[0])==null?void 0:s.riderId)??null;return a==null?null:((r=e.find(n=>n.id===a))==null?void 0:r.activeTeamId)??null}function ql(e,t,a){const s=new Map(t.map(n=>[n.id,n])),r=new Set;for(const n of e){if(n.kind!=="rider"||n.riderId==null)continue;const i=s.get(n.riderId)??null;if(!(!i||i.activeTeamId==null||r.has(i.activeTeamId))&&(r.add(i.activeTeamId),r.size>=a))break}return r}function Xl(e){const t=new Map;for(const a of e)a.activeTeamId!=null&&(t.has(a.activeTeamId)||t.set(a.activeTeamId,!1),ot(a)==="kapitaen"&&t.set(a.activeTeamId,!0));return t}function Ql(e,t,a){if(e.isStageRace&&t.stageNumber<=8){const i=Math.max(1,Math.ceil(a*.01)),o=Math.max(i,Math.ceil(a*.06));return{min:i,max:o}}const s=t.stageNumber<=10,r=Math.max(1,Math.floor(a*(s?.01:.05))),n=Math.max(r,Math.floor(a*(s?.08:.2)));return{min:r,max:n}}function ed(e,t){return!e.isStageRace||t.stageNumber<=8?{min:.45,max:.6}:t.stageNumber<=15?{min:.45,max:.75}:{min:.5,max:.85}}function td(e,t,a,s,r,n,i){if(a.profile==="ITT"||a.profile==="TTT"||e.length===0||s.distanceKm<=0)return null;const o=e.length,{min:c,max:l}=Ql(t,a,o),p=Kt(c,l),u=t.isStageRace&&a.stageNumber<=10,m=!t.isStageRace,f=Jl(e,n),g=u?ql(r,e,5):new Set,b=u?Xl(e):new Map,y=Vl(s),v=Hr(r,5),T=zr(n,10),w=new Set([...v,...T]),M=y?jl(i,w,5):new Set,$=Zl(a),E=["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain"].includes(a.profile),R=t.isStageRace&&E&&a.stageNumber>=4;let N;const P=new Set;if(R){const I=Hr(r,20),C=zr(n,10);let F=[];for(const H of r){if(H.kind!=="rider"||H.riderId==null)continue;const z=H.riderId;if(!I.has(z)||!C.has(z))continue;const k=e.find(W=>W.id===z);if(!k||k.activeTeamId==null)continue;const B=ot(k);(B==="kapitaen"||B==="co-kapitaen")&&(F.includes(k.activeTeamId)||F.push(k.activeTeamId))}if(F.length===0)for(const H of r){if(H.kind!=="rider"||H.riderId==null)continue;const z=H.riderId;if(!I.has(z)||!C.has(z))continue;const k=e.find(W=>W.id===z);if(!k||k.activeTeamId==null)continue;ot(k)==="edelhelfer"&&(F.includes(k.activeTeamId)||F.push(k.activeTeamId))}if(F.length>5&&(F=F.slice(0,5)),F.length>0&&Math.random()<.5){const H=Kt(0,F.length-1);N=F[H]}}if(N!=null){const I=e.filter(H=>H.activeTeamId===N),C=I.filter(H=>ot(H)==="kapitaen"),F=I.filter(H=>ot(H)==="co-kapitaen");if(C.length>0){if(C.forEach(H=>P.add(H.id)),C.length===1&&F.length>0){const H=[...F].sort((z,k)=>k.overallRating-z.overallRating||k.id-z.id);P.add(H[0].id)}}else if(F.length>0)[...F].sort((z,k)=>k.overallRating-z.overallRating||k.id-z.id).slice(0,2).forEach(z=>P.add(z.id));else{const H=I.filter(z=>ot(z)==="edelhelfer");if(H.length>0){const z=[...H].sort((k,B)=>B.overallRating-k.overallRating||B.id-k.id);P.add(z[0].id)}}}let D;if(N!=null){const C=e.filter(F=>F.activeTeamId===N).filter(F=>!P.has(F.id));C.length>0&&(D=[...C].sort((H,z)=>z.skills.attack-H.skills.attack||z.overallRating-H.overallRating||z.id-H.id)[0])}const A=e.filter(I=>{if(I.activeTeamId==null||v.has(I.id)||T.has(I.id)||N!=null&&I.activeTeamId===N&&(P.has(I.id)||D!=null&&I.id===D.id)||u&&f!=null&&I.activeTeamId===f||u&&g.has(I.activeTeamId))return!1;const C=ot(I);return!(m&&(C==="kapitaen"||C==="co-kapitaen")||u&&C==="kapitaen"||u&&C==="co-kapitaen"&&b.get(I.activeTeamId)!==!0||C==="sprinter"&&(t.isStageRace&&a.stageNumber<=5||!t.isStageRace&&["Flat","Rolling","Hilly"].includes(a.profile)))});if(A.length===0)return null;const _=new Map(A.map(I=>[I.id,Yl(I,{isEarlyStageRace:u,race:t,gcLeaderTeamId:f,stageHasMountainClassifications:y,topMountainIds:M,isHardStage:$})])),G=A.reduce((I,C)=>{var F;return I+(((F=_.get(C.id))==null?void 0:F.finalWeight)??0)},0),x=Wl(A,Math.max(0,Math.min(p-(D?1:0),A.length)),I=>{var C;return((C=_.get(I.id))==null?void 0:C.finalWeight)??1});if(D&&x.push(D),x.length===0)return null;console.groupCollapsed(`[BreakawaySelection] ${a.profile} Etappe ${a.stageNumber}: ${x.length}/${p} ausgewählt aus ${A.length}`),console.log(`Gesamtgewicht im Pool: ${G.toFixed(2)}`),console.table(x.map(I=>{var F;const C=_.get(I.id);return{Fahrer:`${I.firstName} ${I.lastName}`,Team:I.activeTeamId,Rolle:((F=I.role)==null?void 0:F.name)??null,Atk:I.skills.attack,Hill:I.skills.hill,Chance:`${((G>0&&C!=null?C.finalWeight/G:0)*100).toFixed(2)}%`,Gewicht:((C==null?void 0:C.finalWeight)??1).toFixed(2),Attacke:`x${((C==null?void 0:C.attackFactor)??1).toFixed(2)}`,Superform:`x${(C==null?void 0:C.superformFactor)??1}`,GC_Team:`x${((C==null?void 0:C.gcLeaderTeamFactor)??1).toFixed(2)}`,Berg:`x${(C==null?void 0:C.mountainFactor)??1}`,Sprinter:`x${(C==null?void 0:C.sprinterFactor)??1}`}})),console.groupEnd();const L=s.distanceKm*1e3,O=Kt(0,Math.min(1e4,Math.max(0,Math.floor(L*.1)))),K=ed(t,a),se=Math.round(L*Gr(K.min,K.max)),Q=Math.round(L*Gr(.1,.25)),V=Math.max(O+1e3,Math.min(se-1e3,se-Q)),J=a.rolledBreakawayBonus??0,Y=Kt(3+J,8+J);return{riderIds:x.map(I=>I.id),triggerDistanceMeters:O,groupPhaseEndDistanceMeters:V,phaseEndDistanceMeters:se,skillBonus:Y,malusValue:Kt(5,8),superTeamId:N}}const ad=new Set(["Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill"]),sd=3,rd=7,Kr=120,Wr=200,jr=180,nd=10,ga=8e3;function vt(e,t,a=Math.random()){const s=Math.ceil(Math.min(e,t)),r=Math.floor(Math.max(e,t));return Math.floor(a*(r-s+1))+s}function id(e){for(let t=e.length-1;t>0;t-=1){const a=vt(0,t);[e[t],e[a]]=[e[a],e[t]]}return e}function Ga(e,t){return t<=0||e.length===0?[]:id([...e]).slice(0,Math.min(t,e.length))}function od(e,t,a){if(t<=0||e.length===0)return[];const s=[...e],r=[];for(;s.length>0&&r.length<t;){const n=s.reduce((c,l)=>c+Math.max(0,a(l)),0);if(n<=0){r.push(...Ga(s,t-r.length));break}let i=Math.random()*n,o=s.length-1;for(let c=0;c<s.length;c+=1)if(i-=Math.max(0,a(s[c])),i<=0){o=c;break}r.push(s[o]),s.splice(o,1)}return r}function ld(e){return ad.has(e.profile)}function dd(e){return e.gradient_percent>5||e.terrain==="Cobble"||e.terrain==="Cobble_Hill"}function cd(e,t){if(!ld(e)||t.distanceKm<=0)return[];const a=t.distanceKm*1e3*Math.max(0,Math.min(1,e.finalPushStartPercent/100));return t.segments.flatMap(s=>{if(!dd(s))return[];const r=s.start_km*1e3,n=s.end_km*1e3,i=Math.max(r,a);return i>=n?[]:[{startMeters:i,endMeters:n,sourceSegmentStartMeters:r,sourceSegmentEndMeters:n}]})}function Or(e,t){const a=t==null?e:e.filter(c=>{const l=Math.min(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t)),p=Math.max(Math.abs(c.startMeters-t),Math.abs(c.endMeters-t));return l>=ga||p>=ga});if(a.length===0)return null;const s=a[vt(0,a.length-1)];if(!s)return null;const r=Math.ceil(s.startMeters),n=Math.floor(s.endMeters);if(n<=r)return null;let i=0;for(;i<12;){const c=vt(r,n);if(t==null||Math.abs(c-t)>=ga)return{triggerDistanceMeters:c,sourceSegmentStartMeters:s.sourceSegmentStartMeters,sourceSegmentEndMeters:s.sourceSegmentEndMeters};i+=1}const o=t!=null&&t<s.startMeters?n:r;return t==null||Math.abs(o-t)>=ga?{triggerDistanceMeters:o,sourceSegmentStartMeters:s.sourceSegmentStartMeters,sourceSegmentEndMeters:s.sourceSegmentEndMeters}:null}function ud(e,t,a,s=()=>1){const r=e.slice(0,15),n=cd(t,a);if(r.length===0||n.length===0)return[];const i=vt(sd,Math.min(rd,r.length)),o=od(r,i,s),c=[];for(const m of o){const f=Or(n);f&&c.push({riderId:m.id,attackNumber:1,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:vt(Kr,Wr),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}if(c.length===0)return[];const l=c.map(m=>m.riderId),p=Math.floor(l.length*.5),u=new Set(Ga(l,p));for(const m of[...c]){if(!u.has(m.riderId))continue;const f=Or(n,m.triggerDistanceMeters);f&&c.push({riderId:m.riderId,attackNumber:2,triggerDistanceMeters:f.triggerDistanceMeters,durationSeconds:vt(Kr,Wr),sourceSegmentStartMeters:f.sourceSegmentStartMeters,sourceSegmentEndMeters:f.sourceSegmentEndMeters,isCounterAttack:!1})}return c.sort((m,f)=>m.triggerDistanceMeters-f.triggerDistanceMeters||m.riderId-f.riderId||m.attackNumber-f.attackNumber)}function md(e,t,a){var c;if(e.length===0)return[];const s=((c=e.find(l=>l.kind==="rider"&&l.riderId===t))==null?void 0:c.teamId)??null,r=e.filter(l=>!(l.kind!=="rider"||l.riderId==null||l.riderId===t||a.has(l.riderId)||s!=null&&l.teamId===s));if(r.length===0)return[];const n=new Map;for(const l of r){const p=n.get(l.teamId)??[];p.push(l),n.set(l.teamId,p)}const i=[...n.values()].map(l=>Ga(l,1)[0]??null).filter(l=>l!=null&&l.riderId!=null);if(i.length===0)return[];const o=Math.min(vt(0,3),i.length);return Ga(i,o).map(l=>l.riderId)}function pd(e,t){const a=[],s=[];for(const[r,n]of e.entries()){const i=Math.max(0,n.remainingSeconds-t);if(i<=0){s.push(r);continue}a.push({...n,remainingSeconds:i})}return{newActiveAttacks:a,expiredRiderIds:s}}function Vr(e,t){const a=Math.ceil(Math.min(e,t)),s=Math.floor(Math.max(e,t));return Math.floor(Math.random()*(s-a+1))+a}const gd={sprint:.46,acceleration:.24,hill:.06,attack:.08,resistance:.08,stamina:.04,flat:.04},fd={sprint:.45,acceleration:.2,hill:.04,attack:.06,resistance:.06,stamina:.04,flat:.15},hd={mountain:.05,mediumMountain:.05,hill:.28,sprint:.18,acceleration:.12,attack:.12,resistance:.1,stamina:.06,flat:.04},bd={mountain:.38,mediumMountain:.2,hill:.1,sprint:.03,acceleration:.03,attack:.12,resistance:.08,stamina:.06},yd={HC:{mountain:.4,mediumMountain:.2,hill:.07,sprint:.01,acceleration:.02,attack:.16,resistance:.08,stamina:.06},1:{mountain:.31,mediumMountain:.18,hill:.12,sprint:.03,acceleration:.04,attack:.16,resistance:.09,stamina:.07},2:{mountain:.2,mediumMountain:.14,hill:.22,sprint:.08,acceleration:.08,attack:.15,resistance:.08,stamina:.05},3:{mountain:.05,mediumMountain:.09,hill:.27,sprint:.14,acceleration:.12,attack:.16,resistance:.1,stamina:.07},4:{hill:.3,sprint:.18,acceleration:.16,attack:.16,resistance:.12,stamina:.08}};function vd(e){const t=new Map;for(const a of e){const s=a.weights;if(a.appliesTo==="sprint_intermediate")t.set("sprint_intermediate",s);else if(a.appliesTo==="climb_top"){const r=!a.markerCategory||a.markerCategory==="Sprint"?"HC":a.markerCategory;t.set(`climb_top|${r}`,s)}else a.appliesTo==="finish"&&t.set(a.markerType,s)}return t}const fa=20,Sd=120,kd=300,us=.025,$d=.1,Td=.4,Md=.6,xd=.8,qt=1,Ur=2/3,wd=.1,ha=10,Yr=50,Id=25,Rd=7,Ed=500,Fd=100,Cd=.02,Nd=.04,Pd=.009,Ld=120,Dd=150,Ad=100,Bd=300,Zr=50,ms=85,pt=[{kmMark:100,value:.5},{kmMark:150,value:1},{kmMark:175,value:2},{kmMark:200,value:3},{kmMark:250,value:8},{kmMark:300,value:15}],Jr=5*60,_d=60,Gd=.5,Hd=.3,ba=5e3,zd=2e3,Kd=1,Wd=2,jd=.05,xi={flat:"Fl",mountain:"Berg",mediumMountain:"MB",hill:"Hgl",timeTrial:"ZF",prologue:"Pro",cobble:"Pf",sprint:"Spr",acceleration:"Acc",downhill:"Abf",attack:"Atk",stamina:"Sta",resistance:"Res",recuperation:"Rec",bikeHandling:"Ftg"},Od={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"},ya=[{gradientPercent:2,draftPenaltyShare:.1},{gradientPercent:3,draftPenaltyShare:.15},{gradientPercent:4,draftPenaltyShare:.2},{gradientPercent:5,draftPenaltyShare:.3},{gradientPercent:6,draftPenaltyShare:.45},{gradientPercent:7,draftPenaltyShare:.8},{gradientPercent:8,draftPenaltyShare:.9},{gradientPercent:9,draftPenaltyShare:.92},{gradientPercent:10,draftPenaltyShare:.94},{gradientPercent:12,draftPenaltyShare:.96},{gradientPercent:15,draftPenaltyShare:.98},{gradientPercent:20,draftPenaltyShare:1}];function ue(e,t,a){return Math.max(t,Math.min(a,e))}function de(e,t){return e+Math.random()*(t-e)}function qr(e){return e[Math.floor(Math.random()*e.length)]}function Ct(e){return Math.round(e*100)/100}function Vd(e){let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619);return(t>>>0)/4294967295}function Xr(e){if(e<2)return 1;const t=ue(e,2,20),a=ya[0];if(t<=a.gradientPercent)return 1-a.draftPenaltyShare;for(let s=1;s<ya.length;s+=1){const r=ya[s-1],n=ya[s];if(t>n.gradientPercent)continue;const i=(t-r.gradientPercent)/Math.max(1e-4,n.gradientPercent-r.gradientPercent),o=r.draftPenaltyShare+(n.draftPenaltyShare-r.draftPenaltyShare)*i;return Math.max(0,1-o)}return 0}function Ud(e){return e==="Flat"?Ld:e==="Abfahrt"?Dd:Number.POSITIVE_INFINITY}function Yd(e){switch(e){case"Flat":return"Flat";case"Hill":return"Hill";case"Medium_Mountain":return"Medium_Mountain";case"Mountain":case"High_Mountain":return"Mountain";case"Cobble":case"Cobble_Hill":return"Cobble";case"Sprint":return"Sprint";case"Abfahrt":return"Downhill";default:return"Flat"}}function Ha(e){return(e.formBonus??0)+(e.raceFormBonus??0)-((e.fatigueMalus??0)+(e.longTermFatigueMalus??0)+(e.shortTermFatigueMalus??0))*.5}function Zd(e,t){if(t.length===0)return"";const a=t.reduce((p,u)=>p+u.weight,0),s=t.map(p=>{const u=e.skills[p.key],m=Math.round(p.weight/a*100);return`${xi[p.key]} ${Math.round(u)} (${m}%)`}),r=e.formBonus??0,n=e.raceFormBonus??0,i=(e.fatigueMalus??0)*.5,o=(e.longTermFatigueMalus??0)*.5,c=(e.shortTermFatigueMalus??0)*.5;s.push(`S-Form ${r>=0?"+":""}${r.toFixed(1).replace(".",",")}`),s.push(`R-Form ${n>=0?"+":""}${n.toFixed(1).replace(".",",")}`),i>0&&s.push(`Fatigue -${i.toFixed(1).replace(".",",")}`),o>0&&s.push(`Langzeit -${o.toFixed(1).replace(".",",")}`),c>0&&s.push(`Akut -${c.toFixed(1).replace(".",",")}`);let l=0;if(e.mentorBoosts)for(const p of t)l+=(e.mentorBoosts[p.key]||0)*(p.weight/a);return l>0&&s.push(`Mentor +${l.toFixed(1).replace(".",",")}`),s.join(" • ")}function Jd(){const e=Math.random();return e<.9?de(5,20):e<.98?de(20,40):de(40,70)}function Qr(){const e=Math.random();return e<.9?Ct(de(-1,1)):e<.995?Ct(qr([-1,1])*de(1,2)):Ct(qr([-1,1])*de(3,4))}function qd(){return Ct(de(-3,3))}function Xd(e){const t=[];let a=0,s=Jd(),r=de(-1,1);for(;a<e;){const n=Math.min(e-a,de(3e3,4e4));if(t.push({startMeter:a,endMeter:a+n,windSpeedKph:s,vector:r}),a+=n,a>=e)break;s=ue(s+(Math.random()<.5?-1:1)*de(2,10),5,70),r=ue(r+(Math.random()<.5?-1:1)*de(0,.5),-1,1)}return t}function wi(e,t){const a=ee(e),s=ee(t);if(a!==s)return a?1:-1;const r=he(e),n=he(t);return r&&n?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||t.photoFinishScore-e.photoFinishScore||e.rider.id-t.rider.id:r?-1:n?1:e.distanceCoveredMeters!==t.distanceCoveredMeters?t.distanceCoveredMeters-e.distanceCoveredMeters:e.rider.id-t.rider.id}function ee(e){return e.finishStatus==="dnf"||e.finishTimeSeconds!=null}function he(e){return e.finishStatus!=="dnf"&&e.finishTimeSeconds!=null}function Wt(e,t,a=!1,s=null){var c;const r="rider"in e?e.rider:null,n=(r==null?void 0:r.specialization1)??null,i=(r==null?void 0:r.specialization2)??null;let o=0;if(t==="sprint_intermediate")n==="Berg"?o-=3:i==="Berg"&&(o-=2),n==="Sprint"?o+=1:i==="Sprint"&&(o+=.5);else if(t==="finish_flat")n==="Sprint"?o+=2:i==="Sprint"&&(o+=1),a&&((n==="Sprint"||i==="Sprint")&&(o+=1),n==="Berg"?o-=3:i==="Berg"&&(o-=2));else if(t==="climb_top"){const l=(c=r==null?void 0:r.role)==null?void 0:c.name;s==="4"?(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),(l==="Edelhelfer"||l==="Starke Helfer")&&(o+=2),l==="Wassertraeger"&&(o+=1),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=3)):(n==="Sprint"?o-=3:i==="Sprint"&&(o-=1.5),l==="Edelhelfer"&&(o+=3),l==="Starke Helfer"&&(o+=1.5),l==="Wassertraeger"&&(o+=.5),l==="Co-Kapitaen"&&(o-=1),l==="Kapitaen"&&(o-=2)),(n==="Attacker"||i==="Attacker")&&(o+=3)}return o}function Qd(e,t,a=null,s=null,r=!1){var f,g;const n=b=>b.photoFinishScore;if(!t){const b=[...e].sort((v,T)=>v.crossingTimeSeconds-T.crossingTimeSeconds||T.photoFinishScore-v.photoFinishScore||v.riderId-T.riderId),y=((f=b[0])==null?void 0:f.crossingTimeSeconds)??0;return b.map((v,T)=>({riderId:v.riderId,rank:T+1,crossingTimeSeconds:v.crossingTimeSeconds,gapSeconds:Math.max(0,v.crossingTimeSeconds-y),photoFinishScore:v.photoFinishScore}))}const i=[...e].sort((b,y)=>b.crossingTimeSeconds-y.crossingTimeSeconds||y.photoFinishScore-b.photoFinishScore||b.riderId-y.riderId),o=((g=i[0])==null?void 0:g.crossingTimeSeconds)??0,c=[];let l=[],p=0,u=null;const m=()=>{const b=Math.max(0,p-o),y=l.sort((v,T)=>n(T)-n(v)||v.riderId-T.riderId);for(const v of y)c.push({riderId:v.riderId,rank:c.length+1,crossingTimeSeconds:v.crossingTimeSeconds,gapSeconds:b,photoFinishScore:v.photoFinishScore})};for(const b of i){if(l.length===0){l=[b],p=b.crossingTimeSeconds,u=b.crossingTimeSeconds;continue}if(u!=null&&b.crossingTimeSeconds-u<=qt){l.push(b),u=b.crossingTimeSeconds;continue}m(),l=[b],p=b.crossingTimeSeconds,u=b.crossingTimeSeconds}return l.length>0&&m(),c}function ec(e,t,a){const s=e.filter(he).sort((u,m)=>(u.finishTimeSeconds??0)-(m.finishTimeSeconds??0)||m.photoFinishScore-u.photoFinishScore||u.rider.id-m.rider.id),r=e.filter(u=>!ee(u)).sort(wi),n=e.filter(u=>u.finishStatus==="dnf").sort((u,m)=>m.distanceCoveredMeters-u.distanceCoveredMeters||u.rider.id-m.rider.id),i=[];let o=[],c=null;const l=u=>u.photoFinishScore,p=()=>{i.push(...o.sort((u,m)=>l(m)-l(u)||u.rider.id-m.rider.id))};for(const u of s){const m=u.finishTimeSeconds??0;if(o.length===0){o=[u],c=m;continue}if(c!=null&&m-c<=qt){o.push(u),c=m;continue}p(),o=[u],c=m}return o.length>0&&p(),[...i,...r,...n]}function tc(e,t){const a=ee(e),s=ee(t);if(a!==s)return a?1:-1;const r=t.distanceCoveredMeters-e.distanceCoveredMeters;return Math.abs(r)>=.1?r:e.tempSpeedMps!==t.tempSpeedMps?t.tempSpeedMps-e.tempSpeedMps:he(e)&&he(t)?(e.finishTimeSeconds??0)-(t.finishTimeSeconds??0)||e.rider.id-t.rider.id:he(e)?-1:he(t)?1:e.rider.id-t.rider.id}function en(e){const t=ue(e,1,Yr);return t<=2?.12*t:t<=ha?.24+(t-2)/Math.max(1,ha-2)*.58:.82+(t-ha)/Math.max(1,Yr-ha)*.18}function ps(e,t){const a=Ha(e.rider);return Object.entries(t).reduce((s,[r,n])=>{if(!n)return s;const i=r==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[r]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return s+o*n},0)}function ac(e,t){const a=Ha(e.rider);return Object.entries(t).filter(s=>!!s[1]).map(([s,r])=>{const n=s,i=n==="stamina"?e.staminaSkillPenalty+e.incidentStaminaPenalty:0,o=Math.max(0,e.rider.skills[n]+a+e.dailyForm+e.microForm+e.teamGroupBonus-i);return{skillKey:n,weight:r,effectiveSkill:o,contribution:o*r}})}function sc(e,t,a){let s=t;for(;s>0;){const n=e[s-1].distanceCoveredMeters-e[s].distanceCoveredMeters;if(n<=0||n>=a)break;s-=1}let r=t;for(;r<e.length-1;){const n=e[r].distanceCoveredMeters-e[r+1].distanceCoveredMeters;if(n<=0||n>=a)break;r+=1}return{startIndex:s,endIndex:r,size:r-s+1,positionInGroup:t-s}}function rc(e,t){if(e<Id)return!1;const a=Math.max(1,Math.floor(e*.1));return t<a}class Ii{constructor(t,a){var _,G;this.bootstrap=t,this.weightedSkillComponentsByTerrain=new Map,this.skillBreakdownCache=new Map,this.teamSprintRandomValues=new Map,this.teamSprintSpecialRandomValues=new Map,this.teamBestSprinterRiderId=new Map,this.lastTeamGroupBonusByRiderId=null,this.draftOrderScratch=[],this.elapsedSeconds=0,this.activeStageAttacksByRiderId=new Map,this.nextBreakawayGapPenaltyMarkerIndex=0,this.nextBreakawayGapPenaltyFallbackIndex=0,this.breakawayGapStatus=null,this.breakawayPhaseActive=!1,this.breakawayGroupPhaseEnded=!1,this.breakawayPhaseEnded=!1,this.breakawayCaughtLogged=!1,this.messages=[],this.allEvents=[],this.nextMessageId=1,this.superTeamProtectedLeaderIds=new Set,this.superTeamBonusAmount=0,this.superTeamMalusAmount=0,this.superTeamStartPercent=0,this.superTeamEndPercent=0,this.hasLoggedFinishSprintTieBreak=!1,this.hasAppliedSprintLeadoutBonuses=!1,this.maxSubstepSeconds=(a==null?void 0:a.maxSubstepSeconds)??1;const s=(_=t.race.country)==null?void 0:_.code3;s&&(t.riders=t.riders.map(x=>{var O;const L=x.nationality||((O=x.country)==null?void 0:O.code3);if(L&&L.trim().toUpperCase()===s.trim().toUpperCase()){const K={...x,skills:{...x.skills}},se=Math.random(),Q=t.stage.profile,V=Q==="ITT"||Q==="TTT",J=["flat","hill","sprint","acceleration","stamina","resistance","recuperation","bikeHandling"];(Q==="Cobble"||Q==="Cobble_Hill")&&J.push("cobble"),["Flat","Rolling","Cobble","Cobble_Hill","ITT","TTT"].includes(Q)||J.push("mountain","mediumMountain");const F=[...(H=>{const z=[...J],k=[];if(V){k.push("timeTrial");const B=Math.min(H-1,z.length);for(let W=0;W<B;W++){const U=Math.floor(Math.random()*z.length);k.push(z.splice(U,1)[0])}}else{const B=Math.min(H,z.length);for(let W=0;W<B;W++){const U=Math.floor(Math.random()*z.length);k.push(z.splice(U,1)[0])}}return k})(5)].sort(()=>Math.random()-.5);if(K.homeEffectSkills=F,se<.05){K.homeEffect="home_pressure";for(const H of F)K.skills[H]=Math.max(0,K.skills[H]-.5)}else if(se<.1){K.homeEffect="super_home";const H=F[0];K.skills[H]=Math.min(100,K.skills[H]+3);for(let z=1;z<5;z++){const k=F[z];K.skills[k]=Math.min(100,K.skills[k]+1)}}else{K.homeEffect="normal_home";for(const H of F)K.skills[H]=Math.min(100,K.skills[H]+1)}return K}return x})),this.stageDistanceMeters=t.stageSummary.distanceKm*1e3,this.isIndividualTimeTrial=t.stage.profile==="ITT",this.isTeamTimeTrial=t.stage.profile==="TTT",this.isTimeTrialMode=this.isIndividualTimeTrial||this.isTeamTimeTrial,this.simulationMode=Fl(t.stage.profile),this.skillWeightRuleMap=Rl(t.skillWeightRules??[]),this.skillWeightConfigMap=El(t.skillWeightRules??[]),this.stageScoringWeightMap=vd(t.stageScoringRules??[]),this.finishWeightProfile=this.resolveFinishWeightProfile(),this.windZones=Xd(this.stageDistanceMeters),this.intermediateMarkers=this.buildIntermediateMarkers();const r=t.stage.finalSpreadStartPercent;this.lateStageStartRatio=r!=null?ue(r/100,0,1):de(Md,xd);const n=t.stage.finalPushStartPercent;this.finalPushStartRatio=n!=null?ue(n/100,this.lateStageStartRatio,1):ue(.9,this.lateStageStartRatio,1),this.finalSpreadDifficultyMultiplier=t.stage.finalSpreadDifficultyMultiplier??1,this.spreadCurve=this.buildSpreadCurve(this.lateStageStartRatio);const i=_l(t.riders,t.stage,t.stageSummary.distanceKm);if(this.incidentsByRiderId=new Map(i.map(x=>[x.riderId,x])),i.length>0){console.log("[RaceIncidents] Vor der Etappe ausgewuerfelt:",i.map(L=>({riderId:L.riderId,type:L.type,severity:L.severity,kmMark:L.triggerDistanceKm,waitDurationSeconds:L.waitDurationSeconds,supportRiderIds:L.supportRiderIds})));const x=i.filter(L=>L.isMassCrashTrigger);x.length>0&&x.forEach(L=>{var O;console.log(`[RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer ${L.riderId} bei Km ${L.triggerDistanceKm}. Potenziell betroffene Fahrer (${(O=L.massCrashPotentialRiderIds)==null?void 0:O.length}):`,L.massCrashPotentialRiderIds)})}const o=t.riders.map(x=>{const L={rider:x,riderName:`${x.firstName} ${x.lastName}`,startOffsetSeconds:0,hasStarted:!this.isTimeTrialMode,distanceCoveredMeters:0,nextDistanceCoveredMeters:null,segmentStartKm:0,segmentEndKm:0,segmentStartElevation:0,segmentEndElevation:0,dailyForm:qd(),microForm:Qr(),nextFormUpdateMeter:de(5e3,4e4),finishTimeSeconds:null,segmentIndex:0,windZoneIndex:0,activeTerrain:"Flat",skillName:"Flat",skillBreakdown:"",baseSkill:0,teamGroupBonus:0,effectiveSkill:0,staminaPenalty:0,staminaSkillPenalty:0,elevationPenalty:0,staminaPenaltyKmBucket:0,elevationPenaltyHmBucket:0,gradientPercent:0,gradientModifier:1,windModifier:1,draftModifier:1,draftNearbyRiderCount:0,draftPackFactor:0,tempSpeedMps:0,currentSpeedMps:0,photoFinishScore:0,nextIntermediateIndex:0,lastSplitLabel:null,lastSplitTimeSeconds:null,splitTimes:{},markerCrossings:{},finishStatus:null,statusReason:null,pendingIncident:this.incidentsByRiderId.get(x.id)??null,appliedIncident:null,incidentDelaySecondsRemaining:0,incidentRecoverySecondsRemaining:0,incidentRecoveryFormBonus:0,incidentStaminaPenalty:0,dailyFormCap:null,waitingForCaptainId:null,waitForCaptainRecovery:!1,waitLogged:!1,breakawayMalus:0,breakawayInitialMalus:0,breakawayRecoveryStartDistanceMeters:null,breakawayGapPenalty:0,breakawayFallbackCheckpointTimes:[],nextBreakawayFallbackCheckpointIndex:0,isAttacking:!1,isBreakaway:!1,isLeadingGroup:!this.isTimeTrialMode};return this.applyPersistentStageRaceState(L),L}),c=new Map(o.map(x=>[x.rider.id,x.dailyForm]));this.stageFavorites=qn(t.riders,t.teams,t.stage,{distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:c});const l=this.stageFavorites.filter(x=>x.kind==="rider"&&x.riderId!=null).slice(0,15).map(x=>t.riders.find(L=>L.id===x.riderId)??null).filter(x=>x!=null),p=((G=t.gcStandings.find(x=>x.rank===1))==null?void 0:G.riderId)??null,u=ud(l,t.stage,t.stageSummary,x=>Math.max(1,Math.pow(10,(x.skills.attack-65)/10))*(x.id===p?.25:1));this.precalculatedStageAttacksByRiderId=new Map;for(const x of u){const L=this.precalculatedStageAttacksByRiderId.get(x.riderId)??[];L.push(x),this.precalculatedStageAttacksByRiderId.set(x.riderId,L)}if(this.breakawayPlan=td(t.riders,t.race,t.stage,t.stageSummary,this.stageFavorites,t.gcStandings,t.mountainStandings),this.breakawayPlan&&this.breakawayPlan.superTeamId!=null){this.superTeamId=this.breakawayPlan.superTeamId,this.superTeamBonusAmount=Vr(2,6),this.superTeamMalusAmount=Vr(4,9),this.superTeamStartPercent=de(.4,.6),this.superTeamEndPercent=de(.85,.95);const x=V=>(V??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),L=t.riders.filter(V=>V.activeTeamId===this.superTeamId),O=L.filter(V=>{var J;return x((J=V.role)==null?void 0:J.name)==="kapitaen"}),K=L.filter(V=>{var J;return x((J=V.role)==null?void 0:J.name)==="co-kapitaen"});if(O.length>0){if(O.forEach(V=>this.superTeamProtectedLeaderIds.add(V.id)),O.length===1&&K.length>0){const V=[...K].sort((J,Y)=>Y.overallRating-J.overallRating||Y.id-J.id);this.superTeamProtectedLeaderIds.add(V[0].id)}}else if(K.length>0)[...K].sort((J,Y)=>Y.overallRating-J.overallRating||Y.id-J.id).slice(0,2).forEach(J=>this.superTeamProtectedLeaderIds.add(J.id));else{const V=L.filter(J=>{var Y;return x((Y=J.role)==null?void 0:Y.name)==="edelhelfer"});if(V.length>0){const J=[...V].sort((Y,I)=>I.overallRating-Y.overallRating||I.id-Y.id);this.superTeamProtectedLeaderIds.add(J[0].id)}}const se=t.teams.find(V=>V.id===this.superTeamId),Q=se?se.name:`Team ${this.superTeamId}`;this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,riderTeamId:this.superTeamId,type:"superteam",tone:"neutral",title:`Superteam des Tages: ${Q}`,detail:`Dieses Team hat sich heute zusammengeschlossen, um seinen Leader zu unterstützen! Die Helfer erhalten zwischen ${(this.superTeamStartPercent*100).toFixed(0)}% und ${(this.superTeamEndPercent*100).toFixed(0)}% der Etappe einen Bonus von +${this.superTeamBonusAmount} auf Berg, Hill, Medium Mountain und Flat. Danach folgt ein Malus von -${this.superTeamMalusAmount} wegen Erschöpfung.`})}const m=this.buildBreakawayGapPenaltyConfig();this.breakawayGapPenaltyMarkers=m.markers,this.breakawayGapPenaltyFallbackCheckpointsMeters=m.fallbackCheckpointsMeters;for(const x of o)x.breakawayFallbackCheckpointTimes=new Array(this.breakawayGapPenaltyFallbackCheckpointsMeters.length).fill(null);const f=Kl(t.riders,t.stage,{teams:t.teams,distanceKm:t.stageSummary.distanceKm,elevationGainMeters:t.stageSummary.elevationGainMeters,dailyFormByRiderId:c}),g=new Map(f.map(x=>[x.id,x])),b=o.map(x=>{const L=g.get(x.rider.id)??x.rider;return{...x,rider:L,riderName:`${L.firstName} ${L.lastName}`,dailyForm:x.dailyForm+(L.specialFormDelta??0)}}),y=f.filter(x=>x.hasSuperform),v=f.filter(x=>x.hasSupermalus);(y.length>0||v.length>0)&&console.log("[RaceSpecialForm] Vor der Etappe ausgewuerfelt:",{superform:y.map(x=>`${x.firstName} ${x.lastName}`),supermalus:v.map(x=>`${x.firstName} ${x.lastName}`)});const T=this.resolveStartOrder(b),w=new Map((this.bootstrap.teamStartOrder??[]).map((x,L)=>[x,L]));this.riders=T.map((x,L)=>({...x,startOffsetSeconds:this.resolveStartOffsetSeconds(x,L,w)})),this.riders.forEach(x=>this.syncRiderTelemetry(x));for(const x of this.riders){const L=x.rider.homeEffectSkills,O=K=>Od[K]||K;if(x.rider.homeEffect==="super_home"){const K=L&&L.length===5?`${O(L[0])} (+3), ${O(L[1])} (+1), ${O(L[2])} (+1), ${O(L[3])} (+1), ${O(L[4])} (+1)`:"";this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} hat heute Super-Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 4 Skills, +3 auf einen Skill) (${K})`})}if(x.rider.homeEffect==="home_pressure"){const K=L?L.map(O).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} leidet unter Heimdruck!`,detail:`Der Druck im eigenen Land belastet die Nerven. (-0,5 auf 5 Skills) (${K})`})}if(x.rider.homeEffect==="normal_home"){const K=L?L.map(O).join(", "):"";this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} hat heute Heimvorteil!`,detail:`Beflügelt durch die Fans im eigenen Land! (+1 auf 5 Skills) (${K})`})}x.rider.hasSuperform&&this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} hat heute einen guten Tag`,detail:"Superform aktiv."}),x.rider.hasSupermalus&&this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_wait",tone:"danger",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} hat heute einen schlechten Tag`,detail:"Supermalus aktiv."}),x.rider.activePeakDate===this.bootstrap.stage.date&&this.pushMessage({elapsedSeconds:0,riderId:x.rider.id,riderName:x.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(x.rider.id,x.riderName)} hat heute seinen Formhöhepunkt`,detail:"Formhöhepunkt erreicht."})}const M=this.bootstrap.stage.rolledWetterName??"Sonnig",$=this.bootstrap.stage.rolledEffektSturz??0,E=this.bootstrap.stage.rolledEffektDefekt??0,R=this.bootstrap.stage.rolledWindkantenGefahr??0,N=this.bootstrap.stage.rolledEffektFatigue??0,P=this.bootstrap.stage.rolledBreakawayBonus??0,D=[];$>0&&D.push(`Sturzwahrscheinlichkeit +${$.toFixed(1)}%`),E>0&&D.push(`Defektwahrscheinlichkeit +${E.toFixed(1)}%`),R>0&&D.push(`Windkanten-Gefahr +${(R*100).toFixed(1)}%`),N>0&&D.push(`Fatigue +${N.toFixed(1)}%`),P>0&&D.push(`Ausreißer-Bonus +${P.toFixed(1)}`);const A=D.length>0?`Wettereinflüsse: ${D.join(", ")}`:"Keine nennenswerten Wettereinflüsse auf das Rennen.";this.pushMessage({elapsedSeconds:0,riderId:null,riderName:null,type:"support_resume",tone:"neutral",title:`Wetterbericht: ${M}`,detail:A})}step(t){if(t<=0||this.isFinished())return this.getFrameSnapshot();let a=t;for(;a>0&&!this.isFinished();){const s=Math.min(a,this.maxSubstepSeconds);this.advanceSubstep(s),a-=s}return this.getFrameSnapshot()}getFrameSnapshot(){const t=this.getOrderedRiders();return this.buildFrameSnapshot(t)}getSnapshot(){const t=this.getOrderedRiders(),a=this.buildFrameSnapshot(t);return{...a,riders:t.map(s=>({riderId:s.rider.id,riderName:s.riderName,startOffsetSeconds:s.startOffsetSeconds,riderClockSeconds:this.resolveRiderClockSeconds(s),hasStarted:s.hasStarted||ee(s),distanceCoveredMeters:s.distanceCoveredMeters,gapToLeaderMeters:Math.max(0,a.leaderDistanceMeters-s.distanceCoveredMeters),segmentStartKm:s.segmentStartKm,segmentEndKm:s.segmentEndKm,segmentStartElevation:s.segmentStartElevation,segmentEndElevation:s.segmentEndElevation,activeTerrain:he(s)?"Finish":s.activeTerrain,skillName:he(s)?"Finish":s.skillName,skillBreakdown:he(s)?"":s.skillBreakdown,baseSkill:s.baseSkill,teamGroupBonus:s.teamGroupBonus,effectiveSkill:s.effectiveSkill,staminaPenalty:s.staminaPenalty,elevationPenalty:s.elevationPenalty,dailyForm:s.dailyForm,microForm:s.microForm,gradientPercent:s.gradientPercent,gradientModifier:s.gradientModifier,windModifier:s.windModifier,draftModifier:s.draftModifier,draftNearbyRiderCount:s.draftNearbyRiderCount,draftPackFactor:s.draftPackFactor,currentSpeedMps:s.currentSpeedMps,photoFinishScore:s.photoFinishScore,leadoutBonus:s.leadoutBonus,leadoutRiderId:s.leadoutRiderId,leadoutContributions:s.leadoutContributions,lastSplitLabel:s.lastSplitLabel,lastSplitTimeSeconds:s.lastSplitTimeSeconds,splitTimes:{...s.splitTimes},finishTimeSeconds:Number.isFinite(s.finishTimeSeconds??Number.NaN)?s.finishTimeSeconds:null,finishStatus:s.finishStatus,statusReason:s.statusReason,isAttacking:s.isAttacking,isBreakaway:s.isBreakaway,isLeadingGroup:s.isLeadingGroup,hasSuperform:s.rider.hasSuperform===!0,hasSupermalus:s.rider.hasSupermalus===!0,isFinished:he(s)})),markerClassifications:this.buildMarkerClassifications(t),incidents:this.riders.flatMap(s=>s.appliedIncident?[s.appliedIncident]:[]),messages:[...this.messages],allEvents:[...this.allEvents],stageFavorites:this.stageFavorites,breakawayPhaseActive:this.isBreakawayGroupPhaseActive(),breakawayGapStatus:this.breakawayGapStatus==null?null:{...this.breakawayGapStatus},superTeamId:this.superTeamId}}applyPersistentStageRaceState(t){t.dailyForm+=t.rider.stageRaceDayFormPenalty??0,t.microForm+=t.rider.stageRaceMicroFormPenalty??0,t.incidentStaminaPenalty+=t.rider.stageRaceStaminaPenalty??0,t.dailyFormCap=t.rider.stageRaceDayFormCap??null,t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap))}pushMessage(t){var n;const a=t.riderTeamId??(t.riderId!=null?((n=this.riders.find(i=>i.rider.id===t.riderId))==null?void 0:n.rider.activeTeamId)??null:null);let s=null;if(t.riderId!=null){const i=this.riders.find(o=>o.rider.id===t.riderId);i&&(s=Number((i.distanceCoveredMeters/1e3).toFixed(2)))}if(s==null){const i=this.riders.filter(o=>o.finishStatus!=="dnf").reduce((o,c)=>Math.max(o,c.distanceCoveredMeters),0);s=Number((i/1e3).toFixed(2))}const r={id:this.nextMessageId,...t,riderTeamId:a,kmMark:s};this.messages.unshift(r),this.allEvents.push(r),this.nextMessageId+=1,this.messages.length>60&&(this.messages.length=60)}buildMarkerClassifications(t){const a=new Map(t.map(s=>[s.rider.id,s]));return this.intermediateMarkers.map(s=>{const r=t.map(i=>i.markerCrossings[s.key]??null).filter(i=>i!=null),n=Qd(r,!this.isTimeTrialMode,s.markerType,a,this.isClimberMalusStage());return{markerKey:s.key,markerLabel:s.label,markerType:s.markerType,markerCategory:s.markerCategory,kmMark:s.distanceMeters/1e3,entries:n}})}getOrderedRiders(){return this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.isTimeTrialMode?[...this.riders].sort(wi):ec(this.riders,this.resolveFinishMarkerType(),this.isClimberMalusStage())}isClimberMalusStage(){if(this.isTimeTrialMode)return!1;const t=this.bootstrap.stage.profile;return t==="Flat"||t==="Rolling"}buildFrameSnapshot(t){const a=t.filter(r=>r.finishStatus!=="dnf").reduce((r,n)=>Math.max(r,n.distanceCoveredMeters),0);let s=0;for(const r of t)he(r)&&(s+=1);return{elapsedSeconds:this.elapsedSeconds,stageDistanceMeters:this.stageDistanceMeters,leaderDistanceMeters:a,finishedRiders:s,isFinished:this.isFinished(),clusters:this.buildClusters(t),windZones:this.windZones}}isFinished(){return this.riders.every(ee)}advanceSubstep(t){const a=this.elapsedSeconds,s=a+t,r=this.isTimeTrialMode?null:this.lastTeamGroupBonusByRiderId??this.buildTeamGroupBonusByRiderId();this.updateBreakawayPhaseState();for(const l of this.riders){if(ee(l)){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}if(this.isTimeTrialMode&&s<=l.startOffsetSeconds){l.nextDistanceCoveredMeters=null,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.teamGroupBonus=0,l.isAttacking=!1,l.isLeadingGroup=!1;continue}const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,u=Math.max(0,s-p);if(u<=0)continue;if(l.incidentDelaySecondsRemaining>0){l.incidentDelaySecondsRemaining=Math.max(0,l.incidentDelaySecondsRemaining-u),l.tempSpeedMps=0,l.currentSpeedMps=0,l.nextDistanceCoveredMeters=l.distanceCoveredMeters,l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id);continue}l.hasStarted=!0,this.advanceIndexForDistance(l);const m=this.currentSegment(l),f=this.currentWindZone(l);if(!m||!f){l.distanceCoveredMeters=this.stageDistanceMeters,l.nextDistanceCoveredMeters=this.stageDistanceMeters,l.finishTimeSeconds=p,l.tempSpeedMps=0,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=0,l.isAttacking=!1,l.isLeadingGroup=!1,l.activeTerrain="Finish",l.skillName="Finish",l.skillBreakdown="",l.photoFinishScore=this.calculatePhotoFinishScore(l);const b=Wt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=b,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[];continue}l.teamGroupBonus=this.resolveTeamGroupBonusValue(l,r);const g=this.calculateBasePhysics(l,m,f);l.activeTerrain=m.terrain,l.skillName=g.skillName,l.skillBreakdown=g.skillBreakdown,l.baseSkill=g.baseSkill,l.teamGroupBonus=g.teamGroupBonus,l.effectiveSkill=g.effectiveSkill,l.staminaPenalty=g.staminaPenalty,l.elevationPenalty=g.elevationPenalty,l.gradientPercent=g.gradientPercent,l.gradientModifier=g.gradientModifier,l.windModifier=g.windModifier,l.tempSpeedMps=g.tempSpeedMps,l.draftModifier=1,l.draftNearbyRiderCount=0,l.draftPackFactor=0,l.currentSpeedMps=g.tempSpeedMps,l.photoFinishScore=this.calculatePhotoFinishScore(l),l.isAttacking=this.activeStageAttacksByRiderId.has(l.rider.id),l.isLeadingGroup=!this.isTimeTrialMode,l.nextDistanceCoveredMeters=null,l.nextDistanceCoveredMeters=l.distanceCoveredMeters+l.currentSpeedMps*u}if(this.applyBreakawaySkillTempo(t),this.isTeamTimeTrial)this.applyTeamTimeTrialTempo(a,s);else if(!this.isTimeTrialMode){const l=this.draftOrderScratch;l.length=0;for(const p of this.riders)l.push(p);l.sort(tc);for(let p=0;p<l.length;p+=1){const u=l[p];if(ee(u))continue;const m=this.isActiveBreakawayRider(u),f=u.tempSpeedMps/14,g=Math.max(5,50*f),b=this.currentSegment(u),y=Math.max(15,150*f),v=Math.max(g,Math.min(y,Ud(b==null?void 0:b.terrain))),T=sc(l,p,v),w=T.size,M=en(w),$=rc(w,T.positionInGroup);let E=0,R=Number.POSITIVE_INFINITY,N=null;for(let I=p-1;I>=0;I-=1){const C=l[I],F=C.distanceCoveredMeters-u.distanceCoveredMeters;if(F>=v+wd)break;!this.canReceiveDraftFromCandidate(u,C)||this.isActiveBreakawayRider(C)||F<=0||F>=v||(E+=1,F<=R&&(R=F,N=C))}if(E===0||!N){if(m)continue;u.draftModifier=1,u.draftNearbyRiderCount=0,u.draftPackFactor=0,u.currentSpeedMps=u.tempSpeedMps,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,u.isLeadingGroup=!0,this.applyCaptainWaitLogic(u);continue}const P=ee(N)?N.tempSpeedMps:N.currentSpeedMps,D=R,A=D<=g?1:1-(D-g)/Math.max(1e-4,v-g),_=this.currentWindZone(u),G=(_==null?void 0:_.vector)??0,x=(_==null?void 0:_.windSpeedKph)??0,L=-G*(x/70),K=Math.max(.3,.35+.35*L)*Math.min(1,f)*Ur,se=ue((b==null?void 0:b.gradient_percent)??0,-20,20),Q=Xr(se),J=1+($?0:K*A*M*Q),Y=u.tempSpeedMps*J;if(!(m&&J<=u.draftModifier)){if(u.draftModifier=J,u.draftNearbyRiderCount=w,u.draftPackFactor=M,u.isLeadingGroup=$,Y>P){if(u.tempSpeedMps>N.tempSpeedMps){u.currentSpeedMps=Y,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t;continue}if(D<1){u.currentSpeedMps=P,u.nextDistanceCoveredMeters=N.distanceCoveredMeters+P*t,m||this.applyCaptainWaitLogic(u);continue}u.currentSpeedMps=Math.min(Y,P+2),u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,m||this.applyCaptainWaitLogic(u);continue}u.currentSpeedMps=Y,u.nextDistanceCoveredMeters=u.distanceCoveredMeters+u.currentSpeedMps*t,m||this.applyCaptainWaitLogic(u)}}}this.applyBreakawayGroupTempo(t);for(const l of this.riders)l.incidentRecoverySecondsRemaining>0&&l.draftModifier>=1.2&&(l.incidentRecoverySecondsRemaining=0,l.incidentRecoveryFormBonus=0);const n=this.isTimeTrialMode?null:this.buildTeamGroupBonusByRiderId();this.lastTeamGroupBonusByRiderId=n;for(const l of this.riders){if(ee(l))continue;if(this.superTeamId!=null&&l.rider.activeTeamId===this.superTeamId&&!this.superTeamProtectedLeaderIds.has(l.rider.id)){const v=l.distanceCoveredMeters/this.stageDistanceMeters;let T=0;v>=this.superTeamStartPercent&&v<this.superTeamEndPercent?(T=this.superTeamBonusAmount,l.superTeamActiveLogged||(l.superTeamActiveLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"neutral",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} leistet Führungsarbeit!`,detail:`Der Edelhelfer investiert all seine Kraft für das Team und erhält vorübergehend +${this.superTeamBonusAmount} auf Berg-, Hügel- und Flachpassagen!`}))):v>=this.superTeamEndPercent&&(T=-this.superTeamMalusAmount,l.superTeamExhaustedLogged||(l.superTeamExhaustedLogged=!0,this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:l.rider.id,riderName:l.riderName,type:"superteam",tone:"warning",title:`${this.formatRiderWithPreStageGc(l.rider.id,l.riderName)} ist erschöpft!`,detail:`Die Führungsarbeit hat ihren Tribut gefordert. Der Fahrer erhält für den Rest der Etappe einen Malus von -${this.superTeamMalusAmount} auf Berg-, Hügel- und Flachpassagen.`}))),l.originalSkills||(l.originalSkills={flat:l.rider.skills.flat,mountain:l.rider.skills.mountain,mediumMountain:l.rider.skills.mediumMountain,hill:l.rider.skills.hill}),l.rider.skills.flat=l.originalSkills.flat+T,l.rider.skills.mountain=l.originalSkills.mountain+T,l.rider.skills.mediumMountain=l.originalSkills.mediumMountain+T,l.rider.skills.hill=l.originalSkills.hill+T}if(this.isTimeTrialMode&&s<=l.startOffsetSeconds)continue;const p=this.isTimeTrialMode?Math.max(a,l.startOffsetSeconds):a,u=Math.max(0,s-p);if(u<=0)continue;const m=l.distanceCoveredMeters,f=l.nextDistanceCoveredMeters??l.distanceCoveredMeters+l.currentSpeedMps*u,g=l.pendingIncident;if(g&&m<g.triggerDistanceMeters&&f>=g.triggerDistanceMeters){const v=Math.max(.1,l.currentSpeedMps),T=Math.max(0,(g.triggerDistanceMeters-m)/v);l.distanceCoveredMeters=g.triggerDistanceMeters,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.applyIncident(l,g,p+T),l.nextDistanceCoveredMeters=null,this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n);continue}const b=this.stageDistanceMeters-l.distanceCoveredMeters;if(Math.max(0,f-l.distanceCoveredMeters)>=b){const v=b/l.currentSpeedMps;l.distanceCoveredMeters=this.stageDistanceMeters,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),l.finishTimeSeconds=p+v,l.currentSpeedMps=0;const T=Wt(l,this.resolveFinishMarkerType(),this.isClimberMalusStage());l.photoFinishScore+=T,l.leadoutBonus=0,l.leadoutRiderId=null,l.leadoutContributions=[]}else l.distanceCoveredMeters=f,this.recordIntermediateSplits(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps),this.recordBreakawayFallbackCheckpointCrossings(l,m,l.distanceCoveredMeters,p,l.currentSpeedMps);for(this.triggerStageAttacksForRider(l,m,l.distanceCoveredMeters,p),l.nextDistanceCoveredMeters=null,l.incidentRecoverySecondsRemaining>0&&(l.incidentRecoverySecondsRemaining=Math.max(0,l.incidentRecoverySecondsRemaining-u),l.incidentRecoverySecondsRemaining<=0&&(l.incidentRecoveryFormBonus=0));!ee(l)&&l.distanceCoveredMeters>=l.nextFormUpdateMeter;)l.microForm=Qr(),l.nextFormUpdateMeter+=de(5e3,4e4);this.advanceIndexForDistance(l),this.syncRiderTelemetry(l,n)}const i=this.updateBreakawayPhaseState(),o=this.updateBreakawayMalusRecovery();if((i||o)&&this.syncBreakawayPlanRidersTelemetry(n),this.updateBreakawayGapStatus(),this.breakawayPlan&&this.breakawayPhaseActive&&!this.breakawayCaughtLogged){const l=new Set(this.breakawayPlan.riderIds),p=this.riders.filter(m=>l.has(m.rider.id)&&!ee(m)),u=this.riders.filter(m=>!l.has(m.rider.id)&&!ee(m));if(p.length>0&&u.length>0){const m=p.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,p[0]);u.reduce((g,b)=>b.distanceCoveredMeters>g.distanceCoveredMeters?b:g,u[0]).distanceCoveredMeters>=m.distanceCoveredMeters&&(m.distanceCoveredMeters>=.4*this.stageDistanceMeters&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:m.rider.id,riderName:m.riderName,type:"attack",tone:"warning",title:`Ausreißer eingeholt: ${m.riderName}`,detail:"Der letzte Fahrer des Ausreißversuchs wurde eingeholt."}),this.breakawayCaughtLogged=!0)}}const c=pd(this.activeStageAttacksByRiderId,t);this.activeStageAttacksByRiderId.clear();for(const l of c.newActiveAttacks)this.activeStageAttacksByRiderId.set(l.riderId,l);for(const l of this.riders)l.isAttacking=!ee(l)&&this.activeStageAttacksByRiderId.has(l.rider.id);this.elapsedSeconds+=t,this.isFinished()&&!this.hasAppliedSprintLeadoutBonuses&&(this.applySprintLeadoutBonuses(),this.hasAppliedSprintLeadoutBonuses=!0),this.logFinishSprintTieBreakIfNeeded()}applyTeamTimeTrialTempo(t,a){const s=new Map;for(const r of this.riders){if(ee(r)||r.rider.activeTeamId==null||a<=r.startOffsetSeconds)continue;const n=s.get(r.rider.activeTeamId)??[];n.push(r),s.set(r.rider.activeTeamId,n)}for(const r of s.values()){const n=r[0],i=n?this.currentSegment(n):null;if(!n||!i)continue;const o=Math.min(5,r.length),c=[...r].sort((m,f)=>f.effectiveSkill-m.effectiveSkill||m.rider.id-f.rider.id).slice(0,o).reduce((m,f)=>m+f.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-r.length),p=Math.max(1,c-l),u=this.resolveTimeTrialSpeedMps(p,n.distanceCoveredMeters,i,n.gradientModifier,n.windModifier)*Nl(i.terrain,this.bootstrap.skillWeightRules??[]);for(const m of r){const f=Math.max(t,m.startOffsetSeconds),g=Math.max(0,a-f);m.currentSpeedMps=u,m.tempSpeedMps=u,m.nextDistanceCoveredMeters=m.distanceCoveredMeters+u*g}}}advanceIndexForDistance(t){for(;t.segmentIndex<this.bootstrap.stageSummary.segments.length-1;){const a=this.bootstrap.stageSummary.segments[t.segmentIndex];if(t.distanceCoveredMeters<a.end_km*1e3)break;t.segmentIndex+=1}for(;t.windZoneIndex<this.windZones.length-1;){const a=this.windZones[t.windZoneIndex];if(t.distanceCoveredMeters<a.endMeter)break;t.windZoneIndex+=1}}currentSegment(t){return this.bootstrap.stageSummary.segments[t.segmentIndex]??null}currentWindZone(t){return this.windZones[t.windZoneIndex]??null}resolveStartOrder(t){if(this.isTeamTimeTrial){const r=new Map((this.bootstrap.teamStartOrder??[]).map((n,i)=>[n,i]));return[...t].sort((n,i)=>{const o=n.rider.activeTeamId!=null?r.get(n.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER,c=i.rider.activeTeamId!=null?r.get(i.rider.activeTeamId)??Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;return o!==c?o-c:this.resolveProjectedIttStartScore(i)-this.resolveProjectedIttStartScore(n)||n.rider.id-i.rider.id})}if(!this.isIndividualTimeTrial)return[...t];const a=new Map((this.bootstrap.gcStandings??[]).map(r=>[r.riderId,r.rank]));return this.bootstrap.race.isStageRace&&this.bootstrap.stage.stageNumber>1&&a.size>0?[...t].sort((r,n)=>{const i=a.get(r.rider.id),o=a.get(n.rider.id);return i!=null&&o!=null?o-i:i!=null?-1:o!=null?1:this.resolveProjectedIttStartScore(r)-this.resolveProjectedIttStartScore(n)||r.rider.id-n.rider.id}):[...t].sort((r,n)=>r.rider.skills.timeTrial-n.rider.skills.timeTrial||r.rider.id-n.rider.id)}resolveProjectedIttStartScore(t){let a=0,s=0;for(const r of this.bootstrap.stageSummary.segments){const n=(r.start_km+r.end_km)/2*1e3,i=this.resolveStaminaPenalty(t.rider.skills.stamina,n)+t.incidentStaminaPenalty,o=this.resolveWeightedSkill(t.rider,r.terrain),c=i>0?this.resolveWeightedSkill(t.rider,r.terrain,i):o,l=Math.max(0,o.value-c.value),{effectiveSkill:p}=this.resolveEffectiveSkill({rider:t,baseSkill:c.value,staminaPenalty:l,teamGroupBonus:0,distanceMeters:n}),u=ue(r.gradient_percent,-20,20),m=u>0?Math.exp(-.11*u):1-u*.06,f=this.windZones.find(b=>n>=b.startMeter&&n<=b.endMeter)??this.windZones[this.windZones.length-1],g=f?1+f.vector*(f.windSpeedKph/100)*.52:1;a+=p*m*g*r.length_km,s+=r.length_km}return s>0?a/s:0}resolveStartOffsetSeconds(t,a,s){if(this.isIndividualTimeTrial)return a*Sd;if(this.isTeamTimeTrial){const r=t.rider.activeTeamId;return(r!=null?s.get(r)??0:0)*kd}return 0}buildIntermediateMarkers(){return Je(this.bootstrap.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||ut(t)).map(({key:t,label:a,marker:s,kmMark:r})=>({key:t,distanceMeters:r*1e3,label:a,markerType:s.type,markerCategory:s.cat})).sort((t,a)=>t.distanceMeters-a.distanceMeters)}buildBreakawayGapPenaltyConfig(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode)return{markers:[],fallbackCheckpointsMeters:[]};const a=this.intermediateMarkers.filter(c=>c.distanceMeters<t.groupPhaseEndDistanceMeters),s=this.stageDistanceMeters*Hd,r=a.some(c=>c.distanceMeters<=s);if(!(a.length<=1||!r))return{markers:a,fallbackCheckpointsMeters:[]};const i=[],o=Math.max(ba,Math.ceil(s/ba)*ba);for(let c=o;c<t.groupPhaseEndDistanceMeters;c+=ba)i.push(c);return{markers:a,fallbackCheckpointsMeters:i}}calculateBasePhysics(t,a,s){const r=Yd(a.terrain),n=this.resolveRiderStaminaPenalty(t)+t.incidentStaminaPenalty,i=this.resolveWeightedSkill(t.rider,a.terrain),o=n>0?this.resolveWeightedSkill(t.rider,a.terrain,n):i,c=Math.max(0,i.value-o.value),l=this.resolveAttackSkillBonus(t),p=Math.min(85,o.value)+l,u=this.isTimeTrialMode?0:t.teamGroupBonus,m=this.resolveSegmentElevation(a,t.distanceCoveredMeters),{effectiveSkill:f,staminaPenalty:g,elevationPenalty:b}=this.resolveEffectiveSkill({rider:t,baseSkill:p,staminaPenalty:c,teamGroupBonus:u,distanceMeters:t.distanceCoveredMeters,currentElevationMeters:m}),y=ue(a.gradient_percent,-20,20),v=y>0?Math.exp(-.11*y):1-y*.06,T=1+s.vector*(s.windSpeedKph/100)*.52,w=this.isTimeTrialMode?.5:this.resolveRoadSpeedSkillFactor(a.terrain);return{skillName:r,skillBreakdown:o.breakdown,baseSkill:p,teamGroupBonus:u,effectiveSkill:f,staminaPenalty:g,elevationPenalty:b,gradientPercent:y,gradientModifier:v,windModifier:T,attackSkillBonus:l,tempSpeedMps:this.isTimeTrialMode?this.resolveTimeTrialSpeedMps(f,t.distanceCoveredMeters,a,v,T):this.resolveRoadStageSpeedMps(f,t.distanceCoveredMeters,a,v,T,w)}}resolveRoadStageSpeedMps(t,a,s,r,n,i){const o=this.resolveSkillSpreadFactor(a,s),c=this.resolveSegmentElevation(s,a),l=this.resolveElevationSkillSpreadFactor(s,c),m=(40+(t-50)*i*o*l)/3.6;return Math.max(.5,m*r*n)}resolveElevationSkillSpreadFactor(t,a){if(t.terrain!=="Mountain"&&t.terrain!=="Medium_Mountain")return 1;const s=Math.max(0,a-Ed),r=Math.floor(s/Fd);return t.terrain==="Mountain"?1+(r*Nd+r*Math.max(0,r-1)*Pd/2):1+r*Cd}resolveRoadSpeedSkillFactor(t){return t==="Flat"?.12+(this.bootstrap.stage.rolledWindkantenGefahr??0):t==="Abfahrt"||t==="Downhill"?.15:t==="Cobble"?20/35:t==="Cobble_Hill"?25/35:10/35}resolveBreakawayReferenceSkill(t,a){const s=a.filter(n=>n.activeTerrain===t.activeTerrain);return(s.length>0?s:a).reduce((n,i)=>Math.max(n,i.effectiveSkill),t.effectiveSkill)}resolveBreakawaySkillBonus(t){var a;return this.isBreakawayBonusWindow(t)?((a=this.breakawayPlan)==null?void 0:a.skillBonus)??0:0}resolveMaxBreakawayDraftModifier(t,a,s){if(s<=1)return{draftModifier:1,draftPackFactor:0};const r=t.tempSpeedMps/14,n=this.currentWindZone(t),i=(n==null?void 0:n.vector)??0,o=(n==null?void 0:n.windSpeedKph)??0,c=-i*(o/70),p=Math.max(.3,.35+.35*c)*Math.min(1,r)*Ur,u=ue(a.gradient_percent,-20,20),m=Xr(u),f=en(s);return{draftModifier:1+p*f*m,draftPackFactor:f}}resolveBreakawayTimeGapPenalty(t){if(t<Jr)return 0;const a=Math.floor((t-Jr)/_d);return Gd+a}recordBreakawayFallbackCheckpointCrossings(t,a,s,r,n){if(!(this.breakawayGapPenaltyFallbackCheckpointsMeters.length===0||n<=0))for(;t.nextBreakawayFallbackCheckpointIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const i=t.nextBreakawayFallbackCheckpointIndex,o=this.breakawayGapPenaltyFallbackCheckpointsMeters[i];if(o==null||o>s)break;if(o<a){t.nextBreakawayFallbackCheckpointIndex+=1;continue}const c=(o-a)/n,l=Math.max(0,this.isTimeTrialMode?r+c-t.startOffsetSeconds:r+c);t.breakawayFallbackCheckpointTimes[i]=l,t.nextBreakawayFallbackCheckpointIndex+=1}}updateBreakawayGapPenaltyFromCheckpoints(t,a){var i,o;if(!this.breakawayPlan||t.length===0||a.length===0)return this.breakawayGapStatus=null,((i=t[0])==null?void 0:i.breakawayGapPenalty)??0;let r=((o=t[0])==null?void 0:o.breakawayGapPenalty)??0;const n=[...a].sort((c,l)=>l.distanceCoveredMeters-c.distanceCoveredMeters||l.currentSpeedMps-c.currentSpeedMps||c.rider.id-l.rider.id)[0]??null;if(!n)return this.breakawayGapStatus=null,r;for(;this.nextBreakawayGapPenaltyMarkerIndex<this.breakawayGapPenaltyMarkers.length;){const c=this.breakawayGapPenaltyMarkers[this.nextBreakawayGapPenaltyMarkerIndex];if(!c)break;const l=n.markerCrossings[c.key]??null;if(!l)break;const p=t.map(u=>u.markerCrossings[c.key]??null).filter(u=>u!=null).sort((u,m)=>u.crossingTimeSeconds-m.crossingTimeSeconds||u.riderId-m.riderId)[0]??null;if(p){const u=l.crossingTimeSeconds-p.crossingTimeSeconds;r=this.resolveBreakawayTimeGapPenalty(u),this.breakawayGapStatus={gapSeconds:u,penalty:r,kmMark:c.distanceMeters/1e3}}this.nextBreakawayGapPenaltyMarkerIndex+=1}for(;this.nextBreakawayGapPenaltyFallbackIndex<this.breakawayGapPenaltyFallbackCheckpointsMeters.length;){const c=this.nextBreakawayGapPenaltyFallbackIndex,l=n.breakawayFallbackCheckpointTimes[c]??null;if(l==null)break;const p=t.map(u=>u.breakawayFallbackCheckpointTimes[c]??null).filter(u=>u!=null).sort((u,m)=>u-m)[0]??null;if(p!=null){const u=l-p;r=this.resolveBreakawayTimeGapPenalty(u),this.breakawayGapStatus={gapSeconds:u,penalty:r,kmMark:c<this.breakawayGapPenaltyFallbackCheckpointsMeters.length?this.breakawayGapPenaltyFallbackCheckpointsMeters[c]/1e3:null}}this.nextBreakawayGapPenaltyFallbackIndex+=1}return r}updateBreakawayGapStatus(){const t=this.breakawayPlan;if(!t||this.isTimeTrialMode||!this.isBreakawayGroupPhaseActive()){this.breakawayGapStatus=null;return}const a=new Set(t.riderIds),s=this.riders.filter(o=>!ee(o)&&a.has(o.rider.id)&&o.activeTerrain!=="Finish"),r=this.riders.filter(o=>!ee(o)&&!a.has(o.rider.id)&&o.activeTerrain!=="Finish");if(s.length===0||r.length===0){this.breakawayGapStatus=null;return}const n=[...s].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null,i=[...r].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0]??null;if(!n||!i||n.distanceCoveredMeters<=i.distanceCoveredMeters){this.breakawayGapStatus=null;return}for(let o=this.intermediateMarkers.length-1;o>=0;o-=1){const c=this.intermediateMarkers[o];if(!c)continue;const l=n.markerCrossings[c.key]??null,p=i.markerCrossings[c.key]??null;if(!l||!p)continue;const u=p.crossingTimeSeconds-l.crossingTimeSeconds;this.breakawayGapStatus={gapSeconds:u,penalty:this.resolveBreakawayTimeGapPenalty(u),kmMark:c.distanceMeters/1e3};return}for(let o=this.breakawayGapPenaltyFallbackCheckpointsMeters.length-1;o>=0;o-=1){const c=this.breakawayGapPenaltyFallbackCheckpointsMeters[o];if(c==null)continue;const l=n.breakawayFallbackCheckpointTimes[o]??null,p=i.breakawayFallbackCheckpointTimes[o]??null;if(l==null||p==null)continue;const u=p-l;this.breakawayGapStatus={gapSeconds:u,penalty:this.resolveBreakawayTimeGapPenalty(u),kmMark:c/1e3};return}this.breakawayGapStatus=null}applyBreakawaySkillTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const s=new Set(a.riderIds),r=this.riders.filter(o=>!ee(o)&&s.has(o.rider.id));if(r.length===0)return;const n=this.riders.filter(o=>!ee(o)&&!s.has(o.rider.id)&&o.activeTerrain!=="Finish"),i=this.updateBreakawayGapPenaltyFromCheckpoints(r,n);for(const o of r)o.breakawayGapPenalty=i;for(const o of r){const c=this.currentSegment(o);if(!c)continue;const p=this.resolveBreakawayReferenceSkill(o,n)+Math.max(0,a.skillBonus-o.breakawayGapPenalty);o.effectiveSkill=p,o.tempSpeedMps=this.resolveRoadStageSpeedMps(p,o.distanceCoveredMeters,c,o.gradientModifier,o.windModifier,this.resolveRoadSpeedSkillFactor(c.terrain));const u=this.resolveMaxBreakawayDraftModifier(o,c,r.length);o.draftModifier=u.draftModifier,o.draftNearbyRiderCount=Math.max(0,r.length-1),o.draftPackFactor=u.draftPackFactor,o.currentSpeedMps=o.tempSpeedMps*u.draftModifier,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+o.currentSpeedMps*t}}resolveTimeTrialSpeedMps(t,a,s,r,n){return this.resolveRoadStageSpeedMps(t,a,s,r,n,.5)}syncRiderTelemetry(t,a=null){var i;const s=this.currentSegment(t),r=this.currentWindZone(t);if(ee(t)||!s||!r){t.segmentStartKm=this.bootstrap.stageSummary.distanceKm,t.segmentEndKm=this.bootstrap.stageSummary.distanceKm,t.segmentStartElevation=0,t.segmentEndElevation=0,t.activeTerrain="Finish",t.skillName="Finish",t.skillBreakdown="",t.baseSkill=0,t.teamGroupBonus=0,t.effectiveSkill=0,t.staminaPenalty=0,t.staminaSkillPenalty=0,t.elevationPenalty=0,t.gradientPercent=0,t.gradientModifier=1,t.windModifier=1,t.draftModifier=1,t.draftNearbyRiderCount=0,t.draftPackFactor=0,t.currentSpeedMps=0,t.isAttacking=!1;return}t.teamGroupBonus=this.resolveTeamGroupBonusValue(t,a);const n=this.calculateBasePhysics(t,s,r);t.segmentStartKm=s.start_km,t.segmentEndKm=s.end_km,t.segmentStartElevation=s.start_elevation,t.segmentEndElevation=s.end_elevation,t.activeTerrain=s.terrain,t.skillName=n.skillName,t.skillBreakdown=n.attackSkillBonus>0?`${n.skillBreakdown} · Attack +${n.attackSkillBonus}`:n.skillBreakdown,t.baseSkill=n.baseSkill,t.teamGroupBonus=n.teamGroupBonus,t.effectiveSkill=n.effectiveSkill,t.staminaPenalty=n.staminaPenalty,t.elevationPenalty=n.elevationPenalty,t.gradientPercent=n.gradientPercent,t.gradientModifier=n.gradientModifier,t.windModifier=n.windModifier,t.currentSpeedMps=n.tempSpeedMps*t.draftModifier,t.photoFinishScore=this.calculatePhotoFinishScore(t),t.isAttacking=this.activeStageAttacksByRiderId.has(t.rider.id),t.isBreakaway=((i=this.breakawayPlan)==null?void 0:i.riderIds.includes(t.rider.id))??!1}updateBreakawayMalusRecovery(){const t=this.breakawayPlan;if(!t||!this.breakawayPhaseEnded||this.isTimeTrialMode)return!1;const a=new Set(t.riderIds),s=this.riders.reduce((n,i)=>ee(i)||a.has(i.rider.id)?n:Math.max(n,i.distanceCoveredMeters),0);if(s<=t.phaseEndDistanceMeters)return!1;let r=!1;for(const n of this.riders){if(!a.has(n.rider.id)||n.breakawayMalus<=0||n.rider.hasSupermalus===!0||n.distanceCoveredMeters<t.phaseEndDistanceMeters)continue;if(n.breakawayRecoveryStartDistanceMeters==null){if(s<=n.distanceCoveredMeters)continue;if(n.breakawayRecoveryStartDistanceMeters=n.distanceCoveredMeters,n.rider.hasSuperform===!0||Math.random()<jd){n.breakawayMalus=0,r=!0;continue}}const i=n.breakawayRecoveryStartDistanceMeters;if(i==null||n.breakawayInitialMalus<=0)continue;const o=Math.max(0,n.distanceCoveredMeters-i),c=Math.floor(o/zd),l=Math.min(Wd,n.breakawayInitialMalus),p=Math.max(l,n.breakawayInitialMalus-c*Kd),u=Ct(p);u!==n.breakawayMalus&&(n.breakawayMalus=u,r=!0)}return r}syncBreakawayPlanRidersTelemetry(t){const a=this.breakawayPlan;if(!a)return;const s=new Set(a.riderIds);for(const r of this.riders)ee(r)||!s.has(r.rider.id)||this.syncRiderTelemetry(r,t)}updateBreakawayPhaseState(){const t=this.breakawayPlan;if(!t||this.breakawayPhaseEnded)return!1;const a=this.riders.filter(r=>t.riderIds.includes(r.rider.id));if(a.length===0)return!1;if(!this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.triggerDistanceMeters)){this.breakawayPhaseActive=!0;for(const r of a)this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:r.rider.id,riderName:r.riderName,type:"attack",tone:"warning",title:`Ausreißversuch: ${this.formatRiderWithPreStageGc(r.rider.id,r.riderName)}`,detail:`Fahrer ist Teil der Ausreißergruppe. Die gemeinsame Bewegung endet ab ${(t.groupPhaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}let s=!1;if(!this.breakawayGroupPhaseEnded&&this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.groupPhaseEndDistanceMeters)){this.breakawayGroupPhaseEnded=!0,this.breakawayGapStatus=null;for(const r of a)r.breakawayGapPenalty=0;this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"attack",tone:"warning",title:"Ausreißerverbund endet",detail:`Ab jetzt gilt wieder normales Drafting. Der Ausreißermalus greift erst ab ${(t.phaseEndDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`}),s=!0}if(this.breakawayPhaseActive&&a.some(r=>r.distanceCoveredMeters>=t.phaseEndDistanceMeters)){this.breakawayPhaseEnded=!0,this.breakawayGapStatus=null;for(const r of a)r.breakawayMalus=t.malusValue,r.breakawayInitialMalus=t.malusValue,r.breakawayRecoveryStartDistanceMeters=null,r.breakawayGapPenalty=0;return this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:null,riderName:null,type:"incident",tone:"danger",title:"Ausreißerphase endet",detail:`Die Fahrer erhalten -${t.malusValue} Form für den Rest der Etappe.`}),!0}return s}applyBreakawayGroupTempo(t){const a=this.breakawayPlan;if(!a||!this.isBreakawayGroupPhaseActive()||this.isTimeTrialMode)return;const s=this.riders.filter(o=>!ee(o)&&a.riderIds.includes(o.rider.id));if(s.length===0)return;const r=[...s].sort((o,c)=>c.distanceCoveredMeters-o.distanceCoveredMeters||c.currentSpeedMps-o.currentSpeedMps||o.rider.id-c.rider.id)[0];if(!r)return;const n=Math.max(.1,r.currentSpeedMps),i=r.distanceCoveredMeters+n*t;for(const o of s){if(Math.max(0,r.distanceCoveredMeters-o.distanceCoveredMeters)>0){const l=n+.1;o.currentSpeedMps=l,o.nextDistanceCoveredMeters=Math.min(i,o.distanceCoveredMeters+l*t);continue}o.currentSpeedMps=n,o.nextDistanceCoveredMeters=o.distanceCoveredMeters+n*t}}resolveAttackSkillBonus(t){return this.activeStageAttacksByRiderId.has(t.rider.id)?nd:0}isActiveBreakawayRider(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.isBreakawayGroupPhaseActive()}isBreakawayGroupPhaseActive(){return this.breakawayPhaseActive&&!this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}isBreakawayBonusWindow(t){var a;return(((a=this.breakawayPlan)==null?void 0:a.riderIds.includes(t.rider.id))??!1)&&this.breakawayPhaseActive&&this.breakawayGroupPhaseEnded&&!this.breakawayPhaseEnded}resolveAttackStagePositionExcludingBreakaways(t){return this.getOrderedRiders().filter(a=>!this.isActiveBreakawayRider(a)).findIndex(a=>a.rider.id===t)+1}isDraftBlockedByAttack(t){const a=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return a!=null&&!a.isCounterAttack}canReceiveDraftFromCandidate(t,a){const s=this.activeStageAttacksByRiderId.get(a.rider.id)??null;if(s==null||s.isCounterAttack)return!0;const r=this.activeStageAttacksByRiderId.get(t.rider.id)??null;return(r==null?void 0:r.isCounterAttack)===!0&&r.triggeredByRiderId===a.rider.id}resolvePreStageGcRank(t){var a;return((a=this.bootstrap.gcStandings.find(s=>s.riderId===t))==null?void 0:a.rank)??null}formatRiderWithPreStageGc(t,a){const s=this.resolvePreStageGcRank(t);return s!=null?`${a} (${s}.)`:a}triggerStageAttacksForRider(t,a,s,r){if(ee(t)||this.activeStageAttacksByRiderId.has(t.rider.id))return;const n=this.precalculatedStageAttacksByRiderId.get(t.rider.id);if(!n||n.length===0)return;const i=n[0];if(!i||a>=i.triggerDistanceMeters||s<i.triggerDistanceMeters)return;const o=this.resolveAttackStagePositionExcludingBreakaways(t.rider.id);if(o<=0||o>10){console.log(`[RaceAttack] verworfen: ${t.riderName} Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km, Position ohne Ausreißer ${o}, aktuelle km ${(s/1e3).toFixed(1).replace(".",",")}`),n.shift();return}n.shift();const c=Math.max(.1,t.currentSpeedMps),l=Math.max(0,(i.triggerDistanceMeters-a)/c),p=r+l;this.activeStageAttacksByRiderId.set(t.rider.id,{riderId:t.rider.id,remainingSeconds:i.durationSeconds,startedAtElapsedSeconds:p,triggerDistanceMeters:i.triggerDistanceMeters,durationSeconds:i.durationSeconds,attackNumber:i.attackNumber,isCounterAttack:!1,triggeredByRiderId:null}),t.isAttacking=!0;const u=new Set(this.activeStageAttacksByRiderId.keys()),m=this.stageFavorites.slice(0,20).filter(b=>{if(b.kind!=="rider"||b.riderId==null)return!1;const y=this.riders.find(T=>T.rider.id===b.riderId);if(!y||ee(y))return!1;const v=t.distanceCoveredMeters-y.distanceCoveredMeters;return v>=0&&v<=150}),f=md(m,t.rider.id,u),g=[];for(const b of f){const y=this.riders.find(v=>v.rider.id===b);!y||ee(y)||this.activeStageAttacksByRiderId.has(b)||(this.activeStageAttacksByRiderId.set(b,{riderId:b,remainingSeconds:jr,startedAtElapsedSeconds:p,triggerDistanceMeters:y.distanceCoveredMeters,durationSeconds:jr,attackNumber:1,isCounterAttack:!0,triggeredByRiderId:t.rider.id}),y.isAttacking=!0,g.push({riderId:b,riderName:this.formatRiderWithPreStageGc(b,y.riderName),riderTeamId:y.rider.activeTeamId??null}))}this.pushMessage({elapsedSeconds:p,riderId:t.rider.id,riderName:t.riderName,type:"attack",tone:"warning",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} attackiert`,detail:`Attacke ${i.attackNumber} bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`});for(const b of g)this.pushMessage({elapsedSeconds:p,riderId:b.riderId,riderName:b.riderName,type:"counter_attack",tone:"warning",title:`${b.riderName} kontert (Reaktion auf ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)})`,detail:`Konterattacke bei ${(i.triggerDistanceMeters/1e3).toFixed(1).replace(".",",")} km.`})}buildClusters(t){const a=[];for(const s of t){if(s.finishStatus==="dnf")continue;const r=a[a.length-1];if(!r||Math.abs(r.distanceMeter-s.distanceCoveredMeters)>=fa){a.push({riderIds:[s.rider.id],riderCount:1,distanceMeter:s.distanceCoveredMeters,distanceSum:s.distanceCoveredMeters});continue}r.riderIds.push(s.rider.id),r.riderCount+=1,r.distanceSum+=s.distanceCoveredMeters,r.distanceMeter=r.distanceSum/r.riderCount}return a.map(({distanceSum:s,...r})=>r)}buildTeamGroupBonusByRiderId(){const t=new Map,a=this.riders.filter(i=>!ee(i)&&i.rider.activeTeamId!=null).sort((i,o)=>i.distanceCoveredMeters-o.distanceCoveredMeters||i.rider.id-o.rider.id),s=new Map;let r=0,n=0;for(let i=0;i<a.length;i+=1){const o=a[i],c=o.distanceCoveredMeters;for(;n<a.length&&a[n].distanceCoveredMeters-c<fa;){const u=a[n].rider.activeTeamId;u!=null&&s.set(u,(s.get(u)??0)+1),n+=1}for(;r<a.length&&c-a[r].distanceCoveredMeters>=fa;){const u=a[r].rider.activeTeamId;if(u!=null){const m=(s.get(u)??0)-1;m<=0?s.delete(u):s.set(u,m)}r+=1}const l=o.rider.activeTeamId,p=l==null?0:Math.max(0,(s.get(l)??0)-1);t.set(o.rider.id,p===0?0:Ct(p*.3*this.resolveTeamBonusRoleMultiplier(o)))}return t}resolveTeamBonusRoleMultiplier(t){var a;switch((a=t.rider.role)==null?void 0:a.name){case"Kapitaen":case"Co-Kapitaen":case"Sprinter":return 1;case"Wassertraeger":return .1;default:return .5}}resolveTeamGroupBonusValue(t,a){return this.isTimeTrialMode||t.rider.activeTeamId==null?0:(a==null?void 0:a.get(t.rider.id))??0}resolveEffectiveSkill(t){const a=t.rider.incidentRecoverySecondsRemaining>0?Rd:0,s=this.resolveBreakawaySkillBonus(t.rider),r=t.baseSkill+Ha(t.rider.rider)+t.rider.dailyForm+t.rider.incidentRecoveryFormBonus+a+t.rider.microForm+s+t.teamGroupBonus-t.rider.breakawayMalus,n=Math.max(0,r),i=t.distanceMeters===t.rider.distanceCoveredMeters?this.resolveRiderElevationPenalty(t.rider,t.currentElevationMeters):this.resolveElevationPenalty(t.rider,t.distanceMeters);return{effectiveSkill:Math.max(0,n-i),staminaPenalty:t.staminaPenalty,elevationPenalty:i}}resolveStaminaPenalty(t,a){const s=ue(this.stageDistanceMeters/1e3,Ad,Bd),r=this.interpolateStaminaDistanceValue(s),n=ue(t,Zr,ms),i=(ms-n)/(ms-Zr),o=r/3+i*r,c=this.stageDistanceMeters<=0?0:ue(a/this.stageDistanceMeters,0,1);return o*c**2}resolveRiderStaminaPenalty(t){const a=Math.max(0,Math.floor(t.distanceCoveredMeters/1e3));return a===t.staminaPenaltyKmBucket||(t.staminaPenaltyKmBucket=a,t.staminaSkillPenalty=this.resolveStaminaPenalty(t.rider.skills.stamina,t.distanceCoveredMeters)),t.staminaSkillPenalty}interpolateStaminaDistanceValue(t){if(t<=pt[0].kmMark)return pt[0].value;for(let a=0;a<pt.length-1;a+=1){const s=pt[a],r=pt[a+1];if(t<=r.kmMark){const n=Math.max(1e-4,r.kmMark-s.kmMark),i=(t-s.kmMark)/n;return s.value+(r.value-s.value)*i}}return pt[pt.length-1].value}buildSpreadCurve(t){const a=Math.ceil(1/us),s=Math.max(1,Math.ceil(t/us)),r=de($d,Td),n=Array.from({length:s},()=>de(.2,1.2)),i=n.reduce((l,p)=>l+p,0),o=Array.from({length:a+1},()=>1);o[0]=r;let c=0;for(let l=1;l<=s;l+=1)c+=n[l-1]??0,o[l]=r+(1-r)*(c/i);return o}resolveSkillSpreadFactor(t,a){const s=this.stageDistanceMeters<=0?1:ue(t/this.stageDistanceMeters,0,1),r=Math.min(this.spreadCurve.length-1,Math.floor(s/us)),n=this.spreadCurve[r]??1;if(s<=this.lateStageStartRatio)return n;const i=Pl(this.simulationMode,a.terrain,this.skillWeightConfigMap),o=this.scaleFinalSpreadMultiplier(i.lateMultiplier),c=Math.max(o,this.scaleFinalSpreadMultiplier(i.peakMultiplier)),l=ue((s-this.lateStageStartRatio)/Math.max(1e-4,this.finalPushStartRatio-this.lateStageStartRatio),0,1),p=this.interpolateFinalSpread(o,l);if(o<=1&&c<=1)return n;if(s<this.finalPushStartRatio||c<=o)return Math.max(n,p);const u=ue((s-this.finalPushStartRatio)/Math.max(1e-4,1-this.finalPushStartRatio),0,1),m=o+(c-o)*u;return Math.max(n,m)}scaleFinalSpreadMultiplier(t){return 1+(Math.max(0,t)-1)*this.finalSpreadDifficultyMultiplier}interpolateFinalSpread(t,a){return 1+(t-1)*a}resolveWeightedSkillComponents(t){const a=this.weightedSkillComponentsByTerrain.get(t);if(a)return a;const s=gi(this.simulationMode,t,this.skillWeightRuleMap).map(r=>({key:r.key,weight:r.weight}));return this.weightedSkillComponentsByTerrain.set(t,s),s}resolveWeightedSkill(t,a,s=0){const r=this.resolveWeightedSkillComponents(a),n=s>0||t.mentorBoosts?{...t.skills}:t.skills;if(s>0&&(n.stamina=Math.max(0,n.stamina-s)),t.mentorBoosts)for(const[l,p]of Object.entries(t.mentorBoosts))typeof p=="number"&&(n[l]+=p);let i=0,o=0;for(const l of r)i+=l.weight,o+=n[l.key]*l.weight;return{value:i>0?o/i:Cl(n,this.simulationMode,a,this.skillWeightRuleMap),breakdown:this.resolveSkillBreakdown(t,a,r)}}resolveSkillBreakdown(t,a,s){const r=`${t.id}:${a}:${t.formBonus??0}:${t.raceFormBonus??0}:${t.fatigueMalus??0}:${t.longTermFatigueMalus??0}:${t.shortTermFatigueMalus??0}`,n=this.skillBreakdownCache.get(r);if(n!==void 0)return n;const i=Zd(t,s);return this.skillBreakdownCache.set(r,i),i}resolvePrimarySkillKey(t){switch(t){case"Flat":return"flat";case"Hill":return"hill";case"Medium_Mountain":return"mediumMountain";case"Mountain":return"mountain";case"Cobble":return"cobble";case"Sprint":return"sprint";case"Downhill":return"downhill";default:return"flat"}}resolveElevationPenaltyFromElevation(t,a){const s=(4*t.rider.skills.mountain+t.rider.skills.resistance+2*t.rider.skills.stamina)/7,r=Math.max(0,100-s)/1e3,n=this.resolveElevationBucket(a);return r*(n**3/1500/1e5)}resolveElevationPenalty(t,a){return this.resolveElevationPenaltyFromElevation(t,this.interpolateElevation(a))}resolveRiderElevationPenalty(t,a){const s=a??this.interpolateElevation(t.distanceCoveredMeters),r=this.resolveElevationBucket(s);return r===t.elevationPenaltyHmBucket||(t.elevationPenaltyHmBucket=r,t.elevationPenalty=this.resolveElevationPenaltyFromElevation(t,s)),t.elevationPenalty}resolveSegmentElevation(t,a){const s=t.start_km*1e3,r=t.end_km*1e3,n=Math.max(1e-4,r-s),i=ue((a-s)/n,0,1);return t.start_elevation+(t.end_elevation-t.start_elevation)*i}resolveElevationBucket(t){return Math.max(0,Math.floor(t/10)*10)}interpolateElevation(t){const a=this.bootstrap.stageSummary.points;if(a.length===0)return 0;const r=ue(t,0,this.stageDistanceMeters)/1e3;if(r<=a[0].kmMark)return a[0].elevation;for(let n=0;n<a.length-1;n+=1){const i=a[n],o=a[n+1];if(r<=o.kmMark){const c=Math.max(1e-4,o.kmMark-i.kmMark),l=(r-i.kmMark)/c;return i.elevation+(o.elevation-i.elevation)*l}}return a[a.length-1].elevation}calculatePhotoFinishScore(t){return this.resolveRiderStaminaPenalty(t),ps(t,this.finishWeightProfile)}logFinishSprintTieBreakIfNeeded(){var u;if(this.hasLoggedFinishSprintTieBreak||this.isTimeTrialMode||!this.isFinished())return;this.hasLoggedFinishSprintTieBreak=!0;const t=this.riders.filter(he).sort((m,f)=>(m.finishTimeSeconds??0)-(f.finishTimeSeconds??0)||f.photoFinishScore-m.photoFinishScore||m.rider.id-f.rider.id);if(t.length===0)return;const a=[];let s=null;for(const m of t){const f=m.finishTimeSeconds??0;if(a.length===0){a.push(m),s=f;continue}if(s!=null&&f-s<=qt){a.push(m),s=f;continue}break}const r=this.resolveFinishMarkerType(),n=this.isClimberMalusStage(),i=m=>m.photoFinishScore,o=[...a].sort((m,f)=>i(f)-i(m)||m.rider.id-f.rider.id),c=((u=o[0])==null?void 0:u.finishTimeSeconds)??0,l=this.finishWeightProfile,p=`Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile}`;console.groupCollapsed(`[FinishSprintTieBreak] ${p} | erste Zielgruppe (${o.length} Fahrer) | Zeitfenster <= ${qt.toFixed(2)} s`),console.log("[FinishSprintTieBreak] Sortierung: erst Zielzeit, dann Score (photoFinish + SpecAdjustment) absteigend, dann Fahrer-ID."),console.log(`[FinishSprintTieBreak] Kontext: ${r}${n?" | Bergfahrer-Malus aktiv":""}`),o.forEach((m,f)=>{const g=ac(m,l).map($=>`${xi[$.skillKey]} ${$.contribution.toFixed(2)} = ${$.effectiveSkill.toFixed(2)} x ${($.weight*100).toFixed(0)}%`).join(" | "),b=m.finishTimeSeconds??0,y=b-c,v=y<=1e-4?`${b.toFixed(2)} s`:`${b.toFixed(2)} s (+${y.toFixed(2)} s)`,T=this.calculatePhotoFinishScore(m),w=m.leadoutBonus??0,M=Wt(m,r,n);console.log(`#${f+1} Zielsprint | ${m.riderName} | Zeit ${v} | Score (ohne Boni): ${T.toFixed(2)} -> Score (mit Boni): ${m.photoFinishScore.toFixed(2)} [SpecAdj: ${M>0?"+":""}${M.toFixed(2)}, Leadout: +${w.toFixed(2)}] | ID-Tiebreak ${m.rider.id} | (${g})`)}),console.groupEnd()}recordIntermediateSplits(t,a,s,r,n){if(!(n<=0))for(;t.nextIntermediateIndex<this.intermediateMarkers.length;){const i=this.intermediateMarkers[t.nextIntermediateIndex];if(i.distanceMeters>s)break;if(i.distanceMeters<a){t.nextIntermediateIndex+=1;continue}const o=(i.distanceMeters-a)/n,c=Math.max(0,this.isTimeTrialMode?r+o-t.startOffsetSeconds:r+o);let l=this.resolveMarkerCrossingScore(t,i);const p=i.markerType==="sprint_intermediate"?"sprint_intermediate":i.markerType==="climb_top"?"climb_top":null;p&&(l+=Wt(t,p,this.isClimberMalusStage(),i.markerCategory)),t.lastSplitLabel=i.label,t.lastSplitTimeSeconds=c,t.splitTimes[i.key]=c,t.splitTimes[i.label]=c,t.markerCrossings[i.key]={riderId:t.rider.id,markerKey:i.key,markerLabel:i.label,markerType:i.markerType,markerCategory:i.markerCategory,kmMark:i.distanceMeters/1e3,crossingTimeSeconds:c,photoFinishScore:l},t.nextIntermediateIndex+=1}}resolveMarkerCrossingScore(t,a){if(a.markerType==="sprint_intermediate")return ps(t,this.resolveSprintWeightProfile());const s=ps(t,this.resolveClimbWeightProfile(a.markerCategory)),r=Vd(`${this.bootstrap.stage.id}:${a.key}:${t.rider.id}`)*25;return s+r}resolveSprintWeightProfile(){return this.stageScoringWeightMap.get("sprint_intermediate")??gd}resolveClimbWeightProfile(t){const a=!t||t==="Sprint"?"HC":t;return this.stageScoringWeightMap.get(`climb_top|${a}`)??yd[a]}calculatePreLeadoutFinishScore(t){const s=this.resolveStaminaPenalty(t.rider.skills.stamina,this.stageDistanceMeters)+t.incidentStaminaPenalty,r=Ha(t.rider),n=Object.entries(this.finishWeightProfile).reduce((o,[c,l])=>{if(!l)return o;const p=c==="stamina"?s:0,u=Math.max(0,t.rider.skills[c]+r+t.dailyForm+t.microForm+t.teamGroupBonus-p);return o+u*l},0),i=Wt(t,this.resolveFinishMarkerType(),this.isClimberMalusStage());return n+i}applySprintLeadoutBonuses(){const t=this.resolveFinishMarkerType();if(t!=="finish_flat"&&t!=="finish_hill"||this.isTimeTrialMode)return;const a=this.riders.filter(he).sort((o,c)=>(o.finishTimeSeconds??0)-(c.finishTimeSeconds??0));if(a.length===0)return;const s=[];let r=null;for(const o of a){const c=o.finishTimeSeconds??0;if(s.length===0){s.push(o),r=c;continue}if(r!=null&&c-r<=qt){s.push(o),r=c;continue}break}const n=new Set(s.map(o=>o.rider.id)),i=new Map;for(const o of this.riders)if(o.finishStatus!=="dnf"&&o.finishStatus!=="otl"&&o.finishStatus!=="dns"&&o.finishTimeSeconds!=null&&o.rider.skills.sprint>=73&&o.rider.activeTeamId!=null&&n.has(o.rider.id)){const c=o.rider.activeTeamId,l=i.get(c)??[];l.push(o),i.set(c,l)}for(const[o,c]of i.entries()){if(c.length===0)continue;let l=null,p=Number.NEGATIVE_INFINITY;for(const u of c){const m=this.calculatePreLeadoutFinishScore(u);m>p?(p=m,l=u):m===p&&l!==null&&(u.rider.skills.sprint>l.rider.skills.sprint||u.rider.skills.sprint===l.rider.skills.sprint&&u.rider.id<l.rider.id)&&(l=u)}if(l){const u=this.calculateSprintLeadoutBonusForRider(l);u>0&&(l.leadoutBonus=u,l.photoFinishScore+=u)}}}calculateSprintLeadoutBonusForRider(t){const a=t.rider.activeTeamId;if(a==null)return 0;const s=this.riders.filter(p=>p.rider.activeTeamId===a);if(s.length===0)return 0;let r=this.teamSprintRandomValues.get(a);r===void 0&&(r=de(.25,.6),this.teamSprintRandomValues.set(a,r));let n=this.teamSprintSpecialRandomValues.get(a);n===void 0&&(n=de(.1,.3),this.teamSprintSpecialRandomValues.set(a,n)),t.leadoutRiderId=null;let i=0,o=0,c=null;const l=[];for(const p of s){if(p.rider.id===t.rider.id||p.finishStatus==="dnf"||p.finishStatus==="otl"||p.finishStatus==="dns")continue;let u=0;const m=p.rider.skills.sprint>=72,f=p.rider.skills.flat>=78,g=p.rider.skills.timeTrial>=76,b=p.rider.skills.acceleration>=80;if(m&&u++,f&&u++,g&&u++,b&&u++,u>0){const y=m?r:n;let v=1;u===2?v=1.25:u===3?v=1.5:u===4&&(v=2);const T=y*v*1.5;if(i+=y*v,l.push({riderId:p.rider.id,name:p.riderName,contribution:Number(T.toFixed(2))}),y*v>o)o=y*v,c=p.rider.id;else if(y*v===o&&c!==null){const w=this.riders.find(M=>M.rider.id===c);w&&p.rider.skills.sprint>w.rider.skills.sprint&&(c=p.rider.id)}}}return i>0&&(t.leadoutRiderId=c,t.leadoutContributions=l),i*1.5}resolveFinishMarkerType(){const t=Je(this.bootstrap.stageSummary);for(let a=t.length-1;a>=0;a-=1){const s=t[a].marker.type;if(s==="finish_flat"||s==="finish_hill"||s==="finish_mountain")return s}switch(this.bootstrap.stage.profile){case"Hilly":case"Hilly_Difficult":case"Rolling":case"Cobble_Hill":return"finish_hill";case"Medium_Mountain":case"Mountain":case"High_Mountain":return"finish_mountain";default:return"finish_flat"}}resolveFinishWeightProfile(){const t=this.resolveFinishMarkerType(),a=this.stageScoringWeightMap.get(t);if(a)return a;switch(t){case"finish_hill":return hd;case"finish_mountain":return bd;default:return fd}}resolveRiderClockSeconds(t){if(he(t)){const a=t.finishTimeSeconds;return a==null||!Number.isFinite(a)?null:Math.max(0,a-t.startOffsetSeconds)}return t.finishStatus==="dnf"?null:this.isTimeTrialMode?t.hasStarted?Math.max(0,this.elapsedSeconds-t.startOffsetSeconds):null:this.elapsedSeconds}applyIncident(t,a,s,r=!1){var n;if(t.pendingIncident=null,t.appliedIncident=a,t.incidentDelaySecondsRemaining=a.waitDurationSeconds,t.incidentRecoverySecondsRemaining=a.recoverySeconds,t.incidentRecoveryFormBonus=a.recoveryFormBonus,t.dailyForm+=a.dayFormPenalty,t.incidentStaminaPenalty+=a.staminaPenalty,t.statusReason=a.type==="crash"?`crash:${a.severity??"unknown"}${a.hasAdditionalMechanical?"+mechanical":""}`:"mechanical",t.dailyFormCap!=null&&(t.dailyForm=Math.min(t.dailyForm,t.dailyFormCap)),a.type==="crash"&&(a.severity==="medium"&&(t.dailyForm=Math.min(0,t.dailyForm-3),t.microForm-=3,t.dailyFormCap=0),a.severity==="light"&&(t.dailyForm+=0),a.severity==="severe"&&(t.finishStatus="dnf",t.finishTimeSeconds=null,t.currentSpeedMps=0,t.tempSpeedMps=0,t.nextDistanceCoveredMeters=null,t.isAttacking=!1,t.isLeadingGroup=!1,this.activeStageAttacksByRiderId.delete(t.rider.id),t.incidentDelaySecondsRemaining=0,t.incidentRecoverySecondsRemaining=0,t.incidentRecoveryFormBonus=0)),((n=t.rider.role)==null?void 0:n.name)==="Kapitaen"&&a.supportRiderIds.length>0&&a.severity!=="severe")for(const i of a.supportRiderIds){const o=this.riders.find(c=>c.rider.id===i);o&&(o.waitingForCaptainId=t.rider.id,o.waitForCaptainRecovery=!0,o.waitLogged=!1)}if(a.isMassCrashTrigger&&a.massCrashPotentialRiderIds){r=!0;const i=[];for(const o of a.massCrashPotentialRiderIds){const c=this.riders.find(p=>p.rider.id===o);if(!c||ee(c))continue;if(Math.abs(c.distanceCoveredMeters-t.distanceCoveredMeters)<=50){i.push(o);const p=Gl(c.rider,this.bootstrap.riders,a.triggerDistanceKm,this.bootstrap.stageSummary.distanceKm);this.applyIncident(c,p,s,!0)}}console.log(`[RaceIncidents] Massensturz ausgelöst durch Fahrer ${t.rider.id} bei Km ${a.triggerDistanceKm}. Tatsächlich verwickelte Fahrer (${i.length}):`,i)}this.pushMessage({elapsedSeconds:s,riderId:t.rider.id,riderName:t.riderName,type:"incident",tone:a.type==="crash"?"danger":"warning",title:r?a.isMassCrashTrigger?`Massensturz (Auslöser): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`Massensturz (involviert): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:a.type==="crash"?`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} stürzt`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} hat einen Defekt`,detail:a.type==="crash"?(()=>{let i="Low",o="Regenerationsmalus auf den nächsten Etappen (-10, -5, -2 Form)";return a.severity==="medium"?(i="Middle",o="Frischeverlust (-15 Frische) und verringerte Tagesform für den Rest der Etappe"):a.severity==="severe"&&(i="High",o="Fahrer musste die Etappe beenden (DNF)"),`Auswirkung: ${i} · Folge: ${o} · Wartezeit: ${a.waitDurationSeconds}s`})():`Wartezeit: ${a.waitDurationSeconds}s`}),a.type==="crash"&&a.severity==="severe"&&this.pushMessage({elapsedSeconds:s,riderId:t.rider.id,riderName:t.riderName,type:"dnf",tone:"danger",title:r?`Massensturz (Folge): ${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist ausgeschieden`,detail:`Schwerer Sturz bei km ${a.triggerDistanceKm.toFixed(2)}.`}),console.log("[RaceIncidents] Trigger",{rider:t.riderName,type:a.type,severity:a.severity,kmMark:a.triggerDistanceKm,waitDurationSeconds:a.waitDurationSeconds,eventTimeSeconds:s,supportRiderIds:a.supportRiderIds})}applyCaptainWaitLogic(t){if(t.waitingForCaptainId==null)return;const a=this.riders.find(s=>s.rider.id===t.waitingForCaptainId)??null;if(!a||a.finishStatus==="dnf"){t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1;return}if(!(t.waitForCaptainRecovery&&(a.incidentDelaySecondsRemaining>0||a.incidentRecoverySecondsRemaining>0))){if(t.waitForCaptainRecovery=!1,t.distanceCoveredMeters>a.distanceCoveredMeters+fa){t.currentSpeedMps=0,t.nextDistanceCoveredMeters=t.distanceCoveredMeters,t.waitLogged||(this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_wait",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} wartet auf ${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)}`,detail:"Helfer nimmt Tempo raus, bis der Kapitän wieder anschließt."}),console.log("[RaceIncidents] Helfer wartet",{helper:t.riderName,captain:a.riderName}),t.waitLogged=!0);return}t.waitLogged&&this.pushMessage({elapsedSeconds:this.elapsedSeconds,riderId:t.rider.id,riderName:t.riderName,type:"support_resume",tone:"neutral",title:`${this.formatRiderWithPreStageGc(t.rider.id,t.riderName)} ist wieder beim Kapitän`,detail:`${this.formatRiderWithPreStageGc(a.rider.id,a.riderName)} hat den Helfer wieder erreicht.`}),t.waitingForCaptainId=null,t.waitForCaptainRecovery=!1,t.waitLogged=!1}}}const nc=300;async function ic(e,t){const a=new Ii(e,{maxSubstepSeconds:5});let s=!1;for(;!s;){const r=a.step(nc);if(s=r.isFinished,t){const n=r.stageDistanceMeters>0?r.leaderDistanceMeters/r.stageDistanceMeters:0,i=e.riders.length>0?r.finishedRiders/e.riders.length:0,o=Math.min(1,Math.max(0,Math.max(n,i)));t(o)}await new Promise(n=>setTimeout(n,0))}return t==null||t(1),a.getSnapshot()}const oc=[1,2,5,10,25,50,100,250,500],tn=new WeakMap;function lc(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function an(e){return`${(e/1e3).toFixed(1).replace(".",",")} km`}function dc(e){const t=tn.get(e);if(t)return t;e.dataset.raceSimMounted="true",e.innerHTML=`
    <div class="race-sim-control-header-row">
      <button type="button" class="race-sim-speed-btn race-sim-speed-btn-toggle" data-race-sim-action="toggle">Start</button>
      <div class="race-sim-speed-strip">
        ${oc.map(s=>`
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
    </div>`;const a={timeField:e.querySelector('[data-race-sim-field="time"]'),finishedField:e.querySelector('[data-race-sim-field="finished"]'),distanceField:e.querySelector('[data-race-sim-field="distance"]'),toggleButton:e.querySelector('[data-race-sim-action="toggle"]'),speedButtons:Array.from(e.querySelectorAll("[data-race-sim-speed]"))};return tn.set(e,a),a}function sn(e,t){const a=dc(e);a.timeField&&(a.timeField.textContent=lc(t.snapshot.elapsedSeconds)),a.finishedField&&(a.finishedField.textContent=`${t.snapshot.finishedRiders} / ${t.totalRiders} im Ziel`),a.distanceField&&(a.distanceField.textContent=`${an(t.snapshot.leaderDistanceMeters)} / ${an(t.snapshot.stageDistanceMeters)}`),a.toggleButton&&(a.toggleButton.textContent=t.isRunning?"Pause":t.snapshot.isFinished?"Fertig":"Start",a.toggleButton.classList.toggle("active",!t.isRunning&&!t.snapshot.isFinished)),a.speedButtons.forEach(s=>{const r=Number(s.dataset.raceSimSpeed);s.classList.toggle("active",r===t.timeMultiplier)})}const cc=[{key:"all",label:"Alle"},{key:"attack",label:"Attacken"},{key:"crash",label:"Stürze"},{key:"mechanical",label:"Defekte"},{key:"breakaway",label:"Ausreißer"}];function uc(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/60),s=t%60;return`${a}:${String(s).padStart(2,"0")}`}function Bt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function mc(e){return`/jersey/Jer_${e}.png`}function Ri(e,t="race-sim-message-jersey"){return`
    <span class="${t}" aria-hidden="true">
      <img
        class="race-sim-message-jersey-img"
        src="${Bt(mc(e))}"
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function pc(e){return e.riderId==null||e.riderTeamId==null?"":Ri(e.riderTeamId)}function gc(e){const t=Bt(e.title);return e.riderId==null?`<strong class="race-sim-message-title">${t}</strong>`:`<button type="button" class="race-sim-message-title race-sim-message-rider-link" data-race-sim-group-rider-id="${e.riderId}">${t}</button>`}function fc(e,t){return`<button type="button" class="race-sim-message-inline-name race-sim-message-rider-link" data-race-sim-group-rider-name="${Bt(e)}"${t!=null?` data-race-sim-group-rider-team-id="${t}"`:""}>${Bt(e)}</button>`}function hc(e,t){if(t==="all")return!0;const a=Ei(e);return t==="attack"?a==="attack"||a==="counter_attack":a===t}function bc(e){const t=e.detail?Bt(e.detail):"",a=(e.secondaryRiders??[]).map(r=>`${r.riderTeamId!=null?Ri(r.riderTeamId,"race-sim-message-inline-jersey"):""}${fc(r.riderName,r.riderTeamId)}`).join(", ");if(!t&&a.length===0)return"";const s=a.length>0?`${t.length>0?" ":""}Reaktion: ${a}.`:"";return`<span class="race-sim-message-detail"> · ${t}${s}</span>`}function Ei(e){return e.title.includes("stürzt")||e.title.includes("Sturz")?"crash":e.title.includes("Defekt")?"mechanical":e.title.includes("Ausreißer")?"breakaway":e.type}function rn(e,t,a="all"){const s=t.filter(n=>hc(n,a)),r=t.length===0?"Noch keine Events in dieser Etappe.":"Keine Meldungen in dieser Kategorie.";e.innerHTML=`
    <div class="race-sim-messages-filter" role="toolbar" aria-label="Meldungen filtern">
      ${cc.map(n=>`
        <button type="button" class="race-sim-messages-filter-btn${n.key===a?" active":""}" data-race-sim-message-filter="${n.key}">${n.label}</button>
      `).join("")}
    </div>
    <div class="race-sim-message-list">
      ${s.length===0?`<div class="race-sim-message-empty">${r}</div>`:s.map(n=>`
        <article class="race-sim-message-item" data-tone="${n.tone}" data-message-kind="${Bt(Ei(n))}">
          <span class="race-sim-message-time">t=${uc(n.elapsedSeconds)}</span>
          ${pc(n)}
          <span class="race-sim-message-text">
            ${gc(n)}
            ${bc(n)}
          </span>
        </article>
      `).join("")}
    </div>`}const yc=1,vc={Flat:12,Rolling:14,Hilly:16,Hilly_Difficult:17,Medium_Mountain:18,Mountain:23,High_Mountain:25,ITT:30,TTT:40,Cobble:18,Cobble_Hill:20};function Sc(e){return Math.max(0,Math.round(e))}function Fi(e){return e==="ITT"||e==="TTT"}function kc(e){return vc[e]??20}function $c(e,t){if(t.length===0)return null;const a=Math.min(...t);return!Number.isFinite(a)||a<=0?null:Math.floor(a*(1+kc(e)/100))}function Tc(e,t){return e.stageTimeSeconds-t.stageTimeSeconds||t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function nn(e,t){return t.photoFinishScore-e.photoFinishScore||e.riderId-t.riderId}function gs(e,t){if(Fi(t))return[...e].sort(Tc);const a=[...e].sort((o,c)=>o.stageTimeSeconds-c.stageTimeSeconds||nn(o,c)),s=[];let r=[],n=null;const i=()=>{s.push(...r.sort(nn))};for(const o of a){if(r.length===0){r=[o],n=o.stageTimeSeconds;continue}if(n!=null&&o.stageTimeSeconds-n<=yc){r.push(o),n=o.stageTimeSeconds;continue}i(),r=[o],n=o.stageTimeSeconds}return r.length>0&&i(),s}function X(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Mc(e){return`/jersey/Jer_${e}.png`}function ia(e,t){return e==null||e<=0?"—":`
    <span class="race-sim-team-visual" title="${X(t??`Team ${e}`)}">
      <img
        class="race-sim-team-jersey-img"
        src="${X(Mc(e))}"
        alt=""
        width="18"
        height="18"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
      >
    </span>`}function oa(e,t,a){return e==null?`<span class="${a}" title="${X(t)}">${X(t)}</span>`:`<button type="button" class="${a} race-sim-stage-overview-rider-link" data-race-sim-group-rider-id="${e}" title="${X(t)}">${X(t)}</button>`}function xc(e){return e.toFixed(1).replace(".",",")}function za(e){if(e==null||e<=0)return"—";const t=Math.floor(e/60),a=Math.floor(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function wc(e){return`${e??0} Pkt.`}function Ic(e){if(e==null||!Number.isFinite(e))return"—";const t=Math.round(e);return t===0?"—":t>0?`+${t} m`:`-${Math.abs(t)} m`}function Rc(e){return e==null||!Number.isFinite(e)?"":e<-100?"is-ahead":e>100?"is-behind":""}function Ci(e){const t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function Ec(e){if(e==null||e<=0)return Ci(0);const t=Math.floor(e/60),a=Math.round(e%60);return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function lt(e){return e?e.split("|").map(t=>Number.parseInt(t.trim(),10)).filter(Number.isFinite):[]}function va(e){return`${e.toFixed(1).replace(".",",")} km`}function on(e){return`${e.toFixed(1).replace(".",",")}%`}function Sa(e,t){return e.filter(a=>Number.isFinite(a)&&a>0).map(a=>({points:a,pointsKind:t}))}function ln(e){return e==null?null:e==="HC"?"is-hc":`is-cat-${e}`}function Fc(e){return e.accent==="sprint"?{label:"Sprint",className:"is-sprint"}:e.categoryLabel&&e.categoryClassName?{label:e.categoryLabel,className:e.categoryClassName}:null}function Cc(e,t){return e.riderId==null?null:t.gcLeaderRiderId===e.riderId?"gc":t.pointsLeaderRiderId===e.riderId?"points":t.mountainLeaderRiderId===e.riderId?"mountain":t.youthLeaderRiderId===e.riderId?"youth":null}function Nc(e,t,a){return Array.from({length:t},(s,r)=>e.slice(r*a,(r+1)*a))}function Pc(e,t,a){if(e.length===0)return'<div class="race-sim-favorites-empty">Noch keine Favoriten für diese Etappe.</div>';const s=Nc(e,4,5),r=new Map(t.map(n=>[n.riderId,n]));return`<div class="race-sim-stage-favorites-grid">${s.map(n=>`
    <div class="race-sim-favorites-column">
      ${n.map(i=>`
        <article class="race-sim-favorite-item${(()=>{const o=Cc(i,a);return o?` is-${o}-leader`:""})()}">
          <strong class="race-sim-favorite-rank">${i.rank}.</strong>
          ${ia(i.teamId,i.teamName)}
          <div class="race-sim-favorite-main">
                    ${oa(i.riderId,i.displayName,"race-sim-favorite-name")}
            <span class="race-sim-favorite-role" title="${X(i.roleLabel)}">${X(i.roleLabel)}</span>
            ${(()=>{const o=i.riderId!=null?r.get(i.riderId)??null:null;return o?`<span class="race-sim-favorite-gc">GC ${o.rank} · ${X(za(o.gapSeconds))}</span>`:""})()}
          </div>
          <strong class="race-sim-favorite-skill">${xc(i.effectiveSkill)}</strong>
        </article>
      `).join("")}
    </div>
  `).join("")}</div>`}function aa(e,t){const a=e.riders.find(s=>s.id===t);return a?`${a.firstName} ${a.lastName}`:`Fahrer ${t}`}function ts(e,t){const a=e.riders.find(n=>n.id===t),s=(a==null?void 0:a.activeTeamId)??null,r=s!=null?e.teams.find(n=>n.id===s)??null:null;return{teamId:s,teamName:(r==null?void 0:r.name)??null}}function Lc(e,t,a,s={}){const r=(t??[]).slice(0,s.limit??8);return r.length===0?'<div class="race-sim-classification-empty">Noch keine Vorwertung.</div>':`<div class="race-sim-classification-grid">${r.map(n=>{var u;const i=n.riderId??0,o=ts(e,i),c=aa(e,i),l=((u=s.distanceGapsByRiderId)==null?void 0:u.get(i))??null,p=[s.distanceGapClassName??"",Rc(l)].filter(m=>m.length>0).join(" ");return`
      <article class="race-sim-classification-row">
        <strong class="race-sim-favorite-rank">${n.rank}.</strong>
        ${ia(o.teamId,o.teamName)}
        <span class="race-sim-classification-main">
          ${oa(n.riderId,c,"race-sim-classification-name")}
          <span class="race-sim-classification-value">${a(n)}</span>
        </span>
        ${s.distanceGapsByRiderId?`<span class="race-sim-classification-distance-gap ${p}">${X(Ic(l))}</span>`:""}
      </article>`}).join("")}</div>`}function ka(e,t,a,s,r,n={}){return`
    <section class="race-sim-classification-box race-sim-classification-box-${t}">
      <h4>${X(e)}</h4>
      ${Lc(a,s,r,n)}
    </section>`}function xt(e,t,a,s,r=!0){return`
    <details class="race-sim-overview-details ${a}" data-race-sim-overview-section="${s}" ${r?"open":""}>
      <summary class="race-sim-overview-summary" data-race-sim-overview-summary="${s}">
        <span class="race-sim-overview-arrow">›</span>
        <span>${X(e)}</span>
      </summary>
      ${t}
    </details>`}function Ka(e,t,a,s){const r=new Map(t.map(n=>[n.riderId,n]));return e.riders.map(n=>{var c;const i=r.get(n.id)??null,o=((c=a.get(n.id))==null?void 0:c[s])??0;return{riderId:n.id,rank:(i==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER,points:((i==null?void 0:i.points)??0)+o,timeSeconds:(i==null?void 0:i.timeSeconds)??null,gapSeconds:(i==null?void 0:i.gapSeconds)??null,stagePoints:o}}).sort((n,i)=>(i.points??0)-(n.points??0)||n.rank-i.rank||aa(e,n.riderId).localeCompare(aa(e,i.riderId),"de")).map((n,i)=>({...n,rank:i+1}))}function dn(e){const t=Dc(e)?e.stagePoints:0;return`${X(wc("points"in e?e.points:null))}${t>0?`<span class="race-sim-classification-stage-gain"><span class="race-sim-classification-stage-gain-arrow">▲</span><span class="race-sim-classification-stage-gain-amount">+${X(t)}</span></span>`:""}`}function Dc(e){return"stagePoints"in e&&typeof e.stagePoints=="number"}function cn(e,t){if(t==null)return new Map;const a=e.riders.find(s=>s.riderId===t)??null;return a?new Map(e.riders.map(s=>[s.riderId,a.distanceCoveredMeters-s.distanceCoveredMeters])):new Map}function Ac(e,t){return e.stageSummary.segments.find(a=>t>=a.start_km&&t<=a.end_km)??e.stageSummary.segments.find(a=>a.end_km>=t)??e.stageSummary.segments[e.stageSummary.segments.length-1]??null}function Ca(e,t){var s;const a=(s=e.race.category)==null?void 0:s.bonusSystem;return!a||t==null||t==="Sprint"?[]:lt(t==="HC"?a.pointsMountainHc:t==="1"?a.pointsMountainCat1:t==="2"?a.pointsMountainCat2:t==="3"?a.pointsMountainCat3:a.pointsMountainCat4)}function Vs(e){var s;const t=(s=e.race.category)==null?void 0:s.bonusSystem;if(!t||e.stage.profile==="TTT")return[];if(!e.race.isStageRace)return lt(t.pointsOneDay);const a=!["ITT","TTT","Flat","Rolling","Hilly"].includes(e.stage.profile);return lt(a?t.pointsMountainStage:t.pointsSprintFinish)}function Ni(e){var t,a;return e.stage.profile==="ITT"||e.stage.profile==="TTT"?[]:lt((a=(t=e.race.category)==null?void 0:t.bonusSystem)==null?void 0:a.pointsSprintIntermediate)}function Bc(e,t,a){let s=null;for(const r of e.stageSummary.segments){const n=Math.max(t,r.start_km),i=Math.min(a,r.end_km),o=Math.max(0,i-n);if(o<=0)continue;const c={lengthKm:o,gradient:r.gradient_percent};(s==null||c.gradient>s.gradient||c.gradient===s.gradient&&c.lengthKm>s.lengthKm)&&(s=c)}return s}function fs(e,t,a,s=null){return e.entries.filter(r=>s==null||s.has(r.riderId)).map((r,n)=>({riderId:r.riderId,rank:r.rank,points:t[n]??0,pointsKind:a,crossingTimeSeconds:r.crossingTimeSeconds,gapSeconds:r.gapSeconds})).filter(r=>r.points>0)}function Us(e){const t=new Map;for(const a of e)for(const s of a.entries){const r=t.get(s.riderId)??{points:0,mountain:0};s.pointsKind==="mountain"?r.mountain+=s.points:r.points+=s.points,t.set(s.riderId,r)}return t}function _c(e){return Je(e.stageSummary).filter(({marker:t})=>t.type==="finish_flat"||t.type==="finish_TT"||t.type==="finish_hill"||t.type==="finish_mountain").sort((t,a)=>a.kmMark-t.kmMark)[0]??null}function Wa(e,t){const a=Fi(e.stage.profile)?t.riderClockSeconds:t.finishTimeSeconds;return a!=null&&Number.isFinite(a)?Sc(a):null}function as(e,t){const a=t.riders.filter(n=>n.finishStatus!=="dnf").map(n=>{const i=Wa(e,n);return i==null?null:{rider:n,stageTimeSeconds:i,photoFinishScore:n.photoFinishScore,riderId:n.riderId}}).filter(n=>n!=null);if(a.length===0)return[];const s=Math.min(...a.map(n=>n.stageTimeSeconds));if(!Number.isFinite(s)||s<=0)return gs(a,e.stage.profile).map(n=>n.rider);const r=$c(e.stage.profile,a.map(n=>n.stageTimeSeconds));return r==null?gs(a,e.stage.profile).map(n=>n.rider):gs(a.filter(n=>n.stageTimeSeconds<=r),e.stage.profile).map(n=>n.rider)}function Gc(e,t){const a=Vs(e);return a.length===0?[]:as(e,t).map((s,r)=>({riderId:s.riderId,rank:r+1,points:a[r]??0,pointsKind:"points",crossingTimeSeconds:Wa(e,s),gapSeconds:null})).filter(s=>s.points>0)}function Hc(e,t){const a=as(e,t).slice(0,20),s=a[0]!=null?Wa(e,a[0])??0:0;return a.map((r,n)=>{const i=Wa(e,r)??0;return{riderId:r.riderId,rank:n+1,crossingTimeSeconds:i,gapSeconds:Math.max(0,i-s),photoFinishScore:r.photoFinishScore}})}function zc(e,t){var a;return((a=as(e,t)[0])==null?void 0:a.riderId)??null}function Ys(e,t,a){var w,M;const s=Je(e.stageSummary),r=e.stageSummary.distanceKm*.75,n=a.isFinished?new Set(as(e,a).map($=>$.riderId)):null,i=s.filter(({marker:$})=>$.type==="climb_start"),o=s.filter(({marker:$})=>ut($)).sort(($,E)=>$.kmMark-E.kmMark).map(($,E)=>{var se,Q;const R=[...i].reverse().find(V=>V.kmMark<=$.kmMark)??null,N=Ac(e,$.kmMark),P=(R==null?void 0:R.kmMark)??(N==null?void 0:N.start_km)??$.kmMark,D=(R==null?void 0:R.elevation)??(N==null?void 0:N.start_elevation)??$.elevation,A=Math.max(0,$.kmMark-P),_=A>0?($.elevation-D)/(A*1e3)*100:(N==null?void 0:N.gradient_percent)??0,G=Bc(e,P,$.kmMark),x=t.find(V=>V.markerKey===$.key)??null,L=Ca(e,(x==null?void 0:x.markerCategory)??$.marker.cat??null),O=x?fs(x,L,"mountain",n):[],K=(x==null?void 0:x.markerCategory)??$.marker.cat??null;return{key:$.key,title:`${E+1}. Bergwertung`,label:$.label,categoryLabel:K?`Kat. ${K}`:null,categoryClassName:ln(K),kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:A,averageGradient:_,steepestSegmentLengthKm:(G==null?void 0:G.lengthKm)??null,steepestSegmentGradient:(G==null?void 0:G.gradient)??null,highlightMeta:$.kmMark>=r,leaderRiderId:((se=O[0])==null?void 0:se.riderId)??((Q=x==null?void 0:x.entries[0])==null?void 0:Q.riderId)??null,displayBadges:Sa(L,"mountain"),entries:O,timingEntries:(x==null?void 0:x.entries)??[],accent:"mountain"}}),c=s.filter(({marker:$})=>$.type==="sprint_intermediate").sort(($,E)=>$.kmMark-E.kmMark).map(($,E)=>{var D,A;const R=t.find(_=>_.markerKey===$.key)??null,N=Ni(e),P=R?fs(R,N,"points",n):[];return{key:$.key,title:`${E+1}. Zwischensprint`,label:$.label,categoryLabel:null,categoryClassName:null,kmMark:$.kmMark,kmToFinish:Math.max(0,e.stageSummary.distanceKm-$.kmMark),climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!1,leaderRiderId:((D=P[0])==null?void 0:D.riderId)??((A=R==null?void 0:R.entries[0])==null?void 0:A.riderId)??null,displayBadges:Sa(N,"points"),entries:P,timingEntries:(R==null?void 0:R.entries)??[],accent:"sprint"}}),l=_c(e),p=Gc(e,a),u=l?t.find($=>$.markerKey===l.key)??null:null,m=u?fs(u,Ca(e,u.markerCategory),"mountain",n):[],f=Vs(e),g=u?Ca(e,u.markerCategory):[],b=e.stage.profile==="ITT"||e.stage.profile==="TTT"?Hc(e,a):(u==null?void 0:u.entries)??[],y=((w=p[0])==null?void 0:w.riderId)??((M=m[0])==null?void 0:M.riderId)??zc(e,a),v={key:"finish",title:"Zielsprint",label:(l==null?void 0:l.label)??"Ziel",categoryLabel:u!=null&&u.markerCategory?`Kat. ${u.markerCategory}`:null,categoryClassName:ln((u==null?void 0:u.markerCategory)??null),kmMark:(l==null?void 0:l.kmMark)??e.stageSummary.distanceKm,kmToFinish:0,climbLengthKm:null,averageGradient:null,steepestSegmentLengthKm:null,steepestSegmentGradient:null,highlightMeta:!!(u!=null&&u.markerCategory),leaderRiderId:y,displayBadges:[...Sa(f,"points"),...Sa(g,"mountain")],entries:[...p,...m],timingEntries:b,accent:"finish"};return[...[...c,...o].sort(($,E)=>$.kmMark-E.kmMark||$.title.localeCompare(E.title,"de")),v].filter($=>$.entries.length>0||$.timingEntries.length>0||$.accent!=="finish"||l!=null||a.isFinished)}function Kc(e,t){const a=new Map(t.entries.map(n=>[n.riderId,n])),s=(e.stage.profile==="ITT"||e.stage.profile==="TTT")&&t.key==="finish"?20:15,r=t.timingEntries.length>0?[...t.timingEntries].sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId).slice(0,s):t.entries.slice(0,s).map(n=>({riderId:n.riderId,rank:n.rank,crossingTimeSeconds:n.crossingTimeSeconds??0,gapSeconds:n.gapSeconds??0,photoFinishScore:0,pointsAwarded:n.points})).sort((n,i)=>n.rank-i.rank||n.crossingTimeSeconds-i.crossingTimeSeconds||n.riderId-i.riderId);return r.length===0?'<div class="race-sim-stage-points-popover-empty">Noch keine Punkte vergeben.</div>':`
    <div class="race-sim-stage-points-popover-list">
      ${r.map(n=>{const i=ts(e,n.riderId),o=a.get(n.riderId)??null;return`
          <div class="race-sim-stage-points-popover-row">
            <strong>${n.rank}.</strong>
            ${ia(i.teamId,i.teamName)}
            ${oa(n.riderId,aa(e,n.riderId),"race-sim-stage-scoring-name")}
            <strong>${n.rank===1?X(Ci(n.crossingTimeSeconds)):X(Ec(n.gapSeconds))}</strong>
            ${o?`<strong class="race-sim-stage-points-value-${o.pointsKind}">${o.points}</strong>`:"<strong>—</strong>"}
          </div>`}).join("")}
    </div>`}function un(e,t){var a;return((a=e==null?void 0:e.find(s=>s.riderId===t))==null?void 0:a.points)??0}function mn(e,t){var a;return((a=e.filter(s=>s.riderId!=null&&t.has(s.riderId)).sort((s,r)=>s.rank-r.rank||s.riderId-r.riderId)[0])==null?void 0:a.riderId)??null}function $a(e,t,a){if(!(!t||e.some(s=>s.riderId===t.riderId))){if(e.length<25){e.push(t);return}e[a]=t}}function Wc(e,t,a,s,r){const n=new Set(e.riderIds),i=new Map(t.riders.map(f=>[f.riderId,f])),c=e.riderIds.map(f=>i.get(f)??null).filter(f=>f!=null).sort((f,g)=>{var b,y;return(((b=a.get(f.riderId))==null?void 0:b.rank)??Number.MAX_SAFE_INTEGER)-(((y=a.get(g.riderId))==null?void 0:y.rank)??Number.MAX_SAFE_INTEGER)||f.riderName.localeCompare(g.riderName,"de")||f.riderId-g.riderId}).slice(0,25),l=i.get(mn(s,n)??-1)??null,p=i.get(mn(r,n)??-1)??null,u=l!=null&&!c.some(f=>f.riderId===l.riderId),m=p!=null&&!c.some(f=>f.riderId===p.riderId);return c.length>=25&&u&&m&&l.riderId!==p.riderId?($a(c,l,23),$a(c,p,24),c):($a(c,l,24),$a(c,p,24),c)}function jc(e,t){const a=[];return t.gcLeaderRiderId===e&&a.push("gc"),t.mountainLeaderRiderId===e&&a.push("mountain"),t.pointsLeaderRiderId===e&&a.push("points"),t.youthLeaderRiderId===e&&a.push("youth"),a}function Oc(e){return e.includes("gc")?" is-gc-leader":e.includes("mountain")?" is-mountain-leader":e.includes("points")?" is-points-leader":e.includes("youth")?" is-youth-leader":""}function pn(e,t){return e==null?"—":`${t}${Math.round(e)} m`}function Vc(e,t){const a=t.riders.filter(r=>e.riderIds.includes(r.riderId)).reduce((r,n)=>Math.max(r,n.distanceCoveredMeters),0),s=Math.max(0,t.leaderDistanceMeters-a);return s>0?`-${Math.round(s)} m`:"—"}function Uc(e,t,a,s,r,n,i){if(a.length===0||e.stage.profile==="ITT"||e.stage.profile==="TTT")return"";const o=bl(a,s),c=a.find(m=>m.label===o)??a[0],l=new Map(e.gcStandings.map(m=>[m.riderId,m])),p=Us(i),u=Wc(c,t,l,r,n);return`
    <section class="race-sim-classification-box race-sim-classification-box-group">
      <h4>
        <span>Gruppe ${X(c.label)} <span class="race-sim-group-count">(${c.riderCount})</span></span>
        <span class="race-sim-group-nav">
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="prev" aria-label="Vorherige Gruppe">‹</button>
          <button type="button" class="race-sim-group-nav-btn" data-race-sim-group-nav="next" aria-label="Nächste Gruppe">›</button>
        </span>
      </h4>
      <div class="race-sim-group-gap-row">
        <span>Vorne ${X(pn(c.previousGapMeters,"-"))}</span>
        <span>Leader ${X(Vc(c,t))}</span>
        <span>Hinten ${X(pn(c.nextGapMeters,"+"))}</span>
      </div>
      <div class="race-sim-group-grid">
        ${u.map((m,f)=>{const g=l.get(m.riderId)??null,b=ts(e,m.riderId),y=p.get(m.riderId)??{points:0,mountain:0},v=un(r,m.riderId),T=un(n,m.riderId),w=jc(m.riderId,e.classificationLeaders),M=w.length>0?w.map($=>({gc:"GC-Leader",mountain:"Bergwertungs-Leader",points:"Punktewertungs-Leader",youth:"Nachwuchs-Leader"})[$]).join(", "):"";return`
            <article class="race-sim-group-row">
              <strong class="race-sim-group-position${Oc(w)}" title="${X(M)}">${f+1}.</strong>
              ${ia(b.teamId,b.teamName)}
              <span class="race-sim-classification-main">
                ${oa(m.riderId,m.riderName,`race-sim-group-rider-name${m.isBreakaway?" is-breakaway":""}`)}
                <strong class="race-sim-group-detail">GC ${g?g.rank:"—"} · ${X(g?za(g.gapSeconds):"—")} · ${X(m.gapToLeaderMeters>0?`+${Math.round(m.gapToLeaderMeters)} m`:"—")}</strong>
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
    </section>`}function Yc(e,t,a,s){const r=Ys(t,a.markerClassifications,a),n=Us(r),i=Ka(t,t.pointsStandings,n,"points"),o=Ka(t,t.mountainStandings,n,"mountain"),c=Os(js(a.clusters));e.innerHTML=Uc(t,a,c,s,i,o,r)}function Zc(e){return e.length===0?"":e.map(t=>`<span class="race-sim-stage-points-badge race-sim-stage-points-badge-${t.pointsKind}">${t.points}</span>`).join("")}function Jc(e){const t=Je(e.stageSummary),a=Ni(e)[0]??0,s=Vs(e)[0]??0,r=t.filter(({marker:n})=>ut(n)).reduce((n,{marker:i})=>n+(Ca(e,i.cat??null)[0]??0),0);return{points:t.filter(({marker:n})=>n.type==="sprint_intermediate").length*a+s,mountain:r}}function gn(e){const t=Jc(e);return`
    <span class="race-sim-stage-points-header-badges">
      <span class="race-sim-stage-points-header-badge is-points">Sprint ${t.points}</span>
      <span class="race-sim-stage-points-header-badge is-mountain">Berg ${t.mountain}</span>
    </span>`}function qc(e){const t=Fc(e),a=[`<span class="race-sim-stage-points-meta-pill">${X(va(e.kmMark))}</span>`,`<span class="race-sim-stage-points-meta-pill">${X(`${va(e.kmToFinish)} bis Ziel`)}</span>`,e.climbLengthKm!=null?`<span class="race-sim-stage-points-meta-pill">${X(`Länge ${va(e.climbLengthKm)}`)}</span>`:"",e.averageGradient!=null?`<span class="race-sim-stage-points-meta-pill">${X(`Ø ${on(e.averageGradient)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${X(`Steilstes ${va(e.steepestSegmentLengthKm)}`)}</span>`:"",e.steepestSegmentLengthKm!=null&&e.steepestSegmentGradient!=null?`<span class="race-sim-stage-points-meta-pill is-steepest">${X(on(e.steepestSegmentGradient))}</span>`:""].filter(s=>s.length>0);return`
    <span class="race-sim-stage-points-title-line">
      <strong>${X(e.title)}</strong>
      ${t?`<span class="race-sim-stage-points-category-badge ${t.className}">${X(t.label)}</span>`:""}
      <span class="race-sim-stage-points-title-name" title="${X(e.label)}">${X(e.label)}</span>
    </span>
    <span class="race-sim-stage-points-meta${e.highlightMeta?" is-final-quarter":""}">
      ${a.map((s,r)=>`${r>0?'<span class="race-sim-stage-points-meta-separator">•</span>':""}${s}`).join("")}
    </span>`}function Xc(e,t,a,s=null){const r=s??Ys(e,t,a);return r.length===0?`
      <section class="race-sim-mountain-primes-box">
        <h4>Etappenwertungen${gn(e)}</h4>
        <div class="race-sim-classification-empty">Keine Sprint- oder Bergwertungen auf dieser Etappe.</div>
      </section>`:`
    <section class="race-sim-mountain-primes-box">
      <h4>Etappenwertungen${gn(e)}</h4>
      <div class="race-sim-mountain-primes-list">
        ${r.map(n=>{const i=n.leaderRiderId!=null?ts(e,n.leaderRiderId):{teamId:null,teamName:null},o=n.leaderRiderId!=null?aa(e,n.leaderRiderId):"Noch offen";return`
          <details class="race-sim-mountain-prime-row race-sim-stage-points-event race-sim-stage-points-event-${n.accent}">
            <summary>
            <span class="race-sim-mountain-prime-title">
              ${qc(n)}
            </span>
            <span class="race-sim-stage-points-awards">
              ${Zc(n.displayBadges)}
            </span>
            <span class="race-sim-stage-points-leader">
              ${ia(i.teamId,i.teamName)}
              ${n.leaderRiderId!=null?oa(n.leaderRiderId,o,"race-sim-stage-scoring-leader-name"):`<strong>${X(o)}</strong>`}
            </span>
            </summary>
            <div class="race-sim-stage-points-popover">
              ${Kc(e,n)}
            </div>
          </details>`}).join("")}
      </div>
    </section>`}function Qc(e,t,a,s,r,n=new Set){var f,g;const i=Ys(a,s,r),o=Us(i),c=Ka(a,a.pointsStandings,o,"points"),l=Ka(a,a.mountainStandings,o,"mountain"),p=cn(r,((f=a.gcStandings[0])==null?void 0:f.riderId)??null),u=cn(r,((g=a.youthStandings[0])==null?void 0:g.riderId)??null),m=b=>!n.has(b);e.innerHTML=`
    ${xt("Stage Favorites",Pc(t,a.gcStandings,a.classificationLeaders),"race-sim-favorites-section","favorites",m("favorites"))}
    <section class="race-sim-classifications-section">
      ${xt("GC",ka("GC","gc",a,a.gcStandings,b=>X(`GC ${b.rank} · ${za(b.gapSeconds)}`),{limit:20,distanceGapsByRiderId:p}),"race-sim-overview-classification race-sim-overview-gc","gc",m("gc"))}
      ${xt("Punktewertung",ka("Punktewertung","points",a,c,dn),"race-sim-overview-classification race-sim-overview-points","points",m("points"))}
      ${xt("Bergwertung",ka("Bergwertung","mountain",a,l,dn),"race-sim-overview-classification race-sim-overview-mountain","mountain",m("mountain"))}
      ${xt("Nachwuchsfahrerwertung",ka("Nachwuchsfahrerwertung","youth",a,a.youthStandings,b=>X(`${b.rank}. · ${za(b.gapSeconds)}`),{distanceGapsByRiderId:u,distanceGapClassName:"is-compact"}),"race-sim-overview-classification race-sim-overview-youth","youth",m("youth"))}
    </section>
    ${xt("Etappenwertungen",Xc(a,s,r,i),"race-sim-overview-stage-scoring","stageScoring",m("stageScoring"))}
  `}const fn=new WeakMap,Ye=new WeakMap,hn=new WeakMap,Pi=new Intl.NumberFormat("de-DE",{minimumFractionDigits:0,maximumFractionDigits:2});function q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Li(e){return e<=0?"—":`+${Math.round(e)} m`}function Xt(e){const t=Pi.format(e);return e>0?`+${t}`:t}function hs(e){return e<=0?"0,0":`-${e.toFixed(1).replace(".",",")}`}function oe(e){return Pi.format(e)}function $t(e){const t=Math.max(0,Math.floor(e)),a=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return`${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function Di(e){return`+${$t(e)}`}function Ai(e){if(e<=0)return"—";const t=Math.floor(e/60),a=e%60;return t>0?`+${t}:${String(a).padStart(2,"0")}`:`+${a}s`}function Zs(e){return`${(e*3.6).toFixed(1)} km/h`}function eu(e){return`${Xt(e)}%`}function Cs(e){return`${e.toFixed(1).replace(".",",")} km`}function Bi(e){return`${Cs(e.segmentStartKm)} - ${Cs(e.segmentEndKm)}`}function tu(e){return`${Math.round(e.segmentStartElevation)} - ${Math.round(e.segmentEndElevation)} m`}function _i(e){return e.replace(/_/g," ")}function Gi(e){return _i(e)}function au(e){return _i(e)}function Hi(e){return e.effectiveSkill>e.baseSkill?"race-sim-skill-effective-good":e.effectiveSkill<e.baseSkill?"race-sim-skill-effective-bad":"race-sim-skill-effective-equal"}function su(e){return e>10?"race-sim-slope-climb-hard":e>3?"race-sim-slope-climb-light":e<-10?"race-sim-slope-descent-hard":e<-3?"race-sim-slope-descent-light":""}function ru(e){var t;return((t=e.country)==null?void 0:t.code3)??e.nationality}function zi(e){return Je(e.stageSummary).filter(({marker:t})=>t.type==="sprint_intermediate"||ut(t)).map(({key:t,label:a})=>({key:t,label:a}))}function nu(e){return new Map(e.markerClassifications.map(t=>[t.markerKey,new Map(t.entries.map(a=>[a.riderId,a.rank]))]))}function iu(e,t,a,s){var r;return a!=="ITT"&&a!=="TTT"?((r=s.get(t))==null?void 0:r.get(e.riderId))??null:e.splitTimes[t]??null}function Ki(e,t,a){return[{label:"Pos",width:"50px",className:"race-sim-col-rank",sortKey:"gap"},{label:"Flag",width:"40px",className:"race-sim-col-flag"},{label:"Fahrer",width:"196px",className:"race-sim-col-name",sortKey:"name"},{label:"Jersey",displayLabel:"Jer",width:"46px",className:"race-sim-col-team-visual",sortKey:"team"},{label:"Team",width:"58px",className:"race-sim-col-team",sortKey:"team"},{label:"Gap",width:"72px",sortKey:"gap"},{label:"Eff.",width:"74px",sortKey:"effectiveSkill"},{label:"GC",width:"52px",sortKey:"gcRank"},{label:"GC Gap",width:"70px",sortKey:"gcGap"},{label:"Uhr",width:"96px",sortKey:"clock"},...a?t.map(r=>({label:r.key,displayLabel:r.label,width:"92px",className:"race-sim-col-split",sortKey:`split:${r.key}`})):[],{label:"Aktive Segment-Steigung",displayLabel:"Grad",width:"72px",sortKey:"gradientPercent"},{label:"Speed",width:"82px",sortKey:"speed"},{label:"Sonderform",displayLabel:"",width:"28px",className:"race-sim-col-form-state",sortKey:"specialForm"}]}function ou(e){return e.map(t=>`${t.label}:${t.width}:${t.className??""}`).join("|")}function lu(e,t){return`${e}|${t.autoSort?"auto":"manual"}|${t.showSplitColumns?"splits":"no-splits"}|${t.manualSortKey??""}|${t.manualSortDirection}`}function Wi(e){const t=fn.get(e);if(t)return t;const a=zi(e),s={splitMarkers:a,columns:Ki(e,a,!1),riderById:new Map(e.riders.map(r=>[r.id,r])),teamById:new Map((e.teams??[]).map(r=>[r.id,r])),teamAbbreviationById:new Map((e.teams??[]).map(r=>[r.id,r.abbreviation])),teamNameById:new Map((e.teams??[]).map(r=>[r.id,r.name])),gcByRiderId:new Map((e.gcStandings??[]).map(r=>[r.riderId,r]))};return fn.set(e,s),s}function ji(e,t){const a=e.parentElement,s=a==null?void 0:a.querySelector(".race-sim-leaderboard-head");if(!a||!s)return"";const r=a.querySelector(".race-sim-leaderboard-toolbar")??(()=>{const l=document.createElement("div");return l.className="race-sim-leaderboard-toolbar",s.insertAdjacentElement("beforebegin",l),l})(),n=Js(e),i=ou(t),o=lu(i,n),c=Ye.get(e);return(c==null?void 0:c.layoutKey)===o||(a.style.setProperty("--race-sim-leaderboard-columns",t.map(l=>l.width).join(" ")),r.innerHTML=`
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
    >Auto-Sort ${n.autoSort?"AN":"AUS"}</button>`,s.innerHTML=t.map(l=>du(l,n)).join(""),Ye.set(e,{layoutKey:o,orderedRiderIds:(c==null?void 0:c.orderedRiderIds)??[],rowsByRiderId:(c==null?void 0:c.rowsByRiderId)??new Map,openDetailRiderId:(c==null?void 0:c.openDetailRiderId)??null,openTeamId:(c==null?void 0:c.openTeamId)??null})),o}function Xe(e,t){e.textContent!==t&&(e.textContent=t)}function Ta(e,t){e.title!==t&&(e.title=t)}function Ma(e,t){e.className!==t&&(e.className=t)}function xa(e,t,a){return e.lastValues[t]!==a}function wa(e,t,a){e.lastValues[t]=a}function Js(e){const t=hn.get(e);if(t)return t;const a={autoSort:!0,showSplitColumns:!1,manualSortKey:null,manualSortDirection:"asc",frozenOrder:[]};return hn.set(e,a),a}function du(e,t){const a=e.displayLabel??e.label;if(!e.sortKey)return`<span class="${e.className??""}" title="${q(e.label)}">${q(a)}</span>`;const s=!t.autoSort&&t.manualSortKey===e.sortKey,r=s?t.manualSortDirection==="asc"?" ▲":" ▼":"";return`
    <button
      type="button"
      class="race-sim-leaderboard-sort-btn ${e.className??""}${s?" race-sim-leaderboard-sort-active":""}${t.autoSort?" is-disabled":""}"
      title="${q(t.autoSort?`${e.label} · nur manuell sortierbar, wenn Auto-Sort aus ist`:`${e.label} sortieren`)}"
      data-race-sim-sort-key="${q(e.sortKey)}"
      ${t.autoSort?"disabled":""}
    >${q(a)}<span class="race-sim-leaderboard-sort-indicator">${q(r)}</span></button>`}function cu(e){return e==="name"||e==="team"||e==="terrainSkill"||e==="clock"||e==="gap"||e==="gcRank"||e==="gcGap"||e.startsWith("split:")?"asc":"desc"}function uu(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e=="number"&&typeof t=="number"?e-t:String(e).localeCompare(String(t),"de")}function bn(e,t,a,s,r,n,i){if(s.autoSort)return(c,l)=>e.stage.profile==="ITT"?Oi(c,l,t):fu(c,l);if(!s.manualSortKey)return null;const o=s.manualSortDirection==="asc"?1:-1;return(c,l)=>{if(we(c)!==we(l))return we(c)?1:-1;const p=r.get(c.riderId)??null,u=r.get(l.riderId)??null,m=yn(c,p,s.manualSortKey??"",e,a,n,i),f=yn(l,u,s.manualSortKey??"",e,a,n,i);return uu(m,f)*o||c.riderId-l.riderId}}function mu(e,t,a){if(e.length!==t.size)return!1;let s=null;for(const r of e){const n=t.get(r);if(!n||s&&a(s,n)>0)return!1;s=n}return!0}function yn(e,t,a,s,r,n,i){const o=s.race.isStageRace&&s.stage.stageNumber>1?n.get(e.riderId)??null:null;switch(a){case"name":return e.riderName;case"team":return(t==null?void 0:t.activeTeamId)!=null?i.get(t.activeTeamId)??"":null;case"gap":return e.gapToLeaderMeters;case"clock":return s.stage.profile==="ITT"?e.riderClockSeconds??(e.hasStarted?null:e.startOffsetSeconds):e.finishTimeSeconds;case"terrainSkill":return`${e.activeTerrain}-${e.skillName}`;case"baseSkill":return e.baseSkill;case"effectiveSkill":return e.effectiveSkill;case"teamBonus":return e.teamGroupBonus;case"seasonForm":return(t==null?void 0:t.formBonus)??0;case"raceForm":return(t==null?void 0:t.raceFormBonus)??0;case"fatigue":return(t==null?void 0:t.fatigueMalus)??0;case"staminaPenalty":return e.staminaPenalty;case"elevationPenalty":return e.elevationPenalty;case"dailyForm":return e.dailyForm;case"microForm":return e.microForm;case"gcRank":return(o==null?void 0:o.rank)??null;case"gcGap":return(o==null?void 0:o.gapSeconds)??null;case"gradientPercent":return e.gradientPercent;case"gradientModifier":return e.gradientModifier;case"windModifier":return e.windModifier;case"draftModifier":return e.draftModifier;case"speed":return e.currentSpeedMps;case"specialForm":return e.hasSuperform?1:e.hasSupermalus?-1:0;default:return a.startsWith("split:")?iu(e,a.slice(6),s.stage.profile,r):null}}function pu(e,t,a,s,r,n,i,o,c){if(!r.manualSortKey){if(r.autoSort){const m=bn(t,a,s,r,n,i,o);return m?[...e].sort(m):[...e]}const u=new Map(r.frozenOrder.map((m,f)=>[m,f]));return[...e].sort((m,f)=>(we(m)===we(f)?0:we(m)?1:-1)||(u.get(m.riderId)??Number.MAX_SAFE_INTEGER)-(u.get(f.riderId)??Number.MAX_SAFE_INTEGER)||m.riderId-f.riderId)}const l=bn(t,a,s,r,n,i,o);if(!l)return[...e];const p=new Map(e.map(u=>[u.riderId,u]));return mu(c,p,l)?c.map(u=>p.get(u)).filter(u=>u!=null):[...e].sort(l)}function gu(e,t){var l;const a=t.closest("button[data-race-sim-ttt-team-toggle]");if(a){const p=Number(a.dataset.raceSimTttTeamToggle);if(!Number.isFinite(p))return!1;const u=Ye.get(e);return u?(u.openTeamId=u.openTeamId===p?null:p,u.openTeamId==null&&(u.openDetailRiderId=null),!0):!1}const s=t.closest("button[data-race-sim-rider-toggle]");if(s){const p=Number(s.dataset.raceSimRiderToggle);if(!Number.isFinite(p))return!1;const u=Ye.get(e);return u?(u.openDetailRiderId=u.openDetailRiderId===p?null:p,!0):!1}const r=Js(e);if(t.closest("button[data-race-sim-splits-toggle]"))return r.showSplitColumns=!r.showSplitColumns,!r.showSplitColumns&&((l=r.manualSortKey)!=null&&l.startsWith("split:"))&&(r.manualSortKey=null,r.manualSortDirection="asc"),!0;if(t.closest("button[data-race-sim-auto-sort]"))return r.autoSort=!r.autoSort,r.autoSort?(r.manualSortKey=null,r.frozenOrder=[]):(r.manualSortKey=null,r.manualSortDirection="asc",r.frozenOrder=Array.from(e.querySelectorAll("[data-race-sim-rider-row]")).map(p=>Number(p.dataset.raceSimRiderRow)).filter(p=>Number.isFinite(p))),!0;const o=t.closest("button[data-race-sim-sort-key]");if(!o||r.autoSort)return!1;const c=o.dataset.raceSimSortKey;return c?(r.manualSortKey===c?r.manualSortDirection=r.manualSortDirection==="asc"?"desc":"asc":(r.manualSortKey=c,r.manualSortDirection=cu(c)),r.frozenOrder=[],!0):!1}function vn(e,t){return t.some(a=>e.splitTimes[a.key]!=null)}function we(e){return e.finishStatus==="dnf"}function Oi(e,t,a){if(we(e)!==we(t))return we(e)?1:-1;if(e.finishTimeSeconds!=null&&t.finishTimeSeconds!=null)return(e.riderClockSeconds??e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.riderClockSeconds??t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId;if(e.finishTimeSeconds!=null)return-1;if(t.finishTimeSeconds!=null)return 1;for(let o=a.length-1;o>=0;o-=1){const c=a[o];if(!c)continue;const l=e.splitTimes[c.key],p=t.splitTimes[c.key];if(l!=null&&p!=null&&l!==p)return l-p;if(l!=null&&p==null)return-1;if(l==null&&p!=null)return 1}const s=vn(e,a),r=vn(t,a);if(s!==r)return s?-1:1;const n=e.riderClockSeconds,i=t.riderClockSeconds;return n!=null&&i!=null&&n!==i?n-i:n!=null&&i==null?-1:n==null&&i!=null?1:e.startOffsetSeconds-t.startOffsetSeconds||e.riderId-t.riderId}function fu(e,t){return we(e)!==we(t)?we(e)?1:-1:e.isFinished!==t.isFinished?e.isFinished?-1:1:e.isFinished&&t.isFinished?(e.finishTimeSeconds??Number.POSITIVE_INFINITY)-(t.finishTimeSeconds??Number.POSITIVE_INFINITY)||e.riderId-t.riderId:e.gapToLeaderMeters-t.gapToLeaderMeters||e.riderId-t.riderId}function Vi(e,t){const a=(t==null?void 0:t.formBonus)??0,s=(t==null?void 0:t.raceFormBonus)??0,r=((t==null?void 0:t.fatigueMalus)??0)*.5,n=((t==null?void 0:t.longTermFatigueMalus)??0)*.5,i=((t==null?void 0:t.shortTermFatigueMalus)??0)*.5,o=e.teamGroupBonus,c=Math.max(-2.5,Math.min(2.5,e.microForm*2.5)),l=e.isAttacking?10:0,p=e.baseSkill+l+a+s+e.dailyForm+e.microForm+o-r-n-i,u=Math.max(0,p-e.staminaPenalty),m=p-u,f=u-e.effectiveSkill;return[`Basis ${oe(e.baseSkill)}`,e.isAttacking?`+ Attacke ${oe(l)}`:null,`+ S-Form ${oe(a)}`,`+ R-Form ${oe(s)}`,`+ T-Form ${oe(e.dailyForm)}`,`+ Zufällige Form ${oe(c)} (skaliert)`,`+ Teambonus ${oe(o)}`,`- Fatigue ${oe(r)}`,`- Langzeit ${oe(n)}`,`- Akut ${oe(i)}`,`- Stamina ${oe(m)}`,`- HM ${oe(f)}`,`= Effektiv ${oe(e.effectiveSkill)}`].filter(g=>g!=null)}function hu(e,t){return Vi(e,t).join(`
`)}function bu(e){return Xt(Math.max(-2.5,Math.min(2.5,e*2.5)))}function yu(e){return e.draftNearbyRiderCount<=0||e.draftModifier<=1?"—":`${e.draftNearbyRiderCount} · x${e.draftPackFactor.toFixed(2).replace(".",",")}`}function Ui(e,t){const a=["race-sim-row-name-btn"];return e.isAttacking&&a.push("is-attacking"),e.isBreakaway&&a.push("is-breakaway"),`<button type="button" class="${a.join(" ")}" data-race-sim-rider-toggle="${e.riderId}" aria-expanded="${t?"true":"false"}" title="${q(e.riderName)}">${q(e.riderName)}</button>`}function vu(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const s=t.get(e.activeTeamId)??"—",r=a.get(e.activeTeamId)??s;return`<span class="race-sim-team-code" title="${q(r)}">${q(s)}</span>`}function Yi(e){return`/jersey/Jer_${e}.png`}function Su(e,t,a){if((e==null?void 0:e.activeTeamId)==null)return"—";const s=t.get(e.activeTeamId);if(!s)return"—";const r=a.get(e.activeTeamId)??s.name,n=Yi(e.activeTeamId);return`
    <span class="race-sim-team-visual" title="${q(r)}">
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
    </span>`}function ku(e){return e.hasSuperform?'<span class="race-sim-special-form-dot race-sim-special-form-dot-good" title="Superform"></span>':e.hasSupermalus?'<span class="race-sim-special-form-dot race-sim-special-form-dot-bad" title="Supermalus"></span>':""}function $u(e,t,a,s){var n;if(a!=="ITT"&&a!=="TTT"){const i=(n=s.get(t))==null?void 0:n.get(e.riderId);return i!=null?`${i}.`:"—"}const r=e.splitTimes[t];return r!=null?$t(r):"—"}function Zi(e,t,a){const s=Vi(e,t),r=[{label:"Terrain / Skill",value:`${Gi(e.activeTerrain)} / ${au(e.skillName)}`},{label:"Aktiver Abschnitt",value:Bi(e)},{label:"Segmenthöhe",value:tu(e)},{label:"Basis",value:oe(e.baseSkill)},{label:"Team+",value:e.teamGroupBonus>0?`+${oe(e.teamGroupBonus)}`:"—"},{label:"S-Form",value:Xt((t==null?void 0:t.formBonus)??0)},{label:"R-Form",value:Xt((t==null?void 0:t.raceFormBonus)??0)},{label:"Fatigue",value:hs((t==null?void 0:t.fatigueMalus)??0)},{label:"Langzeit",value:hs((t==null?void 0:t.longTermFatigueMalus)??0)},{label:"Akut",value:hs((t==null?void 0:t.shortTermFatigueMalus)??0)},{label:"Stamina",value:oe(e.staminaPenalty)},{label:"HM",value:oe(e.elevationPenalty)},{label:"T-Form",value:Xt(e.dailyForm)},{label:"Zufall",value:bu(e.microForm)},{label:"M_grad",value:`x${e.gradientModifier.toFixed(2).replace(".",",")}`},{label:"M_wind",value:`x${e.windModifier.toFixed(2).replace(".",",")}`},{label:"Draft",value:`x${e.draftModifier.toFixed(2).replace(".",",")}`},{label:"Draft Pack",value:yu(e)},{label:"GC",value:a?String(a.rank):"—"},{label:"GC Gap",value:a?Ai(a.gapSeconds):"—"}];return`
    <section class="race-sim-rider-detail-panel" aria-label="Fahrerdetails ${q(e.riderName)}">
      <div class="race-sim-rider-detail-head">
        <strong>${q(e.riderName)}</strong>
        <button type="button" class="race-sim-rider-detail-close" data-race-sim-rider-toggle="${e.riderId}" aria-label="Details schließen">×</button>
      </div>
      <div class="race-sim-rider-detail-grid">
        ${r.map(n=>`<div class="race-sim-rider-detail-item"><span>${q(n.label)}</span><strong>${q(n.value)}</strong></div>`).join("")}
      </div>
      <div class="race-sim-rider-detail-breakdown">
        <span>Effektivskill</span>
        <strong>${s.map(n=>q(n)).join("<br>")}</strong>
      </div>
      <div class="race-sim-rider-detail-foot">${q(e.skillBreakdown||"Primärskill ohne Mischgewichtung")}</div>
    </section>`}function Tu(e,t,a,s,r,n,i){const o=document.createElement("article");o.dataset.raceSimRiderRow=String(e.riderId);const c=document.createElement("div");c.className="race-sim-row-grid",o.appendChild(c);const l=document.createElement("strong");l.className="race-sim-row-rank",l.textContent="0.",c.appendChild(l);const p=document.createElement("span");p.className="race-sim-row-flag",p.innerHTML=t?fl(ru(t)):"—",c.appendChild(p);const u=document.createElement("span");u.className="race-sim-row-name",u.innerHTML=Ui(e,a),c.appendChild(u);const m=u.querySelector(".race-sim-row-name-btn");if(!m)throw new Error("race-sim-row-name-btn not found");const f=document.createElement("span");f.className="race-sim-row-team-visual",f.innerHTML=Su(t,r,i),c.appendChild(f);const g=document.createElement("strong");g.className="race-sim-row-team",g.innerHTML=vu(t,n,i),c.appendChild(g);const b=(D="")=>{const A=document.createElement("strong");return D&&(A.className=D),c.appendChild(A),A},y=b("race-sim-gap"),v=b("race-sim-cell-effective-skill"),T=b(),w=b(),M=b(),$=s.map(()=>b()),E=b(),R=b(),N=b("race-sim-form-state-cell"),P=document.createElement("div");return P.className="race-sim-row-detail-popover hidden",o.appendChild(P),{row:o,rankField:l,nameButton:m,gapField:y,clockField:M,splitFields:$,effectiveSkillField:v,gcRankField:T,gcGapField:w,gradientPercentField:E,speedField:R,formStateField:N,detailPanel:P,initialized:!1,lastValues:{}}}function Mu(e,t,a,s,r,n,i,o,c,l,p){const u=(s==null?void 0:s.formBonus)??0,m=(s==null?void 0:s.raceFormBonus)??0,f=c&&l>1?p.get(a.riderId)??null:null,g=we(a),b=i!=="ITT"&&i!=="TTT"?g?"DNF":"—":a.hasStarted?g?"DNF":a.riderClockSeconds!=null?$t(a.riderClockSeconds):"—":Di(a.startOffsetSeconds);Ma(e.row,`race-sim-row${t===1&&!g?" race-sim-row-leader":""}${r?" race-sim-row-detail-open":""}${g?" race-sim-row-dnf":""}`),Xe(e.rankField,`${t}.`),Xe(e.gapField,g?"DNF":Li(a.gapToLeaderMeters)),Xe(e.clockField,b),e.nameButton.setAttribute("aria-expanded",r?"true":"false"),Ma(e.nameButton,`race-sim-row-name-btn${a.isAttacking?" is-attacking":""}${a.isBreakaway?" is-breakaway":""}`),Ta(e.nameButton,a.isBreakaway?`${a.riderName} (Ausreißer)`:a.isAttacking?`${a.riderName} (Attacke aktiv)`:a.riderName),n.forEach((w,M)=>{const $=e.splitFields[M];if(!$)return;const E=$u(a,w.key,i,o);Xe($,E),Ta($,w.label)}),xa(e,"effectiveSkillValue",a.effectiveSkill)&&(Xe(e.effectiveSkillField,oe(a.effectiveSkill)),wa(e,"effectiveSkillValue",a.effectiveSkill));const y=`race-sim-cell-effective-skill ${Hi(a)}`;xa(e,"effectiveSkillClass",y)&&(Ma(e.effectiveSkillField,y),wa(e,"effectiveSkillClass",y));const v=[a.baseSkill,a.effectiveSkill,a.teamGroupBonus,u,m,a.dailyForm,a.microForm,(s==null?void 0:s.fatigueMalus)??0,(s==null?void 0:s.longTermFatigueMalus)??0,(s==null?void 0:s.shortTermFatigueMalus)??0,a.staminaPenalty].join("|");xa(e,"effectiveSkillTitleKey",v)&&(Ta(e.effectiveSkillField,hu(a,s)),wa(e,"effectiveSkillTitleKey",v)),Xe(e.gcRankField,f?String(f.rank):"—"),Xe(e.gcGapField,f?Ai(f.gapSeconds):"—"),Xe(e.gradientPercentField,eu(a.gradientPercent)),Ma(e.gradientPercentField,su(a.gradientPercent)),Ta(e.gradientPercentField,`${Gi(a.activeTerrain)} · ${Bi(a)}`),Xe(e.speedField,Zs(a.currentSpeedMps)),e.formStateField.innerHTML=ku(a);const T=[r?"open":"closed",a.activeTerrain,a.segmentStartKm,a.segmentEndKm,a.segmentStartElevation,a.segmentEndElevation,a.skillName,a.baseSkill,a.teamGroupBonus,u,m,(s==null?void 0:s.fatigueMalus)??0,a.staminaPenalty,a.elevationPenalty,a.dailyForm,a.microForm,a.gradientModifier,a.windModifier,a.draftModifier,a.draftNearbyRiderCount,a.draftPackFactor,(f==null?void 0:f.rank)??"—",(f==null?void 0:f.gapSeconds)??"—",a.skillBreakdown].join("|");xa(e,"detailKey",T)&&(e.detailPanel.innerHTML=r?Zi(a,s,f):"",e.detailPanel.classList.toggle("hidden",!r),wa(e,"detailKey",T)),e.detailPanel.classList.toggle("hidden",!r),e.initialized=!0}function xu(e,t){return`<button type="button" class="race-sim-row-name-btn" data-race-sim-ttt-team-toggle="${e.id}" aria-expanded="${t?"true":"false"}" title="${q(e.name)}">${q(e.name)}</button>`}function wu(e){const t=Yi(e.id);return`
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
    </span>`}function Iu(e,t,a){const s=new Map;for(const r of e.riders){const n=a.get(r.riderId),i=n==null?void 0:n.activeTeamId;if(i==null)continue;const o=s.get(i)??[];o.push(r),s.set(i,o)}return t.teams.filter(r=>s.has(r.id)).map(r=>{const n=(s.get(r.id)??[]).slice().sort((p,u)=>u.effectiveSkill-p.effectiveSkill||p.riderId-u.riderId),i=n[0]??e.riders[0],o=Math.min(5,n.length),c=n.slice(0,o).reduce((p,u)=>p+u.effectiveSkill,0)/Math.max(o,1),l=Math.max(0,8-n.length);return{team:r,riders:n,representative:i,teamClockSeconds:(i==null?void 0:i.riderClockSeconds)??null,teamDistanceMeters:(i==null?void 0:i.distanceCoveredMeters)??0,teamEffectiveSkill:Math.max(1,c-l),teamSpeedMps:(i==null?void 0:i.currentSpeedMps)??0,splitTimes:(i==null?void 0:i.splitTimes)??{},finishedRiders:n.filter(p=>p.isFinished).length}}).sort((r,n)=>Oi(r.representative,n.representative,zi(t))||r.team.id-n.team.id)}function Ru(e,t,a,s,r){return`
    <section class="race-sim-rider-detail-panel" aria-label="Teamdetails ${q(e.team.name)}">
      <div class="race-sim-rider-detail-head">
        <strong>${q(e.team.name)}</strong>
        <span>${e.finishedRiders}/${e.riders.length} im Ziel</span>
      </div>
      <div class="race-sim-rider-detail-grid">
        <div class="race-sim-rider-detail-item"><span>Tempo-Skill</span><strong>${q(oe(e.teamEffectiveSkill))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Speed</span><strong>${q(Zs(e.teamSpeedMps))}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Teamuhr</span><strong>${q(e.teamClockSeconds!=null?$t(e.teamClockSeconds):"—")}</strong></div>
        <div class="race-sim-rider-detail-item"><span>Distanz</span><strong>${q(Cs(e.teamDistanceMeters/1e3))}</strong></div>
      </div>
      <div class="race-sim-rider-detail-foot">Fahrer nach aktueller effektiver Fähigkeit sortiert</div>
      <div class="race-sim-ttt-team-detail-list">
        ${e.riders.map(n=>{const i=t.riderById.get(n.riderId)??null,o=a&&s>1?t.gcByRiderId.get(n.riderId)??null:null,c=r===n.riderId;return`
            <article class="race-sim-ttt-team-rider">
              <div class="race-sim-ttt-team-rider-head">
                ${Ui(n,c)}
                <strong>${q(oe(n.effectiveSkill))}</strong>
                <span>${q(n.riderClockSeconds!=null?$t(n.riderClockSeconds):"—")}</span>
              </div>
              ${c?Zi(n,i,o):""}
            </article>`}).join("")}
      </div>
    </section>`}function Eu(e,t,a){var f,g;const s=performance.now(),r=Wi(a),n=r.splitMarkers,i=[{label:"Pos",width:"50px",className:"race-sim-col-rank"},{label:"Team",width:"220px",className:"race-sim-col-name"},{label:"Jer",width:"46px",className:"race-sim-col-team-visual"},{label:"Abr.",width:"58px",className:"race-sim-col-team"},{label:"Gap",width:"72px"},{label:"Uhr",width:"96px"},...n.map(b=>({label:b.key,displayLabel:b.label,width:"92px",className:"race-sim-col-split"})),{label:"Eff.",width:"74px"},{label:"Speed",width:"82px"}],o=(f=Ye.get(e))==null?void 0:f.layoutKey,c=ji(e,i),l=Ye.get(e)??{openDetailRiderId:null,openTeamId:null};o!=null&&o!==c&&(e.innerHTML="");const p=Iu(t,a,r.riderById),u=((g=p[0])==null?void 0:g.teamDistanceMeters)??0;return e.innerHTML=p.map((b,y)=>{const v=l.openTeamId===b.team.id;return`
      <article class="race-sim-row${y===0?" race-sim-row-leader":""}${v?" race-sim-row-detail-open":""}">
        <div class="race-sim-row-grid">
          <strong class="race-sim-row-rank">${y+1}.</strong>
          <span class="race-sim-row-name">${xu(b.team,v)}</span>
          <span class="race-sim-row-team-visual">${wu(b.team)}</span>
          <strong class="race-sim-row-team"><span class="race-sim-team-code" title="${q(b.team.name)}">${q(b.team.abbreviation)}</span></strong>
          <strong class="race-sim-gap">${q(Li(Math.max(0,u-b.teamDistanceMeters)))}</strong>
          <strong>${q(b.teamClockSeconds!=null?$t(b.teamClockSeconds):Di(b.representative.startOffsetSeconds))}</strong>
          ${n.map(T=>`<strong>${q(b.splitTimes[T.key]!=null?$t(b.splitTimes[T.key]):"—")}</strong>`).join("")}
          <strong class="race-sim-cell-effective-skill ${Hi(b.representative)}">${q(oe(b.teamEffectiveSkill))}</strong>
          <strong>${q(Zs(b.teamSpeedMps))}</strong>
        </div>
        <div class="race-sim-row-detail-popover${v?"":" hidden"}">${v?Ru(b,r,a.race.isStageRace,a.stage.stageNumber,l.openDetailRiderId):""}</div>
      </article>`}).join(""),Ye.set(e,{layoutKey:c,orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:l.openDetailRiderId,openTeamId:l.openTeamId}),{totalMs:performance.now()-s,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:p.length,rowsCreated:p.length,rowsRemoved:0,rowsUpdated:p.length,rowsSkippedInvisible:0,orderChanged:1}}function Sn(e,t,a){if(a.stage.profile==="TTT")return Eu(e,t,a);const s=performance.now(),r={totalMs:0,prepMs:0,sortMs:0,layoutMs:0,createRowsMs:0,removeRowsMs:0,orderCheckMs:0,reorderMs:0,visibilityMs:0,updateRowsMs:0,finalizeMs:0,rowsTotal:t.riders.length,rowsCreated:0,rowsRemoved:0,rowsUpdated:0,rowsSkippedInvisible:0,orderChanged:0},n=performance.now(),i=Wi(a),{splitMarkers:o}=i,c=nu(t),l=Js(e),p=l.showSplitColumns?o:[],u=Ye.get(e);r.prepMs=performance.now()-n;const m=performance.now(),f=pu(t.riders,a,o,c,l,i.riderById,i.gcByRiderId,i.teamAbbreviationById,(u==null?void 0:u.orderedRiderIds)??[]);r.sortMs=performance.now()-m;const g=u==null?void 0:u.layoutKey,b=performance.now(),y=ji(e,Ki(a,p,l.showSplitColumns));r.layoutMs=performance.now()-b;const v=Ye.get(e)??{orderedRiderIds:[],rowsByRiderId:new Map,openDetailRiderId:null,openTeamId:null};g!=null&&g!==y&&(e.innerHTML="",v.rowsByRiderId.clear(),v.orderedRiderIds=[]);const T=f.map(P=>P.riderId),w=new Set(T),M=performance.now();for(const[P,D]of v.rowsByRiderId)w.has(P)||(D.row.remove(),v.rowsByRiderId.delete(P),r.rowsRemoved+=1);r.removeRowsMs=performance.now()-M;const $=performance.now();for(let P=0;P<f.length;P+=1){const D=f[P],A=i.riderById.get(D.riderId)??null;let _=v.rowsByRiderId.get(D.riderId);_||(_=Tu(D,A,v.openDetailRiderId===D.riderId,p,i.teamById,i.teamAbbreviationById,i.teamNameById),v.rowsByRiderId.set(D.riderId,_),r.rowsCreated+=1)}r.createRowsMs=performance.now()-$;const E=performance.now(),R=v.orderedRiderIds.length===T.length&&v.orderedRiderIds.every((P,D)=>P===T[D]);r.orderCheckMs=performance.now()-E;const N=performance.now();if(!R){const P=document.createDocumentFragment();for(const D of T){const A=v.rowsByRiderId.get(D);A&&P.appendChild(A.row)}e.replaceChildren(P),r.orderChanged=1}r.reorderMs=performance.now()-N;for(let P=0;P<f.length;P+=1){const D=f[P],A=v.rowsByRiderId.get(D.riderId),_=i.riderById.get(D.riderId)??null;if(!A)continue;const G=performance.now();Mu(A,P+1,D,_,v.openDetailRiderId===D.riderId,p,a.stage.profile,c,a.race.isStageRace,a.stage.stageNumber,i.gcByRiderId),r.updateRowsMs+=performance.now()-G,r.rowsUpdated+=1}return Ye.set(e,{layoutKey:y,orderedRiderIds:T,rowsByRiderId:v.rowsByRiderId,openDetailRiderId:v.openDetailRiderId,openTeamId:v.openTeamId}),r.finalizeMs=performance.now()-(s+r.prepMs+r.sortMs+r.layoutMs+r.removeRowsMs+r.createRowsMs+r.orderCheckMs+r.reorderMs+r.visibilityMs+r.updateRowsMs),r.totalMs=performance.now()-s,r.finalizeMs=Math.max(0,r.totalMs-r.prepMs-r.sortMs-r.layoutMs-r.removeRowsMs-r.createRowsMs-r.orderCheckMs-r.reorderMs-r.visibilityMs-r.updateRowsMs),r}const Fu=["Flat","Rolling","Hilly","Hilly_Difficult","Medium_Mountain","Mountain","High_Mountain","ITT","TTT","Cobble","Cobble_Hill"],Cu=["Flat","Hill","Medium_Mountain","Mountain","High_Mountain","Cobble","Cobble_Hill","Abfahrt","Sprint"],Ji=["start","climb_start","climb_top","sprint_intermediate","finish_flat","finish_TT","finish_hill","finish_mountain"],qi=["Sprint","4","3","2","1","HC"],ja=.2,Nu=7,Pu=100,Lu=3,Du=50,Au=-2,Bu=1,_u=2.5,Gu=-3,Hu=15,zu=200,Ku=600,Wu=850;function Ne(e){return["finish_flat","finish_TT","finish_hill","finish_mountain"].includes(e)}function Oa(e){return e==="finish_hill"||e==="finish_mountain"}function Va(e){return e!=null&&["HC","1","2","3","4"].includes(e)}function qs(e,t){return e==="climb_top"||Oa(e)&&Va(t)}function la(e){return Math.round(e*10)/10}function Be(e){return Number(e.toFixed(2))}function ht(e){return`${e.toFixed(2).replace(".",",")} km`}function Xi(e){return`${Math.round(e)} hm`}function ju(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"stage_details"}function Xs(e){return Fu.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function Ou(e){return Cu.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`).join("")}function Vu(e,t="start",a=0,s=1){const r=Ji.filter(i=>t==="start"?i==="start"?a===0:i==="climb_start":i==="start"||i==="climb_start"?!1:Ne(i)?a===s-1:i==="climb_top"||i==="sprint_intermediate");return(r.includes(e)?r:[e,...r.filter(i=>i!==e)]).map(i=>`<option value="${i}"${i===e?" selected":""}>${S(i)}</option>`).join("")}function Uu(e){return['<option value="">–</option>',...qi.map(t=>`<option value="${t}"${t===e?" selected":""}>${S(t)}</option>`)].join("")}function kn(e){return Ji.indexOf(e)}function _e(e){return[...e].sort((t,a)=>kn(t.type)-kn(a.type))}function sa(e){if(e.length===0)return[];const t=[{kmMark:0,elevation:e[0].startElevation,terrain:e[0].terrain,techLevel:e[0].techLevel,windExp:e[0].windExp,markers:_e(e[0].markers)}];let a=0;return e.forEach(s=>{a=Be(a+s.lengthKm);const r=Math.round(s.startElevation+s.lengthKm*1e3*(s.gradientPercent/100)),n=t[t.length-1];n.terrain=s.terrain,n.techLevel=s.techLevel,n.windExp=s.windExp,n.markers=_e([...n.markers,...s.markers]),t.push({kmMark:a,elevation:r,terrain:s.terrain,techLevel:s.techLevel,windExp:s.windExp,markers:_e(s.endMarkers)})}),t}function Yu(e){return e?" stage-editor-input-invalid":""}function Qs(e,t){const a=e.segments[t];if(!a)return[];const s=[],r=Zu(e).get(t)??[];return a.lengthKm<ja&&s.push(`Laenge unter ${ja.toFixed(1).replace(".",",")} km.`),(a.techLevel<1||a.techLevel>10)&&s.push("Tech ausserhalb 1-10."),(a.windExp<1||a.windExp>10)&&s.push("Wind ausserhalb 1-10."),t===0&&!a.markers.some(n=>n.type==="start")&&s.push("Startmarker fehlt am ersten Segment."),t<e.segments.length-1&&a.endMarkers.some(n=>Ne(n.type))&&s.push("Finish nur am Endmarker des letzten Segments."),t>0&&a.markers.some(n=>n.type==="start")&&s.push("Startmarker nur am ersten Segment erlaubt."),t===e.segments.length-1&&!a.endMarkers.some(n=>Ne(n.type))&&s.push("Finishmarker fehlt am letzten Segmentende."),a.markers.forEach(n=>{Ne(n.type)&&s.push("Finishmarker gehoert in den Endmarker-Slot."),n.type==="climb_top"&&s.push("climb_top gehoert in den Endmarker-Slot."),n.type==="sprint_intermediate"&&s.push("Sprintmarker gehoert in den Endmarker-Slot.")}),a.endMarkers.forEach(n=>{(n.type==="start"||n.type==="climb_start")&&s.push(`${n.type} gehoert in den Startmarker-Slot.`),qs(n.type,n.cat)&&!Va(n.cat)&&s.push(`${n.type} braucht Kategorie HC oder 1-4.`)}),[...a.markers,...a.endMarkers].forEach(n=>{n.type==="sprint_intermediate"&&n.cat!=null&&n.cat!=="Sprint"&&s.push("Sprintmarker erlaubt nur Kategorie Sprint."),Ne(n.type)&&!Oa(n.type)&&n.cat!=null&&s.push("finish_flat und finish_TT duerfen keine Kategorie haben."),Oa(n.type)&&n.cat!=null&&!Va(n.cat)&&s.push(`${n.type} erlaubt nur Kategorie HC oder 1-4.`)}),s.push(...r),[...new Set(s)]}function Zu(e){const t=new Map,a=[],s=(r,n)=>{const i=t.get(r)??[];i.push(n),t.set(r,i)};return e.segments.forEach((r,n)=>{r.markers.forEach(i=>{i.type==="climb_start"&&a.push({name:i.name??null,segmentIndex:n})}),r.endMarkers.forEach(i=>{var l;if(!qs(i.type,i.cat))return;if(!i.name){s(n,`${i.type} braucht einen Namen fuer die Paarbildung.`);return}let o=-1;for(let p=a.length-1;p>=0;p-=1)if(((l=a[p])==null?void 0:l.name)===i.name){o=p;break}const c=o>=0?o:a.length-1;if(c<0){s(n,`${i.type} "${i.name}" braucht einen vorherigen climb_start.`);return}a.splice(c,1)})}),a.forEach(r=>{const n=r.name?` "${r.name}"`:"";s(r.segmentIndex,`climb_start${n} braucht einen spaeteren climb_top oder kategorisierten finish_hill/finish_mountain.`)}),t}function Ju(e){return e.type==="climb_top"?{...e,cat:e.cat&&["HC","1","2","3","4"].includes(e.cat)?e.cat:"4"}:Oa(e.type)?{...e,cat:Va(e.cat)?e.cat:null}:e.type==="sprint_intermediate"?{...e,cat:e.cat==="Sprint"?e.cat:"Sprint"}:{...e,cat:null}}function Qi(e){var a;const t={...e,segments:((a=e.segments)!=null&&a.length?e.segments:qu(e.waypoints??[])).map(s=>({...s,startElevation:Math.round(s.startElevation),lengthKm:Number.isFinite(s.lengthKm)?Be(s.lengthKm):ja,gradientPercent:Number.isFinite(s.gradientPercent)?la(s.gradientPercent):0,techLevel:Number.isFinite(s.techLevel)?s.techLevel:5,windExp:Number.isFinite(s.windExp)?s.windExp:5,markers:$n(s.markers),endMarkers:$n(s.endMarkers)})),waypoints:[]};return mt(t),t}function qu(e){if(e.length<2)return[];const t=[];for(let a=0;a<e.length-1;a++){const s=e[a],r=e[a+1],n=Be(r.kmMark-s.kmMark),i=r.elevation-s.elevation,o=la(n>0?i/(n*10):0);t.push({startElevation:s.elevation,lengthKm:n,gradientPercent:o,techLevel:s.techLevel??5,windExp:s.windExp??5,terrain:s.terrain??"Flat",markers:s.markers??[],endMarkers:r.markers??[]})}return t}function $n(e){return e?e.map(t=>({type:t.type,name:t.name??null,cat:t.cat??null})):[]}function Xu(e,t,a){const s=e*a*8+t/12;return s>=95?"HC":s>=68?"1":s>=46?"2":s>=28?"3":"4"}function Tn(e){const t=[];let a=null,s=null,r=0;const n=i=>{if(a==null||i==null||i<=a){a=null,s=null,r=0;return}const o=e[a],c=e[i],l=c.kmMark-o.kmMark,p=Math.max(0,c.elevation-o.elevation),u=l>0?p/(l*10):0;p>=Pu&&u>=Lu&&t.push({startKm:Be(o.kmMark),endKm:Be(c.kmMark),distanceKm:Be(l),gainMeters:Math.round(p),avgGradient:la(u),category:Xu(l,p,u),startIndex:a,topIndex:i,topElevation:Math.round(c.elevation)}),a=null,s=null,r=0};for(let i=1;i<e.length;i+=1){const o=e[i-1],c=e[i],l=c.elevation-o.elevation;if(a==null&&l>0){a=i-1,s=i,r=0;continue}if(a!=null){if(l>=0){(s==null||c.elevation>=e[s].elevation)&&(s=i),r=0;continue}r+=Math.abs(l),r>=Du&&n(s)}}return n(s),t}function Qu(e){const t=e.segments.some(r=>r.terrain==="Cobble_Hill"),a=e.segments.some(r=>r.terrain==="Cobble"),s=e.climbs.some(r=>r.category==="HC"||r.category==="1");return t?"Cobble_Hill":a?"Cobble":e.totalDistanceKm<=25&&e.elevationGainMeters<250?"ITT":s&&e.elevationGainMeters>=2800?"High_Mountain":s||e.elevationGainMeters>=1800?"Mountain":e.elevationGainMeters>=1100?"Medium_Mountain":e.elevationGainMeters>=700?"Hilly":e.elevationGainMeters>=350?"Rolling":"Flat"}function Ia(e){return e==="Cobble"||e==="Cobble_Hill"||e==="Sprint"}function em(e){return e.gainMeters>=Ku&&e.topElevation>=Wu?"Mountain":e.gainMeters>zu?"Medium_Mountain":"Hill"}function tm(e){return e.gradientPercent<Gu?"Abfahrt":e.gradientPercent<_u||Math.max(0,e.lengthKm*1e3*(e.gradientPercent/100))<Hu?"Flat":"Hill"}function am(e){if(e.segments.length===0)return;if(e.waypoints=sa(e.segments),e.sourceFormat==="csv"){const i=Tn(e.waypoints);e.climbs=i.map(({startIndex:o,topIndex:c,topElevation:l,...p})=>p);return}const t=e.segments.map(i=>i.manualTerrain||Ia(i.terrain)?i.terrain:tm(i)),a=Tn(e.waypoints);e.climbs=a.map(({startIndex:i,topIndex:o,topElevation:c,...l})=>l),a.forEach(i=>{const o=em(i);if(o)for(let c=i.startIndex;c<i.topIndex;c+=1)e.segments[c].manualTerrain||Ia(t[c])||(t[c]=o)});let s=null,r=0;const n=i=>{if(s==null||r<=Bu){s=null,r=0;return}for(let o=s;o<i;o+=1)!(e.segments[o].manualTerrain||Ia(t[o]))&&t[o]==="Flat"&&(t[o]="Abfahrt");s=null,r=0};for(let i=0;i<e.segments.length;i+=1){const o=e.segments[i];if(o&&o.gradientPercent<Au){s==null&&(s=i),r+=o.lengthKm;continue}n(i)}n(e.segments.length),e.segments.forEach((i,o)=>{Ia(i.terrain)||(i.terrain=t[o])}),e.waypoints=sa(e.segments),e.suggestedProfile=Qu(e)}function mt(e){sm(e),Mn(e),am(e),e.waypoints=sa(e.segments),Mn(e)}function sm(e){if(e.segments.length===0){e.waypoints=[];return}let t=e.segments[0].startElevation;e.segments=e.segments.map((a,s)=>{const r={...a,startElevation:Math.round(s===0?a.startElevation:t),lengthKm:Be(a.lengthKm),gradientPercent:la(a.gradientPercent),markers:_e(a.markers),endMarkers:_e(a.endMarkers)};return t=Math.round(r.startElevation+r.lengthKm*1e3*(r.gradientPercent/100)),r}),e.waypoints=sa(e.segments)}function Mn(e){e.totalDistanceKm=Be(e.segments.reduce((t,a)=>t+a.lengthKm,0)),e.elevationGainMeters=e.waypoints.reduce((t,a,s)=>{if(s===0)return 0;const r=a.elevation-e.waypoints[s-1].elevation;return t+Math.max(0,r)},0)}function nt(e){const t=e.segments[0],a=e.segments[e.segments.length-1];!t||!a||(t.markers.some(s=>s.type==="start")||(t.markers=_e([{type:"start",name:null,cat:null},...t.markers])),a.endMarkers.some(s=>Ne(s.type))||(a.endMarkers=_e([...a.endMarkers,{type:"finish_flat",name:null,cat:null}])),e.waypoints=sa(e.segments))}function rm(e,t,a,s){return e.length===0?"":`<div class="stage-editor-marker-list">${e.map((r,n)=>{const i=s==="start"&&t===0&&r.type==="start",o=e.filter(p=>Ne(p.type)).length,c=s==="end"&&t===a-1&&Ne(r.type)&&o===1,l=!(i||c);return`
      <div class="stage-editor-marker-row">
        <select data-field="markerType" data-marker-scope="${s}" data-marker-index="${n}">${Vu(r.type,s,t,a)}</select>
        <input type="text" value="${S(r.name??"")}" data-field="markerName" data-marker-scope="${s}" data-marker-index="${n}" placeholder="Name" />
        <select data-field="markerCat" data-marker-scope="${s}" data-marker-index="${n}">${Uu(r.cat)}</select>
        <button type="button" class="btn btn-danger btn-xs" data-segment-action="remove-marker" data-marker-scope="${s}" data-marker-index="${n}" data-segment-index="${t}" ${l?"":"disabled"}>✕</button>
      </div>`}).join("")}</div>`}function xn(e,t,a,s){const r=s==="start"?"Start / Berg+":"Sprint / Berg / Ziel+";return`
    <div class="stage-editor-marker-block">
      ${rm(e,t,a,s)}
      <button type="button" class="btn btn-secondary btn-xs stage-editor-marker-add" data-segment-action="add-marker" data-marker-scope="${s}" data-segment-index="${t}">${r}</button>
    </div>`}function nm(e,t,a,s,r){if(!d.stageEditorDraft)return;const n=d.stageEditorDraft.segments[e];if(!n)return;const i=a==="start"?n.markers:n.endMarkers,o=i[t];if(o){if(s==="markerType"){o.type=r;const c=Ju(o);if(o.name=c.name,o.cat=c.cat,Ne(o.type)){const l=i.filter((p,u)=>u===t||!Ne(p.type));a==="start"?n.markers=l:n.endMarkers=l}}else s==="markerName"?o.name=r.trim()||null:s==="markerCat"&&(o.cat=r||null);a==="start"?n.markers=_e(n.markers):n.endMarkers=_e(n.endMarkers),mt(d.stageEditorDraft),nt(d.stageEditorDraft),ce()}}function im(e,t){if(!d.stageEditorDraft)return;const a=d.stageEditorDraft.segments[e];if(!a)return;const s=t==="start"?e===0&&!a.markers.some(r=>r.type==="start")?{type:"start",name:"Start",cat:null}:{type:"climb_start",name:null,cat:null}:e===d.stageEditorDraft.segments.length-1&&!a.endMarkers.some(r=>Ne(r.type))?{type:"finish_flat",name:"Ziel",cat:null}:{type:"sprint_intermediate",name:null,cat:"Sprint"};t==="start"?(a.markers.push(s),a.markers=_e(a.markers)):(a.endMarkers.push(s),a.endMarkers=_e(a.endMarkers)),mt(d.stageEditorDraft),nt(d.stageEditorDraft),ce()}function om(e,t,a){if(!d.stageEditorDraft)return;const s=d.stageEditorDraft.segments[e];s&&(a==="start"?s.markers.splice(t,1):s.endMarkers.splice(t,1),mt(d.stageEditorDraft),nt(d.stageEditorDraft),ce())}let Nt=0,Pt=0;async function lm(){h("stage-editor-profile").innerHTML=Xs("Flat"),h("stage-editor-chart").innerHTML='<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>',h("stage-editor-climbs").innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>';const[e,t,a]=await Promise.all([j.listStageEditorCountries(),j.listStageEditorRaceCategories(),j.listStageEditorRacePrograms()]);if(e.success&&e.data){const s=h("stage-editor-race-country");s.innerHTML=e.data.map(r=>`<option value="${r.id}">${S(r.name)} (${S(r.code3)})</option>`).join("")}if(t.success&&t.data){const s=h("stage-editor-race-category");s.innerHTML=t.data.map(r=>`<option value="${r.id}">${S(r.name)}</option>`).join("")}a.success&&a.data&&(d.stageEditorPrograms=a.data,dm())}function dm(){const e=h("stage-editor-programs-list");d.stageEditorPrograms&&(e.innerHTML=d.stageEditorPrograms.map(t=>`
      <label style="display: flex; align-items: center; gap: 0.35rem; font-weight: normal; cursor: pointer; user-select: none; padding: 0.15rem 0;">
        <input type="checkbox" name="stage-editor-program-selection" value="${t.id}" style="width: auto; margin: 0;" />
        <span style="font-size: 0.85rem;">${t.id}: ${S(t.name)}</span>
      </label>
    `).join(""))}function cm(){const e=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked'),t=h("stage-editor-programs-selected-text");if(e.length===0)t.textContent="Keine Programme ausgewählt",t.classList.add("text-muted");else{const a=Array.from(e).map(s=>{var n;const r=(n=d.stageEditorPrograms)==null?void 0:n.find(i=>String(i.id)===s.value);return r?r.name:s.value});t.textContent=`${e.length} ausgewählt: ${a.join(", ")}`,t.classList.remove("text-muted")}}function er(e){return Math.round(e.startElevation+e.lengthKm*1e3*(e.gradientPercent/100))}function eo(){const e=d.stageEditorExistingStages.map(t=>t.stageId);return e.length>0?Math.max(...e)+1:1}function um(){const e=[...d.stageEditorExistingStages.map(t=>t.raceId),...d.races.map(t=>t.id)];return e.length>0?Math.max(...e)+1:1}function mm(e,t){let a=e;const s=new Set(d.stageEditorExistingStages.map(r=>r.stageId));for(;a>0&&s.has(a);)a+=t;if(a<=0)for(a=1;s.has(a);)a+=1;return a}function pm(e,t){let a=e;const s=new Set([...d.stageEditorExistingStages.map(r=>r.raceId),...d.races.map(r=>r.id)]);for(;a>0&&s.has(a);)a+=t;if(a<=0)for(a=1;s.has(a);)a+=1;return a}function gm(e){var o;const t=h("stage-editor-profile");t.innerHTML=Xs(e.suggestedProfile),t.value=e.suggestedProfile;const a=eo(),s=um();h("stage-editor-stage-id").value=String(a),h("stage-editor-race-id").value=String(s),Nt=a,Pt=s;const r=h("stage-editor-details-file");r.value.trim()||(r.value=`${ju(e.routeName)}.csv`);const n=h("stage-editor-date");!n.value&&((o=d.gameState)!=null&&o.currentDate)&&(n.value=d.gameState.currentDate),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(c=>{c.checked=!0})}function fm(e){h("stage-editor-stage-id").value=String(e.stageId),h("stage-editor-race-id").value=String(e.raceId),Nt=e.stageId,Pt=e.raceId,h("stage-editor-stage-number").value=String(e.stageNumber),h("stage-editor-date").value=e.date,h("stage-editor-details-file").value=e.detailsCsvFile;const t=h("stage-editor-profile");t.innerHTML=Xs(e.profile),t.value=e.profile,h("stage-editor-final-spread-start").value=String(e.finalSpreadStartPercent),h("stage-editor-final-push-start").value=String(e.finalPushStartPercent),h("stage-editor-final-spread-difficulty").value=String(e.finalSpreadDifficultyMultiplier),h("stage-editor-crash-multiplier").value=String(e.crashIncidentMultiplier),h("stage-editor-mechanical-multiplier").value=String(e.mechanicalIncidentMultiplier);const a=(e.allowedWeather||"1|2|3|4|5|6|7").split("|").map(r=>r.trim());document.querySelectorAll('input[name="stage-editor-weather"]').forEach(r=>{r.checked=a.includes(r.value)})}function to(e){var s;if(!e)return["Noch keine Strecke importiert."];const t=[];return e.segments.length===0?(t.push("Mindestens ein Segment ist erforderlich."),t):((s=e.segments[0])!=null&&s.markers.some(r=>r.type==="start")||t.push("Das erste Segment muss als Start markiert sein."),(e.segments[e.segments.length-1].endMarkers??[]).some(r=>Ne(r.type))||t.push("Das letzte Segment muss per Endmarker als Ziel markiert sein."),e.segments.forEach((r,n)=>{Qs(e,n).forEach(i=>{t.push(`Segment ${n+1}: ${i}`)}),[...r.markers??[],...r.endMarkers??[]].forEach(i=>{i.cat!=null&&!qi.includes(i.cat)&&t.push(`Segment ${n+1}: Ungültige Marker-Kategorie ${i.cat}.`)})}),t)}function ao(){const e=[],t=Number(h("stage-editor-stage-id").value),a=Number(h("stage-editor-race-id").value),s=Number(h("stage-editor-stage-number").value),r=h("stage-editor-date").value.trim(),n=h("stage-editor-details-file").value.trim(),i=Number(h("stage-editor-final-spread-start").value),o=Number(h("stage-editor-final-push-start").value),c=Number(h("stage-editor-final-spread-difficulty").value),l=Number(h("stage-editor-crash-multiplier").value),p=Number(h("stage-editor-mechanical-multiplier").value);(!Number.isInteger(t)||t<=0)&&e.push("Stage-ID fehlt oder ist ungültig."),(!Number.isInteger(a)||a<=0)&&e.push("Race-ID fehlt oder ist ungültig."),(!Number.isInteger(s)||s<=0)&&e.push("Etappennummer fehlt oder ist ungültig."),/^\d{4}-\d{2}-\d{2}$/.test(r)||e.push("Datum muss im Format YYYY-MM-DD vorliegen."),(!/^[A-Za-z0-9_.-]+\.csv$/.test(n)||n.includes("/"))&&e.push("Details-Datei muss ein Dateiname mit .csv-Endung ohne Pfad sein."),(!Number.isFinite(i)||i<0||i>100)&&e.push("Final Spread Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(o)||o<0||o>100)&&e.push("Final Push Start % muss zwischen 0 und 100 liegen."),(!Number.isFinite(c)||c<=0)&&e.push("Final Spread Multiplikator muss groesser als 0 sein."),(!Number.isFinite(l)||l<=0)&&e.push("Sturz-Multiplikator muss groesser als 0 sein."),(!Number.isFinite(p)||p<=0)&&e.push("Defekt-Multiplikator muss groesser als 0 sein."),document.querySelectorAll('input[name="stage-editor-weather"]:checked').length===0&&e.push("Mindestens eine Wetterart muss ausgewählt sein."),d.stageEditorExistingStages.map(y=>y.stageId).includes(t)&&e.push(`Die Stage-ID ${t} existiert bereits in stages.csv.`);const f=h("stage-editor-new-race-checkbox").checked,g=[...d.stageEditorExistingStages.map(y=>y.raceId),...d.races.map(y=>y.id)];if(f){g.includes(a)&&e.push(`Die Race-ID ${a} existiert bereits.`);const y=h("stage-editor-race-name").value.trim(),v=Number(h("stage-editor-race-country").value),T=Number(h("stage-editor-race-category").value),w=Number(h("stage-editor-race-num-stages").value),M=h("stage-editor-race-start-date").value.trim(),$=h("stage-editor-race-end-date").value.trim(),E=Number(h("stage-editor-race-prestige").value);y||e.push("Rennname fehlt."),(!Number.isInteger(v)||v<=0)&&e.push("Land fehlt oder ist ungültig."),(!Number.isInteger(T)||T<=0)&&e.push("Kategorie fehlt oder ist ungültig."),(!Number.isInteger(w)||w<=0)&&e.push("Etappenanzahl muss eine positive Ganzzahl sein."),/^\d{4}-\d{2}-\d{2}$/.test(M)||e.push("Startdatum muss im Format YYYY-MM-DD vorliegen."),/^\d{4}-\d{2}-\d{2}$/.test($)||e.push("Enddatum muss im Format YYYY-MM-DD vorliegen."),(!Number.isInteger(E)||E<1||E>100)&&e.push("Prestige muss zwischen 1 und 100 liegen.")}else g.includes(a)||e.push(`Die Race-ID ${a} existiert nicht. Wenn Sie ein neues Rennen erstellen möchten, aktivieren Sie bitte 'Neues Rennen anlegen'.`);return h("stage-editor-program-checkbox").checked&&document.querySelectorAll('input[name="stage-editor-program-selection"]:checked').length===0&&e.push("Mindestens ein Programm muss ausgewählt sein."),e}function hm(){var a,s;const e=document.querySelectorAll('input[name="stage-editor-weather"]:checked'),t=Array.from(e).map(r=>r.value).join("|");return{stageId:Number(h("stage-editor-stage-id").value),raceId:Number(h("stage-editor-race-id").value),stageNumber:Number(h("stage-editor-stage-number").value),date:h("stage-editor-date").value.trim(),profile:h("stage-editor-profile").value,detailsCsvFile:h("stage-editor-details-file").value.trim(),startElevation:((s=(a=d.stageEditorDraft)==null?void 0:a.segments[0])==null?void 0:s.startElevation)??0,finalSpreadStartPercent:Number(h("stage-editor-final-spread-start").value),finalPushStartPercent:Number(h("stage-editor-final-push-start").value),finalSpreadDifficultyMultiplier:Number(h("stage-editor-final-spread-difficulty").value),crashIncidentMultiplier:Number(h("stage-editor-crash-multiplier").value),mechanicalIncidentMultiplier:Number(h("stage-editor-mechanical-multiplier").value),allowedWeather:t}}function bm(e){return["distanceKm","elevationGainMeters","sprintCount","climbCount","profileScore"].includes(e)?"desc":"asc"}function ym(e){return["gainMeters","distanceKm","avgGradient","maxGradient","climbScore"].includes(e)?"desc":"asc"}function ss(e,t,a){const r=(Math.max(t,Math.min(a,e))-t)/Math.max(1,a-t),n=Math.round(124-r*118),i=54,o=.14+r*.12,c=.26+r*.18;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${n};--stage-editor-score-lightness:${i}%;--stage-editor-score-bg-alpha:${o};--stage-editor-score-border-alpha:${c};`}">${Math.round(e)}</span>`}function tr(e){let t;e<=100?t=e/100*.45:e<=250?t=.45+(e-100)/150*.35:t=.8+Math.min(e-250,100)/100*.2;const a=Math.round(122-t*122),s=Math.round(40-t*22),r=.18+t*.3,n=.3+t*.4;return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${r};--stage-editor-score-border-alpha:${n};`}">${Math.round(e)}</span>`}function vm(e){if(e==null)return'<span class="stage-editor-category-empty">—</span>';const t=e==="HC"?"is-hc":`is-cat-${e}`,a=e==="HC"?"HC":String(e);return`<span class="stage-editor-climb-category-badge ${t}">${a}</span>`}function Sm(e,t,a,s){const r=s!=null?` data-stage-profile-open-climb-id="${S(s)}"`:"";return`<button class="dashboard-stage-profile-link" type="button" data-stage-profile-open-stage-id="${t}"${r}>${e}</button>`}function km(e){const t=i=>i!=null?`${i.toFixed(1).replace(".",",")} km`:"—",a=i=>i!=null?`${Math.round(i).toLocaleString("de-DE")} m`:"—",s=e.profileScore??e.score,r=[...d.stageEditorClimbRows??[]].filter(i=>i.stageId===e.stageId).sort((i,o)=>i.climbIndex-o.climbIndex),n=r.length===0?'<div class="stage-editor-score-popover-grid stage-editor-score-popover-grid-compact"><span class="text-muted" style="grid-column:1/-1">Keine Bergwertungen</span></div>':`
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
          <span class="text-right">${tr(i.climbScore)}</span>
          <strong class="text-right">${t(i.distanceKm)}</strong>
          <strong class="text-right">${i.avgGradient.toFixed(1).replace(".",",")} %</strong>
        </div>`).join("")}`;return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>Stage Score</strong>
        ${ss(s,0,100)}
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
    </div>`}function $m(e){const t=r=>r!=null?`${r.toFixed(1).replace(".",",")} km`:"—",a=r=>r!=null?`${Math.round(r).toLocaleString("de-DE")} m`:"—",s=r=>r!=null?`${r.toFixed(1).replace(".",",")} %`:"—";return`
    <div class="stage-editor-score-popover-card">
      <div class="stage-editor-score-popover-head">
        <strong>${e.name??"Climb Score"}</strong>
        ${tr(e.climbScore??0)}
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
    </div>`}function so(e,t,a,s,r,n,i,o){const c=o??ss(e,t,a);return`
    <div class="season-standings-country-anchor stage-editor-score-anchor" tabindex="0">
      ${Sm(c,s,n,i)}
      <div class="season-standings-country-popover stage-editor-score-popover">
        ${r}
      </div>
    </div>`}function le(e,t,a,s,r){const n=a===t?" stage-editor-overview-sort-active":"",i=a===t?s==="asc"?"↑":"↓":"↕";return`
    <th>
      <button type="button" class="stage-editor-overview-sort${n}" data-stage-editor-${r}-sort="${t}">
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${a===t?" team-table-sort-indicator-active":""}">${i}</span>
      </button>
    </th>`}function Vt(){const e=h("stage-editor-stages-table"),t=h("stage-editor-stages-empty"),a=h("stage-editor-stages-meta"),s=e.querySelector("thead"),r=e.querySelector("tbody");if(!r)return;const n=d.stageEditorStagesSort.key,i=d.stageEditorStagesSort.direction;s&&(s.innerHTML=`<tr>
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
    </tr>`);const o=Mm(d.stageEditorStageRows);r.innerHTML=o.map(c=>`
    <tr>
      <td>${c.stageId}</td>
      <td>${ie(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(ca({stageNumber:c.stageNumber}))}</strong></td>
      <td>${so(c.profileScore,0,100,c.stageId,km(c),os({name:c.raceName},{stageNumber:c.stageNumber,profile:c.profile}))}</td>
      <td>${ua(c.profile)}</td>
      <td>${ht(c.distanceKm)}</td>
      <td>${Xi(c.elevationGainMeters)}</td>
      <td>${c.sprintCount} Sprints</td>
      <td>${c.climbCount} Climbs</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Etappenübersicht wird geladen...":`${d.stageEditorStageRows.length} vorhandene Etappen`}function Ut(){const e=h("stage-editor-climbs-table"),t=h("stage-editor-climbs-empty"),a=h("stage-editor-climbs-meta"),s=e.querySelector("thead"),r=e.querySelector("tbody");if(!r)return;const n=d.stageEditorClimbsSort.key,i=d.stageEditorClimbsSort.direction;s&&(s.innerHTML=`<tr>
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
    </tr>`);const o=xm(d.stageEditorClimbRows);r.innerHTML=o.map(c=>`
    <tr>
      <td>${c.placementKm.toFixed(1).replace(".",",")} km</td>
      <td><strong>${S(c.name)}</strong></td>
      <td>${vm(c.category)}</td>
      <td>${so(c.climbScore,0,350,c.stageId,$m(c),os({name:c.raceName},{stageNumber:c.stageNumber,profile:"Mountain"}),c.id,tr(c.climbScore))}</td>
      <td>${ie(c.countryCode||"")}</td>
      <td><strong>${S(c.raceName)}</strong></td>
      <td><strong>${S(ca({stageNumber:c.stageNumber}))}</strong></td>
      <td>${Xi(c.gainMeters)}</td>
      <td>${ht(c.distanceKm)}</td>
      <td>${c.avgGradient.toFixed(1).replace(".",",")}%</td>
      <td>${c.maxGradient.toFixed(1).replace(".",",")}%</td>
    </tr>`).join(""),t.classList.toggle("hidden",o.length>0||d.stageEditorOverviewLoading),a.textContent=d.stageEditorOverviewLoading?"Climb-Übersicht wird geladen...":`${d.stageEditorClimbRows.length} Anstiege (Bergwertungen/Bergankünfte)`}async function ro(e=!1){if(d.stageEditorOverviewLoaded&&!e){Vt(),Ut();return}d.stageEditorOverviewLoading=!0,Vt(),Ut();const t=await j.getStageEditorOverview();if(d.stageEditorOverviewLoading=!1,d.stageEditorOverviewLoaded=!0,!t.success||!t.data){d.stageEditorOverviewLoaded=!1,alert(`Übersicht konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`),Vt(),Ut();return}d.stageEditorStageRows=t.data.stages,d.stageEditorClimbRows=t.data.climbs,Vt(),Ut()}async function Tm(e=!1){const t=h("stage-editor-existing-stage-wrap");if(d.stageEditorExistingStagesLoaded&&!e){Ns();return}t.classList.add("loading");const a=h("stage-editor-existing-stage");a.innerHTML='<option value="">Lade vorhandene CSV-Stages...</option>';const s=await j.listStageEditorStages();if(t.classList.remove("loading"),d.stageEditorExistingStagesLoaded=!0,!s.success||!s.data){d.stageEditorExistingStagesLoaded=!1,a.innerHTML='<option value="">Laden fehlgeschlagen</option>';return}d.stageEditorExistingStages=s.data.stages,Ns()}function Ns(){const e=h("stage-editor-existing-stage"),t=e.value;e.innerHTML='<option value="">– Vorhandene CSV-Stage auswählen –</option>'+d.stageEditorExistingStages.map(a=>{const s=a.hasDetails?"":" (Details fehlen)";return`<option value="${a.stageId}"${String(a.stageId)===t?" selected":""}>${a.stageId} · ${S(a.raceName)} · Etappe ${a.stageNumber}${s}</option>`}).join("")}function Mm(e){const t=d.stageEditorStagesSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{let r=0;switch(d.stageEditorStagesSort.key){case"stageId":r=a.stageId-s.stageId;break;case"countryCode":r=(a.countryCode||"").localeCompare(s.countryCode||"","de");break;case"raceName":r=a.raceName.localeCompare(s.raceName,"de");break;case"stageNumber":r=a.stageNumber-s.stageNumber;break;case"profile":r=a.profile.localeCompare(s.profile,"de");break;case"distanceKm":r=a.distanceKm-s.distanceKm;break;case"elevationGainMeters":r=a.elevationGainMeters-s.elevationGainMeters;break;case"sprintCount":r=a.sprintCount-s.sprintCount;break;case"climbCount":r=a.climbCount-s.climbCount;break;case"profileScore":r=a.profileScore-s.profileScore;break}return r*t||a.stageId-s.stageId})}function xm(e){const t=d.stageEditorClimbsSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{let r=0;switch(d.stageEditorClimbsSort.key){case"placementKm":r=a.placementKm-s.placementKm;break;case"name":r=a.name.localeCompare(s.name,"de");break;case"category":r=(a.category??"").localeCompare(s.category??"","de");break;case"countryCode":r=(a.countryCode||"").localeCompare(s.countryCode||"","de");break;case"raceName":r=a.raceName.localeCompare(s.raceName,"de");break;case"stageNumber":r=a.stageNumber-s.stageNumber;break;case"gainMeters":r=a.gainMeters-s.gainMeters;break;case"distanceKm":r=a.distanceKm-s.distanceKm;break;case"avgGradient":r=a.avgGradient-s.avgGradient;break;case"maxGradient":r=a.maxGradient-s.maxGradient;break;case"climbScore":r=a.climbScore-s.climbScore;break}return r*t||a.placementKm-s.placementKm})}function wm(e){return e.map(t=>t.type).join(" | ")}function Im(e){const t=[],a=[];let s=0;return e.segments.forEach((r,n)=>{const i=s,o=Be(i+r.lengthKm),c=er(r);r.markers.forEach(l=>{l.type==="climb_start"&&l.name&&a.push({name:l.name,segmentIndex:n,startKm:i,startElevation:r.startElevation})}),r.endMarkers.forEach(l=>{if(qs(l.type,l.cat)&&l.name){let p=-1;for(let u=a.length-1;u>=0;u--)if(a[u].name===l.name){p=u;break}if(p>=0){const u=a[p];a.splice(p,1);const m=Be(o-u.startKm),f=Math.max(0,c-u.startElevation),g=m>0?la(f/(m*10)):0;t.push({name:l.name,startKm:u.startKm,endKm:o,distanceKm:m,gainMeters:f,avgGradient:g,category:l.cat||"4"})}}}),s=o}),t}function Rm(e){const t=[];let a=0;return e.segments.forEach(s=>{const r=Be(a+s.lengthKm);s.endMarkers.forEach(n=>{n.type==="sprint_intermediate"&&t.push({name:n.name||"Zwischensprint",kmMark:r})}),a=r}),t}function ce(){Ns();const e=d.stageEditorDraft,t=h("stage-editor-import-summary"),a=h("stage-editor-warnings"),s=h("stage-editor-climbs"),r=h("stage-editor-empty"),n=h("stage-editor-chart"),i=h("stage-editor-waypoints-body"),o=h("stage-editor-export-hint"),c=h("btn-stage-editor-export");if(!e){t.innerHTML="",a.innerHTML="",s.innerHTML='<p class="text-muted">Climb-Vorschläge erscheinen nach dem Import.</p>',r.classList.remove("hidden"),n.innerHTML=wn(null),i.innerHTML=`<tr><td colspan="${Nu}" class="text-muted">Keine Segmente vorhanden.</td></tr>`,o.textContent="Importiere oder lade zuerst eine Strecke. Export erzeugt Downloads und überschreibt keine Masterdateien automatisch.",c.disabled=!0;return}r.classList.add("hidden");const l=to(e),p=ao(),u=document.getElementById("stage-editor-profile"),m=u&&u.value?u.value:e.suggestedProfile;t.innerHTML=`
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Route</span><strong>${S(e.routeName)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Distanz</span><strong>${ht(e.totalDistanceKm)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Anstieg</span><strong>${e.elevationGainMeters} m</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Profil</span><strong>${S(m)}</strong></div>
    <div class="stage-editor-stat"><span class="stage-editor-stat-label">Segmente</span><strong>${e.segments.length}</strong></div>`;const f=[...e.warnings,...l,...p];a.innerHTML=f.length===0?'<div class="stage-editor-alert stage-editor-alert-ok">Export bereit. Keine Validierungsfehler.</div>':f.map(v=>`<div class="stage-editor-alert">${S(v)}</div>`).join("");const g=Im(e),b=Rm(e);let y="";g.length>0?y+=`
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
              <span>${ht(v.startKm)} - ${ht(v.endKm)}</span>
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
              ${ht(v.kmMark)}
            </span>
          </div>
        `).join("")}
      </div>
    `:y+=`
      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--success);">
        Zwischensprints (0)
      </div>
      <p class="text-muted" style="font-size: 0.75rem;">Keine Zwischensprints definiert (sprint_intermediate Marker hinzufügen).</p>
    `,s.innerHTML=y,n.innerHTML=wn(e),i.innerHTML=e.segments.map((v,T)=>`
    <tr data-segment-index="${T}" class="${Qs(e,T).length>0?"stage-editor-segment-row-invalid":""}" style="height: 3.5rem;">
      <td class="stage-editor-cell-nr text-muted" style="text-align:center; font-weight:700;">${T+1}</td>
      <td class="stage-editor-cell-length"><input type="number" step="0.01" min="0.2" value="${v.lengthKm.toFixed(2)}" data-field="segmentLengthKm" class="${Yu(v.lengthKm<ja)}"></td>
      <td class="stage-editor-cell-gradient"><input type="number" step="0.1" value="${v.gradientPercent.toFixed(1)}" data-field="segmentGradientPercent"></td>
      <td class="stage-editor-cell-terrain"><select data-field="terrain">${Ou(v.terrain)}</select></td>
      <td class="stage-editor-cell-start-markers">
        ${xn(v.markers,T,e.segments.length,"start")}
      </td>
      <td class="stage-editor-cell-end-markers">
        ${xn(v.endMarkers,T,e.segments.length,"end")}
      </td>
      <td class="stage-editor-row-actions">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <div class="text-muted" style="min-width:3.5rem;">${er(v)} m</div>
          ${Em(e,T)}
          <button type="button" class="btn btn-secondary btn-xs" data-segment-action="insert" data-segment-index="${T}">+</button>
          ${T===e.segments.length-1?`<button type="button" class="btn btn-secondary btn-xs" data-segment-action="append" data-segment-index="${T}">+ Ende</button>`:""}
          ${e.segments.length>1?`<button type="button" class="btn btn-danger btn-xs" data-segment-action="delete" data-segment-index="${T}">✕</button>`:""}
        </div>
      </td>
    </tr>`).join(""),c.disabled=f.length>0,o.textContent=f.length>0?`${f.length} Validierungshinweise vor dem Export.`:`Exportiert ${h("stage-editor-details-file").value||"stage_details.csv"} und eine stages-Row als Download.`}function Em(e,t){const a=Qs(e,t);return a.length===0?'<div class="stage-editor-segment-status">OK</div>':`<div class="stage-editor-segment-issues">${a.map(s=>`<div>${S(s)}</div>`).join("")}</div>`}function wn(e){if(!e||e.waypoints.length<2)return'<div class="stage-editor-empty">Noch keine Profildaten vorhanden.</div>';const t=920,a=280,s=24,r=20,n=e.waypoints,i=n[n.length-1].kmMark,o=Math.min(...n.map(g=>g.elevation)),c=Math.max(...n.map(g=>g.elevation)),l=Math.max(1,c-o),p=n.map(g=>{const b=s+g.kmMark/Math.max(i,.1)*(t-s*2),y=a-r-(g.elevation-o)/l*(a-r*2);return{x:b,y,waypoint:g}}),u=p.map((g,b)=>`${b===0?"M":"L"} ${g.x.toFixed(1)} ${g.y.toFixed(1)}`).join(" "),m=`${u} L ${(t-s).toFixed(1)} ${(a-r).toFixed(1)} L ${s.toFixed(1)} ${(a-r).toFixed(1)} Z`,f=p.filter(g=>g.waypoint.markers.length>0).map(g=>`
      <line x1="${g.x.toFixed(1)}" y1="${r}" x2="${g.x.toFixed(1)}" y2="${(a-r).toFixed(1)}" class="stage-editor-chart-marker-line" />
      <text x="${g.x.toFixed(1)}" y="14" class="stage-editor-chart-marker-label">${S(wm(g.waypoint.markers))}</text>`).join("");return`
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
      <text x="${s}" y="${r-4}" class="stage-editor-chart-scale">${Math.round(c)} m</text>
      <text x="${s}" y="${a-4}" class="stage-editor-chart-scale">${Math.round(o)} m</text>
      <text x="${t-s}" y="${a-4}" text-anchor="end" class="stage-editor-chart-scale">${ht(i)}</text>
    </svg>`}function Fm(e,t,a){const s=d.stageEditorDraft;if(!s)return;const r=s.segments[e];r&&(t==="startElevation"?r.startElevation=Math.max(-500,Math.min(9e3,Number.parseInt(a||"0",10))):t==="lengthKm"?r.lengthKm=Math.max(.01,Number.parseFloat(a||"0.1")):t==="gradientPercent"?r.gradientPercent=Number.parseFloat(a||"0"):t==="terrain"?(r.terrain=a,r.manualTerrain=!0):t==="techLevel"?r.techLevel=Math.max(1,Math.min(10,Number.parseInt(a||"5",10))):t==="windExp"&&(r.windExp=Math.max(1,Math.min(10,Number.parseInt(a||"5",10)))),mt(s),nt(s),ce())}function Cm(e){const t=d.stageEditorDraft;if(!t)return;const a=t.segments[e];if(!a)return;const s={startElevation:a.startElevation,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};t.segments.splice(e,0,s),mt(t),nt(t),ce()}function Nm(){const e=d.stageEditorDraft;if(!e)return;const t=e.segments[e.segments.length-1],s={startElevation:t?er(t):100,lengthKm:1,gradientPercent:0,techLevel:5,windExp:5,terrain:"Flat",markers:[],endMarkers:[]};e.segments.push(s),mt(e),nt(e),ce()}function Pm(e){const t=d.stageEditorDraft;t&&(t.segments.length<=1||(t.segments.splice(e,1),mt(t),nt(t),ce()))}async function Lm(){var a;const t=(a=h("stage-editor-file").files)==null?void 0:a[0];if(!t){alert("Bitte zuerst eine GPX- oder TCX-Datei auswählen.");return}h("stage-editor-file-hint").textContent=`${t.name} · ${(t.size/1024).toFixed(1).replace(".",",")} KB`,ve("Route wird importiert……");try{const s=await t.text(),r=await j.importStageRoute({fileName:t.name,fileContent:s});if(!r.success||!r.data){alert(`Import fehlgeschlagen: ${r.error??"Unbekannter Fehler"}`);return}const n=Qi(r.data);d.stageEditorDraft=n,nt(n),gm(n),ce(),Mt("stage-editor")}finally{fe()}}async function Dm(){const e=Number(h("stage-editor-existing-stage").value);if(!Number.isInteger(e)||e<=0){alert("Bitte zuerst eine vorhandene CSV-Stage auswählen.");return}ve("CSV-Stage wird geladen...");try{const t=await j.loadStageEditorStage(e);if(!t.success||!t.data){alert(`Stage konnte nicht geladen werden: ${t.error??"Unbekannter Fehler"}`);return}const a=Qi(t.data.draft);d.stageEditorDraft=a,nt(a),fm(t.data.metadata),ce(),Mt("stage-editor")}finally{fe()}}async function Am(){if(!d.stageEditorDraft){alert("Es gibt noch keine importierte oder geladene Strecke.");return}const e=[...to(d.stageEditorDraft),...ao()];if(e.length>0){alert(`Export blockiert:

${e.join(`
`)}`),ce();return}const t=h("stage-editor-new-race-checkbox").checked,a=h("stage-editor-program-checkbox").checked;let s;t&&(s={name:h("stage-editor-race-name").value.trim(),countryId:Number(h("stage-editor-race-country").value),categoryId:Number(h("stage-editor-race-category").value),isStageRace:Number(h("stage-editor-race-is-stage-race").value)===1,numberOfStages:Number(h("stage-editor-race-num-stages").value),startDate:h("stage-editor-race-start-date").value.trim(),endDate:h("stage-editor-race-end-date").value.trim(),prestige:Number(h("stage-editor-race-prestige").value)});let r;if(a){const n=document.querySelectorAll('input[name="stage-editor-program-selection"]:checked');r=Array.from(n).map(i=>Number(i.value))}ve("CSV-Dateien werden erstellt……");try{const n=await j.exportStageRoute({metadata:hm(),draft:d.stageEditorDraft,newRace:t,raceDetails:s,updatePrograms:a,programIds:r});if(!n.success||!n.data){alert(`Export fehlgeschlagen: ${n.error??"Unbekannter Fehler"}`);return}Es(n.data.stagesFileName,n.data.stagesCsv),Es(n.data.stageDetailsFileName,n.data.stageDetailsCsv);const i=h("stage-editor-stage-number"),o=Number(i.value)||1;i.value=String(o+1);const c=h("stage-editor-date"),l=c.value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(l)){const y=new Date(l);y.setDate(y.getDate()+1);const v=y.getFullYear(),T=String(y.getMonth()+1).padStart(2,"0"),w=String(y.getDate()).padStart(2,"0");c.value=`${v}-${T}-${w}`}await Promise.all([ro(!0),Tm(!0)]);const p=eo();h("stage-editor-stage-id").value=String(p),Nt=p;const u=h("stage-editor-new-race-checkbox");u&&(u.checked=!1);const m=h("stage-editor-new-race-details");m&&(m.classList.add("hidden"),m.style.display="none");const f=h("stage-editor-program-checkbox");f&&(f.checked=!1);const g=h("stage-editor-program-details");g&&(g.classList.add("hidden"),g.style.display="none"),Pt=Number(h("stage-editor-race-id").value),ce()}finally{fe()}}function Bm(){const e=document.getElementById("stage-editor-stages-table");e&&e.addEventListener("click",M=>{const $=M.target.closest("button[data-stage-profile-open-stage-id]");if($){const N=Number($.dataset.stageProfileOpenStageId);Number.isFinite(N)&&Ja(N);return}const E=M.target.closest("button[data-stage-editor-stages-sort]");if(!E)return;const R=E.dataset.stageEditorStagesSort;d.stageEditorStagesSort.key===R?d.stageEditorStagesSort.direction=d.stageEditorStagesSort.direction==="asc"?"desc":"asc":d.stageEditorStagesSort={key:R,direction:bm(R)},Vt()});const t=document.getElementById("stage-editor-climbs-table");t&&t.addEventListener("click",M=>{const $=M.target.closest("button[data-stage-profile-open-stage-id]");if($){const N=Number($.dataset.stageProfileOpenStageId),P=$.dataset.stageProfileOpenClimbId??null;if(Number.isFinite(N)){let D=null;P&&d.stageEditorClimbRows&&(D=d.stageEditorClimbRows.find(A=>A.id===P)??null),Ja(N,D)}return}const E=M.target.closest("button[data-stage-editor-climbs-sort]");if(!E)return;const R=E.dataset.stageEditorClimbsSort;d.stageEditorClimbsSort.key===R?d.stageEditorClimbsSort.direction=d.stageEditorClimbsSort.direction==="asc"?"desc":"asc":d.stageEditorClimbsSort={key:R,direction:ym(R)},Ut()});const a=document.getElementById("btn-stage-editor-import");a&&a.addEventListener("click",()=>{Lm()});const s=document.getElementById("btn-stage-editor-load-existing");s&&s.addEventListener("click",()=>{Dm()});const r=document.getElementById("btn-stage-editor-export");r&&r.addEventListener("click",()=>{Am()});const n=document.getElementById("stage-editor-file");n&&n.addEventListener("change",M=>{var E;const $=((E=M.target.files)==null?void 0:E[0])??null;h("stage-editor-file-hint").textContent=$?`${$.name} · ${($.size/1024).toFixed(1).replace(".",",")} KB`:"Noch keine Datei ausgewählt."});const i=document.getElementById("stage-editor-waypoints");i&&(i.addEventListener("change",M=>{const $=M.target,E=$.closest("tr[data-segment-index]"),R=$.dataset.field;if(!E||!R)return;const N=Number(E.dataset.segmentIndex);if(Number.isInteger(N)){if(R==="markerType"||R==="markerName"||R==="markerCat"){const P=Number($.dataset.markerIndex),D=$.dataset.markerScope;if(!Number.isInteger(P)||D!=="start"&&D!=="end")return;nm(N,P,D,R,$.value);return}Fm(N,R,$.value)}}),i.addEventListener("click",M=>{const $=M.target.closest("button[data-segment-action]");if(!$)return;const E=Number($.dataset.segmentIndex);if(Number.isInteger(E)){if($.dataset.segmentAction==="insert"){Cm(E);return}if($.dataset.segmentAction==="append"){Nm();return}if($.dataset.segmentAction==="add-marker"){const R=$.dataset.markerScope;if(R!=="start"&&R!=="end")return;im(E,R);return}if($.dataset.segmentAction==="remove-marker"){const R=Number($.dataset.markerIndex),N=$.dataset.markerScope;if(!Number.isInteger(R)||N!=="start"&&N!=="end")return;om(E,R,N);return}$.dataset.segmentAction==="delete"&&Pm(E)}})),["stage-editor-stage-id","stage-editor-race-id","stage-editor-stage-number","stage-editor-date","stage-editor-details-file","stage-editor-profile"].forEach(M=>{const $=document.getElementById(M);$&&$.addEventListener("change",()=>ce())}),document.querySelectorAll('input[name="stage-editor-weather"]').forEach(M=>{M.addEventListener("change",()=>ce())});const c=h("stage-editor-new-race-checkbox"),l=h("stage-editor-new-race-details"),p=h("stage-editor-program-checkbox"),u=h("stage-editor-program-details");c&&c.addEventListener("change",()=>{c.checked?(l&&(l.classList.remove("hidden"),l.style.display="grid"),p&&(p.checked=!0,u&&(u.classList.remove("hidden"),u.style.display="block"))):l&&(l.classList.add("hidden"),l.style.display="none"),ce()}),p&&p.addEventListener("change",()=>{p.checked?u&&(u.classList.remove("hidden"),u.style.display="block"):u&&(u.classList.add("hidden"),u.style.display="none"),ce()});const m=h("stage-editor-programs-dropdown-trigger"),f=h("stage-editor-programs-dropdown-menu"),g=h("btn-stage-editor-programs-ok");m&&f&&(m.addEventListener("click",M=>{M.stopPropagation();const $=f.style.display==="none"||!f.style.display;f.style.display=$?"flex":"none"}),g&&g.addEventListener("click",M=>{M.stopPropagation(),f.style.display="none",ce()}),document.addEventListener("click",M=>{const $=M.target;f.style.display==="flex"&&!f.contains($)&&$!==m&&!m.contains($)&&(f.style.display="none",ce())}));const b=h("stage-editor-programs-list");b&&b.addEventListener("change",M=>{M.target.name==="stage-editor-program-selection"&&cm()});let y=!1,v=null;const T=h("stage-editor-stage-id"),w=h("stage-editor-race-id");if(T&&w){[T,w].forEach($=>{$.addEventListener("keydown",E=>{E.key!=="ArrowUp"&&E.key!=="ArrowDown"&&(y=!0,v&&clearTimeout(v))}),$.addEventListener("keyup",E=>{E.key!=="ArrowUp"&&E.key!=="ArrowDown"&&(v&&clearTimeout(v),v=setTimeout(()=>{y=!1},150))}),$.addEventListener("blur",()=>{y=!1})});const M=($,E)=>{const R=Number($.value);if(!Number.isInteger(R)||R<=0){E==="stage"?Nt=R:Pt=R;return}const P=R-(E==="stage"?Nt:Pt);if(!y&&(P===1||P===-1)){let D=R;E==="stage"?D=mm(R,P):h("stage-editor-new-race-checkbox").checked&&(D=pm(R,P)),$.value=String(D)}E==="stage"?Nt=Number($.value):Pt=Number($.value)};T.addEventListener("input",()=>{M(T,"stage"),ce()}),w.addEventListener("input",()=>{M(w,"race"),ce()})}}let at=[],Et=null,Ee={form:!0,combinedFatigue:!0,shortFatigue:!1,longFatigue:!1};const wt=["#3b82f6","#ec4899","#8b5cf6","#06b6d4","#10b981","#f43f5e","#ef4444","#f59e0b","#84cc16","#a855f7"];function ar(e,t){if(e==null)return"";const a=t?S(t):"Wetter";switch(e){case 1:return`
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
      `;default:return""}}const te={seasonPoints:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',rank:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/></svg>',raceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/></svg>',wins:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M8 5h8M8 8h8"/></svg>',seasonForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',raceForm:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',longFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>',shortFatigue:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/></svg>',rollingRaceDays:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M4 4h16v10H4" fill="#fff"/><path d="M12 4v10"/><path d="M4 9h16"/><rect x="4" y="4" width="8" height="5" fill="#000" stroke="none"/><rect x="12" y="9" width="8" height="5" fill="#000" stroke="none"/><text x="16" y="22" font-size="9" font-weight="bold" fill="#ef4444" stroke="none" text-anchor="middle">30</text></svg>',flat:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M2 11h20v2H2z"/></svg>',hilly:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M3 14c2 0 4-3 6-3s4 3 6 3 4-3 6-3v2c-2 0-4 3-6 3s-4-3-6-3-4 3-6 3v-2z"/></svg>',mediumMountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M6 18l5-7 5 7H6zm6-10l-4 5.6L4 18h16l-4-5.6L12 8z"/></svg>',mountain:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M12 3l-8 15h16L12 3zm0 4.2L16.2 16H7.8L12 7.2z"/></svg>',stageRace:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',oneDay:'<svg class="rider-stats-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',sprint:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.05v6.95h5l-7 13v-6.95H6l7-13z"/></svg>',timetrial:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',cobble:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',attacker:'<svg class="rider-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',breakaway:'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer" style="margin-right: 0.4rem;"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'};function Ua(e,t,a){const s=ra(e??null);return`<span class="badge badge-race-category" style="${Qa(s)}; white-space: nowrap; display: inline-block;">${S(e??"Unbekannt")}</span>`}function sr(e){if(!e)return"-";const t=ra(e);return`<span class="badge badge-race-category" style="${Qa(t)}; white-space: nowrap; display: inline-block;">${S(e)}</span>`}function _m(e){if(e<=1)return"rgb(34, 197, 94)";if(e<=100){const t=(e-1)/99;return`rgb(${Math.round(34+t*200)}, ${Math.round(197-t*18)}, ${Math.round(94-t*86)})`}if(e<=250){const t=(e-100)/150;return`rgb(${Math.round(234+t*5)}, ${Math.round(179-t*111)}, ${Math.round(8+t*60)})`}if(e<=750){const t=(e-250)/500;return`rgb(${Math.round(239-t*112)}, ${Math.round(68-t*39)}, ${Math.round(68-t*39)})`}return"rgb(127, 29, 29)"}function Gm(e){return e==null?"-":`<span class="rider-stats-icon-pill" style="padding: 0.2rem 0.6rem; border: none; background: ${_m(e)}; color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${e}</span>`}function no(e){switch(e){case"gc_final":return"is-gc";case"points_final":return"is-points";case"mountain_final":return"is-mountain";case"youth_final":return"is-youth";case"breakaway_final":return"is-breakaway";default:return""}}function rr(e){switch(e){case"gc_final":return"Gesamtwertung";case"points_final":return"Punktewertung";case"mountain_final":return"Bergwertung";case"youth_final":return"Nachwuchs";case"breakaway_final":return"Ausreißer";default:return"Etappe"}}function Hm(e){return`<span class="rider-stats-final-type ${no(e)}">${S(rr(e))}</span>`}function ne(e,t,a){let s="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?s+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t==="flat"||t==="rolling"?s+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":t==="hilly"||t==="hilly_difficult"?s+="background: linear-gradient(135deg, #fef08a, #facc15); color: #854d0e; border: 1px solid #f59e0b; box-shadow: 0 0 5px rgba(250, 204, 21, 0.4);":t==="medium_mountain"?s+="background: #e67e22; color: #fff; box-shadow: 0 0 5px rgba(230, 126, 34, 0.4);":t==="mountain"||t==="high_mountain"?s+="background: #95a5a6; color: #fff; box-shadow: 0 0 5px rgba(149, 165, 166, 0.4);":t==="cobble"||t==="cobble_hill"?s+="background: #34495e; color: #fff; box-shadow: 0 0 5px rgba(52, 73, 94, 0.4);":(t==="itt"||t==="ttt")&&(s+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);"),`<span style="${s}" title="${S(a)}: ${e} Siege">${e}</span>`}function be(e,t,a){let s="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return e===0?s+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":t===1?s+="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; box-shadow: 0 0 5px rgba(251, 191, 36, 0.4);":t===2?s+="background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 0 5px rgba(249, 115, 22, 0.4);":t===3?s+="background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);":t===4?s+="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 0 5px rgba(37, 99, 235, 0.4);":t===5?s+="background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 0 5px rgba(13, 148, 136, 0.4);":t===6?s+="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 5px rgba(139, 92, 246, 0.4);":t===7&&(s+="background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #000; box-shadow: 0 0 5px rgba(203, 213, 225, 0.4);"),`<span style="${s}" title="${S(a)}: ${e} Siege">${e}</span>`}function zm(e){return`${e.startDate===e.endDate?re(e.startDate):`${re(e.startDate)} - ${re(e.endDate)}`} · ${e.isStageRace?"Etappenrennen":"Eintagesrennen"}`}function Ya(e){if(e==null||d.riders.length===0)return null;const a=[...d.riders].sort((s,r)=>(r.seasonPoints??0)-(s.seasonPoints??0)||(r.seasonWins??0)-(s.seasonWins??0)||r.overallRating-s.overallRating||`${s.lastName} ${s.firstName}`.localeCompare(`${r.lastName} ${r.firstName}`,"de")||s.id-r.id).findIndex(s=>s.id===e);return a>=0?a+1:null}function In(e){switch(e){case"gc_final":return 0;case"points_final":return 1;case"mountain_final":return 2;case"youth_final":return 3;case"breakaway_final":return 4;default:return 5}}function Km(e){return[...e].sort((t,a)=>a.date.localeCompare(t.date)||(a.stageNumber??-1)-(t.stageNumber??-1)||In(t.rowType)-In(a.rowType)||(t.resultRank??999)-(a.resultRank??999))}function Wm(e){return[...e].map(t=>({...t,rows:Km(t.rows)})).sort((t,a)=>a.endDate.localeCompare(t.endDate)||a.startDate.localeCompare(t.startDate)||a.raceName.localeCompare(t.raceName,"de")||a.raceId-t.raceId)}function io(e){const t=[{score:50,hue:0,lightness:28},{score:55,hue:0,lightness:40},{score:65,hue:30,lightness:42},{score:75,hue:60,lightness:42},{score:85,hue:120,lightness:36}];let a=120,s=36;const r=Math.max(50,Math.min(85,e));for(let c=1;c<t.length;c++){const l=t[c-1],p=t[c];if(r<=p.score){const u=(r-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*u),s=Math.round(l.lightness+(p.lightness-l.lightness)*u);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(1)}</span>`}function it(e,t,a,s){const r=s>0?Math.max(0,Math.min(1,a/s)):.5,n=Math.round(6+r*118),i=.26+r*.18,o=.14+r*.12;return`<span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="${`--rider-stats-pill-hue:${n};--rider-stats-pill-border-alpha:${i};--rider-stats-pill-bg-alpha:${o};`}" title="${S(t)}">${e} ${a}</span>`}function bs(e){if(typeof e=="string")switch(e){case"Berg":return"Bergfahrer";case"Hill":return"Hügelspezialist";case"Sprint":return"Sprinter";case"Timetrial":return"Zeitfahrer";case"Cobble":return"Pflasterspezialist";case"Attacker":return"Angreifer";default:return e}return e.name}function ys(e){if(!e)return"";switch(typeof e=="string"?e:e.key||e.name){case"Berg":return te.mountain;case"Hill":return te.hilly;case"Sprint":return te.sprint;case"Timetrial":return te.timetrial;case"Cobble":return te.cobble;case"Attacker":return te.attacker;default:return""}}function He(e,t,a,s,r){var V,J,Y;const n=(t==null?void 0:t.countryCode)??s??null,i=n?ie(n):r,o=(t==null?void 0:t.roleName)??((V=e==null?void 0:e.role)==null?void 0:V.name)??"Ohne Rolle",c=(t==null?void 0:t.overallRating)??(e==null?void 0:e.overallRating)??0,l=(t==null?void 0:t.teamId)??(e==null?void 0:e.activeTeamId)??null,p=(t==null?void 0:t.teamName)??a??"Ohne aktives Team",u=(t==null?void 0:t.seasonFormPhase)??(e==null?void 0:e.seasonFormPhase)??"neutral",m=((J=t==null?void 0:t.program)==null?void 0:J.name)??((Y=e==null?void 0:e.seasonProgram)==null?void 0:Y.name)??"-",f=(t==null?void 0:t.formBonus)??(e==null?void 0:e.formBonus)??0,g=(t==null?void 0:t.raceFormBonus)??(e==null?void 0:e.raceFormBonus)??0,b=(t==null?void 0:t.seasonRaceDaysTotal)??(e==null?void 0:e.seasonRaceDaysTotal)??0,y=(t==null?void 0:t.rolling30dRaceDays)??(e==null?void 0:e.rolling30dRaceDays)??0,v=(t==null?void 0:t.longTermFatigueMalus)??(e==null?void 0:e.longTermFatigueMalus)??0,T=(t==null?void 0:t.shortTermFatigueMalus)??(e==null?void 0:e.shortTermFatigueMalus)??0,w=(t==null?void 0:t.shortTermFatigueWarning)??(e==null?void 0:e.shortTermFatigueWarning)??"none",M=(t==null?void 0:t.currentSeasonPoints)??(e==null?void 0:e.seasonPoints)??0,$=(t==null?void 0:t.currentSeasonRank)??Ya((e==null?void 0:e.id)??(t==null?void 0:t.riderId)??null),E=(t==null?void 0:t.currentSeasonRaceDays)??(e==null?void 0:e.seasonRaceDays)??0,R=(t==null?void 0:t.careerWins)??(e==null?void 0:e.seasonWins)??0,N=(t==null?void 0:t.currentSeasonBreakawayAttempts)??0,P=(t==null?void 0:t.pointsByTerrain)??{flat:0,hilly:0,mediumMountain:0,mountain:0,timetrial:0,cobble:0},D=Math.max(P.flat,P.hilly,P.mediumMountain,P.mountain,P.timetrial,P.cobble),A=(t==null?void 0:t.pointsByRaceFormat)??{stageRace:0,oneDay:0},_=Math.max(A.stageRace,A.oneDay),G=e!=null&&e.specialization1?bs(e.specialization1):"-",x=e!=null&&e.specialization2?bs(e.specialization2):"-",L=e!=null&&e.specialization3?bs(e.specialization3):"-",O=ys((e==null?void 0:e.specialization1)??null),K=ys((e==null?void 0:e.specialization2)??null),se=ys((e==null?void 0:e.specialization3)??null);let Q="";return t!=null&&t.lieutenantInfo?Q=`
      <span class="rider-stats-icon-pill" title="Leutnant">🎖️ <span>Leutnant: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.lieutenantInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.lieutenantInfo.name)}</a></span></span>
    `:t!=null&&t.leaderInfo&&(Q=`
      <span class="rider-stats-icon-pill" title="Kapitän/Sprinter">🛡️ <span>Fährt für: <a href="#" onclick="event.preventDefault(); openRiderStatsFromRiderStats(${t.leaderInfo.id})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(t.leaderInfo.name)}</a></span></span>
    `),`
    <div class="rider-stats-header-grid">
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" title="Land">${i} <span>${S(n||"-")}</span></span>
        <span class="rider-stats-icon-pill" title="Team">${l?St(l,p):""} <span>${S(p)}</span></span>
        <span class="rider-stats-icon-pill" title="Rolle">${S(o)}</span>
        <span class="rider-stats-icon-pill" title="Formphase">${oi(u)} <span>Form</span></span>
        ${Q}
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;" title="Overall-Stärke">${io(c)}</span>
        <span class="rider-stats-icon-pill" title="Season-Form">${te.seasonForm} ${f>=0?"+":""}${f}</span>
        <span class="rider-stats-icon-pill" title="Rennform">${te.raceForm} ${g>=0?"+":""}${g}</span>
        <span class="rider-stats-icon-pill" title="Programm">${S(m)}</span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonrenntage">${te.raceDays} <span class="rider-stats-icon-pill-value">${b}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${y>14?"text-warning":""}" title="30-Tage Renntage">${te.rollingRaceDays} <span class="rider-stats-icon-pill-value">${y}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Langzeit-Fatigue">${te.longFatigue} <span class="rider-stats-icon-pill-value">${v}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width ${w!=="none"?"text-error":""}" title="Kurzzeitfatigue">${te.shortFatigue} <span class="rider-stats-icon-pill-value">${T}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonpunkte">${te.seasonPoints} <span class="rider-stats-icon-pill-value">${M}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Saisonplatzierung">${te.rank} <span class="rider-stats-icon-pill-value">${Gm($)}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Renntage">${te.raceDays} <span class="rider-stats-icon-pill-value">${E}</span></span>
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Siege">${te.wins} <span class="rider-stats-icon-pill-value">${R}</span></span>
      </div>
      <div class="rider-stats-header-col align-left">
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:124;--rider-stats-pill-border-alpha:0.44;--rider-stats-pill-bg-alpha:0.26; font-weight: 500;" title="Spezialisierung 1">${O} ${S(G)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:41;--rider-stats-pill-border-alpha:0.31;--rider-stats-pill-bg-alpha:0.18; font-weight: 500;" title="Spezialisierung 2">${K} ${S(x)}</span>
        <span class="rider-stats-icon-pill rider-stats-summary-pill-heat" style="--rider-stats-pill-hue:6;--rider-stats-pill-border-alpha:0.26;--rider-stats-pill-bg-alpha:0.14; font-weight: 500;" title="Spezialisierung 3">${se} ${S(L)}</span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${it(te.stageRace,"Rundfahrten Punkte",A.stageRace,_)}
        ${it(te.oneDay,"Eintagesrennen Punkte",A.oneDay,_)}
        <span class="rider-stats-icon-pill rider-stats-icon-pill-fixed-width" title="Ausreißversuche">${te.breakaway} <span class="rider-stats-icon-pill-value">${N}</span></span>
        <span class="rider-stats-icon-pill" style="visibility: hidden;">&nbsp;</span>
      </div>
      <div class="rider-stats-header-col align-left">
        ${it(te.flat,"Flach-Punkte",P.flat,D)}
        ${it(te.hilly,"Hügel-Punkte",P.hilly,D)}
        ${it(te.mediumMountain,"Mittelgebirge-Punkte",P.mediumMountain,D)}
      </div>
      <div class="rider-stats-header-col align-left">
        ${it(te.mountain,"Hochgebirge-Punkte",P.mountain,D)}
        ${it(te.timetrial,"Zeitfahren-Punkte",P.timetrial,D)}
        ${it(te.cobble,"Kopfsteinpflaster-Punkte",P.cobble,D)}
      </div>
    </div>
  `}function Rn(e,t){const a=(t==null?void 0:t.firstName)??(e==null?void 0:e.firstName)??"",s=(t==null?void 0:t.lastName)??(e==null?void 0:e.lastName)??"";return`${S(a)} <strong>${S(s)}</strong>`}function ze(e){const t=((e==null?void 0:e.programRaces.length)??0)>0;return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Riderstats Tabs">
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="results"?" team-detail-page-tab-active":""}" data-rider-stats-tab="results" aria-selected="${d.riderStatsTab==="results"?"true":"false"}">Ergebnisse</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-rider-stats-tab="topResults" aria-selected="${d.riderStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="program"?" team-detail-page-tab-active":""}" data-rider-stats-tab="program" aria-selected="${d.riderStatsTab==="program"?"true":"false"}"${t?"":" disabled"}>Programm</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="form"?" team-detail-page-tab-active":""}" data-rider-stats-tab="form" aria-selected="${d.riderStatsTab==="form"?"true":"false"}">Form</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="skills"?" team-detail-page-tab-active":""}" data-rider-stats-tab="skills" aria-selected="${d.riderStatsTab==="skills"?"true":"false"}">Skills</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="fatigue"?" team-detail-page-tab-active":""}" data-rider-stats-tab="fatigue" aria-selected="${d.riderStatsTab==="fatigue"?"true":"false"}">Erschöpfung</button>
      <button type="button" class="team-detail-page-tab${d.riderStatsTab==="career"?" team-detail-page-tab-active":""}" data-rider-stats-tab="career" aria-selected="${d.riderStatsTab==="career"?"true":"false"}">Karrierestatistiken</button>
    </div>`}function jm(e){const t=[{score:55,hue:0,lightness:28},{score:60,hue:0,lightness:40},{score:68,hue:30,lightness:42},{score:74,hue:60,lightness:42},{score:80,hue:120,lightness:36}];let a=120,s=36;const r=Math.max(55,Math.min(80,e));for(let c=1;c<t.length;c++){const l=t[c-1],p=t[c];if(r<=p.score){const u=(r-l.score)/(p.score-l.score);a=Math.round(l.hue+(p.hue-l.hue)*u),s=Math.round(l.lightness+(p.lightness-l.lightness)*u);break}}return`<span class="stage-editor-score-badge" style="${`--stage-editor-score-hue:${a};--stage-editor-score-lightness:${s}%;--stage-editor-score-bg-alpha:${.44};--stage-editor-score-border-alpha:${.72};`}">${e.toFixed(0)}</span>`}function Om(e,t){const a=(e==null?void 0:e.skills)??{mountain:60,hill:60,sprint:60,timeTrial:60,cobble:60,attack:60,mediumMountain:60,flat:60,prologue:60,acceleration:60},s=["mountain","hill","sprint","timeTrial","cobble","attack"],r=["Berg (MTN)","Hügel (HIL)","Sprint (SPR)","Zeitfahren (TT)","Pflaster (COB)","Angriff (ATT)"],n=540,i=440,o=n/2,c=i/2,l=160,p=60,u=85,m=u-p,f=A=>{const _=[];for(let G=0;G<6;G++){const x=G*Math.PI/3-Math.PI/2;_.push(`${o+A*Math.cos(x)},${c+A*Math.sin(x)}`)}return _},g=`
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
    </defs>`,b=`<circle cx="${o}" cy="${c}" r="${l+8}" fill="url(#radarBgGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`;let y="";for(let A=p;A<=u;A+=2.5){const _=l*((A-p)/m);if(_<1){y+=`<circle cx="${o}" cy="${c}" r="2" fill="rgba(255,255,255,0.25)" />`;continue}const G=f(_),x=A%5===0,L=x?1:.6,O=x?"none":"4,4",K=x?.4:.18;y+=`<polygon points="${G.join(" ")}" fill="none" stroke="rgba(255,255,255,${K})" stroke-width="${L}" stroke-dasharray="${O}" />`,x&&A>p&&(y+=`<text x="${o+5}" y="${c-_+4}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter, sans-serif" text-anchor="start">${A}</text>`)}let v="",T="";for(let A=0;A<6;A++){const _=A*Math.PI/3-Math.PI/2,G=o+l*Math.cos(_),x=c+l*Math.sin(_);v+=`<line x1="${o}" y1="${c}" x2="${G}" y2="${x}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />`;const L=l+28,O=o+L*Math.cos(_),K=c+L*Math.sin(_),se=Math.cos(_);let Q="middle";se>.15?Q="start":se<-.15&&(Q="end");const V=a[s[A]]??p;T+=`<text x="${O}" y="${K}" fill="rgba(255,255,255,0.92)" font-size="11.5" font-weight="700" font-family="Inter, sans-serif" text-anchor="${Q}" dominant-baseline="middle">${r[A]}</text>`,T+=`<text x="${O}" y="${K+14}" fill="rgba(255,255,255,0.50)" font-size="10" font-weight="500" font-family="Inter, sans-serif" text-anchor="${Q}" dominant-baseline="middle">${V}</text>`}const w=[],M=[];s.forEach((A,_)=>{const G=a[A]??p,x=l*((Math.max(p,Math.min(u,G))-p)/m),L=_*Math.PI/3-Math.PI/2,O=o+x*Math.cos(L),K=c+x*Math.sin(L);w.push(`${O},${K}`),M.push(`<circle cx="${O}" cy="${K}" r="5" fill="#818cf8" stroke="#fff" stroke-width="2" filter="url(#dotGlow)"><title>${r[_]}: ${G}</title></circle>`)});const $=`<polygon points="${w.join(" ")}" fill="url(#riderFillGrad)" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" filter="url(#radarGlow)" />`,R=[...[{key:"mountain",label:"Berg (MTN)"},{key:"hill",label:"Hügel (HIL)"},{key:"sprint",label:"Sprint (SPR)"},{key:"timeTrial",label:"Zeitfahren (TT)"},{key:"cobble",label:"Pflaster (COB)"},{key:"attack",label:"Angriff (ATT)"},{key:"mediumMountain",label:"Mittelgebirge (MDM)"},{key:"flat",label:"Flach (FLA)"},{key:"prologue",label:"Prolog (PRO)"},{key:"acceleration",label:"Beschleunigung (ACC)"}]].sort((A,_)=>{const G=a[A.key]??60;return(a[_.key]??60)-G}),N=[],P=[];R.forEach((A,_)=>{const G=a[A.key]??60,x=`
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-900); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-primary); margin-bottom: 0.75rem;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-300);">${A.label}</span>
        ${jm(G)}
      </div>
    `;_%2===0?N.push(x):P.push(x)});const D=`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; align-content: start;">
      <div class="skills-col">${N.join("")}</div>
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
            ${M.join("")}
            ${T}
          </svg>
        </div>
        <div class="skills-list-wrapper" style="display: flex; flex-direction: column; height: 100%; justify-content: start;">
          <h4 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.05rem; color: var(--text-100); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem; font-weight: bold;">Fahrer-Skills</h4>
          ${D}
        </div>
      </div>
    </section>
  `}function Vm(e,t){const a=t.shortTermFatigueMalus??0,s=t.longTermFatigueDecayable??0,r=t.longTermFatigueLocked??0,n=t.longTermFatigueMalus??0,i=t.totalFatigueLoadMalus??0,o=(a/.2).toFixed(1).replace(".",","),c=(s/.01).toFixed(0);let l="#fff";t.shortTermFatigueWarning==="critical"?l="#ef4444":t.shortTermFatigueWarning==="warning"&&(l="#fbbf24");const p=t.fatigueHistory??[];let u="";return p.length===0?u='<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem; color: #888;">Keine Erschöpfungshistorie für diesen Fahrer vorhanden.</td></tr>':u=p.map(m=>{const f=re(m.date);let g="";m.type==="race"?g=`${S(m.raceName)}${m.stageNumber!=null?` - Etappe ${m.stageNumber}`:""}`:g=m.raceName?S(m.raceName):"Regeneration";const b=m.type==="race"&&m.stageScore!=null?`<span class="badge" style="background: rgba(255,255,255,0.08); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${m.stageScore.toFixed(0)}</span>`:'<span style="color: #666;">–</span>';let y="";m.shortChange>0?y=`<span style="color: #ef4444; font-weight: 600;">+${m.shortChange.toFixed(2).replace(".",",")}</span>`:m.shortChange<0?y=`<span style="color: #2ecc71; font-weight: 600;">${m.shortChange.toFixed(2).replace(".",",")}</span>`:y='<span style="color: #666;">0,00</span>';const v=[];if(m.longDecayableChange!==0){const M=m.longDecayableChange>0?"+":"",$=m.longDecayableChange>0?"#ef4444":"#2ecc71";v.push(`<span style="color: ${$}; font-weight: 500;">${M}${m.longDecayableChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Abbau.)</span></span>`)}if(m.longLockedChange!==0){const M=m.longLockedChange>0?"+":"",$=m.longLockedChange>0?"#a855f7":"#2ecc71";v.push(`<span style="color: ${$}; font-weight: 500;">${M}${m.longLockedChange.toFixed(2).replace(".",",")} <span style="font-size: 0.8rem; color: #999;">(Gesp.)</span></span>`)}const T=v.length>0?`<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem;">${v.join("")}</div>`:'<span style="color: #666;">0,00</span>',w=m.shortAfter+m.longAfter;return`
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
              -${s.toFixed(2).replace(".",",")} <span style="font-size: 0.85rem; font-weight: 400; color: #888;">Abzug</span>
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
  `}function Um(e){var Y;if(!e)return`
      <section class="rider-stats-placeholder">
        <h3>Keine Formdaten vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Saison noch keine Formdaten aufgezeichnet.</p>
      </section>`;const a=(e.formHistory??[]).filter((I,C)=>C%2===0),s=((Y=d.gameState)==null?void 0:Y.currentDate)??new Date().toISOString(),r=a.length>0?new Date(a[a.length-1].date).getUTCFullYear():new Date(s).getUTCFullYear(),n=new Date(Date.UTC(r,0,1)).getTime(),i=864e5,o=1260,c=384,l=40,p=20,u=a.map(I=>{const F=(new Date(I.date).getTime()-n)/i,H=l+F/365*o,z=p+c-Math.min(8,Math.max(0,I.totalForm))/8*c;return{x:H,y:z,form:I.totalForm,date:I.date}});let m="",f="",g="";Ee.form&&u.length>0&&(m=`M ${u.map(I=>`${I.x},${I.y}`).join(" L ")}`,f=u.map(I=>`<circle cx="${I.x}" cy="${I.y}" r="3" fill="#fff" stroke="var(--accent-primary)" stroke-width="2"><title>${e.riderName} (${I.date}): ${I.form}</title></circle>`).join(""),g=`${m} L ${u[u.length-1].x},${p+c} L ${u[0].x},${p+c} Z`);let b="",y="";if(Ee.combinedFatigue&&u.length>0){const I=a.map(F=>{const z=(new Date(F.date).getTime()-n)/i,k=l+z/365*o,B=F.combinedFatigue??0,W=p+c-Math.min(15,Math.max(0,B))/15*c;return{x:k,y:W,val:B,date:F.date}});b=`<path d="${`M ${I.map(F=>`${F.x},${F.y}`).join(" L ")}`}" fill="none" stroke="#ef4444" stroke-width="2" />`,y=I.map(F=>`<circle cx="${F.x}" cy="${F.y}" r="3" fill="#fff" stroke="#ef4444" stroke-width="2"><title>Gesamtfatigue (${F.date}): ${F.val.toFixed(2)}</title></circle>`).join("")}let v="",T="";if(Ee.shortFatigue&&u.length>0){const I=a.map(F=>{const z=(new Date(F.date).getTime()-n)/i,k=l+z/365*o,B=F.shortFatigue??0,W=p+c-Math.min(15,Math.max(0,B))/15*c;return{x:k,y:W,val:B,date:F.date}});v=`<path d="${`M ${I.map(F=>`${F.x},${F.y}`).join(" L ")}`}" fill="none" stroke="#facc15" stroke-width="2" />`,T=I.map(F=>`<circle cx="${F.x}" cy="${F.y}" r="3" fill="#fff" stroke="#facc15" stroke-width="2"><title>Kurzzeitfatigue (${F.date}): ${F.val.toFixed(2)}</title></circle>`).join("")}let w="",M="";if(Ee.longFatigue&&u.length>0){const I=a.map(F=>{const z=(new Date(F.date).getTime()-n)/i,k=l+z/365*o,B=F.longFatigue??0,W=p+c-Math.min(15,Math.max(0,B))/15*c;return{x:k,y:W,val:B,date:F.date}});w=`<path d="${`M ${I.map(F=>`${F.x},${F.y}`).join(" L ")}`}" fill="none" stroke="#a855f7" stroke-width="2" />`,M=I.map(F=>`<circle cx="${F.x}" cy="${F.y}" r="3" fill="#fff" stroke="#a855f7" stroke-width="2"><title>Langzeitfatigue (${F.date}): ${F.val.toFixed(2)}</title></circle>`).join("")}const $="rgba(251, 191, 36, 0.15)";let E="";for(let I=0;I<=8;I+=2){const C=p+c-I/8*c;E+=`<line x1="${l}" y1="${C}" x2="${l+o}" y2="${C}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,E+=`<text x="${l-5}" y="${C+4}" fill="#ffffff" font-size="10" text-anchor="end">${I}</text>`}for(let I=0;I<=15;I+=3){const C=p+c-I/15*c;E+=`<text x="${l+o+5}" y="${C+4}" fill="#ef4444" font-size="10" text-anchor="start">${I}</text>`}let R="";for(let I=0;I<=52;I+=5){const C=l+I/52*o;E+=`<line x1="${C}" y1="${p}" x2="${C}" y2="${p+c}" stroke="var(--border-primary)" stroke-dasharray="2,2" />`,R+=`<text x="${C}" y="${p+c+15}" fill="#ffffff" font-size="10" text-anchor="middle">W${I}</text>`}let N="",P="";if(e.peakDates){const I=[...e.peakDates].sort((C,F)=>new Date(C).getTime()-new Date(F).getTime());for(let C=0;C<I.length;C++){const F=I[C],z=(new Date(F).getTime()-n)/i,k=l+z/365*o;N+=`<line x1="${k}" y1="${p}" x2="${k}" y2="${p+c}" stroke="#ffffff" stroke-width="2"><title>Peak: ${F}</title></line>`;const B=C>0?(new Date(I[C-1]).getTime()-n)/i:Number.NEGATIVE_INFINITY,W=z-56,U=B+14,pe=Math.max(0,Math.max(W,U)),Se=z-pe,Ie=l+pe/365*o,ke=Se/365*o;P+=`<rect x="${Ie}" y="${p}" width="${ke}" height="${c}" fill="rgba(16, 185, 129, 0.1)" />`;const qe=14/365*o;P+=`<rect x="${k}" y="${p}" width="${qe}" height="${c}" fill="rgba(239, 68, 68, 0.1)" />`}}const A=(new Date(s).getTime()-n)/i,_=l+A/365*o;N+=`<line x1="${_}" y1="${p}" x2="${_}" y2="${p+c}" stroke="#ef4444" stroke-width="3"><title>Heute: ${s}</title></line>`,at.forEach((I,C)=>{const F=wt[C%wt.length];I.peakDates&&I.peakDates.forEach(H=>{const k=(new Date(H).getTime()-n)/i,B=l+k/365*o;N+=`<line x1="${B}" y1="${p}" x2="${B}" y2="${p+c}" stroke="${F}" stroke-width="1.5" stroke-dasharray="3,3"><title>${I.riderName} Peak: ${H}</title></line>`})});let G="",x="";at.forEach((I,C)=>{const F=wt[C%wt.length],H=I.formHistory.filter((z,k)=>k%2===0).map(z=>{const B=(new Date(z.date).getTime()-n)/i,W=l+B/365*o,U=p+c-Math.min(8,Math.max(0,z.totalForm))/8*c;return{x:W,y:U,form:z.totalForm,date:z.date}});if(H.length>0){const z=`M ${H.map(k=>`${k.x},${k.y}`).join(" L ")}`;G+=`<path d="${z}" fill="none" stroke="${F}" stroke-width="2" />`,x+=H.map(k=>`<circle cx="${k.x}" cy="${k.y}" r="3" fill="#fff" stroke="${F}" stroke-width="2"><title>${I.riderName} (${k.date}): ${k.form}</title></circle>`).join("")}});const L=d.teams.filter(I=>I.division==="WorldTour"||I.divisionName==="WorldTour");let O='<option value="">-- Team auswählen --</option>';for(const I of L){const C=Et===I.id?" selected":"";O+=`<option value="${I.id}"${C}>${S(I.name)}</option>`}let K='<option value="">-- Fahrer auswählen --</option>';if(Et!=null){const I=d.riders.filter(C=>C.activeTeamId===Et&&C.id!==e.riderId&&!at.some(F=>F.riderId===C.id));for(const C of I)K+=`<option value="${C.id}">${S(C.firstName)} ${S(C.lastName)}</option>`}const se=`
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
        <select id="rider-compare-rider-select" class="form-control" style="width: auto; background: var(--bg-900); color: var(--text-100); border: 1px solid var(--border-primary);" ${Et==null?"disabled":""}>
          ${K}
        </select>
      </div>
    </div>
  `,Q=e.currentSeasonRank??Ya(e.riderId)??"–",V=[`
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0;">
      <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-100); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(e.riderName)} (${e.currentSeasonPoints}/${Q})">${S(e.riderName)} <span style="font-weight: normal; color: var(--text-500);">(${e.currentSeasonPoints}/${Q})</span></span>
    </div>
    `];at.forEach((I,C)=>{const F=wt[C%wt.length],H=I.currentSeasonRank??Ya(I.riderId)??"–";V.push(`
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.50rem; padding: 0.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <span style="display: inline-block; width: 12px; height: 12px; background: ${F}; border-radius: 2px; flex-shrink: 0;"></span>
          <span style="font-size: 0.9rem; color: var(--text-300); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${S(I.riderName)} (${I.currentSeasonPoints}/${H})">${S(I.riderName)} <span style="color: var(--text-500);">(${I.currentSeasonPoints}/${H})</span></span>
        </div>
        <button type="button" class="compare-remove-btn" data-remove-compare-id="${I.riderId}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; font-weight: bold; display: flex; align-items: center;" title="Vergleich entfernen">×</button>
      </div>
    `)});const J=`
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
      ${V.join("")}
    </div>
  `;return`
    <section class="rider-stats-form-tab">
      <div class="rider-stats-season-head">
        <h3>Formverlauf (Saison ${r})</h3>
      </div>
      ${se}
      <div class="rider-stats-form-container" style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; align-items: start; margin-top: 1rem;">
        <div class="rider-stats-chart-wrapper" style="overflow-x: auto; background: var(--bg-secondary); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-primary);">
          <svg width="100%" height="460" viewBox="0 0 1350 444" style="min-width: 1300px;">
            ${P}
            ${E}
            ${R}
            ${N}
            ${g?`<path d="${g}" fill="${$}" />`:""}
            ${m?`<path d="${m}" fill="none" stroke="var(--accent-primary)" stroke-width="2" />`:""}
            ${f}
            ${b}
            ${y}
            ${v}
            ${T}
            ${w}
            ${M}
            ${G}
            ${x}
          </svg>
        </div>
        ${J}
      </div>
    </section>
  `}function Ym(e){const t=(e==null?void 0:e.programRaces)??[];return e!=null&&e.program?t.length===0?`
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
            ${t.map(a=>{var r;const s=e.unavailableUntil?a.startDate<=e.unavailableUntil&&a.endDate>=d.gameState.currentDate:!1;return`
              <tr>
                <td>${S(ns(a))}</td>
                <td class="text-center" style="font-size: 1.1rem;">${s?'<span title="Fällt aus (Verletzung/Krankheit)">🏥</span>':""}</td>
                <td class="results-flag-col-cell">${(r=a.country)!=null&&r.code3?ie(a.country.code3):"–"}</td>
                <td><strong>${S(a.name)}</strong></td>
                <td>${rs(a)}</td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      </div>
    </section>`:`
      <section class="rider-stats-placeholder">
        <h3>Kein Programm hinterlegt</h3>
        <p>Für diesen Fahrer ist aktuell kein Saisonprogramm vorhanden.</p>
      </section>`}function nr(e){const t=new Set;if(e.jerseysWorn){const i=e.jerseysWorn.split(",").map(o=>o.trim()).filter(Boolean);for(const o of i)t.add(o)}const a=new Map;if(e.eventIds){const i=e.eventIds.split("|");for(const o of i){const[c,l]=o.split(":");c&&a.set(c,l?parseInt(l,10):1)}}const s=[{type:"jersey",key:"yellow",label:"Gelbes Trikot (Gesamtwertung)",colorClass:"jersey-dot-yellow"},{type:"jersey",key:"green",label:"Grünes Trikot (Punktewertung)",colorClass:"jersey-dot-green"},{type:"jersey",key:"red",label:"Bergtrikot (Bergwertung)",colorClass:"jersey-dot-red"},{type:"jersey",key:"white",label:"Weißes Trikot (Nachwuchswertung)",colorClass:"jersey-dot-white"},{type:"jersey",key:"purple",label:"Lila Trikot (Aktivste Fahrer)",colorClass:"jersey-dot-purple-worn"},{type:"event",key:"3",label:"Superform",colorClass:"event-dot-3"},{type:"event",key:"4",label:"Supermalus",colorClass:"event-dot-4"},{type:"event",key:"1",label:"Sturz",colorClass:"event-dot-1"},{type:"event",key:"2",label:"Defekt",colorClass:"event-dot-2"},{type:"event",key:"7",label:"Heimvorteil",colorClass:"event-dot-7"},{type:"event",key:"8",label:"Heimbonus",colorClass:"event-dot-8"},{type:"event",key:"9",label:"Heimmalus",colorClass:"event-dot-9"},{type:"event",key:"5",label:"Attacken",colorClass:"event-dot-5"},{type:"event",key:"6",label:"Konterattacken",colorClass:"event-dot-6"}],r=[],n=[];for(const i of s)if(i.type==="jersey")t.has(i.key)&&(r.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${S(i.label)}</span>
          </div>
        `));else{const o=a.get(i.key);if(o!==void 0&&o>0){const c=o>1?` (${o}x)`:"";r.push(`<span class="status-dot ${i.colorClass}"></span>`),n.push(`
          <div class="status-tooltip-row">
            <span class="status-dot ${i.colorClass}"></span>
            <span>${S(i.label)}${S(c)}</span>
          </div>
        `)}}return e.superTeamId!=null&&e.teamId!=null&&e.superTeamId===e.teamId&&(r.push('<span class="status-dot status-dot-superteam"></span>'),n.push(`
      <div class="status-tooltip-row">
        <span class="status-dot status-dot-superteam"></span>
        <span>Superteam-Teilnahme</span>
      </div>
    `)),r.length===0?"":`
    <div class="status-dots-container">
      ${r.join("")}
      <div class="status-tooltip">
        <div class="status-tooltip-title">Status Details</div>
        ${n.join("")}
      </div>
    </div>
  `}function Tt(e,t){return`<span class="rider-stats-rank-badge rider-stats-rank-badge-${t}">${S(e)}</span>`}function Zm(e){return!e.isBreakaway||e.rowType!=="stage_result"||e.finishStatus!=="classified"?"–":'<span class="rider-stats-breakaway-icon" aria-label="Ausreißer" title="Ausreißer"><svg class="rider-stats-icon" viewBox="0 0 24 24" style="fill:#ef4444; width:1em; height:1em; vertical-align:middle;"><path d="M12 21L2 3h20L12 21z"/></svg></span>'}function Jm(e){return e.finishStatus==="otl"?Tt("OTL","place"):e.finishStatus==="dnf"?Tt("DNF","place"):e.resultRank==null?"–":`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${e.resultRank<=3?` rider-stats-rank-badge-top-${e.resultRank}`:""}">${S(String(e.resultRank))}</span>`}function qm(e){return e.finishStatus!=="classified"||e.gcRank==null?"–":Tt(String(e.gcRank),"gc")}function Xm(e){return e.finishStatus==="otl"?ws(e.statusReason,!0):e.finishStatus==="dnf"?ws(e.statusReason,!1):e.stageTimeSeconds!=null?`${e.resultLabel} · ${Aa(e.stageTimeSeconds)}`:e.resultLabel}function Le(e,t,a=!1){var o,c;const s=(e==null?void 0:e.activeTeamId)!=null?((o=d.teams.find(l=>l.id===e.activeTeamId))==null?void 0:o.name)??null:null,r=((c=e==null?void 0:e.country)==null?void 0:c.code3)??(e==null?void 0:e.nationality)??null,n=r?ie(r):"",i=t==null?[]:[...t.seasons].map(l=>({...l,raceBlocks:Wm(l.raceBlocks)})).sort((l,p)=>p.season-l.season);return a?`
      ${He(e,t,s,r,n)}
      ${ze(t)}
      <section class="rider-stats-placeholder">
        <h3>Historie wird geladen</h3>
        <p>Die Karriereergebnisse dieses Fahrers werden zusammengestellt.</p>
      </section>`:t?d.riderStatsTab==="skills"?`
      ${He(e,t,s,r,n)}
      ${ze(t)}
      ${Om(e)}`:d.riderStatsTab==="fatigue"?`
      ${He(e,t,s,r,n)}
      ${ze(t)}
      ${Vm(e,t)}`:d.riderStatsTab==="program"?`
      ${He(e,t,s,r,n)}
      ${ze(t)}
      ${Ym(t)}`:d.riderStatsTab==="form"?`
      ${He(e,t,s,r,n)}
      ${ze(t)}
      ${Um(t)}`:d.riderStatsTab==="topResults"?`
      ${He(e,t,s,r,n)}
      ${ze(t)}
      ${ep(t)}`:d.riderStatsTab==="career"?`
      ${He(e,t,s,r,n)}
      ${ze(t)}
      ${tp(t)}`:t.seasons.length===0?`
      ${He(e,t,s,r,n)}
      ${ze(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`:`
    ${He(e,t,s,r,n)}
    ${ze(t)}
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
                  <p>${S(zm(p))}</p>
                </div>
                ${Ua(p.raceCategoryName,p.isStageRace,p.rows.filter(u=>u.rowType==="stage_result").length||null)}
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
                    ${p.rows.map(u=>{const m=u.rowType!=="stage_result",f=m?`${u.raceName} · ${rr(u.rowType)}`:u.stageName?`${u.raceName} · ${u.stageName}`:u.raceName;return`
                        <tr class="rider-stats-row${m?" rider-stats-row-final":""}">
                          <td>${S(re(u.date))}</td>
                          <td>${Jm(u)}</td>
                          <td>${qm(u)}</td>
                          <td class="rider-stats-breakaway-col">${Zm(u)}</td>
                          <td>${m?"":ar(u.rolledWeatherId,u.rolledWetterName)}</td>
                          <td>${m?Hm(u.rowType):Ua(u.raceCategoryName?u.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):u.raceCategoryName,u.isStageRace)}</td>
                          <td>${S(f)}</td>
                          <td class="status-cell">${nr(u)}</td>
                          <td>${m?"–":u.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${u.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${ua(u.profile)}</button>`:"–"}</td>
                          <td>${m?"-":u.distanceKm!=null?S(u.distanceKm.toFixed(1).replace(".",",")):"–"}</td>
                          <td>${m?"-":u.elevationGainMeters!=null?S(String(Math.round(u.elevationGainMeters))):"–"}</td>
                          <td>${S(Xm(u))}</td>
                          <td>${u.seasonPoints}</td>
                        </tr>`}).join("")}
                  </tbody>
                </table>
              </div>
            </section>`).join("")}
        </div>
      </section>`).join("")}`:`
      ${He(e,t,s,r,n)}
      ${ze(t)}
      <section class="rider-stats-placeholder">
        <h3>Keine Historie vorhanden</h3>
        <p>Für diesen Fahrer wurden in der aktuellen Karriere noch keine Ergebnisse gefunden.</p>
      </section>`}function Ps(){const e=document.querySelector(".rider-stats-modal-card");if(!e)return;["results","topResults","career","form","fatigue"].includes(d.riderStatsTab)?(e.style.minWidth="min(1475px, 95vw)",e.style.maxWidth="1687px"):(e.style.minWidth="",e.style.maxWidth="")}async function _t(e){var c,l,p,u;const t=$e(e),a=(t==null?void 0:t.activeTeamId)!=null?((c=d.teams.find(m=>m.id===t.activeTeamId))==null?void 0:c.name)??null:null;at=[],Et=null,d.riderStatsSelectedRiderId=e,d.riderStatsTab="results",Ps(),d.riderStatsTopResultsFilterCategory=null,d.riderStatsTopResultsFilterSeason=null,d.riderStatsTopResultsPage=1,h("rider-stats-title").innerHTML=Rn(t,null),h("rider-stats-jersey").innerHTML="";const s=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((l=t.role)==null?void 0:l.name)??"Fahrer"} · ${a??"Team unbekannt"}${s}`:"Historie wird geladen",h("rider-stats-body").innerHTML=Le(t,null,!0),Ve("riderStats");const r=await j.getRiderStats(e);if(d.riderStatsSelectedRiderId!==e)return;if(!r.success||!r.data){const m=t!=null&&t.age?` · Alter ${t.age}`:"";h("rider-stats-meta").textContent=t?`${((p=t.role)==null?void 0:p.name)??"Fahrer"} · ${a??"Team unbekannt"}${m}`:"Fehler beim Laden",h("rider-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Historie konnte nicht geladen werden</h3>
        <p>${S(r.error??"Unbekannter Fehler")}</p>
      </section>`;return}d.riderStatsPayload=r.data,Ps(),h("rider-stats-title").innerHTML=Rn(t,r.data),h("rider-stats-jersey").innerHTML="";const n=r.data.age?` · Alter ${r.data.age}`:t!=null&&t.age?` · Alter ${t.age}`:"",i=r.data.mentorName?` · Mentor: ${r.data.mentorName}`:"",o=r.data.mentoredRiderNames&&r.data.mentoredRiderNames.length>0?` · Mentor von: ${r.data.mentoredRiderNames.join(" - ")}`:"";h("rider-stats-meta").textContent=`${((u=t==null?void 0:t.role)==null?void 0:u.name)??"Fahrer"} · ${r.data.teamName??a??"Ohne aktives Team"}${n} · ${r.data.seasons.length} Saisons${i}${o}`,h("rider-stats-body").innerHTML=Le(t,r.data,!1)}function Qm(){h("rider-stats-body").addEventListener("click",e=>{var r;if(e.target&&e.target.id&&e.target.id.startsWith("toggle-chart-")){const n=e.target.id,i=e.target.checked;n==="toggle-chart-form"?Ee.form=i:n==="toggle-chart-combined-fatigue"?Ee.combinedFatigue=i:n==="toggle-chart-short-fatigue"?Ee.shortFatigue=i:n==="toggle-chart-long-fatigue"&&(Ee.longFatigue=i);const o=$e(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Le(o,d.riderStatsPayload,!1);return}const t=e.target.closest("button[data-rider-stats-tab]");if(!t){const n=e.target.closest("button[data-remove-compare-id]");if(n){const c=Number(n.dataset.removeCompareId);at=at.filter(p=>p.riderId!==c);const l=$e(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Le(l,d.riderStatsPayload,!1);return}const i=e.target.closest("button[data-top-results-page]");if(i){const c=Number(i.dataset.topResultsPage);if(!isNaN(c)&&c>=1){d.riderStatsTopResultsPage=c;const l=$e(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Le(l,d.riderStatsPayload,!1)}return}const o=e.target.closest("button[data-stage-profile-id]");if(o){const c=Number(o.dataset.stageProfileId);Number.isFinite(c)&&Ja(c);return}return}const a=t.dataset.riderStatsTab;if(a!=="results"&&a!=="program"&&a!=="form"&&a!=="topResults"&&a!=="skills"&&a!=="career"&&a!=="fatigue"||a==="program"&&(((r=d.riderStatsPayload)==null?void 0:r.programRaces.length)??0)===0)return;d.riderStatsTab=a,Ps();const s=$e(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Le(s,d.riderStatsPayload,!1)}),h("rider-stats-body").addEventListener("change",async e=>{const t=e.target;if(t.id==="rider-stats-filter-category"){d.riderStatsTopResultsFilterCategory=t.value==="all"?null:t.value,d.riderStatsTopResultsPage=1;const a=$e(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Le(a,d.riderStatsPayload,!1)}else if(t.id==="rider-stats-filter-season"){d.riderStatsTopResultsFilterSeason=t.value==="all"?null:Number(t.value),d.riderStatsTopResultsPage=1;const a=$e(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Le(a,d.riderStatsPayload,!1)}else if(t.classList.contains("rider-stats-filter-checkbox")){const a=t.dataset.filterType;d.riderStatsTopResultsFilters[a]=t.checked,d.riderStatsTopResultsPage=1;const s=$e(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Le(s,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-team-select"){const a=t.value;Et=a?Number(a):null;const s=$e(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Le(s,d.riderStatsPayload,!1)}else if(t.id==="rider-compare-rider-select"){const a=t.value;if(a){const s=Number(a);if(at.length>=10){alert("Sie können maximal 10 Fahrer vergleichen."),t.value="";return}const r=await j.getRiderStats(s,!0);r.success&&r.data?at.push({riderId:r.data.riderId,riderName:r.data.riderName,teamId:r.data.teamId,teamName:r.data.teamName,formHistory:r.data.formHistory??[],peakDates:r.data.peakDates??[],currentSeasonPoints:r.data.currentSeasonPoints??0,currentSeasonRank:r.data.currentSeasonRank??null}):alert("Formverlauf konnte nicht geladen werden: "+(r.error??""));const n=$e(d.riderStatsSelectedRiderId);h("rider-stats-body").innerHTML=Le(n,d.riderStatsPayload,!1)}}})}function En(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function ep(e){const t=[];for(const g of e.seasons)for(const b of g.raceBlocks)for(const y of b.rows)t.push({...y,season:g.season,isStageRace:b.isStageRace});const a=Array.from(new Set(t.map(g=>g.raceCategoryName).filter(Boolean)));a.sort((g,b)=>g.localeCompare(b,"de"));const s=Array.from(new Set(t.map(g=>g.season))).sort((g,b)=>b-g);let r=t.filter(g=>g.rowType!=="stage_result"?g.rowType==="gc_final"?d.riderStatsTopResultsFilters.gc:g.rowType==="mountain_final"?d.riderStatsTopResultsFilters.mountain:g.rowType==="points_final"?d.riderStatsTopResultsFilters.points:g.rowType==="youth_final"?d.riderStatsTopResultsFilters.youth:!0:g.isStageRace?d.riderStatsTopResultsFilters.stage:d.riderStatsTopResultsFilters.oneDay);if(d.riderStatsTopResultsFilterCategory){const g=d.riderStatsTopResultsFilterCategory;if(g.endsWith("-etappen")){const b=g.substring(0,g.length-8);r=r.filter(y=>y.raceCategoryName===b&&y.rowType==="stage_result")}else if(g.endsWith("-gc")){const b=g.substring(0,g.length-3);r=r.filter(y=>y.raceCategoryName===b&&y.rowType!=="stage_result")}else r=r.filter(b=>b.raceCategoryName===g)}d.riderStatsTopResultsFilterSeason!=null&&(r=r.filter(g=>g.season===d.riderStatsTopResultsFilterSeason)),r.sort((g,b)=>{if(b.seasonPoints!==g.seasonPoints)return b.seasonPoints-g.seasonPoints;const y=g.rowType!=="stage_result",v=b.rowType!=="stage_result",T=g.resultRank??9999,w=b.resultRank??9999;if(d.riderStatsTopResultsFilterCategory)return T!==w?T-w:y!==v?y?-1:1:0;{const M=En(g.raceCategoryName),$=En(b.raceCategoryName);return M!==$?M-$:y!==v?y?-1:1:T-w}});const n=200,i=r.slice(0,1e3),o=Math.max(1,Math.ceil(i.length/n));d.riderStatsTopResultsPage>o&&(d.riderStatsTopResultsPage=o);const c=(d.riderStatsTopResultsPage-1)*n,l=i.slice(c,c+n),u=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="rider-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${a.map(g=>{if(g.toLowerCase().includes("stage race")||g.toLowerCase().includes("grand tour")||g.toLowerCase().includes("tour de france")){const y=`${g}-etappen`,v=`${g}-gc`;return`
        <option value="${S(y)}" ${d.riderStatsTopResultsFilterCategory===y?"selected":""}>${S(g)} - Etappen</option>
        <option value="${S(v)}" ${d.riderStatsTopResultsFilterCategory===v?"selected":""}>${S(g)} - GC</option>
      `}else return`<option value="${S(g)}" ${d.riderStatsTopResultsFilterCategory===g?"selected":""}>${S(g)}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="rider-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${s.map(g=>`<option value="${g}" ${d.riderStatsTopResultsFilterSeason===g?"selected":""}>Saison ${g}</option>`).join("")}
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
  `,m=l.length===0?'<tr><td colspan="9" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':l.map(g=>{const b=g.rowType!=="stage_result",y=b?`${g.raceName} · ${rr(g.rowType)}`:g.stageNumber&&g.isStageRace?`${g.raceName} · Etappe ${g.stageNumber}`:g.raceName;let v="–",T="–";g.finishStatus==="otl"?v=Tt("OTL","place"):g.finishStatus==="dnf"?v=Tt("DNF","place"):g.resultRank==null||(b?T=`<span class="rider-stats-final-type ${no(g.rowType)}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${g.resultRank}</span>`:v=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${g.resultRank<=3?` rider-stats-rank-badge-top-${g.resultRank}`:""}">${S(String(g.resultRank))}</span>`);const w=b?"–":g.profile?`<button type="button" class="rider-stats-profile-badge-link" data-stage-profile-id="${g.stageId}" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex;">${ua(g.profile)}</button>`:"–",M=!b&&g.stageScore!=null&&g.stageScore>0?ss(g.stageScore,0,350):"–",$=Ua(g.raceCategoryName?g.raceCategoryName.replace(/^world\s*tour\s*-\s*/i,""):g.raceCategoryName,g.isStageRace);return`
          <tr class="rider-stats-row${b?" rider-stats-row-final":""}">
            <td>${v}</td>
            <td>${T}</td>
            <td><strong>${S(y)}</strong>${b?"":ar(g.rolledWeatherId,g.rolledWetterName)}</td>
            <td class="status-cell">${nr(g)}</td>
            <td>${w}</td>
            <td>${M}</td>
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
  `}function tp(e){const t=e.careerStats||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,successfulBreakaways:0,superteamCount:0,categories:{}},a=(e.careerRaceDaysBySeason||[]).reduce((n,i)=>{const o=i.raceDays??i.race_days??i.racedays??0;return n+Number(o)},0),s=(n,i,o,c)=>{const l=typeof n=="number"?n:parseFloat(String(n))||0;let p="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return l===0?p+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":i==="gold"?p+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":i==="silver"?p+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":i==="bronze"?p+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":i==="purple"?p+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":i==="green"?p+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":i==="red"?p+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":i==="white"?p+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);":i==="breakaway"&&(p+="background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);"),`<span style="${p}" title="${S(o)}">${n}</span>`},r=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}];return`
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
        ${r.map(n=>{const i=t.categories[n.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(n.name)}">${S(n.name)}</span>
                ${sr(n.key)}
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
                ${te.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${i.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}window.openRiderStatsFromRiderStats=_t;const ap=250,It=1200,sp=250,rp=1200,Fn=.2;class np{constructor(t,a={}){this.elements=t,this.options=a,this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.timeMultiplier=1,this.isRunning=!1,this.animationFrameId=null,this.lastFrameTime=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.timingRailMode="finish",this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.sidebarPaintSequence=0,this.messageFilter="all",this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections=new Set,this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0},this.elements.controls.addEventListener("click",s=>{var i,o,c,l;const r=s.target.closest("button[data-race-sim-action]");if(r){if(r.dataset.raceSimAction==="toggle")if((i=this.frameSnapshot)!=null&&i.isFinished&&this.bootstrap){const u=((o=this.engine)==null?void 0:o.getSnapshot())??this.detailSnapshot;u&&((l=(c=this.options).onFinishRequested)==null||l.call(c,u,this.bootstrap))}else this.isRunning?this.pause():this.play();return}const n=s.target.closest("button[data-race-sim-speed]");if(n){const p=Number(n.dataset.raceSimSpeed);if(!Number.isFinite(p))return;this.timeMultiplier=p,this.render()}}),this.elements.messages.addEventListener("click",s=>{const r=s.target.closest("button[data-race-sim-group-rider-id]");if(r){const c=this.resolveRiderIdFromGroupButton(r);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),_t(c));return}const n=s.target.closest("button[data-race-sim-group-rider-name]");if(n){const c=this.resolveRiderIdFromGroupButton(n);c!=null&&(this.detailSnapshot&&this.selectGroupByRiderId(c,this.detailSnapshot),_t(c));return}const i=s.target.closest("button[data-race-sim-message-filter]");if(!i||this.detailSnapshot==null)return;const o=i.dataset.raceSimMessageFilter;o&&(this.messageFilter=o,this.holdOverviewInteraction(),rn(this.elements.messages,this.detailSnapshot.messages,this.messageFilter))}),this.elements.favorites.addEventListener("click",s=>{const r=s.target.closest("[data-race-sim-overview-summary]");if(r){const n=r.dataset.raceSimOverviewSummary,i=r.closest("details[data-race-sim-overview-section]");n&&i&&(!i.open?this.collapsedOverviewSections.delete(n):this.collapsedOverviewSections.add(n),this.holdOverviewInteraction())}this.handleGroupInteraction(s)}),this.elements.groupBox.addEventListener("click",s=>{this.handleGroupInteraction(s)}),this.elements.profile.addEventListener("click",s=>{const r=s.target.closest("button[data-race-sim-timing-mode]");if(!r)return;const n=r.dataset.raceSimTimingMode;!n||n!=="finish"&&!n.startsWith("split:")||(this.timingRailMode=n,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=performance.now()+It,this.render())})}handleGroupInteraction(t){var p,u;if(!this.detailSnapshot)return;const a=t.target.closest("button[data-race-sim-group-rider-id]");if(a){const m=this.resolveRiderIdFromGroupButton(a);m!=null&&this.selectGroupByRiderId(m,this.detailSnapshot);return}const s=t.target.closest("button[data-race-sim-group-nav]");if(!s)return;const r=this.buildRaceGroups(this.detailSnapshot);if(r.length===0)return;const n=this.resolveSelectedGroupLabel(this.detailSnapshot),i=Math.max(0,r.findIndex(m=>m.label===n)),o=s.dataset.raceSimGroupNav==="prev"?-1:1,c=(i+o+r.length)%r.length,l=((p=r[c])==null?void 0:p.label)??n;this.selectGroupByLabel(l,this.detailSnapshot),this.elements.profile.addEventListener("pointerdown",m=>{const f=m.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+It)}),this.elements.profile.addEventListener("wheel",m=>{const f=m.target.closest(".race-sim-timing-scroll");f&&(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+It)},{passive:!0}),this.elements.profile.addEventListener("scroll",m=>{const f=m.target;!(f instanceof HTMLElement)||!f.classList.contains("race-sim-timing-scroll")||(this.timingScrollTop=f.scrollTop,this.profileInteractionHoldUntilMs=performance.now()+It)},!0),(u=this.elements.sidebar.parentElement)==null||u.addEventListener("click",m=>{if(!this.bootstrap||!this.detailSnapshot||!gu(this.elements.sidebar,m.target))return;const g=performance.now(),b=Sn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const y=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",y),this.scheduleSidebarPaintTelemetry(g,y),this.lastSidebarRenderTime=performance.now()})}load(t,a={}){this.pause(),this.bootstrap=t,(a.resetSpeed??!0)&&(this.timeMultiplier=1),this.timingRailMode="finish",this.engine=new Ii(t),this.detailSnapshot=this.engine.getSnapshot(),this.frameSnapshot=this.detailSnapshot,this.favorites=this.detailSnapshot.stageFavorites,this.collapsedOverviewSections.clear();const s=this.buildRaceGroups(this.detailSnapshot);this.selectGroupByLabel(this.resolveInitialGroupLabel(s),this.detailSnapshot,!1),this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.render(performance.now(),!0),(a.autoplay??!0)&&this.play()}clear(t){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.remove("hidden"),this.elements.emptyState.textContent=t,this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}hide(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.lastSidebarRenderTime=Number.NEGATIVE_INFINITY,this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY,this.timingScrollTop=0,this.profileInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.overviewInteractionHoldUntilMs=Number.NEGATIVE_INFINITY,this.resetPerfTelemetry(),this.favorites=[],this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.layout.classList.add("hidden"),this.elements.controlsHeader.classList.add("hidden"),this.elements.emptyState.classList.add("hidden"),this.elements.groupBox.innerHTML="",this.elements.messages.innerHTML="",this.elements.favorites.innerHTML="",this.elements.meta.textContent=""}pause(){this.isRunning=!1,this.lastFrameTime=null,this.animationFrameId!=null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.render()}play(){if(!this.engine||!this.frameSnapshot||this.frameSnapshot.isFinished||this.isRunning){this.render();return}this.isRunning=!0,this.lastFrameTime=null,this.animationFrameId=requestAnimationFrame(t=>this.frame(t)),this.render()}destroy(){this.pause(),this.engine=null,this.frameSnapshot=null,this.detailSnapshot=null,this.bootstrap=null,this.selectedGroupLabel=null,this.selectedGroupAnchorRiderId=null,this.collapsedOverviewSections.clear(),this.elements.controlsHeader.classList.add("hidden"),this.elements.groupBox.innerHTML=""}frame(t){if(!this.isRunning||!this.engine)return;if(this.lastFrameTime==null){this.lastFrameTime=t,this.animationFrameId=requestAnimationFrame(r=>this.frame(r));return}const a=Math.min(.25,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t;const s=performance.now();if(this.frameSnapshot=this.engine.step(a*this.timeMultiplier),this.recordPerfTelemetry("engineStepMs",performance.now()-s),this.render(t),this.frameSnapshot.isFinished){this.detailSnapshot=this.engine.getSnapshot(),this.pause();return}this.animationFrameId=requestAnimationFrame(r=>this.frame(r))}render(t=performance.now(),a=!1){var f;if(!this.bootstrap||!this.frameSnapshot)return;this.elements.layout.classList.remove("hidden"),this.elements.controlsHeader.classList.remove("hidden"),this.elements.emptyState.classList.add("hidden");const s=this.bootstrap.stage.profile==="ITT"?" · Einzelzeitfahren · Startintervall 02:00":"",r=vl(this.bootstrap.stageSummary),n=[`${r.segmentCount} Segmente`,r.sprintCount>0?`${r.sprintCount} Sprint${r.sprintCount===1?"":"s"}`:null,r.climbCount>0?`${r.climbCount} Bergwertung${r.climbCount===1?"":"en"}`:null].filter(g=>g!=null).join(" · "),i={1:"☀️",2:"🌡️",3:"🌦️",4:"🌧️",5:"💨",6:"🌫️",7:"❄️"},o=this.bootstrap.stage.rolledWeatherId,c=o!=null?i[o]??"":"",l=c?` · ${c}`:"";this.elements.meta.textContent=`${this.bootstrap.race.name} · Etappe ${this.bootstrap.stage.stageNumber} · ${this.bootstrap.stage.profile} · ${this.bootstrap.stageSummary.distanceKm.toFixed(1).replace(".",",")} km${s}${n?` · ${n}`:""}${l}`;const p=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.profileInteractionHoldUntilMs&&t-this.lastProfileRenderTime>=ap,u=a||this.detailSnapshot==null||this.frameSnapshot.isFinished||this.isRunning,m=a||!this.isRunning||this.frameSnapshot.isFinished||t>=this.overviewInteractionHoldUntilMs&&t-this.lastOverviewRenderTime>=sp;if(p||u||m){const g=performance.now();this.detailSnapshot=((f=this.engine)==null?void 0:f.getSnapshot())??this.detailSnapshot,this.detailSnapshot&&(this.selectedGroupLabel=this.resolveSelectedGroupLabel(this.detailSnapshot)),this.recordPerfTelemetry("snapshotBuildMs",performance.now()-g)}if(p&&this.detailSnapshot){const g=this.elements.profile.querySelector(".race-sim-timing-scroll");g&&(this.timingScrollTop=g.scrollTop);const b=performance.now();wl(this.elements.profile,this.bootstrap.stageSummary,this.detailSnapshot,`${this.bootstrap.race.name} Etappe ${this.bootstrap.stage.stageNumber}`,this.bootstrap,this.timingRailMode,this.selectedGroupLabel),this.recordPerfTelemetry("profileRenderMs",performance.now()-b),this.lastProfileRenderTime=t;const y=this.elements.profile.querySelector(".race-sim-timing-scroll");y&&(y.scrollTop=this.timingScrollTop)}if(u&&this.detailSnapshot){this.lastSidebarRenderTime=t;const g=performance.now(),b=Sn(this.elements.sidebar,this.detailSnapshot,this.bootstrap);this.recordSidebarPerfTelemetry(b);const y=performance.now()-g;this.recordPerfTelemetry("sidebarWriteMs",y),this.scheduleSidebarPaintTelemetry(g,y)}m&&this.detailSnapshot&&(rn(this.elements.messages,this.detailSnapshot.messages,this.messageFilter),Qc(this.elements.favorites,this.favorites,this.bootstrap,this.detailSnapshot.markerClassifications,this.detailSnapshot,this.collapsedOverviewSections),Yc(this.elements.groupBox,this.bootstrap,this.detailSnapshot,this.selectedGroupLabel),this.lastOverviewRenderTime=t),sn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}resolveSelectedGroupLabel(t){const a=this.buildRaceGroups(t);if(this.selectedGroupAnchorRiderId!=null){const s=a.find(r=>r.riderIds.includes(this.selectedGroupAnchorRiderId??-1))??null;if(s)return s.label}return this.selectedGroupLabel!=null&&a.some(s=>s.label===this.selectedGroupLabel)?this.selectedGroupLabel:this.resolveInitialGroupLabel(a)}buildRaceGroups(t){return Os(js(t.clusters))}resolveInitialGroupLabel(t){var a,s;return((a=t.find(r=>r.label==="P"))==null?void 0:a.label)??((s=t[0])==null?void 0:s.label)??null}resolveBestRiderIdInGroup(t){if(!t||!this.bootstrap)return null;const a=new Map(this.bootstrap.gcStandings.map(s=>[s.riderId,s]));return[...t.riderIds].sort((s,r)=>{var n,i;return(((n=a.get(s))==null?void 0:n.rank)??Number.MAX_SAFE_INTEGER)-(((i=a.get(r))==null?void 0:i.rank)??Number.MAX_SAFE_INTEGER)||s-r})[0]??null}selectGroupByLabel(t,a,s=!0){const r=this.buildRaceGroups(a),n=r.find(i=>i.label===t)??r.find(i=>i.label==="P")??r[0]??null;this.selectedGroupLabel=(n==null?void 0:n.label)??null,this.selectedGroupAnchorRiderId=this.resolveBestRiderIdInGroup(n),s&&(this.profileInteractionHoldUntilMs=performance.now()+It,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}selectGroupByRiderId(t,a){const r=this.buildRaceGroups(a).find(n=>n.riderIds.includes(t))??null;r&&(this.selectedGroupLabel=r.label,this.selectedGroupAnchorRiderId=t,this.profileInteractionHoldUntilMs=performance.now()+It,this.holdOverviewInteraction(),this.lastProfileRenderTime=Number.NEGATIVE_INFINITY,this.render(performance.now(),!0))}holdOverviewInteraction(){this.overviewInteractionHoldUntilMs=performance.now()+rp,this.lastOverviewRenderTime=Number.NEGATIVE_INFINITY}resolveRiderIdFromGroupButton(t){const a=Number(t.dataset.raceSimGroupRiderId);if(Number.isFinite(a))return a;if(!this.bootstrap)return null;const s=t.dataset.raceSimGroupRiderName;if(!s)return null;const r=t.dataset.raceSimGroupRiderTeamId!=null?Number(t.dataset.raceSimGroupRiderTeamId):null,n=this.bootstrap.riders.find(i=>`${i.firstName} ${i.lastName}`===s&&(r==null||i.activeTeamId===r))??null;return(n==null?void 0:n.id)??null}resetPerfTelemetry(){this.perfTelemetry={engineStepMs:0,snapshotBuildMs:0,profileRenderMs:0,sidebarRenderMs:0,sidebarWriteMs:0,sidebarPaintMs:0,sidebarPrepMs:0,sidebarSortMs:0,sidebarLayoutMs:0,sidebarCreateRowsMs:0,sidebarRemoveRowsMs:0,sidebarOrderCheckMs:0,sidebarReorderMs:0,sidebarVisibilityMs:0,sidebarUpdateRowsMs:0,sidebarFinalizeMs:0,sidebarRowsTotal:0,sidebarRowsCreated:0,sidebarRowsRemoved:0,sidebarRowsUpdated:0,sidebarRowsSkippedInvisible:0,sidebarOrderChanged:0}}recordPerfTelemetry(t,a){const s=this.perfTelemetry[t];this.perfTelemetry[t]=s<=0?a:s*(1-Fn)+a*Fn}recordSidebarPerfTelemetry(t){this.recordPerfTelemetry("sidebarRenderMs",t.totalMs),this.recordPerfTelemetry("sidebarPrepMs",t.prepMs),this.recordPerfTelemetry("sidebarSortMs",t.sortMs),this.recordPerfTelemetry("sidebarLayoutMs",t.layoutMs),this.recordPerfTelemetry("sidebarCreateRowsMs",t.createRowsMs),this.recordPerfTelemetry("sidebarRemoveRowsMs",t.removeRowsMs),this.recordPerfTelemetry("sidebarOrderCheckMs",t.orderCheckMs),this.recordPerfTelemetry("sidebarReorderMs",t.reorderMs),this.recordPerfTelemetry("sidebarVisibilityMs",t.visibilityMs),this.recordPerfTelemetry("sidebarUpdateRowsMs",t.updateRowsMs),this.recordPerfTelemetry("sidebarFinalizeMs",t.finalizeMs),this.perfTelemetry.sidebarRowsTotal=t.rowsTotal,this.perfTelemetry.sidebarRowsCreated=t.rowsCreated,this.perfTelemetry.sidebarRowsRemoved=t.rowsRemoved,this.perfTelemetry.sidebarRowsUpdated=t.rowsUpdated,this.perfTelemetry.sidebarRowsSkippedInvisible=t.rowsSkippedInvisible,this.perfTelemetry.sidebarOrderChanged=t.orderChanged}scheduleSidebarPaintTelemetry(t,a){const s=++this.sidebarPaintSequence;requestAnimationFrame(()=>{if(s!==this.sidebarPaintSequence)return;const r=Math.max(0,performance.now()-t-a);this.recordPerfTelemetry("sidebarPaintMs",r),this.refreshControls()})}refreshControls(){!this.bootstrap||!this.frameSnapshot||sn(this.elements.controls,{isRunning:this.isRunning,timeMultiplier:this.timeMultiplier,snapshot:this.frameSnapshot,totalRiders:this.bootstrap.riders.length,perf:this.perfTelemetry})}}const We="__stage_overview__",oo="__non_finishers__",lo="__events__",co="__roster__";let Re="all";function ir(e,t){return e==="climb_top"||e==="finish_hill"||e==="finish_mountain"}function Cn(e){return ir(e.markerType,e.markerCategory)?0:e.markerType==="sprint_intermediate"?1:2}function ip(e){return[...e].sort((t,a)=>Cn(t)-Cn(a)||t.kmMark-a.kmMark||t.markerLabel.localeCompare(a.markerLabel,"de")||t.markerKey.localeCompare(a.markerKey,"de"))}function op(e){const t=e.markerType==="sprint_intermediate"?"Sprint":"Berg",a=ir(e.markerType,e.markerCategory)&&e.markerCategory?` ${e.markerCategory}`:"";return`${t}${a} · ${e.markerLabel}`}function lp(e,t){return!(e>0)||!(t>0)?"":`${(e/t*3600).toFixed(1).replace(".",",")} km/h`}function dp(e,t){const a=e.isStageRace?`Etappe ${t.stageNumber}`:"Renntag";return`${e.name} · ${a} · ${re(t.date)}`}async function Ls(e,t){var r;const a=Ba(e);if(a&&(d.selectedResultsRaceId=a.race.id,d.selectedResultsStageId=e),d.riders.length===0){const n=await j.getRiders();n.success&&(d.riders=n.data??[])}const s=await j.getStageResults(e);if(!s.success){d.stageResults=null,Te(),!t&&s.error&&alert(`Ergebnisse konnten nicht geladen werden:
`+s.error);return}d.stageResults=s.data??null,d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId,d.selectedResultTypeId=((r=d.stageResults.classifications[0])==null?void 0:r.resultTypeId)??1,d.selectedResultsMarkerKey=We,d.selectedResultsSpecialView=null),d.selectedResultsRaceId!=null&&uo(d.selectedResultsRaceId),Te()}async function uo(e){if(!d.seasonStandings){const a=await j.getSeasonStandings();a.success&&a.data&&(d.seasonStandings=a.data)}const t=await j.getRaceResultsRoster(e);t.success&&t.data?d.resultsRoster=t.data:d.resultsRoster=null}function cp(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-300)",bg:"transparent"}}function Nn(e){return e==null?99:{1:0,2:1,3:2,4:3,5:4,6:5}[e]??99}function up(){const e=d.resultsRoster;if(!e||e.entries.length===0)return'<div class="results-roster-empty">Noch keine Teilnehmerdaten (Rennen noch nicht gestartet oder kein Starterfeld gefunden).</div>';const t=ct(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,s=[...e.entries].sort((y,v)=>v.overallRating-y.overallRating),r=new Set(s.slice(0,5).map(y=>y.riderId)),n=y=>{var T;const v=d.riders.find(w=>w.id===y);return((T=v==null?void 0:v.skills)==null?void 0:T.sprint)??0},o=[...e.entries.filter(y=>!r.has(y.riderId))].sort((y,v)=>{const T=n(y.riderId),w=n(v.riderId);return w!==T?w-T:v.overallRating-y.overallRating}),c=new Set(o.slice(0,5).map(y=>y.riderId));function l(y){switch(y){case"Berg":return"Berg";case"Hill":return"Hügel";case"Sprint":return"Sprinter";case"Cobble":return"Pflaster";case"Timetrial":return"Zeitfahrer";case"Attacker":return"Ausreißer";default:return y}}const p=new Map;for(const y of e.entries){const v=y.teamId;p.has(v)||p.set(v,{teamId:y.teamId,teamName:y.teamName,riders:[],avgRating:0}),p.get(v).riders.push(y)}for(const y of p.values())y.avgRating=y.riders.reduce((v,T)=>v+T.overallRating,0)/y.riders.length;const u=y=>{let v=Number.POSITIVE_INFINITY;for(const T of y)!T.hasDropped&&T.gcRank!=null&&T.gcRank<v&&(v=T.gcRank);return v},m=y=>{var T;if(!((T=d.seasonStandings)!=null&&T.riderStandings))return 0;let v=0;for(const w of y){const M=d.seasonStandings.riderStandings.find($=>$.riderId===w.riderId);M&&M.points>v&&(v=M.points)}return v},f=y=>{if(y==null)return 0;const v=d.riders.filter(M=>M.activeTeamId===y);if(v.length===0)return 0;const T=v.map(M=>M.overallRating??0);T.sort((M,$)=>$-M);const w=T.slice(0,10);return w.length===0?0:w.reduce((M,$)=>M+$,0)/w.length},g=[...p.values()].sort((y,v)=>{const T=u(y.riders),w=u(v.riders);if((T!==Number.POSITIVE_INFINITY||w!==Number.POSITIVE_INFINITY)&&T!==w)return T-w;const M=m(y.riders),$=m(v.riders);if((M>0||$>0)&&M!==$)return $-M;const E=f(y.teamId),R=f(v.teamId);return Math.abs(E-R)>1e-4?R-E:(y.teamName??"").localeCompare(v.teamName??"","de")});for(const y of g)y.riders.sort((v,T)=>Nn(v.roleId)-Nn(T.roleId)||T.overallRating-v.overallRating||v.lastName.localeCompare(T.lastName,"de"));return`<div class="results-roster-grid">${g.map(y=>{const v=y.teamId!=null?St(y.teamId,y.teamName):"",T=y.riders.map(M=>{var Y;const $=cp(M.roleId),E=M.countryCode?je[M.countryCode]??M.countryCode.slice(0,2).toLowerCase():null,R=E?`<span class="fi fi-${E} results-roster-flag" title="${S(M.countryCode??"")}"></span>`:'<span class="results-roster-flag-placeholder"></span>',N=`${M.firstName.charAt(0)}. ${M.lastName}`,P=M.roleName??"–",D=M.specialization1?l(M.specialization1):null,A=M.specialization2?l(M.specialization2):null;let _=P;D&&(_+=` · ${D}`),A&&(_+=` · ${A}`);const G=`<span class="results-roster-overall-badge" style="color:${mp(M.overallRating)}" title="Gesamtstärke: ${M.overallRating.toFixed(2)}">${M.overallRating.toFixed(2)}</span>`,x=M.hasDropped?" dropped":"";let L="";M.hasDropped?M.dropoutStatus==="dns"?L="DNS":M.dropoutStatus==="dnf"?L=((Y=M.dropoutReason)==null?void 0:Y.startsWith("OTL"))??!1?"OTL":"DNF":L="OUT":M.gcRank!=null&&(L=`${M.gcRank}`);let O="";if(M.hasDropped)O=`<span class="rider-stats-rank-badge" style="color: var(--danger, #ef4444); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);" title="Ausgeschieden: ${S(M.dropoutReason||"")}">${L}</span>`;else if(M.gcRank!=null){let I="rider-stats-rank-badge-gc";M.gcRank===1?I="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":M.gcRank===2?I="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":M.gcRank===3&&(I="rider-stats-rank-badge-place rider-stats-rank-badge-top-3"),O=`<span class="rider-stats-rank-badge ${I}" title="GC Stand: Platz ${M.gcRank}">${M.gcRank}</span>`}const se=`style="color: ${M.hasDropped?"var(--text-500)":$.color}; font-weight: bold;"`,Q=r.has(M.riderId),V=c.has(M.riderId);return`<div class="results-roster-rider${x}">
        <div class="results-roster-rider-info">
          <div class="results-roster-rider-top">
            ${R}
            <span class="results-roster-name${Q?" strongest-rider":V?" best-sprinter":""}">
              ${Fe(N,{riderId:M.riderId,teamId:M.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"})}
              ${Na(M.riderId)}
            </span>
          </div>
          <div class="results-roster-rider-meta">
            <span class="results-roster-role-spec" ${se}>${S(_)}</span>
          </div>
        </div>
        <div class="results-roster-rider-badges${a?"":" results-roster-rider-badges-oneday"}">
          ${a?`${O||'<span class="results-roster-gc-placeholder"></span>'}<span class="results-roster-badge-divider"></span>`:""}
          ${G}
        </div>
      </div>`}).join(""),w=y.avgRating.toFixed(1).replace(".",",");return`<div class="results-roster-team">
      <div class="results-roster-team-header">
        <div class="results-roster-jersey">${v}</div>
        <div class="results-roster-team-name" title="${S(y.teamName??"–")}">${et(y.teamName??"–",y.teamId)} <span style="font-size: 0.7rem; color: var(--text-400); font-weight: 500;">(Ø ${w})</span></div>
      </div>
      <div class="results-roster-riders${a?"":" results-roster-riders-oneday"}">${T}</div>
    </div>`}).join("")}</div>`}function mp(e){return e>=90?"#22c55e":e>=80?"#86efac":e>=70?"#fbbf24":e>=60?"#fb923c":e>=50?"#f87171":"#94a3b8"}function pp(e){var l,p;if(e.leadoutBonus==null||!(e.leadoutBonus>0)||e.leadoutRiderId==null||e.teamId==null)return"";const t=(l=d.stageResults)==null?void 0:l.classifications.find(u=>u.resultTypeId===1),a=new Set(t?t.rows.map(u=>u.riderId).filter(u=>u!=null):[]),s=d.riders.filter(u=>u.activeTeamId===e.teamId&&a.has(u.id)),r=new Set((((p=d.stageResults)==null?void 0:p.nonFinishers)??[]).map(u=>u.riderId)),n=[];for(const u of s){if(u.id===e.riderId||r.has(u.id))continue;let m=0;const f=u.skills.sprint>=72,g=u.skills.flat>=78,b=u.skills.timeTrial>=76,y=u.skills.acceleration>=80;if(f&&m++,g&&m++,b&&m++,y&&m++,m>0){let v=1;m===2?v=1.25:m===3?v=1.5:m===4&&(v=2),n.push({id:u.id,firstName:u.firstName,lastName:u.lastName,countryCode:u.nationality??null,isSprinter:f,multiplier:v,contribution:0})}}const i=e.leadoutBonus;if(n.length>0){const u=n.filter(y=>y.isSprinter).reduce((y,v)=>y+v.multiplier,0),m=n.filter(y=>!y.isSprinter).reduce((y,v)=>y+v.multiplier,0);let f=0,g=0;u>0&&m>0?(f=i/(2.125*u+m),g=2.125*f,f=Math.max(.1,Math.min(.3,f)),g=Math.max(.25,Math.min(.6,g))):u>0?(g=i/u,g=Math.max(.25,Math.min(.6,g)),f=g/2.125):m>0&&(f=i/m,f=Math.max(.1,Math.min(.3,f)),g=2.125*f);for(const y of n)y.contribution=y.isSprinter?g*y.multiplier:f*y.multiplier;const b=n.reduce((y,v)=>y+v.contribution,0);if(b>0){const y=i/b;for(const v of n)v.contribution*=y}n.sort((y,v)=>v.contribution-y.contribution)}else n.push({id:e.leadoutRiderId,firstName:"",lastName:e.leadoutRiderLastName??"Teampartner",countryCode:e.leadoutRiderCountryCode,isSprinter:!1,multiplier:1,contribution:i});const o=i.toFixed(2).replace(".",","),c=n.map(u=>{const m=tt(Ft(u.id)??u.countryCode),f=u.firstName?`${u.firstName.charAt(0)}. ${u.lastName}`:u.lastName,g=u.contribution.toFixed(2).replace(".",",");return`
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
        ${c}
      </div>
    </div>
  `}function Pn(e){const t=e.title||"";return t.includes("guten Tag")?1:t.includes("schlechten Tag")?2:t.includes("Formhöhepunkt")||t.includes("Formhoehepunkt")?3:t.includes("nicht am Start")?4:5}function Na(e){var u,m,f,g,b,y,v,T,w,M;if(e==null||!d.stageResults)return"";const t=ct(d.selectedResultsRaceId),a=(t==null?void 0:t.isStageRace)??!1,s=d.stageResults.classifications,r=(m=(u=s.find($=>$.resultTypeId===Fa))==null?void 0:u.rows.find($=>$.rank===1))==null?void 0:m.riderId,n=(g=(f=s.find($=>$.resultTypeId===xs))==null?void 0:f.rows.find($=>$.rank===1))==null?void 0:g.riderId,i=(y=(b=s.find($=>$.resultTypeId===ei))==null?void 0:b.rows.find($=>$.rank===1))==null?void 0:y.riderId,o=(T=(v=s.find($=>$.resultTypeId===5))==null?void 0:v.rows.find($=>$.rank===1))==null?void 0:T.riderId,c=(M=(w=s.find($=>$.resultTypeId===7))==null?void 0:w.rows.find($=>$.rank===1))==null?void 0:M.riderId,l=[],p=d.selectedResultTypeId;return e===r&&(p===Fa||p===1&&a||p!==1&&p!==Fa)&&l.push('<span class="jersey-dot jersey-dot-yellow" title="Gelbes Trikot (Gesamtwertung)"></span>'),e===n&&l.push('<span class="jersey-dot jersey-dot-green" title="Grünes Trikot (Punktewertung)"></span>'),e===i&&l.push('<span class="jersey-dot jersey-dot-red" title="Rotes Trikot (Bergwertung)"></span>'),e===o&&l.push('<span class="jersey-dot jersey-dot-white" title="Weißes Trikot (Nachwuchswertung)"></span>'),e===c&&l.push('<span class="jersey-dot jersey-dot-purple" title="Ausreißertrikot (Aktivste Fahrer)"></span>'),l.length===0?"":`<span class="jersey-dots-wrapper">${l.join("")}</span>`}function Ln(e){if(!e)return"";let t=e;const a=[],s=[...d.riders].sort((n,i)=>{const o=`${n.firstName} ${n.lastName}`;return`${i.firstName} ${i.lastName}`.length-o.length});for(const n of s){const o=`${n.firstName} ${n.lastName}`.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),c=new RegExp(`${o}(\\s+\\(\\d+\\.\\))?`,"g");c.test(t)&&(t=t.replace(c,l=>{const p=`__RIDER_LINK_${a.length}__`,u=Fe(l,{riderId:n.id,teamId:n.activeTeamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return a.push(u),p}))}let r=S(t);for(let n=0;n<a.length;n++)r=r.replace(`__RIDER_LINK_${n}__`,a[n]);return r}function Te(){var C,F,H,z;d.riders.length===0&&j.getRiders().then(k=>{k.success&&k.data&&(d.riders=k.data,Te())});const e=h("results-race-select"),t=h("results-stage-select"),a=h("results-type-tabs"),s=h("results-marker-tabs"),r=h("results-stage-meta"),n=h("results-empty"),i=h("results-table"),o=i.querySelector("thead tr"),c=h("results-tbody"),l=h("results-marker-classifications"),p=h("results-roster"),u=i.querySelector("colgroup");u&&u.remove(),i.style.tableLayout="",d.stageResults&&(d.selectedResultsRaceId=d.stageResults.raceId,d.selectedResultsStageId=d.stageResults.stageId),e.innerHTML='<option value="">– Rennen auswählen –</option>'+d.races.filter(k=>{var B;return(((B=k.stages)==null?void 0:B.length)??0)>0}).map(k=>`<option value="${k.id}"${k.id===d.selectedResultsRaceId?" selected":""}>${S(k.name)}</option>`).join("");const m=ct(d.selectedResultsRaceId),f=m==null?"":(m.stages??[]).map(k=>`<option value="${k.id}"${k.id===d.selectedResultsStageId?" selected":""}>${S(dp(m,k))}</option>`).join("");t.innerHTML='<option value="">– Etappe auswählen –</option>'+f;const g=((C=d.stageResults)==null?void 0:C.classifications.filter(k=>!(m&&!m.isStageRace&&k.resultTypeId!==1&&k.resultTypeId!==6)))??[],b=g.find(k=>k.resultTypeId===d.selectedResultTypeId)??g[0]??null,y=d.selectedResultsSpecialView==="nonFinishers",v=d.selectedResultsSpecialView==="events",T=d.selectedResultsSpecialView==="roster";if(b&&!y&&!v&&!T&&(d.selectedResultTypeId=b.resultTypeId),v){i.style.tableLayout="fixed";const k=document.createElement("colgroup");k.innerHTML=`
      <col style="width: 100px;">
      <col style="width: 240px;">
      <col style="width: auto;">
    `,i.insertBefore(k,i.firstChild)}if(!d.stageResults&&!T||!b&&!y&&!v&&!T){const k=Ba(d.selectedResultsStageId);r.textContent=k?`${k.race.name} · ${k.stage.profile} · ${re(k.stage.date)}`:"Noch keine Etappe ausgewählt.",a.innerHTML="",s.innerHTML="",s.classList.add("hidden"),c.innerHTML="",l.innerHTML="",l.classList.add("hidden"),i.classList.add("hidden"),p.innerHTML="",p.classList.add("hidden"),n.classList.remove("hidden"),n.textContent=d.selectedResultsStageId!=null?"Für diese Etappe liegen noch keine Ergebnisse vor.":"Noch keine Ergebnisse geladen.";return}T?d.resultsRoster&&(r.textContent=`${d.resultsRoster.raceName} · Starterfeld`):d.stageResults&&(r.textContent=`${d.stageResults.raceName} · Etappe ${d.stageResults.stageNumber} · ${d.stageResults.profile} · ${re(d.stageResults.date)}`);const w=d.stageResults?Ba(d.stageResults.stageId):null,M=(w==null?void 0:w.stage.distanceKm)??null,$=new Map,E=new Map,R=new Map;if(d.stageResults){const k=d.stageResults.classifications.find(B=>B.resultTypeId===1);if(k)for(const B of k.rows)B.riderId!=null&&B.points!=null&&B.points>0&&$.set(B.riderId,B.points),B.riderId!=null&&B.breakawayKms!=null&&B.breakawayKms>0&&R.set(B.riderId,B.breakawayKms);if(d.stageResults.markerClassifications){for(const B of d.stageResults.markerClassifications)if(ir(B.markerType,B.markerCategory)){for(const W of B.entries)if(W.riderId!=null&&W.pointsAwarded!=null&&W.pointsAwarded>0){const U=E.get(W.riderId)??0;E.set(W.riderId,U+W.pointsAwarded)}}}}const N=(b==null?void 0:b.resultTypeId)===Fa,P=(b==null?void 0:b.resultTypeId)===xs||(b==null?void 0:b.resultTypeId)===ei,D=(b==null?void 0:b.resultTypeId)===5,A=(b==null?void 0:b.resultTypeId)===6,_=(b==null?void 0:b.resultTypeId)===7,G=N||P||D||A||_,x=g.map(k=>`
    <button
      type="button"
      class="results-type-btn${!y&&!v&&!T&&k.resultTypeId===d.selectedResultTypeId?" active":""}"
      data-result-type-id="${k.resultTypeId}"
    >${S(k.resultTypeName)}</button>
  `),L=`
    <button
      type="button"
      class="results-type-btn${y?" active":""}"
      data-results-special-view="${oo}"
    >OTL/DNF</button>
  `,O=`
    <button
      type="button"
      class="results-type-btn${v?" active":""}"
      data-results-special-view="${lo}"
    >Ereignisse</button>
  `,K=`
    <button
      type="button"
      class="results-type-btn${T?" active":""}"
      data-results-special-view="${co}"
    >Teilnehmer</button>
  `,se=g.findIndex(k=>k.resultTypeName.toLocaleLowerCase("de").includes("team"));se>=0?x.splice(se+1,0,L,O,K):x.push(L,O,K),a.innerHTML=x.join("");const Q=ip(((F=d.stageResults)==null?void 0:F.markerClassifications)??[]);if(T){p.innerHTML=up(),p.classList.remove("hidden"),i.classList.add("hidden"),s.innerHTML="",s.classList.add("hidden"),l.innerHTML="",l.classList.add("hidden"),n.classList.add("hidden");return}else p.innerHTML="",p.classList.add("hidden");const V=!y&&!v&&!T&&(b==null?void 0:b.resultTypeId)===1&&Q.length>0,J=V?d.selectedResultsMarkerKey??We:null,Y=V&&J!==We?Q.find(k=>k.markerKey===J)??null:null;if(V&&(d.selectedResultsMarkerKey=(Y==null?void 0:Y.markerKey)??We),v){const k=[{key:"all",label:"Alle"},{key:"form",label:"Tagesform"},{key:"attack",label:"Attacken"},{key:"breakaway",label:"Fluchtgruppe"},{key:"incident",label:"Stürze/Defekte"},{key:"exit",label:"Ausgeschieden"},{key:"home",label:"Heimvorteil"},{key:"weather",label:"Wetter"},{key:"superteam",label:"Superteam"}];s.innerHTML=k.map(B=>`
      <button
        type="button"
        class="results-type-btn${B.key===Re?" active":""}"
        data-event-filter="${B.key}"
      >${S(B.label)}</button>
    `).join("")}else s.innerHTML=V?[`
        <button
          type="button"
          class="results-type-btn${d.selectedResultsMarkerKey===We?" active":""}"
          data-marker-key="${We}"
        >Tageswertung</button>`,...Q.map(k=>`
        <button
          type="button"
          class="results-type-btn${k.markerKey===d.selectedResultsMarkerKey?" active":""}"
          data-marker-key="${k.markerKey}"
        >${S(op(k))}</button>
      `)].join(""):"";s.classList.toggle("hidden",!v&&!V);const I=y||v||!V||d.selectedResultsMarkerKey===We;if(o&&I&&(o.innerHTML=y?`
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
      `:N?`
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
        `:_?`
          <th>Platz</th>
          <th>Trend</th>
          <th class="results-jersey-col">Trikot</th>
          <th>Fahrer / Team</th>
          <th class="results-flag-col">Flagge</th>
          <th>Team</th>
          <th class="results-points-cell">Kilometer</th>
          <th>UCI Punkte</th>
        `:A?`
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
      `),c.innerHTML=y?(((H=d.stageResults)==null?void 0:H.nonFinishers)??[]).map(k=>`
      <tr>
        <td>${k.stageNumber}</td>
        <td>${Xo(k.isOtl)}</td>
        <td class="results-jersey-col-cell">${jt(k.teamId,k.teamName)}</td>
        <td>${Ot(k.riderName,!0,!1,k.riderId,k.teamId)}</td>
        <td class="results-flag-col-cell">${tt(k.countryCode)}</td>
        <td>${et(k.teamName||"–",k.teamId)}</td>
        <td>${S(ws(k.statusReason,k.isOtl))}</td>
      </tr>
    `).join("")||'<tr><td colspan="7" class="results-empty-cell">Keine OTL/DNF bis zu dieser Etappe.</td></tr>':v?[...((z=d.stageResults)==null?void 0:z.events)??[]].filter(k=>Re==="all"?!0:Re==="form"?!!(k.title&&(k.title.includes("guten Tag")||k.title.includes("schlechten Tag")||k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))):Re==="attack"?(k.type==="attack"||k.type==="counter_attack")&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Re==="breakaway"?!!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Re==="incident"?(k.type==="incident"||!!(k.title&&k.title.includes("Massensturz")))&&!(k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))):Re==="exit"?k.type==="dnf"||!!(k.title&&k.title.includes("nicht am Start")):Re==="home"?!!(k.title&&(k.title.includes("Heimvorteil")||k.title.includes("Heimdruck"))):Re==="weather"?!!(k.title&&k.title.startsWith("Wetterbericht:")):Re==="superteam"?k.type==="superteam":!0).sort((k,B)=>{const W=k.kmMark??0,U=B.kmMark??0;if(Math.abs(W-U)>1e-4)return W-U;if(W===0){const Ie=Pn(k),ke=Pn(B);if(Ie!==ke)return Ie-ke}const pe=k.riderName??"",Se=B.riderName??"";return pe.localeCompare(Se,"de")}).map(k=>{var Tr,Mr,xr;const B=k.kmMark!=null?`${k.kmMark.toFixed(1).replace(".",",")} km`:"0,0 km",W=k.riderId,U=W!=null?$e(W):null,pe=k.riderTeamId??(U==null?void 0:U.activeTeamId)??null,Se=pe!=null?((Tr=d.teams.find(pa=>pa.id===pe))==null?void 0:Tr.name)??null:null;let Ie=jt(pe,Se);const ke=!!(k.title&&k.title.startsWith("Wetterbericht:"));let qe=k.title||"";if(ke){const pa=(Mr=d.stageResults)==null?void 0:Mr.rolledWeatherId,ls=(xr=d.stageResults)==null?void 0:xr.rolledWetterName;Ie=`<span class="results-jersey-cell">${ar(pa,ls)}</span>`,ls&&(qe=`Wetterbericht: ${ls}`)}const Ht=k.type==="superteam",Ge=Ht&&W==null,zt=ke||Ge?"":tt(W!=null?Ft(W):null),ma=ke?"":Ge?et(Se||"–",pe):W!=null?Ot(k.riderName??"",!0,!1,W,pe):S(k.riderName||"–");let me="";return k.title&&k.title.includes("guten Tag")?me='<span class="event-badge event-badge-superform"><span class="event-icon">▲</span> Guten Tag</span>':k.title&&k.title.includes("schlechten Tag")?me='<span class="event-badge event-badge-supermalus"><span class="event-icon">▼</span> Schlechten Tag</span>':k.title&&(k.title.includes("Formhöhepunkt")||k.title.includes("Formhoehepunkt"))?me='<span class="event-badge event-badge-peak"><span class="event-icon">★</span> Formhöhepunkt</span>':k.title&&k.title.includes("nicht am Start")?me='<span class="event-badge event-badge-dns">DNS</span>':k.title&&k.title.includes("Massensturz")?me='<span class="event-badge event-badge-masscrash">Massensturz</span>':k.type==="dnf"?me='<span class="event-badge event-badge-dnf">DNF</span>':k.title&&(k.title.toLowerCase().includes("ausreiß")||k.title.toLowerCase().includes("ausreiss"))?me='<span class="event-badge event-badge-breakaway">Fluchtgruppe</span>':k.type==="attack"?me='<span class="event-badge event-badge-attack">Attacke</span>':k.type==="counter_attack"?me='<span class="event-badge event-badge-counter">Konterattacke</span>':k.type==="incident"?k.title&&(k.title.toLowerCase().includes("defekt")||k.title.toLowerCase().includes("panne")||k.title.toLowerCase().includes("technisch"))?me='<span class="event-badge event-badge-defect">Defekt</span>':me='<span class="event-badge event-badge-crash">Sturz</span>':k.title&&k.title.includes("Super-Heimvorteil")?me='<span class="event-badge event-badge-superhome"><span class="event-icon">♥</span> Heimbonus</span>':k.title&&k.title.includes("Heimdruck")?me='<span class="event-badge event-badge-homepressure"><span class="event-icon">♦</span> Heimmalus</span>':k.title&&k.title.includes("Heimvorteil")?me='<span class="event-badge event-badge-normalhome"><span class="event-icon">♥</span> Heimvorteil</span>':k.title&&k.title.startsWith("Wetterbericht:")?me='<span class="event-badge event-badge-weather"><span class="event-icon">🌤️</span> Wetter</span>':Ht&&(me='<span class="event-badge event-badge-superteam"><span class="event-icon">⚡</span> Superteam</span>'),`
          <tr>
            <td>${B}</td>
            <td>
              <div class="event-rider-info">
                ${Ie}
                ${zt}
                ${ma}
              </div>
            </td>
            <td>
              <div class="event-content">
                <div class="event-title-wrapper">
                  <span class="event-title">${Ln(qe)}</span>
                  ${me}
                </div>
                ${k.detail?`<div class="event-detail">${Ln(k.detail)}</div>`:""}
              </div>
            </td>
          </tr>`}).join("")||'<tr><td colspan="3" class="results-empty-cell">Keine Ereignisse für diese Etappe.</td></tr>':I&&b?b.rows.map(k=>{const B=k.riderName??k.teamName,W=k.riderName?k.teamName:"–",U=jt(k.teamId,k.teamName),pe=Ot(B,!0,k.isBreakaway===!0,k.riderId,k.teamId),Se=tt(Ft(k.riderId)),Ie=b.resultTypeId===1&&k.rank===1&&k.timeSeconds!=null&&M!=null,ke=k.timeSeconds!=null?`${Aa(k.timeSeconds)}${Ie?` (${lp(M,k.timeSeconds)})`:""}`:"–",qe=G?`<td class="results-gc-delta-cell">${Qo(k.previousRank,k.rankDelta)}</td>`:"";if(P){let Ge=k.points!=null?String(k.points):"–";if(k.points!=null&&k.riderId!=null&&b){const ma=b.resultTypeId===xs?$.get(k.riderId)??0:E.get(k.riderId)??0;ma>0&&(Ge+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${ma}</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${qe}
            <td class="results-jersey-col-cell">${U}</td>
            <td>${pe}${Na(k.riderId)}</td>
            <td class="results-flag-col-cell">${Se}</td>
            <td>${et(W,k.teamId)}</td>
            <td class="results-points-cell">${Ge}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(_){let Ge=k.breakawayKms!=null?`${k.breakawayKms.toFixed(1).replace(".",",")} km`:"–";if(k.breakawayKms!=null&&k.riderId!=null){const zt=R.get(k.riderId)??0;zt>0&&(Ge+=` <span style="font-size: 0.67em; color: var(--success, #22c55e); font-weight: bold; margin-left: 2px;">+${zt.toFixed(1).replace(".",",")} km</span>`)}return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${qe}
            <td class="results-jersey-col-cell">${U}</td>
            <td>${pe}${Na(k.riderId)}</td>
            <td class="results-flag-col-cell">${Se}</td>
            <td>${et(W,k.teamId)}</td>
            <td class="results-points-cell">${Ge}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`}if(A)return`
          <tr>
            <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
            ${qe}
            <td class="results-jersey-col-cell">${U}</td>
            <td>${et(k.teamName,k.teamId)}</td>
            <td class="results-flag-col-cell">${Se}</td>
            <td>${ke}</td>
            <td>${S(ds(k.gapSeconds))}</td>
            <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
          </tr>`;let Ht=k.points!=null?String(k.points):"–";if(k.leadoutBonus!=null&&k.leadoutBonus>0&&k.leadoutRiderId!=null){const Ge=pp(k);Ht=`
          <div class="leadout-bonus-anchor">
            ${k.points!=null?k.points:"–"}
            ${Ge}
          </div>
        `}return`
        <tr>
          <td class="pos-${Math.min(k.rank,3)}">${k.rank}</td>
          ${qe}
          <td class="results-jersey-col-cell">${U}</td>
          <td>${pe}${Na(k.riderId)}</td>
          <td class="results-flag-col-cell">${Se}</td>
          <td>${et(W,k.teamId)}</td>
          <td>${ke}</td>
          <td>${S(ds(k.gapSeconds))}</td>
          <td class="results-points-cell">${Ht}</td>
          <td>${k.uciPoints!=null?k.uciPoints:"–"}</td>
        </tr>`}).join(""):"",n.classList.toggle("hidden",!!b||y||v||T),i.classList.toggle("hidden",!I||T),Y){const k=`
      <section class="results-marker-card">
        <div class="results-results-view-marker-card-head">
          <h4>${S(el(Y.markerType,Y.markerLabel))}</h4>
          <div class="results-marker-card-meta">${S(`${Y.kmMark.toFixed(1).replace(".",",")} km${Y.markerCategory?` · Kat. ${Y.markerCategory}`:""}`)}</div>
        </div>
      </section>`,B=Y.entries.map(W=>{var Ie;const U=$e(W.riderId),pe=U?`${U.firstName} ${U.lastName}`:`Fahrer ${W.riderId}`,Se=(U==null?void 0:U.activeTeamId)!=null?((Ie=d.teams.find(ke=>ke.id===U.activeTeamId))==null?void 0:Ie.name)??null:null;return`
        <div class="results-marker-row">
          <div class="results-marker-rank">${W.rank}.</div>
          <div class="results-marker-jersey">${jt(U==null?void 0:U.activeTeamId,Se)}</div>
          <div class="results-marker-name">${Ot(pe,!1,!1,(U==null?void 0:U.id)??null,(U==null?void 0:U.activeTeamId)??null)}</div>
          <div class="results-marker-flag">${tt(Ft(U==null?void 0:U.id))}</div>
          <div class="results-marker-time">${S(Aa(W.crossingTimeSeconds))}</div>
          <div class="results-marker-gap">${S(ds(W.gapSeconds))}</div>
          <div class="results-marker-points">${W.pointsAwarded!=null&&W.pointsAwarded>0?W.pointsAwarded:"–"}</div>
        </div>`}).join("");l.innerHTML=`${k}<div class="results-marker-list">${B}</div>`}else l.innerHTML="";l.classList.toggle("hidden",!Y)}function gp(){h("results-race-select").addEventListener("change",e=>{var s,r;const t=e.target.value;d.selectedResultsRaceId=t?Number(t):null;const a=ct(d.selectedResultsRaceId);d.selectedResultsStageId=((r=(s=a==null?void 0:a.stages)==null?void 0:s[0])==null?void 0:r.id)??null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=We,d.selectedResultsSpecialView=null,d.stageResults=null,Te(),d.selectedResultsStageId!=null&&Ls(d.selectedResultsStageId,!0)}),h("results-stage-select").addEventListener("change",e=>{const t=e.target.value;d.selectedResultsStageId=t?Number(t):null,d.selectedResultTypeId=1,d.selectedResultsMarkerKey=We,d.selectedResultsSpecialView=null,d.stageResults=null,Te(),d.selectedResultsStageId!=null&&Ls(d.selectedResultsStageId,!0)}),h("results-type-tabs").addEventListener("click",e=>{var s;const t=e.target.closest("button[data-result-type-id]");if(t){d.selectedResultsSpecialView=null,d.selectedResultTypeId=Number(t.dataset.resultTypeId),Te();return}const a=e.target.closest("button[data-results-special-view]");if(a){const r=a.dataset.resultsSpecialView;r===oo?(d.selectedResultsSpecialView="nonFinishers",Te()):r===lo?(d.selectedResultsSpecialView="events",Re="all",Te()):r===co&&(d.selectedResultsSpecialView="roster",d.selectedResultsRaceId!=null&&((s=d.resultsRoster)==null?void 0:s.raceId)!==d.selectedResultsRaceId&&uo(d.selectedResultsRaceId).then(()=>Te()),Te())}}),h("results-marker-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-marker-key]");if(t){const s=t.dataset.markerKey;d.selectedResultsMarkerKey=s??We,Te();return}const a=e.target.closest("button[data-event-filter]");a&&(Re=a.dataset.eventFilter??"all",Te())})}const or=[{key:"flat",label:"Fl"},{key:"mountain",label:"Berg"},{key:"mediumMountain",label:"MB"},{key:"hill",label:"Hgl"},{key:"timeTrial",label:"ZF"},{key:"prologue",label:"Pro"},{key:"cobble",label:"Pf"},{key:"sprint",label:"Spr"},{key:"acceleration",label:"Acc"},{key:"downhill",label:"Abf"},{key:"attack",label:"Atk"},{key:"stamina",label:"Sta"},{key:"resistance",label:"Res"},{key:"recuperation",label:"Rec"},{key:"bikeHandling",label:"Ftg"}],da=["skills","form","profile","preferences"],lr=[{id:"name",label:"Name",title:"Name - Nachname, Vorname",sortKey:"name",className:"team-table-col-name"},{id:"country",label:"Country",title:"Country - Flagge und 3er-Code",sortKey:"countryCode",className:"team-table-col-country"},{id:"age",label:"Alt",title:"Alter",sortKey:"age",className:"team-table-col-age"},{id:"roleName",label:"Rolle",title:"Teamrolle des Fahrers",sortKey:"roleName",className:"team-table-col-role"}],dr={skills:[{id:"overallRating",label:"Ges",title:"Gesamtstärke",sortKey:"overallRating",className:"team-table-col-overall"},{id:"potOverall",label:"Pot",title:"Potenzial",sortKey:"potOverall",className:"team-table-col-pot"},...or.map(e=>({id:`skill-${e.key}`,label:e.label,title:e.label,sortKey:e.key,className:"team-table-col-skill"}))],form:[{id:"birthYear",label:"Jg",title:"Geburtsjahr",sortKey:"birthYear",className:"team-table-col-year"},{id:"contractEndSeason",label:"V-Ende",title:"Vertragsende - Ende des aktiven Vertrags",sortKey:"contractEndSeason",className:"team-table-col-contract"},{id:"formBonus",label:"S-Form",title:"Saisonformbonus",sortKey:"formBonus",className:"team-table-col-points"},{id:"raceFormBonus",label:"R-Form",title:"Rennbonus aus saisonalem Formfenster",sortKey:"raceFormBonus",className:"team-table-col-points"},{id:"averageForm",label:"Ø Form",title:"Durchschnittliche Rennform (S-Form + R-Form)",sortKey:"averageForm",className:"team-table-col-points"},{id:"longTermFatigueMalus",label:"L-Ersch",title:"Langzeit-Erschöpfung ab dem 50. Saisonrenntag",sortKey:"longTermFatigueMalus",className:"team-table-col-points"},{id:"shortTermFatigueMalus",label:"Akut",title:"Akuter Verschleiß im rollenden 30-Tage-Fenster",sortKey:"shortTermFatigueMalus",className:"team-table-col-points"},{id:"seasonFormPhase",label:"Phase",title:"Formphase",sortKey:"seasonFormPhase",className:"team-table-col-phase"},{id:"seasonPoints",label:"Pkt",title:"Saisonpunkte - kumulierte Punkte der aktuellen Saison",sortKey:"seasonPoints",className:"team-table-col-points"},{id:"seasonRaceDays",label:"Renntage",title:"Renntage in der laufenden Saison",sortKey:"seasonRaceDays",className:"team-table-col-points"},{id:"seasonWins",label:"Siege",title:"Siege in der laufenden Saison",sortKey:"seasonWins",className:"team-table-col-points"}],profile:[{id:"peak1",label:"Peak 1",title:"Erster Formhöhepunkt",sortKey:"peak1",className:"team-table-col-date"},{id:"peak2",label:"Peak 2",title:"Zweiter Formhöhepunkt",sortKey:"peak2",className:"team-table-col-date"},{id:"peak3",label:"Peak 3",title:"Dritter Formhöhepunkt",sortKey:"peak3",className:"team-table-col-date"},{id:"riderType",label:"Typ",title:"Fahrertyp (Spezialisierungen)",sortKey:"riderType",className:"team-table-col-profile"},{id:"specialization1",label:"Spec1",title:"Spezialisierung 1",sortKey:"specialization1",className:"team-table-col-profile"},{id:"specialization2",label:"Spec2",title:"Spezialisierung 2",sortKey:"specialization2",className:"team-table-col-profile"},{id:"specialization3",label:"Spec3",title:"Spezialisierung 3",sortKey:"specialization3",className:"team-table-col-profile"},{id:"skillDevelopment",label:"Entw.",title:"Skill Development",sortKey:"skillDevelopment",className:"team-table-col-points"}],preferences:[{id:"seasonProgram",label:"Programm",title:"Saisonprogramm",className:"team-table-col-program"},{id:"mentorName",label:"Mentor",title:"Entwicklungs-Mentor im Team",sortKey:"mentorName",className:"team-table-col-mentor"},{id:"favoriteRaces",label:"Lieblingsrennen",title:"Lieblingsrennen",className:"team-table-col-preferences"},{id:"nonFavoriteRaces",label:"Nicht bevorzugt",title:"Nicht bevorzugte Rennen",className:"team-table-col-preferences"}]};function cr(){return[...lr,...dr[d.teamDetailPage]]}function mo(e,t=12){const a=d.riders.filter(r=>r.activeTeamId===e).sort((r,n)=>n.overallRating-r.overallRating).slice(0,t);return a.length===0?null:a.reduce((r,n)=>r+n.overallRating,0)/a.length}function po(e){const t=d.riders.filter(s=>s.activeTeamId===e);return t.length===0?null:t.reduce((s,r)=>s+r.overallRating,0)/t.length}function go(e){const t=mo(e);return t==null?"–":t.toFixed(1).replace(".",",")}function fo(e){const t=po(e);return t==null?"–":t.toFixed(1).replace(".",",")}function ae(e,t){return e.localeCompare(t,"de",{sensitivity:"base"})}function Me(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:ae(e,t)}function ge(e,t){var a;return(a=e.seasonFormPeakDates)==null?void 0:a[t]}function xe(e){return e==null?void 0:typeof e=="string"?Zt(e):e.name}function ur(e){return["birthYear","age","overallRating","potOverall","formBonus","raceFormBonus","seasonFormPhase","seasonPoints","seasonRaceDays","seasonWins","skillDevelopment",...or.map(t=>t.key)].includes(e)?"desc":"asc"}function ho(e){return d.teamTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.teamTableSort.direction==="asc"?"↑":"↓"}</span>`}function bo(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.teamTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-team-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${ho(e.sortKey)}
      </button>
    </th>`}function yo(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${da.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.teamDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.teamDetailPage===e?"true":"false"}"
            data-team-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}const vo={flat:"Flach",mountain:"Berg",mediumMountain:"Mittlere Berge",hill:"Hügel",timeTrial:"Zeitfahren",prologue:"Prolog",cobble:"Pflaster",sprint:"Sprint",acceleration:"Antritt",downhill:"Abfahrt",attack:"Attacke",stamina:"Stamina",resistance:"Widerstand",recuperation:"Regeneration",bikeHandling:"Fahrtechnik"};function mr(e){return e==="name"?"Name":e==="countryCode"?"Herkunft":e==="birthYear"?"Geburtsjahr":e==="age"?"Alter":e==="overallRating"?"Stärke":e==="potOverall"?"Potenzial":e==="formBonus"?"Saisonform":e==="raceFormBonus"?"Rennform":e==="averageForm"?"Average Form":e==="longTermFatigueMalus"?"Langzeiterschöpfung":e==="shortTermFatigueMalus"?"Akute Erschöpfung":e==="seasonPoints"?"Saisonpunkte":e==="seasonRaceDays"?"Renntage":e==="seasonWins"?"Siege":e==="contractEndSeason"?"Vertragsende":e==="seasonFormPhase"?"Formphase":e==="roleName"?"Teamrolle":e==="riderType"?"Fahrertyp":e==="specialization1"?"Spec 1":e==="specialization2"?"Spec 2":e==="specialization3"?"Spec 3":e==="skillDevelopment"?"Entwicklung":e==="mentorName"?"Mentor":e==="peak1"?"Peak 1":e==="peak2"?"Peak 2":e==="peak3"?"Peak 3":vo[e]??String(e)}function So(e){const t=[...e],a=d.teamTableSort.direction==="asc"?1:-1;return t.sort((s,r)=>{let n=0;switch(d.teamTableSort.key){case"name":n=ae(s.lastName,r.lastName)||ae(s.firstName,r.firstName);break;case"countryCode":n=ae(kt(s),kt(r));break;case"birthYear":n=s.birthYear-r.birthYear;break;case"age":n=(s.age??0)-(r.age??0);break;case"overallRating":n=s.overallRating-r.overallRating;break;case"potOverall":n=(s.potential??0)-(r.potential??0);break;case"formBonus":n=(s.formBonus??0)-(r.formBonus??0);break;case"raceFormBonus":n=(s.raceFormBonus??0)-(r.raceFormBonus??0);break;case"longTermFatigueMalus":n=(s.longTermFatigueMalus??0)-(r.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(s.shortTermFatigueMalus??0)-(r.shortTermFatigueMalus??0);break;case"seasonPoints":n=(s.seasonPoints??0)-(r.seasonPoints??0);break;case"seasonRaceDays":n=(s.seasonRaceDays??0)-(r.seasonRaceDays??0);break;case"seasonWins":n=(s.seasonWins??0)-(r.seasonWins??0);break;case"contractEndSeason":n=(s.contractEndSeason??Number.MAX_SAFE_INTEGER)-(r.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=ae(s.seasonFormPhase??"neutral",r.seasonFormPhase??"neutral");break;case"roleName":n=ae(dt(s),dt(r));break;case"riderType":n=ae(s.riderType,r.riderType)||ae(Ce(s),Ce(r));break;case"skillDevelopment":n=(s.skillDevelopment??0)-(r.skillDevelopment??0);break;case"specialization1":n=Me(xe(s.specialization1),xe(r.specialization1));break;case"specialization2":n=Me(xe(s.specialization2),xe(r.specialization2));break;case"specialization3":n=Me(xe(s.specialization3),xe(r.specialization3));break;case"peak1":n=Me(ge(s,0),ge(r,0));break;case"peak2":n=Me(ge(s,1),ge(r,1));break;case"peak3":n=Me(ge(s,2),ge(r,2));break;default:n=s.skills[d.teamTableSort.key]-r.skills[d.teamTableSort.key];break}return n===0&&(n=ae(s.lastName,r.lastName)||ae(s.firstName,r.firstName)),n*a}),t}function ko(e){const t=[...e],a=d.riderMenuTableSort.direction==="asc"?1:-1;return t.sort((s,r)=>{let n=0;switch(d.riderMenuTableSort.key){case"name":n=ae(s.lastName,r.lastName)||ae(s.firstName,r.firstName);break;case"countryCode":n=ae(kt(s),kt(r));break;case"birthYear":n=s.birthYear-r.birthYear;break;case"age":n=(s.age??0)-(r.age??0);break;case"overallRating":n=s.overallRating-r.overallRating;break;case"potOverall":n=(s.potential??0)-(r.potential??0);break;case"formBonus":n=(s.formBonus??0)-(r.formBonus??0);break;case"raceFormBonus":n=(s.raceFormBonus??0)-(r.raceFormBonus??0);break;case"longTermFatigueMalus":n=(s.longTermFatigueMalus??0)-(r.longTermFatigueMalus??0);break;case"shortTermFatigueMalus":n=(s.shortTermFatigueMalus??0)-(r.shortTermFatigueMalus??0);break;case"seasonPoints":n=(s.seasonPoints??0)-(r.seasonPoints??0);break;case"seasonRaceDays":n=(s.seasonRaceDays??0)-(r.seasonRaceDays??0);break;case"seasonWins":n=(s.seasonWins??0)-(r.seasonWins??0);break;case"contractEndSeason":n=(s.contractEndSeason??Number.MAX_SAFE_INTEGER)-(r.contractEndSeason??Number.MAX_SAFE_INTEGER);break;case"seasonFormPhase":n=ae(s.seasonFormPhase??"neutral",r.seasonFormPhase??"neutral");break;case"roleName":n=ae(dt(s),dt(r));break;case"riderType":n=ae(s.riderType,r.riderType)||ae(Ce(s),Ce(r));break;case"skillDevelopment":n=(s.skillDevelopment??0)-(r.skillDevelopment??0);break;case"specialization1":n=Me(xe(s.specialization1),xe(r.specialization1));break;case"specialization2":n=Me(xe(s.specialization2),xe(r.specialization2));break;case"specialization3":n=Me(xe(s.specialization3),xe(r.specialization3));break;case"peak1":n=Me(ge(s,0),ge(r,0));break;case"peak2":n=Me(ge(s,1),ge(r,1));break;case"peak3":n=Me(ge(s,2),ge(r,2));break;default:n=s.skills[d.riderMenuTableSort.key]-r.skills[d.riderMenuTableSort.key];break}return n===0&&(n=ae(s.lastName,r.lastName)||ae(s.firstName,r.firstName)),n*a}),t}function Ds(e){return e.length===0?"–":e.map(t=>{const a=d.races.find(s=>s.id===t);return a?S(a.name):`Rennen ${t}`}).join(", ")}function fp(e){const t=e.seasonFormPeakDates??[];return t.length===0?"–":t.join(" · ")}function pr(e,t){var a,s;switch(t.id){case"name":return`<td class="team-table-name-cell">${Fe(Ce(e),{riderId:e.id,teamId:e.activeTeamId,strong:d.teamDetailPage==="form"||d.teamDetailPage==="profile"||d.teamDetailPage==="preferences"})}${ol(e)}</td>`;case"country":return`<td><span class="team-table-country-cell">${ie(kt(e))}<span>${S(kt(e))}</span></span></td>`;case"age":return`<td>${e.age??(d.gameState?d.gameState.season-e.birthYear:"–")}</td>`;case"roleName":return`<td class="team-table-wrap-cell">${S(dt(e))}</td>`;case"overallRating":return`<td><span style="font-weight:bold">${e.overallRating}</span></td>`;case"potOverall":return`<td>${e.potential!=null?e.potential.toFixed(2):"-"}</td>`;case"birthYear":return`<td>${e.birthYear}</td>`;case"contractEndSeason":return`<td>${e.contractEndSeason!=null?e.contractEndSeason:"–"}</td>`;case"formBonus":return`<td>${Cr(e.formBonus)}</td>`;case"raceFormBonus":return`<td>${nl(e.raceFormBonus)}</td>`;case"averageForm":return`<td>${Cr((e.formBonus??0)+(e.raceFormBonus??0))}</td>`;case"longTermFatigueMalus":return`<td>${Nr(e.longTermFatigueMalus,"none","Langzeit-Fatigue")}</td>`;case"shortTermFatigueMalus":return`<td>${Nr(e.shortTermFatigueMalus,e.shortTermFatigueWarning,"Kurzzeit-Fatigue")}</td>`;case"seasonFormPhase":return`<td>${ii(e)}</td>`;case"seasonPoints":return`<td>${e.seasonPoints??0}</td>`;case"seasonRaceDays":return`<td>${e.seasonRaceDays??0}</td>`;case"seasonWins":return`<td>${e.seasonWins??0}</td>`;case"peak1":return`<td class="team-table-wrap-cell">${S(ge(e,0)??"–")}</td>`;case"peak2":return`<td class="team-table-wrap-cell">${S(ge(e,1)??"–")}</td>`;case"peak3":return`<td class="team-table-wrap-cell">${S(ge(e,2)??"–")}</td>`;case"riderType":return`<td class="team-table-wrap-cell">${S(e.riderType??"–")}</td>`;case"specialization1":return`<td class="team-table-wrap-cell">${e.specialization1?S(Zt(e.specialization1)):"–"}</td>`;case"specialization2":return`<td class="team-table-wrap-cell">${e.specialization2?S(Zt(e.specialization2)):"–"}</td>`;case"specialization3":return`<td class="team-table-wrap-cell">${e.specialization3?S(Zt(e.specialization3)):"–"}</td>`;case"skillDevelopment":return`<td>${e.skillDevelopment!=null&&e.skillDevelopment>0?`<span class="race-sim-form-positive">+${e.skillDevelopment}</span>`:"–"}</td>`;case"seasonProgram":return`<td>${il(e)}</td>`;case"mentorName":return e.mentorName?`<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${ie(e.mentorCountryCode??"UNK")} <span>${S(e.mentorName)} (${e.mentorAge??"?"})</span></div></td>`:"<td>–</td>";case"favoriteRaces":return`<td class="team-table-wrap-cell">${Ds(e.favoriteRaces??[])}</td>`;case"nonFavoriteRaces":return`<td class="team-table-wrap-cell">${Ds(e.nonFavoriteRaces??[])}</td>`;default:{if(t.id.startsWith("skill-")){const r=t.sortKey;return r&&r in e.skills?`<td>${rl(e.skills[r],(a=e.yearStartSkills)==null?void 0:a[r],(s=e.potentials)==null?void 0:s[r])}</td>`:"<td>-</td>"}return"<td>–</td>"}}}async function Za(){ve("Teams/Fahrer werden aktualisiert...");try{const e=await j.getRiders();if(e.success&&(d.riders=e.data??[]),await j.getTeams().then(t=>{t.success&&(d.teams=t.data??[])}),ye("teams")&&gr(),ye("riders")){const{renderRidersMenu:t}=await li(async()=>{const{renderRidersMenu:a}=await Promise.resolve().then(()=>Gp);return{renderRidersMenu:a}},void 0);t()}}finally{fe()}}async function hp(e={}){const t=await j.getTeams();if(!t.success){console.error("loadTeams Fehler:",t.error),h("teams-detail").innerHTML=`<p class="error-msg">Teams konnten nicht geladen werden: ${S(t.error??"Unbekannt")}</p>`;return}d.teams=t.data??[],e.render!==!1&&ye("teams")&&gr()}function gr(){const e=h("teams-dropdown"),t=e.value;e.innerHTML='<option value="">– Team auswählen –</option>'+d.teams.map(s=>`<option value="${s.id}"${String(s.id)===t?" selected":""}>${S(s.name)} (${S(s.division??s.divisionName??"")}) · ${S(s.abbreviation)}</option>`).join("");const a=t?Number(t):null;Qt(a)}function Qt(e){const t=h("teams-detail");if(e===null){t.innerHTML='<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';return}const a=d.teams.find(i=>i.id===e);if(!a){t.innerHTML="";return}const s=So(d.riders.filter(i=>i.activeTeamId===e)),r=a.division==="U23"?"badge-u23":"badge-classics",n=cr();t.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${S(a.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${r}">${S(a.division??a.divisionName??"")}</span>
          <span>${tl(a.country,a.countryCode)}</span>
          <span>Kürzel: ${S(a.abbreviation)} · Top 12 ${S(go(a.id))} (${S(fo(a.id))})</span>
          ${a.isPlayerTeam?'<span class="badge badge-live">Spielerteam</span>':""}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${s.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(mr(d.teamTableSort.key))} ${d.teamTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${yo()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${n.map(bo).join("")}
          </tr></thead>
          <tbody>
            ${s.length===0?`<tr><td colspan="${n.length}" class="text-muted">Keine Fahrer.</td></tr>`:s.map(i=>`
                <tr class="team-detail-row">
                  ${n.map(o=>pr(i,o)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function $o(){h("teams-dropdown").addEventListener("change",e=>{const t=e.target.value;d.teamDetailPage="skills",Qt(t?Number(t):null)}),h("teams-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const r=Number(t.dataset.riderProgramId);Number.isFinite(r)&&yr(r);return}const a=e.target.closest("button[data-team-detail-page]");if(a){const r=a.dataset.teamDetailPage;if(da.includes(r)){d.teamDetailPage=r,new Set(cr().map(o=>o.sortKey).filter(o=>o!=null)).has(d.teamTableSort.key)||(d.teamTableSort={key:"name",direction:"asc"});const i=Number(h("teams-dropdown").value);Qt(Number.isFinite(i)?i:null)}return}const s=e.target.closest("button[data-team-sort]");if(s){const r=s.dataset.teamSort;d.teamTableSort.key===r?d.teamTableSort.direction=d.teamTableSort.direction==="asc"?"desc":"asc":d.teamTableSort={key:r,direction:ur(r)};const n=Number(h("teams-dropdown").value);Qt(Number.isFinite(n)?n:null);return}})}const bp=Object.freeze(Object.defineProperty({__proto__:null,TEAM_DETAIL_PAGE_COLUMNS:dr,TEAM_DETAIL_PAGE_ORDER:da,TEAM_SKILL_COLUMNS:or,TEAM_SKILL_TITLES:vo,TEAM_TABLE_COLUMNS:lr,compareOptionalStrings:Me,compareStrings:ae,formatTeamAverage:fo,formatTeamTopAverage:go,getActiveTeamTableColumns:cr,getDefaultTeamSortDirection:ur,getPeakDate:ge,getSortIndicator:ho,getSpecializationSortLabel:xe,getTeamAverage:po,getTeamSortLabel:mr,getTeamTopAverage:mo,initTeamsListeners:$o,loadTeams:hp,refreshTeamsViewData:Za,renderPeakDatesSummary:fp,renderRacePrefs:Ds,renderTeamDetail:Qt,renderTeamDetailPageTabs:yo,renderTeamTableCell:pr,renderTeamTableHeader:bo,renderTeams:gr,sortRiderMenuRiders:ko,sortTeamRiders:So},Symbol.toStringTag,{value:"Module"}));function yp(e,t,a){return`${e} · Etappe ${t} · ${a}`}function To(e,t){return e.riders.map(a=>({riderId:a.riderId,finishTimeSeconds:t.stage.profile==="ITT"||t.stage.profile==="TTT"?a.riderClockSeconds:a.finishTimeSeconds,finishStatus:a.finishStatus??"finished",isBreakaway:a.isBreakaway,statusReason:a.statusReason??null,photoFinishScore:a.photoFinishScore,leadoutRiderId:a.leadoutRiderId,leadoutBonus:a.leadoutBonus})).filter(a=>a.finishStatus==="dnf"||a.finishTimeSeconds!=null)}function Mo(e,t){const a=[];for(const s of e.riders)if(s.leadoutBonus!=null&&s.leadoutBonus>0&&s.leadoutContributions&&s.leadoutContributions.length>0){const r=t.riders.find(i=>i.id===s.riderId),n=(r==null?void 0:r.activeTeamId)??null;n!=null&&a.push({teamId:n,sprinterId:s.riderId,leadoutBonus:s.leadoutBonus,contributorsJson:JSON.stringify(s.leadoutContributions)})}return a}async function xo(e,t=!1){if(Xn!=null||zs)return!1;Ir(e),sl(0);try{const a=await j.getRealtimeSimulation(e);if(!a.success||!a.data)return alert(`Instant-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler")),!1;const s=a.data;d.realtimeBootstrap=s;const r=await ic(s,o=>si(o)),n=To(r,s),i=Mo(r,s);return await Co(e,n,r.markerClassifications,r.incidents,r.allEvents,t,i,r.superTeamId),!0}catch(a){return alert("Unerwarteter Fehler bei der Instant-Simulation: "+a.message),!1}finally{Ir(null),fe()}}function wo(e){var s;const t=(s=d.rosterEditor)==null?void 0:s.teams.find(r=>r.team.id===e);if(!t)return 0;const a=new Set(d.rosterEditorSelectedRiderIds);return t.riders.filter(r=>a.has(r.rider.id)).length}function Io(){return d.rosterEditor?d.rosterEditor.teams.every(e=>wo(e.team.id)===e.riderLimit):!1}function vs(){const e=h("roster-editor-title"),t=h("roster-editor-meta"),a=h("roster-editor-body"),s=h("btn-apply-roster-editor"),r=d.rosterEditor;if(!r){e.textContent="Starterfeld bearbeiten",t.textContent="",a.innerHTML='<div class="results-empty">Kein Starterfeld geladen.</div>',s.disabled=!0;return}e.textContent="Starterfeld bearbeiten",t.textContent=r.race.isStageRace?`${r.race.name} · Etappe ${r.stage.stageNumber} · ${r.stage.profile}`:`${r.race.name} · ${r.stage.profile}`;const n=new Set(d.rosterEditorSelectedRiderIds);a.innerHTML=r.teams.map(i=>{const o=wo(i.team.id),c=o===i.riderLimit?"roster-editor-team-count-ok":"roster-editor-team-count-bad";return`
      <section class="roster-editor-team">
        <div class="roster-editor-team-head">
          <div>
            <h3>${S(i.team.name)}</h3>
            <p class="text-muted">${S(i.team.abbreviation)} · ${S(i.team.division??i.team.divisionName??"Team")}</p>
          </div>
          <div class="roster-editor-team-count ${c}">${o} / ${i.riderLimit}</div>
        </div>
        <div class="roster-editor-riders">
          ${i.riders.map(l=>{var b;const u=["roster-editor-rider",n.has(l.rider.id)?"roster-editor-rider-selected":"",l.isLocked?"roster-editor-rider-locked":""].filter(Boolean).join(" "),m=l.rider.country?ie(l.rider.country.code3):"",f=[((b=l.rider.role)==null?void 0:b.name)??"Ohne Rolle",`OVR ${Math.round(l.rider.overallRating)}`].join(" · "),g=l.lockReason?`<span class="roster-editor-rider-lock">${S(l.lockReason)}</span>`:"";return`
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
      </section>`}).join(""),s.disabled=!Io()}function As(){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],ta("roster-editor-error"),Ke("rosterEditor")}function Ro(e,t){d.selectedRealtimeStageId=e.stage.id,d.realtimeBootstrap=e,d.realtimeError=null,t&&Mt("live-race"),Eo().load(e,{autoplay:!0,resetSpeed:!0}),Lt()}function Eo(){let e=Yt;if(!e){const t=h("race-sim-layout"),a=h("race-sim-empty");if(!t||!a)throw new Error("Simulation HTML elemente fehlen.");e=new np({layout:t,emptyState:a,controlsHeader:h("race-sim-controls-header"),profile:h("race-sim-profile"),groupBox:h("race-sim-group-box"),messages:h("race-sim-messages-body"),favorites:h("race-sim-favorites-body"),sidebar:h("race-sim-sidebar-body"),controls:h("race-sim-controls"),meta:h("race-sim-stage-meta")},{onFinishRequested:(s,r)=>{const n=To(s,r),i=Mo(s,r);Co(r.stage.id,n,s.markerClassifications,s.incidents,s.allEvents,!1,i,s.superTeamId)}}),qo(e)}return e}async function vp(e){ve("Starterfeld wird geladen..."),ta("roster-editor-error");try{const t=await j.getRosterEditor(e);if(!t.success||!t.data){bt("roster-editor-error",t.error??"Starterfeld konnte nicht geladen werden."),Ve("rosterEditor"),vs();return}d.rosterEditor=t.data,d.rosterEditorSelectedRiderIds=t.data.teams.flatMap(a=>a.riders.filter(s=>s.isSelected).map(s=>s.rider.id)),vs(),Ve("rosterEditor")}catch(t){d.rosterEditor=null,d.rosterEditorSelectedRiderIds=[],bt("roster-editor-error",t.message),Ve("rosterEditor"),vs()}finally{fe()}}async function Sp(){const e=d.rosterEditor;if(e){if(!Io()){bt("roster-editor-error","Dein Team muss genau die erlaubte Zahl an Fahrern stellen.");return}ta("roster-editor-error"),ve("Starterfeld wird übernommen...");try{const t=await j.applyRosterEditor(e.stage.id,{riderIds:d.rosterEditorSelectedRiderIds});if(!t.success||!t.data){bt("roster-editor-error",t.error??"Starterfeld konnte nicht übernommen werden.");return}As(),Ro(t.data,!0)}catch(t){bt("roster-editor-error",t.message)}finally{fe()}}}function Lt(){var n,i;const e=h("race-sim-stage-select"),t=((n=d.gameStatus)==null?void 0:n.pendingStages)??[];t.some(o=>o.stageId===d.selectedRealtimeStageId)||(d.selectedRealtimeStageId=((i=t[0])==null?void 0:i.stageId)??null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null)),e.innerHTML=t.length===0?'<option value="">– Keine offenen Etappen –</option>':t.map(o=>`
      <option value="${o.stageId}"${o.stageId===d.selectedRealtimeStageId?" selected":""}>${S(yp(o.raceName,o.stageNumber,o.profile))}</option>
    `).join(""),e.disabled=t.length===0;const s=t.find(o=>o.stageId===d.selectedRealtimeStageId)??null,r=Eo();if(!s){d.realtimeBootstrap=null,d.realtimeError=null,r.clear("Heute gibt es keine offenen Etappen für die Live-Simulation.");return}(!d.realtimeBootstrap||d.realtimeBootstrap.stage.id!==s.stageId)&&(d.realtimeError?r.clear(d.realtimeError):r.hide())}async function Fo(e,t){if(Ms!==e){Rr(e),d.selectedRealtimeStageId=e,t&&Mt("live-race"),Lt(),ve("Live-Simulation wird geladen...");try{const a=await j.getRealtimeSimulation(e);if(!a.success||!a.data){d.realtimeBootstrap=null,d.realtimeError=a.error??"Live-Simulation konnte nicht geladen werden.",Lt(),alert(`Live-Simulation fehlgeschlagen:
`+(a.error??"Unbekannter Fehler"));return}Ro(a.data,!1)}catch(a){d.realtimeBootstrap=null,d.realtimeError=a.message,Lt(),alert("Unerwarteter Fehler bei der Live-Simulation: "+a.message)}finally{Ms===e&&Rr(null),fe()}}}async function Co(e,t,a,s,r,n=!1,i,o){if(!zs){wr(!0),ve("Live-Ergebnis wird gespeichert...");try{const c=await j.completeRealtimeSimulation(e,{entries:t,markerClassifications:a,incidents:s,events:r,leadoutContributions:i,superTeamId:o});if(!c.success){alert(`Live-Ergebnis konnte nicht gespeichert werden:
`+(c.error??"Unbekannter Fehler"));return}const l=c.data;d.selectedResultsRaceId=(l==null?void 0:l.raceId)??d.selectedResultsRaceId,d.selectedResultsStageId=(l==null?void 0:l.stageId)??e,d.selectedResultTypeId=1,d.realtimeBootstrap=null,d.realtimeError=null,await Ls(e,!1),await hr(),await br(),await Za(),Lt(),n||Mt("results")}catch(c){alert("Unerwarteter Fehler beim Speichern des Live-Ergebnisses: "+c.message)}finally{wr(!1),fe()}}}function kp(){h("race-sim-stage-select").addEventListener("change",e=>{const t=Number(e.target.value);d.selectedRealtimeStageId=Number.isFinite(t)?t:null,d.realtimeBootstrap&&d.realtimeBootstrap.stage.id!==d.selectedRealtimeStageId&&(d.realtimeBootstrap=null),d.realtimeError=null,Fo(t,!1)})}function fr(e){var s;const t=ra((s=e.category)==null?void 0:s.name),a=Qa(t);return e.isStageRace?`<span class="badge badge-race-category" style="${a}">Etappenrennen · ${e.numberOfStages} · Etappen</span>`:`<span class="badge badge-race-category" style="${a}">Eintagesrennen</span>`}function rs(e){var r,n;const t=ra((r=e.category)==null?void 0:r.name),a=Qa(t),s=((n=e.category)==null?void 0:n.name)??`Kategorie ${e.categoryId}`;return`<span class="badge badge-race-category" style="${a}">${S(s)}</span>`}function $p(e){const t=e.stages??[];if(t.length===0)return{startDate:e.startDate,endDate:e.endDate};const a=t.map(s=>s.date).sort((s,r)=>s.localeCompare(r));return{startDate:a[0]??e.startDate,endDate:a[a.length-1]??e.endDate}}function ns(e){const{startDate:t,endDate:a}=$p(e);return t===a?re(t):`${re(t)} - ${re(a)}`}function Tp(e){return e.stageId>0}async function hr(){const[e,t]=await Promise.all([j.getGameState(),j.getGameStatus()]);if(!e.success){console.error(e.error);return}d.gameState=e.data??null,d.gameStatus=t.success?t.data??null:null,Mp(),ye("dashboard")&&is()}function Mp(){var r;if(!d.gameState)return;h("meta-date").textContent=d.gameState.formattedDate,h("meta-season").textContent=`Saison ${d.gameState.season}`;const e=h("meta-race-hint"),t=h("btn-advance-day"),a=h("pending-stages-list"),s=((r=d.gameStatus)==null?void 0:r.pendingStages)??[];s.length>0?(e.textContent=`${s.length} offene Etappe${s.length===1?"":"n"} heute. Tageswechsel ist gesperrt.`,e.classList.remove("hidden"),a.innerHTML=s.map(n=>{const i=n.isStageRace?`Etappe ${n.stageNumber} · ${n.profile} · ${re(n.date)}`:`${n.profile} · ${re(n.date)}`,o=Tp(n)?`<button class="btn btn-ghost btn-sm" data-edit-stage-roster="${n.stageId}">Starterfeld bearbeiten</button>`:"";return`
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
        </div>`}).join(""),a.classList.remove("hidden"),t.disabled=!0):d.gameState.hasRaceToday?(e.textContent="Heutige Rennen sind abgeschlossen. Tageswechsel ist wieder freigegeben.",e.classList.remove("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1):(e.textContent="",e.classList.add("hidden"),a.innerHTML="",a.classList.add("hidden"),t.disabled=!1)}function is(){var t,a,s,r,n;const e=d.teams.find(i=>i.isPlayerTeam)??d.teams.find(i=>{var o;return i.name===((o=d.currentSave)==null?void 0:o.teamName)})??null;h("dashboard-career").textContent=((t=d.currentSave)==null?void 0:t.careerName)??"–",h("dashboard-team").textContent=(e==null?void 0:e.name)??((a=d.currentSave)==null?void 0:a.teamName)??"–",h("dashboard-date").textContent=((s=d.gameState)==null?void 0:s.formattedDate)??"–",h("dashboard-season").textContent=d.gameState?`Saison ${d.gameState.season}`:"–",h("dashboard-races-today").textContent=String(((r=d.gameStatus)==null?void 0:r.pendingStages.length)??((n=d.gameState)==null?void 0:n.racesTodayCount)??0),Rp()}async function br(){const e=await j.getRaces();if(!e.success){console.error(e.error);return}d.races=e.data??[],ye("dashboard")&&is(),xp(),wp()}async function xp(){var n;const e=(n=d.gameState)==null?void 0:n.season;if(!e||d.races.length===0)return;const t=`participantCountsLogged_${e}`;if(localStorage.getItem(t))return;const a=d.races.slice(0,30),s=await Promise.all(a.map(async i=>{var c;const o=await j.getRaceProgramParticipants(i.id);return{race:i,count:o.success?((c=o.data)==null?void 0:c.length)??0:-1}}));if(s.some(i=>i.count>0)){console.group(`[Velo] Teilnehmeranzahl Saison ${e}`);for(const{race:i,count:o}of s)o>=0&&console.log(`${i.name} (${i.startDate}): ${o} Programmfahrer`);console.groupEnd(),localStorage.setItem(t,"1")}}async function wp(){var i;const e=(i=d.gameState)==null?void 0:i.season;if(!e)return;const t=`programAssignmentsLogged_${e}`;if(localStorage.getItem(t))return;const a=await j.getRiders();if(!a.success||!a.data)return;const s=a.data,r=new Map;for(const o of s)if(o.seasonProgram){const c=o.seasonProgram;r.has(c.id)||r.set(c.id,{name:c.name,riders:[]}),r.get(c.id).riders.push(o)}if(r.size===0)return;console.group(`[Velo] Programmzuweisungen Saison ${e}`);const n=Array.from(r.keys()).sort((o,c)=>o-c);for(const o of n){const c=r.get(o);console.log(`Program: ${o} - ${c.name} (Count: ${c.riders.length})`)}console.groupEnd(),localStorage.setItem(t,"1")}function Ip(e,t){const[a,s,r]=e.split("-").map(Number),n=new Date(a,s-1,r);n.setDate(n.getDate()+t);const i=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),c=String(n.getDate()).padStart(2,"0");return`${i}-${o}-${c}`}function Dn(e){var p,u,m,f;const t=d.gameState!=null&&e.startDate<=d.gameState.currentDate&&e.endDate>=d.gameState.currentDate,s=d.gameState!=null&&e.endDate<d.gameState.currentDate?'<span class="badge badge-done">Abgeschlossen</span>':t?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',r=((p=e.country)==null?void 0:p.name)??`Land ${e.countryId}`,n=(u=e.country)!=null&&u.code3?ie(e.country.code3):"",i=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.distanceKm??0),0):((m=e.upcomingStage)==null?void 0:m.distanceKm)??null,o=e.isStageRace?(e.stages??[]).reduce((g,b)=>g+(b.elevationGainMeters??0),0):((f=e.upcomingStage)==null?void 0:f.elevationGainMeters)??null,c=i!=null?String(i.toFixed(1)).replace(".",","):"-",l=o!=null?String(Math.round(o)):"-";return`
    <tr>
      <td>${re(e.startDate)}</td>
      <td>
        <button type="button" class="dashboard-race-link" data-dashboard-race-id="${e.id}">
          <strong>${S(e.name)}</strong>
        </button>
      </td>
      <td>
        <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${e.id}">
          ${fr(e)}
        </button>
      </td>
      <td><span class="dashboard-race-country">${n}<span>${S(r)}</span></span></td>
      <td>${rs(e)}</td>
      <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${e.id}">Teilnehmer</button></td>
      <td>${c}</td>
      <td>${l}</td>
      <td>${s}</td>
    </tr>`}function Rp(){const e=h("dashboard-races-tbody");if(!d.gameState){e.innerHTML='<tr><td colspan="9" class="text-muted">Kein Spiel geladen.</td></tr>';return}const t=d.gameState.currentDate,a=Ip(t,7),s=d.races.filter(i=>i.startDate<=t&&i.endDate>=t),r=d.races.filter(i=>i.startDate>t&&i.startDate<=a);let n="";n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>In Progress</strong></td>
    </tr>
  `,s.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine laufenden Rennen.</td>
      </tr>
    `:n+=s.map(i=>Dn(i)).join(""),n+=`
    <tr class="table-subsection-header">
      <td colspan="9"><strong>Geplant (Nächste 7 Tage)</strong></td>
    </tr>
  `,r.length===0?n+=`
      <tr>
        <td colspan="9" class="text-muted" style="font-style: italic; text-align: center; padding: 12px;">Keine geplanten Rennen in den nächsten 7 Tagen.</td>
      </tr>
    `:n+=r.map(i=>Dn(i)).join(""),e.innerHTML=n}function ca(e){return`Etappe ${e.stageNumber}`}function Ep(e){if(e.length===0)return"Keine Etappen";const t=new Map;return e.forEach(a=>{t.set(a.profile,(t.get(a.profile)??0)+1)}),Array.from(t.entries()).sort((a,s)=>s[1]!==a[1]?s[1]-a[1]:a[0].localeCompare(s[0])).map(([a,s])=>`${s}x ${a}`).join(" · ")}function Fp(e){return`stage-profile-badge-${e.toLowerCase().replace(/_/g,"-")}`}function ua(e){return`<span class="stage-profile-badge ${Fp(e)}">${S(e)}</span>`}function os(e,t){return`${e.name} · ${ca(t)} · ${t.profile}`}async function Cp(e){var r;const t=d.stageSummariesByStageId[e];if(t)return t;const a=await j.getStageSummary(e);if(a.success&&a.data)return d.stageSummariesByStageId[e]=a.data,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],a.data;const s=await j.getRealtimeSimulation(e);return s.success&&((r=s.data)!=null&&r.stageSummary)?(d.stageSummariesByStageId[e]=s.data.stageSummary,d.stageSummaryErrorsByStageId&&delete d.stageSummaryErrorsByStageId[e],s.data.stageSummary):(d.stageSummaryErrorsByStageId&&(d.stageSummaryErrorsByStageId[e]=a.error??s.error??"Etappenprofil konnte nicht geladen werden."),console.error("Stage-Summary-Laden fehlgeschlagen:",{stageId:e,stageSummaryError:a.error,realtimeFallbackError:s.error}),d.stageSummariesByStageId&&delete d.stageSummariesByStageId[e],!a.success||!a.data?null:a.data)}function Np(){var c;const e=h("race-stages-title"),t=h("race-stages-meta"),a=h("race-stages-body"),s=ct(d.selectedDashboardRaceId);if(!s){e.textContent="Etappen",t.textContent="",a.innerHTML='<div class="results-empty">Rennen nicht gefunden.</div>';return}const r=s.stages??[],n=r.reduce((l,p)=>l+(p.distanceKm??0),0),i=r.reduce((l,p)=>l+(p.elevationGainMeters??0),0),o=Ep(r);if(e.textContent=s.name,t.textContent=`${ns(s)} · ${((c=s.country)==null?void 0:c.name)??`Land ${s.countryId}`} · ${s.isStageRace?`${s.numberOfStages} Etappen`:"Eintagesrennen"} · ${Is(n)} · ${Rs(i)} · ${o}`,r.length===0){a.innerHTML='<div class="results-empty">Für dieses Rennen sind keine Etappen vorhanden.</div>';return}a.innerHTML=`
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
                <td>${re(l.date)}</td>
                <td><strong>${S(ca(l))}</strong></td>
                <td>${ua(l.profile)}</td>
                <td>${l.distanceKm!=null?Is(l.distanceKm):"–"}</td>
                <td>${l.elevationGainMeters!=null?Rs(l.elevationGainMeters):"–"}</td>
                <td>
                  <button
                    type="button"
                    class="dashboard-stage-profile-link"
                    data-dashboard-stage-profile-id="${l.id}"
                    aria-label="Profil von ${S(os(s,l))} öffnen"
                  >
                    Profil anzeigen
                  </button>
                </td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Bs(e){ct(e)&&(d.selectedDashboardRaceId=e,Np(),Ve("raceStages"))}function Pp(e){return e.races.length===0?'<div class="results-empty">Keine Rennen in diesem Programm.</div>':`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table">
        <thead><tr><th>Datum</th><th>Land</th><th>Rennen</th><th>Kategorie</th><th>Format</th></tr></thead>
        <tbody>
          ${e.races.map(t=>{var a,s;return`
            <tr>
              <td>${ns(t)}</td>
              <td><span class="dashboard-race-country">${(a=t.country)!=null&&a.code3?ie(t.country.code3):""}<span>${S(((s=t.country)==null?void 0:s.name)??`Land ${t.countryId}`)}</span></span></td>
              <td><strong>${S(t.name)}</strong></td>
              <td>${rs(t)}</td>
              <td>${fr(t)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}async function yr(e){const t=d.riders.find(s=>s.id===e);h("rider-program-title").textContent=t?Ce(t):"Programm",h("rider-program-meta").textContent="Lade Programmrennen ...",h("rider-program-body").innerHTML="",Ve("riderProgram");const a=await j.getRiderProgramRaces(e);if(!a.success||!a.data){h("rider-program-meta").textContent="",h("rider-program-body").innerHTML=`<div class="results-empty">${S(a.error??"Programm konnte nicht geladen werden.")}</div>`;return}h("rider-program-title").textContent=a.data.program.name,h("rider-program-meta").textContent=t?Ce(t):"",h("rider-program-body").innerHTML=Pp(a.data)}function Lp(e){if(e.length===0)return'<div class="results-empty">Keine Programmfahrer für dieses Rennen.</div>';const t=Dp(e);return`
    <div class="dashboard-race-stages-table-wrap">
      <table class="data-table dashboard-race-stages-table race-participants-table">
        <thead><tr>
          ${gt("Team","team","Team")}
          ${gt("Fahrer","rider","Fahrer")}
          ${gt("Spec1","spec1","Spezialisierung 1")}
          ${gt("Rolle","role","Rolle")}
          ${gt("Ges","overall","Gesamtstärke")}
          ${gt("Phase","phase","Formphase")}
          ${gt("Programm","program","Saisonprogramm")}
        </tr></thead>
        <tbody>
          ${t.map(a=>{var s,r;return`
            <tr class="race-participants-row">
              <td class="race-participants-team-cell">${St((s=a.team)==null?void 0:s.id,(r=a.team)==null?void 0:r.name)}</td>
              <td><span class="race-participant-rider-cell">${ie(kt(a.rider))}<strong>${S(Ce(a.rider))}</strong></span></td>
              <td>${S(_s(a.rider))}</td>
              <td>${S(dt(a.rider))}</td>
              <td>${ni(a.rider.overallRating)}</td>
              <td>${ii(a.rider)}</td>
              <td><button type="button" class="team-program-button" data-rider-program-id="${a.rider.id}">${S(a.program.name)}</button></td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>`}function gt(e,t,a){const s=d.raceParticipantsSort.key===t?" race-participants-sort-active":"",r=d.raceParticipantsSort.key===t?d.raceParticipantsSort.direction==="asc"?"↑":"↓":"↕";return`
    <th${a?` title="${S(a)}"`:""}>
      <button
        type="button"
        class="race-participants-sort${s}"
        data-race-participants-sort="${t}"
      >
        <span class="team-table-sort-label">${S(e)}</span>
        <span class="team-table-sort-indicator${d.raceParticipantsSort.key===t?" team-table-sort-indicator-active":""}">${r}</span>
      </button>
    </th>`}function Dp(e){const t=d.raceParticipantsSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>{var n,i,o,c;let r=0;switch(d.raceParticipantsSort.key){case"team":r=(((n=a.team)==null?void 0:n.name)??"").localeCompare(((i=s.team)==null?void 0:i.name)??"","de");break;case"rider":r=Ce(a.rider).localeCompare(Ce(s.rider),"de");break;case"spec1":r=_s(a.rider).localeCompare(_s(s.rider),"de");break;case"role":r=dt(a.rider).localeCompare(dt(s.rider),"de");break;case"overall":r=a.rider.overallRating-s.rider.overallRating;break;case"phase":r=(a.rider.seasonFormPhase??"neutral").localeCompare(s.rider.seasonFormPhase??"neutral","de");break;default:r=(((o=a.program)==null?void 0:o.name)??"").localeCompare(((c=s.program)==null?void 0:c.name)??"","de")}return r*t||Ce(a.rider).localeCompare(Ce(s.rider),"de")})}function _s(e){return e.specialization1!=null?Zt(e.specialization1):"–"}async function No(e){const t=ct(e);d.selectedRaceParticipantsRaceId=e,h("race-participants-title").textContent=(t==null?void 0:t.name)??"Teilnehmer",h("race-participants-meta").textContent="Lade Programmfahrer ...",h("race-participants-body").innerHTML="",d.raceParticipants=[],Ve("raceParticipants"),await Po()}async function Po(e=!1){const t=d.selectedRaceParticipantsRaceId;if(t==null)return;const a=ct(t);e&&(h("race-participants-meta").textContent="Lade Programmfahrer ...");const s=await j.getRaceProgramParticipants(t);if(!s.success||!s.data){h("race-participants-meta").textContent="",h("race-participants-body").innerHTML=`<div class="results-empty">${S(s.error??"Teilnehmer konnten nicht geladen werden.")}</div>`;return}d.raceParticipants=s.data,h("race-participants-title").textContent=(a==null?void 0:a.name)??"Teilnehmer",h("race-participants-meta").textContent=`${s.data.length} Programmfahrer · ${a?ns(a):""}`,h("race-participants-body").innerHTML=Lp(d.raceParticipants)}async function Ja(e,t=null){let a=Ba(e);if(!a&&d.stageEditorStageRows){const n=d.stageEditorStageRows.find(i=>i.stageId===e);n&&(a={race:{id:n.raceId,name:n.raceName,countryId:0,categoryId:0,isStageRace:!0,numberOfStages:1,startDate:"",endDate:"",prestige:0},stage:{id:n.stageId,raceId:n.raceId,stageNumber:n.stageNumber,date:"2026-01-01",profile:n.profile,startElevation:0,detailsCsvFile:"",distanceKm:n.distanceKm,elevationGainMeters:n.elevationGainMeters}})}if(!a)return;const s=await Cp(e);if(!s){alert(d.stageSummaryErrorsByStageId[e]??"Etappenprofil konnte nicht geladen werden.");return}d.selectedDashboardProfileStageId=e,h("stage-profile-title").textContent=`${a.race.name} · ${ca(a.stage)}`;const r=t!=null?` · Anstieg ${t.climbIndex}: ${t.name}${t.category!=null?` · Kat. ${t.category}`:""} · ${t.startKm.toFixed(1).replace(".",",")}-${t.endKm.toFixed(1).replace(".",",")} km · Climb Score ${t.climbScore}`:"";h("stage-profile-meta").textContent=`${re(a.stage.date)} · ${a.stage.profile} · ${a.stage.distanceKm!=null?Is(a.stage.distanceKm):"–"} · ${a.stage.elevationGainMeters!=null?Rs(a.stage.elevationGainMeters):"–"}${r}`,xl(h("stage-profile-view"),s,a.stage.profile,os(a.race,a.stage),t!=null?{selectedClimbRange:{startKm:t.startKm,endKm:t.endKm}}:void 0),Ve("stageProfile")}function Ap(){h("pending-stages-list").addEventListener("click",e=>{const t=e.target.closest("button[data-edit-stage-roster]");if(t){const r=Number(t.dataset.editStageRoster);if(!Number.isFinite(r))return;vp(r);return}const a=e.target.closest("button[data-live-stage]");if(a){const r=Number(a.dataset.liveStage);if(!Number.isFinite(r))return;Fo(r,!0);return}const s=e.target.closest("button[data-instant-stage]");if(s){const r=Number(s.dataset.instantStage);if(!Number.isFinite(r))return;xo(r)}}),h("dashboard-races-tbody").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-race-participants-id]");if(t){const r=Number(t.dataset.dashboardRaceParticipantsId);Number.isFinite(r)&&No(r);return}const a=e.target.closest("button[data-dashboard-race-id]");if(!a)return;const s=Number(a.dataset.dashboardRaceId);Number.isFinite(s)&&Bs(s)}),h("race-stages-body").addEventListener("click",e=>{const t=e.target.closest("button[data-dashboard-stage-profile-id]");if(!t)return;const a=Number(t.dataset.dashboardStageProfileId);Number.isFinite(a)&&Ja(a)}),h("race-participants-body").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const r=Number(t.dataset.riderProgramId);Number.isFinite(r)&&yr(r);return}const a=e.target.closest("button[data-race-participants-sort]");if(!a)return;const s=a.dataset.raceParticipantsSort;d.raceParticipantsSort.key===s?d.raceParticipantsSort.direction=d.raceParticipantsSort.direction==="asc"?"desc":"asc":d.raceParticipantsSort={key:s,direction:"asc"},Po()}),h("btn-advance-day").addEventListener("click",async()=>{await Lo()}),h("btn-auto-progress").addEventListener("click",()=>{Bp()})}async function Lo(){ve("Tag wird fortgeschrieben...");try{const e=await j.advanceDay();if(!e.success)return alert(`Tageswechsel fehlgeschlagen:
`+(e.error??"Unbekannter Fehler")),!1;if(d.currentSave&&e.data&&(d.currentSave.currentSeason=e.data.season),await hr(),await br(),ye("teams")){const{refreshTeamsViewData:t}=await li(async()=>{const{refreshTeamsViewData:a}=await Promise.resolve().then(()=>bp);return{refreshTeamsViewData:a}},void 0);await t()}return!0}catch(e){return alert("Unerwarteter Fehler beim Tageswechsel: "+e.message),!1}finally{fe()}}function vr(){const e=document.getElementById("btn-auto-progress");e&&(rt?(e.textContent="Stoppen (Leertaste)",e.classList.remove("btn-secondary"),e.classList.add("btn-danger")):(e.textContent="Auto Progress",e.classList.remove("btn-danger"),e.classList.add("btn-secondary")))}function Bp(){rt?qa():Do()}function Do(){rt||(Qn(!0),vr(),_p())}function qa(){rt&&(Qn(!1),d.autoProgressTargetDate=null,vr())}async function _p(){var e,t;for(;rt;){const a=(e=d.gameState)==null?void 0:e.currentDate;if(d.autoProgressTargetDate&&a&&a>=d.autoProgressTargetDate){qa();break}const s=((t=d.gameStatus)==null?void 0:t.pendingStages)??[];let r=!1;if(s.length>0){const n=s[0];r=await xo(n.stageId,!0)}else r=await Lo();if(!r){qa();break}await new Promise(n=>setTimeout(n,100))}vr()}window.addEventListener("keydown",e=>{if((e.code==="Space"||e.key===" ")&&rt){const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)return;e.preventDefault(),qa()}});const ea=50;function Sr(){return[...lr,...dr[d.riderMenuDetailPage]]}function Ao(e){return d.riderMenuTableSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderMenuTableSort.direction==="asc"?"↑":"↓"}</span>`}function Bo(e){if(!e.sortKey)return`<th class="${S(e.className??"")}" title="${S(e.title)}">${S(e.label)}</th>`;const t=d.riderMenuTableSort.key===e.sortKey?" team-table-sort-active":"";return`
    <th class="${S(e.className??"")}" title="${S(e.title)}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-riders-sort="${e.sortKey}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Ao(e.sortKey)}
      </button>
    </th>`}function _o(){return`
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahreransicht Detailseite">
      ${da.map(e=>{const t={skills:"Werte",form:"Saisonform",profile:"Fahrertyp & Peaks",preferences:"Programm & Mentoren"};return`
          <button
            type="button"
            class="team-detail-page-tab${d.riderMenuDetailPage===e?" team-detail-page-tab-active":""}"
            role="tab"
            aria-selected="${d.riderMenuDetailPage===e?"true":"false"}"
            data-riders-detail-page="${e}"
          >
            ${t[e]}
          </button>`}).join("")}
    </div>`}function Pa(){const e=h("riders-detail"),t=Sr(),a=ko(d.riders),s=a.length,r=Math.max(1,Math.ceil(s/ea));d.riderMenuPage=Math.min(r,Math.max(1,d.riderMenuPage));const n=(d.riderMenuPage-1)*ea,i=Math.min(s,n+ea),o=a.slice(n,i);e.innerHTML=`
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>Alle Fahrer</h3>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${s} Fahrer</span>
        <span class="text-muted">Sortierung: ${S(mr(d.riderMenuTableSort.key))} ${d.riderMenuTableSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
      </div>
      ${_o()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${t.map(Bo).join("")}
          </tr></thead>
          <tbody>
            ${o.length===0?`<tr><td colspan="${t.length}" class="text-muted">Keine Fahrer.</td></tr>`:o.map(c=>`
                <tr class="team-detail-row">
                  ${t.map(l=>pr(c,l)).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="team-detail-meta riders-pagination" style="margin-top:0.75rem">
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="prev" ${d.riderMenuPage<=1?"disabled":""}>Zurück</button>
        <span>Seite ${d.riderMenuPage} / ${r} · Fahrer ${s===0?0:n+1}-${i} von ${s}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-riders-page-action="next" ${d.riderMenuPage>=r?"disabled":""}>Weiter</button>
      </div>
    </div>`}function Go(){h("riders-detail").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-program-id]");if(t){const n=Number(t.dataset.riderProgramId);Number.isFinite(n)&&yr(n);return}const a=e.target.closest("button[data-riders-detail-page]");if(a){const n=a.dataset.ridersDetailPage;da.includes(n)&&(d.riderMenuDetailPage=n,new Set(Sr().map(o=>o.sortKey).filter(o=>o!=null)).has(d.riderMenuTableSort.key)||(d.riderMenuTableSort={key:"name",direction:"asc"}),d.riderMenuPage=1,Pa());return}const s=e.target.closest("button[data-riders-sort]");if(s){const n=s.dataset.ridersSort;d.riderMenuTableSort.key===n?d.riderMenuTableSort.direction=d.riderMenuTableSort.direction==="asc"?"desc":"asc":d.riderMenuTableSort={key:n,direction:ur(n)},d.riderMenuPage=1,Pa();return}const r=e.target.closest("button[data-riders-page-action]");if(r){const n=r.dataset.ridersPageAction,i=Math.max(1,Math.ceil(d.riders.length/ea));n==="prev"&&(d.riderMenuPage=Math.max(1,d.riderMenuPage-1)),n==="next"&&(d.riderMenuPage=Math.min(i,d.riderMenuPage+1)),Pa();return}})}const Gp=Object.freeze(Object.defineProperty({__proto__:null,RIDER_MENU_PAGE_SIZE:ea,getActiveRiderMenuTableColumns:Sr,getRiderMenuSortIndicator:Ao,initRidersListeners:Go,renderRiderMenuDetailPageTabs:_o,renderRiderMenuTableHeader:Bo,renderRidersMenu:Pa},Symbol.toStringTag,{value:"Module"})),Ra=[{key:"riderId",label:"ID",title:"Fahrer-ID",inputType:"number",className:"team-table-col-year"},{key:"firstName",label:"Vorname",title:"Vorname",inputType:"text",className:"team-table-col-name"},{key:"lastName",label:"Nachname",title:"Nachname",inputType:"text",className:"team-table-col-name"},{key:"countryId",label:"Land",title:"Country-ID",inputType:"number",className:"team-table-col-year"},{key:"birthYear",label:"Jg",title:"Geburtsjahr",inputType:"number",className:"team-table-col-year"},{key:"teamName",label:"Team",title:"Teamzuordnung",inputType:"team",className:"team-table-col-program"},{key:"overallRating",label:"Ges",title:"Gesamtstärke wie im Teams-Menü",inputType:"readonly",className:"team-table-col-overall"},{key:"skillFlat",label:"Fl",title:"Flach",inputType:"number",className:"team-table-col-skill"},{key:"skillMountain",label:"Berg",title:"Berg",inputType:"number",className:"team-table-col-skill"},{key:"skillMediumMountain",label:"MB",title:"Mittlere Berge",inputType:"number",className:"team-table-col-skill"},{key:"skillHill",label:"Hgl",title:"Hügel",inputType:"number",className:"team-table-col-skill"},{key:"skillTimeTrial",label:"ZF",title:"Zeitfahren",inputType:"number",className:"team-table-col-skill"},{key:"skillPrologue",label:"Pro",title:"Prolog",inputType:"number",className:"team-table-col-skill"},{key:"skillCobble",label:"Pf",title:"Pflaster",inputType:"number",className:"team-table-col-skill"},{key:"skillSprint",label:"Spr",title:"Sprint",inputType:"number",className:"team-table-col-skill"},{key:"skillAcceleration",label:"Acc",title:"Antritt",inputType:"number",className:"team-table-col-skill"},{key:"skillDownhill",label:"Abf",title:"Abfahrt",inputType:"number",className:"team-table-col-skill"},{key:"skillAttack",label:"Atk",title:"Attacke",inputType:"number",className:"team-table-col-skill"},{key:"skillStamina",label:"Sta",title:"Stamina",inputType:"number",className:"team-table-col-skill"},{key:"skillResistance",label:"Res",title:"Widerstand",inputType:"number",className:"team-table-col-skill"},{key:"skillRecuperation",label:"Rec",title:"Regeneration",inputType:"number",className:"team-table-col-skill"},{key:"favoriteRaces",label:"Favs",title:"Lieblingsrennen",inputType:"text",className:"team-table-col-preferences"},{key:"nonFavoriteRaces",label:"Nos",title:"Nicht bevorzugte Rennen",inputType:"text",className:"team-table-col-preferences"}];function Ze(e){return e==null?"free-agents":String(e)}function An(e){var a;const t=d.riderTeamEditorPayload;return t?((a=t.teams.find(s=>s.teamId===e))==null?void 0:a.name)??(e==null?"Free Agents":`Team ${e}`):e==null?"Free Agents":"–"}function Hp(e){const t=e.skillFlat+e.skillMountain+e.skillMediumMountain+e.skillHill+e.skillTimeTrial+e.skillCobble+e.skillSprint*1.2+e.skillStamina+e.skillResistance+e.skillRecuperation+e.skillAcceleration;return ri(t/11.2,0,100)}function zp(e){return["riderId","countryId","birthYear","overallRating","skillFlat","skillMountain","skillMediumMountain","skillHill","skillTimeTrial","skillPrologue","skillCobble","skillSprint","skillAcceleration","skillDownhill","skillAttack","skillStamina","skillResistance","skillRecuperation"].includes(e)?"desc":"asc"}function Kp(e){return d.riderTeamEditorSort.key!==e?'<span class="team-table-sort-indicator">↕</span>':`<span class="team-table-sort-indicator team-table-sort-indicator-active">${d.riderTeamEditorSort.direction==="asc"?"↑":"↓"}</span>`}function Wp(e){const t=d.riderTeamEditorSort.key===e.key?" team-table-sort-active":"";return`
    <th class="${e.className??""}">
      <button
        type="button"
        class="team-table-sort${t}"
        data-rider-team-editor-sort="${e.key}"
        title="${S(e.title)}"
        aria-label="${S(e.title)}"
      >
        <span class="team-table-sort-label">${S(e.label)}</span>
        ${Kp(e.key)}
      </button>
    </th>`}function jp(e,t){switch(d.riderTeamEditorSort.key){case"riderId":return e.riderId-t.riderId;case"firstName":return ae(e.firstName,t.firstName);case"lastName":return ae(e.lastName,t.lastName);case"countryId":return e.countryId-t.countryId;case"birthYear":return e.birthYear-t.birthYear;case"teamName":return ae(An(e.teamId),An(t.teamId));case"overallRating":return e.overallRating-t.overallRating;case"skillFlat":return e.skillFlat-t.skillFlat;case"skillMountain":return e.skillMountain-t.skillMountain;case"skillMediumMountain":return e.skillMediumMountain-t.skillMediumMountain;case"skillHill":return e.skillHill-t.skillHill;case"skillTimeTrial":return e.skillTimeTrial-t.skillTimeTrial;case"skillPrologue":return e.skillPrologue-t.skillPrologue;case"skillCobble":return e.skillCobble-t.skillCobble;case"skillSprint":return e.skillSprint-t.skillSprint;case"skillAcceleration":return e.skillAcceleration-t.skillAcceleration;case"skillDownhill":return e.skillDownhill-t.skillDownhill;case"skillAttack":return e.skillAttack-t.skillAttack;case"skillStamina":return e.skillStamina-t.skillStamina;case"skillResistance":return e.skillResistance-t.skillResistance;case"skillRecuperation":return e.skillRecuperation-t.skillRecuperation;case"favoriteRaces":return ae(e.favoriteRaces,t.favoriteRaces);case"nonFavoriteRaces":return ae(e.nonFavoriteRaces,t.nonFavoriteRaces);default:return 0}}function Op(e){const t=d.riderTeamEditorSort.direction==="asc"?1:-1;return[...e].sort((a,s)=>(jp(a,s)||ae(a.lastName,s.lastName)||ae(a.firstName,s.firstName)||a.riderId-s.riderId)*t)}function Vp(e){const t=d.riderTeamEditorSelectedTeamKey;if(!t)return[];const a=e.riders.filter(s=>Ze(s.teamId)===t);return Op(a)}function Up(e){const t=d.riderTeamEditorPayload;return t?t.teams.map(a=>`<option value="${Ze(a.teamId)}"${a.teamId===e?" selected":""}>${S(a.name)}</option>`).join(""):'<option value="free-agents">Free Agents</option>'}function Ho(e){return d.riderTeamEditorDirtyRiderIds.includes(e)}function Yp(e,t){const a=Ho(e.riderId)?" rider-team-editor-input-dirty":"";switch(t.inputType){case"readonly":return`<td><span class="skill-value" style="color:${Ws(e.overallRating)}">${Math.round(e.overallRating)}</span></td>`;case"team":return`<td><select class="rider-team-editor-input${a}" data-rider-team-editor-field="teamId" data-rider-team-editor-rider-id="${e.riderId}">${Up(e.teamId)}</select></td>`;case"number":{const s=e[t.key];return`<td><input type="number" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${s}"></td>`}case"text":{const s=String(e[t.key]??"");return`<td><input type="text" class="rider-team-editor-input${a}" data-rider-team-editor-field="${t.key}" data-rider-team-editor-rider-id="${e.riderId}" value="${S(s)}"></td>`}default:return"<td>–</td>"}}function Zp(e){const t=[...e.teams].sort((a,s)=>a.rank-s.rank||ae(a.name,s.name));return`
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
            <button type="button" class="rider-team-editor-sidebar-item${d.riderTeamEditorSelectedTeamKey===Ze(a.teamId)?" is-active":""}" data-rider-team-editor-team-filter="${Ze(a.teamId)}">
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
    </aside>`}function Pe(){var o;const e=h("rider-team-editor-root"),t=h("rider-team-editor-meta"),a=d.riderTeamEditorPayload;if(!a){e.innerHTML='<div class="results-empty">Editor wird geladen.</div>',t.textContent="Masterdaten aus riders.csv bearbeiten.";return}const s=d.riderTeamEditorSelectedTeamKey?a.teams.find(c=>Ze(c.teamId)===d.riderTeamEditorSelectedTeamKey)??null:null,r=Vp(a),n=d.riderTeamEditorDirtyRiderIds.length,i=s==null?"Kein Team gewählt":`${s.riderCount} Fahrer · Ø ${s.averageOverall!=null?s.averageOverall.toFixed(1).replace(".",","):"–"} · Rang #${s.rank}`;t.textContent=s==null?"Masterdaten aus riders.csv bearbeiten. Fahrer werden erst nach Teamauswahl geladen.":`${s.name} · ${i}`,e.innerHTML=`
    <div class="rider-team-editor-layout">
      <section class="rider-team-editor-main">
        <div class="team-detail-card">
          <div class="rider-team-editor-toolbar">
            <div class="teams-selector rider-team-editor-selector">
              <label for="rider-team-editor-team-select">Team auswählen</label>
              <select id="rider-team-editor-team-select">
                <option value=""${d.riderTeamEditorSelectedTeamKey===""?" selected":""}>– Team auswählen –</option>
                ${a.teams.map(c=>`
                  <option value="${Ze(c.teamId)}"${d.riderTeamEditorSelectedTeamKey===Ze(c.teamId)?" selected":""}>${S(c.name)} (${c.riderCount})</option>
                `).join("")}
              </select>
            </div>
            <div class="team-detail-meta">
              <span>${i}</span>
              <span class="text-muted">Sortierung: ${S(d.riderTeamEditorSort.key==="teamName"?"Team":((o=Ra.find(c=>c.key===d.riderTeamEditorSort.key))==null?void 0:o.title)??d.riderTeamEditorSort.key)} ${d.riderTeamEditorSort.direction==="asc"?"aufsteigend":"absteigend"}</span>
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
                  ${Ra.map(Wp).join("")}
                </tr>
              </thead>
              <tbody>
                ${r.length===0?`<tr><td colspan="${Ra.length}" class="text-muted">${d.riderTeamEditorSelectedTeamKey?"Keine Fahrer im aktuellen Team.":"Bitte zuerst ein Team im Dropdown auswählen."}</td></tr>`:r.map(c=>`
                    <tr class="team-detail-row${Ho(c.riderId)?" rider-team-editor-row-dirty":""}">
                      ${Ra.map(l=>Yp(c,l)).join("")}
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${Zp(a)}
    </div>`}function Jp(e){const a=e.teams.filter(i=>!i.isFreeAgents).map(i=>({teamId:i.teamId,name:i.name,abbreviation:i.abbreviation,divisionName:i.divisionName,isFreeAgents:!1})).map(i=>{const o=e.riders.filter(l=>l.teamId===i.teamId),c=o.length===0?null:Math.round(o.reduce((l,p)=>l+p.overallRating,0)/o.length*100)/100;return{...i,riderCount:o.length,averageOverall:c,rank:0}}),s=e.riders.filter(i=>i.teamId==null);a.push({teamId:null,name:"Free Agents",abbreviation:"FA",divisionName:"Free Agents",riderCount:s.length,averageOverall:s.length===0?null:Math.round(s.reduce((i,o)=>i+o.overallRating,0)/s.length*100)/100,rank:0,isFreeAgents:!0});const r=[...a].sort((i,o)=>{const c=i.averageOverall??-1;return(o.averageOverall??-1)-c||o.riderCount-i.riderCount||ae(i.name,o.name)}),n=new Map(r.map((i,o)=>[Ze(i.teamId),o+1]));return a.map(i=>({...i,rank:n.get(Ze(i.teamId))??a.length}))}async function zo(e=!1){if(d.riderTeamEditorPayload&&!e){Pe();return}h("rider-team-editor-root").innerHTML='<div class="results-empty">Editor wird geladen.</div>';const t=await j.getRiderTeamEditor();if(!t.success||!t.data){h("rider-team-editor-root").innerHTML=`<div class="results-empty">${S(t.error??"Editor konnte nicht geladen werden.")}</div>`;return}d.riderTeamEditorPayload=t.data,d.riderTeamEditorDirtyRiderIds=[],d.riderTeamEditorSaving=!1,d.riderTeamEditorExporting=!1,d.riderTeamEditorSelectedTeamKey&&(t.data.teams.some(s=>Ze(s.teamId)===d.riderTeamEditorSelectedTeamKey)||(d.riderTeamEditorSelectedTeamKey="")),Pe()}function qp(e,t,a){const s=d.riderTeamEditorPayload;if(!s)return;const r=s.riders.find(n=>n.riderId===e);r&&(t==="teamId"?r.teamId=a==="free-agents"?null:Number.parseInt(a,10):typeof r[t]=="number"?r[t]=Number.parseInt(a||"0",10):r[t]=a,r.overallRating=Hp(r),s.teams=Jp(s),d.riderTeamEditorDirtyRiderIds.includes(e)||(d.riderTeamEditorDirtyRiderIds=[...d.riderTeamEditorDirtyRiderIds,e]),Pe())}async function Xp(){if(!d.riderTeamEditorPayload||d.riderTeamEditorSaving)return;d.riderTeamEditorSaving=!0,Pe();const e=await j.saveRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorSaving=!1,!e.success||!e.data){alert(`Editor konnte nicht gespeichert werden:
${e.error??"Unbekannter Fehler"}`),Pe();return}d.riderTeamEditorPayload=e.data,d.riderTeamEditorDirtyRiderIds=[],Pe()}async function Qp(){if(!d.riderTeamEditorPayload||d.riderTeamEditorExporting)return;d.riderTeamEditorExporting=!0,Pe();const e=await j.exportRiderTeamEditor({riders:d.riderTeamEditorPayload.riders});if(d.riderTeamEditorExporting=!1,!e.success||!e.data){alert(`riders.csv konnte nicht exportiert werden:
${e.error??"Unbekannter Fehler"}`),Pe();return}Es(e.data.fileName,e.data.content),Pe()}function eg(){h("view-rider-team-editor").addEventListener("click",e=>{const t=e.target.closest("button[data-rider-team-editor-sort]");if(t){const r=t.dataset.riderTeamEditorSort;d.riderTeamEditorSort.key===r?d.riderTeamEditorSort.direction=d.riderTeamEditorSort.direction==="asc"?"desc":"asc":d.riderTeamEditorSort={key:r,direction:zp(r)},Pe();return}const a=e.target.closest("button[data-rider-team-editor-team-filter]");if(a){d.riderTeamEditorSelectedTeamKey=a.dataset.riderTeamEditorTeamFilter??"",Pe();return}const s=e.target.closest("button[data-rider-team-editor-action]");if(s){const r=s.dataset.riderTeamEditorAction;if(r==="reload"){zo(!0);return}if(r==="export"){Qp();return}r==="save"&&Xp()}}),h("view-rider-team-editor").addEventListener("change",e=>{const t=e.target.closest("#rider-team-editor-team-select");if(t){d.riderTeamEditorSelectedTeamKey=t.value,Pe();return}const a=e.target.closest(".rider-team-editor-input");if(a){const s=Number(a.dataset.riderTeamEditorRiderId),r=a.dataset.riderTeamEditorField;Number.isFinite(s)&&r&&qp(s,r,a.value)}})}let Qe={key:"pickNumber",asc:!0};function Bn(e){const t=Math.max(0,Math.min(1,(e-50)/35)),a=Math.round(6+t*118),s=.26+t*.18,r=.14+t*.12;return`--rider-stats-pill-hue:${a};--rider-stats-pill-border-alpha:${s};--rider-stats-pill-bg-alpha:${r};`}async function Ko(e,t=!1){const a=await j.getDraftHistory(e);if(!a.success){d.draftHistory=null,ye("draft")&&Gs(),!t&&a.error&&alert(`Draft Historie konnte nicht geladen werden:
`+a.error);return}d.draftHistory=a.data??null,ye("draft")&&Gs()}function Gs(){const e=h("draft-table-container"),t=h("draft-season-select");if(!d.currentSave){e.innerHTML='<div class="alert alert-info">Kein Spiel geladen.</div>';return}if(t.options.length===0){const i=d.currentSave.startSeason??2026;for(let o=d.currentSave.currentSeason;o>=i;o--){const c=document.createElement("option");c.value=o.toString(),c.textContent=`Saison ${o}`,t.appendChild(c)}d.draftSelectedSeason||(d.draftSelectedSeason=d.currentSave.currentSeason),t.value=d.draftSelectedSeason.toString(),t.onchange=o=>{const c=o.target;d.draftSelectedSeason=parseInt(c.value,10),Ko(d.draftSelectedSeason)}}if(!d.draftHistory){e.innerHTML='<div class="alert alert-info">Lade Draft Historie...</div>';return}if(d.draftHistory.rows.length===0){e.innerHTML='<div class="alert alert-info">Keine Draft-Einträge für diese Saison vorhanden.</div>';return}const a=[...d.draftHistory.rows].sort((i,o)=>{let c=0;const l=Qe.key;return l==="riderLastName"?c=i.riderLastName.localeCompare(o.riderLastName):l==="teamName"?c=i.teamName.localeCompare(o.teamName):l==="oldTeamName"?c=(i.oldTeamName||"").localeCompare(o.oldTeamName||""):l==="countryCode"?c=i.countryCode.localeCompare(o.countryCode):c=(i[l]??0)-(o[l]??0),Qe.asc?c:-c}),s=i=>Qe.key!==i?'<span class="sort-icon-placeholder"></span>':Qe.asc?" ▲":" ▼",r=i=>{Qe.key===i?Qe.asc=!Qe.asc:(Qe.key=i,Qe.asc=!0),Gs()};window.setDraftSort=r;let n=`
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
  `;for(const i of a){const o=d.draftHistory.season-i.riderBirthYear;let c="-";i.oldTeamName&&(c=`<div style="display:flex; align-items:center; gap:0.5rem;">${St(i.oldTeamId,i.oldTeamName)} ${S(i.oldTeamName)}</div>`);const l=`<div style="display:flex; align-items:center; gap:0.5rem;">${St(i.teamId,i.teamName)} ${S(i.teamName)}</div>`;n+=`
      <tr>
        <td class="text-center">#${i.pickNumber}</td>
        <td class="text-center">Runde ${i.draftRound}</td>
        <td>${l}</td>
        <td>${c}</td>
        <td class="text-center">${ie(i.countryCode)}</td>
        <td>${S(i.riderFirstName)} ${S(i.riderLastName)}</td>
        <td class="text-center">${o} J.</td>
        <td class="text-center">${i.contractLength} Jahre</td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Bn(i.overallAtDraft)}">${i.overallAtDraft.toFixed(1)}</span></td>
        <td class="text-center"><span class="rider-stats-summary-pill rider-stats-summary-pill-heat" style="${Bn(i.potOverallAtDraft)}">${i.potOverallAtDraft.toFixed(1)}</span></td>
      </tr>
    `}n+="</tbody></table>",e.innerHTML=n}async function tg(e=!1){const t=await j.getInjuries();if(!t.success){d.injuries=null,ye("injuries")&&_n(),!e&&t.error&&alert(`Verletzungen konnten nicht geladen werden:
`+t.error);return}d.injuries=t.data??[],ye("injuries")&&_n()}function _n(){const e=h("injuries-table-container");if(!d.injuries){e.innerHTML='<div class="alert alert-info">Lade Daten...</div>';return}if(h("injuries-meta").textContent=d.injuries.length+" Ausfälle",d.injuries.length===0){e.innerHTML='<div class="alert alert-info">Aktuell gibt es keine kranken oder verletzten Fahrer.</div>';return}window.openRiderStatsFromInjuries=_t;let t="";const a=d.injuries.filter(n=>n.teamId!=null&&n.teamDivisionTier===1),s=new Map;for(const n of a){const i=n.teamId;s.has(i)||s.set(i,[]),s.get(i).push(n)}for(const n of s.keys())s.get(n).sort((i,o)=>o.overallRating-i.overallRating);const r=Array.from(s.keys()).sort((n,i)=>{const o=s.get(n)[0].teamAbbreviation||"",c=s.get(i)[0].teamAbbreviation||"";return o.localeCompare(c)});if(r.length===0)t+='<div class="alert alert-info">Keine verletzten Fahrer in Division 1 Teams.</div>';else for(const n of r){const i=s.get(n),o=i[0].teamAbbreviation;t+=`
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
      `;for(const c of i){const l=c.healthStatus==="injured"?'<span class="badge badge-error">Verletzung 🤕</span>':'<span class="badge badge-warning">Krankheit 🤒</span>';let p="";if(c.fitDate){const u=re(c.fitDate);if(c.missedRaces&&c.missedRaces.length>0){let m="";for(const f of c.missedRaces)m+=`
                <div class="injury-missed-race">
                  <span style="min-width: 65px; color: var(--text-400);">${re(f.startDate)}</span>
                  ${ie(f.countryCode)}
                  <strong style="color: #fff; flex: 1; margin-right: 0.5rem;">${S(f.name)}</strong>
                  ${sr(f.categoryName)}
                </div>
              `;p=`
              <div class="injury-fit-cell">
                <strong>${u}</strong>
                <div class="injury-fit-tooltip">
                  <div style="margin-bottom: 0.4rem; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.2rem;">Verpasste Rennen (${c.missedRaces.length})</div>
                  ${m}
                </div>
              </div>
            `}else p=`<strong>${u}</strong>`}else p="Unbekannt";t+=`
          <tr>
            <td>${ie(c.countryCode)}</td>
            <td><a href="#" onclick="event.preventDefault(); openRiderStatsFromInjuries(${c.riderId})" style="color: inherit; text-decoration: none;"><strong>${S(c.riderFirstName)} ${S(c.riderLastName)}</strong></a></td>
            <td>${c.age}</td>
            <td><span class="rider-stats-icon-pill" style="padding:0; border:none; background:none;">${io(c.overallRating)}</span></td>
            <td>${l}</td>
            <td><strong>${c.unavailableDays} Tage</strong></td>
            <td>${p}</td>
          </tr>
        `}t+="</tbody></table></div>"}e.innerHTML=t}function Gn(e){return e===0?"–":`-${e}`}function ag(e){return e.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${tt(t.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Fe(t.riderName,{riderId:t.riderId,strong:!1})}</span>
          <strong>${t.points}</strong>
        </div>
      `).join("")}
    </div>`}function sg(e){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${S(e.countryName)}</span>
      <div class="season-standings-country-popover">
        ${ag(e.topRiders)}
      </div>
    </div>`}function rg(e,t){const a=t.filter(s=>s.teamId!=null&&e.teamId!=null&&s.teamId===e.teamId).slice(0,30);return a.length===0?'<div class="season-standings-country-popover-empty">Noch keine Fahrer mit Saisonpunkten.</div>':`
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
          <span class="results-flag-col-cell">${tt(s.countryCode)}</span>
          <span class="season-standings-country-rider-name">${Fe(s.riderName??"–",{riderId:s.riderId,teamId:s.teamId,strong:!1})}</span>
          <strong>${s.points}</strong>
        </div>
      `).join("")}
    </div>`}function ng(e,t){return`
    <div class="season-standings-country-anchor" tabindex="0">
      <span class="season-standings-country-name">${et(e.teamName,e.teamId,!1)}</span>
      <div class="season-standings-country-popover">
        ${rg(e,t)}
      </div>
    </div>`}async function ig(e){const t=await j.getSeasonStandings();if(!t.success){d.seasonStandings=null,ye("season-standings")&&Hs();return}d.seasonStandings=t.data??null,ye("season-standings")&&Hs()}function Hs(){var g,b,y,v,T,w;const e=h("season-standings-meta"),t=h("season-standings-scope-tabs"),a=h("season-standings-empty"),s=h("season-standings-table"),r=h("season-standings-tbody"),n=h("season-standings-jersey-header"),i=h("season-standings-primary-header"),o=h("season-standings-flag-header"),c=h("season-standings-secondary-header"),l=((g=d.seasonStandings)==null?void 0:g.season)??((b=d.gameState)==null?void 0:b.season)??((y=d.currentSave)==null?void 0:y.currentSeason)??null;e.textContent=l!=null?`Saison ${l} · Ergebnis- und Trikotpunkte kumuliert`:"Noch keine Saisonwertung geladen.",t.innerHTML=`
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
  `;const p=d.selectedSeasonStandingScope==="countries",u=p?((v=d.seasonStandings)==null?void 0:v.countryStandings)??[]:d.selectedSeasonStandingScope==="teams"?((T=d.seasonStandings)==null?void 0:T.teamStandings)??[]:((w=d.seasonStandings)==null?void 0:w.riderStandings)??[],m=p?u:[],f=p?[]:u;if(n.textContent="Trikot",i.textContent=p?"Land":d.selectedSeasonStandingScope==="teams"?"Team":"Fahrer",o.textContent="Flagge",c.textContent=d.selectedSeasonStandingScope==="teams"?"Land":"Team",n.classList.toggle("hidden",p),c.classList.toggle("hidden",p),!d.seasonStandings||u.length===0){r.innerHTML="",s.classList.add("hidden"),a.classList.remove("hidden"),a.textContent="Noch keine Saisonpunkte vorhanden.";return}r.innerHTML=p?m.map(M=>`
      <tr>
        <td class="pos-${Math.min(M.rank,3)}">${M.rank}</td>
        <td class="results-jersey-col-cell hidden"></td>
        <td class="season-standings-country-cell">${sg(M)}</td>
        <td class="results-flag-col-cell">${tt(M.countryCode)}</td>
        <td class="hidden"></td>
        <td>${M.points}</td>
        <td>${S(Gn(M.gapPoints))}</td>
      </tr>`).join(""):f.map(M=>{var D;const $=M.riderName??M.teamName,E=jt(M.teamId,M.teamName),R=d.selectedSeasonStandingScope==="teams"?ng(M,((D=d.seasonStandings)==null?void 0:D.riderStandings)??[]):Ot($,!0,!1,M.riderId,M.teamId),N=tt(M.countryCode),P=d.selectedSeasonStandingScope==="teams"?S(M.countryName??M.countryCode??"–"):et(M.teamName??"–",M.teamId,!1);return`
        <tr>
          <td class="pos-${Math.min(M.rank,3)}">${M.rank}</td>
          <td class="results-jersey-col-cell">${E}</td>
          <td>${R}</td>
          <td class="results-flag-col-cell">${N}</td>
          <td>${P}</td>
          <td>${M.points}</td>
          <td>${S(Gn(M.gapPoints))}</td>
        </tr>`}).join(""),a.classList.add("hidden"),s.classList.remove("hidden")}function og(){h("season-standings-scope-tabs").addEventListener("click",e=>{const t=e.target.closest("button[data-season-scope]");if(!t)return;const a=t.dataset.seasonScope;a!=="riders"&&a!=="teams"&&a!=="countries"||(d.selectedSeasonStandingScope=a,Hs())})}function Hn(e){const t=(e??"").toLowerCase();return t.includes("tour de france")?0:t.includes("grand tour")?1:t.includes("monument")?2:t.includes("stage race high")?3:t.includes("one day high")?4:t.includes("stage race middle")?5:t.includes("one day middle")?6:t.includes("stage race low")?7:t.includes("one day low")?8:9}function lg(e){const t=l=>l.skills.mountain*.7+l.skills.timeTrial*.3,a=l=>l.skills.sprint*.7+l.skills.acceleration*.3,s=[...e].map(l=>({rider:l,score:t(l)})).sort((l,p)=>p.score-l.score).slice(0,10),r=[...e].map(l=>({rider:l,score:a(l)})).sort((l,p)=>p.score-l.score).slice(0,10),n=[...e].map(l=>({rider:l,score:l.skills.mountain})).sort((l,p)=>p.score-l.score).slice(0,10),i=[...e].map(l=>({rider:l,score:l.skills.hill})).sort((l,p)=>p.score-l.score).slice(0,10),o=[...e].map(l=>({rider:l,score:l.skills.cobble})).sort((l,p)=>p.score-l.score).slice(0,10),c=[...e].map(l=>({rider:l,score:l.skills.attack})).sort((l,p)=>p.score-l.score).slice(0,10);return{Gesamtklassement:s,Sprinter:r,Bergfahrer:n,Hügelspezialist:i,Pflasterspezialist:o,Angreifer:c}}function dg(e,t){const a=d.riders.filter(o=>o.activeTeamId===e);if(a.length===0)return 0;const s=o=>o.skills.mountain*.7+o.skills.timeTrial*.3,r=o=>o.skills.sprint*.7+o.skills.acceleration*.3;let n=[];t==="Gesamtklassement"?n=a.map(o=>s(o)):t==="Sprinter"?n=a.map(o=>r(o)):t==="Bergfahrer"?n=a.map(o=>o.skills.mountain):t==="Hügelspezialist"?n=a.map(o=>o.skills.hill):t==="Pflasterspezialist"?n=a.map(o=>o.skills.cobble):t==="Angreifer"&&(n=a.map(o=>o.skills.attack)),n.sort((o,c)=>c-o);const i=n.slice(0,8);return i.length===0?0:i.reduce((o,c)=>o+c,0)/i.length}function cg(e,t){var i;const s=d.teams.filter(o=>o.division==="WorldTour"||o.divisionName==="WorldTour").map(o=>({teamId:o.id,avgScore:dg(o.id,t)}));s.sort((o,c)=>c.avgScore-o.avgScore);const r=s.findIndex(o=>o.teamId===e)+1,n=((i=s.find(o=>o.teamId===e))==null?void 0:i.avgScore)??0;return{rank:r,total:s.length,average:n}}function ug(e){const t=d.riders.filter(r=>r.activeTeamId===e);if(t.length===0)return 0;const a=t.map(r=>r.overallRating??0);a.sort((r,n)=>n-r);const s=a.slice(0,10);return s.length===0?0:s.reduce((r,n)=>r+n,0)/s.length}function mg(e){var n;const a=d.teams.filter(i=>i.division==="WorldTour"||i.divisionName==="WorldTour").map(i=>({teamId:i.id,avgScore:ug(i.id)}));a.sort((i,o)=>o.avgScore-i.avgScore);const s=a.findIndex(i=>i.teamId===e)+1,r=((n=a.find(i=>i.teamId===e))==null?void 0:n.avgScore)??0;return{rank:s,total:a.length,average:r}}function Ea(e){return e===1?{color:"#fbbf24",bg:"rgba(251, 191, 36, 0.1)"}:e===2?{color:"#cbd5e1",bg:"rgba(203, 213, 225, 0.1)"}:e===6?{color:"#4ade80",bg:"rgba(74, 222, 128, 0.1)"}:e===3?{color:"#c084fc",bg:"rgba(192, 132, 252, 0.1)"}:e===4?{color:"#38bdf8",bg:"rgba(56, 189, 248, 0.1)"}:e===5?{color:"#fb923c",bg:"rgba(251, 146, 60, 0.1)"}:{color:"var(--text-200)",bg:"rgba(255, 255, 255, 0.05)"}}function Ss(e){e.countryCode&&ie(e.countryCode);const t=lg(e.riders),a=[...e.riders].map(l=>({rider:l,formValue:l.formBonus+l.raceFormBonus})).sort((l,p)=>p.formValue-l.formValue).slice(0,10),s=[...e.riders].map(l=>({rider:l,uciRank:Ya(l.id)})).filter(l=>l.uciRank!==null).sort((l,p)=>l.uciRank-p.uciRank).slice(0,10),r=Object.entries(t).map(([l,p])=>{const u=cg(e.teamId,l),m=u.average.toFixed(1).replace(".",","),f=p.map(({rider:g,score:b})=>{const y=`${g.firstName.charAt(0)}. ${g.lastName}`,v=Fe(y,{riderId:g.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),T=g.nationality?je[g.nationality]??g.nationality.slice(0,2).toLowerCase():null,w=T?`<span class="fi fi-${T} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(g.nationality)}"></span>`:"",M=d.riders.find(E=>E.id===g.id);return`
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; display: flex; align-items: center; color: ${Ea((M==null?void 0:M.roleId)??null).color};">
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
    `}).join(""),i=[...e.riders].sort((l,p)=>(p.overallRating??0)-(l.overallRating??0)).slice(0,10).map(l=>{const p=`${l.firstName.charAt(0)}. ${l.lastName}`,u=Fe(p,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),m=l.nationality?je[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,f=m?`<span class="fi fi-${m} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",g=l.overallRating.toFixed(0),b=d.riders.find(v=>v.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ea((b==null?void 0:b.roleId)??null).color};">
          ${f}
          ${u}
        </span>
        <span style="font-weight: 700; color: var(--text-300); font-size: 0.8rem;">${g}</span>
      </li>
    `}).join(""),o=a.map(({rider:l,formValue:p})=>{const u=`${l.firstName.charAt(0)}. ${l.lastName}`,m=Fe(u,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?je[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"",b=(p>=0?"+":"")+p.toFixed(1).replace(".",","),y=`S-Form: ${l.formBonus>=0?"+":""}${l.formBonus.toFixed(1)} / R-Form: ${l.raceFormBonus>=0?"+":""}${l.raceFormBonus.toFixed(1)}`,v=d.riders.find(w=>w.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ea((v==null?void 0:v.roleId)??null).color};">
          ${g}
          ${m}
        </span>
        <span style="font-weight: 700; color: #fbbf24;" title="${y}">${b}</span>
      </li>
    `}).join(""),c=s.map(({rider:l,uciRank:p})=>{const u=`${l.firstName.charAt(0)}. ${l.lastName}`,m=Fe(u,{riderId:l.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),f=l.nationality?je[l.nationality]??l.nationality.slice(0,2).toLowerCase():null,g=f?`<span class="fi fi-${f} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px; margin-right: 0.25rem;" title="${S(l.nationality)}"></span>`:"";let b="rider-stats-rank-badge-gc";p===1?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-1":p===2?b="rider-stats-rank-badge-place rider-stats-rank-badge-top-2":p===3&&(b="rider-stats-rank-badge-place rider-stats-rank-badge-top-3");const y=`<span class="rider-stats-rank-badge ${b}" style="margin: 0; font-size: 0.75rem; padding: 0; min-width: 2rem; height: 1.35rem; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; line-height: 1;" title="UCI Weltrangliste: Platz ${p}">${p}</span>`,v=d.riders.find(w=>w.id===l.id);return`
      <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; font-size: 0.85rem;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 75%; display: flex; align-items: center; color: ${Ea((v==null?void 0:v.roleId)??null).color};">
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
          <ul style="margin: 0; padding: 0; list-style: none;">${c||'<li class="text-muted" style="font-size:0.85rem;">Keine Fahrer platziert</li>'}</ul>
        </div>
      </div>
    </div>
  `}function ks(){return`
    <div class="team-detail-page-tabs rider-stats-tabs" role="tablist" aria-label="Teamstats Tabs">
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="topResults"?" team-detail-page-tab-active":""}" data-team-stats-tab="topResults" aria-selected="${d.teamStatsTab==="topResults"?"true":"false"}">Top - Results</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="career"?" team-detail-page-tab-active":""}" data-team-stats-tab="career" aria-selected="${d.teamStatsTab==="career"?"true":"false"}">Erfolgsbilanz</button>
      <button type="button" class="team-detail-page-tab${d.teamStatsTab==="contracts"?" team-detail-page-tab-active":""}" data-team-stats-tab="contracts" aria-selected="${d.teamStatsTab==="contracts"?"true":"false"}">Auslaufende Verträge</button>
    </div>`}function pg(e){const t=Array.from(new Set(e.topResults.map(m=>m.raceCategoryName).filter(Boolean)));t.sort((m,f)=>m.localeCompare(f,"de"));const a=Array.from(new Set(e.topResults.map(m=>m.season))).sort((m,f)=>f-m);let s=e.topResults.filter(m=>m.rowType!=="stage_result"?m.rowType==="gc_final"?d.teamStatsTopResultsFilters.gc:m.rowType==="mountain_final"?d.teamStatsTopResultsFilters.mountain:m.rowType==="points_final"?d.teamStatsTopResultsFilters.points:m.rowType==="youth_final"?d.teamStatsTopResultsFilters.youth:!0:m.profile==="TTT"||m.isStageRace||m.stageNumber!=null?d.teamStatsTopResultsFilters.stage:d.teamStatsTopResultsFilters.oneDay);if(d.teamStatsTopResultsFilterCategory){const m=d.teamStatsTopResultsFilterCategory;if(m.endsWith("-etappen")){const f=m.substring(0,m.length-8);s=s.filter(g=>g.raceCategoryName===f&&g.rowType==="stage_result")}else if(m.endsWith("-gc")){const f=m.substring(0,m.length-3);s=s.filter(g=>g.raceCategoryName===f&&g.rowType!=="stage_result")}else s=s.filter(f=>f.raceCategoryName===m)}d.teamStatsTopResultsFilterSeason!=null&&(s=s.filter(m=>m.season===d.teamStatsTopResultsFilterSeason)),s.sort((m,f)=>{if(f.seasonPoints!==m.seasonPoints)return f.seasonPoints-m.seasonPoints;const g=m.rowType!=="stage_result",b=f.rowType!=="stage_result",y=m.resultRank??9999,v=f.resultRank??9999;if(d.teamStatsTopResultsFilterCategory)return y!==v?y-v:g!==b?g?-1:1:0;{const T=Hn(m.raceCategoryName),w=Hn(f.raceCategoryName);return T!==w?T-w:g!==b?g?-1:1:y-v}});const r=20,n=Math.max(1,Math.min(10,Math.ceil(s.length/r)));d.teamStatsTopResultsPage>n&&(d.teamStatsTopResultsPage=n);const i=(d.teamStatsTopResultsPage-1)*r,o=s.slice(i,i+r),l=`
    <div class="rider-stats-top-results-filters" style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Rennklasse:</label>
        <select id="team-stats-filter-category" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">Alle Rennklassen</option>
          ${t.map(m=>{if(m.toLowerCase().includes("stage race")||m.toLowerCase().includes("grand tour")||m.toLowerCase().includes("tour de france")){const g=`${m}-etappen`,b=`${m}-gc`;return`
        <option value="${S(g)}" ${d.teamStatsTopResultsFilterCategory===g?"selected":""}>${S(m)} - Etappen</option>
        <option value="${S(b)}" ${d.teamStatsTopResultsFilterCategory===b?"selected":""}>${S(m)} - GC</option>
      `}else return`<option value="${S(m)}" ${d.teamStatsTopResultsFilterCategory===m?"selected":""}>${S(m)}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group" style="margin: 0; display: flex; align-items: center;">
        <label style="margin-right: 0.5rem; font-weight: 600; white-space: nowrap; color: #ccc;">Saison:</label>
        <select id="team-stats-filter-season" class="form-control" style="width: auto; display: inline-block; background: #222; color: #fff; border-color: #444;">
          <option value="all">All Time</option>
          ${a.map(m=>`<option value="${m}" ${d.teamStatsTopResultsFilterSeason===m?"selected":""}>Saison ${m}</option>`).join("")}
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
  `,p=o.length===0?'<tr><td colspan="11" class="text-center text-muted" style="padding: 2rem;">Keine Ergebnisse für diese Filterkombination.</td></tr>':o.map(m=>{const f=m.rowType!=="stage_result",g=f?`${m.raceName} · ${m.rowType==="gc_final"?"Gesamtwertung":m.rowType==="points_final"?"Punktewertung":m.rowType==="mountain_final"?"Bergwertung":"Nachwuchs"}`:m.stageNumber?`${m.raceName} · Etappe ${m.stageNumber}`:m.raceName;let b="–",y="–";m.finishStatus==="otl"?b=Tt("OTL","place"):m.finishStatus==="dnf"?b=Tt("DNF","place"):m.resultRank==null||(f?y=`<span class="rider-stats-final-type ${m.rowType==="gc_final"?"is-gc":m.rowType==="points_final"?"is-points":m.rowType==="mountain_final"?"is-mountain":"is-youth"}" style="font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid; display: inline-block; min-width: 1.8rem; text-align: center;">${m.resultRank}</span>`:b=`<span class="rider-stats-rank-badge rider-stats-rank-badge-place${m.resultRank<=3?` rider-stats-rank-badge-top-${m.resultRank}`:""}">${S(String(m.resultRank))}</span>`);const v=m.profile?ua(m.profile):"–",T=!f&&m.stageScore!=null&&m.stageScore>0?ss(m.stageScore,0,350):"–",w=Ua(m.raceCategoryName),M=m.riderCountryCode?je[m.riderCountryCode]??m.riderCountryCode.slice(0,2).toLowerCase():null,$=M?`<span class="fi fi-${M} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(m.riderCountryCode??"")}"></span>`:"–",E=Fe(m.riderName,{riderId:m.riderId,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"});return`
          <tr class="rider-stats-row${f?" rider-stats-row-final":""}">
            <td>${b}</td>
            <td>${y}</td>
            <td>${$}</td>
            <td style="white-space: nowrap;">${E}</td>
            <td><strong>${S(g)}</strong></td>
            <td class="status-cell">${nr(m)}</td>
            <td>${v}</td>
            <td>${T}</td>
            <td>${w}</td>
            <td>Saison ${m.season}</td>
            <td><strong>${m.seasonPoints}</strong></td>
          </tr>
        `}).join(""),u=n>1?`
      <div class="pagination-wrap" style="display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; align-items: center;">
        <button type="button" class="btn btn-secondary btn-sm" data-team-top-results-page="${d.teamStatsTopResultsPage-1}" ${d.teamStatsTopResultsPage===1?"disabled":""}>&laquo; Zurück</button>
        ${Array.from({length:n}).map((m,f)=>{const g=f+1;return`<button type="button" class="btn btn-sm ${d.teamStatsTopResultsPage===g?"btn-primary":"btn-secondary"}" data-team-top-results-page="${g}">${g}</button>`}).join("")}
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
      ${u}
    </section>
  `}function gg(e){const t=String(d.teamStatsSelectedSeason),a=e.successStats[t]||{breakawayAttempts:0,attacks:0,counterAttacks:0,crashes:0,defects:0,illnesses:0,illnessDays:0,injuries:0,injuryDays:0,dnsCount:0,dnfCount:0,otlCount:0,totalGcWins:0,totalStageWins:0,successfulBreakaways:0,raceDays:0,superteamCount:0,categories:{}},s=t==="all",r=u=>s?u:"–",n=(u,m)=>s?`${u} / ${m} T`:"–",i=s?"":' title="Dieser Wert wird systemweit nur all-time erfasst."',o=(u,m,f,g)=>{const b=typeof u=="number"?u:parseFloat(String(u))||0;let y="padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; min-width: 1.8rem; text-align: center; display: inline-block; box-sizing: border-box;";return b===0?y+="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);":m==="gold"?y+="background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); text-shadow: 0 0 1px rgba(255,255,255,0.3);":m==="silver"?y+="background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #000; box-shadow: 0 0 5px rgba(229, 231, 235, 0.4);":m==="bronze"?y+="background: linear-gradient(135deg, #d35400, #a04000); color: #fff; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);":m==="purple"?y+="background: linear-gradient(135deg, #a855f7, #7e22ce); color: #fff; box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);":m==="green"?y+="background: #2ecc71; color: #fff; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4);":m==="red"?y+="background: #e74c3c; color: #fff; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4);":m==="white"&&(y+="background: #ffffff; color: #000; border: 1px solid #ccc; box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);"),`<span style="${y}" title="${S(f)}: ${b} Siege">${u}</span>`},c=[{key:"World Tour - Tour de France",name:"Tour de France",isStage:!0},{key:"World Tour - Grand Tour",name:"Grand Tour",isStage:!0},{key:"World Tour - Monument",name:"Monumente",isStage:!1},{key:"World Tour - Stage Race High",name:"Stage Race (High)",isStage:!0},{key:"World Tour - Stage Race Middle",name:"Stage Race (Middle)",isStage:!0},{key:"World Tour - Stage Race Low",name:"Stage Race (Low)",isStage:!0},{key:"World Tour - One Day High",name:"One Day (High)",isStage:!1},{key:"World Tour - One Day Middle",name:"One Day (Middle)",isStage:!1},{key:"World Tour - One Day Low",name:"One Day (Low)",isStage:!1}],l=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #fff;">Karrierestatistiken (Team)</h3>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="team-stats-success-season-select" style="font-size: 0.85rem; color: #aaa; font-weight: 500;">Saison filtern:</label>
        <select id="team-stats-success-season-select" class="form-control" style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;">
          <option value="all" ${s?"selected":""}>Ewig (All-Time)</option>
          ${Object.keys(e.successStats).filter(u=>u!=="all").sort((u,m)=>m.localeCompare(u)).map(u=>`
            <option value="${u}" ${String(d.teamStatsSelectedSeason)===u?"selected":""}>Saison ${u}</option>
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
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Superteam</div>
          <div style="font-size: 1.75rem; font-weight: bold; color: #6366f1;">${a.superteamCount??0}</div>
        </div>
      </div>

      <!-- Categories details -->
      <h3 style="margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; font-weight: 500; font-size: 1.15rem; color: #fff;">Ergebnisse nach Rennklasse</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 1.25rem;">
        ${c.map(u=>{const m=a.categories[u.key]||{gcWins:0,gcSecond:0,gcThird:0,gcTopTen:0,stageWins:0,stageSecond:0,stageThird:0,stageTopTen:0,oneDayWins:0,oneDaySecond:0,oneDayThird:0,oneDayTopTen:0,mountainWins:0,pointsWins:0,youthWins:0,breakawayWins:0,raceDays:0,leaderJerseys:0,pointsJerseys:0,mountainJerseys:0,youthJerseys:0,breakawayJerseys:0,sprintWins:0,climbWinsHC:0,climbWins1:0,climbWins2:0,climbWins3:0,climbWins4:0,winFlat:0,winRolling:0,winHilly:0,winHillyDifficult:0,winMediumMountain:0,winMountain:0,winHighMountain:0,winCobble:0,winCobbleHill:0,winITT:0,winTTT:0,winWeather1:0,winWeather2:0,winWeather3:0,winWeather4:0,winWeather5:0,winWeather6:0,winWeather7:0};return`
            <div style="position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; height: 415px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; overflow: hidden; white-space: nowrap;">
                <span style="font-weight: 600; font-size: 0.9rem; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70%;" title="${S(u.name)}">${S(u.name)}</span>
                ${sr(u.key)}
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
                  ${ne(m.winFlat||0,"flat","Flach (Flat)")}
                  ${ne(m.winRolling||0,"rolling","Hügelig leicht (Rolling)")}
                  ${ne(m.winHilly||0,"hilly","Hügelig (Hilly)")}
                  ${ne(m.winHillyDifficult||0,"hilly_difficult","Hügelig schwer (Hilly Difficult)")}
                  ${ne(m.winMediumMountain||0,"medium_mountain","Mittelgebirge (Medium Mountain)")}
                  ${ne(m.winMountain||0,"mountain","Hochgebirge (Mountain)")}
                  ${ne(m.winHighMountain||0,"high_mountain","Hochgebirge schwer (High Mountain)")}
                  ${ne(m.winCobble||0,"cobble","Kopfsteinpflaster (Cobble)")}
                  ${ne(m.winCobbleHill||0,"cobble_hill","Kopfsteinpflaster Hügel (Cobble Hill)")}
                  ${ne(m.winITT||0,"itt","Einzelzeitfahren (ITT)")}
                  ${ne(m.winTTT||0,"ttt","Mannschaftszeitfahren (TTT)")}
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
                ${te.raceDays}
                <span style="font-weight: bold; color: #a855f7; margin-left: 0.25rem;">${m.raceDays||0} Tage</span>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `}function fg(e){var r;const t=((r=d.gameState)==null?void 0:r.season)??new Date().getFullYear(),a=[...e.riders].sort((n,i)=>{const o=n.contractEndSeason??9999,c=i.contractEndSeason??9999;return o!==c?o-c:i.overallRating-n.overallRating});return`
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
            ${a.length===0?'<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">Keine Vertragsdaten verfügbar.</td></tr>':a.map(n=>{const i=n.nationality?je[n.nationality]??n.nationality.slice(0,2).toLowerCase():null,o=i?`<span class="fi fi-${i} results-roster-flag" style="display:inline-block; vertical-align:middle; width:16px; height:12px;" title="${S(n.nationality)}"></span>`:"–",c=Fe(`${n.firstName} ${n.lastName}`,{riderId:n.id,teamId:e.teamId,strong:!0,linkClassName:"results-rider-link",labelClassName:"results-participant-label"}),l=d.riders.find(b=>b.id===n.id),p=`<span class="results-roster-overall-badge" style="color:${zn(n.overallRating)}" title="Stärke: ${n.overallRating.toFixed(2)}">${n.overallRating.toFixed(1)}</span>`;let u="–";l&&l.potential!=null&&(u=`<span class="results-roster-overall-badge" style="color:${zn(l.potential)}" title="Potential: ${l.potential.toFixed(2)}">${l.potential.toFixed(1)}</span>`);const m=n.contractEndSeason===t,f=n.contractEndSeason?`Saison ${n.contractEndSeason}`:"Ohne Vertrag",g=m?`<span class="badge badge-race-category" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: bold; animation: pulse 2s infinite;" title="Vertrag läuft in dieser Saison aus!">${S(f)}</span>`:`<span style="font-weight: 500;">${S(f)}</span>`;return`
          <tr class="rider-stats-row">
            <td>${o}</td>
            <td style="white-space: nowrap;">${c}</td>
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
  `}function zn(e){return e>=85?"#22c55e":e>=78?"#86efac":e>=72?"#fbbf24":e>=66?"#fb923c":e>=60?"#f87171":"#94a3b8"}function ft(e){return d.teamStatsTab==="career"?`
      ${Ss(e)}
      ${ks()}
      ${gg(e)}
    `:d.teamStatsTab==="contracts"?`
      ${Ss(e)}
      ${ks()}
      ${fg(e)}
    `:`
    ${Ss(e)}
    ${ks()}
    ${pg(e)}
  `}function hg(e,t){var s;if(e==null)return'<span class="results-team-jersey-placeholder" style="width: 54px; height: 54px; display: inline-block;" aria-hidden="true"></span>';const a=t??((s=d.teams.find(r=>r.id===e))==null?void 0:s.name)??`Team ${e}`;return`
    <span class="results-team-jersey large-jersey" title="${S(a)}" aria-label="${S(a)}" style="width: 54px; height: 54px; display: inline-block;">
      <img
        class="results-team-jersey-img"
        src="${S(ti(e))}"
        alt=""
        width="54"
        height="54"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='/jersey/Jer_placeholder.svg';"
        style="width: 54px; height: 54px;"
      >
    </span>`}async function Wo(e){d.teamStatsSelectedTeamId=e,d.teamStatsTab="topResults",d.teamStatsTopResultsFilterCategory=null,d.teamStatsTopResultsFilterSeason=null,d.teamStatsSelectedSeason="all",d.teamStatsTopResultsPage=1;const t=d.teams.find(n=>n.id===e);h("team-stats-title").innerHTML=t?`Team <strong>${S(t.name)}</strong>`:"Teamstatistik",h("team-stats-jersey").innerHTML=hg(e,(t==null?void 0:t.name)??"");const a=mg(e),s=a.average.toFixed(2).replace(".",",");h("team-stats-meta").innerHTML=t?`${S(t.abbreviation)} · ${S(t.divisionName||t.division||"–")} · <strong>Overall-Stärke (Top 10):</strong> Platz ${a.rank}/${a.total} (Ø ${s})`:"Daten werden geladen",h("team-stats-body").innerHTML=`
    <section class="rider-stats-placeholder">
      <h3>Statistiken werden geladen</h3>
      <p>Die Teamergebnisse und Fahrerdaten werden zusammengestellt.</p>
    </section>
  `,Ve("teamStats");const r=await j.getTeamStats(e);if(d.teamStatsSelectedTeamId===e){if(!r.success||!r.data){h("team-stats-body").innerHTML=`
      <section class="rider-stats-placeholder">
        <h3>Statistiken konnten nicht geladen werden</h3>
        <p>${S(r.error??"Unbekannter Fehler")}</p>
      </section>
    `;return}d.teamStatsPayload=r.data,h("team-stats-body").innerHTML=ft(r.data)}}function bg(){h("team-stats-body").addEventListener("click",e=>{const t=e.target,a=t.closest("button[data-team-stats-tab]");if(a){const r=a.dataset.teamStatsTab;(r==="topResults"||r==="career"||r==="contracts")&&(d.teamStatsTab=r,d.teamStatsPayload&&(h("team-stats-body").innerHTML=ft(d.teamStatsPayload)));return}const s=t.closest("button[data-team-top-results-page]");if(s){const r=Number(s.dataset.teamTopResultsPage);!isNaN(r)&&r>=1&&(d.teamStatsTopResultsPage=r,d.teamStatsPayload&&(h("team-stats-body").innerHTML=ft(d.teamStatsPayload)));return}}),h("team-stats-body").addEventListener("change",e=>{const t=e.target;if(t.id==="team-stats-filter-category"){const a=t;d.teamStatsTopResultsFilterCategory=a.value==="all"?null:a.value,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(h("team-stats-body").innerHTML=ft(d.teamStatsPayload))}else if(t.id==="team-stats-filter-season"){const a=t;d.teamStatsTopResultsFilterSeason=a.value==="all"?null:Number(a.value),d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(h("team-stats-body").innerHTML=ft(d.teamStatsPayload))}else if(t.classList.contains("team-stats-filter-checkbox")){const a=t,s=a.dataset.filterType;d.teamStatsTopResultsFilters[s]=a.checked,d.teamStatsTopResultsPage=1,d.teamStatsPayload&&(h("team-stats-body").innerHTML=ft(d.teamStatsPayload))}else if(t.id==="team-stats-success-season-select"){const a=t;d.teamStatsSelectedSeason=a.value==="all"?"all":Number(a.value),d.teamStatsPayload&&(h("team-stats-body").innerHTML=ft(d.teamStatsPayload))}})}let Rt="riders",st="season",kr="season",Oe="";const Xa=["leaderboard-select-performance","leaderboard-select-load","leaderboard-select-physis","leaderboard-select-action","leaderboard-select-jersey","leaderboard-select-events"];function yg(){const e=h("leaderboards-scope-tabs");if(e){const n=e.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-scope");Sg(o)})})}const t=h("leaderboards-period-tabs");if(t){const n=t.querySelectorAll("button");n.forEach(i=>{i.addEventListener("click",()=>{if(i.hasAttribute("disabled"))return;n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-period");kg(o)})})}Xa.forEach(n=>{const i=h(n);i&&i.addEventListener("change",()=>{const o=i.value;o?$g(o,n):Xa.some(l=>{const p=h(l);return p&&p.value!==""})||(Oe="",Gt())})}),window.openRiderStatsFromLeaderboard=_t;const a=h("leaderboard-filter-wt"),s=h("leaderboard-filter-pt"),r=h("leaderboard-filter-other");[a,s,r].forEach(n=>{n&&n.addEventListener("change",()=>{Gt()})})}function vg(){Gt()}function Sg(e){Rt=e;const t=h("leaderboard-group-physis");t&&(t.style.display=e==="teams"?"none":"block"),e==="teams"&&((Tg(Oe)||Oe==="strongest_lieutenants")&&(Mg(),Oe=""),st==="live"&&(st=kr,La())),Gt()}function kg(e){st=e,kr=e,Gt()}function $g(e,t){Oe=e,Xa.forEach(a=>{if(a!==t){const s=h(a);s&&(s.value="")}}),jo(e)?(st="live",La()):$r(e)?(st="alltime",La()):(st=kr,La()),Gt()}function jo(e){return["fatigue_short","fatigue_long","fatigue_combined","form_r","form_s","form_combined"].includes(e)}function $r(e){return["max_short_term_fatigue","max_long_term_fatigue","max_combined_fatigue","max_s_form","max_r_form","max_combined_form","mentors_ranking"].includes(e)||e.startsWith("youngest_winners")}function Tg(e){return jo(e)||$r(e)||e==="mentors_ranking"}function Mg(){Xa.forEach(e=>{const t=h(e);t&&(t.value="")})}function La(){const e=h("leaderboards-period-tabs");if(!e)return;const t=e.querySelector('button[data-period="season"]'),a=e.querySelector('button[data-period="alltime"]');st==="live"?e.style.display="none":(e.style.display="flex",$r(Oe)?(t&&(t.disabled=!0,t.classList.remove("active"),t.style.opacity="0.5",t.style.cursor="not-allowed"),a&&(a.disabled=!1,a.classList.add("active"),a.style.opacity="1",a.style.cursor="pointer")):(t&&(t.disabled=!1,t.style.opacity="1",t.style.cursor="pointer"),a&&(a.disabled=!1,a.style.opacity="1",a.style.cursor="pointer"),st==="season"?(t&&t.classList.add("active"),a&&a.classList.remove("active")):(t&&t.classList.remove("active"),a&&a.classList.add("active"))))}async function Gt(){var u,m,f;const e=h("leaderboard-empty"),t=h("leaderboard-table"),a=h("leaderboard-thead"),s=h("leaderboard-tbody");if(!e||!t||!a||!s)return;const r=h("leaderboard-filter-container");if(r&&(r.style.display=Rt==="teams"?"none":"flex"),!Oe){e.textContent="Wähle eine Statistik aus den Dropdowns oben aus, um die Rangliste zu laden.",e.classList.remove("hidden"),t.classList.add("hidden");return}e.textContent="Lade Daten...",e.classList.remove("hidden"),t.classList.add("hidden");const n=await j.getLeaderboards(Rt,Oe,st);if(!ye("leaderboards"))return;if(!n.success||!n.data||n.data.length===0){e.textContent=n.error||"Keine Einträge für diese Rangliste gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}let i=n.data;if(Rt==="riders"){const g=((u=h("leaderboard-filter-wt"))==null?void 0:u.checked)??!0,b=((m=h("leaderboard-filter-pt"))==null?void 0:m.checked)??!0,y=((f=h("leaderboard-filter-other"))==null?void 0:f.checked)??!1;if(i=n.data.filter(v=>{const T=v.teamDivisionId===1&&!v.isRetired,w=v.teamDivisionId===2&&!v.isRetired,M=v.teamDivisionId===null||v.teamDivisionId===void 0||v.isRetired||v.teamDivisionId!==1&&v.teamDivisionId!==2;return!!(T&&g||w&&b||M&&y)}),i.length===0){e.textContent="Keine Einträge für die ausgewählten Filter gefunden.",e.classList.remove("hidden"),t.classList.add("hidden");return}}e.classList.add("hidden"),t.classList.remove("hidden");const o=Oe==="highest_leadout_bonus",c=Oe==="strongest_lieutenants";Rt==="riders"?a.innerHTML=`
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
    `;let l="",p=1;for(const g of i){const b=p++,v=`<span class="badge ${b===1?"badge-primary":b<=3?"badge-secondary":"badge-ghost"}" style="min-width: 28px; text-align: center; display: inline-block;">${b}</span>`,T=St(g.teamId,g.teamName);let w="";if(o){const $=g.stageNumber!=null?`Etappe ${g.stageNumber}`:"–";w=`<td style="vertical-align: middle;">${S(g.raceName??"–")} · ${S($)} · ${S(String(g.season??"–"))}</td>`}let M="";if(c)if(g.lieutenantDetails){const $=g.lieutenantDetails,E=$.leaderNationality?ie($.leaderNationality):"",R=$.leaderRoleName?` (${$.leaderRoleName})`:"";M=`
          <td style="vertical-align: middle;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              ${E}
              <a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${$.leaderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">
                ${S($.leaderFirstName)} ${S($.leaderLastName)}
              </a>
              <span class="text-muted" style="font-size: 0.85em;">${S(R)}</span>
            </span>
          </td>
        `}else M='<td style="vertical-align: middle;">–</td>';if(Rt==="riders"){const $=g.nationality?ie(g.nationality):"—",E=`<a href="#" onclick="event.preventDefault(); openRiderStatsFromLeaderboard(${g.riderId})" style="color: #60a5fa; text-decoration: none; font-weight: bold; hover: text-decoration: underline;">${S(g.firstName)} ${S(g.lastName)}</a>`,R=g.teamAbbr?`<span class="text-muted" title="${S(g.teamName??"")}">${S(g.teamAbbr)}</span>`:"—";l+=`
        <tr>
          <td style="text-align: center; vertical-align: middle;">${v}</td>
          <td style="text-align: center; vertical-align: middle;">${T}</td>
          <td style="text-align: center; vertical-align: middle;">${$}</td>
          <td style="vertical-align: middle;">${E}</td>
          <td style="vertical-align: middle;">${R}</td>
          ${w}
          ${M}
          <td style="text-align: right; font-weight: bold; color: #34d399; vertical-align: middle;">${S(String(g.value))}</td>
        </tr>
      `}else{let $="";if(g.leadoutDetails){const E=g.leadoutDetails,R=E.sprinterNationality?ie(E.sprinterNationality):"";$=`
          <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">${S(g.teamName.split(" (Sprinter:")[0])}</div>
          <div style="margin-top: 0.3rem; padding-left: 0.75rem; border-left: 2px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.825rem;">
            <div style="color: #94a3b8; display: flex; align-items: center; gap: 0.35rem;">
              <span>Sprinter:</span>
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: #facc15;">
                ${R}${S(E.sprinterLastName)}
              </span>
            </div>
            <div style="color: #94a3b8; display: flex; flex-direction: column; gap: 0.15rem; margin-top: 0.1rem;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 0.1rem;">Leadout Helfer:</span>
              ${E.contributors.map(N=>`
                  <div style="display: flex; align-items: center; gap: 0.35rem; padding-left: 0.5rem; color: #cbd5e1;">
                    <span>•</span>
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      ${N.nationality?ie(N.nationality):""}${S(N.lastName)}
                    </span>
                    <span style="color: #34d399; font-weight: 500;">(+${N.contribution.toFixed(2)})</span>
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
      `}}s.innerHTML=l}let Dt=2026,De=5,Kn=!1;const xg=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];function Wn(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${s}`}function wg(e){var r;const t=(r=d.gameState)==null?void 0:r.currentDate;if(!t||e<=t)return;const a=re(e);confirm(`Möchtest du automatisch bis zum ${a} simulieren?`)&&(d.autoProgressTargetDate=e,Do())}function Ig(e,t){const a=[],s=new Date(e,t,1),r=new Date(e,t+1,0);let i=(s.getDay()+6)%7;const o=new Date(s);o.setDate(o.getDate()-i);const c=new Date(o);for(;c<=r||c.getDay()!==1;){const l=[];for(let p=0;p<7;p++)l.push(new Date(c)),c.setDate(c.getDate()+1);a.push(l)}return a}function Rg(){if(Kn)return;Kn=!0,h("calendar-prev-month").addEventListener("click",()=>{De--,De<0&&(De=11,Dt--),Da()}),h("calendar-next-month").addEventListener("click",()=>{De++,De>11&&(De=0,Dt++),Da()}),h("calendar-today-btn").addEventListener("click",()=>{var t;if((t=d.gameState)!=null&&t.currentDate){const[a,s]=d.gameState.currentDate.split("-").map(Number);Dt=a,De=s-1}Da()}),h("calendar-race-search").addEventListener("input",()=>{Oo()}),h("calendar-weeks").addEventListener("click",t=>{const a=t.target.closest(".calendar-event-bar");if(a){const r=Number(a.dataset.raceId);Number.isFinite(r)&&Bs(r);return}const s=t.target.closest("[data-calendar-date]");if(s){const r=s.dataset.calendarDate;r&&wg(r)}}),h("calendar-races-tbody").addEventListener("click",t=>{const a=t.target.closest(".dashboard-race-link");if(a){const r=Number(a.dataset.dashboardRaceId);Number.isFinite(r)&&Bs(r);return}const s=t.target.closest("button[data-dashboard-race-participants-id]");if(s){const r=Number(s.dataset.dashboardRaceParticipantsId);Number.isFinite(r)&&No(r)}});const e=document.querySelector(".calendar-layout-container");e&&(e.addEventListener("mouseenter",t=>{const a=t.target.closest("[data-race-id]");if(a){const s=a.dataset.raceId;s&&document.querySelectorAll(`[data-race-id="${s}"]`).forEach(r=>{r.classList.add("calendar-highlight")})}},!0),e.addEventListener("mouseleave",t=>{const a=t.target.closest("[data-race-id]");if(a){const s=a.dataset.raceId;s&&document.querySelectorAll(`[data-race-id="${s}"]`).forEach(r=>{r.classList.remove("calendar-highlight")})}},!0))}function Eg(){var e;if((e=d.gameState)!=null&&e.currentDate){const[t,a]=d.gameState.currentDate.split("-").map(Number);Dt=t,De=a-1}Da()}function Da(){var r;if(!ye("calendar"))return;h("calendar-month-label").textContent=`${xg[De]} ${Dt}`;const e=Ig(Dt,De),t=h("calendar-weeks"),a=((r=d.gameState)==null?void 0:r.currentDate)??"";let s="";for(const n of e){const i=n.map(Wn),o=[];for(const u of d.races)if(u.startDate<=i[6]&&u.endDate>=i[0]){const m=u.startDate<i[0]?0:i.indexOf(u.startDate),f=u.endDate>i[6]?6:i.indexOf(u.endDate);o.push({race:u,startIdx:m,endIdx:f})}o.sort((u,m)=>{const f=u.endIdx-u.startIdx+1,g=m.endIdx-m.startIdx+1;return g!==f?g-f:u.startIdx-m.startIdx});const c=Array.from({length:3},()=>Array(7).fill(!1));for(const u of o){let m=2;for(let f=0;f<3;f++){let g=!0;for(let b=u.startIdx;b<=u.endIdx;b++)if(c[f][b]){g=!1;break}if(g){m=f;break}}for(let f=u.startIdx;f<=u.endIdx;f++)c[m][f]=!0;u.slot=m}const l=n.map(u=>{const m=Wn(u),f=u.getMonth()!==De,g=m===a,b=m>a;return`
        <div class="${["calendar-day-cell",f?"other-month":"",g?"today":"",b?"is-future":""].filter(Boolean).join(" ")}" data-calendar-date="${m}">
          <span class="calendar-day-number" data-calendar-date="${m}">${u.getDate()}</span>
        </div>
      `}).join(""),p=o.map(u=>{var w;const m=u.race,f=a>=m.startDate&&a<=m.endDate,g=a>m.endDate,b=ra((w=m.category)==null?void 0:w.name),y=f?'<span class="calendar-live-dot"></span>':"",v=g?"opacity: 0.55;":"",T=u.endIdx-u.startIdx+1;return`
        <div class="calendar-event-bar ${f?"is-live":""}"
             data-race-id="${m.id}"
             style="grid-column: ${u.startIdx+1} / span ${T};
                    grid-row: ${u.slot+1};
                    background-color: ${b.background};
                    border: 1px solid ${b.border};
                    color: ${b.color};
                    ${v}"
             title="${S(m.name)} (${re(m.startDate)} - ${re(m.endDate)})">
          ${y}<span class="calendar-event-name">${S(m.name)}</span>
        </div>
      `}).join("");s+=`
      <div class="calendar-week">
        <div class="calendar-day-grid">${l}</div>
        <div class="calendar-event-overlay">${p}</div>
      </div>
    `}t.innerHTML=s,Oo()}function Oo(){var n;const e=h("calendar-race-search"),t=e?e.value.toLowerCase().trim():"",a=h("calendar-races-tbody"),s=((n=d.gameState)==null?void 0:n.currentDate)??"",r=d.races.filter(i=>{var o;return t?i.name.toLowerCase().includes(t)||((o=i.category)==null?void 0:o.name)&&i.category.name.toLowerCase().includes(t):!0}).sort((i,o)=>i.startDate.localeCompare(o.startDate));if(r.length===0){a.innerHTML='<tr><td colspan="9" class="text-muted" style="text-align: center; padding: 20px;">Keine Rennen gefunden.</td></tr>';return}a.innerHTML=r.map(i=>{var y,v,T,w;const o=s>=i.startDate&&s<=i.endDate,l=s>i.endDate?'<span class="badge badge-done">Abgeschlossen</span>':o?'<span class="badge badge-live">Läuft</span>':'<span class="badge badge-todo">Geplant</span>',p=((y=i.country)==null?void 0:y.name)??`Land ${i.countryId}`,u=(v=i.country)!=null&&v.code3?ie(i.country.code3):"",m=i.isStageRace?(i.stages??[]).reduce((M,$)=>M+($.distanceKm??0),0):((T=i.upcomingStage)==null?void 0:T.distanceKm)??null,f=i.isStageRace?(i.stages??[]).reduce((M,$)=>M+($.elevationGainMeters??0),0):((w=i.upcomingStage)==null?void 0:w.elevationGainMeters)??null,g=m!=null?String(m.toFixed(1)).replace(".",","):"-",b=f!=null?String(Math.round(f)):"-";return`
      <tr data-race-id="${i.id}">
        <td>${re(i.startDate)}</td>
        <td>
          <button type="button" class="dashboard-race-link" data-dashboard-race-id="${i.id}">
            <strong>${S(i.name)}</strong>
          </button>
        </td>
        <td>
          <button type="button" class="dashboard-race-link dashboard-race-link-format" data-dashboard-race-id="${i.id}">
            ${fr(i)}
          </button>
        </td>
        <td><span class="dashboard-race-country">${u}<span>${S(p)}</span></span></td>
        <td>${rs(i)}</td>
        <td><button type="button" class="dashboard-race-link" data-dashboard-race-participants-id="${i.id}">Teilnehmer</button></td>
        <td>${g}</td>
        <td>${b}</td>
        <td>${l}</td>
      </tr>
    `}).join("")}window.openTeamStats=Wo;async function Vo(){var e;for(let t=localStorage.length-1;t>=0;t--){const a=localStorage.key(t);a&&(a.startsWith("programAssignmentsLogged_")||a.startsWith("participantCountsLogged_"))&&localStorage.removeItem(a)}Ks("game"),h("meta-career").textContent=((e=d.currentSave)==null?void 0:e.careerName)??"",Mt("dashboard"),ve("Spiel wird geladen…");try{await hr(),await br(),is()}catch(t){alert("Fehler beim Laden des Spiels: "+t.message)}finally{fe()}}function Fg(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var a;const t=e.dataset.view??"";Mt(t),t==="dashboard"&&is(),t==="teams"&&Za(),t==="riders"&&Za(),t==="rider-team-editor"&&zo(),t==="live-race"&&Lt(),t==="results"&&Te(),t==="draft"&&Ko(d.draftSelectedSeason||((a=d.currentSave)==null?void 0:a.currentSeason)||2026),t==="injuries"&&tg(),t==="season-standings"&&ig(),t==="leaderboards"&&vg(),t==="calendar"&&Eg(),(t==="stage-editor-stages"||t==="stage-editor-climbs")&&ro()})}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-rider-link[data-rider-id]");if(!t)return;const a=Number(t.dataset.riderId);Number.isFinite(a)&&_t(a)}),document.body.addEventListener("click",e=>{const t=e.target.closest("button.app-team-link[data-team-id]");if(!t)return;const a=Number(t.dataset.teamId);Number.isFinite(a)&&Wo(a)}),h("btn-cancel-new").addEventListener("click",()=>Ke("newCareer")),h("btn-close-race-stages").addEventListener("click",()=>Ke("raceStages")),h("btn-close-stage-profile").addEventListener("click",()=>Ke("stageProfile")),h("btn-close-rider-program").addEventListener("click",()=>Ke("riderProgram")),h("btn-close-rider-stats").addEventListener("click",()=>Ke("riderStats")),h("btn-close-team-stats").addEventListener("click",()=>Ke("teamStats")),h("btn-close-race-participants").addEventListener("click",()=>Ke("raceParticipants")),h("btn-close-roster-editor").addEventListener("click",()=>As()),h("btn-cancel-roster-editor").addEventListener("click",()=>As()),h("btn-apply-roster-editor").addEventListener("click",()=>{Sp()}),h("btn-back-menu").addEventListener("click",()=>{Yt==null||Yt.pause(),Ks("menu"),na()}),ul(),Ap(),Rg(),$o(),Go(),eg(),kp(),gp(),Bm(),Qm(),bg(),og(),yg()}(async()=>(lm(),ce(),Fg(),Ks("menu"),await na()))();
