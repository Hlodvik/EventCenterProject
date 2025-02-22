document.addEventListener("DOMContentLoaded", function () {

    // Get all menu buttons and menu sections
    const buttons = document.querySelectorAll(".rb");
    const menus = document.querySelectorAll(".menus");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const targetMenu = this.getAttribute("data-menu");             
            menus.forEach(menu => {
                menu.style.display = "none";
            });

            // show the selected menu
            const selectedMenu = document.querySelector(`.menus[data-menu="${targetMenu}"]`);
            if (selectedMenu) {
                selectedMenu.style.display = "block";
            } 
        });
    });

    // toggle dropdowns
    document.querySelectorAll(".dropdown-title").forEach(title => {
        title.addEventListener("click", function () {
            const dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }
        });
    });
});