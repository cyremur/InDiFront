/// <reference path="gantt-chart-d3.ts"/>

function postVertex() {
	var client = d3.select("#clientname").property("value");
	var session = d3.select("#sessionname").property("value");
	var type = d3.select("#verttype").property("value");
	var name = d3.select("#vertname").property("value");
	var start = d3.select("#vertstart").property("value");
	var end = d3.select("#vertend").property("value");

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

	d3.request("http://localhost:9080/log").post(json);
}

function postEdge() {
	var client = d3.select("#clientname").property("value");
	var session = d3.select("#sessionname").property("value");
	var type = d3.select("#edgetype").property("value");
	var first = d3.select("#firstvertname").property("value");
	var second = d3.select("#secondvertname").property("value");

	var json = `
{
  "client": "${client}",
  "session": "${session}",
	"edges": [
    {
      "type": "${type}",
      "first": "${first}",
      "second": "${second}"
    }
  ]
}`;

	d3.request("http://localhost:9080/log").post(json);
}

var tasks = [];

var t1 = new Task(
	new Date(3),
	new Date(17),
	"task A",
	"arbitrary",
	"running"
);

tasks.push(t1);

var t2 = new Task(
	new Date(31),
	new Date(42),
	"task B",
	"special",
	"stopped"
)

tasks.push(t2);

var taskStatus = {
  "SUCCEEDED" : "bar"
};

var taskTypes = [
  "special",
	"arbitrary"
];

d3.text("http://localhost:9080/ready", function(error, text) {
	if(error) {
		alert("Logging server appears to be offline.");
	}
});

d3.json("http://localhost:9080/query?type=Activity&neighbors=true&from=0&to=100", function(error, json) {
	if(error) throw error;
	console.log(json);
});

function refreshChart() {
	var client = d3.select("#clientname").property("value");
	var session = d3.select("#sessionname").property("value");
	var type = "Activity";
	var from = d3.select("#fromtimestamp").property("value");
	var to = d3.select("#totimestamp").property("value");
	var dim = d3.select("#activitydim").property("value");

	if(from == "" || to == "") {
		alert("Please fill out range timestamps.");
	}
	d3.json(`http://localhost:9080/query?client=${client}&session=${session}&type=${type}&from=${from}&to=${to}&neighbors=true`, function(error, json) {
		if(error) throw error;
		console.log(json);
		var tasks = [];
		var connectedActs = [];
		console.log(dim);
		for(let e of json.edges) {
			if(e.type == dim) {
				console.log(e);
				let activity, reference;
				for(let v of json.vertices) {
					if(v.id == e.first) {
						if(v.type == "Activity") {
							activity = v;
							connectedActs.push(v.id);
						} else {
							reference = v;
						}
					}
					if(v.id == e.second) {
						if(v.type == "Activity") {
							activity = v;
							connectedActs.push(v.id);
						} else {
							reference = v;
						}
					}
				}
				console.log(activity);
				console.log(reference);
				let task = new Task(
					new Date(activity.start),
					new Date(activity.end),
					activity.name,
					reference.name,
					reference.name
				)
				tasks.push(task);
			}
			console.log(tasks);
		}
		for(let v of json.vertices) {
			if(v.type == "Activity" && connectedActs.indexOf(v.id) == -1) {
				let task = new Task(
					new Date(v.start),
					new Date(v.end),
					v.name,
					"N/A",
					"N/A"
				);
				tasks.push(task);
			}
		}
		taskTypes = [];
		for(let t of tasks) {
			if(taskTypes.indexOf(t.taskType) == -1) {
				taskTypes.push(t.taskType);
			}
		}
		console.log(taskTypes);
		d3.select(".chart").remove();
		var g = new gantt();
		g.selector("#gantt-chart");
		g.height(500);
		var w = document.getElementById("gantt-chart").clientWidth;
		g.width(w);
		g.taskTypes(taskTypes);
		g.taskStatus(taskStatus);
		g.tickFormat("%S.%L");
		g.init(tasks);
	});
}

var g = new gantt();
g.selector("#gantt-chart");
g.height(500);
var w = document.getElementById("gantt-chart").clientWidth;
g.width(w);
g.taskTypes(taskTypes);
g.taskStatus(taskStatus);
g.tickFormat("%S.%L");
g.init(tasks);
