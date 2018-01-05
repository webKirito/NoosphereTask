/**
 * @class Game : Main class for creating game.
 * 
 * @param {Number} numberOfMinutes : Item which we push.
 * @param {Number} gameSpeedValue : Delay for pushing item.
 * @param {Number} currentTime: Var to save the current game time.
 * @param {Number} gameStat : Var to check stat {0 - pause , 1 - action}.
 * @param {Number} counter  : Var to create unique id`s.
 * @param {Timer} Timer : Timer which iterates.
 * @param {Timer} MainTimer : Timer for main game process.
 * 
 * @function run():void : Starts the game.
 * @function continue():void : Continue game from current time step.
 * @function pause():void : Make pause. 
 * @function Start():void : Initialize game.
 * @function randomPush():void : Push components in container.
 */

class Game {

    constructor(numberOfMinutes = 60000, gameSpeedValue = 1000) {
        this.currentTime = 0;
        this.score = 0;
        this.MINUTE = numberOfMinutes;
        this.Timer;
        this.MainTimer;
        this.SPEED = gameSpeedValue;
        this.gameStat = 0;
        this.counter = 0;
    }

    run() {
        $(`.container`).empty();
        // alert("Start"); for testing.
        $("#game-res").text(`Your score: 0 points.`);
        this.score = 0;
        this.Start();
    }

    continue () {
        // alert("Continue"); for testing.
        this.Start(this.currentTime);
    }

    pause() {
        // alert("Pause"); for testing.
        this.gameStat = 0;
        clearTimeout(this.MainTimer);
        clearInterval(this.Timer);
    }



    Start(currentTime = 0) {
        this.currentTime = currentTime;
        this.gameStat = 1;
        this.Timer = setInterval(() => {

            this.randomPush(".cubiq", ".container");

            this.currentTime++;
            // console.log(`This time : ${this.currentTime}.`); for testing.
            $("#time-left").text(`Time left : ${(this.MINUTE - this.currentTime * 1000)/1000} seconds.`);

        }, this.SPEED);

        this.MainTimer = setTimeout(() => {
            clearInterval(this.Timer);
            this.gameStat = 0;

            componentsSwitch([start]);
            hideElements([$(`#pause`)]);

            $('.container').empty();
            $('#my-modal-title').text(`Your score: ${this.score}.`);
            $('#myModal').modal();

        }, (this.MINUTE - this.currentTime * 1000));
    }

    /**
     * @param {JqueryObj} item : Item which we push.
     * @param {JqueryObj} container : Item where we push.
     * @param {Number} componentsCount : Number of elements to push every time step.
     * @param {JqueryObj} scoreContainer : Item where we push score.
     */
    randomPush(item, container, componentsCount = 2, scoreContainer = "#game-res") {

        for (let i = 0; i < Math.random() * componentsCount; i++) {
            this.counter++;

            $(`${container}`).append(`<div class = 'cubiq' id='${this.counter}'></div>`);

            let containerHeight = $(`${container}`).height(),
                conteinerWidth = $(`${container}`).width(),
                component = $(`#${this.counter}`),
                component_width = component.width(),
                component_height = component.height(),
                heightMax = containerHeight - component_height,
                widthMax = conteinerWidth - component_width;

            component.css({
                left: Math.floor(Math.random() * widthMax),
                top: Math.floor(Math.random() * heightMax)
            });

            $(`#${this.counter}`).on("click", (e) => {
                if (this.gameStat) {
                    $(e.target).remove();
                    this.score++;
                    $(`${scoreContainer}`).text(`Your score: ${this.score} points.`);
                }
            });
        }
    }

}

/**
 * @param {JqueryObjArr} components : Switch state of components from visible to hidden and backwords. 
 */
function componentsSwitch(components) {
    for (let i = 0; i < components.length; i++) {
        if (components[i].css("display") == "none") {
            components[i].css("display", "inline");
        } else {
            components[i].css("display", "none");
        }
    }
}

/**
 * @param {JqueryObjArr} components : Components which we hide. 
 */
function hideElements(components) {
    for (let i = 0; i < components.length; i++) {
        components[i].css("display", "none");
    }
}

let game = new Game(10000, 1000);

document.cookie += "";

let pause = $(`#pause`);
let proceed = $(`#continue`);
let start = $('#start');
let resultTable = $("#res-table");
let saveBtn = $('.save-btn');
let playerName = $('#player-name');

hideElements([pause, proceed]);

start.click(() => {
    game.run();
    start.css("display", "none");
    componentsSwitch([pause]);
});

pause.click(() => {
    game.pause();
    componentsSwitch([pause, proceed]);
});

proceed.click(() => {
    game.continue();
    componentsSwitch([pause, proceed]);
});

resultTable.click(() => {
    let component = $(".res-table");
    componentsSwitch([component]);
});


saveBtn.click(() => {
    if (playerName.val() === "") {
        playerName.val("Enter your name!");
    } else {
        if (~playerName.val().indexOf(" ")) {
            playerName.val("Delete white spaces!");
        } else {
            saveBtn.css("background-color", "green");
            document.cookie += `${playerName.val()} ${game.score}||`;
            $('#myModal').modal(`hide`);
        }
    }
});



let resArr = document.cookie.split('||');
for (let i = 0; i < resArr.length; i++) {
    let [name, score] = resArr[i].split(" ");
    $('.res-container').append(`
    <div class = "result-item">
        <div>Name: ${name || "Be the next!"}</div>
        <div>Score: ${score || "Set the best!"}</div>
    </div>
    `);
}

