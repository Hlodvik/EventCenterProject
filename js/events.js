let eventsData = [];
let selectedMonth = new Date().getMonth();
let selectedYear = new Date().getFullYear();

function fetchEvents() {
    return fetch("http://localhost:8000/data/events.json")
        .then(response => response.json())
        .then(events => {
            eventsData = events;
            generateListView(eventsData);
            updateCalendar();
        })
        
}

function generateListView(events) {
    const eventsList = document.getElementById("eventsList");
    if (!eventsList) return;
// used these as guides:  https://stackoverflow.com/questions/220603/is-there-a-best-practice-for-generating-html-with-javascript, when interpolation wasn't working as desired I stumbled upon this https://stackoverflow.com/questions/27678052/usage-of-the-backtick-character-in-javascript, 
    eventsList.innerHTML = `<h1>Public Events</h1>`;
    events.filter(event => event.type === "public").forEach(event => {
        let detailsHTML = "";
        if (event.details) {
            Object.keys(event.details).forEach(category => {
                const detail = event.details[category];
                detailsHTML += `<p><strong>${category.replace("-", " ")}:</strong> ${
                    Array.isArray(detail) ? detail.join(", ") : detail
                }<br></p>`;
            });
        }
        // I absolutey loved the way this site looks https://www.bandsintown.com/e/105980750, so I wrote this to recreate that look
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event-item");
        eventDiv.setAttribute("data-bg", event.backdrop);
        
        eventDiv.innerHTML = `
            <div class="backdrop" style="background-image: url(${event.backdrop});"></div>
            <div class="event-details">
                <div class="event-date">${event.sdate}</div>
                <div class="event-title">${event.title}</div>
                ${detailsHTML || ""}
                <a href="#" class="ticket-link">Get Tickets</a>
            </div>
            <img src="${event.backdrop}" class="event-image" alt="${event.title}">
        `;//getting this to work was an actual nightmare

        eventsList.appendChild(eventDiv);
    });

    applyEventBackdrops();
}
 
function applyEventBackdrops() {
    document.querySelectorAll("#eventsList .backdrop").forEach(backdrop => {
        const bgImage = backdrop.parentElement.getAttribute("data-bg");
        if (bgImage) {
            backdrop.style.backgroundImage = `url(${bgImage})`;
            backdrop.style.backgroundSize = "cover";
            backdrop.style.backgroundPosition = "center";
            backdrop.style.backgroundRepeat = "no-repeat";
            backdrop.style.filter = "blur(10px)";
        }
    });
}

function generateCalendarView(events) {
    const calendar = document.getElementById("calendar");
    if (!calendar) return;

    calendar.innerHTML = "";
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate(); // I pretty much used this verbatim from the example i found online, but essentially months use zero based index and days use one based index, this code says go to next month, then day 0 is the last day of the last month.
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

    const monthEvents = events.filter(event => {
        const eventDate = new Date(event.sdate + "T00:00:00"); //before adding the time string, all of the events were populating on the previous day
        return eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear;
    });

    let calendarHTML = `<section class="calendar-grid">`;
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `<article class="calendar-day empty"></article>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dayEvents = monthEvents.filter(event => {
            const eventDate = new Date(event.sdate + "T00:00:00");
            return eventDate.getDate() === day;
        });

        let eventHTML = "";
        dayEvents.forEach(event => {
            eventHTML += `<div class="event">${event.title}</div>`;
        });

        calendarHTML += `<section class="calendar-day">
                            <article class="day-number">${day}</article>
                            ${eventHTML}
                        </section>`;
    }

    calendarHTML += `</section>`;
    calendar.innerHTML = calendarHTML; //It took about 4 hours of looking at examples and debugging before this worked but so worth it 
}

function updateCalendar() {
    document.getElementById("currentMonth").textContent = 
        new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
    generateCalendarView(eventsData);
}
                                    //Select month buttons
function monthSelect() {
    document.getElementById("prevMonth")?.addEventListener("click", function () {
        selectedMonth--;
        if (selectedMonth < 0) {
            selectedMonth = 11;
            selectedYear--;
        }
        updateCalendar();
    });
    document.getElementById("nextMonth")?.addEventListener("click", function () {
        selectedMonth++;
        if (selectedMonth > 11) {
            selectedMonth = 0;
            selectedYear++;
        }
        updateCalendar();
    });
}
                                //list view or grid view, using the same logic I use in the homepage and menu viewing sections
function listOrGrid() {
    const listViewBtn = document.getElementById("listViewBtn");
    const calendarViewBtn = document.getElementById("calendarViewBtn");
    const eventsList = document.getElementById("eventsList");
    const calendarView = document.getElementById("calendarView");

    listViewBtn.addEventListener("click", function () {
        eventsList.classList.remove("hidden");
        calendarView.classList.add("hidden");
    });

    calendarViewBtn.addEventListener("click", function () {
        eventsList.classList.add("hidden");
        calendarView.classList.remove("hidden");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    fetchEvents().then(() => {
        updateCalendar();
    });
    monthSelect();
    listOrGrid();
});