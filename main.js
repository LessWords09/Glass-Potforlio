// Glass Morphism Portfolio - Main JavaScript
// Advanced interactive effects and animations

class GlassPortfolio {
  constructor() {
    this.particles = [];
    this.maxParticles = 80;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isLoaded = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initParticleSystem();
    this.initTypewriter();
    this.initScrollAnimations();
    this.initGlassEffects();
    this.initNavigation();
    this.initProjectCards();
    this.initSkillRadar();
    this.initContactForm();
    
    // Mark as loaded
    setTimeout(() => {
      this.isLoaded = true;
      document.body.classList.add('loaded');
    }, 1000);
  }

  setupEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener('resize', () => {
      this.handleResize();
    });

    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  // Particle System with p5.js-like functionality
  initParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.6';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    this.particleCanvas = canvas;
    this.particleCtx = ctx;
    
    this.resizeCanvas();
    this.createParticles();
    this.animateParticles();
  }

  resizeCanvas() {
    this.particleCanvas.width = window.innerWidth;
    this.particleCanvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.3 + 0.1,
        color: this.getRandomGlassColor(),
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  getRandomGlassColor() {
    const colors = [
      'rgba(59, 130, 246, ',
      'rgba(20, 184, 166, ',
      'rgba(139, 92, 246, ',
      'rgba(255, 255, 255, '
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animateParticles() {
    this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
    
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.pulse += 0.02;
      
      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100 * 0.001;
        particle.vx -= dx * force;
        particle.vy -= dy * force;
      }
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.particleCanvas.width;
      if (particle.x > this.particleCanvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.particleCanvas.height;
      if (particle.y > this.particleCanvas.height) particle.y = 0;
      
      // Draw particle with glow effect
      const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5;
      const opacity = particle.opacity + Math.sin(particle.pulse) * 0.1;
      
      // Outer glow
      this.particleCtx.beginPath();
      this.particleCtx.arc(particle.x, particle.y, pulseSize * 2, 0, Math.PI * 2);
      this.particleCtx.fillStyle = particle.color + (opacity * 0.3) + ')';
      this.particleCtx.fill();
      
      // Main particle
      this.particleCtx.beginPath();
      this.particleCtx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
      this.particleCtx.fillStyle = particle.color + opacity + ')';
      this.particleCtx.fill();
      
      // Connect nearby particles
      this.connectNearbyParticles(particle, index);
    });
    
    requestAnimationFrame(() => this.animateParticles());
  }

  connectNearbyParticles(particle, index) {
    for (let i = index + 1; i < this.particles.length; i++) {
      const other = this.particles[i];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 80) {
        const opacity = (80 - distance) / 80 * 0.1;
        this.particleCtx.beginPath();
        this.particleCtx.moveTo(particle.x, particle.y);
        this.particleCtx.lineTo(other.x, other.y);
        this.particleCtx.strokeStyle = 'rgba(255, 255, 255, ' + opacity + ')';
        this.particleCtx.lineWidth = 1;
        this.particleCtx.stroke();
      }
    }
  }

  // Typewriter Effect
  initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter-text');
    if (!typewriterElement) return;
    
    const texts = [
      'Full-Stack Developer',
      'UI/UX Enthusiast',
      'Problem Solver',
      'Tech Innovator'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeText = () => {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let typeSpeed = isDeleting ? 50 : 100;
      
      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
      }
      
      setTimeout(typeText, typeSpeed);
    };
    
    typeText();
  }

  // Scroll Animations
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // Glass Effects
  initGlassEffects() {
    // Glass card hover effects
    document.querySelectorAll('.glass-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        anime({
          targets: e.target,
          scale: 1.05,
          rotateX: 5,
          rotateY: 5,
          duration: 300,
          easing: 'easeOutQuart'
        });
      });
      
      card.addEventListener('mouseleave', (e) => {
        anime({
          targets: e.target,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          duration: 300,
          easing: 'easeOutQuart'
        });
      });
    });
  }

  // Navigation
  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
      
      link.addEventListener('click', (e) => {
        if (href === currentPage) {
          e.preventDefault();
          return;
        }
        
        // Smooth page transition
        document.body.classList.add('page-transition');
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    });
  }

  // Project Cards
  initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const projectId = card.dataset.project;
        this.showProjectModal(projectId);
      });
    });
  }

  showProjectModal(projectId) {
    // Create modal with glass effects
    const modal = document.createElement('div');
    modal.className = 'glass-modal';
    modal.innerHTML = `
      <div class="glass-modal-content">
        <div class="glass-modal-header">
          <h2>Project Details</h2>
          <button class="glass-close-btn">&times;</button>
        </div>
        <div class="glass-modal-body">
          <p>Loading project ${projectId}...</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal in
    anime({
      targets: modal,
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutQuart'
    });
    
    // Close modal functionality
    modal.querySelector('.glass-close-btn').addEventListener('click', () => {
      anime({
        targets: modal,
        opacity: [1, 0],
        duration: 300,
        easing: 'easeOutQuart',
        complete: () => modal.remove()
      });
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.querySelector('.glass-close-btn').click();
      }
    });
  }

  // Skill Radar Chart
  initSkillRadar() {
    const radarContainer = document.getElementById('skill-radar');
    if (!radarContainer) return;
    
    const skillData = [
      { name: 'Frontend', value: 90 },
      { name: 'Backend', value: 85 },
      { name: 'Mobile', value: 75 },
      { name: 'DevOps', value: 70 },
      { name: 'Design', value: 80 },
      { name: 'Management', value: 65 }
    ];
    
    this.createSkillRadar(skillData);
  }

  createSkillRadar(data) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementById('skill-radar').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const angleStep = (Math.PI * 2) / data.length;
    
    // Draw radar grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      for (let j = 0; j < data.length; j++) {
        const angle = j * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius * i / 5);
        const y = centerY + Math.sin(angle) * (radius * i / 5);
        
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw data points
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    data.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const value = skill.value / 100;
      const x = centerX + Math.cos(angle) * (radius * value);
      const y = centerY + Math.sin(angle) * (radius * value);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw skill point
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.fill();
      ctx.restore();
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    
    data.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const labelX = centerX + Math.cos(angle) * (radius + 30);
      const labelY = centerY + Math.sin(angle) * (radius + 30);
      
      ctx.fillText(skill.name, labelX, labelY);
    });
  }

  // Contact Form
  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(form);
    });
    
    // Form field animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', (e) => {
        if (!e.target.value) {
          e.target.parentElement.classList.remove('focused');
        }
      });
    });
  }

  handleFormSubmit(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Animate button
    anime({
      targets: submitBtn,
      scale: [1, 0.95, 1],
      duration: 200,
      easing: 'easeInOutQuart'
    });
    
    // Simulate form submission
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      this.showSuccessMessage();
      form.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }, 2000);
  }

  showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message glass';
    message.innerHTML = `
      <div class="success-content">
        <div class="success-icon">✓</div>
        <p>Message sent successfully!</p>
      </div>
    `;
    
    document.body.appendChild(message);
    
    anime({
      targets: message,
      opacity: [0, 1],
      translateY: [-50, 0],
      duration: 500,
      easing: 'easeOutQuart',
      complete: () => {
        setTimeout(() => {
          anime({
            targets: message,
            opacity: [1, 0],
            translateY: [0, -50],
            duration: 500,
            easing: 'easeOutQuart',
            complete: () => message.remove()
          });
        }, 3000);
      }
    });
  }

  // Utility functions
  handleResize() {
    if (this.particleCanvas) {
      this.resizeCanvas();
      this.createParticles();
    }
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero-section');
    if (hero) {
      hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
    
    // Glass header blur effect
    const header = document.querySelector('.glass-header');
    if (header) {
      const blurAmount = Math.min(scrollY / 100, 20);
      header.style.backdropFilter = `blur(${blurAmount}px)`;
    }
  }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GlassPortfolio();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }
  
  .animate-on-scroll.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .page-transition {
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
  }
  
  .success-message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 20px;
    border-radius: 12px;
    z-index: 1000;
    max-width: 300px;
  }
  
  .success-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .success-icon {
    width: 24px;
    height: 24px;
    background: rgba(34, 197, 94, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }
  
  .glass-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
  }
  
  .glass-modal-content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 32px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .glass-close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background 0.3s ease;
  }
  
  .glass-close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

document.head.appendChild(style);