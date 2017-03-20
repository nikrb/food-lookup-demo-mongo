const express = require('express');
var moment  = require( 'moment');
var MongoClient = require('mongodb').MongoClient;
// var ObjectId = require('mongodb').ObjectID;
const app = express();

var db;
var url = 'mongodb://localhost:27017/foods';
MongoClient.connect(url, function(err, dbc) {
  if( err){
    console.log( "mongo connect error:", err);
  }
  db = dbc;
});


app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

const COLUMNS = [
  'carbohydrate_g',
  'protein_g',
  'fa_sat_g',
  'fa_mono_g',
  'fa_poly_g',
  'kcal',
  'description',
];
app.get('/api/food', (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: 'Missing required parameter `q`',
    });
    return;
  }

  // WARNING: Not for production use! The following statement
  // is not protected against SQL injections.
  // const r = db.exec(`
  //   select ${COLUMNS.join(', ')} from entries
  //   where description like '%${param}%'
  //   limit 100
  // `);

  db.collection( 'foods').find( { Shrt_Desc: new RegExp( ".*"+param+".*", 'i')})
  .toArray( function( err, items){
    res.json( items);
  });

  // if (r[0]) {
  //   res.json(
  //     r[0].values.map((entry) => {
  //       const e = {};
  //       COLUMNS.forEach((c, idx) => {
  //         // combine fat columns
  //         if (c.match(/^fa_/)) {
  //           e.fat_g = e.fat_g || 0.0;
  //           e.fat_g = (
  //             parseFloat(e.fat_g, 10) + parseFloat(entry[idx], 10)
  //           ).toFixed(2);
  //         } else {
  //           e[c] = entry[idx];
  //         }
  //       });
  //       return e;
  //     })
  //   );
  // } else {
  //   res.json([]);
  // }
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
