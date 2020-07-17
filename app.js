//Let's start
const urlone = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
const urltwo = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
const path = d3.geoPath()

const width = "60vw"
const height = "60vh"
const pxwidth = (window.innerWidth)
const pxheight = (window.innerHeight)

function conv(x) {
    x = x.split("v")
    if (x[1] == "w") {
        return (parseInt(x[0]) * pxwidth) / 100
    }
    else if (x[1] == "h") {
        return (parseInt(x[0]) * pxheight) / 100
    }
}

var tooltip = d3.select("#holder")
    .append("span")
    .attr("id", "tooltip")
    .style("opacity", 0)

const svg = d3.select("body")
    .append("svg")
    .attr("viewBox", "0 0 999.08 583.0")
    .attr("width", conv(width))

const svgtwo = d3.select("#legend")
    .append("svg")
    .attr("width", 160)
    .attr("height", 20)

fetch(urlone)
    .then(response => response.json())
    .then(data => {
        const us = data
        const colorset = ["#00d9bd", "#00b8b2", "#00a6aa", "#007d8e", "#0c6378", "#164a5b", "#194453", "#22292d"]
        const percent = [3,12,21,30,39,48,57,66]
        fetch(urltwo)
            .then(response => response.json())
            .then(data => {
                const dataset = data
                svg.append("g")
                    .attr("class", "counties")
                    .selectAll("path")
                    .data(topojson.feature(us, us.objects.counties).features)
                    .enter()
                    .append("path")
                    .attr("class", "county")
                    .attr("area-name", (d, i) => {
                        for (let i = 0; i < dataset.length; i++) {
                            if (d.id == dataset[i]["fips"]) {
                                return dataset[i]["area_name"]
                            }
                        }
                    })
                    .attr("data-fips", (d, i) => d.id)
                    .attr("data-education", (d, i) => {
                        for (let i = 0; i < dataset.length; i++) {
                            if (d.id == dataset[i]["fips"]) {
                                return dataset[i]["bachelorsOrHigher"]
                            }
                        }
                    })
                    .attr("fill", function (d, i) {
                        for (let i = 0; i < dataset.length; i++) {
                            if (d.id == dataset[i]["fips"]) {
                                var e = dataset[i]["bachelorsOrHigher"]
                                break;
                            }
                        }
                        if (e < 3) {
                            return "#00d9bd"
                        }
                        else if (e < 12) {
                            return "#00b8b2"
                        }
                        else if (e < 21) {
                            return "#00a6aa"
                        }
                        else if (e < 30) {
                            return "#007d8e"
                        }
                        else if (e < 39) {
                            return "#0c6378"
                        }
                        else if (e < 48) {
                            return "#164a5b"
                        }
                        else if (e < 57) {
                            return "#194453"
                        }
                        else if (e < 66) {
                            return "#22292d"
                        }
                    })
                    .attr("d", path)
                    .on("mouseover", function (d) {
                        for (var i = 0; i < dataset.length; i++) {
                            if (d.id == dataset[i]["fips"]) {
                                break;
                            }
                        }
                        tooltip.transition()
                            .duration(0)
                            .style("opacity", 0.8)
                            .attr("data-education", dataset[i]["bachelorsOrHigher"])
                            .style("top", (event.clientY - 80).toString() + "px")
                            .style("left", (event.clientX - 80).toString() + "px")

                        for (var i = 0; i < dataset.length; i++) {
                            if (d.id == dataset[i]["fips"]) {
                                break;
                            }
                        }
                        d3.select("#tooltip").html(`${dataset[i]["area_name"]} ${dataset[i]["state"]} : ${dataset[i]["bachelorsOrHigher"]}`)
                    })
                    .on("mouseout", function () {
                        tooltip.transition()
                            .duration(0)
                            .style("opacity", 0)
                            .style("top", "0vw")
                            .style("left", "0vw")
                    })
            })

        svgtwo.selectAll("rect")
            .data(colorset)
            .enter()
            .append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", (d, i) => i * 20)
            .attr("y", 0)
            .attr("fill", d => d)
        
        svgtwo.selectAll("text")
            .data(percent)
            .enter()
            .append("text")
            .attr("x", (d,i)=> i*20+5)
            .attr("y",12)
            .text(d => d+"%")
            .attr("fill","white")

    })