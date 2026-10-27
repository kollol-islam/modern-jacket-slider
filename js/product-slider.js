        $(document).ready(function() {

            //  Product Slider
            var $slider = $('.product-slider'),
                $items = $slider.find('.product-item'),
                total = $items.length,
                current = 0,
                busy = false,
                timer,
                speed = 1100,
                autoplayTimeout = 3200;

            function layout() {
                $items.removeClass('out next queue');
                $items.each(function(i) {
                    if (i === current) return;
                    if (i === (current + 1) % total) {
                        $(this).addClass('next');
                    } else if (i === (current + 2) % total) {
                        $(this).addClass('queue');
                    } else {
                        $(this).addClass('out');
                    }
                });
                $slider.css('background-color', $items.eq(current).data('bg'));
            }

            function goTo(dir) {
                if (busy) return;
                busy = true;

                var prev = current;
                current = (current + dir + total) % total;

                if (dir > 0) {
                    $items.eq(prev).addClass('out');
                } else {
                    // going back: incoming item returns from the top-left
                    $items.eq(current).css('transition', 'none').addClass('out');
                    $items.eq(current)[0].offsetWidth; // reflow
                    $items.eq(current).css('transition', '');
                }
                layout();

                setTimeout(function() {
                    busy = false;
                }, speed);
                restart();
            }

            function restart() {
                clearInterval(timer);
                timer = setInterval(function() {
                    goTo(1);
                }, autoplayTimeout);
            }

            $slider.on('click', '.product-next', function() {
                goTo(1);
            });
            $slider.on('click', '.product-prev', function() {
                goTo(-1);
            });
            $slider.on('mouseenter', function() {
                clearInterval(timer);
            }).on('mouseleave', restart);

            // Size select
            $slider.on('click', '.product-size li', function() {
                $(this).siblings('.active').removeClass('active');
                $(this).addClass('active');
            });

            // Swipe (mobile)
            var startX = null;
            $slider.on('touchstart', function(e) {
                startX = e.originalEvent.touches[0].clientX;
            }).on('touchend', function(e) {
                if (startX === null) return;
                var dx = e.originalEvent.changedTouches[0].clientX - startX;
                startX = null;
                if (Math.abs(dx) > 40) goTo(dx < 0 ? 1 : -1);
            });

            // initial state (no animation on first paint)
            $items.css('transition', 'none');
            layout();
            $slider[0].offsetWidth; // reflow
            $items.css('transition', '');
            restart();

        });
