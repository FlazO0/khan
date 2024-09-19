// ==UserScript==
// @name        MOD KHAN @FLAZO0
// @grant       none
// @match       https://pt.khanacademy.org/*
// @license     MIT
// @version     3.0 Remake
// @author      KIN
// @description ModMenu para khan academy
// ==/UserScript==


(function () {
  let overlayHTML = ` <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
<div id="box" style="
    margin-right: 3%;
">
<center>
<button class="main" id="accordian">Abrir/Fechar</button></center>
    <div class="main" id="box2">
        <center><p class="osososk" >KHANACADEMY</p></center>
        <br>
        <left><section><label id="ansHead">Respostas:</label></section></left>

        <center id="mainCen">
        <section><label id="ansBreak">&nbsp;</label></section>

        </center>
        <section><label>&nbsp;</label></section>
              <button onclick="location.reload()" class="inputans">LIMPAR LISTA</button>
            <right><p class="gibsdkjgbd" >Por @flazo0</p></right>
    </div>
</div>

<style>

.gibsdkjgbd {
font-size: 12px !important;
}

#box {
    z-index: 9999;
    position: fixed;
    top: 0;
    right: 0;}
#box2 {
    padding: 15px;
    margin-bottom: 5px;
    display: grid;
    border-radius: 10px;};
section {
    display: flex;
    justify-content: space-between;margin:5px;}
.main {
    width: 100%;
    background-color: #000;
    letter-spacing: 2px;
    border-radius: 9px !important;
    font-weight: none;
    font-size: 11px;
    font-family: 'Roboto', sans-serif;
    color: #FFFFFF;}
.pwhite {
   border-bottom:2px solid white;

   }
#accordian {
width: 90%;
    border: 0;
    cursor: pointer;
    border-radius: 9px;
    padding: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}
.inputans {
    border: 0;
    cursor: pointer;
    border-radius: 9px;
    color: black;
    background-color: antiquewhite;
    font-family: 'Roboto', sans-serif;
    padding: 10px;
}
.toggleclass {
text-align: center;
}
</style>
`



function get(x) { return document.getElementById(x); }

let overlay = document.createElement("div");
    overlay.innerHTML = overlayHTML;
    document.body.appendChild(overlay);

let acc = get("accordian"),
    darkToggle = get("darkToggle"),
    ansbutton = get("inputans"),
    ansbutton2 = get("inputans2")

acc.onclick = function() {
    let panel = get("box2");
    let acc = get("accordian")
    if (panel.style.display == "grid") panel.style.display = "none";
    else { panel.style.display = "grid";}

}


    'use strict';
    window.loaded = false;

    class Answer {

        constructor(answer, type) {
            this.body = answer;
            this.type = type;
        }

        get isMultiChoice() {
            return this.type == "multiple_choice";
        }

        get isFreeResponse() {
            return this.type == "free_response";
        }

        get isExpression() {
            return this.type == "expression";
        }

        get isDropdown() {
            return this.type == "dropdown";
        }

        log() {
            const answer = this.body;

            answer.map(ans => {
                if (typeof ans == "string") {
                    if (ans.includes("web+graphie")) {
                        this.body[this.body.indexOf(ans)] = "";
                        this.printImage(ans);
                    } else {
                        answer[answer.indexOf(ans)] = ans.replaceAll(" ", "");
                    }
                }
            });


        }


    }

    const originalFetch = window.fetch;
    window.fetch = function () {
        return originalFetch.apply(this, arguments).then(async (res) => {
            if (res.url.includes("/getAssessmentItem")) {
                const clone = res.clone();
                const json = await clone.json()
                 let item, question;


                item = json.data.assessmentItem.item.itemData;
                question = JSON.parse(item).question;


                    Object.keys(question.widgets).map(widgetName => {
                        switch (widgetName.split(" ")[0]) {
                            case "numeric-input":
                                return freeResponseAnswerFrom(question).log();
                            case "radio":
                                return multipleChoiceAnswerFrom(question).log();
                            case "expression":
                                return expressionAnswerFrom(question).log();
                            case "dropdown":
                                return dropdownAnswerFrom(question).log();
                        }
                    });
            }

            if (!window.loaded) {
                console.clear();

                window.loaded = true;
            }

            return res;
        })
    }

    let curAns = 1

    function freeResponseAnswerFrom(question) {
        const answer = Object.values(question.widgets).map((widget) => {
            if (widget.options?.answers) {
                return widget.options.answers.map(answer => {
                    if (answer.status == "correct") {

                        var parNumCurAns = "parNum" + curAns
                        var createPar = document.createElement('section')
                        createPar.innerHTML = answer.value
                        document.getElementById('ansBreak').append(createPar)

                        curAns++
                    }
                });
            }
        }).flat().filter((val) => { return val !== undefined; });

        return new Answer(answer, "free_response");
    }



    function multipleChoiceAnswerFrom(question) {
        const answer = Object.values(question.widgets).map((widget) => {
            if (widget.options?.choices) {
                return widget.options.choices.map(choice => {
                    if (choice.correct) {

                        var parNumCurAns = "parNum" + curAns
                        var createPar = document.createElement('section')
                        createPar.innerHTML = choice.content
                        document.getElementById('ansBreak').append(createPar)

                        curAns++

                    }
                });
            }
        }).flat().filter((val) => { return val !== undefined; });

        return new Answer(answer, "multiple_choice");
    }

    function expressionAnswerFrom(question) {
        const answer = Object.values(question.widgets).map((widget) => {
            if (widget.options?.answerForms) {
                return widget.options.answerForms.map(answer => {
                    if (Object.values(answer).includes("correct")) {

                        var parNumCurAns = "parNum" + curAns
                        var createPar = document.createElement('section')
                        createPar.innerHTML = answer.value
                        document.getElementById('ansBreak').append(createPar)

                        curAns++

                    }
                });
            }
        }).flat();

        return new Answer(answer, "expression");
    }

    function dropdownAnswerFrom(question) {
        const answer = Object.values(question.widgets).map((widget) => {
            if (widget.options?.choices) {
                return widget.options.choices.map(choice => {
                    if (choice.correct) {

                        var parNumCurAns = "parNum" + curAns
                        var createPar = document.createElement('section')
                        createPar.innerHTML = choice.content
                        document.getElementById('ansBreak').append(createPar)

                        curAns++
                    }
                });
            }
        }).flat();

        return new Answer(answer, "dropdown");
    }
})();
