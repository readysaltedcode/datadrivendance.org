"use strict";
var datastorm = datastorm || {};

datastorm.virus.sim = (function(){
  var my = {};

  var timer;
  var users = [], /*messages = [],*/ links = [];
  var messageId = -1;

  var config = {
    addUserProbability: 0.2,
    addMessageProbability: 0.6,
    addFriendProbability: 1,
    repeatMessageProbability: 0.9,
    repeatMessageTimespan: 2000, // timespan (milliseconds) in which a message can be repeated
    maxUsers: 120
  };


  /*-----
  HELPERS
  -----*/
  function shouldDo(probability) {
    // Decide, based on the given probability, whether event should occur
    return Math.random() < probability;
  }

  function randomColor() {
    var color = d3.rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    color = color.toString();
    // console.log(color);
    return color;
  }

  /*----
  EVENTS
  ----*/
  function addUser() {
    if(!shouldDo(config.addUserProbability))
      return;

    if(users.length > config.maxUsers)
      return;

    var newUser = {
      id: users.length,
      chatty: 0.01 + 0.02 * Math.random(), // how often user messages
      friendly: 0.8 + 0.2 * Math.random(), // how likely user is to friend another user
      interesting: Math.random(), // how interesting the user's messages are
      subject: Math.floor(Math.random() * 10), // the user's interest area,
      friends: [],
      messages: [],
      // isMessaging: false,
      // isRepeatedMessage: false,
      // messageTime: null,
      // isRepeatingMessage: false,
      x: 0.5 * config.width + 10 * Math.random(), //TODO
      y: 0.5 * config.height + 10 * Math.random()//TODO
    };

    // console.log(newUser);
    users.push(newUser);
    datastorm.virus.networkUpdate();
  }

  function purgeMessages() {
    var now = Date.now();
    // messages = _.filter(messages, function(message) {
    //   return now - message.time < config.repeatMessageTimespan;
    // });

    _.each(users, function(user) {
      _.each(user.messages, function(m) {
        if(now - m.time > config.repeatMessageTimespan)
          m.active = false;
      });
      // user.messages = _.filter(user.messages, function(m) {
      //   return now - m.time < config.repeatMessageTimespan;
      // });
    });
  }

  function addMessage() {
    // Iterate through each user and make a message

    if(!shouldDo(config.addMessageProbability))
      return;

    _.each(users, function(user) {
      // console.log(user);

      // Throttle message creation (w/out changing globals)
      if(!shouldDo(0.05))
        return;

      if(!shouldDo(user.chatty))
        return;

      var now = Date.now();

      messageId++;

      var message = {
        id: messageId,
        originator: user.id,
        time: now,
        active: true,
        color: randomColor()
      };

      user.messages.push(message);
    });
  }

  function repeatMessage() {
    if(!shouldDo(config.repeatMessageProbability))
      return;

    var now = Date.now();

    _.each(users, function(user) {

      if(!shouldDo(4 * user.chatty))  // 4 times more likely to repeat a message?
        return;

      // console.log("looking at friends")

      // Go through each friend
      _.each(user.friends, function(friend) {

        // console.log('checking friend')

        if(!shouldDo(friend.interesting))
          return;

        // Go through each of friend's messages
        _.each(friend.messages, function(m) {

          if(!m.active)
            return;

          // console.log('checking messages')

          // check user hasn't already sent this one!
          var hasAlreadySent = false;
          _.each(user.messages, function(mm) {
            if(mm.id === m.id)
              hasAlreadySent = true;
          });
          if(hasAlreadySent)
            return;

          var reMessage = {
            id: m.id,
            originator: m.originator,
            time: now,
            color: m.color,
            active: true
          }
          user.messages.push(reMessage);

          // console.log('remessage!')
        });

      })
    });    
  }

  function addFriend() {
    if(!shouldDo(config.addFriendProbability))
      return;

    _.each(users, function(thisUser) {
      _.each(users, function(otherUser) {
        if(thisUser === otherUser)
          return;

        var probability = otherUser.chatty * thisUser.friendly * otherUser.interesting;

        // if(!shouldDo(otherUser.chatty))
        //   return;

        // if(!shouldDo(thisUser.friendly))
        //   return;

        // if(!shouldDo(otherUser.interesting))
        //   return;

        if(thisUser.subject !== otherUser.subject)
          probability *= 0.002;

        if(!shouldDo(probability))
          return;

        var alreadyFriends = _.find(thisUser.friends, function(friend) {
          return friend.id === otherUser.id;
        });
        if(alreadyFriends)
          return;

        // I don't think we have to do this reverse check...
        alreadyFriends = _.find(otherUser.friends, function(friend) {
          return friend.id === thisUser.id;
        });
        if(alreadyFriends)
          return;

        var strength = thisUser.subject === otherUser.subject ? 0.05 : 0.03;

        links.push({
          source: thisUser.id,
          target: otherUser.id,
          strength: strength
        });

        thisUser.friends.push(otherUser);
        otherUser.friends.push(thisUser);

        datastorm.virus.networkUpdate();


      });
    });
  }


  function update() {
    addUser();
    purgeMessages();
    addMessage();
    repeatMessage();
    addFriend();

    // console.log(users, messages, links);
  }

  my.init = function(conf) {
    _.assign(config, conf);
  };

  my.start = function() {
    timer = setInterval(update, 100);
  }

  my.stop = function() {
    clearInterval(timer);
  }

  my.getUsers = function() {
    return users;
  }

  my.getMessages = function() {
    return messages;
  }

  my.getLinks = function() {
    return links;
  }

  return my;
}());