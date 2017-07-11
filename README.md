InDiFront is an html/typescript frontend implementation for the InDiProv system.

It's aim is to provide an easy, accessible way to post example log data to the InDiProv system as well as allowing easy data exploration.

In order to use this frontend, you need to install d3 and d3 typings (for example via npm) as well as a typescript compiler such as tsc.

Attribution: The gantt-chart typescript code is based on the code provided by dk8996 (https://github.com/dk8996/Gantt-Chart) under Apache 2.0 License, which has been modified to function in conjunction with d3 version 4 and typescript.

To run this frontend example, execute a local webserver in the root directory of this project. We recommend `http-server` in node.js or `http.server` in Python 3 as simple servers for testing this project.

In this frontend, you are able to

1) Submit a new Vertex (Agent/Activity/Entity) by filling out the client, session and vertex specific fields and clicking on submit beneath the vertex form. Note that vertex names are UNIQUE for every client, i.e. the clientname-vertexname combination can have no duplicate entries.
2) Submit a new Edge (i.e. a relation between two vertices, e.g. Activity used Entity). To do this, fill out client and session information, the type of the connection, and the names of the vertices to be connected and then click the submit button beneath the edge form. The backend will automatically search for vertices that match client, session, and the vertex names. The uniqueness of the clientname-vertexname combination guarantees that there can be no ambiguous selection here. If two vertices are found that have the correct vertex types defined for this relation, a connection between those two vertices is inserted as Edge into the database.
3) Display a gantt-chart of Activity data, filtered by a timerange and grouped by either associated Agents, used Entities or generated Entities. Fill out the client and session (or leave blank if you want to retrieve ALL Activities), enter a timerange in unix timestamps and click on "Draw Chart".
