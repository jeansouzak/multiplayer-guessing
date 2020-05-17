var self = module.exports = {
    hasWord: function (word, players) {
        var i;
        for (i = 0; i < players.length; i++) {
          if (players[i].word === word) {
            return true;
          }
        }
        return false;
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

    dynamicSort: function(property,order) {
        var sort_order = 1;
        if(order === "desc"){
            sort_order = -1;
        }
        return function (a, b){
      
            if(a[property] < b[property]){
              return -1 * sort_order;
            }else if(a[property] > b[property]){
              return 1 * sort_order;
            }else{
              return 0 * sort_order;
            }
        }
      }
}