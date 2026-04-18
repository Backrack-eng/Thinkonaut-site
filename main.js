(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var siteHeader = document.getElementById("site-header");
  var headerScrollTicking = false;
  function updateHeaderScrollState() {
    headerScrollTicking = false;
    if (!siteHeader) return;
    if (window.scrollY > 12) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
  }
  if (siteHeader) {
    updateHeaderScrollState();
    window.addEventListener(
      "scroll",
      function () {
        if (!headerScrollTicking) {
          headerScrollTicking = true;
          window.requestAnimationFrame(updateHeaderScrollState);
        }
      },
      { passive: true }
    );
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && reveals.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  var howScroll = document.querySelector(".how-scroll");
  if (howScroll) {
    var step = 320;
    howScroll.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      var delta = e.key === "ArrowRight" ? step : -step;
      howScroll.scrollBy({ left: delta, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  var recordingStage = document.querySelector(".device-frame__media");
  var recordingFront = document.getElementById("recording-screen");

  if (recordingStage && recordingFront && !reduceMotion) {
    var recordScreens = [
      { src: "assets/Simulator Screenshot - Record-Brain.png", glow: "rgba(31, 200, 200, 0.22)" },
      { src: "assets/Simulator Screenshot - WriteNote.png", glow: "rgba(255, 255, 255, 0.18)" },
      { src: "assets/Simulator Screenshot - Record-Video.png", glow: "rgba(255, 154, 60, 0.18)" },
      { src: "assets/Simulator Screenshot - Record-Meeting.png", glow: "rgba(74, 42, 122, 0.22)" },
      { src: "assets/Simulator Screenshot - Record-Research.png", glow: "rgba(120, 170, 255, 0.18)" },
      { src: "assets/Simulator Screenshot - Record-Journal.png", glow: "rgba(180, 120, 255, 0.18)" },
      { src: "assets/Simulator Screenshot - Record-Story.png", glow: "rgba(255, 110, 160, 0.18)" },
      { src: "assets/Simulator Screenshot - Record-List.png", glow: "rgba(250, 172, 75, 0.18)" }
      
    ];

    var front = recordingFront;
    var back = front.cloneNode(false);
    back.removeAttribute("id");
    back.removeAttribute("fetchpriority");
    back.classList.remove("is-visible");
    back.classList.add("device-frame__img--back");
    recordingStage.appendChild(back);

    var currentIndex = 0;
    var showingFront = true;

    recordingStage.style.setProperty("--record-glow", recordScreens[0].glow);

    window.setInterval(function () {
      var nextIndex = (currentIndex + 1) % recordScreens.length;
      var incoming = showingFront ? back : front;
      var outgoing = showingFront ? front : back;

      incoming.src = recordScreens[nextIndex].src;
      recordingStage.style.setProperty("--record-glow", recordScreens[nextIndex].glow);

      incoming.classList.add("is-visible");
      outgoing.classList.remove("is-visible");

      currentIndex = nextIndex;
      showingFront = !showingFront;
    }, 9000);
  }

  if (!reduceMotion) {
    var flowCaptureTitle = document.querySelector(".flow-step--capture .flow-step__title");
    var flowCaptureText = document.querySelector(".flow-step--capture .flow-step__text");
    var flowUseTitle = document.querySelector(".flow-step--use .flow-step__title");
    var flowUseText = document.querySelector(".flow-step--use .flow-step__text");
    var flowItemEls = document.querySelectorAll(".flow-multi__item");

    if (flowCaptureTitle && flowCaptureText && flowUseTitle && flowUseText && flowItemEls.length === 3) {
      var flowExamples = [
        {
          capture: "“Need to figure out our Japan trip…”",
          captureText: "A half-formed thought, spoken or typed before the details scatter.",
          items: [
            { title: "Travel notes", text: "Dates, ideas, and loose planning" },
            { title: "Packing list", text: "Things to bring and not forget" },
            { title: "Places to go", text: "Stops, ideas, and must-see spots" }
          ],
          use: "Plan · Checklist · Itinerary",
          useText:
            "Ready to use later — whether you’re organizing a trip, keeping track of details, or building from the original idea."
        },
        {
          capture: "“Team meeting about Q2 strategy…”",
          captureText: "Real-time capture while the conversation is still moving.",
          items: [
            { title: "Meeting notes", text: "What was said, captured clearly" },
            { title: "Action items", text: "Owners, deadlines, next steps" },
            { title: "Key decisions", text: "What you agreed—and why it matters" }
          ],
          use: "Summary · Tasks · Direction",
          useText:
            "Ready to use later — whether you’re aligning the room, tracking owners, or deciding what happens next."
        },
        {
          capture: "“Idea for a video about burnout…”",
          captureText: "A quick line while the idea still has heat—before you second-guess it.",
          items: [
            { title: "Hook ideas", text: "Openings that land the topic" },
            { title: "Outline", text: "Beats and sections worth keeping" },
            { title: "Key points", text: "Claims and evidence to revisit" }
          ],
          use: "Script · Structure · Output",
          useText:
            "Ready to use later — whether you’re drafting, tightening, or turning it into something you can publish."
        }
      ];

      var flowFadeMs = 400;
      var flowIntervalMs = 6000;
      var flowIndex = 0;

      var flowTargets = [flowCaptureTitle, flowCaptureText, flowUseTitle, flowUseText].concat(
        Array.prototype.slice.call(flowItemEls)
      );

      function setFlowOpacity(o) {
        flowTargets.forEach(function (el) {
          el.style.opacity = String(o);
        });
      }

      window.setInterval(function () {
        flowIndex = (flowIndex + 1) % flowExamples.length;
        var next = flowExamples[flowIndex];

        setFlowOpacity(0);

        window.setTimeout(function () {
          flowCaptureTitle.textContent = next.capture;
          flowCaptureText.textContent = next.captureText;
          flowUseTitle.textContent = next.use;
          flowUseText.textContent = next.useText;

          flowItemEls.forEach(function (itemEl, i) {
            var row = next.items[i];
            var h = itemEl.querySelector("h4");
            var p = itemEl.querySelector("p");
            if (h && p && row) {
              h.textContent = row.title;
              p.textContent = row.text;
            }
          });

          setFlowOpacity(1);
        }, flowFadeMs);
      }, flowIntervalMs);
    }
  }
})();
