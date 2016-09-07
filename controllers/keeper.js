'use strict';
var views = require('co-views');
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/library');
var co = require('co');

var receipts = wrap(db.get('receipts'));

// From lifeofjs
co(function * () {
  var receipts = yield receipts.find({});
});

var render = views(__dirname + '/../views', {
  map: {
    html: 'swig'
  }
});

module.exports.home = function * home(next) {
  console.log(this.req.connection.server)
  console.log(this.request)  
  if ('GET' != this.method) return yield next;
  this.body = yield render('layout');
};


module.exports.list = function * list(next) {
  console.log(this.request.header)
  if ('GET' != this.method) return yield next;
  this.body = yield render('list', {
    'receipts': yield receipts.find({})
  });
};

// This must be avoided, use ajax in the view.
module.exports.all = function * all(next) {
  console.log(this.request.header)
  if ('GET' != this.method) return yield next;
  this.body = yield receipts.find({});
};
/*
module.exports.fetch = function * fetch(id,next) {
  if ('GET' != this.method) return yield next;
  // Quick hack.
  if(id === ""+parseInt(id, 10)){
    var receipt = yield receipts.find({}, {
      'skip': id - 1,
      'limit': 1
    });
    if (receipt.length === 0) {
      this.throw(404, 'receipt with id = ' + id + ' was not found');
    }
    this.body = yield receipt;
  }

};
*/

module.exports.add = function * add(data,next) {
  if ('POST' != this.method) return yield next;
  var receipt = yield parse(this, {
    limit: '5kb'
  });
  var inserted = yield receipts.insert(receipt);
  if (!inserted) {
    this.throw(405, "The receipt couldn't be added.");
  }
  this.body = 'Done!';
};
/*
module.exports.modify = function * modify(id,next) {
  if ('PUT' != this.method) return yield next;

  var data = yield parse(this, {
    limit: '1kb'
  });

  var receipt = yield receipts.find({}, {
    'skip': id - 1,
    'limit': 1
  });

  if (receipt.length === 0) {
    this.throw(404, 'receipt with id = ' + id + ' was not found');
  }

  var updated = receipts.update(receipt[0], {
    $set: data
  });

  if (!updated) {
    this.throw(405, "Unable to update.");
  } else {
    this.body = "Done";
  }
};*/
/*
module.exports.remove = function * remove(id,next) {
  if ('DELETE' != this.method) return yield next;

  var receipt = yield receipts.find({}, {
    'skip': id - 1,
    'limit': 1
  });

  if (receipt.length === 0) {
    this.throw(404, 'receipt with id = ' + id + ' was not found');
  }

  var removed = receipts.remove(receipt[0]);

  if (!removed) {
    this.throw(405, "Unable to delete.");
  } else {
    this.body = "Done";
  }

};
*/
/*
module.exports.head = function *(){
  return;
};

module.exports.options = function *() {
  this.body = "Allow: HEAD,GET,PUT,DELETE,OPTIONS";
};

module.exports.trace = function *() {
  this.body = "Smart! But you can't trace.";
};
*/
