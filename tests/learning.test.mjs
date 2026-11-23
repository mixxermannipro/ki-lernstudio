import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { labs } from '../public/labs.mjs';
import { modules } from '../public/lessons.mjs';
import { formulas, glossary } from '../public/reference.mjs';
import { distribution, gini, entropy, metrics, sigmoid } from '../public/math.mjs';
import { chart } from '../public/charts.mjs';

test('Sigmoid und Klassifikationsmetriken stimmen bei Beispielwerten und leeren Nennern', () => {
  assert.equal(sigmoid(0),0.5);
  assert.ok(Math.abs(sigmoid(0.35)-0.58661758)<1e-7);
  assert.deepEqual(metrics(8,2,4,16),[0.8,0.8,2/3,8/11]);
  assert.deepEqual(metrics(0,0,0,0),[null,null,null,null]);
});

test('Gini, gewichteter Split und Entropie berücksichtigen Klassenanteile', () => {
  assert.equal(gini(4,0),0);
  assert.ok(Math.abs(gini(6,4)-0.48)<1e-10);
  assert.equal(entropy(5,5),1);
  assert.equal(entropy(4,0),0);
  assert.equal(labs.gini.run([4,0,2,4]).result,'ΔG = 0,2133');
});

test('Tukey-Zaun ist inklusiv und Whisker enden an echten Werten', () => {
  const data=distribution([15,1,2,3,4,5,6]);
  assert.deepEqual([data.q1,data.q2,data.q3],[2,4,6]);
  assert.deepEqual(data.fences,[-4,12]);
  assert.deepEqual(data.whiskers,[1,6]);
  assert.deepEqual(data.outliers,[15]);
  assert.deepEqual(distribution([1,2,3,4,5,6,12]).whiskers,[1,12]);
  assert.equal(distribution([2,4,6]).variance,8/3);
  assert.equal(distribution([2,4,6]).sampleVariance,4);
});

test('Weitere Rechenexperimente liefern die erwarteten Beispielwerte', () => {
  assert.equal(labs.gradient.run([0,2,1,0.1]).result,'w neu = 0,1');
  assert.equal(labs.gerade.run([2,-1,4]).result,'ŷ = 7');
  assert.equal(labs.scaler.run([30,50]).result,'Min-Max: 0,5');
  assert.equal(labs.pruning.run([0.02]).result,'Kleiner Baum');
  assert.equal(labs.baum.run([1.9,2]).result,'Setosa');
  assert.equal(labs.steuer.run([200,19]).result,'238 € brutto');
  assert.equal(labs.prozess.run([40,30]).result,'25 %');
  assert.equal(labs.folds.run([80,80,70,80,90]).result,'80 % im Mittel');
});

test('Lerninhalte haben eindeutige Ziele und alle Labore zeichnen ihre Grenzwerte', () => {
  const all=modules.flatMap(m=>m.lessons);
  assert.equal(new Set(all.map(l=>l.id)).size,all.length);
  assert.equal(new Set(glossary.map(([name])=>name)).size,glossary.length);
  for(const lesson of all) {
    assert.ok(lesson.quiz.choices[lesson.quiz.correct],lesson.id);
    if(lesson.lab) assert.ok(Object.hasOwn(labs,lesson.lab),lesson.id);
  }
  for(const formula of formulas) assert.ok(Object.hasOwn(labs,formula.lab),formula.name);
  for(const [id,lab] of Object.entries(labs)) {
    for(const edge of ['min','value','max']) {
      const data=lab.run(lab.inputs.map(input=>input[edge]??input.value));
      assert.ok(data.steps.length,id);
      assert.doesNotMatch(chart(data.plot),/NaN|Infinity|undefined/,id);
    }
  }
});

test('Die statische Startseite verweist auf vorhandene Dateien', async () => {
  const index=await readFile('public/index.html','utf8');
  assert.match(index,/<html lang="de">/);
  for(const path of index.matchAll(/(?:href|src)="\/([^"]+)"/g)) {
    assert.ok((await readFile('public/'+path[1])).length,path[1]);
  }
  const headers=await readFile('public/_headers','utf8');
  assert.match(headers,/script-src 'self'/);
  assert.match(headers,/frame-ancestors 'none'/);
});
