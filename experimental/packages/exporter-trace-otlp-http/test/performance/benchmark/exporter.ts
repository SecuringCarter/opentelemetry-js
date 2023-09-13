import * as Benchmark from 'benchmark';

// Create a suite
const suite = new Benchmark.Suite();

// Add benchmark tests
suite
  .add('Test 1', function () {
    // Your benchmarking code for Test 1
  })

// Run the benchmark
suite
  .on('cycle', function (event: any) {
    console.log(String(event.target)); // Display benchmark results
  })
  .on('complete', function () {
    console.log('Benchmark finished.');
  })
  .run({ async: true });
