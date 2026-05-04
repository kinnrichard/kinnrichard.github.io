const body = document.body

const btnTheme = document.querySelector('.fa-moon')
const btnHamburger = document.querySelector('.fa-bars')

const addThemeClass = (bodyClass, btnClass) => {
  body.classList.add(bodyClass)
  btnTheme.classList.add(btnClass)
}

const getBodyTheme = localStorage.getItem('portfolio-theme')
const getBtnTheme = localStorage.getItem('portfolio-btn-theme')

if (getBodyTheme) {
  body.classList.remove('light')
  addThemeClass(getBodyTheme, getBtnTheme)
}

const isDark = () => body.classList.contains('dark')

const setTheme = (bodyClass, btnClass) => {
	body.classList.remove(localStorage.getItem('portfolio-theme'))
	btnTheme.classList.remove(localStorage.getItem('portfolio-btn-theme'))

  addThemeClass(bodyClass, btnClass)

	localStorage.setItem('portfolio-theme', bodyClass)
	localStorage.setItem('portfolio-btn-theme', btnClass)
}

const toggleTheme = () =>
	isDark() ? setTheme('light', 'fa-moon') : setTheme('dark', 'fa-sun')

btnTheme.addEventListener('click', toggleTheme)

// Hamburger menu
const displayList = () => {
	const navUl = document.querySelector('.nav__list')

	if (btnHamburger.classList.contains('fa-bars')) {
		btnHamburger.classList.remove('fa-bars')
		btnHamburger.classList.add('fa-times')
		navUl.classList.add('display-nav-list')
	} else {
		btnHamburger.classList.remove('fa-times')
		btnHamburger.classList.add('fa-bars')
		navUl.classList.remove('display-nav-list')
	}
}

btnHamburger.addEventListener('click', displayList)

// Close mobile menu when a nav link is clicked
document.querySelectorAll('.link--nav').forEach((link) => {
  link.addEventListener('click', () => {
    const navUl = document.querySelector('.nav__list')
    if (navUl.classList.contains('display-nav-list')) {
      btnHamburger.classList.remove('fa-times')
      btnHamburger.classList.add('fa-bars')
      navUl.classList.remove('display-nav-list')
    }
  })
})

// Scroll to top button
const btnScrollTop = document.querySelector('.scroll-top')

const scrollUp = () => {
	if (
		body.scrollTop > 500 ||
		document.documentElement.scrollTop > 500
	) {
		btnScrollTop.classList.add('show')
		btnScrollTop.style.display = 'flex'
	} else {
		btnScrollTop.classList.remove('show')
		setTimeout(() => {
			if (!btnScrollTop.classList.contains('show')) {
				btnScrollTop.style.display = 'none'
			}
		}, 300)
	}
}

document.addEventListener('scroll', scrollUp)

// Active nav highlight on scroll
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('.link--nav')

const highlightNav = () => {
  const scrollY = window.scrollY + 200

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute('id')

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove('active')
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active')
        }
      })
    }
  })
}

window.addEventListener('scroll', highlightNav)

// Scroll animations with stagger
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target
      const delay = parseInt(el.dataset.delay) || 0
      setTimeout(() => {
        el.classList.add('visible')
      }, delay)
      observer.unobserve(el)
    }
  })
}, observerOptions)

// Stagger project cards within the grid
document.querySelectorAll('.projects__grid').forEach((grid) => {
  grid.querySelectorAll('.fade-in').forEach((el, i) => {
    el.dataset.delay = i * 100
    observer.observe(el)
  })
})

// Stagger skill categories
document.querySelectorAll('.skills__categories').forEach((container) => {
  container.querySelectorAll('.scale-in').forEach((el, i) => {
    el.dataset.delay = i * 120
    observer.observe(el)
  })
})

// Observe all other animated elements
document.querySelectorAll('.fade-in, .scale-in, .slide-in-left, .slide-in-right').forEach((el) => {
  if (!el.dataset.delay) {
    el.dataset.delay = 0
  }
  if (!el.classList.contains('visible')) {
    observer.observe(el)
  }
})

// Counter animation for stats
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat__number')
      counters.forEach((counter) => {
        const target = parseInt(counter.dataset.target)
        const duration = 1500
        const startTime = performance.now()

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          counter.textContent = Math.round(eased * target)

          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }

        requestAnimationFrame(animate)
      })
      counterObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.5 })

const statsSection = document.querySelector('.stats')
if (statsSection) {
  counterObserver.observe(statsSection)
}

// Typing effect
const typingElement = document.getElementById('typing-text')
if (typingElement) {
  const phrases = [
    'Full Stack Developer',
    'AI-Assisted Development',
    'Next.js + NestJS',
    'Building the Future'
  ]
  let phraseIndex = 0
  let charIndex = 0
  let isDeleting = false
  let typingSpeed = 80

  const type = () => {
    const currentPhrase = phrases[phraseIndex]

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1)
      charIndex--
      typingSpeed = 40
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1)
      charIndex++
      typingSpeed = 80
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
      typingSpeed = 500
    }

    setTimeout(type, typingSpeed)
  }

  setTimeout(type, 800)
}

// Smooth parallax on scroll for hero section
let ticking = false
const hero = document.querySelector('.about')

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.scrollY
      if (hero && scrolled < 800) {
        hero.style.transform = `translateY(${scrolled * 0.15}px)`
        hero.style.opacity = Math.max(1 - scrolled / 700, 0)
      }
      ticking = false
    })
    ticking = true
  }
})

// Remove page-loading class after DOM is ready to enable animations
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    body.classList.remove('page-loading')
  })
})
