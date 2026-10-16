(function initInfiniteScroll() {
  const checkForContainer = setInterval(() => {
    const container = document.getElementById('contact-container');
    const track = document.getElementById('contact-track');
    
    if (!container || !track) return;
    
    clearInterval(checkForContainer);

    const baseGroup = track.querySelector('.contact-group');
    if (!baseGroup) return;

    // Fill screen with enough clones so there are no empty gaps
    function fillTrack() {
      // Keep only the original group
      while (track.children.length > 1) {
        track.removeChild(track.lastChild);
      }

      const groupWidth = baseGroup.offsetWidth;
      const screenWidth = container.offsetWidth || window.innerWidth;

      if (groupWidth === 0) return;

      // Ensure total track width is at least screen width + 1 full extra group width
      const neededCopies = Math.max(2, Math.ceil(screenWidth / groupWidth) + 1);

      for (let i = 1; i < neededCopies; i++) {
        const clone = baseGroup.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }
    }

    fillTrack();
    window.addEventListener('resize', fillTrack);

    let offset = 0;
    const speed = 0.8; // Pixels per frame

    function step() {
      offset += speed;
        
      const groupWidth = baseGroup.offsetWidth;

      // Reset precisely when scrolling past one single group width
      if (groupWidth > 0 && offset >= groupWidth) {
        offset %= groupWidth;
      }

      track.style.transform = `translateX(-${offset}px)`;
      

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, 50);
})();