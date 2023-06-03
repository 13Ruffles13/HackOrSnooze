"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/**
 * Function: navAllStories
 * Description: Show the main list of all stories when the site name is clicked.
 * Parameters:
 *   - evt: The click event object
 */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $storiesContainerElement.show();
}

$bodyElement.on("click", "#nav-all", navAllStories);

/**
 * Function: navSubmitStory__click
 * Description: Show the story submit form when the "Submit" button is clicked.
 * Parameters:
 *   - evt: The click event object
 */
function navSubmitStory__click(evt) {
  console.debug("navSubmitStories", evt);
  hidePageComponents();
  $allStoriesListElement.show();
  $submitFormElement.show();
  $storiesContainerElement.show();
}

$navSubmitStoryElement.on("click", navSubmitStory__click);

/**
 * Function: navFavoriteStories__click
 * Description: Show the user's favorite stories when the "Favorites" button is clicked.
 * Parameters:
 *   - evt: The click event object
 */
function navFavoriteStories__click(evt) {
  console.debug("navFavoriteStories__click", evt);
  hidePageComponents();
  putFavoriteStoriesOnUI();
  $storiesContainerElement.show();
}

$bodyElement.on("click", "#nav-favorites", navFavoriteStories__click);

/**
 * Function: navMyStories__click
 * Description: Show the user's own stories when the "My Stories" button is clicked.
 * Parameters:
 *   - evt: The click event object
 */
function navMyStories__click(evt) {
  console.debug("navMyStories__click", evt);
  hidePageComponents();
  putUserStoriesOnUI();
  $storiesContainerElement.show();
  $ownStoriesElement.show();
}

$bodyElement.on("click", "#nav-my-stories", navMyStories__click);

/**
 * Function: navLoginClick
 * Description: Show the login/signup forms when the "Login" button is clicked.
 * Parameters:
 *   - evt: The click event object
 */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginFormElement.show();
  $signupFormElement.show();
  $storiesContainerElement.hide();
}

$navLoginElement.on("click", navLoginClick);

/**
 * Function: navProfile__click
 * Description: Hide all content except the user profile when the user's profile button is clicked.
 * Parameters:
 *   - evt: The click event object
 */
function navProfile__click(evt) {
  console.debug("navProfile__click", evt);
  hidePageComponents();
  $userProfileElement.show();
  $loginAndSignupElement.hide();
  $storiesContainerElement.hide();
}

$navUserProfileElement.on("click", navProfile__click);

/**
 * Function: updateNavOnLogin
 * Description: Update the navbar when a user logs in.
 */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").css("display", "flex");
  $navLoginElement.hide();
  $navLogOutElement.show();
  $navUserProfileElement.text(`${currentUser.username}`).show();
}
