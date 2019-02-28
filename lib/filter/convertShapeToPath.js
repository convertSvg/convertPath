"use strict";

const regNumber = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;

/**
 * [generatePathNode 获得替换后的path节点]
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
function generatePathNode(node, Doc){
	let newPathNode = Doc.createElement('path')
	let slice = Array.prototype.slice;
	slice.call(node.attributes).forEach( function (attribute) {
		newPathNode.setAttribute(attribute.name,attribute.value);
	})

	return newPathNode;
}

exports.fn = function(node, Doc){
	if(!node.tagName)return;
	var tagName = String(node.tagName).toLowerCase();

	switch(tagName) {
		case "rect" : 
			var x = Number(node.getAttribute("x")),
				y = Number(node.getAttribute("y")),
				width = Number(node.getAttribute("width")),
				height = Number(node.getAttribute("height"));
		     /*
		     * rx 和 ry 的规则是：
		     * 1. 如果其中一个设置为 0 则圆角不生效
		     * 2. 如果有一个没有设置则取值为另一个
		     * 3.rx 的最大值为 width 的一半, ry 的最大值为 height 的一半
		     */
			var rx = Number(node.getAttribute("rx")) || Number(node.getAttribute("ry")) || 0
			var ry = Number(node.getAttribute("ry")) || Number(node.getAttribute("rx")) || 0

			//非数值单位计算，如当宽度像100%则移除
			//if (isNaN(x - y + width - height + rx - ry)) return;

			rx = rx > width / 2 ? width / 2 : rx;
 			ry = ry > height / 2 ? height / 2 : ry;

 			//如果其中一个设置为 0 则圆角不生效
 			if(0 == rx || 0 == ry){
		        // var path =
		        //     'M' + x + ' ' + y +
		        //     'H' + (x + width) +
		        //     'V' + (y + height) +
		        //     'H' + x +
		        //     'z';
		        var path =
		            'M' + x + ' ' + y +
		            'h' + width +
		            'v' + height +
		            'h' + -width +
		            'z';		            
 			}else{
		        var path =
		            'M' + x + ' ' + (y+ry) +
		            'a' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + (-ry) + 
		            'h' + (width - rx - rx) +
		            'a' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + ry + 
		            'v' + (height - ry -ry) +
		            'a' + rx + ' ' + ry + ' 0 0 1 ' + (-rx) + ' ' + ry + 
		            'h' + (rx + rx -width) +
		            'a' + rx + ' ' + ry + ' 0 0 1 ' + (-rx) + ' ' + (-ry) + 
		            'z'; 				
 			}

	        var newPathNode = generatePathNode(node, Doc)
			newPathNode.setAttribute("d",path);
			["x", "y", "width", "height", "rx", "ry"].forEach(function(attribute){
				newPathNode.removeAttribute(attribute)
			})
			node.parentNode.replaceChild(newPathNode, node) 

			break;

		case "circle" :
	        var cx = node.getAttribute('cx') ,
	            cy = node.getAttribute('cy') ,
	            r = node.getAttribute('r') ; 
	        var path =
	            'M' + (cx-r) + ' ' + cy +
	            'a' + r + ' ' + r + ' 0 1 0 ' + 2*r + ' 0' +
	            'a' + r + ' ' + r + ' 0 1 0 ' + (-2*r) + ' 0' +
	            'z';

	        var newPathNode = generatePathNode(node, Doc)
			newPathNode.setAttribute("d",path);
			["cx", "cy", "r"].forEach(function(attribute){
				newPathNode.removeAttribute(attribute)
			})
			node.parentNode.replaceChild(newPathNode, node) 

			break;

		case "ellipse" :
	        var cx = node.getAttribute('cx'),
	            cy = node.getAttribute('cy'),
	            rx = node.getAttribute('rx'),
	            ry = node.getAttribute('ry'); 	
	        if (isNaN(cx - cy + rx - ry)) return;    
	        var path =
	            'M' + (cx-rx) + ' ' + cy +
	            'a' + rx + ' ' + ry + ' 0 1 0 ' + 2*rx + ' 0' +
	            'a' + rx + ' ' + ry + ' 0 1 0 ' + (-2*rx) + ' 0' +
	            'z';	

	        var newPathNode = generatePathNode(node, Doc)
			newPathNode.setAttribute("d",path);
			["cx", "cy", "rx", "ry"].forEach(function(attribute){
				newPathNode.removeAttribute(attribute)
			})
			node.parentNode.replaceChild(newPathNode, node) 
	                        	
			break;

		case "line" :
			var x1 = node.getAttribute("x1"),
				y1 = node.getAttribute("y1"),
				x2 = node.getAttribute("x2"),
				y2 = node.getAttribute("y2");
			if (isNaN((x1 - y1) + (x2 - y2)) return;

			var path = 'M' + x1 + ' '+ y1 + 'L' + x2 + ' ' + y2
			var newPathNode = generatePathNode(node, Doc)
			newPathNode.setAttribute("d",path);
			["x1", "y1", "x2", "y2"].forEach(function(attribute){
				newPathNode.removeAttribute(attribute)
			})
			node.parentNode.replaceChild(newPathNode, node)

			break;			

		case "polygon" : case "polyline" : //ploygon与polyline是一样的,polygon多边形，polyline折线
			var points = (node.getAttribute("points").match(regNumber) || []).map(Number);
			if(points.length < 4){
				return;
			}
			var path = 'M' + points.slice(0,2).join(' ') +
                       'L' + points.slice(2).join(' ') +
                       ('polygon' === tagName ? 'z' : '');

			var newPathNode = generatePathNode(node, Doc)
			newPathNode.setAttribute("d",path)
			newPathNode.removeAttribute("points")
			node.parentNode.replaceChild(newPathNode, node)
			
			break;				
	}

}