var self = module.exports = {
    hasWord: function (word, players) {
      return players.some(player => player.word === word)
    },

    findPlayer: function (name, players) {
      let player = players.find( player => player.name === name);
      return player;
  },
}