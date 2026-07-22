const Terminal = (function () {
    let terminalEl, inputLine, cmdInput, promptPathEl, promptPathInputEl;
    const commandHistory = [];
    let historyIndex = -1;

    function scrollToBottom() {
        terminalEl.scrollTop = terminalEl.scrollHeight;
    }

    function addLine(html, className) {
        const div = document.createElement('div');
        div.className = 'line' + (className ? ' ' + className : '');
        div.innerHTML = html;
        terminalEl.appendChild(div);
        scrollToBottom();
        return div;
    }

    function addEmpty() {
        addLine('&nbsp;');
    }

    function clear() {
        terminalEl.innerHTML = '';
    }

    function getHistory() {
        return commandHistory;
    }

    function updatePromptPath() {
        const displayPath = FileSystem.getDisplayCwd();
        if (promptPathEl) promptPathEl.textContent = displayPath;
        if (promptPathInputEl) promptPathInputEl.textContent = displayPath;
    }

    const terminalAPI = {
        addLine,
        addEmpty,
        clear,
        getHistory,
        updatePromptPath,
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function promptHtml() {
        const displayPath = FileSystem.getDisplayCwd();
        return `<span class="prompt-symbol">❯</span> <span class="prompt-path">${escapeHtml(displayPath)}</span> <span class="prompt-arrow">$</span>`;
    }

    function handleCommand(input) {
        const trimmed = input.trim();
        if (!trimmed) return;

        commandHistory.unshift(trimmed);
        historyIndex = -1;

        addLine(`${promptHtml()} <span class="cmd-text">${escapeHtml(trimmed)}</span>`);
        Commands.execute(trimmed);
        addEmpty();
        scrollToBottom();
    }

    function tabComplete(inputValue) {
        const parts = inputValue.split(/\s+/);

        if (parts.length <= 1) {
            const partial = parts[0].toLowerCase();
            const cmdNames = Commands.getCommandNames();
            const matches = cmdNames.filter(c => c.startsWith(partial) && c !== partial);

            if (matches.length === 1) {
                return matches[0] + ' ';
            } else if (matches.length > 1) {
                addLine(`${promptHtml()} <span class="cmd-text">${escapeHtml(inputValue)}</span>`);
                addLine(matches.map(m => `<span class="cyan">${escapeHtml(m)}</span>`).join('  '));
                addEmpty();
                return null;
            }
        } else {
            const pathPartial = parts[parts.length - 1];
            const matches = FileSystem.completePath(pathPartial);

            if (matches.length === 1) {
                parts[parts.length - 1] = matches[0];
                return parts.join(' ');
            } else if (matches.length > 1) {
                addLine(`${promptHtml()} <span class="cmd-text">${escapeHtml(inputValue)}</span>`);
                addLine(matches.map(m => {
                    return m.endsWith('/')
                        ? `<span class="cyan bold">${escapeHtml(m)}</span>`
                        : escapeHtml(m);
                }).join('  '));
                addEmpty();

                let common = matches[0];
                for (let i = 1; i < matches.length; i++) {
                    while (!matches[i].startsWith(common)) {
                        common = common.slice(0, -1);
                    }
                }
                if (common.length > pathPartial.length) {
                    parts[parts.length - 1] = common;
                    return parts.join(' ');
                }
                return null;
            }
        }
        return null;
    }

    async function boot() {
        await sleep(300);

        const bootMsgs = [
            ['[<span class="accent">OK</span>] Loading system...', 50],
            ['[<span class="accent">OK</span>] Mounting filesystem...', 60],
            ['[<span class="accent">OK</span>] Starting services...', 40],
            ['[<span class="accent">OK</span>] Ready.', 30],
        ];

        for (const [msg, delay] of bootMsgs) {
            addLine(`<span class="dim">${msg}</span>`);
            await sleep(delay);
        }

        addEmpty();
        await sleep(150);

        addLine('<span class="glitch" data-text="Yusuf Acar">Yusuf Acar</span> — Junior Backend Developer @ Jotform');
        addLine('<span class="dim">Backend engineering, internal tooling, ML integrations.</span>');
        addEmpty();
        addLine('Type <span class="cyan bold">help</span> to view available system commands.');
        addLine('<span class="dim">Standard POSIX commands (<span class="cyan">ls</span>, <span class="cyan">cd</span>, <span class="cyan">cat</span>) are enabled.</span>');
        addEmpty();

        inputLine.style.display = 'flex';
        cmdInput.focus();
        updatePromptPath();
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function init() {
        terminalEl = document.getElementById('terminal');
        inputLine = document.getElementById('inputLine');
        cmdInput = document.getElementById('cmdInput');
        promptPathEl = document.getElementById('promptPath');
        promptPathInputEl = document.getElementById('promptPathInput');

        Commands.init(terminalAPI);

        cmdInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleCommand(cmdInput.value);
                cmdInput.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    cmdInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    cmdInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    cmdInput.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const result = tabComplete(cmdInput.value);
                if (result !== null) {
                    cmdInput.value = result;
                }
            } else if (e.key === 'l' && e.ctrlKey) {
                e.preventDefault();
                clear();
            } else if (e.key === 'c' && e.ctrlKey) {
                e.preventDefault();
                addLine(`${promptHtml()} <span class="cmd-text">${escapeHtml(cmdInput.value)}</span><span class="dim">^C</span>`);
                cmdInput.value = '';
            }
        });

        document.querySelector('.terminal-window').addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return;
            cmdInput.focus();
        });

        function updateClock() {
            const d = new Date();
            const t = d.toLocaleTimeString('en-GB');
            const el = document.getElementById('statusTime');
            if (el) el.textContent = t;
        }
        setInterval(updateClock, 1000);
        updateClock();

        boot();
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', Terminal.init);
