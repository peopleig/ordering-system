document.addEventListener("DOMContentLoaded", () => {
    const default_btn = document.querySelector('.order-filter[data-status="preparing"]');
    if (default_btn) default_btn.click();

    const vegToggle = document.getElementById("vegToggle");

    vegToggle.addEventListener("change", () => {
        document.querySelectorAll(".menu-card").forEach(card => {
            if (vegToggle.checked && card.classList.contains("non-veg")) {
                card.style.display = "none";
            } else {
                card.style.display = "block";
            }
        });
    });
});
document.getElementById("open-cart").onclick = () => {
    document.getElementById("cart-popup").classList.remove("d-none");
};
document.getElementById("close-cart").onclick = () => {
    document.getElementById("cart-popup").classList.add("d-none");
};
const order_filters = document.querySelectorAll(".order-filter");
order_filters.forEach(button => {
    button.addEventListener("click", () => {
        const status = button.dataset.status;
        document.querySelectorAll(".orders-card").forEach(card => {    
            if (card.dataset.status === status) {
                card.classList.remove("d-none");
                card.classList.add("d-inline-block");
            } else {
                card.classList.remove("d-inline-block");
                card.classList.add("d-none");
            }
        });
        order_filters.forEach(b => b.classList.remove("active"));
        button.classList.add("active");
    });
});
