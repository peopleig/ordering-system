document.addEventListener("DOMContentLoaded", () => {
    const surprise_btn = document.getElementById("surprise-me-btn");
    const surprise_popup = document.getElementById("surprise-popup");
    const cancel_btn = document.getElementById("cancel-surprise");
    const generate_btn = document.getElementById("generate-surprise");
    surprise_btn.onclick = () => {
        document.getElementById("people-count").value = "";
        surprise_popup.classList.remove("d-none");
    };
    cancel_btn.onclick = () => {
        surprise_popup.classList.add("d-none");
    };
    generate_btn.onclick = () => {
        Object.values(cart).forEach(item => {
            const id = item.id;
            delete cart[id];
            const btn = document.querySelector(`.add-to-cart-btn[data-id="${id}"]`);
            if (btn) {
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-outline-primary");
                btn.textContent = "Add to Cart";
            }
        });
        const peopleCount = parseInt(document.getElementById("people-count").value);
        if (isNaN(peopleCount) || peopleCount <= 0) {
            alert("Enter a valid number!");
            return;
        }
        const all_dishes = [...document.querySelectorAll(".add-to-cart-btn")].map(btn => ({
            id: parseInt(btn.dataset.id),
            name: btn.dataset.name,
            price: parseFloat(btn.dataset.price),
            image: btn.dataset.image,
            is_veg: btn.dataset.veg === "true",
            button: btn,
            category: btn.closest(".accordion-item").querySelector(".accordion-button").textContent.trim()
        }));
        const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];
        const beverages = all_dishes.filter(d => d.category.toLowerCase().includes("beverage"));
        const desserts = all_dishes.filter(d => d.category.toLowerCase().includes("dessert"));
        const mains = all_dishes.filter(d => !d.category.toLowerCase().includes("beverage") && !d.category.toLowerCase().includes("dessert"));
        const cart_dishes = [];
        if (beverages.length > 0) cart_dishes.push({ ...randomItem(beverages), quantity: peopleCount });
        if (desserts.length > 0) cart_dishes.push({ ...randomItem(desserts), quantity: peopleCount });
        const shuffled_mains = mains.sort(() => 0.5 - Math.random());
        cart_dishes.push(...shuffled_mains.slice(0, peopleCount).map(d => ({ ...d, quantity: 1 })));
        for (let key in cart) delete cart[key];
        cart_dishes.forEach(dish => {
            cart[dish.id] = {
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    image: dish.image,
                    is_veg: dish.is_veg,
                    quantity: dish.quantity
                };
            dish.button.classList.remove("btn-outline-primary");
            dish.button.classList.add("btn-primary");
            dish.button.textContent = "Added to Cart";
        })
        render_cart();
        surprise_popup.classList.add("d-none");
        document.getElementById("cart-popup").classList.remove("d-none");
    };
});
