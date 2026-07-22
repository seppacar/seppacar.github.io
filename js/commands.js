const Commands = (function () {
    let term = null;

    function init(terminalAPI) { term = terminalAPI; }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    const registry = {};

    registry['help'] = () => {
        term.addEmpty();
        term.addLine('<span class="bold accent">Available commands:</span>');
        term.addEmpty();
        const cmds = [
            ['about', 'About me'],
            ['stack', 'Tech stack & tools'],
            ['contact', 'Contact links'],
            ['experience', 'Work history'],
            ['education', 'Education'],
            ['', ''],
            ['cd <dir>', 'Change directory'],
            ['ls [-la]', 'List directory contents'],
            ['cat <file>', 'Read a file'],
            ['pwd', 'Print current directory'],
            ['', ''],
            ['neofetch', 'System & profile info'],
            ['history', 'Command history'],
            ['doom', 'Play DOOM (Canvas game)'],
            ['matrix', 'Matrix rain animation'],
            ['clear', 'Clear screen'],
        ];
        for (const [cmd, desc] of cmds) {
            if (!cmd) { term.addEmpty(); continue; }
            term.addLine(`  <span class="cyan">${cmd.padEnd(18)}</span> <span class="dim">${desc}</span>`);
        }
        term.addEmpty();
        term.addLine('<span class="dim">Use cd, ls, cat to navigate the virtual filesystem.</span>');
    };

    registry['about'] = () => {
        const result = FileSystem.cat('about.md');
        if (result.ok) {
            term.addEmpty();
            term.addLine('<span class="bold accent">$ cat ~/about.md</span>');
            term.addEmpty();
            for (const line of result.content) {
                if (line.startsWith('# ')) {
                    term.addLine(`<span class="glitch" data-text="${escapeHtml(line.slice(2))}">${escapeHtml(line.slice(2))}</span>`);
                } else {
                    term.addLine(escapeHtml(line));
                }
            }
        }
    };

    registry['stack'] = () => {
        const result = FileSystem.cat('.stack');
        if (result.ok) {
            term.addEmpty();
            term.addLine('<span class="bold accent">$ cat ~/.stack</span>');
            term.addEmpty();
            for (const line of result.content) {
                if (line.startsWith('# ')) {
                    term.addLine(`<span class="bold cyan">${escapeHtml(line.slice(2))}</span>`);
                } else if (line.includes(':')) {
                    const [key, ...rest] = line.split(':');
                    const val = rest.join(':').trim();
                    term.addLine(`  <span class="cyan">${escapeHtml(key.padEnd(14))}</span><span class="dim">:</span> ${escapeHtml(val)}`);
                } else {
                    term.addLine(escapeHtml(line));
                }
            }
        }
    };

    registry['skills'] = () => {
        term.addEmpty();
        term.addLine('<span class="dim">Try <span class="cyan">stack</span> instead.</span>');
    };

    registry['contact'] = () => {
        term.addEmpty();
        term.addLine('<span class="bold accent">$ cat ~/.contact</span>');
        term.addEmpty();
        term.addLine('  <span class="cyan">GitHub   </span> <a class="link" href="https://github.com/seppacar" target="_blank">github.com/seppacar</a>');
        term.addLine('  <span class="cyan">LinkedIn </span> <a class="link" href="https://www.linkedin.com/in/yusufacarr/" target="_blank">linkedin.com/in/yusufacarr</a>');
        term.addLine('  <span class="cyan">Email    </span> <a class="link" href="mailto:sepp.acar@gmail.com">sepp.acar@gmail.com</a>');
    };

    registry['experience'] = () => {
        term.addEmpty();
        term.addLine('<span class="bold accent">$ ls ~/experience/</span>');
        term.addEmpty();

        term.addLine('<span class="bold cyan">1. Jotform</span> <span class="dim">— Jul 2024 – Present | Ankara, Turkey</span>');
        term.addLine('   Junior Backend Developer <span class="dim">(Jul 2025 – Present | Full-time)</span>');
        term.addLine('   Backend Support Engineer <span class="dim">(Nov 2024 – Jul 2025 | Part-time)</span>');
        term.addLine('   Backend Engineer Intern <span class="dim">(Jun 2024 – Aug 2024)</span>');
        term.addEmpty();

        term.addLine('<span class="bold cyan">2. Alpata Yazılım ve Teknoloji</span> <span class="dim">— Aug 2023 – Oct 2023 | Eskisehir, Turkey</span>');
        term.addLine('   Software Development Intern');
        term.addEmpty();

        term.addLine('<span class="bold cyan">3. Saruhan Web Agency</span> <span class="dim">— Feb 2023 – Jun 2023 | Eskisehir, Turkey</span>');
        term.addLine('   Fullstack Software Developer');
        term.addEmpty();

        term.addLine('<span class="bold cyan">4. Upwork</span> <span class="dim">— Jan 2022 – Jan 2023 | Remote</span>');
        term.addLine('   Freelance Software Developer');
        term.addEmpty();

        term.addLine('<span class="dim">More details on </span><a class="link" href="https://www.linkedin.com/in/yusufacarr/" target="_blank">LinkedIn</a>');
    };

    registry['education'] = () => {
        term.addEmpty();
        term.addLine('<span class="bold accent">$ cat ~/education/bachelor.md</span>');
        term.addEmpty();
        term.addLine('<span class="bold cyan">Karabük University</span>');
        term.addLine('Bachelor of Science (B.Sc.) in Computer Engineering');
        term.addLine('<span class="dim">Jan 2020 – Jun 2025</span>');
    };

    registry['neofetch'] = () => {
        term.addEmpty();
        const info = [
            ['Name', 'Yusuf Acar'],
            ['Position', 'Junior Backend Developer @ Jotform'],
            ['Location', 'Ankara, Turkey'],
            ['Education', 'Karabük University (2020–2025)'],
            ['Languages', 'English, Turkish, Russian (basic)'],
            ['Shell', 'bash 5.1'],
            ['Host', 'x86_64 Linux'],
        ];

        const art = [
            '    ┌──────────┐',
            '    │  ┌─────┐ │',
            '    │  │ >.< │ │',
            '    │  └─────┘ │',
            '    └──────────┘',
            '    ┌──────────┐',
            '    │ ┃┃┃┃┃┃┃┃ │',
            '    └──────────┘',
        ];

        for (let i = 0; i < Math.max(art.length, info.length); i++) {
            const artPart = art[i] || '                  ';
            const infoPart = info[i]
                ? `<span class="cyan">${info[i][0].padEnd(12)}</span><span class="dim">:</span> ${info[i][1]}`
                : '';
            term.addLine(`<span class="accent">${artPart}</span>   ${infoPart}`);
        }

        term.addEmpty();
        let colors = '';
        const colorCodes = ['#ff4757','#ff6348','#ffd60a','#00ff9c','#00d4ff','#ff006e','#7c5cbf','#c9d1d9'];
        for (const c of colorCodes) {
            colors += `<span style="background:${c};color:${c};">███</span>`;
        }
        term.addLine('    ' + colors);
    };

    registry['whoami'] = () => { term.addEmpty(); term.addLine('<span class="accent">yusuf</span>'); };

    registry['cd'] = (args) => {
        const target = args[0] || '~';
        const result = FileSystem.cd(target);
        if (!result.ok) { term.addEmpty(); term.addLine(`<span class="red">${escapeHtml(result.error)}</span>`); }
        term.updatePromptPath();
    };

    registry['ls'] = (args) => {
        let flags = '';
        let target = null;
        for (const arg of args) {
            if (arg.startsWith('-')) flags += arg.slice(1);
            else target = arg;
        }
        const result = FileSystem.ls(target, flags);
        if (!result.ok) { term.addEmpty(); term.addLine(`<span class="red">${escapeHtml(result.error)}</span>`); return; }

        term.addEmpty();
        if (result.showLong) {
            for (const entry of result.entries) {
                const perm = entry.permissions || (entry.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--');
                const size = String(entry.size || 4096).padStart(6);
                const date = entry.modified || '2025-01-01';
                let nameHtml;
                if (entry.type === 'dir') nameHtml = `<span class="cyan bold">${escapeHtml(entry.name)}/</span>`;
                else if (entry.isHidden) nameHtml = `<span class="dim">${escapeHtml(entry.name)}</span>`;
                else nameHtml = escapeHtml(entry.name);
                term.addLine(`<span class="dim">${perm}  yusuf  ${size}  ${date}</span>  ${nameHtml}`);
            }
        } else {
            let line = '';
            for (const entry of result.entries) {
                if (entry.type === 'dir') line += `<span class="cyan bold">${escapeHtml(entry.name)}/</span>  `;
                else if (entry.isHidden) line += `<span class="dim">${escapeHtml(entry.name)}</span>  `;
                else line += `${escapeHtml(entry.name)}  `;
            }
            if (line) term.addLine(line);
        }
    };

    registry['cat'] = (args) => {
        if (!args.length) { term.addEmpty(); term.addLine('<span class="red">cat: missing operand</span>'); return; }
        const target = args.join(' ');
        const result = FileSystem.cat(target);
        if (!result.ok) {
            term.addEmpty();
            term.addLine(`<span class="red">${escapeHtml(result.error)}</span>`);
            if (target.includes('.secrets')) term.addLine('<span class="dim">Access restricted.</span>');
            else if (result.error.includes('No such file')) term.addLine('<span class="dim">Run "ls" to view directory listing.</span>');
            return;
        }
        term.addEmpty();
        for (const line of result.content) {
            if (line.startsWith('# ')) term.addLine(`<span class="bold accent">${escapeHtml(line)}</span>`);
            else if (line.startsWith('→ ')) {
                const url = line.slice(2).trim();
                term.addLine(`<span class="yellow">→</span> <a class="link" href="https://${escapeHtml(url)}" target="_blank">${escapeHtml(url)}</a>`);
            }
            else if (line.startsWith('- ')) term.addLine(`<span class="dim">  •</span> ${escapeHtml(line.slice(2))}`);
            else term.addLine(escapeHtml(line));
        }
    };

    registry['pwd'] = () => { term.addEmpty(); term.addLine(escapeHtml(FileSystem.pwd())); };

    registry['history'] = () => {
        term.addEmpty();
        const hist = term.getHistory();
        if (hist.length === 0) { term.addLine('<span class="dim">No history recorded.</span>'); return; }
        for (let i = hist.length - 1; i >= 0; i--) {
            term.addLine(`<span class="dim">${String(hist.length - i).padStart(4)}</span>  ${escapeHtml(hist[i])}`);
        }
    };

    registry['clear'] = () => { term.clear(); };

    registry['matrix'] = () => {
        term.addEmpty();
        term.addLine('<span class="accent">Initializing Matrix renderer...</span>');
        startMatrix(); setTimeout(stopMatrix, 6000);
    };

    registry['doom'] = () => {
        term.addEmpty();
        term.addLine('<span class="accent bold">Launching DOOM 2.5D canvas engine...</span>');
        term.addLine('<span class="dim">Press ESC or F10 to return to terminal.</span>');
        setTimeout(() => { if (typeof DoomGame !== 'undefined') DoomGame.start(); }, 300);
    };

    registry['sudo'] = () => { term.addEmpty(); term.addLine('<span class="red">yusuf is not in the sudoers file. This incident will be logged.</span>'); };
    registry['sudo rm -rf /'] = () => { term.addEmpty(); term.addLine('<span class="red bold">Permission denied.</span>'); };
    registry['rm'] = () => { term.addEmpty(); term.addLine('<span class="red">rm: read-only filesystem</span>'); };
    registry['mkdir'] = () => { term.addEmpty(); term.addLine('<span class="red">mkdir: read-only filesystem</span>'); };
    registry['touch'] = () => { term.addEmpty(); term.addLine('<span class="red">touch: read-only filesystem</span>'); };
    registry['vim'] = () => { term.addEmpty(); term.addLine('<span class="dim">Vim session locked in read-only mode. Use :q to return.</span>'); };
    registry['nano'] = () => { term.addEmpty(); term.addLine('<span class="dim">GNU nano: Read-only filesystem.</span>'); };
    registry['emacs'] = () => { term.addEmpty(); term.addLine('<span class="red">emacs: command not found</span>'); };

    registry['top'] = () => {
        term.addEmpty();
        term.addLine('<span class="bold accent">  PID  USER     CPU%  MEM%  COMMAND</span>');
        const procs = [
            ['   1', 'yusuf', ' 45.2', ' 30.0', 'node (backend-service)'],
            [' 142', 'yusuf', ' 22.1', ' 15.0', 'postgres (db-pool)'],
            [' 256', 'yusuf', ' 12.5', '  8.0', 'docker-daemon'],
            [' 512', 'yusuf', '  8.3', '  5.0', 'nginx (reverse-proxy)'],
            [' 777', 'yusuf', '  3.1', '  2.0', 'redis-server (cache)'],
            [' 999', 'root',  '  0.1', '  0.1', 'systemd'],
        ];
        for (const p of procs) {
            term.addLine(`<span class="dim">${p[0]}  ${p[1].padEnd(8)} ${p[2].padStart(5)}  ${p[3].padStart(5)}  </span>${p[4]}`);
        }
    };

    registry['uname'] = (args) => { term.addEmpty(); term.addLine(args.includes('-a') ? 'Linux earth 6.1.0-x86_64 #1 SMP PREEMPT_DYNAMIC GNU/Linux' : 'Linux'); };
    registry['ping'] = (args) => {
        term.addEmpty();
        const host = args[0] || 'google.com';
        term.addLine(`PING ${escapeHtml(host)} (127.0.0.1) 56(84) bytes of data.`);
        for (let i = 1; i <= 4; i++) {
            const ms = (Math.random() * 15 + 5).toFixed(1);
            term.addLine(`<span class="dim">64 bytes from ${escapeHtml(host)}: icmp_seq=${i} ttl=64 time=${ms} ms</span>`);
        }
        term.addEmpty();
        term.addLine(`<span class="dim">--- ${escapeHtml(host)} ping statistics ---</span>`);
        term.addLine('<span class="dim">4 packets transmitted, 4 received, 0% packet loss</span>');
    };
    registry['curl'] = () => { term.addEmpty(); term.addLine('<span class="dim">curl: (7) Failed to connect</span>'); };
    registry['wget'] = () => { term.addEmpty(); term.addLine('<span class="dim">wget: unable to resolve host</span>'); };
    registry['git'] = (args) => {
        term.addEmpty();
        if (args[0] === 'log') {
            const commits = [
                ['e7a3f2b', '10 hours ago', 'fix: resolve bug in survey eligibility check'],
                ['a1b2c3d', '2 days ago',   'feat: add NPS data analytics aggregation'],
                ['f00ba12', '1 week ago',   'refactor: clean up backend routing middleware'],
                ['deadbee', '2 weeks ago',  'chore: update dependencies'],
                ['c0ffee1', '1 month ago',  'feat: initial setup'],
            ];
            for (const [hash, date, msg] of commits) term.addLine(`<span class="yellow">${hash}</span> <span class="dim">(${date})</span> ${msg}`);
        } else if (args[0] === 'status') {
            term.addLine('On branch <span class="accent">main</span>');
            term.addLine('nothing to commit, working tree clean');
        } else term.addLine(`<span class="dim">git: '${args.join(' ')}' is not a git command.</span>`);
    };
    registry['man'] = (args) => {
        term.addEmpty();
        if (!args.length) { term.addLine('<span class="red">What manual page do you want?</span>'); return; }
        if (registry[args[0]]) term.addLine(`<span class="bold">${escapeHtml(args[0].toUpperCase())}(1)</span> — System reference for ${escapeHtml(args[0])}`);
        else term.addLine(`<span class="red">No manual entry for ${escapeHtml(args[0])}</span>`);
    };
    registry['date'] = () => { term.addEmpty(); term.addLine(new Date().toString()); };
    registry['echo'] = (args) => { term.addEmpty(); term.addLine(escapeHtml(args.join(' '))); };
    registry['exit'] = () => { term.addEmpty(); term.addLine('<span class="dim">Session active. Use terminal standard interactions.</span>'); };
    registry['grep'] = () => { term.addEmpty(); term.addLine('<span class="dim">grep: → </span><a class="link" href="https://github.com/seppacar" target="_blank">github.com/seppacar</a>'); };
    registry['docker'] = (args) => {
        term.addEmpty();
        if (args[0] === 'ps') { term.addLine('<span class="bold">CONTAINER ID   IMAGE              STATUS</span>'); term.addLine('<span class="dim">a1b2c3d4e5f6   backend:latest     Up 26 years</span>'); }
        else term.addLine('<span class="dim">Cannot connect to Docker daemon.</span>');
    };
    registry['hostname'] = () => { term.addEmpty(); term.addLine('earth'); };
    registry['uptime'] = () => { term.addEmpty(); term.addLine(' up 26 years, 1 user, load average: 0.15, 0.18, 0.12'); };
    registry['fortune'] = () => {
        const fortunes = ['"Talk is cheap. Show me the code." — Linus Torvalds', '"First, solve the problem. Then, write the code."', '"Deleted code is debugged code." — Jeff Sickel'];
        term.addEmpty(); term.addLine(`<span class="dim">${fortunes[Math.floor(Math.random() * fortunes.length)]}</span>`);
    };
    registry['cowsay'] = (args) => {
        term.addEmpty();
        const msg = args.length ? args.join(' ') : 'moo';
        const b = '-'.repeat(msg.length + 2);
        term.addLine(` ${b}`); term.addLine(`< ${escapeHtml(msg)} >`); term.addLine(` ${b}`);
        term.addLine('        \\   ^__^'); term.addLine('         \\  (oo)\\_______');
        term.addLine('            (__)\\       )\\/\\'); term.addLine('                ||----w |'); term.addLine('                ||     ||');
    };

    registry['htop'] = () => { registry['top'](); };
    registry['python'] = () => { term.addEmpty(); term.addLine('<span class="dim">Python 3.12.0</span>'); };
    registry['node'] = () => { term.addEmpty(); term.addLine('<span class="dim">Node.js v20.x</span>'); };
    registry['npm'] = () => { term.addEmpty(); term.addLine('<span class="dim">npm: 0 vulnerabilities</span>'); };

    let matrixInterval = null;
    function startMatrix() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        canvas.style.opacity = '0.4';
        const chars = '0123456789ABCDEF';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = new Array(columns).fill(1);
        function draw() {
            ctx.fillStyle = 'rgba(10, 14, 23, 0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff9c'; ctx.font = fontSize + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                ctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        matrixInterval = setInterval(draw, 50);
    }
    function stopMatrix() {
        if (matrixInterval) { clearInterval(matrixInterval); matrixInterval = null; }
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        canvas.style.opacity = '0';
        setTimeout(() => canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height), 500);
    }

    function execute(input) {
        const trimmed = input.trim();
        if (!trimmed) return;
        const lower = trimmed.toLowerCase();
        if (registry[lower]) { registry[lower]([]); return; }
        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        if (registry[cmd]) registry[cmd](args);
        else if (cmd === 'sudo') registry['sudo']();
        else { term.addEmpty(); term.addLine(`<span class="red">bash: ${escapeHtml(trimmed)}: command not found</span>`); term.addLine('<span class="dim">Type <span class="cyan">help</span> for available commands.</span>'); }
    }

    function getCommandNames() { return Object.keys(registry).filter(k => !k.includes(' ')); }

    return { init, execute, getCommandNames };
})();
