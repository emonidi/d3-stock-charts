function getCountries(callback){
    var url = 'http://api.population.io:80/1.0/countries';
    d3.json(url,function(err,data){
        console.log(data);
        callback(data);
    })
}

function getWorld(callback){
    d3.json('http://enjalot.github.io/intro-d3/maptime/data/world110.json',function(err,res){
        console.log(res);
        callback(res);
    });
}

function getCountriesData(country,callback){
    var url = 'http://api.population.io:80/1.0/population/2015/'+country;
    d3.json(url,function(err,data){
        if(!err){
            callback(data);
        }
    });
}
