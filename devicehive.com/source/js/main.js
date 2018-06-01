(function ($) {
    'use strict'

    //detect mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        window.isMobile = true;
        document.addEventListener('DOMContentLoaded', function () {
            document.body.className += " mobile";
        });
    } else {
        window.isMobile = false;
        document.body.className += " desktop";
    }

    var resBreakpoint = 992;

    // detect safari
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    /**
     * Validation
     **/

    $.validator.addMethod('emailRegex', function (value, element) {
        return this.optional(element) || /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/igm.test(value);
    });

    var Validation = {
        init: function (config) {
            this.config = config;
            this.bindEvents();
        },

        bindEvents: function () {
            this.validate(this.config.form);
            this.enableButton(this.config.form, this.config.field, this.config.btn);
        },

        validate: function (form) {
            $(form).validate({
                rules: {
                    EMAIL: {
                        emailRegex: true,
                        required: true
                    }
                },
                messages: {
                    EMAIL: {
                        emailRegex: 'Please enter a valid email address.'
                    }
                },
                submitHandler: function (form) {
                    $(form).submit();
                }
            });
        },

        enableButton: function (form, field, btn) {
            btn.on('click', function () {
                if (form.valid()) {
                    btn.prop('disabled', false);
                } else {
                    btn.prop('disabled', true);
                }
            });

            field.on('blur keyup', function () {
                if (form.valid()) {
                    btn.prop('disabled', false);
                } else {
                    btn.prop('disabled', true);
                }
            })
        }
    };

    /**
     * Mobile menu
     **/

    var MobileMenu = {
        init: function (config) {
            var self = this;
            this.config = config;
            this.bindEvents();
            this.footerBar = this.config.footerBar.clone();

            if (window.innerWidth < resBreakpoint) {
                self.config.navbar.hide();
                $(window).on('orientationchange', function () {
                    self.hideMenu()
                });
            }

            $(window).on('resize', function () {
                $('body').removeClass(self.config.classToBodyAdd);
                if (window.innerWidth < resBreakpoint) {
                    self.config.navbar.hide();
                } else {
                    self.config.navbar.show();
                }
            });
        },


        bindEvents: function () {
            var self = this,
                $body = $('body');

            self.config.menuBtn.on('click', this.processMenu);
            self.config.navItem.on('click', function () {
                if ($body.hasClass(self.config.classToBodyAdd)) {
                    $('#headerNav').slideUp();
                    $body.removeClass(self.config.classToBodyAdd)
                }
            });
        },

        processMenu: function () {
            var self = MobileMenu;
            $('body').hasClass(self.config.classToBodyAdd)
                ? self.hideMenu()
                : self.showMenu();
        },

        hideMenu: function () {
            $('body').removeClass(this.config.classToBodyAdd);
            this.config.navbar.slideUp();
            $('.mobile-logo').hide();
        },

        showMenu: function () {
            $('body').addClass(this.config.classToBodyAdd);
            this.config.navbar.append(this.footerBar).slideDown();

            if($('#scroll-there').length){
                var offset = $('#scroll-there').offset().top / 2;
                if ($(window).scrollTop() < offset) $('.mobile-logo').show();
            }
        }
    };

    /**
     * Background change
     **/

    var sectionBgChange = {
        init: function (config) {
            this.config = config;
            this.processSections();
        },
        processSections: function () {
            var self = this;
            var scroll = $(window).scrollTop() + ($(window).height() / 2);
            this.config.section.each(function () {
                var $this = $(this);

                if ($this.position().top <= scroll && $this.position().top + $this.height() > scroll) {

                    self.config.container.removeClass(function (index, css) {
                        return (css.match(/(^|\s)section-\S+/g) || []).join(' ');
                    });

                    self.config.container.addClass('section-' + $(this).data('section'));
                }
            })
        }
    };

    /**
     * Scroll to anchor
     **/

    function scrollToAnchor(link) {
        link.on('click', function (e) {
            e.preventDefault();

            var headerHeight = (window.innerWidth < resBreakpoint) ? $('.header').height() : 0,
                id = $(this).attr('href'),
                target = $(id).offset().top - headerHeight;

            $('html, body').animate({scrollTop: target}, 700);
        });
    }

    /**
     * Hover active link
     **/

    function hoverActiveLink(link) {
        var scrollPos = $(document).scrollTop();

        link.each(function () {
            var curItem = $(this),
                target = $(curItem.attr('href'));

            if (target.position().top <= scrollPos && target.position().top + target.height() > scrollPos) {
                link.removeClass('active');
                curItem.addClass("active");
            } else {
                curItem.removeClass('active');
            }
        })
    }

    function changeHeaderOnScroll() {
        var scrolled = $(window).scrollTop(),
            offset = $('#scroll-there').offset().top / 2,
            headerLogo = $('#headerLogo'),
            header = $(".header");

        if (scrolled > offset) {
            headerLogo.addClass('shown');
            window.innerWidth < resBreakpoint ? header.addClass('mobile-header') : header.removeClass('mobile-header');
        } else {
            headerLogo.removeClass('shown');
            header.removeClass('mobile-header');
        }
    }

    /**
     * Change text with interval
     **/

    var counter = 0;

    var descriptions = [
        'Need building smart elevator controlled by Alexa?',
        'A fleet of python controlled 3D printers connected to the cloud?',
        'Predictive consumptions of your gas equipment?',
        'Alexa on RPi talking to the Cloud?',
        'Manage millions of connected devices?',
        'Run mission critical fault tolerant IoT business?',
        'Need IoT data-driven decision-making?'
    ];

    var changingText = $('#changingText');

    function changeText() {
        changingText.text(descriptions[counter++]);
        counter++;
        if (counter >= descriptions.length) counter = 0;

        changingText.fadeIn('slow').animate({'opacity': 1}, 30000).fadeOut('slow', function () {
            return changeText()
        });
    }

    /**
     *  Process parallax
     */

    function processParallax(parallax) {
        if (window.innerWidth >= resBreakpoint) {
            parallax.init();
        } else {
            parallax.destroy();
        }
    }

    /**
     * Subscribe
     */

    function subscribeForNews(form) {
        $('#footer-email').on('blur, keyup', function () {
            $('span#mailchimp-error').text('');
        });

        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize(),
            cache: false,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            error: function (err) {
                alert('Oops, something went wrong!');
            },
            success: function (data) {
                if($('#footer-email').val() !== ''){
                    if (data.result !== 'success') {
                        if(data.msg.indexOf('is already subscribed') !== -1){
                            $('span#mailchimp-error').text('This email address is already subscribed to the News Digest');
                        } else {
                            $('span#mailchimp-error').text(data.msg);
                        }
                        $('#footerSubscribeBtn').prop('disabled', true)
                    } else {
                        $('#footer-email').val('');
                        $('#subscribedMsg').fadeIn(200);
                        setTimeout(function () {
                            $('#subscribedMsg').fadeOut(200);
                        }, 2000)
                    }
                }
            }
        });
        return false;
    }

    /**
     *  track users clicks
     */

    function handleOutboundLinkClicks(event) {
        ga('send', 'event', {
            eventCategory: 'Outbound Link',
            eventAction: 'click',
            eventLabel: event.currentTarget.href,
            transport: 'beacon'
        });
    }

    /**
     * Services page tabs
     **/

    var Tabs = {
        init: function (config) {
            this.config = config;
            this.processTabs();
            this.hideTabs();

            var windowWidth = window.innerWidth;

            $(window).on('resize', function () {
                if (window.innerWidth !== windowWidth){
                    windowWidth = window.innerWidth;
                    Tabs.hideTabs();
                    if(windowWidth > resBreakpoint){
                        $('#mobileTab').empty();
                        $(Tabs.config.tabBtn).removeClass('open');
                        $('#container').find('.services-content').show();
                    }
                }
            })
        },

        processTabs: function () {
            var self = Tabs,
                $container = $('#container');

            this.config.tabs.find(this.config.tab).each(function (index, elem) {
                $(elem).on('click', self.config.tabBtn, function () {

                    if(window.innerWidth < resBreakpoint){
                        $("html, body").scrollTop(0);
                        $('.preloader').show().delay(100).fadeOut("slow");
                        var $content = $(elem).find(self.config.tabContent)[0].innerHTML;
                        $container.find('.services-content').hide();
                        $container.find('#mobileTab').prepend($content);

                        $('.back-arrow').on('click', function (event) {
                            $content.hide();
                            event.preventDefault();
                            $container.find('.services-content').show();
                        })
                    } else {
                        if($(this).hasClass('open')){
                            $(this).removeClass('open');
                            $(elem).find(self.config.tabContent).slideUp();
                        } else {
                            $(this).addClass('open');
                            $(elem).find(self.config.tabContent).slideDown();
                        }
                    }
                });
            })
        },

        hideTabs: function () {
            this.config.tabs.find(this.config.tabContent).hide();
        }
    };

    /**
     * Init
     */

    $(window).on('load', function () {
        $('.preloader').delay(200).fadeOut("slow");

        if(window.location.hash === '#contact-us'){
            Intercom('show');
        }
    });

    $(function () {

        if(window.location.pathname === '/'){

            var $section = $('.section'),
                parallax;

            changeText();
            scrollToAnchor($('a.scroll-to-anchor[href^="#"]'));

            if (isSafari) {
                $('body').addClass('isSafari');
                $('.animatedPolygons').remove();
            }

            $.extend(Scrollax.defaults, {
                performanceTrick: true
            });

            if (!isSafari) {
                parallax = new Scrollax();
                processParallax(parallax);
            }

            $(window).resize(function () {
                if (!isSafari) {
                    parallax.reload();
                    processParallax(parallax);
                }
            });

            if (!window.isMobile) {
                $('#main').fullpage({
                    lazyLoading: true,
                    navigation: true,
                    scrollBar: true,
                    scrollingSpeed: 1000,
                    responsiveWidth: resBreakpoint,
                    navigationPosition: 'right',
                    touchSensitivity: 15,
                    css3: true
                });
            }

            $(window).on('scroll', function () {
                changeHeaderOnScroll();
                hoverActiveLink($('.nav__link.scroll-to-anchor[href^="#"]'));
                if (window.innerWidth >= resBreakpoint) {
                    window.requestAnimationFrame(function () {
                        sectionBgChange.init({
                            section: $section,
                            container: $('#bgChange')
                        })}
                    );
                }
            });
        }

        $(window).scrollTop() > 50 ? $(".header").addClass('bg-header') : $(".header").removeClass('bg-header');

        $(window).on('scroll', function () {
            $(window).scrollTop() > 50 ? $(".header").addClass('bg-header') : $(".header").removeClass('bg-header');
        });

        var $footerForm = $('#footerEmailForm');

        if ($footerForm.length > 0) {
            $($footerForm.find('input[type="submit"]')).bind('click', function (event) {
                if (event) event.preventDefault();
                subscribeForNews($footerForm);
            })
        }

        $('.intercomBtn').on('click', function () {
            event.preventDefault();
            Intercom('show');
        });

        $('.track-link').on('click', function (event) {
            handleOutboundLinkClicks(event);
        });

        MobileMenu.init({
            footerBar: $('#footerLinks'),
            menuBtn: $('#mobileBtn'),
            classToBodyAdd: 'mobile-menu-visible',
            navbar: $('#headerNav'),
            navItem: $('.nav__item')
        });

        Validation.init({
            form: $('#footerEmailForm'),
            btn: $('#footerSubscribeBtn'),
            field: $('#footer-email')
        });

        Tabs.init({
            tabs: $('.tabs'),
            tab: '.tab',
            tabBtn: '.tab__btn',
            tabContent: '.tab__content'
        });

    });
})(jQuery);
