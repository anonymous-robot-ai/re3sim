window.HELP_IMPROVE_VIDEOJS = false;

// 删除与stacked相关的变量定义
// var INTERP_BASE = "./static/interpolation/stacked";
// var NUM_INTERP_FRAMES = 240;

// 删除预加载图片数组和相关函数
// var interp_images = [];
// function preloadInterpolationImages() {
//   for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
//     var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
//     interp_images[i] = new Image();
//     interp_images[i].src = path;
//   }
// }

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/

    // 删除预加载函数调用
    // preloadInterpolationImages();

    // 删除滑块相关代码
    // $('#interpolation-slider').on('input', function(event) {
    //   setInterpolationImage(this.value);
    // });
    // setInterpolationImage(0);
    // $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // 为每个轮播创建独立的状态管理
    const carouselStates = {};
    
    // 初始化所有轮播
    function initializeCarousels() {
        document.querySelectorAll('.video-carousel').forEach((track, index) => {
            const slides = track.querySelectorAll('.carousel-slide');
            const firstSlide = slides[0].cloneNode(true);
            track.appendChild(firstSlide);
            
            carouselStates[track.id] = {
                currentPosition: 1,
                slideCount: slides.length + 1
            };
            
            updateSlidePosition(track);
        });
    }

    window.moveCarousel = function(direction, carouselId) {
        const track = document.getElementById(carouselId);
        const state = carouselStates[carouselId];
        
        state.currentPosition = (state.currentPosition + direction);
        
        track.style.transition = 'transform 0.5s ease';
        updateSlidePosition(track);

        setTimeout(() => {
            if (state.currentPosition >= state.slideCount - 1) {
                track.style.transition = 'none';
                state.currentPosition = 0;
                updateSlidePosition(track);
            } else if (state.currentPosition < 0) {
                track.style.transition = 'none';
                state.currentPosition = state.slideCount - 2;
                updateSlidePosition(track);
            }
        }, 500);
    }

    function updateSlidePosition(track) {
        const state = carouselStates[track.id];
        const slideWidth = 50;
        track.style.transform = `translateX(${-state.currentPosition * slideWidth}%)`;
    }

    // 初始化所有轮播
    initializeCarousels();

    // 绑定按钮事件
    $('.prev-button').on('click', function() {
        const carouselId = $(this).closest('div').find('.video-carousel').attr('id');
        moveCarousel(-1, carouselId);
    });

    $('.next-button').on('click', function() {
        const carouselId = $(this).closest('div').find('.video-carousel').attr('id');
        moveCarousel(1, carouselId);
    });

    // 初始化滑动对比组件
    new BeforeAfter({
        id: '#example1' // 对应HTML中的容器ID
    });
})


function restartGif(imgElement) {
  const gifSrc = imgElement.src;
  imgElement.src = ''; // 清空src
  imgElement.src = gifSrc; // 重新设置src，从而重启GIF
}

class BeforeAfter {
    constructor(enteryObject) {
        const beforeAfterContainer = document.querySelector(enteryObject.id);
        const before = beforeAfterContainer.querySelector('.bal-before');
        const beforeText = beforeAfterContainer.querySelector('.bal-beforePosition');
        const afterText = beforeAfterContainer.querySelector('.bal-afterPosition');
        const handle = beforeAfterContainer.querySelector('.bal-handle');
        let widthChange = 0;

        beforeAfterContainer.querySelector('.bal-before-inset').setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;")
        window.onresize = function () {
            beforeAfterContainer.querySelector('.bal-before-inset').setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;")
        }
        before.setAttribute('style', "width: 50%;");
        handle.setAttribute('style', "left: 50%;");

        // 更新handle位置
        function updateHandlePosition(newWidth) {
            handle.style.left = `${newWidth}%`;
        }

        //touch screen event listener
        beforeAfterContainer.addEventListener("touchstart", (e) => {
            beforeAfterContainer.addEventListener("touchmove", (e2) => {
                let containerWidth = beforeAfterContainer.offsetWidth;
                let currentPoint = e2.changedTouches[0].clientX;
                let startOfDiv = beforeAfterContainer.offsetLeft;
                let modifiedCurrentPoint = currentPoint - startOfDiv;

                if (modifiedCurrentPoint > 10 && modifiedCurrentPoint < beforeAfterContainer.offsetWidth - 10) {
                    let newWidth = modifiedCurrentPoint * 100 / containerWidth;
                    before.setAttribute('style', "width:" + newWidth + "%;");
                    updateHandlePosition(newWidth);
                }
            });
        });

        //mouse move event listener
        beforeAfterContainer.addEventListener('mousemove', (e) => {
            let containerWidth = beforeAfterContainer.offsetWidth;
            widthChange = e.offsetX;
            let newWidth = widthChange * 100 / containerWidth;

            if (e.offsetX > 10 && e.offsetX < beforeAfterContainer.offsetWidth - 10) {
                before.setAttribute('style', "width:" + newWidth + "%;");
                updateHandlePosition(newWidth);
            }
        });
    }
}

// 应用到所有GIF
const allGifs = document.querySelectorAll('img[src$=".gif"]');
allGifs.forEach(gif => restartGif(gif));