
var _periods=[-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
//Current cash
var _cash = 10000;
//Current share value
var _shares = 0;
//Total assets, it will change over  time
var _totalAssets = new Array(18);
//Total six stocks
var _sharePrices = new Array(4);
//The shares of each stock
var _sharesOwned = [0, 0, 0, 0];
//current period, from -3 to 14
var _currentPeriodIndex = 0;
//The upside probability of each stock
var _probabilities = [0.5,0.65,0.35,0.55];
var _pricechange = [1,3,5];
var _weightedaverageprice = [0, 0, 0, 0];
var unrealisedGain = new Array(18);
//initialization
function initialization(){
    this._currentPeriodIndex = 0;
    for(var i=0; i<_sharePrices.length; i++){
        this._sharePrices[i] = new Array(18);
        //initialization of the six stocks。an integer from 60-150 randomly
        this._sharePrices[i][0] = Math.floor(Math.random() * 90 + 60);
    }
    for (i = 0; i < unrealisedGain.length; i++) {
        unrealisedGain[i] = 0;
    }
    this._totalAssets[0] = _cash + _shares;
}
//refresh
function initializationHtml(){
    var list=document.getElementsByClassName("CurrentPrice");
    for (var i=0;i<list.length;i++) {
        list[i].innerHTML=_sharePrices[i][_currentPeriodIndex];
    }
    var numlist = document.getElementsByClassName("SharesOwned");
    for (var i=0;i<numlist.length;i++) {
        numlist[i].innerHTML = _sharesOwned[i];
    }
    _totalAssets[_currentPeriodIndex] = _cash + _shares;
    document.getElementById("period").innerHTML = _periods[_currentPeriodIndex];
    document.getElementById("Cash").innerHTML = _cash;
    document.getElementById("Shares").innerHTML = _shares;
    document.getElementById("TotalAssets").innerHTML = _totalAssets[_currentPeriodIndex];
}
function populateModal(){
    document.getElementById("prevAssets").innerHTML = _totalAssets[_currentPeriodIndex-1];
    document.getElementById("newAssets").innerHTML = _totalAssets[_currentPeriodIndex];
    document.getElementById("changeAssets").innerHTML = _totalAssets[_currentPeriodIndex]
        - _totalAssets[_currentPeriodIndex - 1];
    updateStockPrice();
}

function updateStockPrice() {
    // var prevStockList = document.getElementsByClassName("OldPrice1");
    // var currentStockList = document.getElementsByClassName("CurrentPrice1");
    // var changeStockList = document.getElementsByClassName("ChangeinPrice1");
    // var sharesOwnedList = document.getElementsByClassName("SharesOwned1");
    // var averagePriceList = document.getElementsByClassName("AveragePrice1");
    // for(i=0;i<prevStockList.length;i++){
    //     prevStockList[i].innerHTML = _sharePrices[i][_currentPeriodIndex-1];
    // }
    // for(i=0;i<currentStockList.length;i++){
    //     console.log(_sharePrices[i][_currentPeriodIndex]);
    //     currentStockList[i].innerHTML = _sharePrices[i][_currentPeriodIndex];
    // }
    // for(i=0;i<changeStockList.length;i++){
    //     changeStockList[i].innerHTML = _sharePrices[i][_currentPeriodIndex]-_sharePrices[i][_currentPeriodIndex-1];
    // }
    // for(i=0;i<sharesOwnedList.length;i++){
    //     sharesOwnedList[i].innerHTML = _sharesOwned[i];
    // }
    // for(i=0;i<averagePriceList.length;i++){
    //     averagePriceList[i].innerHTML = _weightedaverageprice[i];
    // }
    var message = document.getElementById("message");
    var prevTotal;
    var currentTotal;
    prevTotal = unrealisedGain[_currentPeriodIndex - 1];
    currentTotal = unrealisedGain[_currentPeriodIndex];
    console.log(unrealisedGain);
    document.getElementById("prevTotal").innerHTML = prevTotal;
    document.getElementById("currentTotal").innerHTML = currentTotal;
    document.getElementById("changeTotal").innerHTML = currentTotal - prevTotal;

}
//count the total assets，cash+share value
function countingAssets() {
    var sharesOwned = document.getElementsByClassName("SharesOwned");
    var currentPrices = document.getElementsByClassName("CurrentPrice");
    var unrealizedGL = document.getElementsByClassName("UnrealizedGL");
    var averagePrices = document.getElementsByClassName("AveragePrice");
    var shares = 0;
    var unrealizedTotal = 0;
    for (var i = 0; i < sharesOwned.length; i++) {
        shares += (Number(sharesOwned[i].innerHTML)*Number(currentPrices[i].innerHTML));
        //When the current average stock price and the number of shares held are not 0, the unrealized gain and loss are recalculated.
        if(averagePrices[i].innerHTML != "0" && sharesOwned[i].innerHTML != "0"){
            var ugl = (Number(sharesOwned[i].innerHTML) * Number(currentPrices[i].innerHTML))
                - (Number(sharesOwned[i].innerHTML) * Number(averagePrices[i].innerHTML));
            unrealizedGL[i].innerHTML = ugl;
            unrealizedTotal += ugl;
        }
    }
    _shares = shares;
    //Recalcault total assets for current period
    _totalAssets[_currentPeriodIndex] = _cash + _shares;
    document.getElementById("Shares").innerHTML = _shares;
    document.getElementById("TotalAssets").innerHTML = _totalAssets[_currentPeriodIndex];
    unrealisedGain[_currentPeriodIndex] = unrealizedTotal;
    document.getElementById("UnrealizedTotle").innerHTML = unrealizedTotal;
}
//generate new stock prices
function newPrices(period){
    for(var i=0; i<_sharePrices.length; i++){
        var decision = probability(_probabilities[i]);
        var price_change = _pricechange[Math.floor(Math.random()*3)];
        if(decision)
            this._sharePrices[i][period] = this._sharePrices[i][period-1] + price_change;
        else
            this._sharePrices[i][period] = this._sharePrices[i][period-1] - price_change;
    }
    initializationHtml();
}
var probability = function(n) {
    return !!n && Math.random() <= n;
};
initialization();
initializationHtml();
//call this function when click the Next Period
function nextPeriod(){
    _currentPeriodIndex++;
    if(_currentPeriodIndex < 18){
        newPrices(_currentPeriodIndex);
        myChart.data.datasets[0].data = _sharePrices[0];
        myChart.data.datasets[1].data = _sharePrices[1];
        myChart.data.datasets[2].data = _sharePrices[2];
        myChart.data.datasets[3].data = _sharePrices[3];
        myChart.update();
    }


    freshAveragePrice();
    countingAssets();
    freshTotalAssetsChart();
    if(_currentPeriodIndex>3) {
        populateModal();
        openModalBox();
    }
}
function openModalBox(){
    modal.style.display = "block";
}
//call this function when click the buy button
function buy(index) {
    if (_currentPeriodIndex < 3) { return; }
    var price = _sharePrices[index][_currentPeriodIndex];
    if (_cash < price) { alert("The balance of account is insufficient."); return; }
    _sharesOwned[index]++;
    _cash = _cash - price;
    _shares = _shares + price;
    var averagePrices = document.getElementsByClassName("AveragePrice");
    if (averagePrices[index].innerHTML === "0") {
        averagePrices[index].innerHTML = price;
        _weightedaverageprice[index] = price;
    }
    else {
        var ap = Number(averagePrices[index].innerHTML);
        averagePrices[index].innerHTML = (ap * (_sharesOwned[index] - 1) + price) / _sharesOwned[index];
        _weightedaverageprice[index] = (ap * (_sharesOwned[index] - 1) + price) / _sharesOwned[index];

    }
    //Cash, Shares, Shares Owned, Average Price has been changed.
    initializationHtml();
}

//call this function when click the Sell button
function sell(index){
    if(_sharesOwned[index] <= 0){return;}
    var price = _sharePrices[index][_currentPeriodIndex];
    _cash = _cash + price;
    _shares = _shares - price;
    _sharesOwned[index]--;
    var averagePrices = document.getElementsByClassName("AveragePrice");
    var realizedGLs = document.getElementsByClassName("RealizedGL");
    var unrealizedGLs = document.getElementsByClassName("UnrealizedGL");
    var rgl = Number(realizedGLs[index].innerHTML) + (price - Number(averagePrices[index].innerHTML));
    var ugl = (_sharesOwned[index] * price) - (_sharesOwned[index] * Number(averagePrices[index].innerHTML));
    var modal = document.getElementById("myModal");
    realizedGLs[index].innerHTML = rgl;
    unrealizedGLs[index].innerHTML = ugl;
    freshRealizedTotle();
    freshUnrealizedTotle();
    initializationHtml();
}
//refresh realized gain and Loss
function freshRealizedTotle() {
    var realizedGLs = document.getElementsByClassName("RealizedGL");
    var realizedTotal = 0;
    for( var i=0; i<realizedGLs.length; i++)
        realizedTotal += Number(realizedGLs[i].innerHTML);
    document.getElementById("RealizedTotle").innerHTML = realizedTotal;
}
//refresh unrealized gain and Loss
function freshUnrealizedTotle() {
    var unrealizedGLs = document.getElementsByClassName("UnrealizedGL");
    var unrealizedTotal = 0;
    for (var i = 0; i < unrealizedGLs.length; i++)
        unrealizedTotal += Number(unrealizedGLs[i].innerHTML);
    unrealisedGain[_currentPeriodIndex] = unrealizedTotal;
    document.getElementById("UnrealizedTotle").innerHTML = unrealizedTotal;
}

function freshAveragePrice(){
    var averagePrices = document.getElementsByClassName("AveragePrice");
    for(var i=0; i< averagePrices.length;i++){
        if (_sharesOwned[i] == 0) { averagePrices[i].innerHTML = 0; }
    }
}
//refresh the total assets Chart
function freshTotalAssetsChart() {
    myChart2.update();
}

var ctx = document.getElementById("myChart").getContext('2d');
ctx.height = 800;
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        datasets: [{
            data: _sharePrices[0],
            label: "stockA",
            borderColor: "#2473ae",
            fill: false
        }, {
            data: _sharePrices[1],
            label: "stockB",
            borderColor: "#8d34a2",
            fill: false
        }, {
            data: _sharePrices[2],
            label: "stockC",
            borderColor: "#d5bd35",
            fill: false
        }, {
            data: _sharePrices[3],
            label: "stockD",
            borderColor: "#888888",
            fill: false
        }]
    },
    options: {
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Trading Period'
        }
    }
});

var ctx2 = document.getElementById("myChart2").getContext('2d');
var myChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        datasets: [{
            data: _totalAssets,
            label: "TotalAssets",
            borderColor: "#000000",
            fill: true
        }]
    },
    options: {
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Trading Period'
        }
    }
});
