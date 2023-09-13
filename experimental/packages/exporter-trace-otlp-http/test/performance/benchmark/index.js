/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Benchmark = require('benchmark');
const { BasicTracerProvider } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('../../../build/src');
const { create } = require('domain');

const suite = new Benchmark.Suite();

const exporter = new OTLPTraceExporter();

const tracerProvider = new BasicTracerProvider();
const tracer = tracerProvider.getTracer('test')

const spans = [];
for (let i = 0; i < 512; i++) {
  const span = createSpan('test span ' + i, 20);
  spans.push(span);
}
const singleSpan = spans.slice(0, 1);

suite.on('cycle', event => {
  console.log(String(event.target));
});

suite.add('OTLPTraceExporter HTTP, serialize single span', function() {
  const request = exporter.convert(singleSpan);
});

suite.add('OTLPTraceExporter HTTP, serialize 512 spans', function() {
  const request = exporter.convert(spans);
});

suite.run();

function createSpan(name, attributeCount) {
  const span = tracer.startSpan('span');
  for (let i = 0; i < attributeCount; i++) {
    const a = Array(20).fill(String.fromCharCode(97 + i)).join('');
    span.setAttribute(a, a);
  }
  span.end();
  return span;
}
