
const body = document.querySelector('body'),
  html = document.querySelector('html'),
  menu = document.querySelectorAll('._burger, .header__nav, body'),
  burger = document.querySelector('._burger'),
  header = document.querySelector('.header');

  function copyToClipboard(el) {

    // resolve the element
    el = (typeof el === 'string') ? document.querySelector(el) : el;

    // handle iOS as a special case
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {

        // save current contentEditable/readOnly status
        var editable = el.contentEditable;
        var readOnly = el.readOnly;

        // convert to editable with readonly to stop iOS keyboard opening
        el.contentEditable = true;
        el.readOnly = true;

        // create a selectable range
        var range = document.createRange();
        range.selectNodeContents(el);

        // select the range
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        el.setSelectionRange(0, 999999);

        // restore contentEditable/readOnly to original state
        el.contentEditable = editable;
        el.readOnly = readOnly;
    }
    else {
      navigator.clipboard.writeText(el.value)
        .then(() => {
          alert('copied');
        })
        .catch(err => {
          console.log('Something went wrong', err);
        });
        el.select();
    }

    // execute copy command
    document.execCommand('copy');
}

let thisTarget;
body.addEventListener('click', function (event) {

  thisTarget = event.target;

  let burger = thisTarget.closest('._burger');
  if (burger) {
    menu.forEach(elem => {
      elem.classList.toggle('_active')
    })
  }


  let themeBtn = thisTarget.closest('._theme-btn');
  if (themeBtn) {
    if (themeBtn.classList.contains('_to-light-theme')) {

      localStorage.setItem('theme', 'light');

      themeBtn.classList.add('_to-dark-theme');
      themeBtn.classList.remove('_to-light-theme');

      body.classList.add('_light-theme');
      body.classList.remove('_dark-theme');

    } else if (themeBtn.classList.contains('_to-dark-theme')) {

      localStorage.setItem('theme', 'dark');

      themeBtn.classList.add('_to-light-theme');
      themeBtn.classList.remove('_to-dark-theme');

      body.classList.add('_dark-theme');
      body.classList.remove('_light-theme');

    }
  }



  let btnToScroll = thisTarget.closest('._btn-to-scroll');
  if (btnToScroll) {
    event.preventDefault();
    let section;

    section = document.querySelector(btnToScroll.getAttribute('href'))

    menu.forEach(elem => {
      elem.classList.remove('_active')
    })

    window.scroll({
      left: 0,
      top: (section) ? section.offsetTop : 0,
      behavior: 'smooth'
    })

  }



  let copyBtn = thisTarget.closest('._copy-input-btn');
  if (copyBtn) {
    event.preventDefault();

    let input = copyBtn.parentNode.querySelector('._copy-input'),
      rng = document.createRange();

    if (input) {
      /* copyToClipboard(input.value); */
      /* navigator.clipboard.writeText(input.value)
        .then(() => {
          alert('copied');
        })
        .catch(err => {
          console.log('Something went wrong', err);
        }); */
      copyToClipboard(input)
      



    }

  }

})


function getCoords(elem) {
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };

}


function scrollPage() {

  const offsetCheckJs = document.querySelector('.offset-check-js');
  let top = [getCoords(offsetCheckJs).top, false];

  header.classList.add('_loaded');

  function scrollPageFunc() {
    top[0] = getCoords(offsetCheckJs).top;

    if (top[0] >= 300 && top[1] == false) {

      top[1] = true;
      header.style.setProperty('--pos', '-100%');

      setTimeout(function () {
        header.classList.add('_active');
        header.style.setProperty('--pos', '0%');
      }, 200);

    } else if (top[0] <= 300 && top[1] == true) {

      top[1] = false;
      header.style.setProperty('--pos', '-100%');

      setTimeout(function () {
        header.style.setProperty('--pos', '0%');
        header.classList.remove('_active');

      }, 200);

    }
  }

  scrollPageFunc();

  window.onscroll = scrollPageFunc;

}

scrollPage();




function randomTransactions(arguments) {
  let listTransactions = document.querySelector('.last-transactions__list');

  let randomSentMax = (arguments.maxSent) ? arguments.maxSent : 100;
  randomReceivedMax = (arguments.maxReceived) ? arguments.maxReceived : 100,

    maxItems = (arguments.maxItems) ? arguments.maxItems + 1 : 11;


  if (listTransactions) {

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
    const allNumbers = [..."0123456789"];

    const base = [...allNumbers, ...allLowerAlpha];

    const generatorAdress = (base, len) => {
      return [...Array(len)]
        .map(i => base[Math.random() * base.length | 0])
        .join('');
    };

    function appendItem() {
      let address = '0x' + generatorAdress(base, 23),

        date = new Date(),
        dateSpan = '';

      (date.getHours() <= 9) ? dateSpan += '0' + date.getHours() : dateSpan += date.getHours();
      dateSpan += ':';
      (date.getMinutes() <= 9) ? dateSpan += '0' + date.getMinutes() : dateSpan += date.getMinutes()
      dateSpan += ':';
      (date.getSeconds() <= 9) ? dateSpan += '0' + date.getSeconds() : dateSpan += date.getSeconds(),

        randowSentValue = getRandomInt(randomSentMax),
        randowReceivedValue = getRandomInt(randomReceivedMax);

      if (randowSentValue < 2) {
        randowSentValue = 1;
      }

      if (randowReceivedValue < 2) {
        randowReceivedValue = 1;
      }

      let listItem =
        `<li class="last-transactions__item">
      <span class="last-transactions__item--elem">
          ${address}
      </span>
      <span class="last-transactions__item--elem">
          ${randowSentValue} WAX
      </span>
      <span class="last-transactions__item--elem">
          ${randowReceivedValue} WAX
      </span>
      <span class="last-transactions__item--elem">
          ${dateSpan}
      </span>
      </li>`;

      listTransactions.insertAdjacentHTML('afterbegin', listItem);

    }

    if (!arguments.disableStart) {
      for (let index = 0; index < maxItems - 1; index++) {
        appendItem();
      }
      let items = document.querySelectorAll('.last-transactions__item');
      if (items[0]) {

        items.forEach(element => {
          element.classList.add('_visible');
        })

      }
    }




    setInterval(() => {

      appendItem();

      setTimeout(() => {
        let item = document.querySelectorAll('.last-transactions__item');
        if (item[0]) {
          item[0].classList.add('_visible');
          if (item.length >= maxItems) {
            item[item.length - 1].classList.remove('_visible');
            setTimeout(() => {
              item[item.length - 1].remove();
            }, (arguments.visibleTimeout) ? arguments.visibleTimeout : 1000);
          }
        }


      }, (arguments.visibleTimeout) ? arguments.visibleTimeout : 1000)

    }, (arguments.interval) ? arguments.interval : 3000)

  }
}


randomTransactions({

  maxSent: 100,
  maxReceived: 100,

  maxItems: 11,

  interval: 2000,
  visibleTimeout: 500,

  //disableStart: true, // disable append random items onload page

});






/* 
// =-=-=-=-=-=-=-=-=-=-=-=- <Анимации> -=-=-=-=-=-=-=-=-=-=-=-=

wow = new WOW({
mobile:       false,
})
wow.init();

// =-=-=-=-=-=-=-=-=-=-=-=- </Анимации> -=-=-=-=-=-=-=-=-=-=-=-=

*/
