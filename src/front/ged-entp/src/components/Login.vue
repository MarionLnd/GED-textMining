<template>
<div class="base" >
  <div class="container">
    
    <!-- Button to Open the Modal -->
    <h1>GED</h1>
   
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal"> Connexion </button> <!-- The Modal -->
    <!--button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal2"> Inscription </button> <The Modal -->
    <!--<div class="visiteur"> <a href="/professors" class="linkVisiteur">Liste des professeurs</a> </div>
    <div class="visiteur"> <a href="/branch" class="linkVisiteur">Liste des enseignements</a> </div>
    <div class="visiteur"> <a href="#" class="linkVisiteur">Liste des enseignements non couverts</a> </div>-->
    <div class="modal fade" id="myModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-title"><p>Ged</p></div>
          </div> <!-- Modal body --> 
          <div class="modal-body">
            <p class="title"> Connexion </p>
            <form>
              <div class="input-group"> <input class="input--style-3" type="text" placeholder="Login*" name="email" > </div>
              <div class="input-group"> <input class="input--style-3" type="password" placeholder="Password*" name="password" > </div>
            
              <div class="p-t-10"><button class="btn btn--pill btn--signin" @click="setCookie()" >CONNEXION</button></div>
            </form>
          </div>
        </div>
      </div>
    </div>
   
  </div>
  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');

.base{
  background-color:  #adc5da;
}

@media(width:1024px) {
  .modal-dialog {
    max-width: 70%
  }
}

.modal-content {
  border-radius: 0.7rem
}

.modal-header img {
  width: 100px
}

.modal-title {
  margin-left: auto;
  margin-right: auto
}

.modal-header {
  border-bottom: none;
  padding-bottom: 0;
  padding-top: 4vh;
  background-color: #C9893C;
  font-size: 2vw;

}

.modal-footer {
  border-top: none
}


button:active {
  outline: none
}

button:focus {
  outline: none
}

.modal-body {
  text-align: center
}

.title {
  font-size: 17px;
  color: grey
}

@media(min-height:768px)and(min-width:411px) {
  .title {
    font-size: 20px;
    color: grey
  }
}

form {
  padding: 3vh
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
  font-family: inherit
}

.input-group {
  position: relative;
  margin-bottom: 6vh;
  border-bottom: 1px solid rgba(204, 204, 204, 0.459)
}

.input--style-3 {
  font-size: 14px;
  color: rgb(143, 141, 141);
  background: transparent
}

.input--style-3::-webkit-input-placeholder {
  color: rgb(143, 141, 141)
}

.input--style-3:-moz-placeholder {
  color: #ccc;
  opacity: 1
}

.input--style-3::-moz-placeholder {
  color: #ccc;
  opacity: 1
}

.input--style-3:-ms-input-placeholder {
  color: #ccc
}

.btn {
  display: inline-block;
  line-height: 42px;
  /*padding: 0 33px;*/
  font-family: Poppins,serif;
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
  border: 2px solid
}

.btn--green {
  background: transparent;
  border-color: #65d849;
  color: #65d849;
  font-size: 12px;
  padding: 0
}

@media(max-width:768px) {
  .btn--green {
    font-size: 8px
  }
}

.btn--green img {
  height: 15px;
  width: 15px
}

.btn--signin {
  background: #ccc;
  color: rgb(109, 107, 107);
  font-size: 13px;
  border-color: #ccc;
  margin-bottom: 3vh
}

.extra {
  padding-bottom: 4vh;
  color: rgb(143, 141, 141);
  font-size: 13px
}

.extra a {
  color: rgb(143, 141, 141);
  font-size: 13px
}

.col {
  padding: 2vh 10px 4vh
}

.new {
  padding-bottom: 0
}

.btn-primary {
  width: 40%;
  margin: 5% 3%;
  background-color: #0b4072;
}

.btn-primary:hover{
  background-color: #5489eb;
}

.btn:focus {
  box-shadow: none;
  outline: none
}

.container{
  background-color: #4a7ca5;
  padding-top: 10%;
  padding-bottom: 10%;
  border-radius: 20px;
  box-shadow: 3px 3px 10px 5px #000;
  width: 50%;
}

h1,h2,h3{
  color: white;
  /*border: 2px solid red;*/
}


a:link, a:visited, a:hover, a:active{
  text-decoration: none;
  color: white;
}

.visiteur{
  border: 2px solid transparent;
  padding-bottom: 1.5%;
}
</style>

<script>

export default {
  name: "login",
  

  
  methods: {
    setCookie() {
    
      this.$router.push("/folders");
    },
  
  },
};
</script>