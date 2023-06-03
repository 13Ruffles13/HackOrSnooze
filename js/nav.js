"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$bodyElement.on("click", "#nav-all", navAllStories);

// Show story submit form
function navSubmitStory__click(evt) {
  console.debug("navSubmitStories", evt);
  hidePageComponents();
  $allStoriesListElement.show();
  $submitFormElement.show();
}
$navSubmitStoryElement.on("click", navSubmitStory__click);

// Show my favorite stories on click
function navFavoriteStories__click(evt) {
  console.debug("navFavoriteStories__click", evt);
  hidePageComponents();
  putFavoriteStoriesOnUI();
}
$bodyElement.on("click", "#nav-favorites", navFavoriteStories__click);

// Show my stories on click my stories
function navMyStories__click(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnUI();
  $ownStoriesElement.show();
}
$bodyElement.on("click", "#nav-my-stories", navMyStories__click);
/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginFormElement.show();
  $signupFormElement.show();
  $storiesContainerElement.hide();
}

$navLoginElement.on("click", navLoginClick);

// Hide all content but profile
function navProfile__click(evt) {
  console.debug("navProfile__click", evt);
  hidePageComponents();
  $userProfileElement.show();
}

$navUserProfileElement.on("click", navProfile__click);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").css("display", "flex");
  $navLoginElement.hide();
  $navLogOutElement.show();
  $navUserProfileElement.text(`${currentUser.username}`).show();
}
