const fs = require('fs');
const parse = require('csv-parse')
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/foods';
MongoClient.connect(url, function(err, dbc) {
  if( err){
    console.log( "mongo connect error:", err);
  } else {
    console.log( "connected to mongo");
    populateDB( dbc);
  }
});

function populateDB( db){
  const columns = [
    'NDB_No',
    'Shrt_Desc',
    'Carbohydrt_(g)',
    'Protein_(g)',
    'FA_Sat_(g)',
    'FA_Mono_(g)',
    'FA_Poly_(g)',
    'Energ_Kcal'
  ];
  fs.readFile( '../db/seed/raw-ndb.csv', function( err, data){
    parse( data, {columns:true, trim:true}, function( err, rows){
      const foods = db.collection('foods');
      const food_list = rows.map( function( row){
        const obj = {};
        columns.forEach( function( col){
          obj[col] = row[col];
        });
        return obj;
      });
      // console.log( "food list:", food_list);
      foods.remove({})
      .then( function( res){
        foods.insert( food_list)
        .then( function( results){
          console.log( "food list results:", results);
          db.close();
        })
        .catch( function( err){
          console.error( "food list failed:", err);
          db.close();
        });
      })
      .catch( function( err){
        console.log( "removed failed:", err);
      });
      // rows.forEach( function( ele){
        // NDB_No,Shrt_Desc,Water_(g),Energ_Kcal,Protein_(g),Lipid_Tot_(g),Ash_(g),
        // Carbohydrt_(g),Fiber_TD_(g),Sugar_Tot_(g),Calcium_(mg),Iron_(mg),
        // Magnesium_(mg),Phosphorus_(mg),Potassium_(mg),Sodium_(mg),Zinc_(mg),
        // Copper_mg),Manganese_(mg),Selenium_(�g),Vit_C_(mg),Thiamin_(mg),
        // Riboflavin_(mg),Niacin_(mg),Panto_Acid_mg),Vit_B6_(mg),Folate_Tot_(�g),
        // Folic_Acid_(�g),Food_Folate_(�g),Folate_DFE_(�g),Choline_Tot_ (mg),
        // Vit_B12_(�g),Vit_A_IU,Vit_A_RAE,Retinol_(�g),Alpha_Carot_(�g),
        // Beta_Carot_(�g),Beta_Crypt_(�g),Lycopene_(�g),Lut+Zea_ (�g),Vit_E_(mg),
        // Vit_D_�g,Vit_D_IU,Vit_K_(�g),FA_Sat_(g),FA_Mono_(g),FA_Poly_(g),
        // Cholestrl_(mg),GmWt_1,GmWt_Desc1,GmWt_2,GmWt_Desc2,Refuse_Pct
        // let s = columns.reduce( function(acc, val){
        //   return acc + "key["+val+"] val["+ele[val]+"] ";
        // }, "");
        // console.log( s);
      // });
    });
  });
}
