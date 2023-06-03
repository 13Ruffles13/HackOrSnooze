"use strict";

const $bodyElement = $("body");

const $loadingMessageElement = $("#stories-loading-msg");
const $allStoriesListElement = $("#all-stories-list");
const $favoriteStoriesElement = $("#favorited-stories");
const $ownStoriesElement = $("#my-stories");
const $storiesContainerElement = $("#stories-container");

const $storiesLists = $(".stories-list");

const $loginAndSignupElement = $("#login-signup-forms");
const $loginFormElement = $("#login-form");
const $signupFormElement = $("#signup-form");
const $submitFormElement = $("#submit-form");

const $navSubmitStoryElement = $("#nav-submit-story");
const $navLoginElement = $("#nav-login");
const $navUserProfileElement = $("#nav-user-profile");
const $navLogOutElement = $("#nav-logout");

const $userProfileElement = $("#user-profile");

/**
 * Hides all page components to make it easier for individual components to show themselves.
 * After calling this function, individual components can re-show just what they want.
 */
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

/**
 * Overall function to kick off the app.
 */
async function start() {
  console.debug("start");

  // Check if there is a remembered user and automatically log in
  await checkForRememberedUser();

  // Fetch and display stories on app start
  await getAndShowStoriesOnStart();

  // If a logged-in user exists, update the UI accordingly
  if (currentUser) {
    updateUIOnUserLogin();
  }
}

// Once the DOM is entirely loaded, begin the app
console.warn(
  "HEY STUDENT: This program sends many debug messages to" +
    " the console. If you don't see the message 'start' below this, you're not" +
    " seeing those helpful debug messages. In your browser console, click on" +
    " menu 'Default Levels' and add Verbose"
);

// Start the app when the DOM is fully loaded
$(start);
