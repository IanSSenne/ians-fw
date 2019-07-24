class verboseConstructor{
    enabled:boolean;
    funcs:{log:Function}={
        log:console.log.bind(null)
    };
    constructor(){
        this.enabled=false;
    }
    log(...content){
        if(this.enabled)this.funcs.log(...content);
    }
}
export default new verboseConstructor();