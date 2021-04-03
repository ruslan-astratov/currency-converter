// Скрипты должны запускаться только при полной загрузке DOM-а

// document.addEventListener('DOMContentLoaded', () => {

  // Наш объект состояния приложения
  let state = {

    // Активные кнопки. Нужны для того, чтобы лишний раз НЕ делать фетч-запрос.  По умолчанию они установлены вот так:
    leftActiveButton: "RUB",
    rightActiveButton: "USD",
    rate: null,                  // 0.0135    Курс .  Приходит с API 
    valueDesiredCurrency: null,  // Стоимость денег желаемой валюты.   Например,      В     1 рубле      0.0131101944     USD 



    selectInFocus: false,
    wasBlure: false,


    selectInFocusRight: false

  }



  // Получим форму 
  let form = document.querySelector("#form")







  // Функция, которая проверяет leftActiveButton и rightActiveButton и, если они НЕ равны друг другу - делает фетч-запрос
  function sendFetch() {

    if(state.leftActiveButton != state.rightActiveButton) {

      return fetch(`https://api.ratesapi.io/api/latest?base=${state.leftActiveButton}&symbols=${state.rightActiveButton}`)
        .then( response =>  response.json())
        .then( data => {

          state.rate = data.rates[state.rightActiveButton]

          console.log("Наш объект state после загрузки страницы", state)
        })
        .catch( err => console.log("Не удалось отправить фетч-запрос. Возможная причина: отстутствие интернет-соединения", err ))

    }
    // Функция ДОЛЖНА  возвращать промис

    // Если же они между собой РАВНЫ   (Если в левой КНОПКЕ USD  и в правой кнопке  USD), то 
    else {

      return new Promise((resolve, reject) => {
        // Курс будет 1 к 1
        state.rate = 1

        resolve()
      });

    }

  }
  // Впервые срабатывает при ПЕРВОЙ загрузке страницы.    А затем срабатывает каждый раз, когда мы ВЫБИРАЕМ ДРУГУЮ КНОПКУ 









  // Функция, которая собирает данные из ИНПУТОВ  и  РАССЧИТЫВАЕТ :
  // Стоимость наших денег в ЖЕЛАЕМОЙ  валюте  (например, 67.6685) 
  function calcDesireMoneyFromFetchData() {

    // Получаем значение из ЛЕВОГО  инпута и преобразуем его в число.  При загрузке страницы у нас здесь 1
    let leftInputValue = form.querySelector("#left-input").value

    // console.log(leftInputValue)

    // Рассчитываем стоимость денег в желаемой валюте.       Например, сколько USD в 2 рублях.   В     2 рублях      0,026   USD 
    state.valueDesiredCurrency = leftInputValue * state.rate

  }
  // Функция должна срабатывать после отправки И успешного выполнения фетч-запроса.  То есть после выполнения функции sendFetch








  // Функция, которая на основе уже РАССЧИТАННЫХ   данных:         просто БЕРЁТ из объекта state  ДАННЫЕ    и  РЕНДЕРИТ их,    то есть  ПОДСТАВЛЯЕТ их в ПРАВЫЙ ИНПУТ.
  // Срабатывает после функции calcMoneyFromFetchData 
  function renderCalculatedValuesInRightInput() {

    // Находим левый инпут. Берём его значение
    let leftInputVal = form.querySelector("#left-input").value


    // Находим ПРАВЫЙ инпут
    let rightInput = form.querySelector("#right-input")

    //  и вставляем в него то, что ранее посчитали.  Если  ИМЕЮЩАЯСЯ  и ЖЕЛАЕМАЯ валюты совпадают, то в правом инпуте показываем то же, что было в левом инпуте
    rightInput.value = state.leftActiveButton != state.rightActiveButton ?  state.valueDesiredCurrency.toFixed(4) : leftInputVal




    // При этом мы должны вставить под ЛЕВЫМ и под ПРАВЫМ инпутами стоимость ЕДИНИЦЫ валют по  КУРСУ
    // 1 RUB = 0.0131 USD
    // 1 USD = 76.2765 RUB
    let captureRateForLeftInput = document.querySelector("#rate1")

    captureRateForLeftInput.innerHTML = `1 ${state.leftActiveButton} = ${state.rate.toFixed(4)} ${state.rightActiveButton}`


    let captureRateForRightInput = document.querySelector("#rate2")

    captureRateForRightInput.innerHTML = `1 ${state.rightActiveButton} = ${ (1 / state.rate).toFixed(4) } ${state.leftActiveButton}`
    
  }





  // Функция, которая рассчитывает    СТОИМОСТЬ  валют при изменении одного из инпутов   -   ЛЕВОГО  или   ПРАВОГО 
  // function calculatedMoneyAfterInputsChange() {
    
  // }





  // При загрузке страницы             (а также  при ИЗМЕНЕНИИ  КНОПКИ/СЕЛЕКТА )
  async function functionAsync() {

    //  Делаем фетч-запрос и записываем в state курс валюты 
    await sendFetch() 

    //  Рассчитываем стоимость нашей текущей валюты в ЖЕЛАЕМОЙ валюте.  То есть берём значение из ЛЕВОГО инпута и на его основе рассчитываем значение для ПРАВОГО инпута
    calcDesireMoneyFromFetchData()

    //  Рендерим рассчитанное значение    в    ПРАВЫЙ ИНПУТ 
    renderCalculatedValuesInRightInput()


  }

  functionAsync()




















  // При клике на кнопку с валютой:    будем  забирать АКТИВНЫЙ класс  у ВСЕХ  кнопок и селекта , и добавлять ТЕКУЩЕЙ КНОПКЕ / селекту 

  // Получим наш     ЛЕВЫЙ   див  (с кнопками )
  let leftRowWithButtonsAndSelect = form.querySelector(".form__left-column .currencies-row")

  // Навесим на этот див обработчик события  по клику
  leftRowWithButtonsAndSelect.addEventListener("click", setLeftButtonActiveClassAndSendFetch)






  // Напишем функцию         "Задать ЛЕВОЙ КНОПКЕ активный класс и сделать фетч-запрос",           которая в момент нажатия на КНОПКУ

  // а) Делала бы проверку  и  задавала  ей активный класс

  // б) Делала бы   фетч-запрос   на API    за данными     по КУРСУ   валют

  function setLeftButtonActiveClassAndSendFetch() {

    setActiveClassToButton(event) 

    function setActiveClassToButton(event) {

      // Если мы    !ВПЕРВЫЕ!     кликнули по КНОПКЕ 
      if(event.target.tagName === "BUTTON" && event.target.innerHTML !== state.leftActiveButton) {

        console.log("Кликнули по кнопке. Дали ей АКТИВНЫЙ КЛАСС")

        // Получаем все КНОПКИ  в этом ряду 
        let allButtons = event.currentTarget.querySelectorAll(".currencies-row-button")


        // Переберём все КНОПКИ  и заберем у них всех активный класс
        allButtons.forEach( elem => {
          elem.classList.remove("current-currencie")
        } )


        // Забираем активный класс у селекта
        event.target.closest(".currencies-row").querySelector("select").classList.remove("current-currencie")

        leftSelect.style.backgroundColor = "white"



        // А КНОПКЕ,  по которой    кликнули , ДАДИМ   АКТИВНЫЙ  КЛАСС
        event.target.closest(".child").classList.add("current-currencie")


        // В нашем объекте состояния state тоже поменяем значение свойства leftActiveButton  на выбранную только что кнопку
        state.leftActiveButton = event.target.innerHTML

        console.log("Наш объект состояния state", state)



        







        // Проверяем кнопки в левой и правой колонке, то есть проверяем наш объект state:     и если кнопки leftActiveButton и rightActiveButton  не равны --> делаем фетч-запрос

        // // Проверяем кнопки в левой и правой колонке, то есть проверяем наш объект state:     и если кнопки leftActiveButton и rightActiveButton  не равны --> делаем фетч-запрос
        functionAsync()
      }
      // -------- // Если мы    !ВПЕРВЫЕ!     кликнули по КНОПКЕ 


    }



  }





  // Получим наш ЛЕВЫЙ СЕЛЕКТ 
  let leftSelect = leftRowWithButtonsAndSelect.querySelector("#left-select")






  // Навесим на него обработчик по focus. При фокусе мы всего лишь УДАЛИМ активный класс у кнопок
  leftSelect.addEventListener("focus", deleteActiveClassFromButtons)

  // Опишем функцию, которая бы удаляла у всех кнопок активный класс
  function deleteActiveClassFromButtons(event) {

      // Если мы РАСКРЫВАЕМ СЕЛЕКТ,   нужно перевести selectInFocus в состояние true 
      if(!state.selectInFocus) {
        state.selectInFocus = true
      }

      // В противном же случае..
      else {
        state.selectInFocus = false
      }

      


      leftSelect.style.backgroundColor = "#833ae0"

      leftSelect.classList.add("current-currencie")




      // Если на этот селект нажимаем ВПЕРВЫЕ ( смотрим на объект state и переменную leftActiveButton), то убираем у всех кнопок активный класс и даём его селекту
      console.log("Селект в фокусе")

      // Беру все КНОПКИ  и удаляю у них активный класс 
      // Получаем все КНОПКИ  в этом ряду 
      let allButtons = event.currentTarget.closest(".currencies-row").querySelectorAll(".currencies-row-button")


      // Переберём все КНОПКИ  и удалим  у них всех активный класс
      allButtons.forEach( elem => {
        elem.classList.remove("current-currencie")
      } )




      // Здесь условие:  ЕСЛИ  значение в селекте НЕ РАВНО значению по умолчанию - то есть не равно BYR ,   мы будем задавать СЕЛЕКТУ АКТИВНЫЙ класс
      if(event.target.value != "BYR") {

        event.target.classList.add("current-currencie")

        // А также будем менять значение leftActiveButton в нашем state 
        state.leftActiveButton = event.target.value


        // Затем смотрим АКТИВНЫЕ  кнопки в обеих половинках формы, сравниваем и, если всё нормально, то отправляем фетч-запрос на API
        // Функция проверки будет общей - и для левой, и для правой половины 
        functionAsync()

      } else {

        event.target.classList.add("current-currencie")

      }

      console.log("Наш объект state", state)
    
  }






   // Навесим на СЕЛЕКТ обработчик по change.     При изменении select-а, когда мы ВЫБРАЛИ конкретную валюту, мы будем :
  //  а) Задавать селекту АКТИВНЫЙ КЛАСС
  //  б) Устанавливать значение свойства leftActiveButton  в нашем стейте
  //  в) Сравнивать активные кнопки leftActiveButton и rightActiveButton и , если всё нормально, если они НЕ РАВНЫ ,  делать фетч-запрос к API 

  leftSelect.addEventListener("change", setLeftSelectActiveClassAndSendFetch)

  function setLeftSelectActiveClassAndSendFetch(event) {


    // Если выбранная нами валюта - не равна тому, что у нас сейчас в стейте (значение СЕЛЕКТА не равно значению leftActiveButton), то 
    if(event.target.value != state.leftActiveButton) {

      // alert("Мы выбрали валюту")

      // а) Задаём СЕЛЕКТУ активный класс
      event.target.classList.add("current-currencie")

      // б) Перезаписваем свойства leftActiveButton на то значение селекта , которое  сейчас выбрали 
      state.leftActiveButton = event.target.value








      // Убираем у всех кнопок активный класс
      let allButtons = event.currentTarget.closest(".currencies-row").querySelectorAll(".currencies-row-button")


      // Переберём все КНОПКИ  и удалим  у них всех активный класс
      allButtons.forEach( elem => {
        elem.classList.remove("current-currencie")
      } )

      // Делаем фон селекта фиолетовым
      leftSelect.style.backgroundColor = "#833ae0"





      // Переводим state.selectInFocus в false
      state.selectInFocus = false

      console.log("Наш объёкт state после того как в селекте выбрали валюту", state)


      // в) Затем смотрим АКТИВНЫЕ  кнопки в обеих половинках формы, сравниваем и, если всё нормально, то отправляем фетч-запрос на API
      // Функция проверки будет общей - и для левой, и для правой половины 
      functionAsync()

    }
  }







  // Аналог   СОБЫТИЯ  БЛЮР     -   когда выходим     из фокуса   СЕЛЕКТА 
  document.addEventListener("click", (event)=> {

    // Если мы кликнули по СЕЛЕКТУ 
    if(event.target.name == "base-currencies") {

      
      // Когда  закрыли селект 
      if(state.selectInFocus == false && state.wasBlure == true) {


        console.log("Закрывается")
        state.selectInFocus = true

        leftSelect.classList.remove("current-currencie")

      } 

      // Если же мы открыли СЕЛЕКТ 
      else if(state.selectInFocus == true && state.wasBlure == false) {

        console.log("Открывается")


        state.selectInFocus = true

        state.wasBlure = false

        leftSelect.classList.add("current-currencie")
      }
  
    }





    // Если мы вышли из селекта и кликнули по чему угодно (кроме ряда с кнопками)
    if(state.selectInFocus && !event.target.matches(".currencies-row") && leftSelect.value == "BYR") {


      // Переводим state.selectInFocus в false
      state.selectInFocus = false

      state.wasBlure = true




      // Поднимаемся к родительской обёртке currencies-row и ищем ВСЕ КНОПКИ
      let allButtons = form.querySelector(".currencies-row").querySelectorAll(".currencies-row-button")

      // Находим среди них ту, что соответствует значению leftActiveButton.   ВОЗВРАЩАЕМ     ей     АКТИВНЫЙ КЛАСС
      allButtons.forEach( button => {
        
        if(button.innerHTML == state.leftActiveButton) {
          button.classList.add("current-currencie")
        }

      })


      if(leftSelect.value == "BYR") {
        leftSelect.style.backgroundColor = "white"
      }

      leftSelect.classList.remove("current-currencie")
      

    }
  })



















// ------------------------------------------------------------------ ПРАВАЯ ПОЛОВИНА -----------------------------------------------------------------------------------


  // При клике на кнопку с валютой:    будем  забирать АКТИВНЫЙ класс  у ВСЕХ  кнопок и селекта , и добавлять ТЕКУЩЕЙ КНОПКЕ / селекту 

  // Получим наш     ПРАВЫЙ   див  (с кнопками )
  let rightRowWithButtonsAndSelect = form.querySelector(".form__right-column .currencies-row")

  // Навесим на этот див обработчик события  по клику
  rightRowWithButtonsAndSelect.addEventListener("click", setRightButtonActiveClassAndSendFetch)




  // Напишем функцию         "Задать ПРАВОЙ  КНОПКЕ активный класс и сделать фетч-запрос",           которая в момент нажатия на КНОПКУ

  // а) Делала бы проверку  и  задавала  ей активный класс

  // б) Делала бы   фетч-запрос   на API    за данными     по КУРСУ   валют

  function setRightButtonActiveClassAndSendFetch() {

    setActiveClassToButton(event) 

    function setActiveClassToButton(event) {

      // Если мы    !ВПЕРВЫЕ!     кликнули по КНОПКЕ 
      if(event.target.tagName === "BUTTON" && event.target.innerHTML !== state.rightActiveButton) {

        console.log("Кликнули по кнопке. Дали ей АКТИВНЫЙ КЛАСС")

        // Получаем все КНОПКИ  в этом ряду 
        let allButtons = event.currentTarget.querySelectorAll(".currencies-row-button")


        // Переберём все КНОПКИ  и заберем у них всех активный класс
        allButtons.forEach( elem => {
          elem.classList.remove("current-currencie")
        } )


        // Забираем активный класс у селекта
        event.target.closest(".currencies-row").querySelector("select").classList.remove("current-currencie")

        rightSelect.style.backgroundColor = "white"



        // А КНОПКЕ,  по которой    кликнули , ДАДИМ   АКТИВНЫЙ  КЛАСС
        event.target.closest(".child").classList.add("current-currencie")


        // В нашем объекте состояния state тоже поменяем значение свойства rightActiveButton  на выбранную только что кнопку
        state.rightActiveButton = event.target.innerHTML

        console.log("Наш объект состояния state", state)



        







        // Проверяем кнопки в левой и правой колонке, то есть проверяем наш объект state:     и если кнопки leftActiveButton и rightActiveButton  не равны --> делаем фетч-запрос

        // // Проверяем кнопки в левой и правой колонке, то есть проверяем наш объект state:     и если кнопки leftActiveButton и rightActiveButton  не равны --> делаем фетч-запрос
        functionAsync()
        
      }
      // -------- // Если мы    !ВПЕРВЫЕ!     кликнули по КНОПКЕ 


    }



  }








  // Получим наш  ПРАВЫЙ   СЕЛЕКТ 
  let rightSelect = rightRowWithButtonsAndSelect.querySelector("#right-select")




  // // Навесим на него обработчик по focus. При фокусе мы всего лишь УДАЛИМ активный класс у кнопок
  rightSelect.addEventListener("focus", deleteActiveClassFromButton)

  // Опишем функцию, которая бы удаляла у всех кнопок активный класс
  function deleteActiveClassFromButton(event) {

      // Если мы РАСКРЫВАЕМ СЕЛЕКТ,   нужно перевести selectInFocus в состояние true 
      if(!state.selectInFocusRight) {
        state.selectInFocusRight = true
      }

      // В противном же случае..
      else {
        state.selectInFocusRight = false
      }



      rightSelect.style.backgroundColor = "#833ae0"

      rightSelect.classList.add("current-currencie")




      // Если на этот селект нажимаем ВПЕРВЫЕ ( смотрим на объект state и переменную leftActiveButton), то убираем у всех кнопок активный класс и даём его селекту
      console.log("Селект в фокусе")

      // Беру все КНОПКИ  и удаляю у них активный класс 
      // Получаем все КНОПКИ  в этом ряду 
      let allButtons = event.currentTarget.closest(".currencies-row").querySelectorAll(".currencies-row-button")


      // Переберём все КНОПКИ  и удалим  у них всех активный класс
      allButtons.forEach( elem => {
        elem.classList.remove("current-currencie")
      } )




      // Здесь условие:    ЕСЛИ на момент ФОКУСА   значение в селекте НЕ РАВНО значению по умолчанию - то есть не равно BYR ,   мы будем задавать СЕЛЕКТУ АКТИВНЫЙ класс
      if(event.target.value != "BYR") {

        event.target.classList.add("current-currencie")

        // А также будем менять значение rightActiveButton в нашем state 
        state.rightActiveButton = event.target.value




        // Затем смотрим АКТИВНЫЕ  кнопки в обеих половинках формы, сравниваем и, если всё нормально, то отправляем фетч-запрос на API
        // Функция проверки будет общей - и для левой, и для правой половины 
        functionAsync()
        


      } else {

        event.target.classList.add("current-currencie")

      }

      console.log("Наш объект state", state)
    
  }














   // Навесим на СЕЛЕКТ обработчик по change.     При изменении select-а, когда мы ВЫБРАЛИ конкретную валюту, мы будем :
  //  а) Задавать селекту АКТИВНЫЙ КЛАСС
  //  б) Устанавливать значение свойства leftActiveButton  в нашем стейте
  //  в) Сравнивать активные кнопки leftActiveButton и rightActiveButton и , если всё нормально, если они НЕ РАВНЫ ,  делать фетч-запрос к API 

  rightSelect.addEventListener("change", setRightSelectActiveClassAndSendFetch)

  function setRightSelectActiveClassAndSendFetch(event) {


    // Если выбранная нами валюта - не равна тому, что у нас сейчас в стейте (значение СЕЛЕКТА не равно значению rightActiveButton), то 
    if(event.target.value != state.rightActiveButton) {

      // alert("Мы выбрали валюту")

      // а) Задаём СЕЛЕКТУ активный класс
      event.target.classList.add("current-currencie")

      // б) Перезаписваем свойства rightActiveButton на то значение селекта , которое  сейчас выбрали 
      state.rightActiveButton = event.target.value








      // Убираем у всех кнопок активный класс
      let allButtons = event.currentTarget.closest(".currencies-row").querySelectorAll(".currencies-row-button")


      // Переберём все КНОПКИ  и удалим  у них всех активный класс
      allButtons.forEach( elem => {
        elem.classList.remove("current-currencie")
      } )

      // Делаем фон селекта фиолетовым
      rightSelect.style.backgroundColor = "#833ae0"







      // Переводим state.selectInFocus в false
      state.selectInFocusRight = false

      console.log("Наш объёкт state после того как в селекте выбрали валюту", state)


      // в) Затем смотрим АКТИВНЫЕ  кнопки в обеих половинках формы, сравниваем и, если всё нормально, то отправляем фетч-запрос на API
      // Функция проверки будет общей - и для левой, и для правой половины 
      functionAsync()

      // ...

    }
  }














  // // Аналог   СОБЫТИЯ  БЛЮР     -   когда выходим     из фокуса   СЕЛЕКТА 
  document.addEventListener("click", blurOnRightSelect)




  function  blurOnRightSelect(event) {

    // Если мы кликнули по СЕЛЕКТУ 
    if(event.target.name == "base-currencies2") {

      
      // Когда  закрыли селект 
      if(state.selectInFocusRight == false && state.wasBlure == true) {


        console.log("Закрывается")

        state.selectInFocusRight = true

        rightSelect.classList.remove("current-currencie")

      } 

      // Если же мы открыли СЕЛЕКТ 
      else if(state.selectInFocusRight == true && state.wasBlure == false) {

        console.log("Открывается")


        state.selectInFocusRight = true

        state.wasBlure = false

        rightSelect.classList.add("current-currencie")
      }
  
    }





    // Если мы вышли из селекта и кликнули по чему угодно (кроме ряда с кнопками)
    if(state.selectInFocusRight && !event.target.matches(".currencies-row") && rightSelect.value == "BYR") {


      // Переводим state.selectInFocus в false
      state.selectInFocusRight = false

      state.wasBlure = true




      // Поднимаемся к родительской обёртке currencies-row и ищем ВСЕ КНОПКИ
      let allButtons = form.querySelector(".form__right-column .currencies-row").querySelectorAll(".currencies-row-button")

      // Находим среди них ту, что соответствует значению rightActiveButton.   ВОЗВРАЩАЕМ     ей     АКТИВНЫЙ КЛАСС
      allButtons.forEach( button => {
        
        if(button.innerHTML == state.rightActiveButton) {
          button.classList.add("current-currencie")
        }

      })


      if(rightSelect.value == "BYR") {
        rightSelect.style.backgroundColor = "white"
      }

      rightSelect.classList.remove("current-currencie")
      

    }

  }
















  //  -------------------------------------------- Функция, которую повешу на оба инпута (на левый и на правый)

  // Функция срабатывает по событию    input   и     ВАЛИДИРУЕТ , то есть  проверяет вводимое в ПЕРВЫЙ инпут значение, а затем  РАССЧИТЫВАЕТ  и ВЫВОДИТ   значение во ВТОРОМ инпуте
  function calculatedMoneyAfterInputsChange(event) {
    let valueFromInput


      // В переменной лежит  значение из инпута в данный момент времени
      valueFromInput = event.target.value



      // Делаем эти действия, только когда инпут НЕ пустой
      if(valueFromInput != "") {

        // Разбиваем значение из инпута на массив отдельные символы 
        let arrSymbols = valueFromInput.split("")

        // Теперь мы должны проверить - является ли последний символ чем-то , кроме ЦИФРЫ/ТОЧКИ/ЗАПЯТОЙ 

        // Регулярка ЦИФРА
        let reg1 = /\d/

        // Регулярка ТОЧКА
        let reg2 = /\./

        // Регулярка ЗАПЯТАЯ
        let reg3 = /\,/


        // Если последний ВВЕДЁННЫЙ символ в массиве символов является разрешённым, то всё отлично
        if(reg1.test(arrSymbols[arrSymbols.length - 1]) || reg2.test(arrSymbols[arrSymbols.length - 1]) || reg3.test(arrSymbols[arrSymbols.length - 1])    ) {

          console.log("Всё отлично")

          // Если всё отлично, мы должны проверить:
          // а ) является ли ПЕРВЫЙ  символ ТОЧКОЙ или ЗАПЯТОЙ.  Если да, то должны  удалить этот символ из массива. А затем массив склеить обратно в строку и вставить в инпут 
          // б ) при вводе запятой, нужно заменить её на точку, а затем вернуться к пункту    в)  - проверив, сколько у нас вообще  точек
          // в ) сколько точек в нашей строке.  Если две, то последняя КАК последний символ - будет удаляться , а затем массив склеить обратно в строку и вставить в инпут
          // г ) если первый символ 0, а текущий символ НЕ является ТОЧКОЙ ,  нужно удалять ноль.  А затем массив склеить обратно в строку и вставить в инпут



          // а ) Проверяем - является ли первый символ точкой или запятой. Если да, то удаляем этот символ
          if(reg2.test(arrSymbols[0]) || reg3.test(arrSymbols[0])) {
            // Мы должны удалить этот символ из массива. А затем массив склеить обратно в строку и вставить в инпут 
            arrSymbols.pop()

            arrSymbols = arrSymbols.join("")

            event.target.value = arrSymbols
          }


          // б ) при вводе запятой, нужно заменить её на точку, а затем вернуться к пункту б)  - проверив, сколько у нас вообще  точек
          if( reg3.test(arrSymbols[arrSymbols.length - 1]) ) {

            arrSymbols[arrSymbols.length - 1] = "."

            arrSymbols = arrSymbols.join("")

            event.target.value = arrSymbols


          }




          // в ) СКОЛЬКО  ТОЧЕК  в нашей строке.  Если две, то последняя, КАК последний символ,   будет удаляться , а затем массив будем  клеить обратно в строку и вставлять в инпут
          let valAsArr = event.target.value.split("")


          let amountDotes = valAsArr.filter( symb => symb == ".")

          

          if(amountDotes.length > 1) {

            valAsArr.pop()

            valAsArr = valAsArr.join("")
  
            event.target.value = valAsArr

          }









          // г ) если первый символ 0, а текущий символ НЕ является ТОЧКОЙ ,  нужно удалять ноль.  А затем массив склеить обратно в строку и вставить в инпут
          let newArr = event.target.value.split("")

          if(newArr.length == 2 && newArr[0] == 0 && newArr[1] !== ".") {
            newArr.shift()

            event.target.value = newArr.join("")
          }







        } else {

          console.log("Мы ввели запрещённый символ")

          // Мы должны удалить этот символ из массива. А затем массив склеить обратно в строку и вставить в инпут 
          arrSymbols.pop()

          arrSymbols = arrSymbols.join("")

          event.target.value = arrSymbols

        }




        // Теперь мы должны ЗНАЧЕНИЕ инпута, ПРОШЕДШЕЕ проверки, взять и (обрезав точку в конце), рассчитать СТОИМОСТЬ  денег в ЖЕЛАЕМОЙ  валюте 

        // Если в конце   есть точка, перед проведением рассчётов   удаляем её
        let arrS = event.target.value


        arrS = arrS.split("")

        if( arrS[arrS.length - 1] == "." ) {

          arrS.pop()

        }



        // Получаем число для РАССЧЁТОВ 
        let numberForCalc = parseInt(arrS.join("")) 


        // ПРОИЗВОДИМ РАССЧЁТЫ
        // Проверяем - если мы в ЛЕВОМ  инпуте, то будем рассчитывать ЗНАЧЕНИЕ для ПРАВОГО - умножая ЗНАЧЕНИЕ левого ИНПУТА на КУРС  0.01345
        if(event.currentTarget.id == "left-input") {

          // Записываем в ПРАВЫЙ инпут РАССЧИТАННОЕ значение
          form.querySelector("#right-input").value =  event.target.value == 0   ?   0  :      (   state.leftActiveButton ==   state.rightActiveButton   ?  event.target.value  :    (event.target.value * state.rate).toFixed(4)     )                   



        }

        // Если же мы   в ПРАВОМ  инпуте, то ЗНАЧЕНИЕ для ЛЕВОГО  будем получать  как:
        // 1 / курс 0.01355    а затем умножать на значение ПРАВОГО инпута
        else {

          form.querySelector("#left-input").value =  event.target.value == 0 ?     0    :    (   state.leftActiveButton ==   state.rightActiveButton   ?  event.target.value  :    ( (1 / state.rate) * event.target.value ).toFixed(4)    )   

        }


      }
      // Условие Делаем эти действия, только когда инпут НЕ пустой. И в нём что то есть


      // Если изменяемый  ИНПУТ оказался  ПУСТОЙ
      else {

        // если пустым оказался ЛЕВЫЙ инпут
        if(event.target.id == "left-input") {

          // правый тоже делаем пустым
          form.querySelector("#right-input").value = ""

        } 

        else {
          form.querySelector("#left-input").value = ""
        }


      }








  }


  // Повесим обработчик на  ЛЕВЫЙ  инпут 
  const leftInput = form.querySelector("#left-input")

  // leftInput.addEventListener("input", calculatedMoneyAfterInputsChange)

  leftInput.addEventListener("input", calculatedMoneyAfterInputsChange)




  // Повесим обработчик на  ПРАВЫЙ  инпут 
  const rightInput = form.querySelector("#right-input")

  // leftInput.addEventListener("input", calculatedMoneyAfterInputsChange)

  rightInput.addEventListener("input", calculatedMoneyAfterInputsChange)

  //  ------------------------------------------- // Функция, которую повешу на оба инпута (на левый и на правый)


















  // Получаю стрелки-переключатель
  let arrow = form.querySelector("#arrows")

  // Вешаю обработчик по клику на переключатель
  arrow.addEventListener("click", currenciesReverse)




  // ----------------------------------------- ФУНКЦИЯ   СРАБАТЫВАЮЩАЯ    ПРИ КЛИКЕ    НА СТРЕЛКИ-ПЕРЕКЛЮЧАТЕЛИ  -------------------------------------------
  function currenciesReverse() {

    // Мы УДАЛЯЕМ  активный КЛАСС  в ЛЕВОЙ   и ПРАВОЙ   половинах формы,    У  КНОПОК и СЕЛЕКТОВ

    // ------------------------------------------ Находим КНОПКИ и СЕЛЕКТ в ЛЕВОЙ половине  и удаляем активный класс
    let buttonsOnLeftSide = form.querySelector("#currencies-row-left").querySelectorAll(".currencies-row-button")

    // Перебираем кнопки. Находим и удаляем АКТИВНЫЙ класс, если он есть
    buttonsOnLeftSide.forEach( button => {

      if(button.classList.contains("current-currencie")) {

        button.classList.remove("current-currencie")

      }

    } )

    // Селект так же смотрим 
    let selectOnLeftSide = form.querySelector("#left-select")

    if(selectOnLeftSide.classList.contains("current-currencie")) {
      selectOnLeftSide.classList.remove("current-currencie")

      selectOnLeftSide.style.backgroundColor = "white"

    }
    // ------------------------------------------ // Находим КНОПКИ и СЕЛЕКТ в ЛЕВОЙ половине  и удаляем активный класс



    // ------------------------------------------ Находим КНОПКИ и СЕЛЕКТ в ПРАВОЙ половине  и удаляем активный класс
    let buttonsOnRightSide = form.querySelector("#currencies-row-right").querySelectorAll(".currencies-row-button")

    // Перебираем кнопки. Находим и удаляем АКТИВНЫЙ класс, если он есть
    buttonsOnRightSide.forEach( button => {

      if(button.classList.contains("current-currencie")) {

        button.classList.remove("current-currencie")
      
      }

    } )

    // Селект так же смотрим 
    let selectOnRightSide = form.querySelector("#right-select")

    if(selectOnRightSide.classList.contains("current-currencie")) {

      selectOnRightSide.classList.remove("current-currencie")

      selectOnRightSide.style.backgroundColor = "white"

    }
    // ------------------------------------------ // Находим КНОПКИ и СЕЛЕКТ в ПРАВОЙ половине  и удаляем активный класс




    




    //-----------------------------------------     Теперь ЗАДАЁМ   эти классы  на кнопки   (селекты)   РЕВЕРСИВНО  


    // В ЛЕВОЙ  ПОЛОВИНЕ ищем кнопку или селект, значение которого соответствовало бы  rightActiveButton

    // Переменная-флаг.  "Есть ли среди ЛЕВЫХ кнопок та, которая равна  rightActiveButton?"
    let isFindActiveButtonInLeftSide = false


    buttonsOnLeftSide.forEach( button => {

      if(button.innerHTML == state.rightActiveButton) {
        button.classList.add("current-currencie")

        // Да, мы нашли в левой части кнопку, которая соответствовала бы правой кнопке
        isFindActiveButtonInLeftSide = true 
      }

    })


    // Если мы НЕ нашли нужную кнопку, значит, нужно работать с СЕЛЕКТОМ
    if(!isFindActiveButtonInLeftSide) {

      if(selectOnLeftSide.value = state.rightActiveButton) {

        selectOnLeftSide.classList.add("current-currencie")

        selectOnLeftSide.style.backgroundColor = "#833ae0"
  
      }

    }
    // В ЛЕВОЙ  ПОЛОВИНЕ ищем кнопку или селект, значение которого соответствовало бы  rightActiveButton











    // В ПРАВОЙ  ПОЛОВИНЕ ищем кнопку или селект, значение которого соответствовало бы  leftActiveButton

    // Переменная-флаг.  "Есть ли среди ЛЕВЫХ кнопок та, которая равна  leftActiveButton?"
    let isFindActiveButtonInRightSide = false

    buttonsOnRightSide.forEach( button => {

      if(button.innerHTML == state.leftActiveButton) {

        button.classList.add("current-currencie")

        // Да , мы нашли такую кнопку
        isFindActiveButtonInRightSide = true

      }

    })


    if(!isFindActiveButtonInRightSide) {

      if(selectOnRightSide.value = state.leftActiveButton) {

        selectOnRightSide.classList.add("current-currencie")

        selectOnRightSide.style.backgroundColor = "#833ae0"
  
      }
    }


    // -- // В ПРАВОЙ  ПОЛОВИНЕ ищем кнопку или селект, значение которого соответствовало бы  leftActiveButton

    // -------------------------------------//      Теперь ЗАДАЁМ   эти классы  на кнопки   (и селекты)   РЕВЕРСИВНО  







    

    // Меняем местами значения leftActiveButton и rightActiveButton в объекте state
    let saveValueFromStateLeftActiveButton = state.leftActiveButton


    let saveValueFromStateRightActiveButton = state.rightActiveButton


    state.leftActiveButton = saveValueFromStateRightActiveButton

    state.rightActiveButton = saveValueFromStateLeftActiveButton


    // Запускаем функцию - фетч-запрос к API  (затем автоматически выполнится подсчёт и рендер значений)
    functionAsync()
  }
