/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
 */
(function(b) {
    b.hotkeys = {
        version: "0.8",
        specialKeys: {
            8: "backspace",
            9: "tab",
            13: "return",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "del",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scroll",
            191: "/",
            224: "meta"
        },
        shiftNums: {
            "`": "~",
            "1": "!",
            "2": "@",
            "3": "#",
            "4": "$",
            "5": "%",
            "6": "^",
            "7": "&",
            "8": "*",
            "9": "(",
            "0": ")",
            "-": "_",
            "=": "+",
            ";": ": ",
            "'": '"',
            ",": "<",
            ".": ">",
            "/": "?",
            "\\": "|"
        }
    };

    function a(d) {
        if (typeof d.data !== "string") {
            return
        }
        var c = d.handler,
            e = d.data.toLowerCase().split(" ");
        d.handler = function(n) {
            if (this !== n.target && (/textarea|select/i.test(n.target.nodeName) || n.target.type === "text")) {
                return
            }
            var h = n.type !== "keypress" && b.hotkeys.specialKeys[n.which],
                o = String.fromCharCode(n.which).toLowerCase(),
                k, m = "",
                g = {};
            if (n.altKey && h !== "alt") {
                m += "alt+"
            }
            if (n.ctrlKey && h !== "ctrl") {
                m += "ctrl+"
            }
            if (n.metaKey && !n.ctrlKey && h !== "meta") {
                m += "meta+"
            }
            if (n.shiftKey && h !== "shift") {
                m += "shift+"
            }
            if (h) {
                g[m + h] = true
            } else {
                g[m + o] = true;
                g[m + b.hotkeys.shiftNums[o]] = true;
                if (m === "shift+") {
                    g[b.hotkeys.shiftNums[o]] = true
                }
            }
            for (var j = 0, f = e.length; j < f; j++) {
                if (g[e[j]]) {
                    return c.apply(this, arguments)
                }
            }
        }
    }
    b.each(["keydown", "keyup", "keypress"], function() {
        b.event.special[this] = {
            add: a
        }
    })
})(jQuery);
/*
jQuery Browser Plugin
	* Version 2.3
	* 2008-09-17 19:27:05
	* URL: http://jquery.thewikies.com/browser
	* Description: jQuery Browser Plugin extends browser detection capabilities and can assign browser selectors to CSS classes.
	* Author: Nate Cavanaugh, Minhchau Dang, & Jonathan Neal
	* Copyright: Copyright (c) 2008 Jonathan Neal under dual MIT/GPL license.
*/


function ltrim(b) {
    if (b) {
        var a = /\s*((\S+\s*)*)/;
        return b.replace(a, "$1")
    }
    return ""
}

function rtrim(b) {
    if (b) {
        var a = /((\s*\S+)*)\s*/;
        return b.replace(a, "$1")
    }
    return ""
}

function trim(a) {
    if (a) {
        return ltrim(rtrim(a))
    }
    return ""
}


function entityEncode(a) {
    a = a.replace(/&/g, "&amp;");
    a = a.replace(/</g, "&lt;");
    a = a.replace(/>/g, "&gt;");
    a = a.replace(/  /g, " &nbsp;");
    if (/msie/i.test(navigator.userAgent)) {
        a = a.replace("\n", "&nbsp;<br />")
    } else {
        a = a.replace(/\x0D/g, "&nbsp;<br />")
    }
    return a
}
var TerminalShell = {
    commands: {
        help: function help(a) {
            a.print($("<h3>help</h3>"));
            cmd_list = $("<ul>");
            $.each(this.commands, function(b, c) {
                cmd_list.append($("<li>").text(b))
            });
            a.print(cmd_list)
        },
        clear: function(a) {
            a.clear()
        }
    },
    filters: [],
    fallback: null,
    lastCommand: null,
    process: function(a, b) {
        try {
            $.each(this.filters, $.proxy(function(e, g) {
                b = g.call(this, a, b)
            }, this));
            var f = b.split(" ");
            var d = f.shift();
            f.unshift(a);
            if (this.commands.hasOwnProperty(d)) {
                this.commands[d].apply(this, f)
            } else {
                if (!(this.fallback && this.fallback(a, b))) {
                    a.print('Unrecognized command. Type "help" for assistance.')
                }
            }
            this.lastCommand = b
        } catch (c) {
            a.print($("<p>").addClass("error").text("An internal error occured: " + c));
            a.setWorking(false)
        }
    }
};
var Terminal = {
    buffer: "",
    pos: 0,
    history: [],
    historyPos: 0,
    promptActive: true,
    cursorBlinkState: true,
    _cursorBlinkTimeout: null,
    spinnerIndex: 0,
    _spinnerTimeout: null,
    output: TerminalShell,
    config: {
        scrollStep: 20,
        scrollSpeed: 100,
        bg_color: "#000",
        fg_color: "#FFF",
        cursor_blink_time: 700,
        cursor_style: "block",
        prompt: "guest@iXcess.com:/$ ",
        spinnerCharacters: ["[   ]", "[.  ]", "[.. ]", "[...]"],
        spinnerSpeed: 250,
        typingSpeed: 25
    },
    sticky: {
        keys: {
            ctrl: false,
            alt: false,
            scroll: false
        },
        set: function(a, b) {
            this.keys[a] = b;
            $("#" + a + "-indicator").toggle(this.keys[a])
        },
        toggle: function(a) {
            this.set(a, !this.keys[a])
        },
        reset: function(a) {
            this.set(a, false)
        },
        resetAll: function(a) {
            $.each(this.keys, $.proxy(function(b, c) {
                this.reset(b)
            }, this))
        }
    },
    init: function() {
        function a(b) {
            return function() {
                if (Terminal.promptActive) {
                    b.apply(this, arguments)
                }
            }
        }
        $(document).keypress($.proxy(a(function(d) {
            if (d.which >= 32 && d.which <= 126) {
                var c = String.fromCharCode(d.which);
                var b = c.toLowerCase()
            } else {
                return
            }
            if ($.browser.opera && !(/[\w\s]/.test(c))) {
                return
            }
            if (this.sticky.keys.ctrl) {
                if (b == "w") {
                    this.deleteWord()
                } else {
                    if (b == "h") {
                        Terminal.deleteCharacter(false)
                    } else {
                        if (b == "l") {
                            this.clear()
                        } else {
                            if (b == "a") {
                                this.setPos(0)
                            } else {
                                if (b == "e") {
                                    this.setPos(this.buffer.length)
                                } else {
                                    if (b == "d") {
                                        this.runCommand("logout")
                                    } else {
                                        if (b == "b") {
                                            a(function(f) {
                                                Terminal.moveCursor(-1)
                                            })
                                        } else {
                                            if (b == "f") {
                                                a(function(f) {
                                                    Terminal.moveCursor(1)
                                                })
                                            } else {
                                                if (b == "p") {
                                                    Terminal.moveHistory(-1)
                                                } else {
                                                    if (b == "n") {
                                                        Terminal.moveHistory(1)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if (c) {
                    this.addCharacter(c);
                    d.preventDefault()
                }
            }
        }), this)).bind("keydown", "return", a(function(b) {
            Terminal.processInputBuffer()
        })).bind("keydown", "backspace", a(function(b) {
            b.preventDefault();
            Terminal.deleteCharacter(b.shiftKey)
        })).bind("keydown", "del", a(function(b) {
            Terminal.deleteCharacter(true)
        })).bind("keydown", "left", a(function(b) {
            Terminal.moveCursor(-1)
        })).bind("keydown", "right", a(function(b) {
            Terminal.moveCursor(1)
        })).bind("keydown", "up", a(function(b) {
            b.preventDefault();
            if (b.shiftKey || Terminal.sticky.keys.scroll) {
                Terminal.scrollLine(-1)
            } else {
                if (b.ctrlKey || Terminal.sticky.keys.ctrl) {
                    Terminal.scrollPage(-1)
                } else {
                    Terminal.moveHistory(-1)
                }
            }
        })).bind("keydown", "down", a(function(b) {
            b.preventDefault();
            if (b.shiftKey || Terminal.sticky.keys.scroll) {
                Terminal.scrollLine(1)
            } else {
                if (b.ctrlKey || Terminal.sticky.keys.ctrl) {
                    Terminal.scrollPage(1)
                } else {
                    Terminal.moveHistory(1)
                }
            }
        })).bind("keydown", "pageup", a(function(b) {
            Terminal.scrollPage(-1)
        })).bind("keydown", "pagedown", a(function(b) {
            Terminal.scrollPage(1)
        })).bind("keydown", "home", a(function(b) {
            b.preventDefault();
            if (b.ctrlKey || Terminal.sticky.keys.ctrl) {
                Terminal.jumpToTop()
            } else {
                Terminal.setPos(0)
            }
        })).bind("keydown", "end", a(function(b) {
            b.preventDefault();
            if (b.ctrlKey || Terminal.sticky.keys.ctrl) {
                Terminal.jumpToBottom()
            } else {
                Terminal.setPos(Terminal.buffer.length)
            }
        })).bind("keydown", "tab", function(b) {
            b.preventDefault()
        }).keyup(function(c) {
            var b = $.hotkeys.specialKeys[c.which];
            if (b in {
                    ctrl: true,
                    alt: true,
                    scroll: true
                }) {
                Terminal.sticky.toggle(b)
            } else {
                if (!(b in {
                        left: true,
                        right: true,
                        up: true,
                        down: true
                    })) {
                    Terminal.sticky.resetAll()
                }
            }
        });
        $(window).resize(function(b) {
            $("#screen").scrollTop($("#screen").attr("scrollHeight"))
        });
        this.setCursorState(true);
        this.setWorking(false);
        $("#prompt").html(this.config.prompt);
        $("#screen").hide().fadeIn("fast", function() {
            $("#screen").triggerHandler("cli-load")
        })
    },
    setCursorState: function(b, a) {
        this.cursorBlinkState = b;
        if (this.config.cursor_style == "block") {
            if (b) {
                $("#cursor").css({
                    color: this.config.bg_color,
                    backgroundColor: this.config.fg_color
                })
            } else {
                $("#cursor").css({
                    color: this.config.fg_color,
                    background: "none"
                })
            }
        } else {
            if (b) {
                $("#cursor").css("textDecoration", "underline")
            } else {
                $("#cursor").css("textDecoration", "none")
            }
        }
        if (!a && this._cursorBlinkTimeout) {
            window.clearTimeout(this._cursorBlinkTimeout);
            this._cursorBlinkTimeout = null
        }
        this._cursorBlinkTimeout = window.setTimeout($.proxy(function() {
            this.setCursorState(!this.cursorBlinkState, true)
        }, this), this.config.cursor_blink_time)
    },
    updateInputDisplay: function() {
        var c = "",
            b = " ",
            a = "";
        if (this.pos < 0) {
            this.pos = 0
        }
        if (this.pos > this.buffer.length) {
            this.pos = this.buffer.length
        }
        if (this.pos > 0) {
            c = this.buffer.substr(0, this.pos)
        }
        if (this.pos < this.buffer.length) {
            b = this.buffer.substr(this.pos, 1)
        }
        if (this.buffer.length - this.pos > 1) {
            a = this.buffer.substr(this.pos + 1, this.buffer.length - this.pos - 1)
        }
        $("#lcommand").text(c);
        $("#cursor").text(b);
        if (b == " ") {
            $("#cursor").html("&nbsp;")
        }
        $("#rcommand").text(a);
        $("#prompt").text(this.config.prompt);
        return
    },
    clearInputBuffer: function() {
        this.buffer = "";
        this.pos = 0;
        this.updateInputDisplay()
    },
    clear: function() {
        $("#display").html("")
    },
    addCharacter: function(b) {
        var c = this.buffer.substr(0, this.pos);
        var a = this.buffer.substr(this.pos, this.buffer.length - this.pos);
        this.buffer = c + b + a;
        this.pos++;
        this.updateInputDisplay();
        this.setCursorState(true)
    },
    deleteCharacter: function(a) {
        var d = a ? 1 : 0;
        if (this.pos >= (1 - d)) {
            var c = this.buffer.substr(0, this.pos - 1 + d);
            var b = this.buffer.substr(this.pos + d, this.buffer.length - this.pos - d);
            this.buffer = c + b;
            this.pos -= 1 - d;
            this.updateInputDisplay()
        }
        this.setCursorState(true)
    },
    deleteWord: function() {
        if (this.pos > 0) {
            var a = this.pos;
            while (a > 0 && this.buffer.charAt(a) !== " ") {
                a--
            }
            left = this.buffer.substr(0, a - 1);
            right = this.buffer.substr(a, this.buffer.length - this.pos);
            this.buffer = left + right;
            this.pos = a;
            this.updateInputDisplay()
        }
        this.setCursorState(true)
    },
    moveCursor: function(a) {
        this.setPos(this.pos + a)
    },
    setPos: function(a) {
        if ((a >= 0) && (a <= this.buffer.length)) {
            this.pos = a;
            Terminal.updateInputDisplay()
        }
        this.setCursorState(true)
    },
    moveHistory: function(b) {
        var a = this.historyPos + b;
        if ((a >= 0) && (a <= this.history.length)) {
            if (a == this.history.length) {
                this.clearInputBuffer()
            } else {
                this.buffer = this.history[a]
            }
            this.pos = this.buffer.length;
            this.historyPos = a;
            this.updateInputDisplay();
            this.jumpToBottom()
        }
        this.setCursorState(true)
    },
    addHistory: function(a) {
        this.historyPos = this.history.push(a)
    },
    jumpToBottom: function() {
        $("#screen").animate({
            scrollTop: $("#screen").attr("scrollHeight")
        }, this.config.scrollSpeed, "linear")
    },
    jumpToTop: function() {
        $("#screen").animate({
            scrollTop: 0
        }, this.config.scrollSpeed, "linear")
    },
    scrollPage: function(a) {
        $("#screen").animate({
            scrollTop: $("#screen").scrollTop() + a * ($("#screen").height() * 0.75)
        }, this.config.scrollSpeed, "linear")
    },
    scrollLine: function(a) {
        $("#screen").scrollTop($("#screen").scrollTop() + a * this.config.scrollStep)
    },
    print: function(b) {
        if (!b) {
            $("#display").append($("<div>"))
        } else {
            if (b instanceof jQuery) {
                $("#display").append(b)
            } else {
                var a = Array.prototype.slice.call(arguments, 0);
                $("#display").append($("<p>").text(a.join(" ")))
            }
        }
        this.jumpToBottom()
    },
    processInputBuffer: function(a) {
        this.print($("<p>").addClass("command").text(this.config.prompt + this.buffer));
        var a = trim(this.buffer);
        this.clearInputBuffer();
        if (a.length == 0) {
            return false
        }
        this.addHistory(a);
        if (this.output) {
            return this.output.process(this, a)
        } else {
            return false
        }
    },
    setPromptActive: function(a) {
        this.promptActive = a;
        $("#inputline").toggle(this.promptActive)
    },
    setWorking: function(a) {
        if (a && !this._spinnerTimeout) {
            $("#display .command:last-child").add("#bottomline").first().append($("#spinner"));
            this._spinnerTimeout = window.setInterval($.proxy(function() {
                if (!$("#spinner").is(":visible")) {
                    $("#spinner").fadeIn()
                }
                this.spinnerIndex = (this.spinnerIndex + 1) % this.config.spinnerCharacters.length;
                $("#spinner").text(this.config.spinnerCharacters[this.spinnerIndex])
            }, this), this.config.spinnerSpeed);
            this.setPromptActive(false);
            $("#screen").triggerHandler("cli-busy")
        } else {
            if (!a && this._spinnerTimeout) {
                clearInterval(this._spinnerTimeout);
                this._spinnerTimeout = null;
                $("#spinner").fadeOut();
                this.setPromptActive(true);
                $("#screen").triggerHandler("cli-ready")
            }
        }
    },
    runCommand: function(e) {
        var b = 0;
        var d = false;
        this.promptActive = true;
        var a = window.setInterval($.proxy(function c() {
            if (b < e.length) {
                this.addCharacter(e.charAt(b));
                b += 1
            } else {
                clearInterval(a);
                this.promptActive = true;
                this.processInputBuffer()
            }
        }, this), this.config.typingSpeed)
    }
};
$(document).ready(function() {
    $("#welcome").show();
    document.onkeydown = document.onkeypress = function(a) {
        return $.hotkeys.specialKeys[a.keyCode] != "backspace"
    };
    Terminal.init()
});

function pathFilename(b) {
    var a = /\/([^\/]+)$/.exec(b);
    if (a) {
        return a[1]
    }
}

function getRandomInt(b, a) {
    return Math.floor(Math.random() * (a - b + 1)) + b
}

function randomChoice(a) {
    return a[getRandomInt(0, a.length - 1)]
}
var remote = {
    root: null,
    last: null,
    cache: {},
    base: "",
    get: function(b, c, a) {
        if (b == null) {
            b = ""
        } else {
            if (Number(b)) {
                b = String(b)
            }
        }
        if (b in this.cache) {
            this.last = this.cache[b];
            c(this.cache[b])
        } else {
            return $.ajax({
                url: this.base + b,
                dataType: "jsonp",
                success: $.proxy(function(d) {
                    this.last = this.cache[b] = d;
                    c(d)
                }, this),
                error: a
            })
        }
    }
};
var siteDisplay = TerminalShell.commands.show = function(b, c) {
    function a() {
        b.print($("<p>").addClass("error").text('display: unable to load "' + c + '": No such file or directory.'));
        b.setWorking(false)
    }
    if (c) {
        c = String(c);
        num = Number(c.match(/^\d+/));
        filename = pathFilename(c);
        if (num > remote.latest.num) {
            b.print("Time travel mode not enabled.");
            return
        }
    } else {
        num = remote.last.num
    }
    b.setWorking(true);
    remote.get(c, function(d) {
        if (d.img) {
            if (!filename || (filename == pathFilename(d.img))) {
                $("<img>").hide().load(function() {
                    b.print($("<h3>").text(d.num + ": " + d.title));
                    $(this).fadeIn();
                    var e = $(this);
                    if (d.link) {
                        e = $("<a>").attr("href", d.link).append($(this))
                    }
                    b.print(e);
                    b.setWorking(false)
                }).attr({
                    src: d.img,
                    alt: d.title,
                    title: d.alt
                }).addClass("imgblob")
            } else {
                a()
            }
        } else {
            b.print("Not an image")
        }
    }, a)
};
TerminalShell.commands.next = function(a) {
    siteDisplay(a, remote.last.num + 1)
};
TerminalShell.commands.previous = TerminalShell.commands.prev = function(a) {
    siteDisplay(a, remote.last.num - 1)
};
TerminalShell.commands.first = function(a) {
    siteDisplay(a, 1)
};
TerminalShell.commands.latest = TerminalShell.commands.last = function(a) {
    siteDisplay(a, remote.latest.num)
};
TerminalShell.commands.random = function(a) {
    siteDisplay(a, getRandomInt(1, remote.latest.num))
};
TerminalShell.commands["goto"] = function(a, b) {
    $("#screen").one("cli-ready", function(c) {
        a.print('Did you mean "show"?')
    });
    siteDisplay(a, 292)
};
TerminalShell.commands.sudo = function(a) {
    var c = Array.prototype.slice.call(arguments);
    c.shift();
    if (c.join(" ") == "make me a sandwich") {
        a.print("Okay.")
    } else {
        var b = c.shift();
        c.unshift(a);
        c.push("sudo");
        if (TerminalShell.commands.hasOwnProperty(b)) {
            this.sudo = true;
            this.commands[b].apply(this, c);
            delete this.sudo
        } else {
            if (!b) {
                a.print("sudo what?")
            } else {
                a.print("sudo: " + b + ": command not found")
            }
        }
    }
};
TerminalShell.filters.push(function(b, c) {
    if (/!!/.test(c)) {
        var a = c.replace("!!", this.lastCommand);
        b.print(a);
        return a
    } else {
        return c
    }
});
TerminalShell.commands.shutdown = TerminalShell.commands.poweroff = function(a) {
    if (this.sudo) {
        a.print("Shutting down... ");
        return $("#screen").fadeOut()
    } else {
        a.print("Must be root.")
    }
};
TerminalShell.commands.logout = TerminalShell.commands.exit = TerminalShell.commands.quit = function(a) {
    a.print("Bye bye c:");
    $("#prompt, #cursor").hide();
    a.promptActive = false
};
TerminalShell.commands.restart = TerminalShell.commands.reboot = function(a) {
    if (this.sudo) {
        TerminalShell.commands.poweroff(a).queue(function(b) {
            window.location.reload()
        })
    } else {
        a.print("Must be root.")
    }
};

function linkDir(a) {
    return {
        type: "dir",
        enter: function() {
            window.location = a
        }
    }
}

function linkFile(a) {
    return {
        type: "file",
        read: function() {
            window.location = a
        }
    }
}

function textFile(a) {
    return {
        type: "file",
        read: function(b) {
            $.each(a, function(d, c) {
                b.print($("<p>").text(c))
            })
        }
    }
}

function htmlFile(a) {
    return {
        type: "file",
        read: function(b) {
            $.each(a, function(d, c) {
                b.print($("<p>").html(c))
            })
        }
    }
}

function imageFile(a) {
    return {
        type: "file",
        read: function(b) {
            b.print($("<img>").attr({
                src: a.src,
                title: a.title,
                alt: a.alt
            }))
        }
    }
}


Filesystem = {
    "info": {
        type: "file",
        read: function(a) {
            a.print("===================================================");
            a.print($("<h4>").text("|------------- KOK YUAN TING -------------|"));
            a.print("===================================================");
            a.print("[+] Codename: iXcess");
            a.print("[+] E-mail: brandonting@hotmail.com");
            a.print("[+] Phone number: +6017-3611088");
        }
    },
    "skills": {
        type: "file",
        read: function(a) {
            a.print("==================================================");
            a.print($("<p>").text("-------------------- IT skills -------------------"));
            a.print("==================================================");
            a.print($("<p>").text("Programming languages"));
            a.print("> HTML                  [===============>    ] 80%");
            a.print("> CSS                   [=============>      ] 70%");
            a.print("> Javascript            [===========>        ] 60%");
            a.print("> Python                [=============>      ] 70%");
            a.print("> Java                  [=========>          ] 50%");
            a.print("> Bash                  [=========>          ] 50%");
            a.print(" ");
            a.print($("<p>").text("Design and animation"));
            a.print("> Photoshop             [==============>     ] 70%");
            a.print("> After Effects         [===========>        ] 60%");
            a.print(" ");
            a.print($("<h4>").text("Cyber Security"));            
            a.print("> Cryptography          [=========>          ] 50%");
            a.print("> Steganography         [=====>              ] 30%");
            a.print("> Networking            [===============>    ] 80%");
            a.print("> Wifi Security         [==================> ] 95%");
            a.print("> Linux OS              [==================> ] 95%");
            a.print("> Wireshark             [=========>          ] 50%");
            a.print("> Metasploit            [=========>          ] 50%");
            a.print("> Virtualization        [=========>          ] 50%");
            a.print("> Data Mining           [=================>  ] 90%");
            a.print("# I am very well informed in the security world.");
            a.print(" ");
            a.print($("<p>").text("Mechatronics")); 
            a.print("> Raspberry Pi          [===============>    ] 80%");
            a.print("> Arduino               [===============>    ] 80%");
            a.print(" ");
            a.print("==================================================");
            a.print($("<p>").text("----------------- Language Skills ----------------"));
            a.print("==================================================");
            a.print("> Mandarin              [=================>  ] 90%");
            a.print("> English               [=================>  ] 90%");
            a.print("> Malay                 [=================>  ] 90%");
            a.print("> Japanese              [===========>        ] 60%");
            a.print("> German                [===>                ] 20%");
            a.print("> Polish                [==>                 ] 15%");
            a.print(" ");
            a.print("==================================================");
            a.print($("<p>").text("------------------ Music Skills ------------------"));
            a.print("==================================================");
            a.print("> Vocal                 [===========>        ] 60%");
            a.print("> Guitar                [=================>  ] 90%");
            a.print("> Drums                 [===============>    ] 80%");
            a.print("> Beatbox               [=========>          ] 50%");

            a.print($("<p>").attr("style", "text-align: center; color: #BFB;").text("---"))
        }
    },
    "achievements": {
        type: "file",
        read: function(a) {
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("     _        _     _                                     _      "));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("    / \\   ___| |__ (_) _____   _____ _ __ ___   ___ _ __ | |_ ___"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("   / _ \\ / __| '_ \\| |/ _ \\ \\ / / _ \\ '_ ` _ \\ / _ \\ '_ \\| __/ __|"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  / ___ \\ (__| | | | |  __/\\ V /  __/ | | | | |  __/ | | | |_\\__ \\"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text(" /_/   \\_\\___|_| |_|_|\\___| \\_/ \\___|_| |_| |_|\\___|_| |_|\\__|___/ "));
            a.print(" ");
            a.print($("<p>").text("Technology")); 
            a.print($("<p>").text('[+] Building a home server from scratch by understanding each hardware component.'));
            a.print($("<p>").text('[+] Disassemble old CPU to salvage working components to build a new working server.')); 
            a.print($("<p>").text('[+] Disassemble old DVD drive optical laser to be reused in laser trip wire system.')); 
            a.print($("<p>").text('[+] Reuse old Intel Atom Dell Inspiron Mini as a portable hacking machine by installing a penetration testing operating system called Parrot OS. '));
            a.print($("<p>").text('[+] Securing home wifi network with the knowledge of network scanners and wifi penetration tools such eg. ( wireshark, aircrack-ng, nmap, etc )'));
            a.print($("<p>").text('[+] Wrote a language learning program with Python to help out my friend who is learning German.'));
            a.print($("<p>").text('[+] Connected smart home appliances and let them communicate with each other via MQTT protocol.'));
            a.print($("<p>").text('[+] Wrote an external IP grabber script with python coupled with a program which uploads data to the web server directly with the help on Dropbox API, written in bash.'));
            a.print($("<p>").text('[+] Created a security door access system.'));
            a.print($("<p>").text('[+] Created an automatic attendance taking application with QR technology.'));
            a.print($("<p>").text('[+] Successfully implementing Bluetooth Low Energy as replacement for SSH to communicate with my Raspberry Pi.'));
            a.print($("<p>").text('[+] Implementing RFID for authentication purposes.'));
            a.print($("<p>").text('[+] Build myself a personal website from scratch with the help of HTTrack to clone sites as template.'));
            a.print($("<p>").text('[+] Created a USB-like arduino pro micro to act as a HID device for penetration testing purposes.'));
            a.print($("<p>").text('[+] Created a portable wifi hacking arsenal with raspberry pi.'));
            a.print(" ");
            a.print($("<p>").text("Education"));
            a.print($("<p>").text('[+] Scored 9A+ 1A in the 2014 Sijil Pelajaran Malaysia examination.'));
            a.print($("<p>").text('[+] Ministry of Education of Malaysia Bursary Holder.'));
            a.print($("<p>").text('[+] Duke of Edinburgh Silver Award.'));
            a.print($("<p>").text('[+] Got into Malaysia Computing Olympiad team.'));
            a.print($("<p>").text('[+] Became a champion in ').append($("<a>").attr("href", "https://coderdojo.com/").attr("style","color: #5e80f9").attr("target","_blank").text("coderdojo.")));
            a.print($("<p>").text('[+] Founded a Computing Technology Club called Dot∙slash.'));
            a.print($("<p>").text('[+] Lead a group during the Japan-Malaysia Cultural Exchange Program.'));
            a.print($("<p>").text('[+] Hosted TEDxTaylor\'s as the Head of Technical Department, ').append($("<a>").attr("href", "https://www.ted.com/about/programs-initiatives/tedx-program").attr("style","color: #5e80f9").attr("target","_blank").text("TEDx.")));
            a.print(" ");
            a.print($("<p>").text("Music"));
            a.print($("<p>").text('[+] Set up a YouTube account to make guitar covers.'));
            a.print($("<p>").text('[+] Perform in high school Mid Autumn Festival as a band.'));
            a.print($("<p>").text('[+] Perform in high school prom night as a band.'));
            a.print($("<p>").text('[+] Duet in Morning Wood cafe, twice.'));
            a.print($("<p>").text('[+] Hosted Neocentric Music Night in college.'));
            a.print(" ");
            a.print($("<p>").text("Life"));
            a.print($("<p>").text('[+] Backpack around Langkawi with my girlfriend and made friends.'));

        }
    },
    "education": {
        type: "file",
        read: function(a) {
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("(\\ "));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text(" \\'\\     __________ "));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text(" / '|   ()_________)"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text(" \\ '/    \\ ~~~~~~~~ \\"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("   \\       \\ ~~~~~~   \\            EDUCATION"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("   ==).      \\__________\\"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  (__)       ()__________)"));
            a.print(" ");
            a.print("Primary School");
            a.print("-> SJK(C) Desa Jaya 2");
            a.print(" ");
            a.print("Secondary School");
            a.print("----> SMK Bandar Sri Damansara 1");
            a.print(" ");
            a.print("Pre-University");
            a.print("------> Taylor's College Subang Jaya");
        }
    },
    "work_experiences": {
        type: "file",
        read: function(a) {
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("    _____"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("   /    /|_ ___________________________________________"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  /    // /|                                          /|"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text(" (====|/ //          Working                         / |"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  (=====|/              Experiences                 / .|"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text(" (====|/                                           / /||"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("/_________________________________________________/ / ||"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("|  _____________________________________________  ||  ||"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("| ||                                            | ||"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("| ||                                            | ||"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("| |                                             | |"));
            a.print(" ");
            a.print("The Great Eastern Life Assurance Company Limited");
            a.print("> Administrative Assistant");
            a.print(" ");
            a.print("Sakae Sushi");
            a.print("> Waiter and Cashier");
            a.print(" ");
        }
    },
    "passion": {
        type: "file",
        read: function(a) {
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("                                  d8b"));
            a.print($("<p>").text("                                  Y8P "));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  88888b.  8888b. .d8888b .d8888b 888 .d88b. 88888b."));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  888 \"88b    \"88b88K     88K     888d88\"\"88b888 \"88b"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  888  888.d888888\"Y8888b.\"Y8888b.888888  888888  888"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  888 d88P888  888     X88     X88888Y88..88P888  888"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  88888P\" \"Y888888 88888P\' 88888P\'888 \"Y88P\" 888  888"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  888"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  888"));
            a.print($("<p>").attr("style", "margin: 0; padding:0;").text("  888"));
            a.print(" ");
            a.print("Technology");
            a.print("> I am deeply into the Internet of Things and the Internet of Everything.");
            a.print("> I love coding and create scripts that automate part of my life.");
            a.print("> I envision to create a future with a more sustainable living with sustainable energy.");
            a.print(" ");
            a.print("Music");
            a.print("> Singing and playing guitar makes my creativity flow.");
            a.print("> Being in a part of music production has always been my honor.");
            a.print(" ");
            a.print("Sports");
            a.print("> I love being free in water.");
            a.print("> Badminton");
            a.print("> Football");
            a.print(" ");
            a.print("Languages");
            a.print("> Learning new languages to break barrier between human communication");
            a.print(" ");
            a.print("Movie and Anime");
            a.print(" ");
            a.print("Travelling");
            a.print("> Backpacking around the world with my girl to meet people and help out to those in need.");   
        }
        
    }
    
};
Filesystem["kokyuanting.pdf"] = linkFile("../sources/document/kokyuanting.rtf");
TerminalShell.pwd = Filesystem;
TerminalShell.commands.echo = function(b) {
    for (var a = 1; a < arguments.length; a++) {
        b.print(arguments[a])
    }
};
TerminalShell.commands.download = function(b) {
    for (var a = 1; a < arguments.length; a++) {
        var c = arguments[a];
        if (c in this.pwd) {
            document.getElementById('download').click();
        } else {
            b.print($("<p>").addClass("error").text('download: "' + c + '": No such file or directory.'))
        }
    }
};
TerminalShell.commands.cd = function(a, b) {
    if (b in this.pwd) {
        if (this.pwd[b].type == "dir") {
            this.pwd[b].enter(a)
        } else {
            if (this.pwd[b].type == "file") {
                a.print("cd: " + b + ": Not a directory")
            }
        }
    } else {
        a.print("cd: " + b + ": No such file or directory")
    }
};

TerminalShell.commands.dir = TerminalShell.commands.ls = function(b, c) {
    var a = $("<ul>");
    $.each(this.pwd, function(d, e) {
        a.append($("<li>").append($("<a>").bind("click", function(f) {
            if (e.type == "dir") {
                Terminal.runCommand("cd " + d)
            } else {
                if (e.type == "file") {
                    Terminal.runCommand("cat " + d)
                }
            }
        }).attr("href", "#").text(d)))
    });
    b.print(a)
};
TerminalShell.commands.cat = function(b) {
    for (var a = 1; a < arguments.length; a++) {
        var c = arguments[a];
        if (c in this.pwd) {
            if (this.pwd[c].type == "file") {
                this.pwd[c].read(b)
            } else {
                if (this.pwd[c].type == "dir") {
                    b.print("cat: " + c + ": Is a directory")
                }
            }
        } else {
            b.print($("<p>").addClass("error").text('cat: "' + c + '": No such file or directory.'))
        }
    }
};
TerminalShell.commands.rm = function(b, a, c) {
    if (a && a[0] != "-") {
        c = a
    }
    if (!c) {
        b.print("rm: missing operand")
    } else {
        if (c in this.pwd) {
            if (this.pwd[c].type == "file") {
                delete this.pwd[c]
            } else {
                if (this.pwd[c].type == "dir") {
                    if (/r/.test(a)) {
                        delete this.pwd[c]
                    } else {
                        b.print("rm: cannot remove " + c + ": Is a directory")
                    }
                }
            }
        } else {
            if (a == "-rf" && c == "/") {
                if (this.sudo) {
                    TerminalShell.commands = {}
                } else {
                    b.print("rm: cannot remove /: Permission denied")
                }
            }
        }
    }
};

TerminalShell.commands["apt-get"] = function(b, c) {
    if (!this.sudo && (c in {
            update: true,
            upgrade: true,
            "dist-upgrade": true
        })) {
        b.print("E: Unable to lock the administration directory, are you root?")
    } else {
        if (c == "update") {
            b.print("Reading package lists... Done")
        } else {
            if (c == "upgrade") {
                b.print("This looks pretty good to me.")
            } else {
                if (c == "dist-upgrade") {
                    var d = {
                        win: "Windows",
                        mac: "OS X",
                        linux: "Linux"
                    };
                    var a = $.os.name;
                    if (a in d) {
                        a = d[a]
                    } else {
                        a = "something fancy"
                    }
                    b.print("You are already running " + a + ".")
                } else {
                    if (c == "moo") {
                        b.print("        (__)");
                        b.print("        (oo)");
                        b.print("  /------\\/ ");
                        b.print(" / |    ||  ");
                        b.print("*  /\\---/\\  ");
                        b.print("   ~~   ~~  ");
                        b.print('...."Have you mooed today?"...')
                    } else {
                        if (!c) {
                            b.print("This APT has Super Cow Powers.")
                        } else {
                            b.print("E: Invalid operation " + c)
                        }
                    }
                }
            }
        }
    }
};

function oneLiner(a, c, b) {
    if (b.hasOwnProperty(c)) {
        a.print(b[c]);
        return true
    } else {
        return false
    }
}
TerminalShell.commands.sleep = function(a, b) {
    b = Number(b);
    if (!b) {
        b = 5
    }
    a.setWorking(true);
    $("#screen").fadeOut(1000);
    window.setTimeout(function() {
        a.setWorking(false);
        $("#screen").fadeIn()
    }, 1000 * b)
};
TerminalShell.commands.help = TerminalShell.commands.halp = function(a) {
    a.print("Below are the list of commands usable in this console.")
    a.print(" ")
    a.print("[Commands]                         [Usage]")
    a.print("sudo                Gives you administrator's priviledges.")
    a.print("clear               Clear terminal.")
    a.print("cat [filename]      Concatenate the content of the file.")
    a.print("echo [arg]          Print out the arguments in the console.")
    a.print("cd [directory]      Change directory")
    a.print("ls                  List down all files in current directory.")
    a.print("rm [filename]       Remove file.")
    a.print("download [filename] Download file.")
    a.print("pwd                 List current directory.")
    a.print("date                Print today's date.")
    a.print("whoami              Print current user.")
    a.print("ping                Packet internet groper.")
    a.print("ssh                 Secure Shell.")
    a.print("bash                Open Bash.")
    a.print("kill                Kill all processes.")
    a.print("top                 View running processes.")
    a.print("shutdown            Shutdown.")
    a.print("reboot              Reboot.")
    a.print("sleep [time]        Sleep for t seconds.")
    a.print("apt-get [arg]       [arg] = update/upgrade/dist-upgrade.")
    a.print("exit                Exit terminal.")
};
TerminalShell.fallback = function(a, b) {
    oneliners = {
        "make me a sandwich": "What? Make it yourself.",
        "i read the source code": "<3",
        pwd: "You are currently in my heart <3",
        date: "You don't have a date! (;",
        hello: "Why hello there!",
        who: "Doctor Who?",
        xkcd: "Yes?",
        su: "God mode activated.",
        fuck: "I hate it when people say that.",
        whoami: "You are my master.",
        nano: "Seriously? Why don't you just use Notepad.exe? Or MS Paint?",
        top: "Stop checking my processes, get yourself a better rig!",
        moo: "moo",
        ping: "There is another submarine three miles ahead, bearing 225, forty fathoms down.",
        find: "What do you want to find? Kitten would be nice.",
        hello: "Hello.",
        hi: "Hi.",
        bash: "You bash your head against the wall. It's not very effective.",
        ssh: "ssh, this is a library.",
        uname: "Illudium Q-36 Explosive Space Modulator",
        finger: "Mmmmmm...",
        kill: "Terminator deployed to 1984.",
    };
    oneliners.emacs = "You should really use vim.";
    oneliners.vi = oneliners.vim = "You should really use emacs.";
    b = b.toLowerCase();
    if (!oneLiner(a, b, oneliners)) {
        return false
    }
    return true
};


$(document).ready(function() {
    Terminal.promptActive = true;
});