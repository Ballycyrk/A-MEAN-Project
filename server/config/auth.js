// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1006689586039699',
        'clientSecret'  : '2916bdf3deae8e7e2634403cc8c31a5d',
        'callbackURL'   : 'https://127.0.0.1:5001/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:5001/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '331742396374-jga6e9jn8ac88eosoico3u09ue26ofrd.apps.googleusercontent.com',
        'clientSecret'  : 'vTCrJ-udhyDPQUKR_vHlisYM',
        'callbackURL'   : 'https://localhost:5001/auth/google/callback'
    }

};
