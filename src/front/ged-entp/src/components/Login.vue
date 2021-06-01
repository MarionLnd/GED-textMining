<template>
	<div class="base">
		<div class="container">
			<!-- Button to Open the Modal -->
			<h3>GED</h3>
			<form>
				<label style="color: white">Identifiant</label>
				<input type="text" id="professor" v-model="usernameProf" class="form-control" />
				<label style="color: white">Mot de passe</label>
				<input type="password" v-model="passwordProf" class="form-control" />
				<button type="button" class="btn btn-primary" @click="submit()">
					Connexion
				</button>
			</form>
		</div>
	</div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins&display=swap");

.base {
	background-color: #adc5da;
}

@media (width: 1024px) {
	.modal-dialog {
		max-width: 70%;
	}
}

.modal-content {
	border-radius: 0.7rem;
}

.modal-header img {
	width: 100px;
}

.modal-title {
	margin-left: auto;
	margin-right: auto;
}

.modal-header {
	border-bottom: none;
	padding-bottom: 0;
	padding-top: 4vh;
	background-color: #c9893c;
	font-size: 2vw;
}

.modal-footer {
	border-top: none;
}

button:active {
	outline: none;
}

button:focus {
	outline: none;
}

.modal-body {
	text-align: center;
}

.title {
	font-size: 17px;
	color: grey;
}

@media (min-height: 768px) and(min-width:411px) {
	.title {
		font-size: 20px;
		color: grey;
	}
}

form {
	padding: 3vh;
}

input {
	outline: none;
	margin: 0;
	border: none;
	-webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
	width: 100%;
	font-size: 14px;
	font-family: inherit;
}

.input-group {
	position: relative;
	margin-bottom: 6vh;
	border-bottom: 1px solid rgba(204, 204, 204, 0.459);
}

.input--style-3 {
	font-size: 14px;
	color: rgb(143, 141, 141);
	background: transparent;
}

.input--style-3::-webkit-input-placeholder {
	color: rgb(143, 141, 141);
}

.input--style-3:-moz-placeholder {
	color: #ccc;
	opacity: 1;
}

.input--style-3::-moz-placeholder {
	color: #ccc;
	opacity: 1;
}

.input--style-3:-ms-input-placeholder {
	color: #ccc;
}

.btn {
	display: inline-block;
	line-height: 42px;
	/*padding: 0 33px;*/
	font-family: Poppins, serif;
	cursor: pointer;
	color: #fff;
	-webkit-transition: all 0.4s ease;
	-o-transition: all 0.4s ease;
	-moz-transition: all 0.4s ease;
	transition: all 0.4s ease;
	font-size: 18px;
	width: 100%;
}

.btn--pill {
	-webkit-border-radius: 20px;
	-moz-border-radius: 20px;
	border-radius: 30px;
	border: 2px solid;
}

.btn--green {
	background: transparent;
	border-color: #65d849;
	color: #65d849;
	font-size: 12px;
	padding: 0;
}

@media (max-width: 768px) {
	.btn--green {
		font-size: 8px;
	}
}

.btn--green img {
	height: 15px;
	width: 15px;
}

.btn--signin {
	background: #ccc;
	color: rgb(109, 107, 107);
	font-size: 13px;
	border-color: #ccc;
	margin-bottom: 3vh;
}

.extra {
	padding-bottom: 4vh;
	color: rgb(143, 141, 141);
	font-size: 13px;
}

.extra a {
	color: rgb(143, 141, 141);
	font-size: 13px;
}

.col {
	padding: 2vh 10px 4vh;
}

.new {
	padding-bottom: 0;
}

.btn-primary {
	width: 40%;
	margin: 5% 3%;
	background-color: #0b4072;
}

.btn-primary:hover {
	background-color: #5489eb;
}

.btn:focus {
	box-shadow: none;
	outline: none;
}

.container {
	background-color: #4a7ca5;
	padding-top: 10%;
	padding-bottom: 10%;
	border-radius: 20px;
	box-shadow: 3px 3px 10px 5px #000;
	width: 50%;
}

h1,
h2,
h3 {
	color: white;
	/*border: 2px solid red;*/
}

a:link,
a:visited,
a:hover,
a:active {
	text-decoration: none;
	color: white;
}

.visiteur {
	border: 2px solid transparent;
	padding-bottom: 1.5%;
}
</style>

<script>
import axios from "axios";

export default {
	name: "login",
	data() {
		return {
			page: [],
			usernameProf: "",
			passwordProf: "",
			users: [],
			actions: [],
		};
	},
	created() {
		axios
			.get("http://localhost:30001/users")
			.then((response) => {
				response.data.forEach((user) => {
					this.users.push(user);
				});
			})
			.catch((err) => console.error(`Error in getting users : ${err}`));
		axios
			.get("http://localhost:30001/action")
			.then((response) => {
				response.data.forEach((action) => {
					this.actions.push(action);
				});
			})
			.catch((err) => console.error(`Error in getting actions : ${err}`));
	},
	mounted() {
		let externalScript = document.createElement("script");
		externalScript.setAttribute("src", "https://code.jquery.com/jquery-3.2.1.slim.min.js");
		externalScript.setAttribute("src", "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js");
		document.head.appendChild(externalScript);
	},
	methods: {
		setCookie() {
			this.$router.push("/folder");
		},
		submit() {
			if (this.usernameProf != "" && this.passwordProf != "") {
				this.users.forEach((user) => {
					if (this.usernameProf === user.login && this.passwordProf === user.password && user.is_active === 1) {
						console.log("first condition");
						this.actions.forEach((act) => {
							if (user.id_action === act.id_action) {
								console.log("second condition");
								if (act.can_update === 1 && act.can_delete === 1) {
									console.log("all");
									this.$cookies.set("privileges", "all");
								}
								if (act.can_update === 1 && act.can_delete === 0) {
									console.log("update");
									this.$cookies.set("privileges", "update");
								}
								if (act.can_update === 0 && act.can_delete === 0) {
									console.log("read");
									this.$cookies.set("privileges", "read");
								}
							}
						});
						this.$router.push("/folder");
					}
				});
				/*axios.get("http://localhost:30001/users").then((response) => {
					response.data.forEach((user) => {
						if (this.usernameProf === user.login && this.passwordProf === user.password && user.is_active === 1) {
							console.log("first condition");
							axios.get("http://localhost:30001/action").then((action) => {
								action.data.forEach((act) => {
									if (user.id_action === act.id_action) {
										console.log("second condition");
										if (act.can_update === 1 && act.can_delete === 1) {
											console.log("all");
											this.$cookies.set("privileges", "all");
										}
										if (act.can_update === 1 && act.can_delete === 0) {
											console.log("update");
											this.$cookies.set("privileges", "update");
										}
										if (act.can_update === 0 && act.can_delete === 0) {
											console.log("read");
											this.$cookies.set("privileges", "read");
										}
									}
								});
							});

							this.$router.push("/folder");
						}
					});
				});*/
			}
		},
	},
};
</script>
