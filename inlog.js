const users = [
    { username: "Tom Stommels", password: "Toveren1!" },
    { username: "Ike Marcus", password: "Toveren1!" }
];

const app = Vue.createApp({
    data() {
        return {
            username: "",
            password: "",
            loginError: false
        };
    },
    methods: {
        login() {
            const { username, password } = this;
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                window.location.href = "page.html"; 
            } else {
                this.loginError = true;
            }
        }
    }
});

app.mount('.login-container');