import {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback
} from "react";
import * as d3 from "d3";
import {scaleLinear} from 'd3-scale';
import {select} from 'd3-selection';
import {axisBottom, axisLeft} from 'd3-axis';
import * as Plot from "@observablehq/plot";
import {line} from "@observablehq/plot";

const Line = ({thickness, points}) => {
  const line = useMemo(() => {
    return d3.line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveLinear);
  }, []);

  return (
      <path
          d={line(points)}
          style={{
            stroke: "black",
            strokeWidth: 2,
            strokeLinejoin: "crop",
            strokeLinecap: "round",
            fill: "none",
          }}
      />
  );
};


export const MouseDraw = ({x, y, width, height, thickness, lines, setLines, drawingAreaRef}) => {
  const [drawing, setDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState({thickness, points: [], coords: []});
  const [currentCoordinates, setCurrentCoordinates] = useState([]);
  // const drawingAreaRef = useRef();

  const mouseMove = useCallback(
      function (event) {
        const [x, y] = d3.pointer(event);
        if (y>height || y<0 || x<0 || x>width)
          return;
        const currentCoord = [xScale(x), yScale(y)];

        if (drawing) {
          setCurrentLine((line) => {
            for (const pointsKey in line.points) {
              if (line.points[pointsKey].x === x) {
                // alert("Vertical line detected!")
                if (line.points[pointsKey].y === y) {
                  return line;
                }

                if (pointsKey !== line.points.length - 1)
                  return {...line, points: line.points.slice(0, pointsKey), coords: line.coords.slice(0, pointsKey)};
              }

            }

            return ({
              ...line,
              points: [...line.points, {x, y}],
              coords: [...line.coords, currentCoord]
            })
          });
        }
        setCurrentCoordinates((currentCoordinates) => [...currentCoordinates, currentCoord]);
      },
      [drawing]
  );

  function enableDrawing() {
    if (lines.length > 0) {
      return;
    }
    setCurrentLine({thickness, points: [], coords: []});
    setCurrentCoordinates([]);
    setDrawing(true);
  }

  function disableDrawing() {
    setDrawing(false);
    setLines((lines) => [...lines, currentLine]);
    // setCoordinates((coordinates) => [...coordinates, currentCoordinates]);
  }
  const margin = ({top: 0, right: 0, bottom: 0, left: 0});
  const xScale = d3
      .scaleLinear()
      .domain([-width / 2, width / 2])
      .range([margin.left+(-width / 2), (width / 2) - margin.right]);
  const yScale = d3
      .scaleLinear()
      .domain([0, height])
      .range([height- margin.bottom, margin.top]);

  useEffect(() => {
    // const margin = {top: 0, right: 0, bottom: 0, left: 0};

    const svg = d3
        .select(drawingAreaRef.current)
        .attr("viewBox", [0, -10, width, height+30]);
    const xAxis = (g) => g
        .attr('transform', `translate(${width / 2},${yScale(0)})`)
        .call(d3.axisBottom(xScale));

    const yAxis = (g) => g
        .attr('transform', `translate(${(width / 2)},0)`)
        .call(d3.axisLeft(yScale));

    // Create the grid line functions.
    const xGrid = (g) => g
        .attr('class', 'grid-lines')
        .selectAll('line')
        .data(xScale.ticks())
        .join('line')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom);

    const yGrid = (g) => g
        .attr('class', 'grid-lines')
        .selectAll('line')
        .data(yScale.ticks())
        .join('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', d => (d))
        .attr('y2', d => (d));


    svg.append('g').call(xAxis)
    svg.append('g').call(yAxis)

    svg.append('g').call(xGrid);
    svg.append('g').call(yGrid);
  }, []);

  useEffect(() => {
    const svg = d3
        .select(drawingAreaRef.current)
        .attr("height", height)
        .attr("width", width);

    const line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveLinear);

    if (lines.length > 0) {
      svg.append('path')
          .datum(lines[0].points)
          .attr('d', line)
          //.attr('fill', "none")
          .attr('stroke', "black")
          .attr('strokeLinecap', "round")
          .attr('strokeWidth', 5)
          .attr('fill', "none")
      lines[0].points.map((d, i) => {
        svg.append('circle')
            .attr('cx', d.x)
            .attr('cy', d.y)
            .attr('r', 0.5)
            .attr('fill', "red")
      })
    }
    svg.on("mousemove", mouseMove);
    return () => svg.on("mousemove", null);
    // return () => svg.on("mousemove", null);
  }, [mouseMove]);

  // const margin = 0;
  // const xScale = d3
  //     .scaleLinear()
  //     .domain([width/2, -width/2])
  //     .range([width/2, -width/2]);
  // const yScale = d3
  //     .scaleLinear()
  //     .domain([0, height])
  //     .range([height, 0]);

  return (
      <svg ref={drawingAreaRef} style={{margin: "10px"}} onMouseDown={enableDrawing}
           onMouseUp={disableDrawing}>
        {/*<g className="x-axis" />*/}
        {/*<g className="y-axis" />*/}
        {/*<g transform={`translate(${width / 2},0)`} ref={(g) => select(g).call(axisLeft(yScale))}/>*/}
        {/*<g transform={`translate(${width / 2},${yScale(0)})`} ref={(g) => select(g).call(axisBottom(xScale))}/>*/}
        <Line thickness={1} points={currentLine.points}/>
      </svg>
  );
};
