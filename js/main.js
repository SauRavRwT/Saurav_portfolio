(function($) {

    "use strict";
    /* Preloader */
    $(window).load(function() {

        // will first fade out the loading animation 
        $("#loader").fadeOut("slow", function() {

            // will fade out the whole DIV that covers the website.
            $("#preloader").delay(300).fadeOut("slow");

        });

    })

    /* FitText Settings */
    setTimeout(function() {

        $('#intro h1').fitText(1, { minFontSize: '42px', maxFontSize: '84px' });

    }, 100);

    /* FitVids */
    $(".fluid-video-wrapper").fitVids();

    /* Owl Carousel */
    $("#owl-slider").owlCarousel({
        navigation: false,
        pagination: true,
        itemsCustom: [
            [0, 1],
            [700, 2],
            [960, 3]
        ],
        navigationText: false
    });

    /* Alert Boxes */
    $('.alert-box').on('click', '.close', function() {
        $(this).parent().fadeOut(500);
    });

    /* Stat Counter */
    var statSection = $("#stats"),
        stats = $(".stat-count");

    statSection.waypoint({

        handler: function(direction) {

            if (direction === "down") {

                stats.each(function() {
                    var $this = $(this);

                    $({ Counter: 0 }).animate({ Counter: $this.text() }, {
                        duration: 4000,
                        easing: 'swing',
                        step: function(curValue) {
                            $this.text(Math.ceil(curValue));
                        }
                    });
                });

            }

            // trigger once only
            this.destroy();

        },

        offset: "90%"

    });

    /*	Masonry */
    var containerProjects = $('#folio-wrapper');

    containerProjects.imagesLoaded(function() {

        containerProjects.masonry({
            itemSelector: '.folio-item',
            resize: true
        });

    });

    /*	Modal Popup*/
    $('.item-wrap a').magnificPopup({

        type: 'inline',
        fixedContentPos: false,
        removalDelay: 300,
        showCloseBtn: false,
        mainClass: 'mfp-fade'

    });

    $(document).on('click', '.popup-modal-dismiss', function(e) {
        e.preventDefault();
        $.magnificPopup.close();
    });

    /* Navigation Menu */
    var toggleButton = $('.menu-toggle'),
        nav = $('.main-navigation');

    // toggle button
    toggleButton.on('click', function(e) {

        e.preventDefault();
        toggleButton.toggleClass('is-clicked');
        nav.slideToggle();

    });

    // nav items
    nav.find('li a').on("click", function() {

        // update the toggle button 		
        toggleButton.toggleClass('is-clicked');
        // fadeout the navigation panel
        nav.fadeOut();

    });

    /* Highlight the current section in the navigation bar */
    var sections = $("section"),
        navigation_links = $("#main-nav-wrap li a");

    sections.waypoint({

        handler: function(direction) {

            var active_section;

            active_section = $('section#' + this.element.id);

            if (direction === "up") active_section = active_section.prev();

            var active_link = $('#main-nav-wrap a[href="#' + active_section.attr("id") + '"]');

            navigation_links.parent().removeClass("current");
            active_link.parent().addClass("current");

        },

        offset: '25%'
    });

    /* Smooth Scrolling */
    $('.smoothscroll').on('click', function(e) {

        e.preventDefault();

        var target = this.hash,
            $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 800, 'swing', function() {
            window.location.hash = target;
        });

    });

    /*  Placeholder Plugin Settings */
    $('input, textarea, select').placeholder()

    /* Back to top- */
    var pxShow = 300; // height on which the button will show
    var fadeInTime = 400; // how slow/fast you want the button to show
    var fadeOutTime = 400; // how slow/fast you want the button to hide
    var scrollSpeed = 300; // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'

    // Show or hide the sticky footer button
    jQuery(window).scroll(function() {

        if (!($("#header-search").hasClass('is-visible'))) {

            if (jQuery(window).scrollTop() >= pxShow) {
                jQuery("#go-top").fadeIn(fadeInTime);
            } else {
                jQuery("#go-top").fadeOut(fadeOutTime);
            }

        }

    });

})(jQuery);

/* papers by Saurav */

class Papers {
    constructor() {
        this.API_KEY = '563492ad6f917000010000015f532079745045e6a142bbab439bbf3d';
        this.galleryDIv = document.querySelector('.gallery');
        this.searchForm = document.querySelector('.header form');
        this.loadMore = document.querySelector('.load-more');
        this.paperslogo = document.querySelector('.paperslogo')
        this.pageIndex = 1;
        this.searchValueGlobal = '';
        this.eventHandle();
    }
    eventHandle() {
        document.addEventListener('DOMContentLoaded', () => {
            this.getImg(1);
        });
        this.searchForm.addEventListener('submit', (e) => {
            this.pageIndex = 1;
            this.getSearchedImages(e);
        });
        this.loadMore.addEventListener('click', (e) => {
            this.loadMoreImages(e);
        })
        this.paperslogo.addEventListener('click', () => {
            this.pageIndex = 1;
            this.galleryDIv.innerHTML = '';
            this.getImg(this.pageIndex);
        })
    }
    async getImg(index) {
        this.loadMore.setAttribute('data-img', 'curated');
        const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos)
        console.log(data)
    }
    async fetchImages(baseURL) {
        const response = await fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: this.API_KEY
            }
        });
        const data = await response.json();
        // console.log(data);
        return data;
    }
    GenerateHTML(photos) {
        photos.forEach(photo => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
		<a href='${photo.src.original}' data-lightbox="mygallary" data-title="${photo.photographer}">
		  <img src="${photo.src.medium}">
		  <h3>${photo.photographer}</h3>
		</a>
		<a href='${photo.src.large}' target="_blank" download="${photo.src.large}">
		  <img class="photo-download_info" src="./images/download.png">
		</a>
		`;
            this.galleryDIv.appendChild(item)
        })
    }

    async getSearchedImages(e) {
        this.loadMore.setAttribute('data-img', 'search');
        e.preventDefault();
        this.galleryDIv.innerHTML = '';
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue;
        const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
        e.target.reset();
    }
    async getMoreSearchedImages(index) {
        // console.log(searchValue)
        const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`
        const data = await this.fetchImages(baseURL);
        console.log(data)
        this.GenerateHTML(data.photos);
    }
    loadMoreImages(e) {
        let index = ++this.pageIndex;
        const loadMoreData = e.target.getAttribute('data-img');
        if (loadMoreData === 'curated') {
            // load next page for curated]
            this.getImg(index)
        } else {
            // load next page for search
            this.getMoreSearchedImages(index);
        }
    }
}

const gallery = new Papers;

/* Quote Script */
const api = "https://api.quotable.io/random";

const quote = document.getElementById("quote");
const author = document.getElementById("author");
const btn = document.getElementById("btn");

btn.addEventListener("click", getQuote);
var interval = setInterval(function() { getQuote() }, 20000);

function getQuote() {
    fetch(api)
        .then((res) => res.json())
        .then((data) => {
            quote.innerHTML = `"${data.content}"`;
            author.innerHTML = `- ${data.author}`;
        });
}