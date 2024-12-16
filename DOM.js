document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll("[data-view]");
    const views = document.querySelectorAll(".view");

    function showView(viewId) {
        views.forEach(view => {
            view.classList.add("hidden"); 
            view.classList.remove("active"); 
        });

        const viewToShow = document.getElementById(viewId);
        if (viewToShow) {
            viewToShow.classList.remove("hidden"); 
            viewToShow.classList.add("active"); 
        }
    }

    navButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const viewId = event.target.closest("button").getAttribute("data-view");
            showView(viewId); 
        });
    });

    showView("menu");
});
