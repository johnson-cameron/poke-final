"use strict";

const quiz = {
  template: `
  <div class="slide quiz animated" ng-class="$ctrl.bounce" id="slideItem" ng-swipe-left="$ctrl.swipeLeft()" ng-swipe-right="$ctrl.swipeRight()">
    <img src="../../styles/lab-ready-grant.png" ng-show="$ctrl.hide" class="grant">
    <form ng-show="$ctrl.hide" ng-submit="$ctrl.addUser($ctrl.newUser)">
    <img src="../../styles/full-logo.png" class="logo">
    <p class="pokeBox textContainer">We're about to find the first member of your squad, but I'll need to ask you some questions to find your perfect match!</p>
      <h3>Enter a Trainer name..</h3>
      <input class="trainer-name" type="text" placeholder="Ash Ketchum" ng-blur="$ctrl.checkUsername($ctrl.newUser.username);" ng-model="$ctrl.newUser.username" maxlength="10">
      <h3>Enter your Birth Month</h3>

      <div>
        <select id='gMonth2' ng-model="$ctrl.newUser.dob">
          <option value='' disabled>--Select Month--</option>
          <option value='1'>Janaury</option>
          <option value='2'>February</option>
          <option value='3'>March</option>
          <option value='4'>April</option>
          <option value='5'>May</option>
          <option value='6'>June</option>
          <option value='7'>July</option>
          <option value='8'>August</option>
          <option value='9'>September</option>
          <option value='10'>October</option>
          <option value='11'>November</option>
          <option value='12'>December</option>
        </select> 
      </div>
      <button class="animated pulse" ng-disabled="$ctrl.disabled">Submit</button>
    </form>
    <form ng-show="$ctrl.show" class="multichoice animated"  name="questionForm" ng-submit="$ctrl.submitData($ctrl.answers)"> <!-- submit the checked answers -->
      <img class="start-logo" src="styles/logo-400.png" alt="PokeSquad logo">
      <h3> {{ $ctrl.quizarr[$ctrl.counter].question }}</h3>
      <div class="answers">
        <label>
        <input type="radio" ng-model="$ctrl.answers" ng-value="$ctrl.quizarr[$ctrl.counter].answer_1_value" name="{{$ctrl.quizarr[$ctrl.counter].id}}" clicked> {{$ctrl.quizarr[$ctrl.counter].answer_1}}
        <span class="radio"></span>
        </label>
        <label>
        <input type="radio" ng-model="$ctrl.answers" ng-value="$ctrl.quizarr[$ctrl.counter].answer_2_value" name="{{$ctrl.quizarr[$ctrl.counter].id}}"> {{$ctrl.quizarr[$ctrl.counter].answer_2}}
        <span class="radio"></span>
        </label>
        <label>
        <input type="radio" ng-model="$ctrl.answers" ng-value="$ctrl.quizarr[$ctrl.counter].answer_3_value" name="{{$ctrl.quizarr[$ctrl.counter].id}}"> {{$ctrl.quizarr[$ctrl.counter].answer_3}}
        <span class="radio"></span>
        </label>
        <label>
        <input type="radio" ng-model="$ctrl.answers" ng-value="$ctrl.quizarr[$ctrl.counter].answer_4_value" name="{{$ctrl.quizarr[$ctrl.counter].id}}"> {{$ctrl.quizarr[$ctrl.counter].answer_4}}
        <span class="radio"></span>
        </label>
      </div>

      
     </section>
      <button class="animated pulse">Submit</button>
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{{$ctrl.randomPkmn}}.png" ng-show="$ctrl.show" class="poke-guy">
    </form>
  </div>
  `,

  controller: ["dbService", "quizService", "TrainerService", "PokemonService", "$location", "$element", "$timeout", function(dbService, quizService, TrainerService, PokemonService, $location, $element, $timeout) {
    const vm = this;
    vm.quizarr = [];
    vm.counter = 0;
    vm.answersRCool = [];
    vm.answers="";
    vm.show = false;
    vm.hide = true;
    vm.kind = 0;
    vm.char = 0;
    vm.orig = 0;
    vm.cool = 0;
    vm.adv = 0;
    vm.username = "";
    vm.dob = "";
    vm.trainer = {};
    vm.allTrainers = [];
    vm.disabled = false;
    vm.pokearr = [];
    vm.randomPkmn = 0;
    vm.bounce = "";
    vm.trainer = {}
    // vm.invalid = "";

    dbService.getData().then((response) => {
      vm.pokearr = response.data;
      PokemonService.addPokemon(vm.pokearr);
    }).then(() => {
    TrainerService.getTrainers().then((response) => {
      vm.alltrainers = response.data;
      vm.trainer=null;
      vm.trainer=PokemonService.getTrainer();
      // if(vm.trainer=== null){
      //     vm.trainer = vm.alltrainers[vm.alltrainers.length-1];
      //     PokemonService.addTrainer(vm.trainer);
      // }else{
      //     vm.trainer=PokemonService.getTrainer();
      // }
    // vm.myType = vm.pokearr[vm.trainer.pokemon_1 - 1].type;
  })
  });

    PokemonService.addTrainer(null);
    
    quizService.getQuiz().then((response) => {
      vm.quizarr = response.data;
    });

    TrainerService.getTrainers().then((response) => {
      vm.allTrainers = response.data;
    });

    vm.pokearr = PokemonService.getPokemon();

    // checks window width on load to possibly remove class slide
    // if (window.innerWidth >= 768) {
    //   $("#slideItem").removeClass("slide");
    // }

    // swipe right and left directive function
    
    vm.swipeRight = () => {
      if($("#slideItem").hasClass("slide") == true){
        if(vm.username == ""){
          vm.addUser(vm.newUser);
        }
        if(vm.username !== ""){
          vm.submitData();
        };
      } 
    };
    vm.swipeLeft = () => {
      if($("#slideItem").hasClass("slide") == true){
        vm.submitData();
      }
      if(vm.username !== ""){
        vm.submitData();
      };
    }
    // end swipe directive functions

    vm.reset = () => {
      
      vm.bounce = "";
    }

    vm.addUser = (newUser) => {
      vm.username = newUser.username;
      vm.dob = newUser.dob;
      vm.show = true;
      vm.hide = false;
      vm.randomPkmn = vm.pokearr[Math.floor(Math.random() * vm.pokearr.length)].id;
      vm.bounce = "bounceInRight";
      $timeout(vm.reset, 1000);
    }

    vm.checkUsername = (username) => {
      for (let i = 0; i < vm.allTrainers.length; i++) {
        if (vm.allTrainers[i].username.toLowerCase() == vm.newUser.username.toLowerCase()) {
          alert("Choose another Trainer name");
          vm.disabled=true;
          break;
          // change border of input to red & make submit button not clickable
        } else {
          console.log("valid username");
          vm.disabled=false;
        }
      }
    }

    vm.submitData = () => {
      vm.randomPkmn = vm.pokearr[Math.floor(Math.random() * vm.pokearr.length)].id;
      vm.bounce = "bounceInRight";
      $timeout(vm.reset, 1000);

      vm.counter++
      switch(vm.answers){
        case "cool":
        vm.cool++;
        break;
        case "kind":
        vm.kind++;
        break;
        case "adventurous":
        vm.adv++;
        break;
        case "charismatic":
        vm.char++;
        break;
        case "original":
        vm.orig++;
        break;
      }
      vm.answers = "";

      if(vm.counter>=10){
        if(vm.cool > vm.adv && vm.cool > vm.char && vm.cool > vm.orig && vm.cool > vm.kind){
          vm.trainer = {
            username: vm.newUser.username,
            quiz_result: "cool",
            pokemon_1: 7,
            pokemon_2:null,
            pokemon_3:null,
            pokemon_4:null,
            pokemon_5:null,  
            pokemon_6:null
          }
          PokemonService.addTrainer(vm.trainer);
          TrainerService.addUser(vm.trainer);
          vm.counter = 0;
          $location.path('/pokedex');
        } else if(vm.adv > vm.cool && vm.adv > vm.char && vm.adv > vm.orig && vm.adv > vm.kind){
          vm.trainer = {
            username: vm.newUser.username,
            quiz_result: "adventurous",
            pokemon_1: 4,
            pokemon_2:null,
            pokemon_3:null,
            pokemon_4:null,
            pokemon_5:null,  
            pokemon_6:null
          }
          PokemonService.addTrainer(vm.trainer);
          TrainerService.addUser(vm.trainer);
          vm.counter = 0;
          $location.path('/pokedex');
        } else if(vm.char > vm.adv && vm.char > vm.cool && vm.char > vm.orig && vm.char > vm.kind){
          vm.trainer = {
            username: vm.newUser.username,
            quiz_result: "charismatic",
            pokemon_1: 25,
            pokemon_2:null,
            pokemon_3:null,
            pokemon_4:null,
            pokemon_5:null,  
            pokemon_6:null
          }
          PokemonService.addTrainer(vm.trainer);
          TrainerService.addUser(vm.trainer);
          vm.counter = 0;
          $location.path('/pokedex');
        } else if(vm.orig > vm.adv && vm.orig > vm.char && vm.orig > vm.cool && vm.orig > vm.kind){
          vm.trainer = {
            username: vm.newUser.username,
            quiz_result: "original",
            pokemon_1: 151,
            pokemon_2:null,
            pokemon_3:null,
            pokemon_4:null,
            pokemon_5:null,  
            pokemon_6:null  
          }
          PokemonService.addTrainer(vm.trainer);
          TrainerService.addUser(vm.trainer);
          vm.counter = 0;
          $location.path('/pokedex');
        } else if(vm.kind > vm.adv && vm.kind > vm.char && vm.kind > vm.orig && vm.kind > vm.cool){
          vm.trainer = {
            username: vm.newUser.username,
            quiz_result: "kind",
            pokemon_1: 1,
            pokemon_2:null,
            pokemon_3:null,
            pokemon_4:null,
            pokemon_5:null,  
            pokemon_6:null
          }
          PokemonService.addTrainer(vm.trainer);
          TrainerService.addUser(vm.trainer);
          vm.counter = 0;
          $location.path('/pokedex');
        } else{
            if(vm.dob==1 || vm.dob==2 ||vm.dob==3){
              vm.kind++;
              vm.trainer = {
                username: vm.newUser.username,
                quiz_result: "kind",
                pokemon_1: 1,
                pokemon_2:null,
                pokemon_3:null,
                pokemon_4:null,
                pokemon_5:null,  
                pokemon_6:null
              }
              PokemonService.addTrainer(vm.trainer);
              TrainerService.addUser(vm.trainer);
              vm.counter = 0;
              $location.path('/pokedex');
            } else if(vm.dob==4 || vm.dob==5 ||vm.dob==6){
              vm.adv++;
              vm.trainer = {
                username: vm.newUser.username,
                quiz_result: "adventurous",
                pokemon_1: 4,
                pokemon_2:null,
                pokemon_3:null,
                pokemon_4:null,
                pokemon_5:null,  
                pokemon_6:null
              }
              PokemonService.addTrainer(vm.trainer);
              TrainerService.addUser(vm.trainer);
              vm.counter = 0;
              $location.path('/pokedex');
            } else if(vm.dob==7 || vm.dob==8 ||vm.dob==9){
              vm.char++;
              vm.trainer = {
                username: vm.newUser.username,
                quiz_result: "charismatic",
                pokemon_1: 25,
                pokemon_2:null,
                pokemon_3:null,
                pokemon_4:null,
                pokemon_5:null,  
                pokemon_6:null 
              }
              PokemonService.addTrainer(vm.trainer);
              TrainerService.addUser(vm.trainer);
              vm.counter = 0;
              $location.path('/pokedex');
            } else if(vm.dob==10 || vm.dob==11 ||vm.dob==12){
              vm.cool++;
              vm.trainer = {
                username: vm.newUser.username,
                quiz_result: "cool",
                pokemon_1: 7,
                pokemon_2:null,
                pokemon_3:null,
                pokemon_4:null,
                pokemon_5:null,  
                pokemon_6:null
              }
              PokemonService.addTrainer(vm.trainer);
              TrainerService.addUser(vm.trainer);
              vm.counter = 0;
              $location.path('/pokedex');
            };
        };
      }
    }
  }]
}

angular
  .module("App")
  .component("quiz", quiz);