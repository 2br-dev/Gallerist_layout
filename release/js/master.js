const PATH = "/js/";
var 
    sameAuthor, 
    sameStyle, 
    otherAuthors, 
    tabs, 
    datepicker, 
    sortable,
    naviSidenav,
    editorSidenav,
    chatSidenav;
var editMode = "view";

$(() => {

    //= Инициализация событий ================================================
    $('body').on('mouseenter', '.info-trigger', showInfoPane);
    $('body').on('mouseleave', '.info, .image', hideInfoPane);
    $('body').on('click', '.search-trigger', openSearcher);
    $('body').on('click', '.close-search', closeSearcher);
    $('body').on('click', '.searcher', closeSearcherOutside);
    $('body').on('click', '.folder', toggleSidenavFolder);
    $('body').on('click', '#saver', toggleEdit);
    $('body').on('click', '.datePicker', openPicker);
    $('body').on('click', '.profile-gallery-entry', selectGalleryItem);
    $(window).on('resize', updateFooterHeight);

    init();
})

//= Обработчики событий =======================================================
function selectGalleryItem(){
    $('.profile-gallery-entry').removeClass("selected");
    $(this).addClass("selected");

    if($(window).outerWidth() < 1400){
        editorSidenav.open();
    }
    console.log("Ajax-заполнение деталей картины в редакторе");
}
function dragCompleteCallback(e){
    console.log({
        "Старый индекс элемента:":e.oldIndex,
        "Новый индекс элемента:":e.newIndex
    })
}
function openPicker(e){
    e.preventDefault();
    var instance = M.Datepicker.getInstance(this);
    instance.open();
}
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

    datepicker = M.Datepicker.init(document.querySelectorAll('.datepicker'), {
        firstDay: 1,
        i18n: {
            "done": "Принять",
            "cancel": "Отмена",
            months: [
                'Январь',
                'Февраль',
                'Март',
                'Апрель',
                'Май',
                'Июнь',
                'Июль',
                'Август',
                'Сентябрь',
                'Октябрь',
                'Ноябрь',
                'Декабрь'
            ],
            monthsShort: [
                "Янв",
                "Фев",
                "Мрт",
                "Апр",
                "Май",
                "Июн",
                "Июл",
                "Авг",
                "Сен",
                "Окт",
                "Ноя",
                "Дек"
            ],
            "weekdays": [
                "Воскресенье",
                "Понедельник",
                "Вторник",
                "Среда",
                "Четверг",
                "Пятница",
                "Суббота"
            ],
            "weekdaysShort": [
                "Вс",
                "Пн",
                "Вт",
                "Ср",
                "Чт",
                "Пт",
                "Сб"
            ],
            "weekdaysAbbrev": ["В","П","В","С","Ч","П","С"]
        }
    });

    tabs = M.Tabs.init(document.querySelectorAll('.tabs'));

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

    if($('.sortable-wrapper').length){
        loadScript("/js/Sortable.min.js", () => {
            sortable = new Sortable(document.querySelector('.sortable-wrapper'), {
                animation: 150,
                onEnd: dragCompleteCallback,
                handle: '.drag-handler'
            })
        });
    }

    $('.modal').modal({
        opacity: .9
    });

    naviSidenav = M.Sidenav.init(document.querySelector('#mobile-navi'));

    if($('#gallery-editor').length){
        editorSidenav = M.Sidenav.init(document.querySelector('#gallery-editor'), {
            edge: "right"
        });
    }

    if($('#chat-sidenav').length){
        chatSidenav = M.Sidenav.init(document.querySelector('#chat-sidenav'), {
            edge: "right"
        });
    }

    $('.chips').chips();

    updateFooterHeight();
}

function toggleEdit(e){

    e.preventDefault();

    var editHtml = "Редактировать <span class='gold-text'>профиль</span>";
    var saveHtml = "Сохранить <span class='gold-text'>изменения</span>";

    editMode = editMode == "edit" ? "view" : "edit";

    if(editMode == "edit"){
        $(".hidden-input").addClass("obvious");
        $(".datepicker").removeClass("hidden");
        $(this).html(saveHtml);
    }else{
        $(".hidden-input").removeClass("obvious");
        $(".datepicker").addClass("hidden");
        $(this).html(editHtml);

        // Ajax-запрос на сохранение
        // И уведомление о результатах запроса
        M.toast({html: "Изменения успешно внесены!"});
    }
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