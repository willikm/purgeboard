Vue.createApp({
    data() {
        return {
            players: [
                { name: "Player 1", gender: "male", status: "alive", image: "" },
            ],
            displayConfiguration: false,
            displayTextbox: false,
            validatedPlayer: null,
            enableMask: false,
            chosen: "",
            counter: 0
        }
    },
    created() {
        if (localStorage.hasOwnProperty("configuration")) {
            this.loadConfiguration();
        } else {
            this.displayConfiguration = true;
        }
    },
    watch: {
        counter: {
            handler(count) {
                if (count > 0) {
                    audio = new Audio("audio/tick.mp3");
                    audio.play();
                    setTimeout(() => {
                        if (this.counter == 1) {
                            this.togglePlayer(this.validatedPlayer);
                            this.validatedPlayer = null;
                        }
                        this.counter--;
                    }, 1000);
                }
            },
            immediate: true
        }
    },
    methods: {
        addNewPlayer: function() {
            var playerName = "Player " + (this.players.length + 1);

            if (this.players.some((player) => player.name == playerName)) {
                playerName = playerName + " (2)"
            }

            this.players.push({ name: playerName, gender: "male", status: "alive", image: "" });
            this.saveConfiguration();
        },
        removePlayer: function(index) {
            this.players.splice(index, 1);
            this.saveConfiguration();
        },
        getPlayerImage: function(player) {
            if (player.image !== "") {
                return player.image;
            } 
            else {
                if (player.gender === "female") {
                    return "images/female.svg";
                } else {
                    return "images/male.svg";
                }
            }
        },
        onImageUpload: function(e, player, saveConfiguration) {
            var files = e.target.files || e.dataTransfer.files
            if (files.length) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    player.image = e.target.result;
                    saveConfiguration();
                };
                reader.readAsDataURL(files[0]);
            }
        },
        togglePlayer: function(player) {
            if (player.status === "alive") {
                player.status = "dead";
                this.playKillAudio(player);
                console.debug(player.name + " has been eliminated");
            } else {
                player.status = "alive";
                this.playReviveAudio(player);
                console.debug(player.name + " has been brought back to life");
            }
            this.saveConfiguration();
        },
        playKillAudio: function(player) {
            var audio = null
            if (player.gender === "male") {
                audio = new Audio("audio/male.mp3");
            } else if (player.gender === "female") {
                audio = new Audio("audio/female.mp3");
            }
            audio.play();

            audio = new Audio("audio/shot.mp3");
            audio.play();
        },
        playReviveAudio: function(player) {
            var audio = null
            if (player.gender === "male") {
                audio = new Audio("audio/male-revive.mp3");
            } else if (player.gender === "female") {
                audio = new Audio("audio/female-revive.mp3");
            }
            audio.play();
        },
        saveConfiguration: function() {
            localStorage.setItem("configuration", JSON.stringify(this.players));
        },
        loadConfiguration: function() {
            this.players = JSON.parse(localStorage.getItem("configuration"));
        },
        addSuspense: function() {
            // Reset countdown counter to 5 seconds
            // This will trigger the "watch" for counter above, which will handle the player toggle
            this.counter = 5;
            this.chosen = "";
        },
        toggleConfiguration: function() {
            this.displayConfiguration = !this.displayConfiguration;
            console.debug(this.$refs.modal.listeners.scroll);
        },
        toggleTextbox: function() {
            this.displayTextbox = !this.displayTextbox;
        },
        validate: function() {
            this.validatedPlayer = null;
            this.players.forEach(player => {
                if (player.name.toLowerCase().replace(".", "").replace(" ", "") === this.chosen.toLowerCase().replace(".", "").replace(" ", "")) {
                    this.validatedPlayer = player;
                }
            });
        },
        checkScrollComplete: function(scrollTop, clientHeight, scrollHeight) {
            this.enableMask = (scrollTop + clientHeight < scrollHeight - 20);
        },
        onKeyUp: function() {
            this.validate();
        },
        onEnter: function() {
            if (this.validatedPlayer != null) {
                this.toggleTextbox();
                this.addSuspense();
            }
        },
        onScroll ({ target: { scrollTop, clientHeight, scrollHeight }}) {
            /*if (scrollTop + clientHeight >= scrollHeight) {
                this.disableMask = false;
            } else {
                this.disableMask = true;
            }*/
            this.checkScrollComplete(scrollTop, clientHeight, scrollHeight);
        }
    }
}).mount('#app')