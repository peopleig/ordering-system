const cart = {};

function render_cart() {
    const cart_items_div = document.getElementById("cart-items");
    cart_items_div.innerHTML = "";

    Object.values(cart).forEach(item => {
        const div = document.createElement("div");
        div.className = "mb-2 d-flex justify-content-between align-items-center";

        div.innerHTML = `
            <div>
                <b>${item.name}</b> 
                <br>₹${item.price} x ${item.quantity} = ₹${item.price*item.quantity}
            </div>
            <div>
                <button class="btn btn-sm btn-outline-secondary me-1" onclick="change_quantity(${item.id}, -1)">−</button>
                <button class="btn btn-sm btn-outline-secondary" onclick="change_quantity(${item.id}, 1)">+</button>
            </div>
        `;

        cart_items_div.appendChild(div);
    });
    const cart_items = Object.values(cart);
    console.log(cart_items);
}

function toggle_add_to_cart(button) {
    const id = parseInt(button.dataset.id);
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;
    const is_veg = button.dataset.veg === "true";

    if (!(!cart[id])) {
        delete cart[id];
        button.classList.remove("btn-primary");
        button.classList.add("btn-outline-primary");
        button.textContent = "Add to Cart";
    } else {
        cart[id] = {
            id, name, price, image, is_veg, quantity: 1
        };
        button.classList.remove("btn-outline-primary");
        button.classList.add("btn-primary");
        button.textContent = "Added to Cart";
    }
    render_cart();
}

function change_quantity(id, delta) {
    if (cart[id]) {
        cart[id].quantity += delta;
        if (cart[id].quantity <= 0) {
            delete cart[id];
            const btn = document.querySelector(`.add-to-cart-btn[data-id="${id}"]`);
            if (btn) {
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-outline-primary");
                btn.textContent = "Add to Cart";
            }
        }
    }
    render_cart();
}
function confirm_order() {
    const cart_items = Object.values(cart);
    if (cart_items.length === 0) {
        alert("Cart is empty!");
        return;
    }

    try {
        let total = 0;
        cart_items.forEach(item => {
            total += item.price * item.quantity;
        });

        const form = document.getElementById("confirm-order-form");
        document.getElementById("cart_data").value = JSON.stringify(cart_items);
        document.getElementById("order_type").value = orderTypeSwitch.checked ? "takeaway" : "dine_in";
        document.getElementById("table_number").value = orderTypeSwitch.checked ? 0 : document.getElementById("tableNumber").value;
        document.getElementById("hidden_instructions").value = document.getElementById("instructions").value;
        document.getElementById("total_cost").value = total;
        form.submit();
    } catch (err) {
        console.error("Error confirming order:", err);
        alert("Something went wrong!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", () => toggle_add_to_cart(button));
    });

    document.getElementById("open-cart").onclick = () => {
        document.getElementById("cart-popup").classList.remove("d-none");
        render_cart();
    };

    document.getElementById("close-cart").onclick = () => {
        document.getElementById("cart-popup").classList.add("d-none");
    };
    const orderTypeSwitch = document.getElementById("orderTypeSwitch");
    const tableSelect = document.getElementById("tableNumber");

    orderTypeSwitch.addEventListener("change", () => {
        const isTakeaway = orderTypeSwitch.checked;
        tableSelect.disabled = isTakeaway;
        tableSelect.classList.toggle("bg-secondary", isTakeaway);
        tableSelect.classList.toggle("text-white", isTakeaway);
    });
});
