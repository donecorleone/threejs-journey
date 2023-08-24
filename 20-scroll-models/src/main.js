// Parallax effect

window.addEventListener('scroll', function() {
    var scrolled = window.scrollY;
    document.querySelector('.wrapper').style.backgroundPositionY = -(scrolled * 0.5) + 'px';
});
