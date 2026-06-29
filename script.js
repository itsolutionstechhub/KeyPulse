/**
 * KeyPulse - Premium Keyboard and Mouse Tester Logic
 */

// Web Audio API Sound Simulator
class SwitchAudio {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    play(type) {
        this.init();
        if (this.ctx.state === 'suspended') return;
        
        const now = this.ctx.currentTime;
        
        if (type === 'blue') {
            this.playClick(now, 3400, 0.006, 0.06);
            this.playThud(now + 0.002, 170, 0.05, 0.12);
        } else if (type === 'brown') {
            this.playClick(now, 1800, 0.008, 0.03);
            this.playThud(now + 0.001, 140, 0.06, 0.09);
        } else if (type === 'red') {
            this.playThud(now, 120, 0.07, 0.1);
        }
    }

    playClick(time, freq, decay, volume) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, time + decay);
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + decay);
    }

    playThud(time, cutoffFreq, decay, volume) {
        const bufferSize = this.ctx.sampleRate * decay;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(cutoffFreq, time);
        filter.frequency.exponentialRampToValueAtTime(cutoffFreq / 2, time + decay);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(time);
        noise.stop(time + decay);
    }
}

const audioSynth = new SwitchAudio();

// Keyboard Layout Specifications
const layouts = {
    'layout-100': [
        [
            { code: 'Escape', label: 'Esc', class: 'special' },
            { spacer: 1 },
            { code: 'F1', label: 'F1' },
            { code: 'F2', label: 'F2' },
            { code: 'F3', label: 'F3' },
            { code: 'F4', label: 'F4' },
            { spacer: 0.5 },
            { code: 'F5', label: 'F5' },
            { code: 'F6', label: 'F6' },
            { code: 'F7', label: 'F7' },
            { code: 'F8', label: 'F8' },
            { spacer: 0.5 },
            { code: 'F9', label: 'F9' },
            { code: 'F10', label: 'F10' },
            { code: 'F11', label: 'F11' },
            { code: 'F12', label: 'F12' },
            { spacer: 0.25 },
            { code: 'PrintScreen', label: 'PrtSc', class: 'special' },
            { code: 'ScrollLock', label: 'ScrLk', class: 'special' },
            { code: 'Pause', label: 'Pause', class: 'special' }
        ],
        [
            { code: 'Backquote', label: '~', subLabel: '`' },
            { code: 'Digit1', label: '!', subLabel: '1' },
            { code: 'Digit2', label: '@', subLabel: '2' },
            { code: 'Digit3', label: '#', subLabel: '3' },
            { code: 'Digit4', label: '$', subLabel: '4' },
            { code: 'Digit5', label: '%', subLabel: '5' },
            { code: 'Digit6', label: '^', subLabel: '6' },
            { code: 'Digit7', label: '&', subLabel: '7' },
            { code: 'Digit8', label: '*', subLabel: '8' },
            { code: 'Digit9', label: '(', subLabel: '9' },
            { code: 'Digit0', label: ')', subLabel: '0' },
            { code: 'Minus', label: '_', subLabel: '-' },
            { code: 'Equal', label: '+', subLabel: '=' },
            { code: 'Backspace', label: 'Backspace', width: 2, class: 'special' },
            { spacer: 0.25 },
            { code: 'Insert', label: 'Ins', class: 'special' },
            { code: 'Home', label: 'Home', class: 'special' },
            { code: 'PageUp', label: 'PgUp', class: 'special' },
            { spacer: 0.25 },
            { code: 'NumLock', label: 'Num', class: 'special' },
            { code: 'NumpadDivide', label: '/' },
            { code: 'NumpadMultiply', label: '*' },
            { code: 'NumpadSubtract', label: '-' }
        ],
        [
            { code: 'Tab', label: 'Tab', width: 1.5, class: 'special' },
            { code: 'KeyQ', label: 'Q' },
            { code: 'KeyW', label: 'W' },
            { code: 'KeyE', label: 'E' },
            { code: 'KeyR', label: 'R' },
            { code: 'KeyT', label: 'T' },
            { code: 'KeyY', label: 'Y' },
            { code: 'KeyU', label: 'U' },
            { code: 'KeyI', label: 'I' },
            { code: 'KeyO', label: 'O' },
            { code: 'KeyP', label: 'P' },
            { code: 'BracketLeft', label: '{', subLabel: '[' },
            { code: 'BracketRight', label: '}', subLabel: ']' },
            { code: 'Backslash', label: '|', subLabel: '\\', width: 1.5 },
            { spacer: 0.25 },
            { code: 'Delete', label: 'Del', class: 'special' },
            { code: 'End', label: 'End', class: 'special' },
            { code: 'PageDown', label: 'PgDn', class: 'special' },
            { spacer: 0.25 },
            { code: 'Numpad7', label: '7', subLabel: 'Home' },
            { code: 'Numpad8', label: '8', subLabel: '▲' },
            { code: 'Numpad9', label: '9', subLabel: 'PgUp' },
            { code: 'NumpadAdd', label: '+' }
        ],
        [
            { code: 'CapsLock', label: 'Caps', width: 1.75, class: 'special' },
            { code: 'KeyA', label: 'A' },
            { code: 'KeyS', label: 'S' },
            { code: 'KeyD', label: 'D' },
            { code: 'KeyF', label: 'F' },
            { code: 'KeyG', label: 'G' },
            { code: 'KeyH', label: 'H' },
            { code: 'KeyJ', label: 'J' },
            { code: 'KeyK', label: 'K' },
            { code: 'KeyL', label: 'L' },
            { code: 'Semicolon', label: ':', subLabel: ';' },
            { code: 'Quote', label: '"', subLabel: '\'' },
            { code: 'Enter', label: 'Enter', width: 2.25, class: 'special' },
            { spacer: 0.25 },
            { spacer: 3, invisible: true },
            { spacer: 0.25 },
            { code: 'Numpad4', label: '4', subLabel: '◀' },
            { code: 'Numpad5', label: '5' },
            { code: 'Numpad6', label: '6', subLabel: '▶' },
            { spacer: 1, invisible: true }
        ],
        [
            { code: 'ShiftLeft', label: 'Shift', width: 2.25, class: 'special' },
            { code: 'KeyZ', label: 'Z' },
            { code: 'KeyX', label: 'X' },
            { code: 'KeyC', label: 'C' },
            { code: 'KeyV', label: 'V' },
            { code: 'KeyB', label: 'B' },
            { code: 'KeyN', label: 'N' },
            { code: 'KeyM', label: 'M' },
            { code: 'Comma', label: '<', subLabel: ',' },
            { code: 'Period', label: '>', subLabel: '.' },
            { code: 'Slash', label: '?', subLabel: '/' },
            { code: 'ShiftRight', label: 'Shift', width: 2.75, class: 'special' },
            { spacer: 0.25 },
            { spacer: 1, invisible: true },
            { code: 'ArrowUp', label: '▲' },
            { spacer: 1, invisible: true },
            { spacer: 0.25 },
            { code: 'Numpad1', label: '1', subLabel: 'End' },
            { code: 'Numpad2', label: '2', subLabel: '▼' },
            { code: 'Numpad3', label: '3', subLabel: 'PgDn' },
            { code: 'NumpadEnter', label: 'Ent', class: 'special' }
        ],
        [
            { code: 'ControlLeft', label: 'Ctrl', width: 1.25, class: 'special' },
            { code: 'MetaLeft', label: 'Win', macLabel: 'Cmd', width: 1.25, class: 'special' },
            { code: 'AltLeft', label: 'Alt', macLabel: 'Opt', width: 1.25, class: 'special' },
            { code: 'Space', label: '', width: 6.25 },
            { code: 'AltRight', label: 'Alt', macLabel: 'Opt', width: 1.25, class: 'special' },
            { code: 'MetaRight', label: 'Win', macLabel: 'Cmd', width: 1.25, class: 'special' },
            { code: 'Fn', label: 'Fn', width: 1.25, class: 'special' },
            { code: 'ControlRight', label: 'Ctrl', width: 1.25, class: 'special' },
            { spacer: 0.25 },
            { code: 'ArrowLeft', label: '◀' },
            { code: 'ArrowDown', label: '▼' },
            { code: 'ArrowRight', label: '▶' },
            { spacer: 0.25 },
            { code: 'Numpad0', label: '0', subLabel: 'Ins', width: 2 },
            { code: 'NumpadDecimal', label: '.', subLabel: 'Del' },
            { spacer: 1, invisible: true }
        ]
    ],
    'layout-80': [
        [
            { code: 'Escape', label: 'Esc', class: 'special' },
            { spacer: 1 },
            { code: 'F1', label: 'F1' },
            { code: 'F2', label: 'F2' },
            { code: 'F3', label: 'F3' },
            { code: 'F4', label: 'F4' },
            { spacer: 0.5 },
            { code: 'F5', label: 'F5' },
            { code: 'F6', label: 'F6' },
            { code: 'F7', label: 'F7' },
            { code: 'F8', label: 'F8' },
            { spacer: 0.5 },
            { code: 'F9', label: 'F9' },
            { code: 'F10', label: 'F10' },
            { code: 'F11', label: 'F11' },
            { code: 'F12', label: 'F12' },
            { spacer: 0.25 },
            { code: 'PrintScreen', label: 'PrtSc', class: 'special' },
            { code: 'ScrollLock', label: 'ScrLk', class: 'special' },
            { code: 'Pause', label: 'Pause', class: 'special' }
        ],
        [
            { code: 'Backquote', label: '~', subLabel: '`' },
            { code: 'Digit1', label: '!', subLabel: '1' },
            { code: 'Digit2', label: '@', subLabel: '2' },
            { code: 'Digit3', label: '#', subLabel: '3' },
            { code: 'Digit4', label: '$', subLabel: '4' },
            { code: 'Digit5', label: '%', subLabel: '5' },
            { code: 'Digit6', label: '^', subLabel: '6' },
            { code: 'Digit7', label: '&', subLabel: '7' },
            { code: 'Digit8', label: '*', subLabel: '8' },
            { code: 'Digit9', label: '(', subLabel: '9' },
            { code: 'Digit0', label: ')', subLabel: '0' },
            { code: 'Minus', label: '_', subLabel: '-' },
            { code: 'Equal', label: '+', subLabel: '=' },
            { code: 'Backspace', label: 'Backspace', width: 2, class: 'special' },
            { spacer: 0.25 },
            { code: 'Insert', label: 'Ins', class: 'special' },
            { code: 'Home', label: 'Home', class: 'special' },
            { code: 'PageUp', label: 'PgUp', class: 'special' }
        ],
        [
            { code: 'Tab', label: 'Tab', width: 1.5, class: 'special' },
            { code: 'KeyQ', label: 'Q' },
            { code: 'KeyW', label: 'W' },
            { code: 'KeyE', label: 'E' },
            { code: 'KeyR', label: 'R' },
            { code: 'KeyT', label: 'T' },
            { code: 'KeyY', label: 'Y' },
            { code: 'KeyU', label: 'U' },
            { code: 'KeyI', label: 'I' },
            { code: 'KeyO', label: 'O' },
            { code: 'KeyP', label: 'P' },
            { code: 'BracketLeft', label: '{', subLabel: '[' },
            { code: 'BracketRight', label: '}', subLabel: ']' },
            { code: 'Backslash', label: '|', subLabel: '\\', width: 1.5 },
            { spacer: 0.25 },
            { code: 'Delete', label: 'Del', class: 'special' },
            { code: 'End', label: 'End', class: 'special' },
            { code: 'PageDown', label: 'PgDn', class: 'special' }
        ],
        [
            { code: 'CapsLock', label: 'Caps', width: 1.75, class: 'special' },
            { code: 'KeyA', label: 'A' },
            { code: 'KeyS', label: 'S' },
            { code: 'KeyD', label: 'D' },
            { code: 'KeyF', label: 'F' },
            { code: 'KeyG', label: 'G' },
            { code: 'KeyH', label: 'H' },
            { code: 'KeyJ', label: 'J' },
            { code: 'KeyK', label: 'K' },
            { code: 'KeyL', label: 'L' },
            { code: 'Semicolon', label: ':', subLabel: ';' },
            { code: 'Quote', label: '"', subLabel: '\'' },
            { code: 'Enter', label: 'Enter', width: 2.25, class: 'special' },
            { spacer: 0.25 },
            { spacer: 3, invisible: true }
        ],
        [
            { code: 'ShiftLeft', label: 'Shift', width: 2.25, class: 'special' },
            { code: 'KeyZ', label: 'Z' },
            { code: 'KeyX', label: 'X' },
            { code: 'KeyC', label: 'C' },
            { code: 'KeyV', label: 'V' },
            { code: 'KeyB', label: 'B' },
            { code: 'KeyN', label: 'N' },
            { code: 'KeyM', label: 'M' },
            { code: 'Comma', label: '<', subLabel: ',' },
            { code: 'Period', label: '>', subLabel: '.' },
            { code: 'Slash', label: '?', subLabel: '/' },
            { code: 'ShiftRight', label: 'Shift', width: 2.75, class: 'special' },
            { spacer: 0.25 },
            { spacer: 1, invisible: true },
            { code: 'ArrowUp', label: '▲' },
            { spacer: 1, invisible: true }
        ],
        [
            { code: 'ControlLeft', label: 'Ctrl', width: 1.25, class: 'special' },
            { code: 'MetaLeft', label: 'Win', macLabel: 'Cmd', width: 1.25, class: 'special' },
            { code: 'AltLeft', label: 'Alt', macLabel: 'Opt', width: 1.25, class: 'special' },
            { code: 'Space', label: '', width: 6.25 },
            { code: 'AltRight', label: 'Alt', macLabel: 'Opt', width: 1.25, class: 'special' },
            { code: 'MetaRight', label: 'Win', macLabel: 'Cmd', width: 1.25, class: 'special' },
            { code: 'Fn', label: 'Fn', width: 1.25, class: 'special' },
            { code: 'ControlRight', label: 'Ctrl', width: 1.25, class: 'special' },
            { spacer: 0.25 },
            { code: 'ArrowLeft', label: '◀' },
            { code: 'ArrowDown', label: '▼' },
            { code: 'ArrowRight', label: '▶' }
        ]
    ],
    'layout-75': [
        [
            { code: 'Escape', label: 'Esc', class: 'special' },
            { code: 'F1', label: 'F1' },
            { code: 'F2', label: 'F2' },
            { code: 'F3', label: 'F3' },
            { code: 'F4', label: 'F4' },
            { code: 'F5', label: 'F5' },
            { code: 'F6', label: 'F6' },
            { code: 'F7', label: 'F7' },
            { code: 'F8', label: 'F8' },
            { code: 'F9', label: 'F9' },
            { code: 'F10', label: 'F10' },
            { code: 'F11', label: 'F11' },
            { code: 'F12', label: 'F12' },
            { code: 'PrintScreen', label: 'Prt', class: 'special' },
            { code: 'Delete', label: 'Del', class: 'special' }
        ],
        [
            { code: 'Backquote', label: '~', subLabel: '`' },
            { code: 'Digit1', label: '!', subLabel: '1' },
            { code: 'Digit2', label: '@', subLabel: '2' },
            { code: 'Digit3', label: '#', subLabel: '3' },
            { code: 'Digit4', label: '$', subLabel: '4' },
            { code: 'Digit5', label: '%', subLabel: '5' },
            { code: 'Digit6', label: '^', subLabel: '6' },
            { code: 'Digit7', label: '&', subLabel: '7' },
            { code: 'Digit8', label: '*', subLabel: '8' },
            { code: 'Digit9', label: '(', subLabel: '9' },
            { code: 'Digit0', label: ')', subLabel: '0' },
            { code: 'Minus', label: '_', subLabel: '-' },
            { code: 'Equal', label: '+', subLabel: '=' },
            { code: 'Backspace', label: 'Backspace', width: 2, class: 'special' },
            { code: 'PageUp', label: 'PgUp', class: 'special' }
        ],
        [
            { code: 'Tab', label: 'Tab', width: 1.5, class: 'special' },
            { code: 'KeyQ', label: 'Q' },
            { code: 'KeyW', label: 'W' },
            { code: 'KeyE', label: 'E' },
            { code: 'KeyR', label: 'R' },
            { code: 'KeyT', label: 'T' },
            { code: 'KeyY', label: 'Y' },
            { code: 'KeyU', label: 'U' },
            { code: 'KeyI', label: 'I' },
            { code: 'KeyO', label: 'O' },
            { code: 'KeyP', label: 'P' },
            { code: 'BracketLeft', label: '{', subLabel: '[' },
            { code: 'BracketRight', label: '}', subLabel: ']' },
            { code: 'Backslash', label: '|', subLabel: '\\', width: 1.5 },
            { code: 'PageDown', label: 'PgDn', class: 'special' }
        ],
        [
            { code: 'CapsLock', label: 'Caps', width: 1.75, class: 'special' },
            { code: 'KeyA', label: 'A' },
            { code: 'KeyS', label: 'S' },
            { code: 'KeyD', label: 'D' },
            { code: 'KeyF', label: 'F' },
            { code: 'KeyG', label: 'G' },
            { code: 'KeyH', label: 'H' },
            { code: 'KeyJ', label: 'J' },
            { code: 'KeyK', label: 'K' },
            { code: 'KeyL', label: 'L' },
            { code: 'Semicolon', label: ':', subLabel: ';' },
            { code: 'Quote', label: '"', subLabel: '\'' },
            { code: 'Enter', label: 'Enter', width: 2.25, class: 'special' },
            { code: 'Home', label: 'Home', class: 'special' }
        ],
        [
            { code: 'ShiftLeft', label: 'Shift', width: 2.25, class: 'special' },
            { code: 'KeyZ', label: 'Z' },
            { code: 'KeyX', label: 'X' },
            { code: 'KeyC', label: 'C' },
            { code: 'KeyV', label: 'V' },
            { code: 'KeyB', label: 'B' },
            { code: 'KeyN', label: 'N' },
            { code: 'KeyM', label: 'M' },
            { code: 'Comma', label: '<', subLabel: ',' },
            { code: 'Period', label: '>', subLabel: '.' },
            { code: 'Slash', label: '?', subLabel: '/' },
            { code: 'ShiftRight', label: 'Shift', width: 1.75, class: 'special' },
            { code: 'ArrowUp', label: '▲' },
            { code: 'End', label: 'End', class: 'special' }
        ],
        [
            { code: 'ControlLeft', label: 'Ctrl', width: 1.25, class: 'special' },
            { code: 'MetaLeft', label: 'Win', macLabel: 'Cmd', width: 1.25, class: 'special' },
            { code: 'AltLeft', label: 'Alt', macLabel: 'Opt', width: 1.25, class: 'special' },
            { code: 'Space', label: '', width: 6.25 },
            { code: 'AltRight', label: 'Alt', macLabel: 'Opt', width: 1 },
            { code: 'Fn', label: 'Fn', width: 1, class: 'special' },
            { code: 'ControlRight', label: 'Ctrl', width: 1, class: 'special' },
            { code: 'ArrowLeft', label: '◀' },
            { code: 'ArrowDown', label: '▼' },
            { code: 'ArrowRight', label: '▶' }
        ]
    ],
    'layout-60': [
        [
            { code: 'Escape', label: 'Esc', class: 'special' },
            { code: 'Digit1', label: '!', subLabel: '1' },
            { code: 'Digit2', label: '@', subLabel: '2' },
            { code: 'Digit3', label: '#', subLabel: '3' },
            { code: 'Digit4', label: '$', subLabel: '4' },
            { code: 'Digit5', label: '%', subLabel: '5' },
            { code: 'Digit6', label: '^', subLabel: '6' },
            { code: 'Digit7', label: '&', subLabel: '7' },
            { code: 'Digit8', label: '*', subLabel: '8' },
            { code: 'Digit9', label: '(', subLabel: '9' },
            { code: 'Digit0', label: ')', subLabel: '0' },
            { code: 'Minus', label: '_', subLabel: '-' },
            { code: 'Equal', label: '+', subLabel: '=' },
            { code: 'Backspace', label: 'Backspace', width: 2, class: 'special' }
        ],
        [
            { code: 'Tab', label: 'Tab', width: 1.5, class: 'special' },
            { code: 'KeyQ', label: 'Q' },
            { code: 'KeyW', label: 'W' },
            { code: 'KeyE', label: 'E' },
            { code: 'KeyR', label: 'R' },
            { code: 'KeyT', label: 'T' },
            { code: 'KeyY', label: 'Y' },
            { code: 'KeyU', label: 'U' },
            { code: 'KeyI', label: 'I' },
            { code: 'KeyO', label: 'O' },
            { code: 'KeyP', label: 'P' },
            { code: 'BracketLeft', label: '{', subLabel: '[' },
            { code: 'BracketRight', label: '}', subLabel: ']' },
            { code: 'Backslash', label: '|', subLabel: '\\', width: 1.5 }
        ],
        [
            { code: 'CapsLock', label: 'Caps', width: 1.75, class: 'special' },
            { code: 'KeyA', label: 'A' },
            { code: 'KeyS', label: 'S' },
            { code: 'KeyD', label: 'D' },
            { code: 'KeyF', label: 'F' },
            { code: 'KeyG', label: 'G' },
            { code: 'KeyH', label: 'H' },
            { code: 'KeyJ', label: 'J' },
            { code: 'KeyK', label: 'K' },
            { code: 'KeyL', label: 'L' },
            { code: 'Semicolon', label: ':', subLabel: ';' },
            { code: 'Quote', label: '"', subLabel: '\'' },
            { code: 'Enter', label: 'Enter', width: 2.25, class: 'special' }
        ],
        [
            { code: 'ShiftLeft', label: 'Shift', width: 2.25, class: 'special' },
            { code: 'KeyZ', label: 'Z' },
            { code: 'KeyX', label: 'X' },
            { code: 'KeyC', label: 'C' },
            { code: 'KeyV', label: 'V' },
            { code: 'KeyB', label: 'B' },
            { code: 'KeyN', label: 'N' },
            { code: 'KeyM', label: 'M' },
            { code: 'Comma', label: '<', subLabel: ',' },
            { code: 'Period', label: '>', subLabel: '.' },
            { code: 'Slash', label: '?', subLabel: '/' },
            { code: 'ShiftRight', label: 'Shift', width: 2.75, class: 'special' }
        ],
        [
            { code: 'ControlLeft', label: 'Ctrl', width: 1.25, class: 'special' },
            { code: 'MetaLeft', label: 'Win', macLabel: 'Cmd', width: 1.25, class: 'special' },
            { code: 'AltLeft', label: 'Alt', macLabel: 'Opt', width: 1.25, class: 'special' },
            { code: 'Space', label: '', width: 6.25 },
            { code: 'AltRight', label: 'Alt', macLabel: 'Opt', width: 1.25, class: 'special' },
            { code: 'MetaRight', label: 'Win', macLabel: 'Cmd', width: 1.25, class: 'special' },
            { code: 'Fn', label: 'Fn', width: 1.25, class: 'special' },
            { code: 'ControlRight', label: 'Ctrl', width: 1.25, class: 'special' }
        ]
    ]
};

// Translation Dictionaries
const translations = {
    en: {
        tagline: "Smart Diagnostic Console",
        statActive: "Active Keys",
        statNKRO: "Max Rollover",
        statLatency: "Key Latency",
        statTested: "Tested Keys",
        lblLayout: "Keyboard Layout",
        lblOS: "OS Mapping",
        lblSound: "Switch Audio Simulator",
        lblTheme: "Interface Theme",
        lblLang: "Select Language / Idioma",
        btnReset: "Reset Board",
        btnExport: "Export CSV",
        btnClear: "Clear Log",
        mouseTitle: "Mouse Diagnostics",
        mouseCoords: "Coordinates:",
        mouseClicks: "Clicks:",
        mouseDouble: "Double Click:",
        registryTitle: "Active Key Registry",
        regKey: "Key (Char)",
        regCode: "Code",
        regKeycode: "KeyCode (e.which)",
        regLocation: "Location",
        historyTitle: "Diagnostic Event Logger",
        historyHeaders: ["Time", "Key", "DOM Code", "Location", "Event Type", "Press Duration"],
        emptyLog: "No keys tested yet. Press any key on your keyboard to begin diagnostics.",
        footerDesc: "KeyPulse &bull; Premium Hardware Tester &bull; Developed by ",
        footerAbout: "About Us",
        footerPrivacy: "Privacy Policy",
        footerContact: "Contact Us",
        headerAbout: "About Us",
        headerPrivacy: "Privacy Policy",
        headerContact: "Contact Us",
        legend: ["Untested", "Pressing", "Tested (Passed)", "Combined keys (e.g., Fn)"],
        loc0: "Standard",
        loc1: "Left",
        loc2: "Right",
        loc3: "Numpad",
        locUnknown: "Unknown",
        modalAbout: `
            <div class="brand-heading">
                <h2>About KeyPulse</h2>
                <span>Smart Diagnostic Console</span>
            </div>
            <p><strong>KeyPulse</strong> is a high-performance, web-based diagnostic tool designed for hardware enthusiasts, gamers, and programmers to verify keyboard and mouse functionality with sub-millisecond precision.</p>
            <p>This tool is developed in partnership with <strong>IT Solutions Pro</strong>, a dedicated tech brand providing high-quality software solutions, tutorials, and developer resources.</p>
            <p>If you find this utility useful, please subscribe and support our official YouTube channel for more updates and free developer assets:</p>
            <p style="text-align: center; margin-top: 20px;">
                <a href="https://www.youtube.com/@itsolutionspro" target="_blank" style="display: inline-block; padding: 12px 28px; background: #ff0000; color: #fff; border-radius: 6px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4); font-size: 15px;">
                    Subscribe on YouTube
                </a>
            </p>
        `,
        modalContact: `
            <div class="brand-heading">
                <h2>Contact Us</h2>
                <span>Get in Touch with IT Solutions Pro</span>
            </div>
            <p>We value your feedback, feature requests, and bug reports. For any assistance or inquiries regarding KeyPulse, you can reach out directly via our official community channel.</p>
            <p><strong>Support & Business Inquiries:</strong></p>
            <ul>
                <li><strong>Official Channel:</strong> <a href="https://www.youtube.com/@itsolutionspro" target="_blank">IT Solutions Pro YouTube Channel</a></li>
                <li><strong>Community Support:</strong> Leave a comment on our videos or community posts, and our team will respond within 24 hours.</li>
                <li><strong>Creator Profile:</strong> YouTube Creator Handles &bull; @itsolutionspro</li>
            </ul>
            <p>Thank you for choosing KeyPulse for your hardware testing requirements!</p>
        `,
        modalPrivacy: `
            <div class="brand-heading">
                <h2>Privacy Policy</h2>
                <span>KeyPulse & IT Solutions Pro</span>
            </div>
            <p>At KeyPulse, we take user privacy very seriously. We operate a completely transparent web application with no silent background tracking.</p>
            <h3>1. Data Collection</h3>
            <p>KeyPulse operates entirely client-side. The keypress and mouse data analyzed during your testing session are processed instantly inside your web browser. <strong>We do not transmit, collect, or store any of your keystrokes or coordinates on remote web servers.</strong></p>
            <h3>2. Third-Party Ads (Monetag)</h3>
            <p>To keep this diagnostic tool 100% free for everyone, we display third-party advertisements using the Monetag ad network. Monetag may collect anonymous cookies and basic device identifiers to serve tailored ads to visitors. You can configure your browser cookie settings to reject tracking if preferred.</p>
            <h3>3. Channel Association</h3>
            <p>This software is developed in association with <a href="https://www.youtube.com/@itsolutionspro" target="_blank">IT Solutions Pro</a>. By using this website, you consent to our privacy guidelines.</p>
        `,
        article: `
            <h2>Ultimate Keyboard & Mouse Diagnostics: Key Latency & NKRO Explained</h2>
            <p>Welcome to <strong>KeyPulse</strong>, the ultimate utility to diagnose your input peripherals. Whether you are using a premium Apple MacBook, Dell XPS, HP Spectre, Lenovo ThinkPad, Asus ROG, Acer Predator, or MSI gaming machine, our tester ensures each keyboard switch is registering correctly, with zero external latency.</p>
            
            <h3>1. How to Test Your Keyboard</h3>
            <p>Simply press any physical key on your keyboard. The virtual keycap on the screen will light up immediately. Pressing multiple keys simultaneously allows you to verify your keyboard's hardware limits. If a key doesn't highlight, it may indicate a hardware contact failure, liquid damage, or firmware issues.</p>
            
            <h3>2. Understanding Keyboard Latency (Response Time)</h3>
            <p>Key latency is the duration between pressing a key (keydown) and releasing it (keyup). In high-performance gaming (e.g., using Asus ROG, MSI, or Acer Predator laptops), sub-millisecond switch latency is vital for competitive advantage. Low latency ensures your inputs translate immediately into in-game actions.</p>
            
            <h3>3. What is N-Key Rollover (NKRO)?</h3>
            <p>N-Key Rollover (NKRO) refers to the keyboard's ability to register multiple keypresses simultaneously. Standard office keyboards (often found on basic laptops) only support 2-Key or 6-Key Rollover, leading to "ghosting" (where some keys are ignored when pressed together). Premium mechanical keyboards support full NKRO, registering all keys at once.</p>
            
            <h3>4. Integrated Mouse Diagnostics</h3>
            <p>Use the integrated mouse diagnostic console to verify click functionality. Clicking the left, right, or scroll wheel buttons highlights the graphic. The tester tracks coordinates in real-time and measures double-click intervals in milliseconds, assisting you in detecting mouse chatter or double-clicking bugs.</p>
        `
    },
    es: {
        tagline: "Consola de Diagnóstico Inteligente",
        statActive: "Teclas Activas",
        statNKRO: "Máx. Rollover",
        statLatency: "Latencia de Tecla",
        statTested: "Teclas Probadas",
        lblLayout: "Diseño del Teclado",
        lblOS: "Mapeo del SO",
        lblSound: "Simulador de Sonido",
        lblTheme: "Tema de la Interfaz",
        lblLang: "Select Language / Idioma",
        btnReset: "Reiniciar Teclado",
        btnExport: "Exportar CSV",
        btnClear: "Limpiar Registro",
        mouseTitle: "Diagnóstico de Mouse",
        mouseCoords: "Coordenadas:",
        mouseClicks: "Clics:",
        mouseDouble: "Doble Clic:",
        registryTitle: "Registro de Tecla Activa",
        regKey: "Tecla (Char)",
        regCode: "Código",
        regKeycode: "KeyCode (e.which)",
        regLocation: "Ubicación",
        historyTitle: "Registro de Eventos de Diagnóstico",
        historyHeaders: ["Hora", "Tecla", "Código DOM", "Ubicación", "Tipo de Evento", "Duración"],
        emptyLog: "Ninguna tecla probada. Presiona cualquier tecla para comenzar el diagnóstico.",
        footerDesc: "KeyPulse &bull; Probador de Hardware Premium &bull; Desarrollado por ",
        footerAbout: "Sobre Nosotros",
        footerPrivacy: "Política de Privacidad",
        footerContact: "Contacto",
        headerAbout: "Sobre Nosotros",
        headerPrivacy: "Privacidad",
        headerContact: "Contacto",
        legend: ["Sin Probar", "Presionando", "Probado (Pasó)", "Teclas combinadas (ej., Fn)"],
        loc0: "Estándar",
        loc1: "Izquierda",
        loc2: "Derecha",
        loc3: "Teclado Numérico",
        locUnknown: "Desconocido",
        modalAbout: `
            <div class="brand-heading">
                <h2>Sobre KeyPulse</h2>
                <span>Consola de Diagnóstico Inteligente</span>
            </div>
            <p><strong>KeyPulse</strong> es una herramienta de diagnóstico web de alto rendimiento diseñada para entusiastas de hardware, jugadores y programadores para verificar la funcionalidad de teclado y mouse con precisión de submilisegundos.</p>
            <p>Este software se desarrolla en asociación con <strong>IT Solutions Pro</strong>, una marca tecnológica dedicada a brindar soluciones de software, tutoriales y recursos.</p>
            <p>Si encuentra útil esta utilidad, suscríbase y apoye nuestro canal oficial de YouTube:</p>
            <p style="text-align: center; margin-top: 20px;">
                <a href="https://www.youtube.com/@itsolutionspro" target="_blank" style="display: inline-block; padding: 12px 28px; background: #ff0000; color: #fff; border-radius: 6px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4); font-size: 15px;">
                    Suscribirse en YouTube
                </a>
            </p>
        `,
        modalContact: `
            <div class="brand-heading">
                <h2>Contacto</h2>
                <span>Póngase en contacto con IT Solutions Pro</span>
            </div>
            <p>Valoramos sus comentarios, solicitudes de funciones e informes de errores. Para cualquier consulta sobre KeyPulse, contáctenos en nuestro canal oficial.</p>
            <p><strong>Soporte y Consultas Comerciales:</strong></p>
            <ul>
                <li><strong>Canal Oficial:</strong> <a href="https://www.youtube.com/@itsolutionspro" target="_blank">Canal de YouTube IT Solutions Pro</a></li>
                <li><strong>Soporte de la comunidad:</strong> Deje un comentario en nuestros videos y responderemos en 24 horas.</li>
            </ul>
        `,
        modalPrivacy: `
            <div class="brand-heading">
                <h2>Política de Privacidad</h2>
                <span>KeyPulse & IT Solutions Pro</span>
            </div>
            <p>En KeyPulse, nos tomamos muy en serio la privacidad. Operamos una aplicación transparente sin seguimiento en segundo plano.</p>
            <h3>1. Recopilación de Datos</h3>
            <p>KeyPulse funciona completamente en el navegador del usuario. Los datos no se transmiten, recopilan ni almacenan en servidores web remotos.</p>
            <h3>2. Anuncios de Terceros (Monetag)</h3>
            <p>Para mantener esta herramienta gratuita, mostramos anuncios a través de Monetag. Monetag puede recopilar cookies anónimas para personalizar anuncios.</p>
            <h3>3. Asociación de Canal</h3>
            <p>Este software se desarrolla en asociación con <a href="https://www.youtube.com/@itsolutionspro" target="_blank">IT Solutions Pro</a>.</p>
        `,
        article: `
            <h2>Diagnóstico Definitivo de Teclado y Mouse: Latencia de Teclas y NKRO Explicados</h2>
            <p>Bienvenido a <strong>KeyPulse</strong>, la herramienta definitiva para diagnosticar sus periféricos de entrada. Ya sea que use un Apple MacBook, Dell XPS, HP Spectre, Lenovo ThinkPad, Asus ROG, Acer Predator o MSI, nuestro probador asegura que cada interruptor registre correctamente sin latencia externa.</p>
            
            <h3>1. Cómo Probar su Teclado</h3>
            <p>Presione cualquier tecla física. El teclado virtual en pantalla se iluminará de inmediato. Presionar varias teclas simultáneamente le permite verificar los límites de hardware. Si una tecla no se ilumina, puede indicar fallas de hardware, daños por líquidos o problemas de firmware.</p>
            
            <h3>2. Latencia de Tecla (Tiempo de Respuesta)</h3>
            <p>La latencia de tecla es la duración entre presionar una tecla (keydown) y soltarla (keyup). En gaming de alto rendimiento (Asus ROG, MSI, Acer Predator), una latencia inferior a un milisegundo es vital. Una latencia baja garantiza que sus acciones se traduzcan inmediatamente en el juego.</p>
            
            <h3>3. ¿Qué es el N-Key Rollover (NKRO)?</h3>
            <p>El N-Key Rollover (NKRO) es la capacidad del teclado para registrar varias pulsaciones simultáneamente. Los teclados de oficina estándar (Apple, Dell o HP) solo admiten rollover de 2 o 6 teclas, provocando "ghosting" (teclas ignoradas). Los teclados mecánicos premium admiten NKRO completo.</p>
            
            <h3>4. Diagnóstico de Mouse Integrado</h3>
            <p>Use la consola de diagnóstico de mouse integrada para verificar la funcionalidad de los clics. Presionar los botones izquierdo, derecho o la rueda de desplazamiento ilumina el gráfico. El probador rastrea coordenadas en tiempo real y mide el intervalo de doble clic en milisegundos.</p>
        `
    },
    de: {
        tagline: "Intelligente Diagnosekonsole",
        statActive: "Aktive Tasten",
        statNKRO: "Max. Rollover",
        statLatency: "Tastatur-Latenz",
        statTested: "Geprüfte Tasten",
        lblLayout: "Tastaturlayout",
        lblOS: "Betriebssystem-Mapping",
        lblSound: "Schalter-Audio-Simulator",
        lblTheme: "Benutzeroberfläche-Design",
        lblLang: "Select Language / Idioma",
        btnReset: "Tastatur Reset",
        btnExport: "CSV Exportieren",
        btnClear: "Protokoll Löschen",
        mouseTitle: "Maus-Diagnostik",
        mouseCoords: "Koordinaten:",
        mouseClicks: "Klicks:",
        mouseDouble: "Doppelklick:",
        registryTitle: "Aktives Tastenregister",
        regKey: "Taste (Char)",
        regCode: "Code",
        regKeycode: "KeyCode (e.which)",
        regLocation: "Position",
        historyTitle: "Diagnose-Ereignisprotokoll",
        historyHeaders: ["Zeit", "Taste", "DOM-Code", "Position", "Ereignistyp", "Dauer"],
        emptyLog: "Noch keine Tasten getestet. Drücken Sie eine beliebige Taste, um das Diagnoseprotokoll zu starten.",
        footerDesc: "KeyPulse &bull; Premium-Hardwaretester &bull; Entwickelt von ",
        footerAbout: "Über Uns",
        footerPrivacy: "Datenschutzerklärung",
        footerContact: "Kontakt",
        headerAbout: "Über Uns",
        headerPrivacy: "Datenschutz",
        headerContact: "Kontakt",
        legend: ["Ungeprüft", "Gedrückt", "Geprüft (Bestanden)", "Kombinationen (z. B. Fn)"],
        loc0: "Standard",
        loc1: "Links",
        loc2: "Rechts",
        loc3: "Ziffernblock",
        locUnknown: "Unbekannt",
        modalAbout: `
            <div class="brand-heading">
                <h2>Über KeyPulse</h2>
                <span>Intelligente Diagnosekonsole</span>
            </div>
            <p><strong>KeyPulse</strong> ist ein leistungsstarkes Web-Diagnosewerkzeug für Gamer, Programmierer und Hardware-Enthusiasten zur präzisen Überprüfung von Tastatur und Maus.</p>
            <p>Dieses Tool wurde in Partnerschaft mit <strong>IT Solutions Pro</strong> entwickelt, einer Marke für Tech-Tutorials und Softwarelösungen.</p>
            <p>Bitte abonnieren und unterstützen Sie unseren offiziellen YouTube-Kanal:</p>
            <p style="text-align: center; margin-top: 20px;">
                <a href="https://www.youtube.com/@itsolutionspro" target="_blank" style="display: inline-block; padding: 12px 28px; background: #ff0000; color: #fff; border-radius: 6px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4); font-size: 15px;">
                    Auf YouTube abonnieren
                </a>
            </p>
        `,
        contact: `
            <div class="brand-heading">
                <h2>Kontakt</h2>
                <span>Kontaktieren Sie IT Solutions Pro</span>
            </div>
            <p>Wir freuen uns über Feedback und Fehlermeldungen. Kontaktieren Sie uns über unseren offiziellen Kanal.</p>
            <ul>
                <li><strong>Offizieller Kanal:</strong> <a href="https://www.youtube.com/@itsolutionspro" target="_blank">IT Solutions Pro YouTube-Kanal</a></li>
            </ul>
        `,
        modalPrivacy: `
            <div class="brand-heading">
                <h2>Datenschutzerklärung</h2>
                <span>KeyPulse & IT Solutions Pro</span>
            </div>
            <p>Ihre Privatsphäre ist uns wichtig. KeyPulse läuft vollständig in Ihrem Browser; es werden keine Tastatureingaben oder Daten an Server übermittelt.</p>
            <p>Wir nutzen Monetag-Werbung zur Finanzierung. Monetag kann anonyme Cookies für personalisierte Werbung erfassen.</p>
        `,
        article: `
            <h2>Tastatur- und Mausdiagnose: Tastenlatenz und NKRO erklärt</h2>
            <p>Willkommen bei <strong>KeyPulse</strong>, dem ultimativen Diagnosewerkzeug für Ihre Eingabegeräte. Egal, ob Sie ein Apple MacBook, Dell XPS, HP Spectre, Lenovo ThinkPad, Asus ROG, Acer Predator oder ein MSI-Gaming-Notebook verwenden, unser Tester stellt sicher, dass jeder Schalter fehlerfrei funktioniert.</p>
            
            <h3>1. So Testen Sie Ihre Tastatur</h3>
            <p>Drücken Sie eine beliebige physische Taste. Die virtuelle Taste auf dem Bildschirm leuchtet sofort auf. Durch gleichzeitiges Drücken mehrerer Tasten können Sie die Hardwaregrenzen überprüfen. Leuchtet eine Taste nicht auf, liegt möglicherweise ein Kontaktschaden vor.</p>
            
            <h3>2. Tastatur-Latenz (Reaktionszeit)</h3>
            <p>Die Tastenlatenz ist die Zeitspanne zwischen dem Drücken (keydown) und Loslassen (keyup) einer Taste. Bei Gaming-Notebooks (Asus ROG, MSI, Acer Predator) ist eine Latenzzeit von unter einer Millisekunde entscheidend für schnelle Reaktionen im Spiel.</p>
            
            <h3>3. Was ist N-Key Rollover (NKRO)?</h3>
            <p>N-Key Rollover (NKRO) beschreibt die Fähigkeit einer Tastatur, beliebig viele Tastenanschläge gleichzeitig zu registrieren. Laptops von Apple, Dell oder HP unterstützen oft nur 2- oder 6-Tasten-Rollover, was zu Tastatur-Ghosting führt. Premium-Tastaturen bieten volles NKRO.</p>
            
            <h3>4. Integrierte Mausdiagnose</h3>
            <p>Nutzen Sie die integrierte Maus-Diagnosekonsole, um Linksklick, Rechtsklick und Scrollrad zu überprüfen. Der Tester erfasst die Koordinaten der Maus in Echtzeit und misst die Doppelklick-Verzögerung in Millisekunden.</p>
        `
    },
    fr: {
        tagline: "Console de Diagnostic Intelligente",
        statActive: "Touches Actives",
        statNKRO: "Rollover Max",
        statLatency: "Latence des Touches",
        statTested: "Touches Testées",
        lblLayout: "Disposition du Clavier",
        lblOS: "Mappage de l'OS",
        lblSound: "Simulateur de Son",
        lblTheme: "Thème de l'Interface",
        lblLang: "Select Language / Idioma",
        btnReset: "Réinitialiser",
        btnExport: "Exporter CSV",
        btnClear: "Effacer journal",
        mouseTitle: "Diagnostics de la Souris",
        mouseCoords: "Coordonnées:",
        mouseClicks: "Clics:",
        mouseDouble: "Double Clic:",
        registryTitle: "Registre des Touches Actives",
        regKey: "Touche (Char)",
        regCode: "Code",
        regKeycode: "KeyCode (e.which)",
        regLocation: "Emplacement",
        historyTitle: "Journal des Événements",
        historyHeaders: ["Heure", "Touche", "Code DOM", "Emplacement", "Type", "Durée"],
        emptyLog: "Aucune touche testée. Appuyez sur une touche pour démarrer le diagnostic.",
        footerDesc: "KeyPulse &bull; Testeur Matériel Premium &bull; Développé par ",
        footerAbout: "À Propos",
        footerPrivacy: "Politique de Confidentialité",
        footerContact: "Contact",
        headerAbout: "À Propos",
        headerPrivacy: "Confidentialité",
        headerContact: "Contact",
        legend: ["Non Testé", "En Cours", "Testé (Réussi)", "Touches combinées (ex. Fn)"],
        loc0: "Standard",
        loc1: "Gauche",
        loc2: "Droite",
        loc3: "Pavé Numérique",
        locUnknown: "Inconnu",
        modalAbout: `
            <div class="brand-heading">
                <h2>À Propos de KeyPulse</h2>
                <span>Console de Diagnostic Intelligente</span>
            </div>
            <p><strong>KeyPulse</strong> est un outil de diagnostic haute performance conçu pour tester clavier et souris avec une précision extrême.</p>
            <p>Développé en partenariat avec <strong>IT Solutions Pro</strong>, une marque dédiée aux ressources et tutoriels informatiques.</p>
            <p>Soutenez notre chaîne officielle YouTube en vous abonnant :</p>
            <p style="text-align: center; margin-top: 20px;">
                <a href="https://www.youtube.com/@itsolutionspro" target="_blank" style="display: inline-block; padding: 12px 28px; background: #ff0000; color: #fff; border-radius: 6px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4); font-size: 15px;">
                    S'abonner sur YouTube
                </a>
            </p>
        `,
        modalContact: `
            <div class="brand-heading">
                <h2>Contactez-nous</h2>
                <span>IT Solutions Pro</span>
            </div>
            <p>Contactez-nous via notre chaîne communautaire pour toute question ou suggestion.</p>
            <ul>
                <li><strong>Chaîne YouTube:</strong> <a href="https://www.youtube.com/@itsolutionspro" target="_blank">IT Solutions Pro YouTube</a></li>
            </ul>
        `,
        modalPrivacy: `
            <div class="brand-heading">
                <h2>Politique de Confidentialité</h2>
                <span>KeyPulse & IT Solutions Pro</span>
            </div>
            <p>KeyPulse s'exécute localement dans le navigateur. Aucune donnée de frappe n'est envoyée à des serveurs distants.</p>
            <p>Nous affichons des publicités via le réseau Monetag, qui peut collecter des cookies anonymes.</p>
        `,
        article: `
            <h2>Diagnostics Clavier et Souris: Latence des Touches et NKRO Expliqués</h2>
            <p>Bienvenue sur <strong>KeyPulse</strong>, l'outil idéal pour tester vos périphériques d'entrée. Que vous disposiez d'un Apple MacBook, Dell XPS, HP Spectre, Lenovo ThinkPad, Asus ROG, Acer Predator ou MSI, notre testeur vérifie le bon fonctionnement de chaque touche sans latence externe.</p>
            
            <h3>1. Comment Tester Votre Clavier</h3>
            <p>Appuyez sur n'importe quelle touche physique. La touche virtuelle à l'écran s'illumine instantanément. Appuyer sur plusieurs touches à la fois permet de vérifier les limites de votre matériel. Si une touche ne s'active pas, elle peut être endommagée.</p>
            
            <h3>2. Comprendre la Latence (Temps de Réponse)</h3>
            <p>La latence est la durée mesurée entre l'appui (keydown) et le relâchement (keyup). Sur les machines de jeu (Asus ROG, MSI, Acer Predator), une latence ultra-faible (sous la milliseconde) est primordiale pour garantir la rapidité de vos actions en jeu.</p>
            
            <h3>3. Qu'est-ce que le N-Key Rollover (NKRO) ?</h3>
            <p>Le N-Key Rollover (NKRO) est la capacité d'un clavier à enregistrer plusieurs touches enfoncées simultanément. Les ordinateurs portables Apple, Dell ou HP limitent souvent ce nombre à 2 ou 6 touches, créant du "ghosting". Les claviers mécaniques haut de gamme gèrent le NKRO complet.</p>
            
            <h3>4. Diagnostics Intégrés de la Souris</h3>
            <p>Utilisez la console dédiée pour vérifier le clic gauche, droit ou le bouton central de la roulette. Le testeur suit les coordonnées X/Y en temps réel et calcule l'intervalle du double-clic en millisecondes pour repérer les anomalies de clic.</p>
        `
    },
    pt: {
        tagline: "Console de Diagnóstico Inteligente",
        statActive: "Teclas Ativas",
        statNKRO: "Rollover Máx",
        statLatency: "Latência da Tecla",
        statTested: "Teclas Testadas",
        lblLayout: "Layout do Teclado",
        lblOS: "Mapeamento do SO",
        lblSound: "Simulador de Áudio",
        lblTheme: "Tema da Interface",
        lblLang: "Select Language / Idioma",
        btnReset: "Reiniciar Painel",
        btnExport: "Exportar CSV",
        btnClear: "Limpar Registro",
        mouseTitle: "Diagnóstico do Mouse",
        mouseCoords: "Coordenadas:",
        mouseClicks: "Cliques:",
        mouseDouble: "Clique Duplo:",
        registryTitle: "Registro de Teclas Ativas",
        regKey: "Tecla (Char)",
        regCode: "Código",
        regKeycode: "KeyCode (e.which)",
        regLocation: "Localização",
        historyTitle: "Registro de Eventos",
        historyHeaders: ["Hora", "Tecla", "Código DOM", "Localização", "Evento", "Duração"],
        emptyLog: "Nenhuma tecla testada ainda. Pressione qualquer tecla para começar os diagnósticos.",
        footerDesc: "KeyPulse &bull; Testador de Hardware Premium &bull; Desenvolvido por ",
        footerAbout: "Sobre Nós",
        footerPrivacy: "Política de Privacidade",
        footerContact: "Contato",
        headerAbout: "Sobre Nós",
        headerPrivacy: "Privacidade",
        headerContact: "Contato",
        legend: ["Não Testado", "Pressionado", "Testado (Passou)", "Teclas combinadas (ex. Fn)"],
        loc0: "Padrão",
        loc1: "Esquerda",
        loc2: "Direita",
        loc3: "Teclado Numérico",
        locUnknown: "Desconhecido",
        modalAbout: `
            <div class="brand-heading">
                <h2>Sobre o KeyPulse</h2>
                <span>Console de Diagnóstico Inteligente</span>
            </div>
            <p>O <strong>KeyPulse</strong> é um testador web de alta performance para teclado e mouse, projetado para gamers, programadores e entusiastas.</p>
            <p>Desenvolvido em parceria com a <strong>IT Solutions Pro</strong>, uma marca focada em tutoriais e soluções de software.</p>
            <p>Inscreva-se no nosso canal do YouTube para nos apoiar:</p>
            <p style="text-align: center; margin-top: 20px;">
                <a href="https://www.youtube.com/@itsolutionspro" target="_blank" style="display: inline-block; padding: 12px 28px; background: #ff0000; color: #fff; border-radius: 6px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4); font-size: 15px;">
                    Inscrever-se no YouTube
                </a>
            </p>
        `,
        modalContact: `
            <div class="brand-heading">
                <h2>Contato</h2>
                <span>IT Solutions Pro</span>
            </div>
            <p>Para dúvidas ou feedback, nos contate no canal oficial do YouTube.</p>
            <ul>
                <li><strong>Canal Oficial:</strong> <a href="https://www.youtube.com/@itsolutionspro" target="_blank">Canal IT Solutions Pro</a></li>
            </ul>
        `,
        modalPrivacy: `
            <div class="brand-heading">
                <h2>Política de Privacidade</h2>
                <span>KeyPulse & IT Solutions Pro</span>
            </div>
            <p>O KeyPulse opera localmente no navegador. Nenhuma informação é transmitida ou salva em nossos servidores.</p>
            <p>Para monetização, usamos a rede Monetag, que pode ler cookies anônimos para exibir anúncios segmentados.</p>
        `,
        article: `
            <h2>Diagnóstico Definitivo de Teclado e Mouse: Latência de Teclas e NKRO Explicados</h2>
            <p>Bem-vindo ao <strong>KeyPulse</strong>, a ferramenta definitiva para diagnosticar seus periféricos. Seja em um Apple MacBook, Dell XPS, HP Spectre, Lenovo ThinkPad, Asus ROG, Acer Predator ou MSI, nosso testador garante que cada tecla funcione perfeitamente, sem latência externa.</p>
            
            <h3>1. Como Testar Seu Teclado</h3>
            <p>Basta pressionar qualquer tecla física. A tecla virtual correspondente na tela acenderá imediatamente. Pressionar várias teclas simultaneamente permite verificar os limites do seu hardware. Se uma tecla não acender, pode haver falhas físicas no contato.</p>
            
            <h3>2. Latência da Tecla (Tempo de Resposta)</h3>
            <p>A latência mede o tempo decorrido entre o pressionar (keydown) e o soltar (keyup) de uma tecla. Em notebooks de alta performance (Asus ROG, MSI, Acer Predator), latências inferiores a um milissegundo dão vantagem competitiva crucial em jogos.</p>
            
            <h3>3. O que é N-Key Rollover (NKRO)?</h3>
            <p>O N-Key Rollover (NKRO) é a capacidade de um teclado registrar múltiplas teclas pressionadas ao mesmo tempo. Laptops da Apple, Dell ou HP suportam apenas o rollover de 2 ou 6 teclas, causando "ghosting" (teclas ignoradas). Já os teclados mecânicos premium oferecem NKRO completo.</p>
            
            <h3>4. Diagnóstico Integrado do Mouse</h3>
            <p>Use a interface de diagnóstico de mouse para testar clique esquerdo, direito e botão de rolagem. O testador exibe as coordenadas do ponteiro em tempo real e calcula a velocidade de clique duplo em milissegundos para detectar falhas de cliques.</p>
        `
    }
};

// Global state variables
let activeKeys = new Map();
let testedKeys = new Set();
let historyLog = [];
let maxNKRO = 0;
let currentOS = 'win';
let currentSound = 'red';
let currentLang = 'en';

// DOM Element cache
const virtualKeyboardEl = document.getElementById('virtual-keyboard');
const selectLayout = document.getElementById('layout-select');
const selectOS = document.getElementById('os-select');
const selectSound = document.getElementById('sound-select');
const selectTheme = document.getElementById('theme-select');
const selectLang = document.getElementById('lang-select');
const btnReset = document.getElementById('btn-reset');
const btnExport = document.getElementById('btn-export');
const btnClearLog = document.getElementById('btn-clear-log');

// Stat box values
const valActiveKeys = document.querySelector('#stat-active-keys .stat-value');
const valNKRO = document.querySelector('#stat-nkro .stat-value');
const valLastLatency = document.querySelector('#stat-last-latency .stat-value');
const valTotalTested = document.querySelector('#stat-total-tested .stat-value');

// Registry labels
const regKey = document.getElementById('event-val-key');
const regCode = document.getElementById('event-val-code');
const regKeyCode = document.getElementById('event-val-keycode');
const regLocation = document.getElementById('event-val-location');

// Mouse stats elements
const mouseBtnLeft = document.getElementById('mouse-btn-left');
const mouseBtnRight = document.getElementById('mouse-btn-right');
const mouseBtnMiddle = document.getElementById('mouse-btn-middle');
const scrollUpArrow = document.getElementById('scroll-up-arrow');
const scrollDownArrow = document.getElementById('scroll-down-arrow');
const mouseCoords = document.getElementById('mouse-coords');
const mouseClickCountText = document.getElementById('mouse-click-count');
const mouseDoubleClickText = document.getElementById('mouse-double-click');

// Mouse Click State Counters
let clicksLeft = 0;
let clicksRight = 0;
let clicksMiddle = 0;
let lastLeftClickTime = 0;

// Initialize layout rendering
function renderKeyboard(layoutId) {
    const layout = layouts[layoutId] || layouts['layout-80'];
    virtualKeyboardEl.innerHTML = '';
    
    layout.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'keyboard-row';
        
        row.forEach(item => {
            if (item.spacer) {
                const spacerEl = document.createElement('div');
                spacerEl.className = 'key-spacer';
                const w = item.spacer;
                if (w >= 1) {
                    spacerEl.style.width = `calc(var(--key-size, 48px) * ${w} + ${(w - 1) * 6}px)`;
                } else {
                    spacerEl.style.width = `calc(var(--key-size, 48px) * ${w})`;
                }
                if (item.invisible) {
                    spacerEl.style.visibility = 'hidden';
                }
                rowEl.appendChild(spacerEl);
            } else {
                const keyEl = document.createElement('div');
                keyEl.className = 'key';
                keyEl.setAttribute('data-code', item.code);
                
                if (item.class) {
                    keyEl.classList.add(item.class);
                }
                
                const w = item.width || 1;
                keyEl.style.width = `calc(var(--key-size, 48px) * ${w} + ${w - 1} * 6px)`;
                
                let label = (currentOS === 'mac' && item.macLabel) ? item.macLabel : item.label;
                
                if (item.subLabel) {
                    const topLabel = document.createElement('span');
                    topLabel.className = 'label-top';
                    topLabel.textContent = item.label;
                    
                    const mainLabel = document.createElement('span');
                    mainLabel.className = 'label-main';
                    mainLabel.textContent = item.subLabel;
                    
                    keyEl.appendChild(topLabel);
                    keyEl.appendChild(mainLabel);
                } else {
                    keyEl.classList.add('key-center');
                    const mainLabel = document.createElement('span');
                    mainLabel.className = 'label-main';
                    mainLabel.textContent = label;
                    keyEl.appendChild(mainLabel);
                }

                if (testedKeys.has(item.code)) {
                    keyEl.classList.add('tested');
                }
                if (activeKeys.has(item.code)) {
                    keyEl.classList.add('pressing');
                }
                
                rowEl.appendChild(keyEl);
            }
        });
        
        virtualKeyboardEl.appendChild(rowEl);
    });
    
    scaleKeyboard();
}

function scaleKeyboard() {
    const parent = virtualKeyboardEl.parentElement;
    const parentWidth = parent.clientWidth - 48;
    const kbdWidth = virtualKeyboardEl.scrollWidth;
    
    if (kbdWidth > parentWidth) {
        const ratio = parentWidth / kbdWidth;
        const newSize = Math.max(30, Math.floor(48 * ratio));
        virtualKeyboardEl.style.setProperty('--key-size', `${newSize}px`);
    } else {
        const testContainerWidth = parent.clientWidth - 48;
        if (testContainerWidth > 900) {
            virtualKeyboardEl.style.setProperty('--key-size', '48px');
        } else {
            virtualKeyboardEl.style.setProperty('--key-size', '40px');
        }
    }
}

function locationLabel(locCode) {
    const t = translations[currentLang] || translations['en'];
    switch (locCode) {
        case 0: return t.loc0;
        case 1: return t.loc1;
        case 2: return t.loc2;
        case 3: return t.loc3;
        default: return t.locUnknown;
    }
}

function formatTime(timestamp) {
    const d = new Date(timestamp);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;
}

function handleKeyDown(e) {
    e.preventDefault();
    const code = e.code;
    const key = e.key;
    const keyCode = e.which || e.keyCode;
    const location = e.location;
    
    if (e.repeat) return;
    
    if (currentSound !== 'mute') {
        audioSynth.play(currentSound);
    }
    
    const now = performance.now();
    activeKeys.set(code, {
        timestamp: now,
        key: key,
        keyCode: keyCode,
        location: location
    });
    
    const activeCount = activeKeys.size;
    valActiveKeys.textContent = activeCount;
    if (activeCount > maxNKRO) {
        maxNKRO = activeCount;
        valNKRO.textContent = maxNKRO;
    }
    
    const keyEl = virtualKeyboardEl.querySelector(`.key[data-code="${code}"]`);
    if (keyEl) {
        keyEl.classList.add('pressing');
    }
    
    regKey.textContent = key === " " ? "Space" : key;
    regCode.textContent = code;
    regKeyCode.textContent = keyCode;
    regLocation.textContent = locationLabel(location);
}

function handleKeyUp(e) {
    e.preventDefault();
    const code = e.code;
    const now = performance.now();
    
    if (activeKeys.has(code)) {
        const keyData = activeKeys.get(code);
        const duration = Math.round(now - keyData.timestamp);
        
        activeKeys.delete(code);
        testedKeys.add(code);
        
        valActiveKeys.textContent = activeKeys.size;
        valTotalTested.textContent = testedKeys.size;
        valLastLatency.innerHTML = `${duration}<span class="unit">ms</span>`;
        
        const keyEl = virtualKeyboardEl.querySelector(`.key[data-code="${code}"]`);
        if (keyEl) {
            keyEl.classList.remove('pressing');
            keyEl.classList.add('tested');
        }
        
        logEvent(Date.now(), keyData.key, code, locationLabel(keyData.location), "Keyup", duration);
    }
}

function logEvent(timestamp, key, code, location, type, duration) {
    const formattedKey = key === " " ? "Space" : key;
    const formattedTime = formatTime(timestamp);
    
    const newRecord = {
        time: formattedTime,
        key: formattedKey,
        code: code,
        location: location,
        type: type,
        duration: duration !== null ? `${duration} ms` : '--'
    };
    
    historyLog.unshift(newRecord);
    
    const tbody = document.getElementById('history-log-body');
    const placeholder = tbody.querySelector('.empty-row-placeholder');
    if (placeholder) {
        tbody.innerHTML = '';
    }
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="font-mono text-secondary">${newRecord.time}</td>
        <td><strong>${newRecord.key}</strong></td>
        <td class="font-mono">${newRecord.code}</td>
        <td><span class="badge">${newRecord.location}</span></td>
        <td>${newRecord.type}</td>
        <td class="font-mono">${newRecord.duration}</td>
    `;
    
    tbody.insertBefore(tr, tbody.firstChild);
    
    if (tbody.children.length > 100) {
        tbody.removeChild(tbody.lastChild);
    }
}

function initMouseTester() {
    const mouseTesterArea = document.querySelector('.mouse-tester-card');
    
    mouseTesterArea.addEventListener('mousemove', (e) => {
        const rect = mouseTesterArea.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        mouseCoords.textContent = `X: ${x}, Y: ${y}`;
    });
    
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    mouseTesterArea.addEventListener('mousedown', (e) => {
        e.preventDefault();
        
        if (e.button === 0) {
            mouseBtnLeft.classList.add('active');
            clicksLeft++;
            
            const now = performance.now();
            const doubleClickSpeed = now - lastLeftClickTime;
            if (doubleClickSpeed < 300 && lastLeftClickTime !== 0) {
                mouseDoubleClickText.textContent = `${Math.round(doubleClickSpeed)} ms`;
            }
            lastLeftClickTime = now;
        } else if (e.button === 2) {
            mouseBtnRight.classList.add('active');
            clicksRight++;
        } else if (e.button === 1) {
            mouseBtnMiddle.classList.add('active');
            clicksMiddle++;
        }
        
        mouseClickCountText.textContent = `L: ${clicksLeft} | R: ${clicksRight} | M: ${clicksMiddle}`;
    });
    
    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            mouseBtnLeft.classList.remove('active');
        } else if (e.button === 2) {
            mouseBtnRight.classList.remove('active');
        } else if (e.button === 1) {
            mouseBtnMiddle.classList.remove('active');
        }
    });
    
    mouseTesterArea.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            scrollUpArrow.classList.add('active');
            setTimeout(() => scrollUpArrow.classList.remove('active'), 150);
        } else if (e.deltaY > 0) {
            scrollDownArrow.classList.add('active');
            setTimeout(() => scrollDownArrow.classList.remove('active'), 150);
        }
    });
}

function resetTester() {
    activeKeys.clear();
    testedKeys.clear();
    maxNKRO = 0;
    
    valActiveKeys.textContent = '0';
    valNKRO.textContent = '0';
    valLastLatency.innerHTML = '0<span class="unit">ms</span>';
    valTotalTested.textContent = '0';
    
    regKey.textContent = '--';
    regCode.textContent = '--';
    regKeyCode.textContent = '--';
    regLocation.textContent = '--';
    
    clicksLeft = 0;
    clicksRight = 0;
    clicksMiddle = 0;
    lastLeftClickTime = 0;
    mouseClickCountText.textContent = 'L: 0 | R: 0 | M: 0';
    mouseDoubleClickText.textContent = '--';
    
    const keys = virtualKeyboardEl.querySelectorAll('.key');
    keys.forEach(k => {
        k.classList.remove('pressing', 'tested');
    });
}

function clearLog() {
    historyLog = [];
    const t = translations[currentLang] || translations['en'];
    const tbody = document.getElementById('history-log-body');
    tbody.innerHTML = `
        <tr class="empty-row-placeholder">
            <td colspan="6">${t.emptyLog}</td>
        </tr>
    `;
}

function exportCSV() {
    const t = translations[currentLang] || translations['en'];
    if (historyLog.length === 0) {
        alert(t.emptyLog);
        return;
    }
    
    let csv = `${t.historyHeaders.join(",")}\n`;
    historyLog.forEach(row => {
        csv += `"${row.time}","${row.key}","${row.code}","${row.location}","${row.type}","${row.duration}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `keypulse_log_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Translate UI elements dynamically based on language selection
function applyLanguageTranslations(lang) {
    currentLang = lang;
    const t = translations[lang] || translations['en'];
    
    // Header
    document.getElementById('logo-tagline').textContent = t.tagline;
    
    // Stats
    document.querySelector('#stat-active-keys .stat-label').textContent = t.statActive;
    document.querySelector('#stat-nkro .stat-label').textContent = t.statNKRO;
    document.querySelector('#stat-last-latency .stat-label').textContent = t.statLatency;
    document.querySelector('#stat-total-tested .stat-label').textContent = t.statTested;
    
    // Controls Labels
    document.getElementById('lbl-layout').textContent = t.lblLayout;
    document.getElementById('lbl-os').textContent = t.lblOS;
    document.getElementById('lbl-sound').textContent = t.lblSound;
    document.getElementById('lbl-theme').textContent = t.lblTheme;
    document.getElementById('lbl-lang').textContent = t.lblLang;
    
    // Buttons
    document.getElementById('btn-reset-text').textContent = t.btnReset;
    document.getElementById('btn-export-text').textContent = t.btnExport;
    document.getElementById('btn-clear-log').textContent = t.btnClear;
    
    // Legend
    const legendBlock = document.getElementById('keyboard-legend-block');
    legendBlock.innerHTML = `
        <span class="legend-item"><span class="legend-color color-untested"></span> ${t.legend[0]}</span>
        <span class="legend-item"><span class="legend-color color-pressing"></span> ${t.legend[1]}</span>
        <span class="legend-item"><span class="legend-color color-tested"></span> ${t.legend[2]}</span>
        <span class="legend-item"><span class="legend-color color-special"></span> ${t.legend[3]}</span>
    `;
    
    // Mouse Card
    document.getElementById('mouse-tester-title').textContent = t.mouseTitle;
    document.getElementById('lbl-mouse-coords').textContent = t.mouseCoords;
    document.getElementById('lbl-mouse-clicks').textContent = t.mouseClicks;
    document.getElementById('lbl-mouse-double').textContent = t.mouseDouble;
    
    // Key Registry Card
    document.getElementById('key-registry-title').textContent = t.registryTitle;
    document.getElementById('lbl-reg-key').textContent = t.regKey;
    document.getElementById('lbl-reg-code').textContent = t.regCode;
    document.getElementById('lbl-reg-keycode').textContent = t.regKeycode;
    document.getElementById('lbl-reg-location').textContent = t.regLocation;
    
    // History Table
    document.getElementById('history-section-title').textContent = t.historyTitle;
    
    const headersRow = document.getElementById('history-table-headers');
    headersRow.innerHTML = '';
    t.historyHeaders.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        headersRow.appendChild(th);
    });
    
    const tbody = document.getElementById('history-log-body');
    const placeholder = tbody.querySelector('.empty-row-placeholder');
    if (placeholder) {
        tbody.innerHTML = `
            <tr class="empty-row-placeholder">
                <td colspan="6">${t.emptyLog}</td>
            </tr>
        `;
    }
    
    // Footer Links
    document.getElementById('link-about').textContent = t.footerAbout;
    document.getElementById('link-privacy').textContent = t.footerPrivacy;
    document.getElementById('link-contact').textContent = t.footerContact;
    
    document.getElementById('link-about-header').textContent = t.headerAbout;
    document.getElementById('link-privacy-header').textContent = t.headerPrivacy;
    document.getElementById('link-contact-header').textContent = t.headerContact;
    
    // Footer Brand Link preserving HTML
    document.getElementById('footer-desc').innerHTML = `${t.footerDesc} <a href="https://www.youtube.com/@itsolutionspro" target="_blank" class="footer-brand-link">IT Solutions Pro</a> &bull; Zero-latency diagnostics.`;
    
    // SEO Article
    document.getElementById('seo-article').innerHTML = t.article;
}

// Setup Event Listeners on UI controls
function setupControlListeners() {
    selectLayout.addEventListener('change', (e) => {
        renderKeyboard(e.target.value);
        window.focus();
    });
    
    selectOS.addEventListener('change', (e) => {
        currentOS = e.target.value;
        renderKeyboard(selectLayout.value);
        window.focus();
    });
    
    selectSound.addEventListener('change', (e) => {
        currentSound = e.target.value;
        audioSynth.init();
        window.focus();
    });
    
    selectTheme.addEventListener('change', (e) => {
        document.body.className = '';
        document.body.classList.add(e.target.value);
        window.focus();
    });
    
    // Language select listener
    selectLang.addEventListener('change', (e) => {
        applyLanguageTranslations(e.target.value);
        window.focus();
    });
    
    btnReset.addEventListener('click', () => {
        resetTester();
        window.focus();
    });
    
    btnClearLog.addEventListener('click', () => {
        clearLog();
        window.focus();
    });
    
    btnExport.addEventListener('click', () => {
        exportCSV();
        window.focus();
    });
    
    window.addEventListener('resize', scaleKeyboard);
    
    window.addEventListener('click', () => {
        audioSynth.init();
    }, { once: true });
}

// Initialize Modal Windows for About, Contact, and Privacy
function initModalDiagnostics() {
    const modalContainer = document.getElementById('modal-container');
    const modalClose = document.getElementById('modal-close');
    const modalContentArea = document.getElementById('modal-content-area');
    
    const linkAbout = document.getElementById('link-about');
    const linkPrivacy = document.getElementById('link-privacy');
    const linkContact = document.getElementById('link-contact');
    
    const linkAboutHeader = document.getElementById('link-about-header');
    const linkPrivacyHeader = document.getElementById('link-privacy-header');
    const linkContactHeader = document.getElementById('link-contact-header');
    
    function openModal(type) {
        const t = translations[currentLang] || translations['en'];
        if (type === 'about') {
            modalContentArea.innerHTML = t.modalAbout;
        } else if (type === 'contact') {
            modalContentArea.innerHTML = t.modalContact;
        } else if (type === 'privacy') {
            modalContentArea.innerHTML = t.modalPrivacy;
        }
        modalContainer.classList.add('active');
    }
    
    function closeModal() {
        modalContainer.classList.remove('active');
        window.focus();
    }
    
    linkAbout.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('about');
    });
    if (linkAboutHeader) {
        linkAboutHeader.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('about');
        });
    }
    
    linkPrivacy.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('privacy');
    });
    if (linkPrivacyHeader) {
        linkPrivacyHeader.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('privacy');
        });
    }
    
    linkContact.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('contact');
    });
    if (linkContactHeader) {
        linkContactHeader.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('contact');
        });
    }
    
    modalClose.addEventListener('click', closeModal);
    
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
}

// Start listeners and render initial keyboard
window.addEventListener('DOMContentLoaded', () => {
    applyLanguageTranslations('en'); // Default to English
    renderKeyboard('layout-80');
    initMouseTester();
    setupControlListeners();
    initModalDiagnostics();
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
});
