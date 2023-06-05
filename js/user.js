"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/**
 * Handles the login form submission. If login is successful, sets up the user instance.
 *
 * @param {Event} evt - The click event object.
 */
async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  try {
    // User.login retrieves user info from API and returns User instance
    // which we'll make the globally-available, logged-in user.
    currentUser = await User.login(username, password);
    $loginFormElement.trigger("reset");
    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
  } catch (error) {
    console.error("Login failed", error);
    // Handle login error (e.g., display error message)
  }
}

$loginFormElement.on("submit", login);

/**
 * Handles the signup form submission.
 *
 * @param {Event} evt - The click event object.
 */
async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  try {
    // User.signup retrieves user info from API and returns User instance
    // which we'll make the globally-available, logged-in user.
    currentUser = await User.signup(username, password, name);
    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
    $signupFormElement.trigger("reset");
  } catch (error) {
    console.error("Signup failed", error);
    // Handle signup error (e.g., display error message)
  }
}

$signupFormElement.on("submit", signup);

/**
 * Handles the click of the logout button.
 *
 * @param {Event} evt - The click event object.
 */
function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOutElement.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/**
 * Checks if there are user credentials in local storage,
 * logs in the user, and sets up the user instance.
 * This is meant to be called on page load, just once.
 *
 * @returns {boolean} True if remembered user exists, False otherwise.
 */
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  try {
    // try to log in with these credentials (will be null if login failed)
    currentUser = await User.loginViaStoredCredentials(token, username);
    return true;
  } catch (error) {
    console.error("Remembered user login failed", error);
    return false;
  }
}

/**
 * Syncs the current user information to localStorage.
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */
function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/**
 * Updates the UI when a user signs up or logs in.
 */
function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  hidePageComponents();

  // Re-display cached user profile stories
  displayStories();
  $allStoriesListElement.show();
  updateNavOnLogin();
  generateUserProfile();
  $storiesContainerElement.show();
}

/**
 * Generates the user profile part of the page with the current user's information.
 */
function generateUserProfile() {
  console.debug("generateUserProfile");
  $("#profile-name").text(currentUser.name);
  $("#profile-username").text(currentUser.username);
  $("#profile-account-date").text(currentUser.createdAt.slice(0, 10));
}
