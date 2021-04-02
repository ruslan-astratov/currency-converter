// Скрипты должны запускаться только при полной загрузке DOM-а

// document.addEventListener('DOMContentLoaded', () => {

  // Наш объект состояния приложения
  let state = {

    // Активные кнопки. Нужны для того, чтобы лишний раз НЕ делать фетч-запрос.  По умолчанию они установлены вот так:
    leftActiveButton: "RUB",
    rightActiveButton: "USD",
    rate: null,

    selectInFocus: false

  }

  // Получим форму 
  let form = document.querySelector("#form")

















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
  leftSelect.addEventListener("focusin", deleteActiveClassFromButtons)

  // Опишем функцию, которая бы удаляла у всех кнопок активный класс
  function deleteActiveClassFromButtons(event) {

      state.selectInFocus = true





      leftSelect.style.backgroundColor = "#833ae0"






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

      } else {

        event.target.classList.add("current-currencie")

      }




      console.log("Наш объект state", state)





      // Затем смотрим АКТИВНЫЕ  кнопки в обеих половинках формы, сравниваем и, если всё нормально, то отправляем фетч-запрос на API
      // Функция проверки будет общей - и для левой, и для правой половины 


    
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














  // Аналог   СОБЫТИЯ  БЛЮР  -   когда выходим     из фокуса   СЕЛЕКТА 
  document.addEventListener("click", (event)=> {

    console.log("Вышли из фокуса Селекта. Блюр")

    // Если мы вышли из селекта и кликнули по чему угодно (кроме ряда с кнопками)
    if(state.selectInFocus && !event.target.matches(".currencies-row") && leftSelect.value == "BYR") {


      // Переводим state.selectInFocus в false
      state.selectInFocus = false




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

