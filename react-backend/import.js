var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var conString = {
  host: "localhost",
  user: "postgres",
  password: "bg30170",
  database: "mtg",
  port: 5432,
  ssl: false
}

var db = pgp(conString);

module.exports = {
  createCard: createCard
};

const mtg = require('mtgsdk');

mtg.card.all({set: 'AER'})
.on('data', card => {
  logCard(card);
})
//mtg.card.all({ name: 'Squee', pageSize: 1 })
//.on('data', card => {
  //logCard(card);
//});

function logCard(card){
  console.log(card);
  db.none(
      'insert into cards(card_name, card_multiverseid) values(${card.name},${card.multiverseid})', {
        card
      }
    )
    for (var key in card) {
      if (card.hasOwnProperty(key)) {
        if(key != 'multiverseid'){
          console.log(key + " -> " + card[key]);
          db.none(
              'insert into card_attrs(multiverseid, attr_name, attr_val) values(${multiverseid},${attr_name},${attr_val})', {
                multiverseid: card.multiverseid,
                attr_name: key,
                attr_val: card[key]
              }
            )
        }
      }
    }
}

// add query functions
function createCard(req, res, next) {
  db.none(
      'insert into cards(card_name, card_multiverseid) values(${card.name},${card.multiverseid}) ',
    req.query)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one card'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
