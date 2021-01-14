// ------ Function-Wrapper ------
const startVirtualKeyboard = () => {

  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition


  // ------ Create Main Elements ------
  const createMainElements = () => {
    document.body.innerHTML += `<div class="keyboard keyboard--hidden"><div class="keyboard-keys"></div></div>`
  }
  createMainElements()

  const keyValuesEng = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
    "close", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
    "capslock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
    "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "EN",
    "hear", "rec", "space", "arrowL", "arrowR",
  ]

  const keyValuesRu = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
    "close", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
    "capslock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
    "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "RU",
    "hear", "rec", "space", "arrowL", "arrowR",
  ]


  // ------ DOM Elements ------
  const keyboard = document.querySelector('.keyboard'),
    keyboardKeysBlock = document.querySelector('.keyboard-keys'),
    textarea = document.querySelector('.use-keyboard-input'),
    audioSimbolEn = document.querySelector('.audio-symbol-en'),
    audioSimbolRu = document.querySelector('.audio-symbol-ru'),
    audioBackspace = document.querySelector('.audio-backspace'),
    audioCaps = document.querySelector('.audio-caps'),
    audioEnter = document.querySelector('.audio-enter'),
    audioShift = document.querySelector('.audio-shift')


  // ----- Other Constants -----
  const regexp = /keyboard__key--active/,
    recognation = new SpeechRecognition()


  // ----- Variables -----
  let capsOn = false,
    shiftOn = false,
    generatedKeys,
    keyboardLang = 'EN',
    textareaTimerId,
    carret,
    shiftInActive = false,
    carretTimer,
    leftText,
    rightText,
    volumeOff = false,
    microphoneOn = false


  // ----- Create keys in DOM -----

  const createKeys = obj => {
    obj.forEach(elem => {

      switch (elem) {
        case 'backspace':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key--wide" type="button"><i class="material-icons">backspace</i></button><br>`
          break

        case 'close':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key--wide keyboard__key--dark" type="button"><i class="material-icons">check_circle</i></button>`
          break

        case ']':
        case 'ъ':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key" type="button">${elem}</button><br>`
          break

        case 'capslock':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key--wide keyboard__key--activatable" type="button"><i class="material-icons">keyboard_capslock</></button><br>`
          break

        case 'enter':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key--wide" type="button"><i class="material-icons">subdirectory_arrow_left</i></button><br>`
          break

        case 'shift':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key--wide keyboard__key--activatable" type="button">Shift</button>`
          break

        case 'EN':
        case 'RU':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key--wide" type="button">${elem}</button><br>`
          break

        case 'hear':
          if (volumeOff) {
            keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key-wide keyboard__key--activatable keyboard__key--active" type="button"><i class="material-icons" id="rec">volume_off</i></button>`
          } else {
            keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key-wide keyboard__key--activatable" type="button"><i class="material-icons" id="rec">volume_off</i></button>`
          }
          break

        case 'rec':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key-wide keyboard__key--activatable" type="button"><i class="material-icons" id="rec">micro</i></button>`
          break

        case 'space':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key--extra-wide" type="button"><i class="material-icons">space_bar</i></button>`
          break

        case 'arrowL':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key-wide" type="button"><i class="material-icons">arrow_back</i></button>`
          break

        case 'arrowR':
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key keyboard__key-wide" type="button"><i class="material-icons">arrow_forward</i></button>`
          break

        default:
          keyboardKeysBlock.innerHTML += `<button class="keyboard__key" type="button">${elem}</button>`
          break
      }
    })
  }
  createKeys(keyValuesEng)

  generatedKeys = document.querySelectorAll('.keyboard__key')

  const listenText = () => {
    leftText = textarea.value.slice(0, carret)
    rightText = textarea.value.slice(carret)
    setTimeout(listenText)
  }
  listenText()


  // ----- Audio for buttons -----
  const onAudioSimbolEng = () => {
    if (!volumeOff) {
      audioSimbolEn.currentTime = 0
      audioSimbolEn.play()
    }
  }

  const onAudioSimbolRu = () => {
    if (!volumeOff) {
      audioSimbolRu.currentTime = 0
      audioSimbolRu.play()
    }
  }

  const onAudioBackspace = () => {
    if (!volumeOff) {
      audioBackspace.currentTime = 0
      audioBackspace.play()
    }
  }

  const onAudioCaps = () => {
    if (!volumeOff) {
      audioCaps.currentTime = 0
      audioCaps.play()
    }
  }

  const onAudioEnter = () => {
    if (!volumeOff) {
      audioEnter.currentTime = 0
      audioEnter.play()
    }
  }

  const onAudioShift = () => {
    if (!volumeOff) {
      audioShift.currentTime = 0
      audioShift.play()
    }
  }

  // ----- Click Keys -----
  const clickSimbol = (elem) => {

    if (keyboardLang === 'EN') {
      onAudioSimbolEng()
    } else {
      onAudioSimbolRu()
    }

    textarea.value = `${leftText}${(elem.target.innerText)}${rightText}`
    carret += 1
    textarea.selectionStart = carret
    textarea.setSelectionRange(carret, carret)
  }

  const variationRegisterSymbols = () => {
    if (capsOn || shiftOn) {

      if (capsOn && shiftOn) {
        generatedKeys.forEach(elem => {
          if (elem.innerText.length === 1) {
            elem.innerText = elem.innerText.toLowerCase()
          }
        })
      } else {
        generatedKeys.forEach(elem => {
          if (elem.innerText.length === 1) {
            elem.innerText = elem.innerText.toUpperCase()
          }
        })
      }

    } else {
      generatedKeys.forEach(elem => {
        if (elem.innerText.length === 1) {
          elem.innerText = elem.innerText.toLowerCase()
        }
      })
    }
  }

  const clickCapsLock = (elem) => {

    onAudioCaps()
    let checkPresenceClass

    if (elem.type === 'click') {
      elem.currentTarget.classList.toggle('keyboard__key--active')
      checkPresenceClass = regexp.test(elem.currentTarget.classList.value)
    } else {
      elem.classList.toggle('keyboard__key--active')
      checkPresenceClass = regexp.test(elem.classList.value)
    }

    checkPresenceClass ? capsOn = true : capsOn = false
    variationRegisterSymbols()
  }

  const clickShift = (elem) => {

    onAudioShift()
    let checkPresenceClass

    if (elem.type === 'click') {
      elem.currentTarget.classList.toggle('keyboard__key--active')
      checkPresenceClass = regexp.test(elem.currentTarget.classList.value)
    } else {
      elem.classList.toggle('keyboard__key--active')
      checkPresenceClass = regexp.test(elem.classList.value)
    }
    checkPresenceClass ? shiftOn = true : shiftOn = false
    variationRegisterSymbols()

    if (shiftOn === true) {
      generatedKeys.forEach(elem => {

        if (keyboardLang === 'EN') {
          switch (elem.innerText) {

            case '2':
              elem.innerText = '@'
              break

            case '3':
              elem.innerText = '#'
              break

            case '4':
              elem.innerText = '$'
              break

            case '6':
              elem.innerText = '^'
              break

            case '7':
              elem.innerText = '&'
              break

            case '[':
              elem.innerText = '{'
              break

            case ']':
              elem.innerText = '}'
              break

            case ';':
              elem.innerText = ':'
              break

            case "'":
              elem.innerText = '"'
              break

            case ',':
              elem.innerText = '<'
              break

            case '.':
              elem.innerText = '>'
              break

            case '/':
              elem.innerText = '?'
              break
          }
        } else {
          switch (elem.innerText) {

            case '2':
              elem.innerText = '"'
              break

            case '3':
              elem.innerText = '№'
              break

            case '4':
              elem.innerText = ';'
              break

            case '6':
              elem.innerText = ':'
              break

            case '7':
              elem.innerText = '?'
              break

            case '.':
              elem.innerText = ','
              break
          }
        }

        // ----- Default -----
        switch (elem.innerText) {
          case '1':
            elem.innerText = '!'
            break

          case '5':
            elem.innerText = '%'
            break

          case '8':
            elem.innerText = '*'
            break

          case '9':
            elem.innerText = '('
            break

          case '0':
            elem.innerText = ')'
            break
        }
      })
    } else {
      generatedKeys.forEach(elem => {

        if (keyboardLang === 'EN') {
          switch (elem.innerText) {

            case '@':
              elem.innerText = '2'
              break

            case '#':
              elem.innerText = '3'
              break

            case '$':
              elem.innerText = '4'
              break

            case '^':
              elem.innerText = '6'
              break

            case '&':
              elem.innerText = '7'
              break

            case '{':
              elem.innerText = '['
              break

            case '}':
              elem.innerText = ']'
              break

            case ':':
              elem.innerText = ';'
              break

            case '"':
              elem.innerText = "'"
              break

            case '<':
              elem.innerText = ','
              break

            case '>':
              elem.innerText = '.'
              break

            case '?':
              elem.innerText = '/'
              break
          }
        } else {
          switch (elem.innerText) {

            case '"':
              elem.innerText = '2'
              break

            case '№':
              elem.innerText = '3'
              break

            case ';':
              elem.innerText = '4'
              break

            case ':':
              elem.innerText = '6'
              break

            case '?':
              elem.innerText = '7'
              break

            case ',':
              elem.innerText = '.'
              break
          }
        }

        // ----- Default -----
        switch (elem.innerText) {
          case '!':
            elem.innerText = '1'
            break

          case '%':
            elem.innerText = '5'
            break

          case '*':
            elem.innerText = '8'
            break

          case '(':
            elem.innerText = '9'
            break

          case ')':
            elem.innerText = '0'
            break
        }
      })
    }
  }

  const clickEnter = () => {
    onAudioEnter()
    textarea.value = `${leftText}\n${rightText}`
    carret += 1
    textarea.selectionStart = carret
    textarea.setSelectionRange(carret, carret)
  }

  const clickBackspace = () => {
    onAudioBackspace()
    textarea.value = `${leftText.slice(0, (leftText.length - 1))}${rightText}`
    carret -= 1
    textarea.selectionStart = carret
    textarea.setSelectionRange(carret, carret)
  }

  const clickSpace = () => {

    if (keyboardLang === 'EN') {
      onAudioSimbolEng()
    } else {
      onAudioSimbolRu()
    }

    textarea.value = `${leftText} ${rightText}`
    carret += 1
    textarea.selectionStart = carret
    textarea.setSelectionRange(carret, carret)
  }

  const clickHiddenKeyboard = () => {

    if (keyboardLang === 'EN') {
      onAudioSimbolEng()
    } else {
      onAudioSimbolRu()
    }

    clearInterval(textareaTimerId)
    keyboard.classList.add('keyboard--hidden')
  }

  const clickLanguage = (event) => {

    if (keyboardLang === 'EN') {
      onAudioSimbolEng()
    } else {
      onAudioSimbolRu()
    }

    if (event.target.innerText === 'EN') {
      keyboardKeysBlock.innerHTML = ''
      createKeys(keyValuesRu)
      generatedKeys = document.querySelectorAll('.keyboard__key')
      keyboardLang = 'RU'
      newGeneratedKeys()

    } else {
      keyboardKeysBlock.innerHTML = ''
      createKeys(keyValuesEng)
      generatedKeys = document.querySelectorAll('.keyboard__key')
      keyboardLang = 'EN'
      newGeneratedKeys()
    }

    listenText()
  }


  const newGeneratedKeys = () => {
    generatedKeys.forEach(elem => {
      if (elem.innerText.length === 1) {
        elem.addEventListener('click', clickSimbol)
      }

      switch (elem.innerText) {
        case 'keyboard_capslock':
          elem.addEventListener('click', clickCapsLock)
          break

        case 'Shift':
          elem.addEventListener('click', clickShift)
          break

        case 'subdirectory_arrow_left':
          elem.addEventListener('click', clickEnter)
          break

        case 'backspace':
          elem.addEventListener('click', clickBackspace)
          break

        case 'space_bar':
          elem.addEventListener('click', clickSpace)
          break

        case 'check_circle':
          elem.addEventListener('click', clickHiddenKeyboard)
          break

        case 'EN':
        case 'RU':
          elem.addEventListener('click', clickLanguage)
          break

        case 'arrow_back':
        case 'arrow_forward':
          elem.addEventListener('click', clickArrows)
          break

        case 'volume_off':
          elem.addEventListener('click', clickVolume)
          break

        case 'micro':
          elem.addEventListener('click', clickMicrophone)
          break
      }
    })
  }

  const visibleKeyboard = (event) => {
    textarea.focus()
    keyboard.classList.remove('keyboard--hidden')
  }

  const onTimerForTextarea = () => {
    textareaTimerId = setInterval(visibleKeyboard);
  }

  const clickKeyboardButton = (event) => {
    refreshCarret()

    if (event.type === 'keydown') {

      if (event.key === 'Shift') {  // If pressed Shift on physical keyboard

        if (!shiftInActive) {
          onAudioShift()
          let virtShiftBtn
          generatedKeys.forEach(elem => {
            if (elem.innerText === 'Shift') {
              virtShiftBtn = elem
            }
          })
          virtShiftBtn.classList.add('active')
          clickShift(virtShiftBtn)
          shiftInActive = true
        }

      } else {
        generatedKeys.forEach(elem => {
          if (event.key === elem.innerText) {
            elem.classList.add('active')
            if (keyboardLang === 'EN') {
              onAudioSimbolEng()
            } else {
              onAudioSimbolRu()
            }

          } else if (event.key === 'Backspace' && elem.innerText === 'backspace') {
            elem.classList.add('active')
            onAudioBackspace()

          } else if (event.key === 'Enter' && elem.innerText === 'subdirectory_arrow_left') {
            elem.classList.add('active')
            onAudioEnter()

          } else if (event.key === 'CapsLock' && elem.innerText === 'keyboard_capslock') {
            elem.classList.add('active')

          } else if (event.key === ' ' && elem.innerText === 'space_bar') {
            elem.classList.add('active')
            if (keyboardLang === 'EN') {
              onAudioSimbolEng()
            } else {
              onAudioSimbolRu()
            }

          } else if (event.key === 'ArrowLeft' && elem.innerText === 'arrow_back') {
            elem.classList.add('active')
            if (keyboardLang === 'EN') {
              onAudioSimbolEng()
            } else {
              onAudioSimbolRu()
            }

          } else if (event.key === 'ArrowRight' && elem.innerText === 'arrow_forward') {
            elem.classList.add('active')
            if (keyboardLang === 'EN') {
              onAudioSimbolEng()
            } else {
              onAudioSimbolRu()
            }

          } else if (event.key === 'Escape' && elem.innerText === 'check_circle') {
            elem.classList.remove('keyboard__key--dark')
            elem.classList.add('active')
          }
        })
      }
    } else { // If event.type === 'keyup'

      if (event.key === 'Shift') {  // If released Shift on physical keyboard

        if (shiftInActive) {
          let virtShiftBtn
          generatedKeys.forEach(elem => {
            if (elem.innerText === 'Shift') {
              virtShiftBtn = elem
            }
          })
          virtShiftBtn.classList.remove('active')
          clickShift(virtShiftBtn)
          shiftInActive = false
        }

      } else if (event.key === 'CapsLock') {

        let virtCapsBtn
        generatedKeys.forEach(elem => {
          if (elem.innerText === 'keyboard_capslock') {
            virtCapsBtn = elem
          }
        })
        virtCapsBtn.classList.remove('active')
        clickCapsLock(virtCapsBtn)

      } else {

        generatedKeys.forEach(elem => {
          if (event.key === elem.innerText) {
            elem.classList.remove('active')

          } else if (event.key === 'Backspace' && elem.innerText === 'backspace') {
            elem.classList.remove('active')

          } else if (event.key === 'Shift' && elem.innerText === 'Shift') {
            elem.classList.remove('active')

          } else if (event.key === 'Enter' && elem.innerText === 'subdirectory_arrow_left') {
            elem.classList.remove('active')

          } else if (event.key === ' ' && elem.innerText === 'space_bar') {
            elem.classList.remove('active')

          } else if (event.key === 'ArrowLeft' && elem.innerText === 'arrow_back') {
            elem.classList.remove('active')

          } else if (event.key === 'ArrowRight' && elem.innerText === 'arrow_forward') {
            elem.classList.remove('active')

          } else if (event.key === 'Escape' && elem.innerText === 'check_circle') {
            elem.classList.add('keyboard__key--dark')
            elem.classList.remove('active')
            clickHiddenKeyboard()
          }
        })
      }
    }
  }

  const refreshCarret = () => {
    carret = textarea.selectionStart
    carretTimer = setTimeout(refreshCarret)
  }
  refreshCarret()

  const clickArrows = (event) => {

    if (keyboardLang === 'EN') {
      onAudioSimbolEng()
    } else {
      onAudioSimbolRu()
    }

    clearTimeout(carretTimer)

    if (event.type === 'click' && event.target.innerText === 'arrow_forward') {
      if (textarea.value.length > carret) {
        carret += 1
      }
    } else {
      if (carret > 0) {
        carret -= 1
      }
    }
    textarea.setSelectionRange(carret, carret)
  }

  const clickVolume = (elem) => {

    if (keyboardLang === 'EN') {
      onAudioSimbolEng()
    } else {
      onAudioSimbolRu()
    }

    if (!volumeOff) {
      elem.currentTarget.classList.toggle('keyboard__key--active')
      volumeOff = true
    } else {
      elem.currentTarget.classList.toggle('keyboard__key--active')
      volumeOff = false
    }
  }

  const clickMicrophone = (elem) => {

    if (keyboardLang === 'EN') {
      onAudioSimbolEng()
    } else {
      onAudioSimbolRu()
    }

    if (!microphoneOn) {
      elem.currentTarget.classList.toggle('keyboard__key--active')
      microphoneOn = true
    } else {
      elem.currentTarget.classList.toggle('keyboard__key--active')
      microphoneOn = false
    }

    recordSpeak()
  }

  const recordSpeak = () => {
    let text

    if (microphoneOn) {
      recognation.start()
      recognation.addEventListener('result', (e) => {
        text = Array.from(e.results).map(result => result[0]).map(result => result.transcript).join()
        textarea.value = `${leftText}${text}${rightText}`
      })
    } else {
      recognation.addEventListener('end', stopRecordSpeak)
    }

    const stopRecordSpeak = () => {
      recognation.stop()
      textarea.selectionStart = carret
      textarea.setSelectionRange(carret, carret)
      generatedKeys.forEach(elem => {
        if (elem.innerText === 'micro') {
          elem.classList.remove('keyboard__key--active')
        }
      })
      microphoneOn = false
    }
  }



  // ----- Events -----
  // ----- Default Generete Keys -----
  generatedKeys.forEach(elem => {
    if (elem.innerText.length === 1) {
      elem.addEventListener('click', clickSimbol)
    }

    switch (elem.innerText) {
      case 'keyboard_capslock':
        elem.addEventListener('click', clickCapsLock)
        break

      case 'Shift':
        elem.addEventListener('click', clickShift)
        break

      case 'subdirectory_arrow_left':
        elem.addEventListener('click', clickEnter)
        break

      case 'backspace':
        elem.addEventListener('click', clickBackspace)
        break

      case 'space_bar':
        elem.addEventListener('click', clickSpace)
        break

      case 'check_circle':
        elem.addEventListener('click', clickHiddenKeyboard)
        break

      case 'EN':
      case 'RU':
        elem.addEventListener('click', clickLanguage)
        break

      case 'arrow_back':
      case 'arrow_forward':
        elem.addEventListener('click', clickArrows)
        break

      case 'volume_off':
        elem.addEventListener('click', clickVolume)
        break

      case 'micro':
        elem.addEventListener('click', clickMicrophone)
        break
    }
  })



  textarea.addEventListener('focus', visibleKeyboard)
  textarea.addEventListener('click', onTimerForTextarea)
  document.addEventListener('keyup', clickKeyboardButton)
  document.addEventListener('keydown', clickKeyboardButton)
}
startVirtualKeyboard()