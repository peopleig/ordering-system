document.addEventListener("DOMContentLoaded", () => {
    const toggle_show = document.getElementById("show_password");
    const pwd_field = document.getElementById("password");
    toggle_show.addEventListener("change", () => {
        pwd_field.type = toggle_show.checked ? "text" : "password";
    });
});

window.addEventListener("DOMContentLoaded", () => {
    const error = document.body.dataset.error === "true";
    const message = document.body.dataset.message;
    if (error) {
        const toast_block = document.getElementById("error_msg_toast");
        toast_block.querySelector(".toast-body").textContent = message;
        const toast = new bootstrap.Toast(toast_block);
        toast.show();
    }
});
