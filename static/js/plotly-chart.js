//
//
// (function() {
//
//         let trace1 = {x: [1, 2, 3, 4, 5, 6], y: [0, 1, 0, 1, 0, 1], name: 'yaxis1 data', yaxis: 'y1', line: {shape: 'hv'}, type: 'scatter'};
//
//         let trace2 = {x: [2, 3, 4], y: [40, 50, 60], name: 'yaxis2 data', yaxis: 'y2', line: {shape: 'hv'}, type: 'scatter'};
//
//         let trace3 = {x: [4, 5, 6], y: [40000, 50000, 60000], name: 'yaxis3 data', yaxis: 'y3', type: 'scatter'};
//
//         let trace4 = {x: [5, 6, 7], y: [400000, 500000, 600000], name: 'yaxis4 data', yaxis: 'y4', type: 'scatter'};
//
//         let data = [trace1, trace2, trace3, trace4];
//
//         const layout = {
//         title: 'multiple y-axes example',
//         width: window.innerWidth / 100 * 98,
//         height: window.innerHeight / 100 * 78,
//         xaxis: {domain: [0.15, 0.85]
//             },
//
//     yaxis1: {
//         title: 'yaxis1 title',
//         titlefont: {color: '#1f77b4'},
//         tickfont: {color: '#1f77b4'},
//         overlaying: false,
//         position: 0.895
//         },
//
//     yaxis2: {
//         title: 'yaxis2 title',
//         titlefont: {color: '#ff7f0e'},
//         tickfont: {color: '#ff7f0e'},
//         overlaying: 'y',
//         position: 0.93
//     },
//     yaxis3: {
//         title: 'yaxis3 title',
//         titlefont: {color: '#d62728'},
//         tickfont: {color: '#d62728'},
//         overlaying: 'y',
//         position: 0.965
//         },
//
//         yaxis4: {
//             title: 'yaxis4 title',
//             titlefont: {color: '#9467bd'},
//             tickfont: {color: '#9467bd'},
//             // anchor: 'y',
//             overlaying: 'y',
//            // side: 'right',
//             position: 1
//         }
// };
//
//         Plotly.react(
//             'chart', data, layout,
//             {scrollZoom: true},
//             {editable: true},
//             {autosize: true}
//             );
// }());
//
// // console.log(window.innerWidth)
// // console.log(window.innerHeight)
