(function() {

        let trace1 = {x: [1, 2, 3], y: [4, 5, 6], name: 'yaxis1 data', type: 'scatter'};

        let trace2 = {x: [2, 3, 4], y: [40, 50, 60], name: 'yaxis2 data', yaxis: 'y2', type: 'scatter'};

        // let trace3 = {x: [4, 5, 6], y: [40000, 50000, 60000], name: 'yaxis3 data', yaxis: 'y3', type: 'scatter'};
        //
        // let trace4 = {x: [5, 6, 7], y: [400000, 500000, 600000], name: 'yaxis4 data', yaxis: 'y4', type: 'scatter'};

        let data = [trace1, trace2];

        let layout = {
            title: 'multiple y-axes example',
            // width: 1920,
            xaxis: {domain: [0.1, 0.9]},

        yaxis: {
                autosize: false,
            height: 900,
            title: 'yaxis title',
            titlefont: {color: '#1f77b4'},
            tickfont: {color: '#1f77b4'},
            automargin: true
            },

        yaxis2: {
            title: 'yaxis2 title',
            titlefont: {color: '#ff7f0e'},
            tickfont: {color: '#ff7f0e'},
            anchor: 'y',
            overlaying: 'y',
            side: 'left',
            automargin: true
            // position: 0.2
        },

        // yaxis3: {
        //     title: 'yaxis4 title',
        //     titlefont: {color: '#d62728'},
        //     tickfont: {color: '#d62728'},
        //     anchor: 'y',
        //     overlaying: 'y',
        //    side: 'right',
        //     position: 0.25
        //
        // },
        //
        // yaxis4: {
        //     title: 'yaxis5 title',
        //     titlefont: {color: '#9467bd'},
        //     tickfont: {color: '#9467bd'},
        //     anchor: 'y',
        //     overlaying: 'y',
        //    side: 'right',
        //     position: 0.3
        // }
    };
        Plotly.newPlot('chart', data, layout, {scrollZoom: true}, {editable: true});
}());