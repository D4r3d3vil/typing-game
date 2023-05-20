<script>
    import hotkeys from "hotkeys-js";
    import { onMount } from "svelte";
    import { time } from "../Stopwatch";
    import { start } from "../Stopwatch";
    import { pause } from "../Stopwatch";
    import { formatTime } from "../Stopwatch";
    import { paragraph, addTemplates } from "txtgen";
    let selected = "",
        animation = false,
        typed = "",
        text = "loading...",
        verb = "",
        wrong = false;
    let keyboard = {
        keys: [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
            ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "-"],
        ],
    },
    timeStr='0:0';
    const templates = [
        "The {{adjective}} {{noun}} is {{adjective}}",
        "{{noun}} is the new {{noun}}",
        "{{noun}} is the new {{adjective}}",
        "The {{adjective}} {{noun}} is the best thing since {{noun}}" + "s",
    ];
    async function genrateTemplates() {
        await genrateVerb();
        templates.push(
            `The {{adjective}} {{noun}}s ${verb} the {{adjective}} {{noun}}`
        );
        await genrateVerb();
        templates.push(`The {{noun}}s ${verb} the {{noun}}`);
        addTemplates(templates);
    }
    async function genrateVerb() {
        return fetch(`https://api.api-ninjas.com/v1/randomword?type=verb`, {
            method: "GET",
            headers: {
                "X-Api-Key": "ibEa/3Em3o682sebzdLsaQ==Z3BWaiOj3wB64OhC",
            },
        })
            .then((res) => res.json())
            .then((data) => (verb = data.word));
    }
    function animateKey(key) {
        if (animation) stopAnimation();
        selected = key;
        animation = setTimeout(stopAnimation, 1000);
    }
    function stopAnimation() {
        selected = "";
        clearTimeout(animation);
        animation = false;
    }
    function genrateSentence() {
        return paragraph(5).toLowerCase();
    }
    onMount(async () => {
        await genrateTemplates();
        text = genrateSentence().replace(/[?!]/g, ".");
        hotkeys(
            "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,space,,,.,;,-,'",
            function (event, handler) {
                animateKey(event.key);
                checkLetter(event.key);
            }
        );
    });
    function checkLetter(key) {
        if($time == 0) start()
        if (key == text[typed.length].toLowerCase()) {
            typed += key;
            return (wrong = false);
        }
        return wrong = true;
    }
    setInterval(function(){
        if($time==0) return
        timeStr = formatTime(Date.now()-$time)
    }, 0)
</script>
<div>
    <p>{timeStr}</p>
    <div class="paragraph">
        {#if text}
            <div class="text">
                {#each typed.split("") as letter}
                    <p class="word">{letter}</p>
                {/each}
                <p class="cursor word">|</p>
            </div>
            <div class="text">
                {#if wrong}
                    <p class="word red">{text[typed.length]}</p>
                    {#each text
                        .split("")
                        .splice(typed.length + 1, text.length - 1) as letter}<p
                            class="word"
                        >{letter}</p>{/each}{:else}{#each text
                        .split("")
                        .splice(typed.length, text.length - 1) as letter}<p
                            class="word"
                        >{letter}</p>{/each}{/if}
            </div>{/if}
    </div>
    <div class="keyboard">
        {#each keyboard.keys as keyarr}
            <div class="keyboard__row">
                {#each keyarr as key}
                    <div
                        class="key--letter unselectable {selected ==
                        key.toLowerCase()
                            ? 'selected'
                            : ''}"
                        data-char={key}
                        on:click={() => checkLetter(key)}
                    >
                        {key}
                    </div>
                {/each}
            </div>
            <br />
        {/each}
        <div class="keyboard__row">
            <div
                class="key--double key--letter unselectable key--space {selected ==
                ' '
                    ? 'selected'
                    : ''}"
                data-key="32"
                data-char="space"
                on:click={() => checkLetter(" ")}
            >
                &nbsp;space
            </div>
        </div>
    </div>
</div>

<style>
    .keyboard {
        text-align: center;
        font-size: 1.5vh;
        font-family: sans-serif;
    }

    .keyboard__row {
        display: inline-block;
        height: 3em;
        margin: 0.2em;
    }
    .keyboard__row > * {
        position: relative;
        background: #2a2a2a;
        text-align: center;
        color: white;
        float: left;
        border-radius: 0.3em;
        margin: 0.2em;
        padding: 0.2em;
        width: 5em;
        height: 95%;
        box-sizing: border-box;
        cursor: pointer;
        border: 1px solid #444;
        box-shadow: 0 0.4em 0 0.1em #222;
        border-bottom-color: #555;
    }
    .keyboard__row > div:active,
    .selected {
        color: #aaa;
        position: relative;
        top: 0.2em;
        box-shadow: 0 0 0 0.05em black;
    }
    .key--letter {
        line-height: 2.8em;
    }
    .keyboard > .keyboard__row {
        text-align: center;
    }
    .wordDef {
        color: #000;
        background-color: #b47f75;
    }
    button {
        background-color: #b47f75;
    }
    .key--space {
        width: 30em;
        background-color: #2a2a2a;
    }

    .key--double > * {
        padding-top: 0.1em;
    }
    .unselectable {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .word, .text{
        display: inline;
    }
    div {
        text-align: center;
    }
    .paragraph {
        max-width: 40%;
        margin: 0 auto;
        font-size: larger;
    }
    .red {
        color: red;
    }
    .cursor{
        margin-right: -7px;
        font-size: x-large;
        display: inline;
    }
</style>
