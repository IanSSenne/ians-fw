'use strict';
exports.__esModule = true;
var ts = require('typescript');
process.env.DEV = true;
if (process.argv[2] === 'build') {
    process.env.DEV = false;
}
var build = require('./rollup');
var formatHost = {
    getCanonicalFileName: function(path) {
        return path;
    },
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: function() {
        return ts.sys.newLine;
    }
};

function watchMain() {
    var configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }
    var createProgram = ts.createSemanticDiagnosticsBuilderProgram;
    var host = ts.createWatchCompilerHost(
        configPath, {},
        ts.sys,
        createProgram,
        reportDiagnostic,
        reportWatchStatusChanged
    );
    var origCreateProgram = host.createProgram;
    host.createProgram = function(rootNames, options, host, oldProgram) {
        console.log('Building');
        return origCreateProgram(rootNames, options, host, oldProgram);
    };
    var origPostProgramCreate = host.afterProgramCreate;
    host.afterProgramCreate = function(program) {
        origPostProgramCreate(program);
        build();
    };
}

function reportDiagnostic(diagnostic) {
    console.error(
        'Error',
        diagnostic.code,
        ':',
        ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
    );
}

function reportWatchStatusChanged(diagnostic) {
    console.info(ts.formatDiagnostic(diagnostic, formatHost));
}
watchMain();