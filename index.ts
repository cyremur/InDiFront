/// <reference path="gantt-chart-d3.ts"/>

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
	console.log("Ready?");
	if(error) throw error;
	console.log(text);
});

d3.json("http://localhost:9080/agents", function(error, json) {
	if(error) throw error;
	console.log(json);
})

var format = "%S.%L";

var g = new gantt();
g.height(450);
g.width(800);
g.taskTypes(taskTypes);
g.taskStatus(taskStatus);
g.tickFormat(format);
g.init(tasks);
