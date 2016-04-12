var canvas = document.getElementById("canvas");
var canvas_width  = canvas.getAttribute('width');
var canvas_height = canvas.getAttribute('height');

var ctx  = canvas.getContext('2d');
ctx.translate(0.5, 0.5);
ctx.lineWidth = 3.0;
ctx.font = "bold 16px Arial";
ctx.textAlign = "center";

var timing = 0.0;

var node_depth    = 100.0;
var node_radius   = 32;
var selected_node = null;
var Node = function () {
	this.x = 0;
	this.y = 0;
	this.value = null;

	this.leftChild  = null;
	this.rightChild = null;
	this.parent     = null;

	this.selected = false;
}

////////////////////
// Start Test Data//

var node0 = new Node();
var node1 = new Node();
var node2 = new Node();
var node3 = new Node();

node0.x = canvas_width/2.0;
node0.y = 100.0;

node0.value = 50;
node0.parent = null;
node0.leftChild  = node1;
node0.rightChild = node2;

node1.value  = 20;
node1.parent = node0;
node1.leftChild  = null;
node1.rightChild = null;

node2.value  = 80;
node2.parent = node0;
node2.leftChild  = node3;
node2.rightChild = null;

node3.value  = 60;
node3.parent = node2;
node3.leftChild  = null;
node3.rightChild = null;

// END Test Data//
//////////////////

//////////////////
//////////////////

var insertInput = document.getElementById('node_insert');

//////////////////
//////////////////

var insertNode = function(source_node, value)
{
	new_node = new Node();
	new_node.value = value;

	var source_child_left = source_node.leftChild;
	var source_child_right = source_node.rightChild;

	new_node.parent = source_node;
	new_node.leftChild = source_child_left;
	new_node.rightChild = source_child_right;

	source_child_left.parent  = new_node;
	source_child_right.parent = new_node;

	source_node.leftChild  = new_node;
	source_node.rightChild = null;
}

var getCanvasMouseCoordinates = function(cvs, evt)
{
	// Be careful as the body margin will have an effect on the mouse position
	// making the mouse position off by whatever the margin is. This is fixed by
	// subtracting the canvas boundary with the actual cnvas position on the document

	var rect = cvs.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

var distance = function(x1, y1, x2, y2)
{
	return Math.sqrt( Math.pow(x2-x1,2.0) + Math.pow(y2-y1,2.0) );
}

var checkForSelection = function(node, x, y)
{
	// recusively looks for selected node by creating a line between the mouse position
	// when a user has clicked and each nodes position.
	//
	// If we get the magnitude of this vector we can determine that we clicked inside the node
	// by comparing the magnitude (d) with the nodes radius which the magnitude should be less
	// than the nodes radius if the user did indeed click on a node.

	if(node != null)
	{
		var d = distance(node.x, node.y, x, y);

		if(d < node_radius)
		{
			node.selected = true;
			selected_node = node;
		}
		else
			node.selected = false;

		if(node.leftChild != null)
			checkForSelection(node.leftChild, x, y);

		if(node.rightChild != null)
			checkForSelection(node.rightChild, x, y);
	}
}

var node_hovered = false;
var checkForSelectionOnHover = function(node, x, y)
{
	// recusively looks for selected node by creating a line between the mouse position
	// when a user is moving the mouse.
	//
	// If we get the magnitude of this vector we can determine that we clicked inside the node
	// by comparing the magnitude (d) with the nodes radius which the magnitude should be less
	// than the nodes radius if the user did indeed click on a node.
	node_hovered = false;
	var a = false;

	if(node != null && node_hovered == false)
	{
		var d = distance(node.x, node.y, x, y);

		if(d < node_radius)
		{
			node_hovered = true;
			return true;
		}

		if(node.leftChild != null)
			a = checkForSelectionOnHover(node.leftChild, x, y);

		if(a == true)
			return a;

		if(node.rightChild != null)
			a = checkForSelectionOnHover(node.rightChild, x, y);

		if(a == true)
			return a;
	}
}

var renderTree = function(root, depth, dir)
{
	// root is meant to be the initial root node that will be traversed recusively
	//
	// depth is used to know the k-depth of the binary tree which will make it easier to make sure
	// the nodes horizontally do not run into each other by using the value to determine that distance
	//
	// dir is used as a multiplier to know if a node is the left or right child of a parent node
	//

	var node = root;

	if(node == null)
		return null;

	if(node.parent != null)
	{ 	
		node_parent = node.parent;
		node.y = node_parent.y + node_depth;
		node.x = node_parent.x + (node_parent.x / (2.0*depth*dir));

		renderConnectedLine(node, node_parent);
		renderCircle(node);
	}
	else
		renderCircle(node);

	if(node != null)
	{
		if(node.leftChild != null)
			renderTree(node.leftChild, depth+1, -1);

		if(node.rightChild != null)
			renderTree(node.rightChild, depth+1, 1);
	}
}

var m_gradient = ctx.createLinearGradient(0,0,0,0);
var renderCircle = function(node)
{
	m_gradient = ctx.createLinearGradient(node.x, node.y, node.x+32, node.y+32);
	ctx.strokeStyle = "rgb(0,0,0)";
	

	// Draw Node Shadow: shadow offset explcitely set to 5.0
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.beginPath();
	ctx.arc(node.x-5.0,node.y+5.0,node_radius,0,Math.PI*2,true);
	ctx.fill();

	// Draw Node
	if(node.selected == true)
	{
		m_gradient.addColorStop(0.0, "#99CF00");
		m_gradient.addColorStop(0.025, "#99CF11");
		m_gradient.addColorStop(1.0, "#FFF");
		ctx.fillStyle = m_gradient;
	}
	else
	{
		m_gradient.addColorStop(0.0, "#D00");
		m_gradient.addColorStop(0.025, "#D11");
		m_gradient.addColorStop(1.0, "#FFF");
		ctx.fillStyle = m_gradient;
	}
	
	
	ctx.beginPath();
	ctx.arc(node.x,node.y,node_radius,0,Math.PI*2,true); // Outer circle
	ctx.fill();
	ctx.stroke();

	// Draw Node Value
	ctx.fillStyle   = "rgb(255,255,255)";
	ctx.fillText(node.value.toString(), node.x+0.05,node.y+canvas.getBoundingClientRect().top+0.05);
}

var renderConnectedLine = function(node0, node1)
{
	// Get Normalized Vector tha determines the direction from one node to another
	// node_radius is a constant and can be changed.

	// Get normal
	var xdir = node1.x - node0.x;
	var ydir = node1.y - node0.y;

	var mag = Math.sqrt( Math.pow(xdir,2) + Math.pow(ydir,2) );

	xdir /= mag;
	ydir /= mag;

	// Get points along normal/direction to get the edge intersection points of node0 and node1
	pnt1_x = node0.x + xdir * node_radius;
	pnt1_y = node0.y + ydir * node_radius;
	pnt2_x = node1.x + -xdir * node_radius;
	pnt2_y = node1.y + -ydir * node_radius;

	// Draw Line Shadow: shadow offset explcitely set to 3.0
	ctx.strokeStyle = "rgba(0,0,0,0.25)";
	ctx.beginPath();
	ctx.moveTo(pnt1_x + (pnt1_x/pnt1_x)*-3.0, pnt1_y + (pnt1_y/pnt1_y)*3.0);
	ctx.lineTo(pnt2_x + (pnt2_x/pnt2_x)*-3.0, pnt2_y + (pnt2_y/pnt2_y)*3.0);
	ctx.stroke();

	// Draw Line
	ctx.strokeStyle = "rgb(0,0,0)";
	ctx.beginPath();
	ctx.moveTo(pnt1_x, pnt1_y);
	ctx.lineTo(pnt2_x, pnt2_y);
	ctx.stroke();
}

//////////////////
//Event Handling//

var clicking = function(event)
{
	var mousePosition = getCanvasMouseCoordinates(canvas, event);
	checkForSelection(node0, mousePosition.x, mousePosition.y);
}

var addnode = function(event)
{
	if(selected_node != null && selected_node.selected == true)
	{
		insertNode(selected_node, insertInput.value);
		insertInput.value = '';
	}
}

var mousemove = function(event)
{
	var mousePosition = getCanvasMouseCoordinates(canvas, event);
	checkForSelectionOnHover(node0, mousePosition.x, mousePosition.y);

	if(node_hovered == true)
		canvas.style.cursor = 'pointer';
	else
		canvas.style.cursor = 'default';
}

//End Event Handling//
//////////////////////

var animationStartTime = window.performance.now();
function draw(duration)
{
	var m_time = duration - animationStartTime;
	window.requestAnimationFrame(draw); // commented out for now since no real animation is actually available.
	ctx.clearRect(0,0,canvas_width,canvas_height); // clear canvas

	node0.y = 100 + 5*Math.sin(m_time/500);
	renderTree(node0, 0, 0);                       // render tree

	 
}

window.requestAnimationFrame(draw); // initial draw call