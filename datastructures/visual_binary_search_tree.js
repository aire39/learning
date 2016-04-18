var canvas = document.getElementById("canvas");
var canvas_width  = canvas.getAttribute('width');
var canvas_height = canvas.getAttribute('height');

var ctx = canvas.getContext('2d');
ctx.translate(0.5, 0.5);
ctx.lineWidth = 3.0;
ctx.font = "bold 16px Arial";
ctx.textAlign = "center";

var canvas_traversal = document.getElementById("canvas_traversal");
var ctx_trav  = canvas_traversal.getContext('2d');

ctx_trav.translate(0.5, 0.5);
ctx_trav.lineWidth = 3.0;
ctx_trav.font = "bold 16px Arial";
ctx_trav.textAlign = "center";

var timing = 0.0;

var globalPosition = function()
{
	this.x = 0.5;
	this.y = 0.5;
}
GlobalPosition = new globalPosition(); // Not used yet

var functionQueue = [];

///////////////////////
//Node Data Structure//

var node_depth    = 100.0;
var node_radius   = 32;
var selected_node = null;

var Node = function () {
	this.x = 0;
	this.y = 0;

	this.balanceFactor = 0;
	this.value = null;

	this.leftChild  = null;
	this.rightChild = null;
	this.parent     = null;

	this.selected = false;
}

//END Node Data Structure//
///////////////////////////

/////////////
//Root Node//

var root = null;
var treecount = 0;

//END Root Node//
/////////////////

//////////////////////
//User HTML Elements//

var insertInput = document.getElementById('node_insert');

//END User HTML Elements//
//////////////////////////

/////////////////////////
//Binary Tree Functions//

var travered_array = [];
var traversePreOrder = function(root)
{
	
}

var traversePostOrder = function(root, track, time)
{
	if(root === null)
		return 0;
	
	var node = root;
	if(track === false)
		while(node.leftChild != null)
			node = node.leftChild;

	if(node.parent === null)
	{
		travered_array.push(node.value);
		return 0;
	}

	var child = node;
	var current = node.parent;

	travered_array.push(node.value);

	if(current && current.rightChild !== null && current.rightChild !== child)
	{
		current = current.rightChild;
		traversePostOrder(current, false);
	}
	else
		traversePostOrder(current, true);
}

var traverseInOrder = function(root)
{
	
}

var traverseLevel = function(root)
{
	
}

var singleRotationLeft = function(node)
{
	var nodeA = node;
	var nodeB = nodeA.rightChild;
	var nodeC = nodeB.leftChild;

	nodeA.rightChild = nodeC;
	nodeB.leftChild  = nodeA;
	
	if(nodeC !== null)
		nodeC.parent = nodeA;

	nodeB.parent = nodeA.parent;
	nodeA.parent = nodeB;

	var Abf = nodeA.balanceFactor;
	var Bbf = nodeB.balanceFactor;

	if(Bbf <= 0)
	{
		if(Abf < 1)
		{
			nodeB.balanceFactor = Abf + Bbf - 1;
		}
		else
		{
			nodeB.balanceFactor = Bbf - 1;
		}

		nodeA.balanceFactor = Abf - 1;
	}
	else
	{
		if(Abf <= Bbf)
		{
			nodeB.balanceFactor = Abf - 2;
		}
		else
		{
			nodeB.balanceFactor = Bbf - 1;
		}
		nodeA.balanceFactor = Abf - Bbf - 1;
	}

	return nodeB;
}

var singleRotationRight = function(node)
{
	var nodeA = node;
	var nodeB = nodeA.leftChild;
	var nodeC = nodeB.rightChild;

	nodeA.leftChild  = nodeC;
	nodeB.rightChild = nodeA;
	
	if(nodeC !== null)
		nodeC.parent = nodeA;

	nodeB.parent = nodeA.parent;
	nodeA.parent = nodeB;

	var Abf = nodeA.balanceFactor;
	var Bbf = nodeB.balanceFactor;

	if(Bbf <= 0)
	{
		if(Abf < 1)
		{
			nodeB.balanceFactor = Bbf - Abf - 1;
		}
		else
		{
			nodeB.balanceFactor = Abf + 1;
		}

		nodeA.balanceFactor = Abf - Bbf + 1;
	}
	else
	{
		if(Abf >= Bbf)
		{
			nodeB.balanceFactor = Bbf + 1;
		}
		else
		{
			nodeB.balanceFactor = Abf + 2;
		}
		nodeA.balanceFactor = Bbf + 1;
	}

	return nodeB;
}

var nodeBalance = function(node)
{
	if(node.balanceFactor >= 0)
	{
		if(node.rightChild !== null && node.rightChild.balanceFactor >= 0)
		{
			return singleRotationLeft(node);
		}
		else
		{
			node.rightChild = singleRotationRight(node.rightChild);
			return singleRotationLeft(node);
			//return singleRotationRight(node.rightChild)
		}
	}
	else
	{
		if(node.leftChild !== null && node.leftChild.balanceFactor <= 0)
		{
			return singleRotationRight(node);
		}
		else
		{
			node.leftChild = singleRotationLeft(node.leftChild);
			return singleRotationRight(node);
		}
	}
}

var findNode = function(node, value)
{
	while(node !== null)
	{
		if(node.value === value)
		{
			if(selected_node !== null)
				selected_node.selected = false;

			node.selected = true;
			selected_node = node;

			console.log('Found!');
			return true;
		}

		if(node.value > value)
			node = node.leftChild
		else if(node.value < value)
			node = node.rightChild;
	}

	return false;
}

var removeNode = function(source_node)
{
	var left_node   = source_node.leftChild;
	var right_node  = source_node.rightChild;
	var parent_node = source_node.parent;
	var leaf_node   = null;


	if(source_node.parent == null)
	{
		if(source_node.leftChild === null && source_node.rightChild === null)
			return null;

		//removing root
		if(source_node.leftChild !== null)
		{
			var lleaf_node = source_node.leftChild;
			var rleaf_node = source_node.rightChild;

			if(rleaf_node !== null)
				rleaf_node.parent  = null;
			source_node.rightChild = null;
			
			var leaf_node  = source_node.leftChild;
			while(leaf_node.rightChild !== null)
				leaf_node = leaf_node.rightChild;

			leaf_node.rightChild = rleaf_node;

			if(rleaf_node !== null)
				rleaf_node.parent = leaf_node;

			lleaf_node.parent = null;
			lleaf_node.x = source_node.x;
			lleaf_node.y = source_node.y;

			return lleaf_node;
		}
		else
		{
			var rleaf_node = source_node.rightChild;
			rleaf_node.parent = null
			source_node.rightChild = null;

			rleaf_node.x = source_node.x;
			rleaf_node.y = source_node.y;

			return rleaf_node;
		}

	}
	else if(source_node.value >= source_node.parent.value)
	{
		// On right-hand of tree
		leaf_node = left_node;
		if(leaf_node === null)
			leaf_node = right_node;

		while(left_node != null)
		{
				if(leaf_node.leftChild !== null && right_node.value < leaf_node.value)
					leaf_node = leaf_node.leftChild;
				else if(leaf_node.rightChild !== null && right_node.value >= leaf_node.value)
					leaf_node = leaf_node.rightChild;
				else
					break;
		}

		if(left_node != null)
		{
			if(right_node.value < leaf_node.value)
				leaf_node.leftChild = right_node;
			else if (right_node.value >= leaf_node.value)
				leaf_node.rightChild = right_node;
			right_node.parent = leaf_node;	
		}
		
		if(left_node != null)
		{
			if(parent_node.leftChild === source_node)
				parent_node.leftChild = left_node;
			else
				parent_node.rightChild = left_node;
			left_node.parent = parent_node;
		}
		else
		{
			if(parent_node.leftChild === source_node)
				parent_node.leftChild = leaf_node;
			else
				parent_node.rightChild = leaf_node;

			if(leaf_node !== null)
				leaf_node.parent = parent_node;
		}
	}
	else
	{
		// On left-hand of tree
		leaf_node = right_node;
		if(leaf_node == null)
			leaf_node = left_node;

		while(right_node != null)
		{
				if(leaf_node.leftChild !== null && left_node.value < leaf_node.value)
					leaf_node = leaf_node.leftChild;
				else if(leaf_node.rightChild !== null && right_node.value >= leaf_node.value)
					leaf_node = leaf_node.rightChild;
				else
					break;
		}

		if(right_node !== null)
		{
			if(left_node.value < leaf_node.value)
				leaf_node.leftChild = left_node;
			else if (left_node.value >= leaf_node.value)
				leaf_node.rightChild = left_node;
			left_node.parent = leaf_node;	
			source_node.leftChild = null;
		}

		if(right_node !== null)
		{
			if(parent_node.leftChild === source_node)
				parent_node.leftChild = right_node;
			else
				parent_node.rightChild = right_node;
			right_node.parent = parent_node;
			source_node.rightChild = null;
			source_node.parent = null;
		}
		else
		{
			if(parent_node.leftChild === source_node)
				parent_node.leftChild = leaf_node;
			else
				parent_node.rightChild = leaf_node;
			leaf_node.parent = parent_node;
		}

	}

}

var insertNode = function(source_node, value)
{
	var new_node = null;

	if(source_node === null)
	{
		new_node = new Node();
		new_node.x = canvas_width/2.0;
		new_node.y = 100.0;
		new_node.value = value;
		treecount++;
	}
	else
	{
		while(source_node !== null)
		{
			if(source_node.leftChild !== null && value < source_node.value)
				source_node = source_node.leftChild;
			else if(source_node.rightChild !== null && value >= source_node.value)
				source_node = source_node.rightChild;
			else
				break;
		}

		new_node        = new Node();
		new_node.value  = value;
		new_node.parent = source_node;

		if(value < source_node.value)
		{
			source_node.leftChild = new_node;
			source_node.balanceFactor--;
		}
		else if (value >= source_node.value)
		{
			source_node.rightChild = new_node;
			source_node.balanceFactor++;
		}

		source_node = new_node;

		var oldbf = 0;
		while(source_node.parent !== null)
		{
			var child = source_node;
			source_node = source_node.parent;
			oldbf = source_node.balanceFactor;

			if(source_node.rightChild === child && child !== null)
			{
				if(source_node.rightChild.balanceFactor !== 0)
					source_node.balanceFactor++;
			}
			else if(source_node.leftChild === child && child !== null)
			{
				if(source_node.leftChild.balanceFactor !== 0)
					source_node.balanceFactor--;
			}


			if(source_node.balanceFactor < -1 || source_node.balanceFactor > 1)
				return nodeBalance(source_node);
		}
		
	}

	return new_node;
}

//END Binary Tree Functions//
/////////////////////////////

//////////////////
//Draw Functions//

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

	if(node !== null)
	{
		var d = distance(node.x, node.y, x, y);

		if(d < node_radius)
		{
			node.selected = true;
			selected_node = node;
		}
		else
			node.selected = false;

		if(node.leftChild !== null)
			checkForSelection(node.leftChild, x, y);

		if(node.rightChild !== null)
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

	if(node != null && node_hovered === false)
	{
		var d = distance(node.x, node.y, x, y);

		if(d < node_radius)
		{
			node_hovered = true;
			return true;
		}

		if(node.leftChild !== null)
			a = checkForSelectionOnHover(node.leftChild, x, y);

		if(a == true)
			return a;

		if(node.rightChild !== null)
			a = checkForSelectionOnHover(node.rightChild, x, y);

		if(a == true)
			return a;
	}
}

var renderArray = function(array, context)
{
	node = new Node();

	for(var i=array.length-1; i>=0; i--)
	{
		node.x = 32.0 + 64.0*i;
		node.y = (canvas_height-75.0);
		node.value = array[i];

		renderSquare(node, context);
	}
}

var renderTree = function(root, depth, dir, context)
{


	// root is meant to be the initial root node that will be traversed recusively
	//
	// depth is used to know the k-depth of the binary tree which will make it easier to make sure
	// the nodes horizontally do not run into each other by using the value to determine that distance
	//
	// dir is used as a multiplier to know if a node is the left or right child of a parent node
	//

	if(root === null)
		return 0;

	var node = root;
	var node_parent = node.parent;

	if(node === null)
		return null;

	if(node.parent !== null)
	{ 	
		node_parent = node.parent;
		node.y = node_parent.y + node_depth;
		node.x = node_parent.x + (node_parent.x / (2.0*depth*dir));

		renderConnectedLine(node, node_parent, context);
		renderCircle(node, context);
	}
	else
		renderCircle(node, context);

	if(node !== null)
	{
		if(node.leftChild !== null)
			renderTree(node.leftChild, depth+1, -1, context);

		if(node.rightChild !== null)
			renderTree(node.rightChild, depth+1, 1, context);
	}
}

var m_gradient = ctx.createLinearGradient(0,0,0,0);
var renderCircle = function(node, context)
{
	m_gradient = context.createLinearGradient(node.x, node.y, node.x+32, node.y+32);
	context.strokeStyle = "rgb(0,0,0)";
	

	// Draw Node Shadow: shadow offset explcitely set to 5.0
	context.fillStyle = "rgba(0, 0, 0, 0.5)";
	context.beginPath();
	context.arc(node.x-5.0,node.y+5.0,node_radius,0,Math.PI*2,true);
	context.fill();

	// Draw Node
	if(node.selected === true)
	{
		m_gradient.addColorStop(0.0, "#99CF00");
		m_gradient.addColorStop(0.025, "#99CF11");
		m_gradient.addColorStop(1.0, "#FFF");
		context.fillStyle = m_gradient;
	}
	else
	{
		m_gradient.addColorStop(0.0, "#D00");
		m_gradient.addColorStop(0.025, "#D11");
		m_gradient.addColorStop(1.0, "#FFF");
		context.fillStyle = m_gradient;
	}
	
	
	context.beginPath();
	context.arc(node.x,node.y,node_radius,0,Math.PI*2,true); // Outer circle
	context.fill();
	context.stroke();

	// Draw Node Value
	if(node.value !== null)
	{
		context.fillStyle   = "rgb(255,255,255)";
		context.fillText(node.value.toString(), node.x+0.05,node.y+canvas.getBoundingClientRect().top+0.05);

		context.fillStyle   = "rgb(100,100,255)";
		context.fillText(node.balanceFactor.toString(), node.x+0.05,node.y+canvas.getBoundingClientRect().top+0.05-20.0);
	}
}

var renderSquare = function(node, context)
{
	m_gradient = context.createLinearGradient(node.x, node.y, node.x+64, node.y+64);
	context.strokeStyle = "rgb(0,0,0)";
	

	// Draw Node Shadow: shadow offset explcitely set to 5.0
	context.fillStyle = "rgba(0, 0, 0, 0.5)";
	context.fillRect(node.x-5.0, node.y+5.0, 64.0, 64.0);

	// Draw Node
	m_gradient.addColorStop(0.0, "#55D");
	m_gradient.addColorStop(0.35, "#66D");
	m_gradient.addColorStop(1.0, "#FFF");
	context.fillStyle = m_gradient;
	
	context.fillRect(node.x, node.y, 64.0, 64.0);
	context.rect(node.x, node.y, 64.0, 64.0);
	context.stroke();

	// Draw Node Value
	if(node.value !== null)
	{
		context.fillStyle   = "rgb(255,255,255)";
		context.fillText(node.value.toString(), node.x+0.05+32.0,node.y+canvas.getBoundingClientRect().top+0.05+32.0);

		//context.fillStyle   = "rgb(0,0,255)";
		//context.fillText(node.value.toString(), node.x+0.05+32.0,node.y+canvas.getBoundingClientRect().top+0.05+32.0-40.0);
	}
}

var renderConnectedLine = function(node0, node1, context)
{
	//console.log(context);
	// Get Normalized Vector tha determines the direction from one node to another
	// node_radius is a constant and can be changed.

	// Get normal
	var xdir = node1.x - node0.x;
	var ydir = node1.y - node0.y;

	var mag = Math.sqrt( Math.pow(xdir,2) + Math.pow(ydir,2) );

	xdir /= mag;
	ydir /= mag;

	// Get points along normal/direction to get the edge intersection points of node0 and node1
	pnt1_x = node0.x +  xdir * node_radius;
	pnt1_y = node0.y +  ydir * node_radius;
	pnt2_x = node1.x + -xdir * node_radius;
	pnt2_y = node1.y + -ydir * node_radius;

	// Draw Line Shadow: shadow offset explcitely set to 3.0
	context.strokeStyle = "rgba(0,0,0,0.25)";
	context.beginPath();
	context.moveTo(pnt1_x + (pnt1_x/pnt1_x)*-3.0, pnt1_y + (pnt1_y/pnt1_y)*3.0);
	context.lineTo(pnt2_x + (pnt2_x/pnt2_x)*-3.0, pnt2_y + (pnt2_y/pnt2_y)*3.0);
	context.stroke();

	// Draw Line
	context.strokeStyle = "rgb(0,0,0)";
	context.beginPath();
	context.moveTo(pnt1_x, pnt1_y);
	context.lineTo(pnt2_x, pnt2_y);
	context.stroke();
}


//END Draw Functions//
//////////////////////

//////////////////
//Event Handling//

var clicking = function(event)
{
	var mousePosition = getCanvasMouseCoordinates(canvas, event);
	checkForSelection(root, mousePosition.x, mousePosition.y);
}

var addnode = function(event)
{
	if(insertInput.value.length > 0)
	{
		if(root == null)
		{
			root = insertNode(root, parseInt(insertInput.value));
		}	
		else
		{
			var n = insertNode(root, parseInt(insertInput.value));
			if(n.parent === null)
			{
				n.x = root.x;
				n.y = root.y;
				root = n;
			}

			insertInput.value = '';
		}

		treecount++;
	}
	else
	{
		alert('Must enter a value for the node!');
	}
}

var deletenode = function(event)
{
	if(selected_node !== null && selected_node.selected === true)
	{
		if(selected_node.parent === null)
			root = removeNode(selected_node);
		else
			removeNode(selected_node);

		treecount--;
	}
}

var searchnode = function(event)
{
	var searchInput = parseInt( document.getElementById('node_search').value );
	findNode(root, searchInput);
}

var animateTraversal = function(event)
{
	if(event.target.getAttribute('id') === "postOrderTraversal")
	{
		functionQueue.unshift({'doThis': traversePostOrder});
	}
}

var clearTraversal = function(event)
{
	travered_array = [];
}

var clearAll = function(event)
{
	root = null;
	travered_array = [];
	treecount = 0;
}

var MouseDown = null;
var mousemove = function(event)
{
	var mousePosition = getCanvasMouseCoordinates(canvas, event);
	checkForSelectionOnHover(root, mousePosition.x, mousePosition.y);

	if(node_hovered === true)
		canvas.style.cursor = 'pointer';
	else
		canvas.style.cursor = 'default';

	if(MouseDown !== null && root !== null)
	{
		var oDragPosition = { x: parseInt(MouseDown.x)-parseInt(mousePosition.x) + canvas_width/2.0, y: parseInt(MouseDown.y)-parseInt(mousePosition.y) + 100.0};
		root.x = oDragPosition.x;
		root.y = oDragPosition.y;
	}

}

var mousedown = function(event)
{
	if(event.button === 1)
	{
		MouseDown = getCanvasMouseCoordinates(canvas, event);
		//GlobalPosition.x = mousePosition.x+0.5;
		//GlobalPosition.y = mousePosition.y+0.5;
	}
}

var mouseup = function(event)
{
	if(event.button === 1)
	{
		MouseDown = null;
		//GlobalPosition.x = mousePosition.x+0.5;
		//GlobalPosition.y = mousePosition.y+0.5;
	}
}

//End Event Handling//
//////////////////////

//////////////
//Render BST//

function update(time)
{
	if(root !== null)
	{
		// gently move tree
		root.y = 100 + 5*Math.sin(time/500.0);

		//pulsate tree
		node_radius = 36 + 5*Math.cos(time/250.0);

		if(functionQueue.length > 0)
		{
			functionQueue[functionQueue.length-1].doThis(root, false, time);
			functionQueue.pop();
		}
	}
}

var animationStartTime = window.performance.now();
function draw(duration)
{
	window.requestAnimationFrame(draw);
	ctx.clearRect(-0.5,-0.5,canvas_width,canvas_height);
	ctx_trav.clearRect(-0.5,-0.5,canvas_width,canvas_height);
	timing = duration - animationStartTime;

	update(timing);
	renderArray(travered_array, ctx_trav);
	renderTree(root, 0, 0, ctx);
}

window.requestAnimationFrame(draw); // initial draw call


