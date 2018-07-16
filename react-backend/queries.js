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
  getAllCards: getAllCards,
  createCard: createCard,
  getSingleCard: getSingleCard,
  getSingleCardBySlug: getSingleCardBySlug,
  getPageinatedCards: getPageinatedCards
};
// add query functions
function getAllCards(req, res, next) {
  db.any('SELECT DISTINCT * FROM public.cards INNER JOIN public.card_attrs ON public.cards.card_multiverseid = public.card_attrs.multiverseid')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved All cards'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createCard(req, res, next) {
  db.none(
      'insert into cards(card_name, card_multiverseid) values(${card_name},${card_multiverseid}) ',
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

function getPageinatedCards(req, res, next) {
  const limit = 36;
  const page = parseInt(req.params.page);
  let offset;
  if(page == 1) {
    offset = 0;
  } else {
    offset = limit * (page - 1);
  }
  var query = 'SELECT DISTINCT public.cards.* FROM public.cards INNER JOIN public.standards ON public.cards.set = public.standards.short_name WHERE public.standards.active = true LIMIT ' + 36 + ' OFFSET ' + offset;

  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved 20 cards'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
function getSingleCard(req, res, next) {
  var cardID = parseInt(req.params.id);
  db.one('select * from public.cards where id = $1', cardID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE puppy'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleCardBySlug(req, res, next) {
  var slug = req.params.slug;
  db.one('SELECT * FROM Cards WHERE slug = $1', slug)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE puppy'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
