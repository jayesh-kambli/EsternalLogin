document.addEventListener("DOMContentLoaded", function () {
    fetch('https://api.ipify.org?format=json') // Fetch public IP from ipify API
        .then(response => response.json())
        .then(data => {
            let clientIp = data.ip; // Get client's actual public IP
            updateDashboard(clientIp);
        })
        .catch(error => console.error("Failed to fetch IP:", error));



    document.getElementById("logout").addEventListener("click", () => {
        console.log("Logout clicked"); // Debugging log
        fetch('./php/logout.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Server error: " + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    sessionStorage.removeItem("loggedIn"); // Clear session storage
                    window.location.href = "./index.html"; // Redirect to login page
                    console.log("Run: Logout successful!");
                } else {
                    console.error("Logout failed:", data.message);
                    alert("Logout failed: " + data.message);
                }
            })
            .catch(error => {
                console.error("Logout Error:", error);
                alert("Logout failed. Server not reachable.");
            });
    });


});

function downloadApk() {
    window.location.href = "./apks/minecraft-1-21-62.apk";
}

function copyIP() {
    var ipField = document.getElementById("serverIPJava");
    ipField.select();
    ipField.setSelectionRange(0, 99999); // For mobile support
    navigator.clipboard.writeText(ipField.value);
    // alert("Copied: " + ipField.value);
}

function copyIP2() {
    var ipField = document.getElementById("serverIPBedrock");
    ipField.select();
    ipField.setSelectionRange(0, 99999); // For mobile support
    navigator.clipboard.writeText(ipField.value);
    // alert("Copied: " + ipField.value);
}


function updateDashboard(clientIp) {
    fetch('./php/dashboard.php', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: clientIp }) // Send IP to backend
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert(data.message);
                window.location.href = "index.html"; // Redirect if not logged in
                return;
            }
            console.log(data.name);
            console.log(data.uuid);

            const uuid = data.uuid; // Replace with actual UUID

            // fetch(`./php/getUserData.php?uuid=${uuid}`)
            //     .then(response => response.json())
            //     .then(userData => {
            //         console.log("User Data:", userData);
            //         document.getElementById("playerName").textContent = userData["last-account-name"];
            //         document.getElementById("money").textContent = userData.money;
            //         document.getElementById("lastLogin").textContent = new Date(userData.timestamps.login).toLocaleString();
            //     })
            //     .catch(error => console.error("Error:", error));


            let statusText = data.whitelisted ? "You are whitelisted!" : "Not whitelisted! Contact Admin.";
            let mainColor = data.whitelisted ? "green" : "red";
            let logo = data.whitelisted ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>`;

            document.getElementById("listSorter").style.backgroundColor = mainColor;
            document.getElementById("whitelistStatus").innerHTML = logo + " " + statusText;

            if (data.ip_updated) {
                setTimeout(() => {
                    console.log("This runs after 2 seconds!");
                    document.getElementById("DeviceStatus").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>  Device Verified`;
                    document.getElementById("DeviceBg").style.backgroundColor = "green";
                }, 800);
            }
        })
        .catch(error => console.error('Error fetching whitelist status:', error));
}