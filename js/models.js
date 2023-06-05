"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */
class Story {
  /**
   * Make an instance of Story from a data object about the story:
   *   - {storyId, title, author, url, username, createdAt}
   */
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /**
   * Parses the hostname out of the URL and returns it.
   */
  getHostName() {
    try {
      if (!this.url) {
        throw new Error("Invalid URL: URL is missing.");
      }

      const url = new URL(this.url);
      return url.host;
    } catch (error) {
      console.error("Error parsing URL:", error.message);
      return ""; // Return a default value or handle the error appropriately.
    }
  }
}

/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */
class StoryList {
  /**
   * Constructor for StoryList class.
   * @param {Array} stories - Array of Story instances.
   */
  constructor(stories) {
    this.stories = stories;
  }

  /**
   * Fetches stories from the API and creates a new StoryList instance.
   * @returns {StoryList} - The new StoryList instance.
   */
  static async getStories() {
    try {
      const response = await axios.get(`${BASE_URL}/stories`);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch stories. Status: ${response.status}`);
      }

      const storiesData = response.data.stories;

      const stories = storiesData.map((story) => new Story(story));

      return new StoryList(stories);
    } catch (error) {
      console.error("Error retrieving stories:", error.message);
      return null; // Return null or handle the error appropriately.
    }
  }

  /**
   * Adds a new story to the API, creates a Story instance, and adds it to the story list.
   * @param {User} user - The current user posting the story.
   * @param {Object} data - The data for the new story {title, author, url}.
   * @returns {Story} - The new Story instance.
   */
  async addStory(user, { title, author, url }) {
    try {
      const { loginToken } = user;

      const response = await axios.post(`${BASE_URL}/stories`, {
        token: loginToken,
        story: { title, author, url },
      });

      if (response.status !== 201) {
        throw new Error(`Failed to add story. Status: ${response.status}`);
      }

      const newStory = new Story(response.data.story);

      this.stories.unshift(newStory);
      user.ownStories.unshift(newStory);

      return newStory;
    } catch (error) {
      console.error("Error adding story:", error.message);
      return null; // Return null or handle the error appropriately.
    }
  }

  /**
   * Deletes a story from the API and removes it from the story list.
   * @param {User} user - The current user deleting the story.
   * @param {string} storyId - The ID of the story to be deleted.
   */
  async deleteStory(user, storyId) {
    try {
      const { loginToken } = user;

      await axios.delete(`${BASE_URL}/stories/${storyId}`, {
        data: { token: loginToken },
      });

      this.stories = this.stories.filter((story) => story.storyId !== storyId);

      user.ownStories = user.ownStories.filter((s) => s.storyId !== storyId);
      user.favorites = user.favorites.filter((s) => s.storyId !== storyId);
    } catch (error) {
      console.error("Error deleting story:", error.message);
      // Handle the error appropriately or re-throw it to be handled elsewhere.
      throw error;
    }
  }
}

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /**
   * Constructor for User class.
   * @param {Object} userData - User data {username, name, createdAt, favorites[], ownStories[]}.
   * @param {string} token - The login token for the user.
   */
  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;
    this.favorites = favorites.map((s) => new Story(s));
    this.ownStories = ownStories.map((s) => new Story(s));
    this.loginToken = token;
  }

  static mapUserData(data) {
    const { user } = data;

    return {
      username: user.username,
      name: user.name,
      createdAt: user.createdAt,
      favorites: user.favorites,
      ownStories: user.stories,
    };
  }

  /**
   * Registers a new user in the API, creates a User instance, and returns it.
   * @param {string} username - The new username.
   * @param {string} password - The new password.
   * @param {string} name - The user's full name.
   * @returns {User} - The new User instance.
   */
  static async signup(username, password, name) {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        user: { username, password, name },
      });

      const user = User.mapUserData(response.data);

      return new User(user, response.data.token);
    } catch (error) {
      console.error(
        "Error signing up: Account already exists. Please choose a different username. ",
        error.message
      );
      throw error;
    }
  }

  /**
   * Logs in a user with the API, creates a User instance, and returns it.
   * @param {string} username - The existing user's username.
   * @param {string} password - The existing user's password.
   * @returns {User} - The User instance.
   */
  static async login(username, password) {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        user: { username, password },
      });

      const user = User.mapUserData(response.data);

      return new User(user, response.data.token);
    } catch (error) {
      console.error(
        "Error logging in: Invalid username or password. ",
        error.message
      );
      throw error;
    }
  }

  /**
   * Logs in a user with stored credentials (token and username) and returns a User instance.
   * @param {string} token - The login token for the user.
   * @param {string} username - The username of the user.
   * @returns {User|null} - The User instance or null if login fails.
   */
  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  /**
   * Adds a story to the user's favorites and updates the API.
   * @param {Story} story - The story to be added to favorites.
   */
  async addFavorite(story) {
    try {
      this.favorites.push(story);
      await this.updateFavorite("add", story);
    } catch (error) {
      console.error("Error adding favorite:", error.message);
      // Handle the error appropriately or re-throw it to be handled elsewhere.
      throw error;
    }
  }

  /**
   * Removes a story from the user's favorites and updates the API.
   * @param {Story} story - The story to be removed from favorites.
   */
  async removeFavorite(story) {
    try {
      this.favorites = this.favorites.filter(
        (s) => s.storyId !== story.storyId
      );
      await this.updateFavorite("remove", story);
    } catch (error) {
      console.error("Error removing favorite:", error.message);
      // Handle the error appropriately or re-throw it to be handled elsewhere.
      throw error;
    }
  }

  /**
   * Adds or removes a story from the user's favorites in the API.
   * @param {string} newState - The new state ('add' or 'remove').
   * @param {Story} story - The story to be added or removed.
   */
  async updateFavorite(newState, story) {
    try {
      const method = newState === "add" ? "POST" : "DELETE";
      const token = this.loginToken;

      await axios({
        url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
        method: method,
        data: { token },
      });
    } catch (error) {
      console.error("Error updating favorite:", error.message);
      // Handle the error appropriately or re-throw it to be handled elsewhere.
      throw error;
    }
  }

  /**
   * Checks if a story is in the user's favorites.
   * @param {Story} story - The story to check.
   * @returns {boolean} - True if the story is a favorite, false otherwise.
   */
  isFavorite(story) {
    const { storyId } = story;
    return this.favorites.some((s) => s.storyId === storyId);
  }
}
