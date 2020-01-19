
//let locale = require('./result.locale.json')



module.exports = class Results {

    /*
    it's used to tranfer the data betwen api/ui/and store whitout constantly checking for errors
    can transfer the error until a point where it's consumed .fix()
    //it translates uncaught api errors
    */

    constructor(locale, uncaughtHandler) {
        this.locale = locale || false;
        this.uncaughtHandler = uncaughtHandler || false;
        this.defaults()

    }
    defaults() {
        // a list of intended actions an their results, possibly a list of $result
        this.intents = [];

        // if there was any sort of error, it;s used for fast checking the result if($result.e)
        this.e = false;

        //if no script fixed() the error another script receiving this $result cand do something about it
        this.handled = false;

        //
        this.caught = false;

        //who caught it, can be where() it is at() now, intent location(expectations not met)
        this.caughtBy = null;

        // an object containing some operations to perfomr when got() receives response
        this.expected = {}

        //holde the error
        //if (this.error) this.error = null;
        const testcommit = ""
    }

    //where in the script a new intent is stared
    at(where) {
        //this inits a  new intent
        //this.where = where;
        this.intents.push({ at: where })
        return this;

    }

    //what data was sent to the API
    with(payload) {
        this.intents[this.count()].with = payload || null
        return this;
    }

    //add expectations to the current intent
    expect(options) {
        this.intent().expected = options || null
        return this;
    }

    //intercept the data returned from the API
    got(response) {

        let intent = this.intent()
        intent.got = response
        //intent.g_type = {}.type = typeof response
        //intent.g_ctor = {}.ctor = response.constructor || null
        //intent.g_ctor_name = {}.ctor = response.constructor.name || null

        this.solveExpectations(intent)




    }
    intent() {
        return this.intents[this.count()]
    }
    solveExpectations(e) {
        if (!e.expected) {
            const catcher = this.check(e.got)["default"]()
            if (catcher !== true) {
                e.wanted = "something"
                e.instead = catcher
                e.error = { code: 'unexpected', message: "Raspuns neasteptat" }
                this.error = e.error
                this.e = true
                this.caught = false
                this.handled = false
                //this.caughtBy = {intent:true,}
                return false
            }
        }
        const keys = Object.keys(e.expected)
        const val = e.got

        for (const key of keys) {

            const param = e.expected[key]


            // console.log(this.check()[key])
            const catcher = this.check(val, param)[key]()
            if (catcher !== true) {
                e.wanted = key
                e.instead = catcher
                e.error = { code: 'unexpected', message: "Eroare neasteptata. Raspunsul servelului este neobisnuit" }
                this.error = e.error
                this.e = true
                this.caught = false
                this.handled = false
                //this.caughtBy = {intent:true,}
                return false
            }

        }



        return true

    }
    //used in trycatch block to save the error message
    but(error) {
        this.intents[this.count()].but = error || null
        this.e = true
        this.handled = false;
        this.error = error || null
    }

    //returns the current intent index in the intents array
    count() {
        return this.intents.length - 1
    }



    //this is where thr resoult returns to the firts caller
    //$result.at().... travels thru api,store,ui compnents and back,
    //if the error was never handled the unhandledHandler kicks in, trying to fix the problem 
    // by translating what it can or throwing a generic message
    done() {
        if (!this.handled) this.uncaughtHandler(this.intents)
        this.handled = true

    }

    //marks the result as fixed to let other scripts know the error has been handled
    fixed() {
        this.handled = true
    }

    //resets the $result to initial state, so that other actions cand be performed
    clear() {
        this.intents = false
    }

    //it will try to translate some errors using the result.locale.json
    translate() {
        // console.log(this.locale[0])
    }


    //contains all the usefull information about the state of the result
    why() {
        const ret = {
            e: this.e,
            handled: this.handled,
            caught: this.caught,
            intents: this.intents,

        }
        if (this.error) ret.error = this.error
        if (this.caughtBy) ret.caughtBy = this.caughtBy
        return ret
    }

    //returns a json string
    string() {
        return JSON.stringify(this.why())
    }

    //returns a base 64 encoded string to be saved in the server or send by email
    base64() {
        return Buffer.from(JSON.stringify(this.why())).toString("base64");
    }

    check(val, param) {

        return {
            len: function () {
                return val.length >= param ? true : val.length
            },
            is: function () {
                if (!val) return val
                const met = val.constructor.name === param
                //console.log(val.constructor.name + "===" + param + " ? " + met)
                return met === true ? true : val.constructor.name



            },
            default: function () {
                return val || false
            }
        }
    }


}