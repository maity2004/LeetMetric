document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const userNameInput = document.getElementById("user-input");
    const statscontainer = document.querySelector(".stat-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");

    // Validate LeetCode username
    function validateusername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }

        const regex = /^(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]{2,19}(?<![_.])$/;
        if (!regex.test(username)) {
            alert("Invalid username. It should:\n- Start with a letter\n- Only contain letters, digits, underscores, or dots\n- Be 3-20 characters long\n- Not end with a dot or underscore\n- Not contain consecutive dots or underscores");
            return false;
        }

        return true;
    }

    // Update progress ring and label
    function updateProgress(circle, label, solved, total) {
        const percent = total === 0 ? 0 : Math.round((solved / total) * 100);
        circle.style.setProperty("--progress", `${percent}%`);
        label.textContent = `${solved}/${total}`;
    }

    // Display user data on screen
    function displayUserdta(data) {
        if (data.status !== "success") {
            statscontainer.innerHTML = `<p>No data found for this user</p>`;
            return;
        }

        updateProgress(easyProgressCircle, easyLabel, data.easySolved, data.totalEasy);
        updateProgress(mediumProgressCircle, mediumLabel, data.mediumSolved, data.totalMedium);
        updateProgress(hardProgressCircle, hardLabel, data.hardSolved, data.totalHard);

        cardStatsContainer.innerHTML = `
            <p><strong>Total Solved:</strong> ${data.totalSolved} / ${data.totalQuestions}</p>
            <p><strong>Acceptance Rate:</strong> ${data.acceptanceRate}%</p>
            <p><strong>Ranking:</strong> ${data.ranking}</p>
            <p><strong>Contribution Points:</strong> ${data.contributionPoints}</p>
        `;
    }

    // Fetch user details from API
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Unable to fetch user details");

            const data = await response.json();
            console.log("Fetched Data:", data);
            displayUserdta(data);
        } catch (error) {
            statscontainer.innerHTML = `<p>⚠️ No data found. Please check the username.</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // Search event
    searchButton.addEventListener("click", function () {
        const username = userNameInput.value.trim();
        if (validateusername(username)) {
            fetchUserDetails(username);
        }
    });
});
