// Replays every Firestore operation the LearnHub client actually performs,
// as each role, against the deployed rules.
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { readFileSync } from 'fs';

const env = await initializeTestEnvironment({
  projectId: 'compat-'+Math.random().toString(36).slice(2,7),
  firestore:{ rules: readFileSync(process.argv[2] || '../../firestore.rules','utf8'), host:'127.0.0.1', port:8080 }
});
const rows=[];
async function c(site,n,e,f){ try{ await (e==='DENY'?assertFails(f()):assertSucceeds(f())); rows.push([site,n,e,true,'']); }
  catch(x){ rows.push([site,n,e,false,(x.message||'').split('\n')[0].slice(0,58)]); } }

const stu=env.authenticatedContext('s1',{email:'s@t.com'}).firestore();
const adm=env.authenticatedContext('a1',{admin:true,role:'admin'}).firestore();
const gst=env.unauthenticatedContext().firestore();

await env.withSecurityRulesDisabled(async ctx=>{ const d=ctx.firestore();
  await setDoc(doc(d,'gameProgress/s1'),{userId:'s1',total_xp:100,totalXp:100,level:2,streak:3,currentStage:3});
  await setDoc(doc(d,'gameAttempts/ga1'),{userId:'s1',stageId:'st1',xpAwarded:50});
  await setDoc(doc(d,'quizAttempts/qa1'),{userId:'s1',passed:true,percentage:90});
  await setDoc(doc(d,'enrollments/e1'),{userId:'s1',courseId:'c1',progress:10});
  await setDoc(doc(d,'notifications/n1'),{userId:'s1',read:false});
  await setDoc(doc(d,'courses/c1'),{instructorId:'t1',title:'T',status:'published'});
  await setDoc(doc(d,'courses/c-d'),{instructorId:'t1',title:'D',status:'draft'});
  await setDoc(doc(d,'lessons/l1'),{courseId:'c1',order:1,title:'L'});
  await setDoc(doc(d,'articles/a1'),{title:'A'});
});

// --- line 361: profile sync, with privileged fields now stripped ---
await c('cloudDatabase:361','profile write WITH role (پرانا رویہ)','DENY',()=>
  setDoc(doc(stu,'users/s1'),{uid:'s1',name:'Ali',role:'super_admin',status:'active'},{merge:true}));
await c('cloudDatabase:361','profile write WITHOUT privileged fields (نیا)','ALLOW',()=>
  setDoc(doc(stu,'users/s1'),{uid:'s1',name:'Ali',avatar:'x'},{merge:true}));

// --- line 404: own profile read ---
await c('cloudDatabase:404','اپنی پروفائل پڑھنا','ALLOW',()=>getDoc(doc(stu,'users/s1')));

// --- line 499 / 523 / 833: writes now owned by Cloud Functions ---
await c('cloudDatabase:499','کلائنٹ quizAttempt لکھے','DENY',()=>
  setDoc(doc(stu,'quizAttempts/x'),{userId:'s1',passed:true}));
await c('cloudDatabase:523','کلائنٹ certificate لکھے','DENY',()=>
  setDoc(doc(stu,'certificates/x'),{userId:'s1'}));
await c('cloudDatabase:833','کلائنٹ gameAttempt لکھے','DENY',()=>
  setDoc(doc(stu,'gameAttempts/x'),{userId:'s1',xpAwarded:9999}));

// --- line 769: progress sync, scoring fields stripped ---
await c('cloudDatabase:769','progress WITH totalXp (پرانا رویہ)','DENY',()=>
  setDoc(doc(stu,'gameProgress/s1'),{userId:'s1',totalXp:5000,currentStage:9},{merge:true}));
await c('cloudDatabase:769','progress WITHOUT scoring fields (نیا)','ALLOW',()=>
  setDoc(doc(stu,'gameProgress/s1'),{userId:'s1',currentStage:9,unlocked:['w1']},{merge:true}));

// --- line 801 / 858: own reads and listings ---
await c('cloudDatabase:801','اپنی progress پڑھنا','ALLOW',()=>getDoc(doc(stu,'gameProgress/s1')));
await c('cloudDatabase:858','اپنی gameAttempts لسٹ کرنا','ALLOW',()=>
  getDocs(query(collection(stu,'gameAttempts'),where('userId','==','s1'))));
await c('cloudDatabase:858','دوسروں کی gameAttempts سویپ کرنا','DENY',()=>
  getDocs(collection(stu,'gameAttempts')));
await c('—','اپنے quizAttempts لسٹ کرنا','ALLOW',()=>
  getDocs(query(collection(stu,'quizAttempts'),where('userId','==','s1'))));
await c('—','اپنی enrollments لسٹ کرنا','ALLOW',()=>
  getDocs(query(collection(stu,'enrollments'),where('userId','==','s1'))));
await c('—','اپنی notifications لسٹ کرنا','ALLOW',()=>
  getDocs(query(collection(stu,'notifications'),where('userId','==','s1'))));

// --- line 686: content sync (published filter) ---
await c('cloudDatabase:686','courses where(published) — مہمان','ALLOW',()=>
  getDocs(query(collection(gst,'courses'),where('status','==','published'))));
await c('cloudDatabase:687','lessons سنک','ALLOW',()=>getDocs(collection(gst,'lessons')));
await c('cloudDatabase:687','articles سنک','ALLOW',()=>getDocs(collection(gst,'articles')));

// --- line 741: publishContent ---
await c('cloudDatabase:741','ایڈمن کورس شائع کرے','ALLOW',()=>
  setDoc(doc(adm,'courses/new1'),{id:'new1',title:'N',status:'published'},{merge:true}));
await c('cloudDatabase:741','طالبِ علم کورس شائع کرے','DENY',()=>
  setDoc(doc(stu,'courses/evil'),{id:'evil',title:'E',status:'published'},{merge:true}));

// --- line 625: unfiltered onSnapshot on a private collection ---
await c('cloudDatabase:625','بغیر فلٹر users پر لسنر','DENY',()=>getDocs(collection(stu,'users')));

console.log('\n═══ Compatibility matrix — emulator ═══');
let bad=0;
for(const [site,n,e,ok,err] of rows){ if(!ok) bad++;
  console.log(`  ${ok?'✓':'✗'} [${e.padEnd(5)}] ${site.padEnd(20)} ${n}${ok?'':'  →  '+err}`); }
console.log(`\n  ${rows.length-bad}/${rows.length} توقع کے مطابق\n`);
await env.cleanup(); process.exit(bad?1:0);
