var Barchart = function(config){

    var width = config.width;
    var height = config.height;
    var margin = config.margin;
    var container = config.container;

    var xScale = d3.time.scale().range([0,width+margin]);
    var yScale = d3.scale.linear().range([height,0])
    var colorScale = d3.scale.category20();
    var svg = d3.select(container).append('svg').attr('width',width+margin).attr('height',height+margin);
    var xAxisData = d3.svg.axis().orient('bottom').scale(xScale)
    var xAxis = svg.append('g').attr('class','x axis').attr('transform','translate(50,'+(height)+')')
    var rects = svg.append('g').attr('transform','translate('+margin+',0)')

    this.render = function(data){
        var xDomain = xScale.domain([d3.min(data,function(d){return new Date(d.Date)}),d3.max(data,function(d){return new Date(d.Date)})])
        var yDomain = yScale.domain([0,d3.max(data,function(d){return parseFloat(d.Volume)})]);

        xAxis.transition().call(xAxisData);
        bars = rects.selectAll('rect').data(data);

        bars
            .enter()
            .append('rect')
            .attr('stroke',"#000")
            .style('fill',function(d,i){
                var date = new Date(d.Date);
                var month = date.getMonth();
                return colorScale(month);
            })

        bars.transition()
            .attr('x',function(d,i){return xScale(new Date(d.Date))})
            .attr('y',function(d,i){return yScale(parseInt(d.Volume))})
            .attr('width',function(){return width/365})
            .attr('height',function(d,i){return height - yScale(parseInt(d.Volume))})

        bars.exit().remove();

    }
}






