const { trunk } = require("../utils");
const logger = require("../utils/logger");
const { interval, groupIds, outputChannelIds } = require("../../config").tasks.crawlVKPosts;
const Task = require("./Task");
const DataRepository = require("../database/dataRepository");
const VKClient = require("../vk/client");
const vkClient = new VKClient();
const { MessageEmbed } = require("discord.js");

class CrawlVKPostsTask extends Task {
  #timer = null;
  #client = null;
  #dataRepository = null;

  constructor() {
    super(true);
  }

  async register(client, timerInterval = interval) {
    this.#client = client;
    this.#dataRepository = new DataRepository();
    await this.#dataRepository.init();
    this.#timer = setInterval(() => this.execute(), timerInterval);
  }

  unRegister() {
    clearInterval(this.#timer);
    this.#client = null;
    this.#dataRepository.destroy();
    this.#dataRepository = null;
    this.#timer = null;
  }

  async execute() {
    if (this.#client === null) {
      logger.error(`Failed to execute CrawlVKPostsTask with id ${this.#timer}: Client was not defined.`);
      return this.unRegister();
    }

    for (const groupId of groupIds) {
      let lastSeenPostId = await this.#dataRepository.get(`${groupId}.lastSeenPostId`);
      try {
        const newPosts = await vkClient.getAllNewPosts(groupId, lastSeenPostId);
        const postsToProcess = newPosts.filter(e => !e.is_pinned);
        if (!postsToProcess.length) continue;
        postsToProcess.reverse();

        for (const post of postsToProcess) {
          const embed = createEmbed(post);

          const pendingPosts = outputChannelIds.map(channelId =>
            this.#client.channels.cache.get(channelId).send({ embed })
          );
          await Promise.all(pendingPosts);

          lastSeenPostId = post.id;
        }
      } catch(error) {
        logger.error(`Failed to process posts form group with id ${groupId}`, error);
      } finally {
        await this.#dataRepository.set(`${groupId}.lastSeenPostId`, lastSeenPostId);
      }
    }
  }
}

function createEmbed(post) {
  const { photos, links } = parsePost(post);

  const embed = new MessageEmbed({
    author: {
      name: post.source.name,
      icon_url: post.source.avatar,
      url: post.source.url
    },
    title: `New post`,
    url: `${post.source.url}?w=wall${post.owner_id}_${post.id}`,
    timestamp: post.date * 1000
  });

  if (post.text) embed.setDescription(post.text);

  if (links.length) {
    embed.setImage(links[0].image);
    embed.setDescription(`${post.text ? post.text + "\n" : ""}***[${links[0].title}](${links[0].url})***`);
  }

  if (photos.length) embed.setImage(photos[0]);

  if (post.copy_history?.length) {
    embed.addField(
      ":loudspeaker: ​ " + post.copy_history[0].source.name,
      trunk(post.copy_history[0].text, 1024)
    );
  }

  return embed;
}

function parsePost(post) {
  const photos = post?.attachments
    ?.filter(e => e.type === "photo")
    ?.map(e => {
      e?.photo?.sizes?.sort((a, b) => b.height - a.height);
      return e?.photo?.sizes?.[0]?.url;
    }) || [];

  const links = post?.attachments
    ?.filter(e => e.type === "link")
    ?.map(e => {
      e.link?.photo?.sizes?.sort((a, b) => b.height - a.height);
      e.link.image = e.link?.photo?.sizes?.[0]?.url;
      return e.link;
    }) || [];

  return { photos, links };
}

module.exports = CrawlVKPostsTask;
