document.addEventListener("DOMContentLoaded", () => {
    const tip_input = document.getElementById("tip_input");
    const reward_input = document.getElementById("reward_input");
    const final_total = document.getElementById("final_total");
    const tip_hidden = document.getElementById("tip_hidden");
    const reward_hidden = document.getElementById("reward_hidden");
    const pay_form = document.getElementById("pay_form");

    const base_total = parseFloat(final_total.innerText);
    const max_reward = parseInt(reward_input?.getAttribute("max")) || 0;
    function update_final_total() {
        const tip = parseFloat(tip_input.value) || 0;
        let reward = parseInt(reward_input.value) || 0;

        if (reward > max_reward) {
            reward = max_reward;
            reward_input.value = reward;
        }
        if(reward < 0){
            reward = 0;
            reward_input.value = reward;
        }
        const new_total = base_total + tip - reward;
        final_total.innerText = Math.max(new_total, 0);
    }
    tip_input.addEventListener("input", update_final_total);
    reward_input.addEventListener("input", update_final_total);
    pay_form.addEventListener("submit", (e) => {
        tip_hidden.value = tip_input.value || 0;
        reward_hidden.value = reward_input.value || 0;
    });
});