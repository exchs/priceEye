

var getDaysArray = function(start, end) {
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt).toISOString().split('T')[0]);
    }
    return arr;
};




class Card{

    
    
    constructor( pair , containerId){
	this.pair = pair;
        this.container = document.getElementById(containerId);
	this.container.insertAdjacentHTML('beforeend','<div class="priceCard"><div><canvas id="'+this.pair+'" width="98%" height="95%"></canvas></div> '+this.pair+' : <u id='+this.pair+'price></u></div>');

    }
         
    
     makechart(){
   	
    const canvas = document.getElementById(this.pair);

	 const labels = getDaysArray(this.startDate,this.endDate);

	 var color;
         if (this.prices[0] < this.prices[this.prices.length-1]){
             color = 'green';
	 }else{
             color = 'red';
	 }
	 
const data = {
  labels: labels,
  datasets: [{
    label: this.pair,
    data: this.prices,
    fill: false,
    borderColor: color,
    tension: 0.1
  }]
};
// </block:setup>

// <block:config:0>
const config = {
  type: 'line',
  data: data,
};
this.chart = new Chart(canvas, {
    type: 'line',
    data: data,
    options: {
        scales: {
            y: {
                stacked: true
            }
        }}
});
		      }

    updateChart(startDate=this.startDate,endDate=this.endDate){
	this.startDate = startDate;
        this.endDate = endDate;
	
	let c = this;
        this.getPrices().then( function(){
	    c.chart.data.datasets[0].data = c.prices ;
            c.updatePrice();
	    var color;
         if (c.prices[0] < c.prices[c.prices.length-1]){
             color = 'green';
	 }else{
             color = 'red';
	 }

	    c.chart.data.datasets[0].borderColor = color ;
	    var newLabels = getDaysArray(c.startDate,c.endDate);
	    c.chart.data.labels = newLabels;
	c.chart.update();
	},function(){});
	
}

 

 



    
    
    async getPrices(){
	//Theres a problem with polygons's api ,it returns 2 elements less from the top
	let url = "https://api.polygon.io/v2/aggs/ticker/C:"+this.pair+"/range/1/day/"+this.startDate+"/"+this.endDate+"?adjusted=true&sort=asc&apiKey=uNUbKI4lCdBnOYr2le5M9K8iacpoD79b";
	console.log(url);
let response = await fetch(url);

if (response.ok) { // if HTTP-status is 200-299
  // get the response body (the method explained below)
    let json = await response.json();
    let price = json["results"];
    let plainPrices = [];
    for (var x in price){
	plainPrices.push(price[x]["c"]);

    }
    this.prices =  plainPrices;
    
} else {
  alert("HTTP-Error: " + response.status);
}

}
    updatePrice(){
      var element = document.getElementById(this.pair+"price");
	element.innerHTML = this.prices[this.prices.length-1];
    }

    createChart(startDate=this.startDate,endDate=this.endDate){

	this.startDate = startDate;
	this.endDate = endDate;
	let c = this;
	this.getPrices().then(function(){

           c.makechart()
           c.updatePrice();

           
	},function(){}

			     );


    }  

    
}


var last = new Date() 
var yesterday = last - 1000 * 60 * 60 * 24 * 2 * 10;   // current date's milliseconds - 1,000 ms * 60 s * 60 mins * 24 hrs * (# of days beyond one to go back)
yesterday = new Date(yesterday);
var first = yesterday.toLocaleDateString('en-ca');
last = last.toLocaleDateString('en-ca');


const card = new Card("EURUSD",'container');
const card1 = new Card("EURAUD",'container');
const card2 = new Card("EURGBP",'container');
const card3 = new Card("EURJPY",'container');

card.createChart(first,last);
card1.createChart(first,last);
card2.createChart(first,last);
card3.createChart(first,last);





