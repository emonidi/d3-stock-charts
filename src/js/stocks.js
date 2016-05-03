/**
 * Created by emonidi on 12/22/15.
 */

var width = 860;
var height = 250;
var margin = 50
var barchart = new Barchart({
    width:width,
    height:(height/2)+margin,
    margin:margin,
    container:"#volumes"
});
var xScale = d3.time.scale().range([0,width]);
var yScale = d3.scale.linear().range([height,0]);

var input = d3.select('input');
var button = d3.select('button');
var select = d3.select('#years_select');
var selectedYear;
button.on('click',function(){
    var symbol = input.node().value;
    getStock(symbol,null,function(data){
        drawChart(data)
        barchart.render(data);
    });
})


var svg = d3.select('#stocks')
    .append('svg')
    .attr('width',width+margin*2)
    .attr('height',height+margin*2)
    .append('g')

svg.transition().duration(750)

function setSelectOptions(){
    for(var i = 2000; i<= 2015;i++){
        select.append('option')
            .attr('value',i)
            .text(i);
    }


    selectedYear = select.node().options[select.node().selectedIndex].value
}

select.on('change',function(d){
    selectedYear = this.options[this.selectedIndex].value
    var inputValue = input.node().value;
    if(inputValue !== ''){
        getStock(inputValue,selectedYear,function(data){
            drawChart(data);
            barchart.render(data);
        })
    }
});

setSelectOptions();

function drawLine(data){
    var line = d3.svg.line(data)
        .x(function(d) { return xScale(new Date(d.Date)); })
        .y(function(d) { return yScale(parseFloat(d.Close)); });
    return line(data);
}

var xAxisData = d3.svg.axis().orient('bottom').scale(xScale).tickFormat(d3.time.format('%m'));
var yAxisData = d3.svg.axis().orient('left').scale(yScale).tickValues(yAxisData).tickFormat(d3.format('dd'))
var xAxis =  svg.append('g').attr('class','x axis').attr('transform','translate('+margin+','+(height+margin+10)+')')
var yAxis = svg.append('g').attr('class','y axis').attr('transform','translate('+margin+','+(margin)+')')

function getStock(index,year,callback){
    if(year === null){
        year = 2000;
    }
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22'+index+'%22%20and%20startDate%20%3D%20%22'+parseInt(year)+'-01-01%22%20and%20endDate%20%3D%20%22'+(parseInt(year)+1)+'-01-01%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='
    d3.json(url,function(err,res){
        if(!err){
            console.log(res)
            callback(res.query.results.quote)
        }
    })
}



svg.append('g').append('path').attr('class','line').attr('width',width).attr('height',height).attr('transform','translate(50,50)')
    .style({'fill':'none','stroke':'#000'})
svg.append('g').attr('class','x axis').attr('transform','translate('+margin+','+(height-30+margin*2)+')').attr('class','x axis');
svg.append('g').attr('class' ,'y axis')



function drawChart(data){
    var xDomain = xScale.domain(d3.extent(data,function(d){return new Date(d.Date)}));
    var yDomain = yScale.domain(d3.extent(data,function(d){return parseFloat(d.Close)}))

    svg.select('.line').style('stroke','#4CAF50').transition().attr('d',drawLine(data));
    xAxis.transition().call(xAxisData);
    yAxis.transition().call(yAxisData);

    var circles = svg
        .selectAll('circle').data(data);

    circles.transition()
        .attr('cx',function(d,i){console.log(xScale(new Date(d.Date)));return xScale(new Date(d.Date))})
        .attr('cy',function(d,i){return yScale(d.Close)})

    circles.enter()
        .append('circle')
        .attr('r',2)
        .attr('transform','translate(50,50)')
        .attr('cx',function(d,i){console.log(xScale(new Date(d.Date)));return xScale(new Date(d.Date))})
        .attr('cy',function(d,i){return yScale(d.Close)})

    circles.exit().remove()

}
