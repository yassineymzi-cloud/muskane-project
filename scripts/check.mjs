import {readdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {products,categories} from '../src/data/products.js';
const files=[];async function walk(path){for(const entry of await readdir(path,{withFileTypes:true})){const file=`${path}/${entry.name}`;if(entry.isDirectory())await walk(file);else files.push(file);}}
for(const dir of ['src','scripts','tests'])await walk(dir);
for(const path of files.filter(f=>/\.(mjs|js)$/.test(f))){const result=spawnSync(process.execPath,['--check',path],{encoding:'utf8'});if(result.status!==0)throw new Error(result.stderr);}
if(new Set(products.map(p=>p.id)).size!==products.length)throw new Error('Duplicate product ID');
for(const p of products){if(!categories.some(c=>c.id===p.category)||p.price<0||!/^[-a-z]+$/.test(p.id))throw new Error('Invalid catalogue');}
const html=await readFile('index.html','utf8');if(!html.includes('lang="ar" dir="rtl"'))throw new Error('Arabic RTL missing');
for(const match of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g))await readFile(match[1]);
console.log(`Syntax checked ${files.length} files; catalogue, entry assets and RTL checks passed.`);
