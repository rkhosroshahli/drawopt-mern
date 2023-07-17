// import { useCanvas } from './hooks/useCanvas';
import './App.css';
import {MouseDraw} from "./MouseDraw";
import {useCallback, useEffect, useRef, useState} from "react";
import {DE, init_population} from "./DE";
import * as d3 from "d3";
import _ from 'lodash'

function App() {
  const thickness = 2;
  const [lines, setLines] = useState([]);
  const [optimalSolution, setOptimalSolution] = useState({best_x: null, best_f: null});
  const [optimalPop, setOptimalPop] = useState({pop_x: [], pop_f: []});
  const [numIteration, setNumIteration] = useState(null);
  const drawingAreaRef = useRef();
  const handleClearCanvas = (event) => {
    event.preventDefault();
    setLines([]);
    setOptimalPop({pop_x: [], pop_f: []});
    setOptimalSolution({best_x: null, best_f: null});
    setNumIteration(null)
    const svg = d3.select(drawingAreaRef.current);
    svg.selectAll('circle').remove();
  };

  function findY(userCoords) {
    let userY;
    const linePoints = lines[0].coords;
    let i_prev = -1, i_next = -1;
    for (let i = 0; i < linePoints.length; i++) {
      if (userCoords > linePoints[i][0]) {
        // x_prev = x_coords[i];
        i_prev = i;
      } else if (userCoords < linePoints[i][0] && i_prev !== -1) {
        //x_next = x_coords[i];
        i_next = i;
        break;
      } else if (userCoords === linePoints[i][0]) {
        i_prev = i_next = i;
        userY = (linePoints[i][1]);
      }
    }
    if (i_prev === -1 || i_next === -1) {
      userY = 1e+13;
    } else {
      const a = (linePoints[i_next][1] - linePoints[i_prev][1]) / (linePoints[i_next][0] - linePoints[i_prev][0]);
      const b = linePoints[i_prev][1] - (a * linePoints[i_prev][0]);
      userY = (a * userCoords + b);
    }
    return userY;
  }

  function handleParamsSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const np = parseInt(form.elements.populationSize.value);
    const maxiter = parseInt(form.elements.maxIterations.value);
    const mr = parseFloat(form.elements.mutationRate.value)
    const cr = parseFloat(form.elements.crossoverProb.value);
    if (isNaN(np) || isNaN(maxiter) || isNaN(mr) || isNaN(cr)) {
      alert("Parameters are not set correctly! Please try again.");
      return;
    }
    optimizeByDE(np, maxiter, mr, cr);
  }

  const optimizeByDE = ((popsize, maxiter, mutate, recombination) => {
    if (lines.length === 0) {
      alert("Drawing not entered! You have to draw, then run optimizer");
      return;
    }
    const linePoints = lines[0].coords;
    const lb = linePoints[0][0];
    const ub = linePoints[linePoints.length - 1][0];
    const bounds = [[lb, ub]];            // Bounds [(x1_min, x1_max), (x2_min, x2_max),...]
    // const popsize = 10;                        // Population size, must be >= 4
    // const mutate = 0.5;                        // Mutation factor [0,2]
    // const recombination = 0.7;                 // Recombination rate [0,1]
    // const maxiter = 100;                        // Max number of generations (maxiter)

    let population = init_population(bounds, popsize);
    let pop_f = population.map((value) => findY(value));
    const best_f = _.min(pop_f);
    const best_x = population[pop_f.indexOf(best_f)];
    setOptimalSolution({x: best_x, f: best_f});
    setOptimalPop({
      pop_x: population,
      pop_f: pop_f
    });
    startEngine(population, bounds, popsize, maxiter, mutate, recombination)
    //plotOptimals();
  });

  let timout = null;

  const runIter = (population, numIter, bounds, popsize, maxiter, mutate, recombination) => {
    if (lines.length === 0) {
      return;
    }
    const cost_func = findY;
    const internalMaxIter = 1;
    const [
      pop_x,
      pop_f,
      best_x,
      best_f
    ] = DE(cost_func, bounds, popsize, internalMaxIter, mutate, recombination, population);
    setOptimalSolution({x: best_x, f: best_f});
    setOptimalPop({
      pop_x: pop_x,
      pop_f: pop_f
    });

    if (timout !== null) {
      clearTimeout(timout);
    }

    numIter++;
    setNumIteration(numIter);
    if (numIter !== maxiter) {
      timout = setTimeout(() => runIter(pop_x, numIter, bounds, popsize, maxiter, mutate, recombination), 2000)
    }
    // population = pop_x;
  }

  const startEngine = (firstPop, bounds, popsize, maxiter, mutate, recombination) => {
    setNumIteration(0);
    runIter(firstPop, 0, bounds, popsize, maxiter, mutate, recombination)
    // timout = setTimeout(() => , 2000)
  }

  useEffect(() => {
    const width = svgWidth;
    const height = svgHeight;
    const xScale = d3
        .scaleLinear()
        .domain([-width / 2, width / 2])
        .range([-width / 2, width / 2]);
    const yScale = d3
        .scaleLinear()
        .domain([0, height])
        .range([height, 0]);

    const svg = d3.select(drawingAreaRef.current);
    svg.selectAll('circle').remove();
    if (optimalPop.pop_f.length > 0) {
      for (let i = 0; i < optimalPop.pop_f.length; i++) {
        svg.append('circle')
            .attr('cx', xScale(optimalPop.pop_x[i]))
            .attr('cy', yScale(optimalPop.pop_f[i]))
            .attr('r', 3)
            .attr('fill', "blue")
      }
      svg.append('circle')
          .attr('cx', optimalSolution.x)
          .attr('cy', yScale(optimalSolution.f))
          .attr('r', 3)
          .attr('fill', "red")
    }
  }, [optimalPop, optimalSolution])


  const svgWidth = 1000;
  const svgHeight = 500;
  return (
      <div
          className="App"
          //style={{width: "100vw", height: "100vh", overflow: "hidden"}}
      >
        <nav
            className="navbar bg-body-tertiary my-2"
        >
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">
              Draw and Optimize
            </span>
          </div>
        </nav>
        {/*<Container>*/}
        {/*  <Navbar bg="primary" expand="lg" className="bg-body-tertiary">*/}
        {/*    <Container>*/}
        {/*      <Navbar.Brand href="#">Navbar</Navbar.Brand>*/}
        {/*    </Container>*/}
        {/*  </Navbar>*/}
        {/*</Container>*/}
        <div className="container text-center">
          <div className="row">
            <div className="col-md-2">
              <form onSubmit={handleParamsSubmit} className="row g-3">
                <div className="col-auto">
                  <label className="col-form-label">Number of Population (NP)</label>
                  <input type="text" name="populationSize" id="populationSize" placeholder="100" defaultValue="20"/>
                </div>
                <div className="col-auto">
                  <label className="col-form-label">Max Iterations</label>
                  <input type="text" name="maxIterations" id="maxIterations" placeholder="100" defaultValue="100"/>
                </div>
                <div className="col-auto">
                  <label className="col-form-label">Mutation Rate</label>
                  <input type="text" name="mutationRate" id="mutationRate" placeholder="0.5" defaultValue="0.5"/>
                </div>
                <div className="col-auto">
                  <label className="col-form-label">Crossover Probability</label>
                  <input type="text" name="crossoverProb" id="crossoverProb" placeholder="0.9" defaultValue="0.9"/>
                </div>
                <button className="btn btn-primary" type="submit" color="primary">Run DE</button>
              </form>
            </div>
            <div className="col-md-1 text-center" style={{width: 10}}>

              <h4>Y</h4>
            </div>
            <div className="col-md-9">
              <div className="row">
                <MouseDraw x={0} y={0} width={svgWidth} height={svgHeight} thickness={thickness}
                           lines={lines} setLines={setLines}
                           drawingAreaRef={drawingAreaRef}/>
                {/*coordinates={coordinates} setCoordinates={setCoordinates}/>*/}
              </div>
              <div className="row">
                <h4>X</h4>
              </div>
            </div>
          </div>

        </div>

        {
          isNaN(optimalSolution.x) ?
              '' :
              <p>
                Iteration: {numIteration} <br/>
                Best X: {isNaN(optimalSolution.x) ? '' : optimalSolution.x - (svgWidth / 2)} <br/>
                Best Fitness: {optimalSolution.f}
              </p>
        }

        {/*<div className="button">*/}
        {/*  <button type="button" className="btn btn-dark" onClick={handleClearCanvas}>CLEAR</button>*/}
        {/*</div>*/}
      </div>
  );
}

export default App;
