import { writable } from "svelte/store";
export let time = writable(0);
let running = false;
export function formatTime(time) {
    if(time==0) return `0:0`
    let seconds = Math.floor(time / 1000);
    let remainingtime = time % 1000;
    return `${seconds}:${remainingtime}`;
};
export function start() {
    running = true;
    time.set(Date.now());
}
export function reset() {
    running = false;
  time.set(0);
}
export function pause() {
  running = false;
}