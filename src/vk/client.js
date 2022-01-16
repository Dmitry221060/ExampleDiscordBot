const fetch = require("node-fetch");
const { postsPerRequest } = require("../../config").tasks.crawlVKPosts;
const vkToken = process.env.vkToken || "";
const BASE_URL = "https://vk.com/";
const DEFAULT_NAME = "Unknown source";
const DEFAULT_PATHNAME = "id0";
const DEFAULT_AVATAR = "https://vk.com/images/camera_50.png";

class VKClient {
  async fetchPosts(groupId, offset = 0, count = 20) {
    try {
      const url = "https://api.vk.com/method/wall.get" +
                  "?owner_id=" + groupId +
                  "&offset=" + offset +
                  "&count=" + count +
                  "&extended=1" +
                  "&v=5.101" +
                  "&access_token=" + vkToken;
      const res = await fetch(url);

      const data = await res.json();
      return { data };
    } catch(error) {
      return { data: null, error };
    }
  }

  async getAllNewPosts(groupId, lastSeenPostId) {
    const newPosts = [];
    let offset = 0;
    let done = false;

    do {
      const result = await this.getNewPosts(groupId, offset, lastSeenPostId);
      offset += postsPerRequest;
      newPosts.push(...result.newPosts);
      done = result.done;
    } while (!done)

    return newPosts;
  }

  async getNewPosts(groupId, offset, lastSeenPostId) {
    const requestResults = await this.fetchPosts(groupId, offset, postsPerRequest);
    if (requestResults.error) throw new Error(requestResults.error);

    const posts = requestResults.data.response.items;
    const sources = requestResults.data.response.groups.concat(requestResults.data.response.profiles);
    const newPosts = [];

    for (const post of posts) {
      if (post.is_pinned) continue;

      post.source = getSource(sources, post.owner_id);
      post.copy_history?.forEach(repost => repost.source = getSource(sources, repost.owner_id));

      if (!lastSeenPostId) return { newPosts: [post], done: true };
      if (post.id <= lastSeenPostId) return { newPosts, done: true };

      newPosts.push(post);
    }

    return { newPosts, done: false };
  }
}

function getSource(sources, sourceId) {
  const matchedSource = sources.find(source => Math.abs(source.id) === Math.abs(sourceId));
  return {
    name: matchedSource?.name || getFullName(matchedSource) || DEFAULT_NAME,
    url: BASE_URL + (matchedSource?.screen_name ?? DEFAULT_PATHNAME),
    avatar: matchedSource?.photo_50 || DEFAULT_AVATAR
  }
}

function getFullName(profile) {
  const name = profile?.first_name ?? "";
  const surname = profile?.last_name ?? "";
  const fullName = [name, surname].filter(Boolean).join(" ");
  return fullName;
}

module.exports = VKClient;
