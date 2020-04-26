import Auth from "/modules/auth.js"

class Pie
{
    // GENERATE PIE CHART BASED ON USERS BILSS
    static generateChart(user)
    {
        // margin
        const margin = {top: 20, right: 20, bottom: 20, left: 20},
            width = 340 - margin.right - margin.left,
            height = 340 - margin.top - margin.bottom,
            radius = width/2;

        // color range
        const color = d3.scaleOrdinal()
            .range(["#465BCA", "#3EF3D3", "#FF5497", "#FE9923", "#9D3171", "#1E88E5", "#CC804A"]);

        // donut chart arc
        const arc2 = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70);

        // arc for the labels position
        const labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        // generate pie chart and donut chart
        const pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        // define the svg donut chart
        const svg2 = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            
            fetch(`http://localhost:3000/api/v1/users/${user.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
            .then(response => response.json())
            .then(dat => d3.json(dat, function(data) {


            // parse data
            
            dat.bills.forEach(function(d) {
                d.count = d.cost;
                d.fruit = d.name;
            })



            // "g element is a container used to group other SVG elements"
        const g2 = svg2.selectAll(".arc2")
            .data(pie(dat.bills))
            .enter().append("g")
            .attr("class", "arc2");

        // append path 
        g2.append("path")
            .attr("d", arc2)
            .style("fill", function(d) { return color(d.data.fruit); })
            .transition()
            .ease(d3.easeLinear)
            .duration(2000)
            .attrTween("d", tweenDonut);
                
        // append text
        g2.append("text")
            .transition()
            .ease(d3.easeLinear)
            .duration(2000)
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".55em")
            .text(function(d) { return d.data.fruit; });
            
        }));

        // Helper function for animation of pie chart and donut chart
        function tweenPie(b) {
        b.innerRadius = 0;
        const i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(i(t)); };
        }

        function tweenDonut(b) {
            b.innerRadius = 0;
            const i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
            return function(t) { return arc2(i(t)); };
        }
    }
}
export default Pie;