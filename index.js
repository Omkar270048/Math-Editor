
        function loadMathJax() {
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML";

            script.onload = function () {
                console.log("MathJax loaded successfully");
            };

            script.onerror = function () {
                console.error("Error loading MathJax");
            };

            document.head.appendChild(script);
        }

        loadMathJax(); // Call this function to load MathJax

        const mathEditor = document.getElementById('math-editor');
        const system = `  
        
        <style>
        #sym{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 5px;
        } 

        #sym > button{
            font-size: 20px;
        }
    </style> 
    <div id="sym">
        <button id="btn-einstein">\\(x^n \\)</button>
        <button id="btn-x-bottom-n">\\(x_{n} \\)</button>
        <button id="btn-sqrt">\\( \\sqrt{x} \\)</button>
        <button id="btn-sqrt2">\\( \\sqrt[x]{n} \\)</button>
        <button id="btn-frac">\\( \\frac{x}{n} \\)</button>
        <button id="btn-sum">\\( \\sum_{x}^{n} \\)</button>
        <button id="btn-prod">\\( \\prod_{x}^{n} \\)</button>
        <button id="btn-int">\\( \\int_{x}^{n} \\)</button>
        <button id="btn-oint">\\( \\oint_{x}^{n} \\)</button>
        <button id="btn-curly-bracket">\\( \\{ x \\} \\)</button>
        <button id="btn-lim-x-n">\\(lim_{x \\to n}\\)</button>


        <button id="btn-vector">\\( \\vec{x} \\)</button>
        <button id="btn-dot">\\(\\dot{x} \\)</button>
        <button id="btn-hat">\\( \\hat{x}\\)</button>
        <button id="btn-bar">\\( \\bar{x}\\)</button>
        <button id="btn-overline">\\( \\overline{x}\\)</button>
        <button id="btn-underline">\\( \\underline{x}\\)</button>
        <button id="btn-widehat">\\( \\widehat{x}\\)</button>
        <button id="btn-widetilde">\\( \\widetilde{x}\\)</button>
    </div>
    <!-- <div id="sym"></div> -->


    <div id="cal" hidden>
        x: <input type="text" id="x" hidden>
        n : <input type="text" id="n" hidden>
        <button onclick="add()">submit</button>
    </div>


    <div id="editor" style="border: 1px solid black; min-height: 300px; padding:5px;"></div>


    <textarea name="textarea" id="textarea"></textarea>
    <button id="submit">Click to get code</button>
        `;

        mathEditor.innerHTML = system;
        var formula;
        var selected;
        const stack = [];
        const cal = document.getElementById('cal')
        const x = document.getElementById('x')
        const n = document.getElementById('n')
        // var submit = document.getElementById('submit')
        const editor = document.getElementById('editor')

        const buttons = {
            'btn-einstein': 'einstein',
            'btn-x-bottom-n': 'btnX_bottom_n',
            'btn-sqrt': 'sqrt',
            'btn-sqrt2': 'sqrt2',
            'btn-frac': 'frac',
            'btn-sum': 'sum',
            'btn-prod': 'prod',
            'btn-int': 'int',
            'btn-oint': 'oint',
            "btn-curly-bracket": 'curly_bracket',
            "btn-lim-x-n": 'btn_lim_x_n',
            "btn-vector": 'vector',
            "btn-dot": 'dot',
            "btn-hat": 'hat',
            "btn-bar": 'bar',
            "btn-overline": 'overline',
            "btn-underline": 'underline',
            "btn-widehat": 'widehat',
            "btn-widetilde": 'widetilde',
        };

        const specialButtons = new Set([
            'btn-sqrt', 'btn-curly-bracket', 'btn-vector', 'btn-dot',
            'btn-hat', 'btn-bar', 'btn-overline', 'btn-underline',
            'btn-widehat', 'btn-widetilde'
        ]);

        Object.entries(buttons).forEach(([id, value]) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', function () {
                    if (specialButtons.has(id)) {
                        hide_cal_x_n();
                        show_cal_x();
                    } else {
                        hide_cal_x_n();
                        show_cal_x_n();
                    }
                    selected = value;
                });
            }
        });

        // submit event listener
        function add() {
            if (selected == 'einstein') {
                formula = x.value + '^' + n.value
                hide_cal_x_n()
            } else if (selected == 'btnX_bottom_n') {
                formula = x.value + '_{' + n.value + '}'
                hide_cal_x_n()
            } else if (selected == 'sqrt') {
                formula = '\\sqrt{' + x.value + '}'
                hide_cal_x()
            } else if (selected == 'sqrt2') {
                formula = '\\sqrt[' + x.value + ']{' + n.value + '}'
                hide_cal_x_n()
            } else if (selected == 'frac') {
                formula = '\\frac{' + x.value + '}{' + n.value + '}'
                hide_cal_x_n()
            } else if (selected == 'sum') {
                formula = '\\sum_{' + x.value + '}^{' + n.value + '}'
                hide_cal_x_n()
            } else if (selected == 'prod') {
                formula = '\\prod_{' + x.value + '}^{' + n.value + '}'
                hide_cal_x_n()
            } else if (selected == 'int') {
                formula = '\\int_{' + x.value + '}^{' + n.value + '}'
                hide_cal_x_n()
            } else if (selected == 'oint') {
                formula = '\\oint_{' + x.value + '}^{' + n.value + '}'
                hide_cal_x_n()
            } else if (selected == 'curly_bracket') {
                formula = '\\{' + x.value + '\\}'
                hide_cal_x_n()
            } else if (selected == 'btn_lim_x_n') {
                formula = '\\lim_{' + x.value + ' \\to ' + n.value + '}'
                hide_cal_x_n()
            } else if (selected == 'vector') {
                formula = '\\vec{' + x.value + '}'
                hide_cal_x()
            } else if (selected == 'dot') {
                formula = '\\dot{' + x.value + '}'
                hide_cal_x()
            } else if (selected == 'hat') {
                formula = '\\hat{' + x.value + '}'
                hide_cal_x()
            } else if (selected == 'bar') {
                formula = '\\bar{' + x.value + '}'
                hide_cal_x()
            } else if (selected == 'overline') {
                formula = '\\overline{' + x.value + '}'
                hide_cal_x()
            } else if (selected == 'underline') {
                formula = '\\underline{' + x.value + '}'
                hide_cal_x()
            } else if (selected == 'widehat') {
                formula = '\\widehat{' + x.value + '}'
                hide_cal_x()
            } else if (selected == 'widetilde') {
                formula = '\\widetilde{' + x.value + '}'
                hide_cal_x()
            }



            let span = document.createElement("span");
            span.innerHTML = `\\( ${formula} \\)`;
            stack.push(`\\( ${formula} \\)`)
            editor.appendChild(span);

            MathJax.Hub.Typeset(span);
            editor.focus();
        }

        editor.addEventListener("keydown", function (e) {
            e.preventDefault(); // Prevent default behavior for special keys
            if (e.key === "Backspace") {
                let content = editor.innerHTML;
                let lastChild = editor.lastChild;

                if (lastChild && lastChild.nodeName === "SPAN") {
                    // Remove the last span element
                    editor.removeChild(lastChild);
                    stack.pop();
                } else if (content.endsWith("&nbsp;&nbsp;&nbsp;&nbsp;")) {
                    // Remove the last inserted tab (4 spaces)
                    editor.innerHTML = content.slice(0, -24);
                    stack.pop();
                } else if (content.endsWith("<br>")) {
                    // Remove the last inserted new line
                    editor.innerHTML = content.slice(0, -4);
                    stack.pop();
                } else {
                    // Remove the last character normally
                    editor.innerHTML = content.slice(0, -1);
                    stack.pop();
                }
            } else if (e.key === "Tab") {
                editor.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;"; // Insert 4 spaces for tab
                stack.push("&nbsp;&nbsp;&nbsp;&nbsp;");
            } else if (e.key === "Enter") {
                editor.innerHTML += "<br>"; // New line
                stack.push("<br>");
            } else if (e.key.length === 1) {
                editor.innerHTML += e.key; // Append normal characters (letters, numbers, symbols)
                stack.push(e.key);
            }
        });


        function hide_cal_x_n() {
            cal.hidden = true;
            x.hidden = true;
            n.hidden = true;
        }

        function hide_cal_x() {
            cal.hidden = true;
            x.hidden = true;
        }

        function show_cal_x_n() {
            cal.hidden = false;
            x.hidden = false;
            n.hidden = false;
        }

        function show_cal_x() {
            cal.hidden = false;
            x.hidden = false;
        }



        Symbol = {
            alpha: "\\alpha",
            beta: "\\beta",
            gamma: "\\gamma",
            theta: "\\theta",
            lambda: "\\lambda",
            omega: "\\omega",
            infty: "\\infty",
            approx: "\\approx",
            neq: "\\neq",
            partial: "\\partial",
            infinity: "\\infty",
            prime: "\\prime",
            percent: "\\%",
            factorial: "!",
            pi: "\\pi",
            sigma: "\\sigma",
            delta: "\\delta",
            epsilon: "\\epsilon",
            phi: "\\phi",
            psi: "\\psi",
            mu: "\\mu",
            zeta: "\\zeta",
            eta: "\\eta",
            kappa: "\\kappa",
            rho: "\\rho",
            tau: "\\tau",
            chi: "\\chi",
            upsilon: "\\upsilon",
            xi: "\\xi",
            iota: "\\iota",
            omicron: "\\omicron",
            Gamma: "\\Gamma",
            Delta: "\\Delta",
            Theta: "\\Theta",
            Lambda: "\\Lambda",
            Xi: "\\Xi",
            Pi: "\\Pi",
            Sigma: "\\Sigma",
            Upsilon: "\\Upsilon",
            Phi: "\\Phi",
            Psi: "\\Psi",
            Omega: "\\Omega",
            plus: "+",
            minus: "-",
            times: "\\times",
            equals: "=",
            less: "<",
            greater: ">",
            leq: "\\leq",
            geq: "\\geq",
            leftarrow: "\\leftarrow",
            rightarrow: "\\rightarrow",
            leftrightarrow: "\\leftrightarrow",
            Leftarrow: "\\Leftarrow",
            Rightarrow: "\\Rightarrow",
            Leftrightarrow: "\\Leftrightarrow",
            mapsto: "\\mapsto",
            to: "\\to",
            gets: "\\gets",
            uparrow: "\\uparrow",
            downarrow: "\\downarrow",
            updownarrow: "\\updownarrow",
            Uparrow: "\\Uparrow",
            Downarrow: "\\Downarrow",
            Updownarrow: "\\Updownarrow",
            nearrow: "\\nearrow",
            searrow: "\\searrow",
            nwarrow: "\\nwarrow",
            swarrow: "\\swarrow",
            leadsto: "\\leadsto",
            hookleftarrow: "\\hookleftarrow",
            hookrightarrow: "\\hookrightarrow",
            longrightarrow: "\\longrightarrow",
            Longrightarrow: "\\Longrightarrow",
            longleftrightarrow: "\\longleftrightarrow",
            Longleftrightarrow: "\\Longleftrightarrow",
            longmapsto: "\\longmapsto",
            lim: "\\lim_{x \\to 0}",
            emptyset: "\\emptyset",
            exists: "\\exists",
            forall: "\\forall",
            in: "\\in",
            notin: "\\notin",
            subset: "\\subset",
            supset: "\\supset",
            subseteq: "\\subseteq",
            supseteq: "\\supseteq",
            nsubseteq: "\\nsubseteq",
            nsupseteq: "\\nsupseteq",
            union: "\\cup",
            intersection: "\\cap",
            not: "\\neg",
            and: "\\land",
            or: "\\lor",
            therefore: "\\therefore",
            because: "\\because",
            angle: "\\angle",
            triangle: "\\triangle",
            square: "\\square",
            parallel: "\\parallel",
            perp: "\\perp",
        };



        const sym = document.getElementById('sym');
        for (const [key, value] of Object.entries(Symbol)) {
            // Create button dynamically
            let button = document.createElement("button");
            button.id = key;
            button.innerHTML = `\\( ${value} \\)`;
            sym.appendChild(button);

            // Add event listener to insert LaTeX inline
            button.addEventListener('click', function () {
                let span = document.createElement("span");
                span.innerHTML = `\\( ${value} \\)`;
                stack.push(`\\( ${value} \\)`);
                editor.appendChild(span);

                MathJax.Hub.Typeset(span); // Render ONLY the new element
                editor.focus();
            });
        }




        const textarea = document.getElementById('textarea');
        document.getElementById('submit').addEventListener('click', function () {
            textarea.value = stack.join('');
        });
