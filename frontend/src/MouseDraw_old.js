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
    return d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveLinear);
  }, []);

  return (
      <path
          d={line(points)}
          style={{
            stroke: "black",
            strokeWidth: 5,
            strokeLinejoin: "crop",
            strokeLinecap: "round",
            fill: "none",
            strokeDasharray: 1,
            strokeOpacity: 1.0
          }}
      />
  );
};


export const MouseDraw = ({x, y, width, height, thickness, lines, setLines, coordinates, setCoordinates}) => {
  const [drawing, setDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState({thickness, points: [], coords: []});
  const [currentCoordinates, setCurrentCoordinates] = useState([]);
  const drawingAreaRef = useRef();

  const mouseMove = useCallback(
      function (event) {

        const [x, y] = d3.pointer(event);
        const currentCoord = [xScale(x), yScale(y)];
        if (drawing) {
          setCurrentLine((line) => {
            console.log(line)
            return ({
            ...line,
            points: [...line.points, {x, y}],
            coords: [...line.coords, currentCoord]
          })});
        }
        setCurrentCoordinates((currentCoordinates) => [...currentCoordinates, currentCoord]);
      },
      [drawing]
  );

  function enableDrawing() {
    setCurrentLine({thickness, points: [], coords: []});
    setCurrentCoordinates([]);
    setDrawing(true);
  }

  function disableDrawing() {
    setDrawing(false);
    setLines((lines) => [...lines, currentLine]);
    setCoordinates((coordinates) => [...coordinates, currentCoordinates]);
  }

  useEffect(() => {
    const area = d3.select(drawingAreaRef.current);
    area.on("mousemove", mouseMove);
    return () => area.on("mousemove", null);
  }, [mouseMove]);

  const margin = 0;
  const xScale = d3
      .scaleLinear()
      .domain([width/2, -width/2])
      .range([width/2, -width/2]);
  const yScale = d3
      .scaleLinear()
      .domain([0, height])
      .range([height, 0]);

  return (
      <g
          transform={`translate(${x}, ${y})`}
          ref={drawingAreaRef}
          onMouseDown={enableDrawing}
          onMouseUp={disableDrawing}
      >
        <rect
            x={0}
            y={0}
            width={width}
            height={height}
            style={{fill: "white", stroke: "white"}}
        />
        {lines.map((line, i) => (
            <Line thickness={line.thickness} points={line.points} key={i}/>
        ))}
        <Line thickness={currentLine.thickness} points={currentLine.points}/>
        {lines.map((line, i) => (
            line.points.map((d, j) => {
              return (
                <circle cx={(d.x)} cy={0+(d.y)} r={3} style={{fill: "red"}} key={i + j}/>
            )})
        ))}
        <g transform={`translate(${width/2},0)`} ref={(g) => select(g).call(axisLeft(yScale))}/>
        <g transform={`translate(${width/2},${yScale(0)})`} ref={(g) => select(g).call(axisBottom(xScale))}/>
      </g>
  );
};
