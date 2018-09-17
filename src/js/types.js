
/** The default height for iframes. */
var defaultHeight = 250;

/**
 * HOW TO: Define Script Types:
 *   Create an array of script types for each page you plan to make.
 *   Goto the bottom of the page and change the parameter in
 *   initializeScriptTypes(...); to the name of the array.
 * 
 * Parameter 1: The url for the script.
 *              Parameters must be marked with {P#} (starts at 1)
 * Parameter 2: The UNIQUE identifier of the script.
 *              Used to store cookies of last-used parameters.
 * Parameter 3: The list of parameter names and options.
 *              Leave parameter name as '' to hide name.
 *              Formats per Parameter:
 *                'Name', Name and no default value
 *                ['Name', 'Default'], Name and default value
 *                ['Name', ['Op1', 'Op2', 'Op3']], Name and dropdown values
 * Parameter 4: Script label (Appears above input line), leave null to exclude.
 * Parameter 5: The default height of the iframe.
 * Parameter 6: true if the iframe should attempt to resize to the content.
 *              Otherwise false.
 *              NOTE: Will ONLY work if the url is on the same domain as this page.
 */
var x86mmgScriptTypes = [
    /* Define new script types here: */
    /* `defaultHeight` is defined at the top of this file. */

    /* Actual data */
    new ScriptType('/cgi-bin/mmg/page_tables?p1={P1}&p2={P2}',
        'va',
        [ // Parameters
            'VA',
            ['Mode', ['Kernel', 'Exec', 'Super', 'User']]
        ],
        'Page Table Addresses',
        defaultHeight, false),
    new ScriptType('/cgi-bin/mmg/pte_format?p1={P1}&p2={P2}',
        'pte',
        [ // Parameters
            'PTE',
            ['Type', ['All', 'PML4 (4)', 'PDPT (3)', 'PD (2)', 'BPT (1)']]
        ],
        'PTE Formats',
        defaultHeight, false),

    /* Sample data */
    /*new ScriptType('./test/va.txt',
        'va',
        [ // Parameters
            'VA',
            ['Mode', ['Kernel', 'Exec', 'Super', 'User']]
        ],
        'Page Table Addresses',
        defaultHeight, true),
    new ScriptType('./test/pte.txt',
        'pte',
        [ // Parameters
            'PTE',
            ['Type', ['All', 'PML4 (4)', 'PDPT (3)', 'PD (2)', 'BPT (1)']]
        ],
        'PTE Formats',
        defaultHeight, true),*/
];

