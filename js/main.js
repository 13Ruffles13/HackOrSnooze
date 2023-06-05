"use strict";

/**
 * jQuery Elements
 */

// Body element of the page
const $bodyElement = $("body");

// Loading message element
const $loadingMessageElement = $("#stories-loading-msg");

// Elements that contain the lists of stories
const $allStoriesListElement = $("#all-stories-list");
const $favoriteStoriesElement = $("#favorited-stories");
const $ownStoriesElement = $("#my-stories");

// Element that contains the stories
const $storiesContainerElement = $("#stories-container");

// List of all story elements
const $storiesLists = $(".stories-list");

// Element that contains the login and signup forms
const $loginAndSignupElement = $("#login-signup-forms");

// Login form element
const $loginFormElement = $("#login-form");

// Signup form element
const $signupFormElement = $("#signup-form");

// Submit form element
const $submitFormElement = $("#submit-form");

// Navigation elements
const $navSubmitStoryElement = $("#nav-submit-story");
const $navLoginElement = $("#nav-login");
const $navUserProfileElement = $("#nav-user-profile");
const $navLogOutElement = $("#nav-logout");

// User profile element
const $userProfileElement = $("#user-profile");

// Hides all page components to make it easier for individual components to show themselves.
// After calling this function, individual components can re-show just what they want.
function hidePageComponents() {
  const components = [
    $storiesLists,
    $submitFormElement,
    $loginFormElement,
    $signupFormElement,
    $userProfileElement,
  ];
  components.forEach((c) => c.hide());
}

// Overall function to kick off the app.
async function start() {
  console.debug("start");

  // Check if there is a remembered user and automatically log in
  await checkForRememberedUser();

  // Fetch and display stories on app start
  await loadAndDisplayStories();

  // If a logged-in user exists, update the UI accordingly
  if (currentUser) {
    updateUIOnUserLogin();
  }
}

/**
 * Event Listeners and DOM Ready
 */

// Once the DOM is entirely loaded, begin the app
console.warn(
  "HEY STUDENT: This program sends many debug messages to" +
    " the console. If you don't see the message 'start' below this, you're not" +
    " seeing those helpful debug messages. In your browser console, click on" +
    " menu 'Default Levels' and add Verbose"
);

// Start the app when the DOM is fully loaded
$(start);
