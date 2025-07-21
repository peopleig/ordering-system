document.addEventListener("DOMContentLoaded", () => {
    const toggle_show = document.getElementById("show_password");
    const pwd_field = document.getElementById("password");
    toggle_show.addEventListener("change", () => {
        pwd_field.type = toggle_show.checked ? "text" : "password";
    });
    const show_toast = document.body.dataset.error === "true";

    if (show_toast) {
        const toast_block = document.getElementById("error_msg_toast");

        if (toast_block) {
            const toast = new bootstrap.Toast(toast_block, { delay: 3000 });
            toast.show();
        }
    }
});

