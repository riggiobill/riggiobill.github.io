//build a map of functions, test and fill in as you go

function init() {
    console.log("init passed")
    // D3 select the dropdown element
    var selected = d3.select("#selDataset");

    // Fill in the select options using the samples.json file
    d3.json("samples.json").then((data) => {
        var dataNames = data.names;

        dataNames.forEach((sample) => {
            selected
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // initialize the plots with the first sample section
        var initSample = dataNames[0];
        buildCharts(initSample);
        buildMetadata(initSample);

    });
}

function buildMetadata(sample) {

    console.log("buildMetata passed")
    // filter the data for results, store in array, access object items
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // filter for target search sample
        var resultsArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var results = resultsArray[0];

        // D3 select to target the panel
        var targetPanel = d3.select("#sample-metadata");

        // clear potential previous metadata
        targetPanel.html("");

        // Display key and value pairs
        Object.entries(results).forEach(([key, value]) => {
            targetPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    });
}

function buildCharts(sample) {
    
    console.log("buildCharts passed")
    // D3 json to select the sample data
    d3.json("samples.json").then((data) => {
        var dataSamples = data.samples;
        var resultsArray = dataSamples.filter(sampleObj => sampleObj.id == sample);
        var results = resultsArray[0];

        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

    

    // build bar chart
    var yTicks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    var barChartData = [{
        y: yTicks,
        x: sample_values.slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
    }];

    var barChartLayout = {
        title: "Top 10 OTUs Present",
        margin: {t: 30, l: 150}
    };




    // plotly call

    Plotly.newPlot("bar", barData, barLayout);

    


    // build bubble chart

    var bubbleChartData = [{
        x: otu_ids,
        y: sample_values,
        text: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    }];

    var bubbleChartLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t:0},
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
        margin: {t:30}
    };

    // plotly call
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    });
}

function optionChanged(newData) {
    console.log("optionChanged passed")
    // select and fetch new data when new option is selected

    buildCharts(newData);
    buildMetadata(newData);

}

// Initialize dashboard with info
init();