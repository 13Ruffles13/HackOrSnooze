"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/**
 * Gets and shows stories when the site first loads.
 */
async function loadAndDisplayStories() {
  try {
    storyList = await StoryList.getStories();
    $loadingMessageElement.remove();
    displayStories();
  } catch (error) {
    console.error(
      "An error occurred while loading and displaying stories:",
      error
    );
  }
}

/**
 * Generates HTML markup for an individual Story instance.
 *
 * @param {Story} story - An instance of Story.
 * @param {boolean} [showDeleteBtn=false] - A boolean indicating whether to show the delete button.
 * @returns {jQuery} The HTML markup for the story.
 */
function generateStoryMarkup(story, showDeleteBtn = false) {
  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);

  return $(`
    <li id="${story.storyId}">
      <div>
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
      </div>
    </li>
  `);
}

/**
 * Generates the HTML for a delete button for a story.
 *
 * @returns {string} The HTML markup for the delete button.
 */
function getDeleteBtnHTML() {
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>
  `;
}

/**
 * Generates the HTML for a favorite/not-favorite star for a story.
 *
 * @param {Story} story - An instance of Story.
 * @param {User} user - The current user.
 * @returns {string} The HTML markup for the star.
 */
function getStarHTML(story, user) {
  const isFav = user.isFavorite(story);
  const starType = isFav ? "fas" : "far";

  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
    </span>
  `;
}

/**
 * Retrieves a list of stories from the server, generates their HTML markup, and puts them on the page.
 */
function displayStories() {
  console.debug("putStoriesOnPage");

  // Empty the stories list element
  $allStoriesListElement.empty();

  // Loop through all stories and generate HTML for each of them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesListElement.append($story);
  }

  // Show the stories list element
  $allStoriesListElement.show();
}

/* ----------------- Functions added ---------------- */

/**
 * Deletes a story.
 *
 * @param {Event} evt - The event object.
 */
async function deleteStory(evt) {
  console.debug("deleteStory");

  const classNames = evt.target.className;

  if (
    !classNames.includes("fas fa-trash-alt") &&
    !classNames.includes("trash-can")
  ) {
    return; // No need to proceed if the event target does not have the desired class names
  }

  // Find the closest <li> element and retrieve the story ID
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  // Delete the story from the story list
  await storyList.deleteStory(currentUser, storyId);

  // Refresh the user's story list on the UI
  await displayUserStories();
}

$ownStoriesElement.on("click", deleteStory);

/**
 * Submits a new story.
 *
 * @param {Event} evt - The event object.
 */
async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  // Get data from the form
  const storyData = getFormData();

  try {
    // Add the story to the story list
    const story = await storyList.addStory(currentUser, storyData);

    // Generate HTML markup for the new story and prepend it to the stories list
    const $story = generateStoryMarkup(story);
    $allStoriesListElement.prepend($story);

    // Hide the form and reset its functionality
    $submitFormElement.slideUp("slow");
    $submitFormElement.trigger("reset");
  } catch (error) {
    console.error("Error submitting new story:", error);
    // Handle the error - display an error message, etc.
  }
}

/**
 * Gets the form data for submitting a new story.
 *
 * @returns {object} The form data containing title, url, author, and username.
 */
function getFormData() {
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;

  return { title, url, author, username };
}

$submitFormElement.on("submit", submitNewStory);

/**
 * Displays the current user's own stories on the UI.
 */
function displayUserStories() {
  console.debug("putUserStoriesOnUI");
  $ownStoriesElement.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStoriesElement.append("<h5>No stories added by user!</h5>");
  } else {
    const $storyMarkup = currentUser.ownStories.map((story) =>
      generateStoryMarkup(story, true)
    );
    $ownStoriesElement.append($storyMarkup);
  }

  $ownStoriesElement.show();
}

/**
 * Displays the favorite stories of the current user on the UI.
 */
function displayFavoriteStories() {
  console.debug("putFavoriteStoriesOnUI");
  $favoriteStoriesElement.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStoriesElement.append("<h5>No favorite stories added!</h5>");
  } else {
    const $storyMarkup = currentUser.favorites.map((story) =>
      generateStoryMarkup(story)
    );
    $favoriteStoriesElement.append($storyMarkup);
  }

  $favoriteStoriesElement.show();
}

/**
 * Toggles favorite/unfavorite a story.
 */
$storiesLists.on("click", ".star", async function (evt) {
  console.debug("toggleFavoriteStories");
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  let isFavorite = currentUser.isFavorite(story);

  if (isFavorite) {
    // Remove story from favorites
    await currentUser.removeFavorite(story);
  } else {
    // Add story to favorites
    await currentUser.addFavorite(story);
  }

  $tgt.closest("i").toggleClass("fas far");
});
