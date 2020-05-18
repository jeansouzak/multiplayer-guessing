var self = module.exports = {
    hasWord: function (word, players) {
      return players.some(player => player.word === word)
    },

    findPlayer: function (name, players) {
      var i;
      for (i = 0; i < players.length; i++) {
        if (players[i].name === name) {
          return players[i];
        }
      }
      return false;
  },
}