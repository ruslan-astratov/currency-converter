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

    }
    // Функция ДОЛЖНА  возвращать промис

  }
  // Впервые срабатывает при ПЕРВОЙ загрузке страницы.    А затем срабатывает каждый раз, когда мы ВЫБИРАЕМ ДРУГУЮ КНОПКУ 









  // Функция, которая собирает данные из ИНПУТОВ  и  РАССЧИТЫВАЕТ :
  // Стоимость наших денег в ЖЕЛАЕМОЙ  валюте  (например, 67.6685) 
  function calcDesireMoneyFromFetchData() {

    // Получаем значение из ЛЕВОГО  инпута и преобразуем его в число.  При загрузке страницы у нас здесь 1
    let leftInputValue = parseInt(form.querySelector("#left-input").value) 

    console.log(leftInputValue)

    // Рассчитываем стоимость денег в желаемой валюте.       Например, сколько USD в 2 рублях.   В     2 рублях      0,026   USD 
    state.valueDesiredCurrency = leftInputValue * state.rate

    // console.log(state.valueDesiredCurrency)
    
  }
  // Функция должна срабатывать после отправки И успешного выполнения фетч-запроса.  То есть после выполнения функции sendFetch








  // Функция, которая на основе уже РАССЧИТАННЫХ   данных:         просто БЕРЁТ из объекта state  ДАННЫЕ    и  РЕНДЕРИТ их,    то есть  ПОДСТАВЛЯЕТ их в ПРАВЫЙ ИНПУТ.
  // Срабатывает после функции calcMoneyFromFetchData 
  function renderCalculatedValuesInRightInput() {

    // Находим ПРАВЫЙ инпут
    let rightInput = form.querySelector("#right-input")

    //  и вставляем в него то, что ранее посчитали 
    rightInput.value = state.valueDesiredCurrency.toFixed(4)
    
  }





  // Функция, которая рассчитывает    СТОИМОСТЬ  валют при изменении одного из инпутов   -   ЛЕВОГО  или   ПРАВОГО 
  // function calcMoneyAfterInputChange() {
    
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



      // leftSelect.style.backgroundColor = "#833ae0"




      // Здесь условие:  ЕСЛИ  значение в селекте НЕ РАВНО значению по умолчанию - то есть не равно BYR ,   мы будем задавать СЕЛЕКТУ АКТИВНЫЙ класс
      if(event.target.value != "BYR") {

        event.target.classList.add("current-currencie")

        // А также будем менять значение leftActiveButton в нашем state 
        state.leftActiveButton = event.target.value


        // Затем смотрим АКТИВНЫЕ  кнопки в обеих половинках формы, сравниваем и, если всё нормально, то отправляем фетч-запрос на API
        // Функция проверки будет общей - и для левой, и для правой половины 


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

      // ...

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
        // ...






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
