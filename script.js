// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 初始化A/B测试
        var testGroup = initABTest();
        
        // 初始化所有功能
        initNavigation();
        initScrollAnimations();
        initSmoothScroll();
        initNavbarScroll();
        initFormValidation();
        initLazyLoading();
        initScrollProgress();
        initBackToTop();

        initTestimonialsSlider();
        initCountdown();
        initNumberCounters();
        initAddToCart();
        initTimelineProgress();
        initFAQ();
        initNutritionPulseAnimation();
        initCraftStepAnimation();
        initPerformanceMonitoring();
        initFeedbackCollector();
        initDarkMode();
    } catch (error) {
        console.error('初始化错误:', error);
    }
});

// 导航栏功能
function initNavigation() {
    var hamburger = document.querySelector('.hamburger');
    var navMenu = document.querySelector('.nav-menu');
    var navLinks = document.querySelectorAll('.nav-link');
    var dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

    if (!hamburger || !navMenu) return;

    // 汉堡菜单切换
    hamburger.addEventListener('click', function() {
        var isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 下拉菜单功能
    for (var i = 0; i < dropdownToggles.length; i++) {
        var toggle = dropdownToggles[i];
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // 点击导航链接后关闭菜单
    for (var i = 0; i < navLinks.length; i++) {
        var link = navLinks[i];
        link.addEventListener('click', function() {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // 关闭所有下拉菜单
            for (var j = 0; j < dropdownToggles.length; j++) {
                var toggle = dropdownToggles[j];
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 点击页面其他地方关闭菜单和下拉菜单
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // 关闭所有下拉菜单
            for (var j = 0; j < dropdownToggles.length; j++) {
                var toggle = dropdownToggles[j];
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// 滚动动画 - 使用 Intersection Observer
function initScrollAnimations() {
    var animatedElements = document.querySelectorAll(
        '.timeline-item, .product-card, .craft-step, .nutrition-item'
    );

    if (!animatedElements.length) return;

    // 检查是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        var observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.isIntersecting) {
                    // 添加延迟动画
                    var element = entry.target;
                    
                    if (element.classList.contains('product-card')) {
                        var productCards = document.querySelectorAll('.product-card');
                        var index = Array.prototype.indexOf.call(productCards, element);
                        element.style.transitionDelay = index * 0.1 + 's';
                    }
                    
                    if (element.classList.contains('craft-step')) {
                        var craftSteps = document.querySelectorAll('.craft-step');
                        var index = Array.prototype.indexOf.call(craftSteps, element);
                        element.style.transitionDelay = index * 0.15 + 's';
                    }
                    
                    if (element.classList.contains('nutrition-item')) {
                        var nutritionItems = document.querySelectorAll('.nutrition-item');
                        var index = Array.prototype.indexOf.call(nutritionItems, element);
                        element.style.transitionDelay = index * 0.1 + 's';
                    }
                    
                    element.classList.add('visible');
                    observer.unobserve(element);
                }
            }
        }, observerOptions);

        for (var i = 0; i < animatedElements.length; i++) {
            observer.observe(animatedElements[i]);
        }
    } else {
        // IE11 fallback: 直接显示所有元素
        for (var i = 0; i < animatedElements.length; i++) {
            animatedElements[i].classList.add('visible');
        }
    }
}

// 平滑滚动
function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                var navbar = document.querySelector('.navbar');
                var navHeight = navbar ? navbar.offsetHeight : 80;
                var targetPosition = targetSection.offsetTop - navHeight;
                
                // 平滑滚动的IE11兼容实现
                function smoothScrollTo(target, duration) {
                    var start = window.pageYOffset;
                    var change = target - start;
                    var currentTime = 0;
                    var increment = 20;
                    
                    function animateScroll() {
                        currentTime += increment;
                        var val = easeInOutQuad(currentTime, start, change, duration);
                        window.scrollTo(0, val);
                        if (currentTime < duration) {
                            setTimeout(animateScroll, increment);
                        }
                    }
                    
                    function easeInOutQuad(t, b, c, d) {
                        t /= d/2;
                        if (t < 1) return c/2*t*t + b;
                        t--;
                        return -c/2 * (t*(t-2) - 1) + b;
                    }
                    
                    animateScroll();
                }
                
                smoothScrollTo(targetPosition, 800);
            }
        });
    }
}

// 导航栏滚动效果 - 使用节流
function initNavbarScroll() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    var lastScroll = 0;
    var ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                var currentScroll = window.pageYOffset;
                
                // 添加/移除滚动样式
                if (currentScroll > 50) {
                    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                }
                
                // 隐藏/显示导航栏
                if (currentScroll > lastScroll && currentScroll > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, false);
}

// 表单验证
function initFormValidation() {
    var contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    var inputs = contactForm.querySelectorAll('input[required], textarea[required]');

    // 实时验证
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        input.addEventListener('blur', function() {
            validateField(this);
        });
        input.addEventListener('input', function() {
            clearError(this);
        });
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var isValid = true;
        
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (!validateField(input)) {
                isValid = false;
            }
        }

        if (isValid) {
            submitForm(this);
        }
    });
}

// 验证单个字段
function validateField(field) {
    var value = field.value.trim();
    var errorElement = field.parentElement.querySelector('.error-message');
    var errorMessage = '';

    if (!value) {
        errorMessage = '此字段为必填项';
    } else if (field.type === 'email') {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = '请输入有效的邮箱地址';
        }
    }

    if (errorMessage) {
        field.classList.add('error');
        if (errorElement) errorElement.textContent = errorMessage;
        return false;
    }

    return true;
}

// 清除错误
function clearError(field) {
    field.classList.remove('error');
    var errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) errorElement.textContent = '';
}

// 提交表单
function submitForm(form) {
    var submitBtn = form.querySelector('.submit-btn');
    if (!submitBtn) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // 模拟提交
    setTimeout(function() {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showNotification('感谢您的留言，我们会尽快与您联系！', 'success');
        form.reset();
    }, 2000);
}

// 图片懒加载
function initLazyLoading() {
    var lazyImages = document.querySelectorAll('.lazy-load');
    var lazyPictures = document.querySelectorAll('picture');
    
    if (!lazyImages.length && !lazyPictures.length) return;

    // 检查是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        var imageObserver = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.isIntersecting) {
                    var element = entry.target;
                    
                    if (element.tagName === 'IMG' && element.classList.contains('lazy-load')) {
                        var src = element.getAttribute('data-src');
                        var srcset = element.getAttribute('data-srcset');
                        
                        if (src) {
                            element.src = src;
                            if (srcset) {
                                element.srcset = srcset;
                                element.removeAttribute('data-srcset');
                            }
                            element.onload = function() {
                                this.classList.add('loaded');
                            };
                            element.removeAttribute('data-src');
                        }
                    } else if (element.tagName === 'PICTURE') {
                        var img = element.querySelector('img.lazy-load');
                        if (img) {
                            var src = img.getAttribute('data-src');
                            var srcset = img.getAttribute('data-srcset');
                            if (src) {
                                img.src = src;
                                if (srcset) {
                                    img.srcset = srcset;
                                    img.removeAttribute('data-srcset');
                                }
                                img.onload = function() {
                                    this.classList.add('loaded');
                                };
                                img.removeAttribute('data-src');
                            }
                        }
                    }
                    
                    imageObserver.unobserve(element);
                }
            }
        }, {
            rootMargin: '50px 0px'
        });

        for (var i = 0; i < lazyImages.length; i++) {
            imageObserver.observe(lazyImages[i]);
        }
        for (var i = 0; i < lazyPictures.length; i++) {
            imageObserver.observe(lazyPictures[i]);
        }
    } else {
        // IE11 fallback: 直接加载所有图片
        for (var i = 0; i < lazyImages.length; i++) {
            var img = lazyImages[i];
            var src = img.getAttribute('data-src');
            var srcset = img.getAttribute('data-srcset');
            if (src) {
                img.src = src;
                if (srcset) {
                    img.srcset = srcset;
                    img.removeAttribute('data-srcset');
                }
                img.classList.add('loaded');
                img.removeAttribute('data-src');
            }
        }
        for (var i = 0; i < lazyPictures.length; i++) {
            var picture = lazyPictures[i];
            var img = picture.querySelector('img.lazy-load');
            if (img) {
                var src = img.getAttribute('data-src');
                var srcset = img.getAttribute('data-srcset');
                if (src) {
                    img.src = src;
                    if (srcset) {
                        img.srcset = srcset;
                        img.removeAttribute('data-srcset');
                    }
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                }
            }
        }
    }
}

// 滚动进度条
function initScrollProgress() {
    var progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    var ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                var scrollTop = window.pageYOffset;
                var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                var scrollPercent = (scrollTop / docHeight) * 100;
                progressBar.style.width = scrollPercent + '%';
                ticking = false;
            });
            ticking = true;
        }
    }, false);
}

// 回到顶部
function initBackToTop() {
    var backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
            backToTop.setAttribute('aria-hidden', 'false');
        } else {
            backToTop.classList.remove('visible');
            backToTop.setAttribute('aria-hidden', 'true');
        }
    }, false);

    backToTop.addEventListener('click', function() {
        // 平滑滚动的IE11兼容实现
        function smoothScrollTo(target, duration) {
            var start = window.pageYOffset;
            var change = target - start;
            var currentTime = 0;
            var increment = 20;
            
            function animateScroll() {
                currentTime += increment;
                var val = easeInOutQuad(currentTime, start, change, duration);
                window.scrollTo(0, val);
                if (currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            }
            
            function easeInOutQuad(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            }
            
            animateScroll();
        }
        
        smoothScrollTo(0, 800);
    });
}



// 客户评价轮播
function initTestimonialsSlider() {
    var track = document.querySelector('.testimonials-track');
    var prevBtn = document.querySelector('.testimonial-prev');
    var nextBtn = document.querySelector('.testimonial-next');
    var dots = document.querySelectorAll('.testimonials-dots .dot');

    if (!track || !prevBtn || !nextBtn) return;

    var currentIndex = 0;
    var totalSlides = dots.length;

    // 使轮播可聚焦
    track.setAttribute('tabindex', '0');
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', '客户评价轮播');

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        currentIndex = index;
        var slideWidth = track.children[0].offsetWidth + 30; // 包含gap
        track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';

        // 更新指示器
        for (var i = 0; i < dots.length; i++) {
            var dot = dots[i];
            dot.classList.toggle('active', i === currentIndex);
            dot.setAttribute('aria-selected', i === currentIndex);
        }
        
        // 更新 aria-live 区域
        updateLiveRegion();
    }

    prevBtn.addEventListener('click', function() {
        goToSlide(currentIndex - 1);
    });
    nextBtn.addEventListener('click', function() {
        goToSlide(currentIndex + 1);
    });

    for (var i = 0; i < dots.length; i++) {
        var dot = dots[i];
        (function(index) {
            dot.addEventListener('click', function() {
                goToSlide(index);
            });
        })(i);
    }

    // 键盘导航支持
    track.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToSlide(currentIndex + 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides - 1);
        }
    });

    // 创建屏幕阅读器实时区域
    var liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    track.parentElement.appendChild(liveRegion);

    function updateLiveRegion() {
        var currentCard = track.children[currentIndex];
        var authorName = currentCard && currentCard.querySelector('.author-name') ? currentCard.querySelector('.author-name').textContent : '';
        liveRegion.textContent = '显示第 ' + (currentIndex + 1) + ' 条评价，共 ' + totalSlides + ' 条，来自' + authorName;
    }

    // 自动轮播
    var autoSlide = setInterval(function() {
        goToSlide(currentIndex + 1);
    }, 5000);

    // 鼠标悬停或聚焦时暂停
    function pauseAutoSlide() {
        clearInterval(autoSlide);
    }
    function resumeAutoSlide() {
        autoSlide = setInterval(function() {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    track.addEventListener('mouseenter', pauseAutoSlide);
    track.addEventListener('mouseleave', resumeAutoSlide);
    track.addEventListener('focus', pauseAutoSlide);
    track.addEventListener('blur', resumeAutoSlide);

    // 触摸滑动支持
    var touchStartX = 0;
    var touchEndX = 0;
    var touchStartY = 0;
    var touchEndY = 0;

    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        // 防止触摸时的默认行为（如页面滚动）
        e.preventDefault();
    }, { passive: false });

    track.addEventListener('touchmove', function(e) {
        // 防止触摸移动时的默认行为
        e.preventDefault();
    }, { passive: false });

    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        var swipeThreshold = 50;
        var diffX = touchStartX - touchEndX;
        var diffY = touchStartY - touchEndY;

        // 确保是水平滑动，而不是垂直滑动
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
    }
}

// 倒计时 - 使用 localStorage 保存结束时间
function initCountdown() {
    // 检查倒计时元素是否存在
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');

    // 如果元素不存在，直接返回，避免错误
    if (!hoursEl || !minutesEl || !secondsEl) {
        console.log('倒计时元素不存在，跳过初始化');
        return;
    }

    var STORAGE_KEY = 'kangzao_promo_end_time';
    var endTime = localStorage.getItem(STORAGE_KEY);
    
    // 如果没有保存的结束时间，或已过期，则设置新的结束时间
    if (!endTime) {
        endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem(STORAGE_KEY, endTime);
    } else {
        endTime = parseInt(endTime);
        // 如果已过期，重置为24小时后
        if (endTime < new Date().getTime()) {
            endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem(STORAGE_KEY, endTime);
        }
    }

    function updateCountdown() {
        var now = new Date().getTime();
        var distance = endTime - now;

        if (distance < 0) {
            // 倒计时结束，重置
            endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem(STORAGE_KEY, endTime);
            return;
        }

        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // 手动实现padStart
        function padStart(num, length, char) {
            var str = String(num);
            while (str.length < length) {
                str = char + str;
            }
            return str;
        }

        hoursEl.textContent = padStart(hours, 2, '0');
        minutesEl.textContent = padStart(minutes, 2, '0');
        secondsEl.textContent = padStart(seconds, 2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// 数字计数动画
function initNumberCounters() {
    var counters = document.querySelectorAll('.stat-number[data-count], .sales-number[data-count]');
    
    if (!counters.length) return;

    // 检查是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        var observerOptions = {
            threshold: 0.5
        };

        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.isIntersecting) {
                    var counter = entry.target;
                    var target = parseInt(counter.getAttribute('data-count'));
                    animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            }
        }, observerOptions);

        for (var i = 0; i < counters.length; i++) {
            observer.observe(counters[i]);
        }
    } else {
        // IE11 fallback: 直接执行动画
        for (var i = 0; i < counters.length; i++) {
            var counter = counters[i];
            var target = parseInt(counter.getAttribute('data-count'));
            animateCounter(counter, target);
        }
    }
}

// 数字动画
function animateCounter(element, target, duration) {
    duration = duration || 2000;
    var start = 0;
    var increment = target / (duration / 16);
    var current = start;

    function update() {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    update();
}

// 添加到购物车
function initAddToCart() {
    var addToCartBtns = document.querySelectorAll('.add-to-cart');
    var cartCount = document.querySelector('.cart-count');
    var cartBtn = document.querySelector('.cart-btn');
    
    if (!addToCartBtns.length || !cartCount) return;

    var count = 0;

    // 创建屏幕阅读器实时区域
    var liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(liveRegion);

    // 更新购物车按钮的 aria-label
    function updateCartAriaLabel() {
        if (cartBtn) {
            cartBtn.setAttribute('aria-label', '查看购物车，当前有 ' + count + ' 件商品');
        }
    }

    for (var i = 0; i < addToCartBtns.length; i++) {
        var btn = addToCartBtns[i];
        btn.addEventListener('click', function() {
            var productCard = this.closest('.product-card');
            var productName = productCard && productCard.querySelector('h3') ? productCard.querySelector('h3').textContent : '商品';
            count++;
            cartCount.textContent = count;
            
            // 更新 aria-label
            updateCartAriaLabel();
            
            // 屏幕阅读器通知
            liveRegion.textContent = productName + ' 已添加到购物车，购物车共有 ' + count + ' 件商品';
            
            // 动画效果
            var originalText = this.textContent;
            this.textContent = '已添加 ✓';
            this.style.background = 'var(--success)';
            
            setTimeout(function() {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);

            showNotification('商品已添加到购物车', 'success');
        });
    }

    // 购物车按钮点击事件
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            if (count === 0) {
                showNotification('购物车是空的', 'info');
                liveRegion.textContent = '购物车是空的，请先添加商品';
            } else {
                showNotification('购物车共有 ' + count + ' 件商品', 'info');
                liveRegion.textContent = '购物车共有 ' + count + ' 件商品，结算功能即将上线';
            }
        });
    }
}

// 时间轴进度
function initTimelineProgress() {
    var timelineSection = document.querySelector('.timeline-section');
    var timelineProgress = document.querySelector('.timeline-progress');

    if (!timelineSection || !timelineProgress) return;

    var ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                var rect = timelineSection.getBoundingClientRect();
                var sectionHeight = timelineSection.offsetHeight;
                var windowHeight = window.innerHeight;

                if (rect.top < windowHeight && rect.bottom > 0) {
                    var scrolled = (windowHeight - rect.top) / (sectionHeight + windowHeight);
                    var progress = Math.min(Math.max(scrolled * 100, 0), 100);
                    timelineProgress.style.height = progress + '%';
                }
                ticking = false;
            });
            ticking = true;
        }
    }, false);
}

// 显示通知
function showNotification(message, type) {
    // 移除已存在的通知
    var existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    var notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;
    
    // 根据类型设置颜色
    var bgColors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#FF9800'
    };
    
    notification.style.cssText = "position: fixed; top: 100px; right: 20px; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; z-index: 10000; animation: slideIn 0.3s ease; max-width: 300px; word-wrap: break-word; background: " + (bgColors[type] || bgColors.info) + "; color: #fff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);";
    
    // 添加动画样式
    if (!document.querySelector('#notification-styles')) {
        var style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = "@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }";
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
}

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    // ESC键关闭菜单
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu?.classList.contains('active')) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// 页面加载完成后执行
window.addEventListener('load', function() {
    // 高亮当前年份的时间轴项
    const currentYear = new Date().getFullYear();
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const year = parseInt(item.getAttribute('data-year'));
        if (year === currentYear) {
            const card = item.querySelector('.timeline-card');
            if (card) card.classList.add('highlight');
        }
    });
});

// 设备检测功能
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 获取当前季节
function getCurrentSeason() {
    const month = new Date().getMonth() + 1; // 月份从1开始
    
    if (month >= 3 && month <= 5) return 'spring'; // 春季
    if (month >= 6 && month <= 8) return 'summer'; // 夏季
    if (month >= 9 && month <= 11) return 'autumn'; // 秋季
    return 'winter'; // 冬季
}

// A/B测试框架
function initABTest() {
    // 测试组配置
    const testGroups = {
        A: { name: '默认动画', active: true },
        B: { name: '快速动画', active: true },
        C: { name: '缓慢动画', active: true }
    };
    
    // 获取或分配测试组
    function getTestGroup() {
        let group = localStorage.getItem('kangzao_ab_test_group');
        
        if (!group) {
            // 随机分配测试组
            const activeGroups = Object.keys(testGroups).filter(key => testGroups[key].active);
            group = activeGroups[Math.floor(Math.random() * activeGroups.length)];
            localStorage.setItem('kangzao_ab_test_group', group);
        }
        
        return group;
    }
    
    const currentGroup = getTestGroup();
    console.log('A/B测试组:', currentGroup, testGroups[currentGroup].name);
    
    // 存储测试组信息到全局变量
    window.kangzaoABTest = {
        group: currentGroup,
        config: testGroups[currentGroup]
    };
    
    // 跟踪用户行为
    function trackEvent(eventName) {
        // 这里可以添加事件跟踪代码，例如发送到 analytics 服务
        console.log('A/B测试事件:', eventName, '组:', currentGroup);
        
        // 简单的本地存储统计
        const stats = JSON.parse(localStorage.getItem('kangzao_ab_test_stats') || '{}');
        if (!stats[currentGroup]) {
            stats[currentGroup] = { events: {} };
        }
        if (!stats[currentGroup].events[eventName]) {
            stats[currentGroup].events[eventName] = 0;
        }
        stats[currentGroup].events[eventName]++;
        localStorage.setItem('kangzao_ab_test_stats', JSON.stringify(stats));
    }
    
    // 暴露跟踪方法
    window.trackEvent = trackEvent;
    
    return currentGroup;
}

// 用户反馈收集机制
function initFeedbackCollector() {
    // 创建反馈按钮
    const feedbackButton = document.createElement('button');
    feedbackButton.className = 'feedback-btn';
    feedbackButton.innerHTML = '💬 反馈';
    feedbackButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 16px;
        border: none;
        border-radius: 25px;
        background: #4CAF50;
        color: white;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    // 鼠标悬停效果
    feedbackButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.15)';
    });
    
    feedbackButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    });
    
    // 创建反馈表单
    const feedbackForm = document.createElement('div');
    feedbackForm.className = 'feedback-form';
    feedbackForm.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 300px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        padding: 20px;
        z-index: 999;
        display: none;
        animation: slideUp 0.3s ease;
    `;
    
    // 表单内容
    feedbackForm.innerHTML = `
        <h3 style="margin-top: 0; color: #333;">动画效果反馈</h3>
        <p style="margin-bottom: 15px; color: #666; font-size: 14px;">请对我们的动画效果进行评价</p>
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 8px; color: #333;">满意度评分:</label>
            <div class="rating-stars">
                <span class="star" data-rating="1">★</span>
                <span class="star" data-rating="2">★</span>
                <span class="star" data-rating="3">★</span>
                <span class="star" data-rating="4">★</span>
                <span class="star" data-rating="5">★</span>
            </div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label for="feedback-text" style="display: block; margin-bottom: 8px; color: #333;">详细反馈:</label>
            <textarea id="feedback-text" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: none; font-size: 14px;"></textarea>
        </div>
        
        <button class="submit-feedback" style="width: 100%; padding: 10px; border: none; border-radius: 5px; background: #4CAF50; color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.3s ease;">提交反馈</button>
        <button class="close-feedback" style="margin-top: 10px; width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px; background: white; color: #666; font-size: 14px; cursor: pointer; transition: all 0.3s ease;">关闭</button>
    `;
    
    // 添加星级评分样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .rating-stars {
            display: flex;
            gap: 5px;
        }
        
        .star {
            font-size: 24px;
            color: #ddd;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .star:hover, .star.active {
            color: #FFD700;
        }
    `;
    document.head.appendChild(style);
    
    // 添加元素到页面
    document.body.appendChild(feedbackButton);
    document.body.appendChild(feedbackForm);
    
    // 显示/隐藏反馈表单
    feedbackButton.addEventListener('click', function() {
        feedbackForm.style.display = feedbackForm.style.display === 'none' ? 'block' : 'none';
    });
    
    // 关闭按钮
    feedbackForm.querySelector('.close-feedback').addEventListener('click', function() {
        feedbackForm.style.display = 'none';
    });
    
    // 星级评分
    const stars = feedbackForm.querySelectorAll('.star');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            selectedRating = rating;
            
            // 更新星级显示
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.getAttribute('data-rating')) <= rating);
            });
        });
    });
    
    // 提交反馈
    feedbackForm.querySelector('.submit-feedback').addEventListener('click', function() {
        const feedbackText = feedbackForm.querySelector('#feedback-text').value.trim();
        
        if (selectedRating === 0) {
            showNotification('请先选择评分', 'warning');
            return;
        }
        
        // 收集反馈数据
        const feedbackData = {
            rating: selectedRating,
            feedback: feedbackText,
            testGroup: window.kangzaoABTest?.group || 'A',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        // 存储反馈数据
        const feedbacks = JSON.parse(localStorage.getItem('kangzao_feedback') || '[]');
        feedbacks.push(feedbackData);
        localStorage.setItem('kangzao_feedback', JSON.stringify(feedbacks));
        
        // 跟踪反馈事件
        if (window.trackEvent) {
            window.trackEvent('feedback_submitted');
        }
        
        // 显示成功消息
        showNotification('感谢您的反馈！', 'success');
        
        // 重置表单并关闭
        selectedRating = 0;
        stars.forEach(s => s.classList.remove('active'));
        feedbackForm.querySelector('#feedback-text').value = '';
        feedbackForm.style.display = 'none';
        
        console.log('反馈已提交:', feedbackData);
    });
}

// 性能监控功能
function initPerformanceMonitoring() {
    // 检查浏览器支持
    if (!window.performance || !window.performance.mark) return;
    
    // 动画帧率监控
    let frameCount = 0;
    let lastTime = performance.now();
    
    function monitorAnimationFrame() {
        frameCount++;
        const currentTime = performance.now();
        
        // 每100帧计算一次帧率
        if (frameCount % 100 === 0) {
            const elapsed = currentTime - lastTime;
            const fps = Math.round((100 / elapsed) * 1000);
            
            // 记录性能数据
            if (fps < 50) {
                console.warn('动画性能警告: FPS =', fps);
                // 可以在这里添加性能数据上报
            }
            
            lastTime = currentTime;
            frameCount = 0;
        }
        
        requestAnimationFrame(monitorAnimationFrame);
    }
    
    // 启动监控
    requestAnimationFrame(monitorAnimationFrame);
    
    // 监控动画执行时间
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        const start = performance.now();
        return originalRequestAnimationFrame(function(timestamp) {
            const end = performance.now();
            const duration = end - start;
            
            // 如果动画执行时间过长，记录警告
            if (duration > 16) { // 16ms = 60fps
                console.warn('动画执行时间过长:', duration.toFixed(2), 'ms');
            }
            
            callback(timestamp);
        });
    };
}

// 深色模式功能
function initDarkMode() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // 检查用户偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('kangzao_theme');
    
    // 设置初始主题
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark-theme');
        themeToggle.setAttribute('aria-pressed', 'true');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    }
    
    // 切换主题
    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.classList.toggle('dark-theme');
        
        // 更新按钮状态
        this.setAttribute('aria-pressed', isDark);
        this.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
        
        // 保存偏好
        localStorage.setItem('kangzao_theme', isDark ? 'dark' : 'light');
    });
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的Promise拒绝:', e.reason);
});

// 移动端触摸优化
function optimizeTouchEvents() {
    // 获取所有可点击元素
    var clickableElements = document.querySelectorAll('button, a, input, select, textarea');
    
    // 为每个可点击元素添加触摸优化
    for (var i = 0; i < clickableElements.length; i++) {
        var element = clickableElements[i];
        
        // 添加触摸反馈
        element.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';
        }, false);
        
        element.addEventListener('touchend', function(e) {
            this.style.transform = 'scale(1)';
        }, false);
        
        element.addEventListener('touchcancel', function(e) {
            this.style.transform = 'scale(1)';
        }, false);
        
        // 防止点击延迟
        element.style.touchAction = 'manipulation';
    }
    
    // 优化滚动性能
    document.body.style.overflowX = 'hidden';
    
    // 禁止双击缩放
    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        var content = viewport.getAttribute('content');
        if (!content.includes('user-scalable=no')) {
            viewport.setAttribute('content', content + ', user-scalable=no');
        }
    }
}

// 在DOM加载完成后初始化触摸优化
document.addEventListener('DOMContentLoaded', function() {
    try {
        optimizeTouchEvents();
    } catch (error) {
        console.error('初始化触摸优化错误:', error);
    }
});

// FAQ功能
function initFAQ() {
    var faqQuestions = document.querySelectorAll('.faq-question');
    
    if (!faqQuestions.length) return;
    
    for (var i = 0; i < faqQuestions.length; i++) {
        var question = faqQuestions[i];
        question.addEventListener('click', function() {
            var isExpanded = this.getAttribute('aria-expanded') === 'true';
            var answer = document.getElementById(this.getAttribute('aria-controls'));
            
            if (answer) {
                this.setAttribute('aria-expanded', !isExpanded);
                this.classList.toggle('active');
                answer.hidden = isExpanded;
            }
        });
    }
}



// 营养价值图标脉动动画
function initNutritionPulseAnimation() {
    var nutritionItems = document.querySelectorAll('.nutrition-item');
    if (!nutritionItems.length) return;
    
    var isMobile = isMobileDevice();
    var testGroup = window.kangzaoABTest && window.kangzaoABTest.group ? window.kangzaoABTest.group : 'A';
    
    for (var i = 0; i < nutritionItems.length; i++) {
        var item = nutritionItems[i];
        var icon = item.querySelector('.nutrition-icon');
        if (icon) {
            // 根据设备类型和测试组调整动画参数
            var baseDuration = isMobile ? 3 : 2;
            
            switch (testGroup) {
                case 'B': // 快速动画
                    baseDuration *= 0.7;
                    break;
                case 'C': // 缓慢动画
                    baseDuration *= 1.3;
                    break;
            }
            
            var duration = baseDuration + 's';
            icon.style.animation = 'pulse ' + duration + ' ease-in-out ' + (i * 0.2) + 's infinite';
        }
    }
}

// 制作工艺步骤动画
function initCraftStepAnimation() {
    var craftSteps = document.querySelectorAll('.craft-step');
    if (!craftSteps.length) return;
    
    // 检查是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        var observerOptions = {
            threshold: 0.5
        };
        
        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.isIntersecting) {
                    var step = entry.target;
                    var stepNumber = step.querySelector('.step-number');
                    var stepIcon = step.querySelector('.step-icon');
                    var stepContent = step.querySelector('.step-content');
                    
                    // 分步动画
                    setTimeout(function() {
                        if (stepNumber) {
                            stepNumber.style.animation = 'fadeInUp 0.6s ease forwards';
                        }
                    }, i * 100);
                    
                    setTimeout(function() {
                        if (stepIcon) {
                            stepIcon.style.animation = 'bounce 1s ease forwards';
                        }
                    }, i * 100 + 200);
                    
                    setTimeout(function() {
                        if (stepContent) {
                            stepContent.style.animation = 'fadeInUp 0.6s ease forwards';
                        }
                    }, i * 100 + 400);
                    
                    observer.unobserve(step);
                }
            }
        }, observerOptions);
        
        for (var i = 0; i < craftSteps.length; i++) {
            observer.observe(craftSteps[i]);
        }
    } else {
        // IE11 fallback: 直接显示所有元素
        for (var i = 0; i < craftSteps.length; i++) {
            var step = craftSteps[i];
            var stepNumber = step.querySelector('.step-number');
            var stepIcon = step.querySelector('.step-icon');
            var stepContent = step.querySelector('.step-content');
            
            if (stepNumber) {
                stepNumber.style.animation = 'fadeInUp 0.6s ease forwards';
            }
            if (stepIcon) {
                stepIcon.style.animation = 'bounce 1s ease forwards';
            }
            if (stepContent) {
                stepContent.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        }
    }
}

// 添加新的动画关键帧
if (!document.querySelector('#custom-animations')) {
    var style = document.createElement('style');
    style.id = 'custom-animations';
    style.textContent = "@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } } @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }";
    document.head.appendChild(style);
}

// 照片上传功能
function initPhotoUpload() {
    var uploadInputs = document.querySelectorAll('.upload-input');
    var deleteBtns = document.querySelectorAll('.delete-btn');
    
    if (!uploadInputs.length) return;
    
    // 为每个上传输入添加事件监听器
    for (var i = 0; i < uploadInputs.length; i++) {
        var input = uploadInputs[i];
        input.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            
            // 验证文件格式
            var validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            var isValidType = false;
            for (var j = 0; j < validTypes.length; j++) {
                if (validTypes[j] === file.type) {
                    isValidType = true;
                    break;
                }
            }
            if (!isValidType) {
                showNotification('请上传JPG或PNG格式的图片', 'error');
                return;
            }
            
            // 验证文件大小（限制为5MB）
            if (file.size > 5 * 1024 * 1024) {
                showNotification('图片大小不能超过5MB', 'error');
                return;
            }
            
            var step = this.getAttribute('data-step');
            var preview = document.querySelector('.photo-preview[data-step="' + step + '"]');
            var deleteBtn = document.querySelector('.delete-btn[data-step="' + step + '"]');
            
            if (!preview || !deleteBtn) return;
            
            // 创建图片预览
            var reader = new FileReader();
            reader.onload = function(e) {
                // 清空预览区域
                preview.innerHTML = '';
                
                // 创建图片元素
                var img = document.createElement('img');
                img.src = e.target.result;
                img.alt = step + ' 步骤照片';
                
                // 添加到预览区域
                preview.appendChild(img);
                
                // 显示删除按钮
                deleteBtn.style.display = 'inline-block';
                
                // 显示成功通知
                showNotification('照片上传成功', 'success');
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // 为每个删除按钮添加事件监听器
    for (var i = 0; i < deleteBtns.length; i++) {
        var btn = deleteBtns[i];
        btn.addEventListener('click', function() {
            var step = this.getAttribute('data-step');
            var preview = document.querySelector('.photo-preview[data-step="' + step + '"]');
            var uploadInput = document.querySelector('.upload-input[data-step="' + step + '"]');
            
            if (!preview || !uploadInput) return;
            
            // 清空预览区域
            preview.innerHTML = '';
            
            // 隐藏删除按钮
            this.style.display = 'none';
            
            // 重置上传输入
            uploadInput.value = '';
            
            // 显示成功通知
            showNotification('照片已删除', 'info');
        });
    }
}

// 在DOM加载完成后初始化照片上传功能
document.addEventListener('DOMContentLoaded', function() {
    try {
        initPhotoUpload();
        initTeaModal();
        initCakeModal();
    } catch (error) {
        console.error('初始化照片上传功能错误:', error);
    }
});

// ==================== 炕枣果茶模态窗口功能 ====================

function initTeaModal() {
    var modal = document.getElementById('tea-modal');
    var viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    var closeBtn = document.querySelector('.modal-close');
    var overlay = document.querySelector('.modal-overlay');
    var ctaBtn = document.querySelector('.modal-cta-btn');
    
    if (!modal) {
        console.log('模态窗口元素不存在，跳过初始化');
        return;
    }
    
    // 查找炕枣果茶对应的"查看详情"按钮
    var teaBtn = null;
    for (var i = 0; i < viewDetailsBtns.length; i++) {
        var btn = viewDetailsBtns[i];
        var card = btn.closest('.card');
        if (card) {
            var title = card.querySelector('h4');
            if (title && title.textContent.indexOf('炕枣果茶') !== -1) {
                teaBtn = btn;
                break;
            }
        }
    }
    
    // 打开模态窗口
    function openModal() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
        
        // 聚焦到关闭按钮（无障碍）
        if (closeBtn) {
            closeBtn.focus();
        }
        
        // 跟踪事件
        if (window.trackEvent) {
            window.trackEvent('tea_modal_opened');
        }
    }
    
    // 关闭模态窗口
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // 恢复背景滚动
        
        // 将焦点返回到触发按钮（无障碍）
        if (teaBtn) {
            teaBtn.focus();
        }
    }
    
    // 绑定炕枣果茶的查看详情按钮
    if (teaBtn) {
        teaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    }
    
    // 绑定关闭按钮
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // 绑定遮罩层点击关闭
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // 绑定CTA按钮点击
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            // 跟踪购买事件
            if (window.trackEvent) {
                window.trackEvent('tea_purchase_clicked');
            }
            
            // 显示提示信息
            showNotification('即将跳转到购买页面...', 'info');
            
            // 这里可以添加实际的购买逻辑
            // 例如：window.location.href = '/purchase/tea';
        });
    }
    
    // 键盘事件支持（ESC关闭）
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // 模态窗口内焦点管理（无障碍）
    modal.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        
        var focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        var firstElement = focusableElements[0];
        var lastElement = focusableElements[focusableElements.length - 1];
        
        // Shift+Tab：如果焦点在第一个元素，则跳到最后一个
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab：如果焦点在最后一个元素，则跳到第一个
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    console.log('炕枣果茶模态窗口初始化完成');
}

// ==================== 炕枣糕模态窗口功能 ====================

function initCakeModal() {
    var modal = document.getElementById('cake-modal');
    var viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    var closeBtn = modal ? modal.querySelector('.modal-close') : null;
    var overlay = modal ? modal.querySelector('.modal-overlay') : null;
    var ctaBtn = modal ? modal.querySelector('.modal-cta-btn') : null;
    
    if (!modal) {
        console.log('炕枣糕模态窗口元素不存在，跳过初始化');
        return;
    }
    
    // 查找炕枣糕对应的"查看详情"按钮
    var cakeBtn = null;
    for (var i = 0; i < viewDetailsBtns.length; i++) {
        var btn = viewDetailsBtns[i];
        var card = btn.closest('.card');
        if (card) {
            var title = card.querySelector('h4');
            if (title && title.textContent.indexOf('炕枣糕') !== -1 && title.textContent.indexOf('阿胶') === -1) {
                cakeBtn = btn;
                break;
            }
        }
    }
    
    // 打开模态窗口
    function openModal() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // 聚焦到关闭按钮
        if (closeBtn) {
            closeBtn.focus();
        }
        
        // 动画效果：风味条填充动画
        setTimeout(function() {
            var flavorFills = modal.querySelectorAll('.flavor-fill');
            for (var j = 0; j < flavorFills.length; j++) {
                var fill = flavorFills[j];
                var width = fill.style.width;
                fill.style.width = '0';
                setTimeout((function(f, w) {
                    return function() {
                        f.style.width = w;
                    };
                })(fill, width), j * 100);
            }
        }, 300);
        
        // 跟踪事件
        if (window.trackEvent) {
            window.trackEvent('cake_modal_opened');
        }
    }
    
    // 关闭模态窗口
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // 将焦点返回到触发按钮
        if (cakeBtn) {
            cakeBtn.focus();
        }
    }
    
    // 绑定炕枣糕的查看详情按钮
    if (cakeBtn) {
        cakeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    }
    
    // 绑定关闭按钮
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // 绑定遮罩层点击关闭
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // 绑定CTA按钮点击
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            // 跟踪购买事件
            if (window.trackEvent) {
                window.trackEvent('cake_purchase_clicked');
            }
            
            // 显示提示信息
            showNotification('即将跳转到购买页面...', 'info');
        });
    }
    
    // 键盘事件支持（ESC关闭）
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // 模态窗口内焦点管理
    modal.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        
        var focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        var firstElement = focusableElements[0];
        var lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    console.log('炕枣糕模态窗口初始化完成');
}

// ==================== 通用详情按钮行为逻辑（与view-details-btn完全一致） ====================

function initBtnDetails() {
    var btnDetailsList = document.querySelectorAll('.btn-details');
    
    if (!btnDetailsList.length) {
        console.log('未找到btn-details按钮，跳过初始化');
        return;
    }
    
    for (var i = 0; i < btnDetailsList.length; i++) {
        var btn = btnDetailsList[i];
        
        // 防止重复绑定
        if (btn.dataset.btnDetailsInitialized === 'true') {
            continue;
        }
        btn.dataset.btnDetailsInitialized = 'true';
        
        // 点击事件处理
        btn.addEventListener('click', function(e) {
            var self = this;
            
            // 如果按钮处于加载状态或禁用状态，阻止点击
            if (self.classList.contains('is-loading') || self.disabled) {
                e.preventDefault();
                return;
            }
            
            // 添加激活状态
            self.classList.add('is-active');
            
            // 移除激活状态（模拟点击效果）
            setTimeout(function() {
                self.classList.remove('is-active');
            }, 200);
            
            // 跟踪点击事件
            if (window.trackEvent) {
                window.trackEvent('btn_details_clicked');
            }
            
            // 如果按钮有data-modal属性，打开对应的模态窗口
            var modalId = self.getAttribute('data-modal');
            if (modalId) {
                e.preventDefault();
                var modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    modal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                    
                    var closeBtn = modal.querySelector('.modal-close');
                    if (closeBtn) {
                        closeBtn.focus();
                    }
                }
            }
            
            // 如果按钮有data-action属性，执行对应的动作
            var action = self.getAttribute('data-action');
            if (action) {
                handleBtnAction(action, self);
            }
        });
        
        // 键盘事件支持
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 触摸设备优化：防止双击缩放
        btn.addEventListener('touchstart', function(e) {
            this.style.touchAction = 'manipulation';
        }, { passive: true });
    }
    
    console.log('btn-details按钮行为初始化完成，共绑定', btnDetailsList.length, '个按钮');
}

// 处理按钮动作
function handleBtnAction(action, btn) {
    switch (action) {
        case 'loading':
            setBtnLoading(btn, true);
            break;
        case 'disable':
            btn.disabled = true;
            break;
        case 'enable':
            btn.disabled = false;
            break;
        case 'toggle':
            btn.classList.toggle('is-active');
            break;
        default:
            console.log('未知的按钮动作:', action);
    }
}

// 设置按钮加载状态
function setBtnLoading(btn, isLoading) {
    if (isLoading) {
        btn.classList.add('is-loading');
        btn.dataset.originalText = btn.textContent;
        btn.textContent = '加载中...';
    } else {
        btn.classList.remove('is-loading');
        if (btn.dataset.originalText) {
            btn.textContent = btn.dataset.originalText;
        }
    }
}

// 在DOM加载完成后初始化btn-details按钮
document.addEventListener('DOMContentLoaded', function() {
    try {
        initBtnDetails();
        initEjiaoModal();
    } catch (error) {
        console.error('初始化btn-details按钮错误:', error);
    }
});

// ==================== 炕枣阿胶糕模态窗口功能 ====================

function initEjiaoModal() {
    var modal = document.getElementById('ejiao-modal');
    var viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    var closeBtn = modal ? modal.querySelector('.modal-close') : null;
    var overlay = modal ? modal.querySelector('.modal-overlay') : null;
    var ctaBtn = modal ? modal.querySelector('.modal-cta-btn') : null;
    
    if (!modal) {
        console.log('炕枣阿胶糕模态窗口元素不存在，跳过初始化');
        return;
    }
    
    // 查找炕枣阿胶糕对应的"查看详情"按钮
    var ejiaoBtn = null;
    for (var i = 0; i < viewDetailsBtns.length; i++) {
        var btn = viewDetailsBtns[i];
        var card = btn.closest('.card');
        if (card) {
            var title = card.querySelector('h4');
            if (title && title.textContent.indexOf('阿胶糕') !== -1) {
                ejiaoBtn = btn;
                break;
            }
        }
    }
    
    // 打开模态窗口
    function openModal() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // 聚焦到关闭按钮
        if (closeBtn) {
            closeBtn.focus();
        }
        
        // 动画效果：成分项依次显示
        setTimeout(function() {
            var ingredientItems = modal.querySelectorAll('.ingredient-item');
            for (var j = 0; j < ingredientItems.length; j++) {
                var item = ingredientItems[j];
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                setTimeout((function(it) {
                    return function() {
                        it.style.transition = 'all 0.4s ease';
                        it.style.opacity = '1';
                        it.style.transform = 'translateX(0)';
                    };
                })(item), j * 100);
            }
        }, 300);
        
        // 跟踪事件
        if (window.trackEvent) {
            window.trackEvent('ejiao_modal_opened');
        }
    }
    
    // 关闭模态窗口
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // 将焦点返回到触发按钮
        if (ejiaoBtn) {
            ejiaoBtn.focus();
        }
    }
    
    // 绑定炕枣阿胶糕的查看详情按钮
    if (ejiaoBtn) {
        ejiaoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    }
    
    // 绑定关闭按钮
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // 绑定遮罩层点击关闭
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // 绑定CTA按钮点击
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            // 跟踪购买事件
            if (window.trackEvent) {
                window.trackEvent('ejiao_purchase_clicked');
            }
            
            // 显示提示信息
            showNotification('即将跳转到购买页面...', 'info');
        });
    }
    
    // 键盘事件支持（ESC关闭）
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // 模态窗口内焦点管理
    modal.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        
        var focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        var firstElement = focusableElements[0];
        var lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    console.log('炕枣阿胶糕模态窗口初始化完成');
}

// ==================== Toast通知系统 ====================
function initToastSystem() {
    // 创建Toast容器
    var toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
    
    console.log('Toast通知系统初始化完成');
}

// 显示Toast通知
function showToast(message, type, duration) {
    type = type || 'success';
    duration = duration || 3000;
    
    var container = document.getElementById('toast-container');
    if (!container) {
        initToastSystem();
        container = document.getElementById('toast-container');
    }
    
    // 创建Toast元素
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    
    // 设置图标
    var icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'warning') icon = '⚠';
    if (type === 'info') icon = 'ℹ';
    
    toast.innerHTML = 
        '<span class="toast-icon">' + icon + '</span>' +
        '<span class="toast-message">' + message + '</span>' +
        '<button class="toast-close" aria-label="关闭通知">&times;</button>';
    
    container.appendChild(toast);
    
    // 显示动画
    setTimeout(function() {
        toast.classList.add('show');
    }, 10);
    
    // 关闭按钮事件
    var closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        hideToast(toast);
    });
    
    // 自动关闭
    if (duration > 0) {
        setTimeout(function() {
            hideToast(toast);
        }, duration);
    }
    
    return toast;
}

// 隐藏Toast通知
function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(function() {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// ==================== 购物车功能增强 ====================
function initEnhancedCart() {
    var cartBtn = document.querySelector('.cart-floating');
    var cartBadge = document.querySelector('.cart-badge');
    var cartCount = 0;
    
    if (!cartBtn) return;
    
    // 点击购物车显示详情
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (cartCount === 0) {
            showToast('购物车是空的，快去选购吧！', 'info', 3000);
        } else {
            showToast('购物车功能开发中，敬请期待！', 'info', 3000);
        }
    });
    
    // 增强添加到购物车功能
    var addToCartBtns = document.querySelectorAll('.modal-cta-btn');
    addToCartBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取产品名称
            var modal = this.closest('.modal');
            var productName = '';
            if (modal) {
                var title = modal.querySelector('h2');
                if (title) productName = title.textContent;
            }
            
            // 显示加载状态
            var originalText = this.textContent;
            this.classList.add('btn-loading');
            this.disabled = true;
            
            // 模拟添加过程
            setTimeout(function() {
                cartCount++;
                if (cartBadge) {
                    cartBadge.textContent = cartCount;
                    cartBadge.classList.add('bounce');
                    setTimeout(function() {
                        cartBadge.classList.remove('bounce');
                    }, 500);
                }
                
                showToast(productName + ' 已添加到购物车！', 'success', 3000);
                
                // 恢复按钮状态
                this.classList.remove('btn-loading');
                this.disabled = false;
                this.textContent = originalText;
                
                // 关闭模态窗口
                if (modal) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                }
            }.bind(this), 800);
        });
    });
    
    console.log('购物车功能增强完成');
}

// ==================== 表单提交增强 ====================
function initEnhancedForm() {
    var contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    var submitBtn = contactForm.querySelector('.submit-btn');
    if (!submitBtn) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 验证表单
        var inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        var isValid = true;
        
        for (var i = 0; i < inputs.length; i++) {
            if (!inputs[i].value.trim()) {
                isValid = false;
                inputs[i].classList.add('error');
            } else {
                inputs[i].classList.remove('error');
            }
        }
        
        if (!isValid) {
            showToast('请填写所有必填项', 'error', 3000);
            return;
        }
        
        // 显示加载状态
        var originalText = submitBtn.textContent;
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        
        // 模拟提交过程
        setTimeout(function() {
            showToast('感谢您的留言！我们会尽快回复您。', 'success', 4000);
            
            // 恢复按钮状态
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            // 重置表单
            contactForm.reset();
        }, 1500);
    });
    
    console.log('表单提交增强完成');
}

// ==================== 主题切换增强 ====================
function initEnhancedThemeToggle() {
    var themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function() {
        var isDark = document.body.classList.contains('dark-theme');
        
        if (isDark) {
            showToast('已切换到浅色模式', 'info', 2000);
        } else {
            showToast('已切换到深色模式', 'info', 2000);
        }
    });
    
    console.log('主题切换增强完成');
}

// ==================== 初始化所有增强功能 ====================
document.addEventListener('DOMContentLoaded', function() {
    try {
        initToastSystem();
        initEnhancedCart();
        initEnhancedForm();
        initEnhancedThemeToggle();
        
        console.log('所有增强功能初始化完成');
    } catch (error) {
        console.error('增强功能初始化错误:', error);
    }
});
