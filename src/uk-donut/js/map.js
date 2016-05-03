/**
 * Created by emonidi on 1/3/16.
 */
var Map = function (world, el) {
    this.el = el;
    var self = this;
    var width = this.el.node().clientWidth;
    var height = 600;

    var proj = d3.geo.mercator()
    var svg = self.el.append('svg').attr('width', width).attr('height', height)
    var g = svg.append('g').attr('width', width);
    var data = topojson.feature(world, world.objects.countries);
    var g = g.selectAll('path').data(data.features)
    var path = d3.geo.path().projection(proj)


    this.render = function (id) {



        proj.scale(140)
        proj.translate([width / 2, height / 1.3])

        g.enter()
            .append('path').transition()
            .attr('d', path)


        g.on('mouseover', function () {
                d3.select(this).attr('fill', 'orange');
                console.log(arguments);
            })
            .on('mouseout', function () {
                d3.select(this).attr('fill', '#000')
            })
            .on('click', function (d,id) {
                center = d3.geo.centroid(d);

                var bounds = path.bounds(d),
                    dx = bounds[1][0] - bounds[0][0]/2,
                    dy = bounds[1][1] - bounds[0][1]/2,
                    x = (bounds[0][0] + bounds[1][0]) / 2,
                    y = (bounds[0][1] + bounds[1][1]) / 2,
                    scale = .9 / Math.max(dx / width, dy / height),
                    translate = [width / 2 - scale * x, height / 2 - scale * y];



                g.transition()
                    .tween("projection",function(d){
                      return function(_){
                         console.log(_)
                      }
                    })
                    .duration(750)
                    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
            });

        g.exit().remove();
    }


}
