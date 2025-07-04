document.addEventListener("DOMContentLoaded", () => {
    const sliders = ["ambience", "food_quality", "service", "value"];
    sliders.forEach(id => {
        const slider = document.getElementById(id);
        const display = document.getElementById(`${id}_val`);
        slider.addEventListener("input", () => {
            display.textContent = slider.value;
        });
    });
});
