/*!
 * Copyright 2012 Daniel Imms
 * Released under the MIT license
 * http://github.com/Tyriar/pathfinding-visualiser/blob/master/LICENSE
 */
(function () {
  'use strict';

  require.config({
    paths: {
      'pathfinding-visualiser': 'src/pathfinding-visualiser',
      'core': 'src/core',
      'canvas-helper': 'src/canvas-helper',
      'map': 'src/map',
      'map-node': 'src/map-node',
      'binary-heap': 'vendor/js-data-structures/binary-heap',
      'fibonacci-heap': 'vendor/js-data-structures/fibonacci-heap',
      'a-star-common': 'src/algorithms/a-star-common',
      'a-star-heap': 'src/algorithms/a-star-heap',
      'a-star-array': 'src/algorithms/a-star-array',
      'a-star-binary-heap': 'src/algorithms/a-star-binary-heap',
      'a-star-fibonacci-heap': 'src/algorithms/a-star-fibonacci-heap',
      'dijkstra-common': 'src/algorithms/dijkstra-common',
      'dijkstra-heap': 'src/algorithms/dijkstra-heap',
      'dijkstra-binary-heap': 'src/algorithms/dijkstra-binary-heap',
      'dijkstra-fibonacci-heap': 'src/algorithms/dijkstra-fibonacci-heap'
    }
  });

  require([
    'pathfinding-visualiser',
    'a-star-array',
    'a-star-binary-heap',
    'a-star-fibonacci-heap',
    'dijkstra-binary-heap',
    'dijkstra-fibonacci-heap'
  ], function (pathfindingVisualiser, aStarArray, aStarBinaryHeap, aStarFibonacciHeap,
        dijkstraBinaryHeap, dijkstraFibonacciHeap) {
    var me;
    var algorithms = {
      'a-star-array': aStarArray,
      'a-star-binary-heap': aStarBinaryHeap,
      'a-star-fibonacci-heap': aStarFibonacciHeap,
      'dijkstra-binary-heap': dijkstraBinaryHeap,
      'dijkstra-fibonacci-heap': dijkstraFibonacciHeap
    };

    Polymer('pv-pathfinding-visualiser', {

      ready: function () {
        me = this;
        pathfindingVisualiser.init(this.$.canvas);
        this.algorithmChange('a-star-binary-heap');
        this.generateMap();
        var element = this;
        this.$.canvas.addEventListener('click', function (e) {
          pathfindingVisualiser.setGoalToMouse(e);
          element.run();
        });
        this.$.sidebar.publish.clearHandler = this.clear;
        this.$.sidebar.publish.generateHandler = this.generateMap;
        this.$.sidebar.publish.runHandler = this.run;
        this.$.sidebar.publish.toggleDialogHandler = this.toggleDialog;
        this.$.sidebar.onAlgorithmChange = this.algorithmChange;
      },

      algorithmChange: function (name) {
        pathfindingVisualiser.setAlgorithm(algorithms[name]);
      },

      clear: function () {
        me.$.summary.clear();
        pathfindingVisualiser.clear();
      },

      generateMap: function () {
        me.$.summary.clear();
        pathfindingVisualiser.generateMap(
          me.$.sidebar.publish.mapScale,
          me.$.sidebar.publish.obstacleDensity,
          me.$.sidebar.publish.obstacleSize);
      },

      run: function () {
        if (me.$.sidebar.isRunDisabled()) {
          return;
        }
        me.$.sidebar.setRunDisabled(true);
        var getSpeed = !me.$.sidebar.animationEnabled ? undefined : function () {
          return me.$.sidebar.speedMax - me.$.sidebar.speed + 1;
        };
        pathfindingVisualiser.run(function (result) {
          me.$.summary.show(result);
          me.$.sidebar.setRunDisabled(false);
        }, getSpeed);
      }

    });
  });
})();
