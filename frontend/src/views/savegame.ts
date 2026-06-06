import { api } from '../api';
import {
  $,
  esc,
  state,
  formatDate,
  showScreen,
  activateView,
  showLoading,
  hideLoading,
  showModal,
  hideModal,
  showError,
  hideError,
} from '../state';

// We import enterGameScreen dynamically or as a dependency or direct export from '../app'.
// In TypeScript/Vite, we can do a circular-safe import or declare it on window or pass a callback.
// A very clean way is to export a bootstrap function or directly import from '../app'.
// Let's import it from '../app' (Vite/ESBuild handle circular references fine for function calls).
import { enterGameScreen } from '../app';

export async function loadSavesList(): Promise<void> {
  const res = await api.listSaves();
  const container = $('saves-list');
  const deleteAllButton = $('btn-delete-all-careers');
  if (!res.success || !res.data || res.data.length === 0) {
    container.classList.add('hidden');
    deleteAllButton.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');
  deleteAllButton.classList.remove('hidden');
  container.innerHTML = res.data.map(save => `
    <div class="save-card">
      <h3>${esc(save.careerName)}</h3>
      <p class="save-meta">
        ${esc(save.teamName)} · Saison ${save.currentSeason}
        ${save.lastSaved ? '· ' + formatDate(save.lastSaved) : ''}
      </p>
      <div class="save-actions">
        <button class="btn btn-primary btn-sm" data-save-action="load" data-filename="${esc(save.filename)}">Laden</button>
        <button class="btn btn-danger btn-sm" data-save-action="delete" data-filename="${esc(save.filename)}" data-career-name="${esc(save.careerName)}">Löschen</button>
      </div>
    </div>
  `).join('');
}

export async function onLoadSave(filename: string): Promise<void> {
  showLoading('Karriere wird geladen…');
  const res = await api.loadSave(filename);
  hideLoading();
  if (!res.success) { alert('Fehler beim Laden: ' + res.error); return; }
  state.currentSave = res.data ?? null;
  await enterGameScreen();
}

export async function onDeleteSave(filename: string, name: string): Promise<void> {
  if (!confirm(`Karriere "${name}" wirklich löschen?`)) return;
  showLoading('Löschen…');
  const res = await api.deleteSave(filename);
  hideLoading();
  if (!res.success) { alert('Fehler: ' + res.error); return; }
  await loadSavesList();
}

export async function onDeleteAllSaves(): Promise<void> {
  const res = await api.listSaves();
  const saves = res.success ? (res.data ?? []) : [];
  if (saves.length === 0) {
    $('btn-delete-all-careers').classList.add('hidden');
    $('saves-list').classList.add('hidden');
    return;
  }

  if (!confirm(`Wirklich alle ${saves.length} Karrieren löschen?`)) return;
  if (!confirm('Dieser Schritt löscht alle Spielstände dauerhaft. Wirklich fortfahren?')) return;

  showLoading('Alle Karrieren werden gelöscht…');
  try {
    for (const save of saves) {
      const deleteRes = await api.deleteSave(save.filename);
      if (!deleteRes.success) {
        alert(`Fehler beim Löschen von "${save.careerName}": ${deleteRes.error ?? 'Unbekannter Fehler'}`);
        break;
      }
    }
  } finally {
    hideLoading();
  }

  await loadSavesList();
}

export function initSavegameListeners(): void {
  // New Career Button click
  $('btn-new-career').addEventListener('click', async () => {
    hideError('new-career-error');
    ($<HTMLInputElement>('input-career-name')).value = '';
    const select = $<HTMLSelectElement>('input-team-id');
    select.innerHTML = '<option value="">Wird geladen…</option>';
    showModal('newCareer');
    const res = await api.getAvailableTeams();
    if (!res.success || !res.data?.length) {
      select.innerHTML = '<option value="">Fehler beim Laden der Teams</option>';
      return;
    }
    select.innerHTML = res.data.map(t =>
      `<option value="${t.id}">${esc(t.name)} (${esc(t.division ?? t.divisionName ?? '')})</option>`,
    ).join('');
  });

  // Basic cancellations
  $('btn-cancel-new').addEventListener('click', () => hideModal('newCareer'));

  // Confirm New Career button
  $('btn-confirm-new').addEventListener('click', async () => {
    const careerName = ($<HTMLInputElement>('input-career-name')).value.trim();
    const teamIdVal  = ($<HTMLSelectElement>('input-team-id')).value;
    if (!careerName || !teamIdVal) {
      showError('new-career-error', 'Bitte Karriere-Name und Team auswählen.');
      return;
    }
    const teamId = Number(teamIdVal);
    const slug     = careerName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
    const filename = `${slug}_${Date.now()}.db`;
    hideError('new-career-error');
    showLoading('Neue Karriere wird erstellt…');
    const res = await api.createSave(filename, careerName, teamId);
    if (!res.success) { hideLoading(); showError('new-career-error', res.error ?? 'Unbekannter Fehler.'); return; }
    const loadRes = await api.loadSave(filename);
    hideLoading();
    hideModal('newCareer');
    if (!loadRes.success) { alert('Fehler: ' + loadRes.error); return; }
    state.currentSave = loadRes.data ?? null;
    await enterGameScreen();
  });

  // Load / Delete Career operations
  const loadCareerBtn = document.getElementById('btn-load-career');
  if (loadCareerBtn) {
    loadCareerBtn.addEventListener('click', () => loadSavesList());
  }

  const deleteAllCareersBtn = document.getElementById('btn-delete-all-careers');
  if (deleteAllCareersBtn) {
    deleteAllCareersBtn.addEventListener('click', () => {
      void onDeleteAllSaves();
    });
  }

  $('saves-list').addEventListener('click', async (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-save-action]');
    if (!button) return;
    const { saveAction, filename, careerName } = button.dataset;
    if (!filename) return;
    if (saveAction === 'load') { await onLoadSave(filename); return; }
    if (saveAction === 'delete') { await onDeleteSave(filename, careerName ?? filename); }
  });
}
