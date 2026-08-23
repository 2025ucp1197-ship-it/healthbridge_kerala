/**
 * HealthBridge Kerala - Standalone SVG Chart Engine
 * Renders Bar, Donut, Progress, and Area charts for Admin Analytics
 */

const HealthBridgeCharts = (function () {
  function renderBarChart(containerId, data, title = "") {
    const container = document.getElementById(containerId);
    if (!container || !data || data.length === 0) return;

    const maxVal = Math.max(...data.map(d => d.count), 1);
    const height = 200;
    const width = container.clientWidth || 500;
    const barWidth = Math.min(36, Math.max(16, (width / data.length) - 16));
    const paddingBottom = 35;
    const paddingTop = 25;
    const chartHeight = height - paddingBottom - paddingTop;

    let barsSVG = "";
    data.forEach((item, index) => {
      const barH = (item.count / maxVal) * chartHeight;
      const x = (index * (width / data.length)) + ((width / data.length - barWidth) / 2);
      const y = height - paddingBottom - barH;

      barsSVG += `
        <g class="chart-bar-group">
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="4" fill="url(#barGradient)" />
          <text x="${x + barWidth/2}" y="${y - 6}" text-anchor="middle" font-size="11" font-weight="700" fill="#0F766E">${item.count}</text>
          <text x="${x + barWidth/2}" y="${height - 12}" text-anchor="middle" font-size="11" font-weight="500" fill="#64748B">${item.month}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0D9488" />
            <stop offset="100%" stop-color="#0A66C2" />
          </linearGradient>
        </defs>
        <!-- Grid lines -->
        <line x1="0" y1="${height - paddingBottom}" x2="${width}" y2="${height - paddingBottom}" stroke="#CBD5E1" stroke-width="1" />
        <line x1="0" y1="${height - paddingBottom - chartHeight/2}" x2="${width}" y2="${height - paddingBottom - chartHeight/2}" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="4" />
        ${barsSVG}
      </svg>
    `;
  }

  function renderDistrictProgress(containerId, districts) {
    const container = document.getElementById(containerId);
    if (!container || !districts) return;

    let html = '<div style="display:flex; flex-direction:column; gap:12px;">';
    districts.forEach(d => {
      html += `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.8125rem; font-weight:600; margin-bottom:4px; color:#334155;">
            <span>${d.district}</span>
            <span>${d.workers} workers (${d.percentage}%)</span>
          </div>
          <div style="background:#E2E8F0; height:8px; border-radius:4px; overflow:hidden;">
            <div style="background:linear-gradient(90deg, #0D9488, #0284C7); width:${d.percentage}%; height:100%; border-radius:4px;"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderScreeningDonut(containerId, breakdown) {
    const container = document.getElementById(containerId);
    if (!container || !breakdown) return;

    const colors = ['#0D9488', '#F59E0B', '#E11D48', '#6366F1'];
    let legendHtml = '<div style="display:flex; flex-direction:column; gap:8px; font-size:0.8125rem;">';
    breakdown.forEach((item, idx) => {
      legendHtml += `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
          <span style="display:flex; align-items:center; gap:6px;">
            <span style="width:10px; height:10px; border-radius:2px; background:${colors[idx % colors.length]}; display:inline-block;"></span>
            <span style="color:#475569; font-weight:500;">${item.category}</span>
          </span>
          <span style="font-weight:700; color:#0F172A;">${item.percentage}% (${item.count})</span>
        </div>
      `;
    });
    legendHtml += '</div>';

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${legendHtml}
      </div>
    `;
  }

  function renderLanguages(containerId, languages) {
    const container = document.getElementById(containerId);
    if (!container || !languages) return;

    let html = '<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">';
    languages.forEach(l => {
      html += `
        <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:10px; border-radius:8px;">
          <div style="font-size:0.75rem; color:#64748B; font-weight:600; text-transform:uppercase;">${l.language}</div>
          <div style="font-size:1.25rem; font-weight:800; color:#0F172A;">${l.count} <span style="font-size:0.8rem; font-weight:500; color:#0D9488;">(${l.percentage}%)</span></div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  return {
    renderBarChart,
    renderDistrictProgress,
    renderScreeningDonut,
    renderLanguages
  };
})();
