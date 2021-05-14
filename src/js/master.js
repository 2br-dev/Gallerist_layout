const PATH = "/js/";
var sameAuthor, sameStyle, otherAuthors;

$(() => {

    //= Инициализация событий ================================================
    $('body').on('mouseenter', '.info-trigger', showInfoPane);
    $('body').on('mouseleave', '.info, .image', hideInfoPane);
    $('body').on('click', '.search-trigger', openSearcher);
    $('body').on('click', '.close-search', closeSearcher);
    $('body').on('click', '.searcher', closeSearcherOutside);
    $('body').on('click', '.folder', toggleSidenavFolder);
    $(window).on('resize', updateFooterHeight);

    init();
})

//= Обработчики событий =======================================================
function toggleSidenavFolder(e){
    if(e){e.preventDefault();}
    $(this).toggleClass('expanded');
}
function closeSearcherOutside(e){
    var path = e.originalEvent.path;
    var filtered = path.filter(el => {
        return $(el).hasClass('form-wrapper');
    });

    if(!filtered.length){
        closeSearcher();
    }
}
function closeSearcher(e){
    if(e){e.preventDefault();}
    $('.searcher').removeClass('active');
}
function openSearcher(e){
    if(e){e.preventDefault();}
    $('.searcher').addClass('active');
}
function hideInfoPane(){
    if($(this).hasClass("info")){
        $(this).removeClass('active');
    }else{
        $(this).find(".info").removeClass("active");
    }
}
function showInfoPane(){
    $(this).parents(".image").find(".info").addClass("active");
}

//= Общая инициализация =======================================================
function init(){
    if($('.lazy').length){
        loadScript(PATH + "/jquery.lazy.min.js", () => {
            $('.lazy').lazy();
        })
    }

    if($('.swiper-container').length){
        loadScript(PATH + "/swiper-bundle.js", () => {

            if($('#same-author').length){
                sameAuthor = new Swiper('#same-author', swiperOptions('#same-author-navi'))
                sameAuthor.on("slideChangeTransitionEnd", () => {
                    $('.lazy').lazy();
                })
            }

            if($('#same-style').length){
                sameStyle = new Swiper('#same-style', swiperOptions('#same-style-navi'))
                sameStyle.on("slideChangeTransitionEnd", () => {
                    $('.lazy').lazy();
                })
            }

            if($('#other-authors-swiper').length){
                otherAuthors = new Swiper('#other-authors-swiper', swiperOptions('#other-authors-navi', {
                    320: {
                        slidesPerView: 1
                    },
                    1100: {
                        slidesPerView: 2
                    },
                    1600: {
                        slidesPerView: 3
                    }
                }))
                otherAuthors.on("slideChangeTransitionEnd", () => {
                    $('.lazy').lazy();
                })
            }
        })
    }

    $('.modal').modal({
        opacity: .9
    });

    $('.sidenav').sidenav();

    updateFooterHeight();
}

function swiperOptions(naviElement, breakpoints){

    if(!breakpoints){
        breakpoints = {
            320: {
                slidesPerView: 1
            },
            800: {
                slidesPerView: 2
            },
            1200: {
                slidesPerView: 3
            },
            1800: {
                slidesPerView: 4
            }
        }
    }

    return {
        breakpoints: breakpoints,
        spaceBetween: 20,
        loop: true,
        pagination: {
            el: naviElement,
            type: 'bullets',
            clickable: true
        }
    }
}

//= Загрузка внешних скриптов по необходимости ================================
loadScript = (url, callback) => {

    var script = document.createElement("script")
    script.type = "text/javascript";
  
    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }
  
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function updateFooterHeight(){
    var footerHeight = $('footer').outerHeight();
    $('.global-wrapper').css({
        marginBottom: footerHeight + "px"
    })
}

//   class Swipe{
//       constructor(element){
//           this.xDown = null;
//           this.yDown = null;
//           this.element = typeof(element) === 'string' ? document.querySelector(element) : element;


//       }
//   }