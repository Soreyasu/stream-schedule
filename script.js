const currentWeekRange = "Sept 7 — Sept 13, 2026";
document.getElementById("schedule-date-range").textContent = currentWeekRange;

// Base timezone of broadcast
const BASE_TIMEZONE = "Europe/Brussels";

const scheduleData = [
    {
        day: "MONDAY",
        start: "12:00",
        end:"22:00",
        title: "Investigations & Study",
        subtitle: "Office Hours Vary • Potential Live Broadcasts",
        status: "STUDY DAY"
    },
    {
        day: "TUESDAY",
        start: "12:00",
        end:"22:00",
        title: "Investigations & Study",
        subtitle: "Office Hours Vary • Potential Live Broadcasts",
        status: "STUDY DAY"
    },
    {
        day: "WEDNESDAY",
        start: null,
        end: null,
        title: "Archive Bureau Resupply",
        subtitle: "Office Closed • Offline",
        status: "REST DAY"
    },
    {
        day: "THURSDAY",
        start: "19:00",
        end: "22:00",
        title: "Final Fantasy X-2",
        subtitle: "Blind Playthrough • Preparation for speedrunning",
        status: "INVESTIGATION"
    },
    {
        day: "FRIDAY",
        start: "19:00",
        end: "22:00",
        title: "Final Fantasy X-2",
        subtitle: "Blind Playthrough • Preparation for speedrunning",
        status: "OPEN CASE"
    },
    {
        day: "SATURDAY",
        start: "19:00",
        end: "22:00",
        title: "Castlevania: Aria of Sorrow",
        subtitle: "Speedrun Glitchless Soma • Practicing & Runs",
        status: "LABORATORY"
    },
    {
        day: "SUNDAY",
        start: null,
        end: null,
        title: "Weekly Debriefing & Maintenance",
        subtitle: "Docket Prep for Next Cycle",
        status: "REST DAY"
    }
];

function convertBroadcastTimeToLocal(timeStr) {
    if (!timeStr) return null;

    const [targetHours, targetMinutes] = timeStr.split(":").map(Number);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const initialUtc = new Date(`${year}-${month}-${day}T${String(targetHours).padStart(2, "0")}:${String(targetMinutes).padStart(2, "0")}:00Z`);

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: BASE_TIMEZONE,
        hour: "numeric",
        minute: "numeric",
        hour12: false
    });

    const parts = formatter.formatToParts(initialUtc);
    const currentBroadcastHour = parseInt(parts.find(p => p.type === "hour").value, 10) % 24;
    const currentBroadcastMin = parseInt(parts.find(p => p.type === "minute").value, 10);

    const diffMinutes = ((currentBroadcastHour * 60) + currentBroadcastMin) - ((targetHours * 60) + targetMinutes);
    const actualStreamDateUtc = new Date(initialUtc.getTime() - (diffMinutes * 60 * 1000));

    const localTimeStr = new Intl.DateTimeFormat(navigator.language || "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(actualStreamDateUtc);

    const tzName = new Intl.DateTimeFormat(navigator.language || "en-US", {
        timeZoneName: "short"
    }).formatToParts(actualStreamDateUtc).find(p => p.type === "timeZoneName")?.value || "";

    return {
        time: localTimeStr,
        tz: tzName
    };
}

function formatLocalTimeRange(startStr, endStr) {
    if (!startStr || !endStr) return "— — —";

    const startObj = convertBroadcastTimeToLocal(startStr);
    const endObj = convertBroadcastTimeToLocal(endStr);

    return `${startObj.time} – ${endObj.time} ${startObj.tz}`.trim();
}

function resolveStatusClass(statusText) {
    const text = statusText.toUpperCase();
    if (text.includes("REST") || text.includes("OFFLINE") || text.includes("CLOSED")) {
        return "status-rest";
    }
    if (text.includes("PATROL") || text.includes("TACTICAL") || text.includes("LIVE") || text.includes("ASSIGNED")) {
        return "status-active";
    }
    if (text.includes("CASE") || text.includes("LAB") || text.includes("INVESTIGATION")) {
        return "status-investigation";
    }
    if (text.includes("SPECIAL") || text.includes("EVENT") || text.includes("PUBLIC") || text.includes("STUDY")) {
        return "status-special";
    }
    return "status-active";
}

function renderSchedule() {
    const container = document.getElementById("schedule-container");
    if (!container) return;

    const dayMap = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const currentDayName = dayMap[new Date().getDay()];

    container.innerHTML = scheduleData.map(item => {
        const badgeClass = resolveStatusClass(item.status);
        const localTime = formatLocalTimeRange(item.start, item.end);
        const isRest = badgeClass === "status-rest";
        const isToday = item.day.toUpperCase() === currentDayName;

        return `
            <div class="shelf-row ${isToday ? 'is-today' : ''}" style="${isRest && !isToday ? 'opacity: 0.6;' : ''}">
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
