//build a map of functions, test and fill in as you go

function init() {
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

    Plotly.newPlot("bar", barChartData, barChartLayout);

    


    // build bubble chart

    var bubbleChartData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    }];

    var bubbleChartLayout = {
        title: {
            text: `OTU Species Results (Sample ${sample})`,
            font: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#fff',
            },
          }, 
          paper_bgcolor:'rgba(0,0,0,0)',
          plot_bgcolor:'rgba(0,0,0,0)',
          xaxis: {
            title: {
              text: `OTU ID`,
              font: {
                family: 'Courier New, monospace',
                size: 16,
                color: '#fff',
              },
            },
            showgrid: true,
            zeroline: true,
            showline: true,
            mirror: 'ticks',
            tickcolor: '#fff',
            tickfont: {
              size: 14,
              color: 'rgba(255,255,255,1)'
            },
            gridcolor: '#343a40',
            gridwidth: 1,
            linecolor: '#636363',
            linewidth: 6
          },
          yaxis: {
            title: {
              text: `Amount`,
              font: {
                family: 'Courier New, monospace',
                size: 16,
                color: '#fff',
              },
            },  
            mirror: 'ticks',
            tickcolor: '#fff',
            tickfont: {
              size: 14,
              color: 'rgba(255,255,255,1)'
            },
            zerolinecolor: '#fff',
            zerolinewidth: 2,
            gridcolor: '#343a40',
            gridwidth: 1,
            linecolor: '#636363',
            linewidth: 6
          },
          showlegend: false,
          height: 600,
          width: 1100
    };

    // plotly call
    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);

    });
}

function optionChanged(newData) {
    // select and fetch new data when new option is selected

    buildCharts(newData);
    buildMetadata(newData);

}

// Initialize dashboard with info
init();