"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/**
 * Get and show stories when the site first loads.
 */
async function getAndShowStoriesOnStart() {
  // Retrieve the list of stories
  storyList = await StoryList.getStories();

  // Remove the loading message from the page
  $loadingMessageElement.remove();

  // Display the stories on the page
  putStoriesOnPage();
}

/**
 * Generates HTML markup for an individual Story instance.
 * - story: An instance of Story.
 * - showDeleteBtn: A boolean indicating whether to show the delete button (default: false).
 *
 * Returns the HTML markup for the story.
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
 * Returns the HTML markup for the delete button.
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
 * - story: An instance of Story.
 * - user: The current user.
 *
 * Returns the HTML markup for the star.
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
function putStoriesOnPage() {
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
 * - evt: The event object.
 */
async function deleteStory(evt) {
  console.debug("deleteStory");

  if (evt.target.className === ("fas fa-trash-alt" || "trash-can")) {
    // Find the closest <li> element and retrieve the story ID
    const $closestLi = $(evt.target).closest("li");
    const storyId = $closestLi.attr("id");

    // Delete the story from the story list
    await storyList.deleteStory(currentUser, storyId);
  }

  // Refresh the user's story list on the UI
  await putUserStoriesOnUI();
}

$ownStoriesElement.on("click", deleteStory);

// Submit a new story - Handler will be called
async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  // Get data from the form
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  // Add the story to the story list
  const story = await storyList.addStory(currentUser, storyData);

  // Generate HTML markup for the new story and prepend it to the stories list
  const $story = generateStoryMarkup(story);
  $allStoriesListElement.prepend($story);

  // Hide the form and reset its functionality
  $submitFormElement.slideUp("slow");
  $submitFormElement.trigger("reset");
}

$submitFormElement.on("submit", submitNewStory);

/**
 * Displays the current user's own stories on the UI.
 */
function putUserStoriesOnUI() {
  console.debug("putUserStoriesOnUI");
  $ownStoriesElement.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStoriesElement.append("<h5>No stories added by user!</h5>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStoriesElement.append($story);
    }
  }

  $ownStoriesElement.show();
}

// Put favorite stories on UI
function putFavoriteStoriesOnUI() {
  console.debug("putFavoriteStoriesOnUI");
  $favoriteStoriesElement.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStoriesElement.append("<h5>No favorite stories added!</h5>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStoriesElement.append($story);
    }
  }
  $favoriteStoriesElement.show();
}

// Toggle favorite/unfavorite a story
async function toggleFavoriteStories(evt) {
  console.debug("toggleFavoriteStories");
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  if ($tgt.hasClass("fas")) {
    // Remove story from favorites
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // Add story to favorites
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavoriteStories);
