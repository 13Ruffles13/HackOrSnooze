"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/**
 * Function: navAllStories
 * Description: Show the main list of all stories when the site name is clicked.
 * @param {Event} evt - The click event object
 */
function navAllStories(evt) {
  console.debug("navAllStories", evt);

  // Hide other page components
  hidePageComponents();

  // Display all stories
  displayStories();

  // Show the stories container
  $storiesContainerElement.show();
}

$bodyElement.on("click", "#nav-all", navAllStories);

/**
 * Function: handleNavSubmitStoryClick
 * Description: Show the story submit form when the "Submit" button is clicked.
 * @param {Event} evt - The click event object
 */
function handleNavSubmitStoryClick(evt) {
  console.debug("handleNavSubmitStoryClick", evt);

  // Hide other page components
  hidePageComponents();

  // Show the submit form and stories container
  $submitFormElement.show();
  $storiesContainerElement.show();

  // Show all stories list
  $allStoriesListElement.show();
}

$navSubmitStoryElement.on("click", handleNavSubmitStoryClick);

/**
 * Function: handleNavFavoriteStoriesClick
 * Description: Show the user's favorite stories when the "Favorites" button is clicked.
 * @param {Event} evt - The click event object
 */
function handleNavFavoriteStoriesClick(evt) {
  console.debug("handleNavFavoriteStoriesClick", evt);

  // Hide other page components
  hidePageComponents();

  // Display favorite stories
  displayFavoriteStories();

  // Show the stories container
  $storiesContainerElement.show();
}

$bodyElement.on("click", "#nav-favorites", handleNavFavoriteStoriesClick);

/**
 * Function: handleNavMyStoriesClick
 * Description: Show the user's own stories when the "My Stories" button is clicked.
 * @param {Event} evt - The click event object
 */
function handleNavMyStoriesClick(evt) {
  console.debug("handleNavMyStoriesClick", evt);

  // Hide other page components
  hidePageComponents();

  // Display user stories
  displayUserStories();

  // Show the stories container and own stories element
  $storiesContainerElement.show();
  $ownStoriesElement.show();
}

$bodyElement.on("click", "#nav-my-stories", handleNavMyStoriesClick);

/**
 * Function: handleNavLoginClick
 * Description: Show the login/signup forms when the "Login" button is clicked.
 * @param {Event} evt - The click event object
 */
function handleNavLoginClick(evt) {
  console.debug("handleNavLoginClick", evt);

  // Hide other page components
  hidePageComponents();

  // Show the login and signup forms
  $loginFormElement.show();
  $signupFormElement.show();

  // Hide the stories container
  $storiesContainerElement.hide();
}

$navLoginElement.on("click", handleNavLoginClick);

/**
 * Function: handleNavProfileClick
 * Description: Hide all content except the user profile when the user's profile button is clicked.
 * @param {Event} evt - The click event object
 */
function handleNavProfileClick(evt) {
  console.debug("handleNavProfileClick", evt);

  // Hide other page components
  hidePageComponents();

  // Show the user profile element
  $userProfileElement.show();

  // Hide the login and signup element and stories container
  $loginAndSignupElement.hide();
  $storiesContainerElement.hide();
}

$navUserProfileElement.on("click", handleNavProfileClick);

/**
 * Function: updateNavOnLogin
 * Description: Update the navbar when a user logs in.
 */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");

  // Display the main navigation links
  $(".main-nav-links").css("display", "flex");

  // Hide the login element and show the logout element
  $navLoginElement.hide();
  $navLogOutElement.show();

  // Set the username in the user profile element and show it
  $navUserProfileElement.text(currentUser.username).show();
}
