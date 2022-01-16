const shitpostList = {
  "you know the rules": "AND SO DO I\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "can you stop": "Can YOU stop?",
  "can you not": "Can YOU not?"
};

module.exports = Object.entries(shitpostList).map(e => [e[0].toLowerCase(), e[1]]);
