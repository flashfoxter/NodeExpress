/**
 * Module dependencies.
 */

//region VARS EXPRESS APP

 var express = require('express');
 var routes = require('./routes');
 var user = require('./routes/user');
 var http = require('http');
 var path = require('path');

 var app = express();
//endregion

//region APP ENVIRONMENT
// all environments

 app.set('port', process.env.PORT || 3000);
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'jade');
 app.use(express.favicon());
 app.use(express.logger('dev'));
 app.use(express.json());
 app.use(express.urlencoded());
 app.use(express.methodOverride());
 app.use(app.router);
 app.use(express.static(path.join(__dirname, 'public')));

//endregion

//region COUCHBASE

var host = "http://172.16.96.191:8091";

var config = {
    host : [ host ],
    bucket : 'beer-sample'
}

var ENTRIES_PER_PAGE = 30;

var couchbase = require('couchbase');

console.log("try connect to db: " + host);

var db = new couchbase.Connection( config, function( err ) {



    if(err) {
        console.error("Failed to connect to cluster: " + err);
        process.exit(1);
    }



  connectionDone();


});

function connectionDone()
{

    console.log('Connection Done');

    var query = db.view('byname', 'by_name');




    var beerList = getBeerList();



}

function getBeerList()
{
    var viewQuery = db.view('beer', 'brewery_beers', {});

    viewQuery.firstPage({limit:30}, function(err,results){

        queryListBeerDone(err,results);
    });

}

function queryListBeerDone(err, results)
{
    var i = 0;
    for(var item in results) {
        // Do something with the results
        console.log(results[i].id);
        i++;
    }
}




//endregion




 // development only
 if ('development' == app.get('env')) {
 app.use(express.errorHandler());
 }



// app.get('/', routes.index);
// app.get('/users', user.list);
//
//
//app.get('/abcd', function(req, res) {
//    res.send('abcd');
//});
//

app.get('/', function(req, res) {

    var viewQuery = db.view('beer', 'brewery_beers', {});
    viewQuery.firstPage({limit:30}, function(err,results){

        res.render('index', {title:'Learning Jade', documents: results });
    });


   // res.render('index', {title:'Learning Jade'});
});


 http.createServer(app).listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
 });
