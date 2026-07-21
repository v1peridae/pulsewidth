# how to build yubidnb from scratch (a total beginner's guide)

this guide walks you through building [yubidnb](https://yubidnb.vercel.app/). it's a web app i made that turns a yubikey otp into drum and bass music!

## table of contents

- [what is going on](#what-is-going-on)
- [what you need before starting](#what-you-need-before-starting)
- [step 0](#step-0-project-setup) - project setup
- [step 1](#step-1-the-seeded-random-number-generator---srcrandomjs) - `src/random.js`
- [step 2](#step-2-the-sample-catalog---srccatalogjs) - `src/catalog.js`
- [step 3](#step-3-turning-hit-strings-into-timestamps---srchitmapjs) - `src/hitmap.js`
- [step 4](#step-4-generating-patterns---srcpatternjs) - `src/pattern.js`
- [step 5](#step-5-a-tiny-shared-store---srcstorejs) - `src/store.js`
- [step 6](#step-6-the-effects---srcdelayjs-srcreverbjs-srcwaveshaperjs) - effects (`delay` `reverb` `waveshaper`)
- [step 7](#step-7-the-mixer---srcmixerjs) - `src/mixer.js`
- [step 8](#step-8-the-audio-engine---srcaudioenginejs) - `src/audioengine.js`
- [step 9](#step-9-loading-samples---srcloadsamplejs) - `src/loadsample.js`
- [step 10](#step-10-playing-one-note---srcplayerjs) - `src/player.js`
- [step 11](#step-11-the-heartbeat---srcworkerjs-and-srcsequencerjs) - `src/worker.js` and `src/sequencer.js`
- [step 12](#step-12-the-conductor---srcdnbjs) - `src/dnb.js`
- [step 13](#step-13-the-react-ui---srcappjsx) - `src/App.jsx`
- [step 14](#step-14-booting-the-app---srcmainjsx) - `src/main.jsx`
- [step 15](#step-15-run-it) - run it

---

## what is going on

<small><em>this tutorial is directed to people with not much background in making music. but i will let you know that you will need to look up a lot to better understand it because unfortunately text language is limiting when trying to explain stuff and this tutorial can only explain so much so youtube and google will be your best friend <3</em></small>

<small><em>for pulsewidth submissions please do make it your own! that could be using your own audio samples, changing the rules in `pattern.js`, adding your own “input” besides the yubikey otp, etc</em></small>

when you tap a yubikey it types a long random looking string called an OTP (one time password). something like `ccccccjkhlnbtuegkbncdvvxxxinilhtlkvhgtrfdgbl`. this project uses that string as the starting point for its random numbers.

the flow looks a bit like this

```
OTP string -> seed -> random number generator -> picks samples + generates patterns
                                                        ⌄
                              sequencer plays the patterns through web audio
```

five tracks play at once and sit on top of each other. two drums, a sub bass, a stab and some atmospheric noise.

## what you need before starting

- node.js from [nodejs.org](https://nodejs.org) so you can run javascript outside the browser and use `npm`
- a code editor
- chrome or firefox (not safari). safari struggles with the `.ogg` samples
- the sample files (step 0 lists the exact names)

## step 0: project setup

let's set things up with vite.

```bash
npm create vite@latest yubidnb -- --template react
cd yubidnb
npm install
```

if npm asks for permission to install `create-vite` just say yes. `npm install` takes a minute and creates a `node_modules` folder.

### clear out the demo app

vite drops a little demo app in for you. we don't need it so clear out `src/` and `public/` and make a samples folder.

```bash
rm -rf src/* public/*
mkdir public/samples
```

### `index.html`

in a vite project the main html file lives at the project root rather than inside `public/`. react draws everything into the `root` div and the `<script type="module">` line pulls our code in. replace `index.html` with this.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    <title>yubidnb</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### the samples

anything in `public/` is served as is. so `public/samples/amen1.ogg` shows up at `/samples/amen1.ogg`.

you need these 29 files in `public/samples/`. the names have to match because `catalog.js` looks them up by name in step 2.

- 7 drum breaks. `amen1.ogg` `apache1.ogg` `dothe1.ogg` `funky1.ogg` `hot1.ogg` `runs1.ogg` `think1.ogg`
- 3 sub bass notes. `sub1.ogg` `sub2.ogg` `sub3.ogg`
- 9 stabs (short melodic hits). `stab1.ogg` through `stab9.ogg`
- 9 fx sounds. `fx1.ogg` through `fx9.ogg`
- 1 impulse response. `impulse1.ogg`

the easy route is to copy `public/samples/` from the [yubidnb repo](https://github.com/v1peridae/yubidnb). your own sounds are fine too. just update the drum break info in `catalog.js` later. they need to be ogg files.

your folder should look like this.

```
yubidnb/
- package.json (from vite)
- vite.config.js (from vite)
- .gitignore (from vite)
- index.html
- node_modules/ (made by npm install)
- public/
  - samples/ (29 .ogg files)
- src/ (we fill this next)
```

one quick note before we touch `src/`. the app won't compile until every file is there because they import each other. so don't stress about testing until step 15. make each file and read the notes as you go.

## step 1: the seeded random number generator - `src/random.js`

javascript's built in `Math.random()` gives a different number every time and you can't steer it. we need something we can control so we use a seedable pseudo random number generator.

two small functions do the work together.

- `xmur3` turns a string into a number. our seed is a string but the generator wants a number. `xmur3` is a hash function. same string in always means same number out.
- `mulberry32` takes that number and hands back a function. each call to that function gives a value between 0 and 1. it looks random but it's fixed to the seed.

the module keeps one `rng` variable. everything else rolls dice through the helpers at the bottom. `randRange` picks a random integer. `sample` picks a random item from a list. `rand(25)` is a 25 percent chance. `shuffle` and `takeRandom` grab random items without repeats.

every random choice in the app goes through `rng`. so if you call `setSeed('same-otp')` first you always get the same tempo samples and drum hits. this file is the whole trick.

```js
// Seedable RNG helpers (xmur3 hash -> mulberry32)
let rng = Math.random;

function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const setSeed = (seedInput) => {
  const seedString = String(seedInput || "").trim();
  if (!seedString) {
    rng = Math.random;
    return;
  }
  const seed = xmur3(seedString)();
  rng = mulberry32(seed);
};

export const randRange = (min, max) =>
  min + Math.floor(rng() * (max - min + 1));
export const sample = (arr) =>
  arr.length > 0 ? arr[randRange(0, arr.length - 1)] : undefined;

export const rand = (value) => rng() < value / 100.0;

const randInt = (max) => Math.floor(rng() * max);

function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

export const shuffle = (list) => {
  const arr = [...list];
  for (let slot = arr.length - 1; slot > 0; slot--) {
    const element = randInt(slot + 1);
    swap(arr, element, slot);
  }
  return arr;
};

export const takeRandom = (num, arr) => shuffle(arr).slice(0, num);
```

`let rng = Math.random` stores a function in a variable the same way you'd store a number. it starts as the built in random function. `setSeed` swaps it for a seeded one. every helper calls `rng()` so changing that one variable changes randomness for the whole app.

`xmur3(str)` walks the string one character at a time. `str.charCodeAt(i)` turns each letter into a number (`a` is 97). the odd looking operators mash that into a running total `h`.

- `^` is XOR. it mixes the bits of two numbers
- `Math.imul` multiplies the way a 32 bit cpu would. it's fast and wraps on overflow which is the scrambling we want
- `(h << 13) | (h >>> 19)` slides bits left and wraps the ones that fall off back to the right. that smears information across the whole number

`xmur3` returns a function rather than a number. that's why `setSeed` calls it twice. `xmur3(seedString)` builds the hasher and the extra `()` runs it once to get the number.

`mulberry32(a)` works the same way. give it a starting number and you get a function back. each call scrambles `a` a bit more and divides by `4294967296` (that's 2³²!!) so the result sits between 0 and 1 like `Math.random()`. the next value only depends on `a` and `a` came from the seed so the sequence always repeats.

`setSeed` ties it together. it turns the input into a string and trims spaces. if it's empty we fall back to real randomness. otherwise the path is string → `xmur3` → number → `mulberry32` → new `rng`.

the helpers are thin wrappers so the rest of the app never touches `rng()` directly.

- `randRange(min, max)` stretches a 0 to 1 roll across a range chops the decimals and shifts by `min`. so `randRange(3, 5)` can be 3 4 or 5
- `sample(arr)` picks a random index. the length check stops empty arrays from crashing
- `rand(value)` is a percentage coin flip. `rand(25)` is true about a quarter of the time
- `shuffle(list)` is fisher yates. it copies the list first then swaps from the end backwards
- `takeRandom(num, arr)` shuffles then keeps the first `num` items

## step 2: the sample catalog - `src/catalog.js`

this file is pure data. it describes every sample we have. the bass stab and fx catalogs are just names and volumes (`gain` where 1.0 is full volume). though the interesting part is with how we describe the drum breaks!

```js
amen1: {
  bars: 2,        // the loop is 2 bars long
  bpm: 165,       // at 165 beats per minute
  hits: 'krstksttc0skkstt',  // what drum hit happens on each 8th note
  gain: 0.7,
},
```

that `hits` string is a handmade map of the break. each character is one 8th note and the letter says which drum lands there.

- `k` kick
- `s` snare
- `t` tween (ghost notes and hats and the in between bits)
- `c` crash
- `r` ride
- `0` nothing

so `krstksttc0skkstt` is kick ride snare tween and so on. you listen to the break once and write it down by ear. that's the only real manual labour in the project.

create `src/catalog.js`.

```js
export const bassCatalog = {
  sub1: { gain: 0.5 },
  sub2: { gain: 0.8 },
  sub3: { gain: 0.6 },
};

export const fx = {
  fx1: { gain: 0.3 },
  fx2: { gain: 0.2 },
  fx3: { gain: 0.3 },
  fx4: { gain: 0.3 },
  fx5: { gain: 0.2 },
  fx6: { gain: 0.3 },
  fx7: { gain: 0.3 },
  fx8: { gain: 0.3 },
  fx9: { gain: 0.3 },
};

export const stabs = {
  stab1: { gain: 0.6 },
  stab2: { gain: 0.6 },
  stab3: { gain: 0.6 },
  stab4: { gain: 0.7 },
  stab5: { gain: 0.6 },
  stab6: { gain: 0.6 },
  stab7: { gain: 0.4 },
  stab8: { gain: 0.6 },
  stab9: { gain: 0.6 },
};

export default {
  amen1: {
    bars: 2,
    bpm: 165,
    hits: "krstksttc0skkstt",
    gain: 0.7,
  },
  apache1: {
    bars: 2,
    bpm: 165,
    hits: "krsttkstkksttkst",
  },
  dothe1: {
    bars: 1,
    bpm: 165,
    hits: "krsttkst",
  },
  funky1: {
    bars: 2,
    bpm: 165,
    hits: "kksttkstkksttkst",
  },
  hot1: {
    bars: 2,
    bpm: 165,
    hits: "krsttkskkrstrstt",
  },
  runs1: {
    bars: 2,
    bpm: 165,
    hits: "c0sttkstkksttks0",
  },
  think1: {
    bars: 2,
    bpm: 165,
    hits: "krsttrs0krsttrsr",
  },
};
```

## step 3: turning hit strings into timestamps - `src/hitmap.js`

we know what hits where in the loop. the third 8th note is a snare... but playback needs seconds. the snare is 0.36 seconds into the file. this file does that conversion.

at 165 bpm one beat lasts 60/165 seconds which is about 0.36. a 2 bar loop is 8 beats and that's 16 eighth notes. each 8th lasts a slice of that total. hit number `index` sits at `index` times that slice length.

`generateHitMap('amen1')` splits the hits string and tags each character with its type and time. you get something like this.

```js
[
  { index: 0, hit: "k", time: 0 },
  { index: 1, hit: "r", time: 0.1818 },
  { index: 2, hit: "s", time: 0.3636 },
];
```

now we can say play the amen break from 0.36 seconds and hear just the snare. that's slicing a break and it's how a lot of drum and bass gets made.

create `src/hitmap.js`.

```js
import catalog from "./catalog";

const indexToTime = (spec, index) => {
  const oneBeat = 60.0 / spec.bpm;
  const amountBeats = spec.bars * 4;
  const amountEights = amountBeats * 2;
  const sampleLenSecs = oneBeat * amountBeats;
  const sliceLen = sampleLenSecs / amountEights;
  return index * sliceLen;
};

const generateHitMap = (sampleName) => {
  const spec = catalog[sampleName];
  const hits = spec.hits.split("");
  const mappedHits = hits.map((v, k) => ({
    index: k,
    hit: v,
    time: indexToTime(spec, k),
  }));
  return mappedHits.filter((item) => item.hit !== "0");
};

export default generateHitMap;
```

`indexToTime` is the math from up there written out.

- `oneBeat = 60.0 / spec.bpm`. bpm means beats per minute so sixty seconds divided by bpm is one beat in seconds
- `amountBeats = spec.bars * 4`. we're in 4/4 so each bar has four beats
- `amountEights = amountBeats * 2`. each beat splits into two 8th notes
- `sampleLenSecs` is the whole loop length
- `sliceLen` is that length shared evenly across the 8ths
- `index * sliceLen` puts hit 0 at zero seconds hit 1 one slice later and so on

`generateHitMap` does three things in a row.

- `catalog[sampleName]` looks up the break by name
- `spec.hits.split("")` turns the string into single characters
- `.map` builds an object for each character with its index hit and time
- `.filter` drops the `"0"` entries since there's nothing to slice there

## step 4: generating patterns - `src/pattern.js`

a pattern is an array where each slot is one 16th note. a slot is either `null` (silence) or a note object. the sequencer walks these arrays later slot by slot.

`createPattern` builds one pattern for each track. lengths are random multiples of 16 (like 32, 64 or 128). each track gets a different length so they drift against each other and the loop stays interesting.

there are two drum algorithms in `drumloopAlgos` and one gets picked at random.

`subAlgos` has three ways of writing the bass. one dumps notes at the start, one saves a little run for the end and one just copies wherever the drums are hitting.

```js
import { sample, randRange, takeRandom, rand } from "./random";

const randSub = (rootPitch) => ({ pitch: rootPitch + randRange(-2, 10) });
const empty = (len) => {
  const pattern = [];
  for (let i = 0; i < len; ++i) {
    pattern.push(null);
  }
  return pattern;
};

const subAlgos = [
  // rush start + ending fill
  (len, rootPitch) => {
    const pattern = empty(len);
    const startChoices = [1, 2, 3, 4];
    [0].concat(takeRandom(randRange(1, 4), startChoices)).forEach((index) => {
      pattern[index * 2] = randSub(rootPitch);
    });
    const endChoices = [-4, -6, -8];
    takeRandom(randRange(0, 2), endChoices).forEach((index) => {
      pattern[len + index] = randSub(rootPitch);
    });
    return pattern;
  },

  // start root + end rush
  (len, rootPitch) => {
    const pattern = empty(len);
    pattern[0] = rootPitch;
    const endChoices = [-2, -4, -6, -8, -10];
    takeRandom(randRange(1, 5), endChoices).forEach((index) => {
      pattern[len + index] = randSub(rootPitch);
    });
    return pattern;
  },

  // follow drums
  (len, rootPitch, drumloop) => {
    const pattern = empty(len);
    for (let i = 0; i < len; ++i) {
      const v = drumloop[i % drumloop.length];
      if (
        v &&
        (v.hit === "k" || v.hit === "s" || v.hit === "c") &&
        i % 2 === 0 &&
        rand(i === 0 ? 100 : 50)
      ) {
        pattern[i] = randSub(rootPitch);
      }
    }
    if (!pattern[0]) {
      pattern[0] = randSub(rootPitch);
    }
    return pattern;
  },
];

const drumloopAlgos = [
  // random 2/4/6
  (len, hitMap) => {
    const pattern = empty(len);
    const choices = hitMap.map((v) => v.time);
    let i = 0;
    let skip;
    while (i < pattern.length) {
      const randomSlice = sample(hitMap);
      pattern[i] = randomSlice;
      const skipChoices = [2];
      // if slice is near the end it can't be played as long
      if (randomSlice.index + 2 <= choices.length) {
        skipChoices.push(4);
      }
      if (randomSlice.index + 4 <= choices.length) {
        skipChoices.push(6);
      }
      skip = sample(skipChoices);
      i += skip;
    }
    return pattern;
  },

  // kicks + snares + crashes
  (len, hitMap) => {
    const pattern = empty(len);
    const snare = hitMap.filter((v) => v.hit === "s")[0];
    const tweens = hitMap.filter((v) => v.hit === "t");
    const kick = hitMap.filter((v) => v.hit === "k")[0];
    const crash = hitMap.filter((v) => v.hit === "c")[0];
    const choices = hitMap.map((v) => v.time);
    let i = 0;
    let skip;
    while (i < pattern.length) {
      const randomSlice = rand((i - 4) % 16 === 0 ? 80 : 50) ? snare : kick;
      pattern[i] = randomSlice;
      if (randomSlice === snare && i > 1 && rand(25)) {
        let fillSnare = randomSlice;
        if (rand(40)) {
          fillSnare = Object.assign({}, randomSlice, {
            pitch: randRange(-1, 1),
          });
        }
        pattern[i - 1] = fillSnare;
      }
      const skipChoices = [2];
      if (randomSlice.index + 2 <= choices.length) {
        skipChoices.push(4);
      }
      if (randomSlice.index + 4 <= choices.length) {
        skipChoices.push(6);
      }
      skip = sample(skipChoices);
      if (i === 0 && skip === 2 && rand(70)) {
        skip = sample([4, 6]);
      }
      if ((skip === 4 || skip === 6) && rand(50)) {
        const tweenIndex = i + (skip === 4 ? 2 : 4);
        if (tweenIndex < len) {
          pattern[tweenIndex] = sample(tweens);
        }
      }
      i += skip;
    }
    const amountCrashes = randRange(0, 3);
    for (let i = 0; i < amountCrashes; ++i) {
      let index = randRange(0, (len - 2) / 2) * 2;
      if (i === 0 && rand(75)) {
        index = 0;
      }
      pattern[index] = crash;
    }
    return pattern;
  },
];

const sparse = (len, rootPitch) => {
  const pattern = empty(len);
  for (let i = 0; i < len; ++i) {
    if (i % 2 === 0 && rand(4)) {
      pattern[i] = { pitch: rootPitch + randRange(-7, 7) };
    }
  }
  return pattern;
};

const createPattern = (hitMap) => {
  const rootPitch = randRange(-4, 4);
  const len = [
    sample([2, 4]),
    sample([2, 4]),
    sample([2, 4]),
    sample([4, 8]),
    sample([4, 8]),
  ].map((x) => x * 16);
  const drumloop = sample(drumloopAlgos)(len[0], hitMap);
  const drumloop2 = sample(drumloopAlgos)(len[1], hitMap);
  return {
    drumloop,
    drumloop2,
    sub: sample(subAlgos)(len[2], rootPitch, drumloop),
    fx: sparse(len[3], rootPitch),
    stab: sparse(len[4], rootPitch),
  };
};

export default createPattern;
```

2 helpers at the top.

- `randSub` makes one bass note with a pitch near the song root
- `empty(len)` builds an array of nulls ready to fill in

`subAlgos` is an array of three functions. each takes a length and a root pitch (and sometimes the drum pattern) and returns a filled pattern. keeping them in an array means picking one is just `sample(subAlgos)`.

1. rush start and ending fill. always put a note on slot 0 then sprinkle a few more near the start on even slots. negative indexes at the end count back from the loop wrap so you get a fill before it restarts
2. start root and end rush. same idea at the end but with more notes so it runs into the wrap
3. follow drums. look at the drum pattern at the same slot (wrapping with `%` if needed). if there's a kick snare or crash on an even slot and a coin flip says yes drop a bass note. slot 0 always gets one

`drumloopAlgos` are the drum builders. both walk the pattern with a variable stride.

```js
while (i < pattern.length) {
  pattern[i] = someSlice; // place a slice here
  skip = sample([2, 4, 6]); // let it ring for 2, 4 or 6 sixteenths
  i += skip;
}
```

skipped slots stay null so the slice at `i` keeps ringing. that's how one hit lasts a beat or more!

`skipChoices` handles a boundary problem. a slice near the end of the source loop doesn't have much audio left so a long ring would be silence. longer skips are only allowed when there's enough audio left.

algorithm 1 (random 2-4-6s) is that loop with any random slice each time.

algorithm 2 (kicks snares crashes) makes more musical choices.

- it reuses one snare slice and one kick slice from the hitmap which sounds tighter
- snares favour the second quarter of each bar (80 percent there and a coin flip elsewhere)
- sometimes it doubles a snare on the slot before for a fill and sometimes re-pitches that copy
- the opening hit often gets a longer skip so it can breathe
- long gaps sometimes get a tween slice in the middle
- a few crashes land on even slots and the first one often hits slot 0

`sparse` is the fx and stab generator. every even slot has a 4 percent chance of a note near the root. rare on purpose.

`createPattern` picks a shared root pitch then a length per track and runs one drum algorithm and one sub algorithm. different lengths are the phasing trick from the intro.

## step 5: a tiny shared store - `src/store.js`

a small shared object that holds the current tempo pattern and playhead so different parts of the app can see them.

create `src/store.js`.

```js
const store = {
  tempo: null,
  currentIndex: 0,
  pattern: { drumloop: [], sub: [] },
  setTempo: (tempo) => {
    store.tempo = tempo;
  },
  setCurrentIndex: (i) => {
    store.currentIndex = i;
  },
  setPattern: (pattern) => {
    store.pattern = pattern;
  },
};

export default store;
```

no framework and no library. just a plain object exported from a module. javascript modules are singletons so every `import store from './store'` gets the same object. write `store.setTempo(172)` in one file and every other file sees it. that's the whole trick.

## step 6: the effects - `src/delay.js`, `src/reverb.js`, `src/waveshaper.js`

time to meet web audio. it's the browser's built in synth and mixer. you create nodes for sources volume and effects then plug them together with `.connect()` like guitar pedals ending at the speakers.

we build three effect pedals. each returns `{ input, output }` so there's a plug on each side. that shape lets us chain them later with `delay.output.connect(reverb.input)`.

delay is a stereo echo. two lines with different times (0.5s left and 0.333s right) so the echoes bounce around. each feeds back into itself at 60 percent volume so they repeat and fade. a filter at 2kHz softens the sound going in so the echoes sound duller than the original the way a real echo does.

create `src/delay.js`.

```js
export const delay = (
  ctx,
  {
    lDelay = 0.5,
    rDelay = 0.333,
    feedback = 0.6,
    filterFrequency = 2000,
    gain = 1.0,
  },
) => {
  const output = ctx.createGain();
  output.gain.value = gain;
  const input = ctx.createGain();
  const delayL = ctx.createDelay(2);
  delayL.delayTime.value = lDelay;
  const delayR = ctx.createDelay(2);
  delayR.delayTime.value = rDelay;
  const filter = ctx.createBiquadFilter();
  filter.frequency.value = filterFrequency;
  const feedbackL = ctx.createGain();
  feedbackL.gain.value = feedback;
  const feedbackR = ctx.createGain();
  feedbackR.gain.value = feedback;
  const merger = ctx.createChannelMerger(2);

  input.connect(filter);
  filter.connect(delayL);
  filter.connect(delayR);
  delayL.connect(feedbackL);
  delayR.connect(feedbackR);
  feedbackL.connect(delayL);
  feedbackR.connect(delayR);
  delayL.connect(merger, 0, 0);
  delayR.connect(merger, 0, 1);
  merger.connect(output);

  return {
    input,
    output,
  };
};
```

the node types first.

- `createGain()` is a volume knob and a cheap empty socket. that's why input and output are gain nodes
- `createDelay(2)` holds sound back. the 2 is the max delay in seconds. the real value sits on `delayTime`
- `createBiquadFilter()` is a tone control. default lowpass at 2000Hz keeps the lows and muffles the highs
- `createChannelMerger(2)` packs two mono signals into stereo

the function signature uses destructuring with defaults so the mixer can pass `{ gain: 0.4 }` and the rest fills itself in.

the `.connect()` calls do the wiring.

```
input → filter → delayL ↔ feedbackL     delayL → merger
               → delayR ↔ feedbackR     delayR → merger     merger → output
```

the delay feeds a gain and that gain feeds back into the delay at 60 percent. each echo comes back quieter until it dies. if feedback were 1 or more the echoes would run away. left and right use different times so the echo feels wide.

reverb uses a `ConvolverNode` with `impulse1.ogg`. convolution reverb stamps a recording of a real space's echo onto your sound and the browser does the heavy maths. a highpass filter keeps bass out so it doesn't get muddy. `dry` and `wet` gains balance the original against the reverberated copy.

create `src/reverb.js`.

```js
export const reverb = (ctx, { buffer, dry = 0.8, wet = 0.5 }) => {
  const reverb = ctx.createConvolver();
  const output = ctx.createGain();
  const input = ctx.createGain();
  const dryNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.frequency.value = 100;
  filter.type = "highpass";
  dryNode.gain.value = dry;
  const wetNode = ctx.createGain();
  wetNode.gain.value = wet;
  input.connect(dryNode);
  dryNode.connect(output);
  input.connect(filter);
  filter.connect(reverb);
  reverb.connect(wetNode);
  wetNode.connect(output);
  reverb.buffer = buffer;

  return {
    input,
    output,
  };
};
```

two paths run from input to output in parallel.

- dry path. the untouched sound at 80 percent
- wet path. a highpass at 100Hz first (reverbed bass turns to mud) then the convolver then a wet gain at 50 percent

both hit the same output so you hear a blend. `reverb.buffer = buffer` loads the impulse. an impulse response is a recording of how a room answers a sharp sound. convolution stamps that onto your audio. that's why `dnb.js` loads `impulse1` before the mixer is built.

waveshaper is distortion. it bends the waveform through a curve (`tanh(k * sin(x))`) which softly clips the signal. the wet mix is very quiet (`wet.gain.value = 0.05`). just enough grit and glue without sounding broken.

create `src/waveshaper.js`.

```js
const makeDistortionCurve = (amount) => {
  const k = amount;
  const nSamples = 4096;
  const curve = new Float32Array(nSamples);
  let x;
  for (let i = 0; i < nSamples; ++i) {
    x = (i * 2) / nSamples - 1;
    curve[i] = Math.tanh(k * Math.sin(x));
  }
  return curve;
};

export const waveshaper = (ctx) => {
  const shaper = ctx.createWaveShaper();
  shaper.curve = makeDistortionCurve(32);
  shaper.oversample = "4x";
  const output = ctx.createGain();
  const input = ctx.createGain();
  const dry = ctx.createGain();
  dry.gain.value = 0.2;
  const wet = ctx.createGain();
  wet.gain.value = 0.05;
  input.connect(dry);
  input.connect(wet);
  wet.connect(shaper);
  shaper.connect(output);
  dry.connect(output);

  return {
    output,
    input,
  };
};
```

`makeDistortionCurve` builds a lookup table. for every incoming sample between -1 and 1 the waveshaper looks up a replacement. a straight line would change nothing. any bend distorts.

the loop fills that table. `x` walks from -1 to 1 and `tanh` squashes big values gently (soft clipping rather than harsh digital crush). `k = 32` sets how hard it hits.

`oversample = "4x"` runs the curve at a higher rate so new high frequencies don't fold back as fizz. the dry and wet mix is the same idea as reverb. clean signal at 0.2 and distorted at 0.05. you're not meant to hear "distortion" so much as feel the drums glued together.

## step 7: the mixer - `src/mixer.js`

the mixer is where every track's sound goes before the speakers. it builds this plumbing.

```
drumloop  -> waveshaper (distortion) -> master gain -> speakers
drumloop2 -> waveshaper (distortion) -> master gain -> speakers
sub       -> waveshaper (distortion) -> master gain -> speakers

fx   -> delay <-> reverb -> master gain -> speakers
stab -> delay <-> reverb -> master gain -> speakers
```

each track gets its own gain node then routes through effects. drums and sub get the soft distortion. fx and stabs go through delay into reverb which is why they sound huge. `context.destination` is web audio's name for the speakers.

create `src/mixer.js`.

```js
import { reverb } from "./reverb";
import { delay } from "./delay";
import { waveshaper } from "./waveshaper";

const createMixer = (context, buffers) => {
  const master = context.createGain();
  master.gain.value = 0.8;
  master.connect(context.destination);
  const trackDest = master;

  const buffer = buffers.impulse1;

  const tracks = {};
  ["drumloop", "drumloop2", "sub", "fx", "stab"].forEach((t) => {
    const g = context.createGain();
    let dest = trackDest;
    if (t === "fx" || t === "stab") {
      const del = delay(context, { gain: 0.4 });
      const rev = reverb(context, { buffer });
      del.output.connect(rev.input);
      rev.output.connect(trackDest);
      g.connect(rev.input);
      dest = del.input;
    } else if (t.startsWith("drumloop") || t === "sub") {
      const ws = waveshaper(context);
      ws.output.connect(trackDest);
      dest = ws.input;
    }
    g.connect(dest);
    tracks[t] = { gain: g };
  });

  return {
    master,
    tracks,
  };
};

export default createMixer;
```

`master` is one gain everything funnels through before the speakers. it's at 0.8 so five tracks at full volume don't clip.

the loop builds one channel per track. each gets a gain fader then a `dest` that starts as the master.

fx and stab get delay and reverb. sound goes straight into reverb and also through the delay whose echoes hit the reverb too. that's why a little stab blooms.

drums and sub get a waveshaper. `startsWith("drumloop")` catches both drum tracks.

`tracks[t] = { gain: g }` saves each fader so the player can plug notes into the right channel later.

effects are created inside the loop so fx and stab each get their own delay and reverb. a bit wasteful. much simpler.

## step 8: the audio engine - `src/audioengine.js`

this creates the one object everything shares. `new AudioContext()` is our link to the sound card. the engine holds

- `context` the web audio context
- `buffers` decoded samples as we load them
- `scene` the current song (tempo patterns samples)
- `sequencer` playback bookkeeping

create `src/audioengine.js`.

```js
import createMixer from "./mixer";

const createAudioEngine = () => {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const buffers = {};
  return {
    context,
    buffers,
    scene: {
      tempo: 170,
      pattern: {
        drumloop: [],
        drumloop2: [],
        sub: [],
        fx: [],
        stab: [],
      },
    },
    sequencer: {
      currentNote: 0,
      lastTickTime: context.currentTime,
    },
  };
};

export const addMixer = (engine) => {
  const mixer = createMixer(engine.context, engine.buffers);
  engine.mixer = mixer;
};

export default createAudioEngine;
```

`new (window.AudioContext || window.webkitAudioContext)()` makes the context. old safari used the webkit name. there should only be one per page which is why it lives on this shared object.

`scene` starts as a placeholder so the sequencer can tick safely before a real song exists. `lastTickTime` records the last check in on the audio clock. `addMixer` is separate because the mixer needs `impulse1` loaded first but the context has to exist before any loading. boot order is create engine → load impulse → add mixer.

## step 9: loading samples - `src/loadsample.js`

getting audio into `buffers` is three steps.

1. `fetch` downloads the raw bytes
2. `decodeAudioData` turns ogg into an `AudioBuffer`
3. stash it in `buffers` so we never load the same file twice

it also checks whether the browser can decode ogg and logs a clear error if not.

create `src/loadsample.js`.

```js
const doRequest = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }
  return response.arrayBuffer();
};

const getSampleFileName = (key) => {
  const base = import.meta.env.BASE_URL || "";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${normalizedBase}/samples/${key}.ogg`;
};

const canPlayOggVorbis = () => {
  if (typeof document === "undefined") return true;
  const audio = document.createElement("audio");
  return !!(
    audio &&
    audio.canPlayType &&
    audio.canPlayType('audio/ogg; codecs="vorbis"')
  );
};

const loadSample = (ctx, buffers, name) =>
  new Promise((resolve, reject) => {
    if (buffers[name]) {
      resolve();
      return;
    }

    if (!canPlayOggVorbis()) {
      const err = new Error(
        "This browser cannot decode OGG. Please use Chrome or Firefox.",
      );
      console.error(err.message);
      reject(err);
      return;
    }

    const url = getSampleFileName(name);
    doRequest(url)
      .then((rawBuffer) => {
        try {
          ctx.decodeAudioData(
            rawBuffer,
            (buffer) => {
              buffers[name] = buffer;
              resolve();
            },
            (e) => {
              const err = new Error(`Unable to decode audio data for ${url}`);
              console.error(err.message, e);
              reject(err);
            },
          );
        } catch (e) {
          const err = new Error(
            `decodeAudioData threw for ${url}: ${e && e.message ? e.message : e}`,
          );
          console.error(err.message);
          reject(err);
        }
      })
      .catch((e) => {
        console.error(`Error fetching ${url}:`, e);
        reject(e);
      });
  });

export default loadSample;
```

`doRequest` waits for `fetch` then returns the raw bytes. the `response.ok` check matters because fetch does not treat a 404 as an error. without it you'd hand an html error page to the decoder.

`getSampleFileName` builds the url. `import.meta.env.BASE_URL` is where vite thinks the app is mounted. slicing avoids a double slash.

the main function wraps everything in a Promise. if the buffer is already cached we resolve straight away. otherwise download decode and stash. callers use `.then` and everything that needs samples just reads from the shared `buffers` object.

## step 10: playing one note - `src/player.js`

`playSample` is the only place a sound actually starts :sob: for a note it looks up the buffer creates a one shot `BufferSource` plugs it into the track's mixer channel sets the speed and starts at an offset into the file. that offset is the slicing from step 3

```js
node.start(ctx.context.currentTime + delta, offset);
```

playback speed does two things:

- drum notes use `scene.playbackRate` (song tempo over the break's recorded tempo). so a 165 bpm break in a 175 bpm song plays a bit faster and a bit higher.
- pitched notes use `Math.pow(2, semitones / 12)`

```js
const getRateFromPitch = (pitch) => Math.pow(2, (pitch * 100) / 1200);

const playSample = (ctx, note, track, delta = 0) => {
  const sampleSpec = ctx.scene.samples[track];
  const buffer = ctx.buffers[sampleSpec.name];
  if (!buffer) {
    return null;
  }
  const node = ctx.context.createBufferSource();
  node.buffer = buffer;
  const destGain = ctx.mixer.tracks[track].gain;
  destGain.gain.value = sampleSpec.gain;
  node.connect(destGain);
  if (note && note.hasOwnProperty("pitch")) {
    node.playbackRate.value = getRateFromPitch(note.pitch);
  } else {
    node.playbackRate.value = ctx.scene.playbackRate;
  }
  const offset = note && note.time ? note.time : 0;
  node.start(ctx.context.currentTime + delta, offset);
  return node;
};

export default playSample;
```

`getRateFromPitch` turns semitones into a speed

`scene.samples[track]` says which file and how loud. if the buffer isn't loaded yet we return null and the note is skipped.

pitched notes have a `pitch` field. drums don't so they use the scene wide rate. `node.start(when, offset)` takes when to play and where in the file to begin. the node is returned so the sequencer can stop it when the next slice arrives.

## step 11: the heartbeat - `src/worker.js` and `src/sequencer.js`

this is the trickiest bit gulp

javascript timers are weird bc they fire late when the browser is busy and that's not very great for music. web audio can schedule sounds ahead of time with `node.start(exactTime)`.

so we use a pattern called [a tale of two clocks](https://web.dev/audio-scheduling/). a timer in `src/worker.js`checks in and each check in books upcoming notes on the pretty precise audio clock.

a web worker runs on a background thread and posts every 200ms.

```js
export default (ctx, fn) => {
  const inlined =
    "self.addEventListener('message', function() {setInterval(function() {self.postMessage(true)}, 200)});";
  const url = window.URL || window.webkitURL;
  const blobUrl = url.createObjectURL(new Blob([inlined]));
  const worker = new Worker(blobUrl);
  worker.postMessage("start");
  worker.addEventListener("message", () => fn(ctx));
  // stores worker reference so it doesnt get nuked automatically
  window.worker = worker;
};
```

here the whole program is the `inlined` string wrapped in a Blob with a fake url. the worker waits for a start message then posts every 200ms. on the main thread each ping runs `tick`. `window.worker = worker` keeps a reference so the garbage collector doesn't kill the heartbeat.

the precise scheduler is `src/sequencer.js`. every 200ms `tick` asks which 16th notes fell since the last check in. for each one it calls `scheduleNote` with a delta and `playSample` books the sound on the audio clock.

in `scheduleNote` `currentNote % pattern[track].length` lets each track wrap at its own length and stopping the previous node cuts the old slice

```js
import playSample from "./player";

let playing = false;
const noteLen = 0.25;
const seqLength = 256;

let previousNodes = {};

const WORKER_TICK_LEN = 0.2;

const TRACKS = ["drumloop", "drumloop2", "sub", "fx", "stab"];

const scheduleNote = (ctx, delta = 0) => {
  const currentNote = ctx.sequencer.currentNote;
  const pattern = ctx.scene.pattern;

  TRACKS.forEach((track) => {
    const note = pattern[track][currentNote % pattern[track].length];

    if (note !== null) {
      if (previousNodes[track]) {
        previousNodes[track].stop(ctx.context.currentTime + delta);
      }
      previousNodes[track] = playSample(ctx, note, track, delta);
    }
  });
};

export const togglePlay = (state) => {
  if (typeof state === "boolean") {
    playing = state;
  } else {
    playing = !playing;
  }
};

const nextNote = (ctx) => {
  const currentNote = ctx.sequencer.currentNote;
  const nextNote = currentNote === seqLength - 1 ? -1 : currentNote;
  ctx.sequencer.currentNote = nextNote + 1;
};

const getNextNoteTime = (ctx, time) => {
  const tempo = ctx.scene.tempo;
  const beatLen = 60.0 / tempo;
  const current16th = Math.floor(time / (noteLen * beatLen));
  return (current16th + 1) * (noteLen * beatLen);
};

const SAFETY_OFFSET = 0.01;

export const tick = (ctx) => {
  const currentTime = ctx.context.currentTime;
  if (playing) {
    let time = ctx.sequencer.lastTickTime;
    const nextNotes = [];
    let nextNoteTime;
    do {
      nextNoteTime = getNextNoteTime(ctx, time);
      if (nextNoteTime < currentTime) {
        nextNotes.push(nextNoteTime);
      }
      time += nextNoteTime - time + 0.005;
    } while (nextNoteTime < currentTime);
    for (let i = 0; i < nextNotes.length; ++i) {
      const delta = Math.max(
        nextNotes[i] - (currentTime - WORKER_TICK_LEN) + SAFETY_OFFSET,
        0,
      );
      scheduleNote(ctx, delta);
      const currentNote = ctx.sequencer.currentNote;
      setTimeout(() => {
        ctx.scene.store.setCurrentIndex(currentNote);
      }, delta);
      nextNote(ctx);
    }
  }
  ctx.sequencer.lastTickTime = currentTime;
};
```

`noteLen = 0.25` means one slot is a 16th note. `seqLength = 256` is how high the master counter goes before wrapping.

`getNextNoteTime` asks when the next 16th lands after a given moment. `nextNote` advances the counter and wraps at 255.

each `tick` does two passes. first it collects any 16th boundaries that have already passed since the last check, then it schedules them a little in the future (about one worker tick ahead). `scheduleNote` plays one column across all five tracks and cuts the previous node on that track when needed.

## step 12: the conductor - `src/dnb.js`

congrats on making it here :D this file wires everything together!

- `generateNew` rolls a new song. picks two different drum breaks plus bass stab and fx through the seeded picker then loads them and calls `generate`
- `generate` builds the scene. tempo between 160 and 180. hitmap and pattern. drum playback rate. packages it into `engine.scene`. `drumloop2` gain is a coin flip between audible and silent so some seeds get a second drum layer and some don't
- `init` creates the engine loads impulse first builds the mixer generates a song and starts the worker
- `actions` are what the buttons call

browsers refuse to make sound until the user interacts... so `resumeAudioIfNeeded` handles that and the `inited` / `pendingAutoStart` flags delay audio boot in production until someone presses something.

```js
import createAudioEngine, { addMixer } from "./audioengine";
import loadSample from "./loadsample";
import createPattern from "./pattern";
import generateHitMap from "./hitmap";
import { randRange, sample, setSeed } from "./random";
import startTick from "./worker";
import catalog, { bassCatalog, fx, stabs } from "./catalog";
import { tick, togglePlay } from "./sequencer";
import store from "./store";

let engine;
let pendingAutoStart = false;

const resumeAudioIfNeeded = () => {
  try {
    if (engine && engine.context && engine.context.state !== "running") {
      engine.context.resume();
    }
  } catch (e) {}
};

export const resumeAudio = () => resumeAudioIfNeeded();

const randomStab = () => sample(Object.keys(stabs));
const randomFx = () => sample(Object.keys(fx));
const randomBassSample = () => sample(Object.keys(bassCatalog));
const randomDrumSample = () => sample(Object.keys(catalog));

const generate = (smpls) => {
  const [sampleName, dr2sample, bassSample, stabSample, fxSample] = smpls;
  const tempo = randRange(160, 180);
  const sampleTempo = catalog[sampleName].bpm;
  const hitMap = generateHitMap(sampleName);
  const pattern = createPattern(hitMap);
  store.setPattern(pattern);
  store.setTempo(tempo);
  console.log(
    tempo,
    sampleName,
    dr2sample,
    bassSample,
    pattern,
    stabSample,
    fxSample,
  );
  const samples = {
    drumloop: { name: sampleName, gain: catalog[sampleName].gain || 1.0 },
    drumloop2: {
      name: dr2sample,
      gain: sample([(catalog[dr2sample].gain || 1.0) * randRange(0.3, 1.0), 0]),
    },
    sub: { gain: bassCatalog[bassSample].gain || 0.6, name: bassSample },
    stab: { gain: stabs[stabSample].gain || 0.6, name: stabSample },
    fx: { gain: fx[fxSample].gain || 0.6, name: fxSample },
  };
  return {
    playbackRate: (tempo / sampleTempo) * 0.99,
    samples,
    tempo,
    pattern,
    store,
  };
};

const generateNew = () => {
  const dr1 = randomDrumSample();
  let dr2 = randomDrumSample();
  while (dr2 === dr1) {
    dr2 = randomDrumSample();
  }
  const samples = [dr1, dr2, randomBassSample(), randomStab(), randomFx()];
  samples.forEach((s) => loadSample(engine.context, engine.buffers, s));
  engine.scene = generate(samples);
};

const generateFromSeed = (seed, isProd) => {
  setSeed(seed);
  if (!inited && isProd) {
    init(false);
  } else {
    generateNew();
  }
};

let inited = false;

const init = (isProd) => {
  if (!isProd) {
    engine = createAudioEngine();
    loadSample(engine.context, engine.buffers, "impulse1").then(() => {
      addMixer(engine);
      generateNew();
      startTick(engine, tick);
      inited = true;
      if (pendingAutoStart) {
        resumeAudioIfNeeded();
        togglePlay(true);
        pendingAutoStart = false;
      }
    });
  }
};

export const actions = (isProd) => ({
  newScene: () => {
    if (!inited && isProd) {
      init(false);
    }
    resumeAudioIfNeeded();
    generateNew();
  },
  fromSeed: (seed) => {
    if (!inited && isProd) {
      setSeed(seed);
      pendingAutoStart = true;
      init(false);
    } else {
      generateFromSeed(seed, isProd);
      resumeAudioIfNeeded();
      togglePlay(true);
    }
  },
  togglePlay: () => {
    if (!inited && isProd) {
      pendingAutoStart = true;
      init(false);
    } else {
      togglePlay();
      resumeAudioIfNeeded();
    }
  },
  adjustVolume: (evt) => {
    engine.mixer.master.gain.value = (evt.target.value || 50) / 100.0;
  },
});

export default init;
```

`engine` `inited` and `pendingAutoStart` live at module level so every function shares them.

the random pickers turn catalog keys into a list and `sample` picks one.

`generate` unpacks the five sample names rolls a tempo builds the hitmap and pattern and returns the scene object the sequencer reads. the `* 0.99` on playback rate drags the drums a hair slow on purpose.

`generateNew` rerolls until the two breaks differ then fires off loads without awaiting them and swaps the scene in straight away. tracks fade in as their files land because the player skips missing buffers.

## step 13: the react ui - `src/App.jsx`

the ui is very minimal. the file is `.jsx` because it contains jsx (the html looking syntax) and vite wants that extension for it. the engine files stay as plain `.js`.

create `src/App.jsx`.

```js
import React, { Component } from "react";

class App extends Component {
  state = { seedInput: "" };

  handleMaskedKeyDown = (event) => {
    const { key, metaKey, ctrlKey, altKey } = event;
    const navigationKeys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Tab",
      "Escape",
      "Enter",
    ];
    if (navigationKeys.includes(key)) return;
    if (key && key.length === 1 && !metaKey && !ctrlKey && !altKey) {
      this.setState(({ seedInput }) => ({ seedInput: seedInput + key }));
      event.preventDefault();
      return;
    }
    if (key === "Backspace") {
      this.setState(({ seedInput }) => ({ seedInput: seedInput.slice(0, -1) }));
      event.preventDefault();
      return;
    }

    if (key === "Delete") {
      this.setState(({ seedInput }) => ({ seedInput: seedInput.slice(0, -1) }));
      event.preventDefault();
    }
  };

  handleMaskedPaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData?.getData("text") || "";
    if (!pasted) return;
    this.setState(({ seedInput }) => ({ seedInput: seedInput + pasted }));
  };

  render() {
    const { actions } = this.props;
    const { seedInput } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <main>
          <img
            src={
              "https://signmycode.com/blog/wp-content/uploads/2023/07/yubikey-working-jpg.webp"
            }
            alt="yubi"
            style={{
              width: "auto",
              height: 100,
              display: "block",
              margin: "0 auto",
              rotate: "-90deg",
              marginBottom: 50,
            }}
          />
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="yubi otp code"
              value={"*".repeat(seedInput.length)}
              onChange={() => {}}
              onKeyDown={this.handleMaskedKeyDown}
              onPaste={this.handleMaskedPaste}
              style={{ minWidth: 260 }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="text"
            />
            <button type="button" onClick={() => actions.fromSeed(seedInput)}>
              play
            </button>
            <button type="button" onClick={actions.togglePlay}>
              pause
            </button>
          </div>
        </main>
        <footer></footer>
      </div>
    );
  }
}
export default App;
```

this is a class component. one bit of state holds the seed. the handlers are arrow functions so `this` stays bound to the component.

`actions` arrive as props from `main.jsx`. the ui doesn't know about audio and it only knows there's a `fromSeed` function.

## step 14: booting the app - `src/main.jsx`

the app starts from `src/main.jsx` which is what `index.html` points at. it does three jobs:

1. if the url has `?code=...` that becomes the seed so you can share your music
2. one time listeners on click touch and keydown call `resumeAudio` so the browser allows sound
3. render `<App />` with the actions wired in

create `src/main.jsx`.

```js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import init, { actions, resumeAudio } from "./dnb";
import store from "./store";
import { setSeed } from "./random";

const isProd = import.meta.env.PROD;
const url = new URL(window.location.href);
const seedParam = url.searchParams.get("code");
if (seedParam) {
  setSeed(seedParam);
}
init(isProd);
const acts = actions(isProd);

const resumeOnInteraction = () => {
  try {
    resumeAudio();
  } catch (_) {}
  window.removeEventListener("click", resumeOnInteraction);
  window.removeEventListener("touchstart", resumeOnInteraction);
  window.removeEventListener("keydown", resumeOnInteraction);
};
window.addEventListener("click", resumeOnInteraction, { once: true });
window.addEventListener("touchstart", resumeOnInteraction, { once: true });
window.addEventListener("keydown", resumeOnInteraction, { once: true });

createRoot(document.getElementById("root")).render(
  <App store={store} actions={acts} />,
);
```

`searchParams.get("code")` reads the query string. if a seed came in that way it's set before `init` runs.

the unlock listeners use `{ once: true }` and also remove the other two events so the first interaction unlocks the audio.

## step 15: run it!

your `src/` folder should now have these 17 files.

```
src/
- App.jsx
- audioengine.js
- catalog.js
- delay.js
- dnb.js
- hitmap.js
- loadsample.js
- main.jsx
- mixer.js
- pattern.js
- player.js
- random.js
- reverb.js
- sequencer.js
- store.js
- waveshaper.js
- worker.js
```

start the dev server.

```bash
npm run dev
```

open the url it gives u (usually `http://localhost:5173`). get a yubikey otp (check #yubi-spam on slack) anything into the input. hit play and you should hear drum and bass. same string means same beat every time.
