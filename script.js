(function () {
    var themeToggle = document.getElementById("themeToggle");

    function setTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        if (themeToggle) {
            themeToggle.textContent = theme === "light" ? "☾" : "☀";
        }
    }

    var savedTheme = localStorage.getItem("portfolio-theme");
    var preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    setTheme(savedTheme || preferredTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var current = document.body.getAttribute("data-theme") || "dark";
            var next = current === "dark" ? "light" : "dark";
            setTheme(next);
            localStorage.setItem("portfolio-theme", next);
        });
    }

    var track = document.getElementById("skillsTrack");
    var group = document.getElementById("skillsGroup");
    var prevBtn = document.querySelector(".skills-nav.prev");
    var nextBtn = document.querySelector(".skills-nav.next");

    if (!track || !group) {
        return;
    }

    var clonedGroup = group.cloneNode(true);
    clonedGroup.setAttribute("aria-hidden", "true");
    clonedGroup.querySelectorAll("img").forEach(function (img) {
        img.setAttribute("alt", "");
    });
    track.appendChild(clonedGroup);

    var offset = 0;
    var step = 220;
    var speed = 0.5;
    var paused = false;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function getGroupWidth() {
        var gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        return group.getBoundingClientRect().width + gap;
    }

    function normalizeOffset() {
        var width = getGroupWidth();
        if (!width) {
            return;
        }

        while (offset >= width) {
            offset -= width;
        }

        while (offset < 0) {
            offset += width;
        }
    }

    function paint() {
        track.style.transform = "translateX(" + (-offset) + "px)";
    }

    function move(direction) {
        offset += direction * step;
        normalizeOffset();
        paint();
    }

    function animate() {
        if (!paused && !reducedMotion) {
            offset += speed;
            normalizeOffset();
            paint();
        }

        window.requestAnimationFrame(animate);
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            move(-1);
        });
        prevBtn.addEventListener("mouseenter", function () {
            paused = true;
        });
        prevBtn.addEventListener("mouseleave", function () {
            paused = false;
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            move(1);
        });
        nextBtn.addEventListener("mouseenter", function () {
            paused = true;
        });
        nextBtn.addEventListener("mouseleave", function () {
            paused = false;
        });
    }

    track.addEventListener("mouseenter", function () {
        paused = true;
    });

    track.addEventListener("mouseleave", function () {
        paused = false;
    });

    track.addEventListener("focusin", function () {
        paused = true;
    });

    track.addEventListener("focusout", function () {
        paused = false;
    });

    window.addEventListener("resize", function () {
        normalizeOffset();
        paint();
    });

    paint();
    animate();
})();
