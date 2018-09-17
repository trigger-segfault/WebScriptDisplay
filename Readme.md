# WebScriptDisplay

[![Creation Date](https://img.shields.io/badge/created-september%202018-A642FF.svg?style=flat)](https://github.com/trigger-death/WebScriptDisplay/commit/15f71f5b5a77ca161a2fbf511ea8dc6c79b14fcb)

A small html page for displaying the results of calling a url with parameters. This was designed for use with an [OpenVMS](https://en.wikipedia.org/wiki/OpenVMS) server for running small cgi scripts, hence the existing *vms* favicon and sample urls.

## Measurements

Adjustable measurements have been documented and listed at the top of `src/css/styles.css` to faciliate customization.

See **Defining a ScriptType: Parameter 5** for adjusting `iframe` heights.

## Changing the Available Script Types

Script types can be modified in `src/js/types.js`. For each page you plan on making, you must create a new array of `ScriptType`s to pass to the `initializeScriptTypes(...);` function inside a `script` tag at the end of the page.

### Defining a ScriptType

Scripts are defined by populating an array with new `ScriptType`s. The parameters for the constructor are as follows:

**Parameter 1:**<br/>
The url for the script.<br/>
Parameters must be marked with `{P#}` (starts at 1)

**Parameter 2:**<br/>
The UNIQUE identifier of the script.<br/>
Used to store cookies of last-used parameters.

**Parameter 3:**<br/>
The list of parameter names and options.<br/>
Leave parameter name as `''` to hide name.<br/>
Formats per Parameter:<br/>
`'Name'`, Name and no default value<br/>
`['Name', 'Default']`, Name and default value<br/>
`['Name', ['Op1', 'Op2', 'Op3']]`, Name and dropdown values

**Parameter 4:**<br/>
 Script label (Appears above input line), leave null to exclude.
 
**Parameter 5:**<br/>
The default height of the `iframe`. (when Parameter 6 is false or fails)

**Parameter 6:**<br/>
`true` if the iframe should attempt to resize to the content.
Otherwise `false`.<br/>
NOTE: Will ONLY work if the url is on the same domain as this page.

## Example Page

![Page Preview](https://i.imgur.com/difNcPb.png)
