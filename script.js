// =========================================================
// NEXGILE WEALTHAGENT
// COMPLETE CLIENT DASHBOARD JAVASCRIPT
// =========================================================

const API_BASE_URL = "http://127.0.0.1:5000/api";


// =========================================================
// PAGE ELEMENTS
// =========================================================

const loginPage = document.getElementById("login-page");
const registerPage = document.getElementById("register-page");
const dashboardPage = document.getElementById("dashboard-page");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

const showRegisterButton =
    document.getElementById("show-register");

const showLoginButton =
    document.getElementById("show-login");
const riskAssessmentForm =
    document.getElementById("risk-assessment-form");

const riskAssessmentMessage =
    document.getElementById("risk-assessment-message");

const riskScoreElement =
    document.getElementById("risk-score");

const riskCategoryElement =
    document.getElementById("risk-category");
const goalForm =
    document.getElementById("goal-form");

const goalFormMessage =
    document.getElementById("goal-form-message");
const container = document.getElementById("holdings-container");
const portfolioContainer =
    document.getElementById("portfolio-container");
// =========================================================
// TOKEN
// =========================================================

function getToken() {
    return localStorage.getItem("access_token");
}
async function loadPortfolio() {
    if (!portfolioContainer) return;

    try {
        const portfolios =
            await apiRequest("/portfolios/client");

        if (!portfolios || portfolios.length === 0) {
            portfolioContainer.innerHTML = `
                <p>No portfolio found.</p>
            `;
            return;
        }

        portfolioContainer.innerHTML = portfolios.map(portfolio => `
            <div class="portfolio-card">
                <h3>${portfolio.name}</h3>

                <p>
                    <strong>Risk Profile:</strong>
                    ${portfolio.risk_profile || "Not set"}
                </p>

                <p>
                    <strong>Total Value:</strong>
                    ₹${Number(portfolio.total_value || 0).toFixed(2)}
                </p>
            </div>
        `).join("");

    } catch (error) {
        console.error("Portfolio loading error:", error);

        portfolioContainer.innerHTML = `
            <p>Unable to load portfolio.</p>
        `;
    }
}

// =========================================================
// SHOW LOGIN
// =========================================================

function showLogin() {

    if (loginPage) {
        loginPage.style.display = "block";
    }

    if (registerPage) {
        registerPage.style.display = "none";
    }

    if (dashboardPage) {
        dashboardPage.style.display = "none";
    }

}
// =========================================================
// LOAD LOGGED-IN USER PROFILE
// =========================================================

async function loadUserProfile() {
    try {
        const user = await apiRequest("/auth/me");

        if (!user) {
            return;
        }

        const username = user.username || "User";
        const initial = username.charAt(0).toUpperCase();

        const sidebarName =
            document.getElementById("sidebar-user-name");

        const sidebarAvatar =
            document.getElementById("sidebar-user-avatar");

        const topAvatar =
            document.getElementById("top-profile-avatar");

        if (sidebarName) {
            sidebarName.textContent = username;
        }

        if (sidebarAvatar) {
            sidebarAvatar.textContent = initial;
        }

        if (topAvatar) {
            topAvatar.textContent = initial;
        }

        console.log("User profile loaded:", user);

    } catch (error) {
        console.error("Profile loading error:", error);
    }
}

// =========================================================
// SHOW REGISTRATION
// =========================================================

function showRegister() {

    if (loginPage) {
        loginPage.style.display = "none";
    }

    if (registerPage) {
        registerPage.style.display = "block";
    }

    if (dashboardPage) {
        dashboardPage.style.display = "none";
    }

    if (registerError) {
        registerError.textContent = "";
    }

}


// =========================================================
// SHOW DASHBOARD
// =========================================================

// =========================================================
// SHOW DASHBOARD
// =========================================================

function showDashboard() {

    if (loginPage) {
        loginPage.style.display = "none";
    }

    if (registerPage) {
        registerPage.style.display = "none";
    }

    if (dashboardPage) {
        dashboardPage.style.display = "block";
    }

    loadDashboard();
    loadHoldings();
    loadTransactions();
    loadMyAccount();
    loadPortfolio();
    loadUserProfile();
}


// =========================================================
// LOGIN
// =========================================================

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (loginError) {
            loginError.textContent = "";
        }

        const email =
            document.getElementById("email")?.value.trim();

        const password =
            document.getElementById("password")?.value;

        if (!email || !password) {

            if (loginError) {
                loginError.textContent =
                    "Email and password are required.";
            }

            return;

        }

        try {

            console.log("Sending login request...");

const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            password: password
        })
    }
);

            const data =
                await response.json().catch(() => ({}));

            if (!response.ok) {

                if (loginError) {
                    loginError.textContent =
                        data.error ||
                        data.msg ||
                        "Invalid credentials.";
                }

                return;

            }

            if (!data.access_token) {

                if (loginError) {
                    loginError.textContent =
                        "Access token was not returned.";
                }

                return;

            }

            localStorage.setItem(
                "access_token",
                data.access_token
            );

            showDashboard();

        }
        catch (error) {

            console.error("Login error:", error);

            if (loginError) {
                loginError.textContent =
                    "Unable to connect to server.";
            }

        }

    });

}


// =========================================================
// REGISTRATION PAGE BUTTONS
// =========================================================

if (showRegisterButton) {

    showRegisterButton.addEventListener("click", function (event) {

        event.preventDefault();

        showRegister();

    });

}


if (showLoginButton) {

    showLoginButton.addEventListener("click", function (event) {

        event.preventDefault();

        showLogin();

    });

}


// =========================================================
// REGISTRATION
// =========================================================

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (registerError) {
            registerError.textContent = "";
        }

        const username =
            document.getElementById("register-name")?.value.trim();

        const email =
            document.getElementById("register-email")?.value.trim();

        const password =
            document.getElementById("register-password")?.value;

        const confirmPassword =
            document.getElementById(
                "register-confirm-password"
            )?.value;


        if (
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            if (registerError) {
                registerError.textContent =
                    "All fields are required.";
            }

            return;

        }


        if (password.length < 8) {

            if (registerError) {
                registerError.textContent =
                    "Password must contain at least 8 characters.";
            }

            return;

        }


        if (password !== confirmPassword) {

            if (registerError) {
                registerError.textContent =
                    "Passwords do not match.";
            }

            return;

        }


        const submitButton =
            registerForm.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {

            submitButton.disabled = true;
            submitButton.textContent = "Registering...";

        }


        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        username: username,
                        email: email,
                        password: password

                    })
                }
            );


            const data =
                await response.json().catch(() => ({}));

             if (!response.ok) {

    console.log("Backend response:", data);
    console.log("Status code:", response.status);

    if (loginError) {
        loginError.textContent =
            JSON.stringify(data);
    }

    return;
}


            alert(
                data.message ||
                "Registration successful. Please login."
            );


            registerForm.reset();

            showLogin();


        }
        catch (error) {

            console.error(
                "Registration error:",
                error
            );

            if (registerError) {
                registerError.textContent =
                    error.message ||
                    "Registration failed.";
            }

        }
        finally {

            if (submitButton) {

                submitButton.disabled = false;
                submitButton.textContent = "Register";

            }

        }

    });

}


// =========================================================
// LOGOUT
// =========================================================

function logout() {

    localStorage.removeItem("access_token");

    window.location.reload();

}


// =========================================================
// API REQUEST HELPER
// =========================================================

async function apiRequest(endpoint, options = {}) {

    const token = getToken();

    const headers = {

        "Content-Type": "application/json",

        ...(options.headers || {})

    };


    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;

    }


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: headers
        }
    );


    const data =
        await response.json().catch(() => null);


    if (response.status === 401) {

        localStorage.removeItem("access_token");

        alert(
            "Your session has expired. Please login again."
        );

        window.location.reload();

        return null;

    }


    if (!response.ok) {

        throw new Error(
            data?.error ||
            data?.msg ||
            `Request failed (${response.status})`
        );

    }


    return data;

}


// =========================================================
// MONEY FORMAT
// =========================================================

function formatMoney(value) {

    const number = Number(value ?? 0);

    return number.toLocaleString(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// =========================================================
// DATE FORMAT
// =========================================================

function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("en-IN");

}


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================================
// LOAD DASHBOARD
// =========================================================

async function loadDashboard() {

    try {

        const data =
            await apiRequest("/dashboard/client/full");

        if (!data) {
            return;
        }


        const clientName =
            document.getElementById("client-name");

        const cashValue =
            document.getElementById("cash");

        const portfolioValue =
            document.getElementById("portfolio-value");

        const totalAssets =
            document.getElementById("total-assets");

        const riskScore =
            document.getElementById("risk-score");

        const riskCategory =
            document.getElementById("risk-category");


        const summary =
            data.financial_summary || {};

        const risk =
            data.risk_profile || {};


        if (clientName) {

            clientName.textContent =
                data.client?.name ||
                data.client?.username ||
                "Client";

        }


        if (cashValue) {

            cashValue.textContent =
                formatMoney(summary.cash);

        }


        if (portfolioValue) {

            portfolioValue.textContent =
                formatMoney(summary.portfolio_value);

        }


        if (totalAssets) {

            totalAssets.textContent =
                formatMoney(summary.total_assets);

        }


        if (riskScore) {

            riskScore.textContent =
                risk.score ?? "-";

        }


        if (riskCategory) {

            riskCategory.textContent =
                risk.category || "-";

        }


        renderGoals(data.goals || []);

        await loadRecommendation(data.goals || []);

    }
    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// =========================================================
// RENDER GOALS
// =========================================================

function renderGoals(goals) {

    const container =
        document.getElementById("goals-container");

    if (!container) {
        return;
    }


    if (!Array.isArray(goals) || goals.length === 0) {

        container.innerHTML = `
            <div class="message">
                No financial goals found.
            </div>
        `;

        return;

    }


    container.innerHTML = goals.map(function (goal) {

        const progress =
            Number(goal.progress_percentage ?? 0);

        const safeProgress =
            Math.min(Math.max(progress, 0), 100);


        return `

            <div class="goal-card">

                <h3>
                    ${escapeHtml(
                        goal.name || "Unnamed Goal"
                    )}
                </h3>

                <div class="goal-row">
                    <span>Target:</span>

                    <strong>
                        ${formatMoney(
                            goal.target_amount
                        )}
                    </strong>
                </div>

                <div class="goal-row">
                    <span>Current:</span>

                    <strong>
                        ${formatMoney(
                            goal.current_amount
                        )}
                    </strong>
                </div>

                <div class="goal-row">
                    <span>Remaining:</span>

                    <strong>
                        ${formatMoney(
                            goal.remaining_amount
                        )}
                    </strong>
                </div>

                <div class="progress-container">

                    <div
                        class="progress-bar"
                        style="width: ${safeProgress}%;">
                    </div>

                </div>

                <div class="goal-row">
                    <span>Progress:</span>

                    <strong>
                        ${progress}%
                    </strong>
                </div>

                <div class="goal-row">
                    <span>Monthly Requirement:</span>

                    <strong>
                        ${formatMoney(
                            goal.monthly_requirement
                        )}
                    </strong>
                </div>

                <div class="goal-row">
                    <span>Target Date:</span>

                    <strong>
                        ${
                            goal.target_date
                                ? formatDate(goal.target_date)
                                : "-"
                        }
                    </strong>
                </div>

                <div class="goal-row">
                    <span>Priority:</span>

                    <strong>
                        ${escapeHtml(
                            goal.priority || "MEDIUM"
                        )}
                    </strong>
                </div>

            </div>

        `;

    }).join("");

}


// =========================================================
// LOAD RECOMMENDATION
// =========================================================

async function loadRecommendation(goals) {

    const container =
        document.getElementById(
            "recommendation-container"
        );

    if (!container) {
        return;
    }


    if (!Array.isArray(goals) || goals.length === 0) {

        container.innerHTML = `
            <div class="message">
                No financial goal available
                for recommendation.
            </div>
        `;

        return;

    }


    const goalId = goals[0].id;

    if (!goalId) {

        container.innerHTML = `
            <div class="message error">
                Goal ID is missing.
            </div>
        `;

        return;

    }


    try {

        container.innerHTML = `
            <div class="message">
                Loading recommendation...
            </div>
        `;


        const data =
            await apiRequest(
                `/recommendations/${goalId}`
            );


        renderRecommendation(data);

    }
    catch (error) {

        console.error(
            "Recommendation error:",
            error
        );

        container.innerHTML = `
            <div class="message error">
                Unable to load recommendation.
                <br>
                ${escapeHtml(error.message)}
            </div>
        `;

    }

}


// =========================================================
// RENDER RECOMMENDATION
// =========================================================

function renderRecommendation(data) {

    const container =
        document.getElementById(
            "recommendation-container"
        );

    if (!container) {
        return;
    }


    const goal =
        data.goal || {};

    const risk =
        data.risk_profile || {};

    const allocation =
        data.suggested_allocation || {};

    const recommendation =
        data.recommendation || {};


    container.innerHTML = `

        <div class="card">

            <h3>Financial Goal</h3>

            <div class="goal-row">
                <span>Goal Name:</span>

                <strong>
                    ${escapeHtml(goal.name || "-")}
                </strong>
            </div>

            <div class="goal-row">
                <span>Risk Score:</span>

                <strong>
                    ${risk.score ?? "-"}
                </strong>
            </div>

            <div class="goal-row">
                <span>Risk Category:</span>

                <strong>
                    ${escapeHtml(
                        risk.category || "-"
                    )}
                </strong>
            </div>

            <div class="goal-row">
                <span>Target Amount:</span>

                <strong>
                    ${formatMoney(goal.target_amount)}
                </strong>
            </div>

            <div class="goal-row">
                <span>Current Amount:</span>

                <strong>
                    ${formatMoney(goal.current_amount)}
                </strong>
            </div>

            <div class="goal-row">
                <span>Monthly Requirement:</span>

                <strong>
                    ${formatMoney(
                        data.monthly_requirement
                    )}
                </strong>
            </div>

            <hr>

            <h3>Suggested Allocation</h3>

            <div class="goal-row">
                <span>Equity:</span>

                <strong>
                    ${allocation.equity ?? 0}%
                </strong>
            </div>

            <div class="goal-row">
                <span>Bonds:</span>

                <strong>
                    ${allocation.bonds ?? 0}%
                </strong>
            </div>

            <div class="goal-row">
                <span>Cash:</span>

                <strong>
                    ${allocation.cash ?? 0}%
                </strong>
            </div>

            <hr>

            <h3>Recommended Action</h3>

            <p>
                <strong>
                    ${escapeHtml(
                        recommendation.action ||
                        "No recommendation available."
                    )}
                </strong>
            </p>

            ${
                recommendation.reason
                    ? `
                        <p>
                            <strong>Reason:</strong>

                            ${escapeHtml(
                                recommendation.reason
                            )}
                        </p>
                    `
                    : ""
            }

            ${
                recommendation.risk_guidance
                    ? `
                        <p>
                            <strong>Risk Guidance:</strong>

                            ${escapeHtml(
                                recommendation.risk_guidance
                            )}
                        </p>
                    `
                    : ""
            }

        </div>

    `;

}


// =========================================================
// LOAD HOLDINGS
// =========================================================

async function loadHoldings() {

    const container =
        document.getElementById(
            "holdings-container"
        );

    if (!container) {
        return;
    }


    try {

        const data =
            await apiRequest("/holdings/client");


        if (!Array.isArray(data) || data.length === 0) {

            container.innerHTML = `
                <div class="message">
                    No portfolio holdings found.
                </div>
            `;

            return;

        }


        container.innerHTML = `

            <table>

                <thead>

                    <tr>
                        <th>Symbol</th>
                        <th>Quantity</th>
                        <th>Current Price</th>
                        <th>Value</th>
                    </tr>

                </thead>

                <tbody>

                    ${data.map(function (holding) {

                        return `

                            <tr>

                                <td>
                                    ${escapeHtml(
                                        holding.symbol || "-"
                                    )}
                                </td>

                                <td>
                                    ${holding.quantity ?? "-"}
                                </td>

                                <td>
                                    ${
                                        holding.current_price != null
                                            ? formatMoney(
                                                holding.current_price
                                            )
                                            : "-"
                                    }
                                </td>

                                <td>
                                    ${
                                        holding.value != null
                                            ? formatMoney(
                                                holding.value
                                            )
                                            : "-"
                                    }
                                </td>

                            </tr>

                        `;

                    }).join("")}

                </tbody>

            </table>

        `;

    }
    catch (error) {

        console.error(
            "Holdings error:",
            error
        );

        container.innerHTML = `
            <div class="message error">
                ${escapeHtml(error.message)}
            </div>
        `;

    }

}


// =========================================================
// LOAD TRANSACTIONS
// =========================================================

async function loadTransactions() {

    const container =
        document.getElementById(
            "transactions-container"
        );

    if (!container) {
        return;
    }


    try {

        const data =
            await apiRequest("/transactions/");


        if (!Array.isArray(data) || data.length === 0) {

            container.innerHTML = `
                <div class="message">
                    No transactions found.
                </div>
            `;

            return;

        }


        container.innerHTML = `

            <table>

                <thead>

                    <tr>
                        <th>Type</th>
                        <th>Account</th>
                        <th>Holding</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>

                </thead>

                <tbody>

                    ${data.map(function (transaction) {

                        return `

                            <tr>

                                <td>
                                    ${escapeHtml(
                                        transaction.transaction_type || "-"
                                    )}
                                </td>

                                <td>
                                    ${transaction.account_id ?? "-"}
                                </td>

                                <td>
                                    ${transaction.holding_id ?? "-"}
                                </td>

                                <td>
                                    ${transaction.quantity ?? "-"}
                                </td>

                                <td>
                                    ${
                                        transaction.price != null
                                            ? formatMoney(
                                                transaction.price
                                            )
                                            : "-"
                                    }
                                </td>

                                <td>
                                    ${formatMoney(
                                        transaction.amount
                                    )}
                                </td>

                                <td>
                                    ${
                                        transaction.transaction_date
                                            ? formatDate(
                                                transaction.transaction_date
                                            )
                                            : "-"
                                    }
                                </td>

                            </tr>

                        `;

                    }).join("")}

                </tbody>

            </table>

        `;

    }
    catch (error) {

        console.error(
            "Transactions error:",
            error
        );

        container.innerHTML = `
            <div class="message error">
                ${escapeHtml(error.message)}
            </div>
        `;

    }

}


// =========================================================
// TRANSACTION ELEMENTS
// =========================================================

const transactionType =
    document.getElementById("transaction-type");

const transactionAccount =
    document.getElementById("transaction-account");
const transactionAccountDisplay =
    document.getElementById("transaction-account-display");

const transactionHolding =
    document.getElementById("transaction-holding");

const transactionQuantity =
    document.getElementById("transaction-quantity");

const transactionPrice =
    document.getElementById("transaction-price");

const transactionAmount =
    document.getElementById("transaction-amount");

const transactionButton =
    document.getElementById("transaction-button");

const transactionMessage =
    document.getElementById("transaction-message");

const holdingFields =
    document.getElementById("holding-fields");

const quantityField =
    document.getElementById("quantity-field");

const priceField =
    document.getElementById("price-field");


// =========================================================
// TRANSACTION FIELD VISIBILITY
// =========================================================
// =========================================================
// LOAD LOGGED-IN USER ACCOUNT
// =========================================================

async function loadMyAccount() {

    if (!transactionAccount) {
        console.error("Transaction account field not found.");
        return;
    }

    if (transactionAccountDisplay) {
        transactionAccountDisplay.value = "Loading account...";
    }

    try {
        const account = await apiRequest("/transactions/account/");

        if (!account || !account.id) {
            throw new Error("No account returned for this user.");
        }

        transactionAccount.value = account.id;

        if (transactionAccountDisplay) {
            transactionAccountDisplay.value =
                `${account.account_type || "Account"} | ${
                    account.account_number || "ID: " + account.id
                }`;
        }

        console.log("Logged-in user account loaded:", account);

    } catch (error) {

        console.error("Account loading error:", error);

        transactionAccount.value = "";

        if (transactionAccountDisplay) {
            transactionAccountDisplay.value = "Account unavailable";
        }
    }
}
function updateTransactionFields() {

    if (!transactionType) {
        return;
    }

    const type =
        transactionType.value;

    const isTrade =
        type === "BUY" ||
        type === "SELL";


    if (holdingFields) {
        holdingFields.style.display =
            isTrade ? "block" : "none";
    }

    if (quantityField) {
        quantityField.style.display =
            isTrade ? "block" : "none";
    }

    if (priceField) {
        priceField.style.display =
            isTrade ? "block" : "none";
    }


    if (transactionHolding) {

        transactionHolding.required =
            isTrade;

        if (!isTrade) {
            transactionHolding.value = "";
        }

    }


    if (transactionQuantity) {

        transactionQuantity.required =
            isTrade;

        if (!isTrade) {
            transactionQuantity.value = "";
        }

    }


    if (transactionPrice) {

        transactionPrice.required =
            isTrade;

        if (!isTrade) {
            transactionPrice.value = "";
        }

    }

}


// =========================================================
// CREATE TRANSACTION
// =========================================================

async function createTransaction() {

    if (!transactionMessage) {
        return;
    }

    transactionMessage.textContent = "";


    const type =
        transactionType?.value;

    const accountId =
        Number(transactionAccount?.value);

    const amount =
        Number(transactionAmount?.value);


    if (!accountId) {

        transactionMessage.textContent =
            "Account ID is required.";

        return;

    }


    if (!amount || amount <= 0) {

        transactionMessage.textContent =
            "Amount must be greater than 0.";

        return;

    }


    const payload = {

        account_id: accountId,

        transaction_type: type,

        amount: amount

    };


    if (type === "BUY" || type === "SELL") {

        const holdingId =
            Number(transactionHolding?.value);

        const quantity =
            Number(transactionQuantity?.value);

        const price =
            Number(transactionPrice?.value);


        if (!holdingId) {

            transactionMessage.textContent =
                "Holding ID is required.";

            return;

        }


        if (!quantity || quantity <= 0) {

            transactionMessage.textContent =
                "Quantity must be greater than 0.";

            return;

        }


        if (!price || price <= 0) {

            transactionMessage.textContent =
                "Price must be greater than 0.";

            return;

        }


        payload.holding_id = holdingId;
        payload.quantity = quantity;
        payload.price = price;

    }


    if (transactionButton) {

        transactionButton.disabled = true;
        transactionButton.textContent = "Processing...";

    }


    try {

        const data =
            await apiRequest(
                
    "/transactions/",
                {
                    method: "POST",

                    body: JSON.stringify(payload)
                }
            );


        transactionMessage.textContent =
            `Transaction successful! ID: ${
                data?.transaction_id ?? "-"
            }`;


        if (transactionAmount) {
            transactionAmount.value = "";
        }

        if (transactionQuantity) {
            transactionQuantity.value = "";
        }

        if (transactionPrice) {
            transactionPrice.value = "";
        }


        await loadDashboard();
        await loadHoldings();
        await loadTransactions();

    }
    catch (error) {

        console.error(
            "Transaction error:",
            error
        );

        transactionMessage.textContent =
            error.message ||
            "Transaction failed.";

    }
    finally {

        if (transactionButton) {

            transactionButton.disabled = false;

            transactionButton.textContent =
                "Submit Transaction";

        }

    }

}


// =========================================================
// TRANSACTION EVENTS
// =========================================================

if (transactionType) {

    transactionType.addEventListener(
        "change",
        updateTransactionFields
    );

}


if (transactionButton) {

    transactionButton.addEventListener(
        "click",
        createTransaction
    );

}


updateTransactionFields();
// =========================================================
// CREATE FINANCIAL GOAL
// =========================================================

if (goalForm) {

    goalForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("goal-name").value.trim();

            const targetAmount =
                Number(
                    document.getElementById(
                        "goal-target-amount"
                    ).value
                );

            const currentAmount =
                Number(
                    document.getElementById(
                        "goal-current-amount"
                    ).value || 0
                );

            const targetDate =
                document.getElementById(
                    "goal-target-date"
                ).value;

            const priority =
                document.getElementById(
                    "goal-priority"
                ).value;

            if (
                !name ||
                !targetAmount ||
                targetAmount <= 0 ||
                currentAmount < 0 ||
                !targetDate
            ) {

                goalFormMessage.textContent =
                    "Please enter valid goal details.";

                return;
            }

            if (currentAmount > targetAmount) {

                goalFormMessage.textContent =
                    "Current amount cannot exceed target amount.";

                return;
            }

            goalFormMessage.textContent =
                "Creating your financial goal...";

            try {

                const data = await apiRequest(
                    "/goals/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            target_amount: targetAmount,
                            current_amount: currentAmount,
                            target_date: targetDate,
                            priority: priority
                        })
                    }
                );

                console.log(
                    "Goal creation response:",
                    data
                );

                goalFormMessage.textContent =
                    "Financial goal created successfully.";

                goalForm.reset();

                document.getElementById(
                    "goal-current-amount"
                ).value = "0";

                // Refresh dashboard goals
                await loadDashboard();

            } catch (error) {

                console.error(
                    "Goal creation error:",
                    error
                );

                goalFormMessage.textContent =
                    error.message ||
                    "Unable to create financial goal.";

            }

        }
    );

}

// =========================================================
// INITIALIZE APPLICATION
// =========================================================

async function initializeDashboard() {

    const token =
        getToken();


    if (!token) {

        showLogin();

        return;

    }


    showDashboard();

}
// =========================================================
// RISK ASSESSMENT SUBMISSION
// =========================================================

if (riskAssessmentForm) {

    riskAssessmentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const answers = [];

            // Collect answers from all 4 questions
            for (let i = 1; i <= 7; i++) {

                const selectedAnswer =
                    document.querySelector(
                        `input[name="risk-q${i}"]:checked`
                    );

                if (!selectedAnswer) {

                    if (riskAssessmentMessage) {
                        riskAssessmentMessage.textContent =
                            `Please answer question ${i}.`;
                    }

                    return;
                }

                answers.push(
                    Number(selectedAnswer.value)
                );
            }

            if (riskAssessmentMessage) {
                riskAssessmentMessage.textContent =
                    "Saving your risk assessment...";
            }

            try {

                const data = await apiRequest(
                    "/risk/",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            answers: answers
                        })
                    }
                );

                console.log(
                    "Risk assessment response:",
                    data
                );

                if (riskScoreElement) {
                    riskScoreElement.textContent =
                        data.score;
                }

                if (riskCategoryElement) {
                    riskCategoryElement.textContent =
                        data.category;
                }

                if (riskAssessmentMessage) {
                    riskAssessmentMessage.textContent =
                        "Risk assessment saved successfully.";
                }

            } catch (error) {

                console.error(
                    "Risk assessment error:",
                    error
                );

                if (riskAssessmentMessage) {
                    riskAssessmentMessage.textContent =
                        error.message ||
                        "Unable to save risk assessment.";
                }

            }

        }
    );

}

// ===============================
// REGISTRATION
// ===============================
// ===============================
// LOGOUT
// ===============================

const logoutButton = document.getElementById("logout-button");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        // Remove authentication data
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
        sessionStorage.clear();

        // Hide dashboard
        const dashboardPage = document.getElementById("dashboard-page");

        if (dashboardPage) {
            dashboardPage.style.display = "none";
        }

        // Show login page
        const loginPage = document.getElementById("login-page");

        if (loginPage) {
            loginPage.style.display = "block";
        }

        // Hide registration page
        const registerPage = document.getElementById("register-page");

        if (registerPage) {
            registerPage.style.display = "none";
        }

        console.log("User logged out successfully.");

    });

}

initializeDashboard();