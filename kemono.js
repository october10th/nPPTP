var observer;
var domSelector = 'img, a, figure, div';

function createObserver () {
   return new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0 ) {
                mutation.addedNodes.forEach(function (node) {
                    if (node) {
                        replaceImages(domSelector, node);
                    }
                });
            }
        });

        observer.disconnect();
        runObserver();
    });
}

function runObserver () {
    // kemono
    chrome.runtime.sendMessage({msg: 'getDisabled'}, function(response) {
        if (!response.disabled) {
            replaceImages(domSelector);
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            observer = createObserver();
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });
};
runObserver();

function replaceImages(selector, node) {
    var objects;
    if (node) {
        if (node.querySelectorAll) {
            objects = [ node, ...node.querySelectorAll(selector) ];
        } else {
            objects = [ node ];
        }
    } else {
        objects = document.querySelectorAll(selector);
    }
    var imagePrefix = 'https://pbs.twimg.com/media/';
    var imageSrcs = [
        'DRFcbJhVoAY6T77.jpg',  // POP w
        'DQ2WFD-VwAE0rE9.jpg',  // DVD vol.1
        'DQ2WFECVwAEVvqo.jpg',  // BD  vol.1
        'DTVKzXPU8AA2JUQ.jpg',  // shop 2nd season
        'DESeFnBVYAApYEF.jpg',  // shop
        'DESd43RVYAAIiYC.jpg',  // sit
        'DTFh5QrU8AAjKId.jpg',  // POP  凸
        'DTFh5QqV4AAYrB1.jpg',  // PIPI 凸
        'DCsMgrzVwAAswg0.jpg',  // POP  < o w o >
        'DCsMgtQUIAAQTpq.jpg',  // PIPI \ o w o /
        'C_N3IyIUwAAk9Bu.jpg',  // POP PIPI
        'C8VhpcMVYAQugj7.jpg',  // PIPI / o w o \
        'C8VhilbU0AEzsdG.jpg',  // POP  / o w o \
        'C8VfhXbUMAQbOgs.jpg',  // snow
        'DTvfza4VAAE8u8h.jpg',  // scramble
        'DTvf2MeUQAEoVlE.jpg',  // ball
        'DT_3DC1VQAE1Cth.jpg',  // ボブネミミッミ
        'DUHBJRJVAAEWvZs.jpg'   // 6

        
    ];
    for (var i = 0; i < objects.length; i++) {
        var imgSrc = imagePrefix + imageSrcs[Math.floor(Math.random()*imageSrcs.length)];
        var object = objects[i];

        if (object.classList && object.classList.contains('kemono-injected')) {
            continue;
        }

        if (object.src && 'IMG' === object.tagName) {
            // adjust width & height before replace it
            if (object.srcset) {
                object.removeAttribute('srcset');
            }
            if (object.getAttribute('ori-src')) {
                object.removeAttribute('ori-src');
            }
            if (object.getAttribute('data-original')) {
                object.removeAttribute('data-original');
            }
            if (object.getAttribute('data-orig-file')) {
                object.removeAttribute('data-orig-file');
            }
            if (object.style) {
                if (!object.outerHTML.match('width=')) {
                    if (object.clientWidth > 1) {
                        object.style.width = object.clientWidth + 'px';
                    } else {
                        if (!object.style.width) {
                            object.style.maxWidth = '100%';
                        }
                    }
                } else {
                    if (object.width > 2) {
                        object.style.width = object.width + 'px';
                    }
                }
                if (!object.outerHTML.match('height=')) {
                    if (object.clientHeight > 1) {
                        object.style.height = object.clientHeight + 'px';
                    } else {
                        if (!object.style.height) {
                            object.style.height = 'auto';
                        }
                    }
                } else {
                    if (object.width > 2) {
                        object.style.height = object.height + 'px';
                    }
                }
                if (!object.style.objectFit) {
                    object.style.objectFit = 'cover';
                }
            }
            object.setAttribute('kemono-orig-src', object.src);
            object.setAttribute('kemono-src', imgSrc);
            object.onmouseover = function () {
                this.src = this.getAttribute('kemono-orig-src');
            };
            object.onmouseout = function () {
                this.src = this.getAttribute('kemono-src');
            };
            object.src = object.getAttribute('kemono-src');
            object.classList.add('kemono-injected');
        } else if (object.style && undefined !== object.style.backgroundImage && '' !== object.style.backgroundImage) {
            object.setAttribute('kemono-orig-bgimg', object.style.backgroundImage);
            object.setAttribute('kemono-orig-bgpos', object.style.backgrounPosition);
            object.setAttribute('kemono-bgimg', "url('" + imgSrc + "')");
            object.setAttribute('kemono-bgpos', 'center');
            object.onmouseover = function () {
                this.style.backgroundImage = this.getAttribute('kemono-orig-bgimg');
                this.style.backgroundImage = this.getAttribute('kemono-orig-bgpos');
            };
            object.onmouseout = function () {
                this.style.backgroundImage = this.getAttribute('kemono-bgimg');
                this.style.backgroundImage = this.getAttribute('kemono-bgpos');
            };
            object.style.backgroundImage = object.getAttribute('kemono-bgimg');
            object.style.backgroundImage = object.getAttribute('kemono-bgpos');
            object.classList.add('kemono-injected');
        }
    }
}