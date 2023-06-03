"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);

  return $(`
  <li id="${story.storyId}">
    <div>
    ${showDeleteBtn ? getDeleteBtnHTML() : ""}
    ${showStar ? getStarHTML(story, currentUser) : ""}
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <div class="story-author">by ${story.author}</div>
    <div class="story-user">posted by ${story.username}</div>
    </div>
  </li>
`);
}

// . Make a delete btn HTML for story
function getDeleteBtnHTML() {
  console.log("getDeleteBtnHTML");
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>
  `;
}

// . Make a fav / not-fav star for story
function getStarHTML(story, user) {
  console.debug("getStarHTML");
  const isFav = user.isFavorite(story);
  const starType = isFav ? "fas" : "far";
  return `
    <span class="star">
      <i class="${starType} fa-star"></i> 
    </span> 
  `;
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/* ----------------- Functions added ---------------- */

// . Delete a story - handler
async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.deleteStory(currentUser, storyId);

  //Refresh story list
  await putUserStoriesOnUI();
}

$ownStories.on("click", deleteStory);

// Submit a new story -- Handler will be called
async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  //Get data from the form
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //Hide the form and reset functionality
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}
$submitForm.on("submit", submitNewStory);

// Current user own stories
function putUserStoriesOnUI() {
  console.debug("putUserStoriesOnUI");
  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user!</h5>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

// Put favorite stories on UI
function putFavoriteStoriesOnUI() {
  console.debug("putFavoriteStoriesOnUI");
  $favoriteStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStories.append("<h5>No favorite stories added!</h5>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }
  $favoriteStories.show();
}

// Toggle fav/un-fav a story
async function toggleFavoriteStories(evt) {
  console.debug("toggleFavoriteStories");
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  if ($tgt.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavoriteStories);
