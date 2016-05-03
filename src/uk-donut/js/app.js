var map;
var donut = new DonutChart();
var ageSelect =  d3.select("#age-select");

getWorld(function(world){
    map = new Map(world,d3.select('.world'));
    map.render(150);
});

getCountries(function (res) {
    var countryList = d3.select('#country-input');
    var countryUl = d3.select('.country-ul').classed('hidden',true);

    countryList.on('keyup',function(){
        countryUl.classed('hidden',false);
        countryUl.selectAll('li').remove();
        var li = countryUl.selectAll('li').data(getCountriesStartingWith(this.value,res.countries));
        li.enter()
            .append('li')
            .append('a')
            .on('click',function(){
                countryList.node().value = this.text;
                countryUl.classed('hidden',true);
                onCountrySelected(this.text);
            })
            .text(function(d){return d});

        li.exit().remove();
    });
});


function getCountriesStartingWith(string,countries){
   var arr = [];
    for(var i = 0; i < countries.length; i++){
        if(countries[i].match(new RegExp(string))){
            arr.push(countries[i]);
        }
    }
    console.log(arr)
    return arr;
}


function onCountrySelected(country){
    d3.event.preventDefault();
    ageSelect.node().selectedIndex = 0;

    getCountriesData(country, function (countryData) {
        countryData.country = country;
        setAgeSelector(countryData);
        makeDonut(countryData, 0)
    });
}

function setAgeSelector(countryData) {
    var ageList = countryData.map(function (item, index) {
        return item.age;
    });


    ageSelect.on('change', function () {
            var value = this.options[this.selectedIndex].value;
            console.log(value)
            makeDonut(countryData,value);
        })

    var select = ageSelect.selectAll('option').data(ageList);


    select
        .enter()
        .append('option')
        .attr('value', function (d) {
            return d
        })
        .text(function (d) {
            return d
        });

    select.exit().remove();

}

function makeDonut(data, age) {

    var d;
    if (!age) {
        var age = 0;
    } else {
        age = age;
    }

    for (var ageInData in data) {
        if (parseInt(ageInData) === parseInt(age)) {
            d = data[ageInData];
            d.country = data.country;
        }
    }

    donut.render([d.males, d.females])

    var labelData = [{
        label:"Males",
        value: d.males
    },{
        label:"Females",
        value: d.females
    }];


    donut.legend(labelData,data);
}
