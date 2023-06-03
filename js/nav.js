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

$body.on("click", "#nav-all", navAllStories);

// Show story submit form
function navSubmitStory__click(evt) {
  console.debug("navSubmitStories", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}
$navSubmitStory.on("click", navSubmitStory__click);

// Show my favorite stories on click
function navFavoriteStories__click(evt) {
  console.debug("navFavoriteStories__click", evt);
  hidePageComponents();
  putFavoriteStoriesOnUI();
}
$body.on("click", "#nav-favorites", navFavoriteStories__click);

// Show my stories on click my stories 
function navMyStories__click(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnUI();
  $ownStories.show();
}
$body.on("click", "#nav-my-stories", navMyStories__click);
/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide();
}

$navLogin.on("click", navLoginClick);

// Hide all content but profile
function navProfile__click(evt){
  console.debug("navProfile__click", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfile__click);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").css("display", "flex");
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
