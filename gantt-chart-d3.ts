/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */

class Task {
	constructor(
		public startDate: Date,
	  public endDate: Date,
		public taskName: string,
	  public taskType: string,
	  public status: string
	){}
}

enum TimeDomainMode {
	Fit,
	Fixed
}

class gantt {
	constructor(){}
  private _margin = {
  	top : 20,
  	right : 100,
  	bottom : 20,
  	left : 100
  };
  private _selector = 'body';
  private timeDomainStart = d3.timeDay.offset(new Date(),-3);
  private timeDomainEnd = d3.timeHour.offset(new Date(),+3);
  private _timeDomainMode = TimeDomainMode.Fit;// fixed or fit
  private _taskTypes = ["running"];
  private _taskStatusMap = {};// {[status:string]: string;};
  private _height = document.body.clientHeight - this._margin.top - this._margin.bottom;
  private _width = document.body.clientWidth - this._margin.right - this._margin.left;

  private _tickFormat = "%H:%M";

  private keyFunction(d: Task) {
     return d.startDate + d.taskType + d.endDate;
  }

  private x = d3.scaleTime()
    .domain([ this.timeDomainStart, this.timeDomainEnd ])
    .range([ 0, this._width ])
    .clamp(true);

  private y = d3.scaleBand()
    .domain(this._taskTypes)
    .range([ 0, this._height - this._margin.top - this._margin.bottom ])
    .round(true);

  private xAxis = d3.axisBottom(this.x)
    .tickFormat(d3.timeFormat(this._tickFormat))
    .tickSize(8).tickPadding(8);

  private yAxis = d3.axisLeft(this.y)
    .tickSize(0);

  private initTimeDomain(tasks: Task[]) {
  	if (this._timeDomainMode == TimeDomainMode.Fit) {
	    if (tasks === undefined || tasks.length < 1) {
    		this.timeDomainStart = d3.timeDay.offset(new Date(), -3);
    		this.timeDomainEnd = d3.timeHour.offset(new Date(), +3);
    		return;
	    }
	    tasks.sort(function(a, b) {
  		  return a.endDate.valueOf() - b.endDate.valueOf();
	    });
	    this.timeDomainEnd = tasks[tasks.length - 1].endDate;
	    tasks.sort(function(a, b) {
		    return a.startDate.valueOf() - b.startDate.valueOf();
	    });
	    this.timeDomainStart = tasks[0].startDate;
  	}
  }

  private initAxis() {
  	this.x = d3.scaleTime()
      .domain([ this.timeDomainStart, this.timeDomainEnd ])
      .range([ 0, this._width ])
      .clamp(true);
  	this.y = d3.scaleBand()
      .domain(this._taskTypes)
      .range([ 0, this._height - this._margin.top - this._margin.bottom ])
      .round(true);
  	this.xAxis = d3.axisBottom(this.x)
      .tickFormat(d3.timeFormat(this._tickFormat))
  		.tickSize(8).tickPadding(8);

  	this.yAxis = d3.axisLeft(this.y)
      .tickSize(0);
  }

  private getTaskClass(task: Task): string {
    return this._taskStatusMap[task.status];
  }

  public init(tasks: Task[]) {

    this.initTimeDomain(tasks);
  	this.initAxis();
    var g = this;

  	var svg = d3.select(this._selector)
      .append("svg")
    	.attr("class", "chart")
    	.attr("width", this._width + this._margin.left + this._margin.right)
    	.attr("height", this._height + this._margin.top + this._margin.bottom)
    	.append("g")
            .attr("class", "gantt-chart")
    	.attr("width", this._width + this._margin.left + this._margin.right)
    	.attr("height", this._height + this._margin.top + this._margin.bottom)
    	.attr("transform", "translate(" + this._margin.left + ", " + this._margin.top + ")");

    var taskElements = svg.selectAll(".chart")
  	  .data(tasks, this.keyFunction).enter()
			.append("g")
  	  .attr("transform", function(d) { return "translate(" + g.x(d.startDate.valueOf()) + "," + g.y(d.taskType) + ")"; });
		taskElements
  	  .append("rect")
  	  .attr("rx", 5)
      .attr("ry", 5)
  	  .attr("class", function(d: Task){
  	     if(g.getTaskClass(d) == null){
           return "bar";
         } else {
  	       return g.getTaskClass(d);
         }
      })
  	  .attr("y", 0)
  	  .attr("height", function(d) { return g.y.bandwidth(); })
  	  .attr("width", function(d) { return Math.max(1,(g.x(d.endDate) - g.x(d.startDate))); });
		var fontsize=20;
		taskElements
			.append("text")
			.attr("dx", fontsize*2)
			.attr("dy", function(d) { return g.y.bandwidth() / 2 + fontsize/2;})
			.attr("font-size", fontsize)
			.attr("fill", "black")
			.text(function(d: Task) {
				return d.taskName;
			});


  	 svg.append("g")
  	 .attr("class", "x axis")
  	 .attr("transform", "translate(0, " + (this._height - this._margin.top - this._margin.bottom) + ")")
		 .call(this.xAxis);

  	 svg.append("g")
     .attr("class", "y axis")
     .call(this.yAxis);

  	 return this;
  }

  public redraw(tasks: Task[]) {

	  this.initTimeDomain(tasks);
	  this.initAxis();
    var g = this;

    var svg = d3.select(".chart");

    var ganttChartGroup = svg.select(".gantt-chart");
    var rect = ganttChartGroup.selectAll("rect").data(tasks, this.keyFunction);

        rect.enter()
         .insert("rect",":first-child")
         .attr("rx", 5)
         .attr("ry", 5)
	 .attr("class", function(d: Task){
	     if(g.getTaskClass(d) == null){
         return "bar";
       } else {
         return g.getTaskClass(d);
       }
	 })
	 .transition()
	 .attr("y", 0)
	 .attr("transform", function(d) { return "translate(" + g.x(d.startDate.valueOf()) + "," + g.y(d.taskType) + ")"; })
	 .attr("height", function(d) { return g.y.bandwidth(); })
	 .attr("width", function(d) {
	     return Math.max(1,(g.x(d.endDate) - g.x(d.startDate)));
	 });

   rect.transition()
   .attr("transform", function(d) { return "translate(" + g.x(d.startDate.valueOf()) + "," + g.y(d.taskType) + ")"; })
   .attr("height", function(d) { return g.y.bandwidth(); })
   .attr("width", function(d) {
     return Math.max(1,(g.x(d.endDate) - g.x(d.startDate)));
   });

  	rect.exit().remove();

  	svg.select(".x").transition();
    //.call(xAxis);
  	svg.select(".y").transition();
    //.call(yAxis);

  	return this;
  }

  public margin(value) {
  	if (!arguments.length)
      return this._margin;
  	this._margin = value;
  	return this;
  }

  public timeDomain(value) {
    if (!arguments.length)
      return [ this.timeDomainStart, this.timeDomainEnd ];
    this.timeDomainStart = value[0];
		this.timeDomainEnd = value[1];
    return this;
  }

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    public timeDomainMode(value: TimeDomainMode = null) {
	    if (value == null)
	      return this._timeDomainMode;
      this._timeDomainMode = value;
      return this;
    }

    public taskTypes(value : string[] = null) {
      if (value == null)
        return this._taskTypes;
      this._taskTypes = value;
	    return this;
		}

    public taskStatus(value: {[status:string]:string;} = null) {
			if (value == null)
		    return this._taskStatusMap;
			this._taskStatusMap = value;
			return this;
    }

    public width(value: number = null) {
			if (value == null)
			    return this._width;
			this._width = value - this._margin.right - this._margin.left;
			return this;
    }

    public height(value: number = null) {
			if (value == null)
			    return this._height;
			this._height = value;
			return this;
    }

    public tickFormat(value: string = null) {
			if (value == null)
			    return this._tickFormat;
			this._tickFormat = value;
			return this;
    }

    public selector(value: string = null) {
			if (value == null)
			    return this._selector;
			this._selector = value;
			return this;
    }
}
