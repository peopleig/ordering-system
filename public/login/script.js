document.addEventListener("DOMContentLoaded", () => {
    const show_toast = document.body.dataset.error === "true";

    if (show_toast) {
        const toast_block = document.getElementById("error_msg_toast");

        if (toast_block) {
            const toast = new bootstrap.Toast(toast_block, { delay: 3000 });
            toast.show();
        }
    }
});

