document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.chef;
        const my_id = parseInt(document.querySelector("body").dataset.user_id);
        document.querySelectorAll("#orders_table_body tr").forEach(row => {
            const chef_id = parseInt(row.dataset.chef_id);
            row.style.display = (
                filter === "all" ||
                (filter === "unassigned" && chef_id === 1) ||
                (filter === "mine" && chef_id === my_id)
            ) ? "table-row" : "none";
        });
    });
});
