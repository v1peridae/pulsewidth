<script lang="ts">
  const tier1PosterUrls = [
    '/posters/poster3.jpeg',
    '/posters/poster2.jpeg',
    '/posters/poster1.jpeg',
  ] as const;

  const tier4TicketUrls = ['/ticket.jpeg', '/ticket3.jpeg', '/ticket2.jpeg'] as const;

  const tier4TicketTransforms: Record<number, string> = {
    0: 'rotate(0deg) translate(0, 0)',
    1: 'rotate(-20deg) translate(1px, 18px)',
    2: 'rotate(-28deg) translate(6px, 36px)',
  };

  let stackOrder = $state([2, 1, 0]);
  const posterTransforms: Record<number, string> = {
    0: 'rotate(-6deg) translate(0, 0)',
    1: 'rotate(5deg) translate(22px, 4px)',
    2: 'rotate(-4deg) translate(52px, 8px)',
  };

  const inspoItems = [
    { image: '/inspo/twotone.png', name: 'twotone', site: 'twotone.io', url: 'https://twotone.io' },
    { image: '/inspo/trainjazz.png', name: 'train jazz', site: 'trainjazz.com', url: 'https://www.trainjazz.com' },
    { image: '/inspo/cascade.png', name: 'cascade', site: 'raphaelbastide.com/cascade', url: 'https://raphaelbastide.com/cascade/' },
    { image: '/inspo/yubidnb.png', name: 'yubidnb', site: 'yubidnb.vercel.app', url: 'https://yubidnb.vercel.app' },
    { image: '/inspo/galactic.jpg', name: 'galactic center sonification', site: 'youtube.com', url: 'https://youtu.be/9YIERCD5PYY' },
    { image: '/inspo/barcoders.jpg', name: 'barcoders jamming', site: 'youtube.com', url: 'https://youtu.be/bOfpQt4KFCc' },
  ] as const;

  let carouselEl = $state<HTMLDivElement>();

  function scrollCarousel(direction: -1 | 1) {
    if (!carouselEl) return;
    const card = carouselEl.querySelector('a');
    const step = card ? card.getBoundingClientRect().width + 24 : carouselEl.clientWidth;
    carouselEl.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  function zFor(posterIndex: number) { return 10 + stackOrder.indexOf(posterIndex) * 10; }
  function bringToFront(posterIndex: number) { stackOrder = [...stackOrder.filter((i) => i !== posterIndex), posterIndex]; }
  function onStackClick(e: MouseEvent) {
    const hits = document.elementsFromPoint(e.clientX, e.clientY);
    const posterHits = hits.filter((el): el is HTMLElement => el instanceof HTMLElement && el.dataset.posterIndex !== undefined);
    if (posterHits.length === 0) return;
    const bottomAtPoint = posterHits[posterHits.length - 1];
    const idx = Number(bottomAtPoint.dataset.posterIndex);
    if (!Number.isNaN(idx)) bringToFront(idx);
  }
</script>

<div class="flex min-h-screen w-full flex-col overflow-x-clip bg-[#EFEDFA]">
  <header class="shrink-0 pr-3 pt-3 md:pr-6 md:pt-6">
    <div class="w-full max-w-3xl bg-[#C8CD11] px-6 pt-2 pb-2 md:px-14 md:pt-2 md:pb-2">
      <h1 class="font-helvetica text-6xl text-right font-bold italic leading-[90%] tracking-tight text-[#8A84EC] sm:text-7xl md:text-[7rem]">pulsewidth</h1>
      <p class="mt-4 font-bold italic text-right font-helvetica text-2xl leading-[110%] text-[#8F8DC5] md:text-3xl">21 july - 5 aug</p>
      <p class="mt-1 font-bold italic text-right font-helvetica text-lg leading-[110%] text-[#8F8DC5] md:text-xl">
        a <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer" class="text-[#8F8DC5] no-underline hover:underline">hack club</a> x <a href="https://teenage.engineering" target="_blank" rel="noopener noreferrer" class="text-[#8F8DC5] no-underline hover:underline">teenage engineering</a> program
        </p>
    </div>
  </header>

  <section class="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-10 md:px-25 md:pb-12 md:pt-14">
    <span aria-hidden="true" class="pointer-events-none absolute right-2 top-0 hidden select-none font-helvetica text-[9rem] font-bold leading-none text-[#C8CD11] md:block">*</span>
    <span aria-hidden="true" class="pointer-events-none absolute left-4 bottom-16 hidden select-none font-helvetica text-8xl font-bold leading-none text-[#C8CD11] md:block">+</span>
    <p class="text-balance text-5xl font-helvetica font-bold leading-[110%] tracking-tight text-[#6C8CE8]">
      <i>you make</i> a project that turns the weirdest, most obscure <span class=" bg-[#C8CD11] px-1.5 py-0 text-[#EFEDFA]">input/data</span> into <span class=" bg-[#C8CD11] px-1.5 py-0.5 text-[#EFEDFA]">music</span>,
    </p>

    <p class="text-balance mt-5 text-5xl font-helvetica font-bold text-right leading-[110%] tracking-tight text-[#6C8CE8]">
      <i>we send</i> you your fave artist's posters, merch, tickets and more prizes worth over <span class=" bg-[#C8CD11] px-1.5 py-0.5 text-[#EFEDFA]">$300</span>.
    </p>

    <div class="mt-6 flex flex-wrap items-center gap-4">
      <a
        href="https://hackclub.enterprise.slack.com/archives/C0AS9JJ5E77"
        class="inline-flex bg-[#6C8CE8] px-4 py-2 font-helvetica text-2xl font-bold italic leading-[100%] text-[#EFEDFA] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFEDFA]/35 md:text-3xl"
        >get started</a>
      <button
        onclick={() => window.open("https://forms.hackclub.com/t/1GWKCYdxcHus", "_blank")}
        type="button"
        class="cursor-pointer bg-[#6C8CE8] px-4 py-2 font-helvetica text-2xl font-bold italic leading-[100%] text-[#EFEDFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFEDFA]/35 md:text-3xl"
      >
        submit
      </button>
    </div>
  </section>

  <main class="mx-auto grid min-w-0 w-full max-w-6xl flex-1 grid-cols-1 gap-10 px-5 pb-16 pt-2 md:grid-cols-2 md:gap-12 md:px-10 md:pt-4 md:items-start">
    <div class="flex min-w-0 flex-col px-1 md:px-0">
      <section>
        <p class="text-justify font-helvetica text-2xl leading-[100%] text-[#6C8CE8] md:text-3xl">
          pulsewidth is a 2 week-long hack club ysws where you turn weird non-musical data into music! <br><br> you can make anything
          from <a href="https://yubidnb.vercel.app" target="_blank" rel="noopener noreferrer">yubikey otps to drum & bass music</a> to
          <a href="https://raphaelbastide.com/cascade/" target="_blank" rel="noopener noreferrer">css styling to a livecoded song</a>
          to turning someone's tweet into music to turning barcodes to a song and so so many more ideas!<br><br> your project simply needs to take unusual input that usually isn't musical and turn that into musical output to qualify.<br><br> it could be a website, hardware, something in your cli or anything you can think of!
        </p>
      </section>

      <section class="mt-14 scroll-mt-6" id="how-to-get-started">
        <h2 class="mb-6 inline-block bg-[#C8CD11] px-2 py-1 font-helvetica text-4xl font-bold italic leading-[100%] text-[#8A84EC]">how to get started</h2>
        <div class="flex flex-col gap-4">
          <div class="flex items-start gap-3 sm:gap-5 md:gap-6">
            <span class="shrink-0 font-helvetica text-4xl font-bold leading-[100%] text-[#6C8CE8] sm:text-5xl md:text-6xl">0</span>
            <a href="https://youtu.be/grriwsX5mIo" target="_blank" rel="noopener noreferrer" class="min-w-0 flex-1 border-2 border-[#C8CD11] px-4 py-4 text-[#6C8CE8] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C8CE8]/35 md:px-5 md:py-5" aria-label="hackatime">
              <h3 class="mb-3 font-helvetica text-2xl font-bold leading-[100%] md:text-3xl">before you build</h3>
              <p class="text-justify font-helvetica text-lg leading-[100%] md:text-xl">
                set up hackatime from here to help track your progress.</p>
            </a>
          </div>

          <div class="flex items-start gap-3 sm:gap-5 md:gap-6">
            <span class="shrink-0 font-helvetica text-4xl font-bold leading-[100%] text-[#6C8CE8] sm:text-5xl md:text-6xl">1</span>
            <a href="#inspo" class="min-w-0 flex-1 border-2 border-[#C8CD11] px-4 py-4 text-[#6C8CE8] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C8CE8]/35 md:px-5 md:py-5" aria-label="inspo">
              <h3 class="mb-3 font-helvetica text-2xl font-bold leading-[100%] md:text-3xl">inspirstion</h3>
              <p class="text-justify font-helvetica text-lg leading-[100%] md:text-xl">not sure what to build? check out this page with a bunch of inspo!</p>
            </a>
          </div>

          <div class="flex items-start gap-3 sm:gap-5 md:gap-6">
            <span class="shrink-0 font-helvetica text-4xl font-bold leading-[100%] text-[#6C8CE8] sm:text-5xl md:text-6xl">2</span>
            <a href="/guide" class="min-w-0 flex-1 border-2 border-[#C8CD11] px-4 py-4 text-[#6C8CE8] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C8CE8]/35 md:px-5 md:py-5" aria-label="guides">
              <h3 class="mb-3 font-helvetica text-2xl font-bold leading-[100%] md:text-3xl">guides</h3>
              <p class="text-justify font-helvetica text-lg leading-[100%] md:text-xl">so you have an idea, now what? check out the guide here!</p>
            </a>
          </div>
          <div class="flex items-start gap-3 sm:gap-5 md:gap-6">
            <span class="shrink-0 font-helvetica text-4xl font-bold leading-[100%] text-[#6C8CE8] sm:text-5xl md:text-6xl">3</span>
            <a href="/" class="min-w-0 flex-1 border-2 border-[#C8CD11] px-4 py-4 text-[#6C8CE8] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C8CE8]/35 md:px-5 md:py-5" aria-label="ship">
              <h3 class="mb-3 font-helvetica text-2xl font-bold leading-[100%] md:text-3xl">ship</h3>
              <p class="text-justify font-helvetica text-lg leading-[100%] md:text-xl">ready to ship? make sure your project follows the format on this page to ship it!</p>
            </a>
          </div>
        </div>
      </section>

      <section class="relative mt-14 px-1 md:px-0">
        <span aria-hidden="true" class="pointer-events-none absolute -left-14 top-8 hidden select-none font-helvetica text-6xl font-bold leading-none text-[#C8CD11] md:block">+</span>
        <h2 class="mb-6 inline-block bg-[#C8CD11] px-2 py-1 font-helvetica text-4xl font-bold italic leading-[100%] text-[#8A84EC]">faqs</h2>
        <div class="faq-wavy-divider flex flex-col">
          <details class="py-4 first:pt-0">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#6C8CE8] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">how long is the event?</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#6C8CE8] md:text-xl">from 21 july to 5 aug - enough time for you to go from an idea to a shipped project &lt;3.</p>
          </details>
          <details class="py-4">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#6C8CE8] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">is this legit?</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#6C8CE8] md:text-xl">
              yes! <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer">hack club</a> is a 501(c)(3) nonprofit and network of 100k+ technical high schoolers. in the past few years, we've partnered 
              with <a href="https://github.com" target="_blank" rel="noopener noreferrer">github</a> to run summer of making, hosted the world's longest hackathon on land, and ran canada's largest high school hackathon.
            </p>
          </details>
          <details class="py-4">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#6C8CE8] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">who is it for?</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#6C8CE8] md:text-xl">
              anyone 13-18 years old into experimental art and music, the indie music scene, or reverse-engineering and jailbreakingtech
              to make something cool! beginners are absolutely welcome and i’ll help you get unstuck.
            </p>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#6C8CE8] md:text-xl">
              19 or older? you can’t participate as a teen in this ysws, but you can refer people to the program !! 
            </p>
          </details>
          <details class="py-4">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#6C8CE8] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">how do i track progress?</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#6C8CE8] md:text-xl">
              when i'm reviewing your pulsewidth projects, i want to understand how you made your project. you'll be using <a href="https://hackatime.hackclub.com" target="_blank" rel="noopener noreferrer">hackatime</a> for time tracking
              and keep <span class=" underline underline-offset-[0.09em]">journal entries on the readme</span> to document what you tried, added and removed and learned.
            </p>
          </details>
          <details class="py-4">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#6C8CE8] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">where are others teens working on their projects?</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#6C8CE8] md:text-xl">
              this is a hack club ysws and you can find other teens working on their pulsewidth projects
              in the <a href="https://hackclub.enterprise.slack.com/archives/C0AS9JJ5E77" target="_blank" rel="noopener noreferrer">#pulsewidth</a> channel on the hack club slack!
            </p>
          </details>
          <details class="py-4">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#6C8CE8] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">i still have questions!</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#6C8CE8] md:text-xl">
              dm me on the hack club slack via <a href="https://hackclub.enterprise.slack.com/team/U06EMBJH71S">@lou</a> or email me at <a href="mailto:louisa@hackclub.com" class="text-[#6C8CE8] underline underline-offset-2">louisa@hackclub.com</a>
            </p>
          </details>
        </div>
      </section>
    </div>

    <div class="flex min-w-0 flex-col px-1 md:px-0">
      <section class="relative">
        <span aria-hidden="true" class="pointer-events-none absolute -right-2 -top-6 hidden select-none font-helvetica text-7xl font-bold leading-none text-[#C8CD11] md:block">*</span>
        <h2 class="mb-2 inline-block bg-[#C8CD11] px-2 py-1 font-helvetica text-4xl font-bold italic leading-[100%] text-[#8A84EC]">prizes</h2>
        <p class="mb-4 text-justify font-helvetica text-xl leading-[100%] text-[#6C8CE8] md:text-2xl">ship a super cool project, show us how you did it and claim cool prizes!</p>
        <p class="mb-8 text-justify font-helvetica text-lg leading-[100%] text-[#6C8CE8] md:text-xl">(every tier includes a sticker sheet)</p>
        <ul class="m-0 flex list-none flex-col gap-8 p-0">
          <li class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <button type="button" class="relative mx-auto h-52 w-[min(100%,14rem)] shrink-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2
             focus-visible:ring-[#6C8CE8]/35 sm:mx-0 sm:w-[min(100%,10.5rem)] sm:translate-x-3 md:h-48 md:w-[min(100%,11.5rem)]" onclick={onStackClick}>
              {#each [0, 1, 2] as i (i)}
                <img src={tier1PosterUrls[i]} alt="" data-poster-index={i} class="absolute left-0 top-0 max-h-44 w-auto max-w-32 select-none object-contain ring-[#EFEDFA] ring-2
                md:max-h-48 md:max-w-36" style:z-index={zFor(i)} style:transform={posterTransforms[i]} draggable="false" />
              {/each}
            </button>
            <div class="min-w-0 flex-1 basis-0 text-left sm:pl-4 md:pl-6">
              <p class="font-helvetica text-2xl font-bold leading-[100%] tracking-tight text-[#6C8CE8] md:text-3xl">tier 1 (4-7 hours)</p>
              <p class="mt-2 font-helvetica text-xl leading-[100%] text-[#6C8CE8] md:text-2xl">poster of an artist or band of your choice.</p>
            </div>
          </li>

          <li class="grid min-w-0 w-full max-w-full grid-cols-1 gap-3 sm:grid-cols-5 sm:items-start sm:gap-3">
            <div class="min-w-0 text-left sm:col-span-3 sm:pr-0">
              <p class="font-helvetica text-2xl font-bold leading-[100%] tracking-tight text-[#6C8CE8] md:text-3xl">tier 2 (8-11 hours)</p>
              <p class="mt-2 font-helvetica text-xl leading-[100%] text-[#6C8CE8] md:text-2xl">cassette of a song of your choice + cassette player.</p>
            </div>
            <img src="/cassettes.png" alt="" class="mx-auto h-auto w-full max-w-[min(100%,14rem)] min-w-0 object-contain sm:col-span-2 sm:mx-0 sm:max-w-none sm:w-full sm:justify-self-end -rotate-2" />
          </li>

          <li class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <a href="https://teenage.engineering/store/po-12" target="_blank" rel="noopener noreferrer" class="inline-flex shrink-0 self-start no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C8CE8]/35">
              <img src="/po12.png" alt="" class="pointer-events-none h-auto w-full max-w-[min(100%,11rem)] object-contain sm:max-w-30 md:max-w-30 -rotate-3" />
            </a>
            <div class="min-w-0 flex-1 basis-0 text-left sm:pl-4">
              <p class="font-helvetica text-2xl font-bold leading-[100%] tracking-tight text-[#6C8CE8] md:text-3xl">tier 3 (12-19 hours)</p>
              <p class="mt-2 font-helvetica text-xl leading-[100%] text-[#6C8CE8] md:text-2xl">
                a pocket operator 12 made by teenage engineering! it's a mini synth that you can use to make music.
              </p>
            </div>
          </li>

          <li class="grid min-w-0 w-full max-w-full grid-cols-1 gap-3 sm:grid-cols-5 sm:items-start sm:gap-3">
            <div class="min-w-0 text-left sm:col-span-3 sm:pr-0">
              <p class="font-helvetica text-2xl font-bold leading-[100%] tracking-tight text-[#6C8CE8] md:text-3xl">tier 4 (20+ hours)</p>
              <p class="mt-2 font-helvetica text-xl leading-[100%] text-[#6C8CE8] md:text-2xl">concert tickets and/or merch for an artist or band of your choice.</p>
            </div>
            <div class="relative mx-auto h-44 min-h-0 w-[min(100%,12rem)] min-w-0 max-w-full justify-self-end overflow-x-clip overflow-y-visible sm:col-span-2 sm:mx-0 sm:h-40 sm:w-full sm:justify-self-stretch md:h-44">
              {#each [0, 1, 2] as i (i)}
                <img src={tier4TicketUrls[i]} alt="" class="pointer-events-none absolute left-0 top-0 h-auto max-h-32 w-full max-w-full select-none object-contain object-left ring-2 ring-[#EFEDFA] sm:max-h-28 md:max-h-32" 
                style:z-index={30 - i * 10} style:transform={tier4TicketTransforms[i]} style:transform-origin="center center" draggable="false" />
              {/each}
            </div>
          </li>
        </ul>

        <div class="mt-12 border-2 border-[#C8CD11] p-4">
          <p class="font-helvetica text-2xl font-bold leading-[100%] text-[#6C8CE8] md:text-3xl">special prize :)</p>
          <p class="mt-3 font-helvetica text-xl leading-[100%] text-[#6C8CE8] md:text-2xl">
            our friends at teenage engineering have offered the first 2 projects with 20+ hours tracked their high end <strong>synthesisers</strong>
          </p>
          <a href="https://teenage.engineering/store/" target="_blank" rel="noopener noreferrer" class="mt-6 mx-auto block w-[60%] max-w-full no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C8CE8]/35">
            <img src="/te.png" alt="" class="pointer-events-none h-auto w-full object-contain" />
          </a>
          <p class="mt-3 text-center font-helvetica text-base leading-[100%] text-[#6C8CE8]/85">each of these are worth over $330!</p>
        </div>
      </section>
    </div>
  </main>

  <section id="inspo" class="relative mx-auto w-full max-w-6xl scroll-mt-6 px-6 pb-16 md:px-10">
    <span aria-hidden="true" class="pointer-events-none absolute -top-10 right-8 hidden select-none font-helvetica text-8xl font-bold leading-none text-[#C8CD11] md:block">+</span>
    <span aria-hidden="true" class="pointer-events-none absolute bottom-4 -left-2 hidden select-none font-helvetica text-6xl font-bold leading-none text-[#C8CD11] md:block">*</span>

    <div class="mb-6 flex items-end justify-between gap-4">
      <h2 class="inline-block bg-[#C8CD11] px-2 py-1 font-helvetica text-4xl font-bold italic leading-[100%] text-[#8A84EC]">inspo</h2>
      
    </div>

    <div
      bind:this={carouselEl}
      class="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {#each inspoItems as item (item.name)}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          class="group flex w-[85%] shrink-0 snap-start flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C8CE8]/35 sm:w-[60%] md:w-[45%]"
        >
          <img src={item.image} alt="screenshot of {item.name}" class="aspect-16/10 w-full object-cover object-top" draggable="false" />
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 py-3">
            <span class="font-helvetica text-xl font-bold leading-[100%] text-[#6C8CE8] md:text-2xl">{item.name}</span>
            <span class="font-helvetica text-base leading-[100%] text-[#8F8DC5] group-hover:underline md:text-lg">{item.site}</span>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <footer class="border-t-2 border-[#C8CD11] bg-[#EFEDFA] px-5 py-8 md:px-10">
    <p class="mx-auto max-w-6xl text-center font-helvetica text-base leading-[140%] text-[#6C8CE8] md:text-lg">
      made with &lt; 3 and :3 by @<a href="https://github.com/v1peridae" target="_blank" rel="noopener noreferrer" class="text-[#6C8CE8]">v1peridae</a>
      , brought to you by <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer" class="text-[#6C8CE8]">hack club</a>.
    </p>
  </footer>
</div>
