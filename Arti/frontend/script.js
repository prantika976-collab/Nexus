/* ==============================
   Editable Welcome Content
================================= */

const APP_CONTENT = {
    appName: "Your Platform Name",

    heading: "Growing a better future, together.",

    description:
        "Connect farmers and businesses to reduce waste, share resources, and build a more sustainable agricultural ecosystem."
};


/* ==============================
   Screen Elements
================================= */

const welcomeScreen = document.getElementById("welcome-screen");
const roleScreen = document.getElementById("role-screen");
const authScreen = document.getElementById("auth-screen");

const getStartedButton = document.getElementById("get-started-btn");
const backToWelcomeButton = document.getElementById("back-to-welcome");
const backToRoleButton = document.getElementById("back-to-role");

const appNameElement = document.getElementById("app-name");
const roleAppNameElement = document.getElementById("role-app-name");
const authAppNameElement = document.getElementById("auth-app-name");

const welcomeHeading = document.getElementById("welcome-heading");
const welcomeDescription = document.getElementById("welcome-description");

const roleCards = document.querySelectorAll(".role-card");
const roleMessage = document.getElementById("role-message");

const authRoleHeading = document.getElementById("auth-role-heading");
const authTitle = document.getElementById("auth-title");
const authDescription = document.getElementById("auth-description");

const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const farmerFields = document.getElementById("farmer-fields");
const businessFields = document.getElementById("business-fields");

const authMessage = document.getElementById("auth-message");

const googleLoginButton = document.getElementById("google-login");
const googleSignupButton = document.getElementById("google-signup");

let selectedRole = null;

/* ==============================
   Profile Screen Elements
================================= */

const profileScreen = document.getElementById("profile-screen");
const profileAppNameElement = document.getElementById("profile-app-name");
const profileName = document.getElementById("profile-name");
const profileDisplayName = document.getElementById("profile-display-name");
const profileDisplayEmail = document.getElementById("profile-display-email");
const profileAvatar = document.getElementById("profile-avatar");
const profileRole = document.getElementById("profile-role");

const profileFullName = document.getElementById("profile-full-name");
const profileEmail = document.getElementById("profile-email");
const profilePhone = document.getElementById("profile-phone");

const profileSpecificTitle =
    document.getElementById("profile-specific-title");

const profileSpecificDetails =
    document.getElementById("profile-specific-details");

const logoutButton = document.getElementById("logout-button");
const profileMessage = document.getElementById("profile-message");


/* ==============================
   Load Editable Content
================================= */

appNameElement.textContent = APP_CONTENT.appName;
roleAppNameElement.textContent = APP_CONTENT.appName;
authAppNameElement.textContent = APP_CONTENT.appName;

welcomeHeading.textContent = APP_CONTENT.heading;
welcomeDescription.textContent = APP_CONTENT.description;


/* ==============================
   Screen Navigation
================================= */

function showScreen(screenToShow) {
    welcomeScreen.classList.remove("active");
    roleScreen.classList.remove("active");
    authScreen.classList.remove("active");
    profileScreen.classList.remove("active");

    screenToShow.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ==============================
   Get Started
================================= */

getStartedButton.addEventListener("click", function () {
    showScreen(roleScreen);
});


/* ==============================
   Back to Welcome
================================= */

backToWelcomeButton.addEventListener("click", function () {
    showScreen(welcomeScreen);

    roleMessage.textContent = "";
});


/* ==============================
   Back to Role Selection
================================= */

backToRoleButton.addEventListener("click", function () {
    showScreen(roleScreen);

    authMessage.textContent = "";
});


/* ==============================
   Open Authentication Screen
================================= */

roleCards.forEach(function (card) {
    card.addEventListener("click", function () {
        selectedRole = card.dataset.role;
        window.selectedRole = selectedRole;

        updateRoleSpecificContent(selectedRole);

        showScreen(authScreen);

        // Open Login tab whenever a role is selected
        loginTab.classList.add("active");
        signupTab.classList.remove("active");

        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");

        authMessage.textContent = "";
    });
});

/* ==============================
   Update Role-specific Content
================================= */

function updateRoleSpecificContent(role) {
    const farmerInputs = farmerFields.querySelectorAll(
        "input, select, textarea"
    );

    const businessInputs = businessFields.querySelectorAll(
        "input, select, textarea"
    );

    if (role === "farmer") {
        farmerFields.classList.remove("hidden");
        businessFields.classList.add("hidden");

        farmerInputs.forEach(function (input) {
            input.disabled = false;
        });

        businessInputs.forEach(function (input) {
            input.disabled = true;
        });

        authRoleHeading.textContent = "Farmer Account";

        authTitle.textContent =
            "Continue your farming journey with us.";

        authDescription.textContent =
            "Create your farmer account to manage farm information, crops, resources, and available produce.";

    } else if (role === "business") {
        farmerFields.classList.add("hidden");
        businessFields.classList.remove("hidden");

        farmerInputs.forEach(function (input) {
            input.disabled = true;
        });

        businessInputs.forEach(function (input) {
            input.disabled = false;
        });

        authRoleHeading.textContent = "Business Account";

        authTitle.textContent =
            "Connect with the agricultural community.";

        authDescription.textContent =
            "Create your business account to find produce, connect with farmers, and reduce agricultural waste.";
    }
}
        
/* ==============================
   Login and Signup Tabs
================================= */

loginTab.addEventListener("click", function () {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");

    authMessage.textContent = "";
});


signupTab.addEventListener("click", function () {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    // Make sure the correct role fields are displayed
    updateRoleSpecificContent(selectedRole);

    authMessage.textContent = "";
});


/* ==============================
   Login Form
================================= */

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    authMessage.textContent =
        "Login form submitted. Authentication will be connected with Firebase later.";
});


/* ==============================
   Signup Form
================================= */

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    authMessage.textContent =
        "Signup form submitted. Profile data will be saved to the database after backend integration.";
});

/* ==============================
   Google Authentication
================================= */

// Firebase sign-in is handled by signInWithGoogle()
// from the Firebase script in index.html.
/* ==============================
   Display Saved Profile
================================= */

function displaySavedProfile(savedProfile, user) {
    const name =
        savedProfile.fullName ||
        user.displayName ||
        "User";

    const email =
        savedProfile.email ||
        user.email ||
        "No email available";

    const phone =
        savedProfile.phone ||
        "Not provided";

    const role =
        savedProfile.role ||
        "User";

    profileAppNameElement.textContent = APP_CONTENT.appName;

    profileName.textContent = name;
    profileDisplayName.textContent = name;
    profileDisplayEmail.textContent = email;

    profileAvatar.textContent = name.charAt(0).toUpperCase();

    profileRole.textContent = role;

    profileFullName.textContent = name;
    profileEmail.textContent = email;
    profilePhone.textContent = phone;


    profileSpecificDetails.innerHTML = "";


    if (role === "farmer" && savedProfile.farmerProfile) {
        const farmer = savedProfile.farmerProfile;

        profileSpecificTitle.textContent = "Farm Information";

        addProfileDetail("Farm Location", farmer.farmLocation);
        addProfileDetail("District", farmer.farmDistrict);
        addProfileDetail("Farm Size", farmer.farmSize);
        addProfileDetail("Unit", farmer.farmUnit);
        addProfileDetail("Farming Type", farmer.farmingType);

    } else if (role === "business" && savedProfile.businessProfile) {
        const business = savedProfile.businessProfile;

        profileSpecificTitle.textContent = "Business Information";

        addProfileDetail("Business Name", business.businessName);
        addProfileDetail("Business Type", business.businessType);
        addProfileDetail("Business Location", business.businessLocation);
        addProfileDetail("District", business.businessDistrict);
        addProfileDetail("Produce Required", business.produceRequired);

    } else {
        profileSpecificTitle.textContent = "Profile Information";

        profileSpecificDetails.innerHTML =
            "<p>No additional profile information available.</p>";
    }

    showScreen(profileScreen);
}


/* ==============================
   Add Profile Detail
================================= */

function addProfileDetail(label, value) {
    const row = document.createElement("div");

    row.className = "profile-specific-item";

    row.innerHTML = `
        <span>${label}</span>
        <strong>${value || "Not provided"}</strong>
    `;

    profileSpecificDetails.appendChild(row);
}
