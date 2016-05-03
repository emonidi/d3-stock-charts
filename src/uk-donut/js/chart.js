var DonutChart = function () {
    var width = 250;
    var height = 250;
    var radius = Math.min(width,height)/2;

    var color = d3.scale.category10();

    var pie = d3.layout.pie().sort(null)

    var arc = d3.svg.arc()
        .innerRadius(radius - 20)
        .outerRadius(radius - 10);

    var svg = d3.select('.chart').append('svg')
        .attr('width',width)
        .attr('height',height)
        .append('g')

        .attr('transform','translate('+width/2+','+height/2+')')



    this.render = function(data){

        var path = svg.selectAll('path').data(pie(data));
            path.enter().append("path")

             path
                 .attr("fill", function(d, i) { return color(i); })
                 .attr("d", arc);


        path.exit().remove()

    }

    this.legend = function(data,countryData){
        var yOffset = -30;

        svg.selectAll('.legend').remove();
        var legend = svg.append('g').attr('class','legend');
        var legendData = legend.selectAll('g').data(data);
        var g = legendData.enter().append('g')

        var rect = g.append('rect')
            .attr('fill',function(d,i){
              return color(i)
            })
            .attr('width',20)
            .attr('height',20)
            .attr('x',-70)
            .attr('y',function(d,i){

                if(i === 0){
                    return 0+yOffset
                }else{
                    return (i*20)+10+yOffset
                }
            });


        var text = g.append('text')
            .text(function(d){return d.label + ": " + d.value}).transition().attr('width',100)
            .attr('height',20)
            .attr('x',-40)
            .attr('y',function(d,i){
                if(i === 0){
                    return 15+yOffset
                }else{
                    return (i*20)+25+yOffset
                }
            });



        legendData.exit().remove();
    }
}
