switch (process.argv[2]) {
    case 'dev':
        require('./dev');
        require('./serve');
        break;
    case 'build':
        require('./build-build');
}