(function ($) {
    let rawDataRecieved = false;
    let plotDataReceived = false;
    let wait = null;
    let usePrefix = false;
    let urlPrefix = "https://gaardbodigital.dk/admin/";

    let dataResp = [];
    let dataHandler = null;

    let itemString = null;

    $(document).ready(function () {

        let totalStats = $('.sticky-top');
        $(window).scroll(function fix_element() {
            totalStats.css(
                $(window).scrollTop() > 100
                    ? { 'position': 'fixed', 'top': '10px' }
                    : { 'position': 'relative', 'top': 'auto' }
            );
            return fix_element;
        }());

        initPlots();

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            let target = $(e.target).attr("href") // activated tab
            if(target === "#raw"){
                initRawTable();
            } else if(target === "#graph"){
                initPlots();
            }
        });

        function initRawTable(){
            if(rawDataRecieved) return;
            $.ajax({
                type: "GET",
                url: (usePrefix ? urlPrefix+"get.php" : "get.php"),
                success: function (data) {
                    dataResp = data;
                    $('#result-table').append(data);
                    $('#dtBasicExample').DataTable();
                    initDelete();
                    rawDataRecieved = true;
                }
            });
        }

        function initPlots(){
            if(plotDataReceived) return;
            $.ajax({
                type: "GET",
                url: (usePrefix ? urlPrefix+"getData.php" : "getData.php"),
                success: function (data) {
                    let temp = JSON.parse(data);
                    for(let i = 0; i < temp.length; i++){
                        let id = temp[i].id;
                        let timestamp = temp[i].timestamp;
                        let data = JSON.parse(temp[i].data);
                        dataResp[i] = new DataItem(id, timestamp, data);
                        $('.start').removeClass('hidden');
                    }
                    dataHandler = new DataHandler(dataResp);

                    $(document).trigger( "datareceived", dataHandler );
                    plotDataReceived = true;
                }
            });
        }

        function initDelete(){
            $(document).on('click', 'button.delete-btn', function(){
                var id = $(this).data('id');
                if (confirm("Do you want to delete the entry with ID = "+id+"?")) {
                    let id = $(this).data('id');
                    $.ajax({
                        url: (usePrefix ? urlPrefix+"delete.php" : "delete.php"),
                        data: {
                            'id': id
                        },
                        success: function (resp) {
                            $('#dtBasicExample').DataTable().clear();
                            $('#dtBasicExample').DataTable().destroy();
                            $('#result-table').empty();
                            initRawTable();
                        }
                    });
                }
                return false;
            });
        }

    });

    $(document).on('datareceived', function (e, dataHandler) {
        let chartsWrapper = $('.charts-wrap');
        let responseIndex = 0;

        let avgHR = dataHandler.getAvgHR();

        $('.item-count').append("<p><span>Responses:</span> " + dataHandler.data.length + "</p>");
        $('.mean-hr').append("<p><span>Avg. HR:</span> " + dataHandler.getTotalAvgHR() + "</p>");
        //$('.mean-sdnn').append("<p><span>Avg. SDRR:</span> " +  dataHandler.calculateAvgSDNN() + "</p>");
        $('.mean-sdrr').append("<p><span>Avg. SDRR:</span> " + dataHandler.calculateAvgSDRR() + "</p>");
        //$('.mean-rmssd').append("<p><span>Avg. RMSSD:</span> " + dataHandler.calculateAvgRMSSD() + "</p>");
        //$('.mean-pnn50').append("<p><span>Avg. PNN50:</span> " + dataHandler.calculateAvgPNN50() + "</p>");
        $('.mean-duration').append("<p><span>Avg. duration:</span> " + dataHandler.totalAvgDuration + "</p>");

        let durations = dataHandler.getDurations();
        let hrvAnalysis = dataHandler.getHRVAnalysis();
        let itemMeans = [];
        for (let i = 0; i < items.length; i++){
            let chartElement = '<canvas id="item-'+i+'" style="height:25vh; width:60vw"></canvas>';
            chartsWrapper.append(chartElement);

            let currentItem = dataHandler.getDataItemArray(responseIndex, i);
            if(typeof currentItem == "undefined") continue;

            let mean = dataHandler.getDataMean(responseIndex, i);
            itemMeans[i] = mean;

            itemString = itemData(i).string;

            responseIndex++;
            if(responseIndex >= dataHandler.data.length) responseIndex=0;

            let labels = dataHandler.getTimestringArray();

            let ctx = document.getElementById("item-"+i).getContext('2d');
            let chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: itemString,
                        data: currentItem,
                        borderColor: [
                            'rgba(0, 0, 200, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive:true,
                    scales: {
                        x: {
                            ticks: {
                                maxRotation: 25,
                                minRotation: 25,
                                font: {
                                    size: 10
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            max: 10
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                title: function(tooltipItem){
                                    return tooltipItem[0].label;
                                },
                                label: function(tooltipItem) {
                                    return "Duration: "+durations[tooltipItem.dataIndex]+" - Avg.HR: " + avgHR[tooltipItem.dataIndex] +" - SDRR: "+ hrvAnalysis[tooltipItem.dataIndex].sdrr();//+ " - RMSSD: "+ hrvAnalysis[tooltipItem.dataIndex].rmssd()+" - PNN50: "+ hrvAnalysis[tooltipItem.dataIndex].pnn50();
                                }
                            }
                        },
                        annotation: {
                            annotations: [{
                                type: 'line',
                                mode: 'horizontal',
                                scaleID: 'y-axis-0',
                                yMin: mean,
                                yMax: mean,
                                borderColor: 'rgb(200, 0, 0,0.7)',
                                borderWidth: 1,
                                label: {
                                    backgroundColor: 'rgba(100,0,0,1)',
                                    font: {
                                        size: 10
                                    },
                                    enabled: false,
                                    content: 'Mean',
                                    position: 'right'
                                }
                            }]
                        }
                    }
                }
            });


        }

        let meanChartElement = '<canvas id="item-means" style="height:300px; width:100%"></canvas>';
        $('.item-means').append(meanChartElement);
        let ctx = document.getElementById("item-means").getContext('2d');
        let itemLabels = [];
        for(let k = 0; k < items.length; k++){
            itemLabels[k] = k;
        }
        let chartTot = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: itemLabels,
                datasets: [{
                    label: "Item avg.",
                    data: itemMeans,
                    borderColor: [
                        'rgba(0, 0, 200, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive:true,
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                },
                plugins:{
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItem){
                                return items[parseInt(tooltipItem[0].label)].string;
                            },
                            label: function(tooltipItem) {
                                return "Avg: "+tooltipItem.formattedValue;
                            }
                        }
                    },
                }
            },
        });
    });

})(jQuery);