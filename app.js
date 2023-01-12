// Defination of function to create 
function buildMetaData(selection) {

    // Bringing in json data to be read
    d3.json("samples.json").then((sampleData) => {

        console.log(sampleData);

        // Parsing and then filtering of data
        var parsedData = sampleData.metadata;
        console.log("parsed data inside buildMetaData function")
        console.log(parsedData);

        var sample = parsedData.filter(item => item.id == selection);
        console.log("showing sample[0]:");
        console.log(sample[0]);

        // Specification of location for meta data
        var metadata = d3.select("#sample-metadata").html("");

        Object.entries(sample[0]).forEach(([key, value]) => {
            metadata.append("p").text(`${key}: ${value}`);
        });

        console.log("next again");
        console.log(metadata);
    });
}

// Definition of function to create chart
function buildCharts(selection) {

    // Bringing in json data to be read 
    d3.json("samples.json").then((sampleData) => {

        // Parsing and filtering of data to obtain OTU data
        var parsedData = sampleData.samples;
        console.log("parsed data inside buildCharts function")
        console.log(parsedData);

        var sampleDict = parsedData.filter(item => item.id == selection)[0];
        console.log("sampleDict")
        console.log(sampleDict);


        var sampleValues = sampleDict.sample_values; 
        var barChartValue = sampleValues.slice(0, 10).reverse();
        console.log("sample_values")
        console.log(barChartValue);

        var idValues = sampleDict.otu_ids;
        var barChartLabel = idValues.slice(0, 10).reverse();
        console.log("otu_ids");
        console.log(barChartLabel);

        var reformatLabel = [];
        barChartLabel.forEach((label) => {
            reformatLabel.push("OTU " + label);
        });

        console.log("reformatted");
        console.log(reformatLabel);

        var hovertext = sampleDict.otu_labels;
        var barChartHover = hovertext.slice(0, 10).reverse();
        console.log("otu_labels");
        console.log(barChartHover);

        // Creation of bar chart

        var barChartTrace = {
            type: "bar",
            y: reformatLabel,
            x: barChartValue ,
            text: barChartHover,
            orientation: 'h'
        };

        var barChartData = [barChartTrace];

        Plotly.newPlot("bar", barChartData);

        // Creation of bubble chart

        var bubbleChartTrace = {
            x: idValues,
            y: sampleValues,
            text: hovertext,
            mode: "markers",
            marker: {
                color: idValues,
                size: sampleValues
            }
        };

        var bubbleChartData = [bubbleChartTrace];

        var layout = {
            showlegend: false,
            height: 550,
            width: 1200,
            xaxis: {
                title: "OTU ID"
            }
        };

        Plotly.newPlot("bubble", bubbleChartData, layout);
    });
}

// Defining function to run on page load
function init() {

    // Bringing in json data to be read
    d3.json("samples.json").then((sampleData) => {

        // Parsing and filtering of  data to get the sample names
        var parsedData = sampleData.names;
        console.log("parsed data inside init function")
        console.log(parsedData);

        // Adding dropdown options
        var dropdownMenu = d3.select("#selDataset");

        parsedData.forEach((name) => {
            dropdownMenu.append("option").property("value", name).text(name);
        })

        // Using first sample to build metadata and initial plots
        buildMetaData(parsedData[0]);

        buildCharts(parsedData[0]);

    });
}

function optionChanged(newSelection) {

    // Updating of metadata with new sample
    buildMetaData(newSelection); 
    // Updating of charts with new sample
    buildCharts(newSelection);
}

// Initialize dashboard on page load
init();