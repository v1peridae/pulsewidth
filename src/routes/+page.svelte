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

<div class="flex min-h-screen w-full flex-col bg-[#FAF3D9]">
  <header class="flex shrink-0 flex-col gap-6 px-6 pt-4 pb-2 md:flex-row md:items-center md:justify-between md:gap-6 md:px-10 md:pt-6 md:pb-4">
    <div class="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4 pl-15">
      <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer" class="inline-flex shrink-0 no-underline transition-opacity hover:opacity-80">
        <img src="/hackclublogo.png" alt="Hack Club" class="h-14 w-auto sm:h-16 md:h-20" />
      </a>
      <span class="shrink-0 font-helvetica text-3xl text-[#23231F] sm:text-4xl md:text-5xl">×</span>
      <a href="https://teenage.engineering/" target="_blank" rel="noopener noreferrer" class="inline-flex min-w-0 shrink-0 no-underline transition-opacity hover:opacity-80">
        <img src="/teenageengineeringlogo.png" alt="" class="h-30 w-auto max-w-40 sm:h-32 sm:max-w-48 md:h-34 md:max-w-none" />
      </a>
    </div>
    <img src="/logo.png" alt="" class="h-auto w-full max-w-[min(100%,25rem)] shrink-0 self-end md:w-100 md:max-w-none pr-10" />
  </header>

  <section class="mx-auto w-full max-w-7xl px-5 pb-10 pt-2 md:px-25 md:pb-12 md:pt-4">
    <h1 class="text-balance text-5xl font-helvetica font-bold leading-[100%] tracking-tight text-[#23231F]">
      <i>you ship</i> a project that turns the weirdest, most obscure input/data into music,
    </h1>

    <h1 class="text-balance mt-5 text-5xl font-helvetica font-bold leading-[100%] tracking-tight text-[#23231F]">
      <i>we ship</i> you your fave artist's posters, merch, tickets and more prizes worth over $300.
    </h1>

    <button class="mt-6 border-2 border-[#23231F] p-2 font-helvetica text-2xl font-bold leading-[100%] text-[#23231F] md:text-3xl">get started</button>
  </section>

  <main class="mx-auto grid min-w-0 w-full max-w-6xl flex-1 grid-cols-1 gap-10 overflow-x-clip px-5 pb-16 pt-2 md:grid-cols-2 md:gap-12 md:px-10 md:pt-4 md:items-start">
    <div class="flex min-w-0 flex-col px-1 md:px-0">
      <section>
        <p class="text-justify font-helvetica text-2xl leading-[100%] text-[#23231F] md:text-3xl">
          pulsewidth is a 6-week-long ysws where you turn weird non-musical data into music! it could be anything
          from <a href="https://yubidnb.vercel.app" target="_blank" rel="noopener noreferrer">yubikey otps to drum & bass music</a> to
          <a href="https://raphaelbastide.com/cascade/" target="_blank" rel="noopener noreferrer">css styling to a livecoded song</a>!
        </p>
      </section>

      <section class="mt-14">
        <h2 class="mb-6 font-helvetica text-4xl font-bold leading-[100%] text-[#23231F]">how to get started</h2>
        <div class="flex flex-col gap-4">
          <div class="flex items-start gap-3 sm:gap-5 md:gap-6">
            <span class="shrink-0 font-helvetica text-4xl font-bold leading-[100%] text-[#23231F] sm:text-5xl md:text-6xl">1</span>
            <a href="/" class="min-w-0 flex-1 border-2 border-[#23231F] px-4 py-4 text-[#23231F] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#23231F]/35 md:px-5 md:py-5" aria-label="inspo">
              <h3 class="mb-3 font-helvetica text-2xl font-bold leading-[100%] md:text-3xl">inspo</h3>
              <p class="text-justify font-helvetica text-lg leading-[100%] md:text-xl">not sure what to build? check out this page!</p>
            </a>
          </div>
          <div class="flex items-start gap-3 sm:gap-5 md:gap-6">
            <span class="shrink-0 font-helvetica text-4xl font-bold leading-[100%] text-[#23231F] sm:text-5xl md:text-6xl">2</span>
            <a href="/" class="min-w-0 flex-1 border-2 border-[#23231F] px-4 py-4 text-[#23231F] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#23231F]/35 md:px-5 md:py-5" aria-label="guides">
              <h3 class="mb-3 font-helvetica text-2xl font-bold leading-[100%] md:text-3xl">guides</h3>
              <p class="text-justify font-helvetica text-lg leading-[100%] md:text-xl">so you have an idea, now what? check out the guide here!</p>
            </a>
          </div>
          <div class="flex items-start gap-3 sm:gap-5 md:gap-6">
            <span class="shrink-0 font-helvetica text-4xl font-bold leading-[100%] text-[#23231F] sm:text-5xl md:text-6xl">3</span>
            <a href="/" class="min-w-0 flex-1 border-2 border-[#23231F] px-4 py-4 text-[#23231F] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#23231F]/35 md:px-5 md:py-5" aria-label="ship">
              <h3 class="mb-3 font-helvetica text-2xl font-bold leading-[100%] md:text-3xl">ship</h3>
              <p class="text-justify font-helvetica text-lg leading-[100%] md:text-xl">ready to ship? make sure your project follows the format on this page to ship it!</p>
            </a>
          </div>
        </div>
      </section>

      <section class="mt-14 px-1 md:px-0">
        <h2 class="mb-6 text-justify font-helvetica text-4xl font-bold leading-[100%] text-[#23231F]">faqs</h2>
        <div class="faq-wavy-divider flex flex-col">
          <details class="py-4 first:pt-0">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#23231F] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">how long is the event?</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#23231F] md:text-xl">six weeks. from xx to xx- enough time for you to go from an idea to a shipped project &lt;3.</p>
          </details>
          <details class="py-4">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#23231F] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">who is it for?</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#23231F] md:text-xl">
              anyone between 13 and 18 years old into experimental art and music, the indie music scene, or reverse-engineering and jailbreakingtech
              to make something cool! beginners are absolutely welcome and i’ll help you get unstuck.
            </p>
          </details>
          <details class="py-4">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#23231F] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">how do i track progress?</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#23231F] md:text-xl">
              when i'm reviewing your pulsewidth projects, i want to understand how you made your project. you'll be using <a href="https://hackatime.hackclub.com" target="_blank" rel="noopener noreferrer">hackatime</a> for time tracking
              and keep <span class="font-bold underline decoration-wavy underline-offset-[0.09em]">journal entries</span> to document what you tried and what you learned.
            </p>
          </details>
          <details class="py-4">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#23231F] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">where is the community?</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#23231F] md:text-xl">
              this is a hack club ysws and you can find other teens working on their pulsewidth projects
              in the #pulsewidth channel on the hack club slack!
            </p>
          </details>
          <details class="py-4">
            <summary class="cursor-pointer list-none font-helvetica text-xl font-bold leading-[100%] text-[#23231F] marker:content-none md:text-2xl [&::-webkit-details-marker]:hidden">i still have questions!</summary>
            <p class="mt-3 font-helvetica text-lg leading-[100%] text-[#23231F] md:text-xl">
              dm me on the hack club slack via <a href="https://hackclub.enterprise.slack.com/team/U06EMBJH71S">@lou</a> or email me at <a href="mailto:louisa@hackclub.com" class="text-[#23231F] underline underline-offset-2">louisa@hackclub.com</a>
            </p>
          </details>
        </div>
      </section>
    </div>

    <div class="flex min-w-0 flex-col overflow-x-clip px-1 md:px-0">
      <section>
        <h2 class="mb-2 text-justify font-helvetica text-4xl font-bold leading-[100%] text-[#23231F]">prizes</h2>
        <p class="mb-8 text-justify font-helvetica text-xl leading-[100%] text-[#23231F] md:text-2xl">ship a super cool project, show us how you did it and claim cool prizes!</p>
        <ul class="m-0 flex list-none flex-col gap-8 p-0">
          <li class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <button type="button" class="relative mx-auto h-52 w-[min(100%,14rem)] shrink-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#23231F]/35 sm:mx-0 sm:w-[min(100%,10.5rem)] sm:translate-x-3 md:h-48 md:w-[min(100%,11.5rem)]" onclick={onStackClick}>
              {#each [0, 1, 2] as i (i)}
                <img src={tier1PosterUrls[i]} alt="" data-poster-index={i} class="absolute left-0 top-0 max-h-44 w-auto max-w-32 select-none object-contain shadow-md ring-2 ring-[#FAF3D9] md:max-h-48 md:max-w-36" style:z-index={zFor(i)} style:transform={posterTransforms[i]} draggable="false" />
              {/each}
            </button>
            <div class="min-w-0 flex-1 basis-0 text-left sm:pl-4 md:pl-6">
              <p class="font-helvetica text-2xl font-bold leading-[100%] tracking-tight text-[#23231F] md:text-3xl">tier 1 (4-7 hours)</p>
              <p class="mt-2 font-helvetica text-xl leading-[100%] text-[#23231F] md:text-2xl">sticker sheet + poster of an artist or band of your choice.</p>
            </div>
          </li>

          <li class="grid min-w-0 w-full max-w-full grid-cols-1 gap-3 sm:grid-cols-5 sm:items-start sm:gap-3">
            <div class="min-w-0 text-left sm:col-span-3 sm:pr-0">
              <p class="font-helvetica text-2xl font-bold leading-[100%] tracking-tight text-[#23231F] md:text-3xl">tier 2 (8-11 hours)</p>
              <p class="mt-2 font-helvetica text-xl leading-[100%] text-[#23231F] md:text-2xl">cassette of a song of your choice + cassette player + sticker sheet.</p>
            </div>
            <img src="/cassettes.png" alt="" class="mx-auto h-auto w-full max-w-[min(100%,14rem)] min-w-0 object-contain sm:col-span-2 sm:mx-0 sm:max-w-none sm:w-full sm:justify-self-end -rotate-2" />
          </li>

          <li class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <img src="/po12.png" alt="" class="h-auto w-full max-w-[min(100%,11rem)] shrink-0 self-start object-contain sm:max-w-30 md:max-w-30 -rotate-3" />
            <div class="min-w-0 flex-1 basis-0 text-left sm:pl-4">
              <p class="font-helvetica text-2xl font-bold leading-[100%] tracking-tight text-[#23231F] md:text-3xl">tier 3 (12-19 hours)</p>
              <p class="mt-2 font-helvetica text-xl leading-[100%] text-[#23231F] md:text-2xl">
                sticker sheet + a pocket operator 12 made by teenage engineering! it's a mini synth that you can use to make music.
              </p>
            </div>
          </li>

          <li class="grid min-w-0 w-full max-w-full grid-cols-1 gap-3 sm:grid-cols-5 sm:items-start sm:gap-3">
            <div class="min-w-0 text-left sm:col-span-3 sm:pr-0">
              <p class="font-helvetica text-2xl font-bold leading-[100%] tracking-tight text-[#23231F] md:text-3xl">tier 4 (20+ hours)</p>
              <p class="mt-2 font-helvetica text-xl leading-[100%] text-[#23231F] md:text-2xl">sticker sheet + concert tickets and/or merch for an artist or band of your choice.</p>
            </div>
            <div class="relative mx-auto h-44 min-h-0 w-[min(100%,12rem)] min-w-0 max-w-full justify-self-end overflow-x-clip overflow-y-visible sm:col-span-2 sm:mx-0 sm:h-40 sm:w-full sm:justify-self-stretch md:h-44">
              {#each [0, 1, 2] as i (i)}
                <img src={tier4TicketUrls[i]} alt="" class="pointer-events-none absolute left-0 top-0 h-auto max-h-32 w-full max-w-full select-none object-contain object-left shadow-md ring-2 ring-[#FAF3D9] sm:max-h-28 md:max-h-32" style:z-index={30 - i * 10} style:transform={tier4TicketTransforms[i]} style:transform-origin="center center" draggable="false" />
              {/each}
            </div>
          </li>
        </ul>

        <div class="mt-12 border-2 border-[#23231F] p-4">
          <p class="font-helvetica text-2xl font-bold leading-[100%] text-[#23231F] md:text-3xl">special prize :)</p>
          <p class="mt-3 font-helvetica text-xl leading-[100%] text-[#23231F] md:text-2xl">
            our friends at teenage engineering have offered the best project (from peer voting) one of their high end <strong>synthesizers</strong>
          </p>
          <img src="/synth.png" alt="" class="mt-6 mx-auto h-auto w-[60%] object-contain" />
          <p class="mt-3 text-center font-helvetica text-base leading-[100%] text-[#23231F]/85">this is the EP-40 riddim, it's worth over $330!</p>
        </div>
      </section>
    </div>
  </main>
</div>
