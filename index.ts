/// <reference path="gantt-chart-d3.ts"/>

function postVertex() {
	var client = d3.select("#clientname").property("value");
	var session = d3.select("#sessionname").property("value");
	var type = d3.select("#verttype").property("value");
	var name = d3.select("#vertname").property("value");
	var start = d3.select("#vertstart").property("value");
	var end = d3.select("#vertend").property("value");
	console.log("Posting Vertex.");
	var json = `
{
  "client": "${client}",
  "session": "${session}",
  "vertices": [
    {
      "type": "${type}",
      "name": "${name}",
      "start": ${start},
      "end": ${end}
    }
  ]
}`;
console.log(json);

	var req = d3.request("http://localhost:9080/log");
	console.log(req);
	req.post(json);
}

function postEdge() {
	console.log("Posting Edge.");
}

var tasks = [];
var start = new Date(100);
var end = new Date(200);

var t1 = new Task(
	new Date(1000),
	new Date(2000),
	"running",
	"task A"
);

tasks.push(t1);

var t2 = new Task(
	new Date(3000),
	new Date(4000),
	"stopped",
	"task B"
)

tasks.push(t2);

var taskStatus = {
  "SUCCEEDED" : "bar"
};

var taskTypes = [
  "running",
	"stopped"
];

d3.text("http://localhost:9080/ready", function(error, text) {
	if(error) {
		alert("Logging server appears to be offline.");
	}
});

d3.json("http://localhost:9080/agents", function(error, json) {
	if(error) throw error;
	console.log(json);
})

var format = "%S.%L";

var g = new gantt();
g.selector("#gantt-chart");
g.height(500);
var w = document.getElementById("gantt-chart").clientWidth;
g.width(w);
g.taskTypes(taskTypes);
g.taskStatus(taskStatus);
g.tickFormat(format);
g.init(tasks);
