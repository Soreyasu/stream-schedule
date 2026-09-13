const currentWeekRange = "Sept 14 — Sept 20, 2026";
document.getElementById("schedule-date-range").textContent = currentWeekRange;

// Base timezone of broadcast
const BASE_TIMEZONE = "Europe/Brussels";

const scheduleData = [
    {
        day: "SOL 01 // MON",
        start: null,
        end: null,
        title: "Cartography & Tech Archive Synthesis",
        subtitle: "Signal Analysis Active • Spontaneous Transmission Possible",
        status: "TELEMETRY LOG"
    },
    {
        day: "SOL 02 // TUE",
        start: null,
        end: null,
        title: "Cartography & Tech Archive Synthesis",
        subtitle: "Signal Analysis Active • Spontaneous Transmission Possible",
        status: "TELEMETRY LOG"
    },
    {
        day: "SOL 03 // WED",
        start: null,
        end: null,
        title: "Hyperdrive Chamber Refueling",
        subtitle: "Subspace Comm Offline • Life Support Recalibration",
        status: "STASIS CYCLE"
    },
    {
        day: "SOL 04 // THU",
        start: "19:00",
        end: "22:00",
        title: "Final Fantasy X-2",
        subtitle: "Blind Surface Expedition • Hyper-Route Optimisation",
        status: "DEEP RECON"
    },
    {
        day: "SOL 05 // FRI",
        start: "19:00",
        end: "22:00",
        title: "Final Fantasy X-2",
        subtitle: "Blind Surface Expedition • Hyper-Route Optimisation",
        status: "ESSENTIAL RECON"
    },
    {
        day: "SOL 06 // SAT",
        start: "19:00",
        end: "22:00",
        title: "Castlevania: Aria of Sorrow",
        subtitle: "Speedrun Glitchless Soma • Warp Vector Precision Runs",
        status: "ANOMALY SECTOR"
    },
    {
        day: "SOL 07 // SUN",
        start: "13:00",
        end: "22:00",
        title: "No Man's Sky // Sonic Racing Crossworlds",
        subtitle: "Starchart Uploads • Cycle Turnover • Community Games",
        status: "ANOMALY 1E09S"
    }
];

function getUtcOffset(timeZone, date) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "longOffset"
    }).formatToParts(date);

    const raw = parts.find(p => p.type === "timeZoneName")?.value || "GMT+00:00";
    return raw.replace("GMT", "") || "+00:00";
}

function convertBroadcastTimeToLocal(timeStr) {
    if (!timeStr) return null;

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");

    const offset = getUtcOffset(BASE_TIMEZONE, now);
    const utcInstant = new Date(`${y}-${m}-${d}T${timeStr}:00${offset}`);

    const localTimeStr = new Intl.DateTimeFormat(navigator.language || "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(utcInstant);

    const tzName = new Intl.DateTimeFormat(navigator.language || "en-US", {
        timeZoneName: "short"
    }).formatToParts(utcInstant).find(p => p.type === "timeZoneName")?.value || "";

    return { time: localTimeStr, tz: tzName };
}

function formatLocalTimeRange(startStr, endStr) {
    if (!startStr || !endStr) return "— — — [OFFLINE]";

    const startObj = convertBroadcastTimeToLocal(startStr);
    const endObj = convertBroadcastTimeToLocal(endStr);

    return `${startObj.time} – ${endObj.time} ${startObj.tz}`.trim();
}

function resolveStatusClass(statusText) {
    const text = statusText.toUpperCase();
    if (text.includes("STASIS") || text.includes("OFFLINE") || text.includes("REST")) {
        return "status-rest";
    }
    if (text.includes("ACTIVE") || text.includes("MISSION") || text.includes("EXPEDITION")) {
        return "status-active";
    }
    if (text.includes("RECON") || text.includes("INVESTIGATION") || text.includes("SURFACE")) {
        return "status-investigation";
    }
    if (text.includes("ANOMALY") || text.includes("SECTOR") || text.includes("TELEMETRY")) {
        return "status-special";
    }
    return "status-active";
}

function renderSchedule() {
    const container = document.getElementById("schedule-container");
    if (!container) return;

    // Day indexing: 0 = Sun, 1 = Mon ...
    const dayMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const currentDayAbbr = dayMap[new Date().getDay()];

    container.innerHTML = scheduleData.map(item => {
        const badgeClass = resolveStatusClass(item.status);
        const localTime = formatLocalTimeRange(item.start, item.end);
        const isRest = badgeClass === "status-rest";
        const isToday = item.day.includes(currentDayAbbr);

        return `
            <div class="shelf-row ${isToday ? 'is-today' : ''}" style="${isRest && !isToday ? 'opacity: 0.55;' : ''}">
                <div class="day-slot">${item.day}</div>
                <div class="time-slot">${localTime}</div>
                <div class="activity-slot">
                    <div class="case-title">${item.title}</div>
                    <div class="case-details">${item.subtitle}</div>
                </div>
                <div class="status-slot">
                    <span class="seal-badge ${badgeClass}">${item.status}</span>
                </div>
            </div>
        `;
    }).join('');
}

renderSchedule();
