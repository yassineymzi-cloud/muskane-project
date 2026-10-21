import test from 'node:test';
import assert from 'node:assert/strict';
import {commerce} from '../src/adapters/youcan.js';
test('add combines repeated selections without mutating the previous cart',async()=>{
 const previous=[{id:'amber-noir',quantity:2}];
 const next=await commerce.addItem('amber-noir',3,previous);
 assert.equal(next[0].quantity,5);assert.equal(previous[0].quantity,2);
});
test('quantity cap applies to existing and newly added items',async()=>{
 assert.equal((await commerce.addItem('amber-noir',8,[{id:'amber-noir',quantity:18}]))[0].quantity,20);
 assert.equal((await commerce.addItem('amber-noir',25,[]))[0].quantity,20);
});
test('prototype checkout rejects without creating an order',async()=>{
 await assert.rejects(commerce.checkout(),/YouCan/);
});
