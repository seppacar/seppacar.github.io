const FileSystem = (function () {
    const FILE = 'file';
    const DIR = 'dir';

    const tree = {
        type: DIR,
        children: {
            home: {
                type: DIR,
                children: {
                    yusuf: {
                        type: DIR,
                        children: {
                            'about.md': {
                                type: FILE,
                                permissions: '-rw-r--r--',
                                size: 300,
                                modified: '2025-07-20',
                                content: [
                                    "# Yusuf Acar",
                                    "",
                                    "Junior Backend Developer at Jotform.",
                                    "B.Sc. in Computer Engineering — Karabük University (2025).",
                                    "",
                                    "Software engineer with a solid foundation in backend architecture, high-throughput systems, internal tooling, and ML integrations. Focused on building robust systems and solving complex technical challenges.",
                                    "",
                                    "Languages: English (Fluent), Turkish (Native), Russian (Basic).",
                                ]
                            },
                            '.contact': {
                                type: FILE,
                                permissions: '-rw-------',
                                size: 180,
                                modified: '2025-06-01',
                                content: [
                                    "# Contact",
                                    "",
                                    "GitHub    : https://github.com/seppacar",
                                    "LinkedIn  : https://linkedin.com/in/yusufacarr",
                                    "Email     : sepp.acar@gmail.com",
                                ]
                            },
                            '.bashrc': {
                                type: FILE,
                                permissions: '-rw-r--r--',
                                size: 120,
                                modified: '2024-12-20',
                                content: [
                                    "# ~/.bashrc",
                                    "",
                                    'export EDITOR="vim"',
                                    'export LANG="en_US.UTF-8"',
                                    'export PATH="$HOME/.local/bin:$PATH"',
                                ]
                            },
                            '.secrets': {
                                type: FILE,
                                permissions: '-rwx------',
                                size: 0,
                                modified: '???',
                                content: null
                            },
                            '.stack': {
                                type: FILE,
                                permissions: '-rw-r--r--',
                                size: 420,
                                modified: '2025-07-01',
                                content: [
                                    "# Stack",
                                    "",
                                    "Languages      : PHP, TypeScript, JavaScript, Python, Go, Rust, Java, C#",
                                    "Frameworks     : Laravel, Node.js, Express, NestJS, FastAPI, Spring Boot, .NET Core, React",
                                    "Databases      : PostgreSQL, Redis, MySQL, MSSQL, MongoDB, Oracle",
                                    "DevOps         : Docker, Kubernetes, AWS, GCP, Nginx, Jenkins, Linux",
                                    "AI & Web3      : LLM Integration, Gen AI Tooling, Web3, Smart Contracts, Data Scraping",
                                ]
                            },
                            'README.md': {
                                type: FILE,
                                permissions: '-rw-r--r--',
                                size: 210,
                                modified: '2025-07-20',
                                content: [
                                    "# Yusuf Acar — Terminal Portfolio",
                                    "",
                                    "Directories & files:",
                                    "  - about.md",
                                    "  - .stack",
                                    "  - .contact",
                                    "  - experience/",
                                    "  - education/",
                                    "",
                                    "Type 'help' to see available commands.",
                                ]
                            },
                            experience: {
                                type: DIR,
                                children: {
                                    'jotform.md': {
                                        type: FILE,
                                        permissions: '-rw-r--r--',
                                        size: 400,
                                        modified: '2025-07-20',
                                        content: [
                                            "# Jotform",
                                            "# Ankara, Turkey | Jul 2024 – Present",
                                            "",
                                            "Junior Backend Developer (Jul 2025 – Present)",
                                            "  - Backend development & API engineering.",
                                            "  - Internal tooling & ML integrations.",
                                            "  - Full-stack web development across APIs and UI.",
                                            "",
                                            "Backend Support Engineer (Nov 2024 – Jul 2025)",
                                            "Backend Engineer Intern (Jun 2024 – Aug 2024)",
                                            "",
                                            "→ jotform.com",
                                        ]
                                    },
                                    'alpata.md': {
                                        type: FILE,
                                        permissions: '-rw-r--r--',
                                        size: 300,
                                        modified: '2023-10-15',
                                        content: [
                                            "# Alpata Yazılım ve Teknoloji",
                                            "# Eskisehir, Turkey | Aug 2023 – Oct 2023",
                                            "",
                                            "Software Development Intern",
                                            "  - Built a full-stack meeting app using .NET Core and Angular.",
                                            "  - Designed REST API endpoints for meeting creation, users, and document handling.",
                                            "  - Dockerized the application and wrote unit/integration tests.",
                                        ]
                                    },
                                    'saruhan.md': {
                                        type: FILE,
                                        permissions: '-rw-r--r--',
                                        size: 290,
                                        modified: '2023-06-30',
                                        content: [
                                            "# Saruhan Web Agency",
                                            "# Eskisehir, Turkey | Feb 2023 – Jun 2023",
                                            "",
                                            "Fullstack Software Engineer",
                                            "  - Built websites and a B2B/B2C hotel transfer booking site.",
                                            "  - Handled online bookings, payment gateway integrations, and MySQL databases.",
                                        ]
                                    },
                                    'upwork.md': {
                                        type: FILE,
                                        permissions: '-rw-r--r--',
                                        size: 280,
                                        modified: '2023-01-15',
                                        content: [
                                            "# Upwork",
                                            "# Remote | Jan 2022 – Jan 2023",
                                            "",
                                            "Freelance Software Engineer",
                                            "  - Built custom web applications, Web3 integrations, smart contracts, and backend APIs.",
                                            "  - Developed automated data scraping pipelines and web crawlers.",
                                        ]
                                    },
                                }
                            },
                            education: {
                                type: DIR,
                                children: {
                                    'bachelor.md': {
                                        type: FILE,
                                        permissions: '-rw-r--r--',
                                        size: 200,
                                        modified: '2025-06-15',
                                        content: [
                                            "# Karabük University",
                                            "# Jan 2020 – Jun 2025",
                                            "",
                                            "Bachelor of Science (B.Sc.) in Computer Engineering",
                                        ]
                                    },
                                }
                            },
                        }
                    }
                }
            },
            etc: {
                type: DIR,
                children: {
                    'hostname': {
                        type: FILE,
                        permissions: '-r--r--r--',
                        size: 6,
                        modified: '2025-01-01',
                        content: ['earth']
                    },
                }
            },
            tmp: {
                type: DIR,
                children: {}
            },
        }
    };

    let cwd = '/home/yusuf';
    const HOME = '/home/yusuf';

    function normalizePath(path) {
        path = path.replace(/^~/, HOME);
        if (!path.startsWith('/')) {
            path = cwd + '/' + path;
        }
        const parts = path.split('/').filter(Boolean);
        const resolved = [];
        for (const part of parts) {
            if (part === '.') continue;
            if (part === '..') { resolved.pop(); continue; }
            resolved.push(part);
        }
        return '/' + resolved.join('/');
    }

    function getNode(path) {
        path = normalizePath(path);
        if (path === '/') return tree;
        const parts = path.split('/').filter(Boolean);
        let node = tree;
        for (const part of parts) {
            if (!node || node.type !== DIR || !node.children[part]) return null;
            node = node.children[part];
        }
        return node;
    }

    function getCwd() { return cwd; }

    function getDisplayCwd() {
        if (cwd === HOME) return '~';
        if (cwd.startsWith(HOME + '/')) return '~' + cwd.slice(HOME.length);
        return cwd;
    }

    function cd(target) {
        if (!target || target === '~') { cwd = HOME; return { ok: true }; }
        const resolved = normalizePath(target);
        const node = getNode(resolved);
        if (!node) return { ok: false, error: `cd: ${target}: No such file or directory` };
        if (node.type !== DIR) return { ok: false, error: `cd: ${target}: Not a directory` };
        cwd = resolved;
        return { ok: true };
    }

    function ls(target, flags) {
        const path = target ? normalizePath(target) : cwd;
        const node = getNode(path);
        if (!node) return { ok: false, error: `ls: cannot access '${target || '.'}': No such file or directory` };
        if (node.type === FILE) return { ok: true, entries: [{ name: target, type: FILE }] };

        const showAll = flags && flags.includes('a');
        const showLong = flags && flags.includes('l');
        let entries = [];

        if (showAll) {
            entries.push({ name: '.', type: DIR, permissions: 'drwxr-xr-x', size: 4096, modified: '2025-07-20' });
            entries.push({ name: '..', type: DIR, permissions: 'drwxr-xr-x', size: 4096, modified: '2025-07-20' });
        }

        for (const [name, child] of Object.entries(node.children)) {
            const isHidden = name.startsWith('.');
            if (isHidden && !showAll) continue;
            entries.push({
                name, type: child.type,
                permissions: child.type === DIR ? 'drwxr-xr-x' : (child.permissions || '-rw-r--r--'),
                size: child.type === DIR ? 4096 : (child.size || 0),
                modified: child.modified || '2025-01-01',
                isHidden,
            });
        }

        entries.sort((a, b) => {
            if (a.name === '.' || a.name === '..') return -1;
            if (b.name === '.' || b.name === '..') return 1;
            if (a.type !== b.type) return a.type === DIR ? -1 : 1;
            if (a.modified && b.modified && a.modified !== b.modified) {
                return b.modified.localeCompare(a.modified);
            }
            return a.name.localeCompare(b.name);
        });

        return { ok: true, entries, showLong };
    }

    function cat(target) {
        if (!target) return { ok: false, error: 'cat: missing operand' };
        const path = normalizePath(target);
        const node = getNode(path);
        if (!node) return { ok: false, error: `cat: ${target}: No such file or directory` };
        if (node.type === DIR) return { ok: false, error: `cat: ${target}: Is a directory` };
        if (node.content === null) return { ok: false, error: `cat: ${target}: Permission denied` };
        return { ok: true, content: node.content };
    }

    function pwd() { return cwd; }

    function completePath(partial) {
        if (!partial) {
            const result = ls(null, 'a');
            if (!result.ok) return [];
            return result.entries.filter(e => e.name !== '.' && e.name !== '..').map(e => e.name + (e.type === DIR ? '/' : ''));
        }
        let dirPart, namePart;
        const lastSlash = partial.lastIndexOf('/');
        if (lastSlash >= 0) { dirPart = partial.substring(0, lastSlash) || '/'; namePart = partial.substring(lastSlash + 1); }
        else { dirPart = cwd; namePart = partial; }

        const resolved = normalizePath(dirPart);
        const node = getNode(resolved);
        if (!node || node.type !== DIR) return [];

        const matches = [];
        for (const [name, child] of Object.entries(node.children)) {
            if (name.startsWith(namePart)) {
                const prefix = lastSlash >= 0 ? partial.substring(0, lastSlash + 1) : '';
                matches.push(prefix + name + (child.type === DIR ? '/' : ''));
            }
        }
        return matches;
    }

    return { getCwd, getDisplayCwd, cd, ls, cat, pwd, completePath, normalizePath, HOME };
})();
