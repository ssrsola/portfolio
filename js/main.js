$(function () {
  const $menubar = $("#menubar");
  const $menubarHdr = $("#menubar_hdr");
  const breakPoint = 9999;
  const HIDE_MENUBAR_IF_HDR_HIDDEN = false;

  // タッチデバイス判定
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  //処理の呼び出し頻度を抑制
  function debounce(fn, wait) {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
    };
  }

  // ドロップダウン用の初期化
  function initDropdown($menu, isTouch) {
    $menu.find("ul li").each(function () {
      if ($(this).find("ul").length) {
        $(this).addClass("ddmenu_parent");
        $(this).children("a").addClass("ddmenu");
      }
    });

    if (isTouch) {
      $menu.find(".ddmenu").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const $dropdownMenu = $(this).siblings("ul");
        if ($dropdownMenu.is(":visible")) {
          $dropdownMenu.hide();
        } else {
          $menu.find(".ddmenu_parent ul").hide();
          $dropdownMenu.show();
        }
      });
    } else {
      // PCの場合はホバーで開閉
      $menu.find(".ddmenu_parent").hover(
        function () {
          $(this).children("ul").show();
        },
        function () {
          $(this).children("ul").hide();
        }
      );
    }
  }

  // ハンバーガーメニュー
  function initHamburger($hamburger, $menu) {
    $hamburger.on("click", function () {
      $(this).toggleClass("ham");
      if ($(this).hasClass("ham")) {
        $menu.show();
        if ($(window).width() < breakPoint) {
          $("body").addClass("noscroll");
        }
      } else {
        $menu.hide();
        if ($(window).width() < breakPoint) {
          $("body").removeClass("noscroll");
        }
      }
      $menu.find(".ddmenu_parent ul").hide();
    });
  }

  // レスポンシブ
  const handleResize = debounce(function () {
    const windowWidth = $(window).width();
    if (windowWidth < breakPoint) {
      $("body").removeClass("large-screen").addClass("small-screen");
    } else {
      $("body").removeClass("small-screen").addClass("large-screen");
      $menubarHdr.removeClass("ham");
      $menubar.find(".ddmenu_parent ul").hide();
      $("body").removeClass("noscroll");
      if (HIDE_MENUBAR_IF_HDR_HIDDEN) {
        $menubarHdr.hide();
        $menubar.hide();
      } else {
        $menubarHdr.hide();
        $menubar.show();
      }
    }

    // スマホ
    if (windowWidth < breakPoint) {
      $menubarHdr.show();
      if (!$menubarHdr.hasClass("ham")) {
        $menubar.hide();
        $("body").removeClass("noscroll");
      }
    }
  }, 200);

  // 初期化
  initDropdown($menubar, isTouchDevice);
  initHamburger($menubarHdr, $menubar);
  handleResize();
  $(window).on("resize", handleResize);

  // アンカーリンクのクリックイベント
  $menubar.find('a[href^="#"]').on("click", function () {
    if ($(this).hasClass("ddmenu")) return;

    if ($menubarHdr.is(":visible") && $menubarHdr.hasClass("ham")) {
      $menubarHdr.removeClass("ham");
      $menubar.hide();
      $menubar.find(".ddmenu_parent ul").hide();
      $("body").removeClass("noscroll");
    }
  });
});

// スムーススクロール
$(function () {
  var topButton = $(".pagetop");
  var scrollShow = "pagetop-show";

  function smoothScroll(target) {
    var scrollTo = target === "#" ? 0 : $(target).offset().top;
    $("html, body").animate({ scrollTop: scrollTo }, 500);
  }

  $('a[href^="#"], .pagetop').click(function (e) {
    e.preventDefault();
    var id = $(this).attr("href") || "#";
    smoothScroll(id);
  });

  $(topButton).hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() >= 300) {
      $(topButton).fadeIn().addClass(scrollShow);
    } else {
      $(topButton).fadeOut().removeClass(scrollShow);
    }
  });

  if (window.location.hash) {
    $("html, body").scrollTop(0);
    setTimeout(function () {
      smoothScroll(window.location.hash);
    }, 10);
  }
});

// スライドショー
$(document).ready(function () {
  $(".img").each(function () {
    var $imgParts = $(this);
    var $divs = $imgParts.children("div");
    var divCount = $divs.length;

    var divWidth = 100 / (divCount * 2);

    var animationTime = (divCount / 4) * 20 + "s";
    var slideWidth = (divCount / 4) * 200 + "%";

    $divs.css({
      flex: "0 0 " + divWidth + "%",
      width: divWidth + "%",
    });

    $imgParts.css({
      "animation-duration": animationTime,
      width: slideWidth,
    });

    $divs.clone().appendTo($imgParts);

    $imgParts.on("mouseenter", function () {
      $(this).css("animation-play-state", "paused");
    });

    $imgParts.on("mouseleave", function () {
      $(this).css("animation-play-state", "running");
    });
  });
});

// リストの開閉
$(function () {
  $(".btn5-container").on("click", function () {
    $(".ta1-container").slideToggle();
  });
});

// ポップアップ
$(function () {
  if (!sessionStorage.getItem("popupShown")) {
    setTimeout(function () {
      if ($("#popup2-overlay").length) {
        $("#popup2-overlay").fadeIn(300);
      }
      $("#popup").fadeIn(300);
      sessionStorage.setItem("popupShown", "true");
    }, 5000);
  }

  $(".close-btn").click(function () {
    $("#popup").fadeOut(300);
    if ($("#popup2-overlay").length) {
      $("#popup2-overlay").fadeOut(300);
    }
  });
});
