const SoundEngine = {
    ctx: null,
    init() { if(!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    play(type) {
        this.init();
        if(this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.connect(g); g.connect(this.ctx.destination);
        const t = this.ctx.currentTime;
        
        if(type === 'hover') {
            osc.frequency.setValueAtTime(1000, t);
            g.gain.setValueAtTime(0.01, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            osc.start(); osc.stop(t + 0.05);
        }
        if(type === 'click') {
            osc.frequency.setValueAtTime(440, t);
            osc.frequency.exponentialRampToValueAtTime(220, t + 0.1);
            g.gain.setValueAtTime(0.05, t);
            osc.start(); osc.stop(t + 0.1);
        }
        if(type === 'heavy') {
            osc.frequency.setValueAtTime(120, t);
            osc.frequency.exponentialRampToValueAtTime(40, t + 0.3);
            g.gain.setValueAtTime(0.1, t);
            osc.start(); osc.stop(t + 0.3);
        }
        if(type === 'whoosh') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(200, t + 0.25);
            g.gain.setValueAtTime(0.06, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            osc.start(); osc.stop(t + 0.25);
        }
    }
};

function togglePlayer() {
    const layer = document.getElementById('player-layer');
    if (!layer) return;
    const isHidden = layer.classList.contains('hidden');
    layer.classList.toggle('hidden', !isHidden);
    layer.classList.toggle('flex', isHidden);
    document.body.style.overflow = isHidden ? 'hidden' : 'auto';
}

document.addEventListener('mouseover', (e) => {
    if(e.target.closest('button') || e.target.closest('.dock-btn') || e.target.closest('.card') || e.target.closest('a')) {
        SoundEngine.play('hover');
    }
});

document.addEventListener('click', (e) => {
    if(e.target.closest('a') && !e.target.closest('a').getAttribute('target')) {
        SoundEngine.play('click');
    }
});

// Scroll whoosh sound
let scrollTimeout;
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const diff = Math.abs(window.scrollY - lastScrollY);
    if (diff > 60) {
        SoundEngine.play('whoosh');
        lastScrollY = window.scrollY;
    }
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { lastScrollY = window.scrollY; }, 150);
});

// Initialize lucide icons
lucide.createIcons();
