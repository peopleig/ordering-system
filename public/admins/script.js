document.addEventListener("DOMContentLoaded", () => {
    const filter_buttons = document.querySelectorAll(".order_buttons");
    const rows = document.querySelectorAll("#orders_table_body tr");
    const popup = document.getElementById("order_popup");
    const close_popup = document.getElementById("close_popup");
    const get_bill = document.getElementById("get_bill");
    let current_order_id;
    let current_user_id;
    
    filter_buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const status = btn.dataset.status;
            rows.forEach(row => {
                const rowStatus = row.dataset.status;
                if (status === "all" || rowStatus === status) {
                    row.classList.remove("d-none");
                } else {
                    row.classList.add("d-none");
                }
            });
            filter_buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const user_id = btn.dataset.user_id;
            const confirmed = confirm("Delete this user?");
            if (confirmed) {
                await fetch(`/admin/delete/${user_id}`, { method: "DELETE" });
                if(res.ok) location.reload();
                else alert("Delete Order Failed");
            }
        });
    });
    document.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const user_id = btn.dataset.user_id;
            const res = await fetch(`/admin/approve/${user_id}`, { method: "PATCH" });
            if (res.ok) location.reload();
            else alert("Approval failed.");
        });
    });
    
    
    document.querySelectorAll(".show-more-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            current_order_id = btn.dataset.order_id;
            current_user_id = btn.dataset.user_id;
            let status;
            if(btn.dataset.status === "payment_pending"){
                status = "Payment Pending";
                get_bill.action = `/order/preparing/${current_order_id}`;
            }
            else if(btn.dataset.status === "preparing"){
                status = "Preparing";
                get_bill.action = `/order/preparing/${current_order_id}`;
            }
            else {
                status = "Completed";
                get_bill.action = `/order/completed/${current_order_id}`;
            }
            popup.querySelector("p").innerHTML = `Order ID: ${btn.dataset.order_id}
            <br>User Id: ${btn.dataset.user_id}
            <br>Table Number: ${btn.dataset.table_number}
            <br>Status: ${status}`;
            popup.classList.remove("d-none");
        });
    });
    close_popup.addEventListener("click", () => {
        popup.classList.add("d-none");
    });
});
const item_filter_buttons = document.querySelectorAll(".item_buttons");
item_filter_buttons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.chef;
        document.querySelectorAll("#items_table_body tr").forEach(row => {
            const chef_id = parseInt(row.dataset.chef_id);
            row.style.display = (
                filter === "all" ||
                (filter === "unassigned" && chef_id === 1) ||
                (filter === "assigned" && chef_id !== 1)
            ) ? "table-row" : "none";
        });
        item_filter_buttons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");
    });
});

