document.addEventListener("DOMContentLoaded", function () {
    let contentGroups = {};
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("open");
    });
    function updateView(groupId) {
        const contentDivs = document.querySelectorAll(`#${groupId} .content-div`);

        if (!(groupId in contentGroups)) {
            contentGroups[groupId] = 0;
        }

        contentDivs.forEach(div => div.classList.remove("active"));
        contentDivs[contentGroups[groupId]].classList.add("active");
    }

    function changeContent(groupId, direction) {
        const contentDivs = document.querySelectorAll(`#${groupId} .content-div`);
        if (contentDivs.length === 0) return;

        if (!(groupId in contentGroups)) {
            contentGroups[groupId] = 0;
        }

        contentGroups[groupId] += direction;
        if (contentGroups[groupId] < 0) {
            contentGroups[groupId] = contentDivs.length - 1;
        } else if (contentGroups[groupId] >= contentDivs.length) {
            contentGroups[groupId] = 0;
        }

        updateView(groupId);
    }
    //these buttons only get used for the tasting menu section  
    document.getElementById("menuPrevBtn")?.addEventListener("click", () => changeContent("tasting-menu", -1));
    document.getElementById("menuNextBtn")?.addEventListener("click", () => changeContent("tasting-menu", 1));
    //buttons for sections
    document.getElementById("viewHours")?.addEventListener("click", () => showSection("hours-menu"));
    document.getElementById("viewTasting")?.addEventListener("click", () => showSection("tasting-menu"));
    document.getElementById("viewAlaCarte")?.addEventListener("click", () => showSection("ala-carte-menu"));
    document.getElementById("viewReservation")?.addEventListener("click", () => showSection("reservation-menu"));
    //restaurant container content --> rcocon... everything has display:none until active gets added
    function showSection(sectionId) {
        document.querySelectorAll(".rcocon").forEach(div => div.classList.remove("active"));
        document.getElementById(sectionId)?.classList.add("active");
    }

    showSection("hours-menu");
    updateView("tasting-menu");
});
